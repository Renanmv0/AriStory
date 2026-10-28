import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { acesoPorVertice, brilhoEmLote, luzNoChao, toon } from '../../core/materials';
import { quina } from '../lojaDeRoupas';
import { acabar, uvDeParede } from '../acabamento';
import { veioDeMadeira } from '../texturasDeCasa';
import { novaTextura, sorteio } from '../texturasDeChao';

/*
 * O CARRINHO DE POÇÕES DO NOEL, o posto dele na noite da festa
 * (`docs/HALLOWEEN.md`, §2.4.1, C). Pedido do Renan: "bem detalhado e bem
 * feito" — e ele vai ser visto DE PERTO, na conversa com zoom.
 *
 * É um carrinho de feira de bruxa com cara de laboratório (o Noel está de
 * cientista): a caixa de tábua pintada de roxo com estrelinhas e o friso
 * laranja, o painel da frente pintado à mão com as três poções da casa, as
 * duas rodas de raio com o aro de ferro, os pés e o puxador atrás; em cima,
 * a escadinha de prateleiras com as poções em quatro feitios de vidro (a
 * bebida acesa por dentro, a rolha, a etiqueta), o suporte de tubos de
 * ensaio, o livro de receitas aberto, o pilão e, na ponta, o ALAMBIQUE: o
 * balão de fundo redondo borbulhando verde em cima do tripé, a lamparina de
 * chama azul embaixo, a serpentina de vidro descendo até o erlenmeyer que
 * pinga roxo. Por cima, o toldo listrado em arco com o lambrequim recortado
 * e os pompons nas pontas, os postes enrolados de fita, a placa "Poções do
 * Noel" e os maços de erva seca pendurados atrás. No chão, à parte, a lousa
 * de cavalete (`cavaleteDePocoes`).
 *
 * O contrato do kit: base em `y = 0`, a frente (o balcão) olhando para `+Z`,
 * e a cena passa a peça pela `fundir()`. O vidro é transparente (a `fundir`
 * não junta transparente, porque a ordem de pintura importa): as garrafas
 * daqui já nascem juntas numa malha só, pela mesma razão que a deixa de fora
 * — dentro de um lote de vidros iguais, a ordem entre eles não aparece. O que
 * mexe (as bolhas, o vapor, a chama, a gota) é lote ou malha com nome.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** o tamanho da caixa e a altura do balcão */
const CAIXA = { largura: 1.5, fundo: 0.72, base: 0.34, topo: 0.92 };
const BALCAO = 0.97;
/** o toldo: a beira dele e o quanto o arco sobe no meio */
const TOLDO = { largura: 1.84, fundo: 1.02, beira: 2.32, arco: 0.17 };
/** a altura do toldo em `x` (o arco é ao longo do comprimento) */
const alturaDoToldo = (x: number): number => TOLDO.beira + TOLDO.arco * (1 - (2 * x / TOLDO.largura) ** 2);

// ================================================================ as texturas

/**
 * A MADEIRA PINTADA DA CAIXA: tábuas em pé de roxo com a junta escura e o
 * filete de luz, o pincel aparecendo, e estrelinhas e luas laranja pintadas
 * à mão aqui e ali. Traz a cor no desenho (o material é branco), porque as
 * estrelas são MAIS CLARAS que o roxo — e textura multiplicada só escurece.
 */
function madeiraPintada(): THREE.CanvasTexture {
  return novaTextura('carrinho:madeira-pintada', 0.6, (c, s) => {
    const rnd = sorteio(7171);
    c.fillStyle = css(P.carrinhoMadeira);
    c.fillRect(0, 0, s, s);
    const tabuas = 5;
    const passo = s / tabuas;
    for (let t = 0; t < tabuas; t++) {
      const x0 = t * passo;
      c.fillStyle = `rgba(${rnd() < 0.5 ? '0,0,0' : '255,255,255'},${0.03 + rnd() * 0.04})`;
      c.fillRect(x0, 0, passo, s);
      // a pincelada: riscos em pé, finos
      for (let k = 0; k < 7; k++) {
        c.strokeStyle = `rgba(30,10,45,${0.07 + rnd() * 0.08})`;
        c.lineWidth = 1.5;
        const x = x0 + 4 + rnd() * (passo - 8);
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x + (rnd() - 0.5) * 3, s);
        c.stroke();
      }
      c.fillStyle = css(P.carrinhoMadeiraFunda);
      c.fillRect(x0, 0, 4, s);
      c.fillStyle = 'rgba(255,230,255,0.18)';
      c.fillRect(x0 + 4, 0, 2, s);
    }
    // as estrelinhas e as luas (desenhadas três vezes para fechar a emenda)
    const estrela = (x: number, y: number, r: number): void => {
      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 ? r * 0.45 : r;
        c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      c.closePath();
      c.fill();
    };
    const lua = (x: number, y: number, r: number): void => {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.arc(x + r * 0.45, y - r * 0.2, r * 0.82, 0, Math.PI * 2, true);
      c.fill('evenodd');
    };
    for (let i = 0; i < 7; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = 6 + rnd() * 7;
      const tipo = i % 3;
      c.fillStyle = tipo === 2 ? css(P.giz) : css(P.carrinhoFriso);
      for (const [dx, dy] of [[0, 0], [-s, 0], [s, 0], [0, -s], [0, s]] as const) {
        if (tipo === 1) lua(x + dx, y + dy, r);
        else estrela(x + dx, y + dy, r);
      }
    }
  });
}

/** o listrado do toldo: roxo e verde-poção, em faixas em pé, com a dobra sombreada */
let listrado: THREE.CanvasTexture | null = null;
function panoListrado(): THREE.CanvasTexture {
  if (listrado) return listrado;
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 64;
  const c = cv.getContext('2d');
  if (c) {
    const faixas = 9;
    const w = 512 / faixas;
    for (let i = 0; i < faixas; i++) {
      c.fillStyle = css(i % 2 ? P.pocaoVerde : P.carrinhoMadeira);
      c.fillRect(i * w, 0, w + 1, 64);
      // a costura entre as faixas e a dobra do pano, de leve
      const g = c.createLinearGradient(i * w, 0, (i + 1) * w, 0);
      g.addColorStop(0, 'rgba(0,0,0,0.12)');
      g.addColorStop(0.5, 'rgba(255,255,255,0.05)');
      g.addColorStop(1, 'rgba(0,0,0,0.12)');
      c.fillStyle = g;
      c.fillRect(i * w, 0, w, 64);
      c.fillStyle = 'rgba(255,240,220,0.5)';
      for (let y = 3; y < 64; y += 8) c.fillRect(i * w + 2, y, 2, 4);
    }
  }
  listrado = new THREE.CanvasTexture(cv);
  listrado.colorSpace = THREE.SRGBColorSpace;
  listrado.anisotropy = 4;
  return listrado;
}

const FONTE_FORMA = '"Kalam", "Segoe Print", "Comic Sans MS", cursive';
const FONTE_REDONDA = '"Caveat", "Segoe Print", "Bradley Hand", cursive';

