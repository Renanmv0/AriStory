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
 * positivo**.
 *
 * ## A rebatida (mira manual, sem correção automática)
 *
 * A bolinha NUNCA é mirada pelo jogo. O que a raquete faz no instante do toque
 * é o que a bolinha obedece — o jogo só impõe teto e piso em cada eixo, para
 * que um repelão de mouse não a mande para outro bairro:
 *
 * - **z (mira lateral)**: `v.z` vira `z atual × 0.25 + velocidade lateral da
 *   raquete × 0.20`, preso em ±1.05. Esse teto não é gosto: com a bola levando
 *   ~0,62 s até quicar do outro lado, 1,05 × 0,62 ≈ 0,65, que é exatamente a
 *   meia-largura útil do tampo. Mirar mais aberto que isso é escolher jogar
 *   fora, e agora a regra pune isso corretamente.
 * - **y (altura)**: `1.9 − (altura do toque − 0.9) × 1.5 + subida da raquete ×
 *   0.12`, preso entre 0,75 e 2,4. Bater com a raquete alta manda reta; bater
 *   por baixo levanta. A parte linear é a solução da parábola: para g = 6,6 e
 *   0,62 s de voo, a velocidade vertical que deixa a bola exatamente no tampo
 *   adversário é `(2,08 − y) / 0,62`, e a reta acima acompanha isso com erro de
 *   centímetros na faixa jogável.
 * - **x (força)**: base 3,5 mais 0,05 por unidade de energia do movimento,
 *   preso entre 2,9 e 4,4. Mexer mais rápido bate mais forte, mas o rali não
 *   vira pingue-pongue de foguete.
 *
 * ## A pontuação (regra de verdade, contada por quique)
 *
 * Quem rebateu vira `rebatedor`. A partir daí:
 * - quique no campo do adversário → conta; **o segundo quique seguido** é ponto
 *   de quem bateu (o outro não devolveu);
 * - quique no próprio campo depois de bater → a bola não passou a rede, ponto
 *   do adversário;
 * - bola no chão ou fora → se já tinha quicado no campo certo, ponto de quem
 *   bateu; se não, foi erro de quem bateu e o ponto é do adversário;
 * - bola na rede → ponto do adversário de quem bateu.
 */

/** medidas do tampo (têm que bater com `mesaPingPong()` em props.ts) */
const TAMPO = { largura: 2.6, profundidade: 1.4, altura: 0.76 };
const RAIO_BOLA = 0.055;
/** o plano onde cada raquete rebate, medido do centro da mesa */
const PLANO_RAQUETE = TAMPO.largura / 2 + 0.22;
/** passou daqui e não volta mais */
const FUNDO = PLANO_RAQUETE + 0.9;
const RAIO_RAQUETE = 0.28;
/** topo da rede: bola que cruza o meio abaixo disto bate nela */
const REDE = TAMPO.altura + 0.19;

const GRAVIDADE = 6.6;
/** quanto a bolinha devolve ao quicar no tampo */
const QUIQUE = 0.72;
/** meia largura em que a raquete pode passear */
const ALCANCE_Z = TAMPO.profundidade / 2 + 0.12;

/** limites da rebatida — ver o bloco de comentário no topo */
const REBATE = {
  vxBase: 3.5,
  vxMin: 2.9,
  vxMax: 4.4,
  /** o quanto a energia do movimento vira velocidade de ida */
  energiaParaVx: 0.05,
  vyBase: 1.9,
  /** quanto a altura do toque tira de subida */
  alturaParaVy: 1.5,
  subidaParaVy: 0.12,
  vyMin: 0.75,
  vyMax: 2.4,
  heranca: 0.25,
  lateralParaVz: 0.2,
  vzMax: 1.05,
  /** teto da leitura da raquete: mouse jogado não vira canhão */
  velocidadeMaximaRaquete: 6,
};

export type FasePing = 'parado' | 'sacando' | 'jogando' | 'ponto' | 'fim';
type Lado = 'eu' | 'ele';

export class PingPong {
  /** tudo (bolinha e raquetes) mora aqui dentro, em coordenada local da mesa */
  readonly grupo = new THREE.Group();

  readonly bola: THREE.Mesh;
  readonly minhaRaquete: THREE.Group;
  readonly raqueteDele: THREE.Group;

  fase: FasePing = 'parado';
  meus = 0;
  dele = 0;
  readonly alvo: number;

  onSom: ((nome: 'pegar' | 'quicar' | 'lancar' | 'toast') => void) | null = null;
  onPonto: ((meu: boolean, motivo: string) => void) | null = null;
  onFim: ((ganhei: boolean) => void) | null = null;

  private readonly v = new THREE.Vector3();
  private espera = 0;
  private sacaEu = true;

  // ------------------------------------------------- estado da jogada atual
  /** quem bateu por último; é dele a responsabilidade pela bola no ar */
  private rebatedor: Lado = 'eu';
  /** quiques dados no campo do ADVERSÁRIO do rebatedor */
  private quiquesNoAlvo = 0;

