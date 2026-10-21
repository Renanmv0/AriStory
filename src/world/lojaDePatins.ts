/**
 * A LOJA DE PATINS do Villa Lobos, por fora — a segunda versão.
 *
 * A primeira era uma caixa creme com uma laje marrom avançando por cima: de
 * longe, a laje era tudo o que se via. Esta é um prédio de rua com cara de
 * pista de patinação dos anos 80, montado com o kit da lojinha da Estella
 * (`lojaDeRoupas.ts`, `molduras.ts`, `texturasDeFachada.ts`):
 *
 * - parede de reboco água-marinha com FURO de verdade (a porta e a vitrine na
 *   frente, a janela do aluguel no lado +X), rodapé de tijolinho, plinto de
 *   pedra, a faixa coral e a cornija com capeamento dando a volta;
 * - a vitrine com caixilho, a porta de vidro com o puxador e a plaquinha de
 *   "ABERTO", o toldo listrado de gomos com a saia em meia-lua e a floreira;
 * - a platibanda com o letreiro e as lâmpadas em volta, e o PATINS GIGANTE no
 *   telhado, que é o que diz o que a loja é de longe;
 * - lá dentro (visto pelo vidro): piso xadrez, o tablado da vitrine com o
 *   patins no pedestal e os capacetes, a parede de exposição e a luz pintada;
 * - o balcão do aluguel colado no +X, de ripas, com a sineta, e pela janela
 *   o ESCANINHO de patins numerados por tamanho.
 *
 * O tamanho por fora é o da antiga (7,4 × 4,4), e a frente e o balcão moram
 * em `LOJA_DE_PATINS`, que é o que a cena lê para os colisores.
 *
 * A câmera vem pela diagonal (0,95 de altura por metro de avanço, ver
 * "Prédio de telhado" na skill de peça): os dois toldos são rasos e altos —
 * o da vitrine, a 2,92 e 58 cm para fora, só come a vitrine acima de ~1,95.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { flat, toon } from '../core/materials';
import { uvDeParede, uvEmMetros, uvEmMetrosPorTriangulo } from './acabamento';
import { pocaDeLuz } from './furniture';
import { Lote, extrudar, geoFlor, geoFolha, quina, retangulo } from './lojaDeRoupas';
import { cavetinho, contorno } from './molduras';
import { reboco, tijolinho } from './texturasDeFachada';
import { veioDeMadeira } from './texturasDeCasa';
import { novaTextura, sorteio } from './texturasDeChao';

/** as medidas que a cena usa para os colisores e o balcão, no quadro da peça */
export const LOJA_DE_PATINS = {
  /** o prédio, por fora (sem o plinto) */
  meiaX: 3.7,
  meiaZ: 2.2,
  /** até onde vão a floreira e o degrau da porta, na frente */
  frente: 2.54,
  /** o balcão do aluguel, colado na parede do +X */
  balcao: { x: 4.16, z: 0.2, meiaX: 0.52, meiaZ: 1.68 },
} as const;

const css = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;

// ===================================================================== TEXTURAS

/** a lona do toldo: listras de 25 cm, coral e creme, com a costura e a trama */
function listras(): THREE.CanvasTexture {
  return novaTextura('patins:listras', 0.5, (ctx, s) => {
    ctx.fillStyle = css(P.lojaPatinsCreme);
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = css(P.lojaPatinsCoral);
    ctx.fillRect(0, 0, s / 2, s);
    // a trama: fios deitados bem fracos
    for (let y = 0; y < s; y += 5) {
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fillRect(0, y, s, 2);
    }
    // a costura de cada emenda de listra
    ctx.fillStyle = 'rgba(90,40,30,0.16)';
    ctx.fillRect(s / 2 - 1, 0, 2, s);
    ctx.fillRect(0, 0, 1, s);
    ctx.fillRect(s - 1, 0, 1, s);
  });
}

/** o piso de pista: xadrez de 40 cm, claro e chumbo, com o rejunte e o brilho da cera */
function pisoXadrez(): THREE.CanvasTexture {
  return novaTextura('patins:piso', 0.8, (ctx, s) => {
    const q = s / 2;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.fillStyle = css((i + j) % 2 ? P.lojaPatinsPisoEscuro : P.lojaPatinsPisoClaro);
        ctx.fillRect(i * q, j * q, q, q);
      }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let k = 0; k <= 2; k++) {
      ctx.fillRect(k * q - 1, 0, 2, s);
      ctx.fillRect(0, k * q - 1, s, 2);
    }
    // a cera: um risco claro na diagonal de cada ladrilho
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 5;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.beginPath();
        ctx.moveTo(i * q + q * 0.2, j * q + q * 0.75);
        ctx.lineTo(i * q + q * 0.55, j * q + q * 0.3);
        ctx.stroke();
      }
    }
  });
}

/**
 * Uma placa pintada em canvas (o letreiro, o "ALUGUEL", o "ABERTO", as
 * etiquetas de tamanho): o plano do tamanho pedido, olhando para `+Z`.
 */
function placaPintada(
  largura: number, altura: number, pintar: (ctx: CanvasRenderingContext2D, W: number, H: number) => void,
  transparente = false,
): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.max(32, Math.round((1024 * altura) / largura));
  const ctx = canvas.getContext('2d');
  if (ctx) pintar(ctx, canvas.width, canvas.height);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(largura, altura),
    new THREE.MeshBasicMaterial({ map: textura, transparent: transparente }),
  );
}

const fonte = (px: number, italico = false): string =>
  `${italico ? 'italic ' : ''}900 ${px}px ui-rounded, "Nunito", system-ui, sans-serif`;

/** encolhe a letra até o texto caber em `ocupa` */
function caber(ctx: CanvasRenderingContext2D, texto: string, tamanho: number, ocupa: number, italico = false): number {
  let t = tamanho;
  ctx.font = fonte(t, italico);
  while (t > 8 && ctx.measureText(texto).width > ocupa) {
    t -= 2;
    ctx.font = fonte(t, italico);
  }
  return t;
}

