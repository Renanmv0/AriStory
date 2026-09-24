/**
 * OS PRÊMIOS DA ESTUFA (`src/minigames/jardim/premios.ts`), pedido do Renan:
 *
 *   1. toda rodada paga reais na carteira do casal — por onda vencida e pelos
 *      marcos alcançados (5, 10, 20, 30) — e a tela do fim mostra quanto;
 *   2. cada marco dá um prêmio ÚNICO na primeira vez: a plaquinha na parede
 *      (5), o chapéu de jardineira (10), o avental (20), e o regador de ouro
 *      com a memória no quadro (30). Da segunda vez, só as moedas. O prêmio
 *      NÃO chega sozinho: o fim da rodada avisa, e a dupla RESGATA na aba de
 *      recompensas do livro da bancada, com um clique;
 *   3. a aba de PRAGAS do livro: cinza até a praga aparecer numa rodada, e
 *      depois o retrato, o nome e a descrição.
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
page.on('pageerror', (e) => { erros.push('PAGEERROR: ' + e.message); console.log('       PAGEERROR', e.message); });
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

/**
 * Vai até a frente do livro e abre. Num save novo o regador do chão (o
 * primeiro passo da estufa) ganha o prompt ali do lado: pega ele antes, como
 * o `livro.mjs` faz — quem joga já pegou há muito tempo.
 */
async function abrirOLivro() {
  const passarFalas = async () => {
    // a fala do regador chega um instante depois do E: espera ela aparecer
    for (let k = 0; k < 20; k++) {
      await page.waitForTimeout(350);
      if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
      else if (k > 4) break;
    }
  };
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.jogo.debugPlace(-12.85, 7.35, -Math.PI / 2));
    await page.waitForTimeout(700);
    const prompt = await page.evaluate(() => document.querySelector('.prompt')?.textContent ?? '');
    if (/livro/i.test(prompt)) break;
    await page.keyboard.press('KeyE');
    await passarFalas();
  }
  await page.keyboard.press('KeyE');
  await page.waitForSelector('.livro-de-cartas.show', { timeout: 8000 });
  await page.waitForTimeout(400);
}

