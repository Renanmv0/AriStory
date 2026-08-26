/**
 * Entrada unificada: teclado, mouse e um joystick virtual para celular.
 * Ninguem mais no jogo le eventos de DOM.
 */
export class Input {
  private readonly down = new Set<string>();
  private readonly pressed = new Set<string>();
  private stickX = 0;
  private stickY = 0;
  private stickId: number | null = null;
  private stickOrigin = { x: 0, y: 0 };

  /** true enquanto o dialogo/menu esta aberto: movimento e ignorado */
  blocked = false;

  constructor(private readonly surface: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    surface.addEventListener('pointerdown', this.onPointerDown);
    surface.addEventListener('pointermove', this.onPointerMove);
    surface.addEventListener('pointerup', this.onPointerUp);
    surface.addEventListener('pointercancel', this.onPointerUp);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    const code = e.code;
    if (MOVEMENT_KEYS.has(code) || ACTION_KEYS.has(code)) e.preventDefault();
    if (!this.down.has(code)) this.pressed.add(code);
    this.down.add(code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.down.delete(e.code);
  };

  private onBlur = (): void => {
    this.down.clear();
    this.stickId = null;
    this.stickX = 0;
    this.stickY = 0;
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse') return;
    this.stickId = e.pointerId;
    this.stickOrigin = { x: e.clientX, y: e.clientY };
    this.surface.setPointerCapture(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.stickId) return;
    const max = 60;
    const dx = Math.max(-max, Math.min(max, e.clientX - this.stickOrigin.x));
    const dy = Math.max(-max, Math.min(max, e.clientY - this.stickOrigin.y));
    this.stickX = dx / max;
    this.stickY = dy / max;
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.stickId) return;
    this.stickId = null;
    this.stickX = 0;
    this.stickY = 0;
  };

  /** Vetor de movimento na tela: x = direita, y = para cima da tela. */
  move(): { x: number; y: number } {
    if (this.blocked) return { x: 0, y: 0 };
    let x = this.stickX;
    let y = -this.stickY;
    if (this.down.has('KeyA') || this.down.has('ArrowLeft')) x -= 1;
    if (this.down.has('KeyD') || this.down.has('ArrowRight')) x += 1;
    if (this.down.has('KeyW') || this.down.has('ArrowUp')) y += 1;
    if (this.down.has('KeyS') || this.down.has('ArrowDown')) y -= 1;
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    return { x, y };
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  /** true apenas no frame em que a tecla desceu */
  justPressed(code: string): boolean {
    return this.pressed.has(code);
  }

  /** botao virtual do HUD tocado neste frame */
  tapAction(): void {
    this.pressed.add('KeyE');
  }

  /** botao virtual de trocar de personagem */
  tapSwap(): void {
    this.pressed.add('KeyT');
  }

  endFrame(): void {
    this.pressed.clear();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
  }
}

const MOVEMENT_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const ACTION_KEYS = new Set(['Space', 'KeyE', 'KeyQ', 'KeyR', 'KeyJ', 'KeyT']);
