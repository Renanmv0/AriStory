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

  /**
   * A ORDEM QUE A CENA DEU: um ponto para onde ir e a promessa que resolve
   * quando ele chegar. Enquanto existe, o passeio nao decide nada.
   */
  private missao: { x: number; z: number; velocidade: number; pronto: () => void } | null = null;
  /** de servico: ele fica parado esperando a proxima ordem em vez de passear */
  private servindo = false;

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

  // ------------------------------------------------- o bicho a servico da cena

  /**
   * TIRA ELE DO PASSEIO e poe a cena no comando.
   *
   * Existe porque bicho que participa de cutscene nao pode continuar decidindo
   * para onde vai: o garcom do Mania de Churrasco precisa ir a cozinha e voltar
   * na hora certa, e o cerebro dele sortearia um destino no meio do caminho.
   *
   * A cena chama `entrarEmServico()`, encadeia quantos `irPara()` quiser, e
   * devolve ele com `voltarAPassear()`. Enquanto esta de servico ele NAO senta
   * nem sorteia destino — mas continua respirando, virando e fazendo barulho,
   * porque parar de viver no meio de uma cutscene e o que faz boneco parecer
   * boneco.
   */
  entrarEmServico(): void {
    this.servindo = true;
    this.missao = null;
    this.humor = 'parado';
  }

  voltarAPassear(): void {
    this.servindo = false;
    this.missao = null;
    this.humor = 'parado';
    this.aguarda = 0.4;
  }

  /**
   * Manda ele a um ponto; a promessa resolve quando ele chega.
   *
   * O caminho e RETO e ignora a area e os obstaculos de propósito: aqui quem
   * conhece o cenario e a cena, e ela desvia por partes (ate o vao de serviço,
   * depois para dentro da cozinha). Passeio e uma coisa, ordem e outra.
   */
  irPara(x: number, z: number, velocidade = this.jeito.velocidade): Promise<void> {
    this.servindo = true;
    return new Promise<void>((pronto) => {
      this.missao = { x, z, velocidade, pronto };
    });
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
    // De servico ele nao sorteia nada: quem manda e a cena, via `irPara`.
    if (this.aguarda <= 0 && !this.servindo) {
      if (this.humor === 'andando') {
        const j = this.jeito;
        this.humor = this.sorte() < j.chanceDeSentar ? 'sentado' : 'parado';
        this.aguarda = j.descansoMin + this.sorte() * (j.descansoMax - j.descansoMin);
      } else {
        this.novoDestino();
      }
    }

    let andando = false;
    if (this.missao) {
      const dx = this.missao.x - this.x;
      const dz = this.missao.z - this.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.08) {
        const pronto = this.missao.pronto;
        this.missao = null;
        pronto();
      } else {
        andando = this.passo(dx, dz, dist, this.missao.velocidade, dt);
      }
    } else if (this.humor === 'andando') {
      const dx = this.alvo.x - this.x;
      const dz = this.alvo.z - this.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.08) {
        this.humor = 'parado';
        this.aguarda = 1.2 + this.sorte() * 2.5;
      } else {
        andando = this.passo(dx, dz, dist, this.jeito.velocidade, dt);
      }
    }

    this.animar(dt, {
      andando,
      sentado: this.humor === 'sentado',
      carinho: this.carinho,
      fase: this.fase,
    });
  }

  /** Um passo na direcao dada, virando para onde anda sem estalo. */
  private passo(dx: number, dz: number, dist: number, velocidade: number, dt: number): boolean {
    const anda = Math.min(dist, velocidade * dt);
    this.group.position.x += (dx / dist) * anda;
    this.group.position.z += (dz / dist) * anda;
    const alvoAng = Math.atan2(dx, dz);
    let d = alvoAng - this.group.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    this.group.rotation.y += d * Math.min(1, dt * 7);
    return true;
  }
}
