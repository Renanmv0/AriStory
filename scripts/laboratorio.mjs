/**
 * O LABORATÓRIO — o mundo dentro do computador do Ari, a área de teste das
 * skills de Three.js.
 *
 * O que este teste guarda, de ponta a ponta:
 * - a ENTRADA: o computador do quarto abre a pasta, a câmera vai para trás dos
 *   dois, eles são sugados pela tela e a cena troca para o laboratório;
 * - a CHEGADA: os dois caem do céu no pouso, juntos, e o controle volta;
 * - o PÓS-PROCESSAMENTO: o brilho já vem ligado, e a mesa de controle passa
 *   pelos dez filtros — cada um com os passes certos na fila (foto de cada);
 * - o MOUSE: passar em cima de um cristal acende ele e mostra a dica; clicar
 *   toca o som; a bola de praia é arrastada e rola; clicar na água solta a
 *   pedrinha;
 * - os experimentos que mudam de estado: o presente desmancha e volta, o
 *   arame dos triângulos liga, o holofote troca de modo, o dia passa e a
 *   noite volta, o drone pega e devolve a câmera;
 * - a SAÍDA: o portal suga os dois e eles saem pela tela do quarto, de pé na
 *   frente da escrivaninha.
 *
 * Uso: node scripts/laboratorio.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './laboratorio';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error' && !/fonts\.g|ERR_CERT|ERR_NAME|ERR_INTERNET|net::/.test(m.text())) erros.push(m.text());
});
// do zero: o teste confere as conversas de primeira vez
await page.addInitScript(() => localStorage.clear());

const resultados = [];
const conferir = (nome, ok, detalhe = '') => {
  resultados.push({ nome, ok, detalhe });
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
};

/** espera uma condição (avaliada na página), com teto em segundos */
const esperar = async (fn, teto = 60, arg = undefined) => {
  const fim = Date.now() + teto * 1000;
  while (Date.now() < fim) {
    if (await page.evaluate(fn, arg)) return true;
    await page.waitForTimeout(250);
  }
  return false;
};
const cena = () => page.evaluate(() => window.jogo.current.def.id);
const temFala = () => page.evaluate(() => !!document.querySelector('.dialogue.show'));
const temEscolha = () => page.evaluate(() => document.querySelectorAll('.escolhas button').length > 0);
const prompt = () => page.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? null);
const foto = (nome) => page.screenshot({ path: `${OUT}-${nome}.png` });

/** avança as falas; se aparecer pergunta, escolhe `indice` e para */
const conversar = async (indice = null, voltas = 24) => {
  for (let i = 0; i < voltas; i++) {
    if (await temEscolha()) {
      if (indice === null) return true;
      for (let n = 0; n < indice; n++) await page.keyboard.press('ArrowRight');
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(400);
      return true;
    }
    if (!(await temFala())) return false;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
  }
  return false;
};
/** espera a fala aparecer (ou não) e passa tudo */
const passarFalas = async (espera = 4) => {
  await esperar(() => !!document.querySelector('.dialogue.show'), espera);
  await conversar(null);
};

const ir = (x, z, olhar = Math.PI / 4) =>
  page.evaluate(([x, z, o]) => window.jogo.debugPlace(x, z, o), [x, z, olhar]);
const lab = (expr) => page.evaluate(`(() => { const L = window.jogo.current.world.root.userData.laboratorio; return ${expr}; })()`);
const som = (nome) => page.evaluate((n) => window.jogo.audio.contagem.get(n) ?? 0, nome);

/** a posição na TELA (px) de um ponto do mundo pendurado num objeto do laboratório */
const naTela = (expr, altura = 0) =>
  page.evaluate(([expr, altura]) => {
    const L = window.jogo.current.world.root.userData.laboratorio;
    const obj = new Function('L', `return ${expr}`)(L);
    const p = obj.getWorldPosition(obj.position.clone());
    p.y += altura;
    p.project(window.jogo.iso.camera);
    const r = document.querySelector('canvas').getBoundingClientRect();
    return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
  }, [expr, altura]);

