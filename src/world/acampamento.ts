import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { brilhoDeLuz, brilhoEmLote, luzNoChao, toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { novaTextura, sorteio } from './texturasDeChao';
import { geoFlor, geoFolha } from './lojaDeRoupas';

/**
 * ===================================================== O ACAMPAMENTO DA CLAREIRA
 *
 * As peças da clareira atrás do lago do Villa Lobos (`docs/ACAMPAMENTO.md`):
 * o lugar dos dois. A barraca iglu laranja e cinza (a escolha do Renan), o
 * que tem dentro dela (os colchões, os sacos de dormir, os travesseiros e a
 * lanterna) e o que fica do lado de fora (o fogareiro de montanha, a
 * panelinha, as canecas, a mesinha, a canga, as mochilas, o tronco caído, o
 * varal de luzinhas, a samambaia e as folhas secas).
 *
 * Mesmo contrato do kit: cada peça devolve um grupo com a base em `y = 0`,
 * olhando para `+Z`, e quem posiciona é a cena. As texturas são canvas e
 * QUASE BRANCAS (o `toon()` multiplica pela cor da paleta), com o tamanho em
 * metros (`novaTextura`), a não ser o rótulo do cartucho e a canga, que são
 * desenhos inteiros de uma peça só.
 *
 * O PONTO DA BARRACA É O TETO QUE SAI. Ela é uma casca de verdade (o
 * sobreteto e a barraca de dentro, cada um com a sua porta em D), e de fora a
 * câmera isométrica nunca veria quem está lá dentro. Por isso tudo o que fica
 * acima de 42 cm mora no grupo `teto`: a cena esconde o grupo, a câmera olha
 * de cima, e os dois aparecem deitados nos colchões — a mesma ideia da cama do
 * quarto, com as paredes baixas da barraca em volta, como uma casinha de
 * boneca. A costura entre o laranja e o cinza do sobreteto passa exatamente
 * nessa altura, então o corte cai numa emenda que a barraca já tem.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

type Ponto3 = readonly [number, number, number];

/** caixa de quina arredondada (o "fofo" de todo o kit) */
function macia(l: number, a: number, p: number, raio = 0.02): THREE.BufferGeometry {
  const r = Math.min(raio, l / 2 - 0.001, a / 2 - 0.001, p / 2 - 0.001);
  return new RoundedBoxGeometry(l, a, p, raio > 0.02 ? 2 : 1, r);
}

/** um perfil torneado `[raio, altura]`, escrito de BAIXO PARA CIMA (a face sai para fora) */
function torneado(perfil: ReadonlyArray<readonly [number, number]>, segs = 24): THREE.LatheGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), segs);
}

/** um tubo pelos pontos (curva suave) */
function tubo(pontos: ReadonlyArray<Ponto3 | THREE.Vector3>, raio: number, segs = 20, radial = 6, fechado = false): THREE.TubeGeometry {
  const v = pontos.map((p) => (p instanceof THREE.Vector3 ? p.clone() : new THREE.Vector3(p[0], p[1], p[2])));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v, fechado), segs, raio, radial, fechado);
}

/** um cilindro reto de `a` até `b` (corda, estaca, perna de mesa) */
function haste(a: THREE.Vector3, b: THREE.Vector3, raio: number, radial = 6): THREE.BufferGeometry {
  const dir = b.clone().sub(a);
  const geo = new THREE.CylinderGeometry(raio, raio, dir.length(), radial);
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
  const meio = a.clone().add(b).multiplyScalar(0.5);
  geo.translate(meio.x, meio.y, meio.z);
  return geo;
}

/** uma malha posta no pai, na posição dada */
function por(
  pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

// =================================================================== texturas

/**
 * A LONA DA BARRACA: quase branca, com umas manchas largas de dobra (barraca
 * de verdade nunca está lisa) e o quadriculado do ripstop bem apagado, a cada
 * 7,5 cm — mais fino que isso o mipmap transforma em moiré.
 */
export function lonaDeBarraca(lado = 0.6): THREE.CanvasTexture {
  return novaTextura(`lona:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(7301);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 14; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.08 + rnd() * 0.18);
      const forca = 0.03 + rnd() * 0.035;
      for (const [dx, dy] of [[0, 0], [-s, 0], [s, 0], [0, -s], [0, s]] as const) {
        const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        g.addColorStop(0, `rgba(0,0,0,${forca})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 2;
    for (let k = 0; k < 8; k++) {
      const p = (k * s) / 8 + 1;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, s);
      ctx.moveTo(0, p);
      ctx.lineTo(s, p);
      ctx.stroke();
    }
  });
}

/**
 * A TELA DE MOSQUITEIRO da janela de trás. Aqui o desenho NÃO é quase branco,
 * e é de propósito: a cor do material é clara e o fundo da textura é escuro,
 * com os fios claros por cima — multiplicar só escurece, então é o único
 * jeito de ter fio claro numa tela escura.
 */
function telaDeMosquiteiro(lado = 0.16): THREE.CanvasTexture {
  return novaTextura(`tela:${lado}`, lado, (ctx, s) => {
    ctx.fillStyle = 'rgb(70,76,84)';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(235,240,245,0.55)';
    ctx.lineWidth = 2;
    for (let k = 0; k < 8; k++) {
      const p = (k * s) / 8 + 1;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, s);
      ctx.moveTo(0, p);
      ctx.lineTo(s, p);
      ctx.stroke();
    }
  });
}

/**
 * O ACOLCHOADO do saco de dormir: os gomos atravessados a cada 15 cm, cada um
 * estufado (claro no meio, sombra na costura). As linhas são em `v`, que no
 * saco corre no comprimento — os gomos atravessam o corpo, como num saco de
 * verdade.
 */
function acolchoado(lado = 0.6): THREE.CanvasTexture {
  return novaTextura(`acolchoado:${lado}`, lado, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const gomos = 4;
    for (let k = 0; k < gomos; k++) {
      const y0 = (k * s) / gomos;
      const y1 = ((k + 1) * s) / gomos;
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, 'rgba(0,0,0,0.13)');
      g.addColorStop(0.5, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.13)');
      ctx.fillStyle = g;
      ctx.fillRect(0, y0, s, y1 - y0);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, y0, s, 3);
    }
  });
}

/**
 * A CASCA DO TRONCO: os sulcos correndo no comprimento (em `v`), ondulados e
 * de largura sorteada, mais umas placas de casca mais escura. Linhas verticais
 * no canvas que fecham em cima e embaixo.
 */
function cascaDeTronco(lado = 0.5): THREE.CanvasTexture {
  return novaTextura(`casca:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(4417);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 9; i++) {
      const x = rnd() * s;
      const w = 18 + rnd() * 30;
      ctx.fillStyle = `rgba(60,35,15,${0.06 + rnd() * 0.06})`;
      for (const dx of [-s, 0, s]) ctx.fillRect(x + dx, 0, w, s);
    }
    for (let i = 0; i < 26; i++) {
      const x0 = rnd() * s;
      const amp = 3 + rnd() * 6;
      const fase = rnd() * 6.28;
      ctx.strokeStyle = `rgba(55,30,12,${0.18 + rnd() * 0.2})`;
      ctx.lineWidth = 2 + rnd() * 3;
      for (const dx of [-s, 0, s]) {
        ctx.beginPath();
        for (let y = 0; y <= s; y += 4) {
          const x = x0 + dx + amp * Math.sin((Math.PI * 2 * 2 * y) / s + fase);
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  });
}

/** os ANÉIS do tronco cortado: miolo claro, anéis apagados e a casca na borda */
let aneis: THREE.CanvasTexture | null = null;
function aneisDoTronco(): THREE.CanvasTexture {
  if (aneis) return aneis;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const rnd = sorteio(902);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128);
    for (let r = 6; r < 58; r += 5 + rnd() * 3) {
      ctx.strokeStyle = `rgba(120,70,30,${0.18 + rnd() * 0.14})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(64 + rnd() * 2, 64 + rnd() * 2, r, r * 0.96, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // uma rachadura do miolo até a borda
    ctx.strokeStyle = 'rgba(90,50,20,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(64, 64);
    ctx.lineTo(70, 50);
    ctx.lineTo(76, 32);
    ctx.lineTo(79, 14);
    ctx.stroke();
    // a casca: um anel escuro na borda
    ctx.strokeStyle = 'rgba(70,40,18,0.85)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.stroke();
  }
  aneis = new THREE.CanvasTexture(canvas);
  aneis.colorSpace = THREE.SRGBColorSpace;
  return aneis;
}

/**
 * O RÓTULO DO CARTUCHO DE GÁS: o azul de cartucho de camping, a faixa creme
 * com "GÁS" e a chaminha, e os dois filetes. É o desenho inteiro do cartucho
 * (o torno dá `u` na volta e `v` de baixo para cima).
 */
let rotulo: THREE.CanvasTexture | null = null;
function rotuloDoCartucho(): THREE.CanvasTexture {
  if (rotulo) return rotulo;
  const W = 256;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = css(P.cartuchoAzul);
    ctx.fillRect(0, 0, W, H);
    // o canvas sobe em `v`: a faixa fica no meio do corpo, abaixo do domo
    ctx.fillStyle = css(P.cartuchoRotulo);
    ctx.fillRect(0, H * 0.34, W, H * 0.36);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, H * 0.3, W, 3);
    ctx.fillRect(0, H * 0.72, W, 3);
    for (const x0 of [0, W / 2]) {
      ctx.fillStyle = css(P.cartuchoAzul);
      ctx.font = 'bold 26px ui-rounded, "Nunito", system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('GÁS', x0 + 44, H * 0.53);
      // a chaminha
      ctx.fillStyle = '#ff8a2a';
      ctx.beginPath();
      ctx.moveTo(x0 + 26, H * 0.66);
      ctx.bezierCurveTo(x0 + 14, H * 0.6, x0 + 18, H * 0.46, x0 + 27, H * 0.38);
      ctx.bezierCurveTo(x0 + 28, H * 0.48, x0 + 38, H * 0.52, x0 + 34, H * 0.62);
      ctx.closePath();
      ctx.fill();
    }
  }
  rotulo = new THREE.CanvasTexture(canvas);
  rotulo.colorSpace = THREE.SRGBColorSpace;
  return rotulo;
}

/**
 * A CANGA LISTRADA: coral, creme e turquesa em faixas largas, com um
 * zigue-zague no meio e os filetes finos — o desenho inteiro da peça.
 */
