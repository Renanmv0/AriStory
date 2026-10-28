import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../fundir';
import type { Bicho } from '../../entities/bichos/Bicho';

/*
 * AS FANTASIAS DO CLUBE na festa de Halloween (`docs/HALLOWEEN.md`, §3, a
 * etapa 4): uma só de cada um (decisão do Renan), fofas e bem feitas.
 *
 * - A GINA, NOIVA DO FRANKENSTEIN — a noiva mais alta do mundo: o cabelo
 *   altíssimo com as duas mechas de raio, os parafusinhos ao longo do
 *   pescoção, a cicatriz costurada, o véu de gaze e o babado de renda;
 * - O CAPY DE TUBARÃO — o salva-vidas fantasiado do que ele vigia: o capuz de
 *   pelúcia com a boca aberta em volta da cara (os dentinhos de feltro), os
 *   olhinhos, a barriga clara, a barbatana e o rabo; o apito continua;
 * - O NOEL, CIENTISTA MALUCO: o jaleco no lugar do avental, os óculos de
 *   proteção na testa, a crista de algodão arrepiada e os tubos de ensaio;
 * - A JOSEFINA, DRAGÃOZINHO — o dragão mais devagar do mundo: os espinhos de
 *   feltro pelo casco (o vasinho continua lá), as asinhas, o capuz com os
 *   chifrinhos, a ponta de flecha no rabo e uma fumacinha de chá de vez em
 *   quando;
 * - O WALTER, MÚMIA GARÇOM: as ataduras pelo corpo, pela cabeça e pelas
 *   pernas, com as pontas soltas balançando, a gravatinha por cima e a
 *   bandeja cheia de doces.
 *
 * CAMADA, como as do parque (`fantasiasDoParque.ts`): as classes não mudam.
 * O que a fantasia cobre (o avental do Noel, o laço da Josefina) só fica
 * invisível.
 */

/** o filho de `pai` que está nesta posição (os grupos da classe não têm nome) */
function filhoEm(pai: THREE.Object3D, x: number, y: number, z: number): THREE.Object3D | null {
  return pai.children.find((o) => Math.abs(o.position.x - x) < 1e-3 && Math.abs(o.position.y - y) < 1e-3 && Math.abs(o.position.z - z) < 1e-3) ?? null;
}

/** o ponto da casca de um elipsoide (centro `c`, raios `r`) na direção `d`, e a normal ali */
function naCasca(c: THREE.Vector3, r: THREE.Vector3, d: THREE.Vector3, folga = 0): { p: THREE.Vector3; n: THREE.Vector3 } {
  const u = d.clone().normalize();
  const k = 1 / Math.sqrt((u.x / r.x) ** 2 + (u.y / r.y) ** 2 + (u.z / r.z) ** 2);
  const p = c.clone().addScaledVector(u, k);
  const n = new THREE.Vector3((p.x - c.x) / (r.x * r.x), (p.y - c.y) / (r.y * r.y), (p.z - c.z) / (r.z * r.z)).normalize();
  p.addScaledVector(n, folga);
  return { p, n };
}

/** põe `obj` na casca, com o `+Y` dele apontando para fora (a normal) */
function pousar(obj: THREE.Object3D, p: THREE.Vector3, n: THREE.Vector3): THREE.Object3D {
  obj.position.copy(p);
  obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
  return obj;
}

/**
 * UM CAPUZ DE PELÚCIA sobre uma cabeça de elipsoide: a casca um tico maior,
 * com o FURO da cara (o cone de `furoAng` em volta de `furoDir`) e cortada
 * embaixo (`corteBaixo`, em fração do raio de altura). Com `corDeBaixo`, a
 * parte de baixo da casca é de outra cor, pintada nos vértices (a barriga
 * clara do tubarão).
 */
function capuz(
  r: THREE.Vector3, furoDir: THREE.Vector3, furoAng: number, corteBaixo: number, cor: number, corDeBaixo?: number,
): THREE.Mesh {
  const geo = new THREE.SphereGeometry(1, 28, 18);
  const pos = geo.getAttribute('position');
  const f = furoDir.clone().normalize();
  const cosFuro = Math.cos(furoAng);
  const idx = geo.getIndex();
  if (!idx) throw new Error('esfera sem índice');
  const fica: number[] = [];
  const v = new THREE.Vector3();
  for (let k = 0; k < idx.count; k += 3) {
    v.set(0, 0, 0);
    for (let j = 0; j < 3; j++) v.add(new THREE.Vector3().fromBufferAttribute(pos, idx.getX(k + j)));
    v.normalize();
    if (v.dot(f) > cosFuro || v.y < corteBaixo) continue;
    fica.push(idx.getX(k), idx.getX(k + 1), idx.getX(k + 2));
  }
  geo.setIndex(fica);
  if (corDeBaixo !== undefined) {
    const a = new THREE.Color(cor);
    const b = new THREE.Color(corDeBaixo);
    const cores = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      c.copy(a).lerp(b, THREE.MathUtils.smoothstep(-pos.getY(i), 0.05, 0.4));
      cores.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  }
  geo.scale(r.x, r.y, r.z);
  geo.computeVertexNormals();
  const mat = corDeBaixo !== undefined ? toon(0xffffff, { corPorVertice: true, doubleSide: true }) : toon(cor, { doubleSide: true });
  return new THREE.Mesh(geo, mat);
}

