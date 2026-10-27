import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../fundir';
import { chapeuDeBruxa } from './pecas';
import { LoteDeAboboras } from './abobora';

/*
 * OS INFLÁVEIS GIGANTES do parque enfeitado (pedido do Renan: "bonecos
 * infláveis gigantes" para a praça de gelo e a sorveteria terem cara de
 * Halloween): o FANTASMA de braços para cima, o GATO PRETO sentado e a
 * ABÓBORA de chapéu de bruxa — cada um com uns três metros.
 *
 * O QUE LÊ INFLÁVEL, e não estátua:
 *  - tudo é GORDO e arredondado (ar dentro de lona), sem quina nenhuma;
 *  - o REFLEXO do vinil: manchas brancas acesas em cima de cada parte gorda;
 *  - as COSTURAS em anel onde um gomo de lona encontra o outro;
 *  - o pé: a SAIA presa no chão, a caixinha do VENTILADOR atrás e as quatro
 *    CORDAS esticadas até as estacas;
 *  - ele BALANÇA devagar no vento, pendendo para os lados a partir do pé
 *    (`update`): o corpo é um grupo com nome (`corpo`), e a `fundir()` junta
 *    tudo dentro dele sem tirar o balanço.
 *
 * Origem no chão, olhando para `+Z`.
 */

/** pinta a geometria toda de uma cor (vira cor por vértice, para juntar numa malha só) */
function pintada(geo: THREE.BufferGeometry, cor: number): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const n of Object.keys(g.attributes)) if (n !== 'position' && n !== 'normal') g.deleteAttribute(n);
  if (!g.getAttribute('normal')) g.computeVertexNormals();
  const c = new THREE.Color(cor);
  const cores = new Float32Array(g.getAttribute('position').count * 3);
  for (let i = 0; i < cores.length; i += 3) cores.set([c.r, c.g, c.b], i);
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return g;
}

/** uma geometria olhando para `n` (o `+Z` dela vira `n`), posta em `p` */
function naNormal(geo: THREE.BufferGeometry, p: THREE.Vector3, n: THREE.Vector3): THREE.BufferGeometry {
  geo.lookAt(n);
  geo.translate(p.x, p.y, p.z);
  return geo;
}

/** um tubo gordo de `a` até `b` com as pontas redondas */
function salsicha(pts: THREE.Vector3[], raio: number): THREE.BufferGeometry[] {
  const curva = new THREE.CatmullRomCurve3(pts);
  return [
    new THREE.TubeGeometry(curva, 16, raio, 12, false),
    new THREE.SphereGeometry(raio, 12, 8).translate(pts[0].x, pts[0].y, pts[0].z),
    new THREE.SphereGeometry(raio * 1.05, 12, 8).translate(pts[pts.length - 1].x, pts[pts.length - 1].y, pts[pts.length - 1].z),
  ];
}

/** o pé de todo inflável: o ventilador atrás e as quatro cordas até as estacas */
function peDeInflavel(g: THREE.Group, raioDoPe: number, alturaDasCordas: number, raioDasCordas: number): void {
  const pecas: THREE.BufferGeometry[] = [];
  // o ventilador: a caixinha com a grade redonda, encostada atrás
  pecas.push(pintada(new THREE.BoxGeometry(0.42, 0.34, 0.3).translate(0, 0.17, -raioDoPe - 0.22), P.ventiladorDeInflavel));
  pecas.push(pintada(new THREE.TorusGeometry(0.12, 0.018, 5, 14).translate(0, 0.18, -raioDoPe - 0.06), P.metalGrey));
  pecas.push(pintada(new THREE.CylinderGeometry(0.09, 0.11, 0.2, 10).rotateX(Math.PI / 2).translate(0, 0.18, -raioDoPe + 0.02), P.ventiladorDeInflavel));
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    const de = new THREE.Vector3(Math.sin(a) * raioDasCordas, alturaDasCordas, Math.cos(a) * raioDasCordas);
    const ate = new THREE.Vector3(Math.sin(a) * (raioDoPe + 1.0), 0.06, Math.cos(a) * (raioDoPe + 1.0));
    const d = ate.clone().sub(de);
    const corda = new THREE.CylinderGeometry(0.012, 0.012, d.length(), 4);
    corda.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
    const meio = de.clone().add(ate).multiplyScalar(0.5);
    pecas.push(pintada(corda.translate(meio.x, meio.y, meio.z), P.cordaDeInflavel));
    // a estaca, com a cabecinha
    pecas.push(pintada(new THREE.CylinderGeometry(0.025, 0.02, 0.18, 5).translate(ate.x, 0.07, ate.z), P.metalGrey));
  }
  const m = new THREE.Mesh(mergeGeometries(pecas), toon(0xffffff, { corPorVertice: true }));
  m.name = 'pe-do-inflavel';
  g.add(m);
}

