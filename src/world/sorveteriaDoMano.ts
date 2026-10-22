/**
 * A SORVETERIA DO MANO — o quiosque da praça de gelo do Villa Lobos — e a
 * mobília da praça: a mesinha de guarda-sol e a cadeirinha de coração.
 *
 * O quiosque antigo era o `kiosk()` do kit com cubas e casquinhas em cima: uma
 * caixa bege, uma laje marrom e um toldo. Este é um CHALEZINHO DE GELATERIA,
 * do mesmo mundo da praça (neve, cristal, boneco de neve):
 *
 * - o telhado de duas águas com a empena virada para a praça, de ESCAMAS DE
 *   CHOCOLATE (`escamas()`), e a neve escorrendo por cima feito cobertura de
 *   sorvete — uma casca de geometria própria com a beira ondulada e os dedos
 *   que descem a água —, o rolo de neve na cumeeira e os pingentes de gelo
 *   nos beirais;
 * - o lambrequim recortado (meia-lua e furinho) nas duas beiras da empena, com
 *   o cordão de luzinhas coloridas pendurado nele, e a casquinha gigante de
 *   duas bolas na ponta da cumeeira, que é o que diz "sorvete" de longe;
 * - a parede de tábua em pé pintada de rosa (`tabuasDeLambri`) com FURO de
 *   verdade na janela de atendimento, a moldura verde-menta, as cantoneiras
 *   creme e dois flocos de neve de madeira;
 * - o toldo listrado de gomos com a saia em meia-lua (o mesmo do toldo da loja
 *   de patins), raso, e a placa em arco na empena: "Sorvetes do Mano";
 * - o balcão de frente CANELADA com o tampo de madeira avançando, e em cima a
 *   VITRINE DE GELATO: duas fileiras de quatro cubas abertas, cada sabor um
 *   montinho ondulado com a fruta (ou a raspa) em cima e a paletinha enfiada,
 *   e a faixa com os nomes na frente; do outro lado, o suporte de
 *   casquinhas, a sineta, o porta-guardanapo e os potes de confeito;
 * - lá dentro, onde a janela deixa ver: a máquina de sorvete expresso, a
 *   chapa de casquinha aberta e a pilha de copinhos, no piso xadrez;
 * - na lateral `+X` (a que a câmera vê), a lousa dos sabores escrita a giz.
 *
 * AS MEDIDAS DE ANTES FICAM: o deque de 2,8 × 1,9 é o colisor da cena
 * (`SORVETERIA_DO_MANO`), o tampo avança até 1,32 na frente, e o Mano continua
 * em pé do lado de FORA do balcão (`z = 1,7`), sem nada acima nem à frente
 * dele. A vitrine mora na borda da frente, fora da sombra do toldo — a regra
 * de "Peça com balcão" da skill de peça.
 *
 * Tudo nasce olhando para `+Z`, base em `y = 0`. A cena passa pela `fundir()`:
 * cada material vira uma malha.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { uvDeParede, uvEmMetros, uvEmMetrosPorTriangulo } from './acabamento';
import { quina, retangulo } from './lojaDeRoupas';
import { caber, fonte } from './lojaDePatins';
import { inoxEscovado, marmore, tabuasDeLambri, veioDeMadeira } from './texturasDeCasa';
import { novaTextura, sorteio } from './texturasDeChao';

/** as medidas que a cena e os testes usam, no quadro da peça */
export const SORVETERIA_DO_MANO = {
  /** o deque: é o colisor do quiosque */
  meiaX: 1.4,
  meiaZ: 0.95,
  /** o alto do tampo do balcão, e até onde ele avança na frente */
  balcao: 1.17,
  frenteDoBalcao: 1.32,
} as const;

const css = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;
const v3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

// ===================================================================== TEXTURAS

/** a lona do toldo e do guarda-sol: listras de 25 cm, rosa e creme, com a costura */
function listras(): THREE.CanvasTexture {
  return novaTextura('sorveteria:listras', 0.5, (ctx, s) => {
    ctx.fillStyle = css(P.sorveteriaCreme);
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = css(P.sorveteriaRosa);
    ctx.fillRect(0, 0, s / 2, s);
    for (let y = 0; y < s; y += 5) {
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fillRect(0, y, s, 2);
    }
    ctx.fillStyle = 'rgba(120,50,70,0.14)';
    ctx.fillRect(s / 2 - 1, 0, 2, s);
    ctx.fillRect(0, 0, 1, s);
    ctx.fillRect(s - 1, 0, 1, s);
  });
}

/**
 * AS ESCAMAS do telhado: fileiras de telhinha redonda, desencontradas, cada
 * uma tapando o pé da de cima — o contorno escuro e a sombra fina embaixo da
 * meia-lua são o que desenha a fileira no toon. Quase branco: o chocolate é a
 * cor do material. Fileira de 12 cm (menos que isso vira chiado nesta câmera).
 *
 * O `v` da telha cresce ÁGUA ABAIXO (ver `telhado` mais embaixo), e no canvas
 * isso é para CIMA: a ponta redonda de cada escama aponta para o `y` menor.
 */
function escamas(): THREE.CanvasTexture {
  return novaTextura('sorveteria:escamas', 0.48, (ctx, s) => {
    const rnd = sorteio(4412);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const fileiras = 4;
    const porFileira = 4;
    const h = s / fileiras;
    const w = s / porFileira;
    const r = w / 2;
    // de cima (água abaixo) para baixo (água acima): a de baixo é pregada
    // depois e cobre o pé da de cima
    for (let j = -1; j <= fileiras; j++) {
      for (let i = -1; i <= porFileira; i++) {
        const cx = (i + (j % 2 === 0 ? 0 : 0.5)) * w + w / 2;
        const ponta = j * h;
        const tom = 0.9 + rnd() * 0.1;
        for (const dy of [0, s]) {
          const y0 = ponta + dy;
          ctx.beginPath();
          ctx.moveTo(cx - r, y0 + h * 1.9);
          ctx.lineTo(cx - r, y0 + r);
          ctx.arc(cx, y0 + r, r, Math.PI, 0, false);
          ctx.lineTo(cx + r, y0 + h * 1.9);
          ctx.closePath();
          const g = ctx.createLinearGradient(0, y0, 0, y0 + h * 1.4);
          g.addColorStop(0, `rgba(${Math.round(255 * tom)},${Math.round(250 * tom)},${Math.round(245 * tom)},1)`);
          g.addColorStop(1, `rgba(${Math.round(225 * tom)},${Math.round(215 * tom)},${Math.round(205 * tom)},1)`);
          ctx.fillStyle = g;
          ctx.fill();
          // o contorno da meia-lua, e o brilho logo atrás dela
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(70,35,20,0.45)';
          ctx.beginPath();
          ctx.arc(cx, y0 + r, r - 1.5, Math.PI, 0, false);
          ctx.stroke();
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.beginPath();
          ctx.arc(cx, y0 + r + 3, r - 5, Math.PI * 1.15, Math.PI * 1.85, false);
          ctx.stroke();
        }
      }
    }
  });
}

/**
 * A GRADE DO WAFFLE da casquinha: losangos em diagonal, o sulco escuro e o
 * filete de luz ao lado. `lado` é o tamanho do losango no UV da peça torneada
 * (que vai de 0 a 1 em volta e de 0 a 1 na altura).
 */
export function waffle(lado: number): THREE.CanvasTexture {
  return novaTextura(`sorveteria:waffle:${lado}`, lado, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    for (const [a, b] of [[0, s], [s, 0]] as const) {
      for (let k = -1; k <= 1; k++) {
        ctx.strokeStyle = 'rgba(140,80,25,0.55)';
        ctx.lineWidth = s * 0.07;
        ctx.beginPath();
        ctx.moveTo(k * s, a);
        ctx.lineTo(k * s + s, b);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,240,210,0.6)';
        ctx.lineWidth = s * 0.025;
        ctx.beginPath();
        ctx.moveTo(k * s + s * 0.06, a);
        ctx.lineTo(k * s + s * 1.06, b);
        ctx.stroke();
      }
    }
  });
}

/** o piso de dentro: xadrez de 25 cm, rosa e creme */
function pisoXadrez(): THREE.CanvasTexture {
  return novaTextura('sorveteria:piso', 0.5, (ctx, s) => {
    const q = s / 2;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.fillStyle = css((i + j) % 2 ? P.sorveteriaRosa : P.sorveteriaCreme);
        ctx.fillRect(i * q, j * q, q, q);
      }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let k = 0; k <= 2; k++) {
      ctx.fillRect(k * q - 1, 0, 2, s);
      ctx.fillRect(0, k * q - 1, s, 2);
    }
  });
}

/**
 * Um quadro pintado em canvas (a placa, a lousa, a faixa dos sabores): o
 * material, para quem monta a geometria do jeito que a peça pedir (a placa é
 * um ARCO). O UV da geometria tem que ir de 0 a 1 no retângulo do desenho.
 */
function pintura(largura: number, altura: number, pintar: (ctx: CanvasRenderingContext2D, W: number, H: number) => void): THREE.MeshBasicMaterial {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.max(32, Math.round((1024 * altura) / largura));
  const ctx = canvas.getContext('2d');
  if (ctx) pintar(ctx, canvas.width, canvas.height);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return new THREE.MeshBasicMaterial({ map: textura });
}

