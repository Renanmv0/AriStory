import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { Vento } from '../core/shaders';
import { novaTextura, sorteio } from './texturasDeChao';
import { torneado } from './moveisDaBoutique';

/**
 * ================================================== AS PLANTAS DO JARDIM DA CASA
 *
 * O jardim da frente da casa do Ari (`scenes/frenteDaCasa.ts`). O Renan pediu
 * plantas NOVAS e bem feitas no lugar dos canteiros redondos de tijolo e das
 * florzinhas de pirulito ("os canteiros redondos são sem graça"), e um muro
 * decorado só com verde. É um jardim de casa de hoje: maciço de hortênsia
 * encostado na parede, fileira de lavanda, touceira de capim com pluma,
 * agave no pedrisco, costela-de-adão na sombra, margarida solta na grama,
 * buxinho em vaso de cimento ao lado da porta — e hera caindo por cima do
 * muro.
 *
 * COMO SÃO FEITAS (o que as `threejs-*` ensinam, com as regras daqui):
 *
 *  - CADA ESPÉCIE É UM LOTE PARA O JARDIM INTEIRO. As funções recebem a lista
 *    dos pés (`{ x, z, escala, semente, cor }`, em coordenadas do MUNDO, como
 *    as `samambaias()` da clareira) e devolvem um grupo com dois ou três
 *    `InstancedMesh` — sete hortênsias são três desenhos, e não vinte e um;
 *  - a folha, a pétala e a lâmina são GEOMETRIA PRÓPRIA, dobradas na nervura
 *    (`fita()`): dobrada, a folha pega luz de um lado e sombra do outro, e
 *    deixa de ser um adesivo verde;
 *  - a cor é POR CÓPIA (a touceira mistura três verdes; cada bola de
 *    hortênsia puxa para o lilás um tanto diferente) e, onde a peça tem duas
 *    matérias (a haste e a espiga da lavanda, o talo e a pluma do capim, a
 *    borda clara do agave), POR VÉRTICE na mesma geometria;
 *  - o que é fino e alto BALANÇA no `Vento` do kit (`core/shaders.ts`): o
 *    capim, a lavanda e a margarida. A flor nasce já na ponta da haste e
 *    divide a matriz com ela, então as duas balançam juntas sem conta
 *    nenhuma (o truque da taboa do lago). Planta de vento não projeta sombra
 *    (a sombra não balançaria); as outras projetam.
 *
 * Nenhuma delas cria colisor: quem decide onde se pisa é a cena.
 */

/** um pé de planta, no mundo */
export interface PeDePlanta {
  x: number;
  z: number;
  escala?: number;
  semente?: number;
  /** a cor da flor (hortênsia, margarida), quando a espécie tem */
  cor?: number;
}

// ====================================================================== base

const V = THREE.Vector3;

/** junta cópias (matriz e cor) e devolve o `InstancedMesh` */
class Copias {
  private readonly matrizes: THREE.Matrix4[] = [];
  private readonly cores: number[] = [];

  por(matriz: THREE.Matrix4, cor = 0xffffff): void {
    this.matrizes.push(matriz.clone());
    this.cores.push(cor);
  }

  get quantas(): number {
    return this.matrizes.length;
  }

  malha(geo: THREE.BufferGeometry, mat: THREE.Material, semSombra = false): THREE.InstancedMesh {
    const lote = new THREE.InstancedMesh(geo, mat, Math.max(1, this.matrizes.length));
    lote.count = this.matrizes.length;
    const cor = new THREE.Color();
    this.matrizes.forEach((m, i) => {
      lote.setMatrixAt(i, m);
      lote.setColorAt(i, cor.setHex(this.cores[i]));
    });
    lote.instanceMatrix.needsUpdate = true;
    if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
    if (semSombra) lote.userData.semSombra = true;
    return lote;
  }
}

/** a matriz de uma peça posta em `p`, com o `+Z` dela em `frente` e o `+Y` o mais perto possível de `cima` */
function apontar(p: THREE.Vector3, frente: THREE.Vector3, cima: THREE.Vector3, escala: number | THREE.Vector3, torce = 0): THREE.Matrix4 {
  const z = frente.clone().normalize();
  let x = new V().crossVectors(cima, z);
  if (x.lengthSq() < 1e-6) x = new V().crossVectors(new V(1, 0, 0), z);
  x.normalize();
  const y = new V().crossVectors(z, x);
  const giro = new THREE.Matrix4().makeBasis(x, y, z);
  if (torce) giro.multiply(new THREE.Matrix4().makeRotationZ(torce));
  const q = new THREE.Quaternion().setFromRotationMatrix(giro);
  const s = typeof escala === 'number' ? new V(escala, escala, escala) : escala;
  return new THREE.Matrix4().compose(p, q, s);
}

/** mistura duas cores da paleta */
function misturar(a: number, b: number, k: number): number {
  return new THREE.Color(a).lerp(new THREE.Color(b), k).getHex();
}

interface OpcoesDaFita {
  passos: number;
  /** a meia largura em cada altura (`t` de 0, no pé, a 1, na ponta) */
  larga: (t: number) => number;
  /** quanto a fita avança para o `+Z` em cada altura (o arco) */
  arco?: (t: number) => number;
  /** a altura em cada `t` (padrão: `t`, a fita tem altura 1) */
  sobe?: (t: number) => number;
  /** quanto as beiras recuam em relação à nervura, em larguras (a dobra em V) */
  vinco?: number;
  /** a cor em cada altura (com ela, a geometria ganha o atributo `color`) */
  cor?: (t: number, naBeira: boolean) => THREE.Color;
}

/**
 * A FITA: a folha comprida de quase tudo aqui (a lâmina do capim, a haste, a
 * folha da hortênsia). Nasce em pé no `+Y`, de altura 1, arqueando para o
 * `+Z`, dobrada em V na nervura. Devolve os triângulos crus (posição e,
 * pedindo, cor), para quem quiser emendar com outra coisa na mesma geometria.
 */