/** junta as partes do corpo (cor por vértice) e os reflexos numa malha cada, dentro do `corpo` */
function montarCorpo(corpo: THREE.Group, partes: THREE.BufferGeometry[], reflexos: THREE.BufferGeometry[]): void {
  corpo.add(new THREE.Mesh(mergeGeometries(partes), toon(0xffffff, { corPorVertice: true })));
  if (reflexos.length) {
    const brilho = new THREE.Mesh(mergeGeometries(reflexos.map((r) => (r.index ? r.toNonIndexed() : r))), toon(0xffffff, { glow: 0.55 }));
    brilho.userData.semSombra = true;
    corpo.add(brilho);
  }
}

/** o reflexo do vinil: uma manchinha clara achatada na superfície */
function reflexo(p: THREE.Vector3, n: THREE.Vector3, tam: number, esticado = 1.6): THREE.BufferGeometry {
  return naNormal(new THREE.SphereGeometry(tam, 8, 6).scale(esticado, 1, 0.25), p, n);
}

// ============================================================ o fantasma

/**
 * O FANTASMA INFLÁVEL (~3,4 m): a cabeça redonda, o lençol abrindo numa saia
 * de barra ondulada presa no chão, os dois braços para cima (dando tchau), a
 * cara de olhões e a boca de "Buuu" com a linguinha, as bochechas e uma
 * gravatinha laranja.
 */