/** o letreiro da platibanda: "Patins" inclinado, amarelo com contorno, e duas estrelinhas */
function letreiro(largura: number, altura: number): THREE.Mesh {
  return placaPintada(largura, altura, (ctx, W, H) => {
    ctx.fillStyle = css(P.lojaPatinsCoral);
    ctx.fillRect(0, 0, W, H);
    // o filete creme por dentro da borda
    ctx.strokeStyle = css(P.lojaPatinsCreme);
    ctx.lineWidth = H * 0.05;
    const m = H * 0.1;
    ctx.beginPath();
    ctx.roundRect(m, m, W - m * 2, H - m * 2, H * 0.22);
    ctx.stroke();
    const texto = 'Patins';
    const t = caber(ctx, texto, Math.round(H * 0.72), W * 0.56, true);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    const y = H / 2 + t * 0.05;
    // a sombra e o contorno, depois a letra
    ctx.fillStyle = 'rgba(40,30,40,0.35)';
    ctx.fillText(texto, W / 2 + t * 0.06, y + t * 0.07);
    ctx.strokeStyle = css(P.lojaPatinsPisoEscuro);
    ctx.lineWidth = t * 0.14;
    ctx.strokeText(texto, W / 2, y);
    ctx.fillStyle = css(P.lojaPatinsAmarelo);
    ctx.fillText(texto, W / 2, y);
    // o brilho de cima de cada letra
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, y - t * 0.12);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(texto, W / 2, y);
    ctx.restore();
    // as estrelinhas de quatro pontas, de cada lado
    const estrela = (cx: number, cy: number, r: number): void => {
      ctx.fillStyle = css(P.lojaPatinsCreme);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 ? r * 0.32 : r;
        ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    };
    const meio = ctx.measureText(texto).width / 2;
    for (const lado of [-1, 1]) {
      estrela(W / 2 + lado * (meio + H * 0.42), H * 0.42, H * 0.2);
      estrela(W / 2 + lado * (meio + H * 0.78), H * 0.64, H * 0.11);
    }
  });
}

/** uma placa de texto simples em fundo cheio, com a borda pintada */
function placaDeTexto(texto: string, largura: number, altura: number, fundo: number, letra: number): THREE.Mesh {
  return placaPintada(largura, altura, (ctx, W, H) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = css(letra);
    ctx.lineWidth = H * 0.07;
    const m = H * 0.12;
    ctx.beginPath();
    ctx.roundRect(m, m, W - m * 2, H - m * 2, H * 0.18);
    ctx.stroke();
    const t = caber(ctx, texto, Math.round(H * 0.56), W * 0.8);
    ctx.font = fonte(t);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = css(letra);
    ctx.fillText(texto, W / 2, H / 2 + t * 0.05);
  });
}

/** a fita das etiquetas de tamanho, uma por escaninho */
function etiquetas(numeros: readonly string[], largura: number, altura: number): THREE.Mesh {
  return placaPintada(largura, altura, (ctx, W, H) => {
    ctx.fillStyle = css(P.lojaPatinsPisoEscuro);
    ctx.fillRect(0, 0, W, H);
    const casa = W / numeros.length;
    numeros.forEach((n, i) => {
      const cx = casa * (i + 0.5);
      ctx.fillStyle = css(P.lojaPatinsCreme);
      ctx.beginPath();
      ctx.roundRect(cx - casa * 0.16, H * 0.1, casa * 0.32, H * 0.8, H * 0.2);
      ctx.fill();
      ctx.font = fonte(Math.round(H * 0.62));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = css(P.lojaPatinsPisoEscuro);
      ctx.fillText(n, cx, H / 2 + H * 0.04);
    });
  });
}

// ================================================================== O PATINS

/**
 * O PATINS DE QUATRO RODAS da loja — o de vitrine (o do pé da dupla é o
 * `patins()` do kit, e não muda): bota de cano alto de quina macia, a
 * biqueira redonda, a lingueta, o cadarço cruzado, a gola acolchoada, a raia
 * de lado, a sola e o salto, a placa, os eixos, as quatro rodas com cubo e o
 * freio na ponta. Base (o chão das rodas) em `y = 0`, olhando para `+Z`.
 */
export function patinsRetro(
  cor: number = P.lojaPatinsCreme,
  corRoda: number = P.lojaPatinsCoral,
  corRaia: number = P.lojaPatinsCoral,
  corGola: number = P.lojaPatinsCreme,
): THREE.Group {
  const g = new THREE.Group();
  const bota = toon(cor);
  const borracha = toon(P.lojaPatinsBorracha);
  const metal = toon(P.lojaMetal);
  const roda = toon(corRoda);
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  const R = 0.036;
  // as rodas e o cubo (um fio mais largo que a roda: não divide a tampa)
  for (const x of [-0.056, 0.056]) {
    for (const z of [-0.088, 0.088]) {
      add(new THREE.CylinderGeometry(R, R, 0.03, 12), roda, x, R, z).rotation.z = Math.PI / 2;
      add(new THREE.CylinderGeometry(0.016, 0.016, 0.034, 8), metal, x, R, z).rotation.z = Math.PI / 2;
    }
  }
  // os eixos, a placa, a sola e o salto
  for (const z of [-0.088, 0.088]) add(new THREE.BoxGeometry(0.09, 0.018, 0.03), metal, 0, 0.052, z);
  add(quina(0.066, 0.02, 0.24, 0.006), metal, 0, 0.07, 0.005);
  add(quina(0.112, 0.026, 0.285, 0.01), borracha, 0, 0.092, 0.01);
  add(quina(0.1, 0.03, 0.08, 0.01), borracha, 0, 0.115, -0.095);
  // o freio na ponta, enfiado na sola
  add(new THREE.CylinderGeometry(0.02, 0.024, 0.045, 10), borracha, 0, 0.058, 0.142).rotation.x = 0.3;
  // a bota: o pé, a biqueira, o cano e a gola
  add(quina(0.108, 0.09, 0.25, 0.034), bota, 0, 0.148, 0.012);
  add(new THREE.SphereGeometry(1, 10, 6), bota, 0, 0.145, 0.128).scale.set(0.054, 0.046, 0.05);
  add(quina(0.104, 0.17, 0.125, 0.04), bota, 0, 0.265, -0.06);
  add(quina(0.112, 0.032, 0.133, 0.014), toon(corGola), 0, 0.345, -0.06);
  // a lingueta, inclinada para a frente
  add(quina(0.07, 0.13, 0.026, 0.012), toon(corGola), 0, 0.272, 0.014).rotation.x = 0.16;
  // o cadarço cruzado em cima do pé
  const cadarco = toon(P.lojaPatinsCreme === cor ? P.lojaPatinsCoral : P.lojaPatinsCreme);
  for (const z of [0.03, 0.065, 0.1]) {
    for (const giro of [-0.5, 0.5]) add(new THREE.BoxGeometry(0.058, 0.008, 0.01), cadarco, 0, 0.196, z).rotation.y = giro;
  }
  // a raia de cada lado do pé, num raio só (a "faísca" de patins de pista)
  for (const x of [-0.0555, 0.0555]) {
    add(new THREE.BoxGeometry(0.006, 0.02, 0.16), toon(corRaia), x, 0.15, 0.005).rotation.x = -0.22;
  }
  return g;
}

