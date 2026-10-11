import * as THREE from 'three';

/**
 * ===================================================== MOLDURAS DE FACHADA
 *
 * Cornija, faixa entre andares, rodapé e capeamento de platibanda: as linhas
 * que contornam um prédio inteiro. Feitas de caixa, elas eram um degrau
 * reto e mais nada; aqui elas têm PERFIL — o pingadeiro, o filete, o
 * cavetinho da cornija — e é a luz do toon caindo em cada inclinação do
 * perfil que desenha a moldura.
 *
 * O PERFIL é uma lista de pontos `[saída, y]`: quanto o ponto avança para
 * fora da face da parede, e em que altura. Ele vai DE BAIXO PARA CIMA, com a
 * massa do lado da parede. Saída negativa entra na parede — é assim que o
 * capeamento da platibanda dá a volta por cima e desce do lado de dentro.
 *
 * A QUINA É EM MEIA-ESQUADRIA DE GRAÇA: cada ponto do perfil vira os quatro
 * cantos de um retângulo crescido de `saída`, e o fim de um lado é o começo
 * do outro. Nenhuma ponta sobra, nenhuma face encosta na do vizinho (que é a
 * briga de z-fighting das tiras de caixa coladas nas quinas).
 *
 * A NORMAL SEGUE A CURVA: entre dois trechos do perfil quase alinhados (menos
 * de 40°) ela é a média dos dois, e o cavetinho sai degradê; num ângulo
 * maior a aresta fica viva. O toon transforma isso nos degraus de luz que
 * são a cara do jogo.
 *
 * `vaos` corta a frente (`+z`) ou o fundo (`-z`) nos intervalos de `x`
 * pedidos — a porta, por onde o rodapé não passa —, e fecha cada ponta
 * cortada com o próprio perfil.
 */
export type Perfil = ReadonlyArray<readonly [number, number]>;

export interface Vao {
  /** o lado cortado: a frente (`+z`) ou o fundo (`-z`) */
  lado: 'frente' | 'fundo';
  /** o intervalo de `x` da peça em que a moldura não passa */
  de: number;
  ate: number;
}

interface Lado {
  /** o ponto do lado, para a saída `o`, a altura `y` e o avanço `t` (0 a 1) */
  ponto: (o: number, y: number, t: number) => THREE.Vector3;
  /** a direção para fora, deitada */
  fora: THREE.Vector3;
  /** a coordenada que corre ao longo do lado (para o UV) */
  ao: (p: THREE.Vector3) => number;
}

