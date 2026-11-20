import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { novaTextura } from '../../world/texturasDeChao';
import { CARRO } from '../../world/bebitoMobile/pele';
import { naPele, sNoPerfil, zNoPerfil } from './panoNoParaBrisa';
import { NO, secao } from '../../world/bebitoMobile/pele';

/**
 * ==================================================== A GEADA NO PARA-BRISA
 *
 * O ar gelado da Kombi do Mano (`world/kombiDoMano.ts`, `docs/KOMBI-DO-MANO.md`):
 * quando ela passa do lado do Bebito, sai um sopro de FLOCOS DE NEVE da grade
 * do freezer, que vai em redemoinho até o para-brisa; o vidro EMBAÇA (uma
 * camada de geada assentada na curva do vidro, pela mesma conta do pano da
 * Estella, `naPele`), fica um pouco, e DESEMBAÇA aos poucos, primeiro no meio
 * e por último nas beiradas, que é como vidro embaçado limpa.
 *
 * A geada é filha do Bebito Mobile (anda com ele); os flocos são do mundo (eles
 * saem da Kombi, que anda separada).
 */

const COLUNAS = 14;
const LINHAS = 9;
const N_FLOCOS = 46;
const TEMPOS = { soprando: 1.1, embacado: 2.2, desembacando: 2.8 } as const;
const V = THREE.Vector3;
const suave = (a: number, b: number, x: number): number => THREE.MathUtils.smoothstep(x, a, b);

/** o vidro da frente, no perfil: do pé do para-brisa até a testeira (sem escala) */
const S0 = sNoPerfil(CARRO.zCowl - CARRO.peDoParaBrisa) + 0.01;
const S1 = sNoPerfil(CARRO.zTeto + CARRO.testeira) - 0.02;

/** a meia largura do VIDRO nesta altura do perfil: o arco do meio do teto (nó 12) até a coluna (nó 7) */
function meiaLarguraDoVidro(s: number): number {
  const { nos } = secao(zNoPerfil(s));
  let l = 0;
  for (let k = NO.meio; k > NO.paraBrisa; k--) l += Math.hypot(nos[k][0] - nos[k - 1][0], nos[k][1] - nos[k - 1][1]);
  return l - 0.02;
}

/**
 * A GEADA: um canvas transparente com os cristais em samambaia saindo das
 * beiradas (é da beira que o vidro embaça), o miolo mais ralo e os
 * pontinhos de gelo. O ALFA de cada pixel já diz o quanto ali está embaçado;
 * a opacidade do material sobe e desce por cima.
 */
function geada(): THREE.Texture {
  const tex = novaTextura('geada-do-para-brisa', 1, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    // o véu: mais forte nas beiradas, ralo no meio
    const veu = ctx.createRadialGradient(s / 2, s / 2, s * 0.12, s / 2, s / 2, s * 0.72);
    veu.addColorStop(0, 'rgba(240,248,255,0.42)');
    veu.addColorStop(0.7, 'rgba(240,248,255,0.78)');
    veu.addColorStop(1, 'rgba(240,248,255,0.95)');
    ctx.fillStyle = veu; ctx.fillRect(0, 0, s, s);
    // os cristais de samambaia, das beiradas para dentro
    let sorte = 3;
    const rnd = (): number => { sorte = (sorte * 16807) % 2147483647; return (sorte - 1) / 2147483646; };
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineCap = 'round';
    const galho = (x: number, y: number, a: number, l: number, g: number): void => {
      if (l < 4 || g > 3) return;
      const x1 = x + Math.cos(a) * l, y1 = y + Math.sin(a) * l;
      ctx.lineWidth = Math.max(0.8, 2.6 - g * 0.7);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x1, y1); ctx.stroke();
      for (let k = 1; k <= 3; k++) {
        const t = k / 4, bx = x + (x1 - x) * t, by = y + (y1 - y) * t;
        galho(bx, by, a + 0.7, l * 0.38, g + 1);
        galho(bx, by, a - 0.7, l * 0.38, g + 1);
      }
    };
    for (let i = 0; i < 22; i++) {
      const lado = i % 4, t = rnd();
      const [x, y, a] = lado === 0 ? [t * s, 0, Math.PI / 2] : lado === 1 ? [t * s, s, -Math.PI / 2] : lado === 2 ? [0, t * s, 0] : [s, t * s, Math.PI];
      galho(x, y, a + (rnd() - 0.5) * 0.8, s * (0.18 + rnd() * 0.16), 0);
    }
    // os pontinhos de gelo
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 160; i++) { ctx.beginPath(); ctx.arc(rnd() * s, rnd() * s, 0.6 + rnd() * 1.4, 0, Math.PI * 2); ctx.fill(); }
  }, 256);
  return tex;
}

