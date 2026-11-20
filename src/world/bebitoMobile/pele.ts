import * as THREE from 'three';

/**
 * ============================================ A PELE DO BEBITO MOBILE (a conta)
 *
 * O ônibus da cidade é uma CAIXA (o perfil de lado extrudado com bisel). O
 * Bebito Mobile é uma BOLHA: uma vanzinha alta e redonda, oca de verdade — a
 * cabine tem banco, painel e gente dentro, e dá para ver pelas janelas. Caixa
 * extrudada não fica oca nem redonda em planta, então a lataria dele é uma
 * superfície PRÓPRIA, feita de fatias:
 *
 *  - a PLANTA é uma superelipse (`meiaLargura(z)`): o carro visto de cima é um
 *    retângulo de quina bem redonda, e a frente e a traseira fecham sozinhas
 *    (a largura vai a zero nas duas pontas);
 *  - o PERFIL de cima (`topoEm(z)`) é o desenho de lado: o nariz arredondado,
 *    o capô curto subindo, o para-brisa em pé e curvo, o teto e a queda de trás;
 *  - cada FATIA (`secao(z)`) é um arco aberto embaixo, de 25 pontos: a lateral
 *    em pé da soleira à cintura, o degrau de ombro, a estufa inclinada para
 *    dentro, a quina redonda e o teto abaulado. Onde tem roda, a soleira sobe
 *    pelo arco da caixa de roda — a boca é a própria borda da lataria;
 *  - e a traseira deita um pouco para a frente em cima (`deformar`).
 *
 * As linhas da grade caem EXATAMENTE nas bordas das janelas, das colunas e das
 * portas (`ESTACOES_FIXAS`), então vidro, coluna e lataria são só uma escolha
 * de quadradinho (`regiaoDaCelula`), com a borda reta — e a borracha em volta
 * do vidro é um tubo pelo contorno do mesmo retângulo de índices.
 *
 * O CONTRATO do carro: a base em `y = 0`, o NARIZ no `+Z` (como toda peça do
 * kit, e como quem senta nele: `facing 0` olha para a frente), `x = 0` no
 * meio. O MOTORISTA senta no `+X` (carro brasileiro: a esquerda de quem
 * dirige), que é o lado que a câmera de sempre vê.
 */

export const CARRO = {
  /**
   * meio comprimento e meia largura (a planta). O carro nasceu com 4,2 e
   * ganhou 40 cm NO MEIO (o Renan pediu mais banco de trás): o nariz e a
   * traseira são os mesmos, e o que cresceu foi a cabine — o banco de trás
   * inteiro cabe À FRENTE das caixas de roda de trás, na largura toda do carro
   */
  A: 2.3,
  W: 1.04,
  /** o expoente da superelipse da planta: 2 é elipse, 8 é quase retângulo */
  expo: 4.4,
  /** a borda de baixo da lataria */
  soleira: 0.33,
  /** a cintura: onde acaba a lataria e começa a estufa (os vidros) */
  cintura: 1.1,
  teto: 2.1,
  /** o capô: a altura na ponta e no pé do para-brisa, e onde ficam o pé e o alto do para-brisa */
  capo: 1.02,
  cowl: 1.13,
  zCowl: 1.42,
  zTeto: 0.72,
  /** o raio do arredondado do nariz e da queda de trás */
  nariz: 0.16,
  rabo: 0.16,
  /** as rodas: o raio, a largura, o raio da caixa, a meia bitola e os eixos (frente, trás) */
  roda: { raio: 0.34, largura: 0.25, caixa: 0.425, x: 0.81 },
  eixos: [1.47, -1.47] as readonly number[],
  /** quanto a estufa recua na cintura (o ombro) e quanto fecha até o teto, em fração da largura */
  ombro: 0.035,
  fecha: 0.15,
  /** as janelas do lado, de trás para a frente: a de trás, a da porta de correr e a da porta da frente */
  // (a da frente acaba onde o vidro ainda tem um palmo de altura: indo até o pé do para-brisa ela
  // terminava numa lasca de milímetros, e a borracha se embolava na ponta)
  janelas: [[-1.92, -0.98], [-0.86, 0.13], [0.28, 1.26]] as ReadonlyArray<readonly [number, number]>,
  /** o quebra-vento divide a janela da frente aqui (e é onde a porta da frente acaba) */
  quebraVento: 1.0,
  /** as bordas das portas: a da frente e a de CORRER, comprida (acaba antes da caixa de roda de trás) */
  portas: { tras: -0.92, meio: 0.205, frente: 1.0 },
  /** o vidro de trás vai até esta fração da meia largura */
  vidroDeTras: 0.66,
  /** o para-brisa: quanto de teto fica em cima dele (a testeira) e de capô embaixo */
  testeira: 0.07,
  peDoParaBrisa: 0.06,
} as const;

