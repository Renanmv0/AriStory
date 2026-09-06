/**
 * O OSSO: do jardim da Josefina até o convite do Walter.
 *
 * É a etapa 1 do minigame de servir as mesas (`docs/MINIGAME-RESTAURANTE.md`),
 * e o caminho inteiro é: terra remexida no jardim → cavar → osso na mochila →
 * dar o osso ao Walter → ele convida a dupla para o turno dele → a escala
 * aparece na parede.
 *
 * O que este teste guarda:
 *
 * - O MONTINHO NÃO SE ENTREGA DE LONGE. Ele fica fora do caminho de pedrinha,
 *   e o raio da interação (1,0) é curto o bastante para o prompt NÃO acender de
 *   quem só passa pelo caminho. Era o pedido do Renan: uma coisa que se
 *   descobre jogando. Se alguém aumentar esse raio, o segredo deixa de ser
 *   segredo, e o teste avisa;
 * - a JOSEFINA DÁ A DICA, e dá de forma garantida — na primeira visita depois
 *   de conhecê-la, não sorteada entre as histórias dela. Pista que o jogo pode
 *   esconder para sempre não é pista;
 * - CAVAR DÁ O OSSO de verdade (ele entra na mochila), o monte vira buraco, e
 *   o buraco NÃO volta a ser monte na visita seguinte — senão o osso vira uma
 *   fonte infinita;
 * - NO RESTAURANTE O RÓTULO MUDA. Sem o osso o prompt do Walter é o carinho;
 *   com o osso é "Dar o osso". As duas interações moram no mesmo ponto e nunca
 *   acendem juntas;
 * - o convite acontece, aceitar acende a ESCALA na parede, e o osso fica no
 *   balcão para sempre — as duas coisas atravessam a remontagem da cena.
 *
 * Uso: node scripts/osso.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './osso';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com a cena: `CAVA` no clube, e o caminho de pedrinha */
const CAVA = { x: 27.5, z: -17.25 };
const CAMINHO_X = 25.6;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const promptVisivel = async () => (await page.locator('.prompt.show').count()) > 0;

/** Aperta E até o diálogo fechar, guardando o que foi dito. */
const venceAFala = async (voltas = 26) => {
  const ditas = [];
  for (let i = 0; i < voltas; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 14) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(650);
  }
  return ditas;
};

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(400);

// ============================================ 1. o montinho, e o que ele mostra
const montinho = await page.evaluate(() => {
  let m = null;
  window.jogo.scene.traverse((o) => {
    if (!m && o.userData?.peca === 'terra-remexida') m = o;
  });
  if (!m) return null;
  m.updateWorldMatrix(true, false);
  const e = m.matrixWorld.elements;
  return {
    x: +e[12].toFixed(2),
    z: +e[14].toFixed(2),
    monte: m.userData.monte?.visible ?? null,
    buraco: m.userData.buraco?.visible ?? null,
  };
});

// ======================================= 2. o prompt não acende do caminho
await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, 0), [CAMINHO_X, CAVA.z]);
await page.waitForTimeout(1200);
const doCaminho = { visivel: await promptVisivel(), texto: await prompt() };

// ============================================ 3. a dica da Josefina
// primeiro a apresentação dela (que é a conversa longa), depois a visita
// seguinte — que é onde a dica TEM que sair
const chegarNaJosefina = async () => {
  const onde = await page.evaluate(() => {
    let j = null;
    window.jogo.scene.traverse((o) => {
      if (!j && o.userData?.peca === 'josefina') j = o;
    });
    return j ? [+j.position.x.toFixed(2), +j.position.z.toFixed(2)] : null;
  });
  if (!onde) return false;
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.4, z + 1.1, Math.PI), onde);
  await page.waitForTimeout(1100);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(900);
  return true;
};

await chegarNaJosefina();
await venceAFala();          // a apresentação
await page.waitForTimeout(800);
await chegarNaJosefina();
const segundaVisita = (await venceAFala()).join(' | ');
const deuADica = /terra remexida/i.test(segundaVisita);

