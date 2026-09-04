/**
 * A portaria do clube: a guarita e a girafa que toma conta dela.
 *
 * O que este teste guarda:
 * - a girafa FICA NO POSTO. Ela usa o mesmo cérebro do Pelusa, que passeia — o
 *   que a segura é a área que a cena passa, menor que o passo mínimo que o
 *   cérebro exige de um destino. Se um dia alguém alargar essa área, a porteira
 *   sai andando pelo clube e este teste cai;
 * - a CABEÇA dela fica do lado de FORA da parede da guarita e ACIMA do balcão.
 *   É a única parte que aparece, e ela só aparece por causa dessas duas contas:
 *   fora da parede, fora da sombra do telhado (a câmera olha em 34°);
 * - ela está VIVA: o pescoço muda de pose entre duas leituras;
 * - ela apita sozinha, sem ninguém pedir;
 * - o prompt aparece, e a conversa dela manda a dupla aproveitar o dia;
 * - a memória entra no diário.
 *
 * Uso: node scripts/guarita.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './guarita';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1150, height: 860 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);

/** onde a girafa e a cabeça dela estão, em mundo */
const medir = () =>
  page.evaluate(() => {
    let girafa = null;
    window.jogo.scene.traverse((o) => {
      if (!girafa && o.userData?.peca === 'girafa') girafa = o;
    });
    let guaritaObj = null;
    window.jogo.scene.traverse((o) => {
      if (!guaritaObj && o.userData?.peca === 'guarita') guaritaObj = o;
    });
    if (!girafa) return null;
    const onde = (o) => {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      return [+e[12].toFixed(3), +e[13].toFixed(3), +e[14].toFixed(3)];
    };
    let cabeca = null;
    girafa.traverse((o) => {
      if (!cabeca && o.name === 'cabeca-da-girafa') cabeca = o;
    });
    // a pose viva: as quatro inclinações do pescoço neste instante
    const pescoco = [];
    girafa.traverse((o) => {
      if (o.isGroup && o.children.some((c) => c.isMesh && c.geometry?.type === 'CylinderGeometry')) {
        pescoco.push(+o.rotation.x.toFixed(5));
      }
    });
    return {
      girafa: onde(girafa),
      cabeca: cabeca ? onde(cabeca) : null,
      guarita: guaritaObj ? onde(guaritaObj) : null,
      pescoco,
    };
  });

const inicio = await medir();

// ------------------------------------------- 1. ela fica no posto, e viva
await page.waitForTimeout(7000);
const depois = await medir();
const andou = inicio && depois
  ? Math.hypot(depois.girafa[0] - inicio.girafa[0], depois.girafa[2] - inicio.girafa[2])
  : 99;
const mexeu = inicio && depois
  ? inicio.pescoco.reduce((s, v, i) => s + Math.abs(v - (depois.pescoco[i] ?? v)), 0)
  : 0;

// ---------------------------------------------------- 2. ela apita sozinha
const apitos = () =>
  page.evaluate(() => Object.fromEntries(window.jogo.audio.contagem).apito ?? 0);
/**
 * O APITO SAI A CADA 14-26 SEGUNDOS DE JOGO, e segundo de jogo aqui não é
 * segundo de relógio: o Chromium sem GPU renderiza a uns 10 quadros por
 * segundo, e o `dt` de cada quadro é limitado — o relógio do bicho anda a
 * menos de um terço da velocidade. Por isso o teste ESPERA ACONTECER em vez de
 * cronometrar: pergunta de três em três segundos até TRÊS minutos. Medido nesta
 * máquina, o primeiro apito sai por volta de 60 s de relógio; com o teto em dois
 * minutos o teste já acusou "ela não apitou" só porque a máquina estava lenta.
 */
const apitosAntes = await apitos();
let apitosDepois = apitosAntes;
for (let i = 0; i < 60 && apitosDepois === apitosAntes; i++) {
  await page.waitForTimeout(3000);
  apitosDepois = await apitos();
}

// ------------------------------------------------- 3. falar com o porteiro
await page.evaluate(() => window.jogo.debugPlace(-20.6, 5.4, Math.PI));
await page.waitForTimeout(1200);
const prompt = await page.locator('.prompt .label').textContent().catch(() => '');
await page.screenshot({ path: `${OUT}-balcao.png` });

await page.keyboard.press('KeyE');
await page.waitForTimeout(1000);
const falas = [];
for (let i = 0; i < 24; i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  const quem = await page.locator('.dialogue .who').textContent().catch(() => '');
  if (t) falas.push(`${quem ?? ''}: ${t}`);
  if (i === 2) await page.screenshot({ path: `${OUT}-conversa.png` });
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
}
await page.waitForTimeout(1200);

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'girafa-da-portaria'),
);

// ------------------------------------------------------------------ relatório
console.log('1. posto · girafa em', JSON.stringify(inicio?.girafa),
  '· andou em 7 s:', andou.toFixed(3));
console.log('   guarita em', JSON.stringify(inicio?.guarita),
  '· cabeça em', JSON.stringify(inicio?.cabeca));
console.log('   pescoço mexeu:', mexeu.toFixed(4));
console.log('2. apitos sozinha:', apitosDepois - apitosAntes);
console.log('3. prompt:', JSON.stringify(prompt));
for (const f of falas) console.log('   ', f);
console.log('4. memória no diário:', noDiario);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!inicio?.cabeca) problemas.push('não achei a girafa (ou a cabeça dela) na cena');
else {
  // a guarita tem 2,2 de profundidade: a parede da frente fica em `z + 1,1` e o
  // tampo do balcão em 1,22 de altura
  const frente = inicio.guarita[2] + 1.1;
  if (!(inicio.cabeca[2] > frente)) {
    problemas.push(`a cabeça está DENTRO da guarita (z ${inicio.cabeca[2]} contra a parede em ${frente.toFixed(2)})`);
  }
  if (!(inicio.cabeca[1] > 1.5)) {
    problemas.push(`a cabeça está abaixo do balcão (y ${inicio.cabeca[1]})`);
  }
  const dentro = Math.abs(inicio.girafa[0] - inicio.guarita[0]) < 1.3 &&
    Math.abs(inicio.girafa[2] - inicio.guarita[2]) < 1.1;
  if (!dentro) problemas.push('o corpo da girafa não está dentro da guarita');
}
if (andou > 0.25) problemas.push(`a porteira saiu do posto (andou ${andou.toFixed(2)})`);
if (mexeu < 0.002) problemas.push('a girafa está congelada — o pescoço não mexe');
if (apitosDepois - apitosAntes < 1) problemas.push('ela não apitou sozinha');
if (!/porteiro/i.test(prompt ?? '')) problemas.push('o prompt da portaria não apareceu');
if (!falas.some((f) => /aproveit/i.test(f))) {
  problemas.push('a girafa não mandou a dupla aproveitar o dia');
}
if (!noDiario) problemas.push('a memória da portaria não entrou no diário');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
