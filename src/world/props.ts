import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * Kit de cenario ao ar livre. Toda peca volta como um Group com a base em y=0,
 * pronta para `w.add(w.place(bench(), x, 0, z, rot))`.
 * Prefira reaproveitar daqui a modelar coisa nova dentro de uma cena.
 */

export type TreeKind = 'redonda' | 'pinheiro' | 'palmeira' | 'florida';

export function tree(kind: TreeKind = 'redonda', scale = 1, seed = 0.5): THREE.Group {
  const g = new THREE.Group();
  const trunkH = 2.1 * scale;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13 * scale, 0.2 * scale, trunkH, 8),
    toon(P.trunk),
  );
  trunk.position.y = trunkH / 2;
  g.add(trunk);

  if (kind === 'pinheiro') {
    for (let i = 0; i < 3; i++) {
      const r = (1.1 - i * 0.26) * scale;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, 1.3 * scale, 9), toon(i === 0 ? P.leafDark : P.leafMid));
      cone.position.y = trunkH * 0.7 + i * 0.72 * scale;
      g.add(cone);
    }
  } else if (kind === 'palmeira') {
    trunk.scale.y = 1.5;
    trunk.position.y = trunkH * 0.75;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.75 * scale, 8, 6), toon(P.leafMid));
      leaf.scale.set(1.5, 0.14, 0.5);
      leaf.position.set(Math.cos(a) * 0.85 * scale, trunkH * 1.5 - 0.1, Math.sin(a) * 0.85 * scale);
      leaf.rotation.y = -a;
      leaf.rotation.z = -0.32;
      g.add(leaf);
    }
  } else {
    const leafColor = kind === 'florida' ? P.flowerPink : P.leafMid;
    const blobs: Array<[number, number, number, number]> = [
      [0, trunkH + 0.55 * scale, 0, 1.15],
      [0.62 * scale, trunkH + 0.15 * scale, 0.2 * scale, 0.78],
      [-0.5 * scale, trunkH + 0.3 * scale, -0.35 * scale, 0.88],
      [0.1 * scale, trunkH + 1.05 * scale, -0.3 * scale, 0.66],
    ];
    blobs.forEach(([x, y, z, r], i) => {
      const blob = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r * scale, 1),
        toon(i % 2 === 0 ? leafColor : kind === 'florida' ? P.flowerPink : P.leafLight),
      );
      blob.position.set(x, y, z);
      blob.rotation.set(seed * 3, seed * 5, seed * 2);
      g.add(blob);
    });
  }
  return g;
}

export function bush(scale = 1, color: number = P.bush): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 * scale, 1), toon(color));
    b.position.set((i - 1) * 0.36 * scale, 0.3 * scale + (i === 1 ? 0.12 : 0), (i % 2) * 0.18 * scale);
    g.add(b);
  }
  return g;
}

export function flowers(count = 6, radius = 0.9, colors: number[] = [P.flowerPink, P.flowerYellow, 0xffffff]): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + i * 0.7;
    const r = radius * (0.35 + ((i * 37) % 100) / 140);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 5), toon(P.leafDark));
    stem.position.set(Math.cos(a) * r, 0.15, Math.sin(a) * r);
    g.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), toon(colors[i % colors.length]));
    head.position.set(Math.cos(a) * r, 0.33, Math.sin(a) * r);
    head.scale.y = 0.7;
    g.add(head);
  }
  return g;
}

export function rock(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5 * scale, 0), toon(0x9aa0a6));
  r.position.y = 0.3 * scale;
  r.rotation.set(0.4, 0.8, 0.2);
  r.scale.set(1, 0.75, 1.1);
  g.add(r);
  return g;
}

export function bench(color: number = P.wood): THREE.Group {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.55), toon(color));
  seat.position.y = 0.48;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.09), toon(color));
  back.position.set(0, 0.76, -0.25);
  back.rotation.x = -0.16;
  g.add(back);
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.48, 0.5), toon(P.metalGrey));
    leg.position.set(side * 0.78, 0.24, 0);
    g.add(leg);
  }
  return g;
}

