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
  | 'caixa'
  | 'louca'
  | 'pinguim'
  | 'balido'
  | 'menu'
  | 'diario'
  | 'recomecar'
  // a apostila do Gatito: a folha virando, o acerto e o erro (que é gentil: errar não pune)
  | 'folhear'
  | 'acertou'
  | 'errou'
  // o jato do regador e as cartas do jardim (§6 do plano: um som por carta que muda o jato)
  | 'jato'
  | 'jatoLongo'
  | 'jatoForte'
  | 'jatoArco'
  // as FERRAMENTAS da estufa (`minigames/jardim/armas.ts`): cada uma com o seu som
  | 'tiroPistola'
  | 'borrifada'
  | 'mangueira'
  | 'jatao'
  | 'carga'
  | 'respingo'
  | 'tranco'
  | 'gelo'
  | 'bolha'
  | 'estouro'
  | 'mira'
  | 'pingo'
  | 'anel'
  | 'balde'
  | 'ronco'
  | 'geiser'
  | 'arcoIris'
  | 'trovao'
  | 'chuvinha'
  | 'vapor'
  | 'sacudida'
  // as cartas do jardim que não mexem no jato
  | 'grito'
  | 'assobio'
  | 'nhac'
  | 'ardido'
  | 'clique'
  | 'martelo'
  | 'brotar'
  // a noite na clareira: o zíper da barraca, o grilo e o passarinho da manhã
  | 'ziper'
  | 'grilo'
  | 'passarinho'
  // o Bebito book: a caneta riscando o papel e o clique da caneta trocando de mão
  | 'rabisco'
  | 'caneta'
  // a cozinha do fogareiro (etapa D do acampamento)
  | 'gasDoFogareiro'
  | 'faisca'
  | 'chamaAcende'
  | 'chamaApaga'
  | 'tampaTremendo'
  | 'despejar'
  | 'fritar'
  | 'colherNaCaneca'
  | 'virar'
  | 'radioLiga'
  | 'radioDesliga'
  | 'antena'
  | 'vagaLume'
  | 'soltarVagaLumes'
  | 'constelacao'
  | 'estrelaCadente'
  // o lago de cara nova: a pedrinha quicando e afundando, o peixe pulando, a
  // garça, as asas, o tigre-d'água caindo n'água, o dedo na água, a moedinha e
  // o patinho
  | 'quique'
  | 'ploft'
  | 'tibum'
  | 'peixePula'
  | 'garca'
  | 'asas'
  | 'ploc'
  | 'gota'
  | 'moeda'
  | 'piado'
  // o ônibus da festa de Halloween chegando: a buzina, o motor, o freio de ar e a porta
  | 'buzina'
  | 'motorDoOnibus'
  | 'freioDoOnibus'
  | 'portaDoOnibus'
  | 'luzesAcendendo'
  | 'surpresa'
  // a caça de doces ou travessuras: as balas caindo na cestinha de abóbora
  | 'balas';

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

  // ------------------------------------------------------- o jato do regador
  /*
   * O JATO DO REGADOR E AS CARTAS DO JARDIM.
   *
   * O `jato` é o som que MAIS toca na rodada — um a cada cadência, a rodada
   * inteira —, então ele é quase um sopro: um "fsh" curto de água saindo do
   * crivo, alternando dois timbres com `n` para não virar metrônomo. Cada
   * carta que muda o jato muda o som dele (a tabela do §6 do plano), e todo o
   * resto é curto e baixo pela mesma razão.
   */
  jato: ({ ctx, destino, t, n }) => {
    const par = n % 2 === 0;
    chiado(ctx, destino, { quando: t, dur: 0.34, vol: 0.06, freq: par ? 3400 : 2900, glide: 1200, q: 0.8 });
    chiado(ctx, destino, { quando: t + 0.01, dur: 0.18, vol: 0.022, freq: 5600, q: 1.4, tipo: 'highpass' });
  },

  // a Mangueira: o mesmo sopro, comprido e fino — "fshhhhh"
  jatoLongo: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.95, vol: 0.055, freq: 4200, glide: 2200, q: 1.1 });
  },

  // a Pressão (e o primeiro jato de tanque cheio): um estalo de pressão na frente do sopro
  jatoForte: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 190, glide: 90, quando: t, dur: 0.1, vol: 0.09, tipo: 'sine' });
    chiado(ctx, destino, { quando: t, dur: 0.28, vol: 0.085, freq: 2600, glide: 900, q: 0.7 });
  },

  // o Jato em arco: a água sobe assobiando e desce
  jatoArco: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 12), glide: nota(DO + 19), quando: t, dur: 0.22, vol: 0.035, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 19), glide: nota(DO + 7), quando: t + 0.2, dur: 0.24, vol: 0.03, tipo: 'sine' });
    chiado(ctx, destino, { quando: t, dur: 0.2, vol: 0.035, freq: 3400, glide: 1800, q: 0.8 });
  },

  /*
   * a PISTOLA D'ÁGUA: o "tic" do gatilho de plástico, um "piu" de brinquedo que
   * cai uma oitava e o esguicho curto e seco — bem mais agudo e rápido que o
   * sopro do regador. O "piu" alterna dó e ré (`n`), senão os tiros seguidos
   * viram metrônomo
   */
  tiroPistola: ({ ctx, destino, t, n }) => {
    tom(ctx, destino, { freq: nota(DO + 31), quando: t, dur: 0.018, vol: 0.03, tipo: 'square', abafo: 2400 });
    const topo = n % 2 === 0 ? DO + 24 : DO + 26;
    tom(ctx, destino, { freq: nota(topo), glide: nota(topo - 12), quando: t + 0.012, dur: 0.09, vol: 0.045, tipo: 'sine' });
    chiado(ctx, destino, { quando: t + 0.01, dur: 0.15, vol: 0.07, freq: 5200, glide: 2400, q: 1.3 });
  },

  /*
   * o BORRIFADOR: o "tic" do gatilho de plástico e o "psst" da névoa — um
   * sopro bem agudo e aerado (7 kHz descendo), mais curto e mais leve que o
   * "fsh" do regador, com uma notinha de sininho por cima que alterna mi e sol
   * (`n`), para a névoa soar leve e não virar metrônomo no aperto seguido
   */
  borrifada: ({ ctx, destino, t, n }) => {
    tom(ctx, destino, { freq: nota(DO + 36), quando: t, dur: 0.014, vol: 0.018, tipo: 'triangle' });
    chiado(ctx, destino, { quando: t + 0.006, dur: 0.2, vol: 0.05, freq: 7200, glide: 5000, q: 0.7 });
    chiado(ctx, destino, { quando: t + 0.006, dur: 0.13, vol: 0.016, freq: 2600, q: 0.9 });
    tom(ctx, destino, { freq: nota(n % 2 ? DO + 28 : DO + 31), quando: t + 0.03, dur: 0.18, vol: 0.016, tipo: 'sine' });
  },

  /*
   * a MANGUEIRA: água correndo pela borracha — um sopro mais GRAVE e cheio que
   * o do regador (1,5 kHz, e não 3 kHz), com um fiozinho de chiado em cima e um
   * "glub" de bolha a cada três jatos. Ela atira três vezes por segundo, e cada
   * sopro SEGURA o volume mais que o intervalo (`sustenta`): eles emendam num
   * jorro contínuo e baixinho, com só um empurrãozinho a cada jato — sem isso
   * soava "fsh… fsh… fsh…", de irrigador, e não de mangueira
   */
  mangueira: ({ ctx, destino, t, n }) => {
    chiado(ctx, destino, { quando: t, dur: 0.62, vol: 0.024, freq: 1500, glide: 1150, q: 0.6, sustenta: 0.6 });
    chiado(ctx, destino, { quando: t + 0.02, dur: 0.5, vol: 0.008, freq: 5200, q: 1, tipo: 'highpass', sustenta: 0.6 });
    if (n % 3 === 0) {
      tom(ctx, destino, { freq: nota(DO - 5), glide: nota(DO - 12), quando: t + 0.05, dur: 0.08, vol: 0.022, tipo: 'sine' });
    }
  },

  // o Jato carregado soltando: o jatão, grave e largo
  jatao: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 150, glide: 60, quando: t, dur: 0.3, vol: 0.12, tipo: 'triangle' });
    chiado(ctx, destino, { quando: t, dur: 0.55, vol: 0.13, freq: 1800, glide: 500, q: 0.5 });
    chiado(ctx, destino, { quando: t + 0.02, dur: 0.3, vol: 0.05, freq: 5200, q: 1, tipo: 'highpass' });
  },

  // o Jato carregado ficando pronto: um zumbido que sobe e fecha num brilho
  carga: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO - 12), glide: nota(DO + 7), quando: t, dur: 0.42, vol: 0.05, tipo: 'triangle', ataque: 0.2 });
    tom(ctx, destino, { freq: nota(DO + 19), quando: t + 0.36, dur: 0.3, vol: 0.05, tipo: 'sine' });
  },

  // a água batendo no bicho: um "plic" curtinho (toca muito, então é baixo)
  respingo: ({ ctx, destino, t, n }) => {
    chiado(ctx, destino, { quando: t, dur: 0.16, vol: 0.05, freq: n % 2 ? 1900 : 1600, glide: 600, q: 1 });
    tom(ctx, destino, { freq: 520, glide: 260, quando: t, dur: 0.06, vol: 0.03, tipo: 'sine' });
  },

  // a Gota pesada: o "tum" abafado do bicho sendo empurrado
  tranco: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 120, glide: 55, quando: t, dur: 0.16, vol: 0.12, tipo: 'sine' });
    chiado(ctx, destino, { quando: t, dur: 0.1, vol: 0.04, freq: 400, q: 0.8, tipo: 'lowpass' });
  },

  // a Gota gelada: o tilintar do gelo, duas notas altas da pentatônica
  gelo: ({ ctx, destino, t, n }) => {
    const [a, b] = n % 2 ? [PENTA[5], PENTA[7]] : [PENTA[4], PENTA[6]];
    tom(ctx, destino, { freq: nota(DO + 24 + a), quando: t, dur: 0.22, vol: 0.035, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 24 + b), quando: t + 0.06, dur: 0.26, vol: 0.03, tipo: 'sine' });
  },

  // a Água com sabão: o jato sai borbulhando — "ploc ploc"
  bolha: ({ ctx, destino, t }) => {
    for (const [atraso, base] of [[0, 380], [0.07, 520]] as const) {
      tom(ctx, destino, { freq: base, glide: base * 2.2, quando: t + atraso, dur: 0.07, vol: 0.05, tipo: 'sine', ataque: 0.004 });
    }
  },

  // a bolha grande estourando
  estouro: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.2, vol: 0.09, freq: 2600, glide: 800, q: 0.9 });
    tom(ctx, destino, { freq: 900, glide: 300, quando: t, dur: 0.12, vol: 0.06, tipo: 'triangle' });
  },

  // as Miras: o "tic" do alvinho fechando no bicho
  mira: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 24), quando: t, dur: 0.04, vol: 0.035, tipo: 'square', abafo: 3000 });
    tom(ctx, destino, { freq: nota(DO + 31), quando: t + 0.05, dur: 0.05, vol: 0.03, tipo: 'square', abafo: 3000 });
  },

  // a Garoa: pingos caindo atrás de você
  pingo: ({ ctx, destino, t, n }) => {
    const f = n % 2 ? 1500 : 1250;
    tom(ctx, destino, { freq: f, glide: f * 0.6, quando: t, dur: 0.11, vol: 0.045, tipo: 'sine' });
  },

  // o Crivo giratório: a água girando em volta — um "vuuush" que sobe e desce
  anel: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.24, vol: 0.07, freq: 700, glide: 3200, q: 0.9 });
    chiado(ctx, destino, { quando: t + 0.2, dur: 0.26, vol: 0.06, freq: 3200, glide: 900, q: 0.9 });
  },

  // o Balde: o tanque inteiro de uma vez no chão
  balde: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.7, vol: 0.16, freq: 1500, glide: 300, q: 0.5 });
    tom(ctx, destino, { freq: 200, glide: 70, quando: t + 0.05, dur: 0.3, vol: 0.1, tipo: 'sine' });
  },

  // o Gêiser em dois tempos: o chão roncando (a rachadura)…
  ronco: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 58, glide: 72, quando: t, dur: 0.6, vol: 0.13, tipo: 'sawtooth', abafo: 260, ataque: 0.15 });
    chiado(ctx, destino, { quando: t, dur: 0.6, vol: 0.05, freq: 220, q: 0.7, tipo: 'lowpass' });
  },
  // …e o jorro subindo
  geiser: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.9, vol: 0.15, freq: 700, glide: 3400, q: 0.5 });
    tom(ctx, destino, { freq: 110, glide: 220, quando: t, dur: 0.3, vol: 0.1, tipo: 'triangle' });
  },

  // o Arco-íris: um acorde que abre, nota por nota
  arcoIris: ({ ctx, destino, t }) => {
    [0, 2, 4, 7, 9, 12].forEach((grau, i) => {
      tom(ctx, destino, { freq: nota(DO + 12 + grau), quando: t + i * 0.045, dur: 0.5, vol: 0.035, tipo: 'sine' });
    });
  },

  // a Chuva: um trovão baixinho, longe — o jogo é fofo, não é tempestade
  trovao: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 1.1, vol: 0.13, freq: 160, q: 0.6, tipo: 'lowpass' });
    tom(ctx, destino, { freq: 48, glide: 38, quando: t + 0.05, dur: 0.9, vol: 0.08, tipo: 'sine', ataque: 0.1 });
  },
  // a chuva fina caindo (a Chuva e a Dança da chuva)
  chuvinha: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 1.2, vol: 0.05, freq: 3400, q: 0.6 });
    chiado(ctx, destino, { quando: t + 0.1, dur: 1, vol: 0.035, freq: 1800, q: 0.9 });
  },

  // o Orvalho e a Água morna: vapor chiando
  vapor: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.45, vol: 0.04, freq: 4200, glide: 5600, q: 0.9 });
  },

  // o bicho encharcado sacudindo a água: "brrr", três sacudidas rápidas
  sacudida: ({ ctx, destino, t }) => {
    for (let i = 0; i < 3; i++) {
      chiado(ctx, destino, { quando: t + i * 0.08, dur: 0.12, vol: 0.1 - i * 0.02, freq: 1300 + i * 200, glide: 700, q: 1 });
    }
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

  /**
   * A REGISTRADORA fechando: o "tlim" da gaveta e o baque dela voltando.
   *
   * O tlim tem que soar METALICO, e metal aqui e duas senoides desafinadas de
   * proposito (a segunda com `detune`): afinadas viram flauta.
   */
  caixa: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 19), quando: t, dur: 0.42, vol: 0.1, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 24), quando: t, dur: 0.3, vol: 0.05, tipo: 'sine', detune: 22 });
    chiado(ctx, destino, { quando: t + 0.16, dur: 0.14, vol: 0.06, freq: 500, glide: 180, q: 1.2 });
    tom(ctx, destino, { freq: 150, glide: 80, quando: t + 0.2, dur: 0.12, vol: 0.07, tipo: 'sine' });
  },

  /**
   * A PILHA DE LOUCA batendo no balcao. Tres tinidos quase juntos e um baque —
   * prato nunca cai sozinho, cai a pilha. Espacados demais viram xilofone,
   * entao os intervalos sao de 40 e 30 ms, no limite do que o ouvido separa.
   */
  louca: ({ ctx, destino, t }) => {
    [0, 0.05, 0.09].forEach((atraso, i) => {
      tom(ctx, destino, {
        freq: nota(DO + 16 + i * 3),
        quando: t + atraso,
        dur: 0.15,
        vol: 0.085 - i * 0.016,
        tipo: 'triangle',
        abafo: 3600,
      });
    });
    tom(ctx, destino, { freq: 190, glide: 110, quando: t + 0.07, dur: 0.12, vol: 0.075, tipo: 'sine' });
  },

  /**
   * O GRASNADO DO MANO, o pinguim do quiosque.
   *
   * Pinguim de verdade zurra: duas notas NASAIS e curtas, a primeira mais alta
   * que a segunda. O que faz soar nasal e o `abafo` baixo (900 Hz) sobre uma
   * onda `sawtooth` — a serra tem harmonico de sobra, e o filtro derruba tudo
   * o que passa dali, que e exatamente o que um nariz faz.
   *
   * O GLIDE PARA BAIXO em cada silaba e o que separa bicho de apito: tom plano
   * sai como brinquedo, foi o que o miado ensinou.
   */
  pinguim: ({ ctx, destino, t }) => {
    for (const [i, atraso] of [0, 0.19].entries()) {
      const base = i === 0 ? 520 : 430;
      tom(ctx, destino, {
        freq: base,
        glide: base * 0.68,
        quando: t + atraso,
        dur: 0.17,
        vol: 0.085 - i * 0.012,
        ataque: 0.008,
        tipo: 'sawtooth',
        abafo: 900,
      });
      // o sopro de ar por cima, que tira o resto do ar de sintetizador
      chiado(ctx, destino, { quando: t + atraso, dur: 0.09, vol: 0.03, freq: 1800, glide: 900, q: 1.2 });
    }
  },

  /**
   * O BALIDO DA OVELHA da lojinha — o "bêêê".
   *
   * O QUE FAZ SER OVELHA E O TREMIDO, e não a nota. Um "bê" liso é um berrante;
   * o que o ouvido reconhece é a voz VIBRANDO em cima da nota. Não há vibrato no
   * `tom`, então ele é montado à mão: seis pedacinhos de 0,07 s em fila, cada um
   * alternando 6% acima e 6% abaixo da nota que está descendo. O ouvido cola os
   * seis num som só e ouve o tremido.
   *
   * O ATAQUE É O "B": um sopro curtinho antes da nota, senão a voz começa do
   * nada e sai "êêê", sem a consoante que abre o balido.
   *
   * `sawtooth` com `abafo` baixo, pelo mesmo motivo do pinguim: serra tem
   * harmônico de sobra e o filtro fechado faz ela soar pelo nariz.
   */
  balido: ({ ctx, destino, t, n }) => {
    // duas vozes, para ela não repetir igual toda vez: uma mais aguda e curta
    const manso = n % 2 === 0;
    const base = manso ? 430 : 380;
    chiado(ctx, destino, { quando: t, dur: 0.06, vol: 0.03, freq: 1400, glide: 700, q: 1 });
    const PEDACOS = manso ? 6 : 7;
    for (let i = 0; i < PEDACOS; i++) {
      const caindo = base * (1 - i * 0.022);
      const tremido = i % 2 === 0 ? 1.06 : 0.94;
      tom(ctx, destino, {
        freq: caindo * tremido,
        glide: caindo * (i % 2 === 0 ? 0.94 : 1.06),
        quando: t + 0.03 + i * 0.068,
        // cada pedaço dura um pouco mais que o passo, para eles se emendarem:
        // com 0,068 cravado sobra um buraco entre um e outro e sai um tremolo
        // picotado em vez de voz
        dur: 0.1,
        vol: (i === 0 ? 0.085 : 0.075) * (1 - i * 0.06),
        ataque: 0.01,
        tipo: 'sawtooth',
        abafo: 1000,
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

  // ------------------------------------------- as cartas do jardim, fora do jato
  /*
   * O QUE AS CARTAS DE JARDINEIRO E DE JARDIM FAZEM TAMBÉM SE OUVE. Todos
   * curtos, e nenhum no registro do jato (o chiado agudo): na rodada eles
   * tocam por cima da água, e o ouvido precisa separar um do outro.
   */
  // o Grito: um "ÊI!" de megafone — serra abafada que sobe e cai, com o ar na frente
  grito: ({ ctx, destino, t }) => {
    for (const [freq, det] of [[nota(DO - 5), 0], [nota(DO + 2), 8]] as const) {
      tom(ctx, destino, {
        // 0,6 s de envelope para render ~0,35 s audíveis: o decaimento é
        // exponencial, e com 0,3 s o grito saía um "ê" de 0,17 s (medido no .wav)
        freq: freq * 0.9, glide: freq * 1.08, quando: t, dur: 0.6, vol: 0.085,
        ataque: 0.03, tipo: 'sawtooth', abafo: 1600, detune: det,
      });
    }
    chiado(ctx, destino, { quando: t, dur: 0.4, vol: 0.05, freq: 1200, glide: 800, q: 1.2 });
  },

  // o Assobio: fiu-fiuuu, três notas subindo na pentatônica
  assobio: ({ ctx, destino, t }) => {
    const notas = [DO + 12 + PENTA[2], DO + 12 + PENTA[4], DO + 12 + PENTA[5]];
    notas.forEach((n, i) => {
      tom(ctx, destino, {
        freq: nota(n) * 0.97, glide: nota(n), quando: t + i * 0.13, dur: i === 2 ? 0.4 : 0.14,
        vol: 0.05, ataque: 0.02, tipo: 'sine',
      });
    });
  },

  // a Planta carnívora fechando a boca: um estalo seco e um baque grave
  nhac: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.06, vol: 0.12, freq: 2200, q: 2 });
    tom(ctx, destino, { freq: 150, glide: 70, quando: t + 0.02, dur: 0.18, vol: 0.12, tipo: 'sine' });
  },

  // a pimenta ardendo: um chiado de frigideira e um "ui" agudo que cai
  ardido: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.7, vol: 0.05, freq: 4800, glide: 3000, q: 0.6, tipo: 'highpass' });
    tom(ctx, destino, { freq: nota(DO + 19), glide: nota(DO + 12), quando: t + 0.05, dur: 0.22, vol: 0.05, tipo: 'triangle' });
  },

  // o cadeado abrindo: dois cliques de metal
  clique: ({ ctx, destino, t }) => {
    for (const atraso of [0, 0.09]) {
      chiado(ctx, destino, { quando: t + atraso, dur: 0.08, vol: 0.2, freq: 3600, q: 3 });
      tom(ctx, destino, { freq: 1900, quando: t + atraso, dur: 0.09, vol: 0.05, tipo: 'square', abafo: 3000 });
    }
  },

  // as tábuas sendo pregadas no portão: três marteladas
  martelo: ({ ctx, destino, t }) => {
    for (const atraso of [0, 0.22, 0.44]) {
      tom(ctx, destino, { freq: 240, glide: 120, quando: t + atraso, dur: 0.12, vol: 0.11, tipo: 'triangle' });
      chiado(ctx, destino, { quando: t + atraso, dur: 0.05, vol: 0.08, freq: 2600, q: 1.5 });
    }
  },

  // o que brota: um arpejo curtinho subindo, como uma muda se esticando
  brotar: ({ ctx, destino, t }) => {
    [0, 2, 4, 5].forEach((g, i) => {
      tom(ctx, destino, { freq: nota(DO + PENTA[g]), quando: t + i * 0.07, dur: 0.22, vol: 0.05, tipo: 'triangle' });
    });
  },

  // ------------------------------------------------------------------ ui
  menu: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 2), quando: t, dur: 0.1, vol: 0.09, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO + 9), quando: t + 0.06, dur: 0.14, vol: 0.07, tipo: 'triangle' });
  },

  diario: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.22, vol: 0.09, freq: 1200, glide: 3000, q: 0.6 });
  },

  // a folha da apostila virando: o papel levanta (sobe) e assenta do outro lado (desce)
  folhear: ({ ctx, destino, t, n }) => {
    chiado(ctx, destino, { quando: t, dur: 0.2, vol: 0.075, freq: 1500 + (n % 2) * 250, glide: 4200, q: 0.5 });
    chiado(ctx, destino, { quando: t + 0.17, dur: 0.16, vol: 0.05, freq: 3000, glide: 1100, q: 0.7 });
  },

  // resposta certa na apostila: dois sininhos subindo, curtinhos
  acertou: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 12), quando: t, dur: 0.1, vol: 0.085, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO + 19), quando: t + 0.07, dur: 0.2, vol: 0.075, tipo: 'sine' });
  },

  // resposta errada: um "hum" macio que desce — aviso, nunca castigo
  errou: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: nota(DO + 4), glide: nota(DO + 2), quando: t, dur: 0.13, vol: 0.07, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO - 3), quando: t + 0.11, dur: 0.2, vol: 0.06, tipo: 'triangle', abafo: 1600 });
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
  /*
   * A CANETA NO PAPEL, uma letra do Bebito book: um risquinho de chiado agudo
   * e curtíssimo, bem baixo — toca a cada tecla, então tem que sumir debaixo
   * de tudo (a régua do `passo`). O `n` muda o filtro e o tamanho: duas
   * letras seguidas nunca riscam igual.
   */
  rabisco: ({ ctx, destino, t, n }) => {
    // o chiado passa-banda perde quase toda a energia no filtro: o pico de
    // verdade sai em ~0,04, o mesmo da letra do diálogo (medido no .wav)
    chiado(ctx, destino, {
      quando: t, dur: 0.05 + (n % 3) * 0.012, vol: 0.064, sustenta: 0.4,
      freq: 3000 + (n % 4) * 380, glide: 2200 + (n % 2) * 1100, q: 1.4,
    });
  },

  // a caneta trocando de mão: o botão de esferográfica — o clique descendo e a ponta saindo
  caneta: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.03, vol: 0.12, freq: 4400, q: 3 });
    tom(ctx, destino, { freq: nota(DO + 24), quando: t, dur: 0.035, vol: 0.03, tipo: 'triangle' });
    chiado(ctx, destino, { quando: t + 0.075, dur: 0.028, vol: 0.1, freq: 3100, q: 3 });
    tom(ctx, destino, { freq: nota(DO + 19), quando: t + 0.075, dur: 0.045, vol: 0.028, tipo: 'triangle' });
  },

  // ------------------------------------------- a cozinha do fogareiro
  /*
   * O GÁS SAINDO do fogareiro aceso: um chiado agudo e baixinho, que a
   * cozinha toca a cada 0,55 s com `sustenta` e duração maior que o
   * intervalo — um sopro emenda no outro (a técnica da mangueira) e soa
   * contínuo, como gás de verdade.
   */
  gasDoFogareiro: ({ ctx, destino, t, n }) => {
    chiado(ctx, destino, { quando: t, dur: 0.8, vol: 0.016, freq: 5200 + (n % 2) * 300, q: 0.7, tipo: 'highpass', sustenta: 0.7 });
  },

  // o acendedor piezo: um estalo seco e agudo, com um "tic" de metal por cima
  faisca: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.03, vol: 0.13, freq: 6000, q: 4 });
    tom(ctx, destino, { freq: nota(DO + 31), quando: t, dur: 0.025, vol: 0.02, tipo: 'square', abafo: 5000 });
  },

  // a chama pegando: o "fum" grave do gás inflamando, que abre e assenta
  chamaAcende: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.42, vol: 0.13, freq: 500, glide: 1600, q: 0.6, tipo: 'lowpass' });
    tom(ctx, destino, { freq: 95, glide: 62, quando: t, dur: 0.3, vol: 0.07, tipo: 'sine' });
  },

  // fechou o gás: um "puf" curtinho
  chamaApaga: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.2, vol: 0.14, freq: 900, glide: 260, q: 0.8, tipo: 'lowpass' });
  },

  // a tampa da panelinha pulando na boca: dois tilintares de alumínio
  tampaTremendo: ({ ctx, destino, t, n }) => {
    tom(ctx, destino, { freq: nota(DO + 26 + (n % 2) * 2), quando: t, dur: 0.05, vol: 0.035, tipo: 'triangle' });
    tom(ctx, destino, { freq: nota(DO + 31), quando: t + 0.045, dur: 0.06, vol: 0.026, tipo: 'triangle' });
    chiado(ctx, destino, { quando: t, dur: 0.03, vol: 0.035, freq: 4200, q: 3 });
  },

  /*
   * DESPEJAR: o fio de líquido caindo na caneca — um chiado de banda do meio
   * que dura o despejo inteiro, mais três "glub" subindo (o nível chegando
   * perto da boca deixa o som mais agudo, como numa caneca de verdade).
   */
  despejar: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 1.6, vol: 0.05, freq: 1100, glide: 1700, q: 1.6, sustenta: 0.75 });
    [0.25, 0.7, 1.15].forEach((d, i) => {
      tom(ctx, destino, { freq: nota(DO - 5 + i * 4), glide: nota(DO + i * 4), quando: t + d, dur: 0.09, vol: 0.03, tipo: 'sine' });
    });
  },

  // a manteiga e a arepa no budare quente: o chiado de fritura, com os estalinhos
  fritar: ({ ctx, destino, t, n }) => {
    chiado(ctx, destino, { quando: t, dur: 0.7, vol: 0.028, freq: 4800, q: 0.6, tipo: 'highpass', sustenta: 0.5 });
    for (let i = 0; i < 5; i++) {
      const d = ((n * 7 + i * 13) % 17) / 17 * 0.55;
      chiado(ctx, destino, { quando: t + d, dur: 0.018, vol: 0.05, freq: 3000 + i * 400, q: 3 });
    }
  },

  // a colher batendo na lata ou na beira da panela: um "tlim" fininho
  colherNaCaneca: ({ ctx, destino, t, n }) => {
    tom(ctx, destino, { freq: nota(DO + 24 + (n % 3) * 2), quando: t, dur: 0.09, vol: 0.04, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 36), quando: t, dur: 0.04, vol: 0.012, tipo: 'sine' });
  },

  // a arepa caindo (ou virando) no budare: um "tuc" macio
  virar: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.06, vol: 0.07, freq: 700, q: 1.2, tipo: 'lowpass' });
    tom(ctx, destino, { freq: 210, glide: 160, quando: t, dur: 0.07, vol: 0.05, tipo: 'sine' });
  },

  // ------------------------------------------------- o radinho de pilha
  /*
   * LIGAR O RADINHO: o clique do botão de volume (um estalo de plástico) e a
   * estática da sintonia — o chiado que varre de grave para agudo enquanto a
   * agulha corre, com um assobio fininho de estação passando no meio. ~1 s,
   * o tempo da agulha chegar no coraçãozinho do mostrador.
   */
  radioLiga: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.025, vol: 0.3, freq: 2600, q: 3 });
    tom(ctx, destino, { freq: nota(DO + 7), quando: t, dur: 0.03, vol: 0.03, tipo: 'square', abafo: 3000 });
    chiado(ctx, destino, { quando: t + 0.08, dur: 0.95, vol: 0.085, freq: 900, glide: 3600, q: 1.4, tipo: 'bandpass', sustenta: 0.6 });
    tom(ctx, destino, { freq: nota(DO + 19), glide: nota(DO + 24), quando: t + 0.42, dur: 0.22, vol: 0.012, tipo: 'sine' });
  },

  // desligar: o mesmo clique, e a estática que some num "fff" descendo
  radioDesliga: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.025, vol: 0.3, freq: 2300, q: 3 });
    chiado(ctx, destino, { quando: t + 0.02, dur: 0.28, vol: 0.07, freq: 2600, glide: 700, q: 1.2, tipo: 'bandpass' });
  },

  // a antena telescópica esticando: os gomos estalando um depois do outro, subindo
  antena: ({ ctx, destino, t }) => {
    for (const [i, grau] of [0, 4, 7].entries()) {
      const q = t + i * 0.12;
      tom(ctx, destino, { freq: nota(DO + 24 + grau), quando: q, dur: 0.05, vol: 0.04, tipo: 'triangle' });
      chiado(ctx, destino, { quando: q, dur: 0.02, vol: 0.11, freq: 5200, q: 4 });
    }
  },

  // ------------------------------------------------- o pote de vaga-lumes
  // pegou um: o "plim" de vidro de quando ele entra, e a tampa de lata fechando
  vagaLume: ({ ctx, destino, t, n }) => {
    const grau = [0, 4, 7, 9, 12][n % 5];
    tom(ctx, destino, { freq: nota(DO + 19 + grau), quando: t, dur: 0.22, vol: 0.06, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 31 + grau), quando: t + 0.01, dur: 0.12, vol: 0.016, tipo: 'sine' });
    chiado(ctx, destino, { quando: t + 0.42, dur: 0.03, vol: 0.16, freq: 3400, q: 3 });
    tom(ctx, destino, { freq: nota(DO + 7), quando: t + 0.42, dur: 0.04, vol: 0.03, tipo: 'triangle' });
  },

  // abriu o pote: a tampa estalando e os vaga-lumes subindo num arpejo brilhante
  soltarVagaLumes: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.04, vol: 0.16, freq: 3000, q: 3 });
    for (const [i, grau] of [0, 4, 7, 12, 16, 19].entries()) {
      tom(ctx, destino, { freq: nota(DO + 12 + grau), quando: t + 0.08 + i * 0.075, dur: 0.3, vol: 0.05 - i * 0.004, tipo: 'sine' });
    }
    chiado(ctx, destino, { quando: t + 0.08, dur: 0.55, vol: 0.03, freq: 6500, glide: 9000, q: 0.8, tipo: 'highpass' });
  },

  // ------------------------------------------------- olhar as estrelas
  // acharam o coração: um carrilhão de vidro bem baixinho, descendo devagar
  constelacao: ({ ctx, destino, t }) => {
    for (const [i, grau] of [24, 19, 16, 12].entries()) {
      tom(ctx, destino, { freq: nota(DO + grau), quando: t + i * 0.16, dur: 0.6, vol: 0.04, tipo: 'sine' });
      tom(ctx, destino, { freq: nota(DO + grau) * 2, quando: t + i * 0.16, dur: 0.15, vol: 0.008, tipo: 'sine' });
    }
  },

  // a estrela cadente: um "fiiu" agudo que desce e um brilhinho no fim
  estrelaCadente: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 1.1, vol: 0.035, freq: 7800, glide: 2600, q: 2.2, tipo: 'bandpass', sustenta: 0.5 });
    tom(ctx, destino, { freq: nota(DO + 31), glide: nota(DO + 19), quando: t, dur: 1.0, vol: 0.022, tipo: 'sine' });
    for (const [i, grau] of [28, 31, 36].entries()) {
      tom(ctx, destino, { freq: nota(DO + grau), quando: t + 0.95 + i * 0.07, dur: 0.25, vol: 0.022, tipo: 'sine' });
    }
  },

  // ------------------------------------------------- a noite na clareira
  /*
   * O ZÍPER DA BARRACA fechando (e abrindo): os dentinhos passando um a um —
   * uma fila de estalinhos de ruído, cada vez mais agudos e mais juntos —
   * por cima de um "zzzz" contínuo que sobe. ~0,8 s, o tempo do puxador dar a
   * volta no D da porta.
   */
  ziper: ({ ctx, destino, t, n }) => {
    const sobe = n % 2 === 0;
    chiado(ctx, destino, {
      quando: t, dur: 0.82, vol: 0.05, freq: sobe ? 1700 : 3300, glide: sobe ? 3300 : 1700, q: 1.2, sustenta: 0.75,
    });
    // os dentes: o filtro estreito come quase todo o ruído, então o volume
    // de cada estalinho é alto para ele sobressair do "zzzz" (medido no .wav)
    let quando = t;
    for (let i = 0; i < 16; i++) {
      const k = sobe ? i / 15 : 1 - i / 15;
      chiado(ctx, destino, { quando, dur: 0.028, vol: 0.2, freq: 2200 + k * 2200, q: 2.4, tipo: 'bandpass' });
      quando += 0.06 - 0.025 * (i / 15);
    }
  },

  // O GRILO: três trinadinhos agudos e curtos, baixinho (é fundo de noite)
  grilo: ({ ctx, destino, t, n }) => {
    const freq = n % 3 === 0 ? 4400 : n % 3 === 1 ? 4150 : 4600;
    for (let i = 0; i < 3; i++) {
      tom(ctx, destino, { freq, glide: freq * 0.97, quando: t + i * 0.075, dur: 0.045, vol: 0.022, ataque: 0.006, tipo: 'sine' });
    }
  },

  // O PASSARINHO da manhã: dois piados que sobem e descem, na pentatônica
  passarinho: ({ ctx, destino, t, n }) => {
    const alto = n % 2 === 0 ? DO + 24 : DO + 26;
    tom(ctx, destino, { freq: nota(alto), glide: nota(alto + 7), quando: t, dur: 0.09, vol: 0.05, ataque: 0.008, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(alto + 9), glide: nota(alto + 4), quando: t + 0.14, dur: 0.12, vol: 0.045, ataque: 0.008, tipo: 'sine' });
  },

  // ---------------------------------------------------------------- o lago
  /*
   * A PEDRINHA QUICANDO: um "tic" de pedra na água — o estalinho seco e um
   * plim curto por cima, subindo na pentatônica a cada quique (o `n` conta as
   * vezes, e os quiques de uma pedra vêm em fila), então a sequência inteira
   * soa como uma escadinha acelerando.
   */
  quique: ({ ctx, destino, t, n }) => {
    const grau = PENTA[n % 6];
    chiado(ctx, destino, { quando: t, dur: 0.07, vol: 0.12, freq: 2600, glide: 1400, q: 1.4 });
    tom(ctx, destino, { freq: nota(DO + 12 + grau), glide: nota(DO + 7 + grau), quando: t, dur: 0.11, vol: 0.05, ataque: 0.004, tipo: 'sine' });
  },

  // a pedra afundando: o "plop" redondo, que desce, e a bolhinha depois
  ploft: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 520, glide: 170, quando: t, dur: 0.2, vol: 0.12, ataque: 0.004, tipo: 'sine' });
    chiado(ctx, destino, { quando: t, dur: 0.22, vol: 0.06, freq: 900, glide: 300, q: 0.9 });
    tom(ctx, destino, { freq: 700, glide: 1100, quando: t + 0.24, dur: 0.06, vol: 0.03, tipo: 'sine' });
  },

  // TIBUM: forte demais, a pedra entra de bico e espirra água para todo lado
  tibum: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 300, glide: 90, quando: t, dur: 0.28, vol: 0.14, ataque: 0.004, tipo: 'sine' });
    chiado(ctx, destino, { quando: t, dur: 0.5, vol: 0.13, freq: 2200, glide: 500, q: 0.6 });
  },

  // o peixe saindo (e voltando) da água: um "tchup" curto e úmido
  peixePula: ({ ctx, destino, t, n }) => {
    const sai = n % 2 === 0;
    chiado(ctx, destino, { quando: t, dur: sai ? 0.16 : 0.24, vol: 0.09, freq: sai ? 1900 : 1400, glide: sai ? 3200 : 600, q: 0.9 });
    tom(ctx, destino, { freq: sai ? 380 : 460, glide: sai ? 720 : 200, quando: t, dur: 0.12, vol: 0.06, tipo: 'sine' });
  },

  /*
   * A GARÇA: garça não canta, ela GRASNA — um "kraac" rouco e grave, duas
   * sílabas. Dente-de-serra grave, abafado, com um chiado áspero por baixo
   * para tirar o ar de buzina.
   */
  garca: ({ ctx, destino, t }) => {
    for (const [atraso, f0, f1, dur] of [[0, 210, 150, 0.2], [0.24, 185, 120, 0.26]] as const) {
      tom(ctx, destino, { freq: f0, glide: f1, quando: t + atraso, dur, vol: 0.1, tipo: 'sawtooth', abafo: 900, ataque: 0.012 });
      tom(ctx, destino, { freq: f0 * 1.51, glide: f1 * 1.5, quando: t + atraso, dur, vol: 0.035, tipo: 'square', abafo: 1200, ataque: 0.012 });
      chiado(ctx, destino, { quando: t + atraso, dur, vol: 0.05, freq: 700, q: 1.6, tipo: 'bandpass' });
    }
  },

  // as asas grandes batendo: três sopros graves, um por batida
  asas: ({ ctx, destino, t }) => {
    for (let i = 0; i < 3; i++) {
      chiado(ctx, destino, { quando: t + i * 0.22, dur: 0.18, vol: 0.09 - i * 0.015, freq: 380, glide: 900, q: 0.7, tipo: 'bandpass' });
    }
  },

  // o tigre-d'água caindo do tronco: um "ploc" pequeno e agudo
  ploc: ({ ctx, destino, t, n }) => {
    const f = n % 2 ? 820 : 720;
    tom(ctx, destino, { freq: f, glide: f * 0.42, quando: t, dur: 0.11, vol: 0.09, ataque: 0.003, tipo: 'sine' });
    chiado(ctx, destino, { quando: t, dur: 0.1, vol: 0.04, freq: 1600, glide: 700, q: 1.1 });
  },

  // o dedo (o mouse) tocando a água: um "plim" de gota, bem leve
  gota: ({ ctx, destino, t, n }) => {
    const f = n % 3 === 0 ? 1320 : n % 3 === 1 ? 1180 : 1480;
    tom(ctx, destino, { freq: f, glide: f * 0.55, quando: t, dur: 0.14, vol: 0.06, ataque: 0.003, tipo: 'sine' });
    tom(ctx, destino, { freq: f * 2.02, glide: f * 1.1, quando: t, dur: 0.05, vol: 0.012, tipo: 'sine' });
  },

  // a moedinha girando no ar: o "tlin" metálico de moeda batendo no dedo
  moeda: ({ ctx, destino, t }) => {
    for (const [atraso, grau] of [[0, 28], [0.05, 33]] as const) {
      tom(ctx, destino, { freq: nota(DO + grau), quando: t + atraso, dur: 0.35, vol: 0.035, tipo: 'triangle' });
      tom(ctx, destino, { freq: nota(DO + grau) * 2.76, quando: t + atraso, dur: 0.12, vol: 0.012, tipo: 'sine' });
    }
  },

  // o patinho: um "piu" agudinho, que sobe (às vezes dois)
  piado: ({ ctx, destino, t, n }) => {
    const f = n % 2 ? 2700 : 2450;
    tom(ctx, destino, { freq: f, glide: f * 1.3, quando: t, dur: 0.08, vol: 0.035, ataque: 0.006, tipo: 'sine' });
    if (n % 3 === 0) tom(ctx, destino, { freq: f * 1.05, glide: f * 1.35, quando: t + 0.12, dur: 0.07, vol: 0.03, ataque: 0.006, tipo: 'sine' });
  },

  /*
   * AS BALAS NA CESTA (a caça de doces ou travessuras do Halloween): um
   * punhado de balinhas de papel caindo na cestinha de plástico — seis
   * toquinhos secos, cada um descendo de tom (o plástico oco), cada vez mais
   * fracos e mais juntos, e no fim um "plim" de duas notas, que é a festa.
   */
  balas: ({ ctx, destino, t, n }) => {
    const toques = [0, 0.06, 0.11, 0.17, 0.215, 0.27];
    toques.forEach((atraso, i) => {
      const f = 1350 + ((i * 7 + n * 3) % 5) * 170;
      tom(ctx, destino, { freq: f, glide: f * 0.6, quando: t + atraso, dur: 0.05, vol: 0.085 - i * 0.008, ataque: 0.003, tipo: 'triangle' });
    });
    tom(ctx, destino, { freq: nota(DO + 24), quando: t + 0.34, dur: 0.32, vol: 0.05, ataque: 0.008, tipo: 'sine' });
    tom(ctx, destino, { freq: nota(DO + 28), quando: t + 0.4, dur: 0.34, vol: 0.042, ataque: 0.008, tipo: 'sine' });
  },

  /*
   * O ÔNIBUS DA FESTA (a cena da chegada, `eventos/halloween/chegadaDoOnibus.ts`).
   *
   * A BUZINA é o "fon-fon" simpático de ônibus de bairro, e não uma sirene:
   * duas notas de terça (mi e sol, graves, na pentatônica do jogo) tocadas
   * juntas, em dente-de-serra abafado (a corneta) com um quadrado baixinho
   * por cima (o metal), em duas buzinadas — a segunda mais comprida.
   */
  buzina: ({ ctx, destino, t }) => {
    for (const [atraso, dur] of [[0, 0.17], [0.25, 0.36]] as const) {
      for (const grau of [-20, -17]) {
        tom(ctx, destino, { freq: nota(DO + grau), quando: t + atraso, dur, vol: 0.055, ataque: 0.012, tipo: 'sawtooth', abafo: 1300, detune: grau === -20 ? -6 : 6 });
        tom(ctx, destino, { freq: nota(DO + grau) * 2, quando: t + atraso, dur, vol: 0.016, ataque: 0.012, tipo: 'square', abafo: 1800 });
      }
    }
  },

  // o motor: um "brum" grave descendo, com o ronco do escapamento por baixo (a cena toca em fila)
  motorDoOnibus: ({ ctx, destino, t, n }) => {
    const f = n % 2 ? 62 : 58;
    tom(ctx, destino, { freq: f, glide: f * 0.82, quando: t, dur: 0.55, vol: 0.09, ataque: 0.03, tipo: 'sawtooth', abafo: 260 });
    chiado(ctx, destino, { quando: t, dur: 0.5, vol: 0.05, freq: 180, glide: 120, q: 0.8, tipo: 'lowpass' });
  },

  // o freio de ar: o "pssshh" de ônibus parando, e o tranco grave antes
  freioDoOnibus: ({ ctx, destino, t }) => {
    tom(ctx, destino, { freq: 95, glide: 60, quando: t, dur: 0.16, vol: 0.08, tipo: 'sine' });
    chiado(ctx, destino, { quando: t + 0.08, dur: 0.7, vol: 0.075, freq: 4200, glide: 2400, q: 0.6, sustenta: 0.35 });
  },

  // a porta pneumática: o sopro de ar ("tsss") e o "clac" das folhas no fim; `n` par abre, ímpar fecha
  portaDoOnibus: ({ ctx, destino, t, n }) => {
    const abre = n % 2 === 0;
    chiado(ctx, destino, { quando: t, dur: 0.34, vol: 0.06, freq: abre ? 2600 : 3200, glide: abre ? 3600 : 2200, q: 0.7, sustenta: 0.3 });
    tom(ctx, destino, { freq: abre ? 240 : 200, glide: 110, quando: t + 0.3, dur: 0.08, vol: 0.07, ataque: 0.003, tipo: 'square', abafo: 700 });
  },

  // ------------------------------------------- a festa surpresa (o salão da abóbora)
  // as luzes acendendo no escuro: o "tec" do interruptor e um arpejo de vidro subindo,
  // uma nota por fio de luzinha que pega
  luzesAcendendo: ({ ctx, destino, t }) => {
    chiado(ctx, destino, { quando: t, dur: 0.035, vol: 0.14, freq: 2400, q: 2.5 });
    tom(ctx, destino, { freq: 180, glide: 120, quando: t, dur: 0.05, vol: 0.05, ataque: 0.003, tipo: 'square', abafo: 900 });
    for (const [i, grau] of [0, 4, 7, 12, 16, 19, 24].entries()) {
      tom(ctx, destino, { freq: nota(DO + 12 + grau), quando: t + 0.1 + i * 0.09, dur: 0.35, vol: 0.045 - i * 0.003, tipo: 'sine' });
      tom(ctx, destino, { freq: nota(DO + 24 + grau), quando: t + 0.1 + i * 0.09, dur: 0.08, vol: 0.01, tipo: 'triangle' });
    }
  },

  // o "SURPRESA!": três línguas de sogra desenrolando (o "fuuuu" de papel que sobe de
  // tom, um pouco fora do tempo uma da outra) e o estouro do confete por cima
  surpresa: ({ ctx, destino, t }) => {
    for (const [i, grau] of [0, 4, 7].entries()) {
      const q = t + i * 0.07;
      const f = nota(DO + grau);
      tom(ctx, destino, { freq: f * 0.9, glide: f, quando: q, dur: 0.55, vol: 0.04, ataque: 0.03, tipo: 'sawtooth', abafo: 1500, detune: (i - 1) * 9 });
      tom(ctx, destino, { freq: f * 1.8, glide: f * 2, quando: q, dur: 0.5, vol: 0.012, ataque: 0.03, tipo: 'square', abafo: 2200 });
      chiado(ctx, destino, { quando: q, dur: 0.5, vol: 0.02, freq: 1600, glide: 2600, q: 1.4, sustenta: 0.6 });
    }
    chiado(ctx, destino, { quando: t + 0.05, dur: 0.18, vol: 0.12, freq: 2800, glide: 900, q: 0.9 });
    tom(ctx, destino, { freq: 700, glide: 240, quando: t + 0.05, dur: 0.1, vol: 0.06, tipo: 'triangle' });
    chiado(ctx, destino, { quando: t + 0.2, dur: 0.8, vol: 0.03, freq: 6000, glide: 8000, q: 0.8, tipo: 'highpass' });
  },
};

