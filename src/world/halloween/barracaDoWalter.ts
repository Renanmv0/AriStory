import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { acesoPorVertice, brilhoEmLote, toon } from '../../core/materials';
import { quina } from '../lojaDeRoupas';
import { acabar, uvDeParede } from '../acabamento';
import { inoxEscovado, toalhaXadrez, veioDeMadeira } from '../texturasDeCasa';
import { novaTextura, sorteio } from '../texturasDeChao';
import { pocaDeLuz } from '../furniture';
import { canvasComLetra, haste, Juntar } from './carrinhoDePocoes';
import type { AboboraNoLote } from './abobora';

/*
 * A BARRAQUINHA DE CACHORRO-QUENTE DO WALTER, na praça da roda durante o
 * especial de Halloween (pedido do Renan: "bem detalhada e bonita"). Ela já
 * está montada quando o parque amanhece enfeitado; o Walter chega depois,
 * com o ônibus da festa.
 *
 * Uma barraca de rua de madeira vermelha com o friso creme, em cima de um
 * estradinho: o painel da frente pintado à mão ("Cachorro-quente do
 * Walter", o cachorro-quente desenhado e as patinhas), o toldo de duas
 * águas listrado de vermelho e creme com o lambrequim de ondas e os pompons
 * mostarda, e o CACHORRO-QUENTE GIGANTE em cima da cumeeira — com carinha e
 * uma faixa de múmia, porque o Walter vem de múmia. No balcão: a chapa de
 * inox com as salsichas rolando e as SALSICHAS-MÚMIA (enroladas na massa,
 * com os olhinhos), o vapor subindo, a espátula; a fileira de cubas de
 * complemento (batata palha, milho, ervilha, vinagrete e purê); as bisnagas
 * de ketchup, mostarda e maionese; o porta-guardanapo; dois cachorros-quentes
 * prontos na barquinha de papel xadrez; o pote de ossinhos; o sininho de
 * chamar. Atrás, a lousa do cardápio em giz e, do lado, a prateleirinha com
 * a cesta de pães. A lâmpada pendurada embaixo do toldo e a poça de luz
 * quente na frente.
 *
 * QUEM TRABALHA NELA fica ATRÁS do balcão (`posto`), e por isso o toldo é
 * alto e o beiral da frente é curto: a regra do posto ("nada acima e à
 * frente de quem trabalha") com a conta da câmera de 34° — com a beira em
 * 2,35 e 15 cm de beiral à frente do balcão, a cabeça de quem está atrás
 * aparece por baixo dele.
 *
 * O contrato do kit: base em `y = 0`, a frente (o balcão) olhando para `+Z`,
 * e a cena passa pela `fundir()`. As abóboras não moram aqui (a peça diz
 * onde ficam, em `aboboras`, e a cena as põe no lote do parque). `aberta`
 * diz se ela tem comida no balcão e a luz acesa (a festa) ou se está com o
 * balcão vazio, esperando o pano de "fechado" (o pôr do sol do convite).
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** a barraca: a largura, a frente do balcão, o fundo, a altura do tampo, o estrado */
const B = { largura: 2.2, frente: 0.42, fundo: -0.62, balcao: 1.02, estrado: 0.08 };
/** o toldo: a beira (frente e fundo), a cumeeira e a largura com o beiral dos lados */
const T = { beira: 2.35, frente: 0.6, fundo: -0.8, cumeeira: 2.78, zCumeeira: -0.1, largura: 2.5 };
/** a altura do toldo num ponto `z` (duas águas) */
const alturaDoToldo = (z: number): number => z >= T.zCumeeira
  ? T.cumeeira - ((z - T.zCumeeira) / (T.frente - T.zCumeeira)) * (T.cumeeira - T.beira)
  : T.cumeeira - ((T.zCumeeira - z) / (T.zCumeeira - T.fundo)) * (T.cumeeira - T.beira);

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

const FONTE_FORMA = '"Kalam", "Segoe Print", "Comic Sans MS", cursive';
const FONTE_REDONDA = '"Caveat", "Segoe Print", "Bradley Hand", cursive';

// ================================================================ as texturas

/** as tábuas em pé pintadas de vermelho, com a junta escura, o filete de luz e a pincelada */
function tabuasVermelhas(): THREE.CanvasTexture {
  return novaTextura('walter:tabuas', 0.6, (c, s) => {
    const rnd = sorteio(3131);
    c.fillStyle = css(P.barracaVermelho);
    c.fillRect(0, 0, s, s);
    const tabuas = 5;
    const passo = s / tabuas;
    for (let t = 0; t < tabuas; t++) {
      const x0 = t * passo;
      c.fillStyle = `rgba(${rnd() < 0.5 ? '0,0,0' : '255,255,255'},${0.03 + rnd() * 0.04})`;
      c.fillRect(x0, 0, passo, s);
      for (let k = 0; k < 6; k++) {
        c.strokeStyle = `rgba(80,10,15,${0.06 + rnd() * 0.08})`;
        c.lineWidth = 1.5;
        const x = x0 + 4 + rnd() * (passo - 8);
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x + (rnd() - 0.5) * 3, s);
        c.stroke();
      }
      c.fillStyle = css(P.barracaVermelhoFundo);
      c.fillRect(x0, 0, 4, s);
      c.fillStyle = 'rgba(255,235,220,0.22)';
      c.fillRect(x0 + 4, 0, 2, s);
    }
  });
}

/** a lona listrada do toldo: vermelho e creme, com a costura e a dobra */
let lona: THREE.CanvasTexture | null = null;
function lonaListrada(): THREE.CanvasTexture {
  if (lona) return lona;
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 64;
  const c = cv.getContext('2d');
  if (c) {
    const faixas = 10;
    const w = 512 / faixas;
    for (let i = 0; i < faixas; i++) {
      c.fillStyle = css(i % 2 ? P.barracaCreme : P.barracaVermelho);
      c.fillRect(i * w, 0, w + 1, 64);
      const g = c.createLinearGradient(i * w, 0, (i + 1) * w, 0);
      g.addColorStop(0, 'rgba(0,0,0,0.1)');
      g.addColorStop(0.5, 'rgba(255,255,255,0.05)');
      g.addColorStop(1, 'rgba(0,0,0,0.1)');
      c.fillStyle = g;
      c.fillRect(i * w, 0, w, 64);
      c.fillStyle = 'rgba(120,40,30,0.35)';
      for (let y = 3; y < 64; y += 8) c.fillRect(i * w + 2, y, 2, 4);
    }
  }
  lona = new THREE.CanvasTexture(cv);
  lona.colorSpace = THREE.SRGBColorSpace;
  lona.anisotropy = 4;
  return lona;
}

