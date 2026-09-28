/**
 * A máquina de lanches da escola, e a mesa do refeitório.
 *
 * O que este teste guarda:
 * - comprar cobra R$ 3 e o lanche CAI DE VERDADE: sai da prateleira (o
 *   pacote dela some), desce até a gaveta e deita — a altura é medida quadro
 *   a quadro, não fotografada;
 * - com ele na gaveta, o prompt vira "Pegar o …"; pegar põe na mochila e a
 *   prateleira repõe o pacote;
 * - com o lanche na mão e nada por perto, o prompt é "Comer o …" (ou "Beber o
 *   …"); o E come: o braço leva à boca e o item sai da mochila;
 * - se os dois já têm os quatro lanches, a máquina não cobra;
 * - a sala de descanso tem a mesma máquina;
 * - sentados à mesa do refeitório, os dois ficam cada um num banco, de frente
 *   para o meio da mesa — e, portanto, um de frente para o outro.
 *
 * Uso: node scripts/lanche.mjs /tmp/la
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './lanche';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com `scenes/escola.ts`: a primeira máquina e a primeira mesa */
const MAQUINA = { x: -37.5, z: -9.8 };
const MESA = { x: -31, z: -7.4 };
const LANCHES = ['lanche-biscoito', 'lanche-chocolate', 'lanche-suco', 'lanche-salgadinho'];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 780 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  const t = m.text();
  const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
  if (m.type() === 'error' && !ruido.some((r) => t.includes(r))) erros.push(t);
});

const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};
const prompt = () => page.locator('.prompt.show .label').textContent({ timeout: 500 }).catch(() => null);
const esperarPrompt = async (re, max = 60) => {
  for (let i = 0; i < max; i++) {
    const p = await prompt();
    if (p && re.test(p)) return p;
    await page.waitForTimeout(250);
  }
  return await prompt();
};

/** o lanche que está caindo (filho da máquina) e o pacote escondido */
const naMaquina = () =>
  page.evaluate(() => {
    const w = window.jogo.current.world;
    let lanche = null;
    let escondidos = 0;
    w.root.traverse((o) => {
      if (o.userData?.item?.startsWith?.('lanche-') && o.parent?.userData?.peca === 'maquina-de-lanches') lanche = o;
      if (/^pacote-/.test(o.name) && !o.visible) escondidos++;
    });
    return lanche ? { y: lanche.position.y, rotX: lanche.rotation.x, item: lanche.userData.item, escondidos } : { escondidos };
  });

const mochila = () =>
  page.evaluate(() => ({
    eu: window.jogo.handItems().map((i) => i?.id ?? null),
    par: window.jogo.handItems(window.jogo.companionId()).map((i) => i?.id ?? null),
    carteira: window.jogo.carteira(),
    naMao: window.jogo.getActiveHandItem()?.id ?? null,
  }));

// ------------------------------------------------------------ a compra
await page.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=escola&em=${MAQUINA.x},${MAQUINA.z}&olhar=-1.57`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.evaluate(() => window.jogo.ganhar(20));
const antes = await mochila();
conferir((await esperarPrompt(/Comprar/)) !== null, 'na frente da máquina, o prompt é o de comprar', await prompt());
await page.keyboard.press('KeyE');
await page.waitForTimeout(300);

const alturas = [];
let noFim = null;
for (let i = 0; i < 80; i++) {
  const m = await naMaquina();
  if (m.y !== undefined) alturas.push(m.y);
  const p = await prompt();
  if (p && /^Pegar/.test(p)) {
    noFim = { ...m, prompt: p };
    break;
  }
  await page.waitForTimeout(150);
}
const depoisDePagar = await mochila();
conferir(antes.carteira - depoisDePagar.carteira === 3, 'comprar cobra R$ 3', `${antes.carteira} → ${depoisDePagar.carteira}`);
conferir(alturas.length > 3 && Math.max(...alturas) > 0.5, 'o lanche nasce lá em cima, na prateleira', `começou em ${alturas[0]?.toFixed(2)}`);
conferir(noFim && noFim.y < 0.25 && noFim.y > 0.1, 'e cai até a gaveta', noFim ? `parou em ${noFim.y.toFixed(2)}` : 'não chegou');
conferir(noFim && noFim.escondidos === 1, 'o pacote da prateleira sumiu enquanto ele cai');
conferir(noFim && /^Pegar o /.test(noFim.prompt), 'na gaveta, o prompt vira "Pegar o …"', noFim?.prompt ?? '');
await page.evaluate(() => {
  let m = null;
  window.jogo.current.world.root.traverse((o) => {
    if (!m && o.userData?.peca === 'maquina-de-lanches') m = o;
  });
  window.jogo.focusCamera(m);
  window.jogo.setZoom(3);
});
for (let i = 0; i < 40 && (await page.evaluate(() => window.jogo.iso.currentViewSize)) > 3.3; i++) await page.waitForTimeout(250);
await page.screenshot({ path: `${OUT}-na-gaveta.png` });
await page.evaluate(() => {
  window.jogo.focusCamera(null);
  window.jogo.setZoom(13);
});

await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const pegou = await mochila();
const qual = noFim?.item;
conferir(pegou.eu.includes(qual) || pegou.par.includes(qual), 'pegar põe o lanche na mochila', `${qual} → ${JSON.stringify(pegou.eu)}`);
const reposto = await naMaquina();
conferir(reposto.y === undefined && reposto.escondidos === 0, 'a gaveta esvazia e a prateleira repõe o pacote');
conferir(/Comprar/.test((await prompt()) ?? ''), 'e a máquina volta a vender', (await prompt()) ?? '');

// ------------------------------------------------------------- comer
// o lanche na mão, longe de qualquer interativo (o corredor entre as mesas)
await page.evaluate((id) => {
  const i = window.jogo.handItems().findIndex((x) => x?.id === id);
  if (i >= 0) window.jogo.setActiveHandSlot(i);
  window.jogo.debugPlace(-27, 0, 1.57);
}, qual);
const rotuloDeComer = await esperarPrompt(/^(Comer|Beber) o /, 20);
conferir(/^(Comer|Beber) o /.test(rotuloDeComer ?? ''), 'com o lanche na mão, o prompt é o de comer', rotuloDeComer ?? '(nenhum)');
await page.keyboard.press('KeyE');
await page.waitForTimeout(400);
const saboreando = await page.evaluate(() => window.jogo.player.rig.estaMordendo);
await page.evaluate(() => {
  window.jogo.focusCamera(window.jogo.player.object);
  window.jogo.setZoom(3.5);
});
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-comendo.png` });
conferir(saboreando, 'comendo, o braço leva o lanche à boca');
let comeu = false;
for (let i = 0; i < 40 && !comeu; i++) {
  await page.waitForTimeout(250);
  comeu = !(await page.evaluate((id) => window.jogo.hasItem(id), qual));
}
const avisos = await page.locator('.toast').allTextContents();
conferir(comeu, 'e o lanche sai da mochila');
conferir(avisos.some((a) => /comeu|bebeu/.test(a)), 'o aviso diz quem comeu', avisos.filter((a) => /comeu|bebeu/.test(a)).join(' | '));
await page.evaluate(() => {
  window.jogo.focusCamera(null);
  window.jogo.setZoom(13);
});

