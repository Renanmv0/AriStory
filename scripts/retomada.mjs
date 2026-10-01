/**
 * O PONTO DE RETORNO DA RODADA DO JARDIM — a página recarrega no meio da
 * rodada (o celular do Ari descarta a aba) e a dupla continua da onda em que
 * estava, com todas as cartas valendo.
 *
 * O que o teste cobra:
 *
 * 1. uma rodada com cartas que deixam coisa no chão (toldo, cerca viva,
 *    pimenta, dioneia, portão emperrado, segundo tonel, picolé), que chamam
 *    gente (o Capy) e que soltam o parceiro (Os dois na frente) chega na
 *    onda 2, e o ponto de retorno fica no save com a onda 2;
 * 2. a página RECARREGA de verdade; a Josefina pergunta se continuam, com a
 *    onda certa, e "Continuar" liga a rodada na onda 2;
 * 3. A FICHA É A MESMA: todo número e toda regra das cartas, comparados
 *    campo a campo com a de antes do reload — e a mão na mesma ordem;
 * 4. o chão também: os canteiros com a mesma vida, cerca, toldo, pimenta e
 *    dioneia; o mesmo portão emperrado; as mesmas peças; o Capy no posto;
 *    o mesmo roteiro da onda (a semente e o grito do Noel);
 * 5. a conta continua: nível, gotas e espantados;
 * 6. a rodada que ACABA apaga o ponto; "Começar do zero" também apaga.
 *
 * Uso: node scripts/retomada.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './retomada';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const KEY = 'aristory.save.v1';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 760 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
// (as fontes do Google não carregam no sandbox: recurso que falta não é erro do jogo)
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erros.push('CONSOLE: ' + m.text()); });
const problemas = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) problemas.push(msg);
};

const esperar = async (fn, segundos = 30) => {
  for (let i = 0; i < segundos * 4; i++) {
    if (await page.evaluate(fn).catch(() => false)) return true;
    await page.waitForTimeout(250);
  }
  return false;
};

/** tudo o que o teste compara: a ficha inteira, a mão, o chão e a conta */
const retrato = () => page.evaluate(() => {
  const r = window.jogo.current.world.root.userData.rodada;
  const e = r.estado();
  const f = r.ficha;
  const ficha = {};
  for (const [k, v] of Object.entries(f)) {
    if (typeof v === 'function') continue;
    ficha[k] = v instanceof Set ? [...v].sort() : v;
  }
  return {
    onda: e.onda,
    mao: e.mao,
    nivel: e.nivel,
    juntadas: e.juntadas,
    espantados: e.espantados,
    emperrado: e.emperrado,
    segundoTonel: e.segundoTonel,
    picole: !!e.picole,
    arma: e.arma,
    ficha: JSON.stringify(ficha),
    canteiros: e.canteiros.map((c) => ({
      vida: +(c.vida / c.vidaMax).toFixed(3), vidaMax: +c.vidaMax.toFixed(3),
      protegido: c.protegido, cerca: +(c.vidaMax ? c.cerca / c.vidaMax : 0).toFixed(3),
      toldo: c.toldo, pimenta: c.pimenta, carnivora: c.carnivora,
    })),
    plano: r.plano.map((p) => `${p.praga}@${p.porta}@${p.t.toFixed(2)}`),
    pecas: r.pecasDasCartas.length,
    capy: r.planta.elenco.presente('capy'),
    parceiroSolto: r.parceiroSolto,
    regadores: [...r.regadoresDados],
  };
});

const pontoNoSave = () => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? '{}').retomadas?.jardim ?? null, KEY);

