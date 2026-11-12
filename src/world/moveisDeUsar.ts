import * as THREE from 'three';
import { flat, toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { quina } from './lojaDeRoupas';
import { uvEmMetrosPorTriangulo } from './acabamento';
import { tramaDeTecido, veioDeMadeira } from './texturasDeCasa';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { novaTextura, sorteio } from './texturasDeChao';
import type { UsoDoMovel } from './decoracoes';

/**
 * OS MÓVEIS QUE FAZEM ALGUMA COISA (`docs/QUINTAL.md` §4.4, etapa 4): as peças
 * novas (o balanço de jardim, a rede com suporte e a casinha do Pelusa) e o
 * que se faz em cada móvel do Papita — sentar no banco, sentar à mesinha de
 * frente um para o outro, deitar ao sol, balançar, deitar na rede.
 *
 * O `uso` mexe nos DOIS (são sempre dois em cena): monta uma âncora no
 * mundo, senta ou deita os dois nela (`ridePlayer`/`rideCompanion`), espera o
 * "Ficar mais um pouco?" e solta os dois na frente do móvel. A âncora sai do
 * mundo no fim. As falas são de quem está em cena (o T troca os dois), como as
 * do banco e da mesa de piquenique do motor.
 *
 * O que BALANÇA (o assento do balanço, a rede) é um grupo com NOME dentro da
 * peça — `balanco`, `rede` —: a `fundir()` junta o que está dentro dele e o
 * deixa existir, e o uso acha o grupo pelo nome e o embala. A âncora dos dois
 * vai DENTRO do grupo: balançam junto.
 */

const V = THREE.Vector3;

// =============================================================== as peças

/** O BALANÇO DE JARDIM: estrutura em A de madeira com veio, o banco de dois lugares pendurado por correntes. */
export function balancoDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-balanco';
  const madeira = toon(P.quintalMadeira, { mapa: veioDeMadeira() });
  const ALTO = 2.1;
  const LARGO = 1.25;
  // os dois "A": duas pernas abertas e a travessa de cada lado
  for (const lado of [-1, 1]) {
    for (const z of [-1, 1]) {
      const perna = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.08, ALTO + 0.12, 0.08, 0.015)), madeira);
      perna.position.set(lado * LARGO, ALTO / 2, z * 0.42);
      perna.rotation.x = z * 0.2;
      g.add(perna);
    }
    const trava = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.06, 0.06, 0.8, 0.012)), madeira);
    trava.position.set(lado * LARGO, 0.75, 0);
    g.add(trava);
  }
  // a viga de cima
  const viga = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(LARGO * 2 + 0.3, 0.12, 0.12, 0.02)), madeira);
  viga.position.y = ALTO;
  g.add(viga);
  // o que balança: o pivô na viga, as correntes e o banco
  const balanco = new THREE.Group();
  balanco.name = 'balanco';
  balanco.position.y = ALTO - 0.06;
  g.add(balanco);
  const corrente = toon(P.metalGrey);
  const ASSENTO = 0.5;
  for (const lado of [-1, 1]) {
    for (const z of [-0.18, 0.12]) {
      const elo = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, ALTO - 0.06 - ASSENTO, 4), corrente);
      elo.position.set(lado * 0.7, -(ALTO - 0.06 - ASSENTO) / 2, z);
      balanco.add(elo);
    }
  }
  const banco = new THREE.Group();
  banco.position.y = -(ALTO - 0.06);
  balanco.add(banco);
  for (let i = 0; i < 5; i++) {
    const ripa = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(1.45, 0.03, 0.075, 0.008)), madeira);
    ripa.position.set(0, ASSENTO - 0.015, -0.17 + i * 0.085);
    banco.add(ripa);
  }
  for (let i = 0; i < 3; i++) {
    const ripa = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(1.45, 0.075, 0.03, 0.008)), madeira);
    ripa.position.set(0, ASSENTO + 0.12 + i * 0.1, -0.22);
    ripa.rotation.x = -0.18;
    banco.add(ripa);
  }
  for (const lado of [-1, 1]) {
    const braco = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.05, 0.05, 0.42, 0.01)), madeira);
    braco.position.set(lado * 0.73, ASSENTO + 0.2, -0.02);
    const apoio = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.05, 0.22, 0.05, 0.01)), madeira);
    apoio.position.set(lado * 0.73, ASSENTO + 0.09, 0.15);
    banco.add(braco, apoio);
  }
  // as duas almofadas
  const almofada = toon(P.quintalAlmofadaListra, { mapa: tramaDeTecido() });
  for (const lado of [-1, 1]) {
    const a = new THREE.Mesh(quina(0.6, 0.06, 0.38, 0.03), almofada);
    a.position.set(lado * 0.34, ASSENTO + 0.03, 0.0);
    banco.add(a);
  }
  return g;
}