/** os pontos da borda do furo de um capuz (na casca dele), de `de` a `ate` rad em volta do furo */
function bordaDoFuro(r: THREE.Vector3, furoDir: THREE.Vector3, furoAng: number, de: number, ate: number, n: number): Array<{ p: THREE.Vector3; d: THREE.Vector3 }> {
  const f = furoDir.clone().normalize();
  const u = new THREE.Vector3(0, 1, 0).sub(f.clone().multiplyScalar(f.y)).normalize();
  const w = new THREE.Vector3().crossVectors(f, u);
  const lista: Array<{ p: THREE.Vector3; d: THREE.Vector3 }> = [];
  for (let k = 0; k < n; k++) {
    const a = de + (ate - de) * (n === 1 ? 0.5 : k / (n - 1));
    const d = f.clone().multiplyScalar(Math.cos(furoAng)).addScaledVector(u.clone().multiplyScalar(Math.cos(a)).addScaledVector(w, Math.sin(a)), Math.sin(furoAng)).normalize();
    lista.push({ p: new THREE.Vector3(d.x * r.x, d.y * r.y, d.z * r.z), d });
  }
  return lista;
}

/** uma forma plana extrudada fina (asa, barbatana), deitada no plano YZ (a grossura no X) */
function plaquinha(forma: THREE.Shape, grossura: number): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(forma, { depth: grossura, bevelEnabled: true, bevelThickness: grossura * 0.4, bevelSize: grossura * 0.4, bevelSegments: 1, curveSegments: 8 });
  geo.translate(0, 0, -grossura / 2);
  // XY -> ZY: o "x" da forma vira a profundidade, para TRÁS (-Z)
  geo.rotateY(Math.PI / 2);
  return geo;
}

// ====================================================== a Gina, noiva

