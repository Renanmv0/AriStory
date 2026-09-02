import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  armario, bed, bookshelf, chair, desk, espelho, muralDeMemorias, nightstand,
  pictureFrame, pottedPlant, rug, wallShelf, windowFrame,
} from '../world/furniture';
import { toon } from '../core/materials';
import { ARI, RENAN } from '../characters/cast';
import { ITENS } from '../world/itens';
import { Pelusa } from '../entities/bichos/Pelusa';

/**
 * Quarto do Ari.
 *
 * O quarto que já existia na casa é o da Rubi, a roommate — é dela a porta de
 * onde sai kpop. Este é o do Ari, e ele nasceu por um motivo prático: a casa
 * tem 12 × 9 e o fundo inteiro já está ocupado, então o guarda-roupa não cabia
 * lá dentro sem tirar o sofá ou a cozinha do lugar.
 *
 * Planta (a câmera vê -Z subindo à direita e -X subindo à esquerda):
 *   parede do fundo (-Z): cama · criado-mudo · estante · ARMÁRIO
 *   parede da esquerda (-X): espelho · janela · escrivaninha
 *   frente (+Z): mureta com a porta de volta para a sala
 */

const W = 8;
const D = 6.5;
const x0 = -W / 2;
const z0 = -D / 2;
const H = 2.8;

/** onde o armário encosta na parede do fundo */
const ARMARIO = { x: 2.65, z: z0 + 0.36 };

/** o quadro de memórias, na parede do fundo */
const MURAL = { x: -1.15 };

/**
 * O que o Ari diz a cada carinho, depois do primeiro.
 *
 * Uma lista, e não uma fala só: fazer carinho é o tipo de coisa que se repete,
 * e a mesma frase na décima vez estraga o gesto.
 */
const FALAS_DO_CARINHO = [
  'Ele só ronrona assim pra quem ele gosta.',
  'Cuidado que ele dorme em cima de você.',
  'Ó, fechou o olhinho.',
  'Ele te adotou.',
  'Esse aí é o dono do quarto. A gente só mora junto.',
];

/** o que mora dentro do armário */
const ROUPAS_DO_ARMARIO = [
  ITENS.gorroDeLa, ITENS.camisaListrada, ITENS.calcaJeans, ITENS.botaAmarela,
  ITENS.vestidoRosa, ITENS.gargantilhaDeLaco,
  ITENS.maidMarinheiro, ITENS.maidGatinho,
  ITENS.maidJapones, ITENS.meiaDeCoxa,
  ITENS.moletomPreto,
];

