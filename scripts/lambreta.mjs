/**
 * A LAMBRETA DA ESTELLA (docs/LAMBRETA-DA-ESTELLA.md), estacionada pelo atalho
 * `?lambreta=x,z,giro` na rua do Villa Lobos, com a Estella montada: fotos de
 * perto de todos os lados (a lambreta, o sidecar, a pilha de roupas, o capacete
 * e os óculos de aviador), as medidas (a Estella sentada NO banco e com as
 * patas da frente no guidão, a pilha dentro do sidecar) e o peso.
 *
 * PARQUE  a lambreta ESTACIONADA no Villa Lobos: só depois do primeiro
 *         encontro (a memória `estella-na-estrada`), na vaga vizinha da do
 *         Bebito, vazia e com a pilha; antes do encontro, a vaga fica vazia.
 * PANO    o encontro na estrada (rota casa → parque, onde só ela aparece):
 *         quando ela arranca, o lenço do alto da pilha sai voando, gruda no
 *         para-brisa do Bebito, escorrega aos pouquinhos pelo teto e vai
 *         embora — os quatro momentos, com foto de cada um.
 *
 * Uso: node scripts/lambreta.mjs /tmp/lb
 *      SO=modelo|parque|pano roda uma parte
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
const OUT = process.argv[2] ?? '/tmp/lambreta';
const PONTO = { x: -6, z: 30 };
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
  if (parte('modelo')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&lambreta=${PONTO.x},${PONTO.z},0&em=${PONTO.x + 6},${PONTO.z + 8}`);
    await page.waitForFunction(() => window.lambreta && window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.waitForTimeout(1500);

    // ------------------------------------------------------------- as medidas
    const m = await page.evaluate(() => {
      const l = window.lambreta;
      l.group.updateMatrixWorld(true);
      const V = l.group.position.constructor;
      const Box = (o) => { const B = new (window.jogo.scene.position.constructor === V ? Object : Object)(); void B; };
      void Box;
      const caixa = (o) => {
        const min = new V(Infinity, Infinity, Infinity), max = new V(-Infinity, -Infinity, -Infinity), p = new V();
        o.traverse((x) => {
          if (!x.isMesh || !x.visible) return;
          const pos = x.geometry.attributes.position;
          const copias = x.isInstancedMesh ? x.count : 1;
          const mi = new x.matrixWorld.constructor();
          for (let c = 0; c < copias; c++) {
            if (x.isInstancedMesh) { x.getMatrixAt(c, mi); mi.premultiply(x.matrixWorld); } else mi.copy(x.matrixWorld);
            for (let i = 0; i < pos.count; i += 3) { p.fromBufferAttribute(pos, i).applyMatrix4(mi); min.min(p); max.max(p); }
          }
        });
        return { min: min.toArray().map((v) => +v.toFixed(2)), max: max.toArray().map((v) => +v.toFixed(2)) };
      };
      const blocos = []; l.group.traverse((o) => { if (/^pilha-/.test(o.name)) blocos.push(o); });
      let malhas = 0, tri = 0;
      l.group.traverse((o) => { if (o.isMesh) { malhas++; const g = o.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1); } });
      return { tudo: caixa(l.group), estella: caixa(l.estella.group), pilha: caixa(blocos[0]), malhas, triangulos: Math.round(tri), blocos: blocos.length };
    });
    console.log('medidas', JSON.stringify(m));
    assert.ok(m.tudo.min[1] > -0.02, 'nada abaixo do chão');
    assert.ok(m.blocos === 5, 'os cinco blocos da pilha');
    // a lambreta cabe na faixa da estrada (3,5 m) com o sidecar
    assert.ok(m.tudo.max[0] - m.tudo.min[0] < 3.3, 'cabe na faixa');

    // -------------------------------------------------------------- as fotos
    const desenho = async (de, para, nome) => {
      await page.evaluate(([d, p, o]) => {
        const V = window.jogo.scene.position.constructor;
        window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + p[0], p[1], o.z + p[2]));
      }, [de, para, PONTO]);
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${OUT}-${nome}.png` });
    };
    await desenho([3.2, 2.6, 5.2], [0.6, 1.6, 0], 'frente-diagonal');
    await desenho([-1.2, 2.2, 5.6], [0.4, 1.4, 0], 'frente');
    await desenho([-5.4, 2.4, 0.4], [0.4, 1.5, 0], 'lado-da-estella');
    await desenho([6.6, 2.8, -0.6], [1.0, 2.0, 0], 'lado-do-sidecar');
    await desenho([2.5, 2.6, -5.4], [0.8, 1.8, 0], 'tras');
    await desenho([-1.0, 2.35, 1.6], [0, 2.0, 0.3], 'rosto');
    await desenho([0.6, 2.6, 1.4], [0, 2.05, 0.2], 'oculos');
    await desenho([1.4, 1.35, 2.6], [0.5, 0.7, 0.6], 'lambreta-de-perto');
    await desenho([-4, 8, 6], [0.6, 1.6, 0], 'de-cima');
    // e a isométrica de sempre, de perto
    await page.evaluate(() => { window.jogo.setCameraOmbro(null); window.jogo.focusCamera(window.lambreta.group); window.jogo.setZoom(2.4); });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-isometrica.png` });
    await page.context().close();
  }

  // ------------------------------------------------------------------ estacionada no parque
  if (parte('parque')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    const abrirParque = async (comMemoria) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
      await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.evaluate((comMemoria) => {
        const g = window.jogo;
        for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'bebito:carro-no-parque']) g.setFlag(f);
        if (comMemoria) g.unlock({ id: 'estella-na-estrada', title: 'A torre de roupas', place: 'Na estrada', icon: '🧵', note: 'teste' });
        g.goTo('villa-lobos', 'do-carro');
      }, comMemoria);
      await page.waitForFunction(() => window.jogo.idDaCena === 'villa-lobos' && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(1200);
      return page.evaluate(() => {
        const l = window.jogo.current.world.root.userData.lambretaNoParque;
        return l ? [+l.x.toFixed(2), +l.z.toFixed(2)] : null;
      });
    };
    const antes = await abrirParque(false);
    assert.equal(antes, null, 'antes do encontro, nada de lambreta no estacionamento');
    const depois = await abrirParque(true);
    console.log('PARQUE: a lambreta estacionada em', JSON.stringify(depois));
    assert.ok(depois && Math.abs(depois[0] - 51.4) < 0.1 && Math.abs(depois[1] - 7.76) < 0.1, 'na vaga vizinha da do Bebito');
    await page.screenshot({ path: `${OUT}-parque-isometrica.png` });
    await page.evaluate(() => { window.jogo.setZoom(1.6); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-parque-de-perto.png` });
    await page.evaluate(() => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(58, 4.5, 15), new V(51.6, 1.6, 7)); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-parque-lambreta.png` });
    await page.evaluate(() => window.jogo.setCameraOmbro(null));
    await page.context().close();
  }

  // ------------------------------------------------------------------ o pano no para-brisa
  if (parte('pano')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.evaluate(() => { for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) window.jogo.setFlag(f); });
    await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=ida,ari,1`);
    await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem?.encontro, null, { timeout: 120000 });
    const novidade = () => page.evaluate(() => { const n = window.jogo.current.world.root.userData.novidadesDaViagem; return { fase: n.encontro.estado.fase, pano: n.pano?.momento ?? null }; });
    assert.equal((await novidade()).pano, 'guardado', 'o pano espera guardado na pilha');
    await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
    const momentos = new Set();
    const t0 = Date.now();
    while (Date.now() - t0 < 400000) {
      await page.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
      const n = await novidade();
      if (n.pano && !momentos.has(n.pano)) {
        momentos.add(n.pano);
        if (n.pano !== 'guardado') {
          // o relógio para na foto, e volta
          await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 0; });
          await page.waitForTimeout(500);
          await page.screenshot({ path: `${OUT}-pano-${momentos.size}-${n.pano}.png` });
          await page.evaluate((lento) => { window.aristoryBebitoMobile.viagem.vezes = lento ? 0.6 : 1; }, n.pano === 'grudado');
          if (n.pano === 'grudado') {
            // um tico depois de grudar: o pano assentado no vidro
            await page.waitForTimeout(1200);
            await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 0; });
            await page.waitForTimeout(400);
            await page.screenshot({ path: `${OUT}-pano-${momentos.size}-grudado-assentado.png` });
            await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 1; });
          }
        }
      }
      if (n.pano === 'foi') break;
      await page.waitForTimeout(90);
    }
    console.log('PANO: momentos', [...momentos].join(' → '));
    for (const m of ['voando', 'grudado', 'escorregando', 'saindo', 'foi']) assert.ok(momentos.has(m), `o pano passou por ${m}`);
    await page.context().close();
  }

  assert.deepEqual(erros, []);
  console.log('A lambreta da Estella está de pé.');
} finally {
  await browser.close();
}