/** Veste a Gina de NOIVA DO FRANKENSTEIN. */
export function fantasiarGinaDeNoiva(gina: Bicho): THREE.Group {
  const cabeca = gina.group.getObjectByName('cabeca-da-girafa');
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-noiva';
  if (!cabeca) return fantasia;
  cabeca.add(fantasia);
  // o quepe de porteira fica na guarita: a copa, a tarja, a aba e o brasão
  for (const [x, y, z] of [[0, 0.135, 0.012], [0, 0.096, 0.012], [0, 0.09, 0.05], [0, 0.14, 0.118]] as const) {
    const peca = filhoEm(cabeca, x, y, z);
    if (peca) peca.visible = false;
  }

  // ------------------------------------------------- o cabelo e as mechas
  // a torre de cabelo atrás dos ossicones (eles passam pela frente dela),
  // inclinada para trás, com o coque redondo no alto
  const cabelo = new THREE.Group();
  cabelo.name = 'cabelo-de-noiva';
  const fio = toon(P.noivaCabelo);
  const torre = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 14), fio);
  torre.scale.set(0.088, 0.19, 0.085);
  torre.position.set(0, 0.2, -0.085);
  cabelo.add(torre);
  const coque = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), fio);
  coque.position.set(0, 0.38, -0.105);
  cabelo.add(coque);
  // as mechas de raio: brancas, subindo em zigue-zague dos dois lados da torre
  const mecha = toon(P.noivaMecha);
  for (const lado of [-1, 1] as const) {
    const pontos = [
      [0.07, 0.06, -0.05], [0.082, 0.14, -0.07], [0.074, 0.19, -0.08], [0.086, 0.26, -0.085], [0.07, 0.33, -0.095], [0.05, 0.4, -0.1],
    ].map(([x, y, z]) => new THREE.Vector3(lado * x, y, z));
    const raio = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos, false, 'catmullrom', 0.1), 24, 0.016, 6, false), mecha);
    cabelo.add(raio);
  }
  fantasia.add(fundir(cabelo));

  // ------------------------------------------------- a cicatriz costurada
  // na bochecha do lado da câmera (`+X`): o risco e três pontos atravessados
  const cranio = { c: new THREE.Vector3(0, 0, 0), r: new THREE.Vector3(0.13 * 0.95, 0.13, 0.13 * 1.05) };
  const cicatriz = new THREE.Group();
  const linha = toon(P.noivaCicatriz);
  const risco = new THREE.Mesh(new THREE.CapsuleGeometry(0.0045, 0.075, 2, 4), linha);
  cicatriz.add(risco);
  for (const y of [-0.026, 0, 0.026]) {
    const ponto = new THREE.Mesh(new THREE.CapsuleGeometry(0.0035, 0.024, 2, 4), linha);
    ponto.rotation.z = Math.PI / 2;
    ponto.position.y = y;
    cicatriz.add(ponto);
  }
  const { p: naBochecha, n: normalDaBochecha } = naCasca(cranio.c, cranio.r, new THREE.Vector3(0.85, -0.05, 0.5), 0.002);
  cicatriz.position.copy(naBochecha);
  cicatriz.lookAt(naBochecha.clone().add(normalDaBochecha));
  cicatriz.rotateZ(0.35);
  fantasia.add(fundir(cicatriz));

  // ------------------------------------------------- o véu de gaze
  // preso atrás do coque, caindo pelas costas da cabeça: transparente, e de
  // dois lados (a câmera vê o de dentro por cima)
  const perfil = [[0.03, 0.0], [0.07, -0.08], [0.11, -0.2], [0.14, -0.32]].map(([r, y]) => new THREE.Vector2(r, y)).reverse();
  const veu = new THREE.Mesh(new THREE.LatheGeometry(perfil, 18, Math.PI * 0.55, Math.PI * 0.9), toon(P.noivaVeu, { opacity: 0.55, doubleSide: true }));
  veu.name = 'veu-de-noiva';
  veu.position.set(0, 0.37, -0.12);
  veu.rotation.x = -0.35;
  fantasia.add(veu);

  // ------------------------------------------------- os parafusos e o babado
  // os parafusinhos de feltro dos dois lados de dois gomos do pescoço, e o
  // babado de renda na base dele
  const gomos: Array<{ g: THREE.Object3D; raio: number }> = [];
  let pai = cabeca.parent;
  while (pai && pai.name !== 'corpo-da-girafa') {
    const cano = pai.children.find((o) => (o as THREE.Mesh).isMesh && ((o as THREE.Mesh).geometry as THREE.CylinderGeometry).parameters?.radiusBottom !== undefined) as THREE.Mesh | undefined;
    if (cano) gomos.unshift({ g: pai, raio: (cano.geometry as THREE.CylinderGeometry).parameters.radiusBottom });
    pai = pai.parent;
    if (gomos.length >= 4) break;
  }
  const parafuso = toon(P.noivaParafuso);
  const porca = toon(P.noivaParafusoEscuro);
  for (const [i, { g, raio }] of gomos.entries()) {
    if (i % 2 === 0) continue;
    for (const lado of [-1, 1] as const) {
      const pino = new THREE.Group();
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.05, 8), parafuso);
      haste.position.y = 0.025;
      pino.add(haste);
      const cabecaDoPino = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.018, 6), porca);
      cabecaDoPino.position.y = 0.052;
      pino.add(cabecaDoPino);
      pino.rotation.z = -lado * Math.PI / 2;
      pino.position.set(lado * (raio - 0.02), 0.15, 0);
      g.add(fundir(pino));
    }
  }
  if (gomos[0]) {
    // o babado: um anel que abre para baixo, com a barra ondulada
    const pontos = [[gomos[0].raio + 0.005, 0.07], [gomos[0].raio + 0.05, 0.03], [gomos[0].raio + 0.1, -0.02]].map(([r, y]) => new THREE.Vector2(r, y)).reverse();
    const babado = new THREE.LatheGeometry(pontos, 40);
    const pos = babado.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const a = Math.atan2(pos.getX(i), pos.getZ(i));
      if (pos.getY(i) < 0) pos.setY(i, pos.getY(i) + 0.02 * Math.sin(a * 12));
    }
    babado.computeVertexNormals();
    const renda = new THREE.Mesh(babado, toon(P.noivaRenda, { doubleSide: true }));
    renda.name = 'babado-de-noiva';
    gomos[0].g.add(renda);
  }
  return fantasia;
}

// ====================================================== o Capy tubarão

