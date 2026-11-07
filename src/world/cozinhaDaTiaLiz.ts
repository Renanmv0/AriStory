import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { fundir } from './fundir';
import { tigela, texturaDoFororo, texturaDoChantilly, texturaDoPaoDeLo } from './cantinaDaTiaLiz';

/**
 * ================================================ A COZINHA DA TIA LIZ
 *
 * O que ela usa na cozinha da Lanchonete dos Gatitos (pedido do Renan: ela
 * anda pela cozinha, cozinha no fogão, corta legumes numa tabuazinha, e cada
 * prato pedido tem a sua preparação). Três famílias de peça:
 *
 *  1. os MÓVEIS, parados e juntados (`fogaoDaLiz`, `bancadaDePreparo`);
 *  2. as coisas que ELA PEGA — cada uma com a ORIGEM NA PEGA (o cabo, a alça,
 *     a beira), porque é a origem que vai para a pata dela (`TiaLiz.segurar`).
 *     A orientação é a do corpo dela: `+Z` para a frente, `+Y` para cima. A
 *     faca nasce de lâmina para a frente; a colher de pau, de pá para baixo;
 *  3. as que MUDAM enquanto ela trabalha (`TabuaDeCorte`, `refratarioDaTresLeches`,
 *     a frigideira com o que frita, o fio de líquido e os farelos).
 *
 * As partes que a cena acende, apaga, encolhe ou leva embora têm NOME (a
 * `fundir` junta por dentro e deixa o grupo vivo).
 */

// ============================================================== ferramentas

type Ponto3 = readonly [number, number, number];

function por(
  pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

/** perfil torneado `[raio, altura]` de baixo para cima (a face sai para fora) */
function torneado(perfil: ReadonlyArray<readonly [number, number]>, segs = 24): THREE.LatheGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), segs);
}

function tubo(pontos: ReadonlyArray<Ponto3>, raio: number, segs = 16, radial = 6): THREE.TubeGeometry {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p))), segs, raio, radial, false);
}

function macia(l: number, a: number, p: number, r = 0.012): THREE.BufferGeometry {
  return new RoundedBoxGeometry(l, a, p, 2, Math.min(r, l / 2 - 0.0005, a / 2 - 0.0005, p / 2 - 0.0005));
}

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

const texturas = new Map<string, THREE.CanvasTexture>();
function textura(chave: string, l: number, a: number, pintar: (c: CanvasRenderingContext2D, l: number, a: number) => void): THREE.CanvasTexture {
  let t = texturas.get(chave);
  if (t) return t;
  const tela = document.createElement('canvas');
  tela.width = l;
  tela.height = a;
  const c = tela.getContext('2d');
  if (c) pintar(c, l, a);
  t = new THREE.CanvasTexture(tela);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  texturas.set(chave, t);
  return t;
}

/** a tábua de corte: madeira clara com o veio, as marcas de faca e a manchinha de cenoura */
function texturaDaTabua(): THREE.CanvasTexture {
  return textura('liz-tabua', 256, 160, (c, l, a) => {
    c.fillStyle = css(P.tabuaDeCorte);
    c.fillRect(0, 0, l, a);
    for (let i = 0; i < 26; i++) {
      c.strokeStyle = `rgba(150,100,50,${0.12 + (i % 3) * 0.06})`;
      c.lineWidth = 1 + (i % 2);
      c.beginPath();
      const y = (i / 26) * a + Math.sin(i * 1.7) * 3;
      c.moveTo(0, y);
      for (let x = 0; x <= l; x += 16) c.lineTo(x, y + Math.sin(x * 0.03 + i) * 2.5);
      c.stroke();
    }
    // as marcas de faca, curtinhas e cruzadas, no meio
    c.strokeStyle = 'rgba(120,80,40,0.25)';
    c.lineWidth = 1;
    for (let i = 0; i < 30; i++) {
      const x = l * 0.3 + ((i * 37) % (l * 0.4));
      const y = a * 0.25 + ((i * 53) % (a * 0.5));
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 10 + (i % 4) * 3, y + (i % 2 ? 3 : -3));
      c.stroke();
    }
    c.fillStyle = 'rgba(240,138,44,0.18)';
    c.beginPath();
    c.ellipse(l * 0.68, a * 0.55, 14, 8, 0.3, 0, Math.PI * 2);
    c.fill();
  });
}

// ================================================================ o fogão

/**
 * O FOGÃO DA LIZ: quatro bocas, de ESMALTE CREME com o cromado — fogão de
 * casa, retrô, e não o industrial do Mania. A cena o põe na fila da janela
 * GIRADO meia volta: os botões e o forno ficam para ela (`+Z` da peça), e as
 * bocas aparecem pela janela sem espelho nenhum na frente delas.
 *
 * As chamas são grupos com nome (`chama-0` a `chama-3`): a cena acende a
 * boca que tem panela e faz tremer. `FOGAO_DA_LIZ.bocas` diz onde cada boca
 * fica (as duas primeiras, do lado dos botões, são as de perto dela).
 */
export const FOGAO_DA_LIZ = {
  largura: 1.0,
  fundo: 0.8,
  topo: 0.925,
  /** a altura em que a panela pousa (em cima da trempe) */
  trempe: 0.99,
  bocas: [[-0.24, 0.19], [0.24, 0.19], [-0.24, -0.19], [0.24, -0.19]] as ReadonlyArray<readonly [number, number]>,
} as const;