/** um canvas que se redesenha quando as letras de mão terminam de carregar */
function canvasComLetra(l: number, a: number, desenhar: (c: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = l;
  cv.height = a;
  const c = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const pintar = (): void => {
    if (!c) return;
    c.clearRect(0, 0, l, a);
    c.lineJoin = 'round';
    c.lineCap = 'round';
    desenhar(c);
    tex.needsUpdate = true;
  };
  pintar();
  if (typeof document !== 'undefined' && document.fonts) {
    void Promise.all([document.fonts.load('700 40px Caveat'), document.fonts.load('700 40px Kalam')]).then(pintar, () => {});
  }
  return tex;
}

/** um frasquinho desenhado (o painel e a lousa): o corpo redondo, o gargalo, a rolha e o líquido */
function desenharFrasco(c: CanvasRenderingContext2D, x: number, y: number, r: number, liquido: string, contorno: string): void {
  c.lineWidth = Math.max(3, r * 0.12);
  // o líquido: a metade de baixo do balão
  c.fillStyle = liquido;
  c.beginPath();
  c.arc(x, y, r * 0.9, 0.15, Math.PI - 0.15);
  c.closePath();
  c.fill();
  c.strokeStyle = contorno;
  c.beginPath();
  c.arc(x, y, r, -Math.PI / 2 + 0.38, -Math.PI / 2 - 0.38 + Math.PI * 2);
  c.lineTo(x - r * 0.3, y - r * 1.55);
  c.moveTo(x + r * 0.3, y - r * 1.55);
  c.lineTo(x + r * 0.37, y - r * 0.93);
  c.stroke();
  c.fillStyle = css(P.cortica);
  c.fillRect(x - r * 0.38, y - r * 1.85, r * 0.76, r * 0.36);
  // o brilho do vidro
  c.strokeStyle = 'rgba(255,255,255,0.75)';
  c.beginPath();
  c.arc(x, y, r * 0.68, Math.PI * 1.1, Math.PI * 1.35);
  c.stroke();
}

/**
 * O PAINEL DA FRENTE, pintado à mão: a moldura creme com o filete laranja,
 * as três poções da casa (o amor, a risada e a coragem) com o nome embaixo,
 * as estrelinhas e o "feitas na hora!".
 */
function painelDaFrente(): THREE.CanvasTexture {
  const L = 640;
  const A = 288;
  return canvasComLetra(L, A, (c) => {
    // a placa: creme com o canto redondo e o filete laranja por dentro
    const canto = 34;
    const caminho = (m: number): void => {
      c.beginPath();
      c.moveTo(m + canto, m);
      c.arcTo(L - m, m, L - m, A - m, canto);
      c.arcTo(L - m, A - m, m, A - m, canto);
      c.arcTo(m, A - m, m, m, canto);
      c.arcTo(m, m, L - m, m, canto);
      c.closePath();
    };
    caminho(4);
    c.fillStyle = css(P.etiquetaDePocao);
    c.fill();
    c.lineWidth = 6;
    c.strokeStyle = css(P.carrinhoFriso);
    caminho(16);
    c.stroke();
    // o manchado de papel velho
    const rnd = sorteio(31);
    for (let i = 0; i < 26; i++) {
      c.fillStyle = `rgba(160,120,60,${0.03 + rnd() * 0.04})`;
      c.beginPath();
      c.arc(30 + rnd() * (L - 60), 30 + rnd() * (A - 60), 10 + rnd() * 30, 0, Math.PI * 2);
      c.fill();
    }
    const tinta = css(P.carrinhoMadeiraFunda);
    const pocoes: Array<[string, number]> = [['amor', P.pocaoRosa], ['risada', P.pocaoLaranja], ['coragem', P.pocaoVerde]];
    pocoes.forEach(([nome, cor], i) => {
      const x = L * (0.2 + i * 0.3);
      desenharFrasco(c, x, 132, 44, css(cor), tinta);
      // um coração, uma carinha rindo e um raio, no meio do balão
      c.fillStyle = 'rgba(255,255,255,0.9)';
      c.strokeStyle = 'rgba(255,255,255,0.9)';
      c.lineWidth = 4;
      if (i === 0) {
        c.beginPath();
        c.moveTo(x, 150);
        c.bezierCurveTo(x - 22, 136, x - 14, 118, x, 128);
        c.bezierCurveTo(x + 14, 118, x + 22, 136, x, 150);
        c.fill();
      } else if (i === 1) {
        c.beginPath();
        c.arc(x, 136, 12, 0.2, Math.PI - 0.2);
        c.stroke();
        c.fillRect(x - 9, 122, 4, 5);
        c.fillRect(x + 5, 122, 4, 5);
      } else {
        c.beginPath();
        c.moveTo(x + 4, 116);
        c.lineTo(x - 8, 138);
        c.lineTo(x + 2, 138);
        c.lineTo(x - 4, 156);
        c.lineTo(x + 10, 132);
        c.lineTo(x, 132);
        c.closePath();
        c.fill();
      }
      c.fillStyle = tinta;
      c.font = `700 38px ${FONTE_REDONDA}`;
      c.textAlign = 'center';
      c.textBaseline = 'alphabetic';
      c.fillText(nome, x, 222);
    });
    c.font = `700 30px ${FONTE_FORMA}`;
    c.fillStyle = css(P.aboboraFunda);
    c.fillText('~ feitas na hora! ~', L / 2, 266);
    // as estrelinhas nos cantos
    c.fillStyle = css(P.carrinhoFriso);
    for (const [x, y, r] of [[48, 52, 12], [L - 50, 50, 14], [L / 2, 44, 10], [L * 0.35, 62, 7], [L * 0.65, 60, 8]] as const) {
      c.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        c.lineTo(x + Math.cos(a) * (k % 2 ? r * 0.45 : r), y + Math.sin(a) * (k % 2 ? r * 0.45 : r));
      }
      c.fill();
    }
  });
}

/** a placa de cima: "Poções do Noel" em laranja sobre a tábua roxa, com a peninha de peru */
function letreiro(): THREE.CanvasTexture {
  const L = 640;
  const A = 200;
  return canvasComLetra(L, A, (c) => {
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `700 92px ${FONTE_FORMA}`;
    c.lineWidth = 14;
    c.strokeStyle = css(P.carrinhoMadeiraFunda);
    c.strokeText('Poções', L / 2, 92);
    c.fillStyle = css(P.carrinhoFriso);
    c.fillText('Poções', L / 2, 92);
    c.font = `700 46px ${FONTE_REDONDA}`;
    c.fillStyle = css(P.giz);
    c.fillText('do Noel', L / 2, 160);
    // duas bolhas de cada lado
    c.strokeStyle = css(P.pocaoVerde);
    c.lineWidth = 5;
    for (const [x, y, r] of [[96, 70, 16], [72, 120, 10], [L - 96, 70, 16], [L - 72, 120, 10]] as const) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.stroke();
    }
  });
}

/** a página do livro de receitas: a letra do Noel, com os ingredientes e um rabisco de balão */
function paginaDeReceita(lado: 'esq' | 'dir'): THREE.CanvasTexture {
  const L = 256;
  const A = 320;
  return canvasComLetra(L, A, (c) => {
    c.fillStyle = css(P.papelDoRecado);
    c.fillRect(0, 0, L, A);
    // a sombra da lombada
    const g = c.createLinearGradient(lado === 'esq' ? L : 0, 0, lado === 'esq' ? L - 60 : 60, 0);
    g.addColorStop(0, 'rgba(90,60,30,0.35)');
    g.addColorStop(1, 'rgba(90,60,30,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, L, A);
    c.fillStyle = css(P.carrinhoMadeiraFunda);
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    if (lado === 'esq') {
      c.font = `700 40px ${FONTE_REDONDA}`;
      c.fillText('Poção do riso', 22, 54);
      c.font = `700 30px ${FONTE_REDONDA}`;
      ['1 pena de peru', '2 risadas', 'suco de laranja', 'mexer 3 vezes!'].forEach((t, i) => c.fillText(`· ${t}`, 22, 108 + i * 46));
    } else {
      desenharFrasco(c, L / 2, 150, 46, css(P.pocaoLaranja), css(P.carrinhoMadeiraFunda));
      c.font = `700 30px ${FONTE_REDONDA}`;
      c.textAlign = 'center';
      c.fillText('não beber', L / 2, 250);
      c.fillText('de canudinho', L / 2, 284);
    }
  });
}

// =============================================================== as garrafas

/** os quatro feitios de vidro: o perfil (raio, altura) de cada um, do fundo à boca */
const FEITIOS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  // o balãozinho redondo
  [[0, 0], [0.034, 0.003], [0.05, 0.028], [0.052, 0.05], [0.046, 0.074], [0.022, 0.09], [0.014, 0.1], [0.014, 0.13], [0.018, 0.134]],
  // a garrafa alta
  [[0, 0], [0.03, 0.002], [0.033, 0.012], [0.033, 0.1], [0.028, 0.116], [0.012, 0.13], [0.012, 0.166], [0.016, 0.17]],
  // o erlenmeyer
  [[0, 0], [0.046, 0.002], [0.048, 0.012], [0.018, 0.088], [0.016, 0.122], [0.02, 0.126]],
  // a gota de pescoço comprido
  [[0, 0], [0.02, 0.003], [0.044, 0.038], [0.04, 0.074], [0.02, 0.1], [0.01, 0.118], [0.01, 0.152], [0.014, 0.156]],
];

/** onde o pescoço começa em cada feitio (a bebida para abaixo dele) e o raio da boca */
const PESCOCO = [{ y: 0.09, boca: 0.014 }, { y: 0.12, boca: 0.012 }, { y: 0.085, boca: 0.016 }, { y: 0.1, boca: 0.01 }];

/** o raio do perfil numa altura (interpolado) */
function raioNa(perfil: ReadonlyArray<readonly [number, number]>, y: number): number {
  for (let i = 1; i < perfil.length; i++) {
    const [r0, y0] = perfil[i - 1];
    const [r1, y1] = perfil[i];
    if (y <= y1) return r0 + (r1 - r0) * ((y - y0) / Math.max(1e-6, y1 - y0));
  }
  return perfil[perfil.length - 1][0];
}