const { A, W, expo: N } = CARRO;
const smooth = (x: number, a: number, b: number): number => THREE.MathUtils.smoothstep(x, a, b);
const clamp = THREE.MathUtils.clamp;

/** a meia largura da planta nesta altura do comprimento (zero nas pontas) */
export function meiaLargura(z: number): number {
  const q = Math.min(1, Math.abs(z) / A);
  return W * Math.pow(Math.max(0, 1 - Math.pow(q, N)), 1 / N);
}

/** o `z` (positivo) em que a planta tem esta meia largura */
export function zDaLargura(w: number): number {
  const q = clamp(Math.abs(w) / W, 0, 1);
  return A * Math.pow(Math.max(0, 1 - Math.pow(q, N)), 1 / N);
}

/** a linha do teto longe das pontas: quase reta, com um tico de barriga */
const tetoReto = (z: number): number => CARRO.teto - 0.03 * ((z + 0.6) / 1.25) ** 2;

/** O PERFIL DE CIMA: a altura do meio do carro em cada `z` (o desenho de lado) */
export function topoEm(z: number): number {
  const zn = A - CARRO.nariz;
  if (z >= zn) {
    const d = Math.min(CARRO.nariz, z - zn);
    return CARRO.capo - CARRO.nariz + Math.sqrt(CARRO.nariz ** 2 - d * d);
  }
  if (z >= CARRO.zCowl) {
    const s = (z - CARRO.zCowl) / (zn - CARRO.zCowl);
    return CARRO.cowl + (CARRO.capo - CARRO.cowl) * Math.pow(s, 1.2);
  }
  if (z >= CARRO.zTeto) {
    // o para-brisa: em pé embaixo e deitando até virar teto, sem quina em cima
    const s = (CARRO.zCowl - z) / (CARRO.zCowl - CARRO.zTeto);
    return CARRO.cowl + (tetoReto(CARRO.zTeto) - CARRO.cowl) * (1 - Math.pow(1 - s, 1.7));
  }
  const zr = -A + CARRO.rabo;
  if (z >= zr) return tetoReto(z);
  const d = Math.min(CARRO.rabo, zr - z);
  return tetoReto(zr) - CARRO.rabo + Math.sqrt(CARRO.rabo ** 2 - d * d);
}

/** a borda de baixo da lateral: a soleira, ou o arco da caixa de roda */
export function soleiraEm(z: number): number {
  let y: number = CARRO.soleira;
  for (const e of CARRO.eixos) {
    const d = Math.abs(z - e);
    if (d < CARRO.roda.caixa) y = Math.max(y, CARRO.roda.raio + Math.sqrt(CARRO.roda.caixa ** 2 - d * d));
  }
  return y;
}

/** a tampa de trás: de onde ela começa (a quina de trás da planta) e a altura do alto do vidro dela */
const ONDE_A_TAMPA_COMECA = zDaLargura(0.8 * W);
const ALTO_DO_VIDRO_DE_TRAS = topoEm(-A) - 0.24 - 0.06;

/** quantos nós tem MEIA fatia (do pé da lateral ao meio do teto) e a fatia inteira */
export const NOS = 13;
export const PONTOS = NOS * 2 - 1;

/** os nós que têm nome: a cintura, o pé e o alto do vidro, o começo e o fim da quina */
export const NO = { pe: 0, cintura: 3, vidroBaixo: 4, vidroAlto: 5, quina: 6, paraBrisa: 7, teto: 10, meio: 12 } as const;

