/**
 * OS PRÊMIOS DA ESTUFA — pedido do Renan, em dois tipos:
 *
 * 1. **Toda rodada paga, e paga pelos BICHOS ESPANTADOS** (pedido do Renan:
 *    "o tanto de girassóis e dinheiro que a gente ganha após cada rodada deve
 *    ser baseado no número de inimigos que derrotamos"). Em DUAS moedas:
 *    - **reais**, na carteira do casal — a mesma do resto do jogo, que compra
 *      roupa aqui, na boutique, prato no Mania;
 *    - **girassóis** 🌻, a moeda da estufa: só ela compra ENFEITE na lojinha
 *      da Josefina. Rende MENOS que o real (um a cada 15 bichos, contra um real
 *      a cada 8), mas enfeite custa bem menos em girassol do que custava em
 *      real — e é isso que amarra a lojinha ao jardim: o dinheiro do Walter
 *      não compra enfeite nenhum.
 *    Paga sempre, até na rodada perdida.
 * 2. **Cada marco tem um prêmio ÚNICO**, que só se ganha na primeira vez que
 *    a dupla passa dele: um enfeite na estufa, uma roupa exclusiva, e a
 *    memória no quadro nas trinta. São DUAS flags por marco: `flag` diz que a
 *    dupla chegou lá (o fim da rodada marca), e `resgate` diz que ela já
 *    RESGATOU o prêmio — um clique na aba de recompensas do livro da bancada
 *    (pedido do Renan: "clicamos lá para desbloquear cada uma").
 *
 * E o RECORDE (a maior onda vencida) destranca a lojinha aos poucos: cada
 * enfeite e cada roupa tem a onda em que a Josefina passa a vender
 * (`LOJA_ABRE`, e a `onda` de cada enfeite em `world/decoracoes.ts`).
 *
 * A ESCALA: uma rodada inteira de trinta ondas traz ~2.300 bichos (medido com
 * `planoDaOnda`), então vencer tudo paga ~R$ 290 e ~150 girassóis; perder na
 * 6ª (~180 bichos) paga R$ 22 e 12 girassóis — um ou dois enfeites simples.
 * Um turno do Walter paga ~R$ 200; uma peça de boutique, 35 a 220.
 */

/** quantos bichos espantados valem um real */
export const BICHOS_POR_REAL = 8;
/** quantos bichos espantados valem um girassol (mais do que um real: rende menos) */
export const BICHOS_POR_GIRASSOL = 15;
/** o contador do save com os girassóis da dupla (é do casal, como a carteira) */
export const GIRASSOIS = 'jardim.girassois';

export type PremioUnico = 'plaquinha' | 'chapeu-de-jardineira' | 'avental-da-josefina' | 'regador-de-ouro';

export interface MarcoDoJardim {
  /** a onda que precisa ser VENCIDA */
  readonly onda: number;
  /** a flag do save que diz que a dupla já venceu esta onda alguma vez */
  readonly flag: string;
  /** a flag do save que diz que o prêmio único já foi resgatado no livro */
  readonly resgate: string;
  readonly premio: PremioUnico;
  /** como a tela do fim chama o prêmio único */
  readonly nome: string;
  readonly icone: string;
  /** o que a aba de recompensas do livro diz do prêmio, antes e depois */
  readonly descricao: string;
}

