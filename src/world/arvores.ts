/**
 * AS ÁRVORES DO PARQUE — a segunda versão das quatro espécies do `tree()`.
 *
 * As antigas eram um cilindro e bolotas lisas de uma cor (a palmeira, sete
 * esferas achatadas), e cada uma eram de 4 a 8 malhas. Estas:
 *
 * - **uma malha só por árvore, um material só** (`toon` branco com a cor
 *   pintada nos VÉRTICES): o degradê da copa (fundo escuro embaixo, claro em
 *   cima), a barriga de cada tufo mais escura, o salpicado de folha e os
 *   anéis do tronco da palmeira saem sem um triângulo a mais — e o desenho
 *   por quadro cai de 4-8 para 1;
 * - **redonda e florida**: tronco torneado com o pé alargado e dois galhos
 *   entrando na copa, e a copa de tufos AMASSADOS (o ruído pela posição, como
 *   a `rock()`), achatados embaixo; a florida tem flor clara salpicada e
 *   pétala caída em volta do pé;
 * - **pinheiro**: quatro saias de agulha com a borda em estrela caída, a
 *   barriga escura de cada andar e o tronco aparecendo embaixo;
 * - **palmeira**: o tronco curvo e afinando com os anéis pintados, o pé
 *   alargado, oito folhas em arco dobradas em V (a dobra pega a luz do toon)
 *   com a borda serrilhada, os cocos e o miolo da coroa.
 *
 * O tamanho por fora é o das antigas (a altura da copa, o raio, a altura do
 * tronco): o ponto cego da câmera, a janela da clareira e o sol nascendo da
 * barraca (`scripts/noite.mjs`) foram medidos com elas.
 *
 * Triângulos por árvore (escala 1): redonda ~440, florida ~460, pinheiro
 * ~230, palmeira ~420 — as antigas tinham 352, 352, 86 e 592.
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

function copaDeTufos(s: number, semente: number, florida: boolean): THREE.BufferGeometry {
  const tronco = 2.1 * s;
  const partes: THREE.BufferGeometry[] = [];

  // o tronco com o pé alargado, entrando na copa
  partes.push(pintar(torneado([
    [0.0001, 0], [0.27 * s, 0], [0.2 * s, 0.1 * s], [0.155 * s, 0.45 * s],
    [0.135 * s, tronco * 0.8], [0.1 * s, tronco + 0.35 * s], [0.0001, tronco + 0.4 * s],
  ], 7), tintaDeTronco(semente)));
  // dois galhos abrindo para os tufos de lado
  const lado = semente * Math.PI * 2;
  for (const [ang, alto, comp] of [[lado, 0.78, 0.85], [lado + 2.6, 0.86, 0.75]] as const) {
    const a = new THREE.Vector3(0, tronco * alto, 0);
    const b = new THREE.Vector3(Math.cos(ang) * comp * s, tronco * alto + 0.55 * s, Math.sin(ang) * comp * s);
    partes.push(pintar(galho(a, b, 0.075 * s, 0.035 * s), tintaDeTronco(semente)));
  }

  // os tufos (os quatro grandes da antiga, no mesmo lugar, e dois pequenos)
  const tufos: Array<[number, number, number, number, number]> = [
    [0, tronco + 0.55 * s, 0, 1.15, 1],
    [0.62 * s, tronco + 0.15 * s, 0.2 * s, 0.78, 1],
    [-0.5 * s, tronco + 0.3 * s, -0.35 * s, 0.88, 1],
    [0.1 * s, tronco + 1.05 * s, -0.3 * s, 0.66, 1],
    [-0.28 * s, tronco + 0.05 * s, 0.55 * s, 0.5, 0],
    [0.45 * s, tronco + 0.85 * s, 0.42 * s, 0.46, 0],
  ];
  // o lado de cada tufo gira com a semente (duas árvores não saem gêmeas)
  const giro = new THREE.Matrix4().makeRotationY(semente * 6.28);
  const fundo = cor(florida ? P.floridaFunda : P.copaFundo);
  const meio = cor(florida ? P.flowerPink : P.leafMid);
  const claro = cor(florida ? P.floridaClara : P.copaClara);
  const flor = cor(florida ? P.petala : P.leafLight);
  // um tico de tom por árvore: umas mais amareladas, outras mais frias
  const tom = (semente - 0.5) * 0.12;
  const yBaixo = tronco - 0.6 * s;
  const alturaDaCopa = 2.4 * s;
  tufos.forEach(([x, y, z, r, detalhe], i) => {
    const v = new THREE.Vector3(x, 0, z).applyMatrix4(giro);
    const geo = tufo(r * s, detalhe, v.x, y, v.z, semente * 10 + i);
    partes.push(pintar(geo, (p, n, c, face) => {
      // de baixo para cima na copa, e a barriga de cada tufo mais escura
      const t = (p.y - yBaixo) / alturaDaCopa + n.y * 0.22 + tom;
      degrade(c, t, fundo, meio, claro);
      /*
       * O MOSAICO: cada triângulo um tom um pouco diferente (os três cantos
       * sorteiam pelo número da face, e não pela posição), e uns inteiros
       * claros — a flor da florida, a folha nova da redonda. É o que tira a
       * cara de bola lisa sem um triângulo a mais.
       */
      const sorte = ruido(face, i, semente, 7);
      if (sorte > (florida ? 0.7 : 0.86) && n.y > -0.25) c.lerp(flor, florida ? 0.7 : 0.45);
      else c.multiplyScalar(0.9 + sorte * 0.16);
    }));
  });

  if (florida) {
    // as pétalas caídas em volta do pé: losangos rentes ao chão
    const petalas = 12;
    for (let k = 0; k < petalas; k++) {
      const a = k * 2.39996 + semente * 7;
      const r = (0.55 + ((k * 37) % 11) / 11 * 1.15) * s;
      const tam = 0.07 * s;
      const px = Math.cos(a) * r;
      const pz = Math.sin(a) * r;
      const g = new THREE.BufferGeometry();
      const rot = a * 1.7;
      const ca = Math.cos(rot) * tam;
      const sa = Math.sin(rot) * tam;
      const y = 0.012;
      g.setAttribute('position', new THREE.Float32BufferAttribute([
        px - ca, y, pz - sa, px - sa * 0.5, y, pz + ca * 0.5, px + ca, y, pz + sa,
        px - ca, y, pz - sa, px + ca, y, pz + sa, px + sa * 0.5, y, pz - ca * 0.5,
      ], 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
      // o losango tem que olhar para cima nos dois triângulos
      const pos = g.getAttribute('position') as THREE.BufferAttribute;
      for (const t0 of [0, 3]) {
        const e1 = new THREE.Vector3().fromBufferAttribute(pos, t0 + 1).sub(new THREE.Vector3().fromBufferAttribute(pos, t0));
        const e2 = new THREE.Vector3().fromBufferAttribute(pos, t0 + 2).sub(new THREE.Vector3().fromBufferAttribute(pos, t0));
        if (e1.cross(e2).y < 0) {
          const x1 = pos.getX(t0 + 1); const z1 = pos.getZ(t0 + 1);
          pos.setXYZ(t0 + 1, pos.getX(t0 + 2), y, pos.getZ(t0 + 2));
          pos.setXYZ(t0 + 2, x1, y, z1);
        }
      }
      partes.push(pintar(g, (_p, _n, c) => c.copy(k % 3 === 0 ? flor : claro)));
    }
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
  const andares = 4;
  for (let i = 0; i < andares; i++) {
    const y0 = 1.15 * s + i * 0.55 * s;
    const alto = (1.2 - i * 0.1) * s;
    const r = (1.15 - i * 0.24) * s;
    partes.push(pintar(saia(r, alto, y0, 6, semente * 6 + i), (p, nn, c, face) => {
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
  const ANEIS = 10;
  const RADIAL = 6;
  const tubo = new THREE.TubeGeometry(curva, ANEIS, 0.13 * s, RADIAL, false);
  {
    const pos = tubo.getAttribute('position') as THREE.BufferAttribute;
    const centro = new THREE.Vector3();
    const v = new THREE.Vector3();
    for (let k = 0; k < pos.count; k++) {
      const i = Math.floor(k / (RADIAL + 1));
      const t = i / ANEIS;
      curva.getPointAt(t, centro);
      const f = (1.12 - 0.42 * t) * (t < 0.08 ? 1.45 : 1);
      v.fromBufferAttribute(pos, k).sub(centro).multiplyScalar(f).add(centro);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
    tubo.computeVertexNormals();
  }
  const anelClaro = cor(P.palmeiraTronco);
  const anelEscuro = cor(P.palmeiraTroncoEscuro);
  // o anel: cada volta do tubo alterna claro e escuro (o vértice sabe a volta pela altura)
  partes.push(pintar(tubo, (p, _n, c) => {
    const volta = (p.y / (3.1 * s)) * ANEIS;
    const k = Math.abs(((volta % 1) + 1) % 1 - 0.5) * 2;
    c.copy(anelEscuro).lerp(anelClaro, k);
  }));

  const topo = curva.getPointAt(1).add(new THREE.Vector3(0, 0.04 * s, 0));
  // o miolo da coroa e os cocos
  partes.push(pintar(new THREE.IcosahedronGeometry(0.17 * s, 0).translate(topo.x, topo.y + 0.05 * s, topo.z),
    (_p, _n, c) => c.set(P.palmeiraTroncoEscuro).lerp(cor(P.palmeiraFolha), 0.4)));
  for (let k = 0; k < 3; k++) {
    const a = lado + k * 2.1;
    partes.push(pintar(new THREE.IcosahedronGeometry(0.105 * s, 0).translate(
      topo.x + Math.cos(a) * 0.15 * s, topo.y - 0.12 * s, topo.z + Math.sin(a) * 0.15 * s,
    ), (p, _n, c) => c.set(P.coco).multiplyScalar(0.9 + ruido(p.x, p.y, p.z, k) * 0.2)));
  }

  // as folhas: um arco que sobe e cai, dobrado em V na nervura, com a borda serrilhada
  const FOLHAS = 8;
  const GOMOS = 7;
  const folhaEscura = cor(P.palmeiraFolha);
  const folhaClara = cor(P.palmeiraFolhaClara);
  const folhaSeca = cor(P.grassDry);
  for (let f = 0; f < FOLHAS; f++) {
    const a = (f / FOLHAS) * Math.PI * 2 + semente * 3;
    const baixa = f % 2 === 0;
    const L = (baixa ? 1.75 : 1.55) * s * (0.92 + ruido(f, 0, 0, semente) * 0.16);
    const sobe = baixa ? 0.3 : 0.55;
    const fora = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const deLado = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
    const pos: number[] = [];
    const nervura: THREE.Vector3[] = [];
    const esq: THREE.Vector3[] = [];
    const dir: THREE.Vector3[] = [];
    for (let i = 0; i <= GOMOS; i++) {
      const u = i / GOMOS;
      const p = topo.clone().addScaledVector(fora, L * u).add(new THREE.Vector3(0, L * (sobe * u - 1.05 * u * u), 0));
      // largura: cresce, e afina na ponta; um gomo sim, um não, mais estreito (a serra)
      const larg = 0.3 * s * Math.sin(Math.PI * Math.pow(u, 0.75)) * (i % 2 ? 0.72 : 1);
      const dobra = new THREE.Vector3(0, -larg * 0.45, 0);
      nervura.push(p.clone().add(new THREE.Vector3(0, 0.02 * s, 0)));
      esq.push(p.clone().addScaledVector(deLado, larg).add(dobra));
      dir.push(p.clone().addScaledVector(deLado, -larg).add(dobra));
    }
    const tri = (x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3): void => { pos.push(x.x, x.y, x.z, y.x, y.y, y.z, z.x, z.y, z.z); };
    for (let i = 0; i < GOMOS; i++) {
      tri(esq[i], nervura[i], nervura[i + 1]);
      tri(esq[i], nervura[i + 1], esq[i + 1]);
      tri(nervura[i], dir[i], dir[i + 1]);
      tri(nervura[i], dir[i + 1], nervura[i + 1]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.computeVertexNormals();
    const seca = baixa && ruido(f, 1, 0, semente) > 0.6;
    partes.push(pintar(geo, (p, _n, c) => {
      // a nervura clara, a borda escura, e a ponta da folha de baixo amarelando
      const naNervura = Math.abs(p.clone().sub(topo).dot(deLado)) < 0.05 * s;
      const u = Math.min(1, p.clone().sub(topo).dot(fora) / L);
      c.copy(folhaEscura).lerp(folhaClara, naNervura ? 0.75 : 0.15 + u * 0.25);
      if (seca) c.lerp(folhaSeca, Math.max(0, u - 0.55) * 1.4);
    }));
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
