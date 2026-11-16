import * as THREE from 'three';
import { Cookie, type PoseNoCarrinho } from '../entities/bichos/Cookie';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo, juntarPorCor } from './fundir';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { FONTE_FORMA } from './halloween/barracaDoWalter';
import { docinhoDoCookie } from './props';

/**
 * ============================================== O CARRINHO DO COOKIE
 *
 * O terceiro veículo dos personagens do PARQUE (`docs/CARRINHO-DO-COOKIE.md`),
 * pedido do Renan: "o carro do Cookie pequenininho e fofo, com as orelhas para
 * fora". O Cookie é o maior bicho do jogo (2,05 m), ama coisa pequenininha, e
 * o carro dele é o MENOR da estrada: um microcarro conversível em forma de
 * bolha, rosa-bebê, em que ele vai ESPREMIDO —
 *
 * - as ORELHAS abertas para fora, por cima das portas, tremulando no vento;
 * - a TROMBA saindo por um FURO COM BORRACHA no meio do para-brisa (o carrinho
 *   foi adaptado para ele), deitada no capô com a pontinha enrolada, que é
 *   quem aperta a corneta;
 * - o lombo, a manta e o quepe aparecendo por cima (a capota nem fecha: vai
 *   enrolada atrás);
 * - a TRASEIRA REBAIXADA com o peso dele, as rodas abertas e o molejo. Vazio,
 *   no estacionamento, o carrinho fica nivelado, de rodinha em pé.
 *
 * O contrato é o dos veículos da estrada: base em `y = 0`, a frente no `+Z`, o
 * lado do Bebito é o `−X`, `update(dt, distancia, conversando)`; `estacionado`
 * monta a versão vazia, juntada como fundo.
 *
 * A LATARIA É UMA PELE DE FATIAS (o molde do Bebito Mobile, miúdo): a planta é
 * uma superelipse (`meiaLargura`), a tampa de cima é o perfil de lado
 * (`altoDaTampa`), e cada fatia sobe da soleira, engorda até a cintura, fecha
 * no ombro e deita na tampa — onde tem cabine, a tampa para na beira do
 * buraco (`meiaCabine`); onde tem roda, a soleira sobe pelo arco.
 */
export const CARRINHO = {
  /** meio comprimento (a ponta do nariz e a da traseira) e a meia largura na cintura */
  meio: 1.35, meiaLargura: 0.84,
  chao: 0.22, piso: 0.28, cintura: 0.6, borda: 1.04,
  roda: 0.25, eixo: 0.86, bitola: 0.63,
  /** o buraco da cabine, de onde a onde */
  cabine: { tras: -1.12, frente: 0.9 },
  /** onde o Cookie vai (o meio do corpo dele) */
  cookie: -0.3,
} as const;
const C = CARRINHO;
const ARCO = 0.33;
const V = THREE.Vector3;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const preso = (x: number): number => Math.max(0, Math.min(1, x));
const suave = (x: number): number => { const k = preso(x); return k * k * (3 - 2 * k); };
/** a superelipse: 1 no meio, 0 na ponta, com a quina mais quadrada quanto maior o `n` */
const se = (t: number, n: number): number => Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, Math.abs(t)), n)), 1 / n);

// ================================================================ a pele

/** a planta: a meia largura do carro (na cintura) em `z` */
const meiaLargura = (z: number): number => C.meiaLargura * se(z / C.meio, 2.7);
/** o perfil de lado: a altura da tampa (o capô, a beira da cabine, a tampa de trás) */
function altoDaTampa(z: number): number {
  if (z > 1.02) return C.borda - 0.56 * Math.pow((z - 1.02) / (C.meio - 1.02), 1.8);
  if (z < -1.1) return C.borda - 0.5 * Math.pow((-1.1 - z) / (C.meio - 1.1), 2);
  return C.borda;
}
const soleiraLisa = (z: number): number => C.chao + 0.2 * Math.pow(Math.abs(z) / C.meio, 6);
/** a soleira: sobe pelo arco onde tem roda */
function soleira(z: number): number {
  let y = soleiraLisa(z);
  for (const e of [C.eixo, -C.eixo]) {
    const d = Math.abs(z - e);
    if (d < ARCO) y = Math.max(y, C.roda + Math.sqrt(ARCO * ARCO - d * d));
  }
  return Math.min(y, C.cintura - 0.02);
}
/** a altura em que a fatia é mais gorda */
const cinturaEm = (z: number): number => Math.min(C.cintura, soleira(z) + (altoDaTampa(z) - soleira(z)) * 0.55);
/** o buraco da cabine: a meia largura dele em `z` (zero fora da cabine) */
function meiaCabine(z: number): number {
  const c = (C.cabine.tras + C.cabine.frente) / 2, h = (C.cabine.frente - C.cabine.tras) / 2;
  const t = (z - c) / h;
  return Math.abs(t) >= 1 ? 0 : 0.69 * meiaLargura(z) * se(t, 5);
}
const OMBRO = 0.78;
const CURVA = 0.85;
/** a lateral: o `x` da pele na altura `y` (da soleira ao ombro) */
function xDaPele(z: number, y: number): number {
  const w = meiaLargura(z), sol = soleira(z), top = altoDaTampa(z), cin = cinturaEm(z);
  if (y <= cin) {
    // (no arco da roda a soleira já está quase na cintura: ali a lata não recolhe)
    const recolhe = 0.14 * (1 - suave((sol - soleiraLisa(z)) / 0.28));
    const t = preso((cin - y) / Math.max(1e-4, cin - sol));
    return w * (1 - recolhe * t * t);
  }
  const s = Math.pow(preso((y - cin) / Math.max(1e-4, top - cin)), 1 / CURVA);
  return w * (OMBRO + (1 - OMBRO) * Math.pow(Math.sqrt(Math.max(0, 1 - s * s)), CURVA));
}
/** a tampa: a altura dela em `x` (abaulada: mais alta no meio) */
const yDaTampa = (z: number, x: number): number => {
  const xs = meiaLargura(z) * OMBRO;
  return altoDaTampa(z) + 0.035 * (1 - Math.pow(Math.min(1, Math.abs(x) / Math.max(1e-4, xs)), 2));
};

/** a meia fatia em `z` (com `x ≥ 0`): 3 nós de baixo, 5 do ombro e 3 da tampa, até a beira do buraco */
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

