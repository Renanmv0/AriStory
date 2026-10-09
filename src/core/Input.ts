import type { EventoDeApontar } from './Apontador';

/**
 * Entrada unificada: teclado, mouse e um joystick virtual para celular.
 * Ninguem mais no jogo le eventos de DOM. (A excecao e a camera livre do
 * laboratorio: o `OrbitControls` ouve o canvas sozinho enquanto esta no ar.)
 */
export class Input {
  private readonly down = new Set<string>();
  private readonly pressed = new Set<string>();
  private stickX = 0;
  private stickY = 0;
  private stickId: number | null = null;
  private stickOrigin = { x: 0, y: 0 };
  /** ponteiro em coordenada de tela normalizada: -1..1, y para cima */
  private ponteiro = { x: 0, y: 0 };

  /** true enquanto o dialogo/menu esta aberto: movimento e ignorado */
  blocked = false;

  /**
   * O APONTADOR (`core/Apontador.ts`): cada evento de ponteiro passa por ele
   * primeiro. Quando ele responde `true` no aperto, o ponteiro era de uma
   * peca clicavel — e o dedo NAO vira joystick.
   */
  aoApontar: ((e: EventoDeApontar) => boolean) | null = null;
  /** o dedo que apertou um clicavel (e nao o joystick) */
  private apontadorId: number | null = null;
  /**
   * O MESMO dedo do joystick, visto pelos eventos de TOQUE (`touchmove`), e
   * nao pelos de ponteiro. Ver `onTouchStart`: e a rede de seguranca do iPhone.
   */
  private toqueDoManche: number | null = null;

