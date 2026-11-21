/**
 * A PORTARIA DO CLUBE, A CENA (docs/PORTARIA-DO-CLUBE.md): a primeira pessoa
 * na guarita, a mesa em tela e um dia inteiro jogado PELA TELA.
 *
 * O que este teste guarda:
 * - ESCONDIDA: sem a chave (`?semPortaria`), a cena devolve ao clube;
 * - a ABERTURA: a explicação da Gina em primeira pessoa, a demonstração com
 *   os papéis e a passagem ao expediente, sem cobrar tempo de atendimento;
 * - o DIA PELA TELA: um robô toca a campainha, espera o visitante subir no
 *   elevador e os papéis entrarem, e confere pela conferência de verdade
 *   (`diferencas`): pergunta o que a pista pede, aponta cada diferença com a
 *   lupa CLICANDO nos alvos da folha (cada alvo é o elemento de cima no próprio
 *   centro — nada tapa um campo), tira da sacola o proibido, recusa o agrado e
 *   carimba o certo. A cada visitante: o tempo de relógio de verdade gasto;
 * - o ENVELOPE: o fim do dia da cena é IGUAL ao do mesmo dia jogado só pelo
 *   `Expediente`, sem cena (as mesmas decisões, a mesma semente); o envelope
 *   aparece, o dinheiro entra na carteira, o save ganha o dia, e a dupla volta
 *   ao clube na frente da guarita;
 * - o PESO: os desenhos e os triângulos da primeira pessoa.
 *
 * `?depressa` faz a fila, o elevador e a mesa andarem quatro vezes mais rápido
 * (o relógio do expediente não muda). Uso:
 *   node scripts/portariaCena.mjs /tmp/pc   (SO=escondida|dia, DIA=1, CEL=1)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './portaria-cena';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium';
const SO = process.env.SO ?? '';
const DIA = Number(process.env.DIA ?? 1);
const CEL = !!process.env.CEL;
const SEMENTE = Number(process.env.SEMENTE ?? 7);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage(CEL ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true } : { viewport: { width: 1280, height: 720 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_/.test(m.text())) erros.push(m.text()); });
const falhas = [];
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) falhas.push(msg); };
const espera = (ms) => page.waitForTimeout(ms);
const sufixo = CEL ? '-cel' : '';

// O Chromium sem placa só desenha nas capturas. O mundo e a câmera continuam
// atualizando suas matrizes, mantendo o relógio e os cliques reais da cena.
async function desenho(normal) {
  await page.evaluate(normal => {
    const r = window.jogo.renderer;
    window.renderDoTeste ??= r.render.bind(r);
    r.render = normal ? window.renderDoTeste : (s, c) => { s.updateMatrixWorld(); c.updateMatrixWorld(); };
  }, normal);
}
async function foto(opcoes) {
  await desenho(true);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.screenshot(opcoes);
  await desenho(false);
}

// ------------------------------------------------------------------ escondida
if (!SO || SO === 'escondida') {
  await page.goto(`${BASE}/?semPortaria&cena=portaria`, { waitUntil: 'networkidle' });
  await espera(4500);
  const cena = await page.evaluate(() => window.jogo?.current?.def?.id ?? null);
  const naGuarita = await page.evaluate(() => !!window.portaria?.ex);
  ok(!naGuarita, `sem a chave, a portaria não monta o dia (cena: ${cena})`);
}

// ------------------------------------------------------------------ o dia
if (!SO || SO === 'dia') {
  // um save de teste limpo (o ?portaria já usa um save à parte)
  await page.goto(`${BASE}/?portaria&cena=clube`, { waitUntil: 'networkidle' });
  await espera(2000);
  await page.evaluate(() => localStorage.removeItem('aristory.save.v1.portaria'));
  await page.goto(`${BASE}/?portaria&cena=portaria&dia=${DIA}&semente=${SEMENTE}&depressa`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.portaria?.ex, undefined, { timeout: 90000 });
  await desenho(false);
  await espera(3500);
  await foto({ path: `${OUT}-abertura${sufixo}.png` });
  ok(await page.evaluate(() => !!window.portaria?.ex), 'a cena montou o expediente do dia');
  const saldoAntes = await page.evaluate(() => window.jogo.carteira());

  // Os três recados da Gina, com tempo para os papéis da demonstração.
  for (let i = 0; i < 20 && !(await page.evaluate(() => window.portaria.comecou())); i++) {
    await page.keyboard.press('Space');
    await espera(400);
  }
  ok(await page.evaluate(() => window.portaria.comecou()), 'o recado da Gina acabou e a mesa abriu');
  ok(await page.evaluate(() => window.portaria.painel.vista === 'bancada'), 'o dia começa com a bancada 3D à vista');
  await page.evaluate(() => window.portaria.painel.mudarVista('documento'));
  ok(await page.isVisible('.portaria.show .pt-painel'), 'o painel pode abrir para a leitura');

  const fecharFalas = async () => {
    if (await page.locator('.pg-continuar').isVisible()) await page.locator('.pg-continuar').click();
    for (let i = 0; i < 30; i++) {
      if (!(await page.evaluate(() => window.portaria.painel.falando))) return;
      await page.click('.pt-balao');
      await espera(80);
    }
  };
  const esperarLivre = async () => {
    for (let i = 0; i < 400; i++) {
      await fecharFalas();
      if (!(await page.evaluate(() => window.portaria.ocupado()))) { await fecharFalas(); await page.evaluate(() => window.portaria.painel.mudarVista('documento')); return true; }
      await espera(150);
    }
    return false;
  };

  /** o elemento é o de cima no próprio centro? */
  const noTopo = (sel) => page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 'não existe';
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return `pequeno ${r.width}x${r.height}`;
    const topo = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return topo === el || el.contains(topo) ? true : `tapado por ${topo?.className}`;
  }, sel);

  /** abre a aba onde mora a pista e devolve o seletor do alvo */
  const abaDaPista = async (pista) => {
    if (pista.startsWith('doc:')) {
      const tipo = pista.split(':')[1];
      const i = await page.evaluate((tipo) => window.portaria.ex.janela.visitante.docs.findIndex((d) => d.tipo === tipo), tipo);
      await page.click(`[data-aba="doc:${i}"]`);
    } else if (pista === 'lista') await page.click('[data-aba="lista"]');
    else if (pista === 'calendario') await page.click('[data-aba="hoje"]');
    else if (pista.startsWith('manual:')) await page.click('[data-aba="manual"]');
    await esperarLivre();
    return `[data-pista="${pista}"]`;
  };
  const alvosRuins = [];
  const clicarPista = async (pista) => {
    const sel = await abaDaPista(pista);
    if (pista.startsWith('manual:')) await page.$eval(sel, (el) => el.scrollIntoView({ block: 'center' }));
    const topo = await noTopo(sel);
    if (topo !== true) alvosRuins.push(`${pista}: ${topo}`);
    await page.click(sel, { force: topo !== true });
  };

  const decisoes = [];
  const tempos = [];
  let fotoDaLupa = false;
  for (let visita = 0; visita < 30; visita++) {
    await esperarLivre();
    const estado = await page.evaluate(() => ({ chamar: !!document.querySelector('[data-acao="chamar"]:not([disabled])'), terminar: !!document.querySelector('[data-acao="terminar"]') }));
    if (!estado.chamar) break;
    const t0 = Date.now();
    await page.click('[data-acao="chamar"]');
    await espera(200);
    if (!(await esperarLivre())) { ok(false, 'o visitante chegou ao balcão'); break; }
    const c = await page.evaluate(() => window.portaria.conferir());
    if (!c) break;
    const feitas = { id: c.id, perguntas: [], apontados: [], confiscados: [], carimbo: c.carimbo };
    if (visita === 0) {
      await foto({ path: `${OUT}-janela${sufixo}.png` });
      // O RELÓGIO NÃO REDESENHA A MESA: um botão segurado por dois segundos (o relógio andando) continua o mesmo,
      // e a rolagem do manual fica onde estava
      const botao = await page.$('[data-acao="lupa"]');
      const m0 = await page.evaluate(() => window.portaria.ex.minutos);
      await espera(2500);
      const m1 = await page.evaluate(() => window.portaria.ex.minutos);
      ok(await botao.evaluate((el) => el.isConnected), `o relógio andou (${m0.toFixed(2)} → ${m1.toFixed(2)} min) sem trocar os botões da mesa`);
      ok(DIA === 1 ? m1 === m0 : m1 > m0, DIA === 1 ? 'o primeiro dia fica sem relógio' : 'o relógio anda com alguém na janela');
      await page.click('[data-aba="manual"]');
      await page.$eval('.pt-manual', (el) => { el.scrollTop = 40; });
      await espera(1500);
      const rolou = await page.$eval('.pt-manual', (el) => el.scrollTop);
      ok(rolou > 0 || (await page.$eval('.pt-manual', (el) => el.scrollHeight <= el.clientHeight)), `a rolagem do manual fica com o relógio andando (${rolou})`);
    }
    // a oferta pela fresta: recusar
    if (await page.isVisible('[data-acao="oferta:nao"]')) {
      await page.click('[data-acao="oferta:nao"]');
      feitas.recusou = true;
      await esperarLivre();
    }
    // cada diferença: perguntar o que precisar e apontar o par com a lupa
    for (const d of c.diferencas) {
      for (const p of d.pistas) {
        if (!p.startsWith('transcricao:')) continue;
        const assunto = p.slice('transcricao:'.length);
        const ja = await page.evaluate((a) => window.portaria.ex.janela.perguntas.includes(a), assunto);
        if (ja) continue;
        await page.click('[data-acao="perguntar"]');
        await page.click(`[data-pergunta="${assunto}"]`);
        feitas.perguntas.push(assunto);
        await esperarLivre();
      }
      await page.click('[data-acao="lupa"]');
      await espera(100);
      await clicarPista(d.pistas[0]);
      if (!fotoDaLupa) {
        await foto({ path: `${OUT}-lupa${sufixo}.png` });
        fotoDaLupa = true;
      }
      await clicarPista(d.pistas[1]);
      feitas.apontados.push(d.pistas);
      await esperarLivre();
    }
    // o proibido da sacola vai para os achados
    for (const item of c.proibidos) {
      if (!await page.locator(`[data-confiscar="${item}"]`).isVisible()) { await page.click('[data-acao="sacola"]'); await esperarLivre(); }
      await page.click(`[data-confiscar="${item}"]`);
      feitas.confiscados.push(item);
      await esperarLivre();
    }
    await page.click(`[data-acao="carimbo:${c.carimbo}"]`);
    await espera(200);
    await esperarLivre();
    tempos.push({ id: c.id, s: Math.round((Date.now() - t0) / 100) / 10 });
    decisoes.push(feitas);
    console.log(`  atendimento ${visita + 1}: ${c.id}`);
  }
  ok(decisoes.length > 0, `o robô atendeu ${decisoes.length} visitantes pela tela`);
  ok(alvosRuins.length === 0, `todo alvo apontado é o elemento de cima no próprio centro${alvosRuins.length ? ': ' + alvosRuins.join(' | ') : ''}`);
  console.log('  tempo por visitante (s, com ?depressa):', tempos.map((t) => `${t.id} ${t.s}`).join(' · '));

  // o mesmo dia jogado só pelo Expediente, com as mesmas decisões
  const limpo = await page.evaluate((decisoes) => {
    const p = window.portaria;
    const e = p.expedienteLimpo();
    for (const d of decisoes) {
      const v = e.proximo();
      if (!v || v.id !== d.id) return { erro: `fila diferente: ${v?.id} × ${d.id}` };
      if (d.recusou) e.responderOferta(false);
      for (const a of d.perguntas) e.perguntar(a);
      for (const [a, b] of d.apontados) e.apontar(a, b);
      for (const i of d.confiscados) e.confiscar(i);
      e.carimbar(d.carimbo);
    }
    const f = e.terminar();
    return { total: f.total, estrelas: f.estrelas, linhas: f.linhas.length, fatos: f.fatos };
  }, decisoes);

  // o fim do dia: terminar, o recado e o envelope
  await esperarLivre();
  ok(await page.isVisible('[data-acao="terminar"]'), 'com a fila atendida, aparece o "Terminar o dia"');
  await page.click('[data-acao="terminar"]');
  for (let i = 0; i < 60 && !(await page.isVisible('.pt-envelope.show')); i++) {
    await fecharFalas();
    await espera(200);
  }
  ok(await page.isVisible('.pt-envelope.show'), 'o envelope da Gina aparece');
  await foto({ path: `${OUT}-envelope${sufixo}.png` });
  const daCena = await page.evaluate(() => {
    const f = window.portaria.ex.terminar();
    return { total: f.total, estrelas: f.estrelas, linhas: f.linhas.length, fatos: f.fatos };
  });
  ok(JSON.stringify(daCena) === JSON.stringify(limpo), `o envelope da cena é o do expediente sem cena (${JSON.stringify(daCena)} × ${JSON.stringify(limpo)})`);
  ok(daCena.estrelas === 3, `jogando certo, três estrelas (${daCena.estrelas})`);
  const premio = await page.evaluate(n => {
    const ids = n === 6 ? ['camisa-da-portaria', 'calca-da-portaria', 'tenis-da-portaria']
      : ['cracha-da-portaria', 'apito-da-portaria', 'quepe-da-portaria', 'colete-da-portaria', 'pulseira-vip-da-portaria'].slice(n - 1, n);
    return window.jogo.flag(`portaria:premio:dia:${n}`) && ['ari', 'renan'].every(quem =>
      ids.every(id => window.jogo.wardrobeItems(quem).some(p => p.id === id)));
  }, DIA);
  ok(premio, 'o prêmio das três estrelas foi entregue e salvo para os dois');
  const peso = await page.evaluate(() => window.jogo.renderer.info.render);
  console.log(`  peso da primeira pessoa no fim: ${peso.calls} desenhos, ${peso.triangles} triângulos`);
  await page.click('[data-env="ok"]');
  await espera(4000);
  const depois = await page.evaluate((n) => ({
    vezes: window.jogo.stat(`portaria:dia:${n}:vezes`),
    saldo: window.jogo.carteira(),
    cena: window.jogo.current?.def?.id ?? null,
    naPortaria: !!document.querySelector('.portaria.show'),
  }), DIA);
  ok(!depois.naPortaria && depois.cena === 'clube', `a mesa fechou e a dupla voltou ao clube (${depois.cena})`);
  ok(depois.vezes === 1, `o save ganhou o dia ${DIA} (${depois.vezes})`);
  ok(depois.saldo - saldoAntes === daCena.total, `a carteira ganhou R$ ${daCena.total} (${depois.saldo - saldoAntes})`);
  // de volta ao clube, a dupla anda de novo
  // (o navegador de teste roda poucos quadros por segundo: o que se mede é sair do lugar, e o controle destravado)
  const p0 = await page.evaluate(() => window.jogo.playerPosition().toArray());
  await page.keyboard.down('KeyS');
  await espera(3000);
  await page.keyboard.up('KeyS');
  await espera(300);
  const p1 = await page.evaluate(() => window.jogo.playerPosition().toArray());
  const andou = Math.hypot(p1[0] - p0[0], p1[2] - p0[2]);
  const travado = await page.evaluate(() => window.jogo.player?.locked ?? null);
  ok(travado === false && andou > 0.05, `de volta ao clube, a dupla anda (${andou.toFixed(2)} m, travado: ${travado})`);
  await foto({ path: `${OUT}-volta${sufixo}.png` });
}

ok(erros.length === 0, `nenhum erro de página${erros.length ? ': ' + erros.slice(0, 4).join(' | ') : ''}`);
await browser.close();
if (falhas.length) {
  console.log(`\n${falhas.length} falha(s)`);
  process.exit(1);
}
console.log('\ntudo certo');
