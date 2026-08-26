import * as THREE from 'three';
import { frisbee as frisbeeMesh } from '../world/props';
import type { Bounds } from '../core/types';

export type FrisbeeState = 'guardado' | 'voando' | 'chao';

/**
 * O frisbee do Villa Lobos. Voo leve e exagerado de proposito: sobe, plana e
 * cai devagar, para dar tempo de correr atras.
 */
export class Frisbee {
  readonly mesh: THREE.Mesh;
  state: FrisbeeState = 'chao';

  private readonly velocity = new THREE.Vector3();
  private spin = 0;
  private readonly gravity = 7.2;
  private readonly lift = 3.1;

  /** chamado quando o disco encosta no chao */
  onLand: ((pos: THREE.Vector3) => void) | null = null;

  constructor(color?: number) {
    this.mesh = frisbeeMesh(color);
    this.mesh.position.set(0, 0.06, 0);
  }

  get position(): THREE.Vector3 {
    return this.mesh.position;
  }

  /** Guarda o disco na mao do jogador (some do chao). */
  pickUp(): void {
    this.state = 'guardado';
    this.mesh.visible = false;
    this.velocity.set(0, 0, 0);
  }

  /**
   * @param from posicao do jogador
   * @param facing angulo para onde ele olha (rad)
   * @param power 0..1
   */
  throwFrom(from: THREE.Vector3, facing: number, power = 1): void {
    this.state = 'voando';
    this.mesh.visible = true;
    this.mesh.position.set(from.x, 1.15, from.z);
    const speed = 11 * power;
    this.velocity.set(Math.sin(facing) * speed, 3.4 * power, Math.cos(facing) * speed);
    this.spin = 22;
  }

  update(dt: number, bounds: Bounds): void {
    if (this.state !== 'voando') return;

    // planeio: enquanto sobe/plana a sustentacao segura a queda
    const glide = this.velocity.y > -1.2 ? this.lift : 0;
    this.velocity.y -= (this.gravity - glide) * dt;
    this.velocity.x *= 1 - 0.35 * dt;
    this.velocity.z *= 1 - 0.35 * dt;

    this.mesh.position.addScaledVector(this.velocity, dt);
    this.mesh.rotation.y += this.spin * dt;
    this.mesh.rotation.z = Math.sin(this.mesh.rotation.y) * 0.08;

    const x = THREE.MathUtils.clamp(this.mesh.position.x, bounds.minX + 1, bounds.maxX - 1);
    const z = THREE.MathUtils.clamp(this.mesh.position.z, bounds.minZ + 1, bounds.maxZ - 1);
    if (x !== this.mesh.position.x || z !== this.mesh.position.z) {
      this.mesh.position.x = x;
      this.mesh.position.z = z;
      this.velocity.multiplyScalar(0.2);
    }

    if (this.mesh.position.y <= 0.06) {
      this.mesh.position.y = 0.06;
      this.mesh.rotation.z = 0;
      this.state = 'chao';
      this.velocity.set(0, 0, 0);
      this.onLand?.(this.mesh.position.clone());
    }
  }
}
