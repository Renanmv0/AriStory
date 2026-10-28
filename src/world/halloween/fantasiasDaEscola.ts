import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../fundir';
import type { Bicho } from '../../entities/bichos/Bicho';
import { capuz, naCasca, pousar } from './fantasiasDoClube';
import { capaDeBicho, balancarComOPasso } from './fantasiasDoParque';

/*
 * AS FANTASIAS DA ESCOLA na festa de Halloween (`docs/HALLOWEEN.md`, §3, a
 * etapa 4): uma só de cada um (decisão do Renan), fofas e bem feitas.
 *
 * - O GATITO DE WALTER — a fantasia engraçada (pedido do Renan): ele gosta
 *   muito do Mania de Churrasco, então veio de cachorro garçom: as orelhas
 *   caídas de cachorro numa tiara, o focinho postiço de bolinha preso com
 *   elástico, a GRAVATINHA borboleta, a bandejinha nas costas e um rabinho
 *   de cachorro amarrado no rabo dele, abanando;
 * - O FLYNN DE LOBISOMEM: as luvas peludas de garra, o peitoral de pelo
 *   cinza, as orelhas de lobo numa tiara e a bandana dos Gatitos por cima;
 * - A LUNA DE CORUJA DA MEIA-NOITE (Luna é lua): o capuz de penas com os
 *   olhões de feltro e o biquinho, os tufos de orelha de coruja, a capinha
 *   de penas em camadas e a lua crescente pendurada no pescoço;
 * - A SOL DE CAVEIRINHA CATRINA: a coroa de flores coloridas, a carinha
 *   pintada (o aro de pontinhos em volta dos olhos, o nariz de coração, o
 *   sorriso costurado e as flores nas bochechas) e a saia de babados;
 * - A ESTRELLA DE FADINHA DAS ESTRELAS (Estrella é estrela): as asas de tule
 *   com a borda brilhando, a varinha de estrela e a saia de tule azul-noite
 *   com estrelinhas.
 *
 * CAMADA, como as outras: as classes não mudam, e o que a fantasia cobre só
 * fica invisível. As coelhinhas são UMA classe com ficha; os grupos delas se
 * acham pelo nome (`cabeca-da-luna`…) e pela posição que a classe dá.
 */

/** os pivôs dos braços de um bicho de duas patas: os grupos do corpo nesta altura e neste |x| */
function bracosEm(corpo: THREE.Object3D, x: number, y: number): THREE.Object3D[] {
  return corpo.children
    .filter((o) => !(o as THREE.Mesh).isMesh && Math.abs(Math.abs(o.position.x) - x) < 1e-3 && Math.abs(o.position.y - y) < 1e-3)
    .sort((a, b) => a.position.x - b.position.x);
}

/** uma estrelinha de cinco pontas extrudada (a varinha, as da saia) */
function geoEstrela(r: number, grossura: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  for (let k = 0; k < 10; k++) {
    const a = Math.PI / 2 + (k / 10) * Math.PI * 2;
    const rr = k % 2 === 0 ? r : r * 0.45;
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr;
    if (k === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: grossura, bevelEnabled: true, bevelThickness: grossura * 0.4, bevelSize: r * 0.12, bevelSegments: 1 });
  geo.translate(0, 0, -grossura / 2);
  return geo;
}

/** uma florzinha: o miolo e as pétalas em volta, olhando para `+Z` */
function florzinha(raio: number, petala: number, miolo: number = P.catrinaAmarelo): THREE.Group {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.42, 8, 6), toon(miolo));
  m.scale.z = 0.6;
  m.position.z = raio * 0.12;
  g.add(m);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.48, 8, 6), toon(petala));
    p.scale.set(1, 1, 0.45);
    p.position.set(Math.cos(a) * raio * 0.62, Math.sin(a) * raio * 0.62, 0);
    g.add(p);
  }
  return g;
}

/**
 * UMA SAIA RODADA em volta da cintura: um torneado da cintura (`rCima`, `yCima`)
 * até a barra (`rBaixo`, `yBaixo`), a barra ondulando em `ondas` dobras. Com
 * `faixas`, cada faixa de altura de uma cor (os babados), pintada nos vértices.
 */
