import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { fundir } from './fundir';
import { uvEmMetros } from './acabamento';
import { vaporDePrato } from './moveisDoMania';

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
function texturaDoFororo(): THREE.CanvasTexture {
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
function texturaDoChantilly(): THREE.CanvasTexture {
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
function texturaDoPaoDeLo(): THREE.CanvasTexture {
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
function tigela(raio = 0.115, alto = 0.075): THREE.Group {
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
function pratoRaso(raio = 0.16): THREE.Group {
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
  por(comida, disco(0.104, 32), toon(0xffffff, { mapa: texturaDoCaldo() }));
  const r = sorteio(11);
  // as rodelas de cenoura, os cubinhos de batata e de abóbora, meio afundados
  for (let i = 0; i < 6; i++) {
    const a = r() * Math.PI * 2;
    const d = 0.025 + r() * 0.06;
    const m = por(comida, new THREE.CylinderGeometry(0.014, 0.014, 0.006, 12), toon(P.sopaCenoura), Math.cos(a) * d, 0.0015, Math.sin(a) * d);
    m.rotation.set((r() - 0.5) * 0.4, 0, (r() - 0.5) * 0.4);
  }
  for (let i = 0; i < 7; i++) {
    const a = r() * Math.PI * 2;
    const d = 0.02 + r() * 0.065;
    const cubo = new RoundedBoxGeometry(0.018, 0.016, 0.018, 1, 0.004);
    const m = por(comida, cubo, toon(i % 2 ? P.sopaBatata : P.sopaAbobora), Math.cos(a) * d, 0.002, Math.sin(a) * d);
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
  comida.add(milho);
  // as folhinhas de coentro picado por cima
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.09;
    const folha = por(comida, new THREE.CircleGeometry(0.006, 5).rotateX(-Math.PI / 2), toon(P.sopaCoentro, { doubleSide: true }), Math.cos(a) * d, 0.004, Math.sin(a) * d);
    folha.rotation.y = r() * 3;
  }
  g.add(comida);
  const c = colher(0.14);
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
  for (let f = 0; f < 7; f++) {
    const pontos: Ponto3[] = [];
    const a0 = r() * Math.PI * 2;
    for (let k = 0; k <= 46; k++) {
      const t = k / 46;
      const a = a0 + t * Math.PI * 4.6;
      const d = 0.018 + t * 0.085 + Math.sin(t * 19 + f) * 0.006;
      pontos.push([Math.cos(a) * d, altura(d) + Math.sin(t * 13 + f * 2) * 0.004 + f * 0.0012, Math.sin(a) * d]);
    }
    por(comida, tubo(pontos, 0.0042, 110, 5), massa);
  }
  // o molho: uma poça gordinha por cima do ninho, que escorre um pouco
  const molho = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDoMolho() }));
  molho.scale.set(0.062, 0.02, 0.058);
  molho.position.y = 0.054;
  comida.add(molho);
  for (const [a, d] of [[0.5, 0.06], [2.4, 0.058], [4.2, 0.063]] as const) {
    const pingo = por(comida, new THREE.SphereGeometry(1, 10, 6), toon(P.molhoDeTomate), Math.cos(a) * d, 0.046, Math.sin(a) * d);
    pingo.scale.set(0.018, 0.012, 0.022);
    pingo.rotation.y = -a;
  }
  // as almôndegas: icosaedro (o facetado lê como carne moída) e o molho em cima
  for (const [a, d] of [[0.3, 0.032], [2.4, 0.034], [4.4, 0.03]] as const) {
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    por(comida, new THREE.IcosahedronGeometry(0.026, 1), toon(P.almondega), x, 0.08, z);
    const capa = por(comida, new THREE.SphereGeometry(0.02, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.molhoDeTomate), x, 0.09, z);
    capa.scale.set(1, 0.6, 1);
  }
  // o queijo ralado e o manjericão
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.05;
    const q = por(comida, new THREE.BoxGeometry(0.008, 0.0025, 0.0035), toon(P.queijoRalado), Math.cos(a) * d, 0.1 + r() * 0.008, Math.sin(a) * d);
    q.rotation.set(r(), r() * 3, r());
  }
  for (const giro of [0.4, -0.8]) {
    const folha = new THREE.Mesh(new THREE.CircleGeometry(0.018, 10), toon(P.manjericao, { doubleSide: true }));
    folha.scale.set(0.55, 1, 1);
    folha.position.set(0.006, 0.108, -0.004);
    folha.rotation.set(-Math.PI / 2 + 0.35, 0, giro);
    comida.add(folha);
  }
  g.add(comida);
  const gf = garfo();
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
  por(comida, disco(R * 0.9, 30), toon(0xffffff, { mapa: texturaDoFororo() }));
  // o creme sobe um pouquinho no meio (um domo baixinho por baixo do disco)
  const r = sorteio(37);
  for (let i = 0; i < 12; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 0.03;
    const t = por(comida, new THREE.IcosahedronGeometry(0.0045 + r() * 0.003, 0), toon(P.fororoTostado), Math.cos(a) * d, 0.003, Math.sin(a) * d);
    t.rotation.set(r() * 3, r() * 3, 0);
  }
  g.add(comida);
  const c = colher(0.12);
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
  arroz.position.set(-0.05, 0, -0.045);
  comida.add(arroz);
  const r = sorteio(41);
  // o feijão: o monte (com a textura) e uns grãos soltos por cima
  const monte = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDoFeijao() }),
  );
  monte.scale.set(0.055, 0.022, 0.048);
  monte.position.set(0.058, 0, -0.05);
  comida.add(monte);
  for (let i = 0; i < 18; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.04;
    const y = 0.022 * Math.sqrt(Math.max(0, 1 - (d / 0.05) ** 2));
    const grao = por(comida, new THREE.SphereGeometry(1, 8, 6), toon(P.feijaoPreto), 0.058 + Math.cos(a) * d, y, -0.05 + Math.sin(a) * d * 0.9);
    grao.scale.set(0.0085, 0.0055, 0.0055);
    grao.rotation.y = r() * 3;
  }
  // a carne desfiada: o montinho com o fiapo desenhado, e fiapos soltos por cima
  const carne = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDaCarne() }),
  );
  carne.scale.set(0.058, 0.026, 0.045);
  carne.position.set(0.04, 0, 0.06);
  comida.add(carne);
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.036;
    const x = 0.04 + Math.cos(a) * d;
    const z = 0.06 + Math.sin(a) * d * 0.8;
    const y = 0.026 * Math.sqrt(Math.max(0, 1 - (d / 0.045) ** 2));
    const giro = r() * Math.PI;
    const l = 0.022 + r() * 0.02;
    const fiapo = por(comida, tubo([
      [-Math.cos(giro) * l, 0, -Math.sin(giro) * l],
      [(r() - 0.5) * 0.008, 0.003, (r() - 0.5) * 0.008],
      [Math.cos(giro) * l, 0, Math.sin(giro) * l],
    ], 0.0028 + r() * 0.0015, 8, 4), toon(i % 3 === 0 ? P.carneMechadaLuz : P.carneMechada), x, y, z);
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
    const t = por(comida, geo, toon(P.tajada), x, 0.004 + i * 0.006, z);
    t.rotation.y = giro;
    const borda = por(comida, tubo([[-0.05, 0.012, -0.003], [0, 0.012, -0.03], [0.05, 0.012, -0.003]], 0.0035, 14, 4), toon(P.tajadaTostada), x, 0.004 + i * 0.006, z);
    borda.rotation.y = giro;
  }
  g.add(comida);
  const gf = garfo();
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
  por(comida, new THREE.ShapeGeometry(poca, 2).rotateX(-Math.PI / 2), toon(P.tresLechesLeite), 0, 0.0025, 0);
  // o bolo
  const L = 0.1;
  const ALTO = 0.05;
  const massa = new THREE.Mesh(new RoundedBoxGeometry(L, ALTO, L, 2, 0.006), toon(0xffffff, { mapa: texturaDoPaoDeLo() }));
  massa.position.y = ALTO / 2 + 0.003;
  comida.add(massa);
  const cobertura = new THREE.Mesh(new RoundedBoxGeometry(L + 0.004, 0.02, L + 0.004, 2, 0.008), toon(P.tresLechesChantilly));
  cobertura.position.y = ALTO + 0.011;
  comida.add(cobertura);
  por(comida, new THREE.PlaneGeometry(L - 0.006, L - 0.006).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: texturaDoChantilly() }), 0, ALTO + 0.0212, 0);
  // os morangos: meia esfera vermelha, e a face cortada (o disco rosa com o miolo)
  for (const [x, z, giro] of [[-0.022, -0.018, 0.4], [0.024, 0.012, -0.6], [-0.012, 0.028, 2.2]] as const) {
    const m = new THREE.Group();
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
export function bandejaComPrato(id: PratoDaLiz): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bandeja-da-cantina';
  const bandeja = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.022, 0.34, 2, 0.008), toon(P.refeitorioBandeja));
  bandeja.position.y = 0.011;
  g.add(bandeja);
  const prato = pratoDaTiaLiz(id);
  prato.position.set(-0.04, 0.022, 0);
  g.add(prato);
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