let listras: THREE.CanvasTexture | null = null;
function listrasDaCanga(): THREE.CanvasTexture {
  if (listras) return listras;
  const S = 256;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const faixas: Array<[number, number]> = [
      [P.cangaCoral, 0.16], [P.cangaCreme, 0.1], [P.cangaTurquesa, 0.12], [P.cangaCreme, 0.24],
      [P.cangaTurquesa, 0.12], [P.cangaCreme, 0.1], [P.cangaCoral, 0.16],
    ];
    let y = 0;
    for (const [cor, alto] of faixas) {
      ctx.fillStyle = css(cor);
      ctx.fillRect(0, y * S, S, alto * S + 1);
      y += alto;
    }
    // o zigue-zague na faixa creme do meio
    ctx.strokeStyle = css(P.cangaCoral);
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let x = 0; x <= S; x += 16) ctx.lineTo(x, S * (0.5 + ((x / 16) % 2 === 0 ? -0.05 : 0.05)));
    ctx.stroke();
    // os filetes nas emendas
    ctx.fillStyle = 'rgba(80,40,30,0.35)';
    y = 0;
    for (const [, alto] of faixas) {
      y += alto;
      ctx.fillRect(0, y * S - 1, S, 2);
    }
  }
  listras = new THREE.CanvasTexture(canvas);
  listras.colorSpace = THREE.SRGBColorSpace;
  return listras;
}

// =========================================================== o domo da barraca

/**
 * A CASCA DE UM DOMO: a planta é um retângulo de quina redonda (a superelipse
 * `|x/a|⁴ + |z/b|⁴ = 1`), o perfil é um quarto de elipse (parede quase em pé no
 * chão, redonda em cima), e o pano CEDE entre as varetas — a barraca iglu de
 * verdade é tensa sobre as duas varetas cruzadas e afunda um pouco no meio de
 * cada painel. É isso que faz ela ler como barraca e não como meia bola.
 */
interface Domo {
  /** meia largura (x) e meio comprimento (z) da planta, no chão */
  a: number;
  b: number;
  /** a altura do topo */
  h: number;
  /** quanto o pano cede no meio de um painel (fração do raio) */
  ceder: number;
}

/** a barraca de dentro: o "quarto" dos dois */
const DENTRO: Domo = { a: 0.86, b: 1.16, h: 1.22, ceder: 0.045 };
/** o sobreteto, por fora, com 8–9 cm de folga */
const FORA: Domo = { a: 0.95, b: 1.25, h: 1.31, ceder: 0.06 };
/** as varetas cruzam de canto a canto: as quatro direções delas na planta */
const CANTO = Math.atan2(FORA.a, FORA.b);
const VARETAS = [CANTO, Math.PI - CANTO, Math.PI + CANTO, Math.PI * 2 - CANTO];
/** a altura do corte: abaixo dela, as paredes; acima, o `teto` que sai */
const CORTE = 0.42;

function planta(fi: number, d: Domo): number {
  const s = Math.abs(Math.sin(fi)) / d.a;
  const c = Math.abs(Math.cos(fi)) / d.b;
  return 1 / Math.pow(s ** 4 + c ** 4, 0.25);
}