function saiaRodada(
  rCima: number, yCima: number, rBaixo: number, yBaixo: number, ondas: number, faixas: readonly number[] | null, cor: number, opacidade = 1,
): THREE.Mesh {
  const N = 6;
  const perfil: THREE.Vector2[] = [];
  for (let k = 0; k <= N; k++) {
    const f = k / N;
    // a barriga da saia: abre rápido no começo e cai no fim
    perfil.push(new THREE.Vector2(rCima + (rBaixo - rCima) * Math.sqrt(f), yBaixo + (yCima - yBaixo) * (1 - f)));
  }
  // de baixo para cima: é assim que o torneado vira a face para fora
  const geo = new THREE.LatheGeometry(perfil.reverse(), 48);
  const pos = geo.getAttribute('position');
  const cores = faixas ? new Float32Array(pos.count * 3) : null;
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = pos.getY(i);
    const a = Math.atan2(x, z);
    const f = (yCima - y) / (yCima - yBaixo);
    // as dobras crescem descendo, e a barra sobe e desce junto
    const dobra = 1 + f * f * 0.07 * Math.sin(a * ondas);
    pos.setXYZ(i, x * dobra, y + (f > 0.95 ? 0.012 * Math.sin(a * ondas) : 0), z * dobra);
    if (cores && faixas) {
      c.set(faixas[Math.min(faixas.length - 1, Math.floor(f * faixas.length * 0.999))]);
      cores.set([c.r, c.g, c.b], i * 3);
    }
  }
  if (cores) geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  geo.computeVertexNormals();
  const mat = cores
    ? toon(0xffffff, { corPorVertice: true, doubleSide: true })
    : toon(cor, { doubleSide: true, opacity: opacidade });
  return new THREE.Mesh(geo, mat);
}

// ===================================================== o Gatito de Walter