/** as estações da pele: mais juntas nas pontas, onde a planta fecha depressa */
const ESTACOES = ((): number[] => {
  const N = 64, zs: number[] = [];
  for (let i = 0; i <= N; i++) zs.push(C.meio * 0.9995 * Math.sin((i / N - 0.5) * Math.PI));
  return zs;
})();

/** um ponto da LATERAL e a normal dele (para pregar farol, lanterna, maçaneta, adesivo) */
function naLateral(z: number, y: number, lado: number): { p: THREE.Vector3; n: THREE.Vector3 } {
  const p = new V(lado * xDaPele(z, y), y, z);
  const dz = new V(lado * (xDaPele(z + 0.01, y) - xDaPele(z - 0.01, y)), 0, 0.02);
  const dy = new V(lado * (xDaPele(z, y + 0.01) - xDaPele(z, y - 0.01)), 0.02, 0);
  const n = dy.cross(dz).normalize();
  if (n.x * lado < 0) n.negate();
  return { p, n };
}
/** assenta a peça na lateral, com o `+Z` dela na normal, `fora` metros para fora */
function pregar<T extends THREE.Object3D>(obj: T, z: number, y: number, lado: number, fora = 0): T {
  const { p, n } = naLateral(z, y, lado);
  obj.position.copy(p).addScaledVector(n, fora);
  obj.quaternion.setFromUnitVectors(new V(0, 0, 1), n);
  return obj;
}

/** a pele de fora: uma malha só, lisa, com a costura do meio do capô alisada */
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
      if (k === NOS - 1) continue; // (entre as duas beiras fica o buraco da cabine)
      const a = i * POR + k, b = a + 1, c = a + POR, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // onde não tem buraco, as duas beiras são o mesmo ponto (o meio do capô): a normal é a média
  const n = geo.attributes.normal;
  for (let i = 0; i < ESTACOES.length; i++) {
    if (meiaCabine(ESTACOES[i]) > 1e-4) continue;
    const a = i * POR + NOS - 1, b = a + 1;
    const m = new V(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize();
    n.setXYZ(a, m.x, m.y, m.z); n.setXYZ(b, m.x, m.y, m.z);
  }
  return geo;
}

/** o fundo do carro: de soleira a soleira, por baixo (sem ele via-se o chão por dentro do nariz) */
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

/**
 * A CAIXA DE RODA: uma fita escura que entra da boca do para-lama para dentro
 * e a tampa do fundo. A beira de fora ACOMPANHA A PLANTA (o carro estreita
 * para as pontas): um meio cano reto, da largura do carro no eixo, saía pela
 * lataria nas duas pontas do arco, como duas barbatanas pretas.
 */