function trianguloDaFita(o: OpcoesDaFita): { pos: number[]; cor: number[] } {
  const pos: number[] = [];
  const cor: number[] = [];
  const vinco = o.vinco ?? 0.35;
  const no = (t: number): { e: THREE.Vector3; m: THREE.Vector3; d: THREE.Vector3 } => {
    const w = o.larga(t);
    const y = o.sobe ? o.sobe(t) : t;
    const z = o.arco ? o.arco(t) : 0;
    return { e: new V(-w, y, z - vinco * w), m: new V(0, y, z), d: new V(w, y, z - vinco * w) };
  };
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, ta: [number, boolean], tb: [number, boolean], tc: [number, boolean]): void => {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    if (o.cor) for (const [t, beira] of [ta, tb, tc]) { const k = o.cor(t, beira); cor.push(k.r, k.g, k.b); }
  };
  for (let k = 0; k < o.passos; k++) {
    const t0 = k / o.passos;
    const t1 = (k + 1) / o.passos;
    const a = no(t0);
    const b = no(t1);
    tri(a.m, b.e, a.e, [t0, false], [t1, true], [t0, true]);
    tri(a.m, b.m, b.e, [t0, false], [t1, false], [t1, true]);
    tri(a.m, a.d, b.d, [t0, false], [t0, true], [t1, true]);
    tri(a.m, b.d, b.m, [t0, false], [t1, true], [t1, false]);
  }
  return { pos, cor };
}

function geometriaDe(pos: number[], cor?: number[]): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (cor && cor.length) geo.setAttribute('color', new THREE.Float32BufferAttribute(cor, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * O FUSO: a espiga da lavanda e a pluma do capim. Anéis de `lados` pontos em
 * volta de uma linha que sobe de `t0` a `t1` pelo mesmo arco da haste, com o
 * raio de cada anel dado por `raio(s)`. Devolve triângulos crus.
 */
function trianguloDoFuso(
  t0: number, t1: number, aneis: number, lados: number,
  raio: (s: number) => number, arco: (t: number) => number, cor?: (s: number) => THREE.Color,
): { pos: number[]; cor: number[] } {
  const pos: number[] = [];
  const cores: number[] = [];
  const ponto = (k: number, i: number): THREE.Vector3 => {
    const s = k / aneis;
    const t = t0 + (t1 - t0) * s;
    const a = (i / lados) * Math.PI * 2 + k * 0.5;
    const r = raio(s);
    return new V(Math.cos(a) * r, t, arco(t) + Math.sin(a) * r);
  };
  for (let k = 0; k < aneis; k++) {
    for (let i = 0; i < lados; i++) {
      const a = ponto(k, i);
      const b = ponto(k, i + 1);
      const c = ponto(k + 1, i + 1);
      const d = ponto(k + 1, i);
      for (const [p, s] of [[a, k], [c, k + 1], [b, k], [a, k], [d, k + 1], [c, k + 1]] as Array<[THREE.Vector3, number]>) {
        pos.push(p.x, p.y, p.z);
        if (cor) { const q = cor(s / aneis); cores.push(q.r, q.g, q.b); }
      }
    }
  }
  return { pos, cor: cores };
}

const BRANCO = new THREE.Color(0xffffff);

// ===================================================================== capim

/** a lâmina do capim: comprida, fina, arqueando para fora e caindo na ponta */
function geoLamina(): THREE.BufferGeometry {
  const { pos } = trianguloDaFita({
    passos: 5,
    larga: (t) => 0.042 * (1 - Math.pow(t, 1.5)) + 0.003,
    arco: (t) => 0.7 * Math.pow(t, 2.1),
    sobe: (t) => t * (1 - 0.2 * t * t * t),
    vinco: 0.5,
  });
  return geometriaDe(pos);
}

/** o talo com a pluma: a haste fina e o fuso felpudo no terço de cima, tombando um pouco */
function geoPluma(): THREE.BufferGeometry {
  const arco = (t: number): number => 0.3 * Math.pow(t, 2.6);
  const talo = new THREE.Color(P.capimPalha);
  const pluma = new THREE.Color(P.capimPluma);
  const haste = trianguloDaFita({ passos: 3, larga: () => 0.008, arco, vinco: 0.6, cor: () => talo });
  // (fina e comprida, com a cintura ondulando de leve: gorda e em gomos fortes, ela lia como cristal)
  const fuso = trianguloDoFuso(
    0.5, 1, 9, 6,
    (s) => 0.034 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 0.94 + 0.03)), 0.6) * (Math.round(s * 9) % 2 ? 0.86 : 1) + 0.002,
    arco, (s) => pluma.clone().lerp(BRANCO, 0.3 * s),
  );
  return geometriaDe([...haste.pos, ...fuso.pos], [...haste.cor, ...fuso.cor]);
}

/**
 * AS TOUCEIRAS DE CAPIM ORNAMENTAL (o capim-do-texas dos jardins de hoje): uma
 * fonte de lâminas que sobem e caem para fora, em três verdes e uma palha, e
 * as plumas cor de creme passando da folhagem. ~1,2 m com a pluma. Dois lotes
 * para todas as touceiras, os dois no vento.
 */
