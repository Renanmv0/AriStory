/**
 * A CARTEIRA DO CASAL e o PRÊMIO das três estrelas.
 *
 * Duas coisas que vão ser usadas por tudo que vier depois — todo minigame que
 * pagar, toda loja que o jogo tiver — e por isso valem um teste próprio.
 *
 * O que este teste guarda:
 *
 * - a CARTEIRA É UMA SÓ. A mochila do Ari e a do Renan mostram o mesmo número,
 *   sempre. É a regra que o Renan pediu, e ela está escrita na estrutura do
 *   save (`carteira` no nível de cima, e não dentro de `inventarios`) — este
 *   teste é o que impede alguém de "consertar" isso para uma por pessoa;
 * - ela ATRAVESSA O RELOAD, porque é progresso e não estado de tela;
 * - `gastar` RECUSA sem tirar nada quando falta dinheiro, e nunca deixa o saldo
 *   negativo. É a garantia de que uma loja futura pode perguntar e pagar na
 *   mesma chamada;
 * - o TURNO PAGA NA CARTEIRA, e não só no placar do dia;
 * - TRÊS ESTRELAS GANHAM A GRAVATINHA do Walter, ela entra no guarda-roupa dos
 *   DOIS, e ela NÃO existe antes disso — presente que aparece de graça deixa de
 *   ser presente.
 *
 * Uso: node scripts/premio.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './premio';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const saldoNaTela = async () => {
  await page.keyboard.press('KeyI');
  await page.waitForTimeout(500);
  const texto = await page.locator('.mochila .saldo').textContent().catch(() => '');
  const dono = await page.locator('.mochila .dono').textContent().catch(() => '');
  await page.keyboard.press('KeyI');
  await page.waitForTimeout(300);
  return { dono: (dono ?? '').trim(), saldo: (texto ?? '').trim() };
};

const venceAFala = async (voltas = 60) => {
  const ditas = [];
  for (let i = 0; i < voltas; i++) {
    if (await page.locator('.escolhas.show button').count()) {
      await page.locator('.escolhas.show button').first().click();
      await page.waitForTimeout(450);
      continue;
    }
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 12) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(420);
  }
  return ditas;
};

await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(500);

// ================================================ 1. a carteira é uma só
const vazia = await saldoNaTela();
await page.evaluate(() => window.jogo.ganhar(50));
const doPrimeiro = await saldoNaTela();
await page.keyboard.press('KeyT');
await page.waitForTimeout(900);
const doSegundo = await saldoNaTela();

// ================================================ 2. gastar, e não estourar
const contas = await page.evaluate(() => {
  const antes = window.jogo.carteira();
  const demais = window.jogo.gastar(999);
  const depoisDeRecusar = window.jogo.carteira();
  const deu = window.jogo.gastar(20);
  return { antes, demais, depoisDeRecusar, deu, depois: window.jogo.carteira() };
});

// ================================================ 3. atravessa o reload
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
await page.mouse.click(500, 440);
await page.waitForTimeout(500);
const depoisDoReload = await saldoNaTela();

// ============================ 4. antes das 3 estrelas não existe gravatinha
const antesDoPremio = await page.evaluate(() => ({
  flag: !!(JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').flags ?? {})['gravata-do-walter'],
  armario: window.jogo.wardrobeItems().map((i) => i.id),
}));

// ================================ 5. um turno que fecha com três estrelas
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  s.flags = { ...(s.flags ?? {}), 'turno-aceito': true, 'primeiro-turno': true };
  localStorage.setItem('aristory.save.v1', JSON.stringify(s));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(500);

await page.evaluate(() => window.jogo.debugPlace(2.4, -7.5, 0));
await page.waitForTimeout(1200);
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
await venceAFala(12);
await page.waitForTimeout(1500);

/**
 * O FIM DO TURNO É FORÇADO POR DENTRO: 250 no caixa (o limiar das três
 * estrelas é 220), o relógio a zero e o salão vazio. Jogar um turno inteiro
 * bem o bastante para tirar três estrelas levaria minutos de relógio no
 * Chromium sem tela, e não é isso que este teste está medindo.
 */