export function lamp(lit = false): THREE.Group {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.4, 8), toon(P.metalGrey));
  pole.position.y = 1.7;
  g.add(pole);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62),
    toon(P.metalWhite),
  );
  head.position.y = 3.45;
  head.rotation.x = Math.PI;
  g.add(head);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 10, 8),
    toon(lit ? P.gold : 0xe8e8e0, { glow: lit ? 0.9 : 0 }),
  );
  bulb.position.y = 3.32;
  g.add(bulb);
  return g;
}

export function bin(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.75, 10), toon(0x4f7a4a));
  body.position.y = 0.38;
  g.add(body);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.04, 6, 14), toon(P.metalGrey));
  rim.position.y = 0.76;
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  return g;
}

export function picnicTable(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 1.0), toon(P.wood));
  top.position.y = 0.76;
  g.add(top);
  for (const side of [-1, 1]) {
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.76, 0.9), toon(P.woodDark));
    legs.position.set(side * 0.75, 0.38, 0);
    g.add(legs);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.34), toon(P.wood));
    seat.position.set(0, 0.45, side * 0.78);
    g.add(seat);
    const seatLeg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.08), toon(P.woodDark));
    seatLeg.position.set(0, 0.22, side * 0.78);
    g.add(seatLeg);
  }
  return g;
}

export function fence(length = 4, height = 1.1, color: number = P.metalGrey): THREE.Group {
  const g = new THREE.Group();
  const posts = Math.max(2, Math.round(length / 1.2));
  for (let i = 0; i <= posts; i++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, height, 6), toon(color));
    post.position.set(-length / 2 + (i / posts) * length, height / 2, 0);
    g.add(post);
  }
  for (const y of [height * 0.35, height * 0.8]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.06), toon(color));
    rail.position.y = y;
    g.add(rail);
  }
  return g;
}

export function signBoard(color: number = P.wood, accent: number = P.metalWhite): THREE.Group {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), toon(P.woodDark));
  post.position.y = 0.8;
  g.add(post);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.08), toon(color));
  board.position.y = 1.5;
  g.add(board);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.02), toon(accent));
  stripe.position.set(0, 1.62, 0.05);
  g.add(stripe);
  return g;
}

export function cloud(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const mat = flat(0xffffff, 0.92);
  const parts: Array<[number, number, number, number]> = [
    [0, 0, 0, 1.2],
    [1.1, -0.16, 0.2, 0.85],
    [-1.0, -0.2, -0.1, 0.75],
    [0.4, 0.5, -0.2, 0.7],
  ];
  for (const [x, y, z, r] of parts) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r * scale, 10, 8), mat);
    m.position.set(x * scale, y * scale, z * scale);
    g.add(m);
  }
  return g;
}

export function kiosk(color: number = P.fabricRed): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.7, 1.6), toon(P.wallCream));
  body.position.y = 0.85;
  g.add(body);
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.5), toon(P.wood));
  counter.position.set(0, 1.25, 0.95);
  g.add(counter);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.9, 14, 1, false, 0, Math.PI), toon(color));
  roof.position.set(0, 1.75, 0.35);
  roof.rotation.set(Math.PI / 2, 0, 0);
  roof.scale.set(1, 1, 0.55);
  g.add(roof);
  return g;
}

/** Predio simples de fundo, com janelinhas. */
export function building(
  width = 4,
  height = 6,
  depth = 4,
  wall: number = P.wallCream,
  roof: number = P.roofTile,
  windowColor: number = P.glass,
): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), toon(wall));
  body.position.y = height / 2;
  g.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.35, depth + 0.3), toon(roof));
  top.position.y = height + 0.17;
  g.add(top);

  const cols = Math.max(1, Math.floor(width / 1.4));
  const rows = Math.max(1, Math.floor(height / 1.6));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.06), toon(windowColor, { glow: 0.15 }));
      const x = -width / 2 + (width / cols) * (c + 0.5);
      const y = 0.9 + (height / rows) * r;
      win.position.set(x, y, depth / 2 + 0.02);
      g.add(win);
      const back = win.clone();
      back.position.z = -depth / 2 - 0.02;
      g.add(back);
    }
  }
  return g;
}

