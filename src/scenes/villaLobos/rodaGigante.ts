import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { FerrisWheel } from '../../world/ferrisWheel';
import { fence, kiosk } from '../../world/props';
import { A, R, type Conversa } from './comum';

/**
 * A roda gigante: a praca com o tapume e o domo, a bilheteria, e o passeio —
 * os dois na mesma cabine, com a camera colada nela.
 */

export interface RodaGigante {
  wheel: FerrisWheel;
  bilheteria: THREE.Object3D;
}

export function construirRodaGigante(w: WorldBuilder): RodaGigante {
  const wheel = new FerrisWheel({ radius: 12, cabins: 32, rpm: 1.0 });
  w.place(wheel.group, 0, 0, -26);
  w.add(wheel.group);
  w.blockCircle(0, -26, 7.2);

  // tapume e domo geodesico da praca da roda, como na foto
  for (const x of [-11, 11]) {
    w.add(w.place(fence(9, 1.2, P.metalWhite), x, 0, -20, Math.PI / 2));
    w.blockBox(x, -20, 0.2, 4.5);
  }
  const domo = new THREE.Group();
  const cupula = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 14, 9, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshToonMaterial({ color: 0xdff2fb, transparent: true, opacity: 0.82 }),
  );
  domo.add(cupula);
  // aro na base e meridianos: sem eles a cúpula translúcida lia como bolha
  const aro = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.09, 6, 24), toon(P.metalWhite));
  aro.rotation.x = Math.PI / 2;
  aro.position.y = 0.05;
  domo.add(aro);
  for (let i = 0; i < 6; i++) {
    const meridiano = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.05, 5, 18, Math.PI),
      toon(P.metalWhite),
    );
    meridiano.rotation.set(0, (i / 6) * Math.PI, 0);
    domo.add(meridiano);
  }
  w.place(domo, -9.5, 0, -21);
  w.add(domo);
  w.blockCircle(-9.5, -21, 2.6);

  const bilheteria = w.add(w.place(kiosk(P.fabricBlue), 9.5, 0, -20.5, Math.PI));
  w.blockBox(9.5, -20.5, 1.3, 0.9);

  return { wheel, bilheteria };
}

export function interacaoBilheteria(
  w: WorldBuilder,
  conversa: Conversa,
  bilheteria: THREE.Object3D,
): void {
  w.interact({
    id: 'parque:bilheteria',
    x: 9.5, z: -19, radius: 2.2,
    label: 'Bilheteria', icon: '🎟️',
    highlight: bilheteria,
    onInteract: () =>
      conversa([
        [A, 'Dois pra roda gigante.'],
        [R, 'Sempre dois.'],
      ]),
  });
}

/**
 * Liga o giro, o zoom de perto e a cutscene do passeio.
 * Registra o ULTIMO w.onUpdate da cena: e ele quem manda no zoom perto da roda,
 * e precisa rodar depois do frisbee, que tambem mexe no zoom.
 */
export function ligarRodaGigante(w: WorldBuilder, conversa: Conversa, wheel: FerrisWheel): void {
  const g = w.game;

  let voltaAtual: { resolve: () => void; de: number; voltas: number } | null = null;
  const esperarVoltas = (voltas: number): Promise<void> =>
    new Promise((resolve) => {
      voltaAtual = { resolve, de: wheel.angle, voltas };
    });

  // perto da roda a camera abre, para caber a coisa toda na tela
  let zoomLivre = true;
  w.onUpdate((dt) => {
    wheel.update(dt);
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
  });

  w.interact({
    id: 'parque:roda-gigante',
    x: 0, z: -18.6, radius: 3,
    label: 'Andar na roda gigante', icon: '🎡',
    onInteract: async (api) => {
      zoomLivre = false;
      api.lockPlayer(true);
      await conversa([
        [R, 'A fila tá curta hoje.'],
        [A, 'Bora subir?'],
      ]);

      const cabine = wheel.boardingCabin();
      const velocidade = wheel.speed;
      wheel.speed = velocidade * 5; // a volta cenica dura ~12s, nao um minuto
      // os dois entram na mesma cabine, um de cada lado
      api.ridePlayer(cabine, new THREE.Vector3(-0.3, -0.34, 0), 0.55);
      api.rideCompanion(cabine, new THREE.Vector3(0.3, -0.34, 0), 0.55);
      api.focusCamera(cabine);
      api.setZoom(38);

      await esperarVoltas(0.25);
      await conversa([
        [A, 'Daqui dá pra ver o parque inteiro.'],
        [R, 'E aquele pedacinho do rio ali atrás.'],
      ]);
      await esperarVoltas(0.35);
      await conversa([
        [A, 'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],
        [R, 'Pronto. Subimos.'],
      ]);
      await esperarVoltas(0.4);

      wheel.speed = velocidade;
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
}
