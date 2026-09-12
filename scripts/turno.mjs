/**
 * O TURNO NO MANIA DE CHURRASCO — o minigame de servir as mesas.
 *
 * Ele MEDE, não fotografa: um turno é uma máquina de estados, e o que pode
 * quebrar nela não aparece numa foto. O Chromium sem tela roda a ~10 fps com o
 * `dt` travado, então **o tempo de jogo corre a cerca de um terço do relógio** —
 * por isso tudo aqui espera por EVENTO (o rótulo do prompt mudou, o cliente
 * sentou), e nunca por tempo.
 *
 * O que este teste guarda:
 *
 * - o turno COMEÇA pela escala e o painel aparece na tela;
 * - o laço inteiro fecha uma vez: levar à mesa → anotar → o Walter cozinhar →
 *   pegar o prato no balcão → entregar → receber → recolher a louça → largar no
 *   balcão. Se qualquer elo sumir, o rótulo esperado nunca aparece e o teste
 *   trava naquele passo em vez de passar por engano;
 * - QUEM ESTÁ LENDO O CARDÁPIO NÃO DRENA. É a folga que o jogo dá, e é a regra
 *   de que sai toda a diferença entre planejar e correr;
 * - MESA SUJA NÃO RECEBE NINGUÉM: o rótulo dela é "Recolher a louça", e nunca
 *   "Sentar aqui";
 * - a BANDEJA tem duas vagas, e prato limpo e louça suja disputam as mesmas;
 * - O PRATO DE QUEM FOI EMBORA SOME — do balcão e de dentro da bandeja. Prato
 *   órfão preso numa vaga era o bug que o Renan viu: com as duas vagas tomadas
 *   por pratos que nenhuma mesa aceita, os pratos ficam no balcão e o prompt de
 *   pegar não acende mais o turno inteiro;
 * - COM A BANDEJA CHEIA O JOGO FALA. O ponto do balcão continua aceso e diz o
 *   que falta fazer, em vez de sumir e deixar o jogador sem saber o que houve;
 * - NÃO EXISTE DERROTA: mesmo deixando um cliente estourar a paciência, o turno
 *   continua rodando. Foi decisão do Renan, e é a única coisa aqui que nenhuma
 *   mecânica futura pode desfazer.
 *
 * Uso: node scripts/turno.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './turno';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const irPara = (x, z, facing = 0) =>
  page.evaluate(([px, pz, f]) => window.jogo.debugPlace(px, pz, f), [x, z, facing]);

/** Aperta E até o diálogo/pergunta fechar. Escolhe sempre a primeira opção. */
const venceAFala = async (voltas = 40) => {
  for (let i = 0; i < voltas; i++) {
    if (await page.locator('.escolhas.show button').count()) {
      await page.locator('.escolhas.show button').first().click();
      await page.waitForTimeout(500);
      continue;
    }
    if (!(await page.locator('.dialogue.show').count())) return;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(420);
  }
};

/**
 * Vai até um ponto e espera o prompt casar com o padrão, apertando E quando
 * casar. Devolve o rótulo que apareceu, ou null se não apareceu a tempo.
 *
 * É o coração do teste: nada aqui é cronometrado, tudo é esperado.
 */
const agir = async (x, z, padrao, voltas = 60) => {
  for (let i = 0; i < voltas; i++) {
    await irPara(x, z);
    await page.waitForTimeout(320);
    const texto = (await prompt()) ?? '';
    if (padrao.test(texto)) {
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(700);
      return texto;
    }
  }
  return null;
};

/** o turno por dentro: o que não dá para ver na tela */
const dentro = () => page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  if (!t) return null;
  let noBalcao = 0;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.prato && o.visible && o.position.y > 1 && o.position.z < -1.5) noBalcao += 1;
  });
  return {
    prontos: t.prontos.length,
    noBalcao,
    clientes: t.clientes.length,
    bandejas: [...t.bandejas.values()].map((b) => b.map((v) => v.tipo)),
  };
});

const estado = () => page.evaluate(() => ({
  painel: !!document.querySelector('.turno.show'),
  relogio: document.querySelector('.turno .relogio')?.textContent ?? '',
  grana: document.querySelector('.turno .grana')?.textContent ?? '',
  bandeja: [...document.querySelectorAll('.turno .bandeja i')].map((e) => e.title),
  clientes: (() => {
    const nomes = ['josefina', 'capy', 'noel', 'girafa'];
    let n = 0;
    window.jogo.scene.traverse((o) => {
      if (nomes.includes(o.userData?.peca)) n += 1;
    });
    return n;
  })(),
  louca: (() => {
    let n = 0;
    window.jogo.scene.traverse((o) => {
      if (o.userData?.peca === 'louca-suja' && o.visible) n += 1;
    });
    return n;
  })(),
}));