// ================================================================= o balcão

/**
 * O BALCÃO DA CANTINA: o corpo de azulejo (a florzinha azul de miolo
 * amarelo), o rodapé, o tampo de inox com a quina boleada, o trilho de
 * bandeja na frente e, em cima, a comida da Tia Liz exposta:
 *
 *  - as CUBAS ABERTAS de inox (quatro paredes, a comida um tico abaixo da
 *    boca): o arroz, o feijão preto, a carne desfiada, as tajadas e a pasta
 *    com almôndegas;
 *  - o CALDEIRÃO DA SOPITA embutido no tampo, de boca a 1 m, com as alças e
 *    o vapor (`vapor-da-sopita`, que a cena anima) — é onde ela mexe;
 *  - a PANELINHA DO FORORO com as canecas de faixa azul do lado;
 *  - o REFRATÁRIO da tres leches, cortada em quadrados (um já foi);
 *  - a pilha de pratos, de tigelas e de bandejas, e o vasinho de coentro.
 *
 * A frente olha para `+Z`. `SOPA_NO_BALCAO` diz onde fica o caldeirão (a
 * cena põe a Tia Liz atrás dele).
 */
export const SOPA_NO_BALCAO = { x: 0, z: -0.24, boca: 1.01 } as const;

export function balcaoDaCantina(largura = 8): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balcao-da-cantina';
  const F = 0.85;
  const inox = toon(P.churrascoInox);
  const inoxEscuro = toon(P.churrascoInoxEscuro);

  // o corpo de azulejo, e o rodapé escuro recuado
  const corpoGeo = new THREE.BoxGeometry(largura, 0.78, F);
  uvEmMetros(corpoGeo);
  // a textura tem 2 × 2 azulejos: com o UV em metros, cada um sai com 15 cm
  const azulejo = texturaDoAzulejo();
  azulejo.repeat.set(1 / 0.3, 1 / 0.3);
  por(g, corpoGeo, toon(0xffffff, { mapa: azulejo }), 0, 0.49, 0);
  por(g, new THREE.BoxGeometry(largura - 0.04, 0.1, F - 0.06), toon(P.escolaParedeAzul), 0, 0.05, 0);
  // o tampo de inox, mais largo que o corpo, com a quina da frente boleada
  por(g, new THREE.BoxGeometry(largura + 0.06, 0.05, F + 0.04), inox, 0, 0.905, -0.01);
  const quina = por(g, new THREE.CylinderGeometry(0.025, 0.025, largura + 0.06, 12), inox, 0, 0.905, F / 2 + 0.01);
  quina.rotation.z = Math.PI / 2;

  // o trilho de bandeja: três tubos na frente, em mãos-francesas
  for (let k = 0; k < 3; k++) {
    const tubo3 = por(g, new THREE.CylinderGeometry(0.016, 0.016, largura - 0.3, 8), inox, 0, 0.84, F / 2 + 0.12 + k * 0.1);
    tubo3.rotation.z = Math.PI / 2;
  }
  for (const x of [-largura / 2 + 0.3, -largura / 6, largura / 6, largura / 2 - 0.3]) {
    por(g, new THREE.BoxGeometry(0.04, 0.04, 0.34), inoxEscuro, x, 0.82, F / 2 + 0.17);
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
    por(c, new THREE.BoxGeometry(L, 0.012, P0), inoxEscuro, 0, 0.006, 0);
    por(c, new THREE.BoxGeometry(L, A, e), inox, 0, A / 2, P0 / 2 - e / 2);
    por(c, new THREE.BoxGeometry(L, A, e), inox, 0, A / 2, -P0 / 2 + e / 2);
    por(c, new THREE.BoxGeometry(e, A, P0 - 2 * e), inox, L / 2 - e / 2, A / 2, 0);
    por(c, new THREE.BoxGeometry(e, A, P0 - 2 * e), inox, -L / 2 + e / 2, A / 2, 0);
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
  cuba(-2.26, (d) => {
    superficie(d, texturaDoArroz(), 1.6);
    const monte = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, { mapa: texturaDoArroz() }));
    monte.scale.set(0.17, 0.035, 0.13);
    d.add(monte);
  });
  // o FEIJÃO, com uns grãos por cima
  cuba(-1.68, (d) => {
    superficie(d, texturaDoFeijao(), 1.4);
    for (let i = 0; i < 26; i++) {
      const grao = por(d, new THREE.SphereGeometry(1, 8, 6), toon(P.feijaoPreto), (r() - 0.5) * 0.4, 0.004, (r() - 0.5) * 0.32);
      grao.scale.set(0.0095, 0.006, 0.006);
      grao.rotation.y = r() * 3;
    }
  });
  // a CARNE DESFIADA, com os fiapos soltos
  cuba(-1.1, (d) => {
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
  cuba(-0.52, (d) => {
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
  cuba(0.52, (d) => {
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

  // a PANELINHA DO FORORO, com as canecas viradas na frente
  {
    const x = 1.18;
    const c = new THREE.Group();
    c.position.set(x, TOPO, -0.18);
    por(c, torneado([[0.0001, 0], [0.11, 0], [0.12, 0.012], [0.122, 0.13], [0.114, 0.132], [0.112, 0.02], [0.0001, 0.018]], 28), inox);
    por(c, disco(0.112, 28), toon(0xffffff, { mapa: texturaDoFororo() }), 0, 0.115, 0);
    const cabo = por(c, new THREE.CylinderGeometry(0.012, 0.014, 0.18, 8), toon(P.caboDeMadeira), 0, 0.12, 0.2);
    cabo.rotation.x = Math.PI / 2;
    g.add(c);
    for (let i = 0; i < 3; i++) {
      const caneca = new THREE.Group();
      caneca.position.set(x - 0.12 + i * 0.12, TOPO, 0.2);
      por(caneca, torneado([[0.0001, 0], [0.045, 0], [0.05, 0.09], [0.044, 0.091], [0.0001, 0.02]], 22), toon(P.canecaDoFororo));
      por(caneca, new THREE.CylinderGeometry(0.0505, 0.0498, 0.011, 22, 1, true), toon(P.canecaDoFororoFaixa, { doubleSide: true }), 0, 0.072, 0);
      const alca = por(caneca, new THREE.TorusGeometry(0.02, 0.006, 6, 12, Math.PI * 1.2), toon(P.canecaDoFororo), 0.052, 0.048, 0);
      alca.rotation.z = -Math.PI * 0.6;
      caneca.rotation.y = 0.4 + i * 0.3;
      g.add(caneca);
    }
  }

  // o REFRATÁRIO DA TRES LECHES, cortado em quadradinhos (um já foi servido)
  {
    const c = new THREE.Group();
    c.position.set(1.98, TOPO, -0.05);
    const L = 0.6;
    const P0 = 0.4;
    por(c, new RoundedBoxGeometry(L, 0.07, P0, 2, 0.02), toon(P.loucaCreme), 0, 0.035, 0);
    const n = 5;
    const m = 3;
    const lado = (L - 0.05) / n;
    const fundo = (P0 - 0.05) / m;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (i === n - 1 && j === m - 1) continue; // o pedaço que já foi
        const x = -L / 2 + 0.025 + lado * (i + 0.5);
        const z = -P0 / 2 + 0.025 + fundo * (j + 0.5);
        por(c, new RoundedBoxGeometry(lado - 0.006, 0.05, fundo - 0.006, 1, 0.004), toon(0xffffff, { mapa: texturaDoPaoDeLo() }), x, 0.06, z);
        por(c, new RoundedBoxGeometry(lado - 0.004, 0.016, fundo - 0.004, 1, 0.006), toon(P.tresLechesChantilly), x, 0.092, z);
        por(c, new THREE.PlaneGeometry(lado - 0.012, fundo - 0.012).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: texturaDoChantilly() }), x, 0.1005, z);
        const morango = por(c, new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.morangoFruta), x, 0.1, z);
        morango.scale.set(0.016, 0.014, 0.012);
      }
    }
    // o fundo onde estava o pedaço servido: a poça de leite
    por(c, new THREE.PlaneGeometry(lado - 0.006, fundo - 0.006).rotateX(-Math.PI / 2), toon(P.tresLechesLeite),
      -L / 2 + 0.025 + lado * (n - 0.5), 0.042, -P0 / 2 + 0.025 + fundo * (m - 0.5));
    g.add(c);
  }

  // a pilha de pratos, a de tigelas e a de bandejas; e o vasinho de coentro
  for (let k = 0; k < 6; k++) {
    const p = pratoRaso(0.13);
    p.position.set(2.72, TOPO + k * 0.018, 0.05);
    g.add(p);
  }
  for (let k = 0; k < 4; k++) {
    const t = tigela(0.1, 0.06);
    t.position.set(2.72, TOPO + k * 0.03, -0.25);
    g.add(t);
  }
  for (let k = 0; k < 6; k++) {
    por(g, new RoundedBoxGeometry(0.46, 0.02, 0.34, 1, 0.006), toon(P.refeitorioBandeja), largura / 2 - 0.42, TOPO + 0.012 + k * 0.024, 0.08);
  }
  {
    const vaso = new THREE.Group();
    vaso.position.set(-largura / 2 + 0.35, TOPO, -0.2);
    por(vaso, torneado([[0.0001, 0], [0.05, 0], [0.065, 0.1], [0.07, 0.11], [0.06, 0.11], [0.0001, 0.09]], 18), toon(P.sopaAbobora));
    const folha = toon(P.sopaCoentro, { doubleSide: true });
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const haste = por(vaso, new THREE.CylinderGeometry(0.0025, 0.0025, 0.12, 4), folha, Math.cos(a) * 0.02, 0.16, Math.sin(a) * 0.02);
      haste.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35);
      const f = por(vaso, new THREE.CircleGeometry(0.022, 7), folha, Math.cos(a) * 0.05, 0.215 + (i % 3) * 0.015, Math.sin(a) * 0.05);
      f.rotation.set(-Math.PI / 2 + 0.6, a, 0);
    }
    g.add(vaso);
  }
  return fundir(g);
}
