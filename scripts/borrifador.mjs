/**
 * O BORRIFADOR (pedido do Renan): a quarta ferramenta da estufa, a de ÁREA.
 *
 *   1. com 15 ondas somadas de pistola ele destranca: a parede inteira ganha
 *      cor, a aba dele na bancada mostra as cartas só dele, e "Usar esta
 *      ferramenta" escolhe ele;
 *   2. a rodada de borrifador: o frasco na mão, segurado pelo gargalo (a pose
 *      `borrifando`), o gatilho que o dedo puxa, o "psst" dele, e a NÉVOA —
 *      uma borrifada no meio de um bando molha o bando inteiro;
 *   3. as 14 cartas só dele agindo na rodada, cada uma medida pelo efeito, e
 *      a peça da mão mudando (cordinha, bico em flor, água concentrada).
 *
 *   node scripts/borrifador.mjs /tmp/bf
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/bf';
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
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
const estufa = async (extra = '') => {
  await page.goto(`${BASE}/?cena=estufa&em=-13,2.4${extra}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
  await page.waitForTimeout(400);
};
const falarAteAcabar = async () => {
  for (let i = 0; i < 20 && await page.evaluate(() => document.querySelector('.dialogue')?.classList.contains('show')); i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(350);
  }
};
/** subiu de nível ou entrou um chamado: pega a carta e passa as falas */
const destravar = async () => {
  if (await page.locator('.cartas-do-jardim.show').count()) {
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(300);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(600);
  }
  if (await page.evaluate(() => document.querySelector('.dialogue')?.classList.contains('show'))) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(300);
  }
};
const rodada = () => page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());
const pecaNaMao = () => page.evaluate(() => {
  let peca = null;
  let estilo = null;
  let cordinha = false;
  let gatilho = null;
  window.jogo.objetoNaMao()?.traverse((o) => {
    if (o.userData.peca && !peca) { peca = o.userData.peca; estilo = o.userData.estilo ?? null; }
    if (o.name === 'cordinha') cordinha = true;
    if (o.userData.partes?.gatilho) gatilho = o.userData.partes.gatilho.rotation.x;
  });
  return { peca, estilo, cordinha, gatilho, pose: window.jogo.player?.rig?.pose ?? null };
});

// ============================================= 1. destrancar e escolher
await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
await page.evaluate(() => {
  for (const a of ['regador', 'mangueira', 'pistola']) window.jogo.bump(`jardim.ondas.${a}`, 15);
  window.jogo.bump('jardim.recorde', 15);
  window.jogo.save?.persist?.();
});
await estufa('&zoom=6');
await page.mouse.click(640, 400);
const sombras = await page.evaluate(() => {
  let painel = null;
  window.jogo.current.world.root.traverse((o) => { if (o.userData.peca === 'painel-de-armas') painel = o; });
  return painel?.children.filter((c) => c.userData.trancada).length ?? -1;
});
ok(sombras === 0, `com 15 ondas de pistola a parede inteira ganha cor (${sombras} em sombra)`);
await page.evaluate(() => {
  for (const id of ['nevoa-larga-1', 'redemoinho', 'jean-luc-no-tonel', 'rajada', 'bico-1']) window.jogo.desbloquearCartaDoJardim(id);
});
await page.evaluate(() => window.jogo.debugPlace(-13.0, 2.4, -Math.PI / 2));
await page.waitForTimeout(500);
await page.keyboard.press('KeyE');
await esperar(page, () => page.evaluate(() => document.querySelector('.livro-de-cartas.arsenal')?.classList.contains('show')), 3000);
await page.locator('.livro-de-cartas.arsenal .abas button', { hasText: 'Borrifador' }).click();
await page.waitForTimeout(250);
const aba = await page.evaluate(() => document.querySelector('.livro-de-cartas.arsenal .paginas')?.textContent ?? '');
ok(/Névoa larga/.test(aba) && /Redemoinho/.test(aba), 'a aba do borrifador lista as cartas só dele (Névoa larga, Redemoinho)');
ok(/Jean-Luc/.test(aba), 'e as de tanque que ele divide com o regador e a pistola (o Jean-Luc)');
ok(!/Rajada/.test(aba) && !/Bico mais longo/.test(aba), 'e não as da pistola nem as genéricas');
ok(!/construção/i.test(aba), 'e não está mais "em construção"');
await page.screenshot({ path: `${OUT}-painel.png` });
await page.locator('[data-usar="borrifador"]').click();
await page.waitForTimeout(400);
ok(await page.evaluate(() => window.jogo.stat('jardim.arma')) === 3, '"Usar esta ferramenta" escolhe o borrifador');

