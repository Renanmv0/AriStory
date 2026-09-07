/**
 * A PRAÇA DE GELO do quiosque do Mano, no Villa-Lobos.
 *
 * Duas coisas para conferir aqui, e as duas precisam de olho na foto:
 *
 *  1. A ARENA ESTÁ LIVRE. O quiosque foi para a ponta de -Z e as quatro
 *     mesinhas ficam nos quadrantes da frente. Se alguma peça voltar para o
 *     meio, a praça deixa de ser praça.
 *  2. O GUARDA-SOL NÃO TAPA A MESA. Ele é baixo (2,05 no topo) exatamente por
 *     isso: a câmera olha em 34°, e lona alta come o tampo e a cadeira de quem
 *     está atrás dela.
 *
 * O que dá para medir sem olho, o teste mede: as peças que têm que estar na
 * cena, e o console limpo.
 *
 * Uso: node scripts/gelo.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './gelo';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const poses = [
  // a praça inteira, no enquadramento com que o jogo nasce
  ['toda', 'em=13.8,20.4&olhar=3.14'],
  // de quem entra pelo vão da borda, vindo do portão do parque
  ['entrada', 'em=13.8,26&olhar=3.14'],
  // de perto: a mesinha, o boneco de neve e o cristal
  ['mesas', 'em=16.6,23.8&olhar=3.14&zoom=7'],
];
for (const [nome, query] of poses) {
  await page.goto(`${BASE}/?cena=villa-lobos&${query}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
  // uma volta de câmera: o lado de trás das peças só aparece girando
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-${nome}-giro.png` });
}

/** quantas cópias de cada peça a cena montou */
const contagem = await page.evaluate(() => {
  const conta = {};
  window.jogo.scene.traverse((o) => {
    const p = o.userData?.peca;
    if (p) conta[p] = (conta[p] ?? 0) + 1;
  });
  return conta;
});

const ESPERADO = {
  quiosque: 1,
  'mesa-de-sorveteria': 4,
  // duas por mesinha
  'cadeirinha-de-sorveteria': 8,
  'poste-de-gelo': 3,
  'boneco-de-neve': 1,
  'cristal-de-gelo': 4,
  // duas laterais, o fundo, os dois pedaços da frente (o vão fica no meio) e as quatro quinas
  'borda-de-gelo': 9,
};
for (const [peca, quantas] of Object.entries(ESPERADO)) {
  if ((contagem[peca] ?? 0) !== quantas) {
    erros.push(`${peca}: esperava ${quantas}, achei ${contagem[peca] ?? 0}`);
  }
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'praça montada, sem erros');
await browser.close();
process.exit(erros.length ? 1 : 0);
