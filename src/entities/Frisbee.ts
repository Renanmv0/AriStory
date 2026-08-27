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

  /** Guarda o disco na mao de alguem. */
  pickUp(): void {
    this.state = 'guardado';
    this.velocity.set(0, 0, 0);
  }

  /** Enquanto guardado, o disco fica na mao de quem esta com ele. */
  holdAt(pos: THREE.Vector3, facing: number): void {
    this.mesh.visible = true;
    // um pouco para o lado direito de quem segura
    this.mesh.position.set(
      pos.x + Math.sin(facing + Math.PI / 2) * 0.34,
      1.02,
      pos.z + Math.cos(facing + Math.PI / 2) * 0.34,
    );
    this.mesh.rotation.set(0, this.mesh.rotation.y, Math.PI / 2.4);
  }

  /**
   * Lanca mirando num ponto. O voo tem sustentacao, entao nao ha formula
   * fechada para o alcance: a forca sai de uma busca binaria sobre a propria
   * simulacao do voo.
   * @param imprecisao radianos de erro aleatorio; 0 acerta em cheio
   */
  throwToward(from: THREE.Vector3, alvo: THREE.Vector3, imprecisao = 0): void {
    const dx = alvo.x - from.x;
    const dz = alvo.z - from.z;
    const dist = Math.hypot(dx, dz);
    const erro = (Math.random() - 0.5) * imprecisao;
    this.throwFrom(from, Math.atan2(dx, dz) + erro, this.powerFor(dist));
  }

  /**
   * Lanca na direcao em que a pessoa esta olhando, mirando cair a `distancia`.
   * E o que a barra de forca usa: mais carga, mais longe.
   */
  throwAt(from: THREE.Vector3, facing: number, distancia: number): void {
    this.throwFrom(from, facing, this.powerFor(distancia));
  }

  private powerFor(dist: number): number {
    let baixo = 0.25;
    let alto = 1.7;
    for (let i = 0; i < 14; i++) {
      const meio = (baixo + alto) / 2;
      if (this.simulateRange(meio) < dist) baixo = meio;
      else alto = meio;
    }
    return THREE.MathUtils.clamp((baixo + alto) / 2, 0.25, 1.7);
  }

  /** Repete a fisica de `update` so para medir onde o disco cairia. */
  private simulateRange(power: number): number {
    let y = 1.15;
    let vy = 3.4 * power;
    let vh = 11 * power;
    let percorrido = 0;
    const dt = 1 / 60;
    for (let i = 0; i < 900 && y > 0.06; i++) {
      const glide = vy > -1.2 ? this.lift : 0;
      vy -= (this.gravity - glide) * dt;
      vh *= 1 - 0.35 * dt;
      percorrido += vh * dt;
      y += vy * dt;
    }
    return percorrido;
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
    this.mesh.rotation.set(0, this.mesh.rotation.y, 0);
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
