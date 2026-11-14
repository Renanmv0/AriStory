/*
 * 🚙 O BEBITO MOBILE — A CHAVE
 *
 * O carro do casal e tudo o que vem com ele (`docs/BEBITO-MOBILE.md`): a
 * frente da casa do Ari (o jardim e a garagem), a quest do presente e as
 * viagens de carro.
 *
 * ESTADO: LIGADO (2026-11-12). O Renan pediu (2026-11-11) que nada disso
 * aparecesse até estar pronto, e no dia seguinte, depois de testar a viagem
 * no celular, mandou pôr no jogo o que já existe, para o Ari ver no link
 * principal: "coloque o que já temos no jogo mesmo". Com a chave em `true`,
 * a porta da casa sai no jardim, a cama do quarto (depois da lição 10) começa
 * a surpresa, o carro mora na garagem e as viagens funcionam. O que ainda
 * falta (o carro por dentro, as outras rotas…) entra por cima, atrás de
 * `bebitoMobileNestaPagina()` como sempre — ver `docs/BEBITO-MOBILE-DENTRO.md`.
 *
 * Para ver o jogo SEM nada disso (os testes do "escondido"): `?semBebito`.
 *
 * PARA VER ANTES DA HORA (os testes e o Renan): `?bebito` no endereço liga
 * tudo NUM SAVE À PARTE (`aristory.save.v1.bebito`, que nasce como cópia do
 * de verdade): dá para jogar a quest inteira sem gastar a surpresa no save
 * do jogo. `?semBebito` força desligado (é o que os testes do "escondido"
 * usam agora que a chave está ligada).
 *
 * PARA TIRAR DO JOGO outra vez: `BEBITO_MOBILE_NO_JOGO = false`. Só isso.
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

/** O Bebito Mobile está no jogo? Ligado em 2026-11-12, a pedido do Renan. */
export const BEBITO_MOBILE_NO_JOGO = true;

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
 * ONDE O CARRO ESTÁ: em casa, no parque ou no estacionamento do clube.
 * Quem muda é a chegada de cada viagem (`scenes/viagemDeCarro.ts`).
 */
export const FLAG_DO_CARRO_NO_PARQUE = 'bebito:carro-no-parque';
export const FLAG_DO_CARRO_NO_CLUBE = 'bebito:carro-no-clube';
export const FLAG_DO_CARRO_NA_ESCOLA = 'bebito:carro-na-escola';

/** Mantém os saves antigos: sem as flags, o carro continua na garagem. */
export function localDoBebito(g: { flag: (chave: string) => boolean }): 'casa' | 'parque' | 'clube' | 'escola' {
  return g.flag(FLAG_DO_CARRO_NA_ESCOLA) ? 'escola' : g.flag(FLAG_DO_CARRO_NO_CLUBE) ? 'clube' : g.flag(FLAG_DO_CARRO_NO_PARQUE) ? 'parque' : 'casa';
}

/**
 * O CARRO POR DENTRO (`docs/BEBITO-MOBILE-DENTRO.md`): entrar no carro na
 * garagem (a porta que gira, a câmera dentro dele), descansar com os bancos
 * deitados e a visão do passageiro na viagem, com o piloto automático.
 *
 * Tem a PRÓPRIA chave, e não a do carro: a chave do carro está ligada desde
 * 2026-11-12 (o Ari já joga com ele), então o que se acrescenta por cima nasceu
 * desligado. LIGADA em 2026-11-12 a pedido do Renan ("quero as mudanças no jogo"),
 * antes de rodar as últimas checagens (a de "Viajar" de dentro do carro e a da
 * estrada sem a chave). `?carroPorDentro` liga na marra e `?semCarroPorDentro`
 * força desligado (para os testes do "escondido").
 */
export const CARRO_POR_DENTRO_NO_JOGO = true;

/** o carro por dentro existe nesta página? (o carro ligado, e a chave dele ou `?carroPorDentro`) */
export function carroPorDentroNestaPagina(): boolean {
  if (!bebitoMobileNestaPagina()) return false;
  if (typeof location === 'undefined') return CARRO_POR_DENTRO_NO_JOGO;
  const params = new URLSearchParams(location.search);
  if (params.has('semCarroPorDentro')) return false;
  if (params.has('carroPorDentro')) return true;
  return CARRO_POR_DENTRO_NO_JOGO;
}
