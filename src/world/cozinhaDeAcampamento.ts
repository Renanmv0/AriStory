import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { SomNome } from '../audio/efeitos';
import { brilhoDeLuz, brilhoEmLote, flat, luzNoChao, toon } from '../core/materials';
import { ChamaDeGas } from '../core/shaders';
import { PALETTE as P } from '../palette';
import { sorteio } from './texturasDeChao';

/**
 * ===================================================== A COZINHA DO FOGAREIRO
 *
 * A etapa D do acampamento (`docs/ACAMPAMENTO.md`): cozinhar no fogareiro de
 * montanha, na mesinha da frente da barraca. De dia (e no café da manhã
 * depois de dormir), CAFÉ COADO e MINI AREPAS — o pedido do Renan; de noite,
 * CHOCOLATE QUENTE e MIOJO.
 *
 * O PONTO É QUE TUDO SE MEXE. O fogareiro ACENDE de verdade: a manopla gira
 * na haste da válvula, o acendedor estala duas faíscas, a chama de gás
 * (`ChamaDeGas`, `core/shaders.ts`) estoura um tico maior e assenta, as
 * linguinhas da coroa tremem cada uma no seu tempo, a coroa do queimador vai
 * ficando em brasa e o fogareiro inteiro treme fininho enquanto queima. A
 * panelinha FERVE: as bolhas sobem, a tampa sacode e solta vapor pela beira.
 * E a comida acontece no lugar: o café passa pelo coador de pano e pinga na
 * caneca, o chocolate em pó cai de colherada e a colher mexe até o leite
 * ficar marrom, o miojo amolece na água e o tempero laranja tinge o caldo, e
 * as mini arepas douram no budare, viram na espátula e mostram a marca de
 * tostado.
 *
 * QUEM FAZ É A COZINHA, NÃO A CENA. A cena chama `preparar(prato)` e espera
 * (conversando ao mesmo tempo, se quiser); tudo anda no relógio da cozinha, o
 * `update(dt)` que a cena chama todo quadro — no celular lento, a chama, a
 * fervura e a mão no coador chegam juntas.
 *
 * O QUADRO É O DA MESINHA (o tampo em `y = 0,314`): o fogareiro, a panelinha
 * e as canecas já estão em cima dela, com nome (`fogareiro`, `panela`,
 * `caneca-1`, `caneca-2`), e a cozinha põe ao lado o CAIXOTE DE FEIRA com o
 * que se usa — o pacote de café, a lata de chocolate, o miojo, o potinho das
 * arepas, a manteigueira, o canequinho dos talheres, o coador, o budare, o
 * prato e o saquinho de marshmallow. O que voa do caixote para a mesa e volta
 * é um grupo com nome (fronteira da `fundir()`), e volta EXATAMENTE para onde
 * estava.
 */

export type PratoDoFogareiro = 'cafe' | 'arepas' | 'chocolate' | 'miojo';

/** o tampo da mesinha, a escala do kit em cima dela e onde a panela senta no fogareiro */
const TAMPO = 0.314;
const ESC = 1.6;
/** a escala do kit em cima da mesinha, para quem põe uma peça dele na mão (a arepa, o garfo) */
export const ESCALA_DA_COZINHA = ESC;
const BOCA = new THREE.Vector3(-0.14, TAMPO + 0.186 * ESC, 0);
/** quanto o aro do coador fica acima da boca da caneca */
const ALTURA_DO_COADOR = 0.034;
/** as linguinhas da coroa, uma em cada furinho do queimador */
const LINGUAS = 14;

type Ponto3 = readonly [number, number, number];

function macia(l: number, a: number, p: number, raio = 0.01): THREE.BufferGeometry {
  const r = Math.min(raio, l / 2 - 0.0005, a / 2 - 0.0005, p / 2 - 0.0005);
  return new RoundedBoxGeometry(l, a, p, 1, r);
}

/** perfil torneado `[raio, altura]` de baixo para cima (a face sai para fora) */
function torneado(perfil: ReadonlyArray<readonly [number, number]>, segs = 20): THREE.LatheGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), segs);
}

function tubo(pontos: ReadonlyArray<Ponto3>, raio: number, segs = 16, radial = 5, fechado = false): THREE.TubeGeometry {
  const v = pontos.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v, fechado), segs, raio, radial, fechado);
}

function por(
  pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** um rótulo pintado em canvas (o pacote de café, a lata, o miojo): desenho de uma peça só */
function rotulo(l: number, a: number, pintar: (c: CanvasRenderingContext2D, l: number, a: number) => void): THREE.CanvasTexture {
  const tela = document.createElement('canvas');
  tela.width = l;
  tela.height = a;
  const c = tela.getContext('2d');
  if (c) pintar(c, l, a);
  const t = new THREE.CanvasTexture(tela);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const texturas = new Map<string, THREE.CanvasTexture>();
function textura(chave: string, l: number, a: number, pintar: (c: CanvasRenderingContext2D, l: number, a: number) => void): THREE.CanvasTexture {
  let t = texturas.get(chave);
  if (!t) {
    t = rotulo(l, a, pintar);
    texturas.set(chave, t);
  }
  return t;
}

/** o pacote de café a vácuo: vermelho, a faixa dourada, "CAFÉ" e os grãozinhos */
function rotuloDoCafe(): THREE.CanvasTexture {
  return textura('cafe', 128, 192, (c, l, a) => {
    c.fillStyle = css(P.pacoteDeCafe);
    c.fillRect(0, 0, l, a);
    c.fillStyle = css(P.pacoteDeCafeFaixa);
    c.fillRect(0, a * 0.36, l, a * 0.3);
    c.fillStyle = css(P.pacoteDeCafe);
    c.font = 'bold 40px ui-rounded, Nunito, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('CAFÉ', l / 2, a * 0.51);
    c.fillStyle = '#5a2e18';
    for (const [x, y, g] of [[40, 34, 0.4], [70, 26, -0.5], [94, 40, 0.2], [52, 150, -0.3], [82, 160, 0.6]] as const) {
      c.save();
      c.translate(x, y);
      c.rotate(g);
      c.beginPath();
      c.ellipse(0, 0, 11, 7, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#2e170c';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(-8, 0);
      c.quadraticCurveTo(0, 3, 8, 0);
      c.stroke();
      c.restore();
    }
  });
}

/** a lata de chocolate em pó: o rótulo creme dando a volta, a xícara e "chocolate" */
function rotuloDaLata(): THREE.CanvasTexture {
  return textura('lata', 256, 96, (c, l, a) => {
    c.fillStyle = css(P.lataDeChocolate);
    c.fillRect(0, 0, l, a);
    c.fillStyle = css(P.lataDeChocolateRotulo);
    c.beginPath();
    c.roundRect(8, 16, l - 16, a - 32, 12);
    c.fill();
    c.fillStyle = css(P.lataDeChocolate);
    c.font = 'bold 26px ui-rounded, Nunito, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('chocolate', l * 0.56, a / 2);
    // a xicarazinha com fumaça
    c.fillStyle = '#c0542f';
    c.beginPath();
    c.roundRect(26, 40, 26, 22, 5);
    c.fill();
    c.strokeStyle = '#c0542f';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(54, 50, 6, -Math.PI / 2, Math.PI / 2);
    c.stroke();
    c.strokeStyle = '#8a6a5a';
    c.lineWidth = 2;
    for (const x of [33, 43]) {
      c.beginPath();
      c.moveTo(x, 36);
      c.quadraticCurveTo(x - 4, 31, x, 26);
      c.stroke();
    }
  });
}

/** o pacote de miojo: laranja, a faixa vermelha e a tigelinha de macarrão */
function rotuloDoMiojo(): THREE.CanvasTexture {
  return textura('miojo', 192, 128, (c, l, a) => {
    c.fillStyle = css(P.pacoteDeMiojo);
    c.fillRect(0, 0, l, a);
    c.fillStyle = css(P.pacoteDeMiojoFaixa);
    c.fillRect(0, a * 0.12, l, a * 0.22);
    c.fillStyle = '#fff4dc';
    c.font = 'bold 22px ui-rounded, Nunito, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('MIOJINHO', l / 2, a * 0.23);
    c.fillStyle = '#fff';
    c.beginPath();
    c.ellipse(l / 2, a * 0.66, 34, 18, 0, 0, Math.PI);
    c.fill();
    c.strokeStyle = css(P.macarraoInstantaneo);
    c.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      c.beginPath();
      c.moveTo(l / 2 - 26 + i * 9, a * 0.66);
      c.bezierCurveTo(l / 2 - 30 + i * 9, a * 0.55, l / 2 - 18 + i * 9, a * 0.52, l / 2 - 22 + i * 9, a * 0.62);
      c.stroke();
    }
  });
}

/** a marca do tostado da arepa: as manchinhas do budare, mais escuras no meio */
function marcaDeTostado(): THREE.CanvasTexture {
  return textura('tostado', 128, 128, (c, l) => {
    const rnd = sorteio(77);
    c.clearRect(0, 0, l, l);
    const g = c.createRadialGradient(l / 2, l / 2, 4, l / 2, l / 2, l / 2);
    g.addColorStop(0, 'rgba(120,70,30,0.55)');
    g.addColorStop(0.7, 'rgba(140,85,35,0.25)');
    g.addColorStop(1, 'rgba(140,85,35,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, l, l);
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd()) * l * 0.4;
      c.fillStyle = `rgba(${90 + rnd() * 30},${50 + rnd() * 20},20,${0.35 + rnd() * 0.4})`;
      c.beginPath();
      c.ellipse(l / 2 + Math.cos(a) * r, l / 2 + Math.sin(a) * r, 3 + rnd() * 6, 2 + rnd() * 4, rnd() * 3, 0, Math.PI * 2);
      c.fill();
    }
  });
}

/** o redemoinho da colher no leite com chocolate (a espiral clara, transparente) */
function espiral(): THREE.CanvasTexture {
  return textura('espiral', 128, 128, (c, l) => {
    c.clearRect(0, 0, l, l);
    c.strokeStyle = 'rgba(255,240,225,0.85)';
    c.lineCap = 'round';
    for (const fase of [0, Math.PI]) {
      c.lineWidth = 7;
      c.beginPath();
      for (let k = 0; k <= 60; k++) {
        const t = k / 60;
        const a = fase + t * Math.PI * 3.2;
        const r = 6 + t * 52;
        const x = l / 2 + Math.cos(a) * r;
        const y = l / 2 + Math.sin(a) * r;
        if (k === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
  });
}

// ======================================================== lotes que vivem

/**
 * AS BAFORADAS: vapor (ou a fumacinha do budare) subindo de um lugar, em
 * lote — bolotas macias que abrem enquanto sobem e somem lá em cima. A
 * `forca` (0 a 1) é o calor de quem solta: com 0 não sai nada, e as que já
 * saíram terminam de subir.
 */
class Baforadas {
  readonly malha: THREE.InstancedMesh;
  private readonly bolas: Array<{ t: number; vivo: boolean; x: number; z: number; giro: number }> = [];
  private proxima = 0;
  private readonly m = new THREE.Object3D();
  forca = 0;

  constructor(cor: number, quantas: number, private readonly subida: number, private readonly tamanho: number, opacidade = 0.5) {
    this.malha = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), flat(cor, opacidade), quantas);
    this.malha.frustumCulled = false;
    this.malha.userData.semSombra = true;
    this.malha.renderOrder = 5;
    for (let i = 0; i < quantas; i++) this.bolas.push({ t: 0, vivo: false, x: 0, z: 0, giro: 0 });
    this.esconder();
  }

  private esconder(): void {
    this.m.scale.setScalar(0);
    this.m.updateMatrix();
    for (let i = 0; i < this.bolas.length; i++) this.malha.setMatrixAt(i, this.m.matrix);
    this.malha.instanceMatrix.needsUpdate = true;
  }

  update(dt: number): void {
    this.proxima -= dt;
    if (this.forca > 0.04 && this.proxima <= 0) {
      const livre = this.bolas.find((b) => !b.vivo);
      if (livre) {
        livre.vivo = true;
        livre.t = 0;
        livre.x = (Math.random() - 0.5) * this.tamanho * 1.2;
        livre.z = (Math.random() - 0.5) * this.tamanho * 1.2;
        livre.giro = Math.random() * 6.28;
      }
      this.proxima = 0.32 / (0.35 + this.forca);
    }
    let algum = false;
    this.bolas.forEach((b, i) => {
      if (!b.vivo) {
        this.m.scale.setScalar(0);
      } else {
        b.t += dt / 1.8;
        if (b.t >= 1) b.vivo = false;
        const k = Math.min(1, b.t);
        this.m.position.set(b.x + Math.sin(k * 5 + b.giro) * this.tamanho * 0.6, k * this.subida, b.z + Math.cos(k * 4 + b.giro) * this.tamanho * 0.4);
        const s = this.tamanho * (0.45 + k * 1.3) * Math.min(1, k * 5) * Math.min(1, (1 - k) * 2.4) * (0.5 + 0.5 * this.forca);
        this.m.scale.setScalar(Math.max(0, s));
        algum = true;
      }
      this.m.updateMatrix();
      this.malha.setMatrixAt(i, this.m.matrix);
    });
    this.malha.visible = algum;
    this.malha.instanceMatrix.needsUpdate = true;
  }
}

/**
 * OS GRÃOS QUE CAEM: o pó de café e de chocolate, o tempero do miojo, os
 * pingos do coador e os respingos do macarrão caindo na água — bolinhas em
 * lote com gravidade, cada uma com a cor dela, que somem quando chegam no
 * "chão" de quem as soltou (o fundo do coador, a superfície do leite).
 */
class Graos {
  readonly malha: THREE.InstancedMesh;
  private readonly graos: Array<{ p: THREE.Vector3; v: THREE.Vector3; chao: number; vivo: boolean; r: number }> = [];
  private readonly m = new THREE.Object3D();
  private readonly cor = new THREE.Color();

  constructor(quantos: number) {
    this.malha = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), toon(0xffffff), quantos);
    this.malha.frustumCulled = false;
    this.malha.userData.semSombra = true;
    for (let i = 0; i < quantos; i++) {
      this.graos.push({ p: new THREE.Vector3(), v: new THREE.Vector3(), chao: 0, vivo: false, r: 0 });
      this.malha.setColorAt(i, this.cor.setHex(0xffffff));
    }
    this.update(0);
  }

  soltar(de: THREE.Vector3, cor: number, chao: number, espalha = 0.012, raio = 0.0035, velocidade = new THREE.Vector3()): void {
    const i = this.graos.findIndex((g) => !g.vivo);
    if (i < 0) return;
    const g = this.graos[i];
    g.vivo = true;
    g.p.copy(de).add(new THREE.Vector3((Math.random() - 0.5) * espalha, 0, (Math.random() - 0.5) * espalha));
    g.v.copy(velocidade).add(new THREE.Vector3((Math.random() - 0.5) * 0.06, -0.05, (Math.random() - 0.5) * 0.06));
    g.chao = chao;
    g.r = raio * (0.7 + Math.random() * 0.6);
    this.malha.setColorAt(i, this.cor.setHex(cor));
    if (this.malha.instanceColor) this.malha.instanceColor.needsUpdate = true;
  }

  update(dt: number): void {
    let algum = false;
    this.graos.forEach((g, i) => {
      if (g.vivo) {
        g.v.y -= 2.4 * dt;
        g.p.addScaledVector(g.v, dt);
        if (g.p.y <= g.chao) g.vivo = false;
      }
      this.m.position.copy(g.p);
      this.m.scale.setScalar(g.vivo ? g.r : 0);
      this.m.updateMatrix();
      this.malha.setMatrixAt(i, this.m.matrix);
      algum ||= g.vivo;
    });
    this.malha.visible = algum;
    this.malha.instanceMatrix.needsUpdate = true;
  }
}

