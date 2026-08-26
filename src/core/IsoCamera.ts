import * as THREE from 'three';

/**
 * Camera ortografica isometrica. Ela nunca inclina: so gira em passos de 45
 * graus (para ver atras de um predio) e da zoom. O alvo e seguido com suavizacao.
 */
export class IsoCamera {
  readonly camera: THREE.OrthographicCamera;

  /** altura angular da camera; 35.26 graus e o isometrico verdadeiro */
  private readonly pitch = THREE.MathUtils.degToRad(34);
  private readonly distance = 60;

  private yaw = Math.PI / 4;
  private targetYaw = Math.PI / 4;
  private viewSize = 13;
  private targetViewSize = 13;

  private readonly focus = new THREE.Vector3();
  private readonly desired = new THREE.Vector3();
  private aspect = 1;

  constructor() {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(width: number, height: number): void {
    this.aspect = width / Math.max(1, height);
    this.applyFrustum();
  }

  private applyFrustum(): void {
    const h = this.viewSize / 2;
    const w = h * this.aspect;
    this.camera.left = -w;
    this.camera.right = w;
    this.camera.top = h;
    this.camera.bottom = -h;
    this.camera.updateProjectionMatrix();
  }

  /** gira 45 graus para um lado */
  rotate(dir: number): void {
    this.targetYaw += (Math.PI / 4) * Math.sign(dir);
  }

  zoomBy(delta: number): void {
    this.targetViewSize = THREE.MathUtils.clamp(this.targetViewSize + delta, 4, 26);
  }

  /** enquadramento atual (ja suavizado) */
  get currentViewSize(): number {
    return this.viewSize;
  }

  setViewSize(size: number): void {
    this.targetViewSize = Math.max(3, size);
  }

  /** coloca a camera direto no alvo, sem animacao (usado ao trocar de cena) */
  snapTo(target: THREE.Vector3): void {
    this.focus.copy(target);
    this.yaw = this.targetYaw;
    this.viewSize = this.targetViewSize;
    this.applyFrustum();
    this.place();
  }

  update(dt: number, target: THREE.Vector3): void {
    const k = 1 - Math.pow(0.001, dt);
    this.focus.lerp(target, k);
    this.yaw += (this.targetYaw - this.yaw) * Math.min(1, dt * 7);

    if (Math.abs(this.targetViewSize - this.viewSize) > 0.001) {
      this.viewSize += (this.targetViewSize - this.viewSize) * Math.min(1, dt * 7);
      this.applyFrustum();
    }
    this.place();
  }

  private place(): void {
    // quando o enquadramento abre, a mira sobe: e sinal de que ha algo alto
    // em cena (a roda gigante, um predio) que precisa caber na tela.
    const bias = Math.max(0, this.viewSize - 14) * 0.38;
    const fy = this.focus.y + bias;
    const cp = Math.cos(this.pitch);
    this.desired.set(
      this.focus.x + Math.sin(this.yaw) * cp * this.distance,
      fy + Math.sin(this.pitch) * this.distance,
      this.focus.z + Math.cos(this.yaw) * cp * this.distance,
    );
    this.camera.position.copy(this.desired);
    this.camera.lookAt(this.focus.x, fy, this.focus.z);
  }

  /**
   * Converte a entrada de tela (x direita, y para cima) em direcao de mundo,
   * respeitando a rotacao atual da camera.
   */
  screenToWorld(x: number, y: number, out: THREE.Vector3): THREE.Vector3 {
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    // frente da camera projetada no chao = (-sin, 0, -cos); direita = (cos, 0, -sin)
    out.set(x * cos - y * sin, 0, -x * sin - y * cos);
    return out;
  }
}
