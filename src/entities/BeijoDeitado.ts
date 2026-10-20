import * as THREE from 'three';
import type { Player } from './Player';
import type { Companion } from './Companion';
import type { Coracoes } from './Coracoes';

/** segundos para virar de lado (e para voltar de barriga para cima) */
const VIRA = 1.1;
/** o beijo: chegar perto, ficar e soltar */
const INCLINA = 0.55;
const SEGURA = 1.3;
const SOLTA = 0.5;
const BEIJO = INCLINA + SEGURA + SOLTA;
/**
 * O raio da cabeça, em fração da altura (o `headR` do `CharacterRig`). É a
 * cabeça, e não o corpo, que decide a distância: na régua chibi do jogo ela é
 * bem mais larga que o tronco, e as duas se encostam muito antes dos peitos.
 */
const RAIO_DA_CABECA = 0.17;
/** de lado, de frente: as cabeças a um palmo, sem se tocar */
const FOLGA_DE_FRENTE = 1.14;
/** no beijo: as cabeças encostadas (a bochecha cede um tico) */
const FOLGA_NO_BEIJO = 0.95;
/**
 * O quanto o corpo SOBE ao virar de lado, para o ombro de baixo não afundar
 * no colchão: de costas, quem encosta é a espessura do tronco; de lado, é a
 * largura dos ombros, que é maior.
 */
const ERGUE = 0.06;

/**
 * O BEIJO DEITADO: os dois, deitados lado a lado, viram de lado um de frente
 * para o outro, chegam perto, fecham os olhos e se beijam — e os corações
 * sobem de cada um.
 *
 * O beijo de pé (`Beijo.ts`) é do jogador, no E; este é da CENA, por
 * `g.virarDeitados` e `g.beijarDeitados`, porque só existe dentro de uma
 * cutscene de deitar (a barraca da clareira).
 *
 * O contrato é o da âncora de deitar de sempre (a cama do quarto, a barraca):
 * um `Object3D` girado -90° em X, com os dois FILHOS dela, lado a lado no
 * eixo X dela. Nessa âncora, o `facing` do rig rola o corpo em volta da
 * espinha, e o Z local dela é o "para cima" do mundo — é por ele que o corpo
 * sobe ao virar.
 */
export class BeijoDeitado {
  /** 0 de barriga para cima, 1 de lado, de frente (linear; a curva é na hora de usar) */
  private p = 0;
  private alvo = 0;
  /** relógio do beijo; -1 é sem beijo */
  private t = -1;
  private soltouCoracao = false;
  /** onde cada um estava antes de virar, para voltar ao mesmo lugar */
  private readonly origemA = new THREE.Vector3();
  private readonly origemB = new THREE.Vector3();
  /** +1 se o parceiro está no +X da âncora em relação ao jogador */
  private lado = 1;
  private aoVirar: Array<() => void> = [];
  private aoBeijar: (() => void) | null = null;
  private readonly tmpA = new THREE.Vector3();
  private readonly tmpB = new THREE.Vector3();

  /** o Game liga isto no motor de áudio */
  onSom: ((nome: 'beijo' | 'coracao') => void) | null = null;

  constructor(private readonly coracoes: Coracoes) {}

  /** os dois estão deitados na mesma âncora? É a única hora em que isto vale */
  private podem(a: Player, b: Companion): boolean {
    return a.riding && b.riding && a.object.parent !== null && a.object.parent === b.object.parent;
  }

  /**
   * Vira os dois de lado, um de frente para o outro (ou de volta, de barriga
   * para cima). Resolve quando a virada acaba.
   */
  virar(deFrente: boolean, a: Player, b: Companion): Promise<void> {
    if (!this.podem(a, b)) return Promise.resolve();
    const alvo = deFrente ? 1 : 0;
    if (this.p === alvo && this.alvo === alvo) return Promise.resolve();
    if (this.p === 0 && alvo === 1) {
      // sai de onde estão agora (os abraçadinhos já deixam os dois mais perto)
      this.origemA.copy(a.object.position);
      this.origemB.copy(b.object.position);
      this.lado = this.origemB.x >= this.origemA.x ? 1 : -1;
    }
    this.alvo = alvo;
    return new Promise((resolve) => this.aoVirar.push(resolve));
  }

  /**
   * O beijo: vira de frente (se ainda não virou), chegam perto, beijam e se
   * afastam um tico. Resolve no fim do beijo, com os dois ainda de frente —
   * a cena fala o que quiser e depois chama `virar(false)`.
   */
  async beijar(a: Player, b: Companion): Promise<void> {
    if (!this.podem(a, b)) return;
    await this.virar(true, a, b);
    if (!this.podem(a, b) || this.p < 1) return;
    this.t = 0;
    this.soltouCoracao = false;
    await new Promise<void>((resolve) => {
      this.aoBeijar = resolve;
    });
  }

  /** Para tudo na hora (troca de cena, levantar, outra âncora) e solta quem esperava. */
  cancelar(a: Player, b: Companion): void {
    const ativo = this.p > 0 || this.alvo > 0 || this.t >= 0;
    this.p = 0;
    this.alvo = 0;
    this.t = -1;
    if (ativo) {
      a.rig.setDeLado(0);
      b.rig.setDeLado(0);
      a.rig.setKiss(0);
      b.rig.setKiss(0);
    }
    this.resolver();
  }

