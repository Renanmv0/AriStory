/**
 * OS PRÊMIOS DA ESTUFA — pedido do Renan, em dois tipos:
 *
 * 1. **Toda rodada paga moedas** (reais na carteira do casal), para dar
 *    vontade de jogar de novo: um tanto por onda vencida, e um bônus a cada
 *    marco alcançado NAQUELA rodada. Paga sempre, até na rodada perdida — o
 *    que vale é até onde a dupla chegou.
 * 2. **Cada marco tem um prêmio ÚNICO**, que só se ganha na primeira vez que
 *    a dupla passa dele (uma flag no save): um enfeite na estufa, uma roupa
 *    exclusiva, e a memória no quadro nas trinta.
 *
 * Os marcos contam ONDAS VENCIDAS (decisão do Renan), e não o nível das
 * gotas: é o progresso que a dupla enxerga, e a 30ª é vencer a rodada.
 *
 * A ESCALA do dinheiro é a do resto do jogo: bilhete da roda 24, prato do
 * Mania 12 a 34, um turno de garçom ~200, peça de boutique 35 a 220. Vencer as
 * trinta paga 240 — um turno e pouco, que é o que a rodada inteira custa de
 * tempo.
 */

/** o que cada onda vencida paga, em reais */
export const MOEDAS_POR_ONDA = 3;

export type PremioUnico = 'plaquinha' | 'chapeu-de-jardineira' | 'avental-da-josefina' | 'regador-de-ouro';

export interface MarcoDoJardim {
  /** a onda que precisa ser VENCIDA */
  readonly onda: number;
  /** o bônus em reais, toda rodada que chegar aqui */
  readonly moedas: number;
  /** a flag do save que diz que o prêmio único já foi dado */
  readonly flag: string;
  readonly premio: PremioUnico;
  /** como a tela do fim chama o prêmio único */
  readonly nome: string;
  readonly icone: string;
}

/** pequeno no 5, e crescendo — o pedido foi "um pouco mais" a cada marco */
export const MARCOS: readonly MarcoDoJardim[] = [
  { onda: 5, moedas: 10, flag: 'jardim.marco-5', premio: 'plaquinha', nome: 'A plaquinha da estufa', icone: '🪧' },
  { onda: 10, moedas: 20, flag: 'jardim.marco-10', premio: 'chapeu-de-jardineira', nome: 'Chapéu de jardineira', icone: '👒' },
  { onda: 20, moedas: 40, flag: 'jardim.marco-20', premio: 'avental-da-josefina', nome: 'Avental da Josefina', icone: '🧺' },
  { onda: 30, moedas: 80, flag: 'jardim.marco-30', premio: 'regador-de-ouro', nome: 'O regador de ouro e uma memória', icone: '🏆' },
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
  readonly vencidas: number;
  /** `vencidas × MOEDAS_POR_ONDA` */
  readonly porOnda: number;
  /** a soma dos bônus dos marcos alcançados */
  readonly bonus: number;
  readonly total: number;
}

export function pagamentoDaRodada(vencidas: number): PagamentoDaRodada {
  const porOnda = vencidas * MOEDAS_POR_ONDA;
  const bonus = MARCOS.filter((m) => vencidas >= m.onda).reduce((s, m) => s + m.moedas, 0);
  return { vencidas, porOnda, bonus, total: porOnda + bonus };
}
