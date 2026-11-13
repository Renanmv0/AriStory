import * as THREE from 'three';
import { Walter } from '../entities/bichos/Walter';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo } from './fundir';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import {
  FONTE_FORMA, FONTE_REDONDA, cachorroQuentePronto, desenharCachorroQuente, desenharPata,
  geoMeioPao, geoOssinho, geoSalsicha, lonaListrada, painelDoWalter, zigueZague,
} from './halloween/barracaDoWalter';

/*
 * O FOOD TRUCK DO WALTER (pedido do Renan: "detalhado, bonito e grande, todo
 * estilizado e fofo"), o cachorro-quente sobre rodas do garçom do Mania. Ele
 * cruza com o Bebito Mobile na estrada do clube e, depois do primeiro
 * encontro, fica estacionado numa vaga do clube (como a moto do Capy).
 *
 * O MOLDE é a van de entrega antiga, de nariz redondo e caixa alta (a
 * silhueta mais fofa de food truck), na identidade da barraquinha do Walter:
 * embaixo vermelho, em cima creme, o friso mostarda na cintura e as costelas
 * de lata na saia. A lataria é o PERFIL DE LADO extrudado com bisel (o molde
 * do ônibus da cidade): em duas peças (a vermelha e a creme), e o vinco entre
 * elas é a própria emenda dos biséis. A cabine é um RECORTE no perfil, da
 * coluna de trás até o para-brisa: as janelas dos lados ficam abertas (o
 * Walter dirige com o focinho perto da janela) e o para-brisa é um vidro
 * entre as colunas da frente.
 *
 * A JANELA DE VENDA fica no lado `−X` — o lado que dá para o Bebito quando ele
 * para do lado e o que a câmera do encontro vê. Andando, o TOLDO está
 * fechado, com o painel pintado ("Cachorro-quente do Walter") virado para a
 * rua; parado para conversar, ele sobe como toldo listrado e a BANCADA desce
 * com os cachorros-quentes prontos, as bisnagas e o sininho. Lá dentro (o
 * interior PINTADO, como o guichê da bilheteria da roda): o azulejo, a chapa
 * com as salsichas, os pães na prateleira e a lousa do cardápio.
 *
 * Em cima, o CACHORRO-QUENTE GIGANTE com carinha (a salsicha sorri de bochecha
 * rosada) e as luzinhas na beira do teto. Na frente, os faróis redondos e a
 * grade de cromo fazem uma carinha também, com o ossinho de capô e a placa
 * "WALTER".
 *
 * O contrato dos carros dos encontros: base em `y = 0`, a frente para `+Z`, as
 * rodas giram pela distância (`update`), e `estacionado` monta a versão vazia
 * e fundida como fundo, para a vaga do clube.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** as medidas do caminhãozinho (o bisel engorda 5 cm o contorno do perfil) */
export const FOOD_TRUCK = {
  meiaLargura: 1.12, frente: 2.75, tras: -2.75, cintura: 1.25, peitoril: 1.47, forro: 2.3, teto: 2.8,
  roda: 0.43, eixoDaFrente: 1.78, eixoDeTras: -1.78, bitola: 0.95,
  /** a janela de venda (lado −X): o meio dela em `z`, a largura e o vão em `y` */
  janela: { z: -0.8, largura: 2.1, baixo: 1.5, alto: 2.33 },
} as const;
const F = FOOD_TRUCK;
const BISEL = 0.05;

// ================================================================ as pinturas

