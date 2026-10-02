/**
 * O FLYNN TREINANDO NO GINÁSIO (pedido do Renan): do Módulo 2 em diante ele
 * sai do refeitório e vai para o meio da quadra — corre de uma ponta à outra,
 * pega a bola, arremessa na cesta, vira de costas e volta, bem rápido. As
 * coelhinhas saem do meio da quadra e ensaiam na lateral. Mede, e não só
 * fotografa:
 *
 * 1. ONDE ELE MORA: com o Módulo 1 feito e o 2 ainda não começado, no
 *    refeitório (e as três no meio da quadra); com a lição 7 aberta, no
 *    ginásio (e nenhum Flynn no refeitório);
 * 2. AS COELHINHAS NA LATERAL: as três fora da quadra, na faixa da frente;
 * 3. O TREINO: ele vai às duas pontas, corre mais rápido que a dupla, as
 *    bolas entram na cesta, voltam a descansar onde estavam, e a pegada dobra
 *    o tronco até a bola sem tirar os pés do chão;
 * 4. RESPEITOSO: com a dupla parada na raia dele, ele não atravessa ninguém;
 * 5. A CONVERSA: ele para (terminando o arremesso), conta do treino, e volta
 *    a treinar;
 * 6. AS FOTOS: correndo, pegando a bola, no alto do pulo, e o ginásio de longe.
 *
 *   node scripts/treino.mjs /tmp/tr
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/tr';
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
const M1 = ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho'];
const FLAGS = ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'escola-visitada', 'escola-ginasio', 'festa-da-torcida', 'flynn-conhecido'];
/** a raia dele e as pontas (as de `escolaGinasio.ts`) */
const RAIA_Z = 1.1;
/** o fundo da dobra (`ARREMESSO.PEGA` do Flynn) */
const ARREMESSO_PEGA = 0.42;
const PONTA_X = 7.7;

const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
p.on('console', (m) => {
  if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
});
const pronto = () => p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
const ir = async (cena, em = '') => {
  await p.goto(`${BASE}/?cena=${cena}${em ? `&em=${em}` : ''}`, { waitUntil: 'networkidle' });
  await pronto();
  await p.waitForTimeout(1200);
};
await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await ir('escola');
await p.evaluate(([flags, m1]) => {
  const j = window.jogo;
  for (const f of flags) j.setFlag(f);
  for (const id of m1) {
    j.save.abrirLicao(id);
    j.save.concluirLicao(id, 3);
  }
}, [FLAGS, M1]);

/** o Flynn da cena (e o gancho do treino, se for o do ginásio) */
const acharFlynn = () => p.evaluate(() => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.flynn) t = o.userData.teste; });
  if (!t) return null;
  return { x: t.flynn.x, z: t.flynn.z, treino: !!t.treino };
});
/** onde estão as coelhinhas */
const coelhas = () => p.evaluate(() => {
  const r = [];
  window.jogo.current.world.root.traverse((o) => {
    const t = o.userData?.teste;
    if (!t) return;
    for (const id of ['luna', 'sol', 'estrella']) if (t[id] && t[id].group === o) r.push({ id, x: t[id].x, z: t[id].z });
  });
  return r;
});

// ============================================================ 1. onde ele mora
console.log('\n1. onde ele mora');
await ir('escola', '-21,0');
const noRefeitorioAntes = await acharFlynn();
conferir(!!noRefeitorioAntes && !noRefeitorioAntes.treino, 'Módulo 1 feito, o 2 não começado: o Flynn ainda no refeitório');
await ir('escola-ginasio');
const ginasioAntes = await acharFlynn();
const meio = await coelhas();
conferir(!ginasioAntes, 'e nenhum Flynn no ginásio');
conferir(meio.length === 3 && meio.every((c) => c.z < 5.5), 'as três ainda na quadra', JSON.stringify(meio.map((c) => [c.id, +c.z.toFixed(1)])));

await p.evaluate(() => window.jogo.save.abrirLicao('um-dia-de-gatito'));
await ir('escola', '-21,0');
conferir(!(await acharFlynn()), 'com a lição 7 aberta, o refeitório fica sem o Flynn');
await ir('escola-ginasio');
const noGinasio = await acharFlynn();
conferir(!!noGinasio?.treino, 'e ele está no ginásio, treinando');