export function capins(pes: readonly PeDePlanta[], vento: Vento): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'capim-ornamental';
  const laminas = new Copias();
  const plumas = new Copias();
  const verdes = [P.capimVerde, P.leafLight, P.capimVerde, P.bush, P.capimPalha];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  pes.forEach((pe, n) => {
    const rnd = sorteio(5100 + Math.round((pe.semente ?? n) * 131));
    const s = pe.escala ?? 1;
    const quantas = Math.round(54 * s);
    for (let i = 0; i < quantas; i++) {
      const a = rnd() * Math.PI * 2;
      // as de dentro sobem quase em pé; as de fora abrem
      const fora = Math.pow(rnd(), 0.8);
      const d = fora * 0.13 * s;
      const alto = (0.55 + rnd() * 0.4) * s * (1 - fora * 0.25);
      e.set(0.1 + fora * 0.5 + (rnd() - 0.5) * 0.2, a + (rnd() - 0.5) * 0.5, 0, 'YXZ');
      q.setFromEuler(e);
      m.compose(new V(pe.x + Math.sin(a) * d, 0, pe.z + Math.cos(a) * d), q, new V(1.1 * s, alto, alto * (0.7 + fora * 0.5)));
      laminas.por(m, verdes[Math.floor(rnd() * verdes.length)]);
    }
    const hastes = Math.round(7 * s);
    for (let i = 0; i < hastes; i++) {
      const a = rnd() * Math.PI * 2;
      const d = rnd() * 0.09 * s;
      const alto = (0.95 + rnd() * 0.35) * s;
      e.set(0.06 + rnd() * 0.22, a, 0, 'YXZ');
      q.setFromEuler(e);
      m.compose(new V(pe.x + Math.sin(a) * d, 0, pe.z + Math.cos(a) * d), q, new V(alto, alto, alto));
      plumas.por(m, misturar(0xffffff, P.capimPluma, rnd() * 0.5));
    }
  });
  g.add(laminas.malha(geoLamina(), vento.material(0xffffff), true));
  g.add(plumas.malha(geoPluma(), vento.material(0xffffff, { corPorVertice: true }), true));
  return g;
}

// =================================================================== lavanda

/** a haste da lavanda com a espiga: a flor em gominhos, mais gorda no meio */
function geoLavanda(): THREE.BufferGeometry {
  const arco = (t: number): number => 0.1 * t * t;
  const talo = new THREE.Color(P.lavandaFolha);
  const flor = new THREE.Color(P.lavandaEspiga);
  const haste = trianguloDaFita({ passos: 2, larga: () => 0.011, arco, vinco: 0.6, cor: () => talo });
  const espiga = trianguloDoFuso(
    0.58, 1, 7, 5,
    (s) => (0.012 + 0.04 * Math.sin(Math.PI * Math.min(1, s * 0.9 + 0.08))) * (Math.round(s * 7) % 2 ? 0.62 : 1),
    arco, (s) => flor.clone().lerp(BRANCO, 0.22 * s),
  );
  return geometriaDe([...haste.pos, ...espiga.pos], [...haste.cor, ...espiga.cor]);
}

/** a folhinha da moita de lavanda: uma agulha cinza-esverdeada */
function geoAgulha(): THREE.BufferGeometry {
  const { pos } = trianguloDaFita({
    passos: 3,
    larga: (t) => 0.035 * (1 - t * t) + 0.003,
    arco: (t) => 0.3 * t * t,
    vinco: 0.4,
  });
  return geometriaDe(pos);
}

/**
 * AS MOITAS DE LAVANDA: o montinho de folhagem cinza-esverdeada (parado, faz
 * sombra) e as hastes em leque com a espiga roxa (no vento). ~55 cm.
 */
export function lavandas(pes: readonly PeDePlanta[], vento: Vento): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lavanda';
  const montes = new Copias();
  const agulhas = new Copias();
  const hastes = new Copias();
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  pes.forEach((pe, n) => {
    const rnd = sorteio(6200 + Math.round((pe.semente ?? n) * 173));
    const s = pe.escala ?? 1;
    m.compose(new V(pe.x, 0.09 * s, pe.z), q.setFromEuler(e.set(0, rnd() * 6.28, 0)), new V(0.24 * s, 0.15 * s, 0.24 * s));
    montes.por(m, misturar(P.lavandaFolha, P.leafDark, 0.25 + rnd() * 0.2));
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2;
      const fora = rnd();
      const alto = (0.2 + rnd() * 0.12) * s;
      e.set(0.15 + fora * 0.75, a, 0, 'YXZ');
      m.compose(new V(pe.x + Math.sin(a) * 0.07 * s, 0.03, pe.z + Math.cos(a) * 0.07 * s), q.setFromEuler(e), new V(s, alto, alto));
      agulhas.por(m, misturar(P.lavandaFolha, rnd() < 0.5 ? P.leafLight : P.leafDark, rnd() * 0.3));
    }
    const quantas = Math.round(22 * s);
    for (let i = 0; i < quantas; i++) {
      const a = rnd() * Math.PI * 2;
      const fora = Math.pow(rnd(), 0.7);
      const alto = (0.42 + rnd() * 0.2) * s;
      e.set(0.05 + fora * 0.55, a, 0, 'YXZ');
      m.compose(new V(pe.x + Math.sin(a) * 0.05 * s, 0.04, pe.z + Math.cos(a) * 0.05 * s), q.setFromEuler(e), new V(alto, alto, alto));
      hastes.por(m, misturar(0xffffff, P.lavandaEspigaClara, rnd() * 0.6));
    }
  });
  const monte = new THREE.IcosahedronGeometry(1, 1);
  g.add(montes.malha(monte, toon(0xffffff)));
  g.add(agulhas.malha(geoAgulha(), vento.material(0xffffff), true));
  g.add(hastes.malha(geoLavanda(), vento.material(0xffffff, { corPorVertice: true }), true));
  return g;
}

// ================================================================= hortênsia

/** a folha larga da hortênsia: oval, de ponta, dobrada na nervura e caindo um pouco */
function geoFolhaLarga(): THREE.BufferGeometry {
  // (deitada: o comprimento vai no +Z, e a face olha para o +Y)
  const { pos } = trianguloDaFita({
    passos: 5,
    larga: (t) => 0.36 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.94 + 0.03)), 0.8),
    arco: (t) => 0.12 * t * t,
    vinco: 0.32,
  });
  const geo = geometriaDe(pos);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/** a florzinha da hortênsia: quatro pétalas de ponta, em concha */
function geoFlorzinha(): THREE.BufferGeometry {
  const pos: number[] = [];
  const borda = (i: number): [number, number, number] => {
    const a = (i / 8) * Math.PI * 2;
    const r = i % 2 === 0 ? 1 : 0.64;
    return [Math.cos(a) * r, 0.28 * r * r, Math.sin(a) * r];
  };
  for (let i = 0; i < 8; i++) pos.push(0, 0, 0, ...borda(i + 1), ...borda(i));
  return geometriaDe(pos);
}

