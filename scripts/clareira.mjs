/**
 * A CLAREIRA ATRÁS DO LAGO — a etapa A do acampamento (`docs/ACAMPAMENTO.md`).
 *
 * Ele MEDE e fotografa:
 *
 * - a clareira foi aberta no bosque SEM mexer no sorteio: nenhuma árvore do
 *   espalhador dentro dela nem na janela da câmera (a diagonal `+X/+Z`), e o
 *   arco de árvores plantado em volta;
 * - a trilha da margem do lago até a clareira é andável (nenhum colisor em
 *   cima dela, com o raio do jogador);
 * - chegar na clareira pela primeira vez dispara a conversa e a memória;
 * - ENTRAR NA BARRACA: os dois deitados nos colchões (filhos da âncora), o
 *   `teto` some e a câmera olha de cima; o beijinho solta corações, os
 *   abraçadinhos aproximam os dois, e sair devolve o teto, a câmera e a dupla
 *   na frente da porta — com a memória no diário;
 * - sentar na canga e olhar o fogareiro;
 * - fotos: de longe, de perto, com a câmera girada, a barraca de dentro, os
 *   dois na canga e o fogareiro de perto.
 *
 * Uso: node scripts/clareira.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './clareira';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
const falhas = [];
const checar = (ok, msg) => { if (!ok) falhas.push(msg); };
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const irPara = (x, z, f = 0) => page.evaluate(([px, pz, ff]) => window.jogo.debugPlace(px, pz, ff), [x, z, f]);

/** passa as falas até aparecer uma escolha (ou acabar) */
const passarFalas = async (quieto = 5) => {
  let parado = 0;
  for (let i = 0; i < 120 && parado < quieto; i++) {
    if (await page.locator('.escolhas.show button').count()) return true;
    if (await page.locator('.dialogue.show').count()) {
      parado = 0;
      await page.keyboard.press('KeyE');
    } else {
      parado += 1;
    }
    await page.waitForTimeout(350);
  }
  return false;
};
const escolher = async (texto) => {
  for (let i = 0; i < 60 && !(await page.locator('.escolhas.show button').count()); i++) await page.waitForTimeout(250);
  await page.locator('.escolhas.show button', { hasText: texto }).first().click();
  await page.waitForTimeout(450);
};
/** o gancho de teste da cena: a barraca guarda os pontos e as âncoras */
const pontos = () => page.evaluate(() => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') t = o.userData.teste; });
  return t && {
    CLAREIRA: t.CLAREIRA, TENDA: t.TENDA, PORTA: t.PORTA, NA_CANGA: t.NA_CANGA, NO_FOGAREIRO: t.NO_FOGAREIRO,
  };
});
const ate = async (regex, x, z, f = 0) => {
  for (let i = 0; i < 20; i++) {
    await irPara(x, z, f);
    await page.waitForTimeout(350);
    if (regex.test((await prompt()) ?? '')) return true;
  }
  return false;
};

// ============================================== 1. a chegada (save sem a flag)
await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ flags: {} })), SAVE);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });
await page.waitForTimeout(1500);
await page.mouse.click(500, 440);
const P = await pontos();
checar(!!P, 'a barraca nao tem o gancho de teste');
await irPara(-31.2, 15.6, -1.4);
await page.waitForTimeout(800);
await irPara(P.CLAREIRA.x + 1.2, P.CLAREIRA.z + 1.4, -2.4);
for (let i = 0; i < 30 && !(await page.locator('.dialogue.show').count()); i++) await page.waitForTimeout(300);
// a fala aparece letra por letra: lê depois de ela terminar de escrever
await page.waitForTimeout(2200);
const chegada = await page.locator('.dialogue .text').textContent().catch(() => '');
await passarFalas();
let s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
const memoriaDaChegada = (s.memories ?? []).some((m) => m.id === 'clareira-atras-do-lago');

