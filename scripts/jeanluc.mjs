/**
 * O JEAN-LUC — o pato francês que sobe do lago depois de cinco vitórias.
 *
 * O que este teste guarda:
 *
 * - **ANTES DAS CINCO VITÓRIAS ELE NÃO EXISTE.** Invisível, submerso e sem
 *   prompt. Um NPC que já está lá esperando estraga a única coisa que a cena
 *   tem: a surpresa.
 * - **A CHEGADA É UMA EMERSÃO DE VERDADE.** O teste mede a altura dele
 *   enquanto a cutscene roda: ele tem que começar abaixo do chão do mundo,
 *   passar da linha d'água e terminar em zero. Se alguém trocar a subida por
 *   um `visible = true`, isto quebra.
 * - **ELE SAI DO LAGO E CHEGA NA ARENA.** Começa a mais de 6 do centro d'água
 *   e termina no tablado, longe da água — atravessar é o ponto da cena.
 * - **A DUPLA É DEVOLVIDA.** `lockPlayer` sai, a câmera larga o alvo e o bicho
 *   volta a passear: cutscene que esquece de devolver alguma dessas três deixa
 *   o jogo travado para o resto da sessão (é o que o teste do garçom mede).
 * - **DEPOIS ELE FICA, E CONVERSA.** O prompt existe, anda junto com ele
 *   (prova o `moveTo`) e a fala varia a cada conversa.
 * - **E ELE SOBREVIVE AO F5.** A flag persiste: quem já conhece o pato o
 *   encontra na arena, sem cutscene nenhuma.
 *
 * O GATILHO É CHAMADO DIRETO (`mesaPing.userData.jeanLuc.chegar`) em vez de
 * jogar cinco partidas de cinco pontos cada. É o mesmo espírito do
 * `userData.pingpong` que o `pingpong.mjs` já usa: a cena publica na mesa o
 * que um teste não teria como alcançar de fora.
 *
 * Uso: node scripts/jeanluc.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './jeanluc';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const LAGO = { x: -21, z: 11 };
const ARENA = { x: -14.5, z: 24.2 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-14.5,26.4&zoom=11`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

/** o punhado de coisas que o teste lê de dentro da cena */
const espiar = () =>
  page.evaluate(() => {
    let mesa = null;
    window.jogo.current.world.root.traverse((n) => {
      if (n.userData?.pingpong) mesa = n;
    });
    const jl = mesa?.userData?.jeanLuc?.bicho ?? null;
    return {
      achou: !!jl,
      visivel: jl ? jl.group.visible : null,
      x: jl ? +jl.x.toFixed(2) : null,
      y: jl ? +jl.altura.toFixed(2) : null,
      z: jl ? +jl.z.toFixed(2) : null,
      conhecido: window.jogo.flag('jean-luc-conhecido'),
      travado: window.jogo.player.locked === true,
      prompt: document.querySelector('.prompt .label')?.textContent ?? '',
    };
  });

// ============================================ 1. antes: ele não está lá
const antes = await espiar();
await page.evaluate(() => window.jogo.debugPlace(-17.6, 26.3, 0));
await page.waitForTimeout(800);
const promptAntes = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';

// ============================================ 2. a chegada
/**
 * A cutscene roda SOLTA (sem `await` do lado do teste) e o `E` vai drenando os
 * diálogos enquanto ela anda — é assim que uma pessoa joga. Em paralelo o
 * teste amostra a altura dele a cada 120 ms: é essa trilha que prova a
 * emersão, e ela só existe se for medida ENQUANTO acontece.
 */
