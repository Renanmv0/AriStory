/**
 * A portaria do clube: a guarita e a Gina, a girafa que toma conta dela.
 *
 * O que este teste guarda:
 * - a Gina FICA NO POSTO. Ela usa o mesmo cérebro do Pelusa, que passeia — o
 *   que a segura é a área que a cena passa, menor que o passo mínimo que o
 *   cérebro exige de um destino. Se um dia alguém alargar essa área, a porteira
 *   sai andando pelo clube e este teste cai;
 * - a CABEÇA dela fica do lado de FORA da parede da guarita e ACIMA do balcão.
 *   É a única parte que aparece, e ela só aparece por causa dessas duas contas:
 *   fora da parede, fora da sombra do telhado (a câmera olha em 34°);
 * - ela está VIVA: o pescoço muda de pose entre duas leituras;
 * - ela apita sozinha, sem ninguém pedir;
 * - o prompt aparece com o NOME dela, ela se apresenta, e a conversa manda a
 *   dupla aproveitar o dia;
 * - a memória entra no diário;
 * - a GUARITA NOVA (`world/guaritaDoClube.ts`): o `teto` e a `dobradica` com
 *   nome, e a cabeça medida contra a frente e o balcão que a peça declara;
 * - o DESBLOQUEIO da Portaria do Clube (`eventos/portariaDoClube.ts`): sem a
 *   chave, nada muda e o save não ganha flag; com `?portaria`, a primeira
 *   conversa (de quem já conhecia a Gina) é a da guarita nova — a flag, a
 *   memória "A guarita nova" e o aviso do minigame — e a segunda já CONVIDA
 *   para trabalhar (os dias abertos na escolha; o "Só conversar" leva à
 *   conversa de sempre); e num save do zero, a apresentação vem antes da reforma;
 * - a ORDEM do jogo: num save do zero o clube tem a guarita de ANTES (sem o
 *   `teto`), e ela só vira a nova depois da última noite do Mania jogada.
 *   O posto, a cabeça e as conversas são medidos na nova (`?guaritaNova`).
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

/** a guarita da cena é a nova? (só a nova tem o grupo `teto`) */
const ehANova = () => page.evaluate(() => {
  let nova = false;
  window.jogo.scene.traverse((o) => { if (o.name === 'teto' && o.parent?.userData?.peca === 'guarita') nova = true; });
  return nova;
});
// num save do zero, antes do Mania: a guarita de antes
const novaNoComeco = await ehANova();
// o resto é medido na guarita nova, mostrada antes da hora (o save continua o mesmo)
await page.goto(`${BASE}/?cena=clube&guaritaNova`, { waitUntil: 'networkidle' });
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
    const comNome = (nome) => { let achou = false; guaritaObj?.traverse((o) => { if (o.name === nome) achou = true; }); return achou; };
    return {
      girafa: onde(girafa),
      cabeca: cabeca ? onde(cabeca) : null,
      guarita: guaritaObj ? onde(guaritaObj) : null,
      medidas: guaritaObj?.userData.medidas ?? null,
      teto: comNome('teto'),
      porta: comNome('dobradica'),
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
/** uma conversa inteira com a Gina: as falas, na ordem */
const conversar = async (foto, escolher = null) => {
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI), [inicio.girafa[0], inicio.girafa[2] + 2.3]);
  await page.waitForTimeout(1200);
  const rotulo = await page.locator('.prompt .label').textContent().catch(() => '');
  if (foto) await page.screenshot({ path: `${OUT}-${foto}-balcao.png` });
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1000);
  const ditas = [];
  for (let i = 0; i < 40; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    const quem = await page.locator('.dialogue .who').textContent().catch(() => '');
    if (t) ditas.push(`${quem ?? ''}: ${t}`);
    if (foto && i === 2) await page.screenshot({ path: `${OUT}-${foto}-conversa.png` });
    // a pergunta com botões (o convite da portaria): escolhe pelo texto
    if (escolher) {
      const botao = page.locator('.escolhas button', { hasText: escolher });
      if (await botao.count()) {
        ditas.push(`[escolhas] ${(await page.locator('.escolhas').textContent()) ?? ''}`);
        await botao.first().click();
        await page.waitForTimeout(700);
        continue;
      }
    }
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(1200);
  return { rotulo, ditas };
};
/** o que um save guarda (o de verdade, ou o de teste do `?portaria`) */
const salvo = (chave = 'aristory.save.v1') => page.evaluate((k) => {
  const s = JSON.parse(localStorage.getItem(k) ?? '{}');
  return { memorias: (s.memories ?? []).map((m) => m.id), flags: Object.keys(s.flags ?? {}) };
}, chave);
const TESTE = 'aristory.save.v1.portaria';
const conversaDeSempre = await conversar('sempre');
const prompt = conversaDeSempre.rotulo;
const falas = conversaDeSempre.ditas;
const depoisDeSempre = await salvo();
const noDiario = depoisDeSempre.memorias.includes('girafa-da-portaria');

