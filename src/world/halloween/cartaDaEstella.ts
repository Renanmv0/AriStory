import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import type { MemoriaPintada } from '../memoriasData';

/*
 * A CARTA DA ESTELLA — o convite do especial de Halloween, que desliza por
 * baixo da porta da sala no meio do filme (`docs/HALLOWEEN.md`, §2.1).
 *
 * Duas coisas moram aqui:
 * - `envelopeDeHalloween()`: a PEÇA no chão — o envelope laranja de papel,
 *   com a aba desenhada, o endereço na letra dela, os morceguinhos e as
 *   aboborinhas de carimbo, o pesponto (ela é costureira) e o LACRE de cera
 *   roxa com o morceguinho em relevo;
 * - `CARTA_DA_ESTELLA`: a carta ABERTA, pintada em canvas, que o painel do
 *   quadro de memórias mostra (`g.lerCarta`). Ela é desenhada ao vivo: os
 *   morcegos batem asa, a aranhinha balança no fio e as abóboras tremem.
 */

/** o tamanho do envelope no chão (o mundo é chibi: um tico maior que o real) */
const ENVELOPE = { largura: 0.5, fundo: 0.33, grossura: 0.012 };

/** o desenho do lado de cima do envelope, feito uma vez só */
let texturaDoEnvelope: THREE.CanvasTexture | null = null;

function desenhoDoEnvelope(): THREE.CanvasTexture {
  if (texturaDoEnvelope) return texturaDoEnvelope;
  const W = 512;
  const H = Math.round((W * ENVELOPE.fundo) / ENVELOPE.largura);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext('2d');
  if (c) {
    // o papel: branco por baixo (o material dá o laranja), com fibra miúda
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 900; i++) {
      const x = (i * 131.7) % W;
      const y = (i * 71.3) % H;
      c.fillStyle = `rgba(150,90,40,${0.04 + ((i * 7) % 5) * 0.012})`;
      c.fillRect(x, y, 2, 2);
    }
    // a aba: o V da dobra, com a sombrinha embaixo dela
    c.fillStyle = 'rgba(160,80,20,0.12)';
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(W / 2, H * 0.58);
    c.lineTo(W, 0);
    c.lineTo(W, 8);
    c.lineTo(W / 2, H * 0.58 + 8);
    c.lineTo(0, 8);
    c.closePath();
    c.fill();
    c.strokeStyle = 'rgba(120,55,15,0.55)';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(4, 4);
    c.lineTo(W / 2, H * 0.58);
    c.lineTo(W - 4, 4);
    c.stroke();
    // as dobras de baixo, mais fracas
    c.strokeStyle = 'rgba(120,55,15,0.25)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(4, H - 4);
    c.lineTo(W * 0.36, H * 0.62);
    c.moveTo(W - 4, H - 4);
    c.lineTo(W * 0.64, H * 0.62);
    c.stroke();
    // o PESPONTO em volta: a Estella não manda nada sem costura
    c.strokeStyle = 'rgba(90,30,110,0.85)';
    c.lineWidth = 3;
    c.setLineDash([10, 8]);
    c.strokeRect(14, 14, W - 28, H - 28);
    c.setLineDash([]);
    // os carimbos: morceguinhos e aboborinhas nos cantos de baixo
    const morceguinho = (x: number, y: number, s: number): void => {
      c.fillStyle = 'rgba(55,25,75,0.8)';
      c.beginPath();
      c.ellipse(x, y, 5 * s, 4 * s, 0, 0, Math.PI * 2);
      c.fill();
      for (const lado of [-1, 1]) {
        c.beginPath();
        c.moveTo(x, y);
        c.quadraticCurveTo(x + lado * 10 * s, y - 9 * s, x + lado * 20 * s, y - 3 * s);
        c.quadraticCurveTo(x + lado * 15 * s, y + 1 * s, x + lado * 12 * s, y + 4 * s);
        c.quadraticCurveTo(x + lado * 8 * s, y + 1 * s, x, y + 3 * s);
        c.fill();
      }
    };
    const aboborinha = (x: number, y: number, s: number): void => {
      c.fillStyle = 'rgba(200,90,20,0.85)';
      for (const [dx, r] of [[-5, 7], [5, 7], [0, 8.5]] as const) {
        c.beginPath();
        c.ellipse(x + dx * s, y, r * s, 8 * s, 0, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = 'rgba(60,110,40,0.9)';
      c.fillRect(x - 1.5 * s, y - 12 * s, 3 * s, 5 * s);
    };
    morceguinho(W * 0.12, H * 0.82, 1.3);
    morceguinho(W * 0.2, H * 0.72, 0.9);
    aboborinha(W * 0.86, H * 0.8, 1.4);
    aboborinha(W * 0.78, H * 0.86, 1);
    // o endereço, na letra dela
    c.fillStyle = 'rgba(70,25,85,0.9)';
    c.font = 'bold 34px Caveat, "Segoe Print", cursive';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('Para: Ari & Renan', W / 2, H * 0.8);
  }
  texturaDoEnvelope = new THREE.CanvasTexture(canvas);
  texturaDoEnvelope.colorSpace = THREE.SRGBColorSpace;
  return texturaDoEnvelope;
}

/** a forma de um retângulo de cantos redondos, centrado */
function cantosRedondos(l: number, a: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-l / 2 + r, -a / 2);
  s.lineTo(l / 2 - r, -a / 2);
  s.quadraticCurveTo(l / 2, -a / 2, l / 2, -a / 2 + r);
  s.lineTo(l / 2, a / 2 - r);
  s.quadraticCurveTo(l / 2, a / 2, l / 2 - r, a / 2);
  s.lineTo(-l / 2 + r, a / 2);
  s.quadraticCurveTo(-l / 2, a / 2, -l / 2, a / 2 - r);
  s.lineTo(-l / 2, -a / 2 + r);
  s.quadraticCurveTo(-l / 2, -a / 2, -l / 2 + r, -a / 2);
  return s;
}

