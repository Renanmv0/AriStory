/**
 * A TEMPORADA DE TURNOS DO MANIA — os dados, e só os dados.
 *
 * O plano inteiro está no §13 de `docs/MINIGAME-RESTAURANTE.md`. Ajuste de
 * turno começa AQUI, e não no motor (`turnoDoMania.ts`): o mesmo papel do
 * `adversariosData.ts` da arena e do `cardapioData.ts`. Nada neste arquivo
 * importa o three, para o painel da escala e os testes sem navegador
 * (`scripts/balancoDoTurno.mjs`, quando existir) lerem a mesma tabela.
 *
 * O PRINCÍPIO: cada turno ensina UMA coisa nova (um bicho novo, uma regra
 * nova), e as novidades se ACUMULAM. A dificuldade sobe porque o salão fica
 * mais cheio de jeitos, e não porque alguém girou um botão de velocidade.
 */

/** um cliente marcado na escala de chegada: aos tantos segundos, entra tal ficha */
export interface ChegadaDoTurno {
  aos: number;
  /** o `id` da ficha no `ELENCO` de `turnoDoMania.ts` */
  ficha: string;
}

export interface TurnoDaEscala {
  /** 1 a 6: é também a chave dos contadores do save (`turno:2:estrelas`) */
  numero: number;
  nome: string;
  /** a frase da novidade, na linha do menu */
  novidade: string;
  /** segundos de relógio (quem está dentro quando zera ainda é servido) */
  duracao: number;
  /** FIXA, e não sorteada: é o que deixa o jogador aprender o turno */
  chegadas: readonly ChegadaDoTurno[];
  /** o dinheiro do dia para a segunda e para a terceira estrela */
  metas: readonly [number, number];
  /** quem aparece neste turno, para os retratinhos da linha */
  quem: readonly string[];
  /** quem estreia neste turno (sai destacado na linha) */
  novos: readonly string[];
  /** o que o Walter dá na primeira vez das três estrelas */
  premio: { icone: string; nome: string };
  /**
   * já dá para jogar. Os turnos 3 a 6 aparecem na escala desde já (dá para
   * VER o que vem, e é isso que dá vontade de jogar), mas os bichos e as
   * regras deles entram nas etapas C e D do plano.
   */
  pronto: boolean;
}

/**
 * O ROSTO DE CADA CLIENTE NA ESCALA — o emoji que o resto do jogo já usa
 * para ele (o balão "Falar com…" de cada cena), para a dupla reconhecer de
 * longe. A capivara não tem emoji: o castor é o primo mais perto.
 */
export const ROSTO_DO_CLIENTE: Readonly<Record<string, { icone: string; nome: string }>> = {
  josefina: { icone: '🐢', nome: 'Josefina' },
  capy: { icone: '🦫', nome: 'Capy' },
  noel: { icone: '🦃', nome: 'Noel' },
  gina: { icone: '🦒', nome: 'Gina' },
  mano: { icone: '🐧', nome: 'Mano' },
  cookie: { icone: '🐘', nome: 'Cookie' },
  'jean-luc': { icone: '🦆', nome: 'Jean-Luc' },
  estella: { icone: '🐑', nome: 'Estella' },
  coelhas: { icone: '🐰', nome: 'Luna, Sol e Estrella' },
  flynn: { icone: '🦊', nome: 'Flynn' },
  gatito: { icone: '🐱', nome: 'Gatito' },
  pelusa: { icone: '😼', nome: 'Pelusa' },
};

const OS_QUATRO = ['josefina', 'capy', 'noel', 'gina'] as const;

