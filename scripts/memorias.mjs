/**
 * O quadro de memórias do quarto do Ari.
 *
 * O que este teste guarda:
 * - o quadro abre pela interação da parede, e não só por chamada direta;
 * - com ele aberto o jogo trava: o movimento para e o E não dispara mais nada;
 * - o canvas é PINTADO de verdade (pixels diferentes do fundo) e continua vivo,
 *   porque as luzinhas piscam — dois quadros seguidos não podem ser idênticos;
 * - fecha pelo botão e pelo Esc, e o movimento volta.
 *
 * Uso: node scripts/memorias.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './memorias';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

// ------------------------------------------- 1. chegar no quadro e apertar E
// Anda até a frente do mural pelo mesmo caminho do jogador, e não por
// `abrirMemoria`: é a interação da parede que este teste precisa provar.
await page.evaluate(() => window.jogo.debugPlace(-1.15, -1.9, 0));
await page.waitForTimeout(900);
const prompt = await page.locator('.prompt .label').textContent().catch(() => '');
await page.screenshot({ path: `${OUT}-parede.png` });

await page.keyboard.press('KeyE');
await page.waitForTimeout(700);
// a primeira vez tem conversa antes; avança até o quadro aparecer
for (let i = 0; i < 8; i++) {
  if (await page.locator('.memorias.show').count()) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(650);
}
await page.waitForTimeout(1200);

const abriu = await page.locator('.memorias.show').count();
const titulo = await page.locator('.memorias h2').textContent();
const legenda = await page.locator('.memorias .legenda').textContent();
await page.screenshot({ path: `${OUT}-quadro.png` });

// ------------------------------------------------- 2. o canvas foi pintado?
// Cores distintas numa amostra: um canvas em branco (ou de uma cor só) devolve
// 1. É o que separa "o painel abriu" de "o desenho aconteceu".
//
// As luzinhas contam por FRAÇÃO do quadro, e não por número de pixels: elas são
// dezenas de pontinhos, e num quadro menor uma contagem absoluta some sozinha —
// a asserção reprovava um desenho correto só porque a folha encolheu.
const pintou = await page.evaluate(() => {
  const cv = document.querySelector('.memorias .quadro');
  if (!cv || cv.width === 0) return null;
  const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  const cores = new Set();
  let claros = 0;
  const total = d.length / 4;
  for (let i = 0; i < d.length; i += 4) {
    if (i % (4 * 97) === 0) cores.add(`${d[i] >> 3},${d[i + 1] >> 3},${d[i + 2] >> 3}`);
    if (d[i] > 200 && d[i + 1] > 170 && d[i + 2] > 120) claros++;
  }
  return {
    largura: cv.width,
    altura: cv.height,
    cores: cores.size,
    luzes: +((claros / total) * 100).toFixed(3),
  };
});

// as luzinhas piscam: dois instantes diferentes não podem sair iguais
const antes = await page.evaluate(() => {
  const cv = document.querySelector('.memorias .quadro');
  const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  let soma = 0;
  for (let i = 0; i < d.length; i += 4 * 31) soma += d[i] + d[i + 1] + d[i + 2];
  return soma;
});
await page.waitForTimeout(700);
const depois = await page.evaluate(() => {
  const cv = document.querySelector('.memorias .quadro');
  const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  let soma = 0;
  for (let i = 0; i < d.length; i += 4 * 31) soma += d[i] + d[i + 1] + d[i + 2];
  return soma;
});

// --------------------------------------------------- 3. o jogo fica travado
await page.keyboard.down('KeyW');
await page.waitForTimeout(700);
await page.keyboard.up('KeyW');
const travou = await page.evaluate(() => document.body.classList.contains('tela-aberta'));

// ------------------------------------------------- 4. fechar pelo Esc e pelo X
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
const fechouNoEsc = (await page.locator('.memorias.show').count()) === 0;

await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const reabriu = (await page.locator('.memorias.show').count()) > 0;
await page.locator('.memorias .close').click();
await page.waitForTimeout(600);
const fechouNoBotao = (await page.locator('.memorias.show').count()) === 0;
const destravou = !(await page.evaluate(() => document.body.classList.contains('tela-aberta')));
await page.screenshot({ path: `${OUT}-depois.png` });

// ------------------------------------------------------------------ relatório
console.log('1. prompt na parede:', JSON.stringify(prompt));
console.log('   quadro abriu:', abriu > 0, '·', JSON.stringify(titulo));
console.log('   legenda:', JSON.stringify(legenda));
console.log('2. canvas:', JSON.stringify(pintou), '(luzes em % do quadro)');
console.log('   piscou (as somas têm que diferir):', antes, '→', depois);
console.log('3. travou o jogo:', travou);
console.log('4. fechou no Esc:', fechouNoEsc, '· reabriu:', reabriu,
  '· fechou no botão:', fechouNoBotao, '· destravou:', destravou);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!/mem[óo]ria/i.test(prompt ?? '')) problemas.push('o prompt do quadro não apareceu na parede');
if (!abriu) problemas.push('o quadro não abriu pela interação');
if (!titulo?.trim()) problemas.push('o quadro abriu sem título');
if (!legenda?.trim()) problemas.push('o quadro abriu sem legenda');
if (!pintou) problemas.push('o canvas ficou com tamanho zero');
else {
  if (pintou.cores < 40) problemas.push(`o desenho saiu chapado (${pintou.cores} cores)`);
  if (pintou.luzes < 0.1) problemas.push(`quase nenhuma luz acesa (${pintou.luzes}% do quadro)`);
}
if (antes === depois) problemas.push('o desenho está parado — as luzinhas não piscam');
if (!travou) problemas.push('o jogo não travou com o quadro aberto');
if (!fechouNoEsc) problemas.push('o Esc não fechou o quadro');
if (!reabriu) problemas.push('o quadro não reabriu na segunda interação');
if (!fechouNoBotao) problemas.push('o botão não fechou o quadro');
if (!destravou) problemas.push('o jogo continuou travado depois de fechar');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
