import * as THREE from 'three';
import { toon } from '../core/materials';

/**
 * PARTÍCULAS — gotas, vapor, bolhas e faíscas, todas numa malha só.
 *
 * O jato do regador solta dezenas de gotas por segundo, e numa onda cheia são
 * vários jatos ao mesmo tempo. Uma malha por gota (o jeito de `espirrar()` no
 * clube e da rega da estufa) seria centenas de objetos criados e jogados fora
 * por segundo — no celular isso engasga. Aqui é um `InstancedMesh` só por
 * pool: uma chamada de desenho para todas as gotas, e nada é criado depois do
 * construtor.
 *
 * ===================================================== O QUE CADA GOTA SABE
 *
 * Posição, velocidade, gravidade, arrasto, vida, tamanho e COR (a cor é por
 * instância: o arco-íris é um jato com cada gota de uma cor). A gota se ESTICA
 * na direção em que voa (`esticar`), e é isso que faz o jato parecer água
 * correndo em vez de uma chuva de bolinhas — a diferença de uma linha.
 *
 * ELA NÃO DESBOTA, ELA ENCOLHE. Opacidade é do material, e o material é um só
 * para o pool inteiro (e vem do cache de `toon()`): mudar a opacidade de uma
 * gota mudaria todas. Encolher no fim da vida lê igual — gota evaporando — e
 * não custa nada.
 */

export interface Emissao {
  x: number; y: number; z: number;
  vx?: number; vy?: number; vz?: number;
  /** segundos */
  vida: number;
  /** raio, em metros */
  tamanho: number;
  cor: number;
  /** aceleração para baixo; negativa sobe (vapor, bolha) */
  gravidade?: number;
  /** 0 = nada segura; 2 = para rápido (vapor) */
  arrasto?: number;
  /** estica na direção do voo: 0 = bolinha, 0,08 = fio d'água */
  esticar?: number;
  /** o que acontece no chão: some (padrão), quica ou para e fica */
  chao?: 'some' | 'quica' | 'fica';
  /** cresce em vez de encolher (vapor subindo, bolha inchando) */
  cresce?: number;
  /** chamado uma vez quando a gota bate no chão */
  aoTocarOChao?: (x: number, z: number) => void;
  /** a gota balança de lado enquanto sobe (bolha, vapor) */
  balanco?: number;
  /**
   * Segundos que a gota JÁ voou quando nasce. Um jato emite várias gotas no
   * mesmo quadro; sem isto elas nasceriam juntas no bico e voariam grudadas
   * em tufos — e é o que acontecia com o jogo a poucos quadros por segundo.
   * Cada uma nasce adiantada pela fração do quadro que lhe cabe, e o fio sai
   * contínuo a qualquer taxa de quadros.
   */
  adiantar?: number;
}

interface Gota extends Required<Omit<Emissao, 'aoTocarOChao' | 'adiantar'>> {
  idade: number;
  viva: boolean;
  fase: number;
  aoTocarOChao: ((x: number, z: number) => void) | null;
}

const EIXO_Z = new THREE.Vector3(0, 0, 1);

export class Particulas {
  readonly malha: THREE.InstancedMesh;
  private readonly gotas: Gota[] = [];
  private proxima = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly s = new THREE.Vector3();
  private readonly p = new THREE.Vector3();
  private readonly v = new THREE.Vector3();
  private readonly c = new THREE.Color();
  private readonly zero = new THREE.Matrix4().makeScale(0, 0, 0);

