import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import type { Interactable } from '../world/Interactable';
import type { Bicho } from '../entities/bichos/Bicho';
import type { Walter } from '../entities/bichos/Walter';
import { Josefina } from '../entities/bichos/Josefina';
import { Capy } from '../entities/bichos/Capy';
import { Noel } from '../entities/bichos/Noel';
import { Gina } from '../entities/bichos/Gina';
import { Mano } from '../entities/bichos/Mano';
import { CARDAPIO, pratoPorId, type PratoDoCardapio } from '../world/cardapioData';
import { loucaSuja, pratoServido } from '../world/props';
import { animarVapor, bandejaDeGarcom, bloquinhoDeComandas, reservadoNaMesa, vaporDePrato } from '../world/moveisDoMania';
import { ITENS, ehPecaDoMania } from '../world/itens';
import { Cookie } from '../entities/bichos/Cookie';
import { JeanLuc } from '../entities/bichos/JeanLuc';
import { Estella } from '../entities/bichos/Estella';
import { Estrella, Luna, Sol } from '../entities/bichos/CoelhaDaTorcida';
import { Flynn } from '../entities/bichos/Flynn';
import { Gatito } from '../entities/bichos/Gatito';
import { Pelusa } from '../entities/bichos/Pelusa';
import { BalaoDeCliente } from './balaoDeCliente';
import {
  TURNOS, estrelasDoTurno, type ChegadaDoTurno, type NiveisDasMelhorias, type TurnoDaEscala,
} from './turnosDoMania';

/**
 * O TURNO NO MANIA DE CHURRASCO — o minigame de servir as mesas.
 *
 * O plano inteiro está em `docs/MINIGAME-RESTAURANTE.md`. Este é o MOTOR: o
 * laço completo, a paciência e o painel na tela. QUAL turno se joga (quanto
 * dura, quem chega e quando, as metas das estrelas) é dado, e mora em
 * `turnosDoMania.ts` — a escala do Walter escolhe um e passa no `comecar()`.
 *
 * ELE NÃO É UMA CUTSCENE, e essa é a diferença de tudo o que já existe neste
 * repositório. `servir()` — o Walter levando o prato à mesa — é uma sequência
 * de `await` que congela o mundo e conduz. Um turno é o contrário: uma máquina
 * de estados que anda em `w.onUpdate(dt)` com o jogador SOLTO o tempo todo. Não
 * existe `await` no laço principal aqui; os únicos que existem são os de quem
 * anota um pedido (que trava de propósito, e é o custo daquela ação).
 *
 * O DESENHO DA DIVERSÃO, em uma frase: **você é dois, e só pode ser um de cada
 * vez**. O `T` troca de corpo e o corpo que você larga fica parado onde estava,
 * com a bandeja que estava carregando. Deixar um parado no balcão com a bandeja
 * cheia é meia viagem já resolvida quando você trocar para ele.
 *
 * NÃO EXISTE DERROTA, por decisão do Renan. Nenhum caminho desta máquina de
 * estados encerra o turno antes da hora: cliente que perde a paciência vai
 * embora e leva o dinheiro dele, e é só. O turno sempre chega na conta do dia.
 *
 * O QUE É DE PROPÓSITO E PARECE ERRADO:
 * - a paciência drena por FASE, e não por cliente. Quem está lendo o cardápio
 *   não drena nada; quem está de mão levantada drena rápido. É o que faz o jogo
 *   ser de decidir o que largar, e não de correr;
 * - a louça suja divide a bandeja com o prato limpo. Ninguém reclama de louça,
 *   mas mesa suja não recebe ninguém — é a dívida que trava o salão;
 * - a cozinha não é jogável. O Walter cozinha; você serve.
 */

// ------------------------------------------------------------------ ajustes

/** quantos segundos cada fase leva para a paciência ir de cheia a zero */
const DRENO = {
  'na-porta': 42,
  'quer-pedir': 26,
  esperando: 62,
  'quer-pagar': 34,
} as const;
/** as fases que passam sozinhas, e em quanto tempo */
const LEITURA = 6;
const REFEICAO = 11;
/** o Walter leva isto por prato (a "Chapa nova" baixa para 5) */
const COZINHA = 7;
const COZINHA_NA_CHAPA_NOVA = 5;
/** vagas na bandeja de CADA personagem — prato limpo e louça suja disputam (a "Bandeja grande" dá 3) */
const BANDEJA = 2;
/** do turno 4 em diante, o prato pronto esfria nisto (no balcão e na bandeja) */
const ESFRIA = 24;
/** o biscoitinho da Estella: segundos de passo mais rápido para quem entregou o prato dela */
const BISCOITO = 20;
const PASSO_DO_BISCOITO = 1.25;
/** onde cada prato da mesa grande pousa, na frente da cadeira de quem pediu (a Luna, a Sol e a Estrella) */
const LUGARES_DA_MESA_GRANDE: ReadonlyArray<readonly [number, number]> = [[0.26, 0.24], [-0.26, 0.24], [0.26, -0.24]];
/** o tamanho do prato e da louça EM CIMA da bandeja, na mão: o de mesa não cabe dois */
const ESCALA_NA_BANDEJA = 0.46;
/** vagas de prato pronto no balcão */
const SAIDAS = 3;
/** a torcida do Flynn: quanto de paciência cada prato entregue devolve, e até onde */
const TORCIDA = 0.12;
/** as mesas do salão ficam a 4,6–4,8 uma da outra: 5,2 pega as vizinhas, e não as da diagonal */
const RAIO_DA_TORCIDA = 5.2;
/** o six seven do Gatito: quanto de paciência o salão inteiro recupera rindo */
const SIX_SEVEN = 0.2;
/** o Pelusa: prato parado no balcão há isto (segundos) já é dele */
const PRATO_PARADO = 6;
/** e as mesas vizinhas da mesa em que ele deita (a esta distância) drenam em dobro */
const RAIO_DO_PELUSA = 5.2;

const TODOS_OS_PRATOS: readonly PratoDoCardapio[] = CARDAPIO.flatMap((s) => s.pratos);
/** o que se COME (tudo menos as bebidas): é o primeiro pedido de quem vai querer sobremesa */
const PRATOS_DE_COMER: readonly PratoDoCardapio[] = CARDAPIO
  .filter((s) => s.titulo !== 'Bebidas')
  .flatMap((s) => s.pratos);

/** o preço vem formatado ("R$ 18"); o turno precisa do número */
function valor(prato: PratoDoCardapio): number {
  return Number(prato.preco.replace(/\D+/g, '')) || 10;
}

// ------------------------------------------------------------------ elenco

/**
 * A FICHA DE UM CLIENTE.
 *
 * É uma tabela de propósito: quanto mais bichos o jogo ganhar, mais dinâmico o
 * turno fica, e um bicho novo tem que ser UMA LINHA nova aqui — não um `if`
 * espalhado pela máquina de estados. Foi o pedido do Renan.
 *
 * O traço nunca é "esse é mais rápido". Ele muda o que você DECIDE fazer, e
 * sempre tem um lado bom e um ruim.
 */
interface FichaDeCliente {
  id: string;
  nome: string;
  criar(): Bicho;
  /** onde o balão flutua, medido do chão do bicho */
  balao: number;
  /** multiplicador da paciência dele em todas as fases */
  calma: number;
  /** segundos que o garçom fica preso anotando o pedido dele */
  anotar: number;
  /** ele já senta sabendo o que quer: pula a fase de ler o cardápio */
  jaSabe?: boolean;
  /** paga o dobro */
  gorjeta?: boolean;
  /** acalma quem senta perto: fração a menos de dreno, num raio de 5 */
  acalma?: number;
  /**
   * PEDE SOBREMESA: depois de comer, em vez de pedir a conta ele levanta a mão
   * de novo — um segundo "anotar" e uma segunda entrega na MESMA mesa, e ele
   * paga as duas. É o `id` do prato da sobremesa.
   */
  sobremesa?: string;
  /** o que ele faz quando a sobremesa chega na mesa */
  festejar?(bicho: Bicho): void;
  /** o que ele pede: só estes pratos (o Cookie só toma suco) */
  cardapio?: readonly string[];
  /** segundos que o Walter leva no prato dele (o suco do Cookie sai num instante) */
  preparo?: number;
  /** segundos que ele leva comendo */
  refeicao?: number;
  /**
   * OCUPA DUAS MESAS: grande demais para uma, ele senta e a mesa livre mais
   * perto fica fechada enquanto ele estiver ("Reservado pro Cookie")
   */
  ocupaVizinha?: boolean;
  /** como ele senta: a altura do assento e quanto se afasta da mesa (o Cookie é grande para a cadeira) */
  assento?: { altura: number; afasta: number };
  /**
   * SÓ ACEITA PRATO QUENTE (o Jean-Luc): quente, ele comemora e paga em
   * dobro; frio, paga com o coração apagado
   */
  exigeQuente?: boolean;
  /** o que ele faz quando o prato chega quente */
  comemorar?(bicho: Bicho): void;
  /**
   * REPARA NO UNIFORME (a Estella): se quem anota o pedido dela estiver
   * vestindo uma peça do Mania, ela dá gorjeta dobrada
   */
  repara?: boolean;
  /**
   * DÁ O BISCOITINHO (a Estella) a quem entrega o prato dela: 20 s de passo
   * mais rápido para aquele garçom
   */
  biscoito?(bicho: Bicho): void;
  /**
   * CHEGAM JUNTAS E SENTAM JUNTAS (as coelhinhas): quem vem junto com o
   * primeiro bicho. A mesa é uma só, os pedidos são um por bicho, e a mesa só
   * começa a comer — e só paga — quando TODOS os pratos chegaram
   */
  junto?(): Bicho[];
  /**
   * TORCE (o Flynn): cada prato entregue no salão, em qualquer mesa, faz ele
   * comemorar e devolve um pouco de paciência às mesas perto dele
   */
  torce?(bicho: Bicho): void;
  /**
   * SIX SEVEN (o Gatito): quando ele paga, faz o gesto e o salão inteiro ri
   * — todo mundo recupera um pouco de paciência
   */
  sixSeven?(bicho: Bicho): void;
  fala: string;
}