/**
 * AS HORTÊNSIAS: o maciço de folha larga (um domo de folhas, cada uma
 * apontando para fora e para baixo) e as bolas de flor por cima — cada bola
 * um miolo escuro coberto de florzinhas de quatro pétalas, cada florzinha um
 * tico mais clara ou mais escura, e cada bola puxando um tanto para o lilás
 * (hortênsia de verdade muda de cor no mesmo pé). ~85 cm. Três lotes.
 */
export function hortensias(pes: readonly PeDePlanta[]): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'hortensia';
  const folhas = new Copias();
  const miolos = new Copias();
  const flores = new Copias();
  const verdes = [P.leafDark, P.hortensiaFolha, P.hortensiaFolha, P.bush];
  const CIMA = new V(0, 1, 0);
  pes.forEach((pe, n) => {
    const rnd = sorteio(7300 + Math.round((pe.semente ?? n) * 211));
    const s = pe.escala ?? 1;
    const base = pe.cor ?? P.hortensiaAzul;
    const R = 0.4 * s;
    const H = 0.5 * s;
    const naCopa = (teta: number, fi: number, k = 1): THREE.Vector3 =>
      new V(pe.x + Math.sin(teta) * Math.cos(fi) * R * k, 0.1 * s + Math.cos(teta) * H * k, pe.z + Math.sin(teta) * Math.sin(fi) * R * k);
    // as folhas: espiral de Fibonacci no domo, da coroa até quase o chão
    const quantas = Math.round(46 * s);
    for (let i = 0; i < quantas; i++) {
      const teta = Math.acos(1 - ((i + 0.5) / quantas) * 0.98);
      const fi = i * 2.39996 + rnd() * 0.4;
      const p = naCopa(teta, fi, 0.62 + rnd() * 0.12);
      const fora = new V(Math.cos(fi), 0, Math.sin(fi));
      // a folha aponta para fora e cai mais quanto mais embaixo ela nasce
      const rumo = fora.clone().multiplyScalar(0.95).add(new V(0, 0.55 - teta * 0.62, 0));
      const normal = fora.clone().multiplyScalar(Math.sin(teta) * 0.6).add(new V(0, 1, 0));
      folhas.por(apontar(p, rumo, normal, (0.26 + rnd() * 0.1) * s, (rnd() - 0.5) * 0.5), verdes[Math.floor(rnd() * verdes.length)]);
    }
    // as bolas de flor: uma no alto e as outras em volta, na metade de cima
    const bolas = Math.max(3, Math.round(6 * s + rnd()));
    for (let b = 0; b < bolas; b++) {
      const teta = b === 0 ? 0.12 : 0.55 + rnd() * 0.6;
      const fi = b * 2.39996 * 1.3 + rnd() * 0.5;
      const r = (0.15 + rnd() * 0.045) * s;
      const c = naCopa(teta, fi, 0.96).add(new V(0, r * 0.35, 0));
      const cor = misturar(base, P.hortensiaLilas, rnd() * 0.45);
      miolos.por(new THREE.Matrix4().compose(c, new THREE.Quaternion(), new V(r * 0.84, r * 0.84, r * 0.84)), misturar(cor, P.leafDark, 0.35));
      const florzinhas = 26;
      for (let i = 0; i < florzinhas; i++) {
        // só a parte de cima e os lados: embaixo da bola ninguém vê
        const y = 1 - ((i + 0.5) / florzinhas) * 1.45;
        const raio = Math.sqrt(Math.max(0, 1 - y * y));
        const a = i * 2.39996 + b;
        const normal = new V(Math.cos(a) * raio, y, Math.sin(a) * raio);
        const p = c.clone().addScaledVector(normal, r * 0.9);
        const lado = new V().crossVectors(normal, Math.abs(normal.y) > 0.9 ? new V(1, 0, 0) : CIMA).normalize();
        flores.por(
          apontar(p, lado, normal, r * (0.44 + rnd() * 0.12), rnd() * 6.28),
          misturar(cor, rnd() < 0.5 ? 0xffffff : base, rnd() * 0.3),
        );
      }
    }
  });
  g.add(folhas.malha(geoFolhaLarga(), toon(0xffffff, { doubleSide: true })));
  g.add(miolos.malha(new THREE.IcosahedronGeometry(1, 1), toon(0xffffff)));
  g.add(flores.malha(geoFlorzinha(), toon(0xffffff, { doubleSide: true })));
  return g;
}

// ===================================================================== agave

/**
 * A folha do agave: grossa (é um sólido fechado: a calha de cima, a quilha de
 * baixo), larga perto do pé e afinando até o espinho; a borda é mais clara e
 * a ponta escura. Comprimento 1 no `+Z`, subindo um pouco.
 */
function geoFolhaDeAgave(): THREE.BufferGeometry {
  const pos: number[] = [];
  const cor: number[] = [];
  const corpo = new THREE.Color(P.agaveFolha);
  const borda = new THREE.Color(P.agaveBorda);
  const espinho = new THREE.Color(P.agaveEspinho);
  const passos = 5;
  const no = (t: number): { e: THREE.Vector3; d: THREE.Vector3; c: THREE.Vector3; q: THREE.Vector3 } => {
    const w = 0.15 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.8 + 0.2)), 0.9) * (t > 0.86 ? (1 - t) / 0.14 : 1) + 0.002;
    const y = 0.16 * t * t;
    return {
      e: new V(-w, y + w * 0.38, t), d: new V(w, y + w * 0.38, t),
      c: new V(0, y, t), q: new V(0, y - w * 0.55, t),
    };
  };
  const pinta = (t: number, naBeira: boolean): THREE.Color => (t > 0.9 ? espinho : naBeira ? borda : corpo);
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, ka: THREE.Color, kb: THREE.Color, kc: THREE.Color): void => {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    for (const k of [ka, kb, kc]) cor.push(k.r, k.g, k.b);
  };
  for (let k = 0; k < passos; k++) {
    const t0 = k / passos;
    const t1 = (k + 1) / passos;
    const a = no(t0);
    const b = no(t1);
    // a calha de cima (duas faces) e a quilha de baixo (duas faces)
    tri(a.c, a.e, b.e, pinta(t0, false), pinta(t0, true), pinta(t1, true));
    tri(a.c, b.e, b.c, pinta(t0, false), pinta(t1, true), pinta(t1, false));
    tri(a.c, b.d, a.d, pinta(t0, false), pinta(t1, true), pinta(t0, true));
    tri(a.c, b.c, b.d, pinta(t0, false), pinta(t1, false), pinta(t1, true));
    tri(a.q, b.e, a.e, pinta(t0, false), pinta(t1, true), pinta(t0, true));
    tri(a.q, b.q, b.e, pinta(t0, false), pinta(t1, false), pinta(t1, true));
    tri(a.q, a.d, b.d, pinta(t0, false), pinta(t0, true), pinta(t1, true));
    tri(a.q, b.d, b.q, pinta(t0, false), pinta(t1, true), pinta(t1, false));
  }
  return geometriaDe(pos, cor);
}