function geoDaCaixaDeRoda(eixo: number, lado: number): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const N = 14, FUNDO = 0.27;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI;
    const z = eixo + Math.cos(a) * (ARCO - 0.004), y = Math.max(soleiraLisa(z) + 0.012, C.roda + Math.sin(a) * (ARCO - 0.004));
    const x = xDaPele(z, y) - 0.008;
    pos.push(lado * x, y, z, lado * (x - FUNDO), y, z);
    if (i > 0) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  // a tampa do fundo: um leque das beiras de dentro até o meio
  const meio = pos.length / 3;
  pos.push(lado * (xDaPele(eixo, C.roda + 0.2) - FUNDO), C.roda, eixo);
  for (let i = 0; i < N; i++) idx.push(meio, i * 2 + 1, i * 2 + 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/**
 * O FORRO da cabine: da beira do buraco para baixo, abrindo por dentro da
 * porta (a cabine é mais larga que a boca) até o piso. É ele que dá grossura
 * à porta e fundo ao buraco — sem ele, de cima via-se o chão por dentro.
 */
function geoDoForro(): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const zs = ESTACOES.filter((z) => z >= C.cabine.tras - 0.02 && z <= C.cabine.frente + 0.02);
  const xhMax = meiaCabine(-0.1);
  const NF = 7;
  const meia = (z: number): Array<[number, number]> => {
    const xh = meiaCabine(z), top = altoDaTampa(z);
    const abre = Math.sqrt(preso(xh / xhMax));
    // (onde tem roda, o forro fica para dentro da caixa de roda: por fora dela ele aparecia pela boca do para-lama)
    const naRoda = [C.eixo, -C.eixo].some((e) => Math.abs(z - e) < ARCO + 0.05);
    const dentro = (y: number, folga: number): number => Math.min(
      xDaPele(z, y) - 0.05, xh + folga * abre,
      naRoda && y < C.roda + ARCO + 0.04 ? meiaLargura(z) - 0.3 : Infinity);
    return [
      [xh, yDaTampa(z, xh)],
      [xh, top - 0.05],
      [dentro(top - 0.14, 0.12), top - 0.14],
      [dentro(C.cintura, 0.26), C.cintura],
      [dentro(C.piso + 0.1, 0.22), C.piso + 0.1],
      [dentro(C.piso, 0.16), C.piso],
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

/** a beira do buraco da cabine, dando a volta (para o debrum) */
function voltaDaCabine(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const N = 44;
  for (let i = 0; i <= N; i++) {
    const z = C.cabine.tras + 0.004 + (C.cabine.frente - C.cabine.tras - 0.008) * (0.5 - 0.5 * Math.cos((i / N) * Math.PI));
    pts.push(new V(meiaCabine(z), yDaTampa(z, meiaCabine(z)) + 0.006, z));
  }
  const volta = [...pts];
  for (let i = N - 1; i >= 1; i--) volta.push(new V(-pts[i].x, pts[i].y, pts[i].z));
  return volta;
}

/** um adesivo redondo ASSENTADO na lateral (a malha acompanha a curva da porta) */
function adesivoNaLateral(z0: number, y0: number, raio: number, lado: number, mat: THREE.Material): THREE.Mesh {
  const ANEIS = 3, GOMOS = 20;
  const pos: number[] = [0, 0, 0], uv: number[] = [0.5, 0.5], idx: number[] = [];
  const centro = naLateral(z0, y0, lado);
  const ponto = (dz: number, dy: number): THREE.Vector3 => { const { p, n } = naLateral(z0 + dz, y0 + dy, lado); return p.addScaledVector(n, 0.008); };
  pos.splice(0, 3, ...ponto(0, 0).toArray());
  for (let a = 1; a <= ANEIS; a++) for (let g = 0; g < GOMOS; g++) {
    const ang = (g / GOMOS) * Math.PI * 2, r = (a / ANEIS) * raio;
    // (o desenho lê certo de fora dos dois lados: no `+X`, a direita de quem olha é o `−Z`)
    const dz = -lado * Math.cos(ang) * r, dy = Math.sin(ang) * r;
    pos.push(...ponto(dz, dy).toArray());
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
  // (a face tem que olhar para fora: confere pela normal do meio)
  if (geo.attributes.normal.getX(0) * centro.n.x < 0) {
    geo.setIndex(idx.reduce<number[]>((v, _, i) => (i % 3 === 0 ? [...v, idx[i], idx[i + 2], idx[i + 1]] : v), []));
    geo.computeVertexNormals();
  }
  const m = new THREE.Mesh(geo, mat);
  m.userData.semSombra = true;
  return m;
}

// ================================================================ as pinturas

/** a placa: "COOKIE", nas cores da bilheteria */
let placa: THREE.CanvasTexture | null = null;
function placaDoCookie(): THREE.CanvasTexture {
  if (placa) return placa;
  placa = canvasComLetra(256, 96, (c) => {
    c.fillStyle = css(P.carrinhoForro); c.fillRect(0, 0, 256, 96);
    c.strokeStyle = css(P.quepeCookieFita); c.lineWidth = 6; c.strokeRect(6, 6, 244, 84);
    c.fillStyle = css(P.quepeCookie);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 50px ${FONTE_FORMA}`;
    c.fillText('COOKIE', 128, 52);
  });
  return placa;
}

/** a calota: um biscoito com gotas de chocolate (o nome dele) */
let calota: THREE.CanvasTexture | null = null;
function calotaDeBiscoito(): THREE.CanvasTexture {
  if (calota) return calota;
  calota = canvasComLetra(128, 128, (c) => {
    c.fillStyle = css(P.biscoitoBorda); c.fillRect(0, 0, 128, 128);
    c.fillStyle = css(P.biscoitoMassa); c.beginPath(); c.arc(64, 64, 56, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.biscoitoGota);
    for (const [x, y, r] of [[44, 40, 9], [84, 46, 8], [62, 70, 10], [36, 82, 7], [90, 84, 9], [66, 102, 6], [70, 26, 6]]) {
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
  });
  return calota;
}

/** o adesivo da porta: a roda gigante, que é o sonho dele, com um coração */
let adesivo: THREE.CanvasTexture | null = null;
function adesivoDaRodaGigante(): THREE.CanvasTexture {
  if (adesivo) return adesivo;
  adesivo = canvasComLetra(256, 256, (c) => {
    c.fillStyle = css(P.carrinhoForro); c.beginPath(); c.arc(128, 128, 128, 0, Math.PI * 2); c.fill();
    c.strokeStyle = css(P.quepeCookieFita); c.lineWidth = 10; c.beginPath(); c.arc(128, 128, 118, 0, Math.PI * 2); c.stroke();
    // os cavaletes, o aro, os raios e as gôndolas
    c.strokeStyle = css(P.quepeCookie); c.lineWidth = 8;
    c.beginPath(); c.moveTo(128, 118); c.lineTo(84, 214); c.moveTo(128, 118); c.lineTo(172, 214); c.stroke();
    c.strokeStyle = css(P.quepeCookieFita); c.lineWidth = 7;
    c.beginPath(); c.arc(128, 118, 66, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      c.beginPath(); c.moveTo(128, 118); c.lineTo(128 + Math.cos(a) * 66, 118 + Math.sin(a) * 66); c.stroke();
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      c.fillStyle = css(i % 2 ? P.quepeCookie : P.carrinhoLatao);
      c.beginPath(); c.arc(128 + Math.cos(a) * 66, 118 + Math.sin(a) * 66 + 6, 11, 0, Math.PI * 2); c.fill();
    }
    // o coração no miolo
    c.fillStyle = css(P.vagaRosa);
    c.beginPath(); c.moveTo(128, 132); c.bezierCurveTo(100, 112, 112, 96, 128, 110); c.bezierCurveTo(144, 96, 156, 112, 128, 132); c.fill();
  });
  return adesivo;
}

/** o adesivo do outro lado: "ELEFANTE A BORDO", amarelo de aviso, com a carinha dele */
let aBordo: THREE.CanvasTexture | null = null;
function adesivoElefanteABordo(): THREE.CanvasTexture {
  if (aBordo) return aBordo;
  aBordo = canvasComLetra(256, 256, (c) => {
    c.fillStyle = css(P.carrinhoLatao); c.beginPath(); c.arc(128, 128, 128, 0, Math.PI * 2); c.fill();
    c.strokeStyle = css(P.carrinhoBorracha); c.lineWidth = 9; c.beginPath(); c.arc(128, 128, 117, 0, Math.PI * 2); c.stroke();
    // a carinha: as duas orelhas, a cabeça, a tromba e os olhos
    c.fillStyle = css(P.elefanteEscuro);
    for (const x of [78, 178]) { c.beginPath(); c.ellipse(x, 112, 34, 40, 0, 0, Math.PI * 2); c.fill(); }
    c.fillStyle = css(P.elefanteOrelha);
    for (const x of [80, 176]) { c.beginPath(); c.ellipse(x, 113, 20, 26, 0, 0, Math.PI * 2); c.fill(); }
    c.fillStyle = css(P.elefantePele);
    c.beginPath(); c.arc(128, 108, 40, 0, Math.PI * 2); c.fill();
    c.strokeStyle = css(P.elefantePele); c.lineWidth = 24;
    c.beginPath(); c.moveTo(128, 124); c.quadraticCurveTo(128, 176, 152, 172); c.stroke();
    c.fillStyle = css(P.carrinhoBorracha);
    for (const x of [112, 144]) { c.beginPath(); c.arc(x, 100, 5.5, 0, Math.PI * 2); c.fill(); }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 30px ${FONTE_FORMA}`;
    c.fillText('ELEFANTE', 128, 44);
    c.fillText('A BORDO', 128, 214);
  });
  return aBordo;
}

// ================================================================ as peças

const tubo = (pts: THREE.Vector3[], raio: number, cor: number, fechado = false, lados = 7): THREE.Mesh =>
  new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, fechado, 'centripetal'), Math.max(8, pts.length * 4), raio, lados, fechado), toon(cor));

/** a rodinha: pneu gordinho, a faixa branca e a calota de biscoito (o eixo em `X`; `lado` é o de fora) */
function rodinha(lado: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.168, 0.082, 10, 26).rotateY(Math.PI / 2), toon(P.onibusPneu)));
  const faixa = new THREE.Mesh(new THREE.RingGeometry(0.125, 0.185, 26).rotateY(lado * Math.PI / 2), toon(P.carrinhoForro, { doubleSide: true }));
  faixa.position.x = lado * 0.074; g.add(faixa);
  const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.135, 0.09, 20).rotateZ(Math.PI / 2), toon(P.churrascoInox));
  aro.position.x = lado * 0.03; g.add(aro);
  const biscoito = new THREE.Mesh(new THREE.CircleGeometry(0.105, 20).rotateY(lado * Math.PI / 2), toon(P.placaPintada, { mapa: calotaDeBiscoito() }));
  biscoito.position.x = lado * 0.078; g.add(biscoito);
  const porca = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), toon(P.churrascoInox));
  porca.position.x = lado * 0.086; g.add(porca);
  return g;
}

