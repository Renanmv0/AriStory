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
import { CARDAPIO, type PratoDoCardapio } from '../world/cardapioData';
import { loucaSuja, pratoServido } from '../world/props';
import { BalaoDeCliente } from './balaoDeCliente';

/**
 * O TURNO NO MANIA DE CHURRASCO — o minigame de servir as mesas.
 *
 * O plano inteiro está em `docs/MINIGAME-RESTAURANTE.md`. Esta é a etapa 2: o
 * laço completo rodando com quatro clientes, paciência e o painel na tela.
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

/** quanto dura um turno, em segundos */
const DURACAO = 165;
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
/** o Walter leva isto por prato, um de cada vez */
const COZINHA = 7;
/** vagas na bandeja de CADA personagem — prato limpo e louça suja disputam */
const BANDEJA = 2;
/** vagas de prato pronto no balcão */
const SAIDAS = 3;

const TODOS_OS_PRATOS: readonly PratoDoCardapio[] = CARDAPIO.flatMap((s) => s.pratos);

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
];

/**
 * A ESCALA DE CHEGADA, fixa e não sorteada.
 *
 * Um turno igual toda vez é o que deixa o jogador APRENDER o turno — é o mesmo
 * princípio de uma fase de plataforma. E é o que deixa o teste medir alguma
 * coisa: com chegada aleatória, `scripts/turno.mjs` não teria o que afirmar.
 */
const CHEGADAS: readonly { aos: number; ficha: string }[] = [
  { aos: 3, ficha: 'josefina' },
  { aos: 15, ficha: 'capy' },
  { aos: 27, ficha: 'noel' },
  { aos: 40, ficha: 'gina' },
  { aos: 54, ficha: 'josefina' },
  { aos: 68, ficha: 'noel' },
  { aos: 83, ficha: 'capy' },
  { aos: 99, ficha: 'gina' },
  { aos: 116, ficha: 'noel' },
  { aos: 132, ficha: 'capy' },
];

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
  /** os três lugares da fila, o primeiro é a frente */
  fila: readonly { x: number; z: number }[];
  /** o ponto de interação de "levar à mesa" */
  recepcao: { x: number; z: number };
  /** as vagas de prato pronto em cima do balcão */
  saidas: readonly { x: number; z: number }[];
  /** o ponto de interação de pegar o prato */
  balcao: { x: number; z: number };
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
}

type Vaga =
  | { tipo: 'prato'; prato: PratoDoCardapio; malha: THREE.Object3D; para: Cliente }
  | { tipo: 'louca'; malha: THREE.Object3D };

interface PratoPronto {
  prato: PratoDoCardapio;
  para: Cliente;
  malha: THREE.Object3D;
  vaga: number;
}

// ------------------------------------------------------------------ o turno

export class TurnoDoMania {
  /** o turno está rodando */
  rodando = false;

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
  private comandas: Cliente[] = [];
  private cozinhando: Cliente | null = null;
  private ateSair = 0;
  private prontos: PratoPronto[] = [];
  private pilhaDeLouca: THREE.Object3D[] = [];
  private semente = 20260906;
  /** o que estava aceso antes do turno, para voltar a acender no fim */
  private suspensas: Interactable[] = [];

  private readonly pontoDaRecepcao: Interactable;
  private readonly pontoDaMesa: Interactable[];
  private readonly pontoDoBalcao: Interactable;
  private readonly pontoDaCopa: Interactable;

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
    this.pontoDaMesa = mesas.map((mesa, i) => w.interact({
      id: `turno:mesa-${i}`,
      x: mesa.x, z: mesa.z + 1.4, radius: 1.6,
      label: 'Sentar aqui', icon: '🪑',
      priority: 4,
      onInteract: () => this.naMesa(mesa),
    }));
    for (const p of [this.pontoDaRecepcao, this.pontoDoBalcao, this.pontoDaCopa, ...this.pontoDaMesa]) {
      p.enabled = false;
    }
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

  async comecar(): Promise<void> {
    if (this.rodando) return;
    this.rodando = true;
    this.tempo = DURACAO;
    this.dinheiro = 0;
    this.coracoes = 0;
    this.proximaChegada = 0;
    this.bandejas.clear();
    this.g.setZoom(11.5);
    this.g.som('sino');
    this.g.toast('O turno começou', '⏱');

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

    // o Walter vai para a cozinha e fica lá: durante o turno ele é a cozinha
    this.walter.entrarEmServico();
    void this.walter.irPara(this.planta.cozinha.x, this.planta.cozinha.z, 2.4);
  }