/** um floco de neve: três tirinhas cruzadas (seis pontas), achatado */
function geoFloco(): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 3; k++) partes.push(new THREE.BoxGeometry(0.012, 0.11, 0.008).rotateZ((k * Math.PI) / 3));
  const pos: number[] = [];
  for (const p of partes) {
    const g = p.toNonIndexed();
    pos.push(...(g.attributes.position.array as Float32Array));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

type Fase = 'guardada' | 'soprando' | 'embacado' | 'desembacando' | 'foi';

export class GeadaNoParaBrisa {
  readonly mesh: THREE.Mesh;
  readonly flocos: THREE.InstancedMesh;
  private readonly material: THREE.MeshToonMaterial;
  private fase: Fase = 'guardada';
  private t = 0;
  private relogio = 0;
  private de: () => THREE.Vector3 = () => new V();
  private readonly nascimento = new Float32Array(N_FLOCOS).fill(-1);
  private readonly saida: THREE.Vector3[] = Array.from({ length: N_FLOCOS }, () => new V());
  aoEmbacar: (() => void) | null = null;

  constructor(private readonly carro: THREE.Object3D, mundo: THREE.Object3D) {
    // a camada de geada, assentada no vidro (um fio para fora dele)
    const geo = new THREE.PlaneGeometry(1, 1, COLUNAS - 1, LINHAS - 1);
    const pos = geo.attributes.position;
    const p = new V();
    for (let j = 0; j < LINHAS; j++) for (let i = 0; i < COLUNAS; i++) {
      // de coluna a coluna: o vidro inteiro embaça, sem sobrar beirada limpa
      const s = S0 + (j / (LINHAS - 1)) * (S1 - S0);
      const u = (i / (COLUNAS - 1) - 0.5) * 2 * meiaLarguraDoVidro(s);
      naPele(u, s, 0.012, p);
      pos.setXYZ(j * COLUNAS + i, p.x, p.y, p.z);
    }
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    // (um material só desta geada: a opacidade dele sobe e desce, e ninguém mais o usa)
    this.material = toon(P.geadaDoParaBrisa, { mapa: geada(), opacity: 0.999, doubleSide: true }) as THREE.MeshToonMaterial;
    this.material.depthWrite = false;
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.name = 'geada-no-para-brisa';
    this.mesh.visible = false;
    this.mesh.renderOrder = 6;
    this.mesh.userData.semSombra = true;
    carro.add(this.mesh);
    // os flocos do sopro (do mundo: eles saem da Kombi e chegam no Bebito)
    this.flocos = new THREE.InstancedMesh(geoFloco(), toon(P.neveFofa, { glow: 0.5 }), N_FLOCOS);
    this.flocos.name = 'flocos-do-freezer';
    this.flocos.frustumCulled = false;
    this.flocos.userData.semSombra = true;
    this.flocos.visible = false;
    mundo.add(this.flocos);
  }

  get momento(): Fase { return this.fase; }

  /** o sopro: os flocos saem do ponto que `de` disser (a grade do freezer, que anda) */
  soprar(de: () => THREE.Vector3): void {
    if (this.fase !== 'guardada') return;
    this.de = de;
    this.fase = 'soprando'; this.t = 0;
    this.mesh.visible = true;
    this.flocos.visible = true;
    this.material.opacity = 0;
  }

  update(dt: number): void {
    if (this.fase === 'guardada' || this.fase === 'foi') return;
    this.t += dt; this.relogio += dt;

    // ----- os flocos: nascem na grade durante o sopro e voam em redemoinho até o vidro
    const alvo = this.carro.localToWorld(naPele(0, (S0 + S1) / 2, 0.05, new V()));
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new V();
    let vivos = 0;
    for (let i = 0; i < N_FLOCOS; i++) {
      const quando = (i / N_FLOCOS) * (TEMPOS.soprando * 0.8);
      if (this.fase === 'soprando' && this.nascimento[i] < 0 && this.t >= quando) {
        this.nascimento[i] = this.relogio;
        this.saida[i].copy(this.de()).add(new V(Math.sin(i * 1.7) * 0.15, Math.cos(i * 2.3) * 0.12, Math.sin(i * 3.1) * 0.15));
      }
      const idade = this.nascimento[i] < 0 ? -1 : (this.relogio - this.nascimento[i]) / 0.75;
      if (idade < 0 || idade > 1) { m.makeScale(0, 0, 0); this.flocos.setMatrixAt(i, m); continue; }
      vivos++;
      // o caminho: da grade até o vidro, subindo num arco, com um redemoinho em volta
      p.copy(this.saida[i]).lerp(alvo, idade);
      p.y += Math.sin(idade * Math.PI) * 0.5;
      const giro = idade * 7 + i;
      p.x += Math.cos(giro) * 0.18 * (1 - idade); p.z += Math.sin(giro) * 0.18 * (1 - idade);
      e.set(this.relogio * 4 + i, this.relogio * 3 + i * 0.5, i);
      q.setFromEuler(e);
      const tam = (0.7 + (i % 5) * 0.12) * Math.sin(Math.min(1, idade * 1.3) * Math.PI) * 1.4;
      m.compose(p, q, new V(tam, tam, tam));
      this.flocos.setMatrixAt(i, m);
    }
    this.flocos.instanceMatrix.needsUpdate = true;

    // ----- a geada: embaça quando os flocos chegam, fica, e desembaça aos poucos
    if (this.fase === 'soprando') {
      this.material.opacity = 0.92 * suave(0.35, TEMPOS.soprando, this.t);
      if (this.t >= TEMPOS.soprando) { this.fase = 'embacado'; this.t = 0; this.aoEmbacar?.(); }
    } else if (this.fase === 'embacado') {
      this.material.opacity = 0.92 + Math.sin(this.relogio * 3) * 0.03;
      if (this.t >= TEMPOS.embacado) { this.fase = 'desembacando'; this.t = 0; }
    } else if (this.fase === 'desembacando') {
      this.material.opacity = 0.92 * (1 - suave(0, TEMPOS.desembacando, this.t));
      if (this.t >= TEMPOS.desembacando && vivos === 0) {
        this.fase = 'foi';
        this.mesh.visible = false; this.flocos.visible = false;
      }
    }
  }
}
