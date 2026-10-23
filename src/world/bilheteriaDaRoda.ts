import * as THREE from 'three';
import { toon } from '../core/materials';
import { letreiro } from './props';
import { PALETTE as P } from '../palette';

/**
 * A BILHETERIA DA RODA GIGANTE: uma casinha de circo oval (a reforma de
 * outubro). Saia de listras vermelhas e creme, parede creme com os frisos
 * dourados, telhado de lona em gomos com a bandeirinha no alto, o lambrequim
 * de meias-luas na beira, as luzinhas, a placa "BILHETES" de marquise e o
 * guichê saltado com o balcão, a sineta e o rolo de bilhetes.
 *
 * O TAMANHO POR FORA É O DA CABINE ANTIGA: o colisor da cena (1,53 × 1,08), o
 * guichê virado para +Z e o Cookie encostado do lado de `+X` continuam
 * valendo. O beiral da frente avança só 24 cm (a conta da câmera: o telhado
 * engole ~0,95 de parede por metro de beiral), então o guichê aparece inteiro.
 *
 * O guichê não é furo: é uma janela SALTADA — a moldura funda cobre a curva da
 * parede, e lá dentro mora a pintura do interior (o lampião aceso, o rolo de
 * bilhetes, o cartaz de coração), sob o vidro. Ninguém trabalha ali: quem vende
 * é o Cookie, do lado.
 */
const HX = 1.42; // meia largura da parede oval
const HZ = 0.98; // meia profundidade
const SAIA = 1.0; // até onde vai a saia listrada
const BEIRA = 2.3; // a beira do telhado
const TELHADO = { hx: 1.75, hz: 1.22, alto: 1.25 };
const css = (n: number): string => `#${n.toString(16).padStart(6, '0')}`;