  /**
   * @param maximo quantas gotas cabem vivas ao mesmo tempo; a mais velha é
   *   reaproveitada quando lota (nunca trava, nunca cria malha nova)
   * @param brilho quanto a gota acende sozinha (0 a 1): água tem um pouco,
   *   faísca de arco-íris tem muito
   * @param opacidade 1 = opaca; vapor e bolha usam um pool translúcido à parte
   */
  constructor(maximo = 700, brilho = 0.25, opacidade = 1, detalhe = 6) {
    const geo = new THREE.SphereGeometry(1, detalhe, Math.max(4, detalhe - 1));
    // o branco multiplica a cor de cada instância
    this.malha = new THREE.InstancedMesh(geo, toon(0xffffff, { glow: brilho, opacity: opacidade }), maximo);
    this.malha.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.malha.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(maximo * 3), 3);
    this.malha.frustumCulled = false;
    this.malha.renderOrder = opacidade < 1 ? 5 : 0;
    for (let i = 0; i < maximo; i++) {
      this.malha.setMatrixAt(i, this.zero);
      this.gotas.push({
        x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, vida: 0, tamanho: 0, cor: 0,
        gravidade: 0, arrasto: 0, esticar: 0, chao: 'some', cresce: 0, balanco: 0,
        idade: 0, viva: false, fase: 0, aoTocarOChao: null,
      });
    }
    this.malha.count = maximo;
  }

  /** quantas estão no ar agora (o teste usa para medir o jato) */
  get vivas(): number {
    let n = 0;
    for (const g of this.gotas) if (g.viva) n++;
    return n;
  }

  emitir(e: Emissao): void {
    const i = this.proxima;
    this.proxima = (this.proxima + 1) % this.gotas.length;
    const g = this.gotas[i];
    g.x = e.x; g.y = e.y; g.z = e.z;
    g.vx = e.vx ?? 0; g.vy = e.vy ?? 0; g.vz = e.vz ?? 0;
    g.vida = e.vida;
    g.tamanho = e.tamanho;
    g.cor = e.cor;
    g.gravidade = e.gravidade ?? 9;
    g.arrasto = e.arrasto ?? 0;
    g.esticar = e.esticar ?? 0;
    g.chao = e.chao ?? 'some';
    g.cresce = e.cresce ?? 0;
    g.balanco = e.balanco ?? 0;
    g.aoTocarOChao = e.aoTocarOChao ?? null;
    g.idade = 0;
    g.viva = true;
    g.fase = Math.random() * 6.28;
    const t = e.adiantar ?? 0;
    if (t > 0) {
      g.x += g.vx * t;
      g.z += g.vz * t;
      g.y += g.vy * t - 0.5 * g.gravidade * t * t;
      g.vy -= g.gravidade * t;
      g.idade = t;
    }
    this.c.setHex(e.cor);
    this.malha.setColorAt(i, this.c);
    if (this.malha.instanceColor) this.malha.instanceColor.needsUpdate = true;
  }

  update(dt: number): void {
    for (let i = 0; i < this.gotas.length; i++) {
      const g = this.gotas[i];
      if (!g.viva) continue;
      g.idade += dt;
      if (g.idade >= g.vida) {
        g.viva = false;
        this.malha.setMatrixAt(i, this.zero);
        continue;
      }
      if (g.chao !== 'fica' || g.y > 0.02) {
        g.vy -= g.gravidade * dt;
        const freio = Math.max(0, 1 - g.arrasto * dt);
        g.vx *= freio; g.vz *= freio;
        // o que SOBE (vapor, bolha) também freia na vertical: senão dispara
        if (g.gravidade < 0) g.vy *= freio;
        g.x += g.vx * dt + (g.balanco ? Math.sin(g.idade * 7 + g.fase) * g.balanco * dt : 0);
        g.y += g.vy * dt;
        g.z += g.vz * dt;
      }
      if (g.y <= 0.02 && g.vy < 0) {
        if (g.aoTocarOChao) {
          g.aoTocarOChao(g.x, g.z);
          g.aoTocarOChao = null;
        }
        if (g.chao === 'some') {
          g.viva = false;
          this.malha.setMatrixAt(i, this.zero);
          continue;
        }
        if (g.chao === 'quica') {
          g.y = 0.02;
          g.vy = -g.vy * 0.35;
          g.vx *= 0.5; g.vz *= 0.5;
        } else {
          g.y = 0.02;
          g.vx = 0; g.vy = 0; g.vz = 0;
        }
      }

      // encolhe no último terço da vida (ou cresce, se for vapor)
      const t = g.idade / g.vida;
      const fim = t > 0.66 ? 1 - (t - 0.66) / 0.34 : 1;
      const r = g.tamanho * (g.cresce ? 1 + g.cresce * t : fim) * (g.cresce ? Math.min(1, fim * 2) : 1);
      this.p.set(g.x, g.y, g.z);
      this.v.set(g.vx, g.vy, g.vz);
      const vel = this.v.length();
      if (g.esticar > 0 && vel > 0.5) {
        this.q.setFromUnitVectors(EIXO_Z, this.v.divideScalar(vel));
        this.s.set(r, r, r * (1 + vel * g.esticar * 10));
      } else {
        this.q.identity();
        this.s.set(r, r, r);
      }
      this.m.compose(this.p, this.q, this.s);
      this.malha.setMatrixAt(i, this.m);
    }
    this.malha.instanceMatrix.needsUpdate = true;
  }

  limpar(): void {
    for (let i = 0; i < this.gotas.length; i++) {
      this.gotas[i].viva = false;
      this.malha.setMatrixAt(i, this.zero);
    }
    this.malha.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.malha.geometry.dispose();
    this.malha.dispose();
  }
}

