/**
 * ============================================= A APOSTILA DO GATITO — os tipos
 *
 * A aula de português do Gatito é uma APOSTILA DE VERDADE (pedido do Renan: "igual
 * uma escola de inglês"), com o molde dos livros de curso de idioma — Interchange,
 * English File — e dos de português para quem fala espanhol:
 *
 * - toda lição tem QUANTAS PÁGINAS O TEMA PEDIR (pedido do Renan: "as aulas
 *   só precisam ser dinâmicas e únicas"): uma ou mais de explicação (a
 *   primeira é a situação, "Para começar"; as outras, a regra), uma ou mais
 *   de exercícios (`novaPagina` quebra) e a de fechamento ("Agora eu
 *   consigo…", as estrelas). O livro completa com uma página de anotações
 *   quando a conta dá ímpar;
 * - a explicação é feita de BLOCOS (um diálogo em quadrinho, uma tabela, a
 *   comparação com o espanhol, a dica do Gatito…), e a página se monta sozinha
 *   com eles — escrever uma lição é escrever dados, não HTML;
 * - os exercícios são de DEZ TIPOS, de propósito variados (ver `Exercicio`).
 *
 * O conteúdo mora em `licoes/`, uma lição por arquivo; as regras (estrelas,
 * trava, conferir o que foi digitado) em `apostila.ts`; o livro que desenha
 * tudo em `ui/apostila.ts`. Como escrever uma lição nova: a skill
 * `aristory-apostila`.
 *
 * TEXTO CORRIDO aceita dois realces, e só eles: `**negrito**` e `*itálico*`.
 * Nada de HTML — o livro escapa tudo antes de desenhar.
 */

/** quem fala nos quadrinhos da apostila e nas falas da aula */
export type Falante = 'gatito' | 'luna' | 'sol' | 'estrella' | 'ari' | 'renan' | 'walter' | 'josefina';

export interface Fala {
  quem: Falante;
  texto: string;
}

/** uma palavra do vocabulário da lição */
export interface Palavra {
  pt: string;
  /** como se diz em espanhol (pequeno, embaixo) */
  es?: string;
  emoji?: string;
  /** uma explicação curta, quando só a tradução não basta */
  nota?: string;
}

/**
 * UM PEDAÇO DE PÁGINA de explicação. A página é uma lista deles, de cima para
 * baixo; cada tipo tem o seu desenho no livro.
 */
export type Bloco =
  /** "Nesta lição você vai…": os objetivos, logo no alto da primeira página */
  | { tipo: 'objetivos'; itens: readonly string[] }
  /** a SITUAÇÃO: um diálogo em quadrinho, com o retrato de quem fala */
  | { tipo: 'cena'; titulo: string; lugar: string; falas: readonly Fala[] }
  /** o vocabulário: cartões com emoji, a palavra e o espanhol embaixo */
  | { tipo: 'palavras'; titulo: string; itens: readonly Palavra[] }
  /** um parágrafo explicativo */
  | { tipo: 'texto'; titulo?: string; texto: string }
  /** a tabela da regra; a primeira coluna sai em negrito */
  | { tipo: 'tabela'; titulo?: string; colunas: readonly string[]; linhas: readonly (readonly string[])[]; nota?: string }
  /** 🇻🇪 em espanhol × 🇧🇷 em português, lado a lado */
  | { tipo: 'contraste'; titulo?: string; pares: readonly { es: string; pt: string }[] }
  /** frases de exemplo, uma por linha */
  | { tipo: 'exemplos'; titulo?: string; itens: readonly string[] }
  /** 🐾 a dica do Gatito: o bilhetinho com o retrato dele */
  | { tipo: 'dica'; texto: string }
  /** ⚠️ fique de olho: a pegadinha */
  | { tipo: 'atencao'; texto: string }
  /** 🇧🇷 cantinho do Brasil: a cultura por trás da língua */
  | { tipo: 'brasil'; titulo: string; texto: string };

/**
 * O DESENHO de uma pergunta "onde está?": um objeto (emoji) num lugar em
 * relação a uma caixa ou a uma mesa — as preposições da lição 3.
 */
export interface Figura {
  objeto: string;
  lugar: 'em-cima' | 'embaixo' | 'dentro' | 'ao-lado' | 'atras' | 'na-frente';
  base: 'caixa' | 'mesa';
}

export interface ItemDeEscolha {
  pergunta: string;
  opcoes: readonly string[];
  /** o índice da opção certa */
  certa: number;
  /** o que o Gatito explica quando a resposta sai errada */
  porque: string;
  figura?: Figura;
}

/** uma volta da conversa: o outro fala, o Ari escolhe o que responder */
export interface TurnoDeConversa {
  fala: string;
  /** o que está acontecendo, em itálico antes da fala (opcional) */
  contexto?: string;
  opcoes: readonly string[];
  certa: number;
  porque: string;
}

/** o que todo exercício pode ter, seja qual for o tipo */
interface ComumAoExercicio {
  /** começa uma PÁGINA NOVA de exercícios (o primeiro já começa a dele) */
  novaPagina?: boolean;
}

/**
 * OS DEZ TIPOS DE EXERCÍCIO. Todo exercício tem um `enunciado` (a instrução,
 * em negrito ao lado do número) e ITENS — e cada item vale um ponto.
 *
 * Toda resposta é conferida NA HORA e UMA VEZ SÓ: errou, o livro mostra a
 * certa e o Gatito explica o porquê (§6.3 do `docs/ESCOLA.md`: errar não
 * pune). A nota da lição sai de quantos itens saíram certos de primeira.
 */