export const TURNOS: readonly TurnoDaEscala[] = [
  {
    numero: 1,
    nome: 'O primeiro turno',
    novidade: 'O salão de sempre: quatro clientes, cada um com o seu jeito.',
    duracao: 165,
    // a escala do turno de antes da temporada, segundo por segundo: quem já
    // tirou três estrelas nele continua sabendo jogar
    chegadas: [
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
    ],
    metas: [140, 220],
    quem: OS_QUATRO,
    novos: [],
    premio: { icone: '🎀', nome: 'Gravatinha do Walter' },
    pronto: true,
  },
  {
    numero: 2,
    nome: 'Sobremesa de pinguim',
    novidade: 'O Mano chega com fome de sobremesa: depois de comer, ele pede de novo.',
    duracao: 180,
    // O MANO ESTREIA SOZINHO: o salão vazio nos primeiros quinze segundos é o
    // tutorial dele. Depois ele volta duas vezes, no meio dos outros — e cada
    // vez segura a mesa pelo dobro do tempo
    chegadas: [
      { aos: 3, ficha: 'mano' },
      { aos: 18, ficha: 'josefina' },
      { aos: 30, ficha: 'noel' },
      { aos: 42, ficha: 'capy' },
      { aos: 55, ficha: 'gina' },
      { aos: 68, ficha: 'mano' },
      { aos: 82, ficha: 'noel' },
      { aos: 96, ficha: 'josefina' },
      { aos: 110, ficha: 'capy' },
      { aos: 124, ficha: 'mano' },
      { aos: 138, ficha: 'gina' },
      { aos: 150, ficha: 'noel' },
    ],
    metas: [160, 250],
    quem: [...OS_QUATRO, 'mano'],
    novos: ['mano'],
    premio: { icone: '🍽️', nome: 'Avental de garçom do Mania' },
    pronto: true,
  },
  {
    numero: 3,
    nome: 'O grandão da bilheteria',
    novidade: 'O Cookie é grande demais para uma mesa só: ele ocupa duas.',
    duracao: 195,
    chegadas: [],
    metas: [180, 280],
    quem: [...OS_QUATRO, 'mano', 'cookie'],
    novos: ['cookie'],
    premio: { icone: '✏️', nome: 'Bloquinho e lápis na orelha' },
    pronto: false,
  },
  {
    numero: 4,
    // o trocadilho que o Renan pediu: o "canard à l'orange", com o pato
    // francês no lugar da laranja
    nome: 'Canard à la Mania',
    novidade: 'O Jean-Luc só aceita prato quente, e a Estella repara no uniforme.',
    duracao: 195,
    chegadas: [],
    metas: [200, 320],
    quem: [...OS_QUATRO, 'mano', 'cookie', 'jean-luc', 'estella'],
    novos: ['jean-luc', 'estella'],
    premio: { icone: '🦺', nome: 'Colete de garçom' },
    pronto: false,
  },
  {
    numero: 5,
    nome: 'Dia de jogo',
    novidade: 'As três coelhinhas sentam juntas, e o Flynn torce por cada prato.',
    duracao: 210,
    chegadas: [],
    metas: [230, 360],
    quem: [...OS_QUATRO, 'mano', 'cookie', 'jean-luc', 'estella', 'coelhas', 'flynn'],
    novos: ['coelhas', 'flynn'],
    premio: { icone: '🧣', nome: 'Bandana de churrasqueiro' },
    pronto: false,
  },
  {
    numero: 6,
    nome: 'Casa cheia',
    novidade: 'Todo mundo, o Gatito fazendo o six seven, e o Pelusa solto no salão.',
    duracao: 240,
    chegadas: [],
    metas: [270, 420],
    quem: [...OS_QUATRO, 'mano', 'cookie', 'jean-luc', 'estella', 'coelhas', 'flynn', 'gatito', 'pelusa'],
    novos: ['gatito', 'pelusa'],
    premio: { icone: '👨‍🍳', nome: 'Dólmã e chapéu de cozinheiro' },
    pronto: false,
  },
];

export function turnoPorNumero(numero: number): TurnoDaEscala | null {
  return TURNOS.find((t) => t.numero === numero) ?? null;
}

/** as estrelas saem do dinheiro do dia: uma por terminar, duas e três pelas metas */
export function estrelasDoTurno(turno: TurnoDaEscala, dinheiro: number): 1 | 2 | 3 {
  return dinheiro >= turno.metas[1] ? 3 : dinheiro >= turno.metas[0] ? 2 : 1;
}

