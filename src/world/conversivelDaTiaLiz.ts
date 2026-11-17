import * as THREE from 'three';
import { TiaLiz } from '../entities/bichos/TiaLiz';
import { Luna, Sol, Estrella, type CoelhaDaTorcida } from '../entities/bichos/CoelhaDaTorcida';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo, juntarPorCor } from './fundir';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { FONTE_FORMA } from './halloween/barracaDoWalter';
import { miniArepa } from './cozinhaDeAcampamento';

/**
 * ================================ O CONVERSÍVEL DA TIA LIZ E DAS IRMÃS
 *
 * O primeiro carro da turma da ESCOLA (`docs/CARROS-DA-ESCOLA.md`), da ideia do
 * Renan: "e se a Tia Liz levasse as três irmãs no conversível? Daí o
 * conversível seria da cor dos Gatitos, mas com alguns detalhes da Venezuela, e
 * na história elas quatro vieram juntas da Venezuela."
 *
 * - um conversível grande e antigo (dos anos 50, de rabo de peixe e muito
 *   cromo), no AZUL e AMARELO dos Gatitos — que já são duas das três cores da
 *   bandeira venezuelana;
 * - os detalhes da Venezuela: o ARCO DAS OITO ESTRELAS brancas no capô, o
 *   FILETE VERMELHO dando a volta, a BANDEIRINHA na antena, a MALA ANTIGA de
 *   viagem amarrada no porta-malas (com os adesivos "VENEZUELA" e "BRASIL"),
 *   o CUATRO (o violãozinho venezuelano) no banco de trás e a CESTA de
 *   arepinhas da Tia Liz no banco da frente;
 * - a faixa de pano "VAI, GATITOS!" amarrada nas portas: é o carro da torcida;
 * - a TIA LIZ dirige, a LUNA vai do lado, tímida, numa almofadinha e de óculos
 *   de sol enormes, e a SOL e a ESTRELLA vão em pé no banco de trás, de pompom.
 *
 * O contrato é o dos veículos da estrada: base em `y = 0`, a frente no `+Z`, o
 * lado do Bebito é o `−X` (o lado da Tia Liz, que dirige),
 * `update(dt, distancia, conversando)`; `estacionado` monta a versão vazia,
 * juntada como fundo. A interação na estrada vem depois (pedido do Renan:
 * "foque no carro").
 *
 * A LATARIA É UMA PELE DE FATIAS (o molde do 2CV do Jean-Luc): a planta é uma
 * superelipse comprida, o perfil é o capô reto e longo, a cintura baixa na
 * cabine aberta e o porta-malas reto; por cima vão os rabos de peixe, o
 * para-brisa panorâmico e o cromo.
 */
export const CONVERSIVEL = {
  /** meio comprimento e meia largura na cintura */
  meio: 2.2, meiaLargura: 0.94,
  chao: 0.3, piso: 0.38, cintura: 0.58, borda: 0.9,
  roda: 0.33, eixoFrente: 1.34, eixoTras: -1.32, bitola: 0.78,
  /** a cabine aberta (é conversível), de onde a onde */
  cabine: { tras: -1.18, frente: 0.48 },
  /** o tampo dos dois bancos inteiriços e onde eles estão */
  banco: 0.6, bancoDaFrente: 0.06, bancoDeTras: -0.84,
  /** onde cada uma vai (o `x`; a Tia Liz no lado do Bebito) */
  liz: -0.4, luna: 0.4, sol: -0.32, estrella: 0.32,
} as const;
const C = CONVERSIVEL;
const ARCO = 0.43;
const V = THREE.Vector3;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const preso = (x: number): number => Math.max(0, Math.min(1, x));
const suave = (x: number): number => { const k = preso(x); return k * k * (3 - 2 * k); };
const se = (t: number, n: number): number => Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, Math.abs(t)), n)), 1 / n);
const AZUL = P.gatitosAzul;
const AMARELO = P.gatitosAmarelo;

// ================================================================ a pele

const meiaLargura = (z: number): number => C.meiaLargura * se(z / C.meio, z > 0 ? 3.4 : 3.0);
function altoDaTampa(z: number): number {
  const f = C.cabine.frente, t = C.cabine.tras;
  if (z > f) return C.borda - 0.2 * Math.pow((z - f) / (C.meio - f), 3.2);
  if (z < t) return C.borda - 0.17 * Math.pow((t - z) / (C.meio + t), 2.6);
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
  return Math.abs(t) >= 1 ? 0 : (meiaLargura(z) * OMBRO - 0.1) * se(t, 6);
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
  const N = 80, zs: number[] = [];
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

/** uma fita assentada na lateral, de `z0` a `z1`, entre as alturas `y0` e `y1` (a lança amarela, a faixa de pano) */
function geoNaLateral(lado: number, z0: number, z1: number, y0: number, y1: number, fora: number, n = 40): THREE.BufferGeometry {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const z = z0 + (z1 - z0) * (i / n);
    for (let j = 0; j <= 2; j++) {
      const y = y0 + (y1 - y0) * (j / 2);
      const { p, n: nn } = naLateral(z, y, lado);
      p.addScaledVector(nn, fora);
      pos.push(p.x, p.y, p.z);
      uv.push(lado > 0 ? 1 - i / n : i / n, j / 2);
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) {
    const a = i * 3 + j, b = a + 1, c = a + 3, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // (a face olha para fora)
  if (geo.attributes.normal.getX(4) * lado < 0) {
    const inv: number[] = [];
    for (let i = 0; i < idx.length; i += 3) inv.push(idx[i], idx[i + 2], idx[i + 1]);
    geo.setIndex(inv);
    geo.computeVertexNormals();
  }
  return geo;
}

/** o rabo de peixe: a barbatana que sobe atrás, em cima do para-lama, com a ponta pontuda */
function geoDoRaboDePeixe(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // no plano (−z, y): o `x` da forma é o `−z` do carro, para a extrusão girada cair certa
  s.moveTo(0.75, 0);
  s.quadraticCurveTo(1.5, 0.02, 2.12, 0.27);
  s.lineTo(2.2, 0.2);
  s.quadraticCurveTo(2.16, 0.02, 2.0, -0.04);
  s.lineTo(0.75, -0.04);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 10 });
  geo.rotateY(Math.PI / 2);
  return geo;
}

