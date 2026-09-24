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
  /*
   * A COLECAO DA ESTELLA — o que esta a venda nas araras da boutique.
   *
   * Sao quatro familias, uma por arara do terreo, e cada familia e um degrade
   * curto em volta de UM tom. Isso nao e enfeite: a arara do mundo ja nasce
   * pintada por `colecao` (world/furniture.ts), e o que o painel vende tem que
   * combinar com o que esta pendurado ali — senao o jogador clica numa arara de
   * pano azul e o painel oferece terracota.
   *
   * As de manga/barra sao sempre um degrau do MESMO tom, e nao uma cor nova:
   * contraste demais numa peca vista a tres metros vira sujeira na tela (a
   * mesma razao do `escuro` das roupas penduradas).
   */
  // arara 1 — camisaria clara
  lojaLinho: 0xf4efe4,
  lojaLinhoManga: 0xdfd4c0,
  lojaMenta: 0x9fd3bd,
  lojaMentaManga: 0x7ab8a1,
  lojaTerracota: 0xc9714f,
  lojaTerracotaManga: 0xa85a3e,
  lojaRegata: 0x63b7d4,
  // arara 2 — vestidos (a mesma geometria do vestido rosa, outras cores)
  lojaVestidoNoite: 0x39456e,
  lojaVestidoNoiteRenda: 0xb9c2e0,
  lojaVestidoJade: 0x2f8a72,
  lojaVestidoJadeRenda: 0xd6efe5,
  lojaVestidoLilas: 0xb99ad4,
  lojaVestidoLilasRenda: 0xf2e9fa,
  lojaVestidoManteiga: 0xf2dd9a,
  lojaVestidoManteigaRenda: 0xfff7df,
  // arara 3 — calcaria
  lojaAlfaiataria: 0x3c3b46,
  lojaCalcaBege: 0xd7c2a0,
  lojaCalcaVinho: 0x7b2f40,
  lojaCalcaOliva: 0x6a7148,
  // arara 4 — frio e pe
  lojaGorroAzul: 0x4f79bd,
  lojaGorroAzulBarra: 0xcfe0f5,
  lojaGorroMusgo: 0x5f7a52,
  lojaGorroMusgoBarra: 0xe4e9d6,
  lojaBotaVermelha: 0xb5372f,
  lojaBotaVermelhaCano: 0x6d2019,
  lojaBotaCreme: 0xf0e6d2,
  lojaBotaCremeCano: 0xbda882,
  /*
   * E A LINHA PREMIUM DO MEZANINO: ouro e prata de verdade (`glow` nao entra
   * em roupa — o brilho aqui e a COR clara com a barra escura, que e o que da
   * o metal num material toon), mais o veludo que acompanha os dois.
   */
  lojaGala: 0xd9b25f,
  lojaGalaRenda: 0xf6e7bf,
  lojaGalaPrata: 0xbcc3cc,
  lojaGalaPrataRenda: 0xeef1f5,
  lojaVeludo: 0x5c2a4d,
  lojaVeludoBarra: 0x8d4b78,
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

  // A ESTUFA DA JOSEFINA, o jardim grande no fundo do jardim do clube.
  // A estrutura e branca com um fio de verde: estufa de verdade e aluminio
  // pintado, e branco puro aqui brigaria com o metal da piscina. O vidro e
  // esverdeado porque ele esta sempre com planta do outro lado.
  estufaEstrutura: 0xeaf1e6,
  estufaVidro: 0xd2ece0,
  estufaBase: 0xbdaa92,
  // por dentro: terra batida no geral, saibro no terreiro do meio. Sao duas
  // cores proximas de proposito — o terreiro precisa LER como area limpa sem
  // virar uma mancha clara no meio da estufa.
  estufaChao: 0xa8906f,
  estufaSaibro: 0xc5ac87,
  // o tonel de agua do canto: chapa galvanizada, e a agua parada dentro
  tonelChapa: 0x8b9aa2,
  tonelAro: 0x6d7c85,
  tonelAgua: 0x4f9fbd,

  // OS TRES PORTOES DE JARDIM no fundo da estufa — por onde os bichos vao
  // entrar. A pedra e mais fria e mais clara que a alvenaria da soleira, para
  // o portao nao parecer um pedaco da estufa: ele e mais VELHO que ela, como
  // muro de chacara que ja estava ali quando o vidro subiu.
  pedraDoPortao: 0xc4bcae,
  pedraDoPortaoCapa: 0xa79b8a,
  // o ferro do portao: verde escuro de jardim, e nao preto — preto puro come o
  // degrade do toon e vira silhueta chapada
  ferroDoPortao: 0x46594b,

  /*
   * AS PRAGAS DO JARDIM — os bichos do minigame da estufa.
   *
   * ELES SAO UMA FAMILIA DE COR, e isso e requisito de jogo e nao estilo: numa
   * estufa de verde e terracota, com cinco bichos correndo ao mesmo tempo, o
   * jogador precisa separar PRAGA de PLANTA num relance. Entao nenhuma cor
   * daqui existe no jardim — o roxo e acinzentado (a lavanda do canteiro e
   * clara e saturada), o verde e sujo (a folha e limpa) e o laranja de aviso
   * das pincas e garras nao aparece em nada que se planta.
   *
   * E eles nao usam NENHUMA cor de bicho com nome. O Capy, a Josefina, o Noel
   * e os outros sao gente; praga e praga.
   */
  /**
   * O QUE TODAS DIVIDEM: so o olho, a barriga clara e o laranja de aviso. O
   * CORPO de cada uma e cor propria (logo abaixo), porque o jogador precisa
   * dizer QUAL praga e, e nao so que aquilo e uma praga. Uma familia unica de
   * roxo fazia as seis virarem a mesma mancha escura com cinco na tela.
   */
  pragaBarriga: 0xd6c69a,
  /** pinca, unha e dente: o laranja que diz "isto machuca a planta" */
  pragaGarra: 0xe28a3a,
  pragaGarraEscura: 0xb8641f,
  pragaOlho: 0xfaf4e6,
  pragaPupila: 0x211c28,

  /** LAGARTEJO — o roxo acinzentado, que e o mais longe de folha que existe */
  pragaLagartejo: 0x7b5f97,
  pragaLagartejoEscuro: 0x5a4271,
  /** GAFANHOPO — turquesa de sapo. Verde, mas AZULADO: folha nenhuma e assim */
  pragaGafanhopo: 0x3fa08f,
  pragaGafanhopoEscuro: 0x2a7468,
  /**
   * COELHATU — ferrugem de tatu, com as placas num creme bem mais claro.
   *
   * O primeiro terracota (0xb5774c) era quase o chao do terreiro: na foto o
   * bicho sumia no piso. A regra aqui nao e so "cor propria", e tambem
   * "contraste com o chao": o corpo desceu para um ferrugem escuro e as placas
   * subiram para um creme mais claro que o piso, e ele voltou a ter silhueta.
   */
  pragaCoelhatu: 0x9c4626,
  pragaCoelhatuEscuro: 0x74301a,
  pragaCoelhatuCasco: 0xf0dcbb,
  pragaCoelhatuCascoEscuro: 0xd3bc94,
  /** TUCANGURU — azul de tucano, e o bico no amarelo que so ele tem */
  pragaTucanguru: 0x3f5ea8,
  pragaTucanguruEscuro: 0x2a3f78,
  pragaTucanguruBico: 0xf2c247,
  pragaTucanguruBicoEscuro: 0xd18a25,
  /** PREGUIPOLVO — o verde sujo de limo nas costas, o unico esverdeado escuro */
  pragaMusgo: 0x62744a,
  pragaMusgoEscuro: 0x475436,
  /** MAE-LAGARTEJO — o roxo do filho puxado para o vinho: mesma familia, outro bicho */
  pragaMae: 0x93355f,
  pragaMaeEscura: 0x6b2143,
  // a crosta do dorso dela: rosa QUEIMADO, e nao rosa claro. Clara demais, a
  // calota achatada lia como uma tampa de outro material pousada nas costas
  pragaMaeCrosta: 0xae5c80,

  /*
   * A SEGUNDA LEVA (as que estreiam da 15ª onda em diante). A mesma regra da
   * primeira: cada uma com a SUA cor, nenhuma que exista num canteiro, e todas
   * brigando com o saibro bege do terreiro.
   */
  /** a asa de quem voa (libélula, abelha, mosquito): quase branca, um tico azulada */
  pragaAsa: 0xe4f1f5,
  pragaAsaNervura: 0xa9c4cf,
  /** LIBELAGARTO — rosa-chiclete de lagartixa: nem tomate, nem lavanda */
  pragaLibelagarto: 0xee8fb1,
  pragaLibelagartoEscuro: 0xc9648c,
  /**
   * FORMIGURIÇO — ameixa escura de formiga, e os espinhos num caramelo claro.
   * É o menor da estufa: escuro no saibro claro é o que faz ele não sumir.
   */
  pragaFormigurico: 0x4d3a55,
  pragaFormiguricoEscuro: 0x35283c,
  pragaFormiguricoEspinho: 0xe6c49a,
  /** TAMANDUBELHA — mel de abelha com as listras quase pretas */
  pragaTamandubelha: 0xdca535,
  pragaTamandubelhaListra: 0x3a2f2e,
  /** a língua comprida dele (e de quem mais tiver língua): rosa */
  pragaLingua: 0xe98aa0,
  /** MOSQUIPÓTAMO — hipopótamo lilás-azulado, com o focinho rosado */
  pragaMosquipotamo: 0x9194c6,
  pragaMosquipotamoEscuro: 0x676a9e,
  pragaMosquipotamoFocinho: 0xe2b4c6,
  /** RINOCARACOL — cinza de rinoceronte, e a concha de caracol em caramelo */
  pragaRinocaracol: 0x7c8694,
  pragaRinocaracolEscuro: 0x5b6472,
  pragaConcha: 0xe3ac6b,
  pragaConchaEscura: 0xb27a3f,
  /**
   * JAVAPONJA — amarelo de esponja, e os furinhos num marrom de miolo. O
   * primeiro amarelo era frio (0xe8d565) e na sombra do toon puxava para
   * oliva, que é quase folha: esquentou para gema.
   */
  pragaJavaponja: 0xf3cf55,
  pragaJavaponjaEscuro: 0xd0a33a,
  pragaJavaponjaFuro: 0x8f6c2c,
  /**
   * ESCORPICAMELO — o chefe novo. Caramelo de camelo, mais ESCURO que o saibro
   * (areia no saibro sumia), e a cauda de escorpião num marrom mais fundo.
   */
  pragaCamelo: 0xb9854f,
  pragaCameloEscuro: 0x8d6035,
  pragaCameloClaro: 0xe7c89a,
  pragaEscorpiao: 0x76492c,
  pragaEscorpiaoClaro: 0x9a6538,

  /**
   * O REGADOR — a arma do minigame do jardim, e a unica peca do jogo que MUDA
   * DE CARA enquanto se joga (`docs/MINIGAME-JARDIM.md` §6).
   *
   * Sao tres estagios, e a cor e o que os separa de longe: a lata galvanizada
   * que a Josefina empresta, o mesmo corpo com ferragem de LATAO quando o
   * jogador ja pegou tres cartas de regador, e o esmalte verde de competicao
   * do fim de uma rodada boa. O latao aparece nos dois ultimos: ele e o fio
   * que liga os estagios, senao a peca do meio parece de outra familia.
   */
  regadorLata: 0x9aa4aa,
  regadorLataEscura: 0x6c767c,
  regadorLatao: 0xc89a4c,
  regadorLataoEscuro: 0x926d2c,
  regadorEsmalte: 0x2f6b4f,
  regadorEsmalteEscuro: 0x1f4a37,
  /** o cabo lixado do "Braco solto", e o cobre do respiro do "Orvalho" */
  regadorMadeira: 0xa97a4e,
  regadorCobre: 0xb5613a,
  /** a agua que se ve por cima, pela boca aberta, e os furos do crivo */
  regadorAgua: 0x8fd0e8,
  regadorFuro: 0x394045,
  /**
   * A MANGUEIRA, a segunda arma da estufa: a borracha verde-garrafa de toda
   * mangueira de quintal (mais viva que o esmalte do regador, para as duas
   * não se confundirem na parede) e o gatilho de plástico laranja do esguicho.
   */
  mangueiraBorracha: 0x3f8f4a,
  mangueiraBorrachaEscura: 0x2b6634,
  mangueiraGatilho: 0xe8873a,
  /** a pistola d'água e o borrifador, que por enquanto só moram na parede */
  pistolaDagua: 0x3fa7d6,
  pistolaDaguaTanque: 0xf2c94c,
  borrifadorFrasco: 0xe9eef0,
  borrifadorGatilho: 0x7cc47f,
  /**
   * A PAREDE DAS ARMAS: o painel furado de oficina (eucatex cru, os furos em
   * marrom escuro) e a sombra de uma arma ainda trancada — um cinza-azulado
   * que se lê como "tem algo aqui, mas ainda não é seu".
   */
  painelFurado: 0xcfa874,
  painelFuro: 0x6e4f2f,
  armaTrancada: 0x3b4046,

  /**
   * A GOTA DE EXPERIÊNCIA — o que o bicho espantado deixa no chão.
   *
   * Ela é um AZUL-PISCINA saturado, e não o azul claro da água do regador: tem
   * que saltar do saibro bege do terreiro e do verde dos canteiros de longe,
   * com cinco bichos na tela. Nenhuma praga e nenhuma planta usa esse tom.
   */
  gotaAgua: 0x3cc4ee,
  gotaAguaFunda: 0x1f8fc4,
  gotaBrilho: 0xf4fdff,
  /** a sombra dela no chão, translúcida: azul-escuro, para puxar o tom da gota */
  gotaSombra: 0x10324a,

  /**
   * O JATO DO REGADOR — a animação de ataque da rodada do jardim.
   *
   * A água do jato é CLARA (o azul da rega), e não o azul-piscina da gota de
   * experiência: no meio da rodada as duas estão na tela ao mesmo tempo, e a
   * gota no chão é a que precisa chamar o olho. O miolo do jato é quase branco
   * — é o brilho que faz água parecer água num desenho chapado.
   */
  jatoAgua: 0x9fdcf2,
  jatoMiolo: 0xeefaff,
  jatoFundo: 0x5fb6de,
  /** o respingo no bicho e o anel que abre no chão */
  jatoRespingo: 0xd8f3ff,
  /** a Poça e o rastro da Garoa: água parada, um azul mais fundo e brilhante */
  jatoPoca: 0x6fc3e6,
  /** o Orvalho e a Água morna: vapor branco, translúcido */
  jatoVapor: 0xf6fbff,
  /** a Gota gelada: água azul-gelo e os cristais no bicho */
  jatoGelo: 0xc8f0ff,
  jatoCristal: 0xffffff,
  /** a Água com sabão: bolha lilás-perolada, que é o furta-cor possível em toon */
  jatoSabao: 0xf0dcff,
  jatoSabaoBorda: 0xbfe8ff,
  /** o Jato carregado juntando força na ponta do bico */
  jatoCarga: 0xfff3b0,
  /** o alvinho das miras, em cima do bicho escolhido */
  jatoMira: 0xff9a3c,
  /** o chão rachando antes do Gêiser */
  jatoRachadura: 0x3a2618,
  /** o arco-íris, na ordem de sempre */
  arcoIris1: 0xff5e5e,
  arcoIris2: 0xffa24a,
  arcoIris3: 0xffe25a,
  arcoIris4: 0x6fdc72,
  arcoIris5: 0x5ab4ff,
  arcoIris6: 0xa77cff,
  /** a nuvem da Chuva e da Dança da chuva */
  jatoNuvem: 0xdde6ee,
  jatoNuvemFundo: 0xb4c2cf,

  /**
   * A BARRA DE VIDA DAS PRAGAS: quanta água ainda falta para espantar. O fundo
   * é escuro para a barra ler em cima do saibro claro, e o que enche é o
   * mesmo azul do jato — a barra é "o quanto de água cabe nele ainda".
   */
  barraFundo: 0x2b2f3a,
  barraAgua: 0x6fd0f0,
  barraMolhada: 0xffffff,
  /** canteiro comido até o fim: a terra seca e as mudas que sobraram */
  terraComida: 0x7a5a3e,

  /*
   * AS PEÇAS QUE AS CARTAS DO JARDIM PÕEM NA ESTUFA. Cada uma precisa ser lida
   * de longe no meio da rodada, então as cores são mais vivas que as do
   * cenário em volta — e nenhuma é o roxo, turquesa, ferrugem, azul, musgo ou
   * vinho das pragas.
   */
  /** o Espantalho: palha, camisa xadrez desbotada e o chapéu */
  palha: 0xe8c66a,
  palhaEscura: 0xc59a3d,
  espantalhoCamisa: 0xd9674a,
  espantalhoCamisaXadrez: 0xf2d7a0,
  espantalhoChapeu: 0x8a5a33,
  /** o Toldo de um canteiro: lona listrada, verde e creme */
  toldoLona: 0x5fae6e,
  toldoLonaClara: 0xf4ecd2,
  /** o Canteiro de pimenta */
  pimentaVermelha: 0xe0392b,
  pimentaFolha: 0x3f8a3a,
  /** o Aspersor: metal e o bico azul */
  aspersorMetal: 0xb8c3c9,
  aspersorBico: 0x2f86c4,
  /** a Planta carnívora: verde de dioneia, boca vermelha e dentinhos */
  dioneia: 0x74b94a,
  dioneiaBoca: 0xd64a4a,
  dioneiaDente: 0xfbf6e6,
  /** a Cerquinha do terreiro: madeira clara pintada */
  cerquinha: 0xf1e3c4,
  cerquinhaSombra: 0xcdb892,
  /** o cadeado da Estufa trancada, e a corrente */
  cadeado: 0xe0b43c,
  corrente: 0x8f98a0,
  /** o Picolé do Mano: sorvete de morango e o palito */
  picoleMorango: 0xf28aa8,
  picoleCobertura: 0x7a4a2e,
  picolePalito: 0xe9d3a4,
  /*
   * OS EFEITOS DAS CARTAS QUE NÃO SÃO ÁGUA: cada um com uma cor que não se
   * confunde com o jato (azul) nem com a gota de experiência.
   */
  /** as notinhas do Assobio */
  efeitoNota: 0xffd84a,
  /** a onda do Grito, do apito da Gina e do latido do Walter */
  efeitoGrito: 0xffb347,
  /** o que brota: Dedo verde, Sementeira, a rega da Josefina */
  efeitoBroto: 0x8fe36b,
  /** o ardido da pimenta */
  efeitoArdido: 0xff5a36,
  /** a poeira do Pique */
  efeitoPoeira: 0xcdb48a,
  /** o pontilhado do Olho de jardineira */
  efeitoTrilha: 0xfff3c4,
  /** o adubo do Noel caindo no canteiro */
  efeitoAdubo: 0x9a6b3c,
  /** a cerca viva: o verde da moita que abraça o canteiro */
  cercaViva: 0x3f8f4a,
  /*
   * O LIVRO DAS CARTAS, na bancada da estufa: capa de couro verde-musgo (a cor
   * da família Jardim), cantoneiras douradas e as páginas creme, com uma fita
   * vermelha de marcador — lê como "álbum de colecionar" de longe.
   */
  livroCapa: 0x3f6f4a,
  livroCapaEscura: 0x2c4f35,
  livroPagina: 0xf6ecd4,
  livroOuro: 0xe2b64a,
  livroFita: 0xc8433b,

  /*
   * OS PRÊMIOS DOS MARCOS DA ESTUFA (`minigames/jardim/premios.ts`): a
   * plaquinha de madeira da onda 5, o regador de ouro da 30, e as duas roupas
   * de jardineira (10 e 20). O verde das fitas é o da família Jardim, o mesmo
   * da capa do livro — os prêmios da estufa se reconhecem entre si.
   */
  plaquinhaMadeira: 0xb98a55,
  plaquinhaMoldura: 0x7d5733,
  plaquinhaTexto: 0x3b2712,
  trofeuOuro: 0xe9b93c,
  trofeuOuroEscuro: 0xb4861f,
  trofeuPedestal: 0x5e3f24,
  chapeuPalha: 0xe2c27a,
  chapeuPalhaTrama: 0xc9a258,
  chapeuPalhaFita: 0x4f8a4e,
  aventalVerde: 0x6e9e5b,
  aventalBolso: 0x557f45,
  aventalAlca: 0xe9dcc0,
  // as roupas que a lojinha da Josefina vende (`ROUPAS_DA_JOSEFINA`)
  galochaVerde: 0x4f9a4e,
  galochaVerdeCano: 0x3c7a3c,
  camisetaGirassol: 0xf6e3a1,
  camisetaGirassolManga: 0xf0d27c,
  camisetaFolha: 0x7fb069,
  camisetaFolhaManga: 0x6a9a57,
  girassolPetala: 0xf2c14b,
  girassolMiolo: 0x6b4526,
  // o chapéu joaninha (pedido do Renan: vermelho com bolinhas BRANCAS em cima)
  joaninhaVermelho: 0xd9373a,
  joaninhaPreto: 0x2a2626,
  joaninhaBolinha: 0xfaf6ee,
  // as camisetas de personagem da lojinha da Josefina
  camisetaSalvaVidas: 0xd9483b,
  camisetaSalvaVidasManga: 0xc23a2f,
  camisetaRoda: 0x8fc4e8,
  camisetaRodaManga: 0x76b0d8,
  camisetaSucos: 0x4ec1a8,
  camisetaSucosManga: 0x3fa891,
  laranjaCasca: 0xf29b38,
  laranjaPolpa: 0xf8c86a,
  estampaBranca: 0xfbf7ee,

  /*
   * A LOJINHA DA JOSEFINA (`lojinhaDaJosefina`, na parede direita da estufa):
   * banca de feira de madeira clara com toldo listrado verde e creme — o
   * verde da família Jardim de novo, para a loja ler como parte da estufa e
   * não como quiosque do clube que caiu ali dentro.
   */
  lojaMadeira: 0xd2a36b,
  lojaMadeiraEscura: 0x9a6b3c,
  lojaToldoVerde: 0x5f9e57,
  lojaToldoCreme: 0xf3e6c4,
  lojaPlacaTexto: 0x3b2712,
  lojaPacoteA: 0xe06c5a,
  lojaPacoteB: 0x6fa8dc,
  lojaPacoteC: 0xf0c44c,
  lojaCaixinha: 0x7d5733,
  lojaLousa: 0x2f4a3a,
  lojaGiz: 0xf4f1e6,
  lojaTomate: 0xd94f3d,
  lojaAlface: 0x8cc466,
  lojaCenoura: 0xe98a3a,
  lojaSino: 0xe2b64a,
  lojaCesta: 0xc9a26b,
  lojaSaco: 0xd9c49a,

  /*
   * OS ENFEITES DA ESTUFA (`world/decoracoes.ts`), vendidos na lojinha da
   * Josefina. Cor viva de enfeite de jardim de verdade: gesso pintado,
   * plástico rosa, barro — contra o marrom e o verde da estufa, eles têm que
   * ler como "coisa que alguém pôs ali".
   */
  enfeiteGnomoGorro: 0xd9483b,
  enfeiteGnomoRoupa: 0x3f76b8,
  enfeiteGnomoBarba: 0xf5f1e8,
  enfeiteGnomoPele: 0xf1c7a3,
  enfeiteGnomoBota: 0x6b4526,
  enfeiteGnomoCinto: 0x2d2a26,
  enfeiteFlamingo: 0xf28cb0,
  enfeiteFlamingoEscuro: 0xd9648f,
  enfeiteFlamingoBico: 0x2d2a26,
  enfeiteFlamingoPerna: 0x8a8f96,
  enfeiteFlorRosa: 0xf06f9a,
  enfeiteFlorBranca: 0xfaf3e6,
  enfeiteFlorLilas: 0xa889e0,
  enfeiteFlorMiolo: 0xf2c14b,
  enfeiteLanterna: 0x3d4a3f,
  enfeiteLanternaLuz: 0xffe39a,
  enfeitePedra: 0xc9c2b4,
  enfeitePedraEscura: 0xa39b8b,
  enfeiteAguaRasa: 0x8fd0e8,
  enfeitePassarinho: 0x5b8fd6,
  enfeitePassarinhoPeito: 0xf2d27a,
  /** o anel do chão no modo de decorar: verde onde dá, vermelho onde não dá */
  decorarPode: 0x5fcf6a,
  decorarNaoPode: 0xe0564b,

  // A QUEST DO ADUBO: o saco de sementes esquecido no banco do parque, e o
  // saco de adubo que o Noel da de presente. Sao a MESMA peca em duas cores,
  // e a diferenca de tom e o que separa "comida de bicho" de "comida de
  // planta" num relance — clara e dourada contra escura e terrosa.
  estopa: 0xc9a86a,
  estopaBarra: 0xa8854a,
  graoDeSemente: 0xe6c86e,
  estopaDeAdubo: 0x8d7d61,
  estopaDeAduboBarra: 0x6e6049,

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

  // A LOJINHA DE ROUPAS do Villa Lobos — o "mini shopping". As cores sao dela,
  // e nao as do vestido do guarda-roupa, porque ela e um PREDIO: um rosa
  // saturado que fica fofo num laco de fita cansa a vista em sete metros de
  // parede. Daqui sai uma massa rosada quase creme, com a esquadria branca, o
  // toldo listrado num rosa cheio (a unica cor forte, e e a que puxa o olho de
  // longe) e tijolinho no rodape, que e o que impede o predio de flutuar.
  lojaParede: 0xf3dfe0,
  lojaParedeAlta: 0xfaeef0,
  lojaFaixa: 0xdcb9c0,
  lojaEsquadria: 0xfdfaf6,
  lojaToldo: 0xd4788c,
  lojaTijolo: 0xb9736c,
  lojaLetreiro: 0x5c3a44,
  lojaVitrine: 0xd6ebf2,
  lojaDentro: 0xd9c7c4,
  lojaManequim: 0xdcc3a4,

  // A ESTELLA, a ovelha costureira da lojinha de roupas. A la e CREME, e nao branca: branco puro
  // estoura o degrade do toon e a bolota de la vira uma mancha chapada — e la
  // e feita de bolota, entao ela precisa do degrade para existir. A cara e as
  // pernas sao MARROM ESCURO, e sao elas que desenham a ovelha: sem o
  // contraste, um monte de bolotas creme nao le como bicho nenhum.
  ovelhaLa: 0xf6efe2,
  ovelhaLaSombra: 0xe2d7c4,
  ovelhaCara: 0x5b4a46,
  ovelhaCaraClara: 0x76625c,
  ovelhaCasco: 0x3d3330,
  ovelhaFocinho: 0xc78e93,
  // as ferramentas de alfaiate dela: a fita metrica amarelada com os tracinhos
  // escuros, a almofada de alfinete e a armacao dourada do oculos
  ovelhaFita: 0xf0d79a,
  ovelhaAlfineteira: 0xc4565a,
  ovelhaOculos: 0xd8b45e,

  // O BISCOITINHO DA ESTELLA — o brinde que ela da junto com a roupa, e o que
  // ela deu pro Cookie no dia do uniforme. Massa amanteigada com as gotas de
  // chocolate escuras e um pingo do rosa da loja no meio, que e a assinatura
  // dela: doce que sai daquela porta vem com aquele rosa.
  // o xadrez da Estella: o creme e o castanho de um tabuleiro de madeira de
  // verdade. Preto puro e branco puro comem o degrade do toon e o tabuleiro
  // vira um adesivo chapado em cima da mesa
  xadrezClaro: 0xf0e2c6,
  xadrezEscuro: 0x6b4a38,

  // a palha da cestinha em que os biscoitos moram, na porta da loja
  cestaPalha: 0xd9b781,
  biscoitoMassa: 0xdfab68,
  biscoitoBorda: 0xc68f4f,
  biscoitoGota: 0x5b3a2a,

  // A LOJINHA POR DENTRO. O predio ja tem a cara dele por fora (rosa quase
  // creme, esquadria branca, toldo forte); aqui dentro a regra muda: parede
  // CLARA e quente, para as roupas serem a unica coisa colorida da sala. Loja
  // de roupa de verdade e um fundo neutro com arara colorida — inverter isso
  // faz o cenario brigar com a mercadoria.
  lojaChaoTabua: 0xdcbd97,
  lojaChaoTapete: 0xe6d2d6,
  lojaParedeDentro: 0xfbf3ec,
  lojaFriso: 0xf0e2d8,
  lojaRodape: 0xe0cec2,
  lojaMetal: 0xc9ccd2,
  lojaMetalEscuro: 0x9aa0a8,
  lojaCortinaProvador: 0xd07f92,
  lojaEspelhoVidro: 0xdcecf2,
  lojaBalcao: 0xb0836a,

  // OS TECIDOS DAS ROUPAS penduradas. Seis pasteis e seis vivas, e as araras
  // sao montadas por COLECAO (tres ou quatro tons que conversam) em vez de
  // sortear cor a cor: arara com doze cores diferentes le como caixa de lapis,
  // nao como roupa a venda.
  tecidoRosa: 0xf7a8c0,
  tecidoLilas: 0xc4a7e7,
  tecidoMenta: 0x9fd8c0,
  tecidoCeu: 0xa8c8f0,
  tecidoManteiga: 0xf6dfa0,
  tecidoPessego: 0xf7bfa0,
  tecidoVinho: 0x9c3b52,
  tecidoPetroleo: 0x2e6f8e,
  tecidoMostarda: 0xdda12b,
  tecidoOliva: 0x6f8b4a,
  tecidoCoral: 0xef6b5a,
  tecidoIndigo: 0x4a5a9c,

  // A REFORMA CHIC da boutique. O terreo trocou a tabua quente por PORCELANATO
  // POLIDO bege-osso, e a regra da sala mudou junto: fundo quase sem cor, para
  // a arara ser a unica coisa colorida. O ouro entra so em fio (perfil da
  // arara premium, aro do espelho, corrimao) — ouro em area grande vira
  // dourado de bijuteria, e ai a loja fica brega em vez de chique.
  boutiquePiso: 0xf2ebe0,
  boutiqueTapete: 0xd9c3c6,
  boutiqueTapeteBorda: 0xc2a7ac,
  boutiqueParede: 0xf7f1ea,
  boutiqueBoiserie: 0xece1d4,
  boutiqueOuro: 0xd6ad63,
  boutiqueOuroEscuro: 0xa8813f,
  boutiquePrata: 0xd3d7dc,
  boutiqueVinho: 0x7d3a4c,
  boutiqueLuz: 0xfff0d2,
  // o vidro da escada rolante e o degrau de aco
  escadaVidro: 0xbfe0ea,
  escadaDegrau: 0xb7bcc4,
  escadaDegrauEscuro: 0x8d939c,
  escadaCorrimao: 0x3a3a42,
  // o andar de cima: mesma familia, um degrau mais quente, porque la em cima a
  // luz que entra e a do lanternim e nao a da vitrine
  mezaninoPiso: 0xeee5d6,
  mezaninoGuarda: 0xf7f1ea,

  // o Cookie, o elefante da bilheteria. Cinza de elefante de verdade puxa para
  // o ROXO, e nao para o azul — cinza azulado sai como pedra. A orelha por
  // dentro e o dentro da tromba sao rosados, e e dai que vem o "fofo" que um
  // bloco cinza nao tem sozinho. A presa e creme: branco puro estoura o degrade
  // do toon e vira uma mancha chapada.
  elefantePele: 0x9a94a3,
  elefanteEscuro: 0x7a7585,
  elefanteClaro: 0xb5aebd,
  elefanteOrelha: 0xc79aa6,
  elefantePresa: 0xf3ead6,
  elefanteUnha: 0xe4dbc9,

  // o fundo da bilheteria, visto pelo guiche: o creme da parede um degrau
  // abaixo. Sem ele a cabine e um vao vazado — as paredes sao `FrontSide`, e
  // pela janela se via a paisagem ATRAVES da cabine
  bilheteriaDentro: 0xcbbfa8,

  // por dentro da cabine da roda gigante. Este interior só existe durante os
  // quarenta segundos de primeira pessoa lá em cima, e é a ÚNICA coisa que se
  // vê além do parque: piso de borracha escura, banco estofado azul, esquadria
  // branca da janela que dá a volta inteira, e a lâmpada morna do teto.
  cabinePiso: 0x4c545c,
  cabineBanco: 0xa06b34,
  cabineEstofado: 0x5b8fd6,
  cabineEsquadria: 0xeef3f6,
  cabineLuz: 0xffe9b8,

  // A PRAÇA DE GELO, o piso do quiosque do Mano no Villa Lobos. O gelo aqui e
  // CIANO LAVADO, e nao azul cheio: azul cheio no chao vira piscina, e o que se
  // quer e uma lamina lisa e clara que ainda deixe a grama em volta ser o verde
  // da cena. Sao quatro degraus do mesmo tom, do mais claro (o cristal, que e
  // quase branco por ser translucido) ao mais fundo (a base da borda, que e a
  // sombra por baixo da neve pisada).
  geloPiso: 0xd7eff8,
  geloSombra: 0xb6dcec,
  geloCristal: 0xeafaff,
  geloFundo: 0x9ccbe0,
  // a neve: branca de verdade, com um degrau acinzentado para a sombra. Ela e
  // mais quente que o gelo de proposito — e isso que separa "monte de neve" de
  // "bloco de gelo" numa cena que ja e toda azul-clara
  neveFofa: 0xfbfdff,
  neveSombra: 0xdfe9f2,
  // o rosa da sorveteria: a MESMA cor do quiosque e do avental do Mano
  // (0xf6a6c0), agora com nome, porque agora ela veste tambem os guarda-sois e
  // as cadeirinhas da praca. O `aventalDoMano` continua onde esta: aquele e
  // identidade de personagem, este e a cor da loja.
  sorveteriaRosa: 0xf6a6c0,
  sorveteriaCreme: 0xfdf3e7,

  // A arena de ping pong do Villa Lobos. O tablado reaproveita a madeira do
  // deque do clube (`dequeTabua`/`dequeRipa`/`dequeViga`) de proposito — os
  // dois sao estrado de area publica, e usar a mesma madeira e o que faz o
  // parque e o clube lerem como o mesmo mundo. Estas tres sao as cores que so
  // existem aqui.
  /*
   * O JEAN-LUC, o pato frances que mora no lago do Villa Lobos.
   *
   * A PENA E A DOS PATOS DO LAGO (`duck()` nasce em 0xf6f2e8), so um fio mais
   * clara: ele e um deles, e o que o separa dos outros e a roupa. Pato de cor
   * propria seria um bicho de outro lugar que veio visitar — e a piada e
   * justamente que ele estava ali o tempo todo, debaixo d'agua.
   *
   * O AZUL E O VERMELHO SAO OS DA BANDEIRA, e nao um azul e um vermelho
   * quaisquer: e o par que faz a boina e a faixa do peito lerem como Franca
   * sem precisar de legenda.
   */
  patoPena: 0xfaf5e9,
  patoPenaSombra: 0xe7dcc4,
  patoBico: 0xf2a23c,
  patoBicoEscuro: 0xd4802a,
  patoBochecha: 0xf5a7ad,
  azulFranca: 0x11488f,
  vermelhoFranca: 0xe0243c,
  camisaDoJeanLuc: 0xfcfbf6,

  pingBalde: 0x3f8fbe,     // o balde de bolinhas, plastico de clube
  pingCartela: 0x2f333c,   // a cartela de numero do placarzinho
  pingVerde: 0x4f9a7a,     // a terceira raquete do suporte, a que ninguem pega
  pingDourada: 0xe0b33f,   // a raquete da vaquinha, que a Estella pintou em tres demaos

  /* ------------------------------------------------------------------
   * A FESTA DA MESA DE PIQUENIQUE — a toalha, o que esta em cima dela e o
   * porta-retrato com a foto dos seis.
   *
   * A toalha e vermelha e branca porque toalha de piquenique e vermelha e
   * branca: e o unico objeto deste jogo cuja cor ja estava decidida antes de
   * alguem desenhar. O resto acompanha o quiosque do Mano e o cardapio do
   * Walter, que sao a comida que este mundo ja tem.
   * ------------------------------------------------------------------ */
  toalhaPano: 0xf8f3e8,
  toalhaXadrez: 0xd8453f,
  cestaVime: 0xc99a5a,
  cestaVimeEscuro: 0xa3763c,
  sanduichePao: 0xe8c489,
  sanduicheRecheio: 0x8fc46a,
  sanduicheQueijo: 0xf6d066,
  jarraSuco: 0xf2a03c,
  jarraVidro: 0xdfeef5,
  boloMassa: 0xf0d9a8,
  boloCobertura: 0xf6a6c0,
  portaRetratoMoldura: 0xb5793a,

  /* ------------------------------------------------------------------
   * OS QUATRO PREMIOS DA ARENA — um por desafiante do quadro.
   *
   * Cada conjunto sai do DONO dele, e nao de um gosto de cor: a jaqueta usa o
   * mesmo azul e o mesmo vermelho da camisa do Jean-Luc, o quepe usa o pano do
   * quepe que o Cookie de fato veste na bilheteria, e os patins usam o rosa do
   * Mano no sorvete. Peca de premio que nao lembra de quem veio e so mais uma
   * roupa na arara.
   * ------------------------------------------------------------------ */

  // Jean-Luc: a jaqueta azul da Franca, com o bico de pato no peito
  jaquetaFranca: 0x14539f,        // um tom acima do `azulFranca`, que e de bandeira
  jaquetaFrancaManga: 0x0e3d78,   // a manga, mais funda que o corpo
  jaquetaFrancaGola: 0xf4f1e8,    // gola e punho, o branco da bandeira
  jaquetaFrancaFita: 0xe0243c,    // a faixa vermelha do peito
  jaquetaFrancaBico: 0xf2a23c,    // o bico do patinho bordado no peito

  // Cookie: o quepe da bilheteria, o mesmo pano da manta dele
  quepeCookie: 0x4a7fe0,
  quepeCookieFita: 0xe0524a,      // a faixa vermelha na base da copa
  quepeCookieBotao: 0xf3e7d3,     // o botaozinho do alto e o debrum

  // Estella: o conjunto de xadrez, preto e branco de tabuleiro
  xadrezPano: 0xf2ece0,
  xadrezPanoEscuro: 0x2a2731,
  xadrezDourado: 0xd8b45e,        // o broche de dama e a coroa, o mesmo ouro do oculos dela
  xadrezForro: 0x8d3f4c,          // o forro vinho que aparece na gola e na barra

  // Mano: os patins da praca de gelo, azul-claro e branco
  patinsGelo: 0x8fd3ef,
  patinsGeloBota: 0xf7fbfd,
  patinsGeloRoda: 0x3fa9d6,
  patinsGeloCasquinha: 0xe0ac63,  // o waffle da casquinha do emblema
  patinsGeloSorvete: 0xf6a6c0,    // a bola de sorvete, o rosa do Mano

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
