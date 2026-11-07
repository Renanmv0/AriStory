import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { fundir } from './fundir';
import { uvEmMetros } from './acabamento';
import { vaporDePrato } from './moveisDoMania';
import { potinhoDeTempero } from './cozinhaDaTiaLiz';

/**
 * ================================================ A CANTINA DA TIA LIZ
 *
 * O balcão da cantina da Escola do Gatito e os CINCO PRATOS da Tia Liz — a
 * comida que a mãe do Ari fazia para ele (pedido do Renan, com as fotos):
 *
 *  - a SOPITA: caldo dourado na tigela, com cenoura, batata, milho, abóbora
 *    e coentro;
 *  - a PASTA COM ALMÔNDEGAS: o ninho de espaguete, o molho de tomate, as
 *    almôndegas, o queijo e o manjericão;
 *  - o FORORO: o mingau de milho tostado na caneca, cremoso, com canela por
 *    cima e os tostadinhos;
 *  - o PABELLÓN CRIOLLO: o domo de arroz branco, o feijão preto, a carne
 *    desfiada e as tajadas (banana-da-terra frita);
 *  - a TORTA TRES LECHES: o quadrado de pão de ló encharcado, o chantilly com
 *    canela, os morangos cortados e a poça de leite em volta.
 *
 * Cada prato é uma peça com base em `y = 0`, centrada, do tamanho de um
 * prato de verdade (a mesa do refeitório tem 0,74). A COMIDA mora num grupo
 * com nome (`comida`), separado da louça: comer é encolher esse grupo, e a
 * louça fica na mesa até a dupla levantar.
 *
 * As TEXTURAS são todas de canvas (o grão do arroz, o feijão, o fiapo da
 * carne, a gordurinha do caldo, a canela), pintadas uma vez e cacheadas.
 */

export type PratoDaLiz = 'sopita' | 'pasta' | 'fororo' | 'pabellon' | 'tres-leches';

/** os cinco, na ordem do cardápio (o quadro e o menu leem daqui) */
export const PRATOS_DA_LIZ: ReadonlyArray<{ id: PratoDaLiz; nome: string; icone: string }> = [
  { id: 'sopita', nome: 'Sopita', icone: '🍲' },
  { id: 'pasta', nome: 'Pasta con albóndigas', icone: '🍝' },
  { id: 'pabellon', nome: 'Pabellón criollo', icone: '🍛' },
  { id: 'fororo', nome: 'Fororo', icone: '🥣' },
  { id: 'tres-leches', nome: 'Torta tres leches', icone: '🍰' },
];

// ============================================================== ferramentas

type Ponto3 = readonly [number, number, number];

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** perfil torneado `[raio, altura]` de baixo para cima (a face sai para fora) */
function torneado(perfil: ReadonlyArray<readonly [number, number]>, segs = 28): THREE.LatheGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), segs);
}

function tubo(pontos: ReadonlyArray<Ponto3>, raio: number, segs = 24, radial = 5): THREE.TubeGeometry {
  const v = pontos.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v), segs, raio, radial, false);
}

