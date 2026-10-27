import type { MemoriaPintada } from '../memoriasData';

/*
 * O MAPINHA DA ESTELLA (`docs/HALLOWEEN.md`, §2.3.1 e §6): o papel que ela
 * dá junto com a cestinha, para a caça de doces ou travessuras.
 *
 * Pintado em canvas, no mesmo papel da carta (a borda rasgada, o pesponto
 * roxo): à esquerda o parque visto de cima, desenhado à mão — os caminhos, o
 * lago roxo, a roda gigante, a praça de gelo, a pista de patins, a boutique
 * com a aranhinha e o "vocês estão aqui" —, e à direita o PERGAMINHO das
 * pistas, uma linha por parada: as que a dupla já recebeu escritas na letra
 * dela, as outras ainda em branco, com um ponto de interrogação.
 *
 * Nesta etapa só existe a primeira pista (a que leva ao Mano); as outras
 * entram em `PISTAS_RECEBIDAS` na etapa 5, quando a caça existir.
 */

/** as pistas que a dupla já tem, na ordem das paradas (a etapa 5 acrescenta) */
export const PISTAS_RECEBIDAS: string[] = [
  'Comecem por quem serve gelado de casaca e não tem medo de frio.',
];
/** quantas paradas a caça tem (§6) */
const PARADAS = 10;

const ROXO = '#6a2f8c';
const TINTA = '#4a2a3a';
const ESCURO = '#3a2147';

function quebrar(c: CanvasRenderingContext2D, texto: string, largura: number): string[] {
  const saida: string[] = [];
  let atual = '';
  for (const palavra of texto.split(' ')) {
    const teste = atual ? `${atual} ${palavra}` : palavra;
    if (c.measureText(teste).width > largura && atual) {
      saida.push(atual);
      atual = palavra;
    } else atual = teste;
  }
  if (atual) saida.push(atual);
  return saida;
}

