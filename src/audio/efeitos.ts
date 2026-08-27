import { chiado, nota, tom } from './nucleo';

/**
 * Um som para cada ação. Todos desenhados na hora, todos curtos e doces —
 * a régua é: se tocar dez vezes seguidas ainda tem que dar vontade de ouvir.
 *
 * Afinação: quase tudo cai na pentatônica de dó (0, 2, 4, 7, 9), que é a escala
 * em que nota errada não existe. É por isso que soa "fofo" mesmo tocando por
 * cima da música.
 */
export type SomNome =
  | 'passo'
  | 'prompt'
  | 'interagir'
  | 'fala'
  | 'escolha'
  | 'confirma'
  | 'porta'
  | 'memoria'
  | 'toast'
  | 'trocar'
  | 'beijo'
  | 'coracao'
  | 'lancar'
  | 'pegar'
  | 'quicar'
  | 'agua'
  | 'nadar'
  | 'sorvete'
  | 'pato'
  | 'tv'
  | 'sino'
  | 'sentar'
  | 'menu'
  | 'diario'
  | 'recomecar';

/** graus da pentatônica maior, em semitons */
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16];
/** dó central: a base de quase tudo aqui */
const DO = 72;

export interface Contexto {
  ctx: AudioContext;
  destino: AudioNode;
  /** relógio do AudioContext no momento do disparo */
  t: number;
  /** contador de passos/falas, para alternar em vez de repetir igual */
  n: number;
}

type Receita = (c: Contexto) => void;

