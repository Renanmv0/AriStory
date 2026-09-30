/**
 * A AULA DO GATITO E A APOSTILA — o ciclo inteiro, no navegador.
 *
 * O pedido do Renan que este teste guarda: o Gatito passeia pela escola
 * enquanto a aula não começa; a missão é falar com a Luna no ginásio, e ela
 * avisa que a aula vai começar; na Sala 1, o Gatito está na mesa e os três —
 * o Ari, o Renan e a Luna — têm a aula, com uma apostila de verdade, de
 * folhear, em que a lição seguinte só abre com a anterior terminada.
 *
 * O que ele cobra:
 *
 * 1. ANTES DE QUALQUER AULA, a apostila não deixa ler nem a lição 1 (ela
 *    abre na aula), e diz isso.
 * 2. O GINÁSIO: a Luna treina; conversar com ela chama a aula — as falas são
 *    as da lição da vez —, toca o sinal, avisa, e ela vai embora pela porta
 *    (e o colisor dela sai junto).
 * 3. O SAGUÃO: com a aula chamada, o Gatito não está lá.
 * 4. A SALA 1: o Gatito sentado EM CIMA da mesa, de oculinhos (e os
 *    oculinhos da mesa sumiram), a Luna sentada na ponta da primeira fila, e
 *    a carteira do meio dizendo "Sentar para a aula".
 * 5. A AULA: a dupla senta, o Gatito abre a aula, e a apostila abre NA
 *    LIÇÃO 1 — a dupla da explicação, depois a dos exercícios.
 * 6. OS EXERCÍCIOS, respondidos pela tela, com dois erros de propósito: cada
 *    tipo responde, o erro mostra a certa, a letra digitada chega no campo (e
 *    o "j" não abre o diário), a lição conclui com as estrelas certas, e o
 *    save guarda na hora. A página seguinte (a lição 2) está trancada — "abre
 *    na próxima aula".
 * 7. O FIM DA AULA: fechar o livro traz as estrelas e o encerramento, a
 *    aula desliga, a memória da primeira aula entra no diário, e o Gatito e a
 *    Luna descem e saem pela porta. A carteira vira "Estudar a apostila".
 * 8. DEPOIS: o Gatito voltou ao saguão, a Luna ao ginásio, e a conversa com
 *    ela agora chama a LIÇÃO 2. Reabrindo o jogo, a lição 1 vem em gabarito.
 * 9. O CELULAR: uma página por vez, nada vazando para o lado, e fotos de cada
 *    tipo de página.
 *
 * Uso: node scripts/aula.mjs /tmp/au
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './aula';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const contexto = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await contexto.newPage();
const erros = [];
const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
const ouvir = (p) => {
  p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => {
    if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
  });
};
ouvir(page);

const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};

const ir = async (cena, em = '', p = page) => {
  await p.goto(`${BASE}/?cena=${cena}${em ? `&em=${em}` : ''}`, { waitUntil: 'networkidle' });
  for (let i = 0; i < 40; i++) {
    const pronto = await p.evaluate(() => !!window.jogo?.current?.world && !window.jogo.transitioning).catch(() => false);
    if (pronto) break;
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(1200);
};

/** o prompt da tela AGORA (o `locator().textContent()` esperaria 30 s por um prompt que não existe) */
const prompt = () => page.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? null);
const texto = (sel, p = page) => p.evaluate((sel) => document.querySelector(sel)?.textContent ?? '', sel);
const esperarPrompt = async (re, vezes = 24) => {
  for (let i = 0; i < vezes; i++) {
    const p = await prompt();
    if (p && re.test(p)) return p;
    await page.waitForTimeout(250);
  }
  return prompt();
};

/**
 * Avança as falas com E, anotando "quem: texto". Entre uma fala e outra pode
 * haver uma pausa da cena (o sinal tocando antes de a Luna chamar a aula) —
 * e no navegador sem placa de vídeo o relógio do jogo anda devagar —, então
 * a conversa só acaba depois de uns segundos sem balão.
 */
