/**
 * Teste da cutscene da roda gigante: entra na cabine, atravessa os dialogos e
 * confere que o jogador volta para o chao com o controle liberado.
 * Uso: node scripts/ride.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './ride';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&entrada=roda`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const dialogoAberto = () => page.locator('.dialogue.show').count().then((n) => n > 0);

const memorias = () =>
  page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories?.length ?? 0;
    } catch {
      return -1;
    }
  });

/*
 * A CATRACA COBRA: sem bilhete na mochila a roda recusa. O teste prova as duas
 * metades — primeiro esbarra na recusa, depois compra (direto pela carteira,
 * que a bilheteria fica do outro lado do lago) e sobe.
 */
await page.keyboard.press('KeyE');
for (let i = 0; i < 12; i++) {
  if (await dialogoAberto()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(200);
}
const recusouSemBilhete = (await memorias()) === 0;

await page.evaluate(() => {
  const itens = window.aristoryItens;
  window.jogo.addItem(itens['bilhete-roda']);
});
await page.waitForTimeout(400);

await page.keyboard.press('KeyE'); // embarca

/*
 * A volta e LENTA de proposito (~45s de tempo de jogo), e no Chromium headless
 * o tempo de jogo anda mais devagar que o relogio. Por isso o laco e longo e
 * espera por EVENTO (a memoria salva no fim), nunca por tempo.
 *
 * De quebra ele olha em volta: a cabine devolve o manche como olhar, entao as
 * setas tem que mexer a camera mesmo com o jogador travado e com fala na tela.
 */
const alturaDaCamera = () =>
  page.evaluate(() => {
    const c = window.jogo.cameraDeCena?.();
    return c ? [c.position.y, c.rotation.y] : null;
  });

let subiu = false;
let primeiraPessoa = false;
let olhouEmVolta = false;
let giroInicial = null;
let subindo = null;
for (let i = 0; i < 620; i++) {
  if (await dialogoAberto()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(250);

  const cam = await alturaDaCamera();
  if (cam) {
    primeiraPessoa = true;
    if (giroInicial === null) giroInicial = cam[1];
    else if (Math.abs(cam[1] - giroInicial) > 0.25) olhouEmVolta = true;
    if (subindo === null && cam[0] > 6) {
      subindo = cam[0];
      await page.screenshot({ path: `${OUT}-cabine.png` });
    }
    // olhar para os lados: 10 quadros para um lado, 10 para o outro
    await page.keyboard.down(i % 40 < 20 ? 'ArrowLeft' : 'ArrowRight');
    await page.waitForTimeout(120);
    await page.keyboard.up(i % 40 < 20 ? 'ArrowLeft' : 'ArrowRight');
    if (cam[0] > 20) await page.screenshot({ path: `${OUT}-alto.png` });
  }

  if (i === 20) await page.screenshot({ path: `${OUT}-subindo.png` });
  if ((await memorias()) >= 1 && !(await dialogoAberto())) {
    subiu = true;
    break;
  }
}
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}-fim.png` });

// a camera de cena tem que ter sido DEVOLVIDA: no chao volta a isometrica
const voltouAIsometrica = (await alturaDaCamera()) === null;

// o passeio terminou? o prompt tem que voltar e o jogador andar de novo
const promptVisivel = (await page.locator('.prompt.show').count()) > 0;
const total = await memorias();

// o bilhete e picotado na entrada: nao pode sobrar na mochila
const bilheteGasto = await page.evaluate(() => {
  const j = window.jogo;
  return !j.hasItem('bilhete-roda') && !j.hasItem('bilhete-roda', j.companionId());
});

console.log('recusou sem bilhete:', recusouSemBilhete);
console.log('bilhete picotado:', bilheteGasto);
console.log('primeira pessoa na cabine:', primeiraPessoa, '· altura maxima vista:', subindo);
console.log('olhou em volta com as setas:', olhouEmVolta);
console.log('camera devolvida no chao:', voltouAIsometrica);
console.log('passeio concluido:', subiu);
console.log('prompt de volta:', promptVisivel);
console.log('memorias salvas:', total);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
await browser.close();
process.exit(
  erros.length ||
    !subiu ||
    !promptVisivel ||
    !recusouSemBilhete ||
    !bilheteGasto ||
    !primeiraPessoa ||
    !olhouEmVolta ||
    !voltouAIsometrica
    ? 1
    : 0,
);