/** Veste o Gatito DE WALTER (de cachorro garçom), com a gravatinha. */
export function fantasiarGatitoDeWalter(gatito: Bicho): THREE.Group {
  const cabeca = gatito.group.getObjectByName('cabeca');
  const corpo = cabeca?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-walter';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);
  const R = new THREE.Vector3(0.17 * 1.08, 0.17 * 0.92, 0.17 * 0.95);
  const zero = new THREE.Vector3();

  // ------------------------------------------- a tiara de orelhas caídas
  const tiara = new THREE.Group();
  tiara.name = 'tiara-de-cachorro';
  const arco = new THREE.Mesh(new THREE.TorusGeometry(R.x + 0.006, 0.008, 5, 22, Math.PI), toon(P.gravataNo));
  arco.scale.set(1, R.y / R.x + 0.04, 1);
  arco.rotation.x = -0.2;
  arco.position.z = -0.02;
  tiara.add(arco);
  // as orelhas de feltro, do lado de FORA das de gato: caídas, de cachorro
  for (const lado of [-1, 1] as const) {
    const orelha = new THREE.Group();
    const aba = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), toon(P.cachorroOrelha));
    aba.scale.set(0.035, 0.1, 0.06);
    aba.position.y = -0.085;
    orelha.add(aba);
    const { p } = naCasca(zero, R, new THREE.Vector3(lado * 0.9, 0.45, -0.1), 0.01);
    orelha.position.copy(p);
    orelha.rotation.z = lado * 0.35;
    tiara.add(orelha);
  }
  cabeca.add(fundir(tiara));

  // ------------------------------------------- o focinho postiço
  // a bolinha preta na frente do nariz dele, presa por um elástico fininho
  const { p: noNariz, n: frenteDoNariz } = naCasca(zero, R, new THREE.Vector3(0, -0.1, 1));
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 10), toon(P.catrinaTraco));
  focinho.scale.set(1.2, 0.9, 0.9);
  focinho.position.copy(noNariz).addScaledVector(frenteDoNariz, 0.022);
  cabeca.add(focinho);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 5), toon(0xffffff));
  brilho.position.copy(focinho.position).add(new THREE.Vector3(-0.012, 0.01, 0.022));
  cabeca.add(brilho);
  const elastico = new THREE.Mesh(new THREE.TorusGeometry(1, 0.025, 4, 28), toon(P.catrinaTraco));
  elastico.scale.set(R.x + 0.004, R.z + 0.004, 0.12);
  elastico.rotation.x = Math.PI / 2 + 0.08;
  elastico.position.y = noNariz.y;
  cabeca.add(elastico);

  // ------------------------------------------- a gravatinha do Walter
  const gravata = new THREE.Group();
  gravata.name = 'gravatinha-do-gatito';
  for (const lado of [-1, 1] as const) {
    const asa = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.gravataBorboleta));
    asa.scale.set(0.04, 0.03, 0.016);
    asa.position.x = lado * 0.036;
    asa.rotation.z = lado * 0.15;
    gravata.add(asa);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), toon(P.gravataNo));
  gravata.add(no);
  // embaixo do queixo, na frente do peito
  gravata.position.set(0, 0.255, 0.4);
  gravata.rotation.x = -0.35;
  fantasia.add(fundir(gravata));

  // ------------------------------------------- a bandejinha nas costas
  const bandeja = new THREE.Group();
  bandeja.name = 'bandejinha-do-gatito';
  const inox = toon(P.churrascoInox);
  const tabua = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.008, 20), inox);
  bandeja.add(tabua);
  const borda = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.006, 5, 20), inox);
  borda.rotation.x = Math.PI / 2;
  borda.position.y = 0.005;
  bandeja.add(borda);
  // um copinho de suco de laranja e um docinho
  const copo = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.013, 0.04, 10), toon(P.vidroDeEnsaio, { opacity: 0.6 }));
  copo.position.set(0.025, 0.024, 0.01);
  bandeja.add(copo);
  const suco = new THREE.Mesh(new THREE.CylinderGeometry(0.0145, 0.012, 0.028, 10), toon(P.catrinaLaranja));
  suco.position.set(0.025, 0.018, 0.01);
  bandeja.add(suco);
  const doce = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), toon(P.docePirulito));
  doce.position.set(-0.03, 0.014, -0.01);
  bandeja.add(doce);
  // nas costas, por cima do lombo (o tronco termina em y 0,355)
  bandeja.position.set(0, 0.36, -0.02);
  fantasia.add(fundir(bandeja));

  // ------------------------------------------- o rabinho de cachorro
  // amarrado com uma fitinha vermelha no primeiro gomo do rabo dele, e
  // abanando por conta própria
  const rabo = corpo.children.find((o) => Math.abs(o.position.y - 0.3) < 1e-3 && Math.abs(o.position.z + 0.24) < 1e-3);
  const gomo = rabo?.children.find((o) => !(o as THREE.Mesh).isMesh);
  if (gomo) {
    const fita = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 5, 14), toon(P.gravataBorboleta));
    fita.rotation.x = Math.PI / 2;
    fita.position.y = 0.05;
    gomo.add(fita);
    const pivo = new THREE.Group();
    pivo.name = 'rabinho-de-cachorro';
    pivo.position.set(0, 0.05, -0.02);
    const rabinho = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.08, 3, 8), toon(P.cachorroPelo));
    rabinho.position.y = 0.06;
    pivo.add(rabinho);
    pivo.rotation.x = -1.0;
    gomo.add(pivo);
    let antes = performance.now();
    let t = 0;
    rabinho.onBeforeRender = () => {
      const agora = performance.now();
      t += Math.min(0.1, (agora - antes) / 1000);
      antes = agora;
      pivo.rotation.z = Math.sin(t * 11) * 0.45;
    };
  }
  return fantasia;
}

// ===================================================== o Flynn lobisomem

const REGATA_DO_FLYNN = { y: 0.452, rx: 0.12, ry: 0.138, rz: 0.098 };

