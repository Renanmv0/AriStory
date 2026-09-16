import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';

/**
 * Rua e transporte: onibus, ponto de onibus.
 */

/** Ônibus urbano parado no ponto. */
export function bus(cor: number = 0x3f7fd6): THREE.Group {
  const g = new THREE.Group();
  const comp = 8.4;
  const alt = 2.6;
  const larg = 2.5;

  const corpo = new THREE.Mesh(new THREE.BoxGeometry(comp, alt, larg), toon(cor));
  corpo.position.y = 1.55;
  g.add(corpo);

  const teto = new THREE.Mesh(new THREE.BoxGeometry(comp - 0.2, 0.22, larg - 0.15), toon(P.metalWhite));
  teto.position.y = 2.9;
  g.add(teto);

  const faixa = new THREE.Mesh(new THREE.BoxGeometry(comp + 0.04, 0.3, larg + 0.04), toon(P.metalWhite));
  faixa.position.y = 0.6;
  g.add(faixa);

  // janelas dos dois lados
  for (const z of [larg / 2 + 0.02, -larg / 2 - 0.02]) {
    for (let i = 0; i < 4; i++) {
      const janela = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.05), toon(P.glass, { glow: 0.12 }));
      janela.position.set(-comp / 2 + 1.4 + i * 1.85, 2.1, z);
      g.add(janela);
    }
  }

  // para-brisa e traseira
  for (const [x, rot] of [[comp / 2 + 0.02, 0], [-comp / 2 - 0.02, 0]] as const) {
    const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, larg - 0.5), toon(P.glass, { glow: 0.12 }));
    vidro.position.set(x, 2.1, 0);
    vidro.rotation.y = rot;
    g.add(vidro);
  }

  // porta sanfonada
  const porta = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.9, 1.0), toon(0x2b3440));
  porta.position.set(comp / 2 - 1.6, 1.2, larg / 2 + 0.02);
  g.add(porta);

  // letreiro de destino
  const letreiro = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.34, 0.05), toon(0x1f2229));
  letreiro.position.set(comp / 2 - 0.4, 2.75, larg / 2 + 0.02);
  g.add(letreiro);

  for (const [x, z] of [[comp / 2 - 1.9, larg / 2], [comp / 2 - 1.9, -larg / 2], [-comp / 2 + 1.6, larg / 2], [-comp / 2 + 1.6, -larg / 2]] as const) {
    const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 14), toon(0x22242a));
    roda.position.set(x, 0.5, z);
    roda.rotation.x = Math.PI / 2;
    g.add(roda);
    const calota = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.38, 12), toon(P.metalGrey));
    calota.position.set(x, 0.5, z);
    calota.rotation.x = Math.PI / 2;
    g.add(calota);
  }
  return g;
}

/** Ponto de ônibus com cobertura e banco. */
export function busStop(cor: number = P.metalGrey): THREE.Group {
  const g = new THREE.Group();
  for (const x of [-1.5, 1.5]) {
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.5, 8), toon(cor));
    poste.position.set(x, 1.25, -0.6);
    g.add(poste);
  }
  const cobertura = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 1.6), toon(cor));
  cobertura.position.set(0, 2.5, -0.2);
  cobertura.rotation.x = -0.06;
  g.add(cobertura);
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 0.08), toon(P.glass, { glow: 0.08 }));
  fundo.position.set(0, 1.35, -1.15);
  g.add(fundo);
  const banco = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 0.4), toon(P.wood));
  banco.position.set(0, 0.5, -0.9);
  g.add(banco);
  for (const x of [-1.2, 1.2]) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.36), toon(cor));
    pe.position.set(x, 0.25, -0.9);
    g.add(pe);
  }
  return g;
}