/** o farol de sapinho: a cúpula no ombro do capô, o aro cromado, a lente acesa, o brilho e a pálpebra */
function farol(lado: number): THREE.Group {
  const g = new THREE.Group();
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(0.128, 16, 12), toon(P.carrinhoRosa));
  cupula.scale.set(1, 1, 1.12); g.add(cupula);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.017, 6, 22), toon(P.churrascoInox));
  aro.position.z = 0.092; g.add(aro);
  const lente = new THREE.Mesh(new THREE.SphereGeometry(0.094, 16, 10), toon(P.sorveteriaCreme, { glow: 0.6 }));
  lente.scale.z = 0.42; lente.position.z = 0.088; g.add(lente);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), toon(P.metalWhite, { glow: 0.9 }));
  brilho.position.set(-lado * 0.03, 0.034, 0.126); g.add(brilho);
  // a pálpebra: uma calota caindo sobre o alto da lente (o olhar manso do dono)
  const palpebra = new THREE.Mesh(new THREE.SphereGeometry(0.136, 16, 8, 0, Math.PI * 2, 0, 1.0), toon(P.carrinhoRosaEscuro));
  palpebra.scale.set(1, 1, 1.14); palpebra.rotation.x = 0.62; palpebra.rotation.z = -lado * 0.16; g.add(palpebra);
  g.rotation.y = lado * 0.16;
  return g;
}

/** o para-brisa: um ponto do vidro (`u` de −1 a 1 de um lado ao outro, `v` de 0 a 1 de baixo para cima) */
function noVidro(u: number, v: number): THREE.Vector3 {
  const meia = 0.5 - 0.07 * v;
  return new V(u * meia, 1.035 + 0.625 * v, 0.99 - 0.3 * v - (0.2 - 0.04 * v) * Math.pow(Math.abs(u), 2.2));
}
/** onde a tromba atravessa o vidro (a altura do furo, de 0 a 1) */
const FURO = 0.27;

/** a corneta de latão: a pera de borracha atrás e a boca abrindo para a frente (o eixo em `Z`) */
function corneta(): THREE.Group {
  const g = new THREE.Group();
  const perfil = [[0.012, 0], [0.016, 0.06], [0.03, 0.13], [0.062, 0.19], [0.075, 0.2]].map(([r, y]) => new THREE.Vector2(r, y));
  const boca = new THREE.Mesh(new THREE.LatheGeometry(perfil, 14).rotateX(Math.PI / 2), toon(P.carrinhoLatao, { doubleSide: true }));
  g.add(boca);
  const pera = new THREE.Group();
  pera.name = 'pera-da-corneta';
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.056, 12, 10), toon(P.carrinhoBorracha));
  bola.scale.set(1, 1, 1.2); pera.add(bola);
  pera.position.z = -0.05;
  g.add(pera);
  return g;
}

/** o catavento: quatro pás dobradas nas cores da bilheteria, com o botão no meio (gira no eixo `Z`) */
function catavento(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'catavento';
  const cores = [P.quepeCookieFita, P.carrinhoLatao, P.quepeCookie, P.carrinhoForro];
  for (let i = 0; i < 4; i++) {
    // cada pá é um triângulo com a ponta dobrada para a frente (é a dobra que pega o vento)
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0.16, 0, 0, 0.16, 0.16, 0.012, 0, 0, 0, 0.16, 0.16, 0.012, 0.03, 0.085, 0.055], 3));
    geo.computeVertexNormals();
    const pa = new THREE.Mesh(geo, toon(cores[i], { doubleSide: true }));
    pa.rotation.z = (i / 4) * Math.PI * 2;
    g.add(pa);
  }
  const botao = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), toon(P.metalWhite));
  botao.position.z = 0.03; g.add(botao);
  return g;
}

/** a chave de corda da traseira: o eixo e as duas asas de latão (gira no eixo `Z`) */
function chaveDeCorda(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'chave-de-corda';
  const eixo = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8).rotateX(Math.PI / 2), toon(P.carrinhoLatao));
  eixo.position.z = -0.08; g.add(eixo);
  for (const lado of [-1, 1]) {
    const asa = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.02, 7, 18), toon(P.carrinhoLatao));
    asa.scale.set(1, 1.25, 1); asa.position.set(lado * 0.07, 0, -0.18); g.add(asa);
  }
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toon(P.carrinhoLatao));
  miolo.position.z = -0.18; g.add(miolo);
  return g;
}

/** a caixinha de docinhos que ele estende com a tromba: a caixa rosa, a fita e o laço */
function caixinhaDeDocinhos(): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(quina(0.2, 0.1, 0.2, 0.02), toon(P.docinhoForminha)));
  const tampa = new THREE.Mesh(quina(0.215, 0.035, 0.215, 0.012), toon(P.carrinhoForro)); tampa.position.y = 0.06; g.add(tampa);
  for (const giro of [0, Math.PI / 2]) {
    const fita = new THREE.Mesh(quina(0.222, 0.14, 0.034, 0.008), toon(P.quepeCookieFita)); fita.position.y = 0.012; fita.rotation.y = giro; g.add(fita);
  }
  for (const lado of [-1, 1]) {
    const laco = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), toon(P.quepeCookieFita));
    laco.scale.set(1.3, 0.7, 0.6); laco.position.set(lado * 0.04, 0.095, 0); laco.rotation.z = lado * 0.5; g.add(laco);
  }
  return juntarEDevolver(g);
}
function juntarEDevolver(g: THREE.Group): THREE.Group { juntarPorCor(g); return fundir(g); }

