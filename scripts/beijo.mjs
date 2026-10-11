/**
 * Testa o beijo rápido da dupla: chegar de frente um para o outro, apertar E,
 * os dois se inclinam e sobem os coraçõezinhos.
 * Uso: node scripts/beijo.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './beijo';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// campo aberto do parque, longe de qualquer interativo que roube o E. Era
// `em=0,4` até a loja de patins chegar ali do lado: o E passou a alugar
// patins em vez de beijar, e o teste reprovava o beijo sem o beijo ter
// mudado. `0,10` é gramado livre (sem interação a menos de 3 m do raio dela)
await page.goto(`${BASE}/?cena=villa-lobos&em=0,10&olhar=0.785&zoom=5.5`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// anda na direção do parceiro até ficar cara a cara
for (const tecla of ['KeyA', 'KeyW']) {
  await page.keyboard.down(tecla);
  await page.waitForTimeout(460);
  await page.keyboard.up(tecla);
  await page.waitForTimeout(800);
}

// O beijo nao tem mais balao na tela — carinho nao se anuncia. Entao o teste
// pergunta ao jogo se o E vai virar beijo, em vez de procurar um prompt.
const daParaBeijar = () => page.evaluate(() => window.jogo.podeBeijar);
const antes = await daParaBeijar();
await page.screenshot({ path: `${OUT}-de-frente.png` });

await page.keyboard.press('KeyE');
/*
 * ESPERA POR CONDIÇÃO, NUNCA POR RELÓGIO: o Chromium daqui roda o tempo do
 * jogo umas cinco vezes mais devagar que o relógio de parede, e os 520 ms
 * fixos de antes fotografavam o começo do gesto — o teste reprovava o beijo
 * com o beijo funcionando. Agora espera os dois se inclinarem e os corações
 * subirem, com teto.
 */
const contarCoracoes = () => page.evaluate(() => {
  let n = 0;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.coracao) n++;
  });
  return n;
});
let inclinou = false;
for (let i = 0; i < 40 && !inclinou; i++) {
  await page.waitForTimeout(150);
  inclinou = await page.evaluate(() => window.jogo.player.rig.kissing);
}
await page.screenshot({ path: `${OUT}-beijo.png` });
let coracoes = 0;
for (let i = 0; i < 40 && coracoes < 2; i++) {
  await page.waitForTimeout(150);
  coracoes = await contarCoracoes();
}
await page.screenshot({ path: `${OUT}-coracao.png` });

console.log('de frente um para o outro:', antes);
console.log('os dois se inclinaram:', inclinou);
console.log('coraçõezinhos no ar:', coracoes);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

await browser.close();
process.exit(erros.length || !antes || !inclinou || coracoes < 2 ? 1 : 0);
