/**
 * A salva-vidas da piscina do clube: a capivara na cadeira alta.
 *
 * Ela é a segunda funcionária do clube, e este teste guarda o que a foto sozinha
 * não pega:
 *
 * - ela FICA NO POSTO. Mesmo cérebro do Pelusa, que passeia; o que a segura é a
 *   área minúscula que a cena passa. Alargue essa área e a capivara sai andando
 *   pelo deque — a mesma coleira da Gina;
 * - ela está EM CIMA DA CADEIRA, e não ao lado nem flutuando. Mede o `y` dela
 *   contra o estrado, que fica em 1,7;
 * - ela está VIVA: a cabeça varre a piscina, então a pose muda entre duas
 *   leituras;
 * - ela apita sozinha;
 * - A CADEIRA NÃO TEM TETO SOBRE ELA. Este é o ponto que já falhou: a primeira
 *   versão tinha toldo, e a 34° de câmera a cobertura apagava a capivara
 *   inteira — sobrava um telhado vermelho com ninguém embaixo. O teste procura
 *   qualquer peça da cadeira acima E à frente dela;
 * - conversar funciona, a memória entra no diário, e ela TIRA O ÓCULOS no
 *   carinho (é o único jeito de os olhos dela aparecerem).
 *
 * Uso: node scripts/salvavidas.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './salvavidas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o `GUARDA` da cena */
const CADEIRA = { x: 4.6, z: -9.8, estrado: 1.7 };

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

const medir = () =>
  page.evaluate(() => {
    let cap = null;
    window.jogo.scene.traverse((o) => {
      if (!cap && o.userData?.peca === 'capivara-salva-vidas') cap = o;
    });
    let cadeira = null;
    window.jogo.scene.traverse((o) => {
      if (!cadeira && o.userData?.peca === 'cadeira-de-salva-vidas') cadeira = o;
    });
    if (!cap) return null;
    cap.updateWorldMatrix(true, false);
    const e = cap.matrixWorld.elements;
    // a pose viva: a cabeça varrendo, e o óculos. As duas peças são achadas
    // pelo NOME, e não por adivinhação de forma — o mesmo que a Gina faz.
    const cabeca = cap.getObjectByName('cabeca-da-capivara');
    const oculos = cap.getObjectByName('oculos-da-capivara');
    return {
      onde: [+e[12].toFixed(3), +e[13].toFixed(3), +e[14].toFixed(3)],
      cadeira: cadeira ? [+cadeira.position.x.toFixed(2), +cadeira.position.z.toFixed(2)] : null,
      varredura: cabeca ? +cabeca.rotation.y.toFixed(5) : null,
      comOculos: oculos ? oculos.visible : null,
    };
  });

const inicio = await medir();

// ------------------------------------------- 1. ela fica no posto, e viva
await page.waitForTimeout(7000);
const depois = await medir();
const andou = inicio && depois
  ? Math.hypot(depois.onde[0] - inicio.onde[0], depois.onde[2] - inicio.onde[2])
  : 99;
const varreu = inicio && depois ? Math.abs((depois.varredura ?? 0) - (inicio.varredura ?? 0)) : 0;

/**
 * ============================ 2. a cadeira não pode ter teto sobre quem senta
 *
 * A REGRA QUE ISTO GUARDA, e ela vale para qualquer posto do jogo: numa câmera
 * de 34°, tudo que fica ACIMA e À FRENTE de quem senta apaga quem senta. A
 * primeira versão desta cadeira tinha um toldo bonito, e na foto de longe
 * sobrava um telhado vermelho com ninguém embaixo — exatamente o que o beiral
 * da guarita já tinha feito com a Gina.
 *
 * "À frente" é `+X/+Z`, que é de onde a câmera olha. O encosto da cadeira também
 * passa da cabeça dela em altura, e ESSE pode: ele fica em `-Z`, atrás dela, e
 * serve de fundo em vez de tampa.
 *
 * Não dá para medir isso comparando fotos. Foi a primeira tentativa: sumir com
 * ela e ver se a tela muda. O cenário é vivo — a dupla respira, a água mexe, as
 * nuvens andam —, então duas fotos seguidas do MESMO quadro já saem diferentes,
 * e o controle do teste acusou isso na hora.
 */
await page.evaluate(([x, z]) => {
  window.jogo.focusCamera(null);
  window.jogo.debugPlace(x + 1.8, z + 1.2, 0);
  window.jogo.setZoom(9);
}, [CADEIRA.x, CADEIRA.z]);
await page.waitForTimeout(2600);
await page.screenshot({ path: `${OUT}-posto.png` });

