/**
 * AS ÁRVORES DO PARQUE — a segunda versão das quatro espécies do `tree()`.
 *
 * As antigas eram um cilindro e bolotas lisas de uma cor (a palmeira, sete
 * esferas achatadas), e cada uma eram de 4 a 8 malhas. Estas:
 *
 * - **uma malha só por árvore, um material só** (`toon` branco com a cor
 *   pintada nos VÉRTICES): o degradê da copa, o tom de cada folha e os anéis
 *   do tronco da palmeira saem sem um triângulo a mais — e o desenho por
 *   quadro cai de 4-8 para 1;
 * - **redonda e florida**: tronco torneado com o pé largo e três raízes,
 *   três galhos e dois raminhos entrando nos tufos, e a copa de sete tufos
 *   AMASSADOS cobertos de FOLHINHAS (losangos dobrados na nervura, espalhados
 *   pela espiral de Fibonacci, com a ponta levantando: elas recortam a borda
 *   da copa); na florida, metade delas é florzinha de cinco pétalas, e caem
 *   pétalas em volta do pé;
 * - **pinheiro**: cinco saias de agulha de nove pontas, com a borda em
 *   estrela caída e a barriga escura;
 * - **palmeira**: o tronco curvo em degraus (anel gordo, anel magro) com os
 *   anéis pintados, dez folhas de FOLÍOLOS pendendo dos dois lados da
 *   nervura, duas folhas secas penduradas, os cocos e o miolo da coroa.
 *
 * O tamanho por fora é o das antigas (a altura da copa, o raio, a altura do
 * tronco): o ponto cego da câmera, a janela da clareira e o sol nascendo da
 * barraca (`scripts/noite.mjs`) foram medidos com elas.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';

export type TipoDeArvore = 'redonda' | 'pinheiro' | 'palmeira' | 'florida';

/** a cor de um vértice; `face` é o número do triângulo dele (os três cantos têm o mesmo) */
type Tinta = (p: THREE.Vector3, n: THREE.Vector3, alvo: THREE.Color, face: number) => void;

/** ruído de 0 a 1 sorteado pela POSIÇÃO arredondada (o mesmo canto, o mesmo número) */
function ruido(x: number, y: number, z: number, semente: number): number {
  const n = Math.sin(
    Math.round(x * 1000) * 12.9898 + Math.round(y * 1000) * 78.233 + Math.round(z * 1000) * 37.719 + semente * 53.1,
  ) * 43758.5453;
  return n - Math.floor(n);
}

/** sem índice, sem UV, e com a cor de cada vértice pela `tinta` */
function pintar(geo: THREE.BufferGeometry, tinta: Tinta): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g.getAttribute('uv')) g.deleteAttribute('uv');
  if (!g.getAttribute('normal')) g.computeVertexNormals();
  const pos = g.getAttribute('position');
  const nor = g.getAttribute('normal');
  const cores = new Float32Array(pos.count * 3);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    n.fromBufferAttribute(nor, i);
    tinta(p, n, c, Math.floor(i / 3));
    cores[i * 3] = c.r;
    cores[i * 3 + 1] = c.g;
    cores[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return g;
}

const cor = (hex: number): THREE.Color => new THREE.Color(hex);

/** o degradê de três cores (0 = fundo, 0,5 = meio, 1 = claro) */
function degrade(alvo: THREE.Color, t: number, fundo: THREE.Color, meio: THREE.Color, claro: THREE.Color): THREE.Color {
  const k = Math.max(0, Math.min(1, t));
  return k < 0.5 ? alvo.copy(fundo).lerp(meio, k * 2) : alvo.copy(meio).lerp(claro, (k - 0.5) * 2);
}

/**
 * Um TUFO de copa: icosaedro amassado pela posição e achatado embaixo. A
 * normal fica a da esfera de antes de amassar (a luz do toon continua
 * redonda; o amassado aparece na silhueta).
 */
