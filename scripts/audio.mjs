/**
 * O som dentro do jogo: confere que o áudio acorda no primeiro toque (política
 * de autoplay do navegador), que a música começa a tocar e que cada ação dispara
 * o efeito dela.
 *
 * Uso: node scripts/audio.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=casa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2800);

const estado = () =>
  page.evaluate(() => ({
    pronto: window.jogo.audio.pronto,
    ligado: window.jogo.audio.ligado,
    contagem: Object.fromEntries(window.jogo.audio.contagem),
    musica: window.jogo.audio.musica?.tocando ?? false,
  }));

const antes = await estado();

// o primeiro clique é o que tem permissão de acordar o áudio
await page.mouse.click(450, 500);
await page.waitForTimeout(600);
const acordado = await estado();

// andar um pouco: passos
await page.keyboard.down('KeyW');
await page.waitForTimeout(1400);
await page.keyboard.up('KeyW');
await page.waitForTimeout(300);

// trocar de personagem ANTES de interagir: durante cutscene o T é ignorado
await page.keyboard.press('KeyT');
await page.waitForTimeout(500);

// interagir com o que estiver por perto, avançando a fala
for (let i = 0; i < 4; i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
}
await page.keyboard.press('KeyJ'); // diário
await page.waitForTimeout(400);
await page.keyboard.press('KeyJ');
await page.waitForTimeout(300);
await page.click('.menu-btn'); // menu
await page.waitForTimeout(400);

const fim = await estado();

// o botão de som do menu tem que silenciar de verdade
await page.click('.menu .som-btn');
await page.waitForTimeout(300);
const mudo = await page.evaluate(() => ({
  ligado: window.jogo.audio.ligado,
  guardado: localStorage.getItem('aristory.som'),
}));

console.log('áudio antes do clique:', antes.pronto ? 'ligado' : 'dormindo');
console.log('áudio depois do clique:', acordado.pronto ? 'ligado' : 'DORMINDO (ruim)');
console.log('música tocando:', fim.musica);
console.log('sons disparados:', Object.entries(fim.contagem).map(([k, v]) => `${k}×${v}`).join(' '));
console.log('mudo pelo menu:', !mudo.ligado, '· guardado:', mudo.guardado);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const c = fim.contagem;
const faltando = ['passo', 'interagir', 'trocar', 'diario', 'menu'].filter((n) => !c[n]);
if (faltando.length) console.log('sons que não dispararam:', faltando.join(', '));

await browser.close();
process.exit(erros.length || !acordado.pronto || !fim.musica || faltando.length || mudo.ligado ? 1 : 0);
