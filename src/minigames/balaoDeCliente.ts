import * as THREE from 'three';
import type { PratoDoCardapio } from '../world/cardapioData';

/**
 * O BALÃO QUE FLUTUA SOBRE A CABEÇA DO CLIENTE, com o arco de paciência.
 *
 * É a única coisa que o jogador olha durante o turno. Ele precisa responder a
 * três perguntas em um relance, sem texto: **quem está esperando o quê**, **há
 * quanto tempo** e **qual é o próximo a estourar**.
 *
 * POR QUE UM SPRITE, e não uma placa no mundo. A câmera gira em passos de 45°
 * (Q/R), e um plano fixo viraria uma lâmina de perfil em metade das voltas. O
 * sprite fica sempre de frente, de graça.
 *
 * O DESENHO É UM CANVAS SÓ, redesenhado quando muda de verdade — quando o
 * conteúdo troca ou quando a paciência anda um passo de 1/24. Redesenhar todo
 * quadro seria repintar 60 canvas por segundo por cliente; a 1/24 o arco
 * continua parecendo contínuo e o custo cai para ~1 por segundo.
 *
 * O PRATO DENTRO DO BALÃO É A MINIATURA DO CARDÁPIO — a mesma
 * `PratoDoCardapio.pintar()` que desenha a folha do cardápio. O cliente pensa
 * literalmente na figura que a dupla viu ao pedir, e ninguém precisa aprender
 * um segundo vocabulário de ícones.
 */

/** o que o balão mostra agora */
export type ConteudoDoBalao =
  | { tipo: 'chegando' }
  | { tipo: 'lendo' }
  | { tipo: 'pedindo' }
  | { tipo: 'prato'; prato: PratoDoCardapio }
  | { tipo: 'comendo' }
  | { tipo: 'conta' };

const LADO = 192;

export class BalaoDeCliente {
  readonly sprite: THREE.Sprite;

  private readonly canvas: HTMLCanvasElement;
  private readonly textura: THREE.CanvasTexture;
  private conteudo: ConteudoDoBalao = { tipo: 'lendo' };
  private paciencia = 1;
  /** o que já está pintado, para não repintar igual */
  private pintado = '';

  constructor(altura: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = LADO;
    this.canvas.height = LADO;
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textura,
      transparent: true,
      // sem profundidade: o balão é HUD no mundo, e não pode ser comido pela
      // mesa que está na frente do cliente
      depthTest: false,
      depthWrite: false,
    }));
    this.sprite.scale.setScalar(1.12);
    this.sprite.position.y = altura;
    this.sprite.renderOrder = 900;
    this.desenhar();
  }

  mostrar(conteudo: ConteudoDoBalao, paciencia: number): void {
    this.conteudo = conteudo;
    this.paciencia = Math.max(0, Math.min(1, paciencia));
    this.desenhar();
  }

  set visivel(v: boolean) {
    this.sprite.visible = v;
  }

  descartar(): void {
    this.sprite.material.dispose();
    this.textura.dispose();
  }

  // ------------------------------------------------------------- o desenho

  private desenhar(): void {
    const passo = Math.round(this.paciencia * 24);
    const assinatura = `${this.conteudo.tipo}:${
      this.conteudo.tipo === 'prato' ? this.conteudo.prato.id : ''
    }:${passo}`;
    if (assinatura === this.pintado) return;
    this.pintado = assinatura;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, LADO, LADO);
    const cx = LADO / 2;
    const cy = LADO / 2 - 8;

    this.arco(ctx, cx, cy, passo / 24);

    // o balão: um disco branco com um rabinho apontando para a cabeça
    ctx.fillStyle = '#fffdf7';
    ctx.beginPath();
    ctx.moveTo(cx - 13, cy + 56);
    ctx.lineTo(cx + 2, cy + 82);
    ctx.lineTo(cx + 13, cy + 54);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    this.recheio(ctx, cx, cy);

    /**
     * SEM ISTO O BALÃO CONGELA NO PRIMEIRO DESENHO. O canvas muda, mas a
     * textura já foi enviada para a GPU e ninguém pediu para reenviar: o
     * cliente ficava com "…" na cabeça a visita inteira, mesmo depois de pedir.
     */
    this.textura.needsUpdate = true;
  }

  /**
   * O ARCO DE PACIÊNCIA, por fora do balão.
   *
   * Ele ANDA NO SENTIDO HORÁRIO a partir do topo e ENCOLHE: cheio é uma volta
   * inteira, vazio é nada. Encolher lê como "está acabando" muito mais rápido
   * do que crescer, que lê como "está carregando".
   *
   * A cor muda em dois degraus e não continuamente: verde, âmbar, vermelho.
   * Gradiente contínuo não dá para ler de relance — degrau dá.
   */
  private arco(ctx: CanvasRenderingContext2D, cx: number, cy: number, valor: number): void {
    ctx.strokeStyle = 'rgba(60, 44, 30, 0.16)';
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.arc(cx, cy, 71, 0, Math.PI * 2);
    ctx.stroke();

    if (valor <= 0) return;
    ctx.strokeStyle = valor > 0.5 ? '#5fbf6a' : valor > 0.25 ? '#f0a83c' : '#e0574a';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, 71, -Math.PI / 2, -Math.PI / 2 + valor * Math.PI * 2);
    ctx.stroke();
  }

  private recheio(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
    const c = this.conteudo;
    if (c.tipo === 'prato') {
      // a miniatura do cardápio, recortada em círculo para não virar um
      // quadrado dentro de um balão redondo
      const s = 104;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 51, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(cx - s / 2, cy - s / 2);
      c.prato.pintar(ctx, s);
      ctx.restore();
      return;
    }

    /**
     * UM GLIFO POR FASE, e cada um diz uma coisa diferente sem texto:
     * quem está na porta levanta a mão pedindo mesa, quem sentou está lendo,
     * quem já escolheu grita um "!", quem come está feliz e quem acabou quer a
     * conta. Só o "!" é vermelho — é o único que quer dizer "agora".
     */
    const glifo = c.tipo === 'chegando' ? '🙋'
      : c.tipo === 'pedindo' ? '!'
        : c.tipo === 'conta' ? 'R$'
          : c.tipo === 'comendo' ? '😋' : '…';
    ctx.fillStyle = c.tipo === 'pedindo' ? '#e0574a' : '#4a3a2a';
    ctx.font = `bold ${c.tipo === 'conta' ? 44 : c.tipo === 'comendo' || c.tipo === 'chegando' ? 56 : 72}px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(glifo, cx, cy + (c.tipo === 'lendo' ? -8 : 4));
  }
}