/** o morceguinho de perfil chapado, para o relevo do lacre */
function formaDeMorcego(s: number): THREE.Shape {
  const f = new THREE.Shape();
  f.moveTo(0, -0.35 * s);
  f.quadraticCurveTo(0.25 * s, -0.3 * s, 0.4 * s, -0.05 * s);
  f.quadraticCurveTo(0.7 * s, 0.25 * s, 1 * s, 0.1 * s);
  f.quadraticCurveTo(0.85 * s, -0.05 * s, 0.82 * s, -0.25 * s);
  f.quadraticCurveTo(0.65 * s, -0.12 * s, 0.55 * s, -0.3 * s);
  f.quadraticCurveTo(0.4 * s, -0.2 * s, 0.3 * s, -0.45 * s);
  f.quadraticCurveTo(0.15 * s, -0.38 * s, 0, -0.5 * s);
  f.quadraticCurveTo(-0.15 * s, -0.38 * s, -0.3 * s, -0.45 * s);
  f.quadraticCurveTo(-0.4 * s, -0.2 * s, -0.55 * s, -0.3 * s);
  f.quadraticCurveTo(-0.65 * s, -0.12 * s, -0.82 * s, -0.25 * s);
  f.quadraticCurveTo(-0.85 * s, -0.05 * s, -1 * s, 0.1 * s);
  f.quadraticCurveTo(-0.7 * s, 0.25 * s, -0.4 * s, -0.05 * s);
  f.quadraticCurveTo(-0.25 * s, -0.3 * s, 0, -0.35 * s);
  return f;
}

/**
 * O ENVELOPE no chão: deitado, base em `y = 0`, a aba virada para `−Z` e o
 * endereço para `+Z` (quem o pega lê de frente).
 */
