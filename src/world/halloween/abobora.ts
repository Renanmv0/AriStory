import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { PALETTE as P } from '../../palette';
import { acesoPorVertice, brilhoEmLote, luzNoChao, toon } from '../../core/materials';

/*
 * A ABÓBORA ESCULPIDA do Halloween (`docs/HALLOWEEN.md`, §4.1): a peça que
 * mais se repete no parque enfeitado.
 *
 * O QUE FAZ ELA SER LIDA COMO ABÓBORA, e não como uma bola laranja:
 *
 * 1. OS GOMOS. Oito costelas de cima a baixo, com o sulco FUNDO e estreito
 *    entre elas (o sulco é uma potência do cosseno, não o cosseno: assim a
 *    costela é gorda e o sulco é um vinco). O sulco é também mais escuro,
 *    pintado nos vértices — sai de graça, sem um triângulo a mais;
 * 2. O ACHATADO E A COVA. Ela é mais larga que alta, e o topo AFUNDA em volta
 *    do cabinho (o fundo também, um pouco);
 * 3. O CABINHO torcido e curvado, a FOLHA e a GAVINHA em espiral. É o que dá
 *    o "fofo" de desenho.
 *
 * A CARA é um recorte FUNDO: a beira clara da polpa (a parede da abóbora
 * vista no corte) e o escuro de dentro, colados na casca e seguindo os gomos
 * (a forma é subdividida e cada vértice vai para a superfície). A cara mora
 * numa malha À PARTE porque é ela que acende de noite (etapa 4).
 *
 * TUDO EM LOTE (`LoteDeAboboras`): o parque inteiro tem umas cem abóboras, e
 * cada parte (a casca de cada tamanho, os cabinhos, as folhas, as gavinhas e
 * cada cara) é UM `InstancedMesh`. A geometria é de uma abóbora de RAIO 1, e a
 * cópia escala.
 */

export type CaraDeAbobora = 'sorriso' | 'susto' | 'piscando' | 'dentinho';
export type TamanhoDeAbobora = 'grande' | 'media' | 'pequena';

/** o raio de cada tamanho, e quantos gomos de volta e de altura a casca tem */
export const ABOBORA: Record<TamanhoDeAbobora, { raio: number; volta: number; altura: number }> = {
  grande: { raio: 0.34, volta: 48, altura: 16 },
  media: { raio: 0.24, volta: 32, altura: 13 },
  pequena: { raio: 0.15, volta: 32, altura: 10 },
};

export const CARAS: readonly CaraDeAbobora[] = ['sorriso', 'susto', 'piscando', 'dentinho'];

/*
 * A volta da casca é sempre múltipla de 16 (o dobro dos gomos): assim cai um
 * vértice bem no fundo de cada vinco e outro no alto de cada costela, e o
 * gomo sai igual em toda abóbora, de qualquer tamanho.
 */

/** quantas costelas */
const GOMOS = 8;
/** a altura de uma abóbora de raio 1 (ela é achatada) */
const ACHATADO = 0.76;

/** o sulco (0 na costela, 1 no vinco) no ângulo `t` (0 = a frente, `+Z`) */
function sulco(t: number): number {
  return Math.pow(0.5 - 0.5 * Math.cos(GOMOS * t), 3);
}

/**
 * O ponto da casca na direção `d` (unitária), numa abóbora de raio 1 com o
 * centro na origem. É a mesma conta da casca e da cara.
 */
function naCasca(d: THREE.Vector3, alvo = new THREE.Vector3()): THREE.Vector3 {
  const t = Math.atan2(d.x, d.z);
  const lat = Math.sqrt(Math.max(0, 1 - d.y * d.y));
  // o vinco some perto dos polos (lá as costelas se juntam no cabinho)
  const r = 1 - 0.13 * sulco(t) * Math.sqrt(lat);
  const cima = Math.max(d.y, 0);
  const baixo = Math.max(-d.y, 0);
  const y = ACHATADO * d.y - 0.2 * Math.pow(cima, 8) + 0.1 * Math.pow(baixo, 8);
  return alvo.set(d.x * r, y * r, d.z * r);
}