export type Exercicio = ComumAoExercicio & (
  /** múltipla escolha, com figura opcional */
  | { tipo: 'escolha'; enunciado: string; itens: readonly ItemDeEscolha[] }
  /** um bate-papo de celular: `com` fala, o Ari escolhe a resposta, e a conversa anda */
  | { tipo: 'conversa'; enunciado: string; com: Falante; turnos: readonly TurnoDeConversa[] }
  /** verdadeiro ou falso */
  | { tipo: 'vf'; enunciado: string; itens: readonly { frase: string; verdade: boolean; porque: string }[] }
  /** ligar as colunas: cada par, uma linha; a da direita sai embaralhada */
  | { tipo: 'ligar'; enunciado: string; pares: readonly (readonly [string, string])[]; porque: string }
  /**
   * texto com lacunas e um banco de palavras. As lacunas são `{0}`, `{1}`…
   * no texto, na ordem de `respostas`; o banco é `respostas` + `distratores`,
   * embaralhado. `porque` tem uma explicação por lacuna.
   */
  | {
      tipo: 'lacunas'; enunciado: string; titulo?: string; texto: string;
      respostas: readonly string[]; distratores: readonly string[]; porque: readonly string[];
    }
  /** montar a frase: os `pedacos` na ordem certa; o livro embaralha */
  | { tipo: 'ordenar'; enunciado: string; itens: readonly { pedacos: readonly string[]; porque: string }[] }
  /**
   * escrever: `antes` + [campo] + `depois`. A conferência ignora maiúscula,
   * espaço sobrando e pontuação no fim; acento esquecido vale, com um aviso.
   */
  | {
      tipo: 'digitar'; enunciado: string;
      itens: readonly { antes: string; depois?: string; aceitas: readonly string[]; porque: string }[];
    }
  /** separar em grupos: cada frase ganha um botão por grupo */
  | {
      tipo: 'classificar'; enunciado: string; grupos: readonly string[];
      itens: readonly { texto: string; grupo: number; porque: string }[];
    }
  /** ache o erro: a frase em palavras tocáveis; `errada` é o índice da que está errada */
  | {
      tipo: 'erro'; enunciado: string;
      itens: readonly { palavras: readonly string[]; errada: number; correcao: string; porque: string }[];
    }
  /** qual não combina: uma pergunta e quatro opções, uma delas diferente das outras */
  | { tipo: 'intruso'; enunciado: string; itens: readonly ItemDeEscolha[] }
);

/** as falas da aula na Sala 1, fora do livro */
export interface AulaDaLicao {
  /**
   * QUEM CHAMA ESTA AULA no ginásio: é com ela que a dupla tem de falar (a
   * missão). A 1 é da Luna, a 2 da Sol (depois do salto dela), a 3 da
   * Estrella (depois da estrelinha) — pedido do Renan. `qualquer`: a aula
   * não tem dona, e falar com qualquer uma das três chama (as 4, 5 e 6, até
   * a escola ganhar mais gente — também pedido dele).
   */
  chama: 'luna' | 'sol' | 'estrella' | 'qualquer';
  /**
   * no ginásio, logo depois do sinal: quem chama avisando que a aula vai
   * começar. Numa aula de `qualquer`, é a turma toda reagindo ao sinal —
   * vale do mesmo jeito com quem quer que a dupla tenha falado.
   */
  chamada: readonly Fala[];
  /** o Gatito abrindo a aula, antes da apostila */
  abertura: readonly Fala[];
  /** depois da lição concluída */
  encerramento: readonly Fala[];
}

/** a cor da lição no livro: a faixa do alto, os números, os botões */
export type CorDaLicao = 'coral' | 'mostarda' | 'rosa' | 'verde' | 'azul' | 'lilas';

export interface Licao {
  id: string;
  numero: number;
  titulo: string;
  /** a situação, o tema criativo: "O primeiro dia de aula" */
  subtitulo: string;
  /** o assunto de língua, curto: "cumprimentos, você e a gente" */
  assunto: string;
  emoji: string;
  cor: CorDaLicao;
  /**
   * as páginas de EXPLICAÇÃO, quantas o tema pedir (pelo menos uma): cada uma
   * é uma lista de blocos. A primeira abre com o título da lição e é a
   * "💬 Para começar"; as outras são "📐 Como funciona".
   */
  explicacao: readonly (readonly Bloco[])[];
  exercicios: readonly Exercicio[];
  /** "Agora eu consigo…": a autoavaliação do fim da lição */
  consigo: readonly string[];
  aula: AulaDaLicao;
}

export interface Modulo {
  id: string;
  titulo: string;
  subtitulo: string;
  licoes: readonly Licao[];
}

/** o que o save guarda da apostila */
export interface ProgressoDaApostila {
  /** as estrelas de cada lição concluída — a MELHOR vez, de 1 a 3 */
  estrelas: Readonly<Record<string, number>>;
  /** as lições que o Gatito já abriu numa aula (só elas podem ser lidas) */
  abertas: readonly string[];
}

/** o que a apostila devolve ao fechar: as lições concluídas NESTA abertura (já salvas) */
export interface ResultadoDaApostila {
  concluidas: Array<{ id: string; estrelas: number }>;
}
