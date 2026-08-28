import * as THREE from 'three';
import type { GameAPI, InteractableDef } from '../core/types';

/**
 * Um ponto interativo no mundo. Quando o jogador chega perto, o HUD mostra o
 * prompt e o objeto destacado faz um leve "respiro".
 */
export class Interactable {
  readonly id: string;
  x: number;
  z: number;
  readonly radius: number;
  readonly label: string;
  readonly icon: string;
  readonly once: boolean;
  readonly priority: number;
  readonly highlight?: THREE.Object3D;

  private readonly run: (g: GameAPI) => void | Promise<void>;
  private baseY = 0;
  private baseScale = 1;
  private hot = false;
  private pulse = 0;
  used = false;
  busy = false;
  /** desligado nao aparece no HUD nem responde (usado por minigames) */
  enabled = true;

  constructor(def: InteractableDef) {
    this.id = def.id ?? `${def.label}@${def.x},${def.z}`;
    this.x = def.x;
    this.z = def.z;
    this.radius = def.radius ?? 2;
    this.label = def.label;
    this.icon = def.icon ?? '✨';
    this.once = def.once ?? false;
    this.priority = def.priority ?? 0;
    this.highlight = def.highlight;
    this.run = def.onInteract;
    if (this.highlight) {
      this.baseY = this.highlight.position.y;
      this.baseScale = this.highlight.scale.y;
    }
  }

  get available(): boolean {
    return this.enabled && !this.busy && !(this.once && this.used);
  }

  /** move o ponto de interacao (usado por objetos que andam, tipo o frisbee) */
  moveTo(x: number, z: number): void {
    this.x = x;
    this.z = z;
  }

  distanceTo(x: number, z: number): number {
    return Math.hypot(x - this.x, z - this.z);
  }

  setHot(hot: boolean): void {
    this.hot = hot;
  }

  update(dt: number): void {
    if (!this.highlight) return;
    // Desligado volta para a pose de fábrica NA HORA, sem esperar o respiro
    // decair. Minigame que usa o próprio objeto como palco — a mesa de ping
    // pong, que é o pai da bolinha e das raquetes — não pode ter o palco
    // balançando debaixo da partida.
    if (!this.enabled) {
      this.hot = false;
      this.pulse = 0;
      this.highlight.position.y = this.baseY;
      this.highlight.scale.y = this.baseScale;
      return;
    }
    const target = this.hot ? 1 : 0;
    this.pulse += (target - this.pulse) * Math.min(1, dt * 8);
    if (this.pulse < 0.001) {
      this.highlight.position.y = this.baseY;
      this.highlight.scale.y = this.baseScale;
      return;
    }
    const t = performance.now() / 1000;
    this.highlight.position.y = this.baseY + Math.sin(t * 4) * 0.06 * this.pulse;
    this.highlight.scale.y = this.baseScale * (1 + Math.sin(t * 4 + 1) * 0.02 * this.pulse);
  }

  async trigger(g: GameAPI): Promise<void> {
    if (!this.available) return;
    this.busy = true;
    try {
      await this.run(g);
      this.used = true;
    } finally {
      this.busy = false;
    }
  }
}