// ================================================================ as pinturas

let faixa: THREE.CanvasTexture | null = null;
/** a faixa de pano da porta: "VAI, GATITOS!" pintado à mão, com os pompons nas pontas */
function faixaDaTorcida(): THREE.CanvasTexture {
  if (faixa) return faixa;
  faixa = canvasComLetra(512, 128, (c) => {
    c.fillStyle = css(P.gatitosBranco); c.fillRect(0, 0, 512, 128);
    c.strokeStyle = css(AMARELO); c.lineWidth = 10; c.strokeRect(8, 8, 496, 112);
    c.fillStyle = css(P.gatitosAzulEscuro); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 62px ${FONTE_FORMA}`; c.fillText('VAI, GATITOS!', 256, 68);
    for (const x of [34, 478]) {
      c.fillStyle = css(AMARELO); c.beginPath(); c.arc(x, 64, 22, 0, Math.PI * 2); c.fill();
      c.fillStyle = css(AZUL); c.beginPath(); c.arc(x, 64, 12, 0, Math.PI * 2); c.fill();
    }
  });
  return faixa;
}

let placa: THREE.CanvasTexture | null = null;
function placaDosGatitos(): THREE.CanvasTexture {
  if (placa) return placa;
  placa = canvasComLetra(320, 96, (c) => {
    c.fillStyle = css(P.gatitosBranco); c.fillRect(0, 0, 320, 96);
    c.fillStyle = css(P.gatitosAzulEscuro); c.fillRect(0, 0, 320, 22);
    c.strokeStyle = css(P.gatitosIlhos); c.lineWidth = 4; c.strokeRect(2, 2, 316, 92);
    c.fillStyle = css(P.gatitosBranco); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `800 15px ${FONTE_FORMA}`; c.fillText('ESCOLA DO GATITO', 160, 12);
    c.fillStyle = css(P.gatitosIlhos); c.font = `900 50px ${FONTE_FORMA}`; c.fillText('GATITOS', 160, 60);
  });
  return placa;
}

let adesivos: THREE.CanvasTexture | null = null;
/** os adesivos de viagem da mala: "VENEZUELA" (com o arco das estrelas), "BRASIL" e o aviãozinho no meio */
function adesivosDaMala(): THREE.CanvasTexture {
  if (adesivos) return adesivos;
  adesivos = canvasComLetra(512, 256, (c) => {
    c.fillStyle = css(P.tiaLizMalaCouro); c.fillRect(0, 0, 512, 256);
    // VENEZUELA: o oval amarelo, azul e vermelho com o arco das estrelas
    c.save(); c.translate(130, 128); c.rotate(-0.12);
    c.beginPath(); c.ellipse(0, 0, 110, 72, 0, 0, Math.PI * 2); c.clip();
    for (const [i, cor] of [AMARELO, P.venezuelaAzul, P.venezuelaVermelho].entries()) { c.fillStyle = css(cor); c.fillRect(-110, -72 + i * 48, 220, 48); }
    c.fillStyle = '#ffffff';
    for (let k = 0; k < 8; k++) { const a = Math.PI * (0.2 + 0.6 * (k / 7)); c.beginPath(); c.arc(Math.cos(a) * 38, 18 - Math.sin(a) * 30, 4.5, 0, Math.PI * 2); c.fill(); }
    c.restore();
    c.save(); c.translate(130, 128); c.rotate(-0.12);
    c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 26px ${FONTE_FORMA}`; c.fillText('VENEZUELA', 0, -46); c.restore();
    // BRASIL: o losango amarelo no verde, com o círculo azul
    c.save(); c.translate(390, 120); c.rotate(0.15);
    c.fillStyle = css(P.brasilVerde); c.fillRect(-92, -62, 184, 124);
    c.fillStyle = css(AMARELO); c.beginPath(); c.moveTo(0, -52); c.lineTo(80, 0); c.lineTo(0, 52); c.lineTo(-80, 0); c.closePath(); c.fill();
    c.fillStyle = css(P.venezuelaAzul); c.beginPath(); c.arc(0, 0, 26, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `900 22px ${FONTE_FORMA}`; c.fillText('BRASIL', 0, 84);
    c.restore();
    // o aviãozinho do caminho entre os dois
    c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.setLineDash([10, 8]);
    c.beginPath(); c.moveTo(220, 150); c.quadraticCurveTo(262, 90, 300, 130); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(300, 128); c.lineTo(286, 116); c.lineTo(290, 140); c.closePath(); c.fill();
  });
  return adesivos;
}

let bandeira: THREE.CanvasTexture | null = null;
/** a bandeirinha da antena: amarelo, azul e vermelho, com o arco das oito estrelas no azul */
function bandeirinha(): THREE.CanvasTexture {
  if (bandeira) return bandeira;
  bandeira = canvasComLetra(192, 128, (c) => {
    for (const [i, cor] of [AMARELO, P.venezuelaAzul, P.venezuelaVermelho].entries()) { c.fillStyle = css(cor); c.fillRect(0, i * 43, 192, 43); }
    c.fillStyle = '#ffffff';
    for (let k = 0; k < 8; k++) { const a = Math.PI * (0.15 + 0.7 * (k / 7)); c.beginPath(); c.arc(96 + Math.cos(a) * 34, 76 - Math.sin(a) * 22, 4, 0, Math.PI * 2); c.fill(); }
  });
  return bandeira;
}

// ================================================================ as peças

const tubo = (pts: THREE.Vector3[], raio: number, cor: number, lados = 7, fechado = false): THREE.Mesh =>
  new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, fechado, 'centripetal'), Math.max(8, pts.length * 5), raio, lados, fechado), toon(cor));

