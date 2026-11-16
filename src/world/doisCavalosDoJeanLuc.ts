import * as THREE from 'three';
import { JeanLuc, type PoseAoVolante } from '../entities/bichos/JeanLuc';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo, juntarPorCor } from './fundir';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { FONTE_FORMA } from './halloween/barracaDoWalter';
import { caixote, bolinhaPingPong } from './props';

/**
 * ============================================== O 2CV DO JEAN-LUC
 *
 * O quarto veículo dos personagens do PARQUE (`docs/DOIS-CAVALOS-DO-JEAN-LUC.md`),
 * pedido do Renan: "o Citroën 2CV (…) e enquanto ele está dirigindo quero ele com
 * um óculos escuro estiloso". O carro francês mais clássico que existe, para o
 * pato francês do lago:
 *
 * - a LATA azul de carro francês, com as nervuras compridas no capô e a FAIXA
 *   TRICOLOR no meio dele;
 * - os FARÓIS de sapo em cima dos para-lamas, os PARA-LAMAS SOLTOS (o da frente
 *   abraçando a roda, o de trás com a saia cobrindo meia roda), a grade com as
 *   duas divisas e o para-choque fininho de tubo;
 * - a CAPOTA DE LONA ENROLADA para trás (o teto aberto) e ele lá dentro EM PÉ
 *   NO CAIXOTE (o de sempre: "eu trago sempre, nunca precisei até hoje"),
 *   alto o bastante para olhar POR CIMA do para-brisa — de boina e ÓCULOS
 *   ESCUROS;
 * - a MESA DE PING PONG dobrada no bagageiro de trás, a baguete no saquinho
 *   de papel no banco de trás e a placa "JEAN-LUC" de placa francesa.
 *
 * O contrato é o dos veículos da estrada: base em `y = 0`, a frente no `+Z`, o
 * lado do Bebito é o `−X` (é o lado em que ele dirige, como o Mano na Kombi),
 * `update(dt, distancia, conversando)`; `estacionado` monta a versão vazia,
 * juntada como fundo.
 *
 * A LATARIA DE BAIXO É UMA PELE DE FATIAS (o molde do carrinho do Cookie): a
 * planta é uma superelipse (de nariz CHATO, que é onde mora a grade), a tampa é
 * o perfil de lado — o capô comprido caindo, a cintura na cabine e a traseira
 * descendo —, e a cabine é um buraco do tamanho da cintura. Por cima dela vai
 * a ESTUFA: para-brisa, vidros de lado e o vidro de trás, cada um uma malha que
 * acompanha a lata, e as colunas e as calhas em tubo da cor do carro.
 */
export const DOIS_CAVALOS = {
  /** meio comprimento (o nariz e a traseira) e a meia largura na cintura */
  meio: 1.62, meiaLargura: 0.76,
  chao: 0.27, piso: 0.34, cintura: 0.64, borda: 0.98, teto: 1.58,
  roda: 0.3, eixoFrente: 1.0, eixoTras: -1.06, bitola: 0.64,
  /** o buraco da cabine (de baixo da estufa), de onde a onde */
  cabine: { tras: -1.3, frente: 0.5 },
  /** onde ele vai: do lado do Bebito (`−X`), em pé no caixote em cima do banco */
  pato: { x: -0.33, z: -0.22, escala: 1.35 },
  /** o tampo do banco, onde o caixote pousa */
  banco: 0.6,
} as const;
const C = DOIS_CAVALOS;
const ARCO = 0.37;
const V = THREE.Vector3;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const preso = (x: number): number => Math.max(0, Math.min(1, x));
const suave = (x: number): number => { const k = preso(x); return k * k * (3 - 2 * k); };
const se = (t: number, n: number): number => Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, Math.abs(t)), n)), 1 / n);

// ================================================================ a pele

/** a planta: o nariz é CHATO (é onde a grade mora), a traseira arredondada */
const meiaLargura = (z: number): number => C.meiaLargura * se(z / C.meio, z > 0 ? 4.2 : 2.7);
/** o perfil de lado: o capô comprido caindo para o nariz, a cintura na cabine e a traseira descendo */
function altoDaTampa(z: number): number {
  const f = C.cabine.frente, t = C.cabine.tras;
  if (z > f) return C.borda - 0.27 * Math.pow((z - f) / (C.meio - f), 1.7);
  if (z < t) return C.borda - 0.34 * Math.pow((t - z) / (C.meio + t), 1.5);
  return C.borda;
}
const soleiraLisa = (z: number): number => C.chao + 0.16 * Math.pow(Math.abs(z) / C.meio, 6);
function soleira(z: number): number {
  let y = soleiraLisa(z);
  for (const e of [C.eixoFrente, C.eixoTras]) {
    const d = Math.abs(z - e);
    if (d < ARCO) y = Math.max(y, C.roda + Math.sqrt(ARCO * ARCO - d * d));
  }
  return Math.min(y, C.cintura - 0.02);
}
const cinturaEm = (z: number): number => Math.min(C.cintura, soleira(z) + (altoDaTampa(z) - soleira(z)) * 0.55);
/** o 2CV tem o lado quase em pé: o ombro fecha pouco */
const OMBRO = 0.9;
const CURVA = 0.8;
/** a cabine: a beira do buraco, um peitoril estreito por dentro do ombro (zero fora dela) */
function meiaCabine(z: number): number {
  const c = (C.cabine.tras + C.cabine.frente) / 2, h = (C.cabine.frente - C.cabine.tras) / 2;
  const t = (z - c) / h;
  return Math.abs(t) >= 1 ? 0 : (meiaLargura(z) * OMBRO - 0.075) * se(t, 9);
}
function xDaPele(z: number, y: number): number {
  const w = meiaLargura(z), sol = soleira(z), top = altoDaTampa(z), cin = cinturaEm(z);
  if (y <= cin) {
    const recolhe = 0.1 * (1 - suave((sol - soleiraLisa(z)) / 0.28));
    const t = preso((cin - y) / Math.max(1e-4, cin - sol));
    return w * (1 - recolhe * t * t);
  }
  const s = Math.pow(preso((y - cin) / Math.max(1e-4, top - cin)), 1 / CURVA);
  return w * (OMBRO + (1 - OMBRO) * Math.pow(Math.sqrt(Math.max(0, 1 - s * s)), CURVA));
}
/** a tampa abaulada: mais alta no meio */
const yDaTampa = (z: number, x: number): number => {
  const xs = meiaLargura(z) * OMBRO;
  return altoDaTampa(z) + 0.04 * (1 - Math.pow(Math.min(1, Math.abs(x) / Math.max(1e-4, xs)), 2));
};

const NOS = 11;
function fatia(z: number): Array<[number, number]> {
  const sol = soleira(z), top = altoDaTampa(z), cin = cinturaEm(z);
  const nos: Array<[number, number]> = [];
  for (const y of [sol, (sol + cin) / 2, cin]) nos.push([xDaPele(z, y), y]);
  for (let j = 1; j <= 5; j++) {
    const f = (j / 5) * (Math.PI / 2);
    const y = cin + (top - cin) * Math.pow(Math.sin(f), CURVA);
    nos.push([j === 5 ? meiaLargura(z) * OMBRO : xDaPele(z, y), y]);
  }
  const xs = meiaLargura(z) * OMBRO, xh = meiaCabine(z);
  for (let j = 1; j <= 3; j++) {
    const x = xs + (xh - xs) * (j / 3);
    nos.push([x, yDaTampa(z, x)]);
  }
  return nos;
}
const ESTACOES = ((): number[] => {
  const N = 72, zs: number[] = [];
  for (let i = 0; i <= N; i++) zs.push(C.meio * 0.9995 * Math.sin((i / N - 0.5) * Math.PI));
  return zs;
})();

