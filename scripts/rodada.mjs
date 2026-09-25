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
await page.evaluate(() => { const r = window.jogo.current.world.root.userData.rodada; r.escalaDoTempo = 3; r.ondasDaRodada = 1; });
const musicaNaRodada = await page.evaluate(() => window.jogo.climaDaMusica);
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
let testouVida = false;
let fotoPatio = false;
let fim = null;
let telaDoFim = '';

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
  // a tela do fim da rodada vem antes da fala da Josefina: anota e fecha
  if (await page.locator('.fim-do-jardim.show').count()) {
    telaDoFim = (await page.locator('.fim-do-jardim .numeros').textContent()) ?? '';
    await page.locator('.fim-do-jardim .fechar').click();
    await page.waitForTimeout(400);
    continue;
  }
  if (await page.locator('.dialogue.show').count()) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (/leva/i.test(t ?? '')) fim = t;
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

  // ---- 5: a vida cresce com a onda — um lagartejo da onda 20 nasce ×1,74
  if (!testouVida && e.onda === 1 && e.invasores.some((b) => b.praga === 'lagartejo')) {
    testouVida = true;
    const base = e.invasores.find((b) => b.praga === 'lagartejo').vidaMax;
    const ids0 = await page.evaluate(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.onda = 20;
      r.agendar('lagartejo', 0, 0);
      return r.estado().invasores.length;
    });
    await page.waitForTimeout(500);
    const tarde = await page.evaluate(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.onda = 1;
      return r.estado().invasores.filter((b) => b.praga === 'lagartejo').map((b) => b.vidaMax);
    });
    const maior = Math.max(...tarde);
    ok(Math.abs(maior / base - 1.74) < 0.02, `o lagartejo da onda 20 nasce com ${(maior / base).toFixed(2)}× a vida do da onda 1 (${base} → ${maior.toFixed(1)}; ${ids0} bichos)`);
  }

  await robo();
  await page.waitForTimeout(350);
  if (i % 12 === 0) {
    console.log(`       onda ${e.onda} · agua ${e.agua.toFixed(1)} · nivel ${e.nivel} · espantados ${e.espantados} · faltam ${e.faltamEntrar} · bichos ${e.invasores.length} · mao [${e.mao}]`);
  }
}

