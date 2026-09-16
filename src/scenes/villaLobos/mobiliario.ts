import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { bench, bin, iceCream, kiosk, lamp, picnicTable } from '../../world/props';
import { ARI } from '../../characters/cast';
import { A, R, type Conversa } from './comum';

/**
 * Mobiliario do parque: bancos, postes, lixeiras, a mesa do piquenique e a
 * sorveteria — com os sorvetes que ficam na mao dos dois depois da compra.
 */

export interface Mobiliario {
  mesa: THREE.Object3D;
  quiosque: THREE.Object3D;
}

export function construirMobiliario(w: WorldBuilder): Mobiliario {
  const bancos: Array<[number, number, number]> = [
    [-4.2, 14, 0], [4.2, 14, Math.PI], [-4.2, -2, 0], [4.2, -6, Math.PI],
    [-12, 9.5, Math.PI / 2],
  ];
  for (const [x, z, r] of bancos) {
    w.add(w.place(bench(), x, 0, z, r));
    w.blockBox(x, z, 1, 0.35, r);
  }

  for (const [x, z] of [[-4, 20], [4, 6], [-4, -8], [4, 22], [-4, 2]] as const) {
    w.add(w.place(lamp(false), x, 0, z));
    w.blockCircle(x, z, 0.35);
  }
  for (const [x, z] of [[3.4, 17], [-3.4, 11]] as const) {
    w.add(w.place(bin(), x, 0, z));
    w.blockCircle(x, z, 0.35);
  }

  const mesa = w.add(w.place(picnicTable(), -10, 0, 20, 0.3));
  w.blockBox(-10, 20, 1, 0.9, 0.3);

  // sorveteria
  // balcão virado para +Z: assim quem compra fica na frente do quiosque na
  // tela, e não escondido atrás dele
  const quiosque = w.add(w.place(kiosk(0xf6a6c0), 12, 0, 18.6, 0.3));
  w.blockBox(12, 18.6, 1.3, 0.9, 0.3);
  const casquinhaPlaca = w.add(w.place(iceCream(P.morango), 12, 2.55, 18.4, 0.3));
  casquinhaPlaca.scale.setScalar(3);

  return { mesa, quiosque };
}

/** Os dois sorvetes na mao, e a compra no quiosque. */
export function sorvetes(w: WorldBuilder, conversa: Conversa, quiosque: THREE.Object3D): void {
  const g = w.game;

  // um morango para o Ari e um maracujá para o Renan; trocar de personagem
  // com T troca a mão, não o sabor
  const sorveteAri = iceCream(P.morango);
  const sorveteRenan = iceCream(P.maracuja);
  sorveteAri.visible = false;
  sorveteRenan.visible = false;
  w.root.add(sorveteAri, sorveteRenan);
  let sorveteRestante = 0;

  const segurarNaEsquerda = (obj: THREE.Object3D, pos: THREE.Vector3, facing: number): void => {
    obj.visible = true;
    // mão esquerda: a direita é onde o frisbee fica
    obj.position.set(
      pos.x + Math.sin(facing - Math.PI / 2) * 0.42,
      1.14,
      pos.z + Math.cos(facing - Math.PI / 2) * 0.42,
    );
    obj.rotation.y = facing;
  };

  w.onUpdate((dt) => {
    if (sorveteRestante <= 0) return;
    sorveteRestante -= dt;

    const doJogador = g.playerName() === ARI.name ? sorveteAri : sorveteRenan;
    const doParceiro = doJogador === sorveteAri ? sorveteRenan : sorveteAri;
    const eu = g.playerPosition();
    const ele = g.companionPosition();
    segurarNaEsquerda(doJogador, eu, g.playerFacing());
    segurarNaEsquerda(doParceiro, ele, Math.atan2(eu.x - ele.x, eu.z - ele.z));

    if (sorveteRestante <= 0) {
      sorveteAri.visible = false;
      sorveteRenan.visible = false;
      g.toast('Acabou o sorvete', '🍦');
    }
  });

  w.interact({
    id: 'parque:sorveteria',
    x: 12, z: 20.6, radius: 2.4,
    label: 'Comprar sorvete', icon: '🍦',
    highlight: quiosque,
    onInteract: async (api) => {
      await conversa([
        [A, 'Dois, por favor.'],
        [R, 'Um de morango e um de maracujá.'],
        [A, 'Nunca pedimos diferente.'],
      ]);
      sorveteRestante = 50;
      api.toast('Morango e maracujá', '🍦');
      api.unlock({
        id: 'sorvete-villa',
        title: 'Sorvete no parque',
        place: 'Parque Villa Lobos',
        note: 'Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.',
        icon: '🍦',
      });
    },
  });
}

export function interacaoPiquenique(
  w: WorldBuilder,
  conversa: Conversa,
  mesa: THREE.Object3D,
): void {
  w.interact({
    id: 'parque:piquenique',
    x: -10, z: 21.6, radius: 2.2,
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
}