/** um "líquido" de cor livre: um disco em lote de UMA cópia, com a cor por cópia (o toon é um só) */
function liquido(raio: number): THREE.InstancedMesh {
  const geo = new THREE.CircleGeometry(raio, 28).rotateX(-Math.PI / 2);
  const m = new THREE.InstancedMesh(geo, toon(0xffffff), 1);
  m.setColorAt(0, new THREE.Color(P.aguaDaPanela));
  m.userData.semSombra = true;
  m.visible = false;
  return m;
}

function pintar(m: THREE.InstancedMesh, cor: THREE.Color, i = 0): void {
  m.setColorAt(i, cor);
  if (m.instanceColor) m.instanceColor.needsUpdate = true;
}

// ================================================================= as peças

/**
 * O BUDARE: a chapinha redonda de ferro onde se assa arepa (é assim que se
 * chama na Venezuela), rasinha, com a borda virada e o cabinho de madeira com
 * a argola de pendurar. O mini, de acampamento.
 */
export function budare(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'budare';
  const ferro = toon(P.budareFerro);
  // maior que a roda dos braços do fogareiro (0,11): ele assenta neles
  por(g, torneado([[0.0001, 0], [0.11, 0], [0.12, 0.006], [0.125, 0.016], [0.12, 0.017], [0.112, 0.008], [0.0001, 0.006]], 34), ferro);
  // o cabo: a haste de ferro e a empunhadura de madeira, com a argola
  por(g, tubo([[0.12, 0.012, 0], [0.145, 0.016, 0], [0.165, 0.02, 0]], 0.005, 6, 6), ferro);
  const cabo = torneado([[0.0001, 0], [0.008, 0], [0.009, 0.01], [0.008, 0.06], [0.006, 0.066], [0.0001, 0.066]], 10);
  cabo.rotateZ(-Math.PI / 2);
  por(g, cabo, toon(P.caboDeMadeira), 0.163, 0.021, 0);
  por(g, new THREE.TorusGeometry(0.008, 0.0025, 4, 10).rotateY(Math.PI / 2), ferro, 0.235, 0.021, 0);
  return g;
}

/** o PRATO ESMALTADO branco com a borda azul, o irmão das canecas */
export function pratoEsmaltado(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'prato';
  por(g, torneado([[0.0001, 0], [0.05, 0], [0.085, 0.012], [0.095, 0.018], [0.093, 0.02], [0.082, 0.015], [0.048, 0.006], [0.0001, 0.006]], 30), toon(P.pratoEsmaltado));
  por(g, new THREE.TorusGeometry(0.094, 0.0028, 4, 30).rotateX(Math.PI / 2), toon(P.canecaBorda), 0, 0.019, 0);
  return g;
}

/**
 * UMA MINI AREPA: o disco gordinho de massa de milho, com a beirada redonda.
 * Nasce crua; o tostado de cada lado é a cozinha que pinta (as duas tampas
 * com a cor por cópia e a marca do budare crescendo do meio). Aqui é o
 * modelo inteiro, já dourada, para a mão de quem come.
 */
export function miniArepa(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'mini-arepa';
  por(g, torneado([[0.0001, 0], [0.024, 0], [0.029, 0.004], [0.031, 0.009], [0.029, 0.014], [0.024, 0.018], [0.0001, 0.018]], 18), toon(P.arepaDourada));
  const marca = new THREE.Mesh(new THREE.CircleGeometry(0.022, 18).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: marcaDeTostado(), opacity: 0.99 }));
  marca.position.y = 0.0185;
  marca.renderOrder = 3;
  g.add(marca);
  return g;
}

/** o GARFO COM MIOJO enrolado na ponta, para a mão de quem come da panelinha */
export function garfoComMiojo(): THREE.Group {
  const g = garfo('garfo');
  const fio = toon(P.macarraoInstantaneo);
  for (let i = 0; i < 4; i++) {
    const volta = new THREE.TorusGeometry(0.012 - i * 0.0012, 0.0024, 4, 12);
    const m = por(g, volta, fio, 0, 0.006 + i * 0.004, 0);
    m.rotation.set(Math.PI / 2 + (i - 1.5) * 0.25, i * 0.7, 0);
  }
  // um fio pendurado, que é a graça
  por(g, tubo([[0.008, 0.004, 0], [0.014, -0.012, 0.004], [0.01, -0.026, 0.002]], 0.0022, 8, 4), fio);
  g.rotation.x = Math.PI;
  // de cabeça para baixo dentro de um grupo: o nome vai no de FORA, que é o
  // que a mão segura (e o que o teste lê)
  const segurado = new THREE.Group();
  segurado.name = 'garfo-com-miojo';
  segurado.add(g);
  g.position.y = 0.1;
  return segurado;
}

/** a manteigueira de ágata com o tablete de manteiga em cima */
function manteigueira(): { grupo: THREE.Group; tablete: THREE.Mesh } {
  const g = new THREE.Group();
  g.name = 'manteigueira';
  por(g, torneado([[0.0001, 0], [0.03, 0], [0.036, 0.006], [0.037, 0.01], [0.032, 0.008], [0.0001, 0.006]], 18), toon(P.pratoEsmaltado));
  por(g, new THREE.TorusGeometry(0.036, 0.0018, 4, 18).rotateX(Math.PI / 2), toon(P.canecaBorda), 0, 0.0095, 0);
  const tablete = por(g, macia(0.03, 0.014, 0.022, 0.004), toon(P.manteiga), 0, 0.014, 0);
  tablete.name = 'tablete';
  return { grupo: g, tablete };
}

/** o coador de pano: o aro de arame com o cabo torcido e o saco de pano creme */
function coadorDePano(): { grupo: THREE.Group; borra: THREE.Mesh } {
  const g = new THREE.Group();
  g.name = 'coador';
  const arame = toon(P.coadorArame);
  // o aro é mais largo que a boca da caneca: o coador SENTA nela
  por(g, new THREE.TorusGeometry(0.068, 0.0026, 4, 28).rotateX(Math.PI / 2), arame);
  por(g, tubo([[0.068, 0, 0], [0.09, 0.004, 0], [0.12, 0.008, 0], [0.13, 0.01, 0.006], [0.124, 0.012, 0.012]], 0.0024, 12, 4), arame);
  // o pano: um funil molinho, mais estreito embaixo, com a ponta redonda
  const pano = torneado([[0.0145, -0.085], [0.03, -0.074], [0.05, -0.048], [0.064, -0.016], [0.066, 0.002]], 22);
  por(g, pano, toon(P.panoDoCoador, { doubleSide: true }));
  por(g, new THREE.SphereGeometry(0.0145, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), toon(P.panoDoCoador), 0, -0.085, 0);
  // a borra de café lá dentro (aparece quando o pó cai)
  const borra = por(g, new THREE.CircleGeometry(0.044, 18).rotateX(-Math.PI / 2), toon(P.cafeCoado), 0, -0.042, 0);
  borra.name = 'borra';
  borra.visible = false;
  return { grupo: g, borra };
}