const conversar = async (max = 40) => {
  const falas = [];
  for (let i = 0; i < max; i++) {
    if (!(await page.locator('.dialogue.show').count())) {
      let voltou = false;
      // o salto da Sol é uma pausa longa sem fala (o tempo do jogo anda devagar sem tela)
      for (let j = 0; j < 32 && !voltou; j++) {
        await page.waitForTimeout(500);
        voltou = (await page.locator('.dialogue.show').count()) > 0;
      }
      if (!voltou) break;
      continue;
    }
    await page.waitForTimeout(500);
    const quem = await texto('.dialogue .who');
    const t = await texto('.dialogue .text');
    if (t && !falas.includes(`${quem}: ${t}`)) falas.push(`${quem}: ${t}`);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(200);
  }
  return falas;
};

/** espera uma condição no navegador, com o relógio da parede (a cena lenta no headless) */
const esperar = async (fn, arg, ms = 60000) => {
  const ate = Date.now() + ms;
  while (Date.now() < ate) {
    if (await page.evaluate(fn, arg)) return true;
    await page.waitForTimeout(400);
  }
  return false;
};

/** um bicho da cena pela etiqueta: visível, posição, altura, e o que o gancho de teste mostra */
const bicho = (peca) =>
  page.evaluate((peca) => {
    let g = null;
    window.jogo.current.world.root.traverse((o) => {
      if (!g && o.userData?.peca === peca) g = o;
    });
    if (!g) return null;
    const oculos = [];
    g.traverse((o) => {
      if (o.userData?.peca === 'oculos-do-gatito') oculos.push(o.visible);
    });
    return {
      visivel: g.visible,
      x: +g.position.x.toFixed(2),
      y: +g.position.y.toFixed(2),
      z: +g.position.z.toFixed(2),
      oculos: oculos[0] ?? null,
    };
  }, peca);

const interacao = (id) =>
  page.evaluate((id) => {
    const i = window.jogo.current.world.interactables.find((x) => x.id === id);
    return i ? { enabled: i.enabled, label: i.label } : null;
  }, id);

const save = () => page.evaluate(() => JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}'));

// ========================================================== 0. o save limpo
await ir('escola');
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await ir('escola');
await page.evaluate(() => {
  for (const f of ['escola-aberta', 'luna-na-escola', 'gatito-conhecido']) window.jogo.setFlag(f);
});

