/**
 * O deque de descanso da beira da piscina.
 *
 * O que este teste guarda:
 * - o prompt de descansar aparece no deque, e a pergunta oferece as duas saídas;
 * - os dois deitam nas DUAS espreguiçadeiras (separados em z, na mesma altura),
 *   com a cabeça na cabeceira — que aqui aponta para o `+X`, e não para o `-Z`
 *   como na cama: é o giro a mais que mora na âncora de fora;
 * - o corpo fica ACIMA da lona, e não afundado nela;
 * - o pergolado não tapa ninguém: ele fica no fundo do deque, a mais de um metro
 *   atrás da cabeceira, que é o que a conta de 34° pede;
 * - levantar desfaz tudo e devolve o andar.
 *
 * Uso: node scripts/deque.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './deque';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);

const pose = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const onde = (o) => {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      return [+e[12].toFixed(3), +e[13].toFixed(3), +e[14].toFixed(3)];
    };
    const um = (quem) => {
      const rig = j[quem].rig;
      return {
        raiz: onde(rig.group),
        cabeca: onde(rig.head),
        quadril: onde(rig.legL),
        bracoE: [+rig.armL.rotation.x.toFixed(4), +rig.armL.rotation.z.toFixed(4)],
        bracoD: [+rig.armR.rotation.x.toFixed(4), +rig.armR.rotation.z.toFixed(4)],
        giroDoPai: +(j[quem].object.parent?.rotation?.x ?? 0).toFixed(3),
      };
    };
    return { jogador: um('player'), parceiro: um('parceiro') };
  });

// ------------------------------------------------- 1. chegar e aceitar deitar
await page.evaluate(() => window.jogo.debugPlace(13.8, 2.0, Math.PI));
await page.waitForTimeout(900);
const prompt = await page.locator('.prompt .label').textContent().catch(() => '');
const dePe = await pose();

await page.keyboard.press('KeyE');
await page.waitForTimeout(1100);
const opcoes = await page.locator('.escolhas button').allTextContents();
await page.keyboard.press('KeyE'); // a primeira opção ("Deitar") já vem escolhida
await page.waitForTimeout(2800);
await page.screenshot({ path: `${OUT}-deitado.png` });
const deitado = await pose();

await page.waitForTimeout(1400);
const maisTarde = await pose();
const mexeu = (a, b) =>
  Math.abs(a.bracoE[1] - b.bracoE[1]) + Math.abs(a.bracoD[1] - b.bracoD[1]);
const balanco = +mexeu(deitado.jogador, maisTarde.jogador).toFixed(4);

// ------------------------------------------------------------- 2. levantar
for (let i = 0; i < 14; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  if (await page.locator('.escolhas button').count()) {
    await page.locator('.escolhas button').last().click(); // "Levantar"
  } else {
    await page.keyboard.press('KeyE');
  }
  await page.waitForTimeout(850);
}
await page.waitForTimeout(1600);
const dePeDeNovo = await pose();
await page.screenshot({ path: `${OUT}-levantou.png` });

const antesDeAndar = await page.evaluate(() => +window.jogo.player.object.position.z.toFixed(2));
await page.keyboard.down('KeyS');
await page.waitForTimeout(800);
await page.keyboard.up('KeyS');
const depoisDeAndar = await page.evaluate(() => +window.jogo.player.object.position.z.toFixed(2));

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'deque-do-clube'),
);

/**
 * O pergolado só pode existir ATRÁS de quem deita. A cobertura fica a 2,91 e a
 * câmera olha em 34°: ela esconde o que estiver até `2,91 / tan(34°)` à frente
 * dela. Deitado, a cabeça fica a menos de 1 m do chão — a folga que interessa é
 * a distância em `z`, e ela tem que ser NEGATIVA (o pergolado mais para o fundo).
 */
const pergola = await page.evaluate(() => {
  let achado = null;
  window.jogo.scene.traverse((o) => {
    if (!achado && o.userData?.peca === 'pergolado') achado = o;
  });
  if (!achado) return null;
  achado.updateWorldMatrix(true, false);
  const e = achado.matrixWorld.elements;
  return { x: +e[12].toFixed(2), z: +e[14].toFixed(2) };
});

// ------------------------------------------------------------------ relatório
console.log('1. prompt:', JSON.stringify(prompt), '·', JSON.stringify(opcoes));
console.log('2. deitados · giro da âncora:', deitado.jogador.giroDoPai, '(tem que ser -1.571)');
for (const [nome, p] of [['jogador ', deitado.jogador], ['parceiro', deitado.parceiro]]) {
  console.log(`   ${nome} · cabeça x=${p.cabeca[0]} · quadril x=${p.quadril[0]} · altura ${p.raiz[1]} · z ${p.raiz[2]}`);
}
console.log('   braços mexeram em 1,4 s ·', balanco);
console.log('3. pergolado em', JSON.stringify(pergola),
  '· recuo até a cabeceira:', pergola ? +(pergola.z - deitado.jogador.raiz[2]).toFixed(2) : '—');
console.log('4. levantou · giro da âncora:', dePeDeNovo.jogador.giroDoPai,
  '· andou:', antesDeAndar, '→', depoisDeAndar, '· memória:', noDiario);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!/descansar/i.test(prompt ?? '')) problemas.push('o prompt do deque não apareceu');
if (opcoes.length !== 2) problemas.push('a pergunta não ofereceu as duas opções');
if (Math.abs(dePe.jogador.giroDoPai) > 0.01) problemas.push('já começou preso a uma âncora');

for (const [nome, p] of [['jogador', deitado.jogador], ['parceiro', deitado.parceiro]]) {
  if (Math.abs(p.giroDoPai + Math.PI / 2) > 0.01) {
    problemas.push(`${nome}: a âncora não está girada -90° em X`);
  }
  // a cabeceira da espreguiçadeira aponta para o +X
  if (!(p.cabeca[0] > p.quadril[0] + 0.4)) {
    problemas.push(`${nome}: não está deitado ao comprimento da espreguiçadeira`);
  }
  // encostado na lona (topo em 0,45): nem afundado nela, nem boiando um palmo
  // acima — foi assim que a folga da cama, que é de colchão fofo, chegou aqui
  if (!(p.raiz[1] > 0.55 && p.raiz[1] < 0.7)) {
    problemas.push(`${nome}: altura ${p.raiz[1]} não bate com a lona`);
  }
}
if (Math.abs(deitado.jogador.raiz[2] - deitado.parceiro.raiz[2]) < 0.9) {
  problemas.push('os dois não ficaram em espreguiçadeiras diferentes');
}
if (Math.abs(deitado.jogador.raiz[0] - deitado.parceiro.raiz[0]) > 0.05) {
  problemas.push('um deitou mais para a cabeceira que o outro');
}
if (balanco < 0.005) problemas.push('os braços não estão mexendo (pose parada)');

if (!pergola) problemas.push('o pergolado não está na cena');
else if (pergola.z > deitado.jogador.raiz[2] - 1) {
  problemas.push('o pergolado não está atrás de quem deita — ele vai tapar os dois');
}

if (Math.abs(dePeDeNovo.jogador.giroDoPai) > 0.01) problemas.push('continuou preso à âncora deitada');
if (dePeDeNovo.jogador.raiz[1] > 0.2) problemas.push('levantou mas ficou flutuando');
if (Math.abs(depoisDeAndar - antesDeAndar) < 0.15) problemas.push('não deu para andar depois de levantar');
if (!noDiario) problemas.push('a memória do deque não entrou no diário');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