/** a colher de sopa, a espátula de virar e o garfo: cabo de madeira, metal na ponta */
function colher(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'colher';
  por(g, new THREE.CylinderGeometry(0.003, 0.004, 0.11, 6), toon(P.talher), 0, 0.055, 0);
  const concha = new THREE.SphereGeometry(0.014, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  concha.scale(1, 0.5, 1.4);
  por(g, concha, toon(P.talher, { doubleSide: true }), 0, 0.002, 0);
  return g;
}

function espatula(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'espatula';
  por(g, new THREE.CylinderGeometry(0.0045, 0.0055, 0.09, 8), toon(P.caboDeMadeira), 0, 0.075, 0);
  por(g, new THREE.CylinderGeometry(0.0025, 0.0025, 0.03, 6), toon(P.talher), 0, 0.02, 0);
  const lamina = macia(0.034, 0.003, 0.044, 0.004);
  por(g, lamina, toon(P.talher), 0, 0.0, 0.016).rotation.x = 0.25;
  return g;
}

function garfo(nome: string): THREE.Group {
  const g = new THREE.Group();
  g.name = nome;
  por(g, new THREE.CylinderGeometry(0.0028, 0.0036, 0.09, 6), toon(P.talher), 0, 0.06, 0);
  por(g, macia(0.014, 0.012, 0.003, 0.0012), toon(P.talher), 0, 0.012, 0);
  for (let i = 0; i < 4; i++) por(g, new THREE.BoxGeometry(0.0018, 0.016, 0.0018), toon(P.talher), -0.0054 + i * 0.0036, -0.002, 0);
  return g;
}

/**
 * O CAIXOTE DE FEIRA, o armário da cozinha de acampamento: ripas com fresta,
 * as quatro colunas dos cantos e a alça vazada dos lados curtos — com o que
 * se cozinha dentro, aparecendo por cima. A origem é o chão; a frente olha
 * para `+Z`.
 */
function caixote(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caixote-de-feira';
  const madeira = toon(P.caixoteMadeira);
  const escura = toon(P.caixoteEscuro);
  const L = 0.36;
  const A = 0.17;
  const F = 0.25;
  // as colunas dos cantos
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) por(g, macia(0.024, A, 0.024, 0.004), escura, sx * (L / 2 - 0.012), A / 2, sz * (F / 2 - 0.012));
  // as ripas: três em cada lado comprido, duas nos curtos (com a alça entre elas), e o fundo
  for (const sz of [-1, 1]) {
    for (const y of [0.025, 0.08, 0.14]) por(g, macia(L - 0.03, 0.04, 0.008, 0.003), madeira, 0, y, sz * (F / 2 - 0.004));
  }
  for (const sx of [-1, 1]) {
    for (const y of [0.03, 0.095]) por(g, macia(0.008, 0.05, F - 0.03, 0.003), madeira, sx * (L / 2 - 0.004), y, 0);
    // a ripa de cima com a alça vazada: duas pontas e o cabo
    for (const sz of [-1, 1]) por(g, macia(0.008, 0.03, 0.06, 0.003), madeira, sx * (L / 2 - 0.004), 0.152, sz * (F / 2 - 0.06));
    por(g, macia(0.008, 0.012, F - 0.2, 0.003), madeira, sx * (L / 2 - 0.004), 0.162, 0);
  }
  for (const x of [-0.12, 0, 0.12]) por(g, macia(0.09, 0.008, F - 0.03, 0.003), madeira, x, 0.006, 0);
  return g;
}

/** o pacote de miojo: o travesseirinho com a ponta serrilhada e o tijolinho de macarrão dentro */
function pacoteDeMiojo(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'miojo';
  const corpo = macia(0.09, 0.024, 0.066, 0.011);
  por(g, corpo, toon(0xffffff, { mapa: rotuloDoMiojo() }));
  for (const s of [-1, 1]) {
    for (let i = 0; i < 6; i++) por(g, new THREE.BoxGeometry(0.004, 0.003, 0.006), toon(P.pacoteDeMiojo), s * 0.046, 0, -0.03 + i * 0.012);
  }
  return g;
}

// ================================================================ a cozinha

interface Animacao { t: number; dur: number; passo: (k: number) => void; fim: () => void }

/** uma mini arepa em cozimento: os dois lados, onde está e o giro de virar */
interface ArepaNoFogo {
  a: number;
  b: number;
  /** de cabeça para baixo (o lado A para cima) */
  virada: boolean;
  /** quanto do giro de virar já foi (0 a 1), para o desenho no meio do pulo */
  giro: number;
  pos: THREE.Vector3;
  noBudare: boolean;
  visivel: boolean;
  queijo: number;
  /** no prato: o lugar dela NO QUADRO DO PRATO (o prato vai para a canga, e ela vai junto) */
  noPrato: THREE.Vector3 | null;
}

export interface PecasDaMesinha {
  mesinha: THREE.Group;
  fogareiro: THREE.Group;
  panela: THREE.Group;
  canecas: THREE.Group[];
}

/** o que o teste lê: a chama, o calor, a panela, as canecas, as arepas */
export interface EstadoDaCozinha {
  fazendo: PratoDoFogareiro | null;
  etapa: string;
  chama: number;
  calor: number;
  manopla: number;
  tremor: number;
  fervura: number;
  tampaAberta: boolean;
  panela: { nivel: number; cor: string; naBoca: boolean };
  canecas: Array<{ nivel: number; cor: string; marshmallows: number; vapor: number }>;
  arepas: Array<{ a: number; b: number; virada: boolean; noBudare: boolean; noPrato: boolean }>;
  budareNaBoca: boolean;
  miojo: number;
  sons: Record<string, number>;
}

export class CozinhaDoFogareiro {
  /** o que a cozinha põe ao lado da mesinha (o caixote e o que mora nele) */
  readonly caixote: THREE.Group;
  som: ((nome: SomNome) => void) | null = null;

  private readonly mesinha: THREE.Group;
  private readonly fogareiro: THREE.Group;
  private readonly panela: THREE.Group;
  private readonly canecas: THREE.Group[];
  private readonly manopla: THREE.Object3D;
  private readonly tampa: THREE.Object3D;
  private readonly chama: ChamaDeGas;
  private readonly lingua: THREE.Mesh;
  private readonly linguinhas: THREE.InstancedMesh;
  private readonly brilhoDaChama: THREE.Sprite;
  private readonly faisca: THREE.Sprite;
  /** a luz pintada que a chama joga no tampo (de noite é o que se vê) */
  private readonly luzNoTampo: THREE.Mesh;
  private readonly brasa: THREE.InstancedMesh;
  private readonly liquidoDaPanela: THREE.InstancedMesh;
  private readonly redemoinho: THREE.Mesh;
  private readonly bolhas: THREE.InstancedMesh;
  private readonly vaporDaPanela: Baforadas;
  private readonly fumacaDoBudare: Baforadas;
  private readonly vaporDasCanecas: Baforadas[];
  private readonly liquidoDasCanecas: THREE.InstancedMesh[];
  private readonly marshmallows: THREE.InstancedMesh;
  private readonly graos: Graos;
  private readonly jato: THREE.InstancedMesh;
  private readonly budare: THREE.Group;
  private readonly prato: THREE.Group;
  private readonly arepas: ArepaNoFogo[] = [];
  private readonly corpoDasArepas: THREE.InstancedMesh;
  private readonly tampasDasArepas: THREE.InstancedMesh;
  private readonly marcasDasArepas: THREE.InstancedMesh;
  private readonly queijos: THREE.InstancedMesh;
  private readonly tablete: THREE.Mesh;
  private cruas: THREE.Object3D = new THREE.Object3D();
  private readonly poca: THREE.Mesh;
  private readonly coador: THREE.Group;
  private readonly borra: THREE.Mesh;
  private readonly bloco: THREE.Mesh;
  private readonly fios: THREE.InstancedMesh;
  private readonly sache: THREE.Mesh;
  private readonly itens = new Map<string, { obj: THREE.Object3D; pai: THREE.Object3D; pos: THREE.Vector3; quat: THREE.Quaternion }>();

  private readonly animacoes: Animacao[] = [];
  private relogio = 0;
  private gas = 0;
  private forcaDaChama = 0;
  private calor = 0;
  private fervura = 0;
  private tremor = 0;
  private nivelDaPanela = 0;
  private readonly corDaPanela = new THREE.Color(P.aguaDaPanela);
  private readonly nivelDasCanecas = [0, 0];
  private readonly corDasCanecas = [new THREE.Color(P.cafeCoado), new THREE.Color(P.cafeCoado)];
  private readonly calorDasCanecas = [0, 0];
  private readonly mallows: Array<{ caneca: number; t: number; x: number; z: number }> = [];
  private tampaAberta = false;
  private tampaNaBoca = true;
  private budareNaBoca = false;
  /** 0 com a boca livre, 1 com panela ou budare em cima: a chama abafa e espalha */
  private abafo = 0;
  private abafoDasLinguas = -1;
  private mexendo = 0;
  private amolecer = 0;
  private proximaBolha = 0;
  private proximoGas = 0;
  private proximaTampa = 0;
  private proximoFrito = 0;
  private fazendo: PratoDoFogareiro | null = null;
  private etapa = 'parada';
  private readonly sons: Record<string, number> = {};
  private readonly m = new THREE.Object3D();