/** 0 em cima de uma vareta, 1 no meio do painel entre duas */
function entreVaretas(fi: number): number {
  let f = ((fi % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  if (f < VARETAS[0]) f += Math.PI * 2;
  for (let i = 0; i < 4; i++) {
    const p0 = VARETAS[i];
    const p1 = i < 3 ? VARETAS[i + 1] : VARETAS[0] + Math.PI * 2;
    if (f >= p0 && f <= p1) return Math.sin((Math.PI * (f - p0)) / (p1 - p0));
  }
  return 0;
}

/** o ponto da casca no ângulo `fi` (0 = frente, `+Z`) e em `te` (0 = topo, π/2 = chão) */
function noDomo(d: Domo, fi: number, te: number): THREE.Vector3 {
  const cede = 1 - d.ceder * entreVaretas(fi) * Math.sin(2 * te);
  const r = planta(fi, d) * Math.sin(te) * cede;
  return new THREE.Vector3(Math.sin(fi) * r, d.h * Math.cos(te), Math.cos(fi) * r);
}

const teNaAltura = (d: Domo, y: number): number => Math.acos(THREE.MathUtils.clamp(y / d.h, -1, 1));

/**
 * A PORTA EM D, na frente: reta dos lados até meia altura e redonda em cima.
 * `folga` alarga (o buraco do sobreteto é maior que o da barraca de dentro, e
 * a beira creme da porta aparece em volta, como numa barraca de verdade).
 */
function dentroDaPorta(x: number, y: number, folga = 0): boolean {
  const meia = 0.42 + folga;
  const reto = 0.5;
  const topo = 0.98 + folga;
  if (y > topo) return false;
  if (y <= reto) return Math.abs(x) < meia;
  const t = (y - reto) / (topo - reto);
  return Math.abs(x) < meia * Math.sqrt(Math.max(0, 1 - t * t));
}

/** o contorno da porta (de baixo à esquerda, por cima, até embaixo à direita) */
function contornoDaPorta(folga: number, base: number): Array<[number, number]> {
  const meia = 0.42 + folga;
  const reto = 0.5;
  const topo = 0.98 + folga;
  const pts: Array<[number, number]> = [[-meia, base], [-meia, reto]];
  for (let i = 1; i < 16; i++) {
    const a = Math.PI - (i / 16) * Math.PI;
    pts.push([Math.cos(a) * meia, reto + Math.sin(a) * (topo - reto)]);
  }
  pts.push([meia, reto], [meia, base]);
  return pts;
}

/**
 * O ponto da FRENTE da casca que fica em `(x, y)` — a porta, a aba e o rolo
 * são desenhados no plano e assentados na lona por aqui (busca do ângulo).
 */
function naFrente(d: Domo, x: number, y: number): THREE.Vector3 {
  const te = teNaAltura(d, y);
  let lo = -1.45;
  let hi = 1.45;
  for (let k = 0; k < 32; k++) {
    const meio = (lo + hi) / 2;
    if (noDomo(d, meio, te).x < x) lo = meio;
    else hi = meio;
  }
  return noDomo(d, (lo + hi) / 2, te);
}

/**
 * A malha de um pedaço da casca, de `y0` (em cima) a `y1` (embaixo), com o UV
 * em metros. `buraco` recebe o meio de cada quadradinho e diz se ele é vão
 * (a porta).
 */
function cascaDoDomo(
  d: Domo, y0: number, y1: number, colunas: number, linhas: number,
  buraco?: (p: THREE.Vector3) => boolean, fi0 = -Math.PI, fi1 = Math.PI, escala = 1,
): THREE.BufferGeometry {
  const te0 = teNaAltura(d, y0);
  const te1 = teNaAltura(d, y1);
  const pontos: THREE.Vector3[] = [];
  const pos: number[] = [];
  const uv: number[] = [];
  const meioRaio = (d.a + d.b) / 2;
  for (let i = 0; i <= colunas; i++) {
    const fi = fi0 + ((fi1 - fi0) * i) / colunas;
    for (let j = 0; j <= linhas; j++) {
      const te = te0 + ((te1 - te0) * j) / linhas;
      const p = noDomo(d, fi, te).multiplyScalar(escala);
      pontos.push(p);
      pos.push(p.x, p.y, p.z);
      uv.push(fi * meioRaio, -te * (d.h + meioRaio) * 0.5);
    }
  }
  const L = linhas + 1;
  const idx: number[] = [];
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      const a = i * L + j;
      const b = a + 1;
      const c = a + L;
      const e = c + 1;
      if (buraco) {
        const meio = pontos[a].clone().add(pontos[b]).add(pontos[c]).add(pontos[e]).multiplyScalar(0.25);
        if (buraco(meio)) continue;
      }
      idx.push(a, b, c, b, e, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // no topo os vértices da primeira linha coincidem (o polo): a normal deles
  // sai de triângulos de área zero, e sem isto o topo ficava com um ponto preto
  if (te0 < 1e-4) {
    const n = geo.attributes.normal as THREE.BufferAttribute;
    for (let i = 0; i <= colunas; i++) n.setXYZ(i * L, 0, 1, 0);
  }
  return geo;
}

/** uma ESTACA de alumínio, cravada inclinada, com o gancho em cima (base no chão) */
function estaca(): THREE.BufferGeometry[] {
  const corpo = haste(new THREE.Vector3(0, -0.04, 0), new THREE.Vector3(0, 0.12, 0), 0.009, 5);
  const gancho = new THREE.TorusGeometry(0.02, 0.006, 4, 8, Math.PI);
  gancho.rotateY(Math.PI / 2);
  gancho.translate(0, 0.12, 0.02);
  return [corpo, gancho];
}

/**
 * A barraca é desenhada no tamanho de uma iglu de duas pessoas de verdade
 * (1,3 m de altura) e CRESCE 10% no jogo: ao lado do corpo chibi (cabeça
 * grande, 1,72 m) ela parecia de criança. Os colchões não crescem — são do
 * tamanho de quem deita.
 */
const ESCALA_DA_BARRACA = 1.1;

/** as medidas da barraca que a cena usa (deitar os dois, a porta, o colisor) */
export const BARRACA = {
  /** meia largura e meio comprimento por fora, no chão (o colisor) */
  meiaLargura: FORA.a * ESCALA_DA_BARRACA,
  meioComprimento: FORA.b * ESCALA_DA_BARRACA,
  /** o topo do sobreteto */
  altura: FORA.h * ESCALA_DA_BARRACA,
  /** onde ficar para entrar: na frente da porta */
  porta: { x: 0, z: FORA.b * ESCALA_DA_BARRACA + 0.55 },
  /**
   * os dois DEITADOS: os pés na direção da porta, a cabeça no fundo. A âncora
   * é a do quarto (`rotation.x = -π/2`): o `y` é o topo do colchão mais meio
   * corpo, e o `z` é onde ficam os pés
   */
  deitar: { x: 0.33, y: 0.32, z: 0.78 },
  /** a altura do corte entre as paredes e o `teto` */
  corte: CORTE * ESCALA_DA_BARRACA,
} as const;

/**
 * A BARRACA IGLU — laranja e cinza, a escolha do Renan.
 *
 * Por fora: o sobreteto (laranja em cima, a barra cinza embaixo, costurados
 * na altura do corte), as duas varetas de alumínio cruzando de canto a canto
 * por cima dele com os clipes pretos, a aba arqueada sobre a porta com a
 * vareta de testa, a porta em D com o pano do sobreteto enrolado do lado e o
 * da barraca de dentro enrolado em cima, a janela de tela atrás, os tirantes
 * amarelos e as estacas. Por dentro: a barraca creme e o chão cinza.
 *
 * O grupo `teto` (tudo acima de 42 cm) a cena esconde para olhar de cima
 * quem está lá dentro. A porta olha para `+Z`.
 */
export function barracaIglu(): THREE.Group {
  const raiz = new THREE.Group();
  raiz.userData.peca = 'barraca-iglu';
  // a casca é montada em metros de barraca "de verdade" e cresce 10% (ver
  // `ESCALA_DA_BARRACA`); o que vai dentro (colchões, a âncora de deitar) é
  // filho da raiz e não cresce
  const g = new THREE.Group();
  g.scale.setScalar(ESCALA_DA_BARRACA);
  raiz.add(g);
  const teto = new THREE.Group();
  teto.name = 'teto';
  g.add(teto);

  const lona = lonaDeBarraca();
  const laranja = toon(P.barracaLaranja, { mapa: lona, doubleSide: true });
  const cinza = toon(P.barracaCinza, { mapa: lona, doubleSide: true });
  const creme = toon(P.barracaInterna, { mapa: lona, doubleSide: true });
  /*
   * A LONA ACESA: de noite, com a lanterna ligada lá dentro, a barraca
   * inteira brilha laranja — é a cara de barraca na noite. O mesmo pano com
   * `glow` (`acenderBarraca` troca um pelo outro); o cinza da barra de baixo
   * acende menos (é mais grosso), e a barraca de dentro, creme, mais.
   */
  raiz.userData.lonas = [
    [laranja, toon(P.barracaLaranja, { mapa: lona, doubleSide: true, glow: 0.5 })],
    [cinza, toon(P.barracaCinza, { mapa: lona, doubleSide: true, glow: 0.3 })],
    [creme, toon(P.barracaInterna, { mapa: lona, doubleSide: true, glow: 0.42 })],
  ] satisfies Array<[THREE.Material, THREE.Material]>;
  const ziper = toon(P.barracaZiper);
  const aluminio = toon(P.barracaVareta);
  const preto = toon(P.barracaClip);

  const portaDeDentro = (p: THREE.Vector3): boolean => p.z > 0.25 && dentroDaPorta(p.x, p.y, 0);
  const portaDeFora = (p: THREE.Vector3): boolean => p.z > 0.25 && dentroDaPorta(p.x, p.y, 0.05);

  // ------------------------------------------------ a barraca de dentro e o chão
  por(teto, cascaDoDomo(DENTRO, DENTRO.h, CORTE, 64, 14, portaDeDentro), creme);
  por(g, cascaDoDomo(DENTRO, CORTE, 0.005, 64, 5, portaDeDentro), creme);
  const forma = new THREE.Shape();
  for (let i = 0; i <= 64; i++) {
    const fi = (i / 64) * Math.PI * 2;
    const r = planta(fi, DENTRO) * 0.995;
    if (i === 0) forma.moveTo(Math.sin(fi) * r, Math.cos(fi) * r);
    else forma.lineTo(Math.sin(fi) * r, Math.cos(fi) * r);
  }
  const chao = new THREE.ExtrudeGeometry(forma, { depth: 0.02, bevelEnabled: false, curveSegments: 4 });
  chao.rotateX(-Math.PI / 2);
  por(g, chao, toon(P.barracaChao));

  // ------------------------------------------------------------- o sobreteto
  por(teto, cascaDoDomo(FORA, FORA.h, CORTE, 72, 16, portaDeFora), laranja);
  por(g, cascaDoDomo(FORA, CORTE, 0.1, 72, 5, portaDeFora), cinza);
  // a COSTURA entre o laranja e o cinza: o vivo escuro que dá a volta (menos na porta)
  const teCorte = teNaAltura(FORA, CORTE);
  const costura: THREE.Vector3[] = [];
  for (let k = 0; k <= 160; k++) {
    const fi = (k / 160) * Math.PI * 2;
    const p = noDomo(FORA, fi, teCorte).multiplyScalar(1.004);
    if (p.z > 0.25 && dentroDaPorta(p.x, p.y, 0.05)) continue;
    costura.push(p);
  }
  por(g, tubo(costura, 0.008, 120, 5), ziper);

  // A PORTA: a beira de zíper das duas (a de dentro e a do sobreteto), cortada
  // na altura do corte — o pedaço de baixo fica com as paredes, o de cima sai
  // com o teto
  const beira = (d: Domo, folga: number, base: number, escala: number, raio: number, mat: THREE.Material): void => {
    const pts = contornoDaPorta(folga, base).map(([x, y]) => naFrente(d, x, y).multiplyScalar(escala));
    let pedaco: THREE.Vector3[] = [pts[0]];
    let embaixo = pts[0].y <= CORTE;
    for (let i = 1; i < pts.length; i++) {
      const agora = pts[i].y <= CORTE;
      pedaco.push(pts[i]);
      if (agora !== embaixo || i === pts.length - 1) {
        if (pedaco.length > 1) por(embaixo ? g : teto, tubo(pedaco, raio, pedaco.length * 4, 5), mat);
        pedaco = [pts[i]];
        embaixo = agora;
      }
    }
  };
  beira(DENTRO, 0.0, 0.02, 1.006, 0.011, ziper);
  beira(FORA, 0.05, 0.1, 1.005, 0.012, cinza);

  // o pano da porta de DENTRO, enrolado em cima e preso por duas tirinhas
  const rolo: THREE.Vector3[] = [];
  for (let k = 0; k <= 10; k++) {
    const x = -0.36 + (0.72 * k) / 10;
    rolo.push(naFrente(DENTRO, x, 0.985 - 0.03 * (1 - (x / 0.36) ** 2)).multiplyScalar(1.035));
  }
  por(teto, tubo(rolo, 0.045, 30, 10), creme);
  for (const s of [-1, 1] as const) {
    const p = naFrente(DENTRO, s * 0.22, 0.95).multiplyScalar(1.07);
    const tira = por(teto, macia(0.03, 0.11, 0.008, 0.003), ziper, p.x, p.y, p.z);
    tira.rotation.x = -0.25;
  }
  // o pano da porta do SOBRETETO, enrolado em pé do lado direito
  const enrolado: THREE.Vector3[] = [];
  for (let k = 0; k <= 8; k++) {
    const y = 0.14 + (0.8 * k) / 8;
    enrolado.push(naFrente(FORA, 0.53, y).multiplyScalar(1.02));
  }
  // com NOME: ao fechar a porta, o pano desenrola e o rolo some (`fecharPortaDaBarraca`)
  por(teto, tubo(enrolado, 0.042, 24, 10), laranja).name = 'roloDaPorta';
  const presilha = naFrente(FORA, 0.53, 0.62).multiplyScalar(1.06);
  por(teto, macia(0.11, 0.025, 0.012, 0.004), ziper, presilha.x, presilha.y, presilha.z).name = 'presilhaDaPorta';

  /*
   * A PORTA FECHADA: o pano do sobreteto que desenrola por cima do vão. É a
   * casca do domo DENTRO do D (2,5 cm além da beira, e 1,2% para fora da
   * lona, para a sobra não ficar coplanar com ela), em COLUNAS da direita
   * para a esquerda — o lado do rolo. Fechar é mostrar as colunas aos
   * poucos (`setDrawRange`), atrás do puxador do zíper que dá a volta no D.
   * São dois panos, cortados no corte do teto como a barraca: o laranja de
   * cima mora no `teto` (de dentro, a câmera de cima ainda vê a porta
   * fechada embaixo), o cinza de baixo, com as paredes.
   */
  const alta = painelDaPorta(CORTE, PORTA_TOPO + 0.025, 15);
  const baixa = painelDaPorta(0.1, CORTE, 7);
  const panoAlto = por(teto, alta, laranja);
  panoAlto.name = 'portaFechadaAlta';
  const panoBaixo = por(g, baixa, cinza);
  panoBaixo.name = 'portaFechadaBaixa';
  for (const pano of [panoAlto, panoBaixo]) {
    pano.geometry.setDrawRange(0, 0);
    pano.visible = false;
  }
  // o PUXADOR do zíper, que corre pelo contorno do D (embaixo à direita = aberta)
  const puxador = por(g, macia(0.04, 0.075, 0.018, 0.006), ziper);
  puxador.name = 'puxadorDaPorta';
  posicionarPuxador(puxador, 0);
  // e o ZÍPER fechado atrás dele: o risco escuro que se desenha pelo D
  // conforme o puxador anda (`setDrawRange`), em cima da beira cinza
  const fecho = por(teto, new THREE.TubeGeometry(CAMINHO_DO_ZIPER, ZIPER_GOMOS, 0.009, 5, false), ziper);
  fecho.name = 'ziperDaPorta';
  fecho.geometry.setDrawRange(0, 0);
  fecho.visible = false;

  // A ABA SOBRE A PORTA: uma meia-lua de lona que sai do sobreteto e avança
  // 30 cm, sustentada pela vareta de testa na beira
  const ABA = 0.66;
  const N = 14;
  const base: THREE.Vector3[] = [];
  const ponta: THREE.Vector3[] = [];
  for (let k = 0; k <= N; k++) {
    const x = -ABA + (2 * ABA * k) / N;
    const e = Math.sqrt(Math.max(0, 1 - (x / ABA) ** 2));
    const b = naFrente(FORA, x, 1.06);
    base.push(b);
    ponta.push(new THREE.Vector3(x, b.y - 0.07 * e, b.z + 0.32 * e));
  }
  const pos: number[] = [];
  const uvAba: number[] = [];
  for (let k = 0; k <= N; k++) {
    pos.push(base[k].x, base[k].y, base[k].z, ponta[k].x, ponta[k].y, ponta[k].z);
    uvAba.push(base[k].x, 0, ponta[k].x, 0.32);
  }
  const idx: number[] = [];
  for (let k = 0; k < N; k++) {
    const a = k * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const aba = new THREE.BufferGeometry();
  aba.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  aba.setAttribute('uv', new THREE.Float32BufferAttribute(uvAba, 2));
  aba.setIndex(idx);
  aba.computeVertexNormals();
  por(teto, aba, laranja);
  por(teto, tubo(ponta.map((p) => p.clone().add(new THREE.Vector3(0, -0.012, 0))), 0.011, 40, 6), aluminio);

  // A JANELA DE TELA atrás, com o vivo em volta
  const J0 = Math.PI - 0.34;
  const J1 = Math.PI + 0.34;
  por(teto, cascaDoDomo(FORA, 0.88, 0.52, 12, 6, undefined, J0, J1, 1.006), toon(0xd9dee3, { mapa: telaDeMosquiteiro(), doubleSide: true }));
  const moldura: THREE.Vector3[] = [];
  const teJ0 = teNaAltura(FORA, 0.88);
  const teJ1 = teNaAltura(FORA, 0.52);
  for (let k = 0; k <= 12; k++) moldura.push(noDomo(FORA, J0 + ((J1 - J0) * k) / 12, teJ0));
  for (let k = 1; k <= 6; k++) moldura.push(noDomo(FORA, J1, teJ0 + ((teJ1 - teJ0) * k) / 6));
  for (let k = 1; k <= 12; k++) moldura.push(noDomo(FORA, J1 - ((J1 - J0) * k) / 12, teJ1));
  for (let k = 1; k < 6; k++) moldura.push(noDomo(FORA, J0, teJ1 - ((teJ1 - teJ0) * k) / 6));
  por(teto, tubo(moldura.map((p) => p.multiplyScalar(1.01)), 0.01, 90, 5, true), ziper);

  // ------------------------------------------------------------- as varetas
  // De canto a canto, por cima do sobreteto (o iglu de vareta por fora, com
  // clipes). A segunda passa por cima da primeira no topo.
  const varetas: Array<[number, number]> = [[CANTO, Math.PI + CANTO], [-CANTO, Math.PI - CANTO]];
  varetas.forEach(([fiA, fiB], v) => {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 40; k++) {
      const s = -1 + (2 * k) / 40;
      const te = Math.abs(s) * (Math.PI / 2);
      const p = noDomo(FORA, s >= 0 ? fiA : fiB, te);
      p.multiplyScalar(1 + 0.022 / Math.max(0.3, p.length()));
      if (v === 1) p.y += 0.03 * Math.pow(Math.max(0, 1 - s * s), 6);
      pts.push(p);
    }
    const curva = new THREE.CatmullRomCurve3(pts);
    // o pedaço de baixo de cada ponta fica com as paredes; o arco, com o teto
    por(teto, new THREE.TubeGeometry(curva, 80, 0.015, 6, false), aluminio);
    // os clipes pretos ao longo da vareta
    for (const t of [0.12, 0.24, 0.36, 0.64, 0.76, 0.88]) {
      const p = curva.getPointAt(t);
      const tg = curva.getTangentAt(t);
      const clip = new THREE.CylinderGeometry(0.024, 0.024, 0.04, 8);
      clip.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg));
      clip.translate(p.x, p.y, p.z);
      por(p.y > CORTE ? teto : g, clip, preto);
    }
    // a ponta no chão: a ponteira preta, a fita e a estaca
    for (const fi of [fiA, fiB]) {
      const pe = noDomo(FORA, fi, Math.PI / 2).multiplyScalar(1.02);
      por(g, new THREE.CylinderGeometry(0.02, 0.022, 0.06, 8), preto, pe.x, 0.03, pe.z);
      const fora = new THREE.Vector3(pe.x, 0, pe.z).normalize();
      const fita = por(g, new THREE.BoxGeometry(0.035, 0.008, 0.16), preto, pe.x + fora.x * 0.08, 0.006, pe.z + fora.z * 0.08);
      fita.rotation.y = Math.atan2(fora.x, fora.z);
      const ondeCrava = new THREE.Vector3(pe.x + fora.x * 0.18, 0, pe.z + fora.z * 0.18);
      for (const geo of estaca()) {
        geo.rotateY(Math.atan2(fora.x, fora.z));
        por(g, geo, aluminio, ondeCrava.x, 0, ondeCrava.z);
      }
    }
  });

  // ----------------------------------------------------- os tirantes amarelos
  const corda = toon(P.barracaCorda);
  const tirante = (de: THREE.Vector3, ate: THREE.Vector3): void => {
    por(de.y > CORTE ? teto : g, haste(de, ate, 0.006, 4), corda);
    // o esticador de plástico perto da estaca
    const esticador = ate.clone().lerp(de, 0.18);
    por(g, macia(0.03, 0.012, 0.016, 0.004), preto, esticador.x, esticador.y, esticador.z);
    for (const geo of estaca()) {
      geo.rotateY(Math.atan2(ate.x, ate.z));
      por(g, geo, aluminio, ate.x, 0, ate.z);
    }
  };
  const teTirante = teNaAltura(FORA, 0.82);
  for (const fi of [Math.PI / 2, -Math.PI / 2, Math.PI]) {
    const de = noDomo(FORA, fi, teTirante);
    const longe = new THREE.Vector3(de.x, 0, de.z).normalize().multiplyScalar(planta(fi, FORA) + 0.75);
    tirante(de, longe);
  }
  for (const s of [-1, 1] as const) {
    const de = ponta[s < 0 ? 0 : N].clone();
    tirante(de, new THREE.Vector3(s * 0.95, 0, de.z + 0.75));
  }

  /*
   * A LUZ QUE VAZA PELA PORTA aberta, de noite com a lanterna acesa: o
   * leque quente no chão na frente dela (luz pintada, sem luz de verdade).
   * Na raiz, e não na casca que cresce: é medida no chão do mundo.
   */
  const vazada = new THREE.Group();
  vazada.name = 'luzDaPorta';
  vazada.visible = false;
  const leque = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.2), luzNoChao(P.luzDaLanterna, 0.4));
  leque.rotation.x = -Math.PI / 2;
  leque.position.set(0, 0.03, BARRACA.porta.z - 0.25);
  leque.renderOrder = 60;
  leque.userData.semSombra = true;
  vazada.add(leque);
  raiz.add(vazada);
  raiz.userData.portaFechada = 0;

  return raiz;
}