// ========================================================= 2. a planta medida
const planta = await page.evaluate((P) => {
  const w = window.jogo.current.world;
  const CL = P.CLAREIRA;
  const dentro = [];
  const naJanela = [];
  const noArco = [];
  for (const o of w.root.children) {
    if (o.userData?.peca !== 'arvore') continue;
    const dx = o.position.x - CL.x;
    const dz = o.position.z - CL.z;
    const d = Math.hypot(dx, dz);
    if (d < CL.raio) dentro.push([+o.position.x.toFixed(1), +o.position.z.toFixed(1)]);
    const adiante = (dx + dz) / Math.SQRT2;
    const deLado = Math.abs(dx - dz) / Math.SQRT2;
    if (adiante > 0 && adiante < 9 && deLado < 3.4) naJanela.push([+o.position.x.toFixed(1), +o.position.z.toFixed(1)]);
    if (d >= CL.raio && d < CL.raio + 2) noArco.push(1);
  }
  // a trilha: da margem do lago até o meio da clareira, com o raio do jogador
  const colisores = w.colisoresAgora();
  const RAIO = 0.42;
  const bate = (x, z) => colisores.some((c) => {
    if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < c.r + RAIO;
    const cs = Math.cos(-c.rot);
    const sn = Math.sin(-c.rot);
    const lx = (x - c.x) * cs - (z - c.z) * sn;
    const lz = (x - c.x) * sn + (z - c.z) * cs;
    return Math.abs(lx) < c.hw + RAIO && Math.abs(lz) < c.hd + RAIO;
  });
  const caminho = [[-30.9, 15.6], [-32.2, 15.4], [-33.4, 14.9], [-34.6, 14.3], [-35.6, 13.9], [CL.x + 1.0, CL.z + 1.2]];
  const presos = [];
  for (let i = 0; i < caminho.length - 1; i++) {
    for (let k = 0; k <= 10; k++) {
      const x = caminho[i][0] + (caminho[i + 1][0] - caminho[i][0]) * (k / 10);
      const z = caminho[i][1] + (caminho[i + 1][1] - caminho[i][1]) * (k / 10);
      if (bate(x, z)) presos.push([+x.toFixed(2), +z.toFixed(2)]);
    }
  }
  // a barraca: o colisor cobre a barraca (o ponto do fundo dela está dentro)
  const T = P.TENDA;
  const fundo = { x: T.x - 0.9, z: T.z - 0.9 };
  const pontosDaClareira = w.interactables.filter((p) => p.id.startsWith('clareira:')).map((p) => p.id);
  return { dentro, naJanela, noArco: noArco.length, presos, fundoBloqueado: bate(fundo.x, fundo.z), pontosDaClareira };
}, P);

// ================================================================ 3. fotos
const foto = async (nome, x, z, zoom, giro = 0.8) => {
  await irPara(x, z, giro);
  await page.evaluate((zm) => { window.jogo.focusCamera(null); window.jogo.setZoom(zm); }, zoom);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
};
await foto('longe', P.CLAREIRA.x + 2.2, P.CLAREIRA.z + 2.4, 16);
await foto('perto', P.CLAREIRA.x + 1.7, P.CLAREIRA.z + 1.5, 6.5);
await page.keyboard.press('KeyQ');
await page.waitForTimeout(900);
await foto('girada', P.CLAREIRA.x + 1.7, P.CLAREIRA.z + 1.5, 9);
await page.keyboard.press('KeyR');
await page.waitForTimeout(900);
// o fogareiro e as mochilas de perto
await page.evaluate(() => {
  let mesa = null;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'mesinha-dobravel') mesa = o; });
  window.jogo.focusCamera(mesa);
  window.jogo.setZoom(2.4);
});
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-fogareiro.png` });
await page.evaluate(() => window.jogo.focusCamera(null));

// ========================================================= 4. entrar na barraca
const promptDaPorta = await ate(/entrar na barraca/i, P.PORTA.x, P.PORTA.z, Math.PI + Math.PI / 4);
await page.keyboard.press('KeyE');
await escolher('Entrar');
await passarFalas();
const deitados = await page.evaluate(() => {
  const j = window.jogo;
  let t = null;
  j.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') t = o.userData.teste; });
  return {
    tetoVisivel: t.teto.visible,
    euNaAncora: j.player.object.parent === t.deitados,
    eleNaAncora: j.parceiro.object.parent === t.deitados,
    lados: [+j.player.object.position.x.toFixed(2), +j.parceiro.object.position.x.toFixed(2)],
  };
});
await page.screenshot({ path: `${OUT}-dentro.png` });
const coracoesAntes = await page.evaluate(() => window.jogo.scene.children.length);
await escolher('Dar um beijinho');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-beijinho.png` });
await passarFalas();
await escolher('Ficar abraçadinhos');
await passarFalas();
const abracados = await page.evaluate(() => [+window.jogo.player.object.position.x.toFixed(2), +window.jogo.parceiro.object.position.x.toFixed(2)]);
await page.screenshot({ path: `${OUT}-abracadinhos.png` });
await passarFalas();
await escolher('Sair da barraca');
await passarFalas();
await page.waitForTimeout(800);
const saiu = await page.evaluate(() => {
  const j = window.jogo;
  let t = null;
  j.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') t = o.userData.teste; });
  const eu = j.playerPosition();
  return {
    tetoVisivel: t.teto.visible,
    solto: j.player.object.parent !== t.deitados,
    daPorta: +Math.hypot(eu.x - t.PORTA.x, eu.z - t.PORTA.z).toFixed(2),
  };
});
s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
const memoriaDaBarraca = (s.memories ?? []).some((m) => m.id === 'barraca-a-dois');

