/**
 * O JEITO DE CADA BICHO — um truque simples por praga, tirado do desenho dela.
 *
 * Cada caso é uma estufa de laboratório (a mesma do `cartasNaRodada.mjs`: a
 * rodada sem onda e sem bicho), com UM bicho solto no lugar certo. O teste
 * espera o truque acontecer, MEDE o efeito no mundo e tira uma foto:
 *
 * - Gafanhopo pula, e no ar o jato não pega;
 * - Libelagarto voa, alto, uns dois segundos;
 * - Tucanguru, chegando no portão do meio, pula para outro portão;
 * - Coelhatu, meio molhado, enrola e rola (e rolando a água não pega);
 * - Formiguriço vem em fila de três;
 * - Tamandubelha aspira as gotas do chão e devolve mais quando é espantado;
 * - Mosquipótamo vai no tonel beber, e o tonel para de encher o regador;
 * - Rinocaracol, meio molhado, se fecha na concha e depois abre;
 * - Javaponja incha com a água e, espantada, deixa uma poça que enche o regador;
 * - Mãe-Lagartejo solta filhote;
 * - Escorpicamelo bebe o tonel, vai embora dele, e com meia vida fica bravo.
 *
 * Uso: node scripts/jeitos.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './jeitos';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_CERT|net::ERR_/.test(m.text())) erros.push(m.text()); });

await page.goto(`${BASE}/?cena=estufa&em=0,-2&zoom=9`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
await page.mouse.click(550, 400);

const rodada = (fn, arg) => page.evaluate(fn, arg);
const estado = () => rodada(() => window.jogo.current.world.root.userData.rodada.estado());
const bicho = (e, id) => e.invasores.find((b) => b.praga === id);

const problemas = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) problemas.push(msg);
};

/** espera uma condição sobre o estado, com teto; devolve o último estado */
async function ate(pred, teto = 20000) {
  const fim = Date.now() + teto;
  let e = await estado();
  while (!pred(e) && Date.now() < fim) {
    await page.waitForTimeout(120);
    e = await estado();
  }
  return e;
}

/** a estufa de laboratório: sem onda e sem bicho, a dupla num canto, o regador de folga */
async function laboratorio({ x = 6, z = 3, folga = true } = {}) {
  await rodada(([x, z, folga]) => {
    const u = window.jogo.current.world.root.userData;
    const r = u.rodada;
    r.aoAcabar = null;
    if (r.rodando) r.terminar();
    window.jogo.debugPlace(x, z, Math.PI);
    r.escalaDoTempo = 3;
    r.regadorDeFolga = folga;
    u.vitrineDoJato([]);
    r.limparBichos();
    r.plano.length = 0;
  }, [x, z, folga]);
  await page.waitForTimeout(300);
}

/** solta um bicho e devolve o primeiro índice dele na lista */
const soltar = (id, x, z, opcoes = {}) => rodada(([id, x, z, opcoes]) => {
  window.jogo.current.world.root.userData.rodada.soltarBicho(id, x, z, opcoes);
}, [id, x, z, opcoes]);

/** mexe direto no bicho (o teste pula para o "meio molhado") */
const noBicho = (id, fn) => rodada(([id, corpo]) => {
  const r = window.jogo.current.world.root.userData.rodada;
  const inv = r.invasores.find((i) => i.ficha.id === id);
  // eslint-disable-next-line no-new-func
  if (inv) new Function('inv', 'r', corpo)(inv, r);
}, [id, fn]);

const foto = async (nome, alvo) => {
  await rodada((id) => {
    const r = window.jogo.current.world.root.userData.rodada;
    const inv = r.invasores.find((i) => i.ficha.id === id);
    window.jogo.focusCamera(inv ? inv.raiz : null);
    window.jogo.setZoom(id === 'escorpicamelo' || id === 'rinocaracol' || id === 'javaponja' ? 5.5 : 3.6);
  }, alvo);
  // a câmera desliza até o bicho: sem esperar, a foto sai do chão vazio
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
};
const soltarCamera = () => rodada(() => { window.jogo.focusCamera(null); window.jogo.setZoom(9); });

