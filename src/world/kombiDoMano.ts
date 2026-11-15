import * as THREE from 'three';
import { Mano } from '../entities/bichos/Mano';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo, juntarPorCor } from './fundir';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { FONTE_FORMA, FONTE_REDONDA } from './halloween/barracaDoWalter';
import { geoBolaDeSorvete, torno, waffle } from './sorveteriaDoMano';

/*
 * ===================================================== A KOMBI DE SORVETE DO MANO
 *
 * O veículo do Mano na estrada (pedido do Renan, 2026-11-15: "faça a Kombi de
 * sorvete! deixe bem detalhada, bonita e fofa"). Ele cruza o Bebito nas rotas
 * do parque (`docs/KOMBI-DO-MANO.md`).
 *
 * - A SILHUETA é a do "pão de forma": a frente reta, o teto de quinas
 *   redondas, o para-brisa dividido com o filete no meio. A lataria é o
 *   PERFIL DE LADO extrudado com bisel (o molde do food truck do Walter), em
 *   duas peças: CHOCOLATE embaixo (com o granulado colorido pintado, a textura
 *   em metros) e CREME em cima, com o V creme descendo pelo nariz — é ele que
 *   diz "Kombi" de frente. A cabine é um recorte no perfil: o Mano aparece
 *   pelas janelas abertas, em pé ao volante (pinguim não senta: o painel e a
 *   porta escondem os pés).
 * - NO TETO a neve: uma tampa fofa com as GOTAS escorrendo pelas beiradas
 *   (um lote de cápsulas, cada uma de um comprimento), e a CASQUINHA GIGANTE
 *   de três bolas (chocolate, morango e baunilha) com o granulado e a cereja,
 *   num suporte de cromo.
 * - NA FRENTE a carinha: os faróis redondos de aro cromado, o emblema redondo
 *   com a casquinha no bico do V, o para-choque de cromo e a placa "MANO".
 * - A JANELA DE VENDA fica no lado `−X` (o do Bebito, quando ele para do
 *   lado): fechada, é o painel pintado "Sorvetes do Mano"; parada para
 *   conversar, o toldo listrado rosa e creme sobe, a bancada desce com as DUAS
 *   CASQUINHAS (a de morango e a de maracujá, as de sempre do quiosque) e lá
 *   dentro aparece a vitrine pintada. As casquinhas somem da bancada quando ele
 *   entrega (`entregarCasquinhas`).
 * - A GRADE DO FREEZER, embaixo do lado `−X`, é de onde sai o ar gelado que
 *   embaça o para-brisa do Bebito (`pontoDoArGelado`).
 *
 * O contrato dos carros dos encontros: base em `y = 0`, a frente para `+Z`, as
 * rodas giram pela distância (`update`), e `estacionada` monta a versão vazia,
 * fundida como fundo.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** as medidas da Kombi (o bisel engorda 5 cm o contorno do perfil) */
export const KOMBI = {
  meiaLargura: 1.0, frente: 2.3, tras: -2.3, chao: 0.42, cintura: 1.18, peitoril: 1.32, forro: 2.04, teto: 2.32,
  roda: 0.36, eixoDaFrente: 1.52, eixoDeTras: -1.5, bitola: 0.84,
  /** a coluna de trás da cabine (onde o recorte da janela da frente acaba) */
  coluna: 0.92,
  /** a janela de venda (lado −X): o meio dela em `z`, a largura e o vão em `y` */
  janela: { z: -0.62, largura: 1.95, baixo: 1.38, alto: 2.0 },
} as const;
const K = KOMBI;
const BISEL = 0.05;
const SABORES = [P.morango, P.maracuja, P.sorveteriaMenta, P.sorveteriaPistache, P.metalWhite, P.sorveteriaRosa, P.maracuja];

// ================================================================ as pinturas