export function fogaoDaLiz(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'fogao-da-liz';
  const F = FOGAO_DA_LIZ;
  const esmalte = toon(P.fogaoDaLiz);
  const frente = toon(P.fogaoDaLizFrente);
  const cromo = toon(P.churrascoInox);
  const ferro = toon(P.fogaoDaLizTrempe);
  // o corpo, o rodapé recuado e a mesa de cima um tico maior
  por(g, macia(F.largura, 0.8, F.fundo, 0.03), esmalte, 0, 0.48, 0);
  por(g, new THREE.BoxGeometry(F.largura - 0.08, 0.08, F.fundo - 0.1), ferro, 0, 0.04, -0.02);
  por(g, macia(F.largura + 0.03, 0.04, F.fundo + 0.02, 0.012), esmalte, 0, F.topo - 0.02, 0);
  // a faixa dos botões (do lado dela) com quatro botões cromados e a luz-piloto
  por(g, macia(F.largura - 0.06, 0.11, 0.03, 0.012), frente, 0, 0.8, F.fundo / 2 + 0.006);
  for (let i = 0; i < 4; i++) {
    const x = -0.33 + i * 0.22;
    const b = por(g, torneado([[0.001, 0], [0.028, 0], [0.03, 0.012], [0.024, 0.03], [0.001, 0.032]], 14), cromo, x, 0.8, F.fundo / 2 + 0.02);
    b.rotation.x = Math.PI / 2;
  }
  por(g, new THREE.SphereGeometry(0.009, 8, 6), toon(P.fogaoDaLizForno, { glow: 0.8 }), 0.44, 0.8, F.fundo / 2 + 0.024);
  // a porta do forno: almofada, o vidro aceso e o puxador de tubo
  por(g, macia(F.largura - 0.12, 0.5, 0.035, 0.02), frente, 0, 0.42, F.fundo / 2 + 0.01);
  por(g, macia(F.largura - 0.36, 0.2, 0.01, 0.008), toon(P.fogaoDaLizForno, { glow: 0.35 }), 0, 0.44, F.fundo / 2 + 0.029);
  por(g, tubo([[-0.32, 0, 0], [-0.3, 0, 0.035], [0.3, 0, 0.035], [0.32, 0, 0]], 0.011, 20, 6), cromo, 0, 0.62, F.fundo / 2 + 0.02);
  // as bocas: a bacia, a coroa, a trempe e a chama (grupo com nome)
  const chamaMat = toon(P.churrascoChamaDeGas, { glow: 0.9 });
  const lingua = new THREE.ConeGeometry(0.011, 0.035, 5);
  F.bocas.forEach(([x, z], i) => {
    por(g, new THREE.CylinderGeometry(0.13, 0.13, 0.01, 22), ferro, x, F.topo + 0.004, z);
    por(g, new THREE.CylinderGeometry(0.06, 0.068, 0.022, 16), cromo, x, F.topo + 0.018, z);
    por(g, new THREE.CylinderGeometry(0.04, 0.045, 0.01, 14), ferro, x, F.topo + 0.033, z);
    // a trempe: dois arcos cruzados de ferro, com os dedos
    for (const giro of [0, Math.PI / 2]) {
      const arco = por(g, tubo([[-0.12, 0, 0], [-0.11, 0.05, 0], [0.11, 0.05, 0], [0.12, 0, 0]], 0.008, 14, 5), ferro, x, F.topo + 0.01, z);
      arco.rotation.y = giro;
    }
    const chama = new THREE.Group();
    chama.name = `chama-${i}`;
    chama.position.set(x, F.topo + 0.03, z);
    por(chama, new THREE.TorusGeometry(0.066, 0.008, 5, 22).rotateX(Math.PI / 2), chamaMat);
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const l = por(chama, lingua, chamaMat, Math.cos(a) * 0.072, 0.014, Math.sin(a) * 0.072);
      l.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    }
    chama.visible = false;
    g.add(chama);
  });
  return fundir(g);
}

/**
 * Acende ou apaga a boca `i` do fogão (a peça já no mundo) e faz a chama
 * tremer: a cena chama a cada quadro com o relógio.
 */
export function chamaDoFogao(fogao: THREE.Object3D, i: number, acesa: boolean, tempo: number): void {
  const c = fogao.getObjectByName(`chama-${i}`);
  if (!c) return;
  c.visible = acesa;
  if (acesa) {
    const s = 1 + Math.sin(tempo * 23 + i * 2) * 0.08 + Math.sin(tempo * 37 + i) * 0.05;
    c.scale.set(1, s, 1);
  }
}

// ========================================================= o que vai ao fogo

/**
 * A FRIGIDEIRA de ferro, com cabo de madeira. A ORIGEM é a pega do cabo; a
 * panela fica 30 cm à frente (`+Z`) e 3,5 cm abaixo. Dentro dela, o que frita
 * em cada preparo, em grupos com nome que a cena mostra um de cada vez:
 *
 *  - `refogado`: rodelas de cenoura e anéis de pimentão (o fogo de sempre);
 *  - `molho`: o molho de tomate e as três almôndegas (`almondega-0..2`, cada
 *    uma num grupo, que pulam quando ela sacode e caem no prato);
 *  - `tajadas`: as três fatias de banana-da-terra (`tajada-0..2`), cada uma
 *    com a face `crua` e a `dourada` — virar troca uma pela outra.
 */
export const FRIGIDEIRA = { centro: new THREE.Vector3(0, -0.035, 0.3), raio: 0.14 } as const;

export function frigideira(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'frigideira';
  const ferro = toon(P.frigideiraDeFerro);
  const C = FRIGIDEIRA.centro;
  const panela = new THREE.Group();
  panela.position.copy(C);
  por(panela, torneado([[0.001, 0], [0.11, 0], [0.13, 0.025], [0.142, 0.045], [0.146, 0.05], [0.138, 0.05], [0.124, 0.03], [0.105, 0.008], [0.001, 0.008]], 28), ferro);
  g.add(panela);
  // o cabo: a haste de ferro saindo da beira e o cabo de madeira com o furinho
  por(g, tubo([[0, -0.012, C.z - 0.14], [0, -0.006, C.z - 0.18], [0, 0, 0.07]], 0.009, 10, 6), ferro);
  const cabo = por(g, new THREE.CapsuleGeometry(0.014, 0.12, 4, 8), toon(P.caboDeMadeira), 0, 0.002, 0.0);
  cabo.rotation.x = Math.PI / 2;
  por(g, new THREE.TorusGeometry(0.007, 0.0025, 5, 10), ferro, 0, 0.004, -0.058).rotation.y = Math.PI / 2;

  // o refogado: rodelas e anéis espalhados no fundo
  const refogado = new THREE.Group();
  refogado.name = 'refogado';
  refogado.position.copy(C).y += 0.012;
  const cenoura = toon(P.sopaCenoura);
  const pimentao = toon(P.pimentaoVermelho);
  for (let i = 0; i < 11; i++) {
    const a = i * 2.39;
    const d = 0.025 + (i % 4) * 0.022;
    if (i % 3 === 2) {
      const anel = por(refogado, new THREE.TorusGeometry(0.016, 0.005, 5, 12), pimentao, Math.cos(a) * d, 0.004, Math.sin(a) * d);
      anel.rotation.x = Math.PI / 2 + (i % 2) * 0.2;
    } else {
      const r = por(refogado, new THREE.CylinderGeometry(0.014, 0.014, 0.006, 12), cenoura, Math.cos(a) * d, 0.003, Math.sin(a) * d);
      r.rotation.z = (i % 2) * 0.2;
    }
  }
  g.add(refogado);

  // o molho com as almôndegas
  const molho = new THREE.Group();
  molho.name = 'molho';
  molho.position.copy(C).y += 0.012;
  por(molho, new THREE.CircleGeometry(0.118, 26).rotateX(-Math.PI / 2), toon(P.molhoDeTomate));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const bola = new THREE.Group();
    bola.name = `almondega-${i}`;
    bola.position.set(Math.cos(a) * 0.055, 0.02, Math.sin(a) * 0.055);
    por(bola, new THREE.IcosahedronGeometry(0.024, 1), toon(P.almondega));
    const capa = por(bola, new THREE.SphereGeometry(0.019, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.molhoDeTomate), 0, 0.008, 0);
    capa.scale.set(1, 0.6, 1);
    molho.add(bola);
  }
  molho.visible = false;
  g.add(molho);

  // as tajadas: a fatia em meia-lua, crua (clara) e dourada (virada)
  const tajadas = new THREE.Group();
  tajadas.name = 'tajadas';
  tajadas.position.copy(C).y += 0.012;
  const fatia = new THREE.Shape();
  fatia.moveTo(-0.055, 0);
  fatia.quadraticCurveTo(0, 0.034, 0.055, 0);
  fatia.quadraticCurveTo(0, 0.016, -0.055, 0);
  const geo = new THREE.ExtrudeGeometry(fatia, { depth: 0.009, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 10 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -0.012);
  for (let i = 0; i < 3; i++) {
    const t = new THREE.Group();
    t.name = `tajada-${i}`;
    t.position.set(-0.05 + i * 0.05, 0.004, -0.03 + (i % 2) * 0.05);
    t.rotation.y = 1.2 + i * 0.25;
    const crua = por(t, geo, toon(P.sopaBatata));
    crua.name = 'crua';
    const dourada = por(t, geo, toon(P.tajada));
    dourada.name = 'dourada';
    dourada.visible = false;
    tajadas.add(t);
  }
  tajadas.visible = false;
  g.add(tajadas);
  return g;
}