// ------------------------------------------------------------- as melhorias

/**
 * AS MELHORIAS PERMANENTES, compradas com PETISCOS na aba "Melhorias" da
 * escala (§13.6). O Walter dá um petisco por estrela no fim de cada turno —
 * a moeda é ideia do Renan, e é só do Mania: o dinheiro do turno continua
 * indo para a carteira do casal.
 *
 * Na etapa A elas só APARECEM (a aba mostra o que vem e quanto custa); a
 * compra e o efeito de cada uma entram na etapa B. Os preços são provisórios.
 */
export interface MelhoriaDoMania {
  id: string;
  nome: string;
  icone: string;
  /** o que muda, uma frase por nível */
  efeitos: readonly string[];
  /** petiscos por nível */
  precos: readonly number[];
  /** onde a dupla vai VER a melhoria no salão */
  ondeSeVe: string;
}

export const MELHORIAS: readonly MelhoriaDoMania[] = [
  {
    id: 'bandeja', nome: 'Bandeja grande', icone: '🍽️',
    efeitos: ['Cabem três coisas na bandeja de cada um, em vez de duas.'],
    precos: [5], ondeSeVe: 'a bandeja maior na mão',
  },
  {
    id: 'tenis', nome: 'Tênis de garçom', icone: '👟',
    efeitos: ['Anda 10% mais rápido durante o turno.', 'Anda 20% mais rápido durante o turno.'],
    precos: [2, 5], ondeSeVe: 'o tênis nos pés durante o turno',
  },
  {
    id: 'bloquinho', nome: 'Bloquinho de comandas', icone: '📒',
    efeitos: ['Anotar leva metade do tempo — até a história da Josefina encurta.'],
    precos: [3], ondeSeVe: 'o bloquinho na mão ao anotar',
  },
  {
    id: 'chapa', nome: 'Chapa nova', icone: '🔥',
    efeitos: ['O Walter faz cada prato em 5 segundos, em vez de 7.', 'O Walter faz dois pratos de cada vez.'],
    precos: [3, 6], ondeSeVe: 'a chapa nova na cozinha',
  },
  {
    id: 'reserva', nome: 'Plaquinha de reserva', icone: '🪧',
    efeitos: ['A fila espera 30% mais, e ganha um quarto lugar.'],
    precos: [3], ondeSeVe: 'a plaquinha na entrada',
  },
  {
    id: 'radio', nome: 'Rádio do salão', icone: '📻',
    efeitos: ['A paciência de todo mundo cai 10% mais devagar.'],
    precos: [5], ondeSeVe: 'o rádio tocando no balcão do bar',
  },
  {
    id: 'carrinho', nome: 'Carrinho de louça', icone: '🛒',
    efeitos: ['Guarda uma pilha de louça sem ocupar a bandeja.'],
    precos: [4], ondeSeVe: 'o carrinho parado na copa',
  },
];

// ------------------------------------------------------------------ o save

/**
 * AS CHAVES DO SAVE. Tudo mora nos contadores (`g.stat`/`g.bump`), como o
 * `turno-recorde` de antes da temporada: nenhum campo novo no `SaveState`.
 */
export const CHAVE = {
  estrelas: (n: number) => `turno:${n}:estrelas`,
  recorde: (n: number) => `turno:${n}:recorde`,
  vezes: (n: number) => `turno:${n}:vezes`,
  petiscos: 'mania:petiscos',
  /** o save de antes da temporada já foi lido (uma vez só) */
  migrado: 'turnos-migrados',
} as const;

/** o pedaço do `GameAPI` que o progresso usa — para o teste sem navegador também servir */
export interface SaveDoTurno {
  stat(key: string): number;
  bump(key: string, by?: number): number;
  flag(key: string): boolean;
  setFlag(key: string, value?: boolean): void;
}