const teto = await page.evaluate(() => {
  let cap = null;
  let cadeira = null;
  window.jogo.scene.traverse((o) => {
    if (!cap && o.userData?.peca === 'capivara-salva-vidas') cap = o;
    if (!cadeira && o.userData?.peca === 'cadeira-de-salva-vidas') cadeira = o;
  });
  if (!cap || !cadeira) return null;

  // o alto da capivara, em mundo
  cap.updateWorldMatrix(true, true);
  let topo = -Infinity;
  cap.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.computeBoundingBox();
    const c = o.geometry.boundingBox.max.clone();
    o.updateWorldMatrix(true, false);
    c.applyMatrix4(o.matrixWorld);
    topo = Math.max(topo, c.y);
  });

  cadeira.updateWorldMatrix(true, true);
  const cx = cadeira.position.x;
  const cz = cadeira.position.z;
  const tampas = [];
  for (const o of cadeira.children) {
    if (!o.isMesh) continue;
    o.geometry.computeBoundingBox();
    const min = o.geometry.boundingBox.min.clone();
    o.updateWorldMatrix(true, false);
    min.applyMatrix4(o.matrixWorld);
    // acima da cabeça dela E do lado da câmera (`+X/+Z`) do eixo da cadeira
    if (min.y > topo - 0.05 && (o.position.x > -0.2 || o.position.z > -0.2)) {
      tampas.push({ y: +min.y.toFixed(2), x: +(cx + o.position.x).toFixed(2), z: +(cz + o.position.z).toFixed(2) });
    }
  }
  return { topoDaCapivara: +topo.toFixed(2), tampas };
});

// ------------------------------------------------- 3. falar com ela
await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 1.4, z + 0.9, 0), [CADEIRA.x, CADEIRA.z]);
await page.waitForTimeout(1400);
const prompt = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
/**
 * O ÓCULOS É MEDIDO AGORA, no começo da conversa, e não no fim.
 *
 * O contentamento decai sozinho a 0,42 por segundo e o óculos volta quando ele
 * cai abaixo de 0,25 — ou seja, menos de dois segundos de jogo depois. A
 * conversa inteira dura mais que isso, então medir no fim media o óculos JÁ DE
 * VOLTA, e o teste acusava um defeito que não existia.
 */
const oculosNoCarinho = await medir();

const falas = [];
for (let i = 0; i < 24; i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 8) falas.push(t);
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
}
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-conversa.png` });

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'salva-vidas-do-clube'),
);

// ------------------------------------------------- 4. o apito espontâneo
/**
 * Mesmo problema de relógio da Gina: o Chromium sem GPU roda o jogo a menos de
 * um terço do relógio de parede, então o teste ESPERA ACONTECER em vez de
 * cronometrar. O apito dela sai a cada 16-30 s de jogo.
 */
const apitos = () =>
  page.evaluate(() => Object.fromEntries(window.jogo.audio.contagem).apito ?? 0);
const antesDoApito = await apitos();
let depoisDoApito = antesDoApito;
for (let i = 0; i < 70 && depoisDoApito === antesDoApito; i++) {
  await page.waitForTimeout(3000);
  depoisDoApito = await apitos();
}

// ------------------------------------------------------------------ relatório
console.log('1. posto · capivara em', JSON.stringify(inicio?.onde),
  '· cadeira em', JSON.stringify(inicio?.cadeira), '· andou em 7 s:', andou.toFixed(3));
console.log('   varredura da cabeça mexeu:', varreu.toFixed(4));
console.log('2. topo da capivara:', teto?.topoDaCapivara,
  '· peças da cadeira acima e à frente dela:', JSON.stringify(teto?.tampas));
console.log('3. prompt:', JSON.stringify(prompt));
for (const f of falas) console.log('   ', f);
console.log('   óculos · no posto:', inicio?.comOculos, '· no carinho:', oculosNoCarinho?.comOculos);
console.log('   memória no diário:', noDiario);
console.log('4. apitos sozinha:', depoisDoApito - antesDoApito);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!inicio) problemas.push('a salva-vidas não está na cena');
else {
  // o estrado está em 1,7 e o corpo dela em ~0,27 acima da própria base
  if (Math.abs(inicio.onde[1] - CADEIRA.estrado) > 0.25) {
    problemas.push(`ela não está no estrado da cadeira (y ${inicio.onde[1]}, estrado ${CADEIRA.estrado})`);
  }
  const emCima = Math.hypot(inicio.onde[0] - CADEIRA.x, inicio.onde[2] - CADEIRA.z);
  if (emCima > 0.4) problemas.push(`ela não está em cima da cadeira (${emCima.toFixed(2)} de distância)`);
  if (!inicio.cadeira) problemas.push('a cadeira de salva-vidas não está na cena');
}
if (andou > 0.25) problemas.push(`a salva-vidas saiu do posto (andou ${andou.toFixed(2)})`);
if (varreu < 0.01) problemas.push('ela está congelada — a cabeça não varre a piscina');
if (!teto) problemas.push('não achei a capivara e a cadeira juntas para medir a cobertura');
else if (teto.tampas.length) {
  problemas.push(`a cadeira tem teto sobre a salva-vidas: ${JSON.stringify(teto.tampas[0])} — a 34° isso a apaga`);
}
if (!/salva-vidas/i.test(prompt ?? '')) problemas.push('o prompt da salva-vidas não apareceu');
if (falas.length < 4) problemas.push('a conversa de apresentação não aconteceu');
if (!falas.some((f) => /capivara/i.test(f))) problemas.push('a conversa não diz que ela é uma capivara');
if (inicio?.comOculos !== true) problemas.push('ela não está de óculos escuros no posto');
if (oculosNoCarinho?.comOculos !== false) problemas.push('ela não tirou o óculos no carinho');
if (!noDiario) problemas.push('a memória da salva-vidas não entrou no diário');
if (depoisDoApito - antesDoApito < 1) problemas.push('ela não apitou sozinha');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
