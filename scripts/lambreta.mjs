/**
 * A LAMBRETA DA ESTELLA (docs/LAMBRETA-DA-ESTELLA.md), estacionada pelo atalho
 * `?lambreta=x,z,giro` na rua do Villa Lobos, com a Estella montada: fotos de
 * perto de todos os lados (a lambreta, o sidecar, a pilha de roupas, o capacete
 * e os óculos de aviador), as medidas (a Estella sentada NO banco e com as
 * patas da frente no guidão, a pilha dentro do sidecar) e o peso.
 *
 * Uso: node scripts/lambreta.mjs /tmp/lb
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
const OUT = process.argv[2] ?? '/tmp/lambreta';
const PONTO = { x: -6, z: 30 };
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
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
  assert.deepEqual(erros, []);
  console.log('A lambreta da Estella está de pé.');
} finally {
  await browser.close();
}
