import * as THREE from 'three';
import type { Player } from './Player';
import type { Companion } from './Companion';
import { heart } from '../world/props';

/** distancia maxima entre os dois para o beijo aparecer */
const PERTO = 1.5;
/** quanto cada um pode estar torto em relacao ao outro, em radianos (~50°) */
const TORTO = 0.9;
/** distancia em que os dois ficam para o beijo: perto o bastante para as
 *  cabecas se encostarem quando inclinam, longe o bastante para nao virarem
 *  um borrao so na tela */
const ALCANCE = 1.16;

/** marcas de tempo da animacao, em segundos */
const INCLINA = 0.32;
const SEGURA = 0.42;
const VOLTA = 0.34;
const TOTAL = INCLINA + SEGURA + VOLTA;
/** respiro depois do beijo, para o E nao disparar outro na hora */
const DESCANSO = 0.5;

interface Coracaozinho {
  obj: THREE.Group;
  vida: number;
  giro: number;
  /** direcao para fora do par, no plano do chao */
  fx: number;
  fz: number;
}

/**
 * O beijo rapido da dupla.
 *
 * So acontece entre dois personagens marcados com `casal: true` na ficha (hoje
 * o Ari e o Renan), de pe, parados e de frente um para o outro. Os dois se
 * inclinam ao mesmo tempo e sobe um coracaozinho ao lado de cada um.
 *
 * A mecanica e do motor, nao da cena: qualquer cenario ganha o beijo de graca.
 */
export class Beijo {
  private t = -1;
  private descanso = 0;
  /** onde cada um tem que estar para o beijo aparecer de perfil na tela */
  private readonly alvoA = new THREE.Vector3();
  private readonly alvoB = new THREE.Vector3();
  private readonly coracoes: Coracaozinho[] = [];
  private readonly grupo = new THREE.Group();
  private soltouCoracao = false;

  constructor(private readonly cena: THREE.Scene) {
    this.cena.add(this.grupo);
  }

  get rodando(): boolean {
    return this.t >= 0;
  }

  /** Os dois sao o casal, estao perto, de pe e olhando um para o outro? */
  disponivel(a: Player, b: Companion): boolean {
    if (this.rodando || this.descanso > 0) return false;
    if (a.riding || b.riding || a.submersion > 0.05 || b.submersion > 0.05) return false;
    if (!ecasal(a, b)) return false;

    const dx = b.position.x - a.position.x;
    const dz = b.position.z - a.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > PERTO || dist < 0.01) return false;

