import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { juntarPorCor } from './fundir';

/*
 * O ÔNIBUS DA CIDADE: o ônibus urbano detalhado (pedido do Renan: o mesmo
 * azul, a mesma faixa branca e o mesmo friso do `bus()` que havia no kit,
 * num modelo mais caprichado) — e o ônibus do ponto do parque e do clube.
 * Nasceu para a chegada do ônibus da festa de Halloween
 * (`eventos/halloween/chegadaDoOnibus.ts`), e por isso tem tudo que uma
 * cutscene mexe: a porta da frente que abre (as folhas correm para os
 * lados e o vão de dentro aparece, com o corrimão amarelo e a luzinha), as
 * rodas que giram, o farol com o halo e a poça de luz na rua, e o
 * pisca-alerta.
 *
 * O que dá a cara nova:
 *  - a CARROCERIA é o perfil de lado (o teto com a quina redonda na frente e
 *    atrás, o para-brisa deitado um pouco para trás, as caixas de roda
 *    recortadas) extrudado na largura com BISEL — as quinas todas saem
 *    arredondadas, e as caixas de roda são furo de verdade;
 *  - a faixa branca, o friso e a saia escura CONTORNAM o ônibus (uma faixa só
 *    dando a volta pela frente e por trás, que para nas portas e nas caixas
 *    de roda), em vez de três réguas soltas;
 *  - as janelas são de quina redonda com a borracha preta em volta, a
 *    basculante em cima e a do motorista de correr;
 *  - a frente: o para-brisa em duas folhas com a coluna no meio, o letreiro
 *    de LED âmbar em cima, os faróis duplos na moldura de cromo, a grade com
 *    o emblema de coração, o para-choque com os faróis de neblina e a placa
 *    do Mercosul, os limpadores e os retrovisores "orelha de coelho";
 *  - atrás: o vidro, a grelha do motor em venezianas, as lanternas em pé
 *    (freio, pisca e ré), o escapamento;
 *  - em cima: o ar-condicionado com as duas ventoinhas, as escotilhas e a
 *    calha de chuva; dos lados, os pisca-laterais e o letreiro da porta;
 *  - as RODAS (seis, com a dupla de trás) são UM lote, girado no `rodar()`:
 *    pneu torneado de banda arredondada, aro, calota, rasgos e porcas — é o
 *    rasgo e a porca que deixam ver o giro.
 *
 * O CONTRATO é o do `bus()` de antes, que ele substituiu sem mexer na cena:
 * 9 × 2,55, a base em `y = 0`, o NARIZ no `+X` e as portas no `+Z` (o ponto
 * do parque gira −π/2, e as portas olham a calçada), a porta da frente em
 * `x = 2,6` e o degrau em 0,56 — é dali que a cena da festa faz a turma
 * descer. A cena passa pela `fundir()`: o que se mexe tem nome (as folhas
 * da porta, as luzes) e as rodas são lote.
 */

const C = 9;
const L = 2.55;
const MEIO = L / 2;
/** o raio do bisel: é ele que arredonda todas as quinas da carroceria */
const B = 0.12;
const CHAO = 0.5;
const TETO = 3.05;
/** a frente: reta até aqui, e daí deitada para trás até o alto do para-brisa */
const FRENTE = { reta: 1.3, alto: 2.85, deita: 0.15, quina: 0.24 };
/** os eixos (a da frente fica ATRÁS da porta da frente, como em ônibus urbano) e a roda */
const EIXOS = [1.25, -2.7];
const RODA = { raio: 0.48, caixa: 0.6 };
/** as portas do lado da calçada (`+Z`): o meio e a largura */
const PORTAS = { frente: { x: 2.6, largura: 1.2 }, meio: { x: -0.3, largura: 1.3 } };
/** a faixa de janelas */
const JANELA = { y0: 1.58, y1: 2.6 };

/** as medidas que a cena usa (as do `bus()` de antes, mais o que este tem a mais) */
export const ONIBUS_DA_CIDADE = {
  comprimento: C,
  largura: L,
  porta: PORTAS.frente,
  degrau: 0.56,
  eixos: EIXOS,
} as const;

// ================================================================ ajudantes

/** retângulo de quina redonda, centrado */
function redondo(l: number, a: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = l / 2;
  const y = a / 2;
  const q = Math.min(r, x - 0.001, y - 0.001);
  s.moveTo(-x + q, -y);
  s.lineTo(x - q, -y);
  s.quadraticCurveTo(x, -y, x, -y + q);
  s.lineTo(x, y - q);
  s.quadraticCurveTo(x, y, x - q, y);
  s.lineTo(-x + q, y);
  s.quadraticCurveTo(-x, y, -x, y - q);
  s.lineTo(-x, -y + q);
  s.quadraticCurveTo(-x, -y, -x + q, -y);
  return s;
}

/** um furo de quina redonda (o mesmo desenho, em `Path`), deslocado */
function furo(l: number, a: number, r: number, dx = 0, dy = 0): THREE.Path {
  const p = new THREE.Path();
  const x = l / 2;
  const y = a / 2;
  const q = Math.min(r, x - 0.001, y - 0.001);
  p.moveTo(dx - x + q, dy - y);
  p.lineTo(dx + x - q, dy - y);
  p.quadraticCurveTo(dx + x, dy - y, dx + x, dy - y + q);
  p.lineTo(dx + x, dy + y - q);
  p.quadraticCurveTo(dx + x, dy + y, dx + x - q, dy + y);
  p.lineTo(dx - x + q, dy + y);
  p.quadraticCurveTo(dx - x, dy + y, dx - x, dy + y - q);
  p.lineTo(dx - x, dy - y + q);
  p.quadraticCurveTo(dx - x, dy - y, dx - x + q, dy - y);
  return p;
}

const placa = (forma: THREE.Shape, prof: number): THREE.BufferGeometry =>
  new THREE.ExtrudeGeometry(forma, { depth: prof, bevelEnabled: false, curveSegments: 6 });

