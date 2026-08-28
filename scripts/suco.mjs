/**
 * Os sucos do clube.
 *
 * O que este teste existe para provar nao e que os copos aparecem — e que o
 * SABOR e da pessoa, e nao de quem esta sendo controlado. Ele pede os sucos,
 * anota de quem e cada cor, aperta T e confere que o morango continua com o
 * Renan e o pessego com o Ari.
 *
 * Uso: node scripts/suco.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './suco';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube&em=-12.2,10.8&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

/** de quem esta cada copo, pela cor do liquido e pela distancia ate cada um */
const copos = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const eu = j.player.position;
    const ele = j.parceiro.position;
    const achados = [];
    j.current.world.root.traverse((o) => {
      if (!o.userData?.suco || !o.visible) return;
      // o primeiro filho e o corpo do copo, que e o proprio suco
      const cor = '#' + o.children[0].material.color.getHexString();
      const dEu = Math.hypot(o.position.x - eu.x, o.position.z - eu.z);
      const dEle = Math.hypot(o.position.x - ele.x, o.position.z - ele.z);
      achados.push({ cor, de: dEu < dEle ? j.player.name : j.parceiro.name });
    });
    return { achados, controlando: j.player.name };
  });

const prompt = await page.locator('.prompt.show').textContent().catch(() => null);
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);

const falas = [];
for (let i = 0; i < 8; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  falas.push(
    (await page.locator('.dialogue .who').textContent()) +
      ': ' +
      (await page.locator('.dialogue .text').textContent()),
  );
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(600);
}
await page.waitForTimeout(900);

// de perto, e virados para o horizontal da tela, senao um tapa o copo do outro
const enquadrar = () =>
  page.evaluate(() => {
    window.jogo.iso.setViewSize(3.2);
    window.jogo.player.rig.setFacing(window.jogo.iso.angle + Math.PI);
  });
await enquadrar();
await page.waitForTimeout(1400);

const antes = await copos();
await page.screenshot({ path: `${OUT}-copos.png` });

await page.keyboard.press('KeyT');
await page.waitForTimeout(1400);
await enquadrar();
await page.waitForTimeout(1400);
const depois = await copos();
await page.screenshot({ path: `${OUT}-depois-do-swap.png` });

const dono = (e, cor) => e.achados.find((c) => c.cor === cor)?.de ?? '(ninguém)';
const MORANGO = '#ff8fa8';
const PESSEGO = '#ffb066';

console.log('prompt:', (prompt ?? '').replace(/\s+/g, ' ').trim());
console.log('conversa:\n  ' + falas.join('\n  '));
console.log('copos na mão:', antes.achados.length);
console.log(`controlando ${antes.controlando} · morango com ${dono(antes, MORANGO)} · pêssego com ${dono(antes, PESSEGO)}`);
console.log(`controlando ${depois.controlando} · morango com ${dono(depois, MORANGO)} · pêssego com ${dono(depois, PESSEGO)}`);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  antes.achados.length === 2 &&
  depois.achados.length === 2 &&
  // o T tem que ter trocado mesmo quem anda, senao o teste nao provou nada
  antes.controlando !== depois.controlando &&
  dono(antes, MORANGO) === 'Renan' &&
  dono(antes, PESSEGO) === 'Ari' &&
  dono(depois, MORANGO) === 'Renan' &&
  dono(depois, PESSEGO) === 'Ari';

await browser.close();
process.exit(ok ? 0 : 1);