/** a estrela de cinco pontas extrudada (as oito do capô e o enfeite do nariz) */
function geoEstrela(r: number, fundo: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  for (let k = 0; k < 10; k++) {
    const a = Math.PI / 2 + (k / 10) * Math.PI * 2, rr = k % 2 ? r * 0.45 : r;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    if (k) s.lineTo(x, y); else s.moveTo(x, y);
  }
  s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: fundo, bevelEnabled: true, bevelThickness: fundo * 0.4, bevelSize: r * 0.08, bevelSegments: 1 });
}

/** a roda antiga: pneu de BANDA BRANCA larga, a calota de cromo com a cúpula e as asinhas (eixo em `X`) */
function roda(lado: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.085, 10, 28).rotateY(Math.PI / 2), toon(P.onibusPneu)));
  const banda = new THREE.Mesh(new THREE.RingGeometry(0.17, 0.27, 28).rotateY(lado * Math.PI / 2), toon(P.gatitosBranco, { doubleSide: true }));
  banda.position.x = lado * 0.086; g.add(banda);
  const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 22).rotateZ(Math.PI / 2), toon(AZUL));
  aro.position.x = lado * 0.01; g.add(aro);
  const calota = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-lado * Math.PI / 2), toon(P.churrascoInox));
  calota.scale.set(0.45, 1, 1); calota.position.x = lado * 0.07; g.add(calota);
  for (let i = 0; i < 2; i++) {
    const asa = new THREE.Mesh(quina(0.02, 0.16, 0.03, 0.008), toon(P.churrascoInox));
    asa.position.x = lado * 0.13; asa.rotation.x = i * Math.PI / 2 + 0.4; g.add(asa);
  }
  return g;
}

/** o farol redondo grandão, no aro de cromo com a viseira por cima */
function farol(): THREE.Group {
  const g = new THREE.Group();
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 8, 24), toon(P.churrascoInox));
  g.add(aro);
  const lente = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 10), toon(P.sorveteriaCreme, { glow: 0.6 }));
  lente.scale.z = 0.4; g.add(lente);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), toon(P.metalWhite, { glow: 0.9 }));
  brilho.position.set(-0.035, 0.038, 0.04); g.add(brilho);
  const viseira = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 8, 0, Math.PI, 0, Math.PI / 2), toon(AZUL));
  viseira.scale.set(1, 0.55, 0.9); viseira.rotation.set(-Math.PI / 2, 0, Math.PI); viseira.position.set(0, 0.035, 0.0);
  g.add(viseira);
  return g;
}

/** a lanterna de foguete na ponta do rabo de peixe: o cone de cromo e a bala vermelha acesa (eixo em `−Z`) */
function lanternaDeFoguete(): THREE.Group {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 12).rotateX(-Math.PI / 2), toon(P.churrascoInox));
  cone.position.z = 0.02; g.add(cone);
  const bala = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), toon(P.rodaVermelho, { glow: 0.45 }));
  bala.scale.z = 1.5; bala.position.z = -0.06; g.add(bala);
  return g;
}

/** o banco inteiriço de rolinhos (o "tuck and roll"), creme com o vivo azul, e o encosto */
function bancoInteirico(largura: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(quina(largura, 0.14, 0.5, 0.05), toon(P.gatitosCreme)));
  for (let i = 0; i < 7; i++) {
    const rolo = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.42, 3, 8).rotateX(Math.PI / 2), toon(P.gatitosCreme));
    rolo.position.set(-largura / 2 + 0.12 + i * ((largura - 0.24) / 6), 0.07, 0); g.add(rolo);
  }
  const vivo = new THREE.Mesh(quina(largura + 0.012, 0.03, 0.512, 0.012), toon(AZUL)); vivo.position.y = -0.05; g.add(vivo);
  const encosto = new THREE.Group();
  encosto.position.set(0, 0.04, -0.24); encosto.rotation.x = -0.2;
  const costas = new THREE.Mesh(quina(largura, 0.5, 0.13, 0.06), toon(P.gatitosCreme)); costas.position.y = 0.25; encosto.add(costas);
  for (let i = 0; i < 7; i++) {
    const rolo = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.4, 3, 8), toon(P.gatitosCreme));
    rolo.position.set(-largura / 2 + 0.12 + i * ((largura - 0.24) / 6), 0.26, 0.05); encosto.add(rolo);
  }
  const topo = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, largura - 0.1, 4, 10).rotateZ(Math.PI / 2), toon(AZUL));
  topo.position.y = 0.5; encosto.add(topo);
  g.add(encosto);
  return g;
}

