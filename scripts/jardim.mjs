/**
 * O jardim do clube e a Josefina, a tartaruga jardineira.
 *
 * O que este teste guarda:
 *
 * - O JARDIM É ORGANIZADO, e "organizado" aqui é medível: os oito canteiros
 *   ficam em DUAS COLUNAS alinhadas (dois valores de `x`, e não oito), em
 *   FILEIRAS alinhadas (quatro valores de `z`), e cada canteiro tem UM tipo de
 *   planta só. Foi o pedido do Renan, e é a diferença entre jardim e mato;
 * - TEM PLANTA DIRETO NO CHÃO, além dos canteiros — também pedido dele;
 * - a JOSEFINA anda pelo CAMINHO e nunca pisa num canteiro. A faixa dela é o
 *   corredor entre as duas colunas: é a coleira dos outros bichos usada ao
 *   contrário, e se alguém alargar essa faixa ela passa a andar em cima da
 *   horta;
 * - ela é a MAIS LENTA do jogo. Anda, mas pouco: é a personalidade que o Renan
 *   pediu, e ela mora em dois números da ficha;
 * - ela MOSTRA A CARA. A cabeça já ficou enfiada na borda do casco, e como ela
 *   passa a maior parte do tempo parada, era assim que aparecia quase sempre;
 * - o prompt anda junto, a conversa acontece, a memória entra no diário, e cada
 *   visita seguinte rende uma HISTÓRIA DIFERENTE — ela é a que conta histórias;
 * - ela cantarola sozinha.
 *
 * Uso: node scripts/jardim.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './jardim';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o `JARDIM` da cena */
const CAMINHO = 25.6;
const FAIXA = { minX: CAMINHO - 0.55, maxX: CAMINHO + 0.55, minZ: -20, maxZ: -7.4 };

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

// ============================================ 1. o jardim está organizado
const jardim = await page.evaluate(() => {
  const canteiros = [];
  let vasos = 0;
  let regadores = 0;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'canteiro-de-horta') {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      canteiros.push({
        x: +e[12].toFixed(2),
        z: +e[14].toFixed(2),
        planta: o.userData.planta,
        // quantas mudas dentro: grupos filhos que não são as tábuas nem a terra
        mudas: o.children.filter((c) => c.isGroup).length,
      });
    }
    if (o.userData?.peca === 'vaso-de-planta') vasos += 1;
    if (o.userData?.peca === 'regador') regadores += 1;
  });
  return {
    canteiros,
    colunas: [...new Set(canteiros.map((c) => c.x))].sort((a, b) => a - b),
    fileiras: [...new Set(canteiros.map((c) => c.z))].sort((a, b) => a - b),
    especies: [...new Set(canteiros.map((c) => c.planta))].sort(),
    vasos,
    regadores,
  };
});

/**
 * PLANTA DIRETO NO CHÃO. As mudas fora de canteiro são grupos soltos na raiz do
 * mundo, na área do jardim e com a base rente ao gramado — o teste conta quantas
 * malhas de folha existem ali fora das muretas.
 */
const noChao = await page.evaluate(() => {
  let n = 0;
  for (const o of window.jogo.current.world.root.children) {
    if (!o.isGroup || o.userData?.peca) continue;
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements;
    const dentroDoJardim = e[12] > 21 && e[12] < 30 && e[14] > -23 && e[14] < -5;
    // rente ao chão: canteiro e vaso levantam a planta, chão não
    if (dentroDoJardim && Math.abs(e[13]) < 0.02 && o.children.length > 2) n += 1;
  }
  return n;
});