export function envelopeDeHalloween(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'envelope-de-halloween';
  const { largura: L, fundo: F, grossura: E } = ENVELOPE;

  // o papel, com a quina macia: a forma de cantos redondos com um bisel fino
  const papel = new THREE.Mesh(
    new THREE.ExtrudeGeometry(cantosRedondos(L - 0.01, F - 0.01, 0.018), {
      depth: E - 0.004, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.004, bevelSegments: 2, curveSegments: 6,
    }),
    toon(P.cartaDeHalloweenForro),
  );
  papel.rotation.x = -Math.PI / 2;
  papel.position.y = 0.002;
  g.add(papel);

  // a face de cima com o desenho (aba, pesponto, carimbos, endereço), um fio
  // acima do papel — nunca no mesmo plano
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(L - 0.006, F - 0.006),
    toon(P.cartaDeHalloween, { mapa: desenhoDoEnvelope() }),
  );
  face.rotation.x = -Math.PI / 2;
  face.position.y = E + 0.0015;
  g.add(face);

  // O LACRE: a cera derramada (borda ondulada), o disco carimbado e o
  // morceguinho em relevo, no bico da aba
  const yLacre = E + 0.002;
  const zLacre = -F / 2 + F * 0.58;
  const borda = new THREE.Shape();
  const N = 14;
  for (let i = 0; i <= N * 2; i++) {
    const a = (i / (N * 2)) * Math.PI * 2;
    const r = 0.045 + (i % 2 === 0 ? 0.004 : -0.002) + Math.sin(i * 1.7) * 0.002;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) borda.moveTo(x, y);
    else borda.lineTo(x, y);
  }
  const cera = new THREE.Mesh(
    new THREE.ExtrudeGeometry(borda, { depth: 0.004, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2 }),
    toon(P.lacreDeMorcego),
  );
  cera.rotation.x = -Math.PI / 2;
  cera.position.set(0, yLacre, zLacre);
  g.add(cera);
  const carimbo = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.033, 0.004, 20), toon(P.lacreDeMorcego));
  carimbo.position.set(0, yLacre + 0.007, zLacre);
  g.add(carimbo);
  const morcego = new THREE.Mesh(
    new THREE.ExtrudeGeometry(formaDeMorcego(0.024), { depth: 0.002, bevelEnabled: false }),
    toon(P.lacreDeMorcegoRelevo),
  );
  morcego.rotation.x = -Math.PI / 2;
  morcego.position.set(0, yLacre + 0.009, zLacre + 0.006);
  g.add(morcego);
  return g;
}

// ===================================================== a carta aberta

/** o texto da Estella (rascunho aprovado pelo Renan, §2.1) */
const TEXTO =
  'Hoje à noite tem festa no Villa Lobos — e ninguém entra sem fantasia. ' +
  'Passem na minha boutique antes: tenho uma surpresa costurada só para vocês.';

/** quebra o texto do corpo na largura do papel */
function quebrar(c: CanvasRenderingContext2D, linhas: readonly string[], largura: number): string[] {
  const saida: string[] = [];
  for (const linha of linhas) {
    let atual = '';
    for (const palavra of linha.split(' ')) {
      const teste = atual ? `${atual} ${palavra}` : palavra;
      if (c.measureText(teste).width > largura && atual) {
        saida.push(atual);
        atual = palavra;
      } else atual = teste;
    }
    if (atual) saida.push(atual);
  }
  return saida;
}

/**
 * A CARTA ABERTA. Papel creme com a borda de papel rasgado à mão, o
 * pesponto roxo em volta, a teia no canto com a aranhinha balançando no
 * fio, morcegos batendo asa, as abóboras de vela no pé, e a letra da
 * Estella com a assinatura e a ovelhinha-aranha desenhada do lado.
 */