/** o vidro: o perfil torneado (aberto na boca: a rolha tampa) */
function geoVidro(feitio: number): THREE.BufferGeometry {
  return new THREE.LatheGeometry(FEITIOS[feitio].map(([r, y]) => new THREE.Vector2(r, y)), 14);
}

/** a bebida: o mesmo perfil um tico menor, até a altura `cheio` (0..1 do corpo), com a tampa lisa */
function geoBebida(feitio: number, cheio: number): THREE.BufferGeometry {
  const perfil = FEITIOS[feitio];
  const topo = PESCOCO[feitio].y * cheio;
  const pts = perfil.filter(([, y]) => y > 0.002 && y < topo).map(([r, y]) => new THREE.Vector2(r * 0.84, y));
  return new THREE.LatheGeometry([new THREE.Vector2(0, 0.004), ...pts, new THREE.Vector2(raioNa(perfil, topo) * 0.84, topo), new THREE.Vector2(0, topo)], 14);
}

/** pinta a geometria inteira de uma cor, mais escura embaixo (a bebida acesa por dentro) */
function pintarVertices(geo: THREE.BufferGeometry, cor: number, escuroEmbaixo = 0.62, altura = 0.12): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.getAttribute('position');
  const cores = new Float32Array(pos.count * 3);
  const base = new THREE.Color(cor);
  const c = new THREE.Color();
  g.computeBoundingBox();
  const y0 = g.boundingBox!.min.y;
  for (let i = 0; i < pos.count; i++) {
    const t = Math.min(1, (pos.getY(i) - y0) / altura);
    c.copy(base).multiplyScalar(escuroEmbaixo + (1 - escuroEmbaixo) * t);
    cores.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return g;
}

/** só posição e normal (o que todo pedaço junta tem em comum), sem índice */
function limpo(geo: THREE.BufferGeometry, manter: readonly string[] = ['position', 'normal']): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const n of Object.keys(g.attributes)) if (!manter.includes(n)) g.deleteAttribute(n);
  return g;
}

/**
 * Junta pedaços do MESMO material, já no lugar, numa malha só — para o que a
 * `fundir()` deixa de fora de propósito (o vidro transparente e a bebida de
 * cor por vértice) e que aqui pode ir junto sem mudar nada do que se vê.
 */
class Juntar {
  private readonly pedacos: THREE.BufferGeometry[] = [];
  constructor(private readonly manter: readonly string[] = ['position', 'normal']) {}
  por(geo: THREE.BufferGeometry, x: number, y: number, z: number, giro = 0, escala = 1): void {
    const g = limpo(geo.clone(), this.manter);
    g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, giro, 0)), new THREE.Vector3(escala, escala, escala)));
    this.pedacos.push(g);
  }
  malha(mat: THREE.Material, nome: string): THREE.Mesh | null {
    if (!this.pedacos.length) return null;
    const m = new THREE.Mesh(mergeGeometries(this.pedacos), mat);
    m.name = nome;
    return m;
  }
}

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

/** um cilindro de `a` até `b` */
function haste(a: THREE.Vector3, b: THREE.Vector3, r: number, lados = 6): THREE.BufferGeometry {
  const d = b.clone().sub(a);
  const geo = new THREE.CylinderGeometry(r, r, d.length(), lados);
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
  geo.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  return geo;
}

// ================================================================ o carrinho

const CORES_DAS_POCOES = [P.pocaoVerde, P.pocaoRoxa, P.pocaoRosa, P.pocaoAzul, P.pocaoLaranja];

interface Bolha {
  fase: number;
  vel: number;
  x: number;
  z: number;
  r: number;
}

export class CarrinhoDePocoes {
  readonly group = new THREE.Group();
  /**
   * os ganchos das duas lanternas da frente, no referencial do carrinho (a
   * cena pendura nelas as lanternas de papel do parque, que já acendem e
   * balançam no lote de lá)
   */
  readonly ganchos: readonly THREE.Vector3[] = [new THREE.Vector3(-0.88, TOLDO.beira - 0.04, 0.5), new THREE.Vector3(0.88, TOLDO.beira - 0.04, 0.5)];
  /** onde o Noel fica: do lado do balcão, fora do toldo (nada acima e à frente dele) */
  readonly ladoDoNoel = new THREE.Vector3(1.45, 0, 0.35);

  private readonly bolhas: THREE.InstancedMesh;
  private readonly listaDeBolhas: Bolha[] = [];
  private readonly vapor: THREE.InstancedMesh;
  private readonly brilhos: THREE.InstancedMesh;
  private readonly coresDosBrilhos: THREE.Color[] = [];
  private readonly chama: THREE.Mesh;
  private readonly gota: THREE.Mesh;
  /** o balão do alambique: o centro dele, o raio e a altura da bebida */
  private readonly balao = { x: 0.56, y: BALCAO + 0.22, z: -0.12, r: 0.085 };
  /** a ponta da serpentina (de onde pinga) e a boca do erlenmeyer */
  private readonly bico = new THREE.Vector3(0.6, BALCAO + 0.2, 0.2);
  private readonly bocaDoFrasco = BALCAO + 0.12;
  private tempo = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly v = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly c = new THREE.Color();

