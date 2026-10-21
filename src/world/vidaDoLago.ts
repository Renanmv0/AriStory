import * as THREE from 'three';
import type { AguaDoLago } from '../core/shaders';
import { PALETTE as P } from '../palette';
import { libelula, peixeQuePula } from './lagoDoParque';
import { Particulas } from './particulas';
import { sorteio } from './texturasDeChao';

/**
 * ===================================================== A VIDA MIÚDA DO LAGO
 *
 * O que não é bicho de passear, mas faz o lago parecer vivo de longe:
 *
 *  - **as libélulas**, pairando perto do taboal e disparando de um ponto a
 *    outro — de vez em quando uma desce e encosta na água (a marola);
 *  - **o cardume**: as sombras escuras dos peixes nadando debaixo d'água (quem
 *    desenha é a `AguaDoLago`; aqui só se decide para onde cada um vai). Eles
 *    são CURIOSOS: tudo que toca a água (a pedrinha, a moeda, o dedo no mouse)
 *    puxa os de perto para ver o que foi;
 *  - **o peixe que pula**: de tempos em tempos um dos peixes do cardume salta
 *    num arco — a sombra some, ele sai prateado da água, cai do outro lado, e
 *    os respingos e as duas marolas marcam a saída e a volta.
 */

// ============================================================== as libélulas

interface Libelula {
  obj: THREE.Group;
  asas: THREE.Object3D;
  casa: { x: number; z: number };
  de: THREE.Vector3;
  para: THREE.Vector3;
  t: number;
  dur: number;
  pairando: number;
  /** vai encostar na água no fim deste disparo */
  molha: boolean;
  fase: number;
}

/** o tamanho delas no jogo: o de verdade (8 cm) não se vê desta câmera */
const ESCALA_DA_LIBELULA = 2.4;

export class Libelulas {
  readonly grupo = new THREE.Group();
  private readonly lista: Libelula[] = [];
  private readonly rnd: () => number;
  private readonly agua: AguaDoLago;
  /** a cena liga aqui o que acontece quando uma encosta na água */
  aoMolhar: ((x: number, z: number) => void) | null = null;

  constructor(casas: Array<{ x: number; z: number }>, agua: AguaDoLago, semente = 515) {
    this.agua = agua;
    this.rnd = sorteio(semente);
    casas.forEach((casa, i) => {
      const obj = libelula(i % 3 === 2 ? P.libelulaVermelha : P.libelulaAzul);
      obj.scale.setScalar(ESCALA_DA_LIBELULA);
      const asas = obj.getObjectByName('asas') ?? obj;
      const de = new THREE.Vector3(casa.x, 0.8, casa.z);
      obj.position.copy(de);
      this.grupo.add(obj);
      this.lista.push({ obj, asas, casa, de, para: de.clone(), t: 0, dur: 1, pairando: 0.5 + i * 0.4, molha: false, fase: i * 1.7 });
    });
    this.grupo.userData.peca = 'libelulas';
  }

  /** onde cada uma está (o teste confere que elas se mexem) */
  get posicoes(): THREE.Vector3[] {
    return this.lista.map((l) => l.obj.position.clone());
  }

  private proximoPonto(l: Libelula): void {
    l.de.copy(l.obj.position);
    const r = this.rnd;
    l.molha = r() < 0.18;
    const a = r() * Math.PI * 2;
    const d = 0.4 + r() * 2.2;
    let x = l.casa.x + Math.cos(a) * d;
    let z = l.casa.z + Math.sin(a) * d;
    // para molhar, só onde é água de verdade
    if (l.molha && this.agua.fundura(x, z) < 0.4) l.molha = false;
    if (!l.molha && this.agua.fundura(x, z) < -1.5) {
      x = l.casa.x;
      z = l.casa.z;
    }
    l.para.set(x, l.molha ? 0.05 : 0.45 + r() * 0.9, z);
    l.t = 0;
    l.dur = 0.35 + l.de.distanceTo(l.para) * 0.22;
  }

