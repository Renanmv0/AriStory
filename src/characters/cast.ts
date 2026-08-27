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

/**
 * Renan, montado a partir das fotos: cachos escuros e volumosos no topo com
 * franja caindo, pele clara, camiseta cinza por baixo de um moletom preto
 * aberto, calça e tênis pretos, mochila.
 */
export const RENAN: CharacterSpec = {
  id: 'renan',
  name: 'Renan',
  height: 1.78,
  build: 'magro',
  skin: 0xefc8a4,
  blush: 0xefc8a4, // sem blush: fica só no Ari, combina mais com ele
  eyes: 0x241d18,
  hair: {
    color: 0x1f1712,
    style: 'cachos-curtos', // silhueta propria, nao so a do Ari com outra cor
    volume: 1.0,
  },
  shirt: 0x8d8f97, // camiseta cinza, aparece pela fresta do moletom
  pants: 0x22232a,
  shoes: 0x1b1c20,
  swim: 0x22232a,
  jacket: 0x191a1f,
  accessories: ['mochila'],
  accessoryColor: 0x191a1f,
};

export const CAST: Record<string, CharacterSpec> = {
  ari: ARI,
  renan: RENAN,
};

/** Quem o jogo carrega no começo: o Ari é o principal, o Renan é o par. */
export const DUPLA = [ARI, RENAN] as const;