/** vai até o livro, abre, confere a aba e clica em Resgatar no marco pedido */
async function resgatarNoLivro(onda) {
  await abrirOLivro();
  const aba = await page.evaluate(() => document.querySelector('.livro-de-cartas .abas .ativa')?.dataset.aba);
  const prontas = await page.locator('.livro-de-cartas [data-resgatar]').count();
  if (onda === 5) await page.screenshot({ path: `${OUT}-livro-resgatar.png` });
  if (onda === 5) {
    // e no celular: a linha da recompensa quebra, o botão desce inteiro
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}-livro-celular.png` });
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.waitForTimeout(400);
  }
  await page.locator(`.livro-de-cartas [data-resgatar="${onda}"]`).click();
  const falas = [];
  for (let i = 0; i < 60; i++) {
    if (await page.locator('.dialogue.show').count()) {
      falas.push(((await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '').trim());
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(350);
      continue;
    }
    if (falas.length && await page.evaluate(() => window.jogo.player.locked !== true)) break;
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(800);
  return { aba, prontas, falas };
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
const e0 = await enfeites();
ok(!e0.plaquinha, 'o prêmio não chega sozinho: sem resgatar, nada de plaquinha');
ok(perdida.falantes.some((f) => /recompensa nova/.test(f)), 'a Josefina avisa que tem recompensa no livro');
// o resgate, no livro
const r5 = await resgatarNoLivro(5);
console.log(`       livro: abriu na aba "${r5.aba}" com ${r5.prontas} para resgatar`);
ok(r5.aba === 'recompensas' && r5.prontas === 2, 'com recompensa esperando, o livro abre na aba dela, com as duas prontas');
ok(r5.falas.some((f) => /plaquinha/.test(f)), 'resgatar a 5 faz a Josefina entregar a plaquinha');
const e1 = await enfeites();
ok(e1.plaquinha && !e1.trofeu, 'a plaquinha apareceu na estufa, o troféu ainda não');
await page.screenshot({ path: `${OUT}-plaquinha.png` });
const r10 = await resgatarNoLivro(10);
ok(r10.prontas === 1 && r10.falas.some((f) => /chapéu/.test(f)), 'resgatar a 10 entrega o chapéu (e só sobrava ela)');
const chapeu = await page.evaluate(() => [window.jogo.playerId(), window.jogo.companionId()]
  .map((q) => window.jogo.wardrobeItems(q).some((i) => i.id === 'chapeu-de-jardineira')));
ok(chapeu.every(Boolean), 'o chapéu de jardineira foi para o guarda-roupa dos dois');

// ======================================== 3. a mesma de novo: só as moedas
const repetida = await fimDaRodada({ canteiros: 0, ondas: 12, de: 30 });
const carteira2 = await page.evaluate(() => window.jogo.carteira());
ok(carteira2 - carteira1 === 63, 'a segunda rodada igual paga as moedas de novo');
ok((repetida.tela?.marcos.length ?? 0) === 0, 'e não repete prêmio único');
ok(!repetida.falantes.some((f) => /recompensa nova/.test(f)), 'e a Josefina não avisa de recompensa que já foi resgatada');

// ============================================ 4. as trinta: avental, troféu, memória
const vitoria = await fimDaRodada({ canteiros: 5, ondas: 30, de: 30 });
const carteira3 = await page.evaluate(() => window.jogo.carteira());
console.log(`       vitória: tela "${vitoria.tela?.pago}" · marcos ${JSON.stringify(vitoria.tela?.marcos)}`);
ok(carteira3 - carteira2 === 240, `vencer as trinta paga R$ 240 (pagou ${carteira3 - carteira2})`);
ok((vitoria.tela?.marcos.length ?? 0) === 2, 'a vitória destrava os marcos 20 e 30');
await resgatarNoLivro(20);
const r30 = await resgatarNoLivro(30);
ok(r30.falas.some((f) => /regador de ouro/.test(f)), 'resgatar a 30 entrega o regador de ouro');
const e3 = await enfeites();
ok(e3.trofeu, 'o regador de ouro apareceu na bancada');
const avental = await page.evaluate(() => [window.jogo.playerId(), window.jogo.companionId()]
  .map((q) => window.jogo.wardrobeItems(q).some((i) => i.id === 'avental-da-josefina')));
ok(avental.every(Boolean), 'o avental foi para o guarda-roupa dos dois');
const memoria = await page.evaluate(() => window.jogo.flag('jardim.resgate-30'));
ok(memoria, 'a flag que destrava a memória das trinta levas foi marcada');

// ======================================================= 4b. a aba de pragas
// numa rodada de verdade, o bicho que nasce sai do cinza no livro
await page.evaluate(() => {
  const u = window.jogo.current.world.root.userData;
  u.rodada.aoAcabar = null;
  u.comecarRodada();
  u.rodada.plano = [];
  u.rodada.soltarBicho('coelhatu', 0, -4);
  u.rodada.soltarBicho('lagartejo', 2, -4);
});
await page.waitForTimeout(600);
const viu = await page.evaluate(() => ['coelhatu', 'lagartejo', 'escorpicamelo'].map((id) => window.jogo.flag(`jardim.viu-${id}`)));
ok(viu[0] && viu[1] && !viu[2], 'o bicho que nasce na rodada fica "visto"; o que não veio, não');
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.terminar());
await page.waitForTimeout(600);
await abrirOLivro();
await page.locator('.livro-de-cartas [data-aba="pragas"]').click();
await page.waitForTimeout(600);
const pragas = await page.evaluate(() => ({
  vistas: [...document.querySelectorAll('.livro-de-cartas .praga-no-livro:not(.trancada)')].map((el) => ({
    id: el.dataset.praga, foto: el.querySelector('img')?.src.slice(0, 22) ?? '', texto: el.textContent.replace(/\s+/g, ' ').trim(),
  })),
  cinzas: document.querySelectorAll('.livro-de-cartas .praga-no-livro.trancada').length,
}));
console.log(`       pragas: ${pragas.vistas.map((p) => p.id).join(', ')} · ${pragas.cinzas} cinzas`);
ok(pragas.vistas.length === 2 && pragas.cinzas === 11, 'na aba de pragas, as duas vistas aparecem e as outras onze ficam cinzas');
ok(pragas.vistas.every((p) => p.foto.startsWith('data:image/png')), 'cada praga vista tem retrato');
ok(pragas.vistas.some((p) => /Coelhatu/.test(p.texto) && /bolinha/.test(p.texto)), 'com o nome e a descrição do jeito dela');
await page.screenshot({ path: `${OUT}-livro-pragas.png` });
await page.locator('.livro-de-cartas [data-aba="recompensas"]').click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}-livro-recompensas.png` });
await page.locator('.livro-de-cartas .fechar').click();
await page.waitForTimeout(400);

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
