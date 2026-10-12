import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon, flat } from '../core/materials';
import { PALETTE as P } from '../palette';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { uvDeParede, uvEmMetros, uvEmMetrosPorTriangulo } from './acabamento';
import { contorno, cavetinho, type Perfil } from './molduras';
import { reboco, tijolinho } from './texturasDeFachada';
import { assoalhoDeMadeira, sorteio } from './texturasDeChao';
import { desenhoDeTapete, toalhaXadrez, tramaDeTecido, veioDeMadeira } from './texturasDeCasa';
import {
  Lote, extrudar, geoFlor, geoFolha, moldeEmArco, moldeReto, quina, retangulo,
} from './lojaDeRoupas';

/**
 * ===================================== O MANIA DE CHURRASCO, POR FORA
 *
 * O restaurante do clube, a segunda versão. A primeira era o `restaurante()`
 * do kit: uma caixa creme com janelões colados na frente, um toldo comprido
 * de caixinhas listradas e um telhado de duas placas. Esta é a mesma casa —
 * o mesmo 13 × 7, a fachada no mesmo plano, a porta no mesmo `x` e a porta de
 * serviço no mesmo lugar dos fundos —, refeita com as técnicas das skills de
 * three, e com a cara de CHURRASCARIA que o salão por dentro já tinha:
 *
 *  - PAREDE COM FURO (`ExtrudeGeometry` com `holes`): as quatro janelas da
 *    frente, a porta em arco abatido e a porta de serviço são vãos de
 *    verdade, e o caixilho de madeira mora DENTRO deles;
 *  - TIJOLINHO À VISTA no lambri (o mesmo tijolo de churrascaria da parede
 *    da grelha lá dentro, `P.churrascoTijolo`) e reboco por cima, tudo em
 *    canvas com o UV em metros (`uvDeParede`);
 *  - MOLDURA COM PERFIL (`molduras.ts`): o embasamento de pedra, o peitoril
 *    corrido em cima do tijolo e a cornija com cavetinho debaixo do beiral;
 *    e os CUNHAIS de pedra nas quatro quinas;
 *  - TOLDO DE LONA por janela, nos gomos que embarrigam entre as varetas (o
 *    teal do clube com a listra creme), e a FLOREIRA com flor instanciada;
 *  - a PORTA de duas folhas com almofada embaixo e vidro em cima, a bandeira
 *    em leque, o arco de tijolo com pedra-chave, os dois LAMPIÕES e o degrau
 *    com capacho;
 *  - o LETREIRO em tábua escura com o nome em dourado e as três luminárias
 *    PESCOÇO-DE-GANSO jogando luz pintada nele;
 *  - TELHA COLONIAL de verdade: cada água é uma geometria própria, com as
 *    fiadas se sobrepondo e a canaleta ondulando — o toon desenha cada canal
 *    sozinho —, a cumeeira de telhas de capa, a testeira e o frechal;
 *  - a CHAMINÉ DA CHURRASQUEIRA, de tijolo, com coroa de pedra e FUMAÇA saindo (um
 *    `InstancedMesh` só, animado), e o EXAUSTOR EÓLICO girando no telhado;
 *  - pelas janelas, o SALÃO: o assoalho do Mania, as mesas de toalha
 *    vermelha e a luz quente pintada no chão;
 *  - nos lados e nos fundos, as janelas de VENEZIANA fechada (no teal), o
 *    óculo das empenas, o condensador do ar, o abrigo de gás e a lenha.
 *
 * E LEVE: flor, folha e palheta de veneziana são lotes instanciados, o vidro
 * da casa inteira é uma malha só, e a cena passa a peça por `fundir()`.
 *
 * A CONTA DA CÂMERA, que decidiu as alturas. A câmera desce 34° e vem pela
 * diagonal, então o raio que passa rente à borda do beiral cai `0,95` por
 * metro de avanço até a fachada: com a testeira embaixo do beiral em 4,82 e
 * 62 cm para fora, a fachada some acima de ~4,25. Tudo que precisa ser lido
 * (o letreiro, o arco da porta) mora abaixo disso; a parede subiu para 5,1
 * (era 4,54) justamente para o letreiro caber entre o arco da porta e essa
 * linha. Os toldos têm a mesma conta: ponta em 3,0 e 85 cm para fora tapam a
 * janela acima de ~2,2, e o que se vê do salão é o vão de baixo.
 *
 * O PONTO CEGO DOS FUNDOS continua sendo a graça da porta de serviço (ver
 * `clube.ts`): o prédio ficou um pouco mais alto, e a porta continua achada
 * só por quem dá a volta ou gira a câmera.
 *
 * É PEÇA ANIMADA (a fumaça e o eólico): a cena chama `update(dt)` no
 * `w.onUpdate`, como a roda gigante.
 */

// ------------------------------------------------------------ as medidas
const LARG = 13;
const FUNDO = 7;
const HX = LARG / 2;
const HZ = FUNDO / 2;
/** espessura da parede */
const ESP = 0.24;
/** a frente e o fundo cabem ENTRE as laterais, que vão de ponta a ponta */
const MEIO = HX - ESP;
/** o alto do embasamento de pedra (e o chão de dentro, 2 cm acima) */
const BASE = 0.3;
/** a emenda entre o tijolo e o reboco, atrás do peitoril corrido */
const Y_LAMBRI = 1.05;
/** o alto da parede, onde o telhado apoia */
const Y_PAREDE = 5.1;

// a porta da frente
/** meia largura do vão */
const PORTA = 0.95;
/** onde o arco abatido nasce */
const PY = 2.85;
/** a flecha do arco */
const ARCO = 0.32;

// as janelas da frente
/** meia largura */
const JAN = 0.875;
const XS_JANELA = [-4.825, -2.725, 2.725, 4.825] as const;
/** peitoril e verga */
const J0 = 1.25;
const J1 = 3.05;
/** a travessa da bandeira */
const JB = 2.47;

// o telhado
/** quanto o beiral avança na frente e nos fundos */
const BEIRAL = 0.6;
/** quanto o telhado passa das empenas */
const OITAO = 0.35;
/** o plano das telhas na linha da parede (o frechal por baixo) */
const Y_APOIO = Y_PAREDE + 0.12;
/** quanto a cumeeira sobe acima de `Y_APOIO` */
const SUBIDA = 1.4;
const INCLINACAO = Math.atan2(SUBIDA, HZ);
const Y_CUMEEIRA = Y_APOIO + SUBIDA;
/** o comprimento de uma água, da cumeeira à ponta do beiral */
const AGUA = (HZ + BEIRAL) / Math.cos(INCLINACAO);

/**
 * A PORTA DE SERVIÇO, no quadro dos FUNDOS (que é virado: o `x` dele é o
 * `-x` da peça). Na peça ela fica em `x = +2,4`, que é o `FUNDO_DO_RESTAURANTE`
 * da cena. O vão é o da `interiorDoor(…, 1.0, 2.15)` com batente: 1,18 de
 * largura e 2,25 de alto, mais um centímetro de folga de cada lado.
 */
const SERVICO = { x: -2.4, meia: 0.6, alto: 2.27 };

/** o centro da parede dos fundos, contado da face de fora: é onde a cena centra a porta */
export const RESTAURANTE_ESPESSURA_DA_PAREDE = ESP;

/**
 * UMA ÁGUA DE TELHA COLONIAL, no espaço da água: `x` ao longo do beiral, `z`
 * descendo da cumeeira (`0`) até a ponta (`agua`), `y` a altura acima do
 * plano do telhado. Quem chama gira e posiciona.
 *
 * CADA FIADA É UMA FAIXA que sobe um pouco de cima para baixo (`LEVANTA`):
 * a ponta de baixo dela fica por cima do começo da fiada seguinte, e a
 * "boca" entre as duas é fechada por uma faixa em pé — o LÁBIO, ondulado em
 * cima e reto embaixo, enterrado na fiada de baixo. É o lábio, na sombra do
 * toon, que desenha a linha de cada fiada; a onda da canaleta (um cosseno,
 * crista no meio e cava nas pontas) é o que desenha cada canal.
 *
 * A ÚLTIMA FIADA desce até o plano, e a testeira do beiral fecha embaixo.
 *
 * Ela volta indexada por fiada e com UV em metros (`x`, `z`), para juntar com
 * a cumeeira na `fundir()` (mesmo material, mesmos atributos).
 */