const planta = await rodada(() => {
  const p = window.jogo.current.world.root.userData.rodada.planta;
  return { portoes: p.portoes, tonel: p.tonel, brechas: p.brechas };
});

// ================================================================ Gafanhopo
console.log('— Gafanhopo (pernas de mola)');
{
  await laboratorio();
  await soltar('gafanhopo', -2, -6);
  const e = await ate((e) => bicho(e, 'gafanhopo')?.noAr && bicho(e, 'gafanhopo').altura > 0.35, 15000);
  const b = bicho(e, 'gafanhopo');
  ok(b?.noAr && b.altura > 0.35, `pula (${b?.altura.toFixed(2)} m do chão)`);
  const pega = await rodada(() => {
    const r = window.jogo.current.world.root.userData.rodada;
    return r.vulneravel(r.invasores.find((i) => i.ficha.id === 'gafanhopo'));
  });
  ok(!pega, 'no ar, a água não pega nele');
  await foto('gafanhopo', 'gafanhopo');
  await soltarCamera();
}

// ============================================================== Libelagarto
console.log('— Libelagarto (asas)');
{
  await laboratorio();
  await soltar('libelagarto', -2, -7);
  const e = await ate((e) => bicho(e, 'libelagarto')?.voando && bicho(e, 'libelagarto').altura > 0.9, 20000);
  const b = bicho(e, 'libelagarto');
  ok(b?.voando && b.altura > 0.9, `voa (${b?.altura.toFixed(2)} m do chão)`);
  await foto('libelagarto', 'libelagarto');
  const pousou = await ate((e) => !bicho(e, 'libelagarto')?.noAr, 12000);
  ok(!bicho(pousou, 'libelagarto')?.noAr && Math.abs(bicho(pousou, 'libelagarto').altura) < 0.01, 'e pousa de novo no chão');
  await soltarCamera();
}

// ================================================================ Tucanguru
console.log('— Tucanguru (pernas de canguru)');
{
  await laboratorio();
  const p = planta.portoes[1];
  await soltar('tucanguru', p.x, p.z - 5, { porta: 1, fora: true });
  await noBicho('tucanguru', 'inv.truque.usou = false;');
  const e = await ate((e) => bicho(e, 'tucanguru')?.porta !== 1, 15000);
  ok(bicho(e, 'tucanguru')?.porta !== 1, `chegando no portão do meio, pula para o ${['da esquerda', 'do meio', 'da direita'][bicho(e, 'tucanguru')?.porta]}`);
  await page.waitForTimeout(150);
  await foto('tucanguru', 'tucanguru');
  const dentro = await ate((e) => (bicho(e, 'tucanguru')?.z ?? -99) > planta.portoes[0].z + 1, 20000);
  ok((bicho(dentro, 'tucanguru')?.z ?? -99) > planta.portoes[0].z + 1, 'e entra pelo portão novo');
  await soltarCamera();
}

// ================================================================= Coelhatu
console.log('— Coelhatu (casco de tatu)');
{
  await laboratorio();
  await soltar('coelhatu', -2, -6);
  await page.waitForTimeout(400);
  await noBicho('coelhatu', 'inv.vida = inv.vidaMax * 0.45;');
  const e = await ate((e) => bicho(e, 'coelhatu')?.rola, 6000);
  ok(bicho(e, 'coelhatu')?.rola, 'meio molhado, vira bolinha e rola');
  const pega = await rodada(() => {
    const r = window.jogo.current.world.root.userData.rodada;
    return r.vulneravel(r.invasores.find((i) => i.ficha.id === 'coelhatu'));
  });
  ok(!pega, 'rolando, a água escorre (não pega)');
  await foto('coelhatu', 'coelhatu');
  const fim = await ate((e) => !bicho(e, 'coelhatu')?.rola, 8000);
  ok(!bicho(fim, 'coelhatu')?.rola, 'e desenrola logo depois');
  await soltarCamera();
}