function tufo(raio: number, detalhe: number, cx: number, cy: number, cz: number, semente: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(raio, detalhe);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const nor = geo.getAttribute('normal') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const k = 1 + (ruido(x, y, z, semente) - 0.5) * 0.3;
    // a barriga do tufo achata (a copa senta nos galhos, não boia em bola)
    const ya = y < 0 ? y * 0.7 : y * 0.92;
    pos.setXYZ(i, x * k + cx, ya * k + cy, z * k + cz);
    const l = Math.hypot(x, y, z) || 1;
    nor.setXYZ(i, x / l, y / l, z / l);
  }
  return geo;
}

/** o tronco torneado: o perfil `[raio, y]` girado (de baixo para cima, anti-horário) */
function torneado(perfil: Array<[number, number]>, gomos: number): THREE.BufferGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), gomos);
}

/** um galho: cone aberto de `a` até `b` */
function galho(a: THREE.Vector3, b: THREE.Vector3, r0: number, r1: number): THREE.BufferGeometry {
  const d = b.clone().sub(a);
  const geo = new THREE.CylinderGeometry(r1, r0, d.length(), 5, 1, true);
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
  geo.translate(a.x + d.x / 2, a.y + d.y / 2, a.z + d.z / 2);
  return geo;
}

/** a casca: o marrom com estria em volta e o pé mais escuro */
function tintaDeTronco(semente: number, base = P.trunk, escuro = P.troncoEscuro): Tinta {
  const claro = cor(base);
  const fundo = cor(escuro);
  return (p, _n, c) => {
    const estria = Math.sin(Math.atan2(p.z, p.x) * 3 + p.y * 2.3 + semente * 9) * 0.5 + 0.5;
    c.copy(claro).lerp(fundo, 0.15 + estria * 0.3 + Math.max(0, 0.4 - p.y) * 0.8);
  };
}

function juntar(partes: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const geo = mergeGeometries(partes) ?? partes[0];
  for (const p of partes) if (p !== geo) p.dispose();
  geo.computeBoundingSphere();
  return geo;
}

// ============================================================ REDONDA E FLORIDA

type Tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => void;

/** um triângulo virado para o lado de `fora` (troca a ordem se precisar) */
function trianguloPara(pos: number[], fora: THREE.Vector3): Tri {
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  return (a, b, c) => {
    e1.subVectors(b, a);
    e2.subVectors(c, a);
    const [p, q] = e1.cross(e2).dot(fora) < 0 ? [c, b] : [b, c];
    pos.push(a.x, a.y, a.z, p.x, p.y, p.z, q.x, q.y, q.z);
  };
}

/** os dois eixos deitados na superfície de normal `n`, girados `giro` em volta dela */
function eixosNaSuperficie(n: THREE.Vector3, giro: number): [THREE.Vector3, THREE.Vector3] {
  const t = new THREE.Vector3(0, 1, 0).cross(n);
  if (t.lengthSq() < 1e-4) t.set(1, 0, 0);
  t.normalize().applyAxisAngle(n, giro);
  return [t, new THREE.Vector3().crossVectors(n, t)];
}

/**
 * Uma FOLHINHA da copa: losango dobrado na nervura (a crista levanta e a luz
 * do toon separa os dois lados), deitado na superfície do tufo e com a ponta
 * levantando para fora — é ela que recorta a silhueta da copa.
 */
function folhinha(pos: number[], c: THREE.Vector3, n: THREE.Vector3, comp: number, larg: number, giro: number, levanta: number): void {
  const [t, b] = eixosNaSuperficie(n, giro);
  const eixo = t.clone().multiplyScalar(Math.cos(levanta)).addScaledVector(n, Math.sin(levanta));
  const base = c.clone().addScaledVector(eixo, -comp * 0.4);
  const ponta = c.clone().addScaledVector(eixo, comp * 0.6);
  const meio = c.clone().addScaledVector(eixo, comp * 0.08);
  const esq = meio.clone().addScaledVector(b, larg);
  const dir = meio.clone().addScaledVector(b, -larg);
  const crista = meio.clone().addScaledVector(n, larg * 0.4);
  const tri = trianguloPara(pos, n);
  tri(base, esq, crista);
  tri(esq, ponta, crista);
  tri(base, crista, dir);
  tri(crista, ponta, dir);
}