// =================================================== 5. a canga e o fogareiro
const promptDaCanga = await ate(/sentar na canga/i, P.NA_CANGA.x, P.NA_CANGA.z, Math.PI + Math.PI / 4);
await page.keyboard.press('KeyE');
await passarFalas();
const sentados = await page.evaluate(() => [window.jogo.player.object.position.y, window.jogo.parceiro.object.position.y].map((y) => +y.toFixed(2)));
await page.screenshot({ path: `${OUT}-canga.png` });
await escolher('Levantar');
await passarFalas();
const promptDoFogareiro = await ate(/fogareiro/i, P.NO_FOGAREIRO.x, P.NO_FOGAREIRO.z, Math.PI + Math.PI / 4);
await page.keyboard.press('KeyE');
const falaDoFogareiro = await (async () => {
  for (let i = 0; i < 20 && !(await page.locator('.dialogue.show').count()); i++) await page.waitForTimeout(250);
  await page.waitForTimeout(2200);
  return page.locator('.dialogue .text').textContent().catch(() => '');
})();
await passarFalas();

// ======================================================================= laudo
checar(/^Olha/.test(chegada ?? ''), `chegar na clareira devia abrir a conversa ("Olha isso…"): "${chegada}"`);
checar(memoriaDaChegada, 'a memoria da clareira nao entrou no diario');
checar(planta.dentro.length === 0, `arvore do sorteio dentro da clareira: ${JSON.stringify(planta.dentro)}`);
checar(planta.naJanela.length === 0, `arvore na janela da camera: ${JSON.stringify(planta.naJanela)}`);
checar(planta.noArco >= 10, `o arco de arvores em volta devia ter pelo menos 10: ${planta.noArco}`);
checar(planta.presos.length === 0, `a trilha tem colisor no caminho: ${JSON.stringify(planta.presos)}`);
checar(planta.fundoBloqueado, 'o colisor da barraca nao cobre o fundo dela');
checar(['clareira:barraca', 'clareira:canga', 'clareira:fogareiro'].every((id) => planta.pontosDaClareira.includes(id)), `faltam pontos: ${JSON.stringify(planta.pontosDaClareira)}`);
checar(promptDaPorta, 'o prompt de entrar na barraca nao apareceu na porta');
checar(!deitados.tetoVisivel && deitados.euNaAncora && deitados.eleNaAncora, `dentro: o teto devia sumir e os dois deitar na ancora: ${JSON.stringify(deitados)}`);
checar(Math.abs(deitados.lados[0] - deitados.lados[1]) > 0.6, `cada um no seu colchao: ${JSON.stringify(deitados.lados)}`);
checar(Math.abs(abracados[0] - abracados[1]) < 0.45, `abracadinhos, os dois mais perto: ${JSON.stringify(abracados)}`);
checar(saiu.tetoVisivel && saiu.solto && saiu.daPorta < 1.2, `sair devolve o teto e poe a dupla na porta: ${JSON.stringify(saiu)}`);
checar(memoriaDaBarraca, 'a memoria da barraca nao entrou no diario');
checar(promptDaCanga, 'o prompt da canga nao apareceu');
checar(sentados.every((y) => y < 0), `na canga, sentados no chao (a ancora desce): ${JSON.stringify(sentados)}`);
checar(promptDoFogareiro && /^Fogar/.test(falaDoFogareiro ?? ''), `o fogareiro: prompt ${promptDoFogareiro}, fala "${falaDoFogareiro}"`);
falhas.push(...erros);

console.log('1. chegada:', JSON.stringify(chegada), '· memoria', memoriaDaChegada);
console.log('2. planta:', JSON.stringify(planta));
console.log('4. dentro:', JSON.stringify(deitados), '· abracados', JSON.stringify(abracados), '· saiu', JSON.stringify(saiu), '· coracoes', coracoesAntes);
console.log('5. canga:', JSON.stringify(sentados), '· fogareiro', JSON.stringify(falaDoFogareiro));
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
