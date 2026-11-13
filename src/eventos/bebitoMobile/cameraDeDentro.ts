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
  /** sentado (primeira pessoa) ou deitado (tomada dos dois de cima) */
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

  /** encostar no ombro de quem dirige (0 a 1), com tomada dos dois de frente */
  encostar = 0;
  private encostado = 0;
  private especial = 0;
  private tomadaEspecial: 'ombro' | 'descanso' = 'ombro';
  private readonly olhoFinal = new THREE.Vector3();
  private readonly miraFinal = new THREE.Vector3();
  /** a tomada temporária: a primeira pessoa continua sendo o repouso */
  get enquadramento(): 'olhos' | 'ombro' | 'descanso' {
    return this.postura === 'deitado' ? 'descanso' : this.encostar > 0 || this.encostado > 0.01 ? 'ombro' : 'olhos';
  }
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
    this.encostar = this.encostado = this.especial = 0;
    this.carro.mostrarTeto(true);
    this.g.encostarNoCarro(this.quem, 0);
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
    if (this.enquadramento !== 'olhos' || this.especial > 0.01) return;
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
    // O gesto existe no corpo: a tomada de frente permite ver os dois.
    this.encostado += (this.encostar - this.encostado) * (1 - Math.exp(-5 * dt));
    this.g.encostarNoCarro(this.quem, this.encostado);
    if (!this.lido) {
      this.olho.copy(alvoDoOlho);
      this.lido = true;
    } else {
      this.olho.lerp(alvoDoOlho, 1 - Math.exp(-14 * dt));
    }
    this.mira.copy(this.olho).addScaledVector(this.dir, 5);

    // Tomadas no referencial do carro: acompanham as curvas e as molas.
    const alvoEspecial = this.postura === 'deitado' || this.encostar > 0 ? 1 : 0;
    if (alvoEspecial) this.tomadaEspecial = this.postura === 'deitado' ? 'descanso' : 'ombro';
    const descanso = this.tomadaEspecial === 'descanso';
    this.especial += Math.sign(alvoEspecial - this.especial) * Math.min(Math.abs(alvoEspecial - this.especial), dt / 1.1);
    const kEspecial = suave(this.especial);
    this.olhoFinal.copy(this.olho);
    this.miraFinal.copy(this.mira);
    let campoDeVisao = 58;
    if (this.especial > 0) {
      const aspecto = typeof window === 'undefined' ? 1.5 : window.innerWidth / window.innerHeight;
      const para = descanso
        ? this.carro.cama.localToWorld(new THREE.Vector3(0, 0.8, 0))
        : this.g.cabecaDe('jogador').add(this.g.cabecaDe('parceiro')).multiplyScalar(0.5);
      // A tomada fica abaixo do pergolado. A lente abre para caberem os dois no celular.
      const distancia = descanso ? 2 : Math.max(2.45, 1.45 / aspecto);
      if (descanso) {
        const lente = THREE.MathUtils.radToDeg(2 * Math.atan(Math.max(1.5, 1.2 / aspecto) / distancia));
        campoDeVisao += (lente - 58) * kEspecial * suave(this.mistura);
      }
      // Um pequeno deslocamento frontal evita que o Jean-Luc do painel tape o rosto do passageiro.
      const deslocamento = descanso
        ? new THREE.Vector3(0, distancia, 0.35)
        : new THREE.Vector3(-0.75, 0.75, distancia);
      deslocamento.applyQuaternion(this.q);
      this.olhoFinal.lerp(para.clone().add(deslocamento), kEspecial);
      this.miraFinal.lerp(para, kEspecial);
    }
    // Como na barraca: corte visual do teto durante a tomada de cima, sem abrir uma capota.
    this.carro.mostrarTeto(!(descanso && this.especial > 0.05));

    const k = suave(this.mistura);
    const fora = this.fora ? (typeof this.fora === 'function' ? this.fora() : this.fora) : null;
    if (fora && k < 1) {
      this.deFora.copy(fora.de).lerp(this.olhoFinal, k);
      this.paraFora.copy(fora.para).lerp(this.miraFinal, k);
      this.g.setCameraOmbro(this.deFora, this.paraFora, campoDeVisao);
    } else {
      this.g.setCameraOmbro(this.olhoFinal, this.miraFinal, campoDeVisao);
    }
    // o que acompanha a câmera (o celular na mão): na frente dela, um pouco abaixo e para o lado
    if (this.anexo) {
      const cam = k < 1 && fora ? this.deFora : this.olhoFinal;
      const alvo = k < 1 && fora ? this.paraFora : this.miraFinal;
      const frente = new THREE.Vector3().subVectors(alvo, cam).normalize();
      this.direitaCam.crossVectors(frente, this.cima).normalize();
      this.cimaCam.crossVectors(this.direitaCam, frente).normalize();
      const { obj, direita, baixo, frente: dist } = this.anexo;
      obj.position.copy(cam).addScaledVector(frente, dist).addScaledVector(this.direitaCam, direita).addScaledVector(this.cimaCam, -baixo);
      obj.lookAt(cam);
    }
    // a cabeça some quando a câmera já está quase dentro dela, e volta quando ela sai
    this.g.mostrarCabeca(this.quem, this.mistura < 0.8 || this.especial > 0.3);

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
