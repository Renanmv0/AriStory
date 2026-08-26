/**
 * Teste de fumaca: abre o jogo no Chromium headless, tira fotos das cenas e
 * reporta erros de console. Uso:
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/smoke.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './smoke';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  const t = m.text();
  // a fonte do Google nao carrega em ambiente sem rede: nao e erro do jogo
  const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET'];
  if (m.type() === 'error' && !ruido.some((r) => t.includes(r))) erros.push(t);
});

const cenas = [
  ['casa', '', 2500],
  ['villa-lobos', 'portao', 3000],
  ['villa-lobos', 'roda', 3000],
  ['clube', 'portaria', 3000],
  ['clube', 'beira', 3000],
];

for (const [cena, entrada, espera] of cenas) {
  const url = `${BASE}/?cena=${cena}${entrada ? `&entrada=${entrada}` : ''}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(espera);
  await page.screenshot({ path: `${OUT}-${cena}${entrada ? '-' + entrada : ''}.png` });
}

// interage com o que estiver ao alcance
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-interacao.png` });

console.log(erros.length ? 'ERROS:\n' + erros.slice(0, 10).join('\n') : 'sem erros de console');
await browser.close();
process.exit(erros.length ? 1 : 0);