/** Veste o Flynn de LOBISOMEM. */
export function fantasiarFlynnDeLobisomem(flynn: Bicho): THREE.Group {
  const cabeca = flynn.group.getObjectByName('cabeca-do-flynn');
  const corpo = cabeca?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-lobisomem';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);
  const pelo = toon(P.lobisomemPelo);
  const claro = toon(P.lobisomemPeloClaro);
  const garra = toon(P.lobisomemGarra);

  // ------------------------------------------- o peitoral de pelo
  // tufos cinza em V no peito, por cima da regata (o número desce para a
  // barriga e continua à mostra)
  const peito = new THREE.Group();
  const rg = REGATA_DO_FLYNN;
  const c = new THREE.Vector3(0, rg.y, 0);
  const r = new THREE.Vector3(rg.rx, rg.ry, rg.rz);
  for (const [x, y, s] of [
    [0, 0.115, 0.036], [-0.045, 0.1, 0.032], [0.045, 0.1, 0.032], [-0.08, 0.075, 0.028], [0.08, 0.075, 0.028],
    [-0.03, 0.07, 0.03], [0.03, 0.07, 0.03], [0, 0.045, 0.028], [-0.055, 0.045, 0.024], [0.055, 0.045, 0.024],
  ] as const) {
    const { p, n } = naCasca(c, r, new THREE.Vector3(x / rg.rx, y / rg.ry, 0.8), -0.004);
    const tufo = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), (x + y) % 0.05 > 0.02 ? claro : pelo);
    tufo.scale.set(1, 1.2, 0.55);
    pousar(tufo, p, n);
    tufo.rotateX(Math.PI / 2);
    peito.add(tufo);
  }
  fantasia.add(fundir(peito));

  // ------------------------------------------- as luvas de garra
  for (const braco of bracosEm(corpo, 0.13, 0.55)) {
    const luva = new THREE.Group();
    luva.name = 'luva-de-lobisomem';
    const mao = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 10), pelo);
    mao.position.y = -0.208;
    luva.add(mao);
    // o punho de pelo, por cima da munhequeira
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2;
      const tufo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.016, 0), claro);
      tufo.position.set(Math.cos(a) * 0.036, -0.186, Math.sin(a) * 0.036);
      luva.add(tufo);
    }
    // as três garras, na frente da mão, apontando para baixo
    for (const dx of [-0.02, 0, 0.02]) {
      const unha = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.03, 6), garra);
      unha.rotation.x = Math.PI - 0.5;
      unha.position.set(dx, -0.24, 0.025);
      luva.add(unha);
    }
    braco.add(fundir(luva));
  }

  // ------------------------------------------- as orelhas de lobo
  const tiara = new THREE.Group();
  tiara.name = 'orelhas-de-lobo';
  const R = new THREE.Vector3(0.155, 0.135, 0.14);
  const arco = new THREE.Mesh(new THREE.TorusGeometry(R.x + 0.006, 0.007, 5, 22, Math.PI), toon(P.lobisomemPelo));
  arco.scale.set(1, R.y / R.x + 0.05, 1);
  arco.rotation.x = -0.35;
  arco.position.z = -0.03;
  tiara.add(arco);
  for (const lado of [-1, 1] as const) {
    const orelha = new THREE.Group();
    const fora = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 4), pelo);
    fora.scale.set(1, 1, 0.45);
    fora.position.y = 0.06;
    orelha.add(fora);
    const dentro = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 4), toon(P.lobisomemOrelhaDentro));
    dentro.scale.set(1, 1, 0.3);
    dentro.position.set(0, 0.05, 0.014);
    orelha.add(dentro);
    // o tufo de pelo na ponta, bagunçado
    const tufo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.014, 0), claro);
    tufo.position.y = 0.12;
    orelha.add(tufo);
    // atrás das orelhas de raposa dele, um tico mais para fora
    // do LADO das de raposa, abrindo para fora (atrás delas sumiam)
    const { p } = naCasca(new THREE.Vector3(), R, new THREE.Vector3(lado * 0.92, 0.45, -0.05), -0.01);
    orelha.position.copy(p);
    orelha.scale.setScalar(1.45);
    orelha.rotation.set(-0.15, 0, -lado * 0.85);
    tiara.add(orelha);
  }
  cabeca.add(fundir(tiara));
  return fantasia;
}

