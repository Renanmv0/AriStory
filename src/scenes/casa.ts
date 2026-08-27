import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  chair, coffeeTable, counter, diningTable, floorLamp, fridge, interiorDoor,
  mug, pictureFrame, pottedPlant, rug, sofa, tvSet, upperCabinets, wallShelf,
  washingMachine, windowFrame,
} from '../world/furniture';
import { heart } from '../world/props';
import { toon } from '../core/materials';
import { ARI, RENAN } from '../characters/cast';

/**
 * Casa do Ari — apartamento pequeno, montado a partir do esboço do Renan.
 *
 * Planta (a câmera padrão vê -Z subindo à direita e -X subindo à esquerda):
 *   fundo (-Z), da esquerda p/ direita: cozinha · quarto · banheiro
 *   parede esquerda (-X): janela e a TV
 *   sofá encostado na lateral do quarto, de frente para a TV
 *   máquina de lavar no canto direito, perto da porta da rua
 *
 * Convenção de interiores: parede inteira só em -X e -Z (e no banheiro, que é
 * fechado); o resto é mureta, senão a parede tapa a câmera isométrica.
 */
export const casa: SceneDef = {
  id: 'casa',
  name: 'Casa do Ari',
  subtitle: 'domingo de manhã, café ainda quente',
  ambient: {
    sky: 0xefe4d4,
    indoor: true,
    sunColor: 0xfff0d4,
    sunIntensity: 1.0,
    ambientColor: 0xfdf3e3,
    ambientIntensity: 1.4,
    sunDir: [9, 15, 11],
  },
  spawn: { x: 1.4, z: 2.4, facing: Math.PI },
  entries: {
    'da-rua': { x: 3.4, z: 3.1, facing: Math.PI },
  },

  build(w) {
    const g0 = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g0.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    const W = 12;
    const D = 9;
    const x0 = -W / 2;
    const z0 = -D / 2;
    const H = 2.8;

    // --------------------------------------------------------------- casca
    w.ground({ width: W, depth: D, color: P.floorWood });
    w.setBounds(x0 + 0.45, z0 + 0.45, W / 2 - 0.45, D / 2 - 0.45);

    w.wall(x0, z0, W / 2, z0, H, P.wallCream);
    w.wall(x0, z0, x0, D / 2, H, P.wallMint);
    w.wall(x0, D / 2, W / 2, D / 2, 0.45, P.wallCream);
    w.wall(W / 2, -1.3, W / 2, D / 2, 0.45, P.wallCream);

    // ----------------------------------------- o quarto e o banheiro (fundo)
    // Dois cômodos fechados, no mesmo tamanho de sempre: o quarto (que o Ari
    // divide com a Rubina, a roommate) e o banheiro. Ficam com teto — é o teto
    // que impede de ver dentro numa câmera que olha de cima.
    const qx0 = 0.4; // lateral do bloco
    const qx1 = 4.2; // divisória entre quarto e banheiro
    const qz2 = -1.3; // frente do bloco
    const xQuarto = (qx0 + qx1) / 2;
    const xBanheiro = (qx1 + W / 2) / 2;

    // parede da frente, com um vão para cada porta
    const vao = 0.95;
    const bordas = [
      qx0, xQuarto - vao / 2,
      xQuarto + vao / 2, xBanheiro - vao / 2,
      xBanheiro + vao / 2, W / 2,
    ];
    for (let i = 0; i < bordas.length; i += 2) {
      if (bordas[i + 1] - bordas[i] > 0.05) {
        w.wall(bordas[i], qz2, bordas[i + 1], qz2, H, P.wallCream);
      }
    }
    w.wall(qx0, z0, qx0, qz2, H, P.wallCream); // lateral esquerda
    w.wall(qx1, z0, qx1, qz2, H, P.wallCream); // divisória
    w.wall(W / 2, z0, W / 2, qz2, H, P.wallCream); // lateral direita, alta aqui

    // teto: fecha os dois cômodos por cima
    const teto = new THREE.Mesh(
      new THREE.BoxGeometry(W / 2 - qx0, 0.16, qz2 - z0),
      toon(0xe6d9c4),
    );
    teto.position.set((qx0 + W / 2) / 2, H + 0.08, (z0 + qz2) / 2);
    w.add(teto);

    // As portas ficam CENTRADAS na linha da parede. O batente é mais fino que
    // a parede (0.24 contra 0.3): posta à frente, a face do batente encostava
    // na face da parede e as duas piscavam.
    const portaQuarto = w.add(w.place(interiorDoor(P.woodDark, 0.85, 2.05), xQuarto, 0, qz2));
    const portaBanheiro = w.add(w.place(interiorDoor(P.gold, 0.85, 2.05), xBanheiro, 0, qz2));

    // uns enfeites para o bege não ficar liso
    w.add(w.place(pictureFrame(0.6, 0.75, P.wallMint), 3.55, 1.75, qz2 + 0.17));
    w.add(w.place(wallShelf(0.9), 1.1, 1.7, qz2 + 0.19));

    // ------------------------------------------------------ cozinha (lilás)
    w.add(w.place(counter(3.6), -3.4, 0, z0 + 0.42));
    w.blockBox(-3.4, z0 + 0.42, 1.8, 0.4);
    w.add(w.place(upperCabinets(2.6), -3.4, 2.0, z0 + 0.2));
    // na parede da esquerda: no fundo ela ficava escondida atrás do bloco
    w.add(w.place(fridge(), x0 + 0.45, 0, -2.6, Math.PI / 2));
    w.blockBox(x0 + 0.45, -2.6, 0.38, 0.42);

    const mesa = w.add(w.place(diningTable(1.5, 0.9), -3.6, 0, -1.9, 0.08));
    w.blockBox(-3.6, -1.9, 0.8, 0.52, 0.08);
    w.add(w.place(chair(), -4.7, 0, -1.9, Math.PI / 2));
    w.add(w.place(chair(), -2.5, 0, -1.9, -Math.PI / 2));

    // ------------------------------------- sala: TV na esquerda, sofá de frente
    const tv = w.add(w.place(tvSet(false), x0 + 0.35, 0, 0.6, Math.PI / 2));
    w.blockBox(x0 + 0.35, 0.6, 0.3, 0.9);
    const tela = tv.getObjectByName('tela') as THREE.Mesh;

    w.add(w.place(rug(3.0, 2.6), -2.5, 0, 0.6));
    const sofaObj = w.add(w.place(sofa(P.fabricRed, 2.4), -0.3, 0, 0.6, -Math.PI / 2));
    w.blockBox(-0.3, 0.6, 0.5, 1.2);
    w.add(w.place(coffeeTable(), -2.4, 0, 0.6, Math.PI / 2));
    w.blockBox(-2.4, 0.6, 0.38, 0.62);
    const caneca = w.add(w.place(mug(0xfff2e0), -2.4, 0.5, 0.9));

    w.add(w.place(floorLamp(true), -0.4, 0, 2.3));
    w.blockCircle(-0.4, 2.3, 0.3);

    // --------------------------------------------- área de serviço (verde)
    // longe das portas do fundo: aqui ela não tranca a passagem de ninguém
    const maquina = w.add(w.place(washingMachine(), W / 2 - 0.65, 0, 2.9, -Math.PI / 2));
    w.blockBox(W / 2 - 0.65, 2.9, 0.35, 0.4);

    // ------------------------------------------------ janela (rosa) e enfeites
    w.add(w.place(windowFrame(1.8, 1.3), x0 + 0.16, 1.75, 2.4, Math.PI / 2));
    w.add(w.place(pictureFrame(0.8, 0.6, P.skyDusk), -3.4, 1.95, z0 + 0.17));
    w.add(w.place(wallShelf(1.1), -1.6, 1.8, z0 + 0.2));
    w.add(w.place(pottedPlant(1.1), x0 + 0.8, 0, D / 2 - 1.0));
    const plantinha = w.add(w.place(pottedPlant(0.75), 4.9, 0, 1.4));

    const coracao = w.place(heart(0.75), -0.3, 2.4, 0.6);
    coracao.visible = false;
    w.add(coracao);

    // ---------------------------------------------------------- porta da rua
    // trecho de parede alta na mureta da frente, só para a porta ter onde morar
    const zPorta = D / 2;
    w.wall(2.0, zPorta, 2.9, zPorta, 2.6, P.wallCream);
    w.wall(3.9, zPorta, 4.9, zPorta, 2.6, P.wallCream);
    const porta = w.add(w.place(interiorDoor(P.woodDark, 0.95, 2.1), 3.4, 0, zPorta, Math.PI));
    w.blockBox(3.4, zPorta, 0.5, 0.12);
    w.add(w.place(rug(1.4, 0.8, 0xc0a882), 3.4, 0, D / 2 - 1.0));

    // ----------------------------------------------- âncoras da cena do sofá
    // o "assento" carrega os dois durante a cutscene; a rotação mora nele,
    // então o rig entra com facing 0 e sai olhando para a TV
    const assento = new THREE.Object3D();
    // à frente do encosto, senão o espaldar do sofá tapa os dois na câmera iso
    assento.position.set(-0.52, 0, 0.6);
    assento.rotation.y = -Math.PI / 2;
    w.root.add(assento);

    const focoSofa = new THREE.Object3D();
    focoSofa.position.set(-1.9, 1.05, 0.6);
    w.root.add(focoSofa);

    let tvLigada = false;
    const ligarTv = (ligada: boolean): void => {
      tvLigada = ligada;
      tela.material = toon(ligada ? 0x8fd7ff : P.screen, { glow: ligada ? 0.55 : 0 });
    };

    // ------------------------------------------------------------ interações
    w.interact({
      id: 'casa:sofa',
      // centrado no próprio sofá: dá pra sentar chegando por qualquer lado
      x: -0.3, z: 0.6, radius: 2.0,
      label: 'Sentar no sofá', icon: '🛋️',
      highlight: sofaObj,
      onInteract: async (g) => {
        const sentar = await g.ask('Parece muito confortável, sentar?', ['Sim', 'Não']);
        if (sentar !== 0) {
          await g.say(['Depois. Se sentar agora, não levanta mais.']);
          return;
        }

        g.lockPlayer(true);
        g.ridePlayer(assento, new THREE.Vector3(-0.52, 0.02, 0), 1, 0);
        g.rideCompanion(assento, new THREE.Vector3(0.52, 0.02, 0), 1, 0);
        g.setSitting(true);
        ligarTv(true);
        g.focusCamera(focoSofa);
        g.setZoom(7.2);
        await g.wait(0.9);

        await g.say(['Está passando Bo Burnham.']);
        await g.say([
          'Você já sabe a letra inteira e mesmo assim espera a parte que gosta.',
          `E aí olha pro lado pra ver se ${g.companionName()} tá rindo também.`,
        ]);

        const ficar = await g.ask('Ficar mais um pouco?', ['Fica', 'Bora pro parque']);
        if (ficar === 0) {
          await g.say(['Mais um. Só mais um.', 'Nunca é só mais um.']);
        }

        g.setSitting(false);
        g.focusCamera(null);
        g.setZoom(10);
        g.releasePlayer(-1.6, 0.4, -Math.PI / 2);
        g.releaseCompanion(-1.6, 1.5, -Math.PI / 2);
        g.lockPlayer(false);

        g.unlock({
          id: 'sofa-preguica',
          title: 'Domingo sem pressa',
          place: 'Casa do Ari',
          note: 'Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.',
          icon: '🛋️',
        });
      },
    });

    w.interact({
      id: 'casa:tv',
      x: x0 + 1.4, z: 0.6, radius: 1.5,
      label: 'Ligar a TV', icon: '📺',
      highlight: tv,
      onInteract: async (g) => {
        ligarTv(!tvLigada);
        if (tvLigada) g.som('tv');
        g.toast(tvLigada ? 'TV ligada' : 'TV desligada', '📺');
        if (tvLigada) await g.say(['Está passando Bo Burnham.']);
      },
    });

    w.interact({
      id: 'casa:geladeira',
      x: x0 + 1.5, z: -2.6, radius: 1.4,
      label: 'Abrir a geladeira', icon: '🧊',
      onInteract: (g) =>
        g.say(['Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas.']),
    });

    w.interact({
      id: 'casa:pia',
      x: -2.2, z: z0 + 1.3, radius: 1.4,
      label: 'Olhar a pia', icon: '🚰',
      onInteract: (g) => g.say(['Por algum milagre, a pia está limpa…']),
    });

    w.interact({
      id: 'casa:mesa',
      x: -3.6, z: -0.9, radius: 1.4,
      label: 'Pôr a mesa', icon: '🍽️',
      highlight: mesa,
      onInteract: async (g) => {
        await conversa([
          [A, 'Dois pratos, duas canecas. Já virou automático.'],
          [R, 'Três, se a Rubi sair do quarto.'],
        ]);
        g.toast('Mesa posta', '🍽️');
      },
    });

    w.interact({
      id: 'casa:maquina',
      x: W / 2 - 1.7, z: 2.9, radius: 1.4,
      label: 'Ver a máquina de lavar', icon: '🧺',
      highlight: maquina,
      onInteract: async (g) => {
        if (g.flag('roupa-lavando')) {
          await conversa([
            [R, 'Ainda tá centrifugando.'],
            [A, 'Esse barulho é a trilha sonora dessa casa.'],
          ]);
          return;
        }
        g.setFlag('roupa-lavando');
        g.toast('Máquina ligada', '🫧');
        await conversa([
          [A, 'Bota pra lavar agora que quando a gente voltar do parque já tá pronto.'],
          [R, 'Contanto que a Rubi não encha ela de novo antes.'],
        ]);
      },
    });

    w.interact({
      id: 'casa:banheiro',
      x: xBanheiro, z: qz2 + 1.2, radius: 1.3,
      label: 'Bater na porta do banheiro', icon: '🚪',
      highlight: portaBanheiro,
      onInteract: () =>
        conversa([
          [R, 'Tem alguém aí?'],
          [A, 'É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro.'],
        ]),
    });

    w.interact({
      id: 'casa:quarto',
      x: xQuarto, z: qz2 + 1.2, radius: 1.4,
      label: 'Porta do quarto', icon: '🎧',
      highlight: portaQuarto,
      onInteract: async (g) => {
        await conversa([
          [A, 'Acho que a Rubi está ouvindo kpop'],
          [R, 'Para variar né'],
        ]);
        g.unlock({
          id: 'quarto-manha',
          title: 'Do outro lado da porta',
          place: 'Casa do Ari',
          note: 'Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.',
          icon: '🎧',
        });
      },
    });

    w.interact({
      id: 'casa:planta',
      x: 4.9, z: 2.4, radius: 1.4,
      label: 'Regar a plantinha', icon: '🪴',
      highlight: plantinha,
      onInteract: async (g) => {
        if (g.flag('planta-regada')) {
          await g.say(['Já bebeu água hoje. Tá mais cuidada que a gente.']);
          return;
        }
        g.setFlag('planta-regada');
        plantinha.scale.multiplyScalar(1.2);
        g.toast('A plantinha cresceu um tiquinho', '🌱');
        await g.say(['Pronto. Ela finge que não gosta, mas gosta.']);
      },
    });

    w.interact({
      id: 'casa:cafe',
      x: -2.4, z: 1.6, radius: 1.3,
      label: 'Tomar o café', icon: '☕',
      highlight: caneca,
      onInteract: async (g) => {
        await g.say(['Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto.']);
        g.toast('+1 disposição', '☕');
      },
    });

    w.interact({
      id: 'casa:janela',
      x: x0 + 1.3, z: 2.4, radius: 1.5,
      label: 'Olhar pela janela', icon: '🪟',
      onInteract: async (g) => {
        await g.say([
          'O dia tá bom demais pra ficar em casa.',
          'Dá tempo de ir no parque e ainda voltar antes do sol cair.',
        ]);
        g.unlock({
          id: 'ceu-laranja',
          title: 'O céu laranja',
          place: 'Casa do Ari',
          note: 'Da janela dele dá pra ver o céu mudando de cor no fim da tarde.',
          icon: '🌇',
        });
      },
    });

    w.door({
      x: 3.4, z: D / 2 - 1.2,
      to: 'villa-lobos', entry: 'portao',
      label: 'Sair — ir pro parque', icon: '🚪',
      highlight: porta,
      radius: 1.7,
    });

    // -------------------------------------------------------------- ambiente
    w.onUpdate((_dt, t) => {
      coracao.visible = w.game.flag('planta-regada');
      coracao.position.y = 2.4 + Math.sin(t * 1.6) * 0.12;
      coracao.rotation.y = t * 0.9;
    });
  },
};
