import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';

/**
 * Piscina e beira d'agua: casco, agua, escada, trampolim, ducha, boia,
 * espreguicadeira, guarda-sol. Serve tambem para cenario de praia.
 */

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
