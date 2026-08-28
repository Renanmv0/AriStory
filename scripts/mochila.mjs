/**
 * A mochila: as 9 vagas, o slot principal e a persistência.
 *
 * O que este teste prova, além de a tela abrir: que o movimento fica travado
 * com o painel aberto (é a parte que quebra o jogo se falhar), que o clique
 * numa vaga muda o que está na mão, e que tudo isso sobrevive a um F5.
 *
 * Uso: node scripts/mochila.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './mochila';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-4,6`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

// enche a mochila pela própria GameAPI, que é como uma cena faria
const guardou = await page.evaluate(() => {
  const j = window.jogo;
  const r = [
    j.addItem({ id: 'frisbee', nome: 'Frisbee', icone: '🥏', tipo: 'mao', nota: 'do parque' }),
    j.addItem({ id: 'camera', nome: 'Câmera', icone: '📷', tipo: 'mao' }),
    j.addItem({ id: 'toalha', nome: 'Toalha', icone: '🧺', tipo: 'mao' }),
    // o mesmo id duas vezes tem que ser recusado
    j.addItem({ id: 'camera', nome: 'Câmera', icone: '📷', tipo: 'mao' }),
    j.equipWearable({ id: 'patins', nome: 'Patins', icone: '🛼', tipo: 'vestivel' }),
    j.equipWearable({ id: 'oculos', nome: 'Óculos de sol', icone: '🕶️', tipo: 'vestivel' }, 2),
  ];
  return r;
});

await page.keyboard.press('KeyI');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-aberta.png` });

const vagas = () =>
  page.evaluate(() => ({
    maos: window.jogo.handItems().map((i) => i?.id ?? null),
    vestiveis: window.jogo.wearables().map((i) => i?.id ?? null),
    ativo: window.jogo.activeHandSlot(),
    naMao: window.jogo.getActiveHandItem()?.nome ?? null,
    caixas: document.querySelectorAll('.mochila .slot').length,
    principais: document.querySelectorAll('.mochila .slot.principal').length,
  }));
const aberta = await vagas();

// o movimento tem que estar TRAVADO com o painel aberto
const andou = await page.evaluate(async () => {
  const j = window.jogo;
  const antes = { x: j.player.position.x, z: j.player.position.z };
  return new Promise((ok) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }));
      ok(Math.hypot(j.player.position.x - antes.x, j.player.position.z - antes.z));
    }, 1200);
  });
});

// clicar na terceira vaga põe a toalha na mão
await page.locator('.mochila .maos .slot').nth(2).click();
await page.waitForTimeout(400);
const depoisDoClique = await vagas();
await page.screenshot({ path: `${OUT}-slot-3.png` });

await page.keyboard.press('KeyI');
await page.waitForTimeout(500);
const fechada = await page.evaluate(() => document.querySelector('.mochila').classList.contains('show'));

// e agora o F5: tem que voltar tudo, inclusive qual vaga é a principal
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const depoisDoF5 = await vagas();

console.log('addItem/equipWearable devolveram:', JSON.stringify(guardou));
console.log('mãos:', JSON.stringify(aberta.maos));
console.log('vestíveis:', JSON.stringify(aberta.vestiveis));
console.log('caixas na tela:', aberta.caixas, '· com anel de principal:', aberta.principais);
console.log('andou com o painel aberto:', andou.toFixed(3), '(tem que ser 0)');
console.log('depois de clicar na vaga 3 · ativo:', depoisDoClique.ativo, '· na mão:', depoisDoClique.naMao);
console.log('o I fechou:', !fechada);
console.log('depois do F5 · ativo:', depoisDoF5.ativo, '· na mão:', depoisDoF5.naMao, '· mãos:', JSON.stringify(depoisDoF5.maos));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  JSON.stringify(guardou) === JSON.stringify(['mao', 'guardado', 'guardado', 'repetido', true, true]) &&
  aberta.caixas === 9 &&
  aberta.principais === 1 &&
  JSON.stringify(aberta.vestiveis) === JSON.stringify(['patins', null, 'oculos', null]) &&
  andou === 0 &&
  depoisDoClique.ativo === 2 &&
  depoisDoClique.naMao === 'Toalha' &&
  !fechada &&
  depoisDoF5.ativo === 2 &&
  depoisDoF5.naMao === 'Toalha';

await browser.close();
process.exit(ok ? 0 : 1);
