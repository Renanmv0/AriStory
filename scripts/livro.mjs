/**
 * O LIVRO DAS CARTAS e O FIM DA RODADA DO JARDIM.
 *
 * Pedido do Renan: a rodada vai até a vigésima onda, e no fim uma página conta
 * os bichos espantados e mostra as cartas que a rodada juntou. E um livro na
 * bancada guarda toda carta já escolhida alguma vez: cada uma tem o seu lugar,
 * na ordem da raridade, e as que ainda não saíram são retângulos cinzas.
 *
 *   1. o livro está na bancada, e com o save zerado abre só com vagas cinzas;
 *   2. escolher cartas na rodada põe elas no livro, cada uma no SEU lugar, e o
 *      toque numa carta abre a lupa;
 *   3. o livro sobrevive a recarregar a página (é save, e não rodada);
 *   4. a rodada que acaba jogando mostra a tela do fim — números, bichos, as
 *      cartas da mão com o selo das novas — e só depois a Josefina fala;
 *   5. no celular, livro e fim cabem na largura sem rolar para o lado.
 *
 *   node scripts/livro.mjs /tmp/lv
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/lv';
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

async function abrirPagina(viewport) {
  const page = await browser.newPage({ viewport, ...(viewport.width < 500 ? { isMobile: true, hasTouch: true } : {}) });
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_/.test(m.text())) erros.push(m.text()); });
  return page;
}
const estufa = async (page) => {
  await page.goto(`${BASE}/?cena=estufa&em=-12,7&zoom=8`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
};
const livroAberto = (page) => page.evaluate(() => document.querySelector('.livro-de-cartas')?.classList.contains('show'));
const fimAberto = (page) => page.evaluate(() => document.querySelector('.fim-do-jardim')?.classList.contains('show'));
const esperar = async (page, cond, teto = 8000) => {
  const fim = Date.now() + teto;
  while (Date.now() < fim) {
    if (await cond()) return true;
    await page.waitForTimeout(150);
  }
  return false;
};

// ======================================================== 1. o livro vazio
const page = await abrirPagina({ width: 1280, height: 800 });
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await estufa(page);
await page.mouse.click(640, 400);
await page.evaluate(() => window.jogo.debugPlace(-12.85, 7.35, -Math.PI / 2));
await page.waitForTimeout(600);
// o regador do chão, do lado da bancada, é o primeiro passo da estufa e ganha
// dela enquanto está lá: a dupla pega ele antes, como no jogo
if (/regador/i.test(await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? ''))) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1200);
  for (let i = 0; i < 10 && await page.evaluate(() => document.querySelector('.dialogue')?.classList.contains('show')); i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => window.jogo.debugPlace(-12.85, 7.35, -Math.PI / 2));
  await page.waitForTimeout(600);
}
await page.screenshot({ path: `${OUT}-bancada.png` });
const prompt = await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '');
ok(/livro das cartas/i.test(prompt), `perto da bancada o prompt é o do livro ("${prompt.trim()}")`);
await page.keyboard.press('KeyE');
ok(await esperar(page, () => livroAberto(page)), 'o E abre o livro');
const vazio = await page.evaluate(() => ({
  vagas: document.querySelectorAll('.livro-de-cartas .vaga-trancada').length,
  cartas: document.querySelectorAll('.livro-de-cartas .grade .carta-jardim:not(.vaga-trancada)').length,
  total: window.aristoryCartas?.length,
  capitulos: [...document.querySelectorAll('.livro-de-cartas h3')].map((h) => h.textContent.trim()),
}));
console.log('       capítulos:', vazio.capitulos.join(' · '));
ok(vazio.cartas === 0 && vazio.vagas > 80, `save zerado: ${vazio.vagas} vagas cinzas e nenhuma carta`);
ok(vazio.capitulos.length === 4 && /Comuns/.test(vazio.capitulos[0]) && /Lendárias/.test(vazio.capitulos[3]),
  'quatro capítulos, das comuns às lendárias');
await page.screenshot({ path: `${OUT}-livro-vazio.png` });
await page.keyboard.press('Escape');
ok(await esperar(page, async () => !(await livroAberto(page))), 'o Escape fecha o livro');

// ============================================ 2. escolher põe a carta no livro
const ESCOLHIDAS = ['bico-1', 'poca', 'grito', 'arco-iris', 'aspersor', 'bis'];
await page.evaluate(async (ids) => {
  const u = window.jogo.current.world.root.userData;
  const r = u.rodada;
  r.aoAcabar = null;
  r.escolhaForcada = 0;
  u.vitrineDoJato([]);
  r.limparBichos();
  for (const id of ids) await r.pegarCarta(id, 99);
  // o Bis leva o degrau de cima da próxima série
  await r.pegarCarta('leque-1', 99);
  r.terminar();
}, ESCOLHIDAS);
const noSave = await page.evaluate(() => [...window.jogo.cartasDoLivro()]);
console.log('       no livro:', noSave.join(', '));
ok(ESCOLHIDAS.every((id) => noSave.includes(id)) && noSave.includes('leque-2'),
  'cada carta escolhida entrou no livro (e a que o Bis trouxe junto)');
await page.evaluate(() => window.jogo.debugPlace(-12.85, 7.35, -Math.PI / 2));
await page.waitForTimeout(500);
await page.keyboard.press('KeyE');
await esperar(page, () => livroAberto(page));
await page.waitForTimeout(300);
const cheio = await page.evaluate(() => {
  const vagas = [...document.querySelectorAll('.livro-de-cartas .grade > *')];
  return {
    ordem: vagas.map((el) => (el.classList.contains('vaga-trancada') ? null : el.getAttribute('aria-label')?.split(':')[0])),
    total: vagas.length,
    conta: document.querySelector('.livro-de-cartas .conta')?.textContent,
  };
});
const posicoes = cheio.ordem.map((n, i) => (n ? `${i + 1}:${n}` : null)).filter(Boolean);
console.log(`       ${cheio.conta} · lugares: ${posicoes.join(' · ')}`);
// a ordem do livro: as mesmas cartas nos mesmos lugares, independente da ordem da escolha
const esperado = await page.evaluate(() => window.aristoryOrdemDoLivro());
const lugaresCertos = cheio.ordem.every((nome, i) => !nome || nome === esperado[i]);
ok(cheio.total === esperado.length && lugaresCertos, 'cada carta aparece no lugar dela, na ordem da raridade');
ok(posicoes.length === ESCOLHIDAS.length + 2, `${posicoes.length} cartas à mostra, o resto cinza`);
await page.screenshot({ path: `${OUT}-livro.png` });
// a lupa
await page.locator('.livro-de-cartas .grade .carta-jardim:not(.vaga-trancada)').first().click();
ok(await page.evaluate(() => document.querySelector('.livro-de-cartas .lupa')?.classList.contains('show')), 'tocar numa carta abre a lupa');
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}-lupa.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
ok(await livroAberto(page), 'o primeiro Escape fecha só a lupa');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// ================================================ 3. o livro sobrevive ao F5
await estufa(page);
const depois = await page.evaluate(() => [...window.jogo.cartasDoLivro()]);
ok(depois.length === noSave.length, `depois de recarregar o livro continua com ${depois.length} cartas`);

// ================================================ 4. o fim da rodada
await page.evaluate(() => {
  const u = window.jogo.current.world.root.userData;
  const r = u.rodada;
  // no meio do terreiro: perto da bancada os bichos ficariam atrás do tomate
  window.jogo.debugPlace(0, 2, Math.PI);
  u.comecarRodada();
  r.escalaDoTempo = 3;
  r.ondasDaRodada = 1;
});
// joga um pedacinho: bichos soltos e espantados na hora, uma carta nova
await page.evaluate(async () => {
  const r = window.jogo.current.world.root.userData.rodada;
  r.fixarNivel(99);
  await r.pegarCarta('chuva', 99);
  await r.pegarCarta('bico-1', 99);
  r.plano = [];
  r.limparBichos();
  // três lagartejos e um coelhatu, direto na frente do regador
  const eu = window.jogo.playerPosition();
  for (const [dx, praga] of [[-0.6, 'lagartejo'], [0, 'lagartejo'], [0.6, 'lagartejo'], [0.3, 'coelhatu']]) {
    r.soltarBicho(praga, eu.x + dx, eu.z - 1.6);
  }
});
// o robô: fica a 1,5 m do bicho mais perto (o regador atira sozinho)
let abriu = false;
for (let i = 0; i < 300 && !abriu; i++) {
  abriu = await fimAberto(page);
  if (abriu) break;
  await page.evaluate(() => {
    const j = window.jogo;
    const s = j.current.world.root.userData.rodada.estado();
    const eu = j.playerPosition();
    const vivos = s.invasores.filter((b) => b.estado !== 'fugindo' && b.estado !== 'sacudindo');
    if (!vivos.length) return;
    const b = vivos.sort((a, c) => Math.hypot(a.x - eu.x, a.z - eu.z) - Math.hypot(c.x - eu.x, c.z - eu.z))[0];
    const d = Math.hypot(b.x - eu.x, b.z - eu.z) || 1;
    if (d > 1.8) j.player.teleport(eu.x + ((b.x - eu.x) * (d - 1.5)) / d, eu.z + ((b.z - eu.z) * (d - 1.5)) / d, 0);
  });
  await page.waitForTimeout(400);
}
if (!abriu) {
  console.log('       estado:', JSON.stringify(await page.evaluate(() => {
    const s = window.jogo.current.world.root.userData.rodada.estado();
    return { rodando: s.rodando, pausada: s.pausada, onda: s.onda, inv: s.invasores.map((i) => `${i.estado}@${i.x.toFixed(1)},${i.z.toFixed(1)}`), item: window.jogo.getActiveHandItem()?.id, dialogo: document.querySelector('.dialogue')?.classList.contains('show'), texto: document.querySelector('.dialogue .text')?.textContent };
  })));
}
ok(abriu, 'a rodada que acaba jogando abre a tela do fim');
const fim = await page.evaluate(() => ({
  selo: document.querySelector('.fim-do-jardim .selo-fim')?.textContent,
  titulo: document.querySelector('.fim-do-jardim h2')?.textContent,
  numeros: [...document.querySelectorAll('.fim-do-jardim .numeros div')].map((d) => d.textContent.replace(/\s+/g, ' ').trim()),
  pragas: [...document.querySelectorAll('.fim-do-jardim .praga')].map((d) => d.textContent.trim()),
  cartas: document.querySelectorAll('.fim-do-jardim .grade .carta-jardim').length,
  novas: [...document.querySelectorAll('.fim-do-jardim .vaga.nova .carta-jardim')].map((el) => el.getAttribute('aria-label')?.split(':')[0]),
  falando: document.querySelector('.dialogue')?.classList.contains('show'),
}));
console.log(`       ${fim.selo} · ${fim.titulo}`);
console.log(`       ${fim.numeros.join(' | ')} · ${fim.pragas.join(', ')}`);
ok(/Vitória/.test(fim.selo ?? ''), 'aguentou todas as ondas: vitória');
ok(fim.numeros.some((n) => /^4\s*bichos espantados/.test(n)), 'conta os bichos espantados');
ok(fim.pragas.some((p) => /Lagartejo ×3/.test(p)) && fim.pragas.some((p) => /Coelhatu ×1/.test(p)), 'e quantos de cada praga');
ok(fim.cartas === 2, `a página tem as ${fim.cartas} cartas da mão`);
ok(fim.novas.length === 1 && fim.novas[0] === 'Chuva', `só a Chuva ganha o selo de nova no livro (${fim.novas})`);
ok(!fim.falando, 'a Josefina espera a tela do fim fechar para falar');
await page.screenshot({ path: `${OUT}-fim.png` });
await page.locator('.fim-do-jardim .fechar').click();
ok(await esperar(page, () => page.evaluate(() => document.querySelector('.dialogue')?.classList.contains('show'))),
  'fechou a tela, a Josefina fala');
const fala = await page.locator('.dialogue .text').textContent();
console.log(`       Josefina: ${fala}`);
await page.close();

// ================================================ 5. no celular
const cel = await abrirPagina({ width: 390, height: 844 });
await estufa(cel);
await cel.evaluate(() => { void window.jogo.abrirLivroDeCartas(window.aristoryCartasNaTela()); });
await esperar(cel, () => livroAberto(cel));
await cel.waitForTimeout(300);
const largura = () => cel.evaluate(() => ({
  doc: document.documentElement.scrollWidth,
  livro: Math.max(...[...document.querySelectorAll('.livro-de-cartas .grade > *, .fim-do-jardim .grade > *')]
    .map((el) => el.getBoundingClientRect().right)),
}));
let l = await largura();
ok(l.doc <= 390 && l.livro <= 390, `no celular o livro cabe na largura (${l.livro.toFixed(0)} px)`);
await cel.screenshot({ path: `${OUT}-livro-celular.png` });
await cel.evaluate(() => window.jogo.ui.fecharLivro());
await cel.evaluate(() => {
  void window.jogo.mostrarFimDoJardim({
    venceu: false, onda: 7, ondas: 20, espantados: 83,
    porPraga: [{ nome: 'Lagartejo', quantos: 50 }, { nome: 'Gafanhopo', quantos: 21 }, { nome: 'Coelhatu', quantos: 12 }],
    canteiros: 0, totalDeCanteiros: 8, nivel: 13,
    cartas: window.aristoryCartasNaTela().slice(0, 5), novas: [window.aristoryCartasNaTela()[1].id],
  });
});
await esperar(cel, () => fimAberto(cel));
await cel.waitForTimeout(300);
l = await largura();
ok(l.doc <= 390 && l.livro <= 390, `no celular o fim cabe na largura (${l.livro.toFixed(0)} px)`);
await cel.screenshot({ path: `${OUT}-fim-celular.png` });

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
