import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  bed, bookshelf, chair, coffeeTable, counter, diningTable, floorLamp, fridge,
  interiorDoor, mug, nightstand, pictureFrame, pottedPlant, rug, sofa, tvSet,
  upperCabinets, wallShelf, washingMachine, windowFrame,
} from '../world/furniture';
import { heart } from '../world/props';
import { toon } from '../core/materials';

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
    w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.wallCream);

    // ------------------------------------------------------- quarto (azul)
    // piso próprio e mureta na frente, para dar pra ver a cama de fora
    const qx1 = 0.4;
    const qx2 = 4.2;
    const qz2 = -1.3;
    w.patch((qx1 + qx2) / 2, (z0 + qz2) / 2, qx2 - qx1, qz2 - z0, 0xb9c9e0, 0, 0.012);

    // mureta da frente com um vão de passagem à esquerda
    w.wall(1.7, qz2, qx2, qz2, 0.45, P.wallCream);
    // divisória entre quarto e banheiro
    w.wall(qx2, z0, qx2, qz2, H, P.wallCream);

    w.add(w.place(bed(P.fabricBlue), 2.5, 0, -3.1, Math.PI));
    w.blockBox(2.5, -3.1, 0.78, 1.08);
    const abajur = w.add(w.place(nightstand(), 1.0, 0, -3.9));
    w.blockBox(1.0, -3.9, 0.24, 0.22);
    w.add(w.place(bookshelf(1.6, 1.0), 3.6, 0, -4.2, -Math.PI / 2));
    w.blockBox(3.9, -4.2, 0.2, 0.5);
    w.add(w.place(pictureFrame(0.6, 0.5, P.flowerPink), 2.5, 1.9, z0 + 0.17));

    // --------------------------------------------- banheiro (porta amarela)
    w.wall(qx2, qz2, W / 2, qz2, H, P.wallCream);
    const portaBanheiro = w.add(w.place(interiorDoor(P.gold, 0.85, 2.05), 5.1, 0, qz2 + 0.1));

    // ------------------------------------------------------ cozinha (lilás)
    w.add(w.place(counter(3.6), -3.4, 0, z0 + 0.42));
    w.blockBox(-3.4, z0 + 0.42, 1.8, 0.4);
    w.add(w.place(upperCabinets(2.6), -3.4, 2.0, z0 + 0.2));
    w.add(w.place(fridge(), -0.7, 0, z0 + 0.5));
    w.blockBox(-0.7, z0 + 0.5, 0.42, 0.38);

    const mesa = w.add(w.place(diningTable(1.5, 0.9), -3.6, 0, -1.9, 0.08));
    w.blockBox(-3.6, -1.9, 0.8, 0.52, 0.08);
    w.add(w.place(chair(), -4.7, 0, -1.9, Math.PI / 2));
    w.add(w.place(chair(), -2.5, 0, -1.9, -Math.PI / 2));

    // ------------------------------------- sala: TV na esquerda, sofá de frente
    const tv = w.add(w.place(tvSet(false), x0 + 0.35, 0, 0.6, Math.PI / 2));
    w.blockBox(x0 + 0.35, 0.6, 0.3, 0.9);
    const tela = tv.children.find((c) => (c as THREE.Mesh).isMesh && c.position.y > 0.9)!;

    w.add(w.place(rug(3.0, 2.6), -2.5, 0, 0.6));
    const sofaObj = w.add(w.place(sofa(P.fabricRed, 2.4), -0.3, 0, 0.6, -Math.PI / 2));
    w.blockBox(-0.3, 0.6, 0.5, 1.2);
    w.add(w.place(coffeeTable(), -2.4, 0, 0.6, Math.PI / 2));
    w.blockBox(-2.4, 0.6, 0.38, 0.62);
    const caneca = w.add(w.place(mug(0xfff2e0), -2.4, 0.5, 0.9));

    w.add(w.place(floorLamp(true), -0.4, 0, 2.3));
    w.blockCircle(-0.4, 2.3, 0.3);

    // --------------------------------------------- área de serviço (verde)
    const maquina = w.add(w.place(washingMachine(), W / 2 - 0.7, 0, -0.4, -Math.PI / 2));
    w.blockBox(W / 2 - 0.7, -0.4, 0.35, 0.4);

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

    // ------------------------------------------------------------ interações
    w.interact({
      id: 'casa:sofa',
      x: -1.2, z: 0.6, radius: 1.5,
      label: 'Sentar no sofá', icon: '🛋️',
      highlight: sofaObj,
      onInteract: async (g) => {
        await g.say([
          'O sofá continua com aquele afundado do seu lado.',
          'Dá pra ficar horas aqui sem fazer nada — e ainda parece pouco.',
        ]);
        g.unlock({
          id: 'sofa-preguica',
          title: 'Domingo sem pressa',
          place: 'Casa do Ari',
          note: 'Aquele domingo em que o plano era sair e a gente ficou no sofá o dia inteiro.',
          icon: '🛋️',
        });
      },
    });

    let tvLigada = false;
    w.interact({
      id: 'casa:tv',
      x: x0 + 1.4, z: 0.6, radius: 1.5,
      label: 'Ligar a TV', icon: '📺',
      highlight: tv,
      onInteract: async (g) => {
        tvLigada = !tvLigada;
        (tela as THREE.Mesh).material = toon(tvLigada ? 0x8fd7ff : P.screen, { glow: tvLigada ? 0.5 : 0 });
        g.toast(tvLigada ? 'TV ligada' : 'TV desligada', '📺');
        if (tvLigada) await g.say(['De novo o mesmo filme. E de novo a gente vai assistir inteiro.']);
      },
    });

    w.interact({
      id: 'casa:geladeira',
      x: -0.7, z: z0 + 1.5, radius: 1.4,
      label: 'Abrir a geladeira', icon: '🧊',
      onInteract: async (g) => {
        const achados = [
          'Sobrou pizza.',
          'Tem pudim. Escondido no fundo, como sempre.',
          'Só um pote de azeitona e coragem.',
        ];
        await g.say([achados[Math.floor(Math.random() * achados.length)]]);
      },
    });

    w.interact({
      id: 'casa:mesa',
      x: -3.6, z: -0.9, radius: 1.4,
      label: 'Pôr a mesa', icon: '🍽️',
      highlight: mesa,
      onInteract: async (g) => {
        await g.say([`Dois pratos, duas canecas. Já virou automático.`]);
        g.toast('Mesa posta', '🍽️');
      },
    });

    w.interact({
      id: 'casa:maquina',
      x: W / 2 - 1.6, z: -0.4, radius: 1.4,
      label: 'Ver a máquina de lavar', icon: '🧺',
      highlight: maquina,
      onInteract: async (g) => {
        if (g.flag('roupa-lavando')) {
          await g.say(['Ainda tá centrifugando. Aquele barulho de sempre.']);
          return;
        }
        g.setFlag('roupa-lavando');
        g.toast('Máquina ligada', '🫧');
        await g.say(['Bota pra lavar agora que quando a gente voltar do parque já tá pronto.']);
      },
    });

    w.interact({
      id: 'casa:banheiro',
      x: 5.1, z: qz2 + 1.2, radius: 1.5,
      label: 'Bater na porta do banheiro', icon: '🚪',
      highlight: portaBanheiro,
      onInteract: (g) => g.say(['— Já vou! — Você sempre diz isso e demora mais quinze minutos.']),
    });

    w.interact({
      id: 'casa:cama',
      x: 2.5, z: -1.9, radius: 1.6,
      label: 'Arrumar a cama', icon: '🛏️',
      highlight: abajur,
      onInteract: async (g) => {
        await g.say([
          'Lençol esticado, travesseiro no lugar.',
          'Dura até de noite, mas tudo bem.',
        ]);
        g.unlock({
          id: 'quarto-manha',
          title: 'A cama arrumada',
          place: 'Casa do Ari',
          note: 'O quarto pequeno com a luz entrando de lado e o abajur ainda aceso.',
          icon: '🛏️',
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
