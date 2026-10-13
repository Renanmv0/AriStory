/**
 * A SOBREMESA DO MANO — o traço do bicho novo do turno 2 do Mania.
 *
 * O Mano come e, em vez de pedir a conta, LEVANTA A MÃO DE NOVO: um segundo
 * "anotar" e uma segunda entrega na MESMA mesa, e no fim ele paga as duas
 * coisas. Este teste joga o Mano inteiro, do salão à conta, e mede:
 *
 * - o primeiro pedido dele é de COMER (smoothie de entrada e de sobremesa não
 *   é jantar);
 * - depois de comer ele volta a `quer-pedir`, com a sobremesa como prato, e a
 *   mesa continua dele (não fica suja nem livre);
 * - a sobremesa entregue faz ele DANÇAR (é o pinguim do sorvete, afinal);
 * - a conta é o prato MAIS a sobremesa;
 * - e fotografa o Mano sentado à mesa, de perto — bicho novo à mesa precisa
 *   de foto sentado (§13.8 do plano).
 *
 * A leitura e a refeição são encurtadas por dentro, como no `turno.mjs`: no
 * Chromium sem placa o jogo anda a ~2 quadros por segundo, e o que se prova é
 * o traço, não quanto tempo o pinguim mastiga.
 *
 * Uso: node scripts/sobremesa.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './sobremesa';
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
const irPara = (x, z, f = 0) => page.evaluate(([px, pz, ff]) => window.jogo.debugPlace(px, pz, ff), [x, z, f]);

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

const venceAFala = async (voltas = 20) => {
  for (let i = 0; i < voltas; i++) {
    if (!(await page.locator('.dialogue.show').count())) return;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(420);
  }
};

/** o Mano por dentro do turno */
const mano = () => page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  const c = t.clientes.find((k) => k.ficha.id === 'mano');
  if (!c) return null;
  return {
    fase: c.fase,
    prato: c.prato.id,
    naSobremesa: c.naSobremesa,
    gasto: c.gasto,
    mesa: c.mesa ? [c.mesa.x, c.mesa.z] : null,
    dancando: c.bicho.estaDancando,
    caixa: t.dinheiro,
  };
});

/** espera o Mano chegar numa fase (empurrando o relógio das fases que só esperam) */
const esperarFase = async (fase, voltas = 80) => {
  for (let i = 0; i < voltas; i++) {
    const m = await page.evaluate((f) => {
      const t = window.jogo.current.world.root.userData.turno;
      const c = t.clientes.find((k) => k.ficha.id === 'mano');
      if (!c) return null;
      if (['sentando', 'lendo', 'comendo'].includes(c.fase) && c.fase !== f) c.relogio = 0.01;
      // a paciência não é o que se mede aqui: a ~2 quadros por segundo, ela
      // cairia enquanto o teste anda de um ponto ao outro
      c.paciencia = 1;
      return c.fase;
    }, fase);
    if (m === fase) return true;
    await page.waitForTimeout(500);
  }
  return false;
};

