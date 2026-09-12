import { chiado, dado, nota, tom } from './nucleo';

/**
 * A música de fundo — no espírito de Animal Crossing: andamento lento, acordes
 * com sétima, marimba em cima e nada de tensão. Ela não é um arquivo tocando em
 * loop: é escrita quadro a quadro por um sequenciador, então nunca repete igual
 * e cada cenário tem o seu clima.
 *
 * O que faz soar "fofo", em três decisões:
 *   1. **acordes maj7/m7 e sexta** — nenhum acorde pede resolução urgente;
 *   2. **melodia presa à pentatônica** do tom, onde nota errada não existe;
 *   3. **suingue**: a colcheia do contratempo chega atrasada, como quem não tem
 *      pressa. É o oposto do ritmo quadrado de música de jogo antigo.
 *
 * O relógio é o do AudioContext, nunca o do jogo: som agendado por
 * requestAnimationFrame engasga toda vez que o quadro atrasa.
 */

/** de quanto em quanto tempo o agendador acorda */
const TIQUE = 0.2;
/** quanto ele agenda para a frente; tem que cobrir uma aba em segundo plano */
const ADIANTE = 1.3;

type Acorde = {
  /** semitons acima da tônica do clima */
  raiz: number;
  /** intervalos do acorde, a partir da raiz */
  notas: number[];
};

const maj7 = (raiz: number): Acorde => ({ raiz, notas: [0, 4, 7, 11] });
const m7 = (raiz: number): Acorde => ({ raiz, notas: [0, 3, 7, 10] });
const dom7 = (raiz: number): Acorde => ({ raiz, notas: [0, 4, 7, 10] });
const maj6 = (raiz: number): Acorde => ({ raiz, notas: [0, 4, 7, 9] });

export interface Clima {
  /** batidas por minuto */
  bpm: number;
  /** nota MIDI da tônica, na oitava do baixo */
  tonica: number;
  /** uma volta inteira da harmonia, um acorde por compasso */
  giro: Acorde[];
  /** quanto a marimba aparece (0..1) */
  melodia: number;
  /** chocalho no contratempo */
  chocalho: boolean;
  /** graus da escala usados pela melodia, em semitons */
  escala: number[];
}

const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19];
const PENTA_MENOR_DOCE = [0, 2, 3, 5, 7, 9, 10, 12, 14];

/**
 * Um clima por cenário. A casa é lenta e quentinha, o parque é o mais alegre e
 * o clube tem cara de tarde de sol — mesma família, humores diferentes.
 */
export const CLIMAS: Record<string, Clima> = {
  casa: {
    bpm: 82,
    tonica: 41, // fá
    giro: [maj7(0), m7(9), m7(2), dom7(7)],
    melodia: 0.62,
    chocalho: false,
    escala: PENTA,
  },
  'villa-lobos': {
    bpm: 100,
    tonica: 36, // dó
    giro: [maj7(0), maj7(5), m7(9), dom7(7)],
    melodia: 0.8,
    chocalho: true,
    escala: PENTA,
  },
  clube: {
    bpm: 92,
    tonica: 38, // ré
    giro: [maj6(0), m7(2), maj7(5), dom7(7)],
    melodia: 0.72,
    chocalho: true,
    escala: PENTA,
  },
  /** usado enquanto nenhuma cena pediu clima */
  padrao: {
    bpm: 88,
    tonica: 40,
    giro: [maj7(0), m7(9), maj7(5), dom7(7)],
    melodia: 0.6,
    chocalho: false,
    escala: PENTA_MENOR_DOCE,
  },
};

/** desenhos rítmicos de um compasso: em quais colcheias a melodia toca */
const RITMOS = [
  [0, 2, 3, 6],
  [0, 3, 4, 6, 7],
  [2, 3, 5, 6],
  [0, 1, 3, 6],
  [0, 4, 6],
  [1, 3, 4, 7],
];

export class Musica {
  private clima: Clima = CLIMAS.padrao;
  private proximoClima: Clima | null = null;
  private passo = 0;
  private proximo = 0;
  private timer: number | null = null;
  private sorte = dado(20260827);
  /** desenho da melodia do compasso atual, decidido no início dele */
  private frase: number[] = [];
  /** grau da escala em que a melodia está agora; ela anda daqui por passos */
  private grau = 2;

  constructor(
    private readonly ctx: AudioContext,
    private readonly destino: AudioNode,
  ) {}

  get tocando(): boolean {
    return this.timer !== null;
  }

  /** Troca o clima; a virada espera o compasso fechar, para não soar tropeço. */
  setClima(id: string): void {
    const novo = CLIMAS[id] ?? CLIMAS.padrao;
    if (novo === this.clima) return;
    if (!this.tocando) this.clima = novo;
    else this.proximoClima = novo;
  }

  start(): void {
    if (this.timer !== null) return;
    this.proximo = this.ctx.currentTime + 0.15;
    this.timer = window.setInterval(() => this.agendar(), TIQUE * 1000);
    this.agendar();
  }

  stop(): void {
    if (this.timer === null) return;
    window.clearInterval(this.timer);
    this.timer = null;
  }

  /**
   * Agenda de uma vez `segundos` de música, sem depender do relógio andando.
   * Serve para renderizar num OfflineAudioContext — é assim que
   * `scripts/musica.mjs` gera um .wav com exatamente a música que toca no jogo.
   */
  preAgendar(segundos: number): void {
    this.proximo = 0;
    this.passo = 0;
    while (this.proximo < segundos) {
      this.tocarPasso(this.passo, this.proximo);
      const colcheia = 30 / this.clima.bpm;
      this.proximo += colcheia * (this.passo % 2 === 0 ? 1.18 : 0.82);
      this.passo += 1;
    }
  }

