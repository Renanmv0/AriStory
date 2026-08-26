import type { CharacterSpec } from './spec';

/**
 * O elenco do AriStory.
 *
 * ATENCAO: estes valores sao um PRIMEIRO RASCUNHO. A ideia e ajustar juntos:
 * abra docs/PERSONAGENS.md, veja o mapa de cores/estilos e troque so os campos
 * daqui. Nao precisa mexer em nenhum outro arquivo para mudar um personagem.
 */

export const ARI: CharacterSpec = {
  id: 'ari',
  name: 'Ari',
  height: 1.74,
  build: 'medio',
  skin: 0xe8b48c,
  blush: 0xff9aa8,
  eyes: 0x3a2b26,
  hair: { color: 0x3b2418, style: 'cacheado' },
  shirt: 0x5fb0d6,
  shirtAccent: 0xffffff,
  pants: 0x3f4a63,
  shoes: 0xf4f4f2,
  accessories: ['oculos'],
  accessoryColor: 0x2f3440,
};

export const RENAN: CharacterSpec = {
  id: 'renan',
  name: 'Renan',
  height: 1.78,
  build: 'magro',
  skin: 0xf0c39c,
  blush: 0xff9aa8,
  eyes: 0x2f2a33,
  hair: { color: 0x2a1e1a, style: 'ondulado' },
  shirt: 0xe07a5f,
  shirtAccent: 0xfff2d0,
  pants: 0x2f3440,
  shoes: 0x2f3440,
  accessories: ['relogio'],
  accessoryColor: 0x2f3440,
};

export const CAST: Record<string, CharacterSpec> = {
  ari: ARI,
  renan: RENAN,
};