function aguaDeTelhas(meia: number, agua: number): THREE.BufferGeometry {
  const FIADAS = 9;
  const ONDAS = Math.round((2 * meia) / 0.42);
  const PERIODO = (2 * meia) / ONDAS;
  const SEG = 6;
  const COLUNAS = ONDAS * SEG;
  const AMPLITUDE = 0.045;
  const ESPESSURA = 0.02;
  const LEVANTA = 0.075;
  const SOBRA = 0.06;
  const passo = agua / FIADAS;
  // cava nas pontas (onde a testeira cobre) e crista no meio de cada canal
  const onda = (x: number): number => AMPLITUDE * (1 - Math.cos((2 * Math.PI * (x + meia)) / PERIODO));

  const partes: THREE.BufferGeometry[] = [];
  const faixa = (pontos: (i: number, j: number) => [number, number, number], linhas: number): void => {
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    for (let j = 0; j <= linhas; j++) {
      for (let i = 0; i <= COLUNAS; i++) {
        const [x, y, z] = pontos(i, j);
        pos.push(x, y, z);
        uv.push(x, z + y);
      }
    }
    const larg = COLUNAS + 1;
    for (let j = 0; j < linhas; j++) {
      for (let i = 0; i < COLUNAS; i++) {
        const a = j * larg + i;
        const b = a + 1;
        const c = a + larg;
        const d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    partes.push(geo);
  };
  const xDa = (i: number): number => -meia + (2 * meia * i) / COLUNAS;

  for (let k = 0; k < FIADAS; k++) {
    const z0 = k === 0 ? 0 : k * passo - SOBRA;
    const z1 = (k + 1) * passo;
    const ultima = k === FIADAS - 1;
    // a face de cima da fiada: da cumeeira para o beiral, subindo `LEVANTA`
    faixa((i, j) => {
      const x = xDa(i);
      const z = j === 0 ? z0 : z1;
      const h = ESPESSURA + (j === 0 ? 0 : LEVANTA);
      return [x, h + onda(x), z];
    }, 1);
    // o lábio: em pé na ponta de baixo, da onda até o começo da fiada seguinte
    faixa((i, j) => {
      const x = xDa(i);
      const y = j === 0 ? ESPESSURA + LEVANTA + onda(x) : (ultima ? -0.02 : ESPESSURA * 0.5);
      return [x, y, z1];
    }, 1);
  }
  const junta = mergeGeometries(partes.map((p) => p.toNonIndexed()));
  for (const p of partes) p.dispose();
  return junta;
}

/**
 * O LETREIRO: "Mania de Churrasco" em dourado sobre a tábua escura, com uma
 * chaminha de brasa de cada lado — o mesmo dourado da placa do bar lá dentro.
 */
function letreiroDoMania(texto: string, largura: number, altura: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.max(64, Math.round((1024 * altura) / largura));
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const W = canvas.width;
    const H = canvas.height;
    const fonte = (px: number): string => `bold ${px}px ui-rounded, "Nunito", system-ui, sans-serif`;
    let tamanho = Math.round(H * 0.66);
    const ocupa = W * 0.74;
    ctx.font = fonte(tamanho);
    while (tamanho > 10 && ctx.measureText(texto).width > ocupa) {
      tamanho -= 2;
      ctx.font = fonte(tamanho);
    }
    const larguraDoTexto = ctx.measureText(texto).width;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // a sombra da letra entalhada, um pouco abaixo e à direita
    ctx.fillStyle = 'rgba(20,10,4,0.55)';
    ctx.fillText(texto, W / 2 + 3, H / 2 + tamanho * 0.06 + 4);
    ctx.fillStyle = '#ffd88a';
    ctx.fillText(texto, W / 2, H / 2 + tamanho * 0.06);

    // a chaminha: uma gota de fogo laranja com o miolo amarelo
    const chama = (cx: number, cy: number, r: number): void => {
      const gota = (escala: number, cor: string): void => {
        const s = r * escala;
        ctx.fillStyle = cor;
        ctx.beginPath();
        ctx.moveTo(cx, cy - s * 1.6);
        ctx.bezierCurveTo(cx + s * 0.35, cy - s * 0.9, cx + s * 1.05, cy - s * 0.35, cx + s * 0.85, cy + s * 0.35);
        ctx.bezierCurveTo(cx + s * 0.7, cy + s * 0.95, cx - s * 0.7, cy + s * 0.95, cx - s * 0.85, cy + s * 0.35);
        ctx.bezierCurveTo(cx - s * 1.0, cy - s * 0.2, cx - s * 0.5, cy - s * 0.6, cx, cy - s * 1.6);
        ctx.closePath();
        ctx.fill();
      };
      gota(1, '#ff7a33');
      gota(0.58, '#ffc85a');
    };
    const r = H * 0.2;
    for (const lado of [-1, 1]) chama(W / 2 + lado * (larguraDoTexto / 2 + r * 2.2), H / 2 + r * 0.2, r);
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(largura, altura),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
}

export interface RestauranteOpts {
  /** o nome no letreiro */
  nome?: string;
}

export class RestauranteDoClube {
  readonly group = new THREE.Group();
  /** a fumaça da chaminé: um lote de bolotas que sobem, crescem e somem */
  private readonly fumaca: THREE.InstancedMesh;
  /** a cabeça do exaustor eólico, que gira */
  private readonly eolico: THREE.Group;
  private readonly bocaDaChamine = new THREE.Vector3();
  private tempo = 0;
  private readonly matriz = new THREE.Matrix4();
  private readonly ponto = new THREE.Vector3();
  private readonly tamanho = new THREE.Vector3();
  private readonly semGiro = new THREE.Quaternion();

  constructor(opts: RestauranteOpts = {}) {
    const g = this.group;
    g.userData.peca = 'restaurante-do-clube';
    const rnd = sorteio(7310);

    // ----------------------------------------------------------- materiais
    const parede = toon(P.restauranteParede, { mapa: reboco() });
    /*
     * O TIJOLO é o de churrascaria do salão (`P.churrascoTijolo`), pintado
     * sobre branco; o material é o rejunte creme. Rejunte é claro, e o toon
     * só escurece — ver `tijolinho()`.
     */
    const tijolo = toon(P.churrascoRejunte, { mapa: tijolinho(0.84, P.churrascoTijolo) });
    const pedra = toon(P.restaurantePedra);
    const faixa = toon(P.restauranteFaixa);
    const veio = veioDeMadeira();
    const esquadria = toon(P.restauranteEsquadria, { mapa: veio });
    const tabua = toon(P.restauranteLetreiro, { mapa: veio });
    const telha = toon(P.roofTile);
    const ferro = toon(P.churrascoCarvao);
    const ferroDosDoisLados = toon(P.churrascoCarvao, { doubleSide: true });
    const metal = toon(P.metalGrey);
    const metalClaro = toon(P.metalWhite);
    const latao = toon(P.gold);
    /*
     * O VIDRO É `flat()`, e não `toon()` — a lição da vitrine da Estella: o
     * vidro sombreado cai no degradê escuro do toon e vira mancha. Chapado e
     * bem transparente, ele é só o reflexo por cima do salão.
     */
    const vidro = flat(P.restauranteVidro, 0.24);
    const luz = toon(P.luzDoPortao, { glow: 0.6 });
    const lona = toon(P.restauranteToldo, { doubleSide: true });
    const lonaClara = toon(P.restauranteLona, { doubleSide: true });
    const veneziana = toon(P.restauranteToldo);
    const terra = toon(P.terraDeVaso);
    const escuro = toon(P.restauranteMiolo);
    const piso = toon(P.churrascoPiso, { mapa: assoalhoDeMadeira(2.4, 8) });
    const toalha = toon(P.churrascoToalha);
    const moveis = toon(P.churrascoFaixa);
    const louca = toon(P.metalWhite);
    const madeiras = new Set<THREE.Material>([esquadria, tabua]);

    // os lotes de cópias
    const branco = toon(0xffffff, { doubleSide: true });
    const flores = new Lote(geoFlor(), branco);
    const miolos = new Lote(new THREE.OctahedronGeometry(1, 0), toon(0xffffff));
    const folhas = new Lote(geoFolha(), branco);
    const palhetas = new Lote(new THREE.BoxGeometry(1, 1, 1), veneziana);
    const toras = new Lote(new THREE.CylinderGeometry(1, 1, 1, 9), toon(0xffffff));
    /** o vidro da casa inteira, juntado numa malha só no fim */
    const vidros: THREE.BufferGeometry[] = [];

    // ---------------------------------------------------- quadros e peças
    /*
     * CADA PAREDE É UM QUADRO (o padrão da lojinha da Estella): um grupo sem
     * nome com a face de fora em `z = 0` e o `+z` para fora. Grupo sem nome
     * não é fronteira para a `fundir()`.
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
        if (madeiras.has(mat)) {
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
    const tubo = (pai: THREE.Object3D, pontos: THREE.Vector3[], raio: number, mat: THREE.Material, lados = 6): THREE.Mesh =>
      peca(pai, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), pontos.length * 5, raio, lados, false), mat);
    const guardarVidro = (q: THREE.Object3D, geo: THREE.BufferGeometry, x: number, y: number, z: number): void => {
      const m = new THREE.Matrix4().makeTranslation(x, y, z).premultiply(q.matrix);
      const v = (geo.index ? geo.toNonIndexed() : geo).applyMatrix4(m);
      v.deleteAttribute('uv');
      vidros.push(v);
    };
    const v3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
    const giro = (x: number, y: number, z: number): THREE.Quaternion =>
      new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
    const CORES_DE_FLOR = [P.flowerPink, P.flowerYellow, P.restauranteLona, P.churrascoBrasaViva];
    const VERDES = [P.leafMid, P.leafLight, P.leafDark];
    const folha = (q: THREE.Object3D, p: THREE.Vector3, dir: THREE.Vector3, tam: number): void => {
      const orienta = new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), dir.clone().normalize());
      const torce = new THREE.Quaternion().setFromAxisAngle(v3(0, 0, 1), (rnd() - 0.5) * 1.6);
      folhas.por(q, p, orienta.multiply(torce), tam, VERDES[Math.floor(rnd() * VERDES.length)]);
    };
    const flor = (q: THREE.Object3D, p: THREE.Vector3, normal: THREE.Vector3, tam: number, cor: number): void => {
      const orienta = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), normal.clone().normalize());
      const roda = new THREE.Quaternion().setFromAxisAngle(v3(0, 1, 0), rnd() * Math.PI * 2);
      flores.por(q, p, orienta.multiply(roda), tam, cor);
      miolos.por(q, p.clone().addScaledVector(normal.clone().normalize(), tam * 0.12), new THREE.Quaternion(), tam * 0.26,
        cor === P.flowerYellow ? P.woodDark : P.flowerYellow);
    };

    // ================================================================ CHÃO
    /*
     * O EMBASAMENTO de pedra, com a quina chanfrada, 16 cm para fora da
     * parede. Ele passa por baixo da porta da frente (o degrau cobre) e abre
     * na de serviço, que desce até o chão.
     */
    const vaoDeServico = { lado: 'fundo' as const, de: -SERVICO.x - SERVICO.meia - 0.02, ate: -SERVICO.x + SERVICO.meia + 0.02 };
    peca(g, contorno([[0.16, 0], [0.16, 0.19], [0.08, 0.27], [0, 0.3]], HX, HZ, [vaoDeServico]), pedra);
    // o assoalho do salão, que aparece pelas janelas e pela porta
    caixa(g, 2 * MEIO - 0.02, 0.08, 2 * (HZ - ESP) - 0.02, piso, 0, BASE - 0.02, 0);

    // ================================================================ PAREDES
    const pano = (q: THREE.Object3D, forma: THREE.Shape, mat: THREE.Material): void => {
      peca(q, extrudar(forma, ESP, -ESP), mat);
    };
    const ret = (x0: number, y0: number, x1: number, y1: number): THREE.Shape => retangulo(new THREE.Shape(), x0, y0, x1, y1);

    // --- o LAMBRI de tijolo, até o peitoril corrido
    pano(FRENTE, ret(-MEIO, BASE, -PORTA, Y_LAMBRI), tijolo);
    pano(FRENTE, ret(PORTA, BASE, MEIO, Y_LAMBRI), tijolo);
    pano(FUNDOS, ret(-MEIO, BASE, SERVICO.x - SERVICO.meia, Y_LAMBRI), tijolo);
    pano(FUNDOS, ret(SERVICO.x + SERVICO.meia, BASE, MEIO, Y_LAMBRI), tijolo);
    for (const q of [DIREITA, ESQUERDA]) pano(q, ret(-HZ, BASE - 0.03, HZ, Y_LAMBRI), tijolo);

    // --- o REBOCO: a frente com a porta em arco e as quatro janelas
    const frente = new THREE.Shape();
    frente.moveTo(-MEIO, Y_LAMBRI);
    frente.lineTo(-PORTA, Y_LAMBRI);
    frente.lineTo(-PORTA, PY);
    frente.absellipse(0, PY, PORTA, ARCO, Math.PI, 0, true, 0);
    frente.lineTo(PORTA, Y_LAMBRI);
    frente.lineTo(MEIO, Y_LAMBRI);
    frente.lineTo(MEIO, Y_PAREDE);
    frente.lineTo(-MEIO, Y_PAREDE);
    frente.closePath();
    for (const cx of XS_JANELA) frente.holes.push(retangulo(new THREE.Path(), cx - JAN, J0, cx + JAN, J1));
    pano(FRENTE, frente, parede);

    // --- os fundos, com o vão da porta de serviço recortado até o chão
    const fundos = new THREE.Shape();
    fundos.moveTo(-MEIO, Y_LAMBRI);
    fundos.lineTo(SERVICO.x - SERVICO.meia, Y_LAMBRI);
    fundos.lineTo(SERVICO.x - SERVICO.meia, SERVICO.alto);
    fundos.lineTo(SERVICO.x + SERVICO.meia, SERVICO.alto);
    fundos.lineTo(SERVICO.x + SERVICO.meia, Y_LAMBRI);
    fundos.lineTo(MEIO, Y_LAMBRI);
    fundos.lineTo(MEIO, Y_PAREDE);
    fundos.lineTo(-MEIO, Y_PAREDE);
    fundos.closePath();
    pano(FUNDOS, fundos, parede);

    // --- as laterais e as EMPENAS (o triângulo debaixo do telhado)
    for (const q of [DIREITA, ESQUERDA]) {
      pano(q, ret(-HZ, Y_LAMBRI, HZ, Y_PAREDE), parede);
      const empena = new THREE.Shape();
      empena.moveTo(-HZ, Y_PAREDE);
      empena.lineTo(HZ, Y_PAREDE);
      empena.lineTo(HZ, Y_APOIO - 0.05);
      empena.lineTo(0, Y_CUMEEIRA - 0.05);
      empena.lineTo(-HZ, Y_APOIO - 0.05);
      empena.closePath();
      pano(q, empena, parede);
    }
    // o FRECHAL em cima da frente e dos fundos, fechando o vão até o plano das telhas
    for (const s of [-1, 1] as const) {
      caixa(g, 2 * MEIO - 0.02, 0.14, ESP - 0.04, esquadria, 0, Y_PAREDE + 0.06, s * (HZ - ESP / 2));
    }
    // o FUNDO DO SALÃO, que é o que o vão da porta deixa ver lá no fundo
    // 1 cm mais estreito de cada lado que o assoalho: com a mesma largura, as
    // pontas dos dois dividiriam plano onde o fundo pisa no chão
    caixa(g, 2 * MEIO - 0.04, Y_PAREDE - BASE, 0.12, tijolo, 0, (BASE + Y_PAREDE) / 2, HZ - 2.6);

    // ================================================================ MOLDURAS
    /*
     * O PEITORIL CORRIDO em cima do tijolo: pingadeiro, chapa e a rampinha.
     * Ele abre na porta da frente (onde passa o arco de tijolo) e na de
     * serviço, e fecha a ponta com o próprio perfil.
     */
    const PERFIL_DO_PEITORIL: Perfil = [
      [0, 0.96], [0.07, 0.99], [0.07, 1.08], [0.11, 1.11], [0.11, 1.16], [0.03, 1.2], [0, 1.2],
    ];
    peca(g, contorno(PERFIL_DO_PEITORIL, HX, HZ, [
      { lado: 'frente', de: -PORTA - 0.16, ate: PORTA + 0.16 },
      vaoDeServico,
    ]), pedra);
    // a CORNIJA debaixo do beiral: filete, cavetinho e a pingadeira
    const PERFIL_DA_CORNIJA: Perfil = [
      [0, 4.74], [0.03, 4.76], [0.03, 4.82], [0.05, 4.84],
      ...cavetinho([0.05, 4.84], [0.15, 4.95], 4),
      [0.16, 4.96], [0.16, 5.02], [0, 5.06],
    ];
    peca(g, contorno(PERFIL_DA_CORNIJA, HX, HZ), faixa);

    /*
     * OS CUNHAIS: as pedras de quina, alternando comprida e curta. Uma caixa
     * só por pedra, que sai 3 cm das DUAS faces da quina: nada de duas tiras
     * coladas na quina, que dividiriam plano.
     */
    {
      const y0 = 1.24;
      const y1 = 4.72;
      const fiadas = Math.max(1, Math.round((y1 - y0) / 0.36));
      const passo = (y1 - y0) / fiadas;
      for (let i = 0; i < fiadas; i++) {
        const [naFrente, noLado] = i % 2 ? [0.52, 0.32] : [0.32, 0.52];
        const y = y0 + passo * (i + 0.5);
        for (const sx of [-1, 1] as const) {
          for (const sz of [-1, 1] as const) {
            chanfro(g, naFrente, passo - 0.045, noLado, pedra,
              sx * (HX + 0.03 - naFrente / 2), y, sz * (HZ + 0.03 - noLado / 2), 0.025);
          }
        }
      }
    }

    // ================================================================ JANELAS DA FRENTE
    /**
     * A JANELA DO SALÃO: o caixilho de madeira dentro do vão (o aro embutido
     * 1 cm no reboco, o montante e a bandeira de três vidros), o alizar creme
     * em U por fora, o peitoril de pedra com as duas mísulas, a floreira e o
     * toldo. Dentro, a mesa de toalha vermelha e a luz quente no chão.
     */
    const misula = (q: THREE.Object3D, x: number, topo: number): void => {
      const s = new THREE.Shape();
      s.moveTo(0, 0);
      s.lineTo(0.17, 0);
      s.lineTo(0.17, -0.05);
      s.quadraticCurveTo(0.05, -0.08, 0.03, -0.22);
      s.lineTo(0, -0.22);
      s.closePath();
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: false, curveSegments: 6 });
      geo.rotateY(-Math.PI / 2);
      geo.translate(0.04, 0, 0);
      peca(q, geo, pedra, x, topo, 0);
    };

    const floreira = (q: THREE.Object3D, cx: number, base: number, largura: number): void => {
      chanfro(q, largura, 0.2, 0.17, esquadria, cx, base + 0.1, 0.105, 0.015);
      chanfro(q, largura - 0.06, 0.04, 0.12, terra, cx, base + 0.205, 0.105, 0.015);
      const n = Math.round(largura / 0.2);
      const yTerra = base + 0.225;
      for (let i = 0; i < n * 3; i++) {
        const x = cx - largura / 2 + 0.07 + rnd() * (largura - 0.14);
        folha(q, v3(x, yTerra, 0.05 + rnd() * 0.11), v3((rnd() - 0.5) * 1.3, 1, (rnd() - 0.15) * 0.9), 0.15 + rnd() * 0.06);
      }
      for (let i = 0; i < n; i++) {
        const x = cx - largura / 2 + 0.1 + (i + rnd() * 0.4) * ((largura - 0.2) / n);
        const y = base + 0.3 + rnd() * 0.07;
        flor(q, v3(x, y, 0.07 + rnd() * 0.07), v3((rnd() - 0.5) * 0.4, 1, 0.35), 0.055 + rnd() * 0.02,
          CORES_DE_FLOR[Math.floor(rnd() * CORES_DE_FLOR.length)]);
      }
      // os raminhos caindo pela frente do caixote
      for (let k = 0; k < 3; k++) {
        const x = cx - largura / 2 + (largura * (k + 0.3 + rnd() * 0.4)) / 3;
        for (let i = 0; i < 3; i++) {
          folha(q, v3(x + (rnd() - 0.5) * 0.04, yTerra - 0.01 - i * 0.075, 0.2 + i * 0.012),
            v3((rnd() - 0.5) * 0.5, -1, 0.45), 0.12 + rnd() * 0.03);
        }
      }
    };

    /**
     * O TOLDO DE LONA (a técnica da lojinha da Estella): gomos listrados que
     * descem da caixa de enrolar até a beira numa curva que vai inclinando,
     * cada um EMBARRIGANDO entre as varetas, a aba recortada em meia-lua e os
     * dois braços de ferro. Teal do clube e listra creme.
     */
    const toldo = (q: THREE.Object3D, cx: number, L: number): void => {
      const N = 9;
      const passo = L / N;
      const Y0 = 3.45;
      const Z0 = 0.08;
      const Y1 = 3.0;
      const Z1 = 0.86;
      const SEG = 8;
      const LARGS = 3;
      const perfil = (t: number): [number, number] => [Z0 + (Z1 - Z0) * t, Y0 - (Y0 - Y1) * Math.pow(t, 1.6)];
      for (let i = 0; i < N; i++) {
        const x0 = cx - L / 2 + passo * i;
        const pos: number[] = [];
        const ponto = (u: number, t: number): number[] => {
          const [z, y] = perfil(t);
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
        const aba = new THREE.Shape();
        aba.moveTo(x0, 0);
        aba.lineTo(x0, -0.11);
        aba.absarc(x0 + passo / 2, -0.11, passo / 2, Math.PI, Math.PI * 2, false);
        aba.lineTo(x0 + passo, 0);
        aba.closePath();
        const abaGeo = new THREE.ShapeGeometry(aba, 8);
        abaGeo.translate(0, Y1, Z1 + 0.004);
        q.add(new THREE.Mesh(abaGeo, cor));
      }
      chanfro(q, L + 0.08, 0.13, 0.14, ferro, cx, Y0 + 0.065, 0.05, 0.03);
      const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, L + 0.04, 8).rotateZ(Math.PI / 2), ferro);
      barra.position.set(cx, Y1 + 0.005, Z1 - 0.01);
      q.add(barra);
      for (const s of [-1, 1] as const) {
        const x = cx + s * (L / 2 - 0.1);
        const curva = new THREE.QuadraticBezierCurve3(v3(x, 2.72, 0.06), v3(x, 3.02, 0.52), v3(x, Y1 - 0.01, Z1 - 0.03));
        peca(q, new THREE.TubeGeometry(curva, 12, 0.017, 6, false), ferro);
        chanfro(q, 0.08, 0.12, 0.03, ferro, x, 2.72, 0.055, 0.01);
      }
    };

    /** uma mesinha do salão, vista pela janela: toalha vermelha, dois pratos e duas cadeiras */
    const mesaDeDentro = (x: number, z: number): void => {
      const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.72, 8), moveis);
      pe.position.set(x, BASE + 0.38, z);
      g.add(pe);
      const pano = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.3, 14), toalha);
      pano.position.set(x, BASE + 0.62, z);
      g.add(pano);
      for (const s of [-1, 1] as const) {
        const prato = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.03, 12), louca);
        prato.position.set(x + s * 0.18, BASE + 0.785, z + 0.05 * s);
        g.add(prato);
        // a cadeira: assento, encosto e os pés de trás
        caixa(g, 0.4, 0.06, 0.38, moveis, x + s * 0.62, BASE + 0.45, z);
        caixa(g, 0.05, 0.46, 0.36, moveis, x + s * 0.8, BASE + 0.73, z);
        for (const dz of [-0.15, 0.15]) {
          caixa(g, 0.05, 0.42, 0.05, moveis, x + s * 0.46, BASE + 0.21, z + dz);
          caixa(g, 0.05, 0.5, 0.05, moveis, x + s * 0.79, BASE + 0.25, z + dz);
        }
      }
      // a luz quente do lustre: na toalha e no chão em volta
      const naMesa = pocaDeLuz(0.6, P.luzDeAbajur, 0.34);
      naMesa.position.set(x, BASE + 0.79, z);
      g.add(naMesa);
      const noChao = pocaDeLuz(1.25, P.luzDeAbajur, 0.26);
      noChao.position.set(x, BASE + 0.035, z + 0.2);
      g.add(noChao);
    };

    for (const cx of XS_JANELA) {
      const q = FRENTE;
      // o caixilho: o aro, a travessa da bandeira, o montante e os pinázios
      const aro = retangulo(new THREE.Shape(), cx - JAN - 0.01, J0 - 0.01, cx + JAN + 0.01, J1 + 0.01);
      aro.holes.push(retangulo(new THREE.Path(), cx - JAN + 0.07, J0 + 0.07, cx + JAN - 0.07, J1 - 0.07));
      peca(q, extrudar(aro, 0.06, -0.13), esquadria);
      caixa(q, 2 * JAN - 0.12, 0.06, 0.05, esquadria, cx, JB, -0.1);
      // o montante é 5 mm mais raso que a travessa: com a mesma frente, as
      // duas dividiriam plano onde ele entra nela
      caixa(q, 0.06, JB - J0 - 0.08, 0.045, esquadria, cx, (J0 + 0.06 + JB - 0.02) / 2, -0.1);
      for (const s of [-1, 1] as const) {
        caixa(q, JAN - 0.08, 0.04, 0.035, esquadria, cx + (s * (JAN - 0.04)) / 2, (J0 + JB) / 2, -0.1);
        caixa(q, 0.04, J1 - JB - 0.08, 0.035, esquadria, cx + (s * (2 * JAN - 0.14)) / 6, (JB + J1) / 2, -0.1);
      }
      guardarVidro(q, new THREE.PlaneGeometry(2 * JAN - 0.12, J1 - J0 - 0.12), cx, (J0 + J1) / 2, -0.1);
      // por fora: o alizar, o peitoril, as mísulas, a floreira e o toldo
      peca(q, extrudar(moldeReto(cx, J0, J1, JAN, 0.1), 0.04, 0), faixa);
      // o peitoril e o toldo param antes do vizinho: as janelas do mesmo lado
      // da porta ficam a 35 cm uma da outra, e peitoril (ou caixa de toldo)
      // passando disso encostava no do lado, face com face
      chanfro(q, 2 * JAN + 0.3, 0.07, 0.26, pedra, cx, J0 - 0.025, 0.07, 0.02);
      for (const s of [-1, 1] as const) misula(q, cx + s * (JAN + 0.07), J0 - 0.06);
      floreira(q, cx, J0 + 0.01, 2 * JAN + 0.1);
      toldo(q, cx, 2 * JAN + 0.2);
      // e o salão lá dentro, na frente desta janela
      mesaDeDentro(cx, HZ - 1.3);
    }

    // ================================================================ A PORTA
    {
      const q = FRENTE;
      // o marco: ombreiras, a travessa da bandeira e o arco
      for (const s of [-1, 1] as const) caixa(q, 0.08, PY - BASE, 0.12, esquadria, s * (PORTA - 0.03), (BASE + PY) / 2, -0.12);
      // a travessa para 5 mm antes do lado de fora das ombreiras: com a
      // mesma ponta, as duas dividiriam o plano de fora (dentro do reboco,
      // mas é briga do mesmo jeito)
      caixa(q, 2 * PORTA + 0.01, 0.09, 0.13, esquadria, 0, PY, -0.12);
      peca(q, extrudar(moldeEmArco(0, PY, PY, PORTA - 0.07, ARCO - 0.07, PORTA + 0.01, ARCO + 0.01), 0.12, -0.18), esquadria);
      // a bandeira em leque: o vidro, três raios e o cubo
      const leque = new THREE.Shape();
      leque.moveTo(-(PORTA - 0.06), PY);
      leque.absellipse(0, PY, PORTA - 0.06, ARCO - 0.06, Math.PI, 0, true, 0);
      leque.closePath();
      guardarVidro(q, new THREE.ShapeGeometry(leque, 16), 0, 0, -0.12);
      for (let k = 1; k <= 3; k++) {
        const ang = (k * Math.PI) / 4;
        const px = Math.cos(ang) * (PORTA - 0.07);
        const py = Math.sin(ang) * (ARCO - 0.07);
        const comp = Math.hypot(px, py);
        const raio = caixa(q, 0.03, comp, 0.03, esquadria, px / 2, PY + py / 2, -0.115);
        raio.rotation.z = Math.atan2(py, px) - Math.PI / 2;
      }
      const cubo = new THREE.Shape();
      cubo.moveTo(-0.13, PY);
      cubo.absarc(0, PY, 0.13, Math.PI, 0, true);
      cubo.closePath();
      peca(q, extrudar(cubo, 0.05, -0.145), esquadria);

      /*
       * AS FOLHAS: montante por fora, travessas entre eles (em cima, no meio
       * e o rodapé alto), a ALMOFADA embaixo — um quadro rebaixado com o miolo
       * saltado — e o vidro de seis panos em cima. O puxador é de latão.
       */
      const y0 = BASE + 0.04;
      const y1 = PY - 0.045;
      const yMeio = 1.32;
      for (const s of [-1, 1] as const) {
        const lf = PORTA - 0.07 - 0.004;
        const fx = s * (lf / 2 + 0.002);
        for (const m of [-1, 1] as const) caixa(q, 0.09, y1 - y0, 0.05, esquadria, fx + m * (lf / 2 - 0.045), (y0 + y1) / 2, -0.12);
        caixa(q, lf - 0.18, 0.09, 0.045, esquadria, fx, y1 - 0.045, -0.12);
        caixa(q, lf - 0.18, 0.1, 0.045, esquadria, fx, yMeio, -0.12);
        caixa(q, lf - 0.18, 0.2, 0.045, esquadria, fx, y0 + 0.1, -0.12);
        // a almofada: o fundo rebaixado e o miolo saltado
        const a0 = y0 + 0.2;
        const a1 = yMeio - 0.05;
        caixa(q, lf - 0.17, a1 - a0 + 0.01, 0.025, esquadria, fx, (a0 + a1) / 2, -0.125);
        chanfro(q, lf - 0.36, a1 - a0 - 0.18, 0.04, esquadria, fx, (a0 + a1) / 2, -0.11, 0.015);
        // o vidro de cima, com os pinázios em cruz
        const v0 = yMeio + 0.05;
        const v1 = y1 - 0.09;
        guardarVidro(q, new THREE.PlaneGeometry(lf - 0.16, v1 - v0), fx, (v0 + v1) / 2, -0.12);
        caixa(q, 0.03, v1 - v0 + 0.01, 0.03, esquadria, fx, (v0 + v1) / 2, -0.115);
        for (const f of [1 / 3, 2 / 3]) caixa(q, lf - 0.17, 0.03, 0.024, esquadria, fx, v0 + (v1 - v0) * f, -0.115);
        // o puxador de barra, com os dois pezinhos
        const px = s * 0.1;
        const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.7, 8), latao);
        barra.position.set(px, 1.32, -0.035);
        q.add(barra);
        for (const yy of [1.05, 1.59]) {
          const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.06, 6).rotateX(Math.PI / 2), latao);
          pe.position.set(px, yy, -0.06);
          q.add(pe);
        }
      }

      // o ARCO DE TIJOLO em volta do vão inteiro e a pedra-chave
      peca(q, extrudar(moldeEmArco(0, BASE, PY, PORTA, ARCO, PORTA + 0.16, ARCO + 0.16), 0.05, 0), tijolo);
      const chave = new THREE.Shape();
      chave.moveTo(-0.1, PY + ARCO - 0.03);
      chave.lineTo(0.1, PY + ARCO - 0.03);
      chave.lineTo(0.15, PY + ARCO + 0.23);
      chave.lineTo(-0.15, PY + ARCO + 0.23);
      chave.closePath();
      peca(q, extrudar(chave, 0.08, 0), pedra);

      // a soleira, o patamar, o degrau e o capacho
      caixa(q, 2 * PORTA + 0.04, 0.05, ESP + 0.04, pedra, 0, BASE, -ESP / 2);
      chanfro(q, 2.9, BASE, 0.46, pedra, 0, BASE / 2, 0.23, 0.03);
      chanfro(q, 3.3, 0.15, 0.42, pedra, 0, 0.075, 0.66, 0.03);
      caixa(q, 1.4, 0.02, 0.32, toon(P.roupaLaBarra, { mapa: desenhoDeTapete(1.4, 0.32, 'capacho') }), 0, BASE + 0.008, 0.22);

      /*
       * OS DOIS LAMPIÕES, entre o arco e a primeira janela: a chapa, o braço
       * em curva, a gaiola de ferro com o vidro aceso e o chapéu. O halo
       * macio em volta é luz pintada (sprite), sem luz de verdade.
       *
       * Eles ficam BAIXOS (2,05, logo acima da cabeça de quem passa) por
       * causa do toldo da direita: a 2,4 o da direita caía inteiro dentro da
       * sombra que o toldo projeta na fachada, vista da câmera.
       */
      for (const s of [-1, 1] as const) {
        const x = s * 1.42;
        chanfro(q, 0.12, 0.26, 0.03, ferro, x, 1.9, 0.015, 0.01);
        tubo(q, [v3(x, 1.82, 0.03), v3(x, 1.94, 0.14), v3(x, 2.1, 0.2), v3(x, 2.24, 0.22)], 0.016, ferro);
        const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.22, 0.15), luz);
        corpo.position.set(x, 2.05, 0.24);
        q.add(corpo);
        for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
          caixa(q, 0.024, 0.25, 0.024, ferro, x + dx * 0.076, 2.05, 0.24 + dz * 0.076);
        }
        caixa(q, 0.2, 0.03, 0.2, ferro, x, 1.925, 0.24);
        const chapeu = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.13, 4).rotateY(Math.PI / 4), ferro);
        chapeu.position.set(x, 2.23, 0.24);
        q.add(chapeu);
        const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), ferro);
        ponta.position.set(x, 2.31, 0.24);
        q.add(ponta);
        const halo = haloDeLampada(0.75, P.luzDoPortao, 0.45);
        halo.position.set(x, 2.05, 0.26);
        q.add(halo);
      }
    }

    // ================================================================ LETREIRO
    /*
     * O LETREIRO, entre o arco da porta e a linha que o beiral tapa: a tábua
     * escura de quina macia, o filete de latão por dentro da borda e o nome.
     * Em cima, as três LUMINÁRIAS PESCOÇO-DE-GANSO, cada uma com o leque de
     * luz pintado na tábua — a placa "acesa" sem nenhuma luz de verdade.
     */
    {
      const q = FRENTE;
      const W = 3.9;
      const H = 0.6;
      const yc = 3.92;
      chanfro(q, W, H, 0.12, tabua, 0, yc, 0.07, 0.04);
      const filete = retangulo(new THREE.Shape(), -W / 2 + 0.07, yc - H / 2 + 0.07, W / 2 - 0.07, yc + H / 2 - 0.07);
      filete.holes.push(retangulo(new THREE.Path(), -W / 2 + 0.1, yc - H / 2 + 0.1, W / 2 - 0.1, yc + H / 2 - 0.1));
      peca(q, extrudar(filete, 0.012, 0.13), latao);
      const nome = letreiroDoMania(opts.nome ?? 'Mania de Churrasco', W - 0.3, H - 0.18);
      nome.position.set(0, yc, 0.146);
      q.add(nome);
      for (const x of [-1.3, 0, 1.3]) {
        chanfro(q, 0.1, 0.1, 0.03, ferro, x, 4.52, 0.015, 0.01);
        tubo(q, [v3(x, 4.52, 0.03), v3(x, 4.62, 0.2), v3(x, 4.6, 0.38), v3(x, 4.5, 0.46)], 0.014, ferro);
        // a cúpula aberta embaixo, inclinada para a tábua
        const cupula = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.12, 12, 1, true), ferroDosDoisLados);
        cupula.rotation.x = 0.55;
        cupula.position.set(x, 4.45, 0.47);
        q.add(cupula);
        const lampada = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), luz);
        lampada.position.set(x, 4.4, 0.45);
        q.add(lampada);
        const leque = pocaDeLuz(0.62, P.luzDoPortao, 0.24, true);
        leque.position.set(x, 4.0, 0.15);
        q.add(leque);
      }
    }

    // ================================================================ LADOS E FUNDOS
    /**
     * A JANELA DE VENEZIANA fechada (a da lojinha, no teal do clube): alizar
     * em U, peitoril de pedra, cornijinha em cima e as duas folhas com as
     * palhetas inclinadas — um lote só para a casa inteira. Ela não fura a
     * parede: fechada, não há o que ver atrás dela.
     */
    const janelaFechada = (q: THREE.Group, cx: number, y0: number, largura: number, altura: number): void => {
      const meia = largura / 2;
      peca(q, extrudar(moldeReto(cx, y0, y0 + altura, meia, 0.1), 0.03, 0), faixa);
      chanfro(q, largura + 0.36, 0.07, 0.18, pedra, cx, y0 - 0.025, 0.07);
      chanfro(q, largura + 0.34, 0.08, 0.12, pedra, cx, y0 + altura + 0.14, 0.04);
      for (const lado of [-1, 1] as const) {
        const lf = meia - 0.004;
        const fx = cx + lado * (lf / 2 + 0.002);
        caixa(q, lf - 0.08, altura - 0.1, 0.01, escuro, fx, y0 + altura / 2, 0.012);
        for (const s of [-1, 1] as const) caixa(q, 0.06, altura, 0.045, veneziana, fx + s * (lf / 2 - 0.03), y0 + altura / 2, 0.0275);
        for (const yy of [y0 + 0.04, y0 + altura / 2, y0 + altura - 0.04]) {
          caixa(q, lf - 0.12, yy === y0 + altura / 2 ? 0.06 : 0.08, 0.04, veneziana, fx, yy, 0.025);
        }
        for (const [a, b] of [[y0 + 0.1, y0 + altura / 2 - 0.05], [y0 + altura / 2 + 0.05, y0 + altura - 0.1]] as const) {
          const n = Math.floor((b - a) / 0.075);
          for (let k = 0; k <= n; k++) {
            palhetas.por(q, v3(fx, a + ((b - a) * k) / n, 0.026), giro(-0.6, 0, 0), v3(lf - 0.12, 0.012, 0.068));
          }
        }
        for (const yy of [y0 + 0.25, y0 + altura - 0.25]) {
          caixa(q, 0.05, 0.08, 0.02, ferro, cx + lado * (meia - 0.005), yy, 0.055);
        }
      }
    };
    janelaFechada(DIREITA, -1.6, 1.4, 1.1, 1.55);
    janelaFechada(DIREITA, 0.7, 1.4, 1.1, 1.55);
    janelaFechada(ESQUERDA, -1.4, 1.4, 1.1, 1.55);
    janelaFechada(ESQUERDA, 1.4, 1.4, 1.1, 1.55);
    janelaFechada(FUNDOS, 4.9, 1.4, 1.1, 1.55);

    /*
     * O CONDENSADOR DO AR, na lateral que a câmera vê, pendurado alto nas
     * mãos-francesas (fora do alcance de quem passa): a caixa branca, a grade
     * redonda da hélice e o cano que entra na parede.
     */
    {
      const q = DIREITA;
      const x = 2.45;
      const y = 3.05;
      chanfro(q, 0.86, 0.6, 0.36, metalClaro, x, y, 0.24, 0.03);
      const grade = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.018, 6, 20), metal);
      grade.position.set(x - 0.12, y, 0.425);
      q.add(grade);
      const helice = new THREE.Mesh(new THREE.CircleGeometry(0.19, 16), metal);
      helice.position.set(x - 0.12, y, 0.418);
      q.add(helice);
      for (let k = -2; k <= 2; k++) caixa(q, 0.012, 0.36, 0.012, ferro, x - 0.12 + k * 0.075, y, 0.43);
      for (let k = 0; k < 3; k++) caixa(q, 0.16, 0.012, 0.02, metal, x + 0.27, y - 0.12 + k * 0.12, 0.42);
      for (const s of [-1, 1] as const) {
        caixa(q, 0.05, 0.05, 0.46, ferro, x + s * 0.32, y - 0.325, 0.23);
        tubo(q, [v3(x + s * 0.32, y - 0.32, 0.43), v3(x + s * 0.32, y - 0.5, 0.2), v3(x + s * 0.32, y - 0.58, 0.02)], 0.016, ferro);
      }
      tubo(q, [v3(x - 0.43, y - 0.18, 0.2), v3(x - 0.58, y - 0.2, 0.16), v3(x - 0.62, y - 0.2, 0.02)], 0.02, metal);
    }

    /*
     * NOS FUNDOS, o que todo restaurante tem e ninguém vê: o ABRIGO DE GÁS
     * (o caixote de concreto com a grade de ferro e os dois botijões) e a
     * LENHA da churrasqueira empilhada debaixo de um telhadinho. Tudo dentro
     * do colisor do prédio, que passa 90 cm da parede. As duas caixas e a
     * lixeira que a cena põe na porta de serviço ficam em `x` −0,5 a −0,85 e
     * −4,6 deste quadro: a lenha e o abrigo moram do outro lado.
     */
    {
      const q = FUNDOS;
      // o abrigo de gás
      const ax = 3.2;
      const larg = 1.2;
      const alto = 1.15;
      const prof = 0.6;
      caixa(q, larg, 0.1, prof, pedra, ax, alto - 0.05, prof / 2 + 0.01);
      caixa(q, larg + 0.08, 0.06, prof + 0.06, pedra, ax, alto + 0.03, prof / 2 + 0.02);
      for (const s of [-1, 1] as const) caixa(q, 0.08, alto - 0.1, prof - 0.02, pedra, ax + s * (larg / 2 - 0.04), (alto - 0.1) / 2, prof / 2 + 0.01);
      caixa(q, larg - 0.16, 0.06, prof - 0.04, pedra, ax, 0.03, prof / 2);
      caixa(q, larg - 0.16, alto - 0.16, 0.02, escuro, ax, (alto - 0.1) / 2 + 0.03, 0.03);
      const botijao = toon(P.restauranteBotijao);
      for (const s of [-1, 1] as const) {
        const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.5, 4, 12), botijao);
        corpo.position.set(ax + s * 0.25, 0.43, 0.28);
        q.add(corpo);
        const valvula = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 8), latao);
        valvula.position.set(ax + s * 0.25, 0.88, 0.28);
        q.add(valvula);
      }
      // a grade: o quadro e as barras em pé
      const gz = prof + 0.02;
      // as travessas morrem dentro dos montantes, que são 6 mm mais fundos
      for (const yy of [0.08, alto - 0.13]) caixa(q, larg - 0.2, 0.04, 0.03, ferro, ax, yy, gz);
      for (const s of [-1, 1] as const) caixa(q, 0.04, alto - 0.18, 0.036, ferro, ax + s * (larg / 2 - 0.11), (alto - 0.05) / 2, gz);
      for (let k = 1; k < 8; k++) caixa(q, 0.018, alto - 0.24, 0.018, ferro, ax - (larg - 0.22) / 2 + ((larg - 0.22) * k) / 8, (alto - 0.05) / 2, gz);

      // a lenha, em pilha, debaixo de um telhadinho de tábua
      const lx = 1.4;
      const lz = 0.32;
      let n = 0;
      for (let fila = 0; fila < 4; fila++) {
        const quantas = 5 - fila;
        for (let i = 0; i < quantas; i++) {
          const r = 0.065 + rnd() * 0.015;
          const x = lx - ((quantas - 1) * 0.15) / 2 + i * 0.15 + (rnd() - 0.5) * 0.02;
          const y = 0.075 + fila * 0.125;
          const cor = [P.woodDark, P.restauranteEsquadria, P.wood][n++ % 3];
          toras.por(q, v3(x, y, lz), giro(Math.PI / 2, 0, (rnd() - 0.5) * 0.12), v3(r, 0.5 + rnd() * 0.08, r), cor);
        }
      }
      for (const s of [-1, 1] as const) caixa(q, 0.06, 0.95, 0.06, esquadria, lx + s * 0.44, 0.475, lz + 0.22);
      const telhadinho = caixa(q, 1.05, 0.04, 0.7, esquadria, lx, 0.98, lz);
      telhadinho.rotation.x = 0.18;
    }

    /*
     * O ÓCULO das empenas: o anel de tijolo, o fundo escuro e três palhetas
     * de madeira — é o respiro do sótão, e o que quebra o triângulo liso.
     */
    for (const q of [DIREITA, ESQUERDA]) {
      const y = Y_PAREDE + 0.62;
      const anel = new THREE.Shape();
      anel.absarc(0, y, 0.36, 0, Math.PI * 2, false);
      const furo = new THREE.Path();
      furo.absarc(0, y, 0.25, 0, Math.PI * 2, true);
      anel.holes.push(furo);
      peca(q, extrudar(anel, 0.06, 0, 24), tijolo);
      const fundo = new THREE.Mesh(new THREE.CircleGeometry(0.26, 20), escuro);
      fundo.position.set(0, y, 0.018);
      q.add(fundo);
      for (const dy of [-0.12, 0, 0.12]) {
        const ripa = caixa(q, 0.46 - Math.abs(dy) * 1.6, 0.05, 0.03, esquadria, 0, y + dy, 0.04);
        ripa.rotation.x = -0.5;
      }
    }

    // ================================================================ TELHADO
    /*
     * AS DUAS ÁGUAS de telha colonial (`aguaDeTelhas`), giradas na
     * inclinação: `rotateX(+i)` leva o "descendo" da água (`+z`) para baixo e
     * para a frente. A de trás é a mesma, virada meia volta.
     */
    const meiaDoTelhado = HX + OITAO;
    for (const lado of [1, -1] as const) {
      const geo = aguaDeTelhas(meiaDoTelhado, AGUA);
      geo.rotateX(INCLINACAO);
      if (lado < 0) geo.rotateY(Math.PI);
      geo.translate(0, Y_CUMEEIRA, 0);
      peca(g, geo, telha);
    }
    /*
     * A CUMEEIRA: telhas de capa, cada uma um tronco de cone deitado que
     * engole a ponta da seguinte. Ela assenta 6 cm acima do encontro das
     * águas, que é onde as duas primeiras fiadas param.
     */
    {
      const n = Math.round((2 * meiaDoTelhado) / 0.42);
      const passo = (2 * meiaDoTelhado) / n;
      for (let i = 0; i < n; i++) {
        const capa = new THREE.CylinderGeometry(0.15, 0.17, passo + 0.05, 10, 1, false);
        capa.rotateZ(Math.PI / 2);
        peca(g, capa, telha, -meiaDoTelhado + passo * (i + 0.5), Y_CUMEEIRA + 0.07, 0);
      }
    }
    // a TESTEIRA: a tábua que fecha as pontas das fiadas, nas duas empenas
    for (const sx of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        const tabuaDaTesta = caixa(g, 0.05, 0.24, AGUA + 0.04, esquadria, 0, 0, 0);
        const meioDaAgua = AGUA / 2;
        tabuaDaTesta.position.set(
          sx * (meiaDoTelhado + 0.03),
          Y_CUMEEIRA - Math.sin(INCLINACAO) * meioDaAgua + 0.02,
          sz * Math.cos(INCLINACAO) * meioDaAgua,
        );
        tabuaDaTesta.rotation.x = sz * INCLINACAO;
      }
    }
    // a testeira do BEIRAL, debaixo da última fiada, na frente e nos fundos
    {
      const yPonta = Y_APOIO - BEIRAL * Math.tan(INCLINACAO);
      for (const s of [-1, 1] as const) {
        caixa(g, 2 * meiaDoTelhado + 0.1, 0.16, 0.05, esquadria, 0, yPonta - 0.07, s * (HZ + BEIRAL * 0.98));
      }
    }

    /*
     * A CHAMINÉ DA CHURRASQUEIRA, na água de trás: o corpo de tijolo, a
     * cinta de pedra um palmo abaixo do topo, a coroa e a boca escura, de
     * onde a fumaça sobe (ver `update`). Sem chapéu: a fumaça saindo reta da
     * boca é o que se lê de longe, e um chapéu em cima dela a cortaria.
     */
    {
      const x = HX - 2.4;
      const z = -1.3;
      const topo = 7.5;
      const base = Y_CUMEEIRA + z * Math.tan(INCLINACAO) - 0.4;
      caixa(g, 0.74, topo - base, 0.74, tijolo, x, (base + topo) / 2, z);
      chanfro(g, 0.84, 0.1, 0.84, pedra, x, topo - 0.32, z, 0.02);
      chanfro(g, 0.9, 0.12, 0.9, pedra, x, topo + 0.04, z, 0.02);
      caixa(g, 0.48, 0.04, 0.48, ferro, x, topo + 0.105, z);
      this.bocaDaChamine.set(x, topo + 0.12, z);
    }

    /*
     * O EXAUSTOR EÓLICO da cozinha, na água de trás: o cano, o rufo em volta
     * e a cabeça de aletas que gira com o vento. A cabeça é um grupo com NOME
     * (`eolico`): a `fundir()` junta as aletas lá dentro, e ele continua
     * girando inteiro.
     */
    {
      const x = -HX + 3.2;
      const z = -0.95;
      const yTelha = Y_CUMEEIRA + z * Math.tan(INCLINACAO);
      const cano = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.85, 12), metal);
      cano.position.set(x, yTelha + 0.3, z);
      g.add(cano);
      // o rufo deita junto com a água, senão uma borda dele boia acima das telhas
      const rufo = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 0.14, 12), metal);
      rufo.rotation.x = -INCLINACAO;
      rufo.position.set(x, yTelha + 0.1, z);
      g.add(rufo);
      const cabeca = new THREE.Group();
      cabeca.name = 'eolico';
      cabeca.position.set(x, yTelha + 0.72, z);
      g.add(cabeca);
      const perfil = [
        [0.0, 0.0], [0.17, 0.0], [0.2, 0.04], [0.24, 0.16], [0.22, 0.28], [0.14, 0.38], [0.04, 0.42], [0.0, 0.42],
      ].map(([r, y]) => new THREE.Vector2(r, y));
      const bulbo = new THREE.Mesh(new THREE.LatheGeometry(perfil, 14), metal);
      cabeca.add(bulbo);
      // as aletas: fitas que sobem pela barriga torcendo
      const ALETAS = 12;
      for (let k = 0; k < ALETAS; k++) {
        const a0 = (k / ALETAS) * Math.PI * 2;
        const pontos = perfil.slice(1, 7).map(([r, y], i) => {
          const a = a0 + i * 0.12;
          return v3(Math.cos(a) * (r + 0.015), y, Math.sin(a) * (r + 0.015));
        });
        const aleta = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), 10, 0.014, 4, false), metalClaro,
        );
        cabeca.add(aleta);
      }
      const pino = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), metalClaro);
      pino.position.y = 0.43;
      cabeca.add(pino);
      this.eolico = cabeca;
    }

    // ================================================================ FIM
    flores.montar(g);
    miolos.montar(g);
    folhas.montar(g);
    palhetas.montar(g);
    toras.montar(g);
    /*
     * O VIDRO DA CASA INTEIRA NUMA MALHA SÓ (transparente não entra na
     * `fundir()`), pintado DEPOIS da luz do salão: o vidro grava
     * profundidade, e pintado antes ele apagaria a poça de luz atrás dele.
     */
    const todoVidro = new THREE.Mesh(mergeGeometries(vidros), vidro);
    todoVidro.renderOrder = 4;
    // a etiqueta é para o `scripts/mania.mjs`: o vidro é transparente de
    // propósito, e o teste que guarda o prédio sólido não deve contar com ele
    todoVidro.userData.vidro = true;
    g.add(todoVidro);

    /*
     * A FUMAÇA: oito bolotas num `InstancedMesh` só. Ela não faz sombra
     * (`semSombra`, que o `w.add` respeita) e não é cortada pela câmera: as
     * bolotas andam, e a esfera envolvente seria a da primeira pose.
     */
    this.fumaca = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, 1), toon(P.restauranteFumaca, { opacity: 0.72 }), 8,
    );
    this.fumaca.userData.semSombra = true;
    this.fumaca.frustumCulled = false;
    g.add(this.fumaca);
    this.update(0);
  }

  /**
   * A fumaça sobe em fila: cada bolota tem a sua fase (`0` saindo da boca,
   * `1` sumindo lá em cima), nasce pequena, sobe reta, o vento deita a
   * coluna para o lado, ela cresce e encolhe até sumir. E o eólico gira.
   */
  update(dt: number): void {
    this.tempo += dt;
    this.eolico.rotation.y -= dt * 2.6;
    const n = this.fumaca.count;
    for (let i = 0; i < n; i++) {
      const fase = this.tempo * 0.14 + i / n;
      const p = fase % 1;
      // cada bolota que nasce ganha o seu jeito: o volume e para que lado ela
      // desvia. Sem isso a coluna sai uma fila de contas iguais
      const volta = Math.floor(fase) * n + i;
      const jeito = Math.sin(volta * 12.9898) * 43758.5453;
      const sorte = jeito - Math.floor(jeito);
      const nasce = THREE.MathUtils.smoothstep(p, 0, 0.1);
      const some = 1 - THREE.MathUtils.smoothstep(p, 0.68, 1);
      const r = (0.14 + 0.46 * p) * (0.8 + 0.4 * sorte) * nasce * some;
      // sobe reta no começo, e o vento vai deitando a coluna para o lado
      const desvio = (sorte - 0.5) * 0.5 * p;
      this.ponto.set(
        this.bocaDaChamine.x + 1.1 * p * p + desvio + Math.sin(this.tempo * 1.3 + i * 1.7) * 0.08 * p,
        this.bocaDaChamine.y + 0.1 + p * 2.9,
        this.bocaDaChamine.z - 0.4 * p * p - desvio * 0.6,
      );
      this.tamanho.set(r, r * 0.84, r);
      this.matriz.compose(this.ponto, this.semGiro, this.tamanho);
      this.fumaca.setMatrixAt(i, this.matriz);
    }
    this.fumaca.instanceMatrix.needsUpdate = true;
  }
}

