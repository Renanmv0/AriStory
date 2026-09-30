/**
 * O LIVRO FLEXÍVEL da apostila do Gatito: cada lição tem quantas páginas o
 * tema pedir (pedido do Renan) — de explicação, de exercício — e a de
 * ANOTAÇÕES entra quando a conta dá ímpar, para a lição seguinte começar na
 * página da esquerda.
 *
 * As lições de verdade têm hoje duas de explicação e uma de exercícios, então
 * o teste abre o livro com um módulo MEXIDO na hora (o `abrirApostila` da UI
 * é embrulhado): a lição 1 com três páginas de explicação e os exercícios em
 * duas (`novaPagina` no quarto), a 2 com três de explicação (dá cinco: ganha
 * a de anotações). E confere, dupla por dupla, no computador e no celular:
 *
 * 1. cada dupla mostra as seções na ordem certa;
 * 2. os exercícios se dividem onde a lição mandou, e o aviso do gabarito fica
 *    só na primeira página deles;
 * 3. "Refazer" leva à primeira página de exercícios;
 * 4. no celular, nada vaza para o lado, e a página de anotações aparece.
 *
 *   node scripts/paginas.mjs /tmp/pag
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './paginas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const erros = [];
const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};

/** abre o jogo com a lição 1 concluída e a 2 dada, e o módulo mexido */
const preparar = async (contexto) => {
  const page = await contexto.newPage();
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
  });
  await page.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.removeItem('aristory.save.v1');
  });
  await page.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  for (let i = 0; i < 40; i++) {
    if (await page.evaluate(() => !!window.jogo?.current?.world && !window.jogo.transitioning).catch(() => false)) break;
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => {
    const jogo = window.jogo;
    jogo.save.concluirLicao('oi-tudo-bem', 3);
    jogo.save.abrirLicao('oi-tudo-bem');
    jogo.save.abrirLicao('jantar-das-confusoes');
    const original = jogo.ui.abrirApostila.bind(jogo.ui);
    jogo.ui.abrirApostila = (pedido) => {
      const m = structuredClone(pedido.modulo);
      m.licoes[0].explicacao = [...m.licoes[0].explicacao, m.licoes[0].explicacao[1]];
      m.licoes[0].exercicios[3].novaPagina = true;
      m.licoes[1].explicacao = [...m.licoes[1].explicacao, m.licoes[1].explicacao[1]];
      return original({ ...pedido, modulo: m });
    };
  });
  return page;
};

/** as seções que estão na tela agora (uma no celular, duas no computador) */
const secoes = (page) =>
  page.evaluate(() => [...document.querySelectorAll('.apostila .pagina:not(.em-branco)')]
    .filter((el) => el.classList.contains('esq') || el.classList.contains('dir'))
    .filter((el) => getComputedStyle(el).display !== 'none')
    .map((el) => `${el.querySelector('.rotulo')?.textContent ?? ''} ${el.querySelector('.secao')?.textContent ?? ''}`.trim()));

const virar = async (page) => {
  await page.click('.apostila .virar.depois');
  await page.waitForTimeout(1300);
};

// ================================================ 1. no computador, dupla a dupla
console.log('\n1. no computador');
const pc = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await preparar(pc);
await page.evaluate(() => { window.__livro = window.jogo.abrirApostila({ licao: 'oi-tudo-bem' }); });
await page.waitForTimeout(1500);
const ESPERADO = [
  ['Lição 1 💬 Para começar', 'Lição 1 📐 Como funciona'],
  ['Lição 1 📐 Como funciona', 'Lição 1 ✏️ Mãos à obra!'],
  ['Lição 1 ✏️ Mãos à obra!', 'Lição 1 ✅ Agora eu consigo…'],
  ['Lição 2 💬 Para começar', 'Lição 2 📐 Como funciona'],
  ['Lição 2 📐 Como funciona', 'Lição 2 ✏️ Mãos à obra!'],
  ['Lição 2 ✅ Agora eu consigo…', 'Lição 2 📝 Anotações'],
];
const vistas = [];
for (let d = 0; d < ESPERADO.length; d++) {
  if (d > 0) await virar(page);
  const s = await secoes(page);
  vistas.push(s);
  conferir(s.join(' | ') === ESPERADO[d].join(' | '), `dupla ${d + 1}: ${ESPERADO[d].join(' | ')}`, s.join(' | '));
  if (d === 1) {
    const naDireita = await page.evaluate(() => [...document.querySelectorAll('.apostila .pagina.dir .exercicio')].map((e) => e.dataset.ex));
    const aviso = await page.evaluate(() => document.querySelectorAll('.apostila .pagina.dir .aviso-gabarito').length);
    conferir(naDireita.join() === '0,1,2' && aviso === 1, 'a primeira página de exercícios tem os três primeiros e o aviso do gabarito', naDireita.join());
  }
  if (d === 2) {
    const naEsquerda = await page.evaluate(() => [...document.querySelectorAll('.apostila .pagina.esq .exercicio')].map((e) => e.dataset.ex));
    const aviso = await page.evaluate(() => document.querySelectorAll('.apostila .pagina.esq .aviso-gabarito').length);
    conferir(naEsquerda[0] === '3' && aviso === 0, 'a segunda começa no quarto (o `novaPagina`), sem repetir o aviso', naEsquerda.join());
  }
  await page.screenshot({ path: `${OUT}-pc-dupla-${d + 1}.png` });
}
// o "Refazer" da lição 1 volta para a primeira página de exercícios (a 6, na dupla 5-6)
await page.click('.apostila .fechar-apostila');
await page.waitForTimeout(600);
await page.evaluate(() => { window.__livro = window.jogo.abrirApostila({ licao: 'oi-tudo-bem' }); });
await page.waitForTimeout(1500);
await virar(page);
await page.click('.apostila .pagina.dir .refazer');
await page.waitForTimeout(1500);
const depoisDeRefazer = await page.evaluate(() => window.jogo.ui.apostila.pagina);
conferir(depoisDeRefazer === 4 && (await secoes(page))[1] === 'Lição 1 ✏️ Mãos à obra!',
  '"Refazer" fica na dupla da primeira página de exercícios', String(depoisDeRefazer));
await page.click('.apostila .fechar-apostila');
await page.waitForTimeout(500);

// ============================================== 2. no celular, página a página
console.log('\n2. no celular');
const cel = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const pm = await preparar(cel);
await pm.evaluate(() => { window.__livro = window.jogo.abrirApostila({ licao: 'jantar-das-confusoes' }); });
await pm.waitForTimeout(1500);
const umaAUma = [];
let vazou = 0;
for (let i = 0; i < 6; i++) {
  if (i > 0) await virar(pm);
  umaAUma.push((await secoes(pm))[0]);
  vazou += await pm.evaluate(() => {
    const m = document.querySelector('.apostila .pagina.esq .miolo');
    return m && m.scrollWidth > m.clientWidth + 1 ? 1 : 0;
  });
  if (i === 5) await pm.screenshot({ path: `${OUT}-cel-anotacoes.png` });
}
conferir(umaAUma.join(' | ') === ESPERADO.slice(3).flat().join(' | '), 'as seis páginas da lição 2, uma a uma', umaAUma.join(' | '));
conferir(vazou === 0, 'nenhuma página vaza para o lado', String(vazou));
conferir(await pm.evaluate(() => {
  const p = document.querySelector('.apostila .pagina.esq .pauta');
  return !!p && p.getBoundingClientRect().height > 150;
}), 'a página de anotações é pautada');

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
await browser.close();
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
process.exit(falhas.length ? 1 : 0);