/** a altura do fundo (o ponto mais baixo) e do topo da cova, com o centro na origem */
const FUNDO = (() => {
  let min = 0;
  for (let i = 0; i <= 40; i++) {
    const a = -Math.PI / 2 + (i / 40) * 0.7;
    const p = naCasca(new THREE.Vector3(0, Math.sin(a), Math.cos(a)));
    min = Math.min(min, p.y);
  }
  return min;
})();
const TOPO = naCasca(new THREE.Vector3(0, 1, 0)).y;

/** a casca: a esfera levada à superfície dos gomos, base em y = 0, cor nos vértices */
function geoCasca(volta: number, altura: number): THREE.BufferGeometry {
  const esfera = new THREE.SphereGeometry(1, volta, altura);
  esfera.deleteAttribute('uv');
  esfera.deleteAttribute('normal');
  const geo = mergeVertices(esfera);
  const pos = geo.getAttribute('position');
  const cor = new Float32Array(pos.count * 3);
  const d = new THREE.Vector3();
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    naCasca(d, p);
    pos.setXYZ(i, p.x, p.y - FUNDO, p.z);
    // o vinco mais escuro, o fundo na própria sombra e a cova um tico mais funda
    const t = Math.atan2(d.x, d.z);
    const lat = Math.sqrt(Math.max(0, 1 - d.y * d.y));
    let k = 1 - 0.34 * sulco(t) * Math.sqrt(lat);
    k *= 0.86 + 0.14 * THREE.MathUtils.smoothstep(d.y, -0.9, 0.2);
    if (d.y > 0.9) k *= 0.9;
    cor[i * 3] = k;
    cor[i * 3 + 1] = k;
    cor[i * 3 + 2] = k;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
  geo.computeVertexNormals();
  return geo;
}

/** o cabinho: um tronquinho de sete faces, afinando, torcido e curvado para o lado */
function geoCabinho(): THREE.BufferGeometry {
  const ALTO = 0.34;
  const geo = new THREE.CylinderGeometry(0.075, 0.12, ALTO, 7, 5);
  geo.translate(0, ALTO / 2, 0);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const t = y / ALTO;
    const giro = t * 0.9;
    const c = Math.cos(giro);
    const s = Math.sin(giro);
    // a ponta engrossa um pouco (o corte de onde saiu do pé) e dobra
    const engrossa = t > 0.85 ? 1.18 : 1;
    pos.setXYZ(i, (x * c - z * s) * engrossa + 0.16 * t * t, y, (x * s + z * c) * engrossa);
  }
  geo.computeVertexNormals();
  // nasce enterrado na cova
  geo.translate(0, TOPO - FUNDO - 0.06, 0);
  return geo;
}

/**
 * A FOLHA DE ABÓBORA: larga e de cinco lobos redondos (a de aboboreira não é
 * lança), em concha, dobrada na nervura do meio e caindo pela costela ao lado
 * do cabinho. Nasce com a base no zero e a ponta em `+Z`.
 */
function geoFolhaDaAbobora(): THREE.BufferGeometry {
  const contorno: THREE.Vector2[] = [];
  const N = 60;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    // cinco lobos na metade de cima, e a base recolhida no pecíolo
    const lobos = 0.8 + 0.2 * Math.abs(Math.cos((5 / 2) * (a - Math.PI / 2)));
    const base = 0.55 + 0.45 * THREE.MathUtils.smoothstep(Math.sin(a), -1, -0.2);
    const r = 0.5 * lobos * base;
    contorno.push(new THREE.Vector2(Math.cos(a) * r, 0.42 + Math.sin(a) * r));
  }
  const plano = new TessellateModifier(0.12, 4).modify(new THREE.ShapeGeometry(new THREE.Shape(contorno), 2));
  plano.deleteAttribute('uv');
  plano.deleteAttribute('normal');
  const pos = plano.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // o "y" da forma vira o comprimento (z); dobra na nervura e cai na ponta
    pos.setXYZ(i, x, 0.14 * Math.abs(x) - 0.22 * y * y, y);
  }
  plano.computeVertexNormals();
  plano.scale(0.62, 0.62, 0.62);
  plano.rotateY(1.9);
  plano.translate(0.06, TOPO - FUNDO + 0.06, -0.02);
  return plano;
}

