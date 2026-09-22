/**
 * A quest do adubo, de ponta a ponta — o que destranca a estufa da Josefina.
 *
 * A corrente inteira, e cada elo é uma asserção aqui:
 *
 *   saco de sementes esquecido num banco do fundo do parque
 *     → dar ao Noel (que é peru, e come semente)
 *     → ele retribui com um saco de adubo
 *     → dar o adubo à Josefina (que cuida de planta)
 *     → ela destranca a estufa
 *
 * O que este teste guarda, e por que cada coisa importa:
 *
 * - A ESTUFA NASCE TRANCADA. Clicar na porta antes da quest não leva a lugar
 *   nenhum: o prompt é "Abrir a porta da estufa" e a resposta é "Trancada".
 *   Um dia alguém vai mexer no `w.door` e reabrir isso sem perceber;
 * - A JOSEFINA NÃO CITA A ESTUFA ANTES DA HORA. Foi pedido explícito do Renan,
 *   e é a diferença entre descobrir e ser avisado. O teste lê tudo o que ela
 *   fala antes do adubo e exige que a palavra não apareça;
 * - OS RÓTULOS TROCAM SOZINHOS. Quem chega com o saco lê "Dar as sementes pro
 *   Noel"; quem não está com ele lê "Falar com o Noel". São duas interações no
 *   mesmo ponto, e só uma ligada por vez;
 * - NINGUÉM FICA MUDO DEPOIS DE RECEBER. O `onUpdate` para de arbitrar os dois
 *   prompts assim que a flag sobe, e já houve bug de os dois ficarem
 *   desligados — o bicho perdia o prompt até a cena ser remontada;
 * - O ADUBO ENTRA NA MOCHILA NA VAGA QUE AS SEMENTES DEIXARAM. A ordem é tirar
 *   e só então pôr, senão quem chega de mochila cheia perde o saco e não ganha
 *   nada.
 *
 * Uso: node scripts/adubo.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './adubo';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o `BANCO_ESQUECIDO` do Villa-Lobos */
const BANCO = { x: -13.2, z: -22.5, giro: 1.1 };
const SEMENTES = {
  x: BANCO.x + Math.cos(BANCO.giro) * 0.45,
  z: BANCO.z - Math.sin(BANCO.giro) * 0.45,
};
/** e com o `ESTUFA` do clube */
const PORTA_DA_ESTUFA = { x: 25.6, z: -20.9 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = async () =>
  (await page.locator('.prompt.show').count())
    ? await page.locator('.prompt .label').textContent()
    : '';

/** Aperta E e devolve tudo o que foi dito até o balão fechar. */
const venceAFala = async (limite = 30) => {
  const ditas = [];
  for (let i = 0; i < limite; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 2 && ditas[ditas.length - 1] !== t) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(620);
  }
  return ditas;
};

/**
 * Quais dos itens da quest estão com QUALQUER um dos dois.
 *
 * `hasItem` sem dono olha só a mochila de quem está sendo controlado, e o `T`
 * troca isso a qualquer momento — o saco pode muito bem estar com o parceiro.
 * É a mesma leitura que o `osso.mjs` já faz.
 */
const mochila = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const tem = (id) => j.hasItem(id) || j.hasItem(id, j.companionId());
    return ['sementes', 'adubo'].filter(tem);
  });

const irPara = async (cena, entrada) => {
  await page.evaluate(([c, e]) => window.jogo.goTo(c, e), [cena, entrada ?? undefined]);
  await page.waitForTimeout(3200);
};

/** Onde o bicho está agora — ele passeia, então a posição é lida a cada volta. */
const acharBicho = (peca) =>
  page.evaluate((nome) => {
    let achado = null;
    window.jogo.scene.traverse((o) => {
      if (!achado && o.userData?.peca === nome) achado = o;
    });
    if (!achado) return null;
    achado.updateWorldMatrix(true, false);
    const e = achado.matrixWorld.elements;
    return [+e[12].toFixed(2), +e[14].toFixed(2)];
  }, peca);

/**
 * Encosta num bicho que anda e devolve o rótulo do prompt.
 *
 * Ele se move entre a leitura da posição e o `debugPlace`, então o teste tenta
 * algumas vezes e dá a volta por ângulos diferentes — é o mesmo cuidado que o
 * teste do Jean-Luc já paga.
 */