/** o interior pintado da janela: azulejo, chapa, pães, lousa e a lâmpada */
let interior: THREE.CanvasTexture | null = null;
function interiorDoTruck(): THREE.CanvasTexture {
  if (interior) return interior;
  const L = 1024, A = 404;
  interior = canvasComLetra(L, A, (c) => {
    // o azulejo creme com o rejunte
    c.fillStyle = css(P.barracaCreme);
    c.fillRect(0, 0, L, A);
    c.strokeStyle = 'rgba(160,110,70,0.25)';
    c.lineWidth = 2;
    for (let x = 0; x <= L; x += 46) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, A); c.stroke(); }
    for (let y = 0; y <= A; y += 46) { c.beginPath(); c.moveTo(0, y); c.lineTo(L, y); c.stroke(); }
    // a sombra do alto (o toldo e o teto) e o fundo mais escuro embaixo
    const sombra = c.createLinearGradient(0, 0, 0, A);
    sombra.addColorStop(0, 'rgba(60,25,20,0.35)');
    sombra.addColorStop(0.35, 'rgba(60,25,20,0.05)');
    sombra.addColorStop(1, 'rgba(60,25,20,0.2)');
    c.fillStyle = sombra;
    c.fillRect(0, 0, L, A);
    // a lousa do cardápio, à esquerda
    c.fillStyle = css(P.wood);
    c.fillRect(40, 70, 300, 210);
    c.fillStyle = css(P.placaDeLousa);
    c.fillRect(52, 82, 276, 186);
    c.fillStyle = css(P.giz);
    c.textAlign = 'center';
    c.font = `700 40px ${FONTE_FORMA}`;
    c.fillText('CARDÁPIO', 190, 124);
    c.textAlign = 'left';
    c.font = `700 32px ${FONTE_REDONDA}`;
    ['Simples', 'Completo', 'Duplo do Walter'].forEach((t, i) => {
      c.beginPath(); c.arc(78, 160 + i * 38, 5, 0, Math.PI * 2); c.fill();
      c.fillText(t, 92, 171 + i * 38);
    });
    desenharPata(c, 300, 108, 12, css(P.giz));
    // a prateleira com os pães, no alto do meio
    c.fillStyle = css(P.wood);
    c.fillRect(380, 118, 300, 14);
    c.fillStyle = css(P.paoDeCachorro);
    for (let i = 0; i < 6; i++) {
      c.beginPath(); c.ellipse(410 + i * 48, 100, 22, 16, 0, 0, Math.PI * 2); c.fill();
      c.strokeStyle = 'rgba(120,60,20,0.45)'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(396 + i * 48, 98); c.lineTo(424 + i * 48, 98); c.stroke();
    }
    // a chapa de inox com as salsichas, e o vapor
    c.fillStyle = css(P.churrascoInoxEscuro);
    c.fillRect(380, 300, 330, 70);
    c.fillStyle = css(P.churrascoInox);
    c.fillRect(380, 290, 330, 18);
    for (let i = 0; i < 6; i++) {
      c.fillStyle = css(i % 2 ? P.salsichaTostada : P.salsicha);
      c.beginPath(); c.ellipse(420 + i * 50, 286, 22, 9, 0, 0, Math.PI * 2); c.fill();
    }
    c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
      const x = 430 + i * 80;
      c.beginPath(); c.moveTo(x, 268);
      c.bezierCurveTo(x - 18, 240, x + 18, 220, x, 190); c.stroke();
    }
    // a lâmpada pendurada e o halo
    c.strokeStyle = css(P.onibusPainel); c.lineWidth = 3;
    c.beginPath(); c.moveTo(560, 0); c.lineTo(560, 40); c.stroke();
    const halo = c.createRadialGradient(560, 55, 4, 560, 55, 90);
    halo.addColorStop(0, 'rgba(255,240,190,0.9)'); halo.addColorStop(1, 'rgba(255,240,190,0)');
    c.fillStyle = halo; c.fillRect(470, 0, 180, 150);
    c.fillStyle = css(P.luzDoPortao);
    c.beginPath(); c.arc(560, 52, 14, 0, Math.PI * 2); c.fill();
    // o cartaz do cachorro-quente, à direita, e as patinhas
    c.fillStyle = css(P.barracaVermelho);
    c.fillRect(760, 70, 220, 200);
    c.fillStyle = css(P.barracaCreme);
    c.fillRect(772, 82, 196, 176);
    desenharCachorroQuente(c, 870, 190, 150, css(P.barracaVermelhoFundo), true);
    c.fillStyle = css(P.barracaVermelho);
    c.textAlign = 'center';
    c.font = `700 36px ${FONTE_FORMA}`;
    c.fillText('Quentinho!', 870, 130);
    for (const [x, y] of [[760, 330], [840, 350], [920, 330]] as const) desenharPata(c, x, y, 14, 'rgba(210,58,63,0.35)');
  });
  return interior;
}