  // --------------------------------------------------------------- motor

  private agendar(): void {
    const limite = this.ctx.currentTime + ADIANTE;
    let voltas = 0;
    while (this.proximo < limite && voltas++ < 64) {
      this.tocarPasso(this.passo, this.proximo);
      // suingue: a colcheia do tempo forte é mais longa que a do contratempo
      const colcheia = 30 / this.clima.bpm;
      this.proximo += colcheia * (this.passo % 2 === 0 ? 1.18 : 0.82);
      this.passo += 1;
    }
  }

  private tocarPasso(passo: number, t: number): void {
    const naBarra = passo % 8;
    if (naBarra === 0) {
      // troca de clima e sorteio da frase acontecem no começo do compasso
      if (this.proximoClima) {
        this.clima = this.proximoClima;
        this.proximoClima = null;
      }
      // um desenho novo a cada dois compassos: o primeiro pergunta, o segundo
      // responde com o mesmo ritmo. Sorteando todo compasso a melodia vira
      // conversa de doido, sem nada para o ouvido segurar.
      const compassoAtual = Math.floor(passo / 8);
      if (compassoAtual % 2 === 0 || this.frase.length === 0) {
        this.frase = RITMOS[Math.floor(this.sorte() * RITMOS.length)];
      }
    }

    const c = this.clima;
    const compasso = Math.floor(passo / 8);
    const acorde = c.giro[compasso % c.giro.length];
    const raiz = c.tonica + acorde.raiz;

    // ------------------------------------------------------------- baixo
    if (naBarra === 0 || naBarra === 4) {
      const alvo = naBarra === 0 ? raiz : raiz + (this.sorte() < 0.4 ? 7 : 4);
      tom(this.ctx, this.destino, {
        freq: nota(alvo),
        quando: t,
        dur: naBarra === 0 ? 0.6 : 0.45,
        vol: 0.2,
        tipo: 'sine',
        abafo: 420,
      });
    }

    // ------------------------------------------------ acordes (tipo rhodes)
    // comping preguiçoso: entra no contratempo, que é o que dá o balanço
    if (naBarra === 2 || naBarra === 5 || (naBarra === 7 && this.sorte() < 0.35)) {
      const base = raiz + 24; // oitava do meio, longe do baixo e da melodia
      for (const [i, intervalo] of acorde.notas.entries()) {
        if (i === 0 && naBarra !== 2) continue; // nem sempre repete a fundamental
        tom(this.ctx, this.destino, {
          freq: nota(base + intervalo),
          quando: t,
          dur: 0.85,
          vol: 0.07,
          tipo: 'triangle',
          ataque: 0.03,
          detune: i % 2 ? 5 : -5,
          abafo: 2400,
        });
      }
    }

    // ------------------------------------------------- melodia (marimba)
    if (this.frase.includes(naBarra) && this.sorte() < c.melodia) {
      // a linha CAMINHA: passo curto na escala, salto de vez em quando. Sortear
      // a nota solta dá pentatônica aleatória, que agrada mas não vira melodia.
      const passos = [-2, -1, -1, 0, 1, 1, 2];
      this.grau += passos[Math.floor(this.sorte() * passos.length)];
      // e é puxada de volta ao meio nas pontas, senão o passeio encosta no teto
      // da escala e a melodia fica pendurada na nota mais aguda
      if (this.grau > c.escala.length - 3) this.grau -= 2;
      if (this.grau < 2) this.grau += 2;
      this.grau = Math.max(0, Math.min(c.escala.length - 1, this.grau));
      // fecha o compasso numa nota do acorde: é o que soa resolvido
      const alvo =
        naBarra >= 6 ? acorde.notas[Math.floor(this.sorte() * 3)] : c.escala[this.grau];
      // registro da marimba: uma oitava e meia acima dos acordes, que é onde a
      // melodia canta sem virar apito. Mais alto que isto cansa em dois minutos.
      const base = c.tonica + 31;
      this.marimba(nota(base + alvo), t);
      // oitava por cima só nas notas graves, senão o dobro já sai estridente
      if (alvo <= 9 && this.sorte() < 0.22) this.marimba(nota(base + alvo + 12), t + 0.03, 0.4);
    }

    // ------------------------------------------------------------ chocalho
    if (c.chocalho && naBarra % 2 === 1) {
      chiado(this.ctx, this.destino, {
        quando: t,
        dur: 0.06,
        vol: naBarra === 3 || naBarra === 7 ? 0.035 : 0.02,
        freq: 6200,
        q: 0.8,
      });
    }
  }

  /** Marimba: fundamental redonda + um harmônico curtinho por cima. */
  private marimba(freq: number, t: number, forca = 1): void {
    tom(this.ctx, this.destino, {
      freq,
      quando: t,
      dur: 0.42,
      vol: 0.13 * forca,
      tipo: 'sine',
    });
    // o harmônico é o que dá o "toc" de madeira; acima de 900 Hz ele só apita
    if (freq < 900) {
      tom(this.ctx, this.destino, {
        freq: freq * 2,
        quando: t,
        dur: 0.1,
        vol: 0.04 * forca,
        tipo: 'sine',
      });
    }
  }
}