/** mostra só o que está fritando na frigideira (`null`: vazia) */
export function naFrigideira(f: THREE.Object3D, o: 'refogado' | 'molho' | 'tajadas' | null): void {
  for (const nome of ['refogado', 'molho', 'tajadas'] as const) {
    const g = f.getObjectByName(nome);
    if (g) g.visible = nome === o;
  }
}

/**
 * A PANELINHA DO FORORO: esmalte vermelho com a borda creme, a origem na pega
 * do cabo e a panela 25 cm à frente. O creme (`creme`) é o disco com a canela
 * e a voltinha de colher, que gira quando ela mexe.
 */
export const PANELINHA = { centro: new THREE.Vector3(0, -0.03, 0.25), raio: 0.1, boca: 0.115 } as const;

export function panelinhaDoFororo(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'panelinha-do-fororo';
  const C = PANELINHA.centro;
  const corpo = new THREE.Group();
  corpo.position.copy(C);
  const esmalte = toon(P.panelinhaDeEsmalte);
  por(corpo, torneado([[0.001, 0], [0.09, 0], [0.1, 0.012], [0.102, 0.11], [0.108, 0.118], [0.1, 0.12], [0.094, 0.11], [0.092, 0.014], [0.001, 0.012]], 26), esmalte);
  por(corpo, new THREE.TorusGeometry(0.104, 0.005, 5, 26).rotateX(Math.PI / 2), toon(P.loucaCreme), 0, 0.118, 0);
  const creme = por(corpo, new THREE.CircleGeometry(0.092, 26).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: texturaDoFororo() }), 0, 0.085, 0);
  creme.name = 'creme';
  g.add(corpo);
  por(g, tubo([[0, 0.04, C.z - 0.1], [0, 0.03, C.z - 0.15], [0, 0, 0.04]], 0.009, 10, 6), esmalte);
  const cabo = por(g, new THREE.CapsuleGeometry(0.013, 0.1, 4, 8), toon(P.caboDeMadeira), 0, 0, 0);
  cabo.rotation.x = Math.PI / 2;
  return g;
}