// ------------------------------------ os dois já têm tudo: a máquina não cobra
await page.evaluate((ids) => {
  const porId = window.aristoryItens;
  for (const quem of [window.jogo.playerId(), window.jogo.companionId()]) {
    for (const id of ids) if (!window.jogo.hasItem(id, quem)) window.jogo.addItem(porId[id], quem);
  }
  window.jogo.debugPlace(-37.5, -9.8, -1.57);
}, LANCHES);
await esperarPrompt(/Comprar/, 20);
const antesDeRecusar = (await mochila()).carteira;
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const recusa = await page.locator('.dialogue .text').textContent().catch(() => '');
for (let i = 0; i < 6 && (await page.locator('.dialogue.show').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(600);
}
conferir((await mochila()).carteira === antesDeRecusar, 'com os quatro lanches nas duas mochilas, a máquina não cobra', recusa ?? '');

// ---------------------------------------------------- a sala de descanso
await page.evaluate(() => {
  for (const quem of [window.jogo.playerId(), window.jogo.companionId()]) {
    for (const id of ['lanche-biscoito', 'lanche-chocolate', 'lanche-suco', 'lanche-salgadinho']) window.jogo.removeItem(id, quem);
  }
});
await page.goto(`${BASE}/?cena=escola-descanso`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
const noDescanso = await page.evaluate(() => {
  const i = window.jogo.current.world.interactables.find((p) => p.id === 'descanso:lanches');
  return { x: i.x, z: i.z };
});
await page.evaluate(([p]) => window.jogo.debugPlace(p.x + 0.2, p.z, -1.57), [noDescanso]);
await esperarPrompt(/Comprar/, 20);
await page.keyboard.press('KeyE');
const pegarNoDescanso = await esperarPrompt(/^Pegar o /, 80);
conferir(/^Pegar o /.test(pegarNoDescanso ?? ''), 'na sala de descanso a máquina também entrega', pegarNoDescanso ?? '');

// ------------------------------------------------------- a mesa do refeitório
await page.goto(`${BASE}/?cena=escola&em=${MESA.x},${MESA.z + 1.6}&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await esperarPrompt(/Sentar à mesa/, 20);
await page.keyboard.press('KeyE');
await page.waitForTimeout(2200);
const sentados = await page.evaluate(([M]) => {
  const j = window.jogo;
  const eu = j.playerPosition();
  const par = j.companionPosition();
  const fe = j.playerFacing();
  const fp = j.companionFacing();
  // o quanto cada um olha para o meio da mesa (1 = de frente, -1 = de costas)
  const paraOMeio = (p, f) => {
    const dx = M.x - p.x;
    const dz = M.z - p.z;
    const d = Math.hypot(dx, dz) || 1;
    return (Math.sin(f) * dx + Math.cos(f) * dz) / d;
  };
  return {
    eu: +paraOMeio(eu, fe).toFixed(2),
    par: +paraOMeio(par, fp).toFixed(2),
    ladosOpostos: Math.sign(eu.z - M.z) !== Math.sign(par.z - M.z),
  };
}, [MESA]);
await page.screenshot({ path: `${OUT}-mesa.png` });
conferir(sentados.ladosOpostos, 'na mesa, cada um num banco');
conferir(sentados.eu > 0.8 && sentados.par > 0.8, 'os dois olham para o meio da mesa, um de frente para o outro', `jogador ${sentados.eu} · parceiro ${sentados.par}`);
for (let i = 0; i < 12; i++) {
  if (await page.locator('.escolhas.show button').count()) {
    const opcoes = await page.locator('.escolhas.show button').allTextContents();
    await page.locator('.escolhas.show button').nth(opcoes.findIndex((o) => /Levantar/.test(o))).click();
    break;
  }
  if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(600);
}
await page.waitForTimeout(1200);
const levantou = await page.evaluate(() => !window.jogo.player.locked);
conferir(levantou, 'e levantam livres');

console.log(erros.length ? 'ERROS:\n' + erros.slice(0, 10).join('\n') : 'sem erros de console');
console.log(falhas.length ? `\n${falhas.length} FALHA(S)` : '\ntudo certo');
await browser.close();
process.exit(falhas.length || erros.length ? 1 : 0);
