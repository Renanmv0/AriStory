/**
 * Paleta central do AriStory.
 * Regra de estilo: cores saturadas mas suaves, sombra toon em 4 degraus.
 * Sempre pegue cores daqui em vez de escrever hex solto nas cenas.
 */
export const PALETTE = {
  // ceu e ambiente
  skyDay: 0x8ed6ff,
  skyDusk: 0xf7b58a,
  skyNight: 0x2b3a67,
  sunWarm: 0xfff2d0,
  bounce: 0x9ec8ff,

  // terreno
  grass: 0x7ec850,
  grassDark: 0x63ad3e,
  grassDry: 0xa8c25a,
  dirt: 0xb98a54,
  sand: 0xe6d3a3,
  asphalt: 0x6b6f76,
  concrete: 0xc9c8c2,
  water: 0x4fb6d8,

  // natureza
  trunk: 0x8b5a2b,
  leafLight: 0x67c05a,
  leafMid: 0x4ea648,
  leafDark: 0x3a8138,
  bush: 0x5cb04f,
  flowerPink: 0xff8fb1,
  flowerYellow: 0xffd85e,

  // construcao
  wood: 0xb5793a,
  woodDark: 0x8a5a2a,
  metalWhite: 0xf2f5f7,
  metalGrey: 0xa9b2ba,
  metalRed: 0xd9603f,
  glass: 0xb9e6f5,
  brick: 0xc76a52,
  wallCream: 0xf3e7d3,
  wallMint: 0xd6ece0,
  wallAzul: 0xcfe4f5,
  roofTile: 0xc4573f,
  fabricRed: 0xe0524a,
  fabricBlue: 0x4a7fe0,
  mesaVerde: 0x2f6f57,

  // interiores
  floorWood: 0xc9975c,
  rug: 0xd98fa6,
  sofa: 0x6d8fd6,
  screen: 0x2a2f3a,
  plantPot: 0xd08a5f,

  // roupas do guarda-roupa (peca de acervo e item de mundo, entao a cor sai
  // daqui; as cores das fichas em cast.ts sao hex solto por serem identidade
  // de pessoa, nao peca trocavel)
  roupaLa: 0xd96b7a,
  roupaLaBarra: 0xf6e3c8,
  roupaListra: 0x4a7fe0,
  roupaListraManga: 0xf3f1ec,
  roupaJeans: 0x3f5a86,
  roupaBota: 0xffc94d,
  roupaBotaCano: 0x8a5a2a,
  // o vestido da vitrine: rosa bem lavado, renda quase branca e a fita um tom
  // acima, que e o que separa o laco do resto na foto
  vestidoRosa: 0xf6d3d8,
  vestidoRenda: 0xfdf7f0,
  vestidoFita: 0xf0aebd,
  // os dois maid da mesma loja: preto lavado (preto puro come o degrade do toon
  // e vira silhueta chapada), creme do avental e a fita preta do debrum
  maidPreto: 0x2b2a33,
  maidCreme: 0xfaf6ee,
  maidFita: 0x17161c,
  maidLacoVermelho: 0xc23444,
  // o wa-maid da ilustracao: o preto dele puxa para o roxo, e sao dois rosas —
  // o claro do quimono e o forte da fita e das fivelas
  waRosa: 0xf0b6c8,
  waRosaForte: 0xd9738f,
  waEscuro: 0x3b3547,
  waBranco: 0xfdfaf5,
  waFivela: 0xb9b6c0,

  // ui / afeto
  heart: 0xff6b8b,
  gold: 0xffc94d,
  frisbee: 0xff7a59,
  morango: 0xff8fa8,
  maracuja: 0xffc94d,
  chocolate: 0x7a4a2b,
  laranja: 0xff9b3d,
  limao: 0xc7de52,
  pessego: 0xffb066,
} as const;

export type PaletteKey = keyof typeof PALETTE;