const encostarNo = async (peca) => {
  for (let tentativa = 0; tentativa < 6; tentativa++) {
    const onde = await acharBicho(peca);
    if (!onde) return '';
    const a = (tentativa * Math.PI) / 3;
    await page.evaluate(
      ([x, z, f]) => window.jogo.debugPlace(x, z, f),
      [onde[0] + Math.sin(a) * 0.9, onde[1] + Math.cos(a) * 0.9, a + Math.PI],
    );
    await page.waitForTimeout(1100);
    const r = await prompt();
    if (r) return r;
  }
  return '';
};

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(500, 440);
await page.waitForTimeout(400);

// ============================================ 1. o saco no banco do fundo
await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z + 1.1, Math.PI), [SEMENTES.x, SEMENTES.z]);
await page.waitForTimeout(1300);
const promptDasSementes = await prompt();
await page.screenshot({ path: `${OUT}-banco.png` });
await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const falasDoBanco = await venceAFala();
const mochilaComSementes = await mochila();

// o saco tem que SUMIR do banco depois de pego, senão vira fonte infinita
const sacoAindaNoBanco = await page.evaluate(() => {
  let visivel = false;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'saco-de-graos' && o.visible) visivel = true;
  });
  return visivel;
});

// ====================================== 2. a estufa, antes de qualquer coisa
await irPara('clube', 'portaria');
await page.evaluate(
  ([x, z]) => window.jogo.debugPlace(x, z + 1.0, Math.PI),
  [PORTA_DA_ESTUFA.x, PORTA_DA_ESTUFA.z],
);
await page.waitForTimeout(1300);
const promptDaPortaTrancada = await prompt();
await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const falasDaPorta = await venceAFala();
await page.waitForTimeout(600);
const cenaDepoisDeTentar = await page.evaluate(() => window.jogo.current.def.id);
await page.screenshot({ path: `${OUT}-trancada.png` });

// =========================== 3. a Josefina não pode citar a estufa ainda
const ditoPelaJosefina = [];
for (let volta = 0; volta < 4; volta++) {
  const rotulo = await encostarNo('josefina');
  if (!/josefina/i.test(rotulo ?? '')) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(900);
  for (const f of await venceAFala()) ditoPelaJosefina.push(f);
  await page.waitForTimeout(400);
}

// ======================================== 4. dar as sementes pro Noel
const promptDoNoel = await encostarNo('noel');
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const falasDoNoel = await venceAFala(40);
const mochilaComAdubo = await mochila();
await page.screenshot({ path: `${OUT}-noel.png` });

// e ele não pode ter ficado mudo depois de receber o presente
const promptDoNoelDepois = await encostarNo('noel');

