/**
 * O Mania de Churrasco: a porta de serviço do clube e o restaurante por dentro.
 *
 * O que este teste guarda:
 * - a porta de serviço aparece na LATERAL do restaurante, e não na parede do
 *   fundo. A parede do fundo é ponto cego: o prédio tem 5,5 e a 34° de câmera
 *   ele engole quase 4 m atrás de si — porta ali é porta invisível, e pior, é
 *   um lugar onde a dupla também some;
 * - entrar leva para a cena nova, e a conversa da descoberta acontece uma vez;
 * - o restaurante tem as DUAS salas: a cozinha (grelha, fogão, pia, bancadas) e
 *   o salão (mesas e bar), com o balcão de passagem entre elas;
 * - o balcão de passagem SEGURA: cozinha e salão são separados de verdade, e só
 *   se atravessa pelo vão de serviço. É a peça em que o minijogo vai pendurar;
 * - a porta de volta devolve a dupla para o lado de fora, no clube.
 *
 * Uso: node scripts/mania.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './mania';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1250, height: 900 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);

const cena = () => page.evaluate(() => window.jogo.current?.def?.id ?? null);
const onde = () =>
  page.evaluate(() => [
    +window.jogo.player.object.position.x.toFixed(2),
    +window.jogo.player.object.position.z.toFixed(2),
  ]);

/** larga a dupla num ponto e empurra para o lado pedido por `segundos` */
const empurrar = async (x, z, teclas, segundos) => {
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
  await page.waitForTimeout(600);
  for (const t of teclas) await page.keyboard.down(t);
  await page.waitForTimeout(segundos * 1000);
  for (const t of teclas) await page.keyboard.up(t);
  await page.waitForTimeout(300);
  return onde();
};

/** vence o diálogo que estiver aberto */
const venceAFala = async (voltas = 16) => {
  const ditas = [];
  for (let i = 0; i < voltas; i++) {
    if (!(await page.locator('.dialogue.show').count())) break;
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t) ditas.push(t);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(650);
  }
  return ditas;
};

// ------------------------------------------- 1. achar a porta e entrar
await page.evaluate(() => window.jogo.debugPlace(-9.2, -16.2, -Math.PI / 2));
await page.waitForTimeout(1200);
const promptDaPorta = await page.locator('.prompt .label').textContent().catch(() => '');
await page.screenshot({ path: `${OUT}-porta.png` });

await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const descoberta = await venceAFala();
await page.waitForTimeout(2600);
const cenaDepois = await cena();
await page.screenshot({ path: `${OUT}-dentro.png` });

// -------------------------------------- 2. o que existe dentro do salão
const inventario = await page.evaluate(() => {
  const contar = (nome) => {
    let n = 0;
    window.jogo.scene.traverse((o) => {
      if (o.userData?.peca === nome) n += 1;
    });
    return n;
  };
  return {
    churrasqueira: contar('churrasqueira'),
    fogao: contar('fogao-industrial'),
    pia: contar('pia-industrial'),
    bancadas: contar('bancada-inox'),
    passagem: contar('balcao-de-passagem'),
    bebidas: contar('estante-de-bebidas'),
    colisores: window.jogo.current.world.colliders.length,
  };
});

// ------------------------------- 3. o balcão separa a cozinha do salão
/**
 * Do salão, andando para o fundo em cima do balcão de passagem, ninguém
 * atravessa: o balcão vai de `x = -11,5` a `-2` em `z = -2`. Pelo vão de
 * serviço (`x` entre -2 e 0), a mesma caminhada passa.
 */
const noBalcao = await empurrar(-7, 1.4, ['KeyW', 'KeyD'], 4);
// 9 s, e não 5: são 4 m do salão até dentro da cozinha, e a dupla anda a ~0,7
// por segundo. Com 5 s o teste acusava um vão fechado que estava aberto — ela
// só não tinha chegado ainda (o mesmo erro que o teste do portão do clube deu).
const peloVao = await empurrar(-0.9, 1.4, ['KeyW', 'KeyD'], 9);
await page.screenshot({ path: `${OUT}-cozinha.png` });

// ------------------------------------------------- 4. a porta de volta
await page.evaluate(() => window.jogo.debugPlace(-10.4, -5, -Math.PI / 2));
await page.waitForTimeout(1200);
const promptDeVolta = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const cenaDeVolta = await cena();
const ondeVoltou = await onde();

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'porta-dos-fundos'),
);

// ------------------------------------------------------------------ relatório
console.log('1. prompt da porta:', JSON.stringify(promptDaPorta), '· cena depois:', cenaDepois);
for (const f of descoberta) console.log('   ', f);
console.log('2. dentro:', JSON.stringify(inventario));
console.log('3. balcão segura em', JSON.stringify(noBalcao),
  '· pelo vão passa para', JSON.stringify(peloVao));
console.log('4. volta:', JSON.stringify(promptDeVolta), '→', cenaDeVolta, JSON.stringify(ondeVoltou));
console.log('   memória da porta no diário:', noDiario);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!/fundos/i.test(promptDaPorta ?? '')) problemas.push('o prompt da porta de serviço não apareceu');
if (cenaDepois !== 'mania-de-churrasco') problemas.push(`a porta não levou para dentro (caiu em ${cenaDepois})`);
if (!descoberta.length) problemas.push('a conversa da descoberta não aconteceu');
if (inventario.churrasqueira !== 1) problemas.push('a churrasqueira não está na cozinha');
if (inventario.fogao !== 1) problemas.push('o fogão não está na cozinha');
if (inventario.pia !== 1) problemas.push('a pia não está na cozinha');
if (inventario.bancadas < 2) problemas.push('faltam bancadas na cozinha');
if (inventario.passagem < 3) problemas.push('faltam trechos de balcão (passagem, lateral e bar)');
if (inventario.bebidas !== 1) problemas.push('o bar não tem a estante de bebidas');
// o balcão está em z = -2 e tem 0,5 de meia-espessura; o corpo tem 0,42 de raio
if (noBalcao[1] < -1.1) problemas.push(`o balcão de passagem deixou passar (foi até z ${noBalcao[1]})`);
if (peloVao[1] > -2.6) problemas.push(`o vão de serviço não deixa entrar na cozinha (parou em z ${peloVao[1]})`);
if (!/clube/i.test(promptDeVolta ?? '')) problemas.push('o prompt de voltar pro clube não apareceu');
if (cenaDeVolta !== 'clube') problemas.push(`a volta não levou para o clube (caiu em ${cenaDeVolta})`);
if (!noDiario) problemas.push('a memória da porta dos fundos não entrou no diário');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