/** um cachorro-quente desenhado (o painel e a lousa): o pão, a salsicha e a mostarda em zigue-zague */
function desenharCachorroQuente(c: CanvasRenderingContext2D, x: number, y: number, l: number, contorno: string, comCara = false): void {
  const a = l * 0.32;
  c.lineWidth = Math.max(3, l * 0.03);
  c.strokeStyle = contorno;
  // a salsicha, saindo dos dois lados do pão
  c.fillStyle = css(P.salsicha);
  c.beginPath();
  c.ellipse(x, y - a * 0.15, l * 0.55, a * 0.32, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // o pão: a meia-lua de baixo
  c.fillStyle = css(P.paoDeCachorro);
  c.beginPath();
  c.ellipse(x, y, l * 0.46, a * 0.42, 0, 0, Math.PI);
  c.closePath();
  c.fill();
  c.stroke();
  // a mostarda
  c.strokeStyle = css(P.molhoMostarda);
  c.lineWidth = Math.max(3, l * 0.035);
  c.beginPath();
  for (let i = 0; i <= 8; i++) {
    const px = x - l * 0.4 + (i / 8) * l * 0.8;
    const py = y - a * 0.22 + (i % 2 ? -1 : 1) * a * 0.12;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.stroke();
  if (comCara) {
    c.fillStyle = '#2b1a14';
    for (const s of [-1, 1]) {
      c.beginPath();
      c.arc(x + l * 0.4 + s * l * 0.04, y - a * 0.24, l * 0.022, 0, Math.PI * 2);
      c.fill();
    }
  }
}

/** a patinha (o Walter assina com ela) */
function desenharPata(c: CanvasRenderingContext2D, x: number, y: number, r: number, cor: string): void {
  c.fillStyle = cor;
  c.beginPath();
  c.ellipse(x, y + r * 0.35, r * 0.62, r * 0.5, 0, 0, Math.PI * 2);
  c.fill();
  for (const [dx, dy] of [[-0.62, -0.25], [-0.22, -0.62], [0.22, -0.62], [0.62, -0.25]] as const) {
    c.beginPath();
    c.ellipse(x + dx * r, y + dy * r, r * 0.22, r * 0.28, dx * 0.4, 0, Math.PI * 2);
    c.fill();
  }
}

/** o painel da frente: a placa creme de canto redondo, o título, o cachorro-quente e as patinhas */
function painelDoWalter(): THREE.CanvasTexture {
  const L = 760;
  const A = 300;
  return canvasComLetra(L, A, (c) => {
    const caminho = (m: number, r: number): void => {
      c.beginPath();
      c.moveTo(m + r, m);
      c.arcTo(L - m, m, L - m, A - m, r);
      c.arcTo(L - m, A - m, m, A - m, r);
      c.arcTo(m, A - m, m, m, r);
      c.arcTo(m, m, L - m, m, r);
      c.closePath();
    };
    caminho(4, 40);
    c.fillStyle = css(P.barracaCreme);
    c.fill();
    c.lineWidth = 8;
    c.strokeStyle = css(P.barracaMostarda);
    caminho(18, 30);
    c.stroke();
    const rnd = sorteio(77);
    for (let i = 0; i < 22; i++) {
      c.fillStyle = `rgba(170,110,60,${0.03 + rnd() * 0.04})`;
      c.beginPath();
      c.arc(30 + rnd() * (L - 60), 30 + rnd() * (A - 60), 10 + rnd() * 30, 0, Math.PI * 2);
      c.fill();
    }
    const tinta = css(P.barracaVermelhoFundo);
    c.textAlign = 'center';
    c.textBaseline = 'alphabetic';
    c.font = `700 74px ${FONTE_FORMA}`;
    c.lineWidth = 10;
    c.strokeStyle = css(P.barracaCreme);
    c.strokeText('Cachorro-quente', L / 2, 98);
    c.fillStyle = css(P.barracaVermelho);
    c.fillText('Cachorro-quente', L / 2, 98);
    c.font = `700 50px ${FONTE_REDONDA}`;
    c.fillStyle = tinta;
    c.fillText('do Walter', L / 2, 150);
    desenharCachorroQuente(c, L / 2, 224, 260, tinta, true);
    desenharPata(c, 86, 214, 34, css(P.barracaVermelho));
    desenharPata(c, L - 86, 214, 34, css(P.barracaVermelho));
    c.font = `700 30px ${FONTE_REDONDA}`;
    c.fillStyle = tinta;
    c.fillText('au!', 86, 278);
    c.fillText('au!', L - 86, 278);
  });
}

/** a lousa do cardápio, a giz: os cachorros-quentes da casa e o da festa */
function lousaDoCardapio(): THREE.CanvasTexture {
  const L = 560;
  const A = 300;
  return canvasComLetra(L, A, (c) => {
    c.fillStyle = css(P.placaDeLousa);
    c.fillRect(0, 0, L, A);
    const rnd = sorteio(919);
    for (let i = 0; i < 1300; i++) {
      c.fillStyle = `rgba(240,244,236,${0.03 + rnd() * 0.06})`;
      c.fillRect(Math.floor(rnd() * L), Math.floor(rnd() * A), 2, 2);
    }
    const giz = css(P.giz);
    c.fillStyle = giz;
    c.strokeStyle = giz;
    c.textAlign = 'center';
    c.font = `700 46px ${FONTE_FORMA}`;
    c.fillText('CARDÁPIO', L / 2, 54);
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(150, 66);
    c.quadraticCurveTo(L / 2, 76, L - 150, 64);
    c.stroke();
    c.textAlign = 'left';
    const linhas: Array<[string, string]> = [
      ['Simples', css(P.giz)],
      ['Completo', css(P.giz)],
      ['Duplo do Walter', css(P.giz)],
      ['Salsicha-múmia', css(P.barracaMostarda)],
    ];
    linhas.forEach(([t, cor], i) => {
      const y = 112 + i * 46;
      c.fillStyle = cor;
      c.font = `700 36px ${FONTE_REDONDA}`;
      c.fillText(t, 60, y);
      c.beginPath();
      c.arc(40, y - 11, 6, 0, Math.PI * 2);
      c.fill();
    });
    c.fillStyle = css(P.barracaMostarda);
    c.font = `700 26px ${FONTE_REDONDA}`;
    c.textAlign = 'right';
    c.fillText('só hoje!', L - 40, 112 + 3 * 46 + 30);
    desenharCachorroQuente(c, L - 120, 160, 150, giz);
    desenharPata(c, L - 60, 70, 16, giz);
  });
}

// ============================================================ as peças miúdas

/** a casca do pão, de cima: meio cilindro deitado com as pontas arredondadas (`x` é o comprimento) */
function geoMeioPao(comprimento: number, raio: number): THREE.BufferGeometry {
  const g = new THREE.CapsuleGeometry(raio, comprimento - raio * 2, 4, 10);
  g.rotateZ(Math.PI / 2);
  g.scale(1, 0.85, 0.62);
  return g;
}

/** a salsicha deitada (`x` é o comprimento) */
function geoSalsicha(comprimento: number, raio: number): THREE.BufferGeometry {
  const g = new THREE.CapsuleGeometry(raio, comprimento - raio * 2, 4, 8);
  g.rotateZ(Math.PI / 2);
  return g;
}

/** um zigue-zague de molho por cima de um cachorro-quente, de `x0` a `x1` */
function zigueZague(x0: number, x1: number, y: number, z: number, amplitude: number, voltas: number, raio: number): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= voltas * 2; i++) {
    pts.push(new THREE.Vector3(x0 + ((x1 - x0) * i) / (voltas * 2), y, z + (i % 2 ? amplitude : -amplitude)));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3), voltas * 8, raio, 5, false);
}