// =====================================================================
// A ÁREA EXTERNA: a mesa, a cadeira, o ombrelone e o cavalete do cardápio
// =====================================================================

/**
 * As medidas que a CENA da mesa usa, e que por isso a peça nova manteve da
 * `mesaDePatio()` antiga: o prato pousa em `y = 0,78` no centro, cada um senta
 * a 1,02 do centro, e o assento tem o topo em 0,485 (é a altura em que a pose
 * de sentado encaixa).
 */
export const MESA_DO_RESTAURANTE = { tampo: 0.775, raioDaCadeira: 1.02, assento: 0.485 } as const;

/**
 * A CADEIRA DE BISTRÔ, de madeira escura com almofada no teal do clube: os
 * pés da frente afinando para baixo, os de trás subindo em curva até o
 * encosto, e as duas travessas do encosto CURVAS (um setor de anel
 * extrudado) — é a curva que diz "cadeira de café", e não caixote.
 *
 * Olha para `+Z`, com o centro do assento na origem.
 */
export function cadeiraDoRestaurante(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cadeira-do-restaurante';
  const madeira = toon(P.restauranteEsquadria, { mapa: veioDeMadeira() });
  const almofada = toon(P.restauranteToldo, { mapa: tramaDeTecido() });
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
    const m = new THREE.Mesh(uvEmMetrosPorTriangulo(geo), mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  const topo = MESA_DO_RESTAURANTE.assento;

  // o assento e a almofada, de quina macia
  add(quina(0.46, 0.05, 0.44, 0.015), madeira, 0, topo - 0.08, 0);
  add(quina(0.42, 0.065, 0.4, 0.03), almofada, 0, topo - 0.0325, 0.005);

  // os pés da frente: afinando para baixo, com a origem na ponta de baixo
  for (const s of [-1, 1] as const) {
    const pe = new THREE.CylinderGeometry(0.024, 0.017, topo - 0.1, 8);
    pe.translate(0, (topo - 0.1) / 2, 0);
    const m = add(pe, madeira, s * 0.19, 0, 0.17);
    m.rotation.set(0.04, 0, -s * 0.04);
  }
  /*
   * OS PÉS DE TRÁS SÃO O ENCOSTO: sobem do chão em curva, inclinando para
   * trás, até o alto da travessa de cima. O `z` deles em cada altura é a
   * linha `atras(y)`, e as travessas curvas se apoiam nela.
   */
  const atras = (y: number): number => -0.17 - 0.08 * Math.max(0, (y - topo + 0.1) / 0.5);
  for (const s of [-1, 1] as const) {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.19, 0, -0.15),
      new THREE.Vector3(s * 0.19, topo - 0.1, atras(topo - 0.1)),
      new THREE.Vector3(s * 0.195, 0.7, atras(0.7)),
      new THREE.Vector3(s * 0.2, 0.92, atras(0.92)),
    ]);
    add(new THREE.TubeGeometry(curva, 8, 0.021, 6, false), madeira);
  }
  /** uma travessa curva do encosto, de `y0` a `y1`, com as pontas nos pés de trás */
  const travessa = (y0: number, y1: number): void => {
    const R = 0.8;
    const meia = 0.21;
    const ang = Math.asin(meia / R);
    const forma = new THREE.Shape();
    forma.absarc(0, 0, R + 0.012, -Math.PI / 2 - ang, -Math.PI / 2 + ang, false);
    forma.absarc(0, 0, R - 0.012, -Math.PI / 2 + ang, -Math.PI / 2 - ang, true);
    forma.closePath();
    // o arco tem 30°: quatro divisões (o three dobra para oito) já fecham a curva
    const geo = new THREE.ExtrudeGeometry(forma, { depth: y1 - y0, bevelEnabled: false, curveSegments: 4 });
    // a forma nasce no plano XY; deitada, o `y` dela vira o `-z` do mundo
    geo.rotateX(Math.PI / 2);
    const yMeio = (y0 + y1) / 2;
    add(geo, madeira, 0, y1, atras(yMeio) + R * Math.cos(ang));
  };
  travessa(0.82, 0.92);
  travessa(0.62, 0.68);
  // as travessas de baixo, que amarram os pés
  for (const s of [-1, 1] as const) {
    const lado = new THREE.CylinderGeometry(0.011, 0.011, 0.33, 6).rotateX(Math.PI / 2);
    add(lado, madeira, s * 0.19, 0.16, 0.01);
  }
  add(new THREE.CylinderGeometry(0.011, 0.011, 0.38, 6).rotateZ(Math.PI / 2), madeira, 0, 0.2, -0.155);
  return g;
}