  // ------------------------------------------ leitura do movimento da mão
  private lateralRaquete = 0;
  private subidaRaquete = 0;
  private zAnterior = 0;
  private yAnterior = 0;

  /** erro que o parceiro está cometendo nesta troca */
  private erroDele = 0;

  constructor(alvo = 5) {
    this.alvo = alvo;

    this.bola = bolinhaPingPong();
    this.grupo.add(this.bola);

    this.minhaRaquete = raquete(P.metalRed);
    this.raqueteDele = raquete(P.fabricBlue);
    // `raquete()` nasce com a face encarando +Z e o cabo para baixo. Girar em Y
    // põe a face encarando o eixo X, que é por onde a bolinha vem — girar em Z
    // (o erro óbvio) só roda o cabo e deixa o disco de perfil, invisível.
    this.minhaRaquete.rotation.y = Math.PI / 2;
    this.raqueteDele.rotation.y = -Math.PI / 2;
    this.minhaRaquete.scale.setScalar(1.15);
    this.raqueteDele.scale.setScalar(1.15);
    this.grupo.add(this.minhaRaquete, this.raqueteDele);

    this.resetar();
  }

  comecar(): void {
    this.meus = 0;
    this.dele = 0;
    this.sacaEu = true;
    this.resetar();
  }

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
    this.yAnterior = TAMPO.altura + 0.3;
    this.lateralRaquete = 0;
    this.subidaRaquete = 0;
    this.sortearErro();
  }

  /** O parceiro erra de propósito, mas nunca no mesmo lugar. */
  private sortearErro(): void {
    const feio = Math.random() < 0.25;
    this.erroDele = (Math.random() - 0.5) * (feio ? 1.5 : 0.5);
  }

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
    this.rebatedor = this.sacaEu ? 'eu' : 'ele';
    this.quiquesNoAlvo = 0;
    this.v.set(this.sacaEu ? 3.4 : -3.4, 1.45, (Math.random() - 0.5) * 0.6);
    this.onSom?.('lancar');
  }

  // ----------------------------------------------------------- as raquetes

  private moverMinhaRaquete(dt: number, mira: { x: number; y: number }): void {
    // o ponteiro manda direto: x da tela vira largura da mesa, y vira altura.
    // Sem suavização de mira — atraso aqui vira "a raquete não obedece".
    const alvoZ = THREE.MathUtils.clamp(mira.x * ALCANCE_Z, -ALCANCE_Z, ALCANCE_Z);
    const alvoY = TAMPO.altura + 0.16 + THREE.MathUtils.clamp((mira.y + 0.35) * 0.6, 0, 0.75);
    this.minhaRaquete.position.z += (alvoZ - this.minhaRaquete.position.z) * Math.min(1, dt * 18);
    this.minhaRaquete.position.y += (alvoY - this.minhaRaquete.position.y) * Math.min(1, dt * 14);

    // velocidade da mão neste frame — é o que a rebatida transfere para a bola
    const teto = REBATE.velocidadeMaximaRaquete;
    if (dt > 0) {
      this.lateralRaquete = THREE.MathUtils.clamp(
        (this.minhaRaquete.position.z - this.zAnterior) / dt, -teto, teto,
      );
      this.subidaRaquete = THREE.MathUtils.clamp(
        (this.minhaRaquete.position.y - this.yAnterior) / dt, -teto, teto,
      );
    }
    this.zAnterior = this.minhaRaquete.position.z;
    this.yAnterior = this.minhaRaquete.position.y;
  }

  private moverRaqueteDele(dt: number): void {
    // Ele persegue o Z da bolinha, mas com atraso e com o erro da troca. É o
    // atraso que o faz errar: perseguição instantânea seria uma parede.
    const indoParaEle = this.v.x > 0;
    const alvo = indoParaEle ? this.bola.position.z + this.erroDele : 0;
    // rápido o bastante para alcançar bola angulada — senão quem mira bem faz
    // 5 a 0 e o rali nunca acontece. Quem dá chance ao jogador é o erro
    // sorteado, não a lentidão da mão dele.
    const rapidez = indoParaEle ? 4.6 : 1.6;
    this.raqueteDele.position.z += (alvo - this.raqueteDele.position.z) * Math.min(1, dt * rapidez);
    this.raqueteDele.position.z = THREE.MathUtils.clamp(this.raqueteDele.position.z, -ALCANCE_Z, ALCANCE_Z);

    // acompanha a altura da bola quando ela chega, para conseguir devolver
    const alvoY = indoParaEle
      ? THREE.MathUtils.clamp(this.bola.position.y, TAMPO.altura + 0.16, TAMPO.altura + 0.9)
      : TAMPO.altura + 0.3;
    this.raqueteDele.position.y += (alvoY - this.raqueteDele.position.y) * Math.min(1, dt * 4);
  }

  // -------------------------------------------------------------- o voo

  private voar(dt: number): void {
    const b = this.bola.position;
    const antesX = b.x;

    this.v.y -= GRAVIDADE * dt;
    b.addScaledVector(this.v, dt);

    // --------------------------------------------------------------- rede
    const cruzouOMeio = (antesX < 0 && b.x >= 0) || (antesX > 0 && b.x <= 0);
    if (cruzouOMeio && b.y < REDE) {
      this.onSom?.('quicar');
      this.marcar(this.rebatedor === 'ele', 'na rede');
      return;
    }

    // ------------------------------------------------------ quique no tampo
    const chao = TAMPO.altura + RAIO_BOLA;
    const sobreMesa =
      Math.abs(b.x) <= TAMPO.largura / 2 && Math.abs(b.z) <= TAMPO.profundidade / 2;
    if (b.y <= chao && this.v.y < 0 && sobreMesa) {
      b.y = chao;
      this.v.y = -this.v.y * QUIQUE;
      this.onSom?.('quicar');

      const ladoDoQuique: Lado = b.x < 0 ? 'eu' : 'ele';
      if (ladoDoQuique === this.rebatedor) {
        // bateu e a bola caiu no próprio campo: não passou a rede
        this.marcar(this.rebatedor === 'ele', 'quique no próprio campo');
        return;
      }
      this.quiquesNoAlvo += 1;
      if (this.quiquesNoAlvo >= 2) {
        // deixou quicar duas vezes: quem bateu ganha o ponto
        this.marcar(this.rebatedor === 'eu', 'dois quiques');
        return;
      }
    }

    // ---------------------------------------------------- rebate na raquete
    for (const [lado, raq, dono] of [
      [-1, this.minhaRaquete, 'eu'],
      [1, this.raqueteDele, 'ele'],
    ] as const) {
      const plano = lado * PLANO_RAQUETE;
      const cruzou = lado < 0 ? antesX > plano && b.x <= plano : antesX < plano && b.x >= plano;
      if (!cruzou) continue;
      if (this.rebatedor === dono) continue; // não se rebate a própria bola

      const perto =
        Math.abs(b.z - raq.position.z) < RAIO_RAQUETE &&
        Math.abs(b.y - raq.position.y) < RAIO_RAQUETE;
      if (!perto) continue;

      b.x = plano;
      this.rebater(dono === 'eu' ? 1 : -1, raq.position.y, dono === 'eu');
      this.rebatedor = dono;
      this.quiquesNoAlvo = 0;
      this.onSom?.('pegar');
      if (dono === 'ele') this.sortearErro();
    }

    // ------------------------------------------------------------- ponto
    const foraDeCampo = b.y < 0.12 || Math.abs(b.x) > FUNDO || Math.abs(b.z) > 2.2;
    if (foraDeCampo) {
      if (this.quiquesNoAlvo >= 1) {
        // quicou certo e o outro não alcançou
        this.marcar(this.rebatedor === 'eu', 'não alcançou');
      } else {
        // quem bateu mandou para fora sem tocar o campo adversário
        this.marcar(this.rebatedor === 'ele', 'fora');
      }
    }
  }

  /**
   * O toque na raquete. Toda a energia vem do movimento da mão; o jogo só
   * impõe os limites documentados no topo do arquivo.
   *
   * @param direcao +1 manda para o campo do parceiro, -1 para o meu
   * @param alturaDoToque y em que a raquete encontrou a bola
   * @param minha quem bateu fui eu? (o parceiro tem a própria mira)
   */
  private rebater(direcao: number, alturaDoToque: number, minha: boolean): void {
    const lateral = minha ? this.lateralRaquete : this.miraDoParceiro();
    const subida = minha ? this.subidaRaquete : 0;
    const energia = Math.abs(lateral) + Math.abs(subida);

    const vx = THREE.MathUtils.clamp(
      REBATE.vxBase + energia * REBATE.energiaParaVx,
      REBATE.vxMin,
      REBATE.vxMax,
    );
    const vy = THREE.MathUtils.clamp(
      REBATE.vyBase -
        (alturaDoToque - (TAMPO.altura + 0.14)) * REBATE.alturaParaVy +
        subida * REBATE.subidaParaVy,
      REBATE.vyMin,
      REBATE.vyMax,
    );
    const vz = THREE.MathUtils.clamp(
      this.v.z * REBATE.heranca + lateral * REBATE.lateralParaVz,
      -REBATE.vzMax,
      REBATE.vzMax,
    );

    this.v.set(direcao * vx, vy, vz);
  }

  /**
   * A "mão" do parceiro: ele mira para o meio do meu campo, com um desvio.
   * De vez em quando o desvio é grande o bastante para a bola sair — é o erro
   * não forçado dele, e a regra cobra igual à minha.
   */
  private miraDoParceiro(): number {
    const paraOMeio = -this.bola.position.z * 1.2;
    const desvio = (Math.random() - 0.5) * 2.4;
    return THREE.MathUtils.clamp(paraOMeio + desvio, -4, 4);
  }

  private marcar(meuPonto: boolean, motivo: string): void {
    if (meuPonto) this.meus += 1;
    else this.dele += 1;
    this.sacaEu = !meuPonto; // quem tomou o ponto saca
    this.onPonto?.(meuPonto, motivo);

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