/** o ossinho de biscoito: o palito e as quatro bolinhas das pontas */
function geoOssinho(): THREE.BufferGeometry[] {
  const partes: THREE.BufferGeometry[] = [new THREE.CylinderGeometry(0.007, 0.007, 0.045, 6).rotateZ(Math.PI / 2)];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) partes.push(new THREE.SphereGeometry(0.009, 6, 4).translate(sx * 0.024, 0, sz * 0.006));
  return partes;
}

/**
 * Um cachorro-quente pronto na barquinha de papel xadrez: o pão, a salsicha,
 * a mostarda e o ketchup, e a batata palha por cima. Origem no fundo da
 * barquinha, o comprimento em `x`.
 */
function cachorroQuentePronto(): THREE.Group {
  const g = new THREE.Group();
  const papel = toon(0xffffff, { mapa: toalhaXadrez(0.05, P.barracaVermelho), doubleSide: true });
  // a barquinha: o fundo e as quatro abas abrindo para fora
  por(g, new THREE.PlaneGeometry(0.2, 0.07).rotateX(-Math.PI / 2), papel, 0, 0.002, 0);
  for (const s of [-1, 1]) {
    const lado = por(g, new THREE.PlaneGeometry(0.2, 0.04), papel, 0, 0.018, s * 0.04);
    lado.rotation.x = s * 0.45;
    const ponta = por(g, new THREE.PlaneGeometry(0.075, 0.04), papel, s * 0.104, 0.018, 0);
    ponta.rotation.y = Math.PI / 2;
    ponta.rotation.x = -s * 0.45;
  }
  const pao = toon(P.paoDeCachorro);
  for (const s of [-1, 1]) por(g, geoMeioPao(0.2, 0.026), pao, 0, 0.026, s * 0.017);
  por(g, geoSalsicha(0.23, 0.016), toon(P.salsicha), 0, 0.04, 0);
  por(g, zigueZague(-0.08, 0.08, 0.056, 0, 0.01, 5, 0.0035), toon(P.molhoMostarda));
  por(g, zigueZague(-0.07, 0.085, 0.058, 0.004, 0.008, 4, 0.003), toon(P.molhoKetchup));
  return g;
}

interface Rolante {
  x: number;
  z: number;
  fase: number;
  tom: number;
}

export class BarracaDoWalter {
  readonly group = new THREE.Group();
  /** onde o Walter fica, atrás do balcão (no referencial da barraca) */
  readonly posto = new THREE.Vector3(0, B.estrado, -0.32);
  /** os ganchos do cordão de luzinhas: de uma ponta à outra do beiral da frente */
  readonly luzinhas: readonly [THREE.Vector3, THREE.Vector3] = [new THREE.Vector3(-T.largura / 2 + 0.05, T.beira - 0.2, T.frente + 0.02), new THREE.Vector3(T.largura / 2 - 0.05, T.beira - 0.2, T.frente + 0.02)];
  /** as abóboras dos cantos do estrado (a cena põe no lote do parque) */
  readonly aboboras: AboboraNoLote[] = [
    { x: -1.12, z: 0.62, y: B.estrado, tamanho: 'media', cara: 'sorriso', giro: Math.PI / 4 - 0.2 },
    { x: 1.18, z: 0.6, y: B.estrado, tamanho: 'pequena', cara: 'piscando', giro: Math.PI / 4 + 0.2 },
    { x: 0.92, z: 0.72, y: B.estrado, tamanho: 'pequena', cor: P.aboboraCreme, simples: true, giro: 1.1 },
  ];
  /** a meia largura e a meia profundidade (o colisor), e o centro dela em `z` */
  readonly meio = { x: 1.3, z: 0.78, z0: -0.12 };

  private readonly salsichas: THREE.InstancedMesh | null = null;
  private readonly rolantes: Rolante[] = [];
  private readonly vapor: THREE.InstancedMesh | null = null;
  private readonly brilho: THREE.InstancedMesh | null = null;
  private tempo = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly v = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly c = new THREE.Color();

  constructor(readonly aberta = true) {
    this.group.name = 'barraca-do-walter';
    this.group.userData.peca = 'barraca-do-walter';
    this.montarEstrado();
    this.montarBalcao();
    this.montarToldo();
    this.montarCachorroGigante();
    this.montarCardapio();
    this.montarPrateleira();
    this.montarChapa();
    this.montarCubas();
    if (aberta) {
      const r = this.montarComida();
      this.salsichas = r.salsichas;
      this.vapor = r.vapor;
      this.brilho = this.montarLampada();
    }
    this.update(0);
  }

  // ---------------------------------------------------------- o estrado
  private montarEstrado(): void {
    const g = this.group;
    const tabuas = new THREE.Group();
    // as tábuas atravessadas, com fresta, cada uma num tom do veio
    const n = 8;
    const fundo = 1.62;
    for (let i = 0; i < n; i++) {
      const z = -0.92 + (i + 0.5) * (fundo / n);
      por(tabuas, quina(2.56 + (i % 3) * 0.02, 0.06, fundo / n - 0.012, 0.01), toon(P.madeiraDoCanteiro), (i % 2) * 0.01, 0.05, z);
    }
    // as duas vigas por baixo
    for (const z of [-0.75, 0.55]) por(tabuas, quina(2.5, 0.05, 0.08, 0.008), toon(P.carrinhoRoda), 0, 0.025, z);
    acabar(tabuas, [[P.madeiraDoCanteiro, veioDeMadeira(0.6)], [P.carrinhoRoda, veioDeMadeira(0.6)]]);
    g.add(tabuas);
  }

