import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';

/**
 * O CELULAR DE QUEM JOGA NA CARONA (o Renan de passageiro, `docs/BEBITO-MOBILE-DENTRO.md`):
 * um celular deitado, com a tela de um joguinho de arena pintada em canvas (um bonequinho
 * azul correndo, bolinhas amarelas de tiro, três bichos vermelhos atrás, o direcional e o
 * botão de tiro desenhados nos cantos). A tela é um jogo QUALQUER de arena, desenhado por
 * aqui: nenhuma arte, personagem nem logotipo de jogo de verdade — o nome do jogo só
 * aparece na fala.
 *
 * É uma peça que a câmera de dentro do carro carrega na frente dos olhos
 * (`CameraDeDentro.anexar`): a frente dela é o `+Z` (a câmera a olha de frente) e o relógio
 * da animação é o `update`. A tela é um `MeshBasicMaterial` com o canvas (como a TV da casa:
 * luz própria), refeito umas oito vezes por segundo.
 */

const L = 320;
const A = 180;

export class CelularDeJogo {
  readonly group = new THREE.Group();
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly textura: THREE.CanvasTexture;
  private tempo = 0;
  private proximoQuadro = 0;
  /** de 0 a 1: o quanto a partida já foi (o placarzinho enche) */
  placar = 0;

  constructor() {
    this.group.name = 'celular-de-jogo';
    this.group.visible = false;
    const canvas = document.createElement('canvas');
    canvas.width = L;
    canvas.height = A;
    this.ctx = canvas.getContext('2d');
    this.textura = new THREE.CanvasTexture(canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.pintar();
    // o corpo: um retângulo de quina redonda, escuro, e a tela um fio na frente dele
    const corpo = new THREE.Mesh(quina(0.33, 0.19, 0.012, 0.025), toon(P.bebitoBorracha));
    this.group.add(corpo);
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3 * (A / L)), new THREE.MeshBasicMaterial({ map: this.textura }));
    tela.position.z = 0.0072;
    tela.userData.semSombra = true;
    this.group.add(tela);
    this.group.traverse((o) => { o.castShadow = false; });
    // (a câmera de dentro o põe a ~40 cm dos olhos: deste tamanho ele fica na mão, e não vira uma bandeja)
    this.group.scale.setScalar(0.72);
  }

  mostrar(sim: boolean): void {
    this.group.visible = sim;
  }

  update(dt: number): void {
    if (!this.group.visible) return;
    this.tempo += dt;
    if (this.tempo >= this.proximoQuadro) {
      this.proximoQuadro = this.tempo + 0.12;
      this.pintar();
    }
  }

  /** um quadro do joguinho: tudo por seno, no relógio dele */
  private pintar(): void {
    const c = this.ctx;
    if (!c) return;
    const t = this.tempo;
    c.fillStyle = '#2f6f5a';
    c.fillRect(0, 0, L, A);
    // a arena: um quadriculado fraco e os arbustos (as manchas mais escuras)
    c.strokeStyle = 'rgba(255,255,255,0.08)';
    c.lineWidth = 1;
    for (let x = 0; x <= L; x += 20) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, A); c.stroke(); }
    for (let y = 0; y <= A; y += 20) { c.beginPath(); c.moveTo(0, y); c.lineTo(L, y); c.stroke(); }
    c.fillStyle = 'rgba(20,70,50,0.7)';
    for (const [x, y, r] of [[60, 50, 26], [250, 120, 30], [140, 140, 22]] as const) { c.beginPath(); c.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2); c.fill(); }
    // o bonequinho (azul): anda em oito pela arena e atira para onde olha
    const px = L / 2 + Math.sin(t * 0.9) * 90;
    const py = A / 2 + Math.sin(t * 1.8) * 36;
    // os bichos vermelhos atrás dele (cada um em atraso)
    for (let i = 0; i < 3; i++) {
      const ex = L / 2 + Math.sin(t * 0.9 - 0.9 - i * 0.7) * (90 + i * 14);
      const ey = A / 2 + Math.sin(t * 1.8 - 1.8 - i * 1.3) * (36 + i * 8);
      c.fillStyle = '#e0554a';
      c.beginPath(); c.arc(ex, ey, 10, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(ex - 3, ey - 2, 2.2, 0, Math.PI * 2); c.arc(ex + 3, ey - 2, 2.2, 0, Math.PI * 2); c.fill();
    }
    // os tiros: três bolinhas amarelas saindo dele para a frente
    c.fillStyle = '#ffd84a';
    for (let k = 0; k < 3; k++) {
      const d = ((t * 90 + k * 22) % 66) + 12;
      c.beginPath(); c.arc(px - d * Math.cos(t * 0.9) * 0.6, py - d * 0.2, 4, 0, Math.PI * 2); c.fill();
    }
    c.fillStyle = '#4aa8ff';
    c.beginPath(); c.arc(px, py, 12, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 2.5;
    c.stroke();
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(px - 4, py - 2, 2.4, 0, Math.PI * 2); c.arc(px + 4, py - 2, 2.4, 0, Math.PI * 2); c.fill();
    // o direcional (esquerda) e o botão de tiro (direita), meio transparentes
    c.fillStyle = 'rgba(255,255,255,0.16)';
    c.beginPath(); c.arc(38, A - 38, 24, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.32)';
    c.beginPath(); c.arc(38 + Math.sin(t * 1.3) * 7, A - 38 + Math.cos(t * 1.3) * 7, 10, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,200,80,0.45)';
    c.beginPath(); c.arc(L - 38, A - 38, 20, 0, Math.PI * 2); c.fill();
    // a barrinha de cima (a partida)
    c.fillStyle = 'rgba(0,0,0,0.35)';
    c.fillRect(70, 8, L - 140, 8);
    c.fillStyle = '#ffd84a';
    c.fillRect(70, 8, (L - 140) * Math.min(1, 0.15 + this.placar), 8);
    this.textura.needsUpdate = true;
  }
}