/** a gavinha: um fio que sai do pé do cabinho e enrola em espiral */
function geoGavinha(): THREE.BufferGeometry {
  const pontos: THREE.Vector3[] = [];
  const N = 30;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const a = t * Math.PI * 5.2;
    const r = 0.16 * (1 - t * 0.75);
    // sai do cabinho para o lado e vai subindo em mola
    pontos.push(new THREE.Vector3(0.1 + 0.32 * t + Math.cos(a) * r, TOPO - FUNDO + 0.04 + 0.22 * t + Math.sin(a) * r * 0.6, 0.12 + Math.sin(a) * r * 0.5));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), 36, 0.012, 4, false);
}

// =================================================================== as caras

type Contorno = THREE.Vector2[];

/** um polígono de `n` pontos em volta de `(cx, cy)` */
function elipse(cx: number, cy: number, rx: number, ry: number, n = 16): Contorno {
  const p: Contorno = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.push(new THREE.Vector2(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry));
  }
  return p;
}

/** o olho triangular, de ponta para cima, com os cantos levemente arredondados */
function olhoTriangulo(cx: number, cy: number, l: number, inclina = 0): Contorno {
  const h = l * 0.9;
  const cantos = [
    new THREE.Vector2(cx - l / 2, cy - h / 3 + inclina),
    new THREE.Vector2(cx + l / 2, cy - h / 3 - inclina),
    new THREE.Vector2(cx, cy + (2 * h) / 3),
  ];
  // cada canto vira um arquinho de três pontos
  const p: Contorno = [];
  for (let i = 0; i < 3; i++) {
    const a = cantos[(i + 2) % 3];
    const b = cantos[i];
    const c = cantos[(i + 1) % 3];
    p.push(b.clone().lerp(a, 0.1), b.clone().lerp(a, 0.03).lerp(b.clone().lerp(c, 0.03), 0.5), b.clone().lerp(c, 0.1));
  }
  return p;
}

/**
 * A boca de meia-lua: a curva de baixo mais funda que a de cima, de canto a
 * canto. `dentes` são as posições (de -1 a 1) dos dentinhos que descem da
 * curva de cima (um entalhe quadrado).
 */
function bocaDeLua(cy: number, largura: number, funda: number, alta: number, dentes: number[] = [], torta = 0): Contorno {
  const p: Contorno = [];
  const N = 22;
  // a de baixo, da esquerda para a direita
  for (let i = 0; i <= N; i++) {
    const t = -1 + (2 * i) / N;
    p.push(new THREE.Vector2(t * largura / 2, cy - funda * (1 - t * t) + torta * t));
  }
  // a de cima, da direita para a esquerda, com os dentes (sem as pontas: elas
  // são as mesmas da de baixo, e ponto repetido estraga a beira)
  const DENTE = 0.09;
  for (let i = N - 1; i >= 1; i--) {
    const t = -1 + (2 * i) / N;
    let y = cy - alta * (1 - t * t) + torta * t;
    for (const d of dentes) if (Math.abs(t - d) < DENTE) y -= funda * 0.42 * (1 - t * t);
    p.push(new THREE.Vector2(t * largura / 2, y));
  }
  return p;
}

