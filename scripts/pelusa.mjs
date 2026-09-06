/**
 * O Pelusa, o gato do Ari, no quarto dele.
 *
 * O que este teste guarda:
 * - ele ANDA sozinho pelo quarto — a trilha tem que somar distância de verdade,
 *   e não ficar tremendo no mesmo ponto (o bug do relógio que não renovava:
 *   ele dava um passo de um frame e parava para sempre);
 * - ele fica DENTRO da área e nunca entra num móvel;
 * - o prompt de carinho ANDA JUNTO com ele — sem o `moveTo` o balão fica onde
 *   ele nasceu e o carinho vira um ponto morto no chão;
 * - ele MIA sozinho, sem ninguém pedir;
 * - o carinho funciona: ele senta, o Ari fala, e a memória entra no diário.
 *
 * Uso: node scripts/pelusa.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './pelusa';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** os mesmos móveis que a cena declara como proibidos para ele */
const MOVEIS = [
  ['cama', -2.2, -1.75, 1.05],
  ['criado-mudo', -1.05, -2.72, 0.45],
  ['estante', 0.15, -3.03, 0.7],
  ['armário', 2.65, -2.89, 1.0],
  ['escrivaninha', -3.5, 2.0, 0.9],
  ['vaso', 3.25, 0.9, 0.6],
];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
// o primeiro clique é o que tem permissão de acordar o áudio
await page.mouse.click(450, 520);
await page.waitForTimeout(500);

const onde = () =>
  page.evaluate(() => {
    let g = null;
    window.jogo.scene.traverse((o) => {
      if (o.userData?.peca === 'pelusa') g = o;
    });
    if (!g) return null;
    return [+g.position.x.toFixed(3), +g.position.z.toFixed(3)];
  });

const existe = (await onde()) !== null;

// ----------------------------------------------- 1. ele passeia pelo quarto
// A dupla fica longe, num canto, para não empurrar nem atrapalhar o gato.
await page.evaluate(() => window.jogo.debugPlace(2.6, 2.2, 0));
const trilha = [];
for (let i = 0; i < 26; i++) {
  trilha.push(await onde());
  await page.waitForTimeout(700);
}
await page.screenshot({ path: `${OUT}-quarto.png` });

let andou = 0;
let maiorPasso = 0;
for (let i = 1; i < trilha.length; i++) {
  const d = Math.hypot(trilha[i][0] - trilha[i - 1][0], trilha[i][1] - trilha[i - 1][1]);
  andou += d;
  maiorPasso = Math.max(maiorPasso, d);
}
const pontos = new Set(trilha.map((p) => p.join(','))).size;

// dentro da área, e fora de todo móvel
const foraDaArea = trilha.filter(
  ([x, z]) => x < -3.25 || x > 3.25 || z < -2.4 || z > 2.5,
);
const dentroDeMovel = [];
for (const [x, z] of trilha) {
  for (const [nome, mx, mz, r] of MOVEIS) {
    if (Math.hypot(x - mx, z - mz) < r * 0.92) dentroDeMovel.push(`${nome} em ${x},${z}`);
  }
}

// ------------------------------------------------- 2. o miado sai sozinho
const miados = await page.evaluate(
  () => Object.fromEntries(window.jogo.audio.contagem).miado ?? 0,
);

// ------------------------------------ 3. o prompt anda junto com o bichano
// Mede o ponto de interação CONTRA o gato, e não "o balão apareceu aqui": ele
// passeia, então qualquer canto do quarto pode ter o gato em cima na hora do
// teste, e a leitura pelo balão dava falso positivo sozinha.
const grudado = await page.evaluate(() => {
  const w = window.jogo.current.world;
  const it = w.interactables.find((i) => i.id === 'quarto:pelusa');
  let g = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'pelusa') g = o;
  });
  if (!it || !g) return null;
  return {
    doPrompt: [+it.x.toFixed(3), +it.z.toFixed(3)],
    doGato: [+g.position.x.toFixed(3), +g.position.z.toFixed(3)],
    // longe do (0, 0.05) onde ele nasceu? senão a medida não prova nada
    saiuDoNinho: Math.hypot(g.position.x, g.position.z - 0.05),
  };
});
const distanciaPromptGato = grudado
  ? Math.hypot(grudado.doPrompt[0] - grudado.doGato[0], grudado.doPrompt[1] - grudado.doGato[1])
  : Infinity;

const p = await onde();
await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.55, z + 0.55, 0), p);
await page.waitForTimeout(800);
const promptPerto = await page.locator('.prompt .label').textContent().catch(() => '');

