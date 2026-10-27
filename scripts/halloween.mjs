/**
 * O ESPECIAL DE HALLOWEEN (`docs/HALLOWEEN.md`), parte por parte.
 *
 *   SO=filme  a etapa 1: o sofá oferece "Assistir um filme de terror" (só com
 *             `?halloween`), a luz da sala apaga, o filme na TV, o balde de
 *             pipoca, as falas, a carta deslizando por baixo da porta, o
 *             "Pegar a carta", a carta aberta na tela, a fase `convite` e a
 *             memória — e, recarregando, o filme não volta e a carta sumiu
 *             e o SAVE DE TESTE: o que se faz com `?halloween` fica num save
 *             à parte, e o save de verdade não ganha nada do evento
 *   SO=volta  a CAMADA: sem o `?halloween` o jogo é o de antes do evento — o
 *             sofá com as duas opções de sempre e nenhuma peça do evento na
 *             cena, com o mesmo número de malhas de antes dele
 *
 *   node scripts/halloween.mjs /tmp/hw            (tudo)
 *   SO=filme node scripts/halloween.mjs /tmp/hw   (uma parte)
 *   CEL=1 …                                        (no celular em pé)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/hw';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = (process.env.SO ?? '').split(',').filter(Boolean);
const roda = (parte) => SO.length === 0 || SO.includes(parte);
const CEL = !!process.env.CEL;

/*
 * A casa do Ari ANTES do evento, medida no commit `9760601` (o ponto de volta
 * do §8.3): quantas malhas a cena tem logo depois de montar. Sem o
 * `?halloween`, a casa tem que continuar exatamente assim.
 */
const MALHAS_DA_CASA_ANTES = 346;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage(CEL
  ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { viewport: { width: 1200, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT|fonts\.g/.test(m.text())) erros.push(m.text()); });

const problemas = [];
const ok = (cond, msg) => {
  console.log(`  ${cond ? 'ok  ' : 'FALHOU'} ${msg}`);
  if (!cond) problemas.push(msg);
};
const j = (fn, arg) => page.evaluate(fn, arg);
const espera = (ms) => page.waitForTimeout(ms);