export function fantasmaInflavel(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'fantasma-inflavel';
  const corpo = new THREE.Group();
  corpo.name = 'corpo';
  g.add(corpo);
  const partes: THREE.BufferGeometry[] = [];
  const reflexos: THREE.BufferGeometry[] = [];

  // o lençol: torneado da cabeça até a saia, com as dobras e a barra
  const VOLTA = 30;
  const LINHAS = 22;
  const pos: number[] = [];
  const idx: number[] = [];
  const TOPO = 3.35;
  for (let j = 0; j <= LINHAS; j++) {
    const s = j / LINHAS;
    for (let i = 0; i <= VOLTA; i++) {
      const t = (i / VOLTA) * Math.PI * 2;
      let r: number;
      let y: number;
      if (s < 0.36) {
        const a = (s / 0.36) * (Math.PI / 2);
        r = 0.78 * Math.sin(a);
        y = TOPO - 0.78 * (1 - Math.cos(a));
      } else {
        const k = (s - 0.36) / 0.64;
        // a barriga estufa um pouco e a saia abre no chão
        r = 0.78 + 0.18 * Math.sin(k * Math.PI) + 0.32 * Math.pow(k, 2.2);
        y = TOPO - 0.78 - (TOPO - 0.78 - 0.04) * k;
        r *= 1 + 0.04 * Math.sin(6 * t + 0.4) * k;
        if (k > 0.86) y += 0.07 * Math.sin(7 * t) * ((k - 0.86) / 0.14);
      }
      pos.push(Math.sin(t) * r, y, Math.cos(t) * r);
    }
  }
  for (let j = 0; j < LINHAS; j++) {
    for (let i = 0; i < VOLTA; i++) {
      const a = j * (VOLTA + 1) + i;
      const b = a + VOLTA + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const lencol = new THREE.BufferGeometry();
  lencol.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  lencol.setIndex(idx);
  const liso = mergeVertices(lencol);
  liso.computeVertexNormals();
  partes.push(pintada(liso, P.fantasmaDePano));
  // a costura em volta do pescoço
  partes.push(pintada(new THREE.TorusGeometry(0.8, 0.02, 5, 32).rotateX(Math.PI / 2).translate(0, TOPO - 0.82, 0), 0xe8e2d6));

  // os braços para cima, dando tchau, com a mão redonda
  for (const s of [-1, 1]) {
    partes.push(...salsicha([
      new THREE.Vector3(s * 0.72, 2.25, 0.05),
      new THREE.Vector3(s * 1.18, 2.55, 0.15),
      new THREE.Vector3(s * 1.32, 3.05, 0.22),
    ], 0.19).map((x) => pintada(x, P.fantasmaDePano)));
    reflexos.push(reflexo(new THREE.Vector3(s * 1.25, 3.2, 0.33), new THREE.Vector3(s * 0.3, 0.8, 0.5), 0.07));
  }
  // a cara: os olhões (preto, com dois brilhos), a boca aberta e a língua
  // o ponto da cara: na cúpula da cabeça, ou (abaixo do meio dela) no lençol,
  // que é mais largo — a boca e a gravata colam nele, não na esfera
  const raioNaAltura = (y: number): number => {
    const meio = TOPO - 0.78;
    if (y >= meio) return Math.sqrt(Math.max(0, 0.78 * 0.78 - (y - meio) ** 2));
    const k = (meio - y) / (meio - 0.04);
    return 0.78 + 0.18 * Math.sin(k * Math.PI) + 0.32 * Math.pow(k, 2.2);
  };
  const cara = (x: number, y: number): { p: THREE.Vector3; n: THREE.Vector3 } => {
    const r = raioNaAltura(y);
    const z = Math.sqrt(Math.max(0.01, r * r - x * x)) + 0.012;
    const acima = y >= TOPO - 0.78 ? (y - (TOPO - 0.78)) / 0.78 : 0.12;
    const n = new THREE.Vector3(x / Math.max(r, 0.1), acima, z / Math.max(r, 0.1)).normalize();
    return { p: new THREE.Vector3(x, y, z), n };
  };
  for (const s of [-1, 1]) {
    const o = cara(s * 0.26, TOPO - 0.62);
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.14, 12, 10).scale(0.8, 1.2, 0.3), o.p, o.n), P.olhoDeBoneco));
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.035, 6, 4).scale(1, 1, 0.3), cara(s * 0.26 - 0.05, TOPO - 0.56).p.addScaledVector(o.n, 0.05), o.n), 0xffffff));
    const b = cara(s * 0.48, TOPO - 0.95);
    partes.push(pintada(naNormal(new THREE.CircleGeometry(0.1, 12).scale(1.4, 0.8, 1), b.p.addScaledVector(b.n, 0.015), b.n), P.bochechaDeBoneco));
  }
  const boca = cara(0, TOPO - 1.02);
  partes.push(pintada(naNormal(new THREE.SphereGeometry(0.15, 12, 10).scale(0.85, 1.05, 0.3), boca.p, boca.n), P.olhoDeBoneco));
  partes.push(pintada(naNormal(new THREE.SphereGeometry(0.08, 10, 8).scale(1, 0.7, 0.3), boca.p.clone().add(new THREE.Vector3(0, -0.07, 0.02)), boca.n), P.linguaInflavel));
  // a gravatinha laranja no pescoço
  const laco = cara(0, TOPO - 1.33);
  for (const s of [-1, 1]) {
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.14, 10, 8).scale(1.2, 0.75, 0.45), laco.p.clone().add(new THREE.Vector3(s * 0.15, 0, 0.08)), laco.n), P.abobora));
  }
  partes.push(pintada(naNormal(new THREE.SphereGeometry(0.065, 8, 6), laco.p.clone().add(new THREE.Vector3(0, 0, 0.12)), laco.n), P.aboboraFunda));
  // o reflexo do vinil na cabeça e na barriga
  reflexos.push(reflexo(new THREE.Vector3(0.28, TOPO - 0.12, 0.42), new THREE.Vector3(0.35, 0.8, 0.5), 0.12));
  reflexos.push(reflexo(new THREE.Vector3(0.62, 1.6, 0.68), new THREE.Vector3(0.7, 0.1, 0.7), 0.1, 2.4));
  montarCorpo(corpo, partes, reflexos);
  peDeInflavel(g, 1.25, 1.7, 0.9);
  return fundir(g);
}

// ============================================================ o gato preto

/**
 * O GATO PRETO INFLÁVEL (~3 m), sentado: a barriga em gota, a cabeça
 * redonda com as orelhas de ponta, os olhões amarelo-verdes de pupila em pé,
 * o focinho rosa, a boquinha em "w", os bigodes, as patinhas da frente, o rabo
 * enrolando do lado e o laço laranja no pescoço. Roxo bem escuro, para o
 * volume aparecer (preto chapado vira um buraco no cenário).
 */
