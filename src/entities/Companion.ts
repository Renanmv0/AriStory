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
  /** direcao do jogador no frame; e dela que sai o lateral do reboque */
  private aoLado = 0;

  /** distancia em que ele para de seguir */
  readonly folga = 2.0;
  /** quando definido, ele vai ate aqui em vez de seguir o jogador */
  private ordem: THREE.Vector3 | null = null;
  riding = false;
  submersion = 0;

  /**
   * Reboque: enquanto vale, ele nao segue nem olha para o jogador — anda
   * colado num ponto que OUTRA COISA calcula. E de proposito que o nome nao
   * diz "maos dadas": o Companion nao precisa saber que mecanica esta puxando
   * ele. Guarda so de que lado do jogador ele fica (-1 esquerda, 1 direita).
   */
  private lado: -1 | 1 | 0 = 0;
  /** deslocamento lateral do reboque, em unidades de mundo */
  private distancia = 0;

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

  /** Atrela ele ao lado do jogador. Ver `lado`. */
  atrelar(lado: -1 | 1, distancia: number): void {
    this.lado = lado;
    this.distancia = distancia;
    this.ordem = null;
  }

  soltar(): void {
    this.lado = 0;
  }

  get atrelado(): boolean {
    return this.lado !== 0;
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

  /**
   * Anda emparelhado com o jogador, no lado escolhido.
   *
   * Nao usa nada da rotina de seguir: nem `folga`, nem aceleracao, nem virar
   * para olhar. E uma mola dura ate o ponto certo, porque o que faz a dupla
   * parecer de maos dadas nao e andar junto — e PARAR junto. Com aceleracao,
   * ele para meio passo depois e o braco estica.
   */
  private rebocar(
    seguindo: THREE.Vector3,
    dt: number,
    colliders: readonly Collider[],
    bounds: Bounds,
  ): void {
    const olhando = this.aoLado;
    const alvoX = seguindo.x + Math.sin(olhando + Math.PI / 2) * this.distancia * this.lado;
    const alvoZ = seguindo.z + Math.cos(olhando + Math.PI / 2) * this.distancia * this.lado;

    const antesX = this.position.x;
    const antesZ = this.position.z;
    const passo = Math.min(1, dt * 16);
    this.position.x += (alvoX - this.position.x) * passo;
    this.position.z += (alvoZ - this.position.z) * passo;

    // parede ainda e parede: quem quiser esticar o braco atraves de uma quina
    // e barrado aqui, e a mecanica desiste sozinha quando a distancia estoura
    resolveCollisions(this.position, this.radius, colliders);
    clampToBounds(this.position, this.radius, bounds);

    // o empurrao de "nunca fica em cima do jogador" NAO roda aqui: ele forca
    // 0.86 de folga e brigaria com o deslocamento fixo do reboque
    this.velocity.set(
      (this.position.x - antesX) / Math.max(dt, 0.0001),
      0,
      (this.position.z - antesZ) / Math.max(dt, 0.0001),
    );

    this.body.setFacing(olhando);
    this.body.group.position.y = -this.submersion * 0.72;
    this.body.setSwimming(this.submersion > 0.05);
    this.body.update(dt, Math.hypot(this.velocity.x, this.velocity.z));
  }

  /** Direcao para onde o jogador olha, avisada pela mecanica que reboca. */
  set direcaoDoPar(angulo: number) {
    this.aoLado = angulo;
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

    if (this.lado !== 0) {
      this.rebocar(seguindo, dt, colliders, bounds);
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