export const CARTA_DA_ESTELLA: MemoriaPintada = {
  id: 'halloween-carta-da-estella',
  titulo: 'Um convite por baixo da porta',
  lugar: 'Casa do Ari',
  legenda: 'Papel laranja, lacre de morceguinho e a letra caprichada da Estella.',
  proporcao: 0.78,
  pintar(c, w, h, t) {
    const u = Math.min(w, h / 1.28) / 100; // a unidade do desenho
    // o fundo da mesa por trás do papel
    c.fillStyle = '#3a2147';
    c.fillRect(0, 0, w, h);

    // o PAPEL, com a borda rasgada (deckle): um contorno ondulado e torto
    const m = 4 * u;
    c.save();
    c.beginPath();
    const pontos = 90;
    for (let i = 0; i <= pontos; i++) {
      const k = i / pontos;
      let x: number;
      let y: number;
      if (k < 0.25) { x = m + (w - 2 * m) * (k / 0.25); y = m; }
      else if (k < 0.5) { x = w - m; y = m + (h - 2 * m) * ((k - 0.25) / 0.25); }
      else if (k < 0.75) { x = w - m - (w - 2 * m) * ((k - 0.5) / 0.25); y = h - m; }
      else { x = m; y = h - m - (h - 2 * m) * ((k - 0.75) / 0.25); }
      const ruido = Math.sin(i * 2.7) * 0.8 * u + Math.sin(i * 7.1) * 0.5 * u;
      if (i === 0) c.moveTo(x + ruido, y + ruido);
      else c.lineTo(x + ruido, y - ruido);
    }
    c.closePath();
    const papel = c.createLinearGradient(0, 0, w, h);
    papel.addColorStop(0, '#fff3dc');
    papel.addColorStop(1, '#fbdcb0');
    c.fillStyle = papel;
    c.shadowColor = 'rgba(0,0,0,0.35)';
    c.shadowBlur = 3 * u;
    c.fill();
    c.restore();

    // a mancha morna das abóboras de vela no pé do papel
    const brilho = 0.8 + 0.2 * Math.sin(t * 7) * Math.sin(t * 4.1);
    const luz = c.createRadialGradient(w / 2, h, 4 * u, w / 2, h, 60 * u);
    luz.addColorStop(0, `rgba(255,170,70,${(0.28 * brilho).toFixed(2)})`);
    luz.addColorStop(1, 'rgba(255,170,70,0)');
    c.fillStyle = luz;
    c.fillRect(0, 0, w, h);

    // o PESPONTO roxo em volta (a costureira)
    c.strokeStyle = 'rgba(110,47,140,0.85)';
    c.lineWidth = 0.7 * u;
    c.setLineDash([2.4 * u, 1.8 * u]);
    c.strokeRect(9 * u, 9 * u, w - 18 * u, h - 18 * u);
    c.setLineDash([]);

    // a TEIA no canto de cima à esquerda, e a aranhinha no fio
    c.strokeStyle = 'rgba(90,60,100,0.45)';
    c.lineWidth = 0.35 * u;
    const ox = 9 * u;
    const oy = 9 * u;
    for (let k = 0; k <= 5; k++) {
      const a = (k / 5) * (Math.PI / 2);
      c.beginPath();
      c.moveTo(ox, oy);
      c.lineTo(ox + Math.cos(a) * 24 * u, oy + Math.sin(a) * 24 * u);
      c.stroke();
    }
    for (const r of [7, 13, 19]) {
      c.beginPath();
      for (let k = 0; k <= 5; k++) {
        const a = (k / 5) * (Math.PI / 2);
        const rr = r * u * (k % 5 === 0 ? 1 : 0.9);
        const x = ox + Math.cos(a) * rr;
        const y = oy + Math.sin(a) * rr;
        if (k === 0) c.moveTo(x, y);
        else c.quadraticCurveTo(ox + Math.cos(a - 0.15) * rr * 0.8, oy + Math.sin(a - 0.15) * rr * 0.8, x, y);
      }
      c.stroke();
    }
    const fioX = ox + 17 * u;
    const fioY = oy + 26 * u + Math.sin(t * 1.8) * 3 * u;
    c.beginPath();
    c.moveTo(fioX, oy + 14 * u);
    c.lineTo(fioX, fioY);
    c.stroke();
    c.fillStyle = '#3a2147';
    c.beginPath();
    c.ellipse(fioX, fioY + 1.6 * u, 1.8 * u, 2.2 * u, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#3a2147';
    c.lineWidth = 0.45 * u;
    for (const lado of [-1, 1]) {
      for (let p = 0; p < 4; p++) {
        c.beginPath();
        c.moveTo(fioX, fioY + 1.4 * u + p * 0.6 * u);
        c.lineTo(fioX + lado * 3.4 * u, fioY + (p - 1) * 1.3 * u);
        c.stroke();
      }
    }
    c.fillStyle = '#ffffff';
    c.fillRect(fioX - 1 * u, fioY + 0.9 * u, 0.7 * u, 0.7 * u);
    c.fillRect(fioX + 0.3 * u, fioY + 0.9 * u, 0.7 * u, 0.7 * u);

    // os MORCEGOS no canto de cima à direita, batendo asa
    for (let i = 0; i < 3; i++) {
      const x = w - (16 + i * 9) * u;
      const y = (14 + (i % 2) * 7) * u + Math.sin(t * 2 + i) * 1.2 * u;
      const asa = Math.sin(t * 12 + i * 1.7);
      const s = (i === 0 ? 1.1 : 0.8) * u;
      c.fillStyle = '#3a2147';
      c.beginPath();
      c.ellipse(x, y, 2.2 * s, 1.8 * s, 0, 0, Math.PI * 2);
      c.fill();
      for (const lado of [-1, 1]) {
        c.beginPath();
        c.moveTo(x, y);
        c.quadraticCurveTo(x + lado * 4 * s, y - 4 * s * asa, x + lado * 8 * s, y - 1 * s * asa);
        c.quadraticCurveTo(x + lado * 5 * s, y + 1 * s, x, y + 1.2 * s);
        c.fill();
      }
    }

    // o TÍTULO e o texto, na letra da Estella. A carta tem 128 unidades de
    // alto (a proporção do painel): título, "Queridos,", o parágrafo num
    // espaço fixo (a letra encolhe até caber), a assinatura e, no pé, as
    // abóboras — nada encosta em nada, no computador e no celular
    const margem = 15 * u;
    const fonte = (tam: number): string => `700 ${tam.toFixed(1)}px Caveat, "Segoe Print", cursive`;
    c.fillStyle = '#6a2f8c';
    c.textAlign = 'center';
    c.textBaseline = 'alphabetic';
    c.font = fonte(9.5 * u);
    c.fillText('Feliz Halloween!', w / 2, 30 * u);
    c.fillStyle = '#4a2a3a';
    c.textAlign = 'left';
    c.font = fonte(7 * u);
    c.fillText('Queridos,', margem, 42 * u);
    const TOPO = 51 * u;
    const ESPACO = 47 * u;
    let tam = 7.2 * u;
    let linhas: string[] = [];
    for (; tam > 4 * u; tam -= 0.2 * u) {
      c.font = fonte(tam);
      linhas = quebrar(c, [TEXTO], w - margem * 2);
      if (linhas.length * tam * 1.2 <= ESPACO) break;
    }
    linhas.forEach((linha, i) => c.fillText(linha, margem, TOPO + i * tam * 1.2));

    // a assinatura e a ovelhinha-aranha do lado
    const ySig = 107 * u;
    c.textAlign = 'right';
    c.fillStyle = '#6a2f8c';
    c.font = fonte(8.5 * u);
    c.fillText('— Estella', w - margem - 11 * u, ySig);
    const sx = w - margem - 4 * u;
    const sy = ySig - 3.5 * u;
    c.strokeStyle = '#3a2147';
    c.lineWidth = 0.5 * u;
    for (const lado of [-1, 1]) {
      for (let p = 0; p < 4; p++) {
        c.beginPath();
        c.moveTo(sx, sy + p * 0.7 * u);
        c.lineTo(sx + lado * 5.5 * u, sy + (p - 1.5) * 1.8 * u + 2 * u);
        c.stroke();
      }
    }
    c.fillStyle = '#fff8ec';
    for (const [dx, dy] of [[-2, -1], [2, -1], [0, -2.5], [-1.4, 1.2], [1.4, 1.2]] as const) {
      c.beginPath();
      c.arc(sx + dx * u, sy + dy * u, 2.2 * u, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#3a2147';
    c.beginPath();
    c.ellipse(sx, sy + 1.6 * u, 1.8 * u, 1.6 * u, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#ffffff';
    c.fillRect(sx - 1 * u, sy + 1.2 * u, 0.6 * u, 0.6 * u);
    c.fillRect(sx + 0.4 * u, sy + 1.2 * u, 0.6 * u, 0.6 * u);

    // as ABÓBORAS de vela no pé do papel, com a luz tremendo nos olhos
    const abobora = (x: number, yy: number, s: number): void => {
      c.fillStyle = '#e8792b';
      for (const [dx, r] of [[-3.2, 4.5], [3.2, 4.5], [0, 5.4]] as const) {
        c.beginPath();
        c.ellipse(x + dx * s, yy, r * s, 4.8 * s, 0, 0, Math.PI * 2);
        c.fill();
      }
      c.strokeStyle = 'rgba(150,60,10,0.5)';
      c.lineWidth = 0.4 * s;
      for (const dx of [-2.3, 2.3]) {
        c.beginPath();
        c.ellipse(x + dx * s, yy, 1.4 * s, 4.4 * s, 0, 0, Math.PI * 2);
        c.stroke();
      }
      c.fillStyle = '#3d6b2e';
      c.fillRect(x - 0.7 * s, yy - 7.2 * s, 1.4 * s, 2.6 * s);
      c.fillStyle = `rgba(255,${Math.round(200 + 30 * brilho)},110,${brilho.toFixed(2)})`;
      for (const lado of [-1, 1]) {
        c.beginPath();
        c.moveTo(x + lado * 1.2 * s, yy - 0.6 * s);
        c.lineTo(x + lado * 3.2 * s, yy - 0.6 * s);
        c.lineTo(x + lado * 2.2 * s, yy - 2.6 * s);
        c.closePath();
        c.fill();
      }
      c.beginPath();
      c.arc(x, yy + 0.9 * s, 2.4 * s, 0.1, Math.PI - 0.1);
      c.fill();
    };
    abobora(19 * u, 117 * u, 1.2 * u);
    abobora(30 * u, 119 * u, 0.85 * u);
    abobora(w - 24 * u, 118 * u, 1.05 * u);
  },
};
