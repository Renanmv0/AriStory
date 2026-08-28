/**
 * O minigame de ping pong, jogado de verdade.
 *
 * O teste move o mouse perseguindo a bolinha (é o que a pessoa faz), lê o
 * estado da partida quadro a quadro e confere: a câmera vira perspectiva, o
 * placar aparece, os pontos sobem, a partida fecha em 5 e — se o jogador
 * ganhar — o chapéu aparece na cabeça dele e a memória entra no diário.
 *
 * Uso: node scripts/pingpong.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './pingpong';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const LARG = 900;
const ALT = 620;
const page = await browser.newPage({ viewport: { width: LARG, height: ALT } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// bem ao lado da mesa de ping pong
await page.goto(`${BASE}/?cena=villa-lobos&em=-15.5,23&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

/** estado do minigame, lido de dentro da cena pela posição da bolinha */
const estado = () =>
  page.evaluate(() => {
    const jogo = window.jogo;
    const p = window.__ping;
    return {
      perspectiva: jogo.camOmbro !== null,
      placar: document.querySelector('.placar')?.classList.contains('show') ?? false,
      fase: p?.fase ?? 'sem-partida',
      meus: p?.meus ?? -1,
      dele: p?.dele ?? -1,
      bola: p ? [p.bola.position.x, p.bola.position.y, p.bola.position.z] : null,
      chapeu: jogo.player.rig.campeao,
    };
  });

// a cena guarda a partida numa variável local; para o teste enxergar, ela é
// publicada em window.__ping pelo próprio jogo em modo de depuração
await page.evaluate(() => {
  const achar = () => {
    const mundo = window.jogo.current?.world?.root;
    if (!mundo) return null;
    let achado = null;
    mundo.traverse((o) => {
      if (!achado && o.userData?.pingpong) achado = o.userData.pingpong;
    });
    return achado;
  };
  window.__ping = achar();
});

await page.keyboard.press('KeyE'); // abre a conversa
for (let i = 0; i < 4; i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
}
await page.waitForTimeout(1200);
await page.evaluate(() => {
  const mundo = window.jogo.current?.world?.root;
  let achado = null;
  mundo.traverse((o) => {
    if (!achado && o.userData?.pingpong) achado = o.userData.pingpong;
  });
  window.__ping = achado;
});

const comecou = await estado();
await page.screenshot({ path: `${OUT}-mesa.png` });

// joga: o mouse persegue o Z da bolinha, que é o que a mão faz
const inicio = Date.now();
let ultimo = comecou;
while (Date.now() - inicio < 240000) {
  const e = await estado();
  ultimo = e;
  // 'parado' = a partida acabou e o minigame se recolheu
  if (e.fase === 'fim' || e.fase === 'parado' || e.fase === 'sem-partida') break;
  if (e.bola) {
    // z local da bolinha (-0.8..0.8) → x da tela; a raquete segue
    const alvo = Math.max(-1, Math.min(1, e.bola[2] / 0.82));
    await page.mouse.move(LARG / 2 + (alvo * LARG) / 2.2, ALT * 0.62);
  }
  if (e.meus + e.dele === 1 && e.fase === 'jogando') {
    await page.screenshot({ path: `${OUT}-jogando.png` });
  }
  await page.waitForTimeout(90);
}

// avança a conversa final — e SÓ enquanto houver balão aberto, senão o E
// dispara a interação da mesa de novo e começa uma revanche no meio do teste
await page.waitForTimeout(1200);
for (let i = 0; i < 10; i++) {
  const falando = await page.locator('.dialogue.show').count();
  if (!falando) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
await page.waitForTimeout(900);
const fim = await estado();
await page.screenshot({ path: `${OUT}-fim.png` });

const save = await page.evaluate(() => {
  try {
    return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  } catch {
    return {};
  }
});

console.log('perspectiva ligada ao começar:', comecou.perspectiva);
console.log('placar na tela:', comecou.placar);
console.log('placar final:', `${ultimo.meus} × ${ultimo.dele}`, '· fase', ultimo.fase);
console.log('voltou para a isométrica:', !fim.perspectiva);
console.log('chapéu na cabeça:', fim.chapeu);
console.log('flags:', Object.keys(save.flags ?? {}).filter((f) => f.startsWith('chapeu')).join(', ') || '(nenhuma)');
console.log('memórias:', (save.memories ?? []).map((m) => m.id).join(', ') || '(nenhuma)');
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ganhou = ultimo.meus >= 5;
const ok =
  !erros.length &&
  comecou.perspectiva &&
  comecou.placar &&
  Math.max(ultimo.meus, ultimo.dele) === 5 &&
  !fim.perspectiva &&
  // o prêmio só é cobrado quando o jogador de fato ganhou
  (!ganhou || (fim.chapeu && (save.memories ?? []).some((m) => m.id === 'memoria-ping-pong')));

await browser.close();
process.exit(ok ? 0 : 1);
