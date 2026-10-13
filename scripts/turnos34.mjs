/**
 * OS TURNOS 3 E 4 DO MANIA — a etapa C da temporada (§13.2 e §13.3 de
 * `docs/MINIGAME-RESTAURANTE.md`).
 *
 * Ele MEDE cada traço novo no motor do turno, com os bichos de verdade
 * sentados à mesa, e fotografa:
 *
 * - TURNO 3, o Cookie: OCUPA DUAS MESAS (sentado numa, a mesa livre mais
 *   perto ganha o cartão "Reservado pro Cookie" e não recebe ninguém), só
 *   pede o SUCO, que o Walter faz em 3 s, e toma em 5; quando ele vai embora,
 *   a mesa do lado abre de novo. No turno 3 o prato NÃO esfria;
 * - TURNO 4, o prato ESFRIA (o vapor encolhe e some) e:
 *   - o JEAN-LUC quente comemora e paga em dobro; frio, paga com o coração
 *     apagado (metade);
 *   - a ESTELLA repara no uniforme (uma peça do Mania vestida por quem anota
 *     = gorjeta dobrada) e dá o BISCOITINHO a quem entrega (passo 25% mais
 *     rápido por 20 s);
 * - a escala abre os turnos 3 e 4 (o 5 continua "em preparo"), e as três
 *   estrelas de cada um dão o prêmio dele uma vez: o lápis na orelha e o
 *   bloquinho (turno 3) e o colete (turno 4).
 *
 * Os clientes entram por `forcarChegada` (o gancho de teste do motor) e o
 * relógio das fases que só esperam é encurtado por dentro, como no
 * `turno.mjs`: no Chromium sem placa o jogo anda a ~2 quadros por segundo.
 *
 * Uso: node scripts/turnos34.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './turnos34';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';
const FLAGS = {
  'turno-aceito': true, 'osso-entregue': true, 'primeiro-turno': true, 'petiscos-explicados': true,
  'turno-3-explicado': true, 'turno-4-explicado': true,
};

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

const vencerAsFalas = async (quieto = 6) => {
  let parado = 0;
  for (let i = 0; i < 200 && parado < quieto; i++) {
    if (await page.locator('.dialogue.show').count()) {
      parado = 0;
      await page.keyboard.press('KeyE');
    } else {
      parado += 1;
    }
    await page.waitForTimeout(350);
  }
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

/** começa o turno `n` pela escala (os anteriores já com três estrelas) e esvazia a porta */
const comecar = async (n) => {
  await abrirAEscala();
  const linha = page.locator(`.escala-do-walter .linha[data-numero="${n}"]`);
  if (!(await linha.evaluate((e) => e.classList.contains('marcado')))) await linha.click();
  await page.locator('.escala-do-walter .comecar').click();
  await vencerAsFalas(4);
  return page.evaluate(() => {
    const t = window.jogo.current.world.root.userData.turno;
    t.proximaChegada = 999;
    for (const c of [...t.clientes]) t.apagarCliente(c);
    return { numero: t.turno.numero, rodando: t.rodando, esfria: t.esfria };
  });
};

/**
 * Traz um cliente da ficha `id` e senta na mesa de índice `m`; devolve o
 * índice dele em `t.clientes`. A leitura do cardápio é pulada.
 */
const sentar = (id, m) => page.evaluate(async ([id, m]) => {
  const t = window.jogo.current.world.root.userData.turno;
  t.forcarChegada(id);
  const c = t.clientes[t.clientes.length - 1];
  t.guiado = c;
  c.fase = 'indo';
  t.naMesa(t.mesas[m]);
  c.relogio = 0.01;
  for (let i = 0; i < 40 && c.fase === 'sentando'; i++) await new Promise((r) => setTimeout(r, 150));
  if (c.fase === 'lendo') c.relogio = 0.01;
  for (let i = 0; i < 40 && c.fase !== 'quer-pedir'; i++) await new Promise((r) => setTimeout(r, 150));
  return t.clientes.indexOf(c);
}, [id, m]);

