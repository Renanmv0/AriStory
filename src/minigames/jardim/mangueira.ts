import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';

/**
 * A MANGUEIRA ESTICADA NO CHÃO — do tonel até a mão de quem rega, na rodada
 * de mangueira (`armas.ts`). É ela que diz, sem texto nenhum, por que a água
 * nunca acaba e por que não dá para passar dos portões.
 *
 * O desenho é um tubo por uma curva: sai da boca do tonel, desce pela lateral
 * dele, deita no chão e vem serpenteando de leve até os pés da pessoa, e sobe
 * até o esguicho. A curva é refeita quando quem rega anda (e só então).
 *
 * O trecho DEITADO também é regra: as cartas Chicote e Vazamento perguntam a
 * distância de um bicho até ele (`distancia`).
 */
export class MangueiraNoChao {
  readonly malha: THREE.Mesh;
  /** o trecho deitado, em pontos no chão, do tonel até os pés */
  private chao: Array<{ x: number; z: number }> = [];
  private ultima = new THREE.Vector3(Infinity, 0, 0);
  private ultimaMao = new THREE.Vector3(Infinity, 0, 0);
  private readonly material = toon(P.mangueiraBorracha);

  constructor() {
    this.malha = new THREE.Mesh(new THREE.BufferGeometry(), this.material);
    this.malha.frustumCulled = false;
    this.malha.visible = false;
  }

  /**
   * Estica do tonel (`de`, com a altura da boca) até a mão (`mao`), passando
   * pelos pés (`pe`). Barato quando ninguém se mexeu.
   */
  atualizar(de: { x: number; z: number; altura: number }, pe: THREE.Vector3, mao: THREE.Vector3): void {
    this.malha.visible = true;
    if (pe.distanceTo(this.ultima) < 0.03 && mao.distanceTo(this.ultimaMao) < 0.03) return;
    this.ultima.copy(pe);
    this.ultimaMao.copy(mao);

    const dx = pe.x - de.x;
    const dz = pe.z - de.z;
    const comprimento = Math.max(0.5, Math.hypot(dx, dz));
    const ux = dx / comprimento;
    const uz = dz / comprimento;
    // o pé do tonel, do lado de quem rega
    const base = { x: de.x + ux * 0.55, z: de.z + uz * 0.55 };
    const Y = 0.06;
    const pontos: THREE.Vector3[] = [
      new THREE.Vector3(de.x + ux * 0.25, de.altura + 0.05, de.z + uz * 0.25),
      new THREE.Vector3(de.x + ux * 0.5, de.altura * 0.45, de.z + uz * 0.5),
      new THREE.Vector3(base.x, Y, base.z),
    ];
    // no chão: uma serpenteada leve para o lado, que é como mangueira deita
    this.chao = [{ ...base }];
    const trechos = Math.max(2, Math.min(9, Math.round(comprimento / 1.6)));
    for (let k = 1; k < trechos; k++) {
      const t = k / trechos;
      const onda = Math.sin(t * Math.PI * 2.2) * Math.min(0.45, comprimento * 0.05);
      const x = base.x + (pe.x - base.x) * t - uz * onda;
      const z = base.z + (pe.z - base.z) * t + ux * onda;
      pontos.push(new THREE.Vector3(x, Y, z));
      this.chao.push({ x, z });
    }
    // chega por trás dos pés e sobe até o esguicho
    const atras = { x: pe.x - ux * 0.35, z: pe.z - uz * 0.35 };
    pontos.push(new THREE.Vector3(atras.x, Y, atras.z));
    this.chao.push(atras);
    pontos.push(new THREE.Vector3((atras.x + mao.x) / 2, mao.y * 0.35, (atras.z + mao.z) / 2));
    pontos.push(mao.clone());

    const curva = new THREE.CatmullRomCurve3(pontos, false, 'centripetal');
    const velha = this.malha.geometry;
    this.malha.geometry = new THREE.TubeGeometry(curva, Math.min(120, 16 + trechos * 8), 0.055, 6, false);
    velha.dispose();
  }

  esconder(): void {
    this.malha.visible = false;
    this.chao = [];
    this.ultima.set(Infinity, 0, 0);
  }

  /** a distância de um ponto do chão até o trecho deitado (Infinity sem mangueira) */
  distancia(x: number, z: number): number {
    let melhor = Infinity;
    for (let i = 1; i < this.chao.length; i++) {
      const a = this.chao[i - 1];
      const b = this.chao[i];
      const vx = b.x - a.x;
      const vz = b.z - a.z;
      const l2 = vx * vx + vz * vz || 1;
      const t = Math.max(0, Math.min(1, ((x - a.x) * vx + (z - a.z) * vz) / l2));
      melhor = Math.min(melhor, Math.hypot(x - (a.x + vx * t), z - (a.z + vz * t)));
    }
    return melhor;
  }

  /** os pontos do trecho deitado, do tonel até os pés (a Mangueira que rega lê daqui) */
  pontosNoChao(): readonly { x: number; z: number }[] {
    return this.chao;
  }

  /** um ponto qualquer do trecho deitado (o Vazamento pinga ali) */
  pontoNoChao(sorte: number): { x: number; z: number } | null {
    if (this.chao.length < 2) return null;
    const i = Math.min(this.chao.length - 2, Math.floor(sorte * (this.chao.length - 1)));
    const a = this.chao[i];
    const b = this.chao[i + 1];
    const t = (sorte * (this.chao.length - 1)) % 1;
    return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
  }

  dispose(): void {
    this.malha.geometry.dispose();
  }
}
