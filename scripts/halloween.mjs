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
 *   SO=parque a etapa 2: o parque no pôr do sol, enfeitado inteiro (as
 *             abóboras, o que se pendura, as lápides, o Nessie passeando no
 *             lago), quem foi se arrumar (sumiu, calado, as conversas dele
 *             desligadas) e a plaquinha de recado no posto, o que continua
 *             funcionando, os comentários da dupla (uma vez só) — e o clube,
 *             o Mania, a estufa, a escola e o quarto sem os personagens
 *   SO=volta  a CAMADA: sem o `?halloween` o jogo é o de antes do evento — o
 *             sofá com as duas opções de sempre, nenhuma peça do evento, e a
 *             casa, o parque, o clube, a escola, a estufa, o Mania e o quarto
 *             com o mesmo número de malhas que tinham antes dele
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
/** as outras cenas que o evento toca, medidas no mesmo commit (save zerado) */
const MALHAS_ANTES = {
  'villa-lobos': 5827, clube: 2808, escola: 1360, 'escola-ginasio': 353, estufa: 3360, 'mania-de-churrasco': 642, quarto: 367,
};

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
  // as cenas da etapa 2, sem o `?halloween`: nada do enfeite, nada de recado
  for (const [cena, antes] of Object.entries(MALHAS_ANTES)) {
    await limpo(`cena=${cena}`);
    const n = await malhasNaCena();
    const camada = await j(() => {
      let achou = false;
      window.jogo.scene.traverse((o) => { if (o.name === 'halloween-no-parque' || o.userData?.peca === 'plaquinha-de-recado') achou = true; });
      return achou;
    });
    ok(n === antes && !camada, `${cena}: as mesmas malhas de antes do evento (${n} = ${antes}), sem nada do evento`);
  }
}