  update(dt: number): void {
    for (const l of this.lista) {
      l.fase += dt;
      // as asas: batida rápida demais para o olho, então lê como borrão
      l.asas.rotation.z = Math.sin(l.fase * 47) * 0.32;
      l.asas.scale.z = 0.75 + Math.abs(Math.sin(l.fase * 47)) * 0.25;
      if (l.pairando > 0) {
        l.pairando -= dt;
        // pairando: um tremor pequeno no ar
        l.obj.position.x += Math.sin(l.fase * 5.1) * 0.0015;
        l.obj.position.y += Math.sin(l.fase * 7.3) * 0.0012;
        if (l.pairando <= 0) this.proximoPonto(l);
        continue;
      }
      l.t += dt;
      const k = Math.min(1, l.t / l.dur);
      const s = k * k * (3 - 2 * k);
      l.obj.position.lerpVectors(l.de, l.para, s);
      const dx = l.para.x - l.de.x;
      const dz = l.para.z - l.de.z;
      if (Math.abs(dx) + Math.abs(dz) > 0.01) l.obj.rotation.y = Math.atan2(dx, dz);
      // inclina para a frente acelerando, e para trás freando
      l.obj.rotation.x = Math.sin(k * Math.PI) * 0.35 * (k < 0.5 ? 1 : -0.6);
      if (k >= 1) {
        if (l.molha) {
          this.aoMolhar?.(l.obj.position.x, l.obj.position.z);
          // encostou e já sobe
          l.para.y = 0.5 + this.rnd() * 0.5;
          l.de.copy(l.obj.position);
          l.t = 0;
          l.dur = 0.45;
          l.molha = false;
          continue;
        }
        l.pairando = 0.6 + this.rnd() * 2.8;
      }
    }
  }
}

// ================================================================ o cardume

interface Peixe {
  x: number;
  z: number;
  rumo: number;
  tamanho: number;
  alvo: { x: number; z: number };
  vel: number;
  /** segundos de curiosidade que ainda restam */
  curioso: number;
  /** está no ar (pulando): a sombra some */
  noAr: boolean;
}

export class Cardume {
  private readonly peixes: Peixe[] = [];
  private readonly rnd: () => number;
  private readonly agua: AguaDoLago;
  private readonly peixeNoAr: THREE.Group;
  private readonly respingos = new Particulas(140, 0.3, 1, 5);
  readonly grupo = new THREE.Group();
  /** o pulo em curso */
  private pulo: { i: number; de: THREE.Vector3; rumo: number; t: number; comprimento: number } | null = null;
  private atePular: number;
  /** a cena liga aqui o som e a marola do peixe saindo e entrando na água */
  aoPular: ((x: number, z: number, saindo: boolean) => void) | null = null;
  /** onde ele NÃO deve pular (o trapiche, por exemplo) */
  podePularEm: (x: number, z: number) => boolean = () => true;

  constructor(agua: AguaDoLago, quantos = 5, semente = 2718) {
    this.agua = agua;
    this.rnd = sorteio(semente);
    const [cx, cz] = agua.forma.centro;
    for (let i = 0; i < quantos; i++) {
      const a = (i / quantos) * Math.PI * 2;
      const d = 2 + this.rnd() * 3;
      const p = { x: cx + Math.cos(a) * d, z: cz + Math.sin(a) * d };
      this.peixes.push({
        ...p, rumo: this.rnd() * 6.28, tamanho: 0.22 + this.rnd() * 0.14, alvo: { ...p }, vel: 0.35, curioso: 0, noAr: false,
      });
      this.novoAlvo(this.peixes[i]);
    }
    this.peixeNoAr = peixeQuePula();
    this.peixeNoAr.visible = false;
    this.peixeNoAr.scale.setScalar(1.5);
    this.grupo.add(this.peixeNoAr, this.respingos.malha);
    this.atePular = 6 + this.rnd() * 6;
  }

  /** as posições (o teste confere que eles nadam e que a curiosidade puxa) */
  get posicoes(): Array<{ x: number; z: number }> {
    return this.peixes.map((p) => ({ x: p.x, z: p.z }));
  }

  get pulando(): boolean {
    return this.pulo !== null;
  }

  private novoAlvo(p: Peixe): void {
    const [cx, cz] = this.agua.forma.centro;
    for (let t = 0; t < 12; t++) {
      const a = this.rnd() * Math.PI * 2;
      const d = this.rnd() * 6;
      const x = cx + Math.cos(a) * d;
      const z = cz + Math.sin(a) * d;
      if (this.agua.fundura(x, z) > 1.3) {
        p.alvo = { x, z };
        return;
      }
    }
  }

  /** algo tocou a água em (x, z): os peixes de perto vêm ver o que foi */
  atrair(x: number, z: number, alcance = 4.5): void {
    for (const p of this.peixes) {
      const d = Math.hypot(p.x - x, p.z - z);
      if (d > alcance || this.agua.fundura(x, z) < 0.5) continue;
      const a = this.rnd() * Math.PI * 2;
      p.alvo = { x: x + Math.cos(a) * 0.35, z: z + Math.sin(a) * 0.35 };
      p.curioso = 3.5 + this.rnd() * 2;
    }
  }

  /** um pulo agora (o teste chama para não esperar o sorteio) */
  pularJa(): void {
    this.atePular = 0;
  }