/** o olho fechado do piscando: um arquinho de cabeça para baixo, grosso */
function olhoFechado(cx: number, cy: number, l: number): Contorno {
  const p: Contorno = [];
  const N = 10;
  for (let i = 0; i <= N; i++) {
    const t = -1 + (2 * i) / N;
    p.push(new THREE.Vector2(cx + (t * l) / 2, cy + 0.06 * (1 - t * t)));
  }
  for (let i = N - 1; i >= 1; i--) {
    const t = -1 + (2 * i) / N;
    p.push(new THREE.Vector2(cx + (t * l) / 2, cy + 0.06 * (1 - t * t) - 0.045 * Math.sqrt(1 - t * t) - 0.01));
  }
  return p;
}

/** os furos de cada cara, numa abóbora de raio 1 vista de frente (x à direita, y para cima, 0 no meio) */
const DESENHOS: Record<CaraDeAbobora, () => Contorno[]> = {
  sorriso: () => [
    olhoTriangulo(-0.3, 0.14, 0.27),
    olhoTriangulo(0.3, 0.14, 0.27),
    olhoTriangulo(0, -0.02, 0.12),
    bocaDeLua(-0.12, 0.86, 0.3, 0.06, [-0.35, 0.35]),
  ],
  susto: () => [
    elipse(-0.29, 0.13, 0.12, 0.16),
    elipse(0.29, 0.13, 0.12, 0.16),
    elipse(0, -0.27, 0.13, 0.16),
  ],
  piscando: () => [
    olhoTriangulo(-0.3, 0.12, 0.27),
    olhoFechado(0.3, 0.16, 0.3),
    bocaDeLua(-0.15, 0.8, 0.27, 0.05, [0.25], 0.04),
  ],
  dentinho: () => [
    elipse(-0.28, 0.14, 0.11, 0.14, 14),
    elipse(0.28, 0.14, 0.11, 0.14, 14),
    bocaDeLua(-0.14, 0.72, 0.24, 0.04, [0]),
  ],
};

/** o contorno empurrado `d` para fora (a beira da polpa em volta do furo) */
function paraFora(p: Contorno, d: number): Contorno {
  // a orientação decide de que lado é "fora"
  let area = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    area += a.x * b.y - b.x * a.y;
  }
  const s = area > 0 ? 1 : -1;
  return p.map((b, i) => {
    const a = p[(i + p.length - 1) % p.length];
    const c = p[(i + 1) % p.length];
    const t = c.clone().sub(a).normalize();
    // a normal para fora de um contorno anti-horário é (t.y, -t.x)
    return new THREE.Vector2(b.x + t.y * d * s, b.y - t.x * d * s);
  });
}

/**
 * O ponto da casca FACETADA (a de `volta × altura` gomos) na direção `d`. A
 * casca é feita de triângulos, e dentro do vinco o triângulo passa POR FORA da
 * curva de verdade (é côncavo): a cara colada na curva sumia debaixo dele nos
 * olhos que caem num vinco. Por isso a cara é colada na casca de triângulos,
 * pela mesma grade da `SphereGeometry` (o ponto é a mistura dos quatro cantos
 * do quadradinho onde ele cai).
 */
function naCascaFacetada(d: THREE.Vector3, volta: number, altura: number, alvo: THREE.Vector3): THREE.Vector3 {
  // a grade da SphereGeometry: x = −cos(φ)·sen(θ), y = cos(θ), z = sen(φ)·sen(θ)
  const teta = Math.acos(THREE.MathUtils.clamp(d.y, -1, 1));
  let phi = Math.atan2(d.z, -d.x);
  if (phi < 0) phi += Math.PI * 2;
  const fx = (phi / (Math.PI * 2)) * volta;
  const fy = (teta / Math.PI) * altura;
  const ix = Math.floor(fx);
  const iy = Math.min(altura - 1, Math.floor(fy));
  const canto = (i: number, j: number): THREE.Vector3 => {
    const ph = (i / volta) * Math.PI * 2;
    const th = (j / altura) * Math.PI;
    return naCasca(new THREE.Vector3(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th)));
  };
  const u = fx - ix;
  const v = fy - iy;
  const a = canto(ix, iy).lerp(canto(ix + 1, iy), u);
  const b = canto(ix, iy + 1).lerp(canto(ix + 1, iy + 1), u);
  return alvo.copy(a.lerp(b, v));
}