/**
 * OS AGAVES: a roseta de folhas grossas e pontudas, em três voltas — as de
 * fora quase deitadas, as do meio abertas, as de dentro em pé. ~45 cm de
 * alto, 90 de roda. Um lote, a cor nos vértices.
 */
export function agaves(pes: readonly PeDePlanta[]): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'agave';
  const folhas = new Copias();
  const VOLTAS: Array<[number, number, number]> = [[7, 0.3, 0.5], [6, 0.82, 0.42], [4, 1.26, 0.3]];
  pes.forEach((pe, n) => {
    const rnd = sorteio(8400 + Math.round((pe.semente ?? n) * 157));
    const s = pe.escala ?? 1;
    const giro = rnd() * 6.28;
    VOLTAS.forEach(([quantas, sobe, comprido], v) => {
      for (let i = 0; i < quantas; i++) {
        const a = giro + (i / quantas) * Math.PI * 2 + v * 0.45 + (rnd() - 0.5) * 0.2;
        const elev = sobe + (rnd() - 0.5) * 0.14;
        const frente = new V(Math.sin(a) * Math.cos(elev), Math.sin(elev), Math.cos(a) * Math.cos(elev));
        const p = new V(pe.x + Math.sin(a) * 0.03 * s, 0.03 * s + v * 0.02 * s, pe.z + Math.cos(a) * 0.03 * s);
        const c = (comprido + rnd() * 0.06) * s;
        folhas.por(apontar(p, frente, new V(0, 1, 0), new V(c * 1.15, c, c)), misturar(0xffffff, P.agaveBorda, rnd() * 0.35));
      }
    });
  });
  g.add(folhas.malha(geoFolhaDeAgave(), toon(0xffffff, { corPorVertice: true })));
  return g;
}

// ================================================================= margarida

/** a haste da margarida, com as duas folhinhas do pé */
function geoHasteDeFlor(): THREE.BufferGeometry {
  const arco = (t: number): number => 0.1 * t * t;
  const haste = trianguloDaFita({ passos: 3, larga: () => 0.016, arco, vinco: 0.6 });
  const pos = [...haste.pos];
  for (const lado of [-1, 1]) {
    const folha = trianguloDaFita({
      passos: 3,
      larga: (t) => 0.07 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.06)),
      arco: (t) => 0.5 * t * t,
      sobe: (t) => t * 0.42,
      vinco: 0.4,
    });
    const giro = new THREE.Matrix4().makeRotationY(lado * 1.9);
    const p = new V();
    for (let i = 0; i < folha.pos.length; i += 3) {
      p.set(folha.pos[i], folha.pos[i + 1], folha.pos[i + 2]).applyMatrix4(giro);
      pos.push(p.x, p.y, p.z);
    }
  }
  return geometriaDe(pos);
}

/** as pétalas: doze, em leque, numa concha rasa — já na ponta da haste e viradas um pouco para fora */
function geoPetalas(): THREE.BufferGeometry {
  const N = 24;
  const pos: number[] = [];
  const borda = (i: number): [number, number, number] => {
    const a = (i / N) * Math.PI * 2;
    const r = 0.12 + 0.16 * Math.pow(Math.abs(Math.cos(6 * a / 2)), 0.55);
    return [Math.cos(a) * r, 0.5 * r * r, Math.sin(a) * r];
  };
  for (let i = 0; i < N; i++) pos.push(0, 0, 0, ...borda(i + 1), ...borda(i));
  const geo = geometriaDe(pos);
  geo.rotateX(0.5);
  geo.translate(0, 1, 0.1);
  geo.computeVertexNormals();
  return geo;
}

/** o miolo: um botão baixo, no meio das pétalas */
function geoMiolo(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.09, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2).toNonIndexed();
  geo.scale(1, 0.75, 1);
  geo.rotateX(0.5);
  geo.translate(0, 1.005, 0.1);
  geo.deleteAttribute('uv');
  geo.computeVertexNormals();
  return geo;
}

/** uma moita de margaridas: onde, quantas, o raio da moita e as cores sorteadas */
export interface MoitaDeMargaridas extends PeDePlanta {
  quantas: number;
  raio: number;
  cores?: readonly number[];
}

/**
 * AS MARGARIDAS: flor de pétala de verdade (doze, em concha, com o miolo
 * amarelo), numa haste fina com duas folhinhas, soltas em moitas na grama e
 * na beira dos canteiros. ~35 cm. Três lotes para o jardim todo, no vento —
 * a flor divide a matriz com a haste e balança junto com ela.
 */