/** onde termina o D em cima (a mesma conta de `dentroDaPorta` com a folga do sobreteto) */
const PORTA_TOPO = 0.98 + 0.05;
const PORTA_MEIA = 0.42 + 0.05;

/**
 * Um pano da porta fechada, de `y0` a `y1`, em colunas da DIREITA para a
 * esquerda (`userData.colunas[c]` é onde a coluna `c` termina no índice).
 */
function painelDaPorta(y0: number, y1: number, linhas: number, colunas = 26): THREE.BufferGeometry {
  const meia = PORTA_MEIA + 0.025;
  const pos: number[] = [];
  const uv: number[] = [];
  const L = linhas + 1;
  for (let c = 0; c <= colunas; c++) {
    const x = meia - (2 * meia * c) / colunas;
    for (let r = 0; r <= linhas; r++) {
      const y = y0 + ((y1 - y0) * r) / linhas;
      const p = naFrente(FORA, x, y).multiplyScalar(1.012);
      pos.push(p.x, p.y, p.z);
      uv.push(x, y);
    }
  }
  const idx: number[] = [];
  const fimDaColuna: number[] = [0];
  for (let c = 0; c < colunas; c++) {
    const xm = meia - (2 * meia * (c + 0.5)) / colunas;
    for (let r = 0; r < linhas; r++) {
      const ym = y0 + ((y1 - y0) * (r + 0.5)) / linhas;
      if (!dentroDaPorta(xm, ym, 0.07)) continue;
      const a = c * L + r;
      const b = a + 1;
      const d = a + L;
      const e = d + 1;
      idx.push(a, d, b, b, d, e);
    }
    fimDaColuna.push(idx.length);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  geo.userData.colunas = fimDaColuna;
  return geo;
}

/** o caminho do zíper: o contorno do D de baixo à direita, por cima, até embaixo à esquerda */
const ZIPER_GOMOS = 90;
const CAMINHO_DO_ZIPER = (() => {
  // 2% para fora: encostado no pano fechado (1,2%), por cima da beira cinza
  const pts = contornoDaPorta(0.05, 0.1).reverse().map(([x, y]) => naFrente(FORA, x, y).multiplyScalar(1.02));
  const curva = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  return curva;
})();

/** o puxador no ponto `k` do caminho (0 = porta aberta, 1 = fechada), deitado na lona */
function posicionarPuxador(puxador: THREE.Object3D, k: number): void {
  const p = CAMINHO_DO_ZIPER.getPointAt(Math.min(1, Math.max(0, k)));
  puxador.position.copy(p);
  // pendurado do zíper: a cabeça no caminho e o corpo para fora, de frente
  puxador.rotation.set(-0.35, Math.atan2(p.x, p.z) * 0.6, 0);
}

/**
 * FECHA (ou abre) A PORTA da barraca: `k` de 0 (aberta, o pano enrolado do
 * lado) a 1 (fechada). O puxador anda pelo contorno do D e o pano aparece
 * atrás dele, coluna por coluna, da direita (o lado do rolo) para a
 * esquerda; o rolo some logo no começo (desenrolou). Quem anima é a cena,
 * pelo relógio do jogo.
 */
export function fecharPortaDaBarraca(raiz: THREE.Object3D, k: number): void {
  const t = Math.min(1, Math.max(0, k));
  raiz.userData.portaFechada = t;
  const puxador = raiz.getObjectByName('puxadorDaPorta');
  if (puxador) posicionarPuxador(puxador, t);
  // quanto do D já passou pelo puxador, de leste a oeste (pela posição dele)
  const px = CAMINHO_DO_ZIPER.getPointAt(t).x / 1.02;
  const fechou = t >= 1 ? 1 : THREE.MathUtils.clamp((PORTA_MEIA - px) / (2 * PORTA_MEIA), 0, 1);
  for (const nome of ['portaFechadaAlta', 'portaFechadaBaixa']) {
    const pano = raiz.getObjectByName(nome) as THREE.Mesh | undefined;
    if (!pano) continue;
    const colunas = pano.geometry.userData.colunas as number[];
    const n = Math.round(fechou * (colunas.length - 1));
    pano.geometry.setDrawRange(0, colunas[n]);
    pano.visible = n > 0;
  }
  for (const nome of ['roloDaPorta', 'presilhaDaPorta']) {
    const peca = raiz.getObjectByName(nome);
    if (peca) peca.visible = fechou < 0.08;
  }
  const fecho = raiz.getObjectByName('ziperDaPorta') as THREE.Mesh | undefined;
  if (fecho) {
    // o TubeGeometry tem o índice em ordem ao longo do caminho: 5 lados × 6 por gomo
    fecho.geometry.setDrawRange(0, Math.floor(t * ZIPER_GOMOS) * 5 * 6);
    fecho.visible = t > 0;
  }
  atualizarLuzDaPorta(raiz);
}

function atualizarLuzDaPorta(raiz: THREE.Object3D): void {
  const vazada = raiz.getObjectByName('luzDaPorta');
  if (vazada) vazada.visible = raiz.userData.acesa === true && (raiz.userData.portaFechada ?? 0) < 0.5;
}

/**
 * ACENDE (ou apaga) A LANTERNA DA BARRACA, e com ela a barraca inteira: o
 * globo da lanterna, o halo e a poça quente lá dentro, a lona brilhando por
 * fora (o pano com `glow`) e o leque de luz que vaza pela porta aberta.
 * Tudo luz pintada: nenhuma luz nova no motor.
 */
export function acenderBarraca(raiz: THREE.Object3D, acesa: boolean): void {
  raiz.userData.acesa = acesa;
  const pares: Array<[THREE.Material, THREE.Material]> = [
    ...(raiz.userData.lonas ?? []),
    [toon(P.lanternaGlobo), toon(P.lanternaAcesa, { glow: 1 })],
  ];
  raiz.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    for (const [apagada, acendida] of pares) {
      if (acesa && m.material === apagada) m.material = acendida;
      else if (!acesa && m.material === acendida) m.material = apagada;
    }
  });
  for (const nome of ['luzDaLanterna', 'luzDeDentro']) {
    const luz = raiz.getObjectByName(nome);
    if (luz) luz.visible = acesa;
  }
  atualizarLuzDaPorta(raiz);
}