/** Veste o Capy de TUBARÃO. */
export function fantasiarCapyDeTubarao(capy: Bicho): THREE.Group {
  const cabeca = capy.group.getObjectByName('cabeca-do-capy');
  const corpo = cabeca?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-tubarao';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);

  // ------------------------------------------------- o capuz com a boca
  // a cara dele aparece pela boca aberta do tubarão, com os dentinhos
  const r = new THREE.Vector3(0.175, 0.16, 0.185);
  // a boca abre até os olhos dele (que moram no alto da cabeça, de capivara)
  const furo = new THREE.Vector3(0, -0.1, 1);
  const ANG = 1.0;
  const touca = new THREE.Group();
  touca.name = 'capuz-de-tubarao';
  touca.add(capuz(r, furo, ANG, -0.55, P.tubaraoPelucia, P.tubaraoBarriga));
  // os dentinhos de feltro: em cima e dos lados da boca, apontando para dentro
  const dente = toon(P.tubaraoDente);
  for (const { p, d } of bordaDoFuro(r, furo, ANG - 0.04, -1.9, 1.9, 11)) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.034, 5), dente);
    cone.position.copy(p);
    // a ponta para o meio da boca
    const paraDentro = furo.clone().normalize().multiplyScalar(0.18).sub(p).normalize();
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), paraDentro.add(d.clone().multiplyScalar(-0.3)).normalize());
    touca.add(cone);
  }
  // os olhinhos do tubarão, nos lados do capuz, acima da boca
  for (const lado of [-1, 1] as const) {
    const { p, n } = naCasca(new THREE.Vector3(), r, new THREE.Vector3(lado * 0.8, 0.45, 0.45), 0.002);
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), toon(P.olhoDeBoneco));
    olho.scale.set(1, 1, 0.45);
    olho.position.copy(p);
    olho.lookAt(p.clone().add(n));
    touca.add(olho);
    const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 5), toon(0xffffff));
    brilho.position.copy(p).addScaledVector(n, 0.008).add(new THREE.Vector3(0, 0.008, 0.004));
    touca.add(brilho);
  }
  // a barbatana de cima do capuz, pequena (a grande vai no lombo)
  {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.03, 0.06, 0.07, 0.07);
    s.quadraticCurveTo(0.06, 0.02, 0.08, 0);
    s.closePath();
    const aleta = new THREE.Mesh(plaquinha(s, 0.012), toon(P.tubaraoPelucia));
    const { p } = naCasca(new THREE.Vector3(), r, new THREE.Vector3(0, 1, -0.2), -0.01);
    aleta.position.copy(p).add(new THREE.Vector3(0, 0, 0.04));
    touca.add(aleta);
  }
  cabeca.add(fundir(touca));
  // os óculos escuros de salva-vidas atrapalhariam a cara no furo
  const oculos = cabeca.getObjectByName('oculos-do-capy');
  if (oculos) oculos.visible = false;

  // ------------------------------------------------- a barbatana e o rabo
  const barbatana = new THREE.Shape();
  barbatana.moveTo(0, 0);
  barbatana.quadraticCurveTo(0.04, 0.1, 0.13, 0.15);
  barbatana.quadraticCurveTo(0.1, 0.06, 0.16, 0);
  barbatana.closePath();
  const costas = new THREE.Mesh(plaquinha(barbatana, 0.02), toon(P.tubaraoPelucia));
  costas.name = 'barbatana-do-capy';
  // no lombo, atrás da cruz de salva-vidas
  costas.position.set(0, 0.41, -0.02);
  fantasia.add(costas);
  const rabo = new THREE.Shape();
  rabo.moveTo(0, 0);
  rabo.quadraticCurveTo(0.06, 0.04, 0.1, 0.13);
  rabo.quadraticCurveTo(0.09, 0.04, 0.05, 0.0);
  rabo.quadraticCurveTo(0.09, -0.03, 0.08, -0.08);
  rabo.quadraticCurveTo(0.05, -0.03, 0, 0);
  const cauda = new THREE.Mesh(plaquinha(rabo, 0.022), toon(P.tubaraoPeluciaFunda));
  cauda.name = 'rabo-de-tubarao';
  cauda.position.set(0, 0.31, -0.255);
  fantasia.add(cauda);
  // as nadadeiras do peito, uma de cada lado, deitadas para trás
  for (const lado of [-1, 1] as const) {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.03, -0.04, 0.09, -0.06);
    s.quadraticCurveTo(0.05, -0.01, 0.04, 0.02);
    s.closePath();
    const nadadeira = new THREE.Mesh(plaquinha(s, 0.014), toon(P.tubaraoPelucia));
    nadadeira.position.set(lado * 0.165, 0.24, 0.1);
    nadadeira.rotation.z = lado * 0.6;
    fantasia.add(nadadeira);
  }
  return fantasia;
}

// ====================================================== o Noel cientista

