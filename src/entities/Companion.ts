import * as THREE from 'three';
import type { CharacterRig } from '../characters/CharacterRig';
import { clampToBounds, resolveCollisions } from '../world/collision';
import type { Bounds, Collider } from '../core/types';

/**
 * O outro da dupla. Anda atras de quem esta sendo controlado, para a uma
 * distancia confortavel e vira para olhar. Nao empurra o jogador.
 */
export class Companion {
  readonly object = new THREE.Group();
  readonly position: THREE.Vector3;

  readonly radius = 0.4;
  /** um tico mais rapido que o jogador, senao fica para tras para sempre */
  private readonly maxSpeed = 5.0;
  private readonly velocity = new THREE.Vector3();
  private readonly dir = new THREE.Vector3();

  private body: CharacterRig;

  /** distancia em que ele para de seguir */
  readonly folga = 2.0;
  /** quando definido, ele vai ate aqui em vez de seguir o jogador */
  private ordem: THREE.Vector3 | null = null;
  riding = false;
  submersion = 0;

  constructor(rig: CharacterRig) {
    this.body = rig;
    this.object.add(rig.group);
    this.position = this.object.position;
  }

  get rig(): CharacterRig {
    return this.body;
  }

  get name(): string {
    return this.body.spec.name;
  }

  swapRig(novo: CharacterRig): CharacterRig {
    const antigo = this.body;
    const olhando = antigo.group.rotation.y;
    this.object.remove(antigo.group);
    novo.group.rotation.y = olhando;
    novo.setFacing(olhando);
    this.object.add(novo.group);
    this.body = novo;
    return antigo;
  }

  teleport(x: number, z: number, facing = 0): void {
    this.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.submersion = 0;
    this.ordem = null;
    this.body.group.rotation.y = facing;
    this.body.setFacing(facing);
  }

  setVisible(visible: boolean): void {
    this.object.visible = visible;
  }

  /** manda ele ate um ponto; enquanto durar, ele ignora o jogador */
  goTo(x: number, z: number): void {
    this.ordem = new THREE.Vector3(x, 0, z);
  }

  clearOrder(): void {
    this.ordem = null;
  }

  /**
   * Planta ele onde esta, parado, encarando um ponto. E o que o frisbee usa:
   * ninguem lanca andando — primeiro para, depois mira, depois joga.
   */
  hold(olharX: number, olharZ: number): void {
    if (this.ordem) this.ordem.set(this.position.x, 0, this.position.z);
    else this.ordem = new THREE.Vector3(this.position.x, 0, this.position.z);
    this.velocity.set(0, 0, 0);
    this.body.setFacing(Math.atan2(olharX - this.position.x, olharZ - this.position.z));
  }

  get hasOrder(): boolean {
    return this.ordem !== null;
  }

  update(
    seguindo: THREE.Vector3,
    dt: number,
    colliders: readonly Collider[],
    bounds: Bounds,
  ): void {
    if (this.riding) {
      this.body.update(dt, 0);
      return;
    }

    const alvo = this.ordem ?? seguindo;
    // indo buscar alguma coisa ele encosta de verdade; seguindo, para antes
    const folga = this.ordem ? 0.55 : this.folga;
    this.dir.set(alvo.x - this.position.x, 0, alvo.z - this.position.z);
    const dist = this.dir.length();

    // se ficou muito para tras (porta, cutscene, colisor chato), reaparece perto
    if (!this.ordem && dist > 22) {
      this.teleport(alvo.x - 1.2, alvo.z - 1.2, Math.atan2(this.dir.x, this.dir.z));
      return;
    }

    if (dist > folga) {
      this.dir.normalize();
      // acelera quando esta longe, para nao ficar pendurado no limite
      const alvoVel = Math.min(this.maxSpeed, 1.6 + (dist - folga) * 2.2);
      this.velocity.x += (this.dir.x * alvoVel - this.velocity.x) * Math.min(1, dt * 7);
      this.velocity.z += (this.dir.z * alvoVel - this.velocity.z) * Math.min(1, dt * 7);
      this.body.setFacing(Math.atan2(this.dir.x, this.dir.z));
    } else {
      this.velocity.multiplyScalar(Math.max(0, 1 - dt * 9));
      if (this.velocity.lengthSq() < 0.0004) this.velocity.set(0, 0, 0);
      // parado, fica de frente para o outro
      if (dist > 0.2) this.body.setFacing(Math.atan2(this.dir.x, this.dir.z));
    }

    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;

    resolveCollisions(this.position, this.radius, colliders);
    clampToBounds(this.position, this.radius, bounds);

    // nunca fica em cima do jogador
    const dx = this.position.x - seguindo.x;
    const dz = this.position.z - seguindo.z;
    const perto = Math.hypot(dx, dz);
    const minimo = 0.86;
    if (perto < minimo && perto > 0.0001) {
      const empurra = (minimo - perto) / perto;
      this.position.x += dx * empurra;
      this.position.z += dz * empurra;
    }

    this.body.group.position.y = -this.submersion * 0.72;
    this.body.setSwimming(this.submersion > 0.05);
    this.body.update(dt, Math.hypot(this.velocity.x, this.velocity.z));
  }
}
