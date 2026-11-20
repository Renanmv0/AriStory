/**
 * O CARRINHO DO COOKIE (docs/CARRINHO-DO-COOKIE.md).
 *
 * MODELO   parado no Villa Lobos pelo atalho `?carrinho=x,z,giro`, com o Cookie
 *          espremido lá dentro: nada abaixo do chão, bem menor que o Bebito, as
 *          ORELHAS PARA FORA da lataria (medidas), a tromba saindo pelo furo do
 *          para-brisa e passando por cima do capô (sem afundar nele), as patas
 *          escondidas; e as fotos de todos os lados, da câmera do encontro, de
 *          cima, andando (as orelhas no vento, o catavento, a fumacinha),
 *          conversando (o tombo para o lado) e oferecendo a caixinha; e o
 *          carrinho VAZIO (nivelado, com o banco).
 * PARQUE   ESTACIONADO no Villa Lobos só depois da memória do encontro, na vaga
 *          ao lado da passagem de pedestres (que continua livre), com fotos.
 * ESTRADA  o encontro (uma rota com o Cookie): a corneta na chegada, a conversa,
 *          a caixinha estendida, os DOIS DOCINHOS voando e indo para a mochila,
 *          a memória, o save de verdade intacto — e nada de Cookie soprando
 *          bolhas na calçada na mesma viagem.
 *
 * DOCINHO  o brigadeirinho do Cookie na mão (foto de perto) e comido (sai da
 *          mochila).
 *
 * Uso: node scripts/carrinho.mjs /tmp/cc
 *      SO=modelo|parque|estrada|docinho roda uma parte
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/carrinho';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const PONTO = { x: -6, z: 30 };

// a semente da viagem com o Cookie (a mesma conta do jogo)
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { gerarRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
let SEMENTE = 1;
while (gerarRota(SEMENTE, 'ida').encontro?.personagem !== 'cookie') SEMENTE++;
// o mesmo Cookie não passa de carrinho e sopra bolhas na calçada na mesma viagem
for (const sentido of ['ida', 'volta', 'clube-parque', 'parque-clube', 'escola-parque', 'parque-escola']) {
  for (let s = 1; s <= 400; s++) {
    const r = gerarRota(s, sentido);
    if (r.encontro?.personagem === 'cookie') assert.ok(!r.eventos.some((e) => e.bolhasDoCookie), `${sentido} ${s}: Cookie de carrinho E na calçada`);
  }
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
  // ------------------------------------------------------------------ o modelo
  if (parte('modelo')) {
    const abrir = async (extra) => {
      const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
      page.on('pageerror', (e) => erros.push(e.message));
      await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&carrinho=${PONTO.x},${PONTO.z},0${extra}&em=${PONTO.x + 6},${PONTO.z + 8}`);
      await page.waitForFunction(() => window.carrinho && window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(2500);
      const foto = async (de, para, nome) => {
        await page.evaluate(([d, p, o]) => {
          const V = window.jogo.scene.position.constructor;
          window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + p[0], p[1], o.z + p[2]));
        }, [de, para, PONTO]);
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}-${nome}.png` });
      };
      return { page, foto };
    };
    {
      const { page, foto } = await abrir('');
      const m = await page.evaluate(() => {
        const c = window.carrinho; c.group.updateMatrixWorld(true);
        const V = c.group.position.constructor;
        const caixa = (raiz, filtro = () => true) => {
          const min = new V(Infinity, Infinity, Infinity), max = new V(-Infinity, -Infinity, -Infinity), p = new V();
          raiz.traverse((x) => {
            if (!x.isMesh || x.isInstancedMesh || !filtro(x)) return;
            let visivel = true; for (let o = x; o; o = o.parent) if (!o.visible) visivel = false;
            if (!visivel) return;
            const pos = x.geometry.attributes.position;
            for (let i = 0; i < pos.count; i += 2) { p.fromBufferAttribute(pos, i).applyMatrix4(x.matrixWorld); c.group.worldToLocal(p); min.min(p); max.max(p); }
          });
          return { min: min.toArray().map((v) => +v.toFixed(2)), max: max.toArray().map((v) => +v.toFixed(2)) };
        };
        let malhas = 0, tri = 0;
        c.group.traverse((x) => { if (!x.isMesh) return; malhas++; const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (x.isInstancedMesh ? x.count : 1); });
        const cookie = c.cookie.group;
        const dentroDoCookie = (x) => { for (let o = x; o; o = o.parent) if (o === cookie) return true; return false; };
        const orelhas = [];
        cookie.getObjectByName('cabeca-do-cookie').children.forEach((f) => {
          // as orelhas são os dois grupos da cabeça esticados no comprimento (a escala em z)
          if (f.isGroup && Math.abs(f.scale.z - 1.7) < 0.01) orelhas.push(caixa(f));
        });
        const patas = []; cookie.traverse((x) => { if (x.isGroup && x.children.length >= 4 && Math.abs(x.position.y - 0.86) < 1e-6) patas.push(x.visible); });
        return {
          tudo: caixa(c.group), lataria: caixa(c.group, (x) => !dentroDoCookie(x)), cookie: caixa(cookie), orelhas, patas,
          malhas, triangulos: Math.round(tri),
        };
      });
      console.log('MODELO: medidas', JSON.stringify(m));
      assert.ok(m.tudo.min[1] > -0.03, 'nada abaixo do chão');
      const comprido = m.lataria.max[2] - m.lataria.min[2], largo = m.lataria.max[0] - m.lataria.min[0];
      assert.ok(comprido < 3.1 && largo < 2.2, `é um carrinho pequenininho (${comprido.toFixed(2)} × ${largo.toFixed(2)})`);
      assert.equal(m.orelhas.length, 2, 'as duas orelhas abertas');
      const borda = 0.84; // a meia largura da lataria na cintura
      const paraFora = Math.min(-m.orelhas.map((o) => o.min[0]).sort((a, b) => a - b)[0] - borda, m.orelhas.map((o) => o.max[0]).sort((a, b) => b - a)[0] - borda);
      console.log(`  as orelhas passam ${paraFora.toFixed(2)} m da lataria, de cada lado`);
      assert.ok(paraFora > 0.08, 'as orelhas saem para fora do carrinho');
      assert.ok(m.patas.length === 4 && m.patas.every((v) => v === false), 'as patas somem dentro da lataria');
      await foto([-5.25, 4.8, 10], [-1.75, 1.25, 1], 'camera-do-encontro');
      await foto([2.6, 2.0, 4.6], [0, 0.95, 0.3], 'frente-diagonal');
      await foto([0, 1.3, 4.6], [0, 1.05, 0.5], 'frente');
      await foto([-4.6, 1.7, 0.6], [0, 1.0, 0], 'lado-do-bebito');
      await foto([4.6, 1.9, -0.6], [0, 1.0, 0], 'lado-de-la');
      await foto([1.8, 2.2, -4.6], [0, 1.0, -0.2], 'tras');
      await foto([-0.4, 6.2, 1.6], [0, 0.8, 0], 'de-cima');
      await foto([-1.5, 1.75, 2.5], [0, 1.2, 0.6], 'rosto');
      await page.evaluate(() => { window.jogo.setCameraOmbro(null); window.jogo.focusCamera(window.carrinho.group); window.jogo.setZoom(2.4); });
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${OUT}-isometrica.png` });
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('&andando=7');
      await foto([-3.2, 2.4, -4.8], [0, 1.0, -0.4], 'andando-de-tras');
      await foto([-2.8, 2.2, 4.4], [0, 1.0, 0.3], 'andando-de-frente');
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('&conversando&oferecendo');
      await foto([-5.25, 4.8, 10], [-1.75, 1.25, 1], 'oferecendo-camera-do-encontro');
      await foto([-3.4, 1.9, 3.4], [-0.2, 1.2, 0.8], 'oferecendo');
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('&vazio');
      await foto([2.6, 2.4, 4.4], [0, 0.8, 0.2], 'vazio-frente');
      await foto([-2.2, 3.6, -2.6], [0, 0.6, 0], 'vazio-por-dentro');
      await page.context().close();
    }
  }
  // ------------------------------------------------------------------ estacionado no parque
  if (parte('parque')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    const abrirParque = async (memorias) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
      await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.evaluate((memorias) => {
        const g = window.jogo;
        for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'bebito:carro-no-parque']) g.setFlag(f);
        for (const id of memorias) g.unlock({ id, title: id, place: 'Na estrada', icon: '🐘', note: 'teste' });
        g.goTo('villa-lobos', 'do-carro');
      }, memorias);
      await page.waitForFunction(() => window.jogo.idDaCena === 'villa-lobos' && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(1200);
      return page.evaluate(() => {
        const k = window.jogo.current.world.root.userData.carrinhoNoParque;
        return k ? [+k.x.toFixed(2), +k.z.toFixed(2)] : null;
      });
    };
    assert.equal(await abrirParque(['mano-na-estrada', 'estella-na-estrada']), null, 'antes do encontro, nada de carrinho no estacionamento');
    const antes = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    console.log(`  peso do estacionamento sem o carrinho: ${antes.calls} desenhos, ${Math.round(antes.triangles / 1000)} mil triângulos`);
    const depois = await abrirParque(['cookie-na-estrada', 'mano-na-estrada', 'estella-na-estrada']);
    console.log('PARQUE: o carrinho estacionado em', JSON.stringify(depois));
    assert.ok(depois && Math.abs(depois[1] - 0.62) < 0.1, 'na vaga do outro lado da passagem');
    const livre = await page.evaluate(() => {
      const c = window.jogo.current.world.colliders;
      const bate = (x, z) => c.some((k) => (k.kind === 'circle' ? Math.hypot(x - k.x, z - k.z) < k.r + 0.42 : Math.abs(x - k.x) < k.hw + 0.42 && Math.abs(z - k.z) < k.hd + 0.42));
      const ruins = [];
      for (let x = 49.6; x <= 54.4; x += 0.2) if (bate(x, 3.0)) ruins.push(+x.toFixed(1));
      return ruins;
    });
    assert.deepEqual(livre, [], 'a passagem de pedestres continua livre');
    await page.screenshot({ path: `${OUT}-parque-isometrica.png` });
    const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    console.log(`  peso do estacionamento com o carrinho: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
    await page.evaluate(() => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(58.5, 3.4, 5.2), new V(52.4, 0.8, 0.6)); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-parque-carrinho.png` });
    await page.evaluate(() => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(62, 8.5, 6), new V(52, 1.0, 6)); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-parque-os-quatro.png` });
    await page.evaluate(() => window.jogo.setCameraOmbro(null));
    await page.context().close();
  }

  // ------------------------------------------------------------------ na estrada
  if (parte('estrada')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.evaluate(() => { for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) window.jogo.setFlag(f); });
    await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=ida,ari,${SEMENTE}`);
    await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem?.encontro, null, { timeout: 120000 });
    const estado = () => page.evaluate(() => {
      const n = window.jogo.current.world.root.userData.novidadesDaViagem;
      const c = n.encontro.carro;
      return {
        quem: n.encontro.personagem, fase: n.encontro.estado.fase, bolhas: !!n.cookie,
        corneta: window.jogo.audio.contagem.get('cornetaDoCookie') ?? 0,
        caixinha: !!c.caixinha?.visible, voando: c.voando?.length ?? 0,
      };
    });
    const e0 = await estado();
    console.log(`ESTRADA: semente ${SEMENTE}, encontro com ${e0.quem}`);
    assert.equal(e0.quem, 'cookie');
    assert.equal(e0.bolhas, false, 'sem Cookie soprando bolhas na calçada nesta viagem');
    await page.mouse.click(1080, 740); // (o som só acorda depois de um toque na página)
    await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
    let cornetaNaChegada = 0, conversa = false, ofereceu = false, voou = false, ultrapassando = false;
    const t0 = Date.now();
    while (Date.now() - t0 < 400000) {
      const e = await estado();
      if (e.fase === 'alinhando' && !cornetaNaChegada) cornetaNaChegada = e.corneta;
      if (e.fase === 'ultrapassando' && !ultrapassando) {
        ultrapassando = true;
        await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 1; });
        await page.waitForFunction(() => window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.relativo > -7, null, { timeout: 60000 }).catch(() => {});
        await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 0; });
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${OUT}-estrada-1-ultrapassando.png` });
        await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 3; });
      }
      if (e.fase === 'falando' && !conversa) {
        conversa = true;
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${OUT}-estrada-2-conversa.png` });
        const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
        console.log(`  peso na conversa: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
      }
      if (e.caixinha && !ofereceu) {
        ofereceu = true;
        await page.waitForTimeout(1300);
        await page.screenshot({ path: `${OUT}-estrada-3-oferecendo.png` });
      }
      if (e.voando > 0 && !voou) {
        voou = true;
        await page.screenshot({ path: `${OUT}-estrada-4-docinhos-voando.png` });
      }
      if (e.fase === 'feito') break;
      // (a fala em que ele estende a caixinha fica um instante na tela, para a foto; as outras, o teste avança)
      if (!(e.caixinha && !ofereceu)) await page.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
      await page.waitForTimeout(90);
    }
    const fim = await page.evaluate(() => {
      const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
      return {
        corneta: window.jogo.audio.contagem.get('cornetaDoCookie') ?? 0,
        memoria: (save.memories ?? []).some((m) => m.id === 'cookie-na-estrada'),
        docinhos: (JSON.stringify(save).match(/docinho-cookie/g) ?? []).length,
      };
    });
    console.log(`  corneta ${fim.corneta} vezes | brigadeirinhos no save ${fim.docinhos} | memória ${fim.memoria}`);
    assert.ok(cornetaNaChegada >= 1, 'a corneta toca quando o carrinho chega');
    assert.ok(fim.corneta >= 2, 'e de novo quando ele vai embora');
    assert.ok(conversa && ofereceu && voou, `a conversa, a caixinha estendida e os docinhos voando (${conversa}, ${ofereceu}, ${voou})`);
    assert.ok(fim.docinhos >= 2, 'um brigadeirinho para cada um, na mochila');
    assert.ok(fim.memoria, 'a memória "O carrinho que serve certinho"');
    assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
    await page.context().close();
  }
  // ------------------------------------------------------------------ o brigadeirinho na mão
  if (parte('docinho')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=villa-lobos&em=-6,34&olhar=0.785`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    const naMao = await page.evaluate(() => {
      const g = window.jogo;
      g.storeItem(window.aristoryItens['docinho-cookie']);
      const i = g.handItems().findIndex((x) => x?.id === 'docinho-cookie');
      if (i >= 0) g.setActiveHandSlot(i);
      g.focusCamera(g.player.object); g.setZoom(2.6);
      return g.getActiveHandItem()?.id ?? null;
    });
    assert.equal(naMao, 'docinho-cookie', 'o brigadeirinho vai para a mão');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}-docinho-na-mao.png` });
    const rotulo = await page.evaluate(() => document.querySelector('.prompt.show')?.textContent ?? '');
    console.log('DOCINHO: na mão, o prompt é', JSON.stringify(rotulo.trim()));
    assert.match(rotulo, /Comer/, 'com ele na mão, dá para comer');
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}-docinho-comendo.png` });
    let comeu = false;
    for (let i = 0; i < 60 && !comeu; i++) { await page.waitForTimeout(250); comeu = !(await page.evaluate(() => window.jogo.hasItem('docinho-cookie'))); }
    assert.ok(comeu, 'comido, ele sai da mochila');
    await page.context().close();
  }
  assert.deepEqual(erros, []);
  console.log('O carrinho do Cookie está de pé.');
} finally {
  await browser.close();
}