// ====================================== o turno 2 aberto (3 estrelas no 1)
await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.evaluate(() => {
  localStorage.setItem('aristory.save.v1', JSON.stringify({
    flags: { 'turno-aceito': true, 'osso-entregue': true, 'primeiro-turno': true, 'turno-2-explicado': true },
    stats: { 'turno:1:estrelas': 3, 'turno:1:recorde': 230, 'turno:1:vezes': 1 },
  }));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world?.root?.userData?.turno, null, { timeout: 60000 });
await page.waitForTimeout(1500);
await page.mouse.click(500, 440);

await agir(2.4, -7.5, /escala/i, 20);
for (let i = 0; i < 30 && !(await page.locator('.escala-do-walter.show').count()); i++) await page.waitForTimeout(300);
// a escala abre marcada no 2 (o primeiro sem três estrelas)
await page.locator('.escala-do-walter .comecar').click();
await venceAFala();
const qual = await page.evaluate(() => window.jogo.current.world.root.userData.turno.turno.numero);

// ============================================== o Mano chega primeiro, sozinho
let chegou = false;
for (let i = 0; i < 150 && !chegou; i++) {
  chegou = !!(await mano());
  if (!chegou) await page.waitForTimeout(500);
}
const MESA = { x: 5.2, z: 1.2 };
const passos = {};
passos.levar = await agir(9.4, 5.4, /levar à mesa/i);
passos.sentar = await agir(MESA.x, MESA.z + 1.4, /sentar aqui/i);
await venceAFala(6);
await esperarFase('quer-pedir');
passos.anotar = await agir(MESA.x, MESA.z + 1.4, /anotar o pedido/i, 60);
const primeiro = await mano();
passos.pegar = await agir(-3.6, -0.6, /pegar /i, 240);
passos.entregar = await agir(MESA.x, MESA.z + 1.4, /entregar /i, 40);

// ===================================================== acabou de comer: e aí?
const pediuDeNovo = await esperarFase('quer-pedir');
const naSobremesa = await mano();
await page.screenshot({ path: `${OUT}-pede-de-novo.png` });
passos.anotarSobremesa = await agir(MESA.x, MESA.z + 1.4, /anotar o pedido/i, 60);
passos.pegarSobremesa = await agir(-3.6, -0.6, /pegar /i, 240);
passos.entregarSobremesa = await agir(MESA.x, MESA.z + 1.4, /entregar /i, 40);
let dancou = false;
for (let i = 0; i < 6 && !dancou; i++) {
  dancou = !!(await mano())?.dancando;
  if (!dancou) await page.waitForTimeout(250);
}

// A FOTO DE PERTO: o Mano sentado na cadeira da frente, com a sobremesa na mesa
await irPara(MESA.x - 2.2, MESA.z + 2.6);
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  const c = t.clientes.find((k) => k.ficha.id === 'mano');
  window.jogo.focusCamera(c.bicho.group);
  window.jogo.setZoom(3.2);
});
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-mano-sentado.png` });
await page.evaluate(() => {
  window.jogo.focusCamera(null);
  window.jogo.setZoom(11.5);
});
const comendoSobremesa = await mano();

// =================================================================== a conta
await esperarFase('quer-pagar');
const antesDePagar = await mano();
passos.receber = await agir(MESA.x, MESA.z + 1.4, /receber a conta/i, 40);
const caixaDepois = await page.evaluate(() => window.jogo.current.world.root.userData.turno.dinheiro);

// ======================================================================= laudo
const falhas = [];
if (qual !== 2) falhas.push(`a escala nao comecou o turno 2: ${qual}`);
if (!chegou) falhas.push('o Mano nao chegou no turno 2');
for (const [nome, v] of Object.entries(passos)) if (!v) falhas.push(`o passo "${nome}" nunca ficou disponivel`);
if (primeiro && ['suco-morango', 'smoothie-manga-banana'].includes(primeiro.prato)) {
  falhas.push(`o primeiro pedido do Mano foi uma bebida: ${primeiro.prato}`);
}
if (!pediuDeNovo || !naSobremesa?.naSobremesa) falhas.push('depois de comer o Mano nao pediu sobremesa');
if (naSobremesa && naSobremesa.prato !== 'smoothie-manga-banana') falhas.push(`a sobremesa devia ser o smoothie: ${naSobremesa.prato}`);
if (naSobremesa && (!naSobremesa.mesa || naSobremesa.mesa[0] !== MESA.x)) falhas.push('o Mano perdeu a mesa entre o prato e a sobremesa');
if (!dancou) falhas.push('a sobremesa chegou e o Mano nao dancou');
if (comendoSobremesa?.fase !== 'comendo') falhas.push(`o Mano devia estar comendo a sobremesa: ${comendoSobremesa?.fase}`);
const esperado = antesDePagar ? Math.round(antesDePagar.gasto * 1.5) : -1;
if (antesDePagar && antesDePagar.gasto <= 20) falhas.push(`a conta do Mano nao somou as duas coisas: gasto ${antesDePagar.gasto}`);
if (antesDePagar && caixaDepois - antesDePagar.caixa !== esperado) {
  falhas.push(`a conta devia ser R$ ${esperado} (prato + sobremesa, coracao dourado), entrou R$ ${caixaDepois - antesDePagar.caixa}`);
}
falhas.push(...erros);

console.log('turno:', qual, '· primeiro pedido:', primeiro?.prato, '· sobremesa:', naSobremesa?.prato);
console.log('dançou:', dancou, '· gasto:', antesDePagar?.gasto, '· conta:', caixaDepois - (antesDePagar?.caixa ?? 0));
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