/**
 * A TOALHA XADREZ, jogada por cima do tampo redondo: o pano quadrado cai
 * pouco do lado das cadeiras (para não engolir o joelho de quem senta) e
 * desce nas QUATRO PONTAS, que ficam nas diagonais, entre uma cadeira e outra.
 * A barra tem dobras (uma onda em volta), mais fundas embaixo e sumindo na
 * quina do tampo.
 *
 * Duas malhas de UV diferente: o tampo com o UV no chão (`x`, `z`), para o
 * xadrez sair reto, e a saia com o UV desenrolado (o arco e a altura).
 */
function toalhaDaMesa(raio: number, topo: number): THREE.BufferGeometry[] {
  const NA = 56;
  const quedaNoLado = 0.11;
  const quedaNaPonta = 0.32;
  // o tampo (plano: um anel só do centro à borda) e a quina arredondada
  const aneis: Array<[number, number]> = [[0, topo], [raio, topo],
    [raio + 0.022, topo - 0.006], [raio + 0.036, topo - 0.02]];
  const malha = (pontos: (i: number, j: number) => [number, number, number, number, number], linhas: number): THREE.BufferGeometry => {
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    for (let j = 0; j <= linhas; j++) {
      for (let i = 0; i <= NA; i++) {
        const [x, y, z, u, v] = pontos(i, j);
        pos.push(x, y, z);
        uv.push(u, v);
      }
    }
    for (let j = 0; j < linhas; j++) {
      for (let i = 0; i < NA; i++) {
        const a = j * (NA + 1) + i;
        const b = a + 1;
        const c = a + NA + 1;
        const d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };
  const angulo = (i: number): number => (i / NA) * Math.PI * 2;
  const tampo = malha((i, j) => {
    const a = angulo(i);
    const [r, y] = aneis[j];
    const x = Math.sin(a) * r;
    const z = Math.cos(a) * r;
    return [x, y, z, x, z];
  }, aneis.length - 1);
  // a saia: da quina até a barra, abrindo e dobrando
  const LINHAS = 5;
  const [r0, y0] = aneis[aneis.length - 1];
  const saia = malha((i, j) => {
    const a = angulo(i);
    const t = j / LINHAS;
    // a ponta do pano: 1 nas diagonais, 0 de frente para as cadeiras
    const ponta = Math.pow(Math.abs(Math.sin(2 * a)), 3);
    const queda = quedaNoLado + (quedaNaPonta - quedaNoLado) * ponta;
    const dobra = 0.022 * Math.sin(a * 14) * t;
    const r = r0 + 0.01 * t + 0.07 * ponta * t * t + dobra;
    const y = y0 - queda * t;
    return [Math.sin(a) * r, y, Math.cos(a) * r, a * r0, y];
  }, LINHAS);
  return [tampo, saia];
}

/**
 * A MESA DO RESTAURANTE: pé torneado de madeira sobre a cruz de quatro pés,
 * tampo redondo com a toalha xadrez vermelha (a mesma do salão por dentro,
 * agora em vichy) e o porta-temperos na diagonal — longe do centro, que é
 * onde o garçom pousa o prato. E as quatro cadeiras de bistrô em volta.
 *
 * As medidas que a cena usa ficaram (ver `MESA_DO_RESTAURANTE`).
 */
export function mesaDoRestaurante(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-do-restaurante';
  const madeira = toon(P.restauranteEsquadria, { mapa: veioDeMadeira() });
  const pano = toon(0xffffff, { mapa: toalhaXadrez() });
  const { tampo: topo, raioDaCadeira } = MESA_DO_RESTAURANTE;
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
    const m = new THREE.Mesh(mat === madeira ? uvEmMetrosPorTriangulo(geo) : geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };

  // o pé torneado
  const perfil = [
    [0, 0.06], [0.075, 0.06], [0.08, 0.1], [0.058, 0.15], [0.046, 0.26], [0.042, 0.52],
    [0.05, 0.6], [0.075, 0.64], [0.1, 0.69], [0.1, 0.73], [0, 0.73],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.LatheGeometry(perfil, 12), madeira);
  // a cruz de pés, nas diagonais (entre as cadeiras)
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    const pe = add(quina(0.07, 0.07, 0.36, 0.02), madeira, Math.sin(a) * 0.17, 0.035, Math.cos(a) * 0.17);
    pe.rotation.y = a;
  }
  // o tampo de madeira, que a toalha cobre (só a borda de baixo aparece)
  add(new THREE.CylinderGeometry(0.6, 0.58, 0.045, 28), madeira, 0, topo - 0.0245, 0);
  // a toalha: o tampo 3 mm acima da madeira, e a saia
  for (const geo of toalhaDaMesa(0.6, topo + 0.003)) add(geo, pano);

  /*
   * O PORTA-TEMPEROS, na diagonal entre duas cadeiras: a bandejinha de
   * madeira com o ketchup, a mostarda e o azeite. É o detalhe que faz a mesa
   * ser de restaurante, e mora LONGE do centro, onde o prato pousa.
   */
  {
    const a = Math.PI / 4;
    const r = 0.4;
    const bandeja = new THREE.Group();
    bandeja.position.set(Math.sin(a) * r, topo + 0.003, Math.cos(a) * r);
    bandeja.rotation.y = a + Math.PI / 2;
    g.add(bandeja);
    const tabua = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.2, 0.025, 0.09, 0.008)), madeira);
    tabua.position.y = 0.0125;
    bandeja.add(tabua);
    // os três frascos e os três bicos são dois lotes (cor por cópia): seis
    // desenhos a menos por mesa, a mesma imagem
    const frascos = new Lote(new THREE.CylinderGeometry(0.02, 0.022, 0.1, 8), toon(0xffffff));
    const bicos = new Lote(new THREE.ConeGeometry(0.014, 0.035, 8), toon(0xffffff));
    [P.churrascoToalha, P.flowerYellow, P.leafMid].forEach((cor, i) => {
      const x = -0.06 + i * 0.06;
      frascos.por(null, new THREE.Vector3(x, 0.075, 0), new THREE.Quaternion(), 1, cor);
      bicos.por(null, new THREE.Vector3(x, 0.142, 0), new THREE.Quaternion(), 1, i === 2 ? P.gold : P.metalWhite);
    });
    frascos.montar(bandeja);
    bicos.montar(bandeja);
  }

  /*
   * As quatro cadeiras, olhando para o centro. Aqui elas perdem a etiqueta
   * de peça: com ela a `fundir()` as trataria como fronteira e juntaria cada
   * uma sozinha; sem ela, a madeira das quatro e a da mesa viram uma malha só.
   */
  for (let i = 0; i < 4; i++) {
    const cadeira = cadeiraDoRestaurante();
    delete cadeira.userData.peca;
    const a = (i * Math.PI) / 2;
    cadeira.position.set(Math.sin(a) * raioDaCadeira, 0, Math.cos(a) * raioDaCadeira);
    cadeira.rotation.y = a + Math.PI;
    g.add(cadeira);
  }
  return g;
}