export function gatoInflavel(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'gato-inflavel';
  const corpo = new THREE.Group();
  corpo.name = 'corpo';
  g.add(corpo);
  const partes: THREE.BufferGeometry[] = [];
  const reflexos: THREE.BufferGeometry[] = [];
  const PELO = P.balaoEscuro;

  // a barriga: uma gota sentada (mais larga embaixo)
  const barriga = new THREE.LatheGeometry([
    [0.02, 0.0], [0.75, 0.04], [0.98, 0.35], [1.0, 0.75], [0.88, 1.2], [0.62, 1.62], [0.3, 1.85], [0.02, 1.9],
  ].map(([r, y]) => new THREE.Vector2(r, y)), 28);
  partes.push(pintada(barriga.scale(1, 1, 0.9), PELO));
  // a mancha clara do peito
  partes.push(pintada(naNormal(new THREE.SphereGeometry(0.42, 14, 10).scale(1, 1.3, 0.25), new THREE.Vector3(0, 1.15, 0.78), new THREE.Vector3(0, 0.15, 1)), 0x6b5585));
  // a cabeça
  const C = new THREE.Vector3(0, 2.35, 0.05);
  partes.push(pintada(new THREE.SphereGeometry(0.78, 24, 18).scale(1.08, 0.92, 0.95).translate(C.x, C.y, C.z), PELO));
  // as orelhas: cone de ponta redonda, com o miolo rosa
  for (const s of [-1, 1]) {
    const orelha = new THREE.ConeGeometry(0.3, 0.55, 12).translate(0, 0.27, 0);
    orelha.rotateZ(-s * 0.35);
    partes.push(pintada(orelha.clone().translate(C.x + s * 0.5, C.y + 0.52, C.z - 0.05), PELO));
    const miolo = new THREE.ConeGeometry(0.17, 0.36, 10).translate(0, 0.2, 0);
    miolo.rotateZ(-s * 0.35);
    partes.push(pintada(miolo.translate(C.x + s * 0.5, C.y + 0.56, C.z + 0.08), P.bochechaDeBoneco));
  }
  // os olhos: o amarelo-verde, a pupila em pé e dois brilhos
  for (const s of [-1, 1]) {
    const p = new THREE.Vector3(C.x + s * 0.3, C.y + 0.08, C.z + 0.7);
    const n = new THREE.Vector3(s * 0.35, 0.05, 1).normalize();
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.2, 14, 10).scale(0.9, 1.1, 0.35), p, n), P.olhoDeGato));
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.08, 10, 8).scale(0.6, 1.5, 0.3), p.clone().addScaledVector(n, 0.04), n), P.olhoDeBoneco));
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.035, 6, 4).scale(1, 1, 0.3), p.clone().add(new THREE.Vector3(-0.05, 0.08, 0.07)), n), 0xffffff));
    // os bigodes: três de cada lado, saindo da bochecha
    for (let k = 0; k < 3; k++) {
      const de = new THREE.Vector3(C.x + s * 0.32, C.y - 0.18 + (k - 1) * 0.07, C.z + 0.66);
      const ate = new THREE.Vector3(C.x + s * 1.0, C.y - 0.12 + (k - 1) * 0.16, C.z + 0.62);
      const d = ate.clone().sub(de);
      const fio = new THREE.CylinderGeometry(0.012, 0.012, d.length(), 4);
      fio.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
      const m = de.clone().add(ate).multiplyScalar(0.5);
      partes.push(pintada(fio.translate(m.x, m.y, m.z), 0xf3eefc));
    }
    // a bochecha
    partes.push(pintada(naNormal(new THREE.CircleGeometry(0.09, 12).scale(1.4, 0.8, 1), new THREE.Vector3(C.x + s * 0.5, C.y - 0.2, C.z + 0.62), new THREE.Vector3(s * 0.55, -0.1, 1).normalize()), P.bochechaDeBoneco));
  }
  // o focinho e a boquinha em "w"
  partes.push(pintada(naNormal(new THREE.SphereGeometry(0.075, 10, 8).scale(1.2, 0.8, 0.5), new THREE.Vector3(C.x, C.y - 0.13, C.z + 0.77), new THREE.Vector3(0, 0, 1)), P.bochechaDeBoneco));
  for (const s of [-1, 1]) {
    const arco = new THREE.TorusGeometry(0.07, 0.013, 5, 10, Math.PI);
    arco.rotateZ(Math.PI);
    partes.push(pintada(arco.translate(C.x + s * 0.07, C.y - 0.2, C.z + 0.76), 0xf3eefc));
  }
  // as patinhas da frente e o rabo enrolando do lado
  for (const s of [-1, 1]) {
    partes.push(pintada(new THREE.SphereGeometry(0.26, 14, 10).scale(1, 0.75, 1.3).translate(s * 0.42, 0.18, 0.82), PELO));
  }
  partes.push(...salsicha([
    new THREE.Vector3(-0.7, 0.18, -0.55),
    new THREE.Vector3(-1.25, 0.3, 0.05),
    new THREE.Vector3(-1.3, 0.8, 0.55),
    new THREE.Vector3(-1.0, 1.25, 0.75),
  ], 0.15).map((x) => pintada(x, PELO)));
  // o laço laranja no pescoço
  for (const s of [-1, 1]) {
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.17, 10, 8).scale(1.25, 0.8, 0.45), new THREE.Vector3(s * 0.2, 1.68, 0.62), new THREE.Vector3(0, 0.1, 1)), P.abobora));
  }
  partes.push(pintada(new THREE.SphereGeometry(0.08, 8, 6).translate(0, 1.68, 0.7), P.aboboraFunda));
  partes.push(pintada(new THREE.TorusGeometry(0.58, 0.045, 6, 24).rotateX(Math.PI / 2 - 0.15).translate(0, 1.66, 0.04), P.abobora));
  // os reflexos do vinil
  reflexos.push(reflexo(new THREE.Vector3(0.3, C.y + 0.6, C.z + 0.42), new THREE.Vector3(0.4, 0.75, 0.5), 0.12));
  reflexos.push(reflexo(new THREE.Vector3(0.62, 1.0, 0.62), new THREE.Vector3(0.7, 0.2, 0.7), 0.1, 2.4));
  montarCorpo(corpo, partes, reflexos);
  peDeInflavel(g, 1.0, 1.2, 0.85);
  return fundir(g);
}