export function contorno(perfil: Perfil, hx: number, hz: number, vaos: readonly Vao[] = []): THREE.BufferGeometry {
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];

  const lados: Lado[] = [
    { // frente, +z, correndo em +x
      ponto: (o, y, t) => new THREE.Vector3(THREE.MathUtils.lerp(-(hx + o), hx + o, t), y, hz + o),
      fora: new THREE.Vector3(0, 0, 1), ao: (p) => p.x,
    },
    { // direita, +x, correndo em -z
      ponto: (o, y, t) => new THREE.Vector3(hx + o, y, THREE.MathUtils.lerp(hz + o, -(hz + o), t)),
      fora: new THREE.Vector3(1, 0, 0), ao: (p) => p.z,
    },
    { // fundo, -z, correndo em -x
      ponto: (o, y, t) => new THREE.Vector3(THREE.MathUtils.lerp(hx + o, -(hx + o), t), y, -(hz + o)),
      fora: new THREE.Vector3(0, 0, -1), ao: (p) => p.x,
    },
    { // esquerda, -x, correndo em +z
      ponto: (o, y, t) => new THREE.Vector3(-(hx + o), y, THREE.MathUtils.lerp(-(hz + o), hz + o, t)),
      fora: new THREE.Vector3(-1, 0, 0), ao: (p) => p.z,
    },
  ];

  // a normal de cada trecho do perfil, no plano (saída, y)
  const normais2d = perfil.slice(0, -1).map(([o0, y0], i) => {
    const [o1, y1] = perfil[i + 1];
    const v = new THREE.Vector2(y1 - y0, -(o1 - o0));
    return v.normalize();
  });
  /** a normal do canto `ponta` (0 ou 1) do trecho `k`: média com o vizinho, se a curva for suave */
  const normalNoCanto = (k: number, ponta: 0 | 1): THREE.Vector2 => {
    const propria = normais2d[k];
    const vizinho = normais2d[ponta === 0 ? k - 1 : k + 1];
    if (!vizinho || propria.dot(vizinho) < Math.cos(THREE.MathUtils.degToRad(40))) return propria;
    return propria.clone().add(vizinho).normalize();
  };

  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3,
    na: THREE.Vector3, nb: THREE.Vector3, nc: THREE.Vector3, ao: (p: THREE.Vector3) => number): void => {
    // o giro do triângulo tem que bater com a normal, senão a face some
    const face = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const media = na.clone().add(nb).add(nc);
    const vira = face.dot(media) < 0;
    const ordem = vira ? [[a, na], [c, nc], [b, nb]] as const : [[a, na], [b, nb], [c, nc]] as const;
    const deitada = Math.abs(media.y) > 0.7 * media.length();
    for (const [p, n] of ordem) {
      pos.push(p.x, p.y, p.z);
      nor.push(n.x, n.y, n.z);
      // em pé: (ao longo, altura); deitada: (ao longo, a outra coordenada)
      uv.push(ao(p), deitada ? (Math.abs(p.x) > Math.abs(p.z) ? p.x : p.z) : p.y);
    }
  };

  lados.forEach((lado, indice) => {
    // os trechos do lado, no sentido em que ele corre (a frente e o fundo podem ter vãos)
    const nome = indice === 0 ? 'frente' : indice === 2 ? 'fundo' : null;
    const sentido = indice === 0 ? 1 : -1;
    const meus = vaos
      .filter((v) => v.lado === nome)
      .map((v) => (sentido > 0 ? [v.de, v.ate] : [v.ate, v.de]) as [number, number])
      .sort((a, b) => (a[0] - b[0]) * sentido);
    const trechos: Array<[number | null, number | null]> = [];
    let inicio: number | null = null;
    for (const [entra, sai] of meus) {
      trechos.push([inicio, entra]);
      inicio = sai;
    }
    trechos.push([inicio, null]);
    const zDoLado = (o: number): number => (indice === 0 ? hz + o : -(hz + o));

    for (const [x0, x1] of trechos) {
      /** o ponto na saída `o`: as pontas sem vão são a meia-esquadria; as com vão, um x fixo */
      const ponta = (o: number, y: number, fim: 0 | 1): THREE.Vector3 => {
        const corte = fim === 0 ? x0 : x1;
        if (corte === null) return lado.ponto(o, y, fim);
        return new THREE.Vector3(corte, y, zDoLado(o));
      };
      for (let k = 0; k < perfil.length - 1; k++) {
        const [o0, y0] = perfil[k];
        const [o1, y1] = perfil[k + 1];
        const a = ponta(o0, y0, 0);
        const b = ponta(o0, y0, 1);
        const c = ponta(o1, y1, 1);
        const d = ponta(o1, y1, 0);
        const n0 = normalNoCanto(k, 0);
        const n1 = normalNoCanto(k, 1);
        const na = lado.fora.clone().multiplyScalar(n0.x).setY(n0.y);
        const nd = lado.fora.clone().multiplyScalar(n1.x).setY(n1.y);
        tri(a, b, c, na, na, nd, lado.ao);
        tri(a, c, d, na, nd, nd, lado.ao);
      }
      // a tampa de cada ponta cortada: o próprio perfil, fechado contra a parede
      // a tampa do começo olha para trás no sentido do lado, a do fim para a frente
      for (const [corte, rumo] of [[x0, -sentido], [x1, sentido]] as const) {
        if (corte === null) continue;
        const contornoDaTampa = perfil.map(([o, y]) => new THREE.Vector2(o, y));
        const triangulos = THREE.ShapeUtils.triangulateShape(contornoDaTampa, []);
        const n = new THREE.Vector3(rumo, 0, 0);
        for (const [i, j, l] of triangulos) {
          const p = (q: number): THREE.Vector3 => new THREE.Vector3(corte, perfil[q][1], zDoLado(perfil[q][0]));
          tri(p(i), p(j), p(l), n, n, n, (q) => q.z);
        }
      }
    }
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return geo;
}

/**
 * Um cavetinho (quarto de círculo côncavo) de `de` até `ate`, como trecho de
 * perfil: a curva que dá a cara de cornija. `n` pontos, sem o primeiro.
 */
export function cavetinho(de: readonly [number, number], ate: readonly [number, number], n = 4): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 1; i <= n; i++) {
    const a = (i / n) * (Math.PI / 2);
    // côncavo: sai devagar e sobe rápido no começo, e o contrário no fim
    const o = de[0] + (ate[0] - de[0]) * (1 - Math.cos(a));
    const y = de[1] + (ate[1] - de[1]) * Math.sin(a);
    pts.push([o, y]);
  }
  return pts;
}
