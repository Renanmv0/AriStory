/**
 * OS CHAMADOS — pegar a carta traz o bicho do clube pela porta da estufa.
 *
 * Pedido do Renan: na hora em que a carta de chamado é escolhida, uma
 * cutscene — o personagem entra pela PORTA PRINCIPAL, cada um com as falas
 * dele, e fica ajudando.
 *
 * O que o teste cobra, para cada um dos quatro (Capy, Gina, Walter, Noel) e
 * para o Mutirão do clube:
 *
 * 1. Antes da carta ele não está na estufa (escondido do lado de fora).
 * 2. Pegar a carta trava a dupla e o traz PELA PORTA: a primeira posição dele
 *    é do lado de fora (`z` maior que a parede da frente), e depois dentro.
 * 3. As falas são DELE: o nome dele aparece como quem fala.
 * 4. No fim a dupla é solta e ele anda até o posto e fica lá.
 * 5. No mutirão entram os quatro; quem já estava não entra de novo.
 *
 * Uso: node scripts/chamados.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './chamados';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com `scenes/estufa.ts` */
const PAREDE_DA_FRENTE = 11;
/** a altura do vao da porta (`PORTA.altura`): a Gina, abaixada, passa por baixo */
const VAO_DA_PORTA = 2.4;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const erros = [];
const problemas = [];