/**
 * Uma placa (forma extrudada) pregada num LADO do ônibus: `lado` +1 é o da
 * calçada (`+Z`), −1 o da rua; `afasta` é quanto a face de trás fica para
 * fora da lataria. O `x` da forma corre ao longo do ônibus nos dois lados.
 */
function noLado(geo: THREE.BufferGeometry, x: number, y: number, lado: 1 | -1, afasta: number): THREE.BufferGeometry {
  if (lado < 0) geo.rotateY(Math.PI);
  geo.translate(x, y, lado * (MEIO + afasta));
  return geo;
}

/** uma placa na FRENTE (olhando `+X`) ou ATRÁS (`−X`): o `x` da forma corre na largura */
function deFrente(geo: THREE.BufferGeometry, x: number, y: number, z: number, frente = true): THREE.BufferGeometry {
  geo.rotateY(frente ? Math.PI / 2 : -Math.PI / 2);
  geo.translate(x, y, z);
  return geo;
}

/** pinta a geometria inteira de uma cor (o atributo `color`, para juntar várias numa malha) */
function pintada(geo: THREE.BufferGeometry, cor: number): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const nome of Object.keys(g.attributes)) if (nome !== 'position' && nome !== 'normal') g.deleteAttribute(nome);
  const c = new THREE.Color(cor);
  const n = g.attributes.position.count;
  const cores = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) cores.set([c.r, c.g, c.b], i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return g;
}

/** um ponto do contorno da planta do ônibus (com a normal para fora) */
interface NaVolta { x: number; z: number; nx: number; nz: number }

/**
 * O CONTORNO DA PLANTA na altura das faixas: o retângulo de quina redonda
 * (a quina é a do bisel), dando a volta no sentido do relógio visto de cima,
 * começando atrás no lado da calçada.
 */
function contornoDaPlanta(hx: number, hz: number, r: number, passo = 0.05): NaVolta[] {
  const pts: NaVolta[] = [];
  const reta = (ax: number, az: number, bx: number, bz: number, nx: number, nz: number): void => {
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / passo));
    for (let i = 0; i < n; i++) pts.push({ x: ax + ((bx - ax) * i) / n, z: az + ((bz - az) * i) / n, nx, nz });
  };
  const arco = (cx: number, cz: number, a0: number): void => {
    for (let i = 0; i < 6; i++) {
      const a = a0 - ((Math.PI / 2) * i) / 6;
      pts.push({ x: cx + r * Math.cos(a), z: cz + r * Math.sin(a), nx: Math.cos(a), nz: Math.sin(a) });
    }
  };
  reta(-hx + r, hz, hx - r, hz, 0, 1);
  arco(hx - r, hz - r, Math.PI / 2);
  reta(hx, hz - r, hx, -hz + r, 1, 0);
  arco(hx - r, -hz + r, 0);
  reta(hx - r, -hz, -hx + r, -hz, 0, -1);
  arco(-hx + r, -hz + r, -Math.PI / 2);
  reta(-hx, -hz + r, -hx, hz - r, -1, 0);
  arco(-hx + r, hz - r, Math.PI);
  return pts;
}

/**
 * UMA FAIXA QUE DÁ A VOLTA no ônibus (a branca da cintura, o friso, a saia):
 * a planta do contorno engrossada para fora (`fora`) e para dentro
 * (`dentro`), em pé entre `y0` e `y1`. Onde `pular(x, z)` diz que sim (uma
 * porta, uma caixa de roda) a faixa para, e recomeça depois.
 */
