/**
 * A PÁGINA DE ANOTAÇÕES da apostila do Gatito (lição 15, "Vira à esquerda") —
 * pedido do Renan: dá para ESCREVER nela (só escrita, nada de desenho).
 * Mede, e não só fotografa:
 *
 * 1. a página existe no fim da lição 15 e tem um campo de texto sobre as linhas;
 * 2. dá para digitar, e as teclas do jogo ficam quietas (o "j" do diário, o
 *    "e" de interagir, o espaço, as setas) — a letra vai para o campo;
 * 3. o texto sobrevive a virar a página e voltar, a fechar o livro e reabrir,
 *    e a recarregar a página do navegador (o save guarda, até sem esperar o
 *    respiro da digitação);
 * 4. cada lição tem a sua página (o texto da 15 não aparece na de outra);
 * 5. "Refazer" os exercícios não apaga as anotações;
 * 6. o limite de tamanho, e o texto que vem torto de um save antigo/estranho;
 * 7. no celular: o campo cabe, a foto e o digitar com o toque.
 *
 *   node scripts/anotacoes.mjs /tmp/an
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/an';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium';

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

const ATE_A_14 = [
  'oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho',
  'um-dia-de-gatito', 'bola-pra-frente', 'ai-que-dor', 'partiu-praia', 'cartao-postal-do-rio', 'quanto-custa',
  'de-quem-e-isso', 'mexa-misture-prove',
];
const FLAGS = ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'escola-visitada', 'festa-da-torcida', 'jean-luc-batido', 'valentina-conhecida'];
const LICAO = 'vira-a-esquerda';

const pronto = (p) => p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });

/** uma página com as lições até a 14 feitas e a 15 dada; `limpo` apaga o save antes */
const abrir = async (contexto, limpo = true) => {
  const p = await contexto.newPage();
  p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => {
    if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
  });
  await p.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  if (limpo) {
    await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
    await p.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  }
  await pronto(p);
  if (limpo) {
    await p.evaluate(([flags, ate14, licao]) => {
      const j = window.jogo;
      for (const f of flags) j.setFlag(f);
      for (const id of ate14) { j.save.abrirLicao(id); j.save.concluirLicao(id, 3); }
      j.save.abrirLicao(licao);
    }, [FLAGS, ATE_A_14, LICAO]);
  }
  return p;
};

/** abre o livro na lição 15 e vira até a página de anotações; devolve se achou */
const irAteAsAnotacoes = async (p) => {
  await p.evaluate((licao) => { window.__livro = window.jogo.abrirApostila({ licao }); }, LICAO);
  await p.waitForTimeout(1200);
  for (let i = 0; i < 14; i++) {
    if (await p.locator('.apostila .pagina:visible textarea[data-anotacao]').count()) return true;
    await p.click('.apostila .virar.depois');
    await p.waitForTimeout(900);
  }
  return !!(await p.locator('.apostila .pagina:visible textarea[data-anotacao]').count());
};
const campo = (p) => p.locator('.apostila .pagina:visible textarea[data-anotacao]').first();
const salvo = (p) => p.evaluate((l) => window.jogo.save.apostila.anotacoes[l] ?? null, LICAO);

// ======================================================= 1. no computador
console.log('\n1. a página de anotações da lição 15');
const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });
let p = await abrir(ctx);
const achou = await irAteAsAnotacoes(p);
conferir(achou, 'a página de anotações tem um campo de texto');
if (!achou) { console.log('sem a página, sem o resto'); process.exit(1); }
const rotulo = await p.evaluate(() => [...document.querySelectorAll('.apostila .pagina')]
  .find((el) => el.querySelector('textarea[data-anotacao]'))?.querySelector('.rotulo')?.textContent ?? '');
conferir(/15/.test(rotulo), 'é a página da lição 15', rotulo);
const forma = await campo(p).evaluate((el) => {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return { alto: r.height, largo: r.width, linha: cs.lineHeight, selecao: cs.userSelect, desligado: el.disabled || el.readOnly };
});
conferir(forma.alto > 200 && forma.largo > 200, 'o campo é uma folha pautada grande', `${Math.round(forma.largo)}×${Math.round(forma.alto)}`);
conferir(forma.linha === '30px', 'a linha escrita assenta nas linhas da pauta (30px)', forma.linha);
conferir(forma.selecao === 'text' && !forma.desligado, 'dá para selecionar e escrever (o jogo é user-select: none)');

