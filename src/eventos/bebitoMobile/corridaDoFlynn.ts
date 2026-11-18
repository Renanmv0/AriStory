import * as THREE from 'three';
import { Flynn } from '../../entities/bichos/Flynn';

/**
 * A CORRIDA MATINAL DO FLYNN (`docs/CARROS-DA-ESCOLA.md` §3, a escolha do
 * Renan): o Flynn não tem carro. Ele vem A PÉ, pela calçada da direita, e
 * passa o Bebito correndo — mais rápido que o carro. Lá na frente ele para,
 * trota no lugar para não esfriar, conversa ("não posso ficar atrás dos meus
 * rivais") e pede um TOCA AQUI pela janela de quem vai de carona. Depois
 * dispara e some na frente.
 *
 * Faz o papel de "veículo" do `EncontroNaEstrada` com o mesmo contrato dos
 * carros: um `group` com a base em `y = 0` e a frente em `+Z`, posto pela
 * cena, e o `update(dt, distancia, conversando)`. Quem anda é a cena; a
 * distância de cada quadro vira a velocidade, e a velocidade vira a passada
 * (`Flynn.naEstrada`). O lado `+X` dele é o do Bebito (ele corre à direita do
 * carro): é a pata desse lado que sobe no toca aqui.
 */
export class CorridaDoFlynn {
  readonly group = new THREE.Group();
  readonly flynn: Flynn;
  /** a pose da estrada, que a cena escreve e o Flynn lê */
  private readonly pose = { corrida: 0, trote: false, tocaAqui: 0, estica: 0 };
  /** para onde a pata vai (0 baixa, 1 erguida) e o tapa (0 a 1) */
  private alvoDoToca = 0;
  private tapa = -1;
  /** a velocidade de agora, suavizada (m/s): a distância de um quadro só pula com o quadro perdido */
  private velocidade = 0;
  /** quantos tapas já saíram (o teste conta) */
  tapas = 0;

  constructor() {
    this.group.userData.peca = 'corrida-do-flynn';
    this.flynn = new Flynn({ minX: -0.1, maxX: 0.1, minZ: -0.1, maxZ: 0.1 });
    this.flynn.entrarEmServico();
    this.flynn.naEstrada = this.pose;
    this.group.add(this.flynn.group);
  }

  /** ergue (ou abaixa) a pata do lado do Bebito, aberta: o "toca aqui!" */
  erguerAPata(sim: boolean): void {
    this.alvoDoToca = sim ? 1 : 0;
  }

  /** o tapa: a pata abre até a mão da janela, segura e volta (0,7 s) */
  bater(): void {
    this.tapa = 0;
    this.tapas++;
  }

  /** a ponta da pata do toca aqui, no mundo */
  pata(alvo = new THREE.Vector3()): THREE.Vector3 {
    return this.flynn.pataDoToca(alvo);
  }

  /** comemorar com os dois punhos para cima (o tapa certinho) */
  comemorar(): void {
    this.flynn.comemorar(1.6);
  }

  update(dt: number, distancia: number, conversando: boolean): void {
    if (dt > 0) this.velocidade += (distancia / dt - this.velocidade) * Math.min(1, dt * 6);
    const p = this.pose;
    p.corrida = this.velocidade / 7;
    // parado na conversa, ele trota no lugar: corrida matinal não pode esfriar
    p.trote = conversando || this.velocidade < 0.35;
    p.tocaAqui += (this.alvoDoToca - p.tocaAqui) * Math.min(1, dt * 6);
    if (this.tapa >= 0) {
      this.tapa += dt;
      // vai rápido (0,16 s), segura as mãos juntas um instante e volta devagar
      const k = this.tapa;
      p.estica = k < 0.16 ? k / 0.16 : k < 0.45 ? 1 : Math.max(0, 1 - (k - 0.45) / 0.25);
      if (k > 0.7) { this.tapa = -1; p.estica = 0; }
    }
    this.flynn.update(dt);
  }
}
