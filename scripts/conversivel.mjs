/**
 * O CONVERSÍVEL DA TIA LIZ E DAS IRMÃS (docs/CARROS-DA-ESCOLA.md §2).
 *
 * MODELO   parado no Villa Lobos pelo atalho `?conversivel=x,z,giro`: nada abaixo
 *          do chão, a largura cabendo na faixa, as QUATRO dentro do carro (a Tia
 *          Liz ao volante do lado do Bebito, com os pés acima do assoalho e as
 *          patas no aro; a Luna sentada do outro lado, de óculos de sol; a Sol e
 *          a Estrella em pé no banco de trás), os detalhes da Venezuela (as oito
 *          estrelas, a bandeirinha, a mala, o cuatro) e as fotos de todos os
 *          lados, de perto de cada uma, andando e VAZIO (a versão estacionada).
 *
 * ESTRADA  uma viagem casa → escola com a Tia Liz já conhecida: a buzina na chegada
 *          e na saída, a história das quatro (só na primeira vez), as palmas na hora
 *          certa e o CONFETE, as duas AREPITAS voando e indo para a mochila, a
 *          memória, NENHUMA torcida na faixa na mesma viagem, o save de verdade
 *          intacto; uma SEGUNDA viagem (sem a história, com o oi); e uma viagem SEM
 *          a Tia Liz conhecida (nada de conversível, e a torcida atravessa).
 * ESCOLA   ESTACIONADO no lote da escola só depois da memória, numa vaga comum.
 * AREPITA  a arepita na mão (foto de perto) e comida (sai da mochila).
 *
 * Uso: node scripts/conversivel.mjs /tmp/cv
 *      SO=modelo|estrada|escola|arepita roda uma parte; CEL=1 a estrada no celular em pé
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/conversivel';
const PONTO = { x: -6, z: 30 };
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { gerarRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
const SENTIDO = 'casa-escola';
const sementes = [];
for (let s = 1; sementes.length < 3; s++) if (gerarRota(s, SENTIDO).encontro?.personagem === 'tializ') sementes.push(s);
const FLAGS = ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'escola-aberta', 'luna-na-escola', 'gatito-conhecido'];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
  const abrir = async (extra, espera = 5000) => {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&conversivel=${PONTO.x},${PONTO.z},0${extra}&em=${PONTO.x + 6},${PONTO.z + 8}`);
    await page.waitForFunction(() => window.conversivel && window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.waitForTimeout(espera);
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
  if (parte('modelo')) {
  {
    const { page, foto } = await abrir('');
    const m = await page.evaluate(() => {
      const c = window.conversivel; c.group.updateMatrixWorld(true);
      const V = c.group.position.constructor;
      const caixa = (raiz, filtro = () => true) => {
        const min = new V(Infinity, Infinity, Infinity), max = new V(-Infinity, -Infinity, -Infinity), p = new V();
        raiz.traverse((x) => {
          if (!x.isMesh || x.isInstancedMesh || !filtro(x)) return;
          let vis = true; for (let o = x; o; o = o.parent) if (!o.visible) vis = false;
          if (!vis) return;
          const pos = x.geometry.attributes.position;
          for (let i = 0; i < pos.count; i += 2) { p.fromBufferAttribute(pos, i).applyMatrix4(x.matrixWorld); c.group.worldToLocal(p); min.min(p); max.max(p); }
        });
        return { min: min.toArray().map((v) => +v.toFixed(3)), max: max.toArray().map((v) => +v.toFixed(3)) };
      };
      const bichos = [c.tiaLiz, ...c.irmas].map((b) => b.group);
      const dentro = (x) => { for (let o = x; o; o = o.parent) if (bichos.includes(o)) return true; return false; };
      let malhas = 0, tri = 0;
      c.group.traverse((x) => { if (!x.isMesh) return; malhas++; const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (x.isInstancedMesh ? x.count : 1); });
      const ondeEsta = (b) => c.group.worldToLocal(b.group.getWorldPosition(new V())).toArray().map((v) => +v.toFixed(2));
      return {
        tudo: caixa(c.group), lata: caixa(c.group, (x) => !dentro(x)),
        liz: caixa(c.tiaLiz.group), quem: [c.tiaLiz, ...c.irmas].map((b) => ({ id: b.group.userData.peca, onde: ondeEsta(b), caixa: caixa(b.group) })),
        oculos: !!c.irmas[0].cabecaDaCoelha.getObjectByName('oculos-da-luna'),
        bandeirinha: !!c.group.getObjectByName('bandeirinha-da-antena'),
        malhas, triangulos: Math.round(tri),
      };
    });
    console.log('MODELO:', JSON.stringify({ tudo: m.tudo, lata: m.lata, malhas: m.malhas, triangulos: m.triangulos }));
    for (const q of m.quem) console.log(`  ${q.id}: em ${q.onde}, de ${q.caixa.min[1]} a ${q.caixa.max[1]} de altura`);
    assert.ok(m.tudo.min[1] > -0.03, 'nada abaixo do chão');
    assert.ok(m.lata.max[0] - m.lata.min[0] < 2.0, `a largura cabe na faixa (${(m.lata.max[0] - m.lata.min[0]).toFixed(2)})`);
    const [liz, luna, sol, estrella] = m.quem;
    assert.ok(liz.onde[0] < -0.2 && luna.onde[0] > 0.2, 'a Tia Liz do lado do Bebito (−X), a Luna do outro');
    assert.ok(sol.onde[2] < -0.5 && estrella.onde[2] < -0.5, 'a Sol e a Estrella no banco de trás');
    for (const q of m.quem) {
      assert.ok(q.caixa.min[1] > 0.3, `${q.id}: nada dela atravessa o assoalho (${q.caixa.min[1]})`);
      assert.ok(Math.abs(q.onde[0]) < 0.9 && q.onde[2] > -1.3 && q.onde[2] < 0.5, `${q.id}: dentro da cabine (${q.onde})`);
    }
    assert.ok(m.oculos, 'a Luna de óculos de sol');
    assert.ok(m.bandeirinha, 'a bandeirinha na antena');
    await foto([3.2, 2.4, 6], [0, 1.0, 0.6], 'frente-diagonal');
    await foto([0, 2.6, 4.2], [0, 0.9, 1.5], 'frente-o-capo');
    await foto([-6.2, 2.2, 0.2], [0, 1.0, -0.1], 'lado-do-bebito');
    await foto([6, 2.2, -0.6], [0, 1.0, 0], 'lado-de-la');
    await foto([2, 2.8, -6.2], [0, 1.0, -0.4], 'tras');
    await foto([0.8, 1.9, -4.0], [0, 1.0, -1.6], 'a-mala');
    await foto([-0.5, 8, 1.4], [0, 1, -0.2], 'de-cima');
    await foto([-1.1, 1.7, 1.6], [-0.4, 1.35, 0.1], 'a-tia-liz');
    await foto([1.4, 1.5, 1.6], [0.4, 1.05, 0.1], 'a-luna');
    await foto([-2.4, 2.6, 1.2], [0, 1.1, -0.5], 'as-irmas');
    await page.evaluate(() => { window.jogo.setCameraOmbro(null); window.jogo.focusCamera(window.conversivel.group); window.jogo.setZoom(2.8); });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-isometrica.png` });
    await page.context().close();
  }
  {
    const { page, foto } = await abrir('&andando=8');
    await foto([-3.4, 2.6, -5.6], [0, 1.0, -0.4], 'andando-de-tras');
    await page.context().close();
  }
  {
    const { page, foto } = await abrir('&vazio', 2500);
    const v = await page.evaluate(() => { let malhas = 0, tri = 0; window.conversivel.group.traverse((x) => { if (!x.isMesh) return; malhas++; const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3; }); return { malhas, tri: Math.round(tri) }; });
    console.log(`  vazio (estacionado): ${v.malhas} malhas, ${v.tri} triângulos`);
    await foto([3.2, 2.4, 6], [0, 1.0, 0.6], 'vazio-frente');
    await foto([-2.4, 2.6, 1.2], [0, 1.0, -0.5], 'vazio-por-dentro');
    await page.context().close();
  }
  }
  // ------------------------------------------------------------------ na estrada
  if (parte('estrada')) {
    const tela = process.env.CEL ? { width: 390, height: 844 } : { width: 1100, height: 760 };
    const page = await (await browser.newContext({ viewport: tela })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    const viajar = async (semente, rotulo, conhecida) => {
      await page.evaluate(([flags, conhecida]) => { for (const f of flags) window.jogo.setFlag(f); window.jogo.setFlag('tia-liz-conhecida', conhecida); }, [FLAGS, conhecida]);
      await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=${SENTIDO},ari,${semente}`);
      await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem && !window.jogo.transitioning, null, { timeout: 120000 });
      const torcidaNaCena = () => page.evaluate(() => { let n = 0; window.jogo.scene.traverse((o) => { if (o.userData.peca === 'travessia-da-torcida') n++; }); return n; });
      if (!conhecida) {
        const r = await page.evaluate(() => ({ encontro: !!window.jogo.current.world.root.userData.novidadesDaViagem.encontro }));
        console.log(`ESTRADA (${rotulo}): semente ${semente}, a Tia Liz ainda não conhecida | encontro ${r.encontro} | torcida ${await torcidaNaCena()}`);
        assert.equal(r.encontro, false, 'antes de conhecer a Tia Liz, nada de conversível');
        assert.equal(await torcidaNaCena(), 1, 'e a torcida atravessa a faixa');
        return;
      }
      const estado = () => page.evaluate(() => {
        const n = window.jogo.current.world.root.userData.novidadesDaViagem;
        const c = n.encontro?.carro;
        return {
          quem: n.encontro?.personagem, fase: n.encontro?.estado.fase,
          buzina: window.jogo.audio.contagem.get('buzinaDaTiaLiz') ?? 0,
          confetes: c?.confetes ?? 0, arepitas: c?.arepitasNoAr ?? 0,
          agulha: !!document.querySelector('.dialogue .hora-certa.show'),
          dialogo: document.querySelector('.dialogue.show')?.textContent ?? '',
        };
      });
      const e0 = await estado();
      console.log(`ESTRADA (${rotulo}): semente ${semente}, encontro com ${e0.quem} | torcida ${await torcidaNaCena()}`);
      assert.equal(e0.quem, 'tializ');
      assert.equal(await torcidaNaCena(), 0, 'na viagem em que elas vêm de carro, a torcida não atravessa');
      await page.mouse.click(tela.width - 20, tela.height - 20);
      await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
      let buzinaNaChegada = 0, conversa = false, agulha = false, confete = false, voou = false, ditos = '';
      const t0 = Date.now();
      while (Date.now() - t0 < 400000) {
        const e = await estado();
        if (e.fase === 'alinhando' && !buzinaNaChegada) buzinaNaChegada = e.buzina;
        if (e.dialogo && !ditos.endsWith(e.dialogo)) ditos += ' | ' + e.dialogo;
        if (e.fase === 'falando' && !conversa) {
          conversa = true;
          await page.waitForTimeout(1500);
          await page.screenshot({ path: `${OUT}-estrada-${rotulo}-1-conversa${process.env.CEL ? '-celular' : ''}.png` });
          const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
          console.log(`  peso na conversa: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
        }
        if (e.agulha && !agulha) { agulha = true; await page.screenshot({ path: `${OUT}-estrada-${rotulo}-2-palmas${process.env.CEL ? '-celular' : ''}.png` }); }
        if (e.confetes > 0 && !confete) { confete = true; await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}-estrada-${rotulo}-3-confete${process.env.CEL ? '-celular' : ''}.png` }); }
        if (e.arepitas > 0 && !voou) { voou = true; await page.screenshot({ path: `${OUT}-estrada-${rotulo}-4-arepitas${process.env.CEL ? '-celular' : ''}.png` }); }
        if (e.fase === 'feito') break;
        await page.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
        await page.waitForTimeout(90);
      }
      const fim = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
        return {
          buzina: window.jogo.audio.contagem.get('buzinaDaTiaLiz') ?? 0,
          memoria: (save.memories ?? []).some((m) => m.id === 'tializ-na-estrada'),
          arepitas: (JSON.stringify(save).match(/arepita-tia-liz/g) ?? []).length,
        };
      });
      console.log(`  buzina ${fim.buzina} | arepitas no save ${fim.arepitas} | memória ${fim.memoria}`);
      assert.ok(buzinaNaChegada >= 1 && fim.buzina >= 3, 'a buzina na chegada, na conversa e na saída');
      assert.ok(conversa && agulha && confete && voou, `a conversa, as palmas, o confete e as arepitas voando (${conversa}, ${agulha}, ${confete}, ${voou})`);
      assert.ok(fim.arepitas >= 2, 'uma arepita para cada um, na mochila');
      assert.ok(fim.memoria, 'a memória "As quatro que vieram juntas"');
      assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
      return ditos;
    };
    await viajar(sementes[0], 'sem-conhecer', false);
    const a = await viajar(sementes[0], 'primeira', true);
    assert.match(a, /pequenininhas/, 'na primeira vez, a história das quatro');
    // (a segunda: as arepitas da primeira são comidas antes, para o aviso não ser o de "repetido")
    await page.evaluate(() => { const g = window.jogo; for (const q of ['ari', 'renan']) while (g.removeItem('arepita-tia-liz', q)); });
    const b = await viajar(sementes[1], 'de-novo', true);
    assert.ok(!/pequenininhas/.test(b) && /de novo/.test(b), 'na segunda, sem a história, com o oi');
    await page.context().close();
  }
  // ------------------------------------------------------------------ estacionado na escola
  if (parte('escola')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    const abrirPatio = async (memorias) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
      await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.evaluate((memorias) => {
        for (const id of memorias) window.jogo.unlock({ id, title: id, place: 'Na estrada', icon: '🐻', note: 'teste' });
        window.jogo.goTo('escola-patio');
      }, memorias);
      await page.waitForFunction(() => window.jogo.idDaCena === 'escola-patio' && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(1200);
      return page.evaluate(() => window.jogo.current.world.root.userData.conversivelNaEscola ?? null);
    };
    assert.equal(await abrirPatio([]), null, 'antes do encontro, nada de conversível no lote');
    const r0 = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    const vaga = await abrirPatio(['tializ-na-estrada']);
    console.log('ESCOLA: o conversível estacionado em', JSON.stringify(vaga));
    assert.ok(vaga, 'depois do encontro, o conversível no lote da escola');
    const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    console.log(`  peso do pátio: ${r0.calls} → ${r.calls} desenhos, ${Math.round(r0.triangles / 1000)} → ${Math.round(r.triangles / 1000)} mil triângulos`);
    await page.evaluate((v) => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(v.x + 5, 3.4, v.z + 7), new V(v.x, 0.9, v.z)); }, vaga);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-escola-conversivel.png` });
    await page.evaluate((v) => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(v.x + 10, 12, v.z + 18), new V(v.x - 2, 0.5, v.z + 2)); }, vaga);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-escola-lote.png` });
    await page.context().close();
  }
  // ------------------------------------------------------------------ a arepita na mão
  if (parte('arepita')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=villa-lobos&em=-6,34&olhar=0.785`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    const naMao = await page.evaluate(() => {
      const g = window.jogo;
      g.storeItem(window.aristoryItens['arepita-tia-liz']);
      const i = g.handItems().findIndex((x) => x?.id === 'arepita-tia-liz');
      if (i >= 0) g.setActiveHandSlot(i);
      g.focusCamera(g.player.object); g.setZoom(2.6);
      return g.getActiveHandItem()?.id ?? null;
    });
    assert.equal(naMao, 'arepita-tia-liz', 'a arepita vai para a mão');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}-arepita-na-mao.png` });
    const rotulo = await page.evaluate(() => document.querySelector('.prompt.show')?.textContent ?? '');
    console.log('AREPITA: na mão, o prompt é', JSON.stringify(rotulo.trim()));
    assert.match(rotulo, /Comer/, 'com ela na mão, dá para comer');
    await page.keyboard.press('KeyE');
    let comeu = false;
    for (let i = 0; i < 60 && !comeu; i++) { await page.waitForTimeout(250); comeu = !(await page.evaluate(() => window.jogo.hasItem('arepita-tia-liz'))); }
    assert.ok(comeu, 'comida, ela sai da mochila');
    await page.context().close();
  }
  assert.deepEqual(erros, []);
  console.log('O conversível da Tia Liz e das irmãs está de pé.');
} finally {
  await browser.close();
}