function naLateral(z: number, y: number, lado: number): { p: THREE.Vector3; n: THREE.Vector3 } {
  const p = new V(lado * xDaPele(z, y), y, z);
  const dz = new V(lado * (xDaPele(z + 0.01, y) - xDaPele(z - 0.01, y)), 0, 0.02);
  const dy = new V(lado * (xDaPele(z, y + 0.01) - xDaPele(z, y - 0.01)), 0.02, 0);
  const n = dy.cross(dz).normalize();
  if (n.x * lado < 0) n.negate();
  return { p, n };
}
function pregar<T extends THREE.Object3D>(obj: T, z: number, y: number, lado: number, fora = 0): T {
  const { p, n } = naLateral(z, y, lado);
  obj.position.copy(p).addScaledVector(n, fora);
  obj.quaternion.setFromUnitVectors(new V(0, 0, 1), n);
  return obj;
}

function geoDaPele(): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const POR = NOS * 2;
  for (const z of ESTACOES) {
    const nos = fatia(z);
    for (let k = 0; k < NOS; k++) pos.push(nos[k][0], nos[k][1], z);
    for (let k = NOS - 1; k >= 0; k--) pos.push(-nos[k][0], nos[k][1], z);
  }
  for (let i = 0; i < ESTACOES.length - 1; i++) {
    for (let k = 0; k < POR - 1; k++) {
      if (k === NOS - 1) continue;
      const a = i * POR + k, b = a + 1, c = a + POR, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const n = geo.attributes.normal;
  for (let i = 0; i < ESTACOES.length; i++) {
    if (meiaCabine(ESTACOES[i]) > 1e-4) continue;
    const a = i * POR + NOS - 1, b = a + 1;
    const m = new V(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize();
    n.setXYZ(a, m.x, m.y, m.z); n.setXYZ(b, m.x, m.y, m.z);
  }
  return geo;
}

function geoDoFundo(): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  ESTACOES.forEach((z, i) => {
    const y = soleiraLisa(z) + 0.012, x = xDaPele(z, soleiraLisa(z)) - 0.006;
    pos.push(x, y, z, -x, y, z);
    if (i > 0) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** a caixa de roda: a fita escura da boca do para-lama para dentro, acompanhando a planta */
function geoDaCaixaDeRoda(eixo: number, lado: number): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const N = 14, FUNDO = 0.26;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI;
    const z = eixo + Math.cos(a) * (ARCO - 0.004), y = Math.max(soleiraLisa(z) + 0.012, C.roda + Math.sin(a) * (ARCO - 0.004));
    const x = xDaPele(z, y) - 0.008;
    pos.push(lado * x, y, z, lado * (x - FUNDO), y, z);
    if (i > 0) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const meio = pos.length / 3;
  pos.push(lado * (xDaPele(eixo, C.roda + 0.2) - FUNDO), C.roda, eixo);
  for (let i = 0; i < N; i++) idx.push(meio, i * 2 + 1, i * 2 + 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** o forro da cabine: da beira do buraco para baixo, até o piso (dá grossura à porta e fundo ao buraco) */
function geoDoForro(): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const zs = ESTACOES.filter((z) => z >= C.cabine.tras - 0.02 && z <= C.cabine.frente + 0.02);
  const NF = 6;
  const meia = (z: number): Array<[number, number]> => {
    const xh = meiaCabine(z), top = altoDaTampa(z);
    const naRoda = [C.eixoFrente, C.eixoTras].some((e) => Math.abs(z - e) < ARCO + 0.16);
    const dentro = (y: number): number => Math.min(xDaPele(z, y) - 0.05, xh + 0.02,
      naRoda && y < C.roda + ARCO + 0.04 ? meiaLargura(z) - 0.34 : Infinity);
    return [
      [xh, yDaTampa(z, xh)],
      [xh, top - 0.05],
      [dentro(C.cintura), C.cintura],
      [dentro(C.piso + 0.1), C.piso + 0.1],
      [dentro(C.piso), C.piso],
      [0, C.piso],
    ];
  };
  for (const z of zs) {
    const nos = meia(z);
    for (let k = 0; k < NF; k++) pos.push(nos[k][0], nos[k][1], z);
    for (let k = NF - 1; k >= 0; k--) pos.push(-nos[k][0], nos[k][1], z);
  }
  const POR = NF * 2;
  for (let i = 0; i < zs.length - 1; i++) for (let k = 0; k < POR - 1; k++) {
    const a = i * POR + k, b = a + 1, c = a + POR, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/**
 * O PARA-LAMA SOLTO, o traço que mais diz "2CV": um meio cano gordo dando a
 * volta na roda, POR FORA da lata (a beira de dentro entra 3 cm na pele, a de
 * fora passa da roda). O da frente é comprido e desce bem na frente da roda;
 * o de trás tem a SAIA — a beira de fora desce em pé e cobre meia roda.
 */
function geoDoParalama(eixo: number, lado: number, frente: boolean): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const R = ARCO + 0.015, H = frente ? 0.13 : 0.11, FORA = frente ? 0.93 : 0.9;
  const a0 = frente ? -0.16 : 0.08, a1 = frente ? Math.PI + 0.28 : Math.PI - 0.08;
  const NA = 26, NB = 9;
  for (let i = 0; i <= NA; i++) {
    const a = a0 + (a1 - a0) * (i / NA);
    const dz = Math.cos(a), dy = Math.sin(a);
    // (as pontas afinam: o cano some na lata em vez de acabar em degrau)
    const ponta = Math.min(i, NA - i) / 3, h = H * Math.min(1, 0.35 + 0.65 * ponta);
    const z0 = eixo + dz * R, y0 = C.roda + dy * R;
    const xIn = xDaPele(Math.max(-C.meio * 0.98, Math.min(C.meio * 0.98, z0)), Math.max(soleiraLisa(z0), Math.min(C.cintura, y0))) - 0.03;
    for (let k = 0; k <= NB; k++) {
      const b = (k / NB) * Math.PI;
      const x = xIn + (FORA - xIn) * (1 - Math.cos(b)) / 2;
      const r = R + h * Math.sin(b);
      pos.push(lado * x, C.roda + dy * r, eixo + dz * r);
    }
    if (!frente) {
      // a saia: da beira de fora, em pé, até a altura do cubo
      const yLip = C.roda + dy * R;
      pos.push(lado * (FORA - 0.004), Math.min(yLip, Math.max(C.roda + 0.02, yLip - 0.3)), eixo + dz * R);
    }
  }
  const POR = NB + 1 + (frente ? 0 : 1);
  for (let i = 0; i < NA; i++) for (let k = 0; k < POR - 1; k++) {
    const a = i * POR + k, b = a + 1, c = a + POR, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // (a face tem que olhar para fora: o alto do cano, no meio do arco, aponta para cima)
  const topo = Math.round(NA / 2) * POR + Math.round(NB / 2);
  if (geo.attributes.normal.getY(topo) < 0) {
    const inv: number[] = [];
    for (let i = 0; i < idx.length; i += 3) inv.push(idx[i], idx[i + 2], idx[i + 1]);
    geo.setIndex(inv);
    geo.computeVertexNormals();
  }
  return geo;
}

/** um adesivo redondo assentado na lateral (a malha acompanha a curva da porta) */
function adesivoNaLateral(z0: number, y0: number, raio: number, lado: number, mat: THREE.Material): THREE.Mesh {
  const ANEIS = 3, GOMOS = 20;
  const pos: number[] = [], uv: number[] = [0.5, 0.5], idx: number[] = [];
  const centro = naLateral(z0, y0, lado);
  const ponto = (dz: number, dy: number): THREE.Vector3 => { const { p, n } = naLateral(z0 + dz, y0 + dy, lado); return p.addScaledVector(n, 0.008); };
  pos.push(...ponto(0, 0).toArray());
  for (let a = 1; a <= ANEIS; a++) for (let g = 0; g < GOMOS; g++) {
    const ang = (g / GOMOS) * Math.PI * 2, r = (a / ANEIS) * raio;
    pos.push(...ponto(-lado * Math.cos(ang) * r, Math.sin(ang) * r).toArray());
    uv.push(0.5 + 0.5 * Math.cos(ang) * (a / ANEIS), 0.5 + 0.5 * Math.sin(ang) * (a / ANEIS));
  }
  for (let g = 0; g < GOMOS; g++) idx.push(0, 1 + g, 1 + ((g + 1) % GOMOS));
  for (let a = 1; a < ANEIS; a++) for (let g = 0; g < GOMOS; g++) {
    const i0 = 1 + (a - 1) * GOMOS + g, i1 = 1 + (a - 1) * GOMOS + ((g + 1) % GOMOS), j0 = i0 + GOMOS, j1 = i1 + GOMOS;
    idx.push(i0, j0, i1, i1, j0, j1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  if (geo.attributes.normal.getX(0) * centro.n.x < 0) {
    const inv: number[] = [];
    for (let i = 0; i < idx.length; i += 3) inv.push(idx[i], idx[i + 2], idx[i + 1]);
    geo.setIndex(inv);
    geo.computeVertexNormals();
  }
  const m = new THREE.Mesh(geo, mat);
  m.userData.semSombra = true;
  return m;
}

/**
 * A FAIXA TRICOLOR no meio do capô: uma fita assentada na tampa, do pé do
 * para-brisa até o nariz, 6 mm acima da lata (a pintura dela é o canvas).
 */
function geoDaFaixa(meia: number): THREE.BufferGeometry {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const z0 = C.cabine.frente + 0.05, z1 = C.meio - 0.035, N = 24, L = 4;
  for (let i = 0; i <= N; i++) {
    const z = z0 + (z1 - z0) * (i / N);
    for (let j = 0; j <= L; j++) {
      const x = -meia + (2 * meia) * (j / L);
      pos.push(x, yDaTampa(z, x) + 0.006, z);
      uv.push(j / L, i / N);
    }
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < L; j++) {
    const a = i * (L + 1) + j, b = a + 1, c = a + L + 1, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  if (geo.attributes.normal.getY(0) < 0) {
    const inv: number[] = [];
    for (let i = 0; i < idx.length; i += 3) inv.push(idx[i], idx[i + 2], idx[i + 1]);
    geo.setIndex(inv);
    geo.computeVertexNormals();
  }
  return geo;
}

// ================================================================ a estufa (vidros, colunas e calhas)

/** onde a coluna da frente (A) está na altura `y`, e a de trás (C) */
const ALTO = (y: number): number => preso((y - C.borda) / (C.teto - C.borda));
const zDaColunaA = (y: number): number => C.cabine.frente - 0.04 - 0.2 * ALTO(y);
const zDaColunaC = (y: number): number => C.cabine.tras + 0.03 + 0.42 * ALTO(y);
/** o `x` do vidro de lado: em cima do peitoril, recolhendo para dentro até a calha */
const xDoVidro = (z: number, y: number): number => (meiaLargura(z) * OMBRO - 0.03) - 0.1 * ALTO(y);
/** o para-brisa: `u` de −1 a 1 de um lado ao outro, `v` de 0 a 1 de baixo para cima */
function noParaBrisa(u: number, v: number): THREE.Vector3 {
  const y = C.borda + 0.02 + (C.teto - C.borda - 0.02) * v;
  const zA = zDaColunaA(y);
  return new V(u * xDoVidro(zA, y), y, zA + 0.04 - 0.07 * u * u);
}
/** o vidro de trás, do mesmo jeito */
function noVidroDeTras(u: number, v: number): THREE.Vector3 {
  const y = C.borda + 0.02 + (C.teto - C.borda - 0.02) * v;
  const zC = zDaColunaC(y);
  return new V(u * xDoVidro(zC, y), y, zC - 0.03 + 0.06 * u * u);
}
/** o vidro de lado: `u` de 0 (atrás) a 1 (na frente), `v` de baixo para cima */
function noVidroDeLado(u: number, v: number, lado: number): THREE.Vector3 {
  const y = C.borda + 0.02 + (C.teto - C.borda - 0.02) * v;
  const zt = zDaColunaC(y), zf = zDaColunaA(y);
  const z = zt + (zf - zt) * u;
  return new V(lado * xDoVidro(z, y), y, z);
}
/** uma malha de vidro por uma função (u, v) */
function vidro(f: (u: number, v: number) => THREE.Vector3, nu: number, nv: number, u0: number, u1: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(1, 1, nu, nv);
  const pg = geo.attributes.position;
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const p = f(u0 + (u1 - u0) * (i / nu), 1 - j / nv);
    pg.setXYZ(j * (nu + 1) + i, p.x, p.y, p.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// ================================================================ as pinturas

let placa: THREE.CanvasTexture | null = null;
/** a placa francesa: o branco, a faixa azul com o "F" e as estrelinhas, e "JEAN-LUC" */
function placaDoJeanLuc(): THREE.CanvasTexture {
  if (placa) return placa;
  placa = canvasComLetra(320, 80, (c) => {
    c.fillStyle = css(P.camisaDoJeanLuc); c.fillRect(0, 0, 320, 80);
    c.fillStyle = css(P.azulFranca); c.fillRect(0, 0, 44, 80);
    c.strokeStyle = css(P.oculosEscurosArmacao); c.lineWidth = 4; c.strokeRect(2, 2, 316, 76);
    c.fillStyle = css(P.carrinhoLatao);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; c.beginPath(); c.arc(22 + Math.cos(a) * 11, 26 + Math.sin(a) * 11, 2.2, 0, Math.PI * 2); c.fill(); }
    c.fillStyle = css(P.camisaDoJeanLuc); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 26px ${FONTE_FORMA}`; c.fillText('F', 22, 60);
    c.fillStyle = css(P.oculosEscurosArmacao); c.font = `900 44px ${FONTE_FORMA}`;
    c.fillText('JEAN-LUC', 182, 44);
  });
  return placa;
}

let faixa: THREE.CanvasTexture | null = null;
/** a faixa do capô: azul, branco e vermelho lado a lado, com o filete branco em volta (no azul do carro) */
function faixaTricolor(): THREE.CanvasTexture {
  if (faixa) return faixa;
  faixa = canvasComLetra(96, 32, (c) => {
    c.fillStyle = css(P.camisaDoJeanLuc); c.fillRect(0, 0, 96, 32);
    for (const [i, cor] of [P.azulFranca, P.camisaDoJeanLuc, P.vermelhoFranca].entries()) { c.fillStyle = css(cor); c.fillRect(8 + i * 27, 0, 26, 32); }
  });
  return faixa;
}

let adesivoPing: THREE.CanvasTexture | null = null;
/** o adesivo de rali do lado do Bebito: as duas raquetes cruzadas, a bolinha e o "5" das cinco vitórias */
function adesivoDoPingPong(): THREE.CanvasTexture {
  if (adesivoPing) return adesivoPing;
  adesivoPing = canvasComLetra(256, 256, (c) => {
    c.fillStyle = css(P.camisaDoJeanLuc); c.beginPath(); c.arc(128, 128, 128, 0, Math.PI * 2); c.fill();
    c.strokeStyle = css(P.vermelhoFranca); c.lineWidth = 14; c.beginPath(); c.arc(128, 128, 112, 0, Math.PI * 2); c.stroke();
    c.strokeStyle = css(P.azulFranca); c.lineWidth = 6; c.beginPath(); c.arc(128, 128, 98, 0, Math.PI * 2); c.stroke();
    for (const s of [-1, 1]) {
      c.save(); c.translate(128, 140); c.rotate(s * 0.62);
      c.fillStyle = css(P.woodDark); c.fillRect(-9, 18, 18, 52);
      c.fillStyle = css(s < 0 ? P.vermelhoFranca : P.azulFranca); c.beginPath(); c.ellipse(0, -20, 34, 40, 0, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    c.fillStyle = css(P.carrinhoLatao); c.beginPath(); c.arc(128, 60, 15, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.oculosEscurosArmacao); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 46px ${FONTE_FORMA}`; c.fillText('5', 128, 214);
  });
  return adesivoPing;
}

let adesivoJL: THREE.CanvasTexture | null = null;
/** o do outro lado: a bandeirinha num círculo, com "J·L" */
function adesivoDaBandeira(): THREE.CanvasTexture {
  if (adesivoJL) return adesivoJL;
  adesivoJL = canvasComLetra(256, 256, (c) => {
    c.save(); c.beginPath(); c.arc(128, 128, 126, 0, Math.PI * 2); c.clip();
    for (const [i, cor] of [P.azulFranca, P.camisaDoJeanLuc, P.vermelhoFranca].entries()) { c.fillStyle = css(cor); c.fillRect(i * 86, 0, 86, 256); }
    c.restore();
    c.strokeStyle = css(P.camisaDoJeanLuc); c.lineWidth = 10; c.beginPath(); c.arc(128, 128, 120, 0, Math.PI * 2); c.stroke();
    c.fillStyle = css(P.oculosEscurosArmacao); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 66px ${FONTE_FORMA}`; c.fillText('J·L', 128, 134);
  });
  return adesivoJL;
}

let tampoDaMesa: THREE.CanvasTexture | null = null;
/** o tampo da mesa de ping pong: o verde, a borda branca e a linha do meio */
function tampoDePingPong(): THREE.CanvasTexture {
  if (tampoDaMesa) return tampoDaMesa;
  tampoDaMesa = canvasComLetra(256, 128, (c) => {
    c.fillStyle = css(P.mesaVerde); c.fillRect(0, 0, 256, 128);
    c.strokeStyle = css(P.camisaDoJeanLuc); c.lineWidth = 7; c.strokeRect(5, 5, 246, 118);
    c.lineWidth = 3; c.beginPath(); c.moveTo(8, 64); c.lineTo(248, 64); c.stroke();
  });
  return tampoDaMesa;
}

// ================================================================ as peças

const tubo = (pts: THREE.Vector3[], raio: number, cor: number, fechado = false, lados = 7): THREE.Mesh =>
  new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, fechado, 'centripetal'), Math.max(8, pts.length * 4), raio, lados, fechado), toon(cor));

/** a roda do 2CV: alta e fininha, o aro creme e a calota de cúpula cromada (o eixo em `X`; `lado` é o de fora) */
function roda(lado: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.232, 0.068, 10, 28).rotateY(Math.PI / 2), toon(P.onibusPneu)));
  const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.1, 22).rotateZ(Math.PI / 2), toon(P.doisCavalosLona));
  aro.position.x = lado * 0.01; g.add(aro);
  const calota = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-lado * Math.PI / 2), toon(P.churrascoInox));
  calota.scale.set(0.42, 1, 1); calota.position.x = lado * 0.055; g.add(calota);
  for (let i = 0; i < 3; i++) {
    const porca = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 4), toon(P.churrascoInoxEscuro));
    const a = (i / 3) * Math.PI * 2;
    porca.position.set(lado * 0.056, Math.sin(a) * 0.135, Math.cos(a) * 0.135); g.add(porca);
  }
  return g;
}

/** o farol de sapo: a cuia cromada num pezinho, em cima do para-lama, com a lente acesa e o brilho */
function farol(lado: number): THREE.Group {
  const g = new THREE.Group();
  const cuia = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), toon(P.churrascoInox));
  cuia.scale.set(1, 1, 1.2); g.add(cuia);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.016, 6, 22), toon(P.churrascoInox));
  aro.position.z = 0.118; g.add(aro);
  const lente = new THREE.Mesh(new THREE.SphereGeometry(0.098, 16, 10), toon(P.sorveteriaCreme, { glow: 0.6 }));
  lente.scale.z = 0.36; lente.position.z = 0.11; g.add(lente);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), toon(P.metalWhite, { glow: 0.9 }));
  brilho.position.set(-lado * 0.035, 0.035, 0.142); g.add(brilho);
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.14, 8), toon(P.churrascoInox));
  pe.position.set(0, -0.14, -0.02); g.add(pe);
  return g;
}

/** a grade: o trapézio escuro com as lâminas cromadas deitadas e as DUAS DIVISAS por cima (o "chevron") */
function grade(): THREE.Group {
  const g = new THREE.Group();
  const forma = new THREE.Shape();
  forma.moveTo(-0.27, 0); forma.lineTo(0.27, 0); forma.lineTo(0.23, 0.27); forma.lineTo(-0.23, 0.27); forma.closePath();
  const fundo = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.012, bevelSegments: 2 }), toon(P.onibusPainel));
  g.add(fundo);
  const moldura: THREE.Vector3[] = [new V(-0.27, 0, 0.03), new V(0.27, 0, 0.03), new V(0.23, 0.27, 0.03), new V(-0.23, 0.27, 0.03)];
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(moldura, true, 'catmullrom', 0.02), 40, 0.014, 6, true), toon(P.churrascoInox)));
  for (let i = 1; i <= 4; i++) {
    const y = i * 0.054, m = 0.27 - 0.04 * (y / 0.27) - 0.02;
    g.add(tubo([new V(-m, y, 0.034), new V(m, y, 0.034)], 0.008, P.churrascoInox, false, 5));
  }
  // as duas divisas, em V de ponta para cima, logo acima da grade
  for (const dy of [0.31, 0.36]) {
    g.add(tubo([new V(-0.11, dy, 0.025), new V(0, dy + 0.035, 0.03), new V(0.11, dy, 0.025)], 0.011, P.carrinhoLatao, false, 6));
  }
  return g;
}

/**
 * OS ÓCULOS ESCUROS do Jean-Luc (o pedido do Renan: "estiloso"), no
 * referencial da cabeça dele: armação grossa de acetato quase preto, com a
 * sobrancelha mais gorda em cima (o desenho dos óculos de cinema), as lentes
 * fumê com um risco de brilho na diagonal, os rebites dourados nos cantos e as
 * hastes abraçando a cabeça. As medidas cabem no vão que ele tem: as lentes
 * na frente das pupilas (que acabam em `z = 0,125`), acima do bico e abaixo da
 * aba da boina.
 */
function oculosEscuros(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'oculos-escuros';
  const contorno = (meiaL: number, alto: number, r: number): THREE.Shape => {
    // o formato de óculos de cinema: mais largo em cima, a quina de fora arredondada
    const s = new THREE.Shape();
    s.moveTo(-meiaL * 0.86, -alto / 2);
    s.lineTo(meiaL * 0.8, -alto / 2);
    s.quadraticCurveTo(meiaL, -alto / 2, meiaL, -alto / 2 + r);
    s.lineTo(meiaL * 1.05, alto / 2 - r);
    s.quadraticCurveTo(meiaL * 1.05, alto / 2, meiaL * 1.05 - r, alto / 2);
    s.lineTo(-meiaL + r, alto / 2);
    s.quadraticCurveTo(-meiaL, alto / 2, -meiaL, alto / 2 - r);
    s.lineTo(-meiaL, -alto / 2 + r);
    s.closePath();
    return s;
  };
  for (const lado of [-1, 1]) {
    const lente = new THREE.Group();
    lente.position.set(lado * 0.057, 0.035, 0.133);
    lente.rotation.y = lado * 0.2;
    lente.scale.x = lado; // (o canto de fora do contorno vai para fora dos dois lados)
    const aro = contorno(0.04, 0.05, 0.014);
    aro.holes.push(new THREE.Path(contorno(0.031, 0.037, 0.01).getPoints(8)));
    const armacao = new THREE.Mesh(new THREE.ExtrudeGeometry(aro, { depth: 0.01, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.002, bevelSegments: 1, curveSegments: 6 }), toon(P.oculosEscurosArmacao, { doubleSide: true }));
    lente.add(armacao);
    // a sobrancelha: um filete mais gordo por cima
    const sobrancelha = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.066, 3, 6).rotateZ(Math.PI / 2), toon(P.oculosEscurosArmacao));
    sobrancelha.position.set(0.004, 0.022, 0.009); lente.add(sobrancelha);
    const vidro = new THREE.Mesh(new THREE.ExtrudeGeometry(contorno(0.0335, 0.04, 0.011), { depth: 0.004, bevelEnabled: false, curveSegments: 6 }), toon(P.oculosEscurosLente, { doubleSide: true }));
    vidro.name = 'lente-fume'; vidro.position.z = 0.003; lente.add(vidro);
    const risco = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.034), toon(P.metalWhite, { glow: 0.8 }));
    risco.position.set(-0.008, 0.002, 0.0085); risco.rotation.z = -0.55; lente.add(risco);
    const risquinho = new THREE.Mesh(new THREE.PlaneGeometry(0.004, 0.016), toon(P.metalWhite, { glow: 0.8 }));
    risquinho.position.set(0.005, 0.008, 0.0085); risquinho.rotation.z = -0.55; lente.add(risquinho);
    const rebite = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 6, 4), toon(P.carrinhoLatao));
    rebite.position.set(0.034, 0.016, 0.012); lente.add(rebite);
    g.add(lente);
    // a haste: do canto de fora da armação, abraçando a cabeça até atrás do olho
    const haste = tubo([new V(lado * 0.1, 0.047, 0.126), new V(lado * 0.124, 0.046, 0.07), new V(lado * 0.121, 0.042, 0.0), new V(lado * 0.106, 0.036, -0.045)], 0.0055, P.oculosEscurosArmacao, false, 5);
    g.add(haste);
  }
  // a ponte em cima do bico
  g.add(tubo([new V(-0.024, 0.047, 0.147), new V(0, 0.054, 0.152), new V(0.024, 0.047, 0.147)], 0.006, P.oculosEscurosArmacao, false, 5));
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = false; });
  return g;
}

/** a mesa de ping pong dobrada: as duas metades fechadas uma sobre a outra, com as pernas recolhidas e a rede enrolada */
function mesaDobrada(): THREE.Group {
  const g = new THREE.Group();
  const tampo = toon(P.placaPintada, { mapa: tampoDePingPong() });
  for (const [i, y] of [0.025, 0.075].entries()) {
    const metade = new THREE.Mesh(quina(1.1, 0.044, 0.56, 0.012), tampo);
    metade.position.y = y; if (i === 0) metade.rotation.x = Math.PI;
    g.add(metade);
  }
  // as pernas recolhidas por baixo, em X
  for (const s of [-1, 1]) g.add(tubo([new V(-0.42, -0.012, s * 0.2), new V(0.42, -0.012, -s * 0.2)], 0.014, P.churrascoInoxEscuro, false, 5));
  // a rede enrolada, presa num lado
  const rede = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.5, 3, 6).rotateX(Math.PI / 2), toon(P.camisaDoJeanLuc));
  rede.position.set(0.5, 0.122, 0); g.add(rede);
  return g;
}

/** a baguete: o pão comprido de pontas arredondadas, com os talhos em cima */
function baguete(comprimento: number): THREE.Group {
  const g = new THREE.Group();
  const pao = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, comprimento, 4, 10), toon(P.baguete));
  pao.scale.set(1, 1, 0.82); g.add(pao);
  for (let i = 0; i < 4; i++) {
    const talho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4), toon(P.bagueteCasca));
    talho.scale.set(0.012, 0.05, 0.02);
    talho.position.set(0, -comprimento * 0.36 + i * comprimento * 0.24, 0.033); talho.rotation.z = 0.5;
    g.add(talho);
  }
  return g;
}

/** o saquinho de papel com as duas baguetes saindo */
function saquinhoDePao(): THREE.Group {
  const g = new THREE.Group();
  const saco = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.32, 10, 1, true), toon(P.doisCavalosLona, { doubleSide: true }));
  saco.scale.set(1, 1, 0.6); saco.position.y = 0.16; g.add(saco);
  const fundo = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10).rotateX(-Math.PI / 2), toon(P.doisCavalosLona));
  fundo.scale.set(1, 1, 0.6); fundo.position.y = 0.005; g.add(fundo);
  // a faixinha vermelha do padeiro
  const fita = new THREE.Mesh(new THREE.CylinderGeometry(0.106, 0.104, 0.04, 10, 1, true), toon(P.vermelhoFranca, { doubleSide: true }));
  fita.scale.set(1.01, 1, 0.61); fita.position.y = 0.22; g.add(fita);
  for (const [x, giro, l] of [[-0.03, 0.12, 0.62], [0.035, -0.16, 0.54]] as const) {
    const b = baguete(l); b.position.set(x, 0.3, 0); b.rotation.z = giro; g.add(b);
  }
  return g;
}

/** o volante do 2CV: o aro fino com UM raio só, na coluna comprida */
function volante(): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.014, 6, 22), toon(P.oculosEscurosArmacao)));
  g.add(tubo([new V(0, 0, 0), new V(0, -0.13, 0)], 0.012, P.oculosEscurosArmacao, false, 5));
  const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.03, 10).rotateX(Math.PI / 2), toon(P.churrascoInox));
  g.add(cubo);
  return g;
}

/** o banco de rede do 2CV: o quadro de tubo com a lona listrada esticada */
function bancoDeRede(largura: number): THREE.Group {
  const g = new THREE.Group();
  const lona = new THREE.Mesh(quina(largura, 0.07, 0.46, 0.03), toon(P.doisCavalosLona));
  lona.position.set(0, 0, 0); g.add(lona);
  for (const x of [-largura * 0.3, 0, largura * 0.3]) {
    const listra = new THREE.Mesh(quina(0.07, 0.074, 0.462, 0.02), toon(P.doisCavalosLonaListra));
    listra.position.x = x; g.add(listra);
  }
  const encosto = new THREE.Group();
  encosto.position.set(0, 0.02, -0.22); encosto.rotation.x = -0.22;
  const pano = new THREE.Mesh(quina(largura, 0.5, 0.06, 0.03), toon(P.doisCavalosLona)); pano.position.y = 0.26; encosto.add(pano);
  for (const x of [-largura * 0.3, 0, largura * 0.3]) {
    const listra = new THREE.Mesh(quina(0.07, 0.5, 0.064, 0.02), toon(P.doisCavalosLonaListra)); listra.position.set(x, 0.26, 0); encosto.add(listra);
  }
  g.add(encosto);
  for (const s of [-1, 1]) g.add(tubo([new V(s * (largura / 2 + 0.01), -0.27, 0.2), new V(s * (largura / 2 + 0.01), 0, 0.22), new V(s * (largura / 2 + 0.01), 0.02, -0.2)], 0.014, P.churrascoInoxEscuro, false, 5));
  return g;
}

const RAQUETADA = 0.34;

interface BolaNoAr { t: number; dur: number; de: THREE.Vector3; para: THREE.Vector3; alto: number; depois: 'parar' | 'sumir' | 'quicar' }

export class DoisCavalosDoJeanLuc {
  readonly group = new THREE.Group();
  /** o dono, em pé no caixote (`null` no 2CV estacionado) */
  readonly jeanLuc: JeanLuc | null = null;
  private readonly lata = new THREE.Group();
  private readonly rodas: THREE.Group[] = [];
  private readonly pose: PoseAoVolante = { vento: 0, olhar: 0, raquete: 0, golpe: 0 };
  private readonly bola: THREE.Mesh | null = null;
  private bolaNoAr: BolaNoAr | null = null;
  private quicando: { t: number; de: THREE.Vector3; vx: number; vz: number } | null = null;
  private relogio = 0;
  private velocidade = 0;
  private naJanela = false;
  private golpe = -1;
  private balanco = 0;
  private vBalanco = 0;
  /** quantas vezes a raquete bateu (o teste confere) */
  raquetadas = 0;

  constructor(estacionado = false) {
    this.group.userData.peca = 'dois-cavalos-do-jean-luc';
    const casco = new THREE.Group();
    const por = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, pai: THREE.Object3D = casco): T => { o.position.set(x, y, z); pai.add(o); return o; };
    const malha = (geo: THREE.BufferGeometry, cor: number): THREE.Mesh => new THREE.Mesh(geo, toon(cor));
    const AZUL = P.doisCavalosAzul;

    // ------------------------------------------------------- a lata, o forro, o fundo e as caixas de roda
    casco.add(malha(geoDaPele(), AZUL));
    casco.add(new THREE.Mesh(geoDoForro(), toon(P.doisCavalosAzulEscuro, { doubleSide: true })));
    casco.add(new THREE.Mesh(geoDoFundo(), toon(P.onibusPainel, { doubleSide: true })));
    for (const z of [C.eixoFrente, C.eixoTras]) for (const lado of [-1, 1]) {
      casco.add(new THREE.Mesh(geoDaCaixaDeRoda(z, lado), toon(P.onibusPainel, { doubleSide: true })));
      casco.add(malha(geoDoParalama(z, lado, z > 0), AZUL));
    }

    // ------------------------------------------------------- o capô: as nervuras compridas e a faixa tricolor
    for (const x of [-0.3, -0.19, 0.19, 0.3]) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 10; i++) { const z = C.cabine.frente + 0.08 + (C.meio - 0.16 - C.cabine.frente) * (i / 10); pts.push(new V(x, yDaTampa(z, x) + 0.002, z)); }
      casco.add(tubo(pts, 0.012, P.doisCavalosAzulEscuro, false, 5));
    }
    const listra = new THREE.Mesh(geoDaFaixa(0.13), toon(P.placaPintada, { mapa: faixaTricolor() }));
    listra.userData.semSombra = true; casco.add(listra);

    // ------------------------------------------------------- a cara: a grade com as divisas, os faróis de sapo e o para-choque fininho
    por(grade(), 0, 0.36, C.meio - 0.005);
    for (const lado of [-1, 1]) {
      // o farol pousa entre o capô e o para-lama, de pezinho
      const f = por(farol(lado), lado * 0.53, 0.93, C.eixoFrente + 0.2);
      f.rotation.y = lado * 0.06;
    }
    for (const ponta of [1, -1]) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 16; i++) {
        const s = (i / 16) * 2 - 1, z = ponta * (C.meio + 0.07 - 0.36 * s * s * s * s), x = s * 0.66;
        pts.push(new V(x, 0.38, z));
      }
      casco.add(tubo(pts, 0.022, P.churrascoInox));
      for (const x of [-0.24, 0.24]) por(malha(new THREE.CapsuleGeometry(0.022, 0.08, 3, 8), P.churrascoInox), x, 0.4, ponta * (C.meio + 0.075));
      // os suportes que prendem o para-choque na lata
      for (const x of [-0.42, 0.42]) casco.add(tubo([new V(x, 0.38, ponta * (C.meio + 0.03 - 0.36 * Math.pow(x / 0.66, 4))), new V(x, 0.38, ponta * (C.meio - 0.2))], 0.014, P.churrascoInoxEscuro, false, 5));
      por(new THREE.Mesh(quina(0.4, 0.1, 0.016, 0.006), toon(P.churrascoInox)), 0, 0.27, ponta * (C.meio + 0.06));
      const letras = new THREE.Mesh(new THREE.PlaneGeometry(0.385, 0.088), toon(P.placaPintada, { mapa: placaDoJeanLuc() }));
      letras.position.set(0, 0.27, ponta * (C.meio + 0.07)); if (ponta < 0) letras.rotation.y = Math.PI;
      casco.add(letras);
    }

    // ------------------------------------------------------- a estufa: para-brisa, vidros de lado e de trás, colunas e calhas
    {
      const vidroMat = toon(P.onibusParaBrisa, { opacity: 0.3, doubleSide: true });
      const vidros: THREE.BufferGeometry[] = [
        vidro(noParaBrisa, 12, 5, -1, 1),
        vidro(noVidroDeTras, 12, 5, -1, 1),
        vidro((u, v) => noVidroDeLado(u, v, -1), 14, 5, 0, 1),
        vidro((u, v) => noVidroDeLado(u, v, 1), 14, 5, 0, 1),
      ];
      for (const geo of vidros) {
        const m = new THREE.Mesh(geo, vidroMat);
        m.userData.semSombra = true; m.renderOrder = 3; this.lata.add(m);
      }
      const R = 0.028;
      // as colunas A e C, e a calha de cada lado (do alto de uma ao alto da outra)
      for (const lado of [-1, 1]) {
        const a: THREE.Vector3[] = [], c: THREE.Vector3[] = [], calha: THREE.Vector3[] = [];
        for (let i = 0; i <= 5; i++) { a.push(noParaBrisa(lado, i / 5)); c.push(noVidroDeTras(lado, i / 5)); }
        for (let i = 0; i <= 10; i++) { const p = noVidroDeLado(i / 10, 1, lado); p.y += 0.015 * Math.sin((i / 10) * Math.PI); calha.push(p); }
        casco.add(tubo(a, R, AZUL), tubo(c, R, AZUL), tubo(calha, R, AZUL));
        // a coluna do meio (B), entre as duas portas, e o friso de borracha no pé do vidro
        const zB = -0.3;
        const ub = (y: number): number => (zB - zDaColunaC(y)) / (zDaColunaA(y) - zDaColunaC(y));
        const b: THREE.Vector3[] = [];
        for (let i = 0; i <= 4; i++) { const v = i / 4, y = C.borda + 0.02 + (C.teto - C.borda - 0.02) * v; b.push(noVidroDeLado(ub(y), v, lado)); }
        casco.add(tubo(b, 0.022, AZUL));
        const pe: THREE.Vector3[] = [];
        for (let i = 0; i <= 10; i++) pe.push(noVidroDeLado(i / 10, 0.01, lado));
        casco.add(tubo(pe, 0.016, P.carrinhoBorracha, false, 5));
      }
      // a testeira do para-brisa e a travessa do vidro de trás (onde a lona enrolada pousa)
      const testeira: THREE.Vector3[] = [], travessa: THREE.Vector3[] = [], peDoVidro: THREE.Vector3[] = [];
      for (let i = 0; i <= 10; i++) { testeira.push(noParaBrisa(-1 + i / 5, 1)); travessa.push(noVidroDeTras(-1 + i / 5, 1)); peDoVidro.push(noParaBrisa(-1 + i / 5, 0.01)); }
      casco.add(tubo(testeira, R, AZUL), tubo(travessa, R, AZUL), tubo(peDoVidro, 0.018, P.carrinhoBorracha, false, 5));
      // os limpadores, deitados no pé do para-brisa
      for (const u of [-0.55, 0.15]) casco.add(tubo([noParaBrisa(u, 0.06).add(new V(0, 0, 0.02)), noParaBrisa(u + 0.35, 0.16).add(new V(0, 0, 0.02))], 0.008, P.oculosEscurosArmacao, false, 5));
      // o retrovisor redondo na porta do motorista
      const pe = noVidroDeLado(0.92, 0.05, -1), ponta = new V(-0.86, 1.14, 0.38);
      casco.add(tubo([pe, pe.clone().lerp(ponta, 0.5).add(new V(0, 0.04, 0)), ponta], 0.011, P.churrascoInox));
      const espelho = por(malha(new THREE.SphereGeometry(0.06, 12, 8), P.churrascoInox), ponta.x, ponta.y, ponta.z);
      espelho.scale.set(1, 1, 0.45);
      const vidrinho = por(malha(new THREE.CircleGeometry(0.048, 14), P.onibusParaBrisa), ponta.x, ponta.y, ponta.z - 0.03);
      vidrinho.rotation.y = Math.PI;
    }

    // ------------------------------------------------------- a capota de lona ENROLADA para trás, presa por duas cintas de couro
    {
      const alto = noVidroDeTras(0, 1);
      const largura = 2 * xDoVidro(alto.z, C.teto) - 0.06;
      const rolo = por(malha(new THREE.CapsuleGeometry(0.11, largura - 0.22, 4, 14).rotateZ(Math.PI / 2), P.doisCavalosLona), 0, alto.y + 0.1, alto.z + 0.02);
      rolo.scale.set(1, 0.85, 1);
      for (const x of [-largura * 0.3, largura * 0.3]) {
        const cinta = por(malha(new THREE.TorusGeometry(0.115, 0.016, 6, 18).rotateY(Math.PI / 2), P.doisCavalosCouro), x, alto.y + 0.1, alto.z + 0.02);
        cinta.scale.set(1, 0.86, 1);
        por(malha(quina(0.04, 0.03, 0.012, 0.005), P.carrinhoLatao), x + 0.02, alto.y + 0.1, alto.z + 0.135);
      }
    }

    // ------------------------------------------------------- as portas: os cortes, as maçanetas e os adesivos
    for (const lado of [-1, 1]) {
      for (const z of [C.cabine.frente - 0.06, -0.3, C.cabine.tras + 0.18]) {
        const corte: THREE.Vector3[] = [];
        for (let i = 0; i <= 8; i++) { const y = soleira(z) + 0.04 + (i / 8) * (C.borda - soleira(z) - 0.06); const { p, n } = naLateral(z, y, lado); corte.push(p.addScaledVector(n, 0.002)); }
        casco.add(tubo(corte, 0.007, P.doisCavalosAzulEscuro, false, 5));
      }
      for (const z of [-0.18, -0.95]) casco.add(pregar(malha(quina(0.13, 0.03, 0.03, 0.012), P.churrascoInox), z, 0.88, lado, 0.01));
      casco.add(adesivoNaLateral(0.06, 0.66, 0.15, lado, toon(P.placaPintada, { mapa: lado < 0 ? adesivoDoPingPong() : adesivoDaBandeira() })));
      // as lanternas de trás, redondinhas, e o escapamento
      const lanterna = pregar(malha(new THREE.SphereGeometry(0.055, 12, 8), P.rodaVermelho), -1.5, 0.66, lado, 0.004);
      lanterna.scale.set(1, 1, 0.5); casco.add(lanterna);
      casco.add(pregar(malha(new THREE.TorusGeometry(0.056, 0.011, 5, 16), P.churrascoInox), -1.5, 0.66, lado, 0.01));
    }
    por(malha(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 10).rotateX(Math.PI / 2), P.churrascoInox), 0.32, 0.29, -C.meio + 0.02);
    por(malha(new THREE.CylinderGeometry(0.02, 0.02, 0.185, 10).rotateX(Math.PI / 2), P.onibusPainel), 0.32, 0.29, -C.meio + 0.02);

    // ------------------------------------------------------- o bagageiro de trás com a MESA DE PING PONG dobrada, amarrada
    {
      const yR = 0.74, z0 = -C.meio + 0.12, z1 = -C.meio - 0.42;
      for (const x of [-0.42, 0.42]) {
        casco.add(tubo([new V(x, altoDaTampa(z0) - 0.02, z0), new V(x, yR, z0 - 0.1), new V(x, yR, z1)], 0.016, P.churrascoInox, false, 6));
        casco.add(tubo([new V(x, 0.42, -C.meio + 0.03), new V(x, yR - 0.01, z1 + 0.04)], 0.012, P.churrascoInoxEscuro, false, 5));
      }
      for (const z of [z0 - 0.12, z1]) casco.add(tubo([new V(-0.43, yR, z), new V(0.43, yR, z)], 0.015, P.churrascoInox, false, 6));
      const mesa = por(mesaDobrada(), 0, yR + 0.03, (z0 + z1) / 2 - 0.04);
      mesa.rotation.x = -0.04;
      // o elástico vermelho atravessando as duas metades
      for (const x of [-0.28, 0.28]) {
        const zc = (z0 + z1) / 2 - 0.04;
        casco.add(tubo([new V(x, yR, zc - 0.31), new V(x, yR + 0.14, zc - 0.29), new V(x, yR + 0.15, zc), new V(x, yR + 0.14, zc + 0.29), new V(x, yR, zc + 0.31)], 0.01, P.vermelhoFranca, false, 5));
      }
    }

    // ------------------------------------------------------- por dentro: o painel, o volante, os bancos de rede e a baguete
    {
      por(malha(quina(1.2, 0.07, 0.12, 0.03), P.doisCavalosAzulEscuro), 0, C.borda - 0.04, C.cabine.frente - 0.1);
      // o câmbio de guarda-chuva saindo do painel, com a bolinha
      casco.add(tubo([new V(0.02, C.borda - 0.03, C.cabine.frente - 0.14), new V(0.04, C.borda + 0.02, C.cabine.frente - 0.32)], 0.01, P.churrascoInox, false, 5));
      por(malha(new THREE.SphereGeometry(0.024, 8, 6), P.oculosEscurosArmacao), 0.04, C.borda + 0.02, C.cabine.frente - 0.33);
      // o volante: a coluna comprida até onde as asas dele alcançam
      const v = por(volante(), C.pato.x, 1.17, C.pato.z + 0.36);
      v.rotation.x = -0.75;
      casco.add(tubo([new V(C.pato.x, 1.17, C.pato.z + 0.36), new V(C.pato.x, C.borda - 0.03, C.cabine.frente - 0.12)], 0.016, P.oculosEscurosArmacao, false, 6));
      for (const z of [C.pato.z + 0.04, -0.92]) por(bancoDeRede(1.0), 0, C.banco - 0.035, z);
      // a baguete no banco de trás, do lado do Bebito, saindo pelo teto aberto
      const pao = por(saquinhoDePao(), -0.3, C.banco, -0.85);
      pao.rotation.set(-0.12, 0.3, 0.1);
      // o caixote: dentro, embaixo dele; estacionado, encostado na porta do lado de fora
      const cx = caixote(0.46, 0.3, P.wood);
      if (estacionado) { cx.position.set(-0.98, 0, -0.1); cx.rotation.set(0, 0.25, 0); } else cx.position.set(C.pato.x, C.banco, C.pato.z);
      casco.add(cx);
    }

    juntarPorCor(casco);
    this.lata.add(fundir(casco));
    this.group.add(this.lata);

    // ------------------------------------------------------- as rodas
    for (const z of [C.eixoFrente, C.eixoTras]) for (const lado of [-1, 1]) {
      const r = roda(lado);
      r.position.set(lado * C.bitola, C.roda, z);
      juntarPorCor(r);
      const pronta = fundir(r);
      this.rodas.push(pronta); this.group.add(pronta);
    }

    if (!estacionado) {
      // ----------------------------------------------------- o dono: em pé no caixote, de boina e óculos escuros
      const pato = new JeanLuc({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
      pato.entrarEmServico();
      pato.aoVolante = this.pose;
      pato.raqueteNaJanela();
      pato.cabecaDoPato.add(oculosEscuros());
      pato.group.scale.setScalar(C.pato.escala);
      pato.group.position.set(C.pato.x, C.banco + 0.3, C.pato.z);
      this.lata.add(pato.group);
      this.jeanLuc = pato;
      // a bolinha do ponto de ping pong (só aparece na hora)
      const bola = bolinhaPingPong();
      bola.scale.setScalar(2.6);
      bola.visible = false;
      this.group.add(bola);
      this.bola = bola;
      this.update(0, 0, false);
    } else {
      fundirComoFundo(this.group);
    }
  }

  /** a asa da janela larga o volante e levanta a raquete (o ponto de ping pong) */
  raqueteNaJanela(sim: boolean): void { this.naJanela = sim; }

  /** onde está a cara da raquete agora, no referencial do carro */
  private pontaDaRaquete(): THREE.Vector3 {
    if (!this.jeanLuc) return new V();
    this.group.updateMatrixWorld(true);
    const p = this.jeanLuc.raqueteNaMao.localToWorld(new V(0, 0.21, 0));
    return this.group.worldToLocal(p);
  }

  /** ele saca: a raquete bate e a bolinha voa num arco até `alvo` (no mundo: a janela do Bebito) e fica lá, em câmera lenta */
  sacar(alvo: THREE.Vector3): void {
    this.golpe = 0;
    this.raquetadas++;
    this.group.updateMatrixWorld(true);
    const para = this.group.worldToLocal(alvo.clone());
    this.bolaNoAr = { t: 0, dur: 0.75, de: this.pontaDaRaquete(), para, alto: 0.9, depois: 'parar' };
    this.quicando = null;
  }

  /**
   * a bolinha volta: rebatida (`acertou`), ela faz o arco de volta até a
   * raquete dele, que bate de novo e a pega; perdida, ela cai no asfalto entre
   * os dois carros, quica e rola para longe
   */
  devolver(acertou: boolean): void {
    const b = this.bola;
    if (!b) return;
    const de = b.position.clone();
    if (acertou) this.bolaNoAr = { t: 0, dur: 0.7, de, para: this.pontaDaRaquete(), alto: 0.7, depois: 'sumir' };
    else this.bolaNoAr = { t: 0, dur: 0.45, de, para: new V(de.x + 0.5, 0.06, de.z - 0.4), alto: 0.15, depois: 'quicar' };
  }

  /** a bolinha está voando ou quicando? */
  get bolaEmJogo(): boolean { return !!this.bolaNoAr || !!this.quicando; }

  update(dt: number, distancia: number, conversando: boolean): void {
    this.relogio += dt;
    const v = dt > 0 ? distancia / dt : 0;
    this.velocidade += (v - this.velocidade) * Math.min(1, dt * 4);
    const anda = preso(this.velocidade / 7);
    for (const r of this.rodas) r.rotation.x += distancia / C.roda;

    // ----- a suspensão mole do 2CV: ela adorna nas curvas e balança na parada (passa do ponto e volta)
    const alvo = conversando ? -0.035 : 0;
    this.vBalanco += ((alvo - this.balanco) * 30 - this.vBalanco * 3.2) * dt;
    this.balanco += this.vBalanco * dt;
    this.lata.rotation.z = this.balanco + Math.sin(this.relogio * 3.1) * 0.012 * anda;
    this.lata.rotation.x = Math.sin(this.relogio * 2.3) * 0.01 * anda - 0.012 * anda;
    this.lata.position.y = Math.sin(this.relogio * 6.1) * 0.012 * anda;

    // ----- ele: a boina no vento, a cabeça para quem parou do lado, e a raquete
    if (this.jeanLuc) {
      const p = this.pose;
      p.vento += (anda - p.vento) * Math.min(1, dt * 3);
      p.olhar += ((conversando ? -0.62 : 0) - p.olhar) * Math.min(1, dt * 5);
      p.raquete += ((this.naJanela ? 1 : 0) - p.raquete) * Math.min(1, dt * 6);
      if (this.golpe >= 0) { this.golpe += dt / RAQUETADA; if (this.golpe >= 1) this.golpe = -1; }
      p.golpe = Math.max(0, this.golpe);
      this.jeanLuc.update(dt);
    }

    // ----- a bolinha: o arco, a câmera lenta perto da janela, a volta ou o quique no asfalto
    const b = this.bola;
    if (b) {
      const voo = this.bolaNoAr;
      if (voo) {
        voo.t += dt / voo.dur;
        const k = Math.min(1, voo.t);
        b.visible = true;
        b.position.lerpVectors(voo.de, voo.para, k);
        b.position.y += Math.sin(k * Math.PI) * voo.alto;
        if (voo.t >= 1) {
          this.bolaNoAr = null;
          if (voo.depois === 'sumir') { this.golpe = 0; this.raquetadas++; b.visible = false; }
          else if (voo.depois === 'quicar') this.quicando = { t: 0, de: b.position.clone(), vx: 1.2, vz: -1.6 };
          else b.userData.parada = b.position.clone();
        }
      } else if (this.quicando) {
        const q = this.quicando;
        q.t += dt;
        // dois quiques que encolhem e a rolada para longe
        const salto = Math.abs(Math.sin(q.t * 7)) * 0.32 * Math.exp(-q.t * 2.4);
        b.position.set(q.de.x + q.vx * q.t, 0.06 + salto, q.de.z + q.vz * q.t);
        if (q.t > 1.6) { this.quicando = null; b.visible = false; }
      } else if (b.visible && b.userData.parada) {
        // parada no ar, perto da janela: a câmera lenta (ela ainda gira e boia um tico)
        const pp = b.userData.parada as THREE.Vector3;
        b.position.set(pp.x, pp.y + Math.sin(this.relogio * 2.2) * 0.025, pp.z);
      }
      b.rotation.x += dt * (b.userData.parada && !this.bolaNoAr ? 1.5 : 14);
      if (this.bolaNoAr || this.quicando) b.userData.parada = null;
    }
  }
}
