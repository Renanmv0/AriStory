import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { ItemDef } from '../core/types';
import { biscoitoDaEstella, copoDeSuco, frisbee, iceCream, osso } from './props';
import {
  canoDaBota, gargantilhaDeLaco, gorroDeLa, gravataDoWalter, maidJapones, mangaDeMoletom, mangaDeQuimono,
  meiaDeCoxa, moletomComCapuz, oculosDeSol, vestidoDaLoja, vestidoGatinho, vestidoMarinheiro, vestidoRosa,
} from './roupas';

/**
 * O catalogo de itens do jogo.
 *
 * Um lugar so para as tres coisas que precisam andar juntas: a FICHA do item
 * (id, nome, emoji, pose), o MODELO que aparece na mao e o DONO, quando o item
 * e de uma pessoa so. Espalhar isso pelas cenas foi tentador e daria errado no
 * primeiro item que aparecesse em dois cenarios.
 *
 * Zero asset externo, como o resto: o emoji e o rosto do item no painel e o
 * corpo dele vem de `props.ts`, geometria procedural como qualquer peca.
 */

/** so para nao escrever a mesma string em quatro lugares */
export const ITENS = {
  sorveteMorango: {
    id: 'sorvete-morango',
    nome: 'Sorvete de morango',
    icone: '🍦',
    tipo: 'mao',
    nota: 'do Ari',
    holdPose: 'upright',
  },
  sorveteMaracuja: {
    id: 'sorvete-maracuja',
    nome: 'Sorvete de maracujá',
    icone: '🍦',
    tipo: 'mao',
    nota: 'do Renan',
    holdPose: 'upright',
  },
  /**
   * Os dois sabores da CASA. Eles só existem porque a mesinha da praça de gelo
   * deixa pedir "o que o Mano escolher", e ele escolhe estes — no balcão o
   * pedido continua sendo o de sempre, morango e maracujá.
   *
   * O dono de cada um segue a mesma regra dos de sempre: um para cada, e o que
   * decide não é o sabor, é de quem é a mão.
   */
  sorveteChocolate: {
    id: 'sorvete-chocolate',
    nome: 'Sorvete de chocolate',
    icone: '🍫',
    tipo: 'mao',
    nota: 'do Ari',
    holdPose: 'upright',
  },
  sorveteLimao: {
    id: 'sorvete-limao',
    nome: 'Sorvete de limão',
    icone: '🍋',
    tipo: 'mao',
    nota: 'do Renan',
    holdPose: 'upright',
  },
  sucoPessego: {
    id: 'suco-pessego',
    nome: 'Suco de pêssego',
    icone: '🥤',
    tipo: 'mao',
    nota: 'do Ari',
    holdPose: 'upright',
  },
  sucoMorango: {
    id: 'suco-morango',
    nome: 'Suco de morango',
    icone: '🥤',
    tipo: 'mao',
    nota: 'do Renan',
    holdPose: 'upright',
  },
  /**
   * O BRINDE DA ESTELLA. Ela nao vende doce — ela DA, junto com a roupa, e foi
   * assim que o Cookie ganhou o dele no dia do uniforme. Um so para os dois,
   * cada um com o seu: e a mesma regra dos sorvetes do Mano, e o que decide nao
   * e o sabor, e de quem e a mao.
   */
  biscoitoDaEstella: {
    id: 'biscoito-estella',
    nome: 'Biscoitinho da Estella',
    icone: '🍪',
    tipo: 'mao',
    nota: 'brinde da lojinha do parque',
    holdPose: 'upright',
  },

  // ------------------------------------------------------------ vestiveis
  // Todo vestivel declara o `slot`, porque as 4 vagas de vestimenta SAO as 4
  // partes do corpo. E o que faz chapeu e patins conviverem (cabeca e pe sao
  // vagas diferentes) e dois chapeus nao conviverem.
  chapeuPingPong: {
    id: 'chapeu-ping-pong',
    nome: 'Chapéu de campeão',
    icone: '👑',
    tipo: 'vestivel',
    slot: 'cabeca',
    nota: 'ping pong, 5 a 0',
  },
  patins: {
    id: 'patins',
    nome: 'Patins',
    icone: '🛼',
    tipo: 'vestivel',
    slot: 'pes',
    // FUNCIONAL: dao 1,3x de velocidade, entao sao equipamento e nao roupa.
    // E o que deixa eles viajarem na mochila e serem calcados no parque, sem
    // ter que voltar no armario do quarto do Ari.
    funcional: true,
    nota: 'da lojinha do parque · +velocidade',
  },
  gorroDeLa: {
    id: 'gorro-la',
    nome: 'Gorro de lã',
    icone: '🧢',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.roupaLa,
    corDetalhe: P.roupaLaBarra,
    nota: 'para o frio que nunca faz',
    cobreCabelo: true,
    extra: gorroDeLa,
  },
  camisaListrada: {
    id: 'camisa-listrada',
    nome: 'Camisa listrada',
    icone: '👕',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.roupaListra,
    corDetalhe: P.roupaListraManga,
    nota: 'mangas claras',
  },
  calcaJeans: {
    id: 'calca-jeans',
    nome: 'Calça jeans',
    icone: '👖',
    tipo: 'vestivel',
    slot: 'pernas',
    cor: P.roupaJeans,
    nota: 'a de sempre',
  },
  vestidoRosa: {
    id: 'vestido-rosa',
    nome: 'Vestido rosa de babados',
    icone: '👗',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.vestidoRosa,
    corDetalhe: P.vestidoRenda,
    nota: 'da vitrine que o Renan viu',
    // sem manga e com a perna de fora, como na foto
    bracosNus: true,
    pernasNuas: true,
    extra: vestidoRosa,
  },
  maidMarinheiro: {
    id: 'maid-marinheiro',
    nome: 'Maid marinheiro',
    icone: '🖤',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.maidPreto,
    // a manga bufante da foto e BRANCA, e a manga do rig e o `detalhe`
    corDetalhe: P.maidCreme,
    nota: 'gola de marinheiro e cadarço',
    pernasNuas: true,
    extra: vestidoMarinheiro,
  },
  maidGatinho: {
    id: 'maid-gatinho',
    nome: 'Maid gatinho',
    icone: '🐱',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.maidPreto,
    // neste a manga bufante e preta, igual ao corpo
    corDetalhe: P.maidPreto,
    nota: 'com guizo e cara de gato',
    pernasNuas: true,
    extra: vestidoGatinho,
  },
  maidJapones: {
    id: 'maid-japones',
    nome: 'Maid japonês',
    icone: '🌸',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.waRosa,
    // a manga da ficha some por baixo da manga de quimono, entao ela fica na
    // cor do quimono para nao aparecer uma faixa estranha no ombro
    corDetalhe: P.waRosa,
    nota: 'manga de quimono e festão de corações',
    pernasNuas: true,
    extra: maidJapones,
    extraBraco: mangaDeQuimono,
  },
  moletomPreto: {
    id: 'moletom-preto',
    nome: 'Moletom preto',
    icone: '🧥',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.moletomPreto,
    // a manga da ficha fica por baixo da manga do moletom: preta, para nao
    // aparecer uma faixa de outra cor entre a bola do ombro e o punho
    corDetalhe: P.moletomPreto,
    nota: 'com capuz e zíper, o da foto no espelho',
    // nada de perna nem de braco nu: ele veste por CIMA, e a calca e o que
    // estiver na vaga das pernas continua aparecendo
    extra: moletomComCapuz,
    extraBraco: mangaDeMoletom,
  },
  meiaDeCoxa: {
    id: 'meia-de-coxa',
    nome: 'Meia de coxa',
    icone: '🧦',
    tipo: 'vestivel',
    slot: 'pernas',
    cor: P.waBranco,
    nota: 'com a liga rosa',
    extra: meiaDeCoxa,
  },
  gargantilhaDeLaco: {
    id: 'gargantilha-laco',
    nome: 'Gargantilha de laço',
    icone: '🎀',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.vestidoFita,
    nota: 'combina com o vestido',
    extra: gargantilhaDeLaco,
  },
  /**
   * A gravatinha do Walter — presente dele, e nao peca de vitrine.
   *
   * Ela SO existe no armario depois que o turno do Mania fecha com tres
   * estrelas (a flag `gravata-do-walter`): e a unica peca do guarda-roupa que
   * se ganha jogando, e por isso a `nota` diz de quem ela veio.
   */
  gravataDoWalter: {
    id: 'gravata-do-walter',
    nome: 'Gravatinha do Walter',
    icone: '🎀',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.gravataBorboleta,
    nota: 'presente dele, depois das três estrelas',
    extra: gravataDoWalter,
  },
  botaAmarela: {
    id: 'bota-amarela',
    nome: 'Bota amarela',
    icone: '🥾',
    tipo: 'vestivel',
    slot: 'pes',
    cor: P.roupaBota,
    corDetalhe: P.roupaBotaCano,
    nota: 'chama atenção de longe',
    extra: canoDaBota,
  },
  // ------------------------------------------------------- moda praia
  // Do vestiario do clube. As bermudas declaram `corBanho` e NAO declaram
  // `cor`: elas pintam o calcao dentro d'agua e nao pintam nada fora dele — a
  // ficha inteira em quatro linhas, sem geometria e sem estado novo.
  oculosEscuros: {
    id: 'oculos-escuros',
    nome: 'Óculos escuros',
    icone: '🕶️',
    tipo: 'vestivel',
    slot: 'cabeca',
    nota: 'do vestiário do clube',
    extra: oculosDeSol,
  },
  bermudaAzul: {
    id: 'bermuda-azul',
    nome: 'Bermuda azul',
    icone: '🩳',
    tipo: 'vestivel',
    slot: 'pernas',
    corBanho: P.bermudaAzul,
    nota: 'a cor da própria piscina',
  },
  bermudaVermelha: {
    id: 'bermuda-vermelha',
    nome: 'Bermuda vermelha',
    icone: '🩳',
    tipo: 'vestivel',
    slot: 'pernas',
    corBanho: P.bermudaVermelha,
    nota: 'dá pra achar de longe',
  },
  bermudaAmarela: {
    id: 'bermuda-amarela',
    nome: 'Bermuda amarela',
    icone: '🩳',
    tipo: 'vestivel',
    slot: 'pernas',
    corBanho: P.bermudaAmarela,
    nota: 'sol de tarde',
  },
  bermudaEstampada: {
    id: 'bermuda-estampada',
    nome: 'Bermuda estampada',
    icone: '🌺',
    tipo: 'vestivel',
    slot: 'pernas',
    corBanho: P.bermudaEstampa,
    estampaBanho: P.bermudaEstampaFaixa,
    nota: 'duas faixas cor de areia',
  },
  frisbee: {
    id: 'frisbee',
    nome: 'Frisbee',
    icone: '🥏',
    tipo: 'mao',
    nota: 'do parque',
    holdPose: 'relaxed',
  },
  /**
   * O BILHETE DA RODA GIGANTE, comprado na bilheteria do Villa Lobos.
   *
   * Ele é o primeiro item do jogo que CUSTA dinheiro — a carteira do casal
   * existe desde o turno do Mania, e este é o primeiro lugar que gasta dela.
   * Um bilhete vale a dupla inteira (é sempre uma cabine para os dois), e ele
   * é consumido ao passar pela catraca.
   */
  bilheteDaRoda: {
    id: 'bilhete-roda',
    nome: 'Bilhete da roda gigante',
    icone: '🎟️',
    tipo: 'mao',
    nota: 'dois lugares na mesma cabine',
    holdPose: 'relaxed',
  },
  /**
   * O osso desenterrado no jardim da Josefina.
   *
   * Ele nao serve para nada sozinho — e uma CHAVE: existe para ser entregue ao
   * Walter, no Mania de Churrasco. A `nota` diz de onde ele veio porque, entre
   * achar e entregar, pode passar muito tempo e muita cena.
   */
  osso: {
    id: 'osso',
    nome: 'Osso',
    icone: '🦴',
    tipo: 'mao',
    nota: 'desenterrado no jardim do clube',
    holdPose: 'relaxed',
  },

  /* ====================================================================
   *              A COLECAO DA ESTELLA — o que esta a venda
   * ====================================================================
   *
   * Vinte pecas, e QUASE NENHUMA GEOMETRIA NOVA. Isso e de proposito, e e a
   * primeira pergunta da skill de roupa: "da para resolver so com cor?".
   *
   * - camisa, regata e calca nao tem `extra` nenhum — repintam a malha que o
   *   corpo ja tem, que e a peca mais barata que existe neste jogo;
   * - os sete vestidos sao o MESMO `vestidoRosa` em sete cores, e os gorros e
   *   as botas idem. A geometria estava paga; o que faltava era o mostruario.
   *
   * Vinte pecas desenhadas do zero seriam vinte oportunidades de manga torta.
   * Vinte fichas de cor sao vinte linhas que nao podem quebrar a caminhada.
   *
   * O `preco` e o que poe cada uma na vitrine — sem ele a peca nao esta a
   * venda em lugar nenhum.
   */

  // ---------------------------------------------- arara 1: camisaria clara
  camisaLinho: {
    id: 'camisa-linho', nome: 'Camisa de linho', icone: '👔',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaLinho, corDetalhe: P.lojaLinhoManga,
    nota: 'crua, de manga dobrada', preco: 48,
  },
  camisaMenta: {
    id: 'camisa-menta', nome: 'Camisa verde-menta', icone: '👕',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaMenta, corDetalhe: P.lojaMentaManga,
    nota: 'a cor preferida da Estella', preco: 52,
  },
  camisaTerracota: {
    id: 'camisa-terracota', nome: 'Camisa terracota', icone: '👕',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaTerracota, corDetalhe: P.lojaTerracotaManga,
    nota: 'cor de telha nova', preco: 52,
  },
  regataPiscina: {
    id: 'regata-piscina', nome: 'Regata azul-piscina', icone: '🎽',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaRegata,
    nota: 'sem manga, para o calor', preco: 38,
    bracosNus: true,
  },

  // ------------------------------------------------------ arara 2: vestidos
  vestidoNoite: {
    id: 'vestido-noite', nome: 'Vestido azul-noite', icone: '👗',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaVestidoNoite, corDetalhe: P.lojaVestidoNoiteRenda,
    nota: 'babado cor de nuvem', preco: 96,
    bracosNus: true, pernasNuas: true, extra: vestidoDaLoja,
  },
  vestidoJade: {
    id: 'vestido-jade', nome: 'Vestido jade', icone: '👗',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaVestidoJade, corDetalhe: P.lojaVestidoJadeRenda,
    nota: 'verde de água funda', preco: 96,
    bracosNus: true, pernasNuas: true, extra: vestidoDaLoja,
  },
  vestidoLilas: {
    id: 'vestido-lilas', nome: 'Vestido lilás', icone: '👗',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaVestidoLilas, corDetalhe: P.lojaVestidoLilasRenda,
    nota: 'o mais leve da arara', preco: 88,
    bracosNus: true, pernasNuas: true, extra: vestidoDaLoja,
  },
  vestidoManteiga: {
    id: 'vestido-manteiga', nome: 'Vestido manteiga', icone: '👗',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaVestidoManteiga, corDetalhe: P.lojaVestidoManteigaRenda,
    nota: 'amarelo de bolo', preco: 88,
    bracosNus: true, pernasNuas: true, extra: vestidoDaLoja,
  },

  // ----------------------------------------------------- arara 3: calcaria
  calcaAlfaiataria: {
    id: 'calca-alfaiataria', nome: 'Calça de alfaiataria', icone: '👖',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.lojaAlfaiataria,
    nota: 'chumbo, de prega', preco: 74,
  },
  calcaBege: {
    id: 'calca-bege', nome: 'Calça bege', icone: '👖',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.lojaCalcaBege,
    nota: 'combina com tudo, diz ela', preco: 58,
  },
  calcaVinho: {
    id: 'calca-vinho', nome: 'Calça vinho', icone: '👖',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.lojaCalcaVinho,
    nota: 'a mais ousada da fila', preco: 62,
  },
  calcaOliva: {
    id: 'calca-oliva', nome: 'Calça oliva', icone: '👖',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.lojaCalcaOliva,
    nota: 'verde de jardim', preco: 58,
  },

  // ------------------------------------------------- arara 4: frio e pé
  gorroAzul: {
    id: 'gorro-azul', nome: 'Gorro azul', icone: '🧢',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.lojaGorroAzul, corDetalhe: P.lojaGorroAzulBarra,
    nota: 'barra dobrada', preco: 42,
    cobreCabelo: true, extra: gorroDeLa,
  },
  gorroMusgo: {
    id: 'gorro-musgo', nome: 'Gorro musgo', icone: '🧢',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.lojaGorroMusgo, corDetalhe: P.lojaGorroMusgoBarra,
    nota: 'lã grossa', preco: 42,
    cobreCabelo: true, extra: gorroDeLa,
  },
  botaVermelha: {
    id: 'bota-vermelha', nome: 'Bota vermelha', icone: '🥾',
    tipo: 'vestivel', slot: 'pes',
    cor: P.lojaBotaVermelha, corDetalhe: P.lojaBotaVermelhaCano,
    nota: 'cano curto, bico redondo', preco: 86,
    extra: canoDaBota,
  },
  botaCreme: {
    id: 'bota-creme', nome: 'Bota creme', icone: '🥾',
    tipo: 'vestivel', slot: 'pes',
    cor: P.lojaBotaCreme, corDetalhe: P.lojaBotaCremeCano,
    nota: 'a que ela não deixa ninguém provar de meia suja', preco: 92,
    extra: canoDaBota,
  },

  // ------------------------------------------- mezanino: a linha premium
  vestidoDeGala: {
    id: 'vestido-gala', nome: 'Vestido de gala dourado', icone: '✨',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaGala, corDetalhe: P.lojaGalaRenda,
    nota: 'ela levou três meses nesse', preco: 210,
    bracosNus: true, pernasNuas: true, extra: vestidoDaLoja,
  },
  vestidoDePrata: {
    id: 'vestido-prata', nome: 'Vestido de gala prata', icone: '✨',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.lojaGalaPrata, corDetalhe: P.lojaGalaPrataRenda,
    nota: 'o par do dourado', preco: 210,
    bracosNus: true, pernasNuas: true, extra: vestidoDaLoja,
  },
  boinaDeVeludo: {
    id: 'boina-veludo', nome: 'Boina de veludo', icone: '🎩',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.lojaVeludo, corDetalhe: P.lojaVeludoBarra,
    nota: 'vinho, de festa', preco: 150,
    cobreCabelo: true, extra: gorroDeLa,
  },
  botaDeGala: {
    id: 'bota-gala', nome: 'Bota de gala dourada', icone: '👢',
    tipo: 'vestivel', slot: 'pes',
    cor: P.lojaGala, corDetalhe: P.lojaVeludo,
    nota: 'para usar com o vestido, e só com ele', preco: 165,
    extra: canoDaBota,
  },
  calcaDeVeludo: {
    id: 'calca-veludo', nome: 'Calça de veludo', icone: '👖',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.lojaVeludo,
    nota: 'o mesmo veludo da boina', preco: 160,
  },
} as const satisfies Record<string, ItemDef>;