  private async terminar(): Promise<void> {
    this.rodando = false;
    for (const p of [this.pontoDaRecepcao, this.pontoDoBalcao, this.pontoDaCopa, ...this.pontoDaMesa]) {
      p.enabled = false;
    }
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

    const estrelas = this.dinheiro >= 220 ? 3 : this.dinheiro >= 140 ? 2 : 1;
    this.g.toast(`R$ ${this.dinheiro} · ${'⭐'.repeat(estrelas)}`, '📋');
  }

  /** o fim do turno é público para a cena poder contar o dia depois */
  get conta(): { dinheiro: number; coracoes: number; estrelas: number } {
    const estrelas = this.dinheiro >= 220 ? 3 : this.dinheiro >= 140 ? 2 : 1;
    return { dinheiro: this.dinheiro, coracoes: this.coracoes, estrelas };
  }

  aoAcabar: (() => void) | null = null;

  // -------------------------------------------------------------- o relógio

  atualizar(dt: number): void {
    if (!this.rodando) return;
    this.tempo = Math.max(0, this.tempo - dt);

    this.chegadas();
    this.cozinhar(dt);
    for (const c of [...this.clientes]) this.viverUmCliente(c, dt);
    this.arrumarOsPontos();

    this.g.showTurno({
      tempo: this.tempo,
      dinheiro: this.dinheiro,
      coracoes: this.coracoes,
      bandeja: this.minhaBandeja().map((v) => v.tipo === 'prato'
        ? { icone: '🍽️', titulo: v.prato.nome }
        : { icone: '🧽', titulo: 'Louça suja' }),
    });

    // O TURNO SÓ ACABA COM O SALÃO VAZIO. Quando o relógio zera ninguém novo
    // entra, mas quem está dentro tem que ser servido — é o que transforma um
    // corte seco num fim com respiração.
    if (this.tempo <= 0 && this.clientes.length === 0) {
      void this.terminar().then(() => this.aoAcabar?.());
    }
  }

  private chegadas(): void {
    if (this.tempo <= 0) return;
    const decorrido = DURACAO - this.tempo;
    while (
      this.proximaChegada < CHEGADAS.length
      && CHEGADAS[this.proximaChegada].aos <= decorrido
    ) {
      const marcado = CHEGADAS[this.proximaChegada];
      this.proximaChegada += 1;
      // fila cheia: o quarto vai embora antes de entrar. Perda seca, sem drama
      // e sem barulho — só uma linha a menos na conta do dia
      if (this.naFila().length >= this.planta.fila.length) continue;
      this.entrar(ELENCO.find((f) => f.id === marcado.ficha) ?? ELENCO[0]);
    }
  }

  private entrar(ficha: FichaDeCliente): void {
    const bicho = ficha.criar();
    const balao = new BalaoDeCliente(ficha.balao);
    bicho.group.add(balao.sprite);
    bicho.group.position.set(this.planta.entrada.x, 0, this.planta.entrada.z);
    this.w.root.add(bicho.group);

    const cliente: Cliente = {
      ficha,
      bicho,
      balao,
      fase: 'na-porta',
      paciencia: 1,
      relogio: 0,
      mesa: null,
      prato: TODOS_OS_PRATOS[Math.floor(this.sorte() * TODOS_OS_PRATOS.length)],
      sujou: false,
    };
    this.clientes.push(cliente);
    balao.mostrar({ tipo: 'chegando' }, 1);
    this.g.som('porta');
  }

  private naFila(): Cliente[] {
    return this.clientes.filter((c) => c.fase === 'na-porta');
  }

  // ------------------------------------------------------------- um cliente