// ============================================ 2. a Josefina anda no caminho
const medir = () =>
  page.evaluate(() => {
    let j = null;
    window.jogo.scene.traverse((o) => {
      if (!j && o.userData?.peca === 'josefina') j = o;
    });
    if (!j) return null;
    const cabeca = j.getObjectByName('cabeca-da-josefina');
    let cabecaZ = null;
    if (cabeca) {
      cabeca.updateWorldMatrix(true, false);
      cabecaZ = +cabeca.matrixWorld.elements[14].toFixed(3);
    }
    return {
      onde: [+j.position.x.toFixed(3), +j.position.z.toFixed(3)],
      // o quanto a cabeça sai do casco, em coordenada local do bicho
      pescoco: +(j.getObjectByName('pescoco-da-josefina')?.position.z ?? 0).toFixed(3),
      cabecaZ,
    };
  });

const existe = (await medir()) !== null;
await page.evaluate(() => window.jogo.debugPlace(21, -4, 0));

const trilha = [];
/**
 * O PESCOÇO É AMOSTRADO AO LONGO DO PASSEIO, e não uma vez só. Ele interpola
 * devagar (é uma tartaruga) e o valor de repouso só aparece depois de alguns
 * segundos parada — medir num instante único pegava ela ainda a caminho, e o
 * teste acusava um gesto que existe.
 */
const pescocos = [];
for (let i = 0; i < 30; i++) {
  const m = await medir();
  if (m) {
    trilha.push(m.onde);
    pescocos.push(m.pescoco);
  }
  await page.waitForTimeout(700);
}
await page.screenshot({ path: `${OUT}-jardim.png` });

let andou = 0;
for (let i = 1; i < trilha.length; i++) {
  andou += Math.hypot(trilha[i][0] - trilha[i - 1][0], trilha[i][1] - trilha[i - 1][1]);
}
const foraDaFaixa = trilha.filter(
  ([x, z]) => x < FAIXA.minX - 0.25 || x > FAIXA.maxX + 0.25 || z < FAIXA.minZ - 0.25 || z > FAIXA.maxZ + 0.25,
);
// nenhum ponto da trilha pode cair dentro de um canteiro
const emCimaDaHorta = [];
for (const [x, z] of trilha) {
  for (const c of jardim.canteiros) {
    if (Math.abs(x - c.x) < 1.1 && Math.abs(z - c.z) < 0.65) emCimaDaHorta.push(`${x},${z}`);
  }
}

// ==================================================== 3. falar com ela
const pescocoRecolhido = Math.min(...pescocos);
const p = (await medir()).onde;
await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.4, z + 1.1, Math.PI), p);
await page.waitForTimeout(1400);
const promptPerto = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
// 3 s, e não 1: ela é lenta de propósito, e o pescoço leva esse tempo para
// chegar no fim do curso
await page.waitForTimeout(3000);
const pescocoNoCarinho = (await medir()).pescoco;

