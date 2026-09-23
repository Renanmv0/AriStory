/**
 * A RODADA DO JARDIM — a etapa 3, jogada de ponta a ponta.
 *
 * `?cena=estufa&rodada=1` começa a rodada direto (sem a conversa com a
 * Josefina; a conversa e os postos são do `postos.mjs`). Um ROBÔ joga: ele
 * leva a dupla até a 2 m do bicho mais perto dentro da estufa e pisa nas
 * gotas — e NUNCA aperta tecla de ataque, que é o ponto: o regador atira
 * sozinho. O relógio da rodada roda 3× (`escalaDoTempo`), porque o Chromium
 * sem tela já anda a ~1/5 e a onda inteira não caberia.
 *
 * O que o teste cobra:
 *
 * 1. a rodada liga, o painel aparece e TODO ponto da cena desliga (a porta
 *    de volta, o regar, a conversa);
 * 2. os bichos nascem do lado de FORA da sebe e atravessam brecha e portão;
 * 3. o regador atira sozinho, espanta, e as gotas pegas sobem o nível;
 * 4. perto do tonel o tanque ENCHE;
 * 5. com a tela das cartas aberta a rodada CONGELA (nenhum bicho se mexe);
 * 6. a carta pega entra na mão;
 * 7. a onda acaba, os canteiros voltam inteiros, os pontos religam e a
 *    Josefina fala.
 *
 * Uso: node scripts/rodada.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './rodada';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com `scenes/estufa.ts`: a sebe do fundo do pátio */
const FUNDO_DE_FORA = -25;
const PAREDE_DOS_PORTOES = -11;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 760 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
const problemas = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) problemas.push(msg);
};