/** um par lado a lado (o esquerdo e o direito), base em `y = 0` */
function parDePatins(cor: number, corRoda: number, corRaia: number, escala = 1): THREE.Group {
  const par = new THREE.Group();
  for (const lado of [-1, 1]) {
    const p = patinsRetro(cor, corRoda, corRaia);
    p.position.x = lado * 0.068;
    p.rotation.y = lado * 0.06;
    par.add(p);
  }
  par.scale.setScalar(escala);
  return par;
}

/** as cores dos pares à venda: bota, roda e raia */
const PARES: ReadonlyArray<readonly [number, number, number]> = [
  [P.lojaPatinsCreme, P.lojaPatinsCoral, P.lojaPatinsCoral],
  [P.lojaPatinsCoral, P.lojaPatinsAmarelo, P.lojaPatinsCreme],
  [P.lojaPatinsParede, P.lojaPatinsCreme, P.lojaPatinsCoral],
  [P.flowerPink, P.lojaPatinsCreme, P.lojaPatinsAmarelo],
  [P.lojaPatinsAmarelo, P.lojaPatinsCoral, P.lojaPatinsPisoEscuro],
  [P.lojaPatinsPisoEscuro, P.lojaPatinsAmarelo, P.lojaPatinsCoral],
  [P.fabricBlue, P.lojaPatinsCreme, P.lojaPatinsAmarelo],
  [P.lojaPatinsCreme, P.lojaPatinsParede, P.fabricBlue],
];

// ==================================================================== A LOJA