// ===================================================== 2. as coelhinhas na lateral
console.log('\n2. as coelhinhas na lateral');
const lateral = await coelhas();
console.log('      ' + lateral.map((c) => `${c.id} (${c.x.toFixed(1)}, ${c.z.toFixed(1)})`).join(' · '));
conferir(lateral.length === 3 && lateral.every((c) => c.z > 5.9 && c.z < 8.2), 'as três fora da quadra, na faixa da frente');

// ============================================================ 3. o treino
console.log('\n3. o treino');
await p.evaluate(() => window.jogo.debugPlace(10.5, 7.6, Math.PI));
await p.mouse.click(550, 300);
const treino = () => p.evaluate(() => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
  const f = t.flynn;
  return {
    x: f.x, z: f.z, fase: t.treino.fase, ponta: t.treino.ponta, cestas: t.treino.cestas,
    vel: t.treino.maiorVelocidade, dobra: f.dobraDaCintura, arremessando: f.estaArremessando,
    bolas: t.treino.bolas(),
  };
});
/** o ponto mais baixo da malha dele (os pés) */
const piso = () => p.evaluate(() => {
  let g = null;
  window.jogo.current.world.root.traverse((o) => { if (!g && o.userData?.teste?.treino) g = o; });
  g.updateWorldMatrix(true, true);
  const v = new g.position.constructor();
  let min = Infinity;
  g.traverse((o) => {
    const pos = o.geometry?.attributes?.position;
    if (!pos || !o.visible || o.userData?.peca === 'bola-de-basquete') return;
    for (let p = o; p; p = p.parent) if (p.userData?.peca === 'bola-de-basquete') return;
    for (let i = 0; i < pos.count; i += 3) min = Math.min(min, v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).y);
  });
  return min;
});
let minX = 0;
let maxX = 0;
let maiorDobra = 0;
let menorPiso = 1;
let viuNaMao = false;
let foraDaRaia = 0;
let fotoCorrendo = false;
let fotoPegando = false;
let fotoNoAlto = false;
/**
 * CONGELA o jogo (o menu "aberto", mas invisível: a simulação para e a câmera
 * continua indo até ele) e fotografa o meio da tela — a câmera está presa nele.
 * Sem isto a foto sai do quadro seguinte: o navegador do teste é lento, e um
 * screenshot leva uns 0,2 s de jogo.
 */
const congelar = (sim) => p.evaluate((sim) => {
  const m = window.jogo.ui.menu;
  m.style.visibility = sim ? 'hidden' : '';
  m.classList.toggle('show', sim);
}, sim);
const foto = async (nome) => {
  await congelar(true);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: 550 - 230, y: 400 - 210, width: 460, height: 360 } });
  await congelar(false);
};
const focar = (sim) => p.evaluate((sim) => {
  let g = null;
  window.jogo.current.world.root.traverse((o) => { if (!g && o.userData?.teste?.treino) g = o; });
  window.jogo.focusCamera(sim ? g : null);
  window.jogo.setZoom(sim ? 4.5 : 13);
}, sim);
await focar(true);
await p.waitForTimeout(3000);
const inicio = Date.now();
let t = await treino();
for (let i = 0; i < 2000 && (Date.now() - inicio < 360000); i++) {
  t = await treino();
  minX = Math.min(minX, t.x);
  maxX = Math.max(maxX, t.x);
  maiorDobra = Math.max(maiorDobra, t.dobra);
  if (Math.abs(t.z - RAIA_Z) > 0.05) foraDaRaia += 1;
  if (t.bolas.some((b) => b.fase === 'na-mao')) viuNaMao = true;
  if (t.dobra > 0.8) menorPiso = Math.min(menorPiso, await piso());
  if (!fotoCorrendo && t.fase === 'correndo' && Math.abs(t.x) < 3) {
    await foto('correndo');
    fotoCorrendo = true;
  }
  if (!fotoPegando && t.dobra > 1.0) {
    await foto('pegando');
    fotoPegando = true;
  }
  if (!fotoNoAlto && t.arremessando && t.bolas.some((b) => b.fase === 'na-mao' && b.y > 1.1)) {
    await foto('no-alto');
    fotoNoAlto = true;
  }
  if (t.cestas >= 3 && minX < -PONTA_X + 0.2 && maxX > PONTA_X - 0.2 && fotoCorrendo && fotoPegando && fotoNoAlto) break;
  await p.waitForTimeout(60);
}
console.log(`      x de ${minX.toFixed(2)} a ${maxX.toFixed(2)} · ${t.cestas} cestas · ${t.vel.toFixed(2)} m/s no pico · dobra ${maiorDobra.toFixed(2)} rad`);
conferir(minX < -PONTA_X + 0.2 && maxX > PONTA_X - 0.2, 'ele vai até as duas pontas da quadra');
conferir(foraDaRaia === 0, 'sempre na raia dele', String(foraDaRaia));
conferir(t.vel > 5.5, `corre bem mais rápido que a dupla (4,4): ${t.vel.toFixed(2)}`);
conferir(t.cestas >= 3, `as bolas entram na cesta (${t.cestas})`);
conferir(viuNaMao, 'a bola vai para a mão dele');
conferir(maiorDobra > 1.0, `dobra na cintura para pegar a bola (${maiorDobra.toFixed(2)})`);
conferir(menorPiso > -0.03 && menorPiso < 0.04, `os pés no chão na dobra (${menorPiso.toFixed(3)})`);
conferir(fotoCorrendo && fotoPegando && fotoNoAlto, 'as fotos: correndo, pegando, no alto do pulo');