await page.evaluate(() => {
  let mesa = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.pingpong) mesa = n;
  });
  // AS CINCO VITÓRIAS, escritas no save em vez de jogadas: o gatilho é o
  // `stat`, e a cutscene confere ele antes de qualquer outra coisa. Jogar
  // cinco partidas de cinco pontos cada aqui seriam uns dez minutos de teste
  // para provar uma condição de uma linha.
  for (let i = 0; i < 5; i++) window.jogo.save.bump('pingpong.vitorias');
  window.__alturas = [];
  window.__chegou = false;
  const jl = mesa.userData.jeanLuc.bicho;
  const relogio = setInterval(() => window.__alturas.push(+jl.altura.toFixed(3)), 120);
  void mesa.userData.jeanLuc.chegar().then(() => {
    clearInterval(relogio);
    window.__chegou = true;
  });
});

const falas = [];
for (let i = 0; i < 90; i++) {
  if (await page.evaluate(() => window.__chegou)) break;
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 3 && !falas.includes(t)) falas.push(t);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(420);
}
const chegou = await page.evaluate(() => window.__chegou);
const alturas = await page.evaluate(() => window.__alturas);
const depois = await espiar();
await page.screenshot({ path: `${OUT}-chegou.png` });

const fundo = Math.min(...alturas);
const topo = Math.max(...alturas);
const doLagoNoFim = Math.hypot(depois.x - LAGO.x, depois.z - LAGO.z);
const naArena = Math.hypot(depois.x - ARENA.x, depois.z - ARENA.z);

// ============================================ 3. ele fica, e conversa
await page.evaluate(() => window.jogo.debugPlace(-17.6, 27.2, 0));
await page.waitForTimeout(900);
const promptDepois = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';

/** aperta E ao lado dele e devolve as falas */
const conversar = async () => {
  const onde = await page.evaluate(() => {
    let mesa = null;
    window.jogo.current.world.root.traverse((n) => {
      if (n.userData?.pingpong) mesa = n;
    });
    const jl = mesa.userData.jeanLuc.bicho;
    window.jogo.debugPlace(jl.x, jl.z + 0.9, 0);
    return [+jl.x.toFixed(2), +jl.z.toFixed(2)];
  });
  await page.waitForTimeout(650);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(650);
  const ditas = [];
  for (let i = 0; i < 10; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 3 && !ditas.includes(t)) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(420);
  }
  return { onde, ditas };
};
const primeira = await conversar();
const segunda = await conversar();

/**
 * O BALÃO ANDA JUNTO COM ELE. Compara o ponto do interativo com onde o bicho
 * ESTÁ — e não "o prompt apareceu aqui": ele passeia, e qualquer canto do
 * tablado pode ter ele em cima na hora do teste.
 */
const balao = await page.evaluate(() => {
  let mesa = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.pingpong) mesa = n;
  });
  const jl = mesa.userData.jeanLuc.bicho;
  const it = window.jogo.current.world.interactables.find((i) => i.id === 'parque:jean-luc');
  return it ? +Math.hypot(it.x - jl.x, it.z - jl.z).toFixed(2) : null;
});

// ele anda mesmo? mede a trilha com o jogo correndo
const trilha = await page.evaluate(async () => {
  let mesa = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.pingpong) mesa = n;
  });
  const jl = mesa.userData.jeanLuc.bicho;
  let soma = 0;
  let ax = jl.x;
  let az = jl.z;
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 120));
    soma += Math.hypot(jl.x - ax, jl.z - az);
    ax = jl.x;
    az = jl.z;
  }
  return +soma.toFixed(2);
});
const noTablado = await page.evaluate((a) => {
  let mesa = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.pingpong) mesa = n;
  });
  const jl = mesa.userData.jeanLuc.bicho;
  // a faixa da frente do tablado, com uma folga de meio passo
  return Math.abs(jl.x - a.x) < a.largura / 2 && jl.z > 25.1 && jl.z < 27.2;
}, { x: ARENA.x, largura: 10.4 });

await page.screenshot({ path: `${OUT}-conversa.png` });

// ============================================ 4. ele sobrevive ao F5
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
const depoisDoF5 = await espiar();

