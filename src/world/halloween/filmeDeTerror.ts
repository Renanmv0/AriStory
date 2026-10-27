import * as THREE from 'three';

/*
 * O FILME DE TERROR DA TV DA SALA — o que começa o especial de Halloween
 * (`docs/HALLOWEEN.md`, §2.1). Mais fofo do que assustador: a lua grande, a
 * casinha torta no morro com as janelas acesas, a árvore seca, os morcegos
 * batendo asa, a abóbora acesa na frente e o fantasminha flutuando, que de
 * vez em quando dá um "bu!".
 *
 * É a mesma ideia do show da TV de sempre (`telaDeTvLigada`, em
 * `moveisDaCasa.ts`): um canvas no lugar da tela. Só que este ANDA — a cena
 * chama `update(tempo)` enquanto o filme passa, e o desenho é refeito no
 * máximo doze vezes por segundo (e nunca com a tela desligada).
 *
 * As cores são do desenho (são tinta de canvas, como as memórias do quadro).
 */
export class FilmeDeTerror {
  readonly material: THREE.MeshBasicMaterial;
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly textura: THREE.CanvasTexture;
  private ultimo = -1;
  private static readonly W = 384;
  private static readonly H = 216;

  constructor() {
    const canvas = document.createElement('canvas');
    canvas.width = FilmeDeTerror.W;
    canvas.height = FilmeDeTerror.H;
    this.ctx = canvas.getContext('2d');
    this.textura = new THREE.CanvasTexture(canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.MeshBasicMaterial({ map: this.textura });
    this.pintar(0);
  }

  /** `t` em segundos de filme; redesenha no máximo 12 vezes por segundo. */
  update(t: number): void {
    const quadro = Math.floor(t * 12);
    if (quadro === this.ultimo) return;
    this.ultimo = quadro;
    this.pintar(t);
    this.textura.needsUpdate = true;
  }

  private pintar(t: number): void {
    const c = this.ctx;
    if (!c) return;
    const W = FilmeDeTerror.W;
    const H = FilmeDeTerror.H;

    // o céu: roxo-noite descendo para um anil mais quente no horizonte
    const ceu = c.createLinearGradient(0, 0, 0, H);
    ceu.addColorStop(0, '#1a1340');
    ceu.addColorStop(0.65, '#3d2a6b');
    ceu.addColorStop(1, '#6b3f74');
    c.fillStyle = ceu;
    c.fillRect(0, 0, W, H);

    // as estrelas, piscando cada uma no seu tempo
    for (let i = 0; i < 22; i++) {
      const x = (i * 97.3) % W;
      const y = (i * 41.7) % (H * 0.55);
      const brilho = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.7));
      c.fillStyle = `rgba(255,248,220,${brilho.toFixed(2)})`;
      c.fillRect(x, y, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2);
    }