/** o floquinho de neve de seis pontas, desenhado no canvas */
function floquinho(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, cor: string): void {
  ctx.save();
  ctx.strokeStyle = cor;
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(2, r * 0.16);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + c * r, cy + s * r);
    ctx.stroke();
    // o galhinho em V perto da ponta
    for (const lado of [-1, 1]) {
      const b = a + lado * 0.7;
      ctx.beginPath();
      ctx.moveTo(cx + c * r * 0.55, cy + s * r * 0.55);
      ctx.lineTo(cx + c * r * 0.55 + Math.cos(b) * r * 0.3, cy + s * r * 0.55 + Math.sin(b) * r * 0.3);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/** os oito sabores da vitrine, na ordem das cubas (fileira da frente primeiro) */
export const SABORES_DO_MANO: ReadonlyArray<{ nome: string; cor: number }> = [
  { nome: 'Morango', cor: P.morango },
  { nome: 'Maracujá', cor: P.maracuja },
  { nome: 'Chocolate', cor: P.chocolate },
  { nome: 'Limão', cor: P.limao },
  { nome: 'Creme', cor: P.sorveteriaBaunilha },
  { nome: 'Pistache', cor: P.sorveteriaPistache },
  { nome: 'Açaí', cor: P.sorveteriaAcai },
  { nome: 'Doce de leite', cor: P.sorveteriaDoceDeLeite },
];

/**
 * A PLACA DA EMPENA, em arco: "Sorvetes" grande em chocolate com o contorno
 * branco, "do Mano" embaixo em rosa, a carinha do pinguim em cima e dois
 * floquinhos. O contorno do arco é desenhado no próprio canvas (a geometria
 * recorta o resto).
 */
function artePlaca(largura: number, altura: number, arco: (ctx: CanvasRenderingContext2D, W: number, H: number, recuo: number) => void): THREE.MeshBasicMaterial {
  return pintura(largura, altura, (ctx, W, H) => {
    ctx.fillStyle = css(P.sorveteriaCreme);
    ctx.fillRect(0, 0, W, H);
    // o filete rosa por dentro da borda
    ctx.lineWidth = H * 0.035;
    ctx.strokeStyle = css(P.sorveteriaRosa);
    arco(ctx, W, H, H * 0.07);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    // "Sorvetes"
    const t = caber(ctx, 'Sorvetes', Math.round(H * 0.34), W * 0.6);
    ctx.font = fonte(t);
    const y = H * 0.58;
    ctx.fillStyle = 'rgba(80,40,30,0.25)';
    ctx.fillText('Sorvetes', W / 2 + t * 0.05, y + t * 0.06);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = t * 0.16;
    ctx.strokeText('Sorvetes', W / 2, y);
    ctx.fillStyle = css(P.sorveteriaTelhado);
    ctx.fillText('Sorvetes', W / 2, y);
    // "do Mano"
    const t2 = caber(ctx, 'do Mano', Math.round(H * 0.17), W * 0.34);
    ctx.font = fonte(t2, true);
    ctx.fillStyle = css(0xe0789a);
    ctx.fillText('do Mano', W / 2, H * 0.83);
    // a carinha do pinguim, em cima: cabeça preta, rosto branco, bico laranja
    const cx = W / 2;
    const cy = H * 0.24;
    const r = H * 0.1;
    ctx.fillStyle = '#26303c';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.2, r * 0.68, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#26303c';
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + lado * r * 0.3, cy + r * 0.05, r * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f2a03d';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.18, cy + r * 0.3);
    ctx.lineTo(cx + r * 0.18, cy + r * 0.3);
    ctx.lineTo(cx, cy + r * 0.55);
    ctx.closePath();
    ctx.fill();
    // e o chapeuzinho de casquinha dele, com a bola de morango
    ctx.fillStyle = css(P.casquinhaWaffle);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy - r * 0.75);
    ctx.lineTo(cx + r * 0.55, cy - r * 0.75);
    ctx.lineTo(cx, cy - r * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(P.morango);
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.95, r * 0.42, 0, Math.PI * 2);
    ctx.fill();
    // os floquinhos dos lados
    floquinho(ctx, W * 0.16, H * 0.66, H * 0.1, css(0x9fc7dc));
    floquinho(ctx, W * 0.84, H * 0.66, H * 0.1, css(0x9fc7dc));
  });
}

