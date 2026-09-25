import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import type { Bounds, GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Interactable } from '../../world/Interactable';
import { PRAGAS, type FichaDePraga } from '../../world/bichosDoJardim';
import { GotasDoJardim } from '../../entities/GotasDoJardim';
import { ITENS } from '../../world/itens';
import {
  aspersor, bush, cadeadoDePortao, cerquinha, dioneia, espantalho, picole, pimenteiras,
  tabuasPregadas, toldoDeCanteiro, tonelDeAgua,
} from '../../world/props';
import { MaoDeCartas } from './baralho';
import type { ArmaId } from './armas';
import { MangueiraNoChao } from './mangueira';
import { cartaPorId, type AjudanteDoClube, type FichaDaRodada } from './cartas';
import { ONDAS, nivelDasGotas, planoDaOnda, type EntradaDePraga } from './progressao';
import { cartaDaArma } from './tela';
import { DesenhoDoJato } from './jato';
import { flagDaPraga } from './bestiario';

/**
 * A RODADA DO JARDIM — o minigame da estufa da Josefina, rodando.
 *
 * O plano está em `docs/MINIGAME-JARDIM.md`. Esta é a **etapa 3**: o
 * esqueleto que decide se o resto vale. Uma onda (a primeira, só de
 * Lagartejos), o regador atirando SOZINHO, os bichos entrando pelas brechas e
 * pelos portões atrás de canteiro, a água que acaba e o tonel que enche, as
 * gotas no chão, a tela das três cartas — e o jato de cada carta que mexe no
 * jato, desenhado como a carta descreve (`jato.ts`).
 *
 * ELA NÃO É CUTSCENE: é uma máquina que anda em `atualizar(dt)` com o jogador
 * SOLTO, como o turno do Mania. Os únicos `await` são os da tela de cartas e o
 * da cutscene de um chamado — e a rodada inteira CONGELA enquanto eles duram
 * (bicho, água no ar, gota no chão), senão a escolha da carta custaria um
 * canteiro.
 *
 * ELA NÃO SABE QUE EXISTE UMA ESTUFA. Quem conhece o cenário é a cena, que
 * entrega a `PlantaDoJardim` pronta: onde os bichos nascem, por onde passam,
 * onde estão os canteiros e o tonel.
 *
 * NADA MORRE AQUI (§3 do plano): bicho encharcado SACODE e vai embora pela
 * brecha por onde entrou. "Espantar" é a palavra, e é regra, não texto.
 *
 * ============================================= O QUE CADA CARTA FAZ AQUI
 *
 * As cartas escrevem na `FichaDaRodada`; esta classe só LÊ a ficha. As que já
 * funcionam de ponta a ponta nesta etapa são todas as que mexem no JATO
 * (forma, tinta, impacto e chão, com a animação de cada uma), os números do
 * tanque e do tonel, o passo, a coleta, a vida dos canteiros, e mais três
 * baratas de jardineiro (Fôlego, Chinelada, Descanso na sombra). As regras
 * que dependem de peça que ainda não existe (espantalho, portão emperrado,
 * os chamados agindo, os bichos das outras ondas) ficam para as próximas
 * etapas, e o §6 do plano marca cada uma.
 */

// ------------------------------------------------------------------ ajustes

/** quanto um canteiro aguenta ser comido, antes da Terra adubada */
// 34 (era 24): o Renan achou a rodada difícil — canteiro que aguenta mais é
// tempo a mais para chegar lá, sem mudar o que o jogador faz
const VIDA_DO_CANTEIRO = 34;
/**
 * A AJUDA DO PAR (pedido do Renan): o botão chama quem ficou lá atrás, que
 * pega um regador extra e espanta com UM jato só por `AJUDA_DURA` segundos.
 * Ela carrega com GOTAS, e não com ondas: cada gota pega enche o anel do
 * botão, então jogar bem chama a ajuda mais cedo, e o jogador VÊ ela chegando.
 * O custo sobe a cada uso (30, 45, 60…): na rodada de trinta ondas, se
 * nenhum bicho escapar, dá umas vinte ajudas — uma a cada onda e meia.
 */
const AJUDA_DURA = 10;
/*
 * BALANÇO DAS CARTAS SOMADAS — o Renan venceu as 30 ondas com uma mão forte.
 * Os multiplicadores que viram o jogo quando se somam moram aqui, juntos:
 */
/** o jato de trás do Segundo bico, em fração do da frente */
const SEGUNDO_BICO = 0.6;
/** o regador do parceiro (Os dois na frente), em fração do seu */
const PARCEIRO = 0.6;
/** o máximo que a Compostagem cura um canteiro por onda, em fração da vida */
const COMPOSTO_POR_ONDA = 0.2;
const AJUDA_CUSTO_INICIAL = 30;
const AJUDA_CUSTO_SOBE = 15;
/** a distância do tonel em que o regador enche */
const PERTO_DO_TONEL = 1.9;
/** jatos por segundo que o tonel põe no regador, antes do Refil rápido */
const ENCHE_NO_TONEL = 5;
/** quantas ondas a rodada tem — a tabela do §3 do plano */
export const ONDAS_DA_RODADA = ONDAS.length;
/** o respiro entre uma onda e a outra, em segundos */
const INTERVALO = 6;
/** quantos pontinhos o Olho de jardineira desenha, no máximo */
const PONTOS_DA_TRILHA = 240;
/** os nomes dos três portões, como a dupla vê da porta */
const NOME_DO_PORTAO = ['da esquerda', 'do meio', 'da direita'] as const;

/** como cada praga ANDA e COME — o resto da ficha é do desenho */
const JEITO: Record<string, { velocidade: number; mordida: number; raio: number }> = {
  lagartejo: { velocidade: 1.25, mordida: 1, raio: 0.3 },
  gafanhopo: { velocidade: 1.35, mordida: 1, raio: 0.3 },
  coelhatu: { velocidade: 1.6, mordida: 1.6, raio: 0.45 },
  tucanguru: { velocidade: 1.5, mordida: 1.2, raio: 0.45 },
  preguipolvo: { velocidade: 0.45, mordida: 2.4, raio: 0.9 },
  'mae-lagartejo': { velocidade: 0.55, mordida: 4, raio: 0.8 },
  // a segunda leva (da 15ª onda em diante). O truque de cada um (pulo, voo,
  // concha…) mora em "O JEITO DE CADA BICHO", mais abaixo
  libelagarto: { velocidade: 1.45, mordida: 1, raio: 0.3 },
  formigurico: { velocidade: 1.3, mordida: 0.8, raio: 0.22 },
  tamandubelha: { velocidade: 1.4, mordida: 1.4, raio: 0.5 },
  mosquipotamo: { velocidade: 1.3, mordida: 1.3, raio: 0.5 },
  rinocaracol: { velocidade: 0.5, mordida: 2.8, raio: 0.95 },
  javaponja: { velocidade: 0.6, mordida: 2.2, raio: 0.9 },
  escorpicamelo: { velocidade: 0.6, mordida: 4.5, raio: 0.9 },
};

// ------------------------------------------------------------------ a planta

export interface CanteiroDaPlanta {
  x: number;
  z: number;
  /** meia largura em X e meia profundidade em Z, já com o giro do canteiro */
  meioX: number;
  meioZ: number;
  /** a peça do canteiro: `userData.terra` e `userData.mudas` */
  peca: THREE.Object3D;
  /** a cor das folhas que voam quando ele é comido */
  folha: number;
  /** o que está plantado (os Girassóis vigiam) */
  tipo: string;
  /** como a Josefina chama ele — é o nome que aparece na escolha das cartas */
  nome: string;
  /** o giro da peça no chão (os deitados giram 90°) */
  giro: number;
}

/** quem da estufa ajuda, fora a dupla: a Josefina e os bichos do clube */
export type QuemAjuda = AjudanteDoClube | 'josefina';

/**
 * O ELENCO DA ESTUFA — a ponte da rodada com as entidades da cena.
 *
 * A rodada não sabe que o Capy existe como classe: ela pede "vai até ali",
 * "late", "volta pro posto", e quem conhece o bicho é a cena. É o mesmo corte
 * da planta: a rodada decide O QUE acontece, a cena sabe COMO se mostra.
 */
export interface ElencoDaEstufa {
  /** está dentro da estufa, de serviço? (os chamados só depois da cutscene) */
  presente(quem: QuemAjuda): boolean;
  onde(quem: QuemAjuda): { x: number; z: number };
  /** manda a um ponto; resolve quando chega (e tem teto: nunca prende a rodada) */
  ir(quem: QuemAjuda, x: number, z: number, velocidade?: number): Promise<void>;
  /** anda atrás de um ponto que se mexe, sem promessa (o Noel atrás da gota) */
  seguir(quem: QuemAjuda, x: number, z: number, velocidade?: number): void;
  encarar(quem: QuemAjuda, x: number, z: number): void;
  /** volta ao posto dele, olhando os portões */
  voltarAoPosto(quem: QuemAjuda): void;
  /** o barulho dele (latido, apito, o gluglu do Noel) */
  soar(quem: QuemAjuda): void;
  /** SEM cutscene, já no posto: a rodada que começa com a carta na mão (teste e vitrine) */
  jaEsta(quem: AjudanteDoClube): void;
  /** o Jean-Luc sentado na borda do tonel */
  patoNoTonel(ligado: boolean): void;
}

export interface PlantaDoJardim {
  /** um ponto do lado de FORA da sebe, por porta: é de lá que o bicho aparece */
  entradas: readonly { x: number; z: number }[];
  brechas: readonly { x: number; z: number }[];
  portoes: readonly { x: number; z: number }[];
  /** um passo para dentro de cada portão */
  bocas: readonly { x: number; z: number }[];
  canteiros: readonly CanteiroDaPlanta[];
  tonel: { x: number; z: number; altura: number };
  /** o meio do terreiro e o raio que cobre a estufa inteira (a Chuva) */
  centro: { x: number; z: number; raio: number };
  /** a porta de entrada da estufa: o corredor do meio começa nela */
  porta: { x: number; z: number };
  /** o posto de trás, onde fica quem não está regando, e para onde olha */
  postoDeTras: { x: number; z: number };
  olharDosPortoes: { x: number; z: number };
  /** onde nascem as peças das cartas de jardim */
  lugares: {
    segundoTonel: { x: number; z: number };
    aspersor: { x: number; z: number };
    espantalho: { x: number; z: number };
    /** a cerquinha fica deitada em X, centrada aqui */
    cerquinha: { x: number; z: number; comprimento: number };
  };
  elenco: ElencoDaEstufa;
}

// ------------------------------------------------------------------ estado

interface Canteiro extends CanteiroDaPlanta {
  vida: number;
  vidaMax: number;
  escalas: number[];
  giros: number[];
  terraOriginal: THREE.Material | THREE.Material[] | null;
  /**
   * a Cerca viva. Era "ninguém come", e com isso a rodada não tinha como ser
   * perdida (relato do Renan): agora a cerca tem VIDA PRÓPRIA — a mordida
   * come a cerca primeiro, ela cede, e brota de novo no fim de cada onda.
   */
  protegido: boolean;
  /** quanto a cerca ainda aguenta nesta onda (0 = cedeu), e as moitas dela */
  cerca: number;
  /** quanto a Compostagem já curou este canteiro nesta onda */
  composto: number;
  cercaPeca: THREE.Object3D | null;
  /** o Toldo: aguenta 50% mais */
  toldo: boolean;
  /** o Canteiro de pimenta: quem morde sai correndo */
  pimenta: boolean;
  /** a Planta carnívora: a dioneia na borda e quanto falta para ela abrir de novo */
  carnivora: { peca: THREE.Object3D; espera: number; fecha: number } | null;
  /** o Adubo do Noel: regado nesta onda, a mordida conta pela metade */
  adubado: boolean;
  /** a Folha orvalhada (borrifador): segundos em que a mordida tira metade */
  orvalho: number;
  /** a altura da terra do canteiro (onde a pimenteira planta) */
  alturaDaTerra: number;
}

type Estado = 'andando' | 'comendo' | 'sacudindo' | 'fugindo' | 'voando' | 'preso' | 'parado' | 'recuando';

interface Invasor {
  ficha: FichaDePraga;
  jeito: { velocidade: number; mordida: number; raio: number };
  /** o grupo que a rodada gira e move; `corpo` é a peça do desenho */
  raiz: THREE.Group;
  corpo: THREE.Group;
  partes: Record<string, unknown>;
  barra: THREE.Group;
  enchido: THREE.Mesh;
  x: number;
  z: number;
  rumo: number;
  estado: Estado;
  relogio: number;
  vida: number;
  vidaMax: number;
  porta: number;
  caminho: { x: number; z: number }[];
  passo: number;
  canteiro: Canteiro | null;
  /** um ponto ao longo da borda do canteiro, para os que comem juntos não se empilharem */
  lugarNaBorda: number;
  lento: number;
  gelado: number;
  /** empurrão em curso (tranco, chinelada, susto), em m/s */
  empurraX: number;
  empurraZ: number;
  /** piscada branca de quem acabou de levar água */
  molhado: number;
  fase: number;
  gotasVezes: number;
  voo: { de: { x: number; z: number }; para: { x: number; z: number }; t: number; dur: number } | null;
  chineladaEspera: number;
  /** respiro depois de um tranco da Gota pesada: jatos somados não travam o bicho */
  trancoEspera: number;
  /** na vitrine: onde ele nasce de novo */
  casa: { x: number; z: number } | null;
  /** tonto (apito, coração, pulinho): não anda nem come */
  tonto: number;
  /** recuando: para onde, e por quanto tempo no máximo */
  recuo: { x: number; z: number } | null;
  recuoResta: number;
  /** o Espantalho puxou a atenção dele */
  puxado: boolean;
  /** já passou pelo portão (o Sino da porta toca uma vez por bicho) */
  passouPortao: boolean;
  /**
   * a ponta da Cerquinha que ele ESCOLHEU contornar. Fica escolhida até ele
   * chegar lá — decidir de novo a cada quadro fazia o bicho parado no meio,
   * atrás da cerca, trocar de ponta sem parar e ir e voltar para sempre
   */
  desvio: Ponto2 | null;
  /** o segundo ponto do contorno: a mesma ponta, do lado de lá da cerca */
  desvioDepois: Ponto2 | null;
  /** segundos em que ele ignora a cerca: acabou de contornar, segue em frente */
  semCerca: number;
  /** já levou jato nesta rodada (a Regada caprichada vale no primeiro) */
  regado: boolean;
  /**
   * o Encharcado (borrifador): quantas névoas seguidas ele levou (0 a 5) e
   * quanto falta para secar — seco, a conta volta a zero
   */
  umidade: number;
  umidadeResta: number;
  /** o jeito dele (§5): o pulo, o voo, a concha… — ver "O JEITO DE CADA BICHO" */
  truque: Truque;
}

type Ponto2 = { x: number; z: number };

/**
 * O ESTADO DO TRUQUE DE UM BICHO. Cada praga usa só o pedaço dela; o resto
 * fica no zero. Pedido do Renan: mecânica simples, tirada do DESENHO do bicho.
 */
interface Truque {
  /** segundos até o próximo pulo, voo, gole de gota ou filhote */
  espera: number;
  /** um pulo (ou um voo) em curso: no ar, o jato passa por baixo */
  salto: { de: Ponto2; para: Ponto2; t: number; dur: number; alto: number; voo: boolean } | null;
  /** o truque que é de uma vez só (enrolar, a concha, o pulo de portão) já foi */
  usou: boolean;
  /** rolando enrolado (Coelhatu) e fechado na concha (Rinocaracol): segundos que faltam */
  rola: number;
  concha: number;
  /** as gotas que o Tamandubelha aspirou — ele devolve quando vai embora */
  guardadas: number;
  /** bebendo no tonel (Mosquipótamo, Escorpicamelo), e há quanto tempo */
  bebendo: boolean;
  bebeu: number;
  /** o Escorpicamelo de corcova murcha: corre */
  bravo: boolean;
  /** quantos filhotes a Mãe-Lagartejo já soltou */
  filhotes: number;
}

/** quanto o Escorpicamelo bebe do tonel antes de ir aos canteiros, em segundos */
const O_CHEFE_BEBE = 6;
/** a Mãe-Lagartejo solta um filhote a cada tanto, até este tanto */
const FILHOTES_DA_MAE = 5;

type Especial = 'pressao-cheia' | 'carregado' | 'arco-iris';

/** um jato que sai de um bico: de onde, para onde, e com que força */
interface Tiro {
  /** onde está quem rega (o cone e a sombra contam daqui) */
  origem: { x: number; z: number };
  /** a ponta do bico, no ar — é daqui que a água sai no desenho */
  de: THREE.Vector3;
  rumo: number;
  /** quem foi escolhido (o bico de trás não escolhe ninguém) */
  alvo: Invasor | null;
  dano: number;
  especial?: Especial;
  /** a abertura do leque deste jato, quando não é a da ficha (a Chuveirada dobra) */
  largura?: number;
  /** o Redemoinho (borrifador): esta névoa gira e puxa os bichos em volta */
  redemoinho?: boolean;
}

/** o que a rodada anima na peça da mão */
type GestoDaMao = { tipo: 'giro' | 'balde' | 'treme' | 'coice' | 'aperto'; t: number; dur: number };

export class RodadaDoJardim {
  rodando = false;
  /** a tela de cartas ou uma cutscene está aberta: tudo congela */
  private pausada = false;

  /** a mão desta rodada: nasce de novo a cada `comecar` (§7 — ninguém entra já forte) */
  mao = new MaoDeCartas();
  /** a arma da rodada (`armas.ts`): escolhida na parede das armas, vale até o fim */
  arma: ArmaId = 'regador';
  private ficha: FichaDaRodada = this.mao.ficha();
  /** a mangueira esticada do tonel até a mão (só na rodada de mangueira) */
  private readonly mangueira = new MangueiraNoChao();
  /** os limites da cena, guardados enquanto a mangueira prende a dupla na estufa */
  private limitesDaCena: Bounds | null = null;
  /** o Jato contínuo: quem está levando água sem parar, e há quantos jatos */
  private continuo: { inv: Invasor; vezes: number } | null = null;
  /** a Enchente: o relógio até a próxima, e quanto falta da que está saindo */
  private enchente = 0;
  private enchenteResta = 0;
  /** o Vazamento: o relógio da próxima pocinha na mangueira */
  private vazamento = 0;
  /** o Chicote: cada bicho leva no máximo um tranco da mangueira a cada 1,5 s */
  private readonly chicoteEspera = new WeakMap<Invasor, number>();
  private readonly jato = new DesenhoDoJato();
  private readonly gotas = new GotasDoJardim();

  private canteiros: Canteiro[] = [];
  private invasores: Invasor[] = [];
  private plano: EntradaDePraga[] = [];
  private onda = 0;
  private tempoDaOnda = 0;
  private espantados = 0;

  private agua = 0;
  private enchendo = false;
  private tanqueCheio = true;
  private recarga = 0;
  private jatosDados = 0;
  private parado = 0;
  private carga = 0;
  private ultimaPosicao = new THREE.Vector3();
  private andouDesdeGaroa = 0;
  private garoas: Array<{ x: number; z: number; vida: number; pisados: Set<Invasor> }> = [];
  private crivo = 0;
  private geiser = 0;
  private chuva = 0;
  private danca = 0;
  private dancando = 0;
  private baldeSegurado = 0;
  private baldeEspera = 0;
  private gesto: GestoDaMao | null = null;
  private relogioDoPainel = 0;
  private relogioDoTonel = 0;

  private nivel = 0;
  private juntadas = 0;
  private suspensas: Interactable[] = [];
  private vitrine = false;
  private semente = 20260923;

  /** quantas ondas esta rodada joga — o teste baixa para 1, para caber no tempo */
  ondasDaRodada = ONDAS_DA_RODADA;
  /** o respiro entre as ondas: conta para baixo, e a onda seguinte começa no zero */
  private intervalo = 0;
  /** os bichos anunciados (tanque e chefe) que já tiveram o aviso da Josefina */
  private avisados = new Set<EntradaDePraga>();

  // ---- as cartas de jardineiro
  /** quanto tempo você está andando sem parar (o Pique) */
  private correndo = 0;
  private poeiraEspera = 0;
  /** o impulso do Pé na poça e o do Picolé, em segundos */
  private impulsoPoca = 0;
  private impulsoPicole = 0;
  private assobio = 0;
  private pulinhoEspera = 0;
  /** a próxima meta de gotas do Coraçãozinho */
  private proximoCoracao = 20;
  /** a Sorte e o Bis valem uma vez só: depois de usados, ficam na mão sem fazer nada */
  private sorteGasta = false;
  private bisGasto = false;
  /** quem controla agora (a Troca de turno percebe quando muda) */
  private quemRega = '';
  /** os regadores que a rodada pôs na mão de alguém, para tirar no fim */
  private regadoresDados: string[] = [];
  /** o outro regador (Os dois na frente, Lá de trás): cadência própria */
  private recargaDoParceiro = 0;
  private ladoDeTras = 0;

  // ---- as cartas de jardim e do clube
  /** o que vale uma vez por onda, e volta a valer na seguinte */
  private usadoNaOnda = new Set<string>();
  /** colisores como a cena os deixou: o fim da rodada devolve esta lista */
  private colisoresDaCena: ReturnType<WorldBuilder['colisoresAgora']> | null = null;
  /** as peças que as cartas puseram na estufa, para tirar no fim */
  private pecasDasCartas: THREE.Object3D[] = [];
  private segundoTonel: THREE.Object3D | null = null;
  private aspersorPeca: THREE.Object3D | null = null;
  private aspersorRelogio = 0;
  private cerquinhaPeca: THREE.Object3D | null = null;
  private espantalhoPeca: THREE.Object3D | null = null;
  private espantalhoResta = 0;
  private picolePeca: THREE.Object3D | null = null;
  /** o portão fechado pelo Portão emperrado */
  private emperrado: number | null = null;
  /**
   * AS TRANCAS dos portões: a Estufa trancada (os três, 10 s) e a Gina (um,
   * 20 s). O relógio de cada uma só anda quando tem bicho esperando nela — um
   * portão trancado sem ninguém na frente não segura nada.
   */
  private trancas: Array<{ porta: number; resta: number; quem: 'cadeado' | 'gina'; peca: THREE.Object3D | null }> = [];
  private walterDePlantao = 0;
  /** o Walter de plantão correndo até um bicho (o latido é quando chega) */
  private plantao: { alvo: Invasor; resta: number } | null = null;
  private sinoEspera = 0;
  /** o próximo roteiro, já sorteado (o Noel avisa o portão dele antes) */
  private proximoPlano: EntradaDePraga[] | null = null;

  // ---- os chamados agindo
  private capy: { resta: number; alvo: { x: number; z: number }; recarga: number } | null = null;
  private noel: { resta: number; leva: number; entregando: boolean } | null = null;
  private walter: { alvo: Canteiro; chegou: boolean; resta: number } | null = null;
  private mutirao = 0;

  // ---- a ajuda do par
  /** gotas juntadas desde a última ajuda, e quanto a próxima custa */
  private ajudaCarga = 0;
  private ajudaCusto = AJUDA_CUSTO_INICIAL;
  /** segundos que ainda faltam de ajuda (0 = parada) */
  private ajudaResta = 0;
  private ajudaRecarga = 0;
  private ajudaVezes = 0;
  /** o regador extra foi dado só para a ajuda (sai quando ela acaba) */
  private ajudaDeuRegador = false;
  /** depois da ajuda o par volta para o posto; chegando, vira para os portões */
  private parVoltando = false;

  /** o pontilhado do Olho de jardineira */
  private readonly trilha: THREE.InstancedMesh;
  private relogioDaTrilha = 0;

  /**
   * QUANTAS VEZES CADA CARTA FEZ A COISA DELA, pela id. É o que o teste lê
   * (`scripts/cartasNaRodada.mjs`) para provar que a carta não só está na mão,
   * como agiu — foto nenhuma prova que o espantalho puxou os bichos.
   */
  readonly efeitos: Record<string, number> = {};
  private contar(id: string): void {
    this.efeitos[id] = (this.efeitos[id] ?? 0) + 1;
  }

  /** o teste escolhe o canteiro das cartas "à sua escolha" sem clicar */
  escolhaForcada: number | null = null;

  /** a cena ouve isto: carta pega (para a cutscene de um chamado) */
  aoPegarCarta: ((id: string) => Promise<void>) | null = null;
  /** a cena ouve isto: a rodada acabou, com quantos canteiros de pé */
  aoAcabar: ((resultado: {
    canteiros: number; total: number; espantados: number;
    /** a onda em que acabou, de quantas; e se acabou jogando ou foi interrompida */
    ondas: number; de: number; motivo: 'fim' | 'interrompida';
    /** quantos de cada praga foram espantados, pela id */
    porPraga: Record<string, number>;
    /** as cartas da mão no fim, na ordem em que foram pegas */
    cartas: string[];
    nivel: number;
    /** as que entraram no livro pela primeira vez nesta rodada */
    novas: string[];
  }) => void) | null = null;


  constructor(
    private readonly w: WorldBuilder,
    private readonly g: GameAPI,
    private readonly planta: PlantaDoJardim,
  ) {
    w.root.add(this.jato.grupo);
    this.jato.aoSoar = (nome) => this.g.som(nome);
    w.root.add(this.gotas.grupo);
    w.root.add(this.mangueira.malha);
    this.canteiros = planta.canteiros.map((c) => {
      const mudas = (c.peca.userData.mudas ?? []) as THREE.Object3D[];
      const terra = c.peca.userData.terra as THREE.Mesh | undefined;
      const alturaDaTerra = terra ? new THREE.Box3().setFromObject(terra).max.y : 0.3;
      return {
        ...c,
        vida: VIDA_DO_CANTEIRO,
        vidaMax: VIDA_DO_CANTEIRO,
        escalas: mudas.map((m) => m.scale.x),
        giros: mudas.map((m) => m.rotation.y),
        terraOriginal: terra ? terra.material : null,
        protegido: false,
        cerca: 0,
        composto: 0,
        cercaPeca: null,
        toldo: false,
        pimenta: false,
        carnivora: null,
        adubado: false,
        orvalho: 0,
        alturaDaTerra,
      };
    });

    // o pontilhado do Olho de jardineira: discos no chão, reaproveitados
    const disco = new THREE.CircleGeometry(0.07, 10);
    disco.rotateX(-Math.PI / 2);
    this.trilha = new THREE.InstancedMesh(disco, toon(P.efeitoTrilha, { glow: 0.5, decal: true }), PONTOS_DA_TRILHA);
    this.trilha.count = 0;
    this.trilha.frustumCulled = false;
    this.trilha.renderOrder = 2;
    w.root.add(this.trilha);
  }

  private sorte(): number {
    let s = this.semente;
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    this.semente = s >>> 0;
    return (this.semente % 100000) / 100000;
  }

  private readonly dado = (): number => this.sorte();

  // ================================================================ liga

