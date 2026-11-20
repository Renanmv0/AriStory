/**
 * A PORTARIA DO CLUBE — os TIPOS e as constantes das regras.
 *
 * O desenho inteiro está em `docs/PORTARIA-DO-CLUBE.md` (§1 a §14). Este
 * diretório é a etapa 1 do §14: as regras SEM three, para a cena, o painel e
 * os testes sem navegador (`scripts/portaria.mjs`) lerem a mesma coisa.
 *
 * O PRINCÍPIO: o certo e o errado de cada visitante SAEM DOS PAPÉIS. Ninguém
 * escreve "este aqui é 🔴" à mão: a conferência (`conferencia.ts`) compara os
 * documentos com o calendário, a lista, o manual, o rosto e as respostas, e o
 * roteiro só DECLARA o que espera — o teste cobra que as duas coisas batem.
 */

// ============================================================== o calendário

/** uma data do calendário da portaria (o ano inteiro, para a carteirinha de 1998 do Hipólito) */
export interface Data {
  d: number;
  m: number;
  a: number;
}

export const data = (d: number, m: number, a: number): Data => ({ d, m, a });

/** a data como número que ordena (20261123) */
export const ordem = (x: Data): number => x.a * 10000 + x.m * 100 + x.d;

export const antes = (x: Data, y: Data): boolean => ordem(x) < ordem(y);

export const mesmaData = (x: Data, y: Data): boolean => ordem(x) === ordem(y);

/** "23/11/2026", como vem escrito nos papéis */
export const escrever = (x: Data): string =>
  `${String(x.d).padStart(2, '0')}/${String(x.m).padStart(2, '0')}/${x.a}`;

// =================================================================== o rosto

/**
 * O RETRATO de um bicho: o que a foto mostra e o que a janela mostra. A foto
 * bate quando a ESPÉCIE, a COR e a MARCA batem — o penteado, o chapéu e os
 * óculos não contam (o manual diz: é a pegadinha da Dona Alpacina).
 */
export interface Retrato {
  especie: Especie;
  /** a cor do pelo (ou da pena, ou da lã), por nome: a cena acha o tom na paleta */
  cor: string;
  /** a marca que distingue (a pinta na orelha do Bento, a do focinho da Alpacina); `null` é nenhuma */
  marca: string | null;
  /** o penteado da Alpacina (NÃO conta para a foto) */
  cabelo?: string;
  /** chapéu, óculos, bigode de disfarce: enfeite, NÃO conta para a foto (o bigode é um disfarce: quem conta é a espécie) */
  enfeite?: string;
}

/** as espécies da portaria: as dos bichos do jogo e as dos figurantes (nada de rato, golfinho ou barata) */
export type Especie =
  // os recorrentes novos
  | 'hipopotamo' | 'alpaca' | 'porquinho' | 'tamandua' | 'preguica'
  // os figurantes
  | 'lontra' | 'bode' | 'coala' | 'pandaVermelho' | 'texugo'
  // os bichos do jogo
  | 'peru' | 'tartaruga' | 'capivara' | 'pato' | 'ovelha' | 'pinguim' | 'elefante'
  | 'gato' | 'ursa' | 'coelha' | 'raposa' | 'lobo' | 'cachorro' | 'flamingo' | 'pavao';

// ============================================================== os documentos

/** o NOME do clube no escudo da carteirinha certa */
export const NOME_DO_CLUBE = 'Clube';

export interface Carteirinha {
  tipo: 'carteirinha';
  nome: string;
  numero: string;
  validade: Data;
  foto: Retrato;
  /** o clube do escudo (o de verdade é `NOME_DO_CLUBE`; o do Jean-Luc é de Paris) */
  clube: string;
}

export interface Convite {
  tipo: 'convite';
  /** quem foi convidado */
  convidado: string;
  /** o sócio que convidou, e o número dele */
  socio: string;
  numeroDoSocio: string;
  data: Data;
}

/** o convite de uma turma inteira (o Dia da Escola no Clube, dia 6) */
export interface ConviteColetivo {
  tipo: 'conviteColetivo';
  socio: string;
  numeroDoSocio: string;
  data: Data;
  /** quem pode entrar com ele */
  nomes: readonly string[];
}

export interface Cracha {
  tipo: 'cracha';
  nome: string;
  empresa: string;
  funcao: string;
  foto: Retrato;
}

export interface OrdemDeEntrega {
  tipo: 'ordem';
  empresa: string;
  /** para onde, no clube (o manual lista os lugares que existem) */
  destino: string;
  itens: readonly string[];
}

export interface ExameDaPiscina {
  tipo: 'exame';
  nome: string;
  validade: Data;
}

export type Documento = Carteirinha | Convite | ConviteColetivo | Cracha | OrdemDeEntrega | ExameDaPiscina;
export type TipoDeDocumento = Documento['tipo'];

/** o que pode ir na sacola (o proibido do dia vai para a caixa de achados) */
export type ItemDaSacola =
  | 'toalha' | 'protetor' | 'oculosDeNatacao' | 'boia' | 'livro' | 'sanduiche' | 'patoDeBorracha'
  | 'tricô' | 'bolaDeBasquete' | 'chinelo' | 'raqueteDePingPong'
  | 'caixaDeSom' | 'copoDeVidro' | 'sabaoDeBolha' | 'bolaDeFutebol';