// ======================================================= a abóbora gigante

/**
 * A ABÓBORA INFLÁVEL (~3 m com o chapéu): a abóbora esculpida do kit, gorda
 * de 1,15 de raio (a mesma dos gomos e da cara, para ser da família), com o
 * chapéu de bruxa enorme e torto em cima e os reflexos do vinil.
 */
export function aboboraInflavel(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'abobora-inflavel';
  const corpo = new THREE.Group();
  corpo.name = 'corpo';
  g.add(corpo);
  const R = 1.15;
  corpo.add(new LoteDeAboboras().por({ x: 0, z: 0, raio: R, tamanho: 'grande', cara: 'sorriso', cor: P.abobora }).montar());
  const chapeu = chapeuDeBruxa();
  chapeu.scale.setScalar(2.4);
  chapeu.position.set(0.05, R * 1.42, -0.05);
  chapeu.rotation.set(-0.08, 0.4, 0.14);
  corpo.add(chapeu);
  const reflexos = [
    reflexo(new THREE.Vector3(0.38, R * 1.25, 0.55), new THREE.Vector3(0.35, 0.7, 0.6), 0.13),
    reflexo(new THREE.Vector3(0.95, R * 0.82, 0.45), new THREE.Vector3(0.85, 0.2, 0.5), 0.1, 2.2),
  ];
  const brilho = new THREE.Mesh(mergeGeometries(reflexos.map((r) => r.toNonIndexed())), toon(0xffffff, { glow: 0.55 }));
  brilho.userData.semSombra = true;
  corpo.add(brilho);
  peDeInflavel(g, 1.15, 0.9, 1.0);
  return fundir(g);
}

// ============================================================== a aranha