/** o panelão de feijão no fogo, de tampa: só enfeite (é o que se vê pela janela) */
export function panelaoDeFeijao(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'panelao';
  por(g, torneado([[0.001, 0], [0.13, 0], [0.14, 0.012], [0.14, 0.2], [0.146, 0.206], [0.146, 0.212], [0.001, 0.212]], 26), toon(P.churrascoInoxEscuro));
  por(g, torneado([[0.001, 0.04], [0.06, 0.035], [0.12, 0.014], [0.15, 0.004], [0.15, 0], [0.001, 0]], 26), toon(P.churrascoInox), 0, 0.212, 0);
  por(g, new THREE.SphereGeometry(0.02, 10, 8), toon(P.fogaoDaLizTrempe), 0, 0.262, 0);
  for (const s of [-1, 1]) {
    const alca = por(g, new THREE.TorusGeometry(0.026, 0.006, 5, 10, Math.PI), toon(P.churrascoInoxEscuro), s * 0.152, 0.17, 0);
    alca.rotation.set(Math.PI / 2, s > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
  }
  return g;
}

// ============================================================ os utensílios

/** A FACA: cabo de madeira com dois rebites, a lâmina para a frente e o fio para baixo */
export function faca(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'faca';
  por(g, macia(0.022, 0.03, 0.1, 0.01), toon(P.caboDeMadeira), 0, 0, -0.035);
  for (const z of [-0.06, -0.015]) por(g, new THREE.CylinderGeometry(0.004, 0.004, 0.024, 6).rotateZ(Math.PI / 2), toon(P.churrascoInox), 0, 0, z);
  const lamina = new THREE.Shape();
  lamina.moveTo(0, 0.012);
  lamina.lineTo(0.16, 0.012);
  lamina.quadraticCurveTo(0.17, -0.004, 0.15, -0.026);
  lamina.lineTo(0, -0.026);
  lamina.lineTo(0, 0.012);
  const geo = new THREE.ExtrudeGeometry(lamina, { depth: 0.003, bevelEnabled: false, curveSegments: 6 });
  geo.translate(0, 0, -0.0015);
  geo.rotateY(-Math.PI / 2);
  por(g, geo, toon(P.talher), 0, -0.002, 0.016);
  return g;
}

/** A COLHER DE PAU: o cabo para cima, a pá para baixo (a pega no meio do cabo) */
export function colherDePau(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'colher-de-pau';
  const madeira = toon(P.caboDeMadeira);
  por(g, new THREE.CylinderGeometry(0.007, 0.009, 0.26, 8), madeira, 0, -0.06, 0);
  const pa = por(g, new THREE.SphereGeometry(1, 12, 8), madeira, 0, -0.2, 0.004);
  pa.scale.set(0.022, 0.03, 0.009);
  return g;
}

/** O PEGADOR: as duas hastes de inox que se abrem embaixo, com as pontas de garra */
export function pegador(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'pegador';
  const inox = toon(P.churrascoInox);
  for (const s of [-1, 1]) {
    por(g, tubo([[0, 0.04, 0], [s * 0.008, -0.04, 0], [s * 0.022, -0.16, 0.005]], 0.005, 12, 5), inox);
    por(g, macia(0.03, 0.012, 0.022, 0.004), inox, s * 0.022, -0.168, 0.006);
  }
  por(g, new THREE.TorusGeometry(0.012, 0.004, 5, 12), inox, 0, 0.046, 0);
  return g;
}

/** A ESPÁTULA: cabo para trás, a lâmina larga deitada para a frente e um tico para baixo */
export function espatula(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'espatula';
  const cabo = por(g, new THREE.CapsuleGeometry(0.011, 0.09, 4, 8), toon(P.caboDeMadeira), 0, 0, -0.03);
  cabo.rotation.x = Math.PI / 2;
  por(g, tubo([[0, 0, 0.02], [0, -0.01, 0.06], [0, -0.03, 0.09]], 0.004, 8, 5), toon(P.talher));
  por(g, macia(0.07, 0.004, 0.08, 0.002), toon(P.talher), 0, -0.032, 0.13);
  return g;
}

/** A COLHER DE SERVIR: a concha funda na ponta, a pega no cabo */
export function colherDeServir(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'colher-de-servir';
  por(g, tubo([[0, 0.02, -0.06], [0, 0, 0], [0, -0.03, 0.08]], 0.005, 10, 5), toon(P.talher));
  const concha = new THREE.SphereGeometry(0.03, 12, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  concha.scale(1, 0.55, 1.25);
  por(g, concha, toon(P.talher, { doubleSide: true }), 0, -0.03, 0.11);
  return g;
}

/** A JARRINHA DE LEITE: a pega é a alça; o bico aponta para a frente */
export function jarrinhaDeLeite(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'jarrinha';
  const louca = toon(P.loucaCreme);
  const corpo = new THREE.Group();
  corpo.position.set(0, -0.05, 0.06);
  por(corpo, torneado([[0.001, 0], [0.04, 0], [0.046, 0.03], [0.042, 0.075], [0.046, 0.095], [0.04, 0.095], [0.036, 0.075], [0.038, 0.03], [0.001, 0.008]], 20), louca);
  por(corpo, new THREE.CircleGeometry(0.036, 18).rotateX(-Math.PI / 2), toon(P.tresLechesLeite), 0, 0.08, 0);
  const bico = por(corpo, new THREE.ConeGeometry(0.014, 0.03, 8, 1, true), toon(P.loucaCreme, { doubleSide: true }), 0, 0.09, 0.046);
  bico.rotation.x = Math.PI / 2 + 0.4;
  g.add(corpo);
  por(g, new THREE.TorusGeometry(0.026, 0.006, 6, 12, Math.PI), louca, 0, -0.005, 0.02).rotation.set(0, Math.PI / 2, Math.PI / 2);
  return g;
}

/** O POLVILHADOR DE CANELA: vidro com a tampa furadinha; a pega é o meio do vidro */
export function polvilhadorDeCanela(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'polvilhador';
  por(g, new THREE.CylinderGeometry(0.024, 0.024, 0.07, 14), toon(P.vidroDoPolvilhador), 0, 0, 0);
  por(g, new THREE.CylinderGeometry(0.021, 0.021, 0.045, 14), toon(P.canela), 0, -0.01, 0);
  por(g, new THREE.CylinderGeometry(0.026, 0.026, 0.02, 14), toon(P.churrascoInox), 0, 0.045, 0);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    por(g, new THREE.CylinderGeometry(0.0025, 0.0025, 0.002, 5), toon(P.fogaoDaLizTrempe), Math.cos(a) * 0.012, 0.0555, Math.sin(a) * 0.012);
  }
  return g;
}

/** O RALADOR de mão (a pega é o cabo, a chapa furada pendurada embaixo) e o queijo em bloco */
export function ralador(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'ralador';
  const inox = toon(P.churrascoInox);
  por(g, macia(0.024, 0.06, 0.016, 0.006), toon(P.bancadaDaLizPuxador), 0, 0.02, 0);
  por(g, macia(0.07, 0.15, 0.004, 0.003), inox, 0, -0.08, 0);
  const furos = toon(P.churrascoInoxEscuro);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) {
    por(g, new THREE.BoxGeometry(0.009, 0.004, 0.0045), furos, -0.021 + i * 0.014, -0.02 - j * 0.019, 0.0003);
  }
  return g;
}
export function queijoEmBloco(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'queijo';
  por(g, macia(0.05, 0.035, 0.05, 0.006), toon(P.queijoEmBloco), 0, 0, 0.02);
  return g;
}

/**
 * A FORMINHA DO ARROZ: a tigelinha lilás que vira de boca para baixo no
 * prato — o domo de arroz do pabellón sai dela. A pega é a beira (do lado
 * dela); o arroz de dentro (`arroz-na-forminha`) aparece quando ela enche.
 */
export function forminha(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'forminha';
  const corpo = new THREE.Group();
  corpo.name = 'corpo-da-forminha';
  corpo.position.set(0, 0, 0.07);
  por(corpo, torneado([[0.001, 0], [0.035, 0], [0.058, 0.03], [0.068, 0.055], [0.064, 0.056], [0.054, 0.032], [0.032, 0.006], [0.001, 0.006]], 22), toon(P.forminhaDoArroz));
  const arroz = por(corpo, new THREE.SphereGeometry(0.062, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.arrozBranco), 0, 0.048, 0);
  arroz.scale.set(1, 0.25, 1);
  arroz.name = 'arroz-na-forminha';
  arroz.visible = false;
  g.add(corpo);
  return g;
}

/**
 * UM POTINHO DE TEMPERO para a pitada: o queijo ralado, o manjericão, os
 * tostadinhos do fororo. Folha (`folha`) é disquinho; o resto, cisco.
 */
