/*
 * 🎃 O ESPECIAL DE HALLOWEEN — A CHAVE E O QUE FICA GUARDADO
 *
 * Este é o arquivo do evento. Ele diz se o Halloween está no jogo e onde
 * mora cada coisa dele, para usar outra vez quando o Renan quiser.
 *
 * LIGADO ATÉ O RENAN MANDAR TIRAR (decisão dele): sem calendário, sem data.
 * Quem joga pelo link de sempre encontra o evento no save de verdade — ele
 * começa no sofá da casa do Ari ("Assistir um filme de terror").
 *
 * PARA TIRAR DO JOGO: `HALLOWEEN_NO_JOGO = false`. Nada é apagado: o parque,
 * o clube, a escola e a casa voltam a ser os de sempre (o evento é uma
 * CAMADA por cima deles, `docs/HALLOWEEN.md` §8.3), e o código do evento
 * continua todo aqui, guardado. As fantasias e as coroas que a dupla já
 * ganhou continuam no guarda-roupa dos dois, e as memórias no quadro e no
 * diário — o evento acaba, o que eles ganharam fica.
 *
 * PARA USAR OUTRA VEZ: `HALLOWEEN_NO_JOGO = true`. Para a dupla jogar a
 * história de novo do começo (num outro ano), troque também a
 * `EDICAO_DO_HALLOWEEN`: na primeira vez que o jogo abre numa edição nova, o
 * save esquece as fases da edição de antes (as flags `halloween:*`) e o
 * evento recomeça no sofá — as fantasias, as coroas e as memórias ficam.
 *
 * O QUE FICA GUARDADO, E ONDE:
 *
 * - O PARQUE ENFEITADO (o pôr do sol do convite e a noite da festa):
 *   `eventos/halloween/noParque.ts` monta tudo — as abóboras esculpidas, os
 *   varais de bandeirola e de luzinha, os fantasminhas e os morceguinhos
 *   pendurados, as lápides fofas, os infláveis gigantes, o arco de balões, o
 *   espantalho da entrada, o lago roxo com o Nessie de plástico, o céu
 *   (`ceu.ts`), a repintura roxa e laranja dos lugares, a barraquinha de
 *   cachorro-quente do Walter e o portão laranja da Casinha. As peças moram
 *   em `world/halloween/` (o kit inteiro numa vitrine: `world/halloween/kit.ts`).
 * - A FESTA: os postos de cada um no parque (`naFesta.ts`), a chegada do
 *   ônibus (`chegadaDoOnibus.ts`), a caça de doces ou travessuras (`caca.ts`)
 *   e a Casinha da Abóbora por dentro (`dentroDaCasinha.ts`, `noSalao.ts`).
 * - A BOUTIQUE ENFEITADA e o presente da Estella: `naBoutique.ts`.
 * - A CASA: o filme de terror e a carta (`naCasa.ts`), e a madrugada e o
 *   sono do fim (`casaDeNoite.ts`, `noQuarto.ts`).
 * - AS FANTASIAS DOS PERSONAGENS: `world/halloween/fantasiasDoParque.ts`,
 *   `fantasiasDoClube.ts`, `fantasiasDaEscola.ts` e `fantasiasDosBichos.ts`
 *   (a Estella de aranha e o Pelusa morceguinho), vestidas por
 *   `eventos/halloween/fantasiados.ts`.
 * - AS FANTASIAS DA DUPLA: as fichas em `world/itens.ts`
 *   (`FANTASIAS_DA_ESTELLA` — o vampiro e o morceguinho —, `FANTASIAS_DA_CACA`
 *   — a abóbora, o pirata, o gato preto, o espantalho e o bruxinho — e
 *   `COROAS_DO_CONCURSO`), com a geometria em `world/fantasias.ts`,
 *   `world/fantasiasDaCaca.ts` e `world/coroasDoConcurso.ts`. Estas são
 *   roupa do guarda-roupa: ficam no jogo mesmo com o evento desligado.
 * - O PLANO, as decisões e as falas: `docs/HALLOWEEN.md`.
 * - O ponto de volta no git, o jogo exatamente como era antes do evento:
 *   o commit `976060197456697b094805ba9286ebb75056dcac` da `main`.
 */

/** O Halloween está no jogo? Desligar é trocar para `false` — nada se apaga. */
export const HALLOWEEN_NO_JOGO = true;

/**
 * A edição do evento. Trocar (para jogar a história de novo noutro ano) faz o
 * save esquecer as fases da edição de antes na primeira vez que o jogo abre.
 */
export const EDICAO_DO_HALLOWEEN = '2026';

/**
 * O evento existe nesta página? Com o `HALLOWEEN_NO_JOGO`, sim; e os testes
 * forçam pelo endereço: `?halloween` liga (num save de teste à parte) e
 * `?semHalloween` desliga (o jogo exatamente como sem o evento).
 */
export function halloweenNestaPagina(): boolean {
  if (typeof location === 'undefined') return HALLOWEEN_NO_JOGO;
  const params = new URLSearchParams(location.search);
  if (params.has('semHalloween')) return false;
  if (params.has('halloween')) return true;
  return HALLOWEEN_NO_JOGO;
}