export function margaridas(moitas: readonly MoitaDeMargaridas[], vento: Vento): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'margaridas';
  const hastes = new Copias();
  const petalas = new Copias();
  const miolos = new Copias();
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  moitas.forEach((moita, n) => {
    const rnd = sorteio(9500 + Math.round((moita.semente ?? n) * 191));
    const cores = moita.cores ?? [P.margaridaBranca];
    for (let i = 0; i < moita.quantas; i++) {
      // espalhadas na moita, sem cair uma em cima da outra (o ângulo de ouro)
      const a = i * 2.39996 + rnd() * 0.6;
      const d = Math.sqrt((i + 0.6) / moita.quantas) * moita.raio;
      const alto = (0.28 + rnd() * 0.16) * (moita.escala ?? 1);
      // cada flor olha um pouco para fora da moita
      e.set(0.05 + rnd() * 0.22, a + (rnd() - 0.5) * 0.8, 0, 'YXZ');
      m.compose(new V(moita.x + Math.sin(a) * d, 0, moita.z + Math.cos(a) * d), q.setFromEuler(e), new V(alto, alto, alto));
      hastes.por(m, rnd() < 0.5 ? P.leafDark : P.hortensiaFolha);
      petalas.por(m, cores[Math.floor(rnd() * cores.length)]);
      miolos.por(m, P.margaridaMiolo);
    }
  });
  g.add(hastes.malha(geoHasteDeFlor(), vento.material(0xffffff), true));
  g.add(petalas.malha(geoPetalas(), vento.material(0xffffff), true));
  g.add(miolos.malha(geoMiolo(), vento.material(0xffffff), true));
  return g;
}

// =========================================================== costela-de-adão

/**
 * A folha da costela-de-adão: o coração largo com os RASGOS que vão da borda
 * até perto da nervura (é o rasgo que diz "costela-de-adão"), dobrada em V e
 * com a ponta caindo. Comprimento 1 no `+Z`, a face para o `+Y`.
 */
function geoFolhaRasgada(): THREE.BufferGeometry {
  const RASGOS = [0.3, 0.46, 0.62, 0.77];
  const MEIO_RASGO = 0.04;
  // as alturas amostradas: o começo, o meio e o fim de cada rasgo, e o que fica entre eles
  const ts = new Set<number>([0, 0.03, 0.1, 0.2, 0.9, 0.96, 1]);
  for (const r of RASGOS) {
    ts.add(r - MEIO_RASGO);
    ts.add(r);
    ts.add(r + MEIO_RASGO);
    ts.add(r + 0.08);
  }
  const lista = [...ts].sort((a, b) => a - b);
  const largura = (t: number): number => {
    // o coração: abre rápido no pé (os dois lóbulos), gordo no terço de baixo, e fecha em ponta
    const cheio = 0.5 * Math.pow(Math.sin(Math.PI * Math.min(1, Math.pow(t, 0.62))), 0.7) + 0.004;
    let rasgo = 0;
    for (const r of RASGOS) rasgo = Math.max(rasgo, 1 - Math.abs(t - r) / MEIO_RASGO);
    return cheio * (1 - 0.68 * Math.max(0, rasgo));
  };
  const pos: number[] = [];
  const no = (t: number): { e: THREE.Vector3; m: THREE.Vector3; d: THREE.Vector3 } => {
    const w = largura(t);
    const y = -0.2 * t * t;
    // (os lóbulos do pé passam para trás da inserção do talo)
    const z = t - 0.1 * Math.max(0, 1 - t / 0.2) * (w / 0.5);
    return { e: new V(-w, y + 0.24 * w, z), m: new V(0, y, t), d: new V(w, y + 0.24 * w, z) };
  };
  for (let k = 0; k < lista.length - 1; k++) {
    const a = no(lista[k]);
    const b = no(lista[k + 1]);
    for (const [p1, p2, p3] of [[a.m, a.e, b.e], [a.m, b.e, b.m], [a.m, b.d, a.d], [a.m, b.m, b.d]]) {
      pos.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
    }
  }
  return geometriaDe(pos);
}

/** o talo da folha: sobe e abre para fora */
const ARCO_DO_TALO = (t: number): number => 0.5 * Math.pow(t, 1.7);
function geoTalo(): THREE.BufferGeometry {
  const { pos } = trianguloDaFita({ passos: 4, larga: () => 0.014, arco: ARCO_DO_TALO, vinco: 0.7 });
  return geometriaDe(pos);
}

/**
 * AS COSTELAS-DE-ADÃO: sete ou oito folhas grandes e rasgadas, cada uma na
 * ponta do seu talo, abrindo em roda — as de fora mais baixas, a do meio em
 * pé. ~90 cm. Planta de sombra: fica bem no pé da casa e debaixo da árvore.
 * Dois lotes.
 */
export function costelasDeAdao(pes: readonly PeDePlanta[]): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'costela-de-adao';
  const folhas = new Copias();
  const talos = new Copias();
  const verdes = [P.costelaFolha, P.leafDark, P.costelaFolha, P.hortensiaFolha];
  const e = new THREE.Euler();
  const q = new THREE.Quaternion();
  pes.forEach((pe, n) => {
    const rnd = sorteio(10600 + Math.round((pe.semente ?? n) * 149));
    const s = pe.escala ?? 1;
    const quantas = 7 + Math.floor(rnd() * 2);
    for (let i = 0; i < quantas; i++) {
      const a = (i / quantas) * Math.PI * 2 + rnd() * 0.5;
      // a primeira sobe quase em pé, no meio; as outras abrem em roda
      const tomba = i === 0 ? 0.12 : 0.28 + rnd() * 0.5;
      const comprido = (i === 0 ? 0.78 : 0.5 + rnd() * 0.3) * s;
      e.set(tomba, a, 0, 'YXZ');
      q.setFromEuler(e);
      const pe0 = new V(pe.x + Math.sin(a) * 0.04 * s, 0, pe.z + Math.cos(a) * 0.04 * s);
      talos.por(new THREE.Matrix4().compose(pe0, q, new V(comprido, comprido, comprido)), P.costelaTalo);
      // a ponta do talo, no mundo, e o rumo em que ele chega nela
      const ponta = new V(0, 1, ARCO_DO_TALO(1)).multiplyScalar(comprido).applyQuaternion(q).add(pe0);
      const fora = new V(Math.sin(a), 0, Math.cos(a));
      const rumo = fora.clone().add(new V(0, -0.1 - rnd() * 0.25, 0));
      const normal = new V(0, 1, 0).addScaledVector(fora, 0.35 + tomba * 0.5);
      folhas.por(apontar(ponta, rumo, normal, (0.44 + rnd() * 0.14) * s, (rnd() - 0.5) * 0.3), verdes[Math.floor(rnd() * verdes.length)]);
    }
  });
  g.add(talos.malha(geoTalo(), toon(0xffffff, { doubleSide: true })));
  g.add(folhas.malha(geoFolhaRasgada(), toon(0xffffff, { doubleSide: true })));
  return g;
}

