import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { BebitoMobile } from '../../world/bebitoMobile/BebitoMobile';

/**
 * ============================================ A CÂMERA DE DENTRO DO CARRO
 *
 * Primeira pessoa no banco de quem o jogador controla (`docs/BEBITO-MOBILE-DENTRO.md`).
 * O molde é o olhar em volta da cabine da roda gigante (`scenes/villaLobos.ts`):
 * o olhar é um ângulo ACUMULADO (o manche gira o pescoço), com limite, e a
 * câmera é recolocada do zero a cada quadro — só que aqui o olho é a CABEÇA de
 * quem senta (`g.cabecaDe`), então acompanha o banco, a carroceria e as molas
 * sem conta nenhuma. A cabeça de quem olha some (senão a câmera nasce dentro
 * do crânio dela) e volta ao desligar.
 *
 * O balanço do carro entra na imagem, mas SUAVIZADO: o olho persegue a cabeça
 * (um filtro de ~14/s), que tira o solavanco da lombada sem tirar o balanço de
 * quem está num carro de verdade.
 *
 * A câmera entra e sai DESLIZANDO: `ligar(de)` mistura de uma tomada de fora
 * (no mundo) até o olho, e `desligar(para)` volta. Quem chama espera a
 * promessa.
 */

export interface TomadaDeFora {
  de: THREE.Vector3;
  para: THREE.Vector3;
}

/** uma tomada de fora fixa, ou uma que se refaz a cada quadro (a câmera de perseguição de uma cena que anda) */
export type DeFora = TomadaDeFora | (() => TomadaDeFora);

const suave = (t: number): number => t * t * (3 - 2 * t);

/** o pescoço: quanto se vira para cada lado, e quanto se olha para cima e para baixo */
export const PESCOCO = { giro: 2.2, cima: 0.62, baixo: -0.75 } as const;
/** deitado de barriga para cima: olha o teto, e vira um pouco para o lado do outro */
export const PESCOCO_DEITADO = { giro: 1.4, cima: 1.5, baixo: 0.2 } as const;

export type Postura = 'sentado' | 'deitado';

export class CameraDeDentro {
  /** o pescoço: 0 é a frente do carro, positivo vira para a esquerda do carro, negativo para a direita */
  giro = 0;
  altura = -0.05;
  /** sentado (o pescoço de cabine) ou deitado (olhando o teto) */
  postura: Postura = 'sentado';
  private ligada = false;
  /** 0 é a tomada de fora, 1 é o olho */
  private mistura = 1;
  private alvoDaMistura = 1;
  private duracao = 1;
  private fora: DeFora | null = null;
  private fim: (() => void) | null = null;
  private readonly olho = new THREE.Vector3();
  private readonly mira = new THREE.Vector3();
  private lido = false;
  private readonly cabeca = new THREE.Vector3();
  private readonly dir = new THREE.Vector3();
  private readonly deFora = new THREE.Vector3();
  private readonly paraFora = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();

  /** encostar no ombro do outro (0 a 1) e para que lado (`+1` é a esquerda do carro, o lado do motorista visto do passageiro) */
  encostar = 0;
  private encostado = 0;
  ladoDoOmbro = 1;
  /** uma peça que acompanha a câmera (o celular na mão): onde fica, em relação a ela */
  private anexo: { obj: THREE.Object3D; direita: number; baixo: number; frente: number } | null = null;
  private readonly cima = new THREE.Vector3(0, 1, 0);
  private readonly direitaCam = new THREE.Vector3();
  private readonly cimaCam = new THREE.Vector3();

  /**
   * `devolverIsometrica`: ao desligar, devolve a câmera isométrica (a garagem). Uma cena que
   * tem câmera própria (a estrada) passa `false`: quem a põe é a própria cena.
   */
  constructor(
    private readonly g: GameAPI,
    private readonly carro: BebitoMobile,
    private readonly quem: 'jogador' | 'parceiro' = 'jogador',
    private readonly devolverIsometrica = true,
  ) {}

  /** põe uma peça que acompanha a câmera (o celular na mão de quem joga no carro); `null` solta */
  anexar(obj: THREE.Object3D | null, onde = { direita: 0, baixo: 0.12, frente: 0.34 }): void {
    this.anexo = obj ? { obj, ...onde } : null;
  }

  get ativa(): boolean {
    return this.ligada;
  }

  /** a mistura agora: 1 é totalmente dentro */
  get dentro(): number {
    return this.mistura;
  }

  /**
   * Liga: a câmera nasce na tomada de `de` (no mundo) e DESLIZA até o olho em
   * `dura` segundos. A cabeça de quem olha some quando a mistura passa da
   * metade (antes disso a câmera ainda está fora e o vê inteiro).
   */
  ligar(de: DeFora, dura = 1.2): Promise<void> {
    this.ligada = true;
    this.lido = false;
    this.fora = de;
    this.mistura = 0;
    this.alvoDaMistura = 1;
    this.duracao = Math.max(0.01, dura);
    return new Promise((pronto) => { this.fim = pronto; });
  }