/** a lona da rede: uma malha que pende entre os dois ganchos, listrada por vértice */
function lonaDaRede(comprido: number, largo: number, barriga: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(comprido, largo, 24, 8);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.getAttribute('position');
  const cores = new Float32Array(pos.count * 3);
  const c1 = new THREE.Color(P.redeListraA);
  const c2 = new THREE.Color(P.redeListraB);
  const c3 = new THREE.Color(P.quintalAlmofada);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const t = x / comprido + 0.5;
    const k = z / largo + 0.5;
    // pende no meio, e a lona se fecha pelas bordas (a rede abraça)
    const y = -barriga * Math.sin(Math.PI * t) + Math.pow(Math.abs(k - 0.5) * 2, 2) * 0.16 * Math.sin(Math.PI * t);
    // nas pontas, a lona junta num feixe (os punhos)
    const aperto = 0.25 + 0.75 * Math.sin(Math.PI * t);
    pos.setXYZ(i, x, y, z * aperto);
    const faixa = Math.floor(k * 8);
    (faixa % 3 === 0 ? c1 : faixa % 3 === 1 ? c3 : c2).toArray(cores, i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  geo.computeVertexNormals();
  return geo;
}

/** A REDE COM SUPORTE: o suporte de madeira em arco e a rede listrada pendurada, para os dois. */
export function redeComSuporte(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-rede';
  const madeira = toon(P.quintalMadeira, { mapa: veioDeMadeira() });
  const VAO = 2.9;
  const GANCHO = 1.25;
  // o suporte: duas vigas curvas (tubo de seção quadrada por uma curva) e os pés
  for (const z of [-0.32, 0.32]) {
    const pts = [
      new V(-VAO / 2 - 0.1, GANCHO + 0.05, z * 0.3), new V(-VAO / 2 + 0.3, 0.45, z * 0.8),
      new V(0, 0.08, z), new V(VAO / 2 - 0.3, 0.45, z * 0.8), new V(VAO / 2 + 0.1, GANCHO + 0.05, z * 0.3),
    ];
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.045, 4, false), madeira));
  }
  for (const x of [-0.9, 0, 0.9]) {
    const pe = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.1, 0.06, 0.95, 0.015)), madeira);
    pe.position.set(x, 0.03, 0);
    g.add(pe);
  }
  // o que balança: a rede inteira, em volta da linha dos ganchos
  const rede = new THREE.Group();
  rede.name = 'rede';
  rede.position.y = GANCHO;
  g.add(rede);
  const cordas = toon(P.quintalAlmofada);
  for (const lado of [-1, 1]) {
    const punho = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.4, 4), cordas);
    punho.rotation.z = Math.PI / 2;
    punho.position.set(lado * (VAO / 2 - 0.15), -0.04, 0);
    rede.add(punho);
    const argola = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 12), toon(P.metalGrey));
    argola.position.set(lado * (VAO / 2 + 0.05), 0, 0);
    rede.add(argola);
  }
  const lona = new THREE.Mesh(lonaDaRede(VAO - 0.75, 0.95, 0.62), toon(0xffffff, { corPorVertice: true, doubleSide: true, mapa: tramaDeTecido() }));
  lona.position.y = -0.06;
  rede.add(lona);
  // a franjinha das bordas (um fio a cada 12 cm, nas duas beiras)
  for (const lado of [-1, 1]) {
    for (let i = 0; i < 16; i++) {
      const t = (i + 0.5) / 16;
      const x = (t - 0.5) * (VAO - 0.9);
      const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.12, 3), cordas);
      fio.position.set(x, -0.06 - 0.62 * Math.sin(Math.PI * t) + 0.12, lado * 0.47 * (0.25 + 0.75 * Math.sin(Math.PI * t)));
      rede.add(fio);
    }
  }
  return g;
}

/** a plaquinha com o nome dele, em canvas */
function plaquinhaDoPelusa(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fff7e6';
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 88, 22);
    ctx.fill();
    ctx.fillStyle = '#7a5236';
    ctx.font = '900 46px "Nunito", ui-rounded, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Pelusa', 128, 64);
  }
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
let plaquinha: THREE.CanvasTexture | null = null;