    // a lua grande, com o halo e as crateras
    const lx = W * 0.72;
    const ly = H * 0.3;
    const halo = c.createRadialGradient(lx, ly, 20, lx, ly, 70);
    halo.addColorStop(0, 'rgba(255,240,190,0.45)');
    halo.addColorStop(1, 'rgba(255,240,190,0)');
    c.fillStyle = halo;
    c.fillRect(lx - 70, ly - 70, 140, 140);
    c.fillStyle = '#fff1c4';
    c.beginPath();
    c.arc(lx, ly, 30, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(214,190,140,0.55)';
    for (const [dx, dy, r] of [[-9, -6, 6], [8, 7, 4.5], [10, -10, 3], [-4, 12, 3.5]] as const) {
      c.beginPath();
      c.arc(lx + dx, ly + dy, r, 0, Math.PI * 2);
      c.fill();
    }

    // o morro e a casinha torta lá em cima, com as janelas acesas
    c.fillStyle = '#24183d';
    c.beginPath();
    c.moveTo(0, H * 0.82);
    c.quadraticCurveTo(W * 0.3, H * 0.52, W * 0.62, H * 0.7);
    c.quadraticCurveTo(W * 0.85, H * 0.8, W, H * 0.74);
    c.lineTo(W, H);
    c.lineTo(0, H);
    c.closePath();
    c.fill();
    const hx = W * 0.3;
    const hy = H * 0.6;
    c.save();
    c.translate(hx, hy);
    c.rotate(-0.06);
    c.fillStyle = '#160f2a';
    c.fillRect(-24, -34, 48, 36);
    // o telhado torto e a chaminé
    c.beginPath();
    c.moveTo(-31, -32);
    c.lineTo(4, -64);
    c.lineTo(30, -30);
    c.closePath();
    c.fill();
    c.fillRect(12, -60, 7, 18);
    // a torrinha
    c.fillRect(-20, -52, 14, 22);
    c.beginPath();
    c.moveTo(-23, -50);
    c.lineTo(-13, -68);
    c.lineTo(-3, -50);
    c.closePath();
    c.fill();
    // as janelas: amarelas, a de cima piscando como vela
    const vela = 0.75 + 0.25 * Math.sin(t * 9) * Math.sin(t * 5.3);
    c.fillStyle = `rgba(255,205,90,${vela.toFixed(2)})`;
    c.fillRect(-16, -24, 9, 10);
    c.fillRect(6, -24, 9, 10);
    c.fillRect(-16, -44, 6, 7);
    c.fillStyle = '#ffcf6a';
    c.fillRect(-5, -14, 10, 16);
    c.restore();

    // a árvore seca na esquerda, de galhos tortos
    c.strokeStyle = '#140d24';
    c.lineCap = 'round';
    const galho = (x: number, y: number, ang: number, comp: number, larg: number, n: number): void => {
      const x2 = x + Math.cos(ang) * comp;
      const y2 = y + Math.sin(ang) * comp;
      c.lineWidth = larg;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x2, y2);
      c.stroke();
      if (n > 0) {
        galho(x2, y2, ang - 0.5, comp * 0.66, larg * 0.62, n - 1);
        galho(x2, y2, ang + 0.42, comp * 0.62, larg * 0.62, n - 1);
      }
    };
    galho(W * 0.08, H * 0.9, -Math.PI / 2 + 0.08, 44, 9, 3);

    // os morcegos, batendo asa e atravessando o céu devagar
    for (let i = 0; i < 3; i++) {
      const x = ((t * (16 + i * 5) + i * 140) % (W + 60)) - 30;
      const y = H * (0.18 + i * 0.1) + Math.sin(t * 2 + i) * 6;
      const asa = Math.sin(t * 14 + i * 2);
      c.fillStyle = '#120b20';
      c.beginPath();
      c.ellipse(x, y, 4, 3, 0, 0, Math.PI * 2);
      c.fill();
      for (const lado of [-1, 1]) {
        c.beginPath();
        c.moveTo(x, y);
        c.quadraticCurveTo(x + lado * 7, y - 6 * asa, x + lado * 14, y - 2 * asa);
        c.quadraticCurveTo(x + lado * 9, y + 2, x, y + 1);
        c.fill();
      }
    }

