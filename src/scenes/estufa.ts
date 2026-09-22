import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  arcoDeEstufa, bancadaDeJardinagem, bush, canteiroDeHorta, capim, folhagemAlta, planta,
  portaoDeJardim, prateleiraDeMudas, regador, sebe, tonelDeAgua, tree,
  trelicaComTrepadeira, vasoDePlanta,
} from '../world/props';
import { interiorDoor } from '../world/furniture';
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
const CANTEIROS = [
  { x: -10.2, z: 8.8, tipo: 'samambaia', giro: 0 },
  { x: -3.6, z: 8.8, tipo: 'lavanda', giro: 0 },
  { x: 3.6, z: 8.8, tipo: 'suculenta', giro: 0 },
  { x: 10.2, z: 8.8, tipo: 'alface', giro: 0 },
  { x: -12.4, z: 4.6, tipo: 'tomate', giro: Math.PI / 2 },
  { x: -12.4, z: 0.2, tipo: 'girassol', giro: Math.PI / 2 },
  { x: 12.4, z: 4.6, tipo: 'alface', giro: Math.PI / 2 },
  { x: 12.4, z: 0.2, tipo: 'tomate', giro: Math.PI / 2 },
] as const;

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
     * O gramado passa 3 m ALEM da sebe do fundo. Nao e sobra: e onde os bichos
     * nascem, do lado de fora, para entrarem pelas brechas andando — bicho que
     * aparece do nada dentro do patio nao da tempo de ser interceptado, que e
     * justamente a jogada que o patio existe para permitir.
     */
    w.ground({
      width: W, depth: FORA.profundidade + 3.6,
      z: -hz - FORA.profundidade / 2 - 1.2,
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

    w.door({
      x: PORTA.x, z: hz - 1.6,
      to: 'clube', entry: 'da-estufa',
      label: 'Voltar pro jardim', icon: '🚪',
      highlight: folha,
    });

    // ------------------------------------------------------------ os canteiros
    for (const { x, z, tipo, giro } of CANTEIROS) {
      // CRESCIMENTO 1,45: a mesma peca da horta de fora, com as mudas maiores.
      // E o que faz os dois lugares nao parecerem o mesmo canteiro copiado — e
      // e a fala da propria Josefina depois da quest ("adubo bom trabalha
      // rapido") virando geometria.
      w.add(w.place(canteiroDeHorta(tipo, 3.2, 1.6, ((x + z) / 7) % 1, 1.45), x, 0, z, giro));
      // o colisor acompanha o giro: nos dois deitados a caixa troca de eixo
      if (giro === 0) w.blockBox(x, z, 1.6, 0.8);
      else w.blockBox(x, z, 0.8, 1.6);
    }

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
    // muito antes de virar arma
    w.add(w.place(regador(), -hx + 1.5, 0, 8.2, 1.1));

    const tonel = w.add(w.place(tonelDeAgua(1.25), -hx + 1.2, 0, -7.4));
    w.blockCircle(-hx + 1.2, -7.4, 0.55);
    const tonelMenor = w.add(w.place(tonelDeAgua(0.95), -hx + 1.1, 0, -5.9));
    w.blockCircle(-hx + 1.1, -5.9, 0.42);

    // ------------------------------------ as mudas em vaso, na parede direita
    // Elas sobem parte das plantas do chao: um galpao com tudo na mesma altura
    // fica achatado na camera isometrica, e os vasos sao o que da relevo.
    const bancadaDois = w.add(w.place(bancadaDeJardinagem(2.4), hx - 1.1, 0, 7.6, -Math.PI / 2));
    w.blockBox(hx - 1.1, 7.6, 0.45, 1.2);
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
      // pula o vao da porta: passagem tem eixo, e o eixo fica vazio
      if (Math.abs(x - PORTA.x) < 1.6) continue;
      const s = (i * 0.37) % 1;
      w.add(w.place(
        i % 3 === 0 ? capim(1.5 + s * 0.5) : planta(i % 3 === 1 ? 'lavanda' : 'suculenta', 1.7 + s * 0.5, s),
        x, 0, hz - 0.85,
      ));
    }
    // as moitas entre os canteiros da frente, na altura do joelho: sao elas que
    // fecham os vaos e fazem o lado da porta parecer PLANTADO, e nao arrumado
    for (const [x, z, e] of [
      [-9.9, 8.4, 0.95], [-3.3, 9.0, 0.8], [3.3, 8.4, 0.9], [9.9, 9.0, 0.85],
      [-9.9, 6.6, 0.7], [-3.3, 6.4, 0.75], [3.3, 6.6, 0.7], [9.9, 6.4, 0.8],
    ] as const) {
      w.add(w.place(bush(e), x, 0, z, (x + z) % 1));
      w.blockCircle(x, z, 0.3 * e);
    }
    // e mais uma fileira de mudas crescidas fechando a frente dos canteiros
    for (let i = 0; i < 12; i++) {
      const x = -11.6 + i * 2.1;
      w.add(w.place(planta(i % 2 ? 'alface' : 'girassol', 1.5, (i * 0.23) % 1), x, 0, 7.5));
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

    // =========================================================== as conversas

    let jaOlhou = false;
    w.interact({
      id: 'estufa:bancada',
      x: -hx + 2.1, z: -4.6, radius: 1.8,
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
      x: -hx + 2.2, z: 4.4, radius: 1.8,
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
      x: 0, z: 0, radius: 2.2,
      label: 'Olhar o terreiro', icon: '👀',
      onInteract: async () => {
        await conversa([
          [R, 'Repara que o meio tá vazio. Tudo plantado na beirada, e o centro limpo.'],
          [A, 'Sobrou espaço ou foi de propósito?'],
          [R, 'Com ela? Foi de propósito. Só não sei ainda pra quê.'],
        ]);
      },
    });

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
      bancadaDeMudas: { x: bancadaDois.position.x, z: bancadaDois.position.z },
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