// ============================================= 1. uma rodada cheia de cartas
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.evaluate((k) => localStorage.removeItem(k), KEY);
await page.evaluate(() => {
  window.jogo.setFlag('adubo-entregue');
  window.jogo.setFlag('jardim.convite');
});
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await esperar(() => !!window.jogo?.current?.world?.root?.userData?.rodada);
await page.evaluate(async () => {
  const d = window.jogo.current.world.root.userData;
  const r = d.rodada;
  r.escolhaForcada = 0;
  d.comecarRodada(['chama-capy', 'os-dois-na-frente', 'segundo-tonel']);
  r.escalaDoTempo = 3;
  // as cartas de canteiro, cada uma num canteiro diferente
  const cartas = [
    ['bico-1'], ['bico-2'], ['tanque-1'], ['jato-1'], ['gota-gelada'], ['segundo-bico'], ['garoa'],
    ['picole-do-mano'], ['noel-avisa'], ['sementeira'], ['dedo-verde'],
    ['toldo', 0], ['cerca-viva', 1], ['canteiro-de-pimenta', 2], ['planta-carnivora', 3], ['portao-emperrado'],
  ];
  for (const [id, onde] of cartas) {
    if (onde !== undefined) r.escolhaForcada = onde;
    await r.pegarCarta(id, 99);
  }
  // a conta: um nível alto (para nenhuma tela abrir), gotas, um canteiro ferido e um comido
  r.fixarNivel(40);
  r.darGotas(55);
  r.ferirCanteiro(4, 0.4);
  r.ferirCanteiro(5, 0);
  r.espantados = 17;
  r.espantadosPorPraga = { lagartejo: 17 };
  // a onda 1 acaba: ninguém falta entrar, nenhum bicho
  r.plano = [];
  r.limparBichos();
  // a dupla longe do picolé, para ele ficar no chão
  window.jogo.debugPlace(-6, 6, Math.PI);
});
ok(await esperar(() => window.jogo.current.world.root.userData.rodada.estado().onda === 2, 60), 'a rodada passou para a onda 2');
await page.waitForTimeout(600);
const antes = await retrato();
const ponto = await pontoNoSave();
ok(ponto?.onda === 2, `o ponto de retorno ficou no save com a onda 2 (${ponto?.onda})`);
ok(antes.mao.length >= 18, `a mão tem as cartas pegas (${antes.mao.length}: ${antes.mao.join(', ')})`);
ok(antes.canteiros.some((c) => c.toldo) && antes.canteiros.some((c) => c.protegido)
  && antes.canteiros.some((c) => c.pimenta) && antes.canteiros.some((c) => c.carnivora), 'toldo, cerca, pimenta e dioneia estão nos canteiros');
ok(antes.emperrado !== null && antes.segundoTonel && antes.picole, 'o portão emperrou, o segundo tonel e o picolé estão no chão');
await page.screenshot({ path: `${OUT}-antes.png` });

// ============================================= 2. recarrega no meio da onda 2
await page.waitForTimeout(1500);
await page.reload({ waitUntil: 'networkidle' });
await esperar(() => !!window.jogo?.current?.world?.root?.userData?.rodada);
ok(await page.evaluate(() => window.jogo.current.def.id ?? window.jogo.save.scene) !== null, 'a página voltou');
ok(!(await page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado().rodando)), 'depois do reload nenhuma rodada roda sozinha');

const prompt = async () => ((await page.locator('.prompt.show').count()) ? page.locator('.prompt .label').textContent() : '');
const josefina = () => page.evaluate(() => {
  let j = null;
  window.jogo.current.world.root.traverse((o) => { if (!j && o.userData?.peca === 'josefina') j = o; });
  return j ? { x: j.position.x, z: j.position.z } : null;
});
const esperarPergunta = async (segundos = 20) => {
  for (let i = 0; i < segundos * 2; i++) {
    const n = await page.locator('.dialogue .escolhas button').count();
    if (n) return page.locator('.dialogue .escolhas button').allTextContents();
    if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
    await page.waitForTimeout(500);
  }
  return null;
};
const falarComEla = async () => {
  // ela atravessa a soleira e passeia (devagar: o Chromium sem tela anda a
  // ~1/5 do relógio): espera ela estar dentro
  for (let t = 0; t < 120; t++) {
    const j = await josefina();
    if (j && j.z < 7) break;
    await page.waitForTimeout(500);
  }
  for (let t = 0; t < 10; t++) {
    const j = await josefina();
    await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI), [j.x, j.z - 1.1]);
    await page.waitForTimeout(700);
    if (/josefina/i.test(await prompt())) break;
  }
  await page.keyboard.press('KeyE');
  return esperarPergunta();
};

let opcoes = await falarComEla();
ok(!!opcoes && opcoes.length === 3 && /continuar da onda 2/i.test(opcoes[0]) && /zero/i.test(opcoes[1]),
  `a Josefina oferece continuar da onda 2 (${opcoes?.join(' | ')})`);
await page.screenshot({ path: `${OUT}-pergunta.png` });
await page.locator('.dialogue .escolhas button').first().click();
/** vence as falas dos postos até a rodada ligar */
const esperarRodada = async () => {
  for (let i = 0; i < 80; i++) {
    if (await page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado().rodando)) return true;
    if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
    await page.waitForTimeout(500);
  }
  return false;
};
const ligou = await esperarRodada();
ok(ligou, 'a rodada continuou');
await page.waitForTimeout(1500);
const depois = await retrato();

