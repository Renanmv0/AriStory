import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import {
  bleachers, cone, discBag, discGolfBasket, fence, floodlight, scoreboard,
  textSign, waterFountain, windsock,
} from '../../world/props';
import { A, QUADRA, R, qx0, qx1, qz0, qz1, type Conversa } from './comum';

/**
 * A quadra de frisbee: as linhas pintadas, o alambrado com o vao de entrada, as
 * cestas, e o mobiliario em volta. O jogo do disco em si mora em frisbeeJogo.ts.
 */

export interface Quadra {
  cestaLeste: THREE.Object3D;
  placar: THREE.Object3D;
  arquibancada: THREE.Object3D;
  bebedouro: THREE.Object3D;
  sacola: THREE.Object3D;
  biruta: THREE.Object3D;
  placaCampinho: THREE.Object3D;
}

export function construirQuadra(w: WorldBuilder): Quadra {
  // grama aparada e as linhas pintadas
  w.patch(QUADRA.x, QUADRA.z, QUADRA.largura, QUADRA.profundidade, P.grassDark, 0, 0.008);
  const linha = (x: number, z: number, larg: number, prof: number): void => {
    w.patch(x, z, larg, prof, 0xf2f4f0, 0, 0.012);
  };
  linha(QUADRA.x, qz0 + 0.3, QUADRA.largura - 1.2, 0.28);
  linha(QUADRA.x, qz1 - 0.3, QUADRA.largura - 1.2, 0.28);
  linha(qx0 + 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
  linha(qx1 - 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
  linha(QUADRA.x, QUADRA.z, 0.28, QUADRA.profundidade - 0.6); // meio
  linha(qx0 + 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6); // zonas de fundo
  linha(qx1 - 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6);
  w.disc(QUADRA.x, QUADRA.z, 2.2, 0xf2f4f0, 0.011);
  w.disc(QUADRA.x, QUADRA.z, 1.9, P.grassDark, 0.012);

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

  return { cestaLeste, placar, arquibancada, bebedouro, sacola, biruta, placaCampinho };
}

export function interacoesDaQuadra(w: WorldBuilder, conversa: Conversa, q: Quadra): void {
  const { cestaLeste, placar, arquibancada, bebedouro, sacola, biruta, placaCampinho } = q;

  w.interact({
    id: 'parque:placa-quadra',
    x: qx0 - 1.8, z: QUADRA.z + 4.8, radius: 2.2,
    label: 'Ler a placa', icon: '🪧',
    highlight: placaCampinho,
    onInteract: () =>
      conversa([
        [R, 'QUADRA LIVRE — respeite quem chegou primeiro.'],
        [A, 'Hoje só tem a gente.'],
        [R, 'Então segura o F e manda ver. Quanto mais tempo segurar, mais longe vai.'],
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
      return conversa([
        [A, recorde > 0 ? `Nosso recorde é ${recorde} trocas seguidas.` : 'O placar tá zerado.'],
        [R, total > 0 ? `E já foram ${total} no total. A gente não desiste fácil.` : 'Bora estrear isso então.'],
      ]);
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
}