  /**
   * COMEÇA A RODADA. A mão de cartas nasce vazia e o nível no zero: ninguém
   * entra na rodada já forte (§7). `cartas` só serve ao teste e à vitrine —
   * uma rodada de verdade começa sempre de mão vazia.
   */
  comecar(opcoes: { cartas?: readonly string[]; vitrine?: boolean; arma?: ArmaId } = {}): void {
    if (this.rodando) return;
    this.rodando = true;
    this.pausada = false;
    this.vitrine = !!opcoes.vitrine;
    // a lista de colisores como a cena deixou: as cartas mexem numa cópia dela
    this.colisoresDaCena = this.w.colisoresAgora();
    this.quemRega = this.g.playerId();
    this.usadoNaOnda.clear();
    this.sorteGasta = false;
    this.bisGasto = false;
    this.proximoCoracao = 20;
    this.emperrado = null;
    this.intervalo = 0;
    this.proximoPlano = null;
    for (const k of Object.keys(this.efeitos)) delete this.efeitos[k];
    /*
     * A MÃO NASCE VAZIA a cada rodada. Antes ela era criada uma vez com a
     * rodada e nunca mais: a segunda rodada na mesma visita à estufa começava
     * com as cartas da primeira — e o teste das cartas pegou isso.
     */
    this.arma = opcoes.arma ?? 'regador';
    this.mao = new MaoDeCartas(this.arma);
    for (const id of opcoes.cartas ?? []) this.mao.pegar(id);
    this.aplicarFicha(true);
    this.continuo = null;
    this.superMolhador = 0;
    this.superResta = 0;
    this.giganteRelogio = 0;
    this.giganteResta = 0;
    this.nevoasParadas = [];
    this.teimosa = null;
    this.enchente = 0;
    this.enchenteResta = 0;
    this.vazamento = 0;
    /*
     * A MANGUEIRA NÃO PASSA DOS PORTÕES (pedido do Renan: ela fica "restrita
     * apenas à parte de dentro da estufa por causa dos tonéis"). O jeito mais
     * honesto é o da parede: o limite de andar da cena encolhe até um palmo
     * antes dos portões enquanto a rodada dura, e volta no fim.
     */
    if (this.ficha.regras.has('presa-na-estufa')) {
      const b = this.w.bounds;
      this.limitesDaCena = { ...b };
      const portao = Math.max(...this.planta.portoes.map((p) => p.z));
      this.w.bounds = { ...b, minZ: Math.max(b.minZ, portao + 0.45) };
    }
    this.agua = this.ficha.tanque;
    this.tanqueCheio = true;
    this.onda = 0;
    this.nivel = 0;
    this.juntadas = 0;
    this.espantados = 0;
    this.espantadosPorPraga = {};
    this.dicasDadas.clear();
    this.esponjas = [];
    this.novasNoLivro = [];
    this.ajudaCarga = 0;
    this.ajudaCusto = AJUDA_CUSTO_INICIAL;
    this.ajudaResta = 0;
    this.ajudaVezes = 0;
    this.ajudaDeuRegador = false;
    this.parVoltando = false;
    // o pedido que tiver sobrado de antes não vale: começa do zero
    this.g.pedidoDeAjudaDoPar();
    this.jatosDados = 0;
    this.crivo = 0;
    this.geiser = 0;
    this.chuva = 0;
    this.ultimaPosicao.copy(this.g.playerPosition());

    /**
     * TUDO O QUE NÃO É DA RODADA DESLIGA — a porta de volta, o "regar" dos
     * canteiros, a conversa com a Josefina. A lista é calculada aqui, e não
     * recebida pronta, pelo mesmo motivo do turno do Mania: ponto novo que
     * alguém puser na cena amanhã já nasce suspenso durante a rodada.
     */
    this.suspensas = this.w.interactables.filter((p) => p.enabled);
    for (const p of this.suspensas) p.enabled = false;

    /*
     * QUEM ESTÁ ATRÁS FICA ATRÁS: o T troca o corpo, e não a posição, então
     * trocar no meio da rodada deixava o regador lá atrás e quem rega de mão
     * vazia. Só a Troca de turno destrava — e ela é a carta que conserta isso.
     */
    this.g.bloquearTroca(!this.ficha.regras.has('troca-de-turno'));

    // começou com a carta na mão (teste, vitrine): quem ela chama já está no
    // posto, e as de "canteiro à sua escolha" escolhem agora
    for (const id of opcoes.cartas ?? []) {
      for (const q of cartaPorId(id)?.chama ?? []) this.planta.elenco.jaEsta(q);
      void this.cartaNova(id);
    }

    this.g.showExperiencia(nivelDasGotas(0));
    this.enquadrarRodada();
    /*
     * A OCLUSÃO (pedido do Renan): gota que cai atrás de uma árvore ou da
     * parede dos portões sumia. Com a vigia ligada, o que fica entre a câmera
     * e um bicho ou uma gota fica translúcido. Os próprios bichos, as gotas e
     * a água nunca esmaecem.
     */
    this.g.vigiarOclusao({
      pontos: () => [
        ...this.invasores.map((i) => ({ x: i.x, y: i.ficha.alturaDaBarra * 0.45, z: i.z })),
        ...this.gotasNoChao().map((p) => ({ x: p.x, y: 0.35, z: p.z })),
      ],
      ignorar: () => [this.gotas.grupo, this.jato.grupo, this.trilha, ...this.invasores.flatMap((i) => [i.raiz, i.barra])],
    });
    // a música da defesa: fofa, mas com pressa (a vitrine é para olhar, fica a da cena)
    if (!this.vitrine) this.g.trocarMusica('rodada-do-jardim');
    if (this.vitrine) {
      this.onda = 1;
      this.plano = [];
    } else {
      this.proximaOnda();
    }
    this.pintarPainel();
  }

  /**
   * UMA ONDA NOVA: o roteiro dela (já sorteado, se o Noel avisou), o que vale
   * uma vez por onda volta a valer, e o que acontece no começo de toda onda
   * (a Sementeira brota, os portões trancam, a Gina vai para o portão dela).
   */
  private proximaOnda(): void {
    this.onda += 1;
    this.tempoDaOnda = 0;
    this.plano = this.proximoPlano ?? planoDaOnda(this.onda, this.dado);
    this.proximoPlano = null;
    this.remapearEmperrado(this.plano);
    this.usadoNaOnda.clear();
    this.avisados.clear();
    for (const c of this.canteiros) c.adubado = false;
    if (this.onda > 1) {
      const estreia = ONDAS[this.onda - 1]?.estreia;
      const ficha = estreia ? PRAGAS.find((p) => p.id === estreia) : null;
      this.g.toast(
        ficha ? `Onda ${this.onda}: chegam os ${ficha.nome}s`
          : this.onda >= this.ondasDaRodada ? `Onda ${this.onda}: a última leva`
            : `Onda ${this.onda} de ${this.ondasDaRodada}`,
        '🌿',
      );
    }
    this.comecoDaOnda();
  }

  /**
   * ACABA, arruma a estufa e devolve tudo como estava: os canteiros voltam
   * (a Josefina replanta), o regador volta a ser a lata de fábrica, o painel
   * some, as peças das cartas saem e os pontos da cena religam.
   */
  terminar(motivo: 'fim' | 'interrompida' = 'interrompida'): void {
    if (!this.rodando) return;
    this.rodando = false;
    const vivos = this.canteiros.filter((c) => c.vida > 0).length;
    for (const inv of this.invasores) this.tirar(inv);
    this.invasores = [];
    this.jato.limpar();
    this.gotas.limpar();
    this.garoas = [];
    this.g.mirarJogador(null);
    this.g.setVelocidadeDoJogador(1);
    this.g.showJardim(null);
    this.g.showExperiencia(null);
    this.g.vestirRegador(null);
    this.g.bloquearTroca(false);
    this.mangueira.esconder();
    if (this.limitesDaCena) {
      this.w.bounds = this.limitesDaCena;
      this.limitesDaCena = null;
    }
    // a câmera volta ao zoom da estufa (o 11 das cutscenes da cena)
    if (!this.vitrine) this.g.setZoom(11);
    this.g.trocarMusica(null);
    this.g.vigiarOclusao(null);
    this.ajudaResta = 0;
    this.parVoltando = false;
    this.pararGesto();
    this.desmontarCartas();
    for (const c of this.canteiros) this.replantar(c);
    for (const p of this.suspensas) p.enabled = true;
    this.suspensas = [];
    this.aoAcabar?.({
      canteiros: vivos, total: this.canteiros.length, espantados: this.espantados,
      ondas: this.onda, de: this.ondasDaRodada, motivo,
      porPraga: { ...this.espantadosPorPraga },
      cartas: [...this.mao.ids],
      nivel: this.nivel,
      novas: [...this.novasNoLivro],
    });
  }

  /** para o teste: o que está acontecendo agora */
  estado(): Record<string, unknown> {
    return {
      rodando: this.rodando,
      pausada: this.pausada,
      arma: this.arma,
      limiteZ: this.w.bounds.minZ,
      mangueira: this.mangueira.malha.visible,
      continuo: this.continuo?.vezes ?? 0,
      gigante: this.giganteResta,
      nevoasParadas: this.nevoasParadas.length,
      teimosa: this.teimosa ? this.teimosa.alvo.ficha.id : null,
      enchente: this.enchenteResta,
      onda: this.onda,
      ondas: this.ondasDaRodada,
      intervalo: this.intervalo,
      agua: this.agua,
      tanque: this.ficha.tanque,
      nivel: this.nivel,
      juntadas: this.juntadas,
      mao: [...this.mao.ids],
      espantados: this.espantados,
      invasores: this.invasores.map((i) => ({
        praga: i.ficha.id, x: i.x, z: i.z, estado: i.estado, vida: i.vida, vidaMax: i.vidaMax,
        lento: i.lento > 0, gelado: i.gelado > 0, tonto: i.tonto > 0, puxado: i.puxado, porta: i.porta,
        noAr: !!i.truque.salto, voando: !!i.truque.salto?.voo, altura: i.raiz.position.y,
        rola: i.truque.rola > 0, concha: i.truque.concha > 0, bebendo: i.truque.bebendo && i.estado === 'comendo',
        guardadas: i.truque.guardadas, bravo: i.truque.bravo, escala: i.corpo.scale.x,
      })),
      tonelSeco: this.tonelBebido(),
      esponjas: this.esponjas.length,
      canteiros: this.canteiros.map((c) => ({
        x: c.x, z: c.z, nome: c.nome, vida: c.vida, vidaMax: c.vidaMax,
        protegido: c.protegido, cerca: c.cerca, toldo: c.toldo, pimenta: c.pimenta, carnivora: !!c.carnivora, adubado: c.adubado,
      })),
      faltamEntrar: this.plano.length,
      gotasNoAr: this.jato.gotasNoAr,
      gotasNoChao: this.gotas.quantasNoChao,
      jatosDados: this.jatosDados,
      desenho: this.jato.contagem,
      carga: this.carga,
      efeitos: { ...this.efeitos },
      emperrado: this.emperrado,
      trancas: this.trancas.map((t) => ({ porta: t.porta, resta: t.resta, quem: t.quem })),
      velocidade: this.velocidadeAgora,
      segundoTonel: !!this.segundoTonel,
      espantalho: this.espantalhoResta,
      picole: this.picolePeca ? { x: this.picolePeca.position.x, z: this.picolePeca.position.z } : null,
      chamados: { capy: !!this.capy, noel: !!this.noel, walter: !!this.walter, mutirao: this.mutirao },
      trilha: this.trilha.count,
      ajuda: { carga: this.ajudaCarga, custo: this.ajudaCusto, resta: this.ajudaResta, vezes: this.ajudaVezes, pronta: this.ajudaPronta },
    };
  }

  // ================================================================ as cartas

  /** Lê a ficha de novo (carta nova) e empurra o que ela muda no mundo. */
  private aplicarFicha(inicio = false): void {
    const antes = this.ficha;
    this.ficha = this.mao.ficha();
    this.g.vestirRegador(this.mao.estiloDoRegador());
    this.g.setVelocidadeDoJogador(this.ficha.velocidade);
    this.recalcularVida(inicio);
    // tanque maior: a água que cabe a mais chega cheia
    if (!inicio && this.ficha.tanque > antes.tanque) this.agua += this.ficha.tanque - antes.tanque;
    this.montarCartas();
  }

  /**
   * A VIDA MÁXIMA de cada canteiro: a Terra adubada vale para todos, o Toldo
   * só para o dele. O que está de pé muda na mesma proporção — carta nova
   * nunca "cura" nem "machuca" de repente.
   */
  private recalcularVida(inicio = false): void {
    for (const c of this.canteiros) {
      const max = VIDA_DO_CANTEIRO * this.ficha.vidaDoCanteiro * (c.toldo ? 1.5 : 1);
      c.vida = inicio ? max : c.vida * (max / c.vidaMax);
      c.vidaMax = max;
    }
  }

  /**
   * SUBIU DE NÍVEL: a rodada congela, a tela das três cartas abre, e a carta
   * pega entra na mão. Cada nível ganho é uma tela — pular uma seria perder a
   * carta dela.
   */
  private async subir(ate: number): Promise<void> {
    this.pausada = true;
    this.g.mirarJogador(null);
    while (this.nivel < ate && this.rodando) {
      this.nivel += 1;
      await this.umaTelaDeCartas();
      /*
       * O PRÊMIO DE CINCO EM CINCO NÍVEIS (pedido do Renan): no 5 uma tela a
       * mais, no 10 duas, no 15 uma, no 20 duas — e segue alternando. Cada tela
       * extra é igual à de sempre (três cartas sorteadas, escolhe uma); só o
       * topo diz que é prêmio.
       */
      const extras = cartasDePremio(this.nivel);
      for (let i = 1; i <= extras && this.rodando; i++) {
        this.contar('premio-de-nivel');
        await this.umaTelaDeCartas({ atual: i, total: extras });
      }
    }
    this.pausada = false;
  }

  /** uma tela das três cartas no nível de agora, e a carta pega entra na mão */
  private async umaTelaDeCartas(premio?: { atual: number; total: number }): Promise<void> {
    // a Sorte de principiante: esta tela sobe uma raridade, uma vez só
    const acima = this.ficha.regras.has('sorte-de-principiante') && !this.sorteGasta;
    if (acima) {
      this.sorteGasta = true;
      this.contar('sorte-de-principiante');
    }
    const oferta = this.mao.oferta(this.nivel, this.dado, acima);
    const id = await this.g.escolherCartaDoJardim(oferta.map((c) => cartaDaArma(c, this.arma)), {
      nivel: this.nivel,
      mao: this.mao.cartas.map((c) => ({ id: c.id, nome: c.nome, icone: c.icone, raridade: c.raridade })),
      premio,
    });
    // a carta que a Sorte subiu pode estar abaixo do piso do nível: vale mesmo assim
    await this.pegarCarta(id, acima ? Infinity : this.nivel);
  }

  /** a carta escolhida: entra na mão, a ficha muda, e o que ela faz NA HORA acontece */
  async pegarCarta(id: string, nivel = this.nivel): Promise<void> {
    const carta = cartaPorId(id);
    if (!carta) return;
    const bis = this.ficha.regras.has('bis') && !this.bisGasto;
    this.mao.pegar(id, Math.max(nivel, 1));
    if (carta.repetivel) {
      this.naHora(carta.naHora);
      this.g.toast(carta.texto, carta.icone);
      return;
    }
    // O LIVRO DAS CARTAS: escolher uma vez basta para ela ficar na coleção
    this.anotarNoLivro(id);
    // o Bis: a carta de série pega leva o degrau de cima junto
    if (bis) {
      const acima = proximoDegrau(id);
      if (acima && this.mao.pegar(acima.id, Infinity)) {
        this.anotarNoLivro(acima.id);
        this.bisGasto = true;
        this.contar('bis');
        this.g.toast(`Bis! ${acima.nome}`, '🔁');
        this.g.som('brotar');
      }
    }
    this.aplicarFicha();
    const estava = this.pausada;
    this.pausada = true;
    await this.cartaNova(id);
    if (carta.chama && this.aoPegarCarta) {
      await this.aoPegarCarta(id);
      // a cutscene do chamado mexe na câmera: a rodada volta ao enquadramento dela
      this.enquadrarRodada();
    }
    this.pausada = estava;
  }

  /** as cartas que entraram no livro pela primeira vez nesta rodada */
  private novasNoLivro: string[] = [];
  private anotarNoLivro(id: string): void {
    if (this.g.desbloquearCartaDoJardim(id)) this.novasNoLivro.push(id);
  }

  /**
   * O QUE UMA CARTA PERGUNTA OU MONTA quando chega: as quatro de "um canteiro
   * à sua escolha" perguntam qual, e o Portão emperrado prega as tábuas.
   */
  private async cartaNova(id: string): Promise<void> {
    if (id === 'portao-emperrado') {
      this.emperrar();
      return;
    }
    const pergunta: Record<string, string> = {
      'cerca-viva': 'Qual canteiro a cerca viva abraça?',
      toldo: 'Em qual canteiro vai o toldo?',
      'canteiro-de-pimenta': 'Onde eu planto a pimenta?',
      'planta-carnivora': 'Qual canteiro vira dioneia?',
    };
    if (!pergunta[id]) return;
    const c = await this.escolherCanteiro(pergunta[id]);
    if (!c || !this.rodando) return;
    if (id === 'cerca-viva') this.cercarCanteiro(c);
    else if (id === 'toldo') this.cobrirCanteiro(c);
    else if (id === 'canteiro-de-pimenta') this.apimentarCanteiro(c);
    else this.plantarDioneia(c);
  }

  /**
   * A ESCOLHA DO CANTEIRO: os quatro vivos mais perto de você, pelo nome que
   * a Josefina dá a eles. Quatro, e não oito: botão demais numa tela de
   * celular é lista, e lista não é escolha rápida.
   */
  private async escolherCanteiro(pergunta: string): Promise<Canteiro | null> {
    const eu = this.g.playerPosition();
    const vivos = this.canteiros.filter((c) => c.vida > 0)
      .sort((a, b) => Math.hypot(a.x - eu.x, a.z - eu.z) - Math.hypot(b.x - eu.x, b.z - eu.z))
      .slice(0, 4);
    if (vivos.length === 0) return null;
    if (this.escolhaForcada !== null) return vivos[Math.min(this.escolhaForcada, vivos.length - 1)];
    const i = await this.g.ask(pergunta, vivos.map((c) => c.nome), 'Josefina');
    return vivos[i] ?? vivos[0];
  }

  /** os CONSOLOS: não entram na mão, fazem uma coisa agora */
  private naHora(efeito: string | undefined): void {
    const eu = this.g.playerPosition();
    if (efeito === 'encher-tanque') {
      this.agua = this.ficha.tanque;
      this.tanqueCheio = true;
      this.jato.anelDeAgua(this.pontaDoBico(), 0.8, 'giro', this.ficha.jato);
      this.g.som('gluglu');
    } else if (efeito === 'curar-canteiro') {
      const pior = [...this.canteiros].sort((a, b) => a.vida / a.vidaMax - b.vida / b.vidaMax)[0];
      if (pior) {
        pior.vida = Math.max(pior.vida, pior.vidaMax * 0.5);
        this.pintarCanteiro(pior);
      }
    } else if (efeito === 'susto') {
      for (const inv of this.invasores) {
        const d = Math.hypot(inv.x - eu.x, inv.z - eu.z);
        if (d < 4 && this.vulneravel(inv)) this.empurrar(inv, inv.x - eu.x, inv.z - eu.z, 3);
      }
    }
  }

  // ================================================================ o quadro

  /**
   * Quanto o relógio da rodada anda por segundo de jogo. É 1 no jogo; o teste
   * sobe para a onda inteira caber no Chromium sem tela (que já roda a ~1/5).
   */
  escalaDoTempo = 1;

  /** onde estão as gotas no chão — o robô do teste anda até elas */
  gotasNoChao(): Array<{ x: number; z: number }> {
    return this.gotas.grupo.children
      .filter((o) => o.visible)
      .map((o) => ({ x: o.position.x, z: o.position.z }));
  }

  atualizar(dtDoJogo: number): void {
    if (!this.rodando) return;
    const dt = dtDoJogo * this.escalaDoTempo;
    const pausado = this.pausada;
    // as gotas no chão precisam do quadro mesmo pausadas (o `pausado` delas
    // congela a vida e o pulo, e não o desenho)
    const pegas = this.gotas.update(pausado ? 0 : dt, this.g.playerPosition(), this.ficha.coleta, pausado);
    if (pausado) return;

    this.jato.update(dt);
    this.chegadas(dt);
    for (const inv of [...this.invasores]) this.viver(inv, dt);
    this.regador(dt);
    this.pisarNaEsponja(dt);
    this.animarGesto(dt);
    this.garoa(dt);
    this.nevoaNoAr(dt);
    this.ajudaDoPar(dt);
    this.cartasDoJardineiro(dt);
    this.cartasDoJardim(dt);
    this.chamadosAgindo(dt);
    this.animarPecas(dt);
    this.desenharTrilha(dt);

    this.receberGotas(pegas);

    this.relogioDoPainel -= dt;
    if (this.relogioDoPainel <= 0) {
      this.relogioDoPainel = 0.1;
      this.pintarPainel();
    }
    this.fimDaOnda(dt);
  }

  /**
   * GOTAS QUE CHEGARAM NA MÃO — pisadas, puxadas, ou trazidas pelo Noel. É o
   * único lugar que soma experiência, e por isso é aqui que o Coraçãozinho
   * conta de vinte em vinte e o Ímã de gota puxa o chão inteiro.
   */
  private receberGotas(n: number): void {
    if (n <= 0) return;
    const r = this.ficha.regras;
    this.g.som('pegar');
    this.juntadas += n;
    if (this.ajudaResta <= 0) this.ajudaCarga = Math.min(this.ajudaCusto, this.ajudaCarga + n);
    if (r.has('coracaozinho') && this.juntadas >= this.proximoCoracao) {
      while (this.proximoCoracao <= this.juntadas) this.proximoCoracao += 20;
      this.g.soltarCoracoes(3);
      const eu = this.g.playerPosition();
      for (const inv of this.invasores) {
        if (this.vulneravel(inv) && Math.hypot(inv.x - eu.x, inv.z - eu.z) < 4) inv.tonto = Math.max(inv.tonto, 1);
      }
      this.contar('coracaozinho');
    }
    const agora = nivelDasGotas(this.juntadas);
    this.g.showExperiencia(agora);
    if (agora.nivel > this.nivel && !this.pausada) {
      if (r.has('ima-de-gota') && this.gotas.atrairTodas() > 0) {
        this.g.som('brotar');
        this.contar('ima-de-gota');
      }
      void this.subir(agora.nivel);
    }
  }

  private pintarPainel(): void {
    this.g.showJardim({
      onda: this.onda,
      ondas: this.ondasDaRodada,
      agua: this.agua,
      tanque: this.ficha.tanque,
      infinita: this.ficha.regras.has('agua-infinita'),
      canteiros: this.canteiros.filter((c) => c.vida > 0).length,
      totalDeCanteiros: this.canteiros.length,
      enchendo: this.enchendo,
      ajuda: {
        nome: this.g.companionName(),
        carga: this.ajudaCusto > 0 ? this.ajudaCarga / this.ajudaCusto : 0,
        pronta: this.ajudaPronta,
        resta: this.ajudaResta,
      },
    });
  }

  /**
   * A ONDA ACABOU quando ninguém falta entrar e não sobrou bicho na estufa.
   * Aí vem o RESPIRO (`INTERVALO`): o que as cartas fazem no fim da onda
   * acontece, e a próxima começa. A rodada acaba depois da última — ou na
   * hora em que o último canteiro cai.
   */
  private fimDaOnda(dt: number): void {
    if (this.vitrine) return;
    const semCanteiro = this.canteiros.every((c) => c.vida <= 0);
    if (semCanteiro) {
      this.terminar('fim');
      return;
    }
    if (this.intervalo > 0) {
      this.intervalo -= dt;
      if (this.intervalo <= 0) this.proximaOnda();
      return;
    }
    if (this.plano.length > 0 || this.invasores.length > 0) return;
    if (this.onda < this.ondasDaRodada) {
      this.intervalo = INTERVALO;
      this.fimDeUmaOnda();
      return;
    }
    this.terminar('fim');
  }

  // ================================================================ os bichos

  private chegadas(dt: number): void {
    this.tempoDaOnda += dt;
    /*
     * O GRANDÃO NUNCA CHEGA SEM AVISO (§3 do plano): quatro segundos antes, a
     * Josefina grita de onde ele vem, e o chão ronca.
     */
    for (const e of this.plano) {
      if (!e.anunciada || this.avisados.has(e) || e.t - this.tempoDaOnda > 4) continue;
      this.avisados.add(e);
      const ficha = PRAGAS.find((p) => p.id === e.praga);
      const portao = `portão ${NOME_DO_PORTAO[e.porta]}`;
      this.g.toast(
        ficha?.tier === 'chefe'
          ? `Josefina: “É ${ficha.artigo ?? 'o'} ${ficha.nome}! Pelo ${portao}!”`
          : `Josefina: “Vem um grandão pelo ${portao}!”`,
        '🐢',
      );
      this.g.som('ronco');
      const p = this.planta.portoes[e.porta];
      this.jato.ondaDeSom(p.x, p.z + 0.6, 2.2);
    }
    while (this.plano.length > 0 && this.plano[0].t <= this.tempoDaOnda) {
      const e = this.plano.shift()!;
      this.nascer(e.praga, e.porta, null, e.seguidor);
    }
    if (this.vitrine) {
      for (const inv of this.invasores) {
        if (inv.estado === 'parado' && inv.casa) {
          inv.x += (inv.casa.x - inv.x) * Math.min(1, dt * 2);
          inv.z += (inv.casa.z - inv.z) * Math.min(1, dt * 2);
        }
      }
    }
  }

  /** Um bicho aparece do lado de fora da sebe, na porta sorteada. */
  private nascer(praga: string, porta: number, casa: { x: number; z: number } | null = null, seguidor = false): Invasor {
    // o Portão emperrado: quem ia por ele vai pelo do lado
    if (!casa && porta === this.emperrado) porta = this.portaDoLado(porta, this.sorte());
    const ficha = PRAGAS.find((p) => p.id === praga) ?? PRAGAS[0];
    const jeito = JEITO[ficha.id] ?? JEITO.lagartejo;
    const raiz = new THREE.Group();
    const corpo = ficha.monta(1, this.sorte());
    raiz.add(corpo);
    const { barra, enchido } = montarBarra();
    const de = casa ?? this.planta.entradas[porta];
    const inv: Invasor = {
      ficha, jeito, raiz, corpo,
      partes: (corpo.userData.partes ?? {}) as Record<string, unknown>,
      barra, enchido,
      x: de.x + (casa ? 0 : (this.sorte() - 0.5) * 1.2),
      z: de.z,
      rumo: 0,
      estado: casa ? 'parado' : 'andando',
      relogio: 0,
      vida: ficha.encharque,
      vidaMax: ficha.encharque,
      porta,
      caminho: casa ? [] : [
        this.planta.brechas[porta], this.planta.portoes[porta], this.planta.bocas[porta],
      ].map((p) => ({ x: p.x + (this.sorte() - 0.5) * 0.9, z: p.z })),
      passo: 0,
      canteiro: null,
      lugarNaBorda: this.sorte() * 2 - 1,
      lento: 0,
      gelado: 0,
      empurraX: 0,
      empurraZ: 0,
      molhado: 0,
      fase: this.sorte() * 6,
      gotasVezes: 1,
      voo: null,
      chineladaEspera: 0,
      trancoEspera: 0,
      casa,
      tonto: 0,
      recuo: null,
      recuoResta: 0,
      puxado: false,
      passouPortao: !!casa,
      desvio: null,
      desvioDepois: null,
      semCerca: 0,
      regado: false,
      umidade: 0,
      umidadeResta: 0,
      truque: {
        // a Mãe demora um pouco mais para o primeiro filhote: ela acabou de chegar
        espera: (ficha.id === 'mae-lagartejo' ? 4 : 1.2) + this.sorte() * 2,
        salto: null,
        // metade dos Tucangurus pula de portão; a outra metade entra onde ia
        usou: ficha.id === 'tucanguru' ? this.sorte() < 0.5 : false,
        rola: 0,
        concha: 0,
        guardadas: 0,
        bebendo: false,
        bebeu: 0,
        bravo: false,
        filhotes: 0,
      },
    };
    raiz.position.set(inv.x, 0, inv.z);
    this.w.root.add(raiz);
    this.w.root.add(barra);
    this.invasores.push(inv);
    /*
     * A ABA DE PRAGAS DO LIVRO: a primeira vez que cada praga aparece numa
     * rodada, ela sai do cinza (pedido do Renan). A vitrine do jato não conta:
     * lá o bicho é de mentira.
     */
    if (!casa && !this.g.flag(flagDaPraga(ficha.id))) {
      this.g.setFlag(flagDaPraga(ficha.id));
      this.g.toast(`Praga nova no livro: ${ficha.nome}`, '📖');
    }
    /*
     * O FORMIGURIÇO VEM EM FILA: quem puxa a fila traz mais dois logo atrás,
     * pelo mesmo portão. Os de trás não puxam fila de novo.
     */
    if (ficha.id === 'formigurico' && !seguidor && !casa) {
      for (const t of [0.5, 1]) {
        this.plano.push({ t: this.tempoDaOnda + t, praga: 'formigurico', porta, anunciada: false, seguidor: true });
      }
      this.plano.sort((a, b) => a.t - b.t);
    }
    // o Mutirão do clube: quando a chefe chega, os quatro entram em ação
    if (ficha.tier === 'chefe' && this.ficha.regras.has('mutirao-do-clube')) this.comecarMutirao();
    return inv;
  }

  /** quantos de cada praga a dupla espantou nesta rodada — a tela de fim conta */
  private espantadosPorPraga: Record<string, number> = {};
  private contarEspantado(inv: Invasor): void {
    this.espantadosPorPraga[inv.ficha.id] = (this.espantadosPorPraga[inv.ficha.id] ?? 0) + 1;
  }

  /** tira o bicho do mundo e devolve a geometria (o material é do cache) */
  private tirar(inv: Invasor): void {
    this.w.root.remove(inv.raiz);
    this.w.root.remove(inv.barra);
    inv.raiz.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
  }

