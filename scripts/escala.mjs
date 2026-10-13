/**
 * A ESCALA DO WALTER — o menu dos turnos do Mania (§13 de
 * `docs/MINIGAME-RESTAURANTE.md`).
 *
 * Ele MEDE o que a escala promete, e fotografa o painel:
 *
 * - a escala abre o PAINEL (e não mais a pergunta "Começar o turno?"), com
 *   os seis turnos: o 1 aberto e os outros trancados num save novo; a aba das
 *   melhorias mostra as sete; "agora não" e o Escape fecham sem começar nada;
 * - A TRAVA DO RENAN: o turno seguinte só abre com três estrelas no anterior.
 *   Três estrelas no turno 1 dão a gravatinha e abrem o 2; três no 2 dão o
 *   AVENTAL e abrem o 3;
 * - OS PETISCOS: um por estrela, no fim de TODO turno — inclusive turno já
 *   vencido, que é o que faz rejogar valer a pena;
 * - o prêmio vem UMA vez só: rejogar o turno 2 não dá um segundo avental, e
 *   uma estrela depois das três não apaga as três nem o recorde;
 * - QUEM JÁ JOGOU NÃO PERDE NADA: o save de antes da temporada (a gravatinha,
 *   o `turno-recorde`) vira o turno 1 com as estrelas e os petiscos certos, e
 *   isso acontece uma vez só;
 * - no celular a lousa cabe na tela e o lado de cada linha não tapa o texto.
 *
 * O FIM DO TURNO É FORÇADO por dentro (o caixa do dia e o relógio): um turno
 * de verdade leva minutos de relógio no Chromium sem placa, e o que se prova
 * aqui é a conta da escala, não o salão — o salão é do `scripts/turno.mjs`.
 *
 * Uso: node scripts/escala.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './escala';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const CHAVE_DO_SAVE = 'aristory.save.v1';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const erros = [];
const falhas = [];
const checar = (ok, msg) => { if (!ok) falhas.push(msg); };

const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const irPara = (x, z, f = 0) => page.evaluate(([px, pz, ff]) => window.jogo.debugPlace(px, pz, ff), [x, z, f]);
const turno = () => page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  return { rodando: t.rodando, numero: t.turno.numero };
});
const lerSave = () => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? '{}'), CHAVE_DO_SAVE);

/** troca o save inteiro (ou só os campos dados) e recarrega o Mania */
const comSave = async (patch, limpar = false) => {
  await page.evaluate(([k, p, l]) => {
    const s = l ? {} : JSON.parse(localStorage.getItem(k) ?? '{}');
    s.flags = { ...(s.flags ?? {}), ...(p.flags ?? {}) };
    s.stats = { ...(s.stats ?? {}), ...(p.stats ?? {}) };
    localStorage.setItem(k, JSON.stringify(s));
  }, [CHAVE_DO_SAVE, patch, limpar]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.jogo?.current?.world?.root?.userData?.turno, null, { timeout: 60000 });
  await page.waitForTimeout(1500);
};

