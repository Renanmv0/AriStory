import * as THREE from 'three';
import { Valentina } from '../entities/bichos/Valentina';
import { Pavao } from '../entities/bichos/Pavao';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo, juntarPorCor } from './fundir';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { FONTE_FORMA, FONTE_REDONDA } from './halloween/barracaDoWalter';
import { LOOK_DE_LIMUSINE } from './looksDaValentina';

/**
 * ====================================== A LIMUSINE CONVERSÍVEL DA VALENTINA
 *
 * O carro da flamingo do marketing (`docs/CARROS-DA-ESCOLA.md` §4), do pedido
 * do Renan: "quero uma limusine conversível! Rosa bem estilosa igual a ela" —
 * e com alguém dirigindo para ela (um personagem novo: o Pietro, o pavão
 * motorista, `entities/bichos/Pavao.ts`).
 *
 * - uma limusine dos anos 50 SEM TETO, comprida de dar risada (6,3 m — ela
 *   ocupa duas vagas no estacionamento), no rosa fundo com a LANÇA PEROLADA dos
 *   lados, cromo, rabos de peixe com as lanternas de foguete e o FLAMINGO
 *   DOURADO num pé só no capô;
 * - na frente, o PIETRO num banco alto de motorista (para enxergar por cima do
 *   capô comprido), do lado do Bebito, de quepe e luvas — e a cauda dobrada
 *   pendurada pela porta, porque não cabe no carro. No banco do lado, a
 *   CÂMERA de fotógrafo antiga, com o flash de prato;
 * - atrás da DIVISÓRIA (com o minibar e as duas taças de suco de morango), a
 *   sala de estar: o SOFÁ CAPITONÊ branco-pérola do lado de lá, onde a
 *   VALENTINA vai sentada virada para o Bebito, de óculos gatinho; o tapete
 *   vermelho no chão; as CHAPELEIRAS listradas no banco de trás;
 * - em cima do porta-malas, o TAPETE VERMELHO enrolado, com a franja dourada
 *   (é o que se desenrola na sessão de fotos);
 * - a placa "VALENTINA", de Milão.
 *
 * O contrato é o dos veículos da estrada: base em `y = 0`, a frente no `+Z`, o
 * lado do Bebito é o `−X` (o lado do motorista), `update(dt, distancia,
 * conversando)`; `estacionado` monta a versão vazia, juntada como fundo.
 *
 * A LATARIA é a pele de fatias do conversível da Tia Liz
 * (`world/conversivelDaTiaLiz.ts`), esticada: a planta de superelipse, o
 * perfil de lado (o capô e o porta-malas compridos, a cintura baixa) e a
 * cabine aberta de ponta a ponta.
 */
export const LIMUSINE = {
  meio: 3.15, meiaLargura: 0.96,
  chao: 0.3, piso: 0.38, cintura: 0.58, borda: 0.9,
  roda: 0.33, eixoFrente: 2.2, eixoTras: -2.2, bitola: 0.8,
  /** a cabine aberta, de onde a onde */
  cabine: { tras: -2.05, frente: 1.15 },
  /** o banco alto do Pietro (o tampo) e onde ele fica — do lado do Bebito */
  pietro: { x: -0.4, z: 0.6, banco: 0.86 },
  /** a divisória entre a frente e a sala */
  divisoria: 0.2,
  /** o sofá do lado de lá (o tampo do assento e de onde a onde vai) */
  sofa: { x: 0.56, assento: 0.6, z0: -1.6, z1: -0.08 },
  /** onde a Valentina senta, virada para o Bebito */
  valentina: { x: 0.44, z: -0.86 },
  /** o banco de trás (das chapeleiras) */
  bancoDeTras: -1.82,
} as const;
const C = LIMUSINE;
const ARCO = 0.43;
const V = THREE.Vector3;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const preso = (x: number): number => Math.max(0, Math.min(1, x));
const suave = (x: number): number => { const k = preso(x); return k * k * (3 - 2 * k); };
const se = (t: number, n: number): number => Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, Math.abs(t)), n)), 1 / n);
const ROSA = P.limusineRosa;
const PEROLA = P.limusinePerola;
const COURO = P.limusineCouro;
const CROMO = P.churrascoInox;
const OURO = P.limusineDourado;

// ================================================================ a pele