/** um tubo de ensaio com o líquido colorido aceso e a rolha */
function tuboDeEnsaio(liquido: number, alto: number): THREE.Group {
  const g = new THREE.Group();
  const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, alto, 8), toon(P.vidroDeEnsaio, { opacity: 0.55 }));
  vidro.position.y = alto / 2;
  g.add(vidro);
  const caldo = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, alto * 0.45, 3, 8), toon(liquido, { glow: 0.55 }));
  caldo.position.y = alto * 0.3;
  g.add(caldo);
  const rolha = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.01, 0.014, 8), toon(P.wood));
  rolha.position.y = alto + 0.004;
  g.add(rolha);
  return g;
}

/** Veste o Noel de CIENTISTA MALUCO. */
export function fantasiarNoelCientista(noel: Bicho): THREE.Group {
  const cabeca = noel.group.getObjectByName('cabeca-do-noel');
  const pescoco = noel.group.getObjectByName('pescoco-do-noel');
  const corpo = pescoco?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-cientista';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);

  // o vendedor de suco fica em casa: o avental, as alças, o bolso, o crachá e a viseira
  for (const [x, y, z] of [[0, 0.275, 0.13], [-0.075, 0.375, 0.075], [0.075, 0.375, 0.075], [0, 0.235, 0.235], [0.075, 0.325, 0.2]] as const) {
    const peca = filhoEm(corpo, x, y, z);
    if (peca) peca.visible = false;
  }
  for (const [x, y, z] of [[0, 0.048, 0.002], [0, 0.042, 0.055]] as const) {
    const peca = filhoEm(cabeca, x, y, z);
    if (peca) peca.visible = false;
  }

  // ------------------------------------------------- o jaleco
  // um torneado em volta do corpo, aberto na frente (a fresta mostra o papo
  // de penas), do pescoço até abaixo da barriga, abrindo um pouco na barra
  // por fora do tronco inteiro (o lombo de penas não pode furar o pano)
  const perfil = [[0.085, 0.455], [0.165, 0.41], [0.196, 0.33], [0.2, 0.23], [0.208, 0.13]].map(([r, y]) => new THREE.Vector2(r, y)).reverse();
  const geo = new THREE.LatheGeometry(perfil, 32, 0.32, Math.PI * 2 - 0.64);
  geo.scale(1, 1, 1.17);
  const jaleco = new THREE.Mesh(geo, toon(P.jalecoBranco));
  jaleco.name = 'jaleco';
  fantasia.add(jaleco);
  const forro = new THREE.Mesh(geo.clone().scale(0.985, 1, 0.985), toon(P.jalecoForro, { doubleSide: true }));
  fantasia.add(forro);
  // as lapelas: dois triângulos dobrados na abertura, no alto do peito
  for (const lado of [-1, 1] as const) {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(lado * 0.05, -0.02);
    s.lineTo(lado * 0.012, -0.075);
    s.closePath();
    const lapela = new THREE.Mesh(new THREE.ShapeGeometry(s), toon(P.jalecoForro, { doubleSide: true }));
    lapela.position.set(lado * 0.04, 0.395, 0.17);
    lapela.rotation.x = -0.45;
    fantasia.add(lapela);
  }
  // as MANGAS: uma casca branca por cima de cada asa, dentro do grupo dela
  // (a asa bate e a manga vai junto); a ponta de penas escapa pelo punho
  for (const asa of corpo.children) {
    if (Math.abs(Math.abs(asa.position.x) - 0.155) > 1e-3 || Math.abs(asa.position.y - 0.315) > 1e-3) continue;
    const manga = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), toon(P.jalecoBranco));
    manga.scale.set(0.052, 0.108, 0.16);
    asa.add(manga);
  }
  // o bolso do peito com os três tubos de ensaio (verde, roxo e laranja)
  const bolso = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.012), toon(P.jalecoForro));
  bolso.position.set(0.1, 0.29, 0.192);
  bolso.rotation.y = 0.45;
  fantasia.add(bolso);
  [P.verdePocao, P.halloweenRoxo, P.luzDeAbobora].forEach((cor, i) => {
    const tubo = tuboDeEnsaio(cor, 0.075 - i * 0.008);
    tubo.position.set(0.082 + i * 0.02, 0.28, 0.2 - i * 0.008);
    tubo.rotation.z = (i - 1) * 0.12;
    fantasia.add(tubo);
  });

  // ------------------------------------------------- os óculos e a crista
  const oculos = new THREE.Group();
  oculos.name = 'oculos-de-protecao';
  const aro = toon(P.oculosDeProtecao);
  for (const lado of [-1, 1] as const) {
    const lente = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.012, 12), toon(P.lenteDeProtecao, { glow: 0.25 }));
    lente.rotation.x = Math.PI / 2 - 0.5;
    lente.position.set(lado * 0.024, 0.048, 0.032);
    oculos.add(lente);
    const borda = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 5, 14), aro);
    borda.rotation.x = -0.5;
    borda.position.set(lado * 0.024, 0.048, 0.034);
    oculos.add(borda);
  }
  const tira = new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.005, 4, 18), aro);
  tira.rotation.x = Math.PI / 2 - 0.5;
  tira.position.set(0, 0.04, 0.004);
  oculos.add(tira);
  cabeca.add(fundir(oculos));
  // a crista de algodão arrepiada, saindo do alto da cabeça
  const crista = new THREE.Group();
  const algodao = toon(P.algodaoDaCrista);
  for (const [x, y, z, s] of [[0, 0.07, -0.012, 0.024], [-0.022, 0.06, -0.02, 0.019], [0.022, 0.062, -0.018, 0.02], [0, 0.058, -0.04, 0.02], [-0.03, 0.045, -0.038, 0.016], [0.03, 0.046, -0.036, 0.016]] as const) {
    const tufo = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), algodao);
    tufo.position.set(x, y, z);
    crista.add(tufo);
  }
  cabeca.add(fundir(crista));
  return fantasia;
}

