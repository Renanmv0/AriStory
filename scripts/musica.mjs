/**
 * Renderiza a música de cada cenário num .wav para dar para OUVIR — e mede se
 * ela está saindo em nível decente e sem estourar.
 *
 * O áudio sai da mesma classe que toca no jogo (`Musica`), rodando num
 * OfflineAudioContext dentro do Chromium: o arquivo é a música de verdade, não
 * uma imitação feita à parte.
 *
 * Uso: node scripts/musica.mjs /caminho/prefixo [segundos]
 */
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './musica';
const SEGUNDOS = Number(process.argv[3] ?? 40);
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** PCM 16 bits, mono — o cabeçalho .wav mais simples que existe */
function wav(amostras, taxa) {
  const buf = Buffer.alloc(44 + amostras.length * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + amostras.length * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(taxa, 24);
  buf.writeUInt32LE(taxa * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  for (let i = 0; i < amostras.length; i++) {
    const v = Math.max(-1, Math.min(1, amostras[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  return buf;
}

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 700, height: 480 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);

const climas = await page.evaluate(() => Object.keys(window.aristoryAudio.CLIMAS));
let ruim = 0;

for (const clima of climas) {
  const dados = await page.evaluate(
    async ([clima, segundos]) => {
      const { Musica } = window.aristoryAudio;
      const taxa = 44100;
      const ctx = new OfflineAudioContext(1, Math.ceil(taxa * segundos), taxa);
      const saida = ctx.createGain();
      saida.gain.value = 0.9; // o mesmo ganho do canal de música no jogo
      saida.connect(ctx.destination);
      // espia toda nota agendada: dá para conferir se a melodia passeia mesmo
      // ou se ficou pendurada numa nota só
      const notas = [];
      const criar = ctx.createOscillator.bind(ctx);
      ctx.createOscillator = () => {
        const osc = criar();
        const setar = osc.frequency.setValueAtTime.bind(osc.frequency);
        osc.frequency.setValueAtTime = (v, t) => {
          notas.push(69 + 12 * Math.log2(v / 440));
          return setar(v, t);
        };
        return osc;
      };

      const m = new Musica(ctx, saida);
      m.setClima(clima);
      m.preAgendar(segundos);
      const buf = await ctx.startRendering();
      return { pcm: Array.from(buf.getChannelData(0)), notas };
    },
    [clima, SEGUNDOS],
  );

  const amostras = Float32Array.from(dados.pcm);
  // a melodia mora entre o MIDI 70 e o 100; abaixo é baixo e acorde, acima é o
  // harmônico da marimba
  const melodia = dados.notas.filter((n) => n >= 70 && n <= 100);
  const grave = Math.min(...melodia);
  const agudo = Math.max(...melodia);
  const distintas = new Set(melodia.map((n) => Math.round(n))).size;
  let pico = 0;
  let soma = 0;
  let silencio = 0;
  for (let i = 0; i < amostras.length; i++) {
    const v = Math.abs(amostras[i]);
    if (v > pico) pico = v;
    soma += amostras[i] * amostras[i];
    if (v < 0.0005) silencio += 1;
  }
  const rms = Math.sqrt(soma / amostras.length);
  const quieto = silencio / amostras.length;

  const arquivo = `${OUT}-${clima}.wav`;
  writeFileSync(arquivo, wav(amostras, 44100));
  console.log(
    `${clima.padEnd(12)} pico ${pico.toFixed(2)} · rms ${rms.toFixed(3)} · silêncio ${(quieto * 100).toFixed(0)}%` +
      ` · melodia ${melodia.length} notas em ${distintas} alturas (${Math.round(grave)}–${Math.round(agudo)}) → ${arquivo}`,
  );

  // som mudo, som estourado, quase sempre em silêncio ou melodia parada numa
  // nota só são todos defeito
  if (pico > 0.99 || rms < 0.01 || quieto > 0.55 || distintas < 5 || agudo - grave < 7) ruim += 1;
}

// ------------------------------------------------------------ os efeitos
// todos em fila, um por segundo: dá para ouvir o jogo inteiro em vinte segundos
const efeitos = await page.evaluate(async () => {
  const { EFEITOS } = window.aristoryAudio;
  const nomes = Object.keys(EFEITOS);
  const taxa = 44100;
  const ctx = new OfflineAudioContext(1, Math.ceil(taxa * (nomes.length + 1)), taxa);
  const saida = ctx.createGain();
  saida.gain.value = 1;
  saida.connect(ctx.destination);
  nomes.forEach((nome, i) => {
    // `n` alterna timbres em quem tem variação (passo, fala)
    EFEITOS[nome]({ ctx, destino: saida, t: 0.4 + i, n: i });
  });
  const buf = await ctx.startRendering();
  return { nomes, pcm: Array.from(buf.getChannelData(0)) };
});
const pcmEfeitos = Float32Array.from(efeitos.pcm);
let picoEfeitos = 0;
for (const v of pcmEfeitos) picoEfeitos = Math.max(picoEfeitos, Math.abs(v));
writeFileSync(`${OUT}-efeitos.wav`, wav(pcmEfeitos, 44100));
console.log(`efeitos     ${efeitos.nomes.length} sons, um por segundo, pico ${picoEfeitos.toFixed(2)} → ${OUT}-efeitos.wav`);
console.log('ordem:', efeitos.nomes.join(' · '));
if (picoEfeitos < 0.02 || picoEfeitos > 0.99) ruim += 1;

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
await browser.close();
process.exit(erros.length || ruim ? 1 : 0);
