import * as THREE from 'three';
import { CharacterRig } from '../characters/CharacterRig';
import type { CharacterSpec } from '../characters/spec';
import { clampToBounds, resolveCollisions } from '../world/collision';
import type { Bounds, Collider } from '../core/types';

/** O personagem controlado: fisica simples no plano XZ + o rig visual. */
export class Player {
  readonly rig: CharacterRig;
  readonly object: THREE.Group;
  readonly position: THREE.Vector3;

  readonly radius = 0.42;
  private readonly maxSpeed = 4.4;
  private readonly accel = 26;
  private readonly friction = 18;
  private readonly velocity = new THREE.Vector3();

  locked = false;
  /** dentro de um veiculo/cabine: a fisica de chao nao se aplica */
  riding = false;

  constructor(spec: CharacterSpec) {
    this.rig = new CharacterRig(spec);
    this.object = this.rig.group;
    this.position = this.object.position;
  }

  get name(): string {
    return this.rig.spec.name;
  }

  /** ponto na altura do peito, bom alvo para a camera */
  get chest(): THREE.Vector3 {
    return new THREE.Vector3(this.position.x, this.position.y + 1.0, this.position.z);
  }

  teleport(x: number, z: number, facing = 0): void {
    this.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.object.rotation.y = facing;
    this.rig.setFacing(facing);
  }

  setVisible(visible: boolean): void {
    this.object.visible = visible;
  }

  /** @param dir direcao desejada ja em espaco de mundo (nao precisa normalizada) */
  update(dir: THREE.Vector3, dt: number, colliders: readonly Collider[], bounds: Bounds): void {
    if (this.riding) {
      this.rig.update(dt, 0);
      return;
    }

    const wants = !this.locked && dir.lengthSq() > 0.0001;

    if (wants) {
      const d = dir.clone().normalize();
      this.velocity.x += d.x * this.accel * dt;
      this.velocity.z += d.z * this.accel * dt;
      const speed = Math.hypot(this.velocity.x, this.velocity.z);
      if (speed > this.maxSpeed) {
        this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
        this.velocity.z = (this.velocity.z / speed) * this.maxSpeed;
      }
      this.rig.setFacing(Math.atan2(d.x, d.z));
    } else {
      const drop = Math.max(0, 1 - (this.friction * dt) / Math.max(0.001, this.velocity.length()));
      this.velocity.multiplyScalar(drop);
      if (this.velocity.lengthSq() < 0.0004) this.velocity.set(0, 0, 0);
    }

    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;

    resolveCollisions(this.position, this.radius, colliders);
    clampToBounds(this.position, this.radius, bounds);

    this.rig.update(dt, Math.hypot(this.velocity.x, this.velocity.z));
  }
}
