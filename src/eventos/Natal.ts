// A data de lançamento será escolhida pelo Renan. O calendário do aparelho não ativa o especial.
export const NATAL_NO_JOGO = false;
export const TESTE_DE_NATAL = typeof location !== 'undefined' && new URLSearchParams(location.search).has('natal');