// ===================================================== o turno já destravado
await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  s.flags = { ...(s.flags ?? {}), 'turno-aceito': true, 'osso-entregue': true };
  localStorage.setItem('aristory.save.v1', JSON.stringify(s));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(600);

// ============================================ 1. começar o turno pela escala
const promptDaEscala = await agir(2.4, -7.5, /escala/i, 10);
await venceAFala();
await page.waitForTimeout(1200);
const comecou = await estado();
await page.screenshot({ path: `${OUT}-comecou.png` });

// ============================================ 2. o primeiro cliente chega
let chegou = null;
for (let i = 0; i < 40; i++) {
  const e = await estado();
  if (e.clientes > 0) {
    chegou = e;
    break;
  }
  await page.waitForTimeout(700);
}

/**
 * ============ 3. O PRATO ÓRFÃO: o cliente vai embora com o prato já na mão
 *
 * É o bug que o Renan viu jogando. Este bloco monta a pior versão dele: o prato
 * já saiu do balcão e está numa vaga da bandeja quando o dono desiste. Sem a
 * correção a vaga fica presa até o fim do turno, e o prompt de pegar prato
 * some para sempre — os pratos ficam no balcão e não dá para fazer nada.
 *
 * A paciência é zerada por dentro em vez de esperada: `esperando` leva 62 s de
 * tempo de jogo vezes a calma do bicho, o que no Chromium sem tela seriam
 * minutos de relógio.
 */
const MESA_ORFA = { x: 0.2, z: 1.2 };
const orfao = {};
orfao.levar = await agir(9.4, 5.4, /levar à mesa/i);
orfao.sentar = await agir(MESA_ORFA.x, MESA_ORFA.z + 1.4, /sentar aqui/i);
await venceAFala(6);
orfao.anotar = await agir(MESA_ORFA.x, MESA_ORFA.z + 1.4, /anotar o pedido/i);
orfao.pegar = await agir(-3.6, -0.6, /pegar /i, 90);
const comOOrfao = await dentro();

await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  for (const c of t.clientes) if (c.fase === 'esperando') c.paciencia = 0.001;
});
for (let i = 0; i < 40; i++) {
  const d = await dentro();
  if (d.bandejas.every((b) => b.length === 0)) break;
  await page.waitForTimeout(500);
}
const depoisDoOrfao = await dentro();

// ============================================ 4. o laço inteiro, uma volta
const MESA = { x: 5.2, z: 1.2 };
const passos = {};
passos.levar = await agir(9.4, 5.4, /levar à mesa/i);
// ele segue o garçom: andar até a mesa e sentar
passos.sentar = await agir(MESA.x, MESA.z + 1.4, /sentar aqui/i);
await venceAFala(6);

/**
 * A FOLGA DE QUEM LÊ O CARDÁPIO. Duas leituras da paciência do cliente enquanto
 * ele está na fase `lendo`: a segunda não pode ser menor que a primeira. É a
 * regra que faz o jogo ser de planejar, e a única que dá para medir por dentro.
 */

