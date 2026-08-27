/**
 * Retrato dos personagens: camera colada para conferir cabelo, roupa e
 * acessorios. Uso: node scripts/retrato.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './retrato';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
// a casa é a única cena sem ajuste automático de zoom, então ?zoom vale aqui.
// ?em põe a dupla no meio da sala e ?olhar vira os dois para a câmera.
await page.goto(`${BASE}/?cena=casa&zoom=4.6&em=-1.6,3.2&olhar=0.785`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

await page.screenshot({ path: `${OUT}-frente.png` });

// T troca quem a câmera segue: assim o mesmo script retrata os dois
await page.keyboard.press('KeyT');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}-parceiro.png` });

// gira a camera para ver de lado e de costas
for (const [i, giros] of [[1, 2], [2, 2]]) {
  for (let n = 0; n < giros; n++) {
    await page.keyboard.press('KeyR');
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-giro${i}.png` });
}
await browser.close();