export function potinhoDeTempero(cor: number = P.queijoRalado, folha = false): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'potinho-de-tempero';
  por(g, torneado([[0.001, 0], [0.035, 0], [0.045, 0.035], [0.042, 0.036], [0.033, 0.006], [0.001, 0.006]], 18), toon(P.loucaCreme));
  const mat = toon(cor, { doubleSide: folha });
  for (let i = 0; i < 16; i++) {
    const a = i * 2.4;
    const d = (i % 4) * 0.009;
    if (folha) {
      const f = por(g, new THREE.CircleGeometry(0.009, 5), mat, Math.cos(a) * d, 0.03 + (i % 3) * 0.003, Math.sin(a) * d);
      f.rotation.set(-Math.PI / 2 + (i % 2) * 0.3, a, 0);
    } else {
      const c = por(g, new THREE.IcosahedronGeometry(0.006, 0), mat, Math.cos(a) * d, 0.027 + (i % 3) * 0.003, Math.sin(a) * d);
      c.rotation.set(a, a * 0.7, 0);
    }
  }
  return g;
}

/** o potinho de coentro picado ao lado do caldeirão (enfeite) */
export function potinhoDeCoentro(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'potinho-de-coentro';
  por(g, torneado([[0.001, 0], [0.035, 0], [0.045, 0.035], [0.042, 0.036], [0.033, 0.006], [0.001, 0.006]], 18), toon(P.loucaCreme));
  const folhas = toon(P.sopaCoentro, { doubleSide: true });
  for (let i = 0; i < 14; i++) {
    const a = i * 2.4;
    const d = (i % 4) * 0.009;
    const f = por(g, new THREE.CircleGeometry(0.008, 5), folhas, Math.cos(a) * d, 0.03 + (i % 3) * 0.003, Math.sin(a) * d);
    f.rotation.set(-Math.PI / 2 + (i % 2) * 0.3, a, 0);
  }
  return g;
}

/** UM MORANGO inteiro (para o potinho e para a mão): a fruta, as sementinhas e a folha */
export function morangoInteiro(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'morango';
  const fruta = por(g, new THREE.SphereGeometry(1, 12, 10), toon(P.morangoFruta), 0, 0.016, 0);
  fruta.scale.set(0.015, 0.02, 0.015);
  const folha = por(g, new THREE.ConeGeometry(0.012, 0.01, 6), toon(P.morangoFolha), 0, 0.036, 0);
  folha.rotation.x = Math.PI;
  return g;
}

// ================================================================ a bancada

/**
 * A BANCADA DE PREPARO, na ponta direita da janela: o tampo de madeira (o
 * "butcher block"), as portinhas creme com o puxador azul do azulejo, o pote
 * de utensílios, a pilha de pratos, de tigelas e de canecas do fororo, a
 * jarrinha de canela de reserva e o potinho de morangos. A tábua de corte e
 * o refratário da tres leches são da cena (`TabuaDeCorte`,
 * `refratarioDaTresLeches`) — eles mudam enquanto ela trabalha.
 *
 * A frente (`+Z`) é a da JANELA, como o balcão térmico ao lado; ela trabalha
 * do lado de trás (`−Z`).
 */
export const BANCADA = { fundo: 0.85, topo: 0.93 } as const;
/**
 * ONDE FICA CADA COISA NA BANCADA (no referencial dela, a origem no meio do
 * chão). O ALCANCE manda: a pata dela chega ~40 cm à frente da beira de
 * trás, então tudo o que ela usa mora na faixa de trás (`z` de −0,42 a
 * −0,05). A faixa da janela é de enfeite (tigelas, canecas, o pote de
 * utensílios): é o que se vê pela janela.
 */
export const LUGARES_DA_BANCADA = {
  /** o refratário da tres leches, e a espátula dele deitada na frente */
  refratario: { x: -0.48, z: -0.16 },
  espatula: { x: -0.48, z: -0.385 },
  /** a jarrinha dos três leites (a pega é a alça) e o polvilhador de canela */
  jarrinha: { x: -0.08, z: -0.33 },
  polvilhador: { x: 0.04, z: -0.31 },
  morangos: { x: 0.03, z: -0.13 },
  tabua: { x: 0.38, z: -0.25 },
} as const;

export function bancadaDePreparo(largura = 1.7): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bancada-de-preparo';
  const F = BANCADA.fundo;
  const porta = toon(P.bancadaDaLizPorta);
  por(g, new THREE.BoxGeometry(largura - 0.04, 0.1, F - 0.06), toon(P.escolaRodape), 0, 0.05, 0);
  por(g, macia(largura, 0.78, F, 0.02), porta, 0, 0.49, 0);
  // as portinhas do lado dela (−Z), com o puxador azul
  const nPortas = Math.max(2, Math.round(largura / 0.52));
  const lp = (largura - 0.08) / nPortas;
  for (let i = 0; i < nPortas; i++) {
    const x = -largura / 2 + 0.04 + lp * (i + 0.5);
    por(g, macia(lp - 0.03, 0.66, 0.02, 0.012), toon(P.loucaCreme), x, 0.5, -F / 2 - 0.006);
    por(g, macia(0.012, 0.09, 0.014, 0.005), toon(P.bancadaDaLizPuxador), x + (i % 2 ? -1 : 1) * (lp / 2 - 0.06), 0.66, -F / 2 - 0.02);
  }
  // o tampo de madeira, um tico maior
  por(g, macia(largura + 0.04, 0.05, F + 0.04, 0.012), toon(P.bancadaDaLizTampo), 0, BANCADA.topo - 0.025, 0);

  const T = BANCADA.topo;
  // a pilha de tigelas e as canecas do fororo de boca para baixo, no fundo
  // (o lado da janela): é a louça que se vê de fora
  for (let k = 0; k < 3; k++) {
    const t = tigela(0.1, 0.06);
    t.position.set(-largura / 2 + 0.2, T + k * 0.03, 0.22);
    g.add(t);
  }
  for (let i = 0; i < 3; i++) {
    por(g, torneado([[0.001, 0.09], [0.044, 0.09], [0.05, 0.002], [0.044, 0], [0.001, 0.02]], 18), toon(P.canecaDoFororo), -largura / 2 + 0.46 + i * 0.11, T, 0.27);
  }
  // o pote de utensílios: cabos de madeira e uma escumadeira
  {
    const x = largura / 2 - 0.22;
    const z = 0.24;
    por(g, torneado([[0.001, 0], [0.06, 0], [0.064, 0.16], [0.058, 0.16], [0.054, 0.01], [0.001, 0.01]], 18), toon(P.panelinhaDeEsmalte), x, T, z);
    const madeira = toon(P.caboDeMadeira);
    for (let i = 0; i < 4; i++) {
      const cabo = por(g, new THREE.CylinderGeometry(0.007, 0.008, 0.28, 6), madeira, x + Math.cos(i * 1.6) * 0.02, T + 0.2, z + Math.sin(i * 1.6) * 0.02);
      cabo.rotation.set(Math.sin(i * 1.6) * 0.18, 0, -Math.cos(i * 1.6) * 0.18);
    }
    const escumadeira = por(g, new THREE.CylinderGeometry(0.035, 0.035, 0.006, 16), toon(P.churrascoInox), x + 0.04, T + 0.35, z);
    escumadeira.rotation.z = 0.5;
  }
  // o potinho de morangos (os da cena saem DELE; estes ficam), do lado do refratário
  {
    const { x, z } = LUGARES_DA_BANCADA.morangos;
    por(g, torneado([[0.001, 0], [0.05, 0], [0.064, 0.05], [0.06, 0.052], [0.046, 0.006], [0.001, 0.006]], 18), toon(P.loucaCreme), x, T, z);
    for (let i = 0; i < 5; i++) {
      const m = morangoInteiro();
      m.position.set(x + Math.cos(i * 1.3) * 0.025, T + 0.02 + (i % 2) * 0.012, z + Math.sin(i * 1.3) * 0.025);
      m.rotation.z = (i - 2) * 0.3;
      g.add(m);
    }
  }
  return fundir(g);
}