/** A CASINHA DO PELUSA: de madeira, telhado de duas águas, a porta em arco, a almofada e a plaquinha com o nome. */
export function casinhaDoPelusa(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-casinha-do-pelusa';
  const pintura = toon(P.casinhaDoPelusa, { mapa: veioDeMadeira() });
  const L = 0.62;
  const F = 0.55;
  const A = 0.48;
  // as paredes: a da frente com a porta em arco (forma com furo, extrudada)
  const frente = new THREE.Shape();
  frente.moveTo(-L / 2, 0);
  frente.lineTo(L / 2, 0);
  frente.lineTo(L / 2, A);
  frente.lineTo(0, A + 0.24);
  frente.lineTo(-L / 2, A);
  frente.closePath();
  const porta = new THREE.Path();
  porta.moveTo(-0.13, 0.0);
  porta.lineTo(0.13, 0.0);
  porta.lineTo(0.13, 0.2);
  porta.absarc(0, 0.2, 0.13, 0, Math.PI, false);
  porta.lineTo(-0.13, 0.0);
  frente.holes.push(porta);
  for (const z of [F / 2, -F / 2]) {
    const forma = z > 0 ? frente : (() => {
      const f = new THREE.Shape();
      f.moveTo(-L / 2, 0); f.lineTo(L / 2, 0); f.lineTo(L / 2, A); f.lineTo(0, A + 0.24); f.lineTo(-L / 2, A); f.closePath();
      return f;
    })();
    const geo = new THREE.ExtrudeGeometry(forma, { depth: 0.03, bevelEnabled: false, curveSegments: 10 });
    const m = new THREE.Mesh(uvEmMetrosPorTriangulo(geo), pintura);
    m.position.z = z - 0.015;
    g.add(m);
  }
  for (const lado of [-1, 1]) {
    const lateral = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.03, A, F, 0.006)), pintura);
    lateral.position.set(lado * (L / 2 - 0.015), A / 2, 0);
    g.add(lateral);
  }
  const chao = new THREE.Mesh(quina(L, 0.04, F, 0.008), pintura);
  chao.position.y = 0.02;
  g.add(chao);
  // o telhado: duas abas de telhinha (a cor do telhado da casa do Ari)
  const telha = toon(P.roofTile);
  const aba = Math.hypot(L / 2, 0.24) + 0.08;
  for (const lado of [-1, 1]) {
    const m = new THREE.Mesh(quina(aba, 0.035, F + 0.12, 0.01), telha);
    m.position.set(lado * L / 4, A + 0.13, 0);
    m.rotation.z = -lado * Math.atan2(0.24, L / 2);
    g.add(m);
  }
  // a almofada redonda lá dentro (aparece pela porta)
  const almofada = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 18), toon(P.flowerPink, { mapa: tramaDeTecido() }));
  almofada.position.set(0, 0.07, 0);
  g.add(almofada);
  // a plaquinha com o nome em cima da porta
  plaquinha ??= plaquinhaDoPelusa();
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.08), toon(0xffffff, { mapa: plaquinha }));
  placa.position.set(0, 0.42, F / 2 + 0.017);
  g.add(placa);
  // a tigelinha do lado de fora
  const tigela = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.001, 0), new THREE.Vector2(0.06, 0), new THREE.Vector2(0.075, 0.04), new THREE.Vector2(0.065, 0.045), new THREE.Vector2(0.001, 0.03),
  ], 14), toon(P.quintalAlmofadaListra));
  tigela.position.set(L / 2 + 0.12, 0, F / 2 - 0.05);
  g.add(tigela);
  return g;
}

// ============================================================ a piscininha

/** as medidas da piscininha (a cena não lê: a ficha tem a pegada) */
const PISCININHA = { R: 0.82, tubo: 0.14, topo: 0.52, agua: 0.3, onda: 0.318 } as const;

/** um tubo inflável em gomos de duas cores (pela cor do vértice, numa malha só) */
function tuboEmGomos(y: number, cor1: number, cor2: number): THREE.Mesh {
  const geo = new THREE.TorusGeometry(PISCININHA.R, PISCININHA.tubo, 10, 48).rotateX(-Math.PI / 2).toNonIndexed();
  const pos = geo.getAttribute('position');
  const cores = new Float32Array(pos.count * 3);
  const a = new THREE.Color(cor1);
  const b = new THREE.Color(cor2);
  for (let t = 0; t < pos.count; t += 3) {
    let ax = 0;
    let az = 0;
    for (let k = 0; k < 3; k++) {
      ax += pos.getX(t + k);
      az += pos.getZ(t + k);
    }
    const gomo = Math.floor(((Math.atan2(az, ax) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 12);
    for (let k = 0; k < 3; k++) (gomo % 2 ? b : a).toArray(cores, (t + k) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  geo.translate(0, y, 0);
  return new THREE.Mesh(geo, toon(0xffffff, { corPorVertice: true }));
}

/** a água: faixas macias de luz e sombra num canvas claro (a cor vem do material) */
function texturaDaAgua(): THREE.CanvasTexture {
  return novaTextura('agua-da-piscininha', 1.0, (ctx, s) => {
    const rnd = sorteio(2026);
    ctx.fillStyle = '#f4fcff';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 26; i++) {
      const y = rnd() * s;
      const x = rnd() * s;
      const l = s * (0.25 + rnd() * 0.3);
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(150,205,230,0.55)';
      ctx.lineWidth = 2 + rnd() * 3;
      for (const dx of [-s, 0, s]) {
        ctx.beginPath();
        ctx.moveTo(x + dx, y);
        ctx.bezierCurveTo(x + dx + l * 0.3, y - 8, x + dx + l * 0.6, y + 8, x + dx + l, y);
        ctx.stroke();
      }
    }
  });
}

/** O PATINHO DE BORRACHA que boia: corpo, cabeça, bico, olhinhos e o rabinho. */
function patinhoDeBorracha(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'patinho';
  const amarelo = toon(P.patinhoAmarelo);
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 9), amarelo);
  corpo.scale.set(1, 0.8, 1.2);
  corpo.position.y = 0.06;
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), amarelo);
  cabeca.position.set(0, 0.17, 0.08);
  const rabo = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.07, 6), amarelo);
  rabo.rotation.x = -1.9;
  rabo.position.set(0, 0.1, -0.12);
  const bico = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.018, 0.05), toon(P.patinhoBico));
  bico.position.set(0, 0.16, 0.14);
  g.add(corpo, cabeca, rabo, bico);
  for (const lado of [-1, 1]) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.01, 6, 5), toon(P.fogueiraCinza));
    olho.position.set(lado * 0.032, 0.19, 0.125);
    g.add(olho);
    const asa = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), amarelo);
    asa.scale.set(0.45, 0.8, 1.1);
    asa.position.set(lado * 0.095, 0.075, -0.01);
    g.add(asa);
  }
  return g;
}