// o fim: a fala da Josefina pode ainda estar na tela
for (let i = 0; i < 20; i++) {
  if (await page.locator('.fim-do-jardim.show').count()) {
    telaDoFim = (await page.locator('.fim-do-jardim .numeros').textContent()) ?? '';
    await page.locator('.fim-do-jardim .fechar').click();
    await page.waitForTimeout(400);
    continue;
  }
  if (!(await page.locator('.dialogue.show').count())) break;
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (/leva/i.test(t ?? '')) fim = t;
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
ok(/espantados/.test(telaDoFim), `a tela do fim conta a rodada (${telaDoFim.replace(/\s+/g, ' ').trim()})`);
ok(!!fim, 'depois dela a Josefina fala do fim da rodada');
ok(musicaNaRodada === 'rodada-do-jardim', `na rodada toca a música da defesa (${musicaNaRodada})`);
const musicaDepois = await page.evaluate(() => window.jogo.climaDaMusica);
ok(musicaDepois === 'estufa', `no fim volta a música da estufa (${musicaDepois})`);
await page.screenshot({ path: `${OUT}-fim.png` });

/*
 * AS CINCO ONDAS. Jogar as cinco no Chromium sem tela levaria meia hora, então
 * aqui cada onda é ESVAZIADA à mão (o roteiro e os bichos somem) e o teste
 * confere a costura entre elas: o respiro, o aviso da onda nova com o bicho
 * que estreia, o roteiro da onda certa, e o grandão anunciado antes de nascer.
 */
{
  await page.evaluate(() => {
    const u = window.jogo.current.world.root.userData;
    const r = u.rodada;
    r.aoAcabar = null;
    window.jogo.debugPlace(0, 2, Math.PI);
    u.comecarRodada();
    r.escalaDoTempo = 3;
    r.ondasDaRodada = 5;
    // o prêmio das ondas sobe o nível: sem isto a tela de cartas abriria no meio
    r.fixarNivel(99);
  });
  const esvaziar = () => page.evaluate(() => {
    const r = window.jogo.current.world.root.userData.rodada;
    r.plano = [];
    r.limparBichos();
  });
  const avisos = [];
  const lerAvisos = async () => {
    for (const t of await page.locator('.toast').allTextContents()) if (!avisos.includes(t)) avisos.push(t);
  };
  let pragasDaOnda = {};
  for (let onda = 1; onda < 5; onda++) {
    await esvaziar();
    const noRespiro = await page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());
    // o respiro: a onda seguinte começa sozinha depois dele
    for (let i = 0; i < 60; i++) {
      await lerAvisos();
      const e2 = await estado();
      if (e2.onda === onda + 1) {
        pragasDaOnda[onda + 1] = await page.evaluate(() =>
          [...new Set(window.jogo.current.world.root.userData.rodada.plano.map((p) => p.praga))]);
        break;
      }
      await page.waitForTimeout(250);
    }
    void noRespiro;
  }
  // o aviso nasce no mesmo quadro da onda nova: lê mais um pouco depois
  for (let i = 0; i < 6; i++) {
    await lerAvisos();
    await page.waitForTimeout(200);
  }
  const e5 = await estado();
  ok(e5.onda === 5 && e5.rodando, `as ondas se seguem até a quinta (está na ${e5.onda})`);
  ok(avisos.some((t) => /Onda 2: chegam os Gafanhopos/.test(t)), 'a onda 2 avisa quem estreia');
  // o prêmio: metade do que falta para o próximo nível (0 gotas → faltam 5 → +3)
  console.log('       avisos:', avisos.filter((t) => /vencida/.test(t)).join(' · '));
  ok(avisos.some((t) => /Onda 1 vencida! \+3 gotas de prêmio/.test(t)), 'vencer a onda 1 dá +3 gotas (metade das 5 que faltavam)');
  ok(avisos.filter((t) => /vencida/.test(t)).length >= 4, 'cada onda vencida avisa o prêmio');
  ok(e5.juntadas >= 3, `as gotas do prêmio entram na conta (${e5.juntadas})`);
  ok(avisos.some((t) => /Onda 5: a última leva/.test(t)), 'a onda 5 avisa que é a última');
  ok((pragasDaOnda[3] ?? []).includes('coelhatu'), `a onda 3 traz o Coelhatu [${pragasDaOnda[3]}]`);
  ok((pragasDaOnda[5] ?? []).includes('mae-lagartejo'), `a onda 5 traz a Mãe-Lagartejo [${pragasDaOnda[5]}]`);
  // o grandão anunciado: adianta o relógio até 4 s antes da chefe
  await page.evaluate(() => {
    const r = window.jogo.current.world.root.userData.rodada;
    const chefe = r.plano.find((p) => p.praga === 'mae-lagartejo');
    r.plano = [chefe];
    r.tempoDaOnda = chefe.t - 3.5;
  });
  let aviso = null;
  let nasceu = false;
  for (let i = 0; i < 40 && !(aviso && nasceu); i++) {
    const t = (await page.locator('.toast').allTextContents()).find((x) => /Mãe-Lagartejo/.test(x));
    if (t) aviso = t;
    nasceu = (await estado()).invasores.some((b) => b.praga === 'mae-lagartejo');
    if (aviso && !nasceu) await page.screenshot({ path: `${OUT}-aviso.png` });
    await page.waitForTimeout(200);
  }
  ok(!!aviso && nasceu, `a Josefina anuncia a chefe antes dela nascer: ${aviso}`);
  // e a última onda termina a rodada, com a fala das cinco levas
  await page.evaluate(() => {
    const r = window.jogo.current.world.root.userData.rodada;
    r.aoAcabar = (res) => { window.__fimDaRodada = res; };
    r.plano = [];
    r.limparBichos();
  });
  await page.waitForFunction(() => !!window.__fimDaRodada, null, { timeout: 30000 }).catch(() => {});
  const fimDas5 = await page.evaluate(() => window.__fimDaRodada);
  ok(fimDas5?.ondas === 5 && fimDas5?.motivo === 'fim', `depois da quinta a rodada fecha sozinha (${JSON.stringify(fimDas5)})`);
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
