import type { GameAPI } from '../../core/types';

/*
 * AS FASES DO ESPECIAL DE HALLOWEEN (`docs/HALLOWEEN.md`, §1).
 *
 * O evento anda por fases guardadas no save, como flags — é a fase, e não o
 * relógio, que diz como o parque, a casa, o clube e a escola estão:
 *
 * - `antes`: o jogo de sempre (o sofá ganha o "Assistir um filme de terror");
 * - `convite`: a carta da Estella foi lida — o parque de manhã, enfeitado e
 *   sem os personagens;
 * - `festa`: a dupla saiu da boutique fantasiada — de noite, todo mundo lá;
 * - `depois`: a festa na Casinha da Abóbora acabou;
 * - `fim`: a dupla dormiu na cama do quarto do Ari — tudo volta ao normal.
 *
 * NADA APARECE NO JOGO ATÉ TUDO ESTAR PRONTO (decisão do Renan): enquanto o
 * evento não for aberto (etapa 8 do plano), só o `?halloween` na URL liga
 * qualquer coisa dele. Sem ele, `eventoLiberado()` é falso e toda cena se
 * monta exatamente como antes do evento.
 *
 * O evento é uma CAMADA (§8.3): quem pergunta a fase só acrescenta ou esconde
 * por cima do original, e nunca o edita.
 */

export type FaseDoHalloween = 'antes' | 'convite' | 'festa' | 'depois' | 'fim';

/** da última para a primeira: a fase é a mais adiantada que já tem flag */
const DEPOIS_DE_ANTES: readonly Exclude<FaseDoHalloween, 'antes'>[] = ['fim', 'depois', 'festa', 'convite'];

/** a flag do save de cada fase */
export const flagDaFase = (fase: Exclude<FaseDoHalloween, 'antes'>): string => `halloween:${fase}`;

/** a carta já deslizou por baixo da porta, mas ainda não foi lida */
export const FLAG_CARTA_NO_CHAO = 'halloween:carta-no-chao';

/**
 * O evento existe neste jogo? Hoje, só com `?halloween` na URL — é o que
 * esconde tudo de quem joga até o Renan aprovar. A etapa 8 liga o calendário.
 */
export function eventoLiberado(): boolean {
  return typeof location !== 'undefined' && new URLSearchParams(location.search).has('halloween');
}

/** A fase em que o evento está (`antes` também quando ele não está liberado). */
export function faseDoHalloween(g: Pick<GameAPI, 'flag'>): FaseDoHalloween {
  if (!eventoLiberado()) return 'antes';
  for (const fase of DEPOIS_DE_ANTES) if (g.flag(flagDaFase(fase))) return fase;
  return 'antes';
}

/** O evento está acontecendo agora (entre a carta lida e a noite de sono)? */
export function noMeioDoEvento(g: Pick<GameAPI, 'flag'>): boolean {
  const fase = faseDoHalloween(g);
  return fase === 'convite' || fase === 'festa' || fase === 'depois';
}

/** Leva o evento para a fase `fase` (as anteriores continuam marcadas). */
export function avancarFase(g: Pick<GameAPI, 'setFlag'>, fase: Exclude<FaseDoHalloween, 'antes'>): void {
  g.setFlag(flagDaFase(fase));
}

/** O enfeite está no parque nesta fase? (do convite até a noite de sono) */
export function parqueEnfeitado(g: Pick<GameAPI, 'flag'>): boolean {
  const fase = faseDoHalloween(g);
  return fase === 'convite' || fase === 'festa' || fase === 'depois';
}

/**
 * Os personagens SAÍRAM DO POSTO de sempre: no `convite` foram se arrumar,
 * e na festa (e no depois dela) estão todos no parque, fantasiados. O clube,
 * o Mania, a estufa e a escola ficam sem eles do convite até a noite de sono
 * (decisão do Renan: "o clube e a escola continuam vazios"). No parque, quem
 * some é só no convite — na festa eles estão lá (`festaNoParque`).
 */
export function quemFoiSeArrumar(g: Pick<GameAPI, 'flag'>): boolean {
  return eventoLiberado() && noMeioDoEvento(g);
}

/**
 * A noite da festa (e o depois dela): o parque de noite, aceso, com todo
 * mundo nos postos da festa — inclusive quem o jogador ainda não destravou
 * (decisão do Renan: "todos vêm, independente da situação").
 */
export function festaNoParque(g: Pick<GameAPI, 'flag'>): boolean {
  const fase = faseDoHalloween(g);
  return fase === 'festa' || fase === 'depois';
}

/**
 * O Pelusa foi passar o evento na boutique da Estella (decisão do Renan: ele
 * dorme num pufe de lá, de morceguinho): do convite até a noite de sono, o
 * quarto do Ari fica sem ele.
 */
export function pelusaNaBoutique(g: Pick<GameAPI, 'flag'>): boolean {
  return eventoLiberado() && noMeioDoEvento(g);
}
