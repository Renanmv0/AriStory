/**
 * Testa o beijo rápido da dupla: chegar de frente um para o outro, apertar E,
 * os dois se inclinam e sobem os coraçõezinhos.
 * Uso: node scripts/beijo.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './beijo';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// campo aberto do parque, longe de qualquer interativo que roube o prompt
await page.goto(`${BASE}/?cena=villa-lobos&em=0,4&olhar=0.785&zoom=5.5`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// anda na direção do parceiro até ficar cara a cara
for (const tecla of ['KeyA', 'KeyW']) {
  await page.keyboard.down(tecla);
  await page.waitForTimeout(460);
  await page.keyboard.up(tecla);
  await page.waitForTimeout(800);
}

const prompt = await page.locator('.prompt.show .label').textContent().catch(() => null);
await page.screenshot({ path: `${OUT}-prompt.png` });

await page.keyboard.press('KeyE');
await page.waitForTimeout(520);
await page.screenshot({ path: `${OUT}-beijo.png` });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-coracao.png` });

console.log('prompt do beijo:', prompt);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

await browser.close();
process.exit(erros.length || !/Beijar/.test(prompt ?? '') ? 1 : 0);