// ============================================ 5. veredito
const falhas = [];
if (!antes.achou) falhas.push('a cena nao publicou o Jean-Luc na mesa');
if (antes.visivel) falhas.push('o pato aparece ANTES das cinco vitorias');
if (antes.y !== null && antes.y > -0.5) {
  falhas.push(`o pato nao comeca submerso: y = ${antes.y}`);
}
if (promptAntes.includes('Jean-Luc')) falhas.push(`o prompt dele existe antes da hora: "${promptAntes}"`);

if (!chegou) falhas.push('a cutscene nunca terminou');
if (alturas.length < 6) falhas.push(`a emersao nao foi medida (${alturas.length} amostras)`);
if (fundo > -0.5) falhas.push(`ele nao veio do fundo: o menor y foi ${fundo}`);
if (topo < 0.1) falhas.push(`ele nao chegou a saltar acima da linha d'agua: maior y ${topo}`);
if (Math.abs(depois.y) > 0.02) falhas.push(`ele nao assentou no chao: y = ${depois.y}`);
if (doLagoNoFim < 13) falhas.push(`ele ficou no lago: ${doLagoNoFim.toFixed(1)} do centro d'agua`);
if (naArena > 5) falhas.push(`ele nao chegou na arena: ${naArena.toFixed(1)} do centro dela`);
if (!depois.conhecido) falhas.push('a flag `jean-luc-conhecido` nao foi gravada');
if (depois.travado) falhas.push('a cutscene devolveu a dupla travada');
if (falas.length < 10) falhas.push(`a apresentacao foi curta demais: ${falas.length} falas`);
if (!falas.some((f) => /Jean-Luc/.test(f))) falhas.push('ele nunca disse o proprio nome');

if (!/Jean-Luc/.test(promptDepois)) falhas.push(`nao da para falar com ele: "${promptDepois}"`);
if (primeira.ditas.length < 2) falhas.push(`a conversa nao saiu: ${JSON.stringify(primeira.ditas)}`);
if (segunda.ditas.length && primeira.ditas[0] === segunda.ditas[0]) {
  falhas.push('ele repete a mesma abertura toda vez');
}
if (balao === null || balao > 0.6) falhas.push(`o balao nao anda junto com ele: ${balao} de distancia`);
if (trilha < 0.8) falhas.push(`ele nao passeia: andou ${trilha} em ~11 s`);
if (!noTablado) falhas.push('ele saiu da faixa da frente do tablado');

if (!depoisDoF5.conhecido) falhas.push('o F5 esqueceu que a dupla ja conhece o pato');
if (!depoisDoF5.visivel) falhas.push('depois do F5 ele sumiu de novo');
if (depoisDoF5.y !== null && Math.abs(depoisDoF5.y) > 0.02) {
  falhas.push(`depois do F5 ele voltou para debaixo d'agua: y = ${depoisDoF5.y}`);
}
falhas.push(...erros);

console.log('1. antes:', JSON.stringify(antes), '· prompt:', JSON.stringify(promptAntes));
console.log('2. emersao: y de', fundo, 'a', topo, 'em', alturas.length, 'amostras · terminou em', depois.y);
console.log('   chegou a', JSON.stringify([depois.x, depois.z]),
  `· ${doLagoNoFim.toFixed(1)} do lago · ${naArena.toFixed(1)} do centro da arena`);
console.log('   falas da chegada:', falas.length);
for (const f of falas.slice(0, 4)) console.log('     ·', f);
console.log('3. prompt depois:', JSON.stringify(promptDepois), '· balao a', balao, 'dele');
console.log('   1a conversa:', JSON.stringify(primeira.ditas[0]));
console.log('   2a conversa:', JSON.stringify(segunda.ditas[0]));
console.log('   passeio:', trilha, 'em ~11 s · na faixa da frente:', noTablado);
console.log('4. depois do F5:', JSON.stringify(depoisDoF5));

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