// ====================================================== a Josefina dragão

/** uma asinha de dragão de feltro, deitada no plano YZ, com a ponta para trás e para cima */
function asaDeDragao(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.06, 0.1, 0.17, 0.13);
  s.quadraticCurveTo(0.15, 0.08, 0.16, 0.05);
  s.quadraticCurveTo(0.12, 0.05, 0.11, 0.015);
  s.quadraticCurveTo(0.07, 0.03, 0.055, -0.01);
  s.quadraticCurveTo(0.03, 0.015, 0, 0);
  return s;
}

/** Veste a Josefina de DRAGÃOZINHO. Devolve a fantasia; a fumacinha de chá sai sozinha. */
export function fantasiarJosefinaDeDragao(josefina: Bicho): THREE.Group {
  const pescoco = josefina.group.getObjectByName('pescoco-da-josefina');
  const cabeca = pescoco?.children.find((o) => o.name === 'cabeca' || o.name === 'cabeca-da-josefina') ?? null;
  const corpo = pescoco?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-dragao';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);
  const espinho = toon(P.dragaoEspinho);

  // ------------------------------------------------- os espinhos pelo casco
  // pela linha do meio do casco, da frente até o rabo, maiores no alto; o
  // vasinho dela (no topo) continua lá, e os espinhos passam em volta dele
  const casco = { c: new THREE.Vector3(0, 0.16, 0), r: new THREE.Vector3(0.3, 0.186, 0.345) };
  const espinhos = new THREE.Group();
  for (let k = 0; k < 9; k++) {
    const a = -1.15 + (k / 8) * 2.4;
    const d = new THREE.Vector3(0, Math.cos(a), Math.sin(a));
    const { p, n } = naCasca(casco.c, casco.r, d, -0.006);
    if (Math.abs(p.z + 0.02) < 0.085) continue;
    const alto = 0.075 + 0.04 * Math.cos(a);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.042, alto, 6), espinho);
    cone.geometry.translate(0, alto / 2, 0);
    pousar(cone, p, n.clone().add(new THREE.Vector3(0, 0, -0.35)).normalize());
    cone.scale.set(0.55, 1, 1);
    espinhos.add(cone);
  }
  fantasia.add(fundir(espinhos));

  // ------------------------------------------------- as asinhas
  for (const lado of [-1, 1] as const) {
    const asa = new THREE.Mesh(new THREE.ShapeGeometry(asaDeDragao(), 8), toon(P.dragaoAsa, { doubleSide: true }));
    // o "x" da forma para trás (-Z), como a barbatana do Capy
    asa.geometry.rotateY(Math.PI / 2);
    asa.scale.setScalar(1.6);
    asa.position.set(lado * 0.2, 0.29, -0.02);
    asa.rotation.set(0, lado * 0.25, lado * 0.5);
    asa.name = 'asa-de-dragao';
    fantasia.add(asa);
  }

  // ------------------------------------------------- o rabinho de flecha
  const rabo = corpo.children.find((o) => Math.abs(o.position.z + 0.29) < 1e-3 && Math.abs(o.position.y - 0.19) < 1e-3);
  if (rabo) {
    const flecha = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.06, 4), espinho);
    flecha.scale.set(1, 1, 0.35);
    flecha.rotation.x = -Math.PI / 2;
    flecha.position.set(0, -0.02, -0.11);
    rabo.add(flecha);
  }

  // ------------------------------------------------- o capuz com os chifrinhos
  const r = new THREE.Vector3(0.098 * 1.14, 0.088 * 1.18, 0.112 * 1.1);
  const capuzDeDragao = new THREE.Group();
  capuzDeDragao.name = 'capuz-de-dragao';
  capuzDeDragao.add(capuz(r, new THREE.Vector3(0, -0.15, 1), 0.98, -0.5, P.dragaoFeltro));
  for (const lado of [-1, 1] as const) {
    const chifre = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 7), toon(P.dragaoChifre));
    const { p, n } = naCasca(new THREE.Vector3(), r, new THREE.Vector3(lado * 0.45, 0.85, -0.15), -0.004);
    chifre.geometry.translate(0, 0.025, 0);
    pousar(chifre, p, n.clone().add(new THREE.Vector3(0, 0, -0.5)).normalize());
    capuzDeDragao.add(chifre);
  }
  // a cristinha de espinhos no alto do capuz
  for (const t of [-0.2, 0.15, 0.5]) {
    const { p, n } = naCasca(new THREE.Vector3(), r, new THREE.Vector3(0, 1, -t), -0.003);
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.03, 5), espinho);
    c.geometry.translate(0, 0.015, 0);
    pousar(c, p, n);
    c.scale.set(0.6, 1, 1);
    capuzDeDragao.add(c);
  }
  cabeca.add(fundir(capuzDeDragao));
  // o laço cor-de-rosa dela fica debaixo do capuz
  const laco = filhoEm(cabeca, 0, 0.086, 0.015);
  if (laco) laco.visible = false;

  // ------------------------------------------------- a fumacinha de chá
  // três bolinhas que saem do focinho, sobem, crescem e somem — de tempos em tempos
  const fumaca = new THREE.Group();
  fumaca.name = 'fumaca-de-cha';
  const bolinhas: THREE.Mesh[] = [];
  for (let k = 0; k < 3; k++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.018, 1), toon(P.fumacaDeCha, { opacity: 0.8 }));
    b.visible = false;
    b.userData.semSombra = true;
    fumaca.add(b);
    bolinhas.push(b);
  }
  fumaca.position.set(0, -0.01, 0.12);
  cabeca.add(fumaca);
  let antes = performance.now();
  let relogio = 2;
  const corpoDoCasco = corpo.children.find((o) => (o as THREE.Mesh).isMesh) as THREE.Mesh | undefined;
  if (corpoDoCasco) {
    corpoDoCasco.onBeforeRender = () => {
      const agora = performance.now();
      relogio += Math.min(0.1, (agora - antes) / 1000);
      antes = agora;
      // a cada 7 s, uma baforada de 1,6 s
      const t = relogio % 7;
      bolinhas.forEach((b, k) => {
        const tt = t - k * 0.25;
        const ativa = tt > 0 && tt < 1.6;
        b.visible = ativa;
        if (!ativa) return;
        const f = tt / 1.6;
        b.position.set(Math.sin(f * 6 + k) * 0.012, f * 0.14, 0.02 + f * 0.05);
        // cresce subindo e se desfaz no fim (o material é de todas: some pelo tamanho)
        b.scale.setScalar((0.6 + f * 1.4) * (1 - THREE.MathUtils.smoothstep(f, 0.65, 1)));
      });
    };
  }
  return fantasia;
}