function por(
  pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

/** um sorteio de semente fixa: a mesma comida em todo build (e em toda foto) */
function sorteio(semente: number): () => number {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const texturas = new Map<string, THREE.CanvasTexture>();
/** uma textura de canvas quadrada, pintada uma vez (o UV dos discos vai de 0 a 1) */
function textura(chave: string, px: number, pintar: (c: CanvasRenderingContext2D, s: number, r: () => number) => void): THREE.CanvasTexture {
  let t = texturas.get(chave);
  if (t) return t;
  const tela = document.createElement('canvas');
  tela.width = px;
  tela.height = px;
  const c = tela.getContext('2d');
  if (c) pintar(c, px, sorteio(chave.length * 977 + px));
  t = new THREE.CanvasTexture(tela);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  texturas.set(chave, t);
  return t;
}

/**
 * UMA PARTE DO PRATO com nome, dentro da `comida`: é o que a Tia Liz monta
 * pedaço por pedaço na preparação (o caldo subindo, cada almôndega, o domo de
 * arroz). Com nome, a `fundir` junta por dentro dela e deixa ela viva.
 */
function parte(pai: THREE.Object3D, nome: string): THREE.Group {
  const g = new THREE.Group();
  g.name = nome;
  pai.add(g);
  return g;
}

/** um disco deitado (a superfície de um líquido, de um creme), virado para cima */
function disco(raio: number, segs = 28): THREE.CircleGeometry {
  return new THREE.CircleGeometry(raio, segs).rotateX(-Math.PI / 2);
}

// ================================================================ texturas

/** o grão do arroz: grãozinhos brancos deitados para todo lado, com a sombrinha */
function texturaDoArroz(): THREE.CanvasTexture {
  return textura('liz-arroz', 256, (c, s, r) => {
    c.fillStyle = css(P.arrozBranco);
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 520; i++) {
      const x = r() * s;
      const y = r() * s;
      const a = r() * Math.PI;
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.fillStyle = 'rgba(160,150,125,0.35)';
      c.beginPath();
      c.ellipse(1, 1.5, 6, 2.4, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = r() < 0.5 ? '#ffffff' : '#f6f1e2';
      c.beginPath();
      c.ellipse(0, 0, 6, 2.4, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  });
}

/** o feijão preto no caldo: os grãos ovais, com o brilho de cada um */
function texturaDoFeijao(): THREE.CanvasTexture {
  return textura('liz-feijao', 256, (c, s, r) => {
    c.fillStyle = css(P.feijaoPreto);
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 260; i++) {
      const x = r() * s;
      const y = r() * s;
      c.save();
      c.translate(x, y);
      c.rotate(r() * Math.PI);
      c.fillStyle = '#251b20';
      c.beginPath();
      c.ellipse(0, 0, 9, 5.5, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = css(P.feijaoBrilho);
      c.beginPath();
      c.ellipse(-2, -2, 3.5, 1.6, -0.3, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  });
}

/** a carne desfiada: os fiapos compridos em dois tons, para o mesmo lado (mais ou menos) */
function texturaDaCarne(): THREE.CanvasTexture {
  return textura('liz-carne', 256, (c, s, r) => {
    c.fillStyle = css(P.carneMechada);
    c.fillRect(0, 0, s, s);
    c.lineCap = 'round';
    for (let i = 0; i < 180; i++) {
      const x = r() * s;
      const y = r() * s;
      const a = 0.4 + (r() - 0.5) * 0.9;
      const l = 14 + r() * 26;
      c.strokeStyle = r() < 0.5 ? css(P.carneMechadaLuz) : '#7a3a22';
      c.lineWidth = 2 + r() * 2.5;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (r() - 0.5) * 6, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
      c.stroke();
    }
  });
}

/** o caldo da sopita: dourado, com as bolinhas de gordura e o cheirinho verde miúdo */
function texturaDoCaldo(): THREE.CanvasTexture {
  return textura('liz-caldo', 256, (c, s, r) => {
    const g = c.createRadialGradient(s / 2, s / 2, s * 0.1, s / 2, s / 2, s * 0.5);
    g.addColorStop(0, '#f1c46c');
    g.addColorStop(1, css(P.sopaCaldo));
    c.fillStyle = g;
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) {
      c.fillStyle = 'rgba(255,240,190,0.55)';
      c.beginPath();
      c.arc(r() * s, r() * s, 1.5 + r() * 5, 0, Math.PI * 2);
      c.fill();
    }
    for (let i = 0; i < 60; i++) {
      c.fillStyle = r() < 0.6 ? css(P.sopaCoentro) : '#3a7a2c';
      c.fillRect(r() * s, r() * s, 2 + r() * 3, 1.5 + r() * 2);
    }
  });
}

/** o creme do fororo: a canela polvilhada (mais densa no meio) e a voltinha de colher */
export function texturaDoFororo(): THREE.CanvasTexture {
  return textura('liz-fororo', 256, (c, s, r) => {
    c.fillStyle = css(P.fororoCreme);
    c.fillRect(0, 0, s, s);
    // a voltinha que a colher deixou no creme
    c.strokeStyle = 'rgba(200,170,120,0.55)';
    c.lineWidth = 5;
    c.beginPath();
    for (let a = 0; a < Math.PI * 5; a += 0.1) {
      const rr = 8 + a * 7;
      const x = s / 2 + Math.cos(a) * rr;
      const y = s / 2 + Math.sin(a) * rr;
      if (a === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
    for (let i = 0; i < 900; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * s * 0.42;
      c.fillStyle = r() < 0.5 ? css(P.canela) : '#a8693a';
      c.globalAlpha = 0.35 + (1 - d / (s * 0.42)) * 0.5;
      c.fillRect(s / 2 + Math.cos(a) * d, s / 2 + Math.sin(a) * d, 2, 2);
    }
    c.globalAlpha = 1;
  });
}

/** o chantilly da tres leches com a canela por cima (o pó fino, desigual) */
export function texturaDoChantilly(): THREE.CanvasTexture {
  return textura('liz-chantilly', 256, (c, s, r) => {
    c.fillStyle = css(P.tresLechesChantilly);
    c.fillRect(0, 0, s, s);
    // os "picos" do chantilly espalhado na espátula: arcos claros e sombras
    for (let i = 0; i < 40; i++) {
      c.strokeStyle = 'rgba(225,215,195,0.6)';
      c.lineWidth = 2;
      c.beginPath();
      c.arc(r() * s, r() * s, 6 + r() * 16, r() * 3, r() * 3 + 1.5);
      c.stroke();
    }
    for (let i = 0; i < 1400; i++) {
      c.fillStyle = r() < 0.6 ? css(P.canela) : '#b07a4a';
      c.globalAlpha = 0.25 + r() * 0.5;
      c.fillRect(r() * s, r() * s, 1.6, 1.6);
    }
    c.globalAlpha = 1;
  });
}

/** o miolo do pão de ló: amarelinho, cheio de furinhos, mais molhado embaixo */
export function texturaDoPaoDeLo(): THREE.CanvasTexture {
  return textura('liz-pao-de-lo', 128, (c, s, r) => {
    const g = c.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, css(P.tresLechesMassa));
    g.addColorStop(1, '#e9cf92');
    c.fillStyle = g;
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 260; i++) {
      c.fillStyle = 'rgba(190,150,80,0.4)';
      c.beginPath();
      c.arc(r() * s, r() * s, 0.8 + r() * 1.8, 0, Math.PI * 2);
      c.fill();
    }
  });
}

/** o molho do macarrão por cima do ninho: o vermelho com os pedacinhos de tomate */
function texturaDoMolho(): THREE.CanvasTexture {
  return textura('liz-molho', 128, (c, s, r) => {
    c.fillStyle = css(P.molhoDeTomate);
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 60; i++) {
      c.fillStyle = r() < 0.5 ? '#e0533e' : '#a52a20';
      c.beginPath();
      c.arc(r() * s, r() * s, 1.5 + r() * 3.5, 0, Math.PI * 2);
      c.fill();
    }
    for (let i = 0; i < 18; i++) {
      c.fillStyle = css(P.manjericao);
      c.fillRect(r() * s, r() * s, 2, 2);
    }
  });
}

/**
 * O AZULEJO do balcão da cantina: o creme com o rejunte e, a cada um, a
 * florzinha azul de quatro pétalas com o miolo amarelo — azulejo de cozinha
 * de vó, que é o que diz "comida de casa" antes de qualquer prato.
 */
function texturaDoAzulejo(): THREE.CanvasTexture {
  return textura('liz-azulejo', 256, (c, s) => {
    const n = 2;
    const l = s / n;
    c.fillStyle = css(P.azulejoDaCantinaRejunte);
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = i * l;
        const y = j * l;
        c.fillStyle = css(P.azulejoDaCantina);
        c.fillRect(x + 3, y + 3, l - 6, l - 6);
        const cx = x + l / 2;
        const cy = y + l / 2;
        if ((i + j) % 2 === 0) {
          c.fillStyle = css(P.azulejoDaCantinaDesenho);
          for (let k = 0; k < 4; k++) {
            const a = k * Math.PI / 2 + Math.PI / 4;
            c.beginPath();
            c.ellipse(cx + Math.cos(a) * l * 0.16, cy + Math.sin(a) * l * 0.16, l * 0.13, l * 0.07, a, 0, Math.PI * 2);
            c.fill();
          }
          c.fillStyle = css(P.azulejoDaCantinaMiolo);
          c.beginPath();
          c.arc(cx, cy, l * 0.07, 0, Math.PI * 2);
          c.fill();
        } else {
          // os cantinhos: um quarto de flor em cada canto, que fecha com o vizinho
          c.strokeStyle = css(P.azulejoDaCantinaDesenho);
          c.lineWidth = 4;
          c.beginPath();
          c.arc(cx, cy, l * 0.22, 0, Math.PI * 2);
          c.stroke();
          c.fillStyle = css(P.azulejoDaCantinaDesenho);
          c.beginPath();
          c.arc(cx, cy, l * 0.05, 0, Math.PI * 2);
          c.fill();
        }
      }
    }
  });
}

// ================================================================== louça

/** a TIGELA torneada creme, com a faixa lilás perto da boca */
export function tigela(raio = 0.115, alto = 0.075): THREE.Group {
  const g = new THREE.Group();
  g.name = 'tigela';
  por(g, torneado([
    [0.0001, 0], [raio * 0.42, 0], [raio * 0.46, 0.008], [raio * 0.5, 0.012],
    [raio * 0.78, alto * 0.38], [raio * 0.95, alto * 0.78], [raio, alto], [raio - 0.007, alto + 0.002],
    [raio * 0.9, alto * 0.72], [raio * 0.7, alto * 0.32], [raio * 0.4, alto * 0.16], [0.0001, alto * 0.15],
  ], 32), toon(P.loucaCreme));
  // a faixa lilás: um anel colado por fora da parede, abaixo da boca
  const y = alto * 0.8;
  const r = raio * 0.955 + 0.0015;
  por(g, new THREE.CylinderGeometry(r + 0.0006, r - 0.0015, alto * 0.11, 32, 1, true), toon(P.loucaFaixa, { doubleSide: true }), 0, y, 0);
  return g;
}

/** o PRATO raso creme: o fundo, a aba subindo e a beirada lilás fina */
export function pratoRaso(raio = 0.16): THREE.Group {
  const g = new THREE.Group();
  g.name = 'prato';
  por(g, torneado([
    [0.0001, 0], [raio * 0.5, 0], [raio * 0.55, 0.006], [raio * 0.62, 0.008],
    [raio * 0.92, 0.02], [raio, 0.026], [raio * 0.985, 0.03], [raio * 0.9, 0.025], [raio * 0.6, 0.013], [0.0001, 0.012],
  ], 36), toon(P.loucaCreme));
  por(g, new THREE.TorusGeometry(raio * 0.985, 0.0024, 4, 36).rotateX(Math.PI / 2), toon(P.loucaFaixa), 0, 0.029, 0);
  return g;
}

/** a colher de sopa, deitada: a concha oval e o cabo */
function colher(comprimento = 0.13): THREE.Group {
  const g = new THREE.Group();
  g.name = 'colher';
  const metal = toon(P.talher);
  const concha = new THREE.SphereGeometry(0.016, 12, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  concha.scale(1, 0.45, 1.45);
  por(g, concha, toon(P.talher, { doubleSide: true }), 0, 0.007, 0);
  por(g, tubo([[0, 0.006, -0.02], [0, 0.012, -0.05], [0, 0.02, -comprimento * 0.7], [0, 0.026, -comprimento]], 0.0032, 10, 5), metal);
  return g;
}

function garfo(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'garfo';
  const metal = toon(P.talher);
  por(g, tubo([[0, 0.004, -0.015], [0, 0.009, -0.06], [0, 0.014, -0.11]], 0.0032, 8, 5), metal);
  const base = new THREE.Mesh(new RoundedBoxGeometry(0.018, 0.003, 0.016, 1, 0.0012), metal);
  base.position.set(0, 0.003, -0.006);
  g.add(base);
  for (let i = 0; i < 4; i++) por(g, new THREE.BoxGeometry(0.0022, 0.0022, 0.024), metal, -0.0066 + i * 0.0044, 0.003, 0.014);
  return g;
}

// ================================================================ os pratos

/**
 * A SOPITA: a tigela funda com o caldo dourado e, boiando, as rodelas de
 * cenoura, os cubinhos de batata e de abóbora, o pedaço de milho na espiga
 * (o jojoto, que não pode faltar na sopa venezuelana) e o coentro picado. A
 * colher descansa na beirada.
 */
export function sopita(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'sopita';
  g.add(tigela(0.115, 0.075));
  const comida = new THREE.Group();
  comida.name = 'comida';
  comida.position.y = 0.062;
  const caldo = parte(comida, 'caldo');
  const coentro = parte(comida, 'coentro');
  por(caldo, disco(0.104, 32), toon(0xffffff, { mapa: texturaDoCaldo() }));
  const r = sorteio(11);
  // as rodelas de cenoura, os cubinhos de batata e de abóbora, meio afundados
  for (let i = 0; i < 6; i++) {
    const a = r() * Math.PI * 2;
    const d = 0.025 + r() * 0.06;
    const m = por(caldo, new THREE.CylinderGeometry(0.014, 0.014, 0.006, 12), toon(P.sopaCenoura), Math.cos(a) * d, 0.0015, Math.sin(a) * d);
    m.rotation.set((r() - 0.5) * 0.4, 0, (r() - 0.5) * 0.4);
  }
  for (let i = 0; i < 7; i++) {
    const a = r() * Math.PI * 2;
    const d = 0.02 + r() * 0.065;
    const cubo = new RoundedBoxGeometry(0.018, 0.016, 0.018, 1, 0.004);
    const m = por(caldo, cubo, toon(i % 2 ? P.sopaBatata : P.sopaAbobora), Math.cos(a) * d, 0.002, Math.sin(a) * d);
    m.rotation.set(r() * 0.5, r() * 3, r() * 0.5);
  }
  // o pedaço de milho na espiga: o sabugo curto com os grãos em fileiras
  const milho = new THREE.Group();
  milho.position.set(-0.035, 0.008, 0.02);
  milho.rotation.set(Math.PI / 2, 0, 0.6);
  por(milho, new THREE.CylinderGeometry(0.016, 0.016, 0.034, 12), toon(P.sopaMilho));
  for (let k = 0; k < 10; k++) {
    for (let j = 0; j < 3; j++) {
      const a = (k / 10) * Math.PI * 2;
      const grao = por(milho, new THREE.SphereGeometry(0.0055, 6, 4), toon(P.sopaMilho), Math.cos(a) * 0.016, -0.011 + j * 0.011, Math.sin(a) * 0.016);
      grao.scale.set(1, 0.9, 1);
    }
  }
  caldo.add(milho);
  // as folhinhas de coentro picado por cima
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.09;
    const folha = por(coentro, new THREE.CircleGeometry(0.006, 5).rotateX(-Math.PI / 2), toon(P.sopaCoentro, { doubleSide: true }), Math.cos(a) * d, 0.004, Math.sin(a) * d);
    folha.rotation.y = r() * 3;
  }
  g.add(comida);
  const c = colher(0.14);
  c.name = 'talher';
  c.position.set(0.05, 0.062, 0.02);
  c.rotation.set(-0.5, 2.2, 0);
  g.add(c);
  return fundir(g);
}

/**
 * A PASTA CON ALBÓNDIGAS: o ninho de espaguete (seis fios compridos dando
 * volta em espiral, um em cima do outro), o molho por cima, três almôndegas
 * gordinhas, o queijo ralado e duas folhas de manjericão.
 */
export function pastaComAlbondigas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pasta-con-albondigas';
  g.add(pratoRaso(0.16));
  const comida = new THREE.Group();
  comida.name = 'comida';
  comida.position.y = 0.014;
  const massa = toon(P.massaEspaguete);
  const r = sorteio(23);
  const altura = (d: number): number => 0.012 + 0.05 * Math.max(0, 1 - (d / 0.1) ** 2);
  const macarrao = parte(comida, 'macarrao');
  const molhoP = parte(comida, 'molho');
  const queijo = parte(comida, 'queijo');
  const manjericao = parte(comida, 'manjericao');
  for (let f = 0; f < 7; f++) {
    const pontos: Ponto3[] = [];
    const a0 = r() * Math.PI * 2;
    for (let k = 0; k <= 46; k++) {
      const t = k / 46;
      const a = a0 + t * Math.PI * 4.6;
      const d = 0.018 + t * 0.085 + Math.sin(t * 19 + f) * 0.006;
      pontos.push([Math.cos(a) * d, altura(d) + Math.sin(t * 13 + f * 2) * 0.004 + f * 0.0012, Math.sin(a) * d]);
    }
    por(macarrao, tubo(pontos, 0.0042, 110, 5), massa);
  }
  // o molho: uma poça gordinha por cima do ninho, que escorre um pouco
  const molho = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDoMolho() }));
  molho.scale.set(0.062, 0.02, 0.058);
  molho.position.y = 0.054;
  molhoP.add(molho);
  for (const [a, d] of [[0.5, 0.06], [2.4, 0.058], [4.2, 0.063]] as const) {
    const pingo = por(molhoP, new THREE.SphereGeometry(1, 10, 6), toon(P.molhoDeTomate), Math.cos(a) * d, 0.046, Math.sin(a) * d);
    pingo.scale.set(0.018, 0.012, 0.022);
    pingo.rotation.y = -a;
  }
  // as almôndegas: icosaedro (o facetado lê como carne moída) e o molho em cima
  for (const [i, [a, d]] of ([[0.3, 0.032], [2.4, 0.034], [4.4, 0.03]] as const).entries()) {
    const bola = parte(comida, `almondega-${i}`);
    bola.position.set(Math.cos(a) * d, 0.08, Math.sin(a) * d);
    por(bola, new THREE.IcosahedronGeometry(0.026, 1), toon(P.almondega));
    const capa = por(bola, new THREE.SphereGeometry(0.02, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.molhoDeTomate), 0, 0.01, 0);
    capa.scale.set(1, 0.6, 1);
  }
  // o queijo ralado e o manjericão
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.05;
    const q = por(queijo, new THREE.BoxGeometry(0.008, 0.0025, 0.0035), toon(P.queijoRalado), Math.cos(a) * d, 0.1 + r() * 0.008, Math.sin(a) * d);
    q.rotation.set(r(), r() * 3, r());
  }
  for (const giro of [0.4, -0.8]) {
    const folha = new THREE.Mesh(new THREE.CircleGeometry(0.018, 10), toon(P.manjericao, { doubleSide: true }));
    folha.scale.set(0.55, 1, 1);
    folha.position.set(0.006, 0.108, -0.004);
    folha.rotation.set(-Math.PI / 2 + 0.35, 0, giro);
    manjericao.add(folha);
  }
  g.add(comida);
  const gf = garfo();
  gf.name = 'talher';
  gf.position.set(0.13, 0.03, 0.04);
  gf.rotation.y = 0.4;
  g.add(gf);
  return fundir(g);
}