/**
 * A malha de uma cara: a beira da polpa e o furo escuro, colados na casca. A
 * forma é subdividida (a casca é curva e um triângulo grande cortaria por
 * dentro dela) e cada vértice vai para a casca deste tamanho, um tico para
 * fora.
 */
function geoCara(cara: CaraDeAbobora, tamanho: TamanhoDeAbobora, acesa = false): THREE.BufferGeometry {
  const { volta, altura } = ABOBORA[tamanho];
  const camadas: Array<{ contornos: Contorno[]; fora: number; cor: number }> = [
    { contornos: DESENHOS[cara]().map((c) => paraFora(c, 0.03)), fora: 1.004, cor: acesa ? P.aboboraPolpaAcesa : P.aboboraPolpa },
    { contornos: DESENHOS[cara](), fora: 1.012, cor: acesa ? P.aboboraVela : P.aboboraOco },
  ];
  const posicoes: number[] = [];
  const cores: number[] = [];
  const corTmp = new THREE.Color();
  const d = new THREE.Vector3();
  const p = new THREE.Vector3();
  const tess = new TessellateModifier(0.07, 6);
  for (const camada of camadas) {
    corTmp.set(camada.cor);
    for (const c of camada.contornos) {
      const plano = tess.modify(new THREE.ShapeGeometry(new THREE.Shape(c), 1));
      const pos = plano.getAttribute('position');
      for (let i = 0; i < pos.count; i++) {
        // a cara de frente: (x, y) da arte é o ponto da casca visto de +Z
        const x = pos.getX(i);
        const y = pos.getY(i) / ACHATADO;
        d.set(x, y, Math.sqrt(Math.max(0.05, 1 - x * x - y * y))).normalize();
        naCascaFacetada(d, volta, altura, p).multiplyScalar(camada.fora);
        posicoes.push(p.x, p.y - FUNDO, p.z);
        cores.push(corTmp.r, corTmp.g, corTmp.b);
      }
      plano.dispose();
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));
  geo.computeVertexNormals();
  return geo;
}

// ====================================================================== o lote

/** as geometrias, feitas uma vez só para o jogo inteiro */
let geos: {
  casca: Record<TamanhoDeAbobora, THREE.BufferGeometry>;
  cabinho: THREE.BufferGeometry;
  folha: THREE.BufferGeometry;
  gavinha: THREE.BufferGeometry;
  /** a cara de cada tamanho, feita quando a primeira abóbora pede */
  caras: Map<string, THREE.BufferGeometry>;
} | null = null;

function geometrias(): NonNullable<typeof geos> {
  if (geos) return geos;
  geos = {
    casca: {
      grande: geoCasca(ABOBORA.grande.volta, ABOBORA.grande.altura),
      media: geoCasca(ABOBORA.media.volta, ABOBORA.media.altura),
      pequena: geoCasca(ABOBORA.pequena.volta, ABOBORA.pequena.altura),
    },
    cabinho: geoCabinho(),
    folha: geoFolhaDaAbobora(),
    gavinha: geoGavinha(),
    caras: new Map(),
  };
  return geos;
}

/** a altura de uma abóbora deste raio (para empilhar uma em cima da outra) */
export function alturaDaAbobora(raio: number): number {
  return (TOPO - FUNDO) * raio;
}