/**
 * A PISCININHA DE PLÁSTICO: dois anéis infláveis em gomos (azul e creme,
 * terracota e creme), o fundo, a água com a luz mexendo, o patinho boiando e
 * o lote das marolinhas. A base em `y = 0`, a frente `+Z`; é do lado de `+Z`
 * que os dois sentam na beirada. Uma peça que se mexe E é fundida
 * (`fundirComAnima`): o que a anima mexe é malha de água, lote ou grupo com
 * nome (`patinho`).
 */
export function piscininhaDePlastico(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-piscininha';
  const { R, tubo, topo, agua, onda } = PISCININHA;
  g.add(tuboEmGomos(tubo, P.quintalAlmofadaListra, P.quintalLona));
  g.add(tuboEmGomos(topo - tubo, P.quintalLonaListra, P.quintalLona));
  const fundo = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.02, R - 0.02, 0.02, 36), toon(P.piscininhaFundo));
  fundo.position.y = 0.02;
  g.add(fundo);
  // a água: translúcida, e a luz corre devagar (o `offset` da textura)
  const mar = new THREE.Mesh(new THREE.CircleGeometry(R - 0.03, 40).rotateX(-Math.PI / 2), toon(P.piscininhaAgua, { opacity: 0.86, mapa: texturaDaAgua() }));
  mar.position.y = agua;
  mar.userData.semSombra = true;
  g.add(mar);
  g.userData.agua = mar;
  const patinho = patinhoDeBorracha();
  patinho.position.set(0.3, agua - 0.015, -0.1);
  g.add(patinho);
  g.userData.patinho = patinho;
  // as marolinhas: oito anéis num lote, todos escondidos (escala zero) até alguém chutar
  const ondas = new THREE.InstancedMesh(new THREE.RingGeometry(0.82, 1, 28).rotateX(-Math.PI / 2), flat(P.piscininhaOnda, 0.8), 8);
  ondas.frustumCulled = false;
  ondas.userData.semSombra = true;
  g.add(ondas);
  g.userData.ondas = ondas;
  g.userData.listaDeOndas = [] as Array<{ x: number; z: number; t0: number } | undefined>;
  animarPiscininha(g, 0);
  void onda;
  return g;
}

const M4 = new THREE.Matrix4();
const Q4 = new THREE.Quaternion();
const V3 = new THREE.Vector3();

/** a água corre, o patinho boia e passeia, e quem chuta (`userData.chutando`) faz marolinha */
export function animarPiscininha(peca: THREE.Object3D, t: number): void {
  const u = peca.userData;
  u.relogio = t;
  const mar = u.agua as THREE.Mesh | undefined;
  const mapa = (mar?.material as THREE.MeshToonMaterial | undefined)?.map;
  if (mapa) mapa.offset.set(t * 0.018, t * 0.011);
  const patinho = u.patinho as THREE.Object3D | undefined;
  if (patinho) {
    const a = t * 0.28;
    patinho.position.x = Math.cos(a) * 0.36;
    patinho.position.z = Math.sin(a) * 0.36;
    patinho.position.y = PISCININHA.agua - 0.015 + Math.sin(t * 1.7) * 0.008;
    patinho.rotation.y = -a + Math.PI;
    patinho.rotation.z = Math.sin(t * 1.3) * 0.05;
  }
  const ondas = u.ondas as THREE.InstancedMesh | undefined;
  const lista = u.listaDeOndas as Array<{ x: number; z: number; t0: number } | undefined> | undefined;
  if (!ondas || !lista) return;
  if (u.chutando === true && t >= ((u.proximoChute as number | undefined) ?? 0)) {
    u.proximoChute = t + 0.5 + Math.random() * 0.4;
    u.pe = u.pe === 1 ? -1 : 1;
    u.indiceDaOnda = (((u.indiceDaOnda as number | undefined) ?? -1) + 1) % 8;
    lista[u.indiceDaOnda as number] = { x: (u.pe as number) * 0.34, z: 0.46, t0: t };
  }
  for (let i = 0; i < 8; i++) {
    const o = lista[i];
    const idade = o ? t - o.t0 : 99;
    const k = idade > 1.5 ? 0 : 0.05 + idade * 0.28;
    V3.set(o?.x ?? 0, PISCININHA.onda, o?.z ?? 0);
    M4.compose(V3, Q4, new THREE.Vector3(k, 1, k));
    ondas.setMatrixAt(i, M4);
  }
  ondas.instanceMatrix.needsUpdate = true;
}

