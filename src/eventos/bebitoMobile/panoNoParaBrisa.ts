import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { novaTextura } from '../../world/texturasDeChao';
import { BEBITO_MOBILE } from '../../world/bebitoMobile/BebitoMobile';
import { deformar, secao, topoEm } from '../../world/bebitoMobile/pele';

/**
 * ================================================ O PANO NO PARA-BRISA
 *
 * Pedido do Renan (2026-11-15): "quando a Estella acelera, um dos panos sai
 * voando e cai no nosso para-brisa. Depois ele sai aos pouquinhos."
 *
 * O pano é um filho do Bebito Mobile (anda com ele) e vive quatro momentos:
 *
 *   VOANDO        sai do alto da pilha da lambreta e vem num arco, dando
 *                 cambalhota e ondulando, até o para-brisa;
 *   GRUDADO       assentado no vidro — cada ponto do pano vai para a pele do
 *                 carro pela mesma conta da carroceria (`secao(z)`, os nós da
 *                 fatia de cima, e `deformar`) —, com as pontas tremulando;
 *   ESCORREGANDO  o vento o empurra devagar para cima, pelo vidro e pelo teto,
 *                 e um tico para o lado (é o "aos pouquinhos");
 *   SAINDO        descola na traseira e voa para trás, rodando, até sumir.
 *
 * As posições são no referencial do carro (o `group` do Bebito, sem escala:
 * a carroceria lá dentro cresce `BEBITO_MOBILE.escala`, e a conta da pele é
 * no tamanho de antes dela).
 */

const E = BEBITO_MOBILE.escala;
/** o tamanho do pano (metros de verdade): ele cobre o para-brisa quase inteiro */
const LARGURA = 1.35;
const COMPRIDO = 0.95;
const COLUNAS = 13;
const LINHAS = 10;
const TEMPOS = { voando: 0.95, grudado: 1.5, escorregando: 3.0, saindo: 1.7 } as const;
const V = THREE.Vector3;
const suave = (a: number, b: number, x: number): number => THREE.MathUtils.smoothstep(x, a, b);

/** o perfil do carro de lado (o alto da pele no meio), medido pelo comprimento: para o pano não esticar no vidro em pé */
const PERFIL = (() => {
  const zs: number[] = [], ss: number[] = [];
  let s = 0, antes: THREE.Vector2 | null = null;
  for (let i = 0; i <= 240; i++) {
    const z = 1.85 - (i / 240) * 4.2;
    const p = new THREE.Vector2(z, topoEm(z));
    if (antes) s += p.distanceTo(antes);
    zs.push(z); ss.push(s); antes = p;
  }
  return { zs, ss };
})();
/** o `z` (sem escala) a `s` metros pelo perfil, contando da frente */
function zNoPerfil(s: number): number {
  const { zs, ss } = PERFIL;
  if (s <= 0) return zs[0];
  for (let i = 1; i < ss.length; i++) if (ss[i] >= s) return THREE.MathUtils.lerp(zs[i - 1], zs[i], (s - ss[i - 1]) / (ss[i] - ss[i - 1]));
  return zs[zs.length - 1];
}
/** quanto do perfil fica na frente do pé do para-brisa (é onde a beira da frente do pano pousa) */
const S_DO_PE = (() => { const { zs, ss } = PERFIL; let i = 0; while (zs[i] > 1.45) i++; return ss[i]; })();

/**
 * Um ponto da pele do carro, por cima: `u` de −1 a 1 de lado a lado (em
 * metros pela curva da fatia, a partir do meio) e `s` metros pelo perfil.
 * Devolve o ponto já no referencial do carro, um fio para fora da pele.
 */
function naPele(lado: number, s: number, fora: number, alvo: THREE.Vector3): THREE.Vector3 {
  const z = zNoPerfil(s);
  const sec = secao(z);
  // a curva de cima da fatia, do meio para fora e descendo (os nós 12, 11, … 4)
  let resto = Math.abs(lado);
  let x = 0, y = sec.topo, nx = 0, ny = 1;
  for (let k = 12; k > 4; k--) {
    const [x0, y0] = sec.nos[k], [x1, y1] = sec.nos[k - 1];
    const d = Math.hypot(x1 - x0, y1 - y0);
    const t = Math.min(1, resto / Math.max(1e-6, d));
    x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t;
    nx = -(y1 - y0) / d; ny = (x1 - x0) / d;
    if (ny < 0) { nx = -nx; ny = -ny; }
    if (resto <= d) break;
    resto -= d;
  }
  if (nx < 0) nx = -nx;
  // no teto o pano passa por cima do bagageiro
  const noTeto = suave(0.86, 0.6, z);
  const p = deformar(new V(Math.sign(lado) * x, y, z));
  p.x += Math.sign(lado) * nx * (fora + noTeto * 0.06);
  p.y += ny * (fora + noTeto * 0.09);
  return alvo.copy(p).multiplyScalar(E);
}

