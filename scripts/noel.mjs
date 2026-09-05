/**
 * O Noel, o peru do bar de sucos — o terceiro funcionário do clube.
 *
 * O que este teste guarda:
 *
 * - ele PASSEIA. A Gina e o Capy têm posto e ficam parados; o Noel é o primeiro
 *   funcionário que anda, e é isso que a personalidade pede. A trilha tem que
 *   somar distância de verdade, e ele não pode sair da faixa;
 * - ele fica NA FRENTE DO QUIOSQUE, no concreto aberto. A primeira faixa era ao
 *   lado do bar, e de longe o quiosque comia o peru inteiro;
 * - o prompt ANDA JUNTO com ele;
 * - O PROMPT DELE NÃO ROUBA O DE PEDIR SUCO. Ele mora a dois passos de uma
 *   interação que já existia, e um ponto que segue o jogador pode encobrir a
 *   outra sem ninguém notar — é o pior tipo de regressão, porque o botão
 *   continua lá e só deixa de responder;
 * - ele dá GLUGLU sozinho, no som novo dele;
 * - o LEQUE ABRE. É a silhueta do bicho e a única coisa que se lê de longe:
 *   ele muda de abertura sozinho, e abre MAIS no carinho;
 * - a conversa de apresentação acontece uma vez, diz o nome dele, e a memória
 *   entra no diário.
 *
 * Uso: node scripts/noel.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './noel';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com a área que a cena passa */
const FAIXA = { minX: -17.2, maxX: -14.8, minZ: 9.4, maxZ: 10.4 };
/** o quiosque de suco e o ponto de pedir, que já existiam */
const QUIOSQUE = { x: -12.5, z: 7.2 };
const PEDIR = { x: -12.2, z: 9.2 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 820 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
// o primeiro clique é o que tem permissão de acordar o áudio
await page.mouse.click(500, 420);
await page.waitForTimeout(400);

const medir = () =>
  page.evaluate(() => {
    let noel = null;
    window.jogo.scene.traverse((o) => {
      if (!noel && o.userData?.peca === 'noel') noel = o;
    });
    if (!noel) return null;
    const leque = noel.getObjectByName('leque-do-noel');
    // a abertura do leque: a soma dos ângulos das penas, que é o que muda
    // quando ele abre e fecha
    const abertura = leque
      ? leque.children.reduce((soma, g) => soma + Math.abs(g.rotation.z), 0)
      : null;
    return {
      onde: [+noel.position.x.toFixed(3), +noel.position.z.toFixed(3)],
      leque: abertura === null ? null : +abertura.toFixed(4),
    };
  });

const existe = (await medir()) !== null;

// ------------------------------------------------- 1. ele passeia na faixa
// a dupla fica longe, para não empurrar o peru
await page.evaluate(() => window.jogo.debugPlace(-9, 12, 0));
const trilha = [];
const leques = [];
for (let i = 0; i < 24; i++) {
  const m = await medir();
  if (m) {
    trilha.push(m.onde);
    leques.push(m.leque);
  }
  await page.waitForTimeout(700);
}
await page.screenshot({ path: `${OUT}-bar.png` });

let andou = 0;
let maiorPasso = 0;
for (let i = 1; i < trilha.length; i++) {
  const d = Math.hypot(trilha[i][0] - trilha[i - 1][0], trilha[i][1] - trilha[i - 1][1]);
  andou += d;
  maiorPasso = Math.max(maiorPasso, d);
}
const foraDaFaixa = trilha.filter(
  ([x, z]) => x < FAIXA.minX - 0.3 || x > FAIXA.maxX + 0.3 || z < FAIXA.minZ - 0.3 || z > FAIXA.maxZ + 0.3,
);
// ele tem que estar NA FRENTE do quiosque (z maior), e não colado nele
const naFrente = trilha.every(([, z]) => z > QUIOSQUE.z + 1.6);
const abriuEFechou = Math.max(...leques) - Math.min(...leques);

// ------------------------------------ 2. o prompt anda junto, e não rouba
const grudado = await page.evaluate(() => {
  const it = window.jogo.current.world.interactables.find((i) => i.id === 'clube:noel');
  let noel = null;
  window.jogo.scene.traverse((o) => {
    if (!noel && o.userData?.peca === 'noel') noel = o;
  });
  if (!it || !noel) return null;
  return {
    doPrompt: [+it.x.toFixed(3), +it.z.toFixed(3)],
    doNoel: [+noel.position.x.toFixed(3), +noel.position.z.toFixed(3)],
  };
});
const distancia = grudado
  ? Math.hypot(grudado.doPrompt[0] - grudado.doNoel[0], grudado.doPrompt[1] - grudado.doNoel[1])
  : Infinity;

/**
 * A REGRESSÃO QUE ISTO GUARDA: parado no ponto de pedir suco, o prompt que
 * aparece TEM que ser o do balcão. O Noel passeia com o balão dele junto, e um
 * ponto que anda pode cobrir uma interação parada sem que nada quebre — o botão
 * continua na tela e simplesmente deixa de fazer o que fazia.
 */
await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z + 0.6, Math.PI), [PEDIR.x, PEDIR.z]);
await page.waitForTimeout(1400);
const promptNoBalcao = await page.locator('.prompt .label').textContent().catch(() => '');

