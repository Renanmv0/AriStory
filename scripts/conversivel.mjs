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
 * A interação na estrada e o estacionado na escola vêm depois (pedido do Renan).
 *
 * Uso: node scripts/conversivel.mjs /tmp/cv
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/conversivel';
const PONTO = { x: -6, z: 30 };

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
  assert.deepEqual(erros, []);
  console.log('O conversível da Tia Liz e das irmãs está de pé.');
} finally {
  await browser.close();
}