// ============================================================== o fogo de chão

/** o toquinho de sentar: a altura do assento e a distância do centro */
const FOGUEIRA = { banco: 0.352, dist: 0.88 } as const;

/** a faixa de chama que sobe: um cone de altura 1, a base em `y = 0` */
function geoDaChama(): THREE.BufferGeometry {
  return new THREE.ConeGeometry(0.1, 1, 6, 1).translate(0, 0.5, 0);
}

interface Chama { x: number; z: number; h: number; w: number; fase: number }

/**
 * O FOGO DE CHÃO: o anel de pedras em dois andares (um lote, cor por cópia), a
 * cinza, as toras encostadas umas nas outras, dois toquinhos para sentar
 * frente a frente, e o `fogo` — um grupo com NOME que a anima liga e desliga:
 * as línguas de fogo (um lote, cor por cópia), as faíscas subindo (outro), o
 * halo e a poça de luz no chão. Luz pintada, nenhuma `PointLight`.
 */
export function fogueiraDeChao(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-fogueira';
  g.userData.aceso = true;
  // a cinza em volta (decalque) e o monte de brasa por baixo das toras
  const cinza = new THREE.Mesh(new THREE.CircleGeometry(0.52, 28).rotateX(-Math.PI / 2), toon(P.fogueiraCinza, { decal: true }));
  cinza.position.y = 0.014;
  cinza.renderOrder = 3;
  cinza.userData.semSombra = true;
  g.add(cinza);
  const brasa = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 6), toon(P.fogueiraBrasa, { glow: 0.85 }));
  brasa.scale.y = 0.28;
  brasa.position.y = 0.05;
  g.add(brasa);
  // as pedras: doze embaixo e oito em cima, dos três tons
  const rnd = sorteio(7007);
  const pedras = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), toon(0xffffff), 20);
  const tons = [P.fogueiraPedra, P.fogueiraPedraClara, P.fogueiraPedraEscura];
  const c = new THREE.Color();
  for (let i = 0; i < 20; i++) {
    const baixo = i < 12;
    const a = baixo ? (i / 12) * Math.PI * 2 : ((i - 12 + 0.5) / 8) * Math.PI * 2;
    const r = baixo ? 0.57 : 0.53;
    Q4.setFromEuler(new THREE.Euler(0, -a + (rnd() - 0.5) * 0.4, 0));
    const s = 0.9 + rnd() * 0.25;
    M4.compose(new THREE.Vector3(Math.cos(a) * r, baixo ? 0.065 : 0.17, Math.sin(a) * r), Q4, new THREE.Vector3(1.25 * s, 0.75 * s, 0.95 * s));
    pedras.setMatrixAt(i, M4);
    pedras.setColorAt(i, c.set(tons[Math.floor(rnd() * tons.length)]));
  }
  g.add(pedras);
  // as toras encostadas, apoiadas umas nas outras (a ponta de cima no meio)
  const casca = toon(P.fogueiraTora, { mapa: veioDeMadeira() });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    const base = new V(Math.cos(a) * 0.36, 0.07, Math.sin(a) * 0.36);
    const topoDaTora = new V(Math.cos(a) * 0.05, 0.5, Math.sin(a) * 0.05);
    const eixo = topoDaTora.clone().sub(base);
    const L = eixo.length();
    const geo = new THREE.CylinderGeometry(0.045, 0.055, L, 8);
    geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new V(0, 1, 0), eixo.clone().normalize()));
    geo.translate((base.x + topoDaTora.x) / 2, (base.y + topoDaTora.y) / 2, (base.z + topoDaTora.z) / 2);
    g.add(new THREE.Mesh(uvEmMetrosPorTriangulo(geo), casca));
  }
  // os dois toquinhos de sentar, um de cada lado, com o topo claro
  for (const lado of [-1, 1]) {
    const toco = new THREE.Mesh(uvEmMetrosPorTriangulo(new THREE.CylinderGeometry(0.17, 0.19, FOGUEIRA.banco - 0.012, 12)), toon(P.fogueiraBanco, { mapa: veioDeMadeira() }));
    toco.position.set(lado * FOGUEIRA.dist, (FOGUEIRA.banco - 0.012) / 2, 0);
    const topo = new THREE.Mesh(new THREE.CylinderGeometry(0.168, 0.168, 0.012, 12), toon(P.fogueiraBancoTopo));
    topo.position.set(lado * FOGUEIRA.dist, FOGUEIRA.banco - 0.006 + 0.0005, 0);
    g.add(toco, topo);
  }
  // o fogo: línguas em um lote (cor por cópia: brasa, laranja e a clarinha), faíscas, halo e poça
  const fogo = new THREE.Group();
  fogo.name = 'fogo';
  const chamas: Chama[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const camada = i % 3;
    chamas.push({
      x: Math.cos(a) * (0.1 - camada * 0.03), z: Math.sin(a) * (0.1 - camada * 0.03),
      h: [0.55, 0.4, 0.27][camada] * (0.9 + rnd() * 0.25), w: [1.1, 0.9, 0.7][camada], fase: rnd() * 6.28,
    });
  }
  const linguas = new THREE.InstancedMesh(geoDaChama(), flat(0xffffff), chamas.length);
  chamas.forEach((_, i) => linguas.setColorAt(i, c.set([P.fogueiraBrasa, P.fogueiraChama, P.fogueiraChamaClara][i % 3])));
  linguas.frustumCulled = false;
  linguas.userData.semSombra = true;
  const faiscas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.02, 5, 4), flat(P.fogueiraChamaClara), 10);
  faiscas.frustumCulled = false;
  faiscas.userData.semSombra = true;
  fogo.add(linguas, faiscas);
  const halo = haloDeLampada(1.7, P.fogueiraChama, 0.55);
  halo.position.y = 0.4;
  fogo.add(halo);
  const poca = pocaDeLuz(1.25, P.fogueiraChama, 0.3);
  poca.position.y = 0.03;
  fogo.add(poca);
  g.add(fogo);
  g.userData.fogo = fogo;
  g.userData.linguas = linguas;
  g.userData.faiscas = faiscas;
  g.userData.chamas = chamas;
  animarFogueira(g, 0);
  return g;
}