/**
 * O OMBRELONE, de mercado: oito gomos de lona que EMBARRIGAM entre as
 * varetas (a mesma conta do toldo), teal e creme alternados, a aba recortada
 * em duas meias-luas por gomo, o mastro de madeira com a manivela e o
 * anel do corredor, e a base de pedra torneada.
 *
 * A lona fica em 2,2–2,62, a mesma faixa do guarda-sol antigo: ele já estava
 * longe das mesas onde se senta, e continua.
 */
export function ombrelone(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'ombrelone';
  const madeira = toon(P.restauranteEsquadria, { mapa: veioDeMadeira() });
  const lona = toon(P.restauranteToldo, { doubleSide: true });
  const lonaClara = toon(P.restauranteLona, { doubleSide: true });
  const pedra = toon(P.restaurantePedra);
  const ferro = toon(P.churrascoCarvao);

  const base = [
    [0, 0], [0.33, 0], [0.35, 0.03], [0.31, 0.08], [0.14, 0.12], [0.09, 0.17], [0, 0.17],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(base, 16), pedra));
  const mastro = new THREE.Mesh(uvEmMetrosPorTriangulo(new THREE.CylinderGeometry(0.034, 0.04, 2.5, 8)), madeira);
  mastro.position.y = 0.12 + 1.25;
  g.add(mastro);
  // a manivela e o anel do corredor
  const caixaDaManivela = new THREE.Mesh(quina(0.09, 0.14, 0.09, 0.015), ferro);
  caixaDaManivela.position.set(0, 1.25, 0);
  g.add(caixaDaManivela);
  const manivela = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.25, 0.05), new THREE.Vector3(0, 1.25, 0.13), new THREE.Vector3(0, 1.17, 0.15), new THREE.Vector3(0, 1.15, 0.2),
  ]), 8, 0.01, 5, false), ferro);
  g.add(manivela);
  const corredor = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 10), ferro);
  corredor.position.y = 2.02;
  g.add(corredor);

  // a lona: oito gomos entre as varetas
  const N = 8;
  const R = 1.3;
  const TOPO = 2.62;
  const QUEDA = 0.42;
  const SEG = 6;
  const LARGS = 4;
  const vareta = (k: number, t: number): THREE.Vector3 => {
    const a = (k / N) * Math.PI * 2 + Math.PI / N;
    return new THREE.Vector3(Math.sin(a) * R * t, TOPO - QUEDA * Math.pow(t, 1.25), Math.cos(a) * R * t);
  };
  for (let k = 0; k < N; k++) {
    const pos: number[] = [];
    const ponto = (u: number, t: number): number[] => {
      const p = vareta(k, t).lerp(vareta(k + 1, t), u);
      p.y -= 0.04 * Math.sin(Math.PI * u) * Math.sin(Math.PI * Math.min(1, t * 1.1));
      return [p.x, p.y, p.z];
    };
    for (let s = 0; s < SEG; s++) {
      for (let j = 0; j < LARGS; j++) {
        const a = ponto(j / LARGS, s / SEG);
        const b = ponto((j + 1) / LARGS, s / SEG);
        const c = ponto((j + 1) / LARGS, (s + 1) / SEG);
        const d = ponto(j / LARGS, (s + 1) / SEG);
        pos.push(...a, ...d, ...c, ...a, ...c, ...b);
      }
    }
    const gomo = new THREE.BufferGeometry();
    gomo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    gomo.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0), 2));
    gomo.computeVertexNormals();
    const cor = k % 2 === 0 ? lona : lonaClara;
    g.add(new THREE.Mesh(gomo, cor));
    // a aba: duas meias-luas penduradas na corda entre as duas varetas
    const p0 = vareta(k, 1);
    const p1 = vareta(k + 1, 1);
    const corda = p0.distanceTo(p1);
    const aba = new THREE.Shape();
    aba.moveTo(-corda / 2, 0);
    aba.lineTo(-corda / 2, -0.07);
    aba.absellipse(-corda / 4, -0.07, corda / 4, 0.06, Math.PI, Math.PI * 2, false, 0);
    aba.absellipse(corda / 4, -0.07, corda / 4, 0.06, Math.PI, Math.PI * 2, false, 0);
    aba.lineTo(corda / 2, 0);
    aba.closePath();
    const malhaDaAba = new THREE.Mesh(new THREE.ShapeGeometry(aba, 6), cor);
    malhaDaAba.position.copy(p0).lerp(p1, 0.5);
    malhaDaAba.rotation.y = Math.atan2(p1.x - p0.x, p1.z - p0.z) - Math.PI / 2;
    g.add(malhaDaAba);
    // a ponteira da vareta
    const ponteira = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 5), madeira);
    ponteira.position.copy(p0).add(new THREE.Vector3(0, -0.01, 0));
    g.add(ponteira);
  }
  // o pináculo
  const pinaculo = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), madeira);
  pinaculo.position.y = TOPO + 0.04;
  g.add(pinaculo);
  return g;
}

