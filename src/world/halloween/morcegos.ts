import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';

/*
 * OS MORCEGOS VOANDO EM BANDO em volta da roda gigante, na noite da festa
 * (`docs/HALLOWEEN.md`, §2.4.1, A). Fofos, nunca de susto: o corpinho
 * redondo, as orelhas pontudas e a asa de morcego de desenho, com a borda de
 * baixo recortada em três ondas.
 *
 * TUDO EM DOIS LOTES: os corpos (um `InstancedMesh`) e as asas (outro, com
 * DUAS cópias por morcego — a da esquerda é a da direita espelhada pela
 * matriz, e o material é de dois lados para o espelho não sumir). A cada
 * quadro a classe refaz as matrizes: cada um voa num anel em volta do eixo,
 * na altura e na velocidade dele, subindo e descendo, e a asa bate girando
 * na raiz (no ombro do morcego).
 */

/** a asa da DIREITA, deitada (no plano XZ), com a raiz no ombro e a ponta em `+X` */
function geoAsa(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, 0.03);
  // a borda de cima: o "braço" que sobe até o dedo da ponta
  s.quadraticCurveTo(0.12, 0.11, 0.27, 0.06);
  // a borda de baixo recortada em três ondas (os dedos da asa)
  s.quadraticCurveTo(0.22, 0.0, 0.2, -0.05);
  s.quadraticCurveTo(0.15, -0.02, 0.12, -0.07);
  s.quadraticCurveTo(0.07, -0.04, 0.03, -0.06);
  s.quadraticCurveTo(0.01, -0.02, 0, -0.03);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.008, bevelEnabled: false, curveSegments: 5 });
  // de pé (XY) para deitada: o "para cima" da forma vira o `-Z` (a frente do voo)
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0.004, 0);
  return geo;
}

/** o corpinho redondo com a cabeça, as orelhas e os pezinhos; a frente é `-Z` */
function geoCorpo(): THREE.BufferGeometry {
  const corpo = new THREE.SphereGeometry(0.06, 10, 8);
  corpo.scale(0.85, 0.8, 1.15);
  const cabeca = new THREE.SphereGeometry(0.045, 10, 8).translate(0, 0.02, -0.07);
  const orelha = (lado: -1 | 1) => new THREE.ConeGeometry(0.018, 0.05, 5).translate(lado * 0.022, 0.07, -0.075);
  const pe = (lado: -1 | 1) => new THREE.SphereGeometry(0.012, 6, 4).translate(lado * 0.02, -0.04, 0.06);
  const partes = [corpo, cabeca, orelha(-1), orelha(1), pe(-1), pe(1)].map((g) => (g.index ? g.toNonIndexed() : g));
  for (const g of partes) {
    for (const n of Object.keys(g.attributes)) if (n !== 'position' && n !== 'normal') g.deleteAttribute(n);
  }
  return mergeGeometries(partes);
}

interface Voo {
  raio: number;
  altura: number;
  fase: number;
  /** rad/s (negativo é o outro sentido) */
  velocidade: number;
  /** o sobe-e-desce */
  onda: number;
  bate: number;
  escala: number;
}

export class BandoDeMorcegos {
  readonly group = new THREE.Group();
  private readonly corpos: THREE.InstancedMesh;
  private readonly asas: THREE.InstancedMesh;
  private readonly voos: Voo[] = [];
  private tempo = 0;
  private readonly m = new THREE.Matrix4();
  private readonly mAsa = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly ombro = new THREE.Matrix4();
  private readonly espelho = new THREE.Matrix4().makeScale(-1, 1, 1);

  /**
   * `quantos` morcegos em volta de um eixo em pé na origem do grupo, entre os
   * raios e as alturas pedidos. A semente deixa o bando igual em toda foto.
   */
  constructor(quantos = 16, opts: { raio?: [number, number]; altura?: [number, number]; semente?: number } = {}) {
    this.group.name = 'morcegos-voando';
    this.group.userData.peca = 'morcegos-voando';
    let s = (opts.semente ?? 1031) >>> 0;
    const rnd = (): number => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    const [r0, r1] = opts.raio ?? [6, 12];
    const [h0, h1] = opts.altura ?? [9, 18];
    for (let i = 0; i < quantos; i++) {
      this.voos.push({
        raio: r0 + (r1 - r0) * rnd(),
        altura: h0 + (h1 - h0) * rnd(),
        fase: rnd() * Math.PI * 2,
        // a maioria num sentido, uns poucos no contrário: bando, e não roda
        velocidade: (0.35 + 0.3 * rnd()) * (i % 5 === 0 ? -1 : 1),
        onda: 0.4 + 0.8 * rnd(),
        bate: 9 + 4 * rnd(),
        escala: 2.6 + 1.0 * rnd(),
      });
    }
    this.corpos = new THREE.InstancedMesh(geoCorpo(), toon(P.morcegoVoando), quantos);
    this.corpos.name = 'corpos-dos-morcegos';
    this.asas = new THREE.InstancedMesh(geoAsa(), toon(P.morcegoAsa, { doubleSide: true }), quantos * 2);
    this.asas.name = 'asas-dos-morcegos';
    for (const im of [this.corpos, this.asas]) {
      // eles voam: a esfera envolvente de uma pose não vale para a outra
      im.frustumCulled = false;
      im.userData.semSombra = true;
      this.group.add(im);
    }
    this.update(0);
  }

  update(dt: number): void {
    this.tempo += dt;
    const t = this.tempo;
    this.voos.forEach((v, i) => {
      const a = v.fase + t * v.velocidade;
      const y = v.altura + Math.sin(t * v.onda + v.fase) * 0.9;
      this.p.set(Math.cos(a) * v.raio, y, Math.sin(a) * v.raio);
      // a frente do morcego (`-Z`) aponta a tangente do anel
      const rumo = v.velocidade > 0 ? -a : -a + Math.PI;
      const sobe = Math.cos(t * v.onda + v.fase) * 0.25;
      this.e.set(sobe, rumo, Math.sin(a * 2) * 0.15, 'YXZ');
      this.q.setFromEuler(this.e);
      this.m.compose(this.p, this.q, this.s.setScalar(v.escala));
      this.corpos.setMatrixAt(i, this.m);
      // a asa bate na raiz (o ombro): para baixo rápido, para cima mais devagar
      const fase = Math.sin(t * v.bate + v.fase);
      const bate = 0.15 + 0.75 * fase;
      for (const lado of [1, -1] as const) {
        this.mAsa.makeRotationZ(lado * bate);
        this.mAsa.premultiply(this.ombro.makeTranslation(lado * 0.035, 0.015, 0));
        if (lado === -1) this.mAsa.multiply(this.espelho);
        this.asas.setMatrixAt(i * 2 + (lado === 1 ? 0 : 1), this.mAsa.premultiply(this.m));
      }
    });
    this.corpos.instanceMatrix.needsUpdate = true;
    this.asas.instanceMatrix.needsUpdate = true;
  }
}