// ------------------------------------------------- 3. falar com o Noel
const p = (await medir()).onde;
await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.5, z + 0.6, 0), p);
await page.waitForTimeout(1400);
const promptPerto = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const lequeNoCarinho = (await medir()).leque;

const falas = [];
for (let i = 0; i < 24; i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 8) falas.push(t);
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
}
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-conversa.png` });

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'noel-do-bar'),
);

// ------------------------------------------------- 4. o gluglu espontâneo
/**
 * O relógio do jogo aqui dentro anda a menos de um terço do relógio de parede,
 * então o teste ESPERA ACONTECER em vez de cronometrar. O gluglu dele sai a
 * cada 8-16 s de jogo — é o bicho mais falante do clube.
 */
const glugus = () =>
  page.evaluate(() => Object.fromEntries(window.jogo.audio.contagem).gluglu ?? 0);
const antes = await glugus();
let depois = antes;
for (let i = 0; i < 50 && depois === antes; i++) {
  await page.waitForTimeout(3000);
  depois = await glugus();
}

// ------------------------------------------------------------------ relatório
console.log('1. o Noel existe:', existe);
console.log('   passeou', andou.toFixed(2), 'unidades em 17 s · maior passo', maiorPasso.toFixed(2),
  '· fora da faixa:', foraDaFaixa.length, '· sempre na frente do quiosque:', naFrente);
console.log('   leque abriu e fechou:', abriuEFechou.toFixed(3),
  '· no carinho:', lequeNoCarinho, 'contra', Math.max(...leques).toFixed(3), 'de repouso');
console.log('2. ponto de interação:', JSON.stringify(grudado?.doPrompt),
  '· peru:', JSON.stringify(grudado?.doNoel), '· distância:', distancia.toFixed(3));
console.log('   no balcão o prompt é:', JSON.stringify(promptNoBalcao));
console.log('3. prompt perto dele:', JSON.stringify(promptPerto));
for (const f of falas) console.log('   ', f);
console.log('   memória no diário:', noDiario);
console.log('4. gluglus sozinho:', depois - antes);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!existe) problemas.push('o Noel não está na cena');
if (andou < 1.2) problemas.push(`o peru mal andou (${andou.toFixed(2)} em 17 s) — ele é o que anda`);
if (maiorPasso > 1.2) problemas.push('o peru teleportou de um ponto a outro');
if (foraDaFaixa.length) problemas.push(`saiu da faixa ${foraDaFaixa.length}×`);
if (!naFrente) problemas.push('ele foi parar ao lado do quiosque, onde a peça o esconde');
if (abriuEFechou < 0.2) problemas.push('o leque está travado: ele não abre nem fecha');
if (!(lequeNoCarinho > Math.max(...leques))) {
  problemas.push(`o leque não abriu mais no carinho (${lequeNoCarinho} contra ${Math.max(...leques).toFixed(3)})`);
}
if (!grudado) problemas.push('não achei o ponto de interação do Noel');
else if (distancia > 0.05) {
  problemas.push(`o ponto de interação ficou ${distancia.toFixed(2)} atrás dele (faltou moveTo)`);
}
if (!/gelada/i.test(promptNoBalcao ?? '')) {
  problemas.push(`o Noel roubou o prompt de pedir suco (no balcão aparece ${JSON.stringify(promptNoBalcao)})`);
}
if (!/noel/i.test(promptPerto ?? '')) problemas.push('o prompt do Noel não apareceu');
if (falas.length < 6) problemas.push('a conversa de apresentação não aconteceu');
if (!falas.some((f) => /Noel/.test(f))) problemas.push('ele não diz o próprio nome');
if (!falas.some((f) => /peru/i.test(f))) problemas.push('a conversa não diz que ele é um peru');
if (!noDiario) problemas.push('a memória do Noel não entrou no diário');
if (depois - antes < 1) problemas.push('ele não deu gluglu sozinho');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
