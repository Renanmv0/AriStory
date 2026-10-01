/**
 * O FLYNN, a raposa presidente da atlética dos Gatitos, no refeitório da
 * escola (pedido do Renan). Mede, e não só fotografa:
 *
 * 1. O PASSEIO: ele anda de verdade (a trilha soma distância), nunca sai do
 *    corredor entre as mesas nem entra numa mesa, o ponto de conversa anda
 *    em cima dele, e o colisor também;
 * 2. O MODELO: os pés no chão (nada abaixo de 2 cm do piso), a altura certa
 *    (a cabeça abaixo da do Ari, as orelhas passando dela), e os acessórios
 *    todos no corpo — a bandana, o apito, a braçadeira de capitão;
 * 3. OS GESTOS: o aceno sobe a pata direita, a comemoração pula;
 * 4. A CONVERSA: a apresentação inteira, a flag, a memória, o apito, e na
 *    segunda vez uma conversa de esporte;
 * 5. AS FOTOS DE PERTO: de frente, de três quartos, de lado, de costas, o
 *    rosto, acenando e comemorando, e de longe, no refeitório.
 *
 *   node scripts/flynn.mjs /tmp/fl
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/fl';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const erros = [];
const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};
const FLAGS = ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'escola-visitada'];
// as mesas do refeitório (o meio) e a meia-medida delas, como em `escola.ts`
const MESAS = [[-31, -7.4], [-22.5, -7.4], [-31, -3.6], [-22.5, -3.6], [-31, 3.6], [-22.5, 3.6], [-31, 7.4], [-22.5, 7.4]];

const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
p.on('console', (m) => {
  if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
});
const pronto = () => p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
await pronto();
await p.evaluate((flags) => { for (const f of flags) window.jogo.setFlag(f); }, FLAGS);
await p.goto(`${BASE}/?cena=escola&em=-21,0`, { waitUntil: 'networkidle' });
await pronto();
await p.mouse.click(550, 300);
await p.waitForTimeout(1000);

/** onde ele está, e o ponto de conversa e o colisor */
const flynn = () => p.evaluate(() => {
  const j = window.jogo;
  let f = null;
  j.current.world.root.traverse((o) => { if (!f && o.userData?.teste?.flynn) f = o.userData.teste.flynn; });
  if (!f) return null;
  const pt = j.current.world.interactables?.find?.((i) => i.id === 'escola:flynn');
  const col = j.current.world.colliders?.find?.((c) => c.kind === 'circle' && Math.abs(c.r - 0.38) < 1e-6);
  return {
    x: f.x, z: f.z, estado: f.estado,
    ponto: pt ? { x: pt.x, z: pt.z } : null,
    colisor: col ? { x: col.x, z: col.z } : null,
  };
});

// ============================================================ 1. o passeio
console.log('\n1. o passeio pelo refeitório');
let antes = await flynn();
conferir(!!antes, 'o Flynn está no refeitório', JSON.stringify(antes));
let trilha = 0;
let foraDaArea = 0;
let naMesa = 0;
let pontoLonge = 0;
for (let i = 0; i < 70; i++) {
  await p.waitForTimeout(400);
  const f = await flynn();
  trilha += Math.hypot(f.x - antes.x, f.z - antes.z);
  antes = f;
  if (f.x < -28.65 || f.x > -24.85 || f.z < -9.05 || f.z > 8.55) foraDaArea += 1;
  if (MESAS.some(([mx, mz]) => Math.abs(f.x - mx) < 1.72 && Math.abs(f.z - mz) < 0.95)) naMesa += 1;
  const dp = f.ponto ? Math.hypot(f.ponto.x - f.x, f.ponto.z - f.z) : 99;
  const dc = f.colisor ? Math.hypot(f.colisor.x - f.x, f.colisor.z - f.z) : 99;
  if (dp > 0.05 || dc > 0.05) pontoLonge += 1;
}
conferir(trilha > 1.5, `ele anda de verdade (${trilha.toFixed(2)} de trilha)`);
conferir(foraDaArea === 0 && naMesa === 0, `nunca sai do corredor entre as mesas nem entra numa (${foraDaArea}, ${naMesa})`);
conferir(pontoLonge === 0, 'o ponto de conversa e o colisor andam em cima dele', String(pontoLonge));

