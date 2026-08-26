import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  bed, bookshelf, chair, coffeeTable, counter, desk, diningTable, floorLamp,
  fridge, mug, pictureFrame, pottedPlant, rug, sofa, tvSet, upperCabinets,
  wallShelf, windowFrame,
} from '../world/furniture';
import { heart } from '../world/props';
import { toon } from '../core/materials';

/**
 * Casa do Ari — a cena de abertura.
 *
 * Convencao de interiores: paredes inteiras so nos dois lados do fundo
 * (-X e -Z) e mureta baixa nos dois lados abertos, para a camera isometrica
 * enxergar o comodo inteiro sem parede na frente.
 * Orientacao na camera padrao: -Z sobe para a direita, -X sobe para a esquerda.
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
    ambientIntensity: 1.35,
    sunDir: [9, 15, 11],
  },
  spawn: { x: -0.4, z: 3.6, facing: Math.PI },
  entries: {
    'da-rua': { x: 4.6, z: -3.6, facing: 0 },
  },

  build(w) {
    const W = 13;
    const D = 10;
    const x0 = -W / 2; // parede da cozinha
    const z0 = -D / 2; // parede do fundo

    // -------------------------------------------------------------- casca
    w.ground({ width: W, depth: D, color: P.floorWood });
    w.setBounds(x0 + 0.45, z0 + 0.45, W / 2 - 0.45, D / 2 - 0.45);

    w.wall(x0, z0, W / 2, z0, 3.0, P.wallCream);
    w.wall(x0, z0, x0, D / 2, 3.0, P.wallMint);
    w.wall(x0, D / 2, W / 2, D / 2, 0.45, P.wallCream);
    w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.wallCream);

    // ------------------------------------------------------------ cozinha
    w.add(w.place(counter(3.4), x0 + 0.55, 0, -1.6, Math.PI / 2));
    w.blockBox(x0 + 0.55, -1.6, 0.4, 1.7);
    w.add(w.place(upperCabinets(2.4), x0 + 0.3, 2.05, -1.6, Math.PI / 2));
    w.add(w.place(fridge(), x0 + 0.7, 0, 1.2, Math.PI / 2));
    w.blockBox(x0 + 0.7, 1.2, 0.4, 0.45);

    const mesa = w.add(w.place(diningTable(1.6, 0.95), -3.4, 0, 0.6, 0.1));
    w.blockBox(-3.4, 0.6, 0.85, 0.55, 0.1);
    w.add(w.place(chair(), -3.4, 0, -0.5, 0));
    w.add(w.place(chair(), -3.4, 0, 1.7, Math.PI));

    // ------------------------------------------------------- sala de estar
    w.add(w.place(rug(3.4, 2.4), 1.6, 0, 0.4));
    const sofaObj = w.add(w.place(sofa(P.sofa, 2.6), 1.6, 0, 2.0, Math.PI));
    w.blockBox(1.6, 2.0, 1.3, 0.5);
    w.add(w.place(coffeeTable(), 1.6, 0, 0.4));
    w.blockBox(1.6, 0.4, 0.6, 0.35);
    const caneca = w.add(w.place(mug(0xfff2e0), 1.85, 0.5, 0.4));

    const tv = w.add(w.place(tvSet(false), 1.6, 0, z0 + 0.55));
    w.blockBox(1.6, z0 + 0.55, 0.9, 0.3);
    const tela = tv.children.find((c) => (c as THREE.Mesh).isMesh && c.position.y > 0.9)!;

    w.add(w.place(floorLamp(true), -0.4, 0, 2.4));
    w.blockCircle(-0.4, 2.4, 0.3);

    const estante = w.add(w.place(bookshelf(1.9, 1.3), -0.9, 0, z0 + 0.35));
    w.blockBox(-0.9, z0 + 0.35, 0.65, 0.22);

    // -------------------------------------------------------------- quarto
    w.add(w.place(bed(P.fabricBlue), W / 2 - 1.05, 0, -2.6, Math.PI / 2));
    w.blockBox(W / 2 - 1.05, -2.6, 1.1, 0.8);

    w.add(w.place(desk(), W / 2 - 1.15, 0, 1.4, -Math.PI / 2));
    w.blockBox(W / 2 - 1.15, 1.4, 0.45, 0.85);
    w.add(w.place(chair(), W / 2 - 2.2, 0, 1.4, Math.PI / 2));

    // ----------------------------------------------------------- decoracao
    w.add(w.place(pottedPlant(1.15), x0 + 0.9, 0, D / 2 - 0.9));
    const plantinha = w.add(w.place(pottedPlant(0.75), 4.9, 0, z0 + 0.5));

    const quadro = w.add(w.place(pictureFrame(0.9, 0.7, P.skyDusk), -3.4, 1.95, z0 + 0.17));
    w.add(w.place(pictureFrame(0.55, 0.7, P.grass), -2.3, 2.0, z0 + 0.17));
    w.add(w.place(wallShelf(1.2), 3.2, 1.75, z0 + 0.2));
    w.add(w.place(windowFrame(1.7, 1.3), x0 + 0.16, 1.85, 1.2, Math.PI / 2));

    const coracao = w.place(heart(0.75), 1.6, 2.5, 2.0);
    coracao.visible = false;
    w.add(coracao);

    // porta da rua
    const porta = w.add(
      w.place(
        new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.1, 0.14), toon(P.woodDark)),
        4.6, 1.05, z0 + 0.12,
      ),
    );
    w.add(
      w.place(
        new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), toon(P.gold, { glow: 0.2 })),
        5.0, 1.1, z0 + 0.22,
      ),
    );

    // --------------------------------------------------------- interacoes
    w.interact({
      id: 'casa:sofa',
      x: 1.6, z: 1.1, radius: 1.5,
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
      x: 1.6, z: z0 + 1.5, radius: 1.5,
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
      x: x0 + 1.5, z: 1.2, radius: 1.5,
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
      x: -3.4, z: 1.9, radius: 1.4,
      label: 'Pôr a mesa', icon: '🍽️',
      highlight: mesa,
      onInteract: async (g) => {
        await g.say(['Duas canecas, dois pratos. Já virou automático.']);
        g.toast('Mesa posta', '🍽️');
      },
    });

    w.interact({
      id: 'casa:planta',
      x: 4.9, z: z0 + 1.5, radius: 1.5,
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
      id: 'casa:quadro',
      x: -3.4, z: z0 + 1.3, radius: 1.5,
      label: 'Olhar o porta-retrato', icon: '🖼️',
      highlight: quadro,
      onInteract: async (g) => {
        await g.say([
          'A foto do dia que o céu ficou laranja daquele jeito.',
          'A gente parou no meio da rua só pra olhar.',
        ]);
        g.unlock({
          id: 'ceu-laranja',
          title: 'O céu laranja',
          place: 'Casa do Ari',
          note: 'A foto na parede: um fim de tarde que virou parede de casa.',
          icon: '🌇',
        });
      },
    });

    w.interact({
      id: 'casa:cafe',
      x: 2.2, z: -0.4, radius: 1.3,
      label: 'Tomar o café', icon: '☕',
      highlight: caneca,
      onInteract: async (g) => {
        await g.say(['Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto.']);
        g.toast('+1 disposição', '☕');
      },
    });

    w.interact({
      id: 'casa:estante',
      x: -0.9, z: z0 + 1.4, radius: 1.4,
      label: 'Ver a estante', icon: '📚',
      highlight: estante,
      onInteract: (g) =>
        g.say(['Metade dos livros são seus. A outra metade também, você só ainda não sabe.']),
    });

    w.door({
      x: 4.6, z: z0 + 1.25,
      to: 'villa-lobos', entry: 'portao',
      label: 'Sair — ir pro parque', icon: '🚪',
      highlight: porta,
      radius: 1.7,
    });

    // ------------------------------------------------------------ ambiente
    w.onUpdate((_dt, t) => {
      coracao.visible = w.game.flag('planta-regada');
      coracao.position.y = 2.5 + Math.sin(t * 1.6) * 0.12;
      coracao.rotation.y = t * 0.9;
    });
  },
};