  constructor() {
    this.group.name = 'carrinho-de-pocoes';
    this.group.userData.peca = 'carrinho-de-pocoes';
    this.montarCaixa();
    this.montarRodas();
    this.montarToldo();
    this.montarPrateleira();
    this.montarMiudezas();
    const lab = this.montarAlambique();
    this.chama = lab.chama;
    this.gota = lab.gota;

    // as bolhas subindo dentro do balão
    this.bolhas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), toon(P.giz, { glow: 0.35, opacity: 0.85 }), 9);
    this.bolhas.name = 'bolhas-do-balao';
    const rnd = sorteio(4242);
    for (let i = 0; i < 9; i++) {
      const a = rnd() * Math.PI * 2;
      const d = rnd() * this.balao.r * 0.55;
      this.listaDeBolhas.push({ fase: rnd(), vel: 0.6 + rnd() * 0.7, x: Math.cos(a) * d, z: Math.sin(a) * d, r: 0.006 + rnd() * 0.007 });
    }
    // o vapor verde saindo da boca do balão, e o brilho de cada poção
    this.vapor = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(0xffffff, 0.5), 6);
    this.vapor.name = 'vapor-do-balao';
    this.brilhos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(0xffffff, 0.42), this.pontosDeBrilho.length);
    this.brilhos.name = 'brilho-das-pocoes';
    this.pontosDeBrilho.forEach((p, i) => {
      this.brilhos.setMatrixAt(i, this.m.compose(p.p, this.q, this.s.setScalar(p.tam)));
      this.coresDosBrilhos.push(new THREE.Color(p.cor).multiplyScalar(0.55));
      this.brilhos.setColorAt(i, this.coresDosBrilhos[i]);
    });
    for (const im of [this.bolhas, this.vapor, this.brilhos]) {
      im.frustumCulled = false;
      im.userData.semSombra = true;
      this.group.add(im);
    }
    this.vapor.renderOrder = 4;
    this.brilhos.renderOrder = 3;

    // a luz das poções no chão, na frente do balcão: verde-arroxeada
    const chao = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), luzNoChao(P.pocaoVerde, 0.32));
    chao.name = 'luz-das-pocoes';
    chao.scale.setScalar(4.2);
    chao.position.set(0.1, 0.012, 0.9);
    chao.renderOrder = 2;
    chao.userData.semSombra = true;
    this.group.add(chao);
    this.update(0);
  }

  /** cada poção acesa ganha um halo pequeno na cor dela (preenchido ao montar as garrafas) */
  private readonly pontosDeBrilho: Array<{ p: THREE.Vector3; cor: number; tam: number }> = [];

  // ------------------------------------------------------------- a caixa
  private montarCaixa(): void {
    const g = this.group;
    const { largura: L, fundo: F, base, topo } = CAIXA;
    const alto = topo - base;
    // a caixa de tábua pintada (o desenho em pé, lido na posição da peça)
    const caixa = por(g, uvDeParede(quina(L, alto, F, 0.025), 0, base + alto / 2, 0), toon(0xffffff, { mapa: madeiraPintada() }), 0, base + alto / 2, 0);
    caixa.name = 'caixa-do-carrinho';
    // o tampo de madeira de verdade, com o veio, saindo um pouco para os lados e para a frente
    const tampo = new THREE.Group();
    por(tampo, quina(L + 0.16, 0.05, F + 0.14, 0.015), toon(P.carrinhoRoda), 0, BALCAO - 0.025, 0.03);
    // a borda de cima, o rodapé e as quinas: o friso laranja
    const friso = toon(P.carrinhoFriso);
    for (const z of [F / 2 + 0.006, -F / 2 - 0.006]) {
      por(g, quina(L + 0.02, 0.04, 0.025, 0.008), friso, 0, topo - 0.03, z);
      por(g, quina(L + 0.02, 0.04, 0.025, 0.008), friso, 0, base + 0.025, z);
    }
    for (const x of [L / 2 + 0.006, -L / 2 - 0.006]) {
      por(g, quina(0.025, 0.04, F + 0.02, 0.008), friso, x, topo - 0.03, 0);
      por(g, quina(0.025, 0.04, F + 0.02, 0.008), friso, x, base + 0.025, 0);
      for (const z of [F / 2, -F / 2]) por(g, quina(0.035, alto, 0.035, 0.01), friso, x, base + alto / 2, z);
    }
    acabar(tampo, [[P.carrinhoRoda, veioDeMadeira(0.7)]]);
    g.add(tampo);

    // o painel pintado da frente, com a moldura de friso em volta
    const PL = 0.92;
    const PA = PL * (288 / 640);
    const painel = por(g, new THREE.PlaneGeometry(PL, PA), toon(0xffffff, { mapa: painelDaFrente() }), 0, base + alto / 2 + 0.01, F / 2 + 0.008);
    painel.name = 'painel-das-pocoes';
    // as mãos-francesas embaixo do tampo, na frente: o arco recortado
    const arco = new THREE.Shape();
    arco.moveTo(0, 0);
    arco.lineTo(0.09, 0);
    arco.quadraticCurveTo(0.02, -0.02, 0, -0.1);
    arco.closePath();
    const mao = new THREE.ExtrudeGeometry(arco, { depth: 0.03, bevelEnabled: false, curveSegments: 6 });
    for (const x of [-L / 2 + 0.05, L / 2 - 0.02]) {
      // de lado (o `x` da forma vira o `+Z`), saindo da caixa até a beira do tampo
      const peca = por(g, mao.clone(), toon(P.carrinhoRoda), x, BALCAO - 0.05, F / 2 + 0.018);
      peca.rotation.y = -Math.PI / 2;
    }
    // o lambrequim de baixo da caixa: os arquinhos recortados de friso
    const recorte = new THREE.Shape();
    const n = 9;
    recorte.moveTo(-L / 2, 0);
    recorte.lineTo(L / 2, 0);
    for (let i = n; i > 0; i--) {
      const x1 = -L / 2 + (L * (i - 1)) / n;
      const xm = -L / 2 + (L * (i - 0.5)) / n;
      recorte.quadraticCurveTo(xm, -0.09, x1, 0);
    }
    const saia = new THREE.ShapeGeometry(recorte, 6);
    por(g, saia, toon(P.carrinhoFriso, { doubleSide: true }), 0, base + 0.01, F / 2 + 0.02);
  }

  // -------------------------------------------- as rodas, os pés e o puxador
  private montarRodas(): void {
    const g = this.group;
    const ferro = toon(P.carrinhoFerro);
    const madeira = toon(P.carrinhoRoda);
    const R = 0.33;
    const eixo = { y: R + 0.005, z: 0.06 };
    for (const lado of [-1, 1]) {
      const x = lado * (CAIXA.largura / 2 + 0.07);
      // o aro de ferro e a cambota de madeira por dentro dele
      por(g, new THREE.TorusGeometry(R - 0.018, 0.02, 6, 30).rotateY(Math.PI / 2), ferro, x, eixo.y, eixo.z);
      por(g, new THREE.TorusGeometry(R - 0.05, 0.022, 6, 30).rotateY(Math.PI / 2), madeira, x, eixo.y, eixo.z);
      // os oito raios torneados e o cubo com a tampa de ferro
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.2;
        const fim = new THREE.Vector3(x, eixo.y + Math.sin(a) * (R - 0.06), eixo.z + Math.cos(a) * (R - 0.06));
        por(g, haste(new THREE.Vector3(x, eixo.y, eixo.z), fim, 0.012), madeira);
      }
      por(g, new THREE.CylinderGeometry(0.055, 0.06, 0.08, 12).rotateZ(Math.PI / 2), madeira, x, eixo.y, eixo.z);
      por(g, new THREE.CylinderGeometry(0.03, 0.03, 0.095, 10).rotateZ(Math.PI / 2), ferro, x, eixo.y, eixo.z);
      // o pé de trás, em ferro, com a sapatinha
      const px = lado * (CAIXA.largura / 2 - 0.12);
      por(g, haste(new THREE.Vector3(px, CAIXA.base, -0.28), new THREE.Vector3(px, 0.03, -0.3), 0.018), ferro);
      por(g, new THREE.CylinderGeometry(0.035, 0.04, 0.03, 10), ferro, px, 0.015, -0.3);
      // o braço do puxador: sai de trás da caixa e sobe para trás
      const a = new THREE.Vector3(lado * 0.5, CAIXA.base + 0.42, -CAIXA.fundo / 2);
      const b = new THREE.Vector3(lado * 0.5, BALCAO - 0.03, -CAIXA.fundo / 2 - 0.36);
      por(g, haste(a, b, 0.016), ferro);
    }
    // o eixo, por baixo da caixa
    por(g, new THREE.CylinderGeometry(0.02, 0.02, CAIXA.largura + 0.16, 8).rotateZ(Math.PI / 2), ferro, 0, eixo.y, eixo.z);
    // a pega do puxador: madeira com as duas ponteiras de ferro
    const pz = -CAIXA.fundo / 2 - 0.36;
    por(g, new THREE.CylinderGeometry(0.024, 0.024, 1.06, 10).rotateZ(Math.PI / 2), madeira, 0, BALCAO - 0.03, pz);
    for (const lado of [-1, 1]) por(g, new THREE.SphereGeometry(0.03, 10, 8), ferro, lado * 0.54, BALCAO - 0.03, pz);
  }

  // ----------------------------------------------------------------- o toldo
  private montarToldo(): void {
    const g = this.group;
    const { largura: TL, fundo: TF, beira } = TOLDO;
    const pano = toon(0xffffff, { mapa: panoListrado(), doubleSide: true });
    // o pano em arco (o arco corre no comprimento; as listras, do fundo para a frente)
    const teto = new THREE.PlaneGeometry(TL, TF, 20, 4).rotateX(-Math.PI / 2);
    const pos = teto.getAttribute('position');
    for (let i = 0; i < pos.count; i++) pos.setY(i, alturaDoToldo(pos.getX(i)) - beira);
    teto.computeVertexNormals();
    por(g, teto, pano, 0, beira, 0);
    // o lambrequim: a faixa recortada em ondas, na frente (seguindo o arco) e nos lados
    const queda = 0.2;
    const pontas: THREE.Vector3[] = [];
    const lambrequim = (largura: number, alturaEm: (u: number) => number, ondas: number): THREE.BufferGeometry => {
      const pts: number[] = [];
      const uvs: number[] = [];
      const passos = ondas * 6;
      const borda = (k: number): [number, number] => {
        const u = -largura / 2 + (largura * k) / passos;
        const fase = ((k % 6) / 6) * Math.PI;
        // cada onda desce em arco até a ponta, onde mora o pompom
        return [u, alturaEm(u) - queda + 0.07 * (1 - Math.sin(fase))];
      };
      for (let k = 0; k < passos; k++) {
        const [u0, b0] = borda(k);
        const [u1, b1] = borda(k + 1);
        const t0 = alturaEm(u0);
        const t1 = alturaEm(u1);
        pts.push(u0, t0, 0, u0, b0, 0, u1, b1, 0, u0, t0, 0, u1, b1, 0, u1, t1, 0);
        const uu = (u: number): number => u / TOLDO.largura + 0.5;
        uvs.push(uu(u0), 1, uu(u0), 0, uu(u1), 0, uu(u0), 1, uu(u1), 0, uu(u1), 1);
        if (k % 6 === 3) pontas.push(new THREE.Vector3(u0, b0, 0));
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.computeVertexNormals();
      return geo;
    };
    const naPonta = new Juntar();
    const frente = lambrequim(TL, alturaDoToldo, 9);
    por(g, frente, pano, 0, 0, TF / 2);
    for (const p of pontas.splice(0)) naPonta.por(new THREE.SphereGeometry(0.022, 8, 6), p.x, p.y - 0.005, TF / 2 + 0.01);
    for (const lado of [-1, 1]) {
      const geo = lambrequim(TF, () => beira, 5);
      const m = por(g, geo, pano, lado * (TL / 2), 0, 0);
      m.rotation.y = lado * Math.PI / 2;
      for (const p of pontas.splice(0)) naPonta.por(new THREE.SphereGeometry(0.022, 8, 6), lado * (TL / 2 + 0.01), p.y - 0.005, -lado * p.x);
    }
    const pompons = naPonta.malha(toon(P.carrinhoFriso), 'pompons-do-toldo');
    if (pompons) g.add(pompons);
    // a vareta da beira da frente (onde o pano se prende), em ferro
    const curva = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => {
      const x = -TL / 2 + (TL * i) / 8;
      return new THREE.Vector3(x, alturaDoToldo(x) + 0.004, TF / 2 + 0.004);
    }));
    por(g, new THREE.TubeGeometry(curva, 24, 0.012, 5, false), toon(P.carrinhoFerro));

    // os quatro postes de ferro, enrolados de fita laranja, com a bolinha em cima
    const ferro = toon(P.carrinhoFerro);
    const fita = toon(P.carrinhoFriso);
    for (const x of [-0.8, 0.8]) {
      for (const z of [CAIXA.fundo / 2 + 0.02, -CAIXA.fundo / 2 - 0.02]) {
        const topo = alturaDoToldo(x) - 0.005;
        por(g, haste(new THREE.Vector3(x, BALCAO, z), new THREE.Vector3(x, topo, z), 0.018, 8), ferro);
        const voltas = 7;
        const helice = new THREE.CatmullRomCurve3(Array.from({ length: voltas * 8 + 1 }, (_, i) => {
          const t = i / (voltas * 8);
          const a = t * voltas * Math.PI * 2;
          return new THREE.Vector3(x + Math.cos(a) * 0.021, BALCAO + 0.05 + t * (topo - BALCAO - 0.12), z + Math.sin(a) * 0.021);
        }));
        por(g, new THREE.TubeGeometry(helice, voltas * 10, 0.007, 4, false), fita);
        por(g, new THREE.SphereGeometry(0.032, 10, 8), fita, x, topo + 0.03, z);
        // a sapata do poste no tampo
        por(g, new THREE.CylinderGeometry(0.03, 0.036, 0.025, 10), ferro, x, BALCAO + 0.012, z);
      }
    }
    // a vareta de trás, onde pendem os maços de erva
    const tz = -CAIXA.fundo / 2 - 0.02;
    por(g, new THREE.CylinderGeometry(0.01, 0.01, 1.6, 6).rotateZ(Math.PI / 2), ferro, 0, beira - 0.18, tz);
    const erva = toon(P.ervaSeca);
    const barbante = toon(P.barbante);
    const folha = toon(P.folhaDeAbobora);
    [-0.5, -0.18, 0.16, 0.48].forEach((x, i) => {
      const topo = beira - 0.19;
      const comp = 0.2 + (i % 2) * 0.06;
      // o maço: um cone de ponta para baixo, o laço de barbante e o fio até a vareta
      por(g, new THREE.ConeGeometry(0.055, comp, 7).rotateX(Math.PI), i === 2 ? folha : erva, x, topo - 0.06 - comp / 2, tz);
      por(g, new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8), barbante, x, topo - 0.06, tz);
      por(g, new THREE.CylinderGeometry(0.004, 0.004, 0.06, 4), barbante, x, topo - 0.03, tz);
      // os talos saindo por cima do laço
      for (const d of [-1, 0, 1]) {
        por(g, haste(new THREE.Vector3(x, topo - 0.06, tz), new THREE.Vector3(x + d * 0.025, topo - 0.02, tz + 0.01), 0.004, 4), erva);
      }
    });

    // a placa em arco por cima da frente, com o friso em volta
    const PL = 1.18;
    const PA = PL * (200 / 640);
    const yPlaca = alturaDoToldo(0) + PA / 2 + 0.02;
    const forma = new THREE.Shape();
    forma.moveTo(-PL / 2 - 0.04, -PA / 2 - 0.03);
    forma.lineTo(PL / 2 + 0.04, -PA / 2 - 0.03);
    forma.lineTo(PL / 2 + 0.04, PA / 2 - 0.02);
    forma.quadraticCurveTo(0, PA / 2 + 0.16, -PL / 2 - 0.04, PA / 2 - 0.02);
    forma.closePath();
    const tabua = new THREE.ExtrudeGeometry(forma, { depth: 0.03, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.01, bevelSegments: 2, curveSegments: 14 });
    por(g, tabua, toon(P.carrinhoMadeiraFunda), 0, yPlaca, TF / 2 - 0.05);
    const borda = new THREE.CatmullRomCurve3([
      ...forma.getPoints(14).map((p) => new THREE.Vector3(p.x * 0.94, p.y * 0.9, 0)),
    ], true);
    por(g, new THREE.TubeGeometry(borda, 60, 0.008, 4, true), toon(P.carrinhoFriso), 0, yPlaca, TF / 2 - 0.005);
    const placa = por(g, new THREE.PlaneGeometry(PL * 0.9, PA * 0.95), toon(0xffffff, { mapa: letreiro() }), 0, yPlaca - 0.005, TF / 2 - 0.006);
    placa.name = 'letreiro-das-pocoes';
    // os dois pés da placa, presos na vareta
    for (const x of [-PL / 2 + 0.1, PL / 2 - 0.1]) {
      por(g, haste(new THREE.Vector3(x, alturaDoToldo(x), TF / 2 - 0.03), new THREE.Vector3(x, yPlaca - PA / 2, TF / 2 - 0.03), 0.01), toon(P.carrinhoFerro));
    }
  }

  // ------------------------------------------- a escadinha e as poções nela
  private montarPrateleira(): void {
    const g = this.group;
    const madeira = toon(P.carrinhoMadeiraFunda);
    const friso = toon(P.carrinhoFriso);
    const largura = 0.98;
    const cx = -0.17;
    const DEGRAUS = [
      { z: -0.05, fundo: 0.14, alto: 0.07 },
      { z: -0.19, fundo: 0.14, alto: 0.17 },
      { z: -0.33, fundo: 0.14, alto: 0.27 },
    ];
    for (const d of DEGRAUS) {
      por(g, quina(largura, d.alto, d.fundo, 0.008), madeira, cx, BALCAO + d.alto / 2, d.z);
      // o filete laranja na beira de cada degrau
      por(g, quina(largura + 0.01, 0.014, 0.014, 0.004), friso, cx, BALCAO + d.alto - 0.006, d.z + d.fundo / 2 + 0.002);
    }
    // as laterais recortadas em escada, mais claras
    for (const lado of [-1, 1]) {
      const s = new THREE.Shape();
      s.moveTo(0.03, 0);
      s.lineTo(-0.4, 0);
      s.lineTo(-0.4, 0.31);
      s.lineTo(-0.27, 0.31);
      s.lineTo(-0.26, 0.21);
      s.lineTo(-0.13, 0.21);
      s.lineTo(-0.12, 0.11);
      s.lineTo(0.03, 0.11);
      s.closePath();
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false });
      const lat = por(g, geo, toon(P.carrinhoRoda), cx + lado * (largura / 2 + 0.012) - 0.01, BALCAO, 0);
      lat.rotation.y = -Math.PI / 2;
    }

    // as garrafas: o vidro de todas numa malha, a bebida acesa de todas noutra
    const vidro = new Juntar();
    const bebida = new Juntar(['position', 'normal', 'color']);
    const rolha = new Juntar();
    const tampinha = new Juntar();
    const etiqueta = new Juntar();
    const rnd = sorteio(9090);
    let cor = 0;
    DEGRAUS.forEach((d, k) => {
      const n = 7;
      for (let i = 0; i < n; i++) {
        const feitio = (i + k * 2) % 4;
        const x = cx - largura / 2 + 0.075 + (i * (largura - 0.15)) / (n - 1) + (rnd() - 0.5) * 0.012;
        const z = d.z + (rnd() - 0.5) * 0.02;
        const y = BALCAO + d.alto;
        const esc = 0.9 + rnd() * 0.3;
        const tom = CORES_DAS_POCOES[cor++ % CORES_DAS_POCOES.length];
        this.porGarrafa({ vidro, bebida, rolha, tampinha, etiqueta }, feitio, tom, x, y, z, esc, 0.45 + rnd() * 0.45, rnd() < 0.3);
      }
    });
    // e três na frente do balcão, as "da casa", maiores
    const daCasa: ReadonlyArray<readonly [number, number, number, number, number]> = [
      [-0.36, 0.3, 0, P.pocaoRosa, 1.35],
      [0.05, 0.085, 3, P.pocaoLaranja, 1.2],
      [0.36, 0.33, 1, P.pocaoVerde, 1.35],
    ];
    for (const [x, z, f, tom, esc] of daCasa) {
      this.porGarrafa({ vidro, bebida, rolha, tampinha, etiqueta }, f, tom, x, BALCAO, z, esc, 0.8, f === 0);
    }
    const vidros = vidro.malha(toon(P.vidroDeEnsaio, { opacity: 0.36 }), 'vidro-das-pocoes');
    const bebidas = bebida.malha(acesoPorVertice(), 'bebida-das-pocoes');
    if (bebidas) g.add(bebidas);
    if (vidros) {
      vidros.renderOrder = 1;
      g.add(vidros);
    }
    for (const [j, mat] of [[rolha, toon(P.cortica)], [tampinha, toon(P.pocaoRosa, { glow: 0.2 })], [etiqueta, toon(P.etiquetaDePocao)]] as const) {
      const m = j.malha(mat, '');
      if (m) {
        m.name = '';
        g.add(m);
      }
    }
  }

  private porGarrafa(
    j: { vidro: Juntar; bebida: Juntar; rolha: Juntar; tampinha: Juntar; etiqueta: Juntar },
    feitio: number, tom: number, x: number, y: number, z: number, esc: number, cheio: number, comTampinha: boolean,
  ): void {
    j.vidro.por(geoVidro(feitio), x, y, z, 0, esc);
    j.bebida.por(pintarVertices(geoBebida(feitio, cheio), tom, 0.6, PESCOCO[feitio].y * cheio), x, y, z, 0, esc);
    const topo = FEITIOS[feitio][FEITIOS[feitio].length - 1][1];
    const boca = PESCOCO[feitio].boca;
    if (comTampinha) {
      // a tampa de vidro redonda, das poções de amor
      j.tampinha.por(new THREE.SphereGeometry(boca * 1.7, 10, 8), x, y + (topo + boca * 1.2) * esc, z, 0, esc);
    } else {
      j.rolha.por(new THREE.CylinderGeometry(boca * 1.15, boca * 0.95, 0.024, 8), x, y + (topo + 0.006) * esc, z, 0, esc);
    }
    // a etiqueta colada na barriga, virada para a frente
    const yE = PESCOCO[feitio].y * 0.42;
    const rE = raioNa(FEITIOS[feitio], yE) + 0.002;
    const papel = new THREE.PlaneGeometry(Math.min(0.05, rE * 1.25), 0.026).translate(0, yE, rE);
    j.etiqueta.por(papel, x, y, z, 0, esc);
    this.pontosDeBrilho.push({ p: new THREE.Vector3(x, y + PESCOCO[feitio].y * 0.4 * esc, z + 0.02), cor: tom, tam: 0.2 * esc });
  }

  // ----------------------------- os tubos de ensaio, o livro e o pilão
  private montarMiudezas(): void {
    const g = this.group;
    const madeira = toon(P.carrinhoRoda);
    // o suporte de tubos: a base, a régua furada em cima e os dois pés
    const sx = -0.6;
    const sz = 0.25;
    por(g, quina(0.32, 0.02, 0.08, 0.005), madeira, sx, BALCAO + 0.01, sz);
    por(g, quina(0.32, 0.018, 0.08, 0.005), madeira, sx, BALCAO + 0.1, sz);
    for (const lado of [-1, 1]) por(g, quina(0.02, 0.1, 0.07, 0.004), madeira, sx + lado * 0.15, BALCAO + 0.055, sz);
    const vidro = new Juntar();
    const bebida = new Juntar(['position', 'normal', 'color']);
    const rolha = new Juntar();
    for (let i = 0; i < 5; i++) {
      const x = sx - 0.11 + i * 0.055;
      const tom = CORES_DAS_POCOES[(i + 2) % CORES_DAS_POCOES.length];
      const tubo = new THREE.LatheGeometry([[0, 0], [0.01, 0.002], [0.0145, 0.012], [0.015, 0.03], [0.015, 0.15]].map(([r, y]) => new THREE.Vector2(r, y)), 10);
      vidro.por(tubo, x, BALCAO + 0.02, sz);
      const cheio = 0.07 + (i % 3) * 0.025;
      const liq = new THREE.LatheGeometry([[0, 0.003], [0.008, 0.004], [0.012, 0.013], [0.0125, cheio], [0, cheio]].map(([r, y]) => new THREE.Vector2(r, y)), 10);
      bebida.por(pintarVertices(liq, tom, 0.6, cheio), x, BALCAO + 0.02, sz);
      rolha.por(new THREE.CylinderGeometry(0.016, 0.013, 0.022, 8), x, BALCAO + 0.18, sz);
      this.pontosDeBrilho.push({ p: new THREE.Vector3(x, BALCAO + 0.07, sz + 0.02), cor: tom, tam: 0.13 });
    }
    const vidros = vidro.malha(toon(P.vidroDeEnsaio, { opacity: 0.36 }), 'vidro-dos-tubos');
    const bebidas = bebida.malha(acesoPorVertice(), 'bebida-dos-tubos');
    const rolhas = rolha.malha(toon(P.cortica), '');
    if (bebidas) g.add(bebidas);
    if (vidros) {
      vidros.renderOrder = 1;
      g.add(vidros);
    }
    if (rolhas) {
      rolhas.name = '';
      g.add(rolhas);
    }

    // o livro de receitas aberto, virado para quem chega
    const livro = new THREE.Group();
    livro.position.set(-0.08, BALCAO, 0.27);
    livro.rotation.y = 0.12;
    por(livro, quina(0.34, 0.012, 0.24, 0.004), toon(P.carrinhoMadeiraFunda), 0, 0.006, 0);
    for (const lado of [-1, 1] as const) {
      // cada metade sobe um tico para fora (o vinco da lombada fica embaixo)
      const folhas = por(livro, quina(0.155, 0.022, 0.215, 0.006), toon(P.papelDoRecado), lado * 0.08, 0.022, 0);
      folhas.rotation.z = lado * 0.08;
      por(folhas, new THREE.PlaneGeometry(0.15, 0.205).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: paginaDeReceita(lado < 0 ? 'esq' : 'dir') }), 0, 0.0113, 0);
    }
    // a fitinha de marcar página
    por(livro, quina(0.012, 0.003, 0.09, 0.001), toon(P.pocaoRosa), 0, 0.012, 0.15);
    g.add(livro);

    // o pilão de pedra com a mão de pilão e as folhinhas amassadas
    const pedra = toon(P.pedraDoPortao);
    const pilao = new THREE.LatheGeometry([[0, 0], [0.05, 0], [0.058, 0.02], [0.062, 0.06], [0.055, 0.075], [0.048, 0.072], [0.045, 0.04], [0, 0.03]].map(([r, y]) => new THREE.Vector2(r, y)), 14);
    por(g, pilao, pedra, 0.2, BALCAO, 0.27);
    por(g, haste(new THREE.Vector3(0.2, BALCAO + 0.04, 0.27), new THREE.Vector3(0.26, BALCAO + 0.15, 0.24), 0.013, 8), pedra);
    por(g, new THREE.SphereGeometry(0.018, 8, 6), pedra, 0.26, BALCAO + 0.15, 0.24);
    por(g, new THREE.CircleGeometry(0.04, 10).rotateX(-Math.PI / 2), toon(P.folhaDeAbobora), 0.2, BALCAO + 0.05, 0.27);
  }

  // ------------------------------------------------------------- o alambique
  private montarAlambique(): { chama: THREE.Mesh; gota: THREE.Mesh } {
    const g = this.group;
    const ferro = toon(P.carrinhoFerro);
    const b = this.balao;
    // o tripé: o anel em cima e as três pernas abertas
    // (o anel na altura em que o balão tem o raio dele: o vidro senta no ferro)
    const yAnel = b.y - 0.066;
    por(g, new THREE.TorusGeometry(0.055, 0.006, 5, 20).rotateX(Math.PI / 2), ferro, b.x, yAnel, b.z);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.4;
      por(g, haste(new THREE.Vector3(b.x + Math.cos(a) * 0.055, yAnel, b.z + Math.sin(a) * 0.055),
        new THREE.Vector3(b.x + Math.cos(a) * 0.095, BALCAO, b.z + Math.sin(a) * 0.095), 0.005, 4), ferro);
    }
    // a lamparina embaixo: o potinho de vidro, o pavio e a chama azul
    const lx = b.x;
    const lz = b.z;
    por(g, new THREE.LatheGeometry([[0, 0], [0.032, 0.002], [0.036, 0.02], [0.03, 0.045], [0.01, 0.052], [0.01, 0.06]].map(([r, y]) => new THREE.Vector2(r, y)), 12),
      toon(P.vidroDeEnsaio, { opacity: 0.5 }), lx, BALCAO, lz);
    por(g, new THREE.CylinderGeometry(0.03, 0.033, 0.018, 12), toon(P.pocaoAzul, { glow: 0.3 }), lx, BALCAO + 0.01, lz);
    por(g, new THREE.CylinderGeometry(0.004, 0.004, 0.02, 4), toon(P.carrinhoFerro), lx, BALCAO + 0.068, lz);
    const chama = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 8).translate(0, 0.025, 0), toon(P.chamaMeio, { glow: 1 }));
    chama.name = 'chama-da-lamparina';
    chama.position.set(lx, BALCAO + 0.076, lz);
    g.add(chama);
    // o balão de fundo redondo com o gargalo inclinado para a frente
    const vidro = toon(P.vidroDeEnsaio, { opacity: 0.34 });
    const balao = new THREE.Mesh(new THREE.SphereGeometry(b.r, 18, 14), vidro);
    balao.position.set(b.x, b.y, b.z);
    balao.name = 'balao-do-alambique';
    balao.renderOrder = 1;
    g.add(balao);
    // a bebida verde: a calota de baixo da esfera, acesa
    const calota = new THREE.SphereGeometry(b.r * 0.9, 18, 10, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58);
    const liquido = pintarVertices(calota, P.pocaoVerde, 0.55, b.r * 1.4);
    por(g, liquido, acesoPorVertice(), b.x, b.y, b.z);
    // a tampa da bebida (o nível)
    const rNivel = Math.sqrt((b.r * 0.9) ** 2 - (b.r * 0.9 * Math.cos(Math.PI * 0.42)) ** 2);
    por(g, pintarVertices(new THREE.CircleGeometry(rNivel, 18).rotateX(-Math.PI / 2), P.pocaoVerde, 1, 1), acesoPorVertice(), b.x, b.y + b.r * 0.9 * Math.cos(Math.PI * 0.42), b.z);
    // o gargalo aberto (por onde sai o vapor) e o braço de vidro saindo dele
    const yBoca = b.y + b.r + 0.075;
    const gargalo = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.019, yBoca - b.y - b.r * 0.85, 12, 1, true), vidro);
    gargalo.position.set(b.x, (yBoca + b.y + b.r * 0.85) / 2, b.z);
    gargalo.name = 'gargalo-do-alambique';
    gargalo.renderOrder = 1;
    g.add(gargalo);
    por(g, new THREE.TorusGeometry(0.019, 0.004, 5, 14).rotateX(Math.PI / 2), vidro, b.x, yBoca, b.z).renderOrder = 1;
    // a serpentina: do braço, uma volta e meia, descendo até a boca do erlenmeyer
    const braco = new THREE.Vector3(b.x + 0.012, yBoca - 0.03, b.z + 0.012);
    const pontos = [braco, new THREE.Vector3(b.x + 0.04, yBoca - 0.02, b.z + 0.05)];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const a = t * Math.PI * 3;
      pontos.push(new THREE.Vector3(b.x + 0.04 + Math.cos(a) * 0.035, yBoca - 0.03 - t * 0.1, b.z + 0.1 + t * 0.12 + Math.sin(a) * 0.035));
    }
    pontos.push(this.bico.clone().add(new THREE.Vector3(0, 0.01, -0.02)), this.bico.clone());
    const tubo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), 80, 0.008, 6, false), vidro);
    tubo.name = 'serpentina';
    tubo.renderOrder = 1;
    g.add(tubo);
    // o erlenmeyer que recebe, com a poção roxa
    const fx = this.bico.x;
    const fz = this.bico.z;
    const frasco = new THREE.Mesh(geoVidro(2).scale(1.3, 1.0, 1.3), toon(P.vidroDeEnsaio, { opacity: 0.36 }));
    frasco.position.set(fx, BALCAO, fz);
    frasco.name = 'frasco-do-alambique';
    frasco.renderOrder = 1;
    g.add(frasco);
    por(g, pintarVertices(geoBebida(2, 0.55).scale(1.3, 1, 1.3), P.pocaoRoxa, 0.6, 0.05), acesoPorVertice(), fx, BALCAO, fz);
    this.pontosDeBrilho.push({ p: new THREE.Vector3(fx, BALCAO + 0.04, fz + 0.03), cor: P.pocaoRoxa, tam: 0.24 });
    this.pontosDeBrilho.push({ p: new THREE.Vector3(b.x, b.y - 0.02, b.z + 0.04), cor: P.pocaoVerde, tam: 0.42 });
    this.pontosDeBrilho.push({ p: new THREE.Vector3(lx, BALCAO + 0.1, lz + 0.03), cor: P.chamaMeio, tam: 0.16 });
    // a gotinha roxa caindo da ponta da serpentina
    const gota = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6).scale(1, 1.4, 1), toon(P.pocaoRoxa, { glow: 0.6 }));
    gota.name = 'gota-do-alambique';
    g.add(gota);
    return { chama, gota };
  }

  /** o relógio do carrinho: as bolhas, o vapor, a chama, a gota e o brilho das poções */
  update(dt: number): void {
    this.tempo += dt;
    const t = this.tempo;
    const b = this.balao;
    const fundo = b.y - b.r * 0.82;
    const nivel = b.y + b.r * 0.9 * Math.cos(Math.PI * 0.42);
    this.listaDeBolhas.forEach((bo, i) => {
      const f = (bo.fase + t * bo.vel * 0.6) % 1;
      const y = fundo + f * (nivel - fundo);
      const r = bo.r * (0.6 + f * 0.6);
      this.bolhas.setMatrixAt(i, this.m.compose(this.v.set(b.x + bo.x + Math.sin(t * 3 + i) * 0.004, y, b.z + bo.z), this.q, this.s.setScalar(r)));
    });
    this.bolhas.instanceMatrix.needsUpdate = true;
    // o vapor: sai do gargalo, sobe, abre e apaga (a força é a cor, porque a soma é aditiva)
    const boca = new THREE.Vector3(b.x, b.y + b.r + 0.085, b.z);
    for (let i = 0; i < 6; i++) {
      const f = (i / 6 + t * 0.22) % 1;
      this.v.set(boca.x + Math.sin(t * 0.9 + i * 2.1) * 0.05 * f, boca.y + f * 0.45, boca.z + f * 0.05);
      this.vapor.setMatrixAt(i, this.m.compose(this.v, this.q, this.s.setScalar(0.08 + f * 0.22)));
      const forca = Math.sin(f * Math.PI) * 0.55;
      this.vapor.setColorAt(i, this.c.setHex(P.pocaoVerde).multiplyScalar(forca));
    }
    this.vapor.instanceMatrix.needsUpdate = true;
    if (this.vapor.instanceColor) this.vapor.instanceColor.needsUpdate = true;
    // a chama azul tremendo
    const tremor = 1 + Math.sin(t * 17) * 0.12 + Math.sin(t * 29) * 0.08;
    this.chama.scale.set(1 / Math.sqrt(tremor), tremor, 1 / Math.sqrt(tremor));
    // a gota: cresce na ponta, cai, some dentro do frasco
    const ciclo = (t * 0.7) % 1;
    if (ciclo < 0.6) {
      const cresce = ciclo / 0.6;
      this.gota.position.set(this.bico.x, this.bico.y - 0.012 - cresce * 0.006, this.bico.z);
      this.gota.scale.setScalar(0.5 + cresce * 0.6);
    } else {
      const cai = (ciclo - 0.6) / 0.4;
      this.gota.position.set(this.bico.x, this.bico.y - 0.018 - cai * cai * (this.bico.y - this.bocaDoFrasco + 0.02), this.bico.z);
      this.gota.scale.setScalar(1.1);
    }
    this.gota.visible = this.gota.position.y > this.bocaDoFrasco - 0.03;
    // as poções respirando de leve, cada uma no seu tempo
    this.coresDosBrilhos.forEach((cor, i) => {
      this.brilhos.setColorAt(i, this.c.copy(cor).multiplyScalar(0.8 + 0.2 * Math.sin(t * 1.6 + i * 1.3)));
    });
    if (this.brilhos.instanceColor) this.brilhos.instanceColor.needsUpdate = true;
  }
}

