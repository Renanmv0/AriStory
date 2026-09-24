import type { FichaDaRodada } from './cartas';

/**
 * AS ARMAS DA ESTUFA — o que a dupla leva para a rodada (pedido do Renan: "trocar
 * a arma, entre aspas, que a gente usa"). Hoje são quatro, numa FILA:
 *
 *   regador → mangueira → pistola d'água → borrifador
 *
 * O regador vem de começo. Cada uma das outras DESTRANCA quando a dupla vence a
 * onda `ONDA_PARA_ABRIR` (20) USANDO A ANTERIOR — o recorde é guardado por arma,
 * então jogar bem de mangueira não abre nada para o regador, e vice-versa
 * (decisão do Renan). Quem escolhe com qual jogar é a parede das armas da
 * estufa (`scenes/estufa.ts`, e o painel em `ui/arsenal.ts`).
 *
 * ESTE ARQUIVO NÃO CONHECE CENA NEM MOTOR, como `cartas.ts`: uma arma é uma
 * ficha que mexe nos NÚMEROS DE PARTIDA da rodada (`base`), antes de qualquer
 * carta. O jeito de atirar continua sendo o caminho único do jato (`umJato`, em
 * `rodada.ts`), e é por isso que as cartas genéricas (alcance, força, leque…)
 * servem para todas de graça. O que é SÓ de uma arma a carta declara com
 * `soPara`, e o que NÃO faz sentido nela com `naoServe` (`cartas.ts`) — a
 * mangueira, com água infinita, não tira "Tanque maior".
 *
 * `pronta: false` é arma que já aparece na parede (com a meta para destrancar)
 * mas que ainda não foi construída: dá para ver, não dá para usar.
 */

export type ArmaId = 'regador' | 'mangueira' | 'pistola' | 'borrifador';

/** a onda que precisa ser VENCIDA com a arma anterior para destrancar a próxima */
export const ONDA_PARA_ABRIR = 20;

export interface FichaDaArma {
  readonly id: ArmaId;
  readonly nome: string;
  /** com artigo, para as falas: "o regador", "a mangueira" */
  readonly comArtigo: string;
  readonly icone: string;
  /** o jeito dela em uma frase, para o painel */
  readonly descricao: string;
  /** a arma que precisa vencer a onda 20 para esta destrancar (`null` = vem de começo) */
  readonly anterior: ArmaId | null;
  /** já dá para jogar com ela; `false` = aparece na parede, trancada ou "em construção" */
  readonly pronta: boolean;
  /** os números de partida da rodada, antes das cartas */
  base(f: FichaDaRodada): void;
}

export const ARMAS: readonly FichaDaArma[] = [
  {
    id: 'regador', nome: 'Regador', comArtigo: 'o regador', icone: '🪣', anterior: null, pronta: true,
    descricao: 'O de sempre: um jato em leque a cada segundo, e o tanque que se enche no tonel.',
    base: () => {},
  },
  /*
   * A MANGUEIRA: presa no tonel, então a água NUNCA ACABA — e ela não passa dos
   * portões (a mangueira não chega lá fora). O jato é um fio comprido e fino que
   * sai quase sem parar: cada gota encharca pouco, e junta muito por segundo.
   * Números: 0,42 de força a cada 0,32 s = 1,3 por segundo, contra 0,9 do
   * regador — é a troca por não poder sair da estufa e por abrir só 12°.
   */
  {
    id: 'mangueira', nome: 'Mangueira', comArtigo: 'a mangueira', icone: '🐍', anterior: 'regador', pronta: true,
    descricao: 'Presa no tonel: a água nunca acaba, mas ela não passa dos portões. Jato fino e sem parar.',
    base: (f) => {
      f.alcance = 3.6;
      f.dano = 0.42;
      f.cadencia = 0.32;
      f.largura = 12;
      f.gastoPorJato = 0;
      f.regras.add('agua-infinita');
      f.regras.add('presa-na-estufa');
      f.jato.mangueira = true;
    },
  },
  {
    id: 'pistola', nome: "Pistola d'água", comArtigo: "a pistola d'água", icone: '🔫', anterior: 'mangueira', pronta: false,
    descricao: 'Tiros rápidos e de longe, tanque pequeno: para acertar os bichos lá no pátio.',
    base: () => {},
  },
  {
    id: 'borrifador', nome: 'Borrifador', comArtigo: 'o borrifador', icone: '🧴', anterior: 'pistola', pronta: false,
    descricao: 'Um leque curto que pega vários bichos de uma vez: contra enxame.',
    base: () => {},
  },
];

export function armaPorId(id: string): FichaDaArma | undefined {
  return ARMAS.find((a) => a.id === id);
}

/** o contador do save com o recorde (a maior onda vencida) de uma arma */
export function chaveDoRecorde(arma: ArmaId): string {
  return `jardim.recorde.${arma}`;
}

/** o contador do save com a arma escolhida na parede (a posição dela em `ARMAS`) */
export const ARMA_ESCOLHIDA = 'jardim.arma';

/**
 * A ARMA ESTÁ DESTRANCADA? A primeira sempre; as outras quando o recorde da
 * ANTERIOR chegou na onda 20. Recebe a leitura do recorde de fora (o save):
 * este arquivo não conhece o save.
 */
export function destrancada(arma: FichaDaArma, recordeDe: (a: ArmaId) => number): boolean {
  return arma.anterior === null || recordeDe(arma.anterior) >= ONDA_PARA_ABRIR;
}
