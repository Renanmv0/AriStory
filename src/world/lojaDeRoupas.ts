import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon, flat } from '../core/materials';
import { letreiro } from './props';
import { pocaDeLuz } from './furniture';
import { PALETTE as P } from '../palette';
import { uvDeParede, uvEmMetros, uvEmMetrosPorTriangulo } from './acabamento';
import { contorno, cavetinho, type Perfil } from './molduras';
import { reboco, rebocoComFrisos, tijolinho } from './texturasDeFachada';
import { assoalhoDeMadeira, pisoDePlacas, sorteio } from './texturasDeChao';
import { desenhoDeTapete, veioDeMadeira } from './texturasDeCasa';

/**
 * ============================== A LOJINHA DE ROUPAS DO VILLA LOBOS
 *
 * O "mini shopping" do parque: um predio de dois pavimentos, com duas vitrines
 * de manequim, porta de vidro no meio, toldo listrado e letreiro. E a maior
 * peca do kit depois da roda gigante, e por isso mora em arquivo proprio.
 *
 * ELA E UM PREDIO, E NAO UM QUIOSQUE, e isso muda tres coisas:
 *
 * 1. TEM SEGUNDO PAVIMENTO. Quiosque e um balcao com telhado; o que faz uma
 *    peca ler como "loja de rua" e ter andar de cima com janela, platibanda e
 *    caixa d'agua. Sem isso qualquer caixa vira barraca;
 * 2. A FACHADA E FEITA DE VAOS, e nao de paredes com desenho. As vitrines, a
 *    porta e as janelas de arco sao FUROS de verdade numa parede com
 *    espessura (`ExtrudeGeometry` com `holes`), e o caixilho e o vidro moram
 *    dentro do vao. E o que faz a luz do toon desenhar a profundidade sozinha;
 * 3. TEM MIOLO. Pela vitrine e pela porta se ve o estrado, o manequim, o piso
 *    e o fundo; pela janela de cima, a cortina presa de lado. Nada de vao
 *    mostrando o gramado do outro lado do predio.
 *
 * O ACABAMENTO (a segunda versao, feita com as skills de three):
 *
 *  - PAREDE COM TEXTURA, e nao cor chapada: o terreo tem reboco com FRISOS
 *    deitados, o andar de cima e a platibanda tem reboco liso, e o rodape e
 *    de TIJOLINHO — tudo desenhado em canvas (`texturasDeFachada.ts`), com o
 *    UV em metros e o `v` sempre na altura (`uvDeParede`), para o friso do
 *    montante continuar na linha do friso da parede ao lado;
 *  - MOLDURA COM PERFIL (`molduras.ts`): rodape, faixa entre os andares,
 *    cornija com cavetinho e o capeamento da platibanda dao a volta no
 *    predio em meia-esquadria, sem uma face encostada na outra;
 *  - CUNHAIS nas quatro quinas, as pedras alternando comprido e curto;
 *  - JANELA EM ARCO no andar de cima, com moldura, pedra-chave, peitoril com
 *    misula, bandeira em leque, cortina presa de lado e floreira com flor;
 *    nas laterais do terreo e nos fundos, janela de VENEZIANA fechada;
 *  - TOLDO DE LONA de verdade: gomos listrados que embarrigam entre as
 *    varetas, a aba recortada em meia-lua e os bracos de ferro;
 *  - a porta com BANDEIRA EM LEQUE, alizar e pedra-chave, puxador de barra,
 *    degrau com capacho e dois lampioes;
 *  - o LETREIRO com moldura e as lampadas em volta, a PLACA DE BANDEIRA com
 *    o vestidinho no cabide, a ROSEIRA subindo a trelica da lateral, vaso
 *    torneado com topiaria na porta, calha e condutor nos fundos, e o
 *    telhado com piso, caixa d'agua torneada, condensadores com grade,
 *    claraboia e antena.
 *
 * E LEVE: o que se repete (flor, folha, lampada, palheta de veneziana) e
 * `InstancedMesh`, o vidro do predio inteiro e uma malha so, e a cena passa
 * a peca por `fundir()` — o resto vira uma malha por material.
 *
 * A CONTA DA CAMERA: ~8,3 de altura escondem `8,3 / tan(34°) ≈ 12,3` de chao
 * atras dela. A cena tem que plantar isso num canto onde nao haja nada nessa
 * faixa — no Villa Lobos ela fica na ponta oeste, de costas para o rio, e a
 * faixa cega dela cai fora do mundo caminhavel.
 *
 * ELA E CONSTRUIDA OLHANDO PARA `+Z`, como toda peca do kit, e a cena gira. No
 * Villa Lobos ela leva `rotY = PI/2` para ficar paralela ao rio: quem decide se
 * uma fachada aparece e o produto escalar com a diagonal da camera, e ele da
 * 0,707 tanto para `+Z` quanto para `+X`.
 *
 * O TAMANHO POR FORA NAO MUDOU (11 × 8, a fachada no mesmo plano), e e de
 * proposito: o colisor da cena, a porta, o posto da Estella e a conta do toldo
 * continuam valendo. Tudo que fica no chao na frente da fachada (degrau,
 * vasos) para na linha dos vasos de antes.
 *
 * O TOLDO AVANCA POUCO (1,05) DE PROPOSITO. E a mesma armadilha do toldo do
 * quiosque: quem for ficar na calcada, na frente da vitrine — a ovelha que
 * cuida da loja —, precisa estar FORA da sombra dele. Com o toldo a 3,47 e a
 * ovelha com uns 1,2, ele engole 1,5 × 2,3 ≈ 3,4 atras da propria borda; a
 * borda esta a 1,05 da parede, e a Estella esta bem mais longe que isso.
 */
export interface LojaOpts {
  /** o nome no letreiro — o Renan batizou: "Boutique da Estella" */
  nome?: string;
  corToldo?: number;
}

/** caixa de quina quebrada: o chanfro pega um filete de luz do toon */
function quina(l: number, a: number, p: number, r = 0.02): THREE.BufferGeometry {
  return new RoundedBoxGeometry(l, a, p, 1, Math.min(r, l / 2 - 0.001, a / 2 - 0.001, p / 2 - 0.001));
}

/**
 * UM LOTE DE COPIAS: tudo que se repete na fachada (flor, folha, lampada,
 * palheta de veneziana) vira um `InstancedMesh` so, com cor por copia. A
 * matriz de cada copia e lida no quadro da parede onde ela mora e levada para
 * o quadro da peca.
 */
class Lote {
  private readonly matrizes: THREE.Matrix4[] = [];
  private readonly cores: THREE.Color[] = [];
  constructor(private readonly geo: THREE.BufferGeometry, private readonly mat: THREE.Material) {}

  por(quadro: THREE.Object3D | null, p: THREE.Vector3, q: THREE.Quaternion, s: THREE.Vector3 | number, cor = 0xffffff): void {
    const escala = typeof s === 'number' ? new THREE.Vector3(s, s, s) : s;
    const local = new THREE.Matrix4().compose(p, q, escala);
    this.matrizes.push(quadro ? new THREE.Matrix4().multiplyMatrices(quadro.matrix, local) : local);
    this.cores.push(new THREE.Color(cor));
  }

  montar(pai: THREE.Object3D): void {
    if (!this.matrizes.length) return;
    const im = new THREE.InstancedMesh(this.geo, this.mat, this.matrizes.length);
    this.matrizes.forEach((m, i) => {
      im.setMatrixAt(i, m);
      im.setColorAt(i, this.cores[i]);
    });
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    pai.add(im);
  }
}

/**
 * A FLOR: um disco de cinco petalas em leque, com centro e borda virada para
 * cima — a concha e o que faz a luz do toon separar uma petala da outra.
 * Raio 1, olhando para `+Y`; o lote escala e pinta.
 */
