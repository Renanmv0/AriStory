/**
 * OS PRÊMIOS DA ESTUFA (`src/minigames/jardim/premios.ts`), pedido do Renan:
 *
 *   1. toda rodada paga reais na carteira do casal — por onda vencida e pelos
 *      marcos alcançados (5, 10, 20, 30) — e a tela do fim mostra quanto;
 *   2. cada marco dá um prêmio ÚNICO na primeira vez: a plaquinha na parede
 *      (5), o chapéu de jardineira (10), o avental (20), e o regador de ouro
 *      com a memória no quadro (30). Da segunda vez, só as moedas.
 *
 * O teste chama o fim da rodada direto (`rodada.aoAcabar`) com os números de
 * uma rodada inteira: jogar trinta ondas no Chromium sem tela levaria horas.
 *
 *   node scripts/marcos.mjs /tmp/mc
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/mc';
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
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=estufa&em=-10,8`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
await page.waitForTimeout(1500);

const enfeites = () => page.evaluate(() => {
  const e = window.jogo.current.world.root.userData.enfeites;
  return { plaquinha: !!e.plaquinha, trofeu: !!e.trofeu };
});

/** chama o fim da rodada com estes números, e conduz a tela e as falas até o fim */
async function fimDaRodada(fim) {
  await page.evaluate((f) => {
    window.__falas = [];
    window.jogo.current.world.root.userData.rodada.aoAcabar({
      total: 8, espantados: 40, porPraga: { lagartejo: 40 }, cartas: [], novas: [], nivel: 30, motivo: 'fim', ...f,
    });
  }, fim);
  let tela = null;
  const falantes = [];
  for (let i = 0; i < 90; i++) {
    const aberta = await page.evaluate(() => document.querySelector('.fim-do-jardim')?.classList.contains('show'));
    if (aberta) {
      if (!tela) {
        await page.waitForTimeout(400);
        tela = await page.evaluate(() => ({
          pago: document.querySelector('.fim-do-jardim .pagamento b')?.textContent ?? '',
          marcos: [...document.querySelectorAll('.fim-do-jardim .marco')].map((m) => m.textContent.replace(/\s+/g, ' ').trim()),
        }));
      }
      await page.locator('.fim-do-jardim .fechar').click();
      await page.waitForTimeout(400);
      continue;
    }
    if (await page.locator('.dialogue.show').count()) {
      const quem = ((await page.locator('.dialogue .who').textContent().catch(() => '')) ?? '').trim();
      const texto = ((await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '').trim();
      falantes.push(`${quem}: ${texto}`);
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(350);
      continue;
    }
    const livre = await page.evaluate(() => window.jogo.player.locked !== true);
    if (tela && livre) break;
    await page.waitForTimeout(250);
  }
  return { tela, falantes };
}

// ========================================= 1. estufa sem marco nenhum ainda
const antes = await enfeites();
ok(!antes.plaquinha && !antes.trofeu, 'sem marco, a estufa não tem plaquinha nem regador de ouro');
const carteira0 = await page.evaluate(() => window.jogo.carteira());

// ============================ 2. uma rodada perdida na onda 12: paga, e dá 5 e 10
const perdida = await fimDaRodada({ canteiros: 0, ondas: 12, de: 30 });
const carteira1 = await page.evaluate(() => window.jogo.carteira());
console.log(`       perdida na 12: tela "${perdida.tela?.pago}" · marcos ${JSON.stringify(perdida.tela?.marcos)}`);
// 11 vencidas × 3 + 10 + 20
ok(carteira1 - carteira0 === 63, `rodada perdida na onda 12 paga R$ 63 (pagou ${carteira1 - carteira0})`);
ok(/63/.test(perdida.tela?.pago ?? ''), 'a tela do fim mostra o pagamento');
ok((perdida.tela?.marcos.length ?? 0) === 2, 'a tela do fim mostra os dois marcos novos (5 e 10)');
const e1 = await enfeites();
ok(e1.plaquinha && !e1.trofeu, 'a plaquinha apareceu na estufa, o troféu ainda não');
const chapeu = await page.evaluate(() => [window.jogo.playerId(), window.jogo.companionId()]
  .map((q) => window.jogo.wardrobeItems(q).some((i) => i.id === 'chapeu-de-jardineira')));
ok(chapeu.every(Boolean), 'o chapéu de jardineira foi para o guarda-roupa dos dois');
ok(perdida.falantes.some((f) => /plaquinha/.test(f)) && perdida.falantes.some((f) => /chapéu/.test(f)),
  'a Josefina entrega a plaquinha e o chapéu');

// ======================================== 3. a mesma de novo: só as moedas
const repetida = await fimDaRodada({ canteiros: 0, ondas: 12, de: 30 });
const carteira2 = await page.evaluate(() => window.jogo.carteira());
ok(carteira2 - carteira1 === 63, 'a segunda rodada igual paga as moedas de novo');
ok((repetida.tela?.marcos.length ?? 0) === 0, 'e não repete prêmio único');
ok(!repetida.falantes.some((f) => /chapéu/.test(f)), 'a Josefina não entrega o chapéu duas vezes');

// ============================================ 4. as trinta: avental, troféu, memória
const vitoria = await fimDaRodada({ canteiros: 5, ondas: 30, de: 30 });
const carteira3 = await page.evaluate(() => window.jogo.carteira());
console.log(`       vitória: tela "${vitoria.tela?.pago}" · marcos ${JSON.stringify(vitoria.tela?.marcos)}`);
ok(carteira3 - carteira2 === 240, `vencer as trinta paga R$ 240 (pagou ${carteira3 - carteira2})`);
ok((vitoria.tela?.marcos.length ?? 0) === 2, 'a vitória destrava os marcos 20 e 30');
const e3 = await enfeites();
ok(e3.trofeu, 'o regador de ouro apareceu na bancada');
const avental = await page.evaluate(() => [window.jogo.playerId(), window.jogo.companionId()]
  .map((q) => window.jogo.wardrobeItems(q).some((i) => i.id === 'avental-da-josefina')));
ok(avental.every(Boolean), 'o avental foi para o guarda-roupa dos dois');
const memoria = await page.evaluate(() => window.jogo.flag('jardim.marco-30'));
ok(memoria, 'a flag que destrava a memória das trinta levas foi marcada');

// ======================================= 5. voltar na estufa: os enfeites ficam
await page.goto(`${BASE}/?cena=estufa&em=-12.4,7.6`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.enfeites, null, { timeout: 30000 });
await page.waitForTimeout(1800);
const e5 = await enfeites();
ok(e5.plaquinha && e5.trofeu, 'numa visita nova, a plaquinha e o troféu continuam lá');
await page.evaluate(() => { window.jogo.setZoom(6); });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}-enfeites.png` });

// ============================================ 6. as duas roupas, vestidas
await page.evaluate(() => {
  const j = window.jogo;
  for (const q of [j.playerId(), j.companionId()]) {
    for (const id of ['chapeu-de-jardineira', 'avental-da-josefina']) {
      const peca = j.wardrobeItems(q).find((i) => i.id === id);
      if (peca) j.equipWearable(peca, q);
    }
  }
  j.debugPlace(-6, 2, 0.4);
});
await page.waitForTimeout(1500);
await page.evaluate(() => { window.jogo.setZoom(3.6); window.jogo.focusCamera(null); });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}-roupas.png` });
const vestidos = await page.evaluate(() => window.jogo.wearables().map((i) => i?.id ?? null));
ok(vestidos.includes('chapeu-de-jardineira') && vestidos.includes('avental-da-josefina'), 'dá para vestir o chapéu e o avental');
// andando: a coxa não pode furar o avental
await page.keyboard.down('KeyD');
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-andando.png` });
await page.keyboard.up('KeyD');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
