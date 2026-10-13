/**
 * AS MELHORIAS DO MANIA — a etapa B da temporada de turnos (§13.6 de
 * `docs/MINIGAME-RESTAURANTE.md`).
 *
 * Ele MEDE cada melhoria contra o turno sem ela, e fotografa as peças:
 *
 * 1. A COMPRA, na aba "Melhorias" da escala: só o próximo nível tem botão, o
 *    botão diz quanto falta quando o pote não dá, comprar desconta os
 *    petiscos e sobe o nível, e a peça aparece no salão quando a escala fecha;
 * 2. O TURNO SEM NADA: a bandeja de sempre (duas vagas) na mão dos dois,
 *    três lugares na fila, a cozinha de um prato por vez em 7 s, anotar sem
 *    bloquinho, o passo normal e nenhuma peça de melhoria no salão;
 * 3. O TURNO COM TUDO: a bandeja grande (três vagas), o tênis de garçom nos
 *    pés dos dois e o passo 20% mais rápido, o bloquinho na mão enquanto anota,
 *    a chapa dupla fazendo dois pratos em 5 s, a fila com quatro lugares e 30%
 *    mais de paciência, o rádio segurando 10% da queda de todo mundo, e a
 *    louça largada no CARRINHO (pelo prompt dele) crescendo em cima dele;
 * 4. o que a dupla carrega APARECE na bandeja (dois pratos e uma louça, de
 *    verdade, tirados da chapa e de uma mesa), e o fim do turno tira a
 *    bandeja, o tênis e o passo rápido.
 *
 * Os números saem de dentro do turno (`root.userData.turno`), como no
 * `turno.mjs`: no Chromium sem placa o jogo anda a ~2 quadros por segundo, e
 * esperar uma cozinha de verdade seria esperar minutos.
 *
 * Uso: node scripts/melhorias.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './melhorias';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';
const TUDO = { 'mania:bandeja': 1, 'mania:tenis': 2, 'mania:bloquinho': 1, 'mania:chapa': 2, 'mania:reserva': 1, 'mania:radio': 1, 'mania:carrinho': 1 };
const FLAGS = { 'turno-aceito': true, 'osso-entregue': true, 'primeiro-turno': true, 'petiscos-explicados': true };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
const falhas = [];
const checar = (ok, msg) => { if (!ok) falhas.push(msg); };
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const irPara = (x, z, f = 0) => page.evaluate(([px, pz, ff]) => window.jogo.debugPlace(px, pz, ff), [x, z, f]);

const comSave = async (stats) => {
  await page.evaluate(([k, st, fl]) => localStorage.setItem(k, JSON.stringify({ flags: fl, stats: st })), [SAVE, stats, FLAGS]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.jogo?.current?.world?.root?.userData?.turno, null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.mouse.click(500, 440);
};

const abrirAEscala = async () => {
  for (let i = 0; i < 20; i++) {
    await irPara(2.4, -7.5);
    await page.waitForTimeout(350);
    if (/escala/i.test((await prompt()) ?? '')) break;
  }
  await page.keyboard.press('KeyE');
  for (let i = 0; i < 40 && !(await page.locator('.escala-do-walter.show').count()); i++) await page.waitForTimeout(300);
};

const comecarOTurno = async () => {
  await abrirAEscala();
  await page.locator('.escala-do-walter .comecar').click();
  for (let i = 0; i < 20; i++) {
    if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
    await page.waitForTimeout(300);
  }
  // ninguém entra: o que se mede aqui é a dupla e o salão, não a fila de verdade
  await page.evaluate(() => { window.jogo.current.world.root.userData.turno.proximaChegada = 999; });
};

/** as peças do salão que estão à vista */
const pecasVisiveis = () => page.evaluate(() => {
  const nomes = ['chapa-nova', 'chapa-dupla', 'cavalete-da-fila', 'radio-do-bar', 'carrinho-de-louca'];
  const vistas = {};
  window.jogo.current.world.root.traverse((o) => {
    if (!nomes.includes(o.userData?.peca)) return;
    let visivel = true;
    for (let p = o; p; p = p.parent) if (!p.visible) visivel = false;
    vistas[o.userData.peca] = visivel;
  });
  return vistas;
});