function geoFlor(): THREE.BufferGeometry {
  // quatro pontos por petala: a flor tem uns 6 px na tela, e mais que isso some
  const N = 20;
  const borda = (i: number): [number, number, number] => {
    const a = (i / N) * Math.PI * 2;
    const r = 0.55 + 0.45 * Math.abs(Math.cos(2.5 * a));
    return [Math.cos(a) * r, 0.3 * r * r, Math.sin(a) * r];
  };
  const pos: number[] = [];
  for (let i = 0; i < N; i++) pos.push(0, 0, 0, ...borda(i + 1), ...borda(i));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * A FOLHA: lanca de comprimento 1 ao longo de `+Z`, dobrada em V na nervura
 * e arqueada — dobrada, ela pega luz de um lado e sombra do outro, e deixa de
 * ser um adesivo verde.
 */
function geoFolha(): THREE.BufferGeometry {
  const passos = 4;
  const meio: THREE.Vector3[] = [];
  const esq: THREE.Vector3[] = [];
  const dir: THREE.Vector3[] = [];
  for (let k = 0; k <= passos; k++) {
    const t = k / passos;
    const w = Math.pow(Math.sin(Math.PI * t), 0.75) * 0.22;
    const y = 0.07 * Math.sin(Math.PI * t);
    meio.push(new THREE.Vector3(0, y, t));
    esq.push(new THREE.Vector3(-w, y - w * 0.45, t));
    dir.push(new THREE.Vector3(w, y - w * 0.45, t));
  }
  const pos: number[] = [];
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): void => {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };
  for (let k = 0; k < passos; k++) {
    tri(meio[k], esq[k + 1], esq[k]);
    tri(meio[k], meio[k + 1], esq[k + 1]);
    tri(meio[k], dir[k], dir[k + 1]);
    tri(meio[k], dir[k + 1], meio[k + 1]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * A CORTINA presa de lado: um pano com pregas (a onda em `z`) que estreita na
 * altura da abracadeira e abre de novo embaixo. As pregas sao as mesmas em
 * cima e na cintura — apertadas, elas ficam mais fundas, como pano franzido.
 * `lado` = +1 cresce para `+x` a partir da borda (a cortina da esquerda).
 */
function geoCortina(largura: number, altura: number, lado: 1 | -1): THREE.BufferGeometry {
  const NU = 10;
  const NV = 8;
  const CINTURA = 0.38;
  const fracao = (v: number): number => (v > CINTURA
    ? THREE.MathUtils.lerp(0.3, 1, Math.pow((v - CINTURA) / (1 - CINTURA), 1.3))
    : THREE.MathUtils.lerp(0.5, 0.3, v / CINTURA));
  const pos: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= NV; j++) {
    const v = j / NV;
    const w = fracao(v);
    for (let i = 0; i <= NU; i++) {
      const u = i / NU;
      const funda = 0.018 + 0.03 * (1 - w);
      pos.push(lado * u * w * largura, v * altura, Math.sin(u * Math.PI * 5) * funda);
    }
  }
  for (let j = 0; j < NV; j++) {
    for (let i = 0; i < NU; i++) {
      const a = j * (NU + 1) + i;
      const b = a + 1;
      const c = a + NU + 1;
      const d = c + 1;
      if (lado > 0) idx.push(a, b, d, a, d, c);
      else idx.push(a, d, b, a, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo.toNonIndexed();
}

/** um anel ou um U de forma: a moldura em volta de um arco (`rx`, `ry`) com a base em `y0` */
function moldeEmArco(
  cx: number, y0: number, ys: number,
  rxDentro: number, ryDentro: number, rxFora: number, ryFora: number,
): THREE.Shape {
  // com `y0 = ys` (a bandeira da porta) as pernas somem: nada de segmento de
  // comprimento zero, que deixa ponto repetido para a triangulacao
  const pernas = ys - y0 > 1e-6;
  const s = new THREE.Shape();
  s.moveTo(cx - rxFora, y0);
  if (pernas) s.lineTo(cx - rxFora, ys);
  s.absellipse(cx, ys, rxFora, ryFora, Math.PI, 0, true, 0);
  if (pernas) s.lineTo(cx + rxFora, y0);
  s.lineTo(cx + rxDentro, y0);
  if (pernas) s.lineTo(cx + rxDentro, ys);
  s.absellipse(cx, ys, rxDentro, ryDentro, 0, Math.PI, false, 0);
  if (pernas) s.lineTo(cx - rxDentro, y0);
  s.closePath();
  return s;
}

/** o contorno de um vao em arco (ou de um arco abatido, com `ry` menor) */
function arco<T extends THREE.Path>(alvo: T, cx: number, y0: number, ys: number, rx: number, ry: number): T {
  alvo.moveTo(cx - rx, y0);
  alvo.lineTo(cx + rx, y0);
  alvo.lineTo(cx + rx, ys);
  alvo.absellipse(cx, ys, rx, ry, 0, Math.PI, false, 0);
  alvo.lineTo(cx - rx, y0);
  return alvo;
}

function retangulo<T extends THREE.Path>(alvo: T, x0: number, y0: number, x1: number, y1: number): T {
  alvo.moveTo(x0, y0);
  alvo.lineTo(x1, y0);
  alvo.lineTo(x1, y1);
  alvo.lineTo(x0, y1);
  alvo.lineTo(x0, y0);
  return alvo;
}

/** um U reto: a moldura de reboco em volta de uma janela, aberta embaixo (o peitoril fecha) */
function moldeReto(cx: number, y0: number, topo: number, meia: number, aba: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(cx - meia - aba, y0);
  s.lineTo(cx - meia - aba, topo + aba);
  s.lineTo(cx + meia + aba, topo + aba);
  s.lineTo(cx + meia + aba, y0);
  s.lineTo(cx + meia, y0);
  s.lineTo(cx + meia, topo);
  s.lineTo(cx - meia, topo);
  s.lineTo(cx - meia, y0);
  s.closePath();
  return s;
}

function extrudar(forma: THREE.Shape, prof: number, z0: number, curvas = 14): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(forma, { depth: prof, bevelEnabled: false, curveSegments: curvas });
  geo.translate(0, 0, z0);
  return geo;
}

/**
 * O LETREIRO: o nome com as letras espacadas (desenhadas uma a uma — o
 * `letterSpacing` do canvas nao existe em todo navegador) e, de cada lado, um
 * fio com um losango cor-de-rosa, como etiqueta de roupa costurada.
 */
function letreiroDaLoja(texto: string, largura: number, altura: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.max(64, Math.round((1024 * altura) / largura));
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const W = canvas.width;
    const H = canvas.height;
    const fonte = (px: number): string => `bold ${px}px ui-rounded, "Nunito", system-ui, sans-serif`;
    let tamanho = Math.round(H * 0.8);
    /*
     * NOME CURTO E NOME COMPRIDO. O letreiro nasceu para "MODAS" (5 letras),
     * com as letras bem abertas e um enfeite comprido de cada lado. O nome de
     * verdade tem 19 ("BOUTIQUE DA ESTELLA"): com o mesmo espaçamento e os
     * mesmos enfeites, a letra encolhia até ficar ilegível do parque. Nome
     * longo aperta o espaço entre letras, ganha mais da largura da placa, e o
     * enfeite fica do tamanho que sobrar.
     */
    const longo = texto.length > 8;
    const espaco = (px: number): number => px * (longo ? 0.16 : 0.32);
    const ocupa = longo ? 0.76 : 0.62;
    const medir = (px: number): number => {
      ctx.font = fonte(px);
      return [...texto].reduce((soma, c) => soma + ctx.measureText(c).width, 0) + espaco(px) * (texto.length - 1);
    };
    while (tamanho > 10 && medir(tamanho) > W * ocupa) tamanho -= 2;
    const total = medir(tamanho);
    ctx.font = fonte(tamanho);
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fdfaf6';
    let x = (W - total) / 2;
    for (const c of texto) {
      ctx.fillText(c, x, H / 2 + tamanho * 0.06);
      x += ctx.measureText(c).width + espaco(tamanho);
    }
    // o fio e o losango, de cada lado
    const rosa = `#${P.lojaToldo.toString(16).padStart(6, '0')}`;
    for (const lado of [-1, 1]) {
      const perto = W / 2 + lado * (total / 2 + W * (longo ? 0.02 : 0.035));
      const longe = W / 2 + lado * Math.min(total / 2 + W * 0.15, W * 0.485);
      ctx.strokeStyle = '#fdfaf6';
      ctx.lineWidth = Math.max(3, H * 0.035);
      ctx.setLineDash([H * 0.09, H * 0.06]);
      ctx.beginPath();
      ctx.moveTo(perto, H / 2);
      ctx.lineTo(longe, H / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      const l = (perto + longe) / 2;
      const r = H * 0.13;
      ctx.fillStyle = rosa;
      ctx.beginPath();
      ctx.moveTo(l, H / 2 - r);
      ctx.lineTo(l + r * 0.8, H / 2);
      ctx.lineTo(l, H / 2 + r);
      ctx.lineTo(l - r * 0.8, H / 2);
      ctx.closePath();
      ctx.fill();
    }
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(largura, altura),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
}

/**
 * O DESENHO DA PLACA DE BANDEIRA: um vestidinho num cabide, na cor do
 * letreiro, dentro de um aro cor-de-rosa. Uma placa so, dos dois lados (dois
 * planos numa malha) — quem passa na calcada le de qualquer um.
 */
function desenhoDaBandeira(raio: number, afastamento: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const hex = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
  if (ctx) {
    const c = 128;
    ctx.strokeStyle = hex(P.lojaToldo);
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(c, c, 112, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = hex(P.lojaLetreiro);
    ctx.strokeStyle = hex(P.lojaLetreiro);
    // o cabide: o gancho e o triangulo
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(c, 58, 13, Math.PI * 1.05, Math.PI * 2.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(c, 70);
    ctx.lineTo(c - 62, 104);
    ctx.lineTo(c + 62, 104);
    ctx.closePath();
    ctx.stroke();
    // o vestido: corpinho, cintura marcada e a saia rodada
    ctx.beginPath();
    ctx.moveTo(c - 26, 98);
    ctx.lineTo(c + 26, 98);
    ctx.lineTo(c + 20, 140);
    ctx.quadraticCurveTo(c + 62, 196, c + 58, 214);
    ctx.lineTo(c - 58, 214);
    ctx.quadraticCurveTo(c - 62, 196, c - 20, 140);
    ctx.closePath();
    ctx.fill();
    // o laco da cintura, no rosa da loja
    ctx.fillStyle = hex(P.lojaToldo);
    ctx.fillRect(c - 22, 134, 44, 10);
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const frente = new THREE.PlaneGeometry(raio * 2, raio * 2);
  const costas = new THREE.PlaneGeometry(raio * 2, raio * 2).rotateY(Math.PI);
  frente.translate(0, 0, afastamento);
  costas.translate(0, 0, -afastamento);
  return new THREE.Mesh(
    mergeGeometries([frente, costas]),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
}

export function lojaDeRoupas(opts: LojaOpts = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'loja-de-roupas';
  const rnd = sorteio(5241);

  // ------------------------------------------------------------- materiais
  const paredeDeBaixo = toon(P.lojaParede, { mapa: rebocoComFrisos() });
  const paredeDeCima = toon(P.lojaParedeAlta, { mapa: reboco() });
  const platibanda = toon(P.lojaParede, { mapa: reboco() });
  const faixa = toon(P.lojaFaixa);
  const esquadria = toon(P.lojaEsquadria);
  const tijolo = toon(P.lojaEsquadria, { mapa: tijolinho() });
  const pedra = toon(P.concrete);
  const ferro = toon(P.lojaLetreiro);
  const metal = toon(P.lojaMetal);
  const persiana = toon(P.lojaToldo);
  const lona = toon(opts.corToldo ?? P.lojaToldo, { doubleSide: true });
  const lonaClara = toon(P.lojaEsquadria, { doubleSide: true });
  /*
   * O VIDRO E `flat()`, e nao `toon()`. Vidro nao recebe sombra: com o material
   * sombreado, a vitrine inteira caia no degrade escuro do toon e virava uma
   * mancha cinza-esverdeada — os manequins existiam e ninguem via. Chapado e
   * bem transparente (0,26), ele vira reflexo em cima do que esta atras.
   */
  const vidro = flat(P.lojaVitrine, 0.26);
  const dentro = toon(P.lojaDentro);
  const cortina = toon(P.lojaCortinaProvador, { doubleSide: true });
  const madeira = toon(P.woodDark, { mapa: veioDeMadeira() });
  const terra = toon(P.terraDeVaso);
  const vaso = toon(P.plantPot);
  const luz = toon(P.luzDoPortao, { glow: 0.6 });

  // os lotes de copias
  const branco = toon(0xffffff, { doubleSide: true });
  const flores = new Lote(geoFlor(), branco);
  // o miolo da flor tem 2 px: um octaedro le como bolinha
  const miolos = new Lote(new THREE.OctahedronGeometry(1, 0), toon(0xffffff));
  const folhas = new Lote(geoFolha(), branco);
  const lampadas = new Lote(new THREE.SphereGeometry(1, 8, 5), luz);
  const palhetas = new Lote(new THREE.BoxGeometry(1, 1, 1), persiana);
  /** o vidro do predio inteiro, juntado numa malha so no fim */
  const vidros: THREE.BufferGeometry[] = [];

  // ------------------------------------------------------------- as medidas
  const LARG = 11;
  const FUNDO = 8;
  const ESP = 0.24;          // espessura de parede
  const BASE = 0.2;          // o plinto
  const HX = LARG / 2;
  const HZ = FUNDO / 2;
  // a frente e o fundo cabem ENTRE as laterais, que vao de ponta a ponta
  const MEIO = HX - ESP;
  const Y_TERREO = 3.71;     // a emenda entre os andares, atras da faixa
  const Y_CORNIJA = 6.5;     // a emenda entre o andar de cima e a platibanda
  const Y_TOPO = 7.24;       // o alto da platibanda
  const Y_LAJE = 6.9;        // o piso do telhado
  // a fachada do terreo
  const PORTA = 1.15;        // meia largura da porta
  const PY = BASE + 2.6;     // alto da porta (a bandeira vai acima)
  const LEQUE = 0.55;        // a altura da bandeira em leque
  const VIT0 = 1.55;         // onde a vitrine comeca, a partir do centro
  const VIT1 = 4.76;
  const VY0 = 0.75;
  const VY1 = 2.95;
  // o andar de cima
  const RJ = 0.55;           // meia largura (e raio do arco) da janela
  const PEITORIL = 4.5;
  const NASCENCA = 5.55;     // onde o arco comeca

  // ------------------------------------------------------- quadros e pecas
  /*
   * CADA PAREDE E UM QUADRO: um grupo sem nome com a face de fora em `z = 0`
   * e o `+z` para a rua. Uma janela e montada uma vez so, no quadro, e serve
   * para a frente, as laterais e os fundos. Grupo sem nome nao e fronteira
   * para a `fundir()`: o que esta dentro dele se junta com o resto da peca.
   */
  const quadro = (x: number, z: number, giro: number): THREE.Group => {
    const q = new THREE.Group();
    q.position.set(x, 0, z);
    q.rotation.y = giro;
    q.updateMatrix();
    g.add(q);
    return q;
  };
  const FRENTE = quadro(0, HZ, 0);
  const DIREITA = quadro(HX, 0, Math.PI / 2);
  const FUNDOS = quadro(0, -HZ, Math.PI);
  const ESQUERDA = quadro(-HX, 0, -Math.PI / 2);

  const peca = (pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material,
    x = 0, y = 0, z = 0): THREE.Mesh => {
    let geometria = geo;
    if ((mat as THREE.MeshToonMaterial).map) {
      if (mat === madeira) {
        if (geo.type === 'BoxGeometry') uvEmMetros(geo);
        else geometria = uvEmMetrosPorTriangulo(geo);
      } else {
        geometria = uvDeParede(geo, x, y, z);
      }
    }
    const m = new THREE.Mesh(geometria, mat);
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  };
  const caixa = (pai: THREE.Object3D, l: number, a: number, p: number, mat: THREE.Material,
    x: number, y: number, z: number): THREE.Mesh => peca(pai, new THREE.BoxGeometry(l, a, p), mat, x, y, z);
  const chanfro = (pai: THREE.Object3D, l: number, a: number, p: number, mat: THREE.Material,
    x: number, y: number, z: number, r = 0.02): THREE.Mesh => peca(pai, quina(l, a, p, r), mat, x, y, z);
  /** o vidro e guardado ja no quadro da peca, para virar uma malha so no fim */
  const guardarVidro = (q: THREE.Object3D, geo: THREE.BufferGeometry, x: number, y: number, z: number): void => {
    const m = new THREE.Matrix4().makeTranslation(x, y, z).premultiply(q.matrix);
    const v = (geo.index ? geo.toNonIndexed() : geo).applyMatrix4(m);
    v.deleteAttribute('uv');
    vidros.push(v);
  };
  const giro = (x: number, y: number, z: number): THREE.Quaternion =>
    new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
  const v3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
  const ROSAS = [P.flowerPink, P.lojaToldo, P.flowerYellow, P.lojaEsquadria];
  const VERDES = [P.leafMid, P.leafLight, P.leafDark];

  /** uma folha apontando para `dir`, com um giro sorteado em volta dela */
  const folha = (q: THREE.Object3D | null, p: THREE.Vector3, dir: THREE.Vector3, tam: number): void => {
    const orienta = new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), dir.clone().normalize());
    const torce = new THREE.Quaternion().setFromAxisAngle(v3(0, 0, 1), (rnd() - 0.5) * 1.6);
    folhas.por(q, p, orienta.multiply(torce), tam, VERDES[Math.floor(rnd() * VERDES.length)]);
  };
  /** uma flor olhando para `normal` (de lado na trelica, para cima na floreira) */
  const flor = (q: THREE.Object3D | null, p: THREE.Vector3, normal: THREE.Vector3, tam: number, cor: number): void => {
    const orienta = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), normal.clone().normalize());
    const roda = new THREE.Quaternion().setFromAxisAngle(v3(0, 1, 0), rnd() * Math.PI * 2);
    flores.por(q, p, orienta.multiply(roda), tam, cor);
    miolos.por(q, p.clone().addScaledVector(normal.clone().normalize(), tam * 0.12), new THREE.Quaternion(), tam * 0.26,
      cor === P.flowerYellow ? P.woodDark : P.flowerYellow);
  };

  // ==================================================================== CHAO
  /*
   * O PLINTO: perfil de pedra com a quina chanfrada, 20 cm para fora da
   * parede. Ele e a base de tudo e nao para nem na porta — ali o degrau passa
   * por cima dele.
   */
  peca(g, contorno([[0.2, 0], [0.2, 0.12], [0.12, 0.2], [0, 0.2]], HX, HZ), pedra);

  /*
   * O RODAPE DE TIJOLINHO: 4 cm para fora da parede, com a aresta de cima
   * chanfrada. Ele ABRE nas duas portas (a da loja e a de servico, nos
   * fundos) e fecha a ponta com o proprio perfil — a ponta fica escondida
   * atras do alizar.
   */
  const PORTA_DE_SERVICO = { x: 2.6, meia: 0.5 };
  peca(g, contorno([[0, 0.2], [0.04, 0.2], [0.04, 0.66], [0, 0.7]], HX, HZ, [
    { lado: 'frente', de: -PORTA - 0.09, ate: PORTA + 0.09 },
    // nos fundos o quadro esta virado: o `x` dele e o `-x` da peca
    { lado: 'fundo', de: -PORTA_DE_SERVICO.x - PORTA_DE_SERVICO.meia - 0.09, ate: -PORTA_DE_SERVICO.x + PORTA_DE_SERVICO.meia + 0.09 },
  ]), tijolo);

  // ==================================================================== PAREDES
  /*
   * AS PAREDES SAO FORMAS COM FURO, extrudadas na espessura: o vao da
   * vitrine, da porta e da janela de arco ganham o "batente" de reboco por
   * dentro de graca, e nao ha emenda de caixa nenhuma na fachada. O terreo e
   * o andar de cima sao panos separados (o friso so embaixo), e a emenda
   * entre eles mora atras da faixa.
   */
  const pano = (q: THREE.Object3D, forma: THREE.Shape, mat: THREE.Material): void => {
    peca(q, extrudar(forma, ESP, -ESP), mat);
  };

  // --- o terreo da frente: a porta com a bandeira em leque e as duas vitrines
  const terreoDaFrente = new THREE.Shape();
  terreoDaFrente.moveTo(-MEIO, BASE);
  terreoDaFrente.lineTo(-PORTA, BASE);
  terreoDaFrente.lineTo(-PORTA, PY);
  terreoDaFrente.absellipse(0, PY, PORTA, LEQUE, Math.PI, 0, true, 0);
  terreoDaFrente.lineTo(PORTA, BASE);
  terreoDaFrente.lineTo(MEIO, BASE);
  terreoDaFrente.lineTo(MEIO, Y_TERREO);
  terreoDaFrente.lineTo(-MEIO, Y_TERREO);
  terreoDaFrente.closePath();
  for (const lado of [-1, 1] as const) {
    const [a, b] = lado < 0 ? [-VIT1, -VIT0] : [VIT0, VIT1];
    terreoDaFrente.holes.push(retangulo(new THREE.Path(), a, VY0, b, VY1));
  }
  pano(FRENTE, terreoDaFrente, paredeDeBaixo);
  // o terreo das laterais e dos fundos: liso, as venezianas vao por fora
  pano(FUNDOS, retangulo(new THREE.Shape(), -MEIO, BASE, MEIO, Y_TERREO), paredeDeBaixo);
  for (const q of [DIREITA, ESQUERDA]) pano(q, retangulo(new THREE.Shape(), -HZ, BASE - 0.03, HZ, Y_TERREO), paredeDeBaixo);

  // --- o andar de cima: arcos na frente e nas laterais, venezianas nos fundos
  const XS_DA_FRENTE = [-3.9, -1.3, 1.3, 3.9];
  const XS_DO_LADO = [-1.8, 1.8];
  const andarDeCima = (q: THREE.Group, x0: number, x1: number, arcos: readonly number[]): void => {
    const forma = retangulo(new THREE.Shape(), x0, Y_TERREO, x1, Y_CORNIJA);
    for (const cx of arcos) forma.holes.push(arco(new THREE.Path(), cx, PEITORIL, NASCENCA, RJ, RJ));
    pano(q, forma, paredeDeCima);
  };
  andarDeCima(FRENTE, -MEIO, MEIO, XS_DA_FRENTE);
  andarDeCima(FUNDOS, -MEIO, MEIO, []);
  andarDeCima(DIREITA, -HZ, HZ, XS_DO_LADO);
  andarDeCima(ESQUERDA, -HZ, HZ, XS_DO_LADO);

  // --- a platibanda: um anel so, da cornija ao capeamento
  const anel = retangulo(new THREE.Shape(), -HX, -HZ, HX, HZ);
  anel.holes.push(retangulo(new THREE.Path(), -MEIO, -(HZ - ESP), MEIO, HZ - ESP));
  const platibandaGeo = new THREE.ExtrudeGeometry(anel, { depth: Y_TOPO - Y_CORNIJA, bevelEnabled: false });
  platibandaGeo.rotateX(-Math.PI / 2);
  platibandaGeo.translate(0, Y_CORNIJA, 0);
  peca(g, platibandaGeo, platibanda);

  // ==================================================================== MOLDURAS
  // a faixa entre os andares: pingadeiro embaixo, chapa reta e a rampinha de cima
  const PERFIL_DA_FAIXA: Perfil = [
    [0, 3.58], [0.1, 3.62], [0.1, 3.92], [0.13, 3.95], [0.13, 4.0], [0.03, 4.08], [0, 4.08],
  ];
  peca(g, contorno(PERFIL_DA_FAIXA, HX, HZ), faixa);
  // a cornija: filete, cavetinho e a pingadeira larga em cima
  const PERFIL_DA_CORNIJA: Perfil = [
    [0, 6.38], [0.03, 6.4], [0.03, 6.45], [0.05, 6.46],
    ...cavetinho([0.05, 6.46], [0.17, 6.56], 5),
    [0.2, 6.57], [0.2, 6.62], [0, 6.62],
  ];
  peca(g, contorno(PERFIL_DA_CORNIJA, HX, HZ), faixa);
  // o capeamento: passa 5 cm para fora dos dois lados da platibanda e desce por dentro
  peca(g, contorno([
    [0.05, 7.18], [0.05, 7.28], [0.02, 7.32], [-ESP - 0.02, 7.32], [-ESP - 0.05, 7.28], [-ESP - 0.05, 7.18],
  ], HX, HZ), faixa);

  /*
   * OS CUNHAIS: as pedras de quina, alternando comprida e curta em cada fiada
   * — e o que amarra a quina do predio e tira a cara de caixa. Elas saem 3 cm
   * das duas faces, comecam acima do tijolinho e param antes da faixa e da
   * cornija.
   */
  const cunhais = (y0: number, y1: number): void => {
    const fiadas = Math.max(1, Math.round((y1 - y0) / 0.36));
    const passo = (y1 - y0) / fiadas;
    for (let i = 0; i < fiadas; i++) {
      const [naFrente, noLado] = i % 2 ? [0.5, 0.3] : [0.3, 0.5];
      const y = y0 + passo * (i + 0.5);
      for (const sx of [-1, 1] as const) {
        for (const sz of [-1, 1] as const) {
          chanfro(g, naFrente, passo - 0.045, noLado, faixa,
            sx * (HX + 0.03 - naFrente / 2), y, sz * (HZ + 0.03 - noLado / 2), 0.025);
        }
      }
    }
  };
  cunhais(0.72, 3.58);
  cunhais(4.1, 6.38);

  // ==================================================================== JANELAS
  /**
   * A JANELA EM ARCO do andar de cima. O furo ja esta na parede; aqui entra o
   * que mora nele e em volta dele, sempre no quadro da parede:
   *
   *  - o CAIXILHO, um anel embutido 1 cm no reboco (casado com o furo, as
   *    faces de dentro do anel e do furo brigariam), com o vidro no meio;
   *  - a bandeira EM LEQUE: a travessa na nascenca do arco e dois raios;
   *  - a CORTINA presa de lado, a varinha, e o fundo fechado logo atras da
   *    parede — e o que impede o vao de mostrar o vazio do andar de cima;
   *  - por fora, a MOLDURA de reboco em U, a PEDRA-CHAVE, o PEITORIL com duas
   *    misulas e a FLOREIRA em cima dele.
   */
  const janelaEmArco = (q: THREE.Group, cx: number): void => {
    const y0 = PEITORIL;
    const ys = NASCENCA;
    const r = RJ;
    // caixilho
    const caixilho = arco(new THREE.Shape(), cx, y0 - 0.01, ys, r + 0.01, r + 0.01);
    caixilho.holes.push(arco(new THREE.Path(), cx, y0 + 0.07, ys, r - 0.07, r - 0.07));
    peca(q, extrudar(caixilho, 0.06, -0.1), esquadria);
    guardarVidro(q, new THREE.ShapeGeometry(arco(new THREE.Shape(), cx, y0 + 0.06, ys, r - 0.06, r - 0.06), 14), 0, 0, -0.07);
    // a cruzeta e o leque: cada barra num `z` proprio, para nao dividirem plano
    caixa(q, 0.045, ys + r - y0 - 0.12, 0.035, esquadria, cx, (y0 + ys + r) / 2, -0.06);
    caixa(q, 2 * r - 0.12, 0.045, 0.03, esquadria, cx, ys, -0.07);
    for (const ang of [Math.PI / 4, (3 * Math.PI) / 4]) {
      const raio = caixa(q, 0.035, r - 0.06, 0.03, esquadria,
        cx + Math.cos(ang) * (r - 0.06) / 2, ys + Math.sin(ang) * (r - 0.06) / 2, -0.075);
      raio.rotation.z = ang - Math.PI / 2;
    }
    // o fundo, a cortina e a varinha
    caixa(q, 2 * r + 0.16, ys + r - y0 + 0.16, 0.02, dentro, cx, (y0 + ys + r) / 2, -ESP - 0.012);
    for (const lado of [-1, 1] as const) {
      const panoDaCortina = new THREE.Mesh(geoCortina(r - 0.02, ys - y0 - 0.05, lado === -1 ? 1 : -1), cortina);
      panoDaCortina.position.set(cx + lado * (r - 0.015), y0 + 0.02, -0.17);
      q.add(panoDaCortina);
    }
    const varinha = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 2 * r - 0.02, 8).rotateZ(Math.PI / 2), ferro);
    varinha.position.set(cx, ys - 0.01, -0.13);
    q.add(varinha);
    // por fora: moldura, pedra-chave, peitoril e misulas
    peca(q, extrudar(moldeEmArco(cx, y0, ys, r, r, r + 0.13, r + 0.13), 0.035, 0), faixa);
    const chave = new THREE.Shape();
    chave.moveTo(cx - 0.075, ys + r - 0.02);
    chave.lineTo(cx + 0.075, ys + r - 0.02);
    chave.lineTo(cx + 0.12, ys + r + 0.17);
    chave.lineTo(cx - 0.12, ys + r + 0.17);
    chave.closePath();
    peca(q, extrudar(chave, 0.07, 0), esquadria);
    chanfro(q, 2 * r + 0.42, 0.07, 0.26, esquadria, cx, y0 - 0.025, 0.07);
    for (const lado of [-1, 1] as const) misula(q, cx + lado * (r + 0.1), y0 - 0.06);
    floreira(q, cx, y0 + 0.01, 2 * r + 0.14);
  };

  /** a misula: o suporte curvo embaixo do peitoril, de perfil */
  const misula = (q: THREE.Group, x: number, topo: number): void => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.16, 0);
    s.lineTo(0.16, -0.05);
    s.quadraticCurveTo(0.05, -0.08, 0.03, -0.24);
    s.lineTo(0, -0.24);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: false, curveSegments: 6 });
    geo.rotateY(-Math.PI / 2);
    geo.translate(0.035, 0, 0);
    peca(q, geo, faixa, x, topo, 0);
  };

  /**
   * A FLOREIRA em cima do peitoril: caixote de madeira com veio, um monte de
   * terra e as flores (cinco petalas, viradas para cima) no meio das folhas,
   * com umas folhas caindo pela frente.
   */
  const floreira = (q: THREE.Group, cx: number, base: number, largura: number): void => {
    chanfro(q, largura, 0.2, 0.17, madeira, cx, base + 0.1, 0.105, 0.015);
    chanfro(q, largura - 0.06, 0.04, 0.12, terra, cx, base + 0.205, 0.105, 0.015);
    const n = Math.round(largura / 0.2);
    // a folhagem: um leque de folhas saindo da terra, para cima e para fora
    const yTerra = base + 0.225;
    for (let i = 0; i < n * 3; i++) {
      const x = cx - largura / 2 + 0.07 + rnd() * (largura - 0.14);
      folha(q, v3(x, yTerra, 0.05 + rnd() * 0.11), v3((rnd() - 0.5) * 1.3, 1, (rnd() - 0.15) * 0.9), 0.15 + rnd() * 0.06);
    }
    for (let i = 0; i < n; i++) {
      const x = cx - largura / 2 + 0.1 + (i + rnd() * 0.4) * ((largura - 0.2) / n);
      const y = base + 0.3 + rnd() * 0.07;
      const z = 0.07 + rnd() * 0.07;
      flor(q, v3(x, y, z), v3((rnd() - 0.5) * 0.4, 1, 0.35), 0.055 + rnd() * 0.02, ROSAS[Math.floor(rnd() * ROSAS.length)]);
    }
    /*
     * E TRES RAMINHOS CAINDO PELA FRENTE, folha atras de folha. Folha solta
     * colada na frente do caixote lia como adesivo verde; em fileira, saindo
     * da borda e descendo, ela le como planta que cresceu demais.
     */
    for (let k = 0; k < 3; k++) {
      const x = cx - largura / 2 + (largura * (k + 0.3 + rnd() * 0.4)) / 3;
      for (let i = 0; i < 3; i++) {
        folha(q, v3(x + (rnd() - 0.5) * 0.04, yTerra - 0.01 - i * 0.075, 0.2 + i * 0.012),
          v3((rnd() - 0.5) * 0.5, -1, 0.45), 0.12 + rnd() * 0.03);
      }
    }
  };

  /**
   * A JANELA DE VENEZIANA, fechada: moldura de reboco, peitoril, a cornijinha
   * em cima, e as duas folhas com as palhetas inclinadas (um lote so para o
   * predio inteiro) em dois quadros, com a travessa no meio. Ela nao fura a
   * parede — fechada, nao ha o que ver atras dela.
   */
  const janelaFechada = (q: THREE.Group, cx: number, y0: number, largura: number, altura: number): void => {
    const meia = largura / 2;
    peca(q, extrudar(moldeReto(cx, y0, y0 + altura, meia, 0.1), 0.03, 0), faixa);
    chanfro(q, largura + 0.36, 0.07, 0.18, esquadria, cx, y0 - 0.025, 0.07);
    chanfro(q, largura + 0.34, 0.08, 0.12, esquadria, cx, y0 + altura + 0.14, 0.04);
    for (const lado of [-1, 1] as const) {
      const lf = meia - 0.004;
      const fx = cx + lado * (lf / 2 + 0.002);
      // o fundo da folha, atras das palhetas
      caixa(q, lf - 0.08, altura - 0.1, 0.01, faixa, fx, y0 + altura / 2, 0.012);
      // montantes por fora, travessas entre eles
      for (const s of [-1, 1] as const) caixa(q, 0.06, altura, 0.045, persiana, fx + s * (lf / 2 - 0.03), y0 + altura / 2, 0.0275);
      for (const yy of [y0 + 0.04, y0 + altura / 2, y0 + altura - 0.04]) {
        caixa(q, lf - 0.12, yy === y0 + altura / 2 ? 0.06 : 0.08, 0.04, persiana, fx, yy, 0.025);
      }
      // as palhetas
      for (const [a, b] of [[y0 + 0.1, y0 + altura / 2 - 0.05], [y0 + altura / 2 + 0.05, y0 + altura - 0.1]] as const) {
        const n = Math.floor((b - a) / 0.075);
        for (let k = 0; k <= n; k++) {
          palhetas.por(q, v3(fx, a + ((b - a) * k) / n, 0.026), giro(-0.6, 0, 0), v3(lf - 0.12, 0.012, 0.068));
        }
      }
      // as dobradicas, por fora
      for (const yy of [y0 + 0.25, y0 + altura - 0.25]) {
        caixa(q, 0.05, 0.08, 0.02, ferro, cx + lado * (meia - 0.005), yy, 0.055);
      }
    }
  };

  for (const cx of XS_DA_FRENTE) janelaEmArco(FRENTE, cx);
  for (const q of [DIREITA, ESQUERDA]) for (const cx of XS_DO_LADO) janelaEmArco(q, cx);
  for (const cx of XS_DA_FRENTE) janelaFechada(FUNDOS, cx, PEITORIL + 0.05, 2 * RJ, 1.45);
  janelaFechada(DIREITA, -1.8, 1.3, 1.0, 1.5);
  janelaFechada(DIREITA, 1.8, 1.3, 1.0, 1.5);
  janelaFechada(ESQUERDA, -1.6, 1.3, 1.0, 1.5);
  janelaFechada(FUNDOS, -2.2, 1.3, 1.0, 1.5);

  // ==================================================================== A PORTA
  /*
   * A PORTA: duas folhas de vidro com montante de esquadria e rodape alto,
   * puxador de barra, a bandeira em leque em cima (um arco abatido com cinco
   * raios), o alizar em volta e a pedra-chave. O vao e o mesmo de antes
   * (2,30 × 2,60), so que agora ele termina num arco.
   */
  {
    const q = FRENTE;
    // o marco: as ombreiras e a travessa da bandeira
    for (const s of [-1, 1] as const) caixa(q, 0.08, PY - BASE, 0.12, esquadria, s * (PORTA - 0.03), (BASE + PY) / 2, -0.1);
    // a travessa e 1 cm mais funda: com a mesma frente das ombreiras, as duas
    // faces dividiriam plano onde ela passa por cima delas
    caixa(q, 2 * PORTA + 0.02, 0.09, 0.13, esquadria, 0, PY, -0.1);
    peca(q, extrudar(moldeEmArco(0, PY, PY, PORTA - 0.07, LEQUE - 0.07, PORTA + 0.01, LEQUE + 0.01), 0.12, -0.16), esquadria);
    const leque = new THREE.Shape();
    leque.moveTo(-(PORTA - 0.06), PY);
    leque.absellipse(0, PY, PORTA - 0.06, LEQUE - 0.06, Math.PI, 0, true, 0);
    leque.closePath();
    guardarVidro(q, new THREE.ShapeGeometry(leque, 16), 0, 0, -0.1);
    for (let k = 1; k <= 5; k++) {
      const ang = (k * Math.PI) / 6;
      const px = Math.cos(ang) * (PORTA - 0.07);
      const py = Math.sin(ang) * (LEQUE - 0.07);
      const comp = Math.hypot(px, py);
      const raio = caixa(q, 0.03, comp, 0.03, esquadria, px / 2, PY + py / 2, -0.095);
      raio.rotation.z = Math.atan2(py, px) - Math.PI / 2;
    }
    const cubo = new THREE.Shape();
    cubo.moveTo(-0.16, PY);
    cubo.absarc(0, PY, 0.16, Math.PI, 0, true);
    cubo.closePath();
    // o cubo fica meio centimetro na frente dos raios: com a mesma frente do
    // raio do meio, os dois dividiriam o plano onde ele passa por cima
    peca(q, extrudar(cubo, 0.05, -0.125), esquadria);

    // as folhas: montantes por fora, travessas (a de baixo e o rodape) entre eles
    const altura = PY - 0.045 - (BASE + 0.04);
    const yMeio = BASE + 0.04 + altura / 2;
    for (const s of [-1, 1] as const) {
      const lf = PORTA - 0.07 - 0.004;
      const fx = s * (lf / 2 + 0.002);
      for (const m of [-1, 1] as const) caixa(q, 0.09, altura, 0.05, esquadria, fx + m * (lf / 2 - 0.045), yMeio, -0.1);
      caixa(q, lf - 0.18, 0.09, 0.045, esquadria, fx, PY - 0.045 - 0.045, -0.1);
      caixa(q, lf - 0.18, 0.26, 0.045, esquadria, fx, BASE + 0.04 + 0.13, -0.1);
      const vy0 = BASE + 0.04 + 0.25;
      const vy1 = PY - 0.045 - 0.08;
      guardarVidro(q, new THREE.PlaneGeometry(lf - 0.16, vy1 - vy0), fx, (vy0 + vy1) / 2, -0.1);
      // o puxador de barra, com os dois pezinhos
      const px = s * 0.11;
      const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), metal);
      barra.position.set(px, 1.25, -0.03);
      q.add(barra);
      for (const yy of [0.95, 1.55]) {
        const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 6).rotateX(Math.PI / 2), metal);
        pe.position.set(px, yy, -0.05);
        q.add(pe);
      }
    }

    // o alizar em volta do vao inteiro (porta e bandeira) e a pedra-chave
    peca(q, extrudar(moldeEmArco(0, BASE, PY, PORTA, LEQUE, PORTA + 0.1, LEQUE + 0.1), 0.05, 0), esquadria);
    const chave = new THREE.Shape();
    chave.moveTo(-0.09, PY + LEQUE - 0.03);
    chave.lineTo(0.09, PY + LEQUE - 0.03);
    chave.lineTo(0.14, PY + LEQUE + 0.2);
    chave.lineTo(-0.14, PY + LEQUE + 0.2);
    chave.closePath();
    peca(q, extrudar(chave, 0.09, 0), faixa);

    // a soleira, o degrau e o capacho em cima dele
    caixa(q, 2 * PORTA + 0.02, 0.05, ESP + 0.04, pedra, 0, BASE + 0.015, -ESP / 2);
    chanfro(q, 2.9, 0.22, 0.56, pedra, 0, 0.11, 0.26, 0.03);
    caixa(q, 1.5, 0.02, 0.38, toon(P.roupaLaBarra, { mapa: desenhoDeTapete(1.5, 0.38, 'capacho') }), 0, 0.23, 0.28);

    // a plaquinha de ABERTO, pendurada num cordao atras do vidro da porta
    const cordao = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 6), metal);
    cordao.position.set(0.55, PY - 0.3, -0.16);
    q.add(cordao);
    const plaquinha = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.3, 0.04), esquadria);
    plaquinha.position.set(0.55, PY - 0.62, -0.16);
    q.add(plaquinha);
    const escrito = letreiro('ABERTO', 0.54, 0.2, '#d4788c');
    escrito.position.set(0.55, PY - 0.62, -0.135);
    q.add(escrito);

    // os dois lampioes, no montante entre a porta e a vitrine
    for (const s of [-1, 1] as const) {
      const x = s * 1.35;
      chanfro(q, 0.1, 0.24, 0.03, ferro, x, 2.32, 0.015, 0.01);
      const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 6).rotateX(Math.PI / 2), ferro);
      braco.position.set(x, 2.25, 0.12);
      q.add(braco);
      const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.05, 6), ferro);
      pe.position.set(x, 2.27, 0.2);
      q.add(pe);
      const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.058, 0.22, 6), luz);
      corpo.position.set(x, 2.405, 0.2);
      q.add(corpo);
      const chapeu = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.1, 6), ferro);
      chapeu.position.set(x, 2.565, 0.2);
      q.add(chapeu);
      const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), ferro);
      ponta.position.set(x, 2.63, 0.2);
      q.add(ponta);
    }
  }

  // ==================================================================== VITRINES
  /*
   * AS VITRINES: o caixilho dentro do vao, com o montante no meio e a
   * bandeira de tres vidros no alto; por fora o alizar em U e o peitoril
   * largo. Dentro, o mesmo de antes — o fundo, o estrado e o manequim —, mais a
   * luz PINTADA: uma poca no estrado e o leque no fundo, somados ao que esta
   * embaixo (luz de verdade recompilaria o shader da cena inteira).
   */
  const zF = -0.12; // o meio da parede, no quadro da frente (era o `zF` de antes)
  for (const lado of [-1, 1] as const) {
    const q = FRENTE;
    const larg = VIT1 - VIT0;
    const cx = lado * (VIT0 + larg / 2);
    const caixilho = retangulo(new THREE.Shape(), cx - larg / 2 - 0.01, VY0 - 0.01, cx + larg / 2 + 0.01, VY1 + 0.01);
    caixilho.holes.push(retangulo(new THREE.Path(), cx - larg / 2 + 0.07, VY0 + 0.07, cx + larg / 2 - 0.07, VY1 - 0.07));
    peca(q, extrudar(caixilho, 0.06, -0.11), esquadria);
    const yBandeira = 2.42;
    caixa(q, larg - 0.12, 0.06, 0.04, esquadria, cx, yBandeira, -0.08);
    // montante e baguetes entram 1 cm no caixilho e na travessa, dos dois lados
    const baixo = [VY0 + 0.06, yBandeira - 0.02] as const;
    const alto = [yBandeira + 0.02, VY1 - 0.06] as const;
    caixa(q, 0.06, baixo[1] - baixo[0], 0.05, esquadria, cx, (baixo[0] + baixo[1]) / 2, -0.08);
    for (const k of [-1, 1] as const) caixa(q, 0.04, alto[1] - alto[0], 0.035, esquadria, cx + (k * larg) / 6, (alto[0] + alto[1]) / 2, -0.08);
    guardarVidro(q, new THREE.PlaneGeometry(larg - 0.12, VY1 - VY0 - 0.12), cx, (VY0 + VY1) / 2, -0.08);
    peca(q, extrudar(moldeReto(cx, VY0, VY1, larg / 2, 0.1), 0.04, 0), esquadria);
    chanfro(q, larg + 0.34, 0.08, 0.26, esquadria, cx, VY0 - 0.03, 0.03);

    // dentro: o fundo, o estrado e a calha de luz
    caixa(q, larg, VY1 - VY0 + 0.2, 0.06, dentro, cx, (VY0 + VY1) / 2, zF - 1.3);
    chanfro(q, larg - 0.1, 0.1, 1.14, esquadria, cx, VY0 + 0.03, -0.83, 0.03);
    const calha = new THREE.Mesh(new THREE.BoxGeometry(larg - 0.3, 0.1, 0.9), flat(P.luzDoPortao));
    calha.position.set(cx, VY1 - 0.14, zF - 0.9);
    q.add(calha);
    const poca = pocaDeLuz(0.85, P.luzDoPortao, 0.3);
    poca.position.set(cx, VY0 + 0.085, -0.85);
    q.add(poca);
    const leque = pocaDeLuz(1.0, P.luzDoPortao, 0.22, true);
    leque.position.set(cx, 1.95, zF - 1.3 + 0.035);
    q.add(leque);
  }

  // ----------------------------------------------------------- os manequins
  /*
   * UM POR VITRINE, e cada um numa cor. Manequim nao tem cabeca nem braco: e
   * um torso num pedestal, e e justamente isso que faz ele ler como manequim
   * em vez de gente parada dentro da loja.
   */
  const manequim = (x: number, corDaRoupa: number, comSaia: boolean): void => {
    const pele = toon(P.lojaManequim);
    const roupa = toon(corDaRoupa);
    const y0 = BASE + 0.09;
    const zM = zF - 0.5; // colado no vidro: recuado, ele sumia no fundo escuro
    const q = FRENTE;

    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.06, 12), toon(P.metalGrey));
    pe.position.set(x, y0 + 0.03, zM);
    q.add(pe);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), toon(P.metalGrey));
    haste.position.set(x, y0 + 0.4, zM);
    q.add(haste);

    const quadril = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
    quadril.scale.set(0.24, 0.2, 0.18);
    quadril.position.set(x, y0 + 0.82, zM);
    q.add(quadril);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.42, 4, 12), pele);
    torso.position.set(x, y0 + 1.2, zM);
    torso.scale.z = 0.78;
    q.add(torso);
    // os ombros cortados, que e a assinatura de manequim de vitrine
    for (const lado of [-1, 1] as const) {
      const ombro = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), pele);
      ombro.position.set(x + lado * 0.24, y0 + 1.5, zM);
      q.add(ombro);
    }

    if (comSaia) {
      const saia = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.66, 14, 1, true), roupa);
      saia.position.set(x, y0 + 0.78, zM);
      q.add(saia);
      const corpete = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.3, 4, 12), roupa);
      corpete.position.set(x, y0 + 1.24, zM);
      corpete.scale.z = 0.8;
      q.add(corpete);
    } else {
      const casaco = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.5, 4, 12), roupa);
      casaco.position.set(x, y0 + 1.16, zM);
      casaco.scale.z = 0.8;
      q.add(casaco);
      const calca = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.62, 10), toon(P.roupaJeans));
      calca.position.set(x, y0 + 0.62, zM);
      q.add(calca);
    }
    // o disco do pedestal, em cima do estrado: o pe de verdade fica escondido nele
    const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.035, 16), metal);
    disco.position.set(x, VY0 + 0.098, zM);
    q.add(disco);
  };
  /*
   * AS CORES DELES SAO CHEIAS, e nao os rosas lavados do guarda-roupa: atras do
   * vidro, com a luz que sobra la dentro, um `vestidoRosa` (0xf6d3d8) ficava do
   * mesmo tom do proprio manequim e a roupa sumia. Vitrine pede cor que aguente
   * duas camadas de transparencia.
   */
  manequim(-(VIT0 + (VIT1 - VIT0) / 2), P.waRosaForte, true);
  manequim(VIT0 + (VIT1 - VIT0) / 2, P.roupaLa, false);

  /*
   * E UM POUCO DE LOJA EM VOLTA DELES: na vitrine da saia, uma pilha de
   * blusas dobradas num banquinho; na do casaco, o chapeu de palha num
   * suporte. Coisa pequena e de cor cheia, pela mesma conta dos manequins.
   */
  {
    const q = FRENTE;
    const yE = VY0 + 0.08;
    const xb = -(VIT0 + 0.55);
    const banco = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.3, 14), esquadria);
    banco.position.set(xb, yE + 0.15, zF - 0.62);
    q.add(banco);
    [P.lojaToldo, P.lojaEsquadria, P.roupaJeans, P.flowerYellow].forEach((cor, i) => {
      chanfro(q, 0.3 - i * 0.012, 0.055, 0.22, toon(cor), xb + (i % 2 ? 0.012 : -0.01), yE + 0.33 + i * 0.056, zF - 0.62, 0.02);
    });
    const xc = VIT1 - 0.5;
    const suporte = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.74, 6), metal);
    suporte.position.set(xc, yE + 0.39, zF - 0.7);
    q.add(suporte);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.03, 12), metal);
    base.position.set(xc, yE + 0.015, zF - 0.7);
    q.add(base);
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.27, 0.025, 18), toon(P.cestaPalha));
    aba.position.set(xc, yE + 0.77, zF - 0.7);
    q.add(aba);
    const copa = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.cestaPalha));
    copa.position.set(xc, yE + 0.78, zF - 0.7);
    q.add(copa);
    const fita = new THREE.Mesh(new THREE.CylinderGeometry(0.133, 0.133, 0.035, 18), toon(P.lojaToldo));
    fita.position.set(xc, yE + 0.8, zF - 0.7);
    q.add(fita);
  }

  // -------------------------------------------------------------- o miolo
  /*
   * O MIOLO: o forro do fundo e o piso. Pela porta se ve o piso de tabua da
   * loja (o mesmo de dentro, `lojaChaoTabua`) e um tapetinho na entrada.
   */
  caixa(g, 2 * MEIO - 0.08, 3.3, 0.06, dentro, 0, BASE - 0.02 + 1.65, -HZ + ESP + 0.04);
  caixa(g, 2 * MEIO - 0.04, 0.08, 2 * (HZ - ESP) - 0.04, toon(P.lojaChaoTabua, { mapa: assoalhoDeMadeira(2.4, 8) }), 0, 0.205, 0);
  caixa(g, 1.8, 0.012, 1.1, toon(P.lojaChaoTapete, { mapa: desenhoDeTapete(1.8, 1.1, 'felpudo') }), 0, 0.251, HZ - ESP - 0.75);

  // ==================================================================== TOLDOS
  /*
   * O TOLDO DE LONA: onze gomos listrados que descem da caixa de enrolar ate
   * a beira, numa curva que vai ficando mais inclinada (lona esticada em
   * braco de toldo cai assim). Cada gomo EMBARRIGA um pouco entre as varetas
   * — e essa barriga que o toon transforma na listra de luz que diz "pano".
   * Na beira, a aba recortada em meia-lua, um gomo por listra; embaixo, os
   * dois bracos de ferro.
   *
   * Ele avanca 1,05, que e o limite da conta da camera (ver o cabecalho).
   */
  const toldo = (cx: number): void => {
    const q = FRENTE;
    const L = VIT1 - VIT0 + 0.3;
    const N = 11;
    const passo = L / N;
    const Y0 = 3.47;
    const Z0 = 0.08;
    const Y1 = 3.04;
    const Z1 = 1.05;
    const SEG = 8;
    const LARGS = 3;
    const perfil = (t: number): [number, number] => [Z0 + (Z1 - Z0) * t, Y0 - (Y0 - Y1) * Math.pow(t, 1.6)];
    for (let i = 0; i < N; i++) {
      const x0 = cx - L / 2 + passo * i;
      const pos: number[] = [];
      const ponto = (u: number, t: number): number[] => {
        const [z, y] = perfil(t);
        // a barriga: zero na vareta, funda no meio do gomo, sumindo na beira
        const barriga = 0.025 * Math.sin(Math.PI * u) * Math.sin(Math.PI * Math.min(1, t * 1.15));
        return [x0 + passo * u, y - barriga, z];
      };
      for (let k = 0; k < SEG; k++) {
        for (let j = 0; j < LARGS; j++) {
          const a = ponto(j / LARGS, k / SEG);
          const b = ponto((j + 1) / LARGS, k / SEG);
          const c = ponto((j + 1) / LARGS, (k + 1) / SEG);
          const d = ponto(j / LARGS, (k + 1) / SEG);
          pos.push(...a, ...d, ...c, ...a, ...c, ...b);
        }
      }
      const gomo = new THREE.BufferGeometry();
      gomo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      gomo.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0), 2));
      gomo.computeVertexNormals();
      const cor = i % 2 === 0 ? lona : lonaClara;
      q.add(new THREE.Mesh(gomo, cor));
      // a aba: reta 12 cm e a meia-lua embaixo
      const aba = new THREE.Shape();
      aba.moveTo(x0, 0);
      aba.lineTo(x0, -0.12);
      aba.absarc(x0 + passo / 2, -0.12, passo / 2, Math.PI, Math.PI * 2, false);
      aba.lineTo(x0 + passo, 0);
      aba.closePath();
      const abaGeo = new THREE.ShapeGeometry(aba, 8);
      abaGeo.translate(0, Y1, Z1 + 0.004);
      q.add(new THREE.Mesh(abaGeo, cor));
    }
    // a caixa de enrolar, a barra da beira e os bracos
    chanfro(q, L + 0.08, 0.13, 0.14, esquadria, cx, Y0 + 0.065, 0.05, 0.03);
    const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, L + 0.04, 8).rotateZ(Math.PI / 2), ferro);
    barra.position.set(cx, Y1 + 0.005, Z1 - 0.01);
    q.add(barra);
    for (const s of [-1, 1] as const) {
      const x = cx + s * (L / 2 - 0.1);
      // o pe do braco fica na frente do alizar (que sai 4 cm da parede)
      const curva = new THREE.QuadraticBezierCurve3(v3(x, 2.68, 0.06), v3(x, 2.98, 0.55), v3(x, Y1 - 0.01, Z1 - 0.03));
      peca(q, new THREE.TubeGeometry(curva, 12, 0.017, 6, false), ferro);
      chanfro(q, 0.08, 0.12, 0.03, ferro, x, 2.68, 0.055, 0.01);
    }
  };
  toldo(-(VIT0 + (VIT1 - VIT0) / 2));
  toldo(VIT0 + (VIT1 - VIT0) / 2);

  // ==================================================================== VASOS
  /*
   * OS VASOS DA PORTA: vaso torneado (`LatheGeometry`: pe, barriga e a borda
   * virada) com uma topiaria — a bola de buxinho num cabo. A bola e uma
   * esfera amassada (o ruido sorteado pela POSICAO, a licao da pedra) coberta
   * de folhas do lote. Eles ficam na linha dos vasos de antes, que e onde o
   * colisor da loja termina.
   */
  const perfilDoVaso = [
    [0, 0], [0.17, 0], [0.2, 0.03], [0.23, 0.12], [0.255, 0.33], [0.29, 0.36], [0.3, 0.42],
    [0.27, 0.44], [0.25, 0.41], [0, 0.41],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  for (const s of [-1, 1] as const) {
    const q = FRENTE;
    const x = s * (PORTA + 0.62);
    const z = 0.4;
    peca(q, new THREE.LatheGeometry(perfilDoVaso, 18), vaso, x, 0, z);
    // a terra um dedo abaixo da borda, e acima do fundo do torneado (0,41)
    peca(q, new THREE.CylinderGeometry(0.25, 0.25, 0.03, 16), terra, x, 0.4, z);
    peca(q, new THREE.CylinderGeometry(0.025, 0.03, 0.45, 6), madeira, x, 0.62, z);
    const bola = new THREE.IcosahedronGeometry(0.27, 2);
    const p = bola.getAttribute('position');
    for (let i = 0; i < p.count; i++) {
      const vx = p.getX(i);
      const vy = p.getY(i);
      const vz = p.getZ(i);
      const k = 1 + 0.07 * Math.sin(Math.round(vx * 40) * 1.7 + Math.round(vy * 40) * 2.3 + Math.round(vz * 40) * 0.9);
      p.setXYZ(i, vx * k, vy * k, vz * k);
    }
    bola.computeVertexNormals();
    const yb = 1.05;
    peca(q, bola, toon(P.leafDark), x, yb, z);
    /*
     * AS FOLHAS DEITAM NA BOLA: cada uma nasce na casca e aponta quase de
     * lado (a normal e so um terco da direcao). Apontando para fora, elas
     * eram espinho, e a topiaria virava um ourico.
     */
    for (let i = 0; i < 90; i++) {
      const dir = v3(rnd() - 0.5, rnd() - 0.3, rnd() - 0.5).normalize();
      const p0 = v3(x, yb, z).addScaledVector(dir, 0.255);
      const lado = v3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(dir).normalize();
      folha(FRENTE, p0, lado.addScaledVector(dir, 0.35), 0.1 + rnd() * 0.03);
    }
  }

  // ==================================================================== A ROSEIRA
  /*
   * A ROSEIRA DA LATERAL: a lateral que a camera ve de cara era uma parede de
   * oito metros so de reboco. Agora tem uma floreira comprida no pe, uma
   * trelica de losango (as ripas de um sentido na frente das do outro, para
   * nao dividirem plano) e quatro galhos subindo por ela, com folha e rosa.
   * Ela mora perto da quina da frente, longe da janela de veneziana.
   */
  {
    const q = ESQUERDA; // aqui o `+x` aponta para a frente da loja
    const x0 = 1.35;
    const x1 = 3.25;
    const y0 = 0.78;
    const y1 = 3.48;
    const xc = (x0 + x1) / 2;
    chanfro(q, x1 - x0 + 0.24, 0.4, 0.26, madeira, xc, 0.2, 0.15, 0.02);
    chanfro(q, x1 - x0 + 0.16, 0.04, 0.18, terra, xc, 0.405, 0.15, 0.015);
    // a moldura da trelica e as ripas nos dois sentidos
    for (const x of [x0, x1]) caixa(q, 0.05, y1 - y0, 0.04, esquadria, x, (y0 + y1) / 2, 0.035);
    for (const y of [y0, y1]) caixa(q, x1 - x0 - 0.05, 0.05, 0.035, esquadria, (x0 + x1) / 2, y, 0.035);
    /*
     * AS RIPAS: retas a 45° nos dois sentidos, `x = x0 + c ± (y - y0)`, cada
     * uma cortada no retangulo da moldura. As de um sentido ficam 1,5 cm na
     * frente das do outro — cruzadas no mesmo plano, elas dividiriam a face.
     */
    const passo = 0.42;
    const H = y1 - y0;
    const L = x1 - x0;
    for (const [sentido, z] of [[1, 0.03], [-1, 0.045]] as const) {
      const [cMin, cMax] = sentido > 0 ? [-H, L] : [0, L + H];
      for (let c = cMin + passo / 2; c < cMax; c += passo) {
        // o trecho de altura em que a reta fica dentro da moldura
        const [ta, tb] = sentido > 0 ? [-c, L - c] : [c - L, c];
        const ya = y0 + Math.max(0, ta);
        const yb = y0 + Math.min(H, tb);
        if (yb - ya < 0.09) continue;
        const xa = x0 + c + sentido * (ya - y0);
        const xb = x0 + c + sentido * (yb - y0);
        const comp = Math.hypot(xb - xa, yb - ya);
        const ripa = caixa(q, 0.032, comp, 0.012, esquadria, (xa + xb) / 2, (ya + yb) / 2, z);
        ripa.rotation.z = Math.atan2(yb - ya, xb - xa) - Math.PI / 2;
      }
    }
    // os galhos, as folhas e as rosas
    for (let k = 0; k < 4; k++) {
      const pts: THREE.Vector3[] = [];
      let x = x0 + 0.25 + k * 0.48;
      const topo = 2.3 + rnd() * 1.1;
      for (let y = 0.42; y < topo; y += 0.32) {
        pts.push(v3(x, y, 0.07 + rnd() * 0.03));
        x = THREE.MathUtils.clamp(x + (rnd() - 0.5) * 0.5, x0 + 0.1, x1 - 0.1);
      }
      const galho = new THREE.CatmullRomCurve3(pts);
      peca(q, new THREE.TubeGeometry(galho, pts.length * 4, 0.014, 5, false), madeira);
      const n = Math.round(galho.getLength() / 0.07);
      for (let i = 2; i < n; i++) {
        const t = i / n;
        const p = galho.getPointAt(t);
        const lado = i % 2 ? 1 : -1;
        folha(q, p.clone().add(v3(0, 0, 0.01)), v3(lado * (0.6 + rnd() * 0.5), 0.5 + rnd() * 0.5, 0.5 + rnd() * 0.4), 0.13 + rnd() * 0.05);
        if (i % 5 === 3) flor(q, p.clone().add(v3(lado * 0.05, 0.02, 0.06)), v3((rnd() - 0.5) * 0.4, 0.4, 1), 0.075 + rnd() * 0.02, rnd() < 0.7 ? P.flowerPink : P.lojaToldo);
      }
    }
  }

  // ==================================================================== FUNDOS
  /*
   * OS FUNDOS: so aparecem girando a camera, e por isso sao simples — a porta
   * de servico com o degrau e a luminaria, a caixa do relogio de luz, e os
   * dois condutores que descem da platibanda (com a caixa coletora em cima e
   * a abracadeira na parede).
   */
  {
    const q = FUNDOS;
    const { x, meia } = PORTA_DE_SERVICO;
    const alto = 2.2;
    peca(q, extrudar(moldeReto(x, BASE, BASE + alto, meia, 0.1), 0.045, 0), esquadria);
    // a folha fica 1 cm atras da frente do alizar, e as almofadas saltam dela
    caixa(q, 2 * meia, alto, 0.04, persiana, x, BASE + alto / 2, 0.015);
    for (const yy of [BASE + 0.62, BASE + 1.58]) chanfro(q, 2 * meia - 0.24, 0.72, 0.03, persiana, x, yy, 0.045, 0.015);
    const macaneta = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), metal);
    macaneta.position.set(x - meia + 0.12, BASE + 1.05, 0.09);
    q.add(macaneta);
    chanfro(q, 2 * meia + 0.5, 0.22, 0.3, pedra, x, 0.11, 0.13, 0.03);
    // a luminaria: arandela com o vidro aceso
    chanfro(q, 0.16, 0.1, 0.04, ferro, x, BASE + alto + 0.42, 0.02, 0.01);
    const globo = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), luz);
    globo.rotation.x = Math.PI;
    globo.position.set(x, BASE + alto + 0.37, 0.1);
    q.add(globo);
    // o relogio de luz
    chanfro(q, 0.36, 0.5, 0.14, esquadria, -4.0, 1.5, 0.07, 0.02);
    chanfro(q, 0.2, 0.14, 0.02, toon(P.lojaVitrine), -4.0, 1.6, 0.145, 0.01);

    for (const s of [-1, 1] as const) {
      const xc = s * 4.72;
      // a caixa coletora, sob o buzinote que atravessa a platibanda
      peca(q, new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8).rotateX(Math.PI / 2), faixa, xc, 6.98, 0.12);
      chanfro(q, 0.26, 0.24, 0.22, faixa, xc, 6.78, 0.26, 0.02);
      const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 6.4, 10), faixa);
      tubo.position.set(xc, 0.46 + 3.2, 0.26);
      q.add(tubo);
      // a curva do pe, que joga a agua para longe da parede
      const curva = new THREE.QuadraticBezierCurve3(v3(xc, 0.48, 0.26), v3(xc, 0.12, 0.26), v3(xc, 0.1, 0.48));
      peca(q, new THREE.TubeGeometry(curva, 8, 0.05, 10, false), faixa);
      for (const yy of [1.4, 2.9, 4.6, 6.1]) {
        caixa(q, 0.04, 0.04, 0.2, ferro, xc, yy, 0.1);
        const anel = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.012, 5, 12).rotateX(Math.PI / 2), ferro);
        anel.position.set(xc, yy, 0.26);
        q.add(anel);
      }
    }
  }

  // ==================================================================== LETREIRO
  /*
   * O LETREIRO VAI NA PLATIBANDA, e nao em cima do toldo: em cima do toldo ele
   * fica na altura do beiral e some atras dele na camera de 34°. Aqui em cima
   * ele e a primeira coisa que se ve do predio, de qualquer canto do parque.
   *
   * E uma placa de quina macia, com um filete creme por dentro da borda, o
   * nome com as letras espacadas e as lampadas em volta (um lote so). Ela fica
   * 4 cm a frente da platibanda e acima da cornija — encostada em qualquer
   * uma das duas, ela dividiria plano com ela.
   */
  {
    const q = FRENTE;
    const W = LARG - 2.4;
    // a placa passa um pouco do capeamento: e o que deixa a letra MAIOR que a
    // do letreiro antigo, que se lia do parque inteiro
    const H = 0.78;
    const yc = 6.64 + H / 2;
    chanfro(q, W, H, 0.17, ferro, 0, yc, 0.125, 0.04);
    const filete = retangulo(new THREE.Shape(), -W / 2 + 0.1, yc - H / 2 + 0.1, W / 2 - 0.1, yc + H / 2 - 0.1);
    filete.holes.push(retangulo(new THREE.Path(), -W / 2 + 0.14, yc - H / 2 + 0.14, W / 2 - 0.14, yc + H / 2 - 0.14));
    peca(q, extrudar(filete, 0.012, 0.205), esquadria);
    const nome = letreiroDaLoja(opts.nome ?? 'BOUTIQUE DA ESTELLA', W - 0.4, H - 0.22);
    nome.position.set(0, yc, 0.222);
    q.add(nome);
    const n = 20;
    for (let i = 0; i <= n; i++) {
      const x = -W / 2 + 0.24 + ((W - 0.48) * i) / n;
      for (const y of [yc - H / 2 + 0.05, yc + H / 2 - 0.05]) lampadas.por(q, v3(x, y, 0.235), new THREE.Quaternion(), 0.045);
    }
    for (const s of [-1, 1] as const) lampadas.por(q, v3(s * (W / 2 - 0.05), yc, 0.235), new THREE.Quaternion(), 0.045);
  }

  // ==================================================================== A BANDEIRA
  /*
   * A PLACA DE BANDEIRA: perpendicular a fachada, num braco de ferro com uma
   * voluta embaixo, na quina da direita do andar de cima. E o letreiro de quem
   * vem pela calcada de lado, e o desenho dela (o vestidinho no cabide) diz o
   * que a loja vende antes de qualquer palavra.
   */
  {
    const q = FRENTE;
    const x = 4.79;
    chanfro(q, 0.09, 0.62, 0.03, ferro, x, 5.25, 0.015, 0.01);
    const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.92, 6).rotateX(Math.PI / 2), ferro);
    braco.position.set(x, 5.5, 0.46);
    q.add(braco);
    // a mao-francesa: sobe do pe da chapa em curva ate o braco
    const mao = new THREE.CatmullRomCurve3([
      v3(x, 4.99, 0.03), v3(x, 5.1, 0.1), v3(x, 5.27, 0.24), v3(x, 5.41, 0.42), v3(x, 5.485, 0.62),
    ]);
    peca(q, new THREE.TubeGeometry(mao, 16, 0.014, 5, false), ferro);
    // e a voluta enrolada no pe dela
    const voluta: THREE.Vector3[] = [];
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 1.7;
      const r = 0.07 * (1 - i / 24);
      voluta.push(v3(x, 5.09 + Math.cos(a) * r, 0.17 - Math.sin(a) * r));
    }
    peca(q, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(voluta), 16, 0.011, 5, false), ferro);
    for (const z of [0.3, 0.7]) {
      const elo = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.007, 4, 10), ferro);
      elo.position.set(x, 5.455, z);
      elo.rotation.y = Math.PI / 2;
      q.add(elo);
    }
    const raio = 0.3;
    const disco = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, 0.04, 24).rotateZ(Math.PI / 2), esquadria);
    disco.position.set(x, 5.12, 0.5);
    q.add(disco);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.025, 6, 28), persiana);
    aro.rotation.y = Math.PI / 2;
    aro.position.set(x, 5.12, 0.5);
    q.add(aro);
    const desenho = desenhoDaBandeira(raio * 0.92, 0.022);
    desenho.rotation.y = Math.PI / 2;
    desenho.position.set(x, 5.12, 0.5);
    q.add(desenho);
  }

  // ==================================================================== TELHADO
  /*
   * O TELHADO: e enorme na tela (a camera de 34° olha muito de cima), e por
   * isso ganhou o mesmo cuidado da fachada — piso de placas dentro da
   * platibanda, a caixa d'agua torneada, os dois condensadores com grade e
   * helice, a claraboia em piramide, dois respiros e a antena.
   */
  peca(g, new THREE.BoxGeometry(2 * MEIO + 0.04, 0.08, 2 * (HZ - ESP) + 0.04), toon(P.lojaFaixa, { mapa: pisoDePlacas(1.2) }), 0, Y_LAJE - 0.04, 0);
  {
    // a caixa d'agua: base de concreto, corpo com dois frisos e tampa abaulada
    const cx = -3.4;
    const cz = -1.6;
    chanfro(g, 1.4, 0.12, 1.4, pedra, cx, Y_LAJE + 0.06, cz, 0.02);
    const perfil = [
      [0, 0], [0.52, 0], [0.56, 0.03], [0.58, 0.1], [0.6, 0.3], [0.625, 0.33], [0.61, 0.36], [0.62, 0.6],
      [0.645, 0.63], [0.63, 0.66], [0.64, 0.86], [0.67, 0.88], [0.6, 0.97], [0.36, 1.05], [0.14, 1.08],
      [0.1, 1.08], [0.1, 1.13], [0.0, 1.14],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    peca(g, new THREE.LatheGeometry(perfil, 20), toon(P.vestiarioCaixa), cx, Y_LAJE + 0.12, cz);

    // os condensadores: caixa de quina macia, grade redonda em cima e a helice
    for (const x of [1.6, 3.2]) {
      const z = -1.8;
      for (const s of [-1, 1] as const) caixa(g, 0.08, 0.06, 0.62, pedra, x + s * 0.3, Y_LAJE + 0.03, z);
      chanfro(g, 0.9, 0.56, 0.62, metal, x, Y_LAJE + 0.06 + 0.28, z, 0.05);
      const yTopo = Y_LAJE + 0.06 + 0.56;
      peca(g, new THREE.CylinderGeometry(0.27, 0.27, 0.02, 20), toon(P.churrascoInoxEscuro), x, yTopo - 0.005, z);
      for (const r of [0.1, 0.18, 0.26]) {
        const anel = new THREE.Mesh(new THREE.TorusGeometry(r, 0.011, 4, 22).rotateX(Math.PI / 2), metal);
        anel.position.set(x, yTopo + 0.012, z);
        g.add(anel);
      }
      // as duas travessas se cruzam no meio: uma 4 mm mais alta que a outra
      for (const [a, alt] of [[0, 0.014], [Math.PI / 2, 0.018]] as const) {
        const travessa = caixa(g, 0.54, alt, 0.022, metal, x, yTopo + 0.013, z);
        travessa.rotation.y = a;
      }
      for (let k = 0; k < 3; k++) {
        const pa = caixa(g, 0.2, 0.008, 0.07, ferro, x, yTopo + 0.002, z);
        pa.rotation.set(0.35, (k * Math.PI * 2) / 3, 0);
        pa.position.set(x + Math.cos((k * Math.PI * 2) / 3) * 0.1, yTopo + 0.002, z - Math.sin((k * Math.PI * 2) / 3) * 0.1);
      }
      // o cano isolado que desce do condensador ate a laje e corre para o fundo
      const cano = new THREE.CatmullRomCurve3([
        v3(x + 0.46, Y_LAJE + 0.3, z), v3(x + 0.56, Y_LAJE + 0.12, z), v3(x + 0.58, Y_LAJE + 0.05, z - 0.3),
        v3(x + 0.6, Y_LAJE + 0.05, -(HZ - ESP) + 0.05),
      ]);
      peca(g, new THREE.TubeGeometry(cano, 16, 0.025, 6, false), dentro);
    }

    // a claraboia: o caixilho e a piramide de vidro com as arestas marcadas
    const kx = 0.3;
    const kz = 0.6;
    chanfro(g, 1.5, 0.22, 1.1, faixa, kx, Y_LAJE + 0.11, kz, 0.03);
    // o giro vai na GEOMETRIA: girada na malha, a escala (que vem antes do
    // giro) esticaria as pontas e a base sairia losango
    const piramide = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 4, 1).rotateY(Math.PI / 4), toon(P.lojaVitrine, { glow: 0.15 }));
    piramide.scale.set(0.98, 0.42, 0.7);
    piramide.position.set(kx, Y_LAJE + 0.22 + 0.21, kz);
    g.add(piramide);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
      const a = v3(kx + sx * 0.69, Y_LAJE + 0.225, kz + sz * 0.49);
      const b = v3(kx, Y_LAJE + 0.645, kz);
      peca(g, new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 1, 0.018, 5, false), esquadria);
    }
    // os respiros e a antena
    for (const [x, z] of [[-0.9, -2.9], [-1.5, -2.6]] as const) {
      peca(g, new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), pedra, x, Y_LAJE + 0.2, z);
      peca(g, new THREE.ConeGeometry(0.11, 0.1, 8), pedra, x, Y_LAJE + 0.45, z);
    }
    const ax = 4.7;
    const az = -3.2;
    peca(g, new THREE.CylinderGeometry(0.02, 0.025, 1.5, 6), metal, ax, Y_LAJE + 0.75, az);
    for (const [y, l] of [[1.05, 0.7], [1.25, 0.55], [1.42, 0.4]] as const) {
      const vareta = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, l, 5).rotateZ(Math.PI / 2), metal);
      vareta.position.set(ax, Y_LAJE + y, az);
      vareta.rotation.y = 0.5;
      g.add(vareta);
    }
  }

  // ==================================================================== FIM
  flores.montar(g);
  miolos.montar(g);
  folhas.montar(g);
  lampadas.montar(g);
  palhetas.montar(g);
  /*
   * O VIDRO DO PREDIO INTEIRO NUMA MALHA SO. Transparente nao entra na
   * `fundir()` (a ordem de pintura entre pecas transparentes importa), mas os
   * vidros daqui sao todos chapados, na casca do predio, e nenhum fica na
   * frente do outro — um desenho so serve. Ele vai DEPOIS da luz pintada da
   * vitrine (`renderOrder` maior): o vidro grava profundidade, e pintado antes
   * ele apagaria a poca de luz que mora atras dele.
   */
  const todoVidro = new THREE.Mesh(mergeGeometries(vidros), vidro);
  todoVidro.renderOrder = 4;
  g.add(todoVidro);

  return g;
}