// ------------------------------------------------ 2. digitar sem acionar o jogo
console.log('\n2. escrever');
const diarioAntes = await p.evaluate(() => window.jogo.ui.journalOpen);
await campo(p).click();
const TEXTO = 'esquerda = izquierda\nvirar = girar\nexemplo: j e t espaço';
await p.keyboard.type(TEXTO, { delay: 15 });
await p.waitForTimeout(150);
const noCampo = await campo(p).inputValue();
conferir(noCampo === TEXTO, 'o que foi digitado entrou inteiro (j, e, t, espaço e quebra de linha)', JSON.stringify(noCampo));
const diarioDepois = await p.evaluate(() => window.jogo.ui.journalOpen);
conferir(diarioAntes === diarioDepois && !diarioDepois, 'o "j" não abriu o diário no meio da palavra');
conferir(await p.evaluate(() => window.jogo.ui.apostila.aberto), 'o livro continua aberto');
conferir((await secoesVisiveis(p)).some((s) => s.includes('Anotações')), 'e continua na página de anotações');
async function secoesVisiveis(pg) {
  return pg.evaluate(() => [...document.querySelectorAll('.apostila .pagina')]
    .filter((el) => getComputedStyle(el).display !== 'none')
    .map((el) => el.querySelector('.secao')?.textContent ?? ''));
}
await p.screenshot({ path: `${OUT}-escrita.png` });

// ------------------------------------------------ 3. o texto fica
console.log('\n3. o texto fica');
await p.waitForTimeout(600);
conferir((await salvo(p)) === TEXTO, 'o save guarda o texto depois do respiro da digitação');
await p.click('.apostila .virar.antes');
await p.waitForTimeout(1000);
await p.click('.apostila .virar.depois');
await p.waitForTimeout(1000);
conferir((await campo(p).inputValue()) === TEXTO, 'virar a página e voltar mantém o texto');

// digita mais e fecha o livro NA HORA (sem esperar o respiro): o fechar manda para o save
await campo(p).click();
await p.keyboard.press('Control+End');
await p.keyboard.type('\nacabei!');
await p.click('.apostila .fechar-apostila');
await p.waitForTimeout(300);
const TEXTO2 = `${TEXTO}\nacabei!`;
conferir((await salvo(p)) === TEXTO2, 'fechar o livro logo depois de digitar não perde a última linha', JSON.stringify(await salvo(p)));
await p.evaluate((l) => { window.__livro = window.jogo.abrirApostila({ licao: l }); }, LICAO);
await p.waitForTimeout(1200);
for (let i = 0; i < 14 && !(await p.locator('.apostila .pagina:visible textarea[data-anotacao]').count()); i++) {
  await p.click('.apostila .virar.depois');
  await p.waitForTimeout(700);
}
conferir((await campo(p).inputValue()) === TEXTO2, 'reabrir o livro mostra o texto escrito');

// ------------------------------------------------ 4. cada lição tem a sua; refazer não apaga
console.log('\n4. por lição');
const outras = await p.evaluate((l) => {
  const a = window.jogo.save.apostila.anotacoes;
  return Object.keys(a).filter((id) => id !== l);
}, LICAO);
conferir(outras.length === 0, 'só a lição 15 tem anotações no save', outras.join(','));
await p.evaluate(() => window.jogo.save.anotarLicao('maior-melhor-lindissimo', 'texto da 18'));
const na15 = await campo(p).inputValue();
conferir(na15 === TEXTO2, 'o texto de outra lição não aparece na 15');
await p.click('.apostila .fechar-apostila');
await p.waitForTimeout(300);

// "Refazer" a lição 15 (concluída) não apaga a página de anotações
await p.evaluate((l) => { window.jogo.save.concluirLicao(l, 2); window.__livro = window.jogo.abrirApostila({ licao: l }); }, LICAO);
await p.waitForTimeout(1200);
const temRefazer = await p.locator('.apostila .refazer:visible').count();
if (temRefazer) {
  await p.locator('.apostila .refazer:visible').first().click();
  await p.waitForTimeout(1500);
}
const aindaTem = await p.evaluate((l) => window.jogo.save.apostila.anotacoes[l] ?? null, LICAO);
conferir(aindaTem === TEXTO2, `"Refazer" não apaga as anotações${temRefazer ? '' : ' (sem botão Refazer visível; conferido só o save)'}`);
await p.click('.apostila .fechar-apostila');
await p.waitForTimeout(300);