/**
 * O FORORO: a caneca grande de faixa azul no pires, cheia do mingau de milho
 * tostado — creme bege, a canela polvilhada no meio, a voltinha da colher e
 * os tostadinhos por cima.
 */
export function fororo(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'fororo';
  // o pires
  por(g, torneado([[0.0001, 0], [0.05, 0], [0.085, 0.01], [0.09, 0.014], [0.086, 0.015], [0.05, 0.007], [0.0001, 0.007]], 30), toon(P.canecaDoFororo));
  // a caneca torneada (parede com espessura), a faixa e a alça
  const R = 0.058;
  const A = 0.095;
  por(g, torneado([
    [0.0001, 0.007], [R * 0.82, 0.007], [R * 0.9, 0.012], [R, 0.03], [R * 1.02, A], [R * 0.9, A + 0.002], [R * 0.88, 0.03], [0.0001, 0.02],
  ], 30), toon(P.canecaDoFororo));
  por(g, new THREE.CylinderGeometry(R * 1.025, R * 1.012, 0.012, 30, 1, true), toon(P.canecaDoFororoFaixa, { doubleSide: true }), 0, A - 0.02, 0);
  const alca = por(g, new THREE.TorusGeometry(0.026, 0.0075, 8, 16, Math.PI * 1.25), toon(P.canecaDoFororo), R + 0.008, A * 0.55, 0);
  alca.rotation.z = -Math.PI * 0.62;
  const comida = new THREE.Group();
  comida.name = 'comida';
  comida.position.y = A - 0.008;
  // o creme liso (antes da canela) e o creme com a canela e a voltinha
  const creme = parte(comida, 'creme');
  const cremeLiso = por(creme, disco(R * 0.9, 30), toon(P.fororoCreme), 0, -0.0005, 0);
  cremeLiso.name = 'creme-liso';
  const comCanela = por(creme, disco(R * 0.9, 30), toon(0xffffff, { mapa: texturaDoFororo() }));
  comCanela.name = 'creme-com-canela';
  const tostadinhos = parte(comida, 'tostadinhos');
  const r = sorteio(37);
  for (let i = 0; i < 12; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.03;
    const t = por(tostadinhos, new THREE.IcosahedronGeometry(0.0045 + r() * 0.003, 0), toon(P.fororoTostado), Math.cos(a) * d, 0.003, Math.sin(a) * d);
    t.rotation.set(r() * 3, r() * 3, 0);
  }
  g.add(comida);
  const c = colher(0.12);
  c.name = 'talher';
  c.position.set(-0.02, A - 0.004, 0.015);
  c.rotation.set(-0.75, -0.6, 0);
  g.add(c);
  return fundir(g);
}

