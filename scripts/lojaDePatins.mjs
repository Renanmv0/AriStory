/**
 * A LOJA DE PATINS DO VILLA LOBOS — mede e fotografa.
 *
 * - O DESENHO DENTRO DO COLISOR: toda malha da loja na altura do corpo (entre
 *   25 cm e 1,9 m) cabe nas caixas e nos círculos que a cena bloqueia, com
 *   folga de 15 cm. Prédio que cresceu sem o colisor crescer junto é um
 *   prédio que a dupla atravessa;
 * - O BALCÃO: o "Alugar patins" aparece do lado do balcão e calça os patins;
 * - AS FOTOS: de longe (a vista do jogo, três giros) e de perto (a fachada,
 *   o balcão e a vitrine), e o peso da vista.
 *
 * Uso: node scripts/lojaDePatins.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './loja';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 820 }, ignoreHTTPSErrors: true });
const erros = [];
const falhas = [];
const checar = (ok, msg, dado) => {
  if (!ok) falhas.push(dado === undefined ? msg : `${msg}: ${JSON.stringify(dado)}`);
};
page.on('pageerror', (e) => erros.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT|favicon/.test(m.text())) erros.push('console: ' + m.text()); });
const foto = (nome) => page.screenshot({ path: `${OUT}-${nome}.png` });
const ir = (x, z, olhar = Math.PI * 1.25) => page.evaluate(([a, b, c]) => window.jogo.debugPlace(a, b, c), [x, z, olhar]);

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });

const LOJA = { x: -8.6, z: 2.5 };

// ================================================== o desenho dentro do colisor
const medida = await page.evaluate(() => {
  const T = window.jogo.three ?? null;
  const mundo = window.jogo.current.world;
  let loja = null;
  mundo.root.traverse((o) => { if (o.userData.loja) loja = o; });
  if (!loja) return { achou: false };
  loja.updateMatrixWorld(true);
  const dentro = (x, z) => mundo.colliders.some((c) => {
    if (c.kind === 'box') {
      const cs = Math.cos(-(c.rot ?? 0));
      const sn = Math.sin(-(c.rot ?? 0));
      const dx = x - c.x;
      const dz = z - c.z;
      const lx = dx * cs - dz * sn;
      const lz = dx * sn + dz * cs;
      return Math.abs(lx) <= c.hw + 0.15 && Math.abs(lz) <= c.hd + 0.15;
    }
    return Math.hypot(x - c.x, z - c.z) <= (c.r ?? c.radius ?? 0) + 0.15;
  });
  const fora = [];
  let vertices = 0;
  const v = loja.position.clone();
  loja.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    const pos = o.geometry.attributes.position;
    const inst = o.isInstancedMesh ? o.count : 1;
    const m = o.matrixWorld.clone();
    const mi = m.clone();
    for (let k = 0; k < inst; k++) {
      if (o.isInstancedMesh) {
        o.getMatrixAt(k, mi);
        mi.premultiply(m);
      }
      for (let i = 0; i < pos.count; i += 3) {
        v.fromBufferAttribute(pos, i).applyMatrix4(o.isInstancedMesh ? mi : m);
        if (v.y < 0.25 || v.y > 1.9) continue;
        vertices++;
        if (!dentro(v.x, v.z)) fora.push([+v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2), o.name || o.parent?.name || '']);
      }
    }
  });
  return { achou: true, vertices, fora: fora.length, exemplos: fora.slice(0, 6) };
});
checar(medida.achou, 'a cena tem a loja (userData.loja)');
checar(medida.fora === 0, 'nada da loja na altura do corpo fica fora do colisor', medida);
console.log(`  colisor: ${medida.vertices} vértices na altura do corpo, ${medida.fora} fora`);

// ================================================================ as fotos
// de longe: a loja inteira com o patins do telhado, na vista do jogo e girando
await ir(LOJA.x + 0.5, LOJA.z + 9.5);
await page.evaluate(() => window.jogo.setZoom(14));
await page.waitForTimeout(2500);
await foto('longe');
const info = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
console.log(`  peso na vista da loja: ${info.calls} desenhos, ${info.triangles} triângulos`);

// de perto: a vitrine e a porta, e o balcão com o escaninho
await ir(LOJA.x + 0.4, LOJA.z + 4.2);
await page.evaluate(() => window.jogo.setZoom(5));
await page.waitForTimeout(2200);
await foto('fachada');
await ir(LOJA.x + 6.6, LOJA.z + 0.6);
await page.evaluate(() => window.jogo.setZoom(4.2));
await page.waitForTimeout(2200);
await foto('aluguel');

// girando: os outros lados (por último — a câmera não volta sozinha ao giro de antes)
await ir(LOJA.x + 0.5, LOJA.z + 9.5);
await page.evaluate(() => window.jogo.setZoom(14));
for (let i = 1; i <= 3; i++) {
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(1800);
  await foto(`giro${i}`);
}
await page.keyboard.press('KeyR');
await page.waitForTimeout(1500);

// ================================================================ o balcão
await page.evaluate(() => window.jogo.setZoom(9));
await ir(LOJA.x + 4.72 + 1.6, LOJA.z + 0.2, -Math.PI / 2);
let prompt = '';
for (let i = 0; i < 24 && !prompt.includes('Alugar patins'); i++) {
  await page.waitForTimeout(250);
  prompt = (await page.locator('.prompt.show').textContent().catch(() => '')) ?? '';
}
checar(prompt.includes('Alugar patins'), 'o balcão oferece os patins', prompt);
await foto('balcao');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
console.log(falhas.length ? 'FALHAS:\n - ' + falhas.join('\n - ') : 'tudo certo');
await browser.close();
process.exit(falhas.length || erros.length ? 1 : 0);