// ============================================== 1. antes de qualquer aula
console.log('\n1. antes de qualquer aula');
await page.evaluate(() => { window.__livro = window.jogo.abrirApostila(); });
await page.waitForTimeout(1200);
conferir(await page.locator('.apostila.show').count() === 1, 'a apostila abre fora da aula (estudar)');
const noSumario = await page.locator('.apostila .indice li').count();
conferir(noSumario === 6, 'o sumário lista as seis lições', `${noSumario}`);
await page.locator('.apostila .indice li').first().click();
await page.waitForTimeout(400);
const aviso0 = await texto('.apostila .aviso-trava');
conferir(/lição 1 abre na próxima aula/.test(aviso0), 'e a lição 1 ainda não abre: ela vem na aula', aviso0);
await page.screenshot({ path: `${OUT}-antes-sumario.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
conferir(await page.locator('.apostila.show').count() === 0, 'o Escape fecha a apostila');

// ============================================================== 2. o ginásio
console.log('\n2. o ginásio');
await ir('escola-ginasio', '1.6,4');
const lunaNoTreino = await bicho('luna');
conferir(lunaNoTreino?.visivel, 'a Luna está treinando no ginásio');
await page.evaluate(() => window.jogo.debugPlace(0.9, 3.3, -2.4));
conferir(/Falar com a Luna/.test((await esperarPrompt(/Luna/)) ?? ''), 'o prompt é o dela');
// o aviso aparece e some sozinho: um vigia anota todo aviso que entra na tela
await page.evaluate(() => {
  window.__avisos = [];
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => window.__avisos.push(n.textContent ?? ''))))
    .observe(document.querySelector('.toasts'), { childList: true });
});
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const chamada = await conversar();
console.log('      ' + chamada.join('\n      '));
conferir(chamada.some((f) => f.includes('primeira aula do Gatito')), 'ela avisa que a primeira aula vai começar');
conferir(await page.evaluate(() => window.jogo.flag('aula-chamada')), 'a aula fica chamada (aula-chamada)');
const avisos = await page.evaluate(() => window.__avisos);
conferir(avisos.some((a) => a.includes('Sala 1')), 'o aviso diz que é na Sala 1', avisos.join(' | '));
const saiu = await esperar(() => {
  let g = null;
  window.jogo.current.world.root.traverse((o) => { if (!g && o.userData?.peca === 'luna') g = o; });
  return g && !g.visible;
}, null, 90000);
conferir(saiu, 'e ela vai embora pela porta');
const colisorDela = await page.evaluate(() => window.jogo.current.world.colliders.filter((c) => c.kind === 'circle' && Math.abs(c.x) < 0.01 && Math.abs(c.z - 2.4) < 0.01).length);
conferir(colisorDela === 0, 'sem colisor invisível onde ela treinava');
conferir((await interacao('ginasio:luna'))?.enabled === false, 'nem prompt de falar com ela');

// ============================================================== 3. o saguão
console.log('\n3. o saguão');
await ir('escola');
const gatitoNoSaguao = await bicho('gatito');
conferir(gatitoNoSaguao && !gatitoNoSaguao.visivel, 'com a aula chamada, o Gatito não está no saguão');
conferir((await interacao('escola:gatito'))?.enabled === false, 'e o prompt dele também não');

// ============================================================ 4. a Sala 1
console.log('\n4. a Sala 1');
await ir('escola-sala-1');
const gatito = await bicho('gatito');
conferir(gatito?.visivel && Math.abs(gatito.y - 0.79) < 0.02, 'o Gatito está EM CIMA da mesa do professor', JSON.stringify(gatito));
conferir(gatito?.oculos === true, 'de oculinhos');
const oculinhosNaMesa = await page.evaluate(() => {
  let n = 0;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'oculinhos-do-gatito') n += 1; });
  return n;
});
conferir(oculinhosNaMesa === 0, 'e os oculinhos da mesa sumiram (estão na cara dele)', `${oculinhosNaMesa}`);
const lunaNaSala = await bicho('luna');
conferir(lunaNaSala?.visivel && Math.abs(lunaNaSala.x + 3.6) < 0.05 && Math.abs(lunaNaSala.y - 0.47) < 0.02,
  'a Luna está sentada na ponta da primeira fila', JSON.stringify(lunaNaSala));
await page.evaluate(() => window.jogo.debugPlace(1.8, 1.2, -2.6));
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-sala-na-aula.png` });

await page.evaluate(() => window.jogo.debugPlace(-0.15, 0.55, Math.PI));
conferir((await esperarPrompt(/aula/)) === 'Sentar para a aula', 'a carteira do meio diz "Sentar para a aula"', (await prompt()) ?? '');

