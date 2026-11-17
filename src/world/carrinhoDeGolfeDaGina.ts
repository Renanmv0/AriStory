import * as THREE from 'three';
import { Gina, type PoseDaGinaNoCarrinho } from '../entities/bichos/Gina';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo, juntarPorCor } from './fundir';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { FONTE_FORMA } from './halloween/barracaDoWalter';
import { novaTextura } from './texturasDeChao';

/**
 * ======================================== O CARRINHO DE GOLFE DA GINA
 *
 * O quinto veículo dos personagens da estrada e o primeiro novo do CLUBE
 * (`docs/CARRINHO-DE-GOLFE-DA-GINA.md`), escolhido pelo Renan: a Gina, a
 * girafa porteira, vai no carrinho de golfe do clube — a portaria sobre rodas.
 *
 * - creme e verde, as cores da guarita; a placa "PORTARIA" e o escudo do clube
 *   no nariz; os faróis redondos com CÍLIOS, como os dela;
 * - o TOLDO LISTRADO com o lambrequim vermelho do telhado da guarita, e um
 *   FURO OVAL no meio, com a gola de lona, por onde o pescoço sai — ela é alta
 *   demais para qualquer teto;
 * - o GIROFLEX laranja em cima do toldo, girando;
 * - no painel, o rádio comunicador, a garrafa térmica de café e a PRANCHETA
 *   com a lista de sócios; atrás, os dois cones e a cancelinha dobrável;
 * - ela vai deitada no banco comprido, as pernas sumidas embaixo do corpo;
 *   parada do lado do Bebito, o pescoço inclina até a janela dele com o
 *   CARIMBO na boca, e o selo de sócio fica colado no para-brisa.
 *
 * O contrato é o dos veículos da estrada: base em `y = 0`, a frente no `+Z`, o
 * lado do Bebito é o `−X`, `update(dt, distancia, conversando)`; `estacionado`
 * monta a versão vazia, juntada como fundo.
 */
export const CARRINHO_DE_GOLFE = {
  /** meio comprimento (do nariz à grade dos cones) e meia largura (nos para-lamas) */
  meio: 1.6, meiaLargura: 0.74,
  roda: 0.21, eixoFrente: 0.95, eixoTras: -0.95, bitola: 0.6,
  /** o alto do banco (onde a barriga dela pousa) e o toldo */
  banco: 0.8, toldo: 1.78,
  /**
   * o RECORTE do toldo por onde o pescoço sai: uma meia-elipse aberta na beira do lado do Bebito (o `z` do
   * meio, a fundura para dentro e a meia largura) — fechado, como um furo, o pescoço não tinha por onde descer
   * para pôr a cabeça para fora pela lateral do carrinho
   */
  recorte: { z: -0.12, fundo: 0.62, rz: 0.34 },
  /** o meio do corpo dela: no comprimento do carrinho e um tico para o lado do Bebito (o pescoço chega mais perto da janela) */
  gina: -0.42, ginaX: -0.24,
} as const;
const C = CARRINHO_DE_GOLFE;
const V = THREE.Vector3;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const preso = (x: number): number => Math.max(0, Math.min(1, x));
const CREME = P.guaritaParede;
const VERDE = P.guaritaFaixa;

const tubo = (pts: THREE.Vector3[], raio: number, cor: number, lados = 7): THREE.Mesh =>
  new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), Math.max(8, pts.length * 5), raio, lados, false), toon(cor));

// ================================================================ as pinturas

/** a lona do toldo: listras verdes e cremes de 25 cm (o UV do toldo já vem em metros) */
function lonaListrada(): THREE.CanvasTexture {
  return novaTextura('toldo-do-carrinho-de-golfe', 0.5, (c, s) => {
    c.fillStyle = css(CREME); c.fillRect(0, 0, s, s);
    c.fillStyle = css(VERDE);
    c.fillRect(0, 0, s / 2, s);
    // a trama da lona, de leve
    c.fillStyle = 'rgba(0,0,0,0.05)';
    for (let y = 0; y < s; y += 6) c.fillRect(0, y, s, 2);
  });
}

