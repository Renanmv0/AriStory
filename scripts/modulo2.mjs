/**
 * O MÓDULO 2 DA APOSTILA (pedido do Renan): seis lições novas, no estilo do
 * Módulo 1, que só abrem depois dele.
 *
 * 1. O GINÁSIO: com o Módulo 1 inteiro (e a festa da torcida já feita),
 *    conversar com uma das três chama a LIÇÃO 7 — a chamada é a dela, e o
 *    aviso diz "lição 7";
 * 2. A AULA: na Sala 1 o Gatito abre o Módulo 2 e manda abrir na lição 7; o
 *    livro que abre é o do Módulo 2, na dupla da lição 7;
 * 3. O LIVRO, lição por lição (7 a 12), no computador: cada dupla
 *    fotografada, nada vazando para o lado, e o quanto cada página rola;
 * 4. TROCAR DE APOSTILA pelo sumário (o Módulo 1 de dentro do livro do 2, e
 *    volta), e o FIM de cada livro: o do 1 promete o Módulo 2, o do 2 diz
 *    "em breve: Módulo 3";
 * 5. O CELULAR: as páginas do Módulo 2 uma a uma, sem vazar para o lado.
 *
 *   node scripts/modulo2.mjs /tmp/m2        (SO=livro, SO=celular… roda uma parte)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/m2';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.includes(nome);

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

const M1 = ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho'];
const M2 = ['um-dia-de-gatito', 'bola-pra-frente', 'ai-que-dor', 'partiu-praia', 'cartao-postal-do-rio', 'quanto-custa'];
const FLAGS = ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'jean-luc-batido', 'escola-visitada', 'festa-da-torcida'];

/** uma página com um save de teste: as estrelas e as aulas dadas, e as flags */
const abrir = async (contexto, cena, apostila, em = '') => {
  const p = await contexto.newPage();
  p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => {
    if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
  });
  await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.evaluate(([apostila, flags]) => {
    const j = window.jogo;
    for (const f of flags) j.setFlag(f);
    for (const id of apostila.abertas) j.save.abrirLicao(id);
    for (const [id, e] of Object.entries(apostila.estrelas)) j.save.concluirLicao(id, e);
  }, [apostila, FLAGS]);
  await p.goto(`${BASE}/?cena=${cena}${em ? `&em=${em}` : ''}`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.waitForTimeout(1200);
  return p;
};
const estrelas = (ids, n = 3) => Object.fromEntries(ids.map((id) => [id, n]));

/** passa as falas com E, anotando "quem: texto", até `ate` acontecer */
const conversar = async (p, ate, max = 50) => {
  const falas = [];
  for (let i = 0; i < max && !(await ate()); i++) {
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(400);
      continue;
    }
    await p.waitForTimeout(500);
    const quem = await p.evaluate(() => document.querySelector('.dialogue .who')?.textContent ?? '');
    const t = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (t && !falas.includes(`${quem}: ${t}`)) falas.push(`${quem}: ${t}`);
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(150);
  }
  return falas;
};

/** o que está nas páginas visíveis: o rótulo, e quanto cada uma rola e vaza */
const paginas = (p) => p.evaluate(() => [...document.querySelectorAll('.apostila .pagina.esq, .apostila .pagina.dir')]
  .filter((el) => getComputedStyle(el).display !== 'none')
  .map((el) => {
    const m = el.querySelector('.miolo');
    return {
      rotulo: `${el.querySelector('.rotulo')?.textContent ?? ''} ${el.querySelector('.secao')?.textContent ?? ''}`.trim(),
      rola: m ? +(m.scrollHeight / Math.max(1, m.clientHeight)).toFixed(2) : 0,
      vaza: m ? m.scrollWidth > m.clientWidth + 1 : false,
    };
  }));
const virar = async (p) => {
  await p.click('.apostila .virar.depois');
  await p.waitForTimeout(1300);
};