  constructor(private readonly surface: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    surface.addEventListener('pointerdown', this.onPointerDown);
    surface.addEventListener('pointermove', this.onPointerMove);
    surface.addEventListener('pointerup', this.onPointerUp);
    surface.addEventListener('pointercancel', this.onPointerUp);
    surface.addEventListener('pointerleave', this.onPointerLeave);
    // `passive: false` e o que deixa o `preventDefault` valer (ver `onTouchStart`)
    surface.addEventListener('touchstart', this.onTouchStart, { passive: false });
    surface.addEventListener('touchmove', this.onTouchMove, { passive: false });
    surface.addEventListener('touchend', this.onTouchEnd);
    surface.addEventListener('touchcancel', this.onTouchEnd);
    surface.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * O JOYSTICK QUE SÓ VIRAVA O CORPO, no iPhone.
   *
   * Andando, a pessoa parava com o dedo encostado e, ao voltar a arrastar, o
   * corpo virava para o lado certo mas não saía do lugar — e só voltava a
   * andar depois de tirar o dedo e encostar de novo. No computador nunca
   * acontecia.
   *
   * Era o Safari: dedo parado por um instante é o começo de um TOQUE LONGO
   * (arrastar a imagem, a lupa de texto, o menu), e quando o dedo volta a
   * andar ele decide que aquilo é gesto dele e manda `pointercancel`. O
   * `touch-action: none` do canvas não cobre o toque longo. O jogo zerava o
   * manche no cancelamento e, dali em diante, o navegador não manda mais
   * nenhum `pointermove` daquele dedo: sobrava o primeiro quadro de direção,
   * que vira o corpo, e mais nada.
   *
   * Duas medidas, e uma segura a outra:
   *  - `preventDefault` no `touchstart`/`touchmove` do canvas: é o jeito de
   *    dizer ao Safari que o toque é do jogo, e o toque longo nem começa;
   *  - o manche também é lido pelos eventos de TOQUE. Se mesmo assim chegar
   *    um `pointercancel`, o `touchmove` continua chegando, e o manche segue.
   *
   * Os eventos de ponteiro vêm antes dos de toque, então quando o `touchstart`
   * chega o `pointerdown` já decidiu se o dedo é manche ou clique numa peça —
   * aqui só se acha QUAL toque é o do manche, pela posição de origem.
   */
  private onTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    if (this.stickId === null || this.toqueDoManche !== null) return;
    let melhor: Touch | null = null;
    let perto = Infinity;
    for (const t of Array.from(e.changedTouches)) {
      const d = Math.hypot(t.clientX - this.stickOrigin.x, t.clientY - this.stickOrigin.y);
      if (d < perto) {
        perto = d;
        melhor = t;
      }
    }
    if (melhor && perto < 24) this.toqueDoManche = melhor.identifier;
  };

  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    if (this.toqueDoManche === null) return;
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === this.toqueDoManche) this.mancheEm(t.clientX, t.clientY);
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    if (this.toqueDoManche === null) return;
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier !== this.toqueDoManche) continue;
      this.toqueDoManche = null;
      this.stickId = null;
      this.stickX = 0;
      this.stickY = 0;
    }
  };

  /** o manche a partir de onde o dedo está agora (a origem é onde ele encostou) */
  private mancheEm(x: number, y: number): void {
    const max = 60;
    const dx = Math.max(-max, Math.min(max, x - this.stickOrigin.x));
    const dy = Math.max(-max, Math.min(max, y - this.stickOrigin.y));
    this.stickX = dx / max;
    this.stickY = dy / max;
  }

  /** o ponteiro em -1..1 e em pixels, do jeito que o apontador quer */
  private apontar(tipo: EventoDeApontar['tipo'], e: PointerEvent): boolean {
    const r = this.surface.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = 1 - ((e.clientY - r.top) / r.height) * 2;
    return this.aoApontar?.({ tipo, x, y, px: e.clientX, py: e.clientY, toque: e.pointerType !== 'mouse' }) ?? false;
  }

  private onPointerLeave = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse') this.apontar('sai', e);
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    /*
     * TECLA DIGITADA NUM CAMPO DE TEXTO É DO CAMPO (a apostila do Gatito tem
     * exercício de escrever). Sem isto o `preventDefault` de baixo engolia o
     * "e", o "t", o "j" e o espaço — e o "j" ainda abria o diário no meio da
     * palavra. Só o Escape passa: ele fecha o painel até com o cursor no campo.
     */
    const alvo = e.target as HTMLElement | null;
    const campo = alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable);
    if (campo && e.code !== 'Escape') return;
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
    this.toqueDoManche = null;
    this.stickX = 0;
    this.stickY = 0;
  };

  private onPointerDown = (e: PointerEvent): void => {
    // um clicavel debaixo do ponteiro fica com ele: o dedo nao vira joystick
    if (this.apontar('desce', e)) {
      this.apontadorId = e.pointerId;
      this.surface.setPointerCapture(e.pointerId);
      return;
    }
    if (e.pointerType === 'mouse') return;
    this.stickId = e.pointerId;
    this.stickOrigin = { x: e.clientX, y: e.clientY };
    this.toqueDoManche = null;
    this.surface.setPointerCapture(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent): void => {
    // a posição do ponteiro é anotada sempre, mouse ou dedo: quem usa é o
    // minigame de ping pong, que move a raquete com ela
    const r = this.surface.getBoundingClientRect();
    this.ponteiro.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.ponteiro.y = 1 - ((e.clientY - r.top) / r.height) * 2;
    if (e.pointerType === 'mouse' || e.pointerId === this.apontadorId) this.apontar('move', e);

    if (e.pointerId !== this.stickId) return;
    this.mancheEm(e.clientX, e.clientY);
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' || e.pointerId === this.apontadorId) {
      this.apontar('sobe', e);
      if (e.pointerId === this.apontadorId) this.apontadorId = null;
    }
    if (e.pointerId !== this.stickId) return;
    // cancelado pelo navegador com o dedo ainda na tela: quem segue o manche
    // agora são os eventos de toque (ver `onTouchStart`), e ele não zera
    if (e.type === 'pointercancel' && this.toqueDoManche !== null) return;
    this.stickId = null;
    this.toqueDoManche = null;
    this.stickX = 0;
    this.stickY = 0;
  };

  /**
   * Onde o ponteiro está, em coordenada de tela: -1..1 nos dois eixos, com
   * `y` para cima. Serve para mira contínua — no ping pong é a raquete.
   */
  pointer(): { x: number; y: number } {
    return { x: this.ponteiro.x, y: this.ponteiro.y };
  }

  /** Vetor de movimento na tela: x = direita, y = para cima da tela. */
  move(): { x: number; y: number } {
    if (this.blocked) return { x: 0, y: 0 };
    return this.moveCru();
  }

  /**
   * O mesmo manche, lido CRU: chega mesmo com o movimento travado.
   *
   * O `move()` cala durante dialogo e cutscene — e o que impede de sair
   * andando no meio de uma fala. Mas na cabine da roda gigante a cutscene TIRA
   * o andar e devolve o OLHAR, no mesmo manche: setas, WASD ou o dedo no
   * joystick. Quem chama aqui esta assumindo que sabe o que fazer com isso.
   */
  moveCru(): { x: number; y: number } {
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

  /**
   * Botao virtual de girar a camera. -1 gira para um lado, 1 para o outro.
   *
   * Injeta a MESMA tecla do teclado em vez de chamar a camera direto: assim as
   * travas que ja existem (dialogo aberto, menu, troca de cena) valem para o
   * dedo sem precisar de uma segunda copia da regra.
   */
  tapGirar(dir: -1 | 1): void {
    this.pressed.add(dir < 0 ? 'KeyQ' : 'KeyR');
  }

  /** Segura/solta uma tecla virtual — usado pelo botao de acao no celular. */
  setVirtualDown(code: string, down: boolean): void {
    if (down) {
      if (!this.down.has(code)) this.pressed.add(code);
      this.down.add(code);
    } else {
      this.down.delete(code);
    }
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
const ACTION_KEYS = new Set(['Space', 'KeyE', 'KeyQ', 'KeyR', 'KeyJ', 'KeyT', 'KeyF', 'KeyH', 'KeyI', 'Tab']);