// ============================================================ 2. o modelo
console.log('\n2. o modelo');
const parar = (x, z, rot) => p.evaluate(([x, z, rot]) => {
  let f = null;
  window.jogo.current.world.root.traverse((o) => { if (!f && o.userData?.teste?.flynn) f = o.userData.teste.flynn; });
  f.entrarEmServico();
  f.group.position.set(x, 0, z);
  f.group.rotation.y = rot;
}, [x, z, rot]);
await parar(-26.7, 1.6, Math.PI / 4);
await p.waitForTimeout(600);
const medidas = await p.evaluate(() => {
  const j = window.jogo;
  let g = null;
  j.current.world.root.traverse((o) => { if (!g && o.userData?.teste?.flynn) g = o; });
  g.updateWorldMatrix(true, true);
  const V = g.position.constructor;
  const v = new V();
  let min = Infinity;
  let max = -Infinity;
  let maxCabeca = -Infinity;
  const nomes = new Set();
  g.traverse((o) => {
    if (o.name) nomes.add(o.name);
    const pos = o.geometry?.attributes?.position;
    if (!pos || !o.visible) return;
    let naCabeca = false;
    for (let p = o; p; p = p.parent) if (p.name === 'cabeca-do-flynn') naCabeca = true;
    for (let i = 0; i < pos.count; i += 3) {
      v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      min = Math.min(min, v.y);
      max = Math.max(max, v.y);
      if (naCabeca) maxCabeca = Math.max(maxCabeca, v.y);
    }
  });
  let cabecaY = 0;
  g.traverse((o) => { if (o.name === 'cabeca-do-flynn') cabecaY = o.getWorldPosition(new V()).y; });
  const ari = j.player.rig.head.getWorldPosition(new V()).y;
  return { min, max, cabecaY, ari, nomes: [...nomes] };
});
console.log(`      piso ${medidas.min.toFixed(3)} · topo ${medidas.max.toFixed(2)} · cabeça ${medidas.cabecaY.toFixed(2)} · cabeça do Ari ${medidas.ari.toFixed(2)}`);
conferir(medidas.min > -0.02 && medidas.min < 0.03, `os pés no chão (${medidas.min.toFixed(3)})`);
conferir(medidas.cabecaY < medidas.ari && medidas.max > medidas.ari - 0.15, 'a cabeça abaixo da do Ari, as orelhas chegando perto dela');
conferir(['bandana-dos-gatitos', 'apito', 'bracadeira-de-capitao'].every((n) => medidas.nomes.includes(n)),
  'a bandana, o apito e a braçadeira de capitão no corpo');

// fotos de perto: a câmera num ponto dele, e a foto recortada em volta (o zoom tem piso)
const dePerto = async (altura, nome, w = 300, h = 360) => {
  await p.evaluate((altura) => {
    const j = window.jogo;
    let g = null;
    j.current.world.root.traverse((o) => { if (!g && o.userData?.teste?.flynn) g = o; });
    const foco = new g.constructor();
    g.getWorldPosition(foco.position);
    foco.position.y += altura;
    j.current.world.root.add(foco);
    j.focusCamera(foco);
    j.setZoom(0.6);
    window.__foco = foco;
  }, altura);
  await p.waitForTimeout(2600);
  const c = await p.evaluate(() => {
    const v = window.__foco.position.clone().project(window.jogo.iso.camera);
    return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight };
  });
  await p.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: Math.max(0, c.x - w / 2), y: Math.max(0, c.y - h / 2), width: w, height: h } });
  await p.evaluate(() => { window.jogo.focusCamera(null); window.__foco.removeFromParent(); });
};
// a dupla sai de perto, para não entrar na foto
await p.evaluate(() => window.jogo.debugPlace(-20, 6, 0));
await p.waitForTimeout(500);
for (const [rot, nome] of [[Math.PI / 4, 'frente'], [0, 'tres-quartos'], [-Math.PI / 4, 'lado'], [-3 * Math.PI / 4, 'costas'], [Math.PI, 'costas-2']]) {
  await parar(-26.7, 1.6, rot);
  await dePerto(0.62, nome);
}
await parar(-26.7, 1.6, Math.PI / 4);
await dePerto(0.95, 'rosto', 260, 220);