    const paraEle = Math.atan2(dx, dz);
    return (
      Math.abs(diff(a.rig.facing, paraEle)) < TORTO &&
      Math.abs(diff(b.rig.facing, paraEle + Math.PI)) < TORTO
    );
  }

  /**
   * Comeca o beijo. Chame so depois de `disponivel()` dizer que da.
   *
   * @param camera giro atual da camera. Na vista isometrica, dois personagens
   * alinhados com o eixo da camera viram um so na tela — um esconde o outro.
   * Entao o par gira em torno do proprio meio ate ficar de perfil, e o beijo
   * sempre se ve.
   */
  iniciar(a: Player, b: Companion, camera: number): void {
    if (this.rodando) return;
    this.t = 0;
    this.soltouCoracao = false;

    const dx = b.position.x - a.position.x;
    const dz = b.position.z - a.position.z;
    const atual = Math.atan2(dx, dz);

    // eixo horizontal da tela; escolhe o lado que exige menos giro
    const tela = camera + Math.PI / 2;
    const eixo = Math.abs(diff(atual, tela)) < Math.PI / 2 ? tela : tela + Math.PI;

    const meioX = (a.position.x + b.position.x) / 2;
    const meioZ = (a.position.z + b.position.z) / 2;
    const px = (Math.sin(eixo) * ALCANCE) / 2;
    const pz = (Math.cos(eixo) * ALCANCE) / 2;
    this.alvoA.set(meioX - px, 0, meioZ - pz);
    this.alvoB.set(meioX + px, 0, meioZ + pz);

    a.rig.setFacing(eixo);
    b.rig.setFacing(eixo + Math.PI);
    b.clearOrder();
  }

  /** Interrompe na hora (troca de cena, cutscene). */
  cancelar(a: Player, b: Companion): void {
    this.t = -1;
    this.descanso = 0;
    a.rig.setKiss(0);
    b.rig.setKiss(0);
    for (const c of this.coracoes) this.grupo.remove(c.obj);
    this.coracoes.length = 0;
  }

  /** Roda antes do movimento: e ele que segura os dois parados no lugar. */
  update(dt: number, a: Player, b: Companion): void {
    if (this.descanso > 0) this.descanso = Math.max(0, this.descanso - dt);

    if (this.rodando) {
      this.t += dt;
      const k = curva(this.t);
      a.rig.setKiss(k);
      b.rig.setKiss(k);
      a.locked = true;

      // desliza para o perfil enquanto se inclinam; a fisica do frame ainda
      // resolve colisao depois, entao ninguem entra em parede
      if (this.t < INCLINA) {
        const passo = Math.min(1, dt * 9);
        a.position.lerp(this.alvoA, passo);
        b.position.lerp(this.alvoB, passo);
      }

      if (!this.soltouCoracao && this.t >= INCLINA * 0.9) {
        this.soltouCoracao = true;
        // cada coracao sobe pelo lado de fora do par — no eixo em que os dois
        // estao alinhados, que a essa altura ja e o horizontal da tela. Pela
        // perpendicular eles subiriam em direcao a camera e passariam por cima
        // dos corpos.
        const eixo = Math.atan2(b.position.x - a.position.x, b.position.z - a.position.z);
        const lx = Math.sin(eixo);
        const lz = Math.cos(eixo);
        this.solta(a.position, lx, lz, -1);
        this.solta(b.position, lx, lz, 1);
      }

      if (this.t >= TOTAL) {
        this.t = -1;
        this.descanso = DESCANSO;
        a.rig.setKiss(0);
        b.rig.setKiss(0);
        a.locked = false;
      }
    }

    this.animaCoracoes(dt);
  }

  private solta(onde: THREE.Vector3, lx: number, lz: number, lado: number): void {
    const fx = lx * lado;
    const fz = lz * lado;
    const c = heart(0.6);
    c.position.set(onde.x + fx * 1.0, 1.62, onde.z + fz * 1.0);
    this.grupo.add(c);
    this.coracoes.push({ obj: c, vida: 0, giro: Math.random() * Math.PI, fx, fz });
  }

  private animaCoracoes(dt: number): void {
    const VIDA = 1.7;
    for (let i = this.coracoes.length - 1; i >= 0; i--) {
      const c = this.coracoes[i];
      c.vida += dt;
      const p = c.vida / VIDA;
      if (p >= 1) {
        this.grupo.remove(c.obj);
        this.coracoes.splice(i, 1);
        continue;
      }
      c.obj.position.y += dt * 0.72;
      // sobe afastando do par, com um gingado leve: assim nenhum coracao fica
      // preso atras da cabeca de ninguem
      const deriva = (0.7 + Math.sin(c.vida * 3 + c.giro) * 0.25) * dt;
      c.obj.position.x += c.fx * deriva;
      c.obj.position.z += c.fz * deriva;
      c.obj.rotation.y = c.giro + c.vida * 1.4;
      // aparece num pop e some encolhendo, sem mexer no material compartilhado
      const escala = p < 0.18 ? p / 0.18 : Math.min(1, (1 - p) / 0.35);
      c.obj.scale.setScalar(0.25 + escala * 0.9);
    }
  }
}

/** 0 → 1 → 0: sobe, segura inclinado e volta */
function curva(t: number): number {
  if (t < INCLINA) return suave(t / INCLINA);
  if (t < INCLINA + SEGURA) return 1;
  return suave(Math.max(0, 1 - (t - INCLINA - SEGURA) / VOLTA));
}

function suave(x: number): number {
  return x * x * (3 - 2 * x);
}

function ecasal(a: Player, b: Companion): boolean {
  const um = a.rig.spec;
  const outro = b.rig.spec;
  return um.casal === true && outro.casal === true && um.id !== outro.id;
}

/** diferenca entre dois angulos pelo caminho mais curto */
function diff(a: number, b: number): number {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}