  private viverUmCliente(c: Cliente, dt: number): void {
    c.bicho.update(dt);

    switch (c.fase) {
      case 'na-porta': {
        // cada um anda até o seu lugar na fila; quem está na frente é quem sai
        const lugar = this.planta.fila[Math.min(this.naFila().indexOf(c), this.planta.fila.length - 1)];
        if (Math.hypot(c.bicho.x - lugar.x, c.bicho.z - lugar.z) > 0.25) {
          c.bicho.seguir(lugar.x, lugar.z, 1.5);
        }
        c.balao.mostrar({ tipo: 'chegando' }, c.paciencia);
        this.drenar(c, dt, DRENO['na-porta']);
        break;
      }
      case 'indo': {
        // seguindo o garçom pelo salão até ele escolher uma mesa
        const eu = this.g.playerPosition();
        c.bicho.seguir(eu.x - 0.7, eu.z - 0.7, 1.7);
        c.balao.mostrar({ tipo: 'chegando' }, c.paciencia);
        this.drenar(c, dt, DRENO['na-porta']);
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
          c.bicho.sentarEm(c.mesa.x + 0.55, c.mesa.z + 0.95, Math.PI, 0.5);
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
  private drenar(c: Cliente, dt: number, segundos: number): void {
    let calma = c.ficha.calma;
    for (const outro of this.clientes) {
      if (outro === c || !outro.ficha.acalma || !outro.mesa || !c.mesa) continue;
      if (Math.hypot(outro.mesa.x - c.mesa.x, outro.mesa.z - c.mesa.z) < 5) {
        calma /= 1 - outro.ficha.acalma;
      }
    }
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
    c.fase = 'quer-pagar';
    c.paciencia = 1;
    c.sujou = true;
    c.balao.mostrar({ tipo: 'conta' }, 1);
  }

  /** Ele cansou de esperar. Vai embora, e leva o dinheiro dele junto. */
  private desistir(c: Cliente): void {
    if (c.fase === 'saindo') return;
    this.g.toast(`${c.ficha.nome} foi embora`, '🩶');
    this.soltarAMesa(c);
    c.fase = 'saindo';
    c.balao.visivel = false;
    c.bicho.levantar();
    c.bicho.group.position.y = 0;
    // a comanda dele não vale mais nada: cozinhar para uma cadeira vazia é o
    // pior desperdício possível de um Walter que só faz um prato por vez
    this.comandas = this.comandas.filter((p) => p !== c);
  }

  /**
   * A mesa dele deixa de ser dele — e fica SUJA se ele chegou a comer.
   *
   * É o que faz o salão engasgar: mesa suja não recebe ninguém, e recolher é o
   * trabalho que nunca é urgente e sempre é o mais caro de adiar.
   */
  private soltarAMesa(c: Cliente): void {
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

  private apagarCliente(c: Cliente): void {
    c.balao.descartar();
    this.w.root.remove(c.bicho.group);
    this.apagar(c.bicho.group);
    this.clientes = this.clientes.filter((o) => o !== c);
    if (this.guiado === c) this.guiado = null;
  }

  // --------------------------------------------------------------- a cozinha

  private cozinhar(dt: number): void {
    if (this.cozinhando) {
      this.ateSair -= dt;
      if (this.ateSair > 0) return;
      const dono = this.cozinhando;
      this.cozinhando = null;
      // o cliente pode ter ido embora enquanto o prato ficava pronto
      if (dono.fase !== 'esperando') return;
      const vaga = this.vagaLivreNoBalcao();
      if (vaga < 0) {
        // balcão cheio TRAVA a cozinha: o prato não sai porque ninguém buscou.
        // A comanda volta para o fim da fila em vez de sumir.
        this.comandas.unshift(dono);
        return;
      }
      const malha = pratoServido(dono.prato.id);
      if (!malha) return;
      const onde = this.planta.saidas[vaga];
      malha.position.set(onde.x, this.planta.tampo, onde.z);
      this.w.root.add(malha);
      this.prontos.push({ prato: dono.prato, para: dono, malha, vaga });
      this.g.som('sino');
      // ele encosta na janela para entregar e volta para a cozinha
      void this.walter.irPara(this.planta.janela.x, this.planta.janela.z, 2.6)
        .then(() => this.walter.irPara(this.planta.cozinha.x, this.planta.cozinha.z, 2.2));
      return;
    }
    const proxima = this.comandas.shift();
    if (!proxima) return;
    this.cozinhando = proxima;
    this.ateSair = COZINHA;
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

    // 1. sentar quem está sendo levado
    if (!c && this.guiado && !this.sujeira.has(mesa)) {
      const convidado = this.guiado;
      this.guiado = null;
      convidado.mesa = mesa;
      convidado.fase = 'sentando';
      convidado.relogio = 0.1;
      convidado.paciencia = 1;
      this.ocupadas.set(mesa, convidado);
      this.g.som('sentar');
      void this.g.say([convidado.ficha.fala], convidado.ficha.nome);
      return;
    }

    // 2. recolher a louça
    if (!c && this.sujeira.has(mesa)) {
      const bandeja = this.minhaBandeja();
      if (bandeja.length >= BANDEJA) {
        this.g.toast('A bandeja tá cheia', '🖐');
        return;
      }
      const louca = this.sujeira.get(mesa)!;
      this.sujeira.delete(mesa);
      louca.visible = false;
      bandeja.push({ tipo: 'louca', malha: louca });
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
      if (c.mesa) {
        c.mesa.floreira.visible = false;
        vaga.malha.visible = true;
        vaga.malha.position.set(c.mesa.x, 0.82, c.mesa.z);
      }
      c.fase = 'comendo';
      c.relogio = REFEICAO;
      this.g.som('sorvete');
      return;
    }

    // 5. receber a conta
    if (c.fase === 'quer-pagar') {
      const bom = c.paciencia > 0.6 ? 1.5 : c.paciencia > 0.25 ? 1 : 0.5;
      const pago = Math.round(valor(c.prato) * bom * (c.ficha.gorjeta ? 2 : 1));
      this.dinheiro += pago;
      if (bom === 1.5) this.coracoes += 1;
      this.g.som('caixa');
      this.g.toast(`+ R$ ${pago}`, bom === 1.5 ? '💛' : bom === 1 ? '🤍' : '🩶');
      this.soltarAMesa(c);
      c.fase = 'saindo';
      c.balao.visivel = false;
      c.bicho.levantar();
      c.bicho.group.position.y = 0;
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
    await this.g.wait(c.ficha.anotar);
    this.g.lockPlayer(false);
    if (c.fase !== 'quer-pedir') return;      // ele desistiu enquanto eu anotava
    c.fase = 'esperando';
    c.paciencia = 1;
    this.comandas.push(c);
    this.g.som('confirma');
  }

  private pegarOPrato(): void {
    const bandeja = this.minhaBandeja();
    if (bandeja.length >= BANDEJA) {
      this.g.toast('A bandeja tá cheia', '🖐');
      return;
    }
    const pronto = this.prontos.shift();
    if (!pronto) return;
    pronto.malha.visible = false;
    bandeja.push({ tipo: 'prato', prato: pronto.prato, malha: pronto.malha, para: pronto.para });
    this.g.som('pegar');
  }

  private largarALouca(): void {
    const bandeja = this.minhaBandeja();
    const sujas = bandeja.filter((v) => v.tipo === 'louca');
    if (!sujas.length) return;
    for (const v of sujas) this.apagar(v.malha);
    this.bandejas.set(this.g.playerId(), bandeja.filter((v) => v.tipo !== 'louca'));

    // a pilha na copa cresce: é o placar visível de um trabalho que ninguém
    // aplaude, e some no fim do turno
    for (let i = 0; i < sujas.length && this.pilhaDeLouca.length < this.planta.pilha.length; i++) {
      const onde = this.planta.pilha[this.pilhaDeLouca.length];
      const pilha = loucaSuja(this.sorte());
      pilha.position.set(onde.x, this.planta.tampo, onde.z);
      this.w.root.add(pilha);
      this.pilhaDeLouca.push(pilha);
    }
    this.g.som('louca');
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

    this.pontoDoBalcao.enabled = this.prontos.length > 0 && bandeja.length < BANDEJA;
    this.pontoDoBalcao.label = this.prontos.length
      ? `Pegar ${this.prontos[0].prato.nome}`
      : 'Pegar o prato';

    this.pontoDaCopa.enabled = bandeja.some((v) => v.tipo === 'louca');

    for (let i = 0; i < this.mesas.length; i++) {
      const mesa = this.mesas[i];
      const ponto = this.pontoDaMesa[i];
      const c = this.ocupadas.get(mesa);
      if (!c && this.guiado && !this.sujeira.has(mesa)) {
        ponto.enabled = true;
        ponto.label = 'Sentar aqui';
        ponto.icon = '🪑';
      } else if (!c && this.sujeira.has(mesa)) {
        ponto.enabled = bandeja.length < BANDEJA;
        ponto.label = 'Recolher a louça';
        ponto.icon = '🧽';
      } else if (c?.fase === 'quer-pedir') {
        ponto.enabled = true;
        ponto.label = 'Anotar o pedido';
        ponto.icon = '📝';
      } else if (c?.fase === 'esperando') {
        const tem = bandeja.some((v) => v.tipo === 'prato' && v.para === c);
        ponto.enabled = true;
        ponto.label = tem ? `Entregar ${c.prato.nome}` : `Ver o que a mesa pediu`;
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
