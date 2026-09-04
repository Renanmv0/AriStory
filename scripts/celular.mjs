/**
 * A interface no celular: tela estreita, dedo em vez de mouse.
 *
 * O que este teste garante: os botões redondos do canto **não cobrem texto** —
 * nem o prompt, nem a fala, nem os botões de escolha. Foi por isso que eles
 * encolheram, ficaram translúcidos e o balão de fala ganhou um corredor livre
 * na direita.
 *
 * E que cada botão do HUD FAZ o que promete — inclusive os dois de girar a
 * câmera, que no celular são o único caminho: o Q e o R não existem lá.
 *
 * E que cada botão do HUD ABRE o que promete. O 🎒 já abriu uma mochila sem
 * vaga nenhuma porque o desenho das vagas morava no caminho do teclado; no
 * computador estava certo e no celular não.
 *
 * Uso: node scripts/celular.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './celular';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
// um celular comum de pé; é o pior caso de espaço
const page = await browser.newPage({
  viewport: { width: 390, height: 780 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
});
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

/** quanto por cento da área de um elemento está atrás dos botões de toque */
const tapado = (seletor) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return null;
    const botoes = [...document.querySelectorAll('.touch button')].map((b) => b.getBoundingClientRect());
    const cruza = (a, b) => {
      const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return x * y;
    };
    const soma = botoes.reduce((s, b) => s + cruza(r, b), 0);
    return Math.round((soma / (r.width * r.height)) * 100);
  }, seletor);

// perto do sofá: aparece prompt, e o E abre a pergunta com botões
await page.goto(`${BASE}/?cena=casa&em=-0.4,1.6&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2800);
await page.screenshot({ path: `${OUT}-prompt.png` });
const noPrompt = await tapado('.prompt');

await page.keyboard.press('KeyE');
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-dialogo.png` });
const naFala = await tapado('.dialogue .text');
const nasEscolhas = await tapado('.escolhas');
const botoes = await page.locator('.touch button').count();

// tamanho e transparência dos botões, medidos e não no olho
const visual = await page.evaluate(() => {
  const b = document.querySelector('.touch .action-btn');
  return {
    largura: b.getBoundingClientRect().width,
    fundo: getComputedStyle(b).backgroundColor,
  };
});

// Girar a câmera pelo HUD, que no celular é o único caminho — sem teclado não
// há Q nem R. Mede a POSIÇÃO da câmera, e não só o clique: botão que dispara e
// não move nada passaria despercebido.
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
const ondeAcamera = () =>
  page.evaluate(() => {
    const c = window.jogo.iso.camera;
    return [+c.position.x.toFixed(2), +c.position.z.toFixed(2)];
  });
const camAntes = await ondeAcamera();
// 2,6 s por giro, e não 1,4: a câmera não salta para o ângulo novo, ela
// interpola até lá. Com 1,4 s a medida caía no meio do movimento e a volta ao
// ponto de partida dava 1,2 de sobra — o teste acusava um giro torto que não
// existe. Medido: em 2,5 s a diferença é 0,15, e em 4 s é 0,00.
await page.locator('.girar-btn.dir').tap();
await page.waitForTimeout(2600);
const camDepois = await ondeAcamera();
await page.locator('.girar-btn.esq').tap();
await page.waitForTimeout(2600);
const camVoltou = await ondeAcamera();
const girou = Math.hypot(camDepois[0] - camAntes[0], camDepois[1] - camAntes[1]);
const desfez = Math.hypot(camVoltou[0] - camAntes[0], camVoltou[1] - camAntes[1]);

// o menu e a lista de controles
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.click('.menu-btn');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-menu.png` });
await page.click('.menu .controles-btn');
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}-controles.png` });
const linhas = await page.locator('.menu .controles li').count();