/**
 * O PABELLÓN CRIOLLO, o prato da bandeira: o DOMO de arroz branco (de
 * forminha, com o grão desenhado), o FEIJÃO PRETO amontoado ao lado, a CARNE
 * DESFIADA em fiapos e as três TAJADAS de banana-da-terra frita, douradas com
 * a beirada caramelizada.
 */
export function pabellon(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pabellon-criollo';
  g.add(pratoRaso(0.17));
  const comida = new THREE.Group();
  comida.name = 'comida';
  comida.position.y = 0.014;
  // o arroz: um domo de forminha (meia esfera achatada) com o grão
  const arroz = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDoArroz() }),
  );
  arroz.scale.set(0.062, 0.05, 0.062);
  arroz.position.set(0, 0, 0);
  const arrozP = parte(comida, 'arroz');
  arrozP.position.set(-0.05, 0, -0.045);
  arrozP.add(arroz);
  const feijao = parte(comida, 'feijao');
  const carneP = parte(comida, 'carne');
  carneP.position.set(0.04, 0, 0.06);
  const r = sorteio(41);
  // o feijão: o monte (com a textura) e uns grãos soltos por cima
  const monte = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDoFeijao() }),
  );
  monte.scale.set(0.055, 0.022, 0.048);
  feijao.position.set(0.058, 0, -0.05);
  feijao.add(monte);
  for (let i = 0; i < 18; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.04;
    const y = 0.022 * Math.sqrt(Math.max(0, 1 - (d / 0.05) ** 2));
    const grao = por(feijao, new THREE.SphereGeometry(1, 8, 6), toon(P.feijaoPreto), Math.cos(a) * d, y, Math.sin(a) * d * 0.9);
    grao.scale.set(0.0085, 0.0055, 0.0055);
    grao.rotation.y = r() * 3;
  }
  // a carne desfiada: o montinho com o fiapo desenhado, e fiapos soltos por cima
  const carne = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDaCarne() }),
  );
  carne.scale.set(0.058, 0.026, 0.045);
  carneP.add(carne);
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.036;
    const x = 0.04 + Math.cos(a) * d;
    const z = 0.06 + Math.sin(a) * d * 0.8;
    const y = 0.026 * Math.sqrt(Math.max(0, 1 - (d / 0.045) ** 2));
    const giro = r() * Math.PI;
    const l = 0.022 + r() * 0.02;
    const fiapo = por(carneP, tubo([
      [-Math.cos(giro) * l, 0, -Math.sin(giro) * l],
      [(r() - 0.5) * 0.008, 0.003, (r() - 0.5) * 0.008],
      [Math.cos(giro) * l, 0, Math.sin(giro) * l],
    ], 0.0028 + r() * 0.0015, 8, 4), toon(i % 3 === 0 ? P.carneMechadaLuz : P.carneMechada), x - 0.04, y, z - 0.06);
    fiapo.rotation.x = (r() - 0.5) * 0.3;
  }
  // as TAJADAS: três fatias compridas e curvas (meia-lua extrudada com
  // bisel), douradas, e a beirada caramelizada por cima de cada uma
  const fatia = new THREE.Shape();
  fatia.moveTo(-0.055, 0);
  fatia.quadraticCurveTo(0, 0.034, 0.055, 0);
  fatia.quadraticCurveTo(0, 0.016, -0.055, 0);
  const geo = new THREE.ExtrudeGeometry(fatia, { depth: 0.009, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 12 });
  geo.rotateX(-Math.PI / 2);
  for (const [i, [x, z, giro]] of ([[-0.075, 0.05, 1.35], [-0.055, 0.075, 1.2], [-0.03, 0.095, 1.05]] as const).entries()) {
    const tj = parte(comida, `tajada-${i}`);
    tj.position.set(x, 0.004 + i * 0.006, z);
    tj.rotation.y = giro;
    por(tj, geo, toon(P.tajada));
    por(tj, tubo([[-0.05, 0.012, -0.003], [0, 0.012, -0.03], [0.05, 0.012, -0.003]], 0.0035, 14, 4), toon(P.tajadaTostada));
  }
  g.add(comida);
  const gf = garfo();
  gf.name = 'talher';
  gf.position.set(0.14, 0.03, 0.02);
  gf.rotation.y = 0.3;
  g.add(gf);
  return fundir(g);
}

