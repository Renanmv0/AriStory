import * as THREE from 'three';
import { gotaDeExperiencia } from '../world/props';

/**
 * AS GOTAS DE EXPERIÊNCIA no chão da estufa — o §7 do plano do jardim.
 *
 * Bicho espantado solta gota; a gota NÃO VAI SOZINHA até você: tem que passar
 * por cima. É o que puxa o jogador para fora da posição confortável, e é a
 * mecânica mais barata de tensão que o gênero tem.
 *
 * ================================================== A VIDA DE UMA GOTA
 *
 *   pulando  → sai do bicho num arco curto e cai perto dele (0,45 s)
 *   no chão  → flutua e gira; aos 17 s começa a SECAR (pisca e encolhe)
 *   voando   → entrou no raio de coleta: acelera até o jogador
 *   (fim)    → pega, ou secou aos 20 s
 *
 * Sem carta, a gota vem até você quando você chega a 1,3 m (`ATRAI`) — perto
 * o bastante para ainda ter que ir buscar. A carta "Bolso furado" aumenta o
 * raio (`ficha.coleta`) para 2,5 m.
 *
 * ================================================== O QUE ELA NÃO SABE
 *
 * Nada de rodada, nada de nível, nada de carta. Ela devolve QUANTAS foram
 * pegas no quadro, e quem soma e decide se subiu de nível é o minigame. É o
 * mesmo corte do `Frisbee.ts`: a entidade anda e colide, a cena decide o que
 * isso significa.
 */

/** quanto tempo a gota fica no chão antes de secar — o §7 do plano diz 20 s */
export const VIDA_DA_GOTA = 20;
/** os últimos segundos dela são o aviso: pisca e encolhe */
const SECANDO = 3;
/** o raio em que pisar pega a gota, sem carta nenhuma */
export const PISAR = 0.6;
/**
 * O RAIO EM QUE A GOTA VEM SOZINHA, sem carta nenhuma — pequeno de propósito.
 *
 * Pedido do Renan, depois de uma gota ficar presa em cima de um canteiro (o
 * canteiro tem colisor, e a dupla não conseguia pisar nela). Chegar perto
 * basta; o Bolso furado continua valendo porque puxa de bem mais longe.
 */
export const ATRAI = 1.3;
/** a duração do salto de quando ela sai do bicho */
const SALTO = 0.45;

type Estado = 'pulando' | 'no-chao' | 'voando';

/**
 * A ALTURA EM QUE A GOTA FLUTUA sai da própria peça (`corpo.position.y` do
 * molde), e não de um número daqui: quando a gota cresceu, esta conta junto.
 */
const ALTURA = gotaDeExperiencia().getObjectByName('corpo')!.position.y;

interface Gota {
  peca: THREE.Group;
  corpo: THREE.Object3D;
  estado: Estado;
  /** segundos desde que pousou (só conta no chão) */
  idade: number;
  /** o salto: de onde saiu e onde vai cair */
  de: THREE.Vector3;
  para: THREE.Vector3;
  t: number;
  /** a fase do balanço, para duas gotas vizinhas não balançarem em uníssono */
  fase: number;
  /** a velocidade do voo até o jogador, que cresce enquanto ela voa */
  vel: number;
}

export class GotasDoJardim {
  readonly grupo = new THREE.Group();
  private readonly gotas: Gota[] = [];
  /** a peça-molde: cada gota nova é um clone, e o clone divide geometria e material */
  private readonly molde = gotaDeExperiencia();

  constructor() {
    this.grupo.userData.peca = 'gotas-do-jardim';
  }

  get quantasNoChao(): number {
    return this.gotas.length;
  }

  /**
   * SOLTA `quantas` gotas de onde o bicho estava.
   *
   * Elas saem em LEQUE e caem espalhadas num raio que cresce com o número: é o
   * pedido do §7 — o tanque solta 8 e a chefe 25, e oito gotas empilhadas no
   * mesmo ponto seriam um clique, enquanto oito num raio de 3 m são uma decisão.
   */
  soltar(
    x: number, z: number, quantas: number, rng: () => number = Math.random,
    /**
     * Onde a gota PODE pousar: recebe o ponto sorteado e devolve outro, se
     * aquele não serve (a rodada empurra para fora dos canteiros — gota em
     * cima de canteiro é gota que ninguém alcança a pé).
     */
    pouso?: (x: number, z: number) => { x: number; z: number },
  ): void {
    const raio = Math.min(3, 0.45 + Math.sqrt(quantas) * 0.45);
    for (let i = 0; i < quantas; i++) {
      const a = (i / Math.max(1, quantas)) * Math.PI * 2 + rng() * 0.9;
      const r = raio * (0.35 + rng() * 0.65);
      let px = x + Math.cos(a) * r;
      let pz = z + Math.sin(a) * r;
      if (pouso) ({ x: px, z: pz } = pouso(px, pz));
      const peca = this.molde.clone(true);
      const corpo = peca.getObjectByName('corpo') ?? peca;
      peca.position.set(x, 0, z);
      this.grupo.add(peca);
      this.gotas.push({
        peca,
        corpo,
        estado: 'pulando',
        idade: 0,
        de: new THREE.Vector3(x, 0, z),
        para: new THREE.Vector3(px, 0, pz),
        t: 0,
        fase: rng() * Math.PI * 2,
        vel: 0,
      });
    }
  }