export const quarto: SceneDef = {
  id: 'quarto',
  name: 'Quarto do Ari',
  subtitle: 'a porta que fica sempre encostada',
  ambient: {
    sky: 0xe2eef7,
    indoor: true,
    sunColor: 0xfff4de,
    sunIntensity: 0.95,
    ambientColor: 0xeaf3fb,
    ambientIntensity: 1.45,
    sunDir: [10, 15, 12],
  },
  // um passo para dentro, não colado na passagem: entrando pela porta, o
  // parceiro nasce atrás e ficaria em cima da mureta
  spawn: { x: 0.9, z: 1.7, facing: Math.PI },
  entries: {
    'da-sala': { x: 0.9, z: 1.7, facing: Math.PI },
  },

  build(w) {
    const g0 = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g0.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    // --------------------------------------------------------------- casca
    w.ground({ width: W, depth: D, color: P.floorWood });
    w.setBounds(x0 + 0.45, z0 + 0.45, W / 2 - 0.45, D / 2 - 0.45);

    // Parede inteira só em -X e -Z; nos dois lados abertos, mureta. Parede alta
    // do lado da câmera taparia o quarto inteiro.
    w.wall(x0, z0, W / 2, z0, H, P.wallAzul);
    w.wall(x0, z0, x0, D / 2, H, P.wallAzul);
    w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.wallAzul);

    // Mureta da frente com um vão no meio, e NENHUM batente alto.
    //
    // A primeira versão tinha dois trechos de 2,5 ladeando a porta, como a
    // parede da rua na sala. Aqui não funciona: a saída fica no meio da parede
    // que dá para a câmera, e os dois pilares caíram exatamente entre a câmera
    // e a dupla — o casal sumia atrás deles ao entrar. A folha da porta mora do
    // lado da SALA, que é de onde ela se vê; deste lado é só a passagem.
    const xPorta = 0.9;
    const vao = 1.1;
    w.wall(x0, D / 2, xPorta - vao / 2, D / 2, 0.45, P.wallAzul);
    w.wall(xPorta + vao / 2, D / 2, W / 2, D / 2, 0.45, P.wallAzul);

    // rodapé: um risco escuro na base da parede tira o ar de caixa vazia
    for (const [x, z, larg, rot] of [
      [0, z0 + 0.06, W, 0],
      [x0 + 0.06, 0, D, Math.PI / 2],
    ] as const) {
      const rodape = new THREE.Mesh(
        new THREE.BoxGeometry(larg, 0.12, 0.05),
        toon(0xb9cddc),
      );
      rodape.position.set(x, 0.06, z);
      rodape.rotation.y = rot;
      w.add(rodape);
    }

    // ------------------------------------------------- parede do fundo (-Z)
    const cama = w.add(w.place(bed(P.fabricBlue), -2.2, 0, -1.75));
    w.blockBox(-2.2, -1.75, 0.78, 1.08);

    // A âncora que DEITA os dois.
    //
    // Ela é o truque inteiro da mecânica: um `Object3D` girado -90° em X, do
    // qual os dois viram filhos. Como quem vira é o pai, o rig continua
    // animando em espaço local exatamente como em pé — nada de reescrever a
    // pose membro por membro.
    //
    // Depois do giro, os eixos locais dela apontam assim no mundo:
    //   +Y local → -Z (a cabeceira, então a pessoa deita com a cabeça lá)
    //   +Z local → +Y (para cima, então eles olham para o teto)
    //   +X local → +X (inalterado, e é ele que separa um do outro na largura)
    //
    // O `y` da âncora é a altura do colchão MAIS meio corpo: o rig nasce com os
    // pés em `y = 0`, e deitado esse plano vira o plano das costas — sem a
    // folga, metade do corpo afunda no edredom.
    const DEITAR = { x: -2.2, y: 0.86, z: -1.02 };
    const deitados = new THREE.Object3D();
    deitados.position.set(DEITAR.x, DEITAR.y, DEITAR.z);
    deitados.rotation.x = -Math.PI / 2;
    w.add(deitados);

    w.add(w.place(nightstand(), -1.05, 0, -2.72));
    w.blockBox(-1.05, -2.72, 0.24, 0.22);

    const estante = w.add(w.place(bookshelf(1.9, 1.1), 0.15, 0, z0 + 0.22));
    w.blockBox(0.15, z0 + 0.22, 0.55, 0.18);

    const movel = w.add(w.place(armario(P.wallMint), ARMARIO.x, 0, ARMARIO.z));
    w.blockBox(ARMARIO.x, ARMARIO.z, 0.8, 0.32);

    // ---------------------------------------------- parede da esquerda (-X)
    // O espelho fica ao lado do armário na hora de se olhar, mas na parede de
    // -X ele aparece de frente para a câmera em vez de de perfil.
    const espelhoObj = w.add(w.place(espelho(P.woodDark), x0 + 0.12, 0, -0.6, Math.PI / 2));

    w.add(w.place(windowFrame(1.6, 1.2), x0 + 0.16, 1.7, 1.0, Math.PI / 2));

    // escrivaninha virada para -X: assim o monitor olha para dentro do quarto
    // e quem senta fica de costas para a parede, não para a câmera
    const escrivaninha = w.add(w.place(desk(), x0 + 0.5, 0, 2.0, -Math.PI / 2));
    w.blockBox(x0 + 0.5, 2.0, 0.4, 0.82);
    w.add(w.place(chair(P.woodDark), x0 + 1.35, 0, 2.0, -Math.PI / 2));

    // ------------------------------------------------------------- enfeites
    w.add(w.place(rug(2.6, 2.0, P.rug), 0.3, 0, 1.1));
    // o canto de +X ficava um vazio marrom do tamanho de meia sala
    w.add(w.place(pottedPlant(1.15), W / 2 - 0.75, 0, 0.9));
    w.blockCircle(W / 2 - 0.75, 0.9, 0.3);
    w.add(w.place(pictureFrame(0.6, 0.75, P.flowerPink), -2.2, 1.85, z0 + 0.17));
    w.add(w.place(wallShelf(0.9), 1.05, 1.9, z0 + 0.19));

    // O quadro de memórias mora no único trecho de parede do fundo que sobrou:
    // entre o quadrinho da cabeceira (acaba em -1.9) e a estante (começa em
    // -0.4). Fica de frente para quem entra, e dá para chegar nele pelo vão
    // entre a cama e a estante, na frente do criado-mudo.
    const mural = w.add(w.place(muralDeMemorias(1.3, 1.0), MURAL.x, 1.72, z0 + 0.17));

    // ------------------------------------------------------- porta pra sala
    w.door({
      x: xPorta, z: D / 2 - 0.7,
      to: 'casa', entry: 'do-quarto',
      label: 'Voltar pra sala', icon: '🚪',
    });

    // ------------------------------------------------------------- o armário
    w.interact({
      id: 'quarto:armario',
      x: ARMARIO.x, z: ARMARIO.z + 1.25, radius: 1.8,
      label: 'Abrir o armário', icon: '🚪',
      highlight: movel,
      onInteract: async (g) => {
        // Primeira vez: as roupas que já estavam lá dentro entram no
        // guarda-roupa de cada um. É o armário dele — as peças não precisam ser
        // ganhas em lugar nenhum. O armário abastece OS DOIS, não só quem abriu.
        //
        // Cada peça vira uma peça do armário de cada um: os armários são
        // separados, então o gorro do Ari e o gorro do Renan são dois gorros e
        // os dois podem se vestir ao mesmo tempo. Sem isto, quem tirasse a peça
        // ficava com ela e o outro não tinha o que vestir.
        //
        // `storeItem` põe roupa no ARMÁRIO, não nas vagas de mão — é ele quem
        // sabe a diferença, e por isso esta cena não mudou quando a regra
        // mudou. E abastece a CADA abertura, não uma vez só: ele recusa o que a
        // pessoa já tem, então repor é de graça, e assim o armário também repõe
        // o que foi descartado — é o armário dele, a roupa mora ali.
        for (const quem of [g.playerId(), g.companionId()]) {
          for (const peca of ROUPAS_DO_ARMARIO) g.storeItem(peca, quem);
        }

        if (!g.flag('armario-aberto')) {
          g.setFlag('armario-aberto');
          await conversa([
            [A, 'Pode mexer, fica à vontade.'],
            [R, 'Tem mais roupa aqui do que no meu apartamento inteiro.'],
          ]);
          g.unlock({
            id: 'armario-do-ari',
            title: 'O armário do Ari',
            place: 'Quarto do Ari',
            note: 'Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.',
            icon: '👕',
          });
        }
        g.abrirGuardaRoupa();
      },
    });

    // ------------------------------------------------------------- o Pelusa
    // A área dele é o miolo do quarto, e os círculos proibidos são os mesmos
    // móveis que bloqueiam a dupla — repetidos aqui, e não lidos do colisor,
    // porque o gato é menor e passa em vão que gente não passa: ele contorna a
    // cama de perto, mas não pode subir no armário nem sumir dentro da planta.
    const pelusa = new Pelusa({
      minX: x0 + 0.8, maxX: W / 2 - 0.8,
      minZ: z0 + 0.9, maxZ: D / 2 - 0.8,
      proibido: [
        { x: -2.2, z: -1.75, r: 1.05 },      // a cama
        { x: -1.05, z: -2.72, r: 0.45 },     // o criado-mudo
        { x: 0.15, z: z0 + 0.22, r: 0.7 },   // a estante
        { x: ARMARIO.x, z: ARMARIO.z, r: 1.0 }, // o armário
        { x: x0 + 0.5, z: 2.0, r: 0.9 },     // a escrivaninha
        { x: W / 2 - 0.75, z: 0.9, r: 0.6 }, // o vaso de planta
      ],
    });
    w.add(pelusa.group);
    // o miado sai do gato, mas quem toca é o motor: a peça não conhece o áudio
    pelusa.aoSoar = () => g0.som('miado');

    const carinho = w.interact({
      id: 'quarto:pelusa',
      x: pelusa.x, z: pelusa.z, radius: 1.15,
      label: 'Fazer carinho no Pelusa', icon: '🐈',
      highlight: pelusa.group,
      onInteract: async (g) => {
        pelusa.receberCarinho();
        g.som('miado');
        if (!g.flag('pelusa-conhecido')) {
          g.setFlag('pelusa-conhecido');
          await conversa([
            [R, 'Esse é o Pelusa?'],
            [A, 'Esse é o Pelusa.'],
            [R, 'Ele deixa pegar?'],
            [A, 'Ele decide na hora. Hoje ele tá deixando.'],
          ]);
          g.unlock({
            id: 'pelusa',
            title: 'O Pelusa',
            place: 'Quarto do Ari',
            note: 'O gato do Ari. Branco, cinza no lombo, e some pelo quarto até você sentar no chão.',
            icon: '🐈',
          });
          return;
        }
        await g.say([w.pick(FALAS_DO_CARINHO)], A);
      },
    });

    // o prompt anda junto com ele — sem isto o balão fica onde ele estava
    // quando a cena foi montada, e o carinho vira um ponto morto no chão
    w.onUpdate((dt) => {
      pelusa.update(dt);
      carinho.moveTo(pelusa.x, pelusa.z);
    });

    // ------------------------------------------------- o quadro de memórias
    w.interact({
      id: 'quarto:memorias',
      x: MURAL.x, z: -2.15, radius: 1.35,
      label: 'Ver memórias', icon: '📌',
      highlight: mural,
      onInteract: async (g) => {
        if (!g.flag('quadro-visto')) {
          g.setFlag('quadro-visto');
          await conversa([
            [A, 'Eu queria um lugar pra pendurar as nossas.'],
            [R, 'Um quadro de memórias.'],
            [A, 'Esse. Cada uma que a gente viver, entra aqui.'],
          ]);
          g.unlock({
            id: 'quadro-de-memorias',
            title: 'O quadro de memórias',
            place: 'Quarto do Ari',
            note: 'Ideia dele. A primeira já estava pregada quando eu vi.',
            icon: '📌',
          });
        }
        g.abrirMemoria('o-pedido');
      },
    });

    // -------------------------------------------------------- as outras coisas
    w.interact({
      id: 'quarto:espelho',
      x: x0 + 0.95, z: -0.6, radius: 1.5,
      label: 'Se olhar no espelho', icon: '🪞',
      highlight: espelhoObj,
      onInteract: async (g) => {
        const vestindo = g.wearables().filter((i) => i !== null).length;
        if (vestindo === 0) {
          await conversa([
            [R, 'Tô bem assim?'],
            [A, 'Tá. Mas tem um armário inteiro logo ali.'],
          ]);
          return;
        }
        await conversa([
          [A, `Olha só, ${g.playerName()}.`],
          [R, 'Ficou bom mesmo.'],
        ]);
      },
    });

    w.interact({
      id: 'quarto:cama',
      x: -2.2, z: -0.5, radius: 1.6,
      label: 'Deitar na cama', icon: '🛏️',
      highlight: cama,
      onInteract: async (g) => {
        const quer = await g.ask('Deitar um pouco?', ['Deitar', 'Agora não']);
        if (quer !== 0) {
          await conversa([
            [R, 'Essa cama é bem melhor que a minha.'],
            [A, 'É a mesma cama de sempre.'],
            [R, 'Não é a cama então.'],
          ]);
          return;
        }

        g.lockPlayer(true);
        // lado a lado, cada um numa metade da largura da cama
        g.ridePlayer(deitados, new THREE.Vector3(-0.36, 0, 0), 1, 0);
        g.rideCompanion(deitados, new THREE.Vector3(0.36, 0, 0), 1, 0);
        g.setLying(true);
        // Câmera de cima, e não a isométrica de sempre: deitados, os dois
        // apontam para o fundo da cena, e a isométrica encurta justamente essa
        // direção — os corpos viravam dois tocos ao lado das cabeças. De cima
        // eles aparecem inteiros, lado a lado, que é o que a pose tem de bonito.
        g.setCameraOmbro(
          new THREE.Vector3(-0.95, 3.75, 0.35),
          new THREE.Vector3(-2.2, 0.72, -1.75),
        );
        await g.wait(1.1);

        await conversa([
          [R, 'Essa cama é bem melhor que a minha.'],
          [A, 'É a mesma cama de sempre.'],
          [R, 'Não é a cama então.'],
        ]);

        const ficar = await g.ask('Ficar mais um pouco?', ['Fica', 'Levantar']);
        if (ficar === 0) {
          await conversa([
            [A, 'A gente não precisa fazer nada agora.'],
            [R, 'Eu sei.'],
          ]);
          // um tempo parado, só para o balanço dos braços aparecer
          await g.wait(2.4);
        }

        g.setLying(false);
        g.setCameraOmbro(null);
        g.releasePlayer(-1.3, -0.4, 0);
        g.releaseCompanion(-1.3, 0.25, 0);
        g.lockPlayer(false);

        g.unlock({
          id: 'deitar-junto',
          title: 'Deitar sem motivo',
          place: 'Quarto do Ari',
          note: 'Os dois na cama dele, olhando o teto, sem plano nenhum para o resto da tarde.',
          icon: '🛏️',
        });
      },
    });

    w.interact({
      id: 'quarto:mesa',
      x: x0 + 1.5, z: 2.0, radius: 1.5,
      label: 'Olhar a escrivaninha', icon: '💻',
      highlight: escrivaninha,
      onInteract: () =>
        conversa([
          [A, 'É daqui que eu te mando mensagem de madrugada.'],
          [R, 'Eu sei. Eu tô acordado do outro lado.'],
        ]),
    });

    w.interact({
      id: 'quarto:estante',
      x: 0.35, z: -2.2, radius: 1.4,
      label: 'Olhar a estante', icon: '📚',
      highlight: estante,
      onInteract: async (g) => {
        await conversa([
          [R, 'Você leu todos esses?'],
          [A, 'Comecei todos esses.'],
          [A, 'Menos esse. Esse eu li três vezes: Aristóteles e Dante Descobrem os Segredos do Universo.'],
          [R, 'Eu sei. Você me contou o final antes de eu chegar na metade.'],
          [A, 'E o seu tá aqui do lado. A Toca das Raposas.'],
          [R, 'Você guardou.'],
          [A, 'Guardei.'],
        ]);
        if (!g.flag('estante-favoritos')) {
          g.setFlag('estante-favoritos');
          g.unlock({
            id: 'os-dois-livros',
            title: 'Os dois livros',
            place: 'Quarto do Ari',
            note: 'O Aristóteles e Dante é dele. A Toca das Raposas é meu. Ficam na mesma prateleira.',
            icon: '📚',
          });
        }
      },
    });
  },
};
