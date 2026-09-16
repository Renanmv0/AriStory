/**
 * QUANTO CADA ADVERSÁRIO DE PING PONG É DIFÍCIL, medido em vez de chutado.
 *
 * A ficha de um adversário (`Adversario`, em `entities/PingPong.ts`) são três
 * números, e nenhum deles diz sozinho se dá para ganhar dele. Este script
 * simula partidas inteiras contra cada um e devolve a taxa de vitória — que é
 * a única coisa que a pessoa do outro lado da tela sente.
 *
 * COMO O JOGADOR É SIMULADO: a mira persegue a bolinha com ATRASO e com RUÍDO,
 * que são as duas coisas que separam mão humana de rastreador. Um rastreador
 * perfeito ganha de qualquer ficha e não serve de régua — foi assim que a
 * primeira ficha do Jean-Luc passou (o `duelo.mjs` persegue quadro a quadro) e
 * mesmo assim ela era intransponível: doze pontos seguidos sem fazer um.
 *
 *   - `boa`   — 80 ms de atraso, pouco ruído: alguém que já pegou o jeito.
 *   - `media` — 180 ms e ruído grande: a primeira meia hora de jogo.
 *
 * A REGRA DA CASA, para quem for pôr um adversário novo na lista:
 *
 *  - contra o PARCEIRO a mão média ganha com folga: ele é o tutorial, e é
 *    contra ele que se aprende a mexer a raquete;
 *  - contra um adversário de DESAFIO a mão média ganha entre 10% e 45%. Menos
 *    que 10% é parede (e o prêmio dele fica inalcançável no celular); mais que
 *    45% é enfeite;
 *  - e NENHUMA ficha pode fazer partida sem fim. Duas mãos que alcançam tudo e
 *    devolvem no meio jogam para sempre — o `estouros` acusa isso, e foi assim
 *    que a `pontaria` entrou na ficha.
 *
 * Uso: node scripts/balanco.mjs [quantas partidas por ficha]
 */
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PARTIDAS = Number(process.argv[2] ?? 60);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-14.5,26.4&zoom=11`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const resultado = await page.evaluate(async (quantas) => {
  let mesa = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.pingpong) mesa = n;
  });
  const p = mesa.userData.pingpong;

  /*
   * OS CALLBACKS SAEM DE CENA durante a simulação. `onFim` dispara a cutscene
   * do fim de partida — sessenta partidas simuladas abririam sessenta
   * diálogos, e a primeira já daria o prêmio do Jean-Luc sem ninguém jogar.
   */
  const salvos = { onFim: p.onFim, onPonto: p.onPonto, onSom: p.onSom };
  const adversarioOriginal = p.adversario;
  p.onFim = null;
  p.onPonto = null;
  p.onSom = null;

  /** sorteio com semente: a mesma medição em todo build */
  let semente = 20260916;
  const sorte = () => {
    semente ^= semente << 13; semente ^= semente >>> 17; semente ^= semente << 5;
    return ((semente >>> 0) % 100000) / 100000;
  };

  /** meia largura em que a raquete passeia, de `PingPong` */
  const ALCANCE_Z = 1.4 / 2 + 0.12;
  const ALTURA = 0.76;

  /*
   * A MÃO SIMULADA TEM TRÊS DEFEITOS, e são os três que separam gente de
   * rastreador. Com só atraso e ruído as duas mãos ganhavam 100% de tudo: a
   * bolinha anda devagar no `z` (o teto é 1,05 m/s) e a raquete tem 28 cm de
   * raio, então 200 ms de atraso ainda acertam.
   *
   *   - ATRASO: a mira usa a bolinha de alguns quadros atrás.
   *   - RUÍDO: ela não mira exato.
   *   - LAPSO: de vez em quando a mão simplesmente PARA por um instante. É
   *     este que pesa — quem joga pisca, olha o placar, se distrai.
   */
  const umaPartida = (ficha, mao) => {
    p.trocarAdversario(ficha);
    p.comecar();
    const dt = 1 / 60;
    const atrasoEmQuadros = Math.round(mao.atraso / dt);
    const memoria = [];
    let congelado = 0;
    let miraZ = 0;
    let miraY = ALTURA + 0.3;
    /*
     * O TETO É DE QUATRO MINUTOS SIMULADOS, e ele é contado à parte.
     *
     * Com 90 s a medição estava MENTINDO: contra um adversário que devolve
     * tudo o rali se estica, a partida não fechava dentro do teto, e o
     * `meus > dele` de um 0 × 0 estourado entrava na conta como DERROTA. O
     * Jean-Luc aparecia com 66% de vitória quando na verdade ele quase não
     * ganhava ponto nenhum — as "derrotas" eram o relógio do teste.
     */
    let estourou = true;
    for (let passo = 0; passo < 240 * 60; passo++) {
      memoria.push([p.bola.position.z, p.bola.position.y]);
      if (congelado > 0) congelado -= 1;
      else if (sorte() < mao.lapso) congelado = Math.round(mao.duracaoDoLapso / dt);
      if (congelado === 0) {
        const antigo = memoria[Math.max(0, memoria.length - 1 - atrasoEmQuadros)];
        miraZ = antigo[0] + (sorte() - 0.5) * mao.ruido;
        miraY = antigo[1];
      }
      const z = miraZ;
      const y = miraY;
      p.update(dt, {
        x: Math.max(-1, Math.min(1, z / ALCANCE_Z)),
        y: Math.max(-1, Math.min(1, (y - ALTURA - 0.16) / 0.6 - 0.35)),
      });
      if (p.fase === 'fim') { estourou = false; break; }
    }
    return { ganhei: p.meus > p.dele, meus: p.meus, dele: p.dele, estourou };
  };

  const MAOS = {
    boa: { atraso: 0.09, ruido: 0.1, lapso: 0.004, duracaoDoLapso: 0.25 },
    media: { atraso: 0.2, ruido: 0.3, lapso: 0.014, duracaoDoLapso: 0.35 },
  };

  // A FICHA DO JEAN-LUC VEM DA CENA, e não copiada aqui: este script só vale
  // se medir o número que o jogo usa de verdade.
  const doPato = mesa.userData.jeanLuc.ficha;
  const fichas = [
    { nome: 'parceiro', ficha: { id: 'x', cor: 0x4a7fe0, erro: 1, feio: 0.25, rapidez: 4.6, desvio: 1, pontaria: 0 } },
    { nome: 'jean-luc', ficha: { ...doPato, id: 'x' } },
  ];

  const saida = [];
  for (const { nome, ficha } of fichas) {
    for (const [comoJoga, mao] of Object.entries(MAOS)) {
      let vitorias = 0;
      let pontosDele = 0;
      let estouros = 0;
      for (let i = 0; i < quantas; i++) {
        const r = umaPartida(ficha, mao);
        if (r.estourou) estouros += 1;
        if (r.ganhei) vitorias += 1;
        pontosDele += r.dele;
      }
      saida.push({
        nome, comoJoga,
        vitorias: +(vitorias / quantas).toFixed(2),
        pontosDelePorPartida: +(pontosDele / quantas).toFixed(1),
        estouros,
      });
    }
  }

  p.onFim = salvos.onFim;
  p.onPonto = salvos.onPonto;
  p.onSom = salvos.onSom;
  p.trocarAdversario(adversarioOriginal);
  p.guardar();
  return { saida, fichaDoPato: doPato };
}, PARTIDAS);

const falhas = [];
for (const r of resultado.saida) {
  console.log(
    `${r.nome.padEnd(10)} · mão ${r.comoJoga.padEnd(6)} · ganha ${(r.vitorias * 100).toFixed(0)}%`,
    `· toma ${r.pontosDelePorPartida} pontos por partida`,
    r.estouros ? `· ${r.estouros} partidas estouraram o relogio` : '',
  );
}
console.log('\nficha do Jean-Luc na cena:', JSON.stringify(resultado.fichaDoPato));

const acha = (nome, mao) => resultado.saida.find((r) => r.nome === nome && r.comoJoga === mao);
const parceiroMedia = acha('parceiro', 'media');
const patoMedia = acha('jean-luc', 'media');
if (parceiroMedia.vitorias < 0.55) {
  falhas.push(`o parceiro virou desafio: mao media ganha so ${parceiroMedia.vitorias * 100}%`);
}
if (patoMedia.vitorias > 0.45) falhas.push(`o Jean-Luc esta facil demais: ${patoMedia.vitorias * 100}%`);
if (patoMedia.vitorias < 0.1) falhas.push(`o Jean-Luc esta intransponivel: ${patoMedia.vitorias * 100}%`);
if (patoMedia.vitorias >= parceiroMedia.vitorias) {
  falhas.push('o Jean-Luc nao e mais dificil que o parceiro');
}
for (const r of resultado.saida) {
  if (r.estouros > resultado.saida.length) {
    falhas.push(`${r.nome}/${r.comoJoga}: ${r.estouros} partidas estouraram o relogio da simulacao`);
  }
}
falhas.push(...erros);

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
