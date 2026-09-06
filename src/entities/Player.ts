import * as THREE from 'three';
import type { CharacterRig } from '../characters/CharacterRig';
import { clampToBounds, resolveCollisions } from '../world/collision';
import type { Bounds, Collider } from '../core/types';

/** o quanto os patins multiplicam a velocidade de quem os calca */
export const BONUS_PATINS = 1.3;

/**
 * O personagem controlado: fisica simples no plano XZ.
 *
 * O corpo (CharacterRig) e trocavel — e assim que a tecla T alterna entre o Ari
 * e o Renan sem ninguem sair do lugar. O grupo externo carrega a POSICAO; a
 * rotacao mora no rig, para o corpo trocado nao herdar giro errado.
 */
export class Player {
  readonly object = new THREE.Group();
  readonly position: THREE.Vector3;

  readonly radius = 0.42;
  private readonly maxSpeed = 4.4;
  private readonly accel = 26;
  private readonly friction = 18;
  private readonly velocity = new THREE.Vector3();

  private body: CharacterRig;

  locked = false;
  /** dentro de um veiculo/cabine: a fisica de chao nao se aplica */
  riding = false;
  /** 0 = seco, 1 = submerso ate o pescoco */
  submersion = 0;
  /**
   * De patins anda mais rapido. Quem liga isto e o `Game`, lendo a vaga de
   * acessorio — o Player nao conhece inventario.
   */
  patins = false;

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

  /** Troca o corpo mantendo posicao e direcao. Devolve o corpo antigo. */
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

  /** ponto na altura do peito, bom alvo para a camera */
  get chest(): THREE.Vector3 {
    return new THREE.Vector3(this.position.x, this.position.y + 1.0, this.position.z);
  }

  teleport(x: number, z: number, facing = 0): void {
    this.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.submersion = 0;
    this.body.group.rotation.y = facing;
    this.body.setFacing(facing);
  }

  setVisible(visible: boolean): void {
    this.object.visible = visible;
  }

  /** @param dir direcao desejada ja em espaco de mundo (nao precisa normalizada) */
  update(dir: THREE.Vector3, dt: number, colliders: readonly Collider[], bounds: Bounds): void {
    if (this.riding) {
      this.body.update(dt, 0);
      return;
    }

    const naAgua = this.submersion > 0.05;
    // na agua o patins nao ajuda em nada: roda nao empurra agua
    const rodas = this.patins && !naAgua ? BONUS_PATINS : 1;
    const teto = naAgua ? this.maxSpeed * 0.55 : this.maxSpeed * rodas;
    const wants = !this.locked && dir.lengthSq() > 0.0001;

    if (wants) {
      const d = dir.clone().normalize();
      this.velocity.x += d.x * this.accel * dt;
      this.velocity.z += d.z * this.accel * dt;
      const speed = Math.hypot(this.velocity.x, this.velocity.z);
      if (speed > teto) {
        this.velocity.x = (this.velocity.x / speed) * teto;
        this.velocity.z = (this.velocity.z / speed) * teto;
      }
      this.body.setFacing(Math.atan2(d.x, d.z));
    } else {
      const drop = Math.max(0, 1 - (this.friction * dt) / Math.max(0.001, this.velocity.length()));
      this.velocity.multiplyScalar(drop);
      if (this.velocity.lengthSq() < 0.0004) this.velocity.set(0, 0, 0);
    }

    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;

    resolveCollisions(this.position, this.radius, colliders);
    clampToBounds(this.position, this.radius, bounds);

    // afunda o corpo na agua; na superficie da a impressao de estar nadando
    this.body.group.position.y = -this.submersion * 0.72;
    this.body.setSwimming(naAgua);
    this.body.update(dt, Math.hypot(this.velocity.x, this.velocity.z));
  }
}