/** as línguas tremem, as faíscas sobem e somem, e o `fogo` só aparece aceso */
export function animarFogueira(peca: THREE.Object3D, t: number): void {
  const u = peca.userData;
  const fogo = u.fogo as THREE.Object3D | undefined;
  const linguas = u.linguas as THREE.InstancedMesh | undefined;
  const faiscas = u.faiscas as THREE.InstancedMesh | undefined;
  const chamas = u.chamas as Chama[] | undefined;
  if (!fogo || !linguas || !faiscas || !chamas) return;
  fogo.visible = u.aceso !== false;
  if (!fogo.visible) return;
  chamas.forEach((c, i) => {
    const h = c.h * (1 + Math.sin(t * 9 + c.fase) * 0.16 + Math.sin(t * 15.5 + c.fase * 2) * 0.09);
    const w = c.w * (1 + Math.sin(t * 11 + c.fase) * 0.08);
    Q4.setFromEuler(new THREE.Euler(Math.sin(t * 5 + c.fase) * 0.07, 0, Math.cos(t * 4.3 + c.fase) * 0.07));
    M4.compose(V3.set(c.x, 0.1, c.z), Q4, new THREE.Vector3(w, h, w));
    linguas.setMatrixAt(i, M4);
  });
  linguas.instanceMatrix.needsUpdate = true;
  for (let i = 0; i < 10; i++) {
    const vida = ((t * 0.7 + i * 0.37) % 1);
    const a = i * 2.4 + Math.floor(t * 0.7 + i * 0.37) * 1.3;
    const s = Math.max(0.001, 1 - vida);
    M4.compose(
      V3.set(Math.cos(a) * 0.12 + Math.sin(t * 3 + i) * 0.05 * vida, 0.3 + vida * 0.95, Math.sin(a) * 0.12 + Math.cos(t * 2.6 + i) * 0.05 * vida),
      Q4.identity(), new THREE.Vector3(s, s, s),
    );
    faiscas.setMatrixAt(i, M4);
  }
  faiscas.instanceMatrix.needsUpdate = true;
}

// =============================================================== os usos

/** a âncora no mundo, presa na peça (ou num grupo dela), com o giro dela; sai do mundo no fim */
function ancora(pai: THREE.Object3D, x: number, y: number, z: number, giroY = 0, giroX = 0): THREE.Object3D {
  const a = new THREE.Object3D();
  a.position.set(x, y, z);
  a.rotation.set(giroX, giroY, 0);
  pai.add(a);
  return a;
}

/** um ponto no mundo, a partir do local da peça */
function noMundo(peca: THREE.Object3D, x: number, y: number, z: number): THREE.Vector3 {
  peca.updateMatrixWorld(true);
  return peca.localToWorld(new V(x, y, z));
}

