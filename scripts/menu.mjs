/**
 * O botão de menu e o "recomeçar do zero": tem que apagar o diário, voltar
 * para a casa do Ari e pôr o Ari de novo no comando.
 * Uso: node scripts/menu.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './menu';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const save = () =>
  page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
    } catch {
      return {};
    }
  });

// progresso de mentira: outra cena, uma memória no diário e o Renan no comando
await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.keyboard.press('KeyT'); // troca quem é controlado
await page.waitForTimeout(600);
await page.evaluate(() => {
  const jogo = window.jogo;
  jogo.unlock({ id: 'teste', title: 'Memória de teste', place: 'Villa Lobos', note: '…', icon: '🧪' });
  jogo.bump('frisbee.trocas', 7);
});
await page.waitForTimeout(400);

const antes = await save();
const controlavaAntes = await page.evaluate(() => window.jogo.playerName());

// abre o menu e recomeça
await page.click('.menu-btn');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-menu.png` });
await page.click('.menu .recomecar');
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}-confirma.png` });
await page.click('.menu .sim');
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}-recomecado.png` });

const depois = await save();
const controlaDepois = await page.evaluate(() => window.jogo.playerName());
const menuAberto = await page.evaluate(() => document.querySelector('.menu').classList.contains('show'));

// o diário tem que estar vazio na tela também, não só no localStorage
await page.keyboard.press('KeyJ');
await page.waitForTimeout(600);
const cartoes = await page.locator('.journal .memory').count();
await page.screenshot({ path: `${OUT}-diario.png` });

console.log('cena antes:', antes.scene, '→ depois:', depois.scene);
console.log('memórias antes:', (antes.memories ?? []).length, '→ depois:', (depois.memories ?? []).length);
console.log('trocas de frisbee antes:', antes.stats?.['frisbee.trocas'] ?? 0, '→ depois:', depois.stats?.['frisbee.trocas'] ?? 0);
console.log('controlando antes:', controlavaAntes, '→ depois:', controlaDepois);
console.log('cartões no diário depois:', cartoes);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  depois.scene === 'casa' &&
  (depois.memories ?? []).length === 0 &&
  !(depois.stats?.['frisbee.trocas'] ?? 0) &&
  controlaDepois === 'Ari' &&
  cartoes === 0 &&
  !menuAberto;

await browser.close();
process.exit(ok ? 0 : 1);