/** abre uma cena com o save zerado */
const limpo = async (query) => {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  // os DOIS saves: o de verdade e o de teste do `?halloween`
  await j(() => { localStorage.removeItem('aristory.save.v1'); localStorage.removeItem('aristory.save.v1.halloween'); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(1500);
};

/** as peças do evento que estão na cena (pela etiqueta) */
const pecasDoEvento = () => j(() => {
  const achadas = [];
  window.jogo.scene.traverse((o) => {
    const p = o.userData?.peca;
    if (p === 'envelope-de-halloween' || p === 'balde-de-pipoca') achadas.push({ peca: p, visivel: o.visible });
  });
  return achadas;
});

/** quantas malhas a cena tem (para comparar com antes do evento) */
const malhasNaCena = () => j(() => {
  let n = 0;
  window.jogo.scene.traverse((o) => { if (o.isMesh) n++; });
  return n;
});

/** chega no sofá e abre a pergunta dele; devolve os textos das opções */
const abrirOSofa = async () => {
  await j(() => window.jogo.debugPlace(0.95, 0.6, -Math.PI / 2));
  await espera(700);
  await page.keyboard.press('KeyE');
  await espera(900);
  return page.locator('.escolhas.show button').allTextContents();
};

/** passa as falas (E) enquanto houver balão, sem mexer em escolha nenhuma */
const passarFalas = async (limite = 30) => {
  for (let i = 0; i < limite; i++) {
    if (!(await page.locator('.dialogue.show').count())) return;
    await page.keyboard.press('KeyE');
    await espera(350);
  }
};

const flag = (f) => j((f) => window.jogo.flag(f), f);

// ===================================================================== volta
if (roda('volta')) {
  console.log('\nvolta: sem o ?halloween, a casa é a de antes do evento');
  await limpo('cena=casa');
  const pecas = await pecasDoEvento();
  ok(pecas.length === 0, `nenhuma peça do evento na casa (${JSON.stringify(pecas)})`);
  const malhas = await malhasNaCena();
  ok(malhas === MALHAS_DA_CASA_ANTES, `as mesmas malhas de antes do evento (${malhas} = ${MALHAS_DA_CASA_ANTES})`);
  const opcoes = await abrirOSofa();
  ok(opcoes.length === 2 && !opcoes.some((t) => /terror/i.test(t)), `o sofá pergunta o de sempre (${opcoes.join(' | ')})`);
  await page.keyboard.press('Escape');
  await espera(400);
}

// ===================================================================== filme
if (roda('filme')) {
  console.log('\nfilme: o sofá, o filme de terror e a carta da Estella');
  await limpo('cena=casa&halloween');
  const pecas = await pecasDoEvento();
  ok(pecas.length === 2 && pecas.every((p) => !p.visivel), `o envelope e o balde existem, escondidos (${JSON.stringify(pecas)})`);

  const opcoes = await abrirOSofa();
  ok(opcoes.length === 3 && /filme de terror/i.test(opcoes[2] ?? ''), `o sofá oferece o filme de terror (${opcoes.join(' | ')})`);
  await page.locator('.escolhas.show button').nth(2).click();

  // a luz apaga e o filme começa: foto com os dois no sofá
  await espera(2600);
  const noFilme = await j(() => {
    const g = window.jogo;
    let tela = null;
    g.scene.traverse((o) => { if (o.name === 'tela') tela = o; });
    let balde = null;
    g.scene.traverse((o) => { if (o.userData?.peca === 'balde-de-pipoca') balde = o; });
    return {
      telaComFilme: !!tela?.material?.map && tela.material.map.image?.width === 384,
      balde: !!balde?.visible,
      sentados: !!(g.player.rig.sitting && g.parceiro.rig.sitting),
      // a sala escureceu: a luz ambiente baixou
      ambiente: g.hemi?.intensity ?? null,
    };
  });
  ok(noFilme.telaComFilme, 'a TV passa o filme de terror');
  ok(noFilme.balde, 'o balde de pipoca aparece no sofá');
  ok(noFilme.sentados, 'os dois sentados no sofá');
  // (apagando: o navegador sem placa roda a poucos quadros, e a luz apaga
  // no relógio do jogo — basta ter começado a cair do 1,4 da casa)
  ok(noFilme.ambiente === null || noFilme.ambiente < 1.3, `a luz da sala apagando (ambiente ${noFilme.ambiente})`);
  await page.screenshot({ path: `${OUT}-filme.png` });

  // as falas, até a carta parar no chão
  let viuDeslizar = false;
  let viuMeio = false;
  let fotoDoEscuro = false;
  let escuroNoFilme = null;
  for (let i = 0; i < 60 && !(await flag('halloween:carta-no-chao')); i++) {
    if (!viuDeslizar) {
      const env = await j(() => {
        let e = null;
        window.jogo.scene.traverse((o) => { if (o.userData?.peca === 'envelope-de-halloween') e = o; });
        return e ? { v: e.visible, z: e.position.z } : null;
      });
      if (env?.v && env.z > 3.4) {
        viuDeslizar = true;
        await page.screenshot({ path: `${OUT}-carta-deslizando.png` });
      }
    } else if (!viuMeio) {
      const z = await j(() => {
        let e = null;
        window.jogo.scene.traverse((o) => { if (o.userData?.peca === 'envelope-de-halloween') e = o; });
        return e?.position.z ?? 0;
      });
      if (z < 3.3) {
        viuMeio = true;
        await page.screenshot({ path: `${OUT}-carta-chegando.png` });
      }
    }
    if (await page.locator('.dialogue.show').count()) {
      // a foto do meio do filme: a sala já escura, na fala da coberta
      if (!fotoDoEscuro && /coberta/.test((await page.locator('.dialogue.show').textContent()) ?? '')) {
        fotoDoEscuro = true;
        await espera(1200);
        await page.screenshot({ path: `${OUT}-filme-no-escuro.png` });
        escuroNoFilme = await j(() => window.jogo.hemi?.intensity ?? null);
      }
      await page.keyboard.press('KeyE');
    }
    await espera(250);
  }
  ok(escuroNoFilme === null || escuroNoFilme < 0.75, `no meio do filme a sala está escura (ambiente ${escuroNoFilme})`);
  ok(viuDeslizar, 'a carta desliza para dentro por baixo da porta');
  ok(await flag('halloween:carta-no-chao'), 'a carta parou no chão da sala');
  // a última fala vem depois de a carta parar: passa as falas até os dois
  // levantarem
  for (let i = 0; i < 40; i++) {
    if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
    else if (await j(() => !window.jogo.player.rig.sitting)) break;
    await espera(300);
  }
  await espera(600);
  const solta = await j(() => !window.jogo.player.rig.sitting);
  ok(solta, 'os dois levantaram do sofá');
  const tvVolta = await j(() => {
    let tela = null;
    window.jogo.scene.traverse((o) => { if (o.name === 'tela') tela = o; });
    return !tela?.material?.map;
  });
  ok(tvVolta, 'a TV voltou a ser a de sempre (desligada)');

  // a carta no chão, de perto
  const env = await j(() => {
    let e = null;
    window.jogo.scene.traverse((o) => { if (o.userData?.peca === 'envelope-de-halloween') e = o; });
    return { x: e.position.x, z: e.position.z, v: e.visible };
  });
  ok(env.v && env.z < 4.5 - 1.2, `a carta está dentro da sala, passada do capacho (z ${env.z.toFixed(2)})`);
  await j((p) => { window.jogo.debugPlace(p.x - 0.9, p.z - 0.5, Math.atan2(0.9, 0.5)); window.jogo.setZoom(5.5); }, env);
  await espera(900);
  await page.screenshot({ path: `${OUT}-carta-no-chao.png` });
  const prompt = await page.locator('.prompt.show .label').textContent().catch(() => '');
  ok(/Pegar a carta/.test(prompt ?? ''), `o prompt "Pegar a carta" (${prompt})`);

  // pegar e ler
  await page.keyboard.press('KeyE');
  await espera(1400);
  const aberta = await page.locator('.memorias.show').count();
  ok(aberta === 1, 'a carta abre na tela');
  await page.screenshot({ path: `${OUT}-carta-aberta.png` });
  await page.keyboard.press('Escape');
  await espera(700);
  await passarFalas();
  await espera(600);
  ok(await flag('halloween:convite'), 'a fase vira "convite"');
  ok(!(await flag('halloween:carta-no-chao')), 'a carta saiu do chão');
  const memoria = await j(() => JSON.stringify(window.jogo.save?.memorias ?? window.jogo.save ?? {}).includes('halloween-convite'));
  ok(memoria, 'a memória "O convite da Estella" entrou no diário');

  // recarregando: o filme não volta e a carta não está mais lá
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(1500);
  const depois = await pecasDoEvento();
  ok(depois.find((p) => p.peca === 'envelope-de-halloween')?.visivel === false, 'recarregando, a carta não volta ao chão');
  const opcoesDepois = await abrirOSofa();
  ok(opcoesDepois.length === 2, `e o sofá não oferece o filme de novo (${opcoesDepois.join(' | ')})`);
  await page.keyboard.press('Escape');

  // O SAVE DE TESTE: o link de sempre não vê nada do que foi feito aqui
  await page.goto(`${BASE}/?cena=casa`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(1200);
  const deVerdade = await j(() => ({
    flags: Object.keys(window.jogo.save.data.flags).filter((f) => f.startsWith('halloween')),
    memoria: window.jogo.save.memories.some((m) => m.id.startsWith('halloween-')),
    noNavegador: (localStorage.getItem('aristory.save.v1') ?? '').includes('halloween'),
    teste: (localStorage.getItem('aristory.save.v1.halloween') ?? '').includes('halloween:convite'),
  }));
  ok(deVerdade.flags.length === 0 && !deVerdade.memoria && !deVerdade.noNavegador,
    `o save de verdade não tem nada do evento (${JSON.stringify(deVerdade)})`);
  ok(deVerdade.teste, 'o save de teste guardou a fase do evento');
  // e o rastro antigo (de antes do save de teste) é limpo do save de verdade
  await j(() => {
    const s = JSON.parse(localStorage.getItem('aristory.save.v1'));
    s.flags['halloween:convite'] = true;
    s.memories.push({ id: 'halloween-convite', title: 'x', place: 'x', note: 'x', icon: 'x', at: 1 });
    localStorage.setItem('aristory.save.v1', JSON.stringify(s));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(1200);
  const limpo2 = await j(() => !window.jogo.flag('halloween:convite') && !window.jogo.save.memories.some((m) => m.id === 'halloween-convite'));
  ok(limpo2, 'o rastro antigo do teste some do save de verdade');
}

console.log(erros.length ? '\nERROS:\n' + erros.join('\n') : '\nsem erros');
await browser.close();
if (problemas.length || erros.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
