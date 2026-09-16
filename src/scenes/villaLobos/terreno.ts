import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { building, bush, cloud, flowers, rock, tree } from '../../world/props';
import { KINDS } from './comum';

/**
 * O parque em volta: chao, caminhos, vegetacao, horizonte e ceu.
 *
 * ATENCAO: tudo aqui consome o sorteio deterministico do WorldBuilder
 * (w.range/w.rng/w.pick). Trocar a ordem destas quatro funcoes, ou a ordem dos
 * sorteios dentro delas, reposiciona TODAS as arvores, predios e nuvens.
 * As manchas de chao (w.disc/w.patch) tambem contam: cada uma pega um
 * polygonOffset proprio na ordem em que e criada.
 */

/** Grama, pracas e caminhos. Primeira coisa a ser construida. */
export function terreno(w: WorldBuilder): void {
  w.ground({ width: 240, depth: 240, color: P.grass });
  w.setBounds(-44, -34, 44, 32);

  // Ordem de empilhamento do chão. Cada decalque também recebe um
  // polygonOffset próprio do WorldBuilder, então a altura aqui é só folga.
  for (let i = 0; i < 14; i++) {
    w.disc(w.range(-40, 40), w.range(-30, 30), w.range(2, 6), P.grassDark, 0.004);
  }
  w.disc(0, -16.5, 8.6, P.sand, 0.008); // borda da praça
  w.disc(0, -16.5, 8, P.concrete, 0.012); // praça
  w.patch(0, 4, 5.5, 56, P.asphalt, 0, 0.016); // caminho principal
  w.patch(0, 9, 62, 4.5, P.asphalt, 0, 0.02); // caminho transversal
}

/** Arvores, flores, arbustos e pedras espalhados pela area jogavel. */
export function vegetacao(w: WorldBuilder): void {
  const proibido: Array<[number, number, number]> = [
    [0, -26, 20], [-21, 11, 12], [18, -4.5, 17], [0, 4, 6], [0, 9, 6],
    [12, 19, 4], [-10, 20, 3], [37, 13, 8],
  ];
  const livre = (x: number, z: number): boolean => {
    if (Math.abs(x) < 4 && z > -20 && z < 30) return false;
    return !proibido.some(([px, pz, r]) => Math.hypot(x - px, z - pz) < r);
  };

  let plantadas = 0;
  for (let i = 0; i < 260 && plantadas < 64; i++) {
    const x = w.range(-42, 42);
    const z = w.range(-32, 30);
    if (!livre(x, z)) continue;
    const scale = w.range(0.85, 1.5);
    w.add(w.place(tree(w.pick(KINDS), scale, w.rng()), x, 0, z, w.range(0, 6.28)));
    w.blockCircle(x, z, 0.45 * scale);
    plantadas++;
  }
  for (let i = 0; i < 90; i++) {
    const x = w.range(-42, 42);
    const z = w.range(-32, 30);
    if (!livre(x, z)) continue;
    if (i % 3 === 0) w.add(w.place(flowers(6, 1.1), x, 0, z));
    else if (i % 3 === 1) w.add(w.place(bush(w.range(0.7, 1.2)), x, 0, z));
    else w.add(w.place(rock(w.range(0.5, 1)), x, 0, z));
  }
}

/** O rio, os predios e a mata que aparecem quando a roda gigante sobe. */
export function horizonte(w: WorldBuilder): void {
  w.patch(-66, -10, 18, 220, P.water, 0, 0.02);
  w.patch(-55, -10, 6, 220, P.concrete, 0, 0.03);

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
    w.add(w.place(tree(w.pick(KINDS), w.range(1.2, 2.2), w.rng()), x, 0, z, w.range(0, 6.28)));
  }
}

/** Nuvens altas, com deriva lenta. */
export function ceu(w: WorldBuilder): void {
  for (let i = 0; i < 9; i++) {
    const c = cloud(w.range(1.6, 3.2));
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
}