/** um olho de boneco: o branco saltado, a pupila e o brilho, de frente para `n` */
function olhoDeBoneco(partes: THREE.BufferGeometry[], p: THREE.Vector3, n: THREE.Vector3, r: number): void {
  partes.push(pintada(naNormal(new THREE.SphereGeometry(r, 12, 10).scale(1, 1.1, 0.45), p, n), 0xffffff));
  partes.push(pintada(naNormal(new THREE.SphereGeometry(r * 0.55, 10, 8).scale(1, 1.1, 0.4), p.clone().addScaledVector(n, r * 0.25), n), P.olhoDeBoneco));
  partes.push(pintada(naNormal(new THREE.SphereGeometry(r * 0.2, 6, 4).scale(1, 1, 0.4), p.clone().addScaledVector(n, r * 0.42).add(new THREE.Vector3(-r * 0.2, r * 0.25, 0)), n), 0xffffff));
}

/**
 * A ARANHA INFLÁVEL (~2,4 m): o abdômen gordo de listras laranja, a cabeça
 * com dois olhões e dois olhinhos, o sorriso de presinhas, e as oito pernas
 * em arco, gordas, com o pé redondo no chão. Roxa, com um lacinho laranja.
 */
export function aranhaInflavel(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'aranha-inflavel';
  const corpo = new THREE.Group();
  corpo.name = 'corpo';
  g.add(corpo);
  const partes: THREE.BufferGeometry[] = [];
  const reflexos: THREE.BufferGeometry[] = [];
  // o abdômen e as listras
  const ABD = new THREE.Vector3(0, 1.4, -0.45);
  partes.push(pintada(new THREE.SphereGeometry(1.0, 24, 18).scale(1, 0.9, 1.1).translate(ABD.x, ABD.y, ABD.z), P.halloweenRoxo));
  for (const [dz, r] of [[-0.25, 0.93], [0.2, 0.9]] as const) {
    const faixa = new THREE.TorusGeometry(r, 0.06, 6, 30);
    faixa.scale(1, 0.92, 1);
    partes.push(pintada(faixa.translate(ABD.x, ABD.y, ABD.z + dz), P.abobora));
  }
  // a cabeça, à frente
  const C = new THREE.Vector3(0, 1.3, 0.62);
  partes.push(pintada(new THREE.SphereGeometry(0.66, 22, 16).translate(C.x, C.y, C.z), P.halloweenRoxo));
  // os olhos: dois grandes e dois pequenos em cima
  for (const s of [-1, 1]) {
    const n = new THREE.Vector3(s * 0.38, 0.12, 1).normalize();
    olhoDeBoneco(partes, C.clone().addScaledVector(n, 0.64), n, 0.17);
    const n2 = new THREE.Vector3(s * 0.25, 0.55, 0.8).normalize();
    olhoDeBoneco(partes, C.clone().addScaledVector(n2, 0.64), n2, 0.09);
    partes.push(pintada(naNormal(new THREE.CircleGeometry(0.08, 12).scale(1.4, 0.8, 1), C.clone().addScaledVector(new THREE.Vector3(s * 0.62, -0.22, 0.75).normalize(), 0.665), new THREE.Vector3(s * 0.62, -0.22, 0.75).normalize()), P.bochechaDeBoneco));
    // a presinha
    const presa = new THREE.ConeGeometry(0.04, 0.12, 8).rotateX(Math.PI);
    partes.push(pintada(presa.translate(C.x + s * 0.09, C.y - 0.38, C.z + 0.56), 0xffffff));
  }
  // o sorriso
  const sorriso = new THREE.TorusGeometry(0.16, 0.022, 5, 14, Math.PI);
  sorriso.rotateZ(Math.PI);
  partes.push(pintada(sorriso.translate(C.x, C.y - 0.2, C.z + 0.6), P.olhoDeBoneco));
  // o lacinho laranja em cima da cabeça
  for (const s of [-1, 1]) {
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.13, 10, 8).scale(1.25, 0.8, 0.45), new THREE.Vector3(s * 0.14, C.y + 0.63, C.z - 0.05), new THREE.Vector3(0, 0.6, 1).normalize()), P.abobora));
  }
  // as oito pernas: do flanco sobe um joelho e desce até o pé no chão
  for (const s of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const a = -0.75 + k * 0.5;
      const lado = new THREE.Vector3(s * Math.cos(a), 0, Math.sin(a));
      const raiz = new THREE.Vector3(0, 1.25, 0.1).addScaledVector(lado, 0.75);
      const joelho = new THREE.Vector3(0, 2.05 - Math.abs(k - 1.5) * 0.12, 0.1).addScaledVector(lado, 1.55);
      const pe = new THREE.Vector3(0, 0.12, 0.1).addScaledVector(lado, 2.25);
      partes.push(...salsicha([raiz, joelho, pe], 0.11).map((x) => pintada(x, P.halloweenRoxoEscuro)));
      partes.push(pintada(new THREE.SphereGeometry(0.15, 10, 8).scale(1, 0.7, 1).translate(pe.x, 0.1, pe.z), P.abobora));
    }
  }
  reflexos.push(reflexo(new THREE.Vector3(0.35, ABD.y + 0.7, ABD.z + 0.2), new THREE.Vector3(0.4, 0.8, 0.4), 0.14));
  reflexos.push(reflexo(new THREE.Vector3(0.25, C.y + 0.45, C.z + 0.3), new THREE.Vector3(0.35, 0.75, 0.5), 0.09));
  montarCorpo(corpo, partes, reflexos);
  peDeInflavel(g, 0.9, 0.9, 0.7);
  return fundir(g);
}

