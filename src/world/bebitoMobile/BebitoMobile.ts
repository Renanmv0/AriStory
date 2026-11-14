import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { quina } from '../lojaDeRoupas';
import { haloDeLampada, pocaDeLuz } from '../furniture';
import { juntarPorCor } from '../fundir';
import { matelasse } from '../texturasDeCasa';
import { acabar } from '../acabamento';
import {
  CARRO, NO, PONTOS, geometriaDaPele, meiaLargura, naPonta, noDaCelula, noLado, olhandoPara, pele, porCima,
  regiaoDaCelula, zDaLargura, type NaPele,
} from './pele';
import {
  DEF_DAS_VAGAS, FICHA_DE_FABRICA, VAGAS_DO_CARRO, copiarFicha, type FichaDoBebitoMobile, type VagaDoCarro,
} from './ficha';
import { ADESIVOS, atlasDeImpressos, type AtlasDeImpressos } from './impressos';
import { PECAS_DO_CARRO, type Balanca } from './acessorios';

/*
 * O BEBITO MOBILE: o carro que o Renan dá de presente para o Ari
 * (`docs/BEBITO-MOBILE.md`). Uma vanzinha-bolha azul-céu de teto creme —
 * fofa por fora e ESPAÇOSA por dentro (o pedido dos dois: a cabine tem que
 * caber uma cena, para um dia a viagem poder ser vista de dentro).
 *
 * O carro é montado lendo uma FICHA (`ficha.ts`): a pintura, a placa e o
 * que vai em cada vaga. A edição ainda não existe; quando existir, ela
 * escreve outra ficha no save e o carro é montado de novo (`new BebitoMobile(ficha)`).
 *
 * COMO ELE É FEITO:
 *  - a LATARIA é a pele de fatias de `pele.ts` (planta de superelipse, perfil
 *    de lado e a fatia de cada `z`), partida em três malhas pela grade: a
 *    lataria (a cor da ficha), a capota (o teto e as colunas) e os vidros —
 *    transparentes de verdade, com a cabine por trás. O que é linha em cima
 *    dela (a borracha dos vidros, o cromo da cintura, o corte das portas) é
 *    um filete que segue a normal da lataria (`friso`), e não um tubo;
 *  - a CABINE existe: o assoalho, o forro das portas, o painel com o rádio e
 *    os relógios, o volante que gira, a alavanca na coluna, DOIS BANCOS
 *    INTEIRIÇOS de matelassê (atrás cabem três) e o tampão do porta-malas;
 *  - os ENCOSTOS DA FRENTE DEITAM (`deitarEncostos`): rentes aos assentos,
 *    eles fazem dos dois bancos uma cama só, com a âncora de deitar (`cama`);
 *  - o TETO SAI (`mostrarTeto(false)`), como o da barraca da clareira: tudo
 *    da cintura para cima mora no grupo `teto`, e o corte cai na cintura,
 *    que já é uma emenda (o friso de cromo). É a casinha de boneca para uma
 *    cena de dentro;
 *  - a carroceria balança em cima das rodas (três molas: sobe e desce, arfa e
 *    rola), o volante e as rodas da frente esterçam juntos, e o que é de
 *    pendurar balança mais quando o carro anda;
 *  - as RODAS são um lote (como as do ônibus), os impressos são um atlas, e
 *    as miudezas de cor lisa viram uma malha por grupo (`juntarPorCor`).
 *
 * O CONTRATO: a base em `y = 0`, o NARIZ no `+Z`, o meio em `x = 0`; o
 * MOTORISTA senta no `+X`. As medidas que a cena usa estão em `BEBITO_MOBILE`.
 * A cena passa o grupo pela `fundir()`: o que se mexe tem nome.
 */

const { A, W } = CARRO;

/**
 * O CARRO CRESCE 10%. A lataria é desenhada em metros de carro pequeno, e a
 * carroceria e as rodas crescem juntas no fim — a lição da barraca da
 * clareira: perto do corpo chibi (a cabeça tem 60 cm, e 75 com os cachos) o
 * carro do tamanho de verdade ficava de brinquedo, e os dois sentados na
 * frente encostavam a cabeça um no outro e no teto. Os lugares de sentar NÃO
 * crescem (quem senta fica do tamanho que tem).
 */
const ESCALA = 1.1;

/** a cabine por dentro */
const CABINE = {
  /** o piso e a altura do assento (o quadril de quem senta) */
  piso: 0.36,
  assento: 0.6,
  /**
   * OS DOIS BANCOS SÃO INTEIRIÇOS, da largura da cabine (o Renan pediu banco
   * de trás para levar mais gente, e os da frente deitando para virar cama):
   * o `z` do quadril de cada fileira e a meia distância entre os lugares. Na
   * frente sentam dois (e cabe um bicho pequeno no meio); atrás, três.
   */
  frente: { x: 0.47, z: 0.47 },
  tras: { x: 0.62, z: -0.72 },
  /** o banco: a meia largura, a fundura e a grossura do assento; a altura e a grossura do encosto, e quanto ele deita para trás em pé */
  banco: { meia: 0.93, fundo: 0.54, grosso: 0.17, encosto: 0.65, grossoDoEncosto: 0.15, inclinado: 0.14 },
  /** o painel: de onde a onde, e a altura do tampo */
  painel: { z0: 1.1, z1: 1.41, topo: 1.115 },
  /** o tampão do porta-malas (atrás do encosto de trás) */
  tampao: { y: 1.0, z0: -1.17 },
  /** a grossura da porta (a lataria até o forro) */
  forro: 0.045,
  volante: { y: 1.0, z: 0.94, raio: 0.2, deita: 0.42 },
  /** a meia largura livre entre as caixas de roda (a parede de dentro delas) */
  entreRodas: 0.67,
} as const;

/** a cama: os assentos dos dois bancos e, no meio, os encostos da frente deitados */
const CAMA = {
  /** de onde a onde, no comprimento (a beira da frente do banco da frente até o pé do encosto de trás) */
  z0: CABINE.tras.z - CABINE.banco.fundo / 2,
  z1: CABINE.frente.z + CABINE.banco.fundo / 2,
};

/** as medidas que a cena usa */
export const BEBITO_MOBILE = {
  escala: ESCALA,
  comprimento: A * 2 * ESCALA,
  largura: W * 2 * ESCALA,
  altura: (CARRO.teto + 0.04) * ESCALA,
  eixos: CARRO.eixos.map((z) => z * ESCALA),
  raioDaRoda: CARRO.roda.raio * ESCALA,
  /** o lado do motorista (carro brasileiro: `+X`, com o nariz no `+Z`) */
  ladoDoMotorista: 1 as const,
  /** a altura do assento e onde fica o quadril de cada lugar, no referencial do carro */
  assento: CABINE.assento * ESCALA,
  lugares: {
    motorista: { x: CABINE.frente.x * ESCALA, z: CABINE.frente.z * ESCALA },
    passageiro: { x: -CABINE.frente.x * ESCALA, z: CABINE.frente.z * ESCALA },
    /** entre os dois da frente: só cabe bicho pequeno (o Pelusa) */
    frenteMeio: { x: 0, z: CABINE.frente.z * ESCALA },
    trasEsquerda: { x: CABINE.tras.x * ESCALA, z: CABINE.tras.z * ESCALA },
    trasMeio: { x: 0, z: CABINE.tras.z * ESCALA },
    trasDireita: { x: -CABINE.tras.x * ESCALA, z: CABINE.tras.z * ESCALA },
  },
  /** a cama (com os encostos da frente deitados): o comprimento, a largura e a altura do colchão, no mundo */
  cama: {
    comprimento: (CAMA.z1 - CAMA.z0) * ESCALA,
    largura: CABINE.banco.meia * 2 * ESCALA,
    altura: CABINE.assento * ESCALA,
  },
} as const;

// ================================================================ ajudantes

const por = <T extends THREE.Object3D>(pai: THREE.Object3D, o: T, x = 0, y = 0, z = 0): T => {
  o.position.set(x, y, z);
  pai.add(o);
  return o;
};

/** uma peça pregada NA lataria: a origem no ponto, o `+Z` dela na normal */
function pregar<T extends THREE.Object3D>(pai: THREE.Object3D, o: T, em: NaPele, sobe = 0): T {
  o.position.copy(em.p).addScaledVector(em.n, sobe);
  o.quaternion.copy(olhandoPara(em.n));
  pai.add(o);
  return o;
}

/** um tubo pelos pontos (curva macia), aberto ou fechado */
function tubo(pts: THREE.Vector3[], raio: number, fechado = false, lados = 6, porPonto = 1.5): THREE.BufferGeometry {
  const limpos = pts.filter((p, i) => i === 0 || p.distanceToSquared(pts[i - 1]) > 1e-7);
  if (fechado && limpos.length > 2 && limpos[0].distanceToSquared(limpos[limpos.length - 1]) < 1e-7) limpos.pop();
  const curva = new THREE.CatmullRomCurve3(limpos, fechado, 'centripetal');
  return new THREE.TubeGeometry(curva, Math.max(3, Math.round(limpos.length * porPonto)), raio, lados, fechado);
}

/**
 * UM FRISO NA LATARIA: um filete (meia-cana) que segue uma linha de pontos da
 * pele, deitado nela. Cada ponto traz a NORMAL da lataria, e é ela que
 * orienta o filete — a largura é a mesma do começo ao fim, e ele não torce.
 *
 * Nasceu no lugar do tubo (`TubeGeometry`) das borrachas dos vidros: o tubo
 * gira o próprio corte ao longo da curva (o quadro de Frenet), e com poucos
 * lados isso aparecia como um traço que engrossa e afina; e a curva que passa
 * pelos pontos estufava nas quinas, cada uma de um jeito. O Renan viu: "as
 * janelas parecem desalinhadas, com um traço meio wobbly". Aqui as quinas
 * são arredondadas TODAS com o mesmo raio (`quina`), andando pela linha.
 */
