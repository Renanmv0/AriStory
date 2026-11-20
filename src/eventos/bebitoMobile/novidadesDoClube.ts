import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { Josefina } from '../../entities/bichos/Josefina';
import { regador } from '../../world/props';
import { fundir } from '../../world/fundir';
import { Semaforo, faixaDePedestres, LINHA_DE_PARADA, type NaPista } from '../../world/estrada';

export class RegaNaAlameda {
  readonly group = new THREE.Group();
  readonly josefina = new Josefina({ minX: -1, maxX: 1, minZ: -1, maxZ: 1 });
  private readonly gotas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 6, 4), toon(P.aguaRasa), 28);
  private tempo = 0;
  private readonly m = new THREE.Matrix4();
  constructor(private readonly naPista: NaPista, readonly s: number, rumo: number) {
    this.group.userData.peca = 'rega-na-alameda';
    this.josefina.entrarEmServico(); this.josefina.group.position.copy(naPista(s + 2, 5.2, 0.14));
    this.josefina.group.rotation.y = rumo - Math.PI / 2; this.group.add(this.josefina.group);
    const r = regador(); r.position.copy(naPista(s + 1.8, 4.6, 0.16)); r.rotation.y = rumo - Math.PI / 2; this.group.add(fundir(r));
    const molhado = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 10), toon(P.aguaRasa, { opacity: 0.3, decal: true }));
    molhado.rotation.set(-Math.PI / 2, 0, -rumo + Math.PI); molhado.position.copy(naPista(s, 0, 0.006));
    molhado.renderOrder = 4; this.group.add(molhado); this.group.add(this.gotas);
  }
  update(dt: number, perto: boolean): void {
    this.group.visible = perto; if (!perto) return;
    this.tempo += dt; this.josefina.update(dt);
    for (let i = 0; i < 28; i++) {
      const t = (i / 28 + this.tempo * 0.55) % 1;
      const p = this.naPista(this.s + Math.sin(i * 2.4) * 0.7, 3.8 - t * 7.4, 0.3 + Math.sin(t * Math.PI) * 2.1);
      this.gotas.setMatrixAt(i, this.m.makeTranslation(p.x, p.y, p.z));
    }
    this.gotas.instanceMatrix.needsUpdate = true;
  }
}

/** Dois sinais coordenados. Quem perde a janela espera; a viagem nunca fica presa. */
export class OndaVerde {
  readonly group = new THREE.Group();
  readonly sinais: Semaforo[] = [];
  readonly passados = [false, false];
  tempo = -1;
  verdeAproveitado = false;
  constructor(readonly s: number, naPista: NaPista, rumo: (s: number) => number) {
    this.group.userData.peca = 'onda-verde';
    for (const ds of [0, 28]) {
      const sinal = new Semaforo(4.7);
      sinal.group.position.copy(naPista(s + ds + 2.2, 4.1, 0.14)); sinal.group.rotation.y = rumo(s + ds) + Math.PI;
      this.group.add(fundir(sinal.group)); this.group.add(faixaDePedestres(naPista, s + ds)); this.sinais.push(sinal);
    }
  }
  update(dt: number, viagem: { s: number }): number {
    if (this.tempo < 0 && viagem.s >= this.s - 72) this.tempo = 0;
    if (this.tempo >= 0) this.tempo += dt;
    let limite = Infinity;
    for (let i = 0; i < 2; i++) {
      const linha = this.s + i * 28 - LINHA_DE_PARADA;
      const cor = this.tempo < 8.3 || this.tempo > 14 ? 'verde' : this.tempo < 9.4 ? 'amarelo' : 'vermelho';
      // Não fecha em cima de quem já entrou na travessia.
      if (viagem.s + 2.6 > linha + 0.1 && cor !== 'vermelho') {
        if (!this.passados[i] && i === 1) this.verdeAproveitado = this.tempo < 8.3;
        this.passados[i] = true;
      }
      this.sinais[i].acender(this.passados[i] ? 'verde' : cor);
      if (!this.passados[i] && cor === 'vermelho') limite = Math.min(limite, linha);
    }
    return limite;
  }
}
