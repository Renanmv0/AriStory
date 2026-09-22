/**
 * A estufa da Josefina — a área nova no fundo do jardim do clube.
 *
 * Ela é a etapa 0 do plano de `docs/MINIGAME-JARDIM.md`: a área foi construída
 * antes da quest e antes de qualquer mecânica. Este teste guarda as três coisas
 * que o minigame vai cobrar dela depois, e que são fáceis de perder numa mexida
 * de decoração:
 *
 * - A PORTA ABRE NOS DOIS SENTIDOS. Do jardim do clube para a estufa e de volta,
 *   e quem volta cai na frente da porta, no eixo do caminho de pedrinha — não do
 *   outro lado do clube;
 * - O TERREIRO DO MEIO ESTÁ VAZIO. Nenhum colisor dentro do retângulo central.
 *   É a arena: survivor sem espaço para correr não é survivor, e basta alguém
 *   pôr "um vasinho no meio pra quebrar" para o jogo inteiro ficar pior;
 * - OS OITO CANTEIROS ESTÃO NA BEIRADA e AS QUATRO BOCAS ESTÃO LIVRES. Os
 *   canteiros são o que se defende; as bocas são por onde os bichos entram.
 *
 * Mais o de sempre: a oficina (bancada, tonel, regador) existe, os arcos estão
 * de pé, e o console não reclama.
 *
 * Uso: node scripts/estufa.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './estufa';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com a cena `estufa` */