// =========================================================== buxinho no vaso

/** a folhinha miúda do buxinho */
function geoFolhinha(): THREE.BufferGeometry {
  const { pos } = trianguloDaFita({
    passos: 2,
    larga: (t) => 0.3 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.05)),
    vinco: 0.35,
  });
  const geo = geometriaDe(pos);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * O BUXINHO NO VASO: a bola de topiaria aparada (a bola amassada pela
 * POSIÇÃO, coberta de folhinhas em lote que quebram o contorno) num vaso
 * cilíndrico de cimento, de boca virada, com a terra à vista. É o par que
 * ladeia a porta da casa. A base no chão; `raio` é o da bola.
 */
export function buxinhoNoVaso(raio = 0.3, semente = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'buxinho-no-vaso';
  const rnd = sorteio(11700 + Math.round(semente * 97));
  const rv = raio * 0.95;
  const alto = raio * 1.55;
  // o vaso torneado: o pé recolhido, a parede quase reta, a boca virada para fora e a parede de dentro
  const vaso = new THREE.Mesh(torneado([
    [0, 0], [rv * 0.8, 0], [rv * 0.84, 0.02], [rv * 0.97, alto * 0.9], [rv * 1.04, alto * 0.94],
    [rv * 1.04, alto], [rv * 0.9, alto], [rv * 0.88, alto * 0.86], [0, alto * 0.86],
  ], 18), toon(P.vasoDeCimento));
  g.add(vaso);
  const terra = new THREE.Mesh(new THREE.CircleGeometry(rv * 0.89, 14).rotateX(-Math.PI / 2), toon(P.dirt));
  terra.position.y = alto * 0.87;
  g.add(terra);
  // o tronquinho e a bola
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.07, raio * 0.09, raio * 0.6, 6, 1, true), toon(P.costelaTalo));
  tronco.position.y = alto * 0.87 + raio * 0.3;
  g.add(tronco);
  const centro = new V(0, alto * 0.87 + raio * 1.25, 0);
  const bola = new THREE.IcosahedronGeometry(raio, 2);
  const pos = bola.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // (a geometria não é indexada: o empurrão vem da posição, e a mesma quina recebe o mesmo)
    const h = Math.sin(Math.round(x * 300) * 12.9898 + Math.round(y * 300) * 78.233 + Math.round(z * 300) * 37.719 + semente) * 43758.5453;
    const k = 1 + ((h - Math.floor(h)) - 0.5) * 0.1;
    pos.setXYZ(i, x * k, y * k, z * k);
  }
  bola.computeVertexNormals();
  const copa = new THREE.Mesh(bola, toon(P.buxinho));
  copa.position.copy(centro);
  g.add(copa);
  const folhas = new Copias();
  const quantas = 130;
  for (let i = 0; i < quantas; i++) {
    const y = 1 - ((i + 0.5) / quantas) * 1.9;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const a = i * 2.39996;
    const normal = new V(Math.cos(a) * r, y, Math.sin(a) * r);
    const p = centro.clone().addScaledVector(normal, raio * 0.97);
    // (deitada na bola, só a ponta levantando: topiaria é aparada, e folha em pé virava ouriço)
    const rumo = new V(rnd() - 0.5, rnd() - 0.2, rnd() - 0.5).cross(normal).addScaledVector(normal, 0.22);
    folhas.por(apontar(p, rumo, normal, raio * (0.13 + rnd() * 0.06), rnd() * 6.28), rnd() < 0.35 ? P.leafLight : rnd() < 0.5 ? P.buxinho : P.bush);
  }
  g.add(folhas.malha(geoFolhinha(), toon(0xffffff, { doubleSide: true })));
  return g;
}

// ============================================================ a hera do muro

/** a folha de hera: três pontas, um tico em concha, a ponta no `+Z` e a face no `+Y` */
function geoFolhaDeHera(): THREE.BufferGeometry {
  const borda: Array<[number, number]> = [[0, -0.05], [-0.34, -0.12], [-0.56, 0.24], [-0.24, 0.5], [0, 1], [0.24, 0.5], [0.56, 0.24], [0.34, -0.12]];
  const pos: number[] = [];
  for (let i = 0; i < borda.length; i++) {
    const [ax, az] = borda[i];
    const [bx, bz] = borda[(i + 1) % borda.length];
    // (a nervura afunda: o meio fica abaixo das pontas)
    pos.push(0, -0.07, 0.34, bx, 0, bz, ax, 0, az);
  }
  return geometriaDe(pos);
}

/** um trecho de muro (pela linha do meio dele) para a hera cobrir */
export interface MuroComHera {
  a: readonly [number, number];
  b: readonly [number, number];
  /** a altura do topo do muro (com o capeamento) */
  altura: number;
  espessura: number;
  /** de 0 a 1: que parte do comprimento ganha hera */
  cobre?: number;
  /** até onde ela desce pela face de fora e pela de dentro, no máximo */
  queda?: number;
  semente?: number;
}

/**
 * A HERA NO MURO — o muro "decorado só com verde" que o Renan pediu. Ela
 * nasce em MACIÇOS por cima do capeamento e cai pelos dois lados: denso em
 * cima, rareando para baixo, com uns fios compridos que descem mais que o
 * resto. Cada folha fica deitada na face em que está (a normal do muro, um
 * tico para fora) com a ponta para baixo, em quatro verdes — as de baixo da
 * pilha mais escuras, que é a sombra das de cima. Um lote para todos os
 * muros.
 */