/** "Ficar mais um pouco?" até dizer que não; `aCada` roda enquanto ficam (o balanço embalando) */
async function ficar(u: UsoDoMovel, aCada?: (t: number) => void): Promise<void> {
  let escolha = 0;
  let t = 0;
  while (escolha === 0) {
    if (aCada) {
      for (let k = 0; k < 120; k++) {
        t += 1 / 30;
        aCada(t);
        await u.g.wait(1 / 30);
      }
    }
    escolha = await u.g.ask('Ficar mais um pouco?', ['Ficar', 'Levantar']);
    if (escolha === 0 && !aCada) await u.g.wait(4);
  }
}

/** solta os dois na frente da peça (o `+Z` dela), lado a lado, de frente para ela */
function soltarNaFrente(u: UsoDoMovel, longe: number, lado = 0.5): void {
  const f = u.giro;
  const fx = Math.sin(f) * longe;
  const fz = Math.cos(f) * longe;
  u.g.releasePlayer(u.x + fx - Math.cos(f) * lado, u.z + fz + Math.sin(f) * lado, f + Math.PI);
  u.g.releaseCompanion(u.x + fx + Math.cos(f) * lado, u.z + fz - Math.sin(f) * lado, f + Math.PI);
  u.g.lockPlayer(false);
}

/** SENTAR NO BANCO de jardim: o mesmo do banco de praça do motor (lado a lado, de mãos dadas). */
export async function sentarNoBanco(u: UsoDoMovel): Promise<void> {
  const { g } = u;
  g.lockPlayer(true);
  const assento = ancora(u.peca, 0, 0, 0, Math.PI);
  g.ridePlayer(assento, new V(-0.46, 0.06, 0.02), 1, Math.PI);
  g.rideCompanion(assento, new V(0.46, 0.06, 0.02), 1, Math.PI);
  g.setSitting(true);
  await g.wait(0.5);
  await g.say(['Senta aqui um pouco.'], g.companionName());
  await g.say(['Só um pouquinho.'], g.playerName());
  await ficar(u);
  g.setSitting(false);
  soltarNaFrente(u, 1.4);
  u.peca.remove(assento);
}

/** SENTAR À MESINHA: cada um numa cadeirinha, de frente um para o outro. */
export async function sentarAMesinha(u: UsoDoMovel): Promise<void> {
  const { g } = u;
  g.lockPlayer(true);
  const assento = ancora(u.peca, 0, 0, 0);
  // (a cadeirinha da esquerda olha para o +X e a da direita para o −X)
  g.ridePlayer(assento, new V(-0.6, 0.03, 0), 1, Math.PI / 2);
  g.rideCompanion(assento, new V(0.6, 0.03, 0), 1, -Math.PI / 2);
  g.setSitting(true);
  await g.wait(0.5);
  await g.say(['Um café aqui fora?'], g.companionName());
  await g.say(['Com você, sempre.'], g.playerName());
  await ficar(u);
  g.setSitting(false);
  soltarNaFrente(u, 1.3, 0.7);
  u.peca.remove(assento);
}

/** DEITAR AO SOL na espreguiçadeira: o descanso de sempre, sem pressa. */
export async function deitarAoSol(u: UsoDoMovel): Promise<void> {
  const { g } = u;
  await g.say(['Sol na cara e ninguém com pressa.'], g.companionName());
  await g.say([`Mais dez minutinhos, ${g.companionName()}.`], g.playerName());
  g.toast('+1 preguiça boa', '🌞');
}

/** BALANÇAR: os dois no banco do balanço, e ele embala para a frente e para trás. */
export async function balancar(u: UsoDoMovel): Promise<void> {
  const { g } = u;
  const pivo = u.peca.getObjectByName('balanco');
  if (!pivo) return;
  g.lockPlayer(true);
  // a âncora DENTRO do pivô: o banco está 2,04 m abaixo dele
  const assento = ancora(pivo, 0, -2.04, 0, Math.PI);
  g.ridePlayer(assento, new V(-0.34, 0.04, 0.02), 1, Math.PI);
  g.rideCompanion(assento, new V(0.34, 0.04, 0.02), 1, Math.PI);
  g.setSitting(true);
  await g.wait(0.4);
  await g.say(['Segura firme.'], g.companionName());
  await g.say(['Tô segurando você.'], g.playerName());
  let amplitude = 0;
  await ficar(u, (t) => {
    amplitude = Math.min(0.22, amplitude + 0.004);
    pivo.rotation.x = Math.sin(t * 2.1) * amplitude;
  });
  // para devagar
  for (let k = 0; k < 40; k++) {
    pivo.rotation.x *= 0.88;
    await g.wait(1 / 30);
  }
  pivo.rotation.x = 0;
  g.setSitting(false);
  soltarNaFrente(u, 1.3);
  pivo.remove(assento);
}