// =============================================================== 1 e 2. a aula
if (parte('aula')) {
  console.log('\n1. o ginásio chama a lição 7');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await abrir(ctx, 'escola-ginasio', { estrelas: estrelas(M1), abertas: M1 });
  const luna = await p.evaluate(() => {
    let r = null;
    window.jogo.current.world.root.traverse((o) => {
      const b = o.userData?.teste?.luna;
      if (b && !r) r = { x: b.x, z: b.z };
    });
    return r;
  });
  conferir(!!luna, 'a Luna está no ginásio');
  await p.evaluate(({ x, z }) => window.jogo.debugPlace(x + 0.5, z + 0.9, Math.atan2(-0.5, -0.9)), luna);
  for (let i = 0; i < 24; i++) {
    if (/Luna/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) break;
    await p.waitForTimeout(250);
  }
  await p.evaluate(() => {
    window.__avisos = [];
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => window.__avisos.push(n.textContent ?? ''))))
      .observe(document.querySelector('.toasts'), { childList: true });
  });
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(600);
  const chamada = await conversar(p, () => p.evaluate(() => window.jogo.flag('aula-chamada')), 60);
  await p.waitForTimeout(800);
  console.log('      ' + chamada.slice(-3).join('\n      '));
  conferir(chamada.some((f) => f.includes('Primeira aula do Módulo 2')), 'a chamada é a da lição 7');
  conferir(await p.evaluate(() => window.jogo.flag('aula-chamada')), 'a aula fica chamada');
  const avisos = await p.evaluate(() => window.__avisos);
  conferir(avisos.some((a) => a.includes('lição 7')), 'o aviso diz "lição 7"', avisos.join(' | '));

  console.log('\n2. a aula da lição 7 na Sala 1');
  await p.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.jogo.debugPlace(-0.15, 0.55, Math.PI));
  for (let i = 0; i < 24; i++) {
    if (/aula/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) break;
    await p.waitForTimeout(250);
  }
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(800);
  const abertura = await conversar(p, () => p.evaluate(() => !!document.querySelector('.apostila.show')), 40);
  console.log('      ' + abertura.join('\n      '));
  conferir(abertura.some((f) => f.includes('Módulo 2')) && abertura.some((f) => f.includes('lição 7')),
    'o Gatito abre o Módulo 2 e manda abrir na lição 7');
  await p.waitForTimeout(1500);
  const livro = await p.evaluate(() => ({
    pagina: window.jogo.ui.apostila.pagina,
    rotulos: [...document.querySelectorAll('.apostila .pagina .rotulo')].map((e) => e.textContent),
  }));
  conferir(livro.pagina === 2 && livro.rotulos.every((r) => r === 'Lição 7'), 'o livro é o do Módulo 2, aberto na lição 7', JSON.stringify(livro));
  await p.screenshot({ path: `${OUT}-aula-licao7.png` });
  await p.click('.apostila .virar.depois');
  await p.waitForTimeout(1300);
  await p.click('.apostila .virar.depois');
  await p.waitForTimeout(1300);
  await p.click('.apostila .virar.depois');
  await p.waitForTimeout(600);
  const trava = await p.evaluate(() => document.querySelector('.apostila .aviso-trava')?.textContent ?? '');
  conferir(/Termine a lição 7/.test(trava), 'a lição 8 espera a 7 (o aviso conta a lição do curso, não a do livro)', trava);
  await ctx.close();
}