// ============================================================ a tábua de corte

/**
 * A TÁBUA DE CORTE com o legume que ela pica. Uma classe, porque muda:
 *
 *  - `cortar(k)` (0 a 1): o legume encolhe da ponta e as rodelas aparecem
 *    na tábua, uma a cada corte (dois lotes: rodela de cenoura e anel de
 *    pimentão, com o `count` do lote);
 *  - `varrer(k)`: as rodelas escorregam para a tigela ao lado, e a tigela
 *    vai enchendo;
 *  - `proximo()`: legume novo (alterna cenoura e pimentão), tábua limpa.
 *
 * `pontaDoLegume()` e `meioDoLegume()` dizem, no mundo, onde a faca desce e
 * onde a outra pata segura.
 */
export class TabuaDeCorte {
  readonly group = new THREE.Group();
  private readonly cenoura = new THREE.Group();
  private readonly pimentao = new THREE.Group();
  private readonly rodelas: THREE.InstancedMesh;
  private readonly aneis: THREE.InstancedMesh;
  private readonly enchimento: THREE.Mesh;
  private qual: 0 | 1 = 0;
  private cheio = 0;
  private corte = 0;
  static readonly N = 9;
  /** o x da ponta do legume na tábua, inteiro e todo picado */
  private static readonly PONTA0 = 0.075;
  private static readonly PONTA1 = -0.075;

