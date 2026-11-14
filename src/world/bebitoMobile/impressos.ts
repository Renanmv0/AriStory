import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';

/**
 * =========================================== OS IMPRESSOS DO BEBITO MOBILE
 *
 * Tudo o que no carro é DESENHO e não geometria: a placa, os adesivos da
 * tampa de trás e do vidro, o mostrador do rádio e os relógios do painel.
 * São pintados em canvas na hora (nenhum arquivo de imagem), e moram todos
 * num ATLAS só — uma textura e um material para o carro inteiro: a `fundir()`
 * junta as plaquinhas que dividem o material, e os impressos do carro custam
 * um desenho por quadro (dois, com os do vidro, que saem junto com o teto).
 *
 * Adesivo novo é uma entrada em `ADESIVOS` (o id é o do catálogo da ficha).
 * O desenho é inteiro colorido: o material é branco, e o toon só sombreia.
 */

type Tela = CanvasRenderingContext2D;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const FONTE = 'ui-rounded, "Nunito", "Baloo 2", system-ui, sans-serif';

export interface Impresso {
  /** o tamanho no atlas, em pixels */
  l: number;
  a: number;
  /** o tamanho no carro, em metros */
  largura: number;
  altura: number;
  /** o recorte: retângulo de quina redonda (com o raio, em fração da altura) ou elipse */
  forma: 'redondo' | 'quina';
  raio?: number;
  pintar: (c: Tela, l: number, a: number) => void;
}

/** texto que cabe: encolhe a letra até caber na largura */
function texto(c: Tela, t: string, x: number, y: number, px: number, cabe: number, peso = 900, italico = false): void {
  let tam = px;
  const fonte = (s: number): string => `${italico ? 'italic ' : ''}${peso} ${s}px ${FONTE}`;
  c.font = fonte(tam);
  while (tam > 8 && c.measureText(t).width > cabe) {
    tam -= 1;
    c.font = fonte(tam);
  }
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(t, x, y);
}