/** listras em pé (ou gomos, num cone): `n` faixas alternadas no `u` */
const listrasPorN = new Map<string, THREE.CanvasTexture>();
function listras(n: number, a: number, b: number): THREE.CanvasTexture {
  const chave = `${n}|${a}|${b}`;
  const pronta = listrasPorN.get(chave);
  if (pronta) return pronta;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = css(i % 2 === 0 ? a : b);
    ctx.fillRect(Math.floor((i / n) * 512), 0, Math.ceil(512 / n) + 1, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  listrasPorN.set(chave, tex);
  return tex;
}

/** o que se vê pelo vidro do guichê: o interior aceso, pintado */
let interiorPintado: THREE.CanvasTexture | null = null;
function interiorDoGuiche(): THREE.CanvasTexture {
  if (interiorPintado) return interiorPintado;
  const W = 256;
  const H = 160;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  // a parede de dentro, mais clara em volta do lampião
  const fundo = ctx.createRadialGradient(W * 0.3, H * 0.25, 4, W * 0.3, H * 0.25, W * 0.8);
  fundo.addColorStop(0, '#f6dfb0');
  fundo.addColorStop(0.45, '#b98a5c');
  fundo.addColorStop(1, '#5e4030');
  ctx.fillStyle = fundo;
  ctx.fillRect(0, 0, W, H);
  // o lampião
  ctx.fillStyle = '#fff3c8';
  ctx.beginPath();
  ctx.arc(W * 0.3, H * 0.22, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7a5236';
  ctx.fillRect(W * 0.3 - 1, 0, 2, H * 0.16);
  // o cartaz de coração na parede
  ctx.fillStyle = '#f3ead9';
  ctx.fillRect(W * 0.62, H * 0.12, 54, 66);
  ctx.fillStyle = css(P.rodaVermelho);
  ctx.beginPath();
  const cx = W * 0.62 + 27;
  const cy = H * 0.12 + 30;
  ctx.moveTo(cx, cy + 16);
  ctx.bezierCurveTo(cx - 26, cy - 2, cx - 12, cy - 22, cx, cy - 8);
  ctx.bezierCurveTo(cx + 12, cy - 22, cx + 26, cy - 2, cx, cy + 16);
  ctx.fill();
  ctx.fillRect(W * 0.62 + 8, H * 0.12 + 52, 38, 4);
  // o balcão de dentro e o rolo de bilhetes
  ctx.fillStyle = '#4a3122';
  ctx.fillRect(0, H * 0.74, W, H * 0.26);
  ctx.fillStyle = css(P.rodaVermelho);
  ctx.beginPath();
  ctx.arc(W * 0.42, H * 0.66, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f3ead9';
  ctx.beginPath();
  ctx.arc(W * 0.42, H * 0.66, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(W * 0.42 - 4, H * 0.66 + 10, 8, 26);
  // a caixinha do troco
  ctx.fillStyle = '#2f5d8c';
  ctx.fillRect(W * 0.12, H * 0.6, 34, 22);
  ctx.fillStyle = css(P.gold);
  ctx.fillRect(W * 0.12 + 13, H * 0.6 + 6, 8, 6);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  interiorPintado = tex;
  return tex;
}

/** um ponto na beira oval (raios `rx`, `rz`) no ângulo `a`, e a normal para fora */
function naOval(rx: number, rz: number, a: number): { p: THREE.Vector3; giro: number } {
  const p = new THREE.Vector3(Math.sin(a) * rx, 0, Math.cos(a) * rz);
  const n = new THREE.Vector2(Math.sin(a) / rx, Math.cos(a) / rz);
  return { p, giro: Math.atan2(n.x, n.y) };
}

export function bilheteriaDaRoda(texto = 'BILHETES'): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bilheteria';
  const ovalar = (geo: THREE.BufferGeometry, rx: number, rz: number): THREE.BufferGeometry => geo.scale(rx, 1, rz);

  // ------------------------------------------------- o pé e as paredes
  const pe = new THREE.Mesh(ovalar(new THREE.CylinderGeometry(1, 1.04, 0.16, 48), HX + 0.12, HZ + 0.12), toon(P.concrete));
  pe.position.y = 0.08;
  g.add(pe);
  const saia = new THREE.Mesh(
    ovalar(new THREE.CylinderGeometry(1, 1, SAIA - 0.15, 48, 1, true), HX, HZ),
    toon(0xffffff, { mapa: listras(28, P.rodaVermelho, P.rodaMosaicoClaro) }),
  );
  saia.position.y = 0.15 + (SAIA - 0.15) / 2;
  g.add(saia);
  const parede = new THREE.Mesh(ovalar(new THREE.CylinderGeometry(1, 1, BEIRA - SAIA, 48, 1, true), HX, HZ), toon(P.wallCream));
  parede.position.y = (SAIA + BEIRA) / 2;
  g.add(parede);
  // a tampa de cima (forro), escondida pelo telhado mas fechando a casca
  const forro = new THREE.Mesh(ovalar(new THREE.CircleGeometry(1, 48).rotateX(-Math.PI / 2), HX, HZ), toon(P.wallCream));
  forro.position.y = BEIRA - 0.02;
  g.add(forro);
  // os frisos dourados: no pé da saia, entre a saia e a parede, e na beira
  for (const [y, r] of [[0.17, 0.03], [SAIA, 0.04], [BEIRA - 0.04, 0.045]] as const) {
    const friso = new THREE.Mesh(ovalar(new THREE.TorusGeometry(1, r, 5, 56).rotateX(Math.PI / 2), HX + 0.012, HZ + 0.012), toon(P.gold));
    friso.position.y = y;
    g.add(friso);
  }

  // --------------------------------------------------------- o guichê
  /*
   * A JANELA SALTADA. A moldura tem 30 cm de fundo e cobre a curva da parede
   * dos lados; a pintura do interior fica 1 cm à frente da parede no meio, e o
   * vidro 6 cm à frente da pintura. Os 14 cm de baixo ficam sem vidro: é a
   * fresta do guichê.
   */
  const JX = 0.75;
  const JY0 = 1.12;
  const JY1 = 2.02;
  const zj = HZ + 0.01;
  const pintura = new THREE.Mesh(new THREE.PlaneGeometry(JX * 2, JY1 - JY0), toon(0xffffff, { mapa: interiorDoGuiche() }));
  pintura.position.set(0, (JY0 + JY1) / 2, zj);
  g.add(pintura);
  const branco = toon(P.metalWhite);
  for (const y of [JY0 - 0.04, JY1 + 0.04]) {
    const travessa = new THREE.Mesh(new THREE.BoxGeometry(JX * 2 + 0.2, 0.08, 0.3), branco);
    travessa.position.set(0, y, zj - 0.06);
    g.add(travessa);
  }
  // os montantes moram ENTRE as travessas (a ponta dentro delas), saem 2 cm
  // para o lado e 2 cm para a frente e para trás: casando as medidas, as
  // faces das quinas dividiam o mesmo plano e serrilhavam
  for (const lado of [-1, 1] as const) {
    const montante = new THREE.Mesh(new THREE.BoxGeometry(0.09, JY1 - JY0 + 0.08, 0.34), branco);
    montante.position.set(lado * (JX + 0.075), (JY0 + JY1) / 2, zj - 0.06);
    g.add(montante);
  }
  const meio = new THREE.Mesh(new THREE.BoxGeometry(0.035, JY1 - JY0 - 0.14, 0.04), branco);
  meio.position.set(0, (JY0 + 0.14 + JY1) / 2, zj + 0.07);
  g.add(meio);
  const vidro = new THREE.Mesh(new THREE.PlaneGeometry(JX * 2, JY1 - JY0 - 0.14), toon(P.glass, { opacity: 0.3 }));
  vidro.position.set(0, (JY0 + 0.14 + JY1) / 2, zj + 0.06);
  g.add(vidro);
  // o arco de cima do guichê, vermelho, com a estrelinha
  const arquinho = new THREE.Mesh(new THREE.TorusGeometry(JX + 0.06, 0.05, 6, 20, Math.PI), toon(P.rodaVermelho));
  arquinho.scale.y = 0.32;
  arquinho.position.set(0, JY1 + 0.08, zj + 0.06);
  g.add(arquinho);

  // o balcão, com mãos-francesas, a sineta e o rolo de bilhetes
  const madeira = toon(P.wood);
  const balcao = new THREE.Mesh(new THREE.BoxGeometry(JX * 2 + 0.36, 0.07, 0.46), madeira);
  balcao.position.set(0, JY0 - 0.08, HZ + 0.17);
  g.add(balcao);
  for (const lado of [-1, 1] as const) {
    const apoio = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.26), toon(P.woodDark));
    apoio.position.set(lado * (JX - 0.1), JY0 - 0.27, HZ + 0.06);
    apoio.rotation.x = -0.55;
    g.add(apoio);
  }
  const dourado = toon(P.gold);
  const sineta = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2), dourado);
  sineta.position.set(0.48, JY0 - 0.045, HZ + 0.24);
  g.add(sineta);
  const botaoDaSineta = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 5), dourado);
  botaoDaSineta.position.set(0.48, JY0 + 0.035, HZ + 0.24);
  g.add(botaoDaSineta);
  const rolo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16).rotateZ(Math.PI / 2), toon(P.rodaVermelho));
  rolo.position.set(-0.45, JY0 + 0.055, HZ + 0.22);
  g.add(rolo);
  const tira = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.006, 0.2), toon(P.rodaMosaicoClaro));
  tira.position.set(-0.45, JY0 - 0.04, HZ + 0.33);
  g.add(tira);

  // ------------------------------------------------------------ o telhado
  const lona = new THREE.Mesh(
    ovalar(new THREE.ConeGeometry(1, TELHADO.alto, 48, 1, true), TELHADO.hx, TELHADO.hz),
    toon(0xffffff, { mapa: listras(16, P.rodaVermelho, P.rodaMosaicoClaro) }),
  );
  lona.position.y = BEIRA + TELHADO.alto / 2;
  g.add(lona);
  // o lambrequim: meias-luas alternando as cores, penduradas na beira
  const pedacos: THREE.BufferGeometry[] = [];
  const GOMOS = 30;
  const cor = new THREE.Color();
  for (let i = 0; i < GOMOS; i++) {
    const { p, giro } = naOval(TELHADO.hx - 0.01, TELHADO.hz - 0.01, (i / GOMOS) * Math.PI * 2);
    const meiaLua = new THREE.CircleGeometry(0.15, 8, Math.PI, Math.PI).rotateY(giro).translate(p.x, BEIRA + 0.005, p.z);
    cor.set(i % 2 === 0 ? P.rodaVermelho : P.rodaMosaicoClaro);
    const n = meiaLua.attributes.position.count;
    const cores = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) cores.set([cor.r, cor.g, cor.b], k * 3);
    meiaLua.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    meiaLua.deleteAttribute('uv');
    pedacos.push(meiaLua);
  }
  const lambrequim = new THREE.Mesh(
    mergeSimples(pedacos),
    toon(0xffffff, { corPorVertice: true, doubleSide: true }),
  );
  g.add(lambrequim);
  // as luzinhas da beira
  const LUZES = 26;
  const luzes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), toon(P.luzDoPortao, { glow: 0.9 }), LUZES);
  const m = new THREE.Matrix4();
  for (let i = 0; i < LUZES; i++) {
    const { p } = naOval(TELHADO.hx + 0.02, TELHADO.hz + 0.02, ((i + 0.5) / LUZES) * Math.PI * 2);
    luzes.setMatrixAt(i, m.makeTranslation(p.x, BEIRA + 0.03, p.z));
  }
  luzes.userData.semSombra = true;
  g.add(luzes);
  // a ponta: a bola dourada, o mastro e a bandeirinha
  const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), dourado);
  ponta.position.y = BEIRA + TELHADO.alto + 0.02;
  g.add(ponta);
  const mastro = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.6, 6), branco);
  mastro.position.y = BEIRA + TELHADO.alto + 0.35;
  g.add(mastro);
  const flamula = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(0.42, -0.1), new THREE.Vector2(0, -0.22)]);
  const bandeira = new THREE.Mesh(new THREE.ShapeGeometry(flamula), toon(P.rodaVermelho, { doubleSide: true }));
  bandeira.position.set(0.02, BEIRA + TELHADO.alto + 0.63, 0);
  bandeira.rotation.y = -0.6;
  g.add(bandeira);

  // ---------------------------------------------- a placa de marquise
  /*
   * EM PÉ NA BEIRA DA FRENTE, e não colada na parede: a parede acima do
   * guichê fica embaixo do beiral, e o que está ali a câmera não vê. Na beira,
   * a placa sobe do telhado como marquise de circo.
   */
  const placa = new THREE.Group();
  placa.position.set(0, BEIRA + 0.42, TELHADO.hz - 0.08);
  placa.rotation.x = -0.12;
  const fundoDaPlaca = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.46, 0.06), toon(P.rodaVermelho));
  placa.add(fundoDaPlaca);
  const borda = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.56, 0.04), dourado);
  borda.position.z = -0.03;
  placa.add(borda);
  const nome = letreiro(texto, 1.32, 0.3, css(P.rodaMosaicoClaro));
  nome.position.z = 0.035;
  placa.add(nome);
  for (const lado of [-1, 1] as const) {
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6), dourado);
    perna.position.set(lado * 0.6, -0.4, -0.04);
    placa.add(perna);
  }
  const bulbos = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 6, 5), toon(P.luzDoPortao, { glow: 0.9 }), 14);
  for (let i = 0; i < 7; i++) {
    for (const y of [-0.25, 0.25]) {
      bulbos.setMatrixAt(i * 2 + (y > 0 ? 1 : 0), m.makeTranslation(-0.66 + i * 0.22, y, 0.02));
    }
  }
  bulbos.userData.semSombra = true;
  placa.add(bulbos);
  g.add(placa);

  return g;
}

/** junta pedaços que já têm os mesmos atributos (posição, normal e cor) */
function mergeSimples(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const prontas = geos.map((x) => (x.index ? x.toNonIndexed() : x));
  let total = 0;
  for (const x of prontas) total += x.attributes.position.count;
  const geo = new THREE.BufferGeometry();
  for (const nome of ['position', 'normal', 'color'] as const) {
    const arr = new Float32Array(total * 3);
    let o = 0;
    for (const x of prontas) {
      arr.set(x.attributes[nome].array as Float32Array, o);
      o += x.attributes[nome].array.length;
    }
    geo.setAttribute(nome, new THREE.BufferAttribute(arr, 3));
  }
  return geo;
}