// =========================================================== 1. a entrada
await page.goto(`${BASE}/?cena=quarto&em=-2.25,1.95&olhar=-1.57`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await foto('01-quarto-computador');
conferir('o computador do quarto oferece entrar', (await prompt()) === 'Usar o computador', String(await prompt()));

await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
await conversar(0); // as falas da escrivaninha e a pergunta: "Abrir"
const cameraTrocou = await esperar(() => window.jogo.cameraDeCena() !== null, 15);
conferir('a câmera passa para trás dos dois', cameraTrocou);
await page.waitForTimeout(1500);
await foto('02-pasta-abrindo');
await page.waitForTimeout(3500);
await foto('03-sugados');
const entrou = await esperar(() => window.jogo.current.def.id === 'laboratorio', 120);
conferir('a dupla atravessa para o laboratório', entrou, await cena());

// ============================================================ 2. a chegada
const chegou = await esperar(() => !!document.querySelector('.dialogue.show') || !window.jogo.player.locked, 120);
await foto('04-chegada');
conferir('a chegada termina com a conversa', chegou);
await conversar(null);
const pousados = await page.evaluate(() => {
  const a = window.jogo.playerPosition();
  const b = window.jogo.companionPosition();
  return { a: [a.x, a.z], b: [b.x, b.z], solto: !window.jogo.player.locked };
});
const noPouso = (p) => Math.hypot(p[0], p[1] - 1.6) < 0.7;
conferir('os dois pousam juntos no pouso', noPouso(pousados.a) && noPouso(pousados.b) && pousados.solto, JSON.stringify(pousados));
const memoria = await page.evaluate(() => JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories?.some((m) => m.id === 'dentro-do-computador'));
conferir('a memória "Dentro do computador" entra no diário', !!memoria);
const passes0 = await page.evaluate(() => window.jogo.efeitosDeTela().passes.join(','));
conferir('o brilho neon já vem ligado', passes0 === 'cena,brilho,saida', passes0);
await foto('05-praca');

// ====================================================== 3. os dez filtros
const FILTROS = [
  ['pixel-art', 'pixel,brilho,saida'],
  ['contorno', 'cena,contorno,brilho,saida'],
  ['rastro', 'cena,rastro,brilho,saida'],
  ['filme-antigo', 'cena,sepia,grao,saida'],
  ['quadrinho', 'cena,quadrinho,saida'],
  ['monitor', 'cena,brilho,monitor,saida'],
  ['lente', 'cena,brilho,lente,saida'],
  ['glitch', 'cena,brilho,glitch,saida'],
  ['sem-filtro', ''],
  ['neon', 'cena,brilho,saida'],
];
await ir(4.25, 3.85, -2.36);
await page.waitForTimeout(1200);
conferir('a mesa de controle troca o filtro', (await prompt()) === 'Trocar o filtro da tela', String(await prompt()));
for (const [nome, esperado] of FILTROS) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
  await conversar(null);
  await page.waitForTimeout(1600);
  const passes = await page.evaluate(() => window.jogo.efeitosDeTela().passes.join(','));
  await foto(`06-filtro-${nome}`);
  conferir(`filtro ${nome}`, passes === esperado, passes || '(renderer.render puro)');
}

// ========================================================= 4. o mouse
await ir(0.4, 12.6);
await page.waitForTimeout(1800);
const cristal = await naTela('L.xilo.cristais[3].obj', 1.2);
await page.mouse.move(cristal.x, cristal.y);
const acendeu = await esperar(() => {
  const L = window.jogo.current.world.root.userData.laboratorio;
  return L.xilo.cristais[3].aceso;
}, 8);
const dica = await page.evaluate(() => document.querySelector('.dica-3d.show')?.textContent ?? null);
await foto('07-mouse-no-cristal');
conferir('passar o mouse acende o cristal e mostra a dica', acendeu && !!dica && dica.startsWith('Cristal'), String(dica));
const somAntes = await som('arcoIris');
const toquesAntes = await lab('L.xilo.cristais[3].toques');
await page.mouse.down();
await page.mouse.up();
await page.waitForTimeout(500);
conferir(
  'clicar no cristal toca o som dele',
  (await som('arcoIris')) > somAntes && (await lab('L.xilo.cristais[3].toques')) > toquesAntes,
);
await page.mouse.move(20, 600);
await page.waitForTimeout(400);
conferir('tirar o mouse apaga o cristal', !(await lab('L.xilo.cristais[3].aceso')));

const bolaAntes = await lab('[L.praia.grupo.position.x, L.praia.grupo.position.z]');
const bola = await naTela('L.praia.grupo', 0.42);
await page.mouse.move(bola.x, bola.y);
await page.waitForTimeout(400);
await page.mouse.down();
for (let i = 1; i <= 8; i++) {
  await page.mouse.move(bola.x - i * 14, bola.y + i * 6);
  await page.waitForTimeout(120);
}
await page.mouse.up();
await page.waitForTimeout(500);
const bolaDepois = await lab('[L.praia.grupo.position.x, L.praia.grupo.position.z]');
await foto('08-bola-arrastada');
const andou = Math.hypot(bolaDepois[0] - bolaAntes[0], bolaDepois[1] - bolaAntes[1]);
conferir('arrastar a bola leva ela junto', andou > 0.6, `${andou.toFixed(2)} m`);

await ir(-9.0, 3.0);
await page.waitForTimeout(1800);
const pingoAntes = await som('pingo');
const agua = await naTela('L.shaders.lagoMalha', 0);
await page.mouse.click(agua.x, agua.y);
await page.waitForTimeout(900);
await foto('09-pedrinha');
conferir('clicar na água solta uma pedrinha', (await som('pingo')) > pingoAntes);

