import * as THREE from 'three';
import type { AguaDoLago } from '../core/shaders';
import { pedrinhaDeQuicar } from '../world/lagoDoParque';

/**
 * A CARGA QUE DÁ MAIS QUIQUES. Abaixo dela a pedra vai fraca e quica pouco;
 * acima ela vai forte demais, entra de bico e quica pouco também; perto do
 * fim da barra (`TIBUM`) ela afunda de cara. É o alvo dourado da barra de
 * força.
 */
export const CARGA_CERTA = 0.76;
/** a largura da faixa dourada em volta da carga certa */
export const FAIXA_CERTA = 0.08;
/** acima disto a pedra não quica: "tibum" */
export const TIBUM = 0.95;

/**
 * QUANTOS QUIQUES uma carga dá: o sino em volta da carga certa, de 1 a 8, mais
 * a sorte (de -1 a +1 — pedra também tem dia). Pura, para o teste medir.
 */
export function quiquesDaCarga(carga: number, sorte: number): number {
  if (carga >= TIBUM) return 0;
  const sino = Math.exp(-(((carga - CARGA_CERTA) / 0.2) ** 2));
  return Math.max(1, Math.min(9, Math.round(1 + sino * 7 + (sorte - 0.5) * 2)));
}

type Fase = 'parada' | 'voando' | 'afundou' | 'na-areia';

interface Pulinho {
  de: THREE.Vector3;
  para: THREE.Vector3;
  alto: number;
  dur: number;
}

/**
 * A PEDRINHA QUICANDO NA ÁGUA — ator, como o frisbee: sabe voar, encostar na
 * água e afundar, e avisa a cena em cada toque (`aoQuicar`, com o número do
 * quique) para ela fazer a marola, o "tic" e o susto do pato.
 *
 * O VOO SAI PRONTO NO LANÇAMENTO: a carga decide quantos quiques, e a pedra
 * monta os pulinhos de uma vez — o primeiro longo e alto, saindo da mão, e
 * cada um dos seguintes 72% do anterior, mais baixo e mais rápido. É assim que
 * pedra quicando parece de verdade: o ritmo acelera até ela afundar.
 *
 * SE UM PULO CAIR FORA D'ÁGUA (a pedra chega na outra margem), ela para na
 * areia em vez de afundar — e conta os quiques que deu até ali.
 */
export class PedrinhaQuicando {
  readonly mesh: THREE.Mesh;
  private readonly agua: AguaDoLago;
  private fase: Fase = 'parada';
  private pulos: Pulinho[] = [];
  private atual = 0;
  private t = 0;
  private afundando = 0;
  /** quantos quiques ela deu de verdade até agora */
  quiques = 0;
  aoQuicar: ((x: number, z: number, n: number) => void) | null = null;
  aoAfundar: ((x: number, z: number, quiques: number) => void) | null = null;
  aoParar: ((x: number, z: number, quiques: number) => void) | null = null;

  constructor(agua: AguaDoLago) {
    this.agua = agua;
    this.mesh = pedrinhaDeQuicar();
    this.mesh.visible = false;
  }

  get voando(): boolean {
    return this.fase === 'voando';
  }

  get terminou(): boolean {
    return this.fase === 'afundou' || this.fase === 'na-areia';
  }

  /**
   * Joga de `de` (a mão) na direção `rumo`, com a `carga` da barra (0 a 1).
   * Devolve quantos quiques ela VAI dar (se não bater na margem antes).
   */
  lancar(de: THREE.Vector3, rumo: number, carga: number, sorte: number): number {
    const quiques = quiquesDaCarga(carga, sorte);
    const frente = new THREE.Vector3(Math.sin(rumo), 0, Math.cos(rumo));
    // um tico de efeito: a pedra de lado faz uma curva leve
    const lado = new THREE.Vector3(frente.z, 0, -frente.x);
    this.pulos = [];
    const primeiro = 1.3 + carga * 2.4;
    let p = de.clone();
    let alvo = de.clone().addScaledVector(frente, primeiro);
    alvo.y = 0;
    this.pulos.push({ de: p, para: alvo.clone(), alto: 0.25 + carga * 0.45, dur: 0.36 + carga * 0.2 });
    let passo = 0.65 + carga * 1.25;
    for (let i = 0; i < quiques; i++) {
      p = alvo.clone();
      alvo = p.clone().addScaledVector(frente, passo).addScaledVector(lado, passo * 0.06 * (sorte - 0.5));
      alvo.y = 0;
      this.pulos.push({ de: p, para: alvo.clone(), alto: 0.05 + passo * 0.12, dur: 0.14 + passo * 0.13 });
      passo *= 0.72;
    }
    this.atual = 0;
    this.t = 0;
    this.quiques = 0;
    this.fase = 'voando';
    this.mesh.visible = true;
    this.mesh.position.copy(de);
    this.mesh.rotation.set(0.15, rumo, 0.08);
    return quiques;
  }

  update(dt: number): void {
    if (this.fase === 'afundou' && this.afundando > 0) {
      this.afundando -= dt;
      this.mesh.position.y -= dt * 0.25;
      if (this.afundando <= 0) this.mesh.visible = false;
      return;
    }
    if (this.fase !== 'voando') return;
    const pulo = this.pulos[this.atual];
    this.t += dt;
    const k = Math.min(1, this.t / pulo.dur);
    this.mesh.position.lerpVectors(pulo.de, pulo.para, k);
    // o arco: do primeiro sai da mão (y da mão) e desce; os outros sobem e descem
    const base = pulo.de.y * (1 - k);
    this.mesh.position.y = base + Math.sin(k * Math.PI) * pulo.alto + 0.012;
    this.mesh.rotation.y += dt * 26;
    if (k < 1) return;

    // ------------------------------------------------------ encostou
    const { x, z } = pulo.para;
    const naAgua = this.agua.fundura(x, z) > 0.1;
    if (!naAgua) {
      this.fase = 'na-areia';
      this.mesh.position.set(x, 0.015, z);
      this.aoParar?.(x, z, this.quiques);
      return;
    }
    const ultimo = this.atual === this.pulos.length - 1;
    if (ultimo) {
      this.fase = 'afundou';
      this.afundando = 0.25;
      this.aoAfundar?.(x, z, this.quiques);
      return;
    }
    this.quiques++;
    this.aoQuicar?.(x, z, this.quiques);
    this.atual++;
    this.t = 0;
  }

  /** some de vez (troca de cena, nova pedra) */
  esconder(): void {
    this.fase = 'parada';
    this.mesh.visible = false;
  }
}