/** DEITAR NA REDE: os dois deitados lado a lado na lona, e a rede embala de leve. */
export async function deitarNaRede(u: UsoDoMovel): Promise<void> {
  const { g } = u;
  const rede = u.peca.getObjectByName('rede');
  if (!rede) return;
  g.lockPlayer(true);
  // deitados: a âncora com o `rotation.x = −PI/2` (o corpo vira para o céu), e
  // girada para a cabeça ir para o `+X` da rede; os pés na ponta do `−X`
  const eixo = ancora(rede, -0.82, -0.52, 0, -Math.PI / 2);
  const deitados = ancora(eixo, 0, 0, 0, 0, -Math.PI / 2);
  g.ridePlayer(deitados, new V(-0.2, 0, 0), 1, 0);
  g.rideCompanion(deitados, new V(0.2, 0, 0), 1, 0);
  g.setLying(true);
  // a câmera de cima, como na cama do quarto: deitados, a isométrica encurta os corpos
  const olho = noMundo(u.peca, 0.4, 3.6, 1.6);
  const alvo = noMundo(u.peca, 0, 0.6, 0);
  g.setCameraOmbro(olho, alvo);
  await g.wait(0.8);
  await g.say(['Cabe nós dois?'], g.companionName());
  await g.say(['Sempre cabe.'], g.playerName());
  await ficar(u, (t) => {
    rede.rotation.x = Math.sin(t * 1.4) * 0.12;
  });
  rede.rotation.x = 0;
  g.setLying(false);
  g.setCameraOmbro(null);
  soltarNaFrente(u, 1.2, 0.6);
  eixo.remove(deitados);
  rede.remove(eixo);
}

/** PÔR O PÉ NA ÁGUA: os dois sentam na beirada da piscininha, o pé na água, e a marolinha vem de cada chute. */
export async function sentarNaPiscininha(u: UsoDoMovel): Promise<void> {
  const { g } = u;
  g.lockPlayer(true);
  // a âncora na beirada de `+Z`; o corpo desce 0,47 abaixo do topo do tubo (o quadril do rig)
  const assento = ancora(u.peca, 0, PISCININHA.topo - 0.47, PISCININHA.R, 0);
  g.ridePlayer(assento, new V(-0.34, 0, -0.075), 1, Math.PI);
  g.rideCompanion(assento, new V(0.34, 0, -0.075), 1, Math.PI);
  g.setSitting(true, 'beirada');
  u.peca.userData.chutando = true;
  await g.wait(0.6);
  // [provisório] falas minhas, até o Renan mandar as dele
  await g.say(['Cabe só o pé, mas o pé já tá feliz.'], g.playerName());
  await g.say(['O patinho tá olhando pra gente.'], g.companionName());
  let escolha = 0;
  while (escolha === 0) {
    for (let k = 0; k < 6; k++) {
      await g.wait(0.7);
      g.som('respingo');
    }
    escolha = await g.ask('Ficar mais um pouco?', ['Ficar', 'Levantar']);
  }
  u.peca.userData.chutando = false;
  g.setSitting(false);
  soltarNaFrente(u, 1.5, 0.5);
  u.peca.remove(assento);
}

/** CHEGAR PERTO DO FOGO: acender, apagar, ou sentar nos toquinhos de frente um para o outro. */
export async function usarFogueira(u: UsoDoMovel): Promise<void> {
  const { g } = u;
  const aceso = u.peca.userData.aceso !== false;
  const o = await g.ask('O fogo', aceso ? ['Sentar em volta', 'Apagar o fogo', 'Agora não'] : ['Acender o fogo', 'Sentar em volta', 'Agora não']);
  if (o === 2) return;
  const quer = aceso ? (o === 0 ? 'sentar' : 'apagar') : (o === 0 ? 'acender' : 'sentar');
  if (quer === 'apagar') {
    u.peca.userData.aceso = false;
    g.som('chamaApaga');
    g.toast('Fogo apagado', '💨');
    return;
  }
  if (quer === 'acender') {
    u.peca.userData.aceso = true;
    g.som('chamaAcende');
    g.toast('Fogo aceso', '🔥');
    return;
  }
  g.lockPlayer(true);
  const assento = ancora(u.peca, 0, 0, 0);
  const y = FOGUEIRA.banco - 0.47;
  g.ridePlayer(assento, new V(-FOGUEIRA.dist, y, 0), 1, Math.PI / 2);
  g.rideCompanion(assento, new V(FOGUEIRA.dist, y, 0), 1, -Math.PI / 2);
  g.setSitting(true);
  await g.wait(0.5);
  // [provisório] falas minhas, até o Renan mandar as dele
  await g.say(['Tá quentinho aqui.'], g.companionName());
  await g.say(['É o fogo ou é você?'], g.playerName());
  await ficar(u);
  g.setSitting(false);
  soltarNaFrente(u, 1.5, 0.6);
  u.peca.remove(assento);
}