/** a pose da tromba: deitada no capô com a pontinha enrolada, e levantada para estender a caixinha */
const TROMBA_NO_CAPO = [-1.57, 0.45, 0.5, -0.5, -1.0];
const TROMBA_OFERECENDO = [-1.57, -0.15, -0.3, -0.35, -0.3];

interface Fumacinha { idade: number; x: number; y: number; z: number; vz: number }
interface Voando { doce: THREE.Object3D; t: number; de: THREE.Vector3; para: THREE.Vector3 }

export class CarrinhoDoCookie {
  readonly group = new THREE.Group();
  /** o dono, espremido lá dentro (`null` no carrinho estacionado) */
  readonly cookie: Cookie | null = null;
  /** tudo o que balança na mola: a lataria e ele */
  private readonly lata = new THREE.Group();
  private readonly rodas: THREE.Group[] = [];
  private readonly eixos: THREE.Group[] = [];
  private catavento: THREE.Group | null = null;
  private pera: THREE.Object3D | null = null;
  private chave: THREE.Group | null = null;
  private readonly fumaca: THREE.InstancedMesh | null = null;
  private readonly puffs: Fumacinha[] = [];
  private readonly caixinha: THREE.Group | null = null;
  private readonly voando: Voando[] = [];
  private readonly pose: PoseNoCarrinho = { vento: 0, tromba: [...TROMBA_NO_CAPO], deLado: 0, olhar: 0 };
  private relogio = 0;
  private velocidade = 0;
  private oferecendo = false;
  private buzina = 0;
  private proximaFumaca = 0;
  private tombo = 0;
  private vTombo = 0;

  constructor(estacionado = false) {
    this.group.userData.peca = 'carrinho-do-cookie';
    const casco = new THREE.Group();
    const por = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, pai: THREE.Object3D = casco): T => { o.position.set(x, y, z); pai.add(o); return o; };
    const malha = (geo: THREE.BufferGeometry, cor: number): THREE.Mesh => new THREE.Mesh(geo, toon(cor));

    // ------------------------------------------------------- a lataria, o forro e o debrum da cabine
    casco.add(new THREE.Mesh(geoDaPele(), toon(P.carrinhoRosa)));
    casco.add(new THREE.Mesh(geoDoForro(), toon(P.carrinhoForro, { doubleSide: true })));
    casco.add(tubo(voltaDaCabine(), 0.024, P.carrinhoForro, true));
    casco.add(new THREE.Mesh(geoDoFundo(), toon(P.onibusPainel, { doubleSide: true })));
    // por dentro de cada arco de roda, a caixa escura (sem ela via-se o forro pela boca do para-lama)
    for (const z of [C.eixo, -C.eixo]) for (const lado of [-1, 1]) casco.add(new THREE.Mesh(geoDaCaixaDeRoda(z, lado), toon(P.onibusPainel, { doubleSide: true })));