const TERREIRO = { largura: 15, profundidade: 11 };
/** e com o `ESTUFA` da cena do clube */
const PORTA_NO_JARDIM = { x: 25.6, z: -20.9 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(400);

const cena = () => page.evaluate(() => window.jogo.current.def.id);
const onde = () =>
  page.evaluate(() => [
    +window.jogo.player.position.x.toFixed(2),
    +window.jogo.player.position.z.toFixed(2),
  ]);
const prompt = async () =>
  (await page.locator('.prompt.show').count())
    ? await page.locator('.prompt .label').textContent()
    : '';

// ================================================= 1. entrar pela porta nova
await page.evaluate(
  ([x, z]) => window.jogo.debugPlace(x, z + 1.0, Math.PI),
  [PORTA_NO_JARDIM.x, PORTA_NO_JARDIM.z],
);
await page.waitForTimeout(1200);
const promptDeEntrada = await prompt();
await page.screenshot({ path: `${OUT}-porta.png` });
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const cenaDepoisDeEntrar = await cena();
const chegada = await onde();

// ================================================ 2. o que tem lá dentro
const dentro = await page.evaluate(() => {
  const pecas = {};
  const canteiros = [];
  window.jogo.scene.traverse((o) => {
    const p = o.userData?.peca;
    if (!p) return;
    pecas[p] = (pecas[p] ?? 0) + 1;
    if (p === 'canteiro-de-horta') {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      canteiros.push({ x: +e[12].toFixed(2), z: +e[14].toFixed(2), planta: o.userData.planta });
    }
  });
  return {
    pecas,
    canteiros,
    especies: [...new Set(canteiros.map((c) => c.planta))].sort(),
    colisores: window.jogo.current.world.colliders.map((c) =>
      c.kind === 'circle'
        ? { kind: 'circle', x: +c.x.toFixed(2), z: +c.z.toFixed(2), r: +c.r.toFixed(2) }
        : {
            kind: 'box', x: +c.x.toFixed(2), z: +c.z.toFixed(2),
            hw: +c.hw.toFixed(2), hd: +c.hd.toFixed(2), rot: +c.rot.toFixed(3),
          },
    ),
    pontos: window.jogo.current.world.root.userData.pontosDoJardim ?? null,
  };
});

/**
 * A CAIXA ENVOLVENTE DE UM COLISOR, no eixo do mundo.
 *
 * A primeira versão media caixa girada pelo raio (`hypot(hw, hd)`), e por isso
 * acusava as PAREDES de invadir o terreiro: uma parede de 30 de comprimento
 * vira um círculo de raio 15, que cobre a estufa inteira. Uma caixa girada por
 * `rot` tem meia-largura `|hw·cos| + |hd·sen|` em x e `|hw·sen| + |hd·cos|` em
 * z — é exato, e é o que separa parede de vaso.
 */
const envelope = (c) => {
  if (c.kind === 'circle') return { x: c.x, z: c.z, hx: c.r, hz: c.r };
  const cos = Math.abs(Math.cos(c.rot));
  const sen = Math.abs(Math.sin(c.rot));
  return { x: c.x, z: c.z, hx: c.hw * cos + c.hd * sen, hz: c.hw * sen + c.hd * cos };
};

/** o terreiro vazio, medido e não olhado */
const hx = TERREIRO.largura / 2;
const hz = TERREIRO.profundidade / 2;
const invadeOTerreiro = dentro.colisores.filter((c) => {
  const e = envelope(c);
  return Math.abs(e.x) < hx + e.hx && Math.abs(e.z) < hz + e.hz;
});

/** as quatro bocas: nada a menos de 1,4 delas */
const bocas = dentro.pontos?.bocas ?? [];
const bocasEntupidas = bocas.filter((b) =>
  dentro.colisores.some((c) => {
    const e = envelope(c);
    const dx = Math.max(0, Math.abs(e.x - b.x) - e.hx);
    const dz = Math.max(0, Math.abs(e.z - b.z) - e.hz);
    return Math.hypot(dx, dz) < 1.4;
  }),
);

await page.screenshot({ path: `${OUT}-dentro.png` });

// ================================================ 3. andar até o fundo
/**
 * A travessia prova que o meio é andável de verdade, e não só livre de colisor
 * na conta: o jogo empurra quem esbarra.
 *
 * `W` sozinho anda na DIAGONAL (a câmera é isométrica: nenhuma tecla anda num
 * eixo só), então o teste mede DISTÂNCIA PERCORRIDA, e não o `z` final. E mede
 * por amostra: o Chromium sem tela roda o tempo de jogo bem mais devagar que o
 * relógio, e o que denuncia esbarrão é um trecho que não anda, não um total
 * pequeno.
 */
await page.evaluate(() => window.jogo.debugPlace(5.5, 5, Math.PI));
await page.waitForTimeout(700);
const trilha = [await onde()];
await page.keyboard.down('KeyW');
for (let i = 0; i < 9; i++) {
  await page.waitForTimeout(900);
  trilha.push(await onde());
}
await page.keyboard.up('KeyW');
await page.waitForTimeout(400);
const depoisDeAtravessar = await onde();
const trechos = trilha.slice(1).map((p, i) => +Math.hypot(p[0] - trilha[i][0], p[1] - trilha[i][1]).toFixed(2));
const andou = trechos.reduce((a, b) => a + b, 0);

// ================================================ 4. as conversas da cena
const conversar = async (x, z) => {
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
  await page.waitForTimeout(1200);
  const rotulo = await prompt();
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(900);
  const ditas = [];
  for (let i = 0; i < 14; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 8) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(650);
  }
  return { rotulo, ditas };
};

const naBancada = await conversar(-12.4, -4.6);
const noTonel = await conversar(-12.3, 4.4);
const noTerreiro = await conversar(0, 1.6);

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'estufa-da-josefina'),
);

// ================================================ 5. voltar pro jardim
await page.evaluate(() => window.jogo.debugPlace(0, 8.6, 0));
await page.waitForTimeout(1200);
const promptDeSaida = await prompt();
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const cenaDepoisDeSair = await cena();
const volta = await onde();
await page.screenshot({ path: `${OUT}-volta.png` });

// ------------------------------------------------------------------ relatório
console.log('1. prompt no jardim:', JSON.stringify(promptDeEntrada),
  '· cena:', cenaDepoisDeEntrar, '· chegou em', JSON.stringify(chegada));