// ============================================================== Formiguriço
console.log('— Formiguriço (formiga)');
{
  await laboratorio();
  await soltar('formigurico', -2, -6);
  const e = await ate((e) => e.invasores.filter((b) => b.praga === 'formigurico').length >= 3, 8000);
  const n = e.invasores.filter((b) => b.praga === 'formigurico').length;
  ok(n === 3, `vem em fila de três (${n})`);
  await page.waitForTimeout(1500);
  await foto('formigurico', 'formigurico');
  await soltarCamera();
}

// ============================================================= Tamandubelha
console.log('— Tamandubelha (focinho de canudo)');
{
  await laboratorio();
  await soltar('tamandubelha', -2, -7);
  // gotas no caminho dele, depois que ele já virou para onde vai
  await page.waitForTimeout(1200);
  await rodada(() => {
    const r = window.jogo.current.world.root.userData.rodada;
    const inv = r.invasores.find((i) => i.ficha.id === 'tamandubelha');
    r.soltarGotasAqui(inv.x + Math.sin(inv.rumo) * 2.2, inv.z + Math.cos(inv.rumo) * 2.2, 6);
  });
  // as gotas caem espalhadas: ele aspira as que ficam no caminho dele
  const e = await ate((e) => (bicho(e, 'tamandubelha')?.guardadas ?? 0) >= 1, 12000);
  const guardadas = bicho(e, 'tamandubelha')?.guardadas ?? 0;
  ok(guardadas >= 1, `aspira as gotas do chão (${guardadas} no bucho)`);
  await foto('tamandubelha', 'tamandubelha');
  const antes = (await estado()).gotasNoChao;
  await noBicho('tamandubelha', 'r.molhar(inv, 999, null);');
  const depois = await ate((e) => e.gotasNoChao >= antes + guardadas + 2, 6000);
  ok(depois.gotasNoChao >= antes + guardadas + 2, `espantado, devolve as gotas e mais um tanto (${antes} → ${depois.gotasNoChao} no chão)`);
  await soltarCamera();
}

// ============================================================= Mosquipótamo
console.log('— Mosquipótamo (tromba de mosquito)');
{
  const t = planta.tonel;
  await laboratorio({ x: 6, z: 3 });
  await soltar('mosquipotamo', t.x + 3, t.z - 1);
  const e = await ate((e) => bicho(e, 'mosquipotamo')?.bebendo, 20000);
  ok(bicho(e, 'mosquipotamo')?.bebendo && e.tonelSeco, 'vai no tonel e bebe');
  await foto('mosquipotamo', 'mosquipotamo');
  // a dupla chega no tonel de regador vazio: com ele bebendo, não enche
  const encheu = await rodada(async (t) => {
    const r = window.jogo.current.world.root.userData.rodada;
    window.jogo.debugPlace(t.x + 1.2, t.z + 0.6, 0);
    r.agua = 0;
    const antes = r.agua;
    await new Promise((ok) => setTimeout(ok, 1500));
    return r.agua - antes;
  }, t);
  ok(encheu < 1, `bebendo ele, o tonel não enche o regador (+${encheu.toFixed(2)} em 1,5 s)`);
  await noBicho('mosquipotamo', 'r.molhar(inv, 999, null);');
  const enche = await rodada(async () => {
    const r = window.jogo.current.world.root.userData.rodada;
    await new Promise((ok) => setTimeout(ok, 900));
    r.agua = 0;
    await new Promise((ok) => setTimeout(ok, 1500));
    return r.agua;
  });
  ok(enche > 2, `espantado ele, o tonel volta a encher (+${enche.toFixed(2)} em 1,5 s)`);
  await soltarCamera();
}

