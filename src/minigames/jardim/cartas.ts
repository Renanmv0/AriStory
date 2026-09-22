import type { EstiloDeRegador } from '../../world/regador';

/**
 * AS CARTAS DO MINIGAME DO JARDIM — o catálogo.
 *
 * O plano está em `docs/MINIGAME-JARDIM.md` §6, e a receita para criar carta
 * nova está na skill `.claude/skills/aristory-habilidade/SKILL.md`. Comece por
 * ela: carta nova é UMA ENTRADA nesta lista, e não uma mexida no minigame.
 *
 * ESTE ARQUIVO NÃO SABE QUE EXISTE UMA ESTUFA. Ele não importa cena, não
 * importa motor e não mexe em malha: uma carta só escreve numa `FichaDaRodada`,
 * que é o conjunto de números e regras que o minigame lê a cada quadro. É isso
 * que deixa o baralho inteiro testável sem abrir o navegador
 * (`scripts/cartas.mjs`).
 *
 * =============================================== A REGRA QUE DECIDE A RARIDADE
 *
 * **Carta comum mexe em número; carta rara mexe em regra.** Se uma ideia só
 * sabe dar +X%, ela é comum, por melhor que pareça. Uma lendária muda o jeito
 * de jogar a rodada inteira.
 *
 * =============================================== CARTA NENHUMA SE REPETE
 *
 * Pedido do Renan: carta que você já tem não aparece de novo. Quem guarda isso
 * é a `MaoDeCartas` (`baralho.ts`), e não esta lista.
 *
 * O que antes eram "comuns que repetem" (pegar mais alcance três vezes) virou
 * uma SÉRIE: "Bico mais longo", "Bico mais longo II" e "III" são três cartas
 * diferentes, e a II só entra no sorteio depois de a I estar na mão (`requer`).
 * O jogador continua podendo empilhar alcance, e nenhuma carta aparece duas
 * vezes — é o desenho do Vampire Survivors, que foi a referência dele.
 */

export type Raridade = 'comum' | 'incomum' | 'raro' | 'lendario';

/**
 * AS TRÊS FAMÍLIAS, e as três precisam estar na mesa: três cartas que só
 * sabem dar +% ao regador não é uma escolha, é um clique.
 */
export type Familia = 'regador' | 'jardineiro' | 'jardim';

/**
 * AS REGRAS que uma carta pode ligar. Cada uma é um interruptor que o minigame
 * consulta com `ficha.regras.has(...)`.
 *
 * Lista fechada de propósito: regra nova é uma linha aqui MAIS o código no
 * minigame que a obedece. Uma string solta, digitada numa carta e que ninguém
 * lê, seria uma carta que não faz nada — e o compilador pega isso aqui.
 */
export type RegraDoJardim =
  | 'segundo-bico'      // o jato sai também para trás
  | 'atravessa'         // o jato passa do primeiro bicho e acerta o de trás
  | 'bota'              // terra de canteiro não segura mais quem anda
  | 'enche-andando'     // o tanque enche enquanto você anda, não só no tonel
  | 'empurrao'          // encostar num bicho joga ele 2 m para trás
  | 'grito'             // uma vez por onda, tudo num raio de 4 m recua
  | 'dedo-verde'        // canteiro machucado recupera 1 ponto entre ondas
  | 'segundo-tonel'     // nasce um tonel do outro lado da estufa
  | 'poca'              // onde o jato cai fica escorregadio por 4 s
  | 'espantalho'        // um espantalho puxa o alvo dos bichos por 20 s
  | 'josefina-ajuda'    // ela rega um canteiro por conta dela, uma vez por onda
  | 'portao-emperrado'  // uma das três portas fecha pelo resto da rodada
  | 'la-de-tras'        // quem ficou com a Josefina rega o canteiro mais perto dele
  | 'os-dois-na-frente' // o parceiro sai de trás e rega do seu lado
  | 'cerca-viva'        // um canteiro à sua escolha fica intocável
  | 'chuva';            // a estufa inteira leva um jato a cada 30 s

