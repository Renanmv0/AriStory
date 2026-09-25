import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { HoldPose, ItemDef } from '../core/types';
import { biscoitoDaEstella, copoDeSuco, frisbee, iceCream, osso } from './props';
import { borrifadorDeJardim, esguichoDeMangueira, pistolaDagua, regadorDeJardim, type EstiloDeRegador } from './regador';
import {
  bermudaListrada, bermudaDeBolinhas, bermudaHavaiana, bermudaDeAbacaxi, bermudaDeMelancia, bermudaDeOndinhas,
  oculosRedondo, oculosGatinho, oculosDeCoracao, oculosEspelhado, oculosDeNatacao,
  chineloAzul, chineloFlorido, chineloDeMelancia, chineloSlide,
  chapeuDePraia, toucaDeNatacao, tiaraDeConchinhas,
  boiaDePatinho, colarHavaiano, camisaHavaiana, mangaHavaiana, regataListrada,
  camisaHavaianaSolta, mangaHavaianaSolta, regataListradaSolta,
} from './roupasDePiscina';
import {
  aventalDaJosefina, blazerXadrez, canoDaBota, chapeuDeJardineira, coroaDeDama, gargantilhaDeLaco,
  boneDaGina, chapeuJoaninha, estampaLaranja, estampaRodaGigante, estampaSalvaVidas, girassolNoPeito,
  gorroDeLa, gravataDoWalter, mochilaCascoDaJosefina, tiaraDoPelusa, tiaraDoWalter,
  jaquetaFrancesa, maidJapones, mangaDaJaquetaFrancesa, mangaDeMoletom, mangaDeQuimono,
  mangaDoBlazer, meiaDeCoxa, moletomComCapuz, oculosDeSol, perneiraXadrez, quepeDoCookie,
  vestidoDaLoja, vestidoGatinho, vestidoMarinheiro, vestidoRosa,
  luvasDeJardim, pulseiraDeMicangas, presilhaDeEstrela, adesivoDeCoracao,
} from './roupas';
import {
  luvasDeGirassol, luvasDeJoaninha, luvasDeFolha, luvasDeGotinha,
  pulseiraDeFlores, pulseiraDePedrinhas,
  pinDeMargarida, pinDeJoaninha, pinDeAbelhinha, pinDeBorboleta,
  estampaJoaninha, estampaBorboleta, estampaAbelha, estampaFlorzinhas, mangaDeFlorzinhas,
  camisetaLargaCogumelo, camisetaLargaSapo, camisetaLargaLavanda, mangaLarga,
  vestidoDeMargaridas, vestidoDeRosinhas, vestidoDoCampo,
  calcaCargoDeJardim, calcaPantalona, calcaDeJardineiro,
} from './roupasDoJardim';

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
    // SEM `cobreCabelo`: ele POUSA em cima da juba, como o quepe da bilheteria
    // e o chapeu de campeao. Justo, ele sumia com o cabelo e tapava os olhos
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
   * estrelas (a flag `gravata-do-walter`): foi a PRIMEIRA peca do guarda-roupa
   * que se ganha jogando, e o molde das quatro da arena que vieram depois. Por
   * isso a `nota` diz de quem ela veio.
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
  /*
   * OS PRÊMIOS DOS MARCOS DA ESTUFA (`minigames/jardim/premios.ts`): a
   * Josefina dá o chapéu na primeira vez que a dupla vence a onda 10, e o
   * avental na 20. Como a gravatinha e os prêmios da arena, não têm `preco`
   * nem entram na lista do armário: quem entrega é `g.ganharPeca`, que anota
   * em `save.premios` e faz a peça voltar a cada abertura.
   */
  chapeuDeJardineira: {
    id: 'chapeu-de-jardineira',
    nome: 'Chapéu de jardineira',
    icone: '👒',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.chapeuPalha,
    corDetalhe: P.chapeuPalhaFita,
    nota: 'da Josefina, pelas dez levas',
    extra: chapeuDeJardineira,
  },
  aventalDaJosefina: {
    id: 'avental-da-josefina',
    nome: 'Avental da Josefina',
    icone: '🧺',
    tipo: 'vestivel',
    slot: 'tronco',
    // SEM `cor` e SEM `corDetalhe`: numa peça de tronco elas pintam a camiseta
    // e a MANGA — com `corDetalhe` verde, a primeira foto saiu de manga verde.
    // O avental vai por cima e não mexe no que está embaixo
    nota: 'da Josefina, pelas vinte levas',
    extra: aventalDaJosefina,
  },
  /*
   * A LOJINHA DA JOSEFINA (a banca no canto da estufa): roupa de mexer na
   * terra. Todas com `preco` e fora das araras da Estella — quem as põe à
   * venda é `ROUPAS_DA_JOSEFINA`, lá embaixo. Três são a MESMA geometria em
   * outra cor (bota, gorro, camiseta lisa); a camiseta de girassol traz a flor.
   */
  galochaVerde: {
    id: 'galocha-verde', nome: 'Galocha verde', icone: '🥾',
    tipo: 'vestivel', slot: 'pes',
    cor: P.galochaVerde, corDetalhe: P.galochaVerdeCano,
    nota: 'para pisar na terra molhada', preco: 48,
    extra: canoDaBota,
  },
  camisetaDeGirassol: {
    id: 'camiseta-de-girassol', nome: 'Camiseta de girassol', icone: '🌻',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaGirassol, corDetalhe: P.camisetaGirassolManga,
    nota: 'com a flor bordada no peito', preco: 38,
    extra: girassolNoPeito,
  },
  camisetaVerdeFolha: {
    id: 'camiseta-verde-folha', nome: 'Camiseta verde-folha', icone: '👕',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaFolha, corDetalhe: P.camisetaFolhaManga,
    nota: 'da cor da estufa', preco: 32,
  },
  /*
   * O CHAPÉU JOANINHA era o "gorro joaninha" (o gorro de lã em vermelho). O
   * Renan pediu um chapéu de jardinagem pequeno com o desenho da joaninha, e
   * o ID FICOU O MESMO de propósito: quem já tinha comprado o gorro abre o
   * guarda-roupa e acha o chapéu, sem perder a compra.
   */
  gorroJoaninha: {
    id: 'gorro-joaninha', nome: 'Chapéu joaninha', icone: '🐞',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.joaninhaVermelho,
    nota: 'vermelho, de bolinha branca e anteninha', preco: 40,
    extra: chapeuJoaninha,
  },
  // --- os de personagem (a lojinha da Josefina): cada peça lembra alguém
  tiaraDoWalter: {
    id: 'tiara-do-walter', nome: 'Orelhinhas do Walter', icone: '🐶',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.cachorroPelo,
    nota: 'orelha caída e a gravatinha dele', preco: 36,
    extra: tiaraDoWalter,
  },
  // O Pelusa é UM gatinho. O id ficou com o "da" de quando a peça saiu
  // escrita errado: o save guarda a peça pelo id, e trocar deixaria órfã a
  // tiara de quem já comprou. O nome, que é o que aparece, está certo.
  tiaraDoPelusa: {
    id: 'tiara-da-pelusa', nome: 'Orelhinhas do Pelusa', icone: '🐱',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.pelusaBranco,
    nota: 'de gatinho, com o miolo rosa', preco: 36,
    extra: tiaraDoPelusa,
  },
  boneDaGina: {
    id: 'bone-da-gina', nome: 'Boné da Gina', icone: '🦒',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.girafaPelo,
    nota: 'de girafa, com os chifrinhos', preco: 44,
    extra: boneDaGina,
  },
  mochilaCasco: {
    id: 'mochila-casco', nome: 'Mochila casco da Josefina', icone: '🐢',
    tipo: 'vestivel', slot: 'tronco',
    // SEM `cor`: a camiseta de baixo continua a da pessoa; a mochila vai por cima
    amostra: P.tartarugaCasco,
    nota: 'com o laço rosa dela', preco: 58,
    extra: mochilaCascoDaJosefina,
  },
  camisetaSalvaVidas: {
    id: 'camiseta-salva-vidas', nome: 'Camiseta salva-vidas do Capy', icone: '🛟',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaSalvaVidas, corDetalhe: P.camisetaSalvaVidasManga,
    nota: 'da piscina do clube', preco: 40,
    extra: estampaSalvaVidas,
  },
  /* ====================================================================
   *      A SEGUNDA LEVA DA LOJINHA DA JOSEFINA (`world/roupasDoJardim.ts`)
   * ====================================================================
   * Pedido do Renan: luvas estampadas com coisas do jogo (uma verde), pins de
   * flor e de bichinho, pulseiras de flor e de pedrinha, vestidos floridos,
   * camisetas de natureza, camisetas largas e calças largas de jardinagem.
   * Destrancam aos poucos pelo recorde da estufa (`LOJA_ABRE`, em
   * `minigames/jardim/premios.ts`).
   */
  // ---- luvas (vaga das mãos): cada uma estampa uma coisa do jogo
  luvasDeFolha: {
    id: 'luvas-de-folha', nome: 'Luvas verde-folha', icone: '🌿',
    tipo: 'vestivel', slot: 'maos',
    cor: P.luvaFolha, corDetalhe: P.luvaFolhaPunho,
    nota: 'com uma folha no dorso, da cor da estufa', preco: 34,
    extra: luvasDeFolha,
  },
  luvasDeGirassol: {
    id: 'luvas-de-girassol', nome: 'Luvas de girassol', icone: '🌻',
    tipo: 'vestivel', slot: 'maos',
    cor: P.luvaGirassol, corDetalhe: P.luvaGirassolPunho,
    nota: 'o girassol da estufa bordado no dorso', preco: 36,
    extra: luvasDeGirassol,
  },
  luvasDeJoaninha: {
    id: 'luvas-de-joaninha', nome: 'Luvas de joaninha', icone: '🐞',
    tipo: 'vestivel', slot: 'maos',
    cor: P.luvaJoaninha, corDetalhe: P.joaninhaPreto,
    nota: 'de bolinha, com uma joaninha pousada', preco: 38,
    extra: luvasDeJoaninha,
  },
  luvasDeGotinha: {
    id: 'luvas-de-gotinha', nome: 'Luvas de gotinha', icone: '💧',
    tipo: 'vestivel', slot: 'maos',
    cor: P.luvaGota, corDetalhe: P.luvaGotaPunho,
    nota: 'com as gotinhas azuis que os bichos soltam', preco: 38,
    extra: luvasDeGotinha,
  },
  // ---- pulseiras (vaga das mãos), no pulso esquerdo
  pulseiraDeFlores: {
    id: 'pulseira-de-flores', nome: 'Pulseira de florzinhas', icone: '🌼',
    tipo: 'vestivel', slot: 'maos',
    nota: 'um cordão verde cheio de flor', preco: 28,
    amostra: P.florRosa,
    extra: pulseiraDeFlores,
  },
  pulseiraDePedrinhas: {
    id: 'pulseira-de-pedrinhas', nome: 'Pulseira de pedrinhas', icone: '💎',
    tipo: 'vestivel', slot: 'maos',
    nota: 'quartzo, ametista, água-marinha, citrino e jade', preco: 34,
    amostra: P.pedraAmetista,
    extra: pulseiraDePedrinhas,
  },
  // ---- pins de cabelo (vaga do acessório, presos na cabeça)
  pinDeMargarida: {
    id: 'pin-de-margarida', nome: 'Pin de margarida', icone: '🌼',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca',
    nota: 'preso no cabelo', preco: 22, amostra: P.florBranca,
    extra: pinDeMargarida,
  },
  pinDeJoaninha: {
    id: 'pin-de-joaninha', nome: 'Pin de joaninha', icone: '🐞',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca',
    nota: 'uma joaninha subindo pelo cabelo', preco: 24, amostra: P.joaninhaVermelho,
    extra: pinDeJoaninha,
  },
  pinDeAbelhinha: {
    id: 'pin-de-abelhinha', nome: 'Pin de abelhinha', icone: '🐝',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca',
    nota: 'a abelha e a florzinha dela', preco: 24, amostra: P.abelhaAmarela,
    extra: pinDeAbelhinha,
  },
  pinDeBorboleta: {
    id: 'pin-de-borboleta', nome: 'Pin de borboleta', icone: '🦋',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca',
    nota: 'lilás e rosa, de asa aberta', preco: 26, amostra: P.borboletaAsa,
    extra: pinDeBorboleta,
  },
  // ---- camisetas de natureza (justas, com estampa)
  camisetaDeFlorzinhas: {
    id: 'camiseta-de-florzinhas', nome: 'Camiseta de florzinhas', icone: '🌸',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaFlorzinha, corDetalhe: P.camisetaFlorzinhaManga,
    nota: 'florida de ponta a ponta, até na manga', preco: 42,
    extra: estampaFlorzinhas, extraBraco: mangaDeFlorzinhas,
  },
  camisetaDeJoaninha: {
    id: 'camiseta-de-joaninha', nome: 'Camiseta de joaninha', icone: '🐞',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaJoaninha, corDetalhe: P.camisetaJoaninhaManga,
    nota: 'a joaninha subindo pela folha', preco: 40,
    extra: estampaJoaninha,
  },
  camisetaDeAbelhinha: {
    id: 'camiseta-de-abelhinha', nome: 'Camiseta de abelhinha', icone: '🐝',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaAbelha, corDetalhe: P.camisetaAbelhaManga,
    nota: 'a abelha voando até a flor', preco: 40,
    extra: estampaAbelha,
  },
  camisetaDeBorboleta: {
    id: 'camiseta-de-borboleta', nome: 'Camiseta de borboleta', icone: '🦋',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaBorboleta, corDetalhe: P.camisetaBorboletaManga,
    nota: 'três borboletas no peito', preco: 42,
    extra: estampaBorboleta,
  },
  // ---- camisetas largas (soltas do corpo, manga larga até o cotovelo)
  camisetaLargaCogumelo: {
    id: 'larga-de-cogumelo', nome: 'Camiseta larga de cogumelo', icone: '🍄',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.largaCogumelo, corDetalhe: P.largaCogumeloBarra,
    nota: 'larguinha, com o cogumelo de bolinha', preco: 52,
    extra: camisetaLargaCogumelo, extraBraco: mangaLarga,
  },
  camisetaLargaSapo: {
    id: 'larga-de-sapinho', nome: 'Camiseta larga de sapinho', icone: '🐸',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.largaSapo, corDetalhe: P.largaSapoBarra,
    nota: 'larguinha, com a carinha do sapo', preco: 52,
    extra: camisetaLargaSapo, extraBraco: mangaLarga,
  },
  camisetaLargaLavanda: {
    id: 'larga-de-lavanda', nome: 'Camiseta larga de lavanda', icone: '💜',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.largaLavanda, corDetalhe: P.largaLavandaBarra,
    nota: 'larguinha, com o raminho de lavanda', preco: 55,
    extra: camisetaLargaLavanda, extraBraco: mangaLarga,
  },
  // ---- vestidos floridos (de alça: braço e perna à mostra)
  vestidoDeMargaridas: {
    id: 'vestido-de-margaridas', nome: 'Vestido de margaridas', icone: '🌼',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.vestidoMargarida, corDetalhe: P.vestidoMargaridaBarra,
    nota: 'verde-água, com margaridas nos dois babados', preco: 68,
    bracosNus: true, pernasNuas: true,
    extra: vestidoDeMargaridas,
  },
  vestidoDeRosinhas: {
    id: 'vestido-de-rosinhas', nome: 'Vestido de rosinhas', icone: '🌷',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.vestidoRosinha, corDetalhe: P.vestidoRosinhaBarra,
    nota: 'rosa-claro, florido de rosinha', preco: 68,
    bracosNus: true, pernasNuas: true,
    extra: vestidoDeRosinhas,
  },
  vestidoDoCampo: {
    id: 'vestido-do-campo', nome: 'Vestido do campo', icone: '💐',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.vestidoCampo, corDetalhe: P.vestidoCampoBarra,
    nota: 'azul-céu, com flor amarela, branca e lilás', preco: 72,
    bracosNus: true, pernasNuas: true,
    extra: vestidoDoCampo,
  },
  // ---- calças largas de jardinagem
  calcaCargoDeJardim: {
    id: 'calca-cargo-de-jardim', nome: 'Calça cargo de jardim', icone: '👖',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.calcaCargo, corDetalhe: P.calcaCargoBolso,
    nota: 'larga, com bolsão e joelheira para ajoelhar na horta', preco: 58,
    extra: calcaCargoDeJardim,
  },
  calcaPantalona: {
    id: 'calca-pantalona', nome: 'Pantalona verde-musgo', icone: '🌱',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.calcaPantalona, corDetalhe: P.calcaPantalonaBarra,
    nota: 'bem aberta embaixo, com um raminho bordado', preco: 60,
    extra: calcaPantalona,
  },
  calcaDeJardineiro: {
    id: 'calca-de-jardineiro', nome: 'Calça de jardineiro', icone: '🪴',
    tipo: 'vestivel', slot: 'pernas',
    cor: P.calcaJardineiro, corDetalhe: P.calcaJardineiroCostura,
    nota: 'de brim, com a pazinha no bolso e remendo de flor', preco: 58,
    extra: calcaDeJardineiro,
  },
  camisetaRodaGigante: {
    id: 'camiseta-roda-gigante', nome: 'Camiseta da roda gigante', icone: '🎡',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaRoda, corDetalhe: P.camisetaRodaManga,
    nota: 'lembrança do Villa Lobos', preco: 40,
    extra: estampaRodaGigante,
  },
  camisetaBarDeSucos: {
    id: 'camiseta-bar-de-sucos', nome: 'Camiseta do bar de sucos', icone: '🍊',
    tipo: 'vestivel', slot: 'tronco',
    cor: P.camisetaSucos, corDetalhe: P.camisetaSucosManga,
    nota: 'o teal do Noel, com a laranja', preco: 40,
    extra: estampaLaranja,
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
  // O VESTIÁRIO DO CLUBE (pedido do Renan: o vestiário virou guarda-roupa, com
  // uma aba de roupas de piscina para desbloquear a até R$ 20 cada). Tudo aqui
  // tem `preco` — desbloquear é comprar, pela carteira do casal — e a lista do
  // que o vestiário vende é `MODA_PRAIA`, lá embaixo.
  //
  // As BERMUDAS declaram `corBanho` e NÃO declaram `cor`: essa ausência é o
  // que diz ao rig "isto é uma bermuda". No clube ela pinta o calção do traje
  // de banho (sem camiseta); fora dele, desde o pedido do Renan de usar o
  // shorts no parque e no resto, o rig veste o MESMO calção e as mesmas pernas
  // de shorts por cima da perna de pele, com a camiseta de sempre
  // (`aplicarVisual`, "a bermuda na rua"). As estampadas novas põem a estampa
  // por cima do calção: `extraQuadril` no quadril, `extra` em cada perna, e
  // `corDetalhe` é a cor da estampa.
  //
  // `praia` é a marca da peça que continua no corpo DENTRO do clube (chinelo,
  // boia, colar, a estampa da bermuda): lá é traje de banho, e sem a marca só
  // ficam a cabeça e o acessório.
  //
  // O ÓCULOS ESCURO é ACESSÓRIO (preso na cabeça), e não mais cabeça: pedido
  // do Renan, para dar para usar óculos junto com chapéu. O save antigo que o
  // tinha na vaga da cabeça muda ele de vaga sozinho (`SaveState`).
  oculosEscuros: {
    id: 'oculos-escuros',
    nome: 'Óculos escuros',
    icone: '🕶️',
    tipo: 'vestivel',
    slot: 'acessorio',
    presoEm: 'cabeca',
    praia: true,
    preco: 10,
    amostra: P.oculosLente,
    nota: 'o de sempre do vestiário',
    extra: oculosDeSol,
  },
  oculosRedondo: {
    id: 'oculos-redondo', nome: 'Óculos redondinho', icone: '👓',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca', praia: true,
    preco: 14, amostra: P.oculosDourado,
    nota: 'aro dourado fino e lente âmbar',
    extra: oculosRedondo,
  },
  oculosGatinho: {
    id: 'oculos-gatinho', nome: 'Óculos gatinho', icone: '😼',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca', praia: true,
    preco: 15, amostra: P.oculosGatinhoRosa,
    nota: 'rosa, de pontinha, com strass',
    extra: oculosGatinho,
  },
  oculosDeCoracao: {
    id: 'oculos-de-coracao', nome: 'Óculos de coração', icone: '😍',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca', praia: true,
    preco: 15, amostra: P.oculosCoracaoAro,
    nota: 'para ver a piscina toda cor-de-rosa',
    extra: oculosDeCoracao,
  },
  oculosEspelhado: {
    id: 'oculos-espelhado', nome: 'Óculos espelhado', icone: '😎',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca', praia: true,
    preco: 18, amostra: P.oculosEspelhado,
    nota: 'esportivo, a lente azul dando a volta',
    extra: oculosEspelhado,
  },
  oculosDeNatacao: {
    id: 'oculos-de-natacao', nome: 'Óculos de natação', icone: '🥽',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca', praia: true,
    preco: 12, amostra: P.oculosNatacaoLente,
    nota: 'com a tira em volta da cabeça',
    extra: oculosDeNatacao,
  },
  bermudaAzul: {
    id: 'bermuda-azul',
    nome: 'Bermuda azul',
    icone: '🩳',
    tipo: 'vestivel',
    slot: 'pernas',
    corBanho: P.bermudaAzul,
    praia: true,
    preco: 10,
    nota: 'a cor da própria piscina',
  },
  bermudaVermelha: {
    id: 'bermuda-vermelha',
    nome: 'Bermuda vermelha',
    icone: '🩳',
    tipo: 'vestivel',
    slot: 'pernas',
    corBanho: P.bermudaVermelha,
    praia: true,
    preco: 10,
    nota: 'dá pra achar de longe',
  },
  bermudaAmarela: {
    id: 'bermuda-amarela',
    nome: 'Bermuda amarela',
    icone: '🩳',
    tipo: 'vestivel',
    slot: 'pernas',
    corBanho: P.bermudaAmarela,
    praia: true,
    preco: 10,
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
    praia: true,
    preco: 12,
    nota: 'duas faixas cor de areia',
  },
  bermudaListrada: {
    id: 'bermuda-listrada', nome: 'Bermuda listrada', icone: '⚓',
    tipo: 'vestivel', slot: 'pernas', praia: true, preco: 14,
    corBanho: P.bermudaMarinho, corDetalhe: P.bermudaListraCreme,
    nota: 'de marinheiro, com âncora e cordão',
    extra: bermudaListrada.perna, extraQuadril: bermudaListrada.quadril,
  },
  bermudaDeBolinhas: {
    id: 'bermuda-de-bolinhas', nome: 'Bermuda de bolinhas', icone: '🫧',
    tipo: 'vestivel', slot: 'pernas', praia: true, preco: 14,
    corBanho: P.bermudaVerdeAgua, corDetalhe: P.bermudaBolinha,
    nota: 'verde-água de bolinha branca',
    extra: bermudaDeBolinhas.perna, extraQuadril: bermudaDeBolinhas.quadril,
  },
  bermudaHavaiana: {
    id: 'bermuda-havaiana', nome: 'Bermuda havaiana', icone: '🌺',
    tipo: 'vestivel', slot: 'pernas', praia: true, preco: 18,
    corBanho: P.bermudaHavaiana, corDetalhe: P.hibiscoVermelho,
    nota: 'hibisco vermelho e rosa, folha escura',
    extra: bermudaHavaiana.perna, extraQuadril: bermudaHavaiana.quadril,
  },
  bermudaDeAbacaxi: {
    id: 'bermuda-de-abacaxi', nome: 'Bermuda de abacaxi', icone: '🍍',
    tipo: 'vestivel', slot: 'pernas', praia: true, preco: 18,
    corBanho: P.bermudaRosaAbacaxi, corDetalhe: P.abacaxiAmarelo,
    nota: 'rosa, de abacaxizinho',
    extra: bermudaDeAbacaxi.perna, extraQuadril: bermudaDeAbacaxi.quadril,
  },
  bermudaDeMelancia: {
    id: 'bermuda-de-melancia', nome: 'Bermuda de melancia', icone: '🍉',
    tipo: 'vestivel', slot: 'pernas', praia: true, preco: 18,
    corBanho: P.bermudaMelancia, corDetalhe: P.melanciaSemente,
    nota: 'com semente, e a casca na barra',
    extra: bermudaDeMelancia.perna, extraQuadril: bermudaDeMelancia.quadril,
  },
  bermudaDeOndinhas: {
    id: 'bermuda-de-ondinhas', nome: 'Bermuda de ondinhas', icone: '🌊',
    tipo: 'vestivel', slot: 'pernas', praia: true, preco: 16,
    corBanho: P.bermudaAzulMar, corDetalhe: P.ondaEspuma,
    nota: 'azul-mar com a crista das ondas',
    extra: bermudaDeOndinhas.perna, extraQuadril: bermudaDeOndinhas.quadril,
  },
  chineloAzul: {
    id: 'chinelo-azul', nome: 'Chinelo azul', icone: '🩴',
    tipo: 'vestivel', slot: 'pes', praia: true, pesNus: true, preco: 8,
    cor: P.chineloAzul, corDetalhe: P.chineloSolaBranca,
    nota: 'o de dedo, de sola branca',
    extra: chineloAzul,
  },
  chineloVerdeLimao: {
    id: 'chinelo-verde-limao', nome: 'Chinelo verde-limão', icone: '🩴',
    tipo: 'vestivel', slot: 'pes', praia: true, pesNus: true, preco: 8,
    cor: P.chineloAmarelo, corDetalhe: P.chineloVerdeLimao,
    nota: 'sola verde e tira amarela',
    extra: chineloAzul,
  },
  chineloFlorido: {
    id: 'chinelo-florido', nome: 'Chinelo florido', icone: '🌸',
    tipo: 'vestivel', slot: 'pes', praia: true, pesNus: true, preco: 12,
    cor: P.chineloRosa, corDetalhe: P.chineloSolaRosa,
    nota: 'rosa, com a florzinha na tira',
    extra: chineloFlorido,
  },
  chineloDeMelancia: {
    id: 'chinelo-de-melancia', nome: 'Chinelo de melancia', icone: '🍉',
    tipo: 'vestivel', slot: 'pes', praia: true, pesNus: true, preco: 14,
    cor: P.melanciaCasca, corDetalhe: P.bermudaMelancia,
    nota: 'a sola é uma fatia, com semente',
    extra: chineloDeMelancia,
  },
  chineloSlide: {
    id: 'chinelo-slide', nome: 'Chinelo slide do clube', icone: '🌊',
    tipo: 'vestivel', slot: 'pes', praia: true, pesNus: true, preco: 16,
    cor: P.chineloSlide, corDetalhe: P.chineloSolaBranca,
    nota: 'faixa larga com a ondinha do clube',
    extra: chineloSlide,
  },
  chapeuDePraia: {
    id: 'chapeu-de-praia', nome: 'Chapéu de praia', icone: '👒',
    tipo: 'vestivel', slot: 'cabeca', preco: 18,
    cor: P.chapeuPraia, corDetalhe: P.chapeuPraiaListra,
    nota: 'de pescador, listrado de azul',
    extra: chapeuDePraia,
  },
  toucaDeNatacao: {
    id: 'touca-de-natacao', nome: 'Touca de natação', icone: '🏊',
    tipo: 'vestivel', slot: 'cabeca', preco: 15, cobreCabelo: true,
    cor: P.toucaNatacao,
    nota: 'das antigas, com flor de borracha',
    extra: toucaDeNatacao,
  },
  tiaraDeConchinhas: {
    id: 'tiara-de-conchinhas', nome: 'Tiara de conchinhas', icone: '🐚',
    tipo: 'vestivel', slot: 'cabeca', preco: 16, amostra: P.estrelaDoMar,
    nota: 'estrela-do-mar, concha e pérola',
    extra: tiaraDeConchinhas,
  },
  boiaDePatinho: {
    id: 'boia-de-patinho', nome: 'Boia de braço de patinho', icone: '🦆',
    tipo: 'vestivel', slot: 'maos', praia: true, preco: 14,
    cor: P.boiaLaranja, corDetalhe: P.boiaCostura,
    nota: 'as braçadeiras, com um patinho',
    extra: boiaDePatinho,
  },
  colarHavaiano: {
    id: 'colar-havaiano', nome: 'Colar havaiano', icone: '🌼',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'corpo', praia: true, preco: 12, amostra: P.colarRosa,
    nota: 'de flor, fica até dentro do clube',
    extra: colarHavaiano,
  },
  camisaHavaiana: {
    id: 'camisa-havaiana', nome: 'Camisa havaiana justa', icone: '🌴',
    tipo: 'vestivel', slot: 'tronco', preco: 20,
    cor: P.camisaHavaiana, corDetalhe: P.camisaHavaiana,
    nota: 'para depois da piscina',
    extra: camisaHavaiana, extraBraco: mangaHavaiana,
  },
  regataListrada: {
    id: 'regata-listrada', nome: 'Regata listrada justa', icone: '🎽',
    tipo: 'vestivel', slot: 'tronco', preco: 16, bracosNus: true,
    cor: P.regataCreme, corDetalhe: P.regataListra,
    nota: 'de marinheiro, com a âncora no peito',
    extra: regataListrada,
  },
  // as versões SOLTAS das duas camisetas (pedido do Renan): o casco largo da
  // camiseta da Josefina, barra abaixo do quadril e manga folgada; a justa
  // manteve o id, então quem já comprou continua com ela
  camisaHavaianaSolta: {
    id: 'camisa-havaiana-solta', nome: 'Camisa havaiana solta', icone: '🌺',
    tipo: 'vestivel', slot: 'tronco', preco: 20, peitoNu: true,
    cor: P.camisaHavaiana, corDetalhe: P.camisaHavaiana,
    nota: 'larga, de botão, decote aberto de verão',
    extra: camisaHavaianaSolta, extraBraco: mangaHavaianaSolta,
  },
  regataListradaSolta: {
    id: 'regata-listrada-solta', nome: 'Regata listrada solta', icone: '⚓',
    tipo: 'vestivel', slot: 'tronco', preco: 18, bracosNus: true, peitoNu: true,
    cor: P.regataCreme, corDetalhe: P.regataListra,
    nota: 'larga, de marinheiro, decote aberto',
    extra: regataListradaSolta,
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

  /*
   * OS DOIS SACOS DA QUEST DO ADUBO (`docs/MINIGAME-JARDIM.md` §2).
   *
   * As `nota` dizem de ONDE a coisa veio, e nunca para ONDE ela vai. E a regra
   * da quest inteira: o jogo entrega os dois fios (semente, adubo) e quem liga
   * "quem come semente por aqui?" e "quem cuida de planta por aqui?" e o
   * jogador. Um item chamado "Sementes pro Noel" acabaria com a charada numa
   * palavra.
   */
  sementes: {
    id: 'sementes',
    nome: 'Saco de sementes',
    icone: '🌾',
    tipo: 'mao',
    nota: 'esquecido num banco do parque',
    holdPose: 'relaxed',
  },
  adubo: {
    id: 'adubo',
    nome: 'Saco de adubo',
    icone: '🪱',
    tipo: 'mao',
    nota: 'presente do Noel, do bar de sucos',
    holdPose: 'relaxed',
  },
  /**
   * O REGADOR da bancada da estufa — e a arma do minigame do jardim.
   *
   * Ele e um item de MAO como qualquer outro, e isso nao e detalhe: o Renan
   * quis que a estufa continue sendo um lugar onde se anda normalmente, e que o
   * minigame comece porque o jogador FOI PEGAR O REGADOR e regou as plantas.
   * Uma arma que so existe dentro de um modo de jogo precisaria de um sistema
   * de estado proprio; um item que se pega numa bancada nao precisa de nada
   * novo — a mochila ja sabe guardar, largar e mostrar na mao.
   *
   * A `holdPose` e a unica coisa dele que e especial: braco levantado, que e a
   * pose que faz a lata aparecer acima da linha do canteiro.
   */
  regador: {
    id: 'regador',
    nome: 'Regador',
    icone: '🪣',
    tipo: 'mao',
    nota: 'da bancada da Josefina',
    holdPose: 'regando',
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
    extra: gorroDeLa,
  },
  gorroMusgo: {
    id: 'gorro-musgo', nome: 'Gorro musgo', icone: '🧢',
    tipo: 'vestivel', slot: 'cabeca',
    cor: P.lojaGorroMusgo, corDetalhe: P.lojaGorroMusgoBarra,
    nota: 'lã grossa', preco: 42,
    extra: gorroDeLa,
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
  /*
   * AS MIUDEZAS: as primeiras peças das duas vagas novas (pedido do Renan: uma
   * vaga de MÃOS, para luva e pulseira, e uma de ACESSÓRIO, para as coisas
   * pequenas que vão em qualquer parte do corpo). Moram na arara de frio e pé.
   */
  luvasDeJardim: {
    id: 'luvas-de-jardim', nome: 'Luvas de jardim', icone: '🧤',
    tipo: 'vestivel', slot: 'maos',
    cor: P.luvaDeJardim, corDetalhe: P.bandeirinhaVerde,
    nota: 'coral com o punho verde', preco: 45,
    extra: luvasDeJardim,
  },
  pulseiraDeMicangas: {
    id: 'pulseira-micangas', nome: 'Pulseira de miçangas', icone: '📿',
    tipo: 'vestivel', slot: 'maos',
    cor: P.bandeirinhaRosa, corDetalhe: P.cadeadoOuro,
    nota: 'no pulso esquerdo, com um coraçãozinho', preco: 38,
    extra: pulseiraDeMicangas,
  },
  presilhaDeEstrela: {
    id: 'presilha-estrela', nome: 'Presilha de estrela', icone: '⭐',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'cabeca',
    cor: P.cadeadoOuro, corDetalhe: P.metalWhite,
    nota: 'presa no cabelo, do lado direito', preco: 35,
    extra: presilhaDeEstrela,
  },
  adesivoDeCoracao: {
    id: 'adesivo-coracao', nome: 'Adesivo de coração', icone: '💟',
    tipo: 'vestivel', slot: 'acessorio', presoEm: 'corpo',
    cor: P.flowerPink, corDetalhe: P.metalWhite,
    nota: 'colado no peito da camiseta', preco: 35,
    extra: adesivoDeCoracao,
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
    extra: gorroDeLa,
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

  /* ====================================================================
   *        OS PREMIOS DA ARENA — o que cada desafiante batido da
   * ====================================================================
   *
   * Nenhuma delas tem `preco`: NAO ESTAO A VENDA em lugar nenhum, e nao estao
   * no armario do Ari. E o mesmo precedente da gravatinha do Walter, so que
   * com quatro donos — a peca so entra no guarda-roupa quando a partida contra
   * aquele bicho for ganha e o papel dele for clicado no quadro.
   *
   * A `nota` de cada uma diz de quem ela veio, que e a unica coisa que separa
   * um premio de mais uma roupa na arara.
   */

  // ------------------------------------------------------ Jean-Luc: a jaqueta
  jaquetaDoJeanLuc: {
    id: 'jaqueta-jean-luc',
    nome: 'Jaqueta da França',
    icone: '🧥',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.jaquetaFranca,
    corDetalhe: P.jaquetaFrancaManga,
    nota: 'do Jean-Luc · com o patinho no peito',
    extra: jaquetaFrancesa,
    extraBraco: mangaDaJaquetaFrancesa,
  },

  // ------------------------------------------------------- Cookie: o quepe
  quepeDoCookie: {
    id: 'quepe-cookie',
    nome: 'Quepe da bilheteria',
    icone: '🧢',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.quepeCookie,
    corDetalhe: P.quepeCookieFita,
    nota: 'do Cookie · ele tem outro igual',
    // SEM `cobreCabelo`: ele POUSA em cima do cabelo, como o chapeu de campeao,
    // e nao aperta a cabeca como o gorro de la. Sumir com a juba de alguem para
    // um bone caber e o contrario do que um bone faz
    extra: quepeDoCookie,
  },

  /* ------------------------------------------- Estella: o conjunto de xadrez
   *
   * Quatro pecas, uma por vaga do corpo, e nao uma peca so: ela e ESTILISTA, e
   * estilista nao presenteia uma blusa avulsa. Vestir as quatro juntas e o
   * conjunto inteiro; vestir so o blazer tambem funciona, porque cada uma
   * continua sendo uma peca normal do guarda-roupa.
   *
   * O CLARO E A COR DA FICHA e o escuro sao as casas por cima — ver
   * `casasDeXadrez`, em `roupas.ts`. Na calca isso fica ainda mais barato: a
   * `cor` repinta a perna que o corpo ja tem, e a geometria so acrescenta as
   * casas escuras.
   */
  blazerDaEstella: {
    id: 'blazer-xadrez',
    nome: 'Blazer de xadrez',
    icone: '♟️',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.xadrezPano,
    corDetalhe: P.xadrezPanoEscuro,
    nota: 'da Estella · com o broche de dama na lapela',
    extra: blazerXadrez,
    extraBraco: mangaDoBlazer,
  },
  calcaDaEstella: {
    id: 'calca-xadrez',
    nome: 'Calça de xadrez',
    icone: '♟️',
    tipo: 'vestivel',
    slot: 'pernas',
    cor: P.xadrezPano,
    corDetalhe: P.xadrezPanoEscuro,
    nota: 'da Estella · o par do blazer',
    extra: perneiraXadrez,
  },
  coroaDaEstella: {
    id: 'coroa-dama',
    nome: 'Coroa de dama',
    icone: '👑',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.xadrezDourado,
    corDetalhe: P.xadrezForro,
    nota: 'da Estella · «a dama anda como quiser, meu bem»',
    extra: coroaDeDama,
  },
  botaDaEstella: {
    id: 'bota-xadrez',
    nome: 'Bota de xadrez',
    icone: '👢',
    tipo: 'vestivel',
    slot: 'pes',
    cor: P.xadrezPanoEscuro,
    corDetalhe: P.xadrezDourado,
    nota: 'da Estella · fecha o conjunto',
    extra: canoDaBota,
  },

  // ------------------------------------------------------- Mano: os patins
  /**
   * OS PATINS DA PRACA DE GELO. Sao FUNCIONAIS, como os da lojinha: dao a
   * mesma 1,3x de velocidade e viajam na mochila. Calcar um tira o outro — os
   * dois sao da vaga dos pes, e a vaga e uma so.
   *
   * A `cor` aqui pinta a BOTA do patins, e nao o sapato do corpo (que o patins
   * esconde inteiro) — ver `enfeite`, em `core/types.ts`.
   */
  patinsDoMano: {
    id: 'patins-mano',
    nome: 'Patins da praça de gelo',
    icone: '🛼',
    tipo: 'vestivel',
    slot: 'pes',
    funcional: true,
    cor: P.patinsGeloBota,
    corDetalhe: P.patinsGeloRoda,
    enfeite: 'sorvete',
    nota: 'do Mano · +velocidade, e uma casquinha de cada lado',
  },
} as const satisfies Record<string, ItemDef>;

/**
 * O PREMIO DE CADA DESAFIANTE DO QUADRO, pelo `id` dele.
 *
 * Um lugar so, pelo mesmo motivo do `MODA_PRAIA` e das araras: a cena grava a
 * vitoria, o painel desenha o premio e o guarda-roupa repoe a peca, e os tres
 * nao tem como discordar sobre o que o Cookie da.
 *
 * A dupla (`parceiro`) NAO esta aqui de proposito: o premio de ganhar deles
 * e o chapeu de campeao, que ja existia antes do quadro e entra pela mao, e
 * nao pelo papel pregado.
 */
export const PREMIOS_DA_ARENA: Record<string, readonly ItemDef[]> = {
  'jean-luc': [ITENS.jaquetaDoJeanLuc],
  cookie: [ITENS.quepeDoCookie],
  estella: [
    ITENS.blazerDaEstella, ITENS.calcaDaEstella, ITENS.coroaDaEstella, ITENS.botaDaEstella,
  ],
  mano: [ITENS.patinsDoMano],
};

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
    titulo: 'Frio, pé e miudezas',
    fala: 'Gorro e bota. Nesta cidade não faz frio, e mesmo assim isso aqui esgota.',
    pecas: [
      ITENS.gorroAzul, ITENS.gorroMusgo, ITENS.botaVermelha, ITENS.botaCreme,
      ITENS.luvasDeJardim, ITENS.pulseiraDeMicangas, ITENS.presilhaDeEstrela, ITENS.adesivoDeCoracao,
    ],
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
 * O que o vestiário do clube VENDE — a aba "Roupas de piscina".
 *
 * Um lugar só: o painel DESENHA por esta lista, e a conta de quem já tinha as
 * peças de antes (o óculos e as quatro bermudas saíam de graça no vestiário
 * antigo) também passa por ela. Na ordem das partes do corpo, que é a ordem
 * em que o painel as mostra.
 */
export const MODA_PRAIA: readonly ItemDef[] = [
  // cabeça
  ITENS.chapeuDePraia, ITENS.toucaDeNatacao, ITENS.tiaraDeConchinhas,
  // tronco
  ITENS.camisaHavaiana, ITENS.camisaHavaianaSolta, ITENS.regataListrada, ITENS.regataListradaSolta,
  // pernas
  ITENS.bermudaAzul, ITENS.bermudaVermelha, ITENS.bermudaAmarela, ITENS.bermudaEstampada,
  ITENS.bermudaListrada, ITENS.bermudaDeBolinhas, ITENS.bermudaDeOndinhas,
  ITENS.bermudaHavaiana, ITENS.bermudaDeAbacaxi, ITENS.bermudaDeMelancia,
  // pés
  ITENS.chineloAzul, ITENS.chineloVerdeLimao, ITENS.chineloFlorido, ITENS.chineloDeMelancia, ITENS.chineloSlide,
  // mãos
  ITENS.boiaDePatinho,
  // acessório
  ITENS.colarHavaiano, ITENS.oculosEscuros, ITENS.oculosRedondo, ITENS.oculosDeNatacao, ITENS.oculosGatinho,
  ITENS.oculosDeCoracao, ITENS.oculosEspelhado,
];

/**
 * As peças que o vestiário ANTIGO dava de graça (o óculos e as quatro
 * bermudas). Quem já tem alguma delas no guarda-roupa não paga de novo: o
 * `Game` registra como comprada (e aí ela é reposta como qualquer compra).
 */
export const MODA_PRAIA_ANTIGA: readonly ItemDef[] = [
  ITENS.oculosEscuros, ITENS.bermudaAzul, ITENS.bermudaVermelha, ITENS.bermudaAmarela, ITENS.bermudaEstampada,
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
/**
 * O DESENHO DO REGADOR QUE ESTÁ NA MÃO — o único item cujo modelo muda com o jogo.
 *
 * As cartas do jardim melhoram o regador e a peça da mão muda junto (§6 do
 * plano). O motor troca isto por `definirEstiloDoRegador` e força a mão a ser
 * refeita; fora da rodada ele volta ao vazio, que é o regador de fábrica.
 */
let estiloDoRegadorNaMao: Partial<EstiloDeRegador> = {};

export function definirEstiloDoRegador(estilo: Partial<EstiloDeRegador> | null): void {
  estiloDoRegadorNaMao = estilo ? { ...estilo } : {};
}

/**
 * A POSE DE SEGURAR um item. É a `holdPose` da ficha — menos o regador na
 * rodada de BORRIFADOR: borrifador não se carrega pendurado como lata, se
 * segura pelo gargalo com o braço esticado para a frente, apontando
 * (`borrifando`, em `CharacterRig`).
 */
export function poseNaMao(item: ItemDef | null): HoldPose {
  if (item?.id === 'regador' && estiloDoRegadorNaMao.arma === 'borrifador') return 'borrifando';
  return item?.holdPose ?? 'none';
}

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
  /**
   * O REGADOR PENDURA PELA ALCA DE CIMA, e nao nasce apoiado na mao.
   *
   * Pedido do Renan olhando a foto, e ele esta certo: e assim que se carrega um
   * regador de verdade. A peca do kit nasce com a BASE em `y = 0`, como todo o
   * kit, entao segurando-a no ponto da mao a lata ficava equilibrada em cima do
   * punho como uma bandeja — o gesto errado.
   *
   * A correcao e um grupo a mais que DESCE a peca ate a barra da alca cair na
   * mao. A altura dela sai de `userData.partes.alturaDaAlca`, e nao de um
   * numero cravado aqui: a carta "Braco solto" troca o arco por um cabo reto
   * mais alto, e sem ler a peca esse regador ficaria pendurado pelo ar.
   *
   * Ele tambem sai MENOR que o do chao (0,78): a peca tem 37 cm, que e a medida
   * ao lado de uma pessoa de 1,75. Pendurada na mao de um boneco chibi, cujo
   * braco e curto, essa medida raspa no chao.
   */
  'regador': () => {
    const g = new THREE.Group();
    // na rodada de mangueira (`armas.ts`) a mão carrega o esguicho no lugar
    const arma = estiloDoRegadorNaMao.arma;
    // o esguicho, a pistola e o borrifador são bem menores que a lata: na mão
    // eles crescem para os detalhes aparecerem
    const lata = arma === 'mangueira' ? esguichoDeMangueira(estiloDoRegadorNaMao, 1.6)
      : arma === 'pistola' ? pistolaDagua(1.6)
        : arma === 'borrifador' ? borrifadorDeJardim(estiloDoRegadorNaMao, 1.45)
          : regadorDeJardim(estiloDoRegadorNaMao);
    const ESCALA = 0.78;
    lata.scale.setScalar(ESCALA);
    lata.position.y = -(lata.userData.partes.alturaDaAlca as number) * ESCALA;
    g.add(lata);
    return g;
  },
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

/**
 * AS ROUPAS DA LOJINHA DA JOSEFINA, na ordem da aba de roupas. A cena da
 * estufa vende por esta lista, e a prova (o boneco) usa a mesma arara da
 * boutique (`g.abrirLoja`).
 */
export const ROUPAS_DA_JOSEFINA: readonly ItemDef[] = [
  // de jardim
  ITENS.camisetaVerdeFolha,
  ITENS.camisetaDeGirassol,
  ITENS.gorroJoaninha,
  ITENS.galochaVerde,
  // de personagem e de lugar: o clube, o parque e quem mora lá
  ITENS.tiaraDoWalter,
  ITENS.tiaraDoPelusa,
  ITENS.boneDaGina,
  ITENS.mochilaCasco,
  ITENS.camisetaSalvaVidas,
  ITENS.camisetaBarDeSucos,
  ITENS.camisetaRodaGigante,
  // a segunda leva (pedido do Renan)
  ITENS.luvasDeFolha, ITENS.luvasDeGirassol, ITENS.luvasDeJoaninha, ITENS.luvasDeGotinha,
  ITENS.pulseiraDeFlores, ITENS.pulseiraDePedrinhas,
  ITENS.pinDeMargarida, ITENS.pinDeJoaninha, ITENS.pinDeAbelhinha, ITENS.pinDeBorboleta,
  ITENS.camisetaDeFlorzinhas, ITENS.camisetaDeJoaninha, ITENS.camisetaDeAbelhinha, ITENS.camisetaDeBorboleta,
  ITENS.camisetaLargaCogumelo, ITENS.camisetaLargaSapo, ITENS.camisetaLargaLavanda,
  ITENS.vestidoDeMargaridas, ITENS.vestidoDeRosinhas, ITENS.vestidoDoCampo,
  ITENS.calcaCargoDeJardim, ITENS.calcaPantalona, ITENS.calcaDeJardineiro,
];