// ------------------------------------------------ 5. recarregar a página
console.log('\n5. recarregar');
await p.close();
const p2 = await abrir(ctx, false);
conferir(await irAteAsAnotacoes(p2), 'depois de recarregar, a página de anotações abre');
conferir((await campo(p2).inputValue()) === TEXTO2, 'o texto está lá depois de recarregar a página do navegador');

// ------------------------------------------------ 6. limite e texto estranho
console.log('\n6. limite e save estranho');
await p2.click('.apostila .fechar-apostila');
await p2.waitForTimeout(300);
const limite = await p2.evaluate(async (l) => {
  const j = window.jogo;
  j.save.anotarLicao(l, 'x'.repeat(5000));
  const tamanho = j.save.apostila.anotacoes[l].length;
  j.save.anotarLicao(l, '   \n  ');
  const apagou = j.save.apostila.anotacoes[l] === undefined;
  j.save.anotarLicao(l, 'de volta');
  return { tamanho, apagou, volta: j.save.apostila.anotacoes[l] };
}, LICAO);
conferir(limite.tamanho === 2000, 'o save corta o texto em 2000 letras', String(limite.tamanho));
conferir(limite.apagou, 'texto em branco apaga a anotação');
// um save com anotações malucas: não quebra, e as boas ficam
await p2.evaluate(() => {
  const k = 'aristory.save.v1';
  const d = JSON.parse(localStorage.getItem(k));
  d.apostila.anotacoes = { 'vira-a-esquerda': 'salvei', 'a': 42, 'b': null, 'c': { x: 1 }, 'd': '   ' };
  localStorage.setItem(k, JSON.stringify(d));
});
await p2.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
await pronto(p2);
const limpas = await p2.evaluate(() => window.jogo.save.apostila.anotacoes);
conferir(JSON.stringify(limpas) === JSON.stringify({ 'vira-a-esquerda': 'salvei' }), 'anotação que não é texto (ou em branco) some do save e a boa fica', JSON.stringify(limpas));
// um save SEM o campo de anotações (de antes deste recurso): abre normal
await p2.evaluate(() => {
  const k = 'aristory.save.v1';
  const d = JSON.parse(localStorage.getItem(k));
  delete d.apostila.anotacoes;
  localStorage.setItem(k, JSON.stringify(d));
});
await p2.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
await pronto(p2);
conferir(await p2.evaluate(() => JSON.stringify(window.jogo.save.apostila.anotacoes)) === '{}', 'save antigo, sem anotações, abre vazio');
await p2.close();

// ------------------------------------------------ 7. celular
console.log('\n7. no celular');
const cel = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const pc = await abrir(cel);
conferir(await irAteAsAnotacoes(pc), 'no celular a página de anotações também tem o campo');
const medidas = await campo(pc).evaluate((el) => {
  const r = el.getBoundingClientRect();
  const pg = el.closest('.pagina').getBoundingClientRect();
  return { esq: r.left - pg.left, dir: pg.right - r.right, alto: r.height, vaza: el.scrollWidth > el.clientWidth + 1 };
});
conferir(medidas.esq >= 0 && medidas.dir >= 0 && !medidas.vaza, 'o campo cabe na página, sem vazar para o lado', JSON.stringify(medidas));
conferir(medidas.alto > 150, 'e tem altura para escrever', String(Math.round(medidas.alto)));
await campo(pc).tap();
await pc.keyboard.type('anotei no celular');
await pc.waitForTimeout(700);
conferir((await salvo(pc)) === 'anotei no celular', 'escrever no celular guarda no save');
// arrastar o dedo dentro do campo (selecionar texto) não vira a página
const antes = await pc.evaluate(() => window.jogo.ui.apostila.pagina);
const caixa = await campo(pc).boundingBox();
await pc.mouse.move(caixa.x + caixa.width - 20, caixa.y + 40);
await pc.mouse.down();
await pc.mouse.move(caixa.x + 20, caixa.y + 44, { steps: 6 });
await pc.mouse.up();
await pc.waitForTimeout(900);
const depois = await pc.evaluate(() => window.jogo.ui.apostila.pagina);
conferir(antes === depois, 'arrastar dentro do campo seleciona o texto e não vira a página', `${antes}→${depois}`);
await pc.screenshot({ path: `${OUT}-celular.png` });

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
await browser.close();
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
process.exit(falhas.length ? 1 : 0);
