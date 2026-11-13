/** Casa ↔ clube, destinos e encontros opcionais; só preview e save de teste. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/casa-clube';
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { SENTIDOS, gerarRota, destinoDaRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
for (const sentido of SENTIDOS) {
  const contagem = { noel: 0, josefina: 0, nenhum: 0 };
  for (let seed = 1; seed <= 500; seed++) {
    const r = gerarRota(seed, sentido), n = r.encontro;
    contagem[n?.personagem ?? 'nenhum']++;
    assert.deepEqual(r, gerarRota(seed, sentido));
    assert.equal(r.trechos[0].de, 0); assert.equal(r.trechos.at(-1).ate, r.comprimento);
    for (let i = 1; i < r.trechos.length; i++) assert.equal(r.trechos[i - 1].ate, r.trechos[i].de);
    if (n) {
      assert.ok(r.eventos.every(e => Math.abs(e.s - n.s) > 120), 'corredor sem obstáculos');
      assert.ok(!r.coracoes.some(c => c.s > n.s - 60 && c.s < n.s + 95), 'sem coração disputando a faixa');
      if (n.personagem === 'josefina') assert.ok(!r.eventos.some(e => e.tipo === 'rega'));
    }
    assert.ok(r.coracoes.every(c => c.s < r.chegada && Math.abs(c.l) <= 2.3));
    if (sentido === 'casa-clube') assert.deepEqual(r.trechos.map(t => t.bioma), ['bairro', 'avenida', 'hortas', 'esportivo']);
    if (sentido === 'clube-casa') assert.deepEqual(r.trechos.map(t => t.bioma), ['esportivo', 'hortas', 'avenida', 'bairro']);
  }
  assert.ok(contagem.noel > 110 && contagem.noel < 190);
  assert.ok(contagem.josefina > 110 && contagem.josefina < 190);
  assert.ok(contagem.nenhum > 160 && contagem.nenhum < 240);
  console.log(sentido, '500 rotas deterministas e encontros variados', contagem);
}
const a = gerarRota(7, 'casa-clube'), b = gerarRota(7, 'parque-clube'), c = gerarRota(7, 'clube-casa');
assert.deepEqual(a.trechos.slice(-2), b.trechos.slice(-2));
assert.deepEqual(c.trechos, a.trechos.map(t => ({ bioma: t.bioma, de: 1000 - t.ate, ate: 1000 - t.de })).reverse());
if (process.env.SO === 'rotas') process.exit(0);

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
const erros = [], espera = (p, f, a) => p.waitForFunction(f, a, { timeout: 120000 });
async function desenho(p, normal) { await p.evaluate(normal => { const r = window.jogo.renderer; window.renderNormal ??= r.render.bind(r); r.render = normal ? window.renderNormal : (s, c) => { s.updateMatrixWorld(); c.updateMatrixWorld(); }; }, normal); }
async function avancar(p) { await p.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); }); }
async function ate(p, f, teto = 240000) { const t = Date.now(); while (Date.now() - t < teto) { if (await p.evaluate(f)) return; await avancar(p); await p.waitForTimeout(65); } throw Error('Estado esperado não chegou'); }
async function escolher(p, nome) { await p.getByRole('button', { name: nome, exact: true }).click({ timeout: 60000 }); }
async function disparar(p, id) { await p.evaluate(id => { void window.jogo.current.world.interactables.find(i => i.id === id).trigger(window.jogo); }, id); }
async function foto(p, nome) {
  const antes = await p.evaluate(() => { const v = window.aristoryBebitoMobile.viagem, r = window.aristoryBebitoMobile.ritmoDoPresente, a = [v.vezes, r.vezes]; v.vezes = r.vezes = 0; return a; });
  await desenho(p, true); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  await p.screenshot({ path: `${OUT}-${nome}.png` });
  console.log('foto', nome, await p.evaluate(() => ({ ...window.jogo.renderer.info.render })));
  await desenho(p, false); await p.evaluate(a => { window.aristoryBebitoMobile.viagem.vezes = a[0]; window.aristoryBebitoMobile.ritmoDoPresente.vezes = a[1]; }, antes);
}
async function pose(p, motorista) { assert.equal(await p.evaluate(() => { const g = window.jogo; return g.player.rig.noCarro === 'dirigindo' ? g.playerId() : g.companionId(); }), motorista); }
async function novaPagina(mobile = false) {
  const ctx = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1200, height: 850 }, isMobile: mobile, hasTouch: mobile }), p = await ctx.newPage();
  p.on('pageerror', e => erros.push(e.message)); return p;
}
async function abrir(p, query = '') {
  await p.goto(`${BASE}/?bebito&carroPorDentro&semHalloween&${query}`);
  await espera(p, () => !!window.jogo?.current && !window.jogo.transitioning); await desenho(p, false);
}
async function emCasa(p, seed) {
  await abrir(p, 'cena=casa');
  await p.evaluate(seed => { const g = window.jogo; for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) g.setFlag(f); g.bump('bebito:viagens', seed - 1 - g.stat('bebito:viagens')); if (g.playerId() !== 'renan') g.swapCharacters(); g.goTo('frente-da-casa'); }, seed);
  await espera(p, () => window.jogo.idDaCena === 'frente-da-casa' && !window.jogo.transitioning);
  await p.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 5; });
  await disparar(p, 'frente:sair-de-carro');
  await ate(p, () => [...document.querySelectorAll('.escolhas.show button')].some(b => b.textContent === 'Escolher destino'));
  await escolher(p, 'Escolher destino');
}
async function percorrer(p, sentido, motorista, personagem, prefixo) {
  await espera(p, () => window.jogo.idDaCena === 'viagem-de-carro' && !window.jogo.transitioning);
  const r = await p.evaluate(() => window.aristoryBebitoMobile.viagem.rota);
  assert.equal(r.sentido, sentido); assert.equal(r.encontro?.personagem ?? null, personagem); await pose(p, motorista);
  // A recarga preserva destino, motorista e sorteio, inclusive o resultado "ninguém".
  await abrir(p); assert.deepEqual(await p.evaluate(() => window.aristoryBebitoMobile.viagem.rota), r); await pose(p, motorista);
  await p.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 5; v.piloto = 'bom'; window.aristoryBebitoMobile.ritmoDoPresente.vezes = 5; });
  let interna = false, conversou = false, terminou = false, anterior = -Infinity, resumo; const fotos = new Set(), fases = new Set(), inicio = Date.now();
  while (Date.now() - inicio < 300000) {
    const e = await p.evaluate(() => { const g = window.jogo, v = window.aristoryBebitoMobile.viagem, n = g.current.world.root.userData.novidadesDaViagem?.encontro; return { cena: g.idDaCena, ...v.estado, encontro: n ? { ...n.estado } : null }; });
    if (e.cena !== 'viagem-de-carro') { resumo = e; break; }
    if (prefixo && e.s > 70 && !fotos.has('saida')) { fotos.add('saida'); await foto(p, prefixo + '-saida'); }
    if (personagem && e.s > r.encontro.s - 100 && !interna) { interna = true; await p.evaluate(() => { void window.aristoryBebitoMobile.viagem.passageiro.trocar(); }); }
    if (e.encontro && e.encontro.fase !== 'esperando') {
      fases.add(e.encontro.fase); assert.ok(e.encontro.s >= anterior - .25, 'carro do personagem não anda de ré'); anterior = e.encontro.s;
      if (e.encontro.fase === 'falando' && !conversou) {
        conversou = true; assert.ok(e.v < .15 && Math.abs(e.l - 1.75) < .2); await pose(p, motorista);
        if (prefixo) await foto(p, prefixo + '-' + personagem);
        if (personagem === 'josefina') {
          const largura = await larguraDoCarro(p);
          assert.ok(largura < 3.5, 'carga cabe na faixa'); console.log('largura do carro da Josefina', largura);
        }
      }
      if (e.encontro.fase === 'feito' && !terminou) { terminou = true; await espera(p, () => window.aristoryBebitoMobile.viagem.estado.visao === 'dentro'); await pose(p, motorista); }
    }
    if (prefixo && sentido === 'casa-clube' && e.s > 840 && !fotos.has('alameda')) { fotos.add('alameda'); await foto(p, prefixo + '-alameda'); }
    await avancar(p); await p.waitForTimeout(55);
  }
  assert.ok(resumo, 'chegou ao destino'); assert.equal(resumo.tropecos, 0); assert.equal(resumo.sustos, 0);
  assert.equal(conversou, !!personagem); assert.equal(terminou, !!personagem);
  if (personagem) { assert.ok(resumo.vistos[personagem]); assert.ok(fases.has('ultrapassando') && fases.has('freando') && fases.has('falando') && fases.has('saindo')); }
  const destino = destinoDaRota(sentido);
  await ate(p, () => { const g = window.jogo, c = g.scene.getObjectByName('bebito-mobile'); return !g.transitioning && !g.player.locked && !g.player.riding && !!c && (g.idDaCena !== 'clube' || c.userData.chegada?.fase === 'concluida'); });
  assert.equal(await p.evaluate(() => window.jogo.idDaCena), destino === 'clube' ? 'clube' : 'frente-da-casa');
  const flags = await p.evaluate(() => [window.jogo.flag('bebito:carro-no-clube'), window.jogo.flag('bebito:carro-no-parque'), window.jogo.flag('bebito:viagem-em-andamento')]);
  assert.deepEqual(flags, [destino === 'clube', false, false]);
  if (prefixo) await foto(p, prefixo + '-chegada');
  console.log('viagem completa', sentido, motorista, personagem ?? 'sem encontro', 'sem tropeços/sustos e controle devolvido');
  await abrir(p); assert.equal(await p.evaluate(() => window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada), undefined);
  assert.equal(await p.evaluate(() => localStorage.getItem('aristory.save.v1')), null);
}
async function larguraDoCarro(p) {
  return p.evaluate(() => {
    const c = window.jogo.current.world.root.userData.novidadesDaViagem.encontro.carro.group;
    c.updateMatrixWorld(true); const inversa = c.matrixWorld.clone().invert(); let min = Infinity, max = -Infinity;
    c.traverse(m => {
      if (!m.isMesh) return; m.geometry.computeBoundingBox(); const b = m.geometry.boundingBox;
      for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) {
        const v = c.position.clone().set(x, y, z).applyMatrix4(m.matrixWorld).applyMatrix4(inversa); min = Math.min(min, v.x); max = Math.max(max, v.x);
      }
    });
    return max - min;
  });
}
try {
  if (process.env.SO !== 'encontros') {
  const p = await novaPagina(); await emCasa(p, 4); await foto(p, 'computador-destinos');
  await escolher(p, 'Agora não'); await escolher(p, 'Escolher destino'); await escolher(p, 'Clube'); await escolher(p, 'Ari');
  await ate(p, () => window.jogo.idDaCena === 'viagem-de-carro');
  await percorrer(p, 'casa-clube', 'ari', 'noel', 'computador-ida');
  // O clube oferece a volta direta para casa e ainda permite ir ao parque.
  await p.evaluate(() => { const g = window.jogo; g.bump('bebito:viagens', -g.stat('bebito:viagens')); });
  await disparar(p, 'clube:bebito-mobile'); await foto(p, 'computador-clube-destinos');
  assert.ok(await p.getByRole('button', { name: 'Parque Villa Lobos', exact: true }).count());
  await escolher(p, 'Casa do Ari'); await escolher(p, 'Renan'); await ate(p, () => window.jogo.idDaCena === 'viagem-de-carro');
  await percorrer(p, 'clube-casa', 'renan', 'josefina', 'computador-volta');
  // O carro fica só em casa depois da volta.
  for (const cena of ['clube', 'villa-lobos']) {
    await p.evaluate(c => window.jogo.goTo(c), cena); await espera(p, c => window.jogo.idDaCena === c && !window.jogo.transitioning, cena);
    assert.equal(await p.evaluate(() => !!window.jogo.scene.getObjectByName('bebito-mobile')), false);
  }
  await p.context().close();
  const m = await novaPagina(true); await emCasa(m, 1); await foto(m, 'celular-destinos');
  await escolher(m, 'Clube'); await escolher(m, 'Renan'); await ate(m, () => window.jogo.idDaCena === 'viagem-de-carro');
  await percorrer(m, 'casa-clube', 'renan', null, 'celular-ida'); await m.context().close();
  }
  // Encontros na rota antiga também reservam a pista e devolvem a visão interna.
  for (const [mobile, sentido, seed, personagem] of [[false, 'volta', 1, 'noel'], [false, 'clube-casa', 1, 'josefina'], [true, 'ida', 2, 'josefina'], [true, 'volta', 1, 'noel']]) {
    const q = await novaPagina(mobile); await abrir(q, `cena=viagem-de-carro&viagem=${sentido},ari,${seed}`);
    await q.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.estado.s = v.rota.encontro.s - 61; v.vezes = 4; v.piloto = 'bom'; });
    await ate(q, () => window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.fase === 'falando');
    await espera(q, personagem => document.querySelector('.dialogue.show')?.textContent.includes(personagem === 'noel' ? 'GELO' : 'cantinho com sol'), personagem);
    await pose(q, 'ari'); await foto(q, (mobile ? 'celular-legado-' : 'computador-') + personagem); assert.ok(await larguraDoCarro(q) < 3.5);
    await ate(q, () => window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.fase === 'feito');
    await pose(q, 'ari'); await q.context().close();
  }
  assert.deepEqual(erros, []); console.log('Destinos, viagens diretas, encontros, save e celular passaram sem erros.');
} catch (e) {
  for (const c of browser.contexts()) for (const p of c.pages()) {
    console.log('falha', await p.evaluate(() => ({ cena: window.jogo?.idDaCena, viagem: window.aristoryBebitoMobile?.viagem.estado, encontro: window.jogo?.current?.world.root.userData.novidadesDaViagem?.encontro?.estado, dialogo: document.querySelector('.dialogue.show')?.textContent })).catch(() => null));
    await desenho(p, true).catch(() => {}); await p.screenshot({ path: `${OUT}-falha.png` }).catch(() => {});
  }
  throw e;
} finally { await browser.close(); }