// ===================================================== as coelhinhas

/** a cabeça, o corpo e os braços de uma coelhinha */
function daCoelha(coelha: Bicho, id: string): { cabeca: THREE.Object3D; corpo: THREE.Object3D; bracos: THREE.Object3D[] } | null {
  const cabeca = coelha.group.getObjectByName(`cabeca-da-${id}`);
  const corpo = cabeca?.parent;
  if (!cabeca || !corpo) return null;
  return { cabeca, corpo, bracos: bracosEm(corpo, 0.125, 0.46) };
}

/** o crânio da coelhinha, para pôr as coisas na casca dele */
const CRANIO_DA_COELHA = new THREE.Vector3(0.15, 0.14, 0.14);

/** Veste a Luna de CORUJA DA MEIA-NOITE. */
export function fantasiarLunaDeCoruja(luna: Bicho): THREE.Group {
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-coruja';
  const partes = daCoelha(luna, 'luna');
  if (!partes) return fantasia;
  const { cabeca, corpo } = partes;
  corpo.add(fantasia);
  const zero = new THREE.Vector3();
  const R = CRANIO_DA_COELHA.clone().multiplyScalar(1.1);

  // ------------------------------------------- o capuz de penas
  // a cara toda de fora; as orelhas de coelha passam pelo capuz
  const touca = new THREE.Group();
  touca.name = 'capuz-de-coruja';
  touca.add(capuz(R, new THREE.Vector3(0, -0.2, 1), 1.12, -0.45, P.corujaPena, P.corujaPenaClara));
  // os OLHÕES de feltro, na testa do capuz, por cima dos olhos dela
  for (const lado of [-1, 1] as const) {
    const { p, n } = naCasca(zero, R, new THREE.Vector3(lado * 0.42, 0.62, 0.68), 0.003);
    const olho = new THREE.Group();
    const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.008, 18), toon(P.corujaOlhoAro));
    aro.rotation.x = Math.PI / 2;
    olho.add(aro);
    const iris = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.008, 16), toon(P.corujaIris));
    iris.rotation.x = Math.PI / 2;
    iris.position.z = 0.004;
    olho.add(iris);
    const pupila = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.008, 14), toon(P.catrinaTraco));
    pupila.rotation.x = Math.PI / 2;
    pupila.position.z = 0.008;
    olho.add(pupila);
    const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 5), toon(0xffffff));
    brilho.position.set(-0.007, 0.008, 0.013);
    olho.add(brilho);
    olho.position.copy(p);
    olho.lookAt(p.clone().add(n));
    touca.add(olho);
    // o tufo de orelha de coruja, no canto de cima do capuz, abrindo para fora
    const tufo = new THREE.Group();
    for (const [dx, h] of [[0, 0.07], [lado * 0.015, 0.055]] as const) {
      const pena = new THREE.Mesh(new THREE.ConeGeometry(0.018, h, 5), toon(P.corujaPenaFunda));
      pena.position.set(dx, h / 2, 0);
      tufo.add(pena);
    }
    const { p: canto, n: nc } = naCasca(zero, R, new THREE.Vector3(lado * 0.85, 0.5, 0.2), -0.006);
    pousar(tufo, canto, nc.clone().add(new THREE.Vector3(lado * 0.4, 0.6, 0)).normalize());
    touca.add(tufo);
  }
  // o biquinho de feltro, entre os olhões
  const bico = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.04, 6), toon(P.corujaBico));
  const { p: pb, n: nb } = naCasca(zero, R, new THREE.Vector3(0, 0.5, 0.86), 0.006);
  bico.position.copy(pb);
  bico.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, -1, 0.35).normalize());
  bico.position.addScaledVector(nb, 0.008);
  touca.add(bico);
  cabeca.add(fundir(touca));

  // ------------------------------------------- a capinha de penas
  // três camadas de "escamas" de pena nas costas, a de baixo maior
  // o pivô no pescoço: é em volta dele que a capinha balança com o passo
  const capinha = new THREE.Group();
  capinha.name = 'capinha-de-penas';
  capinha.position.y = 0.5;
  ([[0, 0.11, 0.2, P.corujaPena], [-0.06, 0.15, 0.2, P.corujaPenaClara], [-0.12, 0.17, 0.215, P.corujaPena]] as const).forEach(([y, rTopo, rBarra, cor], i) => {
    const camada = capaDeBicho([[rTopo, 0], [rBarra * 0.95, -0.05], [rBarra, -0.12 - i * 0.01]], Math.PI * 1.1, cor, P.corujaPenaFunda, 0.95);
    camada.position.y = y;
    capinha.add(camada);
  });
  fantasia.add(capinha);
  balancarComOPasso(capinha, luna.group, 0.25);

  // ------------------------------------------- a lua no colar
  const colar = new THREE.Group();
  colar.name = 'lua-no-colar';
  const cordao = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.004, 4, 24), toon(P.luaDourada));
  cordao.rotation.x = Math.PI / 2 - 0.35;
  cordao.position.set(0, 0.47, 0.02);
  colar.add(cordao);
  const lua = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.011, 8, 18, Math.PI * 1.3), toon(P.luaDourada, { glow: 0.3 }));
  lua.rotation.z = Math.PI * 0.85;
  lua.position.set(0, 0.405, 0.13);
  colar.add(lua);
  fantasia.add(fundir(colar));
  return fantasia;
}