// ========================================================= a lousa de cavalete

/**
 * A LOUSA DE CAVALETE do carrinho: as duas tábuas em A, a moldura de
 * madeira, o giz ("POÇÕES!", "feitas na hora", o balãozinho e as estrelas) e
 * a correntinha entre as pernas. Olhando para `+Z`, base em `y = 0`.
 */
export function cavaleteDePocoes(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cavalete-de-pocoes';
  const L = 0.5;
  const A = 0.68;
  const abre = 0.2;
  const lousa = canvasComLetra(256, 348, (c) => {
    c.fillStyle = css(P.placaDeLousa);
    c.fillRect(0, 0, 256, 348);
    const rnd = sorteio(515);
    for (let i = 0; i < 900; i++) {
      c.fillStyle = `rgba(240,244,236,${0.03 + rnd() * 0.06})`;
      c.fillRect(Math.floor(rnd() * 256), Math.floor(rnd() * 348), 2, 2);
    }
    c.textAlign = 'center';
    c.textBaseline = 'alphabetic';
    c.fillStyle = css(P.giz);
    c.font = `700 54px ${FONTE_FORMA}`;
    c.fillText('POÇÕES!', 128, 70);
    c.strokeStyle = css(P.giz);
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(40, 86);
    c.quadraticCurveTo(128, 100, 216, 84);
    c.stroke();
    desenharFrasco(c, 128, 182, 40, css(P.pocaoVerde), css(P.giz));
    c.fillStyle = css(P.giz);
    c.font = `700 34px ${FONTE_REDONDA}`;
    c.fillText('feitas na hora', 128, 272);
    c.fillStyle = css(P.carrinhoFriso);
    c.font = `700 30px ${FONTE_REDONDA}`;
    c.fillText('pelo Prof. Noel', 128, 314);
    for (const [x, y] of [[40, 150], [214, 136], [206, 222]] as const) {
      c.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        const r = k % 2 ? 5 : 12;
        c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      }
      c.fill();
    }
  });
  const madeira = toon(P.carrinhoRoda);
  for (const lado of [1, -1] as const) {
    const t = new THREE.Group();
    t.position.set(0, 0, lado * abre);
    t.rotation.x = -lado * Math.atan2(abre, A + 0.12);
    // a tábua com a moldura grossa e as duas pernas que passam dela
    por(t, quina(L, A, 0.02, 0.005), toon(P.placaDeLousa), 0, A / 2 + 0.12, 0);
    for (const s of [-1, 1]) {
      por(t, quina(0.04, A + 0.12, 0.035, 0.008), madeira, s * (L / 2 + 0.005), (A + 0.12) / 2, 0);
      por(t, quina(L, 0.035, 0.03, 0.008), madeira, 0, s > 0 ? A + 0.12 - 0.017 : 0.12 + 0.017, 0);
    }
    const face = por(t, new THREE.PlaneGeometry(L - 0.03, A - 0.06), toon(0xffffff, { mapa: lousa }), 0, A / 2 + 0.12, lado * 0.0115);
    face.rotation.y = lado > 0 ? 0 : Math.PI;
    g.add(t);
  }
  // a dobradiça em cima e a correntinha entre as pernas
  por(g, new THREE.CylinderGeometry(0.012, 0.012, L + 0.06, 8).rotateZ(Math.PI / 2), toon(P.carrinhoFerro), 0, A + 0.115, 0);
  por(g, new THREE.CylinderGeometry(0.004, 0.004, abre * 1.3, 4).rotateX(Math.PI / 2), toon(P.carrinhoFerro), L / 2 + 0.01, 0.4, 0);
  return g;
}