export interface AboboraNoLote {
  x: number;
  y?: number;
  z: number;
  /** para onde a cara olha (0 = `+Z`) */
  giro?: number;
  tamanho?: TamanhoDeAbobora;
  /** o raio exato, por cima do tamanho (a abóbora gigante da bilheteria) */
  raio?: number;
  /** sem cara: abóbora inteira, de enfeite */
  cara?: CaraDeAbobora;
  cor?: number;
  /** sem folha e sem gavinha (as pequenas da pilha) */
  simples?: boolean;
  /** a inclinação de quem está largada no chão ou na pilha */
  tomba?: number;
}

/**
 * Todas as abóboras de um lugar (ou do parque inteiro) num lote só: a cena
 * chama `por()` para cada uma e `montar()` no fim.
 *
 * ACESAS (`montar({ acesas: true })`): a vela dentro de cada abóbora de cara.
 * Luz PINTADA, nenhuma luz de verdade: a cara vira chapada e clara (o furo da
 * cor da chama), um halo em volta da cara e a poça de luz no chão à frente
 * dela — cada um UM lote para todas. A chama treme pela cor de cada cópia
 * (`tremer(tempo)`, cada abóbora no seu ritmo), sem mexer em material.
 */
export class LoteDeAboboras {
  private readonly lista: AboboraNoLote[] = [];
  /** o que treme quando acesas: cada lote e, por cópia, o índice da abóbora na lista */
  private readonly chamas: Array<{ im: THREE.InstancedMesh; quem: number[]; forca: number }> = [];

  por(a: AboboraNoLote): this {
    this.lista.push(a);
    return this;
  }

  get quantas(): number {
    return this.lista.length;
  }

  montar(opts: { acesas?: boolean; semPoca?: boolean } = {}): THREE.Group {
    const acesas = opts.acesas ?? false;
    const g = new THREE.Group();
    g.name = 'aboboras';
    g.userData.peca = 'aboboras-de-halloween';
    const G = geometrias();
    const casca = toon(0xffffff, { corPorVertice: true });
    const matriz = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const cor = new THREE.Color();

    const lote = (geo: THREE.BufferGeometry, mat: THREE.Material, quais: AboboraNoLote[], nome: string, comCor = false): void => {
      if (!quais.length) return;
      const im = new THREE.InstancedMesh(geo, mat, quais.length);
      im.name = nome;
      quais.forEach((a, i) => {
        const r = a.raio ?? ABOBORA[a.tamanho ?? 'media'].raio;
        const tomba = a.tomba ?? 0;
        e.set(tomba * 0.6, a.giro ?? 0, tomba, 'YXZ');
        q.setFromEuler(e);
        // tombada, ela afunda um pouco para não boiar na beira
        matriz.compose(new THREE.Vector3(a.x, (a.y ?? 0) - Math.abs(tomba) * r * 0.25, a.z), q, new THREE.Vector3(r, r, r));
        im.setMatrixAt(i, matriz);
        if (comCor) im.setColorAt(i, cor.set(a.cor ?? P.abobora));
      });
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere();
      g.add(im);
    };

    for (const t of ['grande', 'media', 'pequena'] as const) {
      lote(G.casca[t], casca, this.lista.filter((a) => (a.tamanho ?? 'media') === t), `casca-${t}`, true);
    }
    lote(G.cabinho, toon(P.aboboraCabinho), this.lista, 'cabinhos');
    const comFolha = this.lista.filter((a) => !a.simples);
    lote(G.folha, toon(P.aboboraFolha, { doubleSide: true }), comFolha, 'folhas');
    lote(G.gavinha, toon(P.aboboraFolha), comFolha, 'gavinhas');
    // as caras: cada uma é uma malha com NOME (é ela que acende de noite)
    const mascara = acesas ? acesoPorVertice() : toon(0xffffff, { corPorVertice: true });
    for (const t of ['grande', 'media', 'pequena'] as const) {
      for (const c of CARAS) {
        const quais = this.lista.filter((a) => a.cara === c && (a.tamanho ?? 'media') === t);
        if (!quais.length) continue;
        const chave = `${c}-${t}${acesas ? '-acesa' : ''}`;
        let geo = G.caras.get(chave);
        if (!geo) G.caras.set(chave, (geo = geoCara(c, t, acesas)));
        lote(geo, mascara, quais, `cara-${chave}`);
        if (acesas) {
          const im = g.children[g.children.length - 1] as THREE.InstancedMesh;
          for (let i = 0; i < quais.length; i++) im.setColorAt(i, cor.setScalar(1));
          this.chamas.push({ im, quem: quais.map((a) => this.lista.indexOf(a)), forca: 1 });
        }
      }
    }
    if (acesas) this.acender(g, !opts.semPoca);
    return g;
  }