/** a vitrine pintada de dentro da janela: as cubas de sabores, as casquinhas empilhadas, o cardápio e a lâmpada */
let interior: THREE.CanvasTexture | null = null;
function interiorDaKombi(): THREE.CanvasTexture {
  if (interior) return interior;
  const L = 1024, A = 326;
  interior = canvasComLetra(L, A, (c) => {
    // o azulejo menta com o rejunte
    c.fillStyle = css(P.sorveteriaMenta); c.fillRect(0, 0, L, A);
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2;
    for (let x = 0; x <= L; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, A); c.stroke(); }
    for (let y = 0; y <= A; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(L, y); c.stroke(); }
    const sombra = c.createLinearGradient(0, 0, 0, A);
    sombra.addColorStop(0, 'rgba(40,30,40,0.32)'); sombra.addColorStop(0.35, 'rgba(40,30,40,0.04)'); sombra.addColorStop(1, 'rgba(40,30,40,0.18)');
    c.fillStyle = sombra; c.fillRect(0, 0, L, A);
    // o cardápio de lousa, à esquerda
    c.fillStyle = css(P.wood); c.fillRect(36, 56, 270, 190);
    c.fillStyle = css(P.placaDeLousa); c.fillRect(48, 68, 246, 166);
    c.fillStyle = css(P.giz); c.textAlign = 'center';
    c.font = `700 36px ${FONTE_FORMA}`; c.fillText('SABORES', 171, 106);
    c.textAlign = 'left'; c.font = `700 28px ${FONTE_REDONDA}`;
    [['Morango', P.morango], ['Maracujá', P.maracuja], ['Chocolate', P.chocolate], ['Menta', P.sorveteriaMenta]].forEach(([t, cor], i) => {
      c.fillStyle = css(cor as number); c.beginPath(); c.arc(70, 138 + i * 28, 8, 0, Math.PI * 2); c.fill();
      c.fillStyle = css(P.giz); c.fillText(t as string, 86, 148 + i * 28);
    });
    // a lâmpada pendurada e o halo, no meio
    c.strokeStyle = css(P.onibusPainel); c.lineWidth = 3;
    c.beginPath(); c.moveTo(520, 0); c.lineTo(520, 34); c.stroke();
    const halo = c.createRadialGradient(520, 48, 4, 520, 48, 90);
    halo.addColorStop(0, 'rgba(255,240,200,0.9)'); halo.addColorStop(1, 'rgba(255,240,200,0)');
    c.fillStyle = halo; c.fillRect(430, 0, 180, 140);
    c.fillStyle = css(P.luzDoPortao); c.beginPath(); c.arc(520, 46, 13, 0, Math.PI * 2); c.fill();
    // a pilha de casquinhas de cabeça para baixo, a prateleira e os potes de cobertura
    c.fillStyle = css(P.wood); c.fillRect(360, 150, 330, 12);
    for (let i = 0; i < 5; i++) {
      const x = 390 + i * 64;
      c.fillStyle = css(P.casquinhaWaffle);
      for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x - 20, 148 - k * 14); c.lineTo(x + 20, 148 - k * 14); c.lineTo(x, 100 - k * 14); c.closePath(); c.fill(); }
    }
    // a VITRINE de cubas, embaixo, com as bolas de sorvete
    c.fillStyle = css(P.churrascoInox); c.fillRect(330, 230, 660, 90);
    for (let i = 0; i < 7; i++) {
      const x = 370 + i * 90;
      c.fillStyle = css(P.churrascoInoxEscuro); c.fillRect(x - 36, 244, 72, 60);
      c.fillStyle = css(SABORES[i]);
      c.beginPath(); c.ellipse(x, 252, 32, 24, 0, Math.PI, 0); c.fill();
      c.beginPath(); c.arc(x - 8, 246, 14, 0, Math.PI * 2); c.fill();
    }
    // o cartaz do Mano, à direita: o pinguim de casquinha no chapéu (desenho simples)
    c.fillStyle = css(P.sorveteriaRosa); c.fillRect(760, 40, 220, 170);
    c.fillStyle = css(P.sorveteriaCreme); c.fillRect(770, 50, 200, 150);
    c.fillStyle = css(P.pinguimCasaco); c.beginPath(); c.ellipse(870, 150, 46, 48, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.pinguimBarriga); c.beginPath(); c.ellipse(870, 162, 30, 34, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.pinguimBico); c.beginPath(); c.moveTo(860, 132); c.lineTo(880, 132); c.lineTo(870, 144); c.closePath(); c.fill();
    c.fillStyle = css(P.onibusPainel);
    for (const s of [-1, 1]) { c.beginPath(); c.arc(870 + s * 14, 122, 5, 0, Math.PI * 2); c.fill(); }
    c.fillStyle = css(P.casquinhaWaffle); c.beginPath(); c.moveTo(856, 104); c.lineTo(884, 104); c.lineTo(870, 74); c.closePath(); c.fill();
    c.fillStyle = css(P.morango); c.beginPath(); c.arc(870, 70, 14, 0, Math.PI * 2); c.fill();
  });
  return interior;
}

