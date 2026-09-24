import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  arcoDeEstufa, bancadaDeJardinagem, bush, canteiroDeHorta, capim, folhagemAlta, planta,
  livroDeCartas, lojinhaDaJosefina, plaquinhaDaEstufa, portaoDeJardim, regadorDeOuro, prateleiraDeMudas, regador, sebe, tonelDeAgua, tree,
  trelicaComTrepadeira, vasoDePlanta,
} from '../world/props';
import { interiorDoor } from '../world/furniture';
import { ITENS, ROUPAS_DA_JOSEFINA } from '../world/itens';
import { Josefina } from '../entities/bichos/Josefina';
import type { Bicho } from '../entities/bichos/Bicho';
import { Capy } from '../entities/bichos/Capy';
import { Gina } from '../entities/bichos/Gina';
import { Noel } from '../entities/bichos/Noel';
import { Walter } from '../entities/bichos/Walter';
import { JeanLuc } from '../entities/bichos/JeanLuc';
import { GotasDoJardim } from '../entities/GotasDoJardim';
import { MaoDeCartas } from '../minigames/jardim/baralho';
import { CARTAS, cartaPorId, type AjudanteDoClube } from '../minigames/jardim/cartas';
import { PRAGAS } from '../world/bichosDoJardim';
import { nivelDasGotas } from '../minigames/jardim/progressao';
import { cartaNaTela } from '../minigames/jardim/tela';
import { RodadaDoJardim, type ElencoDaEstufa, type QuemAjuda } from '../minigames/jardim/rodada';
import { DECORACOES } from '../world/decoracoes';
import { Decorador } from '../world/decorador';
import { MARCOS, MOEDAS_POR_ONDA, RECORDE, ondasVencidas, pagamentoDaRodada, type MarcoDoJardim } from '../minigames/jardim/premios';
import { DESCRICAO_DA_PRAGA, NOME_DO_TIER, flagDaPraga, pragasDoLivro } from '../minigames/jardim/bestiario';
import type { AcaoNaLoja, ConteudoDaLoja, ConteudoDoLivro } from '../minigames/jardim/tela';
import { ARI, RENAN } from '../characters/cast';
import { asfalto, calcadaDePedrinha, tapeteDeGrama } from '../world/texturasDeChao';
import { toon } from '../core/materials';

/**
 * A ESTUFA DA JOSEFINA — o jardim grande, por dentro.
 *
 * Esta cena e a ETAPA 0 do plano que esta em `docs/MINIGAME-JARDIM.md`: a area
 * foi construida ANTES da quest e antes de qualquer mecanica, que foi o pedido
 * do Renan. Hoje da para entrar, andar e conversar; o roguelite entra por cima
 * dela depois, e ela ja nasceu com a medida dele tomada.
 *
 * PLANTA (a camera ve `-Z` subindo a direita e `-X` subindo a esquerda):
 *
 *      ┌───── canteiros do fundo (z = -8,8) ─────┐
 *   b  │                                          │  t
 *   a  │            O TERREIRO                    │  o
 *   n  │        15 x 11 de saibro,                │  n
 *   c  │            VAZIO                         │  e
 *   a  │                                          │  l
 *      └──── canteiros da frente (z = 8,8) ───┬───┘
 *                                         a PORTA (z = 11)
 *
 * TRES DECISOES QUE NAO SAO ENFEITE, e que o minigame vai cobrar:
 *
 * 1. **O MEIO E VAZIO.** O terreiro de saibro nao tem uma peca em cima, e o
 *    teste (`scripts/estufa.mjs`) prova isso medindo os colisores. E a arena:
 *    survivor sem espaco para correr nao e survivor.
 * 2. **OS CANTEIROS ESTAO NA BEIRADA, e sao oito.** Sao eles que se defende, e
 *    estar na beirada e o que obriga o jogador a escolher um lado — se
 *    estivessem no meio, ficar parado em cima deles seria a jogada otima e nao
 *    haveria jogo.
 * 3. **OS QUATRO CANTOS ESTAO LIVRES.** Sao as bocas por onde os bichos vao
 *    entrar. Nada de movel, nada de vaso, nada de colisor neles.
 *
 * POR QUE NAO TEM TETO. Numa camera isometrica um teto sobre 30 x 22 tapa o
 * cenario inteiro. Quem faz a estufa parecer estufa aqui sao os ARCOS
 * (`arcoDeEstufa`) — duas pernas e uma meia-lua de cantoneira, sem pano de
 * vidro nenhum: lê como cobertura e deixa a camera passar.
 */

const W = 30;
const D = 22;
const hx = W / 2;
const hz = D / 2;

/**
 * O TERREIRO LIMPO — a arena do minigame.
 *
 * Ele ANDOU PARA O FUNDO quando os três portões entraram: o campo de jogo
 * agora é a faixa entre as portas (em `-Z`) e os canteiros (em `+Z`), e o
 * meio geométrico da estufa não é mais o meio do jogo.
 */
const TERREIRO = { x: 0, z: -1.5, largura: 16, profundidade: 13 };

/** o vao da porta de saida, na parede da frente */
const PORTA = { x: 0, z: hz, largura: 1.9, altura: 2.4 };

/**
 * ===================== OS TRES PORTOES DO FUNDO, por onde os bichos entram
 *
 * Decisao do Renan, e ela substitui as quatro bocas de canto que a area tinha
 * (o porque esta em `docs/MINIGAME-JARDIM.md` §8): bicho que pode vir de
 * qualquer canto transforma a rodada em girar a camera, e com uma frente so o
 * que sobra para decidir e QUAL DAS TRES cobrir.
 *
 * ELES FICAM EM `-Z` porque, do lado do clube, e o fundo do predio — a
 * continuidade fecha. E porque `-Z` e a parede mais LONGE da camera: portao de
 * 2,6 m de altura ali nao tapa nada.
 *
 * `PASSO` e a folga que cada vao precisa ter livre para um corpo passar. O
 * jogador tem 42 cm de raio, entao 3 m de vao e folga de sobra para ele e para
 * qualquer bicho — e sobra e o que se quer numa passagem que vai ter enxame
 * atravessando.
 */
const PORTOES = { xs: [-8.5, 0, 8.5], vao: 3, altura: 2.6 } as const;
/** um passo para dentro de cada portao: e dali que o bicho comeca a andar */
const CHEGADA = -hz + 1.4;

/**
 * ======================= O JARDIM DE FORA, atras dos portoes — e JOGAVEL
 *
 * A primeira versao dele era so paisagem: grama pintada em volta do predio
 * inteiro, para o portao nao parecer um buraco na parede. O Renan quis duas
 * coisas diferentes disso, e as duas mudam o que a area E:
 *
 * 1. **Da para SAIR.** A ideia de jogo e dele: enquanto vem pouco bicho, voce
 *    atravessa o portao e intercepta LA FORA, antes que eles entrem; quando
 *    vier muito, voce recua e segura do lado de dentro. Isso transforma os
 *    tres portoes de "spawn" em DECISAO — ficar na frente ou atras deles.
 * 2. **Nao da a volta.** A grama corria pelos quatro lados, e por ela dava para
 *    contornar a estufa e voltar pela frente. Agora o verde existe SO atras,
 *    na direcao das portas, e ele e um patio FECHADO: sebe nos dois lados e no
 *    fundo. Quem sai por um portao so volta por um portao.
 *
 * A profundidade (14) e o que faz caber briga sem virar uma segunda arena: da
 * para correr e recuar, e nao da para se esconder.
 */
const FORA = { profundidade: 14, recuo: 0.9 };
/** a linha do fundo do patio, onde a sebe fecha */
const FUNDO_DE_FORA = -hz - FORA.profundidade;

/**
 * ONDE FICAM OS OITO CANTEIROS — e eles mudaram de lugar por causa dos portoes.
 *
 * A FILEIRA DO FUNDO SAIU. Ela ficava em `z = -8,8`, que e exatamente onde os
 * portoes abriram: naquele desenho o bicho entrava e comia no primeiro passo,
 * e o jogador nao tinha o que fazer. Pior, os tres canteiros da frente nunca
 * seriam alcancados — virariam decoracao.
 *
 * O DESENHO NOVO E UMA FERRADURA ABERTA PARA OS PORTOES: quatro canteiros na
 * parede da saida e dois em cada lateral, todos na metade `+Z`. Assim TODO
 * bicho que entra precisa atravessar o terreiro inteiro para chegar em
 * qualquer horta — e essa travessia e o jogo.
 *
 * Os das laterais vao girados 90 graus: canteiro nao tem frente, entao girar
 * nao esconde nada, e alinhar os oito no mesmo eixo faria a estufa parecer um
 * estacionamento de canteiro.
 *
 * O `x = ±3,6` da fileira da frente e o que mantem o EIXO DA PORTA DE SAIDA
 * vazio: ela tem 1,9 de vao, e o canteiro comeca em 2,0.
 */
/** a medida de cada canteiro da estufa, em largura x profundidade */
const CANTEIRO = { largura: 3.2, profundidade: 1.6 };

/*
 * O `nome` é como a Josefina chama cada um — é o que aparece nos botões das
 * cartas de "um canteiro à sua escolha". Os repetidos (duas alfaces, dois
 * tomates) levam o lado, como a dupla vê da porta.
 */
const CANTEIROS = [
  { x: -10.2, z: 8.8, tipo: 'samambaia', giro: 0, nome: 'Samambaia' },
  { x: -3.6, z: 8.8, tipo: 'lavanda', giro: 0, nome: 'Lavanda' },
  { x: 3.6, z: 8.8, tipo: 'suculenta', giro: 0, nome: 'Suculentas' },
  { x: 10.2, z: 8.8, tipo: 'alface', giro: 0, nome: 'Alface da frente' },
  { x: -12.4, z: 4.6, tipo: 'tomate', giro: Math.PI / 2, nome: 'Tomate da esquerda' },
  { x: -12.4, z: 0.2, tipo: 'girassol', giro: Math.PI / 2, nome: 'Girassol' },
  // os dois da direita recuaram 0,6 m quando a lojinha da Josefina entrou no
  // canto da frente (pedido do Renan): o vão entre eles continua 1,2
  { x: 12.4, z: 4.0, tipo: 'alface', giro: Math.PI / 2, nome: 'Alface da direita' },
  { x: 12.4, z: -0.4, tipo: 'tomate', giro: Math.PI / 2, nome: 'Tomate da direita' },
] as const;

/**
 * A LOJINHA DA JOSEFINA, encostada na parede direita — no MESMO lugar da
 * segunda bancada, que ficava vazia, e com o balcão virado para o MEIO da
 * estufa (os dois são pedido do Renan). A peça (`lojinhaDaJosefina`) nasce
 * olhando para `+Z`; aqui ela gira para `-X`, e a ponta da lousa cai do lado
 * da porta de entrada.
 *
 * `meiaX`/`meiaZ` são a pegada JÁ GIRADA: a profundidade da banca (1,44) é o
 * `x`, o comprimento com a lousa e os caixotes (3,6) é o `z`. `centroZ` é o
 * meio dessa pegada, um fio para o lado da porta (a lousa sai mais que o saco).
 */
const LOJA = { x: 14.08, z: 7.5, centroZ: 7.57, meiaX: 0.72, meiaZ: 1.8 };
/** onde a dupla fica para comprar: um passo à frente do balcão, do lado de dentro */
const BALCAO = { x: LOJA.x - LOJA.meiaX - 0.85, z: LOJA.z - 0.1 };