/** Veste a Sol de CAVEIRINHA CATRINA. */
export function fantasiarSolDeCatrina(sol: Bicho): THREE.Group {
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-catrina';
  const partes = daCoelha(sol, 'sol');
  if (!partes) return fantasia;
  const { cabeca, corpo } = partes;
  corpo.add(fantasia);
  const zero = new THREE.Vector3();
  const R = CRANIO_DA_COELHA;
  const cores = [P.catrinaRosa, P.catrinaLaranja, P.catrinaRoxo, P.catrinaAmarelo, P.catrinaRosa, P.catrinaVerde, P.catrinaLaranja];

  // ------------------------------------------- a coroa de flores
  // um anel de flores em volta da cabeça, na altura da testa; as orelhas em pé
  // passam no meio dele
  const coroa = new THREE.Group();
  coroa.name = 'coroa-de-flores';
  for (let k = 0; k < 9; k++) {
    const a = -Math.PI * 0.62 + (k / 8) * Math.PI * 1.24;
    const d = new THREE.Vector3(Math.sin(a) * 0.9, 0.62, Math.cos(a) * 0.9);
    const { p, n } = naCasca(zero, R, d, 0.006);
    const flor = florzinha(k % 2 ? 0.026 : 0.032, cores[k % cores.length], k % 3 ? P.catrinaAmarelo : P.catrinaRoxo);
    flor.position.copy(p);
    flor.lookAt(p.clone().add(n));
    coroa.add(flor);
    if (k % 2 === 0) {
      const folha = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5), toon(P.catrinaFolha));
      folha.scale.set(1.7, 0.4, 0.9);
      folha.position.copy(p).addScaledVector(n, -0.004).add(new THREE.Vector3(0, -0.012, 0));
      folha.lookAt(p.clone().add(n));
      coroa.add(folha);
    }
  }
  cabeca.add(fundir(coroa));

  // ------------------------------------------- a carinha pintada
  const pintura = new THREE.Group();
  pintura.name = 'carinha-de-catrina';
  const traco = toon(P.catrinaTraco);
  // o aro de pontinhos coloridos em volta de cada olho (o olho fica em
  // ±0,058; 0,02; 0,112, com 0,036 de raio)
  for (const lado of [-1, 1] as const) {
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const d = new THREE.Vector3(lado * 0.058 + Math.cos(a) * 0.05, 0.02 + Math.sin(a) * 0.048, 0.1);
      const { p, n } = naCasca(zero, R, d, 0.002);
      const ponto = new THREE.Mesh(new THREE.SphereGeometry(k % 2 ? 0.008 : 0.011, 6, 5), toon(k % 2 ? cores[(k + 2) % cores.length] : P.catrinaTraco));
      ponto.scale.z = 0.4;
      ponto.position.copy(p);
      ponto.lookAt(p.clone().add(n));
      pintura.add(ponto);
    }
    // a florzinha da bochecha
    const { p, n } = naCasca(zero, R, new THREE.Vector3(lado * 0.1, -0.04, 0.1), 0.003);
    const flor = florzinha(0.016, lado > 0 ? P.catrinaRosa : P.catrinaLaranja);
    flor.position.copy(p);
    flor.lookAt(p.clone().add(n));
    pintura.add(flor);
  }
  // o nariz de coração por cima do nariz dela
  const coracao = new THREE.Shape();
  coracao.moveTo(0, -0.012);
  coracao.bezierCurveTo(-0.022, 0.004, -0.012, 0.02, 0, 0.008);
  coracao.bezierCurveTo(0.012, 0.02, 0.022, 0.004, 0, -0.012);
  const nariz = new THREE.Mesh(new THREE.ExtrudeGeometry(coracao, { depth: 0.006, bevelEnabled: false }), traco);
  nariz.position.set(0, -0.012, 0.158);
  pintura.add(nariz);
  // o sorriso costurado embaixo do focinho: o risco e os pontinhos
  const sorriso = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.0035, 4, 18, Math.PI * 0.7), traco);
  sorriso.rotation.z = Math.PI + Math.PI * 0.15;
  sorriso.position.set(0, -0.03, 0.15);
  pintura.add(sorriso);
  for (let k = 0; k < 5; k++) {
    const a = Math.PI * 1.15 + (k / 4) * Math.PI * 0.7;
    const ponto = new THREE.Mesh(new THREE.CapsuleGeometry(0.0028, 0.016, 2, 4), traco);
    ponto.position.set(Math.cos(a) * 0.04, -0.03 + Math.sin(a) * 0.04, 0.152);
    ponto.rotation.z = a - Math.PI / 2;
    pintura.add(ponto);
  }
  cabeca.add(fundir(pintura));

  // ------------------------------------------- a saia de babados
  // por cima da saia de torcida (que termina em 0,17), em faixas de cor
  const saia = saiaRodada(0.13, 0.28, 0.25, 0.13, 14, [P.catrinaRosa, P.catrinaLaranja, P.catrinaAmarelo, P.catrinaVerde, P.catrinaRoxo], P.catrinaRosa);
  saia.name = 'saia-de-babados';
  fantasia.add(saia);
  // o debrum de cada babado: um fio escuro marcando as faixas
  for (const y of [0.24, 0.205, 0.17]) {
    const f = (0.28 - y) / 0.15;
    const r = 0.13 + 0.12 * Math.sqrt(f) + 0.004;
    const fio = new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 4, 32), toon(P.catrinaTraco));
    fio.rotation.x = Math.PI / 2;
    fio.position.y = y;
    fantasia.add(fio);
  }
  return fantasia;
}

