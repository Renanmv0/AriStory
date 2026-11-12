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

const suave = (t: number): number => t * t * (3 - 2 * t);

/** o pescoço: quanto se vira para cada lado, e quanto se olha para cima e para baixo */
export const PESCOCO = { giro: 2.2, cima: 0.62, baixo: -0.75 } as const;

export class CameraDeDentro {
  /** o pescoço: 0 é a frente do carro, positivo vira para a esquerda do carro, negativo para a direita */
  giro = 0;
  altura = -0.05;
  private ligada = false;
  /** 0 é a tomada de fora, 1 é o olho */
  private mistura = 1;
  private alvoDaMistura = 1;
  private duracao = 1;
  private fora: TomadaDeFora | null = null;
  private fim: (() => void) | null = null;
  private readonly olho = new THREE.Vector3();
  private readonly mira = new THREE.Vector3();
  private lido = false;
  private readonly cabeca = new THREE.Vector3();
  private readonly dir = new THREE.Vector3();
  private readonly deFora = new THREE.Vector3();
  private readonly paraFora = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();

  constructor(
    private readonly g: GameAPI,
    private readonly carro: BebitoMobile,
    private readonly quem: 'jogador' | 'parceiro' = 'jogador',
  ) {}

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
  ligar(de: TomadaDeFora, dura = 1.2): Promise<void> {
    this.ligada = true;
    this.lido = false;
    this.fora = { de: de.de.clone(), para: de.para.clone() };
    this.mistura = 0;
    this.alvoDaMistura = 1;
    this.duracao = Math.max(0.01, dura);
    return new Promise((pronto) => { this.fim = pronto; });
  }

  /** Desliga: do olho, a câmera DESLIZA até a tomada de fora em `dura` segundos e a de sempre volta. */
  desligar(para: TomadaDeFora, dura = 1.1): Promise<void> {
    if (!this.ligada) return Promise.resolve();
    this.fora = { de: para.de.clone(), para: para.para.clone() };
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
    this.g.setCameraOmbro(null);
    this.fim?.();
    this.fim = null;
  }

  /** o olhar de um quadro: o manche gira o pescoço (o `g.olharLivre()`), com limite */
  olhar(dt: number): void {
    const m = this.g.olharLivre();
    this.giro = THREE.MathUtils.clamp(this.giro - m.x * 1.5 * dt, -PESCOCO.giro, PESCOCO.giro);
    this.altura = THREE.MathUtils.clamp(this.altura + m.y * 0.9 * dt, PESCOCO.baixo, PESCOCO.cima);
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
    if (!this.lido) {
      this.olho.copy(alvoDoOlho);
      this.lido = true;
    } else {
      this.olho.lerp(alvoDoOlho, 1 - Math.exp(-14 * dt));
    }
    this.mira.copy(this.olho).addScaledVector(this.dir, 5);

    const k = suave(this.mistura);
    if (this.fora && k < 1) {
      this.deFora.copy(this.fora.de).lerp(this.olho, k);
      this.paraFora.copy(this.fora.para).lerp(this.mira, k);
      this.g.setCameraOmbro(this.deFora, this.paraFora);
    } else {
      this.g.setCameraOmbro(this.olho, this.mira);
    }
    // a cabeça some quando a câmera já está quase dentro dela, e volta quando ela sai
    this.g.mostrarCabeca(this.quem, this.mistura < 0.8);

    if (this.mistura === this.alvoDaMistura && this.fim) {
      const fim = this.fim;
      this.fim = null;
      if (this.alvoDaMistura === 0) {
        this.ligada = false;
        this.g.mostrarCabeca(this.quem, true);
        this.g.setCameraOmbro(null);
      }
      fim();
    }
  }
}
