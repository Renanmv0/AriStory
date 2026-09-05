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
  | 'miado'
  | 'latido'
  | 'apito'
  | 'gluglu'
  | 'cantarolar'
  | 'cavar'
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

  // O latido do garçom canino. Duas sílabas curtas e SECAS ("au-au"), o oposto
  // do miado: lá a curva é longa e escorregada, aqui cada uma tem 0,1 s e cai
  // rápido. Latido comprido vira uivo. O `n` alterna o grau da pentatônica,
  // senão o cachorro late a mesma nota a vida inteira.
  latido: ({ ctx, destino, t, n }) => {
    const base = nota(DO + PENTA[n % 2 === 0 ? 0 : 1] - 12);
    for (const [i, atraso] of [0, 0.14].entries()) {
      tom(ctx, destino, {
        freq: base * (i === 0 ? 1.12 : 1),
        glide: base * 0.72,
        quando: t + atraso,
        dur: 0.11,
        vol: 0.09,
        tipo: 'sawtooth',
        abafo: 1100,
      });
      // o estalo do ar, que tira o som de sintetizador e bota focinho
      chiado(ctx, destino, {
        quando: t + atraso,
        dur: 0.05,
        vol: 0.035,
        freq: 2400,
      });
    }
  },

  // O miado do Pelusa. Duas vogais coladas ("mi-au"): a primeira sobe, a
  // segunda desce e é a que fecha a boca. Um tom só, plano, sai como apito de
  // brinquedo — é a CURVA que faz virar bicho. O `n` alterna entre um miado
  // curto e um mais arrastado, senão o gato repete a mesma frase a vida toda.
  miado: ({ ctx, destino, t, n }) => {
    const manhoso = n % 2 === 1;
    const base = nota(DO + PENTA[manhoso ? 2 : 3]);
    tom(ctx, destino, {
      freq: base * 0.82,
      glide: base,
      quando: t,
      dur: manhoso ? 0.2 : 0.15,
      vol: 0.075,
      tipo: 'sawtooth',
      abafo: 1500,
    });
    tom(ctx, destino, {
      freq: base,
      glide: base * 0.68,
      quando: t + (manhoso ? 0.15 : 0.1),
      // a segunda sílaba é a longa: o decaimento exponencial come o fim, e com
      // 0,3 s o "au" sumia em 0,13 s de áudio audível — saía um pio, não um miado
      dur: manhoso ? 0.55 : 0.4,
      vol: 0.085,
      ataque: 0.02,
      tipo: 'sawtooth',
      abafo: 1200,
    });
    // o sopro do ar, que tira o ar de sintetizador
    chiado(ctx, destino, {
      quando: t,
      dur: manhoso ? 0.4 : 0.28,
      vol: 0.022,
      freq: 1100,
      glide: 700,
      q: 2.2,
    });
  },

  /**
   * O APITO DA GIRAFA PORTEIRA — dois "fiu" subindo, de boas-vindas.
   *
   * Apito de guarda de verdade é estridente porque é ordem; este é convite,
   * então são duas notas curtas da pentatônica em onda triangular, e não um
   * ruído agudo. O sopro por baixo (`chiado`) é o que faz virar apito em vez de
   * flauta: sem ele o som sai limpo demais e lê como alerta de micro-ondas.
   */
  apito: ({ ctx, destino, t }) => {
    const um = nota(DO + PENTA[3]);
    const dois = nota(DO + PENTA[5]);
    // A SEGUNDA NOTA É MAIS LONGA E MAIS FORTE. O decaimento é exponencial: com
    // 0,16 e 0,26 o apito rendia 0,18 s de áudio audível e o segundo "fiu"
    // simplesmente não chegava — saía um bipe só. Medido no .wav, não no olho.
    for (const [freq, quando, dur, vol] of [[um, t, 0.2, 0.055], [dois, t + 0.17, 0.46, 0.075]] as const) {
      tom(ctx, destino, {
        freq: freq * 0.94,
        glide: freq,
        quando,
        dur,
        vol,
        ataque: 0.012,
        tipo: 'triangle',
        abafo: 3200,
      });
      chiado(ctx, destino, { quando, dur: dur * 0.7, vol: 0.014, freq: freq * 1.6, q: 6 });
    }
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

  /**
   * O GLUGLU DO NOEL, o peru do bar de sucos.
   *
   * Peru nao faz UM som: faz uma RAJADA. O gluglu de verdade e uma sequencia
   * rapida de estalos graves que sobe de tom e acelera no fim, e e essa curva
   * que faz o ouvido reconhecer "peru" em vez de "passaro generico".
   *
   * Cada estalo e curtissimo (0,05 s) e dente-de-serra com filtro fechado, que
   * e o que da o timbre encatarrado. O tom sobe de 210 para 330 Hz ao longo da
   * rajada e o intervalo entre eles encolhe — sem essa aceleracao sai um motor
   * de barco, e nao um bicho.
   */
  gluglu: ({ ctx, destino, t }) => {
    const ESTALOS = 7;
    let quando = t;
    for (let i = 0; i < ESTALOS; i++) {
      const k = i / (ESTALOS - 1);
      const freq = 210 + k * 120;
      tom(ctx, destino, {
        freq,
        glide: freq * 0.72,
        quando,
        dur: 0.05,
        vol: 0.085 - k * 0.02,
        ataque: 0.004,
        tipo: 'sawtooth',
        abafo: 900 + k * 500,
      });
      // o intervalo encolhe de 90 para 45 ms: a rajada acelera
      quando += 0.09 - k * 0.045;
    }
    // o arremate: a nota mais aberta que fecha o gluglu
    tom(ctx, destino, {
      freq: 360,
      glide: 250,
      quando: quando + 0.02,
      dur: 0.16,
      vol: 0.075,
      ataque: 0.008,
      tipo: 'sawtooth',
      abafo: 1500,
    });
    chiado(ctx, destino, { quando: t, dur: 0.4, vol: 0.01, freq: 1800, q: 3 });
  },

  /**
   * O CANTAROLAR DA JOSEFINA, a tartaruga jardineira.
   *
   * Ela nao late nem apita: ela cantarola enquanto cuida das plantas. Sao tres
   * notas em onda SENOIDAL — a unica onda limpa da lista, e e ela que faz o som
   * parecer voz humana fechada em vez de instrumento.
   *
   * O ATAQUE E LENTO (0,1 s) e as notas se SOBREPOEM. Ataque rapido faria um
   * bipe; a sobreposicao e o que amarra as tres num trecho de melodia so, em
   * vez de tres sons soltos. Um vibrato leve, feito com o `glide` de meio tom
   * para cima, tira o ar de sintetizador.
   */
  cantarolar: ({ ctx, destino, t }) => {
    const NOTAS = [PENTA[2], PENTA[4], PENTA[3]];
    NOTAS.forEach((grau, i) => {
      const freq = nota(DO + 12 + grau);
      tom(ctx, destino, {
        freq,
        glide: freq * 1.03,
        quando: t + i * 0.34,
        dur: 0.52,
        vol: 0.055 - i * 0.006,
        ataque: 0.1,
        tipo: 'sine',
        abafo: 1600,
      });
    });
  },

  /**
   * CAVAR: tres pas de terra, e nada mais.
   *
   * Terra nao tem NOTA — tem so ruido. Por isso a receita e quase toda
   * `chiado`, com o filtro caindo de 900 para 240 Hz: e a queda do filtro que
   * faz o ouvido ouvir "colher raspando e terra caindo" em vez de "chuveiro".
   * O tom grave por baixo de cada pa e o baque da terra no chao, curto demais
   * para virar nota (0,07 s) — sem ele o som fica leve como areia de praia.
   *
   * As tres pas ficam mais FRACAS e mais graves a cada uma: a primeira e a que
   * quebra a terra dura, e dali em diante e so tirar o que ja esta solto.
   */
  cavar: ({ ctx, destino, t }) => {
    for (let i = 0; i < 3; i++) {
      const quando = t + i * 0.19;
      chiado(ctx, destino, {
        quando,
        dur: 0.16,
        vol: 0.11 - i * 0.02,
        freq: 900 - i * 180,
        glide: 240,
        q: 0.8,
      });
      tom(ctx, destino, {
        freq: 130 - i * 14,
        glide: 70,
        quando: quando + 0.03,
        dur: 0.07,
        vol: 0.06 - i * 0.012,
        tipo: 'sine',
      });
    }
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