/** A LOUSA DOS SABORES, escrita a giz: o título, os oito com a bolinha da cor, e as casquinhas. */
function arteLousa(largura: number, altura: number): THREE.MeshBasicMaterial {
  return pintura(largura, altura, (ctx, W, H) => {
    const rnd = sorteio(9090);
    ctx.fillStyle = '#2f3b37';
    ctx.fillRect(0, 0, W, H);
    // o pó de giz: manchas claras apagadas
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.02 + rnd() * 0.04})`;
      const r = W * (0.04 + rnd() * 0.12);
      ctx.beginPath();
      ctx.ellipse(rnd() * W, rnd() * H, r, r * 0.5, rnd() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const giz = 'rgba(250,248,240,0.92)';
    const titulo = caber(ctx, 'Sabores', Math.round(H * 0.1), W * 0.8, true);
    ctx.font = fonte(titulo, true);
    ctx.fillStyle = giz;
    ctx.fillText('Sabores', W / 2, H * 0.09);
    // o sublinhado de giz, meio torto
    ctx.strokeStyle = giz;
    ctx.lineWidth = H * 0.008;
    ctx.beginPath();
    ctx.moveTo(W * 0.22, H * 0.155);
    ctx.quadraticCurveTo(W * 0.5, H * 0.17, W * 0.78, H * 0.15);
    ctx.stroke();
    const passo = H * 0.083;
    ctx.textAlign = 'left';
    SABORES_DO_MANO.forEach(({ nome, cor }, i) => {
      const y = H * 0.23 + i * passo;
      ctx.fillStyle = css(cor);
      ctx.beginPath();
      ctx.arc(W * 0.14, y, H * 0.022, 0, Math.PI * 2);
      ctx.fill();
      const t = caber(ctx, nome, Math.round(H * 0.055), W * 0.7);
      ctx.font = fonte(t);
      ctx.fillStyle = giz;
      ctx.fillText(nome, W * 0.22, y + t * 0.04);
    });
    ctx.textAlign = 'center';
    const pe = caber(ctx, 'casquinha · copinho · taça', Math.round(H * 0.045), W * 0.86, true);
    ctx.font = fonte(pe, true);
    ctx.fillStyle = css(0xf6b8cc);
    ctx.fillText('casquinha · copinho · taça', W / 2, H * 0.93);
    floquinho(ctx, W * 0.1, H * 0.08, H * 0.035, 'rgba(250,248,240,0.7)');
    floquinho(ctx, W * 0.9, H * 0.08, H * 0.035, 'rgba(250,248,240,0.7)');
  });
}

/** a faixa dos sabores da fileira da frente da vitrine: quatro etiquetas */
function arteFaixa(largura: number, altura: number): THREE.MeshBasicMaterial {
  return pintura(largura, altura, (ctx, W, H) => {
    ctx.fillStyle = css(P.sorveteriaCreme);
    ctx.fillRect(0, 0, W, H);
    const casa = W / 4;
    SABORES_DO_MANO.slice(0, 4).forEach(({ nome, cor }, i) => {
      const cx = casa * (i + 0.5);
      ctx.fillStyle = css(cor);
      ctx.fillRect(casa * i + 4, 0, casa - 8, H * 0.18);
      const t = caber(ctx, nome, Math.round(H * 0.62), casa * 0.86);
      ctx.font = fonte(t);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = css(P.sorveteriaTelhado);
      ctx.fillText(nome, cx, H * 0.6);
    });
  });
}

// ===================================================================== GEOMETRIAS

/** o UV de 0 a 1 no retângulo que envolve a geometria (para os quadros pintados) */
function uvNoRetangulo(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  geo.computeBoundingBox();
  const b = geo.boundingBox!;
  const pos = geo.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - b.min.x) / (b.max.x - b.min.x);
    uv[i * 2 + 1] = (pos.getY(i) - b.min.y) / (b.max.y - b.min.y);
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

/** o ARCO da placa: retângulo baixo com meia-elipse em cima, base em `y = 0` */
function formaDeArco(meia: number, reto: number, alto: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-meia, 0);
  s.lineTo(meia, 0);
  s.lineTo(meia, reto);
  s.absellipse(0, reto, meia, alto, 0, Math.PI, false, 0);
  s.lineTo(-meia, 0);
  return s;
}

/**
 * Um MONTINHO DE GELATO: o sorvete servido em onda na cuba, como gelateria de
 * verdade. Uma grade deitada, levantada em cúpula de topo chato (as bordas
 * descem até o pé da cuba) e ondulada na diagonal — a onda da paleta. Base em
 * `y = 0`, do tamanho da cuba.
 */
function montinho(larg: number, prof: number, alto: number, fase: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(larg, prof, 10, 8);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const ux = Math.min(1, Math.abs((2 * x) / larg));
    const uz = Math.min(1, Math.abs((2 * z) / prof));
    const cupula = Math.sqrt(Math.max(0, 1 - ux ** 4)) * Math.sqrt(Math.max(0, 1 - uz ** 4));
    const onda = Math.sin(x * 38 + z * 16 + fase) * 0.22 + Math.sin(x * 15 - z * 30 + fase * 2.3) * 0.12;
    pos.setY(i, alto * cupula * (0.82 + onda));
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * A BOLA DE SORVETE: a cúpula de cima com a saia ondulada embaixo — a "boca"
 * da colher, que é o que faz bola ler como sorvete e não como bexiga. O centro
 * da esfera em `y = 0`; a saia desce até `−0,37 r`.
 */
export function geoBolaDeSorvete(r: number, gomos = 18, aneis = 12): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(r, gomos, aneis, 0, Math.PI * 2, 0, Math.PI * 0.62);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const py = pos.getY(i);
    // a borda de baixo da bola ondula para fora (a marca da colher)
    const f = Math.min(1, Math.max(0, (r * 0.1 - py) / (r * 0.47)));
    if (f > 0) {
      const a = Math.atan2(pos.getZ(i), pos.getX(i));
      const k = 1 + (0.1 * Math.sin(a * 9) + 0.05) * f;
      pos.setX(i, pos.getX(i) * k);
      pos.setZ(i, pos.getZ(i) * k);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/** a cobertura das peças torneadas: o perfil em pares (raio, altura), de baixo para cima */
export function torno(perfil: ReadonlyArray<readonly [number, number]>, gomos: number): THREE.LatheGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), gomos);
}

/**
 * A CASQUINHA GIGANTE da cumeeira: o cone de waffle torneado (com a borda
 * dobrada), duas bolas com a saia ondulada embaixo — a "boca" da colher de
 * sorvete, que é o que faz bola ler como sorvete e não como bexiga — e a
 * cereja com o cabinho. Ponta do cone em `y = 0`.
 */
export function casquinhaGigante(escala = 1, sabores: readonly number[] = [P.morango, P.sorveteriaBaunilha]): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'casquinha-gigante';
  const cone = new THREE.Mesh(
    torno([[0.005, 0], [0.06, 0.12], [0.2, 0.62], [0.235, 0.66], [0.25, 0.7], [0.215, 0.71]], 16),
    toon(P.casquinhaWaffle, { mapa: waffle(1 / 7) }),
  );
  g.add(cone);
  const bola = (y: number, r: number, cor: number): void => {
    const m = new THREE.Mesh(geoBolaDeSorvete(r), toon(cor));
    m.position.y = y;
    g.add(m);
  };
  bola(0.74, 0.26, sabores[0]);
  bola(1.02, 0.22, sabores[1] ?? sabores[0]);
  const cereja = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 9), toon(P.cerejaDoMano));
  cereja.position.y = 1.26;
  g.add(cereja);
  const cabo = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(v3(0, 1.3, 0), v3(0.02, 1.4, 0), v3(0.07, 1.44, 0.01)), 6, 0.008, 5),
    toon(P.leafDark),
  );
  g.add(cabo);
  g.scale.setScalar(escala);
  return g;
}

// ==================================================================== O QUIOSQUE

/**
 * O chalezinho do Mano. Ver o comentário do arquivo.
 */
export function sorveteriaDoMano(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'sorveteria';

  // ------------------------------------------------------------- materiais
  const madeira = toon(P.wood, { mapa: veioDeMadeira() });
  const madeiraEscura = toon(P.woodDark, { mapa: veioDeMadeira() });
  const parede = toon(P.sorveteriaRosa, { mapa: tabuasDeLambri(0.6, 5) });
  const creme = toon(P.sorveteriaCreme);
  const menta = toon(P.sorveteriaMenta);
  const telha = toon(P.sorveteriaTelhado, { mapa: escamas() });
  const neve = toon(P.neveFofa);
  const pingente = toon(P.geloCristal, { glow: 0.22 });
  const inox = toon(P.metalWhite, { mapa: inoxEscovado() });
  const metal = toon(P.metalGrey);
  const escuro = toon(0x3a3330);
  const ouro = toon(P.gold);
  const lona = toon(0xffffff, { mapa: listras(), doubleSide: true });
  const casquinha = toon(P.casquinhaWaffle, { mapa: waffle(1 / 4) });
  const piso = toon(0xffffff, { mapa: pisoXadrez() });

  const peca = (pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  };
  const caixa = (l: number, a: number, p: number, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh =>
    peca(g, new THREE.BoxGeometry(l, a, p), mat, x, y, z);
  const macia = (l: number, a: number, p: number, mat: THREE.Material, x: number, y: number, z: number, r = 0.02): THREE.Mesh =>
    peca(g, uvEmMetrosPorTriangulo(quina(l, a, p, r)), mat, x, y, z);
  /** um tubo reto de `a` até `b` */
  const tubo = (a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material, lados = 6): THREE.Mesh => {
    const d = b.clone().sub(a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), lados, 1, true), mat);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    g.add(m);
    return m;
  };

  // --------------------------------------------------------------- medidas
  const HX = 1.175; // meia largura do corpo, por fora
  const ESP = 0.08;
  const ZF = 0.65; // a face de fora da parede da frente
  const ZT = -0.75; // a face de fora da parede do fundo
  const Y0 = 0.16; // o alto do deque
  /** a face de baixo do telhado: 2,82 na cumeeira, 1,95 no prumo da parede */
  const CUME = 2.82;
  const K = 0.7404;
  const baixoDoTelhado = (x: number): number => CUME - K * Math.abs(x);
  const TETA = Math.atan(K);
  const ESP_TELHA = 0.07;
  const BEIRAL = 0.16; // quanto o telhado passa da parede nos lados
  const Z_TELHADO = [ZT - 0.17, ZF + 0.17] as const;
  const JANELA = { x0: -0.8, x1: 0.8, y0: 1.15, y1: 1.78 };
  const TAMPO = SORVETERIA_DO_MANO.balcao;

  // ================================================================== O DEQUE
  // o estrado de madeira em que o chalé se apoia: é o colisor da cena
  macia(SORVETERIA_DO_MANO.meiaX * 2, Y0, SORVETERIA_DO_MANO.meiaZ * 2, madeiraEscura, 0, Y0 / 2, 0, 0.03);
  // o piso de dentro, xadrez, 5 mm acima do deque (a face de baixo fica enterrada nele)
  {
    const geo = new THREE.BoxGeometry(HX * 2 - ESP * 2 + 0.02, 0.02, ZF - ZT - ESP * 2 + 0.02);
    uvEmMetros(geo);
    peca(g, geo, piso, 0, Y0 + 0.005, (ZF + ZT) / 2);
  }

  // ================================================================= PAREDES
  // a frente e o fundo são o pentágono da empena; a frente com o furo da janela
  const empena = (furo: boolean): THREE.Shape => {
    const s = new THREE.Shape();
    s.moveTo(-HX, Y0);
    s.lineTo(HX, Y0);
    s.lineTo(HX, baixoDoTelhado(HX) + 0.02);
    s.lineTo(0, CUME + 0.02);
    s.lineTo(-HX, baixoDoTelhado(HX) + 0.02);
    s.closePath();
    if (furo) s.holes.push(retangulo(new THREE.Path(), JANELA.x0, JANELA.y0, JANELA.x1, JANELA.y1));
    return s;
  };
  for (const [z0, furo] of [[ZF - ESP, true], [ZT, false]] as const) {
    const geo = new THREE.ExtrudeGeometry(empena(furo), { depth: ESP, bevelEnabled: false, curveSegments: 4 });
    geo.translate(0, 0, z0);
    peca(g, uvDeParede(geo), parede, 0, 0, 0);
  }
  // os lados, entre a frente e o fundo, até dentro do telhado
  for (const lado of [-1, 1]) {
    const alto = 2.0 - Y0;
    const geo = new THREE.BoxGeometry(ESP, alto, ZF - ZT - ESP * 2);
    const x = lado * (HX - ESP / 2);
    const y = Y0 + alto / 2;
    const z = (ZF + ZT) / 2;
    peca(g, uvDeParede(geo, x, y, z), parede, x, y, z);
  }
  // as cantoneiras creme: 1 cm para fora das duas paredes, e 8,8 cm de lado
  // (com 9, a face de dentro caía no plano de dentro da parede da frente), o
  // pé 1 cm enfiado no deque
  for (const sx of [-1, 1]) {
    for (const [zc, sz] of [[ZF, 1], [ZT, -1]] as const) {
      const alto = baixoDoTelhado(HX) - Y0;
      macia(0.088, alto, 0.088, creme, sx * (HX - 0.034), Y0 - 0.01 + alto / 2, zc - sz * 0.034, 0.012);
    }
  }

  // ------------------------------------------------------- a janela e o que a enfeita
  {
    // a moldura menta: 2 cm para dentro do furo nos lados e em cima; embaixo
    // ela some no tampo (no alto do tampo, as duas faces de cima brigariam)
    const forma = retangulo(new THREE.Shape(), -0.9, 1.1, 0.9, 1.87);
    forma.holes.push(retangulo(new THREE.Path(), -0.78, 1.15, 0.78, 1.76));
    const geo = new THREE.ExtrudeGeometry(forma, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1 });
    geo.translate(0, 0, ZF);
    peca(g, geo, menta, 0, 0, 0);
    // os dois flocos de neve de madeira, um de cada lado da janela
    for (const lado of [-1, 1]) {
      const floco = new THREE.Group();
      floco.position.set(lado * 1.0, 1.52, ZF + 0.012);
      floco.rotation.z = lado * 0.2;
      for (let i = 0; i < 6; i++) {
        const braco = new THREE.Group();
        braco.rotation.z = (i / 6) * Math.PI * 2;
        const haste = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.085, 0.012), creme);
        haste.position.y = 0.042;
        braco.add(haste);
        for (const s of [-1, 1]) {
          const galho = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.035, 0.008), creme);
          galho.position.set(s * 0.012, 0.058, 0);
          galho.rotation.z = -s * 0.75;
          braco.add(galho);
        }
        floco.add(braco);
      }
      const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.014, 6), creme);
      miolo.rotation.x = Math.PI / 2;
      floco.add(miolo);
      g.add(floco);
    }
  }

  // ================================================================== O BALCÃO
  {
    // A FRENTE CANELADA: a planta (x, −z) com a borda da frente em meias-luas,
    // extrudada para cima — o toon desenha cada canelura sozinho
    const r = 0.04;
    const zFrente = 0.97;
    const forma = new THREE.Shape();
    forma.moveTo(-1.2, -0.62);
    forma.lineTo(1.2, -0.62);
    forma.lineTo(1.2, -zFrente);
    const n = Math.round(2.4 / (r * 2));
    for (let k = 0; k < n; k++) {
      const cx = 1.2 - (k + 0.5) * r * 2;
      forma.absarc(cx, -zFrente, r, 0, -Math.PI, true);
    }
    forma.lineTo(-1.2, -0.62);
    const geo = new THREE.ExtrudeGeometry(forma, { depth: TAMPO - 0.08 - 0.1, bevelEnabled: false, curveSegments: 4 });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0.1, 0);
    peca(g, geo, creme, 0, 0, 0);
    // o rodapé menta, recuado da canelura (o pé 5 mm acima do chão: no zero,
    // a face de baixo dele dividia o plano com a do deque)
    macia(2.36, 0.095, 0.34, menta, 0, 0.0525, 0.79, 0.015);
    // a faixa menta logo abaixo do tampo, 1 cm para fora da canelura
    macia(2.44, 0.05, 0.44, menta, 0, TAMPO - 0.08 - 0.02, 0.81, 0.012);
  }
  // o tampo de madeira, avançando 32 cm (o de dentro é outro, meio centímetro
  // mais baixo: rentes, os dois de cima dividiriam o plano no vão da janela)
  macia(2.52, 0.08, 0.72, madeira, 0, TAMPO - 0.04, 0.96, 0.025);
  macia(HX * 2 - ESP * 2 - 0.01, 0.08, 0.42, madeira, 0, TAMPO - 0.045, 0.41, 0.02);
  // as mãos-francesas creme debaixo do avanço do tampo: um S recortado
  for (const x of [-0.85, 0, 0.85]) {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.3, 0);
    s.quadraticCurveTo(0.29, -0.06, 0.2, -0.08);
    s.quadraticCurveTo(0.06, -0.1, 0.03, -0.2);
    s.lineTo(0, -0.2);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false, curveSegments: 5 });
    geo.translate(0, 0, -0.015);
    // 3 mm abaixo do tampo: rente, o alto dela dividia o plano com o da canelura
    const m = peca(g, geo, creme, x, TAMPO - 0.083, 0.99);
    m.rotation.y = -Math.PI / 2;
  }

  // ------------------------------------------------------- A VITRINE DE GELATO
  {
    const cx = -0.58;
    const cz = 1.05;
    const L = 1.0;
    const D = 0.43;
    const yTopo = TAMPO + 0.13;
    // o corpo de inox, e a chapa de cima com os oito furos (uma forma com furo)
    macia(L, 0.105, D, inox, cx, TAMPO + 0.0525, cz, 0.012);
    const cuba = { l: 0.2, p: 0.15, vao: 0.03 };
    const furos: Array<[number, number]> = [];
    const chapa = retangulo(new THREE.Shape(), -L / 2, -D / 2, L / 2, D / 2);
    for (let fila = 0; fila < 2; fila++) {
      for (let i = 0; i < 4; i++) {
        const x = -L / 2 + 0.055 + cuba.l / 2 + i * (cuba.l + cuba.vao);
        const z = fila === 0 ? 0.09 : -0.09;
        furos.push([x, z]);
        chapa.holes.push(retangulo(new THREE.Path(), x - cuba.l / 2, -z - cuba.p / 2, x + cuba.l / 2, -z + cuba.p / 2));
      }
    }
    const geo = new THREE.ExtrudeGeometry(chapa, { depth: 0.025, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    uvEmMetros(geo);
    peca(g, geo, inox, cx, yTopo - 0.025, cz);
    // o corrimão da frente da vitrine
    const corrimao = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, L + 0.02, 8), inox);
    corrimao.rotation.z = Math.PI / 2;
    corrimao.position.set(cx, yTopo + 0.01, cz + D / 2 + 0.02);
    g.add(corrimao);
    for (const s of [-1, 1]) tubo(v3(cx + s * L / 2, yTopo - 0.03, cz + D / 2), v3(cx + s * L / 2, yTopo + 0.01, cz + D / 2 + 0.02), 0.01, inox);

    // os montinhos (duas ondas que se alternam) e o que vai em cima de cada um
    const ondas = [montinho(cuba.l + 0.016, cuba.p + 0.016, 0.085, 0.4), montinho(cuba.l + 0.016, cuba.p + 0.016, 0.1, 2.1)];
    const bolinha = new THREE.SphereGeometry(1, 6, 4);
    const rodela = new THREE.CylinderGeometry(1, 1, 0.2, 10);
    const pedaco = new THREE.BoxGeometry(1, 1, 1);
    const paleta = new THREE.BoxGeometry(0.045, 0.004, 0.08);
    const cabo = new THREE.CylinderGeometry(0.007, 0.007, 0.07, 5);
    furos.forEach(([x, z], i) => {
      const { cor } = SABORES_DO_MANO[i];
      const atras = i >= 4;
      const m = new THREE.Mesh(ondas[i % 2], toon(cor));
      m.position.set(cx + x, yTopo - 0.012, cz + z);
      if (i % 3 === 1) m.rotation.y = Math.PI;
      g.add(m);
      const topo = yTopo + (atras ? 0.085 : 0.07);
      const enfeite = (geo: THREE.BufferGeometry, corDele: number, dx: number, dz: number, dy: number, s: THREE.Vector3, giro = 0): void => {
        const e = new THREE.Mesh(geo, toon(corDele));
        e.position.set(cx + x + dx, topo + dy, cz + z + dz);
        e.scale.copy(s);
        e.rotation.set(giro * 0.5, giro, giro * 0.3);
        g.add(e);
      };
      // cada sabor com o seu enfeite: a fruta, a raspa, a semente, a rodela
      switch (i) {
        case 0: // morango: dois morangos de verdade
          enfeite(bolinha, P.sorveteriaFruta, -0.03, 0.01, 0.0, v3(0.022, 0.026, 0.022));
          enfeite(bolinha, P.sorveteriaFruta, 0.035, -0.02, -0.01, v3(0.019, 0.023, 0.019));
          break;
        case 1: // maracujá: as sementes pretas espalhadas
          for (const [dx, dz] of [[-0.04, 0.02], [0.0, -0.025], [0.04, 0.015], [0.015, 0.035], [-0.02, -0.03]]) {
            enfeite(bolinha, P.sorveteriaAmargo, dx, dz, -0.008, v3(0.008, 0.006, 0.008));
          }
          break;
        case 2: // chocolate: as raspas de amargo
          enfeite(pedaco, P.sorveteriaAmargo, -0.02, 0.0, 0.0, v3(0.04, 0.012, 0.025), 0.5);
          enfeite(pedaco, P.sorveteriaAmargo, 0.035, 0.02, -0.006, v3(0.03, 0.01, 0.02), -0.7);
          break;
        case 3: // limão: a rodela em pé
          enfeite(rodela, 0xf3f7b0, 0.0, 0.0, 0.012, v3(0.032, 0.05, 0.032), 1.2);
          break;
        case 4: // creme: o canudinho de biscoito deitado
          enfeite(pedaco, P.casquinhaWaffle, 0.0, 0.0, 0.004, v3(0.1, 0.016, 0.016), 0.35);
          break;
        case 5: // pistache: as castanhas
          enfeite(bolinha, 0x7f9a4a, -0.03, 0.0, 0.0, v3(0.014, 0.01, 0.018));
          enfeite(bolinha, 0x7f9a4a, 0.025, 0.02, -0.004, v3(0.014, 0.01, 0.018));
          enfeite(bolinha, 0x7f9a4a, 0.01, -0.03, -0.006, v3(0.012, 0.009, 0.015));
          break;
        case 6: // açaí: a granola por cima
          for (const [dx, dz] of [[-0.03, 0.0], [0.0, 0.02], [0.03, -0.01], [0.01, -0.03], [-0.015, 0.03]]) {
            enfeite(bolinha, 0xd8b27a, dx, dz, -0.004, v3(0.012, 0.009, 0.012));
          }
          break;
        default: // doce de leite: a rodela de caramelo
          enfeite(rodela, P.casquinhaGrelha, 0.0, 0.0, 0.002, v3(0.04, 0.06, 0.04));
      }
      // a paletinha enfiada no sorvete, com o cabo para fora da cuba
      const pa = new THREE.Group();
      pa.position.set(cx + x + 0.06, topo - 0.03, cz + z - 0.04);
      pa.rotation.set(0.25, 0.3, 0.5);
      const lamina = new THREE.Mesh(paleta, metal);
      pa.add(lamina);
      const c = new THREE.Mesh(cabo, menta);
      c.position.set(0, 0, -0.06);
      c.rotation.x = Math.PI / 2;
      pa.add(c);
      g.add(pa);
    });

    // a faixa dos nomes na frente da vitrine, 3 mm para fora do inox
    const faixa = new THREE.Mesh(uvNoRetangulo(new THREE.PlaneGeometry(0.92, 0.06)), arteFaixa(0.92, 0.06));
    faixa.position.set(cx, TAMPO + 0.06, cz + D / 2 + 0.003);
    g.add(faixa);
  }

  // ------------------------------------------- o resto do balcão: casquinhas e miudezas
  {
    // o suporte de casquinhas em pé: degrau de madeira com seis furos, e as
    // casquinhas enfiadas de ponta para baixo
    const sx = 0.25;
    const sz = 1.05;
    // o degrau de trás 2 cm mais estreito, 1 cm para dentro e meio centímetro
    // acima do tampo: do mesmo tamanho, as faces dos dois dividiam os planos
    macia(0.34, 0.06, 0.2, madeira, sx, TAMPO + 0.03, sz, 0.01);
    macia(0.32, 0.11, 0.09, madeira, sx, TAMPO + 0.06, sz - 0.045, 0.01);
    const cone = torno([[0.003, 0], [0.03, 0.06], [0.05, 0.13], [0.056, 0.14], [0.05, 0.145]], 10);
    for (let i = 0; i < 6; i++) {
      const atras = i >= 3;
      const x = sx - 0.11 + (i % 3) * 0.11;
      const c = new THREE.Mesh(cone, casquinha);
      c.position.set(x, TAMPO + (atras ? 0.07 : 0.02), sz + (atras ? -0.055 : 0.045));
      g.add(c);
    }
    // a pilha de casquinhas encaixadas, deitada na frente do suporte
    for (let i = 0; i < 4; i++) {
      const c = new THREE.Mesh(cone, casquinha);
      c.rotation.z = Math.PI / 2 - 0.05;
      c.position.set(sx + 0.24 - i * 0.025, TAMPO + 0.06, sz + 0.1);
      g.add(c);
    }
    // a sineta de balcão: base preta, cúpula dourada e o botão
    peca(g, new THREE.CylinderGeometry(0.05, 0.055, 0.02, 14), escuro, 0.66, TAMPO + 0.01, 1.2);
    peca(g, torno([[0.045, 0], [0.044, 0.015], [0.035, 0.035], [0.018, 0.048], [0.0, 0.052]], 14), ouro, 0.66, TAMPO + 0.02, 1.2);
    peca(g, new THREE.SphereGeometry(0.01, 8, 6), ouro, 0.66, TAMPO + 0.076, 1.2);
    tubo(v3(0.66, TAMPO + 0.06, 1.2), v3(0.66, TAMPO + 0.074, 1.2), 0.004, ouro);
    // o porta-guardanapo de inox com o leque de papel
    macia(0.12, 0.08, 0.06, inox, 0.86, TAMPO + 0.04, 0.95, 0.008);
    for (let i = 0; i < 4; i++) {
      const papel = caixa(0.1, 0.09, 0.006, creme, 0.86, TAMPO + 0.075, 0.935 + i * 0.01);
      papel.rotation.x = (i - 1.5) * 0.09;
    }
    // os potes de confeito, com a tampa de cor
    const potes: Array<[number, number, number]> = [[1.0, 0.76, P.sorveteriaRosa], [1.09, 0.84, P.sorveteriaMenta], [0.98, 0.9, P.maracuja]];
    for (const [x, z, cor] of potes) {
      peca(g, new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12), creme, x, TAMPO + 0.05, z);
      peca(g, new THREE.CylinderGeometry(0.043, 0.043, 0.025, 12), toon(cor), x, TAMPO + 0.11, z);
    }
  }

  // ------------------------------------------------- lá dentro, pela janela
  {
    const yb = TAMPO - 0.005;
    // a máquina de sorvete expresso: o corpo de inox, as duas tremonhas em cima,
    // as alavancas de bolinha vermelha, os bicos e a bandeja de pingar
    const mx = 0.42;
    const mz = 0.33;
    macia(0.36, 0.4, 0.26, inox, mx, yb + 0.2, mz, 0.03);
    for (const s of [-1, 1]) {
      peca(g, new THREE.CylinderGeometry(0.065, 0.06, 0.07, 14), inox, mx + s * 0.085, yb + 0.43, mz - 0.02);
      peca(g, new THREE.CylinderGeometry(0.068, 0.068, 0.012, 14), escuro, mx + s * 0.085, yb + 0.47, mz - 0.02);
      peca(g, new THREE.CylinderGeometry(0.018, 0.012, 0.05, 8), metal, mx + s * 0.08, yb + 0.21, mz + 0.14);
      tubo(v3(mx + s * 0.08, yb + 0.3, mz + 0.13), v3(mx + s * 0.08, yb + 0.37, mz + 0.19), 0.007, metal);
      peca(g, new THREE.SphereGeometry(0.018, 8, 6), toon(P.cerejaDoMano), mx + s * 0.08, yb + 0.375, mz + 0.195);
    }
    peca(g, new THREE.CylinderGeometry(0.016, 0.012, 0.05, 8), metal, mx, yb + 0.21, mz + 0.14);
    macia(0.3, 0.025, 0.08, metal, mx, yb + 0.06, mz + 0.16, 0.006);
    // a chapa de casquinha: a base, a chapa redonda de baixo e a tampa aberta
    const cx = -0.45;
    const cz = 0.36;
    macia(0.28, 0.07, 0.24, escuro, cx, yb + 0.035, cz, 0.015);
    peca(g, new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16), metal, cx, yb + 0.08, cz);
    {
      const tampa = new THREE.Group();
      tampa.position.set(cx, yb + 0.09, cz - 0.11);
      tampa.rotation.x = -1.15;
      const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16), escuro);
      disco.position.z = 0.11;
      tampa.add(disco);
      const alca = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6), madeira);
      alca.rotation.x = Math.PI / 2;
      alca.position.z = 0.27;
      tampa.add(alca);
      g.add(tampa);
    }
    // o waffle saindo da chapa, ainda dourado e chato
    peca(g, new THREE.CylinderGeometry(0.085, 0.085, 0.006, 16), casquinha, cx, yb + 0.093, cz);
    // a pilha de copinhos
    for (let i = 0; i < 5; i++) {
      peca(g, new THREE.CylinderGeometry(0.045, 0.035, 0.05, 12, 1, true), toon(P.sorveteriaRosa, { doubleSide: true }), -0.08, yb + 0.025 + i * 0.016, 0.38);
    }
  }

  // ===================================================================== O TOLDO
  /*
   * Raso (32 cm para fora) e com a saia em meia-lua: a vitrine fica fora da
   * sombra dele, na borda do tampo. As varetas correm por baixo da lona.
   */
  {
    const x0 = -0.875;
    const x1 = 0.875;
    const yAlto = 1.95;
    const yBaixo = 1.79;
    const avanco = 0.32;
    const saia = 0.11;
    const W = x1 - x0;
    const nx = Math.round(W / 0.0625);
    const ns = 5;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const comprimento = Math.hypot(avanco, yAlto - yBaixo);
    const nz = (yAlto - yBaixo) / comprimento;
    const ny = avanco / comprimento;
    for (let j = 0; j <= ns; j++) {
      const t = j / ns;
      for (let i = 0; i <= nx; i++) {
        const x = x0 + (i / nx) * W;
        const entre = (x - x0) / (W / 2);
        const cede = Math.abs(Math.sin(entre * Math.PI)) * 0.02 * Math.sin(t * Math.PI);
        const barriga = Math.sin(t * Math.PI) * 0.03 - cede;
        pos.push(x, yAlto + (yBaixo - yAlto) * t + ny * barriga, ZF + 0.03 + avanco * t + nz * barriga);
        // o `u` conta de onde o toldo começa: a listra casa com a meia-lua da saia
        uv.push(x - x0, t * comprimento);
      }
    }
    for (let j = 0; j < ns; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i;
        idx.push(a, a + 1, a + nx + 2, a, a + nx + 2, a + nx + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, lona));
    // a saia em meia-lua, uma por listra
    const r = 0.125;
    const corpo = saia - r * 0.6;
    const forma = new THREE.Shape();
    forma.moveTo(0, 0);
    forma.lineTo(W, 0);
    forma.lineTo(W, -corpo);
    const n = Math.round(W / (r * 2));
    for (let i = n - 1; i >= 0; i--) forma.absellipse((i + 0.5) * r * 2, -corpo, r, r * 0.6, 0, Math.PI, true, 0);
    forma.lineTo(0, 0);
    const saiaGeo = new THREE.ExtrudeGeometry(forma, { depth: 0.01, bevelEnabled: false, curveSegments: 6 });
    peca(g, saiaGeo, lona, x0, yBaixo + 0.005, ZF + 0.03 + avanco - 0.005);
    // as abas dos lados
    for (const x of [x0, x1]) {
      const aba = new THREE.Shape();
      aba.moveTo(0, yAlto);
      aba.lineTo(avanco, yBaixo);
      aba.lineTo(avanco, yBaixo - corpo);
      aba.lineTo(0, yAlto - 0.05);
      aba.closePath();
      const abaGeo = new THREE.ShapeGeometry(aba);
      abaGeo.rotateY(-Math.PI / 2);
      peca(g, abaGeo, lona, x + (x === x0 ? -0.006 : 0.006), 0, ZF + 0.03);
    }
    // o trilho na parede e as três varetas
    macia(W + 0.06, 0.05, 0.05, creme, 0, yAlto + 0.02, ZF + 0.025, 0.01);
    for (const x of [x0 + 0.04, 0, x1 - 0.04]) {
      tubo(v3(x, yAlto - 0.06, ZF + 0.03), v3(x, yBaixo - 0.02, ZF + 0.03 + avanco - 0.03), 0.011, metal);
    }
  }

  // ===================================================================== A PLACA
  {
    // do tamanho que cabe na empena sem o lambrequim e as luzinhas passarem
    // na frente dos ombros do arco
    const meia = 0.6;
    const reto = 0.08;
    const alto = 0.27;
    const y0 = 2.02;
    // a moldura creme (um arco extrudado) e a pintura 1 cm à frente dela
    const moldura = new THREE.ExtrudeGeometry(formaDeArco(meia + 0.035, reto + 0.035, alto + 0.035), {
      depth: 0.035, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1, curveSegments: 12,
    });
    peca(g, moldura, menta, 0, y0 - 0.035, ZF);
    const arco = (ctx: CanvasRenderingContext2D, W: number, H: number, recuo: number): void => {
      // o mesmo arco, no quadro do canvas (y para baixo)
      const sx = W / (meia * 2);
      const sy = H / (reto + alto);
      ctx.beginPath();
      ctx.moveTo(recuo, H - recuo);
      ctx.lineTo(W - recuo, H - recuo);
      ctx.lineTo(W - recuo, H - reto * sy);
      ctx.ellipse(W / 2, H - reto * sy, meia * sx - recuo, alto * sy - recuo, 0, 0, Math.PI, true);
      ctx.closePath();
    };
    const pintada = new THREE.Mesh(
      uvNoRetangulo(new THREE.ShapeGeometry(formaDeArco(meia, reto, alto), 12)),
      artePlaca(meia * 2, reto + alto, arco),
    );
    pintada.position.set(0, y0, ZF + 0.045);
    g.add(pintada);
  }

  // ============================================================ A LOUSA DA LATERAL
  {
    const x = HX + 0.01;
    const l = 0.62;
    const a = 0.8;
    const yc = 1.18;
    const zc = -0.08;
    // a moldura de madeira e a lousa pintada, cada uma um tico para fora
    macia(0.04, a + 0.08, l + 0.08, madeira, x + 0.01, yc, zc, 0.012);
    const lousa = new THREE.Mesh(uvNoRetangulo(new THREE.PlaneGeometry(l, a)), arteLousa(l, a));
    lousa.rotation.y = Math.PI / 2;
    lousa.position.set(x + 0.032, yc, zc);
    g.add(lousa);
    // o pregador do giz embaixo
    macia(0.05, 0.02, l * 0.6, madeira, x + 0.04, yc - a / 2 - 0.02, zc, 0.006);
    peca(g, new THREE.CylinderGeometry(0.008, 0.008, 0.07, 6), creme, x + 0.05, yc - a / 2 - 0.003, zc + 0.1).rotation.x = Math.PI / 2;
  }

  // ================================================================== O TELHADO
  /*
   * DUAS ÁGUAS, a cumeeira correndo no Z: a empena fica de frente para a
   * praça. Cada água é uma laje de escamas girada no caimento; a do lado
   * `−X` é a do `+X` girada meia volta em torno do meio do telhado (girar
   * mantém o lado de dentro da face — espelhar viraria do avesso, e a
   * `fundir()` não junta peça espelhada).
   */
  const zMeio = (Z_TELHADO[0] + Z_TELHADO[1]) / 2;
  const outroLado = (geo: THREE.BufferGeometry): THREE.BufferGeometry =>
    geo.clone().translate(0, 0, -zMeio).rotateY(Math.PI).translate(0, 0, zMeio);
  const comprimentoDaAgua = (HX + BEIRAL) / Math.cos(TETA);
  {
    const s0 = -0.03 / Math.cos(TETA);
    const len = comprimentoDaAgua - s0;
    const fundo = Z_TELHADO[1] - Z_TELHADO[0];
    const geo = new THREE.BoxGeometry(len, ESP_TELHA, fundo);
    // o `v` da telha cresce água abaixo (o `x` da laje): a escama aponta para a beira
    uvEmMetros(geo);
    // o giro fica na MALHA, e não assado na geometria: assim o caçador de
    // z-fighting lê cada laje onde ela está (assadas, as duas eram a mesma
    // caixa na origem para ele)
    const d = s0 + len / 2;
    const cx = Math.cos(TETA) * d + Math.sin(TETA) * (ESP_TELHA / 2);
    const cy = CUME - Math.sin(TETA) * d + Math.cos(TETA) * (ESP_TELHA / 2);
    peca(g, geo, telha, cx, cy, zMeio).rotation.set(0, 0, -TETA);
    peca(g, geo, telha, -cx, cy, zMeio).rotation.set(0, Math.PI, -TETA);
  }

  /*
   * A NEVE DE COBERTURA: uma casca por água, da cumeeira até ~60% do
   * caimento, com a beira ondulada e uns dedos que descem mais — a cobertura
   * escorrendo. A grossura cai em raiz na beira (o arredondado) e a casca
   * termina 6 mm DENTRO da telha: a beira é a linha onde as duas se cruzam,
   * e não uma faixa rente que brigaria pelo pixel. Nas pontas da frente e do
   * fundo ela afina até a telha também.
   */
  {
    const rnd = sorteio(818);
    // dedos largos o bastante para a ponta sair REDONDA (finos, viravam dente de serra)
    const dedos = Array.from({ length: 6 }, () => ({ u: 0.08 + rnd() * 0.84, larg: 0.05 + rnd() * 0.04, comp: 0.12 + rnd() * 0.2 }));
    const beira = (u: number): number => {
      let v = 0.56 + 0.05 * Math.sin(u * 13 + 1.3) + 0.025 * Math.sin(u * 29);
      for (const d of dedos) v += d.comp * Math.exp(-(((u - d.u) / d.larg) ** 2));
      return Math.min(0.97, v);
    };
    const nu = 48;
    const nv = 10;
    const pos: number[] = [];
    const idx: number[] = [];
    const dir = new THREE.Vector2(Math.cos(TETA), -Math.sin(TETA));
    const nor = new THREE.Vector2(Math.sin(TETA), Math.cos(TETA));
    const topo = ESP_TELHA; // a face de cima da laje, na normal
    for (let j = 0; j <= nv; j++) {
      for (let i = 0; i <= nu; i++) {
        const u = i / nu;
        const z = Z_TELHADO[0] + u * (Z_TELHADO[1] - Z_TELHADO[0]);
        const vMax = beira(u);
        const t = j / nv;
        const v = t * vMax;
        const s = -0.02 + v * comprimentoDaAgua;
        // a grossura: cheia no meio, caindo em raiz na beira e nas pontas
        const pontas = Math.min(1, Math.min(u, 1 - u) / 0.03);
        const bolo = 0.85 + 0.3 * Math.sin(u * 23 + t * 5) * Math.sin(u * 7 - t * 3);
        const h = 0.07 * Math.sqrt(Math.max(0, 1 - t ** 4)) * Math.sqrt(pontas) * bolo - 0.006;
        const x = dir.x * s + nor.x * (topo + h);
        const y = CUME + dir.y * s + nor.y * (topo + h);
        pos.push(x, y, z);
      }
    }
    for (let j = 0; j < nv; j++) {
      for (let i = 0; i < nu; i++) {
        const a = j * (nu + 1) + i;
        idx.push(a, a + 1, a + nu + 1, a + 1, a + nu + 2, a + nu + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    // sem UV: as outras malhas brancas também não terão (a `fundir()` junta pela assinatura)
    peca(g, geo, neve, 0, 0, 0);
    peca(g, outroLado(geo), neve, 0, 0, 0);
  }
  // o rolo de neve da cumeeira, amassado pela posição
  {
    const fundo = Z_TELHADO[1] - Z_TELHADO[0] + 0.02;
    const geo = new THREE.CapsuleGeometry(0.075, fundo - 0.15, 4, 10);
    geo.rotateX(Math.PI / 2);
    const pos = geo.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const k = 1 + 0.12 * Math.sin(z * 31 + x * 9) * Math.sin(z * 13 + y * 11);
      pos.setXYZ(i, x * k, y * k * 0.75, z);
    }
    geo.deleteAttribute('uv');
    geo.computeVertexNormals();
    peca(g, geo, neve, 0, CUME + ESP_TELHA / Math.cos(TETA) + 0.02, zMeio);
  }
  // OS PINGENTES DE GELO, sob os dois beirais: cones de ponta para baixo, um
  // de cada tamanho, com falha aqui e ali (fila perfeita lê como franja)
  {
    const rnd = sorteio(2727);
    const xBeira = HX + BEIRAL - 0.012;
    const yBeira = baixoDoTelhado(xBeira) + 0.005;
    // a base em cima (y = 0) e a ponta para baixo (y = −1)
    const cone = new THREE.ConeGeometry(1, 1, 6);
    cone.rotateX(Math.PI);
    cone.translate(0, -0.5, 0);
    for (const lado of [-1, 1]) {
      for (let z = Z_TELHADO[0] + 0.06; z < Z_TELHADO[1] - 0.04; z += 0.075 + rnd() * 0.05) {
        if (rnd() < 0.18) continue;
        const comp = 0.05 + rnd() ** 2 * 0.2;
        const m = new THREE.Mesh(cone, pingente);
        m.scale.set(0.012 + comp * 0.09, comp, 0.012 + comp * 0.09);
        m.position.set(lado * xBeira, yBeira, z);
        m.rotation.y = rnd() * 3;
        g.add(m);
      }
    }
  }

  // ============================================== O LAMBREQUIM E AS LUZINHAS
  /*
   * A tábua recortada na beira da empena: meia-lua embaixo e um furinho em
   * cada uma, creme, na frente da laje (3 cm para fora dela). Cada lado é
   * desenhado com o próprio sinal (espelhar viraria do avesso).
   */
  {
    const zFrente = Z_TELHADO[1] + 0.005;
    const alto = 0.085;
    const L = comprimentoDaAgua;
    const n = Math.floor(L / 0.08);
    const r = L / n / 2;
    for (const lado of [-1, 1]) {
      // na reta do caimento: (s, 0) é a face de baixo da laje; do lado de lá o
      // `s` é negativo, e o `ExtrudeGeometry` acerta a volta sozinho
      const x = (u: number): number => lado * u;
      const forma = new THREE.Shape();
      forma.moveTo(x(0), 0.03);
      forma.lineTo(x(L), 0.03);
      forma.lineTo(x(L), -alto + r);
      for (let i = n - 1; i >= 0; i--) {
        const cx = x((i + 0.5) * r * 2);
        if (lado > 0) forma.absarc(cx, -alto + r, r, 0, -Math.PI, true);
        else forma.absarc(cx, -alto + r, r, Math.PI, Math.PI * 2, false);
      }
      forma.lineTo(x(0), -alto + r);
      forma.closePath();
      // um furinho a cada duas meias-luas
      for (let i = 0; i < n; i += 2) {
        const furo = new THREE.Path();
        furo.absarc(x((i + 0.5) * r * 2), -alto + r, 0.011, 0, Math.PI * 2, false);
        forma.holes.push(furo);
      }
      // três gomos por meia-lua e por furo: de 1 cm, o furo sextavado lê redondo
      const geo = new THREE.ExtrudeGeometry(forma, { depth: 0.025, bevelEnabled: false, curveSegments: 3 });
      geo.rotateZ(-lado * TETA);
      geo.translate(0, CUME, zFrente - 0.025);
      peca(g, geo, creme, 0, 0, 0);
    }
    // o pingente torneado no bico da empena
    peca(g, torno([[0.0, -0.16], [0.02, -0.12], [0.03, -0.07], [0.018, -0.03], [0.03, 0.0], [0.0, 0.02]], 10), creme, 0, CUME, zFrente + 0.005);

    // AS LUZINHAS: um fio caindo em barriga de ponto em ponto pela beira do
    // lambrequim, e a lâmpada pendurada em cada ponto (quatro cores, acesas)
    const cores = [P.sorveteriaRosa, P.sorveteriaMenta, P.maracuja, 0xfff4e0].map((c) => toon(c, { glow: 0.7 }));
    const fio = toon(0x4b5a52);
    const zFio = zFrente + 0.035;
    for (const lado of [-1, 1]) {
      const pontos: THREE.Vector3[] = [];
      const lampadas = 9;
      for (let i = 0; i <= lampadas; i++) {
        const s = 0.08 + (i / lampadas) * (comprimentoDaAgua - 0.14);
        const x = lado * Math.cos(TETA) * s;
        const y = CUME - Math.sin(TETA) * s - alto - 0.02;
        if (i > 0) {
          const a = pontos[pontos.length - 1];
          pontos.push(v3((a.x + x) / 2, (a.y + y) / 2 - 0.035, zFio));
        }
        pontos.push(v3(x, y, zFio));
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 4), cores[(i + (lado > 0 ? 0 : 2)) % cores.length]);
        lamp.scale.set(1, 1.3, 1);
        lamp.position.set(x, y - 0.03, zFio);
        g.add(lamp);
        peca(g, new THREE.CylinderGeometry(0.01, 0.01, 0.018, 5, 1, true), fio, x, y - 0.008, zFio);
      }
      const curva = new THREE.CatmullRomCurve3(pontos);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, lampadas * 4, 0.0045, 3, false), fio));
    }
  }

  // ===================================================== A CASQUINHA GIGANTE
  {
    const cg = casquinhaGigante(0.95);
    delete cg.userData.peca;
    cg.position.set(0, CUME + 0.02, 0.42);
    cg.rotation.y = 0.4;
    g.add(cg);
  }

  // ======================================================== A NEVE NO DEQUE
  // montinhos amassados nos cantos, encostados na parede (como neve varrida)
  {
    const rnd = sorteio(515);
    const base = new THREE.SphereGeometry(1, 12, 7);
    base.deleteAttribute('uv');
    const pos = base.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const k = 1 + 0.07 * Math.sin(x * 4.1 + z * 2.3) + 0.04 * Math.sin(y * 5 + x * 2);
      pos.setXYZ(i, x * k, y * k, z * k);
    }
    base.computeVertexNormals();
    const lugares: Array<[number, number, number]> = [
      [-1.24, -0.8, 0.2], [1.24, -0.78, 0.18], [1.27, 0.5, 0.13], [-1.26, 0.48, 0.15], [0.4, -0.84, 0.13],
    ];
    for (const [x, z, r] of lugares) {
      const m = new THREE.Mesh(base, neve);
      m.scale.set(r * (1 + rnd() * 0.3), r * 0.45, r);
      m.position.set(x, Y0 - 0.02, z);
      m.rotation.y = rnd() * 3;
      g.add(m);
    }
  }

  return g;
}

// =========================================================== A MESINHA E A CADEIRA

/**
 * A CADEIRINHA DE SORVETERIA: a de arame com o encosto de CORAÇÃO, que é a
 * cadeira de sorveteria em qualquer lugar do mundo.
 *
 * - quatro pernas de tubo, as de trás subindo até o coração; um aro amarrando
 *   as quatro no meio da altura, com as voltinhas do arame;
 * - o assento é uma almofada torneada (fofa na borda, com a covinha e o botão
 *   no meio) num aro de ferro;
 * - o encosto é o coração desenhado por um tubo (a curva clássica, em seno e
 *   cosseno) com outro coração menor dentro, inclinado um tico para trás.
 *
 * O ASSENTO CONTINUA EM 0,44 (o alto da almofada em 0,47): a pose de sentado
 * da mesinha conta com ele. Olha para `+Z`, o encosto em `−Z`.
 */
export function cadeirinhaDeSorveteria(cor: number = P.sorveteriaRosa): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cadeirinha-de-sorveteria';
  const ferro = toon(cor);
  const R = 0.012;
  // arame de 1 cm: cinco lados de volta bastam a esta câmera
  const tubo = (pontos: THREE.Vector3[], r: number, gomos: number, fechado = false): void => {
    const curva = new THREE.CatmullRomCurve3(pontos, fechado, 'centripetal');
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, gomos, r, 5, fechado), ferro));
  };

  // as pernas: abrem um tico para fora no pé
  const pes: Array<[number, number]> = [[-0.17, 0.15], [0.17, 0.15], [-0.17, -0.15], [0.17, -0.15]];
  for (const [x, z] of pes) {
    tubo([v3(x * 1.12, 0.012, z * 1.12), v3(x * 1.04, 0.2, z * 1.04), v3(x * 0.92, 0.42, z * 0.92)], R, 5);
    const sapata = new THREE.Mesh(new THREE.SphereGeometry(0.016, 5, 3), toon(P.geloFundo));
    sapata.scale.y = 0.7;
    sapata.position.set(x * 1.12, 0.012, z * 1.12);
    g.add(sapata);
  }
  // o aro do meio e as voltinhas do arame entre as pernas
  {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.008, 4, 22), ferro);
    aro.rotation.x = Math.PI / 2;
    aro.position.y = 0.2;
    g.add(aro);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const volta = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.007, 3, 8), ferro);
      volta.position.set(Math.cos(a) * 0.15, 0.3, Math.sin(a) * 0.15);
      volta.rotation.y = -a;
      g.add(volta);
    }
  }
  // o aro do assento e a almofada
  {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.195, 0.013, 5, 24), ferro);
    aro.rotation.x = Math.PI / 2;
    aro.position.y = 0.425;
    g.add(aro);
    const perfil: Array<[number, number]> = [
      [0.0, 0.43], [0.17, 0.43], [0.2, 0.44], [0.205, 0.452], [0.198, 0.465], [0.17, 0.473], [0.08, 0.476], [0.03, 0.47], [0.0, 0.466],
    ];
    const almofada = new THREE.Mesh(torno(perfil, 16), toon(P.sorveteriaCreme));
    g.add(almofada);
    const botao = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), toon(cor));
    botao.position.y = 0.469;
    g.add(botao);
  }
  // as pernas de trás sobem até o coração
  for (const s of [-1, 1]) {
    tubo([v3(s * 0.156, 0.42, -0.138), v3(s * 0.16, 0.52, -0.165), v3(s * 0.126, 0.665, -0.19)], R, 5);
  }
  // o coração (e o de dentro), inclinado para trás
  {
    const coracao = (escala: number, dy: number): THREE.Vector3[] => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 40; i++) {
        const t = (i / 40) * Math.PI * 2;
        const x = 16 * Math.sin(t) ** 3;
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        pts.push(v3(x * escala, y * escala + dy, 0));
      }
      return pts;
    };
    const encosto = new THREE.Group();
    encosto.position.set(0, 0.68, -0.18);
    encosto.rotation.x = -0.14;
    const fora = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coracao(0.0105, 0.02), true, 'centripetal'), 36, R, 5, true), ferro);
    encosto.add(fora);
    const dentro = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coracao(0.0055, 0.02), true, 'centripetal'), 24, R * 0.75, 4, true), ferro);
    encosto.add(dentro);
    g.add(encosto);
  }
  return g;
}

/**
 * A MESINHA DE SORVETERIA: tampo redondo de mármore com o aro rosa, a coluna
 * torneada de balaústre, o pé de três patas de ferro com voluta, o
 * guarda-sol de gomos que cedem entre as varetas, com a saia em meia-lua e a
 * ponteira dourada, a taça de sundae e as duas cadeirinhas de coração.
 *
 * AS MEDIDAS QUE A CENA USA FICAM: as cadeiras a ±0,78 no `x` (a dupla monta
 * nelas), o tampo em 0,755 (a taça pousa ali), e a borda da lona em 2,25 — a
 * conta da câmera que deixa a cabeça de quem senta escapar por baixo dela
 * (ver o histórico da peça: em 1,71 a lona comia a dupla sentada).
 *
 * As cadeiras entram SEM etiqueta própria: a `fundir()` junta o ferro delas
 * com o da mesa (a contagem do `gelo.mjs` olha a `userData.cadeirinhas`).
 *
 * @param cor a cor da loja (o rosa do quiosque, por padrão)
 * @param sabor a bola da taça em cima da mesa; `null` deixa a mesa vazia
 */
export function mesaDeSorveteria(cor: number = P.sorveteriaRosa, sabor: number | null = P.morango): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-de-sorveteria';
  const ferro = toon(cor);
  const creme = toon(P.sorveteriaCreme);

  // ------------------------------------------------- o pé de três patas
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const p = (r: number, y: number): THREE.Vector3 => v3(c * r, y, s * r);
    // a pata desce da coluna, corre rente ao chão e enrola na ponta
    const curva = new THREE.CatmullRomCurve3([
      p(0.03, 0.16), p(0.1, 0.1), p(0.2, 0.04), p(0.29, 0.03), p(0.33, 0.06), p(0.31, 0.09), p(0.28, 0.075),
    ], false, 'centripetal');
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 12, 0.017, 5), ferro));
    const sapata = new THREE.Mesh(new THREE.SphereGeometry(0.02, 5, 3), toon(P.geloFundo));
    sapata.scale.y = 0.6;
    sapata.position.copy(p(0.26, 0.012));
    g.add(sapata);
  }
  // a coluna torneada: o bulbo de baixo, o pescoço, o anel e o colarinho
  g.add(new THREE.Mesh(torno([
    [0.0, 0.1], [0.045, 0.1], [0.06, 0.16], [0.05, 0.26], [0.03, 0.34], [0.026, 0.5], [0.042, 0.53], [0.03, 0.56],
    [0.026, 0.66], [0.05, 0.69], [0.07, 0.715], [0.0, 0.72],
  ], 14), ferro));

  // ------------------------------------------------------- o tampo
  const tampo = new THREE.Mesh(
    uvEmMetrosPorTriangulo(new THREE.CylinderGeometry(0.46, 0.46, 0.035, 32)),
    toon(P.sorveteriaCreme, { mapa: marmore(0.7) }),
  );
  tampo.position.y = 0.7375;
  g.add(tampo);
  // o aro rosa em volta, 4 mm acima do mármore na borda (é um lábio)
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.462, 0.02, 5, 32), ferro);
  aro.rotation.x = Math.PI / 2;
  aro.position.y = 0.738;
  g.add(aro);

  // ---------------------------------------------------------- o guarda-sol
  const lona = toon(cor, { doubleSide: true });
  const lonaClara = toon(P.sorveteriaCreme, { doubleSide: true });
  // a haste com o colar da manivela e o corredor das varetas
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 1.9, 8), creme).translateY(0.755 + 0.95));
  const colar = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.06, 10), ferro);
  colar.position.y = 1.25;
  g.add(colar);
  const corredor = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.08, 10), ferro);
  corredor.position.y = 1.95;
  g.add(corredor);

  const GOMOS = 8;
  const RAIO = 0.86;
  const BORDA = 2.25;
  const BICO = 2.6;
  /** a lona no raio `r` e no meio do gomo (`t` de 0 a 1 entre as varetas) */
  const naLona = (a: number, r: number, t: number): THREE.Vector3 => {
    const k = r / RAIO;
    const y = BICO - (BICO - BORDA) * k ** 1.15 - 0.05 * Math.sin(t * Math.PI) * k ** 1.2;
    // a beira corre RETA de vareta a vareta (a corda), que é onde a saia pendura
    const poligono = Math.cos(Math.PI / GOMOS) / Math.cos((t - 0.5) * ((2 * Math.PI) / GOMOS));
    const rr = r * (1 + (poligono - 1) * k);
    return v3(Math.cos(a) * rr, y, Math.sin(a) * rr);
  };
  for (const [paridade, mat] of [[0, lona], [1, lonaClara]] as const) {
    const pos: number[] = [];
    const idx: number[] = [];
    let base = 0;
    for (let i = paridade; i < GOMOS; i += 2) {
      const a0 = (i / GOMOS) * Math.PI * 2;
      const a1 = ((i + 1) / GOMOS) * Math.PI * 2;
      const nr = 6;
      const nt = 4;
      for (let j = 0; j <= nr; j++) {
        for (let k = 0; k <= nt; k++) {
          const t = k / nt;
          const p = naLona(a0 + (a1 - a0) * t, (j / nr) * RAIO, t);
          pos.push(p.x, p.y, p.z);
        }
      }
      for (let j = 0; j < nr; j++) {
        for (let k = 0; k < nt; k++) {
          const q = base + j * (nt + 1) + k;
          idx.push(q, q + 1, q + nt + 1, q + 1, q + nt + 2, q + nt + 1);
        }
      }
      base += (nr + 1) * (nt + 1);
      // a saia em meia-lua na beira do gomo, da cor dele
      const pa = naLona(a0, RAIO, 0);
      const pb = naLona(a1, RAIO, 0);
      const corda = pa.distanceTo(pb);
      // o alto dela acompanha a barriga da lona (5 cm no meio do gomo)
      const meia = new THREE.Shape();
      meia.moveTo(-corda / 2, 0);
      meia.quadraticCurveTo(0, -0.1, corda / 2, 0);
      meia.lineTo(corda / 2, -0.03);
      meia.absellipse(0, -0.03, corda / 2, 0.09, 0, -Math.PI, true, 0);
      meia.lineTo(-corda / 2, 0);
      const saiaGeo = new THREE.ShapeGeometry(meia, 6);
      saiaGeo.deleteAttribute('uv');
      const saia = new THREE.Mesh(saiaGeo, mat);
      saia.position.set((pa.x + pb.x) / 2, BORDA + 0.003, (pa.z + pb.z) / 2);
      saia.rotation.y = -((a0 + a1) / 2) + Math.PI / 2;
      g.add(saia);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, mat));
  }
  // as varetas por baixo da lona, as hastes do corredor e a pontinha de cada uma
  for (let i = 0; i < GOMOS; i++) {
    const a = (i / GOMOS) * Math.PI * 2;
    const pontos = [0, 0.3, 0.6, 1].map((k) => naLona(a, k * RAIO, 0).add(v3(0, -0.015, 0)));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), 6, 0.007, 4), creme));
    const meio = naLona(a, RAIO * 0.45, 0).add(v3(0, -0.015, 0));
    const de = v3(0, 1.97, 0);
    const d = meio.clone().sub(de);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, d.length(), 4), creme);
    haste.position.copy(de).addScaledVector(d, 0.5);
    haste.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    g.add(haste);
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.014, 4, 3), toon(P.gold));
    ponta.position.copy(naLona(a, RAIO + 0.01, 0));
    g.add(ponta);
  }
  // a ponteira dourada em cima
  const ponteira = new THREE.Mesh(torno([[0.0, 0], [0.04, 0.02], [0.045, 0.05], [0.02, 0.08], [0.008, 0.12], [0.0, 0.14]], 10), toon(P.gold));
  ponteira.position.y = BICO - 0.02;
  g.add(ponteira);

  // ----------------------------------------------------------- a taça
  if (sabor !== null) {
    const taca = new THREE.Group();
    taca.position.set(0.15, 0.755, -0.08);
    // o vidro torneado: pé, haste e a tulipa (transparente, fica fora da junção)
    taca.add(new THREE.Mesh(torno([
      [0.0, 0.0], [0.045, 0.0], [0.042, 0.008], [0.01, 0.014], [0.008, 0.06], [0.02, 0.075], [0.06, 0.1], [0.075, 0.15], [0.07, 0.152],
    ], 16), toon(P.geloCristal, { opacity: 0.7, glow: 0.16 })));
    const bola = (y: number, r: number, c: number, dx = 0, dz = 0): void => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), toon(c));
      m.position.set(dx, y, dz);
      m.scale.y = 0.85;
      taca.add(m);
    };
    bola(0.15, 0.06, sabor, -0.015, 0.01);
    bola(0.16, 0.05, P.maracuja, 0.03, -0.015);
    // o chantilly: anéis que diminuem, e a pontinha
    for (let k = 0; k < 3; k++) {
      const anel = new THREE.Mesh(new THREE.TorusGeometry(0.03 - k * 0.009, 0.012, 6, 12), toon(0xfffaf2));
      anel.rotation.x = Math.PI / 2;
      anel.position.set(0.005, 0.205 + k * 0.016, 0.0);
      taca.add(anel);
    }
    const bico = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.03, 8), toon(0xfffaf2));
    bico.position.set(0.005, 0.25, 0);
    taca.add(bico);
    bola(0.275, 0.016, P.cerejaDoMano, 0.005, 0);
    // o canudinho de biscoito e a colher comprida
    const biscoito = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.11, 6), toon(P.casquinhaWaffle));
    biscoito.position.set(-0.03, 0.21, -0.01);
    biscoito.rotation.set(0.2, 0, 0.45);
    taca.add(biscoito);
    const colher = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.2, 0.005), toon(P.metalGrey));
    colher.position.set(0.045, 0.19, 0.03);
    colher.rotation.set(-0.3, 0, -0.35);
    taca.add(colher);
    g.add(taca);
    // o porta-guardanapo, do outro lado
    const porta = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.09, 0.06, 0.05, 0.006)), toon(P.metalWhite, { mapa: inoxEscovado() }));
    porta.position.set(-0.18, 0.785, 0.1);
    porta.rotation.y = 0.5;
    g.add(porta);
    const papel = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.06, 0.03), toon(0xfffaf2));
    papel.position.set(-0.18, 0.81, 0.1);
    papel.rotation.y = 0.5;
    g.add(papel);
  }

  // ---------------------------------------------------------- cadeirinhas
  for (const lado of [-1, 1] as const) {
    const cadeira = cadeirinhaDeSorveteria(cor);
    // sem etiqueta: o ferro e a almofada juntam com os da mesa na `fundir()`
    delete cadeira.userData.peca;
    cadeira.userData.cadeirinha = true;
    cadeira.position.set(lado * 0.78, 0, 0);
    // olhando para o centro da mesa: a cadeira nasce de frente para +Z, e o
    // caminho dela até o centro é -X vezes o lado
    cadeira.rotation.y = -lado * Math.PI * 0.5;
    g.add(cadeira);
  }

  return g;
}