/** Veste a Estrella de FADINHA DAS ESTRELAS. */
export function fantasiarEstrellaDeFada(estrella: Bicho): THREE.Group {
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-fada';
  const partes = daCoelha(estrella, 'estrella');
  if (!partes) return fantasia;
  const { corpo, bracos } = partes;
  corpo.add(fantasia);

  // ------------------------------------------- as asas de tule
  // dois pares (as de cima maiores), translúcidas, com a borda acesa de luz
  const asas = new THREE.Group();
  asas.name = 'asas-de-fada';
  const tule = toon(P.fadaAsa, { opacity: 0.68, doubleSide: true });
  const brilho = toon(P.fadaBrilho, { glow: 0.6 });
  for (const lado of [-1, 1] as const) {
    for (const [tam, sobe, abre] of [[0.27, 0.07, 0.55], [0.18, -0.06, 0.95]] as const) {
      const forma = new THREE.Shape();
      forma.moveTo(0, 0);
      forma.bezierCurveTo(tam * 0.3, tam * 0.65, tam * 1.05, tam * 0.75, tam, tam * 0.2);
      forma.bezierCurveTo(tam * 0.95, -tam * 0.15, tam * 0.4, -tam * 0.15, 0, 0);
      const plano = new THREE.Mesh(new THREE.ShapeGeometry(forma, 12), tule);
      const borda = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(forma.getPoints(24).map((v) => new THREE.Vector3(v.x, v.y, 0.002)), true), 48, 0.005, 4, true), brilho);
      const asa = new THREE.Group();
      asa.add(plano, borda);
      asa.scale.x = lado;
      asa.rotation.set(0, lado * -0.5, lado * abre * 0.4);
      asa.position.set(lado * 0.02, 0.44 + sobe, -0.12);
      asas.add(asa);
    }
  }
  fantasia.add(asas);
  // as asas batem de leve, sempre
  let antes = performance.now();
  let t = 0;
  const primeira = asas.children[0].children[0] as THREE.Mesh;
  primeira.onBeforeRender = () => {
    const agora = performance.now();
    t += Math.min(0.1, (agora - antes) / 1000);
    antes = agora;
    asas.children.forEach((a, k) => {
      const lado = a.scale.x;
      a.rotation.y = lado * (-0.5 - 0.25 * Math.sin(t * 5 + k * 0.4));
    });
  };

  // ------------------------------------------- a saia de tule com estrelas
  const saia = saiaRodada(0.13, 0.285, 0.27, 0.12, 10, null, P.fadaTule, 0.72);
  saia.name = 'saia-de-tule';
  saia.renderOrder = 2;
  fantasia.add(saia);
  // as estrelinhas pregadas no tule (um lote)
  const N = 14;
  const estrelinhas = new THREE.InstancedMesh(geoEstrela(0.014, 0.003), toon(P.fadaEstrela, { glow: 0.5 }), N);
  estrelinhas.name = 'estrelinhas-da-saia';
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2 + (k % 2) * 0.2;
    const f = 0.35 + (k % 3) * 0.22;
    const y = 0.285 - f * (0.285 - 0.12);
    const r = 0.13 + (0.27 - 0.13) * Math.sqrt(f) + 0.006;
    const p = new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(Math.sin(a), 0.25, Math.cos(a)).normalize());
    estrelinhas.setMatrixAt(k, m.compose(p, q, new THREE.Vector3(1, 1, 1)));
  }
  estrelinhas.instanceMatrix.needsUpdate = true;
  fantasia.add(estrelinhas);

  // ------------------------------------------- a varinha de estrela
  // na mão da direita (o braço de `+X`), no lugar do pompom
  const braco = bracos[bracos.length - 1];
  if (braco) {
    const pompom = braco.getObjectByName('pompom');
    if (pompom) pompom.visible = false;
    const varinha = new THREE.Group();
    varinha.name = 'varinha-de-estrela';
    const vara = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2, 6), toon(P.fadaAsa));
    vara.position.y = 0.06;
    varinha.add(vara);
    const estrela = new THREE.Mesh(geoEstrela(0.04, 0.012), toon(P.fadaEstrela, { glow: 0.55 }));
    estrela.position.y = 0.17;
    varinha.add(estrela);
    const fita = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.004, 4, 10), toon(P.fadaTule));
    fita.rotation.x = Math.PI / 2;
    fita.position.y = 0.14;
    varinha.add(fita);
    varinha.position.set(0, -0.17, 0.03);
    varinha.rotation.x = 0.5;
    braco.add(fundir(varinha));
  }
  return fantasia;
}

/** atalho para o mapa de fantasias: a coelhinha certa pela ficha */
export const FANTASIAS_DAS_COELHINHAS: Record<string, (b: Bicho) => unknown> = {
  luna: fantasiarLunaDeCoruja,
  sol: fantasiarSolDeCatrina,
  estrella: fantasiarEstrellaDeFada,
};