// =========================================== 5. os experimentos com estado
await ir(-8.0, -0.6, -2.36);
await page.waitForTimeout(1200);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
await conversar(null);
const desmanchando = await esperar(() => window.jogo.current.world.root.userData.laboratorio.shaders.progressoDoPresente > 0.45, 60);
await foto('10-presente-desmanchando');
const aberto = await esperar(() => window.jogo.current.world.root.userData.laboratorio.shaders.progressoDoPresente > 0.99, 60);
await foto('11-presente-aberto');
const refeito = await esperar(() => window.jogo.current.world.root.userData.laboratorio.shaders.progressoDoPresente === 0, 150);
conferir('o presente desmancha, abre e se refaz', desmanchando && aberto && refeito);

await ir(-10.4, 10.9, -2.36);
await page.waitForTimeout(1200);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
await conversar(null);
await page.waitForTimeout(800);
await foto('12-triangulos');
conferir('o arame dos triângulos liga', await lab('L.geo.triangulosVisiveis'));

await ir(1.2, -9.0, -2.36);
await page.waitForTimeout(1200);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
await conversar(null);
await page.waitForTimeout(1500);
await foto('13-holofote');
conferir('o palco passa para o holofote', (await lab('L.show.modo')) === 'holofote');

await ir(4.9, -8.1, -2.36);
await page.waitForTimeout(1200);
conferir('o relógio de sol oferece o dia', (await prompt()) === 'Passar um dia inteiro', String(await prompt()));
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
await conversar(null);
// o sol já está no alto em 1/8 do dia; o resto do dia o teste PULA: são
// dezesseis segundos de JOGO, e no Chromium de teste, com o laboratório
// inteiro desenhando, o relógio de jogo anda a uma fração do de parede
const meioDia = await esperar(() => (window.jogo.current.world.root.userData.laboratorio.dia ?? 0) > 0.12, 90);
const solForte = await page.evaluate(() => window.jogo.sun.intensity);
await foto('14-meio-dia');
await page.evaluate(() => window.jogo.current.world.root.userData.laboratorio.pularDiaPara(0.97));
const noite = await esperar(() => window.jogo.current.world.root.userData.laboratorio.dia === null, 120);
const solDeNoite = await page.evaluate(() => window.jogo.sun.intensity);
conferir('o dia passa e a noite volta', meioDia && solForte > 1.2 && noite && Math.abs(solDeNoite - 0.8) < 1e-6, `${solForte.toFixed(2)} → ${solDeNoite}`);

await ir(-2.0, 13.6, -2.36);
await page.waitForTimeout(1200);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
await conversar(null);
await esperar(() => document.querySelectorAll('.escolhas button').length > 0, 10);
const droneNoAr = await page.evaluate(() => window.jogo.drone !== null);
await page.mouse.move(300, 250);
await page.mouse.down();
for (let i = 1; i <= 10; i++) {
  await page.mouse.move(300 + i * 22, 250 + i * 4);
  await page.waitForTimeout(80);
}
await page.mouse.up();
await page.waitForTimeout(1500);
await foto('15-drone');
await conversar(0);
await page.waitForTimeout(600);
const droneVoltou = await page.evaluate(() => window.jogo.drone === null && !window.jogo.player.locked);
conferir('o drone pega a câmera e devolve', droneNoAr && droneVoltou);

// ============================================================== 6. a saída
await ir(-1.3, -1.3, -2.36);
await page.waitForTimeout(1200);
conferir('o portal oferece a saída', (await prompt()) === 'Sair do computador', String(await prompt()));
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
await conversar(0);
await page.waitForTimeout(2500);
await foto('16-portal');
const voltou = await esperar(() => window.jogo.current.def.id === 'quarto', 120);
conferir('o portal leva de volta pro quarto', voltou, await cena());
const pousou = await esperar(() => !!document.querySelector('.dialogue.show') || !window.jogo.player.locked, 90);
await page.waitForTimeout(400);
await foto('17-de-volta-no-quarto');
await conversar(null);
const deVolta = await page.evaluate(() => {
  const a = window.jogo.playerPosition();
  const b = window.jogo.companionPosition();
  return { a: [a.x, a.z], b: [b.x, b.z], solto: !window.jogo.player.locked };
});
conferir(
  'os dois saem da tela e ficam de pé na frente da escrivaninha',
  pousou && Math.hypot(deVolta.a[0] + 1.9, deVolta.a[1] - 1.45) < 0.4 && Math.hypot(deVolta.b[0] + 1.75, deVolta.b[1] - 2.45) < 0.6 && deVolta.solto,
  JSON.stringify(deVolta),
);

conferir('sem erro de console', erros.length === 0, erros.slice(0, 5).join(' | '));
await browser.close();
const falhas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} ok`);
process.exit(falhas.length ? 1 : 0);