export interface Secao {
  z: number;
  w: number;
  topo: number;
  pe: number;
  /** 0 no capô, 1 na cabine */
  estufa: number;
  /** a altura em que a lateral acaba e a quina começa */
  quina: number;
  /** a meia largura em cima (no começo da quina) e os raios da quina */
  xAlto: number;
  rx: number;
  ry: number;
  coroa: number;
  /** quanto a estufa encolhe a largura nesta altura (1 = nada) */
  fator: (y: number) => number;
  /** os 13 nós da meia fatia: `[x, y]`, com `x ≥ 0` */
  nos: Array<[number, number]>;
}

/** UMA FATIA do carro, em `z` */
export function secao(z: number): Secao {
  const w = meiaLargura(z);
  const topo = topoEm(z);
  const pe = soleiraEm(z);
  const cabine = smooth(topo, CARRO.cowl + 0.04, CARRO.cowl + 0.5);
  const ry = 0.14 + 0.1 * cabine;
  const quina = Math.max(pe + 0.03, topo - ry);
  const cint = Math.min(CARRO.cintura, quina);
  const alto = quina - cint;
  const estufa = smooth(alto, 0, 0.22);
  const fator = (y: number): number =>
    y <= cint + 1e-6 ? 1 : 1 - estufa * (CARRO.ombro + CARRO.fecha * clamp((y - CARRO.cintura) / (CARRO.teto - CARRO.cintura), 0, 1));
  const y4 = cint + Math.min(0.06, alto * 0.25);
  // o alto do vidro acompanha o teto — menos na tampa de trás, onde ele é uma linha reta (acompanhando a
  // queda do teto, o vidro de trás ficava caído no meio, como uma rede)
  const y5 = Math.min(quina - Math.min(0.06, alto * 0.25), z < -ONDE_A_TAMPA_COMECA ? Math.max(y4, ALTO_DO_VIDRO_DE_TRAS) : Infinity);
  const xAlto = w * (alto > 1e-6 ? fator(quina) : 1);
  const rx = Math.min(0.24 + 0.06 * cabine, xAlto * 0.6);
  const coroa = 0.035 * (xAlto / W);
  const nos: Array<[number, number]> = [
    [w * 0.985, pe],
    [w, pe + (cint - pe) * 0.45],
    [w, cint - Math.min(0.08, (cint - pe) * 0.3)],
    [w, cint],
    [w * (alto > 1e-6 ? fator(y4) : 1), y4],
    [w * (alto > 1e-6 ? fator(y5) : 1), y5],
    [xAlto, quina],
  ];
  for (const graus of [22.5, 45, 67.5, 90]) {
    const a = (graus * Math.PI) / 180;
    nos.push([xAlto - rx + rx * Math.cos(a), quina + (topo - quina) * Math.sin(a)]);
  }
  nos.push([(xAlto - rx) * 0.5, topo + coroa * 0.75], [0, topo + coroa]);
  return { z, w, topo, pe, estufa, quina, xAlto, rx, ry, coroa, fator, nos };
}

/**
 * A TRASEIRA DEITA: do meio do carro para trás, o que está acima da cintura
 * vai um pouco para a frente (a tampa de trás inclinada, e não em pé como
 * porta de geladeira); e a cara da frente deita um tico para trás em cima.
 * Tudo o que mora NA lataria passa por aqui (os ajudantes abaixo já passam).
 */
export function deformar<T extends THREE.Vector3>(p: T): T {
  const tras = smooth(-p.z, A - 1.1, A - 0.1) * 0.17 * smooth(p.y, 0.95, CARRO.teto);
  const frente = smooth(p.z, A - 0.5, A - 0.05) * 0.05 * smooth(p.y, 0.5, 1.0);
  p.z += tras - frente;
  return p;
}

// =================================================================== a grade

