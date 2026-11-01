import { chromium } from 'playwright';
const OUT = process.argv[2];
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
for (const [nome, opts] of [['cel', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['pc', { viewport: { width: 1200, height: 800 } }]]) {
  const pg = await b.newPage(opts);
  const erros = []; pg.on('pageerror', (e) => erros.push(e.message));
  const j = (fn, a) => pg.evaluate(fn, a);
  await pg.goto('http://127.0.0.1:4173/?cena=casinha-da-abobora-salao&halloween', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(2000);
  await j(() => { localStorage.removeItem('aristory.save.v1.halloween'); });
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForFunction(() => !!window.jogo?.current?.world, null, { timeout: 60000 });
  await j(() => { for (const f of ['halloween:convite','halloween:presente','halloween:festa','halloween:onibus-chegou','halloween:casinha:passou-do-portao','halloween:salao:surpresa']) window.jogo.setFlag(f); window.jogo.bump('halloween:caca', 10); window.jogo.bump('halloween:balas', 35); });
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForFunction(() => !!window.jogo?.current?.world, null, { timeout: 60000 });
  await pg.waitForTimeout(3000);
  await j(() => { const c = window.jogo.scene.getObjectByName('casca-da-abobora'); c.userData.salao.concursoAgora(); });
  for (let i = 0; i < 1500; i++) {
    const t = await j(() => ({ show: !!document.querySelector('.dialogue.show'), dig: window.jogo.ui.typing !== null, texto: document.querySelector('.dialogue.show .text')?.textContent ?? '' }));
    if (!t.show) { await pg.waitForTimeout(400); continue; }
    if (t.dig) { await pg.keyboard.press('KeyE'); await pg.waitForTimeout(300); continue; }
    if (/Um, dois, três/.test(t.texto)) { await pg.waitForTimeout(800); await pg.screenshot({ path: `${OUT}-${nome}.png` }); break; }
    await pg.keyboard.press('KeyE'); await pg.waitForTimeout(350);
  }
  console.log(nome, erros.length ? erros : 'sem erros');
  await pg.close();
}
await b.close();
