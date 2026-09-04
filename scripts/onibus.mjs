/**
 * Fotos de perto do ônibus e do ponto, nos dois lados da viagem: a rua do
 * Villa-Lobos e a rua nova do clube. Serve para conferir o modelo (letreiro,
 * porta, rodas, o abrigo) e o encaixe dele na rua.
 * Uso: node scripts/onibus.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './onibus';
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
  // de perto, na frente da porta, e de longe, para ver a rua inteira
  ['parque-porta', 'cena=villa-lobos&em=37.4,13&olhar=1.6&zoom=6'],
  ['parque-rua', 'cena=villa-lobos&em=34,13&olhar=1.6&zoom=13'],
  ['clube-porta', 'cena=clube&em=-19.4,9&olhar=4.7&zoom=6'],
  ['clube-rua', 'cena=clube&em=-17,9&olhar=4.7&zoom=13'],
];

for (const [nome, query] of poses) {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
  // uma volta de câmera: o outro lado do ônibus só aparece girando
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-${nome}-giro.png` });
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
await browser.close();
process.exit(erros.length ? 1 : 0);