const forcou = await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  if (!t || !t.rodando) return false;
  for (const c of [...t.clientes]) t.apagarCliente(c);
  t.dinheiro = 250;
  t.tempo = 0;
  return true;
});
const falasDoPremio = await venceAFala(70);
await page.waitForTimeout(1200);

const depoisDoPremio = await page.evaluate(() => ({
  flag: !!(JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').flags ?? {})['gravata-do-walter'],
  armarioDoJogador: window.jogo.wardrobeItems().map((i) => i.id),
  armarioDoParceiro: window.jogo.wardrobeItems(window.jogo.companionId()).map((i) => i.id),
  carteira: window.jogo.carteira(),
}));

// ============================================ 6. e ela veste, e aparece
const vestiu = await page.evaluate(() => {
  const peca = window.jogo.wardrobeItems().find((i) => i.id === 'gravata-do-walter');
  if (!peca) return null;
  window.jogo.equipWearable(peca);
  return window.jogo.wearables().map((i) => i?.id ?? null);
});
await page.waitForTimeout(900);
await page.evaluate(() => {
  window.jogo.setZoom(4.2);
  window.jogo.focusCamera(null);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}-gravata.png` });

// ======================================================================= laudo
const falhas = [];
if (vazia.saldo !== 'R$ 0') falhas.push(`a carteira nao comeca zerada: "${vazia.saldo}"`);
if (doPrimeiro.saldo !== 'R$ 50') falhas.push(`ganhar(50) nao apareceu na mochila: "${doPrimeiro.saldo}"`);
if (doSegundo.saldo !== doPrimeiro.saldo) {
  falhas.push(`as duas mochilas mostram valores diferentes: ${doPrimeiro.dono} ${doPrimeiro.saldo} x ${doSegundo.dono} ${doSegundo.saldo}`);
}
if (doSegundo.dono === doPrimeiro.dono) falhas.push('o T nao trocou de personagem: o teste nao provou nada');
if (contas.demais !== false) falhas.push('gastar aceitou mais do que tinha');
if (contas.depoisDeRecusar !== contas.antes) falhas.push('gastar recusado mexeu no saldo mesmo assim');
if (contas.deu !== true || contas.depois !== contas.antes - 20) {
  falhas.push(`gastar(20) nao debitou certo: ${JSON.stringify(contas)}`);
}
if (depoisDoReload.saldo !== 'R$ 30') falhas.push(`a carteira nao sobreviveu ao reload: "${depoisDoReload.saldo}"`);
if (antesDoPremio.flag) falhas.push('a flag da gravatinha ja vinha ligada');
if (antesDoPremio.armario.includes('gravata-do-walter')) {
  falhas.push('a gravatinha estava no guarda-roupa antes das tres estrelas');
}
if (!forcou) falhas.push('o turno nao chegou a comecar');
if (!falasDoPremio.some((f) => /gravata/i.test(f))) {
  falhas.push('o Walter nao falou da gravata nas tres estrelas');
}
if (!depoisDoPremio.flag) falhas.push('as tres estrelas nao gravaram a flag da gravatinha');
for (const [quem, lista] of [['jogador', depoisDoPremio.armarioDoJogador], ['parceiro', depoisDoPremio.armarioDoParceiro]]) {
  if (!lista.includes('gravata-do-walter')) falhas.push(`a gravatinha nao entrou no guarda-roupa do ${quem}`);
}
if (depoisDoPremio.carteira < 30) falhas.push('a carteira encolheu durante o turno');
if (!vestiu || !vestiu.includes('gravata-do-walter')) {
  falhas.push(`vestir a gravatinha nao ocupou a vaga de cabeca: ${JSON.stringify(vestiu)}`);
}
falhas.push(...erros);

console.log('1. carteira:', JSON.stringify(vazia), '→', JSON.stringify(doPrimeiro),
  '· o outro:', JSON.stringify(doSegundo));
console.log('2. gastar:', JSON.stringify(contas));
console.log('3. depois do reload:', JSON.stringify(depoisDoReload));
console.log('4. antes do premio:', JSON.stringify(antesDoPremio));
console.log('5. falas do premio:', JSON.stringify(falasDoPremio.filter((f) => /gravata|estrela|Walter/i.test(f))));
console.log('   depois:', JSON.stringify(depoisDoPremio));
console.log('6. vestida:', JSON.stringify(vestiu));

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
