/**
 * Fotos de perto dos quiosques: a sorveteria e a bilheteria do parque, e o bar
 * do clube. Serve para conferir o modelo, não a interação.
 * Uso: node scripts/quiosque.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './quiosque';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 780 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const poses = [
  ['sorveteria', 'cena=villa-lobos&em=12,16.4&olhar=0&zoom=6'],
  ['bilheteria', 'cena=villa-lobos&em=10.4,-18.4&olhar=3.6&zoom=6'],
  ['bar', 'cena=clube&em=-12.2,10.4&olhar=3.5&zoom=6'],
];

for (const [nome, query] of poses) {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
  // uma volta de câmera: telhado e lateral só aparecem girando
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-${nome}-giro.png` });
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
await browser.close();
process.exit(erros.length ? 1 : 0);
