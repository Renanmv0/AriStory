import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { quina } from './lojaDeRoupas';
import { uvEmMetrosPorTriangulo } from './acabamento';
import { tramaDeTecido, veioDeMadeira } from './texturasDeCasa';
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
