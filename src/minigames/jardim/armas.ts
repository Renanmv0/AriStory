import type { FichaDaRodada } from './cartas';

/**
 * AS ARMAS DA ESTUFA — o que a dupla leva para a rodada (pedido do Renan: "trocar
 * a arma, entre aspas, que a gente usa"). Hoje são quatro, numa FILA:
 *
 *   regador → mangueira → pistola d'água → borrifador
 *
 * O regador vem de começo. Cada uma das outras DESTRANCA quando a dupla JOGA
 * `ONDAS_PARA_ABRIR` (15) ondas USANDO A ANTERIOR, somando as rodadas (decisão
 * do Renan: "não necessariamente chegar à onda 15… é cumulativo": chegar na 5
 * numa rodada e na 10 em outra já abre). A conta é guardada por arma
 * (`chaveDasOndas`), então jogar de mangueira não abre nada para o regador. Quem escolhe com qual jogar é a parede das armas da
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

/** quantas ondas é preciso JOGAR com a arma anterior, somando rodadas, para destrancar a próxima */
export const ONDAS_PARA_ABRIR = 15;

export interface FichaDaArma {
  readonly id: ArmaId;
  readonly nome: string;
  /** com artigo, para as falas: "o regador", "a mangueira" */
  readonly comArtigo: string;
  readonly icone: string;
  /** o jeito dela em uma frase, para o painel */
  readonly descricao: string;
  /** a arma com que se jogam as 15 ondas que destrancam esta (`null` = vem de começo) */
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
      f.jato.daMangueira = true;
    },
  },
  /*
   * A PISTOLA D'ÁGUA: a que alcança longe. Um tiro só, reto e fino, de
   * bolinhas d'água grandes — nada de leque, é mira. Alcance 5,0 (o regador
   * tem 3,0), 0,55 de força a cada 0,5 s (1,1 por segundo). O tanque é pequeno
   * (8), mas cada tiro gasta meia água: 16 tiros, uns 8 s atirando sem parar,
   * e aí é voltar ao tonel. Pode ir ao pátio, como o regador.
   */
  {
    id: 'pistola', nome: "Pistola d'água", comArtigo: "a pistola d'água", icone: '🔫', anterior: 'mangueira', pronta: true,
    descricao: 'Tiros de bolinha, retos e de longe, um bicho por vez. Tanque pequeno: volta sempre ao tonel.',
    base: (f) => {
      f.alcance = 5.0;
      f.dano = 0.55;
      f.cadencia = 0.5;
      f.largura = 6;
      f.tanque = 8;
      f.gastoPorJato = 0.5;
      f.jato.pistola = true;
    },
  },
  /*
   * O BORRIFADOR: o de ÁREA (pedido do Renan: "o ataque padrão dele é feito
   * para ser em área, para acertar todos os inimigos dentro de uma área"). Cada
   * aperto no gatilho solta uma NÉVOA que cai no bicho escolhido e vira uma
   * nuvem de ~1,15 m de raio: todo bicho dentro dela se molha, sem sombra de um
   * no outro. Por bicho ela é fraca — 0,4 a cada 0,55 s (0,73 por segundo,
   * contra 0,9 do regador) —, e o alcance é curto (2,6): o forte dele é bando.
   * Contra os grandes quem ajuda são as cartas dele (Concentrado, Encharcado,
   * Nuvem teimosa). O raio da nuvem sai da `largura` (o Leque aberto aumenta)
   * vezes o `raioDaNevoa` (a Névoa larga). Tanque de 10, meia água por aperto.
   */
  {
    id: 'borrifador', nome: 'Borrifador', comArtigo: 'o borrifador', icone: '🧴', anterior: 'pistola', pronta: true,
    descricao: 'Uma névoa que molha todos os bichos de uma área. Fraca num só, forte contra bando.',
    base: (f) => {
      f.alcance = 2.6;
      f.dano = 0.4;
      f.cadencia = 0.55;
      f.largura = 50;
      f.tanque = 10;
      f.gastoPorJato = 0.5;
      f.jato.nevoa = true;
    },
  },
];

export function armaPorId(id: string): FichaDaArma | undefined {
  return ARMAS.find((a) => a.id === id);
}

/** o contador do save com o recorde (a maior onda vencida) de uma arma */
export function chaveDoRecorde(arma: ArmaId): string {
  return `jardim.recorde.${arma}`;
}

/**
 * o contador do save com as ONDAS JOGADAS com uma arma, somando todas as
 * rodadas que acabaram (é o que destranca a próxima)
 */
export function chaveDasOndas(arma: ArmaId): string {
  return `jardim.ondas.${arma}`;
}

/** o contador do save com a arma escolhida na parede (a posição dela em `ARMAS`) */
export const ARMA_ESCOLHIDA = 'jardim.arma';

/**
 * A ARMA ESTÁ DESTRANCADA? A primeira sempre; as outras quando a dupla já
 * jogou 15 ondas com a ANTERIOR, somando as rodadas. Recebe a leitura do save
 * de fora: este arquivo não conhece o save.
 */
export function destrancada(arma: FichaDaArma, ondasCom: (a: ArmaId) => number): boolean {
  return arma.anterior === null || ondasCom(arma.anterior) >= ONDAS_PARA_ABRIR;
}