export function heraNosMuros(muros: readonly MuroComHera[]): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'hera-do-muro';
  const folhas = new Copias();
  const CIMA = new V(0, 1, 0);
  muros.forEach((muro, n) => {
    const rnd = sorteio(12800 + Math.round((muro.semente ?? n) * 163));
    const gauss = (): number => (rnd() + rnd() + rnd() - 1.5) / 1.5;
    const a = new V(muro.a[0], 0, muro.a[1]);
    const b = new V(muro.b[0], 0, muro.b[1]);
    const comprido = a.distanceTo(b);
    const ao = b.clone().sub(a).normalize();
    // (o lado de FORA é o da esquerda de quem vai de `a` para `b`: é o que ganha mais folha)
    const fora = new V(-ao.z, 0, ao.x);
    const meia = muro.espessura / 2;
    const cobre = muro.cobre ?? 0.6;
    const quedaMaxima = muro.queda ?? 0.8;
    const macicos = Math.max(1, Math.round((comprido * cobre) / 1.5));
    /** uma folha na face `lado` (+1 fora, −1 dentro, 0 em cima), a `u` do começo e `desce` abaixo do topo */
    const folha = (u: number, lado: number, desce: number, camada: number): void => {
      if (u < 0.06 || u > comprido - 0.06) return;
      const afasta = 0.015 + camada * 0.03;
      const p = a.clone().addScaledVector(ao, u);
      let normal: THREE.Vector3;
      let rumo: THREE.Vector3;
      if (lado === 0) {
        const z = (rnd() - 0.5) * muro.espessura;
        p.addScaledVector(fora, z).setY(muro.altura + afasta);
        normal = CIMA.clone().addScaledVector(fora, z * 1.5);
        rumo = fora.clone().multiplyScalar(z >= 0 ? 1 : -1).addScaledVector(ao, (rnd() - 0.5) * 1.6);
      } else {
        p.addScaledVector(fora, lado * (meia + afasta)).setY(muro.altura - desce);
        normal = fora.clone().multiplyScalar(lado).add(new V(0, 0.25 + rnd() * 0.3, 0));
        rumo = new V(0, -1, 0).addScaledVector(ao, (rnd() - 0.5) * 1.3).addScaledVector(fora, lado * 0.25);
      }
      const verde = camada === 0 ? (rnd() < 0.6 ? P.heraEscura : P.leafDark) : rnd() < 0.3 ? P.heraClara : rnd() < 0.6 ? P.bush : P.heraMedia;
      folhas.por(apontar(p, rumo, normal, 0.12 + rnd() * 0.07, (rnd() - 0.5) * 0.5), verde);
    };
    for (let k = 0; k < macicos; k++) {
      const u0 = ((k + 0.5) / macicos) * comprido + (rnd() - 0.5) * (comprido / macicos) * 0.5;
      const meiaLargura = 0.55 + rnd() * 0.45;
      const queda = quedaMaxima * (0.55 + rnd() * 0.45);
      const quantas = Math.round(95 * meiaLargura);
      for (let i = 0; i < quantas; i++) {
        const du = gauss() * meiaLargura;
        const u = u0 + du;
        // no meio do maciço ela desce mais; nas pontas, só a beirada
        const fundo = Math.max(0.08, 1 - Math.pow(Math.abs(du) / (meiaLargura * 1.25), 2));
        const sorte = rnd();
        const camada = rnd() < 0.42 ? 0 : 1;
        if (sorte < 0.3) folha(u, 0, 0, camada);
        else if (sorte < 0.74) folha(u, 1, Math.pow(rnd(), 1.5) * queda * fundo, camada);
        else folha(u, -1, Math.pow(rnd(), 1.7) * queda * 0.7 * fundo, camada);
      }
      // os fios que descem mais que o resto: uma fila de folhas, cada uma menor
      const fios = 2 + Math.floor(rnd() * 3);
      for (let f = 0; f < fios; f++) {
        const lado = rnd() < 0.7 ? 1 : -1;
        let u = u0 + gauss() * meiaLargura * 0.8;
        const comprimento = queda * (0.9 + rnd() * 0.5);
        for (let d = 0.1; d < comprimento; d += 0.085) {
          u += (rnd() - 0.5) * 0.07;
          folha(u, lado, d, 1);
        }
      }
    }
  });
  g.add(folhas.malha(geoFolhaDeHera(), toon(0xffffff, { doubleSide: true })));
  return g;
}

// ============================================================== as texturas

/** a casca de pínus do canteiro: lascas claras e escuras, quase branca (a cor vem do material) */
export function cascaDePinus(): THREE.CanvasTexture {
  return novaTextura('casca-de-pinus', 1.3, (ctx, s) => {
    const rnd = sorteio(31337);
    ctx.fillStyle = '#e9e2da';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 520; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const l = 5 + rnd() * 9;
      const a = rnd() * Math.PI;
      const tom = 205 + Math.floor(rnd() * 50);
      const chata = 0.35 + rnd() * 0.2;
      ctx.fillStyle = `rgb(${tom},${tom - 6},${tom - 12})`;
      // (a lasca que cai na emenda é pintada dos dois lados dela)
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          ctx.save();
          ctx.translate(x + dx, y + dy);
          ctx.rotate(a);
          ctx.beginPath();
          ctx.ellipse(0, 0, l, l * chata, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  });
}

/** o pedrisco branco da faixa junto ao muro: seixinhos miúdos, com a sombra entre eles */
export function pedrisco(): THREE.CanvasTexture {
  return novaTextura('pedrisco-branco', 0.9, (ctx, s) => {
    const rnd = sorteio(27182);
    ctx.fillStyle = '#d9d5cc';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 760; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = 3 + rnd() * 4.5;
      const tom = 232 + Math.floor(rnd() * 23);
      const chata = 0.7 + rnd() * 0.3;
      const giro = rnd() * 3;
      ctx.fillStyle = `rgb(${tom},${tom},${tom - 4})`;
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          ctx.beginPath();
          ctx.ellipse(x + dx, y + dy, r, r * chata, giro, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  });
}