/**
 * AS ARARAS DA BOUTIQUE: o que cada uma vende, na ordem em que elas estao na
 * planta da loja (`scenes/lojinha.ts`).
 *
 * Um lugar so, pelo mesmo motivo do `MODA_PRAIA`: a cena liga a interacao por
 * esta lista e o painel desenha por ela, e as duas nao tem como discordar
 * sobre o que esta pendurado. O `titulo` e o que aparece no alto do painel —
 * e o nome que a Estella daria para a arara, nao "arara 3".
 */
export interface AraraDaLoja {
  readonly titulo: string;
  readonly fala: string;
  readonly pecas: readonly ItemDef[];
}

export const ARARAS_DA_ESTELLA: readonly AraraDaLoja[] = [
  {
    titulo: 'Camisaria',
    fala: 'Essa fila é a que mais sai. Linho não amassa se você não sentar em cima.',
    pecas: [ITENS.camisaLinho, ITENS.camisaMenta, ITENS.camisaTerracota, ITENS.regataPiscina],
  },
  {
    titulo: 'Vestidos',
    fala: 'Aqui eu não deixo ninguém mexer sem provar. Prova, meu amor. PROVA.',
    pecas: [ITENS.vestidoNoite, ITENS.vestidoJade, ITENS.vestidoLilas, ITENS.vestidoManteiga],
  },
  {
    titulo: 'Calçaria',
    fala: 'Cintura alta. Todas. Não me venha pedir cintura baixa que eu não faço.',
    pecas: [ITENS.calcaAlfaiataria, ITENS.calcaBege, ITENS.calcaVinho, ITENS.calcaOliva],
  },
  {
    titulo: 'Frio e pé',
    fala: 'Gorro e bota. Nesta cidade não faz frio, e mesmo assim isso aqui esgota.',
    pecas: [ITENS.gorroAzul, ITENS.gorroMusgo, ITENS.botaVermelha, ITENS.botaCreme],
  },
];