/**
 * A TORTA TRES LECHES: o quadrado de pão de ló (canto arredondado, o miolo
 * de furinhos nos lados), o chantilly por cima com a canela, as metades de
 * morango (vermelho por fora, o miolo rosa claro na face cortada) e a poça
 * dos três leites escorrida no prato.
 */
export function tresLeches(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'torta-tres-leches';
  g.add(pratoRaso(0.14));
  const comida = new THREE.Group();
  comida.name = 'comida';
  comida.position.y = 0.014;
  // a poça de leite: um disco torto, um tico acima do fundo do prato
  const poca = new THREE.Shape();
  for (let k = 0; k <= 24; k++) {
    const a = (k / 24) * Math.PI * 2;
    const rr = 0.088 + Math.sin(a * 3) * 0.008 + Math.sin(a * 5 + 1) * 0.005;
    if (k === 0) poca.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    else poca.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  const leite = parte(comida, 'leite');
  por(leite, new THREE.ShapeGeometry(poca, 2).rotateX(-Math.PI / 2), toon(P.tresLechesLeite), 0, 0.0025, 0);
  const bolo = parte(comida, 'bolo');
  const canela = parte(comida, 'canela');
  // o bolo
  const L = 0.1;
  const ALTO = 0.05;
  const massa = new THREE.Mesh(new RoundedBoxGeometry(L, ALTO, L, 2, 0.006), toon(0xffffff, { mapa: texturaDoPaoDeLo() }));
  massa.position.y = ALTO / 2 + 0.003;
  bolo.add(massa);
  const cobertura = new THREE.Mesh(new RoundedBoxGeometry(L + 0.004, 0.02, L + 0.004, 2, 0.008), toon(P.tresLechesChantilly));
  cobertura.position.y = ALTO + 0.011;
  bolo.add(cobertura);
  por(canela, new THREE.PlaneGeometry(L - 0.006, L - 0.006).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: texturaDoChantilly() }), 0, ALTO + 0.0212, 0);
  // os morangos: meia esfera vermelha, e a face cortada (o disco rosa com o miolo)
  for (const [i, [x, z, giro]] of ([[-0.022, -0.018, 0.4], [0.024, 0.012, -0.6], [-0.012, 0.028, 2.2]] as const).entries()) {
    const m = new THREE.Group();
    m.name = `morango-${i}`;
    m.position.set(x, ALTO + 0.022, z);
    m.rotation.set(-Math.PI / 2 + 0.25, 0, giro);
    const meia = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8, 0, Math.PI), toon(P.morangoFruta));
    meia.scale.set(0.016, 0.022, 0.016);
    meia.rotation.x = -Math.PI / 2;
    m.add(meia);
    const corte = new THREE.Mesh(new THREE.CircleGeometry(1, 14), toon(P.morangoMiolo));
    corte.scale.set(0.0158, 0.0218, 1);
    corte.position.z = 0.0005;
    m.add(corte);
    const folhinha = por(m, new THREE.ConeGeometry(0.006, 0.008, 5), toon(P.morangoFolha), 0, 0.023, 0.004);
    folhinha.rotation.x = Math.PI;
    comida.add(m);
  }
  g.add(comida);
  const c = colher(0.12);
  c.name = 'talher';
  c.position.set(0.1, 0.03, 0.04);
  c.rotation.y = 0.5;
  g.add(c);
  return fundir(g);
}

/** o prato pelo id do cardápio */
export function pratoDaTiaLiz(id: PratoDaLiz): THREE.Group {
  const g = id === 'sopita' ? sopita()
    : id === 'pasta' ? pastaComAlbondigas()
      : id === 'fororo' ? fororo()
        : id === 'pabellon' ? pabellon()
          : tresLeches();
  g.userData.pratoDaLiz = id;
  return g;
}

/**
 * A BANDEJA DO REFEITÓRIO com o prato da Tia Liz, o guardanapo dobrado e o
 * copinho de suco — é o que a dupla leva para a mesa. O prato fica no
 * `userData.prato` para a cena encolher a comida enquanto eles comem.
 */
export function bandejaComPrato(id: PratoDaLiz, pronto?: THREE.Group): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bandeja-da-cantina';
  const bandeja = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.022, 0.34, 2, 0.008), toon(P.refeitorioBandeja));
  bandeja.position.y = 0.011;
  g.add(bandeja);
  // o prato montado na hora pela Tia Liz (a preparação) vai inteiro para a bandeja
  const prato = pronto ?? pratoDaTiaLiz(id);
  g.add(prato);
  prato.position.set(-0.04, 0.022, 0);
  prato.quaternion.identity();
  prato.scale.setScalar(1);
  // o guardanapo dobrado em triângulo
  const tri = new THREE.Shape();
  tri.moveTo(0, 0);
  tri.lineTo(0.08, 0);
  tri.lineTo(0, 0.08);
  tri.lineTo(0, 0);
  const guardanapo = por(g, new THREE.ExtrudeGeometry(tri, { depth: 0.004, bevelEnabled: false }).rotateX(-Math.PI / 2), toon(P.tresLechesChantilly), 0.13, 0.022, 0.12);
  guardanapo.rotation.y = Math.PI * 0.75;
  // o copinho de suco de maracujá
  por(g, torneado([[0.0001, 0], [0.024, 0], [0.03, 0.075], [0.027, 0.075], [0.021, 0.004], [0.0001, 0.004]], 18), toon(P.maracuja), 0.16, 0.022, -0.08);
  g.userData.prato = prato;
  return g;
}

