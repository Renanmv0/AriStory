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
 *   SO=boutique a etapa 3: a boutique enfeitada nos dois andares (as bexigas
 *             de caveira), a Estella de aranha, o Pelusa morceguinho dormindo
 *             no pufe, e a cena do presente — as duas caixas, o provador, a
 *             dupla saindo inteira fantasiada (o Ari de vampiro, o Renan de
 *             morceguinho), a cestinha e o mapinha, a memória, a loja
 *             voltando a funcionar — e o mapinha lido pela mão
 *   SO=fantasias as fantasias de quem veio do clube e da escola, no parque
 *   SO=festa  a etapa 4.3: os postos da festa (a Gina no ponto, o Capy e a
 *             bacia de maçãs, o Noel e o carrinho de poções, a Josefina e o
 *             canteiro, o Gatito no piquenique, o Flynn no campinho), o que
 *             mexe (as bolhas, o vapor, a gota, as maçãs), o que fecha e o que
 *             funciona de noite, e a CONVERSA COM ZOOM de cada um (a câmera
 *             perto, ele no meio do quadro e virado para ela, a dupla de lado,
 *             a fala da fantasia, e a isométrica de volta), a barraquinha de
 *             cachorro-quente do Walter (aberta na festa, com as salsichas
 *             rolando e o recado dele; fechada no convite) — e o clube, o
 *             Mania, a estufa e a escola vazios
 *   SO=onibus a chegada da turma no ônibus da festa (a dupla saindo da
 *             boutique de noite, a buzina, a câmera voando por cima do
 *             parque, o ônibus freando, a porta abrindo e cada um descendo
 *             e falando no jeito da fantasia, até todo mundo nos postos)
 *   SO=caca   a caça de doces ou travessuras (a etapa 5a): a cesta no
 *             canto (0/25), a abóbora acesa em cima da próxima parada, quem
 *             chega cedo ouve "sigam o mapinha", o doce (3 balas), a
 *             travessura de tempo (a agulha embaixo da fala) e a de pergunta,
 *             a pista indo para o mapinha (a pergunta e o tique), a última
 *             parada com a pista do final e a conta da porta, e as abóboras
 *             escondidas (pegar, a bala, sumir e continuar sumida no F5)
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
  // (o parque e o clube −33: o ônibus do ponto virou o ônibus da cidade em
  // todo lugar, pedido do Renan — 66 malhas soltas do velho, 33 do novo)
  'villa-lobos': 5794, clube: 2775, escola: 1360, 'escola-ginasio': 353, estufa: 3360, 'mania-de-churrasco': 642, quarto: 367,
  // a boutique da Estella (a etapa 3)
  lojinha: 629,
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
      window.jogo.scene.traverse((o) => {
        if (['halloween-no-parque', 'halloween-na-boutique', 'fantasia-de-aranha', 'fantasia-de-vampiro', 'fantasia-de-fantasma', 'fantasia-da-opera', 'fantasia-de-diabinho',
          'fantasia-de-noiva', 'fantasia-de-tubarao', 'fantasia-de-cientista', 'fantasia-de-dragao', 'fantasia-de-mumia',
          'fantasia-de-walter', 'fantasia-de-lobisomem', 'fantasia-de-coruja', 'fantasia-de-catrina', 'fantasia-de-fada'].includes(o.name) || o.userData?.peca === 'plaquinha-de-recado') achou = true;
      });
      return achou;
    });
    ok(n === antes && !camada, `${cena}: as mesmas malhas de antes do evento (${n} = ${antes}), sem nada do evento`);
  }
}

