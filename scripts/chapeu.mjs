/**
 * O chapéu de campeão com a cabeça OCUPADA.
 *
 * Ganhar do parceiro de gorro na cabeça não entregava nada: o `equipWearable`
 * recusa vaga ocupada e o chapéu sumia. Agora ele vai para o guarda-roupa de
 * quem ganhou, e a vitória fica anotada — o chapéu volta a cada armário aberto
 * (e a cada troca de cena), como as compras e os prêmios do quadro.
 *
 * A partida não é jogada ponto a ponto (isso é o `pingpong.mjs`): o teste
 * começa uma e chama o `onFim(true)` dela, que é o mesmo caminho da vitória.
 *
 * Uso: node scripts/chapeu.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './chapeu';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const CHAPEU = 'chapeu-ping-pong';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-14.5,26&olhar=3.14`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// um gorro na cabeça de quem vai jogar: é a vaga que o chapéu quer
const antes = await page.evaluate(() => {
  const j = window.jogo;
  const vestiu = j.equipWearable(window.aristoryItens['gorro-la']);
  return { vestiu, quem: j.playerId(), parceiro: j.companionId() };
});

// começa a partida pela mesa, dizendo que sim
await page.keyboard.press('KeyE');
const escolhas = page.locator('.dialogue .escolhas.show button');
for (let i = 0; i < 12; i++) {
  await page.waitForTimeout(300);
  if (await escolhas.count()) {
    const sim = (await escolhas.allTextContents()).findIndex((r) => /bora/i.test(r));
    await escolhas.nth(sim >= 0 ? sim : 0).click();
    break;
  }
}
for (let i = 0; i < 4; i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
}
await page.waitForTimeout(1200);

// e ganha: o mesmo `onFim` que a partida chama no quinto ponto
const adversario = await page.evaluate(() => {
  let p = null;
  window.jogo.current.world.root.traverse((o) => {
    if (!p && o.userData?.pingpong) p = o.userData.pingpong;
  });
  window.__ping = p;
  p.meus = 5;
  p.onFim(true);
  return p.adversario?.id ?? null;
});
await page.waitForTimeout(800);
const toast = await page.locator('.toast').allTextContents().catch(() => []);
for (let i = 0; i < 10; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
await page.waitForTimeout(800);

const ganhou = await page.evaluate(({ quem, parceiro, CHAPEU }) => {
  const j = window.jogo;
  const ids = (l) => l.map((i) => i?.id ?? null);
  return {
    vestindo: ids(j.wearables(quem)),
    armario: ids(j.wardrobeItems(quem)),
    naCabeca: j.player.rig.campeao,
    flag: j.flag(`chapeu-ping-pong:${quem}`),
    doParceiro: j.flag(`chapeu-ping-pong:${parceiro}`)
      || ids(j.wardrobeItems(parceiro)).includes(CHAPEU)
      || ids(j.wearables(parceiro)).includes(CHAPEU),
  };
}, { ...antes, CHAPEU });

// descartado, ele volta no próximo guarda-roupa aberto
const reposto = await page.evaluate(({ quem, CHAPEU }) => {
  const j = window.jogo;
  j.removeItem(CHAPEU, quem);
  const sumiu = !j.wardrobeItems(quem).some((i) => i.id === CHAPEU);
  j.abrirGuardaRoupa();
  const voltou = j.wardrobeItems(quem).some((i) => i.id === CHAPEU);
  return { sumiu, voltou };
}, { ...antes, CHAPEU });

// e se veste pelo painel, trocando com o gorro — no corpo E no boneco
const vestido = await page.evaluate(({ quem, CHAPEU }) => {
  const j = window.jogo;
  const trocou = j.vestirPeca(quem, CHAPEU);
  j.pintarArmario();
  const ids = (l) => l.map((i) => i?.id ?? null);
  return {
    trocou,
    cabeca: j.wearables(quem)[0]?.id ?? null,
    gorroNoArmario: ids(j.wardrobeItems(quem)).includes('gorro-la'),
    noBoneco: j.previa.rig?.campeao ?? null,
  };
}, { ...antes, CHAPEU });
await page.waitForTimeout(900);
// o corpo do mundo le a vaga no quadro seguinte (`sincronizarVestiveis`)
vestido.naCabeca = await page.evaluate(() => window.jogo.player.rig.campeao);
await page.screenshot({ path: `${OUT}-armario.png` });

// tirado e descartado de novo, a troca de cena também devolve
const cena = await page.evaluate(async ({ quem, CHAPEU }) => {
  const j = window.jogo;
  j.ui.fecharArmario();
  j.removeItem(CHAPEU, quem);
  return true;
}, { ...antes, CHAPEU });
await page.goto(`${BASE}/?cena=villa-lobos&em=-14.5,26&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const depoisDeRecarregar = await page.evaluate(({ quem, CHAPEU }) => {
  const j = window.jogo;
  return j.wardrobeItems(quem).some((i) => i.id === CHAPEU)
    && !j.wearables(quem).some((i) => i?.id === CHAPEU);
}, { ...antes, CHAPEU });

console.log('gorro vestido antes da partida:', antes.vestiu, '· adversário:', adversario);
console.log('toast:', JSON.stringify(toast));
console.log('depois de ganhar:', JSON.stringify(ganhou));
console.log('descartado some e volta no guarda-roupa:', JSON.stringify(reposto));
console.log('vestido pelo painel:', JSON.stringify(vestido));
console.log('recarregando, volta no armário e não na cabeça:', cena && depoisDeRecarregar);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  antes.vestiu &&
  adversario === 'parceiro' &&
  // o gorro fica, o chapéu vai pro armário, e o direito fica anotado
  ganhou.vestindo[0] === 'gorro-la' &&
  ganhou.armario.includes(CHAPEU) &&
  !ganhou.naCabeca &&
  ganhou.flag &&
  !ganhou.doParceiro &&
  reposto.sumiu && reposto.voltou &&
  vestido.trocou && vestido.cabeca === CHAPEU && vestido.gorroNoArmario &&
  vestido.naCabeca && vestido.noBoneco === true &&
  depoisDeRecarregar;

await browser.close();
process.exit(ok ? 0 : 1);