// ===================================================== o caldeirão borbulhando

/**
 * A POÇÃO BORBULHANDO dentro do caldeirão da praça na noite da festa: o
 * disco da bebida verde acesa (o miolo mais claro que a beira), as bolhas
 * que estufam e estouram na superfície, o vapor verde subindo (halos em
 * lote, a força na cor) e a luz verde no chão em volta. A origem é o centro
 * da superfície; quem põe no caldeirão é a cena.
 */
export class PocaoBorbulhando {
  readonly group = new THREE.Group();
  private readonly bolhas: THREE.InstancedMesh;
  private readonly vapor: THREE.InstancedMesh;
  private readonly fases: Array<{ x: number; z: number; f: number; v: number; r: number }> = [];
  private tempo = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly c = new THREE.Color();

  constructor(private readonly raio = 0.31, private readonly cor: number = P.pocaoVerde, alturaDoChao = 0.55) {
    this.group.name = 'pocao-borbulhando';
    // o disco: o miolo claro e a beira escura (a fundura), aceso
    const disco = new THREE.CircleGeometry(raio, 28, 0, Math.PI * 2).rotateX(-Math.PI / 2);
    const pos = disco.getAttribute('position');
    const cores = new Float32Array(pos.count * 3);
    const base = new THREE.Color(cor);
    for (let i = 0; i < pos.count; i++) {
      const d = Math.hypot(pos.getX(i), pos.getZ(i)) / raio;
      const k = 1.05 - d * 0.5;
      cores.set([Math.min(1, base.r * k), Math.min(1, base.g * k), Math.min(1, base.b * k)], i * 3);
    }
    disco.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    const sup = new THREE.Mesh(disco, acesoPorVertice());
    sup.name = 'superficie-da-pocao';
    this.group.add(sup);
    // as bolhas: meias esferas que estufam e estouram
    this.bolhas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(cor, { glow: 0.55 }), 9);
    this.bolhas.name = 'bolhas-da-pocao';
    const rnd = sorteio(808);
    for (let i = 0; i < 9; i++) {
      const a = rnd() * Math.PI * 2;
      const d = Math.sqrt(rnd()) * raio * 0.75;
      this.fases.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, f: rnd(), v: 0.5 + rnd() * 0.6, r: raio * (0.08 + rnd() * 0.08) });
    }
    // o vapor e o halo em cima (a última cópia é o halo, parado)
    this.vapor = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(0xffffff, 0.55), 8);
    this.vapor.name = 'vapor-da-pocao';
    this.vapor.renderOrder = 4;
    for (const im of [this.bolhas, this.vapor]) {
      im.frustumCulled = false;
      im.userData.semSombra = true;
      this.group.add(im);
    }
    // a luz verde no chão, em volta do caldeirão
    const chao = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), luzNoChao(cor, 0.45));
    chao.name = 'luz-da-pocao';
    chao.scale.setScalar(4.6);
    chao.position.y = -alturaDoChao + 0.012;
    chao.renderOrder = 2;
    chao.userData.semSombra = true;
    this.group.add(chao);
    this.update(0);
  }

  update(dt: number): void {
    this.tempo += dt;
    const t = this.tempo;
    this.fases.forEach((b, i) => {
      const f = (b.f + t * b.v) % 1;
      // estufa devagar e estoura de uma vez
      const r = f < 0.85 ? b.r * (f / 0.85) : b.r * (1 - (f - 0.85) / 0.15) * 1.2;
      this.bolhas.setMatrixAt(i, this.m.compose(this.p.set(b.x, -0.004, b.z), this.q, this.s.set(r, r * 0.8, r)));
    });
    this.bolhas.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < 7; i++) {
      const f = (i / 7 + t * 0.16) % 1;
      const a = i * 2.4;
      this.p.set(Math.cos(a) * this.raio * 0.4 + Math.sin(t * 0.7 + i) * 0.1 * f, 0.08 + f * 1.3, Math.sin(a) * this.raio * 0.4);
      this.vapor.setMatrixAt(i, this.m.compose(this.p, this.q, this.s.setScalar(0.25 + f * 0.75)));
      this.vapor.setColorAt(i, this.c.setHex(this.cor).multiplyScalar(Math.sin(f * Math.PI) * 0.5));
    }
    // o halo verde parado em cima da boca, respirando
    this.vapor.setMatrixAt(7, this.m.compose(this.p.set(0, 0.12, 0), this.q, this.s.setScalar(this.raio * 5.2)));
    this.vapor.setColorAt(7, this.c.setHex(this.cor).multiplyScalar(0.55 + 0.1 * Math.sin(t * 2.3)));
    this.vapor.instanceMatrix.needsUpdate = true;
    if (this.vapor.instanceColor) this.vapor.instanceColor.needsUpdate = true;
  }
}