console.log('2. peças:', JSON.stringify(dentro.pecas));
console.log('   canteiros:', dentro.canteiros.length,
  '· espécies:', JSON.stringify(dentro.especies));
console.log('   colisores:', dentro.colisores.length,
  '· invadindo o terreiro:', invadeOTerreiro.length,
  '· bocas entupidas:', bocasEntupidas.length);
console.log('3. travessia do meio: (5.5, 5) →', JSON.stringify(depoisDeAtravessar),
  '· andou', andou.toFixed(2), '· trechos:', JSON.stringify(trechos));
console.log('4. bancada:', JSON.stringify(naBancada.rotulo));
for (const f of naBancada.ditas) console.log('   ', f);
console.log('   tonel:', JSON.stringify(noTonel.rotulo),
  '· terreiro:', JSON.stringify(noTerreiro.rotulo));
console.log('   memória no diário:', noDiario);
console.log('5. prompt de saída:', JSON.stringify(promptDeSaida),
  '· cena:', cenaDepoisDeSair, '· voltou em', JSON.stringify(volta));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!/estufa/i.test(promptDeEntrada ?? '')) problemas.push('a porta da estufa não acende no jardim');
if (cenaDepoisDeEntrar !== 'estufa') problemas.push(`entrar levou para "${cenaDepoisDeEntrar}"`);
if (Math.abs(chegada[0]) > 1 || chegada[1] < 6) {
  problemas.push(`quem entra não cai na frente da porta (${chegada})`);
}
if (dentro.canteiros.length !== 8) {
  problemas.push(`a estufa tem ${dentro.canteiros.length} canteiros, e não 8`);
}
if (dentro.especies.length < 5) {
  problemas.push(`só ${dentro.especies.length} espécies — a estufa é o jardim GRANDE`);
}
// nenhum canteiro pode estar no meio: eles são a beirada que se defende
if (dentro.canteiros.some((c) => Math.abs(c.x) < hx && Math.abs(c.z) < hz)) {
  problemas.push('tem canteiro dentro do terreiro');
}
if (invadeOTerreiro.length) {
  problemas.push(`${invadeOTerreiro.length} colisor(es) dentro do terreiro: ` +
    JSON.stringify(invadeOTerreiro.slice(0, 4)));
}
if (bocas.length !== 4) problemas.push('a cena não publica as quatro bocas');
if (bocasEntupidas.length) problemas.push(`${bocasEntupidas.length} boca(s) com colisor em cima`);
if (!dentro.pecas['tonel-de-agua']) problemas.push('o tonel de água sumiu');
if (!dentro.pecas['bancada-de-jardinagem']) problemas.push('a bancada de jardinagem sumiu');
if (!dentro.pecas['regador']) problemas.push('o regador sumiu — é a arma do minigame');
if ((dentro.pecas['arco-de-estufa'] ?? 0) < 3) {
  problemas.push('faltam arcos: sem eles a estufa lê como pátio, e não como estufa');
}
// atravessar o meio: nenhum trecho parado (esbarrão) e a diagonal fechada
if (trechos.some((t) => t < 0.4)) {
  problemas.push(`travou ao atravessar o terreiro (trechos: ${JSON.stringify(trechos)})`);
}
if (andou < 5) problemas.push(`mal saiu do lugar no terreiro (${andou.toFixed(2)})`);
if (naBancada.ditas.length < 4) problemas.push('a conversa da bancada não aconteceu');
if (!noDiario) problemas.push('a memória da estufa não entrou no diário');
if (!noTonel.ditas.length) problemas.push('o tonel não rende conversa');
if (!noTerreiro.ditas.length) problemas.push('o terreiro não rende conversa');
if (cenaDepoisDeSair !== 'clube') problemas.push(`sair levou para "${cenaDepoisDeSair}"`);
if (Math.hypot(volta[0] - PORTA_NO_JARDIM.x, volta[1] - PORTA_NO_JARDIM.z) > 2) {
  problemas.push(`quem volta não cai na frente da estufa (${volta})`);
}

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