let placa: THREE.CanvasTexture | null = null;
function placaDaPortaria(): THREE.CanvasTexture {
  if (placa) return placa;
  placa = canvasComLetra(256, 80, (c) => {
    c.fillStyle = css(CREME); c.fillRect(0, 0, 256, 80);
    c.strokeStyle = css(VERDE); c.lineWidth = 7; c.strokeRect(5, 5, 246, 70);
    c.fillStyle = css(VERDE); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 40px ${FONTE_FORMA}`; c.fillText('PORTARIA', 128, 43);
  });
  return placa;
}

let escudo: THREE.CanvasTexture | null = null;
/** o escudo do clube no nariz: o círculo verde, a girafinha de quepe e "CLUBE" */
function escudoDoClube(): THREE.CanvasTexture {
  if (escudo) return escudo;
  escudo = canvasComLetra(160, 160, (c) => {
    c.fillStyle = css(P.gold); c.beginPath(); c.arc(80, 80, 80, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(VERDE); c.beginPath(); c.arc(80, 80, 70, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.girafaPelo);
    c.beginPath(); c.ellipse(80, 76, 24, 28, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.girafaMancha);
    for (const [dx, dy, r] of [[-11, -4, 5], [10, 6, 4], [-2, 14, 3]]) { c.beginPath(); c.arc(80 + dx, 76 + dy, r, 0, Math.PI * 2); c.fill(); }
    c.fillStyle = '#2b2721';
    for (const dx of [-8, 8]) { c.beginPath(); c.arc(80 + dx, 70, 3.4, 0, Math.PI * 2); c.fill(); }
    c.fillStyle = css(CREME); c.fillRect(56, 40, 48, 14);
    c.fillStyle = css(P.portaoFerro); c.fillRect(54, 52, 52, 5);
    c.fillStyle = css(CREME); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 22px ${FONTE_FORMA}`; c.fillText('CLUBE', 80, 128);
  });
  return escudo;
}