  /** o canteiro vivo mais perto de um ponto */
  private canteiroMaisPerto(x: number, z: number): Canteiro | null {
    let melhor: Canteiro | null = null;
    let d = Infinity;
    for (const c of this.canteiros) {
      if (c.vida <= 0) continue;
      const dd = Math.hypot(c.x - x, c.z - z);
      if (dd < d) { d = dd; melhor = c; }
    }
    return melhor;
  }

  /** onde, na borda do canteiro, este bicho vai parar para comer */
  private pontoDeComer(inv: Invasor, c: Canteiro): { x: number; z: number } {
    // o ponto da borda mais perto do bicho, deslizado pelo lugar dele na fila
    const alongX = c.meioX >= c.meioZ;
    const bx = alongX ? THREE.MathUtils.clamp(inv.x, c.x - c.meioX, c.x + c.meioX) + inv.lugarNaBorda * c.meioX * 0.8 : inv.x;
    const bz = alongX ? inv.z : THREE.MathUtils.clamp(inv.z, c.z - c.meioZ, c.z + c.meioZ) + inv.lugarNaBorda * c.meioZ * 0.8;
    const cx = THREE.MathUtils.clamp(bx, c.x - c.meioX, c.x + c.meioX);
    const cz = THREE.MathUtils.clamp(bz, c.z - c.meioZ, c.z + c.meioZ);
    let nx = inv.x - cx;
    let nz = inv.z - cz;
    const n = Math.hypot(nx, nz);
    if (n < 0.001) { nx = 0; nz = -1; } else { nx /= n; nz /= n; }
    const folga = inv.jeito.raio + 0.12;
    return { x: cx + nx * folga, z: cz + nz * folga };
  }

  /**
   * EMPURRA UM PONTO PARA FORA DOS CANTEIROS. Gota que pousa em cima de um
   * canteiro é gota que a dupla não alcança a pé (o canteiro tem colisor), e
   * foi exatamente o que o Renan achou jogando: uma gota presa na horta.
   */
  private foraDeCanteiro(x: number, z: number): { x: number; z: number } {
    const FOLGA = 0.55;
    for (const c of this.canteiros) {
      const dx = x - c.x;
      const dz = z - c.z;
      const sobraX = c.meioX + FOLGA - Math.abs(dx);
      const sobraZ = c.meioZ + FOLGA - Math.abs(dz);
      if (sobraX <= 0 || sobraZ <= 0) continue;
      // sai pelo lado mais curto
      if (sobraX < sobraZ) x = c.x + Math.sign(dx || 1) * (c.meioX + FOLGA);
      else z = c.z + Math.sign(dz || -1) * (c.meioZ + FOLGA);
    }
    return { x, z };
  }

  private vulneravel(inv: Invasor): boolean {
    // no ar, enrolado ou fechado na concha, a água não pega (o jeito dele)
    const t = inv.truque;
    if (t.salto || t.rola > 0 || t.concha > 0) return false;
    return inv.estado === 'andando' || inv.estado === 'comendo' || inv.estado === 'parado'
      || inv.estado === 'preso' || inv.estado === 'recuando';
  }

  private viver(inv: Invasor, dt: number): void {
    inv.relogio += dt;
    inv.fase += dt;
    inv.lento = Math.max(0, inv.lento - dt);
    inv.chineladaEspera = Math.max(0, inv.chineladaEspera - dt);
    inv.trancoEspera = Math.max(0, inv.trancoEspera - dt);
    inv.semCerca = Math.max(0, inv.semCerca - dt);
    if (inv.gelado > 0) {
      inv.gelado -= dt;
      if (inv.gelado <= 0) this.jato.derreter(inv.corpo);
    }
    inv.molhado = Math.max(0, inv.molhado - dt * 3);

    // o empurrão em curso (tranco, chinelada, susto): desliza e freia
    if (inv.empurraX || inv.empurraZ) {
      inv.x += inv.empurraX * dt;
      inv.z += inv.empurraZ * dt;
      const freio = Math.max(0, 1 - dt * 6);
      inv.empurraX *= freio;
      inv.empurraZ *= freio;
      if (Math.hypot(inv.empurraX, inv.empurraZ) < 0.05) { inv.empurraX = 0; inv.empurraZ = 0; }
    }

    // o Sino da porta: quem atravessa um portão toca o sininho, uma vez
    if (!inv.passouPortao && inv.z > this.planta.portoes[inv.porta].z) {
      inv.passouPortao = true;
      if (this.ficha.regras.has('sino-da-porta') && this.sinoEspera <= 0) {
        this.sinoEspera = 0.3;
        this.g.som('sino');
        const p = this.planta.portoes[inv.porta];
        this.jato.ondaDeSom(p.x, p.z + 0.5, 1.4, P.efeitoNota);
        this.contar('sino-da-porta');
      }
    }

    // TONTO (o apito, o coração, o pulinho): não anda nem come, só balança
    if (inv.tonto > 0) {
      inv.tonto -= dt;
      this.pintarInvasor(inv, dt);
      return;
    }

    // o jeito dele: no meio de um pulo, rolando ou na concha, o truque manda
    if (this.truque(inv, dt)) {
      this.pintarInvasor(inv, dt);
      this.pintarTruque(inv);
      return;
    }

    // a Poça e a Gota gelada seguram o passo
    let ritmo = this.ritmoDoTruque(inv);
    if (inv.lento > 0) ritmo *= 0.7;
    if (this.ficha.jato.poca && this.jato.pocasPerto(inv.x, inv.z) > 0) ritmo *= 0.6;
    const velocidade = inv.jeito.velocidade * ritmo;

    switch (inv.estado) {
      case 'andando': this.andar(inv, velocidade, dt); break;
      case 'comendo': this.comer(inv, dt); break;
      case 'sacudindo':
        if (inv.relogio > 0.55) {
          inv.estado = 'fugindo';
          inv.relogio = 0;
        }
        break;
      case 'fugindo': this.fugir(inv, dt); break;
      case 'recuando': this.recuar(inv, velocidade, dt); break;
      case 'voando': this.voar(inv, dt); break;
      case 'preso':
        if (inv.relogio > 0.6) inv.estado = 'voando';
        break;
      case 'parado': {
        // na vitrine ele fica de frente para quem rega
        const eu = this.g.playerPosition();
        this.virarPara(inv, Math.atan2(eu.x - inv.x, eu.z - inv.z), dt * 0.4);
        break;
      }
    }

    // a Chinelada: encostar no bicho joga ele para trás
    if (this.ficha.regras.has('empurrao') && this.vulneravel(inv) && inv.chineladaEspera <= 0) {
      const eu = this.g.playerPosition();
      const d = Math.hypot(inv.x - eu.x, inv.z - eu.z);
      if (d < inv.jeito.raio + 0.5) {
        this.empurrar(inv, inv.x - eu.x, inv.z - eu.z, 2);
        this.jato.tranco(inv.x, inv.z, Math.atan2(inv.x - eu.x, inv.z - eu.z), 2);
        inv.chineladaEspera = 1;
      }
    }

    this.pintarInvasor(inv, dt);
    this.pintarTruque(inv);
  }

  private andar(inv: Invasor, velocidade: number, dt: number): void {
    // o caminho de fora: brecha → portão → boca; depois, o canteiro
    let alvo: { x: number; z: number } | null = inv.caminho[inv.passo] ?? null;

    // O PORTÃO TRANCADO (a Estufa trancada, a Gina): espera do lado de fora
    let naFila = false;
    if (inv.passo === 1 && this.trancada(inv.porta)) {
      naFila = true;
      const espera = this.pontoDeEspera(inv);
      if (Math.hypot(espera.x - inv.x, espera.z - inv.z) < 0.1) {
        this.virarPara(inv, 0, dt);
        return;
      }
      alvo = espera;
    }

    // O ESPANTALHO: quem está perto esquece o canteiro e vai olhar para ele
    if (!alvo && this.espantalhoResta > 0) {
      const e = this.planta.lugares.espantalho;
      if (inv.puxado || Math.hypot(e.x - inv.x, e.z - inv.z) < 7) {
        if (!inv.puxado) this.contar('espantalho');
        inv.puxado = true;
        const a = inv.lugarNaBorda * Math.PI;
        const roda = { x: e.x + Math.sin(a) * 1.1, z: e.z - Math.abs(Math.cos(a)) * 1.1 };
        if (Math.hypot(roda.x - inv.x, roda.z - inv.z) < 0.1) {
          this.virarPara(inv, Math.atan2(e.x - inv.x, e.z - inv.z), dt);
          return;
        }
        alvo = roda;
      }
    }

    let vaiComer = false;
    let vaiBeber = false;
    // quem bebe (o Mosquipótamo, o Escorpicamelo antes de murchar) vai no tonel
    const tonel = alvo ? null : this.tonelDoBicho(inv);
    if (tonel) {
      alvo = tonel;
      vaiBeber = true;
    } else if (!alvo) {
      if (!inv.canteiro || inv.canteiro.vida <= 0) inv.canteiro = this.canteiroMaisPerto(inv.x, inv.z);
      if (!inv.canteiro) return;
      alvo = this.pontoDeComer(inv, inv.canteiro);
      vaiComer = true;
    }
    // a Cerquinha: quem ia passar por ela contorna pela ponta
    const final = alvo;
    alvo = this.desviar(inv, alvo);
    if (alvo !== final) { vaiComer = false; vaiBeber = false; }
    const dx = alvo.x - inv.x;
    const dz = alvo.z - inv.z;
    const d = Math.hypot(dx, dz);
    const passo = velocidade * dt;
    if (d <= Math.max(0.08, passo)) {
      inv.x = alvo.x;
      inv.z = alvo.z;
      // chegou na ponta da cerquinha ou na fila do portão: não é o ponto do caminho
      if (alvo !== final || naFila) return;
      if (inv.passo < inv.caminho.length) inv.passo += 1;
      else if (vaiBeber) this.comecarABeber(inv);
      else if (inv.canteiro && vaiComer) {
        inv.estado = 'comendo';
        inv.relogio = 0;
        this.aoMorder(inv, inv.canteiro);
      }
      return;
    }
    inv.x += (dx / d) * passo;
    inv.z += (dz / d) * passo;
    this.virarPara(inv, Math.atan2(dx, dz), dt);
  }

  private comer(inv: Invasor, dt: number): void {
    if (inv.truque.bebendo) {
      this.beber(inv, dt);
      return;
    }
    const c = inv.canteiro;
    if (!c || c.vida <= 0) {
      inv.estado = 'andando';
      inv.canteiro = null;
      return;
    }
    // de frente para a borda que ele está comendo
    this.virarPara(inv, Math.atan2(
      THREE.MathUtils.clamp(inv.x, c.x - c.meioX, c.x + c.meioX) - inv.x,
      THREE.MathUtils.clamp(inv.z, c.z - c.meioZ, c.z + c.meioZ) - inv.z,
    ), dt);
    // o Adubo do Noel: canteiro regado nesta onda perde a metade
    let mordida = inv.jeito.mordida * dt * (c.adubado ? 0.5 : 1);
    // a Folha orvalhada (borrifador): canteiro que a névoa tocou há pouco perde a metade
    if (c.orvalho > 0) {
      mordida *= 0.5;
      this.contar('folha-orvalhada');
    }
    // a Cerca viva morde primeiro: o canteiro só sente o que passar dela
    if (c.cerca > 0) {
      const na = Math.min(c.cerca, mordida);
      c.cerca -= na;
      mordida -= na;
      this.pintarCerca(c);
      if (c.cerca <= 0) {
        this.g.toast(`A cerca viva do canteiro de ${c.nome.toLowerCase()} cedeu`, '🍂');
        this.g.som('brotar');
      }
    }
    c.vida = Math.max(0, c.vida - mordida);
    if (Math.random() < dt * 5) {
      this.jato.folhinhas(
        THREE.MathUtils.clamp(inv.x, c.x - c.meioX, c.x + c.meioX),
        THREE.MathUtils.clamp(inv.z, c.z - c.meioZ, c.z + c.meioZ),
        c.folha,
      );
    }
    this.pintarCanteiro(c);
    if (c.vida <= 0) {
      this.g.toast('Um canteiro foi comido', '🥀');
      inv.estado = 'andando';
      inv.canteiro = null;
    }
  }

  private fugir(inv: Invasor, dt: number): void {
    // volta pelo caminho de fora, de trás para a frente, com pressa
    const volta = [this.planta.bocas[inv.porta], this.planta.portoes[inv.porta],
      this.planta.brechas[inv.porta], this.planta.entradas[inv.porta]];
    if (inv.casa) {
      // na vitrine ele só dá uns passos para trás e nasce de novo
      if (inv.relogio > 1.2) this.renascerNaVitrine(inv);
      inv.x -= Math.sin(inv.rumo) * 2 * dt;
      inv.z -= Math.cos(inv.rumo) * 2 * dt;
      return;
    }
    /*
     * A REDE DE SEGURANÇA: espantado já foi espantado — não leva água, não come,
     * só falta sair. Se em 20 s ele ainda não saiu (preso em qualquer coisa que
     * ninguém previu), ele some ali mesmo: a onda nunca mais trava esperando
     * um bicho que não consegue ir embora.
     */
    if (inv.relogio > 20) {
      this.tirar(inv);
      this.invasores.splice(this.invasores.indexOf(inv), 1);
      return;
    }
    // o próximo ponto da volta é o primeiro que ainda está "na frente" dele (em z)
    const destino = volta.find((p) => p.z < inv.z - 0.3) ?? volta[volta.length - 1];
    const alvo = this.desviar(inv, destino);
    const dx = alvo.x - inv.x;
    const dz = alvo.z - inv.z;
    const d = Math.hypot(dx, dz);
    const v = inv.jeito.velocidade * 2 + 0.6;
    if (d < 0.3 && destino === volta[volta.length - 1]) {
      this.tirar(inv);
      this.invasores.splice(this.invasores.indexOf(inv), 1);
      return;
    }
    // chega no ponto em vez de passar dele: no celular, com o quadro longo, o
    // passo passava da ponta da cerca e voltava, sem nunca "chegar"
    const passo = v * dt;
    if (d <= passo) {
      inv.x = alvo.x;
      inv.z = alvo.z;
      return;
    }
    inv.x += (dx / d) * passo;
    inv.z += (dz / d) * passo;
    this.virarPara(inv, Math.atan2(dx, dz), dt * 2);
    // pinga no caminho: ainda está encharcado
    // (mudo: é só o bicho pingando, e tocaria o tempo todo)
    if (Math.random() < dt * 6) this.jato.respingo(inv.x, 0.15, inv.z, {}, 0.25, 'agua', false);
  }

  /** o Gêiser: o bicho voa em parábola até a porta dele */
  private voar(inv: Invasor, dt: number): void {
    if (!inv.voo) {
      const destino = this.planta.brechas[inv.porta];
      inv.voo = { de: { x: inv.x, z: inv.z }, para: { x: destino.x, z: destino.z + 1.5 }, t: 0, dur: 1.5 };
      this.jato.geiser(inv.x, inv.z);
    }
    const v = inv.voo;
    v.t += dt;
    const t = Math.min(1, v.t / v.dur);
    inv.x = v.de.x + (v.para.x - v.de.x) * t;
    inv.z = v.de.z + (v.para.z - v.de.z) * t;
    inv.raiz.position.y = Math.sin(t * Math.PI) * 6;
    inv.corpo.rotation.x += dt * 9;
    if (t >= 1) {
      inv.raiz.position.y = 0;
      inv.corpo.rotation.x = 0;
      this.jato.respingo(inv.x, 0.1, inv.z, {}, 1.5);
      if (inv.casa) {
        this.renascerNaVitrine(inv);
        return;
      }
      this.tirar(inv);
      this.invasores.splice(this.invasores.indexOf(inv), 1);
    }
  }

  private renascerNaVitrine(inv: Invasor): void {
    const casa = inv.casa!;
    this.tirar(inv);
    this.invasores.splice(this.invasores.indexOf(inv), 1);
    this.jato.depois(0.8, () => {
      if (this.rodando) this.nascer(inv.ficha.id, inv.porta, casa);
    });
  }

  private virarPara(inv: Invasor, rumo: number, dt: number): void {
    let d = rumo - inv.rumo;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    inv.rumo += d * Math.min(1, dt * 8);
  }

  private empurrar(inv: Invasor, dx: number, dz: number, metros: number): void {
    const n = Math.hypot(dx, dz) || 1;
    // v inicial que, freando a 6/s, anda `metros`
    const v = metros * 6;
    inv.empurraX += (dx / n) * v;
    inv.empurraZ += (dz / n) * v;
    if (inv.estado === 'comendo') {
      inv.estado = 'andando';
    }
  }

  // ======================================================= O JEITO DE CADA BICHO

  /*
   * PEDIDO DO RENAN: umas mecânicas novas "só para ficar mais divertido", sem
   * deixar os bichos complicados, e cada uma TIRADA DO DESENHO do bicho. Cada
   * praga tem no máximo um truque, e todo truque se VÊ:
   *
   * | bicho         | desenho               | truque                                        |
   * |---------------|-----------------------|-----------------------------------------------|
   * | Gafanhopo     | pernas de mola        | pula de tempo em tempo; no ar a água não pega |
   * | Libelagarto   | quatro asas           | voa uns dois segundos, alto e mais rápido     |
   * | Tucanguru     | pernas de canguru     | antes do portão, pula para o portão do lado   |
   * | Coelhatu      | casco de tatu         | meio molhado, vira bolinha e ROLA um tiquinho |
   * | Formiguriço   | formiga               | vem em fila de três                           |
   * | Tamandubelha  | focinho de canudo     | aspira as gotas do chão, e devolve ao fugir   |
   * | Mosquipótamo  | tromba de mosquito    | vai no TONEL beber: bebendo, ele não enche    |
   * | Rinocaracol   | concha de caracol     | meio molhado, se fecha na concha uns 3 s      |
   * | Javaponja     | esponja               | incha com a água (fica lenta) e deixa poça    |
   * | Mãe-Lagartejo | a mãe                 | solta filhotes pelo caminho                   |
   * | Escorpicamelo | corcovas de camelo    | bebe o tonel; com meia vida, murcha e corre   |
   *
   * O Lagartejo e o Preguipolvo ficam como são: o básico e o lento.
   *
   * A Josefina avisa na PRIMEIRA vez que cada truque acontece na rodada — é a
   * única explicação que o jogador recebe, e basta.
   */

  /** a Josefina avisa o truque na primeira vez da rodada, e só na primeira */
  private dicasDadas = new Set<string>();
  private dica(id: string, fala: string): void {
    if (this.vitrine || this.dicasDadas.has(id)) return;
    this.dicasDadas.add(id);
    this.g.toast(`Josefina: “${fala}”`, '🐢');
  }

  /** as poças que a Javaponja espremeu: pisar nelas enche o regador */
  private esponjas: Array<{ x: number; z: number; vida: number }> = [];
  private relogioDaEsponja = 0;

  /** o passo do bicho, pelo jeito dele: a Javaponja inchada é lenta, o camelo bravo corre */
  private ritmoDoTruque(inv: Invasor): number {
    if (inv.ficha.id === 'javaponja') return 1 - 0.45 * (1 - Math.max(0, inv.vida) / inv.vidaMax);
    if (inv.ficha.id === 'escorpicamelo' && inv.truque.bravo) return 1.7;
    return 1;
  }

  /**
   * O TRUQUE DO QUADRO. Devolve `true` quando o truque está no comando (no
   * meio de um pulo, rolando, na concha) — aí o bicho não anda nem come do
   * jeito normal neste quadro.
   */
  private truque(inv: Invasor, dt: number): boolean {
    const t = inv.truque;
    if (t.salto) {
      this.saltar(inv, dt);
      return true;
    }
    if (t.rola > 0) {
      this.rolar(inv, dt);
      return true;
    }
    if (t.concha > 0) {
      t.concha -= dt;
      if (t.concha <= 0) inv.raiz.position.y = 0;
      return true;
    }
    if ((inv.estado !== 'andando' && inv.estado !== 'comendo') || inv.casa || inv.puxado) return false;
    t.espera -= dt;
    const meiaVida = inv.vida <= inv.vidaMax * 0.5;
    switch (inv.ficha.id) {
      case 'gafanhopo': {
        // PERNAS DE MOLA: um pulo de 1,8 m de tempo em tempo, lá dentro
        if (inv.estado !== 'andando' || !inv.passouPortao || t.espera > 0) break;
        t.espera = 2.2 + this.sorte() * 1.3;
        if (this.saltarRumo(inv, 1.8, 0.55, 0.75, false)) {
          this.dica('gafanhopo', 'O Gafanhopo pula! No ar, a água passa por baixo.');
          this.contar('jeito-pulo');
        }
        break;
      }
      case 'libelagarto': {
        // AS ASAS: decola, voa uns dois segundos mais rápido, e pousa
        if (inv.estado !== 'andando' || !inv.passouPortao || t.espera > 0) break;
        t.espera = 4 + this.sorte() * 2;
        if (this.saltarRumo(inv, 3.4, 2.2, 1.15, true)) {
          this.dica('libelagarto', 'O Libelagarto voa um pouquinho! Espera ele pousar.');
          this.contar('jeito-voo');
        }
        break;
      }
      case 'tucanguru': {
        // PERNA DE CANGURU: chegando no portão, pula para o do lado
        if (t.usou || inv.estado !== 'andando' || inv.passo !== 1) break;
        const p = this.planta.portoes[inv.porta];
        if (Math.hypot(p.x - inv.x, p.z - inv.z) > 4) break;
        t.usou = true;
        return this.trocarDePortao(inv);
      }
      case 'coelhatu': {
        // O CASCO DE TATU: meio molhado, enrola e rola para longe da água
        if (t.usou || !meiaVida) break;
        t.usou = true;
        t.rola = 1.3;
        inv.estado = 'andando';
        inv.corpo.userData.giro0 ??= inv.corpo.rotation.y;
        this.g.som('quicar');
        this.dica('coelhatu', 'Virou bolinha! Enrolado, a água escorre no casco.');
        this.contar('jeito-rola');
        return true;
      }
      case 'rinocaracol': {
        // A CONCHA: meio molhado, se fecha nela uns segundos
        if (t.usou || !meiaVida) break;
        t.usou = true;
        t.concha = 3;
        // afunda o corpo até o chão: as patas somem para dentro da concha
        inv.raiz.position.y = -0.28;
        this.g.som('caixa');
        this.dica('rinocaracol', 'Entrou na concha! Espera ele sair que a água volta a pegar.');
        this.contar('jeito-concha');
        return true;
      }
      case 'tamandubelha': {
        // O FOCINHO DE CANUDO: aspira as gotas que estão na frente dele
        if (t.espera > 0) break;
        t.espera = 0.4;
        const n = this.gotas.catar(inv.x + Math.sin(inv.rumo) * 0.9, inv.z + Math.cos(inv.rumo) * 0.9, 1.2);
        if (n > 0) {
          t.guardadas += n;
          this.dica('tamandubelha', 'O Tamandubelha tá aspirando as gotas! Espanta que ele devolve.');
          this.contar('jeito-aspira');
        }
        break;
      }
      case 'mae-lagartejo': {
        // A MÃE: de tempo em tempo, um filhote sai de trás dela
        if (!inv.passouPortao || t.espera > 0 || t.filhotes >= FILHOTES_DA_MAE) break;
        t.espera = 7;
        t.filhotes += 1;
        const filho = this.nascer('lagartejo', inv.porta);
        filho.x = inv.x - Math.sin(inv.rumo) * 1.4;
        filho.z = inv.z - Math.cos(inv.rumo) * 1.4;
        filho.passo = filho.caminho.length;
        filho.passouPortao = true;
        this.jato.poeira(filho.x, filho.z, inv.rumo + Math.PI);
        this.dica('mae-lagartejo', 'A mãe tá soltando filhote!');
        this.contar('jeito-filhote');
        break;
      }
      case 'escorpicamelo': {
        // AS CORCOVAS: com meia vida elas murcham, e sem o peso ele corre
        if (t.bravo || !meiaVida) break;
        t.bravo = true;
        t.bebendo = false;
        this.g.som('ronco');
        this.dica('escorpicamelo-bravo', 'Murcharam as corcovas… agora ele corre!');
        this.contar('jeito-bravo');
        break;
      }
    }
    return false;
  }

  /** para onde o bicho está indo agora: o próximo ponto do caminho, o tonel ou o canteiro */
  private destinoDoBicho(inv: Invasor): Ponto2 | null {
    if (inv.passo < inv.caminho.length) return inv.caminho[inv.passo];
    const tonel = this.tonelDoBicho(inv);
    if (tonel) return tonel;
    if (!inv.canteiro || inv.canteiro.vida <= 0) inv.canteiro = this.canteiroMaisPerto(inv.x, inv.z);
    return inv.canteiro ? this.pontoDeComer(inv, inv.canteiro) : null;
  }