export const EFEITOS: Record<SomNome, Receita> = {
  // ---------------------------------------------------------------- andar
  // passo é o som que mais toca no jogo inteiro: tem que ser quase um sopro,
  // e alternar entre dois timbres, senão vira metrônomo
  passo: ({ ctx, destino, t, n }) => {
    const par = n % 2 === 0;
    chiado(ctx, destino, {
      quando: t,
      dur: 0.075,
      vol: 0.05,
      freq: par ? 1500 : 1150,
      glide: par ? 700 : 560,
      q: 0.9,
    });
    tom(ctx, destino, { freq: par ? 128 : 112, quando: t, dur: 0.06, vol: 0.045, tipo: 'sine' });
  },

  nadar: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.34, vol: 0.07, freq: 700, glide: 2600, q: 0.7 });
  },

  agua: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.42, vol: 0.2, freq: 2400, glide: 500, q: 0.6 });
    tom(ctx, destino, { freq: 420, glide: 120, quando: t, dur: 0.26, vol: 0.1, tipo: 'sine' });
  },

  // ------------------------------------------------------------ interação
  // o prompt aparecendo: uma gotinha, bem baixinho — ele pisca o tempo todo
  prompt: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 12), quando: t, dur: 0.09, vol: 0.055, tipo: 'triangle' });
  },

  interagir: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 4), quando: t, dur: 0.12, vol: 0.13, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO + 11), quando: t + 0.055, dur: 0.16, vol: 0.1, tipo: 'sine' });
  },

  // uma letra do diálogo. Toca muito, então é quase inaudível e muda de nota
  fala: ({ ctx, destino, t, n }) => {
    const grau = PENTA[n % 4] + (n % 8 < 4 ? 0 : 2);
    tom(ctx, destino, {
      freq: nota(DO + 7 + grau),
      quando: t,
      dur: 0.06,
      vol: 0.035,
      tipo: 'square',
      abafo: 2200,
    });
  },

  escolha: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 7), quando: t, dur: 0.07, vol: 0.08, tipo: 'triangle' });
  },

  confirma: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 4), quando: t, dur: 0.1, vol: 0.12, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO + 9), quando: t + 0.07, dur: 0.14, vol: 0.11, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO + 16), quando: t + 0.14, dur: 0.2, vol: 0.09, tipo: 'sine' });
  },

  // -------------------------------------------------------------- mundo
  porta: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.3, vol: 0.11, freq: 900, glide: 320, q: 0.8 });
    tom(ctx, destino, { freq: 180, glide: 90, quando: t + 0.16, dur: 0.2, vol: 0.09, tipo: 'sine' });
  },

  // memória nova no diário: o arpejo mais alegre do jogo
  memoria: ({ ctx, destino, t }) => {
    [0, 4, 7, 12, 16].forEach((g, i) => {
      tom(ctx, destino, {
        freq: nota(DO + g),
        quando: t + i * 0.075,
        dur: 0.42,
        vol: 0.11 - i * 0.008,
        tipo: 'triangle',
      });
    });
  },

  toast: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 9), quando: t, dur: 0.14, vol: 0.09, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 16), quando: t + 0.08, dur: 0.22, vol: 0.07, tipo: 'sine' });
  },

  // troca de personagem: um "vupt" que sobe, como quem troca de lugar
  trocar: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO), glide: nota(DO + 12), quando: t, dur: 0.18, vol: 0.09, tipo: 'triangle' });
    chiado(ctx, destino, { quando: t, dur: 0.2, vol: 0.05, freq: 800, glide: 3000, q: 0.6 });
  },

  // ------------------------------------------------------------- carinho
  beijo: ({ ctx, destino, t }) => {
    // o estalinho: ruído bem curto e agudo
    chiado(ctx, destino, { quando: t, dur: 0.06, vol: 0.1, freq: 2400, glide: 1200, q: 2.5 });
    tom(ctx, destino, { freq: nota(DO + 7), quando: t + 0.02, dur: 0.1, vol: 0.08, tipo: 'sine' });
  },

  coracao: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 12), quando: t, dur: 0.3, vol: 0.07, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 19), quando: t + 0.09, dur: 0.36, vol: 0.05, tipo: 'sine' });
  },

  // ------------------------------------------------------------- frisbee
  lancar: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.26, vol: 0.12, freq: 600, glide: 3200, q: 0.7 });
    tom(ctx, destino, { freq: 300, glide: 900, quando: t, dur: 0.16, vol: 0.06, tipo: 'triangle' });
  },

  pegar: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.09, vol: 0.13, freq: 1400, glide: 500, q: 1.6 });
    tom(ctx, destino, { freq: nota(DO + 9), quando: t + 0.03, dur: 0.14, vol: 0.1, tipo: 'triangle' });
  },

  quicar: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 220, glide: 110, quando: t, dur: 0.12, vol: 0.08, tipo: 'sine' });
    chiado(ctx, destino, { quando: t, dur: 0.1, vol: 0.06, freq: 900, glide: 400, q: 1 });
  },

  // ------------------------------------------------------------ cenários
  sorvete: ({ ctx, destino, t }) => {
    [0, 7, 12].forEach((g, i) => {
      tom(ctx, destino, {
        freq: nota(DO + 4 + g),
        quando: t + i * 0.09,
        dur: 0.3,
        vol: 0.1,
        tipo: 'triangle',
      });
    });
  },

  pato: ({ ctx, destino, t }) => {
    // quack: onda dente-de-serra caindo rápido, com um filtro fechado
    tom(ctx, destino, {
      freq: 620,
      glide: 380,
      quando: t,
      dur: 0.13,
      vol: 0.1,
      tipo: 'sawtooth',
      abafo: 1400,
    });
    tom(ctx, destino, {
      freq: 520,
      glide: 300,
      quando: t + 0.15,
      dur: 0.12,
      vol: 0.08,
      tipo: 'sawtooth',
      abafo: 1200,
    });
  },

  tv: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.18, vol: 0.07, freq: 3000, glide: 1200, q: 0.5 });
    tom(ctx, destino, { freq: nota(DO + 4), quando: t + 0.1, dur: 0.18, vol: 0.07, tipo: 'square', abafo: 1800 });
  },

  sino: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 12), quando: t, dur: 0.9, vol: 0.09, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 19), quando: t + 0.02, dur: 0.8, vol: 0.05, tipo: 'sine', detune: 6 });
  },

  sentar: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.24, vol: 0.09, freq: 700, glide: 260, q: 0.7 });
  },

  // ------------------------------------------------------------------ ui
  menu: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 2), quando: t, dur: 0.1, vol: 0.09, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO + 9), quando: t + 0.06, dur: 0.14, vol: 0.07, tipo: 'triangle' });
  },

  diario: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.22, vol: 0.09, freq: 1200, glide: 3000, q: 0.6 });
  },

  recomecar: ({ ctx, destino, t }) => {
    [0, 4, 7, 12].forEach((g, i) => {
      tom(ctx, destino, {
        freq: nota(DO - 12 + g),
        quando: t + i * 0.11,
        dur: 0.5,
        vol: 0.1,
        tipo: 'triangle',
      });
    });
  },
};