function friso(linha: NaPele[], meia: number, alto: number, fechado: boolean, quina = 0, gomos = 4): THREE.BufferGeometry {
  let pts = linha.filter((q, i) => i === 0 || q.p.distanceToSquared(linha[i - 1].p) > 1e-7);
  if (fechado && pts.length > 2 && pts[0].p.distanceToSquared(pts[pts.length - 1].p) < 1e-7) pts = pts.slice(0, -1);
  if (fechado && quina > 0) pts = arredondarQuinas(pts, quina);
  const n = pts.length;
  // o corte: meia elipse, com as duas beiras 3 mm para dentro da lataria (sem fresta)
  const corte: Array<[number, number, number, number]> = [];
  for (let k = 0; k <= gomos; k++) {
    const a = Math.PI * (1 - k / gomos);
    const nb = Math.cos(a) / meia;
    const nn = Math.sin(a) / alto;
    const c = Math.hypot(nb, nn);
    corte.push([Math.cos(a) * meia, Math.sin(a) * alto - 0.003, nb / c, nn / c]);
  }
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const antes = pts[fechado ? (i - 1 + n) % n : Math.max(0, i - 1)].p;
    const depois = pts[fechado ? (i + 1) % n : Math.min(n - 1, i + 1)].p;
    T.subVectors(depois, antes).normalize();
    N.copy(pts[i].n).addScaledVector(T, -T.dot(pts[i].n)).normalize();
    B.crossVectors(T, N);
    for (const [b, h, nb, nn] of corte) {
      pos.push(pts[i].p.x + B.x * b + N.x * h, pts[i].p.y + B.y * b + N.y * h, pts[i].p.z + B.z * b + N.z * h);
      nor.push(B.x * nb + N.x * nn, B.y * nb + N.y * nn, B.z * nb + N.z * nn);
    }
  }
  const anel = gomos + 1;
  const trechos = fechado ? n : n - 1;
  for (let i = 0; i < trechos; i++) {
    const a0 = i * anel;
    const b0 = ((i + 1) % n) * anel;
    for (let k = 0; k < gomos; k++) idx.push(a0 + k, a0 + k + 1, b0 + k, b0 + k, a0 + k + 1, b0 + k + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setIndex(idx);
  return geo;
}

/**
 * Arredonda as quinas de um contorno FECHADO, todas com o mesmo raio: onde a
 * linha vira mais de ~35°, sai o que está a menos de `raio` da quina (andando
 * pela linha, e não em linha reta: perto das caixas de roda os pontos são
 * miúdos, e medir pelo vizinho dava um raio em cada quina) e entra um arco.
 */
function arredondarQuinas(pts: NaPele[], raio: number): NaPele[] {
  const n = pts.length;
  if (n < 4) return pts;
  const trecho = (i: number): number => pts[i].p.distanceTo(pts[(i + 1) % n].p);
  const rumo = (a: number, b: number): THREE.Vector3 => pts[b].p.clone().sub(pts[a].p).normalize();
  const quinas: number[] = [];
  for (let i = 0; i < n; i++) if (rumo((i - 1 + n) % n, i).dot(rumo(i, (i + 1) % n)) < Math.cos(0.6)) quinas.push(i);
  if (!quinas.length) return pts;
  /** o ponto a `d` da quina `i`, andando pela linha para a frente (+1) ou para trás (−1), e o último ponto por que passou */
  const andar = (i: number, sentido: 1 | -1, d: number): { em: NaPele; passou: number } => {
    let j = i;
    let resto = d;
    for (let guarda = 0; guarda < n; guarda++) {
      const prox = (j + sentido + n) % n;
      const comp = sentido > 0 ? trecho(j) : trecho(prox);
      if (comp >= resto) {
        const t = resto / comp;
        return { em: { p: pts[j].p.clone().lerp(pts[prox].p, t), n: pts[j].n.clone().lerp(pts[prox].n, t).normalize() }, passou: j };
      }
      resto -= comp;
      j = prox;
    }
    return { em: pts[i], passou: i };
  };
  /** a distância pela linha de uma quina à seguinte */
  const ate = (de: number, para: number): number => {
    let d = 0;
    for (let j = de; j !== para; j = (j + 1) % n) d += trecho(j);
    return d;
  };
  const fora: NaPele[] = [];
  quinas.forEach((c, k) => {
    const seguinte = quinas[(k + 1) % quinas.length];
    const anterior = quinas[(k - 1 + quinas.length) % quinas.length];
    const livre = quinas.length > 1 ? Math.min(ate(anterior, c), ate(c, seguinte)) : Infinity;
    const r = Math.min(raio, livre * 0.45);
    const entrada = andar(c, -1, r);
    const saida = andar(c, 1, r);
    // o arco: uma curva de três pontos, da entrada à saída, puxada pela quina
    for (let q = 0; q <= 5; q++) {
      const t = q / 5;
      const u = 1 - t;
      const p = entrada.em.p.clone().multiplyScalar(u * u).addScaledVector(pts[c].p, 2 * u * t).addScaledVector(saida.em.p, t * t);
      const nn = entrada.em.n.clone().multiplyScalar(u * u).addScaledVector(pts[c].n, 2 * u * t).addScaledVector(saida.em.n, t * t).normalize();
      fora.push({ p, n: nn });
    }
    // e o trecho reto até a entrada da quina seguinte
    const rSeguinte = Math.min(raio, (quinas.length > 1 ? Math.min(ate(c, seguinte), ate(seguinte, quinas[(k + 2) % quinas.length])) : Infinity) * 0.45);
    const fim = andar(seguinte, -1, rSeguinte).passou;
    // (o `passou` da saída é o ponto ANTES dela; o da entrada seguinte, o ponto DEPOIS dela)
    for (let j = (saida.passou + 1) % n, guarda = 0; j !== fim && guarda < n; j = (j + 1) % n, guarda++) fora.push(pts[j]);
  });
  return fora;
}

/** uma fita entre duas linhas de pontos, com a face virada para `cima` */
function fita(a: THREE.Vector3[], b: THREE.Vector3[], cima: THREE.Vector3): THREE.BufferGeometry {
  const pos: number[] = [];
  const poe = (...ps: THREE.Vector3[]): void => {
    for (const p of ps) pos.push(p.x, p.y, p.z);
  };
  const n = new THREE.Vector3();
  const u = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i < a.length - 1; i++) {
    n.crossVectors(u.subVectors(a[i + 1], a[i]), v.subVectors(b[i], a[i]));
    if (n.lengthSq() < 1e-14) n.crossVectors(u.subVectors(b[i + 1], b[i]), v.subVectors(b[i], a[i + 1]));
    if (n.dot(cima) >= 0) poe(a[i], a[i + 1], b[i], a[i + 1], b[i + 1], b[i]);
    else poe(a[i], b[i], a[i + 1], a[i + 1], b[i], b[i + 1]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

/** pinta a geometria inteira de uma cor (o atributo `color`), para várias virarem uma malha só */
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

/** a cúpula de uma lente (farol, lanterna): meia esfera achatada, olhando para `+Z` */
function lente(raio: number, barriga = 0.45): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(raio, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  geo.rotateX(Math.PI / 2);
  geo.scale(1, 1, barriga);
  return geo;
}

/** as miudezas de cor lisa de uma peça (e de cada grupo com nome dentro dela) viram uma malha por grupo */
function enxugar(raiz: THREE.Group): void {
  const grupos: THREE.Group[] = [raiz];
  raiz.traverse((o) => {
    if (o !== raiz && (o as THREE.Group).isGroup && o.name) grupos.push(o as THREE.Group);
  });
  for (const g of grupos) juntarPorCor(g);
}

type ModoDoPisca = 'esquerda' | 'direita' | 'alerta' | null;

interface Balanco { o: THREE.Object3D; x0: number; z0: number; b: Balanca; fase: number }

// ============================================================ o Bebito Mobile

export class BebitoMobile {
  readonly group = new THREE.Group();
  /** a ficha com que este carro foi montado (uma cópia: mexer nela não mexe no carro) */
  readonly ficha: FichaDoBebitoMobile;
  /**
   * ONDE SE SENTA: as âncoras de cada lugar, na altura do assento e olhando
   * para a frente. São filhas da carroceria (quem senta balança com ela). A
   * cena monta a dupla aqui com `g.ridePlayer(ancora, …)`.
   */
  readonly assentos: {
    motorista: THREE.Object3D;
    passageiro: THREE.Object3D;
    /** entre os dois da frente: só cabe bicho pequeno */
    frenteMeio: THREE.Object3D;
    /** os três de trás: esquerda (atrás do motorista), meio e direita */
    tras: THREE.Object3D[];
  };
  /**
   * ONDE SE DEITA, com a cama feita (`deitarEncostos(1)`): a âncora no padrão
   * da cama do quarto (`g.ridePlayer(carro.cama, new Vector3(∓0.36, 0, 0), 1, 0)`
   * e `g.setLying(true)`), com os pés para a frente do carro.
   */
  readonly cama = new THREE.Object3D();
  /** OS ENCAIXES de cada vaga (um por lugar), com nome: `vaga:painel:0`… */
  readonly encaixes = {} as Record<VagaDoCarro, THREE.Object3D[]>;

  private readonly carroceria = new THREE.Group();
  private readonly teto = new THREE.Group();
  /**
   * A PORTA DO MOTORISTA (a da frente, do lado `+X`): um grupo à parte, com o
   * pivô na dobradiça da frente. A `folha` leva a lataria, o forro e a
   * maçaneta; a `cima` (a janela, o friso do vidro e a testeira) é um grupo com
   * nome e some junto com o teto. Fechada, é a MESMA pele de antes — as
   * células da grade só mudaram de malha.
   */
  private readonly porta = {
    pivo: new THREE.Group(),
    folha: new THREE.Group(),
    cima: new THREE.Group(),
    /** onde ela está (0 fechada, 1 aberta de todo) e para onde vai */
    k: 0,
    alvo: 0,
  };
  private readonly volante = new THREE.Group();
  /** os dois encostos da frente (cada um deita sozinho) e quanto cada um está deitado, de 0 a 1 */
  private readonly encostos = {} as Record<'motorista' | 'passageiro', THREE.Group>;
  private readonly deitado = { motorista: 0, passageiro: 0 };
  private readonly alvoDoEncosto = { motorista: 0, passageiro: 0 };
  /** o que está em cima do banco de trás (o Bebito book, a mantinha): um grupo, para a cena guardar */
  private readonly cargaDoBanco = new THREE.Group();
  private readonly atlas: AtlasDeImpressos;
  private rodas!: THREE.InstancedMesh;
  private readonly lugaresDasRodas: Array<{ x: number; z: number; lado: 1 | -1; frente: boolean }> = [];
  private giroDasRodas = 0;
  private esterco = 0;

  private readonly farois = new THREE.Group();
  private readonly freios = new THREE.Group();
  private readonly piscas: Record<'esquerda' | 'direita', THREE.Group> = { esquerda: new THREE.Group(), direita: new THREE.Group() };
  private modoDoPisca: ModoDoPisca = null;
  private relogioDoPisca = 0;

  private readonly balancos: Balanco[] = [];
  private tempo = 0;
  private agito = 0;
  private movimento = 0;
  /** as três molas da carroceria: a altura, o arfar (o nariz sobe e desce) e o rolar (deita de lado) */
  private readonly mola = { y: 0, vy: 0, arfa: 0, varfa: 0, rola: 0, vrola: 0 };

  constructor(ficha: FichaDoBebitoMobile = FICHA_DE_FABRICA) {
    this.ficha = copiarFicha(ficha);
    const g = this.group;
    g.name = 'bebito-mobile';
    g.userData.peca = 'bebito-mobile';
    // (para o teste e para a cena: os comandos do carro)
    g.userData.carro = this;
    this.carroceria.name = 'carroceria';
    this.teto.name = 'teto';
    g.add(this.carroceria);
    this.carroceria.add(this.teto);
    this.porta.pivo.name = 'porta-do-motorista';
    this.porta.cima.name = 'porta-cima';
    this.porta.folha.add(this.porta.cima);
    this.porta.pivo.add(this.porta.folha);
    this.carroceria.add(this.porta.pivo);

    const f = this.ficha;
    this.atlas = atlasDeImpressos(f.placa, [...f.vagas.vidroTraseiro, ...f.vagas.paraChoque].filter((id): id is string => !!id));

    this.montarLataria();
    this.montarAssoalho();
    this.montarFrisos();
    this.montarFrente();
    this.montarTraseira();
    this.montarLados();
    this.montarOTeto();
    this.assentos = this.montarCabine();
    this.montarRodas();
    this.montarLuzes();
    // o que é de cor lisa vira uma malha por grupo (antes dos detalhes, que se enxugam sozinhos)
    juntarPorCor(this.carroceria);
    juntarPorCor(this.porta.pivo);
    juntarPorCor(this.teto);
    juntarPorCor(this.volante);
    this.vestirVagas();
    this.carroceria.scale.setScalar(ESCALA);
    this.rodas.scale.setScalar(ESCALA);

    // o que balança, e a pose de onde balança
    let i = 0;
    g.traverse((o) => {
      const b = o.userData.balanca as Balanca | undefined;
      if (b) this.balancos.push({ o, x0: o.rotation.x, z0: o.rotation.z, b, fase: (i++) * 1.7 });
    });
  }

  // ---------------------------------------------------------------- a lataria
  /** as três malhas da pele (lataria, capota, vidros), o forro das portas e a pestana da cintura */
  private montarLataria(): void {
    const cor = this.ficha.pintura;
    /*
     * A PORTA SAI DA PELE: as células do lado `+X`, da soleira à testeira (os
     * nós 0 a 5) e entre a beira de trás e a da frente da porta, viram um
     * pedaço à parte (`this.porta`) com o pivô na dobradiça da frente. O resto
     * da pele é o de sempre, então com a porta fechada a imagem é a mesma.
     */
    const J_DA_PORTA = PONTOS - 2 - NO.vidroAlto;
    const daPorta = (zm: number, j: number): boolean => j >= J_DA_PORTA && zm > CARRO.portas.meio && zm < CARRO.portas.frente;
    const { pivo, folha, cima } = this.porta;
    {
      // a dobradiça: na beira da frente da porta, na altura da cintura (o eixo é em pé)
      const m0 = pele();
      const dobradica = m0.pontos[m0.estacaoEm(CARRO.portas.frente)][PONTOS - 1 - 2];
      pivo.position.set(dobradica.x, 0, dobradica.z);
      folha.position.set(-dobradica.x, 0, -dobradica.z);
    }

    const lataria = new THREE.Mesh(
      geometriaDaPele((_i, j, zm, wm) => regiaoDaCelula(zm, wm, j) === 'lataria' && !daPorta(zm, j)),
      toon(cor.lataria, { doubleSide: true }),
    );
    lataria.name = 'lataria';
    this.carroceria.add(lataria);
    folha.add(new THREE.Mesh(
      geometriaDaPele((_i, j, zm, wm) => regiaoDaCelula(zm, wm, j) === 'lataria' && daPorta(zm, j)),
      toon(cor.lataria, { doubleSide: true }),
    ));

    const capota = new THREE.Mesh(
      geometriaDaPele((_i, j, zm, wm) => regiaoDaCelula(zm, wm, j) === 'capota' && !daPorta(zm, j)),
      toon(cor.teto, { doubleSide: true }),
    );
    capota.name = 'capota';
    this.teto.add(capota);
    cima.add(new THREE.Mesh(
      geometriaDaPele((_i, j, zm, wm) => regiaoDaCelula(zm, wm, j) === 'capota' && daPorta(zm, j)),
      toon(cor.teto, { doubleSide: true }),
    ));

    // os vidros: uma malha só, transparente, sem sombra (o sol entra na cabine)
    const vidros = new THREE.Mesh(
      geometriaDaPele((_i, j, zm, wm) => regiaoDaCelula(zm, wm, j) === 'vidro' && !daPorta(zm, j)),
      toon(P.glass, { opacity: 0.36 }),
    );
    vidros.name = 'vidros';
    vidros.userData.semSombra = true;
    vidros.renderOrder = 4;
    this.teto.add(vidros);
    const vidroDaPorta = new THREE.Mesh(
      geometriaDaPele((_i, j, zm, wm) => regiaoDaCelula(zm, wm, j) === 'vidro' && daPorta(zm, j)),
      toon(P.glass, { opacity: 0.36 }),
    );
    vidroDaPorta.userData.semSombra = true;
    vidroDaPorta.renderOrder = 4;
    cima.add(vidroDaPorta);

    // o FORRO das portas: a mesma pele, 4,5 cm para dentro e virada do avesso, da ponta de trás ao painel
    const naCabine = (zm: number, j: number): boolean => zm < CARRO.zCowl - CARRO.peDoParaBrisa && noDaCelula(j) < NO.cintura;
    const forroEmCima = (zm: number, j: number): boolean => naCabine(zm, j) && noDaCelula(j) >= 1;
    const forroEmBaixo = (zm: number, j: number): boolean => naCabine(zm, j) && noDaCelula(j) === 0;
    this.carroceria.add(new THREE.Mesh(
      geometriaDaPele((_i, j, zm) => forroEmCima(zm, j) && !daPorta(zm, j), -CABINE.forro, true),
      toon(cor.teto),
    ));
    this.carroceria.add(new THREE.Mesh(
      geometriaDaPele((_i, j, zm) => forroEmBaixo(zm, j) && !daPorta(zm, j), -CABINE.forro, true),
      toon(P.bebitoCarpete),
    ));
    folha.add(new THREE.Mesh(geometriaDaPele((_i, j, zm) => forroEmCima(zm, j) && daPorta(zm, j), -CABINE.forro, true), toon(cor.teto)));
    folha.add(new THREE.Mesh(geometriaDaPele((_i, j, zm) => forroEmBaixo(zm, j) && daPorta(zm, j), -CABINE.forro, true), toon(P.bebitoCarpete)));

    // a PESTANA: o alto da porta, entre a lataria e o forro (é o que dá grossura à porta com o teto fora)
    const { zs, pontos, normais, estacaoEm } = pele();
    const fim = estacaoEm(CARRO.zCowl - CARRO.peDoParaBrisa);
    const ia = estacaoEm(CARRO.portas.meio);
    const ib = estacaoEm(CARRO.portas.frente);
    const borracha = toon(P.bebitoBorracha);
    const pestana = (j: number, de: number, ate: number): THREE.BufferGeometry => {
      const fora: THREE.Vector3[] = [];
      const dentro: THREE.Vector3[] = [];
      for (let i = de; i <= ate && i < zs.length; i++) {
        fora.push(pontos[i][j]);
        dentro.push(pontos[i][j].clone().addScaledVector(normais[i][j], -CABINE.forro));
      }
      return fita(fora, dentro, new THREE.Vector3(0, 1, 0));
    };
    this.carroceria.add(new THREE.Mesh(pestana(NO.cintura, 0, fim), borracha));
    // (do lado do motorista ela se parte em três: o que fica no corpo antes e depois da porta, e o da porta)
    this.carroceria.add(new THREE.Mesh(pestana(PONTOS - 1 - NO.cintura, 0, ia), borracha));
    this.carroceria.add(new THREE.Mesh(pestana(PONTOS - 1 - NO.cintura, ib, fim), borracha));
    folha.add(new THREE.Mesh(pestana(PONTOS - 1 - NO.cintura, ia, ib), borracha));

    /*
     * O BATENTE: o vão que a porta deixa quando abre. A pele é fina (uma
     * superfície só), então a borda do buraco ganha uma fita de borracha da
     * lataria até 4,5 cm para dentro — a soleira, as duas beiras e a testeira.
     * Fechada, a fita fica atrás da porta e não se vê.
     */
    {
      const lado = (k: number): number => PONTOS - 1 - k;
      const ate = NO.quina;
      const fita4 = (pts: Array<[number, number]>, pai: THREE.Object3D): void => {
        // (a borda de fora fica 4 mm DENTRO da pele: rente, a ponta da fita brigava com a lataria e pontilhava a quina)
        const fora = pts.map(([i, j]) => pontos[i][j].clone().addScaledVector(normais[i][j], -0.004));
        const dentro = pts.map(([i, j]) => pontos[i][j].clone().addScaledVector(normais[i][j], -CABINE.forro));
        pai.add(new THREE.Mesh(fita(fora, dentro, new THREE.Vector3(0, 1, 0)), toon(P.bebitoBorracha, { doubleSide: true })));
      };
      // da cintura para cima o batente é do TETO (sai junto com ele: sem teto, ficava um poste no ar)
      const soleira: Array<[number, number]> = [];
      const testeira: Array<[number, number]> = [];
      for (let i = ia; i <= ib; i++) {
        soleira.push([i, lado(NO.pe)]);
        testeira.push([i, lado(ate)]);
      }
      const embaixo = (i: number): Array<[number, number]> => {
        const l: Array<[number, number]> = [];
        for (let k = NO.pe; k <= NO.cintura; k++) l.push([i, lado(k)]);
        return l;
      };
      const emCima = (i: number): Array<[number, number]> => {
        const l: Array<[number, number]> = [];
        for (let k = NO.cintura; k <= ate; k++) l.push([i, lado(k)]);
        return l;
      };
      fita4(soleira, this.carroceria);
      fita4(embaixo(ib), this.carroceria);
      fita4(embaixo(ia), this.carroceria);
      fita4(testeira, this.teto);
      fita4(emCima(ib), this.teto);
      fita4(emCima(ia), this.teto);
    }
  }

  // --------------------------------------------------------------- o assoalho
  /** o piso da cabine (a planta, com o recorte das quatro rodas), o chassi por baixo e as caixas de roda */
  private montarAssoalho(): void {
    const c = this.carroceria;
    const forma = new THREE.Shape();
    const n = 96;
    const dentroDaRoda = CABINE.entreRodas;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const co = Math.cos(a);
      const se = Math.sin(a);
      let x = 0.965 * W * Math.sign(co) * Math.pow(Math.abs(co), 2 / CARRO.expo);
      const z = 0.985 * A * Math.sign(se) * Math.pow(Math.abs(se), 2 / CARRO.expo);
      if (Math.abs(x) > dentroDaRoda && CARRO.eixos.some((e) => Math.abs(z - e) < CARRO.roda.caixa + 0.015)) x = Math.sign(x) * dentroDaRoda;
      // (a forma no plano (x, −z): deitada pelo `rotateX(−π/2)` ela volta ao `z` do carro)
      if (k) forma.lineTo(x, -z);
      else forma.moveTo(x, -z);
    }
    const piso = new THREE.ExtrudeGeometry(forma, { depth: 0.05, bevelEnabled: false });
    piso.rotateX(-Math.PI / 2);
    piso.translate(0, CABINE.piso - 0.05, 0);
    c.add(new THREE.Mesh(piso, toon(P.bebitoCarpete)));

    por(c, new THREE.Mesh(quina(1.16, 0.15, A * 2 - 0.9, 0.06), toon(P.bebitoChassi)), 0, 0.245, 0);
    const escuro = toon(P.bebitoChassi, { doubleSide: true });
    const rc = CARRO.roda.caixa - 0.006;
    for (const e of CARRO.eixos) {
      const eixo = por(c, new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, CARRO.roda.x * 2, 8), toon(P.bebitoChassi)), 0, CARRO.roda.raio, e);
      eixo.rotation.z = Math.PI / 2;
      /**
       * A CAIXA DE RODA: meio cano por cima da roda, da parede de dentro até a
       * lataria. A beira de fora ACOMPANHA a planta do carro: um cano reto,
       * da largura do carro no eixo, saía pela lataria nas pontas do arco
       * (onde o carro já estreitou) e aparecia como uma aba escura embaixo do
       * para-choque.
       */
      const meioCano = (raio: number): THREE.BufferGeometry[] => [-1, 1].map((lado) => {
        const dentro: THREE.Vector3[] = [];
        const fora: THREE.Vector3[] = [];
        for (let k = 0; k <= 18; k++) {
          const a = (k / 18) * Math.PI;
          const z = e + raio * Math.cos(a);
          const y = CARRO.roda.raio + raio * Math.sin(a);
          dentro.push(new THREE.Vector3(lado * dentroDaRoda, y, z));
          fora.push(new THREE.Vector3(lado * (meiaLargura(z) * 0.985 - 0.012), y, z));
        }
        return fita(dentro, fora, new THREE.Vector3(0, 1, 0));
      });
      // por fora (a boca da caixa de roda): a casca escura e a parede do fundo
      for (const casca of meioCano(rc)) c.add(new THREE.Mesh(casca, escuro));
      // por dentro (a corcova na cabine): a mesma casca, um fio maior, de carpete
      for (const corcova of meioCano(rc + 0.02)) c.add(new THREE.Mesh(corcova, toon(P.bebitoCarpete)));
      for (const lado of [-1, 1]) {
        const fundo = new THREE.CircleGeometry(rc, 18, 0, Math.PI);
        fundo.rotateY(Math.PI / 2);
        fundo.translate(lado * dentroDaRoda, CARRO.roda.raio, e);
        c.add(new THREE.Mesh(fundo, escuro));
        const parede = new THREE.CircleGeometry(rc + 0.02, 14, 0, Math.PI);
        parede.rotateY(-lado * Math.PI / 2);
        parede.translate(lado * (dentroDaRoda - 0.02), CARRO.roda.raio, e);
        c.add(new THREE.Mesh(parede, toon(P.bebitoCarpete)));
      }
    }
  }

  // ---------------------------------------------------------------- os frisos
  /** tudo o que é linha em cima da lataria: o cromo da cintura, a borracha dos vidros, o corte das portas, o trilho da porta de correr e o aro das caixas de roda */
  private montarFrisos(): void {
    const p = pele();
    const ni = p.zs.length;
    const esq = (k: number): number => k;
    const dir = (k: number): number => PONTOS - 1 - k;
    const em = (i: number, j: number): NaPele => ({ p: p.pontos[i][j], n: p.normais[i][j] });
    const cromo = toon(P.bebitoCromo);
    const borracha = toon(P.bebitoBorracha);

    // o FRISO DA CINTURA: um filete de cromo dando a volta no carro, na linha do ombro. No lado do motorista
    // ele para nas duas beiras da porta (o pedaço do meio vai com a porta, e abre junto com ela)
    const iaPorta = p.estacaoEm(CARRO.portas.meio);
    const ibPorta = p.estacaoEm(CARRO.portas.frente);
    const volta: NaPele[] = [];
    for (let i = ibPorta; i < ni - 1; i++) volta.push(em(i, dir(NO.cintura)));
    for (let i = ni - 1; i >= 0; i--) volta.push(em(i, esq(NO.cintura)));
    for (let i = 1; i <= iaPorta; i++) volta.push(em(i, dir(NO.cintura)));
    this.carroceria.add(new THREE.Mesh(friso(volta, 0.015, 0.012, false, 0, 3), cromo));
    const cintoDaPorta: NaPele[] = [];
    for (let i = iaPorta; i <= ibPorta; i++) cintoDaPorta.push(em(i, dir(NO.cintura)));
    this.porta.folha.add(new THREE.Mesh(friso(cintoDaPorta, 0.015, 0.012, false, 0, 3), cromo));

    // a BORRACHA dos vidros: um filete pelo contorno de cada um, as quinas todas com o mesmo raio
    const moldura = (pts: NaPele[], pai: THREE.Object3D = this.teto): void => {
      pai.add(new THREE.Mesh(friso(pts, BORRACHA.meia, BORRACHA.alto, true, BORRACHA.quina), borracha));
    };
    const iq = p.estacaoEm(CARRO.quebraVento);
    for (const [a, b] of CARRO.janelas) {
      const ia = p.estacaoEm(a);
      const ib = p.estacaoEm(b);
      for (const lado of [esq, dir]) {
        // a janela da frente se parte no quebra-vento (a divisória): a metade de trás é a janela da PORTA (do lado
        // do motorista, abre com ela) e a da frente é o vidrinho fixo. As duas beiras da divisória são a mesma linha
        const partes: Array<[number, number, THREE.Object3D]> = ia < iq && iq < ib
          ? [[ia, iq, lado === dir ? this.porta.cima : this.teto], [iq, ib, this.teto]]
          : [[ia, ib, this.teto]];
        for (const [de, ate, pai] of partes) {
          const pts: NaPele[] = [];
          for (let i = de; i <= ate; i++) pts.push(em(i, lado(NO.vidroBaixo)));
          for (let i = ate; i >= de; i--) pts.push(em(i, lado(NO.vidroAlto)));
          moldura(pts, pai);
        }
      }
    }
    // o vidro de trás: as duas metades se encontram na ponta
    {
      const it = p.estacaoEm(-zDaLargura(CARRO.vidroDeTras * W));
      const pts: NaPele[] = [];
      for (let i = it; i >= 0; i--) pts.push(em(i, esq(NO.vidroBaixo)));
      for (let i = 1; i <= it; i++) pts.push(em(i, dir(NO.vidroBaixo)));
      for (let i = it; i >= 0; i--) pts.push(em(i, dir(NO.vidroAlto)));
      for (let i = 1; i <= it; i++) pts.push(em(i, esq(NO.vidroAlto)));
      moldura(pts);
    }
    // o para-brisa
    {
      const ia = p.estacaoEm(CARRO.zTeto + CARRO.testeira);
      const ib = p.estacaoEm(CARRO.zCowl - CARRO.peDoParaBrisa);
      const ja = esq(NO.paraBrisa);
      const jb = dir(NO.paraBrisa);
      const pts: NaPele[] = [];
      for (let j = ja; j <= jb; j++) pts.push(em(ib, j));
      for (let i = ib - 1; i >= ia; i--) pts.push(em(i, jb));
      for (let j = jb - 1; j >= ja; j--) pts.push(em(ia, j));
      for (let i = ia + 1; i < ib; i++) pts.push(em(i, ja));
      moldura(pts);
    }

    // o CORTE DAS PORTAS: um risco escuro da soleira à cintura
    for (const z of Object.values(CARRO.portas)) {
      const i = p.estacaoEm(z);
      for (const lado of [esq, dir]) {
        const pts: NaPele[] = [];
        for (let k = NO.pe; k <= NO.cintura; k++) pts.push(em(i, lado(k)));
        this.carroceria.add(new THREE.Mesh(friso(pts, 0.008, 0.005, false, 0, 2), borracha));
      }
    }
    // o TRILHO da porta de correr: da beira de trás da porta até quase o fim do carro, logo abaixo da cintura
    for (const lado of [-1, 1] as const) {
      const pts: NaPele[] = [];
      for (let k = 0; k <= 10; k++) pts.push(noLado(CARRO.portas.tras + (TRILHO.fim - CARRO.portas.tras) * (k / 10), TRILHO.y, lado));
      this.carroceria.add(new THREE.Mesh(friso(pts, 0.011, 0.006, false, 0, 2), borracha));
    }

    // o ARO das caixas de roda
    for (const e of CARRO.eixos) {
      for (const lado of [esq, dir]) {
        const pts: NaPele[] = [];
        for (let i = 0; i < ni; i++) if (Math.abs(p.zs[i] - e) <= CARRO.roda.caixa + 0.002) pts.push(em(i, lado(NO.pe)));
        this.carroceria.add(new THREE.Mesh(friso(pts, 0.02, 0.016, false, 0, 3), cromo));
      }
    }
  }

  /** um para-choque: o tubo de cromo dando a volta na ponta, as duas garras e as ponteiras */
  private paraChoque(frente: boolean): void {
    const cromo = toon(P.bebitoCromo);
    const y = 0.43;
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 20; k++) {
      const x = 0.88 * W * Math.sin(((k / 20) * 2 - 1) * (Math.PI / 2));
      pts.push(naPonta(x, y, frente, 0.055).p);
    }
    this.carroceria.add(new THREE.Mesh(tubo(pts, 0.055, false, 8, 1.4), cromo));
    for (const ponta of [pts[0], pts[pts.length - 1]]) {
      por(this.carroceria, new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), cromo), ponta.x, ponta.y, ponta.z);
    }
    for (const lado of [-1, 1]) {
      pregar(this.carroceria, new THREE.Mesh(quina(0.07, 0.2, 0.08, 0.03), cromo), naPonta(lado * 0.36, y + 0.01, frente, 0.09));
    }
  }

  // ----------------------------------------------------------------- a frente
  /** a cara do carro: os faróis redondos, o sorriso da grade, o emblema, o para-choque com a placa, os limpadores e a antena */
  private montarFrente(): void {
    const c = this.carroceria;
    const cromo = toon(P.bebitoCromo);
    const borracha = toon(P.bebitoBorracha);
    this.paraChoque(true);

    // a placa, na frente do para-choque
    const naPlaca = naPonta(0, 0.43, true, 0.115);
    pregar(c, new THREE.Mesh(quina(0.45, 0.165, 0.014, 0.01), borracha), naPlaca, -0.009);
    pregar(c, new THREE.Mesh(this.atlas.plaquinha('placa') ?? new THREE.BufferGeometry(), this.atlas.material), naPlaca);

    // os faróis: o balde de cromo saindo da cara, o aro e a lente
    for (const lado of [-1, 1]) {
      const em = naPonta(lado * FAROL.x, FAROL.y, true);
      const balde = new THREE.CylinderGeometry(FAROL.raio, FAROL.raio * 0.86, 0.14, 18);
      balde.rotateX(Math.PI / 2);
      pregar(c, new THREE.Mesh(balde, toon(this.ficha.pintura.lataria)), em, -0.02);
      pregar(c, new THREE.Mesh(new THREE.TorusGeometry(FAROL.raio, 0.022, 7, 22), cromo), em, 0.05);
      pregar(c, new THREE.Mesh(lente(FAROL.raio - 0.012), toon(P.bebitoFarol, { glow: 0.5 })), em, 0.045);
      // o pisca, embaixo e para fora
      pregar(c, new THREE.Mesh(lente(0.05, 0.5), toon(P.bebitoPisca, { glow: 0.3 })), naPonta(lado * PISCA_DA_FRENTE.x, PISCA_DA_FRENTE.y, true), 0.002);
      pregar(c, new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 5, 14), cromo), naPonta(lado * PISCA_DA_FRENTE.x, PISCA_DA_FRENTE.y, true), 0.004);
    }

    // a grade é um SORRISO: um risco escuro subindo nas pontas
    const sorriso: THREE.Vector3[] = [];
    for (let k = 0; k <= 12; k++) {
      const f = (k / 12) * 2 - 1;
      sorriso.push(naPonta(f * 0.3, 0.58 + 0.06 * f * f, true, 0.006).p);
    }
    c.add(new THREE.Mesh(tubo(sorriso, 0.018, false, 6, 1.5), borracha));
    for (const ponta of [sorriso[0], sorriso[sorriso.length - 1]]) {
      por(c, new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), borracha), ponta.x, ponta.y, ponta.z);
    }

    // o emblema: um coração num escudinho de cromo, em cima do sorriso
    const noEmblema = naPonta(0, 0.745, true, 0.004);
    const escudo = pregar(c, new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), cromo), noEmblema);
    escudo.scale.set(0.07, 0.056, 0.012);
    const coracao = new THREE.Shape();
    coracao.moveTo(0, -0.034);
    coracao.bezierCurveTo(-0.05, 0.002, -0.038, 0.04, 0, 0.02);
    coracao.bezierCurveTo(0.038, 0.04, 0.05, 0.002, 0, -0.034);
    pregar(c, new THREE.Mesh(new THREE.ExtrudeGeometry(coracao, { depth: 0.008, bevelEnabled: false }), toon(P.heart)), noEmblema, 0.009);

    // os limpadores, deitados no pé do para-brisa (saem com o teto: moram no vidro)
    for (const x of [0.4, -0.16]) {
      const a = porCima(x, CARRO.zCowl - 0.02, 0.022).p;
      const b = porCima(x - 0.46, CARRO.zCowl - 0.1, 0.02).p;
      this.teto.add(new THREE.Mesh(tubo([a, a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0.004, 0)), b], 0.009, false, 5, 2), borracha));
      por(this.teto, new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), cromo), a.x, a.y, a.z);
    }

    // a antena, no para-lama do lado do passageiro, com a bolinha na ponta
    const pe = porCima(-0.74, CARRO.zCowl + 0.28, 0);
    const antena = por(c, new THREE.Group(), pe.p.x, pe.p.y, pe.p.z);
    antena.rotation.x = -0.18;
    por(antena, new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 0.03, 8), cromo), 0, 0.012, 0);
    por(antena, new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.006, 0.6, 5), cromo), 0, 0.32, 0);
    por(antena, new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), toon(this.ficha.pintura.teto)), 0, 0.63, 0);
  }

  // --------------------------------------------------------------- a traseira
  /** atrás: o para-choque, a placa com a luzinha, o nome do carro, as lanternas e o escapamento */
  private montarTraseira(): void {
    const c = this.carroceria;
    const cromo = toon(P.bebitoCromo);
    this.paraChoque(false);

    const naPlaca = naPonta(0, PLACA_DE_TRAS.y, false, 0.014);
    pregar(c, new THREE.Mesh(quina(0.45, 0.165, 0.014, 0.01), toon(P.bebitoBorracha)), naPlaca, -0.009);
    pregar(c, new THREE.Mesh(this.atlas.plaquinha('placa') ?? new THREE.BufferGeometry(), this.atlas.material), naPlaca);
    // a luz da placa, que é também o puxador da tampa
    pregar(c, new THREE.Mesh(quina(0.3, 0.034, 0.05, 0.015), cromo), naPonta(0, PLACA_DE_TRAS.y + 0.105, false, 0.022));
    // o nome do carro, numa plaquinha de cromo
    pregar(c, new THREE.Mesh(this.atlas.plaquinha('nome') ?? new THREE.BufferGeometry(), this.atlas.material), naPonta(-0.44, 0.96, false, 0.005));

    for (const lado of [-1, 1]) {
      // a lanterna vermelha no aro de cromo, e o pisca embaixo dela
      const naLanterna = naPonta(lado * LANTERNA.x, LANTERNA.y, false);
      pregar(c, new THREE.Mesh(new THREE.TorusGeometry(0.086, 0.016, 6, 18), cromo), naLanterna, 0.006);
      pregar(c, new THREE.Mesh(lente(0.08), toon(P.bebitoLanterna, { glow: 0.3 })), naLanterna, 0.004);
      const noPisca = naPonta(lado * LANTERNA.x, LANTERNA.y - 0.17, false);
      pregar(c, new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.011, 5, 14), cromo), noPisca, 0.005);
      pregar(c, new THREE.Mesh(lente(0.048), toon(P.bebitoPisca, { glow: 0.3 })), noPisca, 0.004);
    }
    // a luz de ré, pequena, embaixo das duas (do lado do motorista)
    pregar(c, new THREE.Mesh(lente(0.03), toon(P.bebitoRe, { glow: 0.2 })), naPonta(LANTERNA.x, LANTERNA.y - 0.29, false), 0.004);

    const escape = por(c, new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.2, 8), cromo), -0.52, 0.28, -A + 0.1);
    escape.rotation.x = Math.PI / 2;
  }

  // ------------------------------------------------------------------ os lados
  /** as maçanetas, os retrovisores de fora e a tampa do tanque */
  private montarLados(): void {
    const c = this.carroceria;
    const cromo = toon(P.bebitoCromo);
    for (const lado of [-1, 1] as const) {
      // a maçaneta da porta da frente perto da beira de trás dela; a da porta de correr, perto da beira da frente
      for (const z of [CARRO.portas.meio + 0.15, CARRO.portas.meio - 0.15]) {
        const macaneta = new THREE.CapsuleGeometry(0.015, 0.1, 3, 8);
        macaneta.rotateZ(Math.PI / 2);
        // (a da porta do motorista é a da dobradiça: gira com ela)
        const pai = lado === 1 && z > CARRO.portas.meio ? this.porta.folha : c;
        pregar(pai, new THREE.Mesh(macaneta, cromo), noLado(z, 0.99, lado), 0.024);
        pregar(pai, new THREE.Mesh(quina(0.15, 0.05, 0.012, 0.006), cromo), noLado(z, 0.99, lado), 0.004);
      }
      // o retrovisor: o braço saindo da porta e o espelho redondo olhando para trás
      const base = noLado(CARRO.quebraVento + 0.18, 1.04, lado);
      const braco: THREE.Vector3[] = [
        base.p.clone(),
        base.p.clone().addScaledVector(base.n, 0.09).add(new THREE.Vector3(0, 0.07, 0)),
        base.p.clone().addScaledVector(base.n, 0.15).add(new THREE.Vector3(0, 0.14, 0)),
      ];
      c.add(new THREE.Mesh(tubo(braco, 0.013, false, 6, 3), cromo));
      const espelho = por(c, new THREE.Group(), braco[2].x, braco[2].y + 0.05, braco[2].z);
      espelho.rotation.y = lado * 0.25;
      const caixa = new THREE.CylinderGeometry(0.078, 0.07, 0.04, 16);
      caixa.rotateX(Math.PI / 2);
      espelho.add(new THREE.Mesh(caixa, cromo));
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.064, 16), toon(P.glass, { glow: 0.25 }));
      face.rotation.y = Math.PI;
      face.position.z = -0.0215;
      espelho.add(face);
    }
    // a tampa do tanque, no para-lama de trás do lado do passageiro
    const noTanque = noLado(-A + 0.3, 0.86, -1);
    pregar(c, new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.007, 5, 18), toon(P.bebitoBorracha)), noTanque, 0.002);
    pregar(c, new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 5), cromo), noTanque, 0.004);
  }

  // -------------------------------------------------------------------- o teto
  /** em cima: o bagageiro (as duas barras de cromo) — vazio de fábrica — e, por dentro, o retrovisor */
  private montarOTeto(): void {
    const t = this.teto;
    const cromo = toon(P.bebitoCromo);
    for (const lado of [-1, 1]) {
      const barra: THREE.Vector3[] = [];
      for (let k = 0; k <= 8; k++) barra.push(porCima(lado * BAGAGEIRO.x, BAGAGEIRO.z0 + ((BAGAGEIRO.z1 - BAGAGEIRO.z0) * k) / 8, 0.075).p);
      t.add(new THREE.Mesh(tubo(barra, 0.016, false, 6, 1.5), cromo));
      for (const k of [0, 4, 8]) {
        const pe = porCima(lado * BAGAGEIRO.x, BAGAGEIRO.z0 + ((BAGAGEIRO.z1 - BAGAGEIRO.z0) * k) / 8, 0);
        por(t, new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.02, 0.08, 6), cromo), pe.p.x, pe.p.y + 0.036, pe.p.z);
      }
      por(t, new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5), cromo), barra[0].x, barra[0].y, barra[0].z);
      por(t, new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5), cromo), barra[8].x, barra[8].y, barra[8].z);
    }
    this.encaixe('teto', 0, t, porCima(0, (BAGAGEIRO.z0 + BAGAGEIRO.z1) / 2, 0.09).p, 0);

    // o retrovisor de dentro: a haste desce da testeira do para-brisa
    const alto = porCima(0, RETROVISOR.z, -0.02).p;
    por(t, new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, alto.y - RETROVISOR.y, 6), cromo), 0, (alto.y + RETROVISOR.y) / 2, RETROVISOR.z);
    const espelho = por(t, new THREE.Group(), 0, RETROVISOR.y, RETROVISOR.z - 0.012);
    espelho.rotation.x = 0.12;
    espelho.add(new THREE.Mesh(quina(0.3, 0.085, 0.03, 0.022), toon(P.bebitoBorracha)));
    const face = por(espelho, new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.06), toon(P.glass, { glow: 0.3 })), 0, 0, -0.0165);
    face.rotation.y = Math.PI;
    // o que se pendura nele: um encaixe de cada lado da haste
    for (const [lugar, x] of [[0, -0.05], [1, 0.05]] as const) {
      this.encaixe('retrovisor', lugar, t, new THREE.Vector3(x, RETROVISOR.y - 0.04, RETROVISOR.z - 0.012), Math.PI);
    }
  }

  // ------------------------------------------------------------------ a cabine
  /** por dentro: o painel, o volante, a alavanca, os bancos, o tampão — e os lugares de sentar */
  private montarCabine(): BebitoMobile['assentos'] {
    const c = this.carroceria;
    const cor = this.ficha.pintura;
    const cromo = toon(P.bebitoCromo);
    const pn = CABINE.painel;

    // a parede de fogo e o PAINEL: o corpo na cor da lataria (painel de carro antigo é de lata pintada) e o tampo estofado
    // (a parede acaba 2 cm abaixo do tampo: da mesma altura, ela aparecia como um risco escuro na beira dele)
    por(c, new THREE.Mesh(quina(1.86, 0.74, 0.04, 0.015), toon(P.bebitoChassi)), 0, 0.72, pn.z1 + 0.012);
    const meioZ = (pn.z0 + pn.z1) / 2;
    por(c, new THREE.Mesh(quina(1.9, 0.31, pn.z1 - pn.z0, 0.07), toon(cor.lataria)), 0, pn.topo - 0.195, meioZ);
    por(c, new THREE.Mesh(quina(1.92, 0.07, pn.z1 - pn.z0 + 0.04, 0.03), toon(P.bebitoPainel)), 0, pn.topo - 0.035, meioZ - 0.01);
    // o rádio no meio, com os dois botões
    const frente = pn.z0 - 0.002;
    const radio = por(c, new THREE.Mesh(this.atlas.plaquinha('radio') ?? new THREE.BufferGeometry(), this.atlas.material), 0, pn.topo - 0.19, frente);
    radio.rotation.y = Math.PI;
    for (const lado of [-1, 1]) {
      const botao = por(c, new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.027, 0.03, 10), toon(P.bebitoVolante)), lado * 0.215, pn.topo - 0.19, frente - 0.013);
      botao.rotation.x = Math.PI / 2;
    }
    // o porta-luvas, do lado do passageiro
    por(c, new THREE.Mesh(quina(0.44, 0.17, 0.014, 0.02), toon(cor.teto)), -CABINE.frente.x - 0.04, pn.topo - 0.2, frente - 0.004);
    por(c, new THREE.Mesh(quina(0.07, 0.022, 0.02, 0.008), cromo), -CABINE.frente.x - 0.04, pn.topo - 0.15, frente - 0.016);
    // os relógios, numa viseira em cima do painel, na frente do motorista
    const viseira = por(c, new THREE.Group(), CABINE.frente.x, pn.topo + 0.055, pn.z0 + 0.1);
    viseira.rotation.x = 0.2;
    viseira.add(new THREE.Mesh(quina(0.38, 0.16, 0.11, 0.05), toon(P.bebitoPainel)));
    const relogios = por(viseira, new THREE.Mesh(this.atlas.plaquinha('mostradores') ?? new THREE.BufferGeometry(), this.atlas.material), 0, 0, -0.057);
    relogios.rotation.y = Math.PI;

    // o VOLANTE: a coluna, e o aro de baquelite creme com três raios (o grupo gira no próprio eixo)
    const v = CABINE.volante;
    const coluna = por(c, new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.3, 8), toon(P.bebitoChassi)), CABINE.frente.x, v.y - 0.06, v.z + 0.135);
    coluna.rotation.x = Math.PI / 2 + v.deita;
    this.volante.name = 'volante';
    this.volante.position.set(CABINE.frente.x, v.y, v.z);
    this.volante.rotation.set(v.deita, 0, 0);
    c.add(this.volante);
    const creme = toon(P.bebitoVolante);
    this.volante.add(new THREE.Mesh(new THREE.TorusGeometry(v.raio, 0.02, 7, 24), creme));
    for (const a of [Math.PI / 2, Math.PI * 7 / 6, Math.PI * 11 / 6]) {
      const raio = new THREE.Mesh(quina(v.raio - 0.02, 0.026, 0.016, 0.007), creme);
      raio.position.set(Math.cos(a) * v.raio * 0.5, Math.sin(a) * v.raio * 0.5, 0.008);
      raio.rotation.z = a;
      this.volante.add(raio);
    }
    const miolo = por(this.volante, new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.056, 0.036, 14), creme), 0, 0, 0.004);
    miolo.rotation.x = Math.PI / 2;
    const buzina = por(this.volante, new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 6), toon(P.heart)), 0, 0, -0.016);
    buzina.scale.z = 0.4;
    // a chave, no painel, à direita da coluna
    this.encaixe('chave', 0, c, new THREE.Vector3(CABINE.frente.x - 0.27, pn.topo - 0.21, frente), Math.PI);

    // a alavanca de câmbio NA COLUNA (com os bancos inteiriços, o assoalho fica livre), com a bolinha creme
    const alavanca = por(c, new THREE.Group(), CABINE.frente.x - 0.04, v.y - 0.075, v.z + 0.15);
    alavanca.rotation.set(0.35, 0, 0.95);
    por(alavanca, new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.009, 0.24, 6), cromo), 0, 0.12, 0);
    por(alavanca, new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), creme), 0, 0.25, 0);

    // OS BANCOS: dois INTEIRIÇOS, de matelassê, da largura da cabine. O de trás cabe três; os dois
    // encostos da frente DEITAM para trás e, com os dois assentos, viram uma cama (`deitarEncostos`).
    const b = CABINE.banco;
    const bancos = new THREE.Group();
    c.add(bancos);
    const estofado = toon(cor.estofado);
    const vivo = toon(P.bebitoEstofadoVivo);
    /**
     * UM ENCOSTO: a origem é o PÉ dele (a dobradiça, na beira de trás do
     * assento, meia grossura abaixo do topo). Em pé ele sobe, um pouco
     * inclinado; deitado ele vai para trás, e a face da frente vira o colchão,
     * rente ao assento.
     */
    const encosto = (nome: string, x: number, z: number, largura: number): THREE.Group => {
      const g = new THREE.Group();
      g.name = nome;
      g.position.set(x, CABINE.assento - b.grossoDoEncosto / 2, z);
      g.rotation.x = -b.inclinado;
      por(g, new THREE.Mesh(quina(largura, b.encosto, b.grossoDoEncosto, 0.07), estofado), 0, b.encosto / 2, 0);
      // o vivo creme, uma cinta perto do alto
      por(g, new THREE.Mesh(quina(largura - 0.1, 0.05, b.grossoDoEncosto + 0.008, 0.02), vivo), 0, b.encosto - 0.11, 0);
      bancos.add(g);
      return g;
    };
    for (const z of [CABINE.frente.z, CABINE.tras.z]) {
      por(bancos, new THREE.Mesh(quina(b.meia * 2, b.grosso, b.fundo, 0.07), estofado), 0, CABINE.assento - b.grosso / 2, z);
      por(c, new THREE.Mesh(quina(b.meia * 2 - 0.14, 0.13, b.fundo - 0.14, 0.03), toon(P.bebitoChassi)), 0, CABINE.piso + 0.06, z);
    }
    const peDaFrente = CABINE.frente.z - b.fundo / 2;
    this.encostos.motorista = encosto('encosto:motorista', b.meia / 2, peDaFrente, b.meia - 0.01);
    this.encostos.passageiro = encosto('encosto:passageiro', -b.meia / 2, peDaFrente, b.meia - 0.01);
    encosto('encosto:tras', 0, CABINE.tras.z - b.fundo / 2, b.meia * 2);
    acabar(bancos, [[cor.estofado, matelasse(0.26)]]);

    // o TAMPÃO do porta-malas: a prateleira atrás do banco, no desenho da planta
    const tp = CABINE.tampao;
    const forma = new THREE.Shape();
    const borda: Array<[number, number]> = [];
    const zFim = -(A - 0.07);
    for (let k = 0; k <= 16; k++) {
      const z = tp.z0 + ((zFim - tp.z0) * k) / 16;
      borda.push([Math.max(0.02, meiaLargura(z) - CABINE.forro - 0.004), z]);
    }
    borda.forEach(([x, z], k) => (k ? forma.lineTo(x, -z) : forma.moveTo(x, -z)));
    for (let k = borda.length - 1; k >= 0; k--) forma.lineTo(-borda[k][0], -borda[k][1]);
    const tampao = new THREE.ExtrudeGeometry(forma, { depth: 0.03, bevelEnabled: false });
    tampao.rotateX(-Math.PI / 2);
    tampao.translate(0, tp.y - 0.03, 0);
    c.add(new THREE.Mesh(tampao, toon(P.bebitoPainel)));

    // OS ENCAIXES de dentro
    for (const [lugar, x] of [[0, -CABINE.frente.x - 0.05], [1, -0.02], [2, CABINE.frente.x + 0.38]] as const) {
      this.encaixe('painel', lugar, c, new THREE.Vector3(x, pn.topo, meioZ + 0.02), Math.PI);
    }
    // (longe das paredes: a cabine estreita para trás, e o frisbee encostado na da esquerda saía pela lataria)
    for (const [lugar, x] of [[0, -0.18], [1, 0.56]] as const) {
      this.encaixe('portaMalas', lugar, c, new THREE.Vector3(x, tp.y, (tp.z0 - A) / 2 + 0.04), Math.PI);
    }
    // (o que vai no banco de trás mora num grupo só: com gente sentada ali, ou com a cama feita, a cena o guarda)
    this.cargaDoBanco.name = 'carga-do-banco-de-tras';
    c.add(this.cargaDoBanco);
    for (const [lugar, x] of [[0, -0.52], [1, 0.52]] as const) {
      this.encaixe('bancoDeTras', lugar, this.cargaDoBanco, new THREE.Vector3(x, CABINE.assento, CABINE.tras.z + 0.04), 0);
    }
    // os adesivos: três na tampa de trás e dois nos cantos do vidro
    ADESIVOS_DA_TAMPA.forEach(([x, y], lugar) => {
      const em = naPonta(x, y, false, 0.005);
      const e = this.encaixe('paraChoque', lugar, c, em.p, 0);
      e.quaternion.copy(olhandoPara(em.n));
    });
    ADESIVOS_DO_VIDRO.forEach(([x, y], lugar) => {
      const em = naPonta(x, y, false, 0.006);
      const e = this.encaixe('vidroTraseiro', lugar, this.teto, em.p, 0);
      e.quaternion.copy(olhandoPara(em.n));
    });
    this.encaixes.rodas = [];

    // ONDE SE SENTA
    const lugar = (nome: string, x: number, z: number): THREE.Object3D => {
      const o = new THREE.Object3D();
      o.name = `assento:${nome}`;
      o.position.set(x, CABINE.assento, z);
      // (a carroceria cresce; quem senta, não)
      o.scale.setScalar(1 / ESCALA);
      c.add(o);
      return o;
    };
    // ONDE SE DEITA: a âncora da cama, do jeito da cama do quarto e da barraca — girada −π/2 em X, os
    // dois lado a lado no X dela, os PÉS no `+Z` (a frente do carro) e a cabeça para o encosto de trás.
    // A altura é a do colchão mais meio corpo (o rig nasce com os pés em `y = 0`).
    this.cama.name = 'cama';
    this.cama.position.set(0, CABINE.assento + 0.18 / ESCALA, CAMA.z1 - 0.02);
    this.cama.rotation.x = -Math.PI / 2;
    this.cama.scale.setScalar(1 / ESCALA);
    c.add(this.cama);
    return {
      motorista: lugar('motorista', CABINE.frente.x, CABINE.frente.z),
      passageiro: lugar('passageiro', -CABINE.frente.x, CABINE.frente.z),
      frenteMeio: lugar('frente-meio', 0, CABINE.frente.z),
      tras: [
        lugar('tras-esquerda', CABINE.tras.x, CABINE.tras.z),
        lugar('tras-meio', 0, CABINE.tras.z),
        lugar('tras-direita', -CABINE.tras.x, CABINE.tras.z),
      ],
    };
  }

  /** um ENCAIXE: o ponto (com nome) onde um detalhe da vaga se prende */
  private encaixe(vaga: VagaDoCarro, lugar: number, pai: THREE.Object3D, p: THREE.Vector3, giro: number): THREE.Group {
    const e = new THREE.Group();
    e.name = `vaga:${vaga}:${lugar}`;
    e.userData.vaga = { vaga, lugar };
    e.position.copy(p);
    e.rotation.y = giro;
    pai.add(e);
    (this.encaixes[vaga] ??= [])[lugar] = e;
    return e;
  }

  /** veste as vagas com o que a ficha manda: peça 3D no encaixe, adesivo de canvas colado no lugar dele */
  private vestirVagas(): void {
    for (const vaga of VAGAS_DO_CARRO) {
      if (DEF_DAS_VAGAS[vaga].tipo === 'calota') continue;
      this.ficha.vagas[vaga].forEach((id, lugar) => {
        const e = this.encaixes[vaga]?.[lugar];
        if (!id || !e) return;
        const monta = PECAS_DO_CARRO[id];
        if (monta) {
          const peca = monta();
          peca.name = `detalhe:${id}`;
          e.add(peca);
          enxugar(peca);
          return;
        }
        // o adesivo é uma plaquinha do atlas, IRMÃ do encaixe (sem nome): a `fundir()` junta todas numa malha
        const geo = ADESIVOS[id] ? this.atlas.plaquinha(id) : null;
        if (!geo || !e.parent) return;
        const adesivo = new THREE.Mesh(geo, this.atlas.material);
        adesivo.position.copy(e.position);
        adesivo.quaternion.copy(e.quaternion);
        e.parent.add(adesivo);
        e.userData.adesivo = id;
      });
    }
  }

  // ------------------------------------------------------------------ as rodas
  /**
   * AS RODAS SÃO UM LOTE (a lição do ônibus): o pneu torneado com a BANDA
   * BRANCA, a roda creme com os rasgos, a calota de cromo e o miolo na cor da
   * lataria, pintados nos vértices numa geometria só — quatro cópias. As da
   * frente esterçam; os rasgos é que mostram o giro.
   */
  private montarRodas(): void {
    const r = CARRO.roda.raio;
    const m = CARRO.roda.largura / 2;
    const pedacos: THREE.BufferGeometry[] = [];
    const perfil = [[0.2, -m + 0.012], [0.3, -m], [0.325, -m + 0.016], [r, -m * 0.5], [r, m * 0.5], [0.325, m - 0.016], [0.3, m], [0.2, m - 0.012]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    const pneu = new THREE.LatheGeometry(perfil, 22);
    pneu.rotateX(Math.PI / 2);
    pedacos.push(pintada(pneu, P.bebitoPneu));
    const banda = new THREE.RingGeometry(0.218, 0.283, 22);
    banda.translate(0, 0, m + 0.001);
    pedacos.push(pintada(banda, P.bebitoBandaBranca));
    const aro = new THREE.CylinderGeometry(0.205, 0.205, CARRO.roda.largura - 0.03, 22);
    aro.rotateX(Math.PI / 2);
    pedacos.push(pintada(aro, this.ficha.pintura.teto));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const rasgo = new THREE.BoxGeometry(0.036, 0.06, 0.01);
      rasgo.rotateZ(a);
      rasgo.translate(Math.cos(a + Math.PI / 2) * 0.158, Math.sin(a + Math.PI / 2) * 0.158, m - 0.012);
      pedacos.push(pintada(rasgo, P.bebitoPneu));
    }
    const calota = new THREE.SphereGeometry(0.115, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    calota.scale(1, 0.42, 1);
    calota.rotateX(Math.PI / 2);
    calota.translate(0, 0, m - 0.016);
    pedacos.push(pintada(calota, P.bebitoCromo));
    const miolo = new THREE.SphereGeometry(0.04, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
    miolo.scale(1, 0.5, 1);
    miolo.rotateX(Math.PI / 2);
    miolo.translate(0, 0, m + 0.028);
    pedacos.push(pintada(miolo, this.ficha.pintura.lataria));

    const lote = new THREE.InstancedMesh(mergeGeometries(pedacos), toon(0xffffff, { corPorVertice: true }), 4);
    lote.name = 'rodas';
    lote.castShadow = true;
    // (as rodas esterçam e a esfera envolvente do lote é a da primeira pose)
    lote.frustumCulled = false;
    CARRO.eixos.forEach((z, k) => {
      for (const lado of [1, -1] as const) this.lugaresDasRodas.push({ x: lado * CARRO.roda.x, z, lado, frente: k === 0 });
    });
    this.rodas = lote;
    this.group.add(lote);
    this.posicionarRodas();
  }

  private posicionarRodas(): void {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const de = new THREE.Quaternion();
    const X = new THREE.Vector3(1, 0, 0);
    const Y = new THREE.Vector3(0, 1, 0);
    const um = new THREE.Vector3(1, 1, 1);
    this.lugaresDasRodas.forEach((p, i) => {
      // a roda nasce com a calota no `+Z`: vira para o lado dela, gira no eixo e (as da frente) esterça
      q.setFromAxisAngle(Y, p.frente ? this.esterco : 0);
      q.multiply(de.setFromAxisAngle(X, this.giroDasRodas));
      q.multiply(de.setFromAxisAngle(Y, (p.lado * Math.PI) / 2));
      m.compose(new THREE.Vector3(p.x, CARRO.roda.raio, p.z), q, um);
      this.rodas.setMatrixAt(i, m);
    });
    this.rodas.instanceMatrix.needsUpdate = true;
  }

  // ------------------------------------------------------------------ as luzes
  /** as luzes que a cena acende: o halo dos faróis e a poça na rua, o freio e os dois piscas (tudo apagado) */
  private montarLuzes(): void {
    const c = this.carroceria;
    this.farois.name = 'farois-acesos';
    this.freios.name = 'freio-aceso';
    this.piscas.esquerda.name = 'pisca-esquerdo';
    this.piscas.direita.name = 'pisca-direito';
    for (const grupo of [this.farois, this.freios, this.piscas.esquerda, this.piscas.direita]) {
      grupo.visible = false;
      c.add(grupo);
    }
    for (const lado of [-1, 1] as const) {
      const farol = naPonta(lado * FAROL.x, FAROL.y, true, 0.16).p;
      por(this.farois, haloDeLampada(0.85, P.bebitoFarol, 0.7), farol.x, farol.y, farol.z);
      const lanterna = naPonta(lado * LANTERNA.x, LANTERNA.y, false, 0.1).p;
      por(this.freios, haloDeLampada(0.6, P.bebitoLanterna, 0.8), lanterna.x, lanterna.y, lanterna.z);
      // a esquerda do carro é o lado do motorista (`+X`)
      const pisca = this.piscas[lado > 0 ? 'esquerda' : 'direita'];
      const daFrente = naPonta(lado * PISCA_DA_FRENTE.x, PISCA_DA_FRENTE.y, true, 0.08).p;
      por(pisca, haloDeLampada(0.5, P.bebitoPisca, 0.85), daFrente.x, daFrente.y, daFrente.z);
      const deTras = naPonta(lado * LANTERNA.x, LANTERNA.y - 0.17, false, 0.08).p;
      por(pisca, haloDeLampada(0.5, P.bebitoPisca, 0.85), deTras.x, deTras.y, deTras.z);
    }
    // a poça de luz na rua, à frente (fica no chão: é filha da raiz, e não da carroceria que balança)
    const poca = pocaDeLuz(1.5, P.bebitoFarol, 0.3);
    poca.name = 'poca-dos-farois';
    poca.scale.set(1.25, 1.9, 1);
    poca.position.set(0, 0.035, (A + 2.3) * ESCALA);
    poca.visible = false;
    this.group.add(poca);
  }

  // -------------------------------------------------------------- a cena usa
  /** as rodas giram o que o carro andou (para a frente, `+Z`, é positivo) */
  rodar(distancia: number): void {
    this.giroDasRodas += distancia / (CARRO.roda.raio * ESCALA);
    this.posicionarRodas();
  }

  /** esterça: as rodas da frente viram `angulo` (positivo é para a esquerda do carro, `+X`) e o volante gira junto */
  estercar(angulo: number): void {
    this.esterco = THREE.MathUtils.clamp(angulo, -0.6, 0.6);
    this.volante.rotation.z = -this.esterco * 2.6;
    this.posicionarRodas();
  }

  /** o halo dos faróis e a poça de luz na rua */
  acenderFarois(sim: boolean): void {
    this.farois.visible = sim;
    const poca = this.group.getObjectByName('poca-dos-farois');
    if (poca) poca.visible = sim;
  }

  /** a luz de freio */
  frear(sim: boolean): void {
    this.freios.visible = sim;
  }

  /** o pisca de um lado, o alerta (os dois) ou nenhum; o `update` faz piscar */
  pisca(modo: ModoDoPisca): void {
    this.modoDoPisca = modo;
    this.relogioDoPisca = 0;
    if (!modo) this.piscas.esquerda.visible = this.piscas.direita.visible = false;
  }

  /** o TETO SAI (tudo da cintura para cima): a casinha de boneca, para uma cena de dentro */
  mostrarTeto(sim: boolean): void {
    this.teto.visible = sim;
    // (a janela da porta é da porta, mas é "da cintura para cima": sai junto)
    this.porta.cima.visible = sim;
  }

  /**
   * A PORTA DO MOTORISTA: `sim` abre (a dobradiça é a da frente, ela gira para
   * fora), `naHora` pula a animação. `portaAberta` diz quanto ela já abriu
   * (0 fechada, 1 de todo).
   */
  abrirPorta(sim: boolean, naHora = false): void {
    this.porta.alvo = sim ? 1 : 0;
    if (naHora) {
      this.porta.k = this.porta.alvo;
      this.poseDaPorta();
    }
  }

  get portaAberta(): number {
    return this.porta.k;
  }

  /** o quanto a porta abre de todo: ~66° (a dobradiça é a da frente, e ela gira para fora: `rotation.y` negativo) */
  static readonly ANGULO_DA_PORTA = 1.15;

  private poseDaPorta(): void {
    const t = this.porta.k;
    const suave = t * t * (3 - 2 * t);
    this.porta.pivo.rotation.y = -BebitoMobile.ANGULO_DA_PORTA * suave;
  }

  /**
   * A CAMA: os encostos da frente deitam para trás (`quanto` de 0, em pé, a 1,
   * deitados) e, com os assentos dos dois bancos, viram um colchão só, da
   * largura da cabine — a âncora de deitar é `carro.cama`. `qual` deita um
   * lado só; `naHora` pula a animação (o `update` é quem deita devagar).
   */
  deitarEncostos(quanto: number, qual: 'os-dois' | 'motorista' | 'passageiro' = 'os-dois', naHora = false): void {
    const k = THREE.MathUtils.clamp(quanto, 0, 1);
    for (const lado of ['motorista', 'passageiro'] as const) {
      if (qual !== 'os-dois' && qual !== lado) continue;
      this.alvoDoEncosto[lado] = k;
      if (naHora) this.deitado[lado] = k;
    }
    if (naHora) this.poseDosEncostos();
  }

  /** quanto os encostos da frente estão deitados agora (0 em pé, 1 cama feita): o menor dos dois */
  get camaFeita(): number {
    return Math.min(this.deitado.motorista, this.deitado.passageiro);
  }

  /** guarda (ou devolve) o que vai em cima do banco de trás: para sentar gente ali, ou para deitar */
  mostrarCargaDoBanco(sim: boolean): void {
    this.cargaDoBanco.visible = sim;
  }

  private poseDosEncostos(): void {
    const { inclinado } = CABINE.banco;
    for (const lado of ['motorista', 'passageiro'] as const) {
      const t = this.deitado[lado];
      const suave = t * t * (3 - 2 * t);
      this.encostos[lado].rotation.x = -inclinado + (-Math.PI / 2 + inclinado) * suave;
    }
  }

  /** quanto o carro está andando (0 parado, 1 na estrada): é o que faz os penduricalhos balançarem mais */
  andando(quanto: number): void {
    this.movimento = THREE.MathUtils.clamp(quanto, 0, 1);
  }

  /** um solavanco (lombada, buraco): a carroceria pula nas molas e tudo o que pendura sacode */
  solavanco(forca = 1): void {
    this.mola.vy += 0.9 * forca;
    this.mola.varfa += 0.5 * forca;
    this.agito = Math.min(2, this.agito + 0.9 * forca);
  }

  /** empurra as molas: `arfa` positivo afunda o nariz (frear), negativo levanta (arrancar); `rola` deita para o lado (curva) */
  empurrar(arfa: number, rola = 0): void {
    this.mola.varfa += arfa;
    this.mola.vrola += rola;
    this.agito = Math.min(2, this.agito + Math.abs(arfa) * 0.4 + Math.abs(rola) * 0.4);
  }

  update(dt: number): void {
    this.tempo += dt;
    // os encostos deitando (ou levantando), sem pressa
    let mexeu = false;
    for (const lado of ['motorista', 'passageiro'] as const) {
      const falta = this.alvoDoEncosto[lado] - this.deitado[lado];
      if (Math.abs(falta) < 1e-4) continue;
      this.deitado[lado] += Math.sign(falta) * Math.min(Math.abs(falta), dt / 1.1);
      mexeu = true;
    }
    if (mexeu) this.poseDosEncostos();
    // a porta abrindo (ou fechando), um pouco mais depressa que os encostos
    if (this.porta.k !== this.porta.alvo) {
      const falta = this.porta.alvo - this.porta.k;
      this.porta.k += Math.sign(falta) * Math.min(Math.abs(falta), dt / 0.8);
      this.poseDaPorta();
    }
    if (this.modoDoPisca) {
      this.relogioDoPisca += dt;
      const aceso = this.relogioDoPisca % 0.7 < 0.38;
      this.piscas.esquerda.visible = aceso && this.modoDoPisca !== 'direita';
      this.piscas.direita.visible = aceso && this.modoDoPisca !== 'esquerda';
    }
    // as molas (amortecidas: passam do ponto uma vez e assentam)
    const passo = Math.min(dt, 1 / 30);
    const s = this.mola;
    s.vy += (-140 * s.y - 11 * s.vy) * passo;
    s.y += s.vy * passo;
    s.varfa += (-90 * s.arfa - 9 * s.varfa) * passo;
    s.arfa += s.varfa * passo;
    s.vrola += (-90 * s.rola - 9 * s.vrola) * passo;
    s.rola += s.vrola * passo;
    this.carroceria.position.y = THREE.MathUtils.clamp(s.y, -0.06, 0.09);
    this.carroceria.rotation.x = THREE.MathUtils.clamp(s.arfa, -0.07, 0.07);
    this.carroceria.rotation.z = THREE.MathUtils.clamp(s.rola, -0.07, 0.07);

    // o que pendura e o que é de mola: um fio de vida parado, mais andando, muito no solavanco
    this.agito = Math.max(0, this.agito - dt * 0.8);
    const forca = 0.14 + this.movimento * 0.5 + this.agito;
    for (const b of this.balancos) {
      if (b.b.x) b.o.rotation.x = b.x0 + Math.sin(this.tempo * b.b.x[1] + b.fase) * b.b.x[0] * forca;
      if (b.b.z) b.o.rotation.z = b.z0 + Math.sin(this.tempo * b.b.z[1] + b.fase * 1.3) * b.b.z[0] * forca;
    }
  }
}

/** onde ficam as coisas da cara e da tampa (os halos das luzes usam os mesmos números) */
const FAROL = { x: 0.6, y: 0.69, raio: 0.15 };
const PISCA_DA_FRENTE = { x: 0.86, y: 0.56 };
const LANTERNA = { x: 0.74, y: 0.92 };
const PLACA_DE_TRAS = { y: 0.64 };
const BAGAGEIRO = { x: 0.5, z0: -1.45, z1: 0.35 };
const RETROVISOR = { y: 1.8, z: CARRO.zTeto + 0.08 };
/** a borracha dos vidros: a meia largura e a altura do filete, e o raio das quinas (o mesmo em todo vidro) */
const BORRACHA = { meia: 0.022, alto: 0.013, quina: 0.055 };
/** o trilho da porta de correr: a altura e onde ele acaba */
const TRILHO = { y: 1.0, fim: -A + 0.42 };
/** os três adesivos da tampa de trás (à esquerda da placa, em cima dela e à direita) e os dois do vidro */
const ADESIVOS_DA_TAMPA: ReadonlyArray<readonly [number, number]> = [[-0.5, 0.67], [0.18, 0.93], [0.5, 0.67]];
const ADESIVOS_DO_VIDRO: ReadonlyArray<readonly [number, number]> = [[-0.4, 1.32], [0.4, 1.3]];