/** Frisbee: usado como prop parado e como projetil no minigame. */
export function frisbee(color: number = P.frisbee): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.07, 20), toon(color));
  mesh.castShadow = true;
  return mesh;
}

/** Coracaozinho flutuante, para recompensas e momentos fofos. */
export function heart(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(P.heart, { glow: 0.35 });
  for (const side of [-1, 1]) {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.16 * scale, 10, 8), mat);
    lobe.position.set(side * 0.13 * scale, 0.1 * scale, 0);
    g.add(lobe);
  }
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22 * scale, 0.34 * scale, 10), mat);
  tip.position.y = -0.1 * scale;
  tip.rotation.x = Math.PI;
  g.add(tip);
  return g;
}

/** Patinho de lago, com corpo que boia. */
export function duck(color = 0xf6f2e8): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), toon(color));
  body.scale.set(1.3, 0.85, 1);
  body.position.y = 0.12;
  g.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.24, 8), toon(color));
  neck.position.set(0, 0.28, 0.14);
  g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), toon(color));
  head.position.set(0, 0.4, 0.16);
  g.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), toon(P.gold));
  beak.position.set(0, 0.39, 0.28);
  beak.rotation.x = Math.PI / 2;
  g.add(beak);
  return g;
}

/** Cone laranja: marca o campinho, a quadra, a obra. */
export function cone(): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.34), toon(P.frisbee));
  base.position.y = 0.025;
  g.add(base);
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.45, 10), toon(P.frisbee));
  body.position.y = 0.26;
  g.add(body);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.09, 10), toon(0xffffff));
  stripe.position.y = 0.28;
  g.add(stripe);
  return g;
}

/**
 * Casco da piscina: fundo e as quatro paredes internas. Deve ser usado junto
 * de `w.groundWithHoles()`, senao o piso tapa o buraco.
 */
export function poolShell(width: number, depth: number, fundo = 1.5): THREE.Group {
  const g = new THREE.Group();
  const azulejo = toon(0x9fd8e8);
  const esp = 0.12;

  const chao = new THREE.Mesh(new THREE.BoxGeometry(width, esp, depth), toon(0x3f8fb0));
  chao.position.y = -fundo;
  chao.receiveShadow = true;
  g.add(chao);

  for (const [w2, d2, x, z] of [
    [width, esp, 0, -depth / 2],
    [width, esp, 0, depth / 2],
    [esp, depth, -width / 2, 0],
    [esp, depth, width / 2, 0],
  ] as const) {
    const parede = new THREE.Mesh(new THREE.BoxGeometry(w2, fundo, d2), azulejo);
    parede.position.set(x, -fundo / 2, z);
    parede.receiveShadow = true;
    g.add(parede);
  }

  // faixa escura da borda, como azulejo de piscina de clube
  for (const [w2, d2, x, z] of [
    [width + 0.3, 0.18, 0, -depth / 2 - 0.12],
    [width + 0.3, 0.18, 0, depth / 2 + 0.12],
    [0.18, depth + 0.3, -width / 2 - 0.12, 0],
    [0.18, depth + 0.3, width / 2 + 0.12, 0],
  ] as const) {
    const faixa = new THREE.Mesh(new THREE.BoxGeometry(w2, 0.06, d2), toon(0x4b8fb5));
    faixa.position.set(x, 0.02, z);
    g.add(faixa);
  }
  return g;
}

/** Superficie da agua. Transparente para dar pra ver quem esta nadando. */
export function poolWater(width: number, depth: number): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth, 12, 8),
    new THREE.MeshToonMaterial({ color: 0x5fc4e0, transparent: true, opacity: 0.62 }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.12;
  return mesh;
}