// ======================================================= dentro da barraca

/**
 * O COLCHÃO INFLÁVEL: sete gomos no comprimento (os tubos de ar de um
 * colchonete de camping), o gomo travesseiro atravessado na cabeceira, e a
 * válvula no pé. A base olha para `+Z` com a cabeceira em `-Z`, base no chão.
 */
export function colchaoInflavel(cor: number = P.colchaoAzul, comprimento = 1.85, largura = 0.56): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'colchao-inflavel';
  const mat = toon(cor);
  const GOMOS = 7;
  const r = largura / (GOMOS * 2) * 1.12;
  const corpo = comprimento - 0.24;
  for (let i = 0; i < GOMOS; i++) {
    const x = -largura / 2 + r + ((largura - 2 * r) * i) / (GOMOS - 1);
    const gomo = new THREE.CapsuleGeometry(r, corpo - 2 * r, 4, 8);
    gomo.rotateX(Math.PI / 2);
    gomo.scale(1, 0.85, 1);
    por(g, gomo, mat, x, r * 0.85, 0.12);
  }
  // o gomo da cabeceira, atravessado e mais alto: o travesseiro embutido
  // (baixo: o saco de dormir passa por cima dele sem furar)
  const cabeceira = new THREE.CapsuleGeometry(0.05, largura - 0.12, 4, 10);
  cabeceira.rotateZ(Math.PI / 2);
  cabeceira.scale(1, 0.85, 1);
  por(g, cabeceira, mat, 0, 0.052, -comprimento / 2 + 0.1);
  // a costura do fundo (a base achatada que une os gomos)
  por(g, macia(largura - 0.02, 0.02, comprimento - 0.06, 0.008), toon(new THREE.Color(cor).multiplyScalar(0.8).getHex()), 0, 0.012, 0.03);
  // a válvula no pé
  const valvula = por(g, new THREE.CylinderGeometry(0.018, 0.022, 0.03, 10), toon(P.barracaZiper), largura / 2 - 0.08, 0.1, comprimento / 2 - 0.07);
  valvula.rotation.x = 0.4;
  return g;
}

/**
 * O SACO DE DORMIR ABERTO: o zíper aberto até o pé e o saco esparramado como
 * um edredom em cima do colchão — o forro creme para cima, com os gomos do
 * acolchoado, a beirada da cor de fora dando a volta, o capuz de múmia em U na
 * cabeceira com o cordão e o zíper escuro do lado. Os dois deitam POR CIMA
 * (ninguém some dentro do saco).
 */
export function sacoDeDormir(cor: number = P.sacoVinho): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'saco-de-dormir';
  const L = 1.78;
  const fora = toon(cor, { mapa: acolchoado() });
  const forro = toon(P.sacoForro, { mapa: acolchoado() });
  /** a laje do saco, afinando no pé (o formato de múmia) */
  const laje = (largura: number, alto: number, comprimento: number): THREE.BufferGeometry => {
    const geo = macia(largura, alto, comprimento, 0.02);
    const p = geo.attributes.position as THREE.BufferAttribute;
    const uv = geo.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const t = (p.getZ(i) + comprimento / 2) / comprimento;
      p.setX(i, p.getX(i) * THREE.MathUtils.lerp(1, 0.72, t));
      uv.setXY(i, p.getX(i), p.getZ(i));
    }
    geo.computeVertexNormals();
    return geo;
  };
  por(g, laje(0.62, 0.03, L), fora, 0, 0.015, 0);
  por(g, laje(0.56, 0.03, L - 0.08), forro, 0, 0.028, 0.02);
  // o zíper do lado direito, do capuz até o pé
  const ziper: Ponto3[] = [];
  for (let k = 0; k <= 8; k++) {
    const t = k / 8;
    const z = -L / 2 + 0.12 + t * (L - 0.2);
    ziper.push([0.31 * THREE.MathUtils.lerp(1, 0.72, (z + L / 2) / L) - 0.005, 0.034, z]);
  }
  por(g, tubo(ziper, 0.006, 24, 4), toon(P.barracaZiper));
  // o capuz em U na cabeceira, e as duas pontas do cordão
  const capuz = new THREE.TorusGeometry(0.24, 0.045, 8, 24, Math.PI);
  capuz.rotateX(Math.PI / 2);
  capuz.rotateY(Math.PI);
  capuz.scale(1.15, 0.8, 0.9);
  por(g, capuz, fora, 0, 0.05, -L / 2 + 0.24);
  for (const s of [-1, 1] as const) {
    por(g, new THREE.SphereGeometry(0.014, 8, 6), toon(P.barracaZiper), s * 0.07, 0.05, -L / 2 - 0.02);
  }
  return g;
}

/** o TRAVESSEIRO de camping: fofo, pequeno, com a costura no meio */
export function travesseiroDeCamping(cor: number = P.travesseiroCamping): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'travesseiro-de-camping';
  const geo = macia(0.38, 0.08, 0.24, 0.04);
  // estufado: o meio sobe, as pontas afinam
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const kx = 1 - (p.getX(i) / 0.19) ** 2;
    const kz = 1 - (p.getZ(i) / 0.12) ** 2;
    p.setY(i, p.getY(i) * (0.55 + 0.45 * Math.max(0, kx) * Math.max(0, kz)));
  }
  geo.computeVertexNormals();
  por(g, geo, toon(cor), 0, 0.04, 0);
  return g;
}

/**
 * A LANTERNA DE CAMPING de LED: a base verde, o globo fosco (a malha `globo`,
 * que a noite acende), a tampa, as grades e a alça de arame dobrada para cima.
 */
export function lanternaDeCamping(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lanterna-de-camping';
  const corpo = toon(P.lanternaCorpo);
  por(g, torneado([[0.0001, 0], [0.06, 0], [0.066, 0.01], [0.064, 0.05], [0.05, 0.06], [0.0001, 0.06]], 20), corpo);
  const globo = por(g, torneado([[0.044, 0.06], [0.05, 0.09], [0.05, 0.15], [0.044, 0.18]], 20), toon(P.lanternaGlobo));
  globo.name = 'globo';
  por(g, torneado([[0.0001, 0.18], [0.05, 0.18], [0.058, 0.19], [0.05, 0.21], [0.02, 0.22], [0.0001, 0.22]], 20), corpo);
  // as três grades na frente do globo
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2;
    por(g, new THREE.BoxGeometry(0.008, 0.12, 0.008), corpo, Math.sin(a) * 0.052, 0.12, Math.cos(a) * 0.052);
  }
  // a alça de arame
  por(g, new THREE.TorusGeometry(0.04, 0.004, 4, 12, Math.PI), toon(P.barracaZiper), 0, 0.22, 0);
  // o HALO quando acesa (`acenderBarraca`): o brilho macio em volta do globo
  const luz = new THREE.Group();
  luz.name = 'luzDaLanterna';
  luz.visible = false;
  const halo = new THREE.Sprite(brilhoDeLuz(P.luzDaLanterna, 0.75));
  halo.scale.set(0.62, 0.62, 1);
  halo.position.y = 0.12;
  halo.renderOrder = 61;
  luz.add(halo);
  g.add(luz);
  return g;
}

/**
 * TUDO O QUE ESTÁ DENTRO DA BARRACA, no referencial dela (a origem no meio do
 * chão, a porta em `+Z`): os dois colchões lado a lado (o azul e o mostarda),
 * os sacos de dormir abertos por cima (o vinho e o marinho), os travesseiros
 * na cabeceira e a lanterna no canto do fundo, entre as cabeças.
 */
export function interiorDaBarraca(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'interior-da-barraca';
  const X = BARRACA.deitar.x;
  const cores: Array<[number, number]> = [[P.colchaoAzul, P.sacoMarinho], [P.colchaoMostarda, P.sacoVinho]];
  cores.forEach(([colchao, saco], i) => {
    const x = i === 0 ? -X : X;
    const c = colchaoInflavel(colchao);
    c.position.set(x, 0.02, -0.05);
    c.userData.peca = undefined;
    g.add(c);
    const s = sacoDeDormir(saco);
    s.position.set(x, 0.094, -0.02);
    s.rotation.y = i === 0 ? 0.03 : -0.04;
    s.userData.peca = undefined;
    g.add(s);
    const t = travesseiroDeCamping();
    t.position.set(x, 0.122, -0.78);
    t.rotation.y = i === 0 ? 0.08 : -0.12;
    t.userData.peca = undefined;
    g.add(t);
  });
  const lanterna = lanternaDeCamping();
  lanterna.position.set(0, 0.02, -0.98);
  lanterna.scale.setScalar(1.25);
  g.add(lanterna);
  /*
   * A POÇA QUENTE DA LANTERNA, lá dentro: na altura de cima dos sacos de
   * dormir (no chão, os colchões a esconderiam), mais forte na cabeceira,
   * onde a lanterna está. Vista de cima, é a luz caindo nos travesseiros.
   */
  const dentro = new THREE.Group();
  dentro.name = 'luzDeDentro';
  dentro.visible = false;
  const poca = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.9), luzNoChao(P.luzDaLanterna, 0.42));
  poca.rotation.x = -Math.PI / 2;
  poca.position.set(0, 0.2, -0.62);
  poca.renderOrder = 60;
  poca.userData.semSombra = true;
  dentro.add(poca);
  g.add(dentro);
  return g;
}

// =================================================== do lado de fora

/**
 * O FOGAREIRO DE MONTANHA — o de quem sobe montanha: o CARTUCHO de gás
 * (o azul, com a faixa "GÁS" e o domo de cima), a válvula de latão, o
 * queimador com a coroa de furinhos, os TRÊS BRAÇOS dobráveis que seguram a
 * panela (dentadinhos na ponta) e a manopla de arame da válvula. Duas partes
 * com nome, para a cozinha da etapa D animar: a `manopla` (gira em volta da
 * haste da válvula para abrir o gás) e a `chama` (o lugar dela, em cima da
 * coroa; a chama de gás de verdade mora em `world/cozinhaDeAcampamento.ts`).
 */