  /** um pulo (ou voo) na direção de onde ele ia, sem passar do ponto */
  private saltarRumo(inv: Invasor, distancia: number, dur: number, alto: number, voo: boolean): boolean {
    const alvo = this.destinoDoBicho(inv);
    if (!alvo) return false;
    const dx = alvo.x - inv.x;
    const dz = alvo.z - inv.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.9) return false;
    const vai = Math.min(distancia, d - 0.3);
    inv.truque.salto = {
      de: { x: inv.x, z: inv.z },
      para: { x: inv.x + (dx / d) * vai, z: inv.z + (dz / d) * vai },
      // voo curto (o canteiro já está perto) é voo mais rápido, e não mais lento
      t: 0, dur: voo ? Math.max(1.1, dur * vai / distancia) : dur, alto, voo,
    };
    return true;
  }

  private saltar(inv: Invasor, dt: number): void {
    const s = inv.truque.salto!;
    s.t += dt;
    const k = Math.min(1, s.t / s.dur);
    inv.x = s.de.x + (s.para.x - s.de.x) * k;
    inv.z = s.de.z + (s.para.z - s.de.z) * k;
    // o pulo é um arco; o voo sobe rápido, plana e desce rápido
    inv.raiz.position.y = s.voo ? s.alto * Math.min(1, k * 5, (1 - k) * 5) : Math.sin(k * Math.PI) * s.alto;
    this.virarPara(inv, Math.atan2(s.para.x - s.de.x, s.para.z - s.de.z), dt);
    if (k >= 1) {
      inv.raiz.position.y = 0;
      inv.truque.salto = null;
      this.jato.poeira(inv.x, inv.z, inv.rumo);
    }
  }

  /**
   * O TUCANGURU TROCA DE PORTÃO: do lado de fora, perto do portão dele, dá um
   * salto comprido e cai na frente do portão do lado — e segue por ele. Pelo
   * Portão emperrado ele não vai.
   */
  private trocarDePortao(inv: Invasor): boolean {
    const nova = this.portaDoLado(inv.porta, this.sorte());
    if (nova === this.emperrado) return false;
    const p = this.planta.portoes[nova];
    inv.porta = nova;
    inv.caminho = [this.planta.brechas[nova], p, this.planta.bocas[nova]]
      .map((q) => ({ x: q.x + (this.sorte() - 0.5) * 0.9, z: q.z }));
    inv.passo = 1;
    inv.truque.salto = {
      de: { x: inv.x, z: inv.z },
      para: { x: p.x + (this.sorte() - 0.5) * 0.8, z: p.z - 1.6 },
      t: 0, dur: 1, alto: 1.6, voo: false,
    };
    this.g.som('quicar');
    this.dica('tucanguru', `O Tucanguru pulou pro portão ${NOME_DO_PORTAO[nova]}!`);
    this.contar('jeito-portao');
    return true;
  }

  /** o Coelhatu enrolado rola ligeiro para onde ia */
  private rolar(inv: Invasor, dt: number): void {
    const t = inv.truque;
    t.rola -= dt;
    const alvo = this.destinoDoBicho(inv);
    if (alvo) {
      const dx = alvo.x - inv.x;
      const dz = alvo.z - inv.z;
      const d = Math.hypot(dx, dz);
      const passo = inv.jeito.velocidade * 2.4 * dt;
      if (d <= passo + 0.05) t.rola = 0;
      else {
        inv.x += (dx / d) * passo;
        inv.z += (dz / d) * passo;
        this.virarPara(inv, Math.atan2(dx, dz), dt);
      }
    }
    inv.raiz.position.y = Math.abs(Math.sin(inv.fase * 16)) * 0.08;
    if (t.rola <= 0) {
      t.rola = 0;
      inv.raiz.position.y = 0;
      inv.corpo.rotation.y = (inv.corpo.userData.giro0 as number | undefined) ?? 0;
    }
  }

  /** o ponto do lado do tonel onde quem bebe para — ou `null` para quem não bebe */
  private tonelDoBicho(inv: Invasor): Ponto2 | null {
    const t = inv.truque;
    const quer = inv.ficha.id === 'mosquipotamo'
      || (inv.ficha.id === 'escorpicamelo' && !t.bravo && t.bebeu < O_CHEFE_BEBE);
    if (!quer || inv.passo < inv.caminho.length) return null;
    const tonel = this.planta.tonel;
    const nx = inv.x - tonel.x;
    const nz = inv.z - tonel.z;
    const n = Math.hypot(nx, nz) || 1;
    const folga = inv.jeito.raio + 0.45;
    return { x: tonel.x + (nx / n) * folga, z: tonel.z + (nz / n) * folga };
  }

  private comecarABeber(inv: Invasor): void {
    inv.estado = 'comendo';
    inv.canteiro = null;
    inv.relogio = 0;
    inv.truque.bebendo = true;
    if (inv.ficha.id === 'escorpicamelo') this.dica('escorpicamelo', 'O Escorpicamelo tá secando o tonel!');
    else this.dica('mosquipotamo', 'O Mosquipótamo tá bebendo do tonel! Assim ele não enche.');
    this.contar('jeito-bebe');
  }

  /** bebendo: de frente para o tonel, puxando água pela tromba (ou pela boca) */
  private beber(inv: Invasor, dt: number): void {
    const t = inv.truque;
    const tonel = this.planta.tonel;
    this.virarPara(inv, Math.atan2(tonel.x - inv.x, tonel.z - inv.z), dt);
    t.bebeu += dt;
    if (inv.relogio > 1.2) {
      inv.relogio = 0;
      this.g.som('gluglu');
      this.jato.espirroDoTonel(tonel.x, tonel.altura, tonel.z, 0.5);
    }
    // o camelo bebe o que cabe nas corcovas e vai para os canteiros
    if (inv.ficha.id === 'escorpicamelo' && t.bebeu >= O_CHEFE_BEBE) {
      t.bebendo = false;
      inv.estado = 'andando';
    }
  }

  /** tem bicho bebendo no tonel de fábrica agora? */
  private tonelBebido(): boolean {
    return this.invasores.some((i) => i.truque.bebendo && i.estado === 'comendo');
  }

  /**
   * ESPANTADO, o que o jeito dele deixa para trás: o Tamandubelha devolve as
   * gotas que aspirou, e mais a metade; a Javaponja espreme a água numa poça.
   * Devolve as gotas a mais.
   */
  private aoEspantar(inv: Invasor, onde: Ponto2): number {
    const t = inv.truque;
    // quem é espantado de repente (o Gêiser) larga o truque na hora
    t.salto = null;
    t.rola = 0;
    t.concha = 0;
    t.bebendo = false;
    if (inv.estado !== 'preso') inv.raiz.position.y = 0;
    if (inv.ficha.id === 'javaponja') {
      this.jato.poca(onde.x, onde.z, 1.2, 9);
      this.esponjas.push({ x: onde.x, z: onde.z, vida: 9 });
      this.dica('javaponja', 'A Javaponja espremeu uma poça! Pisa nela que enche o regador.');
    }
    if (t.guardadas > 0) return t.guardadas + Math.ceil(t.guardadas / 2);
    return 0;
  }

  /** a poça da Javaponja: quem pisa com o regador enche, como num tonel pequeno */
  private pisarNaEsponja(dt: number): void {
    const eu = this.g.playerPosition();
    this.relogioDaEsponja -= dt;
    for (let i = this.esponjas.length - 1; i >= 0; i--) {
      const e = this.esponjas[i];
      e.vida -= dt;
      if (e.vida <= 0) {
        this.esponjas.splice(i, 1);
        continue;
      }
      if (!this.comRegador() || this.agua >= this.ficha.tanque) continue;
      if (Math.hypot(eu.x - e.x, eu.z - e.z) > 1.2) continue;
      this.agua = Math.min(this.ficha.tanque, this.agua + 8 * dt);
      if (this.agua >= this.ficha.tanque) this.tanqueCheio = true;
      if (this.relogioDaEsponja <= 0) {
        this.relogioDaEsponja = 0.5;
        this.g.som('gluglu');
        this.jato.espirroDoTonel(e.x, 0.1, e.z, 1);
        this.contar('jeito-esponja');
      }
    }
  }

  /**
   * O DESENHO DO TRUQUE, por cima do `pintarInvasor`: as asas batendo, o
   * bicho enrolado ou fechado (cabeça e patas somem), a Javaponja inchando e
   * as corcovas do camelo enchendo e murchando.
   */
  private pintarTruque(inv: Invasor): void {
    const t = inv.truque;
    const p = inv.partes;
    const c = inv.corpo;

    // as asas: zumbem sempre, e batem forte no voo
    const asas = p.asas as THREE.Object3D[] | undefined;
    if (asas) {
      const forte = t.salto?.voo ? 0.55 : 0.07;
      const ritmo = t.salto?.voo ? 38 : 11;
      for (const a of asas) {
        a.userData.rz0 ??= a.rotation.z;
        const base = a.userData.rz0 as number;
        a.rotation.z = base + Math.sign(base || 1) * Math.sin(inv.fase * ritmo) * forte;
      }
    }

    // enrolado ou na concha: a cabeça e as patas somem para dentro
    const escondido = t.rola > 0 || t.concha > 0;
    const cabeca = p.cabeca as THREE.Object3D | undefined;
    if (cabeca) cabeca.visible = !escondido;
    for (const perna of (p.pernas ?? []) as THREE.Object3D[]) perna.visible = !escondido;
    if (t.rola > 0) {
      // bolinha: achata e gira como pião
      c.scale.set(c.scale.x * 1.08, c.scale.y * 0.8, c.scale.z * 1.08);
      c.rotation.y = inv.fase * 18;
    }

    // a Javaponja incha com a água que já levou (até um terço a mais)
    if (inv.ficha.id === 'javaponja') {
      const inchou = 1 + 0.35 * (1 - Math.max(0, inv.vida) / inv.vidaMax);
      c.scale.multiplyScalar(inchou);
      inv.barra.position.y = inv.ficha.alturaDaBarra * inchou + inv.raiz.position.y;
    }

    // as corcovas do camelo: enchem bebendo, murcham quando ele fica bravo
    const corcovas = p.corcovas as THREE.Object3D[] | undefined;
    if (corcovas) {
      const k = t.bravo ? 0.7 : 1 + 0.3 * Math.min(1, t.bebeu / O_CHEFE_BEBE);
      for (const corcova of corcovas) {
        corcova.userData.escala0 ??= corcova.scale.clone();
        corcova.scale.copy(corcova.userData.escala0 as THREE.Vector3).multiplyScalar(k);
      }
    }
  }

  /**
   * O DESENHO DO BICHO, a cada quadro: posição, giro, o passinho, a mordida,
   * a piscada de molhado e a sacudida. E a barra de vida, que vive no mundo
   * (e não dentro do bicho) para não girar com ele.
   */
  private pintarInvasor(inv: Invasor, dt: number): void {
    inv.raiz.position.x = inv.x;
    inv.raiz.position.z = inv.z;
    inv.raiz.rotation.y = inv.rumo;
    const c = inv.corpo;
    const andando = (inv.estado === 'andando' || inv.estado === 'fugindo' || inv.estado === 'recuando') && inv.tonto <= 0;
    const ritmo = inv.estado === 'fugindo' || inv.estado === 'recuando' ? 16 : 10 * (inv.lento > 0 ? 0.6 : 1);
    // o passinho: sobe e desce, e as patinhas se revezam
    c.position.y = andando ? Math.abs(Math.sin(inv.fase * ritmo)) * 0.035 : 0;
    const pernas = (inv.partes.pernas ?? []) as THREE.Object3D[];
    pernas.forEach((p, i) => {
      if (p.userData.y0 === undefined) p.userData.y0 = p.position.y;
      p.position.y = (p.userData.y0 as number) + (andando ? Math.max(0, Math.sin(inv.fase * ritmo + i * 1.7)) * 0.03 : 0);
    });
    // as pinças abrem e fecham: devagar andando, rápido comendo
    const pincas = (inv.partes.pincas ?? []) as THREE.Object3D[];
    pincas.forEach((p, i) => {
      if (p.userData.ry0 === undefined) p.userData.ry0 = p.rotation.y;
      const s = i === 0 ? -1 : 1;
      const abre = inv.estado === 'comendo' ? Math.sin(inv.fase * 14) * 0.35 : Math.sin(inv.fase * 3) * 0.12;
      p.rotation.y = (p.userData.ry0 as number) + s * abre;
    });
    const cabeca = inv.partes.cabeca as THREE.Object3D | undefined;
    if (cabeca) {
      if (cabeca.userData.x0 === undefined) cabeca.userData.x0 = cabeca.rotation.x;
      cabeca.rotation.x = (cabeca.userData.x0 as number) + (inv.estado === 'comendo' ? 0.25 + Math.sin(inv.fase * 12) * 0.12 : 0);
    }
    // a sacudida do espantado: balança de um lado para o outro
    c.rotation.z = inv.estado === 'sacudindo' ? Math.sin(inv.relogio * 40) * 0.35 * (1 - inv.relogio / 0.55)
      // tonto: bambeia devagar, como quem levou um susto
      : inv.tonto > 0 ? Math.sin(inv.fase * 9) * 0.16 : 0;
    // o tranco: o corpo inclina para trás enquanto o empurrão dura
    const empurrado = Math.min(1, Math.hypot(inv.empurraX, inv.empurraZ) / 6);
    c.rotation.x = -empurrado * 0.45;
    // a piscada de quem levou água: incha um tiquinho
    const s = 1 + inv.molhado * 0.12;
    c.scale.set(s, 1 - inv.molhado * 0.08, s);

    // a barra: em cima da cabeça, de frente para a câmera
    const b = inv.barra;
    b.position.set(inv.x, inv.ficha.alturaDaBarra + inv.raiz.position.y, inv.z);
    b.rotation.y = this.g.anguloDaCamera();
    const fracao = Math.max(0, inv.vida / inv.vidaMax);
    const alvo = Math.max(0.0001, fracao);
    const atual = inv.enchido.scale.x;
    inv.enchido.scale.x = atual + (alvo - atual) * Math.min(1, dt * 10);
    b.visible = inv.estado !== 'fugindo' && inv.estado !== 'voando' && inv.estado !== 'sacudindo';
    // acabou de levar água: a barra pisca branco
    inv.enchido.material = inv.molhado > 0.4 ? toon(P.barraMolhada, { glow: 0.6 }) : toon(P.barraAgua, { glow: 0.35 });
  }

  // ================================================================ canteiros

  /** as mudas encolhem com a vida do canteiro; comido até o fim, some tudo */
  private pintarCanteiro(c: Canteiro): void {
    const mudas = (c.peca.userData.mudas ?? []) as THREE.Object3D[];
    const fracao = c.vida / c.vidaMax;
    mudas.forEach((m, i) => {
      const base = c.escalas[i] ?? 1;
      // cada muda some num ponto diferente: o canteiro esvazia aos poucos
      const limite = (i + 1) / (mudas.length + 1);
      m.visible = fracao > limite * 0.9;
      m.scale.setScalar(base * (0.45 + 0.55 * fracao));
    });
    const terra = c.peca.userData.terra as THREE.Mesh | undefined;
    if (terra && c.vida <= 0) terra.material = toon(P.terraComida);
    else if (terra && c.terraOriginal) terra.material = c.terraOriginal;
  }

  private replantar(c: Canteiro): void {
    c.vida = VIDA_DO_CANTEIRO;
    c.vidaMax = VIDA_DO_CANTEIRO;
    const mudas = (c.peca.userData.mudas ?? []) as THREE.Object3D[];
    mudas.forEach((m, i) => {
      m.visible = true;
      m.scale.setScalar(c.escalas[i] ?? 1);
      // os Girassóis vigia viraram as flores: voltam para onde a cena plantou
      m.rotation.y = c.giros[i] ?? m.rotation.y;
    });
    const terra = c.peca.userData.terra as THREE.Mesh | undefined;
    if (terra && c.terraOriginal) terra.material = c.terraOriginal;
  }

  // ================================================================ o regador

  /** a ponta do bico do regador na mão, no mundo — é de lá que a água sai */
  private pontaDoBico(): THREE.Vector3 {
    const obj = this.g.objetoNaMao();
    let achou: THREE.Vector3 | null = null;
    obj?.traverse((o) => {
      if (achou) return;
      const partes = o.userData.partes as { bico?: THREE.Object3D; pontaDoBico?: number } | undefined;
      if (partes?.bico && partes.pontaDoBico !== undefined) {
        achou = partes.bico.localToWorld(new THREE.Vector3(0, 0, partes.pontaDoBico));
      }
    });
    if (achou) return achou;
    const eu = this.g.playerPosition();
    const f = this.g.playerFacing();
    return new THREE.Vector3(eu.x + Math.sin(f) * 0.45, 1.3, eu.z + Math.cos(f) * 0.45);
  }

  private comRegador(): boolean {
    return this.g.getActiveHandItem()?.id === 'regador';
  }

  /** o bicho está atrás de um canteiro, do ponto de vista de quem rega? */
  private atrasDeCanteiro(de: { x: number; z: number }, inv: Invasor): boolean {
    for (const c of this.canteiros) {
      /*
       * O CANTEIRO QUE ELE ESTÁ COMENDO NÃO ESCONDE ELE. O bicho come na borda,
       * e quem chegava pela quina via a reta passar raspando pela terra — o
       * regador achava que ele estava "atrás" e não atirava justo em quem
       * mais importa (o Renan achou jogando).
       */
      if (inv.estado === 'comendo' && c === inv.canteiro) continue;
      if (segmentoCruzaRetangulo(de.x, de.z, inv.x, inv.z, c.x, c.z, c.meioX - 0.1, c.meioZ - 0.1)) return true;
    }
    return false;
  }

  /**
   * O REGADOR, a cada quadro: enche (sozinho, no tonel, parado, andando com
   * Fôlego), carrega o jatão, gira o crivo, faz chover, e — quando a cadência
   * deixa e há água — escolhe o alvo e atira. O jogador não aperta nada: é o
   * gênero (§1 do plano).
   */
  private regador(dt: number): void {
    const f = this.ficha;
    const e = f.jato;
    const eu = this.g.playerPosition();
    const andou = Math.hypot(eu.x - this.ultimaPosicao.x, eu.z - this.ultimaPosicao.z);
    this.ultimaPosicao.copy(eu);
    const estaParado = andou < 0.004;
    this.passoDoQuadro = andou;
    this.parado = estaParado ? this.parado + dt : 0;
    this.andouDesdeGaroa += andou;

    // ---- a água: sozinha, parado (Descanso), andando (Fôlego) e no tonel
    // (no tonel de fábrica, ou no Segundo tonel do outro lado)
    const toneis = [this.planta.tonel];
    if (this.segundoTonel) toneis.push({ ...this.planta.lugares.segundoTonel, altura: this.planta.tonel.altura });
    const tonel = toneis.find((t) => Math.hypot(eu.x - t.x, eu.z - t.z) < PERTO_DO_TONEL) ?? null;
    // com bicho bebendo nele, o tonel de fábrica não enche ninguém (o Segundo tonel enche)
    const seco = tonel === this.planta.tonel && this.tonelBebido();
    const perto = tonel !== null && !seco;
    // o Jean-Luc no tonel: encher ali é na hora
    if (perto && tonel === this.planta.tonel && f.regras.has('jean-luc-no-tonel') && this.agua < f.tanque - 0.5) {
      this.agua = f.tanque;
      this.tanqueCheio = true;
      this.g.som('pato');
      this.g.som('gluglu');
      this.jato.espirroDoTonel(tonel.x, tonel.altura, tonel.z, 3);
      this.contar('jean-luc-no-tonel');
      if (f.regras.has('transbordou')) this.transbordar(eu);
    }
    let enche = f.recarga * (estaParado ? f.recargaParado : 1);
    if (!estaParado && f.regras.has('enche-andando')) enche += 0.6;
    this.enchendo = perto && this.agua < f.tanque;
    if (this.enchendo && tonel) {
      enche += ENCHE_NO_TONEL * f.refil;
      this.relogioDoTonel -= dt;
      if (this.relogioDoTonel <= 0) {
        this.relogioDoTonel = 0.55 / f.refil;
        this.g.som('gluglu');
      }
      // o Refil rápido é um espirro maior na boca do tonel
      this.jato.espirroDoTonel(tonel.x, tonel.altura, tonel.z, f.refil);
      if (tonel !== this.planta.tonel) this.contar('segundo-tonel');
    }
    const antes = this.agua;
    this.agua = Math.min(f.tanque, this.agua + enche * dt);
    if (antes < f.tanque && this.agua >= f.tanque) {
      this.tanqueCheio = true;
      // o Transbordou (regador): encheu até a boca NO TONEL, derrama em volta
      if (perto && f.regras.has('transbordou')) this.transbordar(eu);
    }
    // a mangueira: presa no tonel, a água nunca acaba
    if (f.regras.has('agua-infinita')) {
      this.agua = f.tanque;
      this.enchendo = false;
    }
    this.mangueiraNaMao(dt);

    if (!this.comRegador()) {
      this.g.mirarJogador(null);
      return;
    }
    const ponta = this.pontaDoBico();

    // ---- o Jato carregado: parado junta força, o regador treme e brilha
    if (e.carregado) {
      this.carga = estaParado ? Math.min(1, this.carga + dt / 1.5) : Math.max(0, this.carga - dt * 2);
      if (this.carga > 0.05) {
        this.jato.carregando(ponta, this.carga);
        if (!this.gesto || this.gesto.tipo === 'treme') this.gesto = { tipo: 'treme', t: 0, dur: 0.1 };
      }
    }

    // ---- o Crivo giratório: a cada 4 s, um anel em volta
    if (e.crivoGiratorio) {
      this.crivo += dt;
      if (this.crivo >= 4 && this.algumPerto(eu, f.alcance * 0.9)) {
        this.crivo = 0;
        this.gesto = { tipo: 'giro', t: 0, dur: 0.45 };
        this.jato.anelDeAgua(ponta, f.alcance * 0.9, 'giro', e);
        this.jato.depois(0.35, () => {
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - eu.x, inv.z - eu.z) <= f.alcance * 0.9) {
              this.molhar(inv, f.dano, eu);
              // com a Poça, o anel deixa chão molhado onde pegou
              if (e.poca) this.jato.poca(inv.x, inv.z, 0.55);
            }
          }
        });
      }
    }

    // ---- o Balde: segurar E derrama o tanque inteiro em volta
    if (e.balde) {
      this.baldeEspera = Math.max(0, this.baldeEspera - dt);
      if (this.g.keyDown('KeyE')) this.baldeSegurado += dt;
      else this.baldeSegurado = 0;
      if (this.baldeSegurado > 0.35 && this.baldeEspera <= 0 && this.agua >= 1) {
        this.baldeSegurado = 0;
        this.baldeEspera = 1.5;
        const derramado = this.agua;
        this.agua = 0;
        this.gesto = { tipo: 'balde', t: 0, dur: 0.7 };
        const onde = new THREE.Vector3(eu.x, 1.2, eu.z);
        this.jato.depois(0.2, () => this.jato.anelDeAgua(onde, 2, 'balde', e));
        this.jato.depois(0.5, () => {
          for (const inv of [...this.invasores]) {
            // "num círculo de 2 m": conta o corpo do bicho, e não só o centro dele
            if (this.vulneravel(inv) && Math.hypot(inv.x - eu.x, inv.z - eu.z) <= 2 + inv.jeito.raio) {
              this.molhar(inv, f.dano * (1 + derramado * 0.35), eu);
            }
          }
        });
      }
    }

    // ---- o Gêiser: a cada 20 s, o bicho mais forte vai pela porta
    if (e.geiser) {
      this.geiser += dt;
      if (this.geiser >= 20) {
        const forte = this.invasores.filter((i) => this.vulneravel(i) && i.z > this.planta.portoes[0].z)
          .sort((a, b) => b.vida - a.vida)[0];
        if (forte && forte.ficha.tier === 'chefe' && forte.vida > forte.vidaMax / 3) {
          // BALANÇO: a chefe não sai pela porta de uma vez — o gêiser tira um
          // terço dela (espantava a mãe de cada onda sem luta)
          this.geiser = 0;
          this.jato.rachadura(forte.x, forte.z);
          this.jato.geiser(forte.x, forte.z);
          this.molhar(forte, forte.vidaMax / 3, null);
        } else if (forte) {
          this.geiser = 0;
          forte.estado = 'preso';
          forte.relogio = 0;
          this.jato.rachadura(forte.x, forte.z);
          this.espantado(forte, 'geiser');
        }
      }
    }

    // ---- a Chuva: a cada 30 s, a estufa inteira leva um jato
    if (e.chuva) {
      this.chuva += dt;
      if (this.chuva >= 30) {
        this.chuva = 0;
        const c = this.planta.centro;
        // a nuvenzinha do regador cresce em cima da dupla, e a chuva cai na estufa toda
        this.jato.chover(new THREE.Vector3(c.x, 0, c.z), c.raio, 1.6, 7, {
          em: new THREE.Vector3(eu.x, 3.1, eu.z), raio: 1.3,
        });
        this.jato.depois(1.2, () => {
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - c.x, inv.z - c.z) <= c.raio) this.molhar(inv, f.dano, null);
          }
        });
      }
    }

    // ---- a Dança da chuva: parado 3 s, chove 5 s em volta
    if (e.dancaDaChuva) {
      if (this.dancando > 0) {
        this.dancando -= dt;
        this.danca += dt;
        if (this.danca >= 0.5) {
          this.danca = 0;
          const onde = this.dancaEm;
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - onde.x, inv.z - onde.z) <= 2.5) this.molhar(inv, f.dano * 0.5, null);
          }
        }
      } else if (this.parado >= 3 && !this.jato.chovendo) {
        this.parado = 0;
        this.dancando = 5;
        this.danca = 0;
        this.dancaEm = { x: eu.x, z: eu.z };
        this.jato.chover(new THREE.Vector3(eu.x, 0, eu.z), 2.5, 5, 3.6, {
          // alta e pequena o bastante para não tapar a cabeça da dupla
          em: new THREE.Vector3(eu.x, 3.9, eu.z), raio: 1.3,
        });
      }
    }

    /*
     * ---- o Regador gigante (regador): de 30 em 30 s, 5 s em que a lata da mão
     * cresce quase o dobro, o leque abre o dobro e cada jato molha o dobro. A
     * peça cresce e encolhe devagar, a partir da mão (o grupo da mão é o pivô)
     */
    if (f.regras.has('regador-gigante')) {
      if (this.giganteResta > 0) {
        this.giganteResta -= dt;
      } else {
        this.giganteRelogio += dt;
        if (this.giganteRelogio >= 30) {
          this.giganteRelogio = 0;
          this.giganteResta = 5;
          this.g.som('jatao');
          this.jato.anelDeAgua(new THREE.Vector3(eu.x, 1.2, eu.z), 1.6, 'giro', e);
          this.contar('regador-gigante');
        }
      }
      const peca = this.g.objetoNaMao();
      if (peca) {
        const alvo = this.giganteResta > 0 ? 1.8 : 1;
        const agora = peca.scale.x + (alvo - peca.scale.x) * Math.min(1, dt * 6);
        peca.scale.setScalar(Math.abs(agora - alvo) < 0.005 ? alvo : agora);
      }
    }

    /*
     * ---- o Super molhador (pistola): de 20 em 20 s, 4 s de tiros no dobro da
     * velocidade que não gastam água. Começa com um anel de água em volta, e
     * a pistola brilha tremendo enquanto dura
     */
    let cadencia = f.cadencia;
    let gasto = f.gastoPorJato;
    if (f.regras.has('super-molhador')) {
      if (this.superResta > 0) {
        this.superResta -= dt;
        cadencia *= 0.5;
        gasto = 0;
        if (!this.gesto) this.gesto = { tipo: 'treme', t: 0, dur: 0.1 };
      } else {
        this.superMolhador += dt;
        if (this.superMolhador >= 20) {
          this.superMolhador = 0;
          this.superResta = 4;
          this.g.som('jatao');
          this.jato.anelDeAgua(new THREE.Vector3(eu.x, 0.6, eu.z), 1.3, 'giro', e);
          this.contar('super-molhador');
        }
      }
    }

    // ---- o jato de verdade: cadência, água e alvo
    this.recarga += dt;
    const alvo = this.escolherAlvo(eu);
    this.g.mirarJogador(alvo ? { x: alvo.x, z: alvo.z } : null);
    if (!alvo || this.regadorDeFolga || this.recarga < cadencia || this.agua < gasto) return;
    this.recarga = 0;
    this.agua -= gasto;
    this.atirar(eu, alvo);
  }

  /**
   * A MANGUEIRA, a cada quadro (só na rodada de mangueira, `armas.ts`): estica
   * do tonel até a mão, e as três cartas dela que moram no chão ou no relógio —
   * o Chicote, o Vazamento e a Enchente.
   */
  private mangueiraNaMao(dt: number): void {
    const f = this.ficha;
    if (!f.regras.has('agua-infinita')) return;
    const obj = this.comRegador() ? this.g.objetoNaMao() : null;
    const eu = this.g.playerPosition();
    const mao = obj ? obj.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(eu.x, 0.7, eu.z);
    this.mangueira.atualizar(this.planta.tonel, new THREE.Vector3(eu.x, 0, eu.z), mao);

    // ---- a Enchente: a cada 25 s, 3 s de jatão
    if (f.regras.has('enchente')) {
      if (this.enchenteResta > 0) {
        this.enchenteResta -= dt;
      } else {
        this.enchente += dt;
        if (this.enchente >= 25) {
          this.enchente = 0;
          this.enchenteResta = 3;
          this.g.som('jatoForte');
          this.jato.espirroDoTonel(this.planta.tonel.x, this.planta.tonel.altura, this.planta.tonel.z, 3);
        }
      }
    }

    // ---- a Mangueira que rega: canteiro que ela encosta sara devagar (0,5 por
    // segundo, uns 70 s do zero ao cheio), com um brotinho de vez em quando
    if (f.regras.has('mangueira-rega')) {
      this.regaDaMangueira -= dt;
      const pontos = this.mangueira.pontosNoChao();
      for (const c of this.canteiros) {
        if (c.vida <= 0 || c.vida >= c.vidaMax) continue;
        if (!pontos.some((p) => distanciaAoCanteiro(p.x, p.z, c) < 0.45)) continue;
        c.vida = Math.min(c.vidaMax, c.vida + 0.5 * dt);
        this.pintarCanteiro(c);
        this.contar('mangueira-rega');
        if (this.regaDaMangueira <= 0) this.jato.broto(c.x, c.z, c.meioX, c.meioZ);
      }
      if (this.regaDaMangueira <= 0) this.regaDaMangueira = 1.5;
    }

    const chicote = f.regras.has('chicote');
    const vaza = f.regras.has('vazamento');
    const laco = f.regras.has('laco');
    if (!chicote && !vaza && !laco) return;
    // ---- o Vazamento: a mangueira pinga pocinhas no chão
    if (vaza) {
      this.vazamento -= dt;
      if (this.vazamento <= 0) {
        this.vazamento = 1.2;
        const p = this.mangueira.pontoNoChao(this.sorte());
        if (p) this.jato.poca(p.x, p.z, 0.45, 2.5);
      }
    }
    for (const inv of [...this.invasores]) {
      if (!this.vulneravel(inv)) continue;
      const d = this.mangueira.distancia(inv.x, inv.z);
      if (d > 0.3 + inv.jeito.raio * 0.6) continue;
      if (vaza && inv.lento <= 0.1) {
        inv.lento = 2;
        this.contar('vazamento');
      }
      // ---- o Laço: a mangueira se enrola em quem pisa nela (1,5 s parado;
      // o mesmo bicho só de 6 em 6 s, senão a chefe nunca mais saía do lugar)
      if (laco && (this.lacoEspera.get(inv) ?? 0) <= this.relogioDoChicote) {
        this.lacoEspera.set(inv, this.relogioDoChicote + 6);
        inv.tonto = Math.max(inv.tonto, 1.5);
        this.jato.sacudida(inv.x, inv.ficha.alturaDaBarra * 0.4, inv.z);
        this.contar('laco');
      }
      // ---- o Chicote: a mangueira dá um tranco em quem pisa nela
      if (chicote && (this.chicoteEspera.get(inv) ?? 0) <= this.relogioDoChicote) {
        this.chicoteEspera.set(inv, this.relogioDoChicote + 1.5);
        const peso = inv.ficha.tier === 'chefe' ? 0.2 : inv.ficha.tier === 'tanque' ? 0.4 : 1;
        this.empurrar(inv, inv.x - eu.x, inv.z - eu.z, 0.8 * peso);
        this.jato.tranco(inv.x, inv.z, Math.atan2(inv.x - eu.x, inv.z - eu.z), 1);
        this.jato.respingo(inv.x, 0.15, inv.z, f.jato, 1);
        this.molhar(inv, f.dano * 1.5, null);
        this.contar('chicote');
      }
    }
    this.relogioDoChicote += dt;
  }

  /** o relógio do Chicote e do Laço (a espera de cada bicho é medida nele) */
  private relogioDoChicote = 0;
  /** o Laço: cada bicho fica enrolado no máximo de 6 em 6 s */
  private readonly lacoEspera = new WeakMap<Invasor, number>();
  /** a Mangueira que rega: o relógio do próximo brotinho */
  private regaDaMangueira = 0;

  private dancaEm = { x: 0, z: 0 };
  /** para que lado sai o fio da Bifurcação desta vez */
  private ladoDaBifurcacao = 1;
  /** o Super molhador: o relógio até o próximo, e quanto falta do que está valendo */
  private superMolhador = 0;
  private superResta = 0;
  /** o Regador gigante: o relógio até o próximo, e quanto falta do que está valendo */
  private giganteRelogio = 0;
  private giganteResta = 0;
  /** a Névoa que fica (borrifador): as nuvens paradas, e quem já se molhou em cada uma */
  private nevoasParadas: Array<{ x: number; z: number; raio: number; resta: number; puff: number; molhados: Set<Invasor> }> = [];
  /** a Nuvem teimosa (borrifador): em quem ela chove, quanto falta, e a próxima chuvinha */
  private teimosa: { alvo: Invasor; resta: number; tique: number } | null = null;
  /** quanto você andou no último quadro (o Pique e a Bota leem daqui) */
  private passoDoQuadro = 0;
  /** o multiplicador de velocidade de agora, com Pique, poça e picolé */
  private velocidadeAgora = 1;

  private algumPerto(eu: THREE.Vector3, raio: number): boolean {
    return this.invasores.some((i) => this.vulneravel(i) && Math.hypot(i.x - eu.x, i.z - eu.z) <= raio);
  }

  /**
   * QUEM LEVA O JATO: o mais perto, por padrão. As duas cartas de mira mudam
   * isso (o de mais vida, ou quem já está comendo), e o bicho atrás de um
   * canteiro só é alcançável pelo Jato em arco.
   */
  private escolherAlvo(eu: THREE.Vector3): Invasor | null {
    const f = this.ficha;
    const candidatos = this.invasores.filter((i) => this.vulneravel(i)
      && Math.hypot(i.x - eu.x, i.z - eu.z) <= f.alcance
      && (f.jato.arco || !this.atrasDeCanteiro(eu, i)));
    if (candidatos.length === 0) return null;
    const dist = (i: Invasor): number => Math.hypot(i.x - eu.x, i.z - eu.z);
    // a Pontaria no bando (borrifador): o alvo é onde a névoa pega MAIS bichos
    // juntos; no empate, o mais perto
    if (f.regras.has('pontaria-no-bando')) {
      const raio = this.raioDaNevoa();
      const noBando = (i: Invasor): number => this.invasores.filter((o) => this.vulneravel(o)
        && Math.hypot(o.x - i.x, o.z - i.z) <= raio + o.jeito.raio).length;
      return candidatos.map((i) => ({ i, n: noBando(i), d: dist(i) })).sort((a, b) => b.n - a.n || a.d - b.d)[0].i;
    }
    if (f.jato.mira === 'grandao') return candidatos.sort((a, b) => b.vida - a.vida || dist(a) - dist(b))[0];
    if (f.jato.mira === 'come') {
      const comendo = candidatos.filter((i) => i.estado === 'comendo');
      if (comendo.length) return comendo.sort((a, b) => dist(a) - dist(b))[0];
    }
    return candidatos.sort((a, b) => dist(a) - dist(b))[0];
  }

  /**
   * UM ATAQUE. Decide qual jato especial sai agora (tanque cheio, carregado, o
   * décimo do arco-íris), mostra a mira, e manda o MESMO jato para a frente e,
   * com o Segundo bico, para trás — o dano cai quando a água chega.
   */
  private atirar(eu: THREE.Vector3, alvo: Invasor): void {
    const f = this.ficha;
    const e = f.jato;
    this.jatosDados += 1;
    const rumo = Math.atan2(alvo.x - eu.x, alvo.z - eu.z);

    // qual jato especial é este
    let especial: Especial | undefined;
    // a Enchente: enquanto ela dura, todo jato é o jatão que atravessa a fila
    if (this.enchenteResta > 0) {
      especial = 'carregado';
      this.contar('enchente');
    } else if (e.carregado && this.carga >= 1) especial = 'carregado';
    else if (e.pressaoAcumulada && this.tanqueCheio) especial = 'pressao-cheia';
    else if (e.arcoIris && this.jatosDados % 10 === 0) especial = 'arco-iris';
    this.tanqueCheio = false;
    if (especial === 'carregado') this.carga = 0;

    // a mira mostra quem foi escolhido antes de a água sair
    const atraso = e.mira ? 0.3 : 0;
    if (e.mira) this.jato.mirar(alvo.raiz, alvo.ficha.alturaDaBarra, 0.55);

    const origem = { x: eu.x, z: eu.z };
    // a PISTOLA dá um coice a cada tiro: o cano pula e volta
    if (e.pistola && (!this.gesto || this.gesto.tipo === 'coice')) this.gesto = { tipo: 'coice', t: 0, dur: 0.22 };
    // o BORRIFADOR: o dedo aperta o gatilho, e o frasco abaixa a cabeça e volta
    if (e.nevoa && (!this.gesto || this.gesto.tipo === 'aperto')) this.gesto = { tipo: 'aperto', t: 0, dur: 0.26 };
    // a Pontaria no bando (borrifador): o anel rosa mostra no chão onde a névoa vai cair
    if (f.regras.has('pontaria-no-bando')) {
      this.jato.miraNoBando(alvo.x, alvo.z, this.raioDaNevoa());
      const maisPerto = this.invasores
        .filter((i) => this.vulneravel(i) && Math.hypot(i.x - eu.x, i.z - eu.z) <= f.alcance)
        .sort((a, b) => Math.hypot(a.x - eu.x, a.z - eu.z) - Math.hypot(b.x - eu.x, b.z - eu.z))[0];
      if (maisPerto && maisPerto !== alvo) this.contar('pontaria-no-bando');
    }
    /*
     * a Nuvem teimosa (borrifador): um aperto em cinco deixa uma nuvenzinha
     * chovendo em cima do bicho mais FORTE do alcance por 4 s — é a carta que
     * dá ao borrifador como vencer um grandão
     */
    if (f.regras.has('nuvem-teimosa') && this.jatosDados % 5 === 0) {
      const forte = this.invasores
        .filter((i) => this.vulneravel(i) && Math.hypot(i.x - eu.x, i.z - eu.z) <= f.alcance + 1.5)
        .sort((a, b) => b.vida - a.vida)[0];
      if (forte) {
        this.teimosa = { alvo: forte, resta: 4, tique: 0.25 };
        this.g.som('chuvinha');
      }
    }
    // o Redemoinho (borrifador): de seis em seis apertos, a névoa gira e puxa
    const redemoinho = f.regras.has('redemoinho') && this.jatosDados % 6 === 0;
    /*
     * o BALÃO D'ÁGUA (pistola): um tiro em cinco sai como balão, que voa numa
     * curvinha e estoura onde cai, molhando todo mundo em 1,2 m com 1,5× a força
     */
    const balao = f.regras.has('balao-dagua') && this.jatosDados % 5 === 0;
    // a RAJADA (pistola): de quatro em quatro tiros, mais dois logo atrás
    const rajada = f.regras.has('rajada') && this.jatosDados % 4 === 0;
    // o Esguicho no olho (pistola): um tiro em quatro, defasado da Rajada
    const olho = f.regras.has('esguicho-no-olho') && this.jatosDados % 4 === 2;
    // a Chuveirada (regador): de três em três jatos, o leque abre o dobro
    const chuveirada = f.regras.has('chuveirada') && this.jatosDados % 3 === 0;
    if (chuveirada) this.contar('chuveirada');
    const saida = (): void => {
      const de = this.pontaDoBico();
      if (balao) {
        const onde = new THREE.Vector3(alvo.x, 0.2, alvo.z);
        this.jato.balaoDagua(de, onde, () => {
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - onde.x, inv.z - onde.z) <= 1.2 + inv.jeito.raio) {
              this.acertar(inv, f.dano * 1.5, origem);
            }
          }
        });
        this.contar('balao-dagua');
      } else {
        this.umJato({ origem, de, rumo, alvo, dano: f.dano, especial, largura: chuveirada ? f.largura * 2 : undefined, redemoinho });
      }
      /*
       * a Pistola dupla: uma em cada mão — um segundo tiro sai junto, no
       * outro bicho mais perto do alcance, com 70% da força
       */
      if (f.regras.has('pistola-dupla')) {
        const outro = this.invasores
          .filter((i) => i !== alvo && this.vulneravel(i) && Math.hypot(i.x - eu.x, i.z - eu.z) <= f.alcance
            && (e.arco || !this.atrasDeCanteiro(eu, i)))
          .sort((a, b) => Math.hypot(a.x - eu.x, a.z - eu.z) - Math.hypot(b.x - eu.x, b.z - eu.z))[0];
        if (outro) {
          const r2 = Math.atan2(outro.x - eu.x, outro.z - eu.z);
          const de2 = new THREE.Vector3(eu.x + Math.cos(r2) * 0.25, de.y, eu.z - Math.sin(r2) * 0.25);
          this.umJato({ origem, de: de2, rumo: r2, alvo: outro, dano: f.dano * 0.7 });
          this.contar('pistola-dupla');
        }
      }
      // o Esguicho no olho: um tiro em quatro deixa o bicho tonto 1 s
      if (olho) {
        const chega = Math.hypot(alvo.x - eu.x, alvo.z - eu.z) / 16 + 0.08;
        this.jato.depois(chega, () => {
          if (!this.invasores.includes(alvo) || !this.vulneravel(alvo)) return;
          alvo.tonto = Math.max(alvo.tonto, 1);
          this.jato.sacudida(alvo.x, alvo.ficha.alturaDaBarra * 0.7, alvo.z);
          this.contar('esguicho-no-olho');
        });
      }
      if (rajada) {
        for (const atraso of [0.1, 0.2]) {
          this.jato.depois(atraso, () => {
            if (!this.invasores.includes(alvo)) return;
            const agora = this.g.playerPosition();
            const r = Math.atan2(alvo.x - agora.x, alvo.z - agora.z);
            this.umJato({ origem: { x: agora.x, z: agora.z }, de: this.pontaDoBico(), rumo: r, alvo, dano: f.dano });
          });
        }
        this.contar('rajada');
      }
      /*
       * a Bifurcação (mangueira): um Y no esguicho — um segundo fio sai de
       * lado, alternando esquerda e direita, com metade da força. É o mesmo
       * `umJato`, então ele leva todas as outras cartas junto.
       */
      if (f.regras.has('bifurcacao')) {
        this.ladoDaBifurcacao = -this.ladoDaBifurcacao;
        this.umJato({ origem, de, rumo: rumo + this.ladoDaBifurcacao * 0.44, alvo: null, dano: f.dano * 0.5, especial });
        this.contar('bifurcacao');
      }
      // o Segundo bico: o mesmo jato, ao mesmo tempo, pelo bico de trás
      if (e.segundoBico) {
        const deTras = new THREE.Vector3(eu.x - Math.sin(rumo) * 0.25, de.y - 0.05, eu.z - Math.cos(rumo) * 0.25);
        this.umJato({ origem, de: deTras, rumo: rumo + Math.PI, alvo: null, dano: f.dano * SEGUNDO_BICO, especial });
      }
    };
    if (atraso) this.jato.depois(atraso, saida);
    else saida();
  }

  /**
   * UM JATO, COM TUDO O QUE A MÃO TEM — o coração das builds.
   *
   * Regra do Renan: as cartas que a rodada juntou valem TODAS ao mesmo tempo.
   * Então não existe "o jato do Borrifador" e "o jato da Pressão": existe um
   * jato só, e cada carta mexe numa parte dele. O Borrifador divide em três
   * fios, a Pressão faz cada fio atravessar, o Leque abre os três, a Poça fica
   * onde cada um cai, o Gelo congela cada bicho molhado, a Gota pesada empurra
   * cada um. O especial do tiro (tanque cheio, carregado, arco-íris) também
   * entra junto em vez de apagar o resto: três jatões, três fios arco-íris.
   *
   * É o mesmo caminho para o bico da frente, o de trás (Segundo bico) e o
   * regador do parceiro (Os dois na frente) — por isso as três coisas ganham
   * toda carta nova de graça.
   */
  private umJato(t: Tiro): void {
    const f = this.ficha;
    let e = f.jato;
    let multiplicador = t.especial === 'carregado' || t.especial === 'pressao-cheia' ? 3 : 1;
    /*
     * O JATO CONTÍNUO (mangueira): o mesmo bicho levando água sem parar
     * encharca mais a cada jato, +15% até o dobro — e o fio engrossa junto,
     * que é como se vê. Trocar de alvo zera. Só o bico da frente conta.
     */
    if (e.continuo && t.alvo) {
      const vezes = this.continuo?.inv === t.alvo ? this.continuo.vezes + 1 : 0;
      this.continuo = { inv: t.alvo, vezes };
      const ganho = Math.min(1, vezes * 0.15);
      multiplicador *= 1 + ganho;
      if (vezes > 0) {
        e = { ...e, grosso: (e.grosso ?? 0) + Math.round(ganho * 5) };
        this.contar('jato-continuo');
      }
    }
    /*
     * o Regador gigante (regador): enquanto a lata está gigante, o leque abre
     * o dobro e cada jato molha o dobro — soma com a Chuveirada
     */
    let largura = t.largura ?? f.largura;
    if (this.giganteResta > 0) {
      largura *= 2;
      multiplicador *= 2;
    }
    /*
     * a Lata cheia (regador): com a lata mais da metade cheia, o jato molha
     * mais e sai mais grosso — é o peso da água que se vê
     */
    if (f.lataCheia > 0 && this.agua > f.tanque / 2) {
      multiplicador *= 1 + f.lataCheia;
      e = { ...e, grosso: (e.grosso ?? 0) + 1 };
      this.contar('lata-cheia');
    }
    const atravessa = f.regras.has('atravessa') || t.especial === 'arco-iris';
    const meia = THREE.MathUtils.degToRad(largura) / 2;
    // o Borrifador divide o jato em três, em leque; sem ele, é um jato só
    const desvios = e.borrifador ? [-meia, 0, meia] : [0];
    const parte = e.borrifador ? 0.4 : 1;
    for (const desvio of desvios) {
      const rumo = t.rumo + desvio;
      if (t.especial === 'carregado') {
        this.jatao(t, rumo, parte);
        continue;
      }
      const alvo = desvio === 0 ? t.alvo : null;
      let atingidos: Invasor[];
      let longe: Invasor | null;
      let para: THREE.Vector3;
      let tempo: number;
      let raioDaNuvem = 0;
      if (e.nevoa) {
        /*
         * A NÉVOA do borrifador: o aperto solta uma nuvem que cai no bicho
         * escolhido e molha TODO MUNDO dentro dela, sem a sombra de um bicho
         * no outro (é névoa, contorna). O Crivo de três furos faz três
         * nuvens menores em leque; a Pressão estica a nuvem para trás do alvo.
         */
        const dist = t.alvo ? Math.hypot(t.alvo.x - t.origem.x, t.alvo.z - t.origem.z) : f.alcance * 0.75;
        para = alvo ? new THREE.Vector3(alvo.x, 0.25, alvo.z) : pontoAFrente(t.origem, rumo, dist).setY(0.25);
        raioDaNuvem = this.raioDaNevoa(largura) * (e.borrifador ? 0.7 : 1);
        atingidos = this.naNevoa(para, raioDaNuvem, atravessa ? rumo : null);
        longe = null;
        tempo = this.jato.disparar({
          de: t.de, para, estilo: e, largura, especial: t.especial, raio: raioDaNuvem, atravessa,
        });
      } else {
        // o cone do jato comum, ou o fiozinho estreito de cada parte do Borrifador
        const abertura = e.borrifador ? 0.22 : meia;
        atingidos = this.noCone(t.origem, rumo, f.alcance, abertura, alvo, atravessa);
        longe = atingidos.length ? atingidos[atingidos.length - 1] : null;
        // a água vai até o último atingido; a Pressão e o Arco-íris passam dele,
        // e jato que não acha ninguém cai no chão a um passo do fim do alcance
        para = atravessa || !longe
          ? pontoAFrente(t.origem, rumo, Math.max(longe ? Math.hypot(longe.x - t.origem.x, longe.z - t.origem.z) + 1.2 : 0, f.alcance * 0.9))
          : new THREE.Vector3((alvo ?? atingidos[0]).x, 0.25, (alvo ?? atingidos[0]).z);
        tempo = this.jato.disparar({
          de: t.de, para, estilo: e, largura: e.borrifador ? 6 : largura, especial: t.especial,
          forma: e.borrifador ? 'fio' : undefined,
        });
      }
      const alcancePara = Math.max(0.5, Math.hypot(para.x - t.origem.x, para.z - t.origem.z));
      for (const inv of atingidos) {
        const chega = atravessa && !e.nevoa ? tempo * (Math.hypot(inv.x - t.origem.x, inv.z - t.origem.z) / alcancePara) : tempo;
        /*
         * o Tiro de longe (pistola): bicho a mais de 3,5 m de quem atira leva
         * 40% mais — e o alvinho aparece nele, que é como se vê
         */
        let longe = 1;
        if (f.regras.has('tiro-de-longe') && Math.hypot(inv.x - t.origem.x, inv.z - t.origem.z) > 3.5) {
          longe = 1.4;
          this.jato.mirar(inv.raiz, inv.ficha.alturaDaBarra, 0.35);
          this.contar('tiro-de-longe');
        }
        /*
         * a Regada caprichada (regador): o PRIMEIRO jato em cada bicho molha
         * mais, com um respingo grande. Quem já levou jato fica marcado sempre,
         * com ou sem a carta: pegar a carta no meio da rodada não dá bônus em
         * bicho velho
         */
        let capricho = 1;
        if (!inv.regado) {
          inv.regado = true;
          if (f.primeiraRegada > 0) capricho = 1 + f.primeiraRegada;
        }
        /*
         * o Encharcado (borrifador): cada névoa seguida no mesmo bicho molha
         * 10% mais que a anterior, até +50%. É o que faz a névoa, fraca num
         * bicho só, vencer um grandão que fica muito tempo dentro dela
         */
        let encharca = 1;
        if (e.nevoa && f.regras.has('encharcado')) {
          encharca = 1 + 0.1 * inv.umidade;
          if (inv.umidade > 0) this.contar('encharcado');
          inv.umidade = Math.min(5, inv.umidade + 1);
          inv.umidadeResta = 3;
        }
        const dano = t.dano * multiplicador * parte * longe * capricho * encharca;
        this.jato.depois(chega, () => {
          if (capricho > 1 && this.invasores.includes(inv)) {
            this.jato.respingo(inv.x, inv.ficha.alturaDaBarra * 0.5, inv.z, e, 2.4);
            this.contar('regada-caprichada');
          }
          const vivo = this.vulneravel(inv) && this.invasores.includes(inv);
          this.acertar(inv, dano, t.origem, t.especial);
          if (f.regras.has('respingo')) this.respingar(inv, dano * 0.3);
          // a Névoa que se espalha (borrifador): quem a névoa espantou vira nuvem nova
          if (vivo && e.nevoa && f.regras.has('nevoa-que-se-espalha') && inv.vida <= 0) this.nevoaEmCadeia(inv.x, inv.z, 1);
        });
        // o Ricochete (pistola): do bicho que o tiro da frente acertou, um
        // tiro menor pula no vizinho mais perto (até 2,5 m)
        if (inv === t.alvo && f.regras.has('ricochete')) {
          this.jato.depois(chega, () => this.ricochetear(inv, t.dano * multiplicador * 0.5));
        }
      }
      if (atingidos.length === 0 && !e.nevoa) this.jato.depois(tempo, () => this.jato.respingo(para.x, 0.05, para.z, e, 0.5));
      if (e.nevoa) this.depoisDaNevoa(para, raioDaNuvem, tempo, atingidos, !!t.redemoinho && desvio === 0);
      if (t.especial === 'arco-iris') this.jato.depois(tempo * 0.6, () => this.jato.arcoNoAr(t.de, para));
      if (t.especial === 'pressao-cheia' && longe) {
        const onde = new THREE.Vector3(longe.x, 0.3, longe.z);
        this.jato.depois(tempo, () => this.jato.anelDeAgua(onde, 0.9 * Math.sqrt(parte), 'giro', e));
      }
      if (e.poca) this.jato.depois(tempo, () => this.jato.poca(para.x, para.z, e.nevoa ? raioDaNuvem * 0.6 : e.borrifador ? 0.45 : 0.7));
      /*
       * a Rega de verdade (regador): o jato que passa por cima de um canteiro
       * machucado — ou cai perto dele, no bicho que está comendo — rega ele
       * também: +1 de vida por jato (o Borrifador divide), com um brotinho
       */
      if (f.regras.has('rega-de-verdade')) {
        for (const c of this.canteiros) {
          if (c.vida <= 0 || c.vida >= c.vidaMax) continue;
          const passa = segmentoCruzaRetangulo(t.origem.x, t.origem.z, para.x, para.z, c.x, c.z, c.meioX + 0.3, c.meioZ + 0.3)
            || distanciaAoCanteiro(para.x, para.z, c) < 0.6;
          if (!passa) continue;
          this.jato.depois(tempo, () => {
            if (c.vida <= 0) return;
            c.vida = Math.min(c.vidaMax, c.vida + parte);
            this.pintarCanteiro(c);
            this.jato.broto(c.x, c.z, c.meioX * 0.6, c.meioZ * 0.6);
            this.contar('rega-de-verdade');
          });
        }
      }
    }
  }

  /** o raio da nuvem do borrifador: sai da `largura` (o Leque aberto) vezes a Névoa larga */
  private raioDaNevoa(largura = this.ficha.largura): number {
    return (0.75 + largura * 0.008) * this.ficha.raioDaNevoa;
  }

  /**
   * OS BICHOS DENTRO DA NUVEM: todos, sem sombra de um no outro — é névoa, e
   * não jato. Com a Pressão (`atravessa`) a névoa passa do alvo e segue um
   * tubo de 1,6 m para trás dele.
   */
  private naNevoa(centro: { x: number; z: number }, raio: number, atravessaRumo: number | null): Invasor[] {
    return this.invasores.filter((i) => {
      if (!this.vulneravel(i)) return false;
      const dx = i.x - centro.x;
      const dz = i.z - centro.z;
      if (Math.hypot(dx, dz) <= raio + i.jeito.raio) return true;
      if (atravessaRumo === null) return false;
      const frente = dx * Math.sin(atravessaRumo) + dz * Math.cos(atravessaRumo);
      const lado = Math.abs(dx * Math.cos(atravessaRumo) - dz * Math.sin(atravessaRumo));
      return frente > 0 && frente <= raio + 1.6 && lado <= raio * 0.6 + i.jeito.raio;
    });
  }

  /**
   * O QUE A NÉVOA DEIXA quando cai, carta por carta do borrifador: a nuvem
   * que fica parada (Névoa que fica), o orvalho no canteiro (Folha orvalhada)
   * e o giro que puxa os bichos (Redemoinho).
   */
  private depoisDaNevoa(
    centro: THREE.Vector3, raio: number, tempo: number, atingidos: Invasor[], redemoinho: boolean,
  ): void {
    const f = this.ficha;
    this.jato.depois(tempo, () => {
      if (f.regras.has('nevoa-que-fica')) {
        this.nevoasParadas.push({ x: centro.x, z: centro.z, raio, resta: 2, puff: 0.2, molhados: new Set(atingidos) });
      }
      if (f.regras.has('folha-orvalhada')) {
        for (const c of this.canteiros) {
          if (c.vida <= 0 || distanciaAoCanteiro(centro.x, centro.z, c) > raio) continue;
          if (c.orvalho < 0.5) this.jato.orvalho(c.x, c.z, c.meioX, c.meioZ);
          c.orvalho = 2;
        }
      }
      if (redemoinho) this.redemoinhar(centro, raio);
    });
  }

  /** o Redemoinho: a névoa gira em espiral e puxa quem está em volta para o meio */
  private redemoinhar(centro: { x: number; z: number }, raio: number): void {
    const alcance = raio * 1.6;
    this.jato.redemoinho(new THREE.Vector3(centro.x, 0.3, centro.z), alcance);
    let puxou = false;
    for (const inv of this.invasores) {
      if (!this.vulneravel(inv)) continue;
      const d = Math.hypot(inv.x - centro.x, inv.z - centro.z);
      if (d > alcance + inv.jeito.raio || d < 0.2) continue;
      const peso = inv.ficha.tier === 'chefe' ? 0.2 : inv.ficha.tier === 'tanque' ? 0.4 : 1;
      this.empurrar(inv, centro.x - inv.x, centro.z - inv.z, Math.min(d * 0.8, 0.9) * peso);
      puxou = true;
    }
    if (puxou) this.contar('redemoinho');
  }

  /**
   * a Névoa que se espalha (borrifador, lendária): o bicho que a névoa
   * espantou estoura numa nuvem nova, com metade da força — e quem ESSA nuvem
   * espantar estoura também, até três vezes em cadeia
   */
  private nevoaEmCadeia(x: number, z: number, vez: number): void {
    const f = this.ficha;
    const raio = this.raioDaNevoa() * 0.8;
    this.jato.depois(0.25, () => {
      const centro = new THREE.Vector3(x, 0.25, z);
      this.jato.nuvemDeNevoa(centro, raio, f.jato, true);
      this.contar('nevoa-que-se-espalha');
      for (const inv of this.naNevoa(centro, raio, null)) {
        const vivo = this.invasores.includes(inv);
        this.acertar(inv, f.dano * 0.5, { x, z });
        if (vivo && inv.vida <= 0 && vez < 3) this.nevoaEmCadeia(inv.x, inv.z, vez + 1);
      }
    });
  }

  /**
   * A NÉVOA, A CADA QUADRO (borrifador): as nuvens da Névoa que fica molhando
   * quem entra, a chuvinha da Nuvem teimosa, o bicho encharcado secando (e
   * pingando enquanto isso) e o orvalho dos canteiros secando.
   */
  private nevoaNoAr(dt: number): void {
    const f = this.ficha;
    for (let k = this.nevoasParadas.length - 1; k >= 0; k--) {
      const n = this.nevoasParadas[k];
      n.resta -= dt;
      n.puff -= dt;
      if (n.resta <= 0) {
        this.nevoasParadas.splice(k, 1);
        continue;
      }
      if (n.puff <= 0) {
        n.puff = 0.3;
        this.jato.nevoaParada(n.x, n.z, n.raio, f.jato);
      }
      for (const inv of [...this.invasores]) {
        if (n.molhados.has(inv) || !this.vulneravel(inv)) continue;
        if (Math.hypot(inv.x - n.x, inv.z - n.z) > n.raio + inv.jeito.raio) continue;
        n.molhados.add(inv);
        this.acertar(inv, f.dano * 0.5, { x: n.x, z: n.z });
        this.contar('nevoa-que-fica');
      }
    }
    if (this.teimosa) {
      const t = this.teimosa;
      t.resta -= dt;
      t.tique -= dt;
      if (t.resta <= 0 || !this.invasores.includes(t.alvo) || t.alvo.vida <= 0) {
        this.teimosa = null;
      } else if (t.tique <= 0) {
        t.tique = 0.5;
        const a = t.alvo;
        this.jato.chuvinhaNoBicho(a.x, a.ficha.alturaDaBarra, a.z);
        if (this.vulneravel(a)) {
          this.molhar(a, f.dano * 1.2, null);
          this.contar('nuvem-teimosa');
        }
        // a chuvinha respinga em quem está colado nele
        for (const o of [...this.invasores]) {
          if (o !== a && this.vulneravel(o) && Math.hypot(o.x - a.x, o.z - a.z) <= 1 + o.jeito.raio) this.molhar(o, f.dano * 0.5, null);
        }
      }
    }
    for (const inv of this.invasores) {
      if (inv.umidade <= 0) continue;
      inv.umidadeResta -= dt;
      if (inv.umidadeResta <= 0) inv.umidade = 0;
      else if (Math.random() < dt * inv.umidade * 1.5) this.jato.pingar(inv.x, inv.ficha.alturaDaBarra * 0.6, inv.z);
    }
    for (const c of this.canteiros) {
      if (c.orvalho <= 0) continue;
      c.orvalho -= dt;
      if (Math.random() < dt * 3) this.jato.orvalho(c.x, c.z, c.meioX, c.meioZ, 2);
    }
  }

  /**
   * o Respingo (regador): o bicho que levou jato espirra água em volta — quem
   * está a 1 m dele leva uma parte, com um respingo em cada um
   */
  private respingar(de: Invasor, dano: number): void {
    const e = this.ficha.jato;
    let alguem = false;
    for (const outro of [...this.invasores]) {
      if (outro === de || !this.vulneravel(outro)) continue;
      if (Math.hypot(outro.x - de.x, outro.z - de.z) > 1 + outro.jeito.raio) continue;
      alguem = true;
      this.jato.respingo(outro.x, outro.ficha.alturaDaBarra * 0.5, outro.z, e, 0.8);
      this.molhar(outro, dano, { x: de.x, z: de.z });
    }
    if (alguem) {
      this.jato.respingo(de.x, de.ficha.alturaDaBarra * 0.5, de.z, e, 1.8);
      this.contar('respingo');
    }
  }

  /**
   * o Transbordou (regador): a lata encheu até a boca no tonel e derrama num
   * anel de 2 m em volta de quem rega — molha todo bicho ali (é justamente onde
   * os bichos que bebem no tonel ficam)
   */
  private transbordar(eu: THREE.Vector3): void {
    const f = this.ficha;
    const onde = new THREE.Vector3(eu.x, 0.4, eu.z);
    this.jato.anelDeAgua(onde, 2, 'balde', f.jato);
    this.contar('transbordou');
    this.jato.depois(0.3, () => {
      for (const inv of [...this.invasores]) {
        if (this.vulneravel(inv) && Math.hypot(inv.x - onde.x, inv.z - onde.z) <= 2 + inv.jeito.raio) {
          this.molhar(inv, f.dano, { x: onde.x, z: onde.z });
        }
      }
    });
  }

  /** o Ricochete: do bicho acertado, um tiro menor pula no vizinho mais perto */
  private ricochetear(de: Invasor, dano: number): void {
    const vizinho = this.invasores
      .filter((i) => i !== de && this.vulneravel(i) && Math.hypot(i.x - de.x, i.z - de.z) <= 2.5)
      .sort((a, b) => Math.hypot(a.x - de.x, a.z - de.z) - Math.hypot(b.x - de.x, b.z - de.z))[0];
    if (!vizinho) return;
    const tempo = this.jato.disparar({
      de: new THREE.Vector3(de.x, de.ficha.alturaDaBarra * 0.5, de.z),
      para: new THREE.Vector3(vizinho.x, 0.25, vizinho.z),
      estilo: this.ficha.jato, largura: 6, forma: 'tiro',
    });
    this.jato.depois(tempo, () => this.acertar(vizinho, dano, { x: de.x, z: de.z }));
    this.contar('ricochete');
  }

  /** os bichos no cone, do mais perto ao mais longe, com a sombra de um no outro */
  private noCone(
    eu: { x: number; z: number }, rumo: number, alcance: number, meiaAbertura: number,
    alvo: Invasor | null, atravessa: boolean,
  ): Invasor[] {
    const f = this.ficha;
    const lista = this.invasores
      .filter((i) => this.vulneravel(i))
      .map((i) => ({ i, d: Math.hypot(i.x - eu.x, i.z - eu.z), a: difAngulo(Math.atan2(i.x - eu.x, i.z - eu.z), rumo) }))
      .filter(({ i, d, a }) => d <= alcance + i.jeito.raio && Math.abs(a) <= meiaAbertura
        && (f.jato.arco || !this.atrasDeCanteiro(eu, i)))
      .sort((a, b) => a.d - b.d);
    const acertados: Array<{ i: Invasor; a: number }> = [];
    for (const c of lista) {
      // quem está na sombra de um bicho já molhado (mesma linha, mais longe)
      // não leva — a menos que o jato atravesse
      const sombra = acertados.some((x) => Math.abs(x.a - c.a) < 0.2);
      if (sombra && !atravessa) continue;
      acertados.push({ i: c.i, a: c.a });
    }
    if (alvo && !acertados.some((x) => x.i === alvo) && this.vulneravel(alvo)) acertados.unshift({ i: alvo, a: 0 });
    return acertados.map((x) => x.i);
  }

  /**
   * O Jato carregado: um jatão reto que atravessa a fila inteira. Com o
   * Borrifador são três jatões em leque, cada um com a parte dele; com a Poça,
   * a linha inteira fica molhada.
   */
  private jatao(t: Tiro, rumo: number, parte: number): void {
    const f = this.ficha;
    const longe = f.alcance * 1.6;
    const para = pontoAFrente(t.origem, rumo, longe);
    const tempo = this.jato.disparar({ de: t.de, para, estilo: f.jato, largura: 4, especial: 'carregado' });
    for (const inv of this.invasores) {
      if (!this.vulneravel(inv)) continue;
      const d = Math.hypot(inv.x - t.origem.x, inv.z - t.origem.z);
      const a = difAngulo(Math.atan2(inv.x - t.origem.x, inv.z - t.origem.z), rumo);
      // perto da linha do jato (em metros, e não em graus: é um tubo, não um cone)
      if (d <= longe && Math.abs(Math.sin(a) * d) < 0.45 + inv.jeito.raio && Math.cos(a) > 0) {
        this.jato.depois(tempo * (d / longe), () => this.acertar(inv, t.dano * 3 * parte, t.origem, 'carregado'));
      }
    }
    if (f.jato.poca) {
      for (let k = 1; k <= 4; k++) {
        const p = pontoAFrente(t.origem, rumo, (longe * k) / 4);
        this.jato.depois(tempo * (k / 4), () => this.jato.poca(p.x, p.z, 0.55));
      }
    }
  }

  /** A ÁGUA CHEGOU num bicho: dano, respingo e o que cada carta de impacto faz. */
  private acertar(inv: Invasor, dano: number, de: { x: number; z: number } | null, especial?: string): void {
    if (!this.vulneravel(inv) || !this.invasores.includes(inv)) return;
    const f = this.ficha;
    const e = f.jato;
    const altura = inv.ficha.alturaDaBarra * 0.5;
    const tinta = especial === 'arco-iris' ? 'arco-iris' : especial === 'carregado' ? 'carga' : 'agua';
    this.jato.respingo(inv.x, altura, inv.z, e, especial ? 1.8 : 1, tinta);
    if (especial === 'arco-iris') inv.gotasVezes = 2;
    // o Adubo do Noel: a água que cai perto de um canteiro leva adubo junto
    if (f.regras.has('adubo-do-noel')) {
      const c = this.canteiros.find((k) => k.vida > 0 && distanciaAoCanteiro(inv.x, inv.z, k) < 0.9);
      if (c && !c.adubado) {
        c.adubado = true;
        this.jato.adubo(c.x, c.z);
        this.contar('adubo-do-noel');
      }
    }
    this.molhar(inv, dano, de);
  }

  /** o dano em si, e o que vem junto (gelo, tranco, vapor) — serve a todo tipo de água */
  private molhar(inv: Invasor, dano: number, de: { x: number; z: number } | null): void {
    if (!this.vulneravel(inv)) return;
    const f = this.ficha;
    const e = f.jato;
    const grande = inv.ficha.tier === 'tanque' || inv.ficha.tier === 'chefe';
    let d = dano;
    if (grande) {
      d *= f.contraOGrandao;
      if (e.morna) this.jato.vaporDoBicho(inv.x, inv.ficha.alturaDaBarra, inv.z);
    }
    inv.vida -= d;
    inv.molhado = 1;
    if (e.gelo) {
      inv.lento = 2;
      inv.gelado = 2;
      this.jato.congelar(inv.corpo, inv.ficha.alturaDaBarra * 0.8);
    }
    /*
     * a Gota pesada: o tranco para trás, na direção do jato. BALANÇO (o Renan
     * venceu as 30 ondas com cartas somadas): o tranco pesa menos em bicho
     * grande, e cada bicho tem um RESPIRO de 0,4 s entre um tranco e outro —
     * sem isso, Braço solto + Segundo bico + parceiro + Borrifador empurravam
     * mais depressa do que qualquer bicho anda, e a chefe nunca chegava.
     */
    if (de && f.empurraoDoJato > 0 && inv.trancoEspera <= 0) {
      const peso = inv.ficha.tier === 'chefe' ? 0.2 : inv.ficha.tier === 'tanque' ? 0.4 : 1;
      inv.trancoEspera = 0.4;
      this.empurrar(inv, inv.x - de.x, inv.z - de.z, f.empurraoDoJato * peso);
      this.jato.tranco(inv.x, inv.z, Math.atan2(inv.x - de.x, inv.z - de.z), e.tranco ?? 1);
    }
    if (inv.vida <= 0) this.espantado(inv, 'agua');
  }

  /**
   * ESPANTADO: sacode, joga a água para os lados, solta as gotas e vai embora.
   * Com sabão, deixa uma bolha que estoura e molha quem está perto; com a
   * Compostagem, devolve um tiquinho de vida ao canteiro mais perto.
   */
  private espantado(inv: Invasor, como: 'agua' | 'geiser'): void {
    this.espantados += 1;
    this.contarEspantado(inv);
    inv.vida = 0;
    inv.estado = como === 'geiser' ? 'preso' : 'sacudindo';
    inv.relogio = 0;
    inv.canteiro = null;
    inv.empurraX = 0;
    inv.empurraZ = 0;
    if (como === 'agua') this.jato.sacudida(inv.x, inv.ficha.alturaDaBarra, inv.z);
    const onde = { x: inv.x, z: inv.z };
    const quantas = inv.ficha.gotas * inv.gotasVezes + this.aoEspantar(inv, onde);
    this.jato.depois(0.3, () => this.gotas.soltar(onde.x, onde.z, quantas, this.dado, (x, z) => this.foraDeCanteiro(x, z)));

    const f = this.ficha;
    if (f.jato.sabao && como === 'agua') {
      this.jato.bolhaGrande(onde.x, onde.z, 0.45, () => {
        for (const outro of [...this.invasores]) {
          if (outro !== inv && this.vulneravel(outro) && Math.hypot(outro.x - onde.x, outro.z - onde.z) < 1.6) {
            this.acertar(outro, f.dano * 0.6, onde);
          }
        }
      });
    }
    // BALANÇO: com 100 bichos por onda, a Compostagem sem teto curava tudo
    // várias vezes — agora cada canteiro recebe no máximo COMPOSTO_POR_ONDA
    if (f.compostagem > 0) {
      const c = this.canteiroMaisPerto(onde.x, onde.z);
      const cabe = c ? c.vidaMax * COMPOSTO_POR_ONDA - c.composto : 0;
      if (c && cabe > 0) {
        const cura = Math.min(cabe, c.vidaMax * f.compostagem);
        c.composto += cura;
        c.vida = Math.min(c.vidaMax, c.vida + cura);
        this.pintarCanteiro(c);
      }
    }
  }

  // ================================================================ o chão

  /** a Garoa: andando, fica um rastro que molha quem pisa */
  private garoa(dt: number): void {
    const e = this.ficha.jato;
    for (let i = this.garoas.length - 1; i >= 0; i--) {
      const gz = this.garoas[i];
      gz.vida -= dt;
      if (gz.vida <= 0) { this.garoas.splice(i, 1); continue; }
      for (const inv of this.invasores) {
        if (gz.pisados.has(inv) || !this.vulneravel(inv)) continue;
        if (Math.hypot(inv.x - gz.x, inv.z - gz.z) < inv.jeito.raio + 0.2) {
          gz.pisados.add(inv);
          this.jato.respingo(inv.x, 0.1, inv.z, e, 0.4);
          this.molhar(inv, this.ficha.dano * 0.5, null);
        }
      }
    }
    if (!e.garoa || !this.comRegador()) return;
    if (this.andouDesdeGaroa >= 0.45) {
      this.andouDesdeGaroa = 0;
      const ponta = this.pontaDoBico();
      this.jato.garoa(ponta.setY(Math.max(0.6, ponta.y)));
      this.garoas.push({ x: ponta.x, z: ponta.z, vida: 3, pisados: new Set() });
    }
  }

  // ================================================================ a mão

  /**
   * O GESTO DA PEÇA NA MÃO: o crivo GIRA, o balde VIRA de ponta-cabeça, o
   * carregado TREME. A peça é a mesma que o jogador segura (`objetoNaMao`), e
   * ela volta ao lugar no fim de cada gesto.
   */
  private animarGesto(dt: number): void {
    const obj = this.g.objetoNaMao();
    if (!obj || !this.gesto) return;
    const gs = this.gesto;
    gs.t += dt;
    const t = Math.min(1, gs.t / gs.dur);
    if (gs.tipo === 'giro') {
      obj.rotation.set(0, t * Math.PI * 2, 0);
    } else if (gs.tipo === 'coice') {
      // o COICE da pistola: o cano pula para cima no tiro e volta devagar
      const pulo = t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75;
      obj.rotation.set(-pulo * 0.5, 0, 0);
    } else if (gs.tipo === 'aperto') {
      /*
       * o APERTO do borrifador: o dedo puxa o gatilho, o frasco abaixa a
       * cabeça e amassa um tiquinho (é borrifador de plástico), e volta
       */
      const aperta = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
      obj.rotation.set(aperta * 0.2, 0, 0);
      obj.scale.set(1 + aperta * 0.05, 1 - aperta * 0.07, 1 + aperta * 0.05);
      const gatilho = this.gatilhoNaMao(obj);
      if (gatilho) gatilho.rotation.x = (gatilho.userData.repouso as number) + aperta * 0.6;
    } else if (gs.tipo === 'balde') {
      // vira rápido, segura de ponta-cabeça, e volta
      const vira = t < 0.3 ? t / 0.3 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
      obj.rotation.set(-vira * Math.PI * 0.85, 0, 0);
    } else {
      const forca = 0.02 + this.carga * 0.07;
      obj.rotation.set((Math.random() - 0.5) * forca, 0, (Math.random() - 0.5) * forca);
    }
    if (t >= 1) this.pararGesto();
  }

  private pararGesto(): void {
    const obj = this.g.objetoNaMao();
    if (this.gesto?.tipo === 'aperto' && obj) {
      obj.scale.set(1, 1, 1);
      const gatilho = this.gatilhoNaMao(obj);
      if (gatilho) gatilho.rotation.x = gatilho.userData.repouso as number;
    }
    this.gesto = null;
    obj?.rotation.set(0, 0, 0);
  }

  /** o gatilho da peça da mão (só o borrifador publica um, em `partes.gatilho`) */
  private gatilhoNaMao(obj: THREE.Object3D): THREE.Object3D | null {
    let achou: THREE.Object3D | null = null;
    obj.traverse((o) => {
      const partes = o.userData.partes as { gatilho?: THREE.Object3D } | undefined;
      if (!achou && partes?.gatilho) achou = partes.gatilho;
    });
    return achou;
  }

  // ================================================================ os bichos, de novo

  /**
   * RECUANDO: anda até um ponto (a porta, no Grito e no Walter; o lado
   * contrário, no Assobio) e, chegando ou dando o tempo, volta a querer comer.
   */
  private recuar(inv: Invasor, velocidade: number, dt: number): void {
    inv.recuoResta -= dt;
    const destino = inv.recuo;
    if (!destino || inv.recuoResta <= 0) {
      inv.estado = 'andando';
      inv.recuo = null;
      return;
    }
    const alvo = this.desviar(inv, destino);
    const dx = alvo.x - inv.x;
    const dz = alvo.z - inv.z;
    const d = Math.hypot(dx, dz);
    const passo = velocidade * 1.4 * dt;
    if (d <= Math.max(0.08, passo)) {
      inv.x = alvo.x;
      inv.z = alvo.z;
      if (alvo === destino) inv.recuoResta = 0;
      return;
    }
    inv.x += (dx / d) * passo;
    inv.z += (dz / d) * passo;
    this.virarPara(inv, Math.atan2(dx, dz), dt * 1.5);
  }

  /** manda o bicho de volta até a boca do portão dele — ele volta depois */
  private mandarParaAPorta(inv: Invasor): void {
    const boca = this.planta.bocas[inv.porta];
    inv.estado = 'recuando';
    inv.recuo = { x: boca.x + inv.lugarNaBorda * 0.8, z: boca.z };
    inv.recuoResta = 8;
    inv.canteiro = null;
  }

  /**
   * AFUGENTADO sem água: a pimenta, a dioneia e o latido do Walter. Ele vai
   * embora como o espantado, pela porta, e solta as gotas que a carta disser.
   */
  private afugentar(inv: Invasor, gotas: number): void {
    this.espantados += 1;
    this.contarEspantado(inv);
    inv.vida = 0;
    inv.estado = 'fugindo';
    inv.relogio = 0;
    inv.canteiro = null;
    inv.empurraX = 0;
    inv.empurraZ = 0;
    if (gotas > 0) {
      const onde = { x: inv.x, z: inv.z };
      this.jato.depois(0.2, () => this.gotas.soltar(onde.x, onde.z, gotas, this.dado, (x, z) => this.foraDeCanteiro(x, z)));
    }
  }

  /** um bicho acabou de começar a comer um canteiro */
  private aoMorder(inv: Invasor, c: Canteiro): void {
    const r = this.ficha.regras;
    // o Canteiro de pimenta: arde, e ele sai correndo
    if (c.pimenta) {
      this.jato.ardido(inv.x, inv.ficha.alturaDaBarra * 0.6, inv.z);
      this.g.som('ardido');
      this.afugentar(inv, 2);
      this.contar('canteiro-de-pimenta');
      return;
    }
    // chamar o Capy: a primeira mordida da onda chama ele até ali
    if (r.has('chama-capy') && !this.usadoNaOnda.has('chama-capy') && this.planta.elenco.presente('capy')) {
      this.usadoNaOnda.add('chama-capy');
      this.capy = { resta: 20, alvo: { x: c.x, z: c.z }, recarga: 0.6 };
      this.planta.elenco.soar('capy');
      this.g.toast(`O Capy correu para o canteiro de ${c.nome.toLowerCase()}`, '🕶️');
      this.contar('chama-capy');
    }
  }

  /** o portão que fica do lado de um (o do meio sorteia para que lado) */
  private portaDoLado(porta: number, dado: number): number {
    if (porta === 1) return dado < 0.5 ? 0 : 2;
    return 1;
  }

  /** o portão está trancado agora (cadeado ou Gina)? */
  private trancada(porta: number): boolean {
    return this.trancas.some((t) => t.porta === porta && t.resta > 0);
  }

  /** onde o bicho espera do lado de fora do portão trancado, cada um num lugar */
  private pontoDeEspera(inv: Invasor): { x: number; z: number } {
    const p = this.planta.portoes[inv.porta];
    return { x: p.x + inv.lugarNaBorda * 1.1, z: p.z - 0.9 - Math.abs(inv.lugarNaBorda) * 0.5 };
  }

  /**
   * A CERQUINHA NO CAMINHO: se a reta até o alvo cruza a cerca, o bicho vai
   * dar a volta pela ponta mais em conta — é o "contornar" do texto da carta,
   * sem precisar de mapa.
   *
   * BUG QUE TRAVAVA A RODADA (relato do Renan, com foto): o bicho ESPANTADO,
   * fugindo para o portão, ficava indo e voltando na ponta da cerca para
   * sempre — e espantado não leva mais água, então a onda nunca acabava. A
   * ponta ficava bem NA LINHA da cerca: chegando nela, a reta até um portão do
   * outro lado ainda raspava na cerca, ele escolhia a mesma ponta de novo e não
   * saía dali (1 em cada 5 fugas, medido numa simulação). Agora:
   *
   * - o contorno é em DOIS pontos, um passo para fora da cerca: a ponta do
   *   lado dele, e depois a mesma ponta do lado de lá. De lá, a reta até o
   *   alvo se afasta da cerca e nunca mais cruza;
   * - o ponto escolhido fica ESCOLHIDO (`inv.desvio`) até ele chegar, em vez
   *   de ser decidido de novo a cada quadro (no meio da cerca as duas pontas
   *   custam o mesmo, e ele trocava de ideia);
   * - chegando, ele esquece a cerca por 1,5 s (`inv.semCerca`): se ainda
   *   sobrar algum ângulo ruim, raspar a ponta é só visual — bicho do jardim
   *   nunca leu colisor.
   */
  private desviar(inv: Invasor, alvo: { x: number; z: number }): { x: number; z: number } {
    if (!this.cerquinhaPeca || inv.semCerca > 0) {
      inv.desvio = null;
      inv.desvioDepois = null;
      return alvo;
    }
    const c = this.planta.lugares.cerquinha;
    const meio = c.comprimento / 2 + inv.jeito.raio;
    const fundo = 0.15 + inv.jeito.raio;
    const cruza = segmentoCruzaRetangulo(inv.x, inv.z, alvo.x, alvo.z, c.x, c.z, meio, fundo);
    if (inv.desvio) {
      const chegou = Math.hypot(inv.desvio.x - inv.x, inv.desvio.z - inv.z) < 0.35;
      if (chegou && inv.desvioDepois) {
        inv.desvio = inv.desvioDepois;
        inv.desvioDepois = null;
        return inv.desvio;
      }
      if (chegou || !cruza) {
        inv.desvio = null;
        inv.desvioDepois = null;
        if (chegou) inv.semCerca = 1.5;
        return alvo;
      }
      return inv.desvio;
    }
    if (!cruza) return alvo;
    const ladoDoAlvo = Math.sign(alvo.z - c.z) || 1;
    const ladoDele = Math.sign(inv.z - c.z) || -ladoDoAlvo;
    const afasta = fundo + 0.3;
    const custo = (x: number): number =>
      Math.hypot(x - inv.x, c.z - inv.z) + Math.hypot(alvo.x - x, alvo.z - c.z);
    const esquerda = c.x - meio - 0.4;
    const direita = c.x + meio + 0.4;
    const x = custo(esquerda) <= custo(direita) ? esquerda : direita;
    inv.desvio = { x, z: c.z + ladoDele * afasta };
    inv.desvioDepois = ladoDele !== ladoDoAlvo ? { x, z: c.z + ladoDoAlvo * afasta } : null;
    return inv.desvio;
  }

  /** está dentro da estufa (passou do portão)? */
  private dentro(inv: Invasor): boolean {
    return inv.z > this.planta.portoes[0].z + 0.2;
  }

  // ================================================================ o começo e o fim de cada onda

  /** o que acontece no comecinho de toda onda */
  private comecoDaOnda(): void {
    for (const c of this.canteiros) c.composto = 0;
    const r = this.ficha.regras;
    // a Sementeira: canteiro comido até o fim brota de novo com meia vida
    if (r.has('sementeira') && this.onda > 1) {
      for (const c of this.canteiros) {
        if (c.vida > 0) continue;
        c.vida = c.vidaMax * 0.5;
        this.pintarCanteiro(c);
        this.jato.broto(c.x, c.z, c.meioX, c.meioZ);
        this.g.som('brotar');
        this.contar('sementeira');
      }
    }
    // a Estufa trancada: um cadeado em cada portão aberto
    if (r.has('estufa-trancada')) {
      for (let p = 0; p < this.planta.portoes.length; p++) {
        if (p === this.emperrado) continue;
        const pt = this.planta.portoes[p];
        // na face de DENTRO: é a que a câmera vê (a de fora fica atrás das grades)
        const peca = this.pecaNaEstufa(cadeadoDePortao(3), pt.x, pt.z + 0.22);
        this.trancas.push({ porta: p, resta: 10, quem: 'cadeado', peca });
      }
    }
    // chamar a Gina: ela tranca o portão que vem mais cheio nesta onda
    if (r.has('chama-gina') && this.planta.elenco.presente('gina')) this.ginaTranca(20);
  }

  /** a Gina vai até o portão mais cheio do roteiro e segura ali */
  private ginaTranca(segundos: number): void {
    const porta = portaMaisCheia(this.plano, this.emperrado);
    if (porta === null) return;
    this.trancas = this.trancas.filter((t) => t.quem !== 'gina');
    this.trancas.push({ porta, resta: segundos, quem: 'gina', peca: null });
    const pt = this.planta.portoes[porta];
    void this.planta.elenco.ir('gina', pt.x + 0.9, pt.z + 1.0, 2.4).then(() => {
      if (this.rodando) this.planta.elenco.encarar('gina', pt.x, pt.z - 3);
    });
    this.planta.elenco.soar('gina');
    this.g.toast(`A Gina foi segurar o portão ${NOME_DO_PORTAO[porta]}`, '🦒');
    this.contar('chama-gina');
  }

  /** o que acontece quando uma onda acaba, antes do respiro */
  private fimDeUmaOnda(): void {
    this.rebrotarCercas();
    const r = this.ficha.regras;
    /*
     * O PRÊMIO DA ONDA (pedido do Renan): vencer uma onda dá gotas — metade do
     * que falta para o próximo nível, arredondado para cima. Metade, e não
     * tudo: o prêmio empurra, mas a carta seguinte ainda é dos bichos.
     */
    const agora = nivelDasGotas(this.juntadas);
    const premio = Math.max(1, Math.ceil((agora.custo - agora.noNivel) / 2));
    this.g.toast(`Onda ${this.onda} vencida! +${premio} ${premio === 1 ? 'gota' : 'gotas'} de prêmio`, '🏆');
    this.g.som('memoria');
    this.receberGotas(premio);
    this.contar('premio-da-onda');
    // o Dedo verde: o que está machucado se recupera um pouco
    if (r.has('dedo-verde')) {
      let algum = false;
      for (const c of this.canteiros) {
        if (c.vida <= 0 || c.vida >= c.vidaMax) continue;
        c.vida = Math.min(c.vidaMax, c.vida + c.vidaMax * 0.15);
        this.pintarCanteiro(c);
        this.jato.broto(c.x, c.z, c.meioX, c.meioZ);
        algum = true;
      }
      if (algum) {
        this.g.som('brotar');
        this.contar('dedo-verde');
      }
    }
    // o Picolé do Mano: cai um picolé em algum lugar do terreiro
    if (r.has('picole-do-mano') && !this.picolePeca) {
      const c = this.planta.centro;
      const a = this.sorte() * Math.PI * 2;
      const onde = this.foraDeCanteiro(c.x + Math.cos(a) * 3, -1.5 + Math.sin(a) * 3);
      this.picolePeca = this.pecaNaEstufa(picole(), onde.x, onde.z);
      this.picolePeca.scale.setScalar(1.6);
      this.g.som('sorvete');
      this.g.toast('O Mano jogou um picolé pela porta!', '🍦');
    }
    // o Noel avisa: o próximo roteiro já sai sorteado, e ele grita o portão
    if (r.has('noel-avisa') && this.onda < this.ondasDaRodada) {
      this.proximoPlano = planoDaOnda(this.onda + 1, this.dado);
      this.remapearEmperrado(this.proximoPlano);
      const porta = portaMaisCheia(this.proximoPlano, null);
      if (porta !== null) {
        this.planta.elenco.soar('noel');
        this.g.toast(`O Noel, lá do muro: “VEM PELO PORTÃO ${NOME_DO_PORTAO[porta].toUpperCase()}!”`, '🗣️');
        const pt = this.planta.portoes[porta];
        this.jato.ondaDeSom(pt.x, pt.z + 0.6, 2, P.efeitoNota);
        this.contar('noel-avisa');
      }
    }
    // os trancados abrem: a onda seguinte tranca de novo, do zero
    for (const t of this.trancas) this.abrirTranca(t);
    this.trancas = [];
  }

  private abrirTranca(t: { porta: number; quem: 'cadeado' | 'gina'; peca: THREE.Object3D | null }): void {
    if (t.quem === 'gina') this.planta.elenco.voltarAoPosto('gina');
    if (t.peca) {
      this.g.som('clique');
      const peca = t.peca;
      // o cadeado cai e some no chão
      this.crescendo.push({ peca, t: 0, dur: 0.5, de: 1, para: 0, remover: true });
    }
  }

  // ================================================================ as peças das cartas

  /** põe uma peça na estufa, nascendo pequena e crescendo */
  private pecaNaEstufa(peca: THREE.Object3D, x: number, z: number, giro = 0): THREE.Object3D {
    peca.position.set(x, 0, z);
    peca.rotation.y = giro;
    this.w.root.add(peca);
    this.pecasDasCartas.push(peca);
    this.crescendo.push({ peca, t: 0, dur: 0.45, de: 0.01, para: 1, remover: false });
    return peca;
  }

  /** as peças que estão nascendo (ou sumindo): escala de `de` para `para` */
  private crescendo: Array<{ peca: THREE.Object3D; t: number; dur: number; de: number; para: number; remover: boolean }> = [];

  private tirarPeca(peca: THREE.Object3D): void {
    this.w.root.remove(peca);
    const i = this.pecasDasCartas.indexOf(peca);
    if (i >= 0) this.pecasDasCartas.splice(i, 1);
  }

  /**
   * AS PEÇAS QUE A MÃO PEDE — chamado a cada carta nova, e não faz nada duas
   * vezes: o Segundo tonel, o Aspersor, a Cerquinha, o Jean-Luc, o regador do
   * parceiro. Depois refaz a lista de colisores (a Bota tira os canteiros dela).
   */
  private montarCartas(): void {
    if (!this.rodando) return;
    const r = this.ficha.regras;
    const L = this.planta.lugares;
    if (r.has('segundo-tonel') && !this.segundoTonel) {
      this.segundoTonel = this.pecaNaEstufa(tonelDeAgua(1.25), L.segundoTonel.x, L.segundoTonel.z);
      this.g.som('gluglu');
    }
    if (r.has('aspersor') && !this.aspersorPeca) {
      this.aspersorPeca = this.pecaNaEstufa(aspersor(), L.aspersor.x, L.aspersor.z);
      this.aspersorRelogio = 0;
    }
    if (r.has('cerquinha') && !this.cerquinhaPeca) {
      this.cerquinhaPeca = this.pecaNaEstufa(cerquinha(L.cerquinha.comprimento), L.cerquinha.x, L.cerquinha.z);
      this.g.som('martelo');
      this.contar('cerquinha');
    }
    if (r.has('jean-luc-no-tonel') && !this.patoNoTonel) {
      this.patoNoTonel = true;
      this.planta.elenco.patoNoTonel(true);
      this.g.som('pato');
    }
    // o parceiro com o outro regador: na frente (Os dois) ou lá atrás
    if (r.has('os-dois-na-frente') || r.has('la-de-tras')) this.darRegador(this.g.companionId());
    if (r.has('os-dois-na-frente') && !this.parceiroSolto) {
      this.parceiroSolto = true;
      this.g.freeCompanion();
      this.g.toast(`${this.g.companionName()} pegou o outro regador!`, '💞');
      this.contar('os-dois-na-frente');
    }
    if (r.has('troca-de-turno')) this.g.bloquearTroca(false);
    this.recolidir();
  }

  private patoNoTonel = false;
  private parceiroSolto = false;

  /** um regador na mão de alguém — e a rodada lembra, para tirar no fim */
  private darRegador(quem: string): void {
    if (!this.g.hasItem('regador', quem)) {
      if (this.g.addItem(ITENS.regador, quem) === 'cheio') return;
      this.regadoresDados.push(quem);
    }
    const vaga = this.g.handItems(quem).findIndex((i) => i?.id === 'regador');
    if (vaga >= 0) this.g.setActiveHandSlot(vaga, quem);
  }

  /** a lista de colisores de agora: a da cena, menos a Bota, mais as peças */
  private recolidir(): void {
    if (!this.colisoresDaCena) return;
    const r = this.ficha.regras;
    let lista = [...this.colisoresDaCena];
    if (r.has('bota')) {
      lista = lista.filter((k) => !(k.kind === 'box'
        && this.canteiros.some((c) => Math.abs(c.x - k.x) < 0.01 && Math.abs(c.z - k.z) < 0.01)));
    }
    const L = this.planta.lugares;
    if (this.segundoTonel) lista.push({ kind: 'circle', x: L.segundoTonel.x, z: L.segundoTonel.z, r: 0.55 });
    if (this.aspersorPeca) lista.push({ kind: 'circle', x: L.aspersor.x, z: L.aspersor.z, r: 0.28 });
    if (this.cerquinhaPeca) {
      lista.push({ kind: 'box', x: L.cerquinha.x, z: L.cerquinha.z, hw: L.cerquinha.comprimento / 2, hd: 0.12, rot: 0 });
    }
    // o portão emperrado fecha para a dupla também: ninguém sai por ali
    if (this.emperrado !== null) {
      const pt = this.planta.portoes[this.emperrado];
      lista.push({ kind: 'box', x: pt.x, z: pt.z, hw: 1.6, hd: 0.3, rot: 0 });
    }
    this.w.usarColisores(lista);
  }

  /** o fim da rodada: tudo o que as cartas puseram sai, e a estufa volta a ser a da cena */
  private desmontarCartas(): void {
    for (const p of [...this.pecasDasCartas]) this.tirarPeca(p);
    this.crescendo = [];
    for (const c of this.canteiros) {
      c.protegido = false;
      c.cerca = 0;
      c.cercaPeca = null;
      c.toldo = false;
      c.pimenta = false;
      c.carnivora = null;
      c.adubado = false;
    }
    this.segundoTonel = null;
    this.aspersorPeca = null;
    this.cerquinhaPeca = null;
    this.espantalhoPeca = null;
    this.espantalhoResta = 0;
    this.picolePeca = null;
    this.trancas = [];
    this.emperrado = null;
    if (this.patoNoTonel) this.planta.elenco.patoNoTonel(false);
    this.patoNoTonel = false;
    this.parceiroSolto = false;
    for (const quem of this.regadoresDados) this.g.removeItem('regador', quem);
    this.regadoresDados = [];
    for (const q of ['capy', 'gina', 'walter', 'noel'] as const) {
      if (this.planta.elenco.presente(q)) this.planta.elenco.voltarAoPosto(q);
    }
    this.capy = null;
    this.noel = null;
    this.walter = null;
    this.plantao = null;
    this.mutirao = 0;
    this.trilha.count = 0;
    this.impulsoPoca = 0;
    this.impulsoPicole = 0;
    this.correndo = 0;
    if (this.colisoresDaCena) this.w.usarColisores(this.colisoresDaCena);
    this.colisoresDaCena = null;
  }

  /** a Cerca viva: uma roda de moitas em volta, e ninguém mais come ali */
  private cercarCanteiro(c: Canteiro): void {
    c.protegido = true;
    c.cerca = c.vidaMax;
    const grupo = new THREE.Group();
    const bx = c.meioX + 0.35;
    const bz = c.meioZ + 0.35;
    const perimetro = 4 * (bx + bz);
    const quantas = Math.round(perimetro / 0.75);
    for (let i = 0; i < quantas; i++) {
      // anda pelo perímetro do retângulo, em passos iguais
      let d = (i / quantas) * perimetro;
      let x: number;
      let z: number;
      if (d < 2 * bx) { x = -bx + d; z = -bz; } else if ((d -= 2 * bx) < 2 * bz) { x = bx; z = -bz + d; }
      else if ((d -= 2 * bz) < 2 * bx) { x = bx - d; z = bz; } else { d -= 2 * bx; x = -bx; z = bz - d; }
      const moita = bush(0.62 + ((i * 7) % 5) * 0.04, P.cercaViva);
      moita.position.set(x, 0, z);
      grupo.add(moita);
    }
    c.cercaPeca = this.pecaNaEstufa(grupo, c.x, c.z);
    this.g.som('brotar');
    this.jato.broto(c.x, c.z, c.meioX, c.meioZ);
    this.g.toast(`A cerca viva abraçou o canteiro de ${c.nome.toLowerCase()}`, '🌳');
    this.contar('cerca-viva');
  }

  /**
   * As moitas da cerca murcham junto com ela: encolhem com o que falta, e
   * somem quando ela cede — a dupla vê de longe que aquele canteiro ficou
   * exposto.
   */
  private pintarCerca(c: Canteiro): void {
    const peca = c.cercaPeca;
    if (!peca) return;
    const f = c.vidaMax > 0 ? c.cerca / c.vidaMax : 0;
    peca.visible = f > 0;
    const k = 0.55 + 0.45 * f;
    peca.scale.set(1, k, 1);
  }

  /** o fim de uma onda: a cerca que cedeu, ou que foi mordida, brota inteira de novo */
  private rebrotarCercas(): void {
    for (const c of this.canteiros) {
      if (!c.protegido || c.vida <= 0 || c.cerca >= c.vidaMax) continue;
      const cedeu = c.cerca <= 0;
      c.cerca = c.vidaMax;
      this.pintarCerca(c);
      if (cedeu) {
        this.jato.broto(c.x, c.z, c.meioX, c.meioZ);
        this.g.toast(`A cerca viva do canteiro de ${c.nome.toLowerCase()} brotou de novo`, '🌳');
      }
    }
  }

  /** o Toldo: a lona por cima, e o canteiro aguenta 50% mais */
  private cobrirCanteiro(c: Canteiro): void {
    c.toldo = true;
    this.recalcularVida();
    this.pecaNaEstufa(toldoDeCanteiro(3.2, 1.6), c.x, c.z, c.giro);
    this.g.som('martelo');
    this.contar('toldo');
  }

  /**
   * O Canteiro de pimenta: uma fileira de pimenteiras na BORDA que olha para o
   * terreiro, do lado de fora da madeira. Dentro da terra elas sumiam no meio
   * da lavanda — e o jogador precisa ver de longe qual canteiro arde.
   */
  private apimentarCanteiro(c: Canteiro): void {
    c.pimenta = true;
    const { x, z, giro } = this.bordaDoTerreiro(c, 0.42);
    const p = this.pecaNaEstufa(pimenteiras(3.0, 0.3), x, z, giro);
    p.userData.escala = 1.5;
    this.g.som('brotar');
    this.jato.broto(c.x, c.z, c.meioX, c.meioZ);
  }

  /**
   * UM PONTO NA BORDA do canteiro que olha para o meio do terreiro, a `folga`
   * dela, e o giro de quem fica ali deitado ao longo da madeira (a dioneia olha
   * para fora; a fileira de pimenta corre junto da borda).
   */
  private bordaDoTerreiro(c: Canteiro, folga: number): { x: number; z: number; giro: number; olhar: number } {
    const dx = this.planta.centro.x - c.x;
    const dz = -1.5 - c.z;
    const deLado = Math.abs(dx) / (c.meioX + 0.01) > Math.abs(dz) / (c.meioZ + 0.01);
    const x = deLado ? c.x + Math.sign(dx) * (c.meioX + folga) : c.x;
    const z = deLado ? c.z : c.z + Math.sign(dz) * (c.meioZ + folga);
    return { x, z, giro: deLado ? Math.PI / 2 : 0, olhar: Math.atan2(deLado ? Math.sign(dx) : 0, deLado ? 0 : Math.sign(dz)) };
  }

  /** a Planta carnívora: uma dioneia grande na borda do canteiro, virada para o terreiro */
  private plantarDioneia(c: Canteiro): void {
    const { x, z, olhar } = this.bordaDoTerreiro(c, 0.35);
    const peca = this.pecaNaEstufa(dioneia(), x, z, olhar);
    peca.userData.escala = 1.8;
    c.carnivora = { peca, espera: 0, fecha: 0 };
    this.g.som('nhac');
  }

  /**
   * O Portão emperrado: tábuas pregadas no portão que vem mais cheio, e quem
   * ia por ele vai pelo do lado — o resto da rodada inteira.
   */
  private emperrar(): void {
    if (this.emperrado !== null) return;
    const porta = portaMaisCheia(this.plano, null) ?? 1;
    this.emperrado = porta;
    const pt = this.planta.portoes[porta];
    this.pecaNaEstufa(tabuasPregadas(3, 1.6), pt.x, pt.z + 0.25);
    this.g.som('martelo');
    this.g.toast(`O portão ${NOME_DO_PORTAO[porta]} emperrou!`, '🚧');
    this.remapearEmperrado(this.plano);
    this.recolidir();
    // quem já vinha por ele, do lado de fora, muda de portão
    for (const inv of this.invasores) {
      if (inv.porta !== porta || inv.passo > 1 || inv.casa) continue;
      const nova = this.portaDoLado(porta, inv.x < pt.x ? 0 : 1);
      inv.porta = nova;
      const ainda = inv.passo === 0 ? [this.planta.brechas[porta]] : [];
      inv.caminho = [...ainda, this.planta.portoes[nova], this.planta.bocas[nova]]
        .map((p) => ({ x: p.x + (this.sorte() - 0.5) * 0.9, z: p.z }));
      inv.passo = 0;
    }
    this.contar('portao-emperrado');
  }

  private remapearEmperrado(plano: EntradaDePraga[]): void {
    if (this.emperrado === null) return;
    plano.forEach((e, i) => {
      if (e.porta === this.emperrado) e.porta = this.portaDoLado(e.porta, i % 2 ? 0.2 : 0.8);
    });
  }

  /** as peças nascendo e sumindo, o aspersor girando, a dioneia abrindo, o picolé boiando */
  private animarPecas(dt: number): void {
    for (let i = this.crescendo.length - 1; i >= 0; i--) {
      const c = this.crescendo[i];
      c.t += dt;
      const t = Math.min(1, c.t / c.dur);
      // nasce com um pulinho (passa do tamanho e volta), some de uma vez
      const k = c.para > c.de ? 1 + Math.sin(t * Math.PI) * 0.18 : 1;
      const escala = (c.peca.userData.escala as number | undefined) ?? 1;
      c.peca.scale.setScalar(Math.max(0.01, (c.de + (c.para - c.de) * t) * k * escala));
      if (t >= 1) {
        this.crescendo.splice(i, 1);
        if (c.remover) this.tirarPeca(c.peca);
      }
    }
    for (const c of this.canteiros) {
      const k = c.carnivora;
      if (!k) continue;
      k.espera = Math.max(0, k.espera - dt);
      k.fecha = Math.max(0, k.fecha - dt);
      // fecha de uma vez na mordida; recarregando fica fechada, e nos
      // últimos 0,6 s abre devagar — aberta, ela respira
      const abre = k.espera <= 0 ? 1 : Math.max(0, 1 - k.espera / 0.6);
      const bocas = k.peca.userData.bocas as THREE.Object3D[] | undefined;
      bocas?.forEach((b, i) => {
        const s = i === 0 ? 1 : -1;
        const quer = s * -0.55 * abre + Math.sin(this.relogioDaTrilha * 3 + i) * 0.05 * abre;
        b.rotation.x += (quer - b.rotation.x) * Math.min(1, dt * (k.fecha > 0 ? 30 : 6));
      });
    }
    if (this.picolePeca) {
      this.picolePeca.rotation.y += dt * 2;
      this.picolePeca.position.y = 0.15 + Math.sin(this.relogioDaTrilha * 3) * 0.08;
    }
  }

  // ================================================================ a ajuda do par

  /**
   * O ENQUADRAMENTO DA RODADA — pedido do Renan: no celular não dava para ver
   * os bichos dos lados. O zoom da estufa (11 de altura) num celular em pé
   * mostra uns 5 m de largura; a rodada pede 11 m de largura OU 13 de altura,
   * o que for maior — no computador é um passo para trás, no celular mais do
   * que o dobro de chão à vista. A vitrine fica de fora: ela é para olhar o
   * jato de perto.
   */
  private enquadrarRodada(): void {
    if (this.vitrine) return;
    this.g.enquadrar(11, 13);
  }

  get ajudaPronta(): boolean {
    return this.ajudaResta <= 0 && this.ajudaCarga >= this.ajudaCusto;
  }

  /**
   * A AJUDA DO PAR, a cada quadro: o botão (ou o F) pedido com o anel cheio
   * chama quem ficou atrás. Ele pega um regador extra, vem até você, e por 10 s
   * atira sozinho no bicho mais perto dele — e cada jato espanta de uma vez
   * (menos a Mãe-Lagartejo, que leva um terço: chefe que cai com um jato não é
   * chefe). Acabou o tempo, ele volta para o posto.
   */
  private ajudaDoPar(dt: number): void {
    const pediu = this.g.pedidoDeAjudaDoPar();
    if (pediu && this.ajudaPronta) this.chamarOPar();

    if (this.parVoltando) {
      const p = this.g.companionPosition();
      const posto = this.planta.postoDeTras;
      if (Math.hypot(p.x - posto.x, p.z - posto.z) < 0.6) {
        this.parVoltando = false;
        this.g.holdCompanion(this.planta.olharDosPortoes.x, this.planta.olharDosPortoes.z);
      }
    }

    if (this.ajudaResta <= 0) return;
    this.ajudaResta -= dt;
    this.ajudaRecarga -= dt;
    const p = this.g.companionPosition();
    if (this.ajudaRecarga <= 0) {
      // o par não liga para canteiro no meio: a água dele vai por cima
      const alvo = this.maisPerto(p.x, p.z, 5.5);
      if (alvo) {
        this.ajudaRecarga = 0.5;
        const rumo = Math.atan2(alvo.x - p.x, alvo.z - p.z);
        const de = new THREE.Vector3(p.x + Math.sin(rumo) * 0.4, 1.15, p.z + Math.cos(rumo) * 0.4);
        const para = new THREE.Vector3(alvo.x, 0.25, alvo.z);
        const tempo = this.jato.disparar({ de, para, estilo: { ...this.ficha.jato, arco: true }, largura: 30, especial: 'pressao-cheia' });
        const origem = { x: p.x, z: p.z };
        // o cone dele: todo bicho perto do alvo leva o mesmo jato
        const molhados = this.invasores.filter((i) => this.vulneravel(i) && Math.hypot(i.x - alvo.x, i.z - alvo.z) < 1.0 + i.jeito.raio);
        for (const inv of molhados) {
          const dano = inv.ficha.tier === 'chefe' ? inv.vidaMax / 3 : inv.vida + 1;
          this.jato.depois(tempo, () => this.acertar(inv, dano, origem, 'pressao-cheia'));
        }
        this.contar('ajuda-do-par');
      }
    }
    if (this.ajudaResta <= 0) this.dispensarOPar();
  }

  private chamarOPar(): void {
    this.ajudaVezes += 1;
    this.ajudaCarga = 0;
    this.ajudaCusto += AJUDA_CUSTO_SOBE;
    this.ajudaResta = AJUDA_DURA;
    this.ajudaRecarga = 0.4;
    this.parVoltando = false;
    const quem = this.g.companionId();
    this.ajudaDeuRegador = !this.g.hasItem('regador', quem);
    this.darRegador(quem);
    // ele vem para perto de você e segue enquanto a ajuda dura
    this.g.freeCompanion();
    const p = this.g.companionPosition();
    this.jato.anelDeAgua(new THREE.Vector3(p.x, 1, p.z), 1, 'giro', {});
    this.jato.ondaDeSom(p.x, p.z, 1.6, P.efeitoBroto);
    this.g.som('coracao');
    this.g.toast(`${this.g.companionName()} pegou o regador extra!`, '💦');
  }

  private dispensarOPar(): void {
    this.ajudaResta = 0;
    const quem = this.g.companionId();
    const r = this.ficha.regras;
    // o regador extra volta, a menos que uma carta dê um regador para ele
    if (this.ajudaDeuRegador && !r.has('os-dois-na-frente') && !r.has('la-de-tras')) {
      this.g.removeItem('regador', quem);
      this.regadoresDados = this.regadoresDados.filter((q) => q !== quem);
    }
    this.ajudaDeuRegador = false;
    // com Os dois na frente ele já rega do seu lado: fica
    if (r.has('os-dois-na-frente')) return;
    const posto = this.planta.postoDeTras;
    this.g.commandCompanion(posto.x, posto.z);
    this.parVoltando = true;
  }

  /** o teste enche a ajuda sem juntar gota */
  encherAjuda(): void {
    this.ajudaCarga = this.ajudaCusto;
  }

  // ================================================================ as cartas de jardineiro

  private cartasDoJardineiro(dt: number): void {
    const r = this.ficha.regras;
    const eu = this.g.playerPosition();

    // ---- o Pique: andar 2 s sem parar dá +30%, e levanta poeira
    const andando = this.passoDoQuadro > 0.004;
    this.correndo = andando ? this.correndo + dt : 0;
    const pique = r.has('pique') && this.correndo >= 2;
    if (pique) {
      if (this.correndo - dt < 2) this.contar('pique');
      this.poeiraEspera -= dt;
      if (this.poeiraEspera <= 0) {
        this.poeiraEspera = 0.08;
        this.jato.poeira(eu.x, eu.z, this.g.playerFacing());
      }
    }

    // ---- o Pé na poça: pisar numa poça dá um impulso
    if (r.has('pe-na-poca') && this.jato.pocasPerto(eu.x, eu.z) > 0) {
      if (this.impulsoPoca <= 0) {
        this.contar('pe-na-poca');
        this.jato.respingo(eu.x, 0.05, eu.z, this.ficha.jato, 0.6);
      }
      this.impulsoPoca = 1.5;
    }
    // ---- o Picolé: passar por cima dele
    if (this.picolePeca && Math.hypot(this.picolePeca.position.x - eu.x, this.picolePeca.position.z - eu.z) < 0.9) {
      this.tirarPeca(this.picolePeca);
      this.picolePeca = null;
      this.agua = this.ficha.tanque;
      this.tanqueCheio = true;
      this.impulsoPicole = 10;
      this.g.som('sorvete');
      this.g.som('gluglu');
      this.jato.anelDeAgua(new THREE.Vector3(eu.x, 1, eu.z), 0.8, 'giro', {});
      this.contar('picole-do-mano');
    }

    this.impulsoPoca = Math.max(0, this.impulsoPoca - dt);
    this.impulsoPicole = Math.max(0, this.impulsoPicole - dt);
    this.velocidadeAgora = this.ficha.velocidade * (pique ? 1.3 : 1)
      * (this.impulsoPoca > 0 ? 1.35 : 1) * (this.impulsoPicole > 0 ? 1.3 : 1);
    this.g.setVelocidadeDoJogador(this.velocidadeAgora);

    // ---- a Bota: andar por cima do canteiro
    if (r.has('bota') && this.canteiros.some((c) => distanciaAoCanteiro(eu.x, eu.z, c) === 0)) this.contar('bota');

    // ---- o Assobio: a cada 12 s o mais perto vira e anda 2 s para trás
    if (r.has('assobio')) {
      this.assobio += dt;
      if (this.assobio >= 12) {
        const alvo = this.maisPerto(eu.x, eu.z, 9, (i) => this.dentro(i) && i.estado !== 'recuando');
        if (alvo) {
          this.assobio = 0;
          this.g.som('assobio');
          this.jato.notinhas(eu.x, 1.9, eu.z);
          this.jato.notinhas(alvo.x, alvo.ficha.alturaDaBarra + 0.2, alvo.z);
          const volta = alvo.rumo + Math.PI;
          alvo.estado = 'recuando';
          alvo.recuo = { x: alvo.x + Math.sin(volta) * 6, z: alvo.z + Math.cos(volta) * 6 };
          alvo.recuoResta = 2;
          alvo.canteiro = null;
          this.contar('assobio');
        }
      }
    }

    // ---- o Pulinho: encostar num bicho fraco é pular por cima, e ele fica tonto
    this.pulinhoEspera = Math.max(0, this.pulinhoEspera - dt);
    if (r.has('pulinho') && this.pulinhoEspera <= 0) {
      const inv = this.invasores.find((i) => i.ficha.tier === 'fraco' && this.vulneravel(i)
        && Math.hypot(i.x - eu.x, i.z - eu.z) < i.jeito.raio + 0.45);
      if (inv) {
        this.g.pularJogador(0.75, 0.5);
        inv.tonto = Math.max(inv.tonto, 1);
        this.pulinhoEspera = 0.9;
        this.g.som('quicar');
        this.jato.ondaDeSom(inv.x, inv.z, 0.6, P.efeitoNota);
        this.contar('pulinho');
      }
    }

    // ---- o Grito: uma vez por onda, com três perto, todo mundo volta para a porta
    if (r.has('grito') && !this.usadoNaOnda.has('grito')) {
      const perto = this.invasores.filter((i) => this.vulneravel(i) && Math.hypot(i.x - eu.x, i.z - eu.z) < 4);
      if (perto.length >= 3) {
        this.usadoNaOnda.add('grito');
        this.g.som('grito');
        this.jato.ondaDeSom(eu.x, eu.z, 4);
        for (const inv of perto) this.mandarParaAPorta(inv);
        this.contar('grito');
      }
    }

    // ---- a Troca de turno: o T mudou quem rega
    const agora = this.g.playerId();
    if (agora !== this.quemRega) {
      this.quemRega = agora;
      if (r.has('troca-de-turno')) this.trocouDeTurno();
    }

    this.parceiroRega(dt);
  }

  /**
   * A TROCA DE TURNO: o T troca os corpos (quem estava atrás agora está na
   * frente, e vice-versa). Quem entra ganha o regador, e vem de tanque cheio.
   */
  private trocouDeTurno(): void {
    this.darRegador(this.g.playerId());
    this.agua = this.ficha.tanque;
    this.tanqueCheio = true;
    const eu = this.g.playerPosition();
    const outro = this.g.companionPosition();
    this.jato.ondaDeSom(eu.x, eu.z, 1.2, P.efeitoBroto);
    this.jato.ondaDeSom(outro.x, outro.z, 1.2, P.efeitoBroto);
    this.jato.anelDeAgua(new THREE.Vector3(eu.x, 1, eu.z), 0.8, 'giro', {});
    this.contar('troca-de-turno');
  }

  /** o outro regador: Os dois na frente atira nos bichos, Lá de trás rega um canteiro */
  private parceiroRega(dt: number): void {
    const r = this.ficha.regras;
    const f = this.ficha;
    const p = this.g.companionPosition();
    if (r.has('os-dois-na-frente')) {
      this.recargaDoParceiro += dt;
      if (this.recargaDoParceiro >= f.cadencia * 1.1) {
        const alvo = this.maisPerto(p.x, p.z, f.alcance, (i) => f.jato.arco || !this.atrasDeCanteiro(p, i));
        if (alvo) {
          this.recargaDoParceiro = 0;
          const rumo = Math.atan2(alvo.x - p.x, alvo.z - p.z);
          const de = new THREE.Vector3(p.x + Math.sin(rumo) * 0.4, 1.15, p.z + Math.cos(rumo) * 0.4);
          const origem = { x: p.x, z: p.z };
          // o outro regador tem TODAS as cartas de jato da mão, como o seu:
          // o mesmo `umJato`, só com parte do dano (os especiais são só seus)
          this.umJato({ origem, de, rumo, alvo, dano: f.dano * PARCEIRO });
          if (f.jato.segundoBico) {
            const deTras = new THREE.Vector3(p.x - Math.sin(rumo) * 0.25, 1.1, p.z - Math.cos(rumo) * 0.25);
            this.umJato({ origem, de: deTras, rumo: rumo + Math.PI, alvo: null, dano: f.dano * PARCEIRO * SEGUNDO_BICO });
          }
          this.contar('os-dois-na-frente');
        }
      }
    } else if (r.has('la-de-tras')) {
      this.ladoDeTras += dt;
      if (this.ladoDeTras >= 5) {
        // o canteiro mais perto dele que precisa de água (machucado, ou com bicho em cima)
        const c = this.canteiros
          .filter((k) => k.vida > 0 && (k.vida < k.vidaMax - 0.01 || this.invasores.some((i) => i.canteiro === k && i.estado === 'comendo')))
          .sort((a, b) => Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z))[0];
        if (c) {
          this.ladoDeTras = 0;
          this.regarDeLonge({ x: p.x, z: p.z }, 1.15, c, 0.1, 0.6);
          this.contar('la-de-tras');
        }
      }
    }
  }

  /**
   * UM JATO EM ARCO DE LONGE NUM CANTEIRO — o parceiro lá de trás e a
   * Josefina. A água cai no meio da terra: o canteiro se recupera, e quem
   * está comendo ali leva o respingo.
   */
  private regarDeLonge(de: { x: number; z: number }, altura: number, c: Canteiro, cura: number, dano: number): void {
    const para = new THREE.Vector3(c.x, c.alturaDaTerra + 0.1, c.z);
    const rumo = Math.atan2(c.x - de.x, c.z - de.z);
    const bico = new THREE.Vector3(de.x + Math.sin(rumo) * 0.4, altura, de.z + Math.cos(rumo) * 0.4);
    this.jato.disparar({
      de: bico, para, estilo: { arco: true }, largura: 12,
      aoChegar: () => {
        if (!this.rodando || c.vida <= 0) return;
        c.vida = Math.min(c.vidaMax, c.vida + c.vidaMax * cura);
        this.pintarCanteiro(c);
        this.jato.respingo(c.x, c.alturaDaTerra, c.z, {}, 1.2, 'agua', false);
        this.jato.broto(c.x, c.z, c.meioX * 0.7, c.meioZ * 0.7);
        for (const inv of [...this.invasores]) {
          if (inv.canteiro === c && inv.estado === 'comendo') this.molhar(inv, this.ficha.dano * dano, null);
        }
      },
    });
  }

  /** o bicho vulnerável mais perto de um ponto, dentro de um raio */
  private maisPerto(x: number, z: number, raio: number, filtro: (i: Invasor) => boolean = () => true): Invasor | null {
    let melhor: Invasor | null = null;
    let d = raio;
    for (const i of this.invasores) {
      if (!this.vulneravel(i) || !filtro(i)) continue;
      const dd = Math.hypot(i.x - x, i.z - z);
      if (dd <= d) { d = dd; melhor = i; }
    }
    return melhor;
  }

  /**
   * O OLHO DE JARDINEIRA: de cada bicho que anda na estufa sai um pontilhado
   * até o canteiro que ele quer, e os pontos andam na direção dele — é a
   * seta de "ele vai para lá" que qualquer um lê.
   */
  private desenharTrilha(dt: number): void {
    this.relogioDaTrilha += dt;
    if (!this.ficha.regras.has('olho-de-jardineira')) {
      this.trilha.count = 0;
      return;
    }
    const m = new THREE.Matrix4();
    const PASSO = 0.45;
    const desloca = (this.relogioDaTrilha * 0.9) % PASSO;
    let n = 0;
    for (const inv of this.invasores) {
      if (inv.estado !== 'andando' || !this.dentro(inv) || inv.puxado || inv.passo < inv.caminho.length) continue;
      const c = inv.canteiro && inv.canteiro.vida > 0 ? inv.canteiro : this.canteiroMaisPerto(inv.x, inv.z);
      if (!c) continue;
      const alvo = this.pontoDeComer(inv, c);
      const dx = alvo.x - inv.x;
      const dz = alvo.z - inv.z;
      const d = Math.hypot(dx, dz);
      for (let t = 0.35 + desloca; t < d && n < PONTOS_DA_TRILHA; t += PASSO) {
        // os pontos crescem perto do canteiro: a ponta da seta é o destino
        const s = 0.7 + (t / d) * 0.6;
        m.makeScale(s, 1, s).setPosition(inv.x + (dx / d) * t, 0.035, inv.z + (dz / d) * t);
        this.trilha.setMatrixAt(n++, m);
      }
    }
    this.trilha.count = n;
    this.trilha.instanceMatrix.needsUpdate = true;
    if (n > 0) this.contar('olho-de-jardineira');
  }

  // ================================================================ as cartas de jardim e do clube

  private cartasDoJardim(dt: number): void {
    const r = this.ficha.regras;
    const f = this.ficha;
    const E = this.planta.elenco;
    this.sinoEspera = Math.max(0, this.sinoEspera - dt);

    // ---- as trancas: o relógio de cada uma anda enquanto tem bicho esperando
    for (const t of [...this.trancas]) {
      const esperando = this.invasores.some((i) => i.porta === t.porta && i.passo === 1 && i.estado === 'andando'
        && Math.hypot(i.x - this.pontoDeEspera(i).x, i.z - this.pontoDeEspera(i).z) < 0.3);
      if (!esperando) continue;
      if (t.resta === (t.quem === 'cadeado' ? 10 : t.resta) && !this.segurou.has(t)) {
        this.segurou.add(t);
        this.contar(t.quem === 'cadeado' ? 'estufa-trancada' : 'chama-gina');
      }
      t.resta -= dt;
      if (t.resta <= 0) {
        this.abrirTranca(t);
        this.trancas.splice(this.trancas.indexOf(t), 1);
      }
    }

    // ---- o Aspersor: gira devagar, e a cada 3 s solta um anel de 2,5 m
    if (this.aspersorPeca) {
      const L = this.planta.lugares.aspersor;
      const cabeca = this.aspersorPeca.getObjectByName('cabeca-do-aspersor');
      this.aspersorRelogio += dt;
      if (cabeca) cabeca.rotation.y += dt * (this.aspersorRelogio > 2.55 ? 16 : 1.2);
      if (this.aspersorRelogio >= 3) {
        this.aspersorRelogio = 0;
        this.jato.anelDeAgua(new THREE.Vector3(L.x, 0.72, L.z), 2.5, 'giro', {});
        this.jato.depois(0.35, () => {
          let molhou = false;
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - L.x, inv.z - L.z) <= 2.5 + inv.jeito.raio) {
              this.molhar(inv, f.dano, L);
              molhou = true;
            }
          }
          if (molhou) this.contar('aspersor');
        });
      }
    }

    // ---- o Espantalho: com três na estufa, ele levanta e puxa a atenção 20 s
    if (r.has('espantalho')) {
      if (this.espantalhoResta > 0) {
        this.espantalhoResta -= dt;
        if (this.espantalhoPeca) this.espantalhoPeca.rotation.z = Math.sin(this.relogioDaTrilha * 2.2) * 0.05;
        if (this.espantalhoResta <= 0) {
          if (this.espantalhoPeca) this.crescendo.push({ peca: this.espantalhoPeca, t: 0, dur: 0.4, de: 1, para: 0, remover: true });
          this.espantalhoPeca = null;
          for (const inv of this.invasores) inv.puxado = false;
        }
      } else if (!this.usadoNaOnda.has('espantalho') && this.invasores.filter((i) => this.dentro(i) && this.vulneravel(i)).length >= 3) {
        this.usadoNaOnda.add('espantalho');
        this.espantalhoResta = 20;
        const L = this.planta.lugares.espantalho;
        this.espantalhoPeca = this.pecaNaEstufa(espantalho(), L.x, L.z);
        this.g.som('martelo');
        this.jato.ondaDeSom(L.x, L.z, 2.5, P.palha);
        for (const inv of this.invasores) {
          if (inv.estado === 'comendo' && Math.hypot(inv.x - L.x, inv.z - L.z) < 7) {
            inv.estado = 'andando';
            inv.canteiro = null;
          }
        }
      }
    }

    // ---- a Josefina ajuda: um canteiro abaixo de 60%, ela rega de lá
    if (r.has('josefina-ajuda') && !this.usadoNaOnda.has('josefina-ajuda') && E.presente('josefina')) {
      const c = this.canteiros.filter((k) => k.vida > 0 && k.vida / k.vidaMax < 0.6)
        .sort((a, b) => a.vida / a.vidaMax - b.vida / b.vidaMax)[0];
      if (c) {
        this.usadoNaOnda.add('josefina-ajuda');
        const j = E.onde('josefina');
        E.encarar('josefina', c.x, c.z);
        this.regarDeLonge(j, 1.0, c, 0.35, 1.5);
        this.g.som('brotar');
        this.g.toast(`A Josefina regou o canteiro de ${c.nome.toLowerCase()}`, '🐢');
        const o = this.planta.olharDosPortoes;
        this.jato.depois(2.5, () => { if (this.rodando) E.encarar('josefina', o.x, o.z); });
        this.contar('josefina-ajuda');
      }
    }

    /*
     * ---- o Walter de plantão: a cada 12 s, o mais perto de um canteiro recua.
     * Ele ESTÁ na estufa (a carta o chama pela porta, como os chamados): corre
     * até o bicho e late quando chega — ou, se não chegar em 4 s, late de onde
     * estiver. Relato do Renan: a carta espantava, mas o Walter não aparecia.
     */
    if (r.has('walter-de-plantao') && !this.walter) {
      const k = this.plantao;
      if (k) {
        k.resta -= dt;
        const onde = E.onde('walter');
        const la = !this.invasores.includes(k.alvo) || !this.vulneravel(k.alvo) || k.alvo.estado === 'recuando';
        if (la) {
          // o bicho já foi embora por outro motivo: volta sem latir
          this.plantao = null;
          E.voltarAoPosto('walter');
        } else {
          E.seguir('walter', k.alvo.x, k.alvo.z, 3.2);
          if (Math.hypot(k.alvo.x - onde.x, k.alvo.z - onde.z) < 1.0 || k.resta <= 0) {
            E.soar('walter');
            this.jato.ondaDeSom(k.alvo.x, k.alvo.z, 1.2);
            this.mandarParaAPorta(k.alvo);
            this.contar('walter-de-plantao');
            this.plantao = null;
            this.walterDePlantao = 0;
            this.jato.depois(1.0, () => {
              if (this.rodando && !this.plantao && !this.walter) E.voltarAoPosto('walter');
            });
          }
        }
      } else {
        this.walterDePlantao += dt;
        if (this.walterDePlantao >= 12) {
          let alvo: Invasor | null = null;
          let perto = Infinity;
          for (const i of this.invasores) {
            if (!this.vulneravel(i) || !this.dentro(i) || i.estado === 'recuando') continue;
            for (const c of this.canteiros) {
              if (c.vida <= 0) continue;
              const d = distanciaAoCanteiro(i.x, i.z, c);
              if (d < perto) { perto = d; alvo = i; }
            }
          }
          if (alvo) {
            if (E.presente('walter')) {
              this.plantao = { alvo, resta: 4 };
              E.soar('walter');
            } else {
              // sem o Walter em cena (não deveria acontecer): o latido de longe
              this.walterDePlantao = 0;
              this.g.som('latido');
              this.jato.ondaDeSom(alvo.x, alvo.z, 1.2);
              this.mandarParaAPorta(alvo);
              this.contar('walter-de-plantao');
            }
          }
        }
      }
    }

    // ---- o Apito da Gina: com quatro na estufa, todo mundo congela 1,5 s
    if (r.has('apito-da-gina') && !this.usadoNaOnda.has('apito-da-gina')) {
      const la = this.invasores.filter((i) => this.dentro(i) && this.vulneravel(i));
      if (la.length >= 4) {
        this.usadoNaOnda.add('apito-da-gina');
        this.g.som('apito');
        const porta = this.planta.porta;
        this.jato.ondaDeSom(porta.x, porta.z - 1, 3);
        for (const inv of la) {
          inv.tonto = Math.max(inv.tonto, 1.5);
          this.jato.ondaDeSom(inv.x, inv.z, 0.7);
        }
        this.g.toast('A Gina apitou da porta!', '📯');
        this.contar('apito-da-gina');
      }
    }

    // ---- o Capy salva-vidas: dois no corredor do meio, e lá vem o jato
    if (r.has('capy-salva-vidas') && !this.usadoNaOnda.has('capy-salva-vidas')) {
      const porta = this.planta.porta;
      const noCorredor = this.invasores.filter((i) => this.dentro(i) && this.vulneravel(i) && Math.abs(i.x - porta.x) < 1.6);
      if (noCorredor.length >= 2) {
        this.usadoNaOnda.add('capy-salva-vidas');
        this.g.som('apito');
        const de = new THREE.Vector3(porta.x, 1.1, porta.z - 0.6);
        const fundo = this.planta.portoes[0].z + 1;
        const para = new THREE.Vector3(porta.x, 0.1, fundo);
        const tempo = this.jato.disparar({ de, para, estilo: { mangueira: true }, largura: 6, forma: 'linha' });
        for (const inv of this.invasores) {
          if (!this.vulneravel(inv) || Math.abs(inv.x - porta.x) > 1.3 + inv.jeito.raio) continue;
          const t = tempo * THREE.MathUtils.clamp((de.z - inv.z) / (de.z - fundo), 0, 1);
          this.jato.depois(t, () => this.acertar(inv, f.dano * 2, { x: inv.x, z: inv.z + 1 }));
        }
        this.g.toast('O Capy mandou um jato pelo corredor!', '🛟');
        this.contar('capy-salva-vidas');
      }
    }

    // ---- a Planta carnívora: morde quem come o canteiro dela
    for (const c of this.canteiros) {
      const k = c.carnivora;
      if (!k || k.espera > 0) continue;
      const presa = this.invasores.find((i) => this.vulneravel(i)
        && ((i.canteiro === c && i.estado === 'comendo') || Math.hypot(i.x - k.peca.position.x, i.z - k.peca.position.z) < i.jeito.raio + 0.5));
      if (!presa) continue;
      k.espera = 15;
      k.fecha = 0.25;
      this.g.som('nhac');
      this.jato.ondaDeSom(presa.x, presa.z, 0.8, P.dioneiaBoca);
      this.espantado(presa, 'agua');
      this.contar('planta-carnivora');
    }

    // ---- os Girassóis vigiam o portão do próximo bicho
    if (r.has('girassol-vigia')) this.girassoisVigiam(dt);
  }

  /** o Espantalho e as trancas contam uma vez por tranca */
  private segurou = new Set<object>();

  private ultimoVigiado = -1;
  private girassoisVigiam(dt: number): void {
    const prox = this.plano[0];
    const alvo = prox ? this.planta.portoes[prox.porta] : this.planta.portoes[1];
    if (prox && prox.porta !== this.ultimoVigiado) {
      this.ultimoVigiado = prox.porta;
      this.contar('girassol-vigia');
    }
    for (const c of this.canteiros) {
      if (c.tipo !== 'girassol' || c.vida <= 0) continue;
      const mudas = (c.peca.userData.mudas ?? []) as THREE.Object3D[];
      const p = new THREE.Vector3();
      mudas.forEach((m, i) => {
        m.getWorldPosition(p);
        // a flor olha para +Z da muda; a muda mora dentro do canteiro girado
        const querido = Math.atan2(alvo.x - p.x, alvo.z - p.z) - c.giro;
        let d = querido - m.rotation.y;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        m.rotation.y += d * Math.min(1, dt * 2.5);
        void i;
      });
    }
  }

  // ================================================================ os chamados agindo

  /**
   * OS CHAMADOS AGEM SOZINHOS (decisão do Renan), cada um no que ele é bom:
   * o Capy ATACA onde mordem, a Gina BARRA um portão, o Walter PROTEGE o
   * canteiro machucado, o Noel CATA as gotas. O gatilho de cada um é a
   * situação dele, e cada um vale uma vez por onda — o Mutirão, quando a
   * chefe chega, liga os quatro de uma vez por 30 s.
   */
  private chamadosAgindo(dt: number): void {
    const r = this.ficha.regras;
    const E = this.planta.elenco;
    const eu = this.g.playerPosition();

    if (this.mutirao > 0) {
      this.mutirao -= dt;
      // o Walter do mutirão late a cada 6 s no canteiro mais atacado
      if (!this.walter && E.presente('walter') && this.mutirao % 6 < dt) this.walterCorre(this.canteiroMaisAtacado());
      if (this.mutirao <= 0) this.mutirao = 0;
    }

    // ---- o Capy: corre até o canteiro mordido e rega junto
    if (this.capy) {
      const k = this.capy;
      k.resta -= dt;
      const onde = E.onde('capy');
      const chefe = this.mutirao > 0 ? this.invasores.find((i) => i.ficha.tier === 'chefe' && this.vulneravel(i)) : null;
      const foco = chefe ? { x: chefe.x, z: chefe.z } : k.alvo;
      // fica do lado do terreiro, a um passo do foco
      const cx = this.planta.centro.x;
      const cz = -1.5;
      const n = Math.hypot(cx - foco.x, cz - foco.z) || 1;
      const lugar = { x: foco.x + ((cx - foco.x) / n) * 2.4, z: foco.z + ((cz - foco.z) / n) * 2.4 };
      if (Math.hypot(lugar.x - onde.x, lugar.z - onde.z) > 0.4) E.seguir('capy', lugar.x, lugar.z, 2.4);
      k.recarga -= dt;
      if (k.recarga <= 0) {
        const alvo = this.maisPerto(onde.x, onde.z, 5);
        if (alvo) {
          k.recarga = 0.9;
          E.encarar('capy', alvo.x, alvo.z);
          const rumo = Math.atan2(alvo.x - onde.x, alvo.z - onde.z);
          const de = new THREE.Vector3(onde.x + Math.sin(rumo) * 0.5, 0.75, onde.z + Math.cos(rumo) * 0.5);
          const tempo = this.jato.disparar({ de, para: new THREE.Vector3(alvo.x, 0.25, alvo.z), estilo: {}, largura: 25 });
          const origem = { x: onde.x, z: onde.z };
          this.jato.depois(tempo, () => this.acertar(alvo, this.ficha.dano, origem));
          this.contar(this.mutirao > 0 ? 'mutirao-do-clube' : 'chama-capy');
        }
      }
      if (k.resta <= 0) {
        this.capy = null;
        E.voltarAoPosto('capy');
      }
    }

    // ---- o Walter: canteiro pela metade com bicho em cima, ele corre latindo
    if (r.has('chama-walter') && !this.walter && !this.usadoNaOnda.has('chama-walter') && E.presente('walter')) {
      const c = this.canteiros.find((k) => k.vida > 0 && k.vida / k.vidaMax < 0.5
        && this.invasores.some((i) => i.canteiro === k && i.estado === 'comendo'));
      if (c) {
        this.usadoNaOnda.add('chama-walter');
        this.walterCorre(c);
      }
    }
    if (this.walter) {
      const k = this.walter;
      k.resta -= dt;
      if (k.chegou || k.resta <= 0) {
        const c = k.alvo;
        E.soar('walter');
        this.jato.ondaDeSom(c.x, c.z, Math.max(c.meioX, c.meioZ) + 1.5);
        for (const inv of [...this.invasores]) {
          if (this.vulneravel(inv) && distanciaAoCanteiro(inv.x, inv.z, c) < 1.6) this.afugentar(inv, 0);
        }
        this.contar(this.mutirao > 0 ? 'mutirao-do-clube' : 'chama-walter');
        this.walter = null;
        this.jato.depois(1.2, () => { if (this.rodando && !this.walter) E.voltarAoPosto('walter'); });
      }
    }

    // ---- o Noel: com 8 gotas no chão, ele passa 20 s catando
    if (r.has('chama-noel') && !this.noel && !this.usadoNaOnda.has('chama-noel') && E.presente('noel')
      && this.gotas.quantasNoChao >= 8) {
      this.usadoNaOnda.add('chama-noel');
      this.noel = { resta: 20, leva: 0, entregando: false };
      E.soar('noel');
      this.g.toast('O Noel veio catar as gotas!', '🦃');
    }
    if (this.noel) {
      const k = this.noel;
      k.resta -= dt;
      const onde = E.onde('noel');
      const gota = k.entregando ? null : this.gotas.maisPerto(onde.x, onde.z);
      if (k.leva >= 4 || (k.leva > 0 && (!gota || k.resta <= 0))) k.entregando = true;
      if (k.entregando) {
        E.seguir('noel', eu.x, eu.z, 2.8);
        if (Math.hypot(eu.x - onde.x, eu.z - onde.z) < 1.3) {
          this.receberGotas(k.leva);
          E.soar('noel');
          this.jato.ondaDeSom(eu.x, eu.z, 0.9, P.efeitoNota);
          this.contar(this.mutirao > 0 ? 'mutirao-do-clube' : 'chama-noel');
          k.leva = 0;
          k.entregando = false;
        }
      } else if (gota) {
        E.seguir('noel', gota.x, gota.z, 2.8);
        if (Math.hypot(gota.x - onde.x, gota.z - onde.z) < 0.55) k.leva += this.gotas.catar(onde.x, onde.z, 0.8);
      }
      if (k.resta <= 0 && k.leva === 0) {
        this.noel = null;
        E.voltarAoPosto('noel');
      }
    }
  }

  /** o Walter corre até um canteiro; o latido é quando ele chega */
  private walterCorre(c: Canteiro | null): void {
    if (!c) return;
    const E = this.planta.elenco;
    this.walter = { alvo: c, chegou: false, resta: 10 };
    E.soar('walter');
    this.g.toast('O Walter saiu correndo e latindo!', '🐶');
    const cx = this.planta.centro.x;
    const n = Math.hypot(cx - c.x, -1.5 - c.z) || 1;
    const lugar = { x: c.x + ((cx - c.x) / n) * (Math.max(c.meioX, c.meioZ) + 0.6), z: c.z + ((-1.5 - c.z) / n) * (Math.max(c.meioX, c.meioZ) + 0.6) };
    void E.ir('walter', lugar.x, lugar.z, 3.2).then(() => {
      if (this.walter && this.walter.alvo === c) this.walter.chegou = true;
    });
  }

  private canteiroMaisAtacado(): Canteiro | null {
    let melhor: Canteiro | null = null;
    let mais = 0;
    for (const c of this.canteiros) {
      const n = this.invasores.filter((i) => i.canteiro === c && i.estado === 'comendo').length;
      if (n > mais) { mais = n; melhor = c; }
    }
    return melhor;
  }

  /** o Mutirão do clube: a chefe chegou, e os quatro entram em ação por 30 s */
  private comecarMutirao(): void {
    const E = this.planta.elenco;
    const quem = (['capy', 'gina', 'walter', 'noel'] as const).filter((q) => E.presente(q));
    if (quem.length === 0) return;
    this.mutirao = 30;
    if (E.presente('capy')) this.capy = { resta: 30, alvo: { x: 0, z: -1.5 }, recarga: 0.5 };
    if (E.presente('noel')) this.noel = { resta: 30, leva: 0, entregando: false };
    if (E.presente('gina')) this.ginaTranca(30);
    this.g.toast('O clube inteiro entrou em ação!', '🎉');
    this.g.som('apito');
    this.contar('mutirao-do-clube');
  }

  // ================================================================ vitrine

  /**
   * A VITRINE DO JATO: uma rodada sem ondas, com bichos parados na frente do
   * jogador que nascem de novo quando são espantados. Serve para OLHAR o jato
   * de uma carta (`?cena=estufa&jato=gota-gelada,poca`) e para o teste
   * fotografar cada uma — numa onda de verdade a carta que se quer ver pode
   * não sair nunca.
   */
  montarVitrine(pontos: readonly { x: number; z: number }[], praga = 'lagartejo'): void {
    pontos.forEach((p, i) => this.nascer(praga, i % 3, { x: p.x, z: p.z }));
  }

  /** o teste manda regar AGORA, sem esperar a cadência */
  forcarJato(): void {
    this.recarga = this.ficha.cadencia;
    this.agua = Math.max(this.agua, this.ficha.gastoPorJato);
  }

  /** o teste liga um contador de efeito sem esperar o relógio (gêiser, chuva, crivo) */
  adiantar(qual: 'geiser' | 'chuva' | 'crivo' | 'danca' | 'arco-iris' | 'carga'
    | 'assobio' | 'walter' | 'la-de-tras' | 'aspersor'): void {
    if (qual === 'assobio') this.assobio = 12;
    if (qual === 'walter') this.walterDePlantao = 12;
    if (qual === 'la-de-tras') this.ladoDeTras = 5;
    if (qual === 'aspersor') this.aspersorRelogio = 3;
    if (qual === 'arco-iris') this.jatosDados = 9;
    if (qual === 'carga') this.carga = 1;
    if (qual === 'geiser') this.geiser = 20;
    if (qual === 'chuva') this.chuva = 30;
    if (qual === 'crivo') this.crivo = 4;
    if (qual === 'danca') this.parado = 3;
  }

  /*
   * ============================================= GANCHOS DO TESTE DAS CARTAS
   *
   * `scripts/cartasNaRodada.mjs` prova cada carta numa estufa de laboratório:
   * a vitrine sem bicho parado, e o teste põe o bicho, o canteiro machucado ou
   * a gota exatamente onde a carta precisa. Ninguém chega aqui jogando.
   */

  /** um bicho já dentro da estufa, andando atrás de canteiro (ou do lado de fora do portão) */
  soltarBicho(praga: string, x: number, z: number, opcoes: { porta?: number; fora?: boolean } = {}): void {
    const porta = opcoes.porta ?? 1;
    const inv = this.nascer(praga, porta);
    inv.x = x;
    inv.z = z;
    // de fora: indo para o portão (passo 1); de dentro: já passou da boca
    inv.passo = opcoes.fora ? 1 : inv.caminho.length;
    inv.passouPortao = !opcoes.fora;
  }

  /** tira todo bicho da estufa (os três parados da vitrine, e o que sobrou do caso anterior) */
  limparBichos(): void {
    for (const inv of this.invasores) this.tirar(inv);
    this.invasores = [];
  }

  /** o regador do jogador de folga: o teste quer o bicho vivo para a carta agir nele */
  regadorDeFolga = false;

  /** machuca um canteiro até uma fração da vida (0 = comido) */
  ferirCanteiro(i: number, fracao: number): void {
    const c = this.canteiros[i];
    if (!c) return;
    c.vida = c.vidaMax * fracao;
    this.pintarCanteiro(c);
  }

  /** o começo e o fim de uma onda, sem jogar a onda */
  forcarComecoDeOnda(): void {
    this.onda = Math.max(2, this.onda + 1);
    this.usadoNaOnda.clear();
    this.comecoDaOnda();
  }

  forcarFimDeOnda(): void {
    this.fimDeUmaOnda();
  }

  /** gotas direto na mão (sem pisar) — e o nível, para a tela das cartas não abrir */
  darGotas(n: number): void {
    this.receberGotas(n);
  }

  fixarNivel(n: number): void {
    this.nivel = n;
  }

  soltarGotasAqui(x: number, z: number, n: number): void {
    this.gotas.soltar(x, z, n, this.dado, (px, pz) => this.foraDeCanteiro(px, pz));
  }

  /** um bicho no roteiro da onda, daqui a `t` segundos, pelo portão pedido */
  agendar(praga: string, porta: number, t: number): void {
    this.plano.push({ t: this.tempoDaOnda + t, praga, porta, anunciada: false });
    this.plano.sort((a, b) => a.t - b.t);
  }

  /** uma poça debaixo do jogador (o Pé na poça) */
  pocaAqui(): void {
    const eu = this.g.playerPosition();
    this.jato.poca(eu.x, eu.z, 0.9, 6);
  }

  dispose(): void {
    this.jato.dispose();
  }
}