  // ----------------------------------------------------------- o balcão
  private montarBalcao(): void {
    const g = this.group;
    const vermelho = toon(0xffffff, { mapa: tabuasVermelhas() });
    const alto = B.balcao - 0.05 - B.estrado;
    const yMeio = B.estrado + alto / 2;
    // a frente do balcão e as duas laterais (até o fundo), de tábua vermelha
    const fz = (B.frente + 0.0) / 2;
    por(g, uvDeParede(quina(B.largura, alto, B.frente, 0.02), 0, yMeio, fz), vermelho, 0, yMeio, fz);
    for (const s of [-1, 1]) {
      const prof = B.frente - B.fundo;
      por(g, uvDeParede(quina(0.06, alto, prof, 0.015), s * (B.largura / 2 - 0.03), yMeio, (B.frente + B.fundo) / 2), vermelho, s * (B.largura / 2 - 0.03), yMeio, (B.frente + B.fundo) / 2);
    }
    // o fundo: a parede alta de trás, onde pendura o cardápio
    const altoFundo = T.beira - B.estrado - 0.02;
    por(g, uvDeParede(quina(B.largura, altoFundo, 0.06, 0.02), 0, B.estrado + altoFundo / 2, B.fundo), vermelho, 0, B.estrado + altoFundo / 2, B.fundo);
    // o friso creme: a régua de cima e o rodapé da frente e dos lados, e as quinas (mais grossas: a face delas fica à frente)
    const creme = toon(P.barracaCreme);
    for (const y of [B.estrado + 0.04, B.balcao - 0.09]) {
      por(g, quina(B.largura + 0.03, 0.05, 0.03, 0.008), creme, 0, y, B.frente + 0.008);
      for (const s of [-1, 1]) por(g, quina(0.03, 0.05, B.frente - B.fundo, 0.008), creme, s * (B.largura / 2 + 0.008), y, (B.frente + B.fundo) / 2);
    }
    for (const s of [-1, 1]) por(g, quina(0.055, alto, 0.055, 0.012), creme, s * (B.largura / 2 - 0.01), yMeio, B.frente - 0.01);
    // o painel pintado da frente
    const PL = 1.56;
    const PA = PL * (300 / 760);
    const painel = por(g, new THREE.PlaneGeometry(PL, PA), toon(0xffffff, { mapa: painelDoWalter() }), 0, yMeio + 0.02, B.frente + 0.012);
    painel.name = 'painel-do-walter';
    // o tampo de madeira de verdade, avançando para a frente e para os lados
    const tampo = new THREE.Group();
    por(tampo, quina(B.largura + 0.16, 0.05, B.frente - B.fundo + 0.12, 0.012), toon(P.carrinhoRoda), 0, B.balcao - 0.025, (B.frente + B.fundo) / 2 + 0.07);
    acabar(tampo, [[P.carrinhoRoda, veioDeMadeira(0.7)]]);
    g.add(tampo);
    // as mãos-francesas embaixo do tampo, na frente
    const arco = new THREE.Shape();
    arco.moveTo(0, 0);
    arco.lineTo(0.1, 0);
    arco.quadraticCurveTo(0.02, -0.02, 0, -0.11);
    arco.closePath();
    const mao = new THREE.ExtrudeGeometry(arco, { depth: 0.03, bevelEnabled: false, curveSegments: 6 });
    for (const x of [-B.largura / 2 + 0.12, B.largura / 2 - 0.09]) {
      por(g, mao.clone(), creme, x, B.balcao - 0.05, B.frente + 0.02).rotation.y = -Math.PI / 2;
    }
  }