const venceAFala = async () => {
  const ditas = [];
  for (let i = 0; i < 22; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 8) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(700);
  }
  return ditas;
};
const falas = await venceAFala();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-conversa.png` });

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'josefina-do-jardim'),
);

/**
 * AS HISTÓRIAS. Da segunda visita em diante ela conta uma cada vez, e não pode
 * ser sempre a mesma: contar histórias é o que ela faz, e uma frase repetida
 * transforma a jardineira numa placa.
 */
const historias = new Set();
for (let volta = 0; volta < 8; volta++) {
  const onde = (await medir()).onde;
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.4, z + 1.1, Math.PI), onde);
  await page.waitForTimeout(1100);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1100);
  const ditas = await venceAFala();
  for (const d of ditas) historias.add(d);
  await page.waitForTimeout(400);
}

// ================================================= 4. o cantarolar sozinha
const cantos = () =>
  page.evaluate(() => Object.fromEntries(window.jogo.audio.contagem).cantarolar ?? 0);
const antes = await cantos();
let depois = antes;
for (let i = 0; i < 60 && depois === antes; i++) {
  await page.waitForTimeout(3000);
  depois = await cantos();
}

// ------------------------------------------------------------------ relatório
console.log('1. canteiros:', jardim.canteiros.length,
  '· colunas de x:', JSON.stringify(jardim.colunas),
  '· fileiras de z:', JSON.stringify(jardim.fileiras));
console.log('   espécies:', JSON.stringify(jardim.especies),
  '· mudas por canteiro:', JSON.stringify(jardim.canteiros.map((c) => c.mudas)));
console.log('   vasos:', jardim.vasos, '· regadores:', jardim.regadores,
  '· plantas direto no chão:', noChao);
console.log('2. a Josefina existe:', existe, '· passeou', andou.toFixed(2), 'em 21 s');
console.log('   fora da faixa:', foraDaFaixa.length, '· em cima da horta:', emCimaDaHorta.length);
console.log('3. prompt:', JSON.stringify(promptPerto));
console.log('   pescoço · mais recolhido no passeio:', pescocoRecolhido,
  '· no carinho:', pescocoNoCarinho);
for (const f of falas) console.log('   ', f);
console.log('   memória no diário:', noDiario);
console.log('   histórias diferentes em 8 visitas:', historias.size);
console.log('4. cantarolou sozinha:', depois - antes);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (jardim.canteiros.length !== 8) problemas.push(`o jardim tem ${jardim.canteiros.length} canteiros, e não 8`);
if (jardim.colunas.length !== 2) {
  problemas.push(`os canteiros não estão em duas colunas alinhadas (${jardim.colunas.length} valores de x)`);
}
if (jardim.fileiras.length !== 4) {
  problemas.push(`os canteiros não estão em quatro fileiras alinhadas (${jardim.fileiras.length} valores de z)`);
}
if (jardim.especies.length < 4) {
  problemas.push(`o jardim só tem ${jardim.especies.length} espécies — o pedido era plantas diferentes`);
}
// cada canteiro tem que estar CHEIO: com três mudas ele lê como caixa de areia
if (jardim.canteiros.some((c) => c.mudas < 6)) {
  problemas.push(`tem canteiro ralo (${Math.min(...jardim.canteiros.map((c) => c.mudas))} mudas)`);
}
if (jardim.vasos < 4) problemas.push('faltam os vasos que dão relevo ao jardim');
if (!jardim.regadores) problemas.push('o regador sumiu: nada diz que alguém trabalha aqui');
if (noChao < 6) problemas.push(`quase nada plantado direto no chão (${noChao})`);
if (!existe) problemas.push('a Josefina não está na cena');
// ela é lenta, mas não é estátua: 21 s de relógio dão poucos passos dela
if (andou < 0.5) problemas.push(`a Josefina está congelada (${andou.toFixed(2)} em 21 s)`);
if (andou > 6) problemas.push(`a Josefina está correndo (${andou.toFixed(2)}) — ela é a mais lenta do jogo`);
if (foraDaFaixa.length) problemas.push(`saiu da faixa do caminho ${foraDaFaixa.length}×`);
if (emCimaDaHorta.length) problemas.push(`ela pisou num canteiro ${emCimaDaHorta.length}×`);
if (!/josefina/i.test(promptPerto ?? '')) problemas.push('o prompt da Josefina não apareceu');
if (!(pescocoNoCarinho > pescocoRecolhido + 0.05)) {
  problemas.push(`ela não estica o pescoço no carinho (${pescocoRecolhido} → ${pescocoNoCarinho})`);
}
if (falas.length < 6) problemas.push('a conversa de apresentação não aconteceu');
if (!falas.some((f) => /Josefina/.test(f))) problemas.push('ela não diz o próprio nome');
if (!falas.some((f) => /vasinho|laço/i.test(f))) {
  problemas.push('a conversa não repara no vasinho nem no laço — são os dois pedidos do Renan');
}
if (!noDiario) problemas.push('a memória da Josefina não entrou no diário');
if (historias.size < 3) problemas.push(`ela repete a mesma história (${historias.size} diferentes em 8 visitas)`);
if (depois - antes < 1) problemas.push('ela não cantarolou sozinha');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
