/**
 * O joystick do celular depois de uma parada com o dedo encostado.
 *
 * O bug (iPhone): andando, a pessoa parava sem tirar o dedo e, ao voltar a
 * arrastar, o corpo só VIRAVA — não andava — até soltar e encostar de novo. O
 * Safari trata o dedo parado como começo de toque longo e manda
 * `pointercancel`; dali em diante não chega mais `pointermove` daquele dedo.
 *
 * O Chromium daqui não faz esse gesto, então o teste o IMITA: toque de
 * verdade pelo CDP (que gera os eventos de ponteiro E os de toque, como no
 * iPhone), e no meio da parada um `pointercancel` disparado no canvas, com
 * os `pointermove` seguintes engolidos — que é exatamente o que o Safari faz.
 *
 * O que este teste guarda:
 * - andar, parar com o dedo e voltar a andar para OUTRO lado anda de verdade
 *   (sem cancelamento e com ele);
 * - soltar o dedo para a dupla;
 * - tocar num clicável (o abajur do quarto) continua não virando joystick.
 *
 * Uso: node scripts/joystick.mjs [/caminho/prefixo]
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? null;
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

let falhas = 0;
const conferir = (nome, ok, detalhe = '') => {
  console.log(`${ok ? 'ok  ' : 'FALHOU'} ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
  if (!ok) falhas++;
};

const cdp = await ctx.newCDPSession(page);
const toque = (type, x, y) =>
  cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
const onde = () => page.evaluate(() => {
  const p = window.jogo.playerPosition();
  return { x: p.x, z: p.z };
});
const distancia = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const arrastar = async (x0, y0, x1, y1) => {
  for (let i = 1; i <= 5; i++) {
    await toque('touchMove', x0 + ((x1 - x0) * i) / 5, y0 + ((y1 - y0) * i) / 5);
    await page.waitForTimeout(40);
  }
};

/**
 * Faz o Safari: um `pointercancel` no canvas para o dedo do manche, e daí em
 * diante os `pointermove` dele não chegam mais (só os eventos de toque).
 */
const imitarSafari = () => page.evaluate(() => {
  const canvas = document.querySelector('#app canvas');
  const id = window.jogo.input.stickId;
  window.__engolir = id;
  if (!window.__engolindo) {
    window.__engolindo = true;
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerId === window.__engolir) e.stopImmediatePropagation();
    }, { capture: true });
  }
  canvas.dispatchEvent(new PointerEvent('pointercancel', { pointerId: id, pointerType: 'touch', bubbles: true }));
});

const X = 200;
const Y = 640;

/** anda, para com o dedo, (talvez o Safari cancela), volta a andar para a direita */
const rodada = async (comCancelamento) => {
  await page.goto(`${BASE}/?cena=casa&em=-1.5,1.5`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { window.__engolir = null; });
  await toque('touchStart', X, Y);
  await arrastar(X, Y, X, Y - 50);
  await page.waitForTimeout(700);
  await arrastar(X, Y - 50, X, Y);
  await page.waitForTimeout(1200);
  if (comCancelamento) await imitarSafari();
  const parado = await onde();
  await arrastar(X, Y, X + 50, Y);
  await page.waitForTimeout(1200);
  const depois = await onde();
  if (OUT) await page.screenshot({ path: `${OUT}-${comCancelamento ? 'cancelado' : 'normal'}.png` });
  await toque('touchEnd');
  await page.waitForTimeout(800);
  const soltou = await onde();
  await page.waitForTimeout(800);
  const soltouDepois = await onde();
  return { andou: distancia(parado, depois), parouAoSoltar: distancia(soltou, soltouDepois) };
};

const normal = await rodada(false);
conferir('parar com o dedo e voltar a andar anda', normal.andou > 1.0, `${normal.andou.toFixed(2)} m`);
const cancelado = await rodada(true);
conferir('mesmo com o Safari cancelando o toque, volta a andar', cancelado.andou > 1.0, `${cancelado.andou.toFixed(2)} m`);
conferir('soltar o dedo para a dupla', cancelado.parouAoSoltar < 0.05, `${cancelado.parouAoSoltar.toFixed(3)} m`);

// tocar no abajur do quarto acende/apaga e NÃO vira joystick
await page.goto(`${BASE}/?cena=quarto&em=-0.4,-1.4`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const alvo = await page.evaluate(() => {
  let c = null;
  window.jogo.current.world.root.traverse((o) => { if (o.name === 'cupula') c = o; });
  const p = c.getWorldPosition(c.position.clone());
  p.project(window.jogo.iso.camera);
  const r = document.querySelector('#app canvas').getBoundingClientRect();
  return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
});
const brilho = () => page.evaluate(() => {
  let c = null;
  window.jogo.current.world.root.traverse((o) => { if (o.name === 'cupula') c = o; });
  return c.material.emissiveIntensity > 0 && c.material.emissive.getHex() > 0;
});
const antes = await brilho();
await toque('touchStart', alvo.x, alvo.y);
await page.waitForTimeout(100);
await toque('touchEnd');
await page.waitForTimeout(600);
const stickDepois = await page.evaluate(() => window.jogo.input.stickId);
conferir('tocar no abajur ainda acende/apaga e não vira joystick', (await brilho()) !== antes && stickDepois === null);

conferir('sem erro de console', erros.length === 0, erros.join(' | '));
await browser.close();
console.log(falhas ? `\n${falhas} falha(s)` : '\ntudo certo');
process.exit(falhas ? 1 : 0);
