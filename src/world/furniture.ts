import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * Kit de interiores. Mesma convencao dos props: Group com base em y=0.
 */

export function rug(width = 3, depth = 2.2, color: number = P.rug): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), toon(color));
  m.position.y = 0.02;
  m.receiveShadow = true;
  return m;
}

export function sofa(color: number = P.sofa, width = 2.2): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(width, 0.42, 0.9), toon(color));
  base.position.y = 0.28;
  g.add(base);
  const back = new THREE.Mesh(new THREE.BoxGeometry(width, 0.62, 0.24), toon(color));
  back.position.set(0, 0.72, -0.35);
  g.add(back);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 0.9), toon(color));
    arm.position.set(side * (width / 2 - 0.12), 0.62, 0);
    g.add(arm);
  }
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.14, 6), toon(P.woodDark));
    foot.position.set(x * (width / 2 - 0.2), 0.07, z * 0.34);
    g.add(foot);
  }
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.34), toon(P.flowerPink));
  cushion.position.set(width / 2 - 0.5, 0.55, -0.14);
  cushion.rotation.set(0.9, 0.4, 0);
  g.add(cushion);
  return g;
}

export function coffeeTable(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.7), toon(P.wood));
  top.position.y = 0.46;
  g.add(top);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.46, 6), toon(P.woodDark));
    leg.position.set(x * 0.5, 0.23, z * 0.27);
    g.add(leg);
  }
  return g;
}

export function tvSet(on = false): THREE.Group {
  const g = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.45), toon(P.woodDark));
  stand.position.y = 0.25;
  g.add(stand);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.08), toon(0x1f2229));
  panel.position.y = 0.95;
  g.add(panel);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.36, 0.72),
    flat(on ? 0x8fd7ff : P.screen, 1),
  );
  screen.name = 'tela'; // a cena troca o material desta malha para ligar a TV
  screen.position.set(0, 0.95, 0.05);
  g.add(screen);
  return g;
}

export function bookshelf(height = 2.1, width = 1.2): THREE.Group {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.32), toon(P.woodDark));
  frame.position.y = height / 2;
  g.add(frame);
  const shelves = Math.max(2, Math.floor(height / 0.5));
  const colors = [0xd9603f, 0x4a7fe0, 0xffc94d, 0x5cb04f, 0xff8fb1];
  for (let s = 1; s < shelves; s++) {
    const y = (height / shelves) * s;
    for (let b = 0; b < 5; b++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.3 + (b % 3) * 0.05, 0.2),
        toon(colors[(s + b) % colors.length]),
      );
      book.position.set(-width / 2 + 0.18 + b * 0.13, y + 0.16, 0.06);
      book.rotation.z = b === 4 ? 0.2 : 0;
      g.add(book);
    }
  }
  return g;
}

export function bed(color: number = P.fabricBlue): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 2.1), toon(P.woodDark));
  base.position.y = 0.2;
  g.add(base);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.24, 2.0), toon(0xf6f2e8));
  mattress.position.y = 0.49;
  g.add(mattress);
  const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 1.35), toon(color));
  duvet.position.set(0, 0.62, 0.3);
  g.add(duvet);
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 0.4), toon(0xffffff));
  pillow.position.set(0, 0.66, -0.72);
  g.add(pillow);
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.7, 0.12), toon(P.wood));
  head.position.set(0, 0.6, -1.06);
  g.add(head);
  return g;
}

export function desk(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.7), toon(P.wood));
  top.position.y = 0.74;
  g.add(top);
  for (const x of [-0.72, 0.72]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 0.66), toon(P.woodDark));
    leg.position.set(x, 0.37, 0);
    g.add(leg);
  }
  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.06), toon(0x2b2f38));
  monitor.position.set(0, 1.08, -0.18);
  g.add(monitor);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.42), flat(0x9fd8ff));
  glow.position.set(0, 1.08, -0.14);
  g.add(glow);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.24, 8), toon(0x2b2f38));
  stand.position.set(0, 0.86, -0.18);
  g.add(stand);
  return g;
}