/** texto em arco, letra por letra (o `letterSpacing` do canvas não existe em todo navegador) */
function textoEmArco(c: Tela, t: string, cx: number, cy: number, raio: number, meio: number, abre: number, px: number, porBaixo = false): void {
  c.font = `900 ${px}px ${FONTE}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  const n = t.length;
  for (let i = 0; i < n; i++) {
    const f = n > 1 ? i / (n - 1) - 0.5 : 0;
    const ang = meio + (porBaixo ? -1 : 1) * f * abre;
    c.save();
    c.translate(cx + Math.cos(ang) * raio, cy + Math.sin(ang) * raio);
    c.rotate(ang + (porBaixo ? -Math.PI / 2 : Math.PI / 2));
    c.fillText(t[i], 0, 0);
    c.restore();
  }
}

// ------------------------------------------------------------------ a placa

/** a placa do Mercosul, com o que a ficha mandar escrever (a de fábrica: BEBITO) */
function placa(letras: string): Impresso {
  return {
    l: 384, a: 124, largura: 0.42, altura: 0.136, forma: 'quina', raio: 0.14,
    pintar: (c, l, a) => {
      c.fillStyle = '#f7f8fa';
      c.fillRect(0, 0, l, a);
      c.fillStyle = '#1f4fa8';
      c.fillRect(0, 0, l, a * 0.24);
      c.fillStyle = '#fff';
      texto(c, 'BRASIL', l / 2, a * 0.13, a * 0.17, l * 0.5, 700);
      // a bandeirinha no canto da faixa
      c.fillStyle = '#2f9e4f';
      c.fillRect(l - 40, a * 0.05, 28, a * 0.15);
      c.fillStyle = '#f2d23a';
      c.beginPath();
      c.moveTo(l - 26, a * 0.065);
      c.lineTo(l - 14, a * 0.125);
      c.lineTo(l - 26, a * 0.185);
      c.lineTo(l - 38, a * 0.125);
      c.fill();
      c.fillStyle = '#1b1d22';
      c.font = `800 ${Math.round(a * 0.6)}px ui-monospace, "Courier New", monospace`;
      let px = Math.round(a * 0.6);
      while (px > 12 && c.measureText(letras).width > l * 0.9) {
        px -= 2;
        c.font = `800 ${px}px ui-monospace, "Courier New", monospace`;
      }
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(letras, l / 2, a * 0.63);
      c.strokeStyle = '#1b1d22';
      c.lineWidth = 5;
      c.strokeRect(2.5, 2.5, l - 5, a - 5);
    },
  };
}

// -------------------------------------------------------------- os adesivos

/** o 67 do Gatito: o azul e o amarelo dos Gatitos, a letra deitada de placar */
const sixSeven: Impresso = {
  l: 200, a: 200, largura: 0.2, altura: 0.2, forma: 'redondo',
  pintar: (c, l, a) => {
    c.fillStyle = css(P.gatitosAmarelo);
    c.fillRect(0, 0, l, a);
    c.fillStyle = css(P.gatitosAzul);
    c.beginPath();
    c.arc(l / 2, a / 2, l * 0.44, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = css(P.gatitosBranco);
    c.lineWidth = 5;
    c.beginPath();
    c.arc(l / 2, a / 2, l * 0.37, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = css(P.gatitosAzulEscuro);
    texto(c, '67', l / 2 + 4, a / 2 + 10, a * 0.5, l * 0.6, 900, true);
    c.fillStyle = css(P.gatitosAmarelo);
    texto(c, '67', l / 2, a / 2 + 5, a * 0.5, l * 0.6, 900, true);
  },
};

/** a roda gigante do Villa Lobos: branca, com a coroa vermelha, no céu do parque */
const rodaGigante: Impresso = {
  l: 220, a: 220, largura: 0.23, altura: 0.23, forma: 'redondo',
  pintar: (c, l, a) => {
    c.fillStyle = css(P.rodaVermelho);
    c.fillRect(0, 0, l, a);
    const cx = l / 2;
    const cy = a / 2;
    c.fillStyle = '#bfe6f7';
    c.beginPath();
    c.arc(cx, cy, l * 0.43, 0, Math.PI * 2);
    c.fill();
    // a grama embaixo
    c.save();
    c.beginPath();
    c.arc(cx, cy, l * 0.43, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#8fd07a';
    c.fillRect(0, a * 0.74, l, a);
    c.restore();
    const ry = cy - a * 0.03;
    const R = l * 0.25;
    // os cavaletes
    c.strokeStyle = '#ffffff';
    c.lineCap = 'round';
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(cx, ry);
    c.lineTo(cx - l * 0.13, a * 0.78);
    c.moveTo(cx, ry);
    c.lineTo(cx + l * 0.13, a * 0.78);
    c.stroke();
    // os raios e os dois aros
    c.lineWidth = 2.4;
    for (let i = 0; i < 12; i++) {
      const g = (i / 12) * Math.PI * 2;
      c.beginPath();
      c.moveTo(cx, ry);
      c.lineTo(cx + Math.cos(g) * R, ry + Math.sin(g) * R);
      c.stroke();
    }
    c.lineWidth = 5;
    c.beginPath();
    c.arc(cx, ry, R, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = css(P.rodaVermelho);
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, ry, R * 0.55, 0, Math.PI * 2);
    c.stroke();
    // as gôndolas brancas e o miolo dourado
    for (let i = 0; i < 12; i++) {
      const g = (i / 12) * Math.PI * 2;
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(cx + Math.cos(g) * R, ry + Math.sin(g) * R + 4, 6.5, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#f2c14e';
    c.beginPath();
    c.arc(cx, ry, 8, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#ffffff';
    textoEmArco(c, 'VILLA LOBOS', cx, cy, l * 0.465, Math.PI / 2, 1.7, 19, true);
  },
};

/** o Mania de Churrasco: a placa de madeira escura e latão, com a brasa */
const mania: Impresso = {
  l: 300, a: 170, largura: 0.34, altura: 0.19, forma: 'quina', raio: 0.5,
  pintar: (c, l, a) => {
    c.fillStyle = css(P.churrascoLatao);
    c.fillRect(0, 0, l, a);
    c.fillStyle = css(P.churrascoCouro);
    c.beginPath();
    c.ellipse(l / 2, a / 2, l * 0.47, a * 0.44, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = css(P.churrascoLatao);
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(l / 2, a / 2, l * 0.43, a * 0.38, 0, 0, Math.PI * 2);
    c.stroke();
    // a chama em cima do nome
    const fx = l / 2;
    const fy = a * 0.27;
    for (const [cor, s] of [[P.churrascoBrasa, 1], [P.churrascoBrasaViva, 0.58]] as const) {
      c.fillStyle = css(cor);
      c.beginPath();
      c.moveTo(fx, fy - 17 * s);
      c.bezierCurveTo(fx + 15 * s, fy - 3 * s, fx + 11 * s, fy + 13 * s, fx, fy + 13 * s);
      c.bezierCurveTo(fx - 11 * s, fy + 13 * s, fx - 15 * s, fy - 3 * s, fx, fy - 17 * s);
      c.fill();
    }
    c.fillStyle = css(P.churrascoGordura);
    texto(c, 'MANIA', l / 2, a * 0.55, a * 0.34, l * 0.7);
    c.fillStyle = css(P.churrascoBrasaViva);
    texto(c, 'de churrasco', l / 2, a * 0.77, a * 0.15, l * 0.6, 800, true);
  },
};

/** o sorvete do Mano: a casquinha de duas bolas — morango pro Ari, maracujá pro Renan */
const mano: Impresso = {
  l: 220, a: 220, largura: 0.23, altura: 0.23, forma: 'redondo',
  pintar: (c, l, a) => {
    c.fillStyle = css(P.sorveteriaCreme);
    c.fillRect(0, 0, l, a);
    const cx = l / 2;
    const cy = a / 2;
    c.fillStyle = css(P.sorveteriaRosa);
    c.beginPath();
    c.arc(cx, cy, l * 0.44, 0, Math.PI * 2);
    c.fill();
    // a casquinha, com o xadrez do waffle
    c.fillStyle = css(P.sorveteriaDoceDeLeite);
    c.beginPath();
    c.moveTo(cx - 30, cy + 8);
    c.lineTo(cx + 30, cy + 8);
    c.lineTo(cx, cy + 72);
    c.fill();
    c.save();
    c.beginPath();
    c.moveTo(cx - 30, cy + 8);
    c.lineTo(cx + 30, cy + 8);
    c.lineTo(cx, cy + 72);
    c.clip();
    c.strokeStyle = 'rgba(120, 70, 30, 0.55)';
    c.lineWidth = 2;
    for (let k = -6; k <= 6; k++) {
      c.beginPath();
      c.moveTo(cx + k * 12 - 40, cy);
      c.lineTo(cx + k * 12 + 40, cy + 80);
      c.moveTo(cx + k * 12 + 40, cy);
      c.lineTo(cx + k * 12 - 40, cy + 80);
      c.stroke();
    }
    c.restore();
    // as duas bolas: o maracujá embaixo e o morango em cima
    const bola = (x: number, y: number, r: number, cor: string, luz: string): void => {
      c.fillStyle = cor;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = luz;
      c.beginPath();
      c.arc(x - r * 0.3, y - r * 0.35, r * 0.28, 0, Math.PI * 2);
      c.fill();
    };
    bola(cx, cy - 6, 33, '#ffd65c', '#fff1b8');
    bola(cx, cy - 46, 27, '#ff7f9e', '#ffc4d2');
    // as sementinhas do maracujá
    c.fillStyle = '#5b3a2a';
    for (const [dx, dy] of [[-12, -2], [8, 4], [-2, 12], [16, -8], [-18, 10]]) {
      c.beginPath();
      c.ellipse(cx + dx, cy - 6 + dy, 2.6, 1.8, 0.6, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#ffffff';
    textoEmArco(c, 'SORVETE DO MANO', cx, cy, l * 0.385, -Math.PI / 2, 2.5, 17);
  },
};

/** os adesivos, pelo id do catálogo da ficha (`ficha.ts`) */
export const ADESIVOS: Readonly<Record<string, Impresso>> = {
  'six-seven': sixSeven,
  'adesivo-da-roda-gigante': rodaGigante,
  'adesivo-do-mania': mania,
  'adesivo-do-mano': mano,
};

// ---------------------------------------------------------- o que é do painel

/** o rádio: a janela do dial com a escala âmbar e a agulha, e a grade do alto-falante */
const radio: Impresso = {
  l: 280, a: 100, largura: 0.34, altura: 0.12, forma: 'quina', raio: 0.2,
  pintar: (c, l, a) => {
    c.fillStyle = css(P.bebitoCromo);
    c.fillRect(0, 0, l, a);
    c.fillStyle = '#2a2622';
    c.fillRect(8, 8, l - 16, a - 16);
    // o dial aceso
    const g = c.createLinearGradient(0, 16, 0, 56);
    g.addColorStop(0, '#ffe7a8');
    g.addColorStop(1, '#f5b85a');
    c.fillStyle = g;
    c.fillRect(20, 16, l - 40, 38);
    c.strokeStyle = '#6b4a1e';
    c.lineWidth = 2;
    for (let i = 0; i <= 20; i++) {
      const x = 28 + ((l - 56) * i) / 20;
      c.beginPath();
      c.moveTo(x, 20);
      c.lineTo(x, i % 5 === 0 ? 36 : 29);
      c.stroke();
    }
    c.fillStyle = '#6b4a1e';
    c.font = `800 12px ${FONTE}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (const [i, t] of [[0, '88'], [5, '94'], [10, '100'], [15, '104'], [20, '108']] as const) {
      c.fillText(t, 28 + ((l - 56) * i) / 20, 46);
    }
    // a agulha, parada na estação de sempre
    c.fillStyle = '#d9452f';
    c.fillRect(28 + (l - 56) * 0.62 - 1.5, 16, 3, 38);
    // a grade do alto-falante
    c.fillStyle = '#8a7f72';
    for (let x = 24; x < l - 20; x += 9) c.fillRect(x, 64, 4, 22);
  },
};