export function fogareiroDeMontanha(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'fogareiro-de-montanha';
  const metal = toon(P.fogareiroMetal);
  const latao = toon(P.fogareiroLatao);
  // o cartucho, achatado como os de verdade, com o rótulo
  por(g, torneado([
    [0.0001, 0], [0.05, 0], [0.056, 0.006], [0.058, 0.02], [0.058, 0.07], [0.054, 0.08],
    [0.042, 0.092], [0.022, 0.1], [0.012, 0.102], [0.0001, 0.102],
  ], 28), toon(0xffffff, { mapa: rotuloDoCartucho() }));
  // a rosca e a válvula
  por(g, new THREE.CylinderGeometry(0.014, 0.016, 0.016, 12), latao, 0, 0.11, 0);
  por(g, new THREE.CylinderGeometry(0.012, 0.012, 0.03, 10), metal, 0, 0.13, 0);
  // a haste da válvula, saindo de lado, e a MANOPLA de arame na ponta dela:
  // um grupo com nome, que gira em volta da haste quando abre o gás
  por(g, new THREE.CylinderGeometry(0.004, 0.004, 0.05, 8).rotateZ(Math.PI / 2), metal, 0.028, 0.124, 0);
  const manopla = new THREE.Group();
  manopla.name = 'manopla';
  manopla.position.set(0.054, 0.124, 0);
  por(manopla, tubo([[0, 0, 0], [0.004, 0.014, 0.012], [0.006, 0.028, 0], [0.004, 0.014, -0.012], [0, 0, 0]], 0.0028, 16, 4, true), metal);
  por(manopla, new THREE.SphereGeometry(0.006, 8, 6), latao, 0.006, 0.03, 0);
  g.add(manopla);
  // o queimador e a coroa de furinhos
  por(g, torneado([[0.012, 0.145], [0.026, 0.15], [0.03, 0.165], [0.024, 0.17], [0.0001, 0.17]], 18), metal);
  por(g, new THREE.TorusGeometry(0.022, 0.003, 4, 18).rotateX(Math.PI / 2), toon(P.barracaZiper), 0, 0.17, 0);
  // os três braços que seguram a panela, com os dentinhos
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + 0.3;
    const dx = Math.sin(a);
    const dz = Math.cos(a);
    por(g, tubo([[dx * 0.014, 0.148, dz * 0.014], [dx * 0.05, 0.16, dz * 0.05], [dx * 0.066, 0.178, dz * 0.066], [dx * 0.068, 0.186, dz * 0.068]], 0.004, 10, 4), metal);
    for (const t of [0.04, 0.054]) {
      por(g, new THREE.BoxGeometry(0.004, 0.008, 0.004), metal, dx * t, 0.164 + (t - 0.04) * 0.5, dz * t);
    }
  }
  // o lugar da CHAMA, em cima da coroa: quem acende é a cozinha
  // (`world/cozinhaDeAcampamento.ts`), que põe a chama de gás aqui dentro
  const chama = new THREE.Group();
  chama.name = 'chama';
  chama.position.set(0, 0.17, 0);
  g.add(chama);
  return g;
}

/** a PANELINHA de alumínio do kit de camping: a tampa com o pegador e as duas alças de arame dobradas */
export function panelinha(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'panelinha';
  const metal = toon(P.panelaAluminio);
  // o corpo, com o lado de DENTRO (de tampa aberta se vê o fundo) e a boca virada
  por(g, torneado([[0.0001, 0], [0.054, 0], [0.06, 0.008], [0.062, 0.03], [0.062, 0.075], [0.065, 0.08]], 24), metal);
  por(g, torneado([[0.06, 0.078], [0.058, 0.03], [0.052, 0.01], [0.0001, 0.006]], 24), toon(new THREE.Color(P.panelaAluminio).multiplyScalar(0.8).getHex()));
  /*
   * A TAMPA é um grupo com nome e o pivô na BEIRA (no `-X`): é por ali que
   * ela abre, como dobradiça, e é em volta dali que ela treme quando a água
   * ferve. A cozinha da etapa D (`world/cozinhaDeAcampamento.ts`) anima.
   */
  const tampa = new THREE.Group();
  tampa.name = 'tampa';
  tampa.position.set(-0.066, 0.08, 0);
  const naTampa = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => por(tampa, geo, mat, x + 0.066, y - 0.08, z);
  naTampa(torneado([[0.066, 0.08], [0.064, 0.086], [0.04, 0.094], [0.0001, 0.096]], 24), metal);
  naTampa(new THREE.TorusGeometry(0.012, 0.003, 4, 10, Math.PI), toon(P.barracaZiper), 0, 0.096, 0);
  g.add(tampa);
  for (const s of [-1, 1] as const) {
    por(g, tubo([[s * 0.062, 0.07, -0.02], [s * 0.09, 0.075, -0.018], [s * 0.095, 0.076, 0], [s * 0.09, 0.075, 0.018], [s * 0.062, 0.07, 0.02]], 0.003, 12, 4), toon(P.barracaZiper));
  }
  return g;
}

/** a CANECA ESMALTADA branca com a borda azul (e a alça), a de todo acampamento */
export function canecaEsmaltada(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caneca-esmaltada';
  const esmalte = toon(P.canecaEsmalte);
  const borda = toon(P.canecaBorda);
  por(g, torneado([[0.0001, 0.002], [0.034, 0.002], [0.04, 0.008], [0.04, 0.074]], 20), esmalte);
  // a boca: a borda azul virada e o fundo de dentro
  por(g, new THREE.TorusGeometry(0.0405, 0.004, 5, 24).rotateX(Math.PI / 2), borda, 0, 0.075, 0);
  por(g, torneado([[0.038, 0.074], [0.036, 0.02], [0.0001, 0.016]], 20), toon(new THREE.Color(P.canecaEsmalte).multiplyScalar(0.86).getHex()));
  por(g, new THREE.TorusGeometry(0.035, 0.003, 4, 20).rotateX(Math.PI / 2), borda, 0, 0.004, 0);
  // a alça
  const alca = new THREE.TorusGeometry(0.022, 0.006, 6, 12, Math.PI);
  alca.rotateZ(-Math.PI / 2);
  por(g, alca, esmalte, 0.04, 0.042, 0);
  return g;
}

/**
 * A MESINHA DOBRÁVEL de camping: o tampo de ripas de alumínio (as de enrolar),
 * as duas travessas e as pernas em X. Baixinha — é de sentar no chão.
 */
export function mesinhaDobravel(largura = 0.62, profundidade = 0.42, altura = 0.3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesinha-dobravel';
  const metal = toon(P.mesinhaAluminio);
  const RIPAS = 7;
  const larguraDaRipa = profundidade / RIPAS - 0.006;
  for (let i = 0; i < RIPAS; i++) {
    const z = -profundidade / 2 + (i + 0.5) * (profundidade / RIPAS);
    por(g, macia(largura, 0.014, larguraDaRipa, 0.005), metal, 0, altura, z);
  }
  const escuro = toon(new THREE.Color(P.mesinhaAluminio).multiplyScalar(0.7).getHex());
  for (const s of [-1, 1] as const) {
    por(g, macia(0.02, 0.02, profundidade - 0.02, 0.006), escuro, s * (largura / 2 - 0.04), altura - 0.017, 0);
    // as pernas em X de cada lado
    const x = s * (largura / 2 - 0.06);
    por(g, haste(new THREE.Vector3(x, 0, -profundidade / 2 + 0.03), new THREE.Vector3(x, altura - 0.02, profundidade / 2 - 0.03), 0.008), escuro);
    por(g, haste(new THREE.Vector3(x, 0, profundidade / 2 - 0.03), new THREE.Vector3(x, altura - 0.02, -profundidade / 2 + 0.03), 0.008), escuro);
  }
  return g;
}

/**
 * A CANGA: o pano listrado estendido no chão na frente da barraca, com umas
 * ondinhas (pano no chão nunca fica liso) e a franja nas duas pontas, em
 * instância. Ela sobe 1,5 cm do chão — não fica no plano dele.
 */
export function canga(largura = 1.6, profundidade = 1.25): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'canga';
  const geo = new THREE.PlaneGeometry(largura, profundidade, 24, 18);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    p.setY(i, 0.016 + 0.008 * Math.sin(x * 7.1 + 0.6) * Math.cos(z * 5.3) + 0.005 * Math.sin(z * 13 + x * 3));
  }
  geo.computeVertexNormals();
  por(g, geo, toon(0xffffff, { mapa: listrasDaCanga(), doubleSide: true }));
  const fio = new THREE.BoxGeometry(0.01, 0.006, 0.08);
  const quantos = Math.round(largura / 0.04);
  const franja = new THREE.InstancedMesh(fio, toon(P.cangaCreme), quantos * 2);
  const m = new THREE.Object3D();
  const rnd = sorteio(613);
  let n = 0;
  for (const s of [-1, 1] as const) {
    for (let i = 0; i < quantos; i++) {
      m.position.set(-largura / 2 + 0.02 + i * 0.04, 0.012, s * (profundidade / 2 + 0.035));
      m.rotation.set(0, (rnd() - 0.5) * 0.5, 0);
      m.scale.set(1, 1, 0.8 + rnd() * 0.5);
      m.updateMatrix();
      franja.setMatrixAt(n++, m.matrix);
    }
  }
  franja.instanceMatrix.needsUpdate = true;
  g.add(franja);
  return g;
}

/**
 * A MOCHILA CARGUEIRA, de pé: o corpo, a tampa por cima com o bolso, o bolso
 * da frente, as fitas de compressão, as alças acolchoadas nas costas, a
 * barrigueira, o isolante de EVA enrolado e preso embaixo, e o cantil
 * pendurado no mosquetão. A frente (o bolso) olha para `+Z`.
 */