/** a mala antiga de viagem: couro, as quinas de latão, as duas cintas, a alça e os adesivos */
function malaDeViagem(): THREE.Group {
  const g = new THREE.Group();
  const L = 0.8, A = 0.32, F = 0.5;
  g.add(new THREE.Mesh(quina(L, A, F, 0.035), toon(P.tiaLizMalaCouro)));
  const tampa = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.08, A - 0.06), toon(P.placaPintada, { mapa: adesivosDaMala() }));
  tampa.position.set(0, 0, F / 2 + 0.004); g.add(tampa);
  for (const x of [-0.24, 0.24]) {
    const cinta = new THREE.Mesh(quina(0.06, A + 0.012, F + 0.012, 0.01), toon(P.woodDark)); cinta.position.x = x; g.add(cinta);
  }
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const canto = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toon(P.carrinhoLatao));
    canto.position.set(x * (L / 2 - 0.01), A / 2 - 0.01, z * (F / 2 - 0.01)); g.add(canto);
  }
  g.add(tubo([new V(-0.12, A / 2, 0), new V(0, A / 2 + 0.08, 0), new V(0.12, A / 2, 0)], 0.015, P.woodDark, 6));
  return g;
}

/** o cuatro: o violãozinho venezuelano de quatro cordas (o corpo de oito, o braço e a cabeça com as tarraxas) */
function cuatro(): THREE.Group {
  const g = new THREE.Group();
  for (const [y, r] of [[0, 0.13], [0.15, 0.1]] as const) {
    const bojo = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.07, 20).rotateX(Math.PI / 2), toon(P.wood));
    bojo.position.y = y; g.add(bojo);
  }
  const boca = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), toon(P.woodDark)); boca.position.set(0, 0.09, 0.037); g.add(boca);
  const braco = new THREE.Mesh(quina(0.05, 0.36, 0.03, 0.01), toon(P.woodDark)); braco.position.set(0, 0.42, 0.01); g.add(braco);
  const cabeca = new THREE.Mesh(quina(0.07, 0.11, 0.03, 0.012), toon(P.woodDark)); cabeca.position.set(0, 0.65, 0.0); g.add(cabeca);
  const cavalete = new THREE.Mesh(quina(0.08, 0.015, 0.012, 0.004), toon(P.woodDark)); cavalete.position.set(0, -0.04, 0.04); g.add(cavalete);
  for (let i = 0; i < 4; i++) {
    const x = -0.015 + i * 0.01;
    g.add(tubo([new V(x * 1.5, -0.04, 0.042), new V(x, 0.6, 0.03)], 0.0018, P.metalWhite, 3));
  }
  return g;
}

/** a cesta de vime da Tia Liz com as arepinhas e a garrafa de café */
function cestaDeArepas(): THREE.Group {
  const g = new THREE.Group();
  const cesta = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.15, 18, 1, true), toon(P.vimeCesta, { doubleSide: true }));
  cesta.scale.z = 0.75; cesta.position.y = 0.075; g.add(cesta);
  const fundo = new THREE.Mesh(new THREE.CircleGeometry(0.13, 18).rotateX(-Math.PI / 2), toon(P.vimeCesta)); fundo.scale.z = 0.75; fundo.position.y = 0.005; g.add(fundo);
  const pano = new THREE.Mesh(new THREE.CircleGeometry(0.15, 18).rotateX(-Math.PI / 2), toon(P.venezuelaVermelho, { doubleSide: true })); pano.scale.z = 0.72; pano.position.y = 0.12; g.add(pano);
  for (const [x, z, giro] of [[-0.06, 0.02, 0.3], [0.05, -0.03, -0.2], [0.0, 0.05, 1.2]] as const) {
    const a = miniArepa(); a.scale.setScalar(1.3); a.position.set(x, 0.13, z); a.rotation.set(0.15, giro, 0); g.add(a);
  }
  g.add(tubo([new V(-0.15, 0.15, 0), new V(0, 0.3, 0), new V(0.15, 0.15, 0)], 0.012, P.vimeCesta, 6));
  const garrafa = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 12), toon(P.gatitosAzulEscuro)); garrafa.position.set(0.1, 0.14, 0.06); g.add(garrafa);
  return g;
}

/** os óculos de sol ENORMES da Luna: dois redondões fumê com o aro amarelo dos Gatitos e a ponte (no referencial da cabeça dela) */
function oculosDaLuna(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'oculos-da-luna';
  for (const lado of [-1, 1]) {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.011, 8, 24), toon(AMARELO));
    aro.position.set(lado * 0.064, 0.022, 0.15); aro.rotation.y = lado * 0.18; g.add(aro);
    const lente = new THREE.Mesh(new THREE.CircleGeometry(0.052, 22), toon(P.oculosEscurosLente, { doubleSide: true }));
    lente.name = 'lente-da-luna';
    lente.position.set(lado * 0.064, 0.022, 0.149); lente.rotation.y = lado * 0.18; g.add(lente);
    const brilho = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.045), toon(P.metalWhite, { glow: 0.8 }));
    brilho.position.set(lado * 0.064 - 0.015, 0.03, 0.152); brilho.rotation.set(0, lado * 0.18, -0.6); g.add(brilho);
    g.add(tubo([new V(lado * 0.118, 0.03, 0.135), new V(lado * 0.15, 0.03, 0.06), new V(lado * 0.148, 0.02, -0.01)], 0.007, AMARELO, 5));
  }
  g.add(tubo([new V(-0.012, 0.03, 0.162), new V(0, 0.038, 0.168), new V(0.012, 0.03, 0.162)], 0.008, AMARELO, 5));
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = false; });
  return g;
}

export class ConversivelDaTiaLiz {
  readonly group = new THREE.Group();
  readonly tiaLiz: TiaLiz | null = null;
  readonly irmas: CoelhaDaTorcida[] = [];
  private readonly lata = new THREE.Group();
  private readonly rodas: THREE.Group[] = [];
  private readonly flamula: THREE.Mesh | null = null;
  private relogio = 0;
  private velocidade = 0;
  private proximaTorcida = 1.5;
  private conversa = false;
  /** o confete da torcida: um lote de papeizinhos que sobe do banco de trás e cai em volta dos dois carros */
  private readonly confete: THREE.InstancedMesh | null = null;
  private readonly papeis: Array<{ p: THREE.Vector3; v: THREE.Vector3; giro: THREE.Vector3; idade: number }> = [];
  private readonly voando: Array<{ peca: THREE.Object3D; t: number; de: THREE.Vector3; para: THREE.Vector3 }> = [];
  /** quantos confetes já subiram (o teste confere) */
  confetes = 0;

