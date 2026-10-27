import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';

/*
 * O BALDE DE PIPOCA do filme de terror no sofá (`docs/HALLOWEEN.md`, §2.1:
 * "luz apagada, pipoca no colo"). O balde de cinema, de listras vermelhas e
 * brancas, mais largo em cima, com a borda virada — e a pipoca transbordando
 * num monte, cada pipoca um caroço amassado, a clara e a de manteiga.
 *
 * Base em `y = 0`, de pé. As listras são um canvas no `u` do cilindro; a
 * pipoca é UM lote (`InstancedMesh`) com a cor por cópia.
 */

let listras: THREE.CanvasTexture | null = null;

/** as listras do balde: brancas por baixo do vermelho do material */
function texturaDeListras(): THREE.CanvasTexture {
  if (listras) return listras;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const c = canvas.getContext('2d');
  if (c) {
    // o material é BRANCO: a tinta vermelha é do desenho (o toon multiplica)
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, 256, 64);
    const vermelho = `#${P.baldeDePipocaVermelho.toString(16).padStart(6, '0')}`;
    c.fillStyle = vermelho;
    for (let i = 0; i < 10; i++) c.fillRect(i * 25.6, 0, 12.8, 64);
  }
  listras = new THREE.CanvasTexture(canvas);
  listras.colorSpace = THREE.SRGBColorSpace;
  listras.wrapS = THREE.RepeatWrapping;
  return listras;
}

export function baldeDePipoca(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balde-de-pipoca';
  const ALTO = 0.22;
  const R_BAIXO = 0.075;
  const R_CIMA = 0.11;

  // o corpo, torneado: o fundo e a parede abrindo, sem tampa em cima
  const parede = new THREE.Mesh(
    new THREE.CylinderGeometry(R_CIMA, R_BAIXO, ALTO, 20, 1, true),
    toon(P.baldeDePipocaBranco, { mapa: texturaDeListras(), doubleSide: true }),
  );
  parede.position.y = ALTO / 2;
  g.add(parede);
  const fundo = new THREE.Mesh(new THREE.CircleGeometry(R_BAIXO, 20), toon(P.baldeDePipocaVermelho));
  fundo.rotation.x = -Math.PI / 2;
  fundo.position.y = 0.002;
  g.add(fundo);
  // a borda virada, branca
  const borda = new THREE.Mesh(new THREE.TorusGeometry(R_CIMA, 0.008, 6, 24), toon(P.baldeDePipocaBranco));
  borda.rotation.x = Math.PI / 2;
  borda.position.y = ALTO;
  g.add(borda);

  // A PIPOCA: um monte em domo transbordando da boca, e umas caídas na borda
  const pipoca = new THREE.IcosahedronGeometry(0.022, 0);
  // amassada pela posição (os cantos repetidos recebem o mesmo empurrão)
  const pos = pipoca.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const k = 1 + 0.32 * Math.sin(x * 211 + y * 157) * Math.cos(z * 173);
    pos.setXYZ(i, x * k, y * k, z * k);
  }
  pipoca.computeVertexNormals();
  const N = 46;
  const lote = new THREE.InstancedMesh(pipoca, toon(0xffffff), N);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  for (let i = 0; i < N; i++) {
    // espiral de Fibonacci num domo achatado em cima da boca
    const k = (i + 0.5) / N;
    const a = i * 2.39996;
    const r = Math.sqrt(k) * R_CIMA * 0.98;
    const domo = Math.cos((r / R_CIMA) * (Math.PI / 2));
    m.position.set(Math.cos(a) * r, ALTO - 0.01 + domo * 0.07 + (i % 3) * 0.004, Math.sin(a) * r);
    m.rotation.set(i * 1.3, i * 2.1, i * 0.7);
    m.scale.setScalar(0.85 + ((i * 37) % 10) * 0.035);
    m.updateMatrix();
    lote.setMatrixAt(i, m.matrix);
    lote.setColorAt(i, cor.setHex(i % 4 === 0 ? P.pipocaManteiga : P.pipocaClara));
  }
  g.add(lote);
  return g;
}
