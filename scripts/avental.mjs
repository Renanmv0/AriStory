/**
 * O AVENTAL DO MANIA É ACESSÓRIO (pedido do Renan: usar com outras roupas).
 *
 * - a ficha mora na vaga do acessório, preso no corpo;
 * - ele veste JUNTO com uma peça de tronco (o colete, a camisa listrada, o
 *   vestido rosa) — nenhuma tira a outra;
 * - save antigo com o avental na vaga do TRONCO abre com ele no acessório;
 * - e fotos: o avental por cima do colete, da camisa e do vestido, de frente
 *   e de lado, e andando (a saia viva acompanha a perna).
 *
 * Uso: node scripts/avental.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './avental';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
const falhas = [];
const checar = (ok, msg) => { if (!ok) falhas.push(msg); };
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// 1. o save antigo: avental na vaga do tronco (a 1), o resto vazio
await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.evaluate((k) => {
  const avental = { id: 'avental-do-mania', nome: 'Avental de garçom do Mania', icone: '🍽️', tipo: 'vestivel', slot: 'tronco' };
  const inv = { mao: [], vestiveis: [null, avental, null, null, null, null], ativo: 0, acervo: [] };
  localStorage.setItem(k, JSON.stringify({ flags: {}, stats: {}, inventarios: { ari: inv, renan: inv } }));
}, SAVE);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });
await page.waitForTimeout(1500);
await page.mouse.click(500, 440);
const migrado = await page.evaluate(() => window.jogo.wearables().map((i) => i?.id ?? null));
checar(migrado[5] === 'avental-do-mania' && migrado[1] === null, `o save antigo devia mudar o avental para o acessorio: ${JSON.stringify(migrado)}`);

// 2. vestir junto com cada peça de tronco, nos dois
const combinar = async (tronco) => page.evaluate((id) => {
  const j = window.jogo;
  const I = window.aristoryItens;
  for (const quem of [j.playerId(), j.companionId()]) {
    j.unequipWearable(1, quem); // a peça de tronco da volta anterior
    j.equipWearable(I['avental-do-mania'], quem);
    j.equipWearable(I[id], quem);
  }
  return [j.playerId(), j.companionId()].map((q) => j.wearables(q).map((i) => i?.id ?? null));
}, tronco);

const foto = async (nome, giro = 0, zoom = 4.2) => {
  await page.evaluate(([f, z]) => {
    const j = window.jogo;
    j.debugPlace(0, 2, f);
    j.setZoom(z);
    j.focusCamera(null);
  }, [giro, zoom]);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
};

for (const tronco of ['colete-de-garcom', 'camisa-listrada', 'vestido-rosa']) {
  const vestidos = await combinar(tronco);
  for (const v of vestidos) {
    checar(v[1] === tronco && v[5] === 'avental-do-mania', `${tronco} e o avental deviam vestir juntos: ${JSON.stringify(v)}`);
  }
  await foto(tronco, 0.6);
  await foto(`${tronco}-perto`, 0.6, 2.2);
  if (tronco === 'colete-de-garcom') await foto(`${tronco}-lado`, 2.2);
}

// 3. andando: a saia viva continua acompanhando a perna como acessório
await page.evaluate(() => {
  window.jogo.unequipWearable(1);
  window.jogo.equipWearable(window.aristoryItens['colete-de-garcom']);
});
await page.keyboard.down('KeyD');
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-andando.png` });
await page.keyboard.up('KeyD');

falhas.push(...erros);
console.log('save antigo:', JSON.stringify(migrado));
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