  constructor() {
    this.group.userData.peca = 'tabua-de-corte';
    // a tábua: retângulo de quina redonda, com a alça vazada na ponta
    const forma = new THREE.Shape();
    const L = 0.21;
    const A = 0.14;
    const r = 0.025;
    forma.moveTo(-L + r, -A);
    forma.lineTo(L - r, -A);
    forma.quadraticCurveTo(L, -A, L, -A + r);
    forma.lineTo(L, A - r);
    forma.quadraticCurveTo(L, A, L - r, A);
    forma.lineTo(-L + r, A);
    forma.quadraticCurveTo(-L, A, -L, A - r);
    forma.lineTo(-L, -A + r);
    forma.quadraticCurveTo(-L, -A, -L + r, -A);
    const furo = new THREE.Path();
    furo.absellipse(-L + 0.045, 0, 0.012, 0.03, 0, Math.PI * 2, true, 0);
    forma.holes.push(furo);
    const geo = new THREE.ExtrudeGeometry(forma, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 8 });
    geo.rotateX(-Math.PI / 2);
    // o UV da tampa já vem em metros: a textura cobre a tábua
    const uv = geo.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + L) / (2 * L), (uv.getY(i) + A) / (2 * A));
    por(this.group, geo, toon(0xffffff, { mapa: texturaDaTabua() }), 0, 0.004, 0);
    const Y = 0.032;

    // a cenoura deitada no x (a ponta fina na direita, onde a faca corta),
    // num pivô na ponta de trás (a da folhinha): encolher é escalar o x
    this.cenoura.name = 'cenoura';
    this.cenoura.position.set(-0.14, Y + 0.016, 0.0);
    const corpoC = por(this.cenoura, new THREE.CylinderGeometry(0.012, 0.018, 0.22, 12), toon(P.sopaCenoura), 0.11, 0, 0);
    corpoC.rotation.z = Math.PI / 2;
    const folha = toon(P.sopaCoentro, { doubleSide: true });
    for (let i = 0; i < 3; i++) {
      const f = por(this.cenoura, new THREE.ConeGeometry(0.006, 0.06, 4), folha, -0.025, 0.004 + (i - 1) * 0.006, (i - 1) * 0.01);
      f.rotation.z = Math.PI / 2 + (i - 1) * 0.35;
    }
    this.group.add(this.cenoura);
    // o pimentão: corpo gomado deitado, o cabinho verde
    this.pimentao.name = 'pimentao';
    this.pimentao.position.set(-0.14, Y + 0.022, 0);
    const corpoP = new THREE.CylinderGeometry(0.024, 0.024, 0.2, 14, 4);
    const pos = corpoP.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const a = Math.atan2(z, x);
      const k = 1 + Math.cos(a * 4) * 0.12;
      pos.setXYZ(i, x * k, pos.getY(i), z * k);
    }
    corpoP.computeVertexNormals();
    const pm = por(this.pimentao, corpoP, toon(P.pimentaoVermelho), 0.1, 0, 0);
    pm.rotation.z = Math.PI / 2;
    const cabinho = por(this.pimentao, new THREE.CylinderGeometry(0.005, 0.007, 0.025, 6), toon(P.sopaCoentro), -0.01, 0, 0);
    cabinho.rotation.z = Math.PI / 2;
    this.pimentao.visible = false;
    this.group.add(this.pimentao);

    // as rodelas e os anéis cortados: lotes, cada cópia no seu lugar da pilha
    this.rodelas = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.006, 12), toon(P.sopaCenoura), TabuaDeCorte.N);
    this.aneis = new THREE.InstancedMesh(new THREE.TorusGeometry(0.019, 0.006, 5, 14), toon(P.pimentaoVermelho), TabuaDeCorte.N);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const qAnel = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    for (let i = 0; i < TabuaDeCorte.N; i++) {
      const p = this.lugarDaRodela(i, Y);
      this.rodelas.setMatrixAt(i, m.compose(p, q.setFromEuler(new THREE.Euler(0.15 * (i % 3), 0, 0.1 * (i % 2))), new THREE.Vector3(1, 1, 1)));
      this.aneis.setMatrixAt(i, m.compose(p.clone().setY(Y + 0.006), qAnel, new THREE.Vector3(1, 1, 1)));
    }
    this.rodelas.count = 0;
    this.aneis.count = 0;
    this.rodelas.frustumCulled = false;
    this.aneis.frustumCulled = false;
    this.group.add(this.rodelas, this.aneis);

    // a tigela dos picados, ao lado da tábua (do lado de fora da faca)
    const tg = tigela(0.075, 0.05);
    tg.position.set(0.27, -0.002, -0.02);
    this.group.add(tg);
    this.enchimento = new THREE.Mesh(new THREE.CircleGeometry(0.06, 18).rotateX(-Math.PI / 2), toon(P.sopaCenoura));
    this.enchimento.name = 'picados-na-tigela';
    this.enchimento.position.set(0.27, 0.015, -0.02);
    this.enchimento.scale.setScalar(0.4);
    this.group.add(this.enchimento);
  }

  private lugarDaRodela(i: number, y: number): THREE.Vector3 {
    // a pilhinha cresce para a direita da ponta, em três fileirinhas
    return new THREE.Vector3(0.1 + (i % 3) * 0.028, y + 0.004 + Math.floor(i / 3) * 0.004, -0.04 + Math.floor(i / 3) * 0.035);
  }

  /** o legume encolhe da ponta e as rodelas aparecem (k de 0 a 1) */
  cortar(k: number): void {
    this.corte = THREE.MathUtils.clamp(k, 0, 1);
    const n = Math.floor(this.corte * TabuaDeCorte.N + 0.0001);
    const leg = this.qual === 0 ? this.cenoura : this.pimentao;
    leg.scale.x = 1 - this.corte * 0.75;
    leg.visible = true;
    (this.qual === 0 ? this.rodelas : this.aneis).count = n;
    (this.qual === 0 ? this.aneis : this.rodelas).count = 0;
  }

  /** as rodelas somem para a tigela, que enche (k de 0 a 1) */
  varrer(k: number): void {
    const lote = this.qual === 0 ? this.rodelas : this.aneis;
    lote.count = Math.round(TabuaDeCorte.N * (1 - k));
    if (k >= 1) {
      this.cheio = Math.min(1, this.cheio + 0.35);
      if (this.cheio >= 1) this.cheio = 0.35;
      this.enchimento.material = toon(this.qual === 0 ? P.sopaCenoura : P.pimentaoVermelho);
      this.enchimento.scale.setScalar(0.4 + this.cheio * 0.6);
      this.enchimento.position.y = 0.015 + this.cheio * 0.02;
    }
  }

  /** o próximo legume: alterna cenoura e pimentão, e a tábua fica limpa */
  proximo(): void {
    this.qual = this.qual === 0 ? 1 : 0;
    this.cenoura.visible = this.qual === 0;
    this.pimentao.visible = this.qual === 1;
    this.cenoura.scale.x = 1;
    this.pimentao.scale.x = 1;
    this.rodelas.count = 0;
    this.aneis.count = 0;
    this.corte = 0;
  }

  /** quantas rodelas estão na tábua agora (o teste mede) */
  get naTabua(): number {
    return (this.qual === 0 ? this.rodelas : this.aneis).count;
  }

  /** onde a faca desce: a ponta atual do legume, no mundo */
  pontaDoLegume(out = new THREE.Vector3()): THREE.Vector3 {
    const leg = this.qual === 0 ? this.cenoura : this.pimentao;
    const x = TabuaDeCorte.PONTA0 + (TabuaDeCorte.PONTA1 - TabuaDeCorte.PONTA0) * this.corte;
    return this.group.localToWorld(out.set(x + 0.01, leg.position.y, 0));
  }

  /** onde a outra pata segura: o meio de trás do legume, no mundo */
  meioDoLegume(out = new THREE.Vector3()): THREE.Vector3 {
    return this.group.localToWorld(out.set(-0.11, 0.06, 0));
  }

  /** a tigela dos picados, no mundo */
  tigelaNoMundo(out = new THREE.Vector3()): THREE.Vector3 {
    return this.group.localToWorld(out.set(0.27, 0.05, -0.02));
  }
}

// ============================================================ o refratário

/**
 * O REFRATÁRIO DA TRES LECHES, cortado em quadrados, na bancada. O quadrado
 * do canto de perto dela (`pedaco`) é um grupo próprio: é o que a espátula
 * levanta e leva para o prato. Embaixo dele, o leite que fica no fundo
 * quando ele sai; e os dois `riscos` do corte, que aparecem quando ela passa
 * a espátula. `repor()` volta tudo (a cena chama depois de servir).
 */
export class RefratarioDaTresLeches {
  readonly group = new THREE.Group();
  readonly pedaco = new THREE.Group();
  private readonly riscos: THREE.Mesh[] = [];
  private readonly casaDoPedaco = new THREE.Vector3();
  static readonly L = 0.56;
  static readonly P = 0.36;

