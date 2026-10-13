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
  /**
   * as REGRAS NOVAS do salão que valem neste turno. `esfria`: o prato pronto
   * esfria no balcão (e na bandeja) — do turno 4 em diante, e a regra nova de
   * um turno continua valendo nos seguintes
   */
  regras?: readonly RegraDoSalao[];
  /**
   * O PELUSA (turno 6): os segundos em que ele se enfia no salão. Ele não é
   * cliente nem entra na fila — é um evento do turno (§13.3 do plano)
   */
  pelusa?: readonly number[];
}

export type RegraDoSalao = 'esfria';

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
    novidade: 'O Cookie é grande demais para uma mesa só: ele ocupa duas — mas só pede suco, e toma num instante.',
    duracao: 195,
    // o Cookie estreia sozinho, como o Mano no turno 2, e volta duas vezes no
    // meio do salão cheio — é aí que escolher a mesa dele pesa
    chegadas: [
      { aos: 3, ficha: 'cookie' },
      { aos: 18, ficha: 'josefina' },
      { aos: 30, ficha: 'noel' },
      { aos: 42, ficha: 'mano' },
      { aos: 55, ficha: 'capy' },
      { aos: 68, ficha: 'gina' },
      { aos: 82, ficha: 'cookie' },
      { aos: 96, ficha: 'noel' },
      { aos: 110, ficha: 'josefina' },
      { aos: 124, ficha: 'mano' },
      { aos: 138, ficha: 'capy' },
      { aos: 152, ficha: 'cookie' },
      { aos: 166, ficha: 'noel' },
    ],
    metas: [180, 280],
    quem: [...OS_QUATRO, 'mano', 'cookie'],
    novos: ['cookie'],
    premio: { icone: '✏️', nome: 'Bloquinho e lápis na orelha' },
    pronto: true,
  },
  {
    numero: 4,
    // o trocadilho que o Renan pediu: o "canard à l'orange", com o pato
    // francês no lugar da laranja
    nome: 'Canard à la Mania',
    novidade: 'Agora o prato esfria no balcão. O Jean-Luc só aceita prato quente, e a Estella repara no uniforme.',
    duracao: 195,
    // os dois estreiam juntos, um logo depois do outro: o pato que cobra
    // pressa e a ovelha que dá o biscoito de quem tem pressa
    chegadas: [
      { aos: 3, ficha: 'jean-luc' },
      { aos: 16, ficha: 'estella' },
      { aos: 28, ficha: 'josefina' },
      { aos: 40, ficha: 'noel' },
      { aos: 52, ficha: 'cookie' },
      { aos: 64, ficha: 'capy' },
      { aos: 76, ficha: 'mano' },
      { aos: 90, ficha: 'jean-luc' },
      { aos: 104, ficha: 'gina' },
      { aos: 118, ficha: 'estella' },
      { aos: 130, ficha: 'noel' },
      { aos: 144, ficha: 'mano' },
      { aos: 156, ficha: 'jean-luc' },
      { aos: 168, ficha: 'capy' },
    ],
    metas: [200, 320],
    quem: [...OS_QUATRO, 'mano', 'cookie', 'jean-luc', 'estella'],
    novos: ['jean-luc', 'estella'],
    premio: { icone: '🦺', nome: 'Colete de garçom' },
    regras: ['esfria'],
    pronto: true,
  },
  {
    numero: 5,
    nome: 'Dia de jogo',
    novidade: 'As três coelhinhas sentam juntas, e o Flynn torce por cada prato.',
    duracao: 210,
    // as três irmãs abrem o turno sozinhas (a mesa grande é o tutorial dela),
    // e o Flynn chega logo depois para torcer pelos pratos delas
    chegadas: [
      { aos: 3, ficha: 'coelhas' },
      { aos: 18, ficha: 'flynn' },
      { aos: 30, ficha: 'josefina' },
      { aos: 42, ficha: 'noel' },
      { aos: 54, ficha: 'jean-luc' },
      { aos: 66, ficha: 'capy' },
      { aos: 80, ficha: 'estella' },
      { aos: 92, ficha: 'cookie' },
      { aos: 104, ficha: 'gina' },
      { aos: 116, ficha: 'coelhas' },
      { aos: 128, ficha: 'mano' },
      { aos: 140, ficha: 'noel' },
      { aos: 152, ficha: 'flynn' },
      { aos: 164, ficha: 'jean-luc' },
      { aos: 176, ficha: 'capy' },
      { aos: 188, ficha: 'gina' },
    ],
    metas: [230, 360],
    quem: [...OS_QUATRO, 'mano', 'cookie', 'jean-luc', 'estella', 'coelhas', 'flynn'],
    novos: ['coelhas', 'flynn'],
    premio: { icone: '🧣', nome: 'Bandana de churrasqueiro' },
    regras: ['esfria'],
    pronto: true,
  },
  {
    numero: 6,
    nome: 'Casa cheia',
    novidade: 'Todo mundo, o Gatito fazendo o six seven, e o Pelusa solto no salão.',
    duracao: 240,
    // a casa cheia: o Gatito abre sozinho, e daí em diante todo mundo
    chegadas: [
      { aos: 3, ficha: 'gatito' },
      { aos: 16, ficha: 'josefina' },
      { aos: 28, ficha: 'noel' },
      { aos: 40, ficha: 'coelhas' },
      { aos: 52, ficha: 'flynn' },
      { aos: 64, ficha: 'jean-luc' },
      { aos: 76, ficha: 'capy' },
      { aos: 88, ficha: 'estella' },
      { aos: 100, ficha: 'gatito' },
      { aos: 112, ficha: 'cookie' },
      { aos: 124, ficha: 'gina' },
      { aos: 136, ficha: 'mano' },
      { aos: 148, ficha: 'noel' },
      { aos: 160, ficha: 'coelhas' },
      { aos: 172, ficha: 'jean-luc' },
      { aos: 184, ficha: 'estella' },
      { aos: 196, ficha: 'capy' },
      { aos: 206, ficha: 'flynn' },
      { aos: 216, ficha: 'gina' },
      { aos: 226, ficha: 'noel' },
    ],
    // o Pelusa se enfia duas vezes: quando o salão começa a encher, e no meio
    pelusa: [50, 150],
    metas: [270, 420],
    quem: [...OS_QUATRO, 'mano', 'cookie', 'jean-luc', 'estella', 'coelhas', 'flynn', 'gatito', 'pelusa'],
    novos: ['gatito', 'pelusa'],
    premio: { icone: '👨‍🍳', nome: 'Dólmã e chapéu de cozinheiro' },
    regras: ['esfria'],
    pronto: true,
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
 * Compradas na aba "Melhorias" da escala (`comprarMelhoria`); o nível de
 * cada uma mora no contador `mania:<id>`. O motor do turno recebe os níveis
 * no `comecar()`, e a cena mostra a peça de cada uma no salão.
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
    // o plano dizia "guarda uma pilha sem ocupar a bandeja", mas um carrinho
    // parado na copa não ajudaria em nada: ele mora no MEIO do salão, e é um
    // segundo lugar de largar a louça — meia viagem a menos
    efeitos: ['Um carrinho no meio do salão: dá para largar a louça nele, sem ir até a copa.'],
    precos: [4], ondeSeVe: 'o carrinho de louça entre as mesas',
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
  melhoria: (id: string) => `mania:${id}`,
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

// ------------------------------------------------------- comprar melhorias

/** o nível de cada melhoria comprada (0 = não tem), pelo `id` */
export type NiveisDasMelhorias = Readonly<Record<string, number>>;

export function niveisDasMelhorias(s: SaveDoTurno): NiveisDasMelhorias {
  return Object.fromEntries(MELHORIAS.map((m) => [m.id, s.stat(CHAVE.melhoria(m.id))]));
}

export type Compra = 'comprou' | 'faltam-petiscos' | 'no-maximo' | 'nao-existe';

/**
 * COMPRA O PRÓXIMO NÍVEL de uma melhoria com os petiscos do pote. Nível a
 * nível: o tênis de 20% só depois do de 10%. Os contadores só somam, então
 * gastar é um `bump` negativo.
 */
export function comprarMelhoria(s: SaveDoTurno, id: string): Compra {
  const m = MELHORIAS.find((x) => x.id === id);
  if (!m) return 'nao-existe';
  const nivel = s.stat(CHAVE.melhoria(id));
  if (nivel >= m.precos.length) return 'no-maximo';
  const preco = m.precos[nivel];
  if (s.stat(CHAVE.petiscos) < preco) return 'faltam-petiscos';
  s.bump(CHAVE.petiscos, -preco);
  s.bump(CHAVE.melhoria(id), 1);
  return 'comprou';
}
