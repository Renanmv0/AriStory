import * as THREE from 'three';
import type { GameAPI, InteractableDef } from '../core/types';

/**
 * Um ponto interativo no mundo. Quando o jogador chega perto, o HUD mostra o
 * prompt com o nome e o ícone da ação.
 *
 * O OBJETO NÃO SE MEXE MAIS. Ele fazia um "respiro" — subia e descia 6 cm e
 * esticava 2% — enquanto estava selecionado. Saiu a pedido do Renan: o prompt
 * do HUD já diz o que está selecionado, e a peça balançando dava a impressão
 * de que o cenário era mole. O `highlight` continua na ficha porque é ele que
 * diz A QUE OBJETO a interação se refere, e é de lá que sai qualquer destaque
 * que a gente venha a querer no lugar (contorno, brilho) — só que agora ele
 * não é animado por ninguém.
 */
export class Interactable {
  readonly id: string;
  x: number;
  z: number;
  readonly radius: number;
  /**
   * O QUE O HUD ESCREVE. Nao e `readonly` porque um MESMO ponto pode significar
   * coisas diferentes conforme o estado: a mesa do turno do Mania e "Sentar
   * aqui", "Anotar o pedido", "Entregar o prato", "Receber a conta" e "Recolher
   * a louca" — cinco rotulos num ponto so. A alternativa era cinco pontos
   * empilhados por mesa, que e a mesma coisa escrita cinco vezes.
   */
  label: string;
  icon: string;
  readonly once: boolean;
  readonly priority: number;
  readonly highlight?: THREE.Object3D;

  private readonly run: (g: GameAPI) => void | Promise<void>;
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