/**
 * O laço de um cliente sentado: anotar (pelo motor, com quem está no
 * comando), o Walter cozinhar (medido), pegar, `esfriar` segundos de espera
 * e entregar; devolve as medidas.
 */
const servir = (i, esfriar = 0) => page.evaluate(async ([i, esfriar]) => {
  const j = window.jogo;
  const t = j.current.world.root.userData.turno;
  const c = t.clientes[i];
  const mesa = c.mesa;
  await t.anotar(c);
  // a chapa: o tempo que o Walter vai levar no prato dele
  t.cozinhar(0);
  const preparo = t.cozinhando.find((x) => x.dono === c)?.falta ?? null;
  t.cozinhando = t.cozinhando.filter((x) => x.dono !== c);
  t.comandas = t.comandas.filter((x) => x !== c);
  t.servirDaChapa(c);
  const pronto = t.prontos.find((p) => p.para === c);
  const vaporAntes = !!pronto?.malha.getObjectByName('vapor');
  if (esfriar) t.esfriar(esfriar);
  const calor = pronto?.malha.userData.calor ?? null;
  const vaporVisivel = pronto?.malha.getObjectByName('vapor')?.visible ?? null;
  // pega o prato DELE (o balcão entrega o primeiro da fila)
  t.prontos = [pronto, ...t.prontos.filter((p) => p !== pronto)];
  t.pegarOPrato();
  t.naMesa(mesa);
  // o passo do biscoito é refeito no quadro seguinte
  await new Promise((r) => setTimeout(r, 900));
  return {
    prato: c.prato.id, preparo, vaporAntes, calor, vaporVisivel,
    quente: c.quente, reparou: c.reparou, fase: c.fase, refeicao: +c.relogio.toFixed(2),
    comemorando: c.bicho.estaComemorando ?? null,
    passo: j.player.multiplicador, biscoito: t.biscoitos.has(j.playerId()),
  };
}, [i, esfriar]);

/** a conta: termina a refeição, recebe, e devolve quanto entrou no caixa e quanto ele tinha gasto */
const receber = (i) => page.evaluate(async (i) => {
  const t = window.jogo.current.world.root.userData.turno;
  const c = t.clientes[i];
  c.relogio = 0.01;
  for (let k = 0; k < 40 && c.fase !== 'quer-pagar'; k++) await new Promise((r) => setTimeout(r, 150));
  c.paciencia = 1;
  const antes = t.dinheiro;
  const mesa = c.mesa;
  t.naMesa(mesa);
  return { pago: t.dinheiro - antes, gasto: c.gasto, fase: c.fase };
}, i);

const fecharODia = async (dinheiro) => {
  await page.evaluate((d) => {
    const t = window.jogo.current.world.root.userData.turno;
    for (const c of [...t.clientes]) t.apagarCliente(c);
    t.dinheiro = d;
    t.tempo = 0;
  }, dinheiro);
  for (let i = 0; i < 40 && (await page.evaluate(() => window.jogo.current.world.root.userData.turno.rodando)); i++) await page.waitForTimeout(300);
  await vencerAsFalas();
};

// ======================================================= 1. a escala abre o 3 e o 4
await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await comSave({ 'turno:1:estrelas': 3, 'turno:2:estrelas': 3, 'turno:3:estrelas': 3, 'turno:4:estrelas': 3 });
await abrirAEscala();
const linhas = await page.evaluate(() => [...document.querySelectorAll('.escala-do-walter .linha')]
  .map((l) => ['aberto', 'trancado', 'em-preparo'].find((c) => l.classList.contains(c))));
checar(linhas[2] === 'aberto' && linhas[3] === 'aberto', `os turnos 3 e 4 deviam estar abertos e jogaveis: ${JSON.stringify(linhas)}`);
checar(linhas[4] === 'em-preparo', `o turno 5 devia continuar em preparo: ${linhas[4]}`);
await page.keyboard.press('Escape');