await focar(false);
// as bolas voltam a descansar onde estavam: segura o treino (com nenhuma na mão) e espera
for (let i = 0; i < 200; i++) {
  t = await treino();
  if (!t.arremessando && t.bolas.every((b) => b.fase !== 'na-mao' && b.fase !== 'subindo')) break;
  await p.waitForTimeout(50);
}
await p.evaluate(() => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
  t.treino.ligar(false);
});
for (let i = 0; i < 60; i++) {
  t = await treino();
  if (t.bolas.every((b) => b.fase === 'parada')) break;
  await p.waitForTimeout(500);
}
conferir(t.bolas.every((b) => b.fase === 'parada' && Math.hypot(b.x - b.repouso.x, b.z - b.repouso.z) < 0.01 && Math.abs(b.y - 0.12) < 0.01),
  'as bolas voltam a descansar no lugar de onde ele as pega', JSON.stringify(t.bolas.map((b) => [b.fase, +b.x.toFixed(2), +b.z.toFixed(2)])));
// A POSE DE PERFIL: parado no meio, de lado para a câmera, o arremesso sem bola
await p.evaluate((z) => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
  t.flynn.group.position.set(0, 0, z);
  t.flynn.group.rotation.y = 3 * Math.PI / 4;
  window.jogo.debugPlace(-3, 5, 0);
}, RAIA_Z);
await focar(true);
await p.waitForTimeout(3000);
for (const [nome, ate] of [['perfil-pegando', ARREMESSO_PEGA], ['perfil-no-peito', 0.72], ['perfil-no-alto', 1.04]]) {
  // espera NA PÁGINA, quadro a quadro, e congela no instante certo
  await p.evaluate((ate) => new Promise((pronto) => {
    let t = null;
    window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
    t.flynn.arremessar();
    const m = window.jogo.ui.menu;
    const olhar = () => {
      if (t.flynn.tempoNoArremesso >= ate || !t.flynn.estaArremessando) {
        m.style.visibility = 'hidden';
        m.classList.add('show');
        pronto();
      } else requestAnimationFrame(olhar);
    };
    olhar();
  }), ate);
  await foto(nome);
  for (let i = 0; i < 400; i++) {
    const ainda = await p.evaluate(() => {
      let t = null;
      window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
      return t.flynn.estaArremessando;
    });
    if (!ainda) break;
    await p.waitForTimeout(50);
  }
}
await focar(false);
await p.evaluate(() => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
  t.treino.ligar(true);
});