export const NOME_DO_ITEM: Readonly<Record<ItemDaSacola, string>> = {
  toalha: 'toalha', protetor: 'protetor solar', oculosDeNatacao: 'óculos de natação', boia: 'boia',
  livro: 'livro', sanduiche: 'sanduíche', patoDeBorracha: 'pato de borracha', 'tricô': 'tricô',
  bolaDeBasquete: 'bola de basquete', chinelo: 'chinelo', raqueteDePingPong: 'raquete de ping pong',
  caixaDeSom: 'caixa de som', copoDeVidro: 'copo de vidro', sabaoDeBolha: 'sabão de bolha', bolaDeFutebol: 'bola de futebol',
};

// =========================================================== a lista e o manual

/** uma linha da prancheta da lista de sócios */
export interface LinhaDaLista {
  nome: string;
  numero: string;
  /** riscado: o motivo vem escrito, e é sempre bobo */
  suspenso?: string;
}

/** os lugares que EXISTEM no clube (o manual): entrega para outro lugar não passa */
export const DESTINOS_DO_CLUBE: readonly string[] = [
  'Mania de Churrasco', 'Bar do Noel', 'Estufa da Josefina', 'Piscina', 'Vestiário', 'Portaria',
];

/** o que NÃO entra na sacola (do dia 5 em diante), com o porquê do manual */
export const PROIBIDOS: Readonly<Partial<Record<ItemDaSacola, string>>> = {
  caixaDeSom: 'som alto, só no baile',
  copoDeVidro: 'vidro quebra na beira da piscina',
  sabaoDeBolha: 'espuma na piscina, não',
  bolaDeFutebol: 'bola de futebol, só na quadra do parque',
};

// ========================================================== perguntar e apontar

/** os ASSUNTOS do 💬 (§6): cada um aparece quando o visitante tem o papel dele */
export type Assunto = 'nome' | 'numero' | 'motivo' | 'convidou' | 'destino' | 'exame' | 'sacola' | 'quantos';

export const PERGUNTA: Readonly<Record<Assunto, string>> = {
  nome: 'Qual o seu nome?',
  numero: 'Qual o seu número de sócio?',
  motivo: 'Veio fazer o quê?',
  convidou: 'Quem te convidou?',
  destino: 'Pra onde é a entrega?',
  exame: 'Quando fez o exame da piscina?',
  sacola: 'O que tem na sacola?',
  quantos: 'Quantos vocês são?',
};

/**
 * UMA PISTA é uma coisa que se aponta com a lupa (§7): um campo de documento
 * (`doc:carteirinha:validade`), o rosto na janela (`rosto`), o calendário
 * (`calendario`), a lista (`lista`), uma linha da transcrição
 * (`transcricao:numero`), uma regra do manual (`manual:escudo`,
 * `manual:destinos`, `manual:documentos`), a bancada vazia (`bancada`).
 * Texto simples, para a cena e o teste falarem a mesma língua.
 */
export type Pista = string;

/** o que acontece quando a diferença apontada é de verdade (§7) */
export type Desfecho = 'seCorrige' | 'confessa' | 'seEnrola';

/** os carimbos */
export type Carimbo = 'entra' | 'hojeNao' | 'soClube';

// ============================================================== o relógio e o dinheiro

/**
 * O RELÓGIO DO EXPEDIENTE: das 9h às 17h, comprimidas nos `segundos` do dia
 * (cada dia tem os seus: a fila do sábado é maior). Perguntar e apontar gastam
 * MINUTOS DO RELÓGIO — a pressão é a fila, e não um erro.
 *
 * O relógio corre SÓ durante os atendimentos: para enquanto a Gina ensina a
 * novidade e no fim do dia. A régua do teste é `segundosPorVisitante` (chegar,
 * passar os papéis, ser carimbado e sair, sem pressa); quando a cena existir,
 * ela tem que ser remedida jogando (`scripts/portaria.mjs` diz quanto sobra).
 */
export const RELOGIO = {
  abre: 9 * 60,
  fecha: 17 * 60,
  /** cada pergunta */
  pergunta: 8,
  /** a mesma pergunta de novo */
  perguntaRepetida: 10,
  /** apontar uma diferença de verdade */
  apontar: 5,
  /** apontar à toa */
  apontarAToa: 10,
  /** a Dona Preguiça dormindo no meio da resposta */
  cochilo: 15,
  /** o tempo de um atendimento sem pergunta nem lupa (segundos de verdade) */
  segundosPorVisitante: 10,
} as const;

/**
 * os valores do ENVELOPE da Gina (§9): o certo paga, o erro desconta, e o
 * envelope nunca fica negativo. Na mesma faixa do turno do Mania (um dia bem
 * jogado rende de R$ 150 a R$ 230), para os dois minigames valerem o mesmo.
 */
export const VALOR = {
  certo: 15,
  /** a diferença de verdade apontada antes do carimbo, com confissão */
  confissao: 8,
  /** a diferença apontada que se corrige (o capacete do Capy, a Luna atrás da Tia Liz) */
  achado: 6,
  /** a mentira pega por uma resposta apontada contra o papel */
  mentiraPega: 6,
  /** entrou quem não podia */
  entrouQuemNaoPodia: -20,
  /** barrou quem podia */
  barrouQuemPodia: -15,
  /** 🟢 no lugar do 🟡, ou o contrário */
  carimboTrocado: -10,
  /** o proibido passou na sacola */
  itemPassou: -10,
  /** aceitou um agrado de quem não podia entrar (a casquinha do Mano) */
  agrado: -12,
} as const;

/** um FATO é uma coisa que aconteceu na semana: vira manchete e muda os dias seguintes (§9) */
export type Fato = string;