  private resolver(): void {
    const virou = this.aoVirar;
    this.aoVirar = [];
    for (const r of virou) r();
    const beijou = this.aoBeijar;
    this.aoBeijar = null;
    beijou?.();
  }

  update(dt: number, a: Player, b: Companion): void {
    if (this.p === 0 && this.alvo === 0 && this.t < 0) {
      if (this.aoVirar.length) this.resolver();
      return;
    }
    // alguém levantou ou trocou de âncora no meio: larga tudo
    if (!this.podem(a, b)) {
      this.cancelar(a, b);
      return;
    }

    // ------------------------------------------------------------ a virada
    if (this.p !== this.alvo) {
      const passo = dt / VIRA;
      this.p = this.alvo > this.p ? Math.min(this.alvo, this.p + passo) : Math.max(this.alvo, this.p - passo);
    }
    const k = suave(this.p);

    // ------------------------------------------------------------- o beijo
    let beijo = 0;
    if (this.t >= 0) {
      this.t += dt;
      beijo = curva(this.t);
      if (!this.soltouCoracao && this.t >= INCLINA * 0.9) {
        this.soltouCoracao = true;
        this.soltarCoracoes(a, b);
      }
    }

    // ------------------------------------------- o corpo: giro, lugar e pose
    const ra = RAIO_DA_CABECA * a.rig.spec.height;
    const rb = RAIO_DA_CABECA * b.rig.spec.height;
    const deFrente = (ra + rb) * FOLGA_DE_FRENTE;
    const noBeijo = (ra + rb) * FOLGA_NO_BEIJO;
    const distancia = deFrente + (noBeijo - deFrente) * beijo;
    const meio = (this.origemA.x + this.origemB.x) / 2;
    const xa = meio - (this.lado * distancia) / 2;
    const xb = meio + (this.lado * distancia) / 2;
    a.object.position.set(
      this.origemA.x + (xa - this.origemA.x) * k,
      this.origemA.y,
      this.origemA.z + ERGUE * k,
    );
    b.object.position.set(
      this.origemB.x + (xb - this.origemB.x) * k,
      this.origemB.y,
      this.origemB.z + ERGUE * k,
    );
    // o giro é escrito direto (e no alvo do rig, senão o `update` dele puxa
    // de volta): a curva da virada é esta, e não a do giro rápido de andar
    const giroA = ((this.lado * Math.PI) / 2) * k;
    const giroB = ((-this.lado * Math.PI) / 2) * k;
    a.rig.group.rotation.y = giroA;
    a.rig.setFacing(giroA);
    b.rig.group.rotation.y = giroB;
    b.rig.setFacing(giroB);
    // quem abraça é quem está no -X da âncora; o outro descansa o braço
    a.rig.setDeLado(k, this.lado > 0);
    b.rig.setDeLado(k, this.lado < 0);
    a.rig.setKiss(beijo);
    b.rig.setKiss(beijo);

    // ------------------------------------------------------- quem esperava
    if (this.t >= BEIJO) {
      this.t = -1;
      a.rig.setKiss(0);
      b.rig.setKiss(0);
      const beijou = this.aoBeijar;
      this.aoBeijar = null;
      beijou?.();
    }
    if (this.p === this.alvo && this.aoVirar.length) {
      const virou = this.aoVirar;
      this.aoVirar = [];
      for (const r of virou) r();
    }
    // de volta de barriga para cima: devolve o lugar exato de antes
    if (this.p === 0 && this.alvo === 0 && this.t < 0) {
      a.object.position.copy(this.origemA);
      b.object.position.copy(this.origemB);
      a.rig.setDeLado(0);
      b.rig.setDeLado(0);
    }
  }

  /**
   * Os corações nascem em cima de CADA CABEÇA, no mundo, e saem pelo lado de
   * fora do par — no eixo das duas cabeças, como no beijo de pé. A posição
   * do corpo não serve: deitado na âncora ela é local, e era assim que o
   * `soltarCoracoes` jogava os corações no meio do mapa.
   */
  private soltarCoracoes(a: Player, b: Companion): void {
    a.rig.cabecaNoMundo(this.tmpA);
    b.rig.cabecaNoMundo(this.tmpB);
    const dx = this.tmpB.x - this.tmpA.x;
    const dz = this.tmpB.z - this.tmpA.z;
    const d = Math.hypot(dx, dz) || 1;
    const lx = (dx / d) * 0.3;
    const lz = (dz / d) * 0.3;
    this.coracoes.soltar(this.tmpA, -lx, -lz, this.tmpA.y + 0.4);
    this.coracoes.soltar(this.tmpB, lx, lz, this.tmpB.y + 0.4);
    this.onSom?.('beijo');
    this.onSom?.('coracao');
  }
}

/** 0 → 1 → 0: chega perto, fica e solta */
function curva(t: number): number {
  if (t < INCLINA) return suave(t / INCLINA);
  if (t < INCLINA + SEGURA) return 1;
  return suave(Math.max(0, 1 - (t - INCLINA - SEGURA) / SOLTA));
}

function suave(x: number): number {
  return x * x * (3 - 2 * x);
}
