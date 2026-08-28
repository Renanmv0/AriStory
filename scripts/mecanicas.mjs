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
// o disco só existe dentro da quadra, então o teste começa lá dentro
await page.goto(`${BASE}/?cena=villa-lobos&entrada=portao&em=18,-4.5&olhar=0.785`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
const discoNaMao = (await page.locator('.prompt.show .label').textContent().catch(() => null)) ?? '';

// O sorvete comprado acima ocupa a vaga principal, então o disco entrou na
// mochila e o F não lança até ele ser escolhido — é a regra. Aqui o teste faz
// o que a pessoa faria: abre a mochila e toca no frisbee.
await page.keyboard.press('KeyI');
await page.waitForTimeout(700);
const vagaDoDisco = await page.evaluate(() =>
  window.jogo.handItems().findIndex((i) => i?.id === 'frisbee'),
);
if (vagaDoDisco >= 0) await page.locator('.mochila .maos .slot').nth(vagaDoDisco).click();
await page.waitForTimeout(400);
await page.keyboard.press('KeyI');
await page.waitForTimeout(600);

// Carga curtinha de propósito: com F segurado o disco vai a 20+ unidades, e o
// parceiro busca A PÉ. Em câmera lenta (headless roda o jogo a ~7 fps) uma ida
// dessas passa de 10 s de relógio e o teste estourava o tempo antes da volta.
for (let i = 0; i < 4; i++) {
  await page.keyboard.down('KeyF');
  await page.waitForTimeout(120);
  await page.keyboard.up('KeyF');
  // espera a ida, a busca e a volta inteiras
  for (let k = 0; k < 24; k++) {
    await page.waitForTimeout(500);
    const fase = await page.evaluate(() => window.jogo.getActiveHandItem()?.id ?? null);
    if (fase === 'frisbee') break; // o disco voltou pra minha mão
  }
}
await page.screenshot({ path: `${OUT}-frisbee.png` });
const trocas = await page.evaluate(() => {
  try {
    return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').stats?.['frisbee.trocas'] ?? 0;
  } catch {
    return -1;
  }
});

// ------------------------------------------------------------- sorveteria
await page.goto(`${BASE}/?cena=villa-lobos&entrada=portao&em=12,20.8&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2800);
await page.keyboard.press('KeyE');
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(420);
}
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-sorvete.png` });

// ------------------------------------------------------------------- lago
await page.goto(`${BASE}/?cena=villa-lobos&entrada=portao&em=-13,11&olhar=4.5`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2800);
await page.keyboard.press('KeyE');
const falantes = [];
for (let i = 0; i < 8; i++) {
  const quem = await page.locator('.dialogue.show .who').textContent().catch(() => null);
  if (quem && falantes[falantes.length - 1] !== quem) falantes.push(quem);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(420);
}
await page.screenshot({ path: `${OUT}-lago.png` });

const memorias = await page.evaluate(() => {
  try {
    return (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).map((m) => m.id);
  } catch {
    return [];
  }
});

console.log('prompt do sofá:', promptSofa);
console.log('pergunta com botões:', temEscolha);
console.log('cutscene rodou:', sentados);
console.log('prompt na quadra:', discoNaMao);
console.log('trocas de frisbee:', trocas);
console.log('falantes do lago:', falantes.join(' → '));
console.log('memórias:', memorias.join(', '));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const faltando = ['sorvete-villa', 'lago-pular'].filter((id) => !memorias.includes(id));
if (faltando.length) console.log('memórias que não vieram:', faltando.join(', '));

await browser.close();
process.exit(erros.length || !temEscolha || !sentados || trocas < 1 || faltando.length ? 1 : 0);