// ====================================================== 2. turno 3: o Cookie
await comSave({ 'turno:1:estrelas': 3, 'turno:2:estrelas': 3 });
const t3 = await comecar(3);
checar(t3.numero === 3 && t3.rodando, `a escala nao comecou o turno 3: ${JSON.stringify(t3)}`);
checar(!t3.esfria, 'no turno 3 o prato nao devia esfriar');
const iCookie = await sentar('cookie', 4);
const reservado = await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  const c = t.clientes.find((k) => k.ficha.id === 'cookie');
  const [mesa, b] = [...t.bloqueadas.entries()][0] ?? [];
  let cartao = false;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'reservado-na-mesa' && o.visible) cartao = true; });
  const i = mesa ? t.mesas.indexOf(mesa) : -1;
  return {
    bloqueadas: t.bloqueadas.size, por: b?.por === c, cartao,
    pontoDaVizinha: i >= 0 ? t.pontoDaMesa[i].enabled : null,
    distancia: mesa ? +Math.hypot(mesa.x - c.mesa.x, mesa.z - c.mesa.z).toFixed(2) : null,
    prato: c.prato.id,
  };
});
// tentar sentar alguém na mesa reservada não pode dar
const naReservada = await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  const [mesa] = [...t.bloqueadas.keys()];
  t.forcarChegada('capy');
  const capy = t.clientes[t.clientes.length - 1];
  t.guiado = capy;
  capy.fase = 'indo';
  t.naMesa(mesa);
  const sentou = capy.mesa === mesa;
  t.guiado = null;
  t.apagarCliente(capy);
  return sentou;
});
await irPara(3.6, 5.2, 0.6);
await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(9); });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-cookie-duas-mesas.png` });
const servidoCookie = await servir(iCookie);
const contaCookie = await receber(iCookie);
const depoisDoCookie = await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  let cartao = false;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'reservado-na-mesa') cartao = true; });
  return { bloqueadas: t.bloqueadas.size, cartao };
});
await fecharODia(290);
let s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
checar(s.stats['turno:3:estrelas'] === 3, 'as tres estrelas do turno 3 nao foram anotadas');
checar(['lapis-na-orelha', 'bloquinho-na-mao'].every((id) => (s.premios ?? []).includes(id)), `o premio do turno 3 nao veio: ${JSON.stringify(s.premios)}`);

// ================================================ 3. turno 4: esfria, Jean-Luc e Estella
const t4 = await comecar(4);
checar(t4.numero === 4 && t4.esfria, `o turno 4 devia ter o prato esfriando: ${JSON.stringify(t4)}`);
const iQuente = await sentar('jean-luc', 4);
const quente = await servir(iQuente, 0);
const contaQuente = await receber(iQuente);
const iFrio = await sentar('jean-luc', 6);
const frio = await servir(iFrio, 30);
const contaFrio = await receber(iFrio);

// a Estella: quem anota está de avental do Mania
await page.evaluate(() => {
  const j = window.jogo;
  j.equipWearable(window.aristoryItens['avental-do-mania']);
});
const iEstella = await sentar('estella', 9);
const estella = await servir(iEstella, 0);
const contaEstella = await receber(iEstella);

// o vapor de um prato quente no balcão, no zoom do jogo
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  t.forcarChegada('noel');
  const c = t.clientes[t.clientes.length - 1];
  c.fase = 'esperando';
  t.servirDaChapa(c);
});
await irPara(-1.5, 0.6, 0.6);
await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(5); });
await page.waitForTimeout(2200);
await page.screenshot({ path: `${OUT}-vapor.png` });
await fecharODia(330);
s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
checar(s.stats['turno:4:estrelas'] === 3, 'as tres estrelas do turno 4 nao foram anotadas');
checar((s.premios ?? []).includes('colete-de-garcom'), `o colete nao veio: ${JSON.stringify(s.premios)}`);
checar((s.memories ?? []).some((m) => m.id === 'colete-de-garcom') && (s.memories ?? []).some((m) => m.id === 'lapis-na-orelha'),
  'as memorias dos premios dos turnos 3 e 4 nao entraram no diario');
const vestePremio = await page.evaluate(() => {
  const j = window.jogo;
  const ids = ['colete-de-garcom', 'lapis-na-orelha', 'bloquinho-na-mao'];
  const tem = ids.every((id) => j.wardrobeItems(j.playerId()).some((i) => i.id === id) || j.wearables().some((i) => i?.id === id));
  return tem;
});

// ======================================================================= laudo
checar(reservado.bloqueadas === 1 && reservado.por && reservado.cartao, `o Cookie devia fechar uma mesa com o cartao: ${JSON.stringify(reservado)}`);
checar(reservado.pontoDaVizinha === false, 'o ponto da mesa reservada continuou aceso');
checar(!naReservada, 'deu para sentar alguem na mesa reservada pro Cookie');
checar(reservado.prato === 'suco-morango', `o Cookie so pede suco: ${reservado.prato}`);
checar(servidoCookie.preparo === 3, `o suco do Cookie sai em 3 s: ${servidoCookie.preparo}`);
// o relógio da refeição é lido um tico depois de começar: até 5 s, contra os 11 de quem não é o Cookie
checar(servidoCookie.refeicao <= 5 && servidoCookie.refeicao > 4 && servidoCookie.fase === 'comendo', `o Cookie toma em 5 s: ${JSON.stringify(servidoCookie)}`);
checar(servidoCookie.calor === 1 && !servidoCookie.vaporAntes, `no turno 3 o prato nao esfria nem solta vapor: ${JSON.stringify(servidoCookie)}`);
checar(contaCookie.pago > 0 && depoisDoCookie.bloqueadas === 0 && !depoisDoCookie.cartao, `quando o Cookie paga, a mesa do lado abre: ${JSON.stringify(depoisDoCookie)}`);

checar(quente.vaporAntes && quente.quente === true, `o prato quente devia chegar quente e com vapor: ${JSON.stringify(quente)}`);
checar(quente.comemorando === true, 'o Jean-Luc nao comemorou o prato quente');
checar(contaQuente.pago === Math.round(contaQuente.gasto * 1.5 * 2), `quente, o Jean-Luc paga em dobro (com coracao dourado): ${JSON.stringify(contaQuente)}`);
checar(frio.calor === 0 && frio.vaporVisivel === false && frio.quente === false, `30 s no balcao: frio e sem vapor: ${JSON.stringify(frio)}`);
checar(contaFrio.pago === Math.round(contaFrio.gasto * 0.5), `frio, o Jean-Luc paga com o coracao apagado (metade): ${JSON.stringify(contaFrio)}`);
checar(estella.reparou, 'a Estella nao reparou no avental do Mania');
checar(estella.biscoito && Math.abs(estella.passo - 1.25) < 1e-6, `o biscoitinho devia dar passo 1,25: ${JSON.stringify(estella)}`);
checar(contaEstella.pago === Math.round(contaEstella.gasto * 1.5 * 2), `de uniforme, a Estella da gorjeta dobrada: ${JSON.stringify(contaEstella)}`);
checar(vestePremio, 'os premios dos turnos 3 e 4 nao estao no guarda-roupa');
falhas.push(...erros);

console.log('1. escala:', JSON.stringify(linhas));
console.log('2. cookie:', JSON.stringify(reservado), '· servido', JSON.stringify(servidoCookie), '· conta', JSON.stringify(contaCookie), '· depois', JSON.stringify(depoisDoCookie));
console.log('3. jean-luc quente:', JSON.stringify(quente), JSON.stringify(contaQuente));
console.log('   jean-luc frio:', JSON.stringify(frio), JSON.stringify(contaFrio));
console.log('   estella:', JSON.stringify(estella), JSON.stringify(contaEstella));
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
