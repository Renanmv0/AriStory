/**
 * A LOJINHA DA JOSEFINA E OS ENFEITES DA ESTUFA (pedido do Renan):
 *
 *   1. a banca na parede direita (balcão para o meio) abre o painel (a Josefina apresenta
 *      na primeira vez), com as abas de roupas e de decorações;
 *   1b. enfeite se paga em GIRASSÓIS (a carteira de reais não mexe), e o que a
 *      Josefina ainda não trouxe aparece com cadeado até o recorde chegar lá;
 *   2. comprar enfeite debita os girassóis e GUARDA; "colocar" fecha a banca e
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
// reais para as roupas, girassóis para os enfeites, e o recorde ZERADO: só
// o que a Josefina vende desde o começo está destrancado
await page.evaluate(() => { window.jogo.ganhar(400); window.jogo.bump('jardim.girassois', 60); });
const girassois = () => deco(() => window.jogo.stat('jardim.girassois'));

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
ok(apresentou, 'na primeira vez, a Josefina apresenta a lojinha (e explica os girassóis)');
ok(await page.locator('.loja-da-josefina.show').count() === 1, 'o painel da lojinha abre');
const abas = await page.locator('.loja-da-josefina .abas button').allTextContents();
ok(abas.length === 2 && /Roupas/.test(abas[0]) && /Decora/.test(abas[1]), `duas abas: ${abas.map((a) => a.trim()).join(' | ')}`);
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-painel-decoracoes.png` });
const fotos = await page.evaluate(() => ({
  com: [...document.querySelectorAll('.loja-da-josefina .produto.decoracao img')].filter((i) => i.src.startsWith('data:image/png')).length,
  cartoes: document.querySelectorAll('.loja-da-josefina .produto.decoracao').length,
}));
ok(fotos.cartoes >= 19 && fotos.com === fotos.cartoes, `todo enfeite do catálogo tem cartão e retrato (${fotos.com} de ${fotos.cartoes})`);

// ====================== 1b. girassóis, e a banca que cresce com o recorde
const topo = await page.locator('.loja-da-josefina .saldo').textContent();
ok(/R\$ 400/.test(topo) && /60/.test(topo) && /girass/.test(topo), `o alto da banca mostra reais e girassóis ("${topo.trim()}")`);
const trancados = await page.evaluate(() => [...document.querySelectorAll('.loja-da-josefina .produto.decoracao.travada')].map((c) => c.dataset.id));
ok(trancados.includes('anao-de-jardim') && trancados.includes('roda-gigante') && !trancados.includes('flamingo'),
  `com recorde 0, o anão e a rodinha estão trancados e o flamingo não (${trancados.length} trancados)`);
ok(await page.locator('.loja-da-josefina .produto[data-id="anao-de-jardim"] [data-acao="comprar-decoracao"]').count() === 0,
  'enfeite trancado não tem botão de comprar');
const cadeado = await page.locator('.loja-da-josefina .produto[data-id="anao-de-jardim"] .cadeado').textContent().catch(() => '');
ok(/onda 2/.test(cadeado ?? ''), `o cadeado diz a onda que falta ("${(cadeado ?? '').trim()}")`);
const precoFlamingo = await page.locator('.loja-da-josefina [data-acao="comprar-decoracao"][data-id="flamingo"]').textContent();
ok(/🌻\s6/.test(precoFlamingo), `o flamingo custa em girassóis ("${precoFlamingo.trim()}")`);
await page.locator('.loja-da-josefina [data-aba="roupas"]').click();
await page.waitForTimeout(300);
const roupaTrancada = await page.locator('.loja-da-josefina .produto.roupa.travada[data-id="mochila-casco"]').count();
ok(roupaTrancada === 1, 'a mochila-casco (onda 18) também espera o recorde');
await page.screenshot({ path: `${OUT}-painel-trancado.png` });
await page.locator('.loja-da-josefina .fechar').click();
await page.waitForTimeout(300);
// a dupla vence a onda 30: a banca abre inteira
await page.evaluate(() => window.jogo.bump('jardim.recorde', 30));
await page.evaluate(() => { void window.jogo.current.world.root.userData.abrirALojinha(); });
await page.waitForSelector('.loja-da-josefina.show', { timeout: 5000 });
await page.locator('.loja-da-josefina [data-aba="decoracoes"]').click();
await page.waitForTimeout(300);
ok(await page.locator('.loja-da-josefina .produto.travada').count() === 0, 'com o recorde na 30, nada está trancado');

// comprar o anão e o flamingo: sai girassol, a carteira de reais não mexe
const saldo0 = await deco(() => window.jogo.carteira());
const flor0 = await girassois();
await page.locator('.loja-da-josefina [data-acao="comprar-decoracao"][data-id="anao-de-jardim"]').click();
await page.waitForTimeout(300);
await page.locator('.loja-da-josefina [data-acao="comprar-decoracao"][data-id="flamingo"]').click();
await page.waitForTimeout(300);
const saldo1 = await deco(() => window.jogo.carteira());
const flor1 = await girassois();
ok(flor0 - flor1 === 7 + 6 && saldo0 === saldo1, `comprar o anão e o flamingo custa 13 girassóis e nenhum real (${flor0 - flor1} 🌻, R$ ${saldo0 - saldo1})`);
const s1 = await salvas();
ok(s1.length === 2 && s1.every((d) => d.posta === null), 'os dois ficam guardados, sem lugar');
const contaNaTela = await page.locator('.loja-da-josefina .produto[data-id="anao-de-jardim"] .conta').textContent().catch(() => '');
ok(/1 guardado/.test(contaNaTela ?? ''), `o cartão conta o guardado ("${contaNaTela}")`);
ok(await page.locator('.loja-da-josefina.show').count() === 1, 'comprar não fecha a banca');

// a aba de roupas: comprar a camiseta de girassol
await page.locator('.loja-da-josefina [data-aba="roupas"]').click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}-painel-roupas.png` });
// separada por parte do corpo, na ordem do guarda-roupa (pedido do Renan)
const titulos = await page.locator('.loja-da-josefina h3.parte').allTextContents();
const ordem = ['Cabeça', 'Tronco', 'Pernas', 'Pés', 'Mãos', 'Acessórios'];
const vistos = titulos.map((t) => ordem.findIndex((o) => t.includes(o)));
ok(vistos.length >= 5 && vistos.every((v, i) => v >= 0 && (i === 0 || v > vistos[i - 1])),
  `as roupas vêm por parte, na ordem cabeça → acessórios (${titulos.join(' · ')})`);
await page.locator('.loja-da-josefina [data-parte="maos"]').click();
await page.waitForTimeout(300);
const soMaos = await page.locator('.loja-da-josefina .produto.roupa').evaluateAll((els) => els.map((e) => e.dataset.id));
ok(soMaos.length > 0 && soMaos.every((id) => /^(luvas|pulseira)/.test(id)), `o botão "Mãos" mostra só luva e pulseira (${soMaos.join(', ')})`);
await page.screenshot({ path: `${OUT}-painel-roupas-maos.png` });
await page.locator('.loja-da-josefina [data-parte="tudo"]').click();
await page.waitForTimeout(300);
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

// ========== 3. o terreiro e o caminho dos bichos DÃO; o vão do portão e o canteiro não
// (pedido do Renan: bicho atravessa enfeite, então dá para enfeitar o caminho dele)
await page.evaluate(() => window.jogo.current.world.root.userData.decorador.colocar('flamingo'));
// no vão do portão da direita (o enfeite vai 0,85 + raio à frente, e o PI olha para o fundo)
await page.evaluate(() => window.jogo.debugPlace(8.5, -9.9, Math.PI));
await page.waitForTimeout(700);
const motivo = await page.locator('.posicionador .nao-pode').textContent().catch(() => '');
ok(/portão/.test(motivo ?? ''), `no vão do portão a barra diz que não ("${(motivo ?? '').trim()}")`);
const desabilitado = await page.locator('.posicionador button.colocar').isDisabled();
ok(desabilitado, 'e o botão de colocar fica apagado');
await page.screenshot({ path: `${OUT}-nao-pode.png` });
await page.keyboard.press('KeyE');
await page.waitForTimeout(400);
ok((await salvas()).find((d) => d.id === 'flamingo')?.posta === null, 'o E ali não coloca');
// em cima do canteiro também não
await page.evaluate(() => window.jogo.debugPlace(10.2, 7.6, 0));
await page.waitForTimeout(600);
const noCanteiro = await page.locator('.posicionador .nao-pode').textContent().catch(() => '');
ok(/canteiro/.test(noCanteiro ?? ''), `em cima do canteiro não dá ("${(noCanteiro ?? '').trim()}")`);
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
// e no MEIO DO TERREIRO, onde a rodada acontece, agora dá
await page.evaluate(() => window.jogo.current.world.root.userData.decorador.colocar('flamingo'));
await page.evaluate(() => window.jogo.debugPlace(1.5, -2.4, 0));
await page.waitForTimeout(700);
ok(await page.locator('.posicionador .pode').count() === 1, 'no meio do terreiro a barra diz "aqui dá"');
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const flamingo = (await salvas()).find((d) => d.id === 'flamingo')?.posta;
ok(!!flamingo && Math.abs(flamingo.z - -1.29) < 0.1, `o flamingo fica no terreiro (${flamingo ? flamingo.z.toFixed(2) : '—'})`);

// ============== 4. o modo de edição: fora dele, enfeite não tem ponto nenhum
const pontosDosEnfeites = () => deco(() => window.jogo.current.world.interactables
  .filter((p) => p.id.startsWith('decoracao:')).map((p) => p.enabled));
ok((await pontosDosEnfeites()).every((e) => !e), 'fora do modo de edição, nenhum enfeite tem "Mexer no…"');
await page.evaluate(() => window.jogo.debugPlace(9.55, 2.0, Math.PI / 2));
await page.waitForTimeout(700);
const semMexer = await page.evaluate(() => document.querySelector('.prompt.show')?.textContent ?? '');
ok(!/Mexer/i.test(semMexer), `perto do anão, sem o modo, não aparece "Mexer" ("${semMexer.trim()}")`);
// a porta do modo: o botão da aba de decorações da lojinha
await page.evaluate(() => window.jogo.debugPlace(12.4, 7.4, Math.PI / 2));
await page.waitForTimeout(500);
await page.evaluate(() => { void window.jogo.current.world.root.userData.abrirALojinha(); });
await page.waitForSelector('.loja-da-josefina.show', { timeout: 5000 });
await page.locator('.loja-da-josefina [data-aba="decoracoes"]').click();
await page.waitForTimeout(300);
const botaoEditar = page.locator('.loja-da-josefina [data-acao="editar"]');
ok(await botaoEditar.count() === 1 && !(await botaoEditar.isDisabled()), 'a aba de decorações tem "Arrumar os enfeites"');
await page.screenshot({ path: `${OUT}-painel-editar.png` });
await botaoEditar.click();
await page.waitForTimeout(600);
ok(await deco(() => window.jogo.current.world.root.userData.decorador.editando), 'o botão fecha a banca e liga o modo de edição');
ok(await page.locator('.posicionador.show.editando').count() === 1, 'a barra do modo de edição aparece');
ok((await pontosDosEnfeites()).every((e) => e), 'no modo, todo enfeite ganha o "Mexer no…"');
const outrosLigados = await deco(() => window.jogo.current.world.interactables
  .filter((p) => !p.id.startsWith('decoracao:') && p.enabled).map((p) => p.id));
ok(outrosLigados.length === 0, `e os outros pontos da cena descansam (${outrosLigados.join(', ') || 'nenhum'})`);
await page.evaluate(() => { window.jogo.debugPlace(9.55, 2.0, Math.PI / 2); window.jogo.setZoom(7); });
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-editando.png` });
const mexer = await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '');
ok(/Mexer no anão/i.test(mexer), `perto do anão, o prompt é "Mexer no anão…" ("${mexer.trim()}")`);
await page.keyboard.press('KeyE');
await page.waitForSelector('.escolhas.show button', { timeout: 5000 });
ok(await page.locator('.posicionador.show').count() === 0, 'a barra sai da frente da pergunta');
await page.locator('.escolhas.show button').nth(1).click(); // girar
await page.waitForTimeout(500);
const giro = (await salvas()).find((d) => d.id === 'anao-de-jardim')?.posta?.giro ?? 0;
ok(Math.abs(giro - Math.PI / 4) < 0.01, `girar vira 45° e grava (${giro.toFixed(2)})`);
ok(await deco(() => window.jogo.current.world.root.userData.decorador.editando), 'e continua no modo, para mexer no próximo');
// mudar de lugar DENTRO do modo: pega, põe, e volta a editar
await page.keyboard.press('KeyE');
await page.waitForSelector('.escolhas.show button', { timeout: 5000 });
await page.locator('.escolhas.show button').nth(0).click(); // mudar de lugar
await page.waitForTimeout(400);
ok(await deco(() => window.jogo.current.world.root.userData.decorador.decorando), '"mudar de lugar" põe o anão na mão');
await page.evaluate(() => window.jogo.debugPlace(9.55, 1.5, 0));
await page.waitForTimeout(500);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
ok(await deco(() => {
  const d = window.jogo.current.world.root.userData.decorador;
  return !d.decorando && d.editando;
}), 'pôs no lugar novo e voltou ao modo de edição');
ok((await pontosDosEnfeites()).every((e) => e), 'com o "Mexer no…" de todos de volta');
// o X sai do modo, e a cena volta a responder
await page.keyboard.press('KeyX');
await page.waitForTimeout(500);
ok(!(await deco(() => window.jogo.current.world.root.userData.decorador.editando)), 'o X termina o modo de edição');
ok((await pontosDosEnfeites()).every((e) => !e), 'e os enfeites voltam a não ter ponto');
await page.evaluate(() => { window.jogo.debugPlace(12.4, 7.4, Math.PI / 2); window.jogo.setZoom(11); });
await page.waitForTimeout(700);
ok(/lojinha/i.test(await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '')), 'depois do modo, a lojinha volta a responder');

// ============================================ 5. voltar na estufa: continua lá
await page.goto(`${BASE}/?cena=estufa&em=10.4,-0.4`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.decorador, null, { timeout: 30000 });
await page.waitForTimeout(1200);
const postasDepois = await deco(() => window.jogo.current.world.root.userData.decorador.postas('anao-de-jardim'));
ok(postasDepois === 1, 'numa visita nova, o anão continua no lugar');
ok(!(await deco(() => window.jogo.current.world.root.userData.decorador.editando)), 'e a visita nova começa fora do modo de edição');

// guardar pelo menu (no modo de edição, que é onde o menu existe)
await page.evaluate(() => window.jogo.current.world.root.userData.decorador.editar());
await page.evaluate(() => window.jogo.debugPlace(9.55, 1.8, 0));
await page.waitForTimeout(700);
await page.keyboard.press('KeyE');
await page.waitForSelector('.escolhas.show button', { timeout: 5000 });
await page.locator('.escolhas.show button').nth(2).click(); // guardar
await page.waitForTimeout(500);
ok((await salvas()).find((d) => d.id === 'anao-de-jardim')?.posta === null, 'guardar tira do chão e volta a ser guardado');
ok(await deco(() => window.jogo.current.world.root.userData.decorador.postas('anao-de-jardim')) === 0, 'e o anão some da estufa');
await page.locator('.posicionador [data-botao="pronto"]').click();
await page.waitForTimeout(400);
ok(!(await deco(() => window.jogo.current.world.root.userData.decorador.editando)), 'o botão "pronto" também termina o modo');

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
/**
 * Compra e põe cada enfeite num ponto: a dupla fica `0,85 + raio` atrás dele,
 * olhando para `+Z`. Devolve, de cada um, se ele FICOU no chão e o motivo da
 * barra. O que não coube é cancelado ali mesmo: um enfeite que ficasse na mão
 * seria carregado para o ponto seguinte (e já foi assim que um varal foi
 * parar no pátio no lugar da capivara, com o teste verde).
 */