  constructor(estacionado = false) {
    this.group.userData.peca = 'conversivel-da-tia-liz';
    const casco = new THREE.Group();
    const por = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, pai: THREE.Object3D = casco): T => { o.position.set(x, y, z); pai.add(o); return o; };
    const malha = (geo: THREE.BufferGeometry, cor: number): THREE.Mesh => new THREE.Mesh(geo, toon(cor));

    // ------------------------------------------------------- a lata azul, o forro, o fundo e as caixas de roda
    casco.add(malha(geoDaPele(), AZUL));
    casco.add(new THREE.Mesh(geoDoForro(), toon(P.gatitosCreme, { doubleSide: true })));
    casco.add(new THREE.Mesh(geoDoFundo(), toon(P.onibusPainel, { doubleSide: true })));
    for (const z of [C.eixoFrente, C.eixoTras]) for (const lado of [-1, 1]) casco.add(new THREE.Mesh(geoDaCaixaDeRoda(z, lado), toon(P.onibusPainel, { doubleSide: true })));

    // ------------------------------------------------------- dos lados: a lança AMARELA com o filete vermelho, a faixa de pano e os rabos de peixe
    for (const lado of [-1, 1]) {
      casco.add(malha(geoNaLateral(lado, -2.0, 1.95, 0.44, 0.54, 0.004), AMARELO));
      for (const y of [0.425, 0.555]) {
        const filete: THREE.Vector3[] = [];
        for (let i = 0; i <= 30; i++) { const z = -2.0 + 3.95 * (i / 30); const { p, n } = naLateral(z, y, lado); filete.push(p.addScaledVector(n, 0.006)); }
        casco.add(tubo(filete, 0.007, P.venezuelaVermelho, 5));
      }
      // o friso de cromo na cintura, de ponta a ponta
      const friso: THREE.Vector3[] = [];
      for (let i = 0; i <= 30; i++) { const z = -2.05 + 4.05 * (i / 30); const { p, n } = naLateral(z, C.cintura + 0.07, lado); friso.push(p.addScaledVector(n, 0.006)); }
      casco.add(tubo(friso, 0.012, P.churrascoInox, 6));
      // a faixa de pano "VAI, GATITOS!", amarrada na porta pelas pontas
      const pano = new THREE.Mesh(geoNaLateral(lado, -0.95, 0.38, 0.62, 0.84, 0.012, 20), toon(P.placaPintada, { mapa: faixaDaTorcida(), doubleSide: true }));
      pano.userData.semSombra = true; casco.add(pano);
      for (const z of [-0.95, 0.38]) {
        const { p, n } = naLateral(z, 0.84, lado);
        const pe = p.clone().addScaledVector(n, 0.012);
        casco.add(tubo([pe, pe.clone().add(new V(0, 0.07, 0)).addScaledVector(n, -0.02)], 0.008, P.woodDark, 4));
      }
      // o rabo de peixe, em cima do para-lama de trás
      const rabo = malha(geoDoRaboDePeixe(), AZUL);
      rabo.position.set(lado * (meiaLargura(-1.6) * OMBRO - 0.06) - 0.025, altoDaTampa(-1.6) + 0.01, 0);
      casco.add(rabo);
      por(lanternaDeFoguete(), lado * (meiaLargura(-1.6) * OMBRO - 0.06), altoDaTampa(-1.6) + 0.22, -2.15);
    }

    // ------------------------------------------------------- o capô: o ARCO DAS OITO ESTRELAS e a estrela de cromo no nariz
    {
      // (o arco abre para o nariz, como na bandeira vista de quem está na frente do carro: as pontas para trás
      // e o meio para a frente; espalhado na largura do capô)
      const zc = 1.18, raioX = 0.4, raioZ = 0.24;
      for (let k = 0; k < 8; k++) {
        const a = Math.PI * (0.12 + 0.76 * (k / 7));
        const x = Math.cos(a) * raioX, z = zc + Math.sin(a) * raioZ;
        const e = malha(geoEstrela(0.052, 0.008), P.gatitosBranco);
        // a estrela deitada no capô, com a ponta de cima apontando para o nariz
        e.rotation.set(-Math.PI / 2, 0, Math.PI);
        e.position.set(x, yDaTampa(z, x) + 0.004, z);
        casco.add(e);
      }
      const enfeite = malha(geoEstrela(0.06, 0.02), P.churrascoInox);
      enfeite.position.set(0, yDaTampa(2.05, 0) + 0.06, 2.05); enfeite.rotation.x = -0.25;
      casco.add(enfeite);
      casco.add(tubo([new V(0, yDaTampa(2.08, 0) - 0.01, 2.08), new V(0, yDaTampa(2.05, 0) + 0.03, 2.05)], 0.01, P.churrascoInox, 5));
    }