export function chair(color: number = P.wood): THREE.Group {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), toon(color));
  seat.position.y = 0.46;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.07), toon(color));
  back.position.set(0, 0.75, -0.22);
  g.add(back);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.06), toon(P.woodDark));
    leg.position.set(x * 0.2, 0.23, z * 0.2);
    g.add(leg);
  }
  return g;
}

export function counter(width = 2.4): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.65), toon(P.wallMint));
  body.position.y = 0.45;
  g.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.08, 0.72), toon(P.concrete));
  top.position.y = 0.94;
  g.add(top);
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.4), toon(P.metalWhite));
  sink.position.set(width / 2 - 0.55, 0.97, 0);
  g.add(sink);
  return g;
}

export function fridge(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.7), toon(P.metalWhite));
  body.position.y = 0.9;
  g.add(body);
  const split = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.03, 0.72), toon(P.metalGrey));
  split.position.y = 1.25;
  g.add(split);
  for (const y of [0.7, 1.45]) {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), toon(P.metalGrey));
    handle.position.set(0.3, y, 0.37);
    g.add(handle);
  }
  return g;
}

export function pottedPlant(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.17 * scale, 0.34 * scale, 10), toon(P.plantPot));
  pot.position.y = 0.17 * scale;
  g.add(pot);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2 * scale, 8, 6), toon(i % 2 ? P.leafMid : P.leafLight));
    leaf.scale.set(0.5, 1.5, 0.5);
    leaf.position.set(Math.cos(a) * 0.12 * scale, 0.6 * scale, Math.sin(a) * 0.12 * scale);
    leaf.rotation.z = Math.cos(a) * 0.4;
    leaf.rotation.x = -Math.sin(a) * 0.4;
    g.add(leaf);
  }
  return g;
}

/** Quadro na parede: monte com a cor que quiser e pendure com w.place(). */
export function pictureFrame(width = 0.7, height = 0.55, art: number = P.skyDusk): THREE.Group {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.05), toon(P.woodDark));
  g.add(frame);
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.1, height - 0.1), flat(art));
  canvas.position.z = 0.03;
  g.add(canvas);
  return g;
}

/** Janela vazada numa parede: moldura + vidro translucido. */
export function windowFrame(width = 1.2, height = 1.2): THREE.Group {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(width, height), flat(P.glass, 0.55));
  g.add(glass);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.08, 0.08), toon(P.metalWhite));
  bar.position.y = height / 2;
  g.add(bar);
  const bar2 = bar.clone();
  bar2.position.y = -height / 2;
  g.add(bar2);
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 0.08), toon(P.metalWhite));
    post.position.x = (side * width) / 2;
    g.add(post);
  }
  return g;
}

export function mug(color = 0xffffff): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.13, 10), toon(color));
  body.position.y = 0.065;
  g.add(body);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 6, 12), toon(color));
  handle.position.set(0.08, 0.07, 0);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);
  return g;
}

export function diningTable(width = 1.5, depth = 0.9): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.09, depth), toon(P.wood));
  top.position.y = 0.75;
  g.add(top);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), toon(P.woodDark));
    leg.position.set(x * (width / 2 - 0.14), 0.37, z * (depth / 2 - 0.14));
    g.add(leg);
  }
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 10), toon(P.wallMint));
  vaso.position.y = 0.87;
  g.add(vaso);
  for (const side of [-1, 1]) {
    const flor = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), toon(side < 0 ? P.flowerPink : P.flowerYellow));
    flor.position.set(side * 0.05, 1.03, 0);
    g.add(flor);
  }
  return g;
}

export function floorLamp(lit = true): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.06, 12), toon(P.woodDark));
  base.position.y = 0.03;
  g.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), toon(P.metalGrey));
  pole.position.y = 0.78;
  g.add(pole);
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.3, 0.34, 14, 1, true),
    toon(lit ? 0xfff0cc : 0xe6ded0, { glow: lit ? 0.5 : 0, doubleSide: true }),
  );
  shade.position.y = 1.68;
  g.add(shade);
  return g;
}