/** o potinho de coentro picado ao lado do caldeirão */
function potinhoDeCoentroNoBalcao(): THREE.Group {
  const g = new THREE.Group();
  por(g, torneado([[0.0001, 0], [0.035, 0], [0.045, 0.035], [0.042, 0.036], [0.033, 0.006], [0.0001, 0.006]], 18), toon(P.loucaCreme));
  const folhas = toon(P.sopaCoentro, { doubleSide: true });
  for (let i = 0; i < 14; i++) {
    const a = i * 2.4;
    const d = (i % 4) * 0.009;
    const f = por(g, new THREE.CircleGeometry(0.008, 5), folhas, Math.cos(a) * d, 0.03 + (i % 3) * 0.003, Math.sin(a) * d);
    f.rotation.set(-Math.PI / 2 + (i % 2) * 0.3, a, 0);
  }
  return g;
}

// ================================================================= o balcão

/**
 * O BALCÃO DA CANTINA, o de DENTRO da cozinha, encostado na janela de
 * servir (`janelaDaCantina`): o corpo de azulejo (a florzinha azul de miolo
 * amarelo), o rodapé, o tampo de inox com a quina boleada e, em cima, a
 * comida da Tia Liz exposta — é o que se vê pela janela:
 *
 *  - as CUBAS ABERTAS de inox (quatro paredes, a comida um tico abaixo da
 *    boca): o arroz, o feijão preto, a carne desfiada, as tajadas e a pasta
 *    com almôndegas;
 *  - o CALDEIRÃO DA SOPITA embutido no tampo, de boca a 1 m, com as alças e
 *    o vapor (`vapor-da-sopita`, que a cena anima) — é onde ela mexe;
 *  - o potinho de coentro picado do lado dele.
 *
 * É o balcão TÉRMICO, do meio da fila: o fogão da Liz fica à esquerda e a
 * bancada de preparo à direita (`world/cozinhaDaTiaLiz.ts`), com o fororo, a
 * tres leches, a tábua e as pilhas de louça.
 *
 * A frente olha para `+Z`. `SOPA_NO_BALCAO` diz onde fica o caldeirão (a
 * cena põe a Tia Liz atrás dele). O trilho de bandeja mora do lado de FORA,
 * no parapeito da janela.
 */
export const SOPA_NO_BALCAO = { x: 0.93, z: -0.24, boca: 1.01 } as const;

/**
 * ONDE FICA CADA COISA NO BALCÃO (referencial dele; a frente é `+Z`, ela
 * trabalha no `−Z`). As cubas vão na ordem do serviço, da esquerda (o
 * fogão) para a direita: a pasta, o arroz, o feijão e a carne, o caldeirão
 * da sopita, e as tajadas. O PASSE é o pedaço livre da ponta esquerda,
 * colado no fogão: o prato espera ali enquanto ela usa as duas patas na
 * frigideira, e a pilha de louça mora na metade da janela dele. A faixa de
 * trás (`z` −0,335) guarda o que ela usa: os potinhos da pitada.
 */
export const LUGARES_DO_BALCAO = {
  cubas: { pasta: -1.45, arroz: -0.87, feijao: -0.29, carne: 0.29, tajadas: 1.51 },
  /** o meio das cubas no `z`, e a altura da comida dentro delas */
  cubaZ: -0.03,
  comidaY: 0.992,
  /** o lugar do prato no passe, e a pilha de louça atrás dele */
  passe: { x: -2.02, z: -0.2 },
  pilha: { x: -2.02, z: 0.15, topo: 0.93 + 4 * 0.016 },
  /** a faixa de trás: os potinhos da pitada */
  tras: -0.335,
  queijo: -1.74,
  manjericao: -1.63,
  tostadinho: -1.52,
  coentro: SOPA_NO_BALCAO.x + 0.3,
} as const;
/** quanto o passe acrescenta à esquerda do balcão */
export const PASSE = 0.45;