// ------------------------------------------- 4. a guarita nova desbloqueia
// (o mesmo save, que já conhece a Gina, agora com a chave do minigame ligada)
await page.goto(`${BASE}/?cena=clube&portaria`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
const reforma = await conversar('reforma');
const depoisDaReforma = await salvo(TESTE);
// (o `?portaria` joga num save à parte: o de verdade não pode ter ganho nada)
const deVerdadeIntacto = await salvo();
// depois do desbloqueio, a Gina convida para trabalhar; o "Só conversar" leva à conversa de sempre
const outraVez = await conversar(null, /Só conversar/);
// e num save do zero: a apresentação vem antes
await page.evaluate((k) => { localStorage.removeItem('aristory.save.v1'); localStorage.removeItem(k); }, TESTE);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
const doZero = await conversar(null);
const depoisDoZero = await salvo(TESTE);

// ------------------------------------------- 5. a última noite do Mania traz a nova
// (no save de verdade, sem nada na URL: antes, a de antes; com a sexta noite jogada, a nova)
await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const novaAntesDoMania = await ehANova();
await page.evaluate(() => window.jogo.bump('turno:6:vezes'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
const novaDepoisDoMania = await ehANova();
const ginaNaNova = await medir();

// ------------------------------------------------------------------ relatório
console.log('1. posto · girafa em', JSON.stringify(inicio?.girafa),
  '· andou em 7 s:', andou.toFixed(3));
console.log('   guarita em', JSON.stringify(inicio?.guarita),
  '· cabeça em', JSON.stringify(inicio?.cabeca));
console.log('   pescoço mexeu:', mexeu.toFixed(4));
console.log('2. apitos sozinha:', apitosDepois - apitosAntes);
console.log('3. prompt:', JSON.stringify(prompt));
for (const f of falas) console.log('   ', f);
console.log('4. memória no diário:', noDiario, '· flags sem a chave:', JSON.stringify(depoisDeSempre.flags));
console.log('5. guarita nova · teto', inicio?.teto, '· porta', inicio?.porta, '· medidas', JSON.stringify(inicio?.medidas));
for (const f of reforma.ditas) console.log('   reforma', f);
console.log('   depois:', JSON.stringify(depoisDaReforma), '· o de verdade:', JSON.stringify(deVerdadeIntacto));
console.log('   outra vez:', outraVez.ditas.length, 'falas;', outraVez.ditas.find((f) => f.startsWith('[escolhas]')), '·', outraVez.ditas.at(-1));
console.log('6. ordem · nova no começo:', novaNoComeco, '· antes do Mania:', novaAntesDoMania, '· depois da sexta noite:', novaDepoisDoMania,
  '· a Gina em', JSON.stringify(ginaNaNova?.girafa));
console.log('   do zero:', doZero.ditas.slice(0, 3).join(' | '), '…', JSON.stringify(depoisDoZero));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!inicio?.cabeca) problemas.push('não achei a girafa (ou a cabeça dela) na cena');
else {
  // a parede da frente fica em `z + meiaZ` da peça, e o tampo do balcão na altura que ela declara
  const frente = inicio.guarita[2] + (inicio.medidas?.meiaZ ?? 99);
  if (!(inicio.cabeca[2] > frente)) {
    problemas.push(`a cabeça está DENTRO da guarita (z ${inicio.cabeca[2]} contra a parede em ${frente.toFixed(2)})`);
  }
  if (!(inicio.cabeca[1] > (inicio.medidas?.balcao ?? 99) + 0.3)) {
    problemas.push(`a cabeça está abaixo do balcão (y ${inicio.cabeca[1]})`);
  }
  const dentro = Math.abs(inicio.girafa[0] - inicio.guarita[0]) < (inicio.medidas?.meiaX ?? 0) - 0.4 &&
    Math.abs(inicio.girafa[2] - inicio.guarita[2]) < (inicio.medidas?.meiaZ ?? 0);
  if (!inicio.teto) problemas.push('a guarita não tem o grupo `teto`');
  if (!inicio.porta) problemas.push('a guarita não tem a `dobradica` da porta');
  if (!dentro) problemas.push('o corpo da girafa não está dentro da guarita');
}
if (andou > 0.25) problemas.push(`a porteira saiu do posto (andou ${andou.toFixed(2)})`);
if (mexeu < 0.002) problemas.push('a girafa está congelada — o pescoço não mexe');
if (apitosDepois - apitosAntes < 1) problemas.push('ela não apitou sozinha');
if (!/gina/i.test(prompt ?? '')) problemas.push('o prompt da portaria não traz o nome da Gina');
if (!falas.some((f) => /Gina/.test(f))) problemas.push('ela não diz o próprio nome na conversa');
if (!falas.some((f) => /aproveit/i.test(f))) {
  problemas.push('a girafa não mandou a dupla aproveitar o dia');
}
if (!noDiario) problemas.push('a memória da portaria não entrou no diário');
if (depoisDeSempre.flags.includes('portaria:liberada') || depoisDeSempre.memorias.includes('guarita-nova')) {
  problemas.push('sem a chave, o save ganhou o desbloqueio da portaria');
}
if (!reforma.ditas.some((f) => /guarita nova/i.test(f))) problemas.push('com a chave, a Gina não mostrou a guarita nova');
if (reforma.ditas.some((f) => /Sou a Gina/.test(f))) problemas.push('quem já conhecia a Gina ouviu a apresentação de novo');
if (!depoisDaReforma.flags.includes('portaria:liberada')) problemas.push('a flag do minigame não foi gravada');
if (!depoisDaReforma.memorias.includes('guarita-nova')) problemas.push('a memória "A guarita nova" não entrou');
if (deVerdadeIntacto.flags.includes('portaria:liberada') || deVerdadeIntacto.memorias.includes('guarita-nova')) {
  problemas.push('o ?portaria gravou o desbloqueio no save de verdade');
}
if (outraVez.ditas.some((f) => /guarita nova/i.test(f)) || !outraVez.ditas.some((f) => /aproveit/i.test(f))) {
  problemas.push('a segunda conversa ("Só conversar") não voltou a ser a de sempre');
}
if (!outraVez.ditas.some((f) => /\[escolhas\].*Dia 1/.test(f))) problemas.push('depois do desbloqueio, a Gina não convidou para trabalhar (o Dia 1 na escolha)');
if (!/Sou a Gina/.test(doZero.ditas.join(' ')) || !/guarita nova/i.test(doZero.ditas.join(' '))) {
  problemas.push('no save do zero, a apresentação e a reforma não vieram juntas');
}
if (novaNoComeco || novaAntesDoMania) problemas.push('a guarita nova apareceu antes da última noite do Mania');
if (!novaDepoisDoMania) problemas.push('depois da última noite do Mania, a guarita continuou a de antes');
if (ginaNaNova && Math.abs(ginaNaNova.girafa[0] - inicio.girafa[0]) > 0.3) problemas.push('na guarita nova de verdade, a Gina não está no posto dela');
if (!depoisDoZero.memorias.includes('girafa-da-portaria') || !depoisDoZero.flags.includes('portaria:liberada')) {
  problemas.push('no save do zero, faltou a memória da Gina ou a flag');
}

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