// ============================================================= 5. a aula
console.log('\n5. a aula');
await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const abertura = await conversar();
console.log('      ' + abertura.join('\n      '));
conferir(abertura.some((f) => f.startsWith('Gatito:') && f.includes('lição 1')), 'o Gatito abre a aula e manda abrir na lição 1');
const abriu = await esperar(() => !!document.querySelector('.apostila.show'), null, 20000);
conferir(abriu, 'a apostila abre');
await page.waitForTimeout(1200);
const naPagina = await page.evaluate(() => window.jogo.ui.apostila.pagina);
conferir(naPagina === 2, 'aberta na lição 1: a dupla da explicação (páginas 3 e 4)', `página ${naPagina + 1}`);
await page.screenshot({ path: `${OUT}-livro-explicacao.png` });
await page.evaluate(() => { document.querySelector('.apostila .pagina.dir .miolo').scrollTop = 99999; });
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}-livro-explicacao-fim.png` });
await page.click('.apostila .virar.depois');
await page.waitForTimeout(1300);
conferir(await page.evaluate(() => window.jogo.ui.apostila.pagina) === 4, 'virar leva aos exercícios (páginas 5 e 6)');
await page.screenshot({ path: `${OUT}-livro-exercicios.png` });

// ======================================================= 6. os exercícios
console.log('\n6. os exercícios');
const ID = 'oi-tudo-bem';
const licao = await page.evaluate((id) => window.jogo.ui.apostila.pedido.modulo.licoes.find((l) => l.id === id), ID);
const P = `.apostila .pagina[data-licao="${ID}"]`;
/** os itens a errar de propósito: o primeiro turno da conversa e o primeiro "digitar" */
const errarEm = new Set(['0:0', '6:0']);
const clica = async (sel) => {
  await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.click(sel);
  await page.waitForTimeout(40);
};
let total = 0;
let digitado = '';
for (const [k, ex] of licao.exercicios.entries()) {
  const E = `${P} [data-ex="${k}"]`;
  const erra = (i) => errarEm.has(`${k}:${i}`);
  switch (ex.tipo) {
    case 'escolha':
    case 'intruso':
      for (const [i, it] of ex.itens.entries()) await clica(`${E} [data-item="${i}"] [data-op="${erra(i) ? (it.certa + 1) % it.opcoes.length : it.certa}"]`);
      total += ex.itens.length;
      break;
    case 'conversa':
      for (const [t, tu] of ex.turnos.entries()) await clica(`${E} .responder[data-item="${t}"] [data-op="${erra(t) ? (tu.certa + 1) % tu.opcoes.length : tu.certa}"]`);
      total += ex.turnos.length;
      break;
    case 'vf':
      for (const [i, it] of ex.itens.entries()) await clica(`${E} [data-item="${i}"] [data-vf="${erra(i) ? !it.verdade : it.verdade}"]`);
      total += ex.itens.length;
      break;
    case 'ligar':
      for (const [i] of ex.pares.entries()) {
        await clica(`${E} [data-esq="${i}"]`);
        await clica(`${E} [data-orig="${i}"]`);
      }
      total += ex.pares.length;
      break;
    case 'lacunas':
      for (const resp of ex.respostas) {
        const j = await page.evaluate(([sel, quer]) => {
          const b = [...document.querySelectorAll(`${sel} .ficha`)].find((x) => !x.disabled && x.textContent === quer);
          return b ? b.dataset.ficha : null;
        }, [E, resp]);
        await clica(`${E} [data-ficha="${j}"]`);
      }
      total += ex.respostas.length;
      break;
    case 'ordenar':
      for (const [i, it] of ex.itens.entries()) {
        for (const j of it.pedacos.map((_, n) => n)) await clica(`${E} [data-item="${i}"] [data-peca="${j}"]`);
        await clica(`${E} [data-item="${i}"] [data-conferir-frase]`);
      }
      total += ex.itens.length;
      break;
    case 'digitar':
      for (const [i, it] of ex.itens.entries()) {
        const campo = `${E} input[data-dig="${k}:${i}"]`;
        await page.locator(campo).scrollIntoViewIfNeeded();
        await page.click(campo);
        // o erro de propósito é cheio de "j", "e" e "t": as teclas que o jogo usa
        const texto = erra(i) ? 'jeito' : it.aceitas[0];
        await page.keyboard.type(texto, { delay: 25 });
        if (erra(i)) digitado = await page.locator(campo).inputValue();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(80);
      }
      total += ex.itens.length;
      break;
    case 'classificar':
      for (const [i, it] of ex.itens.entries()) await clica(`${E} [data-item="${i}"] [data-grupo="${it.grupo}"]`);
      total += ex.itens.length;
      break;
    case 'erro':
      for (const [i, it] of ex.itens.entries()) await clica(`${E} [data-item="${i}"] [data-palavra="${it.errada}"]`);
      total += ex.itens.length;
      break;
  }
}
await page.waitForTimeout(900);
conferir(digitado === 'jeito', 'as letras digitadas chegam no campo, "e", "i" e "t" inclusive', digitado);
conferir(!(await page.evaluate(() => window.jogo.ui.journalOpen)), 'o "j" digitado não abre o diário');
const tipos = new Set(licao.exercicios.map((e) => e.tipo));
conferir(tipos.size >= 7, `a lição 1 tem ${tipos.size} tipos de exercício, e todos responderam`);
const erradas = await page.locator(`${P} .retorno.errado`).count();
conferir(erradas === 2, 'os dois erros de propósito mostram a certa e o porquê', `${erradas}`);
const esperadas = (total - 2) / total >= 0.9 ? 3 : 2;
const s1 = await save();
conferir(s1.apostila?.estrelas?.[ID] === esperadas, `a lição conclui com ${esperadas} estrelas e o save guarda na hora`, JSON.stringify(s1.apostila));
const nota = await texto('.apostila .nota-da-licao .estrelinhas');
conferir(nota.startsWith('★'.repeat(esperadas)), 'o fechamento mostra as estrelas', nota);
conferir(await page.locator('.apostila .carimbo').count() === 1, 'e o carimbo de concluída');
await page.evaluate(() => { document.querySelector('.apostila .pagina.esq .miolo').scrollTop = 0; });
await page.screenshot({ path: `${OUT}-livro-respondido.png` });
for (const y of [900, 1800, 2700]) {
  await page.evaluate((y) => { document.querySelector('.apostila .pagina.esq .miolo').scrollTop = y; }, y);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}-livro-respondido-${y}.png` });
}
await page.click('.apostila .virar.depois');
await page.waitForTimeout(500);
const aviso2 = await texto('.apostila .aviso-trava');
conferir(/lição 2 abre na próxima aula/.test(aviso2), 'a lição 2 fica trancada até a próxima aula', aviso2);