export const MAPINHA_DA_ESTELLA: MemoriaPintada = {
  id: 'halloween-mapinha',
  titulo: 'O mapinha da Estella',
  lugar: 'Parque Villa Lobos',
  legenda: 'O parque desenhado à mão, e as pistas da caça de doces ou travessuras.',
  proporcao: 1.45,
  pintar(c, w, h, t) {
    const u = Math.min(w / 145, h / 100); // a unidade do desenho
    c.fillStyle = ESCURO;
    c.fillRect(0, 0, w, h);

    // o PAPEL, com a borda rasgada
    const m = 3 * u;
    c.save();
    c.beginPath();
    const pontos = 110;
    for (let i = 0; i <= pontos; i++) {
      const k = i / pontos;
      let x: number;
      let y: number;
      if (k < 0.25) { x = m + (w - 2 * m) * (k / 0.25); y = m; }
      else if (k < 0.5) { x = w - m; y = m + (h - 2 * m) * ((k - 0.25) / 0.25); }
      else if (k < 0.75) { x = w - m - (w - 2 * m) * ((k - 0.5) / 0.25); y = h - m; }
      else { x = m; y = h - m - (h - 2 * m) * ((k - 0.75) / 0.25); }
      const ruido = Math.sin(i * 2.7) * 0.7 * u + Math.sin(i * 7.1) * 0.4 * u;
      if (i === 0) c.moveTo(x + ruido, y + ruido);
      else c.lineTo(x + ruido, y - ruido);
    }
    c.closePath();
    const papel = c.createLinearGradient(0, 0, w, h);
    papel.addColorStop(0, '#fff3dc');
    papel.addColorStop(1, '#f7d8a8');
    c.fillStyle = papel;
    c.shadowColor = 'rgba(0,0,0,0.35)';
    c.shadowBlur = 3 * u;
    c.fill();
    c.restore();
    c.strokeStyle = 'rgba(110,47,140,0.85)';
    c.lineWidth = 0.6 * u;
    c.setLineDash([2.2 * u, 1.6 * u]);
    c.strokeRect(7 * u, 7 * u, w - 14 * u, h - 14 * u);
    c.setLineDash([]);

    const fonte = (tam: number): string => `700 ${tam.toFixed(1)}px Caveat, "Segoe Print", cursive`;
    c.fillStyle = ROXO;
    c.textAlign = 'center';
    c.textBaseline = 'alphabetic';
    c.font = fonte(8 * u);
    c.fillText('Doces ou travessuras!', 47 * u, 17 * u);

    // ------------------------------------------------- o PARQUE, à mão
    // o quadro do mapa: de 10 a 84 em x, de 21 a 92 em y
    const X = (x: number): number => (10 + x * 74) * u;
    const Y = (y: number): number => (21 + y * 71) * u;
    // a grama, num verde de lápis de cor
    c.fillStyle = 'rgba(120,170,90,0.28)';
    c.beginPath();
    c.roundRect(X(0), Y(0), 74 * u, 71 * u, 4 * u);
    c.fill();
    // os caminhos: do portão (embaixo) até a praça da roda, e o braço do ponto
    c.strokeStyle = 'rgba(140,100,70,0.55)';
    c.lineWidth = 3.2 * u;
    c.beginPath();
    c.moveTo(X(0.5), Y(1));
    c.lineTo(X(0.5), Y(0.2));
    c.moveTo(X(0.5), Y(0.55));
    c.lineTo(X(0.98), Y(0.55));
    c.stroke();
    // as arvorezinhas, bolotas de lápis
    c.fillStyle = 'rgba(70,130,60,0.65)';
    for (const [x, y] of [[0.08, 0.6], [0.06, 0.75], [0.12, 0.9], [0.9, 0.12], [0.94, 0.3], [0.3, 0.08], [0.18, 0.3], [0.85, 0.82]] as const) {
      c.beginPath();
      c.arc(X(x), Y(y), 2.4 * u, 0, Math.PI * 2);
      c.fill();
    }
    // o LAGO roxo, de gelatina (de suco de uva)
    c.fillStyle = 'rgba(140,85,200,0.7)';
    c.beginPath();
    c.ellipse(X(0.27), Y(0.58), 9 * u, 7 * u, -0.2, 0, Math.PI * 2);
    c.fill();
    c.font = fonte(3.6 * u);
    c.fillStyle = '#ffffff';
    c.fillText('lago', X(0.27), Y(0.59));
    // a RODA GIGANTE no alto, girando devagar
    const rx = X(0.5);
    const ry = Y(0.13);
    c.strokeStyle = ROXO;
    c.lineWidth = 0.6 * u;
    c.beginPath();
    c.arc(rx, ry, 6.5 * u, 0, Math.PI * 2);
    c.stroke();
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + t * 0.4;
      c.beginPath();
      c.moveTo(rx, ry);
      c.lineTo(rx + Math.cos(a) * 6.5 * u, ry + Math.sin(a) * 6.5 * u);
      c.stroke();
      c.fillStyle = '#e8792b';
      c.beginPath();
      c.arc(rx + Math.cos(a) * 6.5 * u, ry + Math.sin(a) * 6.5 * u, 1 * u, 0, Math.PI * 2);
      c.fill();
    }
    // a PRAÇA DE GELO lilás com a sorveteria do Mano (a primeira parada!)
    c.fillStyle = 'rgba(200,170,235,0.75)';
    c.beginPath();
    c.roundRect(X(0.62), Y(0.66), 15 * u, 12 * u, 2 * u);
    c.fill();
    c.fillStyle = '#e8792b';
    c.beginPath();
    c.moveTo(X(0.7), Y(0.72) + 3.5 * u);
    c.lineTo(X(0.7) - 2 * u, Y(0.72) - 1 * u);
    c.lineTo(X(0.7) + 2 * u, Y(0.72) - 1 * u);
    c.closePath();
    c.fill();
    c.fillStyle = '#f5c6dc';
    c.beginPath();
    c.arc(X(0.7), Y(0.72) - 1.5 * u, 2 * u, 0, Math.PI * 2);
    c.fill();
    // a PISTA DE PATINS (o oval) e o CAMPINHO
    c.strokeStyle = 'rgba(80,80,90,0.6)';
    c.lineWidth = 1.4 * u;
    c.beginPath();
    c.ellipse(X(0.3), Y(0.32), 7 * u, 3.6 * u, 0, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = 'rgba(70,140,70,0.7)';
    c.lineWidth = 0.6 * u;
    c.strokeRect(X(0.66), Y(0.26), 16 * u, 11 * u);
    // o PONTO de ônibus, na beira da direita
    c.fillStyle = 'rgba(70,110,150,0.8)';
    c.fillRect(X(0.97) - 1.5 * u, Y(0.55) - 3 * u, 3 * u, 6 * u);
    // A BOUTIQUE, no canto de cima à esquerda, com a aranhinha e o coração
    const bx = X(0.12);
    const by = Y(0.14);
    c.fillStyle = '#f2b8c6';
    c.fillRect(bx - 5 * u, by - 2 * u, 10 * u, 6 * u);
    c.fillStyle = '#8a55c4';
    c.beginPath();
    c.moveTo(bx - 6 * u, by - 2 * u);
    c.lineTo(bx, by - 6 * u);
    c.lineTo(bx + 6 * u, by - 2 * u);
    c.closePath();
    c.fill();
    c.fillStyle = TINTA;
    c.font = fonte(3.6 * u);
    c.fillText('vocês estão aqui ♥', bx + 3 * u, by + 9 * u);
    // a aranhinha da Estella pendurada no telhado, balançando
    const ax = bx + 4 * u + Math.sin(t * 1.6) * 0.8 * u;
    const ay = by - 6 * u + 7 * u;
    c.strokeStyle = ESCURO;
    c.lineWidth = 0.3 * u;
    c.beginPath();
    c.moveTo(bx + 4 * u, by - 3.4 * u);
    c.lineTo(ax, ay);
    c.stroke();
    c.fillStyle = ESCURO;
    c.beginPath();
    c.arc(ax, ay + 0.8 * u, 1.2 * u, 0, Math.PI * 2);
    c.fill();
    // a TRILHA de pontinhos da boutique até a sorveteria, e o X da parada 1
    c.strokeStyle = 'rgba(232,121,43,0.9)';
    c.lineWidth = 0.7 * u;
    c.setLineDash([1.2 * u, 1.4 * u]);
    c.beginPath();
    c.moveTo(bx + 5 * u, by + 3 * u);
    c.quadraticCurveTo(X(0.45), Y(0.4), X(0.5), Y(0.55));
    c.quadraticCurveTo(X(0.58), Y(0.68), X(0.68), Y(0.72));
    c.stroke();
    c.setLineDash([]);
    const pulsa = 1 + 0.12 * Math.sin(t * 4);
    c.strokeStyle = '#d0283f';
    c.lineWidth = 0.9 * u * pulsa;
    for (const s of [-1, 1]) {
      c.beginPath();
      c.moveTo(X(0.7) - 2.6 * u * pulsa, Y(0.66) - 4 * u + s * 2.6 * u * pulsa);
      c.lineTo(X(0.7) + 2.6 * u * pulsa, Y(0.66) - 4 * u - s * 2.6 * u * pulsa);
      c.stroke();
    }

    // ------------------------------------------------- o PERGAMINHO das pistas
    const px = 89 * u;
    const py = 12 * u;
    const pw = 48 * u;
    const ph = 78 * u;
    c.fillStyle = 'rgba(255,248,232,0.95)';
    c.strokeStyle = 'rgba(110,47,140,0.6)';
    c.lineWidth = 0.5 * u;
    c.beginPath();
    c.roundRect(px, py, pw, ph, 3 * u);
    c.fill();
    c.stroke();
    c.fillStyle = ROXO;
    c.textAlign = 'center';
    c.font = fonte(6.5 * u);
    c.fillText('Pistas', px + pw / 2, py + 8 * u);
    c.textAlign = 'left';
    const linhaAlta = 7.2 * u;
    let y = py + 15 * u;
    for (let i = 0; i < PARADAS; i++) {
      const pista = PISTAS_RECEBIDAS[i];
      c.fillStyle = pista ? ROXO : 'rgba(110,47,140,0.35)';
      c.font = fonte(4.4 * u);
      c.fillText(`${i + 1}.`, px + 2.5 * u, y);
      if (pista) {
        c.fillStyle = TINTA;
        c.font = fonte(3.9 * u);
        const linhas = quebrar(c, pista, pw - 10 * u);
        linhas.forEach((l, k) => c.fillText(l, px + 8 * u, y + k * 4.2 * u));
        y += Math.max(linhaAlta, linhas.length * 4.2 * u + 1.5 * u);
      } else {
        c.fillStyle = 'rgba(110,47,140,0.3)';
        c.fillText('? ? ?', px + 8 * u, y);
        y += linhaAlta * 0.78;
      }
    }
    // a assinatura
    c.textAlign = 'right';
    c.fillStyle = ROXO;
    c.font = fonte(5 * u);
    c.fillText('— Estella', px + pw - 3 * u, py + ph - 2.5 * u);
  },
};
