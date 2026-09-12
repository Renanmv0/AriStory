/**
 * Tijolos de som do AriStory.
 *
 * Mesma regra do resto do jogo: **nada de arquivo**. Não entra .mp3, .wav nem
 * biblioteca de áudio — cada som é desenhado na hora com osciladores e ruído da
 * Web Audio API. Sai leve (o jogo inteiro continua um punhado de KB) e dá para
 * afinar qualquer coisa mexendo em número.
 */

export interface Nota {
  /** frequência em Hz */
  freq: number;
  /** quando tocar, em segundos do relógio do AudioContext */
  quando: number;
  /** quanto dura o corpo da nota */
  dur: number;
  tipo?: OscillatorType;
  /** volume de pico, 0..1 */
  vol?: number;
  /** subida do envelope; curta demais estala */
  ataque?: number;
  /** desafinação em cents, para engrossar quando se toca duas juntas */
  detune?: number;
  /** desliza para esta frequência ao longo da nota */
  glide?: number;
  /** corta os agudos: número é a frequência do filtro */
  abafo?: number;
}

/** Uma nota simples com envelope de percussão (ataque curto, cauda que decai). */
export function tom(ctx: AudioContext, destino: AudioNode, n: Nota): void {
  const osc = ctx.createOscillator();
  osc.type = n.tipo ?? 'sine';
  osc.frequency.setValueAtTime(n.freq, n.quando);
  if (n.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, n.glide), n.quando + n.dur);
  if (n.detune) osc.detune.setValueAtTime(n.detune, n.quando);

  const ganho = ctx.createGain();
  const pico = n.vol ?? 0.2;
  const ataque = n.ataque ?? 0.006;
  ganho.gain.setValueAtTime(0.0001, n.quando);
  ganho.gain.exponentialRampToValueAtTime(pico, n.quando + ataque);
  // decaimento exponencial: é o que dá a cara de marimba/sininho
  ganho.gain.exponentialRampToValueAtTime(0.0001, n.quando + n.dur);

  let saida: AudioNode = ganho;
  if (n.abafo) {
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(n.abafo, n.quando);
    ganho.connect(filtro);
    saida = filtro;
  }

  osc.connect(ganho);
  saida.connect(destino);
  osc.start(n.quando);
  osc.stop(n.quando + n.dur + 0.05);
}

let ruidoBuffer: AudioBuffer | null = null;

/** Um segundo de ruído branco, gerado uma vez e reaproveitado por todo mundo. */
function bufferDeRuido(ctx: AudioContext): AudioBuffer {
  if (!ruidoBuffer || ruidoBuffer.sampleRate !== ctx.sampleRate) {
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const dados = buf.getChannelData(0);
    for (let i = 0; i < dados.length; i++) dados[i] = Math.random() * 2 - 1;
    ruidoBuffer = buf;
  }
  return ruidoBuffer;
}

export interface Chiado {
  quando: number;
  dur: number;
  vol?: number;
  /** centro do filtro; passos e chocalho vivem entre 900 e 6000 */
  freq?: number;
  q?: number;
  tipo?: BiquadFilterType;
  /** desliza o filtro até esta frequência: vira "tchhh" ou "vuup" */
  glide?: number;
}

/** Ruído filtrado: passo, chocalho, água, folha, virar de página. */
export function chiado(ctx: AudioContext, destino: AudioNode, c: Chiado): void {
  const fonte = ctx.createBufferSource();
  fonte.buffer = bufferDeRuido(ctx);
  fonte.loop = true;

  const filtro = ctx.createBiquadFilter();
  filtro.type = c.tipo ?? 'bandpass';
  filtro.frequency.setValueAtTime(c.freq ?? 1800, c.quando);
  if (c.glide) filtro.frequency.exponentialRampToValueAtTime(Math.max(60, c.glide), c.quando + c.dur);
  filtro.Q.setValueAtTime(c.q ?? 1.2, c.quando);

  const ganho = ctx.createGain();
  const pico = c.vol ?? 0.14;
  ganho.gain.setValueAtTime(0.0001, c.quando);
  ganho.gain.exponentialRampToValueAtTime(pico, c.quando + 0.008);
  ganho.gain.exponentialRampToValueAtTime(0.0001, c.quando + c.dur);

  fonte.connect(filtro);
  filtro.connect(ganho);
  ganho.connect(destino);
  fonte.start(c.quando);
  fonte.stop(c.quando + c.dur + 0.05);
}

/** Frequência de uma nota MIDI (69 = lá 440). */
export function nota(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Sorteio repetível: mesma semente, mesma música. */
export function dado(semente: number): () => number {
  let s = semente >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}
