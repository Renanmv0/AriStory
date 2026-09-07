/**
 * A PRAÇA DE GELO do quiosque do Mano, no Villa-Lobos.
 *
 * Duas coisas para conferir aqui, e as duas precisam de olho na foto:
 *
 *  1. A ARENA ESTÁ LIVRE. O quiosque foi para a ponta de -Z e as quatro
 *     mesinhas ficam nos quadrantes da frente. Se alguma peça voltar para o
 *     meio, a praça deixa de ser praça.
 *  2. O GUARDA-SOL NÃO TAPA A MESA. Ele é baixo (2,05 no topo) exatamente por
 *     isso: a câmera olha em 34°, e lona alta come o tampo e a cadeira de quem
 *     está atrás dela.
 *
 * O que dá para medir sem olho, o teste mede: as peças que têm que estar na
 * cena, e o console limpo.
 *
 * Uso: node scripts/gelo.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './gelo';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const poses = [
  // a praça inteira, no enquadramento com que o jogo nasce
  ['toda', 'em=13.8,20.4&olhar=3.14'],
  // de quem entra pelo vão da borda, vindo do portão do parque
  ['entrada', 'em=13.8,26&olhar=3.14'],
  // de perto: a mesinha, o boneco de neve e o cristal
  ['mesas', 'em=16.6,23.8&olhar=3.14&zoom=7'],
];
for (const [nome, query] of poses) {
  await page.goto(`${BASE}/?cena=villa-lobos&${query}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
  // uma volta de câmera: o lado de trás das peças só aparece girando
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-${nome}-giro.png` });
}

/** quantas cópias de cada peça a cena montou */
const contagem = await page.evaluate(() => {
  const conta = {};
  window.jogo.scene.traverse((o) => {
    const p = o.userData?.peca;
    if (p) conta[p] = (conta[p] ?? 0) + 1;
  });
  return conta;
});

const ESPERADO = {
  quiosque: 1,
  'mesa-de-sorveteria': 4,
  // duas por mesinha
  'cadeirinha-de-sorveteria': 8,
  'poste-de-gelo': 3,
  'boneco-de-neve': 1,
  'cristal-de-gelo': 4,
  // duas laterais, o fundo, os dois pedaços da frente (o vão fica no meio) e as quatro quinas
  'borda-de-gelo': 9,
};
for (const [peca, quantas] of Object.entries(ESPERADO)) {
  if ((contagem[peca] ?? 0) !== quantas) {
    erros.push(`${peca}: esperava ${quantas}, achei ${contagem[peca] ?? 0}`);
  }
}

console.log('peças:', Object.entries(ESPERADO).map(([p]) => `${p}=${contagem[p] ?? 0}`).join(' · '));

/* ==================================================================== *
 *                    2. A MESINHA: sentar, pedir e comer
 *
 * O que este pedaço prova, e nenhuma foto provaria sozinha:
 *  - o prompt da mesinha existe e senta os dois (os dois ficam `riding`);
 *  - o Mano SAI DO POSTO e vai até a mesa (a distância dele ao posto passa
 *    de 2 em algum momento);
 *  - ele volta com a BANDEJA visível — é a viagem de ida e volta ao quiosque;
 *  - as duas casquinhas terminam UMA EM CADA MÃO, e a memória entra;
 *  - e ele VOLTA para o posto no fim. Largar o bicho na mesa seria pior do
 *    que não ter serviço de mesa nenhum: a coleira dele é menor que o passo
 *    do cérebro, então ele ficaria plantado ali para sempre.
 * ==================================================================== */

/** tem que bater com o `MANO` da cena */
const POSTO = { x: 14.7, z: 17.8 };
/** a mesinha da frente, à direita — a que fica mais perto da entrada */
const MESA = { x: 16.6, z: 23.8 };

const oMano = () => page.evaluate(() => {
  let m = null;
  window.jogo.scene.traverse((o) => {
    if (!m && o.userData?.peca === 'mano') m = o;
  });
  if (!m) return null;
  const bandeja = m.getObjectByName('bandeja-do-mano');
  return { x: m.position.x, z: m.position.z, bandeja: !!bandeja?.visible };
});

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2400);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
// o áudio só acorda no primeiro clique, e sem isso a cena roda muda
await page.mouse.click(600, 400);
await page.waitForTimeout(500);

