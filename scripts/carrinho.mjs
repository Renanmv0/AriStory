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
 * Uso: node scripts/carrinho.mjs /tmp/cc
 *      SO=modelo|parque|estrada roda uma parte
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
  assert.deepEqual(erros, []);
  console.log('O carrinho do Cookie está de pé.');
} finally {
  await browser.close();
}