/** vai até a escala e aperta E; passa as falas de primeira vez até o painel abrir */
const abrirAEscala = async () => {
  let rotulo = null;
  for (let i = 0; i < 20 && !rotulo; i++) {
    await irPara(2.4, -7.5);
    await page.waitForTimeout(350);
    const t = (await prompt()) ?? '';
    if (/escala/i.test(t)) rotulo = t;
  }
  await page.keyboard.press('KeyE');
  for (let i = 0; i < 60 && !(await page.locator('.escala-do-walter.show').count()); i++) {
    if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
  return rotulo;
};

/** o que o painel mostra agora */
const painel = () => page.evaluate(() => {
  const raiz = document.querySelector('.escala-do-walter');
  return {
    aberto: raiz.classList.contains('show'),
    petiscos: raiz.querySelector('.petiscos')?.textContent?.trim() ?? '',
    botao: raiz.querySelector('.comecar')?.textContent ?? '',
    botaoLigado: !raiz.querySelector('.comecar')?.disabled,
    turnos: [...raiz.querySelectorAll('.linha')].map((t) => ({
      n: Number(t.dataset.numero),
      estado: ['aberto', 'trancado', 'em-preparo'].find((c) => t.classList.contains(c)),
      marcado: t.classList.contains('marcado'),
      estrelas: t.querySelectorAll('.estrela.cheia').length,
      premioGanho: !!t.querySelector('.premio.ganho'),
      texto: t.textContent.replace(/\s+/g, ' ').trim(),
    })),
    melhorias: raiz.querySelectorAll('.melhoria').length,
  };
});

/** passa todas as falas até o salão ficar quieto de novo (o fim do turno conversa bastante) */
const vencerAsFalas = async () => {
  let quieto = 0;
  for (let i = 0; i < 160 && quieto < 6; i++) {
    if (await page.locator('.dialogue.show').count()) {
      quieto = 0;
      await page.keyboard.press('KeyE');
    } else {
      quieto += 1;
    }
    await page.waitForTimeout(380);
  }
};

/**
 * Joga um turno "de mentira": começa pelo painel e fecha o dia com o caixa
 * dado. Os clientes que já tiverem entrado saem por dentro.
 */
const jogarComCaixa = async (numero, dinheiro) => {
  await abrirAEscala();
  const linha = page.locator(`.escala-do-walter .linha[data-numero="${numero}"]`);
  // os dois tempos: o primeiro clique marca, o segundo começa
  await linha.click();
  if (await page.locator('.escala-do-walter.show').count()) await linha.click();
  await vencerAsFalas();
  const comecou = await turno();
  await page.evaluate((d) => {
    const t = window.jogo.current.world.root.userData.turno;
    for (const c of [...t.clientes]) t.apagarCliente(c);
    t.proximaChegada = 999;
    t.dinheiro = d;
    t.tempo = 0;
  }, dinheiro);
  for (let i = 0; i < 40 && (await turno()).rodando; i++) await page.waitForTimeout(300);
  await vencerAsFalas();
  return comecou;
};

// ============================================================ 1. save novo
await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await comSave({ flags: { 'turno-aceito': true, 'osso-entregue': true } }, true);
await page.mouse.click(500, 440);

const rotulo = await abrirAEscala();
const novo = await painel();
await page.screenshot({ path: `${OUT}-novo.png` });
checar(/escala/i.test(rotulo ?? ''), `a escala nao ofereceu ler: "${rotulo}"`);
checar(novo.aberto, 'a escala nao abriu o painel dos turnos');
checar(novo.turnos.length === 6, `a escala devia ter 6 turnos, tem ${novo.turnos.length}`);
checar(novo.turnos[0]?.estado === 'aberto' && novo.turnos[0]?.marcado, 'o turno 1 devia estar aberto e marcado');
checar(novo.turnos.slice(1).every((t) => t.estado === 'trancado'), 'num save novo, do turno 2 em diante devia estar trancado');
checar(/3 estrelas no turno 1/.test(novo.turnos[1]?.texto ?? ''), 'o turno 2 trancado nao diz como abrir');
checar(/Canard à la Mania/.test(novo.turnos[3]?.texto ?? ''), 'o turno 4 nao tem o nome em frances');
checar(/\b0\b/.test(novo.petiscos), `o pote devia comecar vazio: "${novo.petiscos}"`);
checar(/turno 1/i.test(novo.botao) && novo.botaoLigado, `o botao devia comecar o turno 1: "${novo.botao}"`);

// clicar num trancado não marca nada
await page.locator('.escala-do-walter .linha[data-numero="2"]').click();
const depoisDoTrancado = await painel();
checar(depoisDoTrancado.turnos[0].marcado && !depoisDoTrancado.turnos[1].marcado, 'clicar num turno trancado mudou a marca');

// a aba das melhorias
await page.locator('.escala-do-walter [data-aba="melhorias"]').click();
await page.waitForTimeout(300);
const naAba = await painel();
await page.screenshot({ path: `${OUT}-melhorias.png` });
checar(naAba.melhorias === 7, `a aba de melhorias devia ter 7, tem ${naAba.melhorias}`);
await page.locator('.escala-do-walter [data-aba="turnos"]').click();

// "agora não" fecha sem começar
await page.locator('.escala-do-walter .fechar').click();
await page.waitForTimeout(600);
checar(!(await painel()).aberto && !(await turno()).rodando, '"agora nao" nao fechou a escala, ou comecou um turno');
// e o Escape também
await abrirAEscala();
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
checar(!(await painel()).aberto && !(await turno()).rodando, 'o Escape nao fechou a escala');

// ====================================== 2. turno 1 com três estrelas (R$ 230)
const t1 = await jogarComCaixa(1, 230);
checar(t1.numero === 1 && t1.rodando, `o turno 1 nao comecou pela escala: ${JSON.stringify(t1)}`);
let s = await lerSave();
checar(s.stats?.['turno:1:estrelas'] === 3, `turno 1 devia ter 3 estrelas: ${s.stats?.['turno:1:estrelas']}`);
checar(s.stats?.['turno:1:recorde'] === 230, `recorde do turno 1: ${s.stats?.['turno:1:recorde']}`);
checar(s.stats?.['mania:petiscos'] === 3, `tres estrelas deviam dar 3 petiscos: ${s.stats?.['mania:petiscos']}`);
checar(s.flags?.['gravata-do-walter'], 'as tres estrelas do turno 1 nao deram a gravatinha');
checar(s.flags?.['petiscos-explicados'], 'o Walter nao explicou os petiscos');

const depoisDo1 = await (async () => { await abrirAEscala(); return painel(); })();
await page.screenshot({ path: `${OUT}-turno2-aberto.png` });
checar(depoisDo1.turnos[1]?.estado === 'aberto', 'tres estrelas no turno 1 nao abriram o turno 2');
checar(depoisDo1.turnos[1]?.marcado, 'a escala devia abrir marcada no turno 2 (o primeiro sem tres estrelas)');
checar(depoisDo1.turnos[2]?.estado === 'trancado', 'o turno 3 abriu sem as tres estrelas do 2');
checar(depoisDo1.turnos[0]?.estrelas === 3 && depoisDo1.turnos[0]?.premioGanho, 'o turno 1 nao mostra as 3 estrelas e o premio');
checar(/\b3\b/.test(depoisDo1.petiscos), `o pote devia mostrar 3: "${depoisDo1.petiscos}"`);
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// ============================ 3. turno 2 com três estrelas: o avental (R$ 260)
const t2 = await jogarComCaixa(2, 260);
checar(t2.numero === 2, `o turno 2 nao comecou: ${JSON.stringify(t2)}`);
s = await lerSave();
const aventais = (s.premios ?? []).filter((id) => id === 'avental-do-mania').length;
checar(s.stats?.['turno:2:estrelas'] === 3, 'o turno 2 nao guardou as 3 estrelas');
checar(s.stats?.['mania:petiscos'] === 6, `petiscos depois do turno 2: ${s.stats?.['mania:petiscos']}`);
checar(aventais === 1, `o avental devia estar uma vez nos premios: ${aventais}`);
checar((s.memories ?? []).some((m) => m.id === 'avental-do-mania'), 'a memoria do avental nao entrou no diario');
const noArmario = await page.evaluate(() => window.jogo.wardrobeItems(window.jogo.playerId()).some((i) => i.id === 'avental-do-mania'));
checar(noArmario, 'o avental nao foi para o guarda-roupa');

// ======== 4. rejogar o turno 2 com uma estrela: +1 petisco, e nada se perde
await jogarComCaixa(2, 50);
s = await lerSave();
checar(s.stats?.['mania:petiscos'] === 7, `turno ja vencido tambem paga petisco: ${s.stats?.['mania:petiscos']}`);
checar(s.stats?.['turno:2:estrelas'] === 3, 'uma estrela depois das tres apagou as tres');
checar(s.stats?.['turno:2:recorde'] === 260, 'o recorde do turno 2 caiu');
checar((s.premios ?? []).filter((id) => id === 'avental-do-mania').length === 1, 'o avental veio de novo');
checar(s.stats?.['turno:2:vezes'] === 2, `o turno 2 devia contar duas vezes: ${s.stats?.['turno:2:vezes']}`);

await abrirAEscala();
const depoisDo2 = await painel();
await page.screenshot({ path: `${OUT}-turno3-aberto.png` });
checar(depoisDo2.turnos[1]?.premioGanho, 'o turno 2 nao mostra o avental ganho');
checar(depoisDo2.turnos[2]?.estado === 'aberto', `tres estrelas no turno 2 deviam abrir o turno 3: ${depoisDo2.turnos[2]?.estado}`);
checar(depoisDo2.turnos[3]?.estado === 'trancado', 'o turno 4 devia continuar trancado');
await page.keyboard.press('Escape');

// ==================================================== 5. o save de antes
await comSave({
  flags: { 'turno-aceito': true, 'osso-entregue': true, 'primeiro-turno': true, 'primeiro-turno-feito': true, 'gravata-do-walter': true },
  stats: { 'turno-recorde': 268 },
}, true);
s = await lerSave();
checar(s.stats?.['turno:1:estrelas'] === 3, `save antigo com gravatinha: turno 1 devia ter 3 estrelas (${s.stats?.['turno:1:estrelas']})`);
checar(s.stats?.['turno:1:recorde'] === 268, `save antigo: o recorde nao passou para o turno 1 (${s.stats?.['turno:1:recorde']})`);
checar(s.stats?.['mania:petiscos'] === 3, `save antigo: as tres estrelas deviam vir com 3 petiscos (${s.stats?.['mania:petiscos']})`);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
s = await lerSave();
checar(s.stats?.['mania:petiscos'] === 3, `a migracao rodou duas vezes: ${s.stats?.['mania:petiscos']} petiscos`);

await comSave({
  flags: { 'turno-aceito': true, 'osso-entregue': true, 'primeiro-turno': true, 'primeiro-turno-feito': true },
  stats: { 'turno-recorde': 150 },
}, true);
s = await lerSave();
checar(s.stats?.['turno:1:estrelas'] === 2, `save antigo de R$ 150 devia dar 2 estrelas: ${s.stats?.['turno:1:estrelas']}`);
await page.mouse.click(500, 440);
await abrirAEscala();
const antigo = await painel();
checar(antigo.turnos[1]?.estado === 'trancado', 'save antigo de duas estrelas abriu o turno 2');
await page.keyboard.press('Escape');

// ============================================================ 6. no celular
const cel = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
cel.on('pageerror', (e) => erros.push('PAGEERROR (celular): ' + e.message));
await cel.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await cel.evaluate(([k]) => {
  localStorage.setItem(k, JSON.stringify({
    flags: { 'turno-aceito': true, 'osso-entregue': true, 'primeiro-turno': true },
    stats: { 'turno:1:estrelas': 3, 'turno:1:recorde': 240, 'turno:1:vezes': 2, 'mania:petiscos': 4 },
  }));
}, [CHAVE_DO_SAVE]);
await cel.reload({ waitUntil: 'networkidle' });
await cel.waitForFunction(() => window.jogo?.current?.world?.root?.userData?.turno, null, { timeout: 60000 });
await cel.waitForTimeout(1500);
for (let i = 0; i < 20; i++) {
  await cel.evaluate(() => window.jogo.debugPlace(2.4, -7.5, 0));
  await cel.waitForTimeout(350);
  if (/escala/i.test((await cel.locator('.prompt .label').textContent().catch(() => '')) ?? '')) break;
}
await cel.evaluate(() => window.jogo.debugPlace(2.4, -7.5, 0));
await cel.keyboard.press('KeyE');
for (let i = 0; i < 30 && !(await cel.locator('.escala-do-walter.show').count()); i++) await cel.waitForTimeout(300);
await cel.waitForTimeout(500);
const medida = await cel.evaluate(() => {
  const lousa = document.querySelector('.escala-do-walter .lousa').getBoundingClientRect();
  const sobreposto = [...document.querySelectorAll('.escala-do-walter .linha')].some((t) => {
    const a = t.querySelector('.meio').getBoundingClientRect();
    const b = t.querySelector('.lado').getBoundingClientRect();
    return a.right > b.left + 1 && a.left < b.right - 1 && a.bottom > b.top + 1 && a.top < b.bottom - 1;
  });
  const lista = document.querySelector('.escala-do-walter .lista');
  return {
    esquerda: lousa.left, direita: window.innerWidth - lousa.right,
    alto: lousa.top >= 0 && lousa.bottom <= window.innerHeight,
    vazaDoLado: lista.scrollWidth > lista.clientWidth + 1,
    sobreposto,
  };
});
await cel.screenshot({ path: `${OUT}-celular.png` });
await cel.locator('.escala-do-walter [data-aba="melhorias"]').click();
await cel.waitForTimeout(300);
await cel.screenshot({ path: `${OUT}-celular-melhorias.png` });
checar(medida.esquerda >= 15 && medida.direita >= 15, `a lousa encosta na borda do celular: ${JSON.stringify(medida)}`);
checar(medida.alto, 'a lousa passa da altura da tela do celular');
checar(!medida.vazaDoLado, 'a lista da escala rola de lado no celular');
checar(!medida.sobreposto, 'no celular, as estrelas e o premio tapam o texto de algum turno');

// ======================================================================= laudo
console.log('1. save novo:', JSON.stringify(novo.turnos.map((t) => `${t.n}:${t.estado}${t.marcado ? '*' : ''}`)), '·', novo.petiscos, '·', novo.botao);
console.log('2. depois do turno 1:', JSON.stringify(depoisDo1.turnos.map((t) => `${t.n}:${t.estado}:${t.estrelas}★`)), '·', depoisDo1.petiscos);
console.log('3. depois do turno 2:', JSON.stringify(depoisDo2.turnos.map((t) => `${t.n}:${t.estado}:${t.estrelas}★${t.premioGanho ? '+premio' : ''}`)), '·', depoisDo2.petiscos);
console.log('6. celular:', JSON.stringify(medida));
await browser.close();

if (erros.length) falhas.push(...erros);
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