export function mochilaCargueira(cor: number = P.mochilaMusgo): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mochila-cargueira';
  const pano = toon(cor);
  const escuro = toon(new THREE.Color(cor).multiplyScalar(0.72).getHex());
  const fita = toon(P.mochilaAlca);
  // o corpo, mais largo embaixo
  const corpo = macia(0.36, 0.56, 0.26, 0.07);
  const p = corpo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) * (1.05 - 0.12 * ((p.getY(i) + 0.28) / 0.56)));
  corpo.computeVertexNormals();
  por(g, corpo, pano, 0, 0.42, 0);
  // a tampa, caindo por cima, com o zíper
  por(g, macia(0.36, 0.1, 0.28, 0.045), escuro, 0, 0.72, 0.01);
  por(g, tubo([[-0.13, 0.745, 0.15], [0, 0.75, 0.152], [0.13, 0.745, 0.15]], 0.004, 8, 4), fita);
  // o bolso da frente
  por(g, macia(0.26, 0.24, 0.07, 0.035), escuro, 0, 0.36, 0.14);
  // as fitas de compressão dos lados, e as da frente
  for (const s of [-1, 1] as const) {
    for (const y of [0.3, 0.55]) por(g, macia(0.012, 0.03, 0.27, 0.004), fita, s * 0.182, y, 0);
    por(g, macia(0.025, 0.42, 0.01, 0.004), fita, s * 0.09, 0.44, 0.185);
  }
  // as alças nas costas (`-Z`), curvas, e a barrigueira
  for (const s of [-1, 1] as const) {
    por(g, tubo([[s * 0.09, 0.66, -0.13], [s * 0.1, 0.55, -0.17], [s * 0.11, 0.4, -0.16], [s * 0.13, 0.28, -0.13]], 0.022, 16, 6), fita);
  }
  por(g, macia(0.44, 0.07, 0.05, 0.02), fita, 0, 0.2, -0.12);
  // o isolante de EVA enrolado embaixo
  const isolante = new THREE.CylinderGeometry(0.07, 0.07, 0.42, 16);
  isolante.rotateZ(Math.PI / 2);
  por(g, isolante, toon(P.colchaoMostarda), 0, 0.09, 0.03);
  por(g, new THREE.TorusGeometry(0.073, 0.007, 4, 16).rotateY(Math.PI / 2), fita, 0.12, 0.09, 0.03);
  por(g, new THREE.TorusGeometry(0.073, 0.007, 4, 16).rotateY(Math.PI / 2), fita, -0.12, 0.09, 0.03);
  // o cantil no mosquetão, do lado
  por(g, new THREE.TorusGeometry(0.018, 0.004, 4, 10), toon(P.fogareiroMetal), 0.2, 0.5, 0.06);
  por(g, torneado([[0.0001, 0], [0.045, 0], [0.048, 0.02], [0.048, 0.13], [0.03, 0.16], [0.014, 0.17], [0.0001, 0.17]], 16), toon(P.fogareiroMetal), 0.22, 0.3, 0.06);
  return g;
}

/**
 * O TRONCO CAÍDO, o banco da clareira: casca sulcada em canvas, a madeira
 * cortada nas duas pontas com os anéis, uma calombinha aqui e ali, musgo por
 * cima e três cogumelinhos vermelhos de pinta branca. Deitado no `X`.
 */
export function troncoCaido(comprimento = 2.2, raio = 0.21): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'tronco-caido';
  const casca = new THREE.CylinderGeometry(raio, raio * 1.08, comprimento, 14, 8, true);
  // as calombinhas: o raio sorteado pela POSIÇÃO arredondada (o mesmo canto
  // recebe o mesmo empurrão nas duas pontas da emenda), como a pedra do kit
  const p = casca.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const a = Math.atan2(x, z);
    const k = 1 + 0.06 * Math.sin(a * 3 + y * 4.1) + 0.04 * Math.sin(a * 5 - y * 9.3);
    p.setX(i, x * k);
    p.setZ(i, z * k);
  }
  casca.computeVertexNormals();
  // o UV em metros: a volta e o comprimento (os sulcos correm no comprimento)
  const uv = casca.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * Math.PI * 2 * raio, p.getY(i));
  casca.rotateZ(Math.PI / 2);
  por(g, casca, toon(P.troncoCasca, { mapa: cascaDeTronco() }), 0, raio * 0.92, 0);
  for (const s of [-1, 1] as const) {
    const ponta = new THREE.CircleGeometry(raio * (s < 0 ? 1.0 : 1.08) * 0.99, 14);
    ponta.rotateY(s * Math.PI / 2);
    por(g, ponta, toon(P.troncoMiolo, { mapa: aneisDoTronco() }), s * comprimento / 2, raio * 0.92, 0);
  }
  // o musgo por cima
  const musgo = toon(P.musgo);
  for (const [x, esc] of [[-0.5, 1], [0.2, 0.8], [0.7, 0.65]] as const) {
    const m = new THREE.SphereGeometry(0.12 * esc, 10, 6);
    m.scale(1.6, 0.35, 1);
    por(g, m, musgo, x, raio * 1.8, -0.03);
  }
  // os cogumelinhos na lateral da frente
  const chapeu = toon(P.cogumelo);
  const branco = toon(P.cangaCreme);
  for (const [x, esc] of [[-0.75, 1], [-0.62, 0.7], [0.5, 0.85]] as const) {
    const pe = new THREE.CylinderGeometry(0.012 * esc, 0.016 * esc, 0.06 * esc, 8);
    por(g, pe, branco, x, 0.03 * esc, raio * 0.98);
    const ch = new THREE.SphereGeometry(0.035 * esc, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    por(g, ch, chapeu, x, 0.058 * esc, raio * 0.98);
    for (let k = 0; k < 4; k++) {
      const a = k * 1.7;
      por(g, new THREE.SphereGeometry(0.006 * esc, 6, 4), branco,
        x + Math.sin(a) * 0.02 * esc, 0.058 * esc + 0.024 * esc, raio * 0.98 + Math.cos(a) * 0.02 * esc);
    }
  }
  return g;
}

/**
 * A SAMAMBAIA: as frondes em arco saindo do miolo, cada uma uma lança de
 * bordas serrilhadas (os folíolos), dobrada para fora e para baixo — um
 * `InstancedMesh` só, com o verde de cada fronde sorteado.
 */
let geoDaFronde: THREE.BufferGeometry | null = null;
function fronde(): THREE.BufferGeometry {
  if (geoDaFronde) return geoDaFronde;
  const f = new THREE.Shape();
  const L = 0.62;
  const DENTES = 11;
  f.moveTo(0, 0);
  // um lado serrilhado subindo, a ponta, e o outro descendo
  for (let i = 1; i <= DENTES; i++) {
    const t = i / DENTES;
    const larg = 0.075 * Math.sin(Math.PI * Math.min(1, t * 1.05)) + 0.004;
    f.lineTo(larg * 1.25, (t - 0.5 / DENTES) * L);
    f.lineTo(larg * 0.55, t * L);
  }
  for (let i = DENTES; i >= 1; i--) {
    const t = i / DENTES;
    const larg = 0.075 * Math.sin(Math.PI * Math.min(1, t * 1.05)) + 0.004;
    f.lineTo(-larg * 0.55, t * L);
    f.lineTo(-larg * 1.25, (t - 0.5 / DENTES) * L);
  }
  f.lineTo(0, 0);
  const geo = new THREE.ShapeGeometry(f, 2);
  // a fronde sai em pé e dobra em arco: cada ponto desce conforme sobe
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const t = y / L;
    const ang = t * 1.5;
    p.setXYZ(i, p.getX(i), Math.sin(ang) * L * 0.62, (1 - Math.cos(ang)) * L * 0.62 + Math.abs(p.getX(i)) * 0.25);
  }
  geo.computeVertexNormals();
  geoDaFronde = geo;
  return geo;
}

/**
 * AS SAMAMBAIAS de um lugar inteiro num desenho só: todas as frondes de todas
 * as touceiras num `InstancedMesh` (é a mesma folha), e os montinhos de terra
 * do pé numa malha só. Cada touceira é `[x, z, escala, semente]`, no
 * referencial da peça.
 */
export function samambaias(touceiras: ReadonlyArray<readonly [number, number, number, number]>): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'samambaias';
  const FRONDES = 11;
  const lote = new THREE.InstancedMesh(fronde(), toon(0xffffff, { doubleSide: true }), FRONDES * touceiras.length);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  const montes: THREE.BufferGeometry[] = [];
  let n = 0;
  for (const [x, z, escala, semente] of touceiras) {
    const rnd = sorteio(Math.floor(semente * 977) + 5);
    for (let i = 0; i < FRONDES; i++) {
      const a = (i / FRONDES) * Math.PI * 2 + rnd() * 0.4 + semente;
      m.position.set(x, 0.02, z);
      m.rotation.set(0, a, 0);
      const esc = escala * (0.75 + rnd() * 0.45);
      m.scale.set(esc, esc * (0.9 + rnd() * 0.3), esc);
      m.updateMatrix();
      lote.setMatrixAt(n, m.matrix);
      cor.setHex(P.samambaia).offsetHSL((rnd() - 0.5) * 0.04, 0, (rnd() - 0.5) * 0.1);
      lote.setColorAt(n, cor);
      n++;
    }
    montes.push(new THREE.SphereGeometry(0.09 * escala, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2).translate(x, 0, z));
  }
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  g.add(lote);
  for (const monte of montes) por(g, monte, toon(P.terraDeVaso));
  return g;
}

/**
 * AS FOLHAS SECAS no chão da clareira: um `InstancedMesh` de folhinhas
 * ovais, cada uma com o giro, o tamanho e o tom de outono sorteados, um tico
 * acima do chão e meio inclinadas. `area` diz onde cai cada uma (a cena tira
 * a barraca e a canga do caminho).
 */
export function folhasSecas(quantas: number, onde: (rnd: () => number) => [number, number] | null, semente = 3): THREE.InstancedMesh {
  const f = new THREE.Shape();
  f.moveTo(0, -0.05);
  f.quadraticCurveTo(0.035, -0.01, 0, 0.05);
  f.quadraticCurveTo(-0.035, -0.01, 0, -0.05);
  const geo = new THREE.ShapeGeometry(f, 4);
  geo.rotateX(-Math.PI / 2);
  const lote = new THREE.InstancedMesh(geo, toon(0xffffff, { doubleSide: true }), quantas);
  lote.userData.peca = 'folhas-secas';
  const rnd = sorteio(semente * 131 + 7);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  let n = 0;
  for (let tentativa = 0; tentativa < quantas * 4 && n < quantas; tentativa++) {
    const ponto = onde(rnd);
    if (!ponto) continue;
    m.position.set(ponto[0], 0.006 + rnd() * 0.01, ponto[1]);
    m.rotation.set((rnd() - 0.5) * 0.4, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.4);
    m.scale.setScalar(0.8 + rnd() * 0.9);
    m.updateMatrix();
    lote.setMatrixAt(n, m.matrix);
    cor.setHex(P.folhaSeca).offsetHSL((rnd() - 0.5) * 0.08, (rnd() - 0.5) * 0.2, (rnd() - 0.5) * 0.16);
    lote.setColorAt(n, cor);
    n++;
  }
  lote.count = n;
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  return lote;
}