const abrir = async () => {
  const page = await browser.newPage({ viewport: { width: 1000, height: 760 } });
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  // a dupla no meio do terreiro, longe da porta: a camera tem que achar os dois
  await page.goto(`${BASE}/?cena=estufa&em=2,-1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  await page.mouse.click(500, 380);
  await page.waitForTimeout(300);
  return page;
};

const ajudantes = (page) => page.evaluate(() => window.jogo.current.world.root.userData.ajudantes());

/**
 * Pega a carta e conduz a cutscene: amostra a posicao de quem entra, vence
 * cada fala com E anotando quem falou, e fotografa a primeira fala.
 */
const conduzir = async (page, carta, quem, foto) => {
  await page.evaluate((id) => {
    window.__chamado = false;
    void window.jogo.current.world.root.userData.pegarCarta(id).then(() => { window.__chamado = true; });
  }, carta);
  const zs = Object.fromEntries(quem.map((q) => [q, []]));
  const naPorta = Object.fromEntries(quem.map((q) => [q, []]));
  const falantes = [];
  let fotografou = false;
  let naSoleira = false;
  for (let i = 0; i < 160; i++) {
    const a = await ajudantes(page);
    for (const q of quem) if (a[q].visivel) zs[q].push(a[q].z);
    // a altura de quem esta com o corpo atravessando a soleira
    for (const q of quem) {
      if (a[q].visivel && Math.abs(a[q].z - PAREDE_DA_FRENTE) < 0.7) naPorta[q].push(a[q].topo);
    }
    // a foto da porta aberta: o primeiro a passar da parede para dentro
    if (!naSoleira && quem.some((q) => a[q].visivel && a[q].z < PAREDE_DA_FRENTE - 0.4)) {
      naSoleira = true;
      await page.screenshot({ path: foto.replace('.png', '-porta.png') });
    }
    if (await page.locator('.dialogue.show').count()) {
      const who = (await page.locator('.dialogue .who').textContent().catch(() => '')) ?? '';
      if (who && falantes.at(-1) !== who) falantes.push(who.trim());
      if (!fotografou) {
        await page.waitForTimeout(300);
        await page.screenshot({ path: foto });
        fotografou = true;
      }
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(450);
    } else {
      await page.waitForTimeout(150);
    }
    if (await page.evaluate(() => window.__chamado)) break;
  }
  const acabou = await page.evaluate(() => window.__chamado);
  return { zs, falantes, acabou, naPorta };
};

/**
 * Espera cada um chegar no posto (a caminhada e depois da conversa). Nao e
 * tempo fixo: o relogio do jogo no Chromium sem tela anda devagar, entao a
 * espera acaba quando todos chegam ou quando ninguem se mexe mais por 3 s.
 */
const esperarPostos = async (page, quem) => {
  const dist = (a) => quem.map((q) => Math.hypot(a[q].x - a[q].posto.x, a[q].z - a[q].posto.z));
  let a = await ajudantes(page);
  let ultimo = dist(a);
  let parado = 0;
  while (parado < 12) {
    await page.waitForTimeout(250);
    a = await ajudantes(page);
    const d = dist(a);
    if (d.every((x) => x < 0.5)) return a;
    parado = d.every((x, i) => Math.abs(x - ultimo[i]) < 0.01) ? parado + 1 : 0;
    ultimo = d;
  }
  return a;
};

const NOMES = { capy: 'Capy', gina: 'Gina', walter: 'Walter', noel: 'Noel' };

// ============================================ 1. um de cada vez, na mesma rodada
{
  const page = await abrir();
  const antes = await ajudantes(page);
  if (Object.values(antes).some((a) => a.visivel)) problemas.push('alguem do clube ja estava na estufa antes da carta');

  for (const q of ['capy', 'gina', 'walter', 'noel']) {
    const { zs, falantes, acabou, naPorta } = await conduzir(page, `chama-${q}`, [q], `${OUT}-${q}.png`);
    const z = zs[q];
    const alto = Math.max(...naPorta[q]);
    console.log(`${q}: mais alto na soleira ${alto.toFixed(2)} m (vao ${VAO_DA_PORTA}) em ${naPorta[q].length} amostras`);
    if (naPorta[q].length && alto > VAO_DA_PORTA - 0.05) problemas.push(`${q}: bate na verga da porta (${alto.toFixed(2)} m)`);
    console.log(`${q}: entrou de z ${z[0]?.toFixed(1)} a ${z.at(-1)?.toFixed(1)} · falas de ${falantes.join(', ')}`);
    if (!acabou) problemas.push(`${q}: a cutscene nao terminou`);
    if (!(z[0] > PAREDE_DA_FRENTE)) problemas.push(`${q}: nao comecou do lado de fora da porta (z ${z[0]})`);
    if (!(z.at(-1) < PAREDE_DA_FRENTE - 1)) problemas.push(`${q}: nao entrou na estufa`);
    if (!falantes.includes(NOMES[q])) problemas.push(`${q}: ele nao falou nada`);
    if (await page.evaluate(() => window.jogo.player.locked === true)) {
      problemas.push(`${q}: a dupla continuou travada`);
    }
    const a = await esperarPostos(page, [q]);
    const longe = Math.hypot(a[q].x - a[q].posto.x, a[q].z - a[q].posto.z);
    if (longe > 0.5) problemas.push(`${q}: nao chegou no posto (${longe.toFixed(2)} m)`);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}-postos.png` });

  // o mutirao com os quatro ja dentro: ninguem entra de novo, mas a conversa acontece
  const { falantes, acabou } = await conduzir(page, 'mutirao-do-clube', [], `${OUT}-mutirao-com-todos.png`);
  if (!acabou || falantes.length < 4) problemas.push('mutirao com todos dentro: a conversa nao aconteceu');
  await page.close();
}

// ================================================= 2. o mutirao do zero
{
  const page = await abrir();
  const quem = ['gina', 'capy', 'noel', 'walter'];
  const { zs, falantes, acabou } = await conduzir(page, 'mutirao-do-clube', quem, `${OUT}-mutirao.png`);
  console.log(`mutirao: falas de ${falantes.join(', ')}`);
  if (!acabou) problemas.push('mutirao: a cutscene nao terminou');
  for (const q of quem) {
    if (!(zs[q][0] > PAREDE_DA_FRENTE)) problemas.push(`mutirao: ${q} nao veio de fora da porta`);
    if (!falantes.includes(NOMES[q])) problemas.push(`mutirao: ${q} nao falou`);
  }
  const a = await esperarPostos(page, quem);
  for (const q of quem) {
    if (Math.hypot(a[q].x - a[q].posto.x, a[q].z - a[q].posto.z) > 0.5) problemas.push(`mutirao: ${q} fora do posto`);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}-mutirao-postos.png` });
  await page.close();
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
