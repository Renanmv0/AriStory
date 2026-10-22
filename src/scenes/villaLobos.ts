import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../palette';
import type { GameAPI, ItemDef, SceneDef } from '../core/types';
import { FerrisWheel } from '../world/ferrisWheel';
import { Cookie } from '../entities/bichos/Cookie';
import { lojaDeRoupas } from '../world/lojaDeRoupas';
import { fundir } from '../world/fundir';
import { mesaDeSorveteria, sorveteriaDoMano, SORVETERIA_DO_MANO } from '../world/sorveteriaDoMano';
import { Frisbee } from '../entities/Frisbee';
import { MESA_PING, PARCEIRO, PingPong, type Adversario } from '../entities/PingPong';
import {
  aroDeFrisbee, bin, bleachers, bonecoDeNeve, bordaDeGelo, building, bus, busStop, bush,
  cestaDeBiscoitos, cestaDePiquenique, flamula, mesinhaDeXadrez,
  canteiro, capim, cloud, cone, cristalDeGelo, discBag, discGolfBasket, domoDeVidro,
  fence, floodlight, flowers, iceCream, lamp, marcaDeMira, meioFio,
  comidinhasDePiquenique, mesaPingPong, picnicTable, portaRetrato, posteDeGelo,
  raquete, toalhaDePiquenique,
  rock, sacoDeGraos, scoreboard, signBoard, textSign, ticketBooth, tree, waterFountain, windsock,
  bolinhaPingPong, bordaDeTablado, caixote, cestoDeBolinhas, placarDePingPong,
  quadroDeInscricoes, suporteDeRaquetes,
  vasoDePlanta,
} from '../world/props';
import { ARI, RENAN } from '../characters/cast';
import { falarDoPremio } from '../world/falasDePremio';
import { ITENS } from '../world/itens';
import { asfalto, calcadaDePedrinha, tapeteDeGrama } from '../world/texturasDeChao';
import { geloDaPista, geloDetalhe, geloPorDentro, neveBatida } from '../world/texturasDeGelo';
import { Mano } from '../entities/bichos/Mano';
import { JeanLuc } from '../entities/bichos/JeanLuc';
import type { Bicho } from '../entities/bichos/Bicho';
import type { SomNome } from '../audio/efeitos';
import { INSCRITOS, retratoDoGrupo } from '../world/adversariosData';
import { CAMPEAO_DO_QUADRO } from '../ui/Ui';
import { flat } from '../core/materials';
import { Estella } from '../entities/bichos/Estella';
import { Estrella, Luna, Sol } from '../entities/bichos/CoelhaDaTorcida';
import {
  BARRACA, acenderBarraca, acenderVaral, arbustoFlorido, barracaIglu, canecaEsmaltada, canga, fecharPortaDaBarraca,
  fogareiroDeMontanha, folhasSecas, interiorDaBarraca, mesinhaDobravel, mochilaCargueira, panelinha,
  samambaias, troncoCaido, varalDeLuzinhas,
} from '../world/acampamento';
import { CozinhaDoFogareiro, ESCALA_DA_COZINHA, garfoComMiojo, miniArepa, type PratoDoFogareiro } from '../world/cozinhaDeAcampamento';
import { Radinho } from '../world/radinho';
import {
  TRAPICHE, TRONCO, alturaNoTrapiche, aguaDoLago, coloniaDeNinfeias, moedinha, Ninfeias, placaDoLago,
  seixosDaBeira, taboal, topoDoTronco, trapiche, troncoDoLago, type TufoDeTaboa,
} from '../world/lagoDoParque';
import { LOJA_DE_PATINS, lojaDePatins } from '../world/lojaDePatins';
import { Cardume, Libelulas } from '../world/vidaDoLago';
import { PATINHO, PATO_BRANCO, PATO_CREME, PatoDoLago } from '../entities/bichos/PatoDoLago';
import { Garca, type PontoDePesca } from '../entities/bichos/Garca';
import { TigreDagua, type LugarNoTronco } from '../entities/bichos/TigreDagua';
import { CARGA_CERTA, FAIXA_CERTA, PedrinhaQuicando } from '../entities/Pedrinha';
import { ARREMESSO, SOLTA_DO_ARREMESSO } from '../characters/CharacterRig';
import { GeloDoRinque, Vento } from '../core/shaders';
import { LuzesDosPostes } from '../world/mobiliarioDoParque';
import { BeiraDoCaminho, beiraTorta, caixaRedonda, capsula, cascalho, disco as largo, mancha, retanguloRedondo, ruidoLiso, uniaoSuave, type Distancia } from '../world/caminhos';
import { PoteDeVagaLumes, VagaLumesSoltos } from '../world/poteDeVagaLumes';
import {
  AURORA, CREPUSCULO, CeuDaClareira, MANHA_CEDO, NOITE, POR_DO_SOL, TARDE_DOURADA, VagaLumes, luzDoMomento,
  misturarMomentos, momentoDoDia, momentoEmBranco, momentoNaFila, type MomentoDoCeu,
} from '../world/noite';

/**
 * Parque Villa Lobos — o cenario grande, com a roda gigante ao fundo,
 * o campinho de frisbee e o lago.
 */
export const villaLobos: SceneDef = {
  id: 'villa-lobos',
  name: 'Parque Villa Lobos',
  subtitle: 'sábado de manhã, vento bom',
  ambient: {
    sky: P.skyDay,
    // a camera fica a 60 unidades do alvo: a nevoa so pode comecar depois disso
    fog: 0xbfe6f7,
    fogNear: 95,
    fogFar: 200,
    sunColor: 0xfff4da,
    sunIntensity: 1.7,
    ambientColor: 0xd8f0ff,
    ambientIntensity: 1.0,
    sunDir: [16, 22, 10],
  },
  spawn: { x: 0, z: 26, facing: Math.PI },
  entries: {
    portao: { x: 0, z: 26, facing: Math.PI },
    roda: { x: 0, z: -17, facing: 0 },
    // logo depois do vão, já de frente para o parque: descer do ônibus é ter o
    // caminho aberto, sem contornar o abrigo
    clube: { x: 32.4, z: 13, facing: Math.PI * 1.5 },
    // saindo da loja: um passo na calcada, de costas para a vitrine
    'da-lojinha': { x: -33.6, z: -16.5, facing: Math.PI / 2 },
  },

  build(w) {
    const g = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    /**
     * A loja de patins e a pista oval, no gramado entre o lago e a cúpula.
     *
     * A loja fica ao alcance de quem desce do caminho transversal (z ≈ 9) e
     * LONGE da areia do lago (raio 9,2 a partir de -21,11): a primeira tentativa
     * plantou o prédio com um canto dentro da praia. A pista ocupa os fundos
     * dela, no -Z, e para de sobra antes do caminho principal (x ≈ 0).
     */
    /**
     * A loja fica RETA (sem giro): com a fachada torta em relação ao gramado e
     * às calçadas, que são todos alinhados aos eixos, ela lê como um prédio
     * caído. E reta a colisão também fica simples de acertar.
     */
    const LOJA = { x: -8.6, z: 2.5 };
    /**
     * Oval: duas retas de `reta` para cada lado e uma calota de `raio` na ponta.
     *
     * Plantada no MEIO do gramado, e não encostada na praça da roda: a primeira
     * posição deixava a ponta a 8 unidades da cúpula, e de cima (a câmera olha
     * o -Z subindo para a direita) a pista parecia colada nela. Agora são 12.
     */
    const PISTA = { x: -21, z: -5, reta: 5, raio: 5, miolo: 2.4 };
    /**
     * O balcão do aluguel, colado no lado +X da loja.
     *
     * Os números saem de `LOJA_DE_PATINS` (a peça), e não são repetidos aqui:
     * na primeira loja eles eram copiados à mão, a caixa ficava a 5,9 do centro
     * com o balcão a 4,65, e dava para atravessar o móvel.
     */
    const BALCAO = { x: LOJA.x + LOJA_DE_PATINS.balcao.x, z: LOJA.z + LOJA_DE_PATINS.balcao.z };

    // A quadra de frisbee: fora dela o disco nem aparece na mão.
    const QUADRA = { x: 18, z: -4.5, largura: 26, profundidade: 19 };
    /* ================================================ A ARENA DE PING PONG
     *
     * A mesa estava SOLTA no gramado, meio de lado, a 11 do lago — parecia
     * largada ali, e nao montada. Agora ela e o centro de uma arena: um
     * tablado de madeira rente a grama, com banco, placar, suporte de
     * raquetes e o balde de bolinhas em volta.
     *
     * TRES DECISOES DE POSICAO, e nenhuma delas e gosto:
     *
     * 1. **O TAMPO FICOU PARALELO A GRADE DE BAIXO.** A grade do portao corre
     *    ao longo do X em `z = 28`, e a mesa entra com `giro = 0` — que e
     *    exatamente a direcao dela. Torta, a mesa lia como movel caido; e a
     *    mesma licao que a loja de patins e o quiosque do Mano ja tinham dado.
     * 2. **ELA SE AFASTOU DO LAGO**: de 11 para 14,8 do centro d'agua. O
     *    tablado inteiro fica fora da faixa de 11,4 onde mora a margem
     *    sorteada (junco, pedra, capim) — ver o filtro em `NA_ARENA`.
     * 3. **NADA ALTO NO LADO +Z.** A camera olha em 34° e esconde `1,5 · h`
     *    de chao na diagonal `(+X, +Z)` de cada peca. Tudo que passa de meio
     *    metro (banco, placar, suporte, postes) mora no lado -Z, ATRAS da
     *    mesa; na frente dela so ficam o balde e as bolinhas caidas.
     *
     * O tablado tem 10,4 × 6: da os 2,07 de cada lado onde a dupla fica de pe
     * para jogar (`MESA_PING.plano + 0,55`) e ainda sobra a faixa de tras para
     * o banco. E ele NAO E UM ESTRADO LEVANTADO — o piso e decalque rente a
     * grama, e so a moldura (`bordaDeTablado`, 11 cm) tem volume. O jogo nao
     * tem altura de caminhada: um deque de verdade poria a dupla andando no ar.
     */
    const ARENA = { x: -14.5, z: 24.2, largura: 10.4, profundidade: 6 };
    /** o retangulo do tablado, para o sorteio da margem do lago desviar dele */
    const NA_ARENA = (x: number, z: number, folga = 0.6): boolean =>
      Math.abs(x - ARENA.x) < ARENA.largura / 2 + folga &&
      Math.abs(z - ARENA.z) < ARENA.profundidade / 2 + folga;
    /** onde a mesa de ping pong mora, e para que lado o tampo aponta */
    const PING = { x: ARENA.x, z: 24.4, giro: 0 };
    const naQuadra = (x: number, z: number, margem = 0): boolean =>
      Math.abs(x - QUADRA.x) < QUADRA.largura / 2 - margem &&
      Math.abs(z - QUADRA.z) < QUADRA.profundidade / 2 - margem;

    // ------------------------------------------------------------- terreno
    // bem maior que a area jogavel: la de cima da roda gigante da para ver longe
    // A MESMA grama do clube, para os dois cenários serem o mesmo mundo. Já a
    // calçada é OUTRA textura de propósito: os dois são chão claro de área
    // pública, e o que separa um do outro é a escala da unidade — placa grande
    // de borda de piscina lá, pedrinha miúda de praça aqui.
    w.ground({ width: 240, depth: 240, color: P.grass, textura: tapeteDeGrama(9) });
    /** comprimento da rua do ponto de ônibus: o cenário todo, e mais um pouco */
    const RUA_COMP = 80;
    w.setBounds(-44, -34, 44, 32);

    // Ordem de empilhamento do chão. Cada decalque também recebe um
    // polygonOffset próprio do WorldBuilder, então a altura aqui é só folga.
    for (let i = 0; i < 14; i++) {
      w.disc(w.range(-40, 40), w.range(-30, 30), w.range(2, 6), P.grassDark, 0.004);
    }
    /*
     * OS CAMINHOS (world/caminhos.ts). Eram retângulos colados: a junção era
     * um "T" de quina viva e a beira com a grama era uma reta de esquadro.
     * Agora a rede inteira é UMA mancha, desenhada por uma conta de distância:
     * cada trecho é uma cápsula na mesma linha de antes (os bancos, os postes
     * e as interações não andam), e a união SUAVE abre cada junção numa curva
     * de ~2,4 m. Um ruído leve deixa a beira torta e a largura respirando, e
     * por fora corre o cascalho, com tufos de capim e pedrinhas soltas.
     *
     * A ordem de pintura: o cascalho, o asfalto, e só DEPOIS a praça — o disco
     * da praça entra na conta para a boca do caminho alargar na chegada, e a
     * pedrinha dela pinta por cima do resto.
     */
    const caminho = beiraTorta(uniaoSuave(2.4,
      capsula(0, -16.5, 0, 30.6, 2.75), // o principal, da praça ao largo do fim
      largo(0, -16.5, 8.0), // a praça
      largo(0, 31.2, 3.2), // o largo no fim do principal (era um corte a régua)
      capsula(LOJA.x + 1.6, 9, 30.4, 9, 2.25), // o transversal: da trilha da loja ao vão da cerca
      capsula(LOJA.x + 1.6, 4.6, LOJA.x + 1.6, 9, 1.5), // a trilha da loja
      caixaRedonda(28.8, 13, 4.8, 3, 0.8), // a boca do vão da cerca, para a rua
    ), 2610);
    const ruidoDaBeira = ruidoLiso(2611);
    const comCascalho: Distancia = (x, z) => caminho(x, z) - 0.3 - (ruidoDaBeira(x * 1.7, z * 1.7) - 0.5) * 0.24;
    const CAIXA_DOS_CAMINHOS = { x0: -10.5, z0: -25.5, x1: 35, z1: 35.5 };
    // o decalque de 1 × 1 dá o lugar na fila de pintura e a textura em metros
    const pintarCom = (decal: THREE.Mesh, geo: THREE.BufferGeometry): void => {
      decal.geometry.dispose();
      decal.geometry = geo;
    };
    pintarCom(w.patch(0, 0, 1, 1, P.beiraDoCaminho, 0, 0.01, cascalho()), mancha(comCascalho, CAIXA_DOS_CAMINHOS));
    pintarCom(w.patch(0, 0, 1, 1, P.asphalt, 0, 0.012, asfalto()), mancha(caminho, CAIXA_DOS_CAMINHOS));
    w.disc(0, -16.5, 8.6, P.sand, 0.014); // borda da praça
    w.disc(0, -16.5, 8, P.concrete, 0.016, calcadaDePedrinha()); // praça
    {
      // o capim e as pedrinhas da beira, fora da praça, das calçadas e do vão
      const ventoDaBeira = new Vento({ forca: 0.09, altura: 0.22, direcao: [0.86, 0.5] });
      const naCalcadaDaLoja = (x: number, z: number): boolean =>
        Math.abs(x - LOJA.x - 0.4) < 5.3 && Math.abs(z - LOJA.z - 0.2) < 3.5;
      const beira = new BeiraDoCaminho(caminho, CAIXA_DOS_CAMINHOS, ventoDaBeira, (x, z) =>
        Math.hypot(x, z + 16.5) > 9.1 && !naCalcadaDaLoja(x, z) && x < 31.6);
      w.add(beira.grupo);
      beira.grupo.userData.beira = { tufos: beira.tufos, pedrinhas: beira.pedrinhas };
      w.onUpdate((dt) => ventoDaBeira.tique(dt));
    }

    /**
     * A pista oval, composta à mão.
     *
     * O `WorldBuilder` não tem anel oval, e não precisa ter: a forma sai de um
     * retângulo com uma calota em cada ponta. Primeiro o asfalto inteiro, e por
     * cima a MESMA forma menor pintada de grama — é o miolo vazado que faz ler
     * como pista de corrida em vez de pátio.
     *
     * Cada `patch`/`disc` já recebe o seu próprio `polygonOffset` do
     * WorldBuilder; as alturas abaixo são a folga declarada por cima disso.
     */
    const oval = (raio: number, cor: number, altura: number, textura?: THREE.Texture): void => {
      w.patch(PISTA.x, PISTA.z, PISTA.reta * 2, raio * 2, cor, 0, altura, textura);
      w.disc(PISTA.x - PISTA.reta, PISTA.z, raio, cor, altura, textura);
      w.disc(PISTA.x + PISTA.reta, PISTA.z, raio, cor, altura, textura);
    };
    /**
     * As camadas, de baixo para cima. Cada faixa branca e' o oval de baixo
     * aparecendo por uma beirada: pinta-se branco e cobre-se o miolo com a cor
     * de cima, sobrando um anel de `FAIXA` de largura. Sai mais barato do que
     * desenhar dois aneis de verdade, e casa exatamente com a curva.
     */
    const FAIXA = 0.3;
    oval(PISTA.raio, P.metalWhite, 0.022); // borda externa
    // o asfalto da pista é o mesmo dos caminhos; as três peças do oval não
    // alinham o azulejo entre si, e não precisam: asfalto é grão solto, sem
    // junta nem fiada para denunciar a emenda
    oval(PISTA.raio - FAIXA, P.asphalt, 0.026, asfalto());
    oval(PISTA.miolo + FAIXA, P.metalWhite, 0.03); // borda interna
    oval(PISTA.miolo, P.grass, 0.034, tapeteDeGrama(9));

    /**
     * Tracejado do meio da raia, como risco de rua.
     *
     * Nas retas os traços são paralelos ao eixo X; nas curvas eles giram junto
     * com a tangente. Um retângulo deitado tem o lado maior no X local, e girar
     * em Y por `-(ângulo + 90°)` é o que alinha esse lado com a tangente do
     * círculo — sem isso os traços da curva apontam para o centro.
     */
    const rMeio = (PISTA.raio + PISTA.miolo) / 2;
    const TRACO: [number, number] = [1.15, 0.17];
    for (const lado of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        const x = PISTA.x - PISTA.reta + 1 + (i * (PISTA.reta * 2 - 2)) / 4;
        w.patch(x, PISTA.z + lado * rMeio, TRACO[0], TRACO[1], P.metalWhite, 0, 0.038);
      }
      const cx = PISTA.x + lado * PISTA.reta;
      for (let i = 0; i < 6; i++) {
        const meia = -Math.PI / 2 + ((i + 0.5) / 6) * Math.PI;
        const ang = lado > 0 ? meia : meia + Math.PI;
        w.patch(
          cx + Math.cos(ang) * rMeio,
          PISTA.z + Math.sin(ang) * rMeio,
          TRACO[0], TRACO[1], P.metalWhite,
          -(ang + Math.PI / 2), 0.038,
        );
      }
    }

    // linha de largada, atravessando a raia da frente
    w.patch(PISTA.x + PISTA.reta * 0.55, PISTA.z + rMeio,
      0.32, PISTA.raio - PISTA.miolo - FAIXA * 2, P.metalWhite, 0, 0.04);

    // calçada da loja e a trilha que sobe até o caminho transversal
    // colada no prédio de propósito: mais larga que isto e o canto de cima
    // invade a areia do lago, que chega a 9,2 do centro em (-21, 11)
    // (de quina redonda; a trilha até o transversal agora é parte dos caminhos)
    pintarCom(w.patch(LOJA.x + 0.4, LOJA.z + 0.2, 1, 1, P.concrete, 0, 0.02, calcadaDePedrinha()), retanguloRedondo(5, 3.2, 1.1));

    // ---------------------------------------------------------- roda gigante
    const wheel = new FerrisWheel({ radius: 12, cabins: 32, rpm: 1.0 });
    w.place(wheel.group, 0, 0, -26);
    w.add(wheel.group);
    w.blockCircle(0, -26, 7.2);

    /*
     * Tapume e domo geodésico da praça da roda, como na foto.
     *
     * SÓ O DA ESQUERDA. O de `x = 11` passava rente ao fundo da bilheteria e
     * cortava a cabine ao meio na câmera de 34° — e é justamente por ali que
     * agora corre o corredor calçado até o campinho de frisbee. Do lado de lá
     * ele continua: é o que fecha a praça contra o mato.
     */
    w.add(w.place(fence(9, 1.2, P.metalWhite), -11, 0, -20, Math.PI / 2));
    w.blockBox(-11, -20, 0.2, 4.5);
    // a cúpula virou peça do kit: estrutura completa (meridianos, paralelos,
    // pilares por dentro) mora em props.ts, a cena só posiciona
    w.add(w.place(domoDeVidro(2.6), -9.5, 0, -21, 0.4));
    w.blockCircle(-9.5, -21, 2.7);

    /*
     * ===================================== A BILHETERIA, E O CORREDOR ATÉ ELA
     *
     * PARALELA À RODA: o aro gira no plano XY, então a roda é uma parede
     * virada para ±Z. A cabine sem giro nenhum (`rotY = 0`, fachada para +Z)
     * fica exatamente no mesmo alinhamento — as duas se olham do mesmo jeito, e
     * quem chega pelo caminho principal vê a fachada inteira em vez de uma
     * quina. Era o giro de −0,5 rad da versão de quiosque que quebrava isso.
     *
     * ONDE: `x = 10,6`, fora do disco de pedrinha da praça (raio 8) e fora do
     * caminho de quem vai para a roda. O tapume que passava aqui saiu.
     *
     * O CORREDOR é o vão entre a fachada dela (`z = −19,5`) e a borda do
     * campinho de frisbee (`z = −14`): 5,5 de passagem calçada, a mesma largura
     * do caminho principal do parque. Ele encosta na praça de um lado e no
     * campo do outro, então dá para ir da roda ao frisbee sem pisar na grama.
     */
    const BILHETERIA = { x: 10.6, z: -20.4 };
    pintarCom(w.patch(BILHETERIA.x, -16.9, 1, 1, P.concrete, 0, 0.018, calcadaDePedrinha()), retanguloRedondo(3.2, 3.3, 1.0));
    const bilheteria = w.add(w.place(ticketBooth(), BILHETERIA.x, 0, BILHETERIA.z));
    w.blockBox(BILHETERIA.x, BILHETERIA.z, 1.53, 1.08);

    /**
     * O COOKIE, o elefante da bilheteria.
     *
     * AO LADO DA CABINE, e nao na frente: a janela de atendimento fica em
     * `x = 9,6…11,6`, e ele tem 1,2 de largura — plantado na frente dela, ele
     * seria a bilheteria. Aqui ele fica encostado na parede lateral de `+X`,
     * fora do vao da janela e fora do corredor que leva ao campinho.
     *
     * A AREA E MENOR QUE O PASSO MINIMO do cerebro (0,7), entao por enquanto
     * ele fica no lugar — e a mesma coleira da Gina na portaria. A patrulha
     * dele entra depois, quando o Renan aprovar a conta da caminhada.
     */
    /**
     * QUEM ESTÁ NA MESA DE PING PONG AGORA.
     *
     * Mora aqui em cima porque três blocos bem distantes precisam dele: o
     * passeio do Cookie, o do Mano e o da Estella. Cada um desses bichos tem
     * um `onUpdate` que o empurra de volta para o posto (o Cookie patrulha, os
     * outros dois viram para a rua quando ninguém está perto) — e sem esta
     * trava o adversário convidado sairia andando da arena no meio da partida,
     * puxado pelo próprio passeio.
     */
    const naMesaDePing = { quem: null as string | null, festa: false };
    /**
     * ESTE BICHO ESTÁ DE SERVIÇO AGORA?
     *
     * Duas coisas tiram um bicho do passeio dele: ser chamado para a mesa de
     * ping pong (um por vez) e a festa do Prêmio do Campeão (os quatro ao
     * mesmo tempo). Os `onUpdate` de cada um consultam ISTO, e não a partida
     * diretamente — foi a festa que cobrou: com o guarda olhando só a mesa, a
     * patrulha do Cookie assumia no meio da caminhada e o levava de volta para
     * a bilheteria. A promessa do `irPara` dele nunca resolvia, e a cutscene
     * inteira ficava pendurada com a dupla travada.
     */
    const deServico = (id: string): boolean => naMesaDePing.festa || naMesaDePing.quem === id;

    const COOKIE = { x: 13.5, z: -20.6 };
    /**
     * A PATRULHA: um vaivem curto pelo eixo Z, rente a parede lateral da
     * cabine. Pelo Z e nao pelo X porque o X passa na frente da janela de
     * atendimento (`9,6…11,6`), e ele tem 1,84 de largura com as orelhas.
     *
     * 2,4 de trecho a 0,42 de velocidade = 5,7 s por perna, mais a pausa da
     * ponta: um ciclo de uns 16 s.
     */
    const COOKIE_A = { x: COOKIE.x, z: -21.4 };
    const COOKIE_B = { x: COOKIE.x, z: -19.0 };
    const cookie = new Cookie({
      minX: COOKIE.x - 0.12, maxX: COOKIE.x + 0.12,
      minZ: COOKIE.z - 0.1, maxZ: COOKIE.z + 0.1,
    });
    cookie.group.rotation.y = 0;
    w.add(cookie.group);
    /*
     * ELE ANDA POR ORDEM DA CENA, e nao pelo passeio do cerebro. A area dele e
     * a coleira de sempre (menor que o passo minimo), entao o cerebro nunca
     * sorteia nada; quem manda e este laco.
     *
     * E o vaivem usa `seguir()`, e nao `irPara()`: `irPara` devolve uma
     * promessa por chamada, e interromper a caminhada para conversar deixaria
     * essa promessa pendurada para sempre — o laco travaria na primeira
     * conversa. `seguir` nao promete nada: chegar so limpa a missao.
     *
     * POR QUE NAO `Math.sin` NA POSICAO: o `x`/`z` sairia certo, mas o flag
     * `andando` (que e o que mexe as PERNAS) nasce dentro do cerebro. Escrito
     * de fora, o motor acha que ele esta parado e o Cookie desliza pelo chao
     * como estatua em trilho. E o retorno de 180° sairia em estalo, enquanto o
     * `passo()` da base ja interpola pelo lado curto — 0,45 s de meia-volta.
     */
    cookie.entrarEmServico();
    let cookieVaiPraFrente = true;
    let cookieEsperando = 0;
    let cookieConversando = false;
    w.onUpdate((dt, tempo) => {
      cookie.update(dt);
      pedirBilhete.moveTo(cookie.x, cookie.z);
      if (cookieConversando) return; // parado, olhando para quem chegou
      if (deServico('cookie')) return; // ele está jogando, na arena

      const alvo = cookieVaiPraFrente ? COOKIE_B : COOKIE_A;
      if (Math.hypot(alvo.x - cookie.x, alvo.z - cookie.z) < 0.12) {
        // a pausa da ponta varia com o relogio da cena: nao e sorteio (que
        // mexeria na sequencia semeada do mundo), mas tambem nao e metronomo
        if (cookieEsperando <= 0) cookieEsperando = 1.2 + (Math.sin(tempo * 0.7) + 1) * 0.6;
        cookieEsperando -= dt;
        if (cookieEsperando <= 0) {
          cookieVaiPraFrente = !cookieVaiPraFrente;
          cookieEsperando = 0;
        }
        return;
      }
      cookie.seguir(alvo.x, alvo.z, 0.42);
    });

    // ------------------------------------------- entorno da roda gigante
    // Tudo aqui é posicionado na mão de propósito: o espalhador de vegetação
    // (`livre()`, mais abaixo) proíbe 20 unidades em volta da roda, para não
    // nascer árvore no meio da praça. Sem isto a praça fica um prato de
    // concreto com a roda em cima.
    /*
     * OS DOIS DO LADO DA BILHETERIA SAÍRAM: (6,4; −13,6) e (8,6; −17,4).
     * Os dois pousavam na pedrinha, um na boca da praça e o outro bem na
     * frente do guichê — canteiro de 1 de raio COM COLISOR no meio da
     * passagem. Os dois do lado de lá ficam: aquele lado não tem cabine nem
     * corredor, e sem nenhum canteiro a praça vira um prato de concreto.
     */
    const canteirosPraca: Array<[number, number, number]> = [
      [-6.4, -13.6, 1.15], [-8.6, -17.4, 0.95],
    ];
    for (const [x, z, r] of canteirosPraca) {
      w.add(w.place(canteiro(r, undefined, w.rng()), x, 0, z, w.range(0, 6.28)));
      w.blockCircle(x, z, r + 0.1);
    }

    /*
    /*
     * O POSTE DE (12,2; −19) VIROU (7; −14,5): a 2,1 da bilheteria ele subia
     * bem no meio da fachada e cortava o letreiro em duas. E o que decide não é
     * a distância, é o DESVIO da diagonal da câmera — `(x − z)/√2`: em
     * (12,2; −19) ele desviava só 0,7 da bilheteria, ou seja, estava na linha
     * de visada dela. Daqui ele desvia 6,7, ilumina a boca do corredor, e a
     * fachada fica limpa.
     */
    for (const [x, z] of [[-7.6, -11.4], [7.6, -11.4], [-12.2, -19], [7, -14.5]] as const) {
      w.add(w.place(lamp(false), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }
    /*
     * A LUZ DE VERDADE DOS POSTES (world/mobiliarioDoParque.ts): quatro
     * `PointLight` que vão para os postes mais perto da dupla — o parque
     * inteiro, e não só estes quatro (ela acha os postes na primeira
     * atualização, depois de a cena toda montada). A noite da clareira sobe
     * a força (`luzesDosPostes.noite`, em `pintarMomento`).
     */
    const luzesDosPostes = new LuzesDosPostes(w.root);
    w.add(luzesDosPostes.grupo);
    luzesDosPostes.grupo.userData.luzes = luzesDosPostes;
    w.onUpdate((dt) => luzesDosPostes.update(dt, w.game.playerPosition()));

    for (const [x, z, r] of [[-3.6, -12.2, 0.1], [3.6, -12.2, -0.1], [-13.2, -22.5, 1.1]] as const) {
      w.banco(x, z, r);
    }

    for (const [x, z] of [[6.9, -18.9], [-5.2, -11.6]] as const) {
      w.add(w.place(bin(), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    // mato e pedra rente à praça, para a clareira não terminar numa linha reta
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + w.range(-0.1, 0.1);
      const d = w.range(10.5, 13.5);
      const x = Math.cos(a) * d;
      const z = -18 + Math.sin(a) * d * 0.7;
      if (Math.abs(x) < 4.5 && z > -14) continue; // deixa o caminho principal livre
      // sorteada sempre do mesmo jeito; a que cai na boca alargada do caminho
      // só não entra no mundo (pular o sorteio mexeria no parque inteiro)
      const peca = i % 3 === 0 ? w.place(bush(w.range(0.6, 1), P.leafDark), x, 0, z)
        : i % 3 === 1 ? w.place(capim(w.range(0.9, 1.4)), x, 0, z, w.range(0, 6.28))
          : w.place(rock(w.range(0.4, 0.8), w.rng()), x, 0, z, w.range(0, 6.28));
      if (caminho(x, z) > 0.4) w.add(peca);
    }

    /* ============================================================== O LAGO
     *
     * Uma das primeiras coisas do parque, e a que nunca tinha sido mexida: dois
     * discos, três patos parados, quatro juncos e seis vitórias-régias. Agora
     * (pedido do Renan: "mais vivo e com uma nova cara") ele é:
     *
     *  - **a água** num shader só (`AguaDoLago`), com a margem torta, os
     *    degraus de fundura, as marolinhas do vento, o brilho do sol, a espuma
     *    em volta de tudo que fura a água, as sombras do cardume, o V atrás de
     *    quem nada e as marolas de tudo que toca nela;
     *  - **o trapiche** que entra no lago, com a placa de proibido nadar;
     *  - **a beira**: seixos, ninféias em flor e o taboal balançando no vento;
     *  - **os bichos**: os patos (e a pata com a fila de patinhos), a garça que
     *    pesca no raso e voa quando a dupla chega, os tigres-d'água no tronco,
     *    as libélulas e o peixe que pula;
     *  - **as brincadeiras**: quicar pedrinha (segurar F na beira), sentar na
     *    ponta do trapiche com o pé na água, jogar a moedinha do desejo e, no
     *    computador, tocar a água com o mouse.
     *
     * O SORTEIO DO PARQUE NÃO MEXE: a margem de arbustos e os quatro juncos
     * antigos consumiam `w.range()` aqui, e eles continuam consumindo do mesmo
     * jeito e na mesma ordem (os juncos viraram a altura de quatro tufos do
     * taboal) — senão toda árvore sorteada depois mudaria de lugar.
     */
    const NO_LAGO = { x: -21, z: 11 };
    const agua = aguaDoLago();
    // o disco entra na fila de pintura do chão no lugar do de areia de antes;
    // quem pinta areia, água e margem é o material da água
    const lagoMalha = w.disc(NO_LAGO.x, NO_LAGO.z, agua.raioDaMalha, P.water, 0.024);
    lagoMalha.material = agua.material;
    lagoMalha.name = 'agua-do-lago';

    // ------------------------------------------------------------ o trapiche
    /*
     * Ele entra na água pela beira de `+X/+Z` (a 25° do centro), que é o lado
     * de onde a câmera olha: a dupla sentada na ponta aparece de costas, de
     * frente para o lago inteiro — e longe do caminho do Jean-Luc (que emerge
     * a 67°) e do "Olhar o lago" (a 0°).
     */
    const ANGULO_DO_TRAPICHE = 0.436;
    const pontaDeTerra = agua.naBeira(ANGULO_DO_TRAPICHE, -1.45);
    const GIRO_DO_TRAPICHE = Math.atan2(-Math.cos(ANGULO_DO_TRAPICHE), -Math.sin(ANGULO_DO_TRAPICHE));
    const cosT = Math.cos(GIRO_DO_TRAPICHE);
    const senT = Math.sin(GIRO_DO_TRAPICHE);
    /** um ponto do referencial do trapiche (a terra no zero, a ponta em `+Z`) levado ao mundo */
    const doTrapiche = (lx: number, lz: number): { x: number; z: number } => ({
      x: pontaDeTerra.x + lx * cosT + lz * senT,
      z: pontaDeTerra.z - lx * senT + lz * cosT,
    });
    /** e o contrário: onde (x, z) cai no referencial do trapiche */
    const noTrapiche = (x: number, z: number): { x: number; z: number } => {
      const dx = x - pontaDeTerra.x;
      const dz = z - pontaDeTerra.z;
      return { x: dx * cosT - dz * senT, z: dx * senT + dz * cosT };
    };
    /** a faixa do trapiche (com folga): nada de pedra, junco ou ninféia em cima */
    const naFaixaDoTrapiche = (x: number, z: number, folga = 0.4): boolean => {
      const l = noTrapiche(x, z);
      return Math.abs(l.x) < TRAPICHE.largura / 2 + folga && l.z > -folga - 0.6 && l.z < TRAPICHE.comprimento + folga;
    };
    const deque = w.add(w.place(trapiche(), pontaDeTerra.x, 0, pontaDeTerra.z, GIRO_DO_TRAPICHE));
    // a altura das tábuas sob os pés de cada um (a rampinha e o deque)
    g.relevo((x, z) => {
      const l = noTrapiche(x, z);
      if (Math.abs(l.x) > TRAPICHE.largura / 2 + 0.05 || l.z < -0.1 || l.z > TRAPICHE.comprimento + 0.1) return 0;
      return alturaNoTrapiche(l.z);
    });

    /*
     * A ÁGUA NÃO SE PISA, E A BEIRA É TORTA: no lugar do círculo de colisão de
     * antes, um anel de 72 círculos seguindo a margem (a borda de fora deles
     * 30 cm além da água: o pé para na areia molhada). O anel é aberto onde
     * passa o trapiche, e o trapiche é cercado pelos dois lados e na ponta —
     * dá para andar até o fim dele, e só.
     */
    for (let i = 0; i < 72; i++) {
      const c = agua.naBeira((i / 72) * Math.PI * 2, 0.6);
      const l = noTrapiche(c.x, c.z);
      if (Math.abs(l.x) < 2.25 && l.z > -1 && l.z < TRAPICHE.comprimento + 1.2) continue;
      w.blockCircle(c.x, c.z, 0.9);
    }
    {
      const INICIO = 0.95;
      const meio = doTrapiche(0, (INICIO + TRAPICHE.comprimento) / 2);
      const metade = (TRAPICHE.comprimento - INICIO) / 2 + 0.06;
      for (const s of [-1, 1]) {
        const lado = doTrapiche(s * (TRAPICHE.largura / 2 + 0.06), (INICIO + TRAPICHE.comprimento) / 2);
        // o giro do colisor tem o sinal contrário ao do `rotation.y` (`world/collision.ts`)
        w.blockBox(lado.x, lado.z, 0.06, metade, -GIRO_DO_TRAPICHE);
      }
      void meio;
      /*
       * OS DOIS LADOS DA RAIZ DO TRAPICHE: o anel foi aberto numa faixa larga
       * (os círculos dele têm 0,9 de raio, e os que sobram não podem invadir
       * as tábuas), e entre a cerca e o primeiro círculo de cada lado sobrava
       * um corredor de água — dava para descer ao lado do trapiche e sair
       * andando no lago. Uma caixa de cada lado tapa esse vão em toda a
       * largura do anel. `scripts/lago.mjs` varre a beira inteira atrás de
       * ponto pisável.
       */
      for (const s of [-1, 1]) {
        const vao = doTrapiche(s * 1.85, 2.3);
        w.blockBox(vao.x, vao.z, 0.85, 1.35, -GIRO_DO_TRAPICHE);
      }
      const fim = doTrapiche(0, TRAPICHE.comprimento + 0.06);
      w.blockBox(fim.x, fim.z, TRAPICHE.largura / 2 + 0.12, 0.06, -GIRO_DO_TRAPICHE);
    }

    // a placa de proibido nadar, na entrada do trapiche, virada para quem chega
    const ONDE_DA_PLACA = doTrapiche(TRAPICHE.largura / 2 + 0.55, -0.15);
    const placa = w.add(w.place(placaDoLago(), ONDE_DA_PLACA.x, 0, ONDE_DA_PLACA.z, GIRO_DO_TRAPICHE + Math.PI));
    w.blockCircle(ONDE_DA_PLACA.x, ONDE_DA_PLACA.z, 0.18);

    // Margem: o anel regular de arbustos de antes lia como cerca viva plantada
    // por régua. Agora é sorteio na faixa da beira, misturando pedra de tamanhos
    // bem diferentes, capim e arbusto — e a distância varia, então a silhueta
    // da margem deixa de ser um círculo perfeito.
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * Math.PI * 2 + w.range(-0.09, 0.09);
      const d = w.range(9.1, 11.4);
      const x = NO_LAGO.x + Math.cos(a) * d;
      const z = NO_LAGO.z + Math.sin(a) * d;
      // a faixa da margem chega a 11,4 do centro d'agua, e a quina -X/-Z do
      // tablado esta a 10,3: sem este desvio o sorteio planta junco em cima da
      // madeira da arena de ping pong
      if (NA_ARENA(x, z, 1)) continue;
      const sorte = i % 4;
      // a peça é sorteada SEMPRE (o sorteio do parque não pode andar); a que
      // cai na entrada do trapiche só não entra no mundo
      const peca = sorte === 0 ? w.place(bush(w.range(0.6, 1), P.leafDark), x, 0, z)
        : sorte === 1 ? w.place(capim(w.range(0.9, 1.5)), x, 0, z, w.range(0, 6.28))
          : sorte === 2 ? w.place(rock(w.range(0.45, 1.5), w.rng()), x, 0, z, w.range(0, 6.28))
            : w.place(flowers(5, 0.8), x, 0, z);
      if (!naFaixaDoTrapiche(x, z, 0.9)) w.add(peca);
    }

    // pedras grandes meio dentro d'água, que é o que dá profundidade à borda —
    // agora sentadas na margem torta, metade na água e metade na areia
    const PEDRAS_DO_LAGO: Array<[number, number, number]> = [];
    for (const [a, esc] of [[0.9, 1.6], [2.6, 1.1], [4.3, 1.9], [5.6, 1.2]] as const) {
      const { x, z } = agua.naBeira(a, 0.05);
      w.add(w.place(rock(esc, (a % 1), 0x8f959b), x, -0.12, z, a));
      w.blockCircle(x, z, 0.4 * esc);
      PEDRAS_DO_LAGO.push([x, z, 0.42 * esc]);
    }

    // os juncos antigos eram estes quatro sorteios de altura: viraram quatro
    // tufos do taboal (e o sorteio do parque segue igual)
    const alturasDosJuncos = [0, 1, 2, 3].map(() => w.range(1.1, 1.6));
    montarOLago();

    /**
     * A BEIRA, OS BICHOS E AS BRINCADEIRAS DO LAGO. Nada daqui sorteia com o
     * `w.range()` do parque: cada coisa tem a semente dela.
     */
    function montarOLago(): void {
      const C = NO_LAGO;
      const cabeNaAgua = (x: number, z: number, fundo = 0.6): boolean => agua.fundura(x, z) > fundo && !naFaixaDoTrapiche(x, z);

      // -------------------------------------------------------------- seixos
      w.add(seixosDaBeira(agua, 170, (x, z) => !naFaixaDoTrapiche(x, z, 0.3)));

      // ------------------------------------------------------------ o tronco
      // caído da beira de -X/-Z para dentro d'água: é onde os tigres-d'água
      // tomam sol, longe do trapiche e à vista de quem está nele
      const ANG_DO_TRONCO = 3.95;
      const raizDoTronco = agua.naBeira(ANG_DO_TRONCO, -0.45);
      const giroDoTronco = Math.atan2(C.x - raizDoTronco.x, C.z - raizDoTronco.z) + 0.35;
      const tronco = w.add(w.place(troncoDoLago(), raizDoTronco.x, 0, raizDoTronco.z, giroDoTronco));
      const doTronco = (lx: number, lz: number): { x: number; z: number } => ({
        x: raizDoTronco.x + lx * Math.cos(giroDoTronco) + lz * Math.sin(giroDoTronco),
        z: raizDoTronco.z - lx * Math.sin(giroDoTronco) + lz * Math.cos(giroDoTronco),
      });
      const meioDoTronco = doTronco(0, TRONCO.comprimento * 0.55);
      w.blockCircle(doTronco(0, 0.3).x, doTronco(0, 0.3).z, 0.3);

      // ---------------------------------------------------------- ninféias
      const colonias: Array<[number, number, number, number, number]> = [
        // ângulo, recuo da beira, raio, quantas, semente
        [1.92, 1.7, 1.35, 14, 101],
        [3.4, 1.9, 1.7, 18, 202],
        [5.24, 1.4, 1.25, 12, 303],
      ];
      const PONTO_DO_JEAN_LUC = { x: -18.4, z: 17.2 };
      const cabeNinfeia = (x: number, z: number): boolean => cabeNaAgua(x, z, 0.55)
        && Math.hypot(x - PONTO_DO_JEAN_LUC.x, z - PONTO_DO_JEAN_LUC.z) > 1.3
        && Math.hypot(x - meioDoTronco.x, z - meioDoTronco.z) > 1.6;
      const folhasDeNinfeia = colonias.flatMap(([a, recuo, raio, n, semente]) => {
        const c = agua.naBeira(a, recuo);
        return coloniaDeNinfeias(c.x, c.z, raio, n, semente, cabeNinfeia);
      });
      // e umas soltas pelo lago
      folhasDeNinfeia.push(...coloniaDeNinfeias(C.x, C.z, 5.6, 7, 404, cabeNinfeia));
      const ninfeias = new Ninfeias(folhasDeNinfeia);
      w.add(ninfeias.grupo);

      // ------------------------------------------------------------ o taboal
      const ventoDoLago = new Vento({ forca: 0.1, altura: 1, direcao: [0.86, 0.5] });
      const TUFOS: Array<[number, number, number, number, number]> = [
        // ângulo, raio do tufo, folhas, altura, espigas
        [2.45, 0.75, 42, alturasDosJuncos[0], 4],
        [3.05, 0.55, 30, 1.2, 2],
        [4.75, 0.7, 38, alturasDosJuncos[1], 3],
        [5.75, 0.5, 26, 1.05, 2],
        [1.2, 0.6, 32, alturasDosJuncos[2], 3],
        [0.12, 0.55, 28, alturasDosJuncos[3], 2],
        [0.72, 0.45, 22, 1.0, 1],
      ];
      const tufos: TufoDeTaboa[] = TUFOS.map(([a, raio, folhas, altura, espigas]) => {
        const c = agua.naBeira(a, 0.12);
        return { x: c.x, z: c.z, raio, folhas, altura, espigas };
      }).filter((t) => !naFaixaDoTrapiche(t.x, t.z, 0.8));
      w.add(taboal(tufos, ventoDoLago));

      // as coisas que furam a água ganham o colar de espuma
      const estacas: Array<[number, number, number]> = [];
      {
        const z0 = TRAPICHE.rampa + 0.3;
        const fileiras: number[] = [];
        for (let z = z0; z < TRAPICHE.comprimento - 0.5; z += 1.3) fileiras.push(z);
        fileiras.push(TRAPICHE.comprimento - 0.1);
        for (const lz of fileiras) {
          for (const s of [-1, 1]) {
            const p = doTrapiche(s * (TRAPICHE.largura / 2 + 0.04), lz);
            if (agua.fundura(p.x, p.z) > 0) estacas.push([p.x, p.z, 0.09]);
          }
        }
      }
      estacas.push(...PEDRAS_DO_LAGO);
      for (const t of tufos) estacas.push([t.x, t.z, t.raio * 0.75]);
      for (const k of [0.45, 0.7, 0.95]) {
        const p = doTronco(0, TRONCO.comprimento * k);
        if (agua.fundura(p.x, p.z) > 0) estacas.push([p.x, p.z, TRONCO.raio * 1.05]);
      }
      agua.furos(estacas.slice(0, 20));
      // o fundo cheio de moeda, em volta da ponta do trapiche
      const pontaNaAgua = doTrapiche(0, TRAPICHE.comprimento + 0.6);
      agua.moedas(pontaNaAgua.x, pontaNaAgua.z, 2.2);

      // ------------------------------------------------------------- os patos
      const proibidoAosPatos = [
        ...colonias.map(([a, recuo, raio]) => ({ ...agua.naBeira(a, recuo), r: raio * 0.55 })),
        { x: meioDoTronco.x, z: meioDoTronco.z, r: 1.5 },
      ];
      const areaDosPatos = {
        minX: C.x - 7, maxX: C.x + 7, minZ: C.z - 7, maxZ: C.z + 7,
        proibido: proibidoAosPatos,
        dentro: (x: number, z: number) => agua.fundura(x, z) > 1.1 && !naFaixaDoTrapiche(x, z, 0.9),
      };
      const nascerEm = (pato: PatoDoLago, a: number, recuo: number): PatoDoLago => {
        const p = agua.naBeira(a, recuo);
        pato.group.position.set(p.x, 0, p.z);
        pato.group.rotation.y = a + Math.PI / 2;
        return pato;
      };
      const patoSozinho = nascerEm(new PatoDoLago({ ...areaDosPatos }, { ...PATO_BRANCO, semente: 11 }), 5.3, 3.2);
      const patoCreme = nascerEm(new PatoDoLago({ ...areaDosPatos }, { ...PATO_CREME, semente: 23 }), 2.8, 3.1);
      const mae = nascerEm(new PatoDoLago({ ...areaDosPatos }, { ...PATO_BRANCO, semente: 37 }), 0.9, 3.4);
      const patinhos = [51, 52, 53, 54].map((semente, i) => {
        const filhote = new PatoDoLago({ ...areaDosPatos }, { ...PATINHO, semente });
        filhote.entrarEmServico();
        filhote.group.position.set(mae.x - 0.4 * (i + 1), 0, mae.z - 0.2 * (i + 1));
        return filhote;
      });
      const adultos = [patoSozinho, patoCreme, mae];
      const todosOsPatos = [...adultos, ...patinhos];
      for (const pato of todosOsPatos) {
        w.add(pato.group);
        const filhote = pato.escala < 0.6;
        pato.aoSoar = () => g.som(filhote ? 'piado' : 'pato');
        pato.aoTocarAAgua = (forca) => {
          const frente = 0.22 * pato.escala;
          const x = pato.x + Math.sin(pato.group.rotation.y) * frente;
          const z = pato.z + Math.cos(pato.group.rotation.y) * frente;
          agua.marola(x, z, forca * (filhote ? 0.4 : 0.75));
          ninfeias.balancar(x, z, forca * 0.6, 1.2);
        };
      }

      // ------------------------------------------------------------ a garça
      // nos vãos da beira: longe das ninféias, do taboal, das pedras e do tronco
      const PONTOS_DE_PESCA: PontoDePesca[] = [4.62, 6.05, 2.2].map((a) => {
        const p = agua.naBeira(a, 0.45);
        return { ...p, olhando: Math.atan2(C.x - p.x, C.z - p.z) + 0.5 };
      });
      const garca = new Garca(PONTOS_DE_PESCA[0]);
      w.add(garca.group);
      garca.aoBicar = (x, z) => {
        agua.marola(x, z, 0.55);
        cardume.atrair(x, z, 1.2);
      };
      garca.aoVoar = () => {
        g.som('garca');
        g.som('asas');
        agua.marola(garca.x, garca.z, 1);
      };
      garca.aoPousar = (x, z) => agua.marola(x, z, 0.8);
      let garcaDescansa = 75;

      // ---------------------------------------------------- os tigres-d'água
      const voltaDosTigres = doTronco(0.9, TRONCO.comprimento + 1.2);
      const tigres = [[0.03, 0.8, 0.9], [-0.02, 1.45, -0.7], [0.02, 2.05, 1.2]].map(([lx, lz, vira], i) => {
        const p = doTronco(lx, lz);
        const lugar: LugarNoTronco = { x: p.x, y: topoDoTronco() - 0.012, z: p.z, olhando: giroDoTronco + vira };
        return new TigreDagua(lugar, voltaDosTigres, 7 + i * 13);
      });
      for (const t of tigres) {
        w.add(t.group);
        t.aoCair = (x, z) => {
          g.som('ploc');
          agua.marola(x, z, 0.7);
          cardume.respingar(x, z, 4);
        };
      }

      // ---------------------------------------------- libélulas e o cardume
      const libelulas = new Libelulas(tufos.slice(0, 4).map((t) => ({ x: t.x, z: t.z })), agua);
      w.add(libelulas.grupo);
      libelulas.aoMolhar = (x, z) => agua.marola(x, z, 0.35);
      const cardume = new Cardume(agua, 6);
      w.add(cardume.grupo);
      cardume.podePularEm = (x, z) => !naFaixaDoTrapiche(x, z, 1.2);
      cardume.aoPular = (x, z, saindo) => {
        g.som('peixePula');
        agua.marola(x, z, saindo ? 0.9 : 1.1);
        ninfeias.balancar(x, z, 0.8, 1.4);
        for (const pato of adultos) if (Math.hypot(pato.x - x, pato.z - z) < 1.4) pato.fazer('olhar');
      };

      // --------------------------------------------------- a pedrinha
      const minhaPedra = new PedrinhaQuicando(agua);
      const pedraDoOutro = new PedrinhaQuicando(agua);
      w.add(minhaPedra.mesh);
      w.add(pedraDoOutro.mesh);
      /** um pato perto de onde a pedra (ou a moeda) caiu sai batendo asa */
      const espantarPatos = (x: number, z: number, raio: number): void => {
        for (const pato of adultos) {
          const d = Math.hypot(pato.x - x, pato.z - z);
          if (d > raio) continue;
          const a = Math.atan2(pato.z - z, pato.x - x);
          let para = { x: pato.x + Math.cos(a) * 2.6, z: pato.z + Math.sin(a) * 2.6 };
          if (agua.fundura(para.x, para.z) < 1.4) para = agua.naBeira(a + Math.PI, 3.5);
          pato.assustar(x, z, para);
          g.som('asas');
        }
      };
      const tocouAgua = (x: number, z: number, forca: number): void => {
        agua.marola(x, z, forca);
        ninfeias.balancar(x, z, forca, 1.5);
        cardume.atrair(x, z);
      };
      for (const pedra of [minhaPedra, pedraDoOutro]) {
        pedra.aoQuicar = (x, z) => {
          g.som('quique');
          tocouAgua(x, z, 0.75);
          espantarPatos(x, z, 1.4);
        };
      }

      /**
       * QUICAR PEDRINHA, na beira ou na ponta do trapiche: segurar F (no
       * celular, segurar o botão de ação) carrega a barra, e a faixa dourada é
       * a força que dá mais quiques; forte demais e é "tibum". O E (ou o toque
       * no botão) joga uma no meio da faixa, sem mirar.
       */
      const naBeira = (): boolean => {
        const p = g.playerPosition();
        const l = noTrapiche(p.x, p.z);
        const naPontaDoDeque = Math.abs(l.x) < TRAPICHE.largura / 2 + 0.1 && l.z > TRAPICHE.comprimento - 2.2 && l.z < TRAPICHE.comprimento + 0.2;
        return naPontaDoDeque || agua.fundura(p.x, p.z) > -1.25;
      };
      let carga = 0;
      let carregando = false;
      /** a pedra sai da mão no meio do arremesso: o relógio até soltar */
      let soltarEm = -1;
      let cargaDoLance = 0;
      let lances = 0;
      /** quem joga a próxima do outro lado: depois da pedra do jogador cair */
      let vezDoOutro = false;

      const jogarPedrinha = (forca: number): void => {
        if (minhaPedra.voando || soltarEm >= 0) return;
        g.arremessar('jogador');
        cargaDoLance = forca;
        soltarEm = ARREMESSO * SOLTA_DO_ARREMESSO;
      };
      const quique = w.interact({
        id: 'lago:pedrinha',
        x: NO_LAGO.x, z: NO_LAGO.z, radius: 1.2,
        label: 'Quicar pedrinha (segure F)', icon: '🪨',
        priority: -3,
        onInteract: () => jogarPedrinha(CARGA_CERTA + (Math.random() - 0.5) * 0.24),
      });
      quique.enabled = false;

      const resultado = async (n: number, naAreia: boolean): Promise<void> => {
        lances++;
        g.bump('lago.pedrinhas');
        if (naAreia) {
          g.toast(n ? `${n} ${n === 1 ? 'quique' : 'quiques'}, e parou na areia do outro lado!` : 'Foi parar na areia…', '🪨');
        } else if (n === 0) {
          g.toast('Tibum! Forte demais', '💦');
        } else {
          g.toast(`${n} ${n === 1 ? 'quique' : 'quiques'}!`, '🪨');
        }
        const recorde = g.stat('lago.recorde');
        if (n > recorde) {
          g.bump('lago.recorde', n - recorde);
          if (recorde > 0 && n >= 4) g.toast(`Recorde novo: ${n}!`, '🏆');
        }
        if (n >= 5) {
          g.unlock({
            id: 'lago-quiques',
            title: 'Cinco quiques',
            place: 'Parque Villa Lobos',
            note: 'Na ponta do lago, uma pedrinha chata saiu de lado e quicou cinco vezes na água antes de afundar. Os patos não gostaram.',
            icon: '🪨',
          });
        }
        // de vez em quando o outro também joga uma (e compara)
        vezDoOutro = lances % 3 === 0;
      };

      minhaPedra.aoAfundar = (x, z, n) => {
        g.som(n === 0 ? 'tibum' : 'ploft');
        tocouAgua(x, z, n === 0 ? 1.6 : 1.1);
        cardume.respingar(x, z, n === 0 ? 14 : 5);
        espantarPatos(x, z, n === 0 ? 2.4 : 1.4);
        void resultado(n, false);
      };
      minhaPedra.aoParar = (_x, _z, n) => {
        g.som('passo');
        void resultado(n, true);
      };
      let meusQuiques = 0;
      pedraDoOutro.aoAfundar = (x, z, n) => {
        g.som('ploft');
        tocouAgua(x, z, 1.1);
        cardume.respingar(x, z, 5);
        void (async () => {
          const ele = g.companionName();
          if (n > meusQuiques) await g.say([`${n}! Ganhei essa.`], ele);
          else if (n === meusQuiques) await g.say([`${n} também. Empate!`], ele);
          else await g.say(['Essa escorregou da mão. Não valeu.'], ele);
        })();
      };
      pedraDoOutro.aoParar = () => g.som('passo');

      /**
       * A vez do outro: ele joga a dele, mirando no meio do lago. A pedra sai
       * da mão pelo relógio do quadro (`outroSoltaEm`), e não por
       * `setTimeout`: o relógio de parede corre na frente do jogo num celular
       * lento, e a pedra sairia antes do braço.
       */
      let outroSoltaEm = -1;
      const outroJoga = (): void => {
        const p = g.companionPosition();
        if (agua.fundura(p.x, p.z) < -1.6 || pedraDoOutro.voando || outroSoltaEm >= 0) return;
        meusQuiques = minhaPedra.quiques;
        g.arremessar('parceiro');
        outroSoltaEm = ARREMESSO * SOLTA_DO_ARREMESSO;
      };

      // ------------------------------------------- tocar a água (o mouse)
      w.clicavel(lagoMalha, {
        soMouse: true,
        aoClicar: (api, ponto) => {
          if (agua.fundura(ponto.x, ponto.z) < 0.15) return;
          api.som('gota');
          tocouAgua(ponto.x, ponto.z, 0.8);
          for (const pato of adultos) if (Math.hypot(pato.x - ponto.x, pato.z - ponto.z) < 2.5) pato.fazer('olhar');
        },
      });

      // ------------------------------------------------ a placa e a ponta
      w.interact({
        id: 'lago:placa',
        x: ONDE_DA_PLACA.x, z: ONDE_DA_PLACA.z, radius: 1.3,
        label: 'Ler a placa', icon: '🪧',
        highlight: placa,
        // [provisório] falas minhas, até o Renan mandar as dele
        onInteract: () => conversa([
          [R, '"Proibido nadar." Tá vendo? Até a placa concorda comigo.'],
          [A, 'A placa não conhece a gente.'],
        ]),
      });

      /*
       * A PONTA DO TRAPICHE: sentar na beirada com o pé na água, ou jogar a
       * moedinha do desejo ("o fundo do lago é cheio de moeda", diz o
       * Jean-Luc). Os dois sentam na ponta de frente para o lago, as pernas
       * penduradas — o chão do mundo esconde o pé abaixo da água, e é isso que
       * faz parecer o pé dentro d'água; o chute de cada perna faz uma marolinha.
       */
      const PONTA = doTrapiche(0, TRAPICHE.comprimento - 0.5);
      const assentoNaPonta = new THREE.Object3D();
      const beirada = doTrapiche(0, TRAPICHE.comprimento - 0.02);
      // a âncora no chão, como a do banco: quem decide a altura é o `ALTURA`
      assentoNaPonta.position.set(beirada.x, 0, beirada.z);
      // `ridePlayer` põe o rig virado para o `-Z` da âncora (ver `w.banco`)
      assentoNaPonta.rotation.y = GIRO_DO_TRAPICHE + Math.PI;
      w.root.add(assentoNaPonta);
      const focoDaPonta = new THREE.Object3D();
      focoDaPonta.position.set(beirada.x, 0.9, beirada.z);
      w.root.add(focoDaPonta);
      let sentadosNaPonta = false;
      let pesNaAgua = 0;
      const LADO = 0.36;
      /**
       * A altura do corpo na âncora: o banco tem o assento a 0,53 e usa 0,06
       * (o quadril do rig fica ~0,45 acima da origem); a tábua da ponta está a
       * 0,20 — então o corpo desce 0,27 abaixo do chão, e a perna pendurada
       * passa da linha d'água.
       */
      const ALTURA = TRAPICHE.altura - 0.53 + 0.06;

      const sentarNaPonta = async (): Promise<void> => {
        g.lockPlayer(true);
        g.ridePlayer(assentoNaPonta, new THREE.Vector3(-LADO, ALTURA, -0.06), 1, Math.PI);
        g.rideCompanion(assentoNaPonta, new THREE.Vector3(LADO, ALTURA, -0.06), 1, Math.PI);
        g.setSitting(true, 'beirada');
        g.focusCamera(focoDaPonta);
        sentadosNaPonta = true;
        // a pata traz os patinhos para ver quem chegou
        const perto = doTrapiche(0.6, TRAPICHE.comprimento + 1.5);
        mae.entrarEmServico();
        void mae.irPara(perto.x, perto.z, 0.5).then(() => mae.encarar(beirada.x, beirada.z));
        await g.wait(0.8);
        // [provisório] falas minhas, até o Renan mandar as dele
        await conversa([
          [A, 'A água tá geladinha.'],
          [R, 'E os patos vieram ver quem chegou.'],
        ]);
        g.unlock({
          id: 'lago-pe-na-agua',
          title: 'Pé na água',
          place: 'Parque Villa Lobos',
          note: 'Sentados na ponta do trapiche do lago, com o pé na água gelada e uma fila de patinhos passando para ver quem tinha chegado.',
          icon: '🦶',
        });
        let escolha = 0;
        while (escolha === 0) {
          escolha = await g.ask('Ficar mais um pouco?', ['Ficar', 'Levantar']);
          if (escolha === 0) await g.wait(5);
        }
        sentadosNaPonta = false;
        g.setSitting(false);
        g.focusCamera(null);
        mae.pararDeEncarar();
        mae.voltarAPassear();
        const sai = (lx: number): { x: number; z: number } => doTrapiche(lx, TRAPICHE.comprimento - 0.8);
        g.releasePlayer(sai(-0.38).x, sai(-0.38).z, GIRO_DO_TRAPICHE);
        g.releaseCompanion(sai(0.38).x, sai(0.38).z, GIRO_DO_TRAPICHE);
        g.lockPlayer(false);
      };

      let moedaVoando: { de: THREE.Vector3; para: THREE.Vector3; t: number; caiu: () => void } | null = null;
      const moedinhaNoAr = moedinha();
      moedinhaNoAr.scale.setScalar(1.6);
      moedinhaNoAr.visible = false;
      w.add(moedinhaNoAr);
      const jogarMoedinha = async (): Promise<void> => {
        const eu = g.playerName();
        if (!g.gastar(1)) {
          await g.say(['Nem uma moedinha… fica pro próximo pedido.'], eu);
          return;
        }
        g.lockPlayer(true);
        const de = g.playerPosition();
        const rumo = GIRO_DO_TRAPICHE;
        g.arremessar('jogador');
        await g.wait(ARREMESSO * SOLTA_DO_ARREMESSO);
        g.som('moeda');
        const cai = doTrapiche(-0.3 + Math.random() * 0.6, TRAPICHE.comprimento + 2.2 + Math.random() * 0.8);
        moedinhaNoAr.visible = true;
        const inicio = new THREE.Vector3(de.x + Math.sin(rumo) * 0.25, de.y + 1.0, de.z + Math.cos(rumo) * 0.25);
        // o voo anda no relógio do quadro (ver `moedaVoando`); aqui só se espera ele cair
        await new Promise<void>((caiu) => {
          moedaVoando = { de: inicio, para: new THREE.Vector3(cai.x, 0, cai.z), t: 0, caiu };
        });
        moedinhaNoAr.visible = false;
        agua.moedaCaiu(cai.x, cai.z);
        g.som('ploc');
        tocouAgua(cai.x, cai.z, 0.7);
        g.bump('lago.moedas');
        await g.wait(0.6);
        // [provisório] falas minhas, até o Renan mandar as dele
        await conversa([
          [g.companionName(), 'Pediu o quê?'],
          [eu, 'Não posso contar. Senão não vale.'],
        ]);
        g.unlock({
          id: 'lago-moedinha',
          title: 'Uma moedinha no lago',
          place: 'Parque Villa Lobos',
          note: 'O Jean-Luc jura que o fundo do lago é cheio de moeda. Agora tem uma nossa lá embaixo, com um pedido que não pode ser contado.',
          icon: '🪙',
        });
        g.lockPlayer(false);
      };

      const ponta = w.interact({
        id: 'lago:ponta',
        x: PONTA.x, z: PONTA.z, radius: 1.0,
        label: 'Na ponta do trapiche', icon: '🌊',
        highlight: deque,
        onInteract: async () => {
          const i = await g.ask('Na ponta do trapiche', ['Sentar na beirada', 'Jogar uma moedinha (R$ 1)', 'Agora não']);
          if (i === 0) await sentarNaPonta();
          else if (i === 1) await jogarMoedinha();
        },
      });

      // ------------------------------------------------------- o quadro
      const pernaNaAgua = new THREE.Vector3();
      /** o relógio do lago: o teste acelera (o navegador dele anda devagar) */
      const ritmo = { vezes: 1 };
      w.onUpdate((dt0) => {
        const dt = dt0 * ritmo.vezes;
        agua.tique(dt);
        ventoDoLago.tique(dt);
        agua.soprar(ventoDoLago.uniforms.uDirecao.value, ventoDoLago.rajada);
        ninfeias.atualizar(dt);
        libelulas.update(dt);
        cardume.update(dt);
        // a rajada de vez em quando: o taboal deita e a água arrepia
        if (Math.random() < dt / 22) ventoDoLago.soprar(1.2 + Math.random() * 0.8);

        const eu = g.playerPosition();
        const ele = g.companionPosition();

        // ----------------------------------------------------- os patos
        for (const pato of adultos) pato.update(dt);
        // os patinhos atrás da mãe, em fila; com ela parada, em volta dela
        patinhos.forEach((filhote, i) => {
          const frente = i === 0 ? mae : patinhos[i - 1];
          let alvo: { x: number; z: number };
          if (mae.velocidade < 0.06) {
            const a = mae.group.rotation.y + Math.PI + (i - 1.5) * 0.75;
            alvo = { x: mae.x + Math.sin(a) * 0.55, z: mae.z + Math.cos(a) * 0.55 };
          } else {
            const gap = i === 0 ? 0.42 : 0.3;
            alvo = { x: frente.x - Math.sin(frente.group.rotation.y) * gap, z: frente.z - Math.cos(frente.group.rotation.y) * gap };
          }
          filhote.seguir(alvo.x, alvo.z, Math.max(0.25, mae.velocidade * 1.25 + 0.15));
          filhote.update(dt);
        });
        todosOsPatos.forEach((pato, i) => {
          agua.rastro(i, pato.x, pato.z, pato.group.rotation.y, Math.min(1, pato.velocidade / 0.6), pato.escala);
        });

        // ------------------------------------------------------- a garça
        garca.update(dt);
        const pertoDaGarca = Math.min(Math.hypot(eu.x - garca.x, eu.z - garca.z), Math.hypot(ele.x - garca.x, ele.z - garca.z));
        garca.sentir(pertoDaGarca);
        garcaDescansa -= dt;
        if (!garca.voando && (pertoDaGarca < 2.5 || garcaDescansa <= 0)) {
          // voa para o ponto de pesca mais longe da dupla
          const longe = [...PONTOS_DE_PESCA]
            .filter((p) => Math.hypot(p.x - garca.x, p.z - garca.z) > 2)
            .sort((a, b) => Math.hypot(b.x - eu.x, b.z - eu.z) - Math.hypot(a.x - eu.x, a.z - eu.z))[0];
          if (longe) garca.voarPara(longe);
          garcaDescansa = 80 + Math.random() * 50;
        }

        // ----------------------------------------------- os tigres-d'água
        const pertoDoTronco = Math.min(Math.hypot(eu.x - meioDoTronco.x, eu.z - meioDoTronco.z), Math.hypot(ele.x - meioDoTronco.x, ele.z - meioDoTronco.z));
        tigres.forEach((t, i) => {
          if (pertoDoTronco < 3.2) {
            t.assustar(i * 0.35 + 0.1);
            t.podeVoltar(false);
          } else if (pertoDoTronco > 5) t.podeVoltar(true);
          t.update(dt);
          agua.rastro(todosOsPatos.length + i, t.x, t.z, t.group.rotation.y, t.naAgua ? Math.min(1, t.velocidade / 0.3) : 0, t.naAgua ? 0.45 : 0);
        });

        // ------------------------------------------------ as pedrinhas
        minhaPedra.update(dt);
        pedraDoOutro.update(dt);
        if (soltarEm >= 0) {
          soltarEm -= dt;
          if (soltarEm < 0) {
            const olhar = g.playerFacing();
            // a mão direita, na altura do quadril, um palmo à frente e ao lado
            const mao = new THREE.Vector3(
              eu.x + Math.sin(olhar) * 0.3 + Math.cos(olhar) * 0.22,
              eu.y + 0.7,
              eu.z + Math.cos(olhar) * 0.3 - Math.sin(olhar) * 0.22,
            );
            minhaPedra.lancar(mao, olhar, cargaDoLance, Math.random());
          }
        }
        if (outroSoltaEm >= 0) {
          outroSoltaEm -= dt;
          if (outroSoltaEm < 0) {
            const rumo = Math.atan2(C.x - ele.x, C.z - ele.z) + (Math.random() - 0.5) * 0.5;
            const mao = new THREE.Vector3(ele.x + Math.sin(rumo) * 0.3, ele.y + 0.7, ele.z + Math.cos(rumo) * 0.3);
            pedraDoOutro.lancar(mao, rumo, 0.55 + Math.random() * 0.35, Math.random());
          }
        }
        if (vezDoOutro && minhaPedra.terminou) {
          vezDoOutro = false;
          outroJoga();
        }
        const beira = naBeira() && !sentadosNaPonta;
        quique.enabled = beira && !minhaPedra.voando && soltarEm < 0;
        quique.moveTo(eu.x, eu.z);
        if (beira && g.keyDown('KeyF') && !minhaPedra.voando && soltarEm < 0) {
          carregando = true;
          // segurar demais passa da faixa dourada e chega no "tibum"
          carga = Math.min(1, carga + dt / 1.25);
          g.showCharge(carga, CARGA_CERTA, FAIXA_CERTA);
        } else if (carregando) {
          carregando = false;
          g.showCharge(null);
          if (carga >= 0.12) jogarPedrinha(carga);
          carga = 0;
        }

        // ------------------------------------------------ a moedinha no ar
        if (moedaVoando) {
          const DUR = 0.9;
          moedaVoando.t += dt;
          const k = Math.min(1, moedaVoando.t / DUR);
          const { de, para } = moedaVoando;
          moedinhaNoAr.position.set(de.x + (para.x - de.x) * k, de.y * (1 - k) + Math.sin(k * Math.PI) * 1.1, de.z + (para.z - de.z) * k);
          moedinhaNoAr.rotation.x = moedaVoando.t * 22;
          if (k >= 1) {
            const caiu = moedaVoando.caiu;
            moedaVoando = null;
            caiu();
          }
        }

        // ------------------------------------------- o pé na água, sentados
        if (sentadosNaPonta) {
          pesNaAgua -= dt;
          if (pesNaAgua <= 0) {
            pesNaAgua = 0.55 + Math.random() * 0.4;
            const lado = Math.random() < 0.5 ? -1 : 1;
            const p = doTrapiche(lado * (LADO + (Math.random() - 0.5) * 0.12), TRAPICHE.comprimento + 0.22);
            pernaNaAgua.set(p.x, 0, p.z);
            agua.marola(p.x, p.z, 0.35);
            ninfeias.balancar(p.x, p.z, 0.3, 1);
          }
        }
        ponta.enabled = !sentadosNaPonta;
      });

      /** gancho de teste: o `scripts/lago.mjs` mede por aqui */
      lagoMalha.userData.teste = {
        agua, ninfeias, garca, tigres, cardume, libelulas, patos: todosOsPatos, mae, patinhos, minhaPedra, pedraDoOutro,
        trapiche: { doTrapiche, noTrapiche, ponta: PONTA, beirada, giro: GIRO_DO_TRAPICHE },
        placa: ONDE_DA_PLACA, pontosDePesca: PONTOS_DE_PESCA, tronco: meioDoTronco, tufos,
        jogarPedrinha, outroJoga, sentados: () => sentadosNaPonta, ritmo, moedaNoAr: moedinhaNoAr,
      };
      void tronco;
    }

    // ------------------------------------------------- quadra de frisbee
    const qx0 = QUADRA.x - QUADRA.largura / 2; // 5
    const qx1 = QUADRA.x + QUADRA.largura / 2; // 31
    const qz0 = QUADRA.z - QUADRA.profundidade / 2; // -14
    const qz1 = QUADRA.z + QUADRA.profundidade / 2; // 5

    // Grama aparada e as linhas pintadas, montadas de baixo para cima: a ordem
    // de criacao e que decide quem fica por cima (ver `WorldBuilder.decalar`).
    // O circulo central e um ANEL, e nao dois discos concentricos: com dois
    // discos a borda de um caia em cima da borda do outro e piscava. A risca do
    // meio vem depois do anel, porque em quadra de verdade ela atravessa o
    // circulo.
    // a MESMA grama do resto do parque, senão a quadra fica um retângulo liso
    // no meio de um gramado texturizado
    w.patch(QUADRA.x, QUADRA.z, QUADRA.largura, QUADRA.profundidade, P.grassDark, 0, 0.008,
      tapeteDeGrama(9));
    const linha = (x: number, z: number, larg: number, prof: number): void => {
      w.patch(x, z, larg, prof, 0xf2f4f0, 0, 0.012);
    };
    linha(QUADRA.x, qz0 + 0.3, QUADRA.largura - 1.2, 0.28);
    linha(QUADRA.x, qz1 - 0.3, QUADRA.largura - 1.2, 0.28);
    linha(qx0 + 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
    linha(qx1 - 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
    linha(qx0 + 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6); // zonas de fundo
    linha(qx1 - 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6);
    w.ring(QUADRA.x, QUADRA.z, 2.2, 0.3, 0xf2f4f0, 0.012);
    linha(QUADRA.x, QUADRA.z, 0.28, QUADRA.profundidade - 0.6); // meio

    // alambrado, com a entrada aberta do lado do caminho principal
    const alambrado = (x: number, z: number, comp: number, girado: boolean): void => {
      w.add(w.place(fence(comp, 1.5, P.metalWhite), x, 0, z, girado ? Math.PI / 2 : 0));
      if (girado) w.blockBox(x, z, 0.2, comp / 2);
      else w.blockBox(x, z, comp / 2, 0.2);
    };
    alambrado(QUADRA.x, qz0, QUADRA.largura, false); // fundo
    alambrado(QUADRA.x, qz1, QUADRA.largura, false); // frente
    alambrado(qx1, QUADRA.z, QUADRA.profundidade, true); // leste
    alambrado(qx0, qz0 + 3.75, 7.5, true); // oeste, parte de baixo
    alambrado(qx0, qz1 - 3.75, 7.5, true); // oeste, parte de cima — o vão fica no meio

    // as cestas de disc golf nas duas pontas: é o que diz "aqui é de frisbee"
    w.add(w.place(discGolfBasket(), qx0 + 3, 0, QUADRA.z));
    w.blockCircle(qx0 + 3, QUADRA.z, 0.5);
    const cestaLeste = w.add(w.place(discGolfBasket(P.frisbee), qx1 - 3, 0, QUADRA.z));
    w.blockCircle(qx1 - 3, QUADRA.z, 0.5);

    const placar = w.add(w.place(scoreboard(), QUADRA.x, 0, qz0 + 1.2));
    w.blockBox(QUADRA.x, qz0 + 1.2, 1, 0.2);

    const arquibancada = w.add(w.place(bleachers(6), QUADRA.x, 0, qz1 - 1.2, Math.PI));
    w.blockBox(QUADRA.x, qz1 - 1.4, 3, 0.8);

    const bebedouro = w.add(w.place(waterFountain(), qx0 + 1.6, 0, QUADRA.z + 4.2, Math.PI / 2));
    w.blockCircle(qx0 + 1.6, QUADRA.z + 4.2, 0.4);

    const sacola = w.add(w.place(discBag(), qx0 + 1.8, 0, QUADRA.z - 3.4, 0.4));

    const biruta = w.add(w.place(windsock(), qx1 - 1.6, 0, qz1 - 2.4));
    w.blockCircle(qx1 - 1.6, qz1 - 2.4, 0.3);
    const mangaBiruta = biruta.userData.manga as THREE.Object3D;
    w.onUpdate((_dt, t) => {
      biruta.rotation.y = Math.sin(t * 0.3) * 0.5 + 0.6;
      mangaBiruta.rotation.z = Math.sin(t * 1.7) * 0.12 - 0.06;
    });

    for (const [fx, fz] of [[qx0 + 1, qz0 + 1], [qx1 - 1, qz0 + 1], [qx0 + 1, qz1 - 1], [qx1 - 1, qz1 - 1]] as const) {
      w.add(w.place(floodlight(), fx, 0, fz, Math.atan2(QUADRA.x - fx, QUADRA.z - fz)));
      w.blockCircle(fx, fz, 0.4);
    }
    for (const [cx, cz] of [[qx0 + 6, qz0 + 1.4], [qx0 + 6, qz1 - 1.4], [qx1 - 6, qz0 + 1.4], [qx1 - 6, qz1 - 1.4]] as const) {
      w.add(w.place(cone(), cx, 0, cz));
    }

    // placa da quadra, na entrada
    const placaCampinho = w.add(w.place(textSign('Frisbee!', P.frisbee), qx0 - 1.8, 0, QUADRA.z + 3.4, Math.PI * 0.25));
    w.blockCircle(qx0 - 1.8, QUADRA.z + 3.4, 0.3);

    // -------------------------------------------------------- mobiliario
    const bancos: Array<[number, number, number]> = [
      [-4.2, 14, 0], [4.2, 14, Math.PI], [-4.2, -2, 0], [4.2, -6, Math.PI],
      [-12, 9.5, Math.PI / 2],
    ];
    for (const [x, z, r] of bancos) w.banco(x, z, r);

    /**
     * ========================= O SACO DE SEMENTES, esquecido no banco lateral
     *
     * O primeiro passo da quest do adubo (`docs/MINIGAME-JARDIM.md` §2), e o
     * único pedaço dela que mora no parque.
     *
     * POR QUE ESTE BANCO, e a razão não é estética. Ele é o de `(-12; 9,5)`:
     * o único fora da alameda (que corre em `x = ±4,2`) e, sobretudo, o único
     * banco isolado FORA DA ZONA DE ZOOM DA RODA-GIGANTE.
     *
     * Essa zona é a conta que decidiu tudo. A roda fica em `(0; -26)` e manda
     * na câmera num raio de 28: lá dentro o enquadramento abre até 30 para a
     * roda caber na tela. O primeiro lugar escolhido — o banco de
     * `(-13,2; -22,5)` — está a 13,7 dela, e abria a câmera em 30. Um saco de
     * 30 cm nesse enquadramento tem meia dúzia de pixels: o item da quest
     * ficava invisível, e a foto foi quem contou isso. Aqui a distância é 37,5,
     * fora do raio, e a câmera fica no zoom normal de jogo.
     *
     * O resto da regra continua: fora do caminho que o jogo pede para
     * percorrer, e raio de interação pequeno (1,1) — prompt que acende de longe
     * entrega o segredo antes de o jogador chegar nele. É o desenho do osso
     * enterrado no jardim da Josefina.
     *
     * ONDE EXATAMENTE, em cima do assento. O banco está girado 90° (`PI/2`),
     * então um deslocamento no X LOCAL dele vira `(cos, -sen)` no mundo — sem
     * essa conta o saco pousa no ar, ao lado do banco. O assento tem o topo em
     * `y = 0,53` (0,48 de altura mais 5 cm de meia-tábua).
     */
    const BANCO_ESQUECIDO = { x: -12, z: 9.5, giro: Math.PI / 2 };
    const ASSENTO = 0.53;
    const SEMENTES = {
      x: BANCO_ESQUECIDO.x + Math.cos(BANCO_ESQUECIDO.giro) * 0.45,
      z: BANCO_ESQUECIDO.z - Math.sin(BANCO_ESQUECIDO.giro) * 0.45,
    };
    const saco = w.add(w.place(sacoDeGraos(), SEMENTES.x, ASSENTO, SEMENTES.z, 0.7));
    saco.visible = !g.flag('sementes-achadas');

    const pegarAsSementes = w.interact({
      id: 'parque:sementes',
      x: SEMENTES.x + 0.7, z: SEMENTES.z, radius: 1.1,
      // o rótulo diz O QUE É, e nunca PARA QUEM: a ligação é do jogador
      label: 'Pegar o saco de sementes', icon: '🌾',
      highlight: saco,
      onInteract: async (api) => {
        /**
         * A MOCHILA CHEIA NÃO PODE ENGOLIR AS SEMENTES. Elas são a chave da
         * estufa: se o saco sumisse do banco sem entrar na mochila, o jogo
         * trancaria a porta com a chave do lado de fora. Por isso o saco só
         * some DEPOIS de o item entrar de verdade — e por isso a interação não
         * é `once`.
         */
        if (api.addItem(ITENS.sementes) === 'cheio') {
          await conversa([
            [A, 'Tem um saco aqui em cima do banco, mas eu não tenho onde pôr.'],
            [R, 'Guarda alguma coisa e volta.'],
          ]);
          return;
        }
        saco.visible = false;
        pegarAsSementes.enabled = false;
        api.setFlag('sementes-achadas');
        api.som('pegar');

        await conversa([
          [R, 'Alguém esqueceu um saco de semente num banco.'],
          [A, 'Semente de quê?'],
          [R, 'Dessas de passarinho. Milho quebrado, girassol, essas coisas.'],
          [A, 'E a gente vai fazer o quê com semente de passarinho?'],
          // A DICA, e ela não diz nome nenhum. O jogador fica com os dois fios:
          // o que o saco é, e que existe alguém por aqui que come isso.
          [R, 'Eu não sei. Mas quem é que come semente por aqui?'],
        ]);
        api.toast('Saco de sementes', '🌾');
      },
    });
    pegarAsSementes.enabled = !g.flag('sementes-achadas');

    // O poste de `[-4, 2]` saiu daqui: ele caia DENTRO da lojinha de patins, com
    // o pé atravessando o balcão e a cabeça saindo por cima do toldo. O balcão
    // fica em `(-3,88, 2,7)` — 72 cm dali. Em `[-4, 8]` ele volta para a fila da
    // alameda (20, 8, -8, espaçados por 12) e fica livre da loja.
    for (const [x, z] of [[-4, 20], [4, 6], [-4, -8], [4, 22], [-4, 8]] as const) {
      w.add(w.place(lamp(false), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }
    for (const [x, z] of [[3.4, 17], [-3.4, 11]] as const) {
      w.add(w.place(bin(), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    /**
     * A MESA DE PIQUENIQUE RECUOU de `(-10; 20)` para `(-8,6; 18,4)`.
     *
     * Dois motivos, e os dois vieram da foto: ela encostava na quina da arena
     * de ping pong nova (o tablado comeca em `x = -9,3`), e estava enterrada
     * numa moita de arvores sorteadas — o espalhador la embaixo agora tem um
     * circulo proibido em volta dela (ver `proibido`). Daqui ela e o canto de
     * comer do lado da arena, com grama entre as duas.
     */
    const PIQUENIQUE = { x: -8.6, z: 18.4 };
    const mesa = w.add(w.place(picnicTable(), PIQUENIQUE.x, 0, PIQUENIQUE.z, 0.3));
    w.blockBox(PIQUENIQUE.x, PIQUENIQUE.z, 1, 0.9, 0.3);

    /**
     * A MESA POSTA DA FESTA DO CAMPEÃO.
     *
     * Ela mora dentro da mesa de piquenique (`mesa.add`), e não solta no
     * mundo: assim a toalha, a comida e o retrato herdam de graça os 0,3 rad
     * de giro do móvel. Posta solta, cada peça precisaria repetir a conta do
     * giro, e a toalha sairia torta em cima do tampo.
     *
     * TRÊS PEÇAS, DUAS VIDAS. A toalha e o porta-retrato ficam para sempre
     * depois da festa — são o que conta que ela aconteceu, do mesmo jeito que
     * a foto pregada no quadro. A comida some: eles comeram.
     *
     * O TAMPO ESTÁ EM 0,81 (0,76 do centro da tábua mais a metade dos 0,1 de
     * espessura dela), e é dali que tudo nasce.
     */
    const TAMPO_DA_MESA = 0.81;
    const toalhaDaFesta = toalhaDePiquenique();
    toalhaDaFesta.position.y = TAMPO_DA_MESA;
    const comidaDaFesta = comidinhasDePiquenique();
    comidaDaFesta.position.y = TAMPO_DA_MESA + 0.03;
    // a foto fica na ponta de -X do tampo, virada para quem está do lado de
    // cá: no meio ela taparia a cara dos quatro que ficam atrás da mesa
    const retratoNaMesa = portaRetrato(0.42, 0.2, retratoDoGrupo);
    retratoNaMesa.position.set(-0.62, TAMPO_DA_MESA + 0.03, -0.24);
    retratoNaMesa.rotation.y = 0.35;
    mesa.add(toalhaDaFesta, comidaDaFesta, retratoNaMesa);

    // quem já deu a festa encontra a mesa posta ao voltar ao parque; quem não
    // deu não vê nada em cima dela
    const jaDeuAFesta = g.flag('campeao-da-arena');
    toalhaDaFesta.visible = jaDeuAFesta;
    retratoNaMesa.visible = jaDeuAFesta;
    comidaDaFesta.visible = false;

    // ------------------------------------------------ mesa de ping pong
    // O tampo fica ao longo do X local: é nessa direção que a bolinha viaja, e
    // é por isso que a mesa entra girada mas tudo dentro dela usa coordenada
    // local — a física do minigame não precisa saber o giro da mesa.
    const mesaPing = mesaPingPong();
    const raqueteA = raquete(P.metalRed);
    raqueteA.position.set(-0.78, 0.82, 0.3);
    raqueteA.rotation.set(-Math.PI / 2, 0, 0.7);
    mesaPing.add(raqueteA);
    const raqueteB = raquete(P.fabricBlue);
    raqueteB.position.set(0.82, 0.82, -0.28);
    raqueteB.rotation.set(-Math.PI / 2, 0, -2.3);
    mesaPing.add(raqueteB);
    const bolinha = bolinhaPingPong();
    bolinha.position.set(0.36, 0.845, 0.42);
    mesaPing.add(bolinha);

    /* ---------------------------------------------- o tablado da arena
     *
     * O PISO É DECALQUE, montado de baixo para cima como todo chão do jogo:
     * a tábua corrida primeiro, as ripas por cima, e a risca de contorno por
     * último. Decalque não briga com decalque — quem é criado depois fica em
     * cima, e nenhuma dessas camadas precisa de folga de altura.
     *
     * As ripas correm ao longo do X, a MESMA direção do tampo da mesa: assoalho
     * atravessado deixaria o retângulo lendo como tapete, e não como estrado.
     */
    const ax0 = ARENA.x - ARENA.largura / 2;
    const ax1 = ARENA.x + ARENA.largura / 2;
    const az0 = ARENA.z - ARENA.profundidade / 2;
    const az1 = ARENA.z + ARENA.profundidade / 2;
    w.patch(ARENA.x, ARENA.z, ARENA.largura, ARENA.profundidade, P.dequeTabua, 0, 0.03);
    /*
     * A FRESTA ENTRE AS TÁBUAS É ESCURA, e não clara. Na primeira tentativa a
     * ripa era `dequeRipa` (só um tom abaixo da tábua) e tinha 8 cm: na foto o
     * tablado saiu liso, sem assoalho nenhum. Deque de verdade lê pela SOMBRA
     * da junta, então o risco virou `dequeViga` com 11 cm — o mesmo salto de
     * contraste que a calçada de pedrinha precisou para parar de virar cinza.
     */
    for (let i = 0; i < 13; i++) {
      const z = az0 + 0.42 + i * 0.44;
      w.patch(ARENA.x, z, ARENA.largura - 0.5, 0.11, P.dequeViga, 0, 0.034);
    }
    // duas juntas no sentido do comprimento: tábua de 5,2 não existe, e é essa
    // emenda que dá a escala da madeira
    for (const x of [ARENA.x - 2.6, ARENA.x + 2.6]) {
      w.patch(x, ARENA.z, 0.07, ARENA.profundidade - 0.5, P.dequeViga, 0, 0.038);
    }
    /*
     * A CINTA DE ACABAMENTO, por último e por cima de tudo.
     *
     * A moldura de madeira tem 14 cm e, vista de cima em 34°, é uma tira fina
     * demais para desenhar o contorno do tablado — na primeira foto o deque
     * simplesmente acabava na grama. Esta cinta é a tábua de remate que todo
     * deque tem na borda, e é ela que fecha o retângulo na vista do jogo.
     */
    for (const z of [az0 + 0.16, az1 - 0.16]) {
      w.patch(ARENA.x, z, ARENA.largura - 0.32, 0.32, P.dequeViga, 0, 0.042);
    }
    for (const x of [ax0 + 0.16, ax1 - 0.16]) {
      w.patch(x, ARENA.z, 0.32, ARENA.profundidade - 0.32, P.dequeViga, 0, 0.042);
    }

    // a moldura, a única parte com volume: 11 cm, o bastante para ler como
    // estrado e baixo o bastante para ninguém reparar que atravessa
    w.add(w.place(bordaDeTablado(ARENA.largura), ARENA.x, 0, az0));
    w.add(w.place(bordaDeTablado(ARENA.largura), ARENA.x, 0, az1));
    w.add(w.place(bordaDeTablado(ARENA.profundidade), ax0, 0, ARENA.z, Math.PI / 2));
    w.add(w.place(bordaDeTablado(ARENA.profundidade), ax1, 0, ARENA.z, Math.PI / 2));

    // ------------------------------------------------ mesa de ping pong
    // O tampo fica ao longo do X local: é nessa direção que a bolinha viaja, e
    // é por isso que a mesa entra girada mas tudo dentro dela usa coordenada
    // local — a física do minigame não precisa saber o giro da mesa.
    w.add(w.place(mesaPing, PING.x, 0, PING.z, PING.giro));
    w.blockBox(PING.x, PING.z, 1.45, 0.85, PING.giro);
    // as raquetes e a bolinha de enfeite somem quando a partida começa
    const enfeitesPing = [raqueteA, raqueteB, bolinha];

    /* ------------------------------------- o que mora em volta da mesa
     *
     * TUDO QUE PASSA DE MEIO METRO FICA NO LADO -Z. A câmera olha em 34° e
     * cada peça esconde `1,5 · h` de chão na diagonal `(+X, +Z)` — o que
     * estiver na FRENTE da mesa come o tampo dela. Atrás não esconde nada
     * além da grama que vai até o lago.
     *
     * E O CORREDOR DE `z = 24,4` ENTRE `x = -18,2` E A MESA FICA VAZIO: é por
     * ali que passa a câmera de ombro da partida (`atras`, a 1,6 do lugar de
     * quem saca). Qualquer coisa plantada ali entraria na frente do jogo.
     */
    /** o banco, de frente para a mesa: quem espera a vez senta aqui */
    const BANCO_PING = { x: ARENA.x, z: 21.9 };
    w.banco(BANCO_PING.x, BANCO_PING.z, 0);

    const PLACAR_PING = { x: -18.3, z: 22.2 };
    const placarPing = w.add(w.place(placarDePingPong(), PLACAR_PING.x, 0, PLACAR_PING.z, 0.22));
    w.blockCircle(PLACAR_PING.x, PLACAR_PING.z, 0.6);

    const SUPORTE_PING = { x: -10.9, z: 22.3 };
    const suportePing = w.add(w.place(suporteDeRaquetes(), SUPORTE_PING.x, 0, SUPORTE_PING.z, -0.2));
    w.blockCircle(SUPORTE_PING.x, SUPORTE_PING.z, 0.55);

    // o balde é a ÚNICA peça do lado da câmera, e por isso ele é o mais baixo
    // da arena: 42 cm escondem 63 cm de chão, e a mesa começa 1,6 atrás
    const CESTO_PING = { x: -11.7, z: 26.2 };
    const cestoPing = w.add(w.place(cestoDeBolinhas(), CESTO_PING.x, 0, CESTO_PING.z, 0.6));
    w.blockCircle(CESTO_PING.x, CESTO_PING.z, 0.32);
    // as que escaparam do balde, paradas na madeira
    for (const [x, z] of [[-12.6, 26.5], [-10.8, 26.8], [-13.4, 26.9]] as const) {
      const solta = bolinhaPingPong();
      w.add(w.place(solta, x, 0.055, z));
    }

    // o bebedouro, na quina da frente pelo lado -X: sede de quem joga cinco
    // pontos. Ele tem 1,9 e esconde 2,85 na diagonal — que daqui cai fora do
    // tablado, e não em cima da mesa
    // girado meia volta: a cuba e a bica de `waterFountain()` ficam no `-Z`
    // local, e sem o giro quem bebe some atrás da coluna de concreto
    w.add(w.place(waterFountain(), -18.8, 0, 26.4, Math.PI));
    w.blockCircle(-18.8, 26.4, 0.5);

    // os dois postes da arena, nas quinas de trás — a mesma luminária da
    // alameda do parque, para a arena não virar uma ilha de outro cenário
    for (const [x, z] of [[ax0 + 0.4, az0 + 0.4], [ax1 - 0.4, az0 + 0.4]] as const) {
      w.add(w.place(lamp(false), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }
    // os vasos: dois ladeando o banco e um na quina livre da frente. Baixos
    // (34 cm), então não tapam nada de onde estiverem
    for (const [x, z, tipo] of [
      [-16.1, 21.7, 'samambaia'], [-12.9, 21.7, 'lavanda'], [-10.1, 26.6, 'suculenta'],
    ] as const) {
      w.add(w.place(vasoDePlanta(tipo, 0.34, 0.3), x, 0, z));
      w.blockCircle(x, z, 0.3);
    }

    /* ================================================ O JEAN-LUC, o pato
     *
     * Ele mora no lago, e estava lá o tempo todo — debaixo d'água. Quem ganha
     * cinco partidas na arena acorda ele (ver `chegarOJeanLuc`, lá embaixo,
     * junto do fim de partida).
     *
     * OS TRÊS PONTOS DA CHEGADA, e cada um foi medido contra o lago (centro em
     * `(-21; 11)`, água até 8,5, areia até 9,2 e o colisor em 8,8):
     *
     *  - `LAGO` está a 6,7 do centro — dentro d'água de verdade, e não na
     *    beirada: cabeça saindo no meio do lago é o que faz a emersão ler como
     *    emersão;
     *  - `MARGEM` está a 9,4 — fora do colisor, na faixa de areia;
     *  - `POSTO` é na frente da mesa, onde ele fica falando com a dupla.
     *
     * DEPOIS DA CHEGADA ELE PASSEIA PELA FAIXA DA FRENTE DO TABLADO, e só por
     * ela: 1,5 de fundo entre a mesa e a borda de `+Z`. É a beira do campo, que
     * é onde um técnico empolgado fica — e, de quebra, ele tem 66 cm e esconde
     * 1 m de chão na diagonal da câmera: daqui isso cai fora da mesa.
     */
    const JEANLUC_LAGO = { x: -18.4, z: 17.2 };
    const JEANLUC_MARGEM = { x: -17.1, z: 19.6 };
    /**
     * O POSTO é na quina da FRENTE pelo lado `-X`, e não no meio da borda, e
     * isso é decisão de câmera: dali ele olha para a mesa numa direção que
     * aponta para `+X`, e a câmera (que vem de `+X/+Z`) pega o rosto dele de
     * três quartos. No meio da borda ele ficaria de costas para o jogo — um
     * pato falante do qual só se vê a nuca.
     */
    const JEANLUC_POSTO = { x: -17.6, z: 26.3 };
    /** quantas vitórias acordam ele */
    const VITORIAS_PARA_O_PATO = 5;
    const jeanLuc = new JeanLuc({
      minX: ax0 + 1.2, maxX: ax1 - 1.2,
      minZ: 25.4, maxZ: 26.9,
      proibido: [
        { x: CESTO_PING.x, z: CESTO_PING.z, r: 0.55 },
        { x: -10.1, z: 26.6, r: 0.5 },
      ],
    });
    w.add(jeanLuc.group);
    jeanLuc.aoSoar = () => g.som('pato');

    /**
     * A MAROLA da emersão: um anel branco que abre na superfície da água.
     *
     * Material de `flat()` como manda a casa, com `decal` ligado e
     * `renderOrder` alto — ele é coplanar com o decalque do lago de propósito,
     * e é o `polygonOffset` mais a ordem de desenho que resolvem isso (a mesma
     * receita da foto na parede e da linha do fundo da piscina).
     *
     * Ele ANIMA POR ESCALA, e não por opacidade: `flat()` é cacheado por
     * cor+opacidade, então mexer na transparência deste anel mexeria em todo
     * material que por acaso dividisse a mesma chave.
     */
    const marola = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.44, 22), flat(0xffffff, 0.5, true));
    marola.rotation.x = -Math.PI / 2;
    marola.position.set(JEANLUC_LAGO.x, 0.05, JEANLUC_LAGO.z);
    marola.renderOrder = 12;
    marola.visible = false;
    w.root.add(marola);

    /**
     * QUEM JÁ CONHECE O PATO ENCONTRA ELE NA ARENA; quem não conhece não vê
     * nada. Antes da cutscene ele fica submerso E invisível: o chão do mundo
     * já esconderia o corpo a essa altura, mas a cabeça dele passa de 60 cm e
     * apareceria boiando no meio do lago como um brinquedo esquecido.
     */
    const patoJaConhecido = g.flag('jean-luc-conhecido');
    if (patoJaConhecido) {
      jeanLuc.group.position.set(JEANLUC_POSTO.x, 0, JEANLUC_POSTO.z);
    } else {
      jeanLuc.entrarEmServico();
      jeanLuc.group.visible = false;
      jeanLuc.group.position.set(JEANLUC_LAGO.x, -0.85, JEANLUC_LAGO.z);
    }

    /* =========================================== O QUADRO DE INSCRIÇÕES
     *
     * O mural fica FORA do tablado, na grama do lado `-Z`, como todo quadro de
     * aviso de parque: na entrada da arena, de frente para quem chega. Dentro
     * dele não cabia — a tábua tem 2,1 de largura e 1,6 de altura, e no
     * tablado ela brigaria com o banco de um lado e com o suporte de raquetes
     * do outro, com 10 cm sobrando para cada.
     *
     * E ELE É ALTO, então esconde 2,4 de chão na diagonal da câmera — que
     * daqui cai na grama atrás, e não em cima da mesa.
     */
    const QUADRO = { x: -12.4, z: 20.6 };
    const quadroDaArena = w.add(w.place(quadroDeInscricoes(2.1, INSCRITOS.length),
      QUADRO.x, 0, QUADRO.z, -0.06));
    w.blockBox(QUADRO.x, QUADRO.z, 1.05, 0.2);

    const falarComOPato = w.interact({
      id: 'parque:jean-luc',
      x: JEANLUC_POSTO.x, z: JEANLUC_POSTO.z, radius: 1.5, priority: -1,
      label: 'Falar com o Jean-Luc', icon: '🦆',
      highlight: jeanLuc.group,
      onInteract: async (api) => {
        jeanLuc.receberCarinho();
        jeanLuc.comemorar(2.2);
        api.som('pato');
        /*
         * ELE FALA PORTUGUÊS COM FRANCÊS ENFIADO NO MEIO, e não francês com
         * legenda: a graça é o sotaque escapando numa palavra por frase, e
         * não uma fala inteira que ninguém entende. Quando a palavra francesa
         * carrega a piada, a fala seguinte traduz — é o próprio Jean-Luc
         * explicando o trocadilho, que é a coisa mais francesa que ele faz.
         */
        /*
         * DE JAQUETA DELE, ELE FALA DA JAQUETA. As seis falas de sempre ficam
         * para quem chegar sem ela — e ele continua pedindo a partida no fim
         * dos dois caminhos, porque é disso que ele vive.
         */
        const jaFalouDaJaqueta = await falarDoPremio(api, 'jean-luc');
        const vezes = api.bump('jean-luc.conversas');
        const dele: Array<readonly [string, string]> = [
          ['Cinco vitórias! Eu contei todas debaixo d\'água. Toutes!',
            'Perdi duas de vista quando um pato passou na frente. Mas eu contei.'],
          ['Dizem por aí que eu jogo mal. C\'est un canard.',
            '«Canard» é boato. E é pato. A piada é bem melhor em francês, pardon.'],
          ['Eu treino na correnteza. É mais difícil — la balle s\'enfuit.',
            'A bolinha foge. Mas quem alcança bolinha na correnteza alcança tudo.'],
          ['«Faire le canard» é sumir sem avisar ninguém.',
            'Eu fiz isso por seis anos. Aqui embaixo. Voilà.'],
          ['A boina é para o sol. Et pour l\'élégance.',
            'Principalmente para a élégance. O sol aqui nem é tão forte.'],
          ['Mon grand-père dizia: perder com estilo ainda é perder.',
            'Ele dizia muito isso. Ele tinha muita prática.'],
        ];
        const duas = dele[(vezes - 1) % dele.length];
        if (!jaFalouDaJaqueta) {
          await conversa([
            ['Jean-Luc', duas[0]],
            ['Jean-Luc', duas[1]],
          ]);
        }

        /*
         * E NO FIM ELE PEDE A PARTIDA — toda vez, porque é disso que ele vive.
         *
         * A pergunta fica DEPOIS da conversa de propósito: ele é um bicho que
         * conta uma história e só então lembra do que queria desde o começo.
         * Perguntar de cara transformaria o pato num botão de "iniciar jogo".
         */
        const jogar = await api.ask('Jogar contra o Jean-Luc?', ['Allez!', 'Agora não']);
        if (jogar !== 0) {
          await conversa([
            [vezes % 2 === 0 ? A : R, 'Fica pra próxima.'],
            ['Jean-Luc', 'Quand vous voulez. Eu fico aqui. Molhado, mas aqui.'],
          ]);
          return;
        }
        jeanLuc.comemorar(2.6);
        api.som('pato');
        await conversa([
          ['Jean-Luc', 'ENFIN! Finalmente!'],
          ['Jean-Luc', 'Eu trouxe meu caixote. Eu trago sempre. Nunca precisei até hoje.'],
          [R, 'Ele tem um caixote.'],
          [A, 'Ele tem um caixote e um sonho.'],
        ]);
        await comecarPartida(api, JEAN_LUC_ADVERSARIO);
      },
    });
    // ele só existe para quem já o conheceu — e o balão anda junto com ele,
    // senão o prompt fica onde ele nasceu e vira um ponto morto no tablado
    falarComOPato.enabled = patoJaConhecido;
    w.onUpdate((dt) => {
      jeanLuc.update(dt);
      falarComOPato.moveTo(jeanLuc.x, jeanLuc.z);
    });

    /* ================================================= A PRAÇA DE GELO
     *
     * O quiosque do Mano estava sozinho no meio do gramado. Agora ele é o
     * fundo de uma pracinha inteira: uma lâmina de gelo com borda de neve,
     * quatro mesinhas de guarda-sol de frente para o balcão, postes baixos nas
     * quinas e um boneco de neve no canto.
     *
     * O QUIOSQUE FOI PARA A PONTA DE -Z, encostado na borda de trás, e ficou
     * RETO (sem os 0,3 rad de giro que tinha). Duas razões: com a peça na
     * ponta a arena inteira sobra livre na frente dela, que é o que faz uma
     * praça ser praça; e com o piso alinhado aos eixos, um quiosque torto lê
     * como prédio caído — é a mesma lição que a loja de patins já tinha dado.
     *
     * ONDE ELA CABE: `x` de 7,2 a 20,4 e `z` de 14,8 a 26. Fica fora do banco
     * de (4,2; 14), da lixeira de (3,4; 17) e do poste de (4; 22) do lado de
     * -X; a 2 do gradil do portão (`z = 28`); e bem longe do alambrado do
     * campinho, que termina em `z = 5`.
     */
    const PRACA = { x: 13.8, z: 20.4, largura: 13.2, profundidade: 11.2 };
    /** o quiosque, na borda de trás da praça, de frente para a arena (+Z) */
    const SORVETERIA = { x: PRACA.x, z: 16.1 };

    /**
     * Retângulo de cantos redondos, UM decalque só: o `patch` de 1 × 1 dá o
     * lugar na fila de pintura do chão, e a forma de quina redonda
     * (`retanguloRedondo`, em metros) entra no lugar da geometria dele — eram
     * dois `patch` cruzados e quatro `disc` por camada, doze desenhos.
     *
     * Rinque não tem quina viva, e um retângulo seco no meio do gramado lê
     * como tapete jogado.
     */
    const lamina = (
      larg: number, prof: number, cor: number, altura: number, raio: number,
      textura?: THREE.Texture,
    ): THREE.Mesh => {
      const m = w.patch(PRACA.x, PRACA.z, 1, 1, cor, 0, altura, textura);
      m.geometry.dispose();
      m.geometry = retanguloRedondo(larg / 2, prof / 2, raio);
      return m;
    };

    /*
     * O CHÃO DE GELO É DECALQUE OPACO, e não caixa translúcida.
     *
     * A tentação era um palco baixo de material transparente. Duas coisas
     * matam a ideia: uma caixa com topo acima de zero enterra o pé de todo
     * mundo que pisa nela (o kit inteiro nasce com a base em `y = 0`), e um
     * chão translúcido deixa a GRAMA aparecer por baixo do rinque — verde por
     * dentro do gelo. A transparência é de mentira e mora no shader
     * (`GeloDoRinque`, em `core/shaders.ts`): as trincas e as bolhas "de
     * dentro" são lidas deslocadas pela direção da câmera, e quando ela gira
     * elas andam por baixo dos riscos — a fundura de uma lâmina de verdade.
     * O desenho é o de `world/texturasDeGelo.ts`: a pista inteira num canvas
     * só (os riscos dando a volta, a geada na beira, as lagoas de gelo limpo).
     *
     * Duas camadas: a neve pisada da beirada, e a lâmina por cima dela.
     */
    lamina(PRACA.largura + 1.5, PRACA.profundidade + 1.5, P.neveSombra, 0.006, 2.9, neveBatida());
    const geloDaPraca = new GeloDoRinque({
      cor: P.geloPiso,
      pista: geloDaPista(PRACA.largura, PRACA.profundidade, 2.4),
      detalhe: geloDetalhe(2),
      ladoDoDetalhe: 2,
      porDentro: geloPorDentro(3.2),
      ladoPorDentro: 3.2,
      corDoFundo: P.geloFundo,
      centro: [PRACA.x, PRACA.z],
      tamanho: [PRACA.largura, PRACA.profundidade],
    });
    const laminaDeGelo = lamina(PRACA.largura, PRACA.profundidade, P.geloPiso, 0.01, 2.4);
    laminaDeGelo.material = geloDaPraca.material;
    // o teste acha o gelo por aqui
    laminaDeGelo.userData.geloDoRinque = geloDaPraca;

    /*
     * A BORDA: banco de neve baixo, com as quinas abertas.
     *
     * Ela contorna a praça inteira, quinas incluídas — as quinas são um pedaço
     * curto na diagonal, apoiado no meio do arco de 2,4 de raio. Sem eles a
     * borda vira quatro barras soltas no gelo em vez de uma beirada. Só a
     * FRENTE tem um vão de 3,6 no meio: a porta da praça, virada para quem
     * chega do portão do parque.
     *
     * A peça tem 23 cm e NÃO ganha colisor: é beira, não muro.
     */
    const bx = PRACA.largura / 2;
    const bz = PRACA.profundidade / 2;
    const RAIO_QUINA = 2.4;
    for (const lado of [-1, 1] as const) {
      w.add(w.place(bordaDeGelo(6), PRACA.x + lado * bx, 0, PRACA.z));
      w.add(w.place(bordaDeGelo(4), PRACA.x + lado * 3.5, 0, PRACA.z + bz, Math.PI / 2));
    }
    w.add(w.place(bordaDeGelo(8), PRACA.x, 0, PRACA.z - bz, Math.PI / 2));
    /*
     * As quinas. O centro do arco fica a `(larg/2 − raio; prof/2 − raio)` do
     * meio da praça, e o meio do arco, mais `raio × √½` na diagonal. A peça
     * nasce deitada ao longo do Z, então o giro que a alinha com a tangente é
     * 45° numa diagonal e 135° na outra — quem decide é o sinal do produto
     * `sx · sz`.
     */
    for (const sx of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        const cx = PRACA.x + sx * (bx - RAIO_QUINA + RAIO_QUINA * 0.707);
        const cz = PRACA.z + sz * (bz - RAIO_QUINA + RAIO_QUINA * 0.707);
        w.add(w.place(bordaDeGelo(2.6), cx, 0, cz, sx * sz > 0 ? Math.PI * 0.75 : Math.PI * 0.25));
      }
    }

    // balcão virado para +Z: assim quem compra fica na frente do quiosque na
    // tela, e não escondido atrás dele. O chalezinho (`world/sorveteriaDoMano.ts`)
    // tem o deque do quiosque antigo, e o deque é o colisor
    w.add(fundir(w.place(sorveteriaDoMano(), SORVETERIA.x, 0, SORVETERIA.z)));
    w.blockBox(SORVETERIA.x, SORVETERIA.z, SORVETERIA_DO_MANO.meiaX, SORVETERIA_DO_MANO.meiaZ);

    /*
     * AS QUATRO MESINHAS, uma por quadrante da arena, todas olhando para o
     * balcão. Elas ficam a 3,5 e 7,5 do quiosque em Z: nenhuma cai em cima do
     * ponto de comprar (que fica a 2 do balcão) nem na linha entre ele e a
     * entrada da praça.
     *
     * A distância entre duas mesas vizinhas nunca é menor que 4, e cada uma
     * bloqueia 1 de raio — sobra vão de sobra para passar entre elas (o jogador
     * tem 0,42).
     */
    const MESAS: Array<[number, number, number]> = [
      // x, z, sabor da taça
      [9.9, 19.9, P.morango],
      [17.7, 19.7, P.maracuja],
      [11.2, 24.1, P.chocolate],
      [16.6, 23.8, P.limao],
    ];
    /**
     * As mesinhas ficam guardadas: é NELAS que a dupla senta, e o grupo de cada
     * uma é a âncora da cutscene. Sentar num objeto que já carrega posição e
     * giro dispensa qualquer conta de seno e cosseno na hora de acomodar os
     * dois — o padrão de cutscene do jogo inteiro.
     */
    const MESINHAS: THREE.Group[] = [];
    for (const [mx, mz, sabor] of MESAS) {
      const mesinha = mesaDeSorveteria(P.sorveteriaRosa, sabor);
      // fundida: o grupo continua sendo a mesa (a âncora de sentar), só com
      // menos malhas dentro
      w.add(fundir(w.place(mesinha, mx, 0, mz, Math.atan2(SORVETERIA.x - mx, SORVETERIA.z - mz))));
      w.blockCircle(mx, mz, 1);
      MESINHAS.push(mesinha);
    }

    // os postes das quinas. Baixos (2,3) para não apagarem as mesinhas: cada
    // metro de poste esconde 1,5 de chão atrás dele nesta câmera
    for (const [px, pz] of [[8.4, 16.4], [19.2, 16.4], [8.6, 24.6]] as const) {
      w.add(w.place(posteDeGelo(), px, 0, pz));
      w.blockCircle(px, pz, 0.3);
    }

    /*
     * A quarta quina é do boneco de neve, e ele OLHA PARA O VÃO DA ENTRADA.
     *
     * Virado para o meio da praça ele ficava de costas para a câmera padrão
     * (que vem de +X/+Z) e ninguém via o rosto — sobrava um monte de neve com
     * cachecol. Olhando para a porta ele recebe quem chega, e o nariz de
     * cenoura e o chapéu de casquinha aparecem.
     */
    const BONECO = { x: 19.1, z: 24.4 };
    const ENTRADA = { x: PRACA.x, z: PRACA.z + PRACA.profundidade / 2 };
    w.add(w.place(
      bonecoDeNeve(1), BONECO.x, 0, BONECO.z,
      Math.atan2(ENTRADA.x - BONECO.x, ENTRADA.z - BONECO.z),
    ));
    w.blockCircle(BONECO.x, BONECO.z, 0.55);

    // Tufos de cristal: dois ladeando o quiosque, dentro do rinque, e dois na
    // neve pisada do lado de FORA da borda — cristal em cima da borda ficaria
    // atravessado nela.
    for (const [cx, cz, esc, sem] of [
      [11.4, 15.4, 1.15, 0.2], [16.3, 15.5, 0.95, 0.62],
      [6.8, 20.8, 1.05, 0.41], [21.0, 21.2, 1.2, 0.88],
    ] as const) {
      w.add(w.place(cristalDeGelo(esc, sem), cx, 0, cz, sem * 6.28));
      w.blockCircle(cx, cz, 0.45 * esc);
    }

    /* ---------------------------------------------------- O GELO ESCORREGA
     *
     * Dentro do rinque o chão deixa de agarrar: o empurrão do pé pega menos e
     * quase nada freia quem já está em movimento (ver `Player.derrapagem`).
     * Solte a tecla correndo e a dupla desliza sozinha por uns metros; faça a
     * curva e ela sai aberta, olhando para onde está indo.
     *
     * A CONTA É A DO RETÂNGULO DE CANTOS REDONDOS, a mesma forma que o piso
     * desenha: recua meia largura menos o raio em cada eixo, e o que sobra é
     * medido contra o raio da quina. Sem isso as quatro quinas escorregariam
     * fora do gelo, em cima da grama.
     *
     * E ENTRA INTERPOLADO. Ligar de um quadro para o outro dá um tranco na
     * borda do rinque — é a mesma lição da submersão na beira do lago. Com
     * `dt × 6` a passagem leva menos de dois décimos: o tempo de um passo, e
     * curto o bastante para quem entra correndo já entrar escorregando.
     */
    const noGelo = (x: number, z: number): boolean => {
      const dx = Math.max(0, Math.abs(x - PRACA.x) - (bx - RAIO_QUINA));
      const dz = Math.max(0, Math.abs(z - PRACA.z) - (bz - RAIO_QUINA));
      return (
        Math.abs(x - PRACA.x) <= bx && Math.abs(z - PRACA.z) <= bz &&
        dx * dx + dz * dz <= RAIO_QUINA * RAIO_QUINA
      );
    };
    /**
     * DE PATINS O GELO VIRA PISTA.
     *
     * Quem entra no rinque a pé escorrega e pronto: o pé patina no lugar e nada
     * freia. Com os patins da lojinha calçados, a lâmina crava de lado — a
     * aceleração volta quase toda, o freio existe e o teto de velocidade sobe
     * mais um quarto (ver `Player.derrapagem` e a `lamina` que mora lá).
     * Nenhuma linha disso está aqui: a cena só diz ONDE tem gelo, e quem calça
     * o patins é o inventário. Esta parte é só a primeira vez, que merece uma
     * fala.
     */
    const dePatins = (): boolean => g.wearables().some((i) => i?.id === ITENS.patins.id);
    let escorregando = 0;
    let ultimoNoGelo: THREE.Vector3 | null = null;
    /**
     * A velocidade da dupla no quadro, publicada para quem vier depois.
     *
     * O motor não publica velocidade e não precisa publicar: aqui ela sai da
     * posição de um quadro para o outro. Quem também lê isto é a reação do
     * Mano, mais abaixo — e ela pode ler porque este `onUpdate` foi registrado
     * ANTES, e os `onUpdate` rodam na ordem em que a cena os criou.
     */
    let velocidadeNoGelo = 0;
    /** uma cutscene do gelo por vez: a primeira volta e o grito do Mano */
    let cenaDoGelo = false;

    w.onUpdate((dt) => {
      const onde = g.playerPosition();
      const alvo = noGelo(onde.x, onde.z) ? 1 : 0;
      escorregando += (alvo - escorregando) * Math.min(1, dt * 6);
      g.setEscorregadio(escorregando);

      velocidadeNoGelo = ultimoNoGelo && dt > 0
        ? Math.hypot(onde.x - ultimoNoGelo.x, onde.z - ultimoNoGelo.z) / dt
        : 0;
      ultimoNoGelo = onde.clone();

      if (cenaDoGelo || g.flag('patinou-no-gelo')) return;
      if (escorregando < 0.75 || !dePatins() || velocidadeNoGelo < 3.2) return;
      /**
       * A PRIMEIRA VOLTA DE PATINS NO GELO, uma vez só na vida do save.
       *
       * A trava é ligada ANTES do `await`: sem ela, os quadros que rodam
       * enquanto a primeira fala aparece entrariam aqui de novo e a conversa
       * começaria três vezes por cima de si mesma.
       */
      cenaDoGelo = true;
      void (async () => {
        g.setFlag('patinou-no-gelo');
        g.lockPlayer(true);
        await conversa([
          [R, 'Ó, no gelo o patins pega!'],
          [A, 'PEGA MESMO. Olha eu indo.'],
          [R, 'Vai devagar que eu vou atrás.'],
        ]);
        g.lockPlayer(false);
        g.unlock({
          id: 'patinar-no-gelo',
          title: 'Patinando no gelo',
          place: 'Parque Villa Lobos',
          note: 'Os patins da lojinha viraram outra coisa quando pisaram no rinque do Mano: no gelo a lâmina crava e dá para correr de verdade. Descalço ali só dá para escorregar.',
          icon: '⛸️',
        });
        cenaDoGelo = false;
      })();
    });

    /* ------------------------------------------- OS RISCOS QUE A DUPLA DEIXA
     *
     * De patins, cada um risca o gelo por onde passa — e o risco fica. A
     * lâmina não risca em linha reta no meio do corpo: cada passada é um arco
     * comprido de um pé, abrindo para o lado e voltando, e a do outro pé
     * começa antes de essa acabar (o desenho de quem patina; com passada
     * curta e sem cruzar, saía um tracejado de faixa de rua). Quem corre
     * risca mais branco. A pé ninguém risca: escorrega.
     *
     * O relógio do gelo (o cintilar) anda aqui também.
     */
    const PASSADA = 1.1;
    const patinadores = [0, 1].map(() => ({ ultimo: null as THREE.Vector3 | null, andado: 0 }));
    /**
     * Onde cada pé está para o lado do meio do corpo, `andado` metros depois:
     * o pé de cada lado risca durante 1,3 passada (a ponta de uma passada
     * cruza o começo da outra) e descansa no resto.
     */
    const pes = (andado: number): Array<number | null> => [0, 1].map((pe) => {
      const fase = ((andado / PASSADA + pe) % 2) / 1.3;
      if (fase > 1) return null;
      const lado = pe ? 1 : -1;
      return lado * (0.02 + 0.09 * Math.sin(fase * Math.PI));
    });
    w.onUpdate((dt) => {
      geloDaPraca.tique(dt);
      const calcado = dePatins();
      [g.playerPosition(), g.companionPosition()].forEach((onde, i) => {
        const p = patinadores[i];
        if (!calcado || !noGelo(onde.x, onde.z)) {
          p.ultimo = null;
          return;
        }
        if (!p.ultimo) {
          p.ultimo = onde.clone();
          return;
        }
        const dx = onde.x - p.ultimo.x;
        const dz = onde.z - p.ultimo.z;
        const d = Math.hypot(dx, dz);
        // parado (ou quase): espera juntar 4 cm antes de riscar
        if (d < 0.04) return;
        // salto de posição (cutscene, teleporte): recomeça dali
        if (d > 1.2) {
          p.ultimo = onde.clone();
          return;
        }
        const a = p.andado;
        const b = a + d;
        const nx = -dz / d;
        const nz = dx / d;
        const forca = Math.min(0.55, 0.2 + (d / Math.max(dt, 1e-3)) * 0.05);
        const antes = pes(a);
        const agora = pes(b);
        for (let pe = 0; pe < 2; pe++) {
          const oa = antes[pe];
          const ob = agora[pe];
          // o pé que acabou de pousar (ou de levantar) não liga com o de antes
          if (oa === null || ob === null) continue;
          geloDaPraca.riscar(p.ultimo.x + nx * oa, p.ultimo.z + nz * oa, onde.x + nx * ob, onde.z + nz * ob, forca);
        }
        p.andado = b;
        p.ultimo = onde.clone();
      });
    });

    /**
     * A placa da pista, ao lado do vão da borda — do lado de FORA da praça, na
     * neve pisada, para não virar obstáculo no meio da porta.
     */
    w.add(w.place(textSign('Pista de gelo', P.geloFundo), 11.4, 0, 26.7, 0.2));
    w.blockCircle(11.4, 26.7, 0.3);

    /**
     * O MANO, o pinguim sorveteiro — o primeiro bicho do parque.
     *
     * ONDE ELE FICA: na frente do balcão, do lado direito. Com o quiosque reto
     * na borda da praça, a normal da frente dele é `(0; 1)`; ele fica a 1,7 por
     * essa normal, bem fora do colisor (0,95 de meia profundidade), e desviado
     * 0,9 para `+X` para não ficar na linha entre o jogador e o balcão.
     *
     * A PRIMEIRA POSIÇÃO ERA COLADA DEMAIS (`13,0; 19,75`): dali o pilar da
     * direita do quiosque cortava metade dele no zoom de jogo. Um bicho de
     * posto tem que aparecer INTEIRO do lugar de onde se compra.
     *
     * ELE OLHA PARA O MESMO LADO QUE O BALCÃO (`rotation.y = 0`), que é para
     * `+Z` — de onde a câmera olha e de onde o cliente chega. De costas para o
     * quiosque e de frente para quem compra, como todo sorveteiro.
     *
     * A ÁREA É MENOR QUE O PASSO MÍNIMO do cérebro (0,7), então ele não sai do
     * posto: é a mesma coleira da Gina na portaria, e nenhuma linha de cérebro
     * mudou por causa disso.
     */
    const MANO = { x: SORVETERIA.x + 0.9, z: SORVETERIA.z + 1.7 };
    const mano = new Mano({
      minX: MANO.x - 0.12, maxX: MANO.x + 0.12,
      minZ: MANO.z - 0.1, maxZ: MANO.z + 0.1,
    });
    mano.group.rotation.y = 0;
    w.add(mano.group);
    mano.aoSoar = () => g.som('pinguim');

    /**
     * O POSTO DE CIMA — onde o Mano fica enquanto a dupla está na roda gigante.
     *
     * Uma das falas lá de cima é sobre ele ("olha o Mano lá embaixo"), e do
     * alto da roda ele estava ATRÁS do quiosque: a roda fica em (0; −26) e o
     * quiosque na borda da praça de gelo, então quem olha de lá vê o telhado, e
     * o Mano — que atende pela FRENTE — some por trás dele.
     *
     * Este ponto é o LADO do quiosque: 2,8 pelo eixo lateral dele, que com a
     * peça reta é o `+X` puro. A visada da roda sobe quase pelo Z (a razão
     * `x/z` da linha até aqui é 0,4), então esses 2,8 são quase todos
     * PERPENDICULARES a ela: sobram uns 2,6 fora da silhueta do quiosque,
     * folga de sobra sobre a meia-largura de 1,4. E o caminho até lá passa
     * raspando POR FORA do colisor, sem atravessar a peça.
     *
     * E ele fica OLHANDO PARA A RODA: se a fala é sobre ele, que ele esteja
     * olhando de volta.
     */
    const MANO_DE_LADO = { x: SORVETERIA.x + 2.8, z: SORVETERIA.z };
    const OLHANDO_A_RODA = Math.atan2(-MANO_DE_LADO.x, -26 - MANO_DE_LADO.z);

    /**
     * O CARINHO NO MANO tem PRIORIDADE sobre "Comprar sorvete".
     *
     * Os dois pontos se sobrepõem — o de comprar tem raio 2,4 e o Mano está
     * dentro dele —, e sem o desempate o cachorrinho na sua frente vira
     * cenário. O alvo mais específico ganha: é a mesma regra que o Walter e as
     * mesas do Mania já pagaram.
     *
     * MAS O RAIO PRECISA SER MENOR QUE A DISTÂNCIA ATÉ O PONTO DE COMPRAR, e a
     * primeira versão errou isso: com 1,05 de raio e o Mano a 0,92 da âncora de
     * "Comprar sorvete" (2 na frente do balcão), o carinho roubava o prompt de quem só
     * queria comprar — a ação principal do quiosque virava a difícil de achar.
     * Agora ele está a 0,95 da âncora e o raio é 0,8: parado onde se compra,
     * o prompt é comprar; um passo para cima dele, é o carinho.
     */
    const FALAS_DO_MANO = [
      'Ele bateu as asinhas. Acho que isso é oi.',
      'Ó o chapéu. O sorvete de cima parece de verdade.',
      'Mano, você é o melhor sorveteiro deste parque.',
      'Ele fica na ponta dos pés quando a gente chega.',
      'Se deixar, acho que ele dança de novo.',
    ];
    const carinhoNoMano = w.interact({
      id: 'parque:mano',
      x: mano.x, z: mano.z, radius: 0.8,
      label: 'Fazer carinho no Mano', icon: '🐧',
      highlight: mano.group,
      priority: 1,
      onInteract: async (api) => {
        mano.receberCarinho();
        api.som('pinguim');
        if (!api.flag('mano-conhecido')) {
          api.setFlag('mano-conhecido');
          await conversa([
            [R, 'Tem um pinguim atendendo o quiosque.'],
            [A, 'Tem um pinguim DE CHAPÉU DE CASQUINHA atendendo o quiosque.'],
            [R, 'Crachá e tudo. "Mano".'],
            [A, 'Oi, Mano.'],
          ]);
          // ele responde do jeito dele: uma dancinha curta de apresentação
          mano.dancar(1.8);
          api.unlock({
            id: 'mano-do-quiosque',
            title: 'O Mano',
            place: 'Parque Villa Lobos',
            note: 'O pinguim do quiosque de sorvete, de avental rosa e chapéu de casquinha. Ele dança quando fica feliz, e ele fica feliz sempre.',
            icon: '🐧',
          });
          return;
        }
        // de patins dele, ele repara — e aí a fala do carinho é a dele, e não
        // a da dupla comentando o chapéu de casquinha
        if (await falarDoPremio(api, 'mano')) return;
        await api.say([w.pick(FALAS_DO_MANO)], A);
      },
    });

    w.onUpdate((dt) => {
      mano.update(dt);
      // ele quase não sai do lugar, mas "quase" não é "nunca": sem isto o ponto
      // fica onde ele nasceu e o carinho vira um buraco no chão
      carinhoNoMano.moveTo(mano.x, mano.z);
      // jogando na arena ele não é mais o pinguim do balcão: sem isto o
      // "encarar" daqui de baixo o viraria de lado no meio do saque
      if (deServico('mano')) return;
      /**
       * O RÓTULO NÃO PODE PROMETER O QUE ELE NÃO VAI DAR. Com sorvete na mão
       * ele não vende outro, então o prompt deixa de dizer "pedir sorvete" e
       * passa a dizer "falar" — a pessoa aperta E sabendo o que vai acontecer.
       */
      const conversando = aindaTemSorvete();
      pedirSorvete.label = conversando ? 'Falar com o Mano' : 'Pedir sorvete pro Mano';
      pedirSorvete.icon = conversando ? '🐧' : '🍦';
    });

    /* ============================ O MANO REAGE A QUEM PASSA PATINANDO
     *
     * Ele trabalha ali porque gosta do friozinho; ver a dupla cruzando o
     * rinque de patins na frente do balcão é a melhor coisa do dia dele. Então
     * ele VIRA para acompanhar, bate as asas e grita.
     *
     * O GRITO É TOAST, e não diálogo: quem está patinando a 7 por segundo não
     * pode ser parado por um balão a cada volta — em três voltas a mecânica que
     * o Renan pediu viraria uma sala de espera. A ÚNICA vez em que ele para a
     * dupla de verdade é a primeira, que é quando há o que dizer.
     *
     * E ele volta a olhar para a frente depois. Sem isso o pinguim fica torto
     * para sempre, encarando um ponto onde já não tem ninguém.
     */
    const GRITOS_DO_MANO = [
      'Isso! Mais uma volta!',
      'Curva bonita, hein!',
      'Devagar na quina! Devagar!',
      'Eu não patino: eu escorrego. É diferente.',
      'Vai, vai, vai!',
      'Se cair, cai rindo!',
    ];
    /**
     * Quanto falta para ele poder gritar de novo, e quanto falta para desvirar.
     *
     * SEIS SEGUNDOS E MEIO entre um grito e outro: é o tempo de uma volta no
     * rinque. Menos que isso e ele vira alarme — a mesma razão pela qual o
     * barulho espontâneo dos bichos é espaçado.
     */
    let esperaDoGrito = 0;
    let olhandoAte = 0;

    w.onUpdate((dt) => {
      if (esperaDoGrito > 0) esperaDoGrito -= dt;
      if (olhandoAte > 0) {
        olhandoAte -= dt;
        // de volta ao balcão: o posto dele olha para +Z, que é de onde o
        // cliente chega
        if (olhandoAte <= 0) mano.group.rotation.y = 0;
      }

      if (cenaDoGelo || esperaDoGrito > 0) return;
      if (escorregando < 0.7 || !dePatins() || velocidadeNoGelo < 3.2) return;
      const onde = g.playerPosition();
      // 5,5 é o alcance de um grito de balcão: passar pelo outro lado do
      // rinque (13 de largura) não puxa reação nenhuma
      if (Math.hypot(onde.x - mano.x, onde.z - mano.z) > 5.5) return;

      esperaDoGrito = 6.5;
      olhandoAte = 2.8;
      mano.group.rotation.y = Math.atan2(onde.x - mano.x, onde.z - mano.z);
      mano.dancar(1.1);
      g.som('pinguim');

      /**
       * A PRIMEIRA VEZ ELE PARA A DUPLA — e só depois que a primeira volta já
       * aconteceu (`patinou-no-gelo`). As duas cenas moram no mesmo rinque e
       * disparam com a mesma condição; sem esta ordem elas se atropelariam na
       * mesma passada, uma conversa por cima da outra.
       */
      if (!g.flag('mano-viu-patinar') && g.flag('patinou-no-gelo')) {
        cenaDoGelo = true;
        void (async () => {
          g.setFlag('mano-viu-patinar');
          g.lockPlayer(true);
          await g.say(['VOCÊS PATINAM!'], 'Mano');
          await conversa([
            [A, 'A gente alugou na lojinha ali.'],
            [R, 'No gelo eles pegam de verdade.'],
          ]);
          await g.say([
            'Eu tenho pé de pato. Eu escorrego, que não é a mesma coisa.',
            'Mas eu fico olhando. É o melhor dia quando tem gente patinando aqui.',
          ], 'Mano');
          mano.dancar(2.2);
          await conversa([[A, 'Depois a gente te ensina.']]);
          await g.say(['EU VOU QUERER.'], 'Mano');
          g.lockPlayer(false);
          cenaDoGelo = false;
        })();
        return;
      }

      g.toast(`Mano: ${w.pick(GRITOS_DO_MANO)}`, '🐧');
    });

    // --------------------------------------------------- loja de patins
    const loja = w.add(fundir(w.place(lojaDePatins(), LOJA.x, 0, LOJA.z)));
    // o teste acha a loja por aqui para comparar o colisor com o desenho
    loja.userData.loja = true;
    /**
     * A colisão, lida de `LOJA_DE_PATINS`: o prédio (do fundo até a floreira e
     * o degrau da porta, na frente) e o balcão do aluguel. Os toldos e o
     * letreiro não entram: passam bem acima da cabeça.
     * `scripts/lojaDePatins.mjs` confere que nada da loja na altura do corpo
     * fica fora destas caixas.
     */
    {
      const L = LOJA_DE_PATINS;
      w.blockBox(LOJA.x, LOJA.z + (L.frente - L.meiaZ) / 2, L.meiaX, (L.frente + L.meiaZ) / 2);
      w.blockBox(BALCAO.x, BALCAO.z, L.balcao.meiaX, L.balcao.meiaZ);
    }

    // bancos de calçar, na lateral livre da loja — e não mais perto do lago
    // que isto, senão eles sentam na areia
    for (const dz of [-1.4, 1.0]) w.banco(LOJA.x - 5.6, LOJA.z + dz, Math.PI / 2);

    for (const [x, z] of [
      [PISTA.x - PISTA.reta - PISTA.raio - 1.4, PISTA.z],
      [PISTA.x + PISTA.reta + PISTA.raio + 1.4, PISTA.z],
    ] as const) {
      w.add(w.place(lamp(false), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    // Circuito de zigue-zague na raia, alternando entre a borda de fora e a de
    // dentro. SEM colisor de propósito — cone que barra o passo vira parede, e
    // a graça é desviar.
    const CONES = 14;
    for (let i = 0; i < CONES; i++) {
      const a = (i / CONES) * Math.PI * 2;
      // o raio alterna, e o comprimento da reta entra só no eixo X: é o que
      // espalha os cones ao longo do oval e não em volta de um círculo
      const r = i % 2 === 0 ? PISTA.miolo + 0.9 : PISTA.raio - 0.9;
      const x = PISTA.x + Math.cos(a) * r + Math.sign(Math.cos(a)) * PISTA.reta * Math.abs(Math.cos(a));
      const z = PISTA.z + Math.sin(a) * r;
      w.add(w.place(cone(), x, 0, z, w.range(0, 6.28)));
    }

    w.interact({
      id: 'parque:patins',
      x: BALCAO.x + 1.8, z: BALCAO.z, radius: 2.4,
      label: 'Alugar patins', icon: '🛼',
      highlight: loja,
      onInteract: async (api) => {
        if (api.hasItem(ITENS.patins.id)) {
          await conversa([
            [R, 'A gente já pegou um par.'],
            [A, 'É, e eu ainda não caí. Ainda.'],
          ]);
          return;
        }
        await conversa([
          [R, 'Um par pra cada um, moço.'],
          [A, 'Eu não sei patinar direito, hein.'],
          [R, 'Por isso eu vou do seu lado.'],
        ]);
        api.equipWearable(ITENS.patins);
        api.som('sorvete'); // a mesma sineta de "toma, é seu" dos quiosques
        api.toast('Patins calçados', '🛼');
        api.unlock({
          id: 'patins-villa',
          title: 'Patins no Villa',
          place: 'Parque Villa Lobos',
          note: 'A pista tem cone pra desviar e a gente desviou de quase todos.',
          icon: '🛼',
        });
      },
    });

    /**
     * ============================ A LOJINHA DE ROUPAS (o "mini shopping")
     *
     * ONDE: a ponta oeste do parque, de costas para o rio. A faixa
     * `x −48…−28 · z −30…−6` foi MEDIDA — varrendo as peças da cena, ali só
     * existiam árvores do espalhador (e uma nuvem, a 66 de altura).
     *
     * ELA É A ÚNICA PEÇA DO JOGO COM A FACHADA EM `+X`, e é de propósito. A
     * convenção do repositório é fachada para `+Z` porque a câmera vem da
     * diagonal `+X/+Z` — mas quem decide se uma fachada aparece é o produto
     * escalar com essa diagonal, e ele dá 0,707 tanto para `+Z` quanto para
     * `+X`: as duas são vistas de meio perfil, do mesmo jeito. O que manda aqui
     * é o mundo: o rio corre ao longo do `Z`, então uma loja PARALELA AO RIO
     * tem as costas em `−X` (a água) e a porta em `+X` (o resto do parque).
     *
     * A CONTA DA CÂMERA fica até mais folgada que na esquina da rua: 8,2 de
     * altura escondem 12,2 de chão na diagonal, e a partir daqui essa faixa
     * cega cai em `(−48,6; −13,6)` — fora do mundo caminhável, que termina em
     * `x = −44`. Não há nada atrás dela para esconder.
     *
     * A FOLGA ATÉ A PISTA decidiu as DUAS coordenadas:
     *
     *  - o `x`, porque o oval de patins chega a `x = −31` e o prédio (que
     *    avança 5,2 pela frente a partir do centro) para em `−34,8`: sobram
     *    3,8 de calçada entre a vitrine e o asfalto — espaço para a dupla
     *    parar na frente e para a ovelha ficar no posto;
     *  - o `z`, que saiu de `−5` para `−16,5`. Em `−5` a loja ficava bem de
     *    frente para a pista, e não havia meio-termo: ela tem 11,6 de
     *    comprimento e a pista ocupa `z −10…0`, então qualquer deslocamento
     *    menor que onze deixaria metade dela ainda na frente. Daqui a ponta
     *    dela para em `−10,7`, com 70 cm de folga da boca da pista.
     */
    const LOJINHA = { x: -40, z: -16.5 };
    // fundida: as pecas de mesmo material viram uma malha so (`world/fundir.ts`)
    w.add(fundir(w.place(lojaDeRoupas(), LOJINHA.x, 0, LOJINHA.z, Math.PI / 2)));
    /*
     * O COLISOR DO PRÉDIO PARA NA LINHA DOS VASOS, e não um metro antes dela.
     *
     * Medido na peça: a parede da vitrine está em `x = −34,8` e os vasos da
     * calçada avançam até `−35,45`; o capacho (4 cm de altura) é o único que
     * passa disso, e capacho não barra ninguém. A caixa ia até `−35,8`, o que
     * deixava a dupla parada meio metro antes dos vasos, olhando a vitrine de
     * longe sem nada no caminho. Agora a frente do colisor é a própria linha dos
     * vasos: dá para encostar na vitrine, e não dá para atravessar um vaso de
     * 1,3 de altura.
     *
     * Os fundos continuam em `−44,3`, que é onde a parede de trás encosta no
     * barranco do rio: centro em `−39,87` com meia-profundidade de 4,43.
     */
    w.blockBox(-39.87, LOJINHA.z, 5.7, 4.43, Math.PI / 2);
    /*
     * A CALÇADA CORRE NA FRENTE, ao longo do `Z` como a loja: da esquina do
     * prédio até a beira da pista. É por ela que se chega — quem vem do parque
     * contorna a pista de patins e sai de frente para a vitrine.
     */
    w.patch(-33.2, -15, 4.4, 16, P.concrete, 0, 0.015, calcadaDePedrinha());

    /**
     * ---------------------------------- A ESTELLA, A OVELHA QUE CUIDA DA LOJA
     *
     * O nome e o jeito sao do Renan: ela tem MUITO orgulho das roupinhas que
     * cria, e e obcecada por elas — nenhum modelo sai da loja sem passar pela
     * aprovacao dela. E ela adora dar brinde em docinho: foi ela que fez o
     * uniforme de bilheteiro do Cookie, e no dia da entrega deu um biscoitinho
     * pra ele. Ele amou.
     *
     * ONDE ELA FICA saiu de uma conta que ja estava escrita no predio: o toldo
     * avanca 1,05 da fachada, e a camera de 34° faz cada peca esconder 1,5 vez
     * a propria altura de chao atras dela — quem ficar debaixo do toldo aparece
     * decapitado. A fachada esta em `x = −34,8`, entao qualquer coisa a mais de
     * 2 dali aparece inteira. Ela esta a 2,2, na calcada (que vai de −35,4 a
     * −31), bem na frente da porta.
     *
     * ELA OLHA PARA `+X`, que e para o resto do parque: de costas para a
     * vitrine e de frente para quem chega, como toda lojista de porta de loja.
     *
     * A AREA E MENOR QUE O PASSO MINIMO do cerebro (0,7), e e so isso que a
     * segura no posto — a mesma coleira da Gina na portaria e do Mano no
     * quiosque. Nenhuma linha de cerebro mudou por causa dela.
     */
    const ESTELLA = { x: -32.6, z: -16.5 };
    const estella = new Estella({
      minX: ESTELLA.x - 0.12, maxX: ESTELLA.x + 0.12,
      minZ: ESTELLA.z - 0.12, maxZ: ESTELLA.z + 0.12,
    });
    estella.group.rotation.y = Math.PI / 2;
    w.add(estella.group);
    estella.aoSoar = () => g.som('balido');

    /*
     * A CESTA DE BISCOITO FICA DO LADO DELA, e ela existe para o brinde nao sair
     * do nada: quando a Estella entrega um biscoitinho, ele vem de um lugar que
     * ja estava ali na tela. Ela vai no `+Z` (o lado da camera) e um pouco a
     * frente, fora da sombra do toldo pela mesma conta que vale para a ovelha.
     */
    const CESTA = { x: ESTELLA.x + 0.25, z: ESTELLA.z + 1.05 };
    w.add(w.place(cestaDeBiscoitos(), CESTA.x, 0, CESTA.z, 0.3));
    // e o caixote da cesta tinha o problema CONTRARIO do tabuleiro: um caixote
    // de 46 cm no meio da calcada que a dupla atravessava como fantasma
    w.blockCircle(CESTA.x, CESTA.z, 0.34);

    /*
     * A MESINHA DE XADREZ, a outra paixao dela (o Renan contou depois): fica na
     * calcada, do lado de la da ovelha, com uma partida no meio esperando
     * adversario. Ela vai a 2,2 dela pelo `−Z`, longe o bastante para nao
     * roubar o prompt de falar (raio 1,3) e perto o bastante para ler como
     * "aquilo ali e dela".
     *
     * E ela e BAIXA (0,66 no tampo): pela conta da camera esconde 1,5 × 0,66 ≈
     * 1 de chao atras de si, e a ovelha esta no `+Z` dela — na frente, do lado
     * da camera. Mesinha nenhuma tapa costureira nenhuma.
     */
    /*
     * A PORTA DA LOJA. Ela fica no meio da fachada (`x = −34,8`), e o colisor do
     * predio para na linha dos vasos (`−35,45`) — o centro da dupla alcanca
     * `−35,03`, a 23 cm da porta. Raio 1,8 pega de longe o suficiente para o
     * prompt aparecer antes de a dupla encostar na parede.
     */
    w.door({
      x: -34.9, z: -16.5, radius: 1.8,
      to: 'lojinha', entry: 'da-calcada',
      label: 'Entrar na lojinha', icon: '👗',
    });

    const XADREZ = { x: ESTELLA.x - 0.15, z: ESTELLA.z - 2.2 };
    w.add(w.place(mesinhaDeXadrez(), XADREZ.x, 0, XADREZ.z, -0.35));
    /**
     * O COLISOR É UM CÍRCULO, do tamanho da mesa — o mesmo que as mesinhas da
     * praça de gelo usam.
     *
     * Ele nasceu como `blockBox(…, 1.7, 1.0, …)`, e isso era um MURO INVISÍVEL:
     * o `blockBox` recebe MEIA largura e MEIA profundidade, então aquilo era uma
     * caixa de 3,4 × 2,0 para uma mesa de 0,84 de diâmetro. A calçada aqui tem
     * 4,4 de largura e a caixa atravessava quase toda ela — dava para ver a
     * mesinha e não dava para passar do lado dela, que é justamente onde a dupla
     * para para jogar. O Renan esbarrou nisso na primeira partida.
     *
     * 0,95 de raio cobre o tampo (0,42) e os dois banquinhos, que chegam a 0,81
     * do centro. Sobram 1,3 de passagem para o lado da rua e 1,7 para o lado da
     * vitrine: a dupla circula a mesa inteira sem esbarrar em nada que não veja.
     */
    w.blockCircle(XADREZ.x, XADREZ.z, 0.95);

    const E = 'Estella';
    /*
     * O QUE ELA FALA depois de apresentada, e sao as duas obsessoes dela: a
     * roupa que ela mesma fez e o docinho. Nada aqui promete a loja aberta —
     * entrar para comprar e o proximo pedaco.
     */
    const FALAS_DA_ESTELLA = [
      'Essa costura aqui? Minha. Ponto por ponto.',
      'Nada sai desta porta sem eu aprovar. Nada.',
      'Deixa eu ver essa manga... hm. Podia subir dois dedos.',
      'Come um biscoitinho. Come, vai.',
      'Eu meço vocês dois de olho fechado, viu.',
      'Roupa boa é roupa que a pessoa esquece que tá usando.',
      'Tá vendo aquele tabuleiro? Tá esperando vocês.',
      'Eu jogo de brancas, mas dou as pretas pra vocês. Sou boa demais.',
      'Costura e xadrez é a mesma coisa: é ver o final antes de começar.',
    ];
    const falarComEstella = w.interact({
      id: 'parque:estella',
      x: estella.x, z: estella.z, radius: 1.3,
      label: 'Falar com a Estella', icon: '🐑',
      highlight: estella.group,
      onInteract: async (api) => {
        const eu = api.playerPosition();
        estella.encarar(eu.x, eu.z);
        estella.receberCarinho();
        api.som('balido');
        if (!api.flag('estella-conhecida')) {
          api.setFlag('estella-conhecida');
          await conversa([
            [R, 'Tem uma ovelha de óculos na porta da loja.'],
            [E, 'Tem uma COSTUREIRA de óculos na porta da loja dela. Estella.'],
            [A, 'Oi, Estella.'],
            [E, 'Oi, meus amores. Vocês repararam na vitrine? Repararam?'],
            [E, 'Eu que fiz. Tudo. Cada bainha daquilo passou por aqui ó, por este olho.'],
            [R, 'A senhora faz roupa pro parque inteiro?'],
            [E, 'Faço. E nada sai daquela porta sem eu aprovar. NADA.'],
          ]);
          /*
           * O UNIFORME DO COOKIE E DELA, e e por isso que a manta, o quepe e o
           * cracha dele saem nas cores da bilheteria: quem costurou foi ela.
           * Esta fala e a costura entre as duas fichas.
           */
          await conversa([
            [E, 'Viu o elefante da bilheteria? A mantinha dele, o quepe, o crachá.'],
            [A, 'O Cookie.'],
            [E, 'O Cookie. Aquilo é meu. Provei três vezes na orelha dele até cair certo.'],
            [E, 'E quando ficou pronto eu dei um biscoitinho pra ele. Ele quase chorou.'],
            [R, 'Biscoitinho?'],
          ]);
          /*
           * E ELA JA DA O BRINDE. Um para cada — a mesma regra dos sorvetes do
           * Mano: o que decide nao e o sabor, e de quem e a mao.
           */
          estella.oferecerBiscoito(4);
          api.addItem(ITENS.biscoitoDaEstella, ARI.id);
          api.addItem(ITENS.biscoitoDaEstella, RENAN.id);
          api.som('sorvete');
          api.toast('Biscoitinho da Estella', '🍪');
          await conversa([
            [E, 'Biscoitinho. Toma, um pra cada. Ninguém sai da minha porta de mão vazia.'],
            [A, 'Obrigado, Estella.'],
            [E, 'Voltem quando eu abrir. Vou vestir vocês dois de cima a baixo.'],
          ]);
          /*
           * E O TABULEIRO. Ela mesma aponta para a mesinha que ja estava ali na
           * calcada — o objeto veio primeiro, a fala explica.
           */
          await conversa([
            [R, 'A senhora tem um tabuleiro de xadrez montado ali fora.'],
            [E, 'Tenho. Montado e no meio de uma partida, que é como eu gosto.'],
            [E, 'Ninguém aqui joga comigo. O elefante é grande demais pra cadeirinha, o pinguim derruba as peças.'],
            [A, 'A gente joga.'],
            [E, 'AH. Vocês jogam?'],
            [E, 'Então guarda esse biscoito pra depois da partida. Eu volto pra esse tabuleiro todo dia.'],
          ]);
          api.unlock({
            id: 'estella-da-lojinha',
            title: 'A Estella',
            place: 'Parque Villa Lobos',
            note: 'A ovelha costureira da lojinha de roupas do parque: óculos de meia-lua, fita métrica no pescoço e alfinete espetado na lã. Tem orgulho de cada costura que faz — nada sai da loja sem a aprovação dela — e não deixa ninguém ir embora sem um biscoitinho. O uniforme do Cookie é dela. E ela ama xadrez: tem um tabuleiro montado na calçada, sempre no meio de uma partida, esperando alguém sentar.',
            icon: '🐑',
          });
          return;
        }
        /*
         * DEPOIS DE APRESENTADA, FALAR COM ELA E TAMBEM CONVIDAR PARA JOGAR.
         *
         * O tabuleiro tem o ponto dele na calcada, mas quem chega perto da
         * ovelha e nao repara na mesinha ficaria sem saber que da para jogar —
         * e a partida e a coisa mais legal que ela tem. Duas portas para a
         * mesma mesa.
         */
        /*
         * ELA REPARA NA ROUPA ANTES DE QUALQUER OUTRA COISA — é a Estella, e
         * ela é assim com a roupa de qualquer um. A pergunta vem depois, e o
         * "oi" genérico só entra se ela NÃO tiver reparado em nada.
         */
        const notou = await falarDoPremio(api, 'estella');
        const escolha = await api.ask('Falar com ela', ['Jogar xadrez', 'Só um oi'], E);
        if (escolha === 0) {
          await partidaDeXadrez(api);
          return;
        }
        if (!notou) await api.say([w.pick(FALAS_DA_ESTELLA)], E);
      },
    });

    /**
     * ============================== A PARTIDA DE XADREZ CONTRA A ESTELLA
     *
     * A cena nao sabe uma regra de xadrez, e a tela tambem nao: as duas so
     * perguntam ao motor (`entities/ChessEngine.ts`, que embrulha a `chess.js`).
     * O que mora aqui e o que e DELA — as falas, a cor com que ela joga, o que
     * acontece depois do mate.
     *
     * A DUPLA JOGA DE BRANCAS porque quem comeca ataca, e porque e ela mesma
     * quem oferece isso na fala ("dou as pretas pra vocês, sou boa demais").
     *
     * O `lockPlayer` some com o joystick enquanto a mesa esta aberta, e o
     * `finally` devolve o controle aconteca o que acontecer — desistir no
     * Escape, mate em quatro lances ou fechar no meio. Cutscene que trava e
     * esquece de soltar e o pior defeito possivel.
     */
    const provocacoesDaEstella = [
      'Meu cavalo já previu seus próximos 3 movimentos.',
      'Você vai entregar seu bispo assim de bandeja? Bééé...',
      'Eu jogo isso desde antes de você nascer. E eu tenho quatro anos.',
      'Hmm. Interessante. Errado, mas interessante.',
      'Já vi essa abertura. Terminou mal pra quem jogou.',
      'Pensa com calma. Eu tenho o dia todo, meu amor.',
    ];
    let partidasGanhas = 0;

    const partidaDeXadrez = async (api: GameAPI): Promise<void> => {
      estella.encarar(api.playerPosition().x, api.playerPosition().z);
      await api.say(['Bééé... acha que tem raciocínio rápido suficiente para me vencer?'], E);
      api.lockPlayer(true);
      try {
        /*
         * A SEMENTE MUDA A CADA PARTIDA (`lancesFeitos` de nada adianta aqui —
         * o motor e novo). Sem isso ela repetiria a mesma partida inteira toda
         * vez que a dupla sentasse, e a segunda partida seria um replay.
         */
        const motor = api.motorDeXadrez('brancas', 20260908 + partidasGanhas * 7919 + Math.floor(Date.now() / 1000) % 100000);
        const fim = await api.abrirXadrez(motor, {
          nome: 'Estella',
          avatar: '🐑',
          provocacoes: provocacoesDaEstella,
          ganhou: 'Xeque-mate, meu amor. Eu avisei. Bééé.',
          perdeu: 'Não. NÃO. Isso não aconteceu. Joga de novo.',
          empatou: 'Empate. Empate é o xadrez dizendo que vocês dois têm razão.',
        });
        estella.receberCarinho();
        if (fim === 'ganhei') {
          partidasGanhas++;
          await conversa([
            [E, 'Eu... você... QUE?'],
            [A, 'A gente ganhou.'],
            [E, 'Ganharam. Ganharam mesmo. Ninguém nunca me ganhou.'],
            [E, 'Toma outro biscoitinho. Você merece. Os dois merecem.'],
          ]);
          api.addItem(ITENS.biscoitoDaEstella, ARI.id);
          api.addItem(ITENS.biscoitoDaEstella, RENAN.id);
          api.som('sorvete');
          api.toast('Biscoitinho da Estella', '🍪');
          api.unlock({
            id: 'xadrez-com-a-estella',
            title: 'A partida com a Estella',
            place: 'Parque Villa Lobos',
            note: 'A ovelha da lojinha se acha a maior mestra de xadrez do parque, e passou a partida inteira dizendo que o cavalo dela já tinha previsto tudo. A gente ganhou dela. Ela ficou uns três segundos sem falar, e depois deu biscoitinho pros dois.',
            icon: '♟️',
          });
        } else if (fim === 'perdi') {
          await conversa([
            [E, 'Não fica assim. Perder pra mim não é vergonha nenhuma.'],
            [R, 'Ela é boa mesmo.'],
            [E, 'Eu sou ÓTIMA. Senta aí de novo quando quiser.'],
          ]);
        } else if (fim === 'empate') {
          await api.say(['Empate. Isso quer dizer que vocês quase me ganharam. QUASE.'], E);
        } else {
          await api.say(['Ah, desiste não... o tabuleiro fica aqui, viu.'], E);
        }
      } finally {
        api.lockPlayer(false);
      }
    };

    /*
     * O PONTO DA MESA fica do lado do banquinho, e nao no meio do tabuleiro:
     * o raio de 1,6 pega quem chega pela calcada, e o prompt aparece antes de a
     * dupla esbarrar no colisor da mesinha.
     */
    w.interact({
      id: 'parque:xadrez',
      x: XADREZ.x + 0.9, z: XADREZ.z + 0.5, radius: 1.6,
      label: 'Jogar xadrez com a Estella', icon: '♟️',
      onInteract: async (api) => {
        if (!api.flag('estella-conhecida')) {
          /*
           * NINGUEM JOGA COM UM TABULEIRO DE ESTRANHO. Sem conhecer a Estella, a
           * mesinha e so uma mesinha — e a fala manda falar com ela, que e onde
           * a partida comeca de verdade.
           */
          await conversa([
            [R, 'Tem uma partida no meio aqui.'],
            [A, 'É de alguém. Olha a ovelha ali na porta olhando pra gente.'],
          ]);
          return;
        }
        await partidaDeXadrez(api);
      },
    });

    w.onUpdate((dt) => {
      estella.update(dt);
      // ela quase não sai do lugar, mas "quase" não é "nunca": sem isto o ponto
      // fica onde ela nasceu e a conversa vira um buraco na calçada
      falarComEstella.moveTo(estella.x, estella.z);
      // jogando na arena ela não está na porta da loja: sem isto o "voltar a
      // olhar a rua" daqui de baixo a viraria de costas para a mesa
      if (deServico('estella')) return;
      /*
       * LONGE DELA, ELA VOLTA A OLHAR A RUA — e o jeito de fazer isso é mandar
       * ela encarar um ponto lá no `+X`, e não largar o alvo: `pararDeEncarar`
       * só solta o volante, e ela ficaria torta para sempre no ângulo em que o
       * último cliente a deixou. Foi o que o Mano já pagou no quiosque.
       */
      const eu = g.playerPosition();
      if (Math.hypot(eu.x - estella.x, eu.z - estella.z) > 4) {
        estella.encarar(ESTELLA.x + 5, ESTELLA.z);
      }
    });

    // ------------------------------------------------------------ vegetacao
    const proibido: Array<[number, number, number]> = [
      [0, -26, 20], [-21, 11, 12], [18, -4.5, 17], [0, 4, 6], [0, 9, 6],
      /**
       * O CÍRCULO DA SORVETERIA FOI DE 4 PARA 6,5 quando o Mano chegou.
       *
       * Com 4, uma palmeira caía em `(14,2; 22,5)` — a 4,13 do centro, escapando
       * por treze centímetros — e ela ficava bem NA FRENTE do quiosque. Copa de
       * palmeira a 3,5 de altura esconde 1,5 × (3,5 − 1) ≈ 3,7 de tudo o que
       * tiver um metro atrás dela, e o Mano tem exatamente um metro: ele sumia
       * inteiro atrás da folha, sobrando só a bolinha de sorvete do chapéu.
       * O quiosque continuava aparecendo porque ele é alto — a regra é a altura
       * do que está atrás, não a distância.
       *
       * E DE 6,5 FOI PARA 10 quando a praça de gelo tomou o lugar do gramado: a
       * meia-diagonal do piso é 8,7, e árvore plantada em cima do rinque seria
       * árvore nascendo dentro do gelo.
       */
      [PRACA.x, PRACA.z, 10],
      /**
       * A ARENA DE PING PONG E A MESA DE PIQUENIQUE, com folga de verdade.
       *
       * O raio antigo da mesa de piquenique era 3, e 3 não chega: a copa de uma
       * árvore de escala 1,5 tem quase 2 de raio e a câmera esconde 1,5 × h de
       * chão atrás de cada uma. Sobrava uma moita plantada bem na diagonal
       * `(+X, +Z)` da mesa — o único lugar de onde ela realmente some — e da
       * foto do Renan não dava para ver que ali tinha mesa.
       *
       * A arena leva 9,2, e não os 7,8 da primeira tentativa: com 7,8 nascia
       * uma árvore no vão entre o tablado e a mesa de piquenique, e da foto
       * ela escondia o suporte de raquetes E a dupla inteira. A meia-diagonal
       * do tablado é 6; o resto é a copa (quase 2 de raio numa escala 1,5) mais
       * a folga da sombra da câmera. A clareira é o ponto: área de esporte no
       * meio do mato não se acha.
       */
      [ARENA.x, ARENA.z, 9.2], [PIQUENIQUE.x, PIQUENIQUE.z, 5],
      // a pista e a loja entram na lista pelo mesmo motivo da praça da roda:
      // sem isto o espalhador planta árvore em cima do asfalto
      [-21, -5, 12], [-8.6, 2.5, 9],
      // a lojinha: 11 de raio cobre o prédio (11,6 × 9,5) e a calçada dele.
      // Sem isto o espalhador planta árvore dentro da vitrine
      [-40, -16.5, 11],
    ];
    const livre = (x: number, z: number): boolean => {
      if (Math.abs(x) < 4 && z > -20 && z < 30) return false;
      // A RUA INTEIRA, e não um círculo em volta do ponto: o espalhador vai até
      // `x = 42`, e a calçada começa em `33,6` — era isso que plantava árvore no
      // meio do asfalto longe do ponto de ônibus.
      if (x > 33.2) return false;
      return !proibido.some(([px, pz, r]) => Math.hypot(x - px, z - pz) < r);
    };

    /**
     * A CLAREIRA ATRÁS DO LAGO (`docs/ACAMPAMENTO.md`): o lugar dos dois, com
     * a barraca. Ela é aberta NO MEIO do bosque do sorteio, e o sorteio não
     * muda: a árvore que cai dentro dela continua sendo sorteada e contada
     * (senão todo `w.range()` depois dela andaria, e o parque inteiro se
     * mexeria), só não entra no mundo — nem a malha, nem o colisor.
     *
     * A JANELA DA CÂMERA: a câmera vem do `+X/+Z`, e árvore desse lado tapa a
     * barraca (a conta do ponto cego: uma copa de 4 m come 6 m de chão atrás
     * dela). A faixa da diagonal, até 9 m, fica sem árvore alta — o bosque
     * fecha a clareira pelo fundo e pelos lados, e na frente só tem moita e
     * samambaia. Árvore translúcida está descartada (decisão do Renan).
     */
    const CLAREIRA = { x: -38.5, z: 12.5, raio: 4.6 };
    const naClareira = (x: number, z: number, folga = 0): boolean => {
      const dx = x - CLAREIRA.x;
      const dz = z - CLAREIRA.z;
      if (Math.hypot(dx, dz) < CLAREIRA.raio + folga) return true;
      const adiante = (dx + dz) / Math.SQRT2;
      const deLado = Math.abs(dx - dz) / Math.SQRT2;
      return adiante > 0 && adiante < 9 && deLado < 3.4 + folga;
    };

    const kinds = ['redonda', 'redonda', 'pinheiro', 'florida', 'palmeira'] as const;
    let plantadas = 0;
    for (let i = 0; i < 260 && plantadas < 64; i++) {
      const x = w.range(-42, 42);
      const z = w.range(-32, 30);
      if (!livre(x, z)) continue;
      const scale = w.range(0.85, 1.5);
      // a MESMA ordem de sorteio de sempre (o tipo, a semente, o giro)
      const arvore = w.place(tree(w.pick(kinds), scale, w.rng()), x, 0, z, w.range(0, 6.28));
      plantadas++;
      // a que cai no caminho também fica de fora: o espalhador só conhecia o
      // principal, e plantava árvore no meio do transversal e da boca do vão
      if (naClareira(x, z, 0.9) || caminho(x, z) < 0.5 * scale) continue;
      w.add(arvore);
      w.blockCircle(x, z, 0.45 * scale);
    }
    /*
     * O QUE ESTE SORTEIO PLANTA FICA ANOTADO, e só isso muda nele: o piquenique
     * da Luna (mais abaixo) esconde o que caiu no lugar dele. Tirar o canteiro
     * do sorteio com o `livre()` pularia um `w.range()` do arbusto e mudaria a
     * posição de TUDO que é sorteado depois — o parque inteiro se mexeria para
     * abrir espaço para uma toalha.
     */
    const soltosNoGramado: THREE.Object3D[] = [];
    for (let i = 0; i < 90; i++) {
      const x = w.range(-42, 42);
      const z = w.range(-32, 30);
      if (!livre(x, z)) continue;
      // o sorteio igual de sempre; o que cai dentro da clareira não entra
      const solto = i % 3 === 0 ? w.place(flowers(6, 1.1), x, 0, z)
        : i % 3 === 1 ? w.place(bush(w.range(0.7, 1.2)), x, 0, z)
          : w.place(rock(w.range(0.5, 1)), x, 0, z);
      if (Math.hypot(x - CLAREIRA.x, z - CLAREIRA.z) < CLAREIRA.raio + 0.5) continue;
      if (caminho(x, z) < 0.6) continue;
      soltosNoGramado.push(w.add(solto));
    }

    montarAClareira();

    /**
     * ================================================ A CLAREIRA ATRÁS DO LAGO
     *
     * O lugar dos dois (pedido do Renan, ideia do Ari): uma clareira no meio do
     * bosque, uns 8 m atrás da água, com a barraca iglu laranja e cinza, os
     * colchões no chão, o fogareiro de montanha e a canga. O plano inteiro, com
     * as etapas que ainda vêm (a noite, as brincadeiras), está em
     * `docs/ACAMPAMENTO.md`; as peças, em `world/acampamento.ts`.
     *
     * A BARRACA OLHA PARA A CÂMERA (a porta em `+X/+Z`), com a canga e a
     * mesinha do fogareiro na frente dela e as mochilas do lado. As árvores
     * fecham a clareira num arco pelo fundo e pelos lados; o varal de
     * luzinhas passa entre duas delas, atrás da barraca. Na frente, do lado de
     * onde a câmera olha, só samambaia e moita (ver `naClareira`).
     *
     * A TRILHA sai da margem do lago e entra na clareira entre as samambaias,
     * sem placa nenhuma: o lugar é deles.
     */
    function montarAClareira(): void {
      const CL = CLAREIRA;
      const GIRO = Math.PI / 4;
      const TENDA = { x: CL.x - 0.9, z: CL.z - 0.9 };
      const cos = Math.cos(GIRO);
      const sen = Math.sin(GIRO);
      /** um ponto no referencial da barraca (a porta em `+Z`) levado para o mundo */
      const daTenda = (lx: number, lz: number): { x: number; z: number } => ({
        x: TENDA.x + lx * cos + lz * sen,
        z: TENDA.z - lx * sen + lz * cos,
      });

      // ---------------------------------------------------------------- o chão
      // a grama da clareira um tom mais escura (mais sombra, mais pisada), e a
      // terra gasta na frente da barraca, onde eles passam
      w.disc(CL.x, CL.z, CL.raio + 0.5, P.grassDark, 0.004);
      /*
       * A TERRA BATIDA — a gasta na frente da barraca e a trilha da margem do
       * lago até a clareira — é UM decalque só: o primeiro disco entra na fila
       * de pintura do chão pelo `w.disc`, e a geometria dele vira a união de
       * todos os círculos (a mesma cor, sem profundidade: sobrepor não muda
       * nada). Eram 23 desenhos por quadro para a mesma mancha.
       */
      const gasto = daTenda(0.3, 2.4);
      const gasto2 = daTenda(0.9, 1.6);
      const circulos: Array<[number, number, number]> = [[gasto.x, gasto.z, 1.7], [gasto2.x, gasto2.z, 1.05]];
      const TRILHA: Array<[number, number]> = [[-30.9, 15.6], [-32.2, 15.4], [-33.4, 14.9], [-34.6, 14.3], [-35.6, 13.9]];
      const trilha = new THREE.CatmullRomCurve3(TRILHA.map(([x, z]) => new THREE.Vector3(x, 0, z)));
      for (let k = 0; k <= 20; k++) {
        const p = trilha.getPointAt(k / 20);
        circulos.push([p.x, p.z, 0.5 + 0.08 * Math.sin(k * 1.7)]);
      }
      const terra = w.disc(gasto.x, gasto.z, 1.7, P.trilhaDeTerra, 0.006);
      // o disco está deitado (`rotation.x = -π/2`): o `y` local dele é o `-z` do mundo
      const uniao = mergeGeometries(circulos.map(([x, z, r]) => new THREE.CircleGeometry(r, 28).translate(x - gasto.x, -(z - gasto.z), 0)));
      if (uniao) {
        terra.geometry.dispose();
        terra.geometry = uniao;
      }

      // ---------------------------------------------------------- a barraca
      const barraca = barracaIglu();
      barraca.add(interiorDaBarraca());
      w.add(fundir(w.place(barraca, TENDA.x, 0, TENDA.z, GIRO)));
      // o giro do colisor tem o sinal contrário ao do `rotation.y` do three
      // (`world/collision.ts`): com o mesmo sinal a caixa comprida ficava
      // atravessada em relação à barraca
      w.blockBox(TENDA.x, TENDA.z, BARRACA.meiaLargura + 0.05, BARRACA.meioComprimento + 0.05, -GIRO);
      const teto = barraca.getObjectByName('teto');
      /*
       * A ÂNCORA QUE DEITA OS DOIS, a mesma da cama do quarto: um `Object3D`
       * girado -90° em X, filho da barraca (herda o giro dela). Os pés ficam
       * do lado da porta e a cabeça no fundo, em cima dos travesseiros.
       */
      const deitados = new THREE.Object3D();
      deitados.position.set(0, BARRACA.deitar.y, BARRACA.deitar.z);
      deitados.rotation.x = -Math.PI / 2;
      barraca.add(deitados);

      // ------------------------------------------------- a frente da barraca
      const CANGA = daTenda(0.15, 2.75);
      const pano = w.add(w.place(canga(), CANGA.x, 0, CANGA.z, GIRO + 0.12));
      const naCanga = new THREE.Object3D();
      naCanga.position.set(0, 0, 0.1);
      naCanga.rotation.y = Math.PI;
      pano.add(naCanga);
      const focoDaCanga = new THREE.Object3D();
      focoDaCanga.position.set(CANGA.x, 0.6, CANGA.z);
      w.root.add(focoDaCanga);

      // a mesinha do fogareiro, com a panelinha em cima dele e as duas canecas
      const MESINHA = daTenda(1.35, 1.95);
      const GIRO_DA_MESINHA = GIRO - 0.35;
      const mesinha = mesinhaDobravel();
      const fogareiro = fogareiroDeMontanha();
      fogareiro.scale.setScalar(1.6);
      fogareiro.position.set(-0.14, 0.314, 0);
      const panela = panelinha();
      panela.scale.setScalar(1.6);
      panela.position.set(-0.14, 0.314 + 0.186 * 1.6, 0);
      mesinha.add(fogareiro, panela);
      /** onde cada caneca mora na mesinha (a cozinha devolve para cá depois de beber) */
      const CASA_DAS_CANECAS = [[0.13, 0.314, -0.08, 0.6], [0.19, 0.314, 0.09, 2.4]] as const;
      const canecas = CASA_DAS_CANECAS.map(([x, y, z, r]) => {
        const caneca = canecaEsmaltada();
        caneca.scale.setScalar(1.6);
        caneca.position.set(x, y, z);
        caneca.rotation.y = r;
        mesinha.add(caneca);
        return caneca;
      });
      /*
       * O QUE SE MEXE TEM NOME (e por isso é fronteira da `fundir()`): o
       * fogareiro (acende, treme), a panelinha (ferve, despeja, vai para a
       * canga) e as canecas (enchem, vão para a mão). Dentro de cada um, o que
       * é do mesmo material se junta — o fogareiro continua um desenho só por
       * material. A COZINHA (`world/cozinhaDeAcampamento.ts`) põe do lado o
       * caixote de feira com o resto, e anima tudo no relógio da clareira.
       */
      for (const filho of mesinha.children) filho.userData.peca = undefined;
      fogareiro.name = 'fogareiro';
      panela.name = 'panela';
      canecas.forEach((c, i) => {
        c.name = `caneca-${i + 1}`;
      });
      const cozinha = new CozinhaDoFogareiro({ mesinha, fogareiro, panela, canecas });
      cozinha.som = (nome) => g.som(nome);
      w.add(fundir(w.place(mesinha, MESINHA.x, 0, MESINHA.z, GIRO_DA_MESINHA)));
      w.blockCircle(MESINHA.x, MESINHA.z, 0.36);
      // o caixote de feira, do lado da mesinha
      mesinha.updateMatrixWorld(true);
      const noCaixote = cozinha.caixote.getWorldPosition(new THREE.Vector3());
      w.blockBox(noCaixote.x, noCaixote.z, 0.2, 0.15, -(GIRO_DA_MESINHA + cozinha.caixote.rotation.y));

      // as duas mochilas cargueiras, de pé do lado da barraca — juntas numa
      // peça só, para as fitas, o cantil e o isolante das duas virarem um
      // desenho cada
      const mochilas = new THREE.Group();
      mochilas.userData.peca = 'mochilas';
      for (const [lx, lz, cor, giro, tomba] of [
        [-1.4, 0.55, P.mochilaMusgo, 0.5, 0.06], [-1.3, -0.25, P.mochilaVinho, 0.9, -0.05],
      ] as const) {
        const onde = daTenda(lx, lz);
        const mochila = mochilaCargueira(cor);
        mochila.userData.peca = undefined;
        mochila.position.set(onde.x, 0, onde.z);
        mochila.rotation.set(0, GIRO + giro, tomba);
        mochilas.add(mochila);
        w.blockCircle(onde.x, onde.z, 0.28);
      }
      w.add(fundir(mochilas));

      /*
       * O TRONCO CAÍDO, de banco, na frente e de lado — DENTRO da janela da
       * câmera. No fundo da clareira (onde ele nasceu) a árvore da frente dele
       * o engolia inteiro. Deitado de través para a barraca, com os
       * cogumelinhos virados para quem chega, e longe o bastante da ponta da
       * trilha para não fechar a entrada.
       */
      const TRONCO = { x: CL.x + 2.9, z: CL.z - 0.6 };
      const giroDoTronco = 1.214;
      w.add(fundir(w.place(troncoCaido(1.9), TRONCO.x, 0, TRONCO.z, giroDoTronco)));
      w.blockBox(TRONCO.x, TRONCO.z, 0.95, 0.24, -giroDoTronco);

      // --------------------------------------------------- as árvores em volta
      // um arco pelo fundo e pelos lados (`a` é o ângulo de `(cos a, sin a)`
      // no chão; a câmera fica no 45°). Duas delas seguram o varal.
      const ARCO: Array<[number, number, 'redonda' | 'pinheiro' | 'florida', number, number]> = [
        [100, 5.6, 'pinheiro', 1.35, 0.21], [123, 5.3, 'redonda', 1.4, 0.37], [148, 5.4, 'florida', 1.25, 0.52],
        [175, 4.9, 'redonda', 1.45, 0.66], [200, 4.95, 'pinheiro', 1.5, 0.13], [222, 5.0, 'redonda', 1.3, 0.81],
        [245, 5.2, 'florida', 1.35, 0.44], [268, 4.9, 'redonda', 1.4, 0.29], [292, 5.3, 'pinheiro', 1.3, 0.92],
        [316, 5.5, 'redonda', 1.35, 0.58],
      ];
      const posDoArco = (a: number, r: number): { x: number; z: number } => ({
        x: CL.x + Math.cos((a * Math.PI) / 180) * r,
        z: CL.z + Math.sin((a * Math.PI) / 180) * r,
      });
      for (const [a, r, tipo, esc, semente] of ARCO) {
        const p = posDoArco(a, r);
        w.add(fundir(w.place(tree(tipo, esc, semente), p.x, 0, p.z, semente * 6.28)));
        w.blockCircle(p.x, p.z, 0.45 * esc);
      }
      /*
       * NO LESTE, ARBUSTO E NÃO ÁRVORE (pedido do Renan, visto no celular): as
       * duas árvores do arco que ficavam no 338° e no 355° — a florida rosa e
       * a redonda — estavam bem na linha da porta da barraca para o lago, e
       * de manhã tapavam o sol nascendo. Viraram dois arbustos floridos
       * baixinhos (`arbustoFlorido`), no mesmo lugar: a rosa continua rosa, e
       * a outra floresce em branco e lilás. A clareira continua fechada pelos
       * outros lados.
       */
      for (const [a, r, esc, semente, cores] of [
        [338, 5.5, 1.15, 3, [P.florDoArbusto, P.florDoArbusto, P.florDoArbustoBranca]],
        [355, 5.9, 1.05, 7, [P.florDoArbustoBranca, P.florDoArbustoLilas]],
      ] as const) {
        const p = posDoArco(a, r);
        w.add(fundir(w.place(arbustoFlorido(esc, semente, cores), p.x, 0, p.z, semente)));
        w.blockCircle(p.x, p.z, 0.62 * esc);
      }

      // o varal de luzinhas entre a árvore do 175° e a do 268° (atrás da barraca)
      const T1 = posDoArco(175, 4.9);
      const T2 = posDoArco(268, 4.9);
      const meio = { x: (T1.x + T2.x) / 2, z: (T1.z + T2.z) / 2 };
      const ida = new THREE.Vector3(T2.x - T1.x, 0, T2.z - T1.z);
      const comprimento = ida.length();
      ida.normalize();
      // o nó encosta na casca, e não no meio do tronco
      const de = new THREE.Vector3(-comprimento / 2 + 0.22, 2.0, 0);
      const ate = new THREE.Vector3(comprimento / 2 - 0.22, 1.95, 0);
      const varal = varalDeLuzinhas(de, ate, 0.42, 18);
      w.add(fundir(w.place(varal, meio.x, 0, meio.z, -Math.atan2(ida.z, ida.x))));

      // ------------------------------------- samambaias, moitas e flores baixas
      w.add(fundir(w.place(samambaias([
        [3.4, 1.0, 1.0, 1], [1.0, 3.6, 1.1, 2], [4.2, 3.3, 0.9, 3], [2.6, 4.4, 0.8, 4],
        [-3.9, -0.8, 1.1, 5], [-0.7, -4.0, 1.0, 6], [3.1, -3.3, 0.9, 7], [-3.4, 2.9, 0.95, 8],
      ]), CL.x, 0, CL.z)));
      // moitas e flores numa peça só (o mesmo verde e as mesmas pétalas)
      const baixas = new THREE.Group();
      baixas.userData.peca = 'baixas-da-clareira';
      for (const [dx, dz, esc] of [[5.0, 1.8, 0.9], [1.9, 5.1, 0.85], [5.2, -0.6, 0.75], [-0.4, 5.3, 0.8]] as const) {
        const moita = w.place(bush(esc, P.leafDark), CL.x + dx, 0, CL.z + dz);
        moita.userData.peca = undefined;
        baixas.add(moita);
      }
      for (const [dx, dz] of [[2.3, 2.0], [3.8, -1.4], [-2.4, 3.6], [0.4, 4.2]] as const) {
        const flor = w.place(flowers(5, 0.7), CL.x + dx, 0, CL.z + dz);
        flor.userData.peca = undefined;
        baixas.add(flor);
      }
      w.add(fundir(baixas));
      // as folhas secas no chão, fora da barraca e da canga
      w.add(folhasSecas(150, (rnd) => {
        const a = rnd() * Math.PI * 2;
        const r = Math.sqrt(rnd()) * (CL.raio + 0.3);
        const x = CL.x + Math.cos(a) * r;
        const z = CL.z + Math.sin(a) * r;
        if (Math.hypot(x - TENDA.x, z - TENDA.z) < 1.95) return null;
        if (Math.hypot(x - CANGA.x, z - CANGA.z) < 1.0) return null;
        return [x, z];
      }));

      // ======================================================= as interações
      const chegou = { agora: false };
      w.onUpdate(() => {
        if (chegou.agora || g.flag('clareira-achada')) return;
        const eu = g.playerPosition();
        if (Math.hypot(eu.x - CL.x, eu.z - CL.z) > CL.raio - 0.4) return;
        chegou.agora = true;
        g.setFlag('clareira-achada');
        void (async () => {
          await conversa([
            [R, 'Olha isso. Uma clareirinha escondida atrás do lago.'],
            [A, 'E tem uma barraca montada. Laranja, do jeito que eu gosto.'],
            [R, 'Ninguém passa por aqui. É só nosso.'],
            [A, 'Então é aqui que a gente vem quando quiser sumir um pouquinho.'],
          ]);
          g.unlock({
            id: 'clareira-atras-do-lago',
            title: 'A nossa clareira',
            place: 'Parque Villa Lobos',
            note: 'Atrás do lago, no meio das árvores, uma clareira com uma barraca laranja montada e um fogareirinho na frente. Ninguém passa por ali: é o canto dos dois.',
            icon: '⛺',
          });
        })();
      });

      /*
       * ===================================================== A NOITE (etapa B)
       *
       * Pedido do Renan: poder dormir e passar a noite lá — e fechar a
       * barraca antes de dormir. Lá dentro, "Passar a noite aqui" escurece o
       * céu de verdade: o mesmo sol e o mesmo céu do motor (`g.luzDoCeu`),
       * numa fila de momentos — o dia, a tarde dourada, o pôr do sol atrás
       * da barraca, o crepúsculo e a noite (`world/noite.ts`). Com a noite
       * chegam as luzes pintadas: o varal acendendo lâmpada por lâmpada, a
       * lanterna lá dentro (a barraca inteira brilha), os vaga-lumes na borda
       * da clareira, os grilos e a música de ninar.
       *
       * De noite dá para sair e andar pela clareira; SAIR DELA volta o dia (o
       * resto do parque não anoitece). "Dormir" fecha a barraca — o zíper dando
       * a volta na porta —, os dois deitam de conchinha (o Renan atrás, a
       * escolha dele), a lanterna apaga, a tela escurece e eles acordam com a
       * aurora: o sol nascendo atrás do lago, que eles veem da porta.
       *
       * Tudo anda no RELÓGIO DO JOGO (as `animacoes` do `w.onUpdate`), e não
       * no `g.wait`: num celular lento o céu e a câmera chegam juntos.
       */
      const DIA = momentoDoDia(villaLobos.ambient);
      const FILA_DA_NOITE = [DIA, TARDE_DOURADA, POR_DO_SOL, CREPUSCULO, NOITE];
      const FILA_DA_MANHA = [AURORA, MANHA_CEDO, DIA];
      const agora = misturarMomentos(DIA, DIA, 0, momentoEmBranco());
      let estado: 'dia' | 'noite' | 'manha' = 'dia';
      /** desliga o radinho na hora (quem liga é a parte da dança, lá embaixo) */
      let desligarORadinho = (): void => {};
      /** a noite acabou: quem estava no pote é solto onde ele mora, atrás da barraca, e o pote volta para o lugar */
      let soltarOsDoPote = (): void => {};
      /** a lanterna apagada para dormir: o céu da noite não acende ela de novo */
      let lanternaApagada = false;
      /** numa cena (deitados, sentados na canga): a posição do corpo é da âncora */
      let ocupados = false;
      /** o teste acelera o relógio da noite (o navegador do teste anda devagar) */
      const ritmo = { vezes: 1 };
      /** acordaram na barraca: o fogareiro é de café da manhã até saírem da clareira */
      let cafeDaManha = false;

      const ceu = new CeuDaClareira();
      w.add(w.place(ceu.group, CL.x, 0, CL.z));
      const vagaLumes = new VagaLumes(CL, 2.2, CL.raio + 1.4, 28, 4242, [{ x: TENDA.x, z: TENDA.z, r: 1.8 }]);
      w.add(vagaLumes.group);
      let brilhoDosVagaLumes = 0;

      /** o céu do momento e as luzes que vão com ele: o varal, a lanterna e os vaga-lumes */
      const pintarMomento = (): void => {
        g.luzDoCeu(luzDoMomento(agora));
        ceu.aplicar(agora);
        const k = agora.estrelas;
        acenderVaral(varal, THREE.MathUtils.smoothstep(k, 0.12, 0.6));
        const acesa = k > 0.3 && !lanternaApagada;
        if (acesa !== (barraca.userData.acesa === true)) {
          acenderBarraca(barraca, acesa);
          if (acesa) g.som('clique');
        }
        brilhoDosVagaLumes = THREE.MathUtils.clamp((k - 0.25) / 0.6, 0, 1);
        luzesDosPostes.noite = THREE.MathUtils.smoothstep(k, 0.1, 0.6);
      };

      // ------------------------------------------- as animações do relógio do jogo
      interface Animacao { t: number; dur: number; passo: (k: number) => void; fim: () => void }
      const animacoes: Animacao[] = [];
      const animar = (dur: number, passo: (k: number) => void): Promise<void> =>
        new Promise((fim) => animacoes.push({ t: 0, dur, passo, fim }));
      const passarOCeu = (fila: readonly MomentoDoCeu[], dur: number): Promise<void> =>
        animar(dur, (k) => {
          momentoNaFila(fila, k, agora);
          pintarMomento();
        });
      const moverPorta = (de: number, ate: number, dur = 0.85): Promise<void> =>
        animar(dur, (k) => fecharPortaDaBarraca(barraca, de + (ate - de) * k));

      /*
       * AS CÂMERAS DE CENA, no referencial da barraca. Dentro: a LARGA, do
       * lado da porta e bem alta, mostra os dois inteiros nos colchões; a DO
       * BEIJO desce quase em cima das cabeças (deitados de lado, o perfil dos
       * dois só se vê DE CIMA — pelo lado dos pés, o braço e o queixo tapam o
       * rosto); a DA CONCHINHA é a mesma, um tico mais aberta. Fora: a DO
       * ANOITECER, baixa na frente da barraca, olha por cima dela o céu do
       * pôr do sol (a oeste, atrás); a DA PORTA olha o zíper fechar; e a DO
       * NASCER fica atrás dos dois, na porta, olhando o lago a leste.
       *
       * A câmera não corta: desliza no relógio do jogo, e um deslize novo
       * interrompe o anterior saindo de onde ele parou.
       */
      type Tomada = readonly [THREE.Vector3, THREE.Vector3];
      const CAMERA_LARGA: Tomada = [new THREE.Vector3(0.8, 3.4, 2.2), new THREE.Vector3(0, 0.25, -0.15)];
      const CAMERA_DO_BEIJO: Tomada = [new THREE.Vector3(0.3, 2.2, 0.45), new THREE.Vector3(0, 0.38, -0.5)];
      const CAMERA_DA_CONCHINHA: Tomada = [new THREE.Vector3(0.45, 2.55, 0.85), new THREE.Vector3(0, 0.34, -0.35)];
      const CAMERA_DO_ANOITECER: Tomada = [new THREE.Vector3(1.1, 1.0, 5.4), new THREE.Vector3(-0.5, 3.4, -4)];
      const CAMERA_DA_PORTA: Tomada = [new THREE.Vector3(1.2, 1.65, 4.3), new THREE.Vector3(0, 0.62, 1.2)];
      const CAMERA_DO_NASCER: Tomada = [new THREE.Vector3(-1.1, 2.7, -0.4), new THREE.Vector3(6.5, 1.5, 6.2)];
      const camera = { de: CAMERA_LARGA[0].clone(), para: CAMERA_LARGA[1].clone() };
      const apontarCamera = (api: GameAPI): void => {
        barraca.updateWorldMatrix(true, false);
        api.setCameraOmbro(barraca.localToWorld(camera.de.clone()), barraca.localToWorld(camera.para.clone()));
      };
      let deslize: Animacao | null = null;
      const pararCamera = (): void => {
        if (!deslize) return;
        animacoes.splice(animacoes.indexOf(deslize), 1);
        deslize.fim();
        deslize = null;
      };
      const deslizarCamera = (alvo: Tomada, dur = 1.1): Promise<void> => {
        pararCamera();
        const de0 = camera.de.clone();
        const para0 = camera.para.clone();
        return new Promise((fim) => {
          const a: Animacao = {
            t: 0, dur, fim,
            passo: (k) => {
              const s = k * k * (3 - 2 * k);
              camera.de.lerpVectors(de0, alvo[0], s);
              camera.para.lerpVectors(para0, alvo[1], s);
              apontarCamera(w.game);
              if (k >= 1 && deslize === a) deslize = null;
            },
          };
          deslize = a;
          animacoes.push(a);
        });
      };

      let proximoGrilo = 0;
      w.onUpdate((dt0) => {
        const dt = dt0 * ritmo.vezes;
        for (const a of [...animacoes]) {
          a.t = Math.min(a.dur, a.t + dt);
          a.passo(a.dur > 0 ? a.t / a.dur : 1);
          if (a.t >= a.dur) {
            const i = animacoes.indexOf(a);
            if (i >= 0) animacoes.splice(i, 1);
            a.fim();
          }
        }
        ceu.update(dt);
        vagaLumes.update(dt, brilhoDosVagaLumes);
        cozinha.update(dt);
        // o café da manhã vale até a dupla sair da clareira
        if (cafeDaManha && !ocupados) {
          const eu = g.playerPosition();
          if (Math.hypot(eu.x - CL.x, eu.z - CL.z) > CL.raio + 2.2) cafeDaManha = false;
        }
        if (estado !== 'noite') return;
        proximoGrilo -= dt;
        if (proximoGrilo <= 0) {
          g.som('grilo');
          proximoGrilo = 1.4 + Math.random() * 2.6;
        }
        // SAIR DA CLAREIRA VOLTA O DIA: o resto do parque não anoitece
        if (ocupados) return;
        const eu = g.playerPosition();
        if (Math.hypot(eu.x - CL.x, eu.z - CL.z) > CL.raio + 2.2) void voltarODia();
      });

      /** a noite acaba (os dois saíram da clareira): o céu volta ao dia em 2 s */
      const voltarODia = async (): Promise<void> => {
        if (estado === 'dia') return;
        estado = 'dia';
        lanternaApagada = false;
        desligarORadinho();
        soltarOsDoPote();
        g.trocarMusica(null);
        g.toast('Longe da clareira, o dia voltou', '☀️');
        await passarOCeu([misturarMomentos(agora, agora, 0, momentoEmBranco()), DIA], 2.2);
        g.luzDoCeu(null);
        if ((barraca.userData.portaFechada ?? 0) > 0) fecharPortaDaBarraca(barraca, 0);
      };

      // ------------------------------------------------------------- deitar
      const deitarNaBarraca = (api: GameAPI): void => {
        api.lockPlayer(true);
        api.ridePlayer(deitados, new THREE.Vector3(-BARRACA.deitar.x, 0, 0), 1, 0);
        api.rideCompanion(deitados, new THREE.Vector3(BARRACA.deitar.x, 0, 0), 1, 0);
        api.setLying(true);
        /*
         * O TETO SAI e a câmera olha de cima, do lado da porta: os dois
         * aparecem inteiros nos colchões, com as paredes baixas da barraca em
         * volta. Da isométrica, a barraca fechada não deixaria ver ninguém.
         */
        if (teto) teto.visible = false;
        pararCamera();
        camera.de.copy(CAMERA_LARGA[0]);
        camera.para.copy(CAMERA_LARGA[1]);
        apontarCamera(api);
      };

      /** os dois de pé na frente da porta, olhando `para` */
      const sairDaBarraca = (api: GameAPI, para: number): void => {
        api.setLying(false);
        if (teto) teto.visible = true;
        pararCamera();
        api.setCameraOmbro(null);
        const saidaA = daTenda(-0.4, 2.2);
        const saidaB = daTenda(0.4, 2.2);
        api.releasePlayer(saidaA.x, saidaA.z, para);
        api.releaseCompanion(saidaB.x, saidaB.z, para);
      };

      // -------------------------------------------------------- a noite cai
      const anoitecer = async (api: GameAPI): Promise<void> => {
        await conversa([
          [R, 'E se a gente passasse a noite aqui?'],
          [A, 'A noite inteira? Na barraca?'],
          [R, 'Com estrela, vaga-lume… e você do lado.'],
          [A, 'Fechado. Mas primeiro eu quero ver o céu escurecer.'],
        ]);
        // a tomada de fora: o teto volta e a câmera sai da barraca para olhar o
        // céu por cima dela — o pôr do sol fica atrás, a oeste
        if (teto) teto.visible = true;
        ceu.aplicar(agora);
        ceu.visivel = true;
        void deslizarCamera(CAMERA_DO_ANOITECER, 2.2);
        api.trocarMusica('noite-na-clareira');
        await passarOCeu(FILA_DA_NOITE, 10);
        estado = 'noite';
        api.toast('Anoiteceu na clareira', '🌙');
        await animar(1.4, () => {});
        // de volta para dentro (o teto sai quando a câmera já está em cima)
        await deslizarCamera(CAMERA_LARGA, 1.6);
        ceu.visivel = false;
        if (teto) teto.visible = false;
        await conversa([
          [A, 'Escureceu de vez.'],
          [R, 'Lá fora tá cheio de vaga-lume. E aqui dentro tem a lanterna.'],
        ]);
      };

      // ----------------------------------------- dormir: fechar, conchinha, sono
      const dormir = async (api: GameAPI): Promise<void> => {
        await conversa([
          [R, 'Bora dormir?'],
          [A, 'Bora. Mas fecha a barraca antes, que de noite entra bicho.'],
          [R, 'Fechando…'],
        ]);
        // FECHAR A BARRACA, visto de fora: o zíper dá a volta na porta
        if (teto) teto.visible = true;
        await deslizarCamera(CAMERA_DA_PORTA, 1.4);
        api.som('ziper');
        await moverPorta(0, 1);
        await animar(0.7, () => {});
        // de volta para dentro, e de conchinha: o Renan atrás, abraçando
        await deslizarCamera(CAMERA_LARGA, 1.2);
        if (teto) teto.visible = false;
        void deslizarCamera(CAMERA_DA_CONCHINHA, 1.3);
        await api.deitarDeConchinha(RENAN.name);
        // o boa noite dos dois (a escolha do Renan)
        await conversa([
          [A, 'Boa noite, bebito'],
          [R, 'Boa noite, bebitolito'],
        ]);
        await animar(0.6, () => {});
        // a lanterna apaga
        lanternaApagada = true;
        acenderBarraca(barraca, false);
        api.som('clique');
        await animar(1.4, () => {});
        // DORMEM: a tela escurece devagar e a noite passa lá embaixo
        await api.escurecerTela(true, 'sono');
        desligarORadinho();
        soltarOsDoPote();
        api.trocarMusica(null);
        estado = 'manha';
        misturarMomentos(AURORA, AURORA, 0, agora);
        pintarMomento();
        lanternaApagada = false;
        await api.wait(1.6);
        await api.escurecerTela(false, 'sono');
        api.som('passarinho');
        await animar(0.8, () => {});
        await conversa([
          [R, 'Bom dia…'],
          [A, 'Já é de manhã? A gente dormiu a noite inteira assim?'],
          [R, 'De conchinha. Não te soltei nenhuma vez.'],
        ]);
        api.som('passarinho');
        void deslizarCamera(CAMERA_LARGA, 1.1);
        await api.virarDeitados(false);
        // ABRIR A BARRACA de manhã, e os dois saem para ver o sol nascer
        if (teto) teto.visible = true;
        await deslizarCamera(CAMERA_DA_PORTA, 1.2);
        api.som('ziper');
        await moverPorta(1, 0);
        const paraOLago = Math.atan2(NO_LAGO.x - TENDA.x, NO_LAGO.z - TENDA.z);
        api.setLying(false);
        const saidaA = daTenda(-0.4, 2.2);
        const saidaB = daTenda(0.4, 2.2);
        api.releasePlayer(saidaA.x, saidaA.z, paraOLago);
        api.releaseCompanion(saidaB.x, saidaB.z, paraOLago);
        api.lockPlayer(true);
        api.holdCompanion(NO_LAGO.x, NO_LAGO.z);
        // O SOL NASCENDO ATRÁS DO LAGO: a câmera fica atrás dos dois, na porta
        ceu.aplicar(agora);
        ceu.visivel = true;
        await deslizarCamera(CAMERA_DO_NASCER, 1.8);
        const manha = passarOCeu(FILA_DA_MANHA, 12);
        await conversa([
          [A, 'Olha o sol nascendo atrás do lago.'],
          [R, 'Só por isso já valeu a noite.'],
          [A, 'Valeu por você, bebito.'],
        ]);
        await manha;
        api.unlock({
          id: 'noite-na-barraca',
          title: 'A primeira noite na barraca',
          place: 'Parque Villa Lobos',
          note: 'Uma noite inteira na clareira: o varal aceso, os vaga-lumes, a barraca fechadinha e os dois de conchinha. E de manhã, o sol nascendo atrás do lago.',
          icon: '🌅',
        });
        estado = 'dia';
        cafeDaManha = true;
        g.luzDoCeu(null);
        ceu.visivel = false;
        pararCamera();
        api.setCameraOmbro(null);
        api.freeCompanion();
        api.lockPlayer(false);
      };

      const MEMORIA_DA_BARRACA = {
        id: 'barraca-a-dois',
        title: 'Os dois na barraca',
        place: 'Parque Villa Lobos',
        note: 'Deitados nos colchões da barraca laranja, um do lado do outro, com o barulho do parque lá fora bem baixinho.',
        icon: '⛺',
      };
      /*
       * O BEBITO BOOK (pedido do Renan, no lugar do "papo de travesseiro"): o
       * caderninho dos planos pro futuro. Os dois viram de lado, de frente um
       * para o outro (a pose do beijo, sem o beijo), a câmera chega perto e o
       * caderno aparece fechado na tela (`ui/bebitoBook.ts`): eles abrem a
       * capa, escrevem cada um com a sua letra e fecham. O caderno é um só —
       * o que foi escrito fica, e a fitinha marca onde pararam.
       *
       * As falas são PROVISÓRIAS (do Claude), até o Renan mandar as dele.
       */
      const escreverNoCaderno = async (api: GameAPI): Promise<void> => {
        void deslizarCamera(CAMERA_DO_BEIJO);
        await api.virarDeitados(true);
        const vez = api.bump('clareira:bebito-book');
        if (vez === 1) {
          await conversa([
            [R, 'Trouxe uma coisa na mochila.'],
            [A, 'Um caderninho? Com adesivo de barraca?'],
            [R, 'O Bebito book. Pra gente escrever os nossos planos.'],
            [A, 'Os planos pro futuro? Aqui, deitadinhos?'],
            [R, 'Uma pergunta em cada página. Cada um responde com a sua letra.'],
          ]);
        } else {
          const falas: Array<Array<readonly [string, string]>> = [
            [[A, 'Cadê o Bebito book?'], [R, 'Aqui. Onde a gente parou?']],
            [[R, 'Bora escrever mais um plano?'], [A, 'Me passa a caneta.']],
            [[A, 'Pega o caderninho, bebito.'], [R, 'Já tá na mão.']],
          ];
          await conversa(falas[(vez - 2) % falas.length]);
        }
        const r = await api.abrirBebitoBook();
        if (r.escreveu) {
          if (r.respondidas >= 12 && r.respondidasAntes < 12) {
            await conversa([
              [A, 'Bebitolito… a gente respondeu todas.'],
              [R, 'O caderno inteiro de planos. Agora é só ir vivendo um por um.'],
            ]);
          } else {
            await conversa([
              [A, 'Gostei dos nossos planos.'],
              [R, 'Agora tá escrito. Tem que cumprir.'],
            ]);
          }
          api.soltarCoracoes(2);
          api.unlock({
            id: 'bebito-book',
            title: 'O Bebito book',
            place: 'Parque Villa Lobos',
            note: 'Deitados de frente um pro outro na barraca, os dois abriram o caderninho de capa de pano e escreveram os planos pro futuro — cada um com a sua letra.',
            icon: '📔',
          });
        } else if (r.abriu) {
          await conversa([
            [R, 'Depois a gente escreve mais.'],
            [A, 'Tem o caderno inteiro pela frente.'],
          ]);
        }
        void deslizarCamera(CAMERA_LARGA);
        await api.virarDeitados(false);
      };

      const PORTA = daTenda(0, 1.95);
      w.interact({
        id: 'clareira:barraca',
        x: PORTA.x, z: PORTA.z, radius: 1.05,
        label: 'Entrar na barraca', icon: '⛺',
        highlight: barraca,
        onInteract: async (api) => {
          const quer = await api.ask('Entrar na barraca?', ['Entrar', 'Agora não']);
          if (quer !== 0) return;
          ocupados = true;
          deitarNaBarraca(api);
          await api.wait(1.0);
          if (estado === 'noite') {
            await conversa([
              [R, 'Aqui dentro tá quentinho.'],
              // a fala do Renan, literal, também de noite
              [A, 'Agora é só a gente bebito'],
            ]);
          } else {
            await conversa([
              [R, 'Cabe direitinho nós dois.'],
              [A, 'Colchão no chão, saco de dormir aberto… isso aqui é um hotel.'],
              [R, 'Um hotel de uma estrela só. E ela tá aqui do meu lado.'],
              // fala do Renan, literal: "bebito" é como os dois se chamam (e
              // "bebitolito", quando é mais fofo). O lugar foi ideia do Ari —
              // é ele quem diz
              [A, 'Agora é só a gente bebito'],
            ]);
          }
          for (;;) {
            // de dia, a terceira escolha é a noite chegar; de noite, é dormir
            const terceira = estado === 'noite' ? 'Dormir' : 'Passar a noite aqui';
            const opcoes = ['Ficar abraçadinhos', 'Dar um beijinho', 'Escrever no Bebito book', terceira, 'Sair da barraca'];
            const escolha = opcoes[await api.ask('E agora?', opcoes)];
            if (escolha === 'Ficar abraçadinhos') {
              // mais perto: os dois escorregam para o meio dos colchões
              api.ridePlayer(deitados, new THREE.Vector3(-0.2, 0, 0), 1, 0);
              api.rideCompanion(deitados, new THREE.Vector3(0.2, 0, 0), 1, 0);
              await conversa([
                [R, 'Vem mais pra cá.'],
                [A, 'Mais? Já tô quase em cima de você.'],
                [R, 'É a ideia.'],
              ]);
              api.soltarCoracoes(2);
              await api.wait(2.4);
            } else if (escolha === 'Dar um beijinho') {
              /*
               * O BEIJO DEITADO (`entities/BeijoDeitado.ts`): os dois viram de
               * lado, um de frente para o outro, chegam perto, fecham os olhos
               * e se beijam — o estalinho e um coração de cada um saem de lá.
               * A conversa é DE FRENTE, e só depois eles voltam de barriga
               * para cima, para o lugar de antes.
               */
              void deslizarCamera(CAMERA_DO_BEIJO);
              await api.beijarDeitados();
              const vez = api.bump('clareira:beijinhos');
              const falas: Array<Array<readonly [string, string]>> = [
                [[A, 'Bebitolito…'], [R, 'Hm?'], [A, 'Nada. Só queria te chamar assim.']],
                [[A, 'Mais um?'], [R, 'Sempre mais um.']],
                [[R, 'Esse foi pra contar.'], [A, 'Então eu tô te devendo vários.']],
                [[A, 'Aqui ninguém vê.'], [R, 'Por isso mesmo.']],
              ];
              await conversa(falas[(vez - 1) % falas.length]);
              void deslizarCamera(CAMERA_LARGA);
              await api.virarDeitados(false);
            } else if (escolha === 'Escrever no Bebito book') {
              await escreverNoCaderno(api);
            } else if (escolha === 'Passar a noite aqui') {
              await anoitecer(api);
            } else if (escolha === 'Dormir') {
              // a noite inteira, até sair de manhã: termina lá fora
              await dormir(api);
              ocupados = false;
              api.unlock(MEMORIA_DA_BARRACA);
              return;
            } else {
              break;
            }
          }
          if (estado === 'noite') {
            await conversa([
              [R, 'Vamos ver os vaga-lumes lá fora?'],
              [A, 'Vamos. Mas depois a gente volta pra dormir.'],
            ]);
          } else {
            await conversa([
              [R, 'Depois a gente volta.'],
              [A, 'Quando escurecer, de preferência.'],
            ]);
          }
          sairDaBarraca(api, GIRO);
          api.lockPlayer(false);
          ocupados = false;
          api.unlock(MEMORIA_DA_BARRACA);
        },
      });

      const NA_CANGA = daTenda(0.15, 3.45);
      const promptDaCanga = w.interact({
        id: 'clareira:canga',
        x: NA_CANGA.x, z: NA_CANGA.z, radius: 1.0,
        label: 'Sentar na canga', icon: '🧺',
        highlight: pano,
        onInteract: async (api) => {
          // de noite, a canga é também o lugar de olhar o céu
          if (estado === 'noite') {
            const como = await api.ask('Na canga, de noite…', ['Deitar e olhar as estrelas', 'Só sentar', 'Agora não']);
            if (como === 0) {
              await olharAsEstrelas(api);
              return;
            }
            if (como !== 1) return;
          }
          ocupados = true;
          api.lockPlayer(true);
          // sentados NO CHÃO: o quadril do rig fica ~0,45 acima da origem, e a
          // canga está a 2 cm — a âncora desce o resto
          api.ridePlayer(naCanga, new THREE.Vector3(-0.32, -0.42, 0), 1, Math.PI);
          api.rideCompanion(naCanga, new THREE.Vector3(0.32, -0.42, 0), 1, Math.PI);
          api.setSitting(true);
          api.focusCamera(focoDaCanga);
          await api.wait(0.6);
          await conversa([
            [A, 'Dá pra ver um pedacinho do lago daqui.'],
            [R, 'E ninguém vê a gente.'],
            [A, 'Melhor ainda.'],
          ]);
          const ficar = await api.ask('Ficar mais um pouco?', ['Fica', 'Levantar']);
          if (ficar === 0) {
            api.soltarCoracoes(2);
            await conversa([
              [R, 'Encosta aqui.'],
              [A, 'Já encostei.'],
            ]);
            await api.wait(2.2);
          }
          api.setSitting(false);
          api.focusCamera(null);
          api.releasePlayer(NA_CANGA.x - 0.4, NA_CANGA.z + 0.3, GIRO);
          api.releaseCompanion(NA_CANGA.x + 0.3, NA_CANGA.z - 0.4, GIRO);
          api.lockPlayer(false);
          ocupados = false;
        },
      });

      /*
       * ============================================ COZINHAR NO FOGAREIRO (D)
       *
       * De dia (e no café da manhã, depois de dormir na barraca) o fogareiro
       * faz CAFÉ COADO e MINI AREPAS — as arepas são pedido do Renan para o
       * café da manhã —, ou os dois juntos; de noite, CHOCOLATE QUENTE e
       * MIOJO. Os dois sentam no chão do lado da mesinha (quem joga perto do
       * fogo, o outro na frente), a câmera chega perto e a cozinha
       * (`world/cozinhaDeAcampamento.ts`) faz o prato inteiro no relógio da
       * clareira, enquanto eles conversam. Pronto, a tela pisca e os dois
       * estão na canga com a caneca na mão (ou a arepa, ou o garfo e a
       * panelinha no meio), comendo devagar.
       *
       * As falas são PROVISÓRIAS (do Claude), até o Renan mandar as dele.
       */
      const sentarNaMesinha = (lx: number, lz: number, giro: number): THREE.Object3D => {
        const a = new THREE.Object3D();
        a.position.set(lx, 0, lz);
        a.rotation.y = giro;
        mesinha.add(a);
        return a;
      };
      const cozinheiro = sentarNaMesinha(-0.62, 0.1, Math.PI / 2);
      const ajudante = sentarNaMesinha(0.1, 0.64, Math.PI);
      /** um ponto do quadro da mesinha no quadro da barraca (as tomadas de câmera moram nele) */
      const daMesinha = (x: number, y: number, z: number): THREE.Vector3 => {
        mesinha.updateWorldMatrix(true, false);
        barraca.updateWorldMatrix(true, false);
        return barraca.worldToLocal(mesinha.localToWorld(new THREE.Vector3(x, y, z)));
      };
      const tomadaDaMesinha = (de: readonly [number, number, number], para: readonly [number, number, number]): Tomada =>
        [daMesinha(...de), daMesinha(...para)];

      type Refeicao = 'cafe' | 'arepas' | 'cafe-e-arepas' | 'chocolate' | 'miojo';
      const CARDAPIO_DO_DIA: ReadonlyArray<readonly [string, Refeicao]> = [
        ['Café coado', 'cafe'], ['Mini arepas', 'arepas'], ['Café com mini arepas', 'cafe-e-arepas'],
      ];
      const CARDAPIO_DA_NOITE: ReadonlyArray<readonly [string, Refeicao]> = [
        ['Chocolate quente', 'chocolate'], ['Miojo', 'miojo'],
      ];
      const ENQUANTO_COZINHA: Record<PratoDoFogareiro, Array<readonly [string, string]>> = {
        cafe: [
          [R, 'Água no fogo. Agora é esperar ferver.'],
          [A, 'Eu adoro o barulhinho da tampa pulando.'],
          [R, 'Café coado no pano. Do jeito certo.'],
          [A, 'O cheirinho já tá chegando aqui.'],
        ],
        arepas: [
          [A, 'Mini arepas. Agora sim é café da manhã.'],
          [R, 'Você me ensina a virar sem quebrar?'],
          [A, 'Espera dourar embaixo. Aí vira de uma vez.'],
          [R, 'E queijinho em cima de duas.'],
        ],
        chocolate: [
          [R, 'Leite no fogo e três colheradas de chocolate.'],
          [A, 'Noite de acampamento tem que ter chocolate quente.'],
          [R, 'E marshmallow por cima. Um rosinha pra cada.'],
        ],
        miojo: [
          [A, 'Miojo de acampamento é o melhor miojo do mundo.'],
          [R, 'Três minutinhos. E o tempero todo, né?'],
          [A, 'Todo. Sem dó.'],
        ],
      };
      const COMENDO: Record<Refeicao, Array<readonly [string, string]>> = {
        cafe: [[A, 'Hmm… café de fogareiro tem outro gosto.'], [R, 'Gosto de manhã com você.']],
        arepas: [[R, 'Crocante por fora e macia por dentro.'], [A, 'Viu? Você aprendeu.']],
        'cafe-e-arepas': [[A, 'Café, arepa e você. Melhor café da manhã.'], [R, 'Dá pra acordar assim todo dia?']],
        chocolate: [[R, 'Cuidado que tá quente.'], [A, 'O marshmallow derretendo é a melhor parte.']],
        miojo: [[A, 'Um garfo pra cada um e a panela no meio.'], [R, 'Jantar romântico de acampamento.']],
      };
      /*
       * AS TOMADAS DA COZINHA vêm do lado de TRÁS da mesinha (o `-Z` dela), o
       * único lado sem ninguém: o cozinheiro senta no `-X` e o ajudante no
       * `+Z`. Daqui o ajudante fica de frente para a câmera, do outro lado do
       * fogo, o cozinheiro de perfil à direita e o caixote à esquerda. Pelo
       * `+Z` (a primeira versão), a cabeça do ajudante tapava o fogareiro.
       */
      const CAMERA_DA_COZINHA_LONGE = (): Tomada => tomadaDaMesinha([0.55, 1.7, -1.7], [-0.05, 0.42, 0.15]);
      const CAMERA_DA_COZINHA = (): Tomada => tomadaDaMesinha([0.26, 1.28, -1.12], [-0.08, 0.5, 0.14]);
      /** a canga, no quadro da barraca: de frente para os dois sentados, um tico de cima */
      const CAMERA_DA_CANGA: Tomada = [new THREE.Vector3(0.6, 1.42, 4.2), new THREE.Vector3(0.1, 0.5, 2.7)];
      const CAMERA_DAS_AREPAS = (): Tomada => tomadaDaMesinha([0.02, 1.02, -0.62], [-0.13, 0.55, 0.05]);

      const cozinhar = async (api: GameAPI, refeicao: Refeicao): Promise<void> => {
        ocupados = true;
        api.lockPlayer(true);
        api.ridePlayer(cozinheiro, new THREE.Vector3(0, -0.42, 0), 1, 0);
        api.rideCompanion(ajudante, new THREE.Vector3(0, -0.42, 0), 1, 0);
        api.setSitting(true);
        pararCamera();
        const longe = CAMERA_DA_COZINHA_LONGE();
        camera.de.copy(longe[0]);
        camera.para.copy(longe[1]);
        apontarCamera(api);
        void deslizarCamera(CAMERA_DA_COZINHA(), 1.4);
        const pratos: PratoDoFogareiro[] = refeicao === 'cafe-e-arepas' ? ['cafe', 'arepas'] : [refeicao];
        if (cafeDaManha && (refeicao === 'cafe' || refeicao === 'cafe-e-arepas')) {
          await conversa([[A, 'Bom dia de novo. Cadê o café?'], [R, 'Saindo, bebito.']]);
        }
        for (const prato of pratos) {
          if (prato === 'arepas') void deslizarCamera(CAMERA_DAS_AREPAS(), 1.2);
          const feito = cozinha.preparar(prato);
          await conversa(ENQUANTO_COZINHA[prato]);
          await feito;
        }
        // PRONTO: a tela pisca, e os dois estão na canga com a comida
        await api.escurecerTela(true);
        api.setSitting(false);
        api.ridePlayer(naCanga, new THREE.Vector3(-0.32, -0.42, 0), 1, Math.PI);
        api.rideCompanion(naCanga, new THREE.Vector3(0.32, -0.42, 0), 1, Math.PI);
        api.setSitting(true);
        // a tomada da canga: de frente para os dois, a barraca atrás (na
        // isométrica a caneca na mão some de tão pequena)
        pararCamera();
        camera.de.copy(CAMERA_DA_CANGA[0]);
        camera.para.copy(CAMERA_DA_CANGA[1]);
        apontarCamera(api);
        // a arepa e o garfo saem na escala da cozinha (a mesma das canecas e
        // do fogareiro): na escala de fábrica, na mão, viravam um pontinho
        const naMao = (quem: string, obj: THREE.Object3D, escala?: number): void => {
          obj.position.set(0, 0, 0);
          obj.rotation.set(0, 0, 0);
          if (escala) obj.scale.setScalar(escala);
          api.segurarNaCena(quem, obj, 'upright');
        };
        const temBebida = refeicao === 'cafe' || refeicao === 'chocolate' || refeicao === 'cafe-e-arepas';
        if (temBebida) {
          naMao(api.playerId(), cozinha.caneca(0));
          naMao(api.companionId(), cozinha.caneca(1));
        }
        if (refeicao === 'arepas' || refeicao === 'cafe-e-arepas') {
          // o prato vai para a canga, entre os dois (as arepas vão junto)
          const prato = cozinha.pratoDasArepas;
          pano.attach(prato);
          prato.position.set(0, 0.022, 0.12);
          prato.rotation.set(0, 0.3, 0);
          if (!temBebida) {
            cozinha.tirarArepaDoPrato();
            cozinha.tirarArepaDoPrato();
            naMao(api.playerId(), miniArepa(), ESCALA_DA_COZINHA);
            naMao(api.companionId(), miniArepa(), ESCALA_DA_COZINHA);
          }
        }
        if (refeicao === 'miojo') {
          const panelinhaCheia = cozinha.panelinha;
          pano.attach(panelinhaCheia);
          panelinhaCheia.position.set(0, 0.02, 0.14);
          panelinhaCheia.rotation.set(0, 0, 0);
          naMao(api.playerId(), garfoComMiojo(), ESCALA_DA_COZINHA);
          naMao(api.companionId(), garfoComMiojo(), ESCALA_DA_COZINHA);
        }
        api.setSaboreando(true);
        await api.escurecerTela(false);
        await api.wait(0.8);
        await conversa(COMENDO[refeicao]);
        api.soltarCoracoes(2);
        const deNoite = refeicao === 'chocolate' || refeicao === 'miojo';
        api.unlock(deNoite
          ? {
            id: 'jantarzinho-no-fogareiro',
            title: 'Jantarzinho no fogareiro',
            place: 'Parque Villa Lobos',
            note: 'De noite na clareira, o fogareiro de montanha aceso na mesinha: chocolate quente com marshmallow ou miojo comido da panelinha, os dois sentados na canga.',
            icon: '☕',
          }
          : {
            id: 'cafe-da-manha-na-clareira',
            title: 'Café da manhã na clareira',
            place: 'Parque Villa Lobos',
            note: 'Café coado no pano e mini arepas douradas no budare, feitos no fogareiro de montanha, tomados na canga da frente da barraca.',
            icon: '🫓',
          });
        await api.wait(1.6);
        // levantam: a louça volta para a mesinha, limpa
        api.setCameraOmbro(null);
        api.setSaboreando(false);
        api.segurarNaCena(api.playerId(), null);
        api.segurarNaCena(api.companionId(), null);
        cozinha.arrumar(CASA_DAS_CANECAS);
        api.setSitting(false);
        api.focusCamera(null);
        api.releasePlayer(NA_CANGA.x - 0.4, NA_CANGA.z + 0.3, GIRO);
        api.releaseCompanion(NA_CANGA.x + 0.3, NA_CANGA.z - 0.4, GIRO);
        api.lockPlayer(false);
        ocupados = false;
      };

      const NO_FOGAREIRO = daTenda(1.95, 2.45);
      w.interact({
        id: 'clareira:fogareiro',
        x: NO_FOGAREIRO.x, z: NO_FOGAREIRO.z, radius: 0.95,
        label: 'Cozinhar no fogareiro', icon: '🔥',
        highlight: mesinha,
        onInteract: async (api) => {
          if (cozinha.ocupada || ocupados) return;
          const deNoite = estado === 'noite';
          const cardapio = deNoite ? CARDAPIO_DA_NOITE : CARDAPIO_DO_DIA;
          const pergunta = deNoite ? 'O que a gente faz pra noite?' : cafeDaManha ? 'Café da manhã de acampamento?' : 'O que a gente faz no fogareiro?';
          const opcoes = [...cardapio.map(([nome]) => nome), 'Agora não'];
          const i = await api.ask(pergunta, opcoes);
          if (i < 0 || i >= cardapio.length) return;
          await cozinhar(api, cardapio[i][1]);
        },
      });

      /*
       * ===================================== O RADINHO E A DANÇA LENTA (D)
       *
       * O pedido do Renan: "um pequeno radinho bonitinho que será onde vamos
       * interagir para dançar na parte da noite; de manhã não faz nada". Ele
       * mora no chão, do lado esquerdo da canga (`world/radinho.ts`); DE DIA
       * fica quietinho e sem prompt. DE NOITE, "Ligar o radinho": a câmera
       * chega perto, o botão estala, a antena estica, a agulha procura o
       * coraçãozinho do mostrador e a música vira a balada de baile (o clima
       * `'danca-lenta'`). Aí o convite, e os dois dançam agarradinhos na frente
       * da canga — o Renan com as mãos na cintura, o Ari pelos ombros
       * (provisório: é ele o mais alto) —, a âncora girando devagar e a
       * câmera passeando em volta, com o céu estrelado atrás. Uma voltinha no
       * fim de cada música, e "Mais uma?".
       *
       * Desligar devolve a música da noite; o dia voltando (ou dormir) desliga
       * na hora. As falas são PROVISÓRIAS (do Claude).
       */
      const NO_CHAO_DO_RADINHO = daTenda(-1.2, 2.3);
      const radinho = new Radinho();
      radinho.som = (nome) => g.som(nome);
      w.add(fundir(w.place(radinho.group, NO_CHAO_DO_RADINHO.x, 0, NO_CHAO_DO_RADINHO.z, GIRO + 0.45)));
      w.blockCircle(NO_CHAO_DO_RADINHO.x, NO_CHAO_DO_RADINHO.z, 0.24);
      /** a pista: na frente da canga, de costas para o lago (a barraca e o varal atrás) */
      const NA_PISTA = daTenda(-0.1, 4.05);
      const pista = new THREE.Object3D();
      pista.position.set(-0.1, 0, 4.05);
      barraca.add(pista);
      let dancando = false;
      let giroDaCamera = 0;
      /** onde a câmera da dança está, no arco da frente (0 é bem de frente, olhando para a barraca) */
      const CAMERA_DA_DANCA = (a: number): Tomada => [
        new THREE.Vector3(-0.1 + Math.sin(a) * 2.3, 1.85, 4.05 + Math.cos(a) * 2.3),
        new THREE.Vector3(-0.1, 1.02, 4.05),
      ];
      /** de perto, da frente-direita do rádio (quem liga fica na frente-esquerda, fora do quadro) */
      const CAMERA_DO_RADINHO: Tomada = [new THREE.Vector3(-0.78, 0.4, 2.78), new THREE.Vector3(-1.2, 0.15, 2.3)];
      w.onUpdate((dt0) => {
        const dt = dt0 * ritmo.vezes;
        radinho.update(dt);
        if (!dancando) return;
        /*
         * OS DOIS GIRAM DEVAGAR NO LUGAR, num vaivém (a âncora vai e volta
         * ~35°), e a câmera ACOMPANHA o par: nunca na linha dele (com a
         * âncora girando sem parar, o par se alinhava com a câmera e um sumia
         * atrás do outro) e nunca de perfil puro — na régua chibi o rosto é
         * a frente de uma bola e o cabelo dá a volta, e de perfil só se via
         * cabelo. Ela balança ~30° para cada lado do perfil, e um tico de
         * cima: olhando para baixo, a cabeça de quem está mais perto desce no
         * quadro e o rosto do outro aparece por cima do ombro dele.
         */
        giroDaCamera += dt;
        pista.rotation.y = Math.sin(giroDaCamera * 0.11) * 0.6;
        const tomada = CAMERA_DA_DANCA(pista.rotation.y + Math.sin(giroDaCamera * 0.13) * 0.55);
        camera.de.lerp(tomada[0], Math.min(1, dt * 1.5));
        camera.para.lerp(tomada[1], Math.min(1, dt * 1.5));
        apontarCamera(g);
      });

      const MUSICAS_DA_DANCA: Array<Array<readonly [string, string]>> = [
        [
          [R, 'Pode pisar no meu pé, eu nem ligo.'],
          [A, 'Eu não vou pisar! …Pisei.'],
          [R, 'Tá perfeito assim.'],
        ],
        [
          [A, 'A gente devia dançar mais vezes.'],
          [R, 'Toda noite de acampamento, então.'],
        ],
        [
          [R, 'Só a gente, o radinho e os vaga-lumes.'],
          [A, 'E as estrelas olhando.'],
        ],
      ];
      const dancar = async (api: GameAPI): Promise<void> => {
        ocupados = true;
        api.lockPlayer(true);
        // os dois na pista, de frente um para o outro (o motor acerta a distância)
        pista.rotation.y = 0;
        api.ridePlayer(pista, new THREE.Vector3(-0.3, 0, 0), 1, Math.PI / 2);
        api.rideCompanion(pista, new THREE.Vector3(0.3, 0, 0), 1, -Math.PI / 2);
        api.dancaLenta(R);
        ceu.visivel = true;
        pararCamera();
        giroDaCamera = 0;
        const de = CAMERA_DA_DANCA(0);
        camera.de.copy(de[0]).add(new THREE.Vector3(0.4, 0.5, 0.9));
        camera.para.copy(de[1]);
        apontarCamera(api);
        dancando = true;
        let musica = 0;
        for (;;) {
          await animar(2.2, () => {});
          await conversa(MUSICAS_DA_DANCA[musica % MUSICAS_DA_DANCA.length]);
          await animar(1.2, () => {});
          await api.voltinhaNaDanca();
          api.soltarCoracoes(2);
          await animar(1.6, () => {});
          musica += 1;
          const mais = await api.ask('Mais uma música?', ['Mais uma', 'Parar de dançar']);
          if (mais !== 0) break;
        }
        api.dancaLenta(null);
        await animar(1.0, () => {});
        dancando = false;
        api.unlock({
          id: 'danca-lenta-na-clareira',
          title: 'Dança lenta na clareira',
          place: 'Parque Villa Lobos',
          note: 'De noite, o radinho de pilha tocando baixinho no chão da clareira e os dois dançando agarradinhos na frente da barraca, com o varal aceso e os vaga-lumes em volta.',
          icon: '📻',
        });
        ceu.visivel = false;
        api.setCameraOmbro(null);
        const voltaA = daTenda(-0.45, 4.05);
        const voltaB = daTenda(0.3, 4.05);
        api.releasePlayer(voltaA.x, voltaA.z, GIRO);
        api.releaseCompanion(voltaB.x, voltaB.z, GIRO);
        api.lockPlayer(false);
        ocupados = false;
      };

      const NO_RADINHO = daTenda(-1.55, 2.95);
      const promptDoRadinho = w.interact({
        id: 'clareira:radinho',
        x: NO_RADINHO.x, z: NO_RADINHO.z, radius: 0.8,
        label: 'Ligar o radinho', icon: '📻',
        highlight: radinho.group,
        onInteract: async (api) => {
          if (ocupados || estado !== 'noite') return;
          if (!radinho.ligado) {
            ocupados = true;
            api.lockPlayer(true);
            pararCamera();
            camera.de.copy(CAMERA_DO_RADINHO[0]);
            camera.para.copy(CAMERA_DO_RADINHO[1]);
            apontarCamera(api);
            await radinho.ligar();
            api.trocarMusica('danca-lenta');
            await animar(1.2, () => {});
            await conversa([[A, 'Ah, essa música…'], [R, 'Dança comigo?']]);
            api.setCameraOmbro(null);
            api.lockPlayer(false);
            ocupados = false;
            const sim = await api.ask('Dança comigo?', ['Dançar', 'Agora não']);
            if (sim === 0) await dancar(api);
            return;
          }
          const i = await api.ask('O radinho tá tocando.', ['Dançar', 'Desligar o radinho', 'Agora não']);
          if (i === 0) await dancar(api);
          else if (i === 1) {
            await radinho.desligar();
            api.trocarMusica('noite-na-clareira');
          }
        },
      });
      // de dia o radinho não faz nada (nem prompt); ligado, o prompt chama para dançar
      w.onUpdate(() => {
        promptDoRadinho.enabled = estado === 'noite';
        promptDoRadinho.label = radinho.ligado ? 'Dançar' : 'Ligar o radinho';
        promptDoRadinho.icon = radinho.ligado ? '💃' : '📻';
      });
      /** o dia voltando (ou a dupla indo dormir) desliga o rádio na hora */
      desligarORadinho = (): void => radinho.desligarJa();

      /*
       * ======================================== OS VAGA-LUMES NO POTE (D)
       *
       * O pedido do Renan: "poder pegá-los e soltar eles onde quisermos, daí
       * eles iluminariam o parque". De noite, o POTE (`world/poteDeVagaLumes.ts`)
       * mora no chão atrás da barraca, longe de qualquer outro prompt: "Pegar o pote" põe na mão de quem
       * joga, e daí o prompt PERSEGUE o vaga-lume mais perto ("Pegar o
       * vaga-lume"): a tampa abre, ele voa para dentro e a tampa fecha —
       * cabem oito. "Soltar os vaga-lumes aqui" anda junto com quem segura o
       * pote: abre a tampa e eles saem voando e ficam rodando ali, com uma
       * poça de luz verde no chão. Cada ponto vai para o save
       * (`vagaLumesSoltos`): hoje só a clareira tem noite e é lá que eles
       * brilham, mas a lista é o que o parque de noite (futuro) vai ler.
       *
       * O pote volta para o lugar dele quando outra coisa começa (cozinhar,
       * dançar, a barraca), e quando a noite acaba os que estavam nele são
       * soltos ali mesmo. As falas são PROVISÓRIAS (do Claude).
       */
      const CASA_DO_POTE = daTenda(2.15, -0.1);
      const pote = new PoteDeVagaLumes();
      pote.group.scale.setScalar(1.5);
      w.add(fundir(w.place(pote.group, CASA_DO_POTE.x, 0, CASA_DO_POTE.z, GIRO + 0.3)));
      const poteEmCasa = (): void => {
        w.root.add(pote.group);
        pote.group.position.set(CASA_DO_POTE.x, 0, CASA_DO_POTE.z);
        pote.group.rotation.set(0, GIRO + 0.3, 0);
      };
      const soltos = new VagaLumesSoltos();
      w.add(soltos.group);
      soltos.carregar(g.vagaLumesSoltos());
      /** quem está segurando o pote (o id da ficha), ou ninguém */
      let poteNaMao: string | null = null;
      let jaSoltaram = false;
      /*
       * NA MÃO, O POTE VAI PELA ALÇA: a mão segura o topo do arame e o vidro
       * pende embaixo dela. Segurado pelo fundo, como um sorvete, a mão
       * atravessava o vidro.
       */
      const peloArame = new THREE.Group();
      peloArame.name = 'pote-na-mao';
      const pegarOPote = (api: GameAPI): void => {
        peloArame.add(pote.group);
        pote.group.position.set(0, -0.178 * 1.5 + 0.012, 0);
        pote.group.rotation.set(0, Math.PI / 2, 0);
        api.segurarNaCena(api.playerId(), peloArame, 'upright');
        poteNaMao = api.playerId();
      };
      /** o pote volta para o lugar dele (com quem estiver dentro, ou soltando antes) */
      const guardarOPote = (api: GameAPI, soltarAntes: boolean): void => {
        if (poteNaMao) api.segurarNaCena(poteNaMao, null);
        poteNaMao = null;
        poteEmCasa();
        if (soltarAntes && pote.quantos > 0) {
          const saem = pote.soltarTodos();
          soltos.soltar(CASA_DO_POTE.x, CASA_DO_POTE.z, saem.length, saem);
          api.soltarVagaLumes(CASA_DO_POTE.x, CASA_DO_POTE.z, saem.length);
        }
      };
      soltarOsDoPote = (): void => guardarOPote(g, true);

      const NO_POTE = daTenda(2.15, 0.45);
      const promptDoPote = w.interact({
        id: 'clareira:pote',
        x: NO_POTE.x, z: NO_POTE.z, radius: 0.7,
        label: 'Pegar o pote de vaga-lumes', icon: '🫙',
        highlight: pote.group,
        onInteract: async (api) => {
          if (ocupados) return;
          if (poteNaMao) {
            guardarOPote(api, false);
            api.toast(pote.quantos > 0 ? 'O pote ficou guardado, brilhando' : 'Pote guardado', '🫙');
            return;
          }
          pegarOPote(api);
          if (!api.flag('pote-de-vaga-lumes')) {
            api.setFlag('pote-de-vaga-lumes');
            await conversa([
              [A, 'Vamos pegar vaga-lume?'],
              [R, 'Devagarinho, pra não machucar. E depois a gente solta.'],
            ]);
          }
          api.toast('Chegue pertinho de um vaga-lume', '✨');
        },
      });
      let alvoDoPote = -1;
      const promptDoVagaLume = w.interact({
        id: 'clareira:vaga-lume',
        x: CL.x, z: CL.z, radius: 0.75, priority: 2,
        label: 'Pegar o vaga-lume', icon: '✨',
        onInteract: async (api) => {
          if (!poteNaMao || pote.cheio || alvoDoPote < 0) return;
          const i = alvoDoPote;
          const onde = vagaLumes.onde(i);
          vagaLumes.pegar(i);
          api.som('vagaLume');
          await pote.pegar(onde);
          if (pote.cheio) api.toast('O pote encheu! Agora é só soltar onde quiser', '🫙');
          else api.toast(`${pote.quantos} ${pote.quantos === 1 ? 'vaga-lume' : 'vaga-lumes'} no pote`, '✨');
        },
      });
      const promptDeSoltar = w.interact({
        id: 'clareira:soltar-vaga-lumes',
        x: CL.x, z: CL.z, radius: 0.6, priority: -2,
        label: 'Soltar os vaga-lumes aqui', icon: '🌟',
        onInteract: async (api) => {
          if (!poteNaMao || pote.quantos === 0) return;
          // o ponto: um passo à frente de quem segura
          const eu = api.playerPosition();
          const olha = api.playerFacing();
          const x = eu.x + Math.sin(olha) * 0.55;
          const z = eu.z + Math.cos(olha) * 0.55;
          const saem = pote.soltarTodos();
          soltos.soltar(x, z, saem.length, saem);
          api.soltarVagaLumes(x, z, saem.length);
          api.som('soltarVagaLumes');
          api.soltarCoracoes(1);
          if (!jaSoltaram && !api.flag('vaga-lumes-soltos')) {
            jaSoltaram = true;
            api.lockPlayer(true);
            await conversa([
              [A, 'Vai, vaga-luminho!'],
              [R, 'Agora esse cantinho é deles. Vai ficar iluminado.'],
            ]);
            api.lockPlayer(false);
            api.unlock({
              id: 'vaga-lumes-soltos',
              title: 'Os vaga-lumes do pote',
              place: 'Parque Villa Lobos',
              note: 'De noite na clareira, um pote de vidro de tampa furadinha: os vaga-lumes pegos um por um, e soltos onde os dois quiseram, para aquele cantinho ficar iluminado.',
              icon: '🫙',
            });
          }
        },
      });
      const naoTemNinguem = new THREE.Vector3();
      w.onUpdate((dt0) => {
        const dt = dt0 * ritmo.vezes;
        pote.update(dt, brilhoDosVagaLumes);
        soltos.update(dt, brilhoDosVagaLumes);
        // outra coisa começou (cozinhar, dançar, a barraca): o pote volta para o lugar, com eles dentro
        if (poteNaMao && ocupados) guardarOPote(g, false);
        // trocou de quem joga (o T): o pote passa para a mão de quem joga agora
        if (poteNaMao && poteNaMao !== g.playerId()) {
          g.segurarNaCena(poteNaMao, null);
          pegarOPote(g);
        }
        const deNoite = estado === 'noite';
        promptDoPote.enabled = deNoite && !ocupados;
        promptDoPote.label = poteNaMao ? 'Guardar o pote' : 'Pegar o pote de vaga-lumes';
        // o prompt de pegar persegue o vaga-lume mais perto de quem segura o pote
        const eu = g.playerPosition();
        // PERTINHO (70 cm): longe disso o prompt é o de soltar — os dois não brigam pelo E
        alvoDoPote = poteNaMao && deNoite && !ocupados && !pote.cheio ? vagaLumes.maisPerto(eu.x, eu.z, 0.7) : -1;
        promptDoVagaLume.enabled = alvoDoPote >= 0;
        if (alvoDoPote >= 0) {
          vagaLumes.onde(alvoDoPote, naoTemNinguem);
          promptDoVagaLume.moveTo(naoTemNinguem.x, naoTemNinguem.z);
        }
        // o de soltar anda junto com quem segura (o mais fraco de todos: perto da barraca, ela ganha)
        promptDeSoltar.enabled = !!poteNaMao && pote.quantos > 0 && !ocupados;
        if (promptDeSoltar.enabled) promptDeSoltar.moveTo(eu.x, eu.z);
      });

      /*
       * ============================================ OLHAR AS ESTRELAS (D)
       *
       * De noite, a canga oferece "Deitar e olhar as estrelas": os dois
       * deitam de barriga para cima, lado a lado, com a cabeça para o lado do
       * radinho e os pés para a mesinha. A câmera vê os dois de cima e sobe
       * devagar até ficar na altura das cabeças, olhando o céu — a cúpula da
       * clareira, com as estrelas, a lua e as copas das árvores na beirada.
       * Lá no alto, doze estrelas fazem um CORAÇÃO: os dois acham, e o risco
       * da constelação vai sendo desenhado traço por traço. Aí passa uma
       * ESTRELA CADENTE (`CeuDaClareira.estrelaCadente`), e cada um faz um
       * pedido que não conta. A câmera volta para cima deles, e eles viram de
       * frente e se beijam (o beijo deitado da barraca, `g.beijarDeitados`).
       * As falas são PROVISÓRIAS (do Claude).
       */
      /** uma direção do céu no quadro da barraca levada para o da cúpula (que é o do mundo) */
      const doCeuDaTenda = (lx: number, ly: number, lz: number): THREE.Vector3 =>
        new THREE.Vector3(lx * cos + lz * sen, ly, -lx * sen + lz * cos).normalize();
      // o coração mora a 70° de altura, para o lado dos pés (o +X da barraca)
      const NO_CEU = new THREE.Vector3(Math.cos(1.22), Math.sin(1.22), 0.08);
      ceu.coracaoEm(doCeuDaTenda(NO_CEU.x, NO_CEU.y, NO_CEU.z));
      /** a âncora de deitar na canga: os pés na beirada do +X do pano, a cabeça para o −X */
      const deitadosNaCanga = new THREE.Object3D();
      deitadosNaCanga.position.set(0.86, 0.14, 0.04);
      deitadosNaCanga.rotation.set(-Math.PI / 2, Math.PI / 2, 0, 'YXZ');
      pano.add(deitadosNaCanga);
      /** as tomadas, no quadro da barraca: de cima (pelo lado dos pés), no céu e o beijo (quase em cima das cabeças) */
      const CAMERA_DA_CANGA_DE_CIMA: Tomada = [new THREE.Vector3(1.55, 2.05, 2.95), new THREE.Vector3(-0.3, 0.1, 2.82)];
      const NAS_CABECAS = new THREE.Vector3(-0.62, 0.5, 2.86);
      const CAMERA_DO_CEU: Tomada = [NAS_CABECAS.clone(), NAS_CABECAS.clone().addScaledVector(NO_CEU, 12)];
      const CAMERA_DO_BEIJO_NA_CANGA: Tomada = [new THREE.Vector3(0.15, 2.35, 2.9), new THREE.Vector3(-0.55, 0.15, 2.84)];
      let olhandoOCeu = false;
      const olharAsEstrelas = async (api: GameAPI): Promise<void> => {
        ocupados = true;
        olhandoOCeu = true;
        api.lockPlayer(true);
        api.ridePlayer(deitadosNaCanga, new THREE.Vector3(-0.3, 0, 0), 1, 0);
        api.rideCompanion(deitadosNaCanga, new THREE.Vector3(0.3, 0, 0), 1, 0);
        api.setLying(true);
        ceu.visivel = true;
        pararCamera();
        camera.de.copy(CAMERA_DA_CANGA_DE_CIMA[0]);
        camera.para.copy(CAMERA_DA_CANGA_DE_CIMA[1]);
        apontarCamera(api);
        await animar(1.2, () => {});
        await conversa([[R, 'Deita aqui do meu lado.'], [A, 'Olha quanta estrela…']]);
        // a câmera desce até as cabeças e vira para o céu
        await deslizarCamera(CAMERA_DO_CEU, 3.2);
        await animar(1.4, () => {});
        await conversa([[A, 'Ali, ó! Aquelas estrelas ali…'], [R, 'Parece um coração.']]);
        api.som('constelacao');
        ceu.acharCoracao(true);
        await animar(4.6, () => {});
        await conversa([[A, 'Achamos a nossa constelação.']]);
        await animar(1.2, () => {});
        // A ESTRELA CADENTE: cruza o céu por cima do coração
        api.som('estrelaCadente');
        await ceu.estrelaCadente(ceu.pertoDoCoracao(-0.42, 0.34), ceu.pertoDoCoracao(0.4, 0.1), 1.4);
        await conversa([
          [R, 'Uma estrela cadente! Faz um pedido, rápido!'],
          [A, 'Fiz. Mas não conto, senão não vale.'],
          [R, 'Eu também fiz.'],
          [A, 'Aposto que foi o mesmo.'],
        ]);
        // de volta para cima deles: viram de frente e se beijam
        await deslizarCamera(CAMERA_DO_BEIJO_NA_CANGA, 2.2);
        await api.beijarDeitados();
        // o risco do coração vai apagando enquanto eles ainda estão ali
        ceu.acharCoracao(false);
        await conversa([[R, 'Melhor céu do mundo.']]);
        await api.virarDeitados(false);
        api.unlock({
          id: 'estrela-cadente',
          title: 'A estrela cadente',
          place: 'Parque Villa Lobos',
          note: 'Deitados na canga de noite, olhando o céu da clareira: a constelação de coração que os dois acharam, uma estrela cadente e um pedido que nenhum dos dois contou.',
          icon: '🌠',
        });
        await animar(1.0, () => {});
        // levantam
        api.setLying(false);
        pararCamera();
        api.setCameraOmbro(null);
        ceu.visivel = false;
        api.releasePlayer(NA_CANGA.x - 0.4, NA_CANGA.z + 0.3, GIRO);
        api.releaseCompanion(NA_CANGA.x + 0.3, NA_CANGA.z - 0.4, GIRO);
        api.lockPlayer(false);
        olhandoOCeu = false;
        ocupados = false;
      };
      /*
       * AS NUVENS DO PARQUE são brancas chapadas (`flat`, sem luz) e moram lá
       * no alto, onde só a câmera da roda gigante e as tomadas que olham o céu
       * chegam: de noite, deitados na canga, elas eram borrões brancos no meio
       * das estrelas. Enquanto a clareira está de noite, elas saem do céu.
       */
      let nuvens: THREE.Object3D[] | null = null;
      let nuvensDeNoite = false;
      w.onUpdate(() => {
        const deNoite = estado === 'noite';
        promptDaCanga.label = deNoite ? 'Olhar as estrelas na canga' : 'Sentar na canga';
        promptDaCanga.icon = deNoite ? '🌠' : '🧺';
        if (deNoite !== nuvensDeNoite) {
          nuvensDeNoite = deNoite;
          nuvens ??= w.root.children.filter((o) => o.name === 'nuvem');
          for (const n of nuvens) n.visible = !deNoite;
        }
      });

      /** gancho de teste: o `scripts/clareira.mjs` mede por aqui */
      barraca.userData.teste = {
        CLAREIRA: CL, TENDA, PORTA, NA_CANGA, NO_FOGAREIRO, NO_RADINHO, NA_PISTA, NO_POTE, CASA_DO_POTE, teto, deitados, ceu, vagaLumes, varal, ritmo, cozinha, radinho, pote, soltos,
        dancando: () => dancando,
        olhandoOCeu: () => olhandoOCeu,
        poteNaMao: () => poteNaMao,
        alvoDoPote: () => alvoDoPote,
        estado: () => estado,
        momento: () => ({ ...agora }),
        /** a noite na hora, sem a virada do céu (os testes da etapa D começam de noite) */
        anoitecerJa: () => {
          estado = 'noite';
          misturarMomentos(NOITE, NOITE, 0, agora);
          pintarMomento();
          g.trocarMusica('noite-na-clareira');
        },
      };
    }

    /* ================================================ A LUNA E O PIQUENIQUE
     *
     * A Luna é a cheerleader dos Gatitos, a atlética da Escola do Gatito, e é
     * por ela que a escola abre: depois que o quadro de inscrições da arena
     * enche (`jean-luc-batido`), ela aparece fazendo piquenique no gramado do
     * lado da roda gigante, no lugar das florzinhas que o Renan apontou numa
     * foto. Conversar com ela destrava a parada da escola no ônibus
     * (`escola-aberta`).
     *
     * O LUGAR É ONDE O SORTEIO PÔS QUATRO CANTEIROS E UM ARBUSTO, entre a
     * cúpula e a mata. Enquanto ela não chegou, eles continuam lá; quando ela
     * chega, somem os que ficam debaixo da toalha e em volta dela — o sorteio
     * não muda (ver `soltosNoGramado`), a cena só apaga.
     *
     * NADA AQUI FICA ACIMA E À FRENTE DELA (a regra dos postos, na skill de
     * bicho): a flâmula é alta, então vai atrás, no `-X/-Z`, e a cesta, que é
     * baixa, fica do lado. A frente dela é o `+X/+Z`, virada para a câmera e
     * para o caminho da roda, de onde a dupla chega.
     */
    const PIQUENIQUE_DA_LUNA = { x: -24, z: -27.6 };
    const LUNA_SENTADA = { x: PIQUENIQUE_DA_LUNA.x - 0.35, z: PIQUENIQUE_DA_LUNA.z - 0.3 };
    /*
     * AS IRMÃS DELA (pedido do Renan: "ela não estaria tendo um piquenique
     * sozinha"): a SOL à direita dela na tela, a ESTRELLA à esquerda — na
     * horizontal da tela, para nenhuma tapar a outra —, cada uma virada um
     * pouco para a Luna, como quem está conversando na toalha.
     */
    const SOL_SENTADA = { x: PIQUENIQUE_DA_LUNA.x + 0.45, z: PIQUENIQUE_DA_LUNA.z - 0.55 };
    const ESTRELLA_SENTADA = { x: PIQUENIQUE_DA_LUNA.x - 0.95, z: PIQUENIQUE_DA_LUNA.z + 0.25 };
    const OLHANDO_O_CAMINHO = Math.PI / 4;
    const piquenique = new THREE.Group();
    piquenique.name = 'piquenique-da-luna';
    piquenique.add(w.place(toalhaDePiquenique(2.3, 1.7, P.lunaToalha, P.lunaToalhaXadrez),
      PIQUENIQUE_DA_LUNA.x, 0, PIQUENIQUE_DA_LUNA.z, 0.12));
    // a cesta vai ATRÁS das três, entre a Luna e a Sol: na frente, ela tapava as patas de uma
    const CESTA_DA_LUNA = { x: PIQUENIQUE_DA_LUNA.x - 0.1, z: PIQUENIQUE_DA_LUNA.z - 0.8 };
    piquenique.add(w.place(cestaDePiquenique(), CESTA_DA_LUNA.x, 0.02, CESTA_DA_LUNA.z, 0.4));
    /*
     * A FLÂMULA vai atrás e À ESQUERDA dela na tela (o `-X/+Z` da tela), e não
     * atrás em linha reta: ali o mastro caía na mesma visada da cabeça e, de
     * perto, parecia sair das orelhas. O giro de 5π/4 abre o pano para FORA
     * (para a esquerda da tela) e mostra para a câmera a face de trás — que
     * também tem o nome escrito.
     */
    // com a Estrella à esquerda, a flâmula foi mais para a esquerda da tela, fora da toalha
    const FLAMULA = { x: PIQUENIQUE_DA_LUNA.x - 1.75, z: PIQUENIQUE_DA_LUNA.z + 0.9 };
    piquenique.add(w.place(flamula('GATITOS'), FLAMULA.x, 0, FLAMULA.z, Math.PI * 1.25));
    w.add(piquenique);

    const luna = new Luna({
      minX: LUNA_SENTADA.x - 0.2, maxX: LUNA_SENTADA.x + 0.2,
      minZ: LUNA_SENTADA.z - 0.2, maxZ: LUNA_SENTADA.z + 0.2,
    });
    const sentarALuna = (): void => luna.sentarEm(LUNA_SENTADA.x, LUNA_SENTADA.z, OLHANDO_O_CAMINHO, 0.02);
    sentarALuna();
    w.add(luna.group);
    /** gancho de teste: o `scripts/luna.mjs` aciona os gestos para fotografar */
    luna.group.userData.teste = { luna, sentar: sentarALuna };
    const sol = new Sol({
      minX: SOL_SENTADA.x - 0.2, maxX: SOL_SENTADA.x + 0.2, minZ: SOL_SENTADA.z - 0.2, maxZ: SOL_SENTADA.z + 0.2,
    });
    const estrella = new Estrella({
      minX: ESTRELLA_SENTADA.x - 0.2, maxX: ESTRELLA_SENTADA.x + 0.2,
      minZ: ESTRELLA_SENTADA.z - 0.2, maxZ: ESTRELLA_SENTADA.z + 0.2,
    });
    const sentarAsIrmas = (): void => {
      sol.sentarEm(SOL_SENTADA.x, SOL_SENTADA.z, OLHANDO_O_CAMINHO - 0.3, 0.02);
      estrella.sentarEm(ESTRELLA_SENTADA.x, ESTRELLA_SENTADA.z, OLHANDO_O_CAMINHO + 0.3, 0.02);
      sol.pararDeEncarar();
      estrella.pararDeEncarar();
    };
    sentarAsIrmas();
    w.add(sol.group);
    w.add(estrella.group);
    sol.group.userData.teste = { sol };
    estrella.group.userData.teste = { estrella };

    // o que o sorteio plantou onde a toalha vai: some quando ela chega. O raio
    // pega os quatro canteiros da foto do Renan (o mais longe fica a 3,1)
    const RAIO_DO_PIQUENIQUE = 3.4;
    const noLugarDoPiquenique = soltosNoGramado.filter(
      (o) => Math.hypot(o.position.x - PIQUENIQUE_DA_LUNA.x, o.position.z - PIQUENIQUE_DA_LUNA.z) < RAIO_DO_PIQUENIQUE,
    );

    /*
     * OS COLISORES SÓ EXISTEM COM ELA AQUI. `blockCircle` é para sempre, e aí
     * quem passasse por este gramado antes do quadro encher trombaria numa
     * coelha invisível. A toalha não bloqueia: dá para pisar nela, como numa
     * toalha de verdade.
     */
    const colisoresDoPiquenique = [
      { kind: 'circle' as const, x: LUNA_SENTADA.x, z: LUNA_SENTADA.z, r: 0.42 },
      { kind: 'circle' as const, x: SOL_SENTADA.x, z: SOL_SENTADA.z, r: 0.4 },
      { kind: 'circle' as const, x: ESTRELLA_SENTADA.x, z: ESTRELLA_SENTADA.z, r: 0.42 },
      { kind: 'circle' as const, x: CESTA_DA_LUNA.x, z: CESTA_DA_LUNA.z, r: 0.3 },
      { kind: 'circle' as const, x: FLAMULA.x, z: FLAMULA.z, r: 0.14 },
    ];

    let lunaNoParque: boolean | null = null;
    const mostrarALuna = (sim: boolean): void => {
      lunaNoParque = sim;
      piquenique.visible = sim;
      luna.group.visible = sim;
      sol.group.visible = sim;
      estrella.group.visible = sim;
      for (const o of noLugarDoPiquenique) o.visible = !sim;
      falarComALuna.enabled = sim;
      falarComASol.enabled = sim;
      falarComAEstrella.enabled = sim;
      for (const c of colisoresDoPiquenique) {
        const i = w.colliders.indexOf(c);
        if (sim && i < 0) w.colliders.push(c);
        if (!sim && i >= 0) w.colliders.splice(i, 1);
      }
    };

    /**
     * AS FALAS DELA. Ela fala português — faz aula com o Gatito há bastante
     * tempo — e o que escapa é espanhol: "épale" (oi!), "naguará" (nossa!),
     * "chévere" (legal), "burda de" (muito), "pana" (amigo), "ya va" (espera),
     * "¡qué pena!" (que vergonha), "¡qué fino!" (que ótimo), "vale" (tá bom).
     * De onde ela veio, ela não conta: é contexto, não assunto.
     *
     * O RITMO É O DELA: empolga falando dos Gatitos, dispara, percebe e fica
     * tímida. Os gestos (`torcer`, `ficarTimida`) entram entre uma fala e outra,
     * então o corpo dela acompanha o que ela diz.
     */
    const L = 'Luna';
    const falarComALuna = w.interact({
      id: 'parque:luna',
      x: LUNA_SENTADA.x, z: LUNA_SENTADA.z, radius: 1.9,
      label: 'Falar com a coelhinha', icon: '🐰',
      highlight: luna.group,
      onInteract: async (api) => {
        /*
         * A DUPLA VAI PARA A FRENTE-DIREITA DELA, e não fica onde estava. O
         * lado natural de chegar é o da câmera — e aí os dois paravam
         * exatamente entre a Luna e a tela, tapando a coelha inteira (a foto
         * do teste mostrou só as orelhas). Na diagonal, 1,3 para o lado da
         * tela e um pouco à frente, eles ficam fora dessa linha, ela se vira
         * três quartos para eles, e a cesta fica entre os três.
         */
        const DIREITA_DA_TELA = { x: Math.SQRT1_2, z: -Math.SQRT1_2 };
        const PARA_A_CAMERA = { x: Math.SQRT1_2, z: Math.SQRT1_2 };
        const ponto = (lado: number, frente: number): { x: number; z: number } => ({
          x: LUNA_SENTADA.x + DIREITA_DA_TELA.x * lado + PARA_A_CAMERA.x * frente,
          z: LUNA_SENTADA.z + DIREITA_DA_TELA.z * lado + PARA_A_CAMERA.z * frente,
        });
        // um pouco mais longe que o de costume: a Sol está sentada logo ali
        const eu = ponto(1.6, 1.0);
        const par = ponto(2.3, 0.8);
        const olhandoPraEla = (p: { x: number; z: number }): number =>
          Math.atan2(LUNA_SENTADA.x - p.x, LUNA_SENTADA.z - p.z);
        api.lockPlayer(true);
        api.releasePlayer(eu.x, eu.z, olhandoPraEla(eu));
        api.releaseCompanion(par.x, par.z, olhandoPraEla(par));
        api.holdCompanion(LUNA_SENTADA.x, LUNA_SENTADA.z);
        luna.levantar();
        luna.encarar((eu.x + par.x) / 2, (eu.z + par.z) / 2);
        // as irmãs viram o rosto para quem chegou (sentadas: só o giro do encarar)
        sol.encarar((eu.x + par.x) / 2, (eu.z + par.z) / 2);
        estrella.encarar((eu.x + par.x) / 2, (eu.z + par.z) / 2);
        /*
         * A CÂMERA CHEGA PERTO NA CONVERSA. O piquenique fica dentro da zona
         * da roda gigante, que abre o enquadramento em ~19 — bom para ver a
         * roda, e pequeno demais para ver uma coelha torcendo. Durante a
         * conversa a zona solta a câmera (`zoomLivre`, mais abaixo) e ela
         * mira na Luna; no fim tudo volta, mesmo se a conversa sair no meio.
         */
        zoomLivre = false;
        api.focusCamera(luna.group);
        api.setZoom(8);
        try {
          await conversarComALuna(api);
        } finally {
          api.focusCamera(null);
          zoomLivre = true;
          api.freeCompanion();
          api.lockPlayer(false);
          luna.pararDeEncarar();
          sentarALuna();
          sentarAsIrmas();
        }
      },
    });
    falarComALuna.label = g.flag('escola-aberta') ? 'Falar com a Luna' : 'Falar com a coelhinha';

    /**
     * AS IRMÃS TAMBÉM CONVERSAM, cada uma do seu jeito — mas o convite é da
     * Luna: antes dele, elas mandam falar com ela. A dupla vai para a
     * frente-DIREITA da Sol (a toalha está à esquerda dela) e para a
     * frente-ESQUERDA da Estrella (à direita dela estão a Luna e a Sol).
     */
    const conversarComIrma = async (
      api: typeof g, irma: Sol | Estrella, lugar: { x: number; z: number }, paraDireita: boolean,
      falas: (apresentadas: boolean) => Array<[string, string]>,
    ): Promise<void> => {
      const c = Math.SQRT1_2;
      const ponto = (lado: number, frente: number): { x: number; z: number } => ({
        x: lugar.x + c * lado + c * frente,
        z: lugar.z - c * lado + c * frente,
      });
      const s = paraDireita ? 1 : -1;
      const eu = ponto(1.3 * s, 1.0);
      const par = ponto(2.0 * s, 0.8);
      const olhando = (p: { x: number; z: number }): number => Math.atan2(lugar.x - p.x, lugar.z - p.z);
      api.lockPlayer(true);
      api.releasePlayer(eu.x, eu.z, olhando(eu));
      api.releaseCompanion(par.x, par.z, olhando(par));
      api.holdCompanion(lugar.x, lugar.z);
      irma.encarar((eu.x + par.x) / 2, (eu.z + par.z) / 2);
      zoomLivre = false;
      api.focusCamera(irma.group);
      api.setZoom(8);
      try {
        for (const [quem, texto] of falas(api.flag('escola-aberta'))) {
          if (quem === 'Sol') {
            irma.torcer(1.4);
            api.som('sacudida');
          }
          await api.say([texto], quem);
        }
      } finally {
        api.focusCamera(null);
        zoomLivre = true;
        api.freeCompanion();
        api.lockPlayer(false);
        sentarAsIrmas();
      }
    };
    const falarComASol = w.interact({
      id: 'parque:sol',
      x: SOL_SENTADA.x, z: SOL_SENTADA.z, radius: 1.1,
      label: 'Falar com a coelhinha laranja', icon: '🌞',
      highlight: sol.group,
      onInteract: (api) => conversarComIrma(api, sol, SOL_SENTADA, true, (apresentadas) => apresentadas
        ? [['Sol', '¡VÃO NA ESCOLA! ¡QUÉ NOTA! A gente se vê no ginásio, panas!'], ['Sol', 'O ônibus é ali! ¡Rapidito!']]
        : [['Sol', '¡ÉPALE! ¡Oi, oi, OI!'], ['Sol', 'Fala com a Luna primeiro, ela que tá com o convite! ¡Luna! ¡LUNA! Visita!']]),
    });
    const falarComAEstrella = w.interact({
      id: 'parque:estrella',
      x: ESTRELLA_SENTADA.x, z: ESTRELLA_SENTADA.z, radius: 1.1,
      label: 'Falar com a coelhinha marrom', icon: '⭐',
      highlight: estrella.group,
      onInteract: (api) => conversarComIrma(api, estrella, ESTRELLA_SENTADA, false, (apresentadas) => apresentadas
        ? [['Estrella', 'Vão pegar o ônibus? Cuidado na rua, tá?'], ['Estrella', 'E levem água. A escola é longe e a Sol vai querer mostrar o ginásio inteiro.']]
        : [['Estrella', 'Oi. Tudo bem? Senta aí na sombra, se quiser.'], ['Estrella', 'Pode falar com a Luna. Ela adora visita... e adora falar.']]),
    });
    if (g.flag('escola-aberta')) {
      falarComASol.label = 'Falar com a Sol';
      falarComAEstrella.label = 'Falar com a Estrella';
    }

    const conversarComALuna = async (api: typeof g): Promise<void> => {
      const diz = (texto: string, quem = L): Promise<void> => api.say([texto], quem);

      if (!api.flag('escola-aberta')) {
        await diz('¡Épale! Oi, oi! Vieram ver o piquenique?', 'Coelhinha');
        await diz('Que toalha bonita.', R);
        await diz('É nas cores dos Gatitos! Azul e amarelo. Eu que escolhi, óbvio.', 'Coelhinha');
        await diz('Gatitos?', A);
        luna.torcer(2.6);
        api.som('sacudida');
        await diz('¡Los Gatitos! A atlética da Escola do Gatito! Eu sou a Luna, cheerleader oficial deles!');
        luna.torcer(2.6);
        api.som('sacudida');
        await diz('G-A-T-I-T-O-S! Gaaatitos! ¡Vamos, Gatitos!');
        await diz('Tem jogo de basquete no ginásio, e a gente ensaia toda semana, e o pompom novo chegou, e ele é burda de brilhante, e a coreografia tem um salto que—');
        luna.ficarTimida(3.2);
        await diz('...¡Ay, qué pena! Ya va. Tô falando demais, né?');
        await diz('Que nada. Pode continuar.', A);
        luna.ficarTimida(2);
        await diz('É que eu fico assim quando falo dos Gatitos. Me emociono.');
        await diz('Mas eu não sou só da torcida, viu? Eu faço aula de português lá na escola.');
        await diz('Quem dá é o professor Gatito. Ele é um gato. Assim, gato mesmo, de bigode e tudo.');
        await diz('Um gato dá aula?', R);
        await diz('Dá, e dá muito bem! Ele corrige com carinho. Ninguém tira nota vermelha com ele.');
        await diz('Eu faço faz tempão. Ainda escapa uma palavra ou outra, mas o Gatito diz que isso é chévere. Que é tempero.');
        await diz('Eu gostei do tempero.', A);
        luna.torcer(2.2);
        api.som('sacudida');
        await diz('¡Qué fino! Então vocês TÊM que conhecer a escola. Sério, sério.');
        await diz('O ônibus do ponto, lá na saída do parque, para na Escola do Gatito. Eu aviso lá que vocês são meus panas.');
        await diz('Panas?', R);
        await diz('Amigos! Panas. Pronto: agora vocês já aprenderam uma palavra comigo.');
        await diz('E se virem um gato de meia cara caramelo passeando pelo corredor... é ele! Vale?');
        /*
         * AS IRMÃS se apresentam no fim (pedido do Renan: a Luna fala
         * primeiro). A Sol, animada e alta; a Estrella, calma, e já cuidando
         * das duas.
         */
        luna.torcer(1.6);
        await diz('Ah! E essas são as minhas irmãs: a Sol e a Estrella. Também são cheerleaders dos Gatitos!');
        sol.torcer(2.4);
        api.som('sacudida');
        await diz('¡HOLA, PANAS! ¡Épale! Prazer, prazer, PRAZER!', 'Sol');
        await diz('Oi. Prazer. Desculpa a Sol, ela é assim mesmo.', 'Estrella');
        await diz('Luna, você passou protetor solar? O sol tá forte hoje.', 'Estrella');
        sol.torcer(1.4);
        await diz('¡EU TÔ AQUI!', 'Sol');
        await diz('...O outro sol, Sol.', 'Estrella');
        await diz('Três cheerleaders. Os Gatitos estão bem servidos.', R);
        api.setFlag('escola-aberta');
        falarComALuna.label = 'Falar com a Luna';
        falarComASol.label = 'Falar com a Sol';
        falarComAEstrella.label = 'Falar com a Estrella';
        api.som('memoria');
        api.toast('Nova parada no ônibus: Escola do Gatito', '🚌');
        api.unlock({
          id: 'luna-piquenique',
          title: 'A torcedora dos Gatitos',
          place: 'Parque Villa Lobos',
          note: 'Do lado da roda gigante tinha três coelhinhas de pompom fazendo piquenique. '
            + 'A Luna, cheerleader dos Gatitos, falou da escola sem parar, ficou com vergonha, '
            + 'e convidou a gente para conhecer as aulas do professor Gatito. As irmãs dela '
            + 'são a Sol, que fala gritando de tão feliz, e a Estrella, que cuida das duas.',
          icon: '🐰',
        });
      } else {
        // o convite já foi feito: ela está de saída, o treino é na escola
        await diz('Vão lá! O ônibus tá ali no ponto, ó. Eu vou logo depois: hoje tem treino no ginásio.');
      }
    };

    /*
     * ELA SÓ EXISTE DEPOIS DO QUADRO ENCHER, E ATÉ IR PARA A ESCOLA. Depois da
     * conversa ela passa a treinar no ginásio da escola — mas não some na cara
     * da dupla: quem decide é o `escola-aberta` de QUANDO A CENA MONTOU. Na
     * visita em que ela convida, ela fica no piquenique; na próxima vez que a
     * dupla vier ao parque, a toalha já foi recolhida e as florzinhas voltam.
     */
    const lunaFoiPraEscola = g.flag('escola-aberta');
    w.onUpdate((dt) => {
      const aqui = g.flag('jean-luc-batido') && !lunaFoiPraEscola;
      if (aqui !== lunaNoParque) mostrarALuna(aqui);
      if (aqui) {
        luna.update(dt);
        sol.update(dt);
        estrella.update(dt);
      }
    });

    // ---------------------------------------------------------- horizonte
    // o rio, os predios e a mata que aparecem quando a roda gigante sobe
    w.patch(-66, -10, 18, 220, P.water, 0, 0.02);
    w.patch(-55, -10, 6, 220, P.concrete, 0, 0.03, calcadaDePedrinha());

    for (let i = 0; i < 22; i++) {
      const alto = w.range(7, 20);
      const largo = w.range(4, 9);
      w.add(
        w.place(
          building(largo, alto, largo * 0.9, w.pick([P.wallCream, P.concrete, P.wallMint]), P.metalGrey),
          w.range(-95, 60), 0, -96 - w.range(0, 16),
        ),
      );
    }
    for (let i = 0; i < 14; i++) {
      const alto = w.range(6, 16);
      w.add(
        w.place(building(w.range(4, 8), alto, 5, P.wallCream, P.roofTile), 92 + w.range(0, 16), 0, w.range(-60, 40)),
      );
    }

    // mata fechada em volta, so silhueta
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * Math.PI * 2;
      const raio = 62 + w.range(0, 28);
      const x = Math.cos(a) * raio;
      const z = Math.sin(a) * raio * 0.9;
      if (x < -50) continue; // do outro lado do rio nao tem mata
      // e a rua passa por baixo da mata: sem isto a silhueta planta árvore no
      // asfalto nas duas pontas, onde o anel cruza a faixa da rua
      if (x > 33.2 && Math.abs(z) < 44) continue;
      w.add(w.place(tree(w.pick(kinds), w.range(1.2, 2.2), w.rng()), x, 0, z, w.range(0, 6.28)));
    }

    // --------------------------------------------------------------- ceu
    for (let i = 0; i < 9; i++) {
      const c = cloud(w.range(1.6, 3.2));
      // com nome: de noite, na clareira, elas saem do céu (ver "olhar as estrelas")
      c.name = 'nuvem';
      // a camera do passeio sobe ate ~60u de altura: nuvem baixa demais entra
      // na frente da roda gigante em vez de ficar de enfeite no fundo
      c.position.set(w.range(-70, 70), w.range(56, 70), w.range(-60, 45));
      w.root.add(c);
      const drift = w.range(0.25, 0.6);
      w.onUpdate((dt) => {
        c.position.x += drift * dt;
        if (c.position.x > 56) c.position.x = -56;
      });
    }

    // ------------------------------------------------------------- portao
    const portao = w.add(w.place(signBoard(P.wood, P.metalWhite), 2.6, 0, 27.5, Math.PI));
    w.add(w.place(fence(16, 1.4), -10, 0, 28));
    w.add(w.place(fence(16, 1.4), 10, 0, 28));
    w.blockBox(-10, 28, 8, 0.2);
    w.blockBox(10, 28, 8, 0.2);

    // ---------------------------------------- ponto de ônibus para o clube
    // a cerca do parque tem um vão aqui; do outro lado é a rua, com o ônibus
    // parado esperando. A placa escrita deixa claro para onde ele vai.
    // A cerca recuou de `35` para `33,5`: com a calçada alargada, em `35` ela
    // ficava plantada no MEIO dela. Agora é a divisa entre o parque e a
    // calçada, que é onde cerca de parque fica.
    //
    // O CORREDOR É O EIXO `z = 13`, e ele é vazio. Do vão da cerca até a porta
    // do ônibus dá para andar em linha reta, sem contornar nada: o abrigo
    // estava plantado bem no meio dele e quem descia do ônibus esbarrava na
    // cobertura em vez de ver o parque. Abrigo, placa e canteiro ficam nas
    // beiradas; a única coisa no eixo é a porta do ônibus.
    w.add(w.place(fence(11, 1.4), 33.5, 0, 3.5, Math.PI / 2));
    w.add(w.place(fence(11, 1.4), 33.5, 0, 22.5, Math.PI / 2));
    w.blockBox(33.5, 3.5, 0.2, 5.5);
    w.blockBox(33.5, 22.5, 0.2, 5.5);

    // A rua e o caminho que chega nela sao a MESMA cor e se cruzavam em x 34~36:
    // dois asfaltos colados no mesmo lugar, piscando um por cima do outro. O
    // caminho agora para na calçada, e a rua começa depois dela.
    // A calçada alargou de 1,6 para 2,8: o abrigo do ponto tem 2,3 de fundo, e
    // na faixa antiga metade dele nasceria dentro da rua.
    // O caminho tem a largura do vão (6, e não 5): assim ele encosta na soleira
    // sem deixar duas listras de grama sobrando nos cantos do portão.
    // (o caminho do parque até o vão é a `caixaRedonda` da rede de caminhos, lá em cima)
    // A rua atravessa o cenário INTEIRO (80 de comprimento, contra os 44 de
    // área jogável): rua que começa e acaba dentro da tela vira pátio. Ela
    // some no horizonte nas duas pontas, como rua de verdade.
    w.patch(35, 0, 2.8, RUA_COMP, P.concrete, 0, 0.014, calcadaDePedrinha()); // calçada
    w.patch(40.8, 0, 8.8, RUA_COMP, P.asphalt, 0, 0.018, asfalto()); // a rua

    // o tracejado do meio da rua. Sem ele o asfalto texturizado continua lendo
    // como pátio: é a faixa que diz "isto é uma rua, o ônibus passa por aqui".
    // Um traço de 2 m a cada 5 m, de ponta a ponta.
    for (let z = -RUA_COMP / 2 + 2; z <= RUA_COMP / 2 - 2; z += 5) {
      w.patch(40.8, z, 0.22, 2, P.metalWhite, 0, 0.022);
    }
    // a guia: o degrau entre a calçada e o asfalto
    w.add(w.place(meioFio(RUA_COMP), 36.4, 0, 0));

    // A SOLEIRA do vão, como a do portão do clube: a pedrinha da calçada entra
    // pelo vão e encosta no asfalto do caminho, então a passagem lê como
    // entrada e não como um buraco na cerca.
    w.patch(33.4, 13, 2.6, 8, P.concrete, 0, 0.026, calcadaDePedrinha());

    /**
     * O ônibus deita ao longo do Z com `-PI/2`, que leva a porta (o `+Z` da
     * peça) para o `-X` do mundo — virada para a calçada, que é de onde a
     * dupla embarca.
     *
     * Ele parou em `z = 10,4`, e não no 13 do corredor: a porta fica 2,6 À
     * FRENTE do centro da peça, então é com o centro aqui que ela cai bem no
     * eixo. Quem sai do vão anda reto e entra; quem desce sai olhando o parque.
     */
    const onibus = w.add(w.place(bus(P.onibusAzul, 'Clube'), 39.5, 0, 10.4, -Math.PI / 2));
    w.blockBox(39.5, 10.4, 1.4, 4.5);

    // O abrigo abre para o `+Z` da peça; `+PI/2` põe essa boca virada para a
    // rua. O colisor pega só o fundo e o banco — a frente é vazada, e quem
    // espera precisa poder entrar embaixo do teto.
    // Ele subiu a rua até `z = 19`: em 13 ficava atravessado no corredor, e
    // descer do ônibus era esbarrar na cobertura. Aqui ele encosta no trecho
    // norte da cerca, continua na calçada e o caminho passa limpo na frente.
    const parada = w.add(w.place(busStop(), 35, 0, 19, Math.PI / 2));
    w.blockBox(34.3, 19, 0.4, 2.4);
    w.blockCircle(35.5, 21.65, 0.25); // o totem da parada

    const placaClube = w.add(w.place(textSign('Clube!', 0x4ec1a8), 34.4, 0, 8.2, Math.PI * 0.25));
    w.blockCircle(34.4, 8.2, 0.3);

    // os canteiros que emolduram o vão, um de cada lado e fora do corredor
    for (const z of [8.4, 17.6]) {
      w.add(w.place(canteiro(1.1, undefined, w.rng()), 32.2, 0, z));
      w.blockCircle(32.2, z, 0.9);
    }

    /*
     * O ÔNIBUS TEM DUAS LINHAS depois da Luna: o clube de sempre e a Escola do
     * Gatito. Antes dela ele é a porta direta de antes (mesmo id, mesmo
     * rótulo); depois, ele pergunta para onde — e "ficar" é uma resposta, para
     * quem abriu sem querer.
     */
    const pegarOOnibus = w.interact({
      id: 'door:clube:portaria',
      x: 37.6, z: 13, radius: 2.6,
      label: 'Pegar o ônibus pro clube', icon: '🚌',
      highlight: onibus,
      onInteract: async (api) => {
        if (!api.flag('escola-aberta')) {
          api.goTo('clube', 'portaria');
          return;
        }
        const destino = await api.ask('Pra onde a gente vai?', ['Clube', 'Escola do Gatito', 'Ficar no parque']);
        if (destino === 0) api.goTo('clube', 'portaria');
        else if (destino === 1) api.goTo('escola', 'da-rua');
      },
    });
    w.onUpdate(() => {
      pegarOOnibus.label = g.flag('escola-aberta') ? 'Pegar o ônibus' : 'Pegar o ônibus pro clube';
    });

    w.door({
      x: 0, z: 27,
      to: 'casa', entry: 'da-rua',
      label: 'Voltar pra casa', icon: '🏠',
      highlight: portao,
      radius: 2.2,
    });

    // ------------------------------------------------------------- frisbee
    const disco = new Frisbee(P.frisbee);
    disco.mesh.visible = false;
    disco.onLand = () => g.som('quicar');
    w.root.add(disco.mesh);

    // A marca de onde o disco vai cair, enquanto a barra enche. Sem ela
    // "segure F" é adivinhação: não há como saber o que a barra vale em metros
    // de grama.
    const mira = marcaDeMira();
    mira.visible = false;
    mira.userData.mira = true; // é por aqui que o teste da força acha a marca
    w.root.add(mira);

    /**
     * Frisbee de dois, dentro da quadra.
     *
     * O disco só existe na mão enquanto você está na quadra — fora dela some, e
     * o parceiro volta a andar do seu lado. Dentro, ele se posiciona do lado
     * oposto e o lançamento é carregado: quanto mais tempo segurando F, mais
     * longe o disco vai. A mira é para onde você está olhando, então errar o
     * passe faz parte — ele corre atrás, agora com o disco ainda no ar.
     */
    type FaseDisco =
      | 'fora'
      | 'comigo'
      | 'voando-pra-ele'
      | 'buscando'
      | 'com-ele'
      | 'voando-pra-mim'
      | 'no-chao';

    const CARGA_CHEIA = 1.3; // segundos até a força total
    /** abaixo disto foi um toque, não uma carga: vira passe limpo */
    const CARGA_MINIMA = 0.12;
    /** distância do arremesso mais fraco possível */
    const DIST_MIN = 4;
    /** nenhum lançamento passa disto, nem com a barra cheia */
    const TETO = 22;
    /** meia-largura da faixa do passe perfeito, na escala da barra */
    const ZONA = 0.06;

    /**
     * O passe de volta do parceiro.
     *
     * Ele não mira nos pés de quem vai receber: mira num ponto ALÉM, então o
     * disco cruza a área do jogador ainda no ar, em vez de aterrissar em cima
     * dele. Com o arco mais alto ele também chega mais devagar. As duas coisas
     * juntas dobram a janela de interceptação (medida na física: ~0,3 s antes,
     * ~0,6 s agora), que é o ponto da mecânica — pegar voando, não catar do chão.
     */
    const RETORNO = {
      /** quanto o alvo passa do jogador, em unidades */
      alem: 3.5,
      /** multiplicador da subida; 1 é passe reto */
      arco: 1.2,
      /** erro de mira: pouco, senão ele nunca acerta a área */
      erro: 0.06,
      /** desvio lateral do alvo, em unidades */
      desvio: 1.4,
      /** altura máxima em que dá para agarrar (o disco passa por cima da cabeça) */
      alcance: 3.0,
      /** raio em volta de quem recebe */
      raio: 2.1,
      /** o quanto ele pode estar torto para considerar que já mirou (rad) */
      mira: 0.12,
    };

    /**
     * Onde o disco deixa de existir.
     *
     * São os limites FINAIS: o `Frisbee` grampeia exatamente aqui, sem folga
     * própria. Tem que ser assim, senão a barra prometeria uma distância que a
     * grade não deixa cumprir — que era o bug. A escala antiga ia até 30 numa
     * quadra de 26, então de 60% de carga para cima todo arremesso morria no
     * mesmo alambrado e não havia força nenhuma para dosar.
     */
    const LIMITES_QUADRA = {
      minX: qx0 + 1.7,
      minZ: qz0 + 1.7,
      maxX: qx1 - 1.7,
      maxZ: qz1 - 1.7,
    };

    const limitar = (v: number, min: number, max: number): number =>
      Math.max(min, Math.min(max, v));

    /** diferença entre dois ângulos pelo caminho mais curto */
    const desvioAngular = (a: number, b: number): number =>
      Math.atan2(Math.sin(a - b), Math.cos(a - b));

    /**
     * Distância no chão, ignorando a altura.
     *
     * Quase toda medida aqui compara gente (y = 0) com o disco (y = 1 a 3), e
     * `distanceTo` somaria essa altura: o passe pareceria um metro maior do
     * que foi, e o recorde ficaria mentindo.
     */
    const noChao = (a: THREE.Vector3, b: THREE.Vector3): number =>
      Math.hypot(a.x - b.x, a.z - b.z);

    // ------------------------------------------------------- alvos da quadra
    /**
     * Aro ou cesta que vale ponto quando o disco passa por dentro.
     *
     * `recarga` faz dois papéis: é a comemoração (o aro girando) e a trava que
     * impede um voo lento de contar duas vezes no mesmo buraco.
     */
    interface Alvo {
      centro: THREE.Vector3;
      raio: number;
      pontos: number;
      /** a rosca que gira quando acerta */
      roda: THREE.Object3D | null;
      recarga: number;
    }

    const alvos: Alvo[] = [];

    const porAro = (
      x: number, z: number, altura: number, pontos: number, cor: number,
    ): void => {
      // o buraco do aro fica no Z local, então a meia-volta aponta ele para o
      // eixo em que a dupla troca passes
      const peca = w.add(w.place(aroDeFrisbee(cor, altura), x, 0, z, Math.PI / 2));
      w.blockCircle(x, z + 0.96, 0.36); // o poste
      w.blockCircle(x, z, 0.75); // e o vão: ninguém fica de pé dentro do aro
      alvos.push({
        centro: new THREE.Vector3(x, altura, z),
        raio: 0.58,
        pontos,
        roda: (peca.userData.aro as THREE.Object3D | undefined) ?? null,
        recarga: 0,
      });
    };

    // Os três ficam FORA da linha do meio, que é por onde os passes passam: um
    // alvo em cima da linha de passe seria acertado sem querer o tempo todo, e
    // ponto que cai sozinho não é ponto. Quanto mais alto, mais vale.
    porAro(13, -9.4, 1.9, 1, P.frisbee);
    porAro(23, 1.4, 2.1, 2, P.gold);
    porAro(18, -0.6, 2.5, 3, P.frisbee);

    /** distância do centro de um alvo ao trecho que o disco percorreu no quadro */
    const distanciaAoTrecho = (a: THREE.Vector3, b: THREE.Vector3, p: THREE.Vector3): number => {
      const abx = b.x - a.x;
      const aby = b.y - a.y;
      const abz = b.z - a.z;
      const len2 = abx * abx + aby * aby + abz * abz;
      if (len2 < 1e-8) return p.distanceTo(a);
      const s = limitar(
        ((p.x - a.x) * abx + (p.y - a.y) * aby + (p.z - a.z) * abz) / len2, 0, 1,
      );
      return Math.hypot(p.x - (a.x + abx * s), p.y - (a.y + aby * s), p.z - (a.z + abz * s));
    };

    /**
     * O teste é contra o TRECHO do quadro, não contra a posição.
     *
     * Num quadro ruim o disco anda 0,75 — mais que o buraco do aro — e um teste
     * de ponto simplesmente atravessaria o alvo sem ver.
     */
    const conferirAlvos = (de: THREE.Vector3, ate: THREE.Vector3): void => {
      for (const alvo of alvos) {
        if (alvo.recarga > 0) continue;
        if (distanciaAoTrecho(de, ate, alvo.centro) > alvo.raio) continue;
        alvo.recarga = 1.6;
        g.som('sino');
        g.bump('frisbee.alvos', alvo.pontos);
        g.toast(`+${alvo.pontos} no alvo!`, '🎯');
      }
    };

    const animarAlvos = (dt: number): void => {
      for (const alvo of alvos) {
        if (alvo.recarga <= 0) continue;
        alvo.recarga = Math.max(0, alvo.recarga - dt);
        if (alvo.roda) alvo.roda.rotation.z += dt * 9 * alvo.recarga;
      }
    };

    // --------------------------------------------------------- estado do jogo
    let fase: FaseDisco = 'fora';
    let esperaDele = 0;
    let carga = 0;
    let carregando = false;
    let trocasNaSessao = 0;
    let ultimoPosto: { x: number; z: number } | null = null;
    /** de onde saiu o último lançamento: é a régua do tamanho do passe */
    const saidaDoPasse = new THREE.Vector3();
    /** onde ele estava quando o disco saiu: mede o quanto teve que correr */
    const posDeleNoLancamento = new THREE.Vector3();
    /** o último lançamento saiu dentro da zona certa da barra */
    let passePerfeito = false;
    /** para onde ele corre para interceptar, e quanto falta para recalcular */
    let alvoDaCorrida: THREE.Vector3 | null = null;
    let recalcular = 0;
    /** o sorteio da pegada é UM por voo, senão ele tentaria de novo a cada quadro */
    let sorteado = false;
    let vaiPegar = true;
    /** giro do jogador no quadro anterior: é dele que sai a curva do disco */
    let olharAnterior = 0;

    /** uma fala curta no canto da tela; diálogo modal cortaria o jogo no meio */
    const falar = (linhas: string[]): void => {
      g.toast(linhas[Math.floor(Math.random() * linhas.length)], '💬');
    };

    /**
     * Até onde dá para jogar nesta direção sem bater na grade.
     *
     * É o que faz a barra medir a QUADRA e não um número inventado: 100% de
     * carga é sempre o último ponto útil daquele rumo.
     */
    const alcanceNaDirecao = (de: THREE.Vector3, ang: number): number => {
      const dx = Math.sin(ang);
      const dz = Math.cos(ang);
      const tx =
        dx > 0.001 ? (LIMITES_QUADRA.maxX - de.x) / dx
        : dx < -0.001 ? (LIMITES_QUADRA.minX - de.x) / dx
        : Infinity;
      const tz =
        dz > 0.001 ? (LIMITES_QUADRA.maxZ - de.z) / dz
        : dz < -0.001 ? (LIMITES_QUADRA.minZ - de.z) / dz
        : Infinity;
      return limitar(Math.min(tx, tz) - 1, DIST_MIN + 3, TETO);
    };

    const distDaCarga = (de: THREE.Vector3, ang: number, c: number): number =>
      DIST_MIN + (alcanceNaDirecao(de, ang) - DIST_MIN) * limitar(c, 0, 1);

    /** o inverso: que pedaço da barra cai a esta distância */
    const cargaParaDistancia = (de: THREE.Vector3, ang: number, dist: number): number => {
      const alcance = alcanceNaDirecao(de, ang);
      return limitar((dist - DIST_MIN) / Math.max(0.01, alcance - DIST_MIN), 0, 1);
    };

    /** quanta carga cai na mão dele; `null` quando ele está fora de alcance */
    const cargaDoParceiro = (
      de: THREE.Vector3, ang: number, ele: THREE.Vector3,
    ): number | null => {
      const c = cargaParaDistancia(de, ang, Math.hypot(ele.x - de.x, ele.z - de.z));
      return c > 0.02 && c < 0.99 ? c : null;
    };

    /**
     * Tapinha vira balão lento e fácil de agarrar; força total vira passe reto
     * e rasteiro. É o que dá jeito a cada arremesso sem pedir tecla nova.
     */
    const arcoDaCarga = (c: number): number => 1.35 - 0.45 * limitar(c, 0, 1);

    const contarTroca = (api: typeof g, noAr: boolean): void => {
      api.som('pegar');
      trocasNaSessao += 1;
      const total = api.bump('frisbee.trocas');

      const recorde = api.stat('frisbee.recorde');
      if (trocasNaSessao > recorde) api.bump('frisbee.recorde', trocasNaSessao - recorde);

      if (noAr) api.toast('Pegou no ar!', '🥏');
      else if (trocasNaSessao % 5 === 0) api.toast(`${trocasNaSessao} trocas seguidas!`, '🥏');

      if (total >= 10 && !api.flag('memoria-frisbee')) {
        api.setFlag('memoria-frisbee');
        api.unlock({
          id: 'frisbee-villa',
          title: 'Frisbee no Villa',
          place: 'Parque Villa Lobos',
          note: 'Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.',
          icon: '🥏',
        });
      }

      // a meta de verdade: dez SEGUIDAS, sem o disco encostar no chão
      if (trocasNaSessao >= 10 && !api.flag('memoria-frisbee-dez')) {
        api.setFlag('memoria-frisbee-dez');
        api.unlock({
          id: 'frisbee-dez',
          title: 'Dez sem deixar cair',
          place: 'Parque Villa Lobos',
          note: 'Dez trocas seguidas e nenhuma no chão. A gente parou porque deu fome, não porque errou.',
          icon: '🏆',
        });
      }
    };

    /** Onde o parceiro se planta para receber: lado oposto, dentro das linhas. */
    const postoDoParceiro = (eu: THREE.Vector3): { x: number; z: number } => {
      const lado = eu.x < QUADRA.x ? 1 : -1;
      return {
        x: limitar(eu.x + lado * 11, qx0 + 2, qx1 - 2),
        z: limitar(eu.z, qz0 + 2, qz1 - 2),
      };
    };

    const soltarCarga = (): void => {
      carregando = false;
      carga = 0;
      mira.visible = false;
      g.showCharge(null);
    };

    /** o disco só é meu se estiver na MINHA vaga principal */
    const naMinhaMao = (): boolean => g.getActiveHandItem()?.id === ITENS.frisbee.id;

    /** avisou que a mochila estava cheia; zera ao sair da quadra */
    let avisouCheio = false;

    /**
     * Entrar na quadra é PEGAR o disco, e pegar passa pelo auto-stash.
     *
     * Mochila cheia não arma a quadra: sem vaga não há disco, e o aviso sai uma
     * vez só — o teste de entrada roda todo quadro.
     */
    const entrarNaQuadra = (): boolean => {
      const como = g.addItem(ITENS.frisbee);
      if (como === 'cheio') {
        if (!avisouCheio) {
          avisouCheio = true;
          g.toast('Sem vaga pro frisbee', '🥏');
        }
        return false;
      }
      fase = 'comigo';
      disco.pickUp();
      trocasNaSessao = 0;
      ultimoPosto = null;
      g.setZoom(19); // abre o enquadramento: dá pra ver o parceiro e mirar
      // Mão ocupada: o disco vai para a mochila e o F não faz nada até ele ser
      // escolhido. Sem dizer isso, a pessoa fica apertando F na quadra achando
      // que quebrou.
      g.toast(
        como === 'mao'
          ? 'Segure F e solte no traço da barra'
          : 'Frisbee guardado — escolha ele na mochila (I)',
        '🥏',
      );
      return true;
    };

    const sairDaQuadra = (): void => {
      fase = 'fora';
      avisouCheio = false;
      g.removeItem(ITENS.frisbee.id);
      disco.mesh.visible = false;
      soltarCarga();
      g.freeCompanion();
      g.setZoom(14);
      ultimoPosto = null;
      alvoDaCorrida = null;
    };

    /**
     * @param forca 0..1 da barra
     * @param curva aceleração lateral; sai do quanto o jogador estava girando
     * @param mirado só a carga solta na mão conta como passe perfeito — o toque
     * já sai na medida certa, então premiá-lo seria premiar não ter mirado
     */
    const lancar = (forca: number, curva = 0, mirado = true): void => {
      if (fase !== 'comigo') return;
      // guardado no fundo da mochila ele não voa: só o item da mão é lançável
      if (!naMinhaMao()) return;
      g.removeItem(ITENS.frisbee.id);
      const eu = g.playerPosition();
      const olhar = g.playerFacing();
      const c = limitar(forca, 0, 1);
      const alvo = cargaDoParceiro(eu, olhar, g.companionPosition());
      passePerfeito = mirado && alvo !== null && Math.abs(c - alvo) <= ZONA;
      saidaDoPasse.copy(eu);
      posDeleNoLancamento.copy(g.companionPosition());
      disco.throwAt(eu, olhar, distDaCarga(eu, olhar, c), arcoDaCarga(c), curva);
      g.som('lancar');
      sorteado = false;
      vaiPegar = true;
      alvoDaCorrida = null;
      recalcular = 0;
      fase = 'voando-pra-ele';
    };

    /** o toque no celular e o E são sempre o passe limpo: sem dosar, sem errar */
    const passeSimples = (): void => {
      const alvo = cargaDoParceiro(g.playerPosition(), g.playerFacing(), g.companionPosition());
      lancar(alvo ?? 0.5, 0, false);
    };

    const jogar = w.interact({
      id: 'parque:frisbee-jogar',
      x: QUADRA.x, z: QUADRA.z, radius: 3,
      priority: -1, // segue o jogador: nunca deve roubar o prompt de outra coisa
      label: 'Lançar o frisbee  (segure F)', icon: '🥏',
      onInteract: () => passeSimples(),
    });

    const pegar = w.interact({
      id: 'parque:frisbee-pegar',
      x: QUADRA.x, z: QUADRA.z, radius: 1.8,
      label: 'Pegar o frisbee', icon: '🥏',
      onInteract: (api) => {
        if (api.addItem(ITENS.frisbee) === 'cheio') return;
        disco.pickUp();
        fase = 'comigo';
        contarTroca(api, false);
      },
    });

    w.onUpdate((dt, t) => {
      const trechoDe = disco.position.clone();
      disco.update(dt, LIMITES_QUADRA);

      const eu = g.playerPosition();
      const ele = g.companionPosition();
      const olhar = g.playerFacing();
      const dentro = naQuadra(eu.x, eu.z, 0.4);

      if (dentro && fase === 'fora') entrarNaQuadra();
      else if (!dentro && fase !== 'fora') sairDaQuadra();

      if (fase === 'fora') {
        jogar.enabled = false;
        pegar.enabled = false;
        mira.visible = false;
        olharAnterior = olhar;
        return;
      }

      if (disco.state === 'voando') conferirAlvos(trechoDe, disco.position);
      animarAlvos(dt);

      // ---------------------------------------------------------- a carga
      if (fase === 'comigo' && naMinhaMao()) {
        if (g.keyDown('KeyF')) {
          carregando = true;
          carga = Math.min(1, carga + dt / CARGA_CHEIA);
          g.showCharge(carga, cargaDoParceiro(eu, olhar, ele), ZONA);
          // a marca anda junto: é a tradução de "força" em metros de grama
          const d = distDaCarga(eu, olhar, carga);
          mira.position.set(eu.x + Math.sin(olhar) * d, 0, eu.z + Math.cos(olhar) * d);
          mira.scale.setScalar(1 + Math.sin(t * 9) * 0.06);
          mira.visible = true;
        } else if (carregando) {
          const forca = carga;
          // girar no instante de soltar manda o disco em banana; parado sai reto
          const giro = dt > 0.0001 ? desvioAngular(olhar, olharAnterior) / dt : 0;
          soltarCarga();
          if (forca < CARGA_MINIMA) passeSimples();
          else lancar(forca, limitar(giro * 0.18, -2.5, 2.5));
        }
      } else if (carregando) {
        soltarCarga();
      }
      olharAnterior = olhar;

      // ------------------------------------------------ o parceiro se posta
      if (fase === 'comigo' || fase === 'no-chao') {
        const posto = postoDoParceiro(eu);
        if (!ultimoPosto || Math.hypot(posto.x - ultimoPosto.x, posto.z - ultimoPosto.z) > 2.5) {
          g.commandCompanion(posto.x, posto.z);
          ultimoPosto = posto;
        }
      }

      // a fase fica legível de fora: é por ela que o teste do frisbee sabe de
      // quem é o disco sem ter que adivinhar pela altura da malha
      disco.mesh.userData.fase = fase;

      // ------------------------------------------------------ o vai e volta
      switch (fase) {
        case 'comigo':
          // Quem o jogador VÊ na mão é o modelo pendurado no rig. O objeto de
          // física continua acompanhando a mão, só invisível: assim ele não
          // teleporta no lançamento e continua sendo a fonte de verdade de
          // onde o disco está.
          disco.holdAt(eu, olhar);
          disco.mesh.visible = false;
          break;

        case 'com-ele': {
          // 1. parado: com o disco na mão ele não anda mais, fica plantado
          // 2. mirando: vira para encarar onde o jogador está agora
          const paraMim = Math.atan2(eu.x - ele.x, eu.z - ele.z);
          g.holdCompanion(eu.x, eu.z);
          disco.holdAt(ele, paraMim);

          esperaDele -= dt;
          const mirado = Math.abs(desvioAngular(g.companionFacing(), paraMim)) < RETORNO.mira;
          // o `-1` é rede de segurança: se por algum motivo ele não fechar a
          // mira, o passe sai mesmo assim em vez de travar a partida
          if (esperaDele <= 0 && (mirado || esperaDele < -1)) {
            // 3. o alvo fica ALÉM do jogador, na mesma linha: é isso que faz o
            // disco passar voando por ele em vez de cair nos pés dele
            const dx = eu.x - ele.x;
            const dz = eu.z - ele.z;
            const dist = Math.hypot(dx, dz) || 1;
            // ele não joga sempre igual: às vezes solta um balão alto, às vezes
            // um passe reto, e de vez em quando põe caprichado demais e erra
            const sorte = Math.random();
            const arco = sorte < 0.3 ? RETORNO.arco * 1.35 : sorte > 0.85 ? 0.95 : RETORNO.arco;
            const erro = sorte > 0.85 ? RETORNO.erro * 2.5 : RETORNO.erro;
            const alvo = new THREE.Vector3(
              limitar(
                eu.x + (dx / dist) * RETORNO.alem + (Math.random() - 0.5) * RETORNO.desvio,
                qx0 + 1.5, qx1 - 1.5,
              ),
              0,
              limitar(
                eu.z + (dz / dist) * RETORNO.alem + (Math.random() - 0.5) * RETORNO.desvio,
                qz0 + 1.5, qz1 - 1.5,
              ),
            );
            // curva de leve no passe dele: dá vida sem tirar o disco da área de
            // pegada, que já tem o erro de mira e o desvio lateral somados
            disco.throwToward(ele, alvo, erro, arco, (Math.random() - 0.5) * 1.0);
            g.som('lancar');
            ultimoPosto = null; // ele volta a se postar assim que o disco for meu
            fase = 'voando-pra-mim';
          }
          break;
        }

        case 'voando-pra-ele': {
          // Ele corre atrás do disco ENQUANTO ele voa, mirando onde a física diz
          // que vai cair. Antes só reagia com o disco já no chão, e por isso
          // todo passe torto virava caminhada.
          recalcular -= dt;
          if (disco.state === 'voando' && recalcular <= 0) {
            recalcular = 0.25;
            const queda = disco.ondeVaiCair(LIMITES_QUADRA);
            if (!alvoDaCorrida || alvoDaCorrida.distanceTo(queda) > 0.8) {
              alvoDaCorrida = queda;
              g.commandCompanion(queda.x, queda.z);
              ultimoPosto = null;
            }
          }

          // o disco tem que ter SAÍDO antes de alguém agarrar. Sem isto, lançar
          // com o parceiro coladinho é ele pegar de volta no mesmo quadro.
          const perto =
            disco.state === 'voando' &&
            disco.position.y < 2.3 &&
            noChao(saidaDoPasse, disco.position) > 2 &&
            Math.hypot(disco.position.x - ele.x, disco.position.z - ele.z) < 1.5;

          if (perto && !sorteado) {
            // UM sorteio por voo. Passe na medida ele agarra quase sempre;
            // foguete torto, que chega rápido e longe do posto dele, escapa.
            sorteado = true;
            const correu = noChao(posDeleNoLancamento, disco.position);
            const chance = limitar(
              0.98 - disco.rasante * 0.022 - correu * 0.02 + (passePerfeito ? 0.2 : 0),
              0.35, 0.98,
            );
            vaiPegar = Math.random() < chance;
          }

          if (perto && vaiPegar) {
            g.som('pegar');
            g.holdCompanion(eu.x, eu.z);
            ultimoPosto = null;
            alvoDaCorrida = null;
            const passe = Math.round(noChao(saidaDoPasse, disco.position));
            disco.pickUp();
            esperaDele = 0.7;
            fase = 'com-ele';
            if (passePerfeito) {
              g.som('confirma');
              g.bump('frisbee.perfeitos');
              g.toast('Passe perfeito!', '🎯');
              falar(['Na mão! Perfeito.', 'Esse foi bonito, hein.', 'Assim fica fácil.']);
            } else {
              g.toast('Ele pegou no ar!', '🙌');
              falar(['Peguei!', 'Isso! Manda de novo.', 'Tá vendo? Sou bom nisso.']);
            }
            const recorde = g.stat('frisbee.maiorPasse');
            if (passe > recorde) {
              g.bump('frisbee.maiorPasse', passe - recorde);
              g.toast(`Novo recorde: ${passe} m`, '📏');
            }
            break;
          }

          if (disco.state === 'chao') {
            if (sorteado && !vaiPegar) {
              falar(['Ah, escapou!', 'Raspou na minha mão!', 'Essa eu deixei, admito.']);
            } else if (noChao(saidaDoPasse, disco.position) > 16) {
              falar([
                'Calma, não sou cachorro!',
                'Jogou pra longe demais.',
                'Vou ter que correr até lá?',
              ]);
            }
            trocasNaSessao = 0; // encostou no chão, a série morre
            if (disco.position.distanceTo(ele) < 1.6) {
              g.holdCompanion(eu.x, eu.z);
              ultimoPosto = null;
              alvoDaCorrida = null;
              disco.pickUp();
              esperaDele = 0.8;
              fase = 'com-ele';
            } else {
              g.commandCompanion(disco.position.x, disco.position.z);
              ultimoPosto = null;
              fase = 'buscando';
            }
          }
          break;
        }

        case 'buscando':
          if (disco.position.distanceTo(ele) < 1.1) {
            // parou de correr aqui: quem lança andando joga torto
            g.holdCompanion(eu.x, eu.z);
            ultimoPosto = null;
            alvoDaCorrida = null;
            disco.pickUp();
            esperaDele = 0.9;
            fase = 'com-ele';
          }
          break;

        case 'voando-pra-mim': {
          // o disco vem por cima da cabeça, então o teto da pegada é mais alto
          // que o do passe raso — é a janela de interceptação da mecânica
          const noAr =
            disco.state === 'voando' &&
            disco.position.y < RETORNO.alcance &&
            Math.hypot(disco.position.x - eu.x, disco.position.z - eu.z) < RETORNO.raio;
          if (noAr) {
            if (g.addItem(ITENS.frisbee) === 'cheio') break;
            disco.pickUp();
            fase = 'comigo';
            contarTroca(g, true);
            break;
          }
          if (disco.state === 'chao') {
            fase = 'no-chao';
            trocasNaSessao = 0;
            if (disco.position.distanceTo(eu) < 1.9 && g.addItem(ITENS.frisbee) !== 'cheio') {
              disco.pickUp();
              fase = 'comigo';
              contarTroca(g, false);
            }
          }
          break;
        }

        case 'no-chao':
          // sem o addItem o jogo troca a fase pra 'comigo' e o disco some da
          // tela, mas o item nunca entra na mochila: nada pra lancar, nenhum
          // prompt, disco irrecuperavel ate sair e voltar da quadra
          if (disco.position.distanceTo(eu) < 1.2 && g.addItem(ITENS.frisbee) !== 'cheio') {
            disco.pickUp();
            fase = 'comigo';
            contarTroca(g, false);
          }
          break;
      }

      // carregando, o balão do E sai da tela: ele fica bem em cima do chão que
      // a marca de mira ocupa, e enquanto se mira ele não serve para nada
      jogar.enabled = fase === 'comigo' && !carregando;
      pegar.enabled = fase === 'no-chao';
      if (fase === 'comigo') jogar.moveTo(eu.x, eu.z);
      else pegar.moveTo(disco.position.x, disco.position.z);
    });


    // -------------------------------------------- interações da quadra
    w.interact({
      id: 'parque:placa-quadra',
      x: qx0 - 1.8, z: QUADRA.z + 4.8, radius: 2.2,
      label: 'Ler a placa', icon: '🪧',
      highlight: placaCampinho,
      onInteract: () =>
        conversa([
          [R, 'QUADRA LIVRE — respeite quem chegou primeiro.'],
          [A, 'Hoje só tem a gente.'],
          [R, 'Então segura o F. A marca no chão mostra onde o disco vai cair, e o traço na barra é onde eu estou.'],
          [A, 'E se eu quiser mostrar serviço?'],
          [R, 'Acerta um dos aros. Ou uma cesta, se estiver se achando.'],
        ]),
    });

    w.interact({
      id: 'parque:placar',
      x: QUADRA.x, z: qz0 + 2.6, radius: 2.2,
      label: 'Ver o placar', icon: '🔢',
      highlight: placar,
      onInteract: (api) => {
        const recorde = api.stat('frisbee.recorde');
        const total = api.stat('frisbee.trocas');
        const perfeitos = api.stat('frisbee.perfeitos');
        const pontos = api.stat('frisbee.alvos');
        const maior = api.stat('frisbee.maiorPasse');
        const linhas: Array<[typeof A, string]> = [
          [A, recorde > 0 ? `Nosso recorde é ${recorde} trocas seguidas.` : 'O placar tá zerado.'],
          [R, total > 0 ? `E já foram ${total} no total. A gente não desiste fácil.` : 'Bora estrear isso então.'],
        ];
        if (maior > 0) linhas.push([A, `O passe mais longo que colou foi de ${maior} metros.`]);
        if (perfeitos > 0) {
          linhas.push([R, `${perfeitos} ${perfeitos === 1 ? 'passe caiu' : 'passes caíram'} certinho na minha mão.`]);
        }
        if (pontos > 0) linhas.push([A, `E ${pontos} ${pontos === 1 ? 'ponto' : 'pontos'} nos alvos. Anota aí.`]);
        return conversa(linhas);
      },
    });

    w.interact({
      id: 'parque:arquibancada',
      x: QUADRA.x, z: qz1 - 2.6, radius: 2.4,
      label: 'Sentar na arquibancada', icon: '🪑',
      highlight: arquibancada,
      onInteract: () =>
        conversa([
          [R, 'Cansei. Cinco minutos.'],
          [A, 'Você falou cinco minutos faz meia hora.'],
          [R, 'E olha que descanso bem, hein.'],
        ]),
    });

    w.interact({
      id: 'parque:bebedouro',
      x: qx0 + 2.8, z: QUADRA.z + 4.2, radius: 1.8,
      label: 'Beber água', icon: '🚰',
      highlight: bebedouro,
      onInteract: async (api) => {
        await conversa([
          [A, 'A água daqui é sempre meio quente.'],
          [R, 'Mas depois de correr atrás de disco, tá ótima.'],
        ]);
        api.toast('Água (meio quente)', '🚰');
      },
    });

    w.interact({
      id: 'parque:sacola',
      x: qx0 + 2.8, z: QUADRA.z - 3.4, radius: 1.8,
      label: 'Olhar os discos', icon: '🎒',
      highlight: sacola,
      onInteract: () =>
        conversa([
          [R, 'Tem uns três discos aqui de gente que esqueceu.'],
          [A, 'Um deles é seu. Desde março.'],
          [R, '…é, pode ser.'],
        ]),
    });

    w.interact({
      id: 'parque:cesta',
      x: qx1 - 4.4, z: QUADRA.z, radius: 2.2,
      label: 'Ver a cesta', icon: '🧺',
      highlight: cestaLeste,
      onInteract: () =>
        conversa([
          [A, 'Um dia a gente acerta essa cesta.'],
          [R, 'Já acertei uma vez!'],
          [A, 'Você acertou o poste. É diferente.'],
        ]),
    });

    w.interact({
      id: 'parque:biruta',
      x: qx1 - 3, z: qz1 - 2.4, radius: 2,
      label: 'Ver o vento', icon: '🎏',
      highlight: biruta,
      onInteract: () =>
        conversa([
          [R, 'O vento tá indo pra lá.'],
          [A, 'Então joga contra que o disco fica no ar mais tempo.'],
          [R, 'Ou joga a favor e ele vai parar no estacionamento. Já aconteceu.'],
        ]),
    });

    // -------------------------------------------- interações do ponto
    w.interact({
      id: 'parque:ponto-onibus',
      x: 36.0, z: 19, radius: 2.6,
      label: 'Esperar no ponto', icon: '🚏',
      highlight: parada,
      onInteract: (api) =>
        api.flag('escola-aberta')
          ? conversa([
            [A, 'Agora ele passa na escola também?'],
            [R, 'Passa. É a linha dos Gatitos, a Luna disse. Com exclamação e tudo.'],
          ])
          : conversa([
            [A, 'Esse é o que passa no clube?'],
            [R, 'É esse. Já tá parado, é só subir.'],
          ]),
    });

    w.interact({
      id: 'parque:placa-clube',
      x: 35.4, z: 7.4, radius: 2.2,
      label: 'Ler a placa', icon: '🪧',
      highlight: placaClube,
      onInteract: () =>
        conversa([
          [R, '"Clube!" — com exclamação e tudo.'],
          [A, 'Quem escreveu isso tava animado.'],
        ]),
    });

    // ----------------------------------------------------- outras interacoes
    w.interact({
      id: 'parque:lago',
      x: -13, z: 11, radius: 2.6,
      label: 'Olhar o lago', icon: '🦆',
      onInteract: async (api) => {
        api.som('pato');
        await api.say(['Que lago bonito... dá até vontade de pular'], RENAN.name);
        await api.say(['Então vamos! Hahahha'], ARI.name);
        await api.say(['NÃAAOOO'], RENAN.name);
        api.unlock({
          id: 'lago-pular',
          title: 'Vontade de pular',
          place: 'Parque Villa Lobos',
          note: 'Um dos dois sempre tem uma ideia. O outro sempre grita.',
          icon: '🦆',
        });
      },
    });

    // ------------------------------------------------------------- sorvetes
    // Morango do Ari, maracujá do Renan. Agora são ITENS, cada um na mochila do
    // seu dono: quem põe o modelo na mão é o motor, e o T não muda nada porque
    // a malha é filha do rig, que viaja com a pessoa.
    let sorveteRestante = 0;
    /**
     * O QUE FOI ENTREGUE DESTA VEZ, e para quem.
     *
     * Antes o relógio do derretimento apagava dois ids cravados no código —
     * morango do Ari, maracujá do Renan. Na mesinha dá para pedir "o que o
     * Mano escolher", e aí vêm chocolate e limão: com os ids cravados, esses
     * dois nunca derreteriam e a dupla ficaria de casquinha na mão para sempre.
     * Agora quem entrega anota aqui o que entregou.
     */
    let naMaoDeles: Array<{ item: ItemDef; dono: string }> = [];

    /** entrega um par de sorvetes e liga o relógio do derretimento */
    const entregarSorvetes = (doAri: ItemDef, doRenan: ItemDef): void => {
      naMaoDeles = [{ item: doAri, dono: ARI.id }, { item: doRenan, dono: RENAN.id }];
      g.addItem(doAri, ARI.id);
      g.addItem(doRenan, RENAN.id);
      sorveteRestante = 50;
    };

    w.onUpdate((dt) => {
      if (sorveteRestante <= 0) return;
      sorveteRestante -= dt;
      if (sorveteRestante <= 0) {
        for (const { item, dono } of naMaoDeles) g.removeItem(item.id, dono);
        naMaoDeles = [];
        g.toast('Acabou o sorvete', '🍦');
      }
    });

    // ------------------------------------------------------- ping pong
    /**
     * A partida roda inteira em coordenada LOCAL da mesa (ver PingPong.ts): o
     * grupo do minigame entra como filho da mesa, então o giro dela sai de
     * graça e nenhuma conta aqui precisa de seno e cosseno.
     */
    const partida = new PingPong(5);
    partida.guardar();
    mesaPing.add(partida.grupo);
    partida.onSom = (nome) => g.som(nome);
    // pendurada na mesa para scripts/pingpong.mjs conseguir ler o placar e a
    // posição da bolinha de fora — mesmo espírito do `window.jogo`
    mesaPing.userData.pingpong = partida;

    /** ponto do mundo a partir de coordenada local da mesa */
    const naMesa = (x: number, z: number): THREE.Vector3 => {
      const v = new THREE.Vector3(x, 0, z);
      mesaPing.localToWorld(v);
      return v;
    };

    let jogando = false;
    const LADO = MESA_PING.plano + 0.55; // onde cada um fica de pé

    /* ==================================================================
     *              QUEM PODE SER CHAMADO PARA A MESA
     *
     * O quadro de inscrições devolve um `id`; este mapa diz o que fazer com
     * ele. Cada bicho tem UM posto no parque, e a partida o empresta: sai de
     * lá, joga, e volta para o lugar exato de onde saiu.
     *
     * ELE É TELEPORTADO PARA A BEIRA DA ARENA e só então ANDA até a mesa. O
     * Mano mora a trinta unidades daqui; andar de verdade seriam vinte
     * segundos de cutscene olhando um pinguim atravessar o parque. O
     * teleporte acontece com o diálogo na tela — e os últimos quatro metros,
     * que são os que a câmera mostra, ele faz a pé.
     * ================================================================== */
    interface Chamavel {
      readonly bicho: Bicho;
      /** para onde ele volta quando a partida acaba */
      readonly posto: { readonly x: number; readonly z: number };
      /** e para que lado ele fica olhando lá */
      readonly giro: number;
      readonly som: SomNome;
    }
    /** por onde o convidado entra no tablado: a beira de `-Z`, atrás do banco */
    const ENTRADA_DA_ARENA = { x: -12.6, z: 21.4 };

    /* ==================================================================
     *                   O JEAN-LUC COMO ADVERSÁRIO
     *
     * A ficha dele é a do parceiro apertada em três lugares, e NADA na física
     * muda de um para o outro: o desvio da rebatida cai para 60%, o desvio
     * feio (a bola que vai para fora) fica quase pela metade, e a mão dele
     * persegue a bolinha mais rápido, o que fecha os ângulos. É difícil porque
     * ele DEVOLVE, e não porque a bola bate diferente.
     *
     * E A PONTARIA É O QUE FAZ ELE SER DIFÍCIL: ele devolve DE PROPÓSITO para
     * o lado em que a sua raquete não está. Os outros números só o deixam
     * teimoso.
     *
     * OS NÚMEROS SÃO MEDIDOS, e não escolhidos no olho — `scripts/balanco.mjs`
     * simula 50 partidas contra cada ficha e devolve a taxa de vitória. Foram
     * três medições até chegar aqui:
     *
     *  1. `erro 0,45 · rapidez 6,4` — parede. O rastreador do `duelo.mjs`, que
     *     persegue a bolinha quadro a quadro, levou doze pontos seguidos.
     *  2. `erro 0,5 · rapidez 5,9` — pior ainda, e de um jeito que não dava
     *     para ver na foto: 33 de 50 partidas NÃO TERMINAVAM. Dois jogadores
     *     que alcançam tudo e devolvem no meio jogam para sempre.
     *  3. esta — mão boa ganha quase sempre, mão média ganha uma em quatro, e
     *     ele leva 4,6 pontos por partida de quem ainda está aprendendo. Ele é
     *     difícil porque COLOCA a bola, e não porque erra menos.
     * ================================================================== */
    /**
     * A FICHA VEM DO QUADRO, e não de uma cópia aqui.
     *
     * Ela morou aqui em cima durante uma rodada, e aí o quadro de inscrições
     * nasceu com os mesmos cinco números escritos de novo em
     * `world/adversariosData.ts`. Duas listas iguais viram duas listas
     * diferentes no primeiro ajuste — e o `scripts/balanco.mjs`, que mede se a
     * dificuldade está justa, estaria medindo a cópia errada.
     */
    const fichaDe = (id: string): Adversario =>
      INSCRITOS.find((d) => d.id === id)?.ficha ?? PARCEIRO;
    const JEAN_LUC_ADVERSARIO = fichaDe('jean-luc');

    const CHAMAVEIS: Record<string, Chamavel> = {
      'jean-luc': { bicho: jeanLuc, posto: JEANLUC_POSTO, giro: 1.3, som: 'pato' },
      mano: { bicho: mano, posto: MANO, giro: 0, som: 'pinguim' },
      cookie: { bicho: cookie, posto: COOKIE, giro: 0, som: 'sino' },
      estella: { bicho: estella, posto: ESTELLA, giro: Math.PI / 2, som: 'balido' },
    };

    /**
     * O CAIXOTE. O Jean-Luc tem 66 cm e o tampo da mesa tem 76: sem um degrau
     * ele joga a partida inteira escondido atrás da própria mesa, com a boina
     * aparecendo por cima. Ele fica guardado até a hora da partida — pato que
     * anda com caixote pelo parque é outro personagem.
     *
     * E ELE SERVE PARA TODO MUNDO, esticando em `y`: o pinguim precisa de um
     * degrau menor que o do pato, a ovelha de um menor ainda, e o elefante de
     * nenhum. A altura sai de uma MEDIDA da malha do bicho (ver `degrauPara`),
     * e não de uma tabela escrita à mão que envelheceria no primeiro ajuste de
     * modelo.
     */
    const ALTURA_DO_CAIXOTE = 0.5;
    const caixoteDoPato = w.add(w.place(caixote(0.5, ALTURA_DO_CAIXOTE), PING.x + 3, 0, PING.z));
    caixoteDoPato.visible = false;

    /**
     * Onde a CABEÇA do convidado precisa ficar para ele jogar de verdade.
     *
     * NÃO BASTA PASSAR DO TAMPO. A raquete do minigame fica em
     * `tampo + 0,30` = 1,06, com 20 cm de raio: um convidado com a cabeça em
     * 1,05 fica exatamente ATRÁS DELA, e na câmera de ombro o adversário
     * inteiro some por trás do próprio disco vermelho — foi o que a foto
     * mostrou do Jean-Luc e do Mano, dois discos jogando sozinhos.
     *
     * 1,30 põe a cabeça ACIMA da borda de cima da raquete. É por isso que o
     * pato acaba num caixote quase da altura dele — e isso, olhando a foto, é
     * melhor ainda: um pato de 74 cm empoleirado para alcançar a mesa é
     * exatamente a piada que ele é.
     */
    const ALVO_DA_CABECA = 1.3;
    /**
     * De quanto ele precisa de degrau. A medida é A CABEÇA, e não o ponto mais
     * alto da malha — todo bicho daqui nomeia o grupo dela `cabeca-<nome>`.
     *
     * Medindo o topo, o chapéu de casquinha do Mano dava 1,56 e o pinguim
     * "passava" do tampo sem caixote nenhum. Quem passava era o SORVETE: os
     * olhos dele ficam em 0,62, quatorze centímetros abaixo da mesa. O mesmo
     * valia para a alfineteira da Estella e para a tromba do Cookie.
     */
    const degrauPara = (bicho: Bicho): number => {
      bicho.group.updateWorldMatrix(true, true);
      let cabeca: THREE.Object3D | null = null;
      bicho.group.traverse((n) => {
        if (!cabeca && n.name.startsWith('cabeca-')) cabeca = n;
      });
      const ponto = new THREE.Vector3();
      const alto = cabeca !== null
        ? ponto.setFromMatrixPosition((cabeca as THREE.Object3D).matrixWorld).y
          - bicho.group.position.y
        : new THREE.Box3().setFromObject(bicho.group).max.y - bicho.group.position.y;
      return Math.max(0, ALVO_DA_CABECA - alto);
    };

    const encerrarPing = (): void => {
      jogando = false;
      partida.guardar();
      for (const e of enfeitesPing) e.visible = true;
      g.showPlacar(null);
      g.setCameraOmbro(null);
      g.setPlayerVisible(true);
      g.lockPlayer(false);
      g.freeCompanion();
      jogarPing.enabled = true;
      verOQuadro.enabled = true;
      // e o pato volta a ser abordável — se já tiver sido apresentado
      falarComOPato.enabled = g.flag('jean-luc-conhecido');
      /*
       * O CONVIDADO DESCE DO CAIXOTE E VOLTA PARA O POSTO DELE.
       *
       * `partida.adversario` continua dizendo quem jogou — quem o reescreve é o
       * COMEÇO da próxima partida, e não o fim desta. É isso que deixa o fim de
       * partida, logo abaixo, saber contra quem foi sem ninguém guardar a
       * informação duas vezes.
       *
       * E A DEVOLUÇÃO É OBRIGATÓRIA. Bicho que fica de serviço para sempre é o
       * defeito que o teste do garçom mede: ele nunca mais passeia, e o posto
       * dele fica vazio pelo resto da sessão.
       */
      const jogou = CHAMAVEIS[partida.adversario.id];
      if (jogou) {
        caixoteDoPato.visible = false;
        caixoteDoPato.scale.y = 1;
        jogou.bicho.group.position.set(jogou.posto.x, 0, jogou.posto.z);
        jogou.bicho.group.rotation.y = jogou.giro;
        jogou.bicho.voltarAPassear();
      }
      naMesaDePing.quem = null;
    };

    /**
     * MONTA A PARTIDA, contra quem for.
     *
     * Os dois caminhos (a mesa e o pato) passam por aqui, e a única coisa que
     * muda entre eles é QUEM fica do outro lado: o parceiro joga, e aí o pato
     * nem entra; o pato joga, e aí o parceiro vira torcida na beira.
     *
     * A câmera, a primeira pessoa e o esconde-enfeites são idênticos nos dois
     * — era esse o pedido, que a mesa continue sendo a mesma mesa.
     */
    const comecarPartida = async (api: GameAPI, contra: Adversario): Promise<void> => {
      const meu = naMesa(-LADO, 0);
      const dele = naMesa(LADO, 0);
      const convidado = CHAMAVEIS[contra.id] ?? null;
      const contraOPato = convidado !== null;
      naMesaDePing.quem = convidado ? contra.id : null;

      // cada um de um lado, olhando para o outro
      api.releasePlayer(meu.x, meu.z, Math.atan2(dele.x - meu.x, dele.z - meu.z));
      if (contraOPato) {
        // O PARCEIRO VIRA TORCIDA, atrás e ao lado: `São sempre dois em cena`
        // continua valendo, mas quem joga agora é o pato. O ponto é fora do
        // eixo da câmera de ombro (que corre em `z = 0` local), senão ele
        // entraria na frente do jogo.
        const beira = naMesa(-1, 2.4);
        api.releaseCompanion(beira.x, beira.z, Math.atan2(meu.x - beira.x, meu.z - beira.z));
        api.holdCompanion(PING.x, PING.z);
      } else {
        api.releaseCompanion(dele.x, dele.z, Math.atan2(meu.x - dele.x, meu.z - dele.z));
        api.holdCompanion(meu.x, meu.z);
      }
      api.lockPlayer(true);

      if (convidado) {
        convidado.bicho.entrarEmServico();
        // QUEM FOI CHAMADO APARECE. O pato nasce invisível enquanto ninguém o
        // conhece, e um save que já tenha o quadro cheio (ou um teste que
        // escreva a flag depois da cena montada) traria para a mesa um
        // adversário que não dá para ver: só a raquete dele jogando sozinha.
        convidado.bicho.group.visible = true;
        // teleporta para a beira e ANDA os últimos metros, que são os que a
        // câmera vai mostrar — ver o bloco dos chamáveis, lá em cima
        convidado.bicho.group.position.set(ENTRADA_DA_ARENA.x, 0, ENTRADA_DA_ARENA.z);
        api.som(convidado.som);
        await convidado.bicho.irPara(dele.x, dele.z, 1.7);
        convidado.bicho.group.rotation.y = Math.atan2(meu.x - dele.x, meu.z - dele.z);
        const degrau = degrauPara(convidado.bicho);
        if (degrau > 0.04) {
          caixoteDoPato.position.set(dele.x, 0, dele.z);
          caixoteDoPato.scale.y = degrau / ALTURA_DO_CAIXOTE;
          caixoteDoPato.visible = true;
          convidado.bicho.group.position.y = degrau;
        }
        if (convidado.bicho === jeanLuc) jeanLuc.comemorar(1.4);
        await api.wait(0.5);
      }

      // Falsa primeira pessoa: atrás e ACIMA da cabeça, olhando para o
      // centro da mesa. Duas correções que a foto cobrou: câmera na altura
      // dos olhos deixa a juba do Ari tapando metade da tela, e mirar no
      // parceiro (que está longe) joga a mesa para fora do quadro — o alvo
      // certo é o meio da mesa.
      const atras = naMesa(-LADO - 1.6, 0);
      const meio = naMesa(0, 0);
      api.setCameraOmbro(
        new THREE.Vector3(atras.x, 2.35, atras.z),
        new THREE.Vector3(meio.x, 0.9, meio.z),
      );
      // O corpo de quem joga sai de cena: é primeira pessoa, e a juba do Ari
      // tapa a mesa inteira e a própria raquete se ficar na frente da câmera.
      api.setPlayerVisible(false);

      for (const e of enfeitesPing) e.visible = false;
      // desliga o interativo: sem isso a mesa continua com o "respiro" do
      // destaque, e como ela é o pai da bolinha a partida inteira balança
      jogarPing.enabled = false;
      falarComOPato.enabled = false;
      verOQuadro.enabled = false;
      partida.trocarAdversario(contra);
      partida.comecar();
      jogando = true;
      api.toast('Mexa o mouse para mover a raquete', '🏓');
    };

    w.onUpdate((dt) => {
      if (!jogando) return;
      partida.update(dt, g.pointer());
      // o update pode ter terminado a partida (onFim → encerrarPing), e aí o
      // placar já foi escondido: pintar de novo aqui o traria de volta na tela
      if (!jogando) return;
      g.showPlacar({
        eu: g.playerName(),
        /*
         * O NOME DO OUTRO LADO SAI DE QUEM ESTÁ JOGANDO, e não do parceiro.
         *
         * Ele já teve o nome do Jean-Luc cravado num `if`, e isso durou até o
         * quadro de inscrições existir: com cinco adversários, o placar voltou
         * a dizer "Renan" numa partida contra a Estella. Agora ele pergunta à
         * LISTA — e o próximo inscrito não precisa de mais um `if`.
         */
        ele: INSCRITOS.find((d) => d.id === partida.adversario.id)?.nome ?? g.companionName(),
        meus: partida.meus,
        dele: partida.dele,
      });
    });

    const jogarPing = w.interact({
      id: 'parque:pingpong',
      x: PING.x, z: PING.z, radius: 2.6,
      // A MESA GANHA DE TUDO O QUE MORA NA ARENA. O banco tem 1,9 de raio e
      // fica a 2,5 da mesa: os dois círculos se cruzam, e colado na mesa o
      // prompt tem que ser "jogar". As peças em volta entram com `-1` pelo
      // mesmo motivo, do outro lado da conta.
      priority: 1,
      label: 'Jogar ping pong', icon: '🏓',
      highlight: mesaPing,
      /*
       * A MESA É A DUPLA, e só. Quem escolhe adversário é o QUADRO DE
       * INSCRIÇÕES, ali na entrada da arena — a mesa chegou a perguntar
       * "contra quem?" numa caixa de duas opções, e isso era o esboço do
       * painel. Com o quadro montado, manter as duas portas seria ensinar
       * duas vezes a mesma coisa.
       */
      onInteract: async (api) => {
        if (jogando) return;
        /*
         * A PERGUNTA VEM ANTES DA CONVERSA, e não depois dela.
         *
         * A mesa tem 2,6 de raio e ganha de tudo na arena, então ela é o
         * prompt de quase todo lugar por ali — quem estava indo ver o quadro
         * ou trocar de raquete esbarra nela e caía direto numa partida de
         * cinco pontos, que não tem como abandonar no meio. Perguntar só
         * DEPOIS das duas falas cobraria a conversa inteira por um engano.
         */
        const vai = await api.ask('Jogar uma partida de cinco pontos?', ['Bora', 'Agora não'], A);
        if (vai !== 0) return;
        await conversa([
          [A, 'Cinco pontos?'],
          [R, 'Cinco pontos. E o perdedor carrega a bolsa até em casa.'],
        ]);
        await comecarPartida(api, PARCEIRO);
      },
    });

    /* ==================================================================
     *              O QUADRO DE INSCRIÇÕES, por dentro
     *
     * O painel devolve o `id` de quem foi escolhido (ou `null`, que é fechar
     * sem desafiar). A ficha de cada um — inclusive como ele joga — mora em
     * `world/adversariosData.ts`; aqui só se traduz o `id` numa partida.
     *
     * Quem ainda não se inscreveu nem chega aqui: o painel mostra uma ficha em
     * branco no lugar dele, e ficha em branco não tem clique.
     * ================================================================== */
    /**
     * QUANTO A VAQUINHA DOS QUATRO JUNTA.
     *
     * Na régua do jogo isto é muito, e é de propósito: o bilhete da roda
     * gigante custa 24, um prato do Mania sai por 12 a 34 e um turno inteiro
     * de garçom paga uns 200. Quatrocentos são dois turnos — o prêmio de
     * ganhar de todo mundo tem que valer mais que uma tarde de trabalho.
     */
    const PREMIO_DO_CAMPEAO = 400;

    /**
     * ================= A FESTA DA MESA DE PIQUENIQUE ==================
     *
     * O PRÊMIO DO CAMPEÃO, e a única cena deste parque com os quatro ao mesmo
     * tempo. Ela só acontece depois de ganhar de todos E pegar o que cada um
     * deu — as duas etapas, porque o quadro cobra as duas.
     *
     * Eles CHEGAM ANDANDO, cada um do seu posto e cada um no seu tempo: a
     * ovelha vem da calçada da loja, o elefante da bilheteria, o pinguim do
     * quiosque e o pato do lago. Teleportar os quatro para os lugares e abrir
     * o diálogo seria mais barato e não seria uma festa — o que faz a cena
     * funcionar é ver eles convergindo.
     *
     * As posições são as quatro esquinas da mesa, com a dupla do lado de cá.
     * O `giro` de cada um aponta para o meio, que é onde a conversa está.
     */
    const festaDoCampeao = async (api: GameAPI): Promise<void> => {
      /*
       * ONDE CADA UM PARA, e DE ONDE ele entra no quadro.
       *
       * O `de` não é enfeite: cada um é teleportado para lá e anda só os
       * últimos metros, que são os que a câmera mostra — é o mesmo caminho do
       * convidado que sobe na mesa de ping pong. Andar do posto de verdade
       * seriam quarenta unidades da porta da loja até aqui, quase um minuto
       * de câmera parada numa mesa vazia, e com o bicho esbarrando em tudo
       * que houver no caminho.
       *
       * As entradas apontam para os postos de verdade, uma em cada diagonal:
       * a ovelha vem da loja (-X, -Z), o elefante da bilheteria (+X, -Z), o
       * pinguim do quiosque (+X) e o pato da arena (-X, +Z). Eles convergem,
       * e é isso que faz parecer que vieram de lugares diferentes.
       */
      const LUGARES: Record<string, {
        x: number; z: number; de: { x: number; z: number };
      }> = {
        cookie: {
          x: PIQUENIQUE.x - 3.0, z: PIQUENIQUE.z - 1.1,
          de: { x: PIQUENIQUE.x - 6.0, z: PIQUENIQUE.z - 2.1 },
        },
        estella: {
          x: PIQUENIQUE.x - 1.2, z: PIQUENIQUE.z - 1.7,
          de: { x: PIQUENIQUE.x - 4.0, z: PIQUENIQUE.z - 4.8 },
        },
        mano: {
          x: PIQUENIQUE.x + 0.2, z: PIQUENIQUE.z - 1.4,
          de: { x: PIQUENIQUE.x + 2.7, z: PIQUENIQUE.z - 4.4 },
        },
        /*
         * O PATO FECHA A RODA DO LADO DE CÁ, ao lado da dupla — e não na ponta
         * de +X, com os outros três.
         *
         * O poste da alameda de `(-4; 20)` cai bem nessa coluna da tela: ele é
         * alto, e altura em câmera isométrica empurra a peça para CIMA no
         * quadro, bem na altura de uma cabeça. Nas duas primeiras encenações a
         * foto saiu com uma haste de metal atravessando o pato. Daqui ele está
         * longe dela — e uma roda fechada é o que o Renan pediu ("em volta da
         * mesinha"), em vez de uma fileira atrás dela.
         */
        'jean-luc': {
          x: PIQUENIQUE.x - 1.7, z: PIQUENIQUE.z + 1.4,
          de: { x: PIQUENIQUE.x - 4.4, z: PIQUENIQUE.z + 2.5 },
        },
      };

      // a dupla do lado de cá da mesa, os dois virados para ela
      const meu = { x: PIQUENIQUE.x - 0.3, z: PIQUENIQUE.z + 1.8 };
      const dele = { x: PIQUENIQUE.x + 1.0, z: PIQUENIQUE.z + 1.6 };
      const paraAMesa = (p: { x: number; z: number }): number =>
        Math.atan2(PIQUENIQUE.x - p.x, PIQUENIQUE.z - p.z);
      api.releasePlayer(meu.x, meu.z, paraAMesa(meu));
      api.releaseCompanion(dele.x, dele.z, paraAMesa(dele));
      api.holdCompanion(meu.x, meu.z);
      // O TRAVAMENTO VEM DEPOIS DO `releasePlayer`, e não antes: ele DESTRAVA
      // ao devolver o corpo à cena (`player.locked = false`, em `Game`). Na
      // ordem trocada a cutscene rodava com o joystick solto — e um teste que
      // usa o travamento para saber se a cena acabou concluía que ela tinha
      // acabado antes de os quatro chegarem.
      api.lockPlayer(true);
      // os quatro saem do passeio ao mesmo tempo: ver `deServico`
      naMesaDePing.festa = true;
      // a mesa é posta ANTES de eles chegarem: é a Estella que limpa e
      // arruma, e ela diz isso na primeira fala da roda
      toalhaDaFesta.visible = true;
      comidaDaFesta.visible = true;
      retratoNaMesa.visible = true;
      /*
       * A CÂMERA MIRA NUM PONTO, e não na mesa.
       *
       * `focusCamera` pede um objeto e põe ELE no meio da tela. Mirando na
       * mesa, os quatro (que ficam atrás dela) empilhavam na metade de cima
       * do quadro e a metade de baixo era gramado vazio. A âncora fica um
       * passo atrás da mesa, no meio da roda — é ali que a cena acontece.
       *
       * Ela é um grupo vazio: não tem malha, não tem sombra, não aparece.
       */
      const alvoDaFesta = new THREE.Group();
      // um passo para o lado do Cookie: ele tem quase três de altura, e altura
      // em câmera isométrica sobe no quadro — com a âncora no meio da roda ele
      // saía cortado pela borda de cima
      alvoDaFesta.position.set(PIQUENIQUE.x - 1.3, 0, PIQUENIQUE.z - 0.2);
      w.root.add(alvoDaFesta);
      api.focusCamera(alvoDaFesta);
      /*
       * 6,3 DE ALTURA E 6,6 DE LARGURA, e não um zoom só.
       *
       * A altura é a que a foto pediu: a primeira versão, com 7,4, enquadrava
       * metade do gramado vazio e a mesa no canto — numa câmera isométrica
       * cada metro a mais tira gente da foto antes de tirar grama.
       *
       * A LARGURA existe por causa do celular. `setZoom` fixa só a altura, e a
       * largura sai do formato da tela: num monitor deitado os 6,3 dão quase
       * 7 de largura, e num celular em pé dão menos de 3. O Renan testou no
       * celular e o Mano estava fora do quadro. Pedindo 6,6 de largura, a
       * câmera abre sozinha o quanto a tela estreita precisar — e em tela
       * larga o resultado é exatamente o mesmo 6,3 de antes.
       */
      api.enquadrar(6.6, 6.3);
      await api.wait(0.8);

      await conversa([
        [R, 'Por que tem tanta gente andando pra mesa de piquenique?'],
        [A, 'Não sei. Mas estão vindo todos.'],
      ]);

      /*
       * OS QUATRO ANDAM AO MESMO TEMPO, e não um de cada vez.
       *
       * `irPara` devolve uma promessa por bicho; esperar uma por uma daria
       * quatro caminhadas em fila, que é uma reunião e não uma festa. Cada um
       * sai com um atraso curto só para as chegadas não baterem no mesmo
       * quadro — é o que faz parecer que vieram de lugares diferentes, que é
       * exatamente o que aconteceu.
       */
      const chegadas: Array<Promise<void>> = [];
      let atraso = 0;
      for (const [id, lugar] of Object.entries(LUGARES)) {
        const quem = CHAMAVEIS[id];
        if (!quem) continue;
        quem.bicho.entrarEmServico();
        quem.bicho.group.visible = true;
        quem.bicho.group.position.set(lugar.de.x, 0, lugar.de.z);
        const espera = atraso;
        atraso += 0.45;
        chegadas.push((async () => {
          await api.wait(espera);
          api.som(quem.som);
          await quem.bicho.irPara(lugar.x, lugar.z, 1.5);
          quem.bicho.group.rotation.y = Math.atan2(
            PIQUENIQUE.x - lugar.x, PIQUENIQUE.z - lugar.z,
          );
        })());
      }
      await Promise.all(chegadas);
      await api.wait(0.5);

      await conversa([
        ['Jean-Luc', 'Eu fui de porta em porta. A pé. Molhado, em todas.'],
        ['Cookie', 'Desculpa a demora. Eu vim devagar pra não fazer barulho.'],
        [R, 'Você tem três metros, Cookie.'],
        ['Cookie', 'Eu sei. Eu vim devagar mesmo assim.'],
        ['Mano', 'CHEGUEI! Eu trouxe casquinha pra todo mundo!'],
        ['Mano', 'Caiu tudo no caminho. Mas eu trouxe.'],
        ['Estella', 'Ninguém encosta nessa mesa antes de eu limpar. Pronto. Agora pode.'],
      ]);
      mano.dancar(2.4);
      await conversa([
        ['Estella', 'Vocês dois ganharam de todo mundo aqui. Um por um.'],
        ['Jean-Luc', 'De mim primeiro. Eu gosto de lembrar que foi de mim primeiro.'],
        ['Cookie', 'De mim foi sem querer. Eu estava com medo da bolinha.'],
        [A, 'Você quase ganhou, Cookie.'],
        ['Cookie', 'Quase. Eu guardei o quase.'],
      ]);

      // -------------------------------------------------------- a vaquinha
      await conversa([
        ['Estella', 'A gente fez uma vaquinha.'],
        [R, 'Uma o quê?'],
        ['Estella', 'Uma vaquinha. Quatrocentos.'],
        [A, 'QUATROCENTOS?'],
        ['Mano', 'Eu virei o pote de gorjeta. Tinha muita moeda de um real.'],
        ['Mano', 'Tinha um botão também. Eu tirei o botão.'],
        ['Cookie', 'Eu vendi bilhete a mais. Quer dizer... eu vendi os certos. Só que mais.'],
        ['Estella', 'E eu cobrei o preço do mezanino de uma pessoa que merecia pagar '
          + 'o preço do mezanino.'],
        [R, 'E você, Jean-Luc?'],
        ['Jean-Luc', 'Eu mergulhei.'],
        [A, 'Você o quê?'],
        ['Jean-Luc', 'O fundo do lago é cheio de moeda. As pessoas jogam e fazem um desejo.'],
        [R, 'Jean-Luc, isso é o dinheiro do desejo dos outros.'],
        ['Jean-Luc', 'O desejo continua lá. Eu só trouxe a moeda.'],
        ['Jean-Luc', 'Ninguém desejou a moeda. Eu perguntei.'],
      ]);
      api.ganhar(PREMIO_DO_CAMPEAO);
      api.som('caixa');
      api.toast(`R$ ${PREMIO_DO_CAMPEAO} — a vaquinha dos quatro`, '💰');
      await api.wait(0.6);

      // ---------------------------------------------------- a raquete dourada
      await conversa([
        ['Estella', 'E tem mais uma coisa. Mano.'],
        ['Mano', 'AH SIM! A raquete!'],
        ['Mano', 'A gente mandou fazer uma raquete. DOURADA. Pra vocês.'],
        ['Cookie', 'A Estella que pintou.'],
        ['Estella', 'Pintei. Três demãos. A primeira ficou mostarda.'],
        ['Jean-Luc', 'Ela está no suporte, com as outras. Escolham ela sempre.'],
        ['Jean-Luc', 'Sempre. Eu vou saber se vocês não escolherem.'],
      ]);
      api.setFlag('raquete-dourada');
      api.som('memoria');
      api.toast('A raquete dourada está no suporte', '🏓');
      jeanLuc.comemorar(2.6);
      await conversa([
        [A, 'Obrigado, gente.'],
        ['Cookie', 'A gente que agradece. Ninguém nunca tinha querido jogar com a gente.'],
        [R, 'Semana que vem de novo?'],
        ['Mano', 'SEMANA QUE VEM!'],
        ['Estella', 'Semana que vem eu ganho.'],
        ['Jean-Luc', 'Semana que vem eu ganho.'],
        ['Cookie', 'Semana que vem eu trago bolinha nova. A nossa está amassada.'],
      ]);

      api.setFlag('campeao-da-arena');
      api.unlock({
        id: 'campeao-da-arena',
        title: 'A festa na mesa de piquenique',
        place: 'Parque Villa Lobos',
        note: 'A gente ganhou de todo mundo do quadro, e eles fizeram uma vaquinha de '
          + 'quatrocentos reais — o pote de gorjeta do Mano, bilhete a mais do Cookie, '
          + 'o preço do mezanino da Estella e um punhado de moedas que o Jean-Luc catou '
          + 'no fundo do lago. Deram uma raquete dourada junto. A foto ficou pregada no '
          + 'quadro de inscrições.',
        icon: '🏆',
      });

      // E TODO MUNDO VOLTA PARA O POSTO. Bicho que fica de serviço para sempre
      // é o defeito que o teste do garçom mede — a mesma regra do fim de partida
      for (const id of Object.keys(LUGARES)) {
        const quem = CHAMAVEIS[id];
        if (!quem) continue;
        quem.bicho.group.position.set(quem.posto.x, 0, quem.posto.z);
        quem.bicho.group.rotation.y = quem.giro;
        quem.bicho.voltarAPassear();
      }
      naMesaDePing.festa = false;
      // a toalha e o retrato ficam; a comida some, que é o que acontece com
      // comida numa festa
      comidaDaFesta.visible = false;
      w.root.remove(alvoDaFesta);
      api.focusCamera(null);
      api.setZoom(11);
      api.freeCompanion();
      api.lockPlayer(false);
    };

    const verOQuadro = w.interact({
      id: 'parque:inscricoes',
      x: QUADRO.x, z: QUADRO.z + 0.9, radius: 1.6,
      label: 'Ver as inscrições', icon: '📋',
      highlight: quadroDaArena,
      onInteract: async (api) => {
        if (jogando) return;
        const escolhido = await api.abrirQuadroDeInscricoes();
        if (!escolhido) return;
        // o card do campeão não é um desafiante: ele chama a festa
        if (escolhido === CAMPEAO_DO_QUADRO) {
          await festaDoCampeao(api);
          return;
        }
        const ficha = INSCRITOS.find((d) => d.id === escolhido);
        if (!ficha) return;

        if (ficha.id === 'parceiro') {
          await conversa([
            [A, 'A gente está bem ali na lista.'],
            [R, 'A gente É a lista. Vamos.'],
          ]);
          await comecarPartida(api, PARCEIRO);
          return;
        }

        // ELE É CHAMADO, e não encontrado: a fala cobre o teleporte até a
        // beira do tablado, e os últimos metros ele faz a pé
        await conversa([[R, `Alguém chama o ${ficha.nome}.`]]);
        await comecarPartida(api, ficha.ficha);
      },
    });

    /* ==================================================================
     *          AS PEÇAS DA ARENA, uma interação para cada uma
     *
     * Nenhuma delas encosta na mesa: a partida continua sendo exatamente o
     * que era. Elas têm `priority: -1` e raio 1,7 porque o círculo de 2,6 da
     * mesa passa por cima das três — de perto da mesa o prompt tem que ser
     * "jogar", e não "olhar o placar".
     * ================================================================== */

    /**
     * O PLACAR CONTA O QUE JÁ ACONTECEU. Os dois números saem de `stat`, e
     * quem escreve neles é o fim de partida lá embaixo — por isso ele é um
     * placar de verdade e não um enfeite com número pintado.
     *
     * "Vitórias" é de quem estava no comando: o jogador troca de corpo com o
     * `T`, então o par certo de nomes é o de AGORA, e não um nome cravado.
     */
    w.interact({
      id: 'parque:ping-placar',
      x: PLACAR_PING.x, z: PLACAR_PING.z, radius: 1.7, priority: -1,
      label: 'Ver o placar', icon: '🔢',
      highlight: placarPing,
      onInteract: async (api) => {
        const partidas = api.stat('pingpong.partidas');
        if (partidas === 0) {
          await conversa([
            [A, 'O placar tá zerado.'],
            [R, 'Então ninguém perdeu ainda pra ninguém.'],
            [A, 'Aproveita, que é o único momento em que a gente empata.'],
          ]);
          return;
        }
        const ganhas = api.stat('pingpong.vitorias');
        api.som('confirma');
        api.toast(`${partidas} partida${partidas > 1 ? 's' : ''} · ${ganhas} com chapéu`, '🏓');
        await conversa([
          [R, `Já foram ${partidas}.`],
          [A, ganhas > partidas - ganhas ? 'E o chapéu mora comigo.' : 'Um dia esse chapéu é meu.'],
        ]);
      },
    });

    /**
     * O SUPORTE TROCA A RAQUETE DA MESA DE COR, e essa é a única coisa que ele
     * faz — a raquete do MINIGAME não muda, porque mexer nela seria mexer na
     * partida, e a partida tem que continuar idêntica.
     *
     * A troca é reconstruir a peça no mesmo lugar: `raquete()` pinta no
     * construtor, e material vem cacheado de `toon()`. O `enfeitesPing` guarda
     * a raquete pelo ÍNDICE 0, então trocar o objeto exige trocar a entrada da
     * lista junto — senão a partida esconderia a raquete velha, que já não
     * está mais na mesa, e deixaria a nova acesa em cima do jogo.
     */
    const CORES_DE_RAQUETE = [
      { nome: 'A vermelha', cor: P.metalRed, flag: 'ping-raquete-vermelha', pede: '' },
      { nome: 'A verde', cor: P.pingVerde, flag: 'ping-raquete-verde', pede: '' },
      { nome: 'A azul', cor: P.fabricBlue, flag: 'ping-raquete-azul', pede: '' },
      /*
       * A DOURADA só aparece no suporte depois da festa da mesa de piquenique.
       *
       * O `pede` é a flag que a destranca, e ela mora na MESMA lista das
       * outras três de propósito: a escolha, o "sobrevive a sair e voltar do
       * parque" e a pintura da raquete da partida já passam todas por aqui, e
       * uma lista separada para uma peça só é uma segunda regra para manter.
       */
      { nome: 'A dourada', cor: P.pingDourada, flag: 'ping-raquete-dourada', pede: 'raquete-dourada' },
    ] as const;
    /** o que está no suporte AGORA: a dourada só entra depois da festa */
    const raquetesDisponiveis = (api: GameAPI): typeof CORES_DE_RAQUETE[number][] =>
      CORES_DE_RAQUETE.filter((c) => !c.pede || api.flag(c.pede));
    const trocarRaqueteDaMesa = (cor: number): void => {
      const velha = enfeitesPing[0];
      const nova = raquete(cor);
      nova.position.copy(velha.position);
      nova.rotation.copy(velha.rotation);
      mesaPing.remove(velha);
      mesaPing.add(nova);
      enfeitesPing[0] = nova;
    };
    // a escolha sobrevive a sair e voltar do parque: a cena se remonta inteira
    // a cada entrada, e sem isto a raquete voltaria vermelha toda vez
    for (const opcao of CORES_DE_RAQUETE) {
      if (!g.flag(opcao.flag)) continue;
      trocarRaqueteDaMesa(opcao.cor);
      // e a raquete DA PARTIDA sai na mesma cor: sem isto a escolha era só um
      // enfeite de mesa, que some justamente na hora de jogar
      partida.trocarMinhaRaquete(opcao.cor);
    }

    w.interact({
      id: 'parque:ping-raquetes',
      x: SUPORTE_PING.x, z: SUPORTE_PING.z, radius: 1.7, priority: -1,
      label: 'Escolher uma raquete', icon: '🏓',
      highlight: suportePing,
      onInteract: async (api) => {
        await conversa([[R, 'Escolhe a sua. A minha é a que sobrar.']]);
        const naArara = raquetesDisponiveis(api);
        const escolha = await api.ask('Qual raquete?', naArara.map((c) => c.nome));
        const opcao = naArara[escolha];
        if (!opcao) return;
        for (const c of CORES_DE_RAQUETE) api.setFlag(c.flag, c.flag === opcao.flag);
        trocarRaqueteDaMesa(opcao.cor);
        partida.trocarMinhaRaquete(opcao.cor);
        api.som('escolha');
        api.toast(`${opcao.nome} é sua`, '🏓');
        await conversa([
          opcao.cor === P.pingDourada
            ? [A, 'Essa aqui é a deles. Dá pra sentir o peso.']
            : [A, 'Essa aqui tem sorte. Dá pra sentir.'],
        ]);
      },
    });

    /** O balde: a piada é onde as bolinhas vão parar. */
    w.interact({
      id: 'parque:ping-bolinhas',
      x: CESTO_PING.x, z: CESTO_PING.z, radius: 1.7, priority: -1,
      label: 'Mexer no balde de bolinhas', icon: '🪣',
      highlight: cestoPing,
      onInteract: async (api) => {
        api.som('pegar');
        await conversa([
          [A, 'Quantas bolinhas cabem aqui?'],
          [R, 'Menos do que já foram pro lago.'],
          [A, 'Os patos estão montando a própria mesa.'],
        ]);
        api.toast('Uma bolinha, bem levinha', '🏓');
      },
    });

    /* ==================================================================
     *      A CHEGADA DO JEAN-LUC — cinco vitórias acordam o pato
     *
     * Ele não "aparece": ele SOBE. A cutscene inteira é essa ideia — o bicho
     * estava debaixo d'água o tempo todo, viu tudo dali, e a quinta vitória é
     * o que finalmente o traz à tona.
     *
     * A EMERSÃO É FEITA À MÃO, em passos de 55 ms, e não por um `onUpdate`
     * ligado e desligado: a cutscene é uma sequência de `await`, e o relógio
     * que ela já tem (`api.wait`) é o mesmo do jogo — pausar o jogo pausa a
     * subida junto, que é o que um `setTimeout` não faria.
     *
     * E ELE SALTA UM POUCO ACIMA DA LINHA D'ÁGUA ANTES DE ASSENTAR. Subir em
     * linha reta até `y = 0` lê como elevador; o sobressalto é o que faz
     * parecer que alguém empurrou a água para sair dela.
     *
     * DEPOIS ELE CORRE, e por isso o `irPara` vai a 1,5 e não aos 0,52 do
     * passeio: no passo normal a travessia do lago até a arena levaria 25
     * segundos de cutscene, e ninguém espera 25 segundos por um pato.
     * ================================================================== */
    const emergirOPato = async (api: GameAPI): Promise<void> => {
      jeanLuc.group.visible = true;
      marola.visible = true;
      marola.scale.setScalar(0.3);
      // e a água do lago responde junto: os anéis abrindo de onde ele sai
      agua.marola(JEANLUC_LAGO.x, JEANLUC_LAGO.z, 1.6);
      const passos = 26;
      for (let i = 1; i <= passos; i++) {
        const t = i / passos;
        // a subida termina antes do fim (em 82%) para o salto ter onde cair
        const subida = Math.min(1, t / 0.82);
        const salto = Math.sin(t * Math.PI) * 0.2;
        const y = -0.85 + 0.85 * subida + salto;
        jeanLuc.emergirAte(y);
        // o pico do salto dura um passo só: fica anotado para o teste, que
        // olha a altura de tempos em tempos e pode passar por cima dele
        jeanLuc.group.userData.maiorSalto = Math.max(jeanLuc.group.userData.maiorSalto ?? -9, y);
        marola.scale.setScalar(0.3 + t * 3.4);
        await api.wait(0.055);
      }
      jeanLuc.emergirAte(0);
      marola.visible = false;
    };

    const chegarOJeanLuc = async (api: GameAPI): Promise<void> => {
      if (api.flag('jean-luc-conhecido')) return;
      if (api.stat('pingpong.vitorias') < VITORIAS_PARA_O_PATO) return;

      api.lockPlayer(true);
      jeanLuc.entrarEmServico();
      jeanLuc.group.position.set(JEANLUC_LAGO.x, -0.85, JEANLUC_LAGO.z);
      jeanLuc.group.rotation.y = Math.atan2(
        JEANLUC_MARGEM.x - JEANLUC_LAGO.x,
        JEANLUC_MARGEM.z - JEANLUC_LAGO.z,
      );
      api.focusCamera(jeanLuc.group);
      api.setZoom(8);
      await api.wait(0.9);

      await conversa([
        [A, 'Você ouviu isso?'],
        [R, 'A água mexeu.'],
      ]);

      api.som('pato');
      await emergirOPato(api);
      api.som('pato');
      jeanLuc.comemorar(2.4);
      await api.wait(1.1);

      await conversa([
        ['Jean-Luc', 'CINQ! Cinq victoires! CINCO!'],
        [R, 'Tem um pato de boina falando com a gente.'],
        [A, 'Tem um pato de boina falando com a gente E ele tem uma raquete.'],
      ]);

      // ele sai da água e vem correndo até a arena — a câmera vai junto
      await jeanLuc.irPara(JEANLUC_MARGEM.x, JEANLUC_MARGEM.z, 1.5);
      api.som('pato');
      await jeanLuc.irPara(JEANLUC_POSTO.x, JEANLUC_POSTO.z, 1.5);
      /*
       * ELE FICA VIRADO PARA `+X`, e não exatamente para a mesa.
       *
       * Apontado para a dupla (2,12 rad) ele ficava de três quartos de COSTAS
       * para o jogo: a câmera vem de `+X/+Z`, e a nuca dele era o que aparecia
       * na cena inteira de apresentação. 1,3 rad é o meio-termo — o bico ainda
       * está do lado da mesa, e o rosto está do lado de quem joga. É a batota
       * de câmera que todo jogo faz, e o custo dela é meio radiano.
       */
      jeanLuc.group.rotation.y = 1.3;
      jeanLuc.comemorar(3);
      await api.wait(0.6);

      await conversa([
        ['Jean-Luc', 'Jean-Luc. Enchanté. Eu moro aqui embaixo.'],
        ['Jean-Luc', 'Eu vejo TODAS as partidas. Do fundo. A água distorce, mas eu vejo.'],
        [A, 'Você mora no lago e assiste ping pong?'],
        ['Jean-Luc', 'Tennis de table. Em francês soa mais caro.'],
        ['Jean-Luc', 'E eu moro no lago PORQUE tem tennis de table. Não é a mesma coisa.'],
        [R, 'Justo.'],
        ['Jean-Luc', 'Cinco vitórias é sério. Mon grand-père jogava em Paris. Ganhou três.'],
        ['Jean-Luc', 'Vocês são melhores que o meu avô. Isso me deixa très heureux e um pouco triste.'],
        [A, 'Sinto muito pelo seu avô.'],
        ['Jean-Luc', 'Il va bien. Ele está bem. Ele só perde.'],
      ]);

      jeanLuc.comemorar(3.2);
      api.som('pato');
      await conversa([
        ['Jean-Luc', 'Alors. Vocês. Eu. Uma partida. S\'il vous plaît.'],
        [R, 'Agora?'],
        ['Jean-Luc', 'Non! Agora eu estou encharcado, é ridículo. Preciso secar e alongar.'],
        ['Jean-Luc', 'Mas eu fico aqui. Na beira. À espera. Toujours.'],
        [A, 'A gente volta, Jean-Luc.'],
        ['Jean-Luc', 'Je sais. Todo mundo volta pro tennis de table.'],
      ]);

      api.setFlag('jean-luc-conhecido');
      falarComOPato.enabled = true;
      jeanLuc.voltarAPassear();
      api.focusCamera(null);
      api.setZoom(11);
      api.lockPlayer(false);

      api.unlock({
        id: 'jean-luc',
        title: 'O pato do lago',
        place: 'Parque Villa Lobos',
        note: 'Cinco vitórias e um pato francês subiu do fundo do lago de boina e raquete. '
          + 'Jean-Luc, enchanté. O avô dele jogava em Paris — ganhou três.',
        icon: '🦆',
      });
    };

    /**
     * O GATILHO DE TESTE, pendurado na mesa.
     *
     * É o mesmo espírito do `mesaPing.userData.pingpong` logo acima: a cena
     * guarda a cutscene numa variável local, e um teste de fora não teria como
     * chegar nela sem jogar cinco partidas inteiras de cinco pontos cada.
     * Quem chama isto de verdade é o fim de partida, aqui embaixo.
     */
    mesaPing.userData.jeanLuc = {
      bicho: jeanLuc,
      chegar: () => chegarOJeanLuc(g),
      // a ficha também: é o `scripts/balanco.mjs` que mede se ela está justa,
      // e ele tem que medir O NÚMERO QUE O JOGO USA, não uma cópia no teste
      ficha: JEAN_LUC_ADVERSARIO,
    };
    /*
     * E OS CHAMÁVEIS, pelo mesmo motivo. Sem isto um teste só alcança os bichos
     * varrendo a cena por `userData.peca`, e o que ele acha é o GRUPO — dá para
     * ler posição e rotação, mas não para mandar (`encarar`, `irPara`). Foi
     * isso que travou a medição do "ela anda de lado".
     */
    mesaPing.userData.chamaveis = CHAMAVEIS;

    /**
     * O FIM DE UMA PARTIDA CONTRA O PATO.
     *
     * O PRÊMIO DE BATER ELE É ELE. A partir daqui a mesa pergunta contra quem
     * jogar, e o Jean-Luc entra na lista — é a primeira linha do painel de
     * adversários, e o painel cresce a partir dela quando os outros
     * personagens do parque toparem jogar (ele sai daqui prometendo buscá-los).
     *
     * A flag é gravada UMA VEZ: revanche não desbloqueia nada de novo, e a
     * conversa da segunda vitória em diante é outra.
     */
    const fimContraOPato = async (api: GameAPI, ganhei: boolean): Promise<void> => {
      if (!ganhei) {
        jeanLuc.comemorar(3.4);
        api.som('pato');
        await conversa([
          ['Jean-Luc', 'Voilà! Cinco a ' + partida.meus + '!'],
          ['Jean-Luc', 'Não fiquem tristes. Eu treino há seis anos. Debaixo d\'água.'],
          [R, 'Isso não é treino, isso é obsessão.'],
          ['Jean-Luc', 'Em francês é a mesma palavra. Quase.'],
          [A, 'Revanche.'],
          ['Jean-Luc', 'Toujours.'],
        ]);
        return;
      }

      const primeira = !api.flag('jean-luc-batido');
      /*
       * A FLAG DO PREMIO É SEPARADA DA DO QUADRO, e é gravada em TODA vitória.
       *
       * `jean-luc-batido` é o que enche o quadro de inscrições, e ela só faz
       * sentido uma vez. `batido-jean-luc` é o que libera a jaqueta no papel
       * dele, e segue a mesma forma dos outros três — sem ela o pato seria o
       * único caso especial de um sistema que tem quatro donos iguais.
       */
      const premioNovo = !api.flag('batido-jean-luc');
      api.setFlag('batido-jean-luc');
      if (premioNovo) api.toast('Tem um prêmio te esperando no quadro', '🎁');
      api.som('memoria');
      jeanLuc.receberCarinho();
      if (!primeira) {
        await conversa([
          ['Jean-Luc', 'De novo! Cinco a ' + partida.dele + '.'],
          ['Jean-Luc', 'Eu devia estar triste. Mas jogar com vocês é meilleur que ganhar.'],
          [A, 'Isso é bonito, Jean-Luc.'],
          ['Jean-Luc', 'É. E é mentira. Mas é bonito.'],
        ]);
        return;
      }

      api.setFlag('jean-luc-batido');
      api.toast('O quadro de inscrições encheu', '📋');
      await conversa([
        ['Jean-Luc', 'Cinco a ' + partida.dele + '.'],
        ['Jean-Luc', '...'],
        [R, 'Jean-Luc?'],
        ['Jean-Luc', 'Pardon. Eu estou processando.'],
        ['Jean-Luc', 'Seis anos debaixo d\'água. E vocês me batem num sábado.'],
        [A, 'A gente pode jogar de novo, se você quiser.'],
        ['Jean-Luc', 'Se eu QUISER? Mon Dieu.'],
        ['Jean-Luc', 'Voltem quando quiserem. Eu preguei meu papel no quadro ali da entrada.'],
        ['Jean-Luc', 'E eu fui buscar os outros. O pinguim do sorvete. O elefante da bilheteria. A ovelha da loja.'],
        [R, 'Você convenceu o Mano a jogar ping pong?'],
        ['Jean-Luc', 'Eu convenci vocês a jogarem contra um pato. Je convaincs n\'importe qui.'],
        [A, 'O que isso quer dizer?'],
        ['Jean-Luc', 'Que eu convenço qualquer um. Soa melhor em francês. Tudo soa.'],
      ]);
      api.unlock({
        id: 'jean-luc-batido',
        title: 'Cinco a ' + partida.dele,
        place: 'Parque Villa Lobos',
        note: 'A gente ganhou do Jean-Luc. Ele ficou em silêncio, disse «pardon, estou processando», '
          + 'e foi buscar os outros bichos do parque. No dia seguinte o quadro de inscrições '
          + 'da arena estava cheio.',
        icon: '🦆',
      });
    };

    /**
     * O FIM DE UMA PARTIDA CONTRA OS OUTROS INSCRITOS.
     *
     * Cada um perde e ganha do jeito dele — é a mesma personalidade que a
     * historinha do quadro conta, agora com a partida jogada. Sem isto os três
     * dividiriam uma fala genérica, e aí não valeria a pena eles existirem
     * como adversários diferentes.
     */
    const FIM_DOS_OUTROS: Record<string, { ganhei: Array<readonly [string, string]>;
      perdi: Array<readonly [string, string]> }> = {
      mano: {
        ganhei: [
          ['Mano', 'AÊÊÊ! Vocês ganharam!'],
          [R, 'Mano, você perdeu.'],
          ['Mano', 'Eu sei! Mas foi tão bonito de ver.'],
          [A, 'Ele é a melhor pessoa do parque.'],
        ],
        perdi: [
          ['Mano', 'Ganhei?! Eu GANHEI?'],
          ['Mano', 'Desculpa. Desculpa. Eu não queria. Quer dizer, queria, mas não assim.'],
          [R, 'Pode comemorar, Mano.'],
          ['Mano', 'Obrigado. JÁ VOU COMEÇAR.'],
        ],
      },
      cookie: {
        ganhei: [
          ['Cookie', 'Ah. Acabou?'],
          ['Cookie', 'Desculpa, eu estava com medo de bater forte demais na bolinha.'],
          [A, 'Cookie, a bolinha é oca.'],
          ['Cookie', 'Por isso mesmo. Ela é tão pequenininha.'],
        ],
        perdi: [
          ['Cookie', 'Eu ganhei sem querer. A tromba faz sozinha.'],
          [R, 'Você tem um metro de alcance, Cookie.'],
          ['Cookie', 'Eu sei. Eu tento não usar. Às vezes esqueço.'],
          [A, 'Revanche, então. Com você lembrando.'],
        ],
      },
      estella: {
        ganhei: [
          ['Estella', 'Muito bem jogado, meus queridos. Muito bem mesmo.'],
          ['Estella', 'E essa camisa ficou ótima em você de perfil. Eu reparei entre o terceiro e o quarto ponto.'],
          [R, 'Foi por isso que eu errei o quarto.'],
          ['Estella', 'Ai, foi? Que pena. Que pena mesmo.'],
        ],
        perdi: [
          ['Estella', 'Eu avisei que penso três jogadas à frente.'],
          [A, 'Você avisou enquanto sacava.'],
          ['Estella', 'Avisei. Isso também fazia parte.'],
          [R, 'Ela é assustadora.'],
        ],
      },
    };

    const fimContraOsOutros = async (
      api: GameAPI, id: string, ganhei: boolean,
    ): Promise<void> => {
      const falas = FIM_DOS_OUTROS[id];
      if (!falas) return;
      api.som(ganhei ? 'memoria' : 'quicar');
      const ficha = INSCRITOS.find((d) => d.id === id);
      if (ganhei) {
        api.toast(`${ficha?.nome ?? id} — ${partida.meus} a ${partida.dele}`, '🏓');
        // a vitória abre o prêmio no papel dele, no quadro — pegar a roupa é
        // um clique lá, e não um item que cai na mão aqui
        const novo = !api.flag(`batido-${id}`);
        api.setFlag(`batido-${id}`);
        if (novo) api.toast('Tem um prêmio te esperando no quadro', '🎁');
      }
      await conversa(ganhei ? falas.ganhei : falas.perdi);
      /*
       * A PRIMEIRA VITÓRIA CONTRA CADA UM VIRA MEMÓRIA, e só a primeira: o
       * diário é de coisas que aconteceram uma vez, e `unlock` já recusa id
       * repetido — mas a conversa não pode ser "a primeira vez" toda vez.
       */
      if (ganhei && ficha) {
        api.unlock({
          id: `pingpong-${id}`,
          title: `${ficha.nome} na mesa`,
          place: 'Parque Villa Lobos',
          note: `${ficha.historia.split('.')[0]}. E a gente ganhou mesmo assim.`,
          icon: '🏓',
        });
      }
    };

    partida.onPonto = (meu) => {
      g.som(meu ? 'confirma' : 'quicar');
    };

    partida.onFim = (ganhei) => {
      void (async () => {
        const contraOPato = partida.adversario.id === JEAN_LUC_ADVERSARIO.id;
        encerrarPing();
        // o placarzinho da arena lê estes dois: sem eles ele seria enfeite
        g.bump('pingpong.partidas');
        if (ganhei) g.bump('pingpong.vitorias');

        if (contraOPato) {
          await fimContraOPato(g, ganhei);
          return;
        }
        if (partida.adversario.id !== PARCEIRO.id) {
          await fimContraOsOutros(g, partida.adversario.id, ganhei);
          return;
        }
        if (ganhei) {
          g.som('memoria');
          g.toast('Campeão de ping pong!', '🏆');
          // o chapéu é do personagem que estava jogando, não do "slot". A
          // flag é o DIREITO a ele: o motor repõe o chapéu no guarda-roupa de
          // quem tem a flag, então descartar nunca perde o prêmio
          g.setFlag(`chapeu-ping-pong:${g.playerId()}`);
          // cabeça livre, ele já sai vestido; cabeça ocupada (um gorro, uma
          // coroa), ele vai para o guarda-roupa em vez de sumir — antes ele
          // simplesmente não era entregue
          if (!g.equipWearable(ITENS.chapeuPingPong)
            && g.storeItem(ITENS.chapeuPingPong) === 'guardado') {
            g.toast('O chapéu foi pro guarda-roupa', '👑');
          }
          await conversa([
            [A, 'Cinco a ' + partida.dele + '.'],
            [R, 'Você ganhou o chapéu. Vai ter que usar.'],
          ]);
          g.unlock({
            id: 'memoria-ping-pong',
            title: 'A mesa do parque',
            place: 'Parque Villa Lobos',
            note: 'Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.',
            icon: '🏓',
          });
        } else {
          await conversa([
            [R, 'Cinco a ' + partida.meus + '. Revanche?'],
            [A, 'Sempre revanche.'],
          ]);
        }
        // e é aqui que o pato acorda, se esta foi a quinta vitória. Depois da
        // conversa do chapéu, e não no meio dela: duas cutscenes empilhadas no
        // mesmo instante deixariam os dois diálogos brigando pela tela
        await chegarOJeanLuc(g);
      })();
    };

    /**
     * O SORVETE AGORA SE PEDE AO MANO, e não ao quiosque.
     *
     * Antes a dupla falava entre si e as casquinhas apareciam; agora tem alguém
     * do outro lado do balcão, e a conversa é com ele. Da primeira vez ele
     * conta por que um pinguim foi parar numa sorveteria — o friozinho —, e é
     * dessa conversa que sai a dança: ele fica feliz de falar disso.
     *
     * O JOGADOR FICA TRAVADO a cena inteira, e a trava sai num `finally`: se
     * qualquer `await` daqui de dentro estourar, o jogo não pode ficar com a
     * dupla congelada no meio do parque para o resto da sessão.
     *
     * A DANÇA NÃO É ESPERADA COM PROMESSA. `mano.dancar(2,6)` só liga o
     * contador do bicho, e a cena espera com `api.wait`. São dois relógios que
     * andam juntos porque recebem o mesmo `dt`, e nenhum segura o outro.
     */
    const PEDIDOS_DO_MANO = [
      'Morango e maracujá, já sei de cor!',
      'Deixa comigo! Acabei de abrir o freezer, tá geladinho.',
      'Vocês pedem sempre igual. Eu gosto disso.',
      'Dois! Adoro quando é dois.',
    ];

    /**
     * COM SORVETE NA MÃO ELE NÃO VENDE OUTRO — ele repara.
     *
     * É a única resposta honesta: `addItem` recusaria o repetido de qualquer
     * jeito, e a cena inteira aconteceria para não entregar nada. Em vez disso
     * ele nota que vocês ainda estão comendo o de antes, faz uma graça e
     * guarda o próximo no gelo.
     */
    const AINDA_COMENDO = [
      'Come esse primeiro, vai! O próximo eu deixo geladinho aqui.',
      'Sorvete é um de cada vez. Senão o segundo derrete esperando.',
      'Eu guardo o de vocês no gelo. Pode voltar quando acabar esse.',
      'Tá bom esse? Tá bom, né. Eu escolhi.',
    ];
    /**
     * Algum dos dois ainda está com casquinha na mão.
     *
     * Pergunta pela LISTA do que foi entregue, e não por dois ids fixos: na
     * mesinha o sabor pode ser outro, e um teste cravado em morango diria que a
     * mão está vazia com o chocolate derretendo nela.
     */
    const aindaTemSorvete = (): boolean =>
      naMaoDeles.some(({ item, dono }) => g.hasItem(item.id, dono));

    const pedirSorvete = w.interact({
      id: 'parque:sorveteria',
      x: SORVETERIA.x, z: SORVETERIA.z + 2, radius: 2.4,
      label: 'Pedir sorvete pro Mano', icon: '🍦',
      highlight: mano.group,
      onInteract: async (api) => {
        api.lockPlayer(true);
        try {
          // ele vira para quem pediu antes de responder: atender de lado é o
          // que faz NPC parecer poste
          const eu = api.playerPosition();
          mano.group.rotation.y = Math.atan2(eu.x - mano.x, eu.z - mano.z);

          /*
           * OS PATINS VÊM ANTES DO PEDIDO.
           *
           * Este é o balcão, e é aqui que se FALA com ele — o carinho tem um
           * raio de 0,8 e quase ninguém chega tão perto. Se o prêmio só
           * falasse lá, a fala existiria e ninguém ouviria.
           *
           * Com sorvete na mão a conversa acaba aqui: ele reparou nos patins,
           * e emendar o "mas vocês ainda estão com o de antes" seria trocar de
           * assunto no meio da própria frase.
           */
          const falouDosPatins = await falarDoPremio(api, 'mano');

          if (aindaTemSorvete()) {
            if (falouDosPatins) return;
            api.som('pinguim');
            await api.say(['Opa! Mas vocês ainda estão com o de antes.'], 'Mano');
            await api.say([w.pick(AINDA_COMENDO)], 'Mano');
            // uma batidinha de asa curta: ele fica contente de ver vocês
            // comendo o que ele entregou, mas não é a dança inteira
            mano.dancar(1.0);
            await conversa([
              [A, 'Ele reparou.'],
              [R, 'Ele repara em tudo.'],
            ]);
            return;
          }

          const primeira = !api.flag('mano-atendeu');
          if (primeira) {
            api.setFlag('mano-atendeu');
            await conversa([
              [R, 'Oi. Dois, por favor.'],
              [A, 'Um de morango e um de maracujá.'],
            ]);
            api.som('pinguim');
            await api.say(['Morango e maracujá! Boa escolha, boa escolha.'], 'Mano');
            await conversa([
              [A, 'Posso perguntar uma coisa? Por que um pinguim numa sorveteria?'],
            ]);
            await api.say([
              'Ah, é o friozinho. Eu abro a tampa do freezer e fico ali pertinho.',
              'Um dia me deram o avental. Disseram que, já que eu ia ficar mesmo, era melhor eu trabalhar.',
            ], 'Mano');
            await conversa([
              [R, 'Faz sentido.'],
            ]);
            await api.say(['E eu adoro isso aqui. Fico tão feliz que às vezes eu…'], 'Mano');
          } else {
            await conversa([
              [R, 'Mano, os dois de sempre.'],
            ]);
            api.som('pinguim');
            await api.say([w.pick(PEDIDOS_DO_MANO)], 'Mano');
          }

          // …que às vezes ele dança. A frase de cima termina aqui, dançando.
          mano.dancar(2.6);
          api.focusCamera(mano.group);
          api.setZoom(6.4);
          await api.wait(1.1);
          await api.say([primeira ? 'Ele tá dançando. Ele DANÇA.' : 'Lá vem a dancinha.'], A);
          await api.wait(1.2);
          api.focusCamera(null);
          // 13 é o enquadramento com que a câmera nasce (`IsoCamera.viewSize`),
          // e é para ele que o parque tem que voltar: fechar num número
          // qualquer deixaria a cena inteira mais perto para sempre
          api.setZoom(13);

          await api.say(['Toma! Um de cada, do jeito que vocês pediram.'], 'Mano');

          // cada casquinha vai para a mochila do dono, não para uma bolsa comum
          entregarSorvetes(ITENS.sorveteMorango, ITENS.sorveteMaracuja);
          api.som('sorvete');
          api.toast('Morango e maracujá', '🍦');
          if (primeira) {
            await conversa([
              [A, 'Obrigado, Mano.'],
              [R, 'Ele já voltou pro freezer.'],
            ]);
          }
          api.unlock({
            id: 'sorvete-villa',
            title: 'Sorvete no parque',
            place: 'Parque Villa Lobos',
            note: 'Morango pro Ari, maracujá pro Renan, pedidos pro Mano — o pinguim que trabalha ali porque gosta do friozinho, e que dança de felicidade quando fala nisso.',
            icon: '🍦',
          });
        } finally {
          api.lockPlayer(false);
        }
      },
    });

    /* ==================================================================== *
     *        A MESINHA: sentar, pedir da mesa e o Mano servir na mesa
     *
     * O balcão continua existindo — quem quer sorvete rápido pede lá. Aqui é a
     * outra coisa: sentar na sombra, ele VIR até a mesa anotar, voltar ao
     * quiosque, trazer as duas casquinhas na bandeja, e uns segundos dos dois
     * comendo antes de levantar.
     *
     * TUDO ACONTECE NA ÂNCORA DA MESA. O grupo da peça já carrega posição e
     * giro, então sentar é `ridePlayer(mesa, (-0,78; 0; 0))` — exatamente onde
     * fica a cadeirinha da esquerda — e nenhuma conta de seno e cosseno entra
     * aqui. É o mesmo padrão das mesas do Mania de Churrasco.
     *
     * ELE ANDA POR ORDEM DA CENA (`entrarEmServico` + `irPara`), e não pelo
     * cérebro: a área dele é uma coleira de 24 cm em volta do posto, e o
     * passeio nunca o levaria à mesa. Ao voltar, a cena PRECISA mandá-lo de
     * volta ao posto antes de `voltarAPassear()` — a coleira é menor que o
     * passo mínimo do cérebro, então largar ele solto na mesa o deixaria
     * plantado ali para sempre.
     * ==================================================================== */

    /** o Mano TROTA atendendo mesa; o passeio dele é 0,5 */
    const TROTE_DO_MANO = 1.45;

    /** ponto do mundo a partir de coordenada local da mesinha */
    const naMesinha = (mesa: THREE.Group, x: number, z: number): THREE.Vector3 =>
      mesa.localToWorld(new THREE.Vector3(x, 0, z));

    /**
     * As falas de quem já sentou aqui antes. A primeira vez tem conversa
     * própria; da segunda em diante ele varia, senão a mesinha vira gravação.
     */
    const CHEGADA_DO_MANO = [
      'Mesa na sombra! Boa escolha.',
      'Oi de novo! Já vou anotar.',
      'Essa mesa é a melhor. Não conta pras outras.',
      'Cheguei! Podem falar.',
    ];
    const ENTREGA_DO_MANO = [
      'Dois! Do jeitinho que vocês pediram.',
      'Aqui está. Antes que derreta!',
      'Serviço de mesa. Eu adoro fazer isso.',
    ];

    const sentarNaMesinha = async (api: GameAPI, mesa: THREE.Group): Promise<void> => {
      api.lockPlayer(true);
      // onde ele para para atender: na frente da mesa pelo lado da CÂMERA (a
      // mesa olha para o quiosque, então a frente dela é `-Z` local). Atrás,
      // ele atenderia escondido pelo guarda-sol e por quem está sentado.
      const posto = naMesinha(mesa, 0, -1.3);
      const olhandoPraMesa = Math.atan2(mesa.position.x - posto.x, mesa.position.z - posto.z);

      try {
        // os dois se sentam nas duas cadeirinhas, um de frente para o outro
        api.ridePlayer(mesa, new THREE.Vector3(-0.78, 0, 0), 1, Math.PI / 2);
        api.rideCompanion(mesa, new THREE.Vector3(0.78, 0, 0), 1, -Math.PI / 2);
        api.setSitting(true);
        api.focusCamera(mesa);
        api.setZoom(7.6);
        await api.wait(0.7);

        // com casquinha na mão não se pede outra: senta, come e conversa
        if (aindaTemSorvete()) {
          await conversa([
            [R, 'Senta aqui. Tem sombra e tem mesa.'],
            [A, 'E a gente já tem o que comer.'],
          ]);
          api.setSaboreando(true);
          await api.wait(3.4);
          api.setSaboreando(false);
          return;
        }

        const primeira = !api.flag('mesinha-atendida');
        if (primeira) {
          await conversa([
            [A, 'A gente pode sentar aqui e esperar?'],
            [R, 'Tem mesa, tem guarda-sol e tem um pinguim de avental. Pode.'],
          ]);
        }

        // --------------------------------------------- ele vem até a mesa
        mano.entrarEmServico();
        api.som('pinguim');
        await mano.irPara(posto.x, posto.z, TROTE_DO_MANO);
        mano.group.rotation.y = olhandoPraMesa;
        await api.wait(0.3);
        await api.say([primeira ? 'Mesa na sombra! Boa escolha.' : w.pick(CHEGADA_DO_MANO)], 'Mano');

        const escolha = await api.ask('O que vai ser?', [
          'Os dois de sempre',
          'O que o Mano escolher',
          'Só sentar um pouco',
        ]);

        if (escolha === 2) {
          await api.say(['Fica à vontade! Quando bater vontade é só chamar.'], 'Mano');
          await conversa([[A, 'A gente só queria sentar mesmo.']]);
          void mano.irPara(MANO.x, MANO.z, TROTE_DO_MANO).then(() => {
            mano.group.rotation.y = 0;
            mano.voltarAPassear();
          });
          await api.wait(1.2);
          return;
        }

        // o pedido: o de sempre, ou o que ele escolher — e ele escolhe
        // chocolate e limão, que são os dois sabores da casa
        const pedido = escolha === 0
          ? [
              { item: ITENS.sorveteMorango, cor: P.morango },
              { item: ITENS.sorveteMaracuja, cor: P.maracuja },
            ]
          : [
              { item: ITENS.sorveteChocolate, cor: P.chocolate },
              { item: ITENS.sorveteLimao, cor: P.limao },
            ];
        await api.say([
          escolha === 0
            ? 'Morango e maracujá. Anotado — mas eu já sabia.'
            : 'Ah, essa eu gosto. Confia em mim.',
        ], 'Mano');

        // ------------------------------------- ele volta ao quiosque e serve
        /**
         * A CÂMERA VAI COM ELE. Focada na mesa, a viagem até o quiosque
         * aconteceria inteira fora da tela — e a viagem é justamente o que se
         * quer ver. Ela volta para a mesa quando ele chega com a bandeja. É a
         * mesma escolha que a ida do Walter à cozinha já tinha feito.
         */
        api.focusCamera(mano.group);
        api.setZoom(9);
        await mano.irPara(MANO.x, MANO.z, TROTE_DO_MANO);
        mano.group.rotation.y = 0;
        // o tempo de montar as duas casquinhas atrás do balcão
        await api.wait(1.2);
        mano.levarBandeja(true);
        const casquinhas = pedido.map(({ cor }, i) => {
          const c = iceCream(cor);
          c.position.set(i === 0 ? -0.06 : 0.06, 0.1, 0);
          mano.bandeja.add(c);
          return c;
        });
        api.som('sorvete');
        await api.wait(0.6);

        await mano.irPara(posto.x, posto.z, TROTE_DO_MANO);
        mano.group.rotation.y = olhandoPraMesa;
        api.focusCamera(mesa);
        api.setZoom(7.6);
        await api.wait(0.5);
        await api.say([w.pick(ENTREGA_DO_MANO)], 'Mano');

        // as casquinhas da bandeja somem no mesmo quadro em que as de verdade
        // aparecem na mão de cada um: para o olho, é a mesma casquinha passando
        for (const c of casquinhas) {
          mano.bandeja.remove(c);
          c.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
          });
        }
        mano.levarBandeja(false);
        entregarSorvetes(pedido[0].item, pedido[1].item);
        api.som('sorvete');
        api.toast(`${pedido[0].item.nome} e ${pedido[1].item.nome.toLowerCase()}`, '🍦');
        mano.dancar(1.4);

        // ele volta para o posto enquanto os dois comem: a cena não espera por
        // ele, e é isso que faz a praça parecer viva em vez de encenada
        void mano.irPara(MANO.x, MANO.z, TROTE_DO_MANO).then(() => {
          mano.group.rotation.y = 0;
          mano.voltarAPassear();
        });

        // --------------------------------------------------- e eles comem
        api.setSaboreando(true);
        await api.wait(1.6);
        await conversa(primeira
          ? [
              [A, 'Ele trouxe na mesa. Na MESA.'],
              [R, 'Eu vou querer sentar aqui todo sábado.'],
            ]
          : [[R, w.pick(['Esse tá melhor que o de ontem.', 'Deixa eu provar o seu.', 'A sombra daqui é boa.'])]]);
        await api.wait(2.6);
        api.setSaboreando(false);

        if (primeira) {
          api.setFlag('mesinha-atendida');
          api.unlock({
            id: 'mesinha-do-gelo',
            title: 'Serviço de mesa',
            place: 'Parque Villa Lobos',
            note: 'Sentaram numa mesinha da praça de gelo e o Mano foi até lá anotar o pedido, voltou ao quiosque e trouxe as duas casquinhas na bandeja.',
            icon: '⛱️',
          });
        }
      } finally {
        api.setSaboreando(false);
        api.setSitting(false);
        api.focusCamera(null);
        // 13 é o enquadramento com que a câmera nasce (`IsoCamera.viewSize`)
        api.setZoom(13);
        // cada um levanta para trás da sua cadeira, do lado da câmera, longe do
        // colisor da mesa (raio 1) — 1,7 do centro é folga de sobra para o 0,42
        // do corpo
        const saiEu = naMesinha(mesa, -1.05, -1.35);
        const saiEle = naMesinha(mesa, 1.05, -1.35);
        api.releasePlayer(saiEu.x, saiEu.z, Math.atan2(mesa.position.x - saiEu.x, mesa.position.z - saiEu.z));
        api.releaseCompanion(saiEle.x, saiEle.z, Math.atan2(mesa.position.x - saiEle.x, mesa.position.z - saiEle.z));
        api.lockPlayer(false);
      }
    };

    /**
     * TODA MESINHA SENTA. O ponto do prompt fica na frente dela, do lado da
     * câmera, e tem raio 1,6: menor que a distância até a mesa vizinha (4), e
     * fora do ponto de comprar no balcão.
     */
    for (const [i, mesa] of MESINHAS.entries()) {
      const chegada = naMesinha(mesa, 0, -1.5);
      w.interact({
        id: `parque:mesinha-${i}`,
        x: chegada.x, z: chegada.z, radius: 1.6,
        label: 'Sentar na mesinha', icon: '⛱️',
        highlight: mesa,
        onInteract: (api) => sentarNaMesinha(api, mesa),
      });
    }

    w.interact({
      id: 'parque:piquenique',
      // O PONTO ANDA COM A MESA. Ele estava cravado em `(-10; 21,6)` — 1,6 à
      // frente de onde a mesa morava — e quando ela recuou para dar lugar à
      // arena o prompt ficou para trás, sozinho na beira do tablado: de perto
      // do suporte de raquetes o jogo oferecia "arrumar o piquenique" e da
      // mesa de verdade não oferecia nada.
      x: PIQUENIQUE.x, z: PIQUENIQUE.z + 1.6, radius: 2.2,
      label: 'Arrumar o piquenique', icon: '🧺',
      highlight: mesa,
      onInteract: async (api) => {
        await conversa([
          [R, 'A toalha xadrez de sempre.'],
          [A, 'E o pão de queijo já frio.'],
          [R, 'Frio é melhor. Aceita.'],
        ]);
        api.unlock({
          id: 'piquenique',
          title: 'Piquenique de sábado',
          place: 'Parque Villa Lobos',
          note: 'Sempre a mesma mesa, sempre a mesma toalha.',
          icon: '🧺',
        });
      },
    });

    /**
     * ================================ QUEM VENDE O BILHETE É O COOKIE
     *
     * Este é o primeiro lugar do jogo que GASTA a carteira do casal. Ela nasceu
     * no turno do Mania de Churrasco e até agora só enchia; aqui ela esvazia, e
     * o dinheiro passa a querer dizer alguma coisa.
     *
     * E a venda mora NELE, e não na cabine: uma bilheteria com a janela vazia é
     * um objeto, e o Renan pediu um bilheteiro. O ponto da cabine continua
     * existindo — mas só para mandar a dupla falar com ele, que é o que uma
     * janela vazia faria na vida real.
     *
     * SEM DINHEIRO NÃO TRAVA NADA: ele mesmo manda a dupla trabalhar um turno
     * no Mania, que é uma volta de trinta segundos de caminhada e um minigame
     * que já existe. Um jogo-presente não pode ter beco sem saída — mas pode
     * ter um caminho.
     */
    const PRECO_DO_BILHETE = 24;
    const C = 'Cookie';

    /** as falas dele quando a dupla volta, depois da apresentação */
    const OI_DO_COOKIE = [
      'Oi de novo! Eu reconheci vocês pelo passo. Passo leve.',
      'Voltaram! Eu tava aqui, andando de um lado pro outro. É o que eu faço.',
      'Oi! Desculpa a orelha, ela abana sozinha quando eu fico contente.',
      'Vocês de novo. Que bom. Ninguém vem duas vezes.',
    ];

    const pedirBilhete = w.interact({
      id: 'parque:cookie',
      x: COOKIE.x, z: COOKIE.z, radius: 2.6,
      label: 'Falar com o Cookie', icon: '🐘',
      highlight: cookie.group,
      onInteract: async (api) => {
        /*
         * ELE PARA E OLHA. `entrarEmServico()` limpa a missão de caminhada (as
         * pernas voltam ao repouso sozinhas, por interpolação) e o `encarar`
         * gira o corpo dele para quem chegou, devagar. Sem isto ele continuaria
         * o vaivém falando de costas.
         */
        cookieConversando = true;
        cookie.entrarEmServico();
        const eu = api.playerPosition();
        cookie.encarar(eu.x, eu.z);
        api.lockPlayer(true);
        try {
          if (!api.flag('cookie-apresentado')) {
            api.setFlag('cookie-apresentado');
            await conversa([
              [A, 'Oi...'],
              [C, 'Oi! Oi. Desculpa, eu falo baixinho, mas mesmo assim...'],
              [C, 'As pessoas dão um passinho pra trás quando eu digo oi. Não é maldade delas. Eu sou grande.'],
              [R, 'A gente não deu passo nenhum.'],
              [C, 'Vocês não deram.'],
            ]);
            await api.wait(0.8);
            await conversa([
              [C, 'Obrigado.'],
              [C, 'Eu sou o Cookie. Eu cuido dos bilhetes daqui.'],
              [A, 'Cookie por causa de biscoito?'],
              [C, 'Por causa de biscoito. Eu gosto de tudo que é doce e pequenininho.'],
              [C, 'Bala, jujuba, aquele confeitinho colorido que gruda no dente. Coisa que cabe na pontinha da tromba.'],
            ]);

            // ele olha para cima ANTES da fala do sonho, e não durante: o
            // gesto precisa chegar primeiro, senão a fala explica um boneco
            // parado. 7 s cobrem as três linhas que vêm depois.
            cookie.olharProAlto(7);
            await api.wait(1.2);
            await conversa([
              [C, 'Um dia eu subo naquilo ali.'],
              [R, 'Na roda?'],
              [C, 'Na roda. Eu vendo bilhete dela faz não sei quanto tempo, e nunca coube numa cabine.'],
              [C, 'Mas todo mundo desce daquilo sorrindo. Eu fico aqui embaixo vendo. Já é um pedacinho, né?'],
              [A, 'É um pedacinho.'],
            ]);
            api.unlock({
              id: 'cookie',
              title: 'O Cookie',
              place: 'Parque Villa Lobos',
              note: 'O elefante que vende os bilhetes da roda gigante. Bonzinho, meio sem jeito do próprio tamanho, e apaixonado por doce pequenininho. Sonha em subir na roda — nunca coube numa cabine.',
              icon: '🐘',
            });
          } else if (api.flag('estella-conhecida') && !api.flag('cookie-falou-do-uniforme')) {
            /**
             * O LADO DELE DA MESMA HISTORIA, uma vez so.
             *
             * A Estella conta que fez o uniforme dele e deu um biscoitinho; o
             * Cookie conta o que aquilo significou. A fala so existe depois de
             * conhecer os dois, porque antes disso ela seria um elefante
             * falando de uma ovelha que ninguem viu.
             *
             * ELE OLHA PARA O PROPRIO QUEPE enquanto fala — `olharProAlto` e o
             * gesto que ele ja tem, e aqui ele serve de novo: cabeca e tromba
             * subindo, so que agora e orgulho, e nao sonho.
             */
            api.setFlag('cookie-falou-do-uniforme');
            cookie.olharProAlto(5);
            await conversa([
              [C, 'Vocês foram lá na ovelha, né? Na Estella.'],
              [A, 'Fomos.'],
              [C, 'Isso aqui é dela.'],
              [C, 'A manta, o quepe, o crachá com o meu nome. Ela mediu a minha orelha três vezes.'],
              [C, 'Nunca ninguém tinha feito roupa do meu tamanho. Sempre é "não temos". Sempre.'],
              [R, 'E ficou bom.'],
              [C, 'Ficou. E no dia que ficou pronto ela me deu um biscoitinho.'],
              [C, 'Eu guardei metade pro dia seguinte. Só pra ter de novo no dia seguinte.'],
            ]);
            api.unlock({
              id: 'uniforme-do-cookie',
              title: 'O uniforme do Cookie',
              place: 'Parque Villa Lobos',
              note: 'A Estella costurou a manta, o quepe e o crachá do Cookie nas cores da bilheteria dele, e mediu a orelha três vezes até cair certo. Foi a primeira roupa feita do tamanho dele. No dia da entrega ela deu um biscoitinho, e ele guardou metade pro dia seguinte.',
              icon: '🧵',
            });
          } else if (!(await falarDoPremio(api, 'cookie'))) {
            /*
             * O QUEPE GANHA DO "OI" DE SEMPRE.
             *
             * `falarDoPremio` devolve `true` quando de fato falou, e por isso
             * ele entra na condição: reparar na roupa e emendar um cumprimento
             * genérico seria ele esquecer do quepe no mesmo fôlego.
             */
            await api.say([w.pick(OI_DO_COOKIE)], C);
          }

          // --------------------------------------------------------- o bilhete
          if (api.hasItem(ITENS.bilheteDaRoda.id) || api.hasItem(ITENS.bilheteDaRoda.id, api.companionId())) {
            await conversa([
              [C, 'Vocês já estão com o de vocês! Não vou vender dois.'],
              [A, 'Tá aqui na mochila.'],
              [C, 'Então vão. A fila tá curta.'],
            ]);
            return;
          }

          await conversa([
            [A, 'A gente queria dois pra roda gigante.'],
            [C, 'Dois. Na mesma cabine, né? É sempre na mesma cabine, com vocês.'],
          ]);
          if (api.carteira() < PRECO_DO_BILHETE) {
            await conversa([
              [C, `São vinte e quatro reais os dois. Vocês têm ${api.carteira()}.`],
              [C, 'Não fica com essa cara. O Walter do Mania de Churrasco tá sempre precisando de gente.'],
              [C, 'Um turno lá e vocês voltam. Eu tô aqui. Eu tô sempre aqui.'],
            ]);
            api.toast(`Faltam R$ ${PRECO_DO_BILHETE - api.carteira()}`, '🎟️');
            return;
          }

          const vai = await api.ask(
            `Dois lugares na mesma cabine — R$ ${PRECO_DO_BILHETE}?`,
            ['Comprar', 'Agora não'],
            A,
          );
          if (vai !== 0) {
            await api.say(['Sem pressa. A roda não vai a lugar nenhum. Eu também não.'], C);
            return;
          }
          if (!api.gastar(PRECO_DO_BILHETE)) return;

          api.addItem(ITENS.bilheteDaRoda);
          api.som('caixa');
          api.toast(`Bilhete comprado · R$ ${api.carteira()} na carteira`, '🎟️');
          await conversa([
            [C, 'Prontinho. Rasguei bem no picotado, olha.'],
            [C, 'A catraca é ali na plataforma. Quando chegarem lá em cima, acenem pra cá.'],
            [A, 'A gente acena.'],
            [C, 'Eu vou estar olhando.'],
          ]);
        } finally {
          // SEMPRE devolve ele para a patrulha, por qualquer saída da conversa:
          // um `return` no meio que esquecesse isto deixaria o Cookie parado
          // olhando para o vazio pelo resto da sessão
          cookie.pararDeEncarar();
          cookieConversando = false;
          api.lockPlayer(false);
        }
      },
    });

    /*
     * A JANELA VAZIA. O ponto da cabine continua, mas agora ele só aponta para
     * o Cookie: quem anda até o guichê tem que descobrir alguma coisa ali, e
     * não bater numa parede muda.
     */
    w.interact({
      id: 'parque:bilheteria',
      x: BILHETERIA.x, z: BILHETERIA.z + 2.1, radius: 2.0,
      label: 'Guichê', icon: '🎟️',
      highlight: bilheteria,
      onInteract: async (api) => {
        await conversa([
          [A, 'Não tem ninguém na janelinha.'],
          [R, 'Tem sim. Olha do lado.'],
        ]);
        api.toast('Quem vende é o Cookie, do lado da cabine', '🐘');
      },
    });

    // ---------------------------------------------------- a roda gigante
    let voltaAtual: { resolve: () => void; de: number; voltas: number } | null = null;
    const esperarVoltas = (voltas: number): Promise<void> =>
      new Promise((resolve) => {
        voltaAtual = { resolve, de: wheel.angle, voltas };
      });

    /**
     * ======================================= A VOLTA EM PRIMEIRA PESSOA
     *
     * Enquanto `cabineDoPasseio` existe, a câmera do jogo é uma perspectiva
     * parada DENTRO da cabine, na altura dos olhos de quem está sentado. O
     * jogador não anda — mas continua com o manche, e o manche vira o olhar:
     * para os lados o parque passa pela janela que dá a volta inteira, e para
     * o lado do parceiro ele está ali, sentadinho, de mão dada.
     *
     * O olhar é acumulado num ângulo próprio (não é a câmera isométrica): a
     * câmera é recolocada do zero a cada quadro a partir da matriz de mundo da
     * cabine, então ela acompanha a subida sem ninguém precisar animá-la.
     */
    // espera por uma condição do mundo (a cabine chegar ao alto), e não por um
    // relógio: a roda anda pelo `dt`, e um `setTimeout` erraria o ponto
    let esperaAtual: { resolve: () => void; condicao: () => boolean } | null = null;
    const esperarQue = (condicao: () => boolean): Promise<void> =>
      new Promise((resolve) => {
        esperaAtual = { resolve, condicao };
      });

    let cabineDoPasseio: THREE.Group | null = null;
    let olharGiro = 0.3; // começa olhando o parque (ver o embarque)
    let olharAltura = -0.3;
    const LADO_DO_JOGADOR = -0.38;
    const olho = new THREE.Vector3();
    const miraDaCabine = new THREE.Vector3();

    const olharNaCabine = (dt: number): void => {
      const cabine = cabineDoPasseio;
      if (!cabine) return;
      const m = g.olharLivre();
      olharGiro -= m.x * 1.5 * dt;
      olharAltura = Math.max(-0.75, Math.min(0.6, olharAltura + m.y * 0.9 * dt));
      // o pescoço tem limite: nem de costas para a janela, nem de costas para
      // o parceiro. A frente é o giro ZERO (+Z, o lado do parque), e 2,2 rad
      // para cada lado cobrem a cabine inteira sem perder onde é a frente.
      olharGiro = Math.max(-2.2, Math.min(2.2, olharGiro));

      // ENCOSTADO NO BANCO, e não na beirada: 10 cm à frente do encosto o topo
      // dele cortava a tela no meio quando o jogador virava para o parceiro.
      // Sentado até o fundo, ele fica onde encosto tem que ficar — no rodapé.
      olho.set(LADO_DO_JOGADOR, FerrisWheel.PISO + 0.74, -0.28);
      cabine.localToWorld(olho);
      miraDaCabine.set(
        LADO_DO_JOGADOR + Math.sin(olharGiro) * 6,
        FerrisWheel.PISO + 0.74 + olharAltura * 6,
        -0.28 + Math.cos(olharGiro) * 6,
      );
      cabine.localToWorld(miraDaCabine);
      g.setCameraOmbro(olho, miraDaCabine);
    };

    // perto da roda a camera abre, para caber a coisa toda na tela
    let zoomLivre = true;
    w.onUpdate((dt) => {
      wheel.update(dt);
      olharNaCabine(dt);
      // só manda na câmera perto da roda gigante; longe dela o jogador
      // continua livre para dar zoom com a roda do mouse
      if (zoomLivre) {
        const p = g.playerPosition();
        const d = Math.hypot(p.x, p.z + 26);
        if (d < 28) {
          const t = Math.max(0, Math.min(1, (d - 8) / 20));
          g.setZoom(36 - t * 21);
        }
      }
      if (voltaAtual && wheel.turnsSince(voltaAtual.de) >= voltaAtual.voltas) {
        const done = voltaAtual.resolve;
        voltaAtual = null;
        done();
      }
      if (esperaAtual && esperaAtual.condicao()) {
        const done = esperaAtual.resolve;
        esperaAtual = null;
        done();
      }
    });

    w.interact({
      id: 'parque:roda-gigante',
      x: 0, z: -18.6, radius: 3,
      label: 'Andar na roda gigante', icon: '🎡',
      onInteract: async (api) => {
        /*
         * A CATRACA COBRA. Um bilhete vale a cabine inteira — os dois lugares
         * — então basta que ele esteja na mochila de QUALQUER um dos dois; o
         * casal divide carteira, divide bilhete. Quem carrega é quem entrega.
         */
        const dono = api.hasItem(ITENS.bilheteDaRoda.id)
          ? undefined
          : api.hasItem(ITENS.bilheteDaRoda.id, api.companionId())
            ? api.companionId()
            : null;
        if (dono === null) {
          await conversa([
            [A, 'A catraca não abre sem bilhete.'],
            [R, 'A bilheteria é aquela ali do lado do lago.'],
          ]);
          api.toast('Compre o bilhete na bilheteria', '🎟️');
          return;
        }

        zoomLivre = false;
        api.lockPlayer(true);
        await conversa([
          [R, 'A fila tá curta hoje.'],
          [A, 'Bora subir?'],
        ]);
        api.removeItem(ITENS.bilheteDaRoda.id, dono);
        wheel.girarACatraca();
        api.som('caixa');
        api.toast('Bilhete picotado', '🎟️');

        /*
         * A VOLTA É LENTA DE PROPÓSITO. A versão antiga multiplicava a
         * velocidade por 5 para despachar a cena em doze segundos; aqui ela
         * anda quase no passo normal da roda (uma volta em ~45s), porque o
         * tempo é metade da coisa. Ninguém sobe numa roda gigante com pressa.
         */
        const cabine = wheel.boardingCabin();
        const velocidade = wheel.speed;
        wheel.speed = velocidade * 1.35;

        // os dois entram na mesma cabine, lado a lado no banco de trás,
        // olhando para fora (-Z) — que é justamente para onde o parque está
        api.som('sino'); // a sineta de "vai começar" antes de a cabine subir
        wheel.abrirCabine(cabine);
        // o Mano sai da frente do quiosque e vai para o lado dele, para dar
        // para ver quando a fala lá de cima falar dele
        mano.entrarEmServico();
        void mano.irPara(MANO_DE_LADO.x, MANO_DE_LADO.z).then(() => {
          mano.group.rotation.y = OLHANDO_A_RODA;
        });
        // OS DOIS OLHAM PARA O PARQUE, que é +Z: `facing` gira a partir de +Z,
        // então a frente é o zero. O parceiro senta um dedo mais atrás e virado
        // para o lado do jogador (x negativo, daí o giro NEGATIVO): assim,
        // quando o jogador vira a cabeça, ele encontra o ROSTO dele, e não uma
        // orelha colada na lente.
        api.ridePlayer(cabine, new THREE.Vector3(LADO_DO_JOGADOR, FerrisWheel.PISO, -0.28), 0.55, 0);
        api.rideCompanion(cabine, new THREE.Vector3(0.38, FerrisWheel.PISO, -0.28), 0.55, -0.8);
        api.setSitting(true); // sentadinhos, e de mão dada — o `setSitting` faz as duas coisas
        api.focusCamera(cabine); // o sol e a sombra seguem a cabine

        // primeira pessoa: o corpo do jogador sairia dentro da lente
        api.setPlayerVisible(false);
        // a volta ABRE com ele em quadro, e não com a paisagem: a primeira
        // coisa que se vê lá dentro é o outro sentadinho ali do lado
        /*
         * A VOLTA ABRE OLHANDO PARA O PARQUE, e não para o parceiro.
         *
         * Ele senta a 76 cm, de lado — e num celular EM PÉ a janela é estreita
         * (uns 33° de campo na horizontal): abrindo virado para ele, a primeira
         * coisa da volta era um rosto ocupando a tela inteira. Olhando para a
         * frente o parque aparece, e ele está a um giro de distância — que é o
         * que o passeio pede para o jogador fazer de qualquer jeito.
         *
         * 0,3 rad é a direção do quiosque do Mano, que é para onde uma das
         * falas lá de cima aponta.
         */
        olharGiro = 0.3;
        // e o olhar começa INCLINADO PARA BAIXO: o parque fica embaixo, e na
        // horizontal a cabine mostra o céu e o skyline em vez dele
        olharAltura = -0.3;
        cabineDoPasseio = cabine;
        api.toast('Olhe em volta — setas ou WASD', '👀');

        await conversa([
          [A, 'Que janela...'],
          [R, 'Dá a volta inteira. Não tem canto sem vista.'],
        ]);
        await esperarVoltas(0.12);
        await conversa([
          [A, 'Olha o Mano lá embaixo. Do tamanho de um pinguinzinho de geladeira.'],
          [R, 'Ele é do tamanho de um pinguim, amor.'],
          [A, 'Você entendeu.'],
        ]);
        await esperarVoltas(0.13);

        /*
         * A PARADA NO ALTO. É o motivo de a volta existir: a roda trava com a
         * cabine no ponto mais alto, e por uns segundos não acontece nada —
         * dá tempo de girar o olhar, ver o parque inteiro, e voltar para o
         * outro, que está sentado bem ali do lado.
         */
        await esperarQue(() => cabine.position.y > wheel.hubHeight + wheel.radius * 0.94);
        wheel.speed = 0;
        api.som('sino');
        await api.wait(1.6);
        await conversa([
          [R, 'Parou.'],
          [A, 'Parou no alto. Sempre para no alto.'],
        ]);
        await api.wait(2.2);
        await conversa([
          [A, 'Toda vez que a gente passava aqui embaixo você olhava pra cima e dizia "um dia a gente sobe".'],
          [R, 'Pronto. Subimos.'],
          [A, 'Eu ia dizer que daqui dá pra ver o parque inteiro.'],
          [A, 'Mas eu tô olhando pra você.'],
        ]);
        api.som('coracao');
        await api.wait(2.4);
        await conversa([
          [R, 'A gente pode ficar mais um pouquinho.'],
          [A, 'A roda é que decide.'],
        ]);

        wheel.speed = velocidade * 1.35;
        await esperarVoltas(0.2);
        await conversa([
          [R, 'Descendo já é saudade.'],
          [A, 'A gente sobe de novo.'],
        ]);
        // até a cabine encostar embaixo de novo — a volta fecha inteira
        await esperarQue(() => cabine.position.y < wheel.hubHeight - wheel.radius * 0.94);

        cabineDoPasseio = null;
        g.setCameraOmbro(null);
        wheel.fecharCabine();
        // e o Mano volta para o balcão, olhando para quem chega
        void mano.irPara(MANO.x, MANO.z).then(() => {
          mano.group.rotation.y = 0.3;
          mano.voltarAPassear();
        });
        wheel.speed = velocidade;
        api.setSitting(false);
        api.setPlayerVisible(true);
        api.focusCamera(null);
        api.releasePlayer(0, -17.6, 0);
        api.releaseCompanion(-1.1, -17.9, 0);
        api.lockPlayer(false);
        zoomLivre = true;

        api.unlock({
          id: 'roda-gigante',
          title: 'A roda gigante',
          place: 'Parque Villa Lobos',
          note: 'A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.',
          icon: '🎡',
        });
      },
    });
  },
};