/** o turno por dentro: as medidas de cada melhoria */
const medir = () => page.evaluate(async () => {
  const j = window.jogo;
  const t = j.current.world.root.userData.turno;
  const ids = [j.playerId(), j.companionId()];
  const rigDe = (id) => (j.player.rig.spec.id === id ? j.player.rig : j.parceiro.rig);
  const naMao = ids.map((id) => j.objetoNaMao(id)?.name ?? null);
  const vagasDaBandeja = ids.map((id) => (j.objetoNaMao(id)?.userData?.vagas ?? []).length);
  const pes = ids.map((id) => rigDe(id).roupa?.pes?.id ?? null);

  // a cozinha: duas comandas na fila, e um quadro da chapa
  const fake = (nome) => ({ fase: 'esperando', prato: { id: 'quarteirao', nome }, ficha: { nome } });
  t.comandas.push(fake('a'), fake('b'));
  t.cozinhar(0);
  const chapa = t.cozinhando.map((c) => +c.falta.toFixed(2));
  t.cozinhando = [];
  t.comandas = [];

  // a paciência: um segundo de "quer pedir" (26 s de folga) num cliente de calma 1
  const cliente = { ficha: { calma: 1 }, paciencia: 1, mesa: null, fase: 'quer-pedir' };
  t.drenar(cliente, 1, 10);
  const naPorta = { ficha: { calma: 1 }, paciencia: 1, mesa: null, fase: 'na-porta' };
  t.drenar(naPorta, 1, 10 * t.folgaDaFila);

  return {
    naMao, vagasDaBandeja, pes,
    capacidade: t.capacidade,
    fila: t.lugaresNaFila,
    chapa,
    paciencia: +cliente.paciencia.toFixed(4),
    paciencaNaPorta: +naPorta.paciencia.toFixed(4),
    passo: j.player.multiplicador,
    carrinhoAceso: !!t.pontoDoCarrinho?.enabled,
  };
});

/** anota um pedido de mentira e olha o que está na mão durante e depois */
const anotarEOlhar = () => page.evaluate(async () => {
  const j = window.jogo;
  const t = j.current.world.root.userData.turno;
  const c = { fase: 'quer-pedir', ficha: { anotar: 1.2, nome: 'teste' }, prato: { nome: 'Prato de teste' }, paciencia: 1 };
  // o tempo que o motor PEDE ao relógio (a espera de anotar): medir na parede
  // pegava o atraso da máquina carregada junto, e a metade sumia no ruído
  let pedido = null;
  const esperar = t.g.wait;
  t.g.wait = (seg) => {
    if (pedido === null) pedido = seg;
    return esperar.call(t.g, seg);
  };
  const t0 = performance.now();
  const fim = t.anotar(c);
  await new Promise((r) => setTimeout(r, 150));
  const durante = j.objetoNaMao()?.name ?? null;
  await fim;
  const segundos = (performance.now() - t0) / 1000;
  await new Promise((r) => setTimeout(r, 300));
  t.g.wait = esperar;
  return { durante, depois: j.objetoNaMao()?.name ?? null, segundos: +segundos.toFixed(2), pedido };
});

// =================================================== 1. a compra, na escala
await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await comSave({ 'mania:petiscos': 12 });
await abrirAEscala();
await page.locator('.escala-do-walter [data-aba="melhorias"]').click();
await page.waitForTimeout(300);
const botoes = () => page.evaluate(() => [...document.querySelectorAll('.escala-do-walter [data-comprar]')]
  .map((b) => ({ id: b.dataset.comprar, ligado: !b.disabled, texto: b.textContent.trim() })));
const antes = await botoes();
checar(antes.length === 7, `cada melhoria devia ter um botao do proximo nivel: ${antes.length}`);
checar(antes.find((b) => b.id === 'bandeja')?.ligado, 'com 12 petiscos a bandeja (5) devia poder ser comprada');
await page.screenshot({ path: `${OUT}-loja.png` });
for (const id of ['bandeja', 'tenis', 'radio']) {
  await page.locator(`.escala-do-walter [data-comprar="${id}"]`).click();
  await page.waitForTimeout(400);
}
let s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).stats, SAVE);
checar(s['mania:petiscos'] === 0, `5 + 2 + 5 devia zerar o pote: ${s['mania:petiscos']}`);
checar(s['mania:bandeja'] === 1 && s['mania:tenis'] === 1 && s['mania:radio'] === 1, `os niveis nao subiram: ${JSON.stringify(s)}`);
const depois = await botoes();
const tenis2 = depois.find((b) => b.id === 'tenis');
checar(tenis2 && !tenis2.ligado && /faltam/.test(tenis2.texto), `o tenis de 20% devia pedir os 5 que faltam: ${JSON.stringify(tenis2)}`);
checar(!depois.some((b) => b.id === 'bandeja'), 'a bandeja (de um nivel so) continuou com botao depois de comprada');
await page.screenshot({ path: `${OUT}-loja-comprada.png` });
// comprar sem petisco nao faz nada (o botao esta desligado, e o clique e recusado)
await page.locator('.escala-do-walter [data-comprar="chapa"]').click({ force: true });
s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).stats, SAVE);
checar(!s['mania:chapa'], 'comprou a chapa sem petisco');
await page.locator('.escala-do-walter .fechar').click();
await page.waitForTimeout(600);
const vistasDepoisDaCompra = await pecasVisiveis();
checar(vistasDepoisDaCompra['radio-do-bar'] === true, 'o radio comprado nao apareceu no bar quando a escala fechou');
checar(!vistasDepoisDaCompra['carrinho-de-louca'] && !vistasDepoisDaCompra['chapa-nova'], 'apareceu peca que nao foi comprada');