/** Prateleira de parede: pendure com w.place(shelf(), x, altura, z, rot). */
export function wallShelf(width = 1.1): THREE.Group {
  const g = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, 0.06, 0.24), toon(P.wood));
  g.add(board);
  const cores = [0xd9603f, 0x5cb04f, 0xffc94d];
  for (let i = 0; i < 3; i++) {
    const item = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.16), toon(cores[i]));
    item.position.set(-width / 2 + 0.2 + i * 0.16, 0.15, 0);
    g.add(item);
  }
  const planta = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), toon(P.leafMid));
  planta.position.set(width / 2 - 0.22, 0.16, 0);
  planta.scale.y = 0.8;
  g.add(planta);
  return g;
}

/** Armario aereo da cozinha. */
export function upperCabinets(width = 2.0): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.6, 0.34), toon(P.wallCream));
  g.add(body);
  for (const side of [-1, 1]) {
    const puxador = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.04), toon(P.metalGrey));
    puxador.position.set(side * width * 0.22, -0.18, 0.19);
    g.add(puxador);
  }
  return g;
}

export function washingMachine(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.9, 0.64), toon(P.metalWhite));
  corpo.position.y = 0.45;
  g.add(corpo);
  const porta = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), toon(0x9fb6c4));
  porta.position.set(0, 0.5, 0.33);
  porta.rotation.x = Math.PI / 2;
  g.add(porta);
  const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16), toon(0x3b4650));
  vidro.position.set(0, 0.5, 0.36);
  vidro.rotation.x = Math.PI / 2;
  g.add(vidro);
  const painel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.03), toon(0xdfe4e8));
  painel.position.set(0, 0.82, 0.33);
  g.add(painel);
  for (const x of [-0.2, 0, 0.2]) {
    const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8), toon(P.metalGrey));
    botao.position.set(x, 0.82, 0.36);
    botao.rotation.x = Math.PI / 2;
    g.add(botao);
  }
  return g;
}

/** Porta com batente. Encaixe num vao de parede com w.place(). */
/**
 * Porta com batente, para encaixar num vão de parede.
 *
 * `profundidade` é a espessura do batente: mantenha MENOR que a espessura da
 * parede (0.3 no `w.wall`) e centre a porta na linha da parede. Batente com a
 * mesma espessura da parede deixa as faces coplanares e elas piscam.
 */
export function interiorDoor(
  cor: number = P.wood,
  largura = 0.9,
  altura = 2.1,
  profundidade = 0.24,
): THREE.Group {
  const g = new THREE.Group();
  const folha = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.08), toon(cor));
  folha.position.y = altura / 2;
  g.add(folha);
  for (const side of [-1, 1]) {
    const batente = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, altura + 0.1, profundidade),
      toon(P.woodDark),
    );
    batente.position.set((side * (largura + 0.09)) / 2, (altura + 0.1) / 2, 0);
    g.add(batente);
  }
  const verga = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.2, 0.1, profundidade),
    toon(P.woodDark),
  );
  verga.position.y = altura + 0.05;
  g.add(verga);
  const maca = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), toon(P.gold, { glow: 0.15 }));
  maca.position.set(largura / 2 - 0.14, altura * 0.45, 0.07);
  g.add(maca);
  return g;
}

/** Criado-mudo com abajur. */
export function nightstand(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 0.4), toon(P.wood));
  corpo.position.y = 0.25;
  g.add(corpo);
  const gaveta = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.03), toon(P.woodDark));
  gaveta.position.set(0, 0.32, 0.21);
  g.add(gaveta);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.16, 8), toon(P.metalGrey));
  base.position.y = 0.58;
  g.add(base);
  const cupula = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.15, 0.18, 12, 1, true),
    toon(0xfff0cc, { glow: 0.45, doubleSide: true }),
  );
  cupula.position.y = 0.75;
  g.add(cupula);
  return g;
}