// ========================================================= 7. o fim da aula
console.log('\n7. o fim da aula');
await page.click('.apostila .fechar-apostila');
await page.waitForTimeout(700);
const fim = await conversar();
console.log('      ' + fim.join('\n      '));
conferir(fim.some((f) => /estrelinha/.test(f)), 'o Gatito fala das estrelas');
conferir(fim.some((f) => f.includes('Até a próxima aula')), 'e encerra a aula');
conferir(!(await page.evaluate(() => window.jogo.flag('aula-chamada'))), 'a aula acaba (aula-chamada desliga)');
const s2 = await save();
conferir((s2.memories ?? []).some((m) => m.id === 'primeira-aula-do-gatito'), 'a memória da primeira aula entra no diário');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-saindo.png` });
const foram = await esperar(() => {
  const vistos = [];
  window.jogo.current.world.root.traverse((o) => {
    if (o.userData?.peca === 'gatito' || o.userData?.peca === 'luna') vistos.push(o.visible);
  });
  return vistos.length === 2 && vistos.every((v) => !v);
}, null, 120000);
conferir(foram, 'o Gatito e a Luna saem pela porta');
conferir((await esperarPrompt(/apostila/)) === 'Estudar a apostila', 'a carteira vira "Estudar a apostila"', (await prompt()) ?? '');

// ============================================================== 8. depois
console.log('\n8. depois');
await ir('escola');
const gatitoDeVolta = await bicho('gatito');
conferir(gatitoDeVolta?.visivel, 'o Gatito voltou a passear pelo saguão');
await ir('escola-ginasio', '1.6,4');
conferir((await bicho('luna'))?.visivel, 'a Luna voltou a treinar no ginásio');
await page.evaluate(() => window.jogo.debugPlace(0.9, 3.3, -2.4));
await esperarPrompt(/Luna/);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const comALuna = await conversar();
conferir(comALuna.some((f) => f.includes('Sol')) && !(await page.evaluate(() => window.jogo.flag('aula-chamada'))),
  'a lição 2 não é da Luna: ela manda falar com a Sol', comALuna.at(-1) ?? '');
// a 2ª aula é da Sol: ela salta, e daí vem o sinal (o scripts/irmas.mjs mede o salto)
const sol = await bicho('sol');
conferir(sol?.visivel, 'a Sol treina junto');
await page.evaluate(([S]) => window.jogo.debugPlace(S.x + 0.9, S.z + 0.9, -2.4), [sol]);
await esperarPrompt(/Sol/);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const chamada2 = await conversar(60);
conferir(chamada2.some((f) => f.includes('falsos amigos')), 'e a conversa com a Sol chama a lição 2', chamada2.at(-1) ?? '');

// reabrindo o jogo: a lição 1 vem em gabarito
await ir('escola-sala-1');
await page.evaluate(() => window.jogo.debugPlace(-0.15, 0.55, Math.PI));
await esperarPrompt(/aula/);
await page.evaluate(() => { window.__livro = window.jogo.abrirApostila(); });
await page.waitForTimeout(1200);
await page.locator('.apostila .indice li').first().click();
await page.waitForTimeout(1300);
await page.click('.apostila .virar.depois');
await page.waitForTimeout(1300);
conferir(await page.locator('.apostila .aviso-gabarito').count() === 1, 'reaberta, a lição 1 mostra o gabarito, com "refazer"');
await page.screenshot({ path: `${OUT}-gabarito.png` });
await page.keyboard.press('Escape');

// =========================================================== 9. o celular
console.log('\n9. o celular');
const cel = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const pc = await cel.newPage();
ouvir(pc);
await ir('escola-sala-1', '', pc);
// um save de quem já fez cinco lições: dá para folhear o livro quase inteiro
await pc.evaluate(() => {
  const ids = ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho'];
  const s = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  s.apostila = { estrelas: { [ids[0]]: 3, [ids[1]]: 2, [ids[2]]: 3, [ids[3]]: 1, [ids[4]]: 2 }, abertas: ids };
  localStorage.setItem('aristory.save.v1', JSON.stringify(s));
});
await ir('escola-sala-1', '', pc);
let vazando = 0;
const olhar = async (nome) => {
  vazando += await pc.evaluate(() => {
    const m = document.querySelector('.apostila .pagina.esq .miolo');
    return m && m.scrollWidth > m.clientWidth + 1 ? 1 : 0;
  });
  await pc.screenshot({ path: `${OUT}-cel-${nome}.png` });
};
for (const [n, id] of [[2, 'jantar-das-confusoes'], [3, 'cade-o-novelo'], [4, 'horta-da-josefina'], [5, 'fica-a-dica'], [6, 'tudo-acaba-em-inho']]) {
  await pc.evaluate((id) => { window.__livro = window.jogo.abrirApostila({ licao: id }); }, id);
  await pc.waitForTimeout(1500);
  if (n === 2) conferir(await pc.evaluate(() => document.querySelector('.livro-apostila').classList.contains('simples')), 'no celular, uma página por vez');
  for (const [i, parte] of ['p1', 'p2', 'exercicios', 'fechamento'].entries()) {
    if (i > 0) {
      await pc.click('.apostila .virar.depois');
      await pc.waitForTimeout(1300);
    }
    await olhar(`licao${n}-${parte}`);
  }
  await pc.click('.apostila .fechar-apostila');
  await pc.waitForTimeout(500);
}
conferir(vazando === 0, 'nenhuma página vaza para o lado', `${vazando}`);
await pc.evaluate(() => { window.__livro = window.jogo.abrirApostila(); });
await pc.waitForTimeout(1500);
await pc.click('.apostila .ir-sumario');
await pc.waitForTimeout(1300);
await pc.screenshot({ path: `${OUT}-cel-sumario.png` });
await pc.click('.apostila .virar.antes');
await pc.waitForTimeout(1300);
await pc.screenshot({ path: `${OUT}-cel-rosto.png` });

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
await browser.close();
process.exit(falhas.length ? 1 : 0);