// ============================================= 2. a rodada de borrifador
await page.evaluate(() => {
  window.jogo.debugPlace(0, -4, Math.PI);
  const u = window.jogo.current.world.root.userData;
  u.comecarRodada([]);
  u.rodada.limparBichos();
});
await page.waitForTimeout(800);
const r0 = await rodada();
ok(r0.arma === 'borrifador', 'a rodada começa com o borrifador escolhido');
ok(r0.tanque === 10 && !r0.mangueira, `tanque de 10 e nada de mangueira (${r0.tanque})`);
const m0 = await pecaNaMao();
ok(m0.peca === 'borrifador', `na mão vai o borrifador (${m0.peca})`);
ok(m0.pose === 'borrifando', `segurado pelo gargalo, com o braço para a frente (pose ${m0.pose})`);
// o bando: cinco lagartejos juntinhos, a 2 m da dupla
await page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  for (const [x, z] of [[0, -6.1], [0.45, -6.3], [-0.45, -6.3], [0.2, -6.7], [-0.25, -6.75]]) r.soltarBicho('lagartejo', x, z);
  r.escalaDoTempo = 0.5;
});
let gatilhoMexeu = false;
const repouso = m0.gatilho;
await esperar(page, async () => {
  const m = await pecaNaMao();
  if (m.gatilho !== null && Math.abs(m.gatilho - repouso) > 0.1) gatilhoMexeu = true;
  return (await rodada()).desenho.nevoas > 0;
}, 15000);
// a foto na hora em que a nuvem abre
await page.evaluate(() => window.jogo.setZoom(3));
await page.waitForTimeout(120);
await page.screenshot({ path: `${OUT}-nevoa.png` });
const r1 = await rodada();
const molhados = r1.invasores.filter((i) => i.vida < i.vidaMax - 1e-6).length;
ok(r1.jatosDados >= 1 && (r1.desenho.formas.nevoa ?? 0) > 0, `o aperto solta névoa (forma "nevoa": ${r1.desenho.formas.nevoa ?? 0}×)`);
ok(molhados >= 4, `uma borrifada no bando molha o bando inteiro (${molhados} de ${r1.invasores.length} bichos)`);
ok(gatilhoMexeu, 'o dedo puxa o gatilho a cada borrifada');
const som = await page.evaluate(() => Object.fromEntries(window.jogo.audio.contagem));
ok((som.borrifada ?? 0) > 0, `com o "psst" dele (${som.borrifada ?? 0}×)`);
// de perto: a dupla, o borrifador na mão e a nuvem
await page.evaluate(() => { window.jogo.current.world.root.userData.rodada.escalaDoTempo = 1; window.jogo.setZoom(1.6); });
await esperar(page, async () => (await rodada()).desenho.nevoas > r1.desenho.nevoas, 6000);
await page.waitForTimeout(150);
await page.screenshot({ path: `${OUT}-na-mao.png` });
await page.evaluate(() => window.jogo.setZoom(6));
const r2 = await rodada();
ok(r2.agua < r2.tanque, `e a água do frasco acaba (${r2.agua.toFixed(1)} de ${r2.tanque})`);
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.terminar('interrompida'));
await page.waitForTimeout(400);
await falarAteAcabar();

// ============================================= 3. as 14 cartas só dele
const DELE = ['dedo-ligeiro-1', 'dedo-ligeiro-2', 'nevoa-larga-1', 'nevoa-larga-2', 'concentrado-1', 'concentrado-2',
  'cordinha-de-pulso', 'nevoa-que-fica', 'encharcado', 'pontaria-no-bando', 'folha-orvalhada', 'nuvem-teimosa',
  'redemoinho', 'nevoa-que-se-espalha'];
