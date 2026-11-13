import * as THREE from 'three';
import { Noel } from '../entities/bichos/Noel';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { carroEstacionado } from './estacionamento';
import { fundir } from './fundir';
import { quina } from './lojaDeRoupas';

/** Mesmo hatch dos estacionamentos, aberto para enxergar o Noel de verdade. */
export class CarroDoNoel {
  readonly group = new THREE.Group();
  readonly noel = new Noel({ minX: -2, maxX: 2, minZ: -2, maxZ: 2 });
  private readonly rodas: THREE.Object3D[] = [];
  constructor() {
    this.group.userData.peca = 'carro-do-noel';
    const carro = carroEstacionado(P.carroAmarelo, true);
    // Rodas separadas do corpo estático para poderem girar de verdade.
    for (const o of [...carro.children]) {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry.type === 'CylinderGeometry') {
        m.name = `roda-do-noel-${this.rodas.length}`; this.rodas.push(m);
      }
    }
    this.group.add(fundir(carro));
    const banco = new THREE.Mesh(quina(0.55, 0.12, 0.55, 0.04), toon(P.portaoMetal));
    banco.position.set(-0.4, 0.85, 0.05); this.group.add(banco);
    // O bicho conserva as próprias poses: não fundir suas asas, pescoço e leque.
    this.noel.entrarEmServico();
    this.noel.group.position.set(-0.4, 0.89, 0.05);
    this.group.add(this.noel.group);
    const volante = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 14), toon(P.pneu));
    volante.position.set(-0.4, 1.13, 0.55); volante.rotation.x = -0.7; this.group.add(volante);
    const caixa = new THREE.Group();
    for (const z of [-0.34, 0.34]) for (const y of [0.08, 0.23]) {
      const r = new THREE.Mesh(quina(0.65, 0.11, 0.055, 0.012), toon(P.wood)); r.position.set(0, y, z); caixa.add(r);
    }
    for (const x of [-0.3, 0.3]) {
      const r = new THREE.Mesh(quina(0.055, 0.32, 0.7, 0.012), toon(P.wood)); r.position.set(x, 0.16, 0); caixa.add(r);
    }
    const frutas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.105, 10, 8), toon(P.laranjaCasca), 9);
    const m = new THREE.Matrix4();
    for (let i = 0; i < 9; i++) frutas.setMatrixAt(i, m.makeTranslation((i % 3 - 1) * 0.18, 0.26 + (i % 2) * 0.045, (Math.floor(i / 3) - 1) * 0.2));
    caixa.add(frutas); caixa.position.set(0.45, 0.9, -0.35); this.group.add(fundir(caixa));
  }
  update(dt: number, distancia: number, conversando: boolean): void {
    for (const r of this.rodas) r.rotation.x += distancia / 0.34;
    this.noel.update(dt);
    this.noel.group.rotation.y = conversando ? -Math.PI / 2 : 0;
  }
}