// ======================================================= 2. o turno sem nada
await comSave({});
const vistasSem = await pecasVisiveis();
checar(Object.values(vistasSem).every((v) => !v), `sem melhoria, nenhuma peca devia aparecer: ${JSON.stringify(vistasSem)}`);
await comecarOTurno();
const sem = await medir();
const anotarSem = await anotarEOlhar();

// ======================================================= 3. o turno com tudo
await comSave(TUDO);
const vistasCom = await pecasVisiveis();
await comecarOTurno();
const com = await medir();
const anotarCom = await anotarEOlhar();

// a louça no CARRINHO, pelo prompt dele: uma pilha de verdade, tirada de uma mesa
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  const mesa = t.mesas[0];
  t.soltarAMesa({ mesa, sujou: true });
  t.naMesa(mesa);
});
const naBandejaAntes = await page.evaluate(() => {
  const j = window.jogo;
  const b = j.current.world.root.userData.turno.bandejas.get(j.playerId()) ?? [];
  return { n: b.length, naCarga: b.every((v) => v.malha.parent?.name === 'carga') };
});
let rotuloDoCarrinho = null;
for (let i = 0; i < 30 && !rotuloDoCarrinho; i++) {
  await irPara(0.1, 6.6);
  await page.waitForTimeout(350);
  const r = (await prompt()) ?? '';
  if (/carrinho/i.test(r)) rotuloDoCarrinho = r;
}
await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const noCarrinho = await page.evaluate(() => {
  const j = window.jogo;
  const t = j.current.world.root.userData.turno;
  return { pilhas: t.pilhaNoCarrinho.length, bandeja: (t.bandejas.get(j.playerId()) ?? []).length };
});