const comprarEPor = (lista) => page.evaluate(async (lista) => {
  const d = window.jogo.current.world.root.userData.decorador;
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const res = [];
  for (const [id, x, z, raio] of lista) {
    if (!d.guardadas(id)) {
      window.jogo.bump('jardim.girassois', 40);
      d.comprar(id);
    }
    const antes = d.postas(id);
    d.colocar(id);
    window.jogo.debugPlace(x, z - (0.85 + raio), 0);
    await espera(400);
    const motivo = document.querySelector('.posicionador .nao-pode')?.textContent ?? null;
    document.querySelector('.posicionador button.colocar')?.click();
    await espera(300);
    if (d.decorando) {
      document.querySelector('.posicionador [data-botao="cancelar"]')?.click();
      await espera(200);
    }
    res.push({ id, ficou: d.postas(id) === antes + 1, motivo });
  }
  return res;
}, lista);
const colocados = await comprarEPor([
  ['vaso-de-flores', 9.6, 5.9, 0.32], ['flamingo', 9.5, 2.2, 0.26], ['lanterninha', 10.2, 6.6, 0.2],
  ['anao-de-jardim', 10.6, 1.9, 0.24], ['banquinho', -9.4, 6.0, 0.55], ['bebedouro', -10.2, 2.4, 0.34],
]);
console.log('       colocados:', JSON.stringify(colocados));
ok(colocados.every((c) => c.ficou), `os enfeites da foto ficaram no chão (${colocados.filter((c) => c.ficou).length} de ${colocados.length})`);
await page.evaluate(() => { window.jogo.debugPlace(4, 4, 0.8); window.jogo.setZoom(15); });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-estufa-enfeitada.png` });

// ======================== 7b. o que se mexe e o que acende
// o varal vai no terreiro: é lá que ele cabe inteiro, longe do vaso e da lanterna
const acesos = await comprarEPor([['roda-gigante', 9.6, 3.4, 0.36], ['varal-de-luzinhas', 4.2, 2.6, 0.8]]);
ok(acesos.every((c) => c.ficou), `a rodinha e o varal ficaram no chão (${JSON.stringify(acesos)})`);
const vivos = await page.evaluate(async () => {
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  let roda = null;
  const luzes = { halos: 0, pocas: 0 };
  window.jogo.current.world.root.traverse((o) => {
    if (o.userData?.peca === 'enfeite-roda-gigante') roda = o;
    if (['enfeite-lanterna', 'enfeite-varal-de-luzinhas'].includes(o.userData?.peca)) {
      o.traverse((k) => {
        if (k.isSprite) luzes.halos += 1;
        if (k.isMesh && k.material?.blending === 2) luzes.pocas += 1; // AdditiveBlending
      });
    }
  });
  const antes = roda?.userData.roda.rotation.z ?? 0;
  await espera(1500);
  const depois = roda?.userData.roda.rotation.z ?? 0;
  return { temRoda: !!roda, girou: Math.abs(depois - antes), ...luzes };
});
console.log(`       roda girou ${vivos.girou.toFixed(2)} rad · ${vivos.halos} halos, ${vivos.pocas} poças de luz`);
ok(vivos.temRoda && vivos.girou > 0.01, 'a rodinha gigante gira sozinha');
ok(vivos.halos >= 8 && vivos.pocas >= 2, 'a lanterninha e o varal acendem (halo nas lâmpadas e a poça no chão)');

// ======================== 7c. o pátio de fora, a grama e as árvores
const noPatio = await comprarEPor([
  ['capivara', 6.2, -15.2, 0.3], ['lanterninha', -6.4, -18.6, 0.2], ['cata-vento', 1.6, -13.4, 0.14],
]);
console.log('       no pátio:', JSON.stringify(noPatio));
const postosNoPatio = (await salvas()).filter((d) => d.posta && d.posta.z < -11.5).map((d) => d.id).sort();
ok(noPatio.every((c) => c.ficou) && postosNoPatio.join() === 'capivara,cata-vento,lanterninha',
  `dá para enfeitar o pátio de fora (${postosNoPatio.join(', ')})`);
// fora do pátio, pela brecha da sebe, não
await page.evaluate(() => {
  const d = window.jogo.current.world.root.userData.decorador;
  window.jogo.bump('jardim.girassois', 10);
  d.comprar('cogumelos');
  d.colocar('cogumelos');
  window.jogo.debugPlace(0, -24.6, Math.PI);
});
await page.waitForTimeout(600);
const pelaBrecha = await page.locator('.posicionador .nao-pode').textContent().catch(() => '');
ok(/sebe/.test(pelaBrecha ?? ''), `pela brecha, para fora do pátio, não dá ("${(pelaBrecha ?? '').trim()}")`);
await page.keyboard.press('KeyX');
await page.evaluate(() => { window.jogo.debugPlace(3.4, -16.8, 2.3); window.jogo.setZoom(11); });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-patio.png` });

