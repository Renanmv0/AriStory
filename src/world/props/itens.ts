import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';

/**
 * Coisas pequenas, seguradas na mao ou flutuando: frisbee, coracao, sorvete.
 */

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
