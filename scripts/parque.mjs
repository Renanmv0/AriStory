/**
 * Fotos de perto do Villa Lobos: a praça da roda gigante, a cúpula de vidro
 * (também girando, que é onde a estrutura aparece) e a margem do lago.
 *
 * Uso: node scripts/parque.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './parque';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const poses = [
  ['praca', 'em=-2,-14&olhar=3.14', 1],
  ['domo', 'em=-9.5,-16&olhar=3.14&zoom=9', 2],
  ['lago', 'em=-15,14&olhar=4.0&zoom=13', 1],
  ['lago-beira', 'em=-21,20&olhar=3.14&zoom=9', 1],
];

for (const [nome, query, giros] of poses) {
  await page.goto(`${BASE}/?cena=villa-lobos&${query}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2900);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
  for (let i = 0; i < giros; i++) {
    await page.keyboard.press('KeyR');
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-${nome}-giro${i + 1}.png` });
  }
}

// quanto o cenário pesa agora: mudança de decoração não pode explodir a cena
const malhas = await page.evaluate(() => {
  let n = 0;
  window.jogo.scene.traverse((o) => {
    if (o.isMesh) n += 1;
  });
  return n;
});

console.log('malhas na cena do parque:', malhas);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

await browser.close();
process.exit(erros.length || malhas > 9000 ? 1 : 0);