// ===================== 4. a bandeja carregada: dois pratos da chapa e uma louça
await page.evaluate(() => {
  const j = window.jogo;
  const t = j.current.world.root.userData.turno;
  for (const nome of ['Quarteirão', 'Perro']) {
    const c = { fase: 'esperando', prato: { id: nome === 'Perro' ? 'perro-tradicional' : 'quarteirao', nome }, ficha: { nome } };
    t.servirDaChapa(c);
    t.pegarOPrato();
  }
  const mesa = t.mesas[1];
  t.soltarAMesa({ mesa, sujou: true });
  t.naMesa(mesa);
});
const carregada = await page.evaluate(() => {
  const j = window.jogo;
  const carga = j.objetoNaMao()?.userData?.carga;
  return { naCarga: carga?.children.length ?? 0, nomes: (j.current.world.root.userData.turno.bandejas.get(j.playerId()) ?? []).map((v) => v.tipo) };
});
await irPara(3.0, 3.6, 0.6);
await page.evaluate(() => { window.jogo.focusCamera(window.jogo.player.object); window.jogo.setZoom(2.0); });
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-bandeja-cheia.png` });
await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(11.5); });

// o fim do turno tira a bandeja, o tênis e o passo
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  for (const c of [...t.clientes]) t.apagarCliente(c);
  t.dinheiro = 50;
  t.tempo = 0;
});
for (let i = 0; i < 40 && (await page.evaluate(() => window.jogo.current.world.root.userData.turno.rodando)); i++) await page.waitForTimeout(300);
for (let i = 0; i < 60; i++) {
  if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(300);
}
const fim = await page.evaluate(() => {
  const j = window.jogo;
  const rigs = [j.player.rig, j.parceiro.rig];
  return {
    naMao: rigs.map((r) => r.objetoNaMao?.name ?? null),
    pes: rigs.map((r) => r.roupa?.pes?.id ?? null),
    passo: j.player.multiplicador,
  };
});

// ======================================================================= laudo
checar(sem.naMao.every((n) => n === 'bandeja'), `sem melhoria, os dois deviam segurar a bandeja: ${JSON.stringify(sem.naMao)}`);
checar(sem.vagasDaBandeja.every((n) => n === 2) && sem.capacidade === 2, `a bandeja de sempre tem 2 vagas: ${JSON.stringify(sem)}`);
checar(sem.fila === 3, `sem a plaquinha a fila tem 3 lugares: ${sem.fila}`);
checar(sem.chapa.length === 1 && sem.chapa[0] === 7, `sem chapa nova, um prato por vez em 7 s: ${JSON.stringify(sem.chapa)}`);
checar(sem.passo === 1 && sem.pes.every((p) => p !== 'tenis-de-garcom'), `sem tenis, passo normal e o sapato de sempre: ${JSON.stringify(sem)}`);
checar(Math.abs(sem.paciencia - 0.9) < 1e-3, `sem radio, 1 s em 10 tira 10%: ${sem.paciencia}`);
checar(anotarSem.durante === 'bandeja', `sem bloquinho, a mao continua com a bandeja ao anotar: ${anotarSem.durante}`);
checar(!sem.carrinhoAceso, 'o ponto do carrinho acendeu sem o carrinho');

checar(vistasCom['chapa-dupla'] && vistasCom['cavalete-da-fila'] && vistasCom['radio-do-bar'] && vistasCom['carrinho-de-louca'] && !vistasCom['chapa-nova'],
  `com tudo, as pecas deviam aparecer (e a chapa dupla no lugar da simples): ${JSON.stringify(vistasCom)}`);
checar(com.vagasDaBandeja.every((n) => n === 3) && com.capacidade === 3, `a bandeja grande tem 3 vagas: ${JSON.stringify(com)}`);
checar(com.pes.every((p) => p === 'tenis-de-garcom'), `o tenis de garcom devia estar nos dois: ${JSON.stringify(com.pes)}`);
checar(Math.abs(com.passo - 1.2) < 1e-6, `o tenis de 20% devia dar passo 1,2: ${com.passo}`);
checar(com.fila === 4, `a plaquinha devia dar o quarto lugar: ${com.fila}`);
checar(com.chapa.length === 2 && com.chapa.every((x) => x === 5), `a chapa dupla faz dois pratos em 5 s: ${JSON.stringify(com.chapa)}`);
checar(Math.abs(com.paciencia - 0.91) < 1e-3, `o radio devia segurar 10% da queda (0,91): ${com.paciencia}`);
checar(Math.abs(com.paciencaNaPorta - (1 - 1 / (13 / 0.9))) < 1e-3, `na porta, a plaquinha (30%) e o radio juntos: ${com.paciencaNaPorta}`);
checar(anotarCom.durante === 'bloquinho' && anotarCom.depois === 'bandeja', `o bloquinho devia aparecer ao anotar e a bandeja voltar: ${JSON.stringify(anotarCom)}`);
checar(anotarSem.pedido === 1.2 && anotarCom.pedido === 0.6, `o bloquinho devia cortar o tempo de anotar pela metade: ${anotarSem.pedido} → ${anotarCom.pedido}`);
checar(naBandejaAntes.n === 1 && naBandejaAntes.naCarga, `a louca recolhida devia pousar na bandeja: ${JSON.stringify(naBandejaAntes)}`);
checar(/carrinho/i.test(rotuloDoCarrinho ?? ''), `o carrinho nao ofereceu largar a louca: ${rotuloDoCarrinho}`);
checar(noCarrinho.pilhas === 1 && noCarrinho.bandeja === 0, `a louca nao foi para o carrinho: ${JSON.stringify(noCarrinho)}`);
checar(carregada.naCarga === 3, `a bandeja devia mostrar as tres coisas: ${JSON.stringify(carregada)}`);
checar(fim.naMao.every((n) => n !== 'bandeja') && fim.pes.every((p) => p !== 'tenis-de-garcom') && fim.passo === 1,
  `o fim do turno devia tirar bandeja, tenis e passo: ${JSON.stringify(fim)}`);
falhas.push(...erros);

console.log('1. loja:', JSON.stringify(antes.map((b) => `${b.id}:${b.ligado ? 'ok' : 'x'}`)), '→ pote', s['mania:petiscos']);
console.log('2. sem:', JSON.stringify(sem), '· anotar', JSON.stringify(anotarSem));
console.log('3. com:', JSON.stringify(com), '· anotar', JSON.stringify(anotarCom));
console.log('   pecas:', JSON.stringify(vistasCom), '· carrinho:', rotuloDoCarrinho, JSON.stringify(noCarrinho));
console.log('4. bandeja cheia:', JSON.stringify(carregada), '· fim:', JSON.stringify(fim));
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