// ============================================================== Rinocaracol
console.log('— Rinocaracol (concha)');
{
  await laboratorio();
  await soltar('rinocaracol', -2, -6);
  await page.waitForTimeout(400);
  await noBicho('rinocaracol', 'inv.vida = inv.vidaMax * 0.45;');
  const e = await ate((e) => bicho(e, 'rinocaracol')?.concha, 6000);
  ok(bicho(e, 'rinocaracol')?.concha, 'meio molhado, se fecha na concha');
  const pega = await rodada(() => {
    const r = window.jogo.current.world.root.userData.rodada;
    return r.vulneravel(r.invasores.find((i) => i.ficha.id === 'rinocaracol'));
  });
  ok(!pega, 'na concha, a água não pega');
  await foto('rinocaracol', 'rinocaracol');
  const abriu = await ate((e) => !bicho(e, 'rinocaracol')?.concha, 10000);
  ok(!bicho(abriu, 'rinocaracol')?.concha && Math.abs(bicho(abriu, 'rinocaracol').altura) < 0.01, 'e abre de novo, de pé no chão');
  await soltarCamera();
}

// ================================================================ Javaponja
console.log('— Javaponja (esponja)');
{
  await laboratorio();
  await soltar('javaponja', -2, -6);
  await page.waitForTimeout(400);
  const cheia = bicho(await estado(), 'javaponja').escala;
  await noBicho('javaponja', 'inv.vida = inv.vidaMax * 0.2;');
  await page.waitForTimeout(400);
  const inchada = bicho(await estado(), 'javaponja').escala;
  ok(inchada > cheia * 1.2, `incha com a água (${cheia.toFixed(2)} → ${inchada.toFixed(2)})`);
  await foto('javaponja', 'javaponja');
  const onde = bicho(await estado(), 'javaponja');
  await noBicho('javaponja', 'r.molhar(inv, 999, null);');
  const e = await ate((e) => e.esponjas > 0, 4000);
  ok(e.esponjas > 0, 'espantada, espreme uma poça');
  const encheu = await rodada(async (onde) => {
    const r = window.jogo.current.world.root.userData.rodada;
    window.jogo.debugPlace(onde.x, onde.z, 0);
    r.agua = 0;
    await new Promise((ok) => setTimeout(ok, 1200));
    return r.agua;
  }, onde);
  ok(encheu > 2, `pisar na poça enche o regador (+${encheu.toFixed(2)})`);
  await soltarCamera();
}

// ============================================================ Mãe-Lagartejo
console.log('— Mãe-Lagartejo');
{
  await laboratorio();
  await soltar('mae-lagartejo', -2, -6);
  const e = await ate((e) => e.invasores.some((b) => b.praga === 'lagartejo'), 25000);
  ok(e.invasores.some((b) => b.praga === 'lagartejo'), 'solta filhote pelo caminho');
  await foto('mae', 'mae-lagartejo');
  await soltarCamera();
}

// ============================================================ Escorpicamelo
console.log('— Escorpicamelo (corcovas)');
{
  const t = planta.tonel;
  await laboratorio({ x: 6, z: 3 });
  await soltar('escorpicamelo', t.x + 3.5, t.z - 1);
  const e = await ate((e) => bicho(e, 'escorpicamelo')?.bebendo, 25000);
  ok(bicho(e, 'escorpicamelo')?.bebendo && e.tonelSeco, 'vai no tonel e seca ele');
  await page.waitForTimeout(3000);
  await foto('escorpicamelo-bebendo', 'escorpicamelo');
  const largou = await ate((e) => !bicho(e, 'escorpicamelo')?.bebendo && !e.tonelSeco, 30000);
  ok(!bicho(largou, 'escorpicamelo')?.bebendo, 'bebe o que cabe nas corcovas e larga o tonel');
  await noBicho('escorpicamelo', 'inv.vida = inv.vidaMax * 0.45;');
  const bravo = await ate((e) => bicho(e, 'escorpicamelo')?.bravo, 6000);
  ok(bicho(bravo, 'escorpicamelo')?.bravo, 'com meia vida, as corcovas murcham e ele fica bravo');
  await page.waitForTimeout(600);
  await foto('escorpicamelo-bravo', 'escorpicamelo');
  await soltarCamera();
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