/**
 * OS NÚMEROS E AS REGRAS DA RODADA — tudo o que uma carta pode mexer.
 *
 * Ela nunca é acumulada à mão: a `MaoDeCartas` a DERIVA do zero, partindo de
 * `fichaInicial()` e aplicando as cartas na ordem em que foram pegas. Assim
 * não existe número que "escorregou" de uma carta desfeita, e a ficha de
 * qualquer momento é reproduzível só com a lista de ids.
 */
export interface FichaDaRodada {
  /** raio em que o regador acha alvo, em metros */
  alcance: number;
  /** quanto tira de encharque por jato */
  dano: number;
  /** segundos entre um jato e o outro (MENOR é melhor) */
  cadencia: number;
  /** abertura do leque de água, em graus */
  largura: number;
  /** quantos jatos cabem no tanque */
  tanque: number;
  /** jatos por segundo que o tanque recupera sozinho */
  recarga: number;
  /** multiplicador da velocidade de andar */
  velocidade: number;
  /** raio em que as gotas são puxadas; 0 = tem que pisar em cima */
  coleta: number;
  /** multiplicador de quanto cada canteiro aguenta ser comido */
  vidaDoCanteiro: number;
  /** os interruptores ligados */
  regras: Set<RegraDoJardim>;
  /**
   * COMO O REGADOR ESTÁ DESENHADO. Carta que mexe no regador mexe na peça da
   * mão (§6 do plano) — e é aqui que ela escreve isso. O `estagio` não entra:
   * ele sai de QUANTAS cartas de regador foram pegas, e quem conta é a mão.
   */
  estilo: Omit<Partial<EstiloDeRegador>, 'estagio'>;
}

/** Os quatro números do §4 do plano, e o resto no zero. */
export function fichaInicial(): FichaDaRodada {
  return {
    alcance: 2.6,
    dano: 1,
    cadencia: 1.1,
    largura: 35,
    tanque: 12,
    recarga: 0.25,
    velocidade: 1,
    coleta: 0,
    vidaDoCanteiro: 1,
    regras: new Set(),
    estilo: {},
  };
}

/**
 * O que acontece NA HORA em que a carta é escolhida, e não depois.
 *
 * Só as cartas de consolo usam (ver `CONSOLOS`): elas não mudam a ficha, elas
 * dão uma coisa agora. O minigame lê e executa.
 */
export type EfeitoNaHora = 'encher-tanque' | 'curar-canteiro' | 'susto';

export interface CartaDoJardim {
  /** único no baralho inteiro; é ele que a mão guarda */
  readonly id: string;
  /** o que aparece em cima da carta */
  readonly nome: string;
  readonly familia: Familia;
  readonly raridade: Raridade;
  readonly icone: string;
  /** uma frase, o que ela faz — cabe na carta de um celular */
  readonly texto: string;
  /**
   * Só entra no sorteio depois de TODAS estas estarem na mão. É o que faz uma
   * série (I → II → III) andar em ordem.
   */
  readonly requer?: readonly string[];
  /**
   * Não entra no sorteio se QUALQUER uma destas estiver na mão. Para duas
   * cartas que brigam pela mesma coisa e não podem conviver.
   */
  readonly exclui?: readonly string[];
  /**
   * Nível mínimo para ela aparecer. Sem ele vale o piso da raridade
   * (`NIVEL_MINIMO`): lendária não sai antes do 4.
   */
  readonly nivelMinimo?: number;
  /**
   * Carta de consolo: pode sair quantas vezes for, e NÃO entra na mão. Só
   * aparece quando o baralho de verdade não tem mais três cartas para mostrar.
   */
  readonly repetivel?: boolean;
  readonly naHora?: EfeitoNaHora;
  /** o que ela faz com a rodada; nunca guarda estado fora da ficha */
  aplicar(f: FichaDaRodada): void;
}

/**
 * O PISO DE CADA RARIDADE. "Lendária não sai antes do nível 4": roguelite em
 * que a primeira carta decide a rodada é roguelite que não tem rodada.
 */