// ============================================================ 3. os gestos
console.log('\n3. os gestos');
const gesto = (nome) => p.evaluate((nome) => {
  let f = null;
  window.jogo.current.world.root.traverse((o) => { if (!f && o.userData?.teste?.flynn) f = o.userData.teste.flynn; });
  f[nome](6);
}, nome);
const medir = () => p.evaluate(() => {
  let f = null;
  window.jogo.current.world.root.traverse((o) => { if (!f && o.userData?.teste?.flynn) f = o.userData.teste.flynn; });
  return { braco: f.bracoDireitoNoAlto, pulo: f.alturaDoPulo, acena: f.estaAcenando, comemora: f.estaComemorando };
});
await gesto('acenar');
let maiorBraco = 0;
for (let i = 0; i < 10; i++) {
  await p.waitForTimeout(200);
  maiorBraco = Math.max(maiorBraco, (await medir()).braco);
}
conferir(maiorBraco > 2.3, `o aceno sobe a pata direita (${maiorBraco.toFixed(2)} rad)`);
await dePerto(0.62, 'acenando');
await p.waitForTimeout(6000);
await gesto('comemorar');
let maiorPulo = 0;
for (let i = 0; i < 14; i++) {
  await p.waitForTimeout(150);
  maiorPulo = Math.max(maiorPulo, (await medir()).pulo);
}
conferir(maiorPulo > 0.03, `a comemoração pula (${maiorPulo.toFixed(3)})`);
await dePerto(0.62, 'comemorando');
await p.evaluate(() => {
  let f = null;
  window.jogo.current.world.root.traverse((o) => { if (!f && o.userData?.teste?.flynn) f = o.userData.teste.flynn; });
  f.voltarAPassear();
});

// ============================================================ 4. a conversa
console.log('\n4. a conversa');
const conversar = async (ate, max = 40) => {
  const falas = [];
  for (let i = 0; i < max && !(await ate()); i++) {
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(400);
      if (!(await p.locator('.dialogue.show').count()) && falas.length) break;
      continue;
    }
    await p.waitForTimeout(450);
    const quem = await p.evaluate(() => document.querySelector('.dialogue .who')?.textContent ?? '');
    const t = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (t && !falas.includes(`${quem}: ${t}`)) falas.push(`${quem}: ${t}`);
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(150);
  }
  return falas.filter((f, i) => !falas.slice(i + 1).some((g) => g.startsWith(f)));
};
const chegarPerto = async () => {
  const f = await flynn();
  await p.evaluate(({ x, z }) => window.jogo.debugPlace(x + 0.6, z + 0.9, Math.atan2(-0.6, -0.9)), f);
  for (let i = 0; i < 20; i++) {
    if (/Flynn/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) return true;
    await p.waitForTimeout(150);
  }
  return false;
};
conferir(await chegarPerto(), 'perto dele, o prompt é "Falar com o Flynn"');
const apitosAntes = await p.evaluate(() => window.jogo.audio.contagem.get('apito') ?? 0);
await p.keyboard.press('KeyE');
await p.waitForTimeout(700);
await p.screenshot({ path: `${OUT}-conversa.png` });
const apresentacao = await conversar(() => p.evaluate(() => window.jogo.flag('flynn-conhecido')), 60);
console.log('      ' + apresentacao.join('\n      '));
conferir(apresentacao.some((f) => /^Flynn: Eu sou o Flynn, presidente da Atlética dos Gatitos/.test(f)), 'ele se apresenta como presidente da atlética');
conferir(apresentacao.some((f) => /sem pressão nenhuma/.test(f)), 'e convida sem forçar');
await p.waitForTimeout(1200);
const depois = await p.evaluate(() => ({
  flag: window.jogo.flag('flynn-conhecido'),
  memoria: (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).some((m) => m.id === 'o-presidente-da-atletica'),
  apitos: window.jogo.audio.contagem.get('apito') ?? 0,
}));
conferir(depois.flag && depois.memoria, 'a flag e a memória "O presidente da atlética"');
conferir(depois.apitos > apitosAntes, 'o apito toca no fim da apresentação');
await p.waitForTimeout(1500);
conferir(await chegarPerto(), 'depois da conversa ele volta a passear, e dá para falar de novo');
await p.keyboard.press('KeyE');
await p.waitForTimeout(700);
const segunda = await conversar(async () => false, 20);
console.log('      ' + segunda.join('\n      '));
conferir(segunda.length > 0 && segunda.every((f) => !/presidente da Atlética/.test(f)), 'na segunda vez, uma conversa de esporte (sem se apresentar de novo)');

// ============================================================ 5. de longe
await p.waitForTimeout(1200);
await p.evaluate(() => { window.jogo.debugPlace(-22.6, 0.4, Math.PI / 2); window.jogo.setZoom(9); });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}-refeitorio.png` });

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
await browser.close();
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
process.exit(falhas.length ? 1 : 0);