/**
 * MARCAS NO CHÃO — anel de respingo, poça, rastro de garoa, rachadura.
 *
 * O mesmo truque do pool de gotas, deitado no chão: uma malha instanciada de
 * disco ou de anel, em decalque (não briga com o piso). A marca nasce, cresce
 * até o tamanho dela e some ENCOLHENDO — pelo mesmo motivo das gotas.
 */
export interface Marca {
  x: number; z: number;
  /** raio final */
  raio: number;
  vida: number;
  cor: number;
  /** segundos até chegar no raio final; 0 = já nasce inteira */
  crescer?: number;
  /** a marca continua crescendo depois (o anel de respingo que abre) */
  abrir?: number;
  /** achatamento: 1 = círculo; <1 = elipse (poça espalhada) */
  achata?: number;
  giro?: number;
  y?: number;
}

interface MarcaViva extends Required<Marca> { idade: number; viva: boolean }

export class Marcas {
  readonly malha: THREE.InstancedMesh;
  private readonly marcas: MarcaViva[] = [];
  private proxima = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly s = new THREE.Vector3();
  private readonly p = new THREE.Vector3();
  private readonly c = new THREE.Color();
  private readonly zero = new THREE.Matrix4().makeScale(0, 0, 0);
  private readonly deitado = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  private readonly giro = new THREE.Quaternion();

  /**
   * @param forma 'disco' (poça, rastro) ou 'anel' (respingo abrindo, alvinho)
   */
  constructor(forma: 'disco' | 'anel', maximo = 120, opacidade = 0.6, brilho = 0.2) {
    const geo = forma === 'disco'
      ? new THREE.CircleGeometry(1, 20)
      : new THREE.RingGeometry(0.9, 1, 36);
    this.malha = new THREE.InstancedMesh(
      geo, toon(0xffffff, { opacity: opacidade, decal: true, glow: brilho }), maximo,
    );
    this.malha.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.malha.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(maximo * 3), 3);
    this.malha.frustumCulled = false;
    this.malha.renderOrder = 3;
    for (let i = 0; i < maximo; i++) {
      this.malha.setMatrixAt(i, this.zero);
      this.marcas.push({
        x: 0, z: 0, raio: 0, vida: 0, cor: 0, crescer: 0, abrir: 0, achata: 1, giro: 0, y: 0.03,
        idade: 0, viva: false,
      });
    }
  }

  deixar(mk: Marca): void {
    const i = this.proxima;
    this.proxima = (this.proxima + 1) % this.marcas.length;
    Object.assign(this.marcas[i], {
      crescer: 0, abrir: 0, achata: 1, giro: 0, y: 0.03, ...mk, idade: 0, viva: true,
    });
    this.c.setHex(mk.cor);
    this.malha.setColorAt(i, this.c);
    if (this.malha.instanceColor) this.malha.instanceColor.needsUpdate = true;
  }

  /** quantas marcas estão no chão agora, e onde (a poça precisa saber) */
  vivasPerto(x: number, z: number, folga = 0): number {
    let n = 0;
    for (const mk of this.marcas) {
      if (!mk.viva) continue;
      if (Math.hypot(mk.x - x, mk.z - z) < mk.raio + folga) n++;
    }
    return n;
  }

  get vivas(): number {
    return this.marcas.filter((m) => m.viva).length;
  }

  update(dt: number): void {
    for (let i = 0; i < this.marcas.length; i++) {
      const mk = this.marcas[i];
      if (!mk.viva) continue;
      mk.idade += dt;
      if (mk.idade >= mk.vida) {
        mk.viva = false;
        this.malha.setMatrixAt(i, this.zero);
        continue;
      }
      const nasce = mk.crescer > 0 ? Math.min(1, mk.idade / mk.crescer) : 1;
      // nasce com uma sobra (easeOut) e some encolhendo no último quarto
      const t = mk.idade / mk.vida;
      const some = t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
      const r = mk.raio * (1 - (1 - nasce) ** 3) * (1 + mk.abrir * mk.idade) * (mk.abrir ? 1 : some);
      this.p.set(mk.x, mk.y, mk.z);
      this.giro.setFromAxisAngle(new THREE.Vector3(0, 1, 0), mk.giro);
      this.q.copy(this.giro).multiply(this.deitado);
      this.s.set(r, r * mk.achata, 1);
      this.m.compose(this.p, this.q, this.s);
      this.malha.setMatrixAt(i, this.m);
    }
    this.malha.instanceMatrix.needsUpdate = true;
  }

  limpar(): void {
    for (let i = 0; i < this.marcas.length; i++) {
      this.marcas[i].viva = false;
      this.malha.setMatrixAt(i, this.zero);
    }
    this.malha.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.malha.geometry.dispose();
    this.malha.dispose();
  }
}