export const NIVEL_MINIMO: Record<Raridade, number> = {
  comum: 1,
  incomum: 1,
  raro: 2,
  lendario: 4,
};

// ------------------------------------------------------------------ séries

const ROMANO = ['', ' II', ' III', ' IV', ' V'] as const;

/**
 * UMA SÉRIE: a mesma melhoria em degraus, cada degrau uma carta.
 *
 * `aplicar(f, degrau)` recebe 1, 2, 3… — é o que deixa o degrau desenhar a
 * peça (o bico estica `degrau / total`) sem cada carta repetir a conta.
 */
function serie(
  base: string,
  degraus: number,
  ficha: Omit<CartaDoJardim, 'id' | 'requer' | 'aplicar'>,
  aplicar: (f: FichaDaRodada, degrau: number, total: number) => void,
): CartaDoJardim[] {
  const cartas: CartaDoJardim[] = [];
  for (let d = 1; d <= degraus; d++) {
    cartas.push({
      ...ficha,
      id: `${base}-${d}`,
      nome: `${ficha.nome}${ROMANO[d - 1]}`,
      requer: d > 1 ? [`${base}-${d - 1}`] : undefined,
      aplicar: (f) => aplicar(f, d, degraus),
    });
  }
  return cartas;
}

// ================================================================= REGADOR
// "eu bato mais forte" — os números do §4 e as regras do jato

const REGADOR: CartaDoJardim[] = [
  ...serie('bico', 3, {
    familia: 'regador', raridade: 'comum', icone: '📏',
    nome: 'Bico mais longo', texto: 'O regador alcança 18% mais longe',
  }, (f, d, n) => {
    f.alcance *= 1.18;
    f.estilo.bico = d / n;
  }),
  ...serie('jato', 3, {
    familia: 'regador', raridade: 'comum', icone: '💦',
    nome: 'Jato firme', texto: 'Cada jato encharca 20% mais',
  }, (f) => {
    f.dano *= 1.2;
    f.estilo.ponteira = true;
  }),
  ...serie('braco', 3, {
    familia: 'regador', raridade: 'comum', icone: '💪',
    nome: 'Braço solto', texto: 'O jato sai 12% mais rápido',
  }, (f) => {
    f.cadencia *= 0.88;
    f.estilo.caboDeMadeira = true;
  }),
  ...serie('leque', 3, {
    familia: 'regador', raridade: 'comum', icone: '🌬️',
    nome: 'Leque aberto', texto: 'O leque de água abre mais 10°',
  }, (f, d, n) => {
    f.largura += 10;
    f.estilo.crivo = d / n;
  }),
  ...serie('tanque', 3, {
    familia: 'regador', raridade: 'comum', icone: '🪣',
    nome: 'Tanque maior', texto: 'Cabem mais 4 jatos no tanque',
  }, (f, d, n) => {
    f.tanque += 4;
    f.estilo.tanque = d / n;
  }),
  {
    id: 'segundo-bico', nome: 'Segundo bico', familia: 'regador', raridade: 'incomum',
    icone: '↔️', texto: 'O jato sai também para trás',
    aplicar: (f) => {
      f.regras.add('segundo-bico');
      f.estilo.segundoBico = true;
    },
  },
  {
    id: 'orvalho', nome: 'Orvalho', familia: 'regador', raridade: 'incomum',
    icone: '🌫️', texto: 'O tanque enche sozinho 50% mais rápido',
    aplicar: (f) => {
      f.recarga *= 1.5;
      f.estilo.respiro = true;
    },
  },
  {
    id: 'mangueira', nome: 'Mangueira', familia: 'regador', raridade: 'raro',
    icone: '🐍', texto: 'O alcance dobra, mas o jato demora 40% mais',
    aplicar: (f) => {
      f.alcance *= 2;
      f.cadencia *= 1.4;
      f.estilo.mangueira = true;
    },
  },
  {
    id: 'pressao', nome: 'Regador de pressão', familia: 'regador', raridade: 'raro',
    icone: '🎯', texto: 'O jato atravessa o primeiro bicho e acerta o de trás',
    aplicar: (f) => f.regras.add('atravessa'),
  },
];