  update(dt: number): void {
    for (const [i, p] of this.peixes.entries()) {
      if (p.noAr) {
        this.agua.peixe(i, p.x, p.z, p.rumo, 0);
        continue;
      }
      if (p.curioso > 0) p.curioso -= dt;
      const dx = p.alvo.x - p.x;
      const dz = p.alvo.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.25 && p.curioso <= 0) this.novoAlvo(p);
      const alvoVel = p.curioso > 0 ? (d > 0.3 ? 1.1 : 0.12) : 0.32;
      p.vel += (alvoVel - p.vel) * Math.min(1, dt * 2);
      if (d > 0.05) {
        let giro = Math.atan2(dx, dz) - p.rumo;
        while (giro > Math.PI) giro -= Math.PI * 2;
        while (giro < -Math.PI) giro += Math.PI * 2;
        p.rumo += Math.max(-dt * 1.8, Math.min(dt * 1.8, giro));
        const anda = Math.min(d, p.vel * dt);
        const nx = p.x + Math.sin(p.rumo) * anda;
        const nz = p.z + Math.cos(p.rumo) * anda;
        // peixe não sobe na areia
        if (this.agua.fundura(nx, nz) > 0.7) {
          p.x = nx;
          p.z = nz;
        } else {
          this.novoAlvo(p);
        }
      }
      this.agua.peixe(i, p.x, p.z, p.rumo, p.tamanho);
    }

    // --------------------------------------------------------- o pulo
    this.respingos.update(dt);
    if (!this.pulo) {
      this.atePular -= dt;
      if (this.atePular <= 0) this.comecarPulo();
      return;
    }
    const pulo = this.pulo;
    pulo.t += dt;
    const DUR = 0.8;
    const k = Math.min(1, pulo.t / DUR);
    const frente = new THREE.Vector3(Math.sin(pulo.rumo), 0, Math.cos(pulo.rumo));
    const x = pulo.de.x + frente.x * pulo.comprimento * k;
    const z = pulo.de.z + frente.z * pulo.comprimento * k;
    const y = Math.sin(k * Math.PI) * 0.55 - 0.06;
    this.peixeNoAr.position.set(x, y, z);
    this.peixeNoAr.rotation.set(-Math.cos(k * Math.PI) * 1.0, pulo.rumo, Math.sin(pulo.t * 18) * 0.15);
    this.peixeNoAr.visible = y > -0.04;
    if (k >= 1) {
      this.respingar(x, z, 9);
      this.aoPular?.(x, z, false);
      const p = this.peixes[pulo.i];
      p.x = x;
      p.z = z;
      p.noAr = false;
      this.peixeNoAr.visible = false;
      this.pulo = null;
      this.atePular = 9 + this.rnd() * 12;
    }
  }

  private comecarPulo(): void {
    // um peixe de água funda, longe do que a cena proibiu
    const candidatos = this.peixes
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => this.agua.fundura(p.x, p.z) > 1.8 && this.podePularEm(p.x, p.z));
    if (!candidatos.length) {
      this.atePular = 3;
      return;
    }
    const { p, i } = candidatos[Math.floor(this.rnd() * candidatos.length)];
    const comprimento = 0.8 + this.rnd() * 0.4;
    const fim = { x: p.x + Math.sin(p.rumo) * comprimento, z: p.z + Math.cos(p.rumo) * comprimento };
    if (this.agua.fundura(fim.x, fim.z) < 1 || !this.podePularEm(fim.x, fim.z)) {
      this.atePular = 2;
      return;
    }
    p.noAr = true;
    this.pulo = { i, de: new THREE.Vector3(p.x, 0, p.z), rumo: p.rumo, t: 0, comprimento };
    this.respingar(p.x, p.z, 7);
    this.aoPular?.(p.x, p.z, true);
  }

  /** os respingos: gotinhas brancas subindo e caindo de volta */
  respingar(x: number, z: number, quantas: number): void {
    for (let k = 0; k < quantas; k++) {
      const a = this.rnd() * Math.PI * 2;
      const v = 0.6 + this.rnd() * 0.9;
      this.respingos.emitir({
        x: x + Math.cos(a) * 0.05, y: 0.02, z: z + Math.sin(a) * 0.05,
        vx: Math.cos(a) * v * 0.6, vy: 1.6 + this.rnd() * 1.4, vz: Math.sin(a) * v * 0.6,
        vida: 0.55 + this.rnd() * 0.3, tamanho: 0.018 + this.rnd() * 0.014,
        cor: P.espumaDoLago, gravidade: 9, esticar: 0.04,
      });
    }
  }

  dispose(): void {
    this.respingos.dispose();
  }
}