/** as estações que TÊM que existir: bordas de vidro, de coluna, de porta e as quebras do perfil */
function estacoesFixas(): number[] {
  const z: number[] = [-A, A, CARRO.zCowl, CARRO.zTeto, -A + CARRO.rabo, A - CARRO.nariz];
  // as pontas: por LARGURA (o carro fecha em poucos centímetros, e por `z` a cara ficaria sem colunas)
  for (const f of [0.14, 0.28, 0.42, 0.55, CARRO.vidroDeTras, 0.76, 0.85, 0.92, 0.965]) {
    const zf = zDaLargura(f * W);
    z.push(zf, -zf);
  }
  for (const [a, b] of CARRO.janelas) z.push(a, b);
  z.push(CARRO.quebraVento, CARRO.portas.tras, CARRO.portas.meio);
  z.push(CARRO.zTeto + CARRO.testeira, CARRO.zCowl - CARRO.peDoParaBrisa);
  // o para-brisa é a parte mais curva do perfil
  for (let i = 1; i < 9; i++) z.push(CARRO.zTeto + ((CARRO.zCowl - CARRO.zTeto) * i) / 9);
  // as caixas de roda: por ângulo, para a boca sair redonda
  for (const e of CARRO.eixos) {
    for (let i = 0; i <= 14; i++) z.push(e + CARRO.roda.caixa * Math.cos((i / 14) * Math.PI));
  }
  // o nariz e o rabo arredondados
  for (let i = 1; i < 5; i++) {
    z.push(A - CARRO.nariz + CARRO.nariz * Math.sin((i / 5) * (Math.PI / 2)));
    z.push(-A + CARRO.rabo - CARRO.rabo * Math.sin((i / 5) * (Math.PI / 2)));
  }
  return z;
}

/** todas as estações, de trás (`−A`) para a frente (`+A`) */
export function estacoes(): number[] {
  const fixas = [...new Set(estacoesFixas().map((z) => +z.toFixed(5)))].sort((a, b) => a - b);
  // as fixas grudadas demais viram uma (a primeira ganha). Grudada é perto em `z` E em largura: na
  // ponta o carro fecha em milímetros de `z`, e ali cada estação é uma coluna da cara do carro
  const base: number[] = [];
  for (const z of fixas) {
    const antes = base[base.length - 1];
    if (antes === undefined || z - antes > 0.012 || Math.abs(meiaLargura(z) - meiaLargura(antes)) > 0.03) base.push(z);
  }
  // e o recheio, onde sobrar mais de 15 cm sem estação
  const todas = [...base];
  for (let i = 0; i < base.length - 1; i++) {
    const vao = base[i + 1] - base[i];
    const n = Math.ceil(vao / 0.15);
    for (let k = 1; k < n; k++) todas.push(base[i] + (vao * k) / n);
  }
  return todas.sort((a, b) => a - b);
}

export type Regiao = 'lataria' | 'capota' | 'vidro';

/** a qual meia fatia pertence a célula `j` (entre os pontos `j` e `j + 1`): o nó de baixo dela */
export const noDaCelula = (j: number): number => (j < NOS - 1 ? j : PONTOS - 2 - j);

/** O QUE É cada quadradinho da grade: lataria (azul), capota (creme) ou vidro */
export function regiaoDaCelula(zMeio: number, wMeio: number, j: number): Regiao {
  const k = noDaCelula(j);
  if (zMeio >= CARRO.zCowl || k < NO.cintura) return 'lataria';
  if (k === NO.vidroBaixo) {
    for (const [a, b] of CARRO.janelas) if (zMeio > a && zMeio < b) return 'vidro';
    if (zMeio < 0 && wMeio < CARRO.vidroDeTras * W) return 'vidro';
  }
  if (k >= NO.paraBrisa && zMeio > CARRO.zTeto + CARRO.testeira && zMeio < CARRO.zCowl - CARRO.peDoParaBrisa) return 'vidro';
  return 'capota';
}

export interface Pele {
  zs: number[];
  /** `pontos[i][j]` e `normais[i][j]`: a estação `i` (de trás para a frente) e o ponto `j` da fatia (da esquerda, por cima, até a direita) */
  pontos: THREE.Vector3[][];
  normais: THREE.Vector3[][];
  /** a estação mais perto de `z` */
  estacaoEm: (z: number) => number;
}