export function balcaoDaCantina(largura = 3.6): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balcao-da-cantina';
  const F = 0.85;
  const inox = toon(P.churrascoInox);
  const inoxEscuro = toon(P.churrascoInoxEscuro);
  const LB = LUGARES_DO_BALCAO;

  // o corpo de azulejo, e o rodapé escuro recuado (o passe alonga a esquerda)
  const total = largura + PASSE;
  const meio = -PASSE / 2;
  const corpoGeo = new THREE.BoxGeometry(total, 0.78, F);
  uvEmMetros(corpoGeo);
  // a textura tem 2 × 2 azulejos: com o UV em metros, cada um sai com 15 cm
  const azulejo = texturaDoAzulejo();
  azulejo.repeat.set(1 / 0.3, 1 / 0.3);
  por(g, corpoGeo, toon(0xffffff, { mapa: azulejo }), meio, 0.49, 0);
  por(g, new THREE.BoxGeometry(total - 0.04, 0.1, F - 0.06), toon(P.escolaParedeAzul), meio, 0.05, 0);
  // o tampo de inox, mais largo que o corpo, com a quina da frente boleada
  por(g, new THREE.BoxGeometry(total + 0.06, 0.05, F + 0.04), inox, meio, 0.905, -0.01);
  const quina = por(g, new THREE.CylinderGeometry(0.025, 0.025, total + 0.06, 12), inox, meio, 0.905, F / 2 + 0.01);
  quina.rotation.z = Math.PI / 2;
  // a PILHA DE LOUÇA no passe, do lado da janela: os pratos que ela pega
  for (let k = 0; k < 4; k++) {
    const pr = pratoRaso(0.16);
    pr.position.set(LB.pilha.x, 0.93 + k * 0.016, LB.pilha.z);
    g.add(pr);
  }
  // os potinhos da pitada na faixa de trás: queijo, manjericão e tostadinho
  for (const [x, cor, folha] of [[LB.queijo, P.queijoRalado, false], [LB.manjericao, P.manjericao, true], [LB.tostadinho, P.fororoTostado, false]] as const) {
    const pot = potinhoDeTempero(cor, folha);
    pot.position.set(x, 0.93, LB.tras);
    g.add(pot);
  }


  const TOPO = 0.93;
  /** uma cuba aberta de inox, com a comida (o que `encher` puser) um tico abaixo da boca */
  const cuba = (x: number, encher: (dentro: THREE.Group) => void): void => {
    const c = new THREE.Group();
    c.position.set(x, TOPO, -0.03);
    const L = 0.5;
    const P0 = 0.42;
    const A = 0.08;
    const e = 0.012;
    // o fundo por DENTRO das paredes, e as paredes um tico acima do tampo: sem
    // isso cada face de fora encostava numa do fundo (o serrilhado)
    por(c, new THREE.BoxGeometry(L - 2 * e, 0.012, P0 - 2 * e), inoxEscuro, 0, 0.006, 0);
    por(c, new THREE.BoxGeometry(L, A - 0.002, e), inox, 0, A / 2 + 0.001, P0 / 2 - e / 2);
    por(c, new THREE.BoxGeometry(L, A - 0.002, e), inox, 0, A / 2 + 0.001, -P0 / 2 + e / 2);
    por(c, new THREE.BoxGeometry(e, A - 0.004, P0 - 2 * e), inox, L / 2 - e / 2 - 0.002, A / 2 + 0.001, 0);
    por(c, new THREE.BoxGeometry(e, A - 0.004, P0 - 2 * e), inox, -L / 2 + e / 2 + 0.002, A / 2 + 0.001, 0);
    // a aba virada por cima da parede (a borda da cuba), mais larga que ela
    por(c, new THREE.BoxGeometry(L + 0.02, 0.006, 0.016), inox, 0, A + 0.003, P0 / 2 + 0.002);
    por(c, new THREE.BoxGeometry(L + 0.02, 0.006, 0.016), inox, 0, A + 0.003, -P0 / 2 - 0.002);
    const dentro = new THREE.Group();
    dentro.position.y = A - 0.018;
    encher(dentro);
    c.add(dentro);
    g.add(c);
  };
  const superficie = (dentro: THREE.Group, mapa: THREE.Texture, repetir = 1): void => {
    const plano = new THREE.PlaneGeometry(0.476, 0.396).rotateX(-Math.PI / 2);
    const uv = plano.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * repetir * 1.2, uv.getY(i) * repetir);
    por(dentro, plano, toon(0xffffff, { mapa: mapa }));
  };
  const r = sorteio(53);
  // o ARROZ, com o montinho no meio
  cuba(LB.cubas.arroz, (d) => {
    superficie(d, texturaDoArroz(), 1.6);
    const monte = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDoArroz() }));
    monte.scale.set(0.17, 0.035, 0.13);
    d.add(monte);
  });
  // o FEIJÃO, com uns grãos por cima
  cuba(LB.cubas.feijao, (d) => {
    superficie(d, texturaDoFeijao(), 1.4);
    for (let i = 0; i < 26; i++) {
      const grao = por(d, new THREE.SphereGeometry(1, 8, 6), toon(P.feijaoPreto), (r() - 0.5) * 0.4, 0.004, (r() - 0.5) * 0.32);
      grao.scale.set(0.0095, 0.006, 0.006);
      grao.rotation.y = r() * 3;
    }
  });
  // a CARNE DESFIADA, com os fiapos soltos
  cuba(LB.cubas.carne, (d) => {
    superficie(d, texturaDaCarne(), 1.3);
    for (let i = 0; i < 22; i++) {
      const giro = r() * Math.PI;
      const l = 0.03 + r() * 0.03;
      const f = por(d, tubo([
        [-Math.cos(giro) * l, 0, -Math.sin(giro) * l], [0, 0.006, 0], [Math.cos(giro) * l, 0, Math.sin(giro) * l],
      ], 0.004, 8, 4), toon(i % 3 ? P.carneMechada : P.carneMechadaLuz), (r() - 0.5) * 0.38, 0.002, (r() - 0.5) * 0.3);
      f.rotation.x = (r() - 0.5) * 0.3;
    }
  });
  // as TAJADAS, deitadas em fileira
  cuba(LB.cubas.tajadas, (d) => {
    por(d, new THREE.PlaneGeometry(0.476, 0.396).rotateX(-Math.PI / 2), toon(P.tajadaTostada));
    const fatia = new THREE.Shape();
    fatia.moveTo(-0.075, 0);
    fatia.quadraticCurveTo(0, 0.045, 0.075, 0);
    fatia.quadraticCurveTo(0, 0.022, -0.075, 0);
    const geo = new THREE.ExtrudeGeometry(fatia, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 10 });
    geo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 9; i++) {
      const t = por(d, geo, toon(i % 3 === 1 ? P.tajadaTostada : P.tajada), -0.15 + (i % 3) * 0.15, 0.002 + (i % 2) * 0.006, -0.12 + Math.floor(i / 3) * 0.12);
      t.rotation.y = 0.35 + (i % 2) * 0.2;
    }
  });
  // a PASTA COM ALMÔNDEGAS: o espaguete em fios, o molho e as almôndegas
  cuba(LB.cubas.pasta, (d) => {
    por(d, new THREE.PlaneGeometry(0.476, 0.396).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: texturaDoMolho() }));
    const massa = toon(P.massaEspaguete);
    for (let f = 0; f < 9; f++) {
      const pontos: Ponto3[] = [];
      const z0 = -0.17 + f * 0.042;
      for (let k = 0; k <= 16; k++) {
        const x = -0.22 + (k / 16) * 0.44;
        pontos.push([x, 0.006 + Math.abs(Math.sin(k * 0.9 + f)) * 0.008, z0 + Math.sin(k * 0.7 + f * 1.3) * 0.03]);
      }
      por(d, tubo(pontos, 0.0045, 40, 5), massa);
    }
    for (let i = 0; i < 6; i++) {
      const x = -0.16 + (i % 3) * 0.16;
      const z = -0.08 + Math.floor(i / 3) * 0.16;
      por(d, new THREE.IcosahedronGeometry(0.03, 1), toon(P.almondega), x, 0.02, z);
      const capa = por(d, new THREE.SphereGeometry(0.023, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.molhoDeTomate), x, 0.03, z);
      capa.scale.set(1, 0.6, 1);
    }
  });

  // o CALDEIRÃO DA SOPITA embutido: a boca a 1,01, as alças e o caldo
  {
    const S = SOPA_NO_BALCAO;
    const c = new THREE.Group();
    c.name = 'caldeirao-da-sopita';
    c.position.set(S.x, 0, S.z);
    const R = 0.17;
    por(c, new THREE.CylinderGeometry(R, R * 0.96, 0.12, 32, 1, true), toon(P.churrascoInox, { doubleSide: true }), 0, S.boca - 0.06, 0);
    por(c, new THREE.TorusGeometry(R, 0.009, 6, 32).rotateX(Math.PI / 2), inox, 0, S.boca, 0);
    for (const lado of [-1, 1]) {
      const alca = por(c, new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI), inoxEscuro, lado * (R + 0.02), S.boca - 0.025, 0);
      alca.rotation.set(Math.PI / 2, lado > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
    }
    const caldo = new THREE.Group();
    caldo.position.y = S.boca - 0.03;
    por(caldo, disco(R - 0.006, 32), toon(0xffffff, { mapa: texturaDoCaldo() }));
    for (let i = 0; i < 12; i++) {
      const a = r() * Math.PI * 2;
      const d = 0.02 + r() * 0.12;
      if (i % 2) {
        const m = por(caldo, new THREE.CylinderGeometry(0.018, 0.018, 0.007, 12), toon(P.sopaCenoura), Math.cos(a) * d, 0.002, Math.sin(a) * d);
        m.rotation.set(r() * 0.4, 0, r() * 0.4);
      } else {
        const m = por(caldo, new RoundedBoxGeometry(0.024, 0.02, 0.024, 1, 0.005), toon(i % 4 ? P.sopaBatata : P.sopaAbobora), Math.cos(a) * d, 0.003, Math.sin(a) * d);
        m.rotation.set(r(), r() * 3, r());
      }
    }
    c.add(caldo);
    const vapor = vaporDePrato();
    vapor.name = 'vapor-da-sopita';
    vapor.position.y = S.boca - 0.08;
    c.add(vapor);
    g.add(c);
  }

  // o potinho de coentro picado, do lado do caldeirão (é dele que ela pega)
  {
    const pot = potinhoDeCoentroNoBalcao();
    pot.position.set(LB.coentro, TOPO, LB.tras);
    g.add(pot);
  }
  return fundir(g);
}

