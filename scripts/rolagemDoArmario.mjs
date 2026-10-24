/**
 * VESTIR NÃO MANDA A LISTA PARA O TOPO (o Ari reparou no celular).
 *
 * Vestir, tirar ou provar uma peça redesenha o painel inteiro, e a lista
 * voltava para cima: para provar a peça do lado, era rolar tudo de novo. O
 * redesenho esvaziava a lista e o filtro media a tela com ela vazia — a
 * rolagem virava 0 (ver `semPerderARolagem`, em `Ui.ts`).
 *
 * O teste rola até o meio, mexe numa peça e mede a rolagem de novo, no
 * guarda-roupa (vestir e tirar), na aba de piscina do vestiário (provar) e na
 * arara da Estella (provar). Tudo num celular de verdade (iPhone 13).
 *
 * Uso: node scripts/rolagemDoArmario.mjs
 */
import { chromium, devices } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await (await browser.newContext(devices['iPhone 13'])).newPage();
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const problemas = [];
const ok = (cond, msg) => {
  console.log(`  ${cond ? 'ok  ' : 'FALHOU'} ${msg}`);
  if (!cond) problemas.push(msg);
};

await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// o armário bem cheio: toda roupa cosmética do catálogo
await page.evaluate(() => {
  const j = window.jogo;
  for (const it of Object.values(window.aristoryItens)) if (it.tipo === 'vestivel' && !it.funcional) j.storeItem(it, j.playerId());
  j.abrirGuardaRoupa();
});
await page.waitForTimeout(800);

const rolar = (sel, y) => page.evaluate(([s, v]) => { document.querySelector(s).scrollTop = v; }, [sel, y]);
const rolagem = (sel) => page.evaluate((s) => document.querySelector(s).scrollTop, sel);
/** uma peça que está À VISTA dentro da caixa que rola (longe da borda de cima) */
const pecaAVista = (caixa, pecas) => page.evaluate(([c, p]) => {
  const l = document.querySelector(c).getBoundingClientRect();
  const e = [...document.querySelectorAll(p)].find((el) => {
    const r = el.getBoundingClientRect();
    return r.top > l.top + 60 && r.bottom < l.bottom;
  });
  return e?.dataset.id ?? null;
}, [caixa, pecas]);

// ------------------------------------------------ 1. guarda-roupa: vestir
const LISTA = '.armario .lista';
await rolar(LISTA, 1400);
await page.waitForTimeout(300);
const antes = await rolagem(LISTA);
const vestir = await pecaAVista(LISTA, '.armario .acervo .peca');
await page.locator(`.armario .acervo .peca[data-id="${vestir}"]`).tap();
await page.waitForTimeout(700);
const depois = await rolagem(LISTA);
// a peça vestida sai da lista e as de baixo sobem um cartão: a rolagem é a mesma
ok(antes > 1000 && Math.abs(depois - antes) <= 2, `vestir ${vestir} no meio da lista não volta pro topo (${antes} → ${depois})`);

// ------------------------------------------------ 2. guarda-roupa: tirar
await page.locator('.armario .parte.cheio').first().tap();
await page.waitForTimeout(700);
const depoisDeTirar = await rolagem(LISTA);
ok(Math.abs(depoisDeTirar - depois) <= 2, `tirar pela vaga também não (${depois} → ${depoisDeTirar})`);

// ------------------------------------------------ 3. vestiário: provar
await page.evaluate(() => { window.jogo.ui.fecharArmario(); window.jogo.abrirVestiario(); });
await page.waitForTimeout(800);
await page.locator('.armario .abas [data-aba="piscina"]').tap();
await page.waitForTimeout(500);
await rolar(LISTA, 700);
await page.waitForTimeout(300);
const antesP = await rolagem(LISTA);
const provar = await pecaAVista(LISTA, '.armario .vitrine-piscina .produto');
await page.locator(`.armario .produto[data-id="${provar}"]`).tap();
await page.waitForTimeout(700);
const depoisP = await rolagem(LISTA);
ok(antesP > 500 && Math.abs(depoisP - antesP) <= 2, `provar ${provar} no vestiário não volta pro topo (${antesP} → ${depoisP})`);
await page.evaluate(() => window.jogo.ui.fecharArmario());
await page.waitForTimeout(400);

// ------------------------------------------------ 4. a arara da Estella
const FOLHA = '.loja .sheet';
await page.evaluate(() => {
  const I = window.aristoryItens;
  const pecas = Object.values(I).filter((i) => i.tipo === 'vestivel' && i.preco);
  window.jogo.abrirLoja('Arara de teste', pecas);
});
await page.waitForTimeout(800);
const alto = await page.evaluate((s) => document.querySelector(s).scrollHeight - document.querySelector(s).clientHeight, FOLHA);
await rolar(FOLHA, Math.min(900, alto));
await page.waitForTimeout(300);
const antesL = await rolagem(FOLHA);
const provarL = await pecaAVista(FOLHA, '.loja .vitrine .peca');
await page.locator(`.loja .vitrine .peca[data-id="${provarL}"]`).tap();
await page.waitForTimeout(700);
const depoisL = await rolagem(FOLHA);
ok(antesL > 300 && Math.abs(depoisL - antesL) <= 2, `provar ${provarL} na arara da Estella não volta pro topo (${antesL} → ${depoisL})`);

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