export function lojaDePatins(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'loja-de-patins';
  const rnd = sorteio(4417);

  // ------------------------------------------------------------- materiais
  const parede = toon(P.lojaPatinsParede, { mapa: reboco() });
  const tijolo = toon(P.lojaPatinsCreme, { mapa: tijolinho(0.84, P.lojaPatinsTijolo) });
  const creme = toon(P.lojaPatinsCreme);
  const coral = toon(P.lojaPatinsCoral);
  const pedra = toon(P.concrete);
  const metal = toon(P.lojaMetal);
  const escuro = toon(P.lojaPatinsBorracha);
  const teto = toon(P.lojaPatinsTeto);
  const madeira = toon(P.wood, { mapa: veioDeMadeira() });
  const piso = toon(0xffffff, { mapa: pisoXadrez() });
  const lona = toon(0xffffff, { mapa: listras(), doubleSide: true });
  const terra = toon(P.terraDeVaso);
  const dourado = toon(P.gold);
  /*
   * O VIDRO É `flat()`, como o da lojinha da Estella: sombreado, a vitrine
   * caía no degradê escuro do toon e escondia o que está atrás dela.
   */
  const vidro = flat(P.lojaVitrine, 0.26);
  const vidros: THREE.BufferGeometry[] = [];

  // os lotes: as flores da floreira e as lâmpadas do letreiro
  const branco = toon(0xffffff, { doubleSide: true });
  const flores = new Lote(geoFlor(), branco);
  const miolos = new Lote(new THREE.OctahedronGeometry(1, 0), toon(0xffffff));
  const folhas = new Lote(geoFolha(), branco);
  const lampadas = new Lote(new THREE.SphereGeometry(1, 8, 6), toon(P.luzDoPortao, { glow: 0.6 }));

  // ------------------------------------------------------------- as medidas
  const HX = LOJA_DE_PATINS.meiaX;
  const HZ = LOJA_DE_PATINS.meiaZ;
  const ESP = 0.24;          // a espessura da parede
  const MEIO = HX - ESP;     // a frente e o fundo cabem entre as laterais
  const DENTRO = HZ - ESP;   // o fundo do lado de dentro
  const Y_PISO = 0.19;       // o piso de dentro (o plinto tem 0,18)
  const Y_TIJOLO = 0.75;     // até onde sobe o rodapé de tijolinho
  const Y_TOPO = 3.85;       // o alto da platibanda
  const Y_LAJE = 3.45;       // o telhado, escondido atrás da platibanda
  const PORTA = { x0: -3.0, x1: -1.9, y0: 0.2, y1: 2.45 };
  const VITRINE = { x0: -1.55, x1: 3.1, y0: 0.82, y1: 2.45 };
  // a janela do aluguel, no quadro da direita (o `x` dele é o `-z` da peça)
  const JANELA = { x0: -1.5, x1: 1.1, y0: 1.0, y1: 2.35 };

  // ------------------------------------------------------- quadros e peças
  /*
   * CADA PAREDE É UM QUADRO, como na lojinha da Estella: um grupo sem nome
   * com a face de fora em `z = 0` e o `+z` para a rua.
   */
  const quadro = (x: number, z: number, giro: number): THREE.Group => {
    const q = new THREE.Group();
    q.position.set(x, 0, z);
    q.rotation.y = giro;
    q.updateMatrix();
    g.add(q);
    return q;
  };
  const FRENTE = quadro(0, HZ, 0);
  const DIREITA = quadro(HX, 0, Math.PI / 2);
  const FUNDOS = quadro(0, -HZ, Math.PI);
  const ESQUERDA = quadro(-HX, 0, -Math.PI / 2);

  const peca = (pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material,
    x = 0, y = 0, z = 0): THREE.Mesh => {
    let geometria = geo;
    if (mat === parede || mat === tijolo) geometria = uvDeParede(geo, x, y, z);
    else if (mat === madeira || mat === piso) {
      if (geo.type === 'BoxGeometry') uvEmMetros(geo);
      else geometria = uvEmMetrosPorTriangulo(geo);
    }
    const m = new THREE.Mesh(geometria, mat);
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  };
  const caixa = (pai: THREE.Object3D, l: number, a: number, p: number, mat: THREE.Material,
    x: number, y: number, z: number): THREE.Mesh => peca(pai, new THREE.BoxGeometry(l, a, p), mat, x, y, z);
  const macia = (pai: THREE.Object3D, l: number, a: number, p: number, mat: THREE.Material,
    x: number, y: number, z: number, r = 0.02): THREE.Mesh => peca(pai, quina(l, a, p, r), mat, x, y, z);
  /** o vidro é guardado já no quadro da peça, para virar uma malha só no fim */
  const guardarVidro = (q: THREE.Object3D, l: number, a: number, x: number, y: number, z: number): void => {
    const geo = new THREE.BoxGeometry(l, a, 0.012).toNonIndexed();
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(x, y, z).premultiply(q.matrix));
    geo.deleteAttribute('uv');
    vidros.push(geo);
  };
  /** um tubo de `a` até `b` (as varetas do toldo, os pés do suporte) */
  const tubo = (pai: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material): void => {
    const d = b.clone().sub(a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), mat);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    pai.add(m);
  };
  const v3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
  const SEM_GIRO = new THREE.Quaternion();

  // ==================================================================== CHÃO
  // o plinto de pedra dá a volta inteira; na porta, o degrau passa por cima
  peca(g, contorno([[0.12, 0], [0.12, 0.12], [0.07, 0.18], [0, 0.18]], HX, HZ), pedra);
  // o degrau da porta, um tico mais largo que o vão
  // (1 cm abaixo da soleira, e começando onde ela termina: rentes, as duas
  // faces de cima — e as de baixo — dividiam o plano)
  caixa(FRENTE, PORTA.x1 - PORTA.x0 + 0.3, 0.19, 0.34, pedra, (PORTA.x0 + PORTA.x1) / 2, 0.095, 0.17);
  // o piso de dentro, 1 cm enfiado nas paredes
  caixa(g, MEIO * 2 + 0.02, 0.06, DENTRO * 2 + 0.02, piso, 0, Y_PISO - 0.03, 0);

  // ================================================================= PAREDES
  // O rodapé de tijolinho e a parede de reboco são duas malhas: uma termina
  // onde a outra começa, face contra face (o que não briga).
  const paredeLisa = (q: THREE.Object3D, meia: number, furo?: { x0: number; x1: number; y0: number; y1: number }): void => {
    peca(q, extrudar(retangulo(new THREE.Shape(), -meia, 0, meia, Y_TIJOLO), ESP, -ESP), tijolo);
    const cima = retangulo(new THREE.Shape(), -meia, Y_TIJOLO, meia, Y_TOPO);
    if (furo) cima.holes.push(retangulo(new THREE.Path(), furo.x0, furo.y0, furo.x1, furo.y1));
    peca(q, extrudar(cima, ESP, -ESP), parede);
  };
  paredeLisa(DIREITA, HZ, JANELA);
  paredeLisa(FUNDOS, MEIO);
  paredeLisa(ESQUERDA, HZ);

  // a frente: o tijolinho dos dois lados da porta, e a parede de cima com o
  // recorte da porta no contorno (ela toca a borda) e o furo da vitrine
  peca(FRENTE, extrudar(retangulo(new THREE.Shape(), -MEIO, 0, PORTA.x0, Y_TIJOLO), ESP, -ESP), tijolo);
  peca(FRENTE, extrudar(retangulo(new THREE.Shape(), PORTA.x1, 0, MEIO, Y_TIJOLO), ESP, -ESP), tijolo);
  caixa(FRENTE, PORTA.x1 - PORTA.x0, PORTA.y0, ESP, pedra, (PORTA.x0 + PORTA.x1) / 2, PORTA.y0 / 2, -ESP / 2);
  const frente = new THREE.Shape();
  frente.moveTo(-MEIO, Y_TIJOLO);
  frente.lineTo(PORTA.x0, Y_TIJOLO);
  frente.lineTo(PORTA.x0, PORTA.y1);
  frente.lineTo(PORTA.x1, PORTA.y1);
  frente.lineTo(PORTA.x1, Y_TIJOLO);
  frente.lineTo(MEIO, Y_TIJOLO);
  frente.lineTo(MEIO, Y_TOPO);
  frente.lineTo(-MEIO, Y_TOPO);
  frente.closePath();
  frente.holes.push(retangulo(new THREE.Path(), VITRINE.x0, VITRINE.y0, VITRINE.x1, VITRINE.y1));
  peca(FRENTE, extrudar(frente, ESP, -ESP), parede);

  // ================================================================ MOLDURAS
  // a faixa coral entre a loja e a platibanda
  peca(g, contorno([[0, 2.93], [0.05, 2.95], [0.07, 2.97], [0.07, 3.05], [0.05, 3.07], [0, 3.09]], HX, HZ), coral);
  // a cornija e o capeamento, que desce por dentro da platibanda
  peca(g, contorno([
    [0, 3.66], ...cavetinho([0, 3.66], [0.1, 3.8], 4), [0.13, 3.82], [0.13, 3.93], [-0.3, 3.93], [-0.3, 3.87],
  ], HX, HZ), creme);

  // =================================================================== TELHADO
  caixa(g, MEIO * 2 + 0.02, 0.2, DENTRO * 2 + 0.02, teto, 0, Y_LAJE, 0);
  const Y_TELHADO = Y_LAJE + 0.1;
  // a máquina do ar-condicionado, com a grade e a hélice
  macia(g, 0.82, 0.5, 0.62, creme, -2.3, Y_TELHADO + 0.3, -1.0, 0.03);
  caixa(g, 0.86, 0.05, 0.66, metal, -2.3, Y_TELHADO + 0.025, -1.0);
  peca(g, new THREE.CylinderGeometry(0.22, 0.22, 0.02, 20), escuro, -2.3, Y_TELHADO + 0.555, -1.0);
  for (const giro of [0.3, 0.3 + Math.PI / 2]) {
    caixa(g, 0.4, 0.012, 0.06, metal, -2.3, Y_TELHADO + 0.57, -1.0).rotation.y = giro;
  }
  // o respiro: um cano com o chapéu
  peca(g, new THREE.CylinderGeometry(0.06, 0.06, 0.5, 10), metal, 2.7, Y_TELHADO + 0.25, -1.3);
  peca(g, new THREE.ConeGeometry(0.12, 0.08, 10), metal, 2.7, Y_TELHADO + 0.54, -1.3);

  /*
   * O PATINS GIGANTE do telhado, em cima de uma travessa com dois pés: é a
   * placa que diz o que a loja é antes de o letreiro dar para ler. Ele fica
   * de perfil para a câmera (apontando para +X −Z), atrás da platibanda.
   */
  const GIGANTE = v3(0.9, Y_TELHADO, 1.25);
  for (const dz of [-0.32, 0.32]) {
    tubo(g, v3(GIGANTE.x - dz * 0.7, Y_TELHADO, GIGANTE.z + dz * 0.7), v3(GIGANTE.x - dz * 0.7, 4.06, GIGANTE.z + dz * 0.7), 0.045, metal);
  }
  // larga como as rodas, e no comprido do patins
  const travessa = macia(g, 1.45, 0.06, 0.6, coral, GIGANTE.x, 4.09, GIGANTE.z, 0.015);
  travessa.rotation.y = 2.4 - Math.PI / 2;
  const gigante = patinsRetro(P.lojaPatinsCreme, P.lojaPatinsCoral, P.lojaPatinsCoral, P.lojaPatinsAmarelo);
  gigante.scale.setScalar(4.1);
  gigante.position.set(GIGANTE.x, 4.12, GIGANTE.z);
  gigante.rotation.y = 2.4;
  g.add(gigante);

  // ================================================== A PLATIBANDA E O LETREIRO
  const PLACA = { l: 3.9, a: 0.6, y: 3.37 };
  macia(FRENTE, PLACA.l, PLACA.a, 0.06, coral, 0, PLACA.y, 0.02, 0.025);
  const nome = letreiro(PLACA.l - 0.08, PLACA.a - 0.06);
  nome.position.set(0, PLACA.y, 0.056);
  FRENTE.add(nome);
  // as lâmpadas em volta, como letreiro de pista de patinação — na beirada da
  // própria placa: fora dela, as de baixo afundavam na faixa coral
  {
    const passo = 0.21;
    const meiaL = PLACA.l / 2 - 0.04;
    const meiaA = PLACA.a / 2 - 0.04;
    const n = Math.round((meiaL * 2) / passo);
    for (let i = 0; i <= n; i++) {
      const x = -meiaL + (i / n) * meiaL * 2;
      for (const y of [-meiaA, meiaA]) lampadas.por(FRENTE, v3(x, PLACA.y + y, 0.062), SEM_GIRO, 0.026);
    }
    for (const x of [-meiaL, meiaL]) {
      for (const y of [-meiaA / 3, meiaA / 3]) lampadas.por(FRENTE, v3(x, PLACA.y + y, 0.062), SEM_GIRO, 0.026);
    }
  }

  // ================================================================== A VITRINE
  {
    const W = VITRINE.x1 - VITRINE.x0;
    const BARRA = 0.06;
    const Z = -0.12;
    // o caixilho: as deitadas de ponta a ponta, as de pé entre elas, e os
    // montantes um tico mais rasos (a face da frente não casa com a deles)
    caixa(FRENTE, W + 0.02, BARRA + 0.01, 0.09, creme, VITRINE.x0 + W / 2, VITRINE.y1 - BARRA / 2 + 0.005, Z);
    caixa(FRENTE, W + 0.02, BARRA + 0.01, 0.09, creme, VITRINE.x0 + W / 2, VITRINE.y0 + BARRA / 2 - 0.005, Z);
    const altoDentro = VITRINE.y1 - VITRINE.y0 - BARRA * 2;
    const yMeio = (VITRINE.y0 + VITRINE.y1) / 2;
    for (const x of [VITRINE.x0 + BARRA / 2 - 0.005, VITRINE.x1 - BARRA / 2 + 0.005]) {
      caixa(FRENTE, BARRA + 0.01, altoDentro, 0.09, creme, x, yMeio, Z);
    }
    const panos = 3;
    for (let i = 1; i < panos; i++) caixa(FRENTE, 0.05, altoDentro, 0.08, creme, VITRINE.x0 + (W * i) / panos, yMeio, Z);
    guardarVidro(FRENTE, W - BARRA, altoDentro + 0.02, VITRINE.x0 + W / 2, yMeio, Z);
    // o peitoril de pedra, enfiado 2 cm na parede
    caixa(FRENTE, W + 0.16, 0.06, 0.12, pedra, VITRINE.x0 + W / 2, VITRINE.y0 - 0.02, 0.04);

    // a floreira embaixo da vitrine, nas duas mãos-francesas
    const cx = VITRINE.x0 + W / 2;
    macia(FRENTE, W - 0.1, 0.36, 0.3, creme, cx, 0.43, 0.14, 0.025);
    caixa(FRENTE, W - 0.18, 0.04, 0.22, terra, cx, 0.6, 0.14);
    for (const x of [VITRINE.x0 + 0.35, VITRINE.x1 - 0.35]) {
      tubo(FRENTE, v3(x, 0.2, 0.0), v3(x, 0.255, 0.22), 0.02, metal);
    }
    const ROSAS = [P.flowerPink, P.lojaPatinsCoral, P.flowerYellow, P.lojaPatinsCreme];
    const VERDES = [P.leafMid, P.leafLight, P.leafDark];
    for (let i = 0; i < 46; i++) {
      const x = VITRINE.x0 + 0.12 + rnd() * (W - 0.24);
      const z = 0.06 + rnd() * 0.16;
      const dir = v3(rnd() - 0.5, 0.6 + rnd() * 0.6, rnd() * 0.6 + 0.2).normalize();
      const orienta = new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), dir);
      orienta.multiply(new THREE.Quaternion().setFromAxisAngle(v3(0, 0, 1), (rnd() - 0.5) * 1.6));
      folhas.por(FRENTE, v3(x, 0.62, z), orienta, 0.07 + rnd() * 0.04, VERDES[i % VERDES.length]);
    }
    for (let i = 0; i < 26; i++) {
      const x = VITRINE.x0 + 0.16 + (i / 25) * (W - 0.32) + (rnd() - 0.5) * 0.08;
      // a partir de 12 cm da parede: mais perto, a flor furava o peitoril
      const p = v3(x, 0.66 + rnd() * 0.07, 0.12 + rnd() * 0.12);
      const normal = v3((rnd() - 0.5) * 0.6, 1, 0.5 + rnd() * 0.4).normalize();
      const orienta = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), normal);
      orienta.multiply(new THREE.Quaternion().setFromAxisAngle(v3(0, 1, 0), rnd() * Math.PI * 2));
      const tam = 0.045 + rnd() * 0.02;
      const corFlor = ROSAS[Math.floor(rnd() * ROSAS.length)];
      flores.por(FRENTE, p, orienta, tam, corFlor);
      miolos.por(FRENTE, p.clone().addScaledVector(normal, tam * 0.12), SEM_GIRO, tam * 0.26,
        corFlor === P.flowerYellow ? P.woodDark : P.flowerYellow);
    }
  }

  // =================================================================== A PORTA
  {
    const L = PORTA.x1 - PORTA.x0;
    const cx = (PORTA.x0 + PORTA.x1) / 2;
    const Z = -0.12;
    // o batente: a de cima de ponta a ponta, as de pé embaixo dela
    caixa(FRENTE, L + 0.02, 0.07, 0.1, creme, cx, PORTA.y1 - 0.03, Z);
    const altoBatente = PORTA.y1 - 0.065 - PORTA.y0;
    for (const x of [PORTA.x0 + 0.03, PORTA.x1 - 0.03]) caixa(FRENTE, 0.07, altoBatente, 0.1, creme, x, PORTA.y0 + altoBatente / 2, Z);
    // a folha coral com o vidro: montantes e travessas, e o chute de metal
    const LF = L - 0.12;
    const topo = PORTA.y1 - 0.07;
    // a folha tem a fresta de 1 cm embaixo (rente, o pé dela dividia o plano
    // com o do batente)
    const PE = PORTA.y0 + 0.01;
    const alto = topo - PE;
    const ZF = Z + 0.02;
    for (const x of [cx - LF / 2 + 0.045, cx + LF / 2 - 0.045]) caixa(FRENTE, 0.09, alto, 0.05, coral, x, PE + alto / 2, ZF);
    caixa(FRENTE, LF - 0.18, 0.1, 0.05, coral, cx, topo - 0.05, ZF);
    caixa(FRENTE, LF - 0.18, 0.3, 0.05, coral, cx, PE + 0.15, ZF);
    caixa(FRENTE, LF - 0.22, 0.2, 0.012, metal, cx, PE + 0.14, ZF + 0.031);
    guardarVidro(FRENTE, LF - 0.16, alto - 0.38, cx, PE + 0.3 + (alto - 0.4) / 2, ZF);
    // o puxador de barra, com os dois apoios
    const yBarra = 1.05;
    tubo(FRENTE, v3(cx - 0.3, yBarra, ZF + 0.075), v3(cx + 0.3, yBarra, ZF + 0.075), 0.018, metal);
    for (const x of [cx - 0.26, cx + 0.26]) tubo(FRENTE, v3(x, yBarra, ZF + 0.02), v3(x, yBarra, ZF + 0.075), 0.012, metal);
    // a plaquinha de "ABERTO", pendurada num cordão em V
    const aberto = placaDeTexto('ABERTO', 0.36, 0.14, P.lojaPatinsCreme, P.lojaPatinsCoral);
    aberto.position.set(cx, 1.62, ZF + 0.034);
    FRENTE.add(aberto);
    for (const lado of [-1, 1]) {
      tubo(FRENTE, v3(cx + lado * 0.14, 1.69, ZF + 0.033), v3(cx, 1.8, ZF + 0.033), 0.004, escuro);
    }
    peca(FRENTE, new THREE.SphereGeometry(0.012, 8, 6), metal, cx, 1.8, ZF + 0.03);
  }

  // =================================================================== TOLDOS
  /*
   * O TOLDO de lona listrada: a lona embarriga um tico para fora e cede entre
   * as varetas; a saia é recortada em meia-lua, uma por listra (o `x` em
   * metros é o `u` da lona e da saia, então a listra continua da lona para a
   * saia). `x0` e `x1` caem em múltiplos de 25 cm, que é a largura da listra.
   */
  const toldo = (q: THREE.Object3D, x0: number, x1: number, yAlto: number, yBaixo: number, avanco: number, saia: number): void => {
    const W = x1 - x0;
    const varetas = Math.max(2, Math.round(W / 1.6) + 1);
    const nx = Math.round(W / 0.125);
    const ns = 6;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const comprimento = Math.hypot(avanco, yAlto - yBaixo);
    // a normal da lona (para fora e para cima)
    const nz = (yAlto - yBaixo) / comprimento;
    const ny = avanco / comprimento;
    for (let j = 0; j <= ns; j++) {
      const t = j / ns;
      for (let i = 0; i <= nx; i++) {
        const x = x0 + (i / nx) * W;
        const entre = (x - x0) / (W / (varetas - 1));
        const cede = Math.abs(Math.sin(entre * Math.PI)) * 0.025 * Math.sin(t * Math.PI);
        const barriga = Math.sin(t * Math.PI) * 0.035 - cede;
        pos.push(x, yAlto + (yBaixo - yAlto) * t + ny * barriga, avanco * t + nz * barriga);
        uv.push(x, t * comprimento);
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
    const pano = new THREE.Mesh(geo, lona);
    q.add(pano);

    // a saia em meia-lua
    const r = 0.125;
    const corpo = saia - r;
    const forma = new THREE.Shape();
    forma.moveTo(x0, 0);
    forma.lineTo(x1, 0);
    forma.lineTo(x1, -corpo);
    const n = Math.round(W / (r * 2));
    for (let i = n - 1; i >= 0; i--) forma.absarc(x0 + (i + 0.5) * r * 2, -corpo, r, 0, Math.PI, true);
    forma.lineTo(x0, 0);
    const saiaGeo = new THREE.ExtrudeGeometry(forma, { depth: 0.01, bevelEnabled: false, curveSegments: 6 });
    const m = new THREE.Mesh(saiaGeo, lona);
    m.position.set(0, yBaixo + 0.005, avanco - 0.005);
    q.add(m);

    // as abas dos lados, um triângulo de lona em cada ponta
    for (const x of [x0, x1]) {
      const aba = new THREE.Shape();
      aba.moveTo(0, yAlto);
      aba.lineTo(avanco, yBaixo);
      aba.lineTo(avanco, yBaixo - corpo);
      aba.lineTo(0, yAlto - 0.06);
      aba.closePath();
      const abaGeo = new THREE.ShapeGeometry(aba);
      abaGeo.rotateY(-Math.PI / 2);
      const abaM = new THREE.Mesh(abaGeo, lona);
      abaM.position.x = x + (x === x0 ? -0.006 : 0.006);
      q.add(abaM);
    }
    // o trilho na parede e as varetas que seguram a ponta
    caixa(q, W + 0.06, 0.06, 0.06, creme, x0 + W / 2, yAlto + 0.02, 0.02);
    for (let k = 0; k < varetas; k++) {
      const x = x0 + 0.04 + (k / (varetas - 1)) * (W - 0.08);
      // o braço corre por baixo da lona (descendo da parede, ele pousava no vidro)
      tubo(q, v3(x, yAlto - 0.08, 0.005), v3(x, yBaixo - 0.02, avanco - 0.03), 0.014, metal);
    }
  };
  toldo(FRENTE, -3.25, 3.25, 2.92, 2.66, 0.58, 0.16);
  toldo(DIREITA, -1.75, 1.25, 2.68, 2.5, 0.4, 0.12);

  // =========================================================== A JANELA DO ALUGUEL
  {
    const W = JANELA.x1 - JANELA.x0;
    const cx = (JANELA.x0 + JANELA.x1) / 2;
    const Z = -0.12;
    caixa(DIREITA, W + 0.02, 0.07, 0.09, creme, cx, JANELA.y1 - 0.03, Z);
    const alto = JANELA.y1 - 0.065 - JANELA.y0;
    for (const x of [JANELA.x0 + 0.03, JANELA.x1 - 0.03]) caixa(DIREITA, 0.07, alto, 0.09, creme, x, JANELA.y0 + alto / 2, Z);
  }

  // ===================================================== O BALCÃO DO ALUGUEL (+X)
  {
    const B = LOJA_DE_PATINS.balcao;
    const CORPO_X1 = 4.55;
    // o corpo coral, 1 cm enfiado na parede, e o rodapé escuro
    macia(g, CORPO_X1 - (HX - 0.01), 0.96, 3.2, coral, (CORPO_X1 + HX - 0.01) / 2, 0.48, B.z, 0.02);
    caixa(g, CORPO_X1 - HX + 0.05, 0.08, 3.24, escuro, (CORPO_X1 + HX) / 2 + 0.01, 0.04, B.z);
    // as ripas creme na frente
    for (let z = B.z - 1.5; z <= B.z + 1.5 + 1e-6; z += 0.1) caixa(g, 0.03, 0.78, 0.065, creme, CORPO_X1 + 0.01, 0.51, z);
    // o tampo de madeira, que avança sobre as ripas e entra pela janela
    macia(g, 1.02, 0.07, 3.36, madeira, 4.16, 0.995, B.z, 0.02);
    // a placa do aluguel nas ripas
    const placa = placaDeTexto('ALUGUEL', 1.3, 0.3, P.lojaPatinsCreme, P.lojaPatinsCoral);
    placa.rotation.y = Math.PI / 2;
    placa.position.set(CORPO_X1 + 0.048, 0.6, B.z);
    g.add(placa);
    caixa(g, 0.02, 0.34, 1.34, coral, CORPO_X1 + 0.031, 0.6, B.z);
    // a sineta (a cena toca o "plim" dela quando entrega os patins)
    const Y_TAMPO = 1.03;
    peca(g, new THREE.CylinderGeometry(0.05, 0.056, 0.02, 14), escuro, 4.3, Y_TAMPO + 0.01, B.z + 1.3);
    peca(g, new THREE.SphereGeometry(0.046, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), dourado, 4.3, Y_TAMPO + 0.018, B.z + 1.3);
    peca(g, new THREE.CylinderGeometry(0.008, 0.008, 0.03, 8), dourado, 4.3, Y_TAMPO + 0.07, B.z + 1.3);
    peca(g, new THREE.SphereGeometry(0.014, 8, 6), dourado, 4.3, Y_TAMPO + 0.088, B.z + 1.3);
    // dois pares no tampo, prontos para levar
    [[-0.85, 1], [0.25, 0]].forEach(([dz, k]) => {
      const [c, cr, cra] = PARES[k];
      const par = parDePatins(c, cr, cra);
      par.position.set(4.22, Y_TAMPO, B.z + dz);
      par.rotation.y = Math.PI / 2 + 0.25;
      g.add(par);
    });
  }

  // ================================================== O ESCANINHO (pela janela)
  {
    /*
     * Visto pela janela do aluguel: oito casas de madeira, cada uma com um par
     * e o número embaixo. Fica a 26 cm da parede, de frente para o +X: mais
     * fundo que isso e a câmera, que vem de cima, só via a fileira de baixo.
     */
    const q = new THREE.Group();
    q.position.set(2.84, 0, 0);
    q.rotation.y = Math.PI / 2;
    q.updateMatrix();
    g.add(q);
    const X0 = -1.4;
    const X1 = 1.0;
    const Y0 = 1.06;
    const Y1 = 2.14;
    const FIO = 0.04;
    const colunas = 4;
    const linhas = 2;
    const lc = (X1 - X0 - FIO * (colunas + 1)) / colunas;
    const lr = (Y1 - Y0 - FIO * (linhas + 1)) / linhas;
    const forma = retangulo(new THREE.Shape(), X0, Y0, X1, Y1);
    for (let i = 0; i < colunas; i++) {
      for (let j = 0; j < linhas; j++) {
        const x = X0 + FIO + i * (lc + FIO);
        const y = Y0 + FIO + j * (lr + FIO);
        forma.holes.push(retangulo(new THREE.Path(), x, y, x + lc, y + lr));
        const [c, cr, cra] = PARES[(i + j * colunas) % PARES.length];
        const par = parDePatins(c, cr, cra, 0.95);
        par.position.set(x + lc / 2, y, 0.17);
        q.add(par);
      }
    }
    peca(q, extrudar(forma, 0.36, 0), madeira);
    caixa(q, X1 - X0, Y1 - Y0, 0.02, creme, (X0 + X1) / 2, (Y0 + Y1) / 2, -0.01);
    const numeros = [['34', '35', '36', '37'], ['38', '39', '40', '41']];
    numeros.forEach((linha, j) => {
      const fita = etiquetas(linha, X1 - X0 - 0.04, 0.034);
      fita.position.set((X0 + X1) / 2, Y0 + FIO / 2 + j * (lr + FIO), 0.364);
      q.add(fita);
    });
  }

  // ========================================== LÁ DENTRO, VISTO PELA VITRINE
  {
    // o tablado da vitrine
    const TAB = { x: 0.75, l: 4.3, a: 0.42, z: 1.6, p: 0.62 };
    const yTab = Y_PISO + TAB.a;
    macia(g, TAB.l, TAB.a, TAB.p, creme, TAB.x, Y_PISO + TAB.a / 2, TAB.z, 0.025);
    caixa(g, TAB.l - 0.06, 0.05, 0.012, coral, TAB.x, Y_PISO + TAB.a - 0.09, TAB.z + TAB.p / 2 + 0.002);
    // o pedestal torneado com o patins da vez
    peca(g, new THREE.LatheGeometry([
      new THREE.Vector2(0.0001, 0), new THREE.Vector2(0.2, 0), new THREE.Vector2(0.2, 0.04),
      new THREE.Vector2(0.14, 0.07), new THREE.Vector2(0.12, 0.2), new THREE.Vector2(0.17, 0.24),
      new THREE.Vector2(0.17, 0.27), new THREE.Vector2(0.0001, 0.27),
    ], 20), coral, 2.25, yTab, TAB.z);
    const daVez = patinsRetro(P.lojaPatinsAmarelo, P.lojaPatinsCoral, P.lojaPatinsPisoEscuro, P.lojaPatinsCreme);
    daVez.scale.setScalar(1.15);
    daVez.position.set(2.25, yTab + 0.27, TAB.z);
    daVez.rotation.y = 0.9;
    g.add(daVez);
    // um par no tablado, de lado
    const [c, cr, cra] = PARES[3];
    const par = parDePatins(c, cr, cra);
    par.position.set(1.2, yTab, TAB.z + 0.02);
    par.rotation.y = -0.5;
    g.add(par);
    // os capacetes: meia bola com a faixa e a viseira
    [[-0.95, P.lojaPatinsCoral], [-0.45, P.lojaPatinsParede], [0.05, P.lojaPatinsAmarelo]].forEach(([x, corCapacete], i) => {
      const cap = new THREE.Group();
      const casco = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), toon(corCapacete));
      casco.scale.set(1, 0.92, 1.12);
      cap.add(casco);
      const faixa = new THREE.Mesh(new THREE.TorusGeometry(0.128, 0.012, 6, 20), creme);
      faixa.rotation.x = Math.PI / 2;
      faixa.scale.set(1, 1.12, 1);
      faixa.position.y = 0.012;
      cap.add(faixa);
      const viseira = new THREE.Mesh(quina(0.16, 0.014, 0.06, 0.006), escuro);
      viseira.position.set(0, 0.02, 0.15);
      viseira.rotation.x = 0.25;
      cap.add(viseira);
      cap.position.set(x, yTab, TAB.z - 0.05 + (i % 2) * 0.1);
      cap.rotation.y = 0.5 - i * 0.3;
      g.add(cap);
    });

    // a parede de exposição: painel de madeira com ripas e prateleirinhas
    const EXP = { x: 0.75, l: 3.6, a: 1.72, z: 0.92 };
    macia(g, EXP.l, EXP.a, 0.08, madeira, EXP.x, Y_PISO + EXP.a / 2, EXP.z, 0.02);
    for (let y = Y_PISO + 0.22; y < Y_PISO + EXP.a - 0.1; y += 0.22) {
      caixa(g, EXP.l - 0.04, 0.03, 0.02, creme, EXP.x, y, EXP.z + 0.045);
    }
    for (const x of [EXP.x - EXP.l / 2 + 0.3, EXP.x + EXP.l / 2 - 0.3]) {
      caixa(g, 0.1, 0.06, 0.5, escuro, x, Y_PISO + 0.03, EXP.z);
    }
    let k = 0;
    for (const y of [Y_PISO + 0.62, Y_PISO + 1.06]) {
      for (const x of [EXP.x - 1.15, EXP.x, EXP.x + 1.15]) {
        caixa(g, 0.36, 0.025, 0.2, creme, x, y, EXP.z + 0.14);
        const [pc, pr, pra] = PARES[(k++ + 4) % PARES.length];
        const p = parDePatins(pc, pr, pra, 0.9);
        p.position.set(x, y + 0.0125, EXP.z + 0.14);
        g.add(p);
      }
    }

    // a luz da loja, pintada: a poça no chão e o leque na parede de exposição
    // (do tamanho da loja: maior, a poça saía pela parede e acendia a calçada)
    const poca = pocaDeLuz(1.0, P.luzDoPortao, 0.26);
    poca.position.set(0.75, Y_PISO + 0.004, 0.98);
    g.add(poca);
    const leque = pocaDeLuz(1.3, P.luzDoPortao, 0.18, true);
    leque.position.set(EXP.x, Y_PISO + 1.0, EXP.z + 0.065);
    g.add(leque);
  }

  // ================================================================ OS LOTES
  flores.montar(g);
  miolos.montar(g);
  folhas.montar(g);
  lampadas.montar(g);
  for (const im of g.children.slice(-4)) im.userData.semSombra = true;

  /*
   * O VIDRO da loja inteira numa malha só (transparente não entra na
   * `fundir()`), desenhado DEPOIS da luz pintada lá de dentro: o vidro grava
   * profundidade, e pintado antes ele apagaria a poça atrás dele.
   */
  if (vidros.length) {
    const geo = vidros.length === 1 ? vidros[0] : mergeSimples(vidros);
    const todoVidro = new THREE.Mesh(geo, vidro);
    todoVidro.renderOrder = 4;
    todoVidro.userData.semSombra = true;
    g.add(todoVidro);
  }
  return g;
}

/** junta geometrias já sem índice e sem UV (o vidro) numa só */
function mergeSimples(lista: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const nor: number[] = [];
  for (const geo of lista) {
    pos.push(...(geo.getAttribute('position').array as Float32Array));
    nor.push(...(geo.getAttribute('normal').array as Float32Array));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return geo;
}