await page.evaluate(
  ([x, z]) => window.jogo.debugPlace(x, z, Math.PI),
  [MESA.x, MESA.z + 1.7],
);
await page.waitForTimeout(1000);
const promptDaMesa = await page.locator('.prompt.show .label').textContent().catch(() => null);

await page.keyboard.press('KeyE');
await page.waitForTimeout(1600);
const sentaram = await page.evaluate(() => window.jogo.player.riding && window.jogo.parceiro.riding);
await page.screenshot({ path: `${OUT}-sentados.png` });

/**
 * A cutscene inteira, tecla a tecla, AMOSTRANDO O MANO a cada volta.
 *
 * A escolha do pedido é o segundo botão ("O que o Mano escolher"): é o caminho
 * que exercita os dois sabores novos, chocolate e limão. A seta anda uma vez para a direita
 * e o E confirma.
 */
let longeDoPosto = 0;
let viuBandeja = false;
let escolheu = false;
let fotografou = false;
let comendo = false;
/**
 * SÃO MUITAS VOLTAS de propósito. A cutscene tem quatro viagens do Mano (ele
 * vem, volta ao quiosque, vem de novo, volta ao posto) e no Chromium por
 * software o tempo de jogo corre a um terço do relógio: em menos que isto a
 * foto pega o pinguim no meio do caminho e a entrega nunca acontece.
 */
for (let i = 0; i < 200; i++) {
  const m = await oMano();
  if (m) {
    longeDoPosto = Math.max(longeDoPosto, Math.hypot(m.x - POSTO.x, m.z - POSTO.z));
    if (m.bandeja) viuBandeja = true;
    if (m.bandeja && !fotografou) {
      fotografou = true;
      await page.screenshot({ path: `${OUT}-bandeja.png` });
    }
  }
  // a foto do momento em que os dois estão comendo: sentados E com casquinha
  if (!comendo && (await page.evaluate(() => window.jogo.player.riding && !!window.jogo.getActiveHandItem('ari')))) {
    comendo = true;
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-comendo.png` });
  }
  if (!escolheu && (await page.locator('.escolhas.show button').count()) > 0) {
    escolheu = true;
    await page.screenshot({ path: `${OUT}-pedido.png` });
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(250);
  }
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
  if (i > 40 && !(await page.evaluate(() => window.jogo.player.locked))) break;
}
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-em-pe.png` });

const fim = await page.evaluate(() => ({
  maoDoAri: window.jogo.getActiveHandItem('ari')?.id ?? null,
  maoDoRenan: window.jogo.getActiveHandItem('renan')?.id ?? null,
  memorias: (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).map((m) => m.id),
}));
/**
 * A VOLTA DELE AO POSTO é assíncrona de propósito — a cena não espera o Mano
 * para deixar os dois comerem —, então o teste espera aqui. São 6 unidades a
 * 1,45 por segundo de jogo, e o relógio de jogo corre a um terço do de parede
 * neste renderizador: daí os 30 s de paciência.
 */
let distanciaDoPosto = 99;
for (let i = 0; i < 30; i++) {
  const m = await oMano();
  distanciaDoPosto = m ? Math.hypot(m.x - POSTO.x, m.z - POSTO.z) : 99;
  if (distanciaDoPosto < 0.5) break;
  await page.waitForTimeout(1000);
}

if (promptDaMesa !== 'Sentar na mesinha') erros.push(`prompt da mesinha: "${promptDaMesa}"`);
if (!sentaram) erros.push('os dois não sentaram na mesinha');
if (!escolheu) erros.push('a escolha do pedido não apareceu');
if (longeDoPosto < 2) erros.push(`o Mano não saiu do posto (máximo ${longeDoPosto.toFixed(2)})`);
if (!viuBandeja) erros.push('a bandeja nunca apareceu — ele não foi buscar');
if (!fim.maoDoAri?.startsWith('sorvete')) erros.push(`mão do Ari: ${fim.maoDoAri}`);
if (!fim.maoDoRenan?.startsWith('sorvete')) erros.push(`mão do Renan: ${fim.maoDoRenan}`);
if (!comendo) erros.push('a foto de comer sentado não saiu — ninguém comeu na mesa');
if (!fim.memorias.includes('mesinha-do-gelo')) erros.push('a memória do serviço de mesa não entrou');
if (distanciaDoPosto > 0.6) erros.push(`o Mano não voltou pro posto (ficou a ${distanciaDoPosto.toFixed(2)})`);