export function sunLounger(cor: number = P.fabricBlue): THREE.Group {
  const g = new THREE.Group();
  const quadro = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 1.7), toon(P.metalWhite));
  quadro.position.y = 0.36;
  g.add(quadro);
  const tecido = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 1.5), toon(cor));
  tecido.position.y = 0.42;
  g.add(tecido);
  const encosto = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.7), toon(cor));
  encosto.position.set(0, 0.6, -0.75);
  encosto.rotation.x = -0.75;
  g.add(encosto);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.36, 6), toon(P.metalWhite));
    pe.position.set(x * 0.3, 0.18, z * 0.72);
    g.add(pe);
  }
  return g;
}

export function parasol(cor: number = P.fabricRed): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.12, 12), toon(P.concrete));
  base.position.y = 0.06;
  g.add(base);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.4, 8), toon(P.wood));
  haste.position.y = 1.2;
  g.add(haste);
  const lona = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.5, 12), toon(cor));
  lona.position.y = 2.35;
  g.add(lona);
  const listra = new THREE.Mesh(new THREE.ConeGeometry(1.17, 0.18, 12, 1, true), toon(0xffffff, { doubleSide: true }));
  listra.position.y = 2.2;
  g.add(listra);
  const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), toon(P.gold));
  ponta.position.y = 2.62;
  g.add(ponta);
  return g;
}

export function poolLadder(): THREE.Group {
  const g = new THREE.Group();
  for (const x of [-0.24, 0.24]) {
    const corrimao = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 6, 14, Math.PI), toon(P.metalGrey));
    corrimao.position.set(x, 0.72, -0.22);
    corrimao.rotation.set(0, Math.PI / 2, 0);
    g.add(corrimao);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.5, 8), toon(P.metalGrey));
    haste.position.set(x, 0.05, -0.44);
    g.add(haste);
  }
  for (let i = 0; i < 3; i++) {
    const degrau = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.1), toon(P.metalGrey));
    degrau.position.set(0, -0.15 - i * 0.34, -0.44);
    g.add(degrau);
  }
  return g;
}

/** Boia que fica boiando na agua (anime o y com w.onUpdate). */
export function floatRing(cor: number = P.frisbee): THREE.Group {
  const g = new THREE.Group();
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.16, 10, 20), toon(cor));
  anel.rotation.x = Math.PI / 2;
  g.add(anel);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const listra = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.165, 10, 6, Math.PI / 5), toon(0xffffff));
    listra.rotation.set(Math.PI / 2, 0, a);
    g.add(listra);
  }
  return g;
}

export function showerPost(): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.1, 12), toon(P.concrete));
  base.position.y = 0.05;
  g.add(base);
  const cano = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), toon(P.metalGrey));
  cano.position.y = 1.1;
  g.add(cano);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.07), toon(P.metalGrey));
  braco.position.set(0.22, 2.16, 0);
  g.add(braco);
  const crivo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.1, 12), toon(P.metalWhite));
  crivo.position.set(0.44, 2.08, 0);
  g.add(crivo);
  return g;
}

/** Trampolim baixo da beira da piscina. */
export function divingBoard(): THREE.Group {
  const g = new THREE.Group();
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), toon(P.concrete));
  pedestal.position.y = 0.4;
  g.add(pedestal);
  const prancha = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 2.4), toon(0xf0f4f6));
  prancha.position.set(0, 0.85, 1.0);
  g.add(prancha);
  for (const x of [-0.36, 0.36]) {
    const corrimao = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.04, 6, 14, Math.PI), toon(P.metalGrey));
    corrimao.position.set(x, 0.9, 0.1);
    corrimao.rotation.set(0, Math.PI / 2, 0);
    g.add(corrimao);
  }
  return g;
}

/** Casquinha de sorvete. Use w.onUpdate + a posicao da mao para "entregar". */
export function iceCream(sabor: number = P.flowerPink): THREE.Group {
  const g = new THREE.Group();
  const casquinha = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.22, 10), toon(0xd8a45c));
  casquinha.position.y = -0.02;
  casquinha.rotation.x = Math.PI;
  g.add(casquinha);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), toon(sabor));
  bola.position.y = 0.13;
  g.add(bola);
  const bolinha = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 7), toon(sabor));
  bolinha.position.set(0.03, 0.22, -0.02);
  g.add(bolinha);
  return g;
}
