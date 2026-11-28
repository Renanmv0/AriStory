import type { GameAPI } from '../core/types';

// A data de lançamento será escolhida pelo Renan. O calendário do aparelho não ativa o especial.
export const NATAL_NO_JOGO = false;
export const TESTE_DE_NATAL = typeof location !== 'undefined' && new URLSearchParams(location.search).has('natal');

export const ARVORE_ACESA = 'natal:2026:luzes-acesas';
export const VESTIRAM = 'natal:2026:vestiram-os-presentes';
export const CONVITE = 'natal:2026:convite-da-gina';

export function pelusaEspiaANeve(g:GameAPI):boolean {
  return (NATAL_NO_JOGO || TESTE_DE_NATAL) && g.flag(VESTIRAM) && g.flag(ARVORE_ACESA) && !g.flag(CONVITE);
}

export const TOALHA = 'natal:2026:toalha-da-ceia';
export const FLOCO_NA_TOALHA = 'natal:2026:floco-na-toalha';

export function estellaEsperaNaBoutique(g: GameAPI): boolean {
  return (NATAL_NO_JOGO || TESTE_DE_NATAL) && g.flag(CONVITE) && !g.flag(TOALHA);
}

export const SOBREMESA = 'natal:2026:globo-do-mano';
export const MAQUINA_ABERTA = 'natal:2026:maquina-desembrulhada';
export const PRESENTE_COOKIE = 'natal:2026:presente-cookie';
export const PRESENTE_MANO = 'natal:2026:presente-mano';
