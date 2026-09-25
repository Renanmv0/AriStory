/**
 * AS TELAS DE PRÊMIO DO NÍVEL, com o dedo nervoso.
 *
 * O defeito que isto guarda (o Ari perdeu uma rodada inteira por ele): no
 * nível 10 a rodada abre TRÊS telas de carta seguidas (a de sempre e as duas
 * de prêmio). Um "pegar" a mais durante o pulinho da carta pega — o segundo
 * toque de quem bate duas vezes no celular — agendava um segundo fechamento,
 * que disparava depois de a tela de prêmio seguinte já ter aberto e a
 * escondia com a escolha pendente. A rodada ficava pausada para sempre: bichos
 * parados, painel congelado, a dupla andando, e nenhuma tela para escolher.
 *
 * O teste sobe do 4 para o 5 (uma de prêmio) e do 9 para o 10 (duas), e em
 * CADA tela aperta "pegar" duas vezes, a segunda 120 ms depois da primeira.
 * Tem que dar: toda tela aparece, cada uma põe uma carta na mão, e no fim a
 * rodada volta a andar.
 *
 *   node scripts/premioDeNivel.mjs /tmp/pn
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/pn';
const BASE = process.env.BASE ?? 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const erros = [];
page.on('pageerror', (e) => erros.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_CERT|net::ERR_/.test(m.text())) erros.push(m.text()); });

await page.goto(`${BASE}/?cena=estufa&em=0,2`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
await page.mouse.click(195, 420);

const falhas = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'} ${msg}`);
  if (!cond) falhas.push(msg);
};
const estado = () => page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());
const telaAberta = () => page.evaluate(() => window.jogo.ui.cartasOpen);

await page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  r.aoAcabar = null;
  if (r.rodando) r.terminar();
  window.jogo.current.world.root.userData.comecarRodada();
  // a carta de canteiro pergunta qual; aqui o primeiro serve
  r.escolhaForcada = 0;
});
await page.waitForTimeout(500);

/** do nível `de` para o seguinte, com dois "pegar" em cada tela; devolve quantas telas vieram */
async function subirComDedoNervoso(de) {
  await page.evaluate((n) => {
    const r = window.jogo.current.world.root.userData.rodada;
    r.fixarNivel(n);
    // a mesma chamada que a gota faz ao passar do nível (`receberGotas`)
    void r.subir(n + 1);
  }, de);
  let telas = 0;
  for (let espera = 0; espera < 120; espera++) {
    if (await telaAberta()) {
      telas += 1;
      if (telas === 2) await page.screenshot({ path: `${OUT}-premio-${de + 1}.png` });
      await page.evaluate(() => new Promise((pronto) => {
        const ui = window.jogo.ui;
        ui.teclaDasCartas('um');
        ui.teclaDasCartas('pegar');
        // o segundo toque, no meio do pulo da carta pega
        window.setTimeout(() => { ui.teclaDasCartas('pegar'); pronto(); }, 120);
      }));
      // espera o pulo acabar e a próxima tela (se houver) abrir
      await page.waitForTimeout(900);
      continue;
    }
    if (await page.evaluate(() => window.jogo.ui.dialogueOpen)) {
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(250);
      continue;
    }
    const e = await estado();
    if (!e.pausada) break;
    await page.waitForTimeout(250);
  }
  return telas;
}

for (const [de, esperadas] of [[4, 2], [9, 3]]) {
  const antes = await estado();
  const telas = await subirComDedoNervoso(de);
  const depois = await estado();
  ok(telas === esperadas, `do ${de} para o ${de + 1}: ${telas} telas de carta (esperadas ${esperadas}, a de sempre e ${esperadas - 1} de prêmio)`);
  ok(!depois.pausada, `depois do nível ${de + 1} a rodada volta a andar (pausada: ${depois.pausada})`);
  ok(!(await telaAberta()), 'e nenhuma tela ficou aberta');
  const novas = depois.mao.length - antes.mao.length;
  // consolo não entra na mão: aceita menos, nunca mais
  ok(novas <= esperadas && novas >= 1, `cada tela pegou uma carta, sem pegar duas (${novas} novas na mão)`);
}

await page.screenshot({ path: `${OUT}-depois.png` });
ok(erros.length === 0, `sem erro no console${erros.length ? ': ' + erros.join(' | ') : ''}`);
await browser.close();
if (falhas.length) {
  console.log(`\n${falhas.length} falha(s)`);
  process.exit(1);
}
console.log('\ntudo certo');