// =================================================================== 3. o livro
if (parte('livro')) {
  console.log('\n3. o livro do Módulo 2, lição por lição');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await abrir(ctx, 'escola-sala-1', { estrelas: { ...estrelas(M1), ...estrelas(M2.slice(0, 5), 2) }, abertas: [...M1, ...M2] });
  let vazou = 0;
  const rolagens = [];
  for (const [k, id] of M2.entries()) {
    const n = k + 7;
    await p.evaluate((id) => { window.__livro = window.jogo.abrirApostila({ licao: id }); }, id);
    await p.waitForTimeout(1500);
    for (let d = 0; d < 5; d++) {
      if (d > 0) await virar(p);
      const vis = await paginas(p);
      if (!vis.some((v) => v.rotulo.startsWith(`Lição ${n} `))) break;
      vazou += vis.filter((v) => v.vaza).length;
      for (const v of vis) if (v.rotulo.startsWith(`Lição ${n} `)) rolagens.push([v.rotulo, v.rola]);
      await p.screenshot({ path: `${OUT}-livro-${n}-${d + 1}.png` });
    }
    await p.click('.apostila .fechar-apostila');
    await p.waitForTimeout(500);
  }
  for (const [r, x] of rolagens) console.log(`      ${x.toFixed(2)}×  ${r}`);
  conferir(vazou === 0, 'nenhuma página do Módulo 2 vaza para o lado', String(vazou));
  conferir(rolagens.length >= 30, `as seis lições folheadas (${rolagens.length} páginas)`);

  console.log('\n4. trocar de apostila e o fim de cada livro');
  await p.evaluate(() => { window.__livro = window.jogo.abrirApostila(); });
  await p.waitForTimeout(1500);
  await p.click('.apostila .ir-sumario');
  await p.waitForTimeout(1300);
  const sumario = await p.evaluate(() => ({
    titulo: document.querySelector('.apostila .titulo-sumario')?.textContent ?? '',
    botoes: [...document.querySelectorAll('.apostila .trocar-modulo')].map((b) => b.textContent),
  }));
  conferir(/Módulo 2/.test(sumario.titulo) && sumario.botoes.join() === '📗 Módulo 1',
    'fora da aula abre o livro do Módulo 2, e o sumário oferece o Módulo 1', JSON.stringify(sumario));
  await p.screenshot({ path: `${OUT}-sumario-m2.png` });
  await p.click('.apostila .trocar-modulo');
  await p.waitForTimeout(1000);
  const noUm = await p.evaluate(() => ({
    titulo: document.querySelector('.apostila .titulo-sumario')?.textContent ?? '',
    botoes: [...document.querySelectorAll('.apostila .trocar-modulo')].map((b) => b.textContent),
  }));
  conferir(/Módulo 1/.test(noUm.titulo) && noUm.botoes.join() === '📗 Módulo 2', 'o botão troca para o livro do Módulo 1, que oferece a volta', JSON.stringify(noUm));
  await p.screenshot({ path: `${OUT}-sumario-m1.png` });
  // o fim do Módulo 1 promete o 2
  const ultima = await p.evaluate(() => window.jogo.ui.apostila.paginas.length - 2);
  await p.evaluate((u) => window.jogo.ui.apostila.irPara(u), ultima);
  await p.waitForTimeout(1400);
  const fim1 = await p.evaluate(() => document.querySelector('.apostila .fim-do-modulo')?.textContent ?? '');
  conferir(/Módulo 1 concluído/.test(fim1) && /Agora vem o Módulo 2/.test(fim1), 'o fim do Módulo 1 diz que agora vem o Módulo 2', fim1.replace(/\s+/g, ' ').trim());
  await p.screenshot({ path: `${OUT}-fim-m1.png` });
  await p.click('.apostila .fechar-apostila');
  await p.waitForTimeout(500);
  // a lição 12 concluída: o fim do Módulo 2
  await p.evaluate(() => window.jogo.save.concluirLicao('quanto-custa', 3));
  await p.evaluate(() => { window.__livro = window.jogo.abrirApostila({ licao: 'quanto-custa' }); });
  await p.waitForTimeout(1500);
  const ultima2 = await p.evaluate(() => window.jogo.ui.apostila.paginas.length - 2);
  await p.evaluate((u) => window.jogo.ui.apostila.irPara(u), ultima2);
  await p.waitForTimeout(1400);
  const fim2 = await p.evaluate(() => document.querySelector('.apostila .fim-do-modulo')?.textContent ?? '');
  conferir(/Módulo 2 concluído/.test(fim2) && /Em breve: Módulo 3/.test(fim2), 'o fim do Módulo 2 diz "em breve: Módulo 3"', fim2.replace(/\s+/g, ' ').trim());
  await p.screenshot({ path: `${OUT}-fim-m2.png` });
  await ctx.close();
}

// ================================================================= 5. o celular
if (parte('celular')) {
  console.log('\n5. o celular');
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await abrir(ctx, 'escola-sala-1', { estrelas: { ...estrelas(M1), ...estrelas(M2.slice(0, 5), 2) }, abertas: [...M1, ...M2] });
  let vazou = 0;
  let vistas = 0;
  for (const [k, id] of M2.entries()) {
    const n = k + 7;
    await p.evaluate((id) => { window.__livro = window.jogo.abrirApostila({ licao: id }); }, id);
    await p.waitForTimeout(1500);
    for (let d = 0; d < 9; d++) {
      if (d > 0) await virar(p);
      const vis = await paginas(p);
      if (!vis.some((v) => v.rotulo.startsWith(`Lição ${n} `))) break;
      vistas += 1;
      for (const v of vis.filter((x) => x.vaza)) {
        vazou += 1;
        console.log(`      vaza: ${v.rotulo}`);
        await p.screenshot({ path: `${OUT}-cel-vaza-${n}-${d + 1}.png` });
      }
      if (d < 3 || n === 11) await p.screenshot({ path: `${OUT}-cel-${n}-${d + 1}.png` });
    }
    await p.click('.apostila .fechar-apostila');
    await p.waitForTimeout(500);
  }
  conferir(vazou === 0 && vistas >= 30, `no celular, nenhuma das ${vistas} páginas vaza para o lado`, String(vazou));
  await ctx.close();
}

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
await browser.close();
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
process.exit(falhas.length ? 1 : 0);
