/**
 * O Mania de Churrasco como ATRAÇÃO: sentar em qualquer mesa, pedir, e o Walter
 * buscar o prato na cozinha.
 *
 * O que este teste guarda:
 * - TODA MESA SENTA. São 11, e o pedido do Renan foi "qualquer mesa que eu
 *   quiser" — o teste conta as interações e senta em três delas, de fileiras
 *   diferentes, incluindo a do canto;
 * - o cardápio é o MESMO de fora, e pedir por ele funciona aqui dentro;
 * - O WALTER VAI ATÉ A COZINHA. É a parte que o Renan quis ver, e é a que mais
 *   pode quebrar em silêncio: ele tem que CRUZAR o balcão de passagem
 *   (`z = -2`) pelo vão de serviço e voltar. O teste segue a trilha dele e
 *   confere que ela passou do outro lado, e que o prato aparece na bandeja
 *   antes de ele voltar;
 * - o prato POUSA na mesa em que a dupla sentou, e não em outra;
 * - ele VOLTA A PASSEAR sozinho depois de servir — bicho que fica de serviço
 *   para sempre depois de uma cutscene é bicho quebrado;
 * - o QUADRO DE EMPREGADO DO MÊS existe, tem o retrato pintado (o canvas não
 *   pode sair em branco) e dá para ler.
 *
 * Uso: node scripts/mesas.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './mesas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** três mesas de fileiras diferentes: o canto do fundo, o meio e a da frente */
const MESAS_TESTADAS = [
  ['mania:mesa-1', 9.4, -5.2],
  ['mania:mesa-4', 0.2, 1.2],
  ['mania:mesa-10', 7.6, 5.6],
];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(600, 450);
await page.waitForTimeout(400);

const ondeWalter = () =>
  page.evaluate(() => {
    let g = null;
    window.jogo.scene.traverse((o) => {
      if (o.userData?.peca === 'garcom-canino') g = o;
    });
    return g ? [+g.position.x.toFixed(2), +g.position.z.toFixed(2)] : null;
  });

/** vence o diálogo aberto, devolvendo as falas inteiras */
const venceAFala = async (voltas = 14) => {
  const ditas = [];
  for (let i = 0; i < voltas; i++) {
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.waitForTimeout(700);
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 10) ditas.push(t);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(280);
  }
  return ditas;
};

// ================================================ 1. quantas mesas sentam
const quantasMesas = await page.evaluate(() =>
  window.jogo.current.world.interactables.filter((i) => i.id.startsWith('mania:mesa-')).length,
);

// ============================== 2. sentar, pedir, e o Walter buscar o prato
/** senta na mesa dada, pede o primeiro prato e acompanha o garçom */
const almocar = async (id, mx, mz, comFoto) => {
  const it = await page.evaluate((alvo) => {
    const i = window.jogo.current.world.interactables.find((x) => x.id === alvo);
    return i ? { x: i.x, z: i.z } : null;
  }, id);
  if (!it) return { erro: 'interação não existe' };

  await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI), [it.x, it.z]);
  await page.waitForTimeout(900);
  const prompt = await page.locator('.prompt .label').textContent().catch(() => '');
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1400);

  // a conversa antes do cardápio (só na primeira vez)
  await venceAFala();

  // o cardápio abre; pede o primeiro prato da primeira seção
  await page.waitForTimeout(1200);
  const cardapioAbriu = (await page.locator('.cardapio.show').count()) > 0;
  if (comFoto) await page.screenshot({ path: `${OUT}-cardapio.png` });
  if (cardapioAbriu) {
    await page.locator('.cardapio.show .prato').first().click();
    await page.waitForTimeout(700);
    await page.locator('.cardapio.show .pedir').click();
    await page.waitForTimeout(900);
  }
  await venceAFala(3);

  /**
   * A TRILHA DO WALTER durante a entrega, e ela é a prova de que ele foi mesmo
   * à cozinha: o salão inteiro tem `z > -2`, então qualquer ponto com
   * `z < -2,4` só pode ter sido dado do outro lado do balcão de passagem.
   *
   * O LAÇO ESPERA A DUPLA LEVANTAR, e não um número de segundos. A primeira
   * versão contava 32 s e terminava no meio da cutscene: o prato ainda não
   * tinha pousado, a leitura seguinte começava com os dois sentados, e o
   * `debugPlace` da mesa seguinte não movia ninguém — as três medições saíam
   * erradas em cascata. Aqui dentro o relógio do jogo anda a um terço do
   * relógio de parede, então tempo fixo nunca ia servir.
   */
  const trilha = [];
  let comPrato = false;
  let pratoNaMesa = false;
  let deLevantar = false;
  for (let i = 0; i < 120; i++) {
    const passo = await page.evaluate(([x, z]) => {
      let cao = null;
      window.jogo.scene.traverse((o) => {
        if (o.userData?.peca === 'garcom-canino') cao = o;
      });
      const bandeja = cao?.getObjectByName('bandeja');
      let naMesa = false;
      window.jogo.scene.traverse((o) => {
        if (!o.userData?.prato) return;
        o.updateWorldMatrix(true, false);
        const e = o.matrixWorld.elements;
        if (Math.hypot(e[12] - x, e[14] - z) < 1.2 && e[13] > 0.6) naMesa = true;
      });
      return {
        onde: cao ? [+cao.position.x.toFixed(2), +cao.position.z.toFixed(2)] : null,
        naBandeja: !!bandeja && bandeja.children.length > 0,
        naMesa,
        sentado: !!window.jogo.player.riding,
      };
    }, [mx, mz]);
    if (passo.onde) trilha.push(passo.onde);
    comPrato = comPrato || passo.naBandeja;
    pratoNaMesa = pratoNaMesa || passo.naMesa;
    if (comFoto && passo.naBandeja && !deLevantar) {
      await page.screenshot({ path: `${OUT}-cozinha.png` });
      deLevantar = true;
    }
    // a conversa do fim da refeição também precisa ser vencida daqui
    if (await page.locator('.dialogue.show').count()) {
      await page.keyboard.press('KeyE');
    } else if (!passo.sentado && comPrato) {
      break;
    }
    await page.waitForTimeout(600);
  }

  const naCozinha = trilha.filter(([, z]) => z < -2.4).length;

  if (comFoto) await page.screenshot({ path: `${OUT}-servido.png` });

  await venceAFala();
  await page.waitForTimeout(1200);
  const sentado = await page.evaluate(() => !!window.jogo.player.riding);

  return { prompt, cardapioAbriu, naCozinha, comPrato, pratoNaMesa, sentado };
};

