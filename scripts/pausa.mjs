/**
 * O MENU PAUSA O JOGO (pedido do Renan: o Ari abriu o menu no meio da rodada
 * do jardim e os bichos continuaram comendo). Com o menu aberto:
 *
 *   - o relógio da onda não anda, e nenhum bicho sai do lugar;
 *   - a dupla não anda (nem o parceiro, que segue sozinho);
 *   - a tela continua sendo desenhada (não congela num quadro velho);
 *
 * e fechou, tudo volta a andar de onde parou.
 *
 *   node scripts/pausa.mjs /tmp/pa
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/pa';
const BASE = process.env.BASE ?? 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const problemas = [];
const erros = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) problemas.push(msg);
};

const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=estufa&rodada=1`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada?.rodando, null, { timeout: 30000 });

// o retrato da rodada: o relógio da onda, onde está cada bicho, e o parceiro
const retrato = () => page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  const par = window.jogo.companionPosition();
  return {
    tempo: r.tempoDaOnda,
    bichos: r.invasores.map((i) => [+i.x.toFixed(3), +i.z.toFixed(3)]),
    par: [+par.x.toFixed(3), +par.z.toFixed(3)],
    quadros: window.jogo.renderer?.info?.render?.frame ?? null,
  };
});

// espera a onda ter bicho andando
await page.waitForFunction(() => window.jogo.current.world.root.userData.rodada.invasores.length >= 2, null, { timeout: 90000 });
await page.waitForTimeout(1500);
const antes = await retrato();
console.log(`       rodando: onda aos ${antes.tempo.toFixed(2)} s, ${antes.bichos.length} bichos`);

// ================================================ abre o menu: tudo para
await page.locator('.menu-btn').click();
await page.waitForTimeout(400);
ok(await page.locator('.menu.show').count() === 1, 'o botão do menu abre o menu');
const p0 = await retrato();
await page.waitForTimeout(3000);
const p1 = await retrato();
await page.screenshot({ path: `${OUT}-pausado.png` });
ok(p1.tempo === p0.tempo, `com o menu aberto o relógio da onda não anda (${p0.tempo.toFixed(2)} → ${p1.tempo.toFixed(2)} s)`);
ok(JSON.stringify(p1.bichos) === JSON.stringify(p0.bichos), `e nenhum bicho sai do lugar (${p0.bichos.length} bichos)`);
ok(JSON.stringify(p1.par) === JSON.stringify(p0.par), 'nem o parceiro');
if (p0.quadros !== null) ok(p1.quadros > p0.quadros, `a tela continua sendo desenhada (${p1.quadros - p0.quadros} quadros)`);

// ================================================ fecha: tudo volta a andar
// (aberto, o menu cobre o próprio botão: fecha pelo "fechar" dele)
await page.locator('.menu .close').click();
await page.waitForTimeout(300);
const f0 = await retrato();
await page.waitForTimeout(2500);
const f1 = await retrato();
ok(f1.tempo > f0.tempo, `fechou o menu, o relógio volta a andar (${f0.tempo.toFixed(2)} → ${f1.tempo.toFixed(2)} s)`);
ok(JSON.stringify(f1.bichos) !== JSON.stringify(f0.bichos), 'e os bichos também');
ok(f0.tempo - p1.tempo < 0.3, `sem pular o tempo que ficou pausado (retomou em ${f0.tempo.toFixed(2)} s, parou em ${p1.tempo.toFixed(2)} s)`);

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