/** a estampa do pano: rosa com bolinhas creme e a barra dourada (o lenço da pilha da Estella) */
function estampa(): THREE.Texture {
  return novaTextura('pano-da-estella', 1, (ctx, s) => {
    const tinta = (c: number): string => '#' + c.toString(16).padStart(6, '0');
    ctx.fillStyle = tinta(P.capaceteDaEstella); ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = tinta(P.capaceteDaEstellaFaixa);
    for (let j = 0; j < 9; j++) for (let i = 0; i < 9; i++) {
      ctx.beginPath(); ctx.arc((i + (j % 2) * 0.5 + 0.25) * s / 9, (j + 0.5) * s / 9, s * 0.018, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = tinta(P.lojaGala); ctx.lineWidth = s * 0.05; ctx.strokeRect(s * 0.04, s * 0.04, s * 0.92, s * 0.92);
    ctx.strokeStyle = tinta(P.lojaVeludoBarra); ctx.lineWidth = s * 0.012; ctx.strokeRect(s * 0.085, s * 0.085, s * 0.83, s * 0.83);
  }, 256);
}

type Fase = 'guardado' | 'voando' | 'grudado' | 'escorregando' | 'saindo' | 'foi';

export class PanoNoParaBrisa {
  readonly mesh: THREE.Mesh;
  private readonly geo: THREE.PlaneGeometry;
  private fase: Fase = 'guardado';
  private t = 0;
  private relogio = 0;
  private readonly origem = new V();
  /** quanto ele já escorregou pelo perfil, e para o lado */
  private escorregou = 0;
  private deLado = 0;
  /** onde cada ponto estava quando descolou (para a saída partir dali) */
  private descolado: Float32Array | null = null;
  aoGrudar: (() => void) | null = null;
  aoSair: (() => void) | null = null;

  constructor(carro: THREE.Object3D) {
    this.geo = new THREE.PlaneGeometry(1, 1, COLUNAS - 1, LINHAS - 1);
    this.mesh = new THREE.Mesh(this.geo, toon(P.placaPintada, { mapa: estampa(), doubleSide: true }));
    this.mesh.name = 'pano-no-para-brisa';
    this.mesh.visible = false;
    this.mesh.frustumCulled = false;
    this.mesh.userData.semSombra = true;
    carro.add(this.mesh);
  }

  /** em que momento ele está (o teste lê) */
  get momento(): Fase { return this.fase; }
  get ativo(): boolean { return this.fase !== 'guardado' && this.fase !== 'foi'; }

  /** solta o pano de um ponto do mundo (o alto da pilha) */
  lancar(pontoNoMundo: THREE.Vector3): void {
    if (this.fase !== 'guardado') return;
    this.mesh.parent!.updateMatrixWorld(true);
    this.origem.copy(this.mesh.parent!.worldToLocal(pontoNoMundo.clone()));
    this.fase = 'voando'; this.t = 0;
    this.mesh.visible = true;
  }

  /** o ponto (coluna `i`, linha `j`) do pano assentado no carro */
  private noCarro(i: number, j: number, alvo: THREE.Vector3): THREE.Vector3 {
    const u = (i / (COLUNAS - 1) - 0.5) * LARGURA / E + this.deLado;
    const s = S_DO_PE - 0.06 + (j / (LINHAS - 1)) * COMPRIDO / E + this.escorregou;
    // as pontas tremulam: mais na beira de trás e nas laterais, mais quando o carro anda
    const beira = Math.max(Math.abs(i / (COLUNAS - 1) - 0.5) * 2, j / (LINHAS - 1)) ** 2;
    const vento = (0.012 + beira * 0.05) * (0.6 + 0.4 * Math.sin(this.relogio * 13 + i * 0.9 + j * 1.3));
    // (3 cm para fora do vidro: rente, o penduricalho do retrovisor de dentro furava o pano)
    return naPele(u, s, 0.03 + Math.max(0, vento), alvo);
  }

  /** o ponto do pano aberto no ar (ondulando), em volta do meio dele */
  private noAr(i: number, j: number, alvo: THREE.Vector3): THREE.Vector3 {
    const u = i / (COLUNAS - 1) - 0.5, v = j / (LINHAS - 1) - 0.5;
    const onda = Math.sin(u * 5 + this.relogio * 11) * 0.09 + Math.sin(v * 6 + this.relogio * 8) * 0.07;
    return alvo.set(u * LARGURA, onda, v * COMPRIDO);
  }

  update(dt: number): void {
    if (!this.ativo) return;
    this.relogio += dt;
    this.t += dt;
    const pos = this.geo.attributes.position;
    const a = new V(), b = new V(), centro = new V(), giro = new THREE.Quaternion(), euler = new THREE.Euler();
    const ponto = (i: number, j: number): number => j * COLUNAS + i;

    if (this.fase === 'voando') {
      const k = Math.min(1, this.t / TEMPOS.voando);
      // o arco: do alto da pilha até o meio do para-brisa, passando por cima
      const fim = naPele(0, S_DO_PE - 0.06 + COMPRIDO / E / 2, 0.02, new V());
      const meio = this.origem.clone().lerp(fim, 0.5).add(new V(0, 1.4, 0));
      const q = 1 - k;
      centro.copy(this.origem).multiplyScalar(q * q).addScaledVector(meio, 2 * q * k).addScaledVector(fim, k * k);
      euler.set(this.relogio * 5.1, this.relogio * 2.7, this.relogio * 3.9);
      giro.setFromEuler(euler);
      // perto do fim ele já vai tomando a forma do vidro
      const pousa = suave(0.62, 1, k);
      for (let j = 0; j < LINHAS; j++) for (let i = 0; i < COLUNAS; i++) {
        this.noAr(i, j, a).applyQuaternion(giro).add(centro);
        this.noCarro(i, j, b);
        a.lerp(b, pousa);
        pos.setXYZ(ponto(i, j), a.x, a.y, a.z);
      }
      if (k >= 1) { this.fase = 'grudado'; this.t = 0; this.aoGrudar?.(); }
    } else if (this.fase === 'grudado' || this.fase === 'escorregando') {
      if (this.fase === 'escorregando') {
        const k = Math.min(1, this.t / TEMPOS.escorregando);
        // devagarinho no começo, e o vento ganhando
        this.escorregou = (k * k * 1.9) / E;
        this.deLado = Math.sin(k * 2.2) * 0.12 / E;
      }
      for (let j = 0; j < LINHAS; j++) for (let i = 0; i < COLUNAS; i++) {
        this.noCarro(i, j, a);
        pos.setXYZ(ponto(i, j), a.x, a.y, a.z);
      }
      if (this.fase === 'grudado' && this.t >= TEMPOS.grudado) { this.fase = 'escorregando'; this.t = 0; }
      else if (this.fase === 'escorregando' && this.t >= TEMPOS.escorregando) {
        this.fase = 'saindo'; this.t = 0;
        this.descolado = new Float32Array(pos.array as Float32Array);
        this.aoSair?.();
      }
    } else if (this.fase === 'saindo') {
      const k = Math.min(1, this.t / TEMPOS.saindo);
      // descola da traseira e voa para trás (o carro anda para a frente), subindo e caindo, rodando
      const base = this.descolado!;
      const meio = new V(base[ponto(6, 5) * 3], base[ponto(6, 5) * 3 + 1], base[ponto(6, 5) * 3 + 2]);
      centro.copy(meio).add(new V(0.6 * k, 1.6 * k - 1.9 * k * k, -9 * k * k - 2 * k));
      euler.set(-0.6 - this.relogio * 3.3, this.relogio * 2.1, this.relogio * 1.7);
      giro.setFromEuler(euler);
      const solta = suave(0, 0.35, k);
      for (let j = 0; j < LINHAS; j++) for (let i = 0; i < COLUNAS; i++) {
        const n = ponto(i, j) * 3;
        b.set(base[n], base[n + 1], base[n + 2]).add(new V(0, 0, -2 * k));
        this.noAr(i, j, a).applyQuaternion(giro).add(centro);
        b.lerp(a, solta);
        pos.setXYZ(ponto(i, j), b.x, b.y, b.z);
      }
      // longe e baixo, atrás do carro, ele some
      if (k >= 1) { this.fase = 'foi'; this.mesh.visible = false; }
    }
    pos.needsUpdate = true;
    this.geo.computeVertexNormals();
    this.geo.computeBoundingSphere();
  }
}