const meiaLargura = (z: number): number => C.meiaLargura * se(z / C.meio, z > 0 ? 3.6 : 3.2);
function altoDaTampa(z: number): number {
  const f = C.cabine.frente, t = C.cabine.tras;
  if (z > f) return C.borda - 0.2 * Math.pow((z - f) / (C.meio - f), 3.2);
  if (z < t) return C.borda - 0.15 * Math.pow((t - z) / (C.meio + t), 2.6);
  return C.borda;
}
const soleiraLisa = (z: number): number => C.chao + 0.14 * Math.pow(Math.abs(z) / C.meio, 6);
function soleira(z: number): number {
  let y = soleiraLisa(z);
  for (const e of [C.eixoFrente, C.eixoTras]) {
    const d = Math.abs(z - e);
    if (d < ARCO) y = Math.max(y, C.roda + Math.sqrt(ARCO * ARCO - d * d));
  }
  return Math.min(y, C.cintura - 0.02);
}
const cinturaEm = (z: number): number => Math.min(C.cintura, soleira(z) + (altoDaTampa(z) - soleira(z)) * 0.55);
const OMBRO = 0.93;
const CURVA = 0.8;
function meiaCabine(z: number): number {
  const c = (C.cabine.tras + C.cabine.frente) / 2, h = (C.cabine.frente - C.cabine.tras) / 2;
  const t = (z - c) / h;
  return Math.abs(t) >= 1 ? 0 : (meiaLargura(z) * OMBRO - 0.1) * se(t, 8);
}
function xDaPele(z: number, y: number): number {
  const w = meiaLargura(z), sol = soleira(z), top = altoDaTampa(z), cin = cinturaEm(z);
  if (y <= cin) {
    const recolhe = 0.08 * (1 - suave((sol - soleiraLisa(z)) / 0.28));
    const t = preso((cin - y) / Math.max(1e-4, cin - sol));
    return w * (1 - recolhe * t * t);
  }
  const s = Math.pow(preso((y - cin) / Math.max(1e-4, top - cin)), 1 / CURVA);
  return w * (OMBRO + (1 - OMBRO) * Math.pow(Math.sqrt(Math.max(0, 1 - s * s)), CURVA));
}
const yDaTampa = (z: number, x: number): number => {
  const xs = meiaLargura(z) * OMBRO;
  return altoDaTampa(z) + 0.03 * (1 - Math.pow(Math.min(1, Math.abs(x) / Math.max(1e-4, xs)), 2));
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
  const N = 110, zs: number[] = [];
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
/** o `z` em que a planta tem esta meia largura (na frente ou atrás) */
function zDaLargura(w: number, frente: boolean): number {
  let a = 0, b: number = C.meio;
  for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (meiaLargura(frente ? m : -m) > w) a = m; else b = m; }
  return (frente ? 1 : -1) * (a + b) / 2;
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
function geoDaCaixaDeRoda(eixo: number, lado: number): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const N = 14, FUNDO = 0.28;
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
/** o forro de couro da cabine aberta: da beira da tampa, pela parede de dentro, até o piso */
function geoDoForro(): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const zs = ESTACOES.filter((z) => z >= C.cabine.tras - 0.02 && z <= C.cabine.frente + 0.02);
  const NF = 6;
  const meia = (z: number): Array<[number, number]> => {
    const xh = meiaCabine(z), top = altoDaTampa(z);
    const naRoda = [C.eixoFrente, C.eixoTras].some((e) => Math.abs(z - e) < ARCO + 0.16);
    const dentro = (y: number): number => Math.min(xDaPele(z, y) - 0.05, xh + 0.02,
      naRoda && y < C.roda + ARCO + 0.04 ? meiaLargura(z) - 0.36 : Infinity);
    return [
      [xh, yDaTampa(z, xh)], [xh, top - 0.05], [dentro(C.cintura), C.cintura],
      [dentro(C.piso + 0.1), C.piso + 0.1], [dentro(C.piso), C.piso], [0, C.piso],
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
/** uma fita assentada na lateral, de `z0` a `z1`, entre as alturas `y0` e `y1` (a lança perolada) */
function geoNaLateral(lado: number, z0: number, z1: number, y0: (z: number) => number, y1: (z: number) => number, fora: number, n = 60): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const z = z0 + (z1 - z0) * (i / n);
    for (let j = 0; j <= 2; j++) {
      const y = y0(z) + (y1(z) - y0(z)) * (j / 2);
      const { p, n: nn } = naLateral(z, y, lado);
      p.addScaledVector(nn, fora);
      pos.push(p.x, p.y, p.z);
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) {
    const a = i * 3 + j, b = a + 1, c = a + 3, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  if (geo.attributes.normal.getX(4) * lado < 0) {
    const inv: number[] = [];
    for (let i = 0; i < idx.length; i += 3) inv.push(idx[i], idx[i + 2], idx[i + 1]);
    geo.setIndex(inv);
    geo.computeVertexNormals();
  }
  return geo;
}

/** o rabo de peixe: a barbatana que sobe atrás, em cima do para-lama, com a ponta pontuda (no plano −z, y) */
function geoDoRaboDePeixe(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(1.7, 0);
  s.quadraticCurveTo(2.5, 0.02, 3.1, 0.3);
  s.lineTo(3.18, 0.22);
  s.quadraticCurveTo(3.14, 0.02, 2.98, -0.04);
  s.lineTo(1.7, -0.04);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 10 });
  geo.rotateY(Math.PI / 2);
  return geo;
}

// ================================================================ as pinturas

let placa: THREE.CanvasTexture | null = null;
/** a placa: "VALENTINA" de letra de festa, com "MILANO" em cima */
function placaDaValentina(): THREE.CanvasTexture {
  if (placa) return placa;
  placa = canvasComLetra(320, 96, (c) => {
    c.fillStyle = css(PEROLA); c.fillRect(0, 0, 320, 96);
    c.fillStyle = css(P.limusineRosaFundo); c.fillRect(0, 0, 320, 22);
    c.strokeStyle = css(OURO); c.lineWidth = 4; c.strokeRect(2, 2, 316, 92);
    c.fillStyle = css(PEROLA); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `800 15px ${FONTE_FORMA}`; c.fillText('MILANO · ITALIA', 160, 12);
    c.fillStyle = css(P.limusineRosaFundo); c.font = `700 52px ${FONTE_REDONDA}`; c.fillText('Valentina', 160, 60);
  });
  return placa;
}

let listras: THREE.CanvasTexture | null = null;
/** a chapeleira: listras rosa e pérola em pé, com o "V" de monograma */
function listrasDaChapeleira(): THREE.CanvasTexture {
  if (listras) return listras;
  listras = canvasComLetra(256, 64, (c) => {
    for (let i = 0; i < 16; i++) { c.fillStyle = css(i % 2 ? PEROLA : P.limusineChapeleira); c.fillRect(i * 16, 0, 16, 64); }
    c.fillStyle = css(P.limusineRosaFundo); c.beginPath(); c.arc(64, 32, 15, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(PEROLA); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 24px ${FONTE_REDONDA}`; c.fillText('V', 64, 33);
  });
  listras.wrapS = THREE.RepeatWrapping;
  return listras;
}

// ================================================================ as peças

const tubo = (pts: THREE.Vector3[], raio: number, cor: number, lados = 7, fechado = false): THREE.Mesh =>
  new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, fechado, 'centripetal'), Math.max(8, pts.length * 5), raio, lados, fechado), toon(cor));

/** a roda: pneu de BANDA BRANCA larga, o aro rosa e a calota de cromo com as asinhas (eixo em `X`) */
function roda(lado: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.085, 10, 28).rotateY(Math.PI / 2), toon(P.onibusPneu)));
  const banda = new THREE.Mesh(new THREE.RingGeometry(0.17, 0.27, 28).rotateY(lado * Math.PI / 2), toon(PEROLA, { doubleSide: true }));
  banda.position.x = lado * 0.086; g.add(banda);
  const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 22).rotateZ(Math.PI / 2), toon(ROSA));
  aro.position.x = lado * 0.01; g.add(aro);
  const calota = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-lado * Math.PI / 2), toon(CROMO));
  calota.scale.set(0.45, 1, 1); calota.position.x = lado * 0.07; g.add(calota);
  for (let i = 0; i < 2; i++) {
    const asa = new THREE.Mesh(quina(0.02, 0.16, 0.03, 0.008), toon(CROMO));
    asa.position.x = lado * 0.13; asa.rotation.x = i * Math.PI / 2 + 0.4; g.add(asa);
  }
  return g;
}

/** o farol redondo no aro de cromo, com a viseira rosa por cima */
function farol(r: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.22, 8, 24), toon(CROMO)));
  const lente = new THREE.Mesh(new THREE.SphereGeometry(r * 0.95, 16, 10), toon(P.sorveteriaCreme, { glow: 0.6 }));
  lente.scale.z = 0.4; g.add(lente);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(r * 0.2, 8, 6), toon(P.metalWhite, { glow: 0.9 }));
  brilho.position.set(-r * 0.32, r * 0.35, r * 0.36); g.add(brilho);
  const viseira = new THREE.Mesh(new THREE.SphereGeometry(r * 1.22, 16, 8, 0, Math.PI, 0, Math.PI / 2), toon(ROSA));
  viseira.scale.set(1, 0.55, 0.9); viseira.rotation.set(-Math.PI / 2, 0, Math.PI);
  g.add(viseira);
  return g;
}

/** a lanterna de foguete na ponta do rabo de peixe (eixo em `−Z`) */
function lanternaDeFoguete(): THREE.Group {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 12).rotateX(-Math.PI / 2), toon(CROMO));
  cone.position.z = 0.02; g.add(cone);
  const bala = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), toon(P.rodaVermelho, { glow: 0.45 }));
  bala.scale.z = 1.5; bala.position.z = -0.06; g.add(bala);
  return g;
}

/** o FLAMINGO DOURADO do capô, num pé só, de pescoço em S (a assinatura dela) */
function flamingoDoCapo(): THREE.Group {
  const g = new THREE.Group();
  const ouro = toon(OURO);
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), ouro);
  corpo.scale.set(0.028, 0.03, 0.05); corpo.position.set(0, 0.16, -0.01); corpo.rotation.x = -0.2; g.add(corpo);
  for (const s of [-1, 1]) {
    const asa = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), ouro);
    asa.scale.set(0.01, 0.022, 0.045); asa.position.set(s * 0.024, 0.168, -0.02); asa.rotation.set(-0.25, s * 0.15, 0); g.add(asa);
  }
  g.add(tubo([new V(0, 0.18, 0.03), new V(0, 0.23, 0.05), new V(0, 0.27, 0.02), new V(0, 0.31, 0.03)], 0.008, OURO, 6));
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), ouro); cabeca.position.set(0, 0.315, 0.035); g.add(cabeca);
  const bico = new THREE.Mesh(new THREE.ConeGeometry(0.007, 0.03, 6), ouro); bico.position.set(0, 0.305, 0.058); bico.rotation.x = Math.PI / 2 + 0.7; g.add(bico);
  // a perna que fica (até a base) e a dobrada para trás
  g.add(tubo([new V(0, 0.14, 0), new V(0, 0.02, 0)], 0.004, OURO, 5));
  g.add(tubo([new V(0, 0.14, -0.01), new V(0, 0.1, -0.05), new V(0, 0.12, -0.08)], 0.004, OURO, 5));
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.025, 14), toon(CROMO)); base.position.y = 0.012; g.add(base);
  return g;
}

/** o sofá capitonê (o assento e o encosto contra a parede, com os botões dourados em lote): no `+X`, comprido em `z` */
function sofaCapitone(comprimento: number): THREE.Group {
  const g = new THREE.Group();
  const couro = toon(COURO);
  const assento = new THREE.Mesh(quina(0.46, 0.16, comprimento, 0.06), couro);
  g.add(assento);
  // (o encosto 4 cm mais curto que o assento: com o mesmo comprimento, as pontas dos dois caíam no mesmo plano)
  const encosto = new THREE.Mesh(quina(0.13, 0.42, comprimento - 0.04, 0.06), couro);
  encosto.position.set(0.2, 0.26, 0); encosto.rotation.z = -0.12; g.add(encosto);
  const vivo = new THREE.Mesh(quina(0.47, 0.03, comprimento + 0.01, 0.012), toon(P.limusineRosaFundo)); vivo.position.y = -0.06; g.add(vivo);
  // os botões do capitonê: no assento e no encosto
  const pontos: THREE.Vector3[] = [];
  const n = Math.round(comprimento / 0.2);
  for (let i = 0; i <= n; i++) {
    const z = -comprimento / 2 + 0.08 + (i / n) * (comprimento - 0.16);
    for (const x of [-0.1, 0.08]) pontos.push(new V(x, 0.083, z + (x > 0 ? 0.1 : 0)));
    for (const y of [0.18, 0.34]) pontos.push(new V(0.2 - 0.067 - (y - 0.26) * 0.12, y, z + (y > 0.3 ? 0.1 : 0)));
  }
  const botoes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.014, 8, 6), toon(OURO), pontos.length);
  const m = new THREE.Matrix4();
  pontos.forEach((p, i) => botoes.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)));
  g.add(botoes);
  return g;
}

/** a chapeleira redonda listrada, com a fita e o laço */
function chapeleira(r: number, alto: number): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(r, r, alto, 22, 1, true), toon(P.placaPintada, { mapa: listrasDaChapeleira() }));
  corpo.position.y = alto / 2; g.add(corpo);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.04, r * 1.04, 0.04, 22), toon(P.limusineChapeleira));
  tampa.position.y = alto; g.add(tampa);
  const fundo = new THREE.Mesh(new THREE.CircleGeometry(r, 22).rotateX(Math.PI / 2), toon(P.limusineChapeleira)); fundo.position.y = 0.002; g.add(fundo);
  const fita = new THREE.Mesh(new THREE.TorusGeometry(r * 1.045, 0.008, 5, 26), toon(P.limusineRosaFundo));
  fita.rotation.x = Math.PI / 2; fita.position.y = alto - 0.01; g.add(fita);
  for (const s of [-1, 1]) {
    const laco = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.limusineRosaFundo));
    laco.scale.set(0.035, 0.022, 0.012); laco.position.set(s * 0.035, alto + 0.04, 0); laco.rotation.z = s * 0.4; g.add(laco);
  }
  return g;
}

/** a câmera de fotógrafo antiga: o corpo, o fole, a lente e o flash de prato */
function cameraAntiga(): THREE.Group {
  const g = new THREE.Group();
  const preto = P.motoristaQuepe;
  g.add(new THREE.Mesh(quina(0.18, 0.15, 0.1, 0.02), toon(preto)));
  const fole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.08, 4).rotateX(Math.PI / 2).rotateZ(Math.PI / 4), toon(P.onibusPainel));
  fole.position.z = 0.09; g.add(fole);
  const lente = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16).rotateX(Math.PI / 2), toon(CROMO));
  lente.position.z = 0.15; g.add(lente);
  const vidro = new THREE.Mesh(new THREE.CircleGeometry(0.03, 16), toon(P.oculosEscurosLente)); vidro.position.z = 0.176; g.add(vidro);
  g.add(tubo([new V(0.09, 0.0, 0), new V(0.13, 0.06, 0), new V(0.13, 0.13, 0.0)], 0.007, CROMO, 5));
  const prato = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 6, 0, Math.PI * 2, 0, 0.9), toon(CROMO, { doubleSide: true }));
  prato.rotation.x = Math.PI / 2 + 0.2; prato.position.set(0.13, 0.15, 0.03); g.add(prato);
  const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), toon(P.metalWhite, { glow: 0.5 })); bulbo.position.set(0.13, 0.15, 0.06); g.add(bulbo);
  const alca = new THREE.Mesh(quina(0.12, 0.02, 0.02, 0.008), toon(P.woodDark)); alca.position.y = 0.085; g.add(alca);
  return g;
}

/** a taça de suco de morango com o canudinho */
function taca(): THREE.Group {
  const g = new THREE.Group();
  const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.012, 0.07, 12, 1, true), toon(P.onibusParaBrisa, { opacity: 0.4, doubleSide: true }));
  vidro.position.y = 0.105; g.add(vidro);
  const suco = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.013, 0.05, 12), toon(P.limusineRosa));
  suco.position.y = 0.095; g.add(suco);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.07, 6), toon(P.onibusParaBrisa, { opacity: 0.5 }));
  haste.position.y = 0.035; g.add(haste);
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.005, 12), toon(P.onibusParaBrisa, { opacity: 0.5 }));
  g.add(pe);
  g.add(tubo([new V(0.01, 0.09, 0), new V(0.018, 0.16, 0.005)], 0.0035, P.limusinePerola, 4));
  const morango = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toon(P.limusineTapete));
  morango.position.set(-0.026, 0.14, 0); morango.scale.y = 1.2; g.add(morango);
  return g;
}

/** o tapete vermelho enrolado, com a franja dourada nas pontas (o eixo em `X`) */
function tapeteEnrolado(comprimento: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, comprimento, 18).rotateZ(Math.PI / 2), toon(P.limusineTapete)));
  for (const s of [-1, 1]) {
    const espiral = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 16).rotateY(Math.PI / 2), toon(P.limusineRosaFundo));
    espiral.position.x = s * (comprimento / 2 + 0.002); g.add(espiral);
    const franja = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.04, 18, 1, true).rotateZ(Math.PI / 2), toon(OURO, { doubleSide: true }));
    franja.position.x = s * (comprimento / 2 + 0.02); g.add(franja);
  }
  return g;
}

export class LimusineDaValentina {
  readonly group = new THREE.Group();
  readonly valentina: Valentina | null = null;
  readonly pietro: Pavao | null = null;
  private readonly lata = new THREE.Group();
  private readonly rodas: THREE.Group[] = [];
  private relogio = 0;
  private velocidade = 0;
  private conversa = false;

  constructor(estacionado = false) {
    this.group.userData.peca = 'limusine-da-valentina';
    const casco = new THREE.Group();
    const por = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, pai: THREE.Object3D = casco): T => { o.position.set(x, y, z); pai.add(o); return o; };
    const malha = (geo: THREE.BufferGeometry, cor: number): THREE.Mesh => new THREE.Mesh(geo, toon(cor));

    // ------------------------------------------------------- a lata rosa, o forro de couro, o fundo e as caixas de roda
    casco.add(malha(geoDaPele(), ROSA));
    casco.add(new THREE.Mesh(geoDoForro(), toon(COURO, { doubleSide: true })));
    casco.add(new THREE.Mesh(geoDoFundo(), toon(P.onibusPainel, { doubleSide: true })));
    for (const z of [C.eixoFrente, C.eixoTras]) for (const lado of [-1, 1]) casco.add(new THREE.Mesh(geoDaCaixaDeRoda(z, lado), toon(P.onibusPainel, { doubleSide: true })));

    // ------------------------------------------------------- dos lados: a LANÇA PEROLADA, o friso de cromo, o "V" e os rabos de peixe
    for (const lado of [-1, 1]) {
      // a lança: larga atrás e afinando até a ponta da frente, como uma pena
      const z0 = -2.85, z1 = 2.55;
      const meio = (z: number): number => 0.47 + 0.02 * ((z - z0) / (z1 - z0));
      const larg = (z: number): number => 0.07 * (1 - 0.7 * Math.pow((z - z0) / (z1 - z0), 1.6));
      casco.add(malha(geoNaLateral(lado, z0, z1, (z) => meio(z) - larg(z), (z) => meio(z) + larg(z), 0.004), PEROLA));
      // o DUAS CORES dos anos 50: abaixo da lança, o rosa mais fundo até a soleira (sobe junto com o arco das rodas)
      casco.add(malha(geoNaLateral(lado, z0, z1, (z) => Math.min(soleira(z) + 0.012, meio(z) - larg(z) - 0.012),
        (z) => meio(z) - larg(z) - 0.008, 0.003, 120), P.limusineRosaFundo));
      for (const s of [-1, 1]) {
        const filete: THREE.Vector3[] = [];
        for (let i = 0; i <= 40; i++) { const z = z0 + (z1 - z0) * (i / 40); const { p, n } = naLateral(z, meio(z) + s * (larg(z) + 0.006), lado); filete.push(p.addScaledVector(n, 0.006)); }
        casco.add(tubo(filete, 0.006, CROMO, 5));
      }
      const friso: THREE.Vector3[] = [];
      for (let i = 0; i <= 40; i++) { const z = -2.95 + 5.6 * (i / 40); const { p, n } = naLateral(z, C.cintura + 0.08, lado); friso.push(p.addScaledVector(n, 0.006)); }
      casco.add(tubo(friso, 0.012, CROMO, 6));
      // o monograma dourado na porta da sala
      {
        const { p, n } = naLateral(-0.8, 0.7, lado);
        const v = p.addScaledVector(n, 0.012);
        casco.add(tubo([v.clone().add(new V(0, 0.07, -0.04)), v.clone(), v.clone().add(new V(0, 0.07, 0.04))], 0.009, OURO, 5));
      }
      const rabo = malha(geoDoRaboDePeixe(), ROSA);
      rabo.position.set(lado * (meiaLargura(-2.5) * OMBRO - 0.06) - 0.025, altoDaTampa(-2.5) + 0.01, 0);
      casco.add(rabo);
      por(lanternaDeFoguete(), lado * (meiaLargura(-2.5) * OMBRO - 0.06), altoDaTampa(-2.5) + 0.24, -3.08);
    }

    // ------------------------------------------------------- a cara: a grade oval, os quatro faróis, os para-choques e a placa
    {
      const zF = zDaLargura(0.5, true);
      const meiaG = 0.48, yG = 0.52;
      const aro: THREE.Vector3[] = [];
      for (let i = 0; i <= 28; i++) { const a = (i / 28) * Math.PI * 2; aro.push(new V(Math.cos(a) * meiaG, yG + Math.sin(a) * 0.11, zF + 0.04 - 0.08 * Math.pow(Math.cos(a), 2))); }
      casco.add(tubo(aro, 0.02, CROMO, 6, true));
      // as barras em pé, como uma grade de lareira chique
      for (let i = -6; i <= 6; i++) {
        const x = i * 0.065, h = 0.1 * Math.sqrt(Math.max(0, 1 - (x / meiaG) ** 2));
        casco.add(tubo([new V(x, yG - h, zF + 0.03 - 0.08 * (x / meiaG) ** 2), new V(x, yG + h, zF + 0.03 - 0.08 * (x / meiaG) ** 2)], 0.007, CROMO, 4));
      }
      for (const lado of [-1, 1]) for (const [x, r] of [[0.58, 0.085], [0.76, 0.075]] as const) {
        const f = por(farol(r), lado * x, 0.72, zDaLargura(x, true) - 0.01);
        f.rotation.y = lado * 0.14;
      }
      for (const ponta of [1, -1]) {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 18; i++) {
          const s = (i / 18) * 2 - 1, x = s * 0.94;
          const zb = zDaLargura(Math.max(0.05, Math.abs(x)), ponta > 0);
          pts.push(new V(x, 0.36, zb + ponta * 0.07));
        }
        casco.add(tubo(pts, 0.045, CROMO, 8));
        const zp = zDaLargura(0.2, ponta > 0);
        por(new THREE.Mesh(quina(0.42, 0.13, 0.016, 0.006), toon(CROMO)), 0, 0.25, zp + ponta * 0.05);
        const letras = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.12), toon(P.placaPintada, { mapa: placaDaValentina() }));
        letras.position.set(0, 0.25, zp + ponta * 0.06); if (ponta < 0) letras.rotation.y = Math.PI;
        casco.add(letras);
      }
      // o flamingo dourado no nariz do capô
      por(flamingoDoCapo(), 0, yDaTampa(2.7, 0) - 0.005, 2.7);
    }

    // ------------------------------------------------------- o para-brisa panorâmico, com a moldura de cromo e os espelhos
    {
      const zP = C.cabine.frente + 0.02, alto = 0.36, meia = meiaCabine(C.cabine.frente - 0.1) + 0.04;
      const noVidro = (u: number, v: number): THREE.Vector3 => new V(u * meia * (1 - 0.08 * v), C.borda + 0.02 + alto * v, zP - 0.1 * v - 0.22 * Math.pow(Math.abs(u), 4));
      const geo = new THREE.PlaneGeometry(1, 1, 16, 4);
      const pg = geo.attributes.position;
      for (let j = 0; j <= 4; j++) for (let i = 0; i <= 16; i++) { const p = noVidro((i / 16) * 2 - 1, 1 - j / 4); pg.setXYZ(j * 17 + i, p.x, p.y, p.z); }
      geo.computeVertexNormals();
      const vidro = new THREE.Mesh(geo, toon(P.onibusParaBrisa, { opacity: 0.3, doubleSide: true }));
      vidro.userData.semSombra = true; vidro.renderOrder = 3; this.lata.add(vidro);
      const moldura: THREE.Vector3[] = [];
      for (let i = 0; i <= 4; i++) moldura.push(noVidro(-1, i / 4));
      for (let i = 1; i <= 16; i++) moldura.push(noVidro(-1 + (i / 16) * 2, 1));
      for (let i = 3; i >= 0; i--) moldura.push(noVidro(1, i / 4));
      casco.add(tubo(moldura, 0.016, CROMO, 6));
      for (const lado of [-1, 1]) {
        const pe = new V(lado * (meia + 0.02), C.borda + 0.01, zP + 0.02);
        casco.add(tubo([pe, pe.clone().add(new V(lado * 0.05, 0.1, 0))], 0.01, CROMO, 5));
        const e = por(malha(new THREE.SphereGeometry(0.055, 12, 8), CROMO), pe.x + lado * 0.05, pe.y + 0.13, pe.z);
        e.scale.set(1, 0.8, 0.45);
      }
    }

    // ------------------------------------------------------- a frente: o painel com o vasinho, o volante de marfim, o banco alto do Pietro e a câmera
    {
      por(malha(quina(1.5, 0.12, 0.2, 0.05), ROSA), 0, C.borda - 0.05, C.cabine.frente - 0.08);
      por(malha(quina(1.3, 0.05, 0.03, 0.015), CROMO), 0, C.borda - 0.06, C.cabine.frente + 0.025);
      // o vasinho de flor no painel, do lado do passageiro (o toque dela)
      const vaso = por(malha(new THREE.CylinderGeometry(0.018, 0.026, 0.09, 10), PEROLA), 0.35, C.borda + 0.06, C.cabine.frente - 0.1);
      vaso.rotation.x = 0.1;
      casco.add(tubo([new V(0.35, C.borda + 0.1, C.cabine.frente - 0.1), new V(0.36, C.borda + 0.2, C.cabine.frente - 0.12)], 0.004, P.pavaoCauda, 4));
      por(malha(new THREE.SphereGeometry(0.03, 10, 8), P.limusineRosaFundo), 0.36, C.borda + 0.21, C.cabine.frente - 0.12);
      // o volante de marfim, alto, para o banco alto
      const yv = 1.1, zv = C.pietro.z + 0.34;
      const vol = por(malha(new THREE.TorusGeometry(0.17, 0.016, 8, 30), PEROLA), C.pietro.x, yv, zv);
      vol.rotation.x = -0.9;
      casco.add(tubo([new V(C.pietro.x, yv, zv), new V(C.pietro.x, C.borda - 0.06, C.cabine.frente - 0.1)], 0.02, CROMO, 6));
      for (const a of [0, 2.1, 4.2]) {
        const raio = new V(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0).applyEuler(new THREE.Euler(-0.9, 0, 0));
        casco.add(tubo([new V(C.pietro.x, yv, zv), new V(C.pietro.x + raio.x, yv + raio.y, zv + raio.z)], 0.008, CROMO, 4));
      }
      // o banco ALTO do motorista: o pé de cromo e a almofada capitonê
      por(malha(new THREE.CylinderGeometry(0.06, 0.12, C.pietro.banco - 0.08 - C.piso, 14), CROMO), C.pietro.x, (C.pietro.banco - 0.08 + C.piso) / 2, C.pietro.z);
      por(malha(quina(0.44, 0.1, 0.44, 0.045), COURO), C.pietro.x, C.pietro.banco - 0.05, C.pietro.z);
      por(malha(quina(0.45, 0.025, 0.45, 0.01), P.limusineRosaFundo), C.pietro.x, C.pietro.banco - 0.095, C.pietro.z);
      // o banco do passageiro, baixo, com a câmera de fotógrafo em cima
      por(malha(quina(0.46, 0.14, 0.44, 0.05), COURO), 0.4, C.sofa.assento - 0.07, C.pietro.z);
      const cam = por(cameraAntiga(), 0.4, C.sofa.assento + 0.075, C.pietro.z);
      cam.rotation.y = -0.5;
    }

    // ------------------------------------------------------- a DIVISÓRIA com o minibar e as taças
    {
      const zd = C.divisoria;
      por(malha(quina(1.5, 0.5, 0.12, 0.04), COURO), 0, C.piso + 0.25, zd);
      por(malha(quina(1.52, 0.06, 0.15, 0.025), ROSA), 0, C.piso + 0.53, zd);
      // o minibar do lado da sala: a prateleirinha e as duas taças de suco de morango
      por(malha(quina(0.5, 0.03, 0.14, 0.012), P.limusineRosaFundo), 0.2, C.piso + 0.56, zd - 0.12);
      por(taca(), 0.08, C.piso + 0.575, zd - 0.12);
      por(taca(), 0.3, C.piso + 0.575, zd - 0.1).rotation.y = 0.8;
    }

    // ------------------------------------------------------- a sala: o tapete vermelho, o sofá capitonê e as chapeleiras
    {
      por(malha(quina(0.72, 0.012, 1.95, 0.004), P.limusineTapete), -0.05, C.piso + 0.012, (C.divisoria + C.bancoDeTras) / 2 - 0.05);
      for (const x of [-0.41, 0.31]) por(malha(quina(0.02, 0.016, 1.95, 0.004), OURO), x, C.piso + 0.015, (C.divisoria + C.bancoDeTras) / 2 - 0.05);
      const comp = C.sofa.z1 - C.sofa.z0;
      por(sofaCapitone(comp), C.sofa.x, C.sofa.assento - 0.08, (C.sofa.z0 + C.sofa.z1) / 2);
      // o PUFE capitonê na frente dela, na altura do sofá: as perninhas dobradas vão em cima dele (sentada, o flamingo
      // estica a coxa para a frente na altura do assento — sem o pufe, os joelhos ficavam no ar)
      {
        const yTopo = C.sofa.assento - 0.003, alto = yTopo - C.piso;
        const pufe = por(malha(new THREE.CylinderGeometry(0.19, 0.17, alto - 0.04, 24), COURO), C.valentina.x - 0.32, C.piso + (alto - 0.04) / 2, C.valentina.z);
        void pufe;
        const almofada = por(malha(new THREE.SphereGeometry(0.19, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), COURO), C.valentina.x - 0.32, yTopo - 0.04, C.valentina.z);
        almofada.scale.y = 0.21;
        por(malha(new THREE.TorusGeometry(0.19, 0.012, 6, 28).rotateX(Math.PI / 2), P.limusineRosaFundo), C.valentina.x - 0.32, yTopo - 0.042, C.valentina.z);
        for (const [x, z] of [[0, 0], [0.09, 0], [-0.09, 0], [0, 0.09], [0, -0.09]] as const) {
          const r = Math.hypot(x, z);
          por(malha(new THREE.SphereGeometry(0.012, 8, 6), OURO), C.valentina.x - 0.32 + x, yTopo - 0.04 + 0.04 * Math.sqrt(1 - (r / 0.19) ** 2) + 0.003, C.valentina.z + z);
        }
      }
      // o banco de trás, de lado a lado, e as chapeleiras empilhadas nele
      por(malha(quina(1.4, 0.16, 0.36, 0.06), COURO), 0, C.sofa.assento - 0.08, C.bancoDeTras);
      por(malha(quina(1.36, 0.36, 0.12, 0.06), COURO), 0, C.sofa.assento + 0.15, C.bancoDeTras - 0.17);
      por(chapeleira(0.17, 0.2), -0.42, C.sofa.assento, C.bancoDeTras + 0.02);
      por(chapeleira(0.13, 0.17), -0.4, C.sofa.assento + 0.24, C.bancoDeTras + 0.04).rotation.y = 0.5;
      const deitada = por(chapeleira(0.12, 0.14), -0.08, C.sofa.assento + 0.12, C.bancoDeTras + 0.04);
      deitada.rotation.set(0.0, 0.3, Math.PI / 2 - 0.15);
    }

    // ------------------------------------------------------- atrás: o TAPETE VERMELHO enrolado em cima do porta-malas
    {
      const zt = -2.55;
      const t = por(tapeteEnrolado(1.2), 0, yDaTampa(zt, 0) + 0.1, zt);
      t.rotation.y = 0.02;
      for (const x of [-0.4, 0.4]) {
        const y0 = yDaTampa(zt, x);
        casco.add(tubo([new V(x, y0, zt + 0.15), new V(x, y0 + 0.17, zt + 0.08), new V(x, y0 + 0.22, zt), new V(x, y0 + 0.17, zt - 0.08), new V(x, y0, zt - 0.15)], 0.012, OURO, 5));
      }
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
      // ----------------------------------------------------- o Pietro ao volante, no banco alto
      const pietro = new Pavao({ minX: -0.05, maxX: 0.05, minZ: -0.05, maxZ: 0.05 });
      pietro.entrarEmServico();
      pietro.aoVolante = { volante: 0, olhar: 0 };
      // (o quadril dele, em 0,40, pousa no tampo do banco alto)
      pietro.group.position.set(C.pietro.x, C.pietro.banco - 0.38, C.pietro.z - 0.02);
      this.lata.add(pietro.group);
      this.pietro = pietro;
      // ----------------------------------------------------- a Valentina no sofá, virada para o Bebito, de óculos gatinho
      const v = new Valentina({ minX: -0.05, maxX: 0.05, minZ: -0.05, maxZ: 0.05 });
      v.entrarEmServico();
      v.sentarEm(C.valentina.x, C.valentina.z, -Math.PI / 2, C.sofa.assento);
      this.lata.add(v.group);
      // (o look de limusine é vestido já dentro do carro: com pai, a peça nova se junta como as de nascença)
      v.vestir(LOOK_DE_LIMUSINE);
      this.valentina = v;
      this.update(0, 0, false);
    } else {
      fundirComoFundo(this.group);
    }
  }

  update(dt: number, distancia: number, conversando: boolean): void {
    this.relogio += dt;
    this.conversa = conversando;
    const v = dt > 0 ? distancia / dt : 0;
    this.velocidade += (v - this.velocidade) * Math.min(1, dt * 4);
    const anda = preso(this.velocidade / 7);
    for (const r of this.rodas) r.rotation.x += distancia / C.roda;
    // o molejo macio de carro comprido
    this.lata.position.y = Math.sin(this.relogio * 2.9) * 0.01 * anda;
    this.lata.rotation.x = Math.sin(this.relogio * 1.9) * 0.004 * anda;
    this.lata.rotation.z = Math.sin(this.relogio * 1.5) * 0.005 * anda;
    if (this.pietro?.aoVolante) {
      // conversando, ele vira a cabeça para o Bebito (o −X do carro: giro negativo)
      this.pietro.aoVolante.olhar = this.conversa ? -0.9 : 0;
      this.pietro.update(dt);
    }
    this.valentina?.update(dt);
  }
}