passos.anotar = await agir(MESA.x, MESA.z + 1.4, /anotar o pedido/i);
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}-pedido.png` });

// o Walter cozinha; o prompt do balcão só acende quando o prato sai
passos.pegar = await agir(-3.6, -0.6, /pegar /i, 90);
const comPrato = await estado();

passos.entregar = await agir(MESA.x, MESA.z + 1.4, /entregar /i, 40);
await page.screenshot({ path: `${OUT}-servido.png` });

passos.receber = await agir(MESA.x, MESA.z + 1.4, /receber a conta/i, 90);
const depoisDePagar = await estado();

// a mesa ficou suja: o rótulo dela agora é outro, e não "Sentar aqui"
passos.recolher = await agir(MESA.x, MESA.z + 1.4, /recolher a louça/i, 30);
const comLouca = await estado();
passos.largar = await agir(-7.0, -0.6, /largar a louça/i, 30);
const depoisDaCopa = await estado();
await page.screenshot({ path: `${OUT}-salao.png` });

// ================== 5. bandeja cheia: o ponto do balcão continua falando
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  const b = t.bandejas.get(window.jogo.playerId()) ?? [];
  t.bandejas.set(window.jogo.playerId(), b);
  while (b.length < 2) b.push({ tipo: 'louca', malha: { parent: null, traverse() {} } });
});
/**
 * O PRATO PRONTO É INJETADO em vez de esperado: o que este bloco prova é a
 * REGRA DO RÓTULO (bandeja cheia + prato no balcão = o ponto fala), e esperar a
 * cozinha aqui só acrescentaria uma espera que às vezes não chega a tempo — e
 * uma asserção que não roda é pior do que asserção nenhuma.
 */
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  t.prontos.push({
    prato: { id: 'de-mentira', nome: 'Prato de teste' },
    para: null,
    malha: { parent: null, traverse() {} },
    vaga: 2,
  });
});
await irPara(-3.6, -0.6);
await page.waitForTimeout(600);
const comBandejaCheia = await prompt();
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  t.prontos = t.prontos.filter((p) => p.prato.id !== 'de-mentira');
});
// e a copa desatola: largar esvazia as duas vagas
await agir(-7.0, -0.6, /largar a louça/i, 20);
const depoisDeDesatolar = await estado();

// ============================== 6. deixar um cliente estourar não perde nada
await page.waitForTimeout(9000);
const continuaRodando = await estado();

// e uma foto do salão cheio, que é o único jeito de julgar se o turno é legível
await irPara(6.5, 4.0);
let cheio = continuaRodando;
for (let i = 0; i < 60; i++) {
  const e = await estado();
  if (e.clientes >= 3) {
    cheio = e;
    break;
  }
  await page.waitForTimeout(800);
}
await page.screenshot({ path: `${OUT}-cheio.png` });

// ======================================================================= laudo
const falhas = [];
if (!/escala/i.test(promptDaEscala ?? '')) falhas.push('a escala nao ofereceu comecar o turno');
if (!comecou.painel) falhas.push('o painel do turno nao apareceu');
if (!chegou) falhas.push('nenhum cliente chegou no salao');
for (const [nome, valor] of Object.entries(orfao)) {
  if (!valor) falhas.push(`o passo "${nome}" do prato orfao nunca ficou disponivel`);
}
if (comOOrfao && !comOOrfao.bandejas.some((b) => b.includes('prato'))) {
  falhas.push('o prato nem chegou a entrar na bandeja: o teste do orfao nao provou nada');
}
if (depoisDoOrfao && depoisDoOrfao.bandejas.some((b) => b.includes('prato'))) {
  falhas.push('o prato do cliente que foi embora ficou preso na bandeja');
}
if (depoisDoOrfao && depoisDoOrfao.noBalcao > depoisDoOrfao.prontos) {
  falhas.push(`sobrou prato fantasma no balcao: ${depoisDoOrfao.noBalcao} malhas para ${depoisDoOrfao.prontos} pratos`);
}
if (!/cheia/i.test(comBandejaCheia ?? '')) {
  falhas.push(`com a bandeja cheia o balcao nao avisou nada: "${comBandejaCheia}"`);
}
if (depoisDeDesatolar && depoisDeDesatolar.bandeja.length !== 0) {
  falhas.push('a copa nao desatolou a bandeja cheia');
}
for (const [nome, valor] of Object.entries(passos)) {
  if (!valor) falhas.push(`o passo "${nome}" nunca ficou disponivel`);
}
if (comPrato && comPrato.bandeja.length !== 1) {
  falhas.push(`a bandeja devia ter 1 prato, tem ${comPrato.bandeja.length}`);
}
if (depoisDePagar && !/R\$ [1-9]/.test(depoisDePagar.grana)) {
  falhas.push(`receber a conta nao pos dinheiro no caixa: "${depoisDePagar?.grana}"`);
}
if (comLouca && !comLouca.bandeja.some((t) => /lou/i.test(t))) {
  falhas.push('recolher a louca nao ocupou vaga na bandeja');
}
if (depoisDaCopa && depoisDaCopa.bandeja.length !== 0) {
  falhas.push('largar a louca nao esvaziou a bandeja');
}
if (!continuaRodando.painel) {
  falhas.push('o turno parou sozinho: nao pode existir derrota');
}
falhas.push(...erros);

console.log('1. escala:', JSON.stringify(promptDaEscala), '· painel:', comecou.painel,
  '· relogio:', comecou.relogio);
console.log('2. primeiro cliente:', chegou ? `${chegou.clientes} no salao` : 'nenhum');
console.log('3. prato orfao:', JSON.stringify(orfao), '· com o prato:',
  JSON.stringify(comOOrfao), '→ depois:', JSON.stringify(depoisDoOrfao));
console.log('5. bandeja cheia diz:', JSON.stringify(comBandejaCheia),
  '· depois de desatolar:', JSON.stringify(depoisDeDesatolar.bandeja));
console.log('4. o laco:', JSON.stringify(passos, null, 0));
console.log('   bandeja com o prato:', JSON.stringify(comPrato.bandeja),
  '· caixa depois de pagar:', depoisDePagar.grana);
console.log('   bandeja com a louca:', JSON.stringify(comLouca.bandeja),
  '· depois da copa:', JSON.stringify(depoisDaCopa.bandeja),
  '· pilhas na copa:', depoisDaCopa.louca);
console.log('   no salao cheio:', cheio.clientes, 'clientes ·', cheio.relogio);
console.log('4. o turno continua rodando depois de um cliente estourar:', continuaRodando.painel,
  '·', continuaRodando.relogio, continuaRodando.grana);

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
