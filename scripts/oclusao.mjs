/**
 * A OCLUSÃO NA RODADA DO JARDIM, e o botão da ajuda escondido nas falas.
 *
 * Dois pedidos do Renan, jogando no celular:
 *
 *   1. gota que caía atrás de uma árvore ou da parede dos portões sumia — agora
 *      o que fica entre a câmera e um bicho ou uma gota fica TRANSLÚCIDO, e
 *      volta ao normal quando sai da frente (`core/Oclusao.ts`);
 *   2. o botão "chamar o Renan" caía em cima do texto quando um bicho do clube
 *      entrava falando — com fala na tela, ele some.
 *
 *   node scripts/oclusao.mjs /tmp/oc
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/oc';
const BASE = process.env.BASE ?? 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const problemas = [];
const erros = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) problemas.push(msg);
};
const esperar = async (page, cond, teto = 8000) => {
  const fim = Date.now() + teto;
  while (Date.now() < fim) {
    if (await cond()) return true;
    await page.waitForTimeout(150);
  }
  return false;
};

async function abrir(viewport) {
  const page = await browser.newPage({ viewport, ...(viewport.width < 500 ? { isMobile: true, hasTouch: true } : {}) });
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_/.test(m.text())) erros.push(m.text()); });
  await page.goto(`${BASE}/?cena=estufa&em=0,2`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
  await page.evaluate(() => {
    const u = window.jogo.current.world.root.userData;
    u.rodada.aoAcabar = null;
    window.jogo.debugPlace(-2, -6.5, Math.PI);
    u.comecarRodada();
    u.rodada.plano = [];
    u.rodada.limparBichos();
    u.rodada.regadorDeFolga = true;
  });
  return page;
}
const quantas = (page) => page.evaluate(() => window.jogo.oclusao.quantas);

// ================================================ 1. a parede dos portões
const page = await abrir({ width: 1280, height: 800 });
await page.waitForTimeout(800);
const antes = await quantas(page);
// três gotas do lado de FORA da parede do fundo (z = -11), atrás dela para a câmera
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.soltarGotasAqui(-4.5, -12.4, 3));
const esmaeceu = await esperar(page, async () => (await quantas(page)) > antes);
const comGotas = await quantas(page);
console.log(`       malhas translúcidas: ${antes} sem gota → ${comGotas} com as gotas atrás da parede`);
ok(esmaeceu, 'a gota atrás da parede dos portões deixa a parede translúcida');
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}-parede.png` });
// um bicho atrás da parede também
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', 3.5, -12.6, { porta: 1, fora: true }));
await page.waitForTimeout(600);
// as gotas somem (cata tudo) e o bicho sai: a parede volta
await page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  r.gotas.limpar();
  r.limparBichos();
});
const voltou = await esperar(page, async () => (await quantas(page)) <= antes);
ok(voltou, `sem ninguém atrás, a parede volta a ser sólida (${await quantas(page)} translúcidas)`);
// a rodada acabou: nada fica translúcido
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.soltarGotasAqui(-4.5, -12.4, 2));
await esperar(page, async () => (await quantas(page)) > 0);
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.terminar());
await page.waitForTimeout(500);
ok((await quantas(page)) === 0, 'no fim da rodada tudo volta a ser sólido');
await page.close();

// ================================== 2. no celular, a fala esconde o botão da ajuda
const cel = await abrir({ width: 390, height: 844 });
await cel.evaluate(() => window.jogo.current.world.root.userData.rodada.encherAjuda());
await cel.waitForTimeout(600);
const visivel = () => cel.evaluate(() => {
  const b = document.querySelector('.ajuda-do-par');
  return !!b && getComputedStyle(b).display !== 'none' && b.classList.contains('show');
});
ok(await visivel(), 'na rodada o botão da ajuda aparece');
await cel.evaluate(() => { void window.jogo.say(['Me chamaram? Ouvi dizer que aqui tem bicho que não gosta de água.'], 'Capy'); });
await esperar(cel, () => cel.evaluate(() => document.querySelector('.dialogue')?.classList.contains('show')));
await cel.waitForTimeout(300);
ok(!(await visivel()), 'com alguém falando, o botão da ajuda some');
await cel.screenshot({ path: `${OUT}-fala-celular.png` });
for (let i = 0; i < 6 && await cel.evaluate(() => document.querySelector('.dialogue')?.classList.contains('show')); i++) {
  await cel.locator('.dialogue').click();
  await cel.waitForTimeout(400);
}
ok(await esperar(cel, visivel), 'a fala acabou, o botão volta');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