// ===================================================================== parque
/** abre a cena na fase `convite` (o save de teste com a carta já lida) */
const naFaseConvite = async (cena, flagsExtras = []) => {
  await limpo(`cena=${cena}&halloween`);
  await j((f) => { for (const x of f) window.jogo.setFlag(x); }, ['halloween:convite', ...flagsExtras]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(1800);
};
/** os bichos da cena (pela etiqueta) e se estão à vista */
const bichosNaCena = () => j(() => {
  const lista = {};
  for (const o of window.jogo.scene.children) {
    o.traverse((b) => { if (b.userData?.bicho) lista[b.userData.peca] = b.visible; });
  }
  return lista;
});
const interacoes = () => j(() => Object.fromEntries(
  (window.jogo.current?.world?.interactables ?? []).filter((i) => i.id).map((i) => [i.id, i.enabled]),
));
const textoDoBalao = () => j(() => document.querySelector('.dialogue.show')?.textContent ?? '');

if (roda('parque')) {
  console.log('\nparque: o Villa Lobos no pôr do sol, enfeitado e vazio');
  // antes da carta, nada
  await limpo('cena=villa-lobos&halloween');
  ok(!(await j(() => !!window.jogo.scene.getObjectByName('halloween-no-parque'))), 'antes da carta, o parque é o de sempre');

  await naFaseConvite('villa-lobos');
  const enfeite = await j(() => window.jogo.scene.getObjectByName('halloween-no-parque')?.userData.contagem ?? null);
  ok(!!enfeite, `na fase convite o parque está enfeitado (${JSON.stringify(enfeite)})`);
  if (enfeite) {
    ok(enfeite.aboboras >= 40 && enfeite.lapides >= 12, `abóboras (${enfeite.aboboras}) e lápides (${enfeite.lapides}) pelo parque`);
    ok(enfeite.bandeirolas >= 100 && enfeite.lanternas >= 15 && enfeite.varais >= 4, `os varais de bandeirolas e lanternas (${enfeite.varais} varais)`);
    ok(enfeite.fantasminhas >= 30 && enfeite.morceguinhos >= 40 && enfeite.teias >= 15, 'fantasminhas, morceguinhos e teias nas árvores');
  }
  const pecas = await j(() => {
    const achadas = new Set();
    window.jogo.scene.traverse((o) => { if (o.userData?.peca) achadas.add(o.userData.peca); });
    return ['arco-de-baloes', 'fardo-de-feno', 'espantalho-de-boas-vindas', 'lencol-de-fantasma', 'caldeirao', 'guirlanda',
      'chapeu-de-bruxa', 'pano-de-fechado', 'nessie-de-plastico', 'plaquinha-de-recado', 'folhas-secas'].filter((p) => !achadas.has(p));
  });
  ok(pecas.length === 0, `as peças únicas estão no parque${pecas.length ? ` (faltam ${pecas.join(', ')})` : ''}`);
  // a clareira é o cantinho dos dois: nenhum enfeite lá
  const naClareira = await j(() => {
    let n = 0;
    const p = new window.jogo.player.position.constructor();
    window.jogo.scene.getObjectByName('halloween-no-parque')?.traverse((o) => {
      if (!o.isInstancedMesh) return;
      const m = new o.matrixWorld.constructor();
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, m);
        p.setFromMatrixPosition(m);
        if (Math.hypot(p.x + 38.5, p.z - 12.5) < 6) n++;
      }
    });
    return n;
  });
  ok(naClareira === 0, `a clareira fica sem enfeite (${naClareira})`);

  // as cores do Halloween nos lugares, os infláveis e o lago de gelatina
  const pintados = await j(() => window.jogo.scene.getObjectByName('halloween-no-parque')?.userData.pintados ?? {});
  const semCor = ['sorveteria', 'mesa-de-sorveteria', 'loja-de-patins', 'roda-gigante', 'loja-de-roupas', 'gelo', 'poste'].filter((p) => !(pintados[p] > 0));
  ok(semCor.length === 0, `os lugares repintados de roxo e laranja (${JSON.stringify(pintados)})`);
  const inflaveis = await j(() => {
    const achados = [];
    window.jogo.scene.traverse((o) => { if (/-inflavel$/.test(o.userData?.peca ?? '')) achados.push(o.userData.peca); });
    return achados;
  });
  ok(inflaveis.length === 11 && ['aranha-inflavel', 'morcego-inflavel'].every((p) => inflaveis.includes(p)), `os onze infláveis gigantes, um ou dois por área (${inflaveis.join(', ')})`);
  const itLago = await interacoes();
  ok(itLago['halloween:lago-de-gelatina'] === true && itLago['parque:lago'] === false, 'o lago roxo tem a conversa da gelatina no lugar do "Olhar o lago"');

  // o Nessie: na água, e passeando
  const nessie = async () => j(() => {
    let n = null;
    window.jogo.scene.traverse((o) => { if (o.userData?.peca === 'nessie-de-plastico') n = { x: o.position.x, z: o.position.z }; });
    return n;
  });
  const n0 = await nessie();
  // o navegador do teste anda a poucos quadros: o relógio do jogo corre devagar
  await espera(9000);
  const n1 = await nessie();
  ok(!!n0 && Math.hypot(n0.x + 21, n0.z - 11) < 6.5, `o Nessie está dentro do lago (${JSON.stringify(n0)})`);
  ok(!!n0 && !!n1 && Math.hypot(n1.x - n0.x, n1.z - n0.z) > 0.04, `e passeia (${JSON.stringify(n1)})`);

  // quem foi se arrumar
  const bichos = await bichosNaCena();
  const sumiram = ['mano', 'cookie', 'estella'].filter((b) => bichos[b] !== false);
  ok(sumiram.length === 0, `o Mano, o Cookie e a Estella não estão no parque (${JSON.stringify(bichos)})`);
  ok(bichos.pato !== false || bichos['pato-do-lago'] !== false, 'os bichos do lago continuam');
  const it = await interacoes();
  const fechadas = ['parque:sorveteria', 'parque:cookie', 'parque:bilheteria', 'parque:roda-gigante', 'parque:xadrez', 'parque:estella', 'parque:mano'];
  ok(fechadas.every((i) => it[i] === false), `o que depende deles fecha (${fechadas.map((i) => `${i}=${it[i]}`).join(' ')})`);
  const abertas = ['parque:patins', 'halloween:lago-de-gelatina', 'parque:pingpong'];
  ok(abertas.every((i) => it[i] !== false), `o que é da dupla continua (${abertas.map((i) => `${i}=${it[i]}`).join(' ')})`);
  ok(['halloween:recado-Mano', 'halloween:recado-Cookie', 'halloween:recado-Estella'].every((i) => it[i] === true), 'as plaquinhas de recado dão para ler');

  // o céu do pôr do sol (quente: mais vermelho que azul)
  const ceu = await j(() => {
    const c = window.jogo.scene.background;
    return c?.isColor ? { r: c.r, g: c.g, b: c.b } : null;
  });
  ok(!!ceu && ceu.r > ceu.b, `o céu é o do pôr do sol (${JSON.stringify(ceu)})`);

  // o comentário do portão: uma vez só
  await j(() => window.jogo.debugPlace(0.2, 25.4, Math.PI));
  await espera(300);
  await j(() => window.jogo.debugPlace(0, 25, Math.PI));
  // o balão escreve letra por letra: espera a fala inteira
  await espera(3500);
  const falaDoPortao = await textoDoBalao();
  // o balão escreve letra por letra (devagar no navegador do teste): basta quem fala e o começo
  ok(/Renan\s*Olha/.test(falaDoPortao), `chegando no portão, o Renan comenta (${falaDoPortao.slice(0, 60)})`);
  await page.screenshot({ path: `${OUT}/parque-portao.png` });
  await passarFalas();
  ok(await flag('halloween:viu:portao'), 'o comentário fica marcado');
  await j(() => window.jogo.debugPlace(0.3, 24.8, Math.PI));
  await espera(300);
  await j(() => window.jogo.debugPlace(0, 25, Math.PI));
  await espera(1200);
  ok(!(await textoDoBalao()), 'e não se repete');

  // a gelatina: a conversa inteira, e a memória
  await j(() => { window.jogo.debugPlace(-12.6, 11.4, -Math.PI / 2); window.jogo.setZoom(10); });
  await espera(2500);
  await passarFalas();
  await page.keyboard.press('KeyE');
  await espera(2500);
  await page.screenshot({ path: `${OUT}/parque-gelatina.png` });
  // as falas vão uma a uma (o balão escreve devagar no navegador do teste)
  let gelatina = false;
  let suco = false;
  for (let i = 0; i < 90 && !gelatina; i++) {
    await page.keyboard.press('KeyE');
    await espera(500);
    if (/suco/i.test((await textoDoBalao()) ?? '')) suco = true;
    gelatina = await j(() => window.jogo.save.memories.some((m) => m.id === 'halloween-lago-de-gelatina'));
  }
  await passarFalas();
  ok(gelatina, 'a conversa da gelatina vira memória');
  const nota = await j(() => window.jogo.save.memories.find((m) => m.id === 'halloween-lago-de-gelatina')?.note ?? '');
  ok(suco && /suco de uva/.test(nota), `depois de provar, o Renan acha que é suco de uva (${suco ? 'falou' : 'não falou'}; "${nota}")`);

  // ler o recado do Mano
  await j(() => { window.jogo.debugPlace(15.39, 18.58, Math.PI + 0.6); window.jogo.setZoom(8); });
  await espera(1400);
  // chegar na sorveteria dispara o comentário dela primeiro
  await espera(2500);
  await passarFalas();
  await espera(600);
  await page.keyboard.press('KeyE');
  await espera(3500);
  const recado = await textoDoBalao();
  ok(/Mano\s*FECH/.test(recado), `o recado do Mano (${recado.slice(0, 50)})`);
  await page.screenshot({ path: `${OUT}/parque-recado-do-mano.png` });
  await passarFalas();

  // fotos na câmera de sempre
  for (const [nome, x, z, zoom] of [['praca', 0, -12, 16], ['sorveteria', 12, 19, 12], ['lago', -14, 12, 14], ['boutique', -31, -16, 13]]) {
    await j(([x, z, zoom]) => { window.jogo.debugPlace(x, z, Math.PI / 4); window.jogo.setZoom(zoom); }, [x, z, zoom]);
    await espera(1500);
    await passarFalas();
    await page.screenshot({ path: `${OUT}/parque-${nome}.png` });
  }

  // o clube, o Mania, a estufa e a escola: sem ninguém, com os recados
  console.log('\nparque: o clube, a escola e o quarto no mesmo dia');
  const CENAS = [
    ['clube', ['girafa', 'capy', 'josefina', 'noel'], ['Gina', 'Capy', 'Noel', 'Josefina', 'Walter'], ['clube:bar', 'clube:portaria', 'clube:salva-vidas'], ['clube:vestiario']],
    ['mania-de-churrasco', ['garcom-canino'], ['Walter'], ['mania:walter', 'mania:escala'], []],
    ['estufa', ['josefina'], ['Josefina'], ['estufa:josefina', 'estufa:lojinha'], []],
    ['escola', ['gatito'], ['Gatito'], ['escola:gatito'], ['escola:bebedouro']],
  ];
  for (const [cena, sumidos, recados, fechadas, abertas] of CENAS) {
    await naFaseConvite(cena, ['estufa-aberta']);
    const b = await bichosNaCena();
    const i = await interacoes();
    ok(sumidos.every((x) => b[x] === false), `${cena}: ${sumidos.join(', ')} foram se arrumar (${JSON.stringify(b)})`);
    ok(recados.every((r) => i[`halloween:recado-${r}`] === true), `${cena}: os recados (${recados.join(', ')})`);
    ok(fechadas.every((x) => i[x] === false) && abertas.every((x) => i[x] !== false), `${cena}: fecha o que é deles, e o resto continua`);
  }
  await naFaseConvite('quarto');
  const noQuarto = await bichosNaCena();
  ok(noQuarto.pelusa === false, 'o Pelusa não está no quarto (foi para a boutique)');
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