// ====================================================== o Walter múmia

/** Veste o Walter de MÚMIA GARÇOM. */
export function fantasiarWalterDeMumia(walter: Bicho): THREE.Group {
  const cabeca = walter.group.getObjectByName('cabeca');
  const corpo = cabeca?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-mumia';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);
  const pano = toon(P.atadura);
  const sombra = toon(P.ataduraSombra);

  // ------------------------------------------------- as ataduras do corpo
  // anéis em volta do tronco (o elipsoide 0,125 × 0,115 × 0,215 em y 0,3),
  // cada um da largura do tronco ali, tortos de leve, alternando o tom
  const tronco = { rx: 0.125, ry: 0.115, rz: 0.215, y: 0.3 };
  const ataduras = new THREE.Group();
  // as faixas ENCOSTAM uma na outra (passo menor que a largura): é o que lê
  // "enrolado", e não um esqueleto de anéis
  for (let k = 0; k < 13; k++) {
    const z = -0.19 + k * 0.031;
    const s = Math.sqrt(Math.max(0.12, 1 - (z / tronco.rz) ** 2));
    // o toro de raio 1 e tubo 0,1, achatado: a faixa tem ~4 cm de largura
    const anel = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 4, 24), k % 2 ? sombra : pano);
    anel.scale.set(tronco.rx * s + 0.008, tronco.ry * s + 0.008, 0.2);
    anel.position.set(0, tronco.y, z);
    anel.rotation.set(0.12 * Math.sin(k * 1.7), 0.16 * Math.sin(k * 2.3), 0);
    ataduras.add(anel);
  }
  fantasia.add(fundir(ataduras));

  // ------------------------------------------------- as ataduras da cabeça
  // em volta do crânio em alturas diferentes, deixando os olhos de fora
  const enrolaCabeca = new THREE.Group();
  // rente ao crânio (0,108 × 0,1 × 0,105), duas no alto e uma embaixo dos
  // olhos, quase retas
  for (const [y, inclina, cor] of [[0.062, 0.1, pano], [0.08, -0.12, sombra], [-0.015, 0.08, pano]] as const) {
    const s = Math.sqrt(Math.max(0.1, 1 - (y / 0.1) ** 2));
    const anel = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 4, 22), cor);
    anel.scale.set(0.108 * s + 0.004, 0.105 * s + 0.004, 0.17);
    anel.rotation.set(Math.PI / 2 + inclina, 0, 0.06);
    anel.position.y = y;
    enrolaCabeca.add(anel);
  }
  cabeca.add(fundir(enrolaCabeca));

  // ------------------------------------------------- as pernas
  for (const perna of corpo.children) {
    if (Math.abs(perna.position.y - 0.235) > 1e-3 || (perna as THREE.Mesh).isMesh) continue;
    const enrola = new THREE.Group();
    for (const [y, cor] of [[-0.035, pano], [-0.07, sombra], [-0.105, pano], [-0.14, sombra], [-0.172, pano]] as const) {
      const anel = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.014, 4, 14), cor);
      anel.rotation.set(Math.PI / 2 + 0.15, 0, 0);
      anel.position.y = y;
      enrola.add(anel);
    }
    perna.add(fundir(enrola));
  }

  // ------------------------------------------------- as pontas soltas
  // duas no corpo e uma na cabeça, balançando com o passo dele
  const pontas: THREE.Object3D[] = [];
  const ponta = (pai: THREE.Object3D, x: number, y: number, z: number, comp: number): void => {
    const pivo = new THREE.Group();
    pivo.position.set(x, y, z);
    const tira = new THREE.Mesh(new THREE.BoxGeometry(0.022, comp, 0.004), pano);
    tira.position.y = -comp / 2;
    pivo.add(tira);
    pai.add(pivo);
    pontas.push(pivo);
  };
  ponta(fantasia, 0.12, 0.31, -0.05, 0.1);
  ponta(fantasia, -0.115, 0.28, 0.08, 0.08);
  ponta(cabeca, -0.1, 0.06, -0.03, 0.07);
  let antes = performance.now();
  let t = 0;
  let primeira: THREE.Mesh | undefined;
  fantasia.traverse((o) => { if (!primeira && (o as THREE.Mesh).isMesh) primeira = o as THREE.Mesh; });
  if (primeira) {
    primeira.onBeforeRender = () => {
      const agora = performance.now();
      t += Math.min(0.1, (agora - antes) / 1000);
      antes = agora;
      pontas.forEach((p, k) => {
        p.rotation.x = 0.25 + Math.sin(t * 3 + k) * 0.25;
        p.rotation.z = Math.sin(t * 2.2 + k * 1.3) * 0.2;
      });
    };
  }

  // ------------------------------------------------- os doces na bandeja
  const bandeja = corpo.getObjectByName('bandeja');
  if (bandeja) {
    const doces = new THREE.Group();
    doces.name = 'doces-da-bandeja';
    const cores = [P.halloweenLaranja, P.halloweenRoxo, P.verdePocao, P.docePirulito, P.halloweenLaranjaClaro, P.halloweenLilas];
    cores.forEach((cor, i) => {
      // a bala embrulhada: o miolo e as duas pontinhas torcidas do papel
      const bala = new THREE.Group();
      const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.017, 10, 8), toon(cor));
      miolo.scale.set(1.3, 1, 1);
      bala.add(miolo);
      for (const lado of [-1, 1] as const) {
        const torcido = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.018, 6), toon(cor));
        torcido.rotation.z = lado * Math.PI / 2;
        torcido.position.x = lado * 0.027;
        bala.add(torcido);
      }
      const a = i * 1.05;
      bala.position.set(Math.cos(a) * 0.05, 0.022, Math.sin(a) * 0.06);
      bala.rotation.y = a * 1.3;
      doces.add(bala);
    });
    // o pirulito em espiral, em pé no meio
    const pirulito = new THREE.Group();
    const palito = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 5), toon(P.algodaoDaCrista));
    palito.position.y = 0.04;
    pirulito.add(palito);
    const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 16), toon(P.docePirulito));
    disco.rotation.x = Math.PI / 2;
    disco.position.y = 0.095;
    pirulito.add(disco);
    const espiral = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.004, 4, 16), toon(P.algodaoDaCrista));
    espiral.position.set(0, 0.095, 0.007);
    pirulito.add(espiral);
    doces.add(pirulito);
    bandeja.add(fundir(doces));
  }
  return fantasia;
}
