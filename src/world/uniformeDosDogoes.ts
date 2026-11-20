import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';

/**
 * ===================================== O TIME DOS DOGÕES
 *
 * A escola rival dos Gatitos (decisão do Renan, 2026-11-19): um time de CACHORRO — nós somos os Gatitos, eles são os
 * DOGÕES —, de vermelho e cinza com detalhe branco. O capitão é o Rocco, o lobo (`entities/bichos/Rocco.ts`). A
 * rivalidade é "não tóxica, mas com algumas farpas".
 *
 * O EMBLEMA, a resposta ao dos Gatitos (`emblemaDosGatitos`: o disco com o G e as orelhinhas de GATO em pé, em
 * cima): o disco branco com o aro chumbo, o "D" vermelho de geometria (a barra e o meio toro) e as duas ORELHAS DE
 * CACHORRO CAÍDAS, uma de cada lado, penduradas para fora do disco. Olhando para `+Z`, as costas em `z = 0`, `e`
 * de raio.
 */
export function emblemaDosDogoes(e: number): THREE.Group {
  const g = new THREE.Group();
  const esp = e * 0.16;
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(e, e, esp, 32), toon(P.dogoesBranco));
  disco.rotation.x = Math.PI / 2;
  disco.position.z = esp / 2;
  g.add(disco);
  // as orelhas caídas: uma gota comprida pendurada do alto do disco, para fora e para baixo
  const orelha = new THREE.Shape();
  orelha.moveTo(0, 0);
  orelha.bezierCurveTo(e * 0.55, e * 0.1, e * 0.62, -e * 0.7, e * 0.3, -e * 0.95);
  orelha.bezierCurveTo(e * 0.05, -e * 1.08, -e * 0.12, -e * 0.55, 0, 0);
  const geoOrelha = new THREE.ExtrudeGeometry(orelha, { depth: esp * 1.2, bevelEnabled: false, curveSegments: 10 });
  for (const lado of [-1, 1] as const) {
    const o = new THREE.Mesh(geoOrelha, toon(P.dogoesCinza, { doubleSide: true }));
    o.scale.x = lado;
    o.position.set(lado * e * 0.62, e * 0.72, 0);
    o.rotation.z = lado * 0.25;
    g.add(o);
  }
  const aro = new THREE.Mesh(new THREE.TorusGeometry(e * 0.87, e * 0.07, 6, 36), toon(P.dogoesCinza));
  aro.position.z = esp;
  g.add(aro);
  // o "D": a barra em pé e o meio toro fechando à direita
  const vermelho = toon(P.dogoesVermelho);
  const barra = new THREE.Mesh(new THREE.BoxGeometry(e * 0.2, e * 0.98, e * 0.16), vermelho);
  barra.position.set(-e * 0.26, 0, esp);
  g.add(barra);
  const curva = new THREE.Mesh(new THREE.TorusGeometry(e * 0.4, e * 0.1, 8, 24, Math.PI), vermelho);
  curva.rotation.z = -Math.PI / 2;
  curva.position.set(-e * 0.18, 0, esp);
  curva.scale.set(1.05, 1.18, 1);
  g.add(curva);
  return g;
}
