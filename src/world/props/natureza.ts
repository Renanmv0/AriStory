import * as THREE from 'three';
import { toon, flat } from '../../core/materials';
import { PALETTE as P } from '../../palette';

/**
 * Natureza e ceu: arvore, arbusto, flores, pedra, pato, nuvem.
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
