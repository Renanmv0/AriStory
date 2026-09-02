import * as THREE from 'three';

/**
 * A base de todo bicho que mora numa cena do AriStory.
 *
 * Ela guarda o CEREBRO — passear por uma area, contornar movel, parar, sentar,
 * fazer barulho de vez em quando e receber carinho — e deixa para a subclasse
 * so o que e daquele bicho: o CORPO (`montar`) e a POSE (`animar`). Um cachorro
 * novo, um passarinho, um peixe: cada um e um arquivo de aparencia, nao um
 * cerebro novo.
 *
 * Por que aqui e nao em `world/`: `world/` e o kit de peças de cenario, e peça
 * de cenario e geometria parada que a cena posiciona. Bicho tem estado, decide
 * para onde vai e muda sozinho de um quadro para o outro — isso e ator, que e o
 * que `entities/` guarda (o Frisbee e o PingPong ja moram la pela mesma razao).
 *
 * Ele tambem NAO usa o `CharacterRig`: aquele monta gente em pe (cabeca grande,
 * dois bracos, duas pernas em capsula), e nada ali serve para quatro patas.
 */

/** o que ele esta fazendo agora */
export type EstadoDoBicho = 'andando' | 'parado' | 'sentado';

/** onde ele pode pisar, e o que tem que contornar */
export interface AreaDoBicho {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /**
   * circulos onde ele NAO entra (movel, planta, buraco).
   *
   * A cena repete aqui os moveis que ja bloqueiam a dupla em vez de o bicho ler
   * o colisor do mundo, e de proposito: ele e menor e passa em vao que gente
   * nao passa, entao quem decide o que e obstaculo PARA ELE e quem monta a cena.
   */
  proibido?: Array<{ x: number; z: number; r: number }>;
}

export interface JeitoDoBicho {
  /** unidades por segundo andando */
  velocidade?: number;
  /** quanto tempo ele fica parado ou sentado, entre um passeio e outro */
  descansoMin?: number;
  descansoMax?: number;
  /** chance de o descanso ser SENTADO em vez de so parado (0 a 1) */
  chanceDeSentar?: number;
  /** intervalo entre dois sons espontaneos */
  somCadaMin?: number;
  somCadaMax?: number;
  /** quanto tempo ele fica quieto depois de receber carinho */
  duracaoDoCarinho?: number;
  /** semente do sorteio: mesma semente, mesmo passeio em todo build */
  semente?: number;
}

/** o que a subclasse recebe para desenhar a pose do quadro */
export interface PoseDoBicho {
  andando: boolean;
  sentado: boolean;
  /** 0 a 1: o quanto ele ainda esta contente com o carinho recebido */
  carinho: number;
  /** relogio proprio dele, em segundos, para os senos da animacao */
  fase: number;
}

export abstract class Bicho {
  readonly group = new THREE.Group();

  /**
   * Chamado quando ele resolve fazer barulho sozinho.
   *
   * A cena liga isto no `g.som(...)`: o bicho sabe QUANDO fazer barulho, mas
   * nao conhece o motor de audio.
   */
  aoSoar: (() => void) | null = null;

  get x(): number {
    return this.group.position.x;
  }
  get z(): number {
    return this.group.position.z;
  }
  get estado(): EstadoDoBicho {
    return this.humor;
  }

  protected readonly area: AreaDoBicho;
  private readonly jeito: Required<JeitoDoBicho>;

  private humor: EstadoDoBicho = 'parado';
  /** quanto falta do estado atual, em segundos */
  private aguarda = 1.2;
  private readonly alvo = new THREE.Vector3();
  private fase = 0;
  private ateSoar: number;
  private carinho = 0;
  private semente: number;

  constructor(area: AreaDoBicho, jeito: JeitoDoBicho = {}) {
    this.area = area;
    this.jeito = {
      velocidade: jeito.velocidade ?? 0.62,
      descansoMin: jeito.descansoMin ?? 1.4,
      descansoMax: jeito.descansoMax ?? 4.4,
      chanceDeSentar: jeito.chanceDeSentar ?? 0.35,
      somCadaMin: jeito.somCadaMin ?? 9,
      somCadaMax: jeito.somCadaMax ?? 20,
      duracaoDoCarinho: jeito.duracaoDoCarinho ?? 3.4,
      semente: jeito.semente ?? 20260902,
    };
    this.semente = this.jeito.semente >>> 0 || 1;
    this.ateSoar = this.jeito.somCadaMin * 0.7;
    this.group.position.set((area.minX + area.maxX) / 2, 0, (area.minZ + area.maxZ) / 2);
    this.alvo.copy(this.group.position);
  }