console.log('mesinha:', promptDaMesa, '· sentaram:', sentaram, '· pedido escolhido:', escolheu);
console.log('  o Mano foi até', longeDoPosto.toFixed(2), 'do posto · bandeja:', viuBandeja,
  '· voltou a', distanciaDoPosto.toFixed(2));
console.log('  nas mãos:', fim.maoDoAri, '+', fim.maoDoRenan, '· memórias:', fim.memorias.join(', '));

/* ==================================================================== *
 *                        3. O GELO ESCORREGA
 *
 * A medida é o DESLIZE DEPOIS DE SOLTAR A TECLA: empurra por um tempo fixo,
 * solta, e mede o quanto a dupla ainda anda sozinha. No gelo tem que ser
 * vários múltiplos do que anda na grama — na grama o atrito para a pessoa em
 * um quarto de segundo.
 * ==================================================================== */

const onde = () => page.evaluate(() => {
  const p = window.jogo.playerPosition();
  return [p.x, p.z, window.jogo.player.derrapagem];
});

/**
 * Empurra por um tempo fixo, solta, e mede o quanto a dupla ainda anda sozinha.
 *
 * O EMPURRÃO É LONGO (3 s de relógio, cerca de 1 s de jogo) porque no gelo a
 * aceleração é 28% da de terra firme: com um toque curto os dois mal saem do
 * lugar e a medida compararia velocidades diferentes em vez de atritos.
 *
 * A TECLA É `S`, que na câmera padrão empurra na diagonal `+X/+Z`. Os dois
 * pontos de partida foram escolhidos com pista livre nessa direção: no gelo,
 * do canto de trás até o meio do rinque, entre as quatro mesinhas; na grama, o
 * meio do campinho de frisbee, que é a maior área vazia do parque.
 */
const medirDeslize = async (x, z) => {
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, Math.PI), [x, z]);
  await page.waitForTimeout(2200);
  await page.keyboard.down('KeyS');
  await page.waitForTimeout(3000);
  /**
   * O PRIMEIRO PONTO É LIDO DEPOIS DE SOLTAR, e não antes: entre a leitura e o
   * `keyboard.up` passa uma ida e volta de `page.evaluate`, e nessa fresta a
   * dupla ainda está sendo empurrada. Medindo antes, o empurrão entrava na
   * conta do deslize e os dois pisos davam o mesmo número.
   *
   * E A JANELA É LARGA (4 s de relógio). Na grama o atrito para a dupla em um
   * quarto de segundo de jogo; no gelo ela ainda está andando três segundos
   * depois. É essa diferença que o teste mede.
   */
  await page.keyboard.up('KeyS');
  const [ax, az, derrapagem] = await onde();
  await page.waitForTimeout(4000);
  const [bx, bz] = await onde();
  return { deslize: Math.hypot(bx - ax, bz - az), derrapagem };
};

const noGelo = await medirDeslize(10.5, 17.5);
const naGrama = await medirDeslize(18, -4.5);
await page.screenshot({ path: `${OUT}-deslize.png` });

if (noGelo.derrapagem < 0.9) erros.push(`no gelo a derrapagem ficou em ${noGelo.derrapagem.toFixed(2)}`);
if (naGrama.derrapagem > 0.1) erros.push(`na grama a derrapagem ficou em ${naGrama.derrapagem.toFixed(2)}`);
if (noGelo.deslize < naGrama.deslize * 2.5) {
  erros.push(`o gelo não escorrega: ${noGelo.deslize.toFixed(2)} contra ${naGrama.deslize.toFixed(2)} na grama`);
}
console.log('deslize depois de soltar a tecla — gelo:', noGelo.deslize.toFixed(2),
  '· grama:', naGrama.deslize.toFixed(2));

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'praça montada, mesa servida, gelo escorregando');
await browser.close();
process.exit(erros.length ? 1 : 0);