// ===================================================================== parque
/** abre a cena na fase `convite` (o save de teste com a carta já lida) */
const naFaseConvite = async (cena, flagsExtras = []) => {
  await limpo(`cena=${cena}&halloween`);
  // a noite da festa já com o ônibus chegado (a chegada é a parte `onibus`, que pede `halloween:sem-onibus`)
  const comOnibus = flagsExtras.includes('halloween:festa') && !flagsExtras.includes('halloween:sem-onibus') ? ['halloween:onibus-chegou'] : [];
  await j((f) => { for (const x of f) window.jogo.setFlag(x); }, ['halloween:convite', ...flagsExtras.filter((f) => f !== 'halloween:sem-onibus'), ...comOnibus]);
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

// ==================================================================== boutique
if (roda('boutique')) {
  console.log('\nboutique: o presente da Estella');
  await naFaseConvite('lojinha');
  // o caso que o Renan achou: jogando com o Renan, e os dois JÁ vestidos —
  // a fantasia tem que entrar inteira, e a roupa de antes ir para o armário
  const ROUPA_DE_ANTES = { ari: ['vestido-rosa', 'gorro-la', 'bota-amarela', 'luvas-de-jardim'], renan: ['gorro-azul', 'bota-vermelha'] };
  await j((roupa) => {
    const g = window.jogo;
    if (g.playerId() === 'ari') g.swapCharacters();
    for (const [quem, ids] of Object.entries(roupa)) for (const id of ids) g.equipWearable(window.aristoryItens[id], quem);
  }, ROUPA_DE_ANTES);
  const antes = await j(() => ({ quem: window.jogo.playerId(), ari: window.jogo.wearables('ari').map((i) => i?.id ?? null) }));
  ok(antes.quem === 'renan' && antes.ari.filter(Boolean).length === 4, `antes da cena: jogando com o Renan, o Ari de vestido, gorro, bota e luva (${JSON.stringify(antes)})`);
  // a loja enfeitada, a Estella de aranha e o Pelusa
  const enfeite = await j(() => {
    const cena = window.jogo.scene;
    let bexigas = 0;
    let pelusa = null;
    cena.traverse((o) => {
      if (o.userData?.peca === 'bexigas-de-caveira') bexigas++;
      if (o.userData?.peca === 'pelusa' && o.userData.bicho) pelusa = { deitado: o.userData.bicho.estaDeitado, y: o.position.y };
    });
    return {
      terreo: !!cena.getObjectByName('halloween-na-boutique'),
      mezanino: !!cena.getObjectByName('halloween-no-mezanino'),
      aranha: !!cena.getObjectByName('fantasia-de-aranha'),
      bexigas,
      pelusa,
    };
  });
  ok(enfeite.terreo && enfeite.mezanino, 'os dois andares enfeitados');
  ok(enfeite.bexigas >= 5, `as bexigas de caveira (${enfeite.bexigas} cachos)`);
  ok(enfeite.aranha, 'a Estella está de aranha');
  ok(!!enfeite.pelusa && enfeite.pelusa.y > 0.4, `o Pelusa no pufe (${JSON.stringify(enfeite.pelusa)})`);
  // a cena do presente começa sozinha, e a loja fica quieta até o fim
  const quieta = await interacoes();
  ok(quieta['lojinha:subir'] === false && quieta['lojinha:estella'] === false, 'durante a cena, a loja não funciona');
  let revelou = false;
  for (let i = 0; i < 160 && !(await flag('halloween:presente')); i++) {
    const fala = await textoDoBalao();
    if (!revelou && /Muahaha/.test(fala)) {
      revelou = true;
      await espera(800);
      await page.screenshot({ path: `${OUT}-boutique-fantasiados.png` });
    }
    await page.keyboard.press('KeyE');
    await espera(500);
  }
  await passarFalas();
  ok(await flag('halloween:presente'), 'a cena do presente chega ao fim');
  const depois = await j(() => {
    const g = window.jogo;
    return {
      ari: g.wearables('ari').map((i) => i?.id ?? null),
      renan: g.wearables('renan').map((i) => i?.id ?? null),
      maos: g.handItems().map((i) => i?.id).filter(Boolean),
      armario: g.wardrobeItems('ari').map((i) => i.id),
      armarioDoRenan: g.wardrobeItems('renan').map((i) => i.id),
      memoria: g.save.memories.some((m) => m.id === 'halloween-presente-da-estella'),
    };
  });
  ok(depois.ari.every((id) => /vampiro|verniz/.test(id ?? '')), `o Ari sai inteiro de vampiro (${depois.ari.join(', ')})`);
  ok(depois.renan.every((id) => /morcego/.test(id ?? '')), `o Renan sai inteiro de morceguinho (${depois.renan.join(', ')})`);
  ok(ROUPA_DE_ANTES.ari.every((id) => depois.armario.includes(id)) && ROUPA_DE_ANTES.renan.every((id) => depois.armarioDoRenan.includes(id)),
    'a roupa de antes dos dois foi para o guarda-roupa (nada se perde)');
  ok(depois.maos.includes('cesta-de-abobora') && depois.maos.includes('mapinha-da-estella'), `a cestinha e o mapinha na mochila (${depois.maos.join(', ')})`);
  ok(depois.armario.includes('tiara-de-morcego'), 'as fantasias ficam no guarda-roupa dos dois (a do Renan no armário do Ari)');
  ok(depois.memoria, 'vira a memória "O presente da Estella"');
  await espera(800);
  const voltou = await interacoes();
  ok(voltou['lojinha:subir'] === true && voltou['lojinha:estella'] === true, 'depois da cena, a loja volta a funcionar');
  // a ronda da Estella volta a andar
  const antesDaRonda = await j(() => { let p = null; window.jogo.scene.traverse((o) => { if (o.userData?.peca === 'estella' && o.userData.bicho) p = [o.position.x, o.position.z]; }); return p; });
  // (o navegador do teste anda a ~1/5 da velocidade: espera até ela sair do lugar)
  let andou = 0;
  for (let i = 0; i < 25 && andou < 0.3; i++) {
    await espera(2000);
    const p = await j(() => { let p = null; window.jogo.scene.traverse((o) => { if (o.userData?.peca === 'estella' && o.userData.bicho) p = [o.position.x, o.position.z]; }); return p; });
    andou = Math.hypot(p[0] - antesDaRonda[0], p[1] - antesDaRonda[1]);
  }
  ok(andou >= 0.3, `a Estella volta para a ronda (andou ${andou.toFixed(2)} m)`);
  // o mapinha na mão: o E lê
  await j(() => window.jogo.setActiveHandSlot(window.jogo.handItems().findIndex((i) => i?.id === 'mapinha-da-estella')));
  await j(() => window.jogo.debugPlace(1.5, 2.8, Math.PI / 4));
  await espera(1200);
  const prompt = await j(() => document.querySelector('.prompt .label')?.textContent ?? '');
  ok(/Ler o mapinha/.test(prompt), `segurando o mapinha, o E lê (${prompt})`);
  await page.keyboard.press('KeyE');
  await espera(1500);
  const aberto = await j(() => ({ show: document.querySelector('.memorias')?.classList.contains('show'), titulo: document.querySelector('.memorias h2')?.textContent }));
  ok(aberto.show && /mapinha/i.test(aberto.titulo ?? ''), `o mapinha abre na tela (${JSON.stringify(aberto)})`);
  await page.screenshot({ path: `${OUT}-boutique-mapinha.png` });
  await page.keyboard.press('Escape');
  await espera(500);
  // recarregando, a cena não volta
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(2000);
  ok(!(await j(() => window.jogo.player.locked)) && (await interacoes())['lojinha:estella'] === true, 'recarregando, a cena não se repete');
  await page.keyboard.press('Escape');
}

// ===================================================================== noite
if (roda('noite')) {
  console.log('\nnoite: a festa é de noite, e o parque inteiro acende (§2.4.1, A)');
  /** o que acende, achado pelo nome */
  const acesos = () => j(() => {
    const g = window.jogo;
    const nomes = {};
    g.scene.traverse((o) => { if (o.name) nomes[o.name] = (nomes[o.name] ?? 0) + 1; });
    const caras = Object.keys(nomes).filter((n) => /^cara-.*-acesa$/.test(n)).length;
    const fundo = g.scene.background;
    const luzes = g.scene.getObjectByName('luzes-dos-postes');
    const pontos = [];
    luzes?.traverse((o) => { if (o.isPointLight) pontos.push(o.color.getHex()); });
    return {
      caras,
      halos: nomes['halos-das-aboboras'] ?? 0,
      pocas: nomes['luz-das-aboboras'] ?? 0,
      lanternas: nomes['luz-das-lanternas'] ?? 0,
      luzinhas: nomes['luz-das-luzinhas'] ?? 0,
      lampadinhas: nomes.lampadinhas ?? 0,
      morcegos: nomes['morcegos-voando'] ?? 0,
      nessie: nomes['luz-do-nessie'] ?? 0,
      fundo: fundo?.isColor ? (fundo.r + fundo.g + fundo.b) / 3 : 1,
      noiteDosPostes: luzes?.userData?.luzes?.noite ?? -1,
      corDosPostes: pontos[0] ?? 0,
    };
  });
  // a fase `convite`: o pôr do sol, e nada aceso
  await naFaseConvite('villa-lobos');
  const deTarde = await acesos();
  const fantasiasDeTarde = await j(() => { let n = 0; window.jogo.scene.traverse((o) => { if (/^fantasia-(de-vampiro|de-fantasma|da-opera|de-diabinho)$/.test(o.name)) n++; }); return n; });
  ok(fantasiasDeTarde === 0, `no convite ninguém está fantasiado ainda (${fantasiasDeTarde})`);
  ok(deTarde.caras === 0 && deTarde.halos === 0 && deTarde.luzinhas === 0 && deTarde.morcegos === 0 && deTarde.nessie === 0,
    `no convite (pôr do sol) nada acende (${JSON.stringify(deTarde)})`);
  const medir = async () => {
    await j(() => { window.jogo.debugPlace(0, 6, Math.PI / 4); window.jogo.setZoom(13); });
    await espera(1500);
    return j(() => window.jogo.renderer.info.render.calls);
  };
  const desenhosDeTarde = await medir();
  // a fase `festa`
  await naFaseConvite('villa-lobos', ['halloween:festa']);
  const deNoite = await acesos();
  ok(deNoite.fundo < 0.2, `o céu é de noite (claridade do fundo ${deNoite.fundo.toFixed(2)})`);
  ok(deNoite.caras > 0 && deNoite.halos >= 2 && deNoite.pocas >= 1, `as abóboras acesas: a cara, o halo e a poça (${deNoite.caras} caras, ${deNoite.halos} lotes de halo, ${deNoite.pocas} de poça)`);
  ok(deNoite.lanternas === 1 && deNoite.luzinhas === 1 && deNoite.lampadinhas === 1, `as lanternas e os varais de luzinha acesos (${JSON.stringify({ l: deNoite.lanternas, z: deNoite.luzinhas, b: deNoite.lampadinhas })})`);
  ok(deNoite.nessie === 1, 'o Nessie aceso, com a poça na água');
  ok(deNoite.noiteDosPostes === 1 && deNoite.corDosPostes === 0xffa64d, `as luzes dos postes de noite e cor de vela (${deNoite.noiteDosPostes}, #${deNoite.corDosPostes.toString(16)})`);
  // a medida de desenhos da noite vem ANTES das conversas: com a câmera de
  // perto ligada, ela contaria o parque inteiro
  const desenhosDeNoite = await medir();
  // as fantasias do parque (§3): cada um a sua, e só na festa
  const fantasias = await j(() => {
    const g = window.jogo;
    const n = {};
    g.scene.traverse((o) => { if (/^fantasia-/.test(o.name)) n[o.name] = (n[o.name] ?? 0) + 1; });
    const chapeu = g.scene.getObjectByName('chapeu-do-mano');
    const lencol = g.scene.getObjectByName('lencol-do-cookie');
    return { n, chapeuEscondido: chapeu ? !chapeu.visible : null, lencol: !!lencol };
  });
  ok(fantasias.n['fantasia-de-vampiro'] === 1 && fantasias.chapeuEscondido === true, `o Mano de vampiro, sem o chapéu de casquinha (${JSON.stringify(fantasias)})`);
  ok(fantasias.n['fantasia-de-fantasma'] === 1 && fantasias.lencol, 'o Cookie de fantasma de lençol');
  ok(fantasias.n['fantasia-da-opera'] === 1, 'o Jean-Luc de Fantasma da Ópera');
  ok((fantasias.n['fantasia-de-diabinho'] ?? 0) >= 4, `os patos de diabinho (${fantasias.n['fantasia-de-diabinho'] ?? 0})`);
  // a fala do Mano: com o Ari de capa de vampiro, ele repara
  await j(() => {
    const g = window.jogo;
    g.equipWearable(window.aristoryItens['capa-de-vampiro'], 'ari');
    let mano = null;
    g.current.world.root.traverse((o) => { if (o.userData?.peca === 'mano' && o.userData.bicho) mano = o.userData.bicho; });
    g.debugPlace(mano.x + 0.2, mano.z + 0.75, Math.PI);
  });
  await espera(1500);
  const promptDoMano = await j(() => document.querySelector('.prompt .label')?.textContent ?? '');
  ok(/Falar com o Mano/.test(promptDoMano), `o ponto da fala do Mano vampiro (${promptDoMano})`);
  await page.keyboard.press('KeyE');
  // a câmera chega perto antes da fala, e o balão digita letra por letra (o navegador do teste anda devagar)
  await page.waitForFunction(() => /Outro vampiro/.test(document.querySelector('.dialogue.show')?.textContent ?? ''), null, { timeout: 300000 }).catch(() => {});
  const falaDoMano = await j(() => document.querySelector('.dialogue.show')?.textContent ?? '');
  ok(/Outro vampiro/.test(falaDoMano) && /Ari/.test(falaDoMano), `o Mano repara no outro vampiro (${falaDoMano.slice(0, 80)})`);
  // até a câmera de perto devolver a isométrica (a medida de desenhos é da isométrica)
  for (let i = 0; i < 400 && (await j(() => !!window.jogo.cameraDeCena())); i++) {
    if (await j(() => !!document.querySelector('.dialogue.show'))) await page.keyboard.press('KeyE');
    await espera(400);
  }
  // a chama treme e os morcegos voam
  const quadro = () => j(() => {
    const g = window.jogo;
    const halo = g.scene.getObjectByName('halos-das-aboboras');
    const asas = g.scene.getObjectByName('asas-dos-morcegos');
    const m = new halo.matrix.constructor();
    asas.getMatrixAt(0, m);
    return { chama: halo.instanceColor.getX(0), asa: [...m.elements].slice(12, 15) };
  });
  const q1 = await quadro();
  await espera(700);
  const q2 = await quadro();
  ok(Math.abs(q1.chama - q2.chama) > 1e-4, `a chama das abóboras treme (${q1.chama.toFixed(3)} → ${q2.chama.toFixed(3)})`);
  ok(Math.hypot(q1.asa[0] - q2.asa[0], q1.asa[2] - q2.asa[2]) > 0.05, 'os morcegos voam em volta da roda');
  console.log(`  desenhos por quadro na alameda: pôr do sol ${desenhosDeTarde} -> noite ${desenhosDeNoite}`);
  await page.screenshot({ path: `${OUT}-noite-alameda.png` });
  for (const [nome, x, z, zoom] of [['praca', 2, -14, 24], ['lago', -13, 11, 13], ['boutique', -31, -16.5, 13]]) {
    await j(([x, z, zoom]) => { window.jogo.debugPlace(x, z, Math.PI / 4); window.jogo.setZoom(zoom); }, [x, z, zoom]);
    await espera(1500);
    await page.screenshot({ path: `${OUT}-noite-${nome}.png` });
  }
}

// ================================================================= fantasias
if (roda('fantasias')) {
  console.log('\nfantasias: na festa, quem veio do clube e da escola, fantasiado no parque (§3)');
  const fantasiasNaCena = () => j(() => {
    const n = {};
    window.jogo.scene.traverse((o) => { if (/^fantasia-/.test(o.name)) n[o.name] = (n[o.name] ?? 0) + 1; });
    return n;
  });
  // no convite, ninguém fantasiado (eles nem estão)
  await naFaseConvite('clube');
  const deTarde = await fantasiasNaCena();
  ok(Object.keys(deTarde).length === 0, `no convite ninguém está fantasiado no clube (${JSON.stringify(deTarde)})`);
  // na festa, todos no parque (sem precisar destravar nada: todos foram convidados)
  await naFaseConvite('villa-lobos', ['halloween:festa']);
  const noParque = await fantasiasNaCena();
  for (const [nome, quem] of [
    ['fantasia-de-noiva', 'a Gina de noiva do Frankenstein'], ['fantasia-de-tubarao', 'o Capy de tubarão'],
    ['fantasia-de-cientista', 'o Noel de cientista maluco'], ['fantasia-de-dragao', 'a Josefina de dragãozinho'],
    ['fantasia-de-walter', 'o Gatito de Walter'], ['fantasia-de-lobisomem', 'o Flynn de lobisomem'],
    ['fantasia-de-coruja', 'a Luna de coruja'], ['fantasia-de-catrina', 'a Sol de catrina'], ['fantasia-de-fada', 'a Estrella de fadinha'],
    ['fantasia-da-opera', 'o Jean-Luc da ópera (antes das cinco vitórias)'],
  ]) {
    ok(noParque[nome] === 1, `${quem} (${noParque[nome] ?? 0})`);
  }
  const escondidos = await j(() => {
    const g = window.jogo;
    let quepe = null;
    let viseira = null;
    g.scene.traverse((o) => {
      if (o.name === 'cabeca-da-girafa') quepe = o.children.find((c) => Math.abs(c.position.y - 0.135) < 1e-3 && Math.abs(c.position.z - 0.012) < 1e-3)?.visible ?? null;
      if (o.name === 'cabeca-do-noel') viseira = o.children.find((c) => Math.abs(c.position.y - 0.048) < 1e-3)?.visible ?? null;
    });
    return { quepe, viseira };
  });
  ok(escondidos.quepe === false && escondidos.viseira === false, `o quepe da Gina e a viseira do Noel ficam guardados (${JSON.stringify(escondidos)})`);
}

// ===================================================================== festa
if (roda('festa')) {
  console.log('\nfesta: os postos da festa e a conversa com a câmera de perto (§2.4.1, C)');
  await naFaseConvite('villa-lobos', ['halloween:festa']);
  /** cada bicho: onde está, se está à vista */
  const ondeEsta = () => j(() => {
    const lista = {};
    window.jogo.current.world.root.traverse((o) => {
      if (o.userData?.bicho && o.userData.bicho.group === o) lista[o.userData.peca] = { x: +o.position.x.toFixed(2), z: +o.position.z.toFixed(2), v: o.visible };
    });
    return lista;
  });
  const bichos = await ondeEsta();
  const POSTOS = { girafa: [34.5, 23.6], gatito: [-22.35, -26.35], flynn: [10.5, 2.0], josefina: [-16.6, -17.5] };
  for (const [peca, [x, z]] of Object.entries(POSTOS)) {
    const b = bichos[peca];
    ok(!!b && b.v && Math.hypot(b.x - x, b.z - z) < 0.6, `${peca} no posto da festa (${JSON.stringify(b)})`);
  }
  ok(bichos.noel?.v && Math.hypot(bichos.noel.x + 3.2, bichos.noel.z + 16.7) < 1.2, `o Noel do lado do carrinho (${JSON.stringify(bichos.noel)})`);
  ok(bichos.capy?.v === true, 'o Capy na beira do lago');
  ok(bichos['jean-luc']?.v === true && bichos.luna?.v && bichos.sol?.v && bichos.estrella?.v, 'o Jean-Luc e as três coelhinhas vieram (sem destravar nada)');
  ok(bichos.estella?.v === false, 'a Estella não está no xadrez (ficou na boutique)');
  const pecas = await j(() => {
    const n = {};
    window.jogo.scene.traverse((o) => { if (o.userData?.peca) n[o.userData.peca] = (n[o.userData.peca] ?? 0) + 1; });
    return { carrinho: n['carrinho-de-pocoes'] ?? 0, lousa: n['cavalete-de-pocoes'] ?? 0, canteiro: n['canteiro-de-aboboras'] ?? 0, bacia: n['bacia-de-macas'] ?? 0, pocao: !!window.jogo.scene.getObjectByName('pocao-borbulhando') };
  });
  ok(pecas.carrinho === 1 && pecas.lousa === 1 && pecas.canteiro === 1 && pecas.bacia === 1 && pecas.pocao,
    `o carrinho de poções, a lousa, o canteiro, a bacia e o caldeirão borbulhando (${JSON.stringify(pecas)})`);
  // a barraquinha de cachorro-quente do Walter: aberta, com a chapa ligada, a lâmpada e o recado dele
  const barraca = await j(() => {
    const s = window.jogo.scene;
    let b = null;
    s.traverse((o) => { if (!b && o.userData?.peca === 'barraca-do-walter') b = o; });
    if (!b) return null;
    const nomes = new Set();
    b.traverse((o) => { if (o.name) nomes.add(o.name); if (o.userData?.gigante) nomes.add('cachorro-quente-gigante'); });
    return {
      x: +b.position.x.toFixed(1), z: +b.position.z.toFixed(1),
      chapa: nomes.has('salsichas-na-chapa'), vapor: nomes.has('vapor-da-chapa'), lampada: nomes.has('lampada-da-barraca'),
      gigante: nomes.has('cachorro-quente-gigante'), painel: nomes.has('painel-do-walter'), cardapio: nomes.has('cardapio-do-walter'),
      recado: !!s.getObjectByName('recado-do-walter'),
    };
  });
  ok(!!barraca && barraca.chapa && barraca.vapor && barraca.lampada && barraca.gigante && barraca.painel && barraca.cardapio && barraca.recado,
    `a barraquinha do Walter aberta na praça da roda: a chapa, o vapor, a lâmpada, o cachorro-quente gigante, o painel, o cardápio e o recado (${JSON.stringify(barraca)})`);
  // (cada uma rola um quarto de volta a cada ~3 s de jogo, e o navegador do teste anda a ~1/5)
  const rolou = async () => j(() => {
    const im = window.jogo.scene.getObjectByName('salsichas-na-chapa');
    const m = new im.matrix.constructor();
    const giros = [];
    for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, m); giros.push(m.elements.slice(4, 7).map((v) => v.toFixed(2)).join(' ')); }
    return giros.join(' | ');
  });
  const r1 = await rolou();
  await espera(9000);
  const r2 = await rolou();
  ok(r1 !== r2, `as salsichas rolam na chapa (${r1} → ${r2})`);
  // o Walter (o ônibus já chegou): em cima do caixote atrás do balcão, a cabeça por cima do tampo
  /** o Walter da festa e o pé em que ele está */
  const walter = () => j(() => {
    let o = null;
    window.jogo.scene.traverse((b) => { if (!o && b.userData?.peca === 'garcom-canino' && b.userData.naFesta) o = b; });
    if (!o) return null;
    let topo = -9;
    o.updateMatrixWorld(true);
    o.traverse((m) => { if (m.isMesh) { m.geometry.computeBoundingBox(); topo = Math.max(topo, m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld).max.y); } });
    const recados = ['recado-do-walter', 'volto-ja-do-walter'].map((n) => window.jogo.scene.getObjectByName(n)?.visible ?? null);
    return { rumo: o.userData.naFesta.rumo(), y: +o.position.y.toFixed(2), topo: +topo.toFixed(2), visivel: o.visible, recados };
  });
  const noCaixote = await walter();
  ok(!!noCaixote && noCaixote.rumo === 'posto' && noCaixote.visivel && Math.abs(noCaixote.y - 0.8) < 0.02 && noCaixote.topo > 1.3 && noCaixote.recados.every((v) => v === false),
    `o Walter no caixote da barraca, aparecendo por cima do balcão, e nenhum recado pendurado (${JSON.stringify(noCaixote)})`);
  // de vez em quando ele sai (a primeira dica do final): o "volto já" aparece, e o recado diz isso
  // (o comentário da dupla, "Pra onde o Walter tá indo?", é conferido no fim desta parte, sozinho:
  // aqui ele abriria no meio das conversas que vêm depois)
  await j(() => window.jogo.setFlag('halloween:viu:walter-indo'));
  // (no passo de sempre: acelerado, a ida e a volta inteiras cabiam antes de o teste apertar o E, e o "volto já" já tinha saído)
  await j(() => { let o = null; window.jogo.scene.traverse((b) => { if (!o && b.userData?.naFesta) o = b; }); o.userData.naFesta.ritmo(1); o.userData.naFesta.sairAgora(); });
  await page.waitForFunction(() => { let o = null; window.jogo.scene.traverse((b) => { if (!o && b.userData?.naFesta) o = b; }); return o.userData.naFesta.rumo() !== 'posto'; }, null, { timeout: 60000 }).catch(() => {});
  // (o recado troca no quadro seguinte ao da saída; o navegador do teste anda a ~1 quadro por segundo)
  await page.waitForFunction(() => window.jogo.scene.getObjectByName('volto-ja-do-walter')?.visible === true, null, { timeout: 60000 }).catch(() => {});
  const saiu = await walter();
  ok(saiu.rumo !== 'posto' && saiu.recados[0] === false && saiu.recados[1] === true, `o Walter sai da barraca e pendura o "volto já" (${JSON.stringify(saiu)})`);
  await j(() => {
    const g = window.jogo;
    const it = g.current.world.interactables.find((i) => i.id === 'halloween:recado-Walter');
    g.debugPlace(it.x, it.z, Math.PI);
  });
  // (o prompt só troca no quadro seguinte: o E antes dele não lê nada)
  await page.waitForFunction(() => /recado/i.test(document.querySelector('.prompt .label')?.textContent ?? ''), null, { timeout: 60000 }).catch(() => {});
  await page.keyboard.press('KeyE');
  await page.waitForFunction(() => /salsichas/.test(document.querySelector('.dialogue.show')?.textContent ?? ''), null, { timeout: 120000 }).catch(() => {});
  const doWalter = await j(() => document.querySelector('.dialogue.show')?.textContent ?? '');
  ok(/volto já/.test(doWalter), `o recado do Walter na barraca (${doWalter.slice(0, 70)})`);
  await passarFalas();
  // (a dupla comenta a primeira saída dele; e ele volta para o caixote)
  await j(() => { let o = null; window.jogo.scene.traverse((b) => { if (!o && b.userData?.naFesta) o = b; }); o.userData.naFesta.chegar(); o.userData.naFesta.ritmo(1); });
  for (const [nome, de, para] of [['barraca', [-8.1, 1.7, -6.6], [-9.7, 1.0, -9.3]], ['balcao', [-8.6, 1.85, -7.9], [-9.8, 1.05, -9.5]]]) {
    await j(([de, para]) => { const T = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new T(...de), new T(...para)); }, [de, para]);
    await espera(1500);
    await page.screenshot({ path: `${OUT}-festa-walter-${nome}.png` });
  }
  await j(() => window.jogo.setCameraOmbro(null));

  // o que mexe: as bolhas do balão, a gota, o vapor do caldeirão e as maçãs boiando
  const vivo = () => j(() => {
    const s = window.jogo.scene;
    const m = new s.matrix.constructor();
    const ler = (nome, i = 0) => { const im = s.getObjectByName(nome); im.getMatrixAt(i, m); return m.elements[13]; };
    return { bolha: ler('bolhas-do-balao'), vapor: ler('vapor-da-pocao'), maca: ler('macas'), gota: s.getObjectByName('gota-do-alambique').position.y };
  });
  const v1 = await vivo();
  // (o navegador do teste anda a ~1 quadro por segundo: com menos de dois quadros a maçã mal sai do lugar)
  await espera(3000);
  const v2 = await vivo();
  ok(['bolha', 'vapor', 'maca', 'gota'].every((k) => Math.abs(v1[k] - v2[k]) > 1e-4), `as bolhas sobem, o vapor sai, a gota pinga e as maçãs boiam (${JSON.stringify({ v1, v2 })})`);
  const it = await interacoes();
  const fechadas = ['parque:estella', 'parque:xadrez', 'parque:inscricoes', 'parque:jean-luc', 'parque:luna', 'parque:sol', 'parque:estrella'];
  ok(fechadas.every((x) => it[x] === false), `a Estella, o xadrez, os desafios e as conversas de sempre fechados (${fechadas.map((x) => `${x}=${it[x]}`).join(' ')})`);
  ok(it['parque:cookie'] !== false && it['parque:roda-gigante'] !== false && it['parque:sorveteria'] !== false, 'a roda, o bilhete e o sorvete funcionam de noite');
  const festa = Object.keys(it).filter((x) => x.startsWith('halloween:festa-'));
  ok(festa.length === 13, `cada convidado com o seu "Falar com…" (${festa.length}: ${festa.map((x) => x.slice(16)).join(', ')})`);
  ok(it['halloween:recado-Recado'] === true, 'o recado dos desafios suspensos no quadro da arena');

  /** conversa com um convidado e mede a tomada de cena; devolve o primeiro balão */
  const conversar = async (peca, foto, fala = null) => {
    await j((peca) => {
      const g = window.jogo;
      let b = null;
      g.current.world.root.traverse((o) => { if (!b && o.userData?.peca === peca && o.userData.bicho) b = o.userData.bicho; });
      const ponto = g.current.world.interactables.find((i) => i.id === `halloween:festa-${peca}`);
      const r = Math.min(0.9, ponto.radius * 0.7);
      g.debugPlace(b.x + r * 0.7, b.z + r * 0.7, Math.PI * 1.25);
    }, peca);
    await espera(1200);
    const prompt = await j(() => document.querySelector('.prompt .label')?.textContent ?? '');
    await page.keyboard.press('KeyE');
    // as falas só começam com a câmera no lugar (e o navegador do teste anda devagar)
    await page.waitForFunction(() => !!document.querySelector('.dialogue.show'), null, { timeout: 120000 }).catch(() => {});
    // o balão digita letra por letra: espera a fala inteira (ou ao menos parar de crescer)
    if (fala) await page.waitForFunction((f) => new RegExp(f).test(document.querySelector('.dialogue.show')?.textContent ?? ''), fala.source, { timeout: 300000 }).catch(() => {});
    else await espera(4000);
    await espera(500);
    const tomada = await j((peca) => {
      const g = window.jogo;
      let b = null;
      g.current.world.root.traverse((o) => { if (!b && o.userData?.peca === peca && o.userData.bicho) b = o.userData.bicho; });
      const cam = g.cameraDeCena();
      if (!cam) return null;
      // quem fala no quadro (perto do meio) e a câmera perto dele
      const p = b.group.position.clone();
      p.y += 0.5;
      const ndc = p.clone().project(cam);
      const eu = g.playerPosition();
      const ate = Math.atan2(cam.position.x - b.x, cam.position.z - b.z);
      let d = ate - b.group.rotation.y;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      // a dupla não fica entre a câmera e ele
      const cx = cam.position.x - b.x;
      const cz = cam.position.z - b.z;
      const t = ((eu.x - b.x) * cx + (eu.z - b.z) * cz) / (cx * cx + cz * cz);
      const longeDaLinha = Math.hypot(eu.x - b.x - t * cx, eu.z - b.z - t * cz);
      return { dist: +Math.hypot(cx, cz).toFixed(2), ndc: [+ndc.x.toFixed(2), +ndc.y.toFixed(2)], viraPraCamera: +Math.abs(d).toFixed(2), longeDaLinha: +longeDaLinha.toFixed(2), travado: g.player.locked };
    }, peca);
    const balao = await j(() => document.querySelector('.dialogue.show')?.textContent ?? '');
    if (foto) await page.screenshot({ path: `${OUT}-festa-${foto}.png` });
    // até a câmera voltar: passa os balões, recusa as perguntas, e espera as pausas entre um e outro
    for (let i = 0; i < 400 && (await j(() => !!window.jogo.cameraDeCena())); i++) {
      // (a parada da caça pergunta "doces ou travessuras?": aqui, sempre doces)
      if (await j(() => !!document.querySelector('.escolhas.show') && /travessuras/i.test(document.querySelector('.dialogue.show')?.textContent ?? ''))) await page.keyboard.press('KeyE');
      else if (await j(() => !!document.querySelector('.escolhas.show'))) await page.keyboard.press('Escape');
      else if (await j(() => !!document.querySelector('.dialogue.show'))) await page.keyboard.press('KeyE');
      await espera(400);
    }
    const depois = await j(() => ({ cam: !!window.jogo.cameraDeCena(), travado: window.jogo.player.locked }));
    return { prompt, tomada, balao, depois };
  };
  const QUEM = [
    ['noel', 'Falar com o Noel', /BOA NOITE/, 'noel'],
    ['girafa', 'Falar com a Gina', /mais alta da festa/, 'gina'],
    ['capy', 'Falar com o Capy', /Tum-tum/, 'capy'],
    ['josefina', 'Falar com a Josefina', /dragão/, 'josefina'],
    ['gatito', 'Falar com o Gatito', /Au/, 'gatito'],
    ['flynn', 'Falar com o Flynn', /Lobisomem/, 'flynn'],
    ['jean-luc', 'Falar com o Jean-Luc', /Fantôme/, 'jeanluc'],
    ['luna', 'Falar com a Luna', /coruja/, 'luna'],
    ['garcom-canino', 'Falar com o Walter', /Au! Au!/, 'walter'],
  ];
  for (const [peca, rotulo, fala, foto] of QUEM) {
    // (o Walter sai para trás da roda no relógio dele: a conversa é com ele de volta no caixote)
    if (peca === 'garcom-canino') {
      await j(() => { let o = null; window.jogo.scene.traverse((b) => { if (!o && b.userData?.naFesta) o = b; }); o.userData.naFesta.chegar(); });
    }
    const r = await conversar(peca, foto, fala);
    const t = r.tomada;
    ok(r.prompt === rotulo, `${peca}: o ponto "${rotulo}" (${r.prompt})`);
    ok(!!t && t.travado && t.dist < 6 && Math.abs(t.ndc[0]) < 0.6 && Math.abs(t.ndc[1]) < 0.7,
      `${peca}: a câmera chega perto e ele fica no meio do quadro (${JSON.stringify(t)})`);
    ok(!!t && t.longeDaLinha > 0.35, `${peca}: a dupla não tapa quem fala (${t?.longeDaLinha})`);
    if (!/luna/.test(peca)) ok(!!t && t.viraPraCamera < 0.9, `${peca}: virado para a câmera (${t?.viraPraCamera})`);
    ok(fala.test(r.balao), `${peca}: a fala da fantasia (${r.balao.slice(0, 60)})`);
    ok(!r.depois.cam && !r.depois.travado, `${peca}: no fim a isométrica volta e a dupla anda`);
  }
  // o Mano repara no vampiro (o Ari de capa) e o Gatito conta que veio de Walter
  await j(() => window.jogo.equipWearable(window.aristoryItens['capa-de-vampiro'], 'ari'));
  const mano = await conversar('mano', 'mano', /Outro vampiro/);
  ok(/Outro vampiro/.test(mano.balao) && /Ari/.test(mano.balao), `o Mano repara no outro vampiro (${mano.balao.slice(0, 60)})`);
  // o Cookie: a fantasia e, ainda de perto, o bilhete de sempre
  const cookie = await conversar('cookie', 'cookie', /Buu/);
  ok(/Buu/.test(cookie.balao) && !cookie.depois.cam && !cookie.depois.travado, `o Cookie de lençol, e a conversa do bilhete emenda (${cookie.balao.slice(0, 40)})`);
  // a segunda conversa é curta
  const deNovo = await conversar('noel');
  ok(!/BOA NOITE/.test(deNovo.balao) && deNovo.balao.length > 5, `na segunda vez, uma fala curta (${deNovo.balao.slice(0, 60)})`);
  // a primeira vez que a dupla vê o Walter indo para trás da roda, comenta (e só depois que o balão fecha)
  await j(() => { window.jogo.setFlag('halloween:viu:walter-indo', false); window.jogo.debugPlace(-8.2, -7.6, Math.PI / 4); });
  // (no passo de sempre: acelerado, a ~1 quadro por segundo ele já sumia dos 12 m no quadro seguinte)
  await j(() => { let o = null; window.jogo.scene.traverse((b) => { if (!o && b.userData?.naFesta) o = b; }); o.userData.naFesta.ritmo(1); o.userData.naFesta.sairAgora(); });
  let comentario = '';
  for (let i = 0; i < 120 && !/Pra onde o Walter/.test(comentario); i++) {
    await j((k) => window.jogo.debugPlace(-8.2 + (k % 2) * 0.05, -7.6, Math.PI / 4), i);
    await espera(400);
    comentario = await j(() => document.querySelector('.dialogue.show')?.textContent ?? '');
  }
  // (o balão digita letra por letra: espera a fala inteira)
  await page.waitForFunction(() => /Pra onde o Walter tá indo\?/.test(document.querySelector('.dialogue.show')?.textContent ?? ''), null, { timeout: 120000 }).catch(() => {});
  comentario = await j(() => document.querySelector('.dialogue.show')?.textContent ?? '');
  ok(/Pra onde o Walter tá indo/.test(comentario), `a dupla repara no Walter indo para trás da roda (${comentario.slice(0, 50)})`);
  await passarFalas();
  await j(() => { let o = null; window.jogo.scene.traverse((b) => { if (!o && b.userData?.naFesta) o = b; }); o.userData.naFesta.chegar(); o.userData.naFesta.ritmo(1); });
  // as fotos de longe dos postos
  for (const [nome, x, z, zoom] of [['carrinho', -2.6, -14.4, 8], ['canteiro', -16.4, -16.2, 8], ['lago', -11.4, 17.8, 9], ['ponto', 35.2, 25.2, 9], ['piquenique', -22.6, -25.6, 8], ['campinho', 11.4, 3.6, 9]]) {
    await j(([x, z, zoom]) => { window.jogo.debugPlace(x, z, Math.PI / 4); window.jogo.setZoom(zoom); }, [x, z, zoom]);
    await espera(1600);
    await page.screenshot({ path: `${OUT}-festa-longe-${nome}.png` });
  }
  // no convite (o pôr do sol), a barraquinha já está lá, fechada: o pano no balcão e nada na chapa
  await naFaseConvite('villa-lobos');
  const fechada = await j(() => {
    const s = window.jogo.scene;
    let b = null;
    let pano = 0;
    s.traverse((o) => {
      if (!b && o.userData?.peca === 'barraca-do-walter') b = o;
    });
    if (!b) return null;
    s.traverse((o) => { if (o.userData?.peca === 'pano-de-fechado' && Math.hypot(o.position.x - b.position.x, o.position.z - b.position.z) < 1.5) pano++; });
    return { chapa: !!b.getObjectByName('salsichas-na-chapa'), lampada: !!b.getObjectByName('lampada-da-barraca'), pano, recado: !!s.getObjectByName('recado-do-walter') };
  });
  ok(!!fechada && !fechada.chapa && !fechada.lampada && fechada.pano === 1 && !fechada.recado, `no convite a barraquinha espera fechada, com o pano de FECHADO (${JSON.stringify(fechada)})`);

  // o clube, o Mania, a estufa e a escola ficam vazios na festa (estão todos no parque)
  for (const [cena, sumidos] of [['clube', ['girafa', 'capy', 'josefina', 'noel']], ['mania-de-churrasco', ['garcom-canino']], ['estufa', ['josefina']], ['escola', ['gatito']]]) {
    await naFaseConvite(cena, ['halloween:festa', 'estufa-aberta']);
    const b = await bichosNaCena();
    ok(sumidos.every((x) => b[x] === false), `${cena}: vazio na festa (${JSON.stringify(b)})`);
  }
}