// ------------------------------------------------------------------ ajudantes

/** a barra de vida: um fundo escuro e a água que enche, da esquerda para a direita */
function montarBarra(): { barra: THREE.Group; enchido: THREE.Mesh } {
  const barra = new THREE.Group();
  const LARGURA = 0.62;
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(LARGURA + 0.06, 0.1, 0.03), toon(P.barraFundo));
  barra.add(fundo);
  const geo = new THREE.BoxGeometry(1, 0.06, 0.035);
  geo.translate(0.5, 0, 0);
  const enchido = new THREE.Mesh(geo, toon(P.barraAgua, { glow: 0.35 }));
  // a água vai de 0 a 1 no trilho, e o trilho tem a largura da barra: a
  // escala `x` do enchido é a fração que falta, e ela cresce da esquerda
  const trilho = new THREE.Group();
  trilho.scale.x = LARGURA;
  trilho.position.x = -LARGURA / 2;
  enchido.position.set(0, 0, 0.005);
  trilho.add(enchido);
  barra.add(trilho);
  return { barra, enchido };
}

/** a distância de um ponto até a borda de um canteiro (zero se está em cima dele) */
function distanciaAoCanteiro(x: number, z: number, c: { x: number; z: number; meioX: number; meioZ: number }): number {
  const dx = Math.max(0, Math.abs(x - c.x) - c.meioX);
  const dz = Math.max(0, Math.abs(z - c.z) - c.meioZ);
  return Math.hypot(dx, dz);
}

