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
  cortica: 0xd7a76a,
  corticaEscura: 0xb9884f,
  // o fundo da estante, um degrau abaixo da madeira dela: e o que da a sombra
  // do vao e faz os livros parecerem DENTRO da peca
  estanteFundo: 0x6b4520,

  // o Pelusa, da foto: branco creme no peito e nas patas, e o cinza-taupe da
  // mascara, do dorso e da cauda listrada
  pelusaBranco: 0xf6f2ea,
  pelusaCinza: 0xa89e91,
  pelusaCinzaEscuro: 0x8a8074,
  pelusaFocinho: 0xe8a7ad,
  pelusaOrelha: 0xdba9a8,
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
  // o moletom preto da foto do provador: preto lavado puxando para o cinza (o
  // mesmo motivo do maid — preto puro come o degrade do toon), a costura um
  // degrau abaixo dele, o ziper um degrau acima para virar uma linha visivel no
  // meio do peito, o forro do capuz mais claro e as ponteiras do cordao da barra
  // quase brancas, como aparecem na foto
  moletomPreto: 0x26262c,
  moletomCostura: 0x141418,
  moletomZiper: 0x45464f,
  moletomForro: 0x53545e,
  moletomPonteira: 0xd9d6cd,
  // o wa-maid da ilustracao: o preto dele puxa para o roxo, e sao dois rosas —
  // o claro do quimono e o forte da fita e das fivelas
  waRosa: 0xf0b6c8,
  waRosaForte: 0xd9738f,
  waEscuro: 0x3b3547,
  waBranco: 0xfdfaf5,
  waFivela: 0xb9b6c0,
  // moda praia do vestiário do clube. O calção é a única peça que aparece no
  // traje de banho, então as cores precisam se separar de longe na beira da
  // piscina — daí três tons cheios em vez de três lavados.
  bermudaAzul: 0x2f7fd0,
  bermudaVermelha: 0xd8453f,
  bermudaAmarela: 0xf2b829,
  // a estampada: fundo turquesa com duas faixas cor de areia
  bermudaEstampa: 0x2fb5a8,
  bermudaEstampaFaixa: 0xfdf0d5,
  // óculos de sol: lente quase preta (preto puro come o degradê do toon) e a
  // armação um degrau acima, para a lente não virar uma mancha só
  oculosLente: 0x23212b,
  oculosArmacao: 0x3d3b48,

  // a comida servida na mesa do restaurante. São as MESMAS cores da miniatura
  // 2D do cardápio (`world/cardapioData.ts`), agora em hex de material: o prato
  // que o cachorro traz tem que ser reconhecível como o que foi escolhido no
  // papel, e cor diferente quebraria justamente isso.
  arepaMilho: 0xe9c179,
  arepaTostada: 0xcf9a48,
  arepaQueijo: 0xfbe6a6,
  hamburguerPao: 0xe2a961,
  hamburguerGergelim: 0xf8ebcf,
  hamburguerCarne: 0x7c4423,
  hamburguerCarneEscura: 0x5e3018,
  hamburguerAlface: 0x77c05a,
  hamburguerBatata: 0xf2c14e,
  perroSalsicha: 0xd5654b,
  perroKetchup: 0xd63b34,
  perroMostarda: 0xf0b429,

  // o garçom canino: pelo caramelo, peito e patas cor de creme, e a gravata
  // borboleta vinho que é o que o transforma de cachorro em garçom
  cachorroPelo: 0xc98b52,
  cachorroPeito: 0xf3e0c4,
  cachorroOrelha: 0xa96f3c,
  cachorroFocinho: 0x4a3a33,
  gravataBorboleta: 0xa8324a,
  gravataNo: 0x86243a,

  // o vestiário do clube: a faixa de azulejo que todo vestiário de piscina tem
  // na meia parede, o rejunte um degrau abaixo dela, a porta de veneziana e a
  // caixa d'água azul do telhado
  vestiarioAzulejo: 0x8ec3dd,
  vestiarioRejunte: 0x6ba8cc,
  vestiarioPorta: 0x2f6f8f,
  vestiarioCaixa: 0x3f6fb0,

  // o restaurante do clube: parede de massa clara puxando para o pêssego, o
  // verde do toldo listrado (irmão do teal do bar de sucos, para o clube ter
  // uma cor só), a madeira dos caixilhos e o piso do deque da área externa
  restauranteParede: 0xf3e3cf,
  restauranteFaixa: 0xe2c9ab,
  restauranteToldo: 0x2f9e79,
  restauranteEsquadria: 0x6b4a2c,
  restauranteDeck: 0xc08a52,
  restauranteDeckRipa: 0xb07c46,

  // o muro e o portão da entrada do clube. O corpo é a mesma massa clara do
  // restaurante, meio tom acima; a base e o chapim são o reboco mais queimado
  // que toda mureta de rua tem. O portão é o teal do clube (irmão do toldo do
  // restaurante e do bar de sucos) com as pontas de lança douradas.
  muroCorpo: 0xf0e4d0,
  muroPainel: 0xf7eee0,
  muroBase: 0xd6c3a4,
  muroChapim: 0xcbb493,
  portaoMetal: 0x2f7d6b,
  portaoFerro: 0x24564c,
  luzDoPortao: 0xfff3c8,

  // a guarita da entrada e a girafa que toma conta dela. O pelo é o amarelo
  // queimado de girafa de verdade, e a mancha um tom de canela bem mais escuro
  // — sem essa distância as manchas somem no toon shading. O quepe é o mesmo
  // teal do portão, para o porteiro pertencer ao clube.
  girafaPelo: 0xf0c46a,
  girafaMancha: 0xa9702c,
  girafaClaro: 0xfae7bd,
  girafaCasco: 0x5b432c,
  girafaCrina: 0x8a5a2a,
  // a salva-vidas da piscina: capivara. O pelo e o castanho-avermelhado dela de
  // verdade, e o focinho um tom mais escuro — capivara nao tem mancha, entao o
  // que separa cabeca de corpo aqui e so o focinho e a orelhinha.
  capivaraPelo: 0x9c6a44,
  capivaraEscuro: 0x74492c,
  capivaraClaro: 0xc39468,
  capivaraFocinho: 0x4a3128,
  // o vermelho de salva-vidas: uniforme, boia e a faixa da cadeira. E o mesmo
  // tom em tudo de propósito — e ele que diz "esta e a pessoa do resgate".
  salvaVidasVermelho: 0xd8382f,
  salvaVidasBranco: 0xf7f2e8,
  cadeiraDeGuarda: 0xe8d9b8,

  // o Noel, o peru do bar de sucos. A pena e marrom-escuro com brilho de
  // bronze; o leque da cauda alterna essa base com a barra clara da ponta, que
  // e o que faz o leque LER como leque em vez de mancha. A cabeca e pescoco sao
  // pelados: azul-acinzentado com a carúncula e o barbelo vermelhos.
  peruPena: 0x6b4a34,
  peruPenaClara: 0xb98d5e,
  peruBarra: 0xf0dcb4,
  peruCabeca: 0x8ba3b8,
  peruCarunculo: 0xd44a3f,
  peruBico: 0xe8c073,
  peruPata: 0xe09a3c,
  // a roupinha de vendedor: o avental no mesmo teal do quiosque de suco, para
  // ele pertencer ao bar, e a viseira clara
  aventalDoNoel: 0x4ec1a8,
  aventalFaixa: 0xf7f2e8,

  // O MANO, o pinguim sorveteiro do quiosque do Villa Lobos. O casaco NAO e
  // preto: preto chapado some na sombra do toon e o bicho vira um buraco. E um
  // azul-ardosia bem escuro, que ainda mostra volume.
  pinguimCasaco: 0x39415a,
  pinguimCasacoLuz: 0x4c5573,
  pinguimBarriga: 0xfbf4e8,
  pinguimBico: 0xf0a340,
  pinguimBicoEscuro: 0xd07f22,
  pinguimBochecha: 0xf2a0a8,
  // o chapeuzinho de casquinha: o mesmo bege de waffle do sorvete do jogo, com
  // o quadriculado num tom so um degrau mais escuro — mais que isso vira grade
  casquinhaWaffle: 0xe3ab63,
  casquinhaGrelha: 0xc08640,
  cerejaDoMano: 0xcf3a4e,
  // a roupinha de sorveteiro: o MESMO rosa do quiosque de sorvete (0xf6a6c0),
  // para ele pertencer ao lugar — a mesma regra do avental teal do Noel
  aventalDoMano: 0xf6a6c0,
  aventalDoManoFaixa: 0xfbf4e8,

  // o jardim da Josefina, no gramado do fundo. A terra e escura e umida (ela
  // rega); o barro dos vasos e o mesmo terracota das jardineiras do resto do
  // jogo, para o jardim pertencer ao clube.
  terraDeCanteiro: 0x6b4a33,
  terraUmida: 0x54382a,
  barroDoVaso: 0xc2703f,
  barroDaBorda: 0xa85b32,
  cercaDeJardim: 0xd9c08a,
  // o montinho de terra remexida entre dois canteiros, e o buraco que sobra
  // depois de cavar. O buraco e QUASE preto de proposito: e a unica coisa do
  // jardim que precisa ler como "vazio" numa camera que achata tudo.
  terraSolta: 0x7a5539,
  buracoDeTerra: 0x2b1c14,
  // o osso enterrado. Osso velho nao e branco: e creme, e amarela nas pontas.
  osso: 0xf0e4c8,
  ossoPonta: 0xd8c39a,
  // as plantas, por tipo. Elas precisam ser DIFERENTES entre si em cor E em
  // forma: um jardim inteiro no mesmo verde vira um tapete so.
  folhaAlface: 0x8fc45a,
  folhaSuculenta: 0x6fae86,
  folhaSamambaia: 0x3f7a45,
  florLavanda: 0x9d7ede,
  florGirassol: 0xf2c14b,
  florCamelia: 0xf2909f,
  tomateMaduro: 0xd8402f,

  // a Josefina, a tartaruga jardineira. O casco e verde-oliva com as placas
  // (escudos) mais escuras; a pele e um verde mais claro e amarelado.
  tartarugaCasco: 0x6d8a3f,
  tartarugaEscudo: 0x53692f,
  tartarugaBarriga: 0xc9b878,
  tartarugaPele: 0x92ab5c,
  lacoDaJosefina: 0xf58bb0,

  guaritaParede: 0xf5ead6,
  guaritaFaixa: 0x2f7d6b,
  guaritaBalcao: 0xb07c46,
  guaritaTelhado: 0xc4553f,

  // o deque de descanso da beira da piscina. A madeira é mais clara e mais
  // acinzentada que a do deque do restaurante de propósito: aqui é tábua que
  // vive molhada e pega sol o dia inteiro, e a diferença de tom é o que separa
  // "área de comer" de "área de secar ao sol" sem precisar de placa.
  dequeTabua: 0xd8ac7a,
  dequeRipa: 0xc79a68,
  dequeViga: 0xa9763f,
  dequeTrepadeira: 0x4f9b46,

  // o ônibus que liga o parque ao clube. O azul é o do transporte urbano de
  // São Paulo; o chassi é escuro para a carroceria "flutuar" sobre a sombra da
  // saia, e o cinza do pneu é lavado porque preto puro come o degradê do toon.
  onibusAzul: 0x3f7fd6,
  onibusFaixa: 0xf2f5f7,
  onibusFriso: 0x2a5aa0,
  onibusChassi: 0x33383f,
  onibusPneu: 0x2b2d33,
  onibusCalota: 0xb6bec6,
  onibusPorta: 0x2b3440,
  onibusPainel: 0x1f2229,
  onibusFarol: 0xfff3cc,
  onibusPisca: 0xf2a63b,
  onibusLanterna: 0xd63b34,

  // o abrigo do ponto: estrutura de tubo pintado, teto de telha metálica,
  // vidro fumê nas laterais e o banco de ripa que todo ponto tem
  abrigoEstrutura: 0x5c6874,
  abrigoTeto: 0x2f9e79,
  abrigoVidro: 0xcfe6ef,
  abrigoBanco: 0xb5793a,
  abrigoCartaz: 0xf6d3d8,

  // o Mania de Churrasco, o restaurante por dentro. Churrascaria de verdade é
  // tijolo, inox e madeira escura: o tijolo atrás da grelha, o inox das
  // bancadas de trabalho, a madeira quente do salão. O laranja da brasa é a
  // única cor saturada da cena, e é de propósito — é para onde o olho vai.
  churrascoTijolo: 0xb5573f,
  churrascoRejunte: 0xe0cdb6,
  churrascoParede: 0xf3e2c8,
  churrascoFaixa: 0x8a5a2a,
  churrascoPiso: 0xb07c46,
  churrascoLadrilho: 0xdfe4e2,
  churrascoInox: 0xc3ccd2,
  churrascoInoxEscuro: 0x9aa5ad,
  churrascoBrasa: 0xff6a2b,
  churrascoBrasaViva: 0xffb347,
  churrascoCarvao: 0x33302e,
  churrascoGrelha: 0x5b5f63,
  churrascoToalha: 0xd94f43,
  churrascoQuadroNegro: 0x2f3b33,

  // por dentro da cabine da roda gigante. Este interior só existe durante os
  // quarenta segundos de primeira pessoa lá em cima, e é a ÚNICA coisa que se
  // vê além do parque: piso de borracha escura, banco estofado azul, esquadria
  // branca da janela que dá a volta inteira, e a lâmpada morna do teto.
  cabinePiso: 0x4c545c,
  cabineBanco: 0xa06b34,
  cabineEstofado: 0x5b8fd6,
  cabineEsquadria: 0xeef3f6,
  cabineLuz: 0xffe9b8,

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