let peleGuardada: Pele | null = null;

/** A GRADE inteira, com as normais (feita uma vez: a forma do carro não muda com a ficha) */
export function pele(): Pele {
  if (peleGuardada) return peleGuardada;
  const zs = estacoes();
  const pontos = zs.map((z) => {
    const s = secao(z);
    const linha: THREE.Vector3[] = [];
    for (let j = 0; j < PONTOS; j++) {
      const k = j < NOS ? j : PONTOS - 1 - j;
      const lado = j < NOS - 1 ? -1 : j > NOS - 1 ? 1 : 0;
      linha.push(deformar(new THREE.Vector3(lado * s.nos[k][0], s.nos[k][1], z)));
    }
    return linha;
  });
  // a normal de cada ponto pela vizinhança da grade (alargando a janela onde os nós coincidem)
  const ni = zs.length;
  const dif = (i0: number, j0: number, di: number, dj: number): THREE.Vector3 => {
    const v = new THREE.Vector3();
    for (let passo = 1; passo < 6; passo++) {
      const a = pontos[clamp(i0 + di * passo, 0, ni - 1)][clamp(j0 + dj * passo, 0, PONTOS - 1)];
      const b = pontos[clamp(i0 - di * passo, 0, ni - 1)][clamp(j0 - dj * passo, 0, PONTOS - 1)];
      v.subVectors(a, b);
      if (v.lengthSq() > 1e-8) break;
    }
    return v;
  };
  const normais = pontos.map((linha, i) => linha.map((p, j) => {
    // nas duas pontas a fatia é uma linha em pé: a normal é a do nariz (ou a do rabo)
    if (i === 0) return new THREE.Vector3(0, 0, -1);
    if (i === ni - 1) return new THREE.Vector3(0, 0, 1);
    const n = dif(i, j, 1, 0).cross(dif(i, j, 0, 1));
    if (n.lengthSq() < 1e-12) n.set(Math.sign(p.x), 0.2, 0);
    return n.normalize();
  }));
  const estacaoEm = (z: number): number => {
    let melhor = 0;
    for (let i = 1; i < ni; i++) if (Math.abs(zs[i] - z) < Math.abs(zs[melhor] - z)) melhor = i;
    return melhor;
  };
  peleGuardada = { zs, pontos, normais, estacaoEm };
  return peleGuardada;
}

/**
 * A GEOMETRIA de uma região da pele (as células que `quer` aceita), com os
 * vértices compartilhados e a normal da grade — entre uma região e a vizinha
 * a luz continua igual, porque a normal é a mesma dos dois lados da emenda.
 * `afasta` leva tudo ao longo da normal (negativo é para dentro) e `avesso`
 * vira a face (o forro de dentro).
 */