// ===================================================================== onibus
if (roda('onibus')) {
  console.log('\nonibus: a chegada da turma no ônibus da festa (§2.4.1, B)');
  // a dupla sai da boutique na noite da festa, e o ônibus ainda não chegou
  await naFaseConvite('villa-lobos&entrada=da-lojinha', ['halloween:festa', 'halloween:sem-onibus']);
  const quadro = () => j(() => {
    const g = window.jogo;
    let bus = null;
    const bichos = {};
    g.current.world.root.traverse((o) => {
      if (!bus && o.userData?.peca === 'onibus-da-cidade') bus = o;
      if (o.userData?.bicho && o.userData.bicho.group === o) bichos[o.userData.peca] = { x: +o.position.x.toFixed(2), y: +o.position.y.toFixed(2), z: +o.position.z.toFixed(2), v: o.visible };
    });
    const o = bus.userData.onibus;
    const rodas = bus.getObjectByName('rodas');
    const m = new rodas.matrix.constructor();
    rodas.getMatrixAt(0, m);
    return {
      bus: {
        z: +bus.position.z.toFixed(2), pitch: +bus.rotation.z.toFixed(4), porta: +o.aberta.toFixed(2),
        farol: bus.getObjectByName('farois-acesos').visible, destino: o.destino, giroDaRoda: +m.elements[0].toFixed(3),
      },
      bichos, cam: !!g.cameraDeCena(), travado: g.player.locked, fala: document.querySelector('.dialogue.show')?.textContent ?? '',
      chegou: g.flag('halloween:onibus-chegou'), sons: Object.fromEntries(g.audio.contagem),
    };
  });
  const PASSAGEIROS = ['girafa', 'capy', 'noel', 'garcom-canino', 'gatito', 'flynn', 'luna', 'sol', 'estrella', 'josefina'];
  const antes = await quadro();
  ok(antes.bus.destino === 'Festa no Parque', `na festa, o letreiro do ônibus do ponto diz "${antes.bus.destino}"`);
  ok(antes.bus.z < -20 && antes.travado && PASSAGEIROS.every((p) => antes.bichos[p]?.v === false),
    `a cena começa sozinha: a dupla presa, o ônibus lá longe na rua e a turma ainda dentro dele (${antes.bus.z})`);
  // as falas, uma a uma: o que cada uma pede para medir
  const vistas = [];
  const medidas = {};
  let ultima = '';
  for (let i = 0; i < 2400; i++) {
    const q = await quadro();
    if (q.chegou && !q.cam && !q.travado) break;
    if (q.fala && q.fala !== ultima) {
      await espera(450);
      const q2 = await quadro();
      if (q2.fala === q.fala) {
        ultima = q.fala;
        vistas.push(q.fala.replace(/clique \/ E.*$/, ''));
        if (/abaixa, Gina/.test(q.fala)) { medidas.gina = q2; await page.screenshot({ path: `${OUT}-onibus-gina-porta.png` }); }
        if (/noiva chegou/.test(q.fala)) { medidas.ginaFala = q2; await page.screenshot({ path: `${OUT}-onibus-gina.png` }); }
        if (/Tubarão também/.test(q.fala)) await page.screenshot({ path: `${OUT}-onibus-capy.png` });
        if (/CHEGUEI/.test(q.fala)) await page.screenshot({ path: `${OUT}-onibus-noel.png` });
        if (/abre em cinco minutos/.test(q.fala)) await page.screenshot({ path: `${OUT}-onibus-walter.png` });
        if (/ele aprovou/.test(q.fala)) await page.screenshot({ path: `${OUT}-onibus-gatito.png` });
        if (/Pulei o degrau/.test(q.fala)) await page.screenshot({ path: `${OUT}-onibus-flynn.png` });
        if (/Llegamos/.test(q.fala)) await page.screenshot({ path: `${OUT}-onibus-coelhinhas.png` });
        if (/motorista/.test(q.fala)) { medidas.josefina = q2; await page.screenshot({ path: `${OUT}-onibus-josefina.png` }); }
        if (/primeira pista/.test(q.fala)) { medidas.fim = q2; await page.screenshot({ path: `${OUT}-onibus-fim.png` }); }
        if (/Ouviu isso/.test(q.fala)) await page.screenshot({ path: `${OUT}-onibus-boutique.png` });
        await page.keyboard.press('KeyE');
      }
    } else if (!q.fala && q.cam && i % 25 === 0) {
      await page.screenshot({ path: `${OUT}-onibus-voo-${String(i).padStart(4, '0')}.png` });
    }
    await espera(350);
  }
  const fim = await quadro();
  console.log('  falas:', vistas.length);
  for (const [re, quem] of [[/anoiteceu/, 'a dupla na boutique'], [/abaixa, Gina/, 'a Gina'], [/Tum-tum/, 'o Capy'], [/CHEGUEI/, 'o Noel'], [/Au! Au!/, 'o Walter'], [/Eu vim de Walter/, 'o Gatito'], [/AUUU/, 'o Flynn'], [/Llegamos/, 'a Luna'], [/Épale/, 'a Sol'], [/estrelinha de fada/, 'a Estrella'], [/motorista/, 'a Josefina'], [/primeira pista/, 'o fim']]) {
    ok(vistas.some((f) => re.test(f)), `${quem} fala (${re})`);
  }
  ok(!!medidas.gina && medidas.gina.bus.z === 10.4 && medidas.gina.bus.porta === 1 && medidas.gina.bus.farol,
    `o ônibus parou no ponto, de farol aceso, e a porta abriu (${JSON.stringify(medidas.gina?.bus)})`);
  ok(!!medidas.gina && medidas.gina.bus.giroDaRoda !== antes.bus.giroDaRoda, `as rodas giraram no caminho (${antes.bus.giroDaRoda} → ${medidas.gina?.bus.giroDaRoda})`);
  ok(!!medidas.gina && medidas.gina.bichos.girafa.v && medidas.gina.bichos.girafa.x > 37.5 && medidas.gina.bichos.girafa.y > 0.5,
    `a Gina aparece na porta, em cima do degrau (${JSON.stringify(medidas.gina?.bichos.girafa)})`);
  ok(!!medidas.ginaFala && Math.abs(medidas.ginaFala.bichos.girafa.x - 35.55) < 0.4 && medidas.ginaFala.bichos.girafa.y === 0,
    `e fala na calçada, no chão (${JSON.stringify(medidas.ginaFala?.bichos.girafa)})`);
  ok(['buzina', 'motorDoOnibus', 'freioDoOnibus', 'portaDoOnibus'].every((s) => (fim.sons[s] ?? 0) >= 1) && (fim.sons.portaDoOnibus ?? 0) >= 2,
    `a buzina, o motor, o freio e a porta (abrindo e fechando) (${['buzina', 'motorDoOnibus', 'freioDoOnibus', 'portaDoOnibus'].map((s) => `${s}×${fim.sons[s] ?? 0}`).join(' ')})`);
  ok(fim.chegou && !fim.cam && !fim.travado, 'no fim a isométrica volta, a dupla anda, e a chegada fica no save');
  ok(fim.bus.z === 10.4 && fim.bus.pitch === 0 && fim.bus.porta === 0 && !fim.bus.farol,
    `o ônibus fica no ponto: porta fechada e o farol apagado (${JSON.stringify(fim.bus)})`);
  const POSTOS = { girafa: [34.5, 23.6], gatito: [-22.35, -26.35], flynn: [10.5, 2.0], josefina: [-16.6, -17.5], 'garcom-canino': [-9.89, -9.61] };
  for (const [peca, [x, z]] of Object.entries(POSTOS)) {
    const b = fim.bichos[peca];
    ok(!!b && b.v && Math.hypot(b.x - x, b.z - z) < 0.7, `${peca} já no posto da festa (${JSON.stringify(b)})`);
  }
  ok(['capy', 'noel', 'luna', 'sol', 'estrella'].every((p) => fim.bichos[p]?.v), 'o Capy, o Noel e as coelhinhas à vista nos postos');
  ok(await j(() => window.jogo.save.memories.some((m) => m.id === 'halloween-a-noite-da-festa')), 'vira a memória "A noite da festa"');
  // recarregando, a chegada não se repete
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(2000);
  const outra = await quadro();
  ok(!outra.travado && !outra.cam && outra.bus.z === 10.4 && outra.bichos['garcom-canino']?.v, 'recarregando, a chegada não se repete (e o Walter está na barraca)');
}