  // ------------------------------------------------------------ o toldo
  private montarToldo(): void {
    const g = this.group;
    const pano = toon(0xffffff, { mapa: lonaListrada(), doubleSide: true });
    const creme = toon(P.barracaCreme);
    // as duas águas: o plano dobrado na cumeeira, cedendo um tico entre as varetas
    const agua = (z0: number, z1: number): THREE.BufferGeometry => {
      const geo = new THREE.PlaneGeometry(T.largura, 1, 24, 4);
      const pos = geo.getAttribute('position');
      const uv = geo.getAttribute('uv');
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const t = pos.getY(i) + 0.5;
        const z = z0 + (z1 - z0) * t;
        const cede = 0.022 * Math.abs(Math.sin((x / T.largura) * Math.PI * 5)) * Math.sin(t * Math.PI);
        pos.setXYZ(i, x, alturaDoToldo(z) - cede, z);
        uv.setXY(i, x / T.largura + 0.5, t);
      }
      geo.computeVertexNormals();
      return geo;
    };
    por(g, agua(T.frente, T.zCumeeira), pano);
    por(g, agua(T.fundo, T.zCumeeira), pano);
    // a cumeeira: o rolo vermelho com as ponteiras creme
    por(g, new THREE.CylinderGeometry(0.035, 0.035, T.largura + 0.06, 10).rotateZ(Math.PI / 2), toon(P.barracaVermelhoFundo), 0, T.cumeeira + 0.012, T.zCumeeira);
    for (const s of [-1, 1]) por(g, new THREE.SphereGeometry(0.05, 10, 8), creme, s * (T.largura / 2 + 0.04), T.cumeeira + 0.012, T.zCumeeira);
    // os oitões: o triângulo creme de cada lado, com a borda vermelha
    for (const s of [-1, 1]) {
      const tri = new THREE.Shape();
      tri.moveTo(T.fundo + 0.06, T.beira + 0.02);
      tri.lineTo(T.frente - 0.06, T.beira + 0.02);
      tri.lineTo(T.zCumeeira, T.cumeeira - 0.04);
      tri.closePath();
      const geo = new THREE.ShapeGeometry(tri);
      geo.rotateY(-Math.PI / 2);
      por(g, geo, toon(P.barracaCreme, { doubleSide: true }), s * (B.largura / 2 + 0.005), 0, 0);
    }
    // o lambrequim: a faixa recortada em ondas, na beira da frente, e o pompom no fundo de cada onda
    const ondas = 9;
    const queda = 0.2;
    const passos = ondas * 6;
    const pts: number[] = [];
    const uvs: number[] = [];
    const pompons = new Juntar();
    const borda = (k: number): [number, number] => {
      const x = -T.largura / 2 + (T.largura * k) / passos;
      const fase = ((k % 6) / 6) * Math.PI;
      return [x, T.beira - queda + 0.07 * (1 - Math.sin(fase))];
    };
    for (let k = 0; k < passos; k++) {
      const [x0, b0] = borda(k);
      const [x1, b1] = borda(k + 1);
      pts.push(x0, T.beira, 0, x0, b0, 0, x1, b1, 0, x0, T.beira, 0, x1, b1, 0, x1, T.beira, 0);
      const u = (x: number): number => x / T.largura + 0.5;
      uvs.push(u(x0), 1, u(x0), 0, u(x1), 0, u(x0), 1, u(x1), 0, u(x1), 1);
      if (k % 6 === 3) pompons.por(new THREE.SphereGeometry(0.024, 8, 6), x0, b0 - 0.006, T.frente + 0.012);
    }
    const lamb = new THREE.BufferGeometry();
    lamb.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    lamb.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    lamb.computeVertexNormals();
    por(g, lamb, pano, 0, 0, T.frente);
    const p = pompons.malha(toon(P.barracaMostarda), 'pompons-da-barraca');
    if (p) g.add(p);
    // a vareta da beira da frente e os quatro postes creme com a base e o capitel
    por(g, new THREE.CylinderGeometry(0.013, 0.013, T.largura, 6).rotateZ(Math.PI / 2), toon(P.carrinhoFerro), 0, T.beira + 0.004, T.frente + 0.004);
    for (const s of [-1, 1]) {
      const x = s * (B.largura / 2 - 0.04);
      for (const [z, de] of [[B.frente + 0.08, B.balcao], [B.fundo - 0.06, B.estrado]] as const) {
        const ate = alturaDoToldo(z) - 0.01;
        por(g, haste(new THREE.Vector3(x, de, z), new THREE.Vector3(x, ate, z), 0.032, 10), creme);
        por(g, new THREE.CylinderGeometry(0.045, 0.05, 0.04, 10), toon(P.barracaVermelhoFundo), x, de + 0.02, z);
        por(g, new THREE.CylinderGeometry(0.05, 0.04, 0.04, 10), toon(P.barracaVermelhoFundo), x, ate - 0.02, z);
      }
    }
  }

  // ------------------------------------------ o cachorro-quente gigante do telhado
  private montarCachorroGigante(): void {
    const g = new THREE.Group();
    g.name = 'cachorro-quente-gigante';
    g.position.set(0, T.cumeeira + 0.3, T.zCumeeira + 0.04);
    const pao = toon(P.paoDeCachorro);
    const paoDourado = toon(P.paoDourado);
    // o pão: as duas metades, e a casca dourada por cima
    for (const s of [-1, 1]) {
      por(g, geoMeioPao(1.2, 0.17), pao, 0, -0.02, s * 0.1);
      por(g, geoMeioPao(1.1, 0.12).scale(1, 0.5, 1), paoDourado, 0, 0.07, s * 0.115);
    }
    // a salsicha, saindo das pontas, com a faixa de múmia
    por(g, geoSalsicha(1.42, 0.125), toon(P.salsicha), 0, 0.09, 0);
    const massa = toon(P.massaDeMumia);
    for (const [x, inc] of [[-0.42, 0.35], [-0.2, -0.3], [0.28, 0.25]] as const) {
      const faixa = por(g, new THREE.TorusGeometry(0.127, 0.022, 6, 18), massa, x, 0.09, 0);
      faixa.rotation.set(0, Math.PI / 2, inc);
      faixa.scale.set(1, 1, 0.55);
    }
    // a mostarda e o ketchup em zigue-zague por cima
    por(g, zigueZague(-0.5, 0.5, 0.215, 0, 0.06, 6, 0.018), toon(P.molhoMostarda));
    por(g, zigueZague(-0.44, 0.44, 0.205, 0.02, 0.045, 4, 0.014), toon(P.molhoKetchup));
    // a carinha na frente da salsicha, perto da ponta da direita: os olhos, o brilho, o sorriso e as bochechas
    const olho = toon(P.olhoDeBoneco);
    const brilho = toon(0xffffff);
    for (const s of [-1, 1]) {
      por(g, new THREE.SphereGeometry(0.026, 10, 8).scale(1, 1.2, 0.5), olho, 0.53 + s * 0.055, 0.13, 0.112);
      por(g, new THREE.SphereGeometry(0.008, 6, 4), brilho, 0.53 + s * 0.055 + 0.008, 0.142, 0.124);
      por(g, new THREE.CircleGeometry(0.02, 10), toon(P.pocaoRosa), 0.53 + s * 0.095, 0.09, 0.119);
    }
    const boca = new THREE.TorusGeometry(0.028, 0.006, 4, 10, Math.PI);
    boca.rotateZ(Math.PI);
    por(g, boca, olho, 0.53, 0.088, 0.118);
    // os dois pés que prendem na cumeeira
    for (const x of [-0.35, 0.35]) {
      por(g, haste(new THREE.Vector3(x, -0.15, 0), new THREE.Vector3(x, -0.3, -0.04), 0.02, 6), toon(P.carrinhoFerro));
    }
    this.group.add(g);
  }

  // ------------------------------------------------------- a lousa do cardápio
  private montarCardapio(): void {
    const g = this.group;
    const L = 1.0;
    const A = L * (300 / 560);
    const y = 1.78;
    const z = B.fundo + 0.035;
    por(g, quina(L + 0.08, A + 0.08, 0.03, 0.01), toon(P.carrinhoRoda), 0, y, z + 0.005);
    const lousa = por(g, new THREE.PlaneGeometry(L, A), toon(0xffffff, { mapa: lousaDoCardapio() }), 0, y, z + 0.022);
    lousa.name = 'cardapio-do-walter';
    // o barbante e os dois preguinhos
    for (const s of [-1, 1]) por(g, new THREE.SphereGeometry(0.012, 6, 4), toon(P.carrinhoFerro), s * (L / 2 - 0.02), y + A / 2 + 0.06, z + 0.02);
  }

  // ------------------------------------- a prateleirinha do lado, com a cesta de pães
  private montarPrateleira(): void {
    const g = this.group;
    const x = -(B.largura / 2 + 0.2);
    const y = 0.86;
    const z = 0.02;
    por(g, quina(0.34, 0.03, 0.42, 0.006), toon(P.carrinhoRoda), x, y, z);
    for (const sz of [-1, 1]) {
      const mao = por(g, quina(0.03, 0.18, 0.03, 0.006), toon(P.barracaCreme), x + 0.14, y - 0.1, z + sz * 0.15);
      mao.rotation.z = -0.6;
    }
    // a cesta de vime: o fundo torneado, o trançado em anéis e a alça
    const vime = toon(P.vimeDaCesta);
    const cesta = new THREE.LatheGeometry([[0, 0], [0.11, 0.004], [0.13, 0.03], [0.14, 0.07], [0.135, 0.075]].map(([r, h]) => new THREE.Vector2(r, h)), 16);
    cesta.scale(1, 1, 1.4);
    por(g, cesta, toon(P.vimeDaCesta, { doubleSide: true }), x, y + 0.015, z);
    for (const h of [0.02, 0.045, 0.07]) {
      por(g, new THREE.TorusGeometry(0.125 + h * 0.2, 0.006, 4, 20).rotateX(Math.PI / 2).scale(1, 1, 1.4), vime, x, y + 0.015 + h, z);
    }
    const alca = new THREE.TorusGeometry(0.12, 0.008, 5, 16, Math.PI);
    alca.rotateY(Math.PI / 2);
    por(g, alca, vime, x, y + 0.09, z);
    // os pães empilhados na cesta (o miolo aparecendo na boca de cada um)
    const pao = toon(P.paoDeCachorro);
    const paoDourado = toon(P.paoDourado);
    ([[-0.03, 0.08, 0.04, 0.3], [0.04, 0.07, -0.05, -0.2], [0, 0.1, 0.0, 0.1], [-0.05, 0.065, -0.1, 0.5]] as const).forEach(([dx, dy, dz, giro]) => {
      const p = por(g, geoMeioPao(0.2, 0.04).scale(1, 1, 1.6), pao, x + dx, y + dy, z + dz);
      p.rotation.y = Math.PI / 2 + giro;
      const casca = por(g, geoMeioPao(0.18, 0.03).scale(1, 0.5, 1.6), paoDourado, x + dx, y + dy + 0.022, z + dz);
      casca.rotation.y = Math.PI / 2 + giro;
    });
  }

  // ------------------------------------------------------------- a chapa
  private montarChapa(): void {
    const g = this.group;
    const x = 0.6;
    const z = 0.1;
    const corpo = new THREE.Group();
    por(corpo, quina(0.74, 0.075, 0.44, 0.01), toon(P.inox), x, B.balcao + 0.037, z);
    // o encosto de trás e as duas abas (o que segura a gordura)
    por(corpo, quina(0.74, 0.07, 0.02, 0.005), toon(P.inox), x, B.balcao + 0.1, z - 0.21);
    for (const s of [-1, 1]) por(corpo, quina(0.02, 0.05, 0.4, 0.005), toon(P.inox), x + s * 0.36, B.balcao + 0.09, z - 0.01);
    acabar(corpo, [[P.inox, inoxEscovado(0.5)]]);
    g.add(corpo);
    // a chapa preta em cima, um tico mais funda que a borda
    por(g, quina(0.68, 0.012, 0.38, 0.004), toon(P.chapaQuente), x, B.balcao + 0.077, z);
    // os três botões na frente da chapa e o filete de luz do aceso
    for (let i = 0; i < 3; i++) {
      por(g, new THREE.CylinderGeometry(0.018, 0.02, 0.025, 10).rotateX(Math.PI / 2), toon(P.carrinhoFerro), x - 0.2 + i * 0.2, B.balcao + 0.04, z + 0.228);
    }
    por(g, quina(0.04, 0.012, 0.006, 0.002), toon(P.vinagrete, { glow: 0.9 }), x + 0.3, B.balcao + 0.055, z + 0.222);
  }

  // ----------------------------------------------------- as cubas de complemento
  private montarCubas(): void {
    const g = this.group;
    const x0 = -0.58;
    const z = 0.08;
    const n = 5;
    const largura = 0.82;
    const cada = largura / n;
    const corpo = new THREE.Group();
    // a bandeja de inox, as bordas e as divisórias
    por(corpo, quina(largura + 0.04, 0.05, 0.3, 0.008), toon(P.inox), x0, B.balcao + 0.025, z);
    for (const s of [-1, 1]) {
      por(corpo, quina(largura + 0.04, 0.03, 0.016, 0.004), toon(P.inox), x0, B.balcao + 0.062, z + s * 0.142);
      por(corpo, quina(0.016, 0.03, 0.27, 0.004), toon(P.inox), x0 + s * (largura / 2 + 0.012), B.balcao + 0.062, z);
    }
    for (let i = 1; i < n; i++) por(corpo, quina(0.008, 0.026, 0.27, 0.002), toon(P.inox), x0 - largura / 2 + i * cada, B.balcao + 0.06, z);
    acabar(corpo, [[P.inox, inoxEscovado(0.5)]]);
    g.add(corpo);
    if (!this.aberta) return;
    // o que vai em cada cuba: um montinho da cor e os grãozinhos por cima, em lote
    const CUBAS = [P.batataPalha, P.milhoVerde, P.ervilha, P.vinagrete, P.pureDeBatata];
    CUBAS.forEach((cor, i) => {
      const cx = x0 - largura / 2 + (i + 0.5) * cada;
      por(g, new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(cada / 2 - 0.012, 0.03, 0.12), toon(cor), cx, B.balcao + 0.052, z);
    });
    const rnd = sorteio(2024);
    const graos: Array<[number, number, number, number]> = [];
    const palitos: Array<[number, number, number]> = [];
    CUBAS.forEach((_, i) => {
      const cx = x0 - largura / 2 + (i + 0.5) * cada;
      if (i === 0) {
        for (let k = 0; k < 26; k++) palitos.push([cx + (rnd() - 0.5) * (cada - 0.04), z + (rnd() - 0.5) * 0.2, rnd() * Math.PI]);
        return;
      }
      if (i === 4) return;
      const tons = i === 1 ? [P.milhoVerde, P.barracaMostarda] : i === 2 ? [P.ervilha, P.folhaDeAbobora] : [P.vinagrete, P.ervilha, P.barracaCreme];
      for (let k = 0; k < 22; k++) {
        const dx = (rnd() - 0.5) * (cada - 0.04);
        const dz = (rnd() - 0.5) * 0.2;
        const altura = 0.03 * Math.max(0, 1 - (dx / (cada / 2)) ** 2 - (dz / 0.12) ** 2);
        graos.push([cx + dx, B.balcao + 0.052 + Math.sqrt(Math.max(0, altura)) * 0.17 + 0.002, z + dz, tons[k % tons.length]]);
      }
    });
    const graosIm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.009, 6, 4), toon(0xffffff), graos.length);
    graosIm.name = 'graos-das-cubas';
    graos.forEach(([x, y, zz, cor], i) => {
      graosIm.setMatrixAt(i, this.m.compose(this.v.set(x, y, zz), this.q.identity(), this.s.set(1, 0.8, 1)));
      graosIm.setColorAt(i, this.c.setHex(cor));
    });
    const palIm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.035, 0.005, 0.005), toon(0xffffff), palitos.length);
    palIm.name = 'batata-palha';
    palitos.forEach(([x, zz, giro], i) => {
      this.e.set((rnd() - 0.5) * 0.6, giro, (rnd() - 0.5) * 0.5);
      palIm.setMatrixAt(i, this.m.compose(this.v.set(x, B.balcao + 0.07 + rnd() * 0.012, zz), this.q.setFromEuler(this.e), this.s.set(1, 1, 1)));
      palIm.setColorAt(i, this.c.setHex(P.batataPalha).multiplyScalar(0.85 + rnd() * 0.25));
    });
    for (const im of [graosIm, palIm]) {
      im.userData.semSombra = true;
      g.add(im);
    }
    // a colher no purê
    const colher = por(g, haste(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.16, -0.06), 0.006, 5), toon(P.inox), x0 + largura / 2 - cada / 2, B.balcao + 0.06, z + 0.03);
    colher.rotation.z = -0.5;
  }

  // --------------------------------------------------------------- a comida
  private montarComida(): { salsichas: THREE.InstancedMesh; vapor: THREE.InstancedMesh } {
    const g = this.group;
    const chapaY = B.balcao + 0.083;
    // as salsichas rolando na chapa
    const sal = new THREE.InstancedMesh(geoSalsicha(0.16, 0.021), toon(0xffffff), 7);
    sal.name = 'salsichas-na-chapa';
    for (let i = 0; i < 7; i++) {
      this.rolantes.push({ x: 0.72 + (i % 2) * 0.03, z: -0.06 + i * 0.045, fase: i * 0.9, tom: i % 3 });
    }
    sal.frustumCulled = false;
    g.add(sal);
    // as salsichas-múmia: a salsicha, as tiras de massa em volta e os olhinhos
    const massa = toon(P.massaDeMumia);
    const olho = toon(P.olhoDeBoneco);
    const branco = toon(0xffffff);
    for (const [x, z, giro] of [[0.36, 0.0, 0.1], [0.38, 0.12, -0.08], [0.42, 0.24, 0.05]] as const) {
      const mumia = new THREE.Group();
      mumia.position.set(x, chapaY + 0.022, z);
      mumia.rotation.y = giro;
      por(mumia, geoSalsicha(0.17, 0.022), toon(P.salsicha));
      for (let k = 0; k < 5; k++) {
        const faixa = por(mumia, new THREE.TorusGeometry(0.023, 0.007, 4, 12), massa, -0.06 + k * 0.026, 0, 0);
        faixa.rotation.set(0, Math.PI / 2, (k % 2 ? 0.45 : -0.4));
      }
      // os olhinhos espiando entre duas faixas, na ponta da direita
      for (const s of [-1, 1]) {
        por(mumia, new THREE.SphereGeometry(0.008, 8, 6), branco, 0.06, 0.012, s * 0.009 + 0.012);
        por(mumia, new THREE.SphereGeometry(0.0045, 6, 4), olho, 0.063, 0.014, s * 0.009 + 0.019);
      }
      g.add(mumia);
    }
    // a espátula deitada na beira da chapa
    por(g, quina(0.09, 0.004, 0.07, 0.002), toon(P.inox), 0.86, chapaY + 0.004, 0.25);
    por(g, haste(new THREE.Vector3(0.86, chapaY + 0.006, 0.29), new THREE.Vector3(0.95, chapaY + 0.03, 0.42), 0.009, 6), toon(P.carrinhoRoda));
    // o vapor subindo da chapa (halos em lote: a força é a cor)
    const vapor = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(0xffffff, 0.35), 6);
    vapor.name = 'vapor-da-chapa';
    vapor.frustumCulled = false;
    vapor.renderOrder = 4;
    vapor.userData.semSombra = true;
    g.add(vapor);

    // as bisnagas de ketchup, mostarda e maionese: o corpo torneado, a tampa e o bico
    const corpoDaBisnaga = new THREE.LatheGeometry([[0, 0], [0.028, 0.002], [0.032, 0.03], [0.032, 0.12], [0.026, 0.14], [0.012, 0.15]].map(([r, h]) => new THREE.Vector2(r, h)), 12);
    ([[P.molhoKetchup, -0.1], [P.molhoMostarda, -0.02], [P.molhoMaionese, 0.06]] as const).forEach(([cor, x], i) => {
      const z = 0.4 - (i % 2) * 0.03;
      por(g, corpoDaBisnaga.clone(), toon(cor), x, B.balcao, z);
      por(g, new THREE.CylinderGeometry(0.014, 0.016, 0.02, 10), toon(i === 2 ? P.barracaVermelho : P.barracaCreme), x, B.balcao + 0.16, z);
      por(g, new THREE.ConeGeometry(0.008, 0.05, 8), toon(cor), x, B.balcao + 0.195, z);
    });
    // o porta-guardanapo: o arco de inox e o maço branco
    por(g, quina(0.11, 0.08, 0.05, 0.006), toon(0xffffff), 0.17, B.balcao + 0.045, 0.38);
    for (const s of [-1, 1]) por(g, quina(0.012, 0.1, 0.07, 0.003), toon(P.inox), 0.17 + s * 0.062, B.balcao + 0.05, 0.38);
    // dois cachorros-quentes prontos na barquinha
    for (const [x, z, giro] of [[-0.86, 0.38, 0.15], [-0.6, 0.41, -0.1]] as const) {
      const cq = cachorroQuentePronto();
      cq.position.set(x, B.balcao, z);
      cq.rotation.y = giro;
      g.add(cq);
    }
    // a batata palha por cima dos dois prontos
    const rnd = sorteio(55);
    const pal = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.004, 0.004), toon(0xffffff), 20);
    pal.name = 'batata-palha-dos-prontos';
    for (let i = 0; i < 20; i++) {
      const [x, z] = i < 10 ? [-0.86, 0.38] : [-0.6, 0.41];
      this.e.set((rnd() - 0.5) * 0.5, rnd() * Math.PI, (rnd() - 0.5) * 0.4);
      pal.setMatrixAt(i, this.m.compose(this.v.set(x + (rnd() - 0.5) * 0.14, B.balcao + 0.062 + rnd() * 0.008, z + (rnd() - 0.5) * 0.03), this.q.setFromEuler(this.e), this.s.set(1, 1, 1)));
      pal.setColorAt(i, this.c.setHex(P.batataPalha).multiplyScalar(0.85 + rnd() * 0.25));
    }
    pal.userData.semSombra = true;
    g.add(pal);
    // o pote de ossinhos: o vidro, a tampa vermelha com o cabinho e os biscoitos dentro
    const px = 0.97;
    const pz = 0.4;
    const vidro = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.06, 0.003], [0.065, 0.02], [0.065, 0.13], [0.05, 0.15], [0.05, 0.16]].map(([r, h]) => new THREE.Vector2(r, h)), 16), toon(P.vidroDeEnsaio, { opacity: 0.35 }));
    vidro.position.set(px, B.balcao, pz);
    vidro.name = 'pote-de-ossinhos';
    vidro.renderOrder = 1;
    g.add(vidro);
    por(g, new THREE.CylinderGeometry(0.056, 0.056, 0.022, 16), toon(P.barracaVermelho), px, B.balcao + 0.17, pz);
    por(g, new THREE.SphereGeometry(0.014, 8, 6), toon(P.barracaCreme), px, B.balcao + 0.188, pz);
    const ossos = new Juntar();
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      const r = 0.025 + (i % 3) * 0.008;
      for (const parte of geoOssinho()) {
        const p = parte.clone();
        p.rotateY(a);
        p.rotateZ((i % 2 ? 0.3 : -0.4));
        ossos.por(p, px + Math.cos(a) * r, B.balcao + 0.02 + Math.floor(i / 3) * 0.022, pz + Math.sin(a) * r);
      }
    }
    const o = ossos.malha(toon(P.ossinho), 'ossinhos');
    if (o) g.add(o);
    // o sininho de chamar
    por(g, new THREE.LatheGeometry([[0, 0.05], [0.02, 0.045], [0.032, 0.02], [0.038, 0.004], [0.036, 0]].map(([r, h]) => new THREE.Vector2(r, h)), 14), toon(P.barracaMostarda, { doubleSide: true }), 0.74, B.balcao + 0.008, 0.42);
    por(g, new THREE.CylinderGeometry(0.042, 0.042, 0.008, 14), toon(P.carrinhoFerro), 0.74, B.balcao + 0.004, 0.42);
    por(g, new THREE.SphereGeometry(0.009, 8, 6), toon(P.carrinhoFerro), 0.74, B.balcao + 0.06, 0.42);
    return { salsichas: sal, vapor };
  }

  // ----------------------------------------------- a lâmpada embaixo do toldo
  private montarLampada(): THREE.InstancedMesh {
    const g = this.group;
    const y = 2.05;
    const z = 0.1;
    por(g, new THREE.CylinderGeometry(0.004, 0.004, alturaDoToldo(z) - y - 0.06, 4), toon(P.carrinhoFerro), 0, (alturaDoToldo(z) + y + 0.06) / 2, z);
    por(g, new THREE.ConeGeometry(0.09, 0.08, 14, 1, true), toon(P.barracaMostarda, { doubleSide: true }), 0, y + 0.03, z);
    const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), acesoPorVertice());
    // a lâmpada acesa (chapada, branca-quente nos vértices)
    const pos = bulbo.geometry.getAttribute('position');
    const cores = new Float32Array(pos.count * 3);
    const quente = new THREE.Color(P.luzDeAbajur);
    for (let i = 0; i < pos.count; i++) cores.set([quente.r, quente.g, quente.b], i * 3);
    bulbo.geometry.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    bulbo.position.set(0, y - 0.01, z);
    bulbo.name = 'lampada-da-barraca';
    g.add(bulbo);
    // o halo dela e a poça de luz quente na frente do balcão
    const halo = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.luzDeAbajur, 0.4), 1);
    halo.name = 'halo-da-barraca';
    halo.setMatrixAt(0, this.m.compose(this.v.set(0, y - 0.02, z), this.q.identity(), this.s.setScalar(0.75)));
    halo.setColorAt(0, this.c.setRGB(1, 1, 1));
    halo.renderOrder = 3;
    halo.userData.semSombra = true;
    halo.frustumCulled = false;
    g.add(halo);
    const poca = pocaDeLuz(1.9, P.luzDeAbajur, 0.42);
    poca.position.set(0, 0.095, 0.9);
    poca.name = 'poca-da-barraca';
    g.add(poca);
    return halo;
  }

  /** o relógio da barraca: as salsichas rolando, o vapor e a lâmpada respirando */
  update(dt: number): void {
    this.tempo += dt;
    const t = this.tempo;
    const sal = this.salsichas;
    if (sal) {
      const chapaY = B.balcao + 0.083 + 0.021;
      this.rolantes.forEach((r, i) => {
        // cada uma rola um quarto de volta, para, e rola de novo (alguém virando com a espátula)
        const ciclo = (t * 0.35 + r.fase) % 1;
        const giro = Math.floor(t * 0.35 + r.fase) * (Math.PI / 2) + (ciclo > 0.8 ? ((ciclo - 0.8) / 0.2) * (Math.PI / 2) : 0);
        this.e.set(giro, 0, 0);
        sal.setMatrixAt(i, this.m.compose(this.v.set(r.x, chapaY, r.z), this.q.setFromEuler(this.e), this.s.set(1, 1, 1)));
        sal.setColorAt(i, this.c.setHex(r.tom === 0 ? P.salsichaTostada : P.salsicha).multiplyScalar(r.tom === 2 ? 1.08 : 1));
      });
      sal.instanceMatrix.needsUpdate = true;
      if (sal.instanceColor) sal.instanceColor.needsUpdate = true;
    }
    const vapor = this.vapor;
    if (vapor) {
      for (let i = 0; i < 6; i++) {
        const f = (i / 6 + t * 0.25) % 1;
        this.v.set(0.6 + Math.sin(i * 2.1) * 0.2 + Math.sin(t * 0.8 + i) * 0.04 * f, B.balcao + 0.12 + f * 0.6, 0.1 + Math.cos(i * 1.7) * 0.1);
        vapor.setMatrixAt(i, this.m.compose(this.v, this.q.identity(), this.s.setScalar(0.12 + f * 0.25)));
        vapor.setColorAt(i, this.c.setRGB(1, 0.97, 0.92).multiplyScalar(Math.sin(f * Math.PI) * 0.45));
      }
      vapor.instanceMatrix.needsUpdate = true;
      if (vapor.instanceColor) vapor.instanceColor.needsUpdate = true;
    }
    const brilho = this.brilho;
    if (brilho) {
      brilho.setColorAt(0, this.c.setRGB(1, 1, 1).multiplyScalar(0.9 + 0.1 * Math.sin(t * 2.7)));
      if (brilho.instanceColor) brilho.instanceColor.needsUpdate = true;
    }
  }
}

/** a altura do tampo do balcão (onde a cena põe o pano de fechado e o recado) */
export const BALCAO_DO_WALTER = { altura: B.balcao, frente: B.frente + 0.13 };