export function geometriaDaPele(
  quer: (i: number, j: number, zMeio: number, wMeio: number) => boolean,
  afasta = 0,
  avesso = false,
): THREE.BufferGeometry {
  const { zs, pontos, normais } = pele();
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const mapa = new Map<number, number>();
  const vertice = (i: number, j: number): number => {
    const chave = i * PONTOS + j;
    let v = mapa.get(chave);
    if (v === undefined) {
      v = pos.length / 3;
      const p = pontos[i][j];
      const n = normais[i][j];
      pos.push(p.x + n.x * afasta, p.y + n.y * afasta, p.z + n.z * afasta);
      const s = avesso ? -1 : 1;
      nor.push(n.x * s, n.y * s, n.z * s);
      mapa.set(chave, v);
    }
    return v;
  };
  for (let i = 0; i < zs.length - 1; i++) {
    const zm = (zs[i] + zs[i + 1]) / 2;
    const wm = (meiaLargura(zs[i]) + meiaLargura(zs[i + 1])) / 2;
    for (let j = 0; j < PONTOS - 1; j++) {
      if (!quer(i, j, zm, wm)) continue;
      // célula sem área (os nós que coincidem no capô) não vira triângulo
      if (pontos[i][j].distanceToSquared(pontos[i][j + 1]) < 1e-10 && pontos[i + 1][j].distanceToSquared(pontos[i + 1][j + 1]) < 1e-10) continue;
      const a = vertice(i, j);
      const b = vertice(i + 1, j);
      const c = vertice(i, j + 1);
      const d = vertice(i + 1, j + 1);
      if (avesso) idx.push(a, c, b, b, c, d);
      else idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setIndex(idx);
  return geo;
}

// ============================================= pontos NA lataria (para pregar coisa)

export interface NaPele { p: THREE.Vector3; n: THREE.Vector3 }

/** o ponto da LATERAL em `z`, na altura `y` (`lado` +1 é o do motorista), com `folga` para fora */
export function noLado(z: number, y: number, lado: 1 | -1, folga = 0): NaPele {
  const em = (zz: number, yy: number): THREE.Vector3 => {
    const s = secao(zz);
    return deformar(new THREE.Vector3(lado * s.w * s.fator(yy), yy, zz));
  };
  const p = em(z, y);
  const dz = em(z + 0.01, y).sub(em(z - 0.01, y));
  const dy = em(z, y + 0.01).sub(em(z, y - 0.01));
  const n = lado > 0 ? dy.cross(dz) : dz.cross(dy);
  n.normalize();
  return { p: p.addScaledVector(n, folga), n };
}

/**
 * O ponto da CARA DA FRENTE (`frente = true`) ou da TAMPA DE TRÁS, a `x` do
 * meio e na altura `y`, com `folga` para fora. É a mesma lateral da fatia —
 * nas pontas a planta fecha, e a lateral vira a cara do carro.
 */
export function naPonta(x: number, y: number, frente: boolean, folga = 0): NaPele {
  const sinal = frente ? 1 : -1;
  const em = (xx: number, yy: number): THREE.Vector3 => {
    // a estufa encolhe a largura: a fatia certa é a que, encolhida, dá este `x`
    let z = zDaLargura(Math.abs(xx));
    for (let k = 0; k < 4; k++) z = zDaLargura(Math.abs(xx) / Math.max(0.2, secao(sinal * z).fator(yy)));
    return deformar(new THREE.Vector3(xx, yy, sinal * z));
  };
  const p = em(x, y);
  const dx = em(x + 0.01, y).sub(em(x - 0.01, y));
  const dy = em(x, y + 0.01).sub(em(x, y - 0.01));
  const n = frente ? dx.cross(dy) : dy.cross(dx);
  n.normalize();
  return { p: p.addScaledVector(n, folga), n };
}

/** a altura da lataria por CIMA (capô, para-brisa ou teto) em `(x, z)` */
export function alturaPorCima(x: number, z: number): number {
  const s = secao(z);
  const ax = Math.abs(x);
  const plano = s.xAlto - s.rx;
  if (ax <= plano) return s.topo + s.coroa * (1 - (plano > 1e-6 ? ax / plano : 0));
  const c = clamp((ax - plano) / Math.max(1e-6, s.rx), 0, 1);
  return s.quina + (s.topo - s.quina) * Math.sqrt(1 - c * c);
}

/** o ponto de CIMA da lataria em `(x, z)`, com a normal e `folga` para fora (sem a deitada de trás: vale do meio para a frente) */
export function porCima(x: number, z: number, folga = 0): NaPele {
  const em = (xx: number, zz: number): THREE.Vector3 => deformar(new THREE.Vector3(xx, alturaPorCima(xx, zz), zz));
  const p = em(x, z);
  const n = em(x, z + 0.01).sub(em(x, z - 0.01)).cross(em(x + 0.01, z).sub(em(x - 0.01, z))).normalize();
  return { p: p.addScaledVector(n, folga), n };
}

/** o quaternion que leva o `+Z` de uma peça para a normal `n`, com o `+Y` dela o mais para cima que der */
export function olhandoPara(n: THREE.Vector3, cima = new THREE.Vector3(0, 1, 0)): THREE.Quaternion {
  const z = n.clone().normalize();
  const x = new THREE.Vector3().crossVectors(cima, z);
  if (x.lengthSq() < 1e-8) x.set(1, 0, 0);
  x.normalize();
  const y = new THREE.Vector3().crossVectors(z, x);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}