  /**
   * Monta o corpo. A subclasse chama isto no fim do proprio construtor — nao
   * daqui: um metodo abstrato chamado pelo construtor da base roda ANTES de os
   * campos da subclasse existirem, e as listas de malha sairiam vazias.
   */
  protected prontoParaAparecer(etiqueta: string): void {
    this.group.userData.peca = etiqueta;
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
  }

  /** A pose do quadro. Cada bicho desenha a sua. */
  protected abstract animar(dt: number, pose: PoseDoBicho): void;

  // --------------------------------------------------------------- cerebro

  /** Sorteio repetivel: mesma semente, mesmo passeio. */
  protected sorte(): number {
    let s = this.semente;
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    this.semente = s >>> 0;
    return (this.semente % 100000) / 100000;
  }

  private cabe(x: number, z: number): boolean {
    const a = this.area;
    if (x < a.minX || x > a.maxX || z < a.minZ || z > a.maxZ) return false;
    for (const p of a.proibido ?? []) {
      if (Math.hypot(x - p.x, z - p.z) < p.r) return false;
    }
    return true;
  }

  /** Escolhe o proximo destino, ou desiste e fica parado mais um pouco. */
  private novoDestino(): void {
    for (let tentativa = 0; tentativa < 12; tentativa++) {
      const x = this.area.minX + this.sorte() * (this.area.maxX - this.area.minX);
      const z = this.area.minZ + this.sorte() * (this.area.maxZ - this.area.minZ);
      // um destino colado onde ele ja esta nao vira caminhada nenhuma
      const dist = Math.hypot(x - this.x, z - this.z);
      if (this.cabe(x, z) && dist > 0.7) {
        this.alvo.set(x, 0, z);
        this.humor = 'andando';
        // O RELOGIO PRECISA SER RENOVADO AQUI. Sem isto `aguarda` continua
        // negativo, o quadro seguinte cai de novo no mesmo `if`, ve que ele
        // esta "andando" e o declara cansado na hora: o bicho da um passo de um
        // frame e passa o resto da vida parado. Foi bug real no Pelusa.
        //
        // E teto, nao duracao: quem encerra a caminhada de verdade e chegar.
        this.aguarda = dist / this.jeito.velocidade + 2;
        return;
      }
    }
    this.humor = 'parado';
    this.aguarda = 1.5;
  }

  /**
   * Carinho: ele para onde esta, senta e fica contente.
   *
   * A cena chama no `onInteract`. O contentamento decai sozinho, entao nao ha
   * nada para a cena desligar depois.
   */
  receberCarinho(): void {
    this.humor = 'sentado';
    this.aguarda = this.jeito.duracaoDoCarinho;
    this.carinho = 1;
    // e ele responde: o proximo som sai logo, e nao daqui a vinte segundos
    this.ateSoar = Math.min(this.ateSoar, 2.2);
  }

  update(dt: number): void {
    this.fase += dt;
    this.aguarda -= dt;
    this.ateSoar -= dt;
    if (this.carinho > 0) this.carinho = Math.max(0, this.carinho - dt * 0.42);

    // ---------------------------------------------------------- o barulho
    // Espontaneo e ESPACADO: bicho que faz barulho a cada dois segundos vira
    // alarme, nao companhia.
    if (this.ateSoar <= 0) {
      const j = this.jeito;
      this.ateSoar = j.somCadaMin + this.sorte() * (j.somCadaMax - j.somCadaMin);
      this.aoSoar?.();
      // e ele para para fazer barulho, como bicho de verdade
      if (this.humor === 'andando') {
        this.humor = 'parado';
        this.aguarda = 0.9;
      }
    }

    // ------------------------------------------------------- o que fazer
    if (this.aguarda <= 0) {
      if (this.humor === 'andando') {
        const j = this.jeito;
        this.humor = this.sorte() < j.chanceDeSentar ? 'sentado' : 'parado';
        this.aguarda = j.descansoMin + this.sorte() * (j.descansoMax - j.descansoMin);
      } else {
        this.novoDestino();
      }
    }

    let andando = false;
    if (this.humor === 'andando') {
      const dx = this.alvo.x - this.x;
      const dz = this.alvo.z - this.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.08) {
        this.humor = 'parado';
        this.aguarda = 1.2 + this.sorte() * 2.5;
      } else {
        const passo = Math.min(dist, this.jeito.velocidade * dt);
        this.group.position.x += (dx / dist) * passo;
        this.group.position.z += (dz / dist) * passo;
        // vira para onde anda, sem estalo
        const alvoAng = Math.atan2(dx, dz);
        let d = alvoAng - this.group.rotation.y;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        this.group.rotation.y += d * Math.min(1, dt * 7);
        andando = true;
      }
    }

    this.animar(dt, {
      andando,
      sentado: this.humor === 'sentado',
      carinho: this.carinho,
      fase: this.fase,
    });
  }
}