/** o giz do cavalete: o prato do dia em letra de giz, com o título dourado */
function lousaDoDia(largura: number, altura: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = Math.round((384 * altura) / largura);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const W = canvas.width;
    const H = canvas.height;
    const fonte = (px: number, negrito = false): string => `${negrito ? 'bold ' : ''}${px}px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffe9a8';
    ctx.font = fonte(Math.round(H * 0.1), true);
    ctx.fillText('Hoje', W / 2, H * 0.12);
    // o risquinho embaixo do título
    ctx.strokeStyle = 'rgba(255,233,168,0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W * 0.32, H * 0.2);
    ctx.quadraticCurveTo(W * 0.5, H * 0.17, W * 0.68, H * 0.2);
    ctx.stroke();
    const linhas = ['Picanha', 'na brasa', 'Arepa', 'recheada', 'Suco de', 'morango'];
    ctx.fillStyle = '#f4f1e6';
    linhas.forEach((linha, i) => {
      ctx.font = fonte(Math.round(H * (i % 2 ? 0.068 : 0.078)), i % 2 === 0);
      ctx.fillText(linha, W / 2, H * (0.3 + Math.floor(i / 2) * 0.22 + (i % 2) * 0.085));
    });
    // a chaminha de giz no pé
    ctx.fillStyle = 'rgba(255,170,90,0.9)';
    ctx.beginPath();
    ctx.moveTo(W / 2, H * 0.86);
    ctx.quadraticCurveTo(W / 2 + 16, H * 0.92, W / 2 + 8, H * 0.96);
    ctx.lineTo(W / 2 - 8, H * 0.96);
    ctx.quadraticCurveTo(W / 2 - 16, H * 0.92, W / 2, H * 0.86);
    ctx.fill();
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(largura, altura),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
}

/**
 * O CAVALETE DO CARDÁPIO, na porta: duas lousas em A, presas em cima pelas
 * dobradiças, com o prato do dia escrito a giz na da frente — o mesmo
 * "Hoje" da lousa do salão por dentro. Olha para `+Z`.
 */
export function cavaleteDeCardapio(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cavalete-de-cardapio';
  const madeira = toon(P.restauranteEsquadria, { mapa: veioDeMadeira() });
  const lousa = toon(P.churrascoQuadroNegro);
  const ferro = toon(P.churrascoCarvao);
  const ALTO = 1.02;
  const ABRE = 0.21;
  const LARG = 0.62;
  const inclinacao = Math.atan2(ABRE, ALTO);
  const comprimento = Math.hypot(ABRE, ALTO);
  for (const lado of [1, -1] as const) {
    // cada folha nasce em pé, com o topo na dobradiça, e gira para abrir
    const folha = new THREE.Group();
    folha.position.set(0, ALTO, 0);
    // a da frente (`lado = 1`) abre o pé para `+z` e deita a lousa para o céu
    folha.rotation.x = -lado * inclinacao;
    g.add(folha);
    const peca = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number): void => {
      const m = new THREE.Mesh(mat === madeira ? uvEmMetrosPorTriangulo(geo) : geo, mat);
      m.position.set(x, y, lado * z);
      folha.add(m);
    };
    for (const s of [-1, 1] as const) peca(quina(0.05, comprimento, 0.035, 0.01), madeira, s * (LARG / 2 - 0.025), -comprimento / 2, 0);
    peca(quina(LARG - 0.1, 0.06, 0.03, 0.008), madeira, 0, -0.04, 0);
    peca(quina(LARG - 0.1, 0.07, 0.03, 0.008), madeira, 0, -comprimento + 0.2, 0);
    peca(new THREE.BoxGeometry(LARG - 0.08, comprimento - 0.3, 0.015), lousa, 0, -0.07 - (comprimento - 0.3) / 2, 0);
    if (lado === 1) {
      const escrita = lousaDoDia(LARG - 0.14, comprimento - 0.36);
      escrita.position.set(0, -0.07 - (comprimento - 0.3) / 2, 0.012);
      folha.add(escrita);
    }
  }
  // as dobradiças e a correntinha que segura a abertura
  for (const s of [-1, 1] as const) {
    const dobradica = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.06, 8).rotateZ(Math.PI / 2), ferro);
    dobradica.position.set(s * 0.2, ALTO - 0.01, 0);
    g.add(dobradica);
  }
  const corrente = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 2 * ABRE * 0.55, 4).rotateX(Math.PI / 2), ferro);
  corrente.position.set(0, ALTO * 0.45, 0);
  g.add(corrente);
  return g;
}