/** As três araras douradas do mezanino. A mesma ideia, outra faixa de preço. */
export const PREMIUM_DA_ESTELLA: readonly AraraDaLoja[] = [
  {
    titulo: 'Gala',
    fala: 'Estes dois eu não vendo pra qualquer um. Vocês eu vendo.',
    pecas: [ITENS.vestidoDeGala, ITENS.vestidoDePrata],
  },
  {
    titulo: 'Veludo',
    fala: 'Veludo pede ocasião. Arrumem uma ocasião.',
    pecas: [ITENS.boinaDeVeludo, ITENS.calcaDeVeludo],
  },
  {
    titulo: 'Acabamento',
    fala: 'A bota fecha o look. Sem ela vocês são gente bonita de pé descalço.',
    pecas: [ITENS.botaDeGala],
  },
];

/**
 * O que o vestiario do clube tem para vestir.
 *
 * Um lugar so: a cena ABASTECE por esta lista e o painel DESENHA por ela, e as
 * duas nao tem como discordar sobre quais cores existem. Na ordem em que
 * aparecem na fileira.
 */
export const MODA_PRAIA: readonly ItemDef[] = [
  ITENS.bermudaAzul, ITENS.bermudaVermelha, ITENS.bermudaAmarela, ITENS.bermudaEstampada,
];