// ======================================== 5. dar o adubo pra Josefina
const promptDoAdubo = await encostarNo('josefina');
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const falasDaJosefina = await venceAFala(48);
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-josefina.png` });
const mochilaNoFim = await mochila();
const destrancou = await page.evaluate(() => window.jogo.flag('adubo-entregue'));
const promptDaJosefinaDepois = await encostarNo('josefina');

// ======================================== 6. agora a estufa abre
await page.evaluate(
  ([x, z]) => window.jogo.debugPlace(x, z + 1.0, Math.PI),
  [PORTA_DA_ESTUFA.x, PORTA_DA_ESTUFA.z],
);
await page.waitForTimeout(1300);
const promptDaPortaAberta = await prompt();
await page.keyboard.press('KeyE');
await page.waitForTimeout(3200);
const cenaFinal = await page.evaluate(() => window.jogo.current.def.id);
await page.screenshot({ path: `${OUT}-aberta.png` });

// ------------------------------------------------------------------ relatório
const juntas = (a) => a.join(' | ');
console.log('1. prompt no banco:', JSON.stringify(promptDasSementes));
for (const f of falasDoBanco) console.log('   ', f);
console.log('   mochila:', JSON.stringify(mochilaComSementes),
  '· saco ainda no banco:', sacoAindaNoBanco);
console.log('2. prompt da porta:', JSON.stringify(promptDaPortaTrancada),
  '· cena depois de tentar:', cenaDepoisDeTentar);
for (const f of falasDaPorta) console.log('   ', f);
console.log('3. a Josefina disse, antes do adubo:');
for (const f of ditoPelaJosefina) console.log('   ', f);
console.log('4. prompt do Noel:', JSON.stringify(promptDoNoel));
for (const f of falasDoNoel) console.log('   ', f);
console.log('   mochila:', JSON.stringify(mochilaComAdubo),
  '· prompt dele depois:', JSON.stringify(promptDoNoelDepois));
console.log('5. prompt da Josefina:', JSON.stringify(promptDoAdubo));
for (const f of falasDaJosefina) console.log('   ', f);
console.log('   mochila:', JSON.stringify(mochilaNoFim), '· destrancou:', destrancou,
  '· prompt dela depois:', JSON.stringify(promptDaJosefinaDepois));
console.log('6. prompt da porta:', JSON.stringify(promptDaPortaAberta), '· cena:', cenaFinal);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');

// 1 — as sementes
if (!/semente/i.test(promptDasSementes ?? '')) {
  problemas.push('o saco de sementes não acende no banco do fundo');
}
if (!mochilaComSementes.includes('sementes')) problemas.push('as sementes não entraram na mochila');
if (sacoAindaNoBanco) problemas.push('o saco continua no banco depois de pego — é fonte infinita');
// o rótulo e as falas não podem entregar para quem é
if (/noel|peru/i.test(promptDasSementes ?? '')) {
  problemas.push('o rótulo do saco entrega o Noel — a dedução some');
}
if (falasDoBanco.some((f) => /noel/i.test(f))) {
  problemas.push('a conversa do banco cita o Noel pelo nome');
}
if (!falasDoBanco.some((f) => /come semente/i.test(f))) {
  problemas.push('a conversa do banco não deixa o fio da dedução');
}

// 2 — a estufa trancada
if (!/porta da estufa/i.test(promptDaPortaTrancada ?? '')) {
  problemas.push(`o prompt da estufa trancada está errado: ${JSON.stringify(promptDaPortaTrancada)}`);
}
if (/cadeado|trancad/i.test(promptDaPortaTrancada ?? '')) {
  problemas.push('o prompt já conta que está trancada — quem clica é que devia descobrir');
}
if (cenaDepoisDeTentar !== 'clube') {
  problemas.push(`a estufa abriu antes da quest (foi parar em "${cenaDepoisDeTentar}")`);
}
if (!falasDaPorta.some((f) => /trancad/i.test(f))) {
  problemas.push('clicar na porta não diz que está trancada');
}

// 3 — o silêncio da Josefina
if (!ditoPelaJosefina.length) problemas.push('não deu para conversar com a Josefina');
if (ditoPelaJosefina.some((f) => /estufa/i.test(f))) {
  problemas.push('a Josefina cita a estufa ANTES da quest: ' + juntas(ditoPelaJosefina.filter((f) => /estufa/i.test(f))));
}
if (!ditoPelaJosefina.some((f) => /terra/i.test(f) && /cansad/i.test(f))) {
  problemas.push('a dica da terra cansada não saiu');
}

// 4 — o Noel
if (!/sementes pro noel/i.test(promptDoNoel ?? '')) {
  problemas.push(`o prompt do Noel com o saco está errado: ${JSON.stringify(promptDoNoel)}`);
}
if (!mochilaComAdubo.includes('adubo')) problemas.push('o Noel não deu o adubo');
if (mochilaComAdubo.includes('sementes')) problemas.push('as sementes ficaram na mochila depois de entregues');
if (!/falar com o noel/i.test(promptDoNoelDepois ?? '')) {
  problemas.push(`o Noel ficou mudo depois do presente: ${JSON.stringify(promptDoNoelDepois)}`);
}
if (falasDoNoel.some((f) => /josefina/i.test(f))) {
  problemas.push('o Noel entrega a Josefina pelo nome — a segunda dedução some');
}

// 5 e 6 — a Josefina e a porta
if (!/adubo pra josefina/i.test(promptDoAdubo ?? '')) {
  problemas.push(`o prompt do adubo está errado: ${JSON.stringify(promptDoAdubo)}`);
}
if (!destrancou) problemas.push('a flag `adubo-entregue` não subiu');
if (mochilaNoFim.includes('adubo')) problemas.push('o adubo ficou na mochila depois de entregue');
if (!falasDaJosefina.some((f) => /estufa|porta de vidro/i.test(f))) {
  problemas.push('ela não fala da estufa nem depois de ganhar o adubo');
}
if (!/falar com a josefina/i.test(promptDaJosefinaDepois ?? '')) {
  problemas.push(`a Josefina ficou muda depois do adubo: ${JSON.stringify(promptDaJosefinaDepois)}`);
}
if (!/entrar na estufa/i.test(promptDaPortaAberta ?? '')) {
  problemas.push(`a porta não virou entrada: ${JSON.stringify(promptDaPortaAberta)}`);
}
if (cenaFinal !== 'estufa') problemas.push(`a estufa não abriu no fim (cena "${cenaFinal}")`);

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