/**
 * A JANELA DE SERVIR da Lanchonete dos Gatitos — a cantina como as de
 * escola americana (pedido do Renan): a cozinha é um cômodo próprio, e a
 * Tia Liz serve por uma janela larga na parede da frente.
 *
 * A PEÇA é a parede da frente da cozinha e as duas paredes de volta até o
 * fundo: embaixo da janela, o azulejo da cantina com o rodapé; em volta, a
 * parede da escola; o VÃO largo com a moldura de inox; o PARAPEITO de inox
 * (por onde sai a bandeja) com a quina boleada e, na frente dele, o TRILHO
 * de bandeja em mãos-francesas. A placa da lanchonete vai na verga (a cena
 * põe).
 *
 * NADA PENDURADO NA FRENTE DO VÃO: a primeira versão tinha um toldinho
 * listrado em cima da janela, e com a câmera olhando de cima ele tapava o
 * rosto dela inteiro — o que sobra para fora acima do vão cobre exatamente
 * quem está lá dentro.
 *
 * A CONTA DA CÂMERA decide a altura do vão: a câmera olha em 34°, e quem
 * está 0,6 m atrás da parede aparece na janela 0,7 m mais alto do que está.
 * Com o vão até 2,85, os cachos dela (1,7) cabem inteiros; com a verga a
 * 2,55, a placa cortava o alto do cabelo.
 *
 * A origem é o chão no meio da parede da frente; a frente olha para `+Z` e
 * a cozinha fica no `-Z`, com `fundo` de profundidade.
 */
export const JANELA_DA_CANTINA = { largura: 10.4, vao: 7.8, peitoril: 0.9, verga: 2.85, alto: 3.5, espessura: 0.16 } as const;

export function janelaDaCantina(fundo = 2): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'janela-da-cantina';
  const J = JANELA_DA_CANTINA;
  const E = J.espessura;
  const inox = toon(P.churrascoInox);
  const inoxEscuro = toon(P.churrascoInoxEscuro);
  const parede = toon(P.escolaParede);
  const azulejo = texturaDoAzulejo();
  /*
   * As peças da frente ficam ENTRE as paredes de volta (que cobrem os cantos),
   * e nenhuma face encosta numa face do mesmo lado de outra: a faixa de cima
   * cobre o topo dos pilares e da verga, a moldura começa 1 cm para dentro
   * do vão. É o que o `scripts/zfighting.mjs` cobra.
   */
  const IW = J.largura / 2 - E;
  const FAIXA = 0.12;
  // embaixo da janela: o azulejo (o UV em metros, cada azulejo com 15 cm) e o rodapé
  const baixoGeo = new THREE.BoxGeometry(2 * IW, J.peitoril - 0.1, E);
  uvEmMetros(baixoGeo);
  por(g, baixoGeo, toon(0xffffff, { mapa: azulejo }), 0, 0.1 + (J.peitoril - 0.1) / 2, 0);
  por(g, new THREE.BoxGeometry(2 * IW, 0.1, E + 0.03), toon(P.escolaRodape), 0, 0.05, 0);
  // os dois pilares dos lados do vão, e a verga em cima (até a faixa)
  const lado = IW - J.vao / 2;
  const topo = J.alto - FAIXA;
  for (const s of [-1, 1]) {
    por(g, new THREE.BoxGeometry(lado, topo - J.peitoril, E), parede, s * (J.vao / 2 + lado / 2), J.peitoril + (topo - J.peitoril) / 2, 0);
  }
  por(g, new THREE.BoxGeometry(J.vao, topo - J.verga, E), parede, 0, J.verga + (topo - J.verga) / 2, 0);
  // a faixa azul da escola no alto da parede
  por(g, new THREE.BoxGeometry(2 * IW, FAIXA, E + 0.02), toon(P.escolaBarra), 0, J.alto - FAIXA / 2, 0);
  // a MOLDURA de inox do vão: os batentes e a verga, saindo um tico da parede
  const M = 0.07;
  for (const s of [-1, 1]) {
    por(g, new THREE.BoxGeometry(M, J.verga - J.peitoril + M, E + 0.04), inox, s * (J.vao / 2 + M / 2 - 0.012), (J.verga + J.peitoril) / 2, 0);
  }
  por(g, new THREE.BoxGeometry(J.vao + 2 * M, M, E + 0.05), inox, 0, J.verga + M / 2 - 0.012, 0);
  // o PARAPEITO: a chapa de inox por onde sai a bandeja, para fora da parede, com a quina boleada
  const PROF = 0.42;
  por(g, new THREE.BoxGeometry(J.vao + 2 * M - 0.03, 0.05, PROF - 0.01), inox, 0, J.peitoril + 0.029, PROF / 2 - E / 2 + 0.005);
  const quina = por(g, new THREE.CylinderGeometry(0.025, 0.025, J.vao + 2 * M - 0.03, 12), inox, 0, J.peitoril + 0.029, PROF - E / 2);
  quina.rotation.z = Math.PI / 2;
  // as mãos-francesas embaixo do parapeito
  for (const x of [-J.vao / 2 + 0.3, -J.vao / 6, J.vao / 6, J.vao / 2 - 0.3]) {
    const mao = new THREE.Shape();
    mao.moveTo(0, 0);
    mao.lineTo(0.3, 0);
    mao.lineTo(0, -0.24);
    mao.lineTo(0, 0);
    const geo = new THREE.ExtrudeGeometry(mao, { depth: 0.03, bevelEnabled: false });
    geo.rotateY(-Math.PI / 2);
    por(g, geo, inoxEscuro, x + 0.015, J.peitoril, E / 2);
  }
  // o TRILHO de bandeja: dois tubos na frente do parapeito, nas mãos-francesas
  for (let k = 0; k < 2; k++) {
    const z = PROF - E / 2 + 0.1 + k * 0.1;
    const t = por(g, new THREE.CylinderGeometry(0.016, 0.016, J.vao - 0.2, 8), inox, 0, J.peitoril - 0.04, z);
    t.rotation.z = Math.PI / 2;
  }
  for (const x of [-J.vao / 2 + 0.3, 0, J.vao / 2 - 0.3]) {
    por(g, new THREE.BoxGeometry(0.035, 0.035, 0.24), inoxEscuro, x, J.peitoril - 0.055, PROF - E / 2 + 0.1);
  }
  // as paredes de volta, da frente até o fundo da cozinha
  // (da face da frente até o fundo, cobrindo os cantos; um tico mais baixas
  // que a faixa da frente, para os topos não ficarem no mesmo plano)
  const prof = fundo + E / 2;
  const zMeio = E / 2 - prof / 2;
  for (const s of [-1, 1]) {
    const x = s * (J.largura / 2 - E / 2);
    por(g, new THREE.BoxGeometry(E, J.alto - FAIXA, prof), parede, x, (J.alto - FAIXA) / 2, zMeio);
    por(g, new THREE.BoxGeometry(E, FAIXA - 0.004, prof), toon(P.escolaBarra), x, J.alto - FAIXA + (FAIXA - 0.004) / 2, zMeio);
    por(g, new THREE.BoxGeometry(E + 0.03, 0.094, prof - 0.02), toon(P.escolaRodape), x, 0.049, zMeio + 0.004);
  }
  return fundir(g);
}
