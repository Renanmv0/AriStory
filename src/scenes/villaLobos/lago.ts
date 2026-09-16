import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { bush, duck } from '../../world/props';
import { ARI, RENAN } from '../../characters/cast';

/** O lago com os patos boiando, e a conversa de quem pensa em pular nele. */

export function construirLago(w: WorldBuilder): void {
  w.disc(-21, 11, 9.2, P.sand, 0.024); // acima do caminho, que encosta aqui
  w.disc(-21, 11, 8.5, P.water, 0.028);
  w.blockCircle(-21, 11, 8.8);
  const patos = [duck(), duck(0xe8e2d0), duck()];
  patos.forEach((d, i) => {
    w.place(d, -21 + Math.cos(i * 2.1) * 4.5, 0.1, 11 + Math.sin(i * 2.1) * 3.5, i * 1.7);
    w.add(d);
  });
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    w.add(w.place(bush(0.7, P.leafDark), -21 + Math.cos(a) * 9.8, 0, 11 + Math.sin(a) * 9.8));
  }

  w.onUpdate(() => {
    patos.forEach((d, i) => {
      d.position.y = 0.1 + Math.sin(performance.now() / 900 + i) * 0.05;
    });
  });
}

export function interacaoDoLago(w: WorldBuilder): void {
  w.interact({
    id: 'parque:lago',
    x: -13, z: 11, radius: 2.6,
    label: 'Olhar o lago', icon: '🦆',
    onInteract: async (api) => {
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
}