  /** Desliga: do olho, a câmera DESLIZA até a tomada de fora em `dura` segundos e a de sempre volta. */
  desligar(para: DeFora, dura = 1.1): Promise<void> {
    if (!this.ligada) return Promise.resolve();
    this.fora = para;
    this.alvoDaMistura = 0;
    this.duracao = Math.max(0.01, dura);
    return new Promise((pronto) => { this.fim = pronto; });
  }

  /** desliga já, sem deslizar (a troca de cena, o cancelamento) */
  cortar(): void {
    if (!this.ligada) return;
    this.ligada = false;
    this.mistura = 1;
    this.g.mostrarCabeca(this.quem, true);
    this.anexar(null);
    if (this.devolverIsometrica) this.g.setCameraOmbro(null);
    this.fim?.();
    this.fim = null;
  }

  /** muda a postura (sentado ou deitado): o pescoço ganha os limites dela e o olhar vai para o repouso dela */
  deitar(deitado: boolean): void {
    this.postura = deitado ? 'deitado' : 'sentado';
    this.giro = 0;
    this.altura = deitado ? 1.1 : -0.05;
  }

  /** o olhar de um quadro: o manche gira o pescoço (o `g.olharLivre()`), com limite */
  olhar(dt: number): void {
    const m = this.g.olharLivre();
    const p = this.postura === 'deitado' ? PESCOCO_DEITADO : PESCOCO;
    this.giro = THREE.MathUtils.clamp(this.giro - m.x * 1.5 * dt, -p.giro, p.giro);
    this.altura = THREE.MathUtils.clamp(this.altura + m.y * 0.9 * dt, p.baixo, p.cima);
  }

  /** um quadro: o olho segue a cabeça e a câmera é posta. `dt` é do jogo */
  update(dt: number): void {
    if (!this.ligada) return;
    // a mistura anda para o alvo (a tomada de fora ↔ o olho)
    if (this.mistura !== this.alvoDaMistura) {
      const passo = dt / this.duracao;
      this.mistura += Math.sign(this.alvoDaMistura - this.mistura) * Math.min(Math.abs(this.alvoDaMistura - this.mistura), passo);
    }
    // o olho: a cabeça de quem olha, um palmo à frente (e um tico acima: o centro da cabeça fica abaixo dos olhos)
    this.cabeca.copy(this.g.cabecaDe(this.quem));
    this.carro.group.getWorldQuaternion(this.q);
    const cosA = Math.cos(this.altura);
    this.dir.set(Math.sin(this.giro) * cosA, Math.sin(this.altura), Math.cos(this.giro) * cosA).applyQuaternion(this.q);
    const alvoDoOlho = this.cabeca.clone().addScaledVector(this.dir, 0.1);
    alvoDoOlho.y += 0.05;
    // encostar no ombro do outro: o olho vai um tanto para o lado dele (e desce um tico), e o olhar acompanha
    this.encostado += (this.encostar - this.encostado) * (1 - Math.exp(-5 * dt));
    if (this.encostado > 0.001) {
      const direitaDoCarro = new THREE.Vector3(1, 0, 0).applyQuaternion(this.q);
      alvoDoOlho.addScaledVector(direitaDoCarro, this.ladoDoOmbro * 0.3 * this.encostado);
      alvoDoOlho.y -= 0.06 * this.encostado;
    }
    if (!this.lido) {
      this.olho.copy(alvoDoOlho);
      this.lido = true;
    } else {
      this.olho.lerp(alvoDoOlho, 1 - Math.exp(-14 * dt));
    }
    this.mira.copy(this.olho).addScaledVector(this.dir, 5);

    const k = suave(this.mistura);
    const fora = this.fora ? (typeof this.fora === 'function' ? this.fora() : this.fora) : null;
    if (fora && k < 1) {
      this.deFora.copy(fora.de).lerp(this.olho, k);
      this.paraFora.copy(fora.para).lerp(this.mira, k);
      this.g.setCameraOmbro(this.deFora, this.paraFora);
    } else {
      this.g.setCameraOmbro(this.olho, this.mira);
    }
    // o que acompanha a câmera (o celular na mão): na frente dela, um pouco abaixo e para o lado
    if (this.anexo) {
      const cam = k < 1 && fora ? this.deFora : this.olho;
      const alvo = k < 1 && fora ? this.paraFora : this.mira;
      const frente = new THREE.Vector3().subVectors(alvo, cam).normalize();
      this.direitaCam.crossVectors(frente, this.cima).normalize();
      this.cimaCam.crossVectors(this.direitaCam, frente).normalize();
      const { obj, direita, baixo, frente: dist } = this.anexo;
      obj.position.copy(cam).addScaledVector(frente, dist).addScaledVector(this.direitaCam, direita).addScaledVector(this.cimaCam, -baixo);
      obj.lookAt(cam);
    }
    // a cabeça some quando a câmera já está quase dentro dela, e volta quando ela sai
    this.g.mostrarCabeca(this.quem, this.mistura < 0.8);

    if (this.mistura === this.alvoDaMistura && this.fim) {
      const fim = this.fim;
      this.fim = null;
      if (this.alvoDaMistura === 0) {
        this.ligada = false;
        this.g.mostrarCabeca(this.quem, true);
        this.anexar(null);
        if (this.devolverIsometrica) this.g.setCameraOmbro(null);
      }
      fim();
    }
  }
}