// ======================== 7d. na rodada, enfeite não tem corpo
const colisoresDeEnfeite = () => deco(() => {
  const w = window.jogo.current.world;
  const postas = window.jogo.decoracoes().filter((d) => d.posta);
  return w.colliders.filter((c) => c.kind === 'circle'
    && postas.some((d) => Math.abs(c.x - d.posta.x) < 1e-6 && Math.abs(c.z - d.posta.z) < 1e-6)).length;
});
const foraDaRodada = await colisoresDeEnfeite();
ok(foraDaRodada >= 5, `fora da rodada, cada enfeite tem colisor para a dupla (${foraDaRodada})`);
await page.goto(`${BASE}/?cena=estufa&rodada=1`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.decorador, null, { timeout: 30000 });
await page.waitForTimeout(2500);
const naRodada = await deco(() => window.jogo.current.world.root.userData.decorador.intangivel);
ok(naRodada, 'na rodada, o decorador fica intangível');
ok(await colisoresDeEnfeite() === 0, 'e nenhum enfeite segura a dupla (gota em cima do flamingo dá para pegar)');
await page.screenshot({ path: `${OUT}-rodada.png` });
await page.goto(`${BASE}/?cena=estufa&em=4,4`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.decorador, null, { timeout: 30000 });
await page.waitForTimeout(1200);
ok(!(await deco(() => window.jogo.current.world.root.userData.decorador.intangivel)), 'e fora dela o corpo volta');

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
  window.jogo.bump('jardim.girassois', 10);
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