    // ------------------------------------------------------- a cara: a grade larga, os faróis de viseira, os para-choques de cromo e a placa
    {
      const zF = zDaLargura(0.5, true);
      // a grade: o aro oval de cromo e as lâminas deitadas
      const meiaG = 0.5, yG = 0.52;
      const aro: THREE.Vector3[] = [];
      for (let i = 0; i <= 28; i++) { const a = (i / 28) * Math.PI * 2; aro.push(new V(Math.cos(a) * meiaG, yG + Math.sin(a) * 0.1, zF + 0.04 - 0.08 * Math.pow(Math.cos(a), 2))); }
      casco.add(tubo(aro, 0.02, P.churrascoInox, 6, true));
      for (let i = -2; i <= 2; i++) casco.add(tubo([new V(-meiaG * 0.92, yG + i * 0.035, zF - 0.03), new V(0, yG + i * 0.035, zF + 0.04), new V(meiaG * 0.92, yG + i * 0.035, zF - 0.03)], 0.007, P.churrascoInox, 4));
      for (const lado of [-1, 1]) {
        const z = zDaLargura(0.66, true);
        const f = por(farol(), lado * 0.66, 0.72, z - 0.02);
        f.rotation.y = lado * 0.12;
      }
      for (const ponta of [1, -1]) {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 18; i++) {
          const s = (i / 18) * 2 - 1, x = s * 0.92;
          const zb = ponta > 0 ? zDaLargura(Math.max(0.05, Math.abs(x)), true) : zDaLargura(Math.max(0.05, Math.abs(x)), false);
          pts.push(new V(x, 0.36, zb + ponta * 0.07));
        }
        casco.add(tubo(pts, 0.045, P.churrascoInox, 8));
        if (ponta > 0) for (const x of [-0.32, 0.32]) {
          // as "balas" do para-choque da frente, de cromo
          const bala = malha(new THREE.SphereGeometry(0.055, 12, 8), P.churrascoInox); bala.scale.z = 1.5;
          bala.position.set(x, 0.42, zDaLargura(Math.abs(x), true) + 0.1); casco.add(bala);
        }
        const zp = ponta > 0 ? zDaLargura(0.2, true) : zDaLargura(0.2, false);
        por(new THREE.Mesh(quina(0.42, 0.13, 0.016, 0.006), toon(P.churrascoInox)), 0, 0.25, zp + ponta * 0.05);
        const letras = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.12), toon(P.placaPintada, { mapa: placaDosGatitos() }));
        letras.position.set(0, 0.25, zp + ponta * 0.06); if (ponta < 0) letras.rotation.y = Math.PI;
        casco.add(letras);
      }
    }

    // ------------------------------------------------------- o para-brisa panorâmico, baixinho, com a moldura de cromo
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
      casco.add(tubo(moldura, 0.016, P.churrascoInox, 6));
      // o retrovisor de dentro, com a CONCHA da Tia Liz pendurada
      const topo = noVidro(0, 1);
      casco.add(tubo([topo, topo.clone().add(new V(0, -0.05, -0.04))], 0.008, P.churrascoInox, 4));
      const espelho = por(malha(quina(0.16, 0.05, 0.02, 0.01), P.churrascoInox), topo.x, topo.y - 0.07, topo.z - 0.05);
      espelho.rotation.x = 0.2;
      casco.add(tubo([new V(0.02, topo.y - 0.09, topo.z - 0.06), new V(0.03, topo.y - 0.2, topo.z - 0.07)], 0.004, P.woodDark, 4));
      const concha = por(malha(new THREE.SphereGeometry(0.035, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), P.churrascoInox), 0.03, topo.y - 0.23, topo.z - 0.07);
      concha.scale.y = 0.6;
      // os espelhos de fora, de cromo
      for (const lado of [-1, 1]) {
        const pe = new V(lado * (meia + 0.02), C.borda + 0.01, zP + 0.02);
        casco.add(tubo([pe, pe.clone().add(new V(lado * 0.05, 0.1, 0))], 0.01, P.churrascoInox, 5));
        const e = por(malha(new THREE.SphereGeometry(0.055, 12, 8), P.churrascoInox), pe.x + lado * 0.05, pe.y + 0.13, pe.z);
        e.scale.set(1, 0.8, 0.45);
      }
    }

    // ------------------------------------------------------- por dentro: o painel, o volante grandão, os dois bancos inteiriços
    {
      por(malha(quina(1.5, 0.12, 0.2, 0.05), AZUL), 0, C.borda - 0.05, C.cabine.frente - 0.08);
      por(malha(quina(1.3, 0.05, 0.03, 0.015), P.churrascoInox), 0, C.borda - 0.06, C.cabine.frente + 0.025);
      for (const x of [-0.42, -0.24]) {
        const m = por(malha(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16).rotateX(Math.PI / 2), P.gatitosBranco), x, C.borda - 0.04, C.cabine.frente - 0.19);
        m.rotation.x = 0.3;
      }
      const vol = por(malha(new THREE.TorusGeometry(0.19, 0.016, 8, 30), P.gatitosBranco), C.liz, 0.98, 0.3);
      vol.rotation.x = -0.75;
      casco.add(tubo([new V(C.liz, 0.98, 0.3), new V(C.liz, C.borda - 0.06, C.cabine.frente - 0.1)], 0.02, P.churrascoInox, 6));
      for (const a of [0, 2.1, 4.2]) {
        const raio = new V(Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0).applyEuler(new THREE.Euler(-0.75, 0, 0));
        casco.add(tubo([new V(C.liz, 0.98, 0.3), new V(C.liz + raio.x, 0.98 + raio.y, 0.3 + raio.z)], 0.008, P.churrascoInox, 4));
      }
      por(bancoInteirico(1.42), 0, C.banco - 0.07, C.bancoDaFrente);
      por(bancoInteirico(1.42), 0, C.banco - 0.07, C.bancoDeTras);
      // a almofadinha da Luna, para ela enxergar por cima da porta
      const almofada = por(malha(quina(0.34, 0.12, 0.34, 0.05), AMARELO), C.luna, C.banco + 0.06, C.bancoDaFrente);
      almofada.rotation.y = 0.1;
      // a cesta de arepinhas no meio do banco da frente
      por(cestaDeArepas(), 0.02, C.banco + 0.0, C.bancoDaFrente + 0.06).scale.setScalar(1.35);
      // o cuatro, deitado de través no banco de trás, entre a Sol e a Estrella, com o braço para fora da beira
      const c4 = por(cuatro(), 0.0, C.banco + 0.05, C.bancoDeTras + 0.12);
      c4.rotation.set(-Math.PI / 2 + 0.25, 0, 1.25);
    }

    // ------------------------------------------------------- atrás: o bagageiro com a MALA de viagem e a antena com a BANDEIRINHA
    {
      const zM = -1.68, yT = altoDaTampa(zM) + 0.02;
      for (const x of [-0.36, 0.36]) casco.add(tubo([new V(x, yT, zM + 0.34), new V(x, yT + 0.04, zM + 0.28), new V(x, yT + 0.04, zM - 0.3), new V(x, yT, zM - 0.36)], 0.014, P.churrascoInox, 6));
      for (const z of [zM + 0.24, zM - 0.24]) casco.add(tubo([new V(-0.38, yT + 0.04, z), new V(0.38, yT + 0.04, z)], 0.012, P.churrascoInox, 5));
      const mala = por(malaDeViagem(), 0, yT + 0.22, zM);
      mala.rotation.set(0, Math.PI, 0.03);
      for (const x of [-0.18, 0.18]) casco.add(tubo([new V(x, yT + 0.04, zM + 0.26), new V(x, yT + 0.41, zM + 0.2), new V(x, yT + 0.41, zM - 0.2), new V(x, yT + 0.04, zM - 0.26)], 0.008, P.venezuelaVermelho, 4));
      const pe = new V(0.72, altoDaTampa(-1.95) + 0.0, -1.95);
      casco.add(tubo([pe, pe.clone().add(new V(0, 0.95, -0.05))], 0.006, P.churrascoInox, 4));
    }

    juntarPorCor(casco);
    this.lata.add(fundir(casco));
    this.group.add(this.lata);

    // a bandeirinha na ponta da antena (balança no vento)
    {
      const geo = new THREE.PlaneGeometry(0.24, 0.16, 6, 1);
      geo.translate(0.12, 0, 0);
      const f = new THREE.Mesh(geo, toon(P.placaPintada, { mapa: bandeirinha(), doubleSide: true }));
      f.name = 'bandeirinha-da-antena';
      f.position.set(0.72, altoDaTampa(-1.95) + 0.86, -2.0);
      f.rotation.y = Math.PI / 2;
      f.userData.semSombra = true;
      this.lata.add(f);
      this.flamula = f;
    }

    // ------------------------------------------------------- as rodas
    for (const z of [C.eixoFrente, C.eixoTras]) for (const lado of [-1, 1]) {
      const r = roda(lado);
      r.position.set(lado * C.bitola, C.roda, z);
      juntarPorCor(r);
      const pronta = fundir(r);
      this.rodas.push(pronta); this.group.add(pronta);
    }

    if (!estacionado) {
      // ----------------------------------------------------- a Tia Liz ao volante
      const liz = new TiaLiz({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
      liz.entrarEmServico();
      liz.sentadaNoCarro = true;
      // (o quadril dela, em 0,40 × 1,12, pousa no banco; as patas no aro do volante, no referencial dela)
      liz.group.position.set(C.liz, C.banco - 0.45, C.bancoDaFrente - 0.02);
      // (as patas nos lados do aro do volante, que está a 0,98 de altura e 0,3 de `z`, no referencial dela)
      for (const lado of [0, 1] as const) liz.maoPara(lado, new V((lado ? 1 : -1) * 0.16, 0.98 - (C.banco - 0.45) + 0.08, 0.3 - C.bancoDaFrente + 0.02), true);
      this.lata.add(liz.group);
      this.tiaLiz = liz;
      // ----------------------------------------------------- a Luna do lado, sentada na almofadinha, de óculos de sol
      const luna = new Luna({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
      luna.entrarEmServico();
      luna.sentarEm(C.luna, C.bancoDaFrente, 0, C.banco + 0.1);
      luna.cabecaDaCoelha.add(oculosDaLuna());
      this.lata.add(luna.group);
      // ----------------------------------------------------- a Sol e a Estrella em pé no banco de trás
      const sol = new Sol({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
      const estrella = new Estrella({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
      for (const [b, x] of [[sol, C.sol], [estrella, C.estrella]] as const) {
        b.entrarEmServico();
        b.group.position.set(x, C.banco - 0.02, C.bancoDeTras + 0.02);
        this.lata.add(b.group);
      }
      this.irmas.push(luna, sol, estrella);
      // o confete: 90 papeizinhos nas cores dos Gatitos e da Venezuela (cor por cópia), parados fora de vista
      const conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.15, 0.09), toon(0xffffff, { doubleSide: true }), 90);
      conf.name = 'confete'; conf.frustumCulled = false; conf.userData.semSombra = true;
      const cores = [AMARELO, AZUL, P.venezuelaVermelho, P.gatitosBranco];
      const zero = new THREE.Matrix4().makeScale(0, 0, 0), cor = new THREE.Color();
      for (let i = 0; i < 90; i++) { conf.setMatrixAt(i, zero); conf.setColorAt(i, cor.setHex(cores[i % cores.length])); }
      this.group.add(conf);
      this.confete = conf;
      this.update(0, 0, false);
    } else {
      fundirComoFundo(this.group);
    }
  }

  /** a Sol e a Estrella torcem pulando e a Luna acena, tímida; o confete sobe do banco de trás */
  comemorar(): void {
    if (this.irmas.length < 3) return;
    this.irmas[0].ficarTimida(2.4);
    this.irmas[1].torcer(3);
    this.irmas[1].saltar();
    this.irmas[2].torcer(3);
    this.tiaLiz?.acenar(2);
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2, f = 1.4 + Math.random() * 1.8;
      // (sobe do banco de trás e voa para o lado do Bebito, o −X)
      this.papeis[i] = {
        p: new V((Math.random() - 0.5) * 0.6, 1.2, C.bancoDeTras + (Math.random() - 0.5) * 0.6),
        v: new V(-1.4 + Math.cos(a) * f * 0.6, 3.2 + Math.random() * 1.6, Math.sin(a) * f * 0.6),
        giro: new V(Math.random() * 8, Math.random() * 8, Math.random() * 8), idade: 0,
      };
    }
    this.confetes += 90;
  }

  /** as três se encolhem de vergonha (a Luna mais) */
  ficarTimidas(): void { for (const b of this.irmas) b.ficarTimida(2.2); }

  /** a Tia Liz acena */
  acenar(): void { this.tiaLiz?.acenar(2); }

  /**
   * as duas arepitas saem da cesta e voam, uma atrás da outra, até `alvo` (no
   * mundo: a janela do Bebito) — o mesmo voo dos brigadeirinhos do Cookie
   */
  jogarArepitas(alvo: THREE.Vector3): void {
    this.group.updateMatrixWorld(true);
    const de = new V(0.02, C.banco + 0.3, C.bancoDaFrente + 0.06);
    const para = this.group.worldToLocal(alvo.clone());
    for (let i = 0; i < 2; i++) {
      const a = miniArepa(); a.scale.setScalar(4); a.visible = false;
      this.group.add(a);
      this.voando.push({ peca: a, t: -i * 0.3, de: de.clone(), para: para.clone().add(new V(0, 0, i ? -0.25 : 0.25)) });
    }
  }

  /** quantas arepitas estão no ar (o teste confere) */
  get arepitasNoAr(): number { return this.voando.length; }

  update(dt: number, distancia: number, conversando: boolean): void {
    this.relogio += dt;
    this.conversa = conversando;
    const v = dt > 0 ? distancia / dt : 0;
    this.velocidade += (v - this.velocidade) * Math.min(1, dt * 4);
    const anda = preso(this.velocidade / 7);
    for (const r of this.rodas) r.rotation.x += distancia / C.roda;

    // o carrão balança macio, de molejo antigo
    this.lata.position.y = Math.sin(this.relogio * 3.3) * 0.01 * anda;
    this.lata.rotation.x = Math.sin(this.relogio * 2.1) * 0.006 * anda;
    this.lata.rotation.z = Math.sin(this.relogio * 1.7) * 0.006 * anda;

    // a bandeirinha da antena tremula (mais com o carro andando)
    if (this.flamula) {
      const f = this.flamula;
      f.rotation.y = Math.PI / 2 + Math.sin(this.relogio * (4 + anda * 8)) * (0.08 + anda * 0.12);
      f.rotation.z = -0.05 - anda * 0.1;
    }

    // a Sol e a Estrella torcem de tempos em tempos, de pé lá atrás; parados para conversar, torcem mais
    if (this.irmas.length) {
      this.proximaTorcida -= dt;
      if (this.proximaTorcida <= 0) {
        this.proximaTorcida = conversando ? 2.6 : 3.6 + Math.sin(this.relogio) * 1.2;
        this.irmas[1].torcer(2.2);
        this.irmas[2].torcer(1.8);
      }
      for (const b of this.irmas) b.update(dt);
    }
    // conversando, a Tia Liz vira a cabeça para quem parou do lado (o −X do carro)
    if (this.tiaLiz) {
      if (this.conversa) {
        this.group.updateMatrixWorld(true);
        this.tiaLiz.olharPara(this.group.localToWorld(new V(-3.2, 1.5, 0.3)));
      } else this.tiaLiz.olharPara(null);
      this.tiaLiz.update(dt);
    }

    // o confete: sobe, abre, e cai devagar girando (o ar segura o papel)
    if (this.confete) {
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), um = new V(1, 1, 1);
      for (let i = 0; i < 90; i++) {
        const c = this.papeis[i];
        if (!c || c.idade > 3.2 || c.p.y < 0.02) { m.makeScale(0, 0, 0); this.confete.setMatrixAt(i, m); continue; }
        c.idade += dt;
        c.v.y -= 6.5 * dt; c.v.multiplyScalar(1 - Math.min(1, dt * 1.6));
        if (c.v.y < -0.9) c.v.y = -0.9;
        c.p.addScaledVector(c.v, dt);
        q.setFromEuler(e.set(c.giro.x * c.idade, c.giro.y * c.idade, c.giro.z * c.idade));
        m.compose(c.p, q, um);
        this.confete.setMatrixAt(i, m);
      }
      this.confete.instanceMatrix.needsUpdate = true;
    }

    // as arepitas voando: o arco até a janela do Bebito, girando
    for (let i = this.voando.length - 1; i >= 0; i--) {
      const d = this.voando[i];
      d.t += dt / 0.85;
      if (d.t < 0) continue;
      if (d.t >= 1) { this.group.remove(d.peca); this.voando.splice(i, 1); continue; }
      d.peca.visible = true;
      d.peca.position.lerpVectors(d.de, d.para, d.t);
      d.peca.position.y += Math.sin(d.t * Math.PI) * 1.0;
      d.peca.rotation.set(d.t * 6, d.t * 3, 0);
    }
  }
}