/**
 * QUANTAS CARTAS DE PRÊMIO um nível dá: nos múltiplos de 5, alternando uma e
 * duas (5 → 1, 10 → 2, 15 → 1, 20 → 2, 25 → 1…). Fora deles, nenhuma.
 */
export function cartasDePremio(nivel: number): number {
  if (nivel <= 0 || nivel % 5 !== 0) return 0;
  return (nivel / 5) % 2 === 1 ? 1 : 2;
}

/** o portão por onde mais bichos vão entrar neste roteiro (sem contar um fechado) */
function portaMaisCheia(plano: readonly EntradaDePraga[], fora: number | null): number | null {
  const conta = [0, 0, 0];
  for (const e of plano) if (e.porta !== fora) conta[e.porta] += 1;
  const mais = Math.max(...conta);
  return mais > 0 ? conta.indexOf(mais) : null;
}

/** o degrau de cima de uma carta de série (o Bis), se existir */
function proximoDegrau(id: string): ReturnType<typeof cartaPorId> {
  const m = /^(.+)-(\d+)$/.exec(id);
  if (!m) return undefined;
  const acima = cartaPorId(`${m[1]}-${Number(m[2]) + 1}`);
  return acima?.requer?.includes(id) ? acima : undefined;
}

function difAngulo(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function pontoAFrente(eu: { x: number; z: number }, rumo: number, dist: number): THREE.Vector3 {
  return new THREE.Vector3(eu.x + Math.sin(rumo) * dist, 0.05, eu.z + Math.cos(rumo) * dist);
}

/** o segmento (x1,z1)-(x2,z2) passa por dentro do retângulo centrado em (cx,cz)? */
function segmentoCruzaRetangulo(
  x1: number, z1: number, x2: number, z2: number, cx: number, cz: number, mx: number, mz: number,
): boolean {
  // Liang-Barsky
  let t0 = 0;
  let t1 = 1;
  const dx = x2 - x1;
  const dz = z2 - z1;
  const testes: Array<[number, number]> = [
    [-dx, x1 - (cx - mx)], [dx, (cx + mx) - x1], [-dz, z1 - (cz - mz)], [dz, (cz + mz) - z1],
  ];
  for (const [p, q] of testes) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const r = q / p;
    if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
    else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return t0 < t1;
}