/**
 * O TURNO ESTÁ ABERTO na escala: o primeiro sempre, e cada um dos outros com
 * três estrelas no anterior — a trava que o Renan pediu.
 */
export function turnoAberto(s: SaveDoTurno, numero: number): boolean {
  return numero <= 1 || s.stat(CHAVE.estrelas(numero - 1)) >= 3;
}

/** guarda o número só se ele for MAIOR que o guardado (o contador só soma) */
function subirPara(s: SaveDoTurno, chave: string, valor: number): boolean {
  const antes = s.stat(chave);
  if (valor <= antes) return false;
  s.bump(chave, valor - antes);
  return true;
}

/**
 * QUEM JÁ JOGOU NÃO PERDE NADA. O save de antes da temporada tinha um turno
 * só: o `turno-recorde` dele vira o recorde do turno 1, e as estrelas saem do
 * próprio recorde (elas sempre saíram do dinheiro do dia, então o recorde diz
 * exatamente quantas a dupla já tirou). Os petiscos dessas estrelas vêm junto.
 *
 * Roda toda vez que o Mania é montado, e só age na primeira.
 */
export function migrarOTurnoAntigo(s: SaveDoTurno): void {
  if (s.flag(CHAVE.migrado)) return;
  s.setFlag(CHAVE.migrado);
  const recorde = s.stat('turno-recorde');
  const t1 = TURNOS[0];
  let estrelas = recorde > 0 || s.flag('primeiro-turno-feito') ? estrelasDoTurno(t1, recorde) : 0;
  // a gravatinha só vinha com as três: vale mais que qualquer conta
  if (s.flag('gravata-do-walter')) estrelas = 3;
  if (!estrelas) return;
  subirPara(s, CHAVE.recorde(1), recorde);
  subirPara(s, CHAVE.estrelas(1), estrelas);
  s.bump(CHAVE.petiscos, estrelas);
}

export interface ResultadoDoTurno {
  estrelas: number;
  petiscos: number;
  recorde: boolean;
  /** a primeira vez das três estrelas neste turno: é a hora do prêmio */
  primeiraVezTres: boolean;
  /** o turno seguinte acabou de abrir na escala */
  abriu: TurnoDaEscala | null;
  /** os seis turnos com três estrelas, agora — a plaquinha de funcionários do mês */
  temporadaFechada: boolean;
}

/**
 * ANOTA O FIM DE UM TURNO no save: o recorde, as melhores estrelas e os
 * petiscos — um por estrela, toda vez, inclusive em turno já vencido. É o que
 * faz rejogar valer a pena.
 */
export function registrarOTurno(s: SaveDoTurno, turno: TurnoDaEscala, dinheiro: number): ResultadoDoTurno {
  const n = turno.numero;
  const estrelas = estrelasDoTurno(turno, dinheiro);
  const tinhaTres = s.stat(CHAVE.estrelas(n)) >= 3;
  const fechadaAntes = TURNOS.every((t) => s.stat(CHAVE.estrelas(t.numero)) >= 3);
  const proximo = turnoPorNumero(n + 1);
  const proximoAbertoAntes = proximo ? turnoAberto(s, proximo.numero) : true;

  const recorde = subirPara(s, CHAVE.recorde(n), dinheiro);
  subirPara(s, CHAVE.estrelas(n), estrelas);
  s.bump(CHAVE.vezes(n), 1);
  s.bump(CHAVE.petiscos, estrelas);
  // o recorde de antes da temporada continua valendo para quem lia ele
  if (n === 1) subirPara(s, 'turno-recorde', dinheiro);

  return {
    estrelas,
    petiscos: estrelas,
    recorde,
    primeiraVezTres: estrelas === 3 && !tinhaTres,
    abriu: proximo && !proximoAbertoAntes && turnoAberto(s, proximo.numero) ? proximo : null,
    temporadaFechada: !fechadaAntes && TURNOS.every((t) => s.stat(CHAVE.estrelas(t.numero)) >= 3),
  };
}
