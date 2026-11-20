/**
 * O CARRINHO DE GOLFE DA GINA (docs/CARRINHO-DE-GOLFE-DA-GINA.md).
 *
 * MODELO   parado no Villa Lobos pelo atalho `?golfe=x,z,giro`, com ela deitada no
 *          banco: nada abaixo do chão, menor que o Bebito, as pernas DOBRADAS no banco,
 *          o PESCOÇO SAINDO DO TOLDO (a cabeça acima dele) dirigindo, e esticada
 *          (`&esticando`) a cabeça POR BAIXO do toldo e para fora da lateral, na
 *          altura de uma janela, com o carimbo na boca; fotos de todos os lados,
 *          de cima, do rosto, esticada e vazio (com o quepe no banco).
 * PARQUE   ESTACIONADO no estacionamento do clube só depois da memória do
 *          encontro, na vaga livre da fileira da Josefina, sem fechar o caminho.
 * ESTRADA  o encontro (uma rota do clube com a Gina): o apito na chegada e na
 *          saída, a conversa, o carrinho encostando, o pescoço até o para-brisa,
 *          o CARIMBO (o carimbo perto do selo), o SELO colado no para-brisa do
 *          Bebito da cena e gravado na ficha do save, a memória, o save de
 *          verdade intacto; e uma SEGUNDA viagem com ela, já sócios: sem carimbo
 *          novo, com a fala do "já é sócio".
 *
 * Uso: node scripts/carrinhoDeGolfe.mjs /tmp/gf
 *      SO=modelo|parque|estrada roda uma parte; CEL=1 tira a foto da conversa no celular em pé
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/carrinhoDeGolfe';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const PONTO = { x: -6, z: 30 };

// a semente da viagem do clube com a Gina (a mesma conta do jogo)
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { gerarRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
const SENTIDO = 'casa-clube';
const sementes = [];
for (let s = 1; sementes.length < 2; s++) if (gerarRota(s, SENTIDO).encontro?.personagem === 'gina') sementes.push(s);
const [SEMENTE, SEMENTE2] = sementes;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
  // ------------------------------------------------------------------ o modelo
  if (parte('modelo')) {
    const abrir = async (extra, espera = 3000) => {
      const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
      page.on('pageerror', (e) => erros.push(e.message));
      await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&golfe=${PONTO.x},${PONTO.z},0${extra}&em=${PONTO.x + 6},${PONTO.z + 8}`);
      await page.waitForFunction(() => window.golfe && window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(espera);
      const foto = async (de, para, nome) => {
        await page.evaluate(([d, p, o]) => {
          const V = window.jogo.scene.position.constructor;
          window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + p[0], p[1], o.z + p[2]));
        }, [de, para, PONTO]);
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}-${nome}.png` });
      };
      const medir = () => page.evaluate(() => {
        const c = window.golfe; c.group.updateMatrixWorld(true);
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
          return { min: min.toArray().map((v) => +v.toFixed(3)), max: max.toArray().map((v) => +v.toFixed(3)) };
        };
        let malhas = 0, tri = 0;
        c.group.traverse((x) => { if (!x.isMesh) return; malhas++; const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (x.isInstancedMesh ? x.count : 1); });
        const gina = c.gina?.group;
        const dentro = (x) => { for (let o = x; o; o = o.parent) if (o === gina) return true; return false; };
        const cabeca = c.gina ? c.group.worldToLocal(c.gina.cabecaDaGina.getWorldPosition(new V())).toArray().map((v) => +v.toFixed(3)) : null;
        const carimbo = c.gina ? c.group.worldToLocal(c.pontaDoCarimbo()).toArray().map((v) => +v.toFixed(3)) : null;
        // as pernas: nenhuma malha do corpo dela abaixo do banco (elas DOBRAM em cima dele, e não atravessam o carrinho)
        let pernasAVista = 0;
        if (gina) gina.traverse((x) => { if (!x.isMesh) return; let vis = true; for (let o = x; o; o = o.parent) if (!o.visible) vis = false; if (vis && c.group.worldToLocal(x.getWorldPosition(new V())).y < 0.6) pernasAVista++; });
        // e os cascos dobrados (a malha escura do casco, deitada) aparecem na altura do banco
        const cascos = [];
        if (gina) gina.traverse((x) => { if (x.isMesh && x.geometry.type === 'CylinderGeometry' && x.geometry.parameters.height === 0.11 && x.visible) cascos.push(+c.group.worldToLocal(x.getWorldPosition(new V())).y.toFixed(2)); });
        return { tudo: caixa(c.group), lata: caixa(c.group, (x) => !dentro(x)), cabeca, carimbo, pernasAVista, cascos, malhas, triangulos: Math.round(tri) };
      });
      return { page, foto, medir };
    };
    const TOLDO = 1.78;
    {
      const { page, foto, medir } = await abrir('');
      const m = await medir();
      console.log('MODELO: medidas', JSON.stringify(m));
      assert.ok(m.tudo.min[1] > -0.03, 'nada abaixo do chão');
      const comprido = m.lata.max[2] - m.lata.min[2], largo = m.lata.max[0] - m.lata.min[0];
      assert.ok(comprido < 3.6 && largo < 1.7, `menor que o Bebito (${comprido.toFixed(2)} × ${largo.toFixed(2)})`);
      assert.equal(m.pernasAVista, 0, 'nada dela atravessa o banco para baixo');
      assert.ok(m.cascos.length === 4 && m.cascos.every((y) => y > 0.8 && y < 1.0), `as quatro pernas dobradas em cima do banco, com os cascos à vista (${m.cascos})`);
      assert.ok(m.cabeca[1] > TOLDO + 0.4, `dirigindo, o pescoço sai pelo toldo (a cabeça em ${m.cabeca[1]})`);
      await foto([-5.25, 4.8, 10], [-1.75, 1.6, 1], 'camera-do-encontro');
      await foto([2.8, 2.4, 5], [0, 1.2, 0.3], 'frente-diagonal');
      await foto([0, 1.5, 5.2], [0, 1.2, 0.5], 'frente');
      await foto([-5.5, 2.2, 0.4], [0, 1.4, -0.2], 'lado-do-bebito');
      await foto([5, 2.2, -0.6], [0, 1.4, 0], 'lado-de-la');
      await foto([2, 2.8, -5.5], [0, 1.2, -0.4], 'tras');
      await foto([-0.5, 7, 1.4], [0, 1, -0.2], 'de-cima');
      await foto([-1.6, 2.9, 2.4], [-0.2, 2.4, 0.3], 'rosto');
      await foto([0.9, 1.75, 1.6], [0.1, 1.15, 0.55], 'painel');
      await foto([-2.6, 1.7, 0.2], [-0.24, 0.95, -0.42], 'pernas-dobradas');
      await foto([2.4, 1.9, -1.2], [-0.24, 0.95, -0.42], 'pernas-dobradas-do-outro-lado');
      await page.evaluate(() => { window.jogo.setCameraOmbro(null); window.jogo.focusCamera(window.golfe.group); window.jogo.setZoom(2.6); });
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${OUT}-isometrica.png` });
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('&andando=7');
      await foto([-3.4, 2.6, -5], [0, 1.2, -0.4], 'andando-de-tras');
      await page.context().close();
    }
    {
      // (o navegador do teste anda devagar: o pescoço leva alguns segundos para esticar)
      const { page, foto, medir } = await abrir('&conversando&esticando', 12000);
      const m = await medir();
      console.log('  esticada:', JSON.stringify({ cabeca: m.cabeca, carimbo: m.carimbo }));
      assert.ok(m.carimbo[0] < -1.2, `esticada, o carimbo sai pela lateral do carrinho (x ${m.carimbo[0]})`);
      assert.ok(m.carimbo[1] > 1.2 && m.carimbo[1] < 1.9, `na altura de uma janela (y ${m.carimbo[1]})`);
      assert.ok(m.cabeca[1] < TOLDO, 'e a cabeça passa por baixo do toldo');
      await foto([-5.25, 4.8, 10], [-1.75, 1.6, 1], 'esticada-camera-do-encontro');
      await foto([-4.4, 2.0, 1.8], [-1.1, 1.5, 0], 'esticada-de-lado');
      await foto([-2.6, 1.8, 2.6], [-1.4, 1.55, 0], 'esticada-carimbo');
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('&vazio');
      await foto([2.8, 2.4, 5], [0, 1.0, 0.2], 'vazio-frente');
      await foto([-2.4, 3.6, -1.8], [0, 0.8, -0.4], 'vazio-por-dentro');
      await page.context().close();
    }
  }
  // ------------------------------------------------------------------ estacionado no clube
  if (parte('parque')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    const abrirClube = async (memorias) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
      await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.evaluate((memorias) => {
        const g = window.jogo;
        for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) g.setFlag(f);
        for (const id of memorias) g.unlock({ id, title: id, place: 'Na estrada', icon: '🦒', note: 'teste' });
        g.goTo('clube');
      }, memorias);
      await page.waitForFunction(() => window.jogo.idDaCena === 'clube' && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(1200);
      return page.evaluate(() => (window.jogo.current.world.root.userData.estacionamentoDoClube?.carros ?? []).map((c) => c.personagem));
    };
    const vizinhos = ['noel-na-estrada', 'josefina-na-estrada', 'capy-na-estrada', 'walter-na-estrada'];
    const antes = await abrirClube(vizinhos);
    assert.ok(!antes.includes('gina'), 'antes do encontro, nada de carrinho de golfe no estacionamento');
    const r0 = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    const depois = await abrirClube(['gina-na-estrada', ...vizinhos]);
    console.log('PARQUE: no estacionamento do clube', JSON.stringify(depois));
    assert.ok(depois.includes('gina'), 'depois do encontro, o carrinho de golfe na vaga dele');
    // o caminho de pedestres do lote (a faixa de concreto em z = 7) continua livre
    const livre = await page.evaluate(() => {
      const c = window.jogo.current.world.colliders;
      const bate = (x, z) => c.some((k) => (k.kind === 'circle' ? Math.hypot(x - k.x, z - k.z) < k.r + 0.42 : Math.abs(x - k.x) < k.hw + 0.42 && Math.abs(z - k.z) < k.hd + 0.42));
      const ruins = [];
      for (let x = -62; x <= -42; x += 0.5) if (bate(x, 7)) ruins.push(+x.toFixed(1));
      return ruins;
    });
    assert.deepEqual(livre, [], 'a faixa de pedestres do lote continua livre');
    const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    console.log(`  peso: ${r0.calls} → ${r.calls} desenhos, ${Math.round(r0.triangles / 1000)} → ${Math.round(r.triangles / 1000)} mil triângulos com o carrinho`);
    await page.evaluate(() => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(-40.5, 3.6, 3.2), new V(-46.2, 1.0, -1)); });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-clube-carrinho.png` });
    await page.evaluate(() => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(-36, 11, 9), new V(-52, 1.0, -2)); });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-clube-lote.png` });
    await page.evaluate(() => window.jogo.setCameraOmbro(null));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}-clube-isometrica.png` });
    await page.context().close();
  }

  // ------------------------------------------------------------------ na estrada
  if (parte('estrada')) {
    const tela = process.env.CEL ? { width: 390, height: 844 } : { width: 1100, height: 760 };
    const page = await (await browser.newContext({ viewport: tela })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.evaluate(() => { for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) window.jogo.setFlag(f); });
    const viajar = async (semente, rotulo) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=${SENTIDO},ari,${semente}`);
      await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem?.encontro, null, { timeout: 120000 });
      const estado = () => page.evaluate(() => {
        const n = window.jogo.current.world.root.userData.novidadesDaViagem;
        const c = n.encontro.carro;
        const bebito = window.jogo.scene.getObjectByName('bebito-mobile');
        const encaixe = bebito?.getObjectByName('vaga:paraBrisa:0');
        let distancia = null;
        if (encaixe && c.gina) { const V = encaixe.position.constructor; distancia = +encaixe.getWorldPosition(new V()).distanceTo(c.pontaDoCarimbo()).toFixed(2); }
        return {
          quem: n.encontro.personagem, fase: n.encontro.estado.fase,
          apito: window.jogo.audio.contagem.get('apito') ?? 0, carimbadas: c.carimbadas, esticado: c.esticado ?? 0,
          selo: encaixe?.userData.adesivo ?? null, distancia, dialogo: document.querySelector('.dialogue.show')?.textContent ?? '',
        };
      });
      const e0 = await estado();
      console.log(`ESTRADA (${rotulo}): semente ${semente}, encontro com ${e0.quem}`);
      assert.equal(e0.quem, 'gina');
      await page.mouse.click(tela.width - 20, tela.height - 20);
      await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
      let apitoNaChegada = 0, conversa = false, fotoDoCarimbo = false, menorDistancia = Infinity, ditos = '';
      const t0 = Date.now();
      while (Date.now() - t0 < 400000) {
        const e = await estado();
        if (e.fase === 'alinhando' && !apitoNaChegada) apitoNaChegada = e.apito;
        if (e.dialogo && !ditos.endsWith(e.dialogo)) ditos += ' | ' + e.dialogo;
        if (e.distancia !== null && e.fase === 'falando') menorDistancia = Math.min(menorDistancia, e.distancia);
        if (e.fase === 'falando' && !conversa) {
          conversa = true;
          await page.waitForTimeout(1500);
          await page.screenshot({ path: `${OUT}-estrada-${rotulo}-1-conversa${process.env.CEL ? '-celular' : ''}.png` });
          const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
          console.log(`  peso na conversa: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
        }
        if (e.esticado > 0.85 && !fotoDoCarimbo) {
          fotoDoCarimbo = true;
          await page.screenshot({ path: `${OUT}-estrada-${rotulo}-2-carimbo${process.env.CEL ? '-celular' : ''}.png` });
        }
        if (e.fase === 'feito') break;
        await page.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
        await page.waitForTimeout(90);
      }
      const fim = await estado();
      const save = await page.evaluate(() => {
        const s = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
        return { memoria: (s.memories ?? []).some((m) => m.id === 'gina-na-estrada'), ficha: window.jogo.fichaDoBebitoMobile().vagas.paraBrisa };
      });
      console.log(`  apito ${fim.apito} vezes | carimbadas ${fim.carimbadas} | selo no vidro ${fim.selo} | ficha ${JSON.stringify(save.ficha)} | memória ${save.memoria} | carimbo a ${menorDistancia} m do selo`);
      assert.ok(apitoNaChegada >= 1, 'o apito na chegada');
      assert.ok(fim.apito >= 3, 'e na conversa e na saída');
      assert.ok(conversa, 'a conversa');
      assert.ok(save.memoria, 'a memória "A portaria sobre rodas"');
      assert.deepEqual(save.ficha, ['selo-socio-do-clube'], 'o selo gravado na ficha do Bebito, no save de teste');
      assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
      return { fim, menorDistancia, ditos };
    };
    const a = await viajar(SEMENTE, 'primeira');
    assert.equal(a.fim.carimbadas, 1, 'na primeira vez, ela carimba');
    assert.equal(a.fim.selo, 'selo-socio-do-clube', 'e o selo fica colado no para-brisa do Bebito, na hora');
    assert.ok(a.menorDistancia < 0.9, `o carimbo chega perto do selo (${a.menorDistancia} m)`);
    const b = await viajar(SEMENTE2, 'de-novo');
    assert.equal(b.fim.carimbadas, 0, 'já sócios: sem carimbo novo');
    assert.equal(b.fim.selo, 'selo-socio-do-clube', 'o selo continua no vidro (o carro novo nasce com ele, da ficha)');
    assert.match(b.ditos, /já é sócio/, 'e a fala do "já é sócio"');
    await page.context().close();
  }
  assert.deepEqual(erros, []);
  console.log('O carrinho de golfe da Gina está de pé.');
} finally {
  await browser.close();
}