// ============================================= 3-5. tudo igual
ok(depois.onda === 2, `continuou na onda 2 (${depois.onda})`);
ok(depois.arma === antes.arma, `a mesma arma (${depois.arma})`);
ok(JSON.stringify(depois.mao) === JSON.stringify(antes.mao), 'a mão é a mesma, na mesma ordem');
ok(depois.ficha === antes.ficha, 'a ficha da rodada é a mesma: todo número e toda regra das cartas');
if (depois.ficha !== antes.ficha) {
  const a = JSON.parse(antes.ficha);
  const b = JSON.parse(depois.ficha);
  for (const k of Object.keys(a)) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) console.log('   ficha.', k, JSON.stringify(a[k]), '→', JSON.stringify(b[k]));
}
ok(JSON.stringify(depois.canteiros) === JSON.stringify(antes.canteiros), 'os canteiros iguais: vida, cerca, toldo, pimenta e dioneia');
if (JSON.stringify(depois.canteiros) !== JSON.stringify(antes.canteiros)) {
  antes.canteiros.forEach((c, i) => {
    if (JSON.stringify(c) !== JSON.stringify(depois.canteiros[i])) console.log('   canteiro', i, JSON.stringify(c), '→', JSON.stringify(depois.canteiros[i]));
  });
}
ok(depois.emperrado === antes.emperrado, `o mesmo portão emperrado (${depois.emperrado})`);
ok(depois.segundoTonel && depois.picole, 'o segundo tonel e o picolé voltaram');
ok(depois.pecas === antes.pecas, `as mesmas peças das cartas no chão (${antes.pecas} → ${depois.pecas})`);
ok(depois.capy, 'o Capy está na estufa, no posto');
ok(depois.parceiroSolto, 'o parceiro está solto com o outro regador (Os dois na frente)');
ok(depois.regadores.length === antes.regadores.length, `o regador dado pela rodada continua anotado para sair no fim (${depois.regadores})`);
ok(JSON.stringify(depois.plano) === JSON.stringify(antes.plano), `o mesmo roteiro da onda (${depois.plano.length} bichos)`);
ok(depois.nivel === antes.nivel && depois.juntadas === antes.juntadas, `o mesmo nível e as mesmas gotas (${depois.nivel}, ${depois.juntadas})`);
ok(depois.espantados === antes.espantados, `os espantados continuam contando (${depois.espantados})`);
await page.screenshot({ path: `${OUT}-depois.png` });

// ============================================= 6. acabou: o ponto some
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.terminar('fim'));
await page.waitForTimeout(400);
ok((await pontoNoSave()) === null, 'a rodada que acaba apaga o ponto de retorno');
// "Começar do zero" também apaga: um ponto plantado, a página de novo, e a resposta do meio
await page.evaluate((p) => window.jogo.guardarRetomada('jardim', p), ponto);
await page.reload({ waitUntil: 'networkidle' });
await esperar(() => !!window.jogo?.current?.world?.root?.userData?.rodada);
opcoes = await falarComEla();
ok(!!opcoes && opcoes.length === 3, 'com um ponto guardado, a pergunta volta a ter três respostas');
await page.locator('.dialogue .escolhas button').nth(1).click();
await esperarRodada();
const zero = await page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());
ok(zero.onda === 1 && zero.mao.length === 0, 'começar do zero começa na onda 1, de mão vazia');
ok((await pontoNoSave()) === null, '"Começar do zero" apaga o ponto de retorno');

// ============================================= o celular: a pergunta cabe
await page.evaluate(() => window.jogo.current.world.root.userData.rodada.terminar('interrompida'));
await page.evaluate((p) => window.jogo.guardarRetomada('jardim', p), ponto);
await page.setViewportSize({ width: 390, height: 780 });
await page.reload({ waitUntil: 'networkidle' });
await esperar(() => !!window.jogo?.current?.world?.root?.userData?.rodada);
opcoes = await falarComEla();
await page.screenshot({ path: `${OUT}-celular.png` });
const caixas = await page.locator('.dialogue .escolhas button').evaluateAll((bs) => bs.map((b) => {
  const r = b.getBoundingClientRect();
  return { l: r.left, r: r.right, scroll: b.scrollWidth > b.clientWidth + 1 };
}));
ok(caixas.length === 3 && caixas.every((c) => c.l >= 0 && c.r <= 390 && !c.scroll), 'no celular os três botões cabem na tela, sem texto cortado');

ok(erros.length === 0, `nenhum erro no console${erros.length ? ': ' + erros.join(' | ') : ''}`);
await browser.close();
if (problemas.length) {
  console.log(`\n${problemas.length} problema(s)`);
  process.exit(1);
}
console.log('\ntudo certo');