const primeira = await almocar(...MESAS_TESTADAS[0], true);
await page.waitForTimeout(1200);

// depois de servir ele tem que voltar a passear sozinho
const antes = await ondeWalter();
await page.waitForTimeout(6000);
const depois = await ondeWalter();
const voltouAPassear = Math.hypot(depois[0] - antes[0], depois[1] - antes[1]);

// e as outras duas mesas também sentam
const segunda = await almocar(...MESAS_TESTADAS[1], false);
const terceira = await almocar(...MESAS_TESTADAS[2], false);

// ============================================ 3. o quadro de empregado do mês
const quadro = await page.evaluate(() => {
  let q = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'quadro-empregado-do-mes') q = o;
  });
  if (!q) return null;
  // a arte é uma textura de canvas: ela não pode ter saído em branco
  let pintado = 0;
  q.traverse((o) => {
    const img = o.material?.map?.image;
    if (!img) return;
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let diferentes = new Set();
    for (let i = 0; i < d.length; i += 4 * 97) {
      diferentes.add(`${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`);
    }
    pintado = Math.max(pintado, diferentes.size);
  });
  q.updateWorldMatrix(true, false);
  const e = q.matrixWorld.elements;
  return { onde: [+e[12].toFixed(2), +e[13].toFixed(2), +e[14].toFixed(2)], cores: pintado };
});

const promptDoQuadro = await page.evaluate(() =>
  !!window.jogo.current.world.interactables.find((i) => i.id === 'mania:empregado-do-mes'),
);
await page.evaluate(() => window.jogo.debugPlace(11.4, -7.5, 0));
await page.waitForTimeout(1000);
const quadroPerto = await page.locator('.prompt .label').textContent().catch(() => '');
await page.evaluate(() => {
  let q = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'quadro-empregado-do-mes') q = o;
  });
  window.jogo.focusCamera(q);
  window.jogo.setZoom(2.4);
});
await page.waitForTimeout(2200);
await page.screenshot({ path: `${OUT}-quadro.png` });

// ------------------------------------------------------------------ relatório
console.log('1. mesas em que dá para sentar:', quantasMesas);
console.log('2. primeira mesa:', JSON.stringify(primeira));
console.log('   voltou a passear depois de servir:', voltouAPassear.toFixed(2));
console.log('   segunda mesa:', JSON.stringify(segunda));
console.log('   terceira mesa:', JSON.stringify(terceira));
console.log('3. quadro:', JSON.stringify(quadro), '· interação:', promptDoQuadro,
  '· prompt de perto:', JSON.stringify(quadroPerto));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (quantasMesas !== 11) problemas.push(`nem toda mesa senta (${quantasMesas} de 11)`);
for (const [nome, r] of [['1ª', primeira], ['2ª', segunda], ['3ª', terceira]]) {
  if (r.erro) {
    problemas.push(`${nome} mesa: ${r.erro}`);
    continue;
  }
  if (!/cardápio|cardapio/i.test(r.prompt ?? '')) problemas.push(`${nome} mesa: o prompt de sentar não apareceu`);
  if (!r.cardapioAbriu) problemas.push(`${nome} mesa: o cardápio não abriu`);
  if (!r.naCozinha) problemas.push(`${nome} mesa: o Walter não cruzou o balcão para a cozinha`);
  if (!r.comPrato) problemas.push(`${nome} mesa: o prato nunca apareceu na bandeja dele`);
  if (!r.pratoNaMesa) problemas.push(`${nome} mesa: o prato não pousou nesta mesa`);
  if (r.sentado) problemas.push(`${nome} mesa: a dupla não levantou no fim`);
}
if (voltouAPassear < 0.4) problemas.push('o Walter ficou de serviço para sempre: não voltou a passear');
if (!quadro) problemas.push('o quadro de empregado do mês não está na parede');
else {
  // o quadro tem faixa escura, fundo creme, o tijolo do oval e o pelo do
  // cachorro: um canvas em branco ou só de uma cor não passa daqui
  if (quadro.cores < 8) problemas.push(`o retrato do Walter saiu vazio (${quadro.cores} cores)`);
  if (Math.abs(quadro.onde[0] - 11.4) > 0.1) problemas.push('o quadro não está ao lado da registradora');
}
if (!promptDoQuadro) problemas.push('o quadro não tem interação');
if (!/empregado/i.test(quadroPerto ?? '')) problemas.push('o prompt do quadro não apareceu de perto');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