  constructor() {
    this.group.userData.peca = 'refratario-da-tres-leches';
    const L = RefratarioDaTresLeches.L;
    const P0 = RefratarioDaTresLeches.P;
    const louca = toon(P.loucaCreme);
    // a travessa: fundo, quatro paredes e a beira boleada (aberta em cima)
    por(this.group, macia(L, 0.012, P0, 0.004), louca, 0, 0.006, 0);
    for (const [x, z, l, p] of [[0, P0 / 2 - 0.006, L, 0.012], [0, -P0 / 2 + 0.006, L, 0.012], [L / 2 - 0.006, 0, 0.012, P0 - 0.024], [-L / 2 + 0.006, 0, 0.012, P0 - 0.024]] as const) {
      por(this.group, macia(l, 0.07, p, 0.004), louca, x, 0.035, z);
    }
    for (const s of [-1, 1]) por(this.group, macia(0.05, 0.016, 0.1, 0.008), louca, s * (L / 2 + 0.02), 0.06, 0);
    const n = 5;
    const m = 3;
    const lado = (L - 0.04) / n;
    const fundo = (P0 - 0.04) / m;
    const massa = toon(0xffffff, { mapa: texturaDoPaoDeLo() });
    const creme = toon(P.tresLechesChantilly);
    const canela = toon(0xffffff, { mapa: texturaDoChantilly() });
    const fazerQuadrado = (pai: THREE.Object3D, x: number, z: number): void => {
      por(pai, macia(lado - 0.006, 0.045, fundo - 0.006, 0.004), massa, x, 0.0345, z);
      por(pai, macia(lado - 0.004, 0.014, fundo - 0.004, 0.005), creme, x, 0.063, z);
      por(pai, new THREE.PlaneGeometry(lado - 0.014, fundo - 0.014).rotateX(-Math.PI / 2), canela, x, 0.0705, z);
      const morango = por(pai, new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.morangoFruta), x, 0.07, z);
      morango.scale.set(0.014, 0.012, 0.011);
    };
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        const x = -L / 2 + 0.02 + lado * (i + 0.5);
        const z = -P0 / 2 + 0.02 + fundo * (j + 0.5);
        // o canto de perto dela (−Z) e da direita: o pedaço que sai
        if (i === n - 1 && j === 0) {
          this.pedaco.name = 'pedaco';
          this.pedaco.position.set(x, 0, z);
          this.casaDoPedaco.copy(this.pedaco.position);
          fazerQuadrado(this.pedaco, 0, 0);
          continue;
        }
        fazerQuadrado(this.group, x, z);
      }
    }
    // o leite no fundo do buraco, e os dois riscos do corte em volta dele
    const x = this.pedaco.position.x;
    const z = this.pedaco.position.z;
    por(this.group, new THREE.PlaneGeometry(lado - 0.008, fundo - 0.008).rotateX(-Math.PI / 2), toon(P.tresLechesLeite), x, 0.0135, z);
    const riscoMat = toon(P.tresLechesMassa);
    const r1 = por(this.group, new THREE.BoxGeometry(0.004, 0.012, fundo), riscoMat, x - lado / 2, 0.065, z);
    const r2 = por(this.group, new THREE.BoxGeometry(lado, 0.012, 0.004), riscoMat, x, 0.065, z + fundo / 2);
    for (const r of [r1, r2]) {
      r.name = 'risco';
      r.visible = false;
      this.riscos.push(r);
    }
    this.group.add(this.pedaco);
  }

  /** os riscos do corte aparecem (0, 1 ou 2) */
  riscar(quantos: number): void {
    this.riscos.forEach((r, i) => { r.visible = i < quantos; });
  }

  /** onde o pedaço está agora, no mundo (o meio dele, em cima) */
  pedacoNoMundo(out = new THREE.Vector3()): THREE.Vector3 {
    return this.pedaco.getWorldPosition(out).add(new THREE.Vector3(0, 0.07, 0));
  }

  /** o pedaço volta para o refratário, e os riscos somem */
  repor(): void {
    this.group.add(this.pedaco);
    this.pedaco.position.copy(this.casaDoPedaco);
    this.pedaco.quaternion.identity();
    this.pedaco.scale.setScalar(1);
    this.pedaco.visible = true;
    this.riscar(0);
  }
}

// ========================================================= líquido e farelos

/**
 * O FIO DE LÍQUIDO que cai da concha, da jarrinha ou da panelinha: um
 * cilindro esticado de um ponto a outro, um tico mais fino embaixo (o fio
 * afina caindo). Não faz sombra. `entre(a, b)` estica; `visible` liga.
 */
export class FioDeLiquido {
  readonly mesh: THREE.Mesh;
  private readonly v = new THREE.Vector3();
  private readonly cima = new THREE.Vector3(0, 1, 0);

  constructor(cor: number = P.sopaCaldo, private readonly raio = 0.009) {
    this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.7, 1, 10, 1, true).translate(0, -0.5, 0), toon(cor, { doubleSide: true }));
    this.mesh.name = 'fio-de-liquido';
    this.mesh.userData.semSombra = true;
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
  }

  /** estica de `a` (em cima) até `b` (embaixo), no quadro do pai do fio */
  entre(a: THREE.Vector3, b: THREE.Vector3, raio = this.raio): void {
    this.v.subVectors(b, a);
    const len = Math.max(0.001, this.v.length());
    this.mesh.position.copy(a);
    this.mesh.quaternion.setFromUnitVectors(this.cima, this.v.normalize().negate());
    this.mesh.scale.set(raio, len, raio);
  }

  pintar(cor: number): void {
    this.mesh.material = toon(cor, { doubleSide: true });
  }
}

/**
 * OS FARELOS: a canela polvilhada, o coentro picado, o queijo ralado, o
 * tostadinho e o óleo espirrando — um lote de pedacinhos que caem com
 * gravidade, cada um da sua cor, e somem ao chegar na altura do prato. Um
 * desenho para todos.
 */
export class Farelos {
  readonly mesh: THREE.InstancedMesh;
  private readonly vivos: Array<{ p: THREE.Vector3; v: THREE.Vector3; chao: number; vida: number; giro: number; escala: number; cor: THREE.Color }> = [];
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly s = new THREE.Vector3();
  static readonly MAX = 90;

  constructor() {
    this.mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.5, 1), toon(0xffffff), Farelos.MAX);
    this.mesh.name = 'farelos';
    this.mesh.userData.semSombra = true;
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.setColorAt(0, new THREE.Color(0xffffff));
  }

  /** solta `n` pedacinhos de `origem` (no mundo), espalhando `abre`, até a altura `chao` */
  soltar(origem: THREE.Vector3, cor: number, n: number, chao: number, abre = 0.02, sobe = 0, tamanho = 0.006): void {
    for (let i = 0; i < n && this.vivos.length < Farelos.MAX; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * abre;
      const p = origem.clone().add(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      const v = new THREE.Vector3(Math.cos(a) * r * 1.5, sobe * (0.6 + Math.random() * 0.8), Math.sin(a) * r * 1.5);
      this.vivos.push({
        p, v, chao, vida: 0, giro: Math.random() * 6, escala: tamanho * (0.7 + Math.random() * 0.6),
        cor: new THREE.Color(cor).offsetHSL(0, 0, (Math.random() - 0.5) * 0.08),
      });
    }
  }

  update(dt: number): void {
    let w = 0;
    for (const f of this.vivos) {
      f.v.y -= 2.6 * dt;
      f.p.addScaledVector(f.v, dt);
      f.vida += dt;
      f.giro += dt * 8;
      if (f.p.y <= f.chao || f.vida > 2.5) continue;
      this.vivos[w++] = f;
    }
    this.vivos.length = w;
    for (let i = 0; i < w; i++) {
      const f = this.vivos[i];
      this.e.set(f.giro, f.giro * 0.7, 0);
      this.mesh.setMatrixAt(i, this.m.compose(f.p, this.q.setFromEuler(this.e), this.s.setScalar(f.escala)));
      this.mesh.setColorAt(i, f.cor);
    }
    this.mesh.count = w;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  get ativos(): number {
    return this.vivos.length;
  }
}
