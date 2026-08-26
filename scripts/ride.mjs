/**
 * Teste da cutscene da roda gigante: entra na cabine, atravessa os dialogos e
 * confere que o jogador volta para o chao com o controle liberado.
 * Uso: node scripts/ride.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './ride';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&entrada=roda`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const dialogoAberto = () => page.locator('.dialogue.show').count().then((n) => n > 0);

const memorias = () =>
  page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories?.length ?? 0;
    } catch {
      return -1;
    }
  });

await page.keyboard.press('KeyE'); // embarca

// o dialogo tem efeito de maquina de escrever: a primeira tecla completa a
// linha e a segunda avanca, entao e mais simples martelar E ate o fim.
let subiu = false;
for (let i = 0; i < 200; i++) {
  if (await dialogoAberto()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(250);
  if (i === 20) await page.screenshot({ path: `${OUT}-subindo.png` });
  if ((await memorias()) >= 1 && !(await dialogoAberto())) {
    subiu = true;
    break;
  }
}
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}-fim.png` });

// o passeio terminou? o prompt tem que voltar e o jogador andar de novo
const promptVisivel = (await page.locator('.prompt.show').count()) > 0;
const total = await memorias();

console.log('passeio concluido:', subiu);
console.log('prompt de volta:', promptVisivel);
console.log('memorias salvas:', total);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
await browser.close();
process.exit(erros.length || !subiu || !promptVisivel ? 1 : 0);