/** a placa da frente, com o nome dele */
let placa: THREE.CanvasTexture | null = null;
function placaDoWalter(): THREE.CanvasTexture {
  if (placa) return placa;
  placa = canvasComLetra(256, 96, (c) => {
    c.fillStyle = css(P.barracaCreme); c.fillRect(0, 0, 256, 96);
    c.strokeStyle = css(P.barracaVermelhoFundo); c.lineWidth = 6; c.strokeRect(6, 6, 244, 84);
    c.fillStyle = css(P.barracaVermelhoFundo);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 50px ${FONTE_FORMA}`;
    c.fillText('WALTER', 128, 52);
  });
  return placa;
}

/** o painel pintado dos lados (o mesmo da barraquinha), um só para o jogo */
let painel: THREE.CanvasTexture | null = null;
const painelPintado = (): THREE.CanvasTexture => (painel ??= painelDoWalter());

// ================================================================ a lataria

/** um meio arco de roda no contorno de baixo do perfil (`z` do eixo) */
function arcoDeRoda(forma: THREE.Shape, z: number, chao: number): void {
  const r = 0.62, cy = F.roda;
  const a = Math.asin((chao - cy) / r);
  forma.lineTo(z - r * Math.cos(a), chao);
  forma.absarc(z, cy, r, Math.PI - a, a, true);
}

/** o perfil (`u` = z, `v` = y) extrudado na largura do caminhão, com bisel */
function lataria(forma: THREE.Shape): THREE.ExtrudeGeometry {
  const meia = F.meiaLargura - BISEL;
  const geo = new THREE.ExtrudeGeometry(forma, {
    depth: 2 * meia, bevelEnabled: true, bevelThickness: BISEL, bevelSize: BISEL, bevelSegments: 3, curveSegments: 14,
  });
  geo.translate(0, 0, -meia);
  geo.rotateY(-Math.PI / 2);
  return geo;
}

/** a saia vermelha: do chão até a cintura, com as caixas de roda */
function perfilDeBaixo(): THREE.Shape {
  const s = new THREE.Shape();
  const chao = 0.5, c = F.cintura - BISEL, fr = F.frente - BISEL, tr = F.tras + BISEL;
  s.moveTo(tr + 0.12, chao);
  arcoDeRoda(s, F.eixoDeTras, chao);
  arcoDeRoda(s, F.eixoDaFrente, chao);
  s.lineTo(fr - 0.18, chao);
  s.quadraticCurveTo(fr, chao, fr, chao + 0.18);
  s.lineTo(fr, c);
  s.lineTo(tr, c);
  s.lineTo(tr, chao + 0.12);
  s.quadraticCurveTo(tr, chao, tr + 0.12, chao);
  return s;
}

/** a caixa creme: o capô redondo, o recorte da cabine, a pala do teto e o teto */
function perfilDeCima(): THREE.Shape {
  const s = new THREE.Shape();
  const c = F.cintura + BISEL, fr = F.frente - BISEL, tr = F.tras + BISEL;
  const peitoril = F.peitoril - BISEL, forro = F.forro + BISEL, teto = F.teto - BISEL;
  s.moveTo(tr, c);
  s.lineTo(fr, c);
  s.quadraticCurveTo(fr, peitoril, fr - 0.42, peitoril);   // o capô
  s.lineTo(1.12 + BISEL, peitoril);                          // o peitoril até a coluna de trás
  s.lineTo(1.12 + BISEL, forro);                             // a coluna de trás da cabine
  s.lineTo(1.86, forro);                                     // o forro do teto avançando
  s.quadraticCurveTo(2.06, forro + 0.02, 2.0, forro + 0.2);  // a pala por cima do para-brisa
  s.quadraticCurveTo(1.92, teto, 1.6, teto);
  s.lineTo(tr + 0.35, teto);
  s.quadraticCurveTo(tr, teto, tr, teto - 0.35);
  s.closePath();
  return s;
}

/** a roda: pneu gordo, a faixa branca e a calota creme de miolo vermelho */
function roda(lado: number): THREE.Group {
  const g = new THREE.Group();
  const pneu = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.13, 10, 28).rotateY(Math.PI / 2), toon(P.onibusPneu));
  g.add(pneu);
  const faixa = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.31, 28).rotateY(lado * Math.PI / 2), toon(P.barracaCreme, { doubleSide: true }));
  faixa.position.x = lado * 0.118; g.add(faixa);
  const calota = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 20).rotateZ(Math.PI / 2), toon(P.barracaCreme));
  calota.position.x = lado * 0.05; g.add(calota);
  const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.06, 16).rotateZ(Math.PI / 2), toon(P.barracaVermelho));
  miolo.position.x = lado * 0.12; g.add(miolo);
  // as porquinhas: o giro aparece nelas
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const porca = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 6).rotateZ(Math.PI / 2), toon(P.churrascoInox));
    porca.position.set(lado * 0.115, Math.cos(a) * 0.14, Math.sin(a) * 0.14); g.add(porca);
  }
  return g;
}

// ================================================================ o gigante

/** o cachorro-quente gigante do teto, com carinha; o comprimento em `z` */
function cachorroQuenteGigante(): THREE.Group {
  const g = new THREE.Group();
  const pao = toon(P.paoDeCachorro);
  const parte = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m;
  };
  for (const s of [-1, 1]) parte(geoMeioPao(2.5, 0.34), pao, 0, 0.3, s * 0.21);
  parte(geoSalsicha(2.9, 0.22), toon(P.salsicha), 0, 0.5, 0);
  // as listrinhas tostadas da chapa
  for (let i = -3; i <= 3; i++) {
    const marca = parte(new THREE.TorusGeometry(0.222, 0.012, 4, 14, Math.PI * 0.7), toon(P.salsichaTostada), i * 0.3, 0.5, 0);
    marca.rotation.set(0, Math.PI / 2, Math.PI * 0.15);
  }
  parte(zigueZague(-1.0, 0.9, 0.72, 0, 0.09, 6, 0.035), toon(P.molhoMostarda));
  parte(zigueZague(-0.9, 1.0, 0.725, 0.03, 0.07, 5, 0.03), toon(P.molhoKetchup));
  // a carinha na ponta da salsicha (a ponta da frente é o `+x` aqui), colada na
  // casca da meia esfera da ponta: cada peça vai no ponto da casca e deita na normal
  const centro = new THREE.Vector3(1.45 - 0.22, 0.5, 0);
  const naPonta = (m: THREE.Mesh, dx: number, dy: number, dz: number, fora = 0.004): void => {
    const n = new THREE.Vector3(dx, dy, dz).normalize();
    m.position.copy(centro).addScaledVector(n, 0.22 + fora);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  };
  for (const s of [-1, 1]) {
    const olho = parte(new THREE.SphereGeometry(0.034, 10, 8), toon(P.onibusPainel));
    naPonta(olho, 0.82, 0.38, s * 0.42, -0.01); olho.scale.set(0.95, 1.25, 0.6);
    const brilho = parte(new THREE.CircleGeometry(0.011, 8), toon(P.metalWhite));
    naPonta(brilho, 0.8, 0.44, s * 0.4 - 0.05, 0.012);
    const bochecha = parte(new THREE.CircleGeometry(0.036, 14), toon(P.bochechaDeBoneco));
    naPonta(bochecha, 0.72, 0.02, s * 0.68, 0.003);
  }
  const sorriso = parte(new THREE.TorusGeometry(0.04, 0.009, 4, 12, Math.PI), toon(P.onibusPainel));
  naPonta(sorriso, 0.96, 0.12, 0, 0.0);
  sorriso.rotateZ(Math.PI);
  g.rotation.y = -Math.PI / 2; // o comprimento passa de `x` para `z`, a cara para a frente
  return g;
}

// ================================================================ o caminhão

export class FoodTruckDoWalter {
  readonly group = new THREE.Group();
  readonly walter = new Walter({ minX: -1, maxX: 1, minZ: -1, maxZ: 1 });
  private readonly rodas: THREE.Group[] = [];
  /** o toldo da janela de venda: fechado andando, de pé como toldo parado */
  private readonly toldo = new THREE.Group();
  /** a bancada que desce embaixo da janela, e o que vai nela */
  private readonly bancada = new THREE.Group();
  private readonly naBancada = new THREE.Group();
  private readonly franja = new THREE.Group();
  private abertura = 0;
  private giroDoWalter = 0;

  constructor(estacionado = false) {
    this.group.userData.peca = 'food-truck-do-walter';
    const lata = new THREE.Group();
    const por = (geo: THREE.BufferGeometry, cor: number, x = 0, y = 0, z = 0, pai: THREE.Object3D = lata): THREE.Mesh => {
      const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); pai.add(m); return m;
    };
    const tubo = (pts: number[][], raio: number, cor: number, pai: THREE.Object3D = lata): void => {
      const curva = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      pai.add(new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(8, pts.length * 8), raio, 8), toon(cor)));
    };
    const W = F.meiaLargura;

    // ----------------------------------------------------- a lataria em duas cores
    por(lataria(perfilDeBaixo()), P.barracaVermelho);
    por(lataria(perfilDeCima()), P.barracaCreme);
    // a caixa de roda por dentro é escura (sem ela, via-se o vermelho pela boca)
    for (const z of [F.eixoDaFrente, F.eixoDeTras]) {
      const caixa = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2 * W - 0.1, 18, 1, true, 0, Math.PI).rotateZ(Math.PI / 2), toon(P.onibusChassi, { doubleSide: true }));
      caixa.position.set(0, F.roda, z); lata.add(caixa);
    }
    por(quina(1.7, 0.22, 4.9, 0.05), P.onibusChassi, 0, 0.38, 0);
    // o friso mostarda na cintura (por cima do vinco) e as costelas de lata na saia
    for (const lado of [-1, 1]) {
      por(quina(0.035, 0.07, F.frente - F.tras + 0.02, 0.016), P.barracaMostarda, lado * (W + 0.012), F.cintura, 0);
      for (const y of [0.74, 0.9, 1.06]) {
        const costela = por(new THREE.CapsuleGeometry(0.022, 2.02, 3, 6).rotateX(Math.PI / 2), P.barracaVermelho, lado * (W + 0.006), y, 0);
        costela.scale.x = 0.8;
      }
    }

    // ----------------------------------------------------- a cara: faróis, grade, para-choque
    const frente = F.frente;
    for (const lado of [-1, 1]) {
      const aro = por(new THREE.TorusGeometry(0.17, 0.035, 8, 24), P.churrascoInox, lado * 0.72, 0.98, frente + 0.01);
      aro.scale.z = 1.4;
      const lente = new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), toon(P.luzDoPortao, { glow: 0.35 }));
      lente.position.set(lado * 0.72, 0.98, frente + 0.015); lata.add(lente);
      // o brilhinho de cada farol, que dá o olhar
      por(new THREE.CircleGeometry(0.04, 12), P.metalWhite, lado * 0.72 - 0.05, 1.04, frente + 0.02);
      // o pisca embaixo de cada farol
      por(quina(0.12, 0.06, 0.04, 0.02), P.onibusPisca, lado * 0.72, 0.72, frente + 0.01);
    }
    for (let i = -2; i <= 2; i++) por(quina(0.045, 0.32, 0.04, 0.02), P.churrascoInox, i * 0.1, 0.88, frente + 0.01);
    por(quina(0.55, 0.05, 0.05, 0.02), P.churrascoInox, 0, 1.06, frente + 0.01);
    por(quina(0.55, 0.05, 0.05, 0.02), P.churrascoInox, 0, 0.7, frente + 0.01);
    const parachoque = por(new THREE.CapsuleGeometry(0.07, 2.08, 4, 10).rotateZ(Math.PI / 2), P.churrascoInox, 0, 0.55, frente + 0.08);
    parachoque.scale.z = 0.8;
    const chapa = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.19), toon(P.metalWhite, { mapa: placaDoWalter() }));
    chapa.position.set(0, 0.55, frente + 0.145); lata.add(chapa);
    // o ossinho no capô
    for (const peca of geoOssinho()) {
      const o = new THREE.Mesh(peca.scale(4, 4, 4), toon(P.barracaMostarda));
      o.position.set(0, F.peitoril + 0.04, frente - 0.22); lata.add(o);
    }
    // os retrovisores redondos
    for (const lado of [-1, 1]) {
      tubo([[lado * (W + 0.02), 1.62, 2.2], [lado * (W + 0.1), 1.72, 2.25], [lado * (W + 0.14), 1.86, 2.25]], 0.018, P.churrascoInox);
      const espelho = por(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16).rotateX(Math.PI / 2), P.churrascoInox, lado * (W + 0.14), 1.92, 2.25);
      espelho.rotation.y = lado * 0.3;
    }

    // ----------------------------------------------------- a cabine
    const vidroZ = { baixo: 2.27, alto: 1.95 }, vidroY = { baixo: F.peitoril + 0.02, alto: F.forro };
    for (const lado of [-1, 1]) {
      tubo([[lado * (W - 0.06), vidroY.baixo, vidroZ.baixo], [lado * (W - 0.06), vidroY.alto, vidroZ.alto]], 0.05, P.barracaCreme);
    }
    const inclina = Math.atan2(vidroZ.baixo - vidroZ.alto, vidroY.alto - vidroY.baixo);
    const comprido = Math.hypot(vidroZ.baixo - vidroZ.alto, vidroY.alto - vidroY.baixo);
    const vidro = new THREE.Mesh(new THREE.PlaneGeometry(2 * W - 0.16, comprido), toon(P.onibusParaBrisa, { opacity: 0.35, doubleSide: true }));
    vidro.position.set(0, (vidroY.baixo + vidroY.alto) / 2, (vidroZ.baixo + vidroZ.alto) / 2);
    vidro.rotation.x = -inclina; this.group.add(vidro);
    por(quina(2 * W - 0.2, 0.16, 0.34, 0.05), P.onibusPainel, 0, F.peitoril + 0.08, 2.02);
    por(quina(2 * W - 0.2, 0.2, 0.55, 0.06), P.barracaVermelho, 0, F.peitoril + 0.1, 1.48);
    por(quina(2 * W - 0.2, 0.56, 0.14, 0.06), P.barracaVermelho, 0, F.peitoril + 0.36, 1.24);
    for (const lado of [-1, 1]) {
      por(quina(0.03, 0.82, 0.03, 0.01), P.barracaVermelhoFundo, lado * (W + 0.004), 1.0, 1.1);
      por(quina(0.04, 0.05, 0.16, 0.02), P.churrascoInox, lado * (W + 0.02), 1.38, 1.3);
    }
    const volante = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 6, 18), toon(P.onibusPainel));
    volante.position.set(-0.55, 1.8, 1.9); volante.rotation.x = -0.95; this.group.add(volante);

    // ----------------------------------------------------- a janela de venda (lado −X)
    const J = F.janela, x = -W;
    const meioY = (J.baixo + J.alto) / 2, altoJ = J.alto - J.baixo;
    const fundo = new THREE.Mesh(new THREE.PlaneGeometry(J.largura, altoJ), toon(P.metalWhite, { mapa: interiorDoTruck() }));
    fundo.position.set(x - 0.006, meioY, J.z); fundo.rotation.y = -Math.PI / 2; lata.add(fundo);
    // a moldura mostarda, as réguas em pé entre as deitadas (nenhuma face no plano da outra)
    por(quina(0.05, 0.07, J.largura + 0.14, 0.02), P.barracaMostarda, x - 0.02, J.alto + 0.035, J.z);
    por(quina(0.05, 0.07, J.largura + 0.14, 0.02), P.barracaMostarda, x - 0.02, J.baixo - 0.035, J.z);
    for (const s of [-1, 1]) por(quina(0.06, altoJ, 0.07, 0.02), P.barracaMostarda, x - 0.025, meioY, J.z + s * (J.largura / 2 + 0.035));
    // o toldo, com a dobradiça no alto da janela: o painel por fora e a lona por baixo
    this.toldo.name = 'toldo-do-walter';
    this.toldo.position.set(x - 0.075, J.alto + 0.06, J.z);
    const placaDoToldo = new THREE.Mesh(quina(0.03, altoJ + 0.1, J.largura + 0.16, 0.012), toon(P.barracaCreme));
    placaDoToldo.position.y = -(altoJ + 0.1) / 2; this.toldo.add(placaDoToldo);
    const pintado = new THREE.Mesh(new THREE.PlaneGeometry(J.largura, altoJ), toon(P.metalWhite, { mapa: painelPintado() }));
    pintado.position.set(-0.017, -(altoJ + 0.1) / 2, 0); pintado.rotation.y = -Math.PI / 2; this.toldo.add(pintado);
    const listrado = new THREE.Mesh(new THREE.PlaneGeometry(J.largura + 0.1, altoJ + 0.05), toon(P.metalWhite, { mapa: lonaListrada() }));
    listrado.position.set(0.017, -(altoJ + 0.1) / 2, 0); listrado.rotation.y = Math.PI / 2; this.toldo.add(listrado);
    // a franjinha de meias-luas na beira do toldo: um grupo com nome que gira ao
    // contrário do toldo, para ela pender sempre de pé (aberto, ela cai na frente da janela)
    this.franja.name = 'franja-do-walter';
    this.franja.position.y = -(altoJ + 0.1);
    for (let i = 0; i < 10; i++) {
      const gomo = new THREE.Mesh(new THREE.CircleGeometry(0.105, 12, 0, Math.PI), toon(i % 2 ? P.barracaCreme : P.barracaVermelho, { doubleSide: true }));
      gomo.position.set(-0.004, 0.005, -J.largura / 2 + 0.105 + i * 0.21);
      gomo.rotation.set(0, -Math.PI / 2, Math.PI);
      this.franja.add(gomo);
    }
    this.toldo.add(this.franja);
    this.group.add(this.toldo);
    // a bancada: dobra para baixo andando e abre na horizontal parada
    this.bancada.name = 'bancada-do-walter';
    this.bancada.position.set(x - 0.06, J.baixo - 0.07, J.z);
    const tampo = new THREE.Mesh(quina(0.4, 0.05, J.largura, 0.018), toon(P.wood));
    tampo.position.set(-0.2, 0.025, 0); this.bancada.add(tampo);
    for (const s of [-1, 1]) {
      const mao = new THREE.Mesh(quina(0.3, 0.035, 0.035, 0.01), toon(P.churrascoInox));
      mao.position.set(-0.17, -0.03, s * (J.largura / 2 - 0.15)); mao.rotation.z = -0.55; this.bancada.add(mao);
    }
    this.montarBancada();
    this.naBancada.position.set(-0.2, 0.05, 0);
    this.bancada.add(this.naBancada);
    this.group.add(this.bancada);
    // no lado +X, o painel pintado fixo
    const doOutroLado = new THREE.Mesh(new THREE.PlaneGeometry(J.largura, altoJ), toon(P.metalWhite, { mapa: painelPintado() }));
    doOutroLado.position.set(W + 0.006, meioY, J.z); doOutroLado.rotation.y = Math.PI / 2; lata.add(doOutroLado);
    for (const y of [J.alto + 0.035, J.baixo - 0.035]) por(quina(0.05, 0.07, J.largura + 0.14, 0.02), P.barracaMostarda, W + 0.02, y, J.z);

    // ----------------------------------------------------- a traseira
    const tras = F.tras;
    for (const lado of [-1, 1]) {
      const lanterna = por(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 18).rotateX(Math.PI / 2), P.onibusLanterna, lado * 0.82, 1.0, tras - 0.01);
      lanterna.scale.set(1, 1, 1);
      por(new THREE.TorusGeometry(0.11, 0.022, 6, 18), P.churrascoInox, lado * 0.82, 1.0, tras - 0.03);
      por(quina(0.03, 1.15, 0.035, 0.01), P.barracaVermelhoFundo, lado * 0.02, 1.85, tras - 0.005);
      por(quina(0.05, 0.16, 0.05, 0.02), P.churrascoInox, lado * 0.12, 1.75, tras - 0.025);
    }
    const parachoqueDeTras = por(new THREE.CapsuleGeometry(0.06, 2.06, 4, 10).rotateZ(Math.PI / 2), P.churrascoInox, 0, 0.55, tras - 0.07);
    parachoqueDeTras.scale.z = 0.8;
    // a escadinha até o teto, do lado +X
    for (const dx of [0.62, 0.92]) tubo([[dx, 1.05, tras - 0.07], [dx, 2.82, tras - 0.07]], 0.022, P.churrascoInox);
    for (let y = 1.25; y < 2.8; y += 0.28) por(new THREE.CylinderGeometry(0.016, 0.016, 0.3, 6).rotateZ(Math.PI / 2), P.churrascoInox, 0.77, y, tras - 0.07);
    // o adesivo de pata na porta de trás
    const pata = new THREE.Mesh(new THREE.CircleGeometry(0.16, 20), toon(P.barracaMostarda));
    pata.position.set(-0.55, 1.95, tras - 0.008); pata.rotation.y = Math.PI; lata.add(pata);
    for (const [dx, dy] of [[-0.12, 0.17], [-0.04, 0.23], [0.05, 0.23], [0.13, 0.17]] as const) {
      const dedo = new THREE.Mesh(new THREE.CircleGeometry(0.05, 12), toon(P.barracaMostarda));
      dedo.position.set(-0.55 - dx, 1.95 + dy, tras - 0.008); dedo.rotation.y = Math.PI; lata.add(dedo);
    }

    // ----------------------------------------------------- o teto: o gigante e as luzinhas
    const gigante = cachorroQuenteGigante();
    gigante.position.set(0, F.teto + 0.1, -0.55); lata.add(gigante);
    for (const z of [-1.5, 0.4]) {
      por(new THREE.CylinderGeometry(0.06, 0.08, 0.3, 10), P.churrascoInox, 0, F.teto + 0.1, z);
    }
    this.group.add(fundir(lata));
    this.luzinhas();

    // ----------------------------------------------------- as rodas (giram)
    for (const z of [F.eixoDaFrente, F.eixoDeTras]) for (const lado of [-1, 1]) {
      const r = roda(lado); r.position.set(lado * F.bitola, F.roda, z);
      this.rodas.push(r); this.group.add(fundir(r));
    }

    // ----------------------------------------------------- o Walter ao volante
    if (!estacionado) {
      this.walter.entrarEmServico();
      this.walter.group.scale.setScalar(1.75);
      this.walter.group.position.set(-0.55, F.peitoril - 0.22, 1.3);
      this.group.add(this.walter.group);
      this.update(0, 0, false);
    } else {
      this.abertura = 0; this.posicionarJanela();
      this.bancada.remove(this.naBancada);
      fundirComoFundo(this.group);
    }
  }

  /** o que vai na bancada aberta: os prontos, as bisnagas, os guardanapos e o sininho */
  private montarBancada(): void {
    const b = this.naBancada;
    for (const [i, z] of [[0, -0.55], [1, 0.25]] as const) {
      const pronto = cachorroQuentePronto(); pronto.scale.setScalar(1.8);
      pronto.position.set(0, 0, z); pronto.rotation.y = Math.PI / 2 + (i ? 0.25 : -0.2); b.add(pronto);
    }
    for (const [cor, z] of [[P.molhoKetchup, -0.15], [P.molhoMostarda, -0.05], [P.molhoMaionese, 0.62]] as const) {
      const frasco = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.16, 12), toon(cor));
      frasco.position.set(0.03, 0.08, z); b.add(frasco);
      const bico = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 10), toon(cor));
      bico.position.set(0.03, 0.19, z); b.add(bico);
    }
    const guardanapo = new THREE.Mesh(quina(0.12, 0.1, 0.16, 0.015), toon(P.churrascoInox));
    guardanapo.position.set(0.05, 0.05, 0.85); b.add(guardanapo);
    const papel = new THREE.Mesh(quina(0.1, 0.03, 0.14, 0.008), toon(P.barracaCreme));
    papel.position.set(0.05, 0.11, 0.85); b.add(papel);
    const sino = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.barracaMostarda, { doubleSide: true }));
    sino.position.set(0.04, 0.0, -0.88); b.add(sino);
    const botao = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), toon(P.churrascoInox));
    botao.position.set(0.04, 0.055, -0.88); b.add(botao);
    fundir(b);
  }

  /** as luzinhas na beira do teto, dos dois lados: um lote só, as cores alternadas */
  private luzinhas(): void {
    const cores = [P.barracaMostarda, P.barracaCreme, P.barracaVermelho, P.molhoKetchup];
    const pontos: THREE.Vector3[] = [];
    for (const lado of [-1, 1]) for (let z = F.tras + 0.3; z <= 1.45; z += 0.3) pontos.push(new THREE.Vector3(lado * (F.meiaLargura + 0.02), F.teto - 0.04, z));
    const lote = new THREE.InstancedMesh(new THREE.SphereGeometry(0.04, 8, 6), toon(0xffffff), pontos.length);
    const m = new THREE.Matrix4(), cor = new THREE.Color();
    pontos.forEach((p, i) => { lote.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)); lote.setColorAt(i, cor.set(cores[i % cores.length])); });
    lote.name = 'luzinhas-do-walter';
    this.group.add(lote);
  }

  private posicionarJanela(): void {
    const k = this.abertura;
    this.toldo.rotation.z = -1.62 * k;
    this.franja.rotation.z = 1.62 * k;
    this.bancada.rotation.z = (Math.PI / 2) * (1 - k);
    this.naBancada.visible = k > 0.85;
  }

  update(dt: number, distancia: number, conversando: boolean): void {
    for (const r of this.rodas) r.rotation.x += distancia / F.roda;
    this.walter.update(dt);
    // conversando, ele vira para a janela do lado do Bebito e abre a janela de venda
    const suave = 1 - Math.exp(-5 * dt);
    this.giroDoWalter += ((conversando ? -Math.PI / 2 : 0) - this.giroDoWalter) * suave;
    this.walter.group.rotation.y = this.giroDoWalter;
    this.abertura += ((conversando ? 1 : 0) - this.abertura) * (dt > 0 ? 1 - Math.exp(-3 * dt) : 0);
    this.posicionarJanela();
  }
}
