import * as THREE from 'three';
import { bolinhaPingPong, raquete } from '../world/props';
import { PALETTE as P } from '../palette';

/**
 * A partida de ping pong.
 *
 * **Tudo aqui vive no espaço LOCAL da mesa**, e é essa a decisão que faz a
 * classe caber numa cabeça só: a mesa está plantada girada no parque, mas
 * dentro dela o mundo é reto — `x` é o comprimento (a direção em que a bolinha
 * viaja), `y` é a altura e `z` é a largura. Ninguém aqui precisa saber o ângulo
 * da mesa; quem resolve isso é o `Object3D` pai.
 *
 * Convenção dos lados: **o jogador fica em x negativo, o parceiro em x
 * positivo**. `LADO_EU = -1`, `LADO_ELE = +1`.
 */

/** medidas do tampo (têm que bater com `mesaPingPong()` em props.ts) */
const TAMPO = { largura: 2.6, profundidade: 1.4, altura: 0.76 };
const RAIO_BOLA = 0.055;
/** o plano onde cada raquete rebate, medido do centro da mesa */
const PLANO_RAQUETE = TAMPO.largura / 2 + 0.22;
/** ponto perdido: a bolinha passou da raquete e não volta mais */
const FUNDO = PLANO_RAQUETE + 0.9;
const RAIO_RAQUETE = 0.26;

const GRAVIDADE = 5.4;
/** quanto a bolinha devolve ao quicar no tampo */
const QUIQUE = 0.72;
/** meia largura em que a raquete pode passear */
const ALCANCE_Z = TAMPO.profundidade / 2 + 0.12;

export type FasePing = 'parado' | 'sacando' | 'jogando' | 'ponto' | 'fim';

export interface EstadoPing {
  fase: FasePing;
  meus: number;
  dele: number;
}

export class PingPong {
  /** tudo (bolinha e raquetes) mora aqui dentro, em coordenada local da mesa */
  readonly grupo = new THREE.Group();

  readonly bola: THREE.Mesh;
  readonly minhaRaquete: THREE.Group;
  readonly raqueteDele: THREE.Group;

  fase: FasePing = 'parado';
  meus = 0;
  dele = 0;
  /** quantos pontos fecham a partida */
  readonly alvo: number;

  /** avisos para a cena: som, fala, fim de jogo */
  onSom: ((nome: 'pegar' | 'quicar' | 'lancar' | 'toast') => void) | null = null;
  onPonto: ((meu: boolean) => void) | null = null;
  onFim: ((ganhei: boolean) => void) | null = null;

  private readonly v = new THREE.Vector3();
  private espera = 0;
  /** de quem é o saque: alterna a cada ponto */
  private sacaEu = true;
  /** erro que o parceiro está cometendo nesta troca (é o que o faz perder) */
  private erroDele = 0;
  /** velocidade lateral da minha raquete, para dar efeito na rebatida */
  private deslocamentoZ = 0;
  private zAnterior = 0;

  constructor(alvo = 5) {
    this.alvo = alvo;

    this.bola = bolinhaPingPong();
    this.grupo.add(this.bola);

    this.minhaRaquete = raquete(P.metalRed);
    this.raqueteDele = raquete(P.fabricBlue);
    // `raquete()` nasce com a face encarando +Z e o cabo para baixo. Girar em Y
    // põe a face encarando o eixo X, que é por onde a bolinha vem — girar em Z
    // (o erro óbvio) só roda o cabo e deixa a raquete de perfil, invisível.
    this.minhaRaquete.rotation.y = Math.PI / 2;
    this.raqueteDele.rotation.y = -Math.PI / 2;
    this.minhaRaquete.scale.setScalar(1.15);
    this.raqueteDele.scale.setScalar(1.15);
    this.grupo.add(this.minhaRaquete, this.raqueteDele);

    this.resetar();
  }

  get estado(): EstadoPing {
    return { fase: this.fase, meus: this.meus, dele: this.dele };
  }

  /** Começa uma partida do zero. */
  comecar(): void {
    this.meus = 0;
    this.dele = 0;
    this.sacaEu = true;
    this.resetar();
  }

  /** Some com tudo (fim de partida ou saída da mesa). */
  guardar(): void {
    this.fase = 'parado';
    this.grupo.visible = false;
  }

  private resetar(): void {
    this.fase = 'sacando';
    this.espera = 1.1;
    this.grupo.visible = true;
    const lado = this.sacaEu ? -1 : 1;
    this.bola.position.set(lado * (TAMPO.largura / 2 - 0.3), TAMPO.altura + 0.45, 0);
    this.v.set(0, 0, 0);
    this.minhaRaquete.position.set(-PLANO_RAQUETE, TAMPO.altura + 0.3, 0);
    this.raqueteDele.position.set(PLANO_RAQUETE, TAMPO.altura + 0.3, 0);
    this.zAnterior = 0;
    this.sortearErro();
  }

  /** O parceiro erra de propósito, mas nunca no mesmo lugar. */
  private sortearErro(): void {
    // 25% das trocas ele fica com um erro grande o bastante para perder o ponto
    const feio = Math.random() < 0.25;
    this.erroDele = (Math.random() - 0.5) * (feio ? 1.5 : 0.5);
  }