const ELENCO: readonly FichaDeCliente[] = [
  {
    id: 'josefina',
    nome: 'Josefina',
    criar: () => new Josefina({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.35,
    // ela praticamente não se irrita — mas conta uma história enquanto pede, e
    // o garçom fica preso ali. Não é uma corrida contra o tempo: é um custo
    // fixo que você escolhe QUANDO pagar
    calma: 2.2,
    anotar: 3.2,
    fala: 'Sem pressa, meu bem. Eu tenho o dia todo.',
  },
  {
    id: 'capy',
    nome: 'Capy',
    criar: () => new Capy({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.5,
    // sereno, e ACALMA AS MESAS VIZINHAS: é o bicho que ensina que onde você
    // senta cada um importa. O Capy no meio do salão vale mais que no canto
    calma: 1.6,
    anotar: 0.9,
    acalma: 0.3,
    fala: 'Fica tranquilo. Tá todo mundo bem.',
  },
  {
    id: 'noel',
    nome: 'Noel',
    criar: () => new Noel({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.7,
    // elétrico, paciência curtíssima — e gorjeta dobrada. Ele é o cliente que
    // vale a pena atender primeiro, e o que mais dói esquecer
    calma: 0.62,
    anotar: 0.8,
    gorjeta: true,
    fala: 'Rápido rápido rápido! Digo, quando puder!',
  },
  {
    id: 'gina',
    nome: 'Gina',
    criar: () => new Gina({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 2.5,
    // ela é alta e lê o cardápio de qualquer lugar do salão: senta e JÁ está de
    // mão levantada. Zero folga — sentar a Gina e sair andando é o erro caro
    calma: 1.1,
    anotar: 0.9,
    jaSabe: true,
    fala: 'Eu já escolhi lá da porta. Dá pra ver o cardápio daqui de cima.',
  },
  {
    id: 'mano',
    nome: 'Mano',
    criar: () => new Mano({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.55,
    /**
     * O PINGUIM DO QUIOSQUE DE SORVETE, do outro lado do balcão hoje: ele
     * come e PEDE SOBREMESA. A mesa dele fica ocupada o dobro do tempo —
     * ótimo dinheiro, péssimo para o giro do salão. É o bicho que ensina a
     * pensar na mesa como recurso. A sobremesa é o smoothie gelado do
     * cardápio: o Mania não vende sorvete, e o Mano não é de reclamar.
     */
    calma: 1.25,
    anotar: 1.0,
    sobremesa: 'smoothie-manga-banana',
    festejar: (bicho) => (bicho as Mano).dancar(2.4),
    fala: 'Hoje eu vim comer, não vender! Mas guarda espaço pra sobremesa.',
  },
  {
    id: 'cookie',
    nome: 'Cookie',
    criar: () => new Cookie({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 2.55,
    /**
     * O ELEFANTE DA BILHETERIA, grande e manso: OCUPA DUAS MESAS (a do lado
     * fica fechada enquanto ele estiver), mas só pede suco — o Walter faz num
     * instante e ele toma rápido. Onde você senta o Cookie decide se ele fecha
     * uma mesa vazia ou uma mesa que ia render: é o Capy ao contrário.
     * Ele não cabe na cadeira: fica de pé no lugar dela, um passo para fora.
     */
    calma: 1.5,
    anotar: 0.8,
    cardapio: ['suco-morango'],
    preparo: 3,
    refeicao: 5,
    ocupaVizinha: true,
    // de pé, um passo inteiro para fora da cadeira: com meio passo o corpo
    // dele invadia o tampo da mesa
    assento: { altura: 0, afasta: 1.0 },
    fala: 'Só um suquinho de morango, por favor. Desculpa o espaço!',
  },
  {
    id: 'jean-luc',
    nome: 'Jean-Luc',
    criar: () => new JeanLuc({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.0,
    /**
     * O PATO FRANCÊS, exigente: SÓ ACEITA PRATO QUENTE. Do turno 4 em diante o
     * prato esfria no balcão; quente, ele comemora ("Magnifique!") e paga em
     * dobro; frio, paga com o coração apagado. Ensina a não deixar prato
     * parado no balcão.
     */
    calma: 0.9,
    anotar: 1.4,
    exigeQuente: true,
    comemorar: (bicho) => (bicho as JeanLuc).comemorar(2.4),
    fala: 'Bonsoir! Eu só como prato quente, hein? Bem quente!',
  },
  {
    id: 'estella',
    nome: 'Estella',
    criar: () => new Estella({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.45,
    /**
     * A OVELHA COSTUREIRA: REPARA NO UNIFORME (gorjeta dobrada se quem anota o
     * pedido dela estiver vestindo uma peça do Mania) e sempre dá um
     * BISCOITINHO a quem entrega o prato — 20 s de passo mais rápido. É o traço
     * que liga os prêmios ao jogo: a roupa ganha num turno ajuda no seguinte.
     */
    calma: 1.3,
    anotar: 1.0,
    repara: true,
    biscoito: (bicho) => (bicho as Estella).oferecerBiscoito(2.2),
    fala: 'Que salão bonito! Deixa eu ver o uniforme de vocês…',
  },
  {
    id: 'coelhas',
    nome: 'Luna, Sol e Estrella',
    criar: () => new Luna({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.55,
    /**
     * AS TRÊS COELHINHAS DA TORCIDA, que chegam juntas e sentam juntas: a
     * MESA GRANDE. Três pedidos, três pratos, e a mesa só come (e só paga)
     * quando chegaram os três — o prato que chega sozinho esfria esperando as
     * irmãs. Ensina a encher a bandeja com um propósito. A Luna é quem fala
     * (e quem leva o balão); a Sol senta do lado dela, e a Estrella, a mais
     * alta, na cadeira de trás.
     */
    calma: 1.15,
    anotar: 1.8,
    junto: () => [new Sol({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }), new Estrella({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 })],
    comemorar: (bicho) => (bicho as Luna).torcer(2.2),
    fala: 'Mesa pra três, por favor! A gente pede junto e come junto.',
  },
  {
    id: 'flynn',
    nome: 'Flynn',
    criar: () => new Flynn({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.75,
    /**
     * A RAPOSA CAPITÃ DA ATLÉTICA: TORCE. Cada prato entregue no salão — em
     * qualquer mesa — faz ele comemorar e devolve um pouco de paciência às
     * mesas perto dele. Sentar o Flynn no meio do salão vale ouro: é o Capy
     * de quem tem pressa.
     */
    calma: 1.0,
    anotar: 0.9,
    torce: (bicho) => (bicho as Flynn).comemorar(1.6),
    fala: 'Bora, time! Eu torço daqui por cada prato que sair!',
  },
  {
    id: 'gatito',
    nome: 'Gatito',
    criar: () => new Gatito({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 }),
    balao: 1.3,
    /**
     * O PROFESSOR: SIX SEVEN. Quando ele paga, faz o gesto e o salão inteiro
     * ri — todo mundo recupera um pouco de paciência. Mas ele come devagar,
     * conversando, e a mesa dele demora a liberar. Guardar a conta do Gatito
     * para a hora do aperto é a jogada.
     */
    calma: 1.4,
    anotar: 1.2,
    refeicao: 18,
    sixSeven: (bicho) => (bicho as Gatito).sixSeven(),
    fala: 'Boa noite, alunos! Hoje a aula é de comer devagar.',
  },
];

/** as fichas que o motor sabe montar — o painel da escala usa para conferir a tabela */
export const FICHAS_DO_ELENCO: readonly string[] = ELENCO.map((f) => f.id);

// ------------------------------------------------------------------- planta

export interface MesaDoTurno {
  x: number;
  z: number;
  posta: THREE.Object3D;
  floreira: THREE.Object3D;
}

export interface PlantaDoTurno {
  /** onde o cliente entra e por onde ele sai */
  entrada: { x: number; z: number };
  /** os lugares da fila, o primeiro é a frente: três, e o QUARTO só com a "Plaquinha de reserva" */
  fila: readonly { x: number; z: number }[];
  /** o ponto de interação de "levar à mesa" */
  recepcao: { x: number; z: number };
  /** as vagas de prato pronto em cima do balcão */
  saidas: readonly { x: number; z: number }[];
  /** o ponto de interação de pegar o prato */
  balcao: { x: number; z: number };
  /**
   * o CARRINHO DE LOUÇA (a melhoria): onde ele fica, o ponto de largar a
   * louça nele, os lugares das pilhas em cima e a altura da bandeja de cima
   */
  carrinho?: { x: number; z: number; ponto: { x: number; z: number }; pilha: readonly { x: number; z: number }[]; tampo: number };
  /** onde a louça suja se empilha, e o ponto de largar */
  pilha: readonly { x: number; z: number }[];
  copa: { x: number; z: number };
  /** altura do tampo do balcão */
  tampo: number;
  /** onde o Walter fica na cozinha, e onde ele encosta para deixar o prato */
  cozinha: { x: number; z: number };
  janela: { x: number; z: number };
}

type Fase = 'na-porta' | 'indo' | 'sentando' | 'lendo' | 'quer-pedir' | 'esperando'
  | 'comendo' | 'quer-pagar' | 'saindo';

interface Cliente {
  ficha: FichaDeCliente;
  bicho: Bicho;
  balao: BalaoDeCliente;
  fase: Fase;
  /** 0 a 1 */
  paciencia: number;
  /** conta regressiva das fases que passam sozinhas */
  relogio: number;
  mesa: MesaDoTurno | null;
  prato: PratoDoCardapio;
  /** já comeu: se sair agora, deixa louça */
  sujou: boolean;
  /** o valor do que ele já comeu: é isto que ele paga (o Mano paga duas coisas) */
  gasto: number;
  /** já está na sobremesa: o próximo "acabou de comer" é para pedir a conta */
  naSobremesa: boolean;
  /** o prato chegou quente (`true`), frio (`false`), ou ainda não chegou (`null`) */
  quente: boolean | null;
  /** a Estella reparou no uniforme de quem anotou */
  reparou: boolean;
  /** quem veio junto (as irmãs da Luna): sentam na mesma mesa, um pedido cada */
  junto: Bicho[];
  /** os pratos que a mesa ainda espera — um só, ou três na mesa grande */
  faltam: PratoDoCardapio[];
  /** os pratos que já chegaram e esperam na mesa os outros (e esfriam ali) */
  naMesa: THREE.Object3D[];
  /** segundos que ele ainda fica parado antes de ir embora (o six seven do Gatito) */
  segura: number;
}

/** uma comanda na cozinha: UM prato, de uma mesa (a mesa grande manda três) */
interface Comanda {
  para: Cliente;
  prato: PratoDoCardapio;
}

type Vaga =
  | { tipo: 'prato'; prato: PratoDoCardapio; malha: THREE.Object3D; para: Cliente }
  | { tipo: 'louca'; malha: THREE.Object3D };

interface PratoPronto {
  prato: PratoDoCardapio;
  para: Cliente;
  malha: THREE.Object3D;
  vaga: number;
  /** segundos parado no balcão: passou de `PRATO_PARADO`, o Pelusa vem buscar */
  idade: number;
}

/** o Pelusa no salão: o que ele está fazendo e atrás de quê */
interface PelusaNoSalao {
  bicho: Pelusa;
  fase: 'procurando' | 'indo' | 'deitado' | 'fugindo';
  /** atrás de quê ele vai: um prato do balcão, a bandeja largada, ou uma mesa suja */
  alvo: { tipo: 'balcao'; pronto: PratoPronto } | { tipo: 'bandeja'; quem: string } | { tipo: 'mesa'; mesa: MesaDoTurno } | null;
  /** o prato que ele leva na boca, fugindo */
  naBoca: THREE.Object3D | null;
  /** o pulinho de subir no balcão */
  pulo: number;
}

// ------------------------------------------------------------------ o turno

export class TurnoDoMania {
  /** o turno está rodando */
  rodando = false;
  /** qual turno da escala está sendo jogado (o último, depois que acaba) */
  turno: TurnoDaEscala = TURNOS[0];

  private tempo = 0;
  private dinheiro = 0;
  private coracoes = 0;
  private clientes: Cliente[] = [];
  private proximaChegada = 0;
  /** o cliente que está sendo levado a uma mesa, e por quem */
  private guiado: Cliente | null = null;
  /** id do personagem -> o que ele carrega */
  private bandejas = new Map<string, Vaga[]>();
  /** mesas sujas: a louça que está em cima delas */
  private sujeira = new Map<MesaDoTurno, THREE.Object3D>();
  private ocupadas = new Map<MesaDoTurno, Cliente>();
  /** comandas na cozinha, na ordem */
  private comandas: Comanda[] = [];
  /** o que está na chapa: um prato de cada vez, ou dois com a chapa dupla */
  private cozinhando: Array<{ comanda: Comanda; falta: number }> = [];
  /** o nível de cada melhoria neste turno */
  private niveis: NiveisDasMelhorias = {};
  /** a bandeja de verdade na mão de cada um, pelo id da pessoa */
  private bandejasNaMao = new Map<string, THREE.Group>();
  private pilhaNoCarrinho: THREE.Object3D[] = [];
  /** quem está anotando agora (com o bloquinho na mão no lugar da bandeja) */
  private anotando: string | null = null;
  /** as mesas fechadas pelo Cookie: a mesa, quem fechou e o cartão de reservado em cima */
  private bloqueadas = new Map<MesaDoTurno, { por: Cliente; cartao: THREE.Object3D }>();
  /** o biscoitinho da Estella: segundos de passo rápido que ainda sobram, por pessoa */
  private biscoitos = new Map<string, number>();
  private passoAtual = 1;
  private relogioDoVapor = 0;
  private prontos: PratoPronto[] = [];
  /** o Pelusa, quando ele está no salão (turno 6), e a próxima entrada dele na escala */
  private pelusa: PelusaNoSalao | null = null;
  private proximoPelusa = 0;
  private pilhaDeLouca: THREE.Object3D[] = [];
  private semente = 20260906;
  /** o que estava aceso antes do turno, para voltar a acender no fim */
  private suspensas: Interactable[] = [];

  private readonly pontoDaRecepcao: Interactable;
  private readonly pontoDaMesa: Interactable[];
  private readonly pontoDoBalcao: Interactable;
  private readonly pontoDaCopa: Interactable;
  private readonly pontoDoCarrinho: Interactable | null;
  private readonly pontoDoPelusa: Interactable;

  constructor(
    private readonly w: WorldBuilder,
    private readonly g: GameAPI,
    private readonly mesas: readonly MesaDoTurno[],
    private readonly planta: PlantaDoTurno,
    private readonly walter: Walter,
  ) {
    // Os pontos nascem DESLIGADOS e vivem o cenário inteiro. Criar interação no
    // meio do turno seria criar e destruir dez objetos por minuto; ligar e
    // desligar quatro é de graça, e o rótulo de cada um muda com o estado.
    this.pontoDaRecepcao = w.interact({
      id: 'turno:recepcao',
      x: planta.recepcao.x, z: planta.recepcao.z, radius: 1.8,
      label: 'Levar à mesa', icon: '🙋',
      priority: 3,
      onInteract: () => this.levarAMesa(),
    });
    this.pontoDoBalcao = w.interact({
      id: 'turno:balcao',
      x: planta.balcao.x, z: planta.balcao.z, radius: 1.7,
      label: 'Pegar o prato', icon: '🍽️',
      priority: 3,
      onInteract: () => this.pegarOPrato(),
    });
    this.pontoDaCopa = w.interact({
      id: 'turno:copa',
      x: planta.copa.x, z: planta.copa.z, radius: 1.7,
      label: 'Largar a louça', icon: '🧽',
      priority: 3,
      onInteract: () => this.largarALouca(),
    });
    this.pontoDoCarrinho = planta.carrinho ? w.interact({
      id: 'turno:carrinho',
      x: planta.carrinho.ponto.x, z: planta.carrinho.ponto.z, radius: 1.5,
      label: 'Largar a louça no carrinho', icon: '🛒',
      priority: 3,
      onInteract: () => this.largarALouca('carrinho'),
    }) : null;
    // "PSIU, PELUSA": o ponto anda com ele (`moveTo` a cada quadro), e
    // espantar custa só a viagem até onde ele está
    this.pontoDoPelusa = w.interact({
      id: 'turno:pelusa',
      x: planta.entrada.x, z: planta.entrada.z, radius: 1.3,
      label: 'Psiu, Pelusa!', icon: '😼',
      priority: 5,
      onInteract: () => this.espantarOPelusa(),
    });
    this.pontoDaMesa = mesas.map((mesa, i) => w.interact({
      id: `turno:mesa-${i}`,
      x: mesa.x, z: mesa.z + 1.4, radius: 1.6,
      label: 'Sentar aqui', icon: '🪑',
      priority: 4,
      onInteract: () => this.naMesa(mesa),
    }));
    for (const p of this.todosOsPontos()) p.enabled = false;
  }

  private todosOsPontos(): Interactable[] {
    return [
      this.pontoDaRecepcao, this.pontoDoBalcao, this.pontoDaCopa, this.pontoDoPelusa,
      ...(this.pontoDoCarrinho ? [this.pontoDoCarrinho] : []), ...this.pontoDaMesa,
    ];
  }

  /** o nível de uma melhoria neste turno (0 = não tem) */
  private nivel(id: string): number {
    return this.niveis[id] ?? 0;
  }

  /** quantas coisas cabem na bandeja de cada um */
  private get capacidade(): number {
    return BANDEJA + (this.nivel('bandeja') > 0 ? 1 : 0);
  }

  /** quantos lugares a fila tem: o quarto vem com a plaquinha de reserva */
  private get lugaresNaFila(): number {
    return Math.min(this.planta.fila.length, this.nivel('reserva') > 0 ? 4 : 3);
  }

  private sorte(): number {
    let s = this.semente;
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    this.semente = s >>> 0;
    return (this.semente % 100000) / 100000;
  }

  // ------------------------------------------------------------ liga/desliga

  /**
   * Começa o turno que a escala mandou.
   *
   * A ESCALA DE CHEGADA É FIXA, e não sorteada: um turno igual toda vez é o
   * que deixa o jogador APRENDER o turno — o mesmo princípio de uma fase de
   * plataforma. E é o que deixa o teste medir alguma coisa: com chegada
   * aleatória, `scripts/turno.mjs` não teria o que afirmar.
   */
  async comecar(turno: TurnoDaEscala = TURNOS[0], niveis: NiveisDasMelhorias = {}): Promise<void> {
    if (this.rodando) return;
    this.rodando = true;
    this.turno = turno;
    this.niveis = niveis;
    this.cozinhando = [];
    this.comandas = [];
    this.anotando = null;
    this.proximoPelusa = 0;
    this.biscoitos.clear();
    this.bloqueadas.clear();
    this.tempo = turno.duracao;
    this.dinheiro = 0;
    this.coracoes = 0;
    this.proximaChegada = 0;
    this.bandejas.clear();
    this.g.setZoom(11.5);
    this.g.som('sino');
    this.g.toast(`Turno ${turno.numero}: ${turno.nome}`, '⏱');

    /**
     * TUDO O QUE NÃO É DO TURNO DESLIGA — inclusive a porta de volta pro clube.
     *
     * A lista é calculada aqui e não recebida pronta: assim, uma interação nova
     * que alguém acrescente à cena amanhã já nasce suspensa durante o turno, em
     * vez de ficar acesa porque ninguém lembrou de somá-la a um array.
     */
    this.suspensas = this.w.interactables.filter(
      (p) => !p.id.startsWith('turno:') && p.enabled,
    );
    for (const p of this.suspensas) p.enabled = false;
    this.pontoDaRecepcao.enabled = true;

    /**
     * A BANDEJA NA MÃO DOS DOIS, a de sempre ou a grande, e o TÊNIS DE GARÇOM
     * nos pés de quem tem a melhoria. As duas coisas são da cena: não mexem no
     * save, e o fim do turno (ou a troca de cena) tira.
     */
    for (const quem of [this.g.playerId(), this.g.companionId()]) {
      const bandeja = bandejaDeGarcom(this.nivel('bandeja') > 0);
      this.bandejasNaMao.set(quem, bandeja);
      this.g.segurarNaCena(quem, bandeja, 'upright');
      if (this.nivel('tenis') > 0) this.g.vestirNaCena(quem, 'pes', ITENS.tenisDeGarcom);
    }
    // o tênis anda 10% por nível — vale para quem estiver no comando, e o T
    // não tira (a velocidade é do comando, não do corpo)
    this.passoAtual = 1 + 0.1 * this.nivel('tenis');
    this.g.setVelocidadeDoJogador(this.passoAtual);

    // o Walter vai para a cozinha e fica lá: durante o turno ele é a cozinha
    this.walter.entrarEmServico();
    void this.walter.irPara(this.planta.cozinha.x, this.planta.cozinha.z, 2.4);
  }

  private async terminar(): Promise<void> {
    this.rodando = false;
    for (const p of this.todosOsPontos()) p.enabled = false;
    for (const [quem, bandeja] of this.bandejasNaMao) {
      this.g.segurarNaCena(quem, null);
      this.g.vestirNaCena(quem, 'pes', null);
      this.apagar(bandeja);
    }
    this.bandejasNaMao.clear();
    this.g.setVelocidadeDoJogador(1);
    for (const pilha of this.pilhaNoCarrinho) this.apagar(pilha);
    this.pilhaNoCarrinho = [];
    for (const [mesa, { cartao }] of this.bloqueadas) {
      this.apagar(cartao);
      mesa.floreira.visible = true;
    }
    this.bloqueadas.clear();
    if (this.pelusa) this.tirarOPelusa();
    this.g.showTurno(null);
    this.g.setZoom(9.5);
    this.g.som('caixa');

    for (const pilha of this.pilhaDeLouca) this.apagar(pilha);
    this.pilhaDeLouca = [];
    for (const [mesa, louca] of this.sujeira) {
      this.apagar(louca);
      mesa.floreira.visible = true;
    }
    this.sujeira.clear();

    this.walter.voltarAPassear();
    for (const p of this.suspensas) p.enabled = true;
    this.suspensas = [];

    this.g.toast(`R$ ${this.dinheiro} · ${'⭐'.repeat(this.conta.estrelas)}`, '📋');
  }

  /** o fim do turno é público para a cena poder contar o dia depois */
  get conta(): { dinheiro: number; coracoes: number; estrelas: number; turno: TurnoDaEscala } {
    const estrelas = estrelasDoTurno(this.turno, this.dinheiro);
    return { dinheiro: this.dinheiro, coracoes: this.coracoes, estrelas, turno: this.turno };
  }

  aoAcabar: (() => void) | null = null;

  // -------------------------------------------------------------- o relógio

  atualizar(dt: number): void {
    if (!this.rodando) return;
    this.tempo = Math.max(0, this.tempo - dt);

    this.chegadas();
    this.cozinhar(dt);
    for (const p of this.prontos) p.idade += dt;
    for (const c of [...this.clientes]) this.viverUmCliente(c, dt);
    this.viverOPelusa(dt);
    this.esfriar(dt);
    this.passoDoBiscoito(dt);
    this.arrumarOsPontos();

    this.g.showTurno({
      tempo: this.tempo,
      dinheiro: this.dinheiro,
      coracoes: this.coracoes,
      bandeja: this.minhaBandeja().map((v) => v.tipo === 'prato'
        ? (this.calorDe(v.malha) > 0
          ? { icone: '🍽️', titulo: v.prato.nome }
          : { icone: '🥶', titulo: `${v.prato.nome} (frio)` })
        : { icone: '🧽', titulo: 'Louça suja' }),
    });

    // O TURNO SÓ ACABA COM O SALÃO VAZIO. Quando o relógio zera ninguém novo
    // entra, mas quem está dentro tem que ser servido — é o que transforma um
    // corte seco num fim com respiração.
    if (this.tempo <= 0 && this.clientes.length === 0) {
      void this.terminar().then(() => this.aoAcabar?.());
    }
  }

  /** o turno tem a regra de o prato esfriar (do turno 4 em diante) */
  private get esfria(): boolean {
    return this.turno.regras?.includes('esfria') ?? false;
  }

  /** o calor de um prato (1 = saiu da chapa, 0 = frio); sem a regra, todo prato é quente */
  private calorDe(malha: THREE.Object3D): number {
    return (malha.userData?.calor as number | undefined) ?? 1;
  }

  /**
   * O PRATO ESFRIA no balcão e na bandeja — do turno 4 em diante. O vapor que
   * sobe dele encolhe junto, e frio ele para de sair: é o relógio que se VÊ.
   */
  private esfriar(dt: number): void {
    if (!this.esfria) return;
    this.relogioDoVapor += dt;
    const pratos = [
      ...this.prontos.map((p) => p.malha),
      ...[...this.bandejas.values()].flatMap((b) => b.filter((v) => v.tipo === 'prato').map((v) => v.malha)),
      // o prato da mesa grande que chegou antes dos outros esfria esperando as irmãs
      ...this.clientes.filter((c) => c.fase === 'esperando').flatMap((c) => c.naMesa),
    ];
    for (const malha of pratos) {
      if (!(malha as THREE.Object3D).isObject3D) continue;
      const calor = Math.max(0, this.calorDe(malha) - dt / ESFRIA);
      malha.userData.calor = calor;
      const vapor = malha.getObjectByName('vapor');
      if (vapor) animarVapor(vapor, this.relogioDoVapor, calor);
    }
  }

  /** o biscoitinho da Estella: quem está no comando com biscoito anda 25% mais */
  private passoDoBiscoito(dt: number): void {
    for (const [quem, falta] of this.biscoitos) {
      if (falta - dt <= 0) this.biscoitos.delete(quem);
      else this.biscoitos.set(quem, falta - dt);
    }
    const passo = (1 + 0.1 * this.nivel('tenis')) * (this.biscoitos.has(this.g.playerId()) ? PASSO_DO_BISCOITO : 1);
    if (passo !== this.passoAtual) {
      this.passoAtual = passo;
      this.g.setVelocidadeDoJogador(passo);
    }
  }

  private chegadas(): void {
    if (this.tempo <= 0) return;
    const chegadas: readonly ChegadaDoTurno[] = this.turno.chegadas;
    const decorrido = this.turno.duracao - this.tempo;
    while (
      this.proximaChegada < chegadas.length
      && chegadas[this.proximaChegada].aos <= decorrido
    ) {
      const marcado = chegadas[this.proximaChegada];
      this.proximaChegada += 1;
      // fila cheia: o quarto vai embora antes de entrar. Perda seca, sem drama
      // e sem barulho — só uma linha a menos na conta do dia
      if (this.naFila().length >= this.lugaresNaFila) continue;
      this.entrar(ELENCO.find((f) => f.id === marcado.ficha) ?? ELENCO[0]);
    }
  }

  /**
   * GANCHO DE TESTE: faz entrar agora um cliente da ficha `id`, fora da
   * escala de chegada (como o `debugPlace` do motor). Os testes dos traços
   * (`scripts/turnos34.mjs`) chamam o bicho que querem medir sem esperar a
   * vez dele — no Chromium sem placa, esperar seriam minutos.
   */
  forcarChegada(id: string): void {
    const ficha = ELENCO.find((f) => f.id === id);
    if (ficha) this.entrar(ficha);
  }

  private entrar(ficha: FichaDeCliente): void {
    const bicho = ficha.criar();
    const balao = new BalaoDeCliente(ficha.balao);
    bicho.group.add(balao.sprite);
    bicho.group.position.set(this.planta.entrada.x, 0, this.planta.entrada.z);
    this.w.root.add(bicho.group);
    // quem vem junto entra logo atrás, cada um um passo para o lado
    const junto = ficha.junto?.() ?? [];
    junto.forEach((b, i) => {
      b.entrarEmServico();
      b.group.position.set(this.planta.entrada.x + (i === 0 ? -0.5 : 0.5), 0, this.planta.entrada.z + 0.5);
      this.w.root.add(b.group);
    });
    const prato = this.sortearPrato(ficha);

    const cliente: Cliente = {
      ficha,
      bicho,
      balao,
      fase: 'na-porta',
      paciencia: 1,
      relogio: 0,
      mesa: null,
      prato,
      sujou: false,
      gasto: 0,
      naSobremesa: false,
      quente: null,
      reparou: false,
      junto,
      faltam: [prato, ...junto.map(() => this.sortearPrato(ficha))],
      naMesa: [],
      segura: 0,
    };
    this.clientes.push(cliente);
    balao.mostrar({ tipo: 'chegando' }, 1);
    this.g.som('porta');
  }

  /** quem vai querer sobremesa começa por algo de COMER: smoothie de entrada e de sobremesa não é jantar */
  private sortearPrato(ficha: FichaDeCliente): PratoDoCardapio {
    const doCardapio = ficha.cardapio
      ? TODOS_OS_PRATOS.filter((p) => ficha.cardapio!.includes(p.id))
      : [];
    const lista = doCardapio.length ? doCardapio : ficha.sobremesa ? PRATOS_DE_COMER : TODOS_OS_PRATOS;
    return lista[Math.floor(this.sorte() * lista.length)];
  }

  private naFila(): Cliente[] {
    return this.clientes.filter((c) => c.fase === 'na-porta');
  }

  // ------------------------------------------------------------- um cliente

  private viverUmCliente(c: Cliente, dt: number): void {
    c.bicho.update(dt);
    // QUEM VEIO JUNTO vai atrás da Luna enquanto ela anda (na fila, seguindo o
    // garçom e saindo); sentadas, cada uma fica na sua cadeira
    c.junto.forEach((b, i) => {
      b.update(dt);
      if (c.fase === 'na-porta' || c.fase === 'indo' || c.fase === 'saindo') {
        const lado = i === 0 ? -1 : 1;
        const x = c.bicho.x + lado * 0.55;
        const z = c.bicho.z + 0.45;
        if (Math.hypot(b.x - x, b.z - z) > 0.2) b.seguir(x, z, 1.9);
      }
    });

    switch (c.fase) {
      case 'na-porta': {
        // cada um anda até o seu lugar na fila; quem está na frente é quem sai
        const lugar = this.planta.fila[Math.min(this.naFila().indexOf(c), this.lugaresNaFila - 1)];
        if (Math.hypot(c.bicho.x - lugar.x, c.bicho.z - lugar.z) > 0.25) {
          c.bicho.seguir(lugar.x, lugar.z, 1.5);
        }
        c.balao.mostrar({ tipo: 'chegando' }, c.paciencia);
        this.drenar(c, dt, DRENO['na-porta'] * this.folgaDaFila);
        break;
      }
      case 'indo': {
        // seguindo o garçom pelo salão até ele escolher uma mesa
        const eu = this.g.playerPosition();
        c.bicho.seguir(eu.x - 0.7, eu.z - 0.7, 1.7);
        c.balao.mostrar({ tipo: 'chegando' }, c.paciencia);
        this.drenar(c, dt, DRENO['na-porta'] * this.folgaDaFila);
        break;
      }
      case 'sentando': {
        c.relogio -= dt;
        if (c.relogio <= 0 && c.mesa) {
          /**
           * ELE SENTA NA CADEIRA DE `+X/+Z`, e não em qualquer uma. A câmera
           * desenha na frente quem tem `x + z` maior: em qualquer das outras
           * três cadeiras o cliente fica ATRÁS do tampo, e um bicho de meio
           * metro atrás de uma mesa de 0,75 é um bicho invisível.
           */
          const assento = c.ficha.assento ?? { altura: 0.5, afasta: 0 };
          c.bicho.sentarEm(c.mesa.x + 0.55, c.mesa.z + 0.95 + assento.afasta, Math.PI, assento.altura);
          /*
           * A MESA GRANDE: a Sol na outra cadeira da frente, e a Estrella, a
           * mais alta, na de trás — atrás do tampo, olhando para a câmera. A de
           * trás é a de `+X`: a de `-X` fica na diagonal da câmera, bem atrás
           * do centro da mesa, e some.
           */
          const [segunda, terceira] = c.junto;
          segunda?.sentarEm(c.mesa.x - 0.55, c.mesa.z + 0.95, Math.PI, 0.5);
          terceira?.sentarEm(c.mesa.x + 0.55, c.mesa.z - 0.95, 0, 0.5);
          if (c.ficha.jaSabe) {
            this.paraPedir(c);
          } else {
            c.fase = 'lendo';
            c.relogio = LEITURA;
            c.balao.mostrar({ tipo: 'lendo' }, c.paciencia);
          }
        }
        break;
      }
      case 'lendo':
        // A FOLGA DO JOGO. Ler o cardápio não drena nada: esse tempo é do
        // cliente, e é a única janela em que dá para resolver outra coisa.
        c.relogio -= dt;
        c.balao.mostrar({ tipo: 'lendo' }, c.paciencia);
        if (c.relogio <= 0) this.paraPedir(c);
        break;
      case 'quer-pedir':
        this.drenar(c, dt, DRENO['quer-pedir']);
        c.balao.mostrar({ tipo: 'pedindo' }, c.paciencia);
        break;
      case 'esperando':
        this.drenar(c, dt, DRENO.esperando);
        c.balao.mostrar({ tipo: 'prato', prato: c.prato }, c.paciencia);
        break;
      case 'comendo':
        c.relogio -= dt;
        c.balao.mostrar({ tipo: 'comendo' }, c.paciencia);
        if (c.relogio <= 0) this.acabouDeComer(c);
        break;
      case 'quer-pagar':
        this.drenar(c, dt, DRENO['quer-pagar']);
        c.balao.mostrar({ tipo: 'conta' }, c.paciencia);
        break;
      case 'saindo':
        // o six seven do Gatito acontece em pé, antes de ele ir embora
        if (c.segura > 0) {
          c.segura -= dt;
          break;
        }
        c.bicho.seguir(this.planta.entrada.x, this.planta.entrada.z, 1.8);
        if (Math.hypot(c.bicho.x - this.planta.entrada.x, c.bicho.z - this.planta.entrada.z) < 0.6) {
          this.apagarCliente(c);
        }
        break;
    }
  }

  /**
   * A PACIÊNCIA CAI, e o Capy segura a queda das mesas vizinhas.
   *
   * `segundos` é quanto aquela fase leva para ir de cheia a zero. A `calma` da
   * ficha multiplica esse tempo — é ela que faz a Josefina praticamente não se
   * irritar e o Noel viver no vermelho.
   */
  /** a plaquinha de reserva: quem está na porta espera 30% mais */
  private get folgaDaFila(): number {
    return this.nivel('reserva') > 0 ? 1.3 : 1;
  }

  private drenar(c: Cliente, dt: number, segundos: number): void {
    // o rádio do salão: a paciência de todo mundo cai 10% mais devagar
    let calma = c.ficha.calma / (this.nivel('radio') > 0 ? 0.9 : 1);
    for (const outro of this.clientes) {
      if (outro === c || !outro.ficha.acalma || !outro.mesa || !c.mesa) continue;
      if (Math.hypot(outro.mesa.x - c.mesa.x, outro.mesa.z - c.mesa.z) < 5) {
        calma /= 1 - outro.ficha.acalma;
      }
    }
    // O PELUSA DEITADO NUMA MESA SUJA: as mesas em volta drenam em dobro
    const deitado = this.pelusa?.fase === 'deitado' && this.pelusa.alvo?.tipo === 'mesa' ? this.pelusa.alvo.mesa : null;
    if (deitado && c.mesa && Math.hypot(deitado.x - c.mesa.x, deitado.z - c.mesa.z) < RAIO_DO_PELUSA) calma /= 2;
    c.paciencia = Math.max(0, c.paciencia - dt / (segundos * calma));
    if (c.paciencia <= 0) this.desistir(c);
  }

  private paraPedir(c: Cliente): void {
    c.fase = 'quer-pedir';
    c.paciencia = 1;
    c.balao.mostrar({ tipo: 'pedindo' }, 1);
    this.g.som('prompt');
  }

  private acabouDeComer(c: Cliente): void {
    if (c.mesa) this.tirarOPrato(c.mesa);
    for (const prato of c.naMesa) this.apagar(prato);
    c.naMesa = [];
    c.sujou = true;
    // O MANO LEVANTA A MÃO DE NOVO: a sobremesa é um pedido inteiro, com
    // anotar e entregar, na mesma mesa — e só depois dela vem a conta
    const sobremesa = c.ficha.sobremesa && !c.naSobremesa ? pratoPorId(c.ficha.sobremesa) : null;
    if (sobremesa) {
      c.naSobremesa = true;
      c.prato = sobremesa;
      c.faltam = [sobremesa];
      if (c.mesa) c.mesa.floreira.visible = true;
      this.paraPedir(c);
      this.g.toast(`${c.ficha.nome} quer sobremesa!`, '🍨');
      return;
    }
    c.fase = 'quer-pagar';
    c.paciencia = 1;
    c.balao.mostrar({ tipo: 'conta' }, 1);
  }

  /** Ele cansou de esperar. Vai embora, e leva o dinheiro dele junto. */
  private desistir(c: Cliente): void {
    if (c.fase === 'saindo') return;
    this.g.toast(`${c.ficha.nome} foi embora`, '🩶');
    this.soltarAMesa(c);
    c.fase = 'saindo';
    c.balao.visivel = false;
    this.levantarTodos(c);
    // a comanda dele não vale mais nada: cozinhar para uma cadeira vazia é o
    // pior desperdício possível de um Walter que só faz um prato por vez
    this.comandas = this.comandas.filter((p) => p.para !== c);
    this.cozinhando = this.cozinhando.filter((p) => p.comanda.para !== c);
    this.recolherOPratoOrfao(c);
  }

  /**
   * O PRATO DE QUEM FOI EMBORA SOME — do balcão E de dentro da bandeja.
   *
   * Sem isto, um prato já pronto na hora em que o dono desiste vira um ÓRFÃO,
   * e órfão é veneno: ele ocupa uma das três vagas do balcão para sempre, e se
   * alguém o pegar ocupa uma das DUAS vagas da bandeja para sempre — nenhuma
   * mesa aceita (ninguém mais espera aquele prato) e a copa só recebia louça
   * suja. Dois órfãos e a bandeja fica inutilizável até o fim do turno: o
   * jogador vê pratos no balcão e o prompt de pegar simplesmente não acende.
   * Foi exatamente o que o Renan viu jogando.
   */
  private recolherOPratoOrfao(c: Cliente): void {
    for (const p of this.prontos.filter((p) => p.para === c)) this.apagar(p.malha);
    this.prontos = this.prontos.filter((p) => p.para !== c);
    for (const [quem, bandeja] of this.bandejas) {
      const fora = bandeja.filter((v) => v.tipo === 'prato' && v.para === c);
      if (!fora.length) continue;
      for (const v of fora) this.apagar(v.malha);
      this.bandejas.set(quem, bandeja.filter((v) => !(v.tipo === 'prato' && v.para === c)));
    }
    this.arrumarABandeja();
  }

  /**
   * A mesa dele deixa de ser dele — e fica SUJA se ele chegou a comer.
   *
   * É o que faz o salão engasgar: mesa suja não recebe ninguém, e recolher é o
   * trabalho que nunca é urgente e sempre é o mais caro de adiar.
   */
  private soltarAMesa(c: Cliente): void {
    // a mesa que ele fechou do lado abre de novo
    for (const [vizinha, b] of [...this.bloqueadas]) {
      if (b.por !== c) continue;
      this.apagar(b.cartao);
      vizinha.floreira.visible = true;
      this.bloqueadas.delete(vizinha);
    }
    // (o `?.` é do teste, que solta a mesa de um cliente de mentira)
    for (const prato of c.naMesa ?? []) this.apagar(prato);
    c.naMesa = [];
    if (!c.mesa) return;
    const mesa = c.mesa;
    this.ocupadas.delete(mesa);
    this.tirarOPrato(mesa);
    if (c.sujou) {
      const louca = loucaSuja(this.sorte());
      louca.position.set(mesa.x, 0.8, mesa.z);
      this.w.root.add(louca);
      this.sujeira.set(mesa, louca);
      mesa.floreira.visible = false;
    } else {
      mesa.floreira.visible = true;
    }
    c.mesa = null;
  }

  /**
   * O COOKIE FECHA A MESA DO LADO: a mais perto que esteja livre (nem
   * ocupada, nem suja, nem já reservada) ganha o cartão "Reservado pro
   * Cookie" e não recebe ninguém até ele ir embora. Sem mesa livre, ele senta
   * sem fechar nada — o salão cheio já pagou o preço dele.
   */
  private fecharAVizinha(mesa: MesaDoTurno, c: Cliente): void {
    let melhor: MesaDoTurno | null = null;
    let perto = Infinity;
    for (const outra of this.mesas) {
      if (outra === mesa || this.ocupadas.has(outra) || this.sujeira.has(outra) || this.bloqueadas.has(outra)) continue;
      const d = Math.hypot(outra.x - mesa.x, outra.z - mesa.z);
      if (d < perto) {
        perto = d;
        melhor = outra;
      }
    }
    if (!melhor) return;
    const cartao = reservadoNaMesa();
    cartao.position.set(melhor.x, 0.815, melhor.z);
    cartao.rotation.y = Math.PI / 4;
    this.w.root.add(cartao);
    melhor.floreira.visible = false;
    this.bloqueadas.set(melhor, { por: c, cartao });
  }

  /** ele (e quem veio junto) sai da cadeira, de volta ao chão */
  private levantarTodos(c: Cliente): void {
    for (const b of [c.bicho, ...c.junto]) {
      b.levantar();
      b.group.position.y = 0;
    }
  }

  private apagarCliente(c: Cliente): void {
    c.balao.descartar();
    this.w.root.remove(c.bicho.group);
    this.apagar(c.bicho.group);
    for (const b of c.junto) this.apagar(b.group);
    this.clientes = this.clientes.filter((o) => o !== c);
    if (this.guiado === c) this.guiado = null;
  }

  // ---------------------------------------------------------------- o Pelusa

  /**
   * O PELUSA, O AGENTE DO CAOS (turno 6). Ele não é cliente: entra nas horas
   * da escala (`turno.pelusa`) e vai atrás, nesta ordem, de
   *
   * 1. um PRATO PARADO no balcão há mais de `PRATO_PARADO` segundos;
   * 2. um prato na BANDEJA LARGADA — a de quem não está no comando agora;
   * 3. uma MESA SUJA: ele sobe e deita em pãozinho. Ela não pode ser
   *    recolhida com ele ali, e as mesas em volta drenam em dobro.
   *
   * Prato roubado volta para a cozinha (o Walter refaz, e a mesa espera de
   * novo). "Psiu, Pelusa!" espanta, e custa só a viagem até ele: ele sai
   * trotando de rabo em pé. É a punição pelo vício de deixar as coisas paradas.
   */
  private viverOPelusa(dt: number): void {
    const vezes = this.turno.pelusa ?? [];
    const decorrido = this.turno.duracao - this.tempo;
    while (this.proximoPelusa < vezes.length && vezes[this.proximoPelusa] <= decorrido) {
      this.proximoPelusa += 1;
      if (!this.pelusa && this.tempo > 0) this.soltarOPelusa();
    }
    const p = this.pelusa;
    this.pontoDoPelusa.enabled = !!p && p.fase !== 'fugindo';
    if (!p) return;
    p.bicho.update(dt);
    this.pontoDoPelusa.moveTo(p.bicho.x, p.bicho.z);
    // o pulinho de subir no balcão (ou na bandeja de alguém)
    if (p.pulo > 0) {
      p.pulo = Math.max(0, p.pulo - dt);
      p.bicho.group.position.y = Math.sin((1 - p.pulo / 0.6) * Math.PI) * 0.45;
    }
    switch (p.fase) {
      case 'procurando':
        p.alvo = this.alvoDoPelusa();
        if (p.alvo) p.fase = 'indo';
        break;
      case 'indo': {
        if (!this.alvoAindaVale(p.alvo)) {
          p.alvo = null;
          p.fase = 'procurando';
          break;
        }
        const onde = this.ondeOPelusaVai(p.alvo!);
        if (Math.hypot(p.bicho.x - onde.x, p.bicho.z - onde.z) > 0.35) {
          p.bicho.seguir(onde.x, onde.z, 1.6);
          break;
        }
        this.pelusaChegou(p);
        break;
      }
      case 'deitado':
        break;
      case 'fugindo': {
        const { x, z } = this.planta.entrada;
        if (p.pulo <= 0) p.bicho.seguir(x, z, 2.2);
        if (Math.hypot(p.bicho.x - x, p.bicho.z - z) < 0.6) this.tirarOPelusa();
        break;
      }
    }
  }

  private soltarOPelusa(): void {
    const bicho = new Pelusa({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 });
    bicho.entrarEmServico();
    bicho.group.position.set(this.planta.entrada.x, 0, this.planta.entrada.z);
    this.w.root.add(bicho.group);
    this.pelusa = { bicho, fase: 'procurando', alvo: null, naBoca: null, pulo: 0 };
    this.g.som('miado');
    this.g.toast('O Pelusa entrou no salão!', '😼');
  }

  /** o que o Pelusa quer agora — ou nada, e ele fica rondando a porta */
  private alvoDoPelusa(): PelusaNoSalao['alvo'] {
    const parado = this.prontos
      .filter((pr) => pr.idade >= PRATO_PARADO && (pr.malha as THREE.Object3D).isObject3D)
      .sort((a, b) => b.idade - a.idade)[0];
    if (parado) return { tipo: 'balcao', pronto: parado };
    const largado = this.g.companionId();
    if ((this.bandejas.get(largado) ?? []).some((v) => v.tipo === 'prato')) return { tipo: 'bandeja', quem: largado };
    let melhor: MesaDoTurno | null = null;
    let perto = Infinity;
    const p = this.pelusa!;
    for (const mesa of this.sujeira.keys()) {
      const d = Math.hypot(mesa.x - p.bicho.x, mesa.z - p.bicho.z);
      if (d < perto) {
        perto = d;
        melhor = mesa;
      }
    }
    return melhor ? { tipo: 'mesa', mesa: melhor } : null;
  }

  private alvoAindaVale(alvo: PelusaNoSalao['alvo']): boolean {
    if (!alvo) return false;
    if (alvo.tipo === 'balcao') return this.prontos.includes(alvo.pronto);
    if (alvo.tipo === 'bandeja') {
      return alvo.quem === this.g.companionId() && (this.bandejas.get(alvo.quem) ?? []).some((v) => v.tipo === 'prato');
    }
    return this.sujeira.has(alvo.mesa);
  }

  private ondeOPelusaVai(alvo: NonNullable<PelusaNoSalao['alvo']>): { x: number; z: number } {
    if (alvo.tipo === 'balcao') return this.planta.balcao;
    if (alvo.tipo === 'bandeja') {
      const p = this.g.companionPosition();
      return { x: p.x + 0.35, z: p.z + 0.35 };
    }
    return { x: alvo.mesa.x + 0.2, z: alvo.mesa.z + 0.75 };
  }

  private pelusaChegou(p: PelusaNoSalao): void {
    const alvo = p.alvo!;
    if (alvo.tipo === 'mesa') {
      // ele sobe e deita em pãozinho do lado da louça, de frente para o salão
      p.bicho.sentarEm(alvo.mesa.x + 0.34, alvo.mesa.z + 0.26, Math.PI / 4, 0.79);
      p.bicho.deitar(true);
      p.fase = 'deitado';
      this.g.som('miado');
      this.g.toast('O Pelusa deitou na mesa suja', '😼');
      return;
    }
    // O ROUBO: o prato some do balcão (ou da bandeja largada) e vai na boca dele
    let roubado: { prato: PratoDoCardapio; para: Cliente; malha: THREE.Object3D } | null = null;
    if (alvo.tipo === 'balcao') {
      roubado = alvo.pronto;
      this.prontos = this.prontos.filter((pr) => pr !== alvo.pronto);
    } else {
      const bandeja = this.bandejas.get(alvo.quem) ?? [];
      const i = bandeja.findIndex((v) => v.tipo === 'prato');
      if (i >= 0) {
        roubado = bandeja[i] as Extract<Vaga, { tipo: 'prato' }>;
        bandeja.splice(i, 1);
        this.arrumarABandeja();
      }
    }
    if (!roubado) {
      p.fase = 'procurando';
      return;
    }
    // a mesa que esperava aquele prato espera de novo: a comanda volta para a
    // FRENTE da fila da cozinha, e o Walter refaz
    if (roubado.para?.fase === 'esperando') this.comandas.unshift({ para: roubado.para, prato: roubado.prato });
    const boca = roubado.malha;
    boca.getObjectByName('vapor')?.removeFromParent();
    p.bicho.group.add(boca);
    boca.position.set(0, 0.25, 0.3);
    boca.rotation.set(0.3, 0, 0);
    boca.scale.setScalar(0.38);
    boca.visible = true;
    p.naBoca = boca;
    p.pulo = 0.6;
    p.fase = 'fugindo';
    this.g.som('miado');
    this.g.toast(`O Pelusa roubou ${roubado.prato.nome}! O Walter vai refazer`, '😼');
  }

  /** "Psiu, Pelusa!": ele desce da mesa (se estava nela) e sai trotando */
  private espantarOPelusa(): void {
    const p = this.pelusa;
    if (!p || p.fase === 'fugindo') return;
    if (p.fase === 'deitado') {
      p.bicho.deitar(false);
      p.bicho.levantar();
      p.bicho.group.position.y = 0;
    }
    p.fase = 'fugindo';
    p.alvo = null;
    this.g.som('miado');
    this.g.toast('Psiu! Lá vai ele, de rabo em pé', '🐈');
  }

  private tirarOPelusa(): void {
    const p = this.pelusa;
    if (!p) return;
    this.apagar(p.bicho.group);
    this.pelusa = null;
    this.pontoDoPelusa.enabled = false;
  }

  /** o Pelusa está deitado nesta mesa */
  private pelusaNa(mesa: MesaDoTurno): boolean {
    return this.pelusa?.fase === 'deitado' && this.pelusa.alvo?.tipo === 'mesa' && this.pelusa.alvo.mesa === mesa;
  }

  // --------------------------------------------------------------- a cozinha

  /**
   * A CHAPA DO WALTER: um prato de cada vez (7 s), 5 s com a chapa nova, e
   * DOIS de cada vez com a chapa dupla — cada um no seu relógio.
   */
  private cozinhar(dt: number): void {
    const vagas = this.nivel('chapa') >= 2 ? 2 : 1;
    for (const c of [...this.cozinhando]) {
      c.falta -= dt;
      if (c.falta > 0) continue;
      this.cozinhando = this.cozinhando.filter((x) => x !== c);
      this.servirDaChapa(c.comanda);
    }
    while (this.cozinhando.length < vagas) {
      const proxima = this.comandas.shift();
      if (!proxima) return;
      const daChapa = this.nivel('chapa') >= 1 ? COZINHA_NA_CHAPA_NOVA : COZINHA;
      this.cozinhando.push({ comanda: proxima, falta: Math.min(daChapa, proxima.para.ficha.preparo ?? daChapa) });
    }
  }

  private servirDaChapa(comanda: Comanda): void {
    const dono = comanda.para;
    // o cliente pode ter ido embora enquanto o prato ficava pronto
    if (dono.fase !== 'esperando') return;
    const vaga = this.vagaLivreNoBalcao();
    if (vaga < 0) {
      // balcão cheio TRAVA a cozinha: o prato não sai porque ninguém buscou.
      // A comanda volta para a frente da fila em vez de sumir.
      this.comandas.unshift(comanda);
      return;
    }
    const malha = pratoServido(comanda.prato.id);
    if (!malha) return;
    const onde = this.planta.saidas[vaga];
    malha.position.set(onde.x, this.planta.tampo, onde.z);
    this.w.root.add(malha);
    malha.userData.calor = 1;
    if (this.esfria) malha.add(vaporDePrato());
    this.prontos.push({ prato: comanda.prato, para: dono, malha, vaga, idade: 0 });
    this.g.som('sino');
    // ele encosta na janela para entregar e volta para a cozinha
    void this.walter.irPara(this.planta.janela.x, this.planta.janela.z, 2.6)
      .then(() => this.walter.irPara(this.planta.cozinha.x, this.planta.cozinha.z, 2.2));
  }

  private vagaLivreNoBalcao(): number {
    for (let i = 0; i < SAIDAS; i++) {
      if (!this.prontos.some((p) => p.vaga === i)) return i;
    }
    return -1;
  }

  // --------------------------------------------------------------- a bandeja

  private minhaBandeja(): Vaga[] {
    const quem = this.g.playerId();
    let b = this.bandejas.get(quem);
    if (!b) {
      b = [];
      this.bandejas.set(quem, b);
    }
    return b;
  }

  // ---------------------------------------------------------------- as ações

  private levarAMesa(): void {
    const fila = this.naFila();
    if (!fila.length || this.guiado) return;
    const c = fila[0];
    c.fase = 'indo';
    this.guiado = c;
    this.g.som('confirma');
    this.g.toast(`${c.ficha.nome} está te seguindo`, '🚶');
  }

  private naMesa(mesa: MesaDoTurno): void {
    const c = this.ocupadas.get(mesa);

    if (this.bloqueadas.has(mesa)) {
      this.g.toast(`Reservada pro ${this.bloqueadas.get(mesa)!.por.ficha.nome}`, '🐘');
      return;
    }

    // 1. sentar quem está sendo levado
    if (!c && this.guiado && !this.sujeira.has(mesa)) {
      const convidado = this.guiado;
      this.guiado = null;
      convidado.mesa = mesa;
      convidado.fase = 'sentando';
      convidado.relogio = 0.1;
      convidado.paciencia = 1;
      this.ocupadas.set(mesa, convidado);
      if (convidado.ficha.ocupaVizinha) this.fecharAVizinha(mesa, convidado);
      this.g.som('sentar');
      void this.g.say([convidado.ficha.fala], convidado.ficha.nome);
      return;
    }

    // 2. recolher a louça — menos com o Pelusa deitado nela
    if (!c && this.sujeira.has(mesa) && this.pelusaNa(mesa)) {
      this.g.toast('O Pelusa está deitado aí — psiu nele primeiro', '😼');
      return;
    }
    if (!c && this.sujeira.has(mesa)) {
      const bandeja = this.minhaBandeja();
      if (bandeja.length >= this.capacidade) {
        this.g.toast('Bandeja cheia — larga a louça na copa', '🖐');
        return;
      }
      const louca = this.sujeira.get(mesa)!;
      this.sujeira.delete(mesa);
      bandeja.push({ tipo: 'louca', malha: louca });
      this.arrumarABandeja();
      mesa.floreira.visible = true;
      this.g.som('pegar');
      return;
    }
    if (!c) return;

    // 3. anotar o pedido — e a Josefina cobra por isso
    if (c.fase === 'quer-pedir') {
      void this.anotar(c);
      return;
    }

    // 4. entregar o prato dele, se estiver na bandeja
    if (c.fase === 'esperando') {
      const bandeja = this.minhaBandeja();
      const i = bandeja.findIndex((v) => v.tipo === 'prato' && v.para === c);
      if (i < 0) {
        this.g.toast(`${c.ficha.nome} pediu ${c.prato.nome}`, '🍽️');
        return;
      }
      const vaga = bandeja[i] as Extract<Vaga, { tipo: 'prato' }>;
      bandeja.splice(i, 1);
      // um dos pratos que a mesa esperava (na mesa grande são três)
      const qual = c.faltam.findIndex((p) => p.id === vaga.prato.id);
      c.faltam.splice(qual >= 0 ? qual : 0, 1);
      if (c.mesa) {
        c.mesa.floreira.visible = false;
        // da bandeja para a mesa: volta para o mundo, no tamanho de mesa —
        // na mesa grande, cada prato na frente da cadeira de quem pediu
        this.w.root.add(vaga.malha);
        vaga.malha.scale.setScalar(1);
        vaga.malha.rotation.set(0, 0, 0);
        vaga.malha.visible = true;
        const lugar = c.junto.length ? LUGARES_DA_MESA_GRANDE[c.naMesa.length] ?? [0, 0] : [0, 0];
        vaga.malha.position.set(c.mesa.x + lugar[0], 0.82, c.mesa.z + lugar[1]);
      }
      c.naMesa.push(vaga.malha);
      c.gasto += valor(vaga.prato);
      this.arrumarABandeja();
      this.g.som('sorvete');
      // A TORCIDA DO FLYNN: todo prato entregue, em qualquer mesa
      this.torcer();
      if (c.faltam.length) {
        // A MESA GRANDE AINDA ESPERA AS IRMÃS: o prato fica ali, esfriando
        c.prato = c.faltam[0];
        c.paciencia = Math.min(1, c.paciencia + 0.15);
        this.g.toast(`Faltam ${c.faltam.length} na mesa de ${c.ficha.nome}`, '🍽️');
        return;
      }
      // o prato chegou quente ou frio? Na mesa grande, só é quente se TODOS
      // ainda estão (sem a regra de esfriar, sempre quente)
      c.quente = c.naMesa.every((m) => this.calorDe(m) > 0);
      for (const m of c.naMesa) m.getObjectByName?.('vapor')?.removeFromParent();
      c.fase = 'comendo';
      c.relogio = c.ficha.refeicao ?? REFEICAO;
      if (c.naSobremesa) c.ficha.festejar?.(c.bicho);
      // a mesa grande comemora junta quando o último prato chega
      if (c.junto.length) {
        for (const b of [c.bicho, ...c.junto]) c.ficha.comemorar?.(b);
        this.g.toast(`${c.ficha.nome}: "Agora sim, todo mundo junto!"`, '🐰');
      }
      if (c.ficha.exigeQuente && !c.junto.length) {
        if (c.quente) {
          c.ficha.comemorar?.(c.bicho);
          this.g.toast(`${c.ficha.nome}: "Magnifique!"`, '🦆');
        } else {
          this.g.toast(`${c.ficha.nome}: "Está frio…"`, '🥶');
        }
      } else if (c.quente === false) {
        this.g.toast(`${c.prato.nome} chegou frio`, '🥶');
      }
      // O BISCOITINHO DA ESTELLA: quem entregou anda mais rápido por 20 s
      if (c.ficha.biscoito) {
        c.ficha.biscoito(c.bicho);
        this.biscoitos.set(this.g.playerId(), BISCOITO);
        this.g.toast('Biscoitinho da Estella — 20 s mais rápido', '🍪');
      }
      return;
    }

    // 5. receber a conta
    if (c.fase === 'quer-pagar') {
      let bom = c.paciencia > 0.6 ? 1.5 : c.paciencia > 0.25 ? 1 : 0.5;
      // PRATO FRIO NÃO DÁ CORAÇÃO DOURADO — e o Jean-Luc paga com o apagado
      if (c.quente === false) bom = c.ficha.exigeQuente ? 0.5 : Math.min(bom, 1);
      const gorjeta = (c.ficha.gorjeta ? 2 : 1)
        * (c.ficha.exigeQuente && c.quente ? 2 : 1)
        * (c.ficha.repara && c.reparou ? 2 : 1);
      // paga TUDO o que comeu: o prato, e a sobremesa de quem pediu
      const pago = Math.round(c.gasto * bom * gorjeta);
      this.dinheiro += pago;
      /**
       * O DINHEIRO CAI NA CARTEIRA NA HORA, e não no fim do turno.
       *
       * `this.dinheiro` é o caixa DO DIA — é dele que saem as estrelas e a
       * conta no fim. A carteira é outra coisa: é o saldo do casal, que
       * atravessa turnos e cenários e um dia vai pagar as compras. Somar os
       * dois no fim faria o jogador perder tudo se saísse no meio do turno.
       */
      this.g.ganhar(pago);
      if (bom === 1.5) this.coracoes += 1;
      this.g.som('caixa');
      this.g.toast(`+ R$ ${pago}`, bom === 1.5 ? '💛' : bom === 1 ? '🤍' : '🩶');
      this.soltarAMesa(c);
      c.fase = 'saindo';
      c.balao.visivel = false;
      this.levantarTodos(c);
      // O SIX SEVEN DO GATITO: ele faz o gesto na saída, e o salão inteiro ri
      if (c.ficha.sixSeven) {
        c.ficha.sixSeven(c.bicho);
        c.segura = 1.8;
        for (const outro of this.clientes) {
          if (outro === c || outro.fase === 'saindo') continue;
          outro.paciencia = Math.min(1, outro.paciencia + SIX_SEVEN);
        }
        this.g.toast('Six seven! O salão inteiro riu', '🐱');
      }
    }
  }

  /**
   * A TORCIDA DO FLYNN: a cada prato entregue no salão, todo Flynn sentado
   * comemora, e as mesas perto dele recuperam um pouco de paciência (ele
   * também). É o que faz valer sentar o Flynn no meio do salão.
   */
  private torcer(): void {
    for (const f of this.clientes) {
      if (!f.ficha.torce || !f.mesa || f.fase === 'saindo' || f.fase === 'sentando') continue;
      f.ficha.torce(f.bicho);
      for (const outro of this.clientes) {
        if (!outro.mesa || outro.fase === 'saindo') continue;
        if (Math.hypot(outro.mesa.x - f.mesa.x, outro.mesa.z - f.mesa.z) < RAIO_DA_TORCIDA) {
          outro.paciencia = Math.min(1, outro.paciencia + TORCIDA);
        }
      }
    }
  }

  /**
   * Anotar TRAVA o garçom, e é essa a graça.
   *
   * É a única ação do turno que custa tempo em vez de passos, e é onde o traço
   * da Josefina vive: 3,2 s parado enquanto o resto do salão continua drenando.
   * Anotar o pedido dela no meio do aperto é um erro; anotar na folga é grátis.
   */
  private async anotar(c: Cliente): Promise<void> {
    this.g.lockPlayer(true);
    this.g.som('escolha');
    this.g.toast(`${c.prato.nome}`, '📝');
    /**
     * O BLOQUINHO DE COMANDAS (a melhoria): anotar leva metade do tempo, e ele
     * aparece na mão de quem anota — no lugar da bandeja, só enquanto anota.
     */
    const comBloquinho = this.nivel('bloquinho') > 0;
    const quem = this.g.playerId();
    if (comBloquinho) {
      this.anotando = quem;
      this.g.segurarNaCena(quem, bloquinhoDeComandas(), 'upright');
    }
    // A ESTELLA REPARA NO UNIFORME de quem anota: uma peça do Mania vestida
    // (a gravatinha, o avental, o colete…) e ela dá gorjeta dobrada
    if (c.ficha.repara && this.g.wearables(quem).some((p) => p !== null && ehPecaDoMania(p.id))) {
      c.reparou = true;
      this.g.toast(`${c.ficha.nome} reparou no uniforme — gorjeta dobrada`, '👀');
    }
    await this.g.wait(c.ficha.anotar * (comBloquinho ? 0.5 : 1));
    if (comBloquinho && this.anotando === quem) {
      this.anotando = null;
      const bandeja = this.bandejasNaMao.get(quem);
      if (bandeja && this.rodando) this.g.segurarNaCena(quem, bandeja, 'upright');
    }
    this.g.lockPlayer(false);
    if (c.fase !== 'quer-pedir') return;      // ele desistiu enquanto eu anotava
    c.fase = 'esperando';
    c.paciencia = 1;
    // uma comanda por prato: a mesa grande manda três para a cozinha
    for (const prato of c.faltam) this.comandas.push({ para: c, prato });
    this.g.som('confirma');
  }

  private pegarOPrato(): void {
    const bandeja = this.minhaBandeja();
    if (bandeja.length >= this.capacidade) {
      this.g.toast('Bandeja cheia — larga a louça na copa', '🖐');
      return;
    }
    const pronto = this.prontos.shift();
    if (!pronto) return;
    bandeja.push({ tipo: 'prato', prato: pronto.prato, malha: pronto.malha, para: pronto.para });
    this.arrumarABandeja();
    this.g.som('pegar');
  }

  /**
   * A COPA ACEITA TUDO O QUE NÃO SERVE MAIS: a louça suja, e também qualquer
   * prato cujo dono já foi embora.
   *
   * O prato órfão não deveria nem chegar aqui — `recolherOPratoOrfao` o tira da
   * bandeja no instante em que o cliente desiste. Isto é a rede embaixo: se um
   * dia sobrar um jeito de a bandeja guardar um prato sem dono, a copa desatola,
   * em vez de a bandeja ficar travada até o fim do turno.
   */
  private largarALouca(onde: 'copa' | 'carrinho' = 'copa'): void {
    const bandeja = this.minhaBandeja();
    const inutil = (v: Vaga): boolean =>
      v.tipo === 'louca' || !this.clientes.includes(v.para);
    const sujas = bandeja.filter(inutil);
    if (!sujas.length) return;
    for (const v of sujas) this.apagar(v.malha);
    this.bandejas.set(this.g.playerId(), bandeja.filter((v) => !inutil(v)));
    this.arrumarABandeja();

    // a pilha cresce na copa (ou em cima do carrinho): é o placar visível de
    // um trabalho que ninguém aplaude, e some no fim do turno
    const carrinho = onde === 'carrinho' ? this.planta.carrinho : undefined;
    const pilhas = carrinho ? this.pilhaNoCarrinho : this.pilhaDeLouca;
    const lugares = carrinho ? carrinho.pilha : this.planta.pilha;
    const altura = carrinho ? carrinho.tampo : this.planta.tampo;
    for (let i = 0; i < sujas.length && pilhas.length < lugares.length; i++) {
      const lugar = lugares[pilhas.length];
      const pilha = loucaSuja(this.sorte());
      pilha.position.set(lugar.x, altura, lugar.z);
      if (carrinho) pilha.scale.setScalar(0.7);
      this.w.root.add(pilha);
      pilhas.push(pilha);
    }
    this.g.som('louca');
  }

  /**
   * O QUE ESTÁ NA BANDEJA APARECE NA BANDEJA: cada prato (e cada pilha de
   * louça) pousa numa vaga do grupo `carga` da bandeja da mão de quem carrega,
   * no tamanho de bandeja. Refeito a cada mudança, nas duas bandejas.
   */
  private arrumarABandeja(): void {
    for (const [quem, vagas] of this.bandejas) {
      const bandeja = this.bandejasNaMao.get(quem);
      const carga = bandeja?.userData.carga as THREE.Object3D | undefined;
      const lugares = (bandeja?.userData.vagas ?? []) as ReadonlyArray<readonly [number, number]>;
      vagas.forEach((v, i) => {
        // o teste injeta vagas de mentira (sem malha de verdade): essas ficam de fora
        if (!(v.malha as THREE.Object3D)?.isObject3D) return;
        if (!carga) {
          v.malha.visible = false;
          return;
        }
        const [x, z] = lugares[Math.min(i, lugares.length - 1)] ?? [0, 0];
        carga.add(v.malha);
        v.malha.position.set(x, 0, z);
        v.malha.rotation.set(0, i * 0.7, 0);
        v.malha.scale.setScalar(ESCALA_NA_BANDEJA);
        v.malha.visible = true;
      });
    }
  }

  // ------------------------------------------------------ os rótulos do HUD

  /**
   * O QUE CADA PONTO QUER DIZER AGORA.
   *
   * Um ponto por mesa com o rótulo trocando, e não cinco pontos empilhados: a
   * mesa é o mesmo lugar do salão, e o que muda é o que ela está pedindo de
   * você. É por isso que `Interactable.label` deixou de ser `readonly`.
   */
  private arrumarOsPontos(): void {
    const bandeja = this.minhaBandeja();
    const fila = this.naFila();

    this.pontoDaRecepcao.enabled = fila.length > 0 && !this.guiado;

    /**
     * O PONTO CONTINUA ACESO COM A BANDEJA CHEIA, e o rótulo diz por quê.
     *
     * Desligado, o jogo ficava MUDO na hora em que mais precisava falar: o
     * prato estava ali no balcão, o prompt não acendia, e não havia nada na
     * tela explicando que o problema eram as duas mãos ocupadas. Prompt que
     * some é a pior forma de dizer "não dá".
     */
    const cheia = bandeja.length >= this.capacidade;
    this.pontoDoBalcao.enabled = this.prontos.length > 0;
    this.pontoDoBalcao.label = !this.prontos.length
      ? 'Pegar o prato'
      : cheia ? 'Bandeja cheia — larga a louça na copa' : `Pegar ${this.prontos[0].prato.nome}`;
    this.pontoDoBalcao.icon = cheia ? '🖐' : '🍽️';

    const temLouca = bandeja.some((v) => v.tipo === 'louca' || !this.clientes.includes(v.para));
    this.pontoDaCopa.enabled = temLouca;
    if (this.pontoDoCarrinho) this.pontoDoCarrinho.enabled = temLouca && this.nivel('carrinho') > 0;

    for (let i = 0; i < this.mesas.length; i++) {
      const mesa = this.mesas[i];
      const ponto = this.pontoDaMesa[i];
      const c = this.ocupadas.get(mesa);
      if (this.bloqueadas.has(mesa) || this.pelusaNa(mesa)) {
        // a mesa do Pelusa fala pelo ponto dele ("Psiu, Pelusa!")
        ponto.enabled = false;
      } else if (!c && this.guiado && !this.sujeira.has(mesa)) {
        ponto.enabled = true;
        ponto.label = 'Sentar aqui';
        ponto.icon = '🪑';
      } else if (!c && this.sujeira.has(mesa)) {
        // pelo mesmo motivo do balcão: com a bandeja cheia o ponto continua
        // aceso e diz o que falta fazer, em vez de sumir sem explicação
        ponto.enabled = true;
        ponto.label = cheia ? 'Bandeja cheia — larga a louça na copa' : 'Recolher a louça';
        ponto.icon = cheia ? '🖐' : '🧽';
      } else if (c?.fase === 'quer-pedir') {
        ponto.enabled = true;
        ponto.label = 'Anotar o pedido';
        ponto.icon = '📝';
      } else if (c?.fase === 'esperando') {
        // o rótulo diz o prato que está NA BANDEJA (na mesa grande, um dos três)
        const tem = bandeja.find((v): v is Extract<Vaga, { tipo: 'prato' }> => v.tipo === 'prato' && v.para === c);
        ponto.enabled = true;
        ponto.label = tem ? `Entregar ${tem.prato.nome}` : `Ver o que a mesa pediu`;
        ponto.icon = tem ? '🍽️' : '👀';
      } else if (c?.fase === 'quer-pagar') {
        ponto.enabled = true;
        ponto.label = 'Receber a conta';
        ponto.icon = '💰';
      } else {
        ponto.enabled = false;
      }
    }
  }

  // ------------------------------------------------------------------ limpeza

  private tirarOPrato(mesa: MesaDoTurno): void {
    for (const filho of [...this.w.root.children]) {
      if (filho.userData?.prato && Math.hypot(filho.position.x - mesa.x, filho.position.z - mesa.z) < 0.4) {
        this.apagar(filho);
      }
    }
  }

  private apagar(obj: THREE.Object3D): void {
    obj.parent?.remove(obj);
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry.dispose();
    });
  }
}