/**
 * DOIS TOQUES NUM BOTÃO NÃO PODEM SELECIONAR NADA.
 *
 * No Safari do iPhone era isso que deixava a tela azul: o duplo toque disparava
 * o "selecionar palavra", a seleção se espalhava pelo bloco e só um toque fora
 * devolvia o jogo. Aqui o gesto entra como duplo clique, que é o equivalente do
 * Chromium — se a seleção sair vazia, é porque o `user-select: none` pegou.
 *
 * A segunda medida é o valor calculado do `-webkit-user-select`: é ele que o
 * Safari lê (a propriedade sem prefixo só vale de lá do 16.4 em diante), e era
 * justamente ele que faltava.
 */
const selecao = await page.evaluate(async () => {
  const alvo = document.querySelector('.menu-btn');
  const lido = (el, prop) => getComputedStyle(el).getPropertyValue(prop);
  const evento = (tipo) =>
    alvo.dispatchEvent(new MouseEvent(tipo, { bubbles: true, detail: 2 }));
  window.getSelection()?.removeAllRanges();
  evento('mousedown'); evento('mouseup'); evento('click');
  evento('mousedown'); evento('mouseup'); evento('click'); evento('dblclick');
  return {
    texto: (window.getSelection()?.toString() ?? '').trim(),
    corpo: lido(document.body, '-webkit-user-select') || lido(document.body, 'user-select'),
    botao: lido(alvo, '-webkit-user-select') || lido(alvo, 'user-select'),
    toque: lido(alvo, 'touch-action'),
  };
});

console.log('botões de toque:', botoes, `· ${Math.round(visual.largura)}px · ${visual.fundo}`);
console.log('duplo toque no HUD · selecionou:', JSON.stringify(selecao.texto),
  '· user-select corpo/botão:', selecao.corpo + '/' + selecao.botao,
  '· touch-action:', selecao.toque);
console.log('prompt tapado:', noPrompt + '%');
console.log('fala tapada:', naFala + '%');
console.log('botões de escolha tapados:', nasEscolhas + '%');
// o 🎒 abre a mochila DE VERDADE: painel na tela e todas as vagas desenhadas
// recarrega para sair do menu: na tela de controles o "voltar pro jogo" fica
// escondido, e com o menu aberto os botões de toque somem
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.locator('.bag-btn').tap();
await page.waitForTimeout(700);
const mochila = await page.evaluate(() => ({
  aberta: document.querySelector('.mochila')?.classList.contains('show') ?? false,
  vagas: document.querySelectorAll('.mochila .slot').length,
  // de mão + as 4 de vestimenta; deriva do jogo em vez de cravar o número
  esperadas: window.jogo.handItems().length + 4,
  altura: document.querySelector('.mochila .sheet')?.getBoundingClientRect().height ?? 0,
}));
await page.screenshot({ path: `${OUT}-mochila.png` });

console.log('girar pelo HUD · andou', girou.toFixed(1), 'e o outro botão desfez para', desfez.toFixed(1));
console.log('🎒 abriu a mochila:', mochila.aberta, '· vagas desenhadas:', mochila.vagas);
console.log('linhas na tela de controles:', linhas);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const opacidade = Number(/[\d.]+\)$/.exec(visual.fundo)?.[0]?.replace(')', '') ?? '1');
const ok =
  !erros.length &&
  botoes === 6 && // ✨ 🔁 🎒 📖 e os dois de girar
  visual.largura <= 64 &&
  opacidade <= 0.7 && // translúcido, não opaco
  noPrompt === 0 &&
  naFala === 0 &&
  nasEscolhas === 0 &&
  linhas >= 10 &&
  mochila.aberta &&
  mochila.vagas === mochila.esperadas &&
  // um botão gira de verdade e o outro traz de volta ao ponto de partida
  girou > 5 &&
  desfez < 1 &&
  // e o duplo toque não seleciona nada — o bug da tela azul no iPhone
  selecao.texto === '' &&
  selecao.corpo === 'none' &&
  selecao.botao === 'none' &&
  selecao.toque === 'manipulation';

await browser.close();
process.exit(ok ? 0 : 1);