/** o painel pintado dos lados ("Sorvetes do Mano", com a casquinha e as bolinhas), um só para o jogo */
let painel: THREE.CanvasTexture | null = null;
function painelDoMano(): THREE.CanvasTexture {
  if (painel) return painel;
  const L = 1024, A = 326;
  painel = canvasComLetra(L, A, (c) => {
    c.fillStyle = css(P.kombiCreme); c.fillRect(0, 0, L, A);
    // as bolinhas de confeito no fundo
    for (let i = 0; i < 46; i++) {
      c.fillStyle = css(SABORES[i % SABORES.length]);
      c.globalAlpha = 0.5;
      c.beginPath(); c.arc((i * 97) % L, (i * 53) % A, 7, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    c.strokeStyle = css(P.sorveteriaRosa); c.lineWidth = 14; c.strokeRect(10, 10, L - 20, A - 20);
    // a casquinha de duas bolas, à esquerda
    c.fillStyle = css(P.casquinhaWaffle);
    c.beginPath(); c.moveTo(70, 150); c.lineTo(190, 150); c.lineTo(130, 300); c.closePath(); c.fill();
    c.strokeStyle = css(P.casquinhaGrelha); c.lineWidth = 4;
    for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(80 + k * 22, 150); c.lineTo(130 + k * 8, 290); c.stroke(); }
    c.fillStyle = css(P.morango); c.beginPath(); c.arc(130, 130, 56, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.chocolate); c.beginPath(); c.arc(130, 72, 44, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.cerejaDoMano); c.beginPath(); c.arc(132, 26, 14, 0, Math.PI * 2); c.fill();
    // o letreiro
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = css(P.kombiChocolate);
    c.font = `900 96px ${FONTE_FORMA}`;
    c.fillText('Sorvetes', 600, 128, 700);
    c.fillStyle = css(P.sorveteriaRosa);
    c.font = `700 84px ${FONTE_REDONDA}`;
    c.fillText('do Mano', 600, 232, 600);
  });
  return painel;
}

/** a placa da frente, com o nome dele */
let placa: THREE.CanvasTexture | null = null;
function placaDoMano(): THREE.CanvasTexture {
  if (placa) return placa;
  placa = canvasComLetra(256, 96, (c) => {
    c.fillStyle = css(P.sorveteriaCreme); c.fillRect(0, 0, 256, 96);
    c.strokeStyle = css(P.sorveteriaRosa); c.lineWidth = 6; c.strokeRect(6, 6, 244, 84);
    c.fillStyle = css(P.kombiChocolate);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 54px ${FONTE_FORMA}`;
    c.fillText('MANO', 128, 52);
  });
  return placa;
}

/** o emblema redondo do nariz: a casquinha numa medalha rosa */
let emblema: THREE.CanvasTexture | null = null;
function emblemaDaKombi(): THREE.CanvasTexture {
  if (emblema) return emblema;
  emblema = canvasComLetra(128, 128, (c) => {
    c.fillStyle = css(P.sorveteriaRosa); c.beginPath(); c.arc(64, 64, 64, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.casquinhaWaffle); c.beginPath(); c.moveTo(44, 64); c.lineTo(84, 64); c.lineTo(64, 116); c.closePath(); c.fill();
    c.fillStyle = css(P.sorveteriaCreme); c.beginPath(); c.arc(64, 52, 24, 0, Math.PI * 2); c.fill();
    c.fillStyle = css(P.cerejaDoMano); c.beginPath(); c.arc(64, 24, 9, 0, Math.PI * 2); c.fill();
  });
  return emblema;
}

/** a listra do toldo (rosa e creme), na largura da janela */
let lona: THREE.CanvasTexture | null = null;
function lonaDoToldo(): THREE.CanvasTexture {
  if (lona) return lona;
  lona = canvasComLetra(512, 160, (c) => {
    for (let i = 0; i < 10; i++) { c.fillStyle = css(i % 2 ? P.sorveteriaCreme : P.sorveteriaRosa); c.fillRect(i * 51.2, 0, 51.2, 160); }
  });
  return lona;
}

// ================================================================ a lataria

/** um meio arco de roda no contorno de baixo do perfil (`z` do eixo) */
function arcoDeRoda(forma: THREE.Shape, z: number, chao: number): void {
  const r = 0.5, cy = K.roda;
  const a = Math.asin((chao - cy) / r);
  forma.lineTo(z - r * Math.cos(a), chao);
  forma.absarc(z, cy, r, Math.PI - a, a, true);
}

/** o perfil (`u` = z, `v` = y) extrudado na largura, com bisel */
function lataria(forma: THREE.Shape): THREE.ExtrudeGeometry {
  const meia = K.meiaLargura - BISEL;
  const geo = new THREE.ExtrudeGeometry(forma, {
    depth: 2 * meia, bevelEnabled: true, bevelThickness: BISEL, bevelSize: BISEL, bevelSegments: 3, curveSegments: 14,
  });
  geo.translate(0, 0, -meia);
  geo.rotateY(-Math.PI / 2);
  return geo;
}

/** o chocolate: do chão até a cintura, com as caixas de roda e o nariz arredondado embaixo */
function perfilDeBaixo(): THREE.Shape {
  const s = new THREE.Shape();
  const chao = K.chao, c = K.cintura - BISEL, fr = K.frente - BISEL, tr = K.tras + BISEL;
  s.moveTo(tr + 0.16, chao);
  arcoDeRoda(s, K.eixoDeTras, chao);
  arcoDeRoda(s, K.eixoDaFrente, chao);
  s.lineTo(fr - 0.22, chao);
  s.quadraticCurveTo(fr, chao, fr, chao + 0.22);
  s.lineTo(fr, c);
  s.lineTo(tr, c);
  s.lineTo(tr, chao + 0.16);
  s.quadraticCurveTo(tr, chao, tr + 0.16, chao);
  return s;
}

/** o creme: da cintura ao teto, com o recorte da cabine e as quinas redondas do pão de forma */
function perfilDeCima(): THREE.Shape {
  const s = new THREE.Shape();
  const c = K.cintura + BISEL, fr = K.frente - BISEL, tr = K.tras + BISEL;
  const peitoril = K.peitoril - BISEL, forro = K.forro + BISEL, teto = K.teto - BISEL;
  s.moveTo(tr, c);
  s.lineTo(fr, c);
  s.lineTo(fr, peitoril);                                   // a saia da frente, embaixo do para-brisa
  s.lineTo(K.coluna + BISEL, peitoril);                     // o peitoril até a coluna de trás da cabine
  s.lineTo(K.coluna + BISEL, forro);                        // a coluna
  s.lineTo(fr - 0.16, forro);                               // o forro avançando por cima do para-brisa
  s.quadraticCurveTo(fr - 0.02, forro + 0.01, fr - 0.04, forro + 0.12); // a pala, curvinha
  s.quadraticCurveTo(fr - 0.08, teto, fr - 0.46, teto);    // a quina redonda da frente do teto
  s.lineTo(tr + 0.42, teto);
  s.quadraticCurveTo(tr, teto, tr, teto - 0.42);           // a quina de trás
  s.closePath();
  return s;
}

/** o V creme do nariz: o bico desce pelo chocolate até o emblema */
function geoDoV(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const w = K.meiaLargura - 0.08, topo = K.cintura + 0.01, bico = 0.78;
  s.moveTo(-w, topo);
  s.lineTo(w, topo);
  s.lineTo(w, topo - 0.08);
  s.quadraticCurveTo(0.24, topo - 0.12, 0.06, bico + 0.03);
  s.quadraticCurveTo(0, bico - 0.02, -0.06, bico + 0.03);
  s.quadraticCurveTo(-0.24, topo - 0.12, -w, topo - 0.08);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 10 });
  return geo;
}

/** a roda: pneu gordo, a faixa branca e a calota creme de miolo rosa */
function roda(lado: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.11, 10, 28).rotateY(Math.PI / 2), toon(P.onibusPneu)));
  const faixa = new THREE.Mesh(new THREE.RingGeometry(0.19, 0.27, 28).rotateY(lado * Math.PI / 2), toon(P.sorveteriaCreme, { doubleSide: true }));
  faixa.position.x = lado * 0.1; g.add(faixa);
  const calota = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.1, 20).rotateZ(Math.PI / 2), toon(P.sorveteriaCreme));
  calota.position.x = lado * 0.04; g.add(calota);
  const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 16).rotateZ(Math.PI / 2), toon(P.sorveteriaRosa));
  miolo.position.x = lado * 0.1; g.add(miolo);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const porca = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6).rotateZ(Math.PI / 2), toon(P.churrascoInox));
    porca.position.set(lado * 0.098, Math.cos(a) * 0.12, Math.sin(a) * 0.12); g.add(porca);
  }
  return g;
}

/**
 * A CASQUINHA GIGANTE DE TRÊS BOLAS do teto: o cone de waffle torneado, as
 * três bolas com a saia ondulada da colher (chocolate, morango e baunilha, de
 * baixo para cima), o GRANULADO na bola de cima (um lote, a cor por cópia) e a
 * cereja com o cabinho. Ponta do cone em `y = 0`.
 */
function casquinhaDeTresBolas(): THREE.Group {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(
    torno([[0.005, 0], [0.06, 0.12], [0.2, 0.62], [0.235, 0.66], [0.25, 0.7], [0.215, 0.71]], 16),
    toon(P.casquinhaWaffle, { mapa: waffle(1 / 7) }),
  );
  g.add(cone);
  const bolas: Array<[number, number, number]> = [[0.74, 0.27, P.chocolate], [1.0, 0.24, P.morango], [1.23, 0.21, P.sorveteriaBaunilha]];
  for (const [y, r, cor] of bolas) {
    const m = new THREE.Mesh(geoBolaDeSorvete(r), toon(cor)); m.position.y = y; g.add(m);
  }
  // o granulado na bola de cima: tracinhos deitados na casca, cada um de uma cor
  const N = 26;
  const lote = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.011, 0.04, 2, 5), toon(0xffffff), N);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), cor = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const ny = 0.25 + (i / N) * 0.7;
    const a = i * 2.39996;
    const r = Math.sqrt(1 - ny * ny);
    const n = new THREE.Vector3(Math.cos(a) * r, ny, Math.sin(a) * r);
    const p = n.clone().multiplyScalar(0.212).add(new THREE.Vector3(0, 1.23, 0));
    // deitado na casca (o eixo da cápsula perpendicular à normal), girado ao acaso em volta dela
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-n.z, 0, n.x).normalize().applyAxisAngle(n, i * 1.7));
    m4.compose(p, q, new THREE.Vector3(1, 1, 1));
    lote.setMatrixAt(i, m4);
    lote.setColorAt(i, cor.setHex(SABORES[i % SABORES.length]));
  }
  g.add(lote);
  const cereja = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 9), toon(P.cerejaDoMano));
  cereja.position.y = 1.47; g.add(cereja);
  const cabo = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 1.52, 0), new THREE.Vector3(0.02, 1.62, 0), new THREE.Vector3(0.08, 1.66, 0.01)), 6, 0.009, 5),
    toon(P.leafDark),
  );
  g.add(cabo);
  return g;
}

// ================================================================ a Kombi

export class KombiDoMano {
  readonly group = new THREE.Group();
  readonly mano = new Mano({ minX: -0.2, maxX: 0.2, minZ: -0.2, maxZ: 0.2 });
  private readonly rodas: THREE.Group[] = [];
  /** o toldo da janela de venda: fechado andando, de pé como toldo parado */
  private readonly toldo = new THREE.Group();
  private readonly franja = new THREE.Group();
  /** a bancada que desce embaixo da janela, e o que vai nela */
  private readonly bancada = new THREE.Group();
  private readonly naBancada = new THREE.Group();
  /** as duas casquinhas que ele entrega (somem da bancada quando entregues) */
  private readonly casquinhas = new THREE.Group();
  private readonly casquinhaGigante: THREE.Group;
  private abertura = 0;
  private giroDoMano = 0;
  private relogio = 0;

  constructor(estacionada = false) {
    this.group.userData.peca = 'kombi-do-mano';
    const lata = new THREE.Group();
    const por = (geo: THREE.BufferGeometry, cor: number, x = 0, y = 0, z = 0, pai: THREE.Object3D = lata): THREE.Mesh => {
      const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); pai.add(m); return m;
    };
    const tubo = (pts: number[][], raio: number, cor: number, pai: THREE.Object3D = lata): void => {
      const curva = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      pai.add(new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(8, pts.length * 8), raio, 8), toon(cor)));
    };
    const W = K.meiaLargura;

    // ------------------------------------------------------- a lataria em duas cores
    // (o chocolate e o granulado são a cor da textura: o material é branco, a textura pinta tudo)
    lata.add(new THREE.Mesh(lataria(perfilDeBaixo()), toon(P.placaPintada, { mapa: chocolateComGranuladoNaCor() })));
    por(lataria(perfilDeCima()), P.kombiCreme);
    // o friso de cromo na emenda das duas cores, dos dois lados e atrás
    for (const lado of [-1, 1]) por(quina(0.035, 0.05, K.frente - K.tras - 0.1, 0.016), P.churrascoInox, lado * (W + 0.012), K.cintura, 0);
    por(quina(2 * W - 0.1, 0.05, 0.035, 0.016), P.churrascoInox, 0, K.cintura, K.tras - 0.012);
    // as caixas de roda (meio cano escuro por dentro) e o chassi
    for (const z of [K.eixoDaFrente, K.eixoDeTras]) {
      const caixa = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 2 * W - 0.1, 18, 1, true, 0, Math.PI).rotateZ(Math.PI / 2), toon(P.onibusChassi, { doubleSide: true }));
      caixa.position.set(0, K.roda, z); lata.add(caixa);
    }
    por(quina(1.55, 0.18, 4.0, 0.05), P.onibusChassi, 0, 0.36, 0);

    // ------------------------------------------------------- a cara: o V, o emblema, os faróis e o para-choque
    const vee = new THREE.Mesh(geoDoV(), toon(P.kombiCreme));
    vee.position.set(0, 0, K.frente + 0.002); lata.add(vee);
    const medalha = new THREE.Mesh(new THREE.CircleGeometry(0.13, 28), toon(P.placaPintada, { mapa: emblemaDaKombi() }));
    medalha.position.set(0, 0.86, K.frente + 0.05); lata.add(medalha);
    por(new THREE.TorusGeometry(0.135, 0.022, 8, 28), P.churrascoInox, 0, 0.86, K.frente + 0.045);
    for (const lado of [-1, 1]) {
      const aro = por(new THREE.TorusGeometry(0.14, 0.03, 8, 24), P.churrascoInox, lado * 0.66, 0.9, K.frente + 0.012);
      aro.scale.z = 1.4;
      const lente = new THREE.Mesh(new THREE.CircleGeometry(0.125, 24), toon(P.luzDoPortao, { glow: 0.35 }));
      lente.position.set(lado * 0.66, 0.9, K.frente + 0.018); lata.add(lente);
      por(new THREE.CircleGeometry(0.035, 12), P.metalWhite, lado * 0.66 - 0.04, 0.95, K.frente + 0.024);
      // a lanterninha de pisca, laranja, em cima do farol
      por(new THREE.SphereGeometry(0.045, 10, 8), P.onibusPisca, lado * 0.66, 1.12, K.frente + 0.01).scale.z = 0.5;
      // as bochechas rosadas, embaixo dos faróis (a carinha da Kombi)
      por(new THREE.CircleGeometry(0.06, 16), P.sorveteriaRosa, lado * 0.45, 0.66, K.frente + 0.012);
    }
    const parachoque = por(new THREE.CapsuleGeometry(0.06, 1.98, 4, 10).rotateZ(Math.PI / 2), P.churrascoInox, 0, 0.5, K.frente + 0.08);
    parachoque.scale.z = 0.8;
    const chapa = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.17), toon(P.placaPintada, { mapa: placaDoMano() }));
    chapa.position.set(0, 0.5, K.frente + 0.135); lata.add(chapa);
    // os retrovisores redondos de haste, nas quinas da frente
    for (const lado of [-1, 1]) {
      tubo([[lado * (W + 0.02), 1.42, 2.05], [lado * (W + 0.1), 1.52, 2.1], [lado * (W + 0.14), 1.66, 2.1]], 0.016, P.churrascoInox);
      const espelho = por(new THREE.CylinderGeometry(0.075, 0.075, 0.035, 16).rotateX(Math.PI / 2), P.churrascoInox, lado * (W + 0.14), 1.72, 2.1);
      espelho.rotation.y = lado * 0.3;
    }

    // ------------------------------------------------------- o para-brisa dividido e a cabine
    const vidroZ = { baixo: K.frente - 0.03, alto: K.frente - 0.12 }, vidroY = { baixo: K.peitoril + 0.02, alto: K.forro };
    const inclina = Math.atan2(vidroZ.baixo - vidroZ.alto, vidroY.alto - vidroY.baixo);
    const comprido = Math.hypot(vidroZ.baixo - vidroZ.alto, vidroY.alto - vidroY.baixo);
    const vidro = new THREE.Mesh(new THREE.PlaneGeometry(2 * W - 0.14, comprido), toon(P.onibusParaBrisa, { opacity: 0.35, doubleSide: true }));
    vidro.position.set(0, (vidroY.baixo + vidroY.alto) / 2, (vidroZ.baixo + vidroZ.alto) / 2);
    vidro.rotation.x = -inclina; this.group.add(vidro);
    // as colunas da frente e o filete do meio (o para-brisa de duas folhas)
    for (const x of [-(W - 0.05), 0, W - 0.05]) {
      tubo([[x, vidroY.baixo, vidroZ.baixo], [x, vidroY.alto, vidroZ.alto]], x === 0 ? 0.022 : 0.045, x === 0 ? P.churrascoInox : P.kombiCreme);
    }
    // os limpadores deitados no pé do para-brisa
    for (const lado of [-1, 1]) {
      const limpador = por(quina(0.42, 0.015, 0.02, 0.006), P.onibusPainel, lado * 0.42, vidroY.baixo + 0.05, vidroZ.baixo + 0.015);
      limpador.rotation.z = lado * 0.25;
    }
    // o painel, o banco de couro rosa e o volante; no painel, a casquinha de enfeite
    por(quina(2 * W - 0.16, 0.16, 0.3, 0.05), P.onibusPainel, 0, K.peitoril + 0.08, 1.98);
    por(quina(2 * W - 0.2, 0.18, 0.5, 0.06), P.sorveteriaRosa, 0, K.peitoril - 0.02, 1.2);
    por(quina(2 * W - 0.2, 0.5, 0.12, 0.06), P.sorveteriaRosa, 0, K.peitoril + 0.24, 0.98);
    const enfeite = casquinhaDeTresBolas(); enfeite.scale.setScalar(0.12);
    enfeite.position.set(0.5, K.peitoril + 0.16, 2.0); lata.add(enfeite);
    const volante = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.024, 6, 18), toon(P.onibusPainel));
    volante.position.set(-0.42, 1.6, 1.72); volante.rotation.x = -1.0; this.group.add(volante);
    // as portas da cabine: o corte da porta e a maçaneta, dos dois lados
    for (const lado of [-1, 1]) {
      por(quina(0.03, 0.82, 0.03, 0.01), P.kombiChocolateEscuro, lado * (W + 0.004), 0.82, 0.92);
      por(quina(0.04, 0.05, 0.16, 0.02), P.churrascoInox, lado * (W + 0.02), 1.06, 1.2);
    }

    // ------------------------------------------------------- as janelas de trás (lado +X) e a de venda (lado −X)
    for (const [z0, z1] of [[-2.0, -1.22], [-1.08, -0.3], [-0.16, 0.66]] as const) {
      const z = (z0 + z1) / 2;
      por(quina(0.03, 0.56, z1 - z0, 0.05), P.kombiVidro, W + 0.012, 1.68, z);
      por(quina(0.034, 0.6, z1 - z0 + 0.06, 0.06), P.churrascoInox, W + 0.004, 1.68, z);
      // o brilho na vidraça
      const brilho = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.4), toon(P.metalWhite));
      brilho.position.set(W + 0.03, 1.7, z - (z1 - z0) * 0.25); brilho.rotation.set(0, Math.PI / 2, 0.4); lata.add(brilho);
    }
    // a JANELA DE VENDA (lado −X)
    const J = K.janela, x = -W;
    const meioY = (J.baixo + J.alto) / 2, altoJ = J.alto - J.baixo;
    const fundo = new THREE.Mesh(new THREE.PlaneGeometry(J.largura, altoJ), toon(P.placaPintada, { mapa: interiorDaKombi() }));
    fundo.position.set(x - 0.006, meioY, J.z); fundo.rotation.y = -Math.PI / 2; lata.add(fundo);
    por(quina(0.05, 0.06, J.largura + 0.14, 0.02), P.sorveteriaRosa, x - 0.02, J.alto + 0.03, J.z);
    por(quina(0.05, 0.06, J.largura + 0.14, 0.02), P.sorveteriaRosa, x - 0.02, J.baixo - 0.03, J.z);
    for (const s of [-1, 1]) por(quina(0.06, altoJ, 0.06, 0.02), P.sorveteriaRosa, x - 0.025, meioY, J.z + s * (J.largura / 2 + 0.03));
    // o toldo (com nome, ele gira): fechado é o painel pintado; aberto, a lona listrada por baixo
    this.toldo.name = 'toldo-do-mano';
    this.toldo.position.set(x - 0.075, J.alto + 0.06, J.z);
    const placaDoToldo = new THREE.Mesh(quina(0.03, altoJ + 0.1, J.largura + 0.16, 0.012), toon(P.kombiCreme));
    placaDoToldo.position.y = -(altoJ + 0.1) / 2; this.toldo.add(placaDoToldo);
    const pintado = new THREE.Mesh(new THREE.PlaneGeometry(J.largura, altoJ), toon(P.placaPintada, { mapa: painelDoMano() }));
    pintado.position.set(-0.017, -(altoJ + 0.1) / 2, 0); pintado.rotation.y = -Math.PI / 2; this.toldo.add(pintado);
    const listrado = new THREE.Mesh(new THREE.PlaneGeometry(J.largura + 0.1, altoJ + 0.05), toon(P.placaPintada, { mapa: lonaDoToldo() }));
    listrado.position.set(0.017, -(altoJ + 0.1) / 2, 0); listrado.rotation.y = Math.PI / 2; this.toldo.add(listrado);
    this.franja.name = 'franja-do-mano';
    this.franja.position.y = -(altoJ + 0.1);
    for (let i = 0; i < 9; i++) {
      const gomo = new THREE.Mesh(new THREE.CircleGeometry(0.108, 12, 0, Math.PI), toon(i % 2 ? P.sorveteriaCreme : P.sorveteriaRosa, { doubleSide: true }));
      gomo.position.set(-0.004, 0.005, -J.largura / 2 + 0.108 + i * 0.217);
      gomo.rotation.set(0, -Math.PI / 2, Math.PI);
      this.franja.add(gomo);
    }
    this.toldo.add(this.franja);
    this.group.add(fundir(this.toldo));
    // a bancada que desce
    this.bancada.name = 'bancada-do-mano';
    this.bancada.position.set(x - 0.06, J.baixo - 0.07, J.z);
    const tampo = new THREE.Mesh(quina(0.36, 0.05, J.largura, 0.018), toon(P.sorveteriaCreme));
    tampo.position.set(-0.18, 0.025, 0); this.bancada.add(tampo);
    for (const s of [-1, 1]) {
      const mao = new THREE.Mesh(quina(0.28, 0.035, 0.035, 0.01), toon(P.churrascoInox));
      mao.position.set(-0.15, -0.03, s * (J.largura / 2 - 0.15)); mao.rotation.z = -0.55; this.bancada.add(mao);
    }
    this.montarBancada();
    this.naBancada.name = 'na-bancada-do-mano';
    this.naBancada.position.set(-0.18, 0.05, 0);
    this.bancada.add(this.naBancada);
    this.group.add(fundir(this.bancada));
    // a GRADE DO FREEZER, embaixo do lado −X: as palhetas por onde sai o ar gelado (`pontoDoArGelado`)
    por(quina(0.04, 0.3, 0.5, 0.03), P.churrascoInox, -W - 0.015, 0.78, 1.02 - 0.42);
    for (let i = 0; i < 5; i++) por(quina(0.03, 0.025, 0.42, 0.01), P.kombiChocolateEscuro, -W - 0.035, 0.68 + i * 0.05, 0.6);
    // um floco de neve pintado em cima da grade (é ali que sai o frio)
    for (let k = 0; k < 3; k++) {
      const braco = por(quina(0.012, 0.16, 0.02, 0.005), P.metalWhite, -W - 0.02, 1.0, 0.6);
      braco.rotation.x = (k * Math.PI) / 3;
    }

    // ------------------------------------------------------- a traseira: a grade do motor, as lanternas e o vidro
    const tras = K.tras;
    for (let i = 0; i < 6; i++) por(quina(0.9, 0.025, 0.02, 0.01), P.kombiChocolateEscuro, 0, 0.82 + i * 0.05, tras - 0.004);
    for (const lado of [-1, 1]) {
      por(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 18).rotateX(Math.PI / 2), P.onibusLanterna, lado * 0.78, 1.0, tras - 0.01);
      por(new THREE.TorusGeometry(0.08, 0.018, 6, 18), P.churrascoInox, lado * 0.78, 1.0, tras - 0.025);
    }
    por(quina(1.2, 0.42, 0.03, 0.06), P.kombiVidro, 0, 1.75, tras - 0.004);
    por(quina(1.26, 0.48, 0.025, 0.07), P.churrascoInox, 0, 1.75, tras + 0.004);
    const parachoqueDeTras = por(new THREE.CapsuleGeometry(0.055, 1.96, 4, 10).rotateZ(Math.PI / 2), P.churrascoInox, 0, 0.5, tras - 0.07);
    parachoqueDeTras.scale.z = 0.8;
    // o adesivo de casquinha na tampa do motor
    const adesivo = new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), toon(P.placaPintada, { mapa: emblemaDaKombi() }));
    adesivo.position.set(-0.5, 1.32, tras - 0.008); adesivo.rotation.y = Math.PI; lata.add(adesivo);

    // ------------------------------------------------------- o teto: a neve escorrendo e a casquinha gigante
    this.neveNoTeto(lata);
    this.casquinhaGigante = casquinhaDeTresBolas();
    this.casquinhaGigante.name = 'casquinha-da-kombi';
    this.casquinhaGigante.scale.setScalar(1.25);
    this.casquinhaGigante.position.set(0, K.teto + 0.2, -0.6);
    // o suporte de cromo onde a ponta do cone encaixa
    por(new THREE.CylinderGeometry(0.16, 0.22, 0.22, 20), P.churrascoInox, 0, K.teto + 0.16, -0.6);
    por(new THREE.TorusGeometry(0.16, 0.025, 8, 24).rotateX(Math.PI / 2), P.sorveteriaRosa, 0, K.teto + 0.27, -0.6);
    this.group.add(fundir(this.casquinhaGigante));

    juntarPorCor(lata);
    this.group.add(fundir(lata));

    for (const z of [K.eixoDaFrente, K.eixoDeTras]) for (const lado of [-1, 1]) {
      const r = roda(lado); r.position.set(lado * K.bitola, K.roda, z);
      juntarPorCor(r);
      this.rodas.push(r); this.group.add(fundir(r));
    }

    if (!estacionada) {
      this.mano.entrarEmServico();
      this.mano.dirigindo = true;
      // ao volante, o chapéu de casquinha vira o quepe de papel de sorveteiro (o de casquinha
      // não cabe na cabine; ele vai de enfeite no painel)
      this.mano.mostrarChapeu(false);
      this.mano.apoioDoChapeu.add(quepeDeSorveteiro());
      this.mano.group.scale.setScalar(1.55);
      // em pé ao volante, do lado do Bebito, com a cabeça no meio do para-brisa: o painel e a porta escondem os pés
      this.mano.group.position.set(-0.42, 0.64, 1.32);
      this.group.add(this.mano.group);
      this.update(0, 0, false);
    } else {
      this.abertura = 0; this.posicionarJanela();
      fundirComoFundo(this.group);
    }
  }

  /**
   * A NEVE DO TETO: a tampa fofa (uma quina um tico maior que o teto, que
   * desce um palmo nas quinas redondas) e as GOTAS escorrendo pelas beiradas
   * dos dois lados, da frente e de trás — um lote de cápsulas, cada uma de um
   * comprimento, umas mais gordas. Sem elas a tampa lê como bagageiro.
   */
  private neveNoTeto(lata: THREE.Group): void {
    const W = K.meiaLargura;
    const tampa = new THREE.Mesh(quina(2 * W + 0.06, 0.14, K.frente - K.tras - 0.62, 0.07), toon(P.neveFofa));
    tampa.position.set(0, K.teto + 0.02, -0.02);
    lata.add(tampa);
    // as quinas redondas da frente e de trás também levam neve, mais fina
    for (const [z, giro] of [[K.frente - 0.36, -0.55], [K.tras + 0.34, 0.6]] as const) {
      const pedaco = new THREE.Mesh(quina(2 * W + 0.05, 0.1, 0.38, 0.05), toon(P.neveFofa));
      pedaco.position.set(0, K.teto - 0.1, z); pedaco.rotation.x = giro; lata.add(pedaco);
    }
    const pontos: Array<{ x: number; z: number; y: number; comprido: number; gordo: number; lado: 'x' | 'z'; s: number }> = [];
    let sorte = 5;
    const rnd = (): number => { sorte = (sorte * 16807) % 2147483647; return (sorte - 1) / 2147483646; };
    for (const lado of [-1, 1]) {
      for (let z = K.tras + 0.5; z <= K.frente - 0.55; z += 0.17 + rnd() * 0.1) {
        // (em cima da janela de venda, as gotas são curtas: o toldo abre ali)
        const naJanela = lado < 0 && Math.abs(z - K.janela.z) < K.janela.largura / 2 + 0.1;
        pontos.push({ x: lado * (W + 0.05), z, y: K.teto + 0.0, comprido: naJanela ? 0.03 + rnd() * 0.04 : 0.05 + rnd() * 0.2, gordo: 0.85 + rnd() * 0.5, lado: 'x', s: lado });
      }
    }
    for (const s of [-1, 1]) for (let x = -W + 0.15; x <= W - 0.15; x += 0.2 + rnd() * 0.08) {
      pontos.push({ x, z: s > 0 ? K.frente - 0.2 : K.tras + 0.18, y: s > 0 ? K.forro + 0.16 : K.teto - 0.24, comprido: 0.05 + rnd() * 0.12, gordo: 0.8 + rnd() * 0.4, lado: 'z', s });
    }
    const lote = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.035, 1, 4, 8), toon(P.neveFofa), pontos.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion();
    pontos.forEach((p, i) => {
      // a cápsula tem 1 m de miolo: a escala em `y` dá o comprimento, e o topo dela mora na beira da tampa
      const altura = p.comprido;
      m.compose(new THREE.Vector3(p.x, p.y - altura / 2, p.z), q, new THREE.Vector3(p.gordo, altura, p.gordo));
      lote.setMatrixAt(i, m);
    });
    lote.name = 'gotas-de-neve';
    this.group.add(lote);
  }

  /** o que vai na bancada aberta: as duas casquinhas para entregar, o pote de granulado, as colherinhas e o sininho */
  private montarBancada(): void {
    const b = this.naBancada;
    for (const [i, z, cor] of [[0, -0.42, P.morango], [1, 0.0, P.maracuja]] as const) {
      // a casquinha de uma bola num suportinho de arame
      const casquinha = new THREE.Group();
      const cone = new THREE.Mesh(torno([[0.003, 0], [0.04, 0.09], [0.055, 0.15], [0.05, 0.16]], 10), toon(P.casquinhaWaffle, { mapa: waffle(1 / 7) }));
      casquinha.add(cone);
      const bola = new THREE.Mesh(geoBolaDeSorvete(0.065), toon(cor)); bola.position.y = 0.165; casquinha.add(bola);
      const suporte = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.006, 4, 12).rotateX(Math.PI / 2), toon(P.churrascoInox));
      suporte.position.y = 0.09; casquinha.add(suporte);
      casquinha.position.set(0, 0.01, z); casquinha.rotation.y = i * 0.5;
      this.casquinhas.add(casquinha);
    }
    this.casquinhas.name = 'casquinhas-para-entregar';
    b.add(this.casquinhas);
    const pote = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 14), toon(P.sorveteriaCreme));
    pote.position.set(0.02, 0.05, 0.42); b.add(pote);
    const granuladoNoPote = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 14), toon(P.sorveteriaRosa));
    granuladoNoPote.position.set(0.02, 0.1, 0.42); b.add(granuladoNoPote);
    for (const dz of [-0.03, 0.03]) {
      const colher = new THREE.Mesh(quina(0.012, 0.12, 0.02, 0.005), toon(P.sorveteriaMenta));
      colher.position.set(0.02, 0.14, 0.42 + dz); colher.rotation.x = dz * 6; b.add(colher);
    }
    const sino = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.gold, { doubleSide: true }));
    sino.position.set(0.04, 0.0, 0.78); b.add(sino);
    const botao = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toon(P.churrascoInox));
    botao.position.set(0.04, 0.05, 0.78); b.add(botao);
    juntarPorCor(b);
    fundir(b);
  }

  private posicionarJanela(): void {
    const k = this.abertura;
    this.toldo.rotation.z = -1.62 * k;
    this.franja.rotation.z = 1.62 * k;
    this.bancada.rotation.z = (Math.PI / 2) * (1 - k);
    this.naBancada.visible = k > 0.85;
  }

  /** ele entrega as duas casquinhas: elas saem da bancada (e a cena as põe na mochila) */
  entregarCasquinhas(): void {
    this.casquinhas.visible = false;
  }

  /** a boca da grade do freezer, no mundo: de onde sai o ar gelado */
  pontoDoArGelado(): THREE.Vector3 {
    this.group.updateMatrixWorld(true);
    return this.group.localToWorld(new THREE.Vector3(-K.meiaLargura - 0.08, 0.8, 0.6));
  }

  update(dt: number, distancia: number, conversando: boolean): void {
    this.relogio += dt;
    for (const r of this.rodas) r.rotation.x += distancia / K.roda;
    this.mano.update(dt);
    const suave = 1 - Math.exp(-5 * dt);
    // na conversa ele vira para o lado do Bebito (o `−X`)
    this.giroDoMano += ((conversando ? -Math.PI / 2 : 0) - this.giroDoMano) * suave;
    this.mano.group.rotation.y = this.giroDoMano;
    this.abertura += ((conversando ? 1 : 0) - this.abertura) * (dt > 0 ? 1 - Math.exp(-3 * dt) : 0);
    this.posicionarJanela();
    // a casquinha gigante gira devagarinho no suporte (é o que chama o olho de longe)
    this.casquinhaGigante.rotation.y += dt * 0.6;
  }
}

/**
 * O QUEPE DE PAPEL DE SORVETEIRO: o barquinho de papel branco (meio cilindro
 * deitado e achatado), a faixa rosa correndo pela crista, a aba dobrada em
 * volta e o emblema da casquinha do lado. Baixinho, para caber na cabine.
 */
function quepeDeSorveteiro(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'quepe-do-mano';
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.25, 18, 1, false, -Math.PI / 2, Math.PI).rotateX(-Math.PI / 2), toon(P.sorveteriaCreme, { doubleSide: true }));
  corpo.scale.set(0.95, 0.62, 1); corpo.position.y = 0.11; g.add(corpo);
  const aba = new THREE.Mesh(new THREE.TorusGeometry(1, 0.018, 4, 30).rotateX(Math.PI / 2), toon(P.sorveteriaCreme));
  aba.scale.set(0.125, 1, 0.13); aba.position.y = 0.112; g.add(aba);
  const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.133, 0.133, 0.03, 18, 1, true, -Math.PI / 2, Math.PI).rotateX(-Math.PI / 2), toon(P.sorveteriaRosa, { doubleSide: true }));
  faixa.scale.set(0.96, 0.63, 1); faixa.position.set(0, 0.11, 0); g.add(faixa);
  for (const lado of [-1, 1]) {
    const medalha = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), toon(P.placaPintada, { mapa: emblemaDaKombi() }));
    medalha.position.set(lado * 0.124, 0.14, 0.03); medalha.rotation.y = lado * Math.PI / 2; g.add(medalha);
  }
  return fundir(g);
}

/** o chocolate com o granulado, já na cor (o material leva branco, a textura pinta o chocolate e os tracinhos) */
let granuladoNaCor: THREE.CanvasTexture | null = null;
function chocolateComGranuladoNaCor(): THREE.CanvasTexture {
  if (granuladoNaCor) return granuladoNaCor;
  granuladoNaCor = canvasComLetra(256, 256, (c) => {
    c.fillStyle = css(P.kombiChocolate); c.fillRect(0, 0, 256, 256);
    let sorte = 11;
    const rnd = (): number => { sorte = (sorte * 16807) % 2147483647; return (sorte - 1) / 2147483646; };
    c.lineCap = 'round';
    for (let i = 0; i < 70; i++) {
      const x = rnd() * 256, y = rnd() * 256, a = rnd() * Math.PI, l = 7 + rnd() * 5;
      c.strokeStyle = css(SABORES[i % SABORES.length]);
      c.lineWidth = 4.5;
      c.beginPath(); c.moveTo(x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2); c.lineTo(x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2); c.stroke();
    }
  });
  granuladoNaCor.wrapS = granuladoNaCor.wrapT = THREE.RepeatWrapping;
  granuladoNaCor.repeat.set(1 / 0.7, 1 / 0.7);
  return granuladoNaCor;
}