await page.evaluate((cartas) => {
  window.jogo.debugPlace(-3.6, 5.4, 0);
  const u = window.jogo.current.world.root.userData;
  u.comecarRodada(cartas, 'borrifador');
  const r = u.rodada;
  r.escalaDoTempo = 3;
  r.limparBichos();
}, DELE);
await page.waitForTimeout(700);
const m1 = await pecaNaMao();
ok(m1.cordinha, 'Cordinha de pulso: a cordinha amarela com a conta rosa na rosca');
ok((m1.estilo?.nevoaLarga ?? 0) === 1 && (m1.estilo?.concentrado ?? 0) === 1,
  `Névoa larga e Concentrado mudam a peça (bico em flor ${m1.estilo?.nevoaLarga}, água ${m1.estilo?.concentrado})`);
const f1 = await rodada();
ok(f1.efeitos !== undefined, 'a rodada com as 14 cartas começa');
/*
 * os bichos: dois comendo a lavanda (Folha orvalhada), um sozinho mais perto
 * da dupla e um bando mais longe (Pontaria no bando), e um grandão (Nuvem
 * teimosa); o resto vem de novo sempre que o bando acaba
 */
const soltar = () => page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  // a água não é o que se mede aqui: o frasco fica cheio, sem ir ao tonel
  r.agua = r.estado().tanque;
  // quem já foi espantado e está fugindo pela porta não conta
  const ativos = r.estado().invasores.filter((i) => i.estado !== 'fugindo' && i.estado !== 'sacudindo' && i.x < 3);
  if (ativos.length >= 4) return;
  r.soltarBicho('lagartejo', -3.6, 7.95);
  r.soltarBicho('lagartejo', -3.05, 7.9);
  r.soltarBicho('lagartejo', -4.7, 6.2);
  r.soltarBicho('lagartejo', -2.3, 7.2);
  r.soltarBicho('lagartejo', -2.0, 7.5);
  if (!ativos.some((i) => i.praga === 'preguipolvo')) r.soltarBicho('preguipolvo', -4.3, 7.6);
});
await soltar();
const QUER = ['encharcado', 'pontaria-no-bando', 'folha-orvalhada', 'nuvem-teimosa', 'redemoinho', 'nevoa-que-se-espalha', 'nevoa-que-fica'];
let fotoCartas = false;
await esperar(page, async () => {
  await destravar();
  await soltar();
  const e = await rodada();
  if (!fotoCartas && (e.efeitos.redemoinho ?? 0) > 0 && e.teimosa) {
    fotoCartas = true;
    await page.evaluate(() => window.jogo.setZoom(3));
    await page.screenshot({ path: `${OUT}-cartas.png` });
    await page.evaluate(() => window.jogo.setZoom(6));
  }
  return QUER.every((k) => (e.efeitos[k] ?? 0) > 0);
}, 150000);
const rc = await rodada();
console.log(`       ${rc.jatosDados} apertos e ${rc.espantados} bichos espantados`);
for (const [id, nome] of [
  ['encharcado', 'Encharcado: névoa seguida no mesmo bicho molha mais'],
  ['pontaria-no-bando', 'Pontaria no bando: mira no bando, e não no mais perto'],
  ['folha-orvalhada', 'Folha orvalhada: a mordida no canteiro orvalhado tira metade'],
  ['nuvem-teimosa', 'Nuvem teimosa: chove no bicho mais forte'],
  ['redemoinho', 'Redemoinho: a névoa gira e puxa os bichos'],
  ['nevoa-que-se-espalha', 'Névoa que se espalha: bicho espantado vira nuvem nova'],
  ['nevoa-que-fica', 'Névoa que fica: quem entra na nuvem parada se molha'],
]) ok((rc.efeitos[id] ?? 0) > 0, `${nome} (${rc.efeitos[id] ?? 0}×)`);
const d = rc.desenho;
ok(d.bandos > 0 && d.chuvinhas > 0 && d.pingos > 0 && d.orvalhos > 0 && d.redemoinhos > 0 && d.nevoasParadas > 0,
  `e cada uma se vê: anel do bando ${d.bandos}, chuvinha ${d.chuvinhas}, pingos ${d.pingos}, orvalho ${d.orvalhos}, espiral ${d.redemoinhos}, nuvem parada ${d.nevoasParadas}`);
if (!fotoCartas) {
  await page.evaluate(() => window.jogo.setZoom(3));
  await page.screenshot({ path: `${OUT}-cartas.png` });
}
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.terminar('interrompida'));

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
