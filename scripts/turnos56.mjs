/**
 * OS TURNOS 5 E 6 DO MANIA — a etapa D da temporada (§13.2 e §13.3 de
 * `docs/MINIGAME-RESTAURANTE.md`).
 *
 * Ele MEDE cada traço novo no motor do turno, com os bichos de verdade, e
 * fotografa:
 *
 * - TURNO 5, a MESA GRANDE: as três coelhinhas sentam numa mesa só (a Luna
 *   e a Sol nas cadeiras da frente, a Estrella na de trás), um pedido cada —
 *   três comandas —, e a mesa só come quando o terceiro prato chega; o que
 *   chegou antes ESFRIA esperando as irmãs, e a conta é a dos três pratos;
 * - o FLYNN torce: um prato entregue em OUTRA mesa faz ele comemorar e
 *   devolve paciência à mesa vizinha;
 * - TURNO 6, o GATITO come devagar (18 s) e, pagando, faz o six seven — o
 *   salão inteiro recupera paciência;
 * - o PELUSA: deita na mesa suja (ela não se recolhe, e a vizinha drena em
 *   DOBRO), o "psiu" espanta, e ele rouba o prato parado no balcão — o
 *   Walter refaz (a comanda volta para a frente da fila);
 * - os prêmios: a bandana (turno 5), o dólmã e o chapéu (turno 6), e a
 *   PLAQUINHA de funcionários do mês com os seis turnos em três estrelas;
 * - e as roupas novas nos dois, de frente e de costas.
 *
 * Uso: node scripts/turnos56.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './turnos56';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';
const FLAGS = {
  'turno-aceito': true, 'osso-entregue': true, 'primeiro-turno': true, 'petiscos-explicados': true,
  'turno-3-explicado': true, 'turno-4-explicado': true, 'turno-5-explicado': true, 'turno-6-explicado': true,
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
    // o Pelusa da escala também não entra sozinho: o teste solta ele na hora
    t.proximoPelusa = 99;
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
  // uma comanda por prato: o teste tira as do cliente da fila e serve na hora
  const preparo = t.cozinhando.find((x) => x.comanda.para === c)?.falta ?? null;
  const dele = [...t.cozinhando.filter((x) => x.comanda.para === c).map((x) => x.comanda), ...t.comandas.filter((x) => x.para === c)];
  t.cozinhando = t.cozinhando.filter((x) => x.comanda.para !== c);
  t.comandas = t.comandas.filter((x) => x.para !== c);
  for (const k of dele) t.servirDaChapa(k);
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


// ======================================================= 1. a escala abre o 5 e o 6
await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const QUATRO = { 'turno:1:estrelas': 3, 'turno:2:estrelas': 3, 'turno:3:estrelas': 3, 'turno:4:estrelas': 3 };
await comSave(QUATRO);
await abrirAEscala();
const linhas = await page.evaluate(() => [...document.querySelectorAll('.escala-do-walter .linha')]
  .map((l) => ['aberto', 'trancado', 'em-preparo'].find((c) => l.classList.contains(c))));
checar(linhas[4] === 'aberto' && linhas[5] === 'trancado', `o 5 devia abrir e o 6 seguir trancado: ${JSON.stringify(linhas)}`);
await page.keyboard.press('Escape');

// ====================================================== 2. turno 5: a mesa grande
await comSave(QUATRO);
const t5 = await comecar(5);
checar(t5.numero === 5 && t5.rodando && t5.esfria, `a escala nao comecou o turno 5 com o prato esfriando: ${JSON.stringify(t5)}`);
const iCoelhas = await sentar('coelhas', 4);
const sentadas = await page.evaluate((i) => {
  const t = window.jogo.current.world.root.userData.turno;
  const c = t.clientes[i];
  const todas = [c.bicho, ...c.junto];
  return {
    quantas: todas.length,
    nomes: todas.map((b) => b.constructor.name),
    sentadas: todas.every((b) => b.estado === 'sentado'),
    lugares: todas.map((b) => [+(b.x - c.mesa.x).toFixed(2), +(b.z - c.mesa.z).toFixed(2)]),
    pedidos: c.faltam.length,
  };
}, iCoelhas);
// a mesa grande servida: anotar (três comandas), um prato, esperar, e os outros dois
const grande = await page.evaluate(async (i) => {
  const t = window.jogo.current.world.root.userData.turno;
  const c = t.clientes[i];
  const mesa = c.mesa;
  await t.anotar(c);
  t.cozinhar(0);
  const comandas = [...t.cozinhando.map((x) => x.comanda), ...t.comandas].filter((k) => k.para === c);
  t.cozinhando = [];
  t.comandas = t.comandas.filter((k) => k.para !== c);
  for (const k of comandas) t.servirDaChapa(k);
  const prontos = t.prontos.filter((p) => p.para === c).length;
  // o primeiro prato chega sozinho
  t.prontos = [...t.prontos.filter((p) => p.para === c), ...t.prontos.filter((p) => p.para !== c)];
  t.pegarOPrato();
  t.naMesa(mesa);
  const depoisDoPrimeiro = { fase: c.fase, faltam: c.faltam.length, naMesa: c.naMesa.length };
  // ele esfria na mesa esperando as irmãs
  t.esfriar(30);
  const calorDoPrimeiro = c.naMesa[0].userData.calor;
  t.pegarOPrato();
  t.pegarOPrato();
  t.naMesa(mesa);
  t.naMesa(mesa);
  return {
    comandas: comandas.length, prontos, depoisDoPrimeiro, calorDoPrimeiro,
    fase: c.fase, quente: c.quente, gasto: c.gasto, pratosNaMesa: c.naMesa.length,
    somaDosPratos: comandas.reduce((s, k) => s + (Number(k.prato.preco.replace(/\D+/g, '')) || 10), 0),
  };
}, iCoelhas);
await irPara(3.6, 5.2, 0.6);
await page.evaluate((i) => {
  const t = window.jogo.current.world.root.userData.turno;
  window.jogo.focusCamera(t.clientes[i].bicho.group);
  window.jogo.setZoom(3.2);
}, iCoelhas);
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-mesa-grande.png` });
await page.evaluate(() => window.jogo.focusCamera(null));
const contaCoelhas = await receber(iCoelhas);

// o Flynn: sentado, e um prato entregue em outra mesa perto dele
const torcida = await page.evaluate(async () => {
  const t = window.jogo.current.world.root.userData.turno;
  const livres = t.mesas.filter((m) => !t.ocupadas.has(m) && !t.sujeira.has(m));
  const [a, b] = livres;
  // as duas mesas livres mais perto uma da outra
  let par = [a, b];
  let perto = Infinity;
  for (const m of livres) for (const n of livres) {
    const d = Math.hypot(m.x - n.x, m.z - n.z);
    if (m !== n && d < perto) { perto = d; par = [m, n]; }
  }
  const sentarEm = async (id, mesa) => {
    t.forcarChegada(id);
    const c = t.clientes[t.clientes.length - 1];
    t.guiado = c;
    c.fase = 'indo';
    t.naMesa(mesa);
    c.relogio = 0.01;
    for (let k = 0; k < 40 && c.fase === 'sentando'; k++) await new Promise((r) => setTimeout(r, 150));
    if (c.fase === 'lendo') c.relogio = 0.01;
    for (let k = 0; k < 40 && c.fase !== 'quer-pedir'; k++) await new Promise((r) => setTimeout(r, 150));
    return c;
  };
  const flynn = await sentarEm('flynn', par[0]);
  const josefina = await sentarEm('josefina', par[1]);
  await t.anotar(josefina);
  t.cozinhar(0);
  const dela = [...t.cozinhando.map((x) => x.comanda), ...t.comandas].filter((k) => k.para === josefina);
  t.cozinhando = [];
  t.comandas = t.comandas.filter((k) => k.para !== josefina);
  for (const k of dela) t.servirDaChapa(k);
  t.prontos = [...t.prontos.filter((p) => p.para === josefina), ...t.prontos.filter((p) => p.para !== josefina)];
  t.pegarOPrato();
  // a vizinha de verdade: o Noel numa mesa perto do Flynn, de mão levantada
  const terceira = t.mesas.filter((m) => !t.ocupadas.has(m) && !t.sujeira.has(m))
    .sort((m, n) => Math.hypot(m.x - par[0].x, m.z - par[0].z) - Math.hypot(n.x - par[0].x, n.z - par[0].z))[0];
  const noel = await sentarEm('noel', terceira);
  flynn.paciencia = 0.5;
  noel.paciencia = 0.4;
  const antes = flynn.paciencia;
  const vizinhaAntes = noel.paciencia;
  t.naMesa(par[1]);
  const r = {
    distancia: +perto.toFixed(2), comemorando: flynn.bicho.estaComemorando,
    antes, depois: +flynn.paciencia.toFixed(3), josefina: josefina.fase,
    vizinhaAntes, vizinha: +noel.paciencia.toFixed(3), daVizinha: +Math.hypot(terceira.x - par[0].x, terceira.z - par[0].z).toFixed(2),
  };
  t.apagarCliente(noel);
  t.ocupadas.delete(terceira);
  t.apagarCliente(flynn);
  t.apagarCliente(josefina);
  for (const m of par) t.ocupadas.delete(m);
  for (const [m, l] of [...t.sujeira]) { t.apagar(l); t.sujeira.delete(m); m.floreira.visible = true; }
  return r;
});
await fecharODia(380);
let s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
checar(s.stats['turno:5:estrelas'] === 3, 'as tres estrelas do turno 5 nao foram anotadas');
checar((s.premios ?? []).includes('bandana-de-churrasqueiro'), `a bandana nao veio: ${JSON.stringify(s.premios)}`);
checar((s.memories ?? []).some((m) => m.id === 'bandana-de-churrasqueiro'), 'a memoria da bandana nao entrou no diario');
checar(!(s.flags ?? {})['funcionarios-do-mes'], 'a plaquinha nao podia aparecer antes do turno 6');

// ================================================ 3. turno 6: o Gatito e o Pelusa
const t6 = await comecar(6);
checar(t6.numero === 6 && t6.rodando, `a escala nao comecou o turno 6: ${JSON.stringify(t6)}`);
const iGatito = await sentar('gatito', 2);
const servidoGatito = await servir(iGatito);
const sixSeven = await page.evaluate(async (i) => {
  const t = window.jogo.current.world.root.userData.turno;
  const c = t.clientes[i];
  t.forcarChegada('noel');
  const noel = t.clientes[t.clientes.length - 1];
  noel.paciencia = 0.4;
  c.relogio = 0.01;
  for (let k = 0; k < 40 && c.fase !== 'quer-pagar'; k++) await new Promise((r) => setTimeout(r, 150));
  c.paciencia = 1;
  const antes = noel.paciencia;
  t.naMesa(c.mesa);
  const r = { gesto: c.bicho.fazendoSixSeven, segura: +c.segura.toFixed(2), antes: +antes.toFixed(3), depois: +noel.paciencia.toFixed(3), fase: c.fase };
  t.apagarCliente(noel);
  return r;
}, iGatito);

// o Pelusa deita na mesa suja
const deitado = await page.evaluate(async () => {
  const t = window.jogo.current.world.root.userData.turno;
  for (const c of [...t.clientes]) t.apagarCliente(c);
  for (const [m, l] of [...t.sujeira]) { t.apagar(l); t.sujeira.delete(m); m.floreira.visible = true; }
  t.ocupadas.clear();
  const mesa = t.mesas[4];
  t.soltarAMesa({ mesa, sujou: true, naMesa: [] });
  t.soltarOPelusa();
  const p = t.pelusa;
  // ele nasce na porta; o teste o põe a um passo da mesa (andar até lá leva minutos no Chromium sem placa)
  p.bicho.group.position.set(mesa.x + 0.6, 0, mesa.z + 1.4);
  for (let k = 0; k < 80 && p.fase !== 'deitado'; k++) await new Promise((r) => setTimeout(r, 150));
  // a pose do pãozinho entra em alguns quadros
  for (let k = 0; k < 40 && !p.bicho.estaDeitado; k++) await new Promise((r) => setTimeout(r, 150));
  // a vizinha drena em dobro: um segundo de "quer pedir", com e sem ele deitado
  const vizinha = t.mesas.filter((m) => m !== mesa).sort((a, b) => Math.hypot(a.x - mesa.x, a.z - mesa.z) - Math.hypot(b.x - mesa.x, b.z - mesa.z))[0];
  const ficha = { calma: 1, nome: 'teste' };
  const c = { ficha, mesa: vizinha, paciencia: 1, fase: 'quer-pedir' };
  t.drenar(c, 1, 26);
  const comEle = 1 - c.paciencia;
  // recolher não dá com ele lá
  t.naMesa(mesa);
  const aindaSuja = t.sujeira.has(mesa);
  return {
    fase: p.fase, deitado: p.bicho.estaDeitado, y: +p.bicho.group.position.y.toFixed(2),
    distancia: +Math.hypot(vizinha.x - mesa.x, vizinha.z - mesa.z).toFixed(2), comEle: +comEle.toFixed(4),
    aindaSuja, pontoDaMesa: t.pontoDaMesa[4].enabled, psiu: t.pontoDoPelusa.enabled,
  };
});
await page.evaluate(() => {
  const t = window.jogo.current.world.root.userData.turno;
  window.jogo.focusCamera(t.pelusa.bicho.group);
  window.jogo.setZoom(2.6);
});
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-pelusa-na-mesa.png` });
await page.evaluate(() => window.jogo.focusCamera(null));
const espantado = await page.evaluate(async () => {
  const t = window.jogo.current.world.root.userData.turno;
  const mesa = t.mesas[4];
  const vizinha = t.mesas.filter((m) => m !== mesa).sort((a, b) => Math.hypot(a.x - mesa.x, a.z - mesa.z) - Math.hypot(b.x - mesa.x, b.z - mesa.z))[0];
  t.espantarOPelusa();
  const fase = t.pelusa?.fase;
  const c = { ficha: { calma: 1, nome: 'teste' }, mesa: vizinha, paciencia: 1, fase: 'quer-pedir' };
  t.drenar(c, 1, 26);
  const semEle = 1 - c.paciencia;
  t.naMesa(mesa);
  const recolheu = !t.sujeira.has(mesa);
  t.largarALouca();
  // ele sai pela porta: o teste o põe a um passo dela
  const p = t.pelusa;
  if (p) p.bicho.group.position.set(t.planta.entrada.x + 0.7, 0, t.planta.entrada.z);
  for (let k = 0; k < 80 && t.pelusa; k++) await new Promise((r) => setTimeout(r, 150));
  return { fase, semEle: +semEle.toFixed(4), recolheu, saiu: !t.pelusa };
});

// o Pelusa rouba o prato parado no balcão
const roubo = await page.evaluate(async () => {
  const t = window.jogo.current.world.root.userData.turno;
  t.forcarChegada('capy');
  const c = t.clientes[t.clientes.length - 1];
  c.fase = 'esperando';
  t.servirDaChapa({ para: c, prato: c.prato });
  const pronto = t.prontos.find((p) => p.para === c);
  pronto.idade = 10;
  t.soltarOPelusa();
  const p = t.pelusa;
  p.bicho.group.position.set(t.planta.balcao.x + 0.6, 0, t.planta.balcao.z + 0.5);
  for (let k = 0; k < 80 && !p.naBoca; k++) await new Promise((r) => setTimeout(r, 150));
  const r = {
    naBoca: !!p.naBoca, fase: p.fase, noBalcao: t.prontos.includes(pronto),
    voltouPraCozinha: t.comandas[0]?.para === c || t.cozinhando.some((x) => x.comanda.para === c),
  };
  t.tirarOPelusa();
  t.apagarCliente(c);
  return r;
});
await fecharODia(430);
s = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
checar(s.stats['turno:6:estrelas'] === 3, 'as tres estrelas do turno 6 nao foram anotadas');
checar(['dolma-de-cozinheiro', 'chapeu-de-cozinheiro'].every((id) => (s.premios ?? []).includes(id)), `o premio do turno 6 nao veio: ${JSON.stringify(s.premios)}`);
checar((s.flags ?? {})['funcionarios-do-mes'] === true, 'os seis turnos em tres estrelas nao penduraram a plaquinha');
checar((s.memories ?? []).some((m) => m.id === 'funcionarios-do-mes') && (s.memories ?? []).some((m) => m.id === 'dolma-de-cozinheiro'),
  'as memorias do turno 6 e da plaquinha nao entraram no diario');
const plaquinha = await page.evaluate(() => {
  let visivel = false;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'plaquinha-funcionarios-do-mes') visivel = o.visible; });
  return visivel;
});
await irPara(10.6, -6.2, 0.6);
await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(5); });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}-plaquinha.png` });

// ======================================================= 4. as roupas novas nos dois
const fotoDasRoupas = async (nome, pecas, giro) => {
  await page.evaluate(([pecas, giro]) => {
    const j = window.jogo;
    const I = window.aristoryItens;
    for (const quem of [j.playerId(), j.companionId()]) {
      for (let v = 0; v < 6; v++) j.unequipWearable(v, quem);
      for (const id of pecas) j.equipWearable(I[id], quem);
    }
    j.debugPlace(3.2, 5.6, giro);
    j.focusCamera(null);
    j.setZoom(2.4);
  }, [pecas, giro]);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
};
await fotoDasRoupas('bandana', ['bandana-de-churrasqueiro', 'avental-do-mania'], 0.6);
await fotoDasRoupas('bandana-costas', ['bandana-de-churrasqueiro', 'avental-do-mania'], 3.7);
await fotoDasRoupas('chef', ['dolma-de-cozinheiro', 'chapeu-de-cozinheiro'], 0.6);
await fotoDasRoupas('chef-costas', ['dolma-de-cozinheiro', 'chapeu-de-cozinheiro'], 3.7);
const vestidos = await page.evaluate(() => {
  const j = window.jogo;
  return [j.playerId(), j.companionId()].map((q) => j.wearables(q).map((i) => i?.id ?? null));
});

// ======================================================================= laudo
checar(sentadas.quantas === 3 && sentadas.sentadas, `as tres coelhinhas deviam sentar juntas: ${JSON.stringify(sentadas)}`);
checar(new Set(sentadas.lugares.map((l) => l.join())).size === 3, `cada coelhinha numa cadeira: ${JSON.stringify(sentadas.lugares)}`);
checar(sentadas.pedidos === 3 && grande.comandas === 3 && grande.prontos === 3, `a mesa grande pede tres pratos: ${JSON.stringify({ sentadas, grande })}`);
checar(grande.depoisDoPrimeiro.fase === 'esperando' && grande.depoisDoPrimeiro.faltam === 2, `com um prato so, a mesa grande espera as irmas: ${JSON.stringify(grande.depoisDoPrimeiro)}`);
checar(grande.calorDoPrimeiro === 0, `o primeiro prato devia esfriar na mesa esperando: ${grande.calorDoPrimeiro}`);
checar(grande.fase === 'comendo' && grande.pratosNaMesa === 3 && grande.quente === false, `com os tres, elas comem (e o primeiro chegou frio): ${JSON.stringify(grande)}`);
checar(grande.gasto === grande.somaDosPratos, `a conta da mesa grande e a dos tres pratos: ${JSON.stringify(grande)}`);
checar(contaCoelhas.pago > 0 && contaCoelhas.pago <= contaCoelhas.gasto, `prato frio nao da coracao dourado: ${JSON.stringify(contaCoelhas)}`);
checar(torcida.comemorando === true, `o Flynn devia comemorar o prato da mesa do lado: ${JSON.stringify(torcida)}`);
checar(torcida.depois > torcida.antes + 0.1, `a torcida devolve paciencia (+0,12): ${JSON.stringify(torcida)}`);
checar(torcida.vizinha > torcida.vizinhaAntes + 0.1, `a mesa vizinha do Flynn tambem recupera: ${JSON.stringify(torcida)}`);
checar(servidoGatito.refeicao > 17 && servidoGatito.refeicao <= 18, `o Gatito come devagar (18 s): ${JSON.stringify(servidoGatito)}`);
checar(sixSeven.gesto && sixSeven.segura > 1, `pagando, o Gatito faz o six seven antes de sair: ${JSON.stringify(sixSeven)}`);
checar(sixSeven.depois >= sixSeven.antes + 0.19, `o six seven devolve paciencia ao salao (+0,2): ${JSON.stringify(sixSeven)}`);
checar(deitado.fase === 'deitado' && deitado.deitado && deitado.y > 0.7, `o Pelusa devia deitar em cima da mesa suja: ${JSON.stringify(deitado)}`);
checar(deitado.aindaSuja && !deitado.pontoDaMesa && deitado.psiu, `com o Pelusa deitado nao se recolhe a mesa (so o psiu): ${JSON.stringify(deitado)}`);
checar(deitado.distancia < 5.2 && Math.abs(deitado.comEle / espantado.semEle - 2) < 0.05, `a vizinha drena em dobro com ele deitado: ${JSON.stringify({ deitado, espantado })}`);
checar(espantado.fase === 'fugindo' && espantado.recolheu && espantado.saiu, `o psiu espanta, a mesa recolhe e ele sai: ${JSON.stringify(espantado)}`);
checar(roubo.naBoca && roubo.fase === 'fugindo' && !roubo.noBalcao && roubo.voltouPraCozinha, `o Pelusa rouba o prato parado e o Walter refaz: ${JSON.stringify(roubo)}`);
checar(plaquinha, 'a plaquinha de funcionarios do mes nao apareceu na parede');
checar(vestidos.every((v) => v[0] === 'chapeu-de-cozinheiro' && v[1] === 'dolma-de-cozinheiro'), `o uniforme de chef nos dois: ${JSON.stringify(vestidos)}`);
falhas.push(...erros);

console.log('1. escala:', JSON.stringify(linhas));
console.log('2. coelhas:', JSON.stringify(sentadas), JSON.stringify(grande), JSON.stringify(contaCoelhas));
console.log('   flynn:', JSON.stringify(torcida));
console.log('3. gatito:', JSON.stringify(servidoGatito), JSON.stringify(sixSeven));
console.log('   pelusa:', JSON.stringify(deitado), JSON.stringify(espantado), JSON.stringify(roubo));
console.log('   plaquinha:', plaquinha, '· vestidos:', JSON.stringify(vestidos));
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
