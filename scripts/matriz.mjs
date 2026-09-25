/**
 * Confere a promessa de `src/core/matrizSoQuandoMexe.ts`: pular o `compose()`
 * de quem está parado não muda NADA na tela.
 *
 * A cada poucos frames, logo depois do render, recalcula do zero — como o
 * Three faria sem atalho nenhum — a matriz de mundo de TODO objeto da cena, e
 * compara com a que acabou de ir para a GPU. Se alguma peça ficou congelada
 * no lugar errado (moveu e a matriz não acompanhou, trocou de pai e ficou com
 * o mundo do pai antigo), a diferença aparece aqui com o caminho do objeto.
 *
 * Roda com movimento de verdade, que é quando a comparação importa: a dupla
 * andando em cada cena, sentando no sofá e o frisbee indo da mão para o ar e
 * voltando para a mão (troca de pai).
 *
 * Uso: node scripts/matriz.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './matriz';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
/** a conta refeita é a mesma, na mesma ordem: a diferença esperada é zero */
const TOLERANCIA = 1e-6;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// o conferente entra antes do jogo e se pendura no render assim que ele existe
await page.addInitScript(() => {
  const estado = { conferencias: 0, objetos: 0, pior: 0, onde: '' };
  window.__matriz = estado;

  const caminho = (o) => {
    const nomes = [];
    for (let n = o; n; n = n.parent) nomes.push(n.name || n.type);
    return nomes.reverse().join(' > ');
  };

  const conferir = (cena) => {
    const Matrix4 = cena.matrix.constructor;
    const pilha = [[cena, null]];
    while (pilha.length) {
      const [o, mundoDoPai] = pilha.pop();
      const local = o.matrixAutoUpdate
        ? new Matrix4().compose(o.position, o.quaternion, o.scale)
        : o.matrix;
      const mundo = mundoDoPai ? new Matrix4().multiplyMatrices(mundoDoPai, local) : local.clone();
      const a = mundo.elements;
      const b = o.matrixWorld.elements;
      let erro = 0;
      for (let i = 0; i < 16; i++) erro = Math.max(erro, Math.abs(a[i] - b[i]));
      estado.objetos++;
      if (erro > estado.pior) {
        estado.pior = erro;
        estado.onde = caminho(o);
      }
      for (const filho of o.children) pilha.push([filho, mundo]);
    }
    estado.conferencias++;
  };

  const instalar = () => {
    const g = window.jogo;
    if (!g) return void setTimeout(instalar, 30);
    const r = g.renderer;
    const original = r.render.bind(r);
    let frame = 0;
    r.render = (cena, camera) => {
      original(cena, camera);
      if (cena === g.scene && frame++ % 3 === 0) conferir(cena);
    };
  };
  instalar();
});

const falhas = [];
async function registrar(etapa) {
  const e = await page.evaluate(() => ({ ...window.__matriz }));
  const ok = e.conferencias > 0 && e.pior <= TOLERANCIA;
  console.log(
    `${ok ? 'ok   ' : 'FALHA'} ${etapa.padEnd(30)} ${String(e.conferencias).padStart(3)} conferências, ` +
      `${String(e.objetos).padStart(7)} objetos, pior diferença ${e.pior.toExponential(1)}` +
      (e.pior > TOLERANCIA ? `\n      em ${e.onde}` : ''),
  );
  if (!ok) falhas.push(etapa);
}

async function andar(teclas, ms) {
  for (const t of teclas) {
    await page.keyboard.down(t);
    await page.waitForTimeout(ms);
    await page.keyboard.up(t);
  }
}

// ------------------------------------------------- cada cena, andando nela
const cenas = [
  ['casa', ''],
  ['quarto', ''],
  ['villa-lobos', 'portao'],
  ['villa-lobos', 'roda'],
  ['clube', 'portaria'],
  ['clube', 'beira'],
  ['lojinha', ''],
  ['mania-de-churrasco', ''],
];
for (const [cena, entrada] of cenas) {
  await page.goto(`${BASE}/?cena=${cena}${entrada ? `&entrada=${entrada}` : ''}`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(1800);
  await andar(['KeyW', 'KeyA', 'KeyS', 'KeyD'], 700);
  await page.waitForTimeout(600);
  await registrar(`${cena}${entrada ? ' ' + entrada : ''}`);
}
await page.screenshot({ path: `${OUT}-andando.png` });

// ------------------------------------------------ sentar no sofá da casa
await page.goto(`${BASE}/?cena=casa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
await andar(['KeyW'], 950);
await page.waitForTimeout(800);
await page.keyboard.press('KeyE');
await page.waitForTimeout(1100);
await page.keyboard.press('KeyE'); // "Sim"
await page.waitForTimeout(2600);
await page.screenshot({ path: `${OUT}-sofa.png` });
await registrar('sofá');

// ------------------------------- o frisbee: da mão, pelo ar, e de volta
await page.goto(`${BASE}/?cena=villa-lobos&entrada=portao&em=18,-4.5&olhar=0.785`, {
  waitUntil: 'networkidle',
});
await page.waitForTimeout(2800);
await page.keyboard.press('KeyI');
await page.waitForTimeout(600);
const vaga = await page.evaluate(() => window.jogo.handItems().findIndex((i) => i?.id === 'frisbee'));
if (vaga >= 0) await page.locator('.mochila .maos .slot').nth(vaga).click();
await page.waitForTimeout(400);
await page.keyboard.press('KeyI');
await page.waitForTimeout(500);
await page.keyboard.down('KeyF');
await page.waitForTimeout(120);
await page.keyboard.up('KeyF');
let voltou = false;
for (let k = 0; k < 40 && !voltou; k++) {
  await page.waitForTimeout(500);
  voltou = await page.evaluate(() => window.jogo.getActiveHandItem()?.id === 'frisbee');
}
await page.screenshot({ path: `${OUT}-frisbee.png` });
await registrar(`frisbee (${voltou ? 'voltou à mão' : 'não voltou'})`);

console.log(erros.length ? 'ERROS:\n' + erros.slice(0, 10).join('\n') : 'sem erros de console');
await browser.close();
process.exit(falhas.length || erros.length ? 1 : 0);
