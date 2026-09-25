import * as THREE from 'three';
import { translucido } from './materials';

/**
 * A OCLUSÃO — o que fica entre a câmera e quem importa fica translúcido.
 *
 * Pedido do Renan, jogando a rodada do jardim: a gota caía atrás de uma árvore
 * ou da parede dos portões e sumia. A câmera isométrica olha de cima e de
 * lado, então tudo o que é ALTO tapa o que está logo atrás dele.
 *
 * COMO: quem liga (a rodada, via `g.vigiarOclusao`) diz quais pontos importam
 * — os bichos e as gotas; a dupla entra sempre. A cada décimo de segundo, de
 * cada ponto sai um raio NA DIREÇÃO DA CÂMERA (ela é ortográfica: todos os
 * raios são paralelos). Toda malha alta cuja caixa o raio atravessa está na
 * frente do ponto — e ganha a variante translúcida do material dela. Quando
 * sai da frente, volta ao original.
 *
 * SÓ MALHA ALTA (o topo acima de `ALTURA_MINIMA`): chão, decalque e canteiro
 * baixo não tapam ninguém de verdade, e piscar o chão seria pior que o
 * problema. Caixa e não triângulo: é uma aproximação, mas é barata — a estufa
 * tem centenas de malhas e a rodada, dezenas de bichos.
 */

/** o topo que uma malha precisa ter para poder tapar alguém */
const ALTURA_MINIMA = 0.9;
/** de quanto em quanto tempo o raio é refeito */
const INTERVALO = 0.1;
/** a lista de candidatas é refeita de tempos em tempos (peças que as cartas põem) */
const RECONTAR = 3;

type Ponto = { x: number; y: number; z: number };

/** o que quem liga a oclusão entrega: os pontos que importam, e o que nunca esmaece (eles mesmos) */
export interface VigiaDaOclusao {
  pontos: () => readonly Ponto[];
  ignorar: () => readonly THREE.Object3D[];
}

interface Candidata {
  malha: THREE.Mesh;
  caixa: THREE.Box3;
}

export class Oclusao {
  private alvos: VigiaDaOclusao | null = null;
  private candidatas: Candidata[] = [];
  /** as malhas esmaecidas agora, com o material original de cada uma */
  private readonly esmaecidas = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  private relogio = 0;
  private recontar = 0;
  private readonly raio = new THREE.Ray();
  private readonly paraCamera = new THREE.Vector3();
  private readonly pedaco = new THREE.Vector3();

  /** quantas malhas estão translúcidas agora — o teste lê daqui */
  get quantas(): number {
    return this.esmaecidas.size;
  }

  /** o teste confere se uma peça (pelo `userData.peca`) está esmaecida */
  esmaecida(peca: string): boolean {
    for (const m of this.esmaecidas.keys()) {
      let o: THREE.Object3D | null = m;
      while (o) {
        if (o.userData?.peca === peca) return true;
        o = o.parent;
      }
    }
    return false;
  }

  vigiar(alvos: VigiaDaOclusao | null): void {
    this.alvos = alvos;
    this.candidatas = [];
    this.recontar = 0;
    if (!alvos) this.devolverTudo();
  }

  /**
   * @param raiz o mundo da cena
   * @param ignorar objetos que nunca tapam (a dupla, que já é alvo)
   * @param sempre pontos que entram sempre (a dupla)
   */
  update(dt: number, camera: THREE.Camera, raiz: THREE.Object3D, ignorar: readonly THREE.Object3D[], sempre: readonly Ponto[]): void {
    if (!this.alvos) return;
    this.relogio -= dt;
    this.recontar -= dt;
    if (this.relogio > 0) return;
    this.relogio = INTERVALO;
    if (this.recontar <= 0 || this.candidatas.length === 0) {
      this.recontar = RECONTAR;
      this.juntarCandidatas(raiz, [...ignorar, ...this.alvos.ignorar()]);
    }

    camera.getWorldDirection(this.paraCamera).negate();
    const tapam = new Set<THREE.Mesh>();
    for (const p of [...sempre, ...this.alvos.pontos()]) {
      // um tiquinho acima do ponto, e na direção da câmera
      this.raio.origin.set(p.x, p.y + 0.05, p.z);
      this.raio.direction.copy(this.paraCamera);
      for (const c of this.candidatas) {
        if (tapam.has(c.malha)) continue;
        // a caixa só tapa se o raio passa por ela ACIMA do chão do ponto
        if (this.raio.intersectBox(c.caixa, this.pedaco) && this.pedaco.y > p.y - 0.05) tapam.add(c.malha);
      }
    }
    // quem saiu da frente volta; quem entrou esmaece
    for (const [m, original] of this.esmaecidas) {
      if (!tapam.has(m)) {
        m.material = original;
        this.esmaecidas.delete(m);
      }
    }
    for (const m of tapam) {
      if (this.esmaecidas.has(m)) continue;
      this.esmaecidas.set(m, m.material);
      m.material = Array.isArray(m.material) ? m.material.map((x) => translucido(x)) : translucido(m.material);
    }
  }

  /** a troca de cena apaga tudo: as malhas esmaecidas não existem mais */
  esquecer(): void {
    this.esmaecidas.clear();
    this.candidatas = [];
    this.alvos = null;
  }

  private devolverTudo(): void {
    for (const [m, original] of this.esmaecidas) m.material = original;
    this.esmaecidas.clear();
  }

  private juntarCandidatas(raiz: THREE.Object3D, ignorar: readonly THREE.Object3D[]): void {
    const fora = new Set(ignorar);
    this.candidatas = [];
    raiz.updateMatrixWorld();
    const visitar = (o: THREE.Object3D): void => {
      if (fora.has(o) || !o.visible) return;
      if (o instanceof THREE.Mesh && !(o instanceof THREE.InstancedMesh)) {
        const mat = Array.isArray(o.material) ? o.material[0] : o.material;
        // o que já é transparente (água, vidro, decalque) fica como está
        if (mat && !mat.transparent) {
          const caixa = new THREE.Box3().setFromObject(o);
          if (caixa.max.y >= ALTURA_MINIMA && !caixa.isEmpty()) this.candidatas.push({ malha: o, caixa });
        }
      }
      for (const f of o.children) visitar(f);
    };
    visitar(raiz);
  }
}
