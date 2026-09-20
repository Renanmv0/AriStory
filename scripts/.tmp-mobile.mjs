import { chromium } from 'playwright';
const OUT = process.argv[2] ?? './mb';
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PIQ = { x: -8.6, z: 18.4 };
const browser = await chromium.launch({ executablePath: CHROME,
  args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage'] });
// iPhone 14 em pe
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('http://127.0.0.1:4173/?cena=villa-lobos&em=-12.4,21.8', { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.evaluate(() => {
  const j = window.jogo;
  for (const f of ['jean-luc-conhecido','jean-luc-batido','mano-conhecido','estella-conhecida',
    'cookie-apresentado','batido-jean-luc','batido-cookie','batido-mano','batido-estella']) j.setFlag(f);
  for (const p of ['jaqueta-jean-luc','quepe-cookie','patins-mano',
    'blazer-xadrez','calca-xadrez','coroa-dama','bota-xadrez']) j.save.registrarPremio(p);
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
await page.evaluate(() => window.jogo.debugPlace(-12.4, 21.7, 0));
for (let i = 0; i < 14; i++) {
  if (await page.evaluate(() => document.querySelector('.quadro-de-inscricoes')?.classList.contains('show') ?? false)) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
}
await page.waitForTimeout(700);
await page.locator('.quadro-de-inscricoes .campeao').click();
await page.waitForTimeout(1200);
const ocupado = async () => (await page.locator('.dialogue.show').count()) > 0
  || (await page.evaluate(() => window.jogo.player.locked === true));
let falas = 0, tirou = false;
for (let i = 0; i < 400; i++) {
  await page.waitForTimeout(300);
  if (!(await ocupado())) break;
  if (await page.locator('.dialogue.show').count()) { falas++; await page.keyboard.press('KeyE'); }
  if (!tirou && falas >= 34) {
    tirou = true;
    console.log('viewSize:', await page.evaluate(() => window.jogo.iso.currentViewSize.toFixed(2)));
    // onde cada um esta na TELA
    console.log(await page.evaluate((piq) => {
      const j = window.jogo, cam = j.iso.camera, THREE = window.THREE;
      const onde = {};
      j.current.world.root.traverse((n) => { if (n.userData?.peca) onde[n.userData.peca] = n; });
      const out = {};
      for (const id of ['cookie','estella','mano','jean-luc']) {
        const o = onde[id];
        if (!o) continue;
        const v = o.position.clone(); v.y += 0.8;
        v.project(cam);
        out[id] = [+((v.x + 1) / 2 * 390).toFixed(0), +((1 - v.y) / 2 * 844).toFixed(0)];
      }
      return out;
    }, PIQ));
    await page.screenshot({ path: `${OUT}-festa.png` });
  }
}
await browser.close();