/** os relógios: o velocímetro e o da gasolina, creme, com a agulha vermelha */
const mostradores: Impresso = {
  l: 250, a: 100, largura: 0.31, altura: 0.124, forma: 'quina', raio: 0.45,
  pintar: (c, l, a) => {
    c.fillStyle = '#2a2622';
    c.fillRect(0, 0, l, a);
    const relogio = (cx: number, r: number, agulha: number, marcas: number): void => {
      c.fillStyle = css(P.bebitoCromo);
      c.beginPath();
      c.arc(cx, a / 2, r + 5, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = css(P.bebitoMostrador);
      c.beginPath();
      c.arc(cx, a / 2, r, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#2a2622';
      c.lineWidth = 2.5;
      for (let i = 0; i <= marcas; i++) {
        const g = Math.PI * 0.8 + (i / marcas) * Math.PI * 1.4;
        c.beginPath();
        c.moveTo(cx + Math.cos(g) * r * 0.72, a / 2 + Math.sin(g) * r * 0.72);
        c.lineTo(cx + Math.cos(g) * r * 0.92, a / 2 + Math.sin(g) * r * 0.92);
        c.stroke();
      }
      const g = Math.PI * 0.8 + agulha * Math.PI * 1.4;
      c.strokeStyle = '#d9452f';
      c.lineWidth = 4;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(cx, a / 2);
      c.lineTo(cx + Math.cos(g) * r * 0.78, a / 2 + Math.sin(g) * r * 0.78);
      c.stroke();
      c.fillStyle = '#2a2622';
      c.beginPath();
      c.arc(cx, a / 2, 5, 0, Math.PI * 2);
      c.fill();
    };
    relogio(l * 0.31, 38, 0.28, 8);
    relogio(l * 0.74, 28, 0.7, 4);
  },
};

/** a plaquinha de cromo com o nome do carro, na tampa de trás */
const nomeDoCarro: Impresso = {
  l: 300, a: 74, largura: 0.34, altura: 0.084, forma: 'quina', raio: 0.5,
  pintar: (c, l, a) => {
    const g = c.createLinearGradient(0, 0, 0, a);
    g.addColorStop(0, '#f4f7f9');
    g.addColorStop(0.55, css(P.bebitoCromo));
    g.addColorStop(1, '#aab4bd');
    c.fillStyle = g;
    c.fillRect(0, 0, l, a);
    c.fillStyle = '#2b4f73';
    texto(c, 'Bebito Mobile', l / 2, a * 0.52, a * 0.56, l * 0.84, 800, true);
  },
};

// ------------------------------------------------------------------- o atlas

export interface Recorte { u0: number; v0: number; u1: number; v1: number; impresso: Impresso }

export interface AtlasDeImpressos {
  material: THREE.MeshToonMaterial;
  /** a plaquinha de um impresso: a forma recortada, olhando para `+Z`, com as costas em `z = 0` e o UV no pedaço dele do atlas */
  plaquinha: (chave: string) => THREE.BufferGeometry | null;
  recortes: ReadonlyMap<string, Recorte>;
}

const atlasGuardados = new Map<string, AtlasDeImpressos>();
const LADO = 1024;
const ALTO = 512;

/**
 * O ATLAS do carro: a placa com as letras da ficha, o rádio, os relógios e
 * os adesivos pedidos. Guardado pela lista — a mesma ficha devolve a mesma
 * textura, e trocar um adesivo pinta um atlas novo.
 */
export function atlasDeImpressos(letrasDaPlaca: string, adesivos: readonly string[]): AtlasDeImpressos {
  const ids = [...new Set(adesivos.filter((id) => ADESIVOS[id]))].sort();
  const chave = `${letrasDaPlaca}|${ids.join(',')}`;
  const pronto = atlasGuardados.get(chave);
  if (pronto) return pronto;

  const itens: Array<[string, Impresso]> = [
    ['placa', placa(letrasDaPlaca)], ['radio', radio], ['mostradores', mostradores], ['nome', nomeDoCarro],
  ];
  for (const id of ids) itens.push([id, ADESIVOS[id]]);

  const cv = document.createElement('canvas');
  cv.width = LADO;
  cv.height = ALTO;
  const c = cv.getContext('2d');
  const recortes = new Map<string, Recorte>();
  // prateleiras: da esquerda para a direita, descendo de linha quando não cabe
  let x = 0;
  let y = 0;
  let linha = 0;
  const folga = 6;
  for (const [id, imp] of itens) {
    if (x + imp.l + folga > LADO) {
      x = 0;
      y += linha + folga;
      linha = 0;
    }
    if (c) {
      c.save();
      c.translate(x, y);
      c.beginPath();
      c.rect(0, 0, imp.l, imp.a);
      c.clip();
      imp.pintar(c, imp.l, imp.a);
      c.restore();
    }
    // meio pixel para dentro: o vizinho do atlas não vaza na borda
    recortes.set(id, {
      u0: (x + 0.5) / LADO, u1: (x + imp.l - 0.5) / LADO,
      v0: 1 - (y + imp.a - 0.5) / ALTO, v1: 1 - (y + 0.5) / ALTO,
      impresso: imp,
    });
    x += imp.l + folga;
    linha = Math.max(linha, imp.a);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const material = toon(0xffffff, { mapa: tex });

  const plaquinha = (id: string): THREE.BufferGeometry | null => {
    const r = recortes.get(id);
    if (!r) return null;
    const { largura: L, altura: H, forma, raio } = r.impresso;
    const s = new THREE.Shape();
    if (forma === 'redondo') s.absellipse(0, 0, L / 2, H / 2, 0, Math.PI * 2, false, 0);
    else {
      const q = Math.min((raio ?? 0.15) * H, L / 2 - 0.001, H / 2 - 0.001);
      const hx = L / 2;
      const hy = H / 2;
      s.moveTo(-hx + q, -hy);
      s.lineTo(hx - q, -hy);
      s.quadraticCurveTo(hx, -hy, hx, -hy + q);
      s.lineTo(hx, hy - q);
      s.quadraticCurveTo(hx, hy, hx - q, hy);
      s.lineTo(-hx + q, hy);
      s.quadraticCurveTo(-hx, hy, -hx, hy - q);
      s.lineTo(-hx, -hy + q);
      s.quadraticCurveTo(-hx, -hy, -hx + q, -hy);
    }
    const geo = new THREE.ShapeGeometry(s, 10);
    // o UV do `ShapeGeometry` é a própria posição: leva para o pedaço do atlas
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const fu = pos.getX(i) / L + 0.5;
      const fv = pos.getY(i) / H + 0.5;
      uv.setXY(i, r.u0 + (r.u1 - r.u0) * fu, r.v0 + (r.v1 - r.v0) * fv);
    }
    return geo;
  };

  const atlas: AtlasDeImpressos = { material, plaquinha, recortes };
  atlasGuardados.set(chave, atlas);
  return atlas;
}