await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=estufa&em=0,-2&zoom=14&rodada=1`, { waitUntil: 'networkidle' });
for (let i = 0; i < 40; i++) {
  if (await page.evaluate(() => window.jogo?.current?.world?.root?.userData?.rodada?.estado().rodando)) break;
  await page.waitForTimeout(250);
}
await page.evaluate(() => { window.jogo.current.world.root.userData.rodada.escalaDoTempo = 3; });
const estado = () => page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());
const pontosAcesos = () => page.evaluate(() => window.jogo.current.world.interactables.filter((p) => p.enabled).length);

// ------------------------------------------------------------- 1. liga
{
  const e = await estado();
  ok(e.rodando && e.onda === 1, 'a rodada ligou na onda 1');
  ok(await page.locator('.painel-jardim.show').count() === 1, 'o painel da rodada aparece (onda, agua, canteiros)');
  ok(await pontosAcesos() === 0, 'nenhum ponto da cena fica aceso durante a rodada');
  await page.screenshot({ path: `${OUT}-comeco.png` });
}

// ------------------------------------------------------------- o robô
/** anda até uma gota, ou até 2 m do bicho mais perto dentro da estufa */
const robo = () => page.evaluate(() => {
  const j = window.jogo;
  const r = j.current.world.root.userData.rodada;
  const eu = j.playerPosition();
  const gotas = r.gotasNoChao().filter((g) => g.z > -10.5);
  if (gotas.length) {
    j.player.teleport(gotas[0].x, gotas[0].z, 0);
    return;
  }
  const bichos = r.estado().invasores.filter((b) => b.z > -10 && (b.estado === 'andando' || b.estado === 'comendo'));
  if (!bichos.length) return;
  bichos.sort((a, b) => Math.hypot(a.x - eu.x, a.z - eu.z) - Math.hypot(b.x - eu.x, b.z - eu.z));
  const b = bichos[0];
  const d = Math.hypot(b.x - eu.x, b.z - eu.z);
  if (d > 2.2) {
    const k = (d - 2) / d;
    j.player.teleport(eu.x + (b.x - eu.x) * k, eu.z + (b.z - eu.z) * k, 0);
  }
});

let nasceuFora = false;
let passouPeloPortao = false;
let congelou = null;
let cartasPegas = 0;
let testouTonel = false;
let fotoPatio = false;
let fim = null;

for (let i = 0; i < 700; i++) {
  // ---- 5 e 6: a tela de cartas congela a rodada, e a carta entra na mão
  if (await page.locator('.cartas-do-jardim.show').count()) {
    const antes = await estado();
    await page.waitForTimeout(900);
    const depois = await estado();
    const mexeu = antes.invasores.some((b, k) => depois.invasores[k]
      && Math.hypot(b.x - depois.invasores[k].x, b.z - depois.invasores[k].z) > 0.01);
    if (congelou === null) congelou = depois.pausada && !mexeu;
    if (cartasPegas === 0) await page.screenshot({ path: `${OUT}-cartas.png` });
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(300);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(900);
    cartasPegas += 1;
    continue;
  }
  if (await page.locator('.dialogue.show').count()) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (/primeira leva/i.test(t ?? '')) fim = t;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
    continue;
  }
  const e = await estado();
  if (!e.rodando) break;

  // ---- 2: nasce fora da sebe, e passa pelo portão
  for (const b of e.invasores) {
    if (b.z < FUNDO_DE_FORA) nasceuFora = true;
    if (b.z > PAREDE_DOS_PORTOES + 1 && b.estado === 'andando') passouPeloPortao = true;
  }
  if (!fotoPatio && e.invasores.length >= 2) {
    await page.screenshot({ path: `${OUT}-patio.png` });
    fotoPatio = true;
  }

  // ---- 4: o tonel, uma vez, no meio da onda
  if (!testouTonel && e.jatosDados >= 3) {
    testouTonel = true;
    const antes = await page.evaluate(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.agua = 1;
      const t = { x: -13.8, z: -7.4 };
      window.jogo.player.teleport(t.x + 1.2, t.z, 0);
      return r.agua;
    });
    let agora = antes;
    for (let k = 0; k < 30 && agora < antes + 2; k++) {
      await page.waitForTimeout(250);
      agora = (await estado()).agua;
    }
    await page.screenshot({ path: `${OUT}-tonel.png` });
    ok(agora >= antes + 2, `perto do tonel o tanque enche (${antes.toFixed(1)} → ${agora.toFixed(1)})`);
  }

  await robo();
  await page.waitForTimeout(350);
  if (i % 12 === 0) {
    console.log(`       onda ${e.onda} · agua ${e.agua.toFixed(1)} · nivel ${e.nivel} · espantados ${e.espantados} · faltam ${e.faltamEntrar} · bichos ${e.invasores.length} · mao [${e.mao}]`);
  }
}

// o fim: a fala da Josefina pode ainda estar na tela
for (let i = 0; i < 20; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (/primeira leva/i.test(t ?? '')) fim = t;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
}

const e = await estado();
ok(nasceuFora, 'os bichos nascem do lado de fora da sebe do patio');
ok(passouPeloPortao, 'e entram pela brecha e pelo portao');
ok(e.jatosDados > 0, `o regador atirou sozinho ${e.jatosDados} vezes, sem tecla`);
ok(e.espantados > 0, `${e.espantados} bichos espantados`);
ok(e.juntadas > 0 && e.nivel >= 1, `as gotas pegas subiram o nivel (${e.juntadas} gotas, nivel ${e.nivel})`);
ok(congelou === true, 'com a tela de cartas aberta a rodada congela');
ok(e.mao.length >= 1, `a carta pega entrou na mao [${e.mao}]`);
ok(!e.rodando, 'a onda acabou e a rodada fechou');
ok(e.canteiros.every((c) => c.vida === c.vidaMax), 'os canteiros voltam inteiros (a Josefina replanta)');
ok(await pontosAcesos() > 0, 'os pontos da cena religam');
ok(await page.locator('.painel-jardim.show').count() === 0, 'o painel some');
ok(!!fim, 'a Josefina fala do fim da primeira leva');
await page.screenshot({ path: `${OUT}-fim.png` });

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