// -------------------------------------------------------- 4. fazer carinho
const p2 = await onde();
await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.5, z + 0.5, 0), p2);
await page.waitForTimeout(800);
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);

/**
 * O QUANTO ELE ANDA DURANTE O CARINHO É MEDIDO AGORA, no começo da conversa, e
 * não depois dela.
 *
 * `duracaoDoCarinho` do Pelusa é 3,4 SEGUNDOS DE JOGO, e aqui dentro o relógio
 * do jogo anda a menos de um terço do relógio de parede: a conversa inteira já
 * consome quase todo esse tempo. Medindo no fim, o teste às vezes pegava o gato
 * DEPOIS de o carinho ter passado — e acusava um defeito que era só uma corrida
 * entre dois relógios. A janela abaixo cabe inteira dentro do carinho.
 */
const antesDoRepouso = await onde();
await page.waitForTimeout(1600);
const depoisDoRepouso = await onde();
const andouNoCarinho = Math.hypot(
  depoisDoRepouso[0] - antesDoRepouso[0],
  depoisDoRepouso[1] - antesDoRepouso[1],
);

const falas = [];
for (let i = 0; i < 10; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.waitForTimeout(850);
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t) falas.push(t);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(300);
}
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-carinho.png` });

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'pelusa'),
);
const miadosNoFim = await page.evaluate(
  () => Object.fromEntries(window.jogo.audio.contagem).miado ?? 0,
);

// ------------------------------------------------------------------ relatório
console.log('1. o gato existe:', existe);
console.log('   passeou', andou.toFixed(2), 'unidades em 18 s ·', pontos, 'posições distintas',
  '· maior passo', maiorPasso.toFixed(2));
console.log('   fora da área:', foraDaArea.length, '· dentro de móvel:', dentroDeMovel.length,
  dentroDeMovel.slice(0, 3).join(' | '));
console.log('2. miados espontâneos:', miados, '→', miadosNoFim);
console.log('3. ponto de interação:', JSON.stringify(grudado?.doPrompt),
  '· gato:', JSON.stringify(grudado?.doGato),
  '· distância entre os dois:', distanciaPromptGato.toFixed(3));
console.log('   já tinha saído do ponto onde nasceu:', grudado?.saiuDoNinho.toFixed(2));
console.log('   prompt ao chegar perto:', JSON.stringify(promptPerto));
console.log('4. falas do carinho:', JSON.stringify(falas));
console.log('   andou durante o carinho:', andouNoCarinho.toFixed(2), '(tem que ser pouco)');
console.log('   memória no diário:', noDiario);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!existe) problemas.push('o Pelusa não está na cena');
// 18 s de passeio. O piso é baixo de propósito: ele passa boa parte do tempo
// parado e sentado, que é o comportamento certo — o que este número precisa
// pegar é o gato CONGELADO, não o gato que descansa.
if (andou < 1.5) problemas.push(`o gato mal andou (${andou.toFixed(2)} unidades em 18 s)`);
if (pontos < 8) problemas.push(`o gato ficou parado no mesmo lugar (${pontos} posições)`);
if (maiorPasso > 1.2) problemas.push('o gato teleportou de um ponto a outro');
if (foraDaArea.length) problemas.push(`saiu da área ${foraDaArea.length}×`);
if (dentroDeMovel.length) problemas.push(`entrou num móvel: ${dentroDeMovel[0]}`);
if (miadosNoFim < 1) problemas.push('ele nunca miou');
if (!/pelusa/i.test(promptPerto ?? '')) problemas.push('não deu para chegar nele: o prompt não apareceu');
if (!grudado) problemas.push('não achei o ponto de interação do Pelusa');
else {
  if (grudado.saiuDoNinho < 0.5) problemas.push('o gato não saiu de onde nasceu: a medida não prova nada');
  if (distanciaPromptGato > 0.05) {
    problemas.push(`o ponto de interação ficou ${distanciaPromptGato.toFixed(2)} atrás do gato (faltou moveTo)`);
  }
}
if (falas.length < 3) problemas.push('a conversa do primeiro carinho não aconteceu');
if (!falas.some((f) => /Pelusa/.test(f))) problemas.push('a conversa não cita o nome dele');
if (andouNoCarinho > 0.5) problemas.push('ele saiu andando em vez de ficar quieto no carinho');
if (!noDiario) problemas.push('a memória do Pelusa não entrou no diário');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