// ============================================================= o morcego

/**
 * O MORCEGO INFLÁVEL (~3,2 m): o corpo em gota com a barriga clara, a cabeça
 * de orelhonas, os olhões, as duas presinhas e o sorriso, e as ASAS ABERTAS
 * de lona estufada (a silhueta de asa com a barra em meias-luas, extrudada
 * com bisel gordo — é o bisel que faz a asa ler como ar dentro).
 */
export function morcegoInflavel(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'morcego-inflavel';
  const corpo = new THREE.Group();
  corpo.name = 'corpo';
  g.add(corpo);
  const partes: THREE.BufferGeometry[] = [];
  const reflexos: THREE.BufferGeometry[] = [];
  const PELO = P.balaoEscuro;
  // o corpo em gota e a barriga clara
  const barriga = new THREE.LatheGeometry([
    [0.02, 0.0], [0.6, 0.05], [0.8, 0.5], [0.78, 1.1], [0.62, 1.6], [0.35, 1.9], [0.02, 1.98],
  ].map(([r, y]) => new THREE.Vector2(r, y)), 26);
  partes.push(pintada(barriga.scale(1, 1, 0.85), PELO));
  partes.push(pintada(naNormal(new THREE.SphereGeometry(0.42, 14, 10).scale(0.95, 1.35, 0.25), new THREE.Vector3(0, 0.95, 0.6), new THREE.Vector3(0, 0.05, 1)), 0x6b5585));
  // a cabeça e as orelhonas
  const C = new THREE.Vector3(0, 2.4, 0.05);
  partes.push(pintada(new THREE.SphereGeometry(0.66, 22, 16).scale(1.08, 0.95, 0.95).translate(C.x, C.y, C.z), PELO));
  for (const s of [-1, 1]) {
    const orelha = new THREE.ConeGeometry(0.28, 0.7, 12).translate(0, 0.35, 0);
    orelha.rotateZ(-s * 0.3);
    partes.push(pintada(orelha.clone().translate(C.x + s * 0.42, C.y + 0.45, C.z - 0.02), PELO));
    const miolo = new THREE.ConeGeometry(0.15, 0.45, 10).translate(0, 0.25, 0);
    miolo.rotateZ(-s * 0.3);
    partes.push(pintada(miolo.translate(C.x + s * 0.42, C.y + 0.5, C.z + 0.1), P.bochechaDeBoneco));
    const n = new THREE.Vector3(s * 0.35, 0.1, 1).normalize();
    olhoDeBoneco(partes, C.clone().addScaledVector(n, 0.62), n, 0.17);
    partes.push(pintada(naNormal(new THREE.CircleGeometry(0.08, 12).scale(1.4, 0.8, 1), C.clone().addScaledVector(new THREE.Vector3(s * 0.62, -0.25, 0.75).normalize(), 0.65), new THREE.Vector3(s * 0.62, -0.25, 0.75).normalize()), P.bochechaDeBoneco));
    const presa = new THREE.ConeGeometry(0.045, 0.13, 8).rotateX(Math.PI);
    partes.push(pintada(presa.translate(C.x + s * 0.1, C.y - 0.36, C.z + 0.56), 0xffffff));
  }
  const sorriso = new THREE.TorusGeometry(0.17, 0.022, 5, 14, Math.PI);
  sorriso.rotateZ(Math.PI);
  partes.push(pintada(sorriso.translate(C.x, C.y - 0.19, C.z + 0.6), 0xf3eefc));
  // as asas: a silhueta extrudada com bisel gordo
  const asa = new THREE.Shape();
  asa.moveTo(0, 0.35);
  asa.quadraticCurveTo(0.9, 1.05, 2.05, 0.75);
  asa.quadraticCurveTo(1.95, 0.25, 2.0, -0.05);
  asa.quadraticCurveTo(1.7, 0.1, 1.5, -0.2);
  asa.quadraticCurveTo(1.15, 0.0, 0.95, -0.35);
  asa.quadraticCurveTo(0.6, -0.15, 0.35, -0.5);
  asa.quadraticCurveTo(0.15, -0.2, 0, -0.35);
  asa.closePath();
  for (const s of [-1, 1]) {
    const geo = new THREE.ExtrudeGeometry(asa, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.08, bevelSegments: 3, curveSegments: 10 });
    geo.deleteAttribute('uv');
    if (s < 0) {
      geo.scale(-1, 1, 1);
      // espelhada, a face vira do avesso: refaz a ordem dos triângulos
      const idx = geo.index;
      if (idx) for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i + 1); idx.setX(i + 1, idx.getX(i + 2)); idx.setX(i + 2, a); }
      else {
        const pos = geo.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i += 3) {
          for (let c = 0; c < 3; c++) {
            const t = pos.getComponent(i + 1, c);
            pos.setComponent(i + 1, c, pos.getComponent(i + 2, c));
            pos.setComponent(i + 2, c, t);
          }
        }
      }
      geo.computeVertexNormals();
    }
    // inclinada para a frente e para cima, saindo do ombro
    geo.rotateY(s * 0.35);
    geo.rotateZ(s * 0.12);
    geo.translate(s * 0.45, 1.55, -0.1);
    partes.push(pintada(geo, P.halloweenRoxoEscuro));
  }
  // os pezinhos e o lacinho laranja
  for (const s of [-1, 1]) partes.push(pintada(new THREE.SphereGeometry(0.2, 12, 8).scale(1, 0.6, 1.3).translate(s * 0.3, 0.1, 0.55), PELO));
  for (const s of [-1, 1]) {
    partes.push(pintada(naNormal(new THREE.SphereGeometry(0.15, 10, 8).scale(1.25, 0.8, 0.45), new THREE.Vector3(s * 0.17, 1.8, 0.5), new THREE.Vector3(0, 0.15, 1)), P.abobora));
  }
  partes.push(pintada(new THREE.SphereGeometry(0.07, 8, 6).translate(0, 1.8, 0.58), P.aboboraFunda));
  reflexos.push(reflexo(new THREE.Vector3(0.28, C.y + 0.5, C.z + 0.35), new THREE.Vector3(0.35, 0.75, 0.5), 0.11));
  reflexos.push(reflexo(new THREE.Vector3(0.5, 1.1, 0.55), new THREE.Vector3(0.7, 0.2, 0.7), 0.09, 2.2));
  montarCorpo(corpo, partes, reflexos);
  peDeInflavel(g, 0.85, 1.0, 0.7);
  return fundir(g);
}

/**
 * O BALANÇO NO VENTO: o corpo pende a partir do pé, de leve e devagar, cada
 * inflável no seu tempo (a fase vem da posição dele no mundo).
 */
export class InflaveisNoVento {
  private readonly lista: Array<{ corpo: THREE.Object3D; fase: number }> = [];
  private t = 0;

  adicionar(inflavel: THREE.Object3D): void {
    const corpo = inflavel.getObjectByName('corpo');
    if (corpo) this.lista.push({ corpo, fase: inflavel.position.x * 0.37 + inflavel.position.z * 0.21 });
  }

  update(dt: number): void {
    this.t += dt;
    for (const { corpo, fase } of this.lista) {
      const a = this.t * 0.9 + fase;
      corpo.rotation.z = 0.035 * Math.sin(a) + 0.012 * Math.sin(a * 2.3 + 1);
      corpo.rotation.x = 0.025 * Math.sin(a * 0.8 + 2);
      // a lona respira: um tico mais gorda e mais baixa no ritmo do ventilador
      const r = 1 + 0.008 * Math.sin(this.t * 3.1 + fase);
      corpo.scale.set(r, 2 - r, r);
    }
  }
}