  /**
   * Um quadro. Devolve QUANTAS gotas foram pegas nele.
   *
   * @param alvo onde o jogador está
   * @param coleta o raio de puxar (`ficha.coleta`); nunca menor que `ATRAI`
   * @param pausado com a tela das cartas aberta o mundo para — a gota também,
   *   senão ela seca enquanto o jogador lê as cartas
   */
  update(dt: number, alvo: { x: number; z: number }, coleta = 0, pausado = false): number {
    if (pausado) return 0;
    let pegas = 0;
    const alcance = Math.max(PISAR, ATRAI, coleta);

    for (let i = this.gotas.length - 1; i >= 0; i--) {
      const g = this.gotas[i];
      g.fase += dt * 3.2;
      const p = g.peca.position;

      if (g.estado === 'pulando') {
        g.t = Math.min(1, g.t + dt / SALTO);
        p.lerpVectors(g.de, g.para, g.t);
        // o arco: sobe e desce numa parábola, meio metro no alto
        g.corpo.position.y = ALTURA + Math.sin(g.t * Math.PI) * 0.55;
        if (g.t >= 1) g.estado = 'no-chao';
        continue;
      }

      const dx = alvo.x - p.x;
      const dz = alvo.z - p.z;
      const dist = Math.hypot(dx, dz);

      if (g.estado === 'no-chao') {
        g.idade += dt;
        // flutua e gira devagar: parada, ela some no saibro
        g.corpo.position.y = ALTURA + Math.sin(g.fase) * 0.06;
        g.corpo.rotation.y += dt * 1.4;
        // SECANDO: pisca cada vez mais rápido e encolhe — o aviso de "corre"
        const falta = VIDA_DA_GOTA - g.idade;
        if (falta < SECANDO) {
          const k = Math.max(0.25, falta / SECANDO);
          g.corpo.scale.setScalar(k);
          g.peca.visible = Math.sin(g.idade * (10 + (SECANDO - falta) * 6)) > -0.35;
        }
        if (falta <= 0) {
          this.tirar(i);
          continue;
        }
        if (dist < alcance) {
          g.estado = 'voando';
          g.peca.visible = true;
          g.corpo.scale.setScalar(1);
          g.vel = 2.5;
        }
        continue;
      }

      // VOANDO: acelera até o jogador, e sobe um tico para ir "para a mão"
      g.vel = Math.min(14, g.vel + dt * 22);
      const passo = Math.min(dist, g.vel * dt);
      if (dist > 1e-4) {
        p.x += (dx / dist) * passo;
        p.z += (dz / dist) * passo;
      }
      g.corpo.position.y += (ALTURA + 0.4 - g.corpo.position.y) * Math.min(1, dt * 8);
      if (dist - passo < 0.18) {
        pegas += 1;
        this.tirar(i);
      }
    }
    return pegas;
  }

  /**
   * O ÍMÃ DE GOTA: todas as que estão no chão levantam e voam até o jogador,
   * de onde estiverem. Elas seguem o caminho normal do voo, então chegam uma
   * por uma, e cada uma conta quando chega.
   */
  atrairTodas(): number {
    let quantas = 0;
    for (const g of this.gotas) {
      if (g.estado !== 'no-chao') continue;
      g.estado = 'voando';
      g.peca.visible = true;
      g.corpo.scale.setScalar(1);
      g.vel = 4;
      quantas += 1;
    }
    return quantas;
  }

  /** a gota parada mais perto de um ponto — o Noel vai atrás dela */
  maisPerto(x: number, z: number): { x: number; z: number } | null {
    let melhor: Gota | null = null;
    let d = Infinity;
    for (const g of this.gotas) {
      if (g.estado !== 'no-chao') continue;
      const dd = Math.hypot(g.peca.position.x - x, g.peca.position.z - z);
      if (dd < d) { d = dd; melhor = g; }
    }
    return melhor ? { x: melhor.peca.position.x, z: melhor.peca.position.z } : null;
  }

  /**
   * ALGUÉM CATA as gotas paradas num raio (o Noel): elas somem do chão e
   * quem catou leva. Devolve quantas — quem decide o que elas valem é a rodada.
   */
  catar(x: number, z: number, raio: number): number {
    let quantas = 0;
    for (let i = this.gotas.length - 1; i >= 0; i--) {
      const g = this.gotas[i];
      if (g.estado !== 'no-chao') continue;
      if (Math.hypot(g.peca.position.x - x, g.peca.position.z - z) > raio) continue;
      this.tirar(i);
      quantas += 1;
    }
    return quantas;
  }

  /** Some com todas — fim de rodada, ou sair da estufa. */
  limpar(): void {
    for (let i = this.gotas.length - 1; i >= 0; i--) this.tirar(i);
  }

  private tirar(i: number): void {
    this.grupo.remove(this.gotas[i].peca);
    this.gotas.splice(i, 1);
  }
}