// ======================================================================= caca
if (roda('caca')) {
  console.log('\ncaca: doces ou travessuras — as dez paradas, as balas e as abóboras escondidas (§5.3, §6)');
  // (o Cookie já apresentado: a apresentação dele de sempre é longa, e não é dela que se trata aqui)
  await naFaseConvite('villa-lobos', ['halloween:festa', 'cookie-apresentado']);
  const estado = () => j(() => {
    const g = window.jogo;
    const marca = g.scene.getObjectByName('marca-da-proxima-parada');
    const c = marca?.userData.caca;
    const cesta = document.querySelector('.cesta-de-balas');
    const lote = g.scene.getObjectByName('aboboras-escondidas');
    return {
      feitas: c?.feitas(), balas: c?.balas(),
      cesta: cesta?.classList.contains('show') ? cesta.textContent : null,
      marca: marca ? { v: marca.visible, x: +marca.position.x.toFixed(2), y: +marca.position.y.toFixed(2), z: +marca.position.z.toFixed(2) } : null,
      escondidas: lote?.visible ?? null,
    };
  });
  /** onde está um bicho (pela etiqueta) */
  const bichoEm = (peca) => j((peca) => {
    let b = null;
    window.jogo.current.world.root.traverse((o) => { if (!b && o.userData?.peca === peca && o.userData.bicho) b = o.userData.bicho; });
    return b ? { x: b.x, z: b.z } : null;
  }, peca);
  /**
   * conversa com um convidado e responde a caça: `escolha(pergunta)` diz o
   * índice da opção; a agulha da hora certa para com o E (e a foto dela sai
   * uma vez); devolve tudo o que foi dito
   */
  const naParada = async (peca, escolha = () => 0, foto = null) => {
    // (`escolha` recebe os rótulos dos botões e devolve o índice)
    await j((peca) => {
      const g = window.jogo;
      let b = null;
      g.current.world.root.traverse((o) => { if (!b && o.userData?.peca === peca && o.userData.bicho) b = o.userData.bicho; });
      const ponto = g.current.world.interactables.find((i) => i.id === `halloween:festa-${peca}`);
      const r = Math.min(0.9, ponto.radius * 0.7);
      g.debugPlace(b.x + r * 0.7, b.z + r * 0.7, Math.PI * 1.25);
    }, peca);
    await espera(1200);
    await page.keyboard.press('KeyE');
    await page.waitForFunction(() => !!document.querySelector('.dialogue.show'), null, { timeout: 120000 }).catch(() => {});
    const ditos = [];
    let agulha = null;
    /*
     * UMA leitura por passo: na tomada de perto o navegador do teste anda a
     * meio quadro por segundo, e cada `evaluate` espera o quadro. O balão
     * ainda digitando (`ui.typing`) não é lido nem escolhido — na pergunta,
     * o E no meio da digitação já escolheria.
     */
    const tela = () => j(() => {
      const d = document.querySelector('.dialogue.show');
      return {
        vivo: !!window.jogo.cameraDeCena() || !!d,
        show: !!d,
        digitando: window.jogo.ui.typing !== null,
        quem: d?.querySelector('.who')?.textContent ?? '',
        texto: d?.querySelector('.text')?.textContent ?? '',
        escolhas: [...document.querySelectorAll('.escolhas.show button')].map((b) => b.textContent),
        agulha: !!document.querySelector('.dialogue .hora-certa.show'),
      };
    });
    for (let i = 0; i < 400; i++) {
      const t = await tela();
      if (!t.vivo) break;
      if (!t.show || (t.digitando && t.escolhas.length)) { await espera(500); continue; }
      if (t.digitando) { await page.keyboard.press('KeyE'); await espera(300); continue; }
      if (t.escolhas.length) {
        ditos.push(`${t.quem}: ${t.texto} [${t.escolhas.join(' | ')}]`);
        const k = escolha(t.escolhas);
        for (let n = 0; n < k; n++) { await page.keyboard.press('ArrowRight'); await espera(150); }
      } else if (t.agulha) {
        ditos.push(`${t.quem}: ${t.texto} [agulha]`);
        if (!agulha) {
          if (foto) await page.screenshot({ path: `${OUT}-caca-${foto}-agulha.png` });
          agulha = await j(() => ({ texto: document.querySelector('.dialogue.show .text')?.textContent, zona: document.querySelector('.hora-certa .zona').style.width }));
        }
      } else ditos.push(`${t.quem}: ${t.texto}`);
      await page.keyboard.press('KeyE');
      // (espera o balão trocar, ou fechar)
      for (let k = 0; k < 40; k++) {
        await espera(400);
        const d = await j(() => document.querySelector('.dialogue.show .text')?.textContent ?? null);
        if (d !== t.texto) break;
      }
    }
    return { ditos, agulha, tudo: ditos.join(' ‖ ') };
  };

  // o começo: a cesta no canto, a abóbora em cima do Mano, as escondidas no parque
  await espera(1500);
  let e = await estado();
  const mano = await bichoEm('mano');
  ok(e.feitas === 0 && e.balas === 0 && /0\s*\/25/.test(e.cesta ?? ''), `a caça começa: a cesta no canto, vazia (${JSON.stringify(e)})`);
  ok(!!e.marca && e.marca.v && !!mano && Math.hypot(e.marca.x - mano.x, e.marca.z - mano.z) < 0.05 && e.marca.y > 1.2,
    `a abóbora acesa flutua em cima do Mano, a primeira parada (${JSON.stringify(e.marca)} · ${JSON.stringify(mano)})`);
  ok(e.escondidas === true, 'as abóboras escondidas acesas pelo parque');
  await j((m) => { window.jogo.debugPlace(m.x + 2.6, m.z + 2.6, Math.PI * 1.25); window.jogo.setZoom(9); }, mano);
  await espera(1800);
  await page.screenshot({ path: `${OUT}-caca-marca.png` });

  // quem chega cedo: o Cookie ainda não é a vez
  const cedo = await naParada('cookie');
  ok(/Ainda não é a minha vez/.test(cedo.tudo) && !/travessuras\?/i.test(cedo.tudo), `o Cookie antes da vez pede para seguir o mapinha (${cedo.tudo.slice(-90)})`);
  ok((await estado()).feitas === 0, 'e a caça não anda');

  // a parada 1, o Mano: doces (3 balas) e a pista do Cookie
  const p1 = await naParada('mano', () => 0);
  e = await estado();
  ok(/Doces ou travessuras! 🎃/.test(p1.tudo) && /doces… ou travessuras\?/.test(p1.tudo), `o Mano pergunta "doces ou travessuras?" (${p1.ditos.join(' ‖ ').slice(0, 260)})`);
  ok(/Bala de abóbora/.test(p1.tudo) && e.balas === 3 && e.feitas === 1, `doces: a bala de abóbora, 3 na cesta, e a parada feita (${JSON.stringify(e)})`);
  ok(/nunca coube na cabine/.test(p1.tudo), 'a pista do Cookie');
  ok(/3\s*\/25/.test(e.cesta ?? ''), `a cesta conta (${e.cesta})`);
  const cookie = await bichoEm('cookie');
  ok(!!e.marca && Math.hypot(e.marca.x - cookie.x, e.marca.z - cookie.z) < 0.4, `a abóbora passa para o Cookie (${JSON.stringify(e.marca)})`);

  // a parada 2, o Cookie: travessura (a agulha) — de 1 a 5 balas
  const p2 = await naParada('cookie', (ops) => (ops[0].includes('Doces') ? 1 : 0), 'cookie');
  e = await estado();
  ok(!!p2.agulha && /BU de volta/.test(p2.agulha.texto ?? ''), `a travessura do Cookie é de tempo: a agulha embaixo da fala (${JSON.stringify(p2.agulha)})`);
  ok(e.feitas === 2 && e.balas >= 4 && e.balas <= 8, `de 1 a 5 balas na travessura (${e.balas - 3}), e a parada feita`);
  ok(/campinho/.test(p2.tudo), 'a pista do Flynn');
  ok(await j(() => window.jogo.stat('halloween:doces') === 1 && window.jogo.stat('halloween:travessuras') === 1), 'um doce e uma travessura no save');

  // o mapinha: o Mano e o Cookie com o tique, a pista do Flynn por extenso
  await j(() => window.jogo.addItem(window.aristoryItens['mapinha-da-estella']));
  await j(() => window.jogo.setActiveHandSlot(window.jogo.handItems().findIndex((i) => i?.id === 'mapinha-da-estella')));
  await j(() => window.jogo.debugPlace(0, 30, 0));
  await espera(1200);
  await page.keyboard.press('KeyE');
  await espera(2500);
  await page.screenshot({ path: `${OUT}-caca-mapinha.png` });
  await page.keyboard.press('Escape');
  await espera(800);

  // a parada 7, o Gatito: a pergunta de português (bruxa = 5 balas)
  await j(() => window.jogo.bump('halloween:caca', 4));
  const antes7 = (await estado()).balas;
  const p7 = await naParada('gatito', (ops) => (ops.includes('Bruxa') ? ops.indexOf('Bruxa') : 1));
  e = await estado();
  ok(/bruja/.test(p7.tudo) && /Bruxa, com X/.test(p7.tudo) && e.balas - antes7 === 5 && e.feitas === 7, `o Gatito pergunta "bruja": acertou, 5 balas (${e.balas - antes7})`);

  // as abóboras escondidas: pegar uma dá uma bala e ela some
  const ponto = await j(() => window.jogo.scene.getObjectByName('marca-da-proxima-parada').userData.caca.escondidas[1]);
  await j((p) => { window.jogo.debugPlace(p.x + 0.7, p.z + 0.7, Math.PI * 1.25); window.jogo.setZoom(7); }, ponto);
  await espera(1800);
  await page.screenshot({ path: `${OUT}-caca-escondida.png` });
  const antesDaAbobora = (await estado()).balas;
  const rotulo = await j(() => document.querySelector('.prompt .label')?.textContent ?? '');
  ok(rotulo === 'Pegar a abóbora escondida', `perto dela, "Pegar a abóbora escondida" (${rotulo})`);
  await page.keyboard.press('KeyE');
  await espera(1500);
  await passarFalas();
  const abobora = await j(() => {
    const g = window.jogo;
    const lote = g.scene.getObjectByName('aboboras-escondidas');
    const im = lote.getObjectByName('casca-pequena');
    const m = new g.scene.matrix.constructor();
    im.getMatrixAt(1, m);
    return { flag: g.flag('halloween:abobora-escondida:1'), escala: m.elements[0], ponto: g.current.world.interactables.find((i) => i.id === 'halloween:abobora-escondida-1')?.enabled };
  });
  e = await estado();
  ok(abobora.flag && abobora.escala === 0 && abobora.ponto === false && e.balas === antesDaAbobora + 1, `pegou: +1 bala, e ela some (${JSON.stringify(abobora)})`);

  // a última parada, o Noel: a pista do final e a conta da porta
  await j(() => window.jogo.bump('halloween:caca', 2));
  const p10 = await naParada('noel', (ops) => (ops[0].includes('Doces') ? 1 : 0));
  e = await estado();
  ok(/Pó de estrela/.test(p10.tudo) && /porta laranja/.test(p10.tudo) && e.feitas === 10, `o Noel: a poção e a pista do final (${e.feitas})`);
  ok(/Faltam \d+|cesta tá cheia/.test(p10.tudo), `e a dupla faz a conta da porta (${p10.ditos.slice(-2).join(' ‖ ')})`);
  ok(!e.marca?.v, 'com a caça feita, a abóbora da próxima parada some');
  await j(() => window.jogo.setActiveHandSlot(window.jogo.handItems().findIndex((i) => i?.id === 'mapinha-da-estella')));
  await j(() => window.jogo.debugPlace(0, 30, 0));
  await espera(1200);
  await page.keyboard.press('KeyE');
  await espera(2500);
  await page.screenshot({ path: `${OUT}-caca-mapinha-final.png` });
  await page.keyboard.press('Escape');
  await espera(800);

  // recarregando: a abóbora pega continua sumida, e a cesta continua com as balas
  const balasAntes = e.balas;
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await espera(2500);
  const depois = await j(() => {
    const g = window.jogo;
    const im = g.scene.getObjectByName('aboboras-escondidas').getObjectByName('casca-pequena');
    const m = new g.scene.matrix.constructor();
    im.getMatrixAt(1, m);
    const outra = new g.scene.matrix.constructor();
    im.getMatrixAt(2, outra);
    return { escala: m.elements[0], outra: outra.elements[0], cesta: document.querySelector('.cesta-de-balas.show')?.textContent ?? null };
  });
  ok(depois.escala === 0 && depois.outra > 0 && new RegExp(`${balasAntes}\\s*/25`).test(depois.cesta ?? ''), `no F5 a abóbora pega continua sumida e a cesta cheia como estava (${JSON.stringify(depois)})`);
  // e fora da festa (o convite) não há cesta nem abóbora escondida
  await naFaseConvite('villa-lobos');
  const convite = await j(() => ({ cesta: !!document.querySelector('.cesta-de-balas.show'), lote: window.jogo.scene.getObjectByName('aboboras-escondidas')?.visible ?? null }));
  ok(!convite.cesta && !convite.lote, `no convite (o pôr do sol), nem cesta nem abóbora escondida (${JSON.stringify(convite)})`);
}

console.log(erros.length ? '\nERROS:\n' + erros.join('\n') : '\nsem erros');
await browser.close();
if (problemas.length || erros.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