  constructor(p: PecasDaMesinha) {
    this.mesinha = p.mesinha;
    this.fogareiro = p.fogareiro;
    this.panela = p.panela;
    this.canecas = p.canecas;
    this.manopla = p.fogareiro.getObjectByName('manopla') ?? new THREE.Object3D();
    this.tampa = p.panela.getObjectByName('tampa') ?? new THREE.Object3D();

    // --------------------------------------------------------- a chama
    const lugar = p.fogareiro.getObjectByName('chama') ?? p.fogareiro;
    this.chama = new ChamaDeGas(P.chamaBase, P.chamaMeio, P.chamaPonta);
    const cone = new THREE.ConeGeometry(0.5, 1, 18, 6, true).translate(0, 0.5, 0);
    this.lingua = new THREE.Mesh(cone, this.chama.material);
    this.lingua.scale.set(0.03, 0.05, 0.03);
    this.lingua.renderOrder = 64;
    this.lingua.frustumCulled = false;
    this.lingua.userData.semSombra = true;
    lugar.add(this.lingua);
    // as linguinhas da coroa: uma em cada furinho, abrindo para fora
    this.linguinhas = new THREE.InstancedMesh(new THREE.ConeGeometry(0.5, 1, 8, 3, true).translate(0, 0.5, 0), this.chama.material, LINGUAS);
    this.abrirLinguas(0);
    this.linguinhas.renderOrder = 64;
    this.linguinhas.frustumCulled = false;
    this.linguinhas.userData.semSombra = true;
    lugar.add(this.linguinhas);
    this.brilhoDaChama = new THREE.Sprite(brilhoDeLuz(P.chamaMeio, 0.55));
    this.brilhoDaChama.position.y = 0.02;
    this.brilhoDaChama.renderOrder = 63;
    lugar.add(this.brilhoDaChama);
    // a luz da chama no tampo, em volta do pé do fogareiro: pintada (luz de
    // verdade recompilava a cena inteira), crescendo e pulsando com o gás
    this.luzNoTampo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), luzNoChao(P.chamaMeio, 0.3));
    this.luzNoTampo.position.set(BOCA.x, TAMPO + 0.003, BOCA.z);
    this.luzNoTampo.renderOrder = 2;
    this.luzNoTampo.userData.semSombra = true;
    this.luzNoTampo.visible = false;
    p.mesinha.add(this.luzNoTampo);
    this.faisca = new THREE.Sprite(brilhoDeLuz(P.faiscaDoFogareiro, 0.95));
    this.faisca.position.set(0.018, 0.004, 0.012);
    this.faisca.renderOrder = 65;
    // nasce apagada: sprite novo é visível e do tamanho de um metro (era o
    // clarão branco em cima da mesinha, de dia e de noite)
    this.faisca.visible = false;
    lugar.add(this.faisca);
    // a coroa em brasa: halinhos laranja em volta do queimador, acendendo com o calor
    this.brasa = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.coroaEmBrasa, 0.9), 16);
    const preto = new THREE.Color(0, 0, 0);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      this.m.position.set(Math.sin(a) * 0.022, -0.001, Math.cos(a) * 0.022);
      this.m.rotation.set(0, 0, 0);
      this.m.scale.setScalar(0.014);
      this.m.updateMatrix();
      this.brasa.setMatrixAt(i, this.m.matrix);
      this.brasa.setColorAt(i, preto);
    }
    this.brasa.renderOrder = 62;
    this.brasa.frustumCulled = false;
    this.brasa.userData.semSombra = true;
    lugar.add(this.brasa);

    // ------------------------------------------------------- a panela
    this.liquidoDaPanela = liquido(0.057);
    p.panela.add(this.liquidoDaPanela);
    this.redemoinho = new THREE.Mesh(new THREE.CircleGeometry(0.052, 24).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: espiral(), opacity: 0.6 }));
    this.redemoinho.visible = false;
    this.redemoinho.renderOrder = 4;
    this.redemoinho.userData.semSombra = true;
    p.panela.add(this.redemoinho);
    this.bolhas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), toon(P.vaporDoFogareiro), 14);
    this.bolhas.frustumCulled = false;
    this.bolhas.userData.semSombra = true;
    p.panela.add(this.bolhas);
    // o macarrão: o tijolinho e os fios que soltam
    this.bloco = new THREE.Mesh(macia(0.07, 0.022, 0.05, 0.006), toon(P.macarraoInstantaneo));
    this.bloco.visible = false;
    p.panela.add(this.bloco);
    const fio = new THREE.TorusGeometry(0.018, 0.0022, 4, 12, Math.PI * 1.3);
    this.fios = new THREE.InstancedMesh(fio, toon(P.macarraoInstantaneo), 22);
    this.fios.frustumCulled = false;
    this.fios.visible = false;
    this.fios.userData.semSombra = true;
    p.panela.add(this.fios);

    this.vaporDaPanela = new Baforadas(P.vaporDoFogareiro, 10, 0.32, 0.022);
    this.vaporDaPanela.malha.position.set(0, 0.095, 0);
    p.panela.add(this.vaporDaPanela.malha);

    // ------------------------------------------------------- as canecas
    this.liquidoDasCanecas = p.canecas.map((c) => {
      const l = liquido(0.036);
      c.add(l);
      return l;
    });
    this.vaporDasCanecas = p.canecas.map((c) => {
      const b = new Baforadas(P.vaporDoFogareiro, 6, 0.24, 0.014, 0.45);
      b.malha.position.set(0, 0.078, 0);
      c.add(b.malha);
      return b;
    });
    this.marshmallows = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.01, 8), toon(0xffffff), 6);
    this.marshmallows.frustumCulled = false;
    this.marshmallows.userData.semSombra = true;
    for (let i = 0; i < 6; i++) this.marshmallows.setColorAt(i, new THREE.Color(i % 3 === 1 ? P.marshmallowRosa : P.marshmallow));
    p.mesinha.add(this.marshmallows);

    // ------------------------------------------- o que voa pela mesa (quadro da mesinha)
    this.graos = new Graos(48);
    p.mesinha.add(this.graos.malha);
    this.jato = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 8, 1, true).translate(0, -0.5, 0), toon(0xffffff), 1);
    this.jato.setColorAt(0, new THREE.Color(P.aguaDaPanela));
    this.jato.visible = false;
    this.jato.frustumCulled = false;
    this.jato.userData.semSombra = true;
    p.mesinha.add(this.jato);

    // ------------------------------------------------ o caixote e o que mora nele
    this.caixote = caixote();
    this.caixote.position.set(0.6, 0, -0.03);
    this.caixote.rotation.y = -0.22;
    p.mesinha.add(this.caixote);
    const guardar = (obj: THREE.Object3D, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0, pai: THREE.Object3D = this.caixote): void => {
      obj.position.set(x, y, z);
      obj.rotation.set(rx, ry, rz);
      pai.add(obj);
      this.itens.set(obj.name, { obj, pai, pos: obj.position.clone(), quat: obj.quaternion.clone() });
    };
    const cafe = new THREE.Group();
    cafe.name = 'pacote-de-cafe';
    por(cafe, macia(0.05, 0.085, 0.03, 0.006), toon(0xffffff, { mapa: rotuloDoCafe() }));
    guardar(cafe, -0.11, 0.13, -0.05, -0.12, 0.2, 0.06);
    const lata = new THREE.Group();
    lata.name = 'lata-de-chocolate';
    por(lata, new THREE.CylinderGeometry(0.026, 0.026, 0.064, 20), toon(0xffffff, { mapa: rotuloDaLata() }), 0, 0.032, 0);
    por(lata, new THREE.CylinderGeometry(0.0275, 0.0275, 0.008, 20), toon(P.lataDeChocolate), 0, 0.066, 0);
    guardar(lata, -0.035, 0.1, -0.06, 0, 0.6, 0);
    const miojo = pacoteDeMiojo();
    guardar(miojo, 0.07, 0.15, -0.045, 0.35, -0.3, 0.1);
    // o sachê de tempero sai de dentro do pacote
    this.sache = new THREE.Mesh(macia(0.03, 0.004, 0.022, 0.0015), toon(P.temperoDeMiojo));
    this.sache.name = 'sache';
    this.sache.visible = false;
    p.mesinha.add(this.sache);
    // o potinho das arepas cruas, com a tampa encostada
    const potinho = new THREE.Group();
    potinho.name = 'potinho';
    por(potinho, macia(0.1, 0.036, 0.075, 0.008), toon(P.potinhoPlastico), 0, 0.018, 0);
    const tampaDoPote = por(potinho, macia(0.104, 0.007, 0.079, 0.003), toon(P.potinhoTampa), 0.03, 0.05, -0.03);
    tampaDoPote.rotation.set(0.9, 0.2, 0);
    // as bolinhas de massa já achatadas, esperando o budare (somem quando vão para o fogo)
    const cruas = new THREE.Group();
    cruas.name = 'cruas';
    for (const [x, z] of [[-0.022, -0.012], [0.02, -0.014], [-0.018, 0.016], [0.022, 0.015]] as const) {
      por(cruas, new THREE.CylinderGeometry(0.019, 0.02, 0.012, 14), toon(P.arepaCrua), x, 0.036, z);
    }
    potinho.add(cruas);
    this.cruas = cruas;
    guardar(potinho, 0.075, 0.075, 0.06, 0, -0.15, 0);
    const mt = manteigueira();
    this.tablete = mt.tablete;
    guardar(mt.grupo, -0.08, 0.075, 0.07, 0, 0.3, 0);
    // o canequinho dos talheres, com a colher, a espátula e os dois garfos de pé
    const canequinho = new THREE.Group();
    canequinho.name = 'canequinho';
    por(canequinho, torneado([[0.0001, 0], [0.024, 0], [0.026, 0.06]], 16), toon(P.canecaEsmalte));
    por(canequinho, new THREE.TorusGeometry(0.0262, 0.0025, 4, 16).rotateX(Math.PI / 2), toon(P.canecaBorda), 0, 0.06, 0);
    guardar(canequinho, -0.145, 0.006, 0.08, 0, 0, 0);
    guardar(colher(), -0.15, 0.03, 0.074, -0.2, 0, 0.15);
    guardar(espatula(), -0.14, 0.03, 0.088, 0.15, 0.4, -0.12);
    guardar(garfo('garfo-1'), -0.135, 0.03, 0.07, -0.1, 0.3, -0.25);
    guardar(garfo('garfo-2'), -0.155, 0.03, 0.09, 0.2, -0.2, 0.2);
    // o saquinho de marshmallow
    const saquinho = new THREE.Group();
    saquinho.name = 'saquinho';
    const saco = macia(0.05, 0.06, 0.03, 0.012);
    por(saquinho, saco, toon(P.marshmallowRosa, { opacity: 0.92 }), 0, 0.03, 0);
    for (const [x, y] of [[-0.01, 0.02], [0.012, 0.03], [0, 0.045]] as const) {
      por(saquinho, new THREE.CylinderGeometry(0.008, 0.008, 0.01, 8), toon(P.marshmallow), x, y, 0.012).rotation.x = 1.2;
    }
    por(saquinho, new THREE.TorusGeometry(0.006, 0.0015, 4, 8), toon(P.pacoteDeMiojoFaixa), 0, 0.062, 0);
    guardar(saquinho, 0.12, 0.13, -0.075, 0.2, 0, -0.15);
    // o coador, pendurado do lado de fora pelo cabo
    const cd = coadorDePano();
    this.coador = cd.grupo;
    this.borra = cd.borra;
    guardar(this.coador, -0.21, 0.165, 0.02, 0, Math.PI, 0.05);
    // o budare e o prato, encostados na frente do caixote
    this.budare = budare();
    guardar(this.budare, 0.04, 0.095, 0.14, -1.25, 0, 0.1);
    this.prato = pratoEsmaltado();
    guardar(this.prato, -0.08, 0.1, 0.145, -1.3, 0, -0.08);

    // as mini arepas: três lotes (o corpo, as duas tampas e a marca) e o queijo
    const corpo = torneado([[0.024, 0], [0.029, 0.004], [0.031, 0.009], [0.029, 0.014], [0.024, 0.018]], 18).translate(0, -0.009, 0);
    this.corpoDasArepas = new THREE.InstancedMesh(corpo, toon(0xffffff), 4);
    const tampas = new THREE.CircleGeometry(0.0242, 18).rotateX(-Math.PI / 2);
    this.tampasDasArepas = new THREE.InstancedMesh(tampas, toon(0xffffff, { doubleSide: true }), 8);
    this.marcasDasArepas = new THREE.InstancedMesh(tampas, toon(0xffffff, { mapa: marcaDeTostado(), opacity: 0.99, doubleSide: true }), 8);
    this.marcasDasArepas.renderOrder = 3;
    this.queijos = new THREE.InstancedMesh(macia(0.03, 0.004, 0.03, 0.0015), toon(P.queijoBranco), 4);
    for (const lote of [this.corpoDasArepas, this.tampasDasArepas, this.marcasDasArepas, this.queijos]) {
      lote.frustumCulled = false;
      lote.userData.semSombra = lote !== this.corpoDasArepas;
      p.mesinha.add(lote);
    }
    for (let i = 0; i < 4; i++) {
      this.arepas.push({ a: 0, b: 0, virada: false, giro: 0, pos: new THREE.Vector3(), noBudare: false, visivel: false, queijo: 0, noPrato: null });
    }
    this.fumacaDoBudare = new Baforadas(P.fumacinha, 8, 0.26, 0.018, 0.4);
    this.budare.add(this.fumacaDoBudare.malha);
    this.fumacaDoBudare.malha.position.set(0, 0.02, 0);
    // a manteiga derretendo: o tablete vira poça
    this.poca = new THREE.Mesh(new THREE.CircleGeometry(0.04, 20).rotateX(-Math.PI / 2), toon(P.manteiga, { opacity: 0.7 }));
    this.poca.visible = false;
    this.poca.renderOrder = 2;
    this.poca.userData.semSombra = true;
    this.budare.add(this.poca);

    this.desenharArepas();
    this.update(0);
  }

  // ================================================================ estado

  get estado(): EstadoDaCozinha {
    const hex = (c: THREE.Color): string => `#${c.getHexString()}`;
    return {
      fazendo: this.fazendo,
      etapa: this.etapa,
      chama: this.forcaDaChama,
      calor: this.calor,
      manopla: this.manopla.rotation.x,
      tremor: this.tremor,
      fervura: this.fervura,
      tampaAberta: this.tampaAberta,
      panela: { nivel: this.nivelDaPanela, cor: hex(this.corDaPanela), naBoca: this.panelaNaBoca() },
      canecas: [0, 1].map((i) => ({
        nivel: this.nivelDasCanecas[i], cor: hex(this.corDasCanecas[i]),
        marshmallows: this.mallows.filter((m) => m.caneca === i).length, vapor: this.calorDasCanecas[i],
      })),
      arepas: this.arepas.map((a) => ({ a: a.a, b: a.b, virada: a.virada, noBudare: a.noBudare, noPrato: a.visivel && a.noPrato !== null })),
      budareNaBoca: this.budareNaBoca,
      miojo: this.amolecer,
      sons: { ...this.sons },
    };
  }

  get ocupada(): boolean {
    return this.fazendo !== null;
  }

  /** as canecas, para a cena pôr na mão de cada um */
  caneca(i: number): THREE.Group {
    return this.canecas[i];
  }

  /** a panelinha (o miojo se come dela, na canga) */
  get panelinha(): THREE.Group {
    return this.panela;
  }

  get pratoDasArepas(): THREE.Group {
    return this.prato;
  }

  // ============================================================== o relógio

  update(dt: number): void {
    this.relogio += dt;
    for (const a of [...this.animacoes]) {
      a.t = Math.min(a.dur, a.t + dt);
      a.passo(a.dur > 0 ? a.t / a.dur : 1);
      if (a.t >= a.dur) {
        this.animacoes.splice(this.animacoes.indexOf(a), 1);
        a.fim();
      }
    }
    // a chama segue a válvula (o estouro de quando acende é a `acender` que faz)
    if (this.gas > 0) this.forcaDaChama += (this.gas - this.forcaDaChama) * Math.min(1, dt * 6);
    else this.forcaDaChama = Math.max(0, this.forcaDaChama - dt * 5);
    this.chama.forca = this.forcaDaChama;
    this.chama.avancar(dt);
    const acesa = this.forcaDaChama > 0.02;
    /*
     * COM PANELA EM CIMA, A CHAMA ABAFA: o fundo fica a 1,6 cm da coroa, então
     * o cone encolhe e alarga e as linguinhas deitam para fora, lambendo por
     * baixo da beira — como no fogareiro de verdade. Sem isso a ponta do cone
     * furava o budare (a panela escondia, por ser funda).
     */
    const tampada = this.panelaNaBoca() || this.budareNaBoca;
    this.abafo += ((tampada ? 1 : 0) - this.abafo) * Math.min(1, dt * 8);
    this.lingua.scale.set(0.03 + 0.018 * this.abafo, 0.05 - 0.037 * this.abafo, 0.03 + 0.018 * this.abafo);
    if (Math.abs(this.abafo - this.abafoDasLinguas) > 0.01) this.abrirLinguas(this.abafo);
    this.lingua.visible = acesa;
    this.linguinhas.visible = acesa;
    this.brilhoDaChama.visible = acesa;
    const pulso = 0.85 + 0.15 * Math.sin(this.relogio * 23) * Math.sin(this.relogio * 7.1);
    this.brilhoDaChama.scale.setScalar(0.14 * this.forcaDaChama * pulso);
    this.luzNoTampo.visible = acesa;
    this.luzNoTampo.scale.setScalar(0.52 * Math.min(1, this.forcaDaChama) * (0.94 + 0.06 * pulso));
    // o calor sobe devagar com a chama e esfria mais devagar ainda
    this.calor = acesa ? Math.min(1, this.calor + dt * 0.28 * this.forcaDaChama) : Math.max(0, this.calor - dt * 0.12);
    const c = new THREE.Color();
    for (let i = 0; i < this.brasa.count; i++) {
      const tremido = 0.75 + 0.25 * Math.sin(this.relogio * 4.3 + i * 1.7);
      this.brasa.setColorAt(i, c.setScalar(THREE.MathUtils.smoothstep(this.calor, 0.15, 1) * tremido));
    }
    if (this.brasa.instanceColor) this.brasa.instanceColor.needsUpdate = true;
    this.brasa.visible = this.calor > 0.02;
    // O FOGAREIRO TREME enquanto queima: fininho, no ritmo do gás saindo
    this.tremor = this.forcaDaChama * 0.0016;
    this.fogareiro.position.x = -0.14 + Math.sin(this.relogio * 61) * this.tremor;
    this.fogareiro.position.z = Math.cos(this.relogio * 53) * this.tremor;
    // o chiado do gás, emendado (a mesma técnica da mangueira)
    this.proximoGas -= dt;
    if (acesa && this.proximoGas <= 0) {
      this.tocar('gasDoFogareiro');
      this.proximoGas = 0.55;
    }

    this.atualizarPanela(dt);
    this.atualizarCanecas(dt);
    this.atualizarArepas(dt);
    this.graos.update(dt);
    this.vaporDaPanela.update(dt);
    this.fumacaDoBudare.update(dt);
    for (const v of this.vaporDasCanecas) v.update(dt);
  }

  /** as linguinhas em volta da coroa: em pé (boca livre) ou deitando para fora (abafadas) */
  private abrirLinguas(abafo: number): void {
    const inclina = 0.55 + 0.75 * abafo;
    const raio = 0.021 + 0.004 * abafo;
    for (let i = 0; i < LINGUAS; i++) {
      const a = (i / LINGUAS) * Math.PI * 2;
      this.m.position.set(Math.sin(a) * raio, -0.001, Math.cos(a) * raio);
      this.m.rotation.set(Math.cos(a) * inclina, 0, -Math.sin(a) * inclina);
      this.m.scale.set(0.01 + 0.002 * abafo, 0.026 - 0.006 * abafo, 0.01 + 0.002 * abafo);
      this.m.updateMatrix();
      this.linguinhas.setMatrixAt(i, this.m.matrix);
    }
    this.linguinhas.instanceMatrix.needsUpdate = true;
    this.abafoDasLinguas = abafo;
  }

  private panelaNaBoca(): boolean {
    return this.panela.parent === this.mesinha && this.panela.position.distanceTo(BOCA) < 0.01;
  }

  private atualizarPanela(dt: number): void {
    const naBoca = this.panelaNaBoca();
    const aquece = naBoca && this.nivelDaPanela > 0.05 ? THREE.MathUtils.smoothstep(this.calor, 0.5, 0.92) : 0;
    this.fervura += (aquece - this.fervura) * Math.min(1, dt * 2);
    // o líquido: o disco na altura do nível, e a cor
    this.liquidoDaPanela.visible = this.nivelDaPanela > 0.02;
    const y = 0.012 + this.nivelDaPanela * 0.06;
    this.liquidoDaPanela.position.y = y + Math.sin(this.relogio * 9) * 0.0008 * this.fervura;
    pintar(this.liquidoDaPanela, this.corDaPanela);
    this.redemoinho.position.y = y + 0.0012;
    this.redemoinho.visible = this.mexendo > 0.01 && this.liquidoDaPanela.visible;
    this.redemoinho.rotation.y -= dt * 6 * this.mexendo;
    // AS BOLHAS: nascem no fundo, sobem e estouram na superfície — só de tampa aberta se vê
    const vendo = this.tampaAberta || !this.tampaNaBoca;
    const nBolhas = vendo ? Math.round(this.bolhas.count * this.fervura) : 0;
    for (let i = 0; i < this.bolhas.count; i++) {
      const k = (this.relogio * (1.6 + (i % 4) * 0.35) + i * 0.37) % 1;
      const a = i * 2.39996;
      const r = Math.sqrt(((i * 7) % 11) / 11) * 0.045;
      this.m.position.set(Math.cos(a) * r, y + 0.001, Math.sin(a) * r);
      this.m.rotation.set(0, 0, 0);
      const s = i < nBolhas ? 0.004 + 0.004 * Math.sin(k * Math.PI) : 0;
      this.m.scale.set(s, s * 0.7, s);
      this.m.updateMatrix();
      this.bolhas.setMatrixAt(i, this.m.matrix);
    }
    this.bolhas.instanceMatrix.needsUpdate = true;
    this.bolhas.visible = nBolhas > 0;
    this.proximaBolha -= dt;
    if (this.fervura > 0.45 && this.proximaBolha <= 0) {
      this.tocar('bolha');
      this.proximaBolha = 0.5 + Math.random() * 0.5;
    }
    // A TAMPA SACODE quando ferve: pula um tico na dobradiça e assenta
    if (this.tampaNaBoca && !this.tampaAberta) {
      const sacode = THREE.MathUtils.smoothstep(this.fervura, 0.55, 1);
      this.tampa.rotation.z = -Math.abs(Math.sin(this.relogio * 17)) * 0.08 * sacode;
      this.tampa.position.y = 0.08 + Math.abs(Math.sin(this.relogio * 13.3)) * 0.003 * sacode;
      this.proximaTampa -= dt;
      if (sacode > 0.3 && this.proximaTampa <= 0) {
        this.tocar('tampaTremendo');
        this.proximaTampa = 0.42 + Math.random() * 0.3;
      }
    }
    // o vapor: pela beira da tampa (fechada) ou da boca toda (aberta)
    this.vaporDaPanela.forca = naBoca ? THREE.MathUtils.smoothstep(this.calor, 0.35, 0.9) * (this.nivelDaPanela > 0.05 ? 1 : 0.2) : this.fervura * 0.5;
    // o miojo amolecendo: o tijolo afunda e encolhe, os fios abrem
    if (this.bloco.visible || this.fios.visible) {
      const k = this.amolecer;
      this.bloco.scale.set(1 - k * 0.5, Math.max(0.05, 1 - k), 1 - k * 0.5);
      this.bloco.position.y = y - 0.004;
      this.bloco.visible = k < 0.98;
      const rnd = sorteio(31);
      for (let i = 0; i < this.fios.count; i++) {
        const a = rnd() * Math.PI * 2;
        const r = (0.006 + rnd() * 0.036) * (0.4 + 0.6 * k);
        this.m.position.set(Math.cos(a) * r, y + 0.002 + rnd() * 0.006, Math.sin(a) * r);
        this.m.rotation.set(Math.PI / 2 + (rnd() - 0.5) * 0.6, rnd() * 6.28 + this.mexendo * this.relogio, (rnd() - 0.5) * 0.4);
        this.m.scale.setScalar(Math.max(0.0001, k) * (0.7 + rnd() * 0.5));
        this.m.updateMatrix();
        this.fios.setMatrixAt(i, this.m.matrix);
      }
      this.fios.instanceMatrix.needsUpdate = true;
      this.fios.visible = k > 0.02;
    }
  }

  private atualizarCanecas(dt: number): void {
    for (let i = 0; i < this.canecas.length; i++) {
      const l = this.liquidoDasCanecas[i];
      l.visible = this.nivelDasCanecas[i] > 0.02;
      l.position.y = 0.018 + this.nivelDasCanecas[i] * 0.05;
      pintar(l, this.corDasCanecas[i]);
      // quente esfria devagar: um minuto e meio de vapor
      this.calorDasCanecas[i] = Math.max(0, this.calorDasCanecas[i] - dt / 90);
      this.vaporDasCanecas[i].forca = l.visible ? this.calorDasCanecas[i] : 0;
    }
    // os marshmallows boiando na caneca: sobem e descem de leve e giram devagar
    const caneca = new THREE.Vector3();
    for (let j = 0; j < this.marshmallows.count; j++) {
      const mm = this.mallows[j];
      if (!mm) {
        this.m.scale.setScalar(0);
      } else {
        const c = this.canecas[mm.caneca];
        mm.t = Math.min(1, mm.t + dt * 2.2);
        c.updateWorldMatrix(true, false);
        caneca.set(mm.x, 0.018 + this.nivelDasCanecas[mm.caneca] * 0.05 + 0.004 + Math.sin(this.relogio * 2 + j) * 0.0015, mm.z);
        c.localToWorld(caneca);
        this.mesinha.worldToLocal(caneca);
        // caindo de cima até boiar
        caneca.y += (1 - mm.t) * 0.12;
        this.m.position.copy(caneca);
        this.m.rotation.set(0.3 * Math.sin(j), this.relogio * 0.4 + j, 0.2);
        this.m.scale.setScalar(ESC);
      }
      this.m.updateMatrix();
      this.marshmallows.setMatrixAt(j, this.m.matrix);
    }
    this.marshmallows.instanceMatrix.needsUpdate = true;
    this.marshmallows.visible = this.mallows.length > 0;
  }

  private atualizarArepas(dt: number): void {
    const noFogo = this.budareNaBoca && this.calor > 0.25;
    let fritando = false;
    for (const a of this.arepas) {
      if (!a.noBudare || !noFogo) continue;
      // doura o lado de BAIXO
      const k = dt * 0.17 * this.calor;
      if (a.virada) a.b = Math.min(1, a.b + k);
      else a.a = Math.min(1, a.a + k);
      fritando = true;
    }
    if (this.tablete.parent === this.budare) fritando = fritando || noFogo;
    this.fumacaDoBudare.forca = fritando ? 0.7 : this.budareNaBoca ? this.calor * 0.25 : 0;
    this.proximoFrito -= dt;
    if (fritando && this.proximoFrito <= 0) {
      this.tocar('fritar');
      this.proximoFrito = 0.7 + Math.random() * 0.35;
    }
    this.desenharArepas();
  }

  /** a cor de massa de milho por quanto cozinhou (crua → dourada) */
  private corDaArepa(k: number, alvo: THREE.Color): THREE.Color {
    return alvo.setHex(P.arepaCrua).lerp(new THREE.Color(P.arepaDourada), THREE.MathUtils.smoothstep(k, 0, 1));
  }

  private desenharArepas(): void {
    // as que estão no prato andam com ele (a cena leva o prato para a canga)
    if (this.arepas.some((a) => a.noPrato)) {
      this.prato.updateWorldMatrix(true, false);
      this.mesinha.updateWorldMatrix(true, false);
      for (const a of this.arepas) {
        if (!a.noPrato) continue;
        a.pos.copy(a.noPrato);
        this.prato.localToWorld(a.pos);
        this.mesinha.worldToLocal(a.pos);
      }
    }
    const q = new THREE.Quaternion();
    const giro = new THREE.Euler();
    const cor = new THREE.Color();
    const s = new THREE.Vector3();
    this.arepas.forEach((a, i) => {
      // o giro de virar: meia volta em X, e a arepa de cabeça para baixo depois
      const angulo = (a.virada ? Math.PI : 0) + a.giro * Math.PI;
      giro.set(angulo, i * 1.3, 0);
      q.setFromEuler(giro);
      s.setScalar(a.visivel ? 1 : 0);
      const base = new THREE.Matrix4().compose(a.pos, q, s);
      this.corpoDasArepas.setMatrixAt(i, base);
      this.corpoDasArepas.setColorAt(i, this.corDaArepa((a.a + a.b) * 0.5 * 0.7, cor));
      // as tampas: A embaixo (y −0,009) e B em cima (+0,009), cada uma com a cor do seu lado
      for (const [lado, y, k] of [[0, -0.0091, a.a], [1, 0.0091, a.b]] as const) {
        const local = new THREE.Matrix4().compose(new THREE.Vector3(0, y, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(lado === 0 ? Math.PI : 0, 0, 0)), new THREE.Vector3(1, 1, 1));
        const m = base.clone().multiply(local);
        this.tampasDasArepas.setMatrixAt(i * 2 + lado, m);
        this.tampasDasArepas.setColorAt(i * 2 + lado, this.corDaArepa(k, cor));
        // a marca do tostado cresce do meio conforme doura
        const marca = THREE.MathUtils.smoothstep(k, 0.35, 1);
        const mm = m.clone().multiply(new THREE.Matrix4().compose(new THREE.Vector3(0, 0.0004, 0), new THREE.Quaternion(), new THREE.Vector3(marca, 1, marca)));
        this.marcasDasArepas.setMatrixAt(i * 2 + lado, a.visivel ? mm : new THREE.Matrix4().makeScale(0, 0, 0));
      }
      // o queijo em cima de quem ganhou: uma fatia que amolece e cai nas beiradas
      const qk = a.queijo;
      const fatia = new THREE.Matrix4().compose(
        new THREE.Vector3(a.pos.x, a.pos.y + 0.0115 - qk * 0.001, a.pos.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, i * 1.3 + 0.4, 0)),
        new THREE.Vector3(a.visivel && qk > 0 ? 1 + qk * 0.25 : 0, 1 - qk * 0.4, a.visivel && qk > 0 ? 1 + qk * 0.25 : 0),
      );
      this.queijos.setMatrixAt(i, fatia);
    });
    for (const lote of [this.corpoDasArepas, this.tampasDasArepas, this.marcasDasArepas, this.queijos]) {
      lote.instanceMatrix.needsUpdate = true;
      if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
    }
    const alguma = this.arepas.some((a) => a.visivel);
    this.corpoDasArepas.visible = alguma;
    this.tampasDasArepas.visible = alguma;
    this.marcasDasArepas.visible = alguma;
    this.queijos.visible = this.arepas.some((a) => a.visivel && a.queijo > 0);
  }

  private tocar(nome: SomNome): void {
    this.sons[nome] = (this.sons[nome] ?? 0) + 1;
    this.som?.(nome);
  }

  // ===================================================== os passos animados

  private animar(dur: number, passo: (k: number) => void): Promise<void> {
    return new Promise((fim) => this.animacoes.push({ t: 0, dur, passo, fim }));
  }

  private esperar(seg: number): Promise<void> {
    return this.animar(seg, () => undefined);
  }

  /** pega um item do caixote (ou de onde estiver) para o quadro da mesinha */
  private soltar(obj: THREE.Object3D): void {
    if (obj.parent !== this.mesinha) this.mesinha.attach(obj);
  }

  /** o item volta para o lugar exato dele no caixote */
  private async devolver(nome: string, dur = 0.55): Promise<void> {
    const it = this.itens.get(nome);
    if (!it) return;
    this.soltar(it.obj);
    // o lugar de casa, no quadro da mesinha
    it.pai.updateWorldMatrix(true, false);
    const casa = new THREE.Object3D();
    casa.position.copy(it.pos);
    casa.quaternion.copy(it.quat);
    it.pai.add(casa);
    casa.updateWorldMatrix(true, false);
    this.mesinha.attach(casa);
    await this.voar(it.obj, casa.position, casa.quaternion, dur, 0.08);
    casa.removeFromParent();
    it.pai.attach(it.obj);
    it.obj.position.copy(it.pos);
    it.obj.quaternion.copy(it.quat);
  }

  /**
   * VOAR: o item anda num ARCO até o destino (no quadro da mesinha), girando
   * para o giro de chegada — sobe no meio do caminho `altura` metros. A curva
   * é a suave (sai e chega devagar), e o arco é uma parábola.
   */
  private voar(obj: THREE.Object3D, ate: THREE.Vector3, giro: THREE.Quaternion | THREE.Euler, dur = 0.6, altura = 0.06): Promise<void> {
    this.soltar(obj);
    const de = obj.position.clone();
    const q0 = obj.quaternion.clone();
    const q1 = giro instanceof THREE.Quaternion ? giro.clone() : new THREE.Quaternion().setFromEuler(giro);
    const alvo = ate.clone();
    return this.animar(dur, (k) => {
      const s = k * k * (3 - 2 * k);
      obj.position.lerpVectors(de, alvo, s);
      obj.position.y += Math.sin(Math.PI * k) * altura;
      obj.quaternion.slerpQuaternions(q0, q1, s);
    });
  }

  // ------------------------------------------------------------ o fogo

  /** ABRE O GÁS E ACENDE: a manopla gira, duas faíscas, o estouro e a chama assentando */
  async acender(): Promise<void> {
    if (this.gas > 0) return;
    this.etapa = 'acendendo';
    await this.animar(0.5, (k) => {
      this.manopla.rotation.x = -k * 1.4;
    });
    for (const t of [0.12, 0.3]) {
      await this.esperar(t);
      this.tocar('faisca');
      this.faisca.visible = true;
      this.faisca.scale.setScalar(0.05);
      await this.animar(0.09, (k) => this.faisca.scale.setScalar(0.05 * (1 - k) + 0.01));
      this.faisca.visible = false;
    }
    this.tocar('chamaAcende');
    // o estouro: a chama sai maior que o normal e assenta
    this.gas = 1;
    await this.animar(0.35, (k) => {
      this.forcaDaChama = 1 + 0.35 * Math.sin(Math.PI * k);
    });
    this.etapa = 'aceso';
  }

  /** FECHA O GÁS: a manopla volta, a chama encolhe e some com um "puf"; a coroa esfria sozinha */
  async apagar(): Promise<void> {
    if (this.gas <= 0) return;
    this.etapa = 'apagando';
    await this.animar(0.45, (k) => {
      this.manopla.rotation.x = -1.4 * (1 - k);
      this.gas = Math.max(0.0001, 1 - k);
    });
    this.gas = 0;
    this.tocar('chamaApaga');
    this.etapa = 'apagado';
  }

  // ----------------------------------------------------------- a panela

  private async tirarTampa(): Promise<void> {
    if (this.tampaAberta) return;
    this.tampaAberta = true;
    // abre na dobradiça e vai para a mesa, encostada
    await this.animar(0.3, (k) => {
      this.tampa.rotation.z = -k * 1.1;
      this.tampa.position.y = 0.08 + k * 0.01;
    });
    this.tocar('tampaTremendo');
    this.mesinha.attach(this.tampa);
    await this.voar(this.tampa, new THREE.Vector3(-0.005, TAMPO + 0.006, 0.15), new THREE.Euler(0, 0.4, 0.06), 0.5, 0.07);
    this.tampaNaBoca = false;
  }

  private async porTampa(): Promise<void> {
    if (!this.tampaAberta) return;
    const alvo = this.panela.localToWorld(new THREE.Vector3(-0.066, 0.08, 0));
    this.mesinha.worldToLocal(alvo);
    const giro = this.panela.quaternion.clone();
    await this.voar(this.tampa, alvo, giro, 0.5, 0.07);
    this.panela.attach(this.tampa);
    this.tampa.position.set(-0.066, 0.08, 0);
    this.tampa.rotation.set(0, 0, 0);
    this.tampaAberta = false;
    this.tampaNaBoca = true;
    this.tocar('tampaTremendo');
  }

  /** espera a água (ou o leite) chegar na fervura, com um teto de tempo */
  private async ferver(ate = 0.85, maximo = 9): Promise<void> {
    this.etapa = 'fervendo';
    let t = 0;
    while (this.fervura < ate && t < maximo) {
      await this.esperar(0.2);
      t += 0.2;
    }
  }

  /**
   * DESPEJAR: a panela sai do fogo, para do lado da caneca (ou do coador),
   * inclina a boca para ela e o jato corre — o nível da panela desce e o da
   * caneca sobe. `noCoador` passa pelo pano antes, e aí quem cai na caneca
   * são os pingos.
   */
  private async despejar(caneca: number, cor: number, dur = 2.2, noCoador = false, quanto = 0.45): Promise<void> {
    this.etapa = 'despejando';
    const c = this.canecas[caneca];
    const topo = c.position.clone().add(new THREE.Vector3(0, 0.075 * ESC, 0));
    /*
     * ONDE A PANELA PARA: inclinada 0,95 rad, a beira da boca (o bico) fica
     * ~16 cm à frente do centro dela e um tico abaixo — então a panela para
     * esse tanto ANTES da caneca, para o fio cair no meio dela (ou do coador).
     */
    const deLado = new THREE.Vector3(-0.155, noCoador ? 0.21 + ALTURA_DO_COADOR : 0.15, 0.035);
    const dir = Math.atan2(deLado.z, -deLado.x);
    const posicao = topo.clone().add(deLado);
    await this.voar(this.panela, posicao, new THREE.Euler(0, dir, 0), 0.6, 0.05);
    const corDoJato = new THREE.Color(noCoador ? P.aguaDaPanela : cor);
    pintar(this.jato, corDoJato);
    const nivel0 = this.nivelDaPanela;
    const caneca0 = this.nivelDasCanecas[caneca];
    const corAntes = this.corDasCanecas[caneca].clone();
    const corDepois = new THREE.Color(cor);
    const boca = new THREE.Vector3();
    const fundo = new THREE.Vector3();
    const baixo = new THREE.Vector3(0, -1, 0);
    this.tocar('despejar');
    await this.animar(dur, (k) => {
      // inclina, segura e volta
      const inclina = Math.min(1, k * 4) * Math.min(1, (1 - k) * 5);
      this.panela.rotation.set(0, dir, -0.95 * inclina, 'XYZ');
      this.panela.updateMatrix();
      boca.set(0.066, 0.08, 0).applyMatrix4(this.panela.matrix);
      const corre = inclina > 0.6 ? THREE.MathUtils.smoothstep(inclina, 0.6, 1) : 0;
      // o fio cai até a superfície (do coador ou da caneca)
      // (no coador, a borra: 4 cm abaixo do aro)
      const superficie = noCoador ? topo.y + ALTURA_DO_COADOR - 0.04 : topo.y - 0.075 * ESC + 0.03 + this.nivelDasCanecas[caneca] * 0.05 * ESC;
      fundo.set(topo.x + Math.sin(this.relogio * 13) * 0.002, superficie, topo.z);
      this.jato.visible = corre > 0.05;
      if (this.jato.visible) {
        // o fio: do bico até a superfície, mais grosso quanto mais corre
        this.m.position.copy(boca);
        this.m.quaternion.setFromUnitVectors(baixo, fundo.clone().sub(boca).normalize());
        this.m.scale.set(0.0048 * corre, boca.distanceTo(fundo), 0.0048 * corre);
        this.m.updateMatrix();
        this.jato.setMatrixAt(0, this.m.matrix);
        this.jato.instanceMatrix.needsUpdate = true;
      }
      this.nivelDaPanela = nivel0 - Math.min(nivel0, quanto) * THREE.MathUtils.smoothstep(k, 0.2, 0.8);
      // a caneca enche (pelo coador, um tico atrasada)
      const enche = THREE.MathUtils.smoothstep(k, noCoador ? 0.35 : 0.22, noCoador ? 1 : 0.85);
      this.nivelDasCanecas[caneca] = caneca0 + (0.9 - caneca0) * enche;
      this.corDasCanecas[caneca].copy(corAntes).lerp(corDepois, caneca0 > 0.05 ? enche : 1);
      this.calorDasCanecas[caneca] = Math.max(this.calorDasCanecas[caneca], enche);
      if (noCoador && k > 0.3 && k < 0.97 && Math.random() < 0.5) {
        // os pingos do fundo do pano
        this.graos.soltar(new THREE.Vector3(topo.x, topo.y + ALTURA_DO_COADOR - 0.1, topo.z), P.cafeCoado, topo.y - 0.075 * ESC + 0.03 + this.nivelDasCanecas[caneca] * 0.05 * ESC, 0.004, 0.003);
      }
    });
    this.jato.visible = false;
    this.calorDasCanecas[caneca] = 1;
  }

  /** a panela volta para cima do fogareiro */
  private async panelaNoFogo(): Promise<void> {
    await this.voar(this.panela, BOCA, new THREE.Euler(0, 0, 0), 0.55, 0.06);
    this.panela.position.copy(BOCA);
    this.panela.rotation.set(0, 0, 0);
  }

  /** a panela desce para a grama do lado da mesa (para o budare entrar no fogo) */
  private async panelaNoChao(): Promise<void> {
    await this.voar(this.panela, new THREE.Vector3(-0.14, 0.003, 0.42), new THREE.Euler(0, 0.5, 0), 0.7, 0.1);
  }

  /** um item do caixote vai para cima de um ponto, inclina e "despeja" grãos */
  private async polvilhar(nome: string, sobre: THREE.Vector3, cor: number, chao: number, vezes = 1, inclina = 1.9): Promise<void> {
    const it = this.itens.get(nome);
    if (!it) return;
    const obj = it.obj;
    await this.voar(obj, sobre.clone().add(new THREE.Vector3(-0.03, 0.08, 0)), new THREE.Euler(0, 0, 0), 0.6, 0.07);
    for (let v = 0; v < vezes; v++) {
      await this.animar(0.3, (k) => obj.rotation.set(0, 0, -inclina * k));
      this.tocar('respingo');
      for (let i = 0; i < 9; i++) this.graos.soltar(sobre.clone().add(new THREE.Vector3(0.012, 0.06, 0)), cor, chao, 0.02, 0.0034);
      await this.esperar(0.35);
      await this.animar(0.25, (k) => obj.rotation.set(0, 0, -inclina * (1 - k)));
    }
  }

  // ============================================================== receitas

  /** prepara um prato inteiro; resolve com tudo pronto (e o fogo apagado) */
  async preparar(prato: PratoDoFogareiro): Promise<void> {
    if (this.fazendo) return;
    this.fazendo = prato;
    try {
      if (prato === 'cafe') await this.fazerCafe();
      else if (prato === 'chocolate') await this.fazerChocolate();
      else if (prato === 'miojo') await this.fazerMiojo();
      else await this.fazerArepas();
    } finally {
      this.etapa = 'pronto';
      this.fazendo = null;
    }
  }

  /** a panelinha começa com água (ou leite) e tampada, em cima do fogo */
  private encher(cor: number, nivel: number): void {
    this.nivelDaPanela = nivel;
    this.corDaPanela.setHex(cor);
  }

  /**
   * O CAFÉ COADO, do jeito de acampamento: a água ferve na panelinha
   * (tampada, sacudindo), o coador de pano vai para cima da primeira caneca,
   * o pó cai nele, a água quente passa e o café pinga na caneca — e o coador
   * muda para a segunda.
   */
  private async fazerCafe(): Promise<void> {
    if (!this.panelaNaBoca()) await this.panelaNoFogo();
    if (this.tampaAberta) await this.porTampa();
    this.encher(P.aguaDaPanela, 0.85);
    await this.acender();
    await this.ferver();
    await this.tirarTampa();
    for (const i of [0, 1]) {
      const c = this.canecas[i];
      // o coador fica EM CIMA da caneca, o aro 3,4 cm acima da boca: o saco de
      // pano aparece entre o aro e a beira (encaixado rente, só se via o arame)
      const topo = c.position.clone().add(new THREE.Vector3(0, 0.075 * ESC + ALTURA_DO_COADOR, 0));
      this.etapa = 'coador';
      await this.voar(this.coador, topo, new THREE.Euler(0, Math.PI * 0.6, 0), 0.6, 0.06);
      if (i === 0) {
        this.etapa = 'po-de-cafe';
        await this.polvilhar('pacote-de-cafe', topo.clone(), P.cafeCoado, topo.y - 0.04, 1, 1.8);
        this.borra.visible = true;
        void this.devolver('pacote-de-cafe');
      }
      await this.despejar(i, P.cafeCoado, 2.6, true, 0.38);
    }
    await this.panelaNoFogo();
    await this.apagar();
    await this.devolver('coador');
    this.borra.visible = false;
    await this.porTampa();
    this.nivelDaPanela = 0.1;
  }

  /**
   * O CHOCOLATE QUENTE: o leite esquenta (sem tampa: leite ferve e sobe), a
   * lata e a colher vêm do caixote, três colheradas de pó caem no leite, a
   * colher mexe em roda até ele ficar marrom, despeja nas duas canecas e cai
   * marshmallow em cima — dois brancos e um rosa em cada uma.
   */
  private async fazerChocolate(): Promise<void> {
    if (!this.panelaNaBoca()) await this.panelaNoFogo();
    await this.tirarTampa();
    this.encher(P.leiteQuente, 0.8);
    await this.acender();
    await this.esperar(1.2);
    const boca = BOCA.clone().add(new THREE.Vector3(0, 0.012 + this.nivelDaPanela * 0.06 * ESC, 0));
    this.etapa = 'po-de-chocolate';
    const lata = this.itens.get('lata-de-chocolate')!.obj;
    // a lata pousa no fundo da mesinha (na frente fica a tampa da panela)
    const naMesa = new THREE.Vector3(0.035, TAMPO + 0.005, -0.15);
    await this.voar(lata, naMesa, new THREE.Euler(0, 0.6, 0), 0.6, 0.08);
    const colher = this.itens.get('colher')!.obj;
    const leite = new THREE.Color(P.leiteQuente);
    const choco = new THREE.Color(P.chocolateQuente);
    for (let v = 0; v < 3; v++) {
      // mergulha na lata, vai até a panela e vira
      await this.voar(colher, naMesa.clone().add(new THREE.Vector3(0, 0.055, 0)), new THREE.Euler(0.3, 0, 0), 0.4, 0.05);
      this.tocar('colherNaCaneca');
      await this.voar(colher, boca.clone().add(new THREE.Vector3(0.01, 0.04, 0)), new THREE.Euler(0.2, 0, 0), 0.45, 0.06);
      await this.animar(0.25, (k) => colher.rotation.set(0.2, 0, -1.6 * k));
      for (let i = 0; i < 8; i++) this.graos.soltar(boca.clone().add(new THREE.Vector3(0.02, 0.035, 0)), P.chocolateQuente, boca.y, 0.014, 0.0035);
      await this.esperar(0.3);
      this.corDaPanela.copy(leite).lerp(choco, 0.28 * (v + 1));
    }
    // mexe em roda: a colher dá três voltas e o redemoinho gira no leite
    this.etapa = 'mexendo';
    void this.devolver('lata-de-chocolate');
    const de = this.corDaPanela.clone();
    this.mexendo = 1;
    await this.animar(2.4, (k) => {
      const a = k * Math.PI * 2 * 3;
      colher.position.set(BOCA.x + Math.cos(a) * 0.035, boca.y + 0.02, BOCA.z + Math.sin(a) * 0.035);
      colher.rotation.set(0.25, -a, 0.35);
      this.corDaPanela.copy(de).lerp(choco, k);
      if (Math.floor(k * 12) !== Math.floor((k - 0.01) * 12)) this.tocar('colherNaCaneca');
    });
    this.mexendo = 0;
    await this.devolver('colher');
    await this.ferver(0.5, 4);
    for (const i of [0, 1]) await this.despejar(i, P.chocolateQuente, 2.0, false, 0.36);
    await this.panelaNoFogo();
    await this.apagar();
    // os marshmallows: o saquinho vem e cai três em cada caneca
    this.etapa = 'marshmallow';
    const saquinho = this.itens.get('saquinho')!.obj;
    for (const i of [0, 1]) {
      const c = this.canecas[i];
      await this.voar(saquinho, c.position.clone().add(new THREE.Vector3(-0.02, 0.24, 0)), new THREE.Euler(0, 0, -2.2), 0.5, 0.05);
      for (let j = 0; j < 3; j++) {
        this.mallows.push({ caneca: i, t: 0, x: (j - 1) * 0.013, z: (j % 2 ? 0.01 : -0.008) });
        this.tocar('pingo');
        await this.esperar(0.18);
      }
    }
    await this.devolver('saquinho');
    await this.porTampa();
    this.nivelDaPanela = 0.06;
  }

  /**
   * O MIOJO: a água ferve tampada, a tampa sai, o tijolinho de macarrão cai
   * na água (respinga), amolece e solta os fios enquanto o garfo mexe, o
   * sachê rasga e o tempero laranja tinge o caldo. Ele se come da panelinha
   * mesmo, os dois com garfo.
   */
  private async fazerMiojo(): Promise<void> {
    if (!this.panelaNaBoca()) await this.panelaNoFogo();
    if (this.tampaAberta) await this.porTampa();
    this.encher(P.aguaDaPanela, 0.7);
    await this.acender();
    await this.ferver();
    await this.tirarTampa();
    const boca = BOCA.clone().add(new THREE.Vector3(0, 0.012 + this.nivelDaPanela * 0.06 * ESC, 0));
    this.etapa = 'macarrao';
    const pacote = this.itens.get('miojo')!.obj;
    await this.voar(pacote, boca.clone().add(new THREE.Vector3(0.02, 0.12, 0)), new THREE.Euler(0, 0, -0.5), 0.6, 0.06);
    // o tijolo sai do pacote e cai na água
    this.bloco.visible = true;
    this.amolecer = 0;
    const deCima = new THREE.Vector3(0, 0.16, 0);
    await this.animar(0.4, (k) => {
      this.bloco.position.set(0, deCima.y * (1 - k * k) + 0.05 * k * k, 0);
    });
    this.tocar('respingo');
    for (let i = 0; i < 10; i++) {
      this.graos.soltar(boca.clone(), P.aguaDaPanela, boca.y - 0.01, 0.06, 0.003, new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.55, (Math.random() - 0.5) * 0.4));
    }
    void this.devolver('miojo');
    // amolece enquanto o garfo mexe
    this.etapa = 'amolecendo';
    const garfo = this.itens.get('garfo-1')!.obj;
    await this.voar(garfo, boca.clone().add(new THREE.Vector3(0.03, 0.03, 0)), new THREE.Euler(0.3, 0, 0.5), 0.5, 0.06);
    this.mexendo = 0.6;
    const agua = this.corDaPanela.clone();
    await this.animar(3.2, (k) => {
      this.amolecer = THREE.MathUtils.smoothstep(k, 0.05, 0.85);
      const a = k * Math.PI * 2 * 2.5;
      garfo.position.set(BOCA.x + Math.cos(a) * 0.03, boca.y + 0.025, BOCA.z + Math.sin(a) * 0.03);
      garfo.rotation.set(0.35, -a, 0.4);
      this.corDaPanela.copy(agua).lerp(new THREE.Color(P.macarraoInstantaneo), k * 0.3);
    });
    this.mexendo = 0;
    // o tempero
    this.etapa = 'tempero';
    this.sache.visible = true;
    this.sache.position.copy(boca).add(new THREE.Vector3(-0.01, 0.11, 0));
    this.sache.rotation.set(0, 0, 0);
    await this.animar(0.35, (k) => this.sache.rotation.set(0, 0, -1.5 * k));
    this.tocar('respingo');
    const antes = this.corDaPanela.clone();
    for (let i = 0; i < 14; i++) this.graos.soltar(boca.clone().add(new THREE.Vector3(0.008, 0.1, 0)), P.temperoDeMiojo, boca.y, 0.012, 0.0032);
    await this.animar(1.2, (k) => this.corDaPanela.copy(antes).lerp(new THREE.Color(P.caldoDeMiojo), k));
    this.sache.visible = false;
    await this.esperar(0.6);
    await this.apagar();
    // o garfo fica de pé dentro da panela, para a hora de comer
    await this.voar(garfo, boca.clone().add(new THREE.Vector3(0.02, 0.035, 0.01)), new THREE.Euler(0.25, 0, 0.2), 0.4, 0.03);
    this.panela.attach(garfo);
  }

  /**
   * AS MINI AREPAS: a panelinha desce para a grama, o budare sai do caixote
   * e vai para o fogo, a manteiga derrete nele e chia, as quatro arepas cruas
   * saem do potinho e caem no budare, douram embaixo (a fumacinha, o chiado),
   * a espátula vira uma por uma — a marca do tostado aparece — e duas ganham
   * uma fatia de queijo branco, que amolece. No fim, vão para o prato.
   */
  private async fazerArepas(): Promise<void> {
    if (this.panelaNaBoca()) await this.panelaNoChao();
    this.etapa = 'budare';
    await this.voar(this.budare, BOCA.clone().add(new THREE.Vector3(0, -0.005, 0)), new THREE.Euler(0, 0, 0), 0.7, 0.1);
    this.budareNaBoca = true;
    await this.acender();
    await this.esperar(1.2);
    // a manteiga: o tablete voa, cai no budare e derrete
    this.etapa = 'manteiga';
    const mt = this.itens.get('manteigueira')!.obj;
    // a manteigueira pousa no fundo da mesinha (a frente é do prato)
    await this.voar(mt, new THREE.Vector3(0.035, TAMPO + 0.003, -0.15), new THREE.Euler(0, 0.4, 0), 0.6, 0.08);
    this.budare.attach(this.tablete);
    await this.voar(this.tablete, this.budare.position.clone().add(new THREE.Vector3(0, 0.02, 0)), new THREE.Euler(0, 0.3, 0), 0.45, 0.06);
    this.budare.attach(this.tablete);
    this.tablete.position.set(0, 0.014, 0);
    this.poca.visible = true;
    this.poca.position.y = 0.0075;
    this.tocar('fritar');
    await this.animar(1.4, (k) => {
      this.tablete.scale.set(1 + k * 0.6, Math.max(0.05, 1 - k), 1 + k * 0.6);
      this.tablete.position.y = 0.0105 + 0.0035 * (1 - k);
      this.poca.scale.setScalar(0.3 + k * 1.1);
    });
    this.tablete.visible = false;
    // as arepas cruas: do potinho para o budare, uma por uma
    this.etapa = 'arepas-no-budare';
    this.cruas.visible = false;
    const potinho = this.itens.get('potinho')!.obj;
    potinho.updateWorldMatrix(true, false);
    const doPote = potinho.localToWorld(new THREE.Vector3(0, 0.05, 0));
    this.mesinha.worldToLocal(doPote);
    const lugares = [[-0.044, -0.042], [0.044, -0.042], [-0.044, 0.044], [0.044, 0.044]] as const;
    for (let i = 0; i < 4; i++) {
      const a = this.arepas[i];
      a.a = 0;
      a.b = 0;
      a.virada = false;
      a.giro = 0;
      a.queijo = 0;
      a.visivel = true;
      a.noBudare = false;
      a.noPrato = null;
      // a tampa de baixo encosta no budare (a superfície dele fica 2 mm acima da boca)
      const alvo = new THREE.Vector3(BOCA.x + lugares[i][0], BOCA.y + 0.0115, BOCA.z + lugares[i][1]);
      const de = doPote.clone();
      await this.animar(0.42, (k) => {
        const s = k * k * (3 - 2 * k);
        a.pos.lerpVectors(de, alvo, s);
        a.pos.y += Math.sin(Math.PI * k) * 0.09;
      });
      a.noBudare = true;
      this.tocar('virar');
    }
    this.etapa = 'dourando';
    await this.esperar(4.2);
    // a espátula vira cada uma
    this.etapa = 'virando';
    const esp = this.itens.get('espatula')!.obj;
    for (let i = 0; i < 4; i++) {
      const a = this.arepas[i];
      const base = a.pos.clone();
      await this.voar(esp, base.clone().add(new THREE.Vector3(0, -0.004, 0.035)), new THREE.Euler(-0.15, 0, 0), 0.32, 0.04);
      await this.animar(0.5, (k) => {
        a.giro = THREE.MathUtils.smoothstep(k, 0, 1);
        a.pos.copy(base);
        a.pos.y += Math.sin(Math.PI * k) * 0.07;
        esp.position.set(base.x, base.y - 0.004 + Math.sin(Math.PI * Math.min(1, k * 1.6)) * 0.05, base.z + 0.035);
        esp.rotation.set(-0.15 - Math.sin(Math.PI * Math.min(1, k * 1.6)) * 0.7, 0, 0);
      });
      a.giro = 0;
      a.virada = true;
      a.pos.copy(base);
      this.tocar('virar');
    }
    void this.devolver('espatula');
    // o queijo em duas
    for (const i of [1, 2]) {
      this.arepas[i].queijo = 0.001;
      await this.animar(0.6, (k) => {
        this.arepas[i].queijo = k;
      });
    }
    await this.esperar(3.4);
    await this.apagar();
    // o prato vem para a mesa e as arepas vão para ele
    this.etapa = 'no-prato';
    await this.voar(this.prato, new THREE.Vector3(0.0, TAMPO + 0.002, 0.14), new THREE.Euler(0, 0, 0), 0.6, 0.08);
    const noPrato = [[-0.03, -0.022], [0.03, -0.022], [-0.022, 0.03], [0.028, 0.03]] as const;
    for (let i = 0; i < 4; i++) {
      const a = this.arepas[i];
      const de = a.pos.clone();
      const alvo = new THREE.Vector3(noPrato[i][0], TAMPO + 0.02 + (i > 1 ? 0.004 : 0), 0.14 + noPrato[i][1]);
      a.noBudare = false;
      await this.animar(0.36, (k) => {
        const s = k * k * (3 - 2 * k);
        a.pos.lerpVectors(de, alvo, s);
        a.pos.y += Math.sin(Math.PI * k) * 0.05;
      });
      this.tocar('virar');
      // daqui em diante ela mora no prato
      this.prato.updateWorldMatrix(true, false);
      a.noPrato = this.prato.worldToLocal(this.mesinha.localToWorld(a.pos.clone()));
    }
    void this.devolver('manteigueira');
    // um respiro com o prato pronto na mesa, antes de a tela piscar
    this.etapa = 'arepas-prontas';
    await this.esperar(1.4);
  }

  // ======================================================== depois de comer

  /** quanto sobrou no prato (a cena tira uma para cada mão) */
  tirarArepaDoPrato(): void {
    const a = [...this.arepas].reverse().find((x) => x.visivel && x.noPrato);
    if (a) a.visivel = false;
  }

  /**
   * ARRUMA A COZINHA: tudo volta para o lugar — as canecas lavadas e vazias
   * na mesinha, a panelinha tampada no fogareiro, o budare e o prato no
   * caixote, as arepas comidas. É o que a cena chama quando os dois levantam
   * da canga (as canecas e a panelinha voltam das mãos e da canga para cá).
   */
  arrumar(casaDasCanecas: ReadonlyArray<readonly [number, number, number, number]>): void {
    this.canecas.forEach((c, i) => {
      this.mesinha.add(c);
      const [x, y, z, r] = casaDasCanecas[i];
      c.position.set(x, y, z);
      c.rotation.set(0, r, 0);
      c.scale.setScalar(ESC);
      this.nivelDasCanecas[i] = 0;
      this.calorDasCanecas[i] = 0;
    });
    this.mallows.length = 0;
    this.mesinha.add(this.panela);
    this.panela.position.copy(BOCA);
    this.panela.rotation.set(0, 0, 0);
    this.panela.scale.setScalar(ESC);
    const garfo = this.itens.get('garfo-1');
    if (garfo && garfo.obj.parent !== garfo.pai) {
      garfo.pai.add(garfo.obj);
      garfo.obj.position.copy(garfo.pos);
      garfo.obj.quaternion.copy(garfo.quat);
    }
    if (this.tampaAberta || this.tampa.parent !== this.panela) {
      this.panela.add(this.tampa);
      this.tampa.position.set(-0.066, 0.08, 0);
      this.tampa.rotation.set(0, 0, 0);
      this.tampaAberta = false;
      this.tampaNaBoca = true;
    }
    this.nivelDaPanela = 0;
    this.bloco.visible = false;
    this.fios.visible = false;
    this.amolecer = 0;
    for (const nome of ['budare', 'prato', 'manteigueira']) {
      const it = this.itens.get(nome);
      if (!it) continue;
      it.pai.add(it.obj);
      it.obj.position.copy(it.pos);
      it.obj.quaternion.copy(it.quat);
    }
    this.budareNaBoca = false;
    this.tablete.visible = true;
    this.tablete.scale.setScalar(1);
    this.itens.get('manteigueira')!.obj.add(this.tablete);
    this.tablete.position.set(0, 0.014, 0);
    this.tablete.rotation.set(0, 0, 0);
    this.poca.visible = false;
    for (const a of this.arepas) {
      a.visivel = false;
      a.noBudare = false;
      a.noPrato = null;
    }
    this.cruas.visible = true;
  }
}