/**
 * O corpo de cada item, na MAO.
 *
 * O que se veste nao entra aqui: acessorio e parte do corpo (o chapeu de
 * campeao ja nasce dentro do `CharacterRig`), e o inventario so decide se ele
 * aparece ou nao.
 *
 * Cada chamada devolve uma malha NOVA: o mesmo `Object3D` nao pode ter dois
 * pais, e a mesma ficha pode acabar na mao de duas pessoas em cenas diferentes.
 */
const MODELOS: Record<string, () => THREE.Object3D> = {
  'sorvete-morango': () => iceCream(P.morango),
  'sorvete-maracuja': () => iceCream(P.maracuja),
  'sorvete-chocolate': () => iceCream(P.chocolate),
  'sorvete-limao': () => iceCream(P.limao),
  'suco-pessego': () => copoDeSuco(P.pessego),
  'suco-morango': () => copoDeSuco(P.morango),
  'frisbee': () => frisbee(P.frisbee),
  'osso': () => osso(P.osso),
  'biscoito-estella': () => biscoitoDaEstella(),
};

const PORID: Record<string, ItemDef> = Object.fromEntries(
  Object.values(ITENS).map((i) => [i.id, i as ItemDef]),
);

/**
 * A ficha oficial de um item, pelo id.
 *
 * O save guarda uma COPIA do item dentro da vaga, e copia envelhece: uma versao
 * antiga do jogo chegou a reescrever o `tipo` ao mover de lista, e o chapeu
 * salvo naquele dia virou um item de mao que nao dava mais para vestir. Por
 * isso o catalogo, e nao o save, e quem manda na categoria.
 *
 * Devolve null para id que nao esta no catalogo (item de teste, por exemplo).
 */
export function fichaDoItem(id: string): ItemDef | null {
  return PORID[id] ?? null;
}

/** Modelo do item para pendurar na mao, ou null se ele nao tem corpo. */
export function modeloDoItem(id: string): THREE.Object3D | null {
  const obj = MODELOS[id]?.();
  if (!obj) return null;
  // etiqueta para o teste conseguir dizer o que cada mao esta segurando
  obj.userData.item = id;
  return obj;
}