function faixaEmVolta(y0: number, y1: number, fora: number, dentro: number, pular: (x: number, z: number) => boolean): THREE.BufferGeometry[] {
  const volta = contornoDaPlanta(C / 2, MEIO, B);
  // começa num ponto pulado, para nenhum trecho ficar partido na emenda da volta
  const inicio = volta.findIndex((p) => pular(p.x, p.z));
  const pts = inicio > 0 ? [...volta.slice(inicio), ...volta.slice(0, inicio)] : volta;
  if (inicio < 0) pts.push(pts[0]);
  const trechos: NaVolta[][] = [];
  let atual: NaVolta[] = [];
  for (const p of pts) {
    if (pular(p.x, p.z)) {
      if (atual.length > 1) trechos.push(atual);
      atual = [];
    } else atual.push(p);
  }
  if (atual.length > 1) trechos.push(atual);
  return trechos.map((t) => {
    const forma = new THREE.Shape();
    // a forma no plano (x, −z): deitada pelo `rotateX(−π/2)`, ela volta ao `z` do mundo
    t.forEach((p, i) => {
      const x = p.x + p.nx * fora;
      const y = -(p.z + p.nz * fora);
      if (i) forma.lineTo(x, y);
      else forma.moveTo(x, y);
    });
    for (let i = t.length - 1; i >= 0; i--) forma.lineTo(t[i].x - t[i].nx * dentro, -(t[i].z - t[i].nz * dentro));
    const geo = new THREE.ExtrudeGeometry(forma, { depth: y1 - y0, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, y0, 0);
    return geo;
  });
}

// ============================================================== as texturas

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** o letreiro de LED: o texto em âmbar, os pontinhos do painel e o fundo quase preto */
const letreirosDeLed = new Map<string, THREE.MeshBasicMaterial>();
function letreiroDeLed(texto: string, l = 512, a = 72): THREE.MeshBasicMaterial {
  const chave = `${texto}|${l}|${a}`;
  const pronto = letreirosDeLed.get(chave);
  if (pronto) return pronto;
  const cv = document.createElement('canvas');
  cv.width = l;
  cv.height = a;
  const c = cv.getContext('2d');
  if (c) {
    c.fillStyle = '#111316';
    c.fillRect(0, 0, l, a);
    // o texto num canvas de rascunho, e cada "LED" acende se o pixel do meio dele tiver letra
    const rascunho = document.createElement('canvas');
    rascunho.width = l;
    rascunho.height = a;
    const r = rascunho.getContext('2d');
    if (r) {
      let px = Math.round(a * 0.72);
      const fonte = (t: number): string => `900 ${t}px ui-rounded, "Nunito", system-ui, sans-serif`;
      r.font = fonte(px);
      while (px > 12 && r.measureText(texto).width > l * 0.92) {
        px -= 2;
        r.font = fonte(px);
      }
      r.fillStyle = '#fff';
      r.textAlign = 'center';
      r.textBaseline = 'middle';
      r.fillText(texto, l / 2, a / 2 + px * 0.04);
      const dados = r.getImageData(0, 0, l, a).data;
      const passo = 4;
      for (let y = passo / 2; y < a; y += passo) {
        for (let x = passo / 2; x < l; x += passo) {
          const aceso = dados[(Math.floor(y) * l + Math.floor(x)) * 4 + 3] > 90;
          c.fillStyle = aceso ? css(P.onibusLed) : '#26292e';
          c.beginPath();
          c.arc(x, y, aceso ? 1.7 : 1.1, 0, Math.PI * 2);
          c.fill();
        }
      }
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  // o LED tem luz própria: chapado, sem a sombra do toon (é o que o faz ler aceso de noite)
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  letreirosDeLed.set(chave, mat);
  return mat;
}

/** a placa do Mercosul: a faixa azul com "BRASIL" e a bandeirinha, e o texto preto */
let materialDaPlaca: THREE.MeshToonMaterial | null = null;
function placaDoMercosul(): THREE.MeshToonMaterial {
  if (materialDaPlaca) return materialDaPlaca;
  const l = 256;
  const a = 80;
  const cv = document.createElement('canvas');
  cv.width = l;
  cv.height = a;
  const c = cv.getContext('2d');
  if (c) {
    c.fillStyle = '#f7f8fa';
    c.fillRect(0, 0, l, a);
    c.fillStyle = '#1f4fa8';
    c.fillRect(0, 0, l, 18);
    c.fillStyle = '#fff';
    c.font = '700 13px ui-rounded, system-ui, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('BRASIL', l / 2, 10);
    // a bandeirinha no canto da faixa
    c.fillStyle = '#2f9e4f';
    c.fillRect(l - 26, 4, 18, 11);
    c.fillStyle = '#f2d23a';
    c.beginPath();
    c.moveTo(l - 17, 5);
    c.lineTo(l - 9, 9.5);
    c.lineTo(l - 17, 14);
    c.lineTo(l - 25, 9.5);
    c.fill();
    c.fillStyle = '#1b1d22';
    c.font = '800 46px ui-monospace, "Courier New", monospace';
    c.fillText('BEB1T0', l / 2, 50);
    c.strokeStyle = '#1b1d22';
    c.lineWidth = 3;
    c.strokeRect(1.5, 1.5, l - 3, a - 3);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  materialDaPlaca = toon(0xffffff, { mapa: tex });
  return materialDaPlaca;
}

// ================================================================ o ônibus

export interface OpcoesDoOnibus {
  cor?: number;
  /** o que vai no letreiro de LED (o da frente e o do lado) */
  destino?: string;
}

interface FolhaDaPorta {
  grupo: THREE.Group;
  x0: number;
  lado: number;
  curso: number;
}

export class OnibusDaCidade {
  readonly group = new THREE.Group();
  /** o lote das rodas: as seis de fora e as duas de dentro da dupla de trás */
  private readonly rodas: THREE.InstancedMesh;
  private readonly lugaresDasRodas: Array<{ x: number; z: number; lado: 1 | -1 }> = [];
  private giroDasRodas = 0;
  private readonly folhas: { frente: FolhaDaPorta[]; meio: FolhaDaPorta[] } = { frente: [], meio: [] };
  private readonly luzDaPorta: THREE.Object3D;
  private readonly farois = new THREE.Group();
  private readonly piscas = new THREE.Group();
  private piscando = false;
  private relogioDoPisca = 0;
  /** quanto a porta da frente está aberta (0 a 1): o teste lê */
  aberta = 0;
  /** o que está escrito no letreiro de LED agora */
  destino: string;

  constructor(opts: OpcoesDoOnibus = {}) {
    const cor = opts.cor ?? P.onibusAzul;
    const destino = opts.destino ?? 'Clube';
    this.destino = destino;
    const g = this.group;
    g.name = 'onibus-da-cidade';
    g.userData.peca = 'onibus-da-cidade';
    // (para o teste: a porta, as rodas e as luzes)
    g.userData.onibus = this;

    this.montarCarroceria(cor);
    this.montarFaixas();
    this.montarJanelas();
    this.montarPortas(cor);
    this.montarFrente(destino);
    this.montarTraseira(cor);
    this.montarTeto();
    this.montarDetalhesDoLado(destino);
    this.rodas = this.montarRodas();
    this.luzDaPorta = g.getObjectByName('luz-da-porta') as THREE.Object3D;

    // as luzes da cena: o halo dos faróis e a poça na rua, e o pisca-alerta (desligados)
    this.farois.name = 'farois-acesos';
    this.farois.visible = false;
    this.piscas.name = 'piscas-acesos';
    this.piscas.visible = false;
    g.add(this.farois, this.piscas);
    for (const lado of [-1, 1]) {
      const halo = haloDeLampada(1.0, P.onibusFarol, 0.7);
      halo.position.set(C / 2 + 0.16, 0.86, lado * (MEIO - 0.42));
      this.farois.add(halo);
    }
    const poca = pocaDeLuz(2.1, P.onibusFarol, 0.32);
    poca.scale.set(1.7, 1, 1);
    poca.position.set(C / 2 + 2.6, 0.035, 0);
    this.farois.add(poca);
    for (const [x, y, z] of [[C / 2 + 0.12, 0.88, MEIO - 0.13], [C / 2 + 0.12, 0.88, -(MEIO - 0.13)], [-C / 2 - 0.1, 1.38, MEIO - 0.3], [-C / 2 - 0.1, 1.38, -(MEIO - 0.3)]]) {
      const halo = haloDeLampada(0.7, P.onibusPisca, 0.85);
      halo.position.set(x, y, z);
      this.piscas.add(halo);
    }

    // as miudezas de cor lisa numa malha só (a cor nos vértices); o que tem nome fica de fora
    juntarPorCor(g);
  }

  // ------------------------------------------------------------ a carroceria
  /**
   * O PERFIL DE LADO extrudado na largura, com bisel: a forma é desenhada
   * RECOLHIDA do tamanho do bisel (ele a engorda de volta), e as caixas de
   * roda são meias-luas recortadas embaixo.
   */
  private montarCarroceria(cor: number): void {
    const s = new THREE.Shape();
    const x0 = -C / 2 + B;
    const x1 = C / 2 - B;
    const y0 = CHAO + B;
    const yT = TETO - B;
    const raio = RODA.caixa + B;
    const meiaBoca = Math.sqrt(raio * raio - (y0 - RODA.raio) ** 2);
    const alfa = Math.asin((y0 - RODA.raio) / raio);
    const atras = 0.3;
    s.moveTo(x0, y0);
    for (const e of [...EIXOS].sort((a, b) => a - b)) {
      s.lineTo(e - meiaBoca, y0);
      s.absarc(e, RODA.raio, raio, Math.PI - alfa, alfa, true);
    }
    s.lineTo(x1, y0);
    s.lineTo(x1, FRENTE.reta);
    const xAlto = x1 - FRENTE.deita;
    s.lineTo(xAlto, FRENTE.alto);
    s.quadraticCurveTo(xAlto - 0.03, yT, xAlto - FRENTE.quina, yT);
    s.lineTo(x0 + atras, yT);
    s.quadraticCurveTo(x0, yT, x0, yT - atras);
    s.lineTo(x0, y0);
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: L - 2 * B, bevelEnabled: true, bevelThickness: B, bevelSize: B, bevelSegments: 3, curveSegments: 12,
    });
    geo.translate(0, 0, -(L - 2 * B) / 2);
    const corpo = new THREE.Mesh(geo, toon(cor));
    this.group.add(corpo);

    // por dentro das caixas de roda: o forro escuro (sem ele, via-se a lataria azul por dentro da boca)
    for (const e of EIXOS) {
      const forro = new THREE.CylinderGeometry(RODA.caixa - 0.004, RODA.caixa - 0.004, L - 0.08, 16, 1, true, Math.PI / 2, Math.PI);
      forro.rotateX(Math.PI / 2);
      forro.translate(e, RODA.raio, 0);
      this.group.add(new THREE.Mesh(forro, toon(P.onibusPneu, { doubleSide: true })));
      // e o friso de borracha em volta da boca, dos dois lados
      for (const lado of [-1, 1]) {
        const friso = new THREE.TorusGeometry(RODA.caixa + 0.02, 0.032, 6, 20, Math.PI);
        friso.translate(e, RODA.raio, lado * (MEIO + 0.004));
        this.group.add(new THREE.Mesh(friso, toon(P.onibusChassi)));
      }
    }
    // o chassi por baixo, entre as rodas (dá chão à carroceria)
    const chassi = new THREE.Mesh(quina(C - 0.9, 0.26, L - 0.5, 0.05), toon(P.onibusChassi));
    chassi.position.set(-0.1, CHAO - 0.08, 0);
    this.group.add(chassi);
  }

  // --------------------------------------------------------------- as faixas
  /** a cintura branca, o friso azul-escuro e a saia: em volta, parando nas portas e nas caixas de roda */
  private montarFaixas(): void {
    const naPorta = (x: number, z: number): boolean =>
      z > MEIO - 0.05 && Object.values(PORTAS).some((p) => Math.abs(x - p.x) < p.largura / 2 + 0.06);
    const naCaixa = (x: number): boolean => EIXOS.some((e) => Math.abs(x - e) < RODA.caixa + 0.06);
    const add = (geos: THREE.BufferGeometry[], cor: number): void => {
      for (const geo of geos) this.group.add(new THREE.Mesh(geo, toon(cor)));
    };
    add(faixaEmVolta(1.19, 1.35, 0.012, 0.03, naPorta), P.onibusFaixa);
    add(faixaEmVolta(1.12, 1.16, 0.016, 0.03, naPorta), P.onibusFriso);
    // (a saia desce 1 cm abaixo do fundo da lataria: no mesmo plano, as duas faces de baixo brigavam)
    add(faixaEmVolta(CHAO - 0.01, 0.74, 0.01, 0.03, (x, z) => naPorta(x, z) || naCaixa(x)), P.onibusChassi);
    // a calha de chuva, logo acima das janelas, dos dois lados
    for (const lado of [-1, 1]) {
      const calha = new THREE.Mesh(quina(C - 0.9, 0.035, 0.05, 0.012), toon(P.onibusChassi));
      calha.position.set(-0.2, 2.88, lado * (MEIO + 0.012));
      this.group.add(calha);
    }
  }

  // -------------------------------------------------------------- as janelas
  /** uma janela: a borracha em volta, o vidro, e a basculante em cima (ou a de correr) */
  private janela(x0: number, x1: number, lado: 1 | -1, deCorrer = false): void {
    const l = x1 - x0;
    const a = JANELA.y1 - JANELA.y0;
    const cx = (x0 + x1) / 2;
    const cy = (JANELA.y0 + JANELA.y1) / 2;
    const g = this.group;
    g.add(new THREE.Mesh(noLado(placa(redondo(l + 0.07, a + 0.07, 0.11), 0.014), cx, cy, lado, 0.002), toon(P.onibusBorracha)));
    g.add(new THREE.Mesh(noLado(placa(redondo(l, a, 0.08), 0.012), cx, cy, lado, 0.008), toon(P.glass, { glow: 0.12 })));
    const borracha = toon(P.onibusBorracha);
    if (deCorrer) {
      // a do motorista: duas folhas de correr, a da frente aberta um palmo
      const meio = new THREE.Mesh(quina(0.035, a, 0.016, 0.006), borracha);
      meio.position.set(cx, cy, lado * (MEIO + 0.026));
      g.add(meio);
      return;
    }
    const barra = new THREE.Mesh(quina(l, 0.035, 0.016, 0.006), borracha);
    barra.position.set(cx, JANELA.y1 - 0.3, lado * (MEIO + 0.026));
    g.add(barra);
    const divisa = new THREE.Mesh(quina(0.03, 0.3, 0.016, 0.006), borracha);
    divisa.position.set(cx, JANELA.y1 - 0.15, lado * (MEIO + 0.026));
    g.add(divisa);
  }

  private montarJanelas(): void {
    // do lado da calçada, entre as portas
    for (const [a, b] of [[3.32, 4.22], [0.47, 1.88], [-2.62, -0.97], [-4.22, -2.74]]) this.janela(a, b, 1);
    // do lado da rua, seis iguais (a da frente é a do motorista, de correr)
    const n = 6;
    const vao = 0.12;
    const l = (8.44 - vao * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const a = -4.22 + i * (l + vao);
      this.janela(a, a + l, -1, i === n - 1);
    }
  }

  // --------------------------------------------------------------- as portas
  /**
   * UMA PORTA do lado da calçada: o batente de borracha, o vão de dentro (o
   * fundo escuro, os dois corrimãos amarelos e o degrau com a beirada
   * amarela) e as duas FOLHAS de vidro — grupos com nome, que correm para os
   * lados (`porta(k)`). Fechadas, elas tapam o vão inteiro.
   */
  private montarPorta(qual: 'frente' | 'meio'): void {
    const { x, largura: dw } = PORTAS[qual];
    const g = this.group;
    const alto = 1.98;
    const cy = 0.6 + alto / 2;
    // o vão de dentro e o batente
    g.add(new THREE.Mesh(noLado(placa(redondo(dw, alto, 0.06), 0.012), x, cy, 1, 0.002), toon(P.onibusInterior)));
    const batente = redondo(dw + 0.1, alto + 0.08, 0.08);
    batente.holes.push(furo(dw, alto, 0.06));
    g.add(new THREE.Mesh(noLado(placa(batente, 0.02), x, cy, 1, 0.002), toon(P.onibusBorracha)));
    // os corrimãos (atrás das folhas fechadas) e o degrau
    for (const s of [-1, 1]) {
      const cano = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.7, 8), toon(P.onibusCorrimao));
      cano.position.set(x + s * (dw / 2 - 0.1), 1.5, MEIO + 0.012);
      g.add(cano);
    }
    const degrau = new THREE.Mesh(quina(dw, 0.1, 0.32, 0.02), toon(P.onibusChassi));
    degrau.position.set(x, 0.51, MEIO + 0.13);
    g.add(degrau);
    const beirada = new THREE.Mesh(quina(dw - 0.04, 0.03, 0.04, 0.01), toon(P.onibusCorrimao));
    beirada.position.set(x, 0.555, MEIO + 0.268);
    g.add(beirada);
    if (qual === 'frente') {
      // a luzinha de dentro, que só aparece com a porta aberta
      const luz = haloDeLampada(1.0, P.luzDeAbajur, 0.4);
      luz.name = 'luz-da-porta';
      luz.position.set(x, 2.2, MEIO + 0.1);
      luz.visible = false;
      g.add(luz);
    }
    // as duas folhas
    const lf = dw / 2 - 0.015;
    const af = 1.92;
    for (const s of [-1, 1]) {
      const folha = new THREE.Group();
      folha.name = 'folha-da-porta';
      const x0 = x + s * (lf / 2 + 0.007);
      folha.position.set(x0, cy, MEIO);
      const moldura = redondo(lf, af, 0.04);
      moldura.holes.push(furo(lf - 0.1, 1.02, 0.03, 0, 0.38), furo(lf - 0.1, 0.62, 0.03, 0, -0.52));
      const pintura = new THREE.Mesh(placa(moldura, 0.03), toon(P.onibusPorta));
      pintura.position.z = 0.04;
      folha.add(pintura);
      for (const [h, dy] of [[1.02, 0.38], [0.62, -0.52]] as const) {
        const vidro = new THREE.Mesh(placa(redondo(lf - 0.1, h, 0.03), 0.018), toon(P.glass, { glow: 0.12 }));
        vidro.position.set(0, dy, 0.046);
        folha.add(vidro);
      }
      // a borracha da beirada que se encontra com a outra folha, e o puxador
      // (2,5 mm além da moldura: rente, a face dela caía no plano da beirada da moldura)
      // (e 1 cm mais baixa: da mesma altura, o topo dela caía no topo da moldura)
      const beira = new THREE.Mesh(quina(0.04, af - 0.01, 0.04, 0.012), toon(P.onibusBorracha));
      beira.position.set(-s * (lf / 2 - 0.0175), 0, 0.055);
      folha.add(beira);
      const puxador = new THREE.Mesh(quina(0.025, 0.22, 0.03, 0.01), toon(P.onibusCromo));
      puxador.position.set(-s * (lf / 2 - 0.09), -0.05, 0.085);
      folha.add(puxador);
      g.add(folha);
      this.folhas[qual].push({ grupo: folha, x0, lado: s, curso: lf - 0.06 });
    }
  }

  private montarPortas(_cor: number): void {
    this.montarPorta('frente');
    this.montarPorta('meio');
  }

  // --------------------------------------------------------------- a frente
  private montarFrente(destino: string): void {
    const g = this.group;
    const xf = C / 2;
    // a parte deitada (o para-brisa e o letreiro), num quadro que deita com ela
    const deitada = new THREE.Group();
    const angulo = Math.atan2(FRENTE.deita, FRENTE.alto - FRENTE.reta);
    deitada.position.set(xf, FRENTE.reta, 0);
    deitada.rotation.z = angulo;
    g.add(deitada);
    const lw = L - 0.3;
    deitada.add(new THREE.Mesh(deFrente(placa(redondo(lw, 1.16, 0.12), 0.015), 0.002, 0.68, 0), toon(P.onibusBorracha)));
    const lp = (lw - 0.1) / 2;
    for (const s of [-1, 1]) {
      deitada.add(new THREE.Mesh(deFrente(placa(redondo(lp, 1.08, 0.1), 0.012), 0.008, 0.68, s * (lp / 2 + 0.03)), toon(P.glass, { glow: 0.12 })));
    }
    // o letreiro de LED em cima, numa caixa escura
    const caixa = new THREE.Mesh(quina(0.07, 0.27, L - 0.46, 0.03), toon(P.onibusPainel));
    caixa.position.set(0.02, 1.4, 0);
    deitada.add(caixa);
    const led = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.6, 0.19), letreiroDeLed(destino));
    led.name = 'letreiro-da-frente';
    led.rotation.y = Math.PI / 2;
    led.position.set(0.057, 1.4, 0);
    deitada.add(led);
    // as duas luzinhas de gabarito em cima do letreiro
    for (const s of [-1, 1]) {
      const gabarito = new THREE.Mesh(quina(0.05, 0.05, 0.12, 0.015), toon(P.onibusPisca, { glow: 0.4 }));
      gabarito.position.set(0.02, 1.58, s * (L / 2 - 0.35));
      deitada.add(gabarito);
    }
    // os limpadores, deitados no pé do para-brisa
    for (const s of [-1, 1]) {
      const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.9, 6), toon(P.onibusPainel));
      braco.rotation.x = Math.PI / 2 - s * 0.35;
      braco.position.set(0.03, 0.2, s * 0.05 - 0.35 + (s > 0 ? 0.7 : 0));
      deitada.add(braco);
    }

    // a parte reta: os faróis duplos na moldura de cromo, o pisca, a grade com o emblema
    for (const s of [-1, 1]) {
      const z = s * (MEIO - 0.42);
      g.add(new THREE.Mesh(deFrente(placa(redondo(0.52, 0.27, 0.08), 0.03), xf + 0.002, 0.86, z), toon(P.onibusCromo)));
      g.add(new THREE.Mesh(deFrente(placa(redondo(0.46, 0.21, 0.06), 0.012), xf + 0.03, 0.86, z), toon(P.onibusPainel)));
      for (const dz of [-0.11, 0.11]) {
        const farol = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 16), toon(P.onibusFarol, { glow: 0.5 }));
        farol.rotation.z = Math.PI / 2;
        farol.position.set(xf + 0.045, 0.86, z + dz);
        g.add(farol);
      }
      const pisca = new THREE.Mesh(quina(0.04, 0.12, 0.16, 0.03), toon(P.onibusPisca, { glow: 0.3 }));
      pisca.position.set(xf + 0.02, 0.88, s * (MEIO - 0.13));
      g.add(pisca);
    }
    g.add(new THREE.Mesh(deFrente(placa(redondo(1.18, 0.26, 0.06), 0.012), xf + 0.002, 0.87, 0), toon(P.onibusPainel)));
    for (const dy of [-0.07, 0, 0.07]) {
      const lamina = new THREE.Mesh(quina(0.03, 0.03, 1.08, 0.01), toon(P.onibusCromo));
      lamina.position.set(xf + 0.028, 0.87 + dy, 0);
      g.add(lamina);
    }
    // o emblema: um coração vermelho num disco de cromo, no meio da grade
    const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 20), toon(P.onibusCromo));
    disco.rotation.z = Math.PI / 2;
    disco.position.set(xf + 0.05, 0.87, 0);
    g.add(disco);
    const coracao = new THREE.Shape();
    coracao.moveTo(0, -0.055);
    coracao.bezierCurveTo(-0.075, 0, -0.06, 0.06, 0, 0.03);
    coracao.bezierCurveTo(0.06, 0.06, 0.075, 0, 0, -0.055);
    g.add(new THREE.Mesh(deFrente(placa(coracao, 0.012), xf + 0.064, 0.87, 0), toon(P.onibusLanterna)));

    // o para-choque, os faróis de neblina e a placa
    const choque = new THREE.Mesh(quina(0.3, 0.3, L + 0.04, 0.09), toon(P.onibusChassi));
    choque.position.set(xf + 0.05, 0.58, 0);
    g.add(choque);
    for (const s of [-1, 1]) {
      const neblina = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 14), toon(P.onibusFarol, { glow: 0.35 }));
      neblina.rotation.z = Math.PI / 2;
      neblina.position.set(xf + 0.2, 0.58, s * 0.85);
      g.add(neblina);
    }
    const chapa = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.145), placaDoMercosul());
    chapa.name = 'placa-da-frente';
    chapa.rotation.y = Math.PI / 2;
    chapa.position.set(xf + 0.204, 0.58, 0);
    g.add(chapa);

    // os retrovisores "orelha de coelho": o braço sai da quina de cima e pende para a frente
    for (const s of [-1, 1]) {
      const curva = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xf - 0.32, 2.7, s * (MEIO - 0.02)),
        new THREE.Vector3(xf + 0.05, 2.86, s * (MEIO + 0.2)),
        new THREE.Vector3(xf + 0.32, 2.62, s * (MEIO + 0.26)),
        new THREE.Vector3(xf + 0.36, 2.32, s * (MEIO + 0.22)),
      ], false, 'centripetal');
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 14, 0.024, 6, false), toon(P.onibusPainel)));
      const espelho = new THREE.Mesh(quina(0.07, 0.42, 0.24, 0.05), toon(P.onibusPainel));
      espelho.position.set(xf + 0.36, 2.12, s * (MEIO + 0.22));
      g.add(espelho);
    }
  }

  // -------------------------------------------------------------- a traseira
  private montarTraseira(cor: number): void {
    const g = this.group;
    const xt = -C / 2;
    g.add(new THREE.Mesh(deFrente(placa(redondo(L - 0.62, 0.84, 0.1), 0.014), xt - 0.002, 2.2, 0, false), toon(P.onibusBorracha)));
    g.add(new THREE.Mesh(deFrente(placa(redondo(L - 0.7, 0.76, 0.08), 0.012), xt - 0.008, 2.2, 0, false), toon(P.glass, { glow: 0.12 })));
    // a tampa do motor com as venezianas
    const tampa = new THREE.Mesh(quina(0.06, 0.5, L - 0.9, 0.04), toon(cor));
    tampa.position.set(xt - 0.02, 1.62, 0);
    g.add(tampa);
    for (let i = 0; i < 5; i++) {
      const veneziana = new THREE.Mesh(quina(0.03, 0.035, L - 1.1, 0.01), toon(P.onibusPainel));
      veneziana.position.set(xt - 0.05, 1.45 + i * 0.085, 0);
      g.add(veneziana);
    }
    // as lanternas em pé: o freio vermelho em cima, o pisca, e a ré branca embaixo
    for (const s of [-1, 1]) {
      const z = s * (MEIO - 0.3);
      g.add(new THREE.Mesh(deFrente(placa(redondo(0.26, 0.74, 0.07), 0.025), xt - 0.002, 1.05, z, false), toon(P.onibusCromo)));
      const freio = new THREE.Mesh(quina(0.04, 0.34, 0.2, 0.04), toon(P.onibusLanterna, { glow: 0.3 }));
      freio.position.set(xt - 0.03, 1.15, z);
      g.add(freio);
      const pisca = new THREE.Mesh(quina(0.04, 0.16, 0.2, 0.04), toon(P.onibusPisca, { glow: 0.3 }));
      pisca.position.set(xt - 0.03, 0.88, z);
      g.add(pisca);
      const re = new THREE.Mesh(quina(0.04, 0.1, 0.2, 0.03), toon(P.onibusRe, { glow: 0.2 }));
      re.position.set(xt - 0.03, 0.75, z);
      g.add(re);
    }
    // (mais largo que a saia: na mesma largura, o lado dele caía no plano dela)
    const choque = new THREE.Mesh(quina(0.3, 0.3, L + 0.05, 0.09), toon(P.onibusChassi));
    choque.position.set(xt - 0.04, 0.58, 0);
    g.add(choque);
    const chapa = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.145), placaDoMercosul());
    chapa.name = 'placa-de-tras';
    chapa.rotation.y = -Math.PI / 2;
    chapa.position.set(xt - 0.194, 0.58, 0);
    g.add(chapa);
    const escape = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.4, 10), toon(P.metalGrey));
    escape.rotation.z = Math.PI / 2;
    escape.position.set(xt - 0.06, 0.3, -(MEIO - 0.45));
    g.add(escape);
  }

  // ------------------------------------------------------------------ o teto
  private montarTeto(): void {
    const g = this.group;
    const ar = new THREE.Mesh(quina(2.4, 0.26, 1.5, 0.1), toon(P.metalWhite));
    ar.position.set(0.4, TETO + 0.1, 0);
    g.add(ar);
    for (const dx of [-0.55, 0.55]) {
      const grade = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 20), toon(P.onibusPainel));
      grade.position.set(0.4 + dx, TETO + 0.235, 0);
      g.add(grade);
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.022, 6, 24), toon(P.onibusCromo));
      aro.rotation.x = Math.PI / 2;
      aro.position.set(0.4 + dx, TETO + 0.245, 0);
      g.add(aro);
      // as pás da ventoinha
      for (let i = 0; i < 4; i++) {
        const pa = new THREE.Mesh(quina(0.22, 0.012, 0.07, 0.006), toon(P.metalGrey));
        pa.rotation.y = (i * Math.PI) / 4 + 0.3;
        pa.position.set(0.4 + dx, TETO + 0.25, 0);
        g.add(pa);
      }
    }
    for (const x of [-2.7, 2.85]) {
      const escotilha = new THREE.Mesh(quina(0.72, 0.08, 0.72, 0.04), toon(P.onibusFaixa));
      escotilha.position.set(x, TETO + 0.02, 0);
      g.add(escotilha);
      const tampo = new THREE.Mesh(quina(0.56, 0.04, 0.56, 0.03), toon(P.onibusPainel));
      tampo.position.set(x, TETO + 0.07, 0);
      g.add(tampo);
    }
  }

  // ------------------------------------------------------- miudezas dos lados
  private montarDetalhesDoLado(destino: string): void {
    const g = this.group;
    // o letreiro do lado, em cima da porta da frente (e do lado da rua, no mesmo lugar)
    for (const lado of [1, -1] as const) {
      const x = 2.6;
      g.add(new THREE.Mesh(noLado(placa(redondo(1.2, 0.22, 0.04), 0.03), x, 2.75, lado, 0.002), toon(P.onibusPainel)));
      const led = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.15), letreiroDeLed(destino, 384, 54));
      led.name = 'letreiro-do-lado';
      if (lado < 0) led.rotation.y = Math.PI;
      led.position.set(x, 2.75, lado * (MEIO + 0.034));
      g.add(led);
    }
    // os pisca-laterais (âmbar) ao longo da saia
    for (const lado of [1, -1]) {
      for (const x of [4.05, -1.55, -4.05]) {
        if (lado > 0 && Object.values(PORTAS).some((p) => Math.abs(x - p.x) < p.largura / 2 + 0.15)) continue;
        const lampada = new THREE.Mesh(quina(0.12, 0.06, 0.03, 0.015), toon(P.onibusPisca, { glow: 0.35 }));
        lampada.position.set(x, 0.62, lado * (MEIO + 0.022));
        g.add(lampada);
      }
    }
    // a tampa do tanque, do lado da rua
    g.add(new THREE.Mesh(noLado(placa(redondo(0.26, 0.26, 0.05), 0.012), -1.0, 0.95, -1, 0.002), toon(P.onibusFriso)));
  }

  // ---------------------------------------------------------------- as rodas
  /**
   * AS RODAS SÃO UM LOTE: o pneu torneado (banda arredondada), o aro, a calota
   * de cromo, os rasgos escuros e as porcas, pintados nos vértices e
   * juntados numa geometria só — seis rodas de fora e as duas de dentro da
   * dupla de trás são oito cópias. Os rasgos e as porcas é que mostram o giro.
   */
  private montarRodas(): THREE.InstancedMesh {
    const r = RODA.raio;
    const pedacos: THREE.BufferGeometry[] = [];
    const perfil = [
      [0.27, -0.13], [0.41, -0.14], [0.46, -0.125], [r, -0.07], [r, 0.07], [0.46, 0.125], [0.41, 0.14], [0.27, 0.13],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const pneu = new THREE.LatheGeometry(perfil, 22);
    pneu.rotateX(Math.PI / 2);
    pedacos.push(pintada(pneu, P.onibusPneu));
    const aro = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 22);
    aro.rotateX(Math.PI / 2);
    pedacos.push(pintada(aro, P.onibusCalota));
    const calota = new THREE.SphereGeometry(0.13, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    calota.scale(1, 0.45, 1);
    calota.rotateX(Math.PI / 2);
    calota.translate(0, 0, 0.11);
    pedacos.push(pintada(calota, P.onibusCromo));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const rasgo = new THREE.BoxGeometry(0.05, 0.09, 0.01);
      rasgo.rotateZ(a);
      rasgo.translate(Math.cos(a + Math.PI / 2) * 0.215, Math.sin(a + Math.PI / 2) * 0.215, 0.112);
      pedacos.push(pintada(rasgo, P.onibusPneu));
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const porca = new THREE.CylinderGeometry(0.018, 0.018, 0.03, 6);
      porca.rotateX(Math.PI / 2);
      porca.translate(Math.cos(a) * 0.16, Math.sin(a) * 0.16, 0.115);
      pedacos.push(pintada(porca, P.onibusChassi));
    }
    const geo = mergeGeometries(pedacos);
    const lote = new THREE.InstancedMesh(geo, toon(0xffffff, { corPorVertice: true }), 8);
    lote.name = 'rodas';
    lote.castShadow = true;
    for (const lado of [1, -1] as const) {
      this.lugaresDasRodas.push({ x: EIXOS[0], z: lado * (MEIO - 0.2), lado });
      this.lugaresDasRodas.push({ x: EIXOS[1], z: lado * (MEIO - 0.17), lado });
      this.lugaresDasRodas.push({ x: EIXOS[1], z: lado * (MEIO - 0.47), lado });
    }
    // (oito: as de dentro da dupla mostram só o pneu, que é o que se vê)
    this.lugaresDasRodas.length = 8;
    this.group.add(lote);
    this.posicionarRodas(lote);
    return lote;
  }

  private posicionarRodas(lote: THREE.InstancedMesh): void {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const giro = new THREE.Quaternion();
    const vira = new THREE.Quaternion();
    const um = new THREE.Vector3(1, 1, 1);
    this.lugaresDasRodas.forEach((p, i) => {
      // o lado da rua é a mesma roda virada meia volta (a calota para fora)
      vira.setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.lado > 0 ? 0 : Math.PI);
      giro.setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.giroDasRodas);
      q.multiplyQuaternions(giro, vira);
      m.compose(new THREE.Vector3(p.x, RODA.raio, p.z), q, um);
      lote.setMatrixAt(i, m);
    });
    lote.instanceMatrix.needsUpdate = true;
  }

  // -------------------------------------------------------------- a cena usa
  /** as rodas giram o que o ônibus andou (para a frente, `+X`, é positivo) */
  rodar(distancia: number): void {
    this.giroDasRodas -= distancia / RODA.raio;
    this.posicionarRodas(this.rodas);
  }

  /** a porta (da frente ou do meio) aberta de 0 a 1: as folhas saem um dedo e correm para os lados */
  porta(k: number, qual: 'frente' | 'meio' = 'frente'): void {
    const t = THREE.MathUtils.clamp(k, 0, 1);
    for (const f of this.folhas[qual]) {
      f.grupo.position.x = f.x0 + f.lado * f.curso * t;
      f.grupo.position.z = MEIO + 0.05 * Math.min(1, t * 3);
    }
    if (qual === 'frente') {
      this.aberta = t;
      this.luzDaPorta.visible = t > 0.2;
    }
  }

  /**
   * TROCA O LETREIRO (o da frente e os dos lados): é o que a festa de
   * Halloween faz no ônibus do ponto ("Festa no Parque"). As malhas do LED
   * têm nome, então ficam fora da `fundir()` e trocam de material sozinhas.
   */
  trocarDestino(texto: string): void {
    this.destino = texto;
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (m.name === 'letreiro-da-frente') m.material = letreiroDeLed(texto);
      if (m.name === 'letreiro-do-lado') m.material = letreiroDeLed(texto, 384, 54);
    });
  }

  /** o halo dos faróis e a poça de luz na rua */
  acenderFarois(sim: boolean): void {
    this.farois.visible = sim;
  }

  /** o pisca-alerta (o `update` faz piscar) */
  piscaAlerta(sim: boolean): void {
    this.piscando = sim;
    this.relogioDoPisca = 0;
    if (!sim) this.piscas.visible = false;
  }

  update(dt: number): void {
    if (!this.piscando) return;
    this.relogioDoPisca += dt;
    this.piscas.visible = this.relogioDoPisca % 0.7 < 0.38;
  }
}
