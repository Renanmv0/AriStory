/*
 * 🚙 O BEBITO MOBILE — A CHAVE
 *
 * O carro do casal e tudo o que vem com ele (`docs/BEBITO-MOBILE.md`): a
 * frente da casa do Ari (o jardim e a garagem), a quest do presente e as
 * viagens de carro.
 *
 * ESTADO: DESLIGADO. O Renan pediu (2026-11-11) que NADA disso apareça no jogo
 * até tudo estar pronto — a quest, as viagens e o acabamento. Enquanto esta
 * chave estiver em `false`, quem joga pelo link de sempre encontra o jogo
 * exatamente como era: a porta da casa leva direto ao parque, a cama do
 * quarto é a de sempre, e o save não ganha flag nenhuma do carro.
 *
 * PARA VER ANTES DA HORA (os testes e o Renan): `?bebito` no endereço liga
 * tudo NUM SAVE À PARTE (`aristory.save.v1.bebito`, que nasce como cópia do
 * de verdade): dá para jogar a quest inteira sem gastar a surpresa no save
 * do jogo. `?semBebito` força desligado, para quando a chave estiver ligada.
 *
 * PARA PÔR NO JOGO, no fim: `BEBITO_MOBILE_NO_JOGO = true`. Só isso.
 *
 * O QUE A CHAVE ESCONDE, E ONDE MORA:
 * - a cena `frente-da-casa` (`scenes/frenteDaCasa.ts`, peças em
 *   `world/frenteDaCasa.ts`): com a chave ligada, a porta da rua da casa sai
 *   no jardim, e o portão do jardim é que leva ao parque;
 * - a quest do presente (`eventos/bebitoMobile/presente.ts`): depois da lição
 *   10 da apostila do Gatito, dormir na cama do quarto do Ari começa a
 *   surpresa;
 * - o carro estacionado na garagem, depois do presente;
 * - a VIAGEM DE CARRO (`scenes/viagemDeCarro.ts`, `eventos/bebitoMobile/rota.ts`):
 *   sair de carro pela garagem, dirigir até o Villa Lobos e voltar.
 * O modelo do carro (`world/bebitoMobile/`) e a ficha no save existem sempre:
 * são kit e dado, e não aparecem sozinhos.
 */

/** O Bebito Mobile está no jogo? Ligar é trocar para `true`, quando tudo estiver pronto. */
export const BEBITO_MOBILE_NO_JOGO = false;

/** O carro e a quest existem nesta página? (a chave, ou `?bebito` nos testes) */
export function bebitoMobileNestaPagina(): boolean {
  if (typeof location === 'undefined') return BEBITO_MOBILE_NO_JOGO;
  const params = new URLSearchParams(location.search);
  if (params.has('semBebito')) return false;
  if (params.has('bebito')) return true;
  return BEBITO_MOBILE_NO_JOGO;
}

/** a lição da apostila do Gatito que libera a quest (a 10, "Partiu praia") */
export const LICAO_QUE_LIBERA_O_PRESENTE = 'partiu-praia';

/**
 * AS FASES DA QUEST, que são flags do save (cada uma inclui as de antes):
 *
 * - `surpresa`: os dois dormiram, acordaram, e o Renan perguntou se o Ari
 *   quer ver uma surpresa — a cena da sala vem em seguida;
 * - `saiu`: o Renan disse "já volto" e saiu pela porta; o Ari vai atrás;
 * - `ganhou`: o Renan chegou dirigindo, estacionou na garagem e entregou o
 *   carro. Daqui em diante o Bebito Mobile mora na garagem.
 */
export const FASES_DO_PRESENTE = {
  surpresa: 'bebito:surpresa',
  saiu: 'bebito:renan-saiu',
  ganhou: 'bebito:ganhou',
} as const;

/**
 * ONDE O CARRO ESTÁ: em casa (na garagem) ou no parque (na rua do ônibus).
 * Quem muda é a chegada de cada viagem (`scenes/viagemDeCarro.ts`).
 */
export const FLAG_DO_CARRO_NO_PARQUE = 'bebito:carro-no-parque';