// ============================================================ 4. respeitoso
console.log('\n4. respeitoso: a dupla parada na raia');
await p.evaluate((z) => window.jogo.debugPlace(1.5, z, Math.PI / 2), RAIA_Z);
let menor = 99;
/** quadros em que ELE avançou para cima de alguém já perto (o parceiro encostar nele parado não conta) */
let atropelos = 0;
let antes = null;
const pontas = new Set();
for (let i = 0; i < 120; i++) {
  const r = await p.evaluate(() => {
    let t = null;
    window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
    const j = window.jogo;
    const f = t.flynn;
    return { f: { x: f.x, z: f.z }, gente: [j.playerPosition(), j.companionPosition()].map((v) => ({ x: v.x, z: v.z })), ponta: t.treino.ponta };
  });
  for (const g of r.gente) {
    const d = Math.hypot(g.x - r.f.x, g.z - r.f.z);
    menor = Math.min(menor, d);
    if (antes && d < 0.9 && Math.hypot(r.f.x - antes.x, r.f.z - antes.z) > 0.02 && d < Math.hypot(g.x - antes.x, g.z - antes.z)) atropelos += 1;
  }
  antes = r.f;
  pontas.add(r.ponta);
  await p.waitForTimeout(100);
}
conferir(atropelos === 0, `ele nunca avança para cima de ninguém (${atropelos}; o mais perto: ${menor.toFixed(2)})`);
conferir(pontas.size === 2, 'e continua treinando, virando para a outra cesta');

// ============================================================ 5. a conversa
console.log('\n5. a conversa');
const conversar = async (max = 30) => {
  const falas = [];
  for (let i = 0; i < max; i++) {
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(400);
      if (!(await p.locator('.dialogue.show').count()) && falas.length) break;
      continue;
    }
    await p.waitForTimeout(450);
    const quem = await p.evaluate(() => document.querySelector('.dialogue .who')?.textContent ?? '');
    const tx = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (tx && !falas.includes(`${quem}: ${tx}`)) falas.push(`${quem}: ${tx}`);
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(150);
  }
  return falas.filter((f, i) => !falas.slice(i + 1).some((g) => g.startsWith(f)));
};
// espera ele começar um arremesso numa ponta e chega do lado (de fora da quadra)
await p.evaluate(() => window.jogo.debugPlace(0, 4.5, Math.PI));
for (let i = 0; i < 600; i++) {
  if ((await treino()).arremessando) break;
  await p.waitForTimeout(50);
}
const naPonta = await treino();
await p.evaluate(({ x, z }) => window.jogo.debugPlace(x - Math.sign(x) * 0.4, z + 0.95, Math.PI), naPonta);
let achou = false;
for (let i = 0; i < 60 && !achou; i++) {
  achou = /Flynn/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''));
  if (achou) await p.keyboard.press('KeyE');
  else await p.waitForTimeout(50);
}
conferir(achou, 'quando ele passa perto, o prompt é "Falar com o Flynn"');
// ele termina o arremesso antes de parar
let pausado = false;
for (let i = 0; i < 200 && !pausado; i++) {
  pausado = await p.evaluate(() => {
    let t = null;
    window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.treino) t = o.userData.teste; });
    return t.treino.pausado;
  });
  if (!pausado) await p.waitForTimeout(100);
}
const parado = await treino();
conferir(parado.bolas.every((b) => b.fase !== 'na-mao'), 'termina o arremesso antes de conversar (nenhuma bola presa na mão)');
conferir(pausado, 'na conversa ele para de treinar');
await p.screenshot({ path: `${OUT}-conversa.png` });
const falas = await conversar();
console.log('      ' + falas.join('\n      '));
conferir(falas.some((f) => /^Flynn: As meninas me emprestaram o meio da quadra/.test(f)), 'a primeira conversa no ginásio é sobre o treino');
let depois = await treino();
for (let i = 0; i < 100 && Math.hypot(depois.x - parado.x, depois.z - parado.z) <= 1; i++) {
  await p.waitForTimeout(200);
  depois = await treino();
}
conferir(Math.hypot(depois.x - parado.x, depois.z - parado.z) > 1, 'e depois ele volta a treinar');

// ============================================================ 6. de longe
await p.evaluate(() => { window.jogo.debugPlace(9, 7.4, Math.PI); window.jogo.setZoom(13); });
await p.waitForTimeout(2000);
await p.screenshot({ path: `${OUT}-ginasio.png` });

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
await browser.close();
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
process.exit(falhas.length ? 1 : 0);