// ============================================================== JARDINEIRO
// "eu me viro melhor" — você: velocidade, coleta, o corpo

const JARDINEIRO: CartaDoJardim[] = [
  ...serie('passo', 2, {
    familia: 'jardineiro', raridade: 'comum', icone: '👟',
    nome: 'Passo leve', texto: 'Você anda 12% mais rápido',
  }, (f) => {
    f.velocidade *= 1.12;
  }),
  {
    id: 'bolso-furado', nome: 'Bolso furado', familia: 'jardineiro', raridade: 'comum',
    icone: '🫧', texto: 'As gotas vêm até você de 2 m de distância',
    aplicar: (f) => {
      f.coleta = Math.max(f.coleta, 2);
    },
  },
  {
    id: 'bota', nome: 'Bota de jardim', familia: 'jardineiro', raridade: 'comum',
    icone: '🥾', texto: 'Terra de canteiro não te segura mais',
    aplicar: (f) => f.regras.add('bota'),
  },
  {
    id: 'folego', nome: 'Fôlego', familia: 'jardineiro', raridade: 'incomum',
    icone: '🫁', texto: 'O tanque enche enquanto você anda, e não só no tonel',
    aplicar: (f) => f.regras.add('enche-andando'),
  },
  {
    id: 'chinelada', nome: 'Chinelada', familia: 'jardineiro', raridade: 'incomum',
    icone: '🩴', texto: 'Encostar num bicho empurra ele 2 m para trás',
    aplicar: (f) => f.regras.add('empurrao'),
  },
  {
    id: 'grito', nome: 'Grito', familia: 'jardineiro', raridade: 'raro',
    icone: '📣', texto: 'Uma vez por onda, tudo num raio de 4 m recua até a porta',
    aplicar: (f) => f.regras.add('grito'),
  },
  {
    id: 'dedo-verde', nome: 'Dedo verde', familia: 'jardineiro', raridade: 'raro',
    icone: '🌱', texto: 'Canteiro machucado se recupera um pouco entre as ondas',
    aplicar: (f) => f.regras.add('dedo-verde'),
  },
  /**
   * OS DOIS NA FRENTE — a lendária da dupla.
   *
   * Na rodada, quem você não controla fica LÁ ATRÁS com a Josefina (pedido do
   * Renan). Esta carta é a exceção que se ganha: o parceiro pega o segundo
   * regador e vem regar do seu lado pelo resto da rodada. Ela substitui as
   * duas cartas do plano antigo que só faziam sentido com os dois na frente
   * desde o começo ("Mãos dadas" e "Regador do Renan").
   */
  {
    id: 'os-dois-na-frente', nome: 'Os dois na frente', familia: 'jardineiro',
    raridade: 'lendario', icone: '💞',
    texto: 'Quem ficou lá atrás pega o outro regador e vem regar do seu lado',
    exclui: ['la-de-tras'],
    aplicar: (f) => f.regras.add('os-dois-na-frente'),
  },
];

// ================================================================== JARDIM
// "o campo joga a meu favor" — a estufa: canteiro, tonel, portas, a Josefina