/** pequeno no 5, e crescendo — o pedido foi "um pouco mais" a cada marco */
export const MARCOS: readonly MarcoDoJardim[] = [
  {
    onda: 5, flag: 'jardim.marco-5', resgate: 'jardim.resgate-5', premio: 'plaquinha',
    nome: 'A plaquinha da estufa', icone: '🪧',
    descricao: 'Uma plaquinha de madeira na parede da bancada: "Jardineiros da Josefina".',
  },
  {
    onda: 10, flag: 'jardim.marco-10', resgate: 'jardim.resgate-10', premio: 'chapeu-de-jardineira',
    nome: 'Chapéu de jardineira', icone: '👒',
    descricao: 'Um chapéu de palha com fita verde para cada um, no guarda-roupa.',
  },
  {
    onda: 20, flag: 'jardim.marco-20', resgate: 'jardim.resgate-20', premio: 'avental-da-josefina',
    nome: 'Avental da Josefina', icone: '🧺',
    descricao: 'Um avental verde com bolso de semente para cada um, no guarda-roupa.',
  },
  {
    onda: 30, flag: 'jardim.marco-30', resgate: 'jardim.resgate-30', premio: 'regador-de-ouro',
    nome: 'O regador de ouro e uma memória', icone: '🏆',
    descricao: 'Um regador de ouro na bancada, e a memória "As trinta levas" no quadro do quarto.',
  },
];

/**
 * Quantas ondas a dupla VENCEU. A rodada que acaba porque o último canteiro
 * caiu acaba DENTRO de uma onda — essa não conta. A que acaba vencendo a
 * última conta todas.
 */
export function ondasVencidas(ondaDoFim: number, totalDeOndas: number, canteirosDePe: number): number {
  if (canteirosDePe > 0 && ondaDoFim >= totalDeOndas) return totalDeOndas;
  return Math.max(0, ondaDoFim - 1);
}

export interface PagamentoDaRodada {
  readonly espantados: number;
  /** reais na carteira do casal */
  readonly dinheiro: number;
  /** girassóis, a moeda dos enfeites */
  readonly girassois: number;
}

/** o que a rodada paga pelos bichos que a dupla espantou */
export function pagamentoDaRodada(espantados: number): PagamentoDaRodada {
  const n = Math.max(0, Math.floor(espantados));
  return {
    espantados: n,
    dinheiro: Math.floor(n / BICHOS_POR_REAL),
    girassois: Math.floor(n / BICHOS_POR_GIRASSOL),
  };
}

/** o contador do save com a MAIOR onda vencida numa rodada (o recorde) */
export const RECORDE = 'jardim.recorde';

/**
 * EM QUE ONDA A JOSEFINA PASSA A VENDER CADA ROUPA (o recorde tem que chegar
 * lá). Os enfeites levam a onda na própria ficha (`world/decoracoes.ts`). Quem
 * já comprou continua com a peça, destrancada ou não.
 */
export const LOJA_ABRE: Readonly<Record<string, number>> = {
  'camiseta-verde-folha': 0,
  'galocha-verde': 0,
  'camiseta-de-girassol': 3,
  'gorro-joaninha': 3,
  'tiara-do-walter': 6,
  'tiara-da-pelusa': 6,
  'bone-da-gina': 9,
  'camiseta-salva-vidas': 9,
  'camiseta-bar-de-sucos': 12,
  'camiseta-roda-gigante': 12,
  'mochila-casco': 18,
  // a segunda leva: um pouco de cada tipo em cada degrau, para toda onda nova
  // de recorde trazer alguma coisa
  'luvas-de-folha': 0,
  'pin-de-margarida': 0,
  'camiseta-de-florzinhas': 2,
  'luvas-de-girassol': 3,
  'pulseira-de-flores': 4,
  'pin-de-joaninha': 5,
  'calca-cargo-de-jardim': 5,
  'camiseta-de-joaninha': 6,
  'luvas-de-joaninha': 7,
  'vestido-de-margaridas': 8,
  'larga-de-cogumelo': 8,
  'pin-de-abelhinha': 10,
  'camiseta-de-abelhinha': 10,
  'pulseira-de-pedrinhas': 11,
  'luvas-de-gotinha': 13,
  'calca-de-jardineiro': 13,
  'larga-de-sapinho': 14,
  'vestido-de-rosinhas': 15,
  'camiseta-de-borboleta': 16,
  'pin-de-borboleta': 17,
  'calca-pantalona': 20,
  'vestido-do-campo': 22,
  'larga-de-lavanda': 24,
};