    // ------------------------------------------------------- a cara: os faróis de sapinho, o sorriso, o blush e o para-choque
    for (const lado of [-1, 1]) {
      por(farol(lado), lado * 0.41, yDaTampa(1.12, 0.41) - 0.005, 1.13);
      const blush = adesivoNaLateral(1.14, 0.7, 0.062, lado, toon(P.sorveteriaRosa));
      casco.add(blush);
    }
    // o sorriso: uma barra cromada dando a volta no nariz, com os cantos subindo
    const sorriso: THREE.Vector3[] = [];
    for (let i = 0; i <= 14; i++) {
      const s = (i / 14) * 2 - 1, z = C.meio - 0.004 - 0.17 * s * s, y = 0.585 + 0.075 * s * s;
      const x = Math.sign(s) * xDaPele(z, y);
      const fora = new V(x, 0, z - 0.5).normalize().multiplyScalar(0.012);
      sorriso.push(new V(x, y, z).add(fora));
    }
    casco.add(tubo(sorriso, 0.016, P.churrascoInox));
    for (const p of [sorriso[0], sorriso[sorriso.length - 1]]) por(malha(new THREE.SphereGeometry(0.026, 8, 6), P.churrascoInox), p.x, p.y, p.z);
    // os para-choques: um tubo cromado dando a volta em cada ponta, com as garras
    for (const ponta of [1, -1]) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 16; i++) {
        const s = (i / 16) * 2 - 1, z = ponta * (C.meio + 0.035 - 0.42 * s * s), y = 0.37;
        const x = Math.sign(s) * (xDaPele(Math.min(C.meio * 0.999, Math.abs(z)) * ponta, y) + 0.04);
        pts.push(new V(Math.abs(s) < 1e-3 ? 0 : x, y, z));
      }
      casco.add(tubo(pts, 0.028, P.churrascoInox));
      for (const x of [-0.2, 0.2]) por(malha(new THREE.CapsuleGeometry(0.024, 0.07, 3, 8), P.churrascoInox), x, 0.385, ponta * (C.meio + 0.045));
      // a placa, pendurada embaixo do para-choque
      por(new THREE.Mesh(quina(0.3, 0.115, 0.018, 0.008), toon(P.churrascoInox)), 0, 0.3, ponta * (C.meio + 0.05));
      const letras = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.1), toon(P.placaPintada, { mapa: placaDoCookie() }));
      letras.position.set(0, 0.3, ponta * (C.meio + 0.061)); if (ponta < 0) letras.rotation.y = Math.PI;
      casco.add(letras);
    }

    // ------------------------------------------------------- o para-brisa de bolha, com o FURO DA TROMBA
    {
      const LU = 12, LV = 6;
      const geo = new THREE.PlaneGeometry(1, 1, LU, LV);
      const pg = geo.attributes.position;
      for (let j = 0; j <= LV; j++) for (let i = 0; i <= LU; i++) {
        const p = noVidro((i / LU) * 2 - 1, 1 - j / LV);
        pg.setXYZ(j * (LU + 1) + i, p.x, p.y, p.z);
      }
      geo.computeVertexNormals();
      const vidro = new THREE.Mesh(geo, toon(P.onibusParaBrisa, { opacity: 0.36, doubleSide: true }));
      vidro.name = 'para-brisa'; vidro.userData.semSombra = true; vidro.renderOrder = 3;
      this.lata.add(vidro);
      // a moldura cromada (as duas colunas e a testeira) e a borracha do pé
      const moldura: THREE.Vector3[] = [];
      for (let i = 0; i <= 6; i++) moldura.push(noVidro(-1, i / 6));
      for (let i = 1; i <= 10; i++) moldura.push(noVidro(-1 + (i / 10) * 2, 1));
      for (let i = 5; i >= 0; i--) moldura.push(noVidro(1, i / 6));
      casco.add(tubo(moldura, 0.021, P.churrascoInox, false, 8));
      const pe: THREE.Vector3[] = [];
      for (let i = 0; i <= 12; i++) pe.push(noVidro(-1 + (i / 12) * 2, 0.03));
      casco.add(tubo(pe, 0.024, P.carrinhoBorracha));
      // o furo: o anel de borracha gordo por onde a tromba sai, com o filete cromado
      const meio = noVidro(0, FURO);
      const normal = noVidro(0, FURO + 0.1).sub(noVidro(0, FURO - 0.1)).cross(new V(1, 0, 0)).normalize();
      if (normal.z < 0) normal.negate();
      const anel = new THREE.Group();
      anel.add(malha(new THREE.TorusGeometry(0.165, 0.032, 8, 26), P.carrinhoBorracha));
      const filete = malha(new THREE.TorusGeometry(0.2, 0.01, 5, 26), P.churrascoInox); filete.position.z = 0.006; anel.add(filete);
      anel.position.copy(meio); anel.quaternion.setFromUnitVectors(new V(0, 0, 1), normal);
      casco.add(anel);
      // os retrovisores redondos, um de cada lado, na haste
      for (const lado of [-1, 1]) {
        const pe2 = noVidro(lado, 0.12), ponta = new V(lado * 0.69, 1.25, 0.86);
        casco.add(tubo([pe2, pe2.clone().lerp(ponta, 0.5).add(new V(0, 0.03, 0)), ponta], 0.011, P.churrascoInox));
        const espelho = por(malha(new THREE.SphereGeometry(0.066, 12, 8), P.carrinhoRosa), ponta.x, ponta.y, ponta.z);
        espelho.scale.set(1, 1, 0.5);
        const vidrinho = por(malha(new THREE.CircleGeometry(0.052, 14), P.onibusParaBrisa), ponta.x, ponta.y, ponta.z - 0.035);
        vidrinho.rotation.y = Math.PI;
      }
      // o limpador, deitado no pé do vidro
      casco.add(tubo([noVidro(-0.55, 0.06).add(new V(0, 0, 0.02)), noVidro(-0.2, 0.2).add(new V(0, 0, 0.02))], 0.008, P.carrinhoBorracha));
    }

    // ------------------------------------------------------- as portas: o corte, a maçaneta, o friso e o adesivo da roda gigante
    for (const lado of [-1, 1]) {
      for (const z of [0.52, -0.5]) {
        const corte: THREE.Vector3[] = [];
        for (let i = 0; i <= 8; i++) { const y = 0.3 + (i / 8) * (C.borda - 0.34); const { p, n } = naLateral(z, y, lado); corte.push(p.addScaledVector(n, 0.002)); }
        casco.add(tubo(corte, 0.007, P.carrinhoRosaEscuro, false, 5));
      }
      casco.add(pregar(malha(quina(0.15, 0.036, 0.034, 0.014), P.churrascoInox), -0.36, 0.86, lado, 0.012));
      // o friso cromado na cintura, de arco a arco
      const friso: THREE.Vector3[] = [];
      for (let i = 0; i <= 10; i++) { const z = -0.44 + (i / 10) * 0.88; const { p, n } = naLateral(z, C.cintura, lado); friso.push(p.addScaledVector(n, 0.004)); }
      casco.add(tubo(friso, 0.011, P.churrascoInox, false, 6));
      // o adesivo da porta: a roda gigante do lado do Bebito, e o "elefante a bordo" do outro
      casco.add(adesivoNaLateral(0.04, 0.8, 0.135, lado, toon(P.placaPintada, { mapa: lado < 0 ? adesivoDaRodaGigante() : adesivoElefanteABordo() })));
      // as lanternas de trás, redondas, e a almofadinha em cima da porta (onde a orelha pousa)
      const lanterna = pregar(malha(new THREE.SphereGeometry(0.062, 12, 8), P.rodaVermelho), -1.19, 0.74, lado, 0.004);
      lanterna.scale.set(1, 1, 0.5); casco.add(lanterna);
      const aro = pregar(malha(new THREE.TorusGeometry(0.064, 0.012, 5, 16), P.churrascoInox), -1.19, 0.74, lado, 0.01);
      casco.add(aro);
      const xAlmofada = (meiaLargura(0.34) * OMBRO + meiaCabine(0.34)) / 2;
      const almofada = por(malha(new THREE.SphereGeometry(1, 12, 8), P.carrinhoForro), lado * xAlmofada, C.borda + 0.045, 0.34);
      almofada.scale.set(0.085, 0.03, 0.2);
    }

    // ------------------------------------------------------- atrás: a capota enrolada (não fecha com ele dentro), o escapamento e o catavento
    {
      const rolo = por(malha(new THREE.CapsuleGeometry(0.082, 0.8, 4, 12).rotateZ(Math.PI / 2), P.carrinhoForro), 0, altoDaTampa(-1.215) + 0.07, -1.215);
      rolo.scale.set(1, 0.9, 1);
      for (const x of [-0.26, 0.26]) {
        const cinta = por(malha(new THREE.TorusGeometry(0.088, 0.014, 6, 16).rotateY(Math.PI / 2), P.woodDark), x, altoDaTampa(-1.215) + 0.07, -1.215);
        cinta.scale.set(1, 0.9, 1);
      }
      por(malha(new THREE.CylinderGeometry(0.032, 0.032, 0.16, 10).rotateX(Math.PI / 2), P.churrascoInox), -0.3, 0.3, -C.meio + 0.02);
      por(malha(new THREE.CylinderGeometry(0.022, 0.022, 0.165, 10).rotateX(Math.PI / 2), P.onibusPainel), -0.3, 0.3, -C.meio + 0.02);
      // o catavento, numa varetinha no canto de trás (do lado do Bebito)
      const pe = new V(-0.47, altoDaTampa(-1.14) + 0.02, -1.14), alto = new V(-0.52, 1.56, -1.22);
      casco.add(tubo([pe, pe.clone().lerp(alto, 0.5).add(new V(0, 0, 0.01)), alto], 0.011, P.churrascoInox));
      this.catavento = por(catavento(), alto.x, alto.y, alto.z + 0.03, this.lata);
      // a chave de corda, espetada na traseira (o carrinho é quase de brinquedo): gira enquanto ele anda
      this.chave = por(chaveDeCorda(), 0, 0.64, -C.meio + 0.03, this.lata);
      por(malha(new THREE.TorusGeometry(0.034, 0.012, 5, 12), P.churrascoInox), 0, 0.64, -C.meio + 0.012);
    }

    // ------------------------------------------------------- no capô: a corneta de latão que a tromba aperta
    {
      const c = corneta();
      c.position.set(0.21, yDaTampa(1.1, 0.21) + 0.075, 1.1); c.rotation.x = 0.28; c.rotation.y = 0.1;
      this.pera = c.getObjectByName('pera-da-corneta') ?? null;
      // o pezinho que a segura no capô
      por(malha(new THREE.CylinderGeometry(0.012, 0.018, 0.07, 8), P.churrascoInox), 0.21, yDaTampa(1.1, 0.21) + 0.03, 1.1);
      this.lata.add(c);
    }

    // ------------------------------------------------------- por dentro: o volante miúdo e a cestinha de docinhos na porta
    {
      const volante = por(malha(new THREE.TorusGeometry(0.11, 0.017, 6, 18), P.carrinhoForro), 0, 0.9, 0.66);
      volante.rotation.x = -1.0;
      casco.add(tubo([new V(0, 0.9, 0.66), new V(0, 0.78, 0.86)], 0.014, P.churrascoInox));
      // a cestinha de docinhos, pendurada na porta do lado do Bebito: é dela que sai a caixinha
      const cesta = new THREE.Group();
      cesta.add(malha(quina(0.17, 0.13, 0.26, 0.03), P.carrinhoLatao));
      const forro = malha(quina(0.15, 0.03, 0.24, 0.012), P.carrinhoForro); forro.position.y = 0.062; cesta.add(forro);
      const cores = [P.docinhoForminha, P.quepeCookie, P.carrinhoLatao, P.docinhoForminha, P.quepeCookieFita, P.carrinhoForro];
      for (let i = 0; i < 6; i++) {
        const forminha = malha(new THREE.CylinderGeometry(0.034, 0.024, 0.03, 10), cores[i]);
        forminha.position.set((i % 2 ? 0.038 : -0.038), 0.085, -0.08 + Math.floor(i / 2) * 0.08); cesta.add(forminha);
        const brigadeiro = malha(new THREE.SphereGeometry(0.027, 8, 6), P.chocolate);
        brigadeiro.position.set(forminha.position.x, 0.108, forminha.position.z); cesta.add(brigadeiro);
      }
      for (const z of [-0.09, 0.09]) {
        const gancho = tubo([new V(0.07, 0.05, z), new V(0.1, 0.2, z), new V(0.2, 0.22, z), new V(0.24, 0.16, z)], 0.008, P.churrascoInox, false, 5);
        cesta.add(gancho);
      }
      const { p } = naLateral(-0.14, 0.86, -1);
      cesta.position.set(p.x - 0.1, 0.84, -0.14);
      casco.add(cesta);
    }

    // ------------------------------------------------------- vazio (estacionado): o banco, com o formato dele
    if (estacionado) {
      por(malha(quina(0.92, 0.1, 0.78, 0.045), P.carrinhoForro), 0, C.piso + 0.07, -0.42);
      const encosto = por(malha(quina(0.86, 0.46, 0.12, 0.055), P.carrinhoRosa), 0, C.piso + 0.38, -0.84);
      encosto.rotation.x = -0.16;
      // os vivos do estofado, em rosa mais forte, e uma almofadinha de coração esquecida no banco
      for (const z of [-0.62, -0.22]) por(malha(quina(0.9, 0.014, 0.022, 0.006), P.carrinhoRosaEscuro), 0, C.piso + 0.125, z);
      const almofada = por(malha(new THREE.SphereGeometry(0.12, 12, 8), P.vagaRosa), 0.24, C.piso + 0.17, -0.5);
      almofada.scale.set(1, 0.45, 0.9);
    }

    juntarPorCor(casco);
    this.lata.add(fundir(casco));
    this.group.add(this.lata);

    // ------------------------------------------------------- as rodinhas (no eixo, que abre com o peso)
    for (const z of [C.eixo, -C.eixo]) for (const lado of [-1, 1]) {
      const eixo = new THREE.Group();
      eixo.position.set(lado * C.bitola, C.roda, z);
      const r = rodinha(lado);
      juntarPorCor(r);
      eixo.add(fundir(r));
      this.rodas.push(r); this.eixos.push(eixo); this.group.add(eixo);
    }

    if (!estacionado) {
      // ----------------------------------------------------- o dono, espremido lá dentro
      const cookie = new Cookie({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
      cookie.entrarEmServico();
      cookie.noCarrinho = this.pose;
      // (a barriga dele pousa no piso: as patas, que somem, ficariam abaixo do chão)
      cookie.group.position.set(0, C.piso - 0.66, C.cookie);
      this.lata.add(cookie.group);
      this.cookie = cookie;
      // a caixinha que ele estende com a ponta da tromba (só aparece na hora)
      this.caixinha = caixinhaDeDocinhos();
      this.caixinha.position.y = -0.33; this.caixinha.rotation.x = Math.PI; this.caixinha.scale.setScalar(1.45);
      this.caixinha.visible = false;
      cookie.pontaDaTromba.add(this.caixinha);
      // a fumacinha do escapamento: "puf, puf", do esforço
      this.fumaca = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 8, 6), toon(P.neveFofa, { opacity: 0.85 }), 8);
      this.fumaca.name = 'fumacinha'; this.fumaca.frustumCulled = false; this.fumaca.userData.semSombra = true;
      const nada = new THREE.Matrix4().makeScale(0, 0, 0);
      for (let i = 0; i < 8; i++) this.fumaca.setMatrixAt(i, nada);
      this.group.add(this.fumaca);
      this.update(0, 0, false);
    } else {
      this.assentar(0, 0);
      fundirComoFundo(this.group);
    }
  }

  /** a tromba aperta a pera da corneta duas vezes (o "fon-fon" é da cena) */
  buzinar(): void { this.buzina = 0.7; }

  /** ele levanta a tromba com a caixinha de docinhos, para o lado do Bebito */
  oferecer(sim: boolean): void {
    this.oferecendo = sim;
    if (this.caixinha) this.caixinha.visible = sim;
  }

  /** os dois docinhos saem da caixinha e voam, um atrás do outro, até `alvo` (no mundo: a janela do Bebito) */
  jogarDocinhos(alvo: THREE.Vector3): void {
    if (!this.cookie) return;
    this.group.updateMatrixWorld(true);
    const de = this.group.worldToLocal(this.cookie.pontaDaTromba.localToWorld(new V(0, -0.3, 0)));
    const para = this.group.worldToLocal(alvo.clone());
    for (let i = 0; i < 2; i++) {
      const doce = docinhoDoCookie();
      doce.scale.setScalar(3.4); doce.visible = false;
      this.group.add(doce);
      this.voando.push({ doce, t: -i * 0.28, de, para: para.clone().add(new V(0, 0, i ? -0.25 : 0.25)) });
    }
    if (this.caixinha) this.caixinha.visible = false;
    this.oferecendo = false;
  }

  /** a mola: o quanto a lataria afunda atrás e tomba de lado */
  private assentar(peso: number, tombo: number): void {
    // com ele dentro a traseira afunda (o nariz sobe) e as rodas abrem; vazio, o carrinho fica em pé
    this.lata.rotation.x = -0.05 * peso;
    this.lata.position.y = -0.03 * peso;
    this.lata.rotation.z = tombo;
    for (let i = 0; i < this.eixos.length; i++) {
      const lado = i % 2 === 0 ? -1 : 1, atras = i >= 2;
      this.eixos[i].rotation.z = lado * peso * (atras ? 0.2 : 0.09);
    }
  }

  update(dt: number, distancia: number, conversando: boolean): void {
    this.relogio += dt;
    const v = dt > 0 ? distancia / dt : 0;
    this.velocidade += (v - this.velocidade) * Math.min(1, dt * 4);
    const anda = preso(this.velocidade / 6);
    for (const r of this.rodas) r.rotation.x += distancia / C.roda;

    // ----- a mola: o molejo na estrada e o tombo para o lado do Bebito quando ele para para conversar
    const alvoTombo = conversando ? 0.06 : 0;
    this.vTombo += ((alvoTombo - this.tombo) * 46 - this.vTombo * 5.5) * dt;
    this.tombo += this.vTombo * dt;
    this.assentar(1, this.tombo + Math.sin(this.relogio * 5.1) * 0.006 * anda);
    this.lata.position.y += (Math.sin(this.relogio * 8.3) * 0.012 + Math.sin(this.relogio * 13.1) * 0.006) * anda;
    this.lata.rotation.x += Math.sin(this.relogio * 6.7) * 0.008 * anda;

    // ----- o catavento gira com o vento, e a pera da corneta amassa na buzinada
    if (this.catavento) this.catavento.rotation.z -= dt * (1.2 + this.velocidade * 3.2);
    if (this.chave) this.chave.rotation.z += dt * this.velocidade * 0.9;
    if (this.buzina > 0) this.buzina = Math.max(0, this.buzina - dt);
    const aperto = this.buzina > 0 ? Math.max(0, Math.sin((0.7 - this.buzina) / 0.7 * Math.PI * 2)) : 0;
    if (this.pera) this.pera.scale.set(1 + aperto * 0.25, 1 - aperto * 0.45, 1);

    // ----- o Cookie: as orelhas no vento, a tromba no capô (ou estendendo a caixinha) e o olhar para o lado
    if (this.cookie) {
      const p = this.pose;
      p.vento += (anda - p.vento) * Math.min(1, dt * 3);
      p.olhar = conversando ? -0.24 : 0;
      p.deLado = this.oferecendo ? -1.2 : 0;
      const alvo = this.oferecendo ? TROMBA_OFERECENDO : TROMBA_NO_CAPO;
      const tromba = p.tromba as number[];
      for (let i = 0; i < tromba.length; i++) tromba[i] = alvo[i] + (i === 3 && !this.oferecendo ? aperto * 0.4 : 0);
      this.cookie.update(dt);
    }

    // ----- a fumacinha: uma bolinha a cada tanto, que fica para trás na estrada, cresce e some
    if (this.fumaca) {
      this.proximaFumaca -= dt;
      if (this.velocidade > 0.6 && this.proximaFumaca <= 0) {
        this.proximaFumaca = 0.34;
        this.puffs.push({ idade: 0, x: -0.3, y: 0.3, z: -C.meio - 0.08, vz: -this.velocidade });
        if (this.puffs.length > 8) this.puffs.shift();
      }
      const m = new THREE.Matrix4();
      for (let i = 0; i < 8; i++) {
        const f = this.puffs[i];
        if (!f || f.idade > 0.95) { m.makeScale(0, 0, 0); this.fumaca.setMatrixAt(i, m); continue; }
        f.idade += dt; f.z += f.vz * dt * 0.85; f.y += dt * 0.9; f.vz *= 1 - Math.min(1, dt * 1.5);
        const k = f.idade / 0.95, tam = (0.45 + k * 1.2) * (1 - k * k);
        m.makeScale(tam, tam, tam).setPosition(f.x, f.y, f.z);
        this.fumaca.setMatrixAt(i, m);
      }
      this.fumaca.instanceMatrix.needsUpdate = true;
    }

    // ----- os docinhos voando: um arco alto, girando, até a janela do Bebito
    for (let i = this.voando.length - 1; i >= 0; i--) {
      const d = this.voando[i];
      d.t += dt / 0.8;
      if (d.t < 0) continue;
      if (d.t >= 1) { this.group.remove(d.doce); this.voando.splice(i, 1); continue; }
      d.doce.visible = true;
      d.doce.position.lerpVectors(d.de, d.para, d.t);
      d.doce.position.y += Math.sin(d.t * Math.PI) * 1.1;
      d.doce.rotation.set(d.t * 7, d.t * 4, 0);
    }
  }
}