/** uma FLORZINHA de cinco pétalas em concha, e o miolo (o sexto triângulo) */
function florzinha(pos: number[], c: THREE.Vector3, n: THREE.Vector3, r: number, giro: number): void {
  const [t, b] = eixosNaSuperficie(n, giro);
  const centro = c.clone().addScaledVector(n, r * 0.15);
  const tri = trianguloPara(pos, n);
  const naRoda = (a: number, rr: number, sobe: number): THREE.Vector3 =>
    c.clone().addScaledVector(t, Math.cos(a) * rr).addScaledVector(b, Math.sin(a) * rr).addScaledVector(n, sobe);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    tri(centro, naRoda(a - 0.5, r, r * 0.3), naRoda(a + 0.5, r, r * 0.3));
  }
  tri(naRoda(0, r * 0.3, r * 0.22), naRoda(2.1, r * 0.3, r * 0.22), naRoda(4.2, r * 0.3, r * 0.22));
}

/** pontos espalhados por igual numa esfera (a espiral de Fibonacci) */
function espiral(n: number, giro: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let k = 0; k < n; k++) {
    const y = 1 - (2 * (k + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const a = k * 2.39996323 + giro;
    pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  return pts;
}

function copaDeTufos(s: number, semente: number, florida: boolean): THREE.BufferGeometry {
  const tronco = 2.1 * s;
  const partes: THREE.BufferGeometry[] = [];
  const casca = tintaDeTronco(semente);

  // o tronco torneado: o pé largo, a cintura e o pescoço entrando na copa
  partes.push(pintar(torneado([
    [0.0001, 0], [0.3 * s, 0], [0.22 * s, 0.08 * s], [0.17 * s, 0.3 * s], [0.152 * s, 0.9 * s],
    [0.14 * s, tronco * 0.72], [0.12 * s, tronco + 0.2 * s], [0.0001, tronco + 0.3 * s],
  ], 9), casca));
  // três raízes saindo do pé: curtas, grossas e afundando na terra (finas e
  // compridas, por cima do chão, liam como espinho)
  for (let k = 0; k < 3; k++) {
    const a = semente * 6.28 + k * 2.09;
    partes.push(pintar(galho(
      new THREE.Vector3(0, 0.2 * s, 0),
      new THREE.Vector3(Math.cos(a) * 0.46 * s, -0.06 * s, Math.sin(a) * 0.46 * s), 0.13 * s, 0.06 * s,
    ), casca));
  }

  // os tufos: os quatro grandes de sempre, no mesmo lugar, e três menores
  const tufos: Array<[number, number, number, number]> = [
    [0, tronco + 0.55 * s, 0, 1.12],
    [0.66 * s, tronco + 0.18 * s, 0.22 * s, 0.8],
    [-0.55 * s, tronco + 0.3 * s, -0.35 * s, 0.86],
    [0.08 * s, tronco + 1.08 * s, -0.28 * s, 0.66],
    [-0.3 * s, tronco + 0.05 * s, 0.62 * s, 0.6],
    [0.48 * s, tronco + 0.86 * s, 0.45 * s, 0.52],
    [-0.62 * s, tronco + 0.9 * s, 0.2 * s, 0.5],
  ];
  // o lado de cada tufo gira com a semente (duas árvores não saem gêmeas)
  const giro = new THREE.Matrix4().makeRotationY(semente * 6.28);
  const centros = tufos.map(([x, y, z]) => new THREE.Vector3(x, 0, z).applyMatrix4(giro).setY(y));

  // os galhos: do alto do tronco até os três tufos de baixo, e dois raminhos
  const forquilha = new THREE.Vector3(0, tronco * 0.7, 0);
  for (const i of [1, 2, 4]) {
    const alvo = centros[i].clone().multiplyScalar(0.75).setY(centros[i].y - 0.1 * s);
    partes.push(pintar(galho(forquilha, alvo, 0.09 * s, 0.04 * s), casca));
  }
  for (const [de, ate] of [[1, 5], [2, 6]] as const) {
    const a = centros[de].clone().multiplyScalar(0.75).setY(centros[de].y - 0.1 * s);
    partes.push(pintar(galho(a, centros[ate].clone().multiplyScalar(0.85), 0.04 * s, 0.02 * s), casca));
  }

  const fundo = cor(florida ? P.floridaFunda : P.copaFundo);
  const meio = cor(florida ? P.flowerPink : P.leafMid);
  const claro = cor(florida ? P.floridaClara : P.copaClara);
  const nova = cor(florida ? P.petala : P.leafLight);
  // um tico de tom por árvore: umas mais amareladas, outras mais frias
  const tom = (semente - 0.5) * 0.12;
  const yBaixo = tronco - 0.6 * s;
  const alturaDaCopa = 2.4 * s;
  const naCopa = (p: THREE.Vector3, n: THREE.Vector3): number => (p.y - yBaixo) / alturaDaCopa + n.y * 0.22 + tom;

  // a massa dos tufos (lisa: a folhagem que cobre ela é que dá o desenho)
  centros.forEach((c, i) => {
    const r = tufos[i][3] * s;
    partes.push(pintar(tufo(r, 1, c.x, c.y, c.z, semente * 10 + i), (p, n, k, face) => {
      degrade(k, naCopa(p, n) - 0.06, fundo, meio, claro);
      k.multiplyScalar(0.95 + ruido(face, i, semente, 7) * 0.06);
    }));
  });

  /*
   * A FOLHAGEM: folhinhas espalhadas por igual em cada tufo (a espiral de
   * Fibonacci), menos na barriga, que ninguém vê. Elas é que tiram a cara de
   * bola: recortam a borda da copa e pegam a luz uma a uma.
   */
  const folhas: number[] = [];
  const flores: number[] = [];
  centros.forEach((c, i) => {
    const r = tufos[i][3] * s;
    const pts = espiral(Math.round(26 * tufos[i][3]), semente * 9 + i);
    pts.forEach((d, k) => {
      if (d.y < -0.35) return;
      const sorte = ruido(i, k, semente, 3);
      const p = c.clone().addScaledVector(d, r * (0.93 + sorte * 0.08));
      if (florida && k % 2 === 0) florzinha(flores, p, d, 0.11 * s * (0.85 + sorte * 0.4), sorte * 6.28);
      else folhinha(folhas, p, d, 0.3 * s * (0.8 + sorte * 0.4), 0.09 * s, sorte * 6.28, 0.35 + sorte * 0.3);
    });
  });
  const geoFolhas = new THREE.BufferGeometry();
  geoFolhas.setAttribute('position', new THREE.Float32BufferAttribute(folhas, 3));
  geoFolhas.computeVertexNormals();
  partes.push(pintar(geoFolhas, (p, n, k, face) => {
    const folha = Math.floor(face / 4);
    const sorte = ruido(folha, 1, semente, 5);
    degrade(k, naCopa(p, n) + 0.08, fundo, meio, claro);
    // folha nova (mais clara) aqui e ali, e cada folha no seu tom
    if (sorte > 0.84) k.lerp(nova, 0.55);
    else k.multiplyScalar(0.9 + sorte * 0.18);
  }));
  if (flores.length) {
    const geoFlores = new THREE.BufferGeometry();
    geoFlores.setAttribute('position', new THREE.Float32BufferAttribute(flores, 3));
    geoFlores.computeVertexNormals();
    const branca = cor(P.petala);
    const rosa = cor(P.floridaClara);
    const miolo = cor(P.flowerYellow);
    partes.push(pintar(geoFlores, (_p, _n, k, face) => {
      if (face % 6 === 5) { k.copy(miolo); return; }
      k.copy(ruido(Math.floor(face / 6), 2, semente, 1) > 0.5 ? branca : rosa);
    }));
  }

  if (florida) {
    // as pétalas caídas em volta do pé: losangos rentes ao chão
    const chao: number[] = [];
    const cima = new THREE.Vector3(0, 1, 0);
    for (let k = 0; k < 16; k++) {
      const a = k * 2.39996 + semente * 7;
      const r = (0.55 + (((k * 37) % 11) / 11) * 1.25) * s;
      folhinha(chao, new THREE.Vector3(Math.cos(a) * r, 0.012, Math.sin(a) * r), cima, 0.13 * s, 0.05 * s, a * 1.7, 0);
    }
    const geoChao = new THREE.BufferGeometry();
    geoChao.setAttribute('position', new THREE.Float32BufferAttribute(chao, 3));
    geoChao.computeVertexNormals();
    partes.push(pintar(geoChao, (_p, _n, k, face) => k.copy(Math.floor(face / 4) % 3 === 0 ? nova : claro)));
  }
  return juntar(partes);
}

// ================================================================== PINHEIRO

/**
 * Uma SAIA de agulha: o bico, um anel no meio (a silhueta côncava) e a borda
 * em estrela — as pontas compridas caindo um pouco —, fechada embaixo por uma
 * barriga funda (de baixo, ela lê como a sombra do andar).
 */
function saia(r: number, alto: number, y0: number, pontas: number, semente: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const bico = new THREE.Vector3(0, y0 + alto, 0);
  const barriga = new THREE.Vector3(0, y0 + alto * 0.2, 0);
  const n = pontas * 2;
  const meio: THREE.Vector3[] = [];
  const borda: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + semente;
    const ponta = i % 2 === 0;
    const rr = r * (ponta ? 1 : 0.78) * (0.94 + ruido(i, y0, r, semente) * 0.12);
    borda.push(new THREE.Vector3(Math.cos(a) * rr, y0 - (ponta ? 0.07 * r : 0), Math.sin(a) * rr));
    meio.push(new THREE.Vector3(Math.cos(a) * r * 0.5, y0 + alto * 0.5, Math.sin(a) * r * 0.5));
  }
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): void => {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    tri(bico, meio[j], meio[i]);
    tri(meio[i], meio[j], borda[j]);
    tri(meio[i], borda[j], borda[i]);
    tri(barriga, borda[i], borda[j]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

function pinheiro(s: number, semente: number): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  partes.push(pintar(torneado([
    [0.0001, 0], [0.24 * s, 0], [0.17 * s, 0.12 * s], [0.12 * s, 1.4 * s], [0.06 * s, 3.2 * s], [0.0001, 3.3 * s],
  ], 6), tintaDeTronco(semente)));
  const fundo = cor(P.pinheiroFundo);
  const meio = cor(P.leafDark);
  const claro = cor(P.pinheiroClaro);
  // cinco andares de nove pontas: a silhueta de agulha, e não de cone
  const andares = 5;
  for (let i = 0; i < andares; i++) {
    const y0 = 1.1 * s + i * 0.47 * s;
    const alto = (1.15 - i * 0.09) * s;
    const r = (1.2 - i * 0.2) * s;
    partes.push(pintar(saia(r, alto, y0, 9, semente * 6 + i), (p, nn, c, face) => {
      // a barriga escura, a borda média e o alto de cada andar claro
      if (nn.y < -0.2) { c.copy(fundo).multiplyScalar(0.85); return; }
      const t = (p.y - y0) / alto;
      degrade(c, 0.25 + t * 0.85 + i * 0.05, fundo, meio, claro);
      c.multiplyScalar(0.92 + ruido(face, i, semente, 3) * 0.14);
    }));
  }
  return juntar(partes);
}

// ================================================================== PALMEIRA

function palmeira(s: number, semente: number): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  // o tronco curvo, inclinado para o lado da semente, afinando e com o pé largo
  const lado = semente * Math.PI * 2;
  const dx = Math.cos(lado);
  const dz = Math.sin(lado);
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.1 * s * dx, 1.1 * s, 0.1 * s * dz),
    new THREE.Vector3(0.3 * s * dx, 2.2 * s, 0.3 * s * dz),
    new THREE.Vector3(0.46 * s * dx, 3.1 * s, 0.46 * s * dz),
  ]);
  /*
   * O TRONCO EM DEGRAUS: cada anel do tubo um tico mais gordo ou mais magro
   * que o vizinho (as cicatrizes das folhas velhas), afinando para cima, e a
   * cor dos anéis pintada claro/escuro na mesma volta.
   */
  const ANEIS = 16;
  const RADIAL = 7;
  const tubo = new THREE.TubeGeometry(curva, ANEIS, 0.13 * s, RADIAL, false);
  {
    const pos = tubo.getAttribute('position') as THREE.BufferAttribute;
    const centro = new THREE.Vector3();
    const v = new THREE.Vector3();
    for (let k = 0; k < pos.count; k++) {
      const i = Math.floor(k / (RADIAL + 1));
      const t = i / ANEIS;
      curva.getPointAt(t, centro);
      const f = (1.12 - 0.42 * t) * (t < 0.07 ? 1.5 : 1) * (i % 2 ? 0.93 : 1.05);
      v.fromBufferAttribute(pos, k).sub(centro).multiplyScalar(f).add(centro);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
    tubo.computeVertexNormals();
  }
  const anelClaro = cor(P.palmeiraTronco);
  const anelEscuro = cor(P.palmeiraTroncoEscuro);
  partes.push(pintar(tubo, (p, _n, c) => {
    const volta = (p.y / (3.1 * s)) * ANEIS;
    const k = Math.abs((((volta % 2) + 2) % 2) - 1);
    c.copy(anelEscuro).lerp(anelClaro, k);
  }));

  const topo = curva.getPointAt(1).add(new THREE.Vector3(0, 0.04 * s, 0));
  // o miolo da coroa e os cocos, redondos
  partes.push(pintar(new THREE.IcosahedronGeometry(0.18 * s, 1).translate(topo.x, topo.y + 0.05 * s, topo.z),
    (_p, _n, c) => c.set(P.palmeiraTroncoEscuro).lerp(cor(P.palmeiraFolha), 0.4)));
  for (let k = 0; k < 3; k++) {
    const a = lado + k * 2.1;
    partes.push(pintar(new THREE.IcosahedronGeometry(0.1 * s, 1).translate(
      topo.x + Math.cos(a) * 0.16 * s, topo.y - 0.13 * s, topo.z + Math.sin(a) * 0.16 * s,
    ), (p, n, c) => c.set(P.coco).multiplyScalar(0.85 + Math.max(0, n.y) * 0.3 + ruido(p.x, p.y, p.z, k) * 0.06)));
  }

  /*
   * AS FOLHAS: a nervura é um arco que sobe e cai, e os FOLÍOLOS pendem dos
   * dois lados dela, um par por gomo, varridos para a ponta e caindo — é o
   * pente que faz ler "palmeira" e não "estrela verde". Dez folhas vivas
   * (uma sim, uma não, mais baixa e mais comprida) e duas secas penduradas
   * rente ao tronco.
   */
  const GOMOS = 10;
  const folhaEscura = cor(P.palmeiraFolha);
  const folhaClara = cor(P.palmeiraFolhaClara);
  const seca = cor(P.grassDry);
  const secaEscura = cor(P.palmeiraTroncoEscuro);
  const fronde = (a: number, L: number, sobe: number, cai: number, morta: boolean, indice: number): void => {
    const fora = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const deLado = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= GOMOS; i++) {
      const u = i / GOMOS;
      pts.push(topo.clone().addScaledVector(fora, L * u * (morta ? 0.35 : 1)).add(new THREE.Vector3(0, L * (sobe * u - cai * u * u), 0)));
    }
    const pos: number[] = [];
    const tri = (x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3): void => {
      pos.push(x.x, x.y, x.z, y.x, y.y, y.z, z.x, z.y, z.z);
    };
    const baixo = new THREE.Vector3(0, -1, 0);
    for (let i = 0; i < GOMOS; i++) {
      // a nervura: uma fita estreita
      const a0 = pts[i];
      const a1 = pts[i + 1];
      const w = 0.028 * s * (1 - i / GOMOS);
      tri(a0.clone().addScaledVector(deLado, w), a1, a0.clone().addScaledVector(deLado, -w));
      // o par de folíolos deste gomo
      if (i === 0) continue;
      const u = i / GOMOS;
      const tang = pts[i + 1].clone().sub(pts[i - 1]).normalize();
      const comp = 0.52 * s * Math.sin(Math.PI * Math.pow(u, 0.7)) * (0.85 + ruido(i, indice, semente, 2) * 0.3);
      for (const ld of [-1, 1]) {
        const b0 = a0.clone().addScaledVector(tang, -0.045 * s);
        const b1 = a0.clone().addScaledVector(tang, 0.045 * s);
        const ponta = a0.clone().addScaledVector(deLado, ld * comp).addScaledVector(baixo, comp * 0.5).addScaledVector(tang, comp * 0.3);
        tri(b0, b1, ponta);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.computeVertexNormals();
    partes.push(pintar(geo, (p, _n, c, face) => {
      const u = Math.min(1, p.clone().sub(topo).dot(fora) / (L * (morta ? 0.35 : 1)));
      const sorte = ruido(face, indice, semente, 4);
      if (morta) { c.copy(seca).lerp(secaEscura, 0.2 + sorte * 0.4); return; }
      // a base da folha escura, a ponta clara, e cada folíolo no seu tom
      c.copy(folhaEscura).lerp(folhaClara, 0.1 + u * 0.55).multiplyScalar(0.9 + sorte * 0.16);
    }));
  };
  const FOLHAS = 10;
  for (let f = 0; f < FOLHAS; f++) {
    const a = (f / FOLHAS) * Math.PI * 2 + semente * 3;
    const baixa = f % 2 === 0;
    const L = (baixa ? 1.8 : 1.55) * s * (0.92 + ruido(f, 0, 0, semente) * 0.16);
    fronde(a, L, baixa ? 0.3 : 0.6, baixa ? 1.05 : 0.95, false, f);
  }
  for (let f = 0; f < 2; f++) {
    fronde(semente * 3 + 0.6 + f * 3.3, 1.3 * s, -0.4, 0.6, true, 20 + f);
  }
  return juntar(partes);
}

// ===================================================================== A PEÇA

const materialOpaco = (): THREE.Material => toon(0xffffff, { corPorVertice: true });
const materialDosDoisLados = (): THREE.Material => toon(0xffffff, { corPorVertice: true, doubleSide: true });

/** A árvore: uma malha, um material. Base em `y = 0`. */
export function arvore(tipo: TipoDeArvore = 'redonda', escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  // a etiqueta e o que deixa um teste CONTAR arvore sem adivinhar pela
  // geometria (ver `scripts/arena.mjs`)
  g.userData.peca = 'arvore';
  const s = escala;
  const geo = tipo === 'pinheiro' ? pinheiro(s, semente)
    : tipo === 'palmeira' ? palmeira(s, semente)
      : copaDeTufos(s, semente, tipo === 'florida');
  // a folha da palmeira é um pano só: os dois lados
  g.add(new THREE.Mesh(geo, tipo === 'palmeira' ? materialDosDoisLados() : materialOpaco()));
  return g;
}