let lista: THREE.CanvasTexture | null = null;
/** a folha da prancheta: a lista de sócios, com os dois nomes já ticados */
function listaDeSocios(): THREE.CanvasTexture {
  if (lista) return lista;
  lista = canvasComLetra(128, 160, (c) => {
    c.fillStyle = '#fbf8ef'; c.fillRect(0, 0, 128, 160);
    c.fillStyle = css(VERDE); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 15px ${FONTE_FORMA}`; c.fillText('SÓCIOS', 64, 18);
    c.strokeStyle = '#9fb0b8'; c.lineWidth = 2;
    for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(14, 42 + i * 19); c.lineTo(114, 42 + i * 19); c.stroke(); }
    c.strokeStyle = css(P.rodaVermelho); c.lineWidth = 4;
    for (const y of [36, 55]) { c.beginPath(); c.moveTo(16, y); c.lineTo(22, y + 5); c.lineTo(32, y - 6); c.stroke(); }
  });
  return lista;
}

// ================================================================ as peças

/** a roda do carrinho de golfe: miúda, pneu gordo, a calota creme e o miolo cromado (eixo em `X`) */
function roda(lado: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.065, 10, 24).rotateY(Math.PI / 2), toon(P.onibusPneu)));
  const calota = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.1, 18).rotateZ(Math.PI / 2), toon(CREME));
  calota.position.x = lado * 0.012; g.add(calota);
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-lado * Math.PI / 2), toon(P.churrascoInox));
  miolo.scale.set(0.6, 1, 1); miolo.position.x = lado * 0.06; g.add(miolo);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const furo = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 4), toon(VERDE));
    furo.scale.set(0.4, 1, 1);
    furo.position.set(lado * 0.064, Math.sin(a) * 0.085, Math.cos(a) * 0.085); g.add(furo);
  }
  return g;
}

/** o farol redondo do nariz, com a pálpebra creme e TRÊS CÍLIOS, como os da dona */
function farol(lado: number): THREE.Group {
  const g = new THREE.Group();
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.016, 6, 20), toon(P.churrascoInox));
  g.add(aro);
  const lente = new THREE.Mesh(new THREE.SphereGeometry(0.072, 14, 10), toon(P.sorveteriaCreme, { glow: 0.6 }));
  lente.scale.z = 0.4; g.add(lente);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), toon(P.metalWhite, { glow: 0.9 }));
  brilho.position.set(-lado * 0.025, 0.026, 0.03); g.add(brilho);
  for (let k = 0; k < 3; k++) {
    const cilio = new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.045, 2, 5), toon(0x2b2721));
    const a = Math.PI / 2 + lado * (0.25 + k * 0.32);
    cilio.position.set(Math.cos(a) * 0.098, Math.sin(a) * 0.098, 0.01);
    cilio.rotation.z = a - Math.PI / 2;
    g.add(cilio);
  }
  return g;
}

/** o giroflex: a base, a cúpula laranja acesa e o espelho que gira lá dentro (o grupo `giroflex` gira) */
function giroflex(): { peca: THREE.Group; gira: THREE.Group } {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.05, 16), toon(P.portaoFerro));
  base.position.y = 0.025; g.add(base);
  const gira = new THREE.Group();
  gira.name = 'giroflex';
  gira.position.y = 0.05;
  const espelho = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.012), toon(P.metalWhite, { glow: 0.8 }));
  espelho.position.set(0, 0.05, 0.02); gira.add(espelho);
  const facho = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 10, 1, true).rotateX(-Math.PI / 2), toon(P.coneLaranja, { glow: 0.9, doubleSide: true }));
  facho.position.set(0, 0.05, 0.08); gira.add(facho);
  g.add(gira);
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.coneLaranja, { glow: 0.45, opacity: 0.72 }));
  cupula.scale.set(1, 1.35, 1); cupula.position.y = 0.05; cupula.userData.semSombra = true; g.add(cupula);
  return { peca: g, gira };
}

/** o cone de trânsito (laranja com a faixa branca e a base quadrada) */
function cone(): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(quina(0.2, 0.025, 0.2, 0.008), toon(P.coneLaranja)));
  const corpo = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.32, 14), toon(P.coneLaranja));
  corpo.position.y = 0.17; g.add(corpo);
  const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.041, 0.051, 0.06, 14, 1, true), toon(P.metalWhite));
  faixa.position.y = 0.18; g.add(faixa);
  return g;
}

/** o carimbo que ela segura na boca: o cabo de madeira com a bolota e a base com a borracha vermelha */
function carimbo(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'carimbo';
  const bolota = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), toon(P.woodDark));
  bolota.position.y = 0.11; g.add(bolota);
  const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, 0.08, 8), toon(P.wood));
  cabo.position.y = 0.06; g.add(cabo);
  g.add(new THREE.Mesh(quina(0.09, 0.03, 0.06, 0.008), toon(P.wood)));
  const borracha = new THREE.Mesh(quina(0.085, 0.012, 0.055, 0.004), toon(P.rodaVermelho));
  borracha.position.y = -0.019; g.add(borracha);
  return g;
}

/** o nariz do carrinho: o perfil de lado (com o arco da roda da frente) extrudado na largura, com bisel */
function geoDoNariz(largura: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // o perfil no plano (−z, y): o `x` da forma é o `−z` do carrinho, para a extrusão girada cair certa
  const pts: Array<[number, number]> = [[0.6, 0.36], [0.66, 0.36]];
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI - (i / 10) * Math.PI;
    pts.push([C.eixoFrente + Math.cos(a) * 0.29, Math.max(0.36, C.roda + Math.sin(a) * 0.29)]);
  }
  pts.push([1.26, 0.36], [1.44, 0.38], [1.53, 0.48], [1.54, 0.62], [1.48, 0.78], [1.3, 0.9], [1.0, 0.98], [0.74, 1.02], [0.66, 0.98], [0.62, 0.86]);
  pts.forEach(([z, y], i) => (i ? s.lineTo(-z, y) : s.moveTo(-z, y)));
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: largura, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3, curveSegments: 6 });
  geo.rotateY(Math.PI / 2);
  geo.translate(-largura / 2, 0, 0);
  return geo;
}

/**
 * o toldo: o retângulo de quina redonda com o RECORTE em meia-elipse na beira do lado do Bebito (`−X`),
 * extrudado fininho. No plano da forma o `y` vira o `−z` depois do giro, e o toldo é posto no `zMeio`.
 */
function geoDoToldo(meiaX: number, meiaZ: number, r: number, zMeio: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const zc = -(C.recorte.z - zMeio), rz = C.recorte.rz;
  s.moveTo(-meiaX + r, -meiaZ);
  s.lineTo(meiaX - r, -meiaZ); s.quadraticCurveTo(meiaX, -meiaZ, meiaX, -meiaZ + r);
  s.lineTo(meiaX, meiaZ - r); s.quadraticCurveTo(meiaX, meiaZ, meiaX - r, meiaZ);
  s.lineTo(-meiaX + r, meiaZ); s.quadraticCurveTo(-meiaX, meiaZ, -meiaX, meiaZ - r);
  // descendo a beira da esquerda: o recorte entra e volta
  s.lineTo(-meiaX, zc + rz);
  s.absellipse(-meiaX, zc, C.recorte.fundo, rz, Math.PI / 2, -Math.PI / 2, true, 0);
  s.lineTo(-meiaX, -meiaZ + r); s.quadraticCurveTo(-meiaX, -meiaZ, -meiaX + r, -meiaZ);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2, curveSegments: 18 });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

/** o lambrequim: a beira do toldo recortada em meias-luas, num lado (de `a` a `b`, no plano XZ) */
function geoDoLambrequim(a: THREE.Vector3, b: THREE.Vector3): THREE.BufferGeometry {
  const comp = a.distanceTo(b), n = Math.max(2, Math.round(comp / 0.2)), passo = comp / n;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  for (let i = 0; i < n; i++) s.absarc(i * passo + passo / 2, 0, passo / 2, Math.PI, 0, true);
  s.lineTo(comp, 0.07); s.lineTo(0, 0.07); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false, curveSegments: 5 });
  geo.translate(0, -0.07, 0);
  const giro = Math.atan2(-(b.z - a.z), b.x - a.x);
  geo.rotateY(giro);
  geo.translate(a.x, a.y, a.z);
  return geo;
}

export class CarrinhoDeGolfeDaGina {
  readonly group = new THREE.Group();
  /** a dona (`null` no carrinho estacionado) */
  readonly gina: Gina | null = null;
  private readonly lata = new THREE.Group();
  private readonly rodas: THREE.Group[] = [];
  private readonly rodasDaFrente: THREE.Group[] = [];
  private readonly giroflex: THREE.Group;
  private readonly carimbo: THREE.Group | null = null;
  private readonly pose: PoseDaGinaNoCarrinho = { vento: 0, olhar: 0, esticar: 0 };
  private relogio = 0;
  private velocidade = 0;
  private esticando = false;
  /** o quanto o pescoço já esticou, sem a batida do carimbo por cima */
  private esticado = 0;
  private batida = -1;
  private balanco = 0;
  private vBalanco = 0;
  /** quantas vezes o carimbo bateu (o teste confere) */
  carimbadas = 0;

  constructor(estacionado = false) {
    this.group.userData.peca = 'carrinho-de-golfe-da-gina';
    const casco = new THREE.Group();
    const por = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, pai: THREE.Object3D = casco): T => { o.position.set(x, y, z); pai.add(o); return o; };
    const malha = (geo: THREE.BufferGeometry, cor: number): THREE.Mesh => new THREE.Mesh(geo, toon(cor));

    // ------------------------------------------------------- o chassi: o nariz, o piso, a caixa do banco e os para-lamas de trás
    const LN = 1.1;
    casco.add(malha(geoDoNariz(LN), CREME));
    // a faixa verde dando a volta no nariz (um fio fora do lado e da frente)
    for (const lado of [-1, 1]) {
      const faixa = por(malha(new THREE.PlaneGeometry(0.62, 0.08), VERDE), lado * (LN / 2 + 0.096), 0.66, 1.08);
      faixa.rotation.y = lado * Math.PI / 2;
    }
    por(malha(quina(1.04, 0.07, 2.2, 0.03), P.onibusPainel), 0, 0.33, -0.25);
    // os estribos entre as rodas, com a borracha de pisar
    for (const lado of [-1, 1]) por(malha(quina(0.2, 0.05, 1.1, 0.02), P.onibusPainel), lado * 0.6, 0.31, 0);
    // a caixa debaixo do banco (o motor e a bateria), creme com a faixa verde
    por(malha(quina(1.0, 0.36, 1.86, 0.07), CREME), 0, 0.53, -0.62);
    for (const lado of [-1, 1]) {
      const faixa = por(malha(new THREE.PlaneGeometry(1.0, 0.07), VERDE), lado * 0.503, 0.6, -0.86);
      faixa.rotation.y = lado * Math.PI / 2;
      // o para-lama de trás: meio cano gordo dando a volta na roda
      const pl = por(malha(new THREE.TorusGeometry(0.27, 0.07, 8, 18, Math.PI), CREME), lado * 0.6, C.roda, C.eixoTras);
      pl.rotation.y = Math.PI / 2; pl.scale.set(1, 1, 1.5);
    }
    // o para-choque de borracha atrás e o da frente
    for (const z of [C.meio - 0.04, -1.58]) {
      const pc = por(malha(new THREE.CapsuleGeometry(0.05, 0.98, 4, 10).rotateZ(Math.PI / 2), P.onibusPainel), 0, 0.33, z);
      pc.scale.set(1, 1, 1.1);
    }

    // ------------------------------------------------------- a cara: os faróis de cílios, o escudo e a placa
    for (const lado of [-1, 1]) {
      const f = por(farol(lado), lado * 0.32, 0.62, 1.598);
      f.rotation.x = -0.12;
    }
    por(new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), toon(P.placaPintada, { mapa: escudoDoClube() })), 0, 0.82, 1.476).rotation.x = -0.75;
    for (const [z, giro] of [[C.meio + 0.025, 0], [-1.64, Math.PI]] as const) {
      por(malha(quina(0.34, 0.11, 0.016, 0.006), P.churrascoInox), 0, 0.45, z);
      const p = por(new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.095), toon(P.placaPintada, { mapa: placaDaPortaria() })), 0, 0.45, z + (giro ? -0.01 : 0.01));
      p.rotation.y = giro;
    }

    // ------------------------------------------------------- o banco comprido (ela vai deitada nele) e o encosto de trás
    por(malha(quina(0.96, 0.16, 1.8, 0.07), VERDE), 0, C.banco - 0.08, -0.62);
    for (const z of [-1.18, -0.62, -0.06]) por(malha(new THREE.SphereGeometry(0.022, 8, 6), CREME), 0, C.banco + 0.005, z);
    for (const lado of [-1, 1]) por(malha(quina(0.03, 0.03, 1.8, 0.012), CREME), lado * 0.48, C.banco, -0.62);
    const encosto = por(malha(quina(0.96, 0.42, 0.12, 0.06), VERDE), 0, C.banco + 0.18, -1.48);
    encosto.rotation.x = 0.16;

    // ------------------------------------------------------- o painel: o volante, o rádio, a garrafa térmica e a prancheta
    {
      por(malha(quina(1.0, 0.06, 0.18, 0.025), P.portaoFerro), 0, 1.0, 0.7);
      const volante = por(malha(new THREE.TorusGeometry(0.15, 0.02, 6, 22), P.onibusPainel), -0.24, 1.24, 0.42);
      volante.rotation.x = -0.9;
      casco.add(tubo([new V(-0.22, 1.24, 0.42), new V(-0.22, 1.02, 0.68)], 0.018, P.onibusPainel, 6));
      por(malha(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 10).rotateX(-0.9 + Math.PI / 2), P.churrascoInox), -0.22, 1.24, 0.42);
      // o rádio comunicador em pé, com a antena
      por(malha(quina(0.07, 0.14, 0.045, 0.012), P.onibusPainel), 0.32, 1.1, 0.66);
      casco.add(tubo([new V(0.34, 1.17, 0.66), new V(0.34, 1.33, 0.65)], 0.006, P.onibusPainel, 5));
      por(malha(new THREE.SphereGeometry(0.012, 6, 4), P.rodaVermelho), 0.31, 1.15, 0.688);
      // a garrafa térmica de café do porteiro, com a tampa-copo
      por(malha(new THREE.CylinderGeometry(0.045, 0.045, 0.2, 14), P.rodaVermelho), 0.15, 1.13, 0.68);
      por(malha(new THREE.CylinderGeometry(0.048, 0.04, 0.05, 14), P.portaoFerro), 0.15, 1.25, 0.68);
      // a prancheta com a lista de sócios, encostada no painel
      const prancheta = new THREE.Group();
      prancheta.add(new THREE.Mesh(quina(0.16, 0.22, 0.012, 0.01), toon(P.woodDark)));
      const folha = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.17), toon(P.placaPintada, { mapa: listaDeSocios() }));
      folha.position.set(0, -0.01, 0.008); prancheta.add(folha);
      const presilha = new THREE.Mesh(quina(0.07, 0.025, 0.02, 0.006), toon(P.churrascoInox));
      presilha.position.set(0, 0.1, 0.008); prancheta.add(presilha);
      prancheta.position.set(0.02, 1.13, 0.6); prancheta.rotation.x = -0.35;
      casco.add(prancheta);
    }

    // ------------------------------------------------------- as quatro colunas, o para-brisa e o TOLDO com o furo do pescoço
    {
      const yT = C.toldo;
      for (const lado of [-1, 1]) {
        casco.add(tubo([new V(lado * 0.5, 1.0, 0.68), new V(lado * 0.56, 1.38, 0.62), new V(lado * 0.6, yT, 0.6)], 0.024, P.churrascoInox));
        casco.add(tubo([new V(lado * 0.46, 0.72, -1.5), new V(lado * 0.6, yT, -1.42)], 0.024, P.churrascoInox));
      }
      // o para-brisa de acrílico, com a moldura
      const vidro = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6), toon(P.onibusParaBrisa, { opacity: 0.28, doubleSide: true }));
      vidro.position.set(0, 1.35, 0.645); vidro.rotation.x = -0.08; vidro.userData.semSombra = true; vidro.renderOrder = 3;
      this.lata.add(vidro);
      casco.add(tubo([new V(-0.5, 1.05, 0.68), new V(-0.5, 1.65, 0.62), new V(0.5, 1.65, 0.62), new V(0.5, 1.05, 0.68)], 0.015, P.portaoFerro, 5));
      // o toldo listrado, o forro escuro por baixo e o lambrequim vermelho em volta
      const meiaX = 0.72, meiaZ = 1.12, zMeio = -0.42;
      const toldo = new THREE.Mesh(geoDoToldo(meiaX, meiaZ, 0.12, zMeio), toon(P.placaPintada, { mapa: lonaListrada() }));
      toldo.position.set(0, yT, zMeio);
      casco.add(toldo);
      const zr = C.recorte.z, rz = C.recorte.rz;
      // (o lado do Bebito vai em dois pedaços, um de cada lado do recorte)
      const lados: Array<[THREE.Vector3, THREE.Vector3, THREE.Vector3]> = [
        [new V(-meiaX, yT, zMeio + meiaZ), new V(meiaX, yT, zMeio + meiaZ), new V(0, 0, 1)],
        [new V(meiaX, yT, zMeio + meiaZ), new V(meiaX, yT, zMeio - meiaZ), new V(1, 0, 0)],
        [new V(meiaX, yT, zMeio - meiaZ), new V(-meiaX, yT, zMeio - meiaZ), new V(0, 0, -1)],
        [new V(-meiaX, yT, zMeio - meiaZ), new V(-meiaX, yT, zr - rz - 0.02), new V(-1, 0, 0)],
        [new V(-meiaX, yT, zr + rz + 0.02), new V(-meiaX, yT, zMeio + meiaZ), new V(-1, 0, 0)],
      ];
      for (const [a0, b0, n] of lados) {
        // (cada lado um tico para fora da beira do toldo, para as faces não casarem)
        const a = a0.clone().addScaledVector(n, 0.022), b = b0.clone().addScaledVector(n, 0.022);
        casco.add(new THREE.Mesh(geoDoLambrequim(a, b), toon(P.guaritaTelhado, { doubleSide: true })));
      }
      // a gola de lona dando a volta no recorte (o pescoço passa por ela)
      const gola: THREE.Vector3[] = [];
      for (let i = 0; i <= 16; i++) {
        const a = Math.PI / 2 - (i / 16) * Math.PI;
        gola.push(new V(-meiaX + Math.cos(a) * (C.recorte.fundo + 0.02), yT + 0.05, zr + Math.sin(a) * (rz + 0.02)));
      }
      casco.add(tubo(gola, 0.04, CREME, 8));
      // o giroflex atrás, no meio do toldo (na frente ele ficava na cara dela)
      const g = giroflex();
      g.peca.position.set(0, yT + 0.065, zMeio - meiaZ + 0.28);
      this.lata.add(g.peca);
      this.giroflex = g.gira;
    }

    // ------------------------------------------------------- atrás: a grade com os dois cones e a cancelinha dobrável
    {
      for (const lado of [-1, 1]) casco.add(tubo([new V(lado * 0.4, 0.62, -1.46), new V(lado * 0.42, 0.6, -1.62), new V(lado * 0.42, 0.85, -1.66)], 0.016, P.churrascoInox, 6));
      por(malha(quina(0.9, 0.03, 0.22, 0.01), P.churrascoInoxEscuro), 0, 0.62, -1.56);
      for (const x of [-0.24, 0.24]) por(cone(), x, 0.64, -1.56);
      // a cancelinha: o braço listrado deitado em cima dos cones
      const braco = new THREE.Group();
      const listras = 8;
      for (let i = 0; i < listras; i++) {
        const pedaco = new THREE.Mesh(quina(0.11, 0.05, 0.05, 0.01), toon(i % 2 ? P.metalWhite : P.rodaVermelho));
        pedaco.position.x = -0.385 + i * 0.11; braco.add(pedaco);
      }
      braco.position.set(0, 0.98, -1.6); braco.rotation.z = 0.04;
      casco.add(braco);
    }

    juntarPorCor(casco);
    this.lata.add(fundir(casco));
    this.group.add(this.lata);

    // ------------------------------------------------------- as rodas (as da frente esterçam de leve)
    for (const z of [C.eixoFrente, C.eixoTras]) for (const lado of [-1, 1]) {
      const r = roda(lado);
      juntarPorCor(r);
      const pronta = fundir(r);
      const eixo = new THREE.Group();
      eixo.position.set(lado * C.bitola, C.roda, z);
      eixo.add(pronta);
      this.group.add(eixo);
      this.rodas.push(pronta);
      if (z > 0) this.rodasDaFrente.push(eixo);
    }

    if (!estacionado) {
      // ----------------------------------------------------- a dona, deitada no banco, com o pescoço pelo furo do toldo
      const gina = new Gina({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
      gina.entrarEmServico();
      gina.noCarrinho = this.pose;
      // (o fundo da barriga, em 1,03 no corpo dela, pousa no banco)
      gina.group.position.set(C.ginaX, C.banco - 1.03, C.gina);
      this.lata.add(gina.group);
      this.gina = gina;
      // o carimbo, na boca dela (só aparece na hora)
      const c = carimbo();
      c.position.set(0, -0.11, 0.25); c.rotation.x = 0.5; c.visible = false;
      gina.cabecaDaGina.add(c);
      this.carimbo = c;
      this.update(0, 0, false);
    } else {
      // vazio: o quepe reserva esquecido no banco
      const quepe = new THREE.Group();
      quepe.add(new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.085, 14), toon(VERDE)));
      const tarja = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.128, 0.03, 14), toon(P.portaoFerro)); tarja.position.y = -0.04; quepe.add(tarja);
      quepe.position.set(0.18, C.banco + 0.06, -0.3); quepe.rotation.z = 0.2;
      this.lata.add(quepe);
      fundirComoFundo(this.group);
    }
  }

  /** o pescoço inclina até a janela de quem parou do lado (com o carimbo na boca) — ou volta */
  esticarAteAJanela(sim: boolean): void {
    this.esticando = sim;
    if (this.carimbo) this.carimbo.visible = sim;
  }

  /** a batida do carimbo: a cabeça desce e volta, depressa */
  carimbar(): void { this.batida = 0; this.carimbadas++; }

  /** onde está a borracha do carimbo agora, no mundo (o teste mede até o para-brisa do Bebito) */
  pontaDoCarimbo(): THREE.Vector3 {
    this.group.updateMatrixWorld(true);
    return (this.carimbo ?? this.group).localToWorld(new V(0, -0.025, 0));
  }

  update(dt: number, distancia: number, conversando: boolean): void {
    this.relogio += dt;
    const v = dt > 0 ? distancia / dt : 0;
    this.velocidade += (v - this.velocidade) * Math.min(1, dt * 4);
    const anda = preso(this.velocidade / 6);
    for (const r of this.rodas) r.rotation.x += distancia / C.roda;

    // ----- o molejo: o carrinho balança andando e adorna para o lado do Bebito quando ela estica o pescoço
    const alvo = this.esticando ? 0.03 : 0;
    this.vBalanco += ((alvo - this.balanco) * 34 - this.vBalanco * 4) * dt;
    this.balanco += this.vBalanco * dt;
    this.lata.rotation.z = this.balanco + Math.sin(this.relogio * 4.3) * 0.008 * anda;
    this.lata.position.y = Math.abs(Math.sin(this.relogio * 7.7)) * 0.012 * anda;

    // ----- o giroflex gira sempre (é de serviço); andando, mais depressa
    this.giroflex.rotation.y += dt * (3.5 + anda * 3);

    // ----- ela: as orelhas no vento, a cabeça para quem parou do lado, o pescoço esticando e o carimbo batendo
    if (this.gina) {
      const p = this.pose;
      p.vento += (anda - p.vento) * Math.min(1, dt * 3);
      const alvoOlhar = this.esticando ? -1.25 : conversando ? -0.55 : 0;
      p.olhar += (alvoOlhar - p.olhar) * Math.min(1, dt * 4);
      this.esticado += ((this.esticando ? 1 : 0) - this.esticado) * Math.min(1, dt * 2.2);
      let bate = 0;
      if (this.batida >= 0) {
        this.batida += dt / 0.45;
        bate = Math.sin(Math.min(1, this.batida) * Math.PI);
        if (this.batida >= 1) this.batida = -1;
      }
      // (a batida é o pescoço esticando mais um tico, de repente, e voltando)
      p.esticar = this.esticado + bate * 0.14;
      this.gina.update(dt);
    }
  }
}
