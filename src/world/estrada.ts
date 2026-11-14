import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { asfalto, calcadaDePedrinha, novaTextura } from './texturasDeChao';
import { quina } from './lojaDeRoupas';
import { PISTA } from '../eventos/bebitoMobile/rota';

/**
 * ====================================================== AS PEÇAS DA ESTRADA
 *
 * A pista e o que mora nela, para a viagem de carro do Bebito Mobile
 * (`scenes/viagemDeCarro.ts`, `docs/BEBITO-MOBILE.md`): o asfalto em trechos,
 * a faixa de pedestres, as placas, os cones, o cavalete, a lombada, o buraco,
 * a poça, o semáforo, os corações de pegar e a roda gigante ao longe.
 *
 * A PISTA É CURVA, então nada aqui é uma caixa comprida: a cena entrega a
 * função `naPista(s, l, y)` — o ponto do mundo que fica a `s` metros do
 * começo e `l` metros para a direita do meio — e as fitas (asfalto, calçada,
 * pintura) são costuradas por ela, de dois em dois metros.
 *
 * O que se repete é LOTE (cones, corações, respingos), com a cor nos
 * vértices quando a peça tem mais de uma (o cone laranja de faixa branca).
 */

/** o ponto do mundo em `s` (ao longo) e `l` (para a direita), na altura `y` */
export type NaPista = (s: number, l: number, y?: number) => THREE.Vector3;

const V = THREE.Vector3;

// ====================================================================== fitas

