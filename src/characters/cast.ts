import type { CharacterSpec } from './spec';

/**
 * O elenco do AriStory.
 *
 * O Ari foi montado a partir de foto e da ilustração de referência: cachos
 * castanho-acobreado bem volumosos com franja, presilha de estrela, blusa
 * branca felpuda com laço preto, jeans largo e tênis branco.
 *
 * Para ajustar alguém, mexa só aqui — ver docs/PERSONAGENS.md.
 */

export const ARI: CharacterSpec = {
  id: 'ari',
  name: 'Ari',
  height: 1.72,
  build: 'magro',
  skin: 0xf2cfb2,
  blush: 0xff8fa0,
  eyes: 0x4a3328,
  hair: {
    color: 0x8f5c33,
    style: 'cacheado',
    volume: 1.28,
    tips: 0xa9713f, // mechas mais claras, como na foto
  },
  shirt: 0xf8f5f0,
  pants: 0x5b7ba8,
  shoes: 0xf4f4f2,
  swim: 0x5fb0d6,
  accessories: ['presilha', 'laco', 'cinto'],
  accessoryColor: 0x24222a,
};

export const RENAN: CharacterSpec = {
  id: 'renan',
  name: 'Renan',
  height: 1.76,
  build: 'magro',
  skin: 0xf0c8a8,
  blush: 0xff9aa8,
  eyes: 0x2f2620,
  hair: {
    color: 0x3a2a20,
    style: 'cacheado',
    volume: 0.72, // cachos curtos, colados
  },
  shirt: 0x35414f,
  shirtAccent: 0x2a3340,
  pants: 0x8a7a5c,
  shoes: 0x2f3440,
  swim: 0x35414f,
  accessories: ['relogio'],
  accessoryColor: 0x2f3440,
};

export const CAST: Record<string, CharacterSpec> = {
  ari: ARI,
  renan: RENAN,
};

/** Quem o jogo carrega no começo: o Ari é o principal, o Renan é o par. */
export const DUPLA = [ARI, RENAN] as const;
