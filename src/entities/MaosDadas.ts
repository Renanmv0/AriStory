import type { Player } from './Player';
import type { Companion } from './Companion';
import type { Coracoes } from './Coracoes';

/**
 * Deslocamento lateral entre os dois enquanto andam de maos dadas.
 *
 * O braco tem ~0.48 e a mao cai a ~0.44 abaixo do ombro. A 1.2 de distancia os
 * ombros de dentro ficam ~0.86 apart e cada mao teria que andar 0.43 na
 * horizontal — ou seja, braco na horizontal, que parece cumprimento de longe.
 * A 0.95 sobra 0.30 para cada mao, que e o ABRE_MAO do CharacterRig.
 */
const LADO = 0.95;
/** perto o bastante para as maos se alcancarem quando o estado liga */
const ALCANCE = 1.8;
/** se um ficar mais longe que isto por SOLTA_EM segundos, as maos se soltam */
const ESTICOU = 2.2;
const SOLTA_EM = 0.5;
/** de quanto em quanto tempo sobe um coracao */
const INTERVALO = 3;

/**
 * Andar de maos dadas.
 *
 * Ao contrario do beijo, isto vale para QUALQUER dupla — personagem novo que
 * entrar no jogo ja anda de maos dadas sem precisar de nada na ficha.
 *
 * A mecanica e quem sabe onde os dois estao; o `Companion` so recebe um lado e
 * uma distancia (`atrelar`) e o `CharacterRig` so recebe qual braco abrir
 * (`setHoldingHands`). Nenhum dos dois sabe que existe uma mao dada.
 */
export class MaosDadas {
  private lado: -1 | 1 = 1;
  private ligado = false;
  private relogio = 0;
  private longe = 0;

  /** o Game liga isto no motor de audio */
  onSom: ((nome: 'coracao' | 'escolha') => void) | null = null;

  constructor(private readonly coracoes: Coracoes) {}

  get ativo(): boolean {
    return this.ligado;
  }

  /** Da para dar a mao agora? Perto, os dois de pe e ninguem ocupado. */
  disponivel(a: Player, b: Companion): boolean {
    if (this.ligado) return false;
    if (a.riding || b.riding || a.submersion > 0.05 || b.submersion > 0.05) return false;
    if (a.locked || b.hasOrder) return false;
    const dist = Math.hypot(b.position.x - a.position.x, b.position.z - a.position.z);
    return dist > 0.01 && dist <= ALCANCE;
  }

  /** Liga. Chame so depois de `disponivel()` dizer que da. */
  ligar(a: Player, b: Companion): void {
    if (this.ligado) return;
    this.ligado = true;
    this.relogio = 0;
    this.longe = 0;
    // fica no lado em que ele ja esta: assim ninguem atravessa o outro correndo
    // para o lado "certo" na hora que as maos se dao
    const olhando = a.rig.facing;
    const dx = b.position.x - a.position.x;
    const dz = b.position.z - a.position.z;
    this.lado = dx * Math.sin(olhando + Math.PI / 2) + dz * Math.cos(olhando + Math.PI / 2) < 0 ? -1 : 1;
    this.aplicar(a, b);
    this.onSom?.('escolha');
  }

  /** Solta. Serve para o toggle e para todos os cancelamentos. */
  soltar(a: Player, b: Companion): void {
    if (!this.ligado) return;
    this.ligado = false;
    b.soltar();
    a.rig.setHoldingHands(0);
    b.rig.setHoldingHands(0);
  }

  /**
   * Depois de trocar os corpos com o T: as posicoes nao mudaram, mas os rigs
   * sim, entao a pose precisa ser carimbada de novo — invertida, porque quem
   * estava a direita agora esta a esquerda.
   */
  trocouCorpos(a: Player, b: Companion): void {
    if (!this.ligado) return;
    this.lado = this.lado === 1 ? -1 : 1;
    this.aplicar(a, b);
  }

  /** Roda ANTES do movimento, junto com o beijo. */
  update(dt: number, a: Player, b: Companion): void {
    if (!this.ligado) return;

    // desiste sozinho se alguem entrou na agua, num brinquedo ou numa cutscene
    if (a.riding || b.riding || a.submersion > 0.05 || b.submersion > 0.05 || b.hasOrder) {
      this.soltar(a, b);
      return;
    }

    // ...ou se um banco entrou no meio dos dois. Sem isto, os bracos ficam
    // esticados apontando para o nada do outro lado do obstaculo.
    const dist = Math.hypot(b.position.x - a.position.x, b.position.z - a.position.z);
    this.longe = dist > ESTICOU ? this.longe + dt : 0;
    if (this.longe >= SOLTA_EM) {
      this.soltar(a, b);
      return;
    }

    // e o `Companion` que anda; a mecanica so diz para onde o par esta virado
    b.direcaoDoPar = a.rig.facing;

    this.relogio += dt;
    if (this.relogio >= INTERVALO) {
      this.relogio -= INTERVALO;
      // O coracao nasce no ponto medio exato entre os dois e sobe reto — mas
      // ACIMA das duas cabecas. No meio da altura do peito ele funciona so
      // quando o par esta de lado para a camera; de perfil, os dois corpos se
      // enfileiram na tela e o coracao nasce dentro de uma nuca.
      const meio = a.position.clone().add(b.position).multiplyScalar(0.5);
      this.coracoes.soltar(meio, 0, 0, 2.05);
      this.onSom?.('coracao');
    }
  }

  private aplicar(a: Player, b: Companion): void {
    b.atrelar(this.lado, LADO);
    b.direcaoDoPar = a.rig.facing;
    // o parceiro esta no lado `lado` do jogador, entao o jogador segura com o
    // braco daquele lado e o parceiro com o do lado oposto
    a.rig.setHoldingHands(this.lado);
    b.rig.setHoldingHands(this.lado === 1 ? -1 : 1);
  }
}