  /**
   * @param mira ponteiro em -1..1 (x da tela, y da tela) — move a minha raquete
   * @param dt segundos
   */
  update(dt: number, mira: { x: number; y: number }): void {
    if (this.fase === 'parado' || this.fase === 'fim') return;

    this.moverMinhaRaquete(dt, mira);
    this.moverRaqueteDele(dt);

    if (this.fase === 'ponto' || this.fase === 'sacando') {
      this.espera -= dt;
      if (this.espera <= 0) {
        if (this.fase === 'ponto') this.resetar();
        else this.sacar();
      }
      return;
    }

    this.voar(dt);
  }

  private sacar(): void {
    this.fase = 'jogando';
    const paraEle = this.sacaEu;
    this.v.set(paraEle ? 3.4 : -3.4, 1.5, (Math.random() - 0.5) * 0.7);
    this.onSom?.('lancar');
  }

  private moverMinhaRaquete(dt: number, mira: { x: number; y: number }): void {
    // o ponteiro manda direto: x da tela vira largura da mesa, y vira altura.
    // Sem suavização — atraso aqui vira "a raquete não obedece".
    const alvoZ = THREE.MathUtils.clamp(mira.x * ALCANCE_Z, -ALCANCE_Z, ALCANCE_Z);
    const alvoY = TAMPO.altura + 0.16 + THREE.MathUtils.clamp((mira.y + 0.35) * 0.6, 0, 0.75);
    this.minhaRaquete.position.z += (alvoZ - this.minhaRaquete.position.z) * Math.min(1, dt * 18);
    this.minhaRaquete.position.y += (alvoY - this.minhaRaquete.position.y) * Math.min(1, dt * 14);

    // quanto a raquete andou de lado neste frame: é o efeito que vai para a bola
    const dz = this.minhaRaquete.position.z - this.zAnterior;
    this.zAnterior = this.minhaRaquete.position.z;
    this.deslocamentoZ = dt > 0 ? dz / dt : 0;
  }

  private moverRaqueteDele(dt: number): void {
    // Ele persegue o Z da bolinha, mas com atraso e com o erro da troca. É o
    // atraso que o faz errar: perseguição instantânea seria uma parede.
    const indoParaEle = this.v.x > 0;
    const alvo = indoParaEle ? this.bola.position.z + this.erroDele : 0;
    const rapidez = indoParaEle ? 3.4 : 1.6;
    this.raqueteDele.position.z += (alvo - this.raqueteDele.position.z) * Math.min(1, dt * rapidez);
    this.raqueteDele.position.z = THREE.MathUtils.clamp(this.raqueteDele.position.z, -ALCANCE_Z, ALCANCE_Z);

    const alvoY = TAMPO.altura + 0.3;
    this.raqueteDele.position.y += (alvoY - this.raqueteDele.position.y) * Math.min(1, dt * 6);
  }

  private voar(dt: number): void {
    const b = this.bola.position;
    const antesX = b.x;

    this.v.y -= GRAVIDADE * dt;
    b.addScaledVector(this.v, dt);

    // ------------------------------------------------------ quique no tampo
    const chao = TAMPO.altura + RAIO_BOLA;
    const sobreMesa =
      Math.abs(b.x) <= TAMPO.largura / 2 && Math.abs(b.z) <= TAMPO.profundidade / 2;
    if (b.y <= chao && this.v.y < 0 && sobreMesa) {
      b.y = chao;
      this.v.y = -this.v.y * QUIQUE;
      this.onSom?.('quicar');
    }

    // ---------------------------------------------------- rebate na raquete
    for (const [lado, raq, minha] of [
      [-1, this.minhaRaquete, true],
      [1, this.raqueteDele, false],
    ] as const) {
      const plano = lado * PLANO_RAQUETE;
      const cruzou = lado < 0 ? antesX > plano && b.x <= plano : antesX < plano && b.x >= plano;
      if (!cruzou) continue;

      const perto =
        Math.abs(b.z - raq.position.z) < RAIO_RAQUETE &&
        Math.abs(b.y - raq.position.y) < RAIO_RAQUETE;
      if (!perto) continue;

      b.x = plano;
      this.v.x = -this.v.x * 1.04; // devolve um tico mais rápido a cada troca
      // efeito: a raquete andando de lado joga a bola para o lado
      const efeito = minha ? this.deslocamentoZ * 0.28 : (Math.random() - 0.5) * 1.2;
      this.v.z = THREE.MathUtils.clamp(this.v.z * 0.6 + efeito, -2.2, 2.2);
      // altura da rebatida: bate embaixo, sobe mais
      const alto = (raq.position.y - b.y) * 1.6;
      this.v.y = Math.max(1.1, Math.abs(this.v.y) * 0.5 + 1.2 - alto);
      this.onSom?.('pegar');
      if (!minha) this.sortearErro();
    }

    // ------------------------------------------------------------- ponto
    const caiu = b.y < 0.12;
    if (caiu || Math.abs(b.x) > FUNDO) {
      // quem perde é o dono do lado por onde ela escapou
      this.marcar(b.x > 0);
    }
  }

  private marcar(meuPonto: boolean): void {
    if (meuPonto) this.meus += 1;
    else this.dele += 1;
    this.sacaEu = !meuPonto; // quem tomou o ponto saca
    this.onPonto?.(meuPonto);

    if (this.meus >= this.alvo || this.dele >= this.alvo) {
      this.fase = 'fim';
      this.onFim?.(this.meus >= this.alvo);
      return;
    }
    this.fase = 'ponto';
    this.espera = 1.3;
  }
}

/** Medidas da mesa, para a cena posicionar os personagens nos lados certos. */
export const MESA_PING = { ...TAMPO, plano: PLANO_RAQUETE };