// ==================================================== 4. cavar e achar o osso
await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z + 0.75, Math.PI), [CAVA.x, CAVA.z]);
await page.waitForTimeout(1300);
const dePerto = { visivel: await promptVisivel(), texto: await prompt() };
await page.screenshot({ path: `${OUT}-montinho.png` });

await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
await venceAFala();
await page.waitForTimeout(1200);

const depoisDeCavar = await page.evaluate(() => {
  let m = null;
  window.jogo.scene.traverse((o) => {
    if (!m && o.userData?.peca === 'terra-remexida') m = o;
  });
  return {
    temOsso: window.jogo.hasItem('osso') || window.jogo.hasItem('osso', window.jogo.companionId()),
    monte: m?.userData.monte?.visible ?? null,
    buraco: m?.userData.buraco?.visible ?? null,
  };
});
await page.screenshot({ path: `${OUT}-buraco.png` });

// o prompt de cavar tem que ter sumido: cavar duas vezes daria dois ossos
await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z + 0.75, Math.PI), [CAVA.x, CAVA.z]);
await page.waitForTimeout(1200);
const cavarDeNovo = { visivel: await promptVisivel(), texto: await prompt() };

// ================================= 5. no restaurante: o rótulo muda com o osso
await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(600);

// o buraco continua buraco depois de trocar de cena e voltar: a flag atravessa
const chegarNoWalter = async () => {
  const onde = await page.evaluate(() => {
    let d = null;
    window.jogo.scene.traverse((o) => {
      if (!d && o.userData?.peca === 'garcom-canino') d = o;
    });
    return d ? [+d.position.x.toFixed(2), +d.position.z.toFixed(2)] : null;
  });
  if (!onde) return false;
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z + 0.85, Math.PI), onde);
  await page.waitForTimeout(1100);
  return true;
};

await chegarNoWalter();
const comOsso = await prompt();

/**
 * O CONTROLE: sem o osso, o mesmo ponto tem que voltar a ser o carinho. Sem
 * esta metade, o teste passaria com as duas interações acesas ao mesmo tempo —
 * que é justamente o defeito que ele existe para pegar.
 */
await page.evaluate(() => window.jogo.removeItem('osso', window.jogo.playerId()));
await page.waitForTimeout(700);
await chegarNoWalter();
const semOsso = await prompt();

// devolve o osso e segue
await page.evaluate(() => {
  window.jogo.addItem({ id: 'osso', nome: 'Osso', icone: '\u{1f9b4}', tipo: 'mao', holdPose: 'relaxed' });
});
await page.waitForTimeout(700);

// ============================================ 6. dar o osso e aceitar o convite
await chegarNoWalter();
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);

// a volta olímpica dele acontece no meio do diálogo: aperta E até aparecer a
// pergunta, e aí escolhe "Topo"
let perguntou = false;
for (let i = 0; i < 80; i++) {
  if (await page.locator('.escolhas.show button').count()) {
    perguntou = true;
    break;
  }
  if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
}
await page.waitForTimeout(1500);
const ondeEstavam = await page.evaluate(() => {
  let d = null;
  window.jogo.scene.traverse((o) => {
    if (!d && o.userData?.peca === 'garcom-canino') d = o;
  });
  const p = window.jogo.playerPosition();
  return {
    walter: d ? [+d.position.x.toFixed(2), +d.position.y.toFixed(2), +d.position.z.toFixed(2), d.visible] : null,
    jogador: [+p.x.toFixed(2), +p.z.toFixed(2)],
  };
});
console.log('   no convite:', JSON.stringify(ondeEstavam));
await page.screenshot({ path: `${OUT}-convite.png` });
if (perguntou) {
  // "Topo" é a primeira opção, e é a que já vem selecionada
  await page.locator('.escolhas.show button').first().click();
  await page.waitForTimeout(700);
}
await venceAFala(30);
await page.waitForTimeout(1400);

