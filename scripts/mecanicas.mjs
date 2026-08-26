/**
 * Testa as mecânicas que envolvem os dois personagens:
 *   - a escolha Sim/Não e a cena dos dois sentados no sofá
 *   - o frisbee de ida e volta no parque
 * Uso: node scripts/mecanicas.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './mecanicas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// ------------------------------------------------------------------- sofá
await page.goto(`${BASE}/?cena=casa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.keyboard.down('KeyW');
await page.waitForTimeout(950);
await page.keyboard.up('KeyW');
await page.waitForTimeout(900);

const promptSofa = await page.locator('.prompt.show .label').textContent().catch(() => null);
await page.keyboard.press('KeyE');
await page.waitForTimeout(1200);
const temEscolha = (await page.locator('.escolhas.show button').count()) > 0;
await page.screenshot({ path: `${OUT}-escolha.png` });

await page.keyboard.press('KeyE'); // confirma "Sim"
await page.waitForTimeout(2800);
await page.screenshot({ path: `${OUT}-sofa.png` });
const sentados = (await page.locator('.dialogue.show').count()) > 0;

// --------------------------------------------------------------- frisbee
await page.goto(`${BASE}/?cena=villa-lobos&entrada=portao`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
for (let i = 0; i < 6; i++) {
  await page.keyboard.press('KeyF');
  await page.waitForTimeout(2600);
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(500);
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(1800);
}
await page.screenshot({ path: `${OUT}-frisbee.png` });
const trocas = await page.evaluate(() => {
  try {
    return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').stats?.['frisbee.trocas'] ?? 0;
  } catch {
    return -1;
  }
});

console.log('prompt do sofá:', promptSofa);
console.log('pergunta com botões:', temEscolha);
console.log('cutscene rodou:', sentados);
console.log('trocas de frisbee:', trocas);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

await browser.close();
process.exit(erros.length || !temEscolha || !sentados || trocas < 1 ? 1 : 0);