  /**
   * O halo em volta de cada cara e a poça de luz no chão à frente dela (a
   * abóbora pendurada no ar — a da roda — vai sem a poça).
   */
  private acender(g: THREE.Group, comPoca: boolean): void {
    const comCara = this.lista.filter((a) => a.cara);
    if (!comCara.length) return;
    const quem = comCara.map((a) => this.lista.indexOf(a));
    const halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.luzDeAbobora, 0.6), comCara.length);
    halos.name = 'halos-das-aboboras';
    const chao = new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 2);
    const pocas = new THREE.InstancedMesh(chao, luzNoChao(P.luzDeAbobora, 0.5), comCara.length);
    pocas.name = 'luz-das-aboboras';
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const branco = new THREE.Color(1, 1, 1);
    comCara.forEach((a, i) => {
      const r = a.raio ?? ABOBORA[a.tamanho ?? 'media'].raio;
      const fx = Math.sin(a.giro ?? 0);
      const fz = Math.cos(a.giro ?? 0);
      // o halo na frente da cara, na altura dos olhos
      p.set(a.x + fx * r * 0.9, (a.y ?? 0) + (TOPO - FUNDO) * r * 0.5, a.z + fz * r * 0.9);
      halos.setMatrixAt(i, m.compose(p, q.identity(), s.setScalar(r * 5 + 0.3)));
      halos.setColorAt(i, branco);
      // a poça: a luz sai pela cara, então ela se espalha mais para a frente
      p.set(a.x + fx * r * 1.1, (a.y ?? 0) + 0.006, a.z + fz * r * 1.1);
      // no chão a luz se espalha longe; em cima de um móvel, ela fica no tampo
      pocas.setMatrixAt(i, m.compose(p, q.identity(), s.setScalar((a.y ?? 0) > 0.05 ? r * 3.2 : r * 5 + 0.7)));
      pocas.setColorAt(i, branco);
    });
    for (const im of comPoca ? [halos, pocas] : [halos]) {
      im.instanceMatrix.needsUpdate = true;
      im.computeBoundingSphere();
      im.userData.semSombra = true;
      g.add(im);
    }
    halos.renderOrder = 3;
    pocas.renderOrder = 2;
    this.chamas.push({ im: halos, quem, forca: 1 });
    if (comPoca) this.chamas.push({ im: pocas, quem, forca: 1 });
  }

  /** a chama tremendo: cada abóbora no seu ritmo (só faz algo se acesas) */
  tremer(tempo: number): void {
    const cor = new THREE.Color();
    for (const { im, quem, forca } of this.chamas) {
      for (let i = 0; i < quem.length; i++) {
        const k = quem[i] * 1.7;
        const chama = 0.86 + 0.08 * Math.sin(tempo * 7.3 + k) + 0.06 * Math.sin(tempo * 12.9 + k * 2.3);
        im.setColorAt(i, cor.setScalar(chama * forca));
      }
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    }
  }
}

/** uma abóbora sozinha (a vitrine do teste, o enfeite avulso) */
export function aboboraEsculpida(tamanho: TamanhoDeAbobora = 'media', cara?: CaraDeAbobora, cor: number = P.abobora): THREE.Group {
  return new LoteDeAboboras().por({ x: 0, z: 0, tamanho, cara, cor }).montar();
}