/**
 * O ARBUSTO FLORIDO, baixinho (uns 95 cm), da beira da clareira — no lugar
 * das duas árvores que tapavam, da porta da barraca, o sol nascendo atrás
 * do lago (pedido do Renan: "arbustos bonitinhos com algumas flores").
 *
 * A COPA são sete bolotas de folha amassadas pela POSIÇÃO (como a pedra: a
 * mesma quina recebe o mesmo empurrão em todo triângulo que a usa), em dois
 * verdes, as de fora mais baixas — um domo, e não três bolas em fila. Por
 * cima, em LOTE, as folhinhas que escapam do contorno (é o que tira a cara
 * de bola lisa) e as flores de cinco pétalas (`geoFlor`), cada uma deitada na
 * copa pela normal dela, com o miolo amarelo. `cores` sorteia a cor de cada
 * flor. Base no chão, centrada.
 */
export function arbustoFlorido(
  escala = 1, semente = 1, cores: readonly number[] = [P.florDoArbusto, P.florDoArbustoBranca],
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arbusto-florido';
  const rnd = sorteio(9000 + Math.round(semente * 97));
  // as bolotas: [x, y, z, raio], a do meio mais alta
  const bolotas: Array<[number, number, number, number]> = [[0, 0.5, 0, 0.44]];
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + rnd() * 0.5;
    const d = 0.36 + rnd() * 0.1;
    bolotas.push([Math.cos(a) * d, 0.3 + rnd() * 0.1, Math.sin(a) * d * 0.85, 0.28 + rnd() * 0.08]);
  }
  const verdes = [toon(P.leafDark), toon(P.bush)];
  bolotas.forEach(([x, y, z, r], i) => {
    const geo = new THREE.IcosahedronGeometry(r, 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let v = 0; v < pos.count; v++) {
      const px = pos.getX(v);
      const py = pos.getY(v);
      const pz = pos.getZ(v);
      // o empurrão sorteado pela posição arredondada (a geometria não é indexada)
      const h = Math.sin(Math.round(px * 400) * 12.9898 + Math.round(py * 400) * 78.233 + Math.round(pz * 400) * 37.719 + semente) * 43758.5453;
      const k = 1 + ((h - Math.floor(h)) - 0.5) * 0.16;
      pos.setXYZ(v, px * k, py * k * 0.92, pz * k);
    }
    geo.computeVertexNormals();
    por(g, geo, verdes[i % 2 === 0 ? 0 : 1], x, y, z);
  });

  // pontos na casca da copa (por fora de todas as bolotas), virados para fora
  const naCopa = (acima: number): { p: THREE.Vector3; n: THREE.Vector3 } | null => {
    for (let tentativa = 0; tentativa < 30; tentativa++) {
      const [x, y, z, r] = bolotas[Math.floor(rnd() * bolotas.length)];
      const n = new THREE.Vector3(rnd() * 2 - 1, rnd() * 1.4 - 0.4, rnd() * 2 - 1).normalize();
      if (n.y < acima) continue;
      const p = new THREE.Vector3(x, y, z).addScaledVector(n, r * 0.97);
      if (p.y < 0.14) continue;
      const dentro = bolotas.some(([bx, by, bz, br]) => (bx !== x || by !== y || bz !== z) && p.distanceTo(new THREE.Vector3(bx, by, bz)) < br * 0.95);
      if (!dentro) return { p, n };
    }
    return null;
  };

  // AS FOLHINHAS que escapam do contorno: em pé na copa, um tico para cima
  const folhas = new THREE.InstancedMesh(geoFolha(), toon(0xffffff), 34);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  const Z = new THREE.Vector3(0, 0, 1);
  let nf = 0;
  for (let i = 0; i < 34; i++) {
    const ponto = naCopa(-0.1);
    if (!ponto) continue;
    const rumo = ponto.n.clone().add(new THREE.Vector3(0, 0.45, 0)).normalize();
    m.position.copy(ponto.p).addScaledVector(ponto.n, -0.03);
    m.quaternion.setFromUnitVectors(Z, rumo);
    m.rotateZ(rnd() * Math.PI * 2);
    m.scale.setScalar(0.14 + rnd() * 0.06);
    m.updateMatrix();
    folhas.setMatrixAt(nf, m.matrix);
    folhas.setColorAt(nf, cor.setHex(rnd() < 0.5 ? P.leafDark : P.bush));
    nf++;
  }
  folhas.count = nf;
  g.add(folhas);

  // AS FLORES: deitadas na copa pela normal, mais em cima que embaixo
  const QUANTAS = 30;
  const flores = new THREE.InstancedMesh(geoFlor(), toon(0xffffff, { doubleSide: true }), QUANTAS);
  const miolos = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), toon(P.flowerYellow), QUANTAS);
  const Y = new THREE.Vector3(0, 1, 0);
  let n = 0;
  for (let i = 0; i < QUANTAS; i++) {
    const ponto = naCopa(0.05);
    if (!ponto) continue;
    const tam = 0.055 + rnd() * 0.025;
    m.position.copy(ponto.p).addScaledVector(ponto.n, 0.012);
    m.quaternion.setFromUnitVectors(Y, ponto.n);
    m.rotateY(rnd() * Math.PI * 2);
    m.scale.setScalar(tam);
    m.updateMatrix();
    flores.setMatrixAt(n, m.matrix);
    flores.setColorAt(n, cor.setHex(cores[Math.floor(rnd() * cores.length)]));
    m.position.copy(ponto.p).addScaledVector(ponto.n, 0.012 + tam * 0.25);
    m.scale.setScalar(tam * 0.28);
    m.updateMatrix();
    miolos.setMatrixAt(n, m.matrix);
    n++;
  }
  flores.count = n;
  miolos.count = n;
  g.add(flores, miolos);
  for (const lote of [folhas, flores, miolos]) {
    lote.instanceMatrix.needsUpdate = true;
    if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
    lote.computeBoundingSphere();
  }
  g.scale.setScalar(escala);
  return g;
}

/**
 * O VARAL DE LUZINHAS entre duas árvores: o fio caindo em catenária, as
 * lâmpadas penduradas em lote (`lampadas`, que a noite acende) com o
 * soquetinho escuro, e o nó em volta de cada tronco. `de` e `ate` são os dois
 * pontos de amarrar, no referencial da peça.
 */
export function varalDeLuzinhas(de: THREE.Vector3, ate: THREE.Vector3, barriga = 0.45, lampadas = 16): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'varal-de-luzinhas';
  const fio = toon(P.luzinhaFio);
  const ponto = (t: number): THREE.Vector3 => de.clone().lerp(ate, t).add(new THREE.Vector3(0, -barriga * 4 * t * (1 - t), 0));
  const pts: THREE.Vector3[] = [];
  for (let k = 0; k <= 30; k++) pts.push(ponto(k / 30));
  por(g, tubo(pts, 0.006, 60, 4), fio);
  // as lâmpadas: o soquete e a bolinha, em dois lotes
  const soquetes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 6), fio, lampadas);
  const bolas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.026, 10, 8), toon(P.luzinha), lampadas);
  bolas.name = 'lampadas';
  const m = new THREE.Object3D();
  for (let i = 0; i < lampadas; i++) {
    const p = ponto((i + 0.5) / lampadas);
    m.position.set(p.x, p.y - 0.022, p.z);
    m.rotation.set(0, 0, 0);
    m.scale.setScalar(1);
    m.updateMatrix();
    soquetes.setMatrixAt(i, m.matrix);
    m.position.set(p.x, p.y - 0.058, p.z);
    m.scale.set(1, 1.2, 1);
    m.updateMatrix();
    bolas.setMatrixAt(i, m.matrix);
  }
  soquetes.instanceMatrix.needsUpdate = true;
  bolas.instanceMatrix.needsUpdate = true;
  g.add(soquetes, bolas);
  /*
   * ACESO (`acenderVaral`): um halo em cada lâmpada — UM desenho só para
   * todos (`brilhoEmLote`), e a força de cada um é a cor da cópia, para elas
   * acenderem uma de cada vez — e a faixa quente no chão embaixo do fio.
   */
  const brilho = new THREE.Group();
  brilho.name = 'brilhoDoVaral';
  brilho.visible = false;
  const halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.luzDoVaral, 0.85), lampadas);
  halos.name = 'halosDoVaral';
  halos.userData.semSombra = true;
  halos.renderOrder = 61;
  const preto = new THREE.Color(0, 0, 0);
  for (let i = 0; i < lampadas; i++) {
    const p = ponto((i + 0.5) / lampadas);
    m.position.set(p.x, p.y - 0.058, p.z);
    m.scale.setScalar(0.46);
    m.updateMatrix();
    halos.setMatrixAt(i, m.matrix);
    halos.setColorAt(i, preto);
  }
  halos.instanceMatrix.needsUpdate = true;
  brilho.add(halos);
  const faixa = new THREE.Mesh(new THREE.PlaneGeometry(de.distanceTo(ate) * 0.92, 1.7), luzNoChao(P.luzDoVaral, 0.26));
  faixa.rotation.x = -Math.PI / 2;
  const meioDoFio = ponto(0.5);
  faixa.position.set(meioDoFio.x, 0.03, meioDoFio.z);
  faixa.renderOrder = 60;
  faixa.userData.semSombra = true;
  brilho.add(faixa);
  g.add(brilho);
  for (const p of [de, ate]) {
    const no = new THREE.TorusGeometry(0.2, 0.012, 4, 14);
    no.rotateX(Math.PI / 2);
    por(g, no, fio, p.x, p.y, p.z);
  }
  return g;
}

/**
 * ACENDE O VARAL aos poucos: `k` de 0 (apagado) a 1 (todas acesas). As
 * lâmpadas acendem uma de cada vez, da primeira para a última — o halo de
 * cada uma sobe quando chega a vez dela —, e o vidro de todas vira luz no
 * primeiro instante (a malha é uma só).
 */
export function acenderVaral(varal: THREE.Object3D, k: number): void {
  const bolas = varal.getObjectByName('lampadas') as THREE.InstancedMesh | undefined;
  const halos = varal.getObjectByName('halosDoVaral') as THREE.InstancedMesh | undefined;
  const brilho = varal.getObjectByName('brilhoDoVaral');
  if (bolas) bolas.material = k > 0 ? toon(P.luzinhaAcesa, { glow: 1 }) : toon(P.luzinha);
  if (brilho) brilho.visible = k > 0;
  if (!halos) return;
  const n = halos.count;
  const cor = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const forca = THREE.MathUtils.clamp(k * n - i, 0, 1);
    halos.setColorAt(i, cor.setScalar(forca));
  }
  if (halos.instanceColor) halos.instanceColor.needsUpdate = true;
}