const depoisDoConvite = await page.evaluate(() => {
  const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  let ossoNoBalcao = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'osso') {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      ossoNoBalcao = [+e[12].toFixed(2), +e[13].toFixed(2), +e[14].toFixed(2)];
    }
  });
  return {
    aceitou: !!(save.flags ?? {})['turno-aceito'],
    entregou: !!(save.flags ?? {})['osso-entregue'],
    naMochila: window.jogo.hasItem('osso') || window.jogo.hasItem('osso', window.jogo.companionId()),
    memoria: (save.memories ?? []).some((m) => m.id === 'osso-do-walter'),
    ossoNoBalcao,
  };
});

// ==================================== 7. a escala sobrevive à remontagem da cena
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(600);

const escala = await page.evaluate(() => {
  let e = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'osso') e = e ?? 'osso';
  });
  return e;
});

await page.evaluate(() => window.jogo.debugPlace(2.4, -9 + 1.5, 0));
await page.waitForTimeout(1300);
const promptDaEscala = await prompt();
await page.screenshot({ path: `${OUT}-escala.png` });

// ======================================================================= laudo
const falhas = [];
if (!montinho) falhas.push('nao achei o montinho de terra remexida no jardim');
else {
  if (Math.abs(montinho.x - CAVA.x) > 0.2 || Math.abs(montinho.z - CAVA.z) > 0.2) {
    falhas.push(`montinho fora do lugar: ${montinho.x},${montinho.z}`);
  }
  if (montinho.monte !== true || montinho.buraco !== false) {
    falhas.push('o montinho nao comeca inteiro (monte visivel, buraco escondido)');
  }
}
if (doCaminho.visivel && /cavar/i.test(doCaminho.texto)) {
  falhas.push('o prompt de cavar acende do caminho de pedrinha: o segredo se entrega de longe');
}
if (!deuADica) falhas.push('a Josefina nao deu a dica da terra remexida na visita seguinte');
if (!dePerto.visivel || !/cavar/i.test(dePerto.texto)) {
  falhas.push(`de perto o prompt nao e o de cavar: "${dePerto.texto}"`);
}
if (!depoisDeCavar.temOsso) falhas.push('cavar nao pos o osso na mochila');
if (depoisDeCavar.monte !== false || depoisDeCavar.buraco !== true) {
  falhas.push('depois de cavar o monte nao virou buraco');
}
if (cavarDeNovo.visivel && /cavar/i.test(cavarDeNovo.texto)) {
  falhas.push('da para cavar de novo no mesmo buraco: o osso vira fonte infinita');
}
if (!/osso/i.test(comOsso)) falhas.push(`com o osso o prompt do Walter nao mudou: "${comOsso}"`);
if (!/carinho/i.test(semOsso)) falhas.push(`sem o osso o prompt do Walter nao voltou: "${semOsso}"`);
if (!perguntou) falhas.push('o Walter nao fez a pergunta do convite');
if (!depoisDoConvite.entregou) falhas.push('a entrega do osso nao ficou registrada');
if (depoisDoConvite.naMochila) falhas.push('o osso continuou na mochila depois de entregue');
if (!depoisDoConvite.aceitou) falhas.push('aceitar o convite nao gravou a flag do turno');
if (!depoisDoConvite.memoria) falhas.push('a memoria do osso nao entrou no diario');
if (!depoisDoConvite.ossoNoBalcao) falhas.push('o osso nao ficou no balcao de passagem');
if (escala !== 'osso') falhas.push('o osso sumiu do balcao depois de remontar a cena');
if (!/escala/i.test(promptDaEscala)) {
  falhas.push(`a escala nao esta na parede depois de recarregar: "${promptDaEscala}"`);
}
falhas.push(...erros);

console.log('1. montinho:', JSON.stringify(montinho));
console.log('2. do caminho:', JSON.stringify(doCaminho), '· de perto:', JSON.stringify(dePerto));
console.log('3. dica da Josefina:', deuADica);
console.log('4. depois de cavar:', JSON.stringify(depoisDeCavar), '· de novo:', JSON.stringify(cavarDeNovo));
console.log('5. prompt com osso:', JSON.stringify(comOsso), '· sem osso:', JSON.stringify(semOsso));
console.log('6. convite:', JSON.stringify(depoisDoConvite));
console.log('7. escala:', JSON.stringify(promptDaEscala));

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