    // a abóbora acesa no pé do morro, com o brilho em volta
    const ax = W * 0.84;
    const ay = H * 0.86;
    const luz = c.createRadialGradient(ax, ay, 4, ax, ay, 34);
    luz.addColorStop(0, `rgba(255,170,60,${(0.5 * vela).toFixed(2)})`);
    luz.addColorStop(1, 'rgba(255,170,60,0)');
    c.fillStyle = luz;
    c.fillRect(ax - 34, ay - 34, 68, 68);
    c.fillStyle = '#e8792b';
    for (const [dx, r] of [[-7, 9], [7, 9], [0, 11]] as const) {
      c.beginPath();
      c.ellipse(ax + dx, ay, r, 11, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#3d6b2e';
    c.fillRect(ax - 1.5, ay - 15, 3, 5);
    c.fillStyle = `rgba(255,224,120,${vela.toFixed(2)})`;
    c.beginPath();
    c.moveTo(ax - 7, ay - 4);
    c.lineTo(ax - 3, ay - 4);
    c.lineTo(ax - 5, ay - 8);
    c.closePath();
    c.moveTo(ax + 3, ay - 4);
    c.lineTo(ax + 7, ay - 4);
    c.lineTo(ax + 5, ay - 8);
    c.closePath();
    c.fill();
    c.beginPath();
    c.arc(ax, ay + 1, 6, 0.1, Math.PI - 0.1);
    c.fill();

    // O FANTASMINHA: flutua, balança a barra e, a cada tantos segundos, dá
    // um "bu!" — e fica com cara de quem se assustou com o próprio susto
    const gx = W * 0.52 + Math.sin(t * 0.7) * 30;
    const gy = H * 0.48 + Math.sin(t * 2.1) * 7;
    const fase = t % 6;
    const bu = fase > 4.2 && fase < 5.4;
    c.save();
    c.translate(gx, gy);
    const brilhoDoFantasma = c.createRadialGradient(0, 0, 10, 0, 0, 44);
    brilhoDoFantasma.addColorStop(0, 'rgba(230,240,255,0.35)');
    brilhoDoFantasma.addColorStop(1, 'rgba(230,240,255,0)');
    c.fillStyle = brilhoDoFantasma;
    c.fillRect(-44, -44, 88, 88);
    c.fillStyle = '#f7f9ff';
    c.beginPath();
    c.arc(0, -6, 20, Math.PI, 0);
    c.lineTo(20, 16);
    for (let k = 0; k <= 5; k++) {
      const x = 20 - (k * 40) / 5;
      const y = 16 + (k % 2 === 0 ? 0 : 6) + Math.sin(t * 6 + k) * 2;
      c.lineTo(x, y);
    }
    c.closePath();
    c.fill();
    // os bracinhos
    c.beginPath();
    c.ellipse(-20, 2 + (bu ? -8 : 0), 6, 4, bu ? -0.9 : 0.4, 0, Math.PI * 2);
    c.ellipse(20, 2 + (bu ? -8 : 0), 6, 4, bu ? 0.9 : -0.4, 0, Math.PI * 2);
    c.fill();
    // a carinha: olhos ovais, bochecha rosa e a boquinha
    c.fillStyle = '#26203a';
    c.beginPath();
    c.ellipse(-7, -8, 3.2, bu ? 5 : 4.2, 0, 0, Math.PI * 2);
    c.ellipse(7, -8, 3.2, bu ? 5 : 4.2, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#ffffff';
    c.fillRect(-7, -11, 1.6, 1.6);
    c.fillRect(7, -11, 1.6, 1.6);
    c.fillStyle = 'rgba(255,150,170,0.75)';
    c.beginPath();
    c.ellipse(-12, -1, 3.4, 2, 0, 0, Math.PI * 2);
    c.ellipse(12, -1, 3.4, 2, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#26203a';
    c.beginPath();
    if (bu) c.ellipse(0, 2, 3.4, 4.2, 0, 0, Math.PI * 2);
    else c.arc(0, 0, 3, 0.15, Math.PI - 0.15);
    c.fill();
    c.restore();

    // o balãozinho do "bu!"
    if (bu) {
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.ellipse(gx + 40, gy - 30, 20, 12, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.moveTo(gx + 26, gy - 22);
      c.lineTo(gx + 18, gy - 12);
      c.lineTo(gx + 32, gy - 20);
      c.closePath();
      c.fill();
      c.fillStyle = '#3d2a6b';
      c.font = 'bold 15px sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('bu!', gx + 40, gy - 30);
    }

    // a vinheta de cinema nas bordas
    const vinheta = c.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.62);
    vinheta.addColorStop(0, 'rgba(0,0,0,0)');
    vinheta.addColorStop(1, 'rgba(8,4,20,0.55)');
    c.fillStyle = vinheta;
    c.fillRect(0, 0, W, H);
  }

  dispose(): void {
    this.textura.dispose();
    this.material.dispose();
  }
}
