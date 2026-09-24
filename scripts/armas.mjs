/**
 * AS ARMAS DA ESTUFA (pedido do Renan): regador → mangueira → pistola d'água →
 * borrifador, cada uma destrancando quando a dupla vence a onda 20 com a
 * anterior.
 *
 *   1. as duas folhagens do meio da parede esquerda saíram, e no lugar delas
 *      há o painel com as quatro armas (as trancadas em sombra) e a bancada;
 *   2. a bancada abre o painel das armas, uma aba por arma, com a meta e as
 *      cartas DELA (a mangueira não tem "Tanque maior"; o regador não tem
 *      "Esguicho de latão");
 *   3. o recorde velho vira o do regador, e com a onda 20 dele a mangueira
 *      destranca; "Usar esta arma" guarda a escolha;
 *   4. a rodada de mangueira: esguicho na mão, a mangueira esticada do tonel,
 *      água infinita (∞), ninguém passa dos portões, e o jato sai;
 *   5. vencer a onda 20 de mangueira destranca a pistola, e o limite de andar
 *      volta ao normal quando a rodada acaba;
 *   6. no celular o painel cabe na largura.
 *
 *   node scripts/armas.mjs /tmp/ar
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/ar';
const BASE = process.env.BASE ?? 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const problemas = [];
const erros = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) problemas.push(msg);
};
const esperar = async (page, cond, teto = 8000) => {
  const fim = Date.now() + teto;
  while (Date.now() < fim) {
    if (await cond()) return true;
    await page.waitForTimeout(150);
  }
  return false;
};

async function abrirPagina(viewport) {
  const page = await browser.newPage({ viewport, ...(viewport.width < 500 ? { isMobile: true, hasTouch: true } : {}) });
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
  return page;
}
const estufa = async (page, extra = '') => {
  await page.goto(`${BASE}/?cena=estufa&em=-13,2.4${extra}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
  await page.waitForTimeout(400);
};
const parede = (page) => page.evaluate(() => {
  let painel = null;
  let folhagensNoVao = 0;
  window.jogo.current.world.root.traverse((o) => {
    if (o.userData.peca === 'painel-de-armas') painel = o;
  });
  // folhagem alta encostada na parede esquerda, entre o girassol e o tomate
  for (const o of window.jogo.current.world.root.children) {
    const p = o.position;
    if (p.x < -13 && p.z > 1 && p.z < 3.6 && o.userData.peca !== 'painel-de-armas' && o.userData.peca !== 'bancada-do-arsenal') {
      let folhagem = false;
      o.traverse((k) => { if (/folhagem/i.test(k.userData.peca ?? '')) folhagem = true; });
      if (folhagem) folhagensNoVao += 1;
    }
  }
  if (!painel) return null;
  const pecas = painel.children.filter((c) => c.userData.peca && c.userData.peca !== 'painel-de-armas');
  return {
    penduradas: pecas.map((c) => c.userData.peca),
    sombras: pecas.filter((c) => c.userData.trancada).length,
    folhagensNoVao,
  };
});
const arsenalAberto = (page) => page.evaluate(() => document.querySelector('.livro-de-cartas.arsenal')?.classList.contains('show'));
const falarAteAcabar = async (page) => {
  for (let i = 0; i < 20 && await page.evaluate(() => document.querySelector('.dialogue')?.classList.contains('show')); i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(350);
  }
};
const abrirArsenal = async (page) => {
  await page.evaluate(() => window.jogo.debugPlace(-13.0, 2.4, -Math.PI / 2));
  await page.waitForTimeout(500);
  const prompt = await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '');
  await page.keyboard.press('KeyE');
  await esperar(page, () => arsenalAberto(page), 3000);
  return prompt;
};
const aba = (page, nome) => page.locator('.livro-de-cartas.arsenal .abas button', { hasText: nome }).click();
const textoDaPagina = (page) => page.evaluate(() => document.querySelector('.livro-de-cartas.arsenal .paginas')?.textContent ?? '');

// ============================================= 1. a parede no lugar das plantas
const page = await abrirPagina({ width: 1280, height: 800 });
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await estufa(page, '&zoom=6');
await page.mouse.click(640, 400);
const p0 = await parede(page);
ok(!!p0, 'o painel das armas está na estufa');
ok(p0?.penduradas.length === 4, `com as quatro armas penduradas (${p0?.penduradas.join(', ')})`);
ok(p0?.sombras === 3, `com o save zerado só o regador tem cor: ${p0?.sombras} em sombra`);
ok(p0?.folhagensNoVao === 0, 'as duas folhagens do vão entre o girassol e o tomate saíram');
await page.evaluate(() => window.jogo.debugPlace(-12.6, 2.4, -Math.PI / 2));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-parede.png` });

// ============================================= 2. a bancada abre o painel
const prompt = await abrirArsenal(page);
ok(/escolher a arma/i.test(prompt), `na frente da bancada o prompt é o das armas ("${prompt.trim()}")`);
ok(await arsenalAberto(page), 'E na bancada abre o painel das armas');
ok(await page.locator('.livro-de-cartas.arsenal .abas button').count() === 4, 'uma aba por arma');
await page.screenshot({ path: `${OUT}-painel-regador.png` });
await aba(page, 'Mangueira');
await page.waitForTimeout(200);
const trancada = await textoDaPagina(page);
ok(/Vençam a onda 20 com o regador/.test(trancada), 'a mangueira trancada diz a meta: vencer a onda 20 com o regador');
ok(await page.locator('[data-usar]').count() === 0, 'e não tem botão de usar');
await page.screenshot({ path: `${OUT}-painel-trancada.png` });
await page.locator('.livro-de-cartas.arsenal .fechar').click();
await page.waitForTimeout(300);

// ============================================= 3. destrancar e escolher
// um recorde de antes das armas vira o do regador (a migração da primeira visita)
await page.evaluate(() => {
  localStorage.removeItem('aristory.save.v1');
});
await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
await page.evaluate(() => window.jogo.bump('jardim.recorde', 22));
await page.evaluate(() => window.jogo.save?.persist?.());
await estufa(page, '&zoom=6');
ok(await page.evaluate(() => window.jogo.stat('jardim.recorde.regador')) === 22, 'o recorde de antes das armas vira o do regador');
const p1 = await parede(page);
ok(p1?.sombras === 2, `com a onda 20 do regador, a mangueira ganha cor (${p1?.sombras} em sombra)`);
await page.evaluate(() => { window.jogo.debugPlace(-12.4, 2.4, -Math.PI / 2); window.jogo.setZoom(4); });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-parede-perto.png` });
await page.evaluate(() => window.jogo.setZoom(6));
// as cartas: uma de cada lado para ver no livro de cada arma
await page.evaluate(() => {
  for (const id of ['tanque-1', 'esguicho-1', 'bico-1']) window.jogo.desbloquearCartaDoJardim(id);
});
await abrirArsenal(page);
const doRegador = await textoDaPagina(page);
ok(/Tanque maior/.test(doRegador) && !/Esguicho de latão/.test(doRegador), 'o regador tem "Tanque maior" e não tem "Esguicho de latão"');
await aba(page, 'Mangueira');
await page.waitForTimeout(200);
const daMangueira = await textoDaPagina(page);
ok(/Esguicho de latão/.test(daMangueira) && !/Tanque maior/.test(daMangueira), 'a mangueira tem "Esguicho de latão" e não tem "Tanque maior"');
ok(/Bico mais longo/.test(daMangueira), 'e as genéricas (alcance) servem nas duas');
await page.screenshot({ path: `${OUT}-painel-mangueira.png` });
await page.locator('[data-usar="mangueira"]').click();
await page.waitForTimeout(400);
ok(!(await arsenalAberto(page)), '"Usar esta arma" fecha o painel');
ok(await page.evaluate(() => window.jogo.stat('jardim.arma')) === 1, 'e guarda a mangueira como a arma da próxima rodada');

// ============================================= 4. a rodada de mangueira
await page.evaluate(() => window.jogo.current.world.root.userData.comecarRodada([]));
await page.waitForTimeout(800);
const r0 = await page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());
ok(r0.arma === 'mangueira', 'a rodada começa com a arma escolhida');
ok(r0.mangueira === true, 'a mangueira está esticada do tonel até a mão');
ok(r0.limiteZ > -11, `o limite de andar fica antes dos portões (z ≥ ${r0.limiteZ.toFixed(2)})`);
const naMao = await page.evaluate(() => {
  let peca = null;
  window.jogo.objetoNaMao()?.traverse((o) => { if (o.userData.peca && !peca) peca = o.userData.peca; });
  return peca;
});
ok(naMao === 'esguicho', `na mão vai o esguicho (${naMao})`);
const tanque = await page.evaluate(() => document.querySelector('.painel-jardim .tanque em b')?.textContent);
ok(tanque === '∞', `o painel mostra a água infinita (${tanque})`);
// tenta sair pelo portão do meio, andando para todo lado
await page.evaluate(() => window.jogo.debugPlace(0, -9.6, Math.PI));
let menorZ = Infinity;
for (const tecla of ['KeyW', 'KeyA', 'KeyS', 'KeyD']) {
  await page.evaluate(() => window.jogo.debugPlace(0, -9.6, Math.PI));
  await page.keyboard.down(tecla);
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(250);
    menorZ = Math.min(menorZ, await page.evaluate(() => window.jogo.playerPosition().z));
  }
  await page.keyboard.up(tecla);
}
ok(menorZ >= r0.limiteZ - 0.05, `ninguém passa dos portões de mangueira (o mais longe foi z ${menorZ.toFixed(2)})`);
// espera um bicho e o jato sair
await page.evaluate(() => {
  window.jogo.current.world.root.userData.rodada.escalaDoTempo = 3;
  window.jogo.debugPlace(0, -6, Math.PI);
});
await esperar(page, () => page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado().jatosDados > 2), 60000);
const r1 = await page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());
ok(r1.jatosDados > 2, `o jato sai da mangueira (${r1.jatosDados} jatos)`);
ok(r1.agua === r1.tanque, 'e a água não baixa');
await page.evaluate(() => { window.jogo.current.world.root.userData.rodada.escalaDoTempo = 1; });
await page.screenshot({ path: `${OUT}-rodada.png` });
await page.evaluate(() => window.jogo.setZoom(4));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-esguicho.png` });

// ============================================= 4b. as cartas da mangueira agindo
// a mangueira deitada do tonel até a dupla atravessa o caminho dos bichos
await page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  r.terminar('interrompida');
});
await page.waitForTimeout(400);
await falarAteAcabar(page);
await page.evaluate(() => {
  window.jogo.debugPlace(1.5, -7.5, Math.PI);
  const u = window.jogo.current.world.root.userData;
  u.comecarRodada(['jato-continuo', 'chicote', 'vazamento', 'enchente'], 'mangueira');
  u.rodada.escalaDoTempo = 3;
  // os 25 s da Enchente no Chromium sem tela seriam minutos: o relógio começa no fim
  u.rodada.enchente = 23;
});
const agiu = () => page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado().efeitos);
await esperar(page, async () => {
  // subiu de nível: pega a primeira carta, senão a rodada fica congelada na tela
  if (await page.locator('.cartas-do-jardim.show').count()) {
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(300);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(600);
  }
  const e = await agiu();
  return ['jato-continuo', 'chicote', 'vazamento', 'enchente'].every((k) => (e[k] ?? 0) > 0);
}, 150000);
const efeitos = await agiu();
for (const [id, nome] of [['jato-continuo', 'Jato contínuo'], ['chicote', 'Chicote'], ['vazamento', 'Vazamento'], ['enchente', 'Enchente']]) {
  ok((efeitos[id] ?? 0) > 0, `${nome} age na rodada (${efeitos[id] ?? 0}×)`);
}
await page.evaluate(() => { window.jogo.current.world.root.userData.rodada.escalaDoTempo = 1; });
await page.screenshot({ path: `${OUT}-cartas.png` });

// ============================================= 5. a onda 20 de mangueira abre a pistola
await page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  r.onda = 21;
  r.terminar('fim');
});
await esperar(page, () => page.evaluate(() => document.querySelector('.fim-do-jardim')?.classList.contains('show')), 5000);
await page.evaluate(() => document.querySelector('.fim-do-jardim .fechar')?.click());
await page.waitForTimeout(600);
const falaDaJosefina = await page.evaluate(() => document.querySelector('.dialogue')?.textContent ?? '');
await falarAteAcabar(page);
ok(await page.evaluate(() => window.jogo.stat('jardim.recorde.mangueira')) >= 20, 'a rodada guarda o recorde da mangueira');
const p2 = await parede(page);
ok(p2?.sombras === 1, `e a pistola ganha cor na parede (${p2?.sombras} em sombra)`);
ok(await page.evaluate(() => window.jogo.current.world.bounds.minZ) < -20, 'o limite de andar volta ao normal no fim');
console.log(`       a Josefina: "${falaDaJosefina.trim().slice(0, 90)}"`);
await abrirArsenal(page);
await aba(page, "Pistola");
await page.waitForTimeout(200);
ok(/arrumando/.test(await textoDaPagina(page)), 'a pistola destrancada aparece "em construção" (a rodada dela ainda não existe)');
await page.locator('.livro-de-cartas.arsenal .fechar').click();
await page.close();

// ============================================= 6. no celular
const cel = await abrirPagina({ width: 390, height: 844 });
await cel.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await cel.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await estufa(cel);
await cel.evaluate(() => window.jogo.ui ? null : null);
await cel.evaluate(() => {
  window.jogo.debugPlace(-13.0, 2.4, -Math.PI / 2);
});
await cel.waitForTimeout(500);
await cel.evaluate(() => document.querySelector('.prompt')?.click());
await esperar(cel, () => arsenalAberto(cel), 3000);
if (!(await arsenalAberto(cel))) {
  await cel.keyboard.press('KeyE');
  await esperar(cel, () => arsenalAberto(cel), 3000);
}
ok(await arsenalAberto(cel), 'no celular a bancada abre o painel');
const larg = await cel.evaluate(() => document.querySelector('.livro-de-cartas.arsenal .livro')?.getBoundingClientRect().width ?? 999);
ok(larg <= 390, `e ele cabe na largura (${Math.round(larg)} px)`);
await cel.screenshot({ path: `${OUT}-celular.png` });

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