export const estufa: SceneDef = {
  id: 'estufa',
  name: 'A estufa da Josefina',
  subtitle: 'onde ela guarda as coisas sérias',
  ambient: {
    // vidro esverdeado por cima: a luz aqui e mais quente e mais fechada que a
    // do clube, e e por isso que entrar na estufa PARECE entrar em algum lugar
    sky: 0xcdead9,
    fog: 0xdaf0e4,
    fogNear: 40,
    fogFar: 130,
    sunColor: 0xfff4dc,
    sunIntensity: 1.5,
    ambientColor: 0xe2f4e6,
    ambientIntensity: 1.2,
    sunDir: [10, 20, 8],
  },
  spawn: { x: PORTA.x, z: hz - 2.4, facing: Math.PI },
  entries: {
    // quem entra pela porta cai um passo para dentro dela, ja de costas para a
    // saida e olhando para o fundo da estufa
    'do-jardim': { x: PORTA.x, z: hz - 2.4, facing: Math.PI },
  },

  build(w) {
    const g = w.game;
    const A = ARI.name;
    const R = RENAN.name;
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };

    // ----------------------------------------------------------------- chao
    // terra batida no geral, saibro no terreiro. As duas cores sao proximas de
    // proposito: o terreiro precisa LER como area limpa sem virar uma mancha
    // clara no meio da estufa.
    // a terra batida leva o GRAO do asfalto (que e so um agregado quase branco,
    // e multiplica a cor): 30 x 22 de marrom chapado lê como papel colorido, e
    // e o mesmo conserto que o gramado do clube ja levou
    /**
     * O CHAO VAI MUITO ALEM DA ESTUFA, e isso e de proposito.
     *
     * Os tres portoes do fundo tem que parecer entradas para ALGUM lugar, e
     * nao buracos numa parede. O pedido do Renan foi exatamente esse: "como se
     * ainda tivesse uma area do lado de fora... nao que precisa ter uma area
     * nova la, mas como se tivesse".
     *
     * A saida e mais barata do que parece: o chao continua por 19 m alem da
     * parede de tras, com grama por cima, tres caminhos saindo dos portoes e
     * algumas arvores ao longe. O jogador nunca chega la (o limite de caminhada
     * o segura dentro do vidro), mas ATRAVES do vidro ele ve um jardim que
     * continua — que e tudo o que a ilusao precisa.
     */
    /**
     * O CHAO SAO DOIS RETANGULOS, e nao um so.
     *
     * A versao anterior pintava um gramado gigante por baixo de tudo, e por
     * isso a grama dava a volta na estufa — dava para contornar o predio e
     * voltar pela frente. Agora cada lugar tem o seu chao e eles se encostam:
     * a estufa e terra batida, o patio de tras e grama, e nao existe verde em
     * lugar nenhum a nao ser atras das portas.
     *
     * O segundo `ground()` entra como decalque (o `WorldBuilder` empilha assim
     * quando ja existe chao), o que e exatamente o que se quer: decalque nunca
     * briga por profundidade com decalque.
     */
    w.ground({ width: W + 1, depth: D + 1, color: P.estufaChao, textura: asfalto(1.6) });
    /**
     * O GRAMADO VAI DA LINHA DA PAREDE DE TRAS ATE 3 M ALEM DA SEBE.
     *
     * As duas bordas sao escolhidas, e nao sobra de conta:
     *
     * - **a de tras** passa 3 m da sebe porque e ALI que os bichos nascem, do
     *   lado de fora, para entrarem pelas brechas andando. Bicho que aparece do
     *   nada dentro do patio nao da tempo de ser interceptado, que e justamente
     *   a jogada que o patio existe para permitir;
     * - **a da frente** para EXATAMENTE em `z = -hz`, a linha da parede. A
     *   primeira versao escrevia essa borda por uma conta de centro e
     *   profundidade e ela caiu em `-10,4`: 60 cm de grama DENTRO da estufa,
     *   uma faixa verde correndo por dentro do vidro que o Renan viu na tela.
     *   Escrever as duas bordas e depois derivar centro e profundidade delas e
     *   o que impede esse erro de voltar.
     *
     * Em `-11` a emenda fica debaixo da propria parede (que tem 18 cm de
     * espessura) e, nas tres brechas, debaixo da soleira de pedra do portao —
     * entao ela nao aparece em lugar nenhum.
     */
    const GRAMA_FRENTE = -hz;
    const GRAMA_FUNDO = FUNDO_DE_FORA - 3;
    w.ground({
      width: W,
      depth: GRAMA_FRENTE - GRAMA_FUNDO,
      z: (GRAMA_FRENTE + GRAMA_FUNDO) / 2,
      color: P.grass, textura: tapeteDeGrama(9), y: 0.004,
    });

    w.patch(
      TERREIRO.x, TERREIRO.z, TERREIRO.largura, TERREIRO.profundidade,
      P.estufaSaibro, 0, 0.012, calcadaDePedrinha(0.4, 5),
    );
    // os caminhos que ligam o terreiro as paredes, para o saibro nao ficar uma
    // ilha no meio da terra
    w.patch(0, 1, 2.2, D - 4, P.estufaSaibro, 0, 0.016, calcadaDePedrinha(0.4, 5));
    w.patch(0, TERREIRO.z, W - 1.5, 2.2, P.estufaSaibro, 0, 0.016, calcadaDePedrinha(0.4, 5));
    // e os tres caminhos que saem de cada portao, atravessando o vidro: eles
    // sao o que amarra o de dentro com o de fora numa coisa so, e agora
    // atravessam o patio inteiro ate a sebe do fundo
    for (const x of PORTOES.xs) {
      const comprimento = FORA.profundidade + 5;
      w.patch(
        x, -hz - FORA.profundidade / 2 - 0.4, 2.2, comprimento,
        P.concrete, 0, 0.018, calcadaDePedrinha(0.4, 5),
      );
    }

    /**
     * O LIMITE DE CAMINHADA ABRACA OS DOIS: a estufa E o patio de tras.
     *
     * Quem segura a dupla dentro da estufa nao e mais o limite — sao as
     * PAREDES. O limite so fecha a caixa por fora, e a unica ligacao entre os
     * dois lados sao os tres portoes: a parede de `-Z` tem colisor em todo
     * lugar menos nos vaos, e as paredes laterais acabam em `z = -11`, entao o
     * patio de tras e um beco sem saida de proposito.
     */
    /**
     * O limite do fundo encosta na LINHA DA SEBE, e nao um metro antes: assim a
     * dupla para no mesmo `z` ao longo do fundo inteiro, tanto onde tem sebe
     * (que ja para por colisor) quanto nas brechas. Linha de parada continua
     * nao lê como parede invisivel; linha quebrada, sim.
     */
    w.setBounds(-hx + FORA.recuo, FUNDO_DE_FORA + 0.55, hx - FORA.recuo, hz - 0.8);

    // -------------------------------------------------------------- as paredes
    /**
     * PAREDE ALTA SO EM `-X` E `-Z` (regra da skill de cenario): dos dois lados
     * que a camera olha de frente, mureta baixa, senao o vidro tapa a estufa
     * inteira. Como e tudo vidro, a diferenca de altura quase nao aparece — o
     * que se ve nos dois lados abertos e a soleira e os montantes.
     */
    /**
     * A PAREDE DO FUNDO VEM PARTIDA EM QUATRO, com os tres vaos dos portoes
     * entre os pedacos. O vao e um palmo maior que o portao (`+0,4`), para a
     * pilastra de pedra encostar no vidro sem o atravessar.
     */
    const VAO = PORTOES.vao + 0.4;
    const bordas = [-hx, ...PORTOES.xs.flatMap((x) => [x - VAO / 2, x + VAO / 2]), hx];
    for (let i = 0; i < bordas.length; i += 2) {
      if (bordas[i + 1] - bordas[i] < 0.05) continue;
      w.wall(bordas[i], -hz, bordas[i + 1], -hz, 3.2, P.estufaVidro, 0.18);
    }
    w.wall(-hx, -hz, -hx, hz, 3.2, P.estufaVidro, 0.18);
    w.wall(hx, -hz, hx, hz, 0.62, P.estufaVidro, 0.18);
    // a parede da frente vem partida em duas, com o vao da porta no meio
    const meiaFrente = (W - PORTA.largura) / 2;
    for (const s of [-1, 1] as const) {
      const xIni = s * (PORTA.largura / 2);
      w.wall(xIni, hz, xIni + s * meiaFrente, hz, 0.62, P.estufaVidro, 0.18);
    }

    // a soleira de alvenaria correndo por baixo de tudo, que e o que tira o
    // vidro de cima do chao — vidro terminando no piso serrilha na beirada
    const alvenaria = (x: number, z: number, larg: number, prof: number): void => {
      const soleira = new THREE.Mesh(
        new THREE.BoxGeometry(larg, 0.22, prof), toon(P.estufaBase),
      );
      soleira.position.set(x, 0.11, z);
      w.add(soleira);
    };
    alvenaria(0, hz, W + 0.4, 0.34);
    alvenaria(-hx, 0, 0.34, D + 0.4);
    alvenaria(hx, 0, 0.34, D + 0.4);
    /**
     * A ALVENARIA DO FUNDO TAMBEM PARA NOS VAOS.
     *
     * Ela tem 22 cm de altura, e um degrau de 22 cm atravessado numa passagem e
     * a coisa que mais trava caminhada num jogo isometrico. Quem atravessa o
     * portao pisa na soleira RASA de pedra da propria peca (7 cm), e nao nisto.
     */
    for (let i = 0; i < bordas.length; i += 2) {
      const larg = bordas[i + 1] - bordas[i];
      if (larg < 0.05) continue;
      alvenaria((bordas[i] + bordas[i + 1]) / 2, -hz, larg + 0.2, 0.34);
    }

    /**
     * ============================================= OS TRES PORTOES DE JARDIM
     *
     * Cada um leva DUAS pilastras de pedra, e sao elas que precisam de colisor
     * — o vao entre as duas fica livre, que e o ponto. O `vao` da peca ja diz
     * onde uma acaba e a outra comeca, entao a cena nao remede nada.
     */
    for (const x of PORTOES.xs) {
      const portao = w.add(w.place(portaoDeJardim(PORTOES.vao, PORTOES.altura), x, 0, -hz));
      const meia = (portao.userData.vao as number) / 2 + 0.18;
      for (const s of [-1, 1] as const) w.blockCircle(x + s * meia, -hz, 0.26);
    }

    /**
     * OS ARCOS. Cinco, de 6 em 6 no eixo X, cada um vencendo a profundidade
     * inteira. Eles sao a unica coisa que diz "isto tem cobertura", e sao
     * finos o bastante (16 cm) para nao tirarem nada da vista de cima.
     */
    for (const x of [-12, -6, 0, 6, 12]) {
      w.add(w.place(arcoDeEstufa(D, 5.4, 2.2), x, 0, 0));
    }

    /**
     * ============================ O PATIO DE TRAS — e ele e um lugar, nao uma
     * paisagem
     *
     * Da para sair para ele pelos tres portoes e voltar por eles. E fechado nos
     * tres outros lados por sebe, entao quem sai nao contorna a estufa: e um
     * beco de proposito. A ideia de jogo e do Renan — interceptar o bicho LA
     * FORA enquanto vem pouco, e recuar para dentro quando vier muito.
     *
     * A SEBE E MAIS ALTA QUE A DO CLUBE (1,6 contra 1,05) porque aqui ela e
     * LIMITE, e nao enfeite: quem bate nela precisa entender que acabou o
     * terreno. E ela vai ate a quina da estufa nos dois lados, sem vao nenhum.
     */
    const ladoDoPatio = FORA.profundidade;
    for (const sx of [-1, 1] as const) {
      w.add(w.place(
        sebe(ladoDoPatio, 1.6), sx * hx, 0, -hz - ladoDoPatio / 2, Math.PI / 2,
      ));
      w.blockBox(sx * hx, -hz - ladoDoPatio / 2, 0.55, ladoDoPatio / 2);
    }
    /**
     * A SEBE DO FUNDO ABRE EM TRES BRECHAS, no fim de cada caminho de pedra.
     *
     * Pedido do Renan, e ele fecha a corrente inteira do minigame: o bicho
     * nasce no gramado de fora, **entra pela brecha**, sobe o caminho de pedra,
     * atravessa o portao e so entao chega na estufa. Cada um desses tres
     * trechos e uma chance de interceptar — e e por isso que "segurar fora"
     * contra "segurar dentro" vira decisao, e nao preferencia.
     *
     * As brechas ficam no EIXO dos portoes e sao mais largas que o caminho
     * (3,2 contra 2,2): passagem tem eixo, e o eixo fica vazio.
     */
    const BRECHA = 3.2;
    const pontaDaSebe = W / 2 + 0.55;
    const cortes = [
      -pontaDaSebe,
      ...PORTOES.xs.flatMap((x) => [x - BRECHA / 2, x + BRECHA / 2]),
      pontaDaSebe,
    ];
    for (let i = 0; i < cortes.length; i += 2) {
      const comprimento = cortes[i + 1] - cortes[i];
      if (comprimento < 0.05) continue;
      const centro = (cortes[i] + cortes[i + 1]) / 2;
      w.add(w.place(sebe(comprimento, 1.6), centro, 0, FUNDO_DE_FORA));
      w.blockBox(centro, FUNDO_DE_FORA, comprimento / 2, 0.55);
    }
    /**
     * E duas moitas altas ladeando cada brecha, encostadas na ponta da sebe.
     *
     * Sao elas que fazem a abertura LER como abertura: sebe cortada em quina
     * viva parece parede quebrada, e moita arredondada na ponta parece mato que
     * abriu. Elas ficam FORA do vao (a 2,1 do eixo, contra os 1,6 da brecha),
     * entao nao estreitam a passagem.
     */
    for (const x of PORTOES.xs) {
      for (const s of [-1, 1] as const) {
        w.add(w.place(bush(1.15), x + s * 2.1, 0, FUNDO_DE_FORA + 0.15, (x + s) % 1));
        w.blockCircle(x + s * 2.1, FUNDO_DE_FORA + 0.15, 0.38);
      }
    }
    // e algumas moitas soltas do lado de FORA da sebe, para a brecha nao dar
    // num gramado vazio: quem olha pela brecha tem que ver o mato continuar
    for (const [x, z, e] of [
      [-12.2, -27.2, 1.0], [-5.4, -26.6, 0.9], [5.6, -27.4, 1.05],
      [12.6, -26.4, 0.95], [-0.2, -28.2, 0.85],
    ] as const) {
      w.add(w.place(bush(e), x, 0, z, (x * z) % 1));
    }

    /**
     * O QUE CRESCE NO PATIO. Ele e chao de briga agora, entao a regra e a mesma
     * do terreiro de dentro: **os tres corredores dos portoes ficam limpos**.
     * Arvore e moita vao para as faixas entre um corredor e outro, e para as
     * quinas — que e onde elas emolduram o vao em vez de tapa-lo.
     */
    /**
     * A FOLGA MEDE A COPA, e nao o tronco.
     *
     * A primeira conta usava 2,2 — a largura do caminho — e o resultado apareceu
     * na foto: arvore plantada a 2,2 do eixo tem copa de 1,2 de raio, entao ela
     * chega a 1,0 do eixo e debruca em cima da calcada. O corredor continuava
     * ANDAVEL (o colisor do tronco tem 40 cm e ficava longe), mas parecia
     * bloqueado, e num jogo isometrico parecer bloqueado e ser bloqueado.
     *
     * 3,2 e a meia-largura do caminho (1,1) mais a copa maior (1,3) mais folga.
     */
    const noCorredor = (x: number): boolean =>
      PORTOES.xs.some((px) => Math.abs(x - px) < 3.2);
    for (const [x, z, tipo, e] of [
      [-12.6, -16.5, 'redonda', 1.1], [-4.4, -20.5, 'pinheiro', 0.95],
      [4.4, -17.2, 'redonda', 1.15], [12.4, -21, 'pinheiro', 1.0],
      [-4.6, -14.2, 'redonda', 0.85], [4.8, -23, 'redonda', 1.05],
    ] as const) {
      if (noCorredor(x)) continue;
      w.add(w.place(tree(tipo, e, ((x + z) / 13) % 1), x, 0, z));
      w.blockCircle(x, z, 0.4);
    }
    for (const [x, z, e] of [
      [-13.4, -12.9, 1.0], [-4.9, -12.6, 0.85], [4.5, -12.8, 0.95],
      [13.2, -13.4, 1.1], [-12.8, -22.6, 0.9], [12.6, -17.6, 1.0],
      [-4.3, -24.1, 0.8], [13.6, -24.2, 0.95], [-13.2, -18.8, 0.85],
    ] as const) {
      if (noCorredor(x)) continue;
      w.add(w.place(bush(e), x, 0, z, (x * z) % 1));
      w.blockCircle(x, z, 0.3 * e);
    }
    // capim solto nas faixas livres: e o que impede o gramado de virar carpete
    for (let i = 0; i < 22; i++) {
      const x = -13.6 + ((i * 7.3) % 27);
      const z = -hz - 1.6 - ((i * 4.7) % (FORA.profundidade - 3));
      if (noCorredor(x)) continue;
      w.add(w.place(capim(1.1 + ((i * 0.31) % 1) * 0.5), x, 0, z));
    }

    // ---------------------------------------------------------------- a porta
    const batentes = new THREE.Group();
    for (const s of [-1, 1] as const) {
      const poste = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, PORTA.altura, 0.16), toon(P.estufaEstrutura),
      );
      poste.position.set(s * (PORTA.largura / 2 + 0.07), PORTA.altura / 2, PORTA.z);
      batentes.add(poste);
    }
    const verga = new THREE.Mesh(
      new THREE.BoxGeometry(PORTA.largura + 0.34, 0.16, 0.2), toon(P.estufaEstrutura),
    );
    verga.position.set(PORTA.x, PORTA.altura + 0.08, PORTA.z);
    batentes.add(verga);
    w.add(batentes);

    // a folha, centrada NA LINHA da parede (a regra do batente: folha deslocada
    // deixa a face dela no mesmo plano da face da parede, e as duas piscam)
    const folha = w.add(w.place(
      interiorDoor(P.estufaEstrutura, PORTA.largura - 0.16, PORTA.altura - 0.14, 0.2),
      PORTA.x, 0, PORTA.z,
    ));

    /*
     * A PORTA ABRE quando alguém de fora entra numa cutscene (os chamados):
     * sem isso o Capy atravessava a folha fechada. Ela gira para dentro e
     * volta sozinha — `portaAberta` é o alvo, e a folha anda até ele.
     */
    const dobradicaDaPorta = folha.getObjectByName('dobradica');
    let portaAberta = false;
    w.onUpdate((dt) => {
      if (!dobradicaDaPorta) return;
      const alvo = portaAberta ? 1.35 : 0;
      dobradicaDaPorta.rotation.y += (alvo - dobradicaDaPorta.rotation.y) * Math.min(1, dt * 5);
    });

    w.door({
      x: PORTA.x, z: hz - 1.6,
      to: 'clube', entry: 'da-estufa',
      label: 'Voltar pro jardim', icon: '🚪',
      highlight: folha,
    });

    // ------------------------------------------------------------ os canteiros
    /**
     * As oito hortas ficam GUARDADAS, e nao so plantadas.
     *
     * A rega (§2 deste arquivo, mais abaixo) precisa de cada peca para
     * escurecer a terra e esticar as mudas, e o minigame vai precisar delas
     * para murchar planta por planta. Guardar a peca aqui e o que evita, de
     * novo, um segundo lugar onde a mesma coordenada esta escrita.
     */
    const hortas = CANTEIROS.map(({ x, z, tipo, giro, nome }) => {
      // CRESCIMENTO 1,45: a mesma peca da horta de fora, com as mudas maiores.
      // E o que faz os dois lugares nao parecerem o mesmo canteiro copiado — e
      // e a fala da propria Josefina depois da quest ("adubo bom trabalha
      // rapido") virando geometria.
      const peca = w.add(w.place(
        canteiroDeHorta(tipo, CANTEIRO.largura, CANTEIRO.profundidade, ((x + z) / 7) % 1, 1.45),
        x, 0, z, giro,
      ));
      // o colisor acompanha o giro: nos dois deitados a caixa troca de eixo
      if (giro === 0) w.blockBox(x, z, CANTEIRO.largura / 2, CANTEIRO.profundidade / 2);
      else w.blockBox(x, z, CANTEIRO.profundidade / 2, CANTEIRO.largura / 2);
      return { x, z, giro, tipo, nome, peca };
    });

    /**
     * ================= ONDE PODE ENTRAR ENFEITE, no lado da porta
     *
     * Duas proibicoes, e a primeira ja custou conserto depois de o Renan ver na
     * tela: moita brotando do meio da alface.
     *
     * 1. **NAO EM CIMA DE CANTEIRO.** As moitas tinham `x` escrito a mao, e
     *    esses numeros foram escolhidos quando os canteiros da frente ficavam em
     *    `x = -6,6 / 0 / 6,6`. Quando eles viraram a ferradura dos portoes
     *    (`-10,2 / -3,6 / 3,6 / 10,2`) as moitas ficaram para tras, e as
     *    posicoes novas dos canteiros cairam exatamente em cima delas. A regra
     *    agora DERIVA de `CANTEIROS`: mudar um canteiro de lugar move a
     *    proibicao junto, e o enfeite se recusa a nascer ali sozinho.
     * 2. **NAO NO EIXO DA PORTA.** Passagem tem eixo, e o eixo fica vazio.
     */
    const emCimaDeCanteiro = (x: number, z: number, folga: number): boolean =>
      CANTEIROS.some(({ x: cx, z: cz, giro }) => {
        const meiaX = (giro === 0 ? CANTEIRO.largura : CANTEIRO.profundidade) / 2;
        const meiaZ = (giro === 0 ? CANTEIRO.profundidade : CANTEIRO.largura) / 2;
        return Math.abs(x - cx) < meiaX + folga && Math.abs(z - cz) < meiaZ + folga;
      });
    /**
     * `raio` E A METADE DA PECA DESENHADA, e nao a do colisor.
     *
     * Este e o mesmo erro que as copas das arvores ja pagaram, cometido de
     * novo aqui: a primeira versao usava folga fixa de 0,3 — o tamanho do
     * COLISOR da moita — enquanto a moita desenhada tem 1,3 de largura. As
     * duas das pontas continuaram debrucadas nos canteiros laterais, e o
     * teste, que tambem media colisor, nao viu.
     *
     * Quem chama passa o raio da peca que vai plantar: `bush(e)` tem
     * `0,78 · e`, muda e capim tem uns 0,2. A regra deixou de adivinhar.
     */
    /** em cima da lojinha, ou na frente do balcão, onde a dupla para para comprar */
    const naLoja = (x: number, z: number, folga: number): boolean =>
      x > BALCAO.x - 0.9 - folga && x < LOJA.x + LOJA.meiaX + folga
      && Math.abs(z - LOJA.centroZ) < LOJA.meiaZ + folga;
    const podePlantar = (x: number, z: number, raio: number): boolean =>
      !emCimaDeCanteiro(x, z, raio + 0.1) && Math.abs(x - PORTA.x) > 1.6 + raio && !naLoja(x, z, raio);
    /**
     * o que foi plantado no lado da porta, guardado para a Josefina saber
     * contornar: ela passeia AQUI, e jardineira que pisa na muda nao e
     * jardineira
     */
    const moitasDaFrente: Array<{ x: number; z: number; r: number }> = [];

    // ------------------------------------------- a oficina, na parede esquerda
    /**
     * A OFICINA E O TONEL TROCARAM DE LADO DA ESTUFA.
     *
     * Com os portoes no fundo, a parede esquerda deixou de ser uma parede so e
     * virou DUAS METADES com valor diferente:
     *
     * - **a BANCADA foi para a metade `+Z`**, perto da porta de saida. E de la
     *   que a Josefina vai entregar os regadores e assistir a rodada, e o posto
     *   dela nao pode ser o lado por onde entra bicho;
     * - **o TONEL foi para a metade `-Z`**, a quatro metros do portao do meio.
     *   Isso e o oposto de conveniencia, e e de proposito: o §4 do plano diz
     *   que a agua acaba e que a viagem ate o tonel e o que deixa os canteiros
     *   sozinhos. Se reabastecer fosse seguro nao custaria nada; agora custa
     *   andar NA DIRECAO das portas.
     */
    const bancada = w.add(w.place(bancadaDeJardinagem(2.8), -hx + 1.1, 0, 6.4, Math.PI / 2));
    w.blockBox(-hx + 1.1, 6.4, 0.45, 1.4);
    // o regador do plano (§4) largado ao lado dela: ele ja esta no cenario
    // muito antes de virar arma, e e ele que o jogador vem pegar
    const regadorDaBancada = w.add(w.place(regador(), -hx + 1.5, 0, 8.2, 1.1));

    const tonel = w.add(w.place(tonelDeAgua(1.25), -hx + 1.2, 0, -7.4));
    w.blockCircle(-hx + 1.2, -7.4, 0.55);
    const tonelMenor = w.add(w.place(tonelDeAgua(0.95), -hx + 1.1, 0, -5.9));
    w.blockCircle(-hx + 1.1, -5.9, 0.42);

    // ---------------------------- a lojinha, encostada na parede direita
    // Era a segunda bancada, vazia. Virou a banca da Josefina: roupa de jardim
    // e enfeite para a estufa (o painel e o modo de decorar moram mais abaixo)
    const lojinha = w.add(w.place(lojinhaDaJosefina(), LOJA.x, 0, LOJA.z, -Math.PI / 2));
    w.blockBox(LOJA.x, LOJA.centroZ, LOJA.meiaX, LOJA.meiaZ);

    // ------------------------------------ as mudas em vaso, na parede direita
    // Elas sobem parte das plantas do chao: um galpao com tudo na mesma altura
    // fica achatado na camera isometrica, e os vasos sao o que da relevo.
    for (const [z, tipo, alto] of [
      [-3.8, 'samambaia', 0.4],
      [-2.6, 'girassol', 0.32],
      [2.9, 'suculenta', 0.3],
      [-1.4, 'lavanda', 0.36],
    ] as const) {
      w.add(w.place(vasoDePlanta(tipo, alto, ((z + 9) / 11) % 1), hx - 1.2, 0, z));
      w.blockCircle(hx - 1.2, z, 0.26);
    }

    /* ====================================================================
     * O VERDE DA ESTUFA — denso do lado da porta, alto so nas paredes de longe
     *
     * DUAS REGRAS DECIDEM ONDE CADA COISA PODE MORAR, e nenhuma das duas e
     * estetica:
     *
     * 1. **A CAMERA OLHA DE `+X/+Z`.** O lado da porta (`+Z`) e o lado de
     *    PERTO: qualquer coisa com mais de um metro plantada ali tapa o que
     *    esta atras, inclusive a dupla andando. Entao o lado da porta leva
     *    DENSIDADE, e nao ALTURA — canteiro crescido, moita, capim, tudo
     *    abaixo do peito. Folhagem alta e treliça so nas paredes de longe
     *    (`-X` e `-Z`), onde nao ha nada atras para esconder.
     * 2. **A PAREDE DO FUNDO (`-Z`) FICA POBRE DE PROPOSITO.** Ela e a
     *    candidata as tres portas por onde os bichos vao entrar (o plano esta
     *    em `docs/MINIGAME-JARDIM.md`). Plantar coisa cara ali seria plantar
     *    para arrancar depois.
     *
     * E o terreiro do meio continua VAZIO. Nada aqui encosta nele.
     */

    // ---------------------------------------------- o lado da porta, denso
    /**
     * A FAIXA DA FRENTE, colada na mureta. O jogador nao alcanca `z > 10,4`
     * (a parede e o raio do corpo), entao esta fileira nunca fica entre a
     * camera e alguem — e por isso ela pode ser cheia.
     */
    for (let i = 0; i < 17; i++) {
      const x = -13.2 + i * 1.65;
      if (!podePlantar(x, hz - 0.85, 0.35)) continue;
      const s = (i * 0.37) % 1;
      w.add(w.place(
        i % 3 === 0 ? capim(1.5 + s * 0.5) : planta(i % 3 === 1 ? 'lavanda' : 'suculenta', 1.7 + s * 0.5, s),
        x, 0, hz - 0.85,
      ));
    }
    /**
     * AS MOITAS NASCEM NOS VAOS ENTRE OS CANTEIROS, e nao em cima deles.
     *
     * Os dois `x = ±6,9` sao o MEIO do vao entre um canteiro e o seguinte
     * (`-10,2 / -3,6 / 3,6 / 10,2`, cada um com 3,2 de largura): e ali que a
     * moita fecha o buraco e faz a fileira parecer plantada em vez de arrumada.
     * O vao do meio (`x = 0`) fica vazio — e o eixo da porta.
     *
     * Todas passam pelo `podePlantar` mesmo assim: numero escrito a mao
     * envelhece quando o canteiro muda de lugar, e foi exatamente isso que
     * aconteceu da ultima vez.
     */
    for (const [x, z, e] of [
      [-6.9, 8.8, 0.95], [6.9, 8.8, 0.9],
      [-11.4, 6.5, 0.8], [-7.6, 6.4, 0.7], [-4.2, 6.6, 0.75],
      [4.2, 6.4, 0.7], [7.6, 6.6, 0.8], [11.4, 6.5, 0.75],
    ] as const) {
      // `bush(e)` sao tres esferas de raio `0,42·e` espacadas de `0,36·e`:
      // a peca inteira tem `0,78·e` de meia-largura
      if (!podePlantar(x, z, 0.78 * e)) continue;
      w.add(w.place(bush(e), x, 0, z, (x + z) % 1));
      w.blockCircle(x, z, 0.3 * e);
      moitasDaFrente.push({ x, z, r: 0.78 * e + 0.2 });
    }
    // e mais uma fileira de mudas crescidas fechando a frente dos canteiros
    for (let i = 0; i < 12; i++) {
      const x = -11.6 + i * 2.1;
      if (!podePlantar(x, 7.5, 0.3)) continue;
      w.add(w.place(planta(i % 2 ? 'alface' : 'girassol', 1.5, (i * 0.23) % 1), x, 0, 7.5));
      moitasDaFrente.push({ x, z: 7.5, r: 0.5 });
    }

    // -------------------------------- a parede esquerda: a altura pode ir aqui
    // `-X` e a parede mais longe da camera: folhagem de 1,9 e treliça de 2,6
    // nao escondem nada, porque nao ha nada atras delas. Os `z` ficam todos na
    // metade `+Z` — a metade do fundo agora e caminho de bicho, e o que decora
    // ela e estrutura (os portoes), nao planta.
    for (const [z, alta] of [[1.4, 1.9], [3.0, 1.55], [9.4, 1.75]] as const) {
      w.add(w.place(folhagemAlta(alta, ((z + 9) / 7) % 1), -hx + 1.3, 0, z));
      w.blockCircle(-hx + 1.3, z, 0.45);
    }
    for (const [z, larg] of [[4.6, 2.2], [-2.0, 2.6]] as const) {
      w.add(w.place(trelicaComTrepadeira(larg, 2.6, (z + 3) % 1), -hx + 0.3, 0, z, Math.PI / 2));
    }

    // ------------------------------- a parede direita: prateleiras e folhagem
    // `+X` tambem e lado de perto, entao aqui a prateleira (1,05 de altura) e o
    // teto: ela guarda verde na VERTICAL sem ocupar chao nem tapar ninguem.
    // mesma conta das bocas aqui: a prateleira e comprida (1,2 a 1,4 de meia
    // profundidade deitada), entao ela precisa nascer mais longe do canto que
    // qualquer outra peca da parede
    for (const [z, comp] of [[-4.6, 2.8], [1.2, 2.4]] as const) {
      w.add(w.place(prateleiraDeMudas(comp, (z + 9) % 1), hx - 1.1, 0, z, -Math.PI / 2));
      w.blockBox(hx - 1.1, z, 0.3, comp / 2);
    }

    /**
     * ------------------------------- A FAIXA DE CHEGADA FICA VAZIA, DE VERDADE
     *
     * Nada plantado em `z < -5`. A fileira de lavanda que morava colada na
     * parede do fundo saiu inteira quando os portoes entraram — pedido do
     * Renan, e ele esta certo pelas duas pontas: nao faz sentido a Josefina
     * plantar bem em cima de onde os bichos passam, e nao faz sentido o jogo
     * encher de enfeite justamente a faixa que precisa estar legivel quando os
     * tres portoes cospem bicho ao mesmo tempo.
     *
     * O que decora essa faixa e ESTRUTURA: os tres portoes de pedra, os
     * caminhos que saem deles e o jardim que continua do lado de fora.
     */

    /* =========================================================== as conversas
     *
     * CADA PROMPT NASCE DA PECA, e nao de um par de numeros escrito a mao.
     *
     * Os tres interativos daqui ficaram para tras quando o layout mudou por
     * causa dos portoes: a bancada foi para `z = 6,4` e o tonel para `-7,4`,
     * mas os pontos continuaram em `-4,6` e `4,4`. Na pratica eles TROCARAM de
     * lugar — o Renan encostou nos tonéis e leu "Olhar a bancada".
     *
     * Ler a posicao do objeto (`bancada.position`) e o que impede isso: mover a
     * peca move o prompt junto, e nao existe mais um segundo lugar onde a
     * mesma coordenada esta escrita.
     */
    /** um passo a frente da peca, do lado de dentro da estufa */
    const naFrenteDe = (peca: THREE.Object3D, afasta = 1.0) => ({
      x: peca.position.x + Math.sign(peca.position.x || 1) * -afasta,
      z: peca.position.z,
    });

    /**
     * O LIVRO DAS CARTAS, na ponta da bancada (pedido do Renan). É a coleção
     * que atravessa as rodadas: toda carta do baralho tem um lugar nele, na
     * ordem da raridade, e aparece só depois de ter sido escolhida uma vez. A
     * rodada suspende todo ponto da cena, então ele se lê entre uma rodada e
     * outra — que é quando dá vontade de ler.
     *
     * RAIO PEQUENO, e sem prioridade: a bancada inteira também é um ponto
     * ("Olhar a bancada"), o regador do chão é outro, e a Josefina passeia ali
     * perto. Com prioridade o livro roubava os três; assim ganha quem está
     * mais perto, e o livro só é o prompt de quem está na frente dele.
     */
    // na ponta de CIMA: a de baixo encosta no canteiro de tomate, e entre os
    // dois não passa ninguém — o livro ficava à vista e fora do alcance
    const LIVRO = { x: -hx + 1.08, z: 7.35 };
    const livro = w.add(w.place(livroDeCartas(), LIVRO.x, 0.96, LIVRO.z, 0.18));
    w.interact({
      id: 'estufa:livro-das-cartas',
      x: LIVRO.x + 1.0, z: LIVRO.z, radius: 0.8,
      label: 'Abrir o livro da estufa', icon: '📖',
      highlight: livro,
      onInteract: async (api) => {
        /*
         * O LIVRO TEM TRÊS ABAS: as cartas, as pragas já vistas e as
         * recompensas dos marcos. O botão RESGATAR fecha o livro devolvendo a
         * onda do marco — e a entrega é aqui, com a Josefina (pedido do
         * Renan: "clicamos lá para desbloquear cada uma").
         */
        const resgate = await api.abrirLivroDeCartas(CARTAS.map(cartaNaTela), conteudoDoLivro());
        const m = MARCOS.find((k) => String(k.onda) === resgate);
        if (m && g.flag(m.flag) && !g.flag(m.resgate)) {
          g.setFlag(m.resgate);
          g.lockPlayer(true);
          await entregarMarco(m);
          g.lockPlayer(false);
        }
      },
    });

    /*
     * OS ENFEITES DOS MARCOS (`minigames/jardim/premios.ts`): o que a dupla
     * ganhou uma vez fica na estufa para sempre. Cada um nasce pela flag do
     * marco — na montagem da cena, e de novo na hora em que é ganho.
     *
     * - a PLAQUINHA (onda 5) na parede do lado da bancada, que é a parede que
     *   a câmera vê de frente, acima das mudas;
     * - o REGADOR DE OURO (onda 30) na outra ponta da bancada, longe do livro.
     */
    const PLAQUINHA = { x: -hx + 0.14, y: 1.85, z: 9.35 };
    const TROFEU = { x: -hx + 1.08, z: 5.35 };
    const enfeites: { plaquinha?: THREE.Object3D; trofeu?: THREE.Object3D } = {};
    const montarEnfeites = (): void => {
      if (!enfeites.plaquinha && g.flag('jardim.resgate-5')) {
        enfeites.plaquinha = w.add(w.place(
          plaquinhaDaEstufa(['Jardineiros', 'da Josefina']), PLAQUINHA.x, PLAQUINHA.y, PLAQUINHA.z, Math.PI / 2,
        ));
      }
      if (!enfeites.trofeu && g.flag('jardim.resgate-30')) {
        enfeites.trofeu = w.add(w.place(regadorDeOuro(), TROFEU.x, 0.96, TROFEU.z, 0.5));
      }
    };
    montarEnfeites();
    w.root.userData.enfeites = enfeites;

    /** o que as abas de pragas e de recompensas mostram, pelas flags do save */
    const conteudoDoLivro = (): ConteudoDoLivro => ({
      pragas: pragasDoLivro().map((p) => ({
        id: p.id,
        nome: p.nome,
        tier: NOME_DO_TIER[p.tier],
        mistura: p.mistura,
        descricao: DESCRICAO_DA_PRAGA[p.id] ?? '',
        vista: g.flag(flagDaPraga(p.id)),
      })),
      recompensas: MARCOS.map((m) => ({
        onda: m.onda,
        nome: m.nome,
        icone: m.icone,
        descricao: m.descricao,
        moedas: m.moedas,
        estado: g.flag(m.resgate) ? 'resgatada' : g.flag(m.flag) ? 'pronta' : 'trancada',
      })),
      recorde: g.stat(RECORDE),
      moedasPorOnda: MOEDAS_POR_ONDA,
    });
    w.root.userData.conteudoDoLivro = conteudoDoLivro;

    let jaOlhou = false;
    w.interact({
      id: 'estufa:bancada',
      ...naFrenteDe(bancada), radius: 1.8,
      label: 'Olhar a bancada', icon: '🪴',
      highlight: bancada,
      onInteract: async (api) => {
        if (!jaOlhou) {
          jaOlhou = true;
          await conversa([
            [A, 'Olha o tamanho disso aqui. A horta lá fora era o quintal — ISTO é o trabalho dela.'],
            [R, 'Tem vaso vazio esperando muda, terra ensacada, tudo etiquetado. Ela pensou em cada coisa.'],
            [A, 'E tá tudo limpo. Nada de bagunça de oficina.'],
            [R, 'Quem cuida de planta aprende a esperar. Quem espera arruma as coisas enquanto isso.'],
          ]);
          api.unlock({
            id: 'estufa-da-josefina',
            title: 'A estufa da Josefina',
            place: 'Clube',
            note: 'Atrás da horta tinha uma porta de vidro, e atrás dela um jardim inteiro. Ela nunca contou — só deixou a porta destrancada.',
            icon: '🪴',
          });
          return;
        }
        await conversa([
          [R, 'Os vasinhos estão em ordem de tamanho. Ela ia gostar de saber que a gente reparou.'],
          [A, 'Eu ia gostar de saber onde ela arruma paciência pra isso.'],
        ]);
      },
    });

    w.interact({
      id: 'estufa:tonel',
      ...naFrenteDe(tonel, 1.1), radius: 1.8,
      label: 'Espiar o tonel', icon: '💧',
      highlight: tonel,
      onInteract: async () => {
        await conversa([
          [A, 'Água da chuva. Tem até folha boiando.'],
          [R, 'É de propósito, sabia? Planta não gosta muito de água de torneira.'],
          [A, 'Como é que você sabe disso?'],
          [R, 'Eu ouvi a Josefina falando. Eu ouço as coisas.'],
        ]);
      },
    });

    w.interact({
      id: 'estufa:terreiro',
      x: TERREIRO.x, z: TERREIRO.z, radius: 2.2,
      label: 'Olhar o terreiro', icon: '👀',
      onInteract: async () => {
        await conversa([
          [R, 'Repara que o meio tá vazio. Tudo plantado na beirada, e o centro limpo.'],
          [A, 'Sobrou espaço ou foi de propósito?'],
          [R, 'Com ela? Foi de propósito. Só não sei ainda pra quê.'],
        ]);
      },
    });

    /* ====================================================================
     *        O REGADOR, A REGA, E COMO O MINIGAME COMECA
     * ====================================================================
     *
     * O pedido do Renan, e ele decide a forma de tudo aqui: **a estufa
     * continua sendo um lugar onde se anda normalmente**, e o minigame nao
     * comeca por um botao "jogar". Comeca porque o jogador foi ate a bancada,
     * PEGOU O REGADOR e saiu regando as plantas — e, na terceira, a Josefina
     * entra pela porta para contar das pragas.
     *
     * Isso e melhor que um botao por uma razao concreta: quando a rodada
     * comecar, o jogador ja vai estar com o regador na mao, ja vai ter andado
     * de canteiro em canteiro e ja vai ter visto que a lata aponta para onde
     * ele olha. O tutorial inteiro acontece sem ninguem chamar de tutorial.
     *
     * Nada disso e obrigatorio: da para entrar na estufa, olhar tudo e sair
     * sem nunca encostar no regador.
     */
    const REGAS_PARA_CHAMAR = 3;

    /** um passo para dentro do terreiro, a partir do canteiro */
    const pontoDeRega = (h: { x: number; z: number; giro: number }) =>
      h.giro === 0
        ? { x: h.x, z: h.z - CANTEIRO.profundidade / 2 - 1.1 }
        : { x: h.x - Math.sign(h.x) * (CANTEIRO.profundidade / 2 + 1.1), z: h.z };

    /**
     * OS RESPINGOS DA REGA.
     *
     * Eles caem em ARCO a partir da altura da mao (1,25, que e onde o crivo
     * fica com o braco levantado) ate a terra do canteiro. Gota nascendo no
     * chao nao lê como rega — lê como poça —, e a altura e a unica coisa que
     * separa as duas leituras.
     */
    interface Gota { mesh: THREE.Mesh; vy: number; vx: number; vz: number; vida: number; }
    const gotas: Gota[] = [];
    const molhar = (deX: number, deZ: number, paraX: number, paraZ: number): void => {
      g.som('agua');
      const voo = 0.55;
      for (let i = 0; i < 14; i++) {
        const t = i / 13;
        const gota = new THREE.Mesh(
          new THREE.SphereGeometry(0.035 + w.rng() * 0.025, 5, 4),
          toon(P.regadorAgua),
        );
        // saem espalhadas em leque, como agua saindo de um crivo
        const espalha = (w.rng() - 0.5) * 0.6;
        gota.position.set(deX + espalha * 0.4, 1.25, deZ + espalha * 0.4);
        w.root.add(gota);
        gotas.push({
          mesh: gota,
          vx: (paraX - deX) / voo + espalha,
          vz: (paraZ - deZ) / voo + espalha,
          vy: 0.6 - t * 0.3,
          vida: voo + w.rng() * 0.25,
        });
      }
    };

    w.onUpdate((dt) => {
      for (let i = gotas.length - 1; i >= 0; i--) {
        const gt = gotas[i];
        gt.vy -= 7 * dt;
        gt.mesh.position.x += gt.vx * dt;
        gt.mesh.position.z += gt.vz * dt;
        gt.mesh.position.y += gt.vy * dt;
        gt.vida -= dt;
        if (gt.vida <= 0 || gt.mesh.position.y < 0.12) {
          w.root.remove(gt.mesh);
          gt.mesh.geometry.dispose();
          gotas.splice(i, 1);
        }
      }
    });

    // ------------------------------------------------- pegar e largar a lata
    const comORegador = (): boolean => g.getActiveHandItem()?.id === 'regador';

    const pegarORegador = w.interact({
      id: 'estufa:pegar-regador',
      x: regadorDaBancada.position.x + 1.1, z: regadorDaBancada.position.z,
      radius: 1.6,
      label: 'Pegar o regador', icon: '🪣',
      highlight: regadorDaBancada,
      priority: 1,
      onInteract: async (api) => {
        if (api.addItem(ITENS.regador) === 'cheio') {
          api.toast('A mochila está cheia', '🎒');
          return;
        }
        // a peca do chao some: ela E a que foi para a mao
        regadorDaBancada.visible = false;
        pegarORegador.enabled = false;
        api.toast('Regador', '🪣');
        if (!api.flag('estufa.regou-uma')) {
          await conversa([
            [A, 'A Josefina não vai se importar da gente usar?'],
            [R, 'Ela deixou a porta destrancada. Acho que é mais ou menos um convite.'],
            [A, 'Então tá. Vamos molhar tudo.'],
          ]);
        }
      },
    });

    // ----------------------------------------------------- regar os canteiros
    let regados = 0;
    let chamando = false;
    for (const h of hortas) {
      let jaRegado = false;
      const ponto = pontoDeRega(h);
      const it = w.interact({
        id: `estufa:regar-${h.tipo}-${Math.round(h.x)}-${Math.round(h.z)}`,
        ...ponto, radius: 1.7,
        label: 'Regar', icon: '💧',
        highlight: h.peca,
        onInteract: async (api) => {
          if (!comORegador()) {
            await conversa([
              [A, 'Com a mão? Não vai dar.'],
              [R, 'Tem um regador na bancada da Josefina.'],
            ]);
            return;
          }
          if (jaRegado) {
            await api.say(['Esse já está encharcado.'], A);
            return;
          }
          jaRegado = true;
          it.enabled = false;

          const de = api.playerPosition();
          molhar(de.x, de.z, h.x, h.z);

          /**
           * A TERRA ESCURECE E AS MUDAS ESTICAM.
           *
           * Sem um dos dois a rega vira animacao de partícula sem
           * consequencia. A terra e o que prova que a agua CAIU ali, e continua
           * valendo depois de os respingos sumirem; a esticada e o obrigado da
           * planta. As duas saem de `userData` do canteiro, que e o que
           * dispensa adivinhar qual filho e qual.
           */
          const terra = h.peca.userData.terra as THREE.Mesh | undefined;
          if (terra) terra.material = toon(P.terraUmida);
          const mudas = (h.peca.userData.mudas ?? []) as THREE.Object3D[];
          for (const muda of mudas) muda.scale.setScalar(1.09);

          regados += 1;
          api.bump('estufa.regadas');
          api.setFlag('estufa.regou-uma');

          if (regados < REGAS_PARA_CHAMAR) {
            if (regados === 1) {
              await conversa([
                [R, 'Olha ela bebendo. Dá pra ver a terra mudando de cor.'],
                [A, 'Mais umas duas e eu já me considero jardineiro.'],
              ]);
            }
            return;
          }
          // o convite acontece UMA vez na vida: quem ja ouviu das pragas e
          // continua regando so esta regando
          if (chamando || api.flag('jardim.convite')) return;
          chamando = true;
          await aJosefinaChega(api);
        },
      });
    }

    /**
     * ======================= A CUTSCENE QUE ABRE O MINIGAME
     *
     * A Josefina entra PELA PORTA, atravessa o terreiro e para na frente dos
     * dois. Ela nao aparece do nada no meio da estufa: ela e a dona do lugar, e
     * dona de casa entra pela porta.
     *
     * Ela e a MESMA classe da tartaruga do jardim de fora
     * (`entities/bichos/Josefina.ts`), em servico — `entrarEmServico()` tira o
     * passeio aleatorio das maos dela e `irPara()` a leva aonde a cena mandar.
     */
    /**
     * A AREA DELA E A METADE DA PORTA, perto das plantas — e nao a estufa
     * inteira.
     *
     * Pedido do Renan: ela passeia "ali perto das plantas dela". E ha uma
     * razao de jogo junto: a metade `-Z` e o caminho dos bichos, e o posto
     * dela na rodada e atras, na linha da porta. Uma tartaruga passeando no
     * meio do terreiro seria, na rodada, uma tartaruga no meio do enxame.
     *
     * Os canteiros entram como TRES circulos cada, ao longo do comprimento:
     * um so, no centro, deixava as pontas de 3,2 m de fora, e ela atravessava
     * a ponta da alface.
     */
    const canteiroEmCirculos = CANTEIROS.flatMap(({ x, z, giro }) => {
      const [ex, ez] = giro === 0 ? [1, 0] : [0, 1];
      return [-1.1, 0, 1.1].map((d) => ({ x: x + ex * d, z: z + ez * d, r: 1.05 }));
    });
    // e a lojinha, em quatro círculos ao longo da banca, como um canteiro deitado
    canteiroEmCirculos.push(...[-1.3, -0.45, 0.45, 1.3].map((d) => ({ x: LOJA.x, z: LOJA.centroZ + d, r: 0.95 })));
    /*
     * ONDE QUEM PASSEIA NÃO PISA: canteiro, muda da frente, a lojinha — e os
     * ENFEITES que a dupla puser. A lista é UMA SÓ e compartilhada (a Josefina
     * e os ajudantes do clube leem a mesma), e o decorador a atualiza quando
     * um enfeite entra ou sai do chão.
     */
    const obstaculosDoPasseio: Array<{ x: number; z: number; r: number }> = [...canteiroEmCirculos, ...moitasDaFrente];
    const fixos = obstaculosDoPasseio.length;
    const josefina = new Josefina({
      minX: -hx + 2.6, maxX: hx - 2.6,
      minZ: 1.0, maxZ: hz - 1.6,
      // os canteiros e as mudas da frente sao o unico lugar onde ela NAO pisa:
      // e a mesma regra do jardim de fora, e e o que faz a jardineira parecer
      // jardineira
      proibido: obstaculosDoPasseio,
    });
    josefina.aoSoar = () => g.som('cantarolar');
    josefina.group.visible = false;
    /**
     * ELA NASCE NA SOLEIRA, e isso e `sentarEm` e nao `irPara`.
     *
     * A primeira versao mandava `irPara(porta, velocidade 0)` para prende-la
     * ali. O efeito foi outro: com velocidade zero ela nunca CHEGA, a missao
     * fica pendurada, e quando a cutscene a chamava ela partia do ponto onde o
     * construtor a largou — o meio da estufa, a vinte metros da porta, a 0,55
     * por segundo. A cutscene ficava mais de meio minuto travada com a dupla
     * imobil esperando uma tartaruga atravessar o cenario.
     *
     * `sentarEm` ESCREVE a posicao, que e o que se queria: ela ja esta do lado
     * de fora quando a cena sobe, e o `levantar()` da cutscene e o que a poe
     * para andar.
     */
    josefina.sentarEm(PORTA.x, PORTA.z + 1.4, Math.PI);
    w.add(josefina.group);
    w.onUpdate((dt) => josefina.update(dt));

    const aJosefinaChega = async (api: typeof g): Promise<void> => {
      const J = 'Josefina';
      api.lockPlayer(true);
      josefina.group.visible = true;
      josefina.entrarEmServico();
      josefina.levantar();
      api.focusCamera(josefina.group);
      api.setZoom(9);
      /**
       * ELA ENTRA DOIS PASSOS, E CHAMA DALI. Nao atravessa a estufa.
       *
       * A versao anterior mandava ela ate o canteiro onde a dupla estava, e a
       * conta condena: a Josefina e o bicho mais lento do jogo (0,3 de
       * velocidade, personalidade dela), e de um canteiro da lateral ate a
       * porta sao uns doze metros. Mesmo apressada para a cutscene, isso e
       * meio minuto de tartaruga andando com o jogador travado — e ninguem
       * dobra a velocidade de um personagem so para caber numa cena.
       *
       * Duas passadas e o suficiente para ela ESTAR na estufa, que e o que a
       * entrada precisa dizer. Quem se aproxima na conversa e a camera.
       */
      await josefina.irPara(PORTA.x, PORTA.z - 2.2, 1.2);
      const eu = api.playerPosition();
      josefina.encarar(eu.x, eu.z);

      /**
       * A CAMERA ENQUADRA OS DOIS LADOS DA CONVERSA, e nao so quem fala.
       *
       * Focada na Josefina, a foto saia com a tartaruga na porta e mais nada: a
       * dupla estava no canteiro onde regou, a doze metros dali, e as falas
       * dela vinham de fora da tela. Uma ancora no MEIO do caminho, com o zoom
       * tirado da distancia, poe os dois no quadro sem ninguem precisar andar —
       * e a cena passa a mostrar o que ela e: ela chamando os dois da porta.
       */
      const meio = new THREE.Object3D();
      meio.position.set((eu.x + josefina.x) / 2, 0, (eu.z + josefina.z) / 2);
      w.root.add(meio);
      const vao = Math.hypot(eu.x - josefina.x, eu.z - josefina.z);
      api.focusCamera(meio);
      api.setZoom(Math.max(12, Math.min(26, vao * 1.5)));
      await api.wait(0.5);

      await conversa([
        [J, 'Ah, vocês acharam o regador.'],
        [A, 'A gente só ia dar uma olhada. Aí começou a regar.'],
        [J, 'É assim que começa. Primeiro a gente só olha.'],
        [J, 'Mas eu ia falar com vocês mesmo. Tem bicho entrando pelo fundo.'],
        [R, 'Bicho como assim? Tipo pulgão?'],
        [J, 'Não. Bicho grande. E não é bicho que eu conheça — tem uns com pinça, tem um que pula.'],
        [J, 'Eles vêm pelos três portões, atrás. Vêm pela horta e comem tudo o que encontram pela frente.'],
        [A, 'E a gente faz o quê? Espanta?'],
        [J, 'Água. Só isso. Eles não gostam de água e vão embora por onde vieram.'],
        [J, 'Não quero machucar nenhum bicho. Só quero eles do lado de fora.'],
        [R, 'A gente fica. Fala quando for a hora.'],
        [J, 'Eles chegam no fim da tarde, quando esfria. Enche esse regador até lá.'],
      ]);

      api.setFlag('jardim.convite');
      api.unlock({
        id: 'as-pragas-do-jardim',
        title: 'O que vem pelos portões',
        place: 'Clube',
        note: 'A Josefina não pediu pra gente matar nada. Pediu pra gente molhar. É bem a cara dela.',
        icon: '💧',
      });

      /**
       * A DUPLA E LIBERADA ANTES DE ELA CHEGAR NA BANCADA, e o `irPara` daqui
       * NAO e esperado.
       *
       * Ela anda a 0,4 e a bancada fica a uns treze metros: esperar isso seria
       * meio minuto de jogador travado olhando uma tartaruga atravessar a
       * estufa DEPOIS de a conversa ter acabado. A cutscene termina quando a
       * fala termina; o caminho dela de volta acontece no mundo, como qualquer
       * outro bicho andando pelo cenario.
       */
      api.focusCamera(null);
      api.setZoom(11);
      w.root.remove(meio);
      josefina.pararDeEncarar();
      // e, chegando no lado da bancada (fora dos canteiros), ela fica: passeia
      // pelas plantas como em toda visita daqui em diante
      void josefina.irPara(-10.4, 5.0, 0.4)
        .then(() => josefina.voltarAPassear());
      api.lockPlayer(false);

      /**
       * ======================= O GANCHO DA RODADA, e ele e de propriedade
       *
       * E AQUI que a etapa 3 do plano (`docs/MINIGAME-JARDIM.md` §9) entra: uma
       * chamada so, `iniciarRodadaDoJardim(...)`, com a dupla ja de regador na
       * mao e a planta do jardim publicada logo abaixo em `pontosDoJardim`.
       *
       * Ate ela existir, a fala da Josefina fecha o assunto no proprio mundo
       * ("eles chegam no fim da tarde") em vez de o jogo admitir que a peca
       * falta. Nada aqui e um beco sem saida: o jogador continua com o regador,
       * continua regando o que sobrou e continua podendo sair.
       */
    };

    /* ====================================================================
     *        DEPOIS DO CONVITE: ELA ENTRA JUNTO, E E COM ELA QUE SE JOGA
     * ====================================================================
     *
     * O desenho e do Renan. Do lado de fora a Josefina continua passeando no
     * caminho do jardim, como sempre (`scenes/clube.ts`). Mas depois que ela
     * contou das pragas, **toda vez que a dupla entra na estufa ela entra
     * junto** — vê os dois passando pela porta e vem atras — e fica passeando
     * aqui dentro, perto das plantas.
     *
     * E e ELA quem comeca a rodada: falar com ela, e ela pede confirmacao.
     * Nada comeca sem o jogador dizer que quer.
     */
    /** onde ela e quem ficou para tras esperam a rodada: atras, na linha da porta */
    const POSTO_DA_JOSEFINA = { x: -1.0, z: 6.8 };
    const POSTO_DO_PARCEIRO = { x: 1.0, z: 6.8 };
    /** o meio dos tres portoes: e para la que os dois de tras ficam olhando */
    const OLHAR_DOS_PORTOES = { x: 0, z: -hz };

    const convidados = g.flag('jardim.convite');
    /**
     * A ENTRADA DELA. Ela nasce do lado de FORA da porta, atras do vidro, e
     * atravessa a soleira um instante depois da dupla: e o "viu a gente
     * entrando e veio junto". Aparecer ja la dentro seria teletransporte, e
     * a Josefina e a unica pessoa do jogo que nunca tem pressa.
     *
     * O caminho passa por `x = 1`, e nao pelo eixo da porta: a dupla nasce EM
     * `(0; 8,6)`, e o eixo levaria a tartaruga por dentro de quem acabou de
     * entrar.
     */
    let entrando = convidados ? 1.1 : -1;
    if (convidados) {
      josefina.group.visible = true;
      josefina.sentarEm(PORTA.x, PORTA.z + 1.4, Math.PI);
    }
    const entrarAtras = async (): Promise<void> => {
      josefina.levantar();
      // um pouco mais rapida que o passeio (0,3): ela esta ACOMPANHANDO a
      // dupla, e a 0,3 a travessia da soleira levaria quinze segundos
      await josefina.irPara(PORTA.x, hz - 0.9, 0.9);
      await josefina.irPara(PORTA.x + 1.0, hz - 2.4, 0.9);
      await josefina.irPara(PORTA.x + 1.0, 5.6, 0.9);
      josefina.voltarAPassear();
    };

    /** a conversa ou a rodada estao acontecendo: o prompt dela descansa */
    let ocupada = false;

    const falarComAJosefina = w.interact({
      id: 'estufa:josefina',
      x: josefina.x, z: josefina.z, radius: 1.6,
      label: 'Falar com a Josefina', icon: '🐢',
      highlight: josefina.group,
      onInteract: async (api) => {
        if (ocupada) return;
        ocupada = true;
        try {
          await conversarComAJosefina(api);
        } finally {
          ocupada = false;
        }
      },
    });
    falarComAJosefina.enabled = false;

    w.onUpdate((dt) => {
      if (entrando > 0) {
        entrando -= dt;
        if (entrando <= 0) void entrarAtras();
      }
      falarComAJosefina.moveTo(josefina.x, josefina.z);
      // ela so conversa depois do convite, e nunca no meio de outra conversa
      // dela (a cutscene das pragas liga o `visible` antes de o convite existir)
      falarComAJosefina.enabled = !ocupada && g.flag('jardim.convite') && josefina.group.visible;
    });

    /** Quem vai regar tem que estar com o regador NA MAO, e nao na mochila. */
    const regadorNaMao = (api: typeof g): boolean => {
      if (api.getActiveHandItem()?.id === 'regador') return true;
      const vaga = api.handItems().findIndex((i) => i?.id === 'regador');
      if (vaga < 0) return false;
      api.setActiveHandSlot(vaga);
      return true;
    };

    const conversarComAJosefina = async (api: typeof g): Promise<void> => {
      const J = 'Josefina';
      const outro = api.companionName();
      josefina.receberCarinho();
      const eu = api.playerPosition();
      josefina.encarar(eu.x, eu.z);
      api.som('cantarolar');

      /**
       * A CONFIRMACAO. Pedido explicito do Renan: a rodada so comeca se o
       * jogador disser que quer. Quem so veio passear pela estufa responde
       * "agora nao" e continua passeando, sem castigo e sem insistencia.
       */
      const escolha = await api.ask(
        'Eles andam rondando os portões de novo. Vocês me ajudam a espantar as pragas?',
        ['Vamos espantar as pragas', 'Agora não'],
        J,
      );
      if (escolha !== 0) {
        await api.say(['Tudo bem, meu bem. Eu fico aqui com as mudas. É só me chamar.'], J);
        josefina.pararDeEncarar();
        return;
      }

      if (!regadorNaMao(api)) {
        if (api.hasItem('regador', api.companionId())) {
          await api.say(['O regador tá comigo.'], outro);
          await api.say(['Então quem vai lá pra frente é quem tá com ele, meu bem.'], J);
        } else {
          await api.say(['Pega o regador ali na bancada primeiro. Com a mão ninguém espanta bicho.'], J);
        }
        josefina.pararDeEncarar();
        return;
      }

      await assumirOsPostos(api);
    };

    /**
     * OS POSTOS: quem nao esta sendo controlado fica ATRAS, com a Josefina.
     *
     * Pedido do Renan: na rodada, so quem voce controla vai para a frente. O
     * outro fica na linha da porta, ao lado dela, olhando para os portoes —
     * e a dupla continua em cena, como o jogo exige, so que dividida.
     *
     * O PARCEIRO ANDA ATE LA, e nao aparece la. E o jogador fica SOLTO
     * enquanto isso: e a hora de ele ir para onde quiser defender.
     */
    const assumirOsPostos = async (api: typeof g): Promise<void> => {
      const J = 'Josefina';
      const outro = api.companionName();
      await api.say([
        'Então fica assim. Eu fico aqui atrás, na linha da porta, de olho nos canteiros.',
        `${outro}, fica comigo. Daqui a gente vê os três portões.`,
      ], J);

      api.commandCompanion(POSTO_DO_PARCEIRO.x, POSTO_DO_PARCEIRO.z);
      josefina.pararDeEncarar();
      josefina.entrarEmServico();
      const chegou = josefina.irPara(POSTO_DA_JOSEFINA.x, POSTO_DA_JOSEFINA.z, 1.0);

      // o parceiro e mais rapido que ela; espera ele chegar (com teto, para um
      // movel no caminho nunca prender a cena) e vira ele para os portoes
      for (let t = 0; t < 8; t += 0.25) {
        const p = api.companionPosition();
        if (Math.hypot(p.x - POSTO_DO_PARCEIRO.x, p.z - POSTO_DO_PARCEIRO.z) < 0.5) break;
        await api.wait(0.25);
      }
      api.holdCompanion(OLHAR_DOS_PORTOES.x, OLHAR_DOS_PORTOES.z);
      await api.say(['Fico aqui com ela. Vai lá, que daqui eu grito se vier bicho.'], outro);
      await chegou;
      josefina.encarar(OLHAR_DOS_PORTOES.x, OLHAR_DOS_PORTOES.z);

      /**
       * ======================= A RODADA COMEÇA — a etapa 3 do plano
       *
       * Com o jogador de regador na mão e o parceiro e a Josefina nos postos,
       * ela avisa, e a rodada (`minigames/jardim/rodada.ts`) liga. Quem a
       * desliga é a própria rodada, no fim da onda — e aí a Josefina fala
       * (`aoAcabarARodada`, mais abaixo).
       */
      await api.say(['Olha lá… estão vindo pelo fundo. Água neles, meu bem!'], J);
      rodada.comecar();
    };

    /* ====================================================================
     *        OS CHAMADOS: QUEM DO CLUBE ENTRA PELA PORTA PARA AJUDAR
     * ====================================================================
     *
     * Pedido do Renan: pegar uma carta de chamado ("Chamar o Capy", o Mutirão
     * do clube) é uma CUTSCENE — o bicho entra pela porta principal, cada um
     * com as falas dele, e fica. Quem ele é e o que faz na rodada está na
     * carta (`chama`, em `minigames/jardim/cartas.ts`); aqui mora só a entrada.
     *
     * Eles são as MESMAS classes do clube (`entities/bichos/`), em serviço: o
     * mesmo Capy da piscina, a mesma Gina da guarita. Nascem do lado de FORA
     * da porta, escondidos, como a Josefina — ninguém aparece do nada no meio
     * da estufa.
     *
     * O POSTO de cada um é a linha da frente do terreiro, entre a porta e os
     * canteiros de cima, na altura das moitas: perto da porta por onde
     * entraram, fora do caminho dos bichos, e na frente da câmera.
     */
    const areaDaPorta = {
      minX: -hx + 2.6, maxX: hx - 2.6,
      minZ: 1.0, maxZ: hz - 1.6,
      proibido: obstaculosDoPasseio,
    };
    type Falas = Array<readonly [string, string]>;
    const AJUDANTES: Record<AjudanteDoClube, {
      bicho: Bicho;
      nome: string;
      posto: { x: number; z: number };
      som: Parameters<typeof g.som>[0];
    }> = {
      capy: { bicho: new Capy(areaDaPorta), nome: 'Capy', posto: { x: -3.0, z: 5.2 }, som: 'apito' },
      gina: { bicho: new Gina(areaDaPorta), nome: 'Gina', posto: { x: 3.0, z: 5.2 }, som: 'apito' },
      walter: { bicho: new Walter(areaDaPorta), nome: 'Walter', posto: { x: -5.6, z: 5.0 }, som: 'latido' },
      noel: { bicho: new Noel(areaDaPorta), nome: 'Noel', posto: { x: 5.6, z: 5.0 }, som: 'gluglu' },
    };
    for (const a of Object.values(AJUDANTES)) {
      a.bicho.aoSoar = () => g.som(a.som);
      a.bicho.group.visible = false;
      a.bicho.sentarEm(PORTA.x, PORTA.z + 1.4, Math.PI);
      w.add(a.bicho.group);
    }
    w.onUpdate((dt) => {
      for (const a of Object.values(AJUDANTES)) if (a.bicho.group.visible) a.bicho.update(dt);
    });
    const naEstufa = new Set<AjudanteDoClube>();

    /**
     * AS FALAS DE CADA CHAMADO, pela carta. O Walter não fala — é cachorro, e
     * no Mania quem fala por ele é a dupla ("se ele pudesse falar…"); aqui é
     * igual. O Noel fala em maiúscula quando empolga, como no bar de sucos.
     */
    const FALAS_DO_CHAMADO: Record<string, Falas> = {
      'chama-capy': [
        ['Capy', 'Me chamaram? Ouvi dizer que aqui tem bicho que não gosta de água.'],
        ['Capy', 'Então eu vim ao lugar certo. Água é comigo.'],
        [R, 'Ele veio de apito e tudo.'],
        [A, 'E de óculos. É o Capy de serviço.'],
        ['Capy', 'Mordeu canteiro, eu corro lá e molho junto. No resto, fico ali de olho.'],
      ],
      'chama-gina': [
        ['Gina', 'Licença, licença! Cuidado com a cabeça… a minha, no caso.'],
        ['Gina', 'Me contaram que tem bicho entrando aqui sem carteirinha.'],
        [A, 'Pelos portões do fundo. Nem pedem licença.'],
        ['Gina', 'Ah, não. Portão é comigo, viu? Onde eu ficar, ninguém passa.'],
      ],
      'chama-walter': [
        ['Walter', 'Au! Au!'],
        [R, 'O Walter largou o salão pra vir ajudar.'],
        [A, 'Com bandeja e tudo.'],
        ['Walter', 'Auuu!'],
        [R, 'Acho que isso quer dizer "deixa comigo".'],
      ],
      'walter-de-plantao': [
        ['Walter', 'Au!'],
        [A, 'O Walter veio de plantão.'],
        [R, 'Bicho chegou perto das plantas, ele vai lá latir.'],
        ['Walter', 'Au! Au!'],
      ],
      'chama-noel': [
        ['Noel', 'Cheguei, cheguei! Vim correndo. CORRENDO!'],
        ['Noel', 'Me falaram que tá caindo gotinha azul por aqui. Eu cato tudo, viu? Uma por uma.'],
        [R, 'Igual as laranjas da feira.'],
        ['Noel', 'Igualzinho! Gota boa, a gente escolhe no olho.'],
      ],
      'mutirao-do-clube': [
        ['Gina', 'Ô de casa! Trouxe o pessoal todo, viu?'],
        ['Noel', 'Todo mundo junto! JUNTO!'],
        ['Capy', 'Soube que a mãe desses bichos vem aí. Então a gente vem também.'],
        ['Walter', 'Au! Au!'],
        [A, 'O clube inteiro dentro da estufa…'],
        [R, 'O Noel vai ter que fazer suco pra todo mundo depois.'],
        ['Noel', 'Já tô fazendo a conta!'],
        ['Capy', 'A gente fica ali perto da porta. Quando a grandona chegar, entra todo mundo.'],
      ],
    };

    /** uma promessa de chegada, com teto: um bicho preso nunca trava a cena */
    const chegar = (p: Promise<void>, teto: number): Promise<void> =>
      Promise.race([p, g.wait(teto)]);

    /**
     * A ENTRADA DE UM: da soleira de fora, pelo eixo da porta, até um passo
     * dentro — e dali para o posto. Na cutscene de um só ele para no meio do
     * corredor para falar (`falarDoCorredor`); no mutirão cada um vai direto
     * para o seu lugar, senão os quatro se empilhariam no mesmo ponto.
     */
    const entrar = async (quem: AjudanteDoClube, falarDoCorredor: boolean): Promise<void> => {
      const a = AJUDANTES[quem];
      const b = a.bicho;
      b.group.visible = true;
      b.sentarEm(PORTA.x, PORTA.z + 1.4, Math.PI);
      b.levantar();
      // a Gina é mais alta que a porta: abaixa o pescoço para passar ("cuidado
      // com a cabeça… a minha") e só levanta depois da soleira
      const gina = b instanceof Gina ? b : null;
      // (ela nasce do lado de fora, escondida: pode nascer já abaixada)
      if (gina) gina.abaixarDeUmaVez(1);
      // cutscene anda mais depressa que passeio (o Capy passeia a 0,45), como
      // a Josefina: ninguém espera meio minuto um bicho atravessar a soleira
      await chegar(b.irPara(PORTA.x, hz - 0.9, 1.4), 15);
      if (gina) gina.abaixar = 0;
      if (falarDoCorredor) await chegar(b.irPara(PORTA.x, hz - 3.2, 1.4), 15);
      else await chegar(b.irPara(a.posto.x, a.posto.z, 1.4), 20);
    };

    /** O PASSO QUE A CARTA DÁ: a cutscene inteira, e o bicho fica. */
    const chamarPelaCarta = async (id: string): Promise<void> => {
      const quem = (cartaPorId(id)?.chama ?? []).filter((q) => !naEstufa.has(q));
      const falas = FALAS_DO_CHAMADO[id];
      if (!falas) return;
      for (const q of quem) naEstufa.add(q);
      const sozinho = quem.length === 1;

      g.lockPlayer(true);
      if (quem.length > 0) {
        g.som('porta');
        portaAberta = true;
        // a câmera acompanha quem abre a porta
        g.focusCamera(AJUDANTES[quem[0]].bicho.group);
        g.setZoom(9);
        // no mutirão eles entram em fila, um depois do outro
        await Promise.all(quem.map(async (q, i) => {
          await g.wait(i * 0.8);
          if (i > 0) g.som(AJUDANTES[q].som);
          await entrar(q, sozinho);
        }));
        portaAberta = false;
      }

      /*
       * A CÂMERA ENQUADRA OS DOIS LADOS DA CONVERSA — a mesma âncora do meio
       * da cutscene da Josefina: a dupla pode estar no fundo do terreiro, e
       * as falas de quem entrou não podem vir de fora da tela.
       */
      const eu = g.playerPosition();
      const falantes = (quem.length > 0 ? quem : [...naEstufa]).map((q) => AJUDANTES[q].bicho);
      const cx = falantes.reduce((s, b) => s + b.x, 0) / Math.max(1, falantes.length);
      const cz = falantes.reduce((s, b) => s + b.z, 0) / Math.max(1, falantes.length);
      /*
       * A âncora fica MAIS PERTO DE QUEM ENTROU (60%), e não no meio exato: a
       * porta é a parte de baixo da tela, e a caixa de fala mora ali. No meio
       * exato, o bicho que acabou de entrar ficava atrás do próprio balão.
       */
      const meio = new THREE.Object3D();
      meio.position.set(eu.x + (cx - eu.x) * 0.6, 0, eu.z + (cz - eu.z) * 0.6);
      w.root.add(meio);
      const vao = Math.max(
        Math.hypot(eu.x - cx, eu.z - cz),
        ...falantes.map((b) => Math.hypot(b.x - cx, b.z - cz) * 2),
      );
      g.focusCamera(meio);
      g.setZoom(Math.max(11, Math.min(28, vao * 1.7)));
      for (const b of falantes) b.encarar(eu.x, eu.z);
      await g.wait(0.4);

      for (const [fala, texto] of falas) {
        const q = (Object.keys(AJUDANTES) as AjudanteDoClube[]).find((k) => AJUDANTES[k].nome === fala);
        if (q) g.som(AJUDANTES[q].som);
        await g.say([texto], fala);
      }

      g.focusCamera(null);
      g.setZoom(11);
      w.root.remove(meio);
      g.lockPlayer(false);
      // e cada um vai para o posto dele, virado para os portões — a caminhada
      // acontece no mundo, depois da conversa, sem prender ninguém
      for (const q of quem) {
        const { bicho, posto } = AJUDANTES[q];
        bicho.pararDeEncarar();
        void chegar(bicho.irPara(posto.x, posto.z, 1.0), 10)
          .then(() => bicho.encarar(OLHAR_DOS_PORTOES.x, OLHAR_DOS_PORTOES.z));
      }
    };
    w.root.userData.chamarPelaCarta = chamarPelaCarta;
    w.root.userData.ajudantes = () => Object.fromEntries(
      (Object.keys(AJUDANTES) as AjudanteDoClube[]).map((q) => {
        const b = AJUDANTES[q].bicho;
        // `topo`: o ponto mais alto do desenho — é o que mede se a Gina passa na porta
        const topo = new THREE.Box3().setFromObject(b.group).max.y;
        return [q, { visivel: b.group.visible, x: b.x, z: b.z, topo, posto: AJUDANTES[q].posto }];
      }),
    );

    /* ====================================================================
     *          O TREINO DAS GOTAS E DAS CARTAS — ferramenta de olhar
     * ====================================================================
     *
     * A rodada de verdade (etapa 3 do plano) ainda não existe, e sem ela nenhum
     * bicho é espantado e nenhuma gota cai. Mas as duas peças que ela vai usar
     * JÁ existem — as gotas no chão e a tela das três cartas — e peça que
     * ninguém consegue ver não dá para ajustar.
     *
     * Então a estufa publica este treino, e só a URL o liga
     * (`?cena=estufa&treino=gotas`, lido em `main.ts`): de tempos em tempos cai
     * um punhado de gotas perto da dupla, como se um bicho tivesse acabado de
     * ser espantado ali; pegar enche a barra; subir de nível abre a tela das
     * cartas com o SORTEIO DE VERDADE (`MaoDeCartas.oferta`); e a carta pega
     * entra na mão e muda o regador na mão do jogador.
     *
     * NADA disso é jogo — ninguém chega aqui jogando, e o save não guarda
     * nada. É a mesma família do `?em=` e do `?zoom=`. Quando a rodada existir,
     * ela faz exatamente estas chamadas, só que com bicho de verdade soltando
     * as experiencia.
     */
    const experiencia = new GotasDoJardim();
    // o dado do treino: `w.rng` usa o `this` do WorldBuilder, e passado solto
    // como função ele perde o dono — o primeiro punhado de gotas quebrava
    const dado = (): number => w.rng();
    w.add(experiencia.grupo);

    let treinando = false;
    let escolhendo = false;
    let juntadas = 0;
    let nivelAtual = 0;
    let proximoPunhado = 1.2;
    const mao = new MaoDeCartas();
    let ficha = mao.ficha();

    /**
     * SOBE DE NÍVEL — e pode subir mais de um de uma vez.
     *
     * Com o raio de coleta alto, uma chuva de gotas pode passar dois níveis no
     * mesmo quadro. Cada nível ganho é UMA tela de cartas, em sequência: pular
     * uma seria perder a carta dela.
     */
    /**
     * O QUE ACONTECE DEPOIS DO TOQUE NA CARTA: ela entra na mão, a ficha é
     * derivada de novo, o regador muda — e, se for chamado, o bicho entra pela
     * porta. Publicado para o teste pegar uma carta ESPECÍFICA sem depender do
     * sorteio (`scripts/chamados.mjs`).
     */
    const aplicarCartaPega = async (id: string): Promise<void> => {
      mao.pegar(id, nivelAtual);
      const carta = cartaPorId(id);
      if (carta?.repetivel) {
        g.toast(carta.texto, carta.icone);
        return;
      }
      ficha = mao.ficha();
      // a carta que mexe no regador MUDA A PEÇA DA MÃO — o §6 do plano
      g.vestirRegador(mao.estiloDoRegador());
      // carta de chamado: o bicho entra pela porta ANTES de a rodada voltar
      if (carta?.chama) await chamarPelaCarta(id);
    };
    w.root.userData.pegarCarta = async (id: string, nivel = 10): Promise<void> => {
      escolhendo = true;
      nivelAtual = Math.max(nivelAtual, nivel);
      await aplicarCartaPega(id);
      escolhendo = false;
    };

    const subir = async (ate: number): Promise<void> => {
      escolhendo = true;
      while (nivelAtual < ate) {
        nivelAtual += 1;
        const oferta = mao.oferta(nivelAtual, dado);
        const id = await g.escolherCartaDoJardim(oferta.map(cartaNaTela), {
          nivel: nivelAtual,
          mao: mao.cartas.map((c) => ({ id: c.id, nome: c.nome, icone: c.icone, raridade: c.raridade })),
        });
        await aplicarCartaPega(id);
      }
      escolhendo = false;
    };

    w.root.userData.treinoDeGotas = (): void => {
      if (treinando) return;
      treinando = true;
      // o regador vai para a mão: é nele que as cartas aparecem
      if (!g.hasItem('regador')) g.addItem(ITENS.regador);
      g.vestirRegador(null);
      g.showExperiencia(nivelDasGotas(0));
      g.toast('Treino das gotas: pegue as gotas azuis', '💧');
    };
    // o teste solta gotas onde quiser, sem esperar o relógio do treino
    w.root.userData.soltarGotas = (x: number, z: number, quantas: number): void => {
      experiencia.soltar(x, z, quantas, dado);
    };
    w.root.userData.estadoDoTreino = () => ({
      juntadas, nivel: nivelAtual, noChao: experiencia.quantasNoChao, mao: [...mao.ids], escolhendo,
    });

    w.onUpdate((dt) => {
      if (!treinando) return;
      const eu = g.playerPosition();

      // de tempos em tempos um punhado cai perto, dentro do terreiro: é o
      // bicho que acabou de ser espantado ali
      proximoPunhado -= escolhendo ? 0 : dt;
      if (proximoPunhado <= 0) {
        proximoPunhado = 2.4;
        const a = w.rng() * Math.PI * 2;
        const r = 2.2 + w.rng() * 2.6;
        const meiaL = TERREIRO.largura / 2 - 1;
        const meiaP = TERREIRO.profundidade / 2 - 1;
        const x = Math.max(TERREIRO.x - meiaL, Math.min(TERREIRO.x + meiaL, eu.x + Math.cos(a) * r));
        const z = Math.max(TERREIRO.z - meiaP, Math.min(TERREIRO.z + meiaP, eu.z + Math.sin(a) * r));
        experiencia.soltar(x, z, 1 + Math.floor(w.rng() * 3), dado);
      }

      const pegas = experiencia.update(dt, eu, ficha.coleta, escolhendo);
      if (pegas === 0) return;
      g.som('pegar');
      juntadas += pegas;
      const agora = nivelDasGotas(juntadas);
      g.showExperiencia(agora);
      if (agora.nivel > nivelAtual && !escolhendo) void subir(agora.nivel);
    });

    /* ====================================================================
     *                  A RODADA — o minigame, rodando (etapa 3)
     * ====================================================================
     *
     * A cena monta a PLANTA (por onde os bichos vêm, onde estão os canteiros
     * e o tonel) e entrega para a rodada, que não sabe que existe uma estufa.
     * O resto é ouvir: carta de chamado pega → a cutscene da porta; rodada
     * acabou → a Josefina fala e todo mundo sai do posto.
     */
    const FOLHA_DO_CANTEIRO: Record<string, number> = {
      samambaia: P.folhaSamambaia, lavanda: P.florLavanda, suculenta: P.folhaSuculenta,
      alface: P.folhaAlface, tomate: P.tomateMaduro, girassol: P.florGirassol,
    };
    /**
     * O ELENCO: a rodada pede "vai até ali", "late", "volta pro posto", e aqui
     * é quem sabe quem é quem. O Jean-Luc só existe para a carta dele: boia
     * dentro do tonel enquanto ela está na mão.
     */
    const jeanLuc = new JeanLuc({
      minX: tonel.position.x - 0.1, maxX: tonel.position.x + 0.1,
      minZ: tonel.position.z - 0.1, maxZ: tonel.position.z + 0.1,
      proibido: [],
    });
    jeanLuc.group.visible = false;
    w.add(jeanLuc.group);
    w.onUpdate((dt) => { if (jeanLuc.group.visible) jeanLuc.update(dt); });
    const quemE = (q: QuemAjuda): Bicho => (q === 'josefina' ? josefina : AJUDANTES[q].bicho);
    const postoDe = (q: QuemAjuda): { x: number; z: number } =>
      (q === 'josefina' ? POSTO_DA_JOSEFINA : AJUDANTES[q].posto);
    const elenco: ElencoDaEstufa = {
      presente: (q) => (q === 'josefina' ? josefina.group.visible : naEstufa.has(q)),
      onde: (q) => ({ x: quemE(q).x, z: quemE(q).z }),
      ir: (q, x, z, velocidade) => {
        const b = quemE(q);
        b.pararDeEncarar();
        return chegar(b.irPara(x, z, velocidade), 20);
      },
      seguir: (q, x, z, velocidade) => {
        const b = quemE(q);
        b.pararDeEncarar();
        b.seguir(x, z, velocidade);
      },
      encarar: (q, x, z) => quemE(q).encarar(x, z),
      voltarAoPosto: (q) => {
        const b = quemE(q);
        const posto = postoDe(q);
        b.pararDeEncarar();
        void chegar(b.irPara(posto.x, posto.z, 1.4), 15)
          .then(() => b.encarar(OLHAR_DOS_PORTOES.x, OLHAR_DOS_PORTOES.z));
      },
      soar: (q) => g.som(q === 'josefina' ? 'cantarolar' : AJUDANTES[q].som),
      jaEsta: (q) => {
        const a = AJUDANTES[q];
        naEstufa.add(q);
        a.bicho.group.visible = true;
        a.bicho.sentarEm(a.posto.x, a.posto.z, Math.PI);
        a.bicho.levantar();
        a.bicho.encarar(OLHAR_DOS_PORTOES.x, OLHAR_DOS_PORTOES.z);
      },
      patoNoTonel: (ligado) => {
        jeanLuc.group.visible = ligado;
        // boiando na água do tonel, que fica um dedo abaixo da boca
        if (ligado) jeanLuc.sentarEm(tonel.position.x, tonel.position.z, Math.PI / 2, 1.0);
      },
    };

    const rodada = new RodadaDoJardim(w, g, {
      entradas: PORTOES.xs.map((x) => ({ x, z: FUNDO_DE_FORA - 1.6 })),
      brechas: PORTOES.xs.map((x) => ({ x, z: FUNDO_DE_FORA + 0.2 })),
      portoes: PORTOES.xs.map((x) => ({ x, z: -hz })),
      bocas: PORTOES.xs.map((x) => ({ x, z: CHEGADA })),
      canteiros: hortas.map((h) => ({
        x: h.x,
        z: h.z,
        meioX: (h.giro === 0 ? CANTEIRO.largura : CANTEIRO.profundidade) / 2,
        meioZ: (h.giro === 0 ? CANTEIRO.profundidade : CANTEIRO.largura) / 2,
        peca: h.peca,
        folha: FOLHA_DO_CANTEIRO[h.tipo] ?? P.folhaAlface,
        tipo: h.tipo,
        nome: h.nome,
        giro: h.giro,
      })),
      tonel: { x: tonel.position.x, z: tonel.position.z, altura: 1.2 },
      centro: { x: 0, z: 0, raio: 12 },
      porta: { x: PORTA.x, z: PORTA.z },
      postoDeTras: POSTO_DO_PARCEIRO,
      olharDosPortoes: OLHAR_DOS_PORTOES,
      /*
       * AS PEÇAS DAS CARTAS, no terreiro: o segundo tonel espelha o primeiro
       * na parede da direita; a cerquinha atravessa o caminho do portão do
       * meio; o espantalho fica entre ela e os portões (é lá que ele puxa
       * quem acabou de entrar) e o aspersor no miolo, onde todo caminho passa.
       */
      lugares: {
        segundoTonel: { x: hx - 1.2, z: -7.4 },
        aspersor: { x: 0, z: -0.6 },
        espantalho: { x: 0, z: -6.6 },
        cerquinha: { x: 0, z: -4.2, comprimento: 6 },
      },
      elenco,
    });
    w.onUpdate((dt) => rodada.atualizar(dt));
    rodada.aoPegarCarta = (id) => chamarPelaCarta(id);

    /* ====================================================================
     *          A LOJINHA DA JOSEFINA E OS ENFEITES DA ESTUFA
     * ====================================================================
     *
     * Pedido do Renan: a banca do canto vende roupa e decoração, e a dupla
     * põe cada enfeite onde quiser. Quem cuida do chão é o `Decorador`
     * (`world/decorador.ts`); aqui mora a REGRA DO LUGAR — o que só esta
     * planta sabe:
     *
     * - **o terreiro e os caminhos ficam limpos**: é a arena, e a rodada
     *   precisa de chão legível (a mesma regra que já proibia planta ali);
     * - **o fundo (`z < -4,6`) é dos bichos e dos tonéis**;
     * - **o eixo da porta fica vazio** (passagem tem eixo), e a frente da
     *   bancada, do livro, do regador e da lojinha também;
     * - **nada em cima de canteiro nem das mudas da frente**.
     *
     * Colisor e outro enfeite o decorador confere sozinho.
     */
    const FUNDO_DOS_ENFEITES = -4.6;
    const regrasDoLugar = {
      proibido: (x: number, z: number, raio: number): string | null => {
        if (z < FUNDO_DOS_ENFEITES + raio) return 'aí é caminho de bicho';
        if (Math.abs(x) > hx - 0.5 - raio || z > hz - 1.25 - raio) return 'colado demais na parede';
        if (Math.abs(x - TERREIRO.x) < TERREIRO.largura / 2 + raio + 0.2
          && Math.abs(z - TERREIRO.z) < TERREIRO.profundidade / 2 + raio + 0.2) return 'no terreiro, onde os bichos passam';
        if (Math.abs(z - TERREIRO.z) < 1.1 + raio) return 'no caminho do meio';
        if (Math.abs(x - PORTA.x) < 1.7 + raio && z > TERREIRO.z) return 'no caminho da porta';
        if (emCimaDeCanteiro(x, z, raio + 0.05)) return 'em cima do canteiro';
        if (naLoja(x, z, raio)) return 'na frente da lojinha';
        if (x < -hx + 3.2 + raio && z > 4.4 && z < 9.8) return 'na frente da bancada';
        if (moitasDaFrente.some((m) => Math.hypot(x - m.x, z - m.z) < m.r * 0.8 + raio)) return 'em cima das plantas';
        return null;
      },
    };
    const decorador = new Decorador(w, regrasDoLugar);
    decorador.aoMudar = () => {
      obstaculosDoPasseio.length = fixos;
      obstaculosDoPasseio.push(...decorador.circulos());
    };
    decorador.aoMudar();
    w.root.userData.decorador = decorador;

    const conteudoDaLoja = (): ConteudoDaLoja => ({
      saldo: g.carteira(),
      roupas: ROUPAS_DA_JOSEFINA.map((p) => ({
        id: p.id,
        nome: p.nome,
        icone: p.icone,
        nota: p.nota,
        preco: p.preco ?? 0,
        cor: `#${(p.cor ?? p.amostra ?? 0xcccccc).toString(16).padStart(6, '0')}`,
        jaTem: g.jaTemPeca(p.id),
      })),
      decoracoes: DECORACOES.map((d) => ({
        id: d.id,
        nome: d.nome,
        icone: d.icone,
        descricao: d.descricao,
        preco: d.preco,
        guardadas: decorador.guardadas(d.id),
        postas: decorador.postas(d.id),
      })),
    });
    const agirNaLoja = (a: AcaoNaLoja): ConteudoDaLoja => {
      if (a.tipo === 'comprar-roupa') {
        const peca = ROUPAS_DA_JOSEFINA.find((p) => p.id === a.id);
        if (peca) g.comprarPeca(peca);
      } else {
        decorador.comprar(a.id);
      }
      return conteudoDaLoja();
    };
    /**
     * A BANCA, pelo ponto na frente do balcão. A primeira vez a Josefina
     * apresenta (a fala é minha — o Renan não passou texto: trocar aqui,
     * literal, se ele mandar); depois o painel abre direto.
     */
    const abrirALojinha = async (): Promise<void> => {
      if (!g.flag('estufa.lojinha-vista')) {
        g.setFlag('estufa.lojinha-vista');
        await g.say([
          'Montei uma lojinha aqui no canto, viu?',
          'Tem roupa de mexer na terra, e enfeite pra deixar a estufa mais bonita. Vocês escolhem onde fica cada um.',
        ], 'Josefina');
      }
      const saida = await g.abrirLojaDaJosefina(conteudoDaLoja(), agirNaLoja);
      if (saida?.tipo === 'provar') g.abrirLoja('Roupas da Josefina', ROUPAS_DA_JOSEFINA);
      else if (saida?.tipo === 'colocar') decorador.colocar(saida.id);
    };
    w.interact({
      id: 'estufa:lojinha',
      x: BALCAO.x, z: BALCAO.z, radius: 1.3,
      label: 'Lojinha da Josefina', icon: '🛍️',
      highlight: lojinha,
      onInteract: abrirALojinha,
    });
    w.root.userData.abrirALojinha = abrirALojinha;

    /**
     * O FIM DA RODADA: a Josefina conta como foi, pelo número de canteiros de
     * pé — que é o placar do §3 (canteiro vivo, e não bicho espantado). O
     * pagamento por canteiro é a etapa 9; aqui ela só agradece.
     */
    const ORDINAL = [
      'primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta', 'sétima', 'oitava', 'nona', 'décima',
      'décima primeira', 'décima segunda', 'décima terceira', 'décima quarta', 'décima quinta',
      'décima sexta', 'décima sétima', 'décima oitava', 'décima nona', 'vigésima',
      'vigésima primeira', 'vigésima segunda', 'vigésima terceira', 'vigésima quarta', 'vigésima quinta',
      'vigésima sexta', 'vigésima sétima', 'vigésima oitava', 'vigésima nona', 'trigésima',
    ];
    /**
     * A ENTREGA DE UM PRÊMIO ÚNICO — quando a dupla clica em RESGATAR na aba
     * de recompensas do livro, depois de ter vencido a onda do marco. Quem
     * entrega é a Josefina. As falas
     * são minhas (o Renan não passou texto para estas): se ele mandar, trocar
     * aqui, literal.
     */
    const entregarMarco = async (m: MarcoDoJardim): Promise<void> => {
      const J = 'Josefina';
      const mostrar = async (peca: THREE.Object3D | undefined): Promise<void> => {
        if (!peca) return;
        g.focusCamera(peca);
        g.setZoom(7);
        g.som('memoria');
        await g.wait(1.6);
        g.focusCamera(null);
        g.setZoom(11);
      };
      if (m.premio === 'plaquinha') {
        await g.say(['Cinco levas seguradas! Isso merece uma plaquinha.'], J);
        montarEnfeites();
        await mostrar(enfeites.plaquinha);
        await g.say(['Pronto. Agora quem entra aqui sabe quem cuida disso comigo.'], J);
      } else if (m.premio === 'chapeu-de-jardineira') {
        await g.say([
          'Dez levas… e vocês torrando nesse sol de estufa.',
          'Tomem, um chapéu de jardineira pra cada um. Já deixei no armário de vocês.',
        ], J);
        g.ganharPeca(ITENS.chapeuDeJardineira);
        g.som('memoria');
        g.toast('Chapéu de jardineira no guarda-roupa dos dois', '👒');
      } else if (m.premio === 'avental-da-josefina') {
        await g.say([
          'Vinte levas. Vocês já são da casa, meu bem.',
          'Um avental pra cada um, com bolso pra semente. Jardineiro de verdade suja a roupa.',
        ], J);
        g.ganharPeca(ITENS.aventalDaJosefina);
        g.som('memoria');
        g.toast('Avental da Josefina no guarda-roupa dos dois', '🧺');
      } else if (m.premio === 'regador-de-ouro') {
        await g.say(['Trinta levas. Até a mãe deles desistiu de vocês!'], J);
        montarEnfeites();
        await mostrar(enfeites.trofeu);
        await g.say(['Esse regador de ouro fica aqui na bancada, pra todo mundo saber quem segurou a estufa.'], J);
        await conversa([
          [A, 'Essa vai pro quadro do quarto.'],
          [R, 'Trinta levas. A gente merece.'],
        ]);
        g.toast('Uma memória nova no quadro do quarto', '📌');
        g.unlock({
          id: 'estufa-trinta-levas',
          title: 'As trinta levas',
          place: 'Estufa da Josefina',
          note: 'Até a mãe deles desistiu. O regador de ouro ficou na bancada.',
          icon: '🏆',
        });
      }
    };

    rodada.aoAcabar = (fim) => {
      const { canteiros, total, ondas, de } = fim;
      const venceu = ondas >= de && canteiros > 0;
      /*
       * OS PRÊMIOS (pedido do Renan): toda rodada jogada até o fim PAGA — por
       * onda vencida e pelos marcos alcançados —, e o marco alcançado pela
       * primeira vez dá o prêmio único dele. A rodada interrompida (a dupla
       * saiu da cena) não paga: não chegou a acabar.
       */
      const jogou = fim.motivo === 'fim';
      const vencidas = ondasVencidas(ondas, de, canteiros);
      const pagamento = pagamentoDaRodada(vencidas);
      const novos = jogou ? MARCOS.filter((m) => vencidas >= m.onda && !g.flag(m.flag)) : [];
      if (jogou && pagamento.total > 0) g.ganhar(pagamento.total);
      // o marco fica ALCANÇADO; o prêmio único se resgata no livro da bancada
      for (const m of novos) g.setFlag(m.flag);
      // o recorde: a maior onda vencida numa rodada, para a aba de recompensas
      const recorde = g.stat(RECORDE);
      if (jogou && vencidas > recorde) g.bump(RECORDE, vencidas - recorde);
      void (async () => {
        const J = 'Josefina';
        g.lockPlayer(true);
        /*
         * A TELA DO FIM, antes da fala dela (pedido do Renan): quantos bichos
         * foram espantados, e de quais, e a página das cartas que a rodada
         * juntou. Só quando a rodada acabou jogando — interrompida, não há
         * placar para mostrar.
         */
        if (fim.motivo === 'fim') {
          await g.mostrarFimDoJardim({
            venceu,
            onda: ondas,
            ondas: de,
            espantados: fim.espantados,
            porPraga: Object.entries(fim.porPraga)
              .sort((x, y) => y[1] - x[1])
              .map(([id, quantos]) => ({ nome: PRAGAS.find((p) => p.id === id)?.nome ?? id, quantos })),
            canteiros,
            totalDeCanteiros: total,
            nivel: fim.nivel,
            cartas: fim.cartas.map((id) => cartaPorId(id)).filter((c) => !!c).map((c) => cartaNaTela(c!)),
            novas: fim.novas,
            pagamento,
            marcos: novos.map((m) => ({ onda: m.onda, nome: m.nome, icone: m.icone })),
          });
        }
        josefina.encarar(g.playerPosition().x, g.playerPosition().z);
        const fala = canteiros === total
          ? ['Nenhum canteiro comido! Vocês são bons nisso, hein.']
          : canteiros === 0
            ? ['Levaram tudo… Não tem problema, meu bem. Terra boa brota de novo.']
            : [`Sobraram ${canteiros} de ${total} canteiros. Tá ótimo pra primeira vez.`];
        // as trinta levas inteiras, ou até onde a dupla chegou
        const leva = venceu
          ? `Foram as ${de} levas, e vocês seguraram todas. Até a mãe deles!`
          : `Essa foi a ${ORDINAL[Math.max(0, ondas - 1)] ?? 'última'} leva. Amanhã vem mais.`;
        await g.say([
          ...fala,
          leva,
          'Deixa que eu replanto o que foi comido.',
        ], J);
        // a recompensa nova espera no livro: a Josefina só avisa onde
        if (novos.length) {
          await g.say([novos.length > 1
            ? 'E tem recompensa nova esperando vocês no livro da bancada. Mais de uma!'
            : 'E tem uma recompensa nova esperando vocês no livro da bancada.'], J);
        }
        g.lockPlayer(false);
        g.freeCompanion();
        josefina.pararDeEncarar();
        josefina.voltarAPassear();
      })();
    };

    /**
     * DOIS ATALHOS DE OLHAR, ligados pela URL (`main.ts`), da mesma família
     * do treino das gotas:
     *
     * - `?cena=estufa&rodada=1` começa a rodada direto, sem a conversa;
     * - `?cena=estufa&jato=gota-gelada,poca` monta a VITRINE do jato: três
     *   lagartejos parados na frente da dupla, que nascem de novo quando são
     *   espantados, e as cartas pedidas já na mão. É o jeito de ver o jato de
     *   uma carta sem esperar ela sair no sorteio.
     */
    /**
     * Os atalhos pulam a conversa, mas não pulam a Josefina: na rodada de
     * verdade ela está no posto dela, e cartas como "A Josefina ajuda" contam
     * com isso.
     */
    const josefinaNoPosto = (): void => {
      josefina.group.visible = true;
      josefina.entrarEmServico();
      josefina.sentarEm(POSTO_DA_JOSEFINA.x, POSTO_DA_JOSEFINA.z, Math.PI);
      josefina.levantar();
      josefina.encarar(OLHAR_DOS_PORTOES.x, OLHAR_DOS_PORTOES.z);
    };
    w.root.userData.comecarRodada = (cartas: readonly string[] = []): void => {
      josefinaNoPosto();
      if (!g.hasItem('regador')) g.addItem(ITENS.regador);
      const vaga = g.handItems().findIndex((i) => i?.id === 'regador');
      if (vaga >= 0) g.setActiveHandSlot(vaga);
      rodada.comecar({ cartas });
    };
    w.root.userData.vitrineDoJato = (cartas: readonly string[] = [], praga = 'lagartejo'): void => {
      josefinaNoPosto();
      if (!g.hasItem('regador')) g.addItem(ITENS.regador);
      const vaga = g.handItems().findIndex((i) => i?.id === 'regador');
      if (vaga >= 0) g.setActiveHandSlot(vaga);
      const eu = g.playerPosition();
      rodada.comecar({ cartas, vitrine: true });
      // em leque, na direção dos portões: a câmera vê a dupla e os três
      rodada.montarVitrine([
        { x: eu.x - 1.3, z: eu.z - 2.0 },
        { x: eu.x + 0.1, z: eu.z - 2.3 },
        { x: eu.x + 1.4, z: eu.z - 1.8 },
      ], praga);
    };
    w.root.userData.rodada = rodada;

    // o segundo tonel e a segunda bancada ficam so de cenario por enquanto —
    // marcados aqui para o minigame achar depois sem ter que varrer a cena
    /**
     * A PLANTA DO MINIGAME, publicada para quem vier construir a mecanica.
     *
     * `bocas` deixou de ser os quatro cantos e passou a ser UM PONTO POR
     * PORTAO, um passo para dentro de cada um. E dali que o bicho comeca a
     * andar, e e isso que o teste mede.
     */
    w.root.userData.pontosDoJardim = {
      terreiro: { ...TERREIRO },
      tonel: { x: -hx + 1.2, z: -7.4 },
      tonelReserva: { x: tonelMenor.position.x, z: tonelMenor.position.z },
      oficina: { x: bancada.position.x, z: bancada.position.z },
      lojinha: { x: lojinha.position.x, z: lojinha.position.z },
      canteiros: CANTEIROS.map(({ x, z }) => ({ x, z })),
      /** um passo para DENTRO de cada portao */
      bocas: PORTOES.xs.map((x) => ({ x, z: CHEGADA })),
      /**
       * e um ponto do lado de FORA da sebe, alinhado com cada brecha: e de la
       * que o bicho deve aparecer. A corrente dele e brecha → caminho de pedra
       * → portao → estufa, e cada trecho e uma chance de interceptar.
       */
      entradas: PORTOES.xs.map((x) => ({ x, z: FUNDO_DE_FORA - 1.6 })),
      brechas: PORTOES.xs.map((x) => ({ x, z: FUNDO_DE_FORA, vao: 3.2 })),
      patio: {
        x: 0, z: -hz - FORA.profundidade / 2,
        largura: W, profundidade: FORA.profundidade,
      },
      portoes: PORTOES.xs.map((x) => ({ x, z: -hz, vao: PORTOES.vao })),
    };
  },
};