const JARDIM: CartaDoJardim[] = [
  ...serie('terra', 2, {
    familia: 'jardim', raridade: 'comum', icone: '🟫',
    nome: 'Terra adubada', texto: 'Os canteiros aguentam 25% mais mordida',
  }, (f) => {
    f.vidaDoCanteiro *= 1.25;
  }),
  {
    id: 'segundo-tonel', nome: 'Segundo tonel', familia: 'jardim', raridade: 'comum',
    icone: '🛢️', texto: 'Nasce um tonel do outro lado: a viagem pela água encurta',
    aplicar: (f) => f.regras.add('segundo-tonel'),
  },
  {
    id: 'poca', nome: 'Poça', familia: 'jardim', raridade: 'incomum',
    icone: '🫗', texto: 'Onde o jato cai fica escorregadio por 4 s, e o bicho anda devagar',
    aplicar: (f) => f.regras.add('poca'),
  },
  {
    id: 'la-de-tras', nome: 'Lá de trás', familia: 'jardim', raridade: 'incomum',
    icone: '🧑‍🌾', texto: 'Quem ficou com a Josefina rega o canteiro mais perto dele',
    exclui: ['os-dois-na-frente'],
    aplicar: (f) => f.regras.add('la-de-tras'),
  },
  {
    id: 'espantalho', nome: 'Espantalho', familia: 'jardim', raridade: 'raro',
    icone: '🧍', texto: 'Um espantalho puxa a atenção dos bichos por 20 s',
    aplicar: (f) => f.regras.add('espantalho'),
  },
  {
    id: 'josefina-ajuda', nome: 'A Josefina ajuda', familia: 'jardim', raridade: 'raro',
    icone: '🐢', texto: 'Uma vez por onda ela molha um canteiro por conta dela',
    aplicar: (f) => f.regras.add('josefina-ajuda'),
  },
  {
    id: 'portao-emperrado', nome: 'Portão emperrado', familia: 'jardim', raridade: 'raro',
    icone: '🚧', texto: 'Uma das três portas fecha pelo resto da rodada',
    aplicar: (f) => f.regras.add('portao-emperrado'),
  },
  {
    id: 'cerca-viva', nome: 'Cerca viva', familia: 'jardim', raridade: 'lendario',
    icone: '🌳', texto: 'Um canteiro à sua escolha fica intocável até o fim',
    aplicar: (f) => f.regras.add('cerca-viva'),
  },
  {
    id: 'chuva', nome: 'Chuva', familia: 'jardim', raridade: 'lendario',
    icone: '🌧️', texto: 'A estufa inteira leva um jato, de uma vez, a cada 30 s',
    aplicar: (f) => {
      f.regras.add('chuva');
      f.estilo.nuvem = true;
    },
  },
];

/** O baralho inteiro, na ordem das famílias. */
export const CARTAS: readonly CartaDoJardim[] = [...REGADOR, ...JARDINEIRO, ...JARDIM];

/**
 * AS CARTAS DE CONSOLO — o que aparece quando o baralho acaba.
 *
 * Uma rodada boa pode chegar num nível em que sobram menos de três cartas que
 * você ainda não tem. Tela de escolha com uma carta só não é escolha, e tela
 * vazia é um travamento: então os buracos se enchem com isto. Elas podem sair
 * quantas vezes for, NÃO entram na mão e não contam para o estágio do regador.
 */
/*
 * SÃO TRÊS, e não menos: com o baralho vazio a tela é SÓ consolo, e ela
 * sempre mostra três cartas.
 */
export const CONSOLOS: readonly CartaDoJardim[] = [
  {
    id: 'gole-de-agua', nome: 'Gole d’água', familia: 'regador', raridade: 'comum',
    icone: '🥤', texto: 'Enche o tanque agora', repetivel: true, naHora: 'encher-tanque',
    aplicar: () => {},
  },
  {
    id: 'muda-de-reserva', nome: 'Muda de reserva', familia: 'jardim', raridade: 'comum',
    icone: '🪴', texto: 'O canteiro mais comido ganha uma muda nova', repetivel: true,
    naHora: 'curar-canteiro',
    aplicar: () => {},
  },
  {
    id: 'susto', nome: 'Susto', familia: 'jardineiro', raridade: 'comum',
    icone: '💥', texto: 'Todo bicho perto de você recua uns passos', repetivel: true,
    naHora: 'susto',
    aplicar: () => {},
  },
];

/** Acha uma carta pelo id, no baralho ou nos consolos. */
export function cartaPorId(id: string): CartaDoJardim | undefined {
  return CARTAS.find((c) => c.id === id) ?? CONSOLOS.find((c) => c.id === id);
}
