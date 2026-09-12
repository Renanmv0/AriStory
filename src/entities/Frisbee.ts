import * as THREE from 'three';
import { frisbee as frisbeeMesh } from '../world/props';
import type { Bounds } from '../core/types';

export type FrisbeeState = 'guardado' | 'voando' | 'chao';

/**
 * O frisbee do Villa Lobos. Voo leve e exagerado de proposito: sobe, plana e
 * cai devagar, para dar tempo de correr atras.
 *
 * A fisica esta escrita UMA vez, em `passo`. Quem roda ela e o `update` (com o
 * disco de verdade) e as duas adivinhacoes: `simulateRange`, que descobre a
 * forca de um lancamento, e `ondeVaiCair`, que diz ao parceiro para onde correr
 * com o disco ainda no ar. Antes eram duas copias da mesma conta, e a curva
 * teria feito elas discordarem na primeira semana.
 */
export class Frisbee {
  readonly mesh: THREE.Mesh;
  state: FrisbeeState = 'chao';

  private readonly velocity = new THREE.Vector3();
  private spin = 0;
  /** aceleracao lateral que decai: e o que faz o disco sair em banana */
  private curva = 0;
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

  /** quanto o disco esta correndo no plano do chao, em unidades por segundo */
  get rasante(): number {
    return Math.hypot(this.velocity.x, this.velocity.z);
  }

  /** Guarda o disco na mao de alguem. */
  pickUp(): void {
    this.state = 'guardado';
    this.velocity.set(0, 0, 0);
    this.curva = 0;
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
   * @param arco quanto o lancamento sobe. 1 e o passe reto; acima disso o disco
   * faz parabola mais alta e chega mais devagar, o que alarga a janela de quem
   * vai interceptar no ar
   * @param curva aceleracao lateral; ver `throwFrom`
   */
  throwToward(from: THREE.Vector3, alvo: THREE.Vector3, imprecisao = 0, arco = 1, curva = 0): void {
    const dx = alvo.x - from.x;
    const dz = alvo.z - from.z;
    const dist = Math.hypot(dx, dz);
    const erro = (Math.random() - 0.5) * imprecisao;
    this.throwFrom(from, Math.atan2(dx, dz) + erro, this.powerFor(dist, arco), arco, curva);
  }

  /**
   * Lanca na direcao em que a pessoa esta olhando, mirando cair a `distancia`.
   * E o que a barra de forca usa: mais carga, mais longe.
   */
  throwAt(from: THREE.Vector3, facing: number, distancia: number, arco = 1, curva = 0): void {
    this.throwFrom(from, facing, this.powerFor(distancia, arco), arco, curva);
  }

  private powerFor(dist: number, arco = 1): number {
    let baixo = 0.25;
    let alto = 1.7;
    for (let i = 0; i < 14; i++) {
      const meio = (baixo + alto) / 2;
      if (this.simulateRange(meio, arco) < dist) baixo = meio;
      else alto = meio;
    }
    return THREE.MathUtils.clamp((baixo + alto) / 2, 0.25, 1.7);
  }

  /**
   * Um passo da fisica. Devolve a curva ja gasta, porque ela decai a cada
   * passo — quem chama guarda o valor de volta.
   */
  private passo(p: THREE.Vector3, v: THREE.Vector3, curva: number, dt: number): number {
    // planeio: enquanto sobe/plana a sustentacao segura a queda
    const glide = v.y > -1.2 ? this.lift : 0;
    v.y -= (this.gravity - glide) * dt;

    // a curva empurra para o lado, perpendicular ao rumo horizontal
    const hx = v.x;
    const hz = v.z;
    const h = Math.hypot(hx, hz);
    if (curva !== 0 && h > 1e-4) {
      v.x += (hz / h) * curva * dt;
      v.z += (-hx / h) * curva * dt;
    }

    v.x *= 1 - 0.35 * dt;
    v.z *= 1 - 0.35 * dt;
    p.addScaledVector(v, dt);
    return curva * Math.max(0, 1 - 1.1 * dt);
  }

  /**
   * Ate onde um lancamento com esta forca chega. Roda o voo inteiro no eixo Z,
   * sem curva: a banana muda o rumo, quase nao muda o alcance, e deixar ela
   * fora e o que mantem a barra de forca dizendo a verdade.
   */
  private simulateRange(power: number, arco = 1): number {
    const p = new THREE.Vector3(0, 1.15, 0);
    const v = new THREE.Vector3(0, 3.4 * power * arco, 11 * power);
    const dt = 1 / 60;
    for (let i = 0; i < 900 && p.y > 0.06; i++) this.passo(p, v, 0, dt);
    return p.z;
  }

  /**
   * Onde este voo vai acabar, do jeito que ele esta agora. E como o parceiro
   * sabe para onde correr antes do disco cair — sem isto ele so reage depois
   * que o disco ja esta no chao.
   */
  ondeVaiCair(bounds: Bounds): THREE.Vector3 {
    const p = this.mesh.position.clone();
    if (this.state !== 'voando') return p;
    const v = this.velocity.clone();
    let c = this.curva;
    const dt = 1 / 60;
    for (let i = 0; i < 900 && p.y > 0.06; i++) {
      c = this.passo(p, v, c, dt);
      if (this.bater(p, v, bounds)) c = 0;
    }
    p.y = 0.06;
    return p;
  }

  /**
   * @param from posicao do jogador
   * @param facing angulo para onde ele olha (rad)
   * @param power 0..1
   * @param arco multiplicador da subida; ver `throwToward`
   * @param curva aceleracao lateral em unidades/s2. Positiva e negativa saem
   * para lados opostos; ela decai sozinha durante o voo
   */
  throwFrom(from: THREE.Vector3, facing: number, power = 1, arco = 1, curva = 0): void {
    this.state = 'voando';
    this.mesh.visible = true;
    this.mesh.position.set(from.x, 1.15, from.z);
    this.mesh.rotation.set(0, this.mesh.rotation.y, 0);
    const speed = 11 * power;
    this.velocity.set(Math.sin(facing) * speed, 3.4 * power * arco, Math.cos(facing) * speed);
    this.curva = curva;
    this.spin = 22;
  }

  /** Grampeia o disco dentro das linhas. Devolve true se ele bateu na grade. */
  private bater(p: THREE.Vector3, v: THREE.Vector3, bounds: Bounds): boolean {
    const x = THREE.MathUtils.clamp(p.x, bounds.minX, bounds.maxX);
    const z = THREE.MathUtils.clamp(p.z, bounds.minZ, bounds.maxZ);
    if (x === p.x && z === p.z) return false;
    p.x = x;
    p.z = z;
    v.multiplyScalar(0.2);
    return true;
  }

  update(dt: number, bounds: Bounds): void {
    if (this.state !== 'voando') return;

    this.curva = this.passo(this.mesh.position, this.velocity, this.curva, dt);

    this.mesh.rotation.y += this.spin * dt;
    // o disco deita para o lado da curva: e o que faz a banana aparecer
    this.mesh.rotation.z = Math.sin(this.mesh.rotation.y) * 0.08 + this.curva * 0.06;

    if (this.bater(this.mesh.position, this.velocity, bounds)) this.curva = 0;

    if (this.mesh.position.y <= 0.06) {
      this.mesh.position.y = 0.06;
      this.mesh.rotation.z = 0;
      this.state = 'chao';
      this.velocity.set(0, 0, 0);
      this.curva = 0;
      this.onLand?.(this.mesh.position.clone());
    }
  }
}
