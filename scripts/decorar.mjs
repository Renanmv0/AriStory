/**
 * A LOJINHA DA JOSEFINA E OS ENFEITES DA ESTUFA (pedido do Renan):
 *
 *   1. a banca na parede direita (balcão para o meio) abre o painel (a Josefina apresenta
 *      na primeira vez), com as abas de roupas e de decorações;
 *   2. comprar enfeite debita da carteira e GUARDA; "colocar" fecha a banca e
 *      o enfeite vai na frente da dupla, com o anel verde onde cabe;
 *   3. onde não cabe (o terreiro), o anel fica vermelho e o E não coloca;
 *   4. o enfeite posto tem colisor e o ponto "Mexer no…" (girar, mudar de
 *      lugar, guardar), e continua lá numa visita nova à estufa;
 *   5. a roupa comprada vai para o guarda-roupa dos dois, e "provar no boneco"
 *      abre a arara da boutique com as roupas da Josefina.
 *
 *   node scripts/decorar.mjs /tmp/dc
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/dc';
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

const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
page.on('pageerror', (e) => { erros.push('PAGEERROR: ' + e.message); console.log('       PAGEERROR', e.message); });
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=estufa&em=11,9`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.decorador, null, { timeout: 30000 });
await page.waitForTimeout(1200);
await page.evaluate(() => window.jogo.ganhar(400));

const deco = (fn, arg) => page.evaluate(fn, arg);
const salvas = () => deco(() => window.jogo.decoracoes().map((d) => ({ ...d })));
const passarFalas = async () => {
  for (let k = 0; k < 20; k++) {
    await page.waitForTimeout(300);
    if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
    else if (k > 3) break;
  }
};

// ================================================== 1. a banca e o painel
await page.evaluate(() => window.jogo.debugPlace(12.4, 7.4, Math.PI / 2));
await page.waitForTimeout(800);
const prompt = await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '');
ok(/lojinha/i.test(prompt), `na frente do balcão, o prompt é o da lojinha ("${prompt.trim()}")`);
await page.screenshot({ path: `${OUT}-banca.png` });
await page.keyboard.press('KeyE');
let apresentou = false;
for (let i = 0; i < 20 && !(await page.locator('.loja-da-josefina.show').count()); i++) {
  if (await page.locator('.dialogue.show').count()) {
    const quem = ((await page.locator('.dialogue .who').textContent().catch(() => '')) ?? '').trim();
    if (quem === 'Josefina') apresentou = true;
    await page.keyboard.press('KeyE');
  }
  await page.waitForTimeout(350);
}
ok(apresentou, 'na primeira vez, a Josefina apresenta a lojinha');
ok(await page.locator('.loja-da-josefina.show').count() === 1, 'o painel da lojinha abre');
const abas = await page.locator('.loja-da-josefina .abas button').allTextContents();
ok(abas.length === 2 && /Roupas/.test(abas[0]) && /Decora/.test(abas[1]), `duas abas: ${abas.map((a) => a.trim()).join(' | ')}`);
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-painel-decoracoes.png` });
const fotos = await page.evaluate(() => [...document.querySelectorAll('.loja-da-josefina .produto.decoracao img')].filter((i) => i.src.startsWith('data:image/png')).length);
ok(fotos === 6, `os seis enfeites têm retrato (${fotos})`);

// comprar o anão e o flamingo
const saldo0 = await deco(() => window.jogo.carteira());
await page.locator('.loja-da-josefina [data-acao="comprar-decoracao"][data-id="anao-de-jardim"]').click();
await page.waitForTimeout(300);
await page.locator('.loja-da-josefina [data-acao="comprar-decoracao"][data-id="flamingo"]').click();
await page.waitForTimeout(300);
const saldo1 = await deco(() => window.jogo.carteira());
ok(saldo0 - saldo1 === 45 + 35, `comprar o anão e o flamingo debita R$ 80 (debitou ${saldo0 - saldo1})`);
const s1 = await salvas();
ok(s1.length === 2 && s1.every((d) => d.posta === null), 'os dois ficam guardados, sem lugar');
const contaNaTela = await page.locator('.loja-da-josefina .produto[data-id="anao-de-jardim"] .conta').textContent().catch(() => '');
ok(/1 guardado/.test(contaNaTela ?? ''), `o cartão conta o guardado ("${contaNaTela}")`);
ok(await page.locator('.loja-da-josefina.show').count() === 1, 'comprar não fecha a banca');

// a aba de roupas: comprar a camiseta de girassol
await page.locator('.loja-da-josefina [data-aba="roupas"]').click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}-painel-roupas.png` });
await page.locator('.loja-da-josefina [data-acao="comprar-roupa"][data-id="camiseta-de-girassol"]').click();
await page.waitForTimeout(300);
const camiseta = await deco(() => [window.jogo.playerId(), window.jogo.companionId()]
  .map((q) => window.jogo.wardrobeItems(q).some((i) => i.id === 'camiseta-de-girassol')));
ok(camiseta.every(Boolean), 'a camiseta de girassol vai para o guarda-roupa dos dois');
const selo = await page.locator('.loja-da-josefina .produto[data-id="camiseta-de-girassol"] .selo').count();
ok(selo === 1, 'e o cartão vira "é de vocês"');

// ==================================================== 2. colocar o anão
await page.locator('.loja-da-josefina [data-aba="decoracoes"]').click();
await page.waitForTimeout(300);
await page.locator('.loja-da-josefina [data-acao="colocar"][data-id="anao-de-jardim"]').click();
await page.waitForTimeout(500);
ok(await page.locator('.loja-da-josefina.show').count() === 0, '"colocar" fecha a banca');
ok(await deco(() => window.jogo.current.world.root.userData.decorador.decorando), 'e entra no modo de decorar');
ok(await page.locator('.posicionador.show').count() === 1, 'a barra de colocar aparece');
// num lugar que pode: do lado de dentro dos canteiros da direita, entre os dois
await page.evaluate(() => window.jogo.debugPlace(10.4, 0.9, 0));
await page.waitForTimeout(700);
const podeAqui = await page.locator('.posicionador .pode').count();
await page.evaluate(() => window.jogo.setZoom(7));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-colocando.png` });
ok(podeAqui === 1, 'fora do terreiro e dos canteiros, a barra diz "aqui dá"');
const colisores0 = await deco(() => window.jogo.current.world.colliders.length);
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
const s2 = await salvas();
const anao = s2.find((d) => d.id === 'anao-de-jardim');
console.log(`       anão posto em ${anao?.posta ? `(${anao.posta.x.toFixed(2)}, ${anao.posta.z.toFixed(2)})` : 'lugar nenhum'}`);
ok(!!anao?.posta && Math.abs(anao.posta.x - 10.4) < 0.05 && anao.posta.z > 1.6, 'o E põe o anão na frente da dupla, e o save guarda onde');
ok(!(await deco(() => window.jogo.current.world.root.userData.decorador.decorando)), 'e o modo termina');
ok(await deco(() => window.jogo.current.world.colliders.length) === colisores0 + 1, 'o anão ganha colisor');
await page.screenshot({ path: `${OUT}-posto.png` });

// ======================================== 3. no terreiro não dá
await page.evaluate(() => window.jogo.current.world.root.userData.decorador.colocar('flamingo'));
await page.evaluate(() => window.jogo.debugPlace(0, -1.2, 0));
await page.waitForTimeout(700);
const motivo = await page.locator('.posicionador .nao-pode').textContent().catch(() => '');
ok(/terreiro|caminho/.test(motivo ?? ''), `no meio do terreiro a barra diz que não ("${(motivo ?? '').trim()}")`);
const desabilitado = await page.locator('.posicionador button.colocar').isDisabled();
ok(desabilitado, 'e o botão de colocar fica apagado');
await page.screenshot({ path: `${OUT}-nao-pode.png` });
await page.keyboard.press('KeyE');
await page.waitForTimeout(400);
ok((await salvas()).find((d) => d.id === 'flamingo')?.posta === null, 'o E ali não coloca');
// em cima do anão também não
await page.evaluate(() => window.jogo.debugPlace(10.4, 0.95, 0));
await page.waitForTimeout(600);
const emCima = await page.locator('.posicionador .nao-pode').textContent().catch(() => '');
ok(/enfeite|encostado/.test(emCima ?? ''), `em cima do anão não dá ("${(emCima ?? '').trim()}")`);
await page.keyboard.press('KeyX');
await page.waitForTimeout(400);
ok(!(await deco(() => window.jogo.current.world.root.userData.decorador.decorando)), 'o X cancela');
ok((await salvas()).find((d) => d.id === 'flamingo')?.posta === null, 'e o flamingo continua guardado');
// e os pontos da cena voltaram
await page.evaluate(() => window.jogo.debugPlace(12.4, 7.4, Math.PI / 2));
await page.waitForTimeout(700);
ok(/lojinha/i.test(await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '')), 'depois de cancelar, a lojinha volta a responder');

// ==================================== 4. mexer no anão: girar e guardar
await page.evaluate(() => window.jogo.debugPlace(9.55, 2.0, Math.PI / 2));
await page.waitForTimeout(700);
const mexer = await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '');
ok(/Mexer no anão/i.test(mexer), `perto do anão, o prompt é "Mexer no anão…" ("${mexer.trim()}")`);
await page.keyboard.press('KeyE');
await page.waitForSelector('.escolhas.show button', { timeout: 5000 });
await page.locator('.escolhas.show button').nth(1).click(); // girar
await page.waitForTimeout(500);
const giro = (await salvas()).find((d) => d.id === 'anao-de-jardim')?.posta?.giro ?? 0;
ok(Math.abs(giro - Math.PI / 4) < 0.01, `girar vira 45° e grava (${giro.toFixed(2)})`);

// ============================================ 5. voltar na estufa: continua lá
await page.goto(`${BASE}/?cena=estufa&em=10.4,-0.4`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.decorador, null, { timeout: 30000 });
await page.waitForTimeout(1200);
const postasDepois = await deco(() => window.jogo.current.world.root.userData.decorador.postas('anao-de-jardim'));
ok(postasDepois === 1, 'numa visita nova, o anão continua no lugar');

// guardar pelo menu
await page.evaluate(() => window.jogo.debugPlace(9.55, 2.0, Math.PI / 2));
await page.waitForTimeout(700);
await page.keyboard.press('KeyE');
await page.waitForSelector('.escolhas.show button', { timeout: 5000 });
await page.locator('.escolhas.show button').nth(2).click(); // guardar
await page.waitForTimeout(500);
ok((await salvas()).find((d) => d.id === 'anao-de-jardim')?.posta === null, 'guardar tira do chão e volta a ser guardado');
ok(await deco(() => window.jogo.current.world.root.userData.decorador.postas('anao-de-jardim')) === 0, 'e o anão some da estufa');

// ============================================== 6. provar no boneco
await page.evaluate(() => { void window.jogo.current.world.root.userData.abrirALojinha(); });
await page.waitForSelector('.loja-da-josefina.show', { timeout: 5000 });
await page.locator('.loja-da-josefina [data-aba="roupas"]').click();
await page.locator('.loja-da-josefina [data-acao="provar"]').click();
await page.waitForTimeout(800);
ok(await page.locator('.loja.show').count() === 1, '"provar no boneco" abre a arara com o boneco de prova');
const titulo = await page.locator('.loja .arara').textContent().catch(() => '');
ok(/Josefina/.test(titulo ?? ''), `a arara é a da Josefina ("${titulo}")`);
await page.screenshot({ path: `${OUT}-provar.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// ======================== 7. a estufa enfeitada (a foto), e o celular
await page.evaluate(() => {
  const d = window.jogo.current.world.root.userData.decorador;
  window.jogo.ganhar(400);
  for (const id of ['vaso-de-flores', 'flamingo', 'lanterninha', 'anao-de-jardim', 'banquinho', 'bebedouro']) {
    if (!d.guardadas(id)) d.comprar(id);
  }
});
// (colocar um de cada vez: o modo aceita um enfeite por vez)
const colocados = await page.evaluate(async () => {
  const d = window.jogo.current.world.root.userData.decorador;
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const lugares = [
    ['vaso-de-flores', 9.6, 5.9], ['flamingo', 9.5, 2.2], ['lanterninha', 10.2, 6.6],
    ['anao-de-jardim', 10.6, 1.9], ['banquinho', -9.4, 6.0], ['bebedouro', -10.2, 2.4],
  ];
  const fichas = { 'vaso-de-flores': 0.32, flamingo: 0.26, lanterninha: 0.2, 'anao-de-jardim': 0.24, banquinho: 0.55, bebedouro: 0.34 };
  const res = [];
  for (const [id, x, z] of lugares) {
    if (!d.decorando) d.colocar(id);
    window.jogo.debugPlace(x, z - (0.85 + fichas[id]), 0);
    await espera(400);
    const motivo = document.querySelector('.posicionador .nao-pode')?.textContent ?? null;
    document.querySelector('.posicionador button.colocar')?.click();
    await espera(300);
    res.push([id, motivo]);
  }
  return res;
});
console.log('       colocados:', JSON.stringify(colocados));
const postasFim = await salvas();
ok(postasFim.filter((d) => d.posta).length >= 5, `os enfeites da foto ficaram no chão (${postasFim.filter((d) => d.posta).length})`);
await page.evaluate(() => { window.jogo.debugPlace(4, 4, 0.8); window.jogo.setZoom(15); });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-estufa-enfeitada.png` });

// ============================== 8. as roupas da Josefina, vestidas (foto)
await page.evaluate(() => {
  const j = window.jogo;
  j.ganhar(200);
  for (const id of ['gorro-joaninha', 'galocha-verde']) j.comprarPeca(window.aristoryItens[id]);
  for (const q of [j.playerId(), j.companionId()]) {
    for (const id of ['camiseta-de-girassol', 'gorro-joaninha', 'galocha-verde']) {
      const peca = j.wardrobeItems(q).find((i) => i.id === id);
      if (peca) j.equipWearable(peca, q);
    }
  }
  j.debugPlace(4, 7.4, 0.5);
  j.setZoom(3.8);
});
await page.waitForTimeout(1600);
const vestido = await page.evaluate(() => window.jogo.wearables().map((i) => i?.id ?? null));
ok(['camiseta-de-girassol', 'gorro-joaninha', 'galocha-verde'].every((id) => vestido.includes(id)), 'dá para vestir a camiseta, o gorro e a galocha');
await page.screenshot({ path: `${OUT}-roupas-vestidas.png` });
await page.keyboard.down('KeyA');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-roupas-andando.png` });
await page.keyboard.up('KeyA');
await page.evaluate(() => window.jogo.setZoom(11));

// celular: o painel e a barra
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => { void window.jogo.current.world.root.userData.abrirALojinha(); });
await page.waitForSelector('.loja-da-josefina.show', { timeout: 5000 });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-celular-painel.png` });
await page.locator('.loja-da-josefina .fechar').click();
await page.evaluate(() => {
  const d = window.jogo.current.world.root.userData.decorador;
  window.jogo.ganhar(100);
  d.comprar('vaso-de-flores');
  d.colocar('vaso-de-flores');
  window.jogo.debugPlace(10.4, 3.5, 0);
});
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-celular-barra.png` });
await page.locator('.posicionador [data-botao="cancelar"]').click();

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