/** uma fita de `l0` a `l1`, de `s0` a `s1`, na altura `y`; o UV é em metros (`l`, `s`) */
function fita(naPista: NaPista, s0: number, s1: number, l0: number, l1: number, y: number, passo = 2): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const n = Math.max(1, Math.round((s1 - s0) / passo));
  for (let k = 0; k < n; k++) {
    const sa = s0 + ((s1 - s0) * k) / n;
    const sb = s0 + ((s1 - s0) * (k + 1)) / n;
    const a = naPista(sa, l0, y);
    const b = naPista(sa, l1, y);
    const c = naPista(sb, l1, y);
    const d = naPista(sb, l0, y);
    // (a face olha para cima: a pista anda para o −Z e o `l` cresce para o +X)
    for (const [p, u, v] of [[a, l0, sa], [b, l1, sa], [c, l1, sb], [a, l0, sa], [c, l1, sb], [d, l0, sb]] as Array<[THREE.Vector3, number, number]>) {
      pos.push(p.x, p.y, p.z);
      uv.push(u, v);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

/** a face em pé da guia: de `y0` a `y1`, na linha `l`, virada para a pista */
function espelhoDaGuia(naPista: NaPista, s0: number, s1: number, l: number, y0: number, y1: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const n = Math.max(1, Math.round((s1 - s0) / 2));
  const lado = l > 0 ? 1 : -1;
  for (let k = 0; k < n; k++) {
    const sa = s0 + ((s1 - s0) * k) / n;
    const sb = s0 + ((s1 - s0) * (k + 1)) / n;
    const a = naPista(sa, l, y0);
    const b = naPista(sb, l, y0);
    const c = naPista(sb, l, y1);
    const d = naPista(sa, l, y1);
    // (a guia da direita olha para a esquerda, para a pista; a da esquerda, para a direita)
    const quad = lado > 0 ? [a, c, b, a, d, c] : [a, b, c, a, c, d];
    for (const p of quad) {
      pos.push(p.x, p.y, p.z);
      uv.push(p.y, 0);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

/** a altura da calçada sobre o asfalto */
export const ALTO_DA_CALCADA = 0.12;

/**
 * UM TRECHO DE ESTRADA, de `s0` a `s1`: o asfalto de guia a guia, as duas
 * calçadas (um degrau acima, com o espelho da guia) e a pintura — as duas
 * linhas de bordo e o tracejado do meio. Três malhas por trecho; a cena monta
 * a estrada em trechos de 40 m para o que ficou para trás não ser desenhado.
 */
export function trechoDeEstrada(naPista: NaPista, s0: number, s1: number): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'trecho-de-estrada';
  const { meia, calcada } = PISTA;
  const pista = new THREE.Mesh(fita(naPista, s0, s1, -meia, meia, 0.02), toon(P.asphalt, { mapa: asfalto() }));
  pista.userData.semSombra = true;
  pista.receiveShadow = true;
  g.add(pista);
  const calcadas: THREE.BufferGeometry[] = [];
  for (const lado of [-1, 1]) {
    calcadas.push(fita(naPista, s0, s1, lado > 0 ? meia : -meia - calcada, lado > 0 ? meia + calcada : -meia, ALTO_DA_CALCADA));
    calcadas.push(espelhoDaGuia(naPista, s0, s1, lado * meia, 0.02, ALTO_DA_CALCADA));
  }
  const passeio = new THREE.Mesh(mergeGeometries(calcadas), toon(P.concrete, { mapa: calcadaDePedrinha() }));
  passeio.userData.semSombra = true;
  passeio.receiveShadow = true;
  g.add(passeio);
  // a pintura: as linhas de bordo, inteiras, e o tracejado do meio (2 m a cada 5)
  const tinta: THREE.BufferGeometry[] = [];
  for (const lado of [-1, 1]) tinta.push(fita(naPista, s0, s1, lado * (meia - 0.3) - 0.06, lado * (meia - 0.3) + 0.06, 0.03));
  for (let s = Math.ceil(s0 / 5) * 5; s < s1; s += 5) tinta.push(fita(naPista, s, Math.min(s1, s + 2), -0.07, 0.07, 0.03, 1));
  const pintura = new THREE.Mesh(mergeGeometries(tinta), toon(P.metalWhite, { decal: true }));
  pintura.renderOrder = 2;
  pintura.userData.semSombra = true;
  g.add(pintura);
  return g;
}

/**
 * A FAIXA DE PEDESTRES em `s`: as barras brancas atravessando a pista e, um
 * pouco antes, a linha de retenção (é ali que o carro para). `LINHA_DE_PARADA`
 * é o quanto ela fica antes do meio da faixa.
 */
export const LINHA_DE_PARADA = 3.4;
export function faixaDePedestres(naPista: NaPista, s: number): THREE.Mesh {
  const tinta: THREE.BufferGeometry[] = [];
  const barras = 9;
  const vao = (PISTA.meia * 2 - 0.5) / barras;
  for (let k = 0; k < barras; k++) {
    const l = -PISTA.meia + 0.25 + (k + 0.5) * vao;
    tinta.push(fita(naPista, s - 1.5, s + 1.5, l - vao * 0.29, l + vao * 0.29, 0.032, 1.5));
  }
  tinta.push(fita(naPista, s - LINHA_DE_PARADA - 0.2, s - LINHA_DE_PARADA + 0.2, -PISTA.meia + 0.3, PISTA.meia - 0.3, 0.032, 1));
  const faixa = new THREE.Mesh(mergeGeometries(tinta), toon(P.metalWhite, { decal: true }));
  faixa.renderOrder = 3;
  faixa.userData.semSombra = true;
  faixa.userData.peca = 'faixa-de-pedestres';
  return faixa;
}

// ===================================================================== placas

export type DesenhoDaPlaca = 'patos' | 'tigres' | 'lombada' | 'obra' | 'semaforo' | 'buracos' | 'rega'
  // (a zona escolar da rota da escola: as crianças andando, a bola, a câmera de foto e o velocímetro)
  | 'escola' | 'bola' | 'foto' | 'radar';

/** a placa de advertência: o losango amarelo de borda preta, com o desenho no meio */
function texturaDaPlaca(desenho: DesenhoDaPlaca): THREE.CanvasTexture {
  return novaTextura(`placa-de-transito:${desenho}`, 1, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = '#f7c531';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#2a2a2e';
    ctx.lineWidth = s * 0.05;
    ctx.strokeRect(s * 0.06, s * 0.06, s * 0.88, s * 0.88);
    ctx.fillStyle = '#2a2a2e';
    // (o quadrado é pendurado de ponta: o desenho é feito girado 45° para ficar em pé na placa)
    ctx.translate(s / 2, s / 2);
    ctx.rotate(Math.PI / 4);
    const u = s * 0.01;
    const elipse = (x: number, y: number, rx: number, ry: number): void => {
      ctx.beginPath();
      ctx.ellipse(x * u, y * u, rx * u, ry * u, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    const pato = (x: number, y: number, k: number): void => {
      elipse(x, y, 13 * k, 9 * k);
      elipse(x + 11 * k, y - 11 * k, 6.5 * k, 6.5 * k);
      ctx.beginPath();
      ctx.moveTo((x + 16 * k) * u, (y - 12 * k) * u);
      ctx.lineTo((x + 25 * k) * u, (y - 9 * k) * u);
      ctx.lineTo((x + 16 * k) * u, (y - 7 * k) * u);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo((x - 12 * k) * u, (y - 3 * k) * u);
      ctx.lineTo((x - 20 * k) * u, (y - 9 * k) * u);
      ctx.lineTo((x - 9 * k) * u, (y - 7 * k) * u);
      ctx.fill();
    };
    if (desenho === 'patos') {
      pato(-10, -2, 1);
      pato(-22, 16, 0.5);
      pato(-2, 18, 0.5);
      pato(16, 16, 0.5);
    } else if (desenho === 'tigres') {
      // o casco em meia-lua, a cabeça esticada e as quatro patinhas
      ctx.beginPath();
      ctx.ellipse(-2 * u, 2 * u, 20 * u, 15 * u, 0, Math.PI, 0);
      ctx.fill();
      elipse(24, -2, 7, 5.5);
      for (const x of [-14, 10]) ctx.fillRect(x * u, 2 * u, 7 * u, 8 * u);
      ctx.fillRect(-26 * u, 0, 6 * u, 4 * u);
    } else if (desenho === 'lombada') {
      ctx.beginPath();
      ctx.moveTo(-28 * u, 10 * u);
      ctx.quadraticCurveTo(0, -24 * u, 28 * u, 10 * u);
      ctx.fill();
      ctx.fillRect(-32 * u, 10 * u, 64 * u, 5 * u);
    } else if (desenho === 'obra') {
      ctx.beginPath();
      ctx.moveTo(-5 * u, -22 * u);
      ctx.lineTo(5 * u, -22 * u);
      ctx.lineTo(16 * u, 14 * u);
      ctx.lineTo(-16 * u, 14 * u);
      ctx.fill();
      ctx.fillRect(-22 * u, 14 * u, 44 * u, 6 * u);
      ctx.fillStyle = '#f7c531';
      ctx.fillRect(-11 * u, -4 * u, 22 * u, 6 * u);
    } else if (desenho === 'semaforo') {
      ctx.beginPath();
      ctx.roundRect(-11 * u, -27 * u, 22 * u, 54 * u, 6 * u);
      ctx.fill();
      for (const [y, cor] of [[-17, '#e2513f'], [0, '#f7c531'], [17, '#4fbf6a']] as const) {
        ctx.fillStyle = cor;
        elipse(0, y, 6.5, 6.5);
      }
    } else if (desenho === 'rega') {
      // Gota e ondulações: água da rega na pista.
      ctx.beginPath(); ctx.moveTo(0, -27 * u);
      ctx.bezierCurveTo(-34 * u, 9 * u, -15 * u, 23 * u, 0, 23 * u);
      ctx.bezierCurveTo(15 * u, 23 * u, 34 * u, 9 * u, 0, -27 * u); ctx.fill();
      ctx.fillRect(-29 * u, 29 * u, 58 * u, 3 * u);
    } else if (desenho === 'escola') {
      // as duas crianças de mochila andando (a placa de escola de sempre)
      for (const [x, k] of [[-11, 1], [12, 0.82]] as const) {
        elipse(x, -19 * k, 5.5 * k, 5.5 * k);
        ctx.beginPath();
        ctx.moveTo((x - 5 * k) * u, -12 * k * u); ctx.lineTo((x + 5 * k) * u, -12 * k * u);
        ctx.lineTo((x + 4 * k) * u, 8 * k * u); ctx.lineTo((x - 4 * k) * u, 8 * k * u); ctx.fill();
        ctx.fillRect((x + 4 * k) * u, -10 * k * u, 5 * k * u, 11 * k * u); // a mochila
        ctx.lineWidth = 4 * k * u; ctx.strokeStyle = '#2a2a2e';
        ctx.beginPath(); ctx.moveTo((x - 2 * k) * u, 8 * k * u); ctx.lineTo((x - 7 * k) * u, 24 * k * u);
        ctx.moveTo((x + 2 * k) * u, 8 * k * u); ctx.lineTo((x + 6 * k) * u, 24 * k * u); ctx.stroke();
      }
      ctx.fillRect(-30 * u, 26 * u, 60 * u, 3 * u);
    } else if (desenho === 'bola') {
      // a bola de basquete quicando, com as costuras
      elipse(0, -4, 17, 17);
      ctx.strokeStyle = '#f7c531'; ctx.lineWidth = 2.5 * u;
      ctx.beginPath(); ctx.moveTo(-17 * u, -4 * u); ctx.lineTo(17 * u, -4 * u);
      ctx.moveTo(0, -21 * u); ctx.lineTo(0, 13 * u); ctx.stroke();
      ctx.beginPath(); ctx.arc(-24 * u, -4 * u, 15 * u, -0.8, 0.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(24 * u, -4 * u, 15 * u, Math.PI - 0.8, Math.PI + 0.8); ctx.stroke();
      ctx.fillRect(-26 * u, 24 * u, 52 * u, 3 * u);
      for (const x of [-20, 20]) elipse(x, 19, 2.5, 2.5);
    } else if (desenho === 'foto') {
      // a câmera de foto com o flash
      ctx.beginPath(); ctx.roundRect(-24 * u, -12 * u, 48 * u, 32 * u, 5 * u); ctx.fill();
      ctx.fillRect(-9 * u, -19 * u, 18 * u, 8 * u);
      ctx.fillStyle = '#f7c531'; elipse(0, 4, 10, 10);
      ctx.fillStyle = '#2a2a2e'; elipse(0, 4, 6, 6);
      ctx.fillStyle = '#f7c531'; elipse(16, -6, 3, 3);
    } else if (desenho === 'radar') {
      // o velocímetro: o arco, os tracinhos e o ponteiro
      ctx.lineWidth = 5 * u;
      ctx.beginPath(); ctx.arc(0, 8 * u, 24 * u, Math.PI, 0); ctx.stroke();
      ctx.lineWidth = 3 * u;
      for (let k = 0; k <= 6; k++) {
        const a = Math.PI + (k / 6) * Math.PI;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 18 * u, 8 * u + Math.sin(a) * 18 * u); ctx.lineTo(Math.cos(a) * 24 * u, 8 * u + Math.sin(a) * 24 * u); ctx.stroke();
      }
      ctx.lineWidth = 4 * u;
      ctx.beginPath(); ctx.moveTo(0, 8 * u); ctx.lineTo(-12 * u, -6 * u); ctx.stroke();
      elipse(0, 8, 4, 4);
    } else {
      // buracos: a pista com dois furos
      ctx.fillRect(-30 * u, 8 * u, 60 * u, 5 * u);
      elipse(-12, 6, 10, 5);
      elipse(14, 6, 7, 4);
      ctx.fillRect(-3 * u, -24 * u, 6 * u, 18 * u);
      elipse(0, 0, 3.5, 3.5);
    }
  }, 128);
}

/**
 * A PLACA DE ADVERTÊNCIA num poste, na calçada: o losango amarelo com o
 * desenho do que vem (patos, tigres-d'água, lombada, obra, semáforo,
 * buracos). A base no chão; a face olha para o `+Z` (a cena vira para quem
 * chega).
 */
export function placaDeTransito(desenho: DesenhoDaPlaca): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-de-transito';
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 2.5, 8), toon(P.metalGrey));
  poste.position.y = 1.25;
  g.add(poste);
  const lado = 0.78;
  const chapa = new THREE.Mesh(quina(lado, lado, 0.03, 0.012), toon(P.placaVerso));
  chapa.rotation.z = Math.PI / 4;
  chapa.position.set(0, 2.25, 0.03);
  g.add(chapa);
  const tex = texturaDaPlaca(desenho).clone();
  tex.needsUpdate = true;
  tex.repeat.set(1, 1);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(lado - 0.02, lado - 0.02), toon(0xffffff, { mapa: tex }));
  face.rotation.z = Math.PI / 4;
  face.position.set(0, 2.25, 0.047);
  g.add(face);
  return g;
}

/** a placa verde de destino, com o nome e a distância: `VILLA LOBOS · 300 m` */
export function placaDeDestino(texto: string, distancia: string): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-de-destino';
  for (const x of [-0.95, 0.95]) {
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 3.3, 8), toon(P.metalGrey));
    poste.position.set(x, 1.65, 0);
    g.add(poste);
  }
  const tex = novaTextura(`placa-de-destino:${texto}:${distancia}`, 1, (ctx, s) => {
    ctx.fillStyle = '#2f8a5a';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = s * 0.02;
    ctx.beginPath();
    ctx.roundRect(s * 0.03, s * 0.06, s * 0.94, s * 0.88, s * 0.06);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${Math.round(s * 0.2)}px Nunito, sans-serif`;
    ctx.fillText(texto, s / 2, s * 0.36, s * 0.86);
    ctx.font = `800 ${Math.round(s * 0.17)}px Nunito, sans-serif`;
    ctx.fillText(`↑  ${distancia}`, s / 2, s * 0.69, s * 0.86);
  }, 256).clone();
  tex.needsUpdate = true;
  tex.repeat.set(1, 1);
  const chapa = new THREE.Mesh(quina(2.5, 1.05, 0.04, 0.015), toon(P.placaVerso));
  chapa.position.set(0, 2.75, 0.03);
  g.add(chapa);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(2.44, 0.99), toon(0xffffff, { mapa: tex }));
  face.position.set(0, 2.75, 0.052);
  g.add(face);
  return g;
}

// ====================================================================== cones

/** o cone de obra: a base preta, o corpo laranja e a faixa branca — numa geometria, com a cor nos vértices */
function geoDoCone(): THREE.BufferGeometry {
  const corpo = new THREE.CylinderGeometry(0.035, 0.14, 0.52, 10, 4, false).translate(0, 0.29, 0).toNonIndexed();
  const base = new THREE.BoxGeometry(0.36, 0.035, 0.36).translate(0, 0.0175, 0).toNonIndexed();
  const pintar = (geo: THREE.BufferGeometry, cor: (y: number) => number): void => {
    const pos = geo.getAttribute('position');
    const cores = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i += 3) {
      // (a cor é a do meio do triângulo: a faixa sai de quina viva)
      const y = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
      c.setHex(cor(y));
      for (let k = 0; k < 3; k++) cores.set([c.r, c.g, c.b], (i + k) * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  };
  pintar(corpo, (y) => (y > 0.26 && y < 0.4 ? P.metalWhite : P.coneLaranja));
  pintar(base, () => P.casaGrafite);
  for (const geo of [corpo, base]) geo.deleteAttribute('uv');
  return mergeGeometries([corpo, base]);
}

interface Cone {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  giro: THREE.Euler;
  roda: THREE.Vector3;
  solto: boolean;
}

/**
 * OS CONES de uma viagem inteira: um lote. Cone parado não custa conta; o
 * que o carro derruba (`derrubar`) sai voando num arco, rodando, quica e
 * fica deitado na pista.
 */
export class Cones {
  readonly malha: THREE.InstancedMesh;
  private readonly cones: Cone[] = [];
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly um = new V(1, 1, 1);

  constructor(pontos: readonly THREE.Vector3[]) {
    this.malha = new THREE.InstancedMesh(geoDoCone(), toon(0xffffff, { corPorVertice: true }), Math.max(1, pontos.length));
    this.malha.count = pontos.length;
    this.malha.userData.peca = 'cones-de-obra';
    this.malha.frustumCulled = false;
    pontos.forEach((p, i) => {
      this.cones.push({ pos: p.clone(), vel: new V(), giro: new THREE.Euler(), roda: new V(), solto: false });
      this.escrever(i);
    });
    this.malha.instanceMatrix.needsUpdate = true;
  }

  private escrever(i: number): void {
    const c = this.cones[i];
    this.m.compose(c.pos, this.q.setFromEuler(c.giro), this.um);
    this.malha.setMatrixAt(i, this.m);
  }

  get quantos(): number {
    return this.cones.length;
  }

  posicao(i: number): THREE.Vector3 {
    return this.cones[i].pos;
  }

  /** já foi derrubado? (cone derrubado não derruba de novo) */
  derrubado(i: number): boolean {
    return this.cones[i].solto;
  }

  /** o carro bateu no cone `i`: ele voa para a frente e para o lado, rodando */
  derrubar(i: number, frente: THREE.Vector3, lado: number, forca: number): void {
    const c = this.cones[i];
    if (c.solto) return;
    c.solto = true;
    c.vel.copy(frente).multiplyScalar(2.5 + forca * 0.55).add(new V(-frente.z, 0, frente.x).multiplyScalar(lado * (1.6 + forca * 0.2)));
    c.vel.y = 3.2 + forca * 0.18;
    c.roda.set(5 + forca * 0.4, 2 * lado, -4 * lado);
  }

  update(dt: number): void {
    let mexeu = false;
    this.cones.forEach((c, i) => {
      if (!c.solto || (c.vel.lengthSq() < 0.0004 && c.pos.y <= 0.075)) return;
      c.vel.y -= 16 * dt;
      c.pos.addScaledVector(c.vel, dt);
      c.giro.x += c.roda.x * dt;
      c.giro.y += c.roda.y * dt;
      c.giro.z += c.roda.z * dt;
      if (c.pos.y < 0.07) {
        // quicou: perde força, e deita de vez quando para
        c.pos.y = 0.07;
        c.vel.y = Math.abs(c.vel.y) > 1.2 ? -c.vel.y * 0.35 : 0;
        c.vel.x *= 0.55;
        c.vel.z *= 0.55;
        c.roda.multiplyScalar(0.5);
        if (c.vel.y === 0 && c.vel.lengthSq() < 0.3) {
          c.vel.set(0, 0, 0);
          c.roda.set(0, 0, 0);
          c.giro.x = Math.PI / 2;
          c.giro.z = 0;
        }
      }
      this.escrever(i);
      mexeu = true;
    });
    if (mexeu) this.malha.instanceMatrix.needsUpdate = true;
  }
}

/** as listras diagonais de obra: laranja e branco (a cor vem pintada, o material é branco) */
function listrasDeObra(): THREE.CanvasTexture {
  return novaTextura('listras-de-obra', 0.5, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#f28a2e';
    for (let k = -2; k < 4; k++) {
      ctx.beginPath();
      ctx.moveTo(k * s * 0.5, 0);
      ctx.lineTo(k * s * 0.5 + s * 0.25, 0);
      ctx.lineTo(k * s * 0.5 + s * 0.25 + s, s);
      ctx.lineTo(k * s * 0.5 + s, s);
      ctx.fill();
    }
  }, 64);
}

/**
 * O CAVALETE DE OBRA: dois pés em A, duas tábuas listradas de laranja e
 * branco e a luz âmbar em cima (as duas malhas `luz-acesa` e `luz-apagada`,
 * que a cena alterna para ela piscar). ~1 m de alto, 1,6 de largo, atravessado
 * no `X`.
 */
export function cavaleteDeObra(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cavalete-de-obra';
  const madeira = toon(P.casaRipa);
  for (const x of [-0.68, 0.68]) {
    for (const z of [-1, 1]) {
      const pe = new THREE.Mesh(quina(0.07, 1.05, 0.05, 0.012), madeira);
      pe.position.set(x, 0.5, z * 0.17);
      pe.rotation.x = -z * 0.33;
      g.add(pe);
    }
  }
  const tex = listrasDeObra();
  for (const y of [0.52, 0.86]) {
    const geo = new THREE.BoxGeometry(1.6, 0.2, 0.035);
    // (o UV em metros ao longo da tábua: as listras ficam do mesmo tamanho nas duas)
    const uv = geo.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 1.6, uv.getY(i) * 0.2);
    const tabua = new THREE.Mesh(geo, toon(0xffffff, { mapa: tex }));
    tabua.position.set(0, y, 0);
    g.add(tabua);
  }
  for (const [nome, brilho] of [['luz-acesa', 1], ['luz-apagada', 0]] as const) {
    const luz = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), toon(P.semaforoAmarelo, brilho ? { glow: 1 } : {}));
    luz.name = nome;
    luz.position.set(0, 1.08, 0);
    luz.visible = brilho === 1;
    luz.userData.semSombra = true;
    g.add(luz);
  }
  const soquete = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.07, 8), toon(P.casaGrafite));
  soquete.position.set(0, 0.99, 0);
  g.add(soquete);
  return g;
}

// ================================================== lombada, buraco e poça

/**
 * A LOMBADA: a corcova de asfalto de guia a guia, com as listras amarelas.
 * Atravessada no `X` (a cena vira para o rumo da pista), 9 cm de alto.
 */
export function lombada(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lombada';
  const largura = PISTA.meia * 2 - 0.3;
  const perfil = new THREE.Shape();
  perfil.moveTo(-0.62, 0);
  perfil.quadraticCurveTo(-0.3, 0.1, 0, 0.1);
  perfil.quadraticCurveTo(0.3, 0.1, 0.62, 0);
  perfil.lineTo(-0.62, 0);
  const geo = new THREE.ExtrudeGeometry(perfil, { depth: largura, bevelEnabled: false, curveSegments: 6 });
  geo.rotateY(Math.PI / 2);
  geo.translate(-largura / 2, 0.02, 0);
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) + pos.getZ(i) * 0.6, pos.getZ(i));
  const tex = novaTextura('listras-de-lombada', 0.9, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#f7c531';
    ctx.fillRect(0, 0, s * 0.5, s);
  }, 32);
  const corcova = new THREE.Mesh(geo, toon(P.lombadaAsfalto, { mapa: tex }));
  corcova.userData.semSombra = true;
  corcova.receiveShadow = true;
  g.add(corcova);
  return g;
}

/** um contorno torto: `raio` com um ruído de três ondas, `pontos` vértices */
function contornoTorto(raio: number, semente: number, pontos = 14, chato = 1): THREE.Shape {
  const forma = new THREE.Shape();
  for (let i = 0; i <= pontos; i++) {
    const a = (i / pontos) * Math.PI * 2;
    const r = raio * (1 + 0.16 * Math.sin(a * 3 + semente) + 0.1 * Math.sin(a * 5 + semente * 2.3));
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * chato;
    if (i === 0) forma.moveTo(x, y);
    else forma.lineTo(x, y);
  }
  return forma;
}

/**
 * O BURACO: a boca escura, torta, com a beira de asfalto quebrado mais clara
 * em volta — dois decalques (a beira por baixo, o fundo por cima). Deitado
 * no chão; `RAIO_DO_BURACO` é o que a cena usa para saber se a roda caiu nele.
 */
export const RAIO_DO_BURACO = 0.6;
export function buraco(semente = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'buraco';
  const beira = new THREE.Mesh(new THREE.ShapeGeometry(contornoTorto(RAIO_DO_BURACO * 1.18, semente, 16, 0.8)), toon(P.buracoBeira, { decal: true }));
  beira.rotation.x = -Math.PI / 2;
  beira.position.y = 0.034;
  beira.renderOrder = 3;
  const fundo = new THREE.Mesh(new THREE.ShapeGeometry(contornoTorto(RAIO_DO_BURACO * 0.9, semente + 1.7, 16, 0.78)), toon(P.buracoFundo, { decal: true }));
  fundo.rotation.x = -Math.PI / 2;
  fundo.position.y = 0.036;
  fundo.renderOrder = 4;
  for (const m of [beira, fundo]) {
    m.userData.semSombra = true;
    g.add(m);
  }
  return g;
}

/** A POÇA: o espelho d'água torto, com o reflexo claro num canto. `RAIO_DA_POCA` é a pegada dela */
export const RAIO_DA_POCA = 1.25;
export function poca(semente = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'poca';
  const agua = new THREE.Mesh(new THREE.ShapeGeometry(contornoTorto(RAIO_DA_POCA, semente, 18, 0.72)), toon(P.aguaRasa, { decal: true, opacity: 0.86 }));
  agua.rotation.x = -Math.PI / 2;
  agua.position.y = 0.034;
  agua.renderOrder = 3;
  const reflexo = new THREE.Mesh(new THREE.ShapeGeometry(contornoTorto(RAIO_DA_POCA * 0.36, semente + 4, 10, 0.5)), toon(P.metalWhite, { decal: true, opacity: 0.6 }));
  reflexo.rotation.x = -Math.PI / 2;
  reflexo.position.set(-RAIO_DA_POCA * 0.3, 0.036, -RAIO_DA_POCA * 0.18);
  reflexo.renderOrder = 4;
  for (const m of [agua, reflexo]) {
    m.userData.semSombra = true;
    g.add(m);
  }
  return g;
}

/**
 * OS RESPINGOS: gotinhas que saem das rodas na poça (e a poeira do buraco).
 * Um lote de gotas em arco; `espirrar(ponto, cor, quantas, força)` solta, e
 * elas somem sozinhas ao cair.
 */
export class Respingos {
  readonly malha: THREE.InstancedMesh;
  private readonly gotas: Array<{ pos: THREE.Vector3; vel: THREE.Vector3; vida: number; tam: number }> = [];
  private proxima = 0;
  private readonly m = new THREE.Matrix4();
  private readonly cor = new THREE.Color();

  constructor(quantas = 40) {
    this.malha = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), toon(0xffffff), quantas);
    this.malha.userData.semSombra = true;
    this.malha.frustumCulled = false;
    for (let i = 0; i < quantas; i++) {
      this.gotas.push({ pos: new V(), vel: new V(), vida: 0, tam: 0 });
      this.malha.setMatrixAt(i, this.m.makeScale(0, 0, 0));
      this.malha.setColorAt(i, this.cor.setHex(P.aguaRasa));
    }
  }

  espirrar(ponto: THREE.Vector3, cor: number, quantas: number, forca: number): void {
    for (let k = 0; k < quantas; k++) {
      const i = this.proxima;
      this.proxima = (this.proxima + 1) % this.gotas.length;
      const g = this.gotas[i];
      const a = (k / quantas) * Math.PI * 2 + ponto.x;
      g.pos.copy(ponto).setY(0.12);
      g.vel.set(Math.cos(a) * (1 + (k % 3) * 0.7), 2.4 + (k % 4) * 0.8, Math.sin(a) * (1 + (k % 2))).multiplyScalar(forca);
      g.vida = 0.9;
      g.tam = 0.06 + (k % 3) * 0.025;
      this.malha.setColorAt(i, this.cor.setHex(cor));
    }
    if (this.malha.instanceColor) this.malha.instanceColor.needsUpdate = true;
  }

  update(dt: number): void {
    let mexeu = false;
    this.gotas.forEach((g, i) => {
      if (g.vida <= 0) return;
      g.vida -= dt;
      g.vel.y -= 14 * dt;
      g.pos.addScaledVector(g.vel, dt);
      const tam = g.vida <= 0 || g.pos.y < 0 ? 0 : g.tam * Math.min(1, g.vida * 3);
      if (tam === 0) g.vida = 0;
      this.m.makeScale(tam, tam, tam).setPosition(g.pos);
      this.malha.setMatrixAt(i, this.m);
      mexeu = true;
    });
    if (mexeu) this.malha.instanceMatrix.needsUpdate = true;
  }
}

// =================================================================== semáforo

export type CorDoSemaforo = 'verde' | 'amarelo' | 'vermelho';

/**
 * O SEMÁFORO: o poste na calçada, o braço por cima da pista e a caixa com
 * as três lentes. Cada cor tem duas malhas (acesa e apagada), e `acender`
 * troca qual aparece — trocar material em malha juntada não pode. A base é
 * o pé do poste; o braço sai para o `−X` (a cena põe o poste na calçada da
 * direita e vira a caixa para quem chega, no `+Z`).
 */
export class Semaforo {
  readonly group = new THREE.Group();
  private readonly lentes = new Map<CorDoSemaforo, { acesa: THREE.Mesh; apagada: THREE.Mesh }>();
  cor: CorDoSemaforo = 'verde';

  constructor(braco = 3.6) {
    this.group.userData.peca = 'semaforo';
    const aco = toon(P.casaGrafite);
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 4.5, 10), aco);
    poste.position.y = 2.25;
    this.group.add(poste);
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.2, 10), aco);
    pe.position.y = 0.1;
    this.group.add(pe);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, braco, 8).rotateZ(Math.PI / 2), aco);
    haste.position.set(-braco / 2, 4.3, 0);
    this.group.add(haste);
    const caixa = new THREE.Group();
    caixa.position.set(-braco + 0.2, 3.72, 0.02);
    this.group.add(caixa);
    caixa.add(new THREE.Mesh(quina(0.42, 1.16, 0.26, 0.05), toon(P.semaforoCaixa)));
    const suporte = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6), aco);
    suporte.position.y = 0.66;
    caixa.add(suporte);
    const cores: Array<[CorDoSemaforo, number, number]> = [['vermelho', P.semaforoVermelho, 0.36], ['amarelo', P.semaforoAmarelo, 0], ['verde', P.semaforoVerde, -0.36]];
    for (const [nome, cor, y] of cores) {
      // a pala por cima de cada lente
      const pala = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 10, 1, true, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2), toon(P.semaforoCaixa, { doubleSide: true }));
      pala.position.set(0, y, 0.2);
      caixa.add(pala);
      const geo = new THREE.SphereGeometry(0.135, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2);
      const acesa = new THREE.Mesh(geo, toon(cor, { glow: 1 }));
      const apagada = new THREE.Mesh(geo, toon(new THREE.Color(cor).multiplyScalar(0.3).getHex()));
      for (const lente of [acesa, apagada]) {
        lente.position.set(0, y, 0.1);
        lente.userData.semSombra = true;
        caixa.add(lente);
      }
      acesa.name = `lente-${nome}-acesa`;
      apagada.name = `lente-${nome}-apagada`;
      this.lentes.set(nome, { acesa, apagada });
    }
    this.acender('verde');
  }

  acender(cor: CorDoSemaforo): void {
    this.cor = cor;
    for (const [nome, par] of this.lentes) {
      par.acesa.visible = nome === cor;
      par.apagada.visible = nome !== cor;
    }
  }
}

// =================================================================== corações

/** o coração gordinho de pegar: a forma do coração extrudada com bisel */
function geoCoracaoDePegar(): THREE.BufferGeometry {
  const t = 0.62;
  const s = new THREE.Shape();
  s.moveTo(0, -0.5 * t);
  s.bezierCurveTo(-0.15 * t, -0.3 * t, -0.5 * t, -0.05 * t, -0.5 * t, 0.18 * t);
  s.bezierCurveTo(-0.5 * t, 0.42 * t, -0.22 * t, 0.52 * t, 0, 0.3 * t);
  s.bezierCurveTo(0.22 * t, 0.52 * t, 0.5 * t, 0.42 * t, 0.5 * t, 0.18 * t);
  s.bezierCurveTo(0.5 * t, -0.05 * t, 0.15 * t, -0.3 * t, 0, -0.5 * t);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2, curveSegments: 7 });
  geo.translate(0, 0, -0.05);
  return geo;
}

/**
 * OS CORAÇÕES da pista: um lote. Giram e sobem e descem (só os de perto do
 * carro são refeitos a cada quadro); pegar um (`pegar(i)`) o faz crescer e
 * sumir num piscar.
 */
export class Coracoes {
  readonly malha: THREE.InstancedMesh;
  private readonly base: THREE.Vector3[];
  private readonly estado: Float32Array;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly eixo = new V(0, 1, 0);
  private readonly escala = new V();
  private t = 0;

  constructor(pontos: readonly THREE.Vector3[]) {
    this.base = pontos.map((p) => p.clone());
    // 0: no lugar; de 0 a 1: sumindo; 2: pego
    this.estado = new Float32Array(pontos.length);
    this.malha = new THREE.InstancedMesh(geoCoracaoDePegar(), toon(P.heart, { glow: 0.35 }), Math.max(1, pontos.length));
    this.malha.count = pontos.length;
    this.malha.userData.semSombra = true;
    this.malha.userData.peca = 'coracoes-da-pista';
    this.malha.frustumCulled = false;
    this.base.forEach((_, i) => this.escrever(i, 0));
    this.malha.instanceMatrix.needsUpdate = true;
  }

  private escrever(i: number, t: number): void {
    const some = this.estado[i];
    const tam = some >= 2 ? 0 : some > 0 ? (1 + some * 0.9) * (1 - some) : 1;
    const p = this.base[i];
    this.q.setFromAxisAngle(this.eixo, t * 2.2 + i * 0.7);
    this.m.compose(new V(p.x, p.y + Math.sin(t * 2.6 + i * 0.9) * 0.1 + some * 0.8, p.z), this.q, this.escala.setScalar(tam));
    this.malha.setMatrixAt(i, this.m);
  }

  posicao(i: number): THREE.Vector3 {
    return this.base[i];
  }

  pego(i: number): boolean {
    return this.estado[i] > 0;
  }

  pegar(i: number): void {
    if (this.estado[i] === 0) this.estado[i] = 0.001;
  }

  /** `perto(i)` diz quais valem a conta deste quadro (os que estão perto do carro) */
  update(dt: number, perto: (i: number) => boolean): void {
    this.t += dt;
    for (let i = 0; i < this.base.length; i++) {
      const some = this.estado[i];
      if (some >= 2) continue;
      if (some > 0) this.estado[i] = some + dt * 3.4 >= 1 ? 2 : some + dt * 3.4;
      else if (!perto(i)) continue;
      this.escrever(i, this.t);
    }
    this.malha.instanceMatrix.needsUpdate = true;
  }
}

// ========================================================== a roda ao longe

/**
 * A RODA GIGANTE DO VILLA LOBOS VISTA DA ESTRADA: é o que diz "estamos
 * chegando". É a silhueta dela — o aro duplo, os raios, as gôndolas brancas
 * e os dois cavaletes —, leve (a de verdade tem centenas de milhares de
 * triângulos de treliça, e aqui ela fica a cem metros). O grupo `aro` gira
 * devagar (`userData.aro`). A base no chão.
 */
export function rodaAoLonge(raio = 13): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'roda-ao-longe';
  const branco = toon(P.metalWhite);
  const eixoY = raio + 2.2;
  const aro = new THREE.Group();
  aro.name = 'aro';
  aro.position.y = eixoY;
  g.add(aro);
  for (const z of [-0.5, 0.5]) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.14, 6, 40), branco);
    anel.position.z = z;
    aro.add(anel);
    const coroa = new THREE.Mesh(new THREE.TorusGeometry(raio * 0.5, 0.1, 5, 28), toon(P.rodaVermelho));
    coroa.position.z = z;
    aro.add(coroa);
  }
  const raios = 16;
  for (let k = 0; k < raios; k++) {
    const a = (k / raios) * Math.PI * 2;
    const raioDeAco = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, raio, 5).translate(0, raio / 2, 0), branco);
    raioDeAco.rotation.z = a;
    aro.add(raioDeAco);
    const gondola = new THREE.Group();
    gondola.name = `gondola-${k}`;
    gondola.position.set(-Math.sin(a) * raio, Math.cos(a) * raio, 0);
    gondola.add(new THREE.Mesh(quina(1.25, 1.2, 1.25, 0.3), branco));
    const janela = new THREE.Mesh(quina(1.29, 0.42, 0.9, 0.08), toon(P.glass));
    janela.position.y = 0.12;
    gondola.add(janela);
    for (const m of gondola.children) m.position.y -= 0.95;
    aro.add(gondola);
  }
  const miolo = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 1.4, 14).rotateX(Math.PI / 2), toon(P.rodaVermelho));
  aro.add(miolo);
  const tampa = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 6), toon(P.gold));
  tampa.position.z = 0.75;
  aro.add(tampa);
  // os dois cavaletes: duas pernas abertas de cada lado
  for (const z of [-1.3, 1.3]) {
    for (const lado of [-1, 1]) {
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, Math.hypot(eixoY, raio * 0.48), 6).translate(0, -Math.hypot(eixoY, raio * 0.48) / 2, 0), branco);
      perna.position.set(0, eixoY, z);
      perna.rotation.z = lado * Math.atan2(raio * 0.48, eixoY);
      g.add(perna);
    }
  }
  g.userData.aro = aro;
  return g;
}
