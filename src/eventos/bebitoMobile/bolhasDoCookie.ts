import * as THREE from 'three';
import { Cookie } from '../../entities/bichos/Cookie';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../../world/fundir';
import type { NaPista } from '../../world/estrada';

/** Cookie fica na calçada; só as bolhas flutuam sobre a pista. */
export class BolhasDoCookie {
  readonly group = new THREE.Group();
  readonly cookie = new Cookie({ minX: -1, maxX: 1, minZ: -1, maxZ: 1 });
  readonly bolhas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), toon(P.aguaRasa, { opacity: .3 }), 12);
  private readonly brilhos = new THREE.InstancedMesh(new THREE.SphereGeometry(.07, 6, 4), toon(P.metalWhite), 12);
  private tempo = 0;
  private estouro = false;
  constructor(private readonly naPista: NaPista, readonly s: number, rumo: number) {
    this.group.userData.peca = 'bolhas-do-cookie';
    // As instâncias atravessam a pista; a distância já controla o grupo inteiro.
    this.bolhas.frustumCulled = this.brilhos.frustumCulled = false;
    this.cookie.entrarEmServico(); this.cookie.group.position.copy(naPista(s, 5.3, .14)); this.cookie.group.rotation.y = rumo - Math.PI / 2; this.group.add(this.cookie.group);
    const kit = new THREE.Group();
    const balde = new THREE.Mesh(new THREE.CylinderGeometry(.35, .26, .46, 16, 1, true), toon(P.carroLilas)); balde.position.copy(naPista(s + 1, 4.9, .37)); kit.add(balde);
    const agua = new THREE.Mesh(new THREE.CircleGeometry(.32, 16), toon(P.aguaRasa)); agua.rotation.x = -Math.PI / 2; agua.position.copy(naPista(s + 1, 4.9, .5)); kit.add(agua);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(.35, .045, 8, 20), toon(P.laranjaCasca)); aro.position.copy(naPista(s, 4.35, 1.22)); aro.rotation.y = rumo + Math.PI / 2; kit.add(aro);
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .72, 8), toon(P.wood)); cabo.position.copy(naPista(s, 4.35, .62)); kit.add(cabo);
    this.group.add(fundir(kit), this.bolhas, this.brilhos);
  }
  passar(rapido: boolean): void { this.estouro = rapido; if (!rapido) this.cookie.receberCarinho(); }
  update(dt: number, perto: boolean): void {
    this.group.visible = perto; if (!perto) return;
    this.tempo += dt; this.cookie.update(dt);
    this.bolhas.visible = this.brilhos.visible = !this.estouro;
    const m = new THREE.Matrix4();
    for (let i = 0; i < 12; i++) {
      const t = (this.tempo * .11 + i / 12) % 1, raio = .2 + (i % 4) * .12;
      const p = this.naPista(this.s + Math.sin(i * 2.1) * 3, 4.3 - t * 9, 1.3 + t * 2.5);
      m.makeScale(raio, raio, raio).setPosition(p); this.bolhas.setMatrixAt(i, m);
      p.y += raio * .55; m.makeScale(1, 1, 1).setPosition(p); this.brilhos.setMatrixAt(i, m);
    }
    this.bolhas.instanceMatrix.needsUpdate = this.brilhos.instanceMatrix.needsUpdate = true;
  }
}
