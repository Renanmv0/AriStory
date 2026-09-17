/**
 * O QUADRO DE INSCRIÇÕES da arena de ping pong.
 *
 * O que este teste guarda:
 *
 * - **O QUADRO EXISTE NO MUNDO, e não só na tela.** A tábua está plantada na
 *   entrada da arena, fora do tablado, com colisor — e o prompt dela ganha da
 *   mesa e do suporte de raquetes de perto.
 * - **ELE COMEÇA QUASE VAZIO.** Só a dupla está pregada; o resto são VAGAS
 *   ABERTAS, sem foto e sem clique. Um quadro que já nasce cheio entrega os
 *   personagens antes de eles aparecerem — e nenhuma vaga pode dizer o nome
 *   de quem ainda não chegou.
 * - **A VITÓRIA CONTRA O JEAN-LUC ENCHE O QUADRO.** É esse o prêmio: os três
 *   bichos do parque aparecem com retrato, historinha e assinatura.
 * - **OS RETRATOS SÃO PINTADOS DE VERDADE.** Cada canvas tem que sair com cor
 *   no meio: ficha com retrato em branco é o defeito que passaria despercebido
 *   na foto (o papel também é claro).
 * - **DÁ PARA DESAFIAR, E O CONVIDADO VEM.** O bicho escolhido sai do posto
 *   dele, atravessa, sobe no caixote se for baixo, joga — e VOLTA para o posto
 *   quando acaba. Bicho que fica de serviço para sempre nunca mais passeia.
 *
 * Uso: node scripts/quadro.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './quadro';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** onde a tábua mora, copiado de `villaLobos.ts` */
const QUADRO = { x: -12.4, z: 20.6 };
/** altura do tampo da mesa, de `MESA_PING` */
const TAMPO = 0.76;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 980, height: 900 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=${QUADRO.x},${QUADRO.z + 1.5}&zoom=10`,
  { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

await page.evaluate(() => {
  let mesa = null;
  let tabua = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.pingpong) mesa = n;
    if (n.userData?.peca === 'quadro-de-inscricoes') tabua = n;
  });
  window.__mesa = mesa;
  window.__tabua = tabua;
  window.__jl = mesa.userData.jeanLuc.bicho;
});

// ============================================ 1. a tábua no mundo
const noMundo = await page.evaluate((q) => {
  const t = window.__tabua;
  return {
    achou: !!t,
    onde: t ? [+t.position.x.toFixed(2), +t.position.z.toFixed(2)] : null,
    // ela é da grama, e não do tablado: o tablado começa em z = 21,2
    foraDoTablado: t ? t.position.z < 21.2 : false,
    colide: window.jogo.current.world.blocked
      ? window.jogo.current.world.blocked(q.x, q.z)
      : null,
  };
}, QUADRO);

/** lê o prompt por condição: o balão guarda o último texto enquanto escondido */
const promptEm = async (x, z, espera) => {
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
  let texto = '';
  for (let i = 0; i < 16; i++) {
    await page.waitForTimeout(300);
    texto = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
    if (!espera || espera.test(texto)) break;
  }
  return texto;
};
const promptDoQuadro = await promptEm(QUADRO.x, QUADRO.z + 1.1, /inscri/i);
await page.screenshot({ path: `${OUT}-mundo.png` });

/** abre o painel e devolve o que está pregado nele */
const espiarPainel = async () => {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1500);
  const dados = await page.evaluate(() => {
    const fichas = [...document.querySelectorAll('.quadro-de-inscricoes .ficha')];
    return {
      aberto: document.querySelector('.quadro-de-inscricoes')?.classList.contains('show') ?? false,
      quantas: fichas.length,
      nomes: fichas.map((f) => f.querySelector('b')?.textContent ?? ''),
      vazias: fichas.filter((f) => f.classList.contains('vazia')).length,
      // cada retrato tem que ter cor de verdade no meio: canvas em branco é o
      // defeito que a foto não acusa, porque o papel também é claro
      retratos: fichas.map((f) => {
        const c = f.querySelector('canvas');
        if (!c) return null;
        const ctx = c.getContext('2d');
        const d = ctx.getImageData(Math.floor(c.width / 2), Math.floor(c.height / 2), 1, 1).data;
        return `${d[0]},${d[1]},${d[2]},${d[3]}`;
      }),
      historias: fichas.map((f) => (f.querySelector('p')?.textContent ?? '').length),
      assinaturas: fichas.filter((f) => f.querySelector('.assinatura')).length,
    };
  });
  return dados;
};

// ============================================ 2. o quadro quase vazio
const comecando = await espiarPainel();
await page.screenshot({ path: `${OUT}-vazio.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(700);

// ============================================ 3. o prêmio enche o quadro
await page.evaluate(async () => {
  for (let i = 0; i < 5; i++) window.jogo.save.bump('pingpong.vitorias');
  window.__ok = false;
  void window.__mesa.userData.jeanLuc.chegar().then(() => { window.__ok = true; });
});
for (let i = 0; i < 300; i++) {
  if (await page.evaluate(() => window.__ok)) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
}
const soComOPato = await page.evaluate(() => window.jogo.flag('jean-luc-conhecido'));
// a vitória contra ele é o gatilho do resto; aqui ela é escrita direto porque
// quem a joga de verdade é o `scripts/duelo.mjs`
await page.evaluate(() => window.jogo.setFlag('jean-luc-batido'));
await page.waitForTimeout(400);

await promptEm(QUADRO.x, QUADRO.z + 1.1, /inscri/i);
const cheio = await espiarPainel();
await page.screenshot({ path: `${OUT}-cheio.png` });

// ============================================ 4. desafiar a Estella
const estella = cheio.nomes.findIndex((n) => /Estella/i.test(n));
if (estella >= 0) {
  const fichas = page.locator('.quadro-de-inscricoes .ficha');
  await fichas.nth(estella).click();
  await page.waitForTimeout(500);
  await fichas.nth(estella).click(); // o segundo clique desafia
  await page.waitForTimeout(1200);
}
// drena a fala do convite e espera a partida montar
for (let i = 0; i < 20 && (await page.locator('.dialogue.show').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
}
let comecou = false;
for (let i = 0; i < 160; i++) {
  comecou = await page.evaluate(() => window.__ping !== undefined
    ? window.__ping.fase !== 'parado'
    : (window.__ping = window.__mesa.userData.pingpong).fase !== 'parado');
  if (comecou) break;
  await page.waitForTimeout(400);
}
await page.waitForTimeout(600);
const naMesa = await page.evaluate((tampo) => {
  const p = window.__mesa.userData.pingpong;
  let ov = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.peca === 'estella') ov = n;
  });
  let cx = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.peca === 'caixote') cx = n;
  });
  const mesa = window.__mesa.position;
  return {
    adversario: p.adversario?.id ?? null,
    ovelhaDaMesa: ov ? +Math.hypot(ov.position.x - mesa.x, ov.position.z - mesa.z).toFixed(2) : null,
    ovelhaY: ov ? +ov.position.y.toFixed(2) : null,
    caixote: cx ? cx.visible : null,
    // o degrau que ela ganhou: a cena calcula para a cabeça passar do tampo
    degrau: ov ? +(ov.position.y).toFixed(2) : null,
    tampo,
    placar: document.querySelector('.placar')?.textContent ?? '',
  };
}, TAMPO);
await page.screenshot({ path: `${OUT}-partida.png` });

// ============================================ 5. e ela volta pro posto
await page.evaluate(() => {
  const p = window.__mesa.userData.pingpong;
  p.meus = 4;
  p.dele = 0;
});
const inicio = Date.now();
while (Date.now() - inicio < 300000) {
  const e = await page.evaluate(() => {
    const p = window.__mesa.userData.pingpong;
    return { fase: p.fase, dele: p.dele, z: p.bola.position.z };
  });
  if (e.fase === 'fim' || e.fase === 'parado') break;
  if (e.dele > 0) {
    await page.evaluate(() => {
      const p = window.__mesa.userData.pingpong;
      p.meus = 4;
      p.dele = 0;
    });
  }
  await page.mouse.move(490 + Math.max(-1, Math.min(1, e.z / 0.82)) * 450, 560);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(1200);
const falasDoFim = [];
for (let i = 0; i < 20 && (await page.locator('.dialogue.show').count()); i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 3 && !falasDoFim.includes(t)) falasDoFim.push(t);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
}
await page.waitForTimeout(1200);
const devolvida = await page.evaluate(() => {
  let ov = null;
  let cx = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.peca === 'estella') ov = n;
    if (n.userData?.peca === 'caixote') cx = n;
  });
  return {
    // o posto dela é a calçada da lojinha, em (-32,6; -16,5)
    noPosto: ov ? +Math.hypot(ov.position.x + 32.6, ov.position.z + 16.5).toFixed(2) : null,
    ovelhaY: ov ? +ov.position.y.toFixed(2) : null,
    caixote: cx ? cx.visible : null,
    travado: window.jogo.player.locked === true,
    ombro: window.jogo.camOmbro !== null,
    memorias: JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}')
      .memories?.map((m) => m.id) ?? [],
  };
});

// ============================================ 6. veredito
const falhas = [];
if (!noMundo.achou) falhas.push('a tabua do quadro nao esta na cena');
if (!noMundo.foraDoTablado) falhas.push(`a tabua nasceu dentro do tablado: ${JSON.stringify(noMundo.onde)}`);
if (!/inscri/i.test(promptDoQuadro)) falhas.push(`o quadro nao tem prompt: "${promptDoQuadro}"`);

if (!comecando.aberto) falhas.push('o painel nao abriu');
if (comecando.quantas !== 5) falhas.push(`o quadro comecou com ${comecando.quantas} fichas, esperado 5`);
if (comecando.vazias !== 4) {
  falhas.push(`no comeco tem ${comecando.vazias} vagas abertas, esperado 4`);
}
if (comecando.nomes.some((n) => /Jean-Luc|Mano|Cookie|Estella/i.test(n))) {
  falhas.push(`o quadro entrega quem ainda nao chegou: ${JSON.stringify(comecando.nomes)}`);
}

if (!soComOPato) falhas.push('a chegada do pato nao gravou a flag dele');
if (cheio.vazias !== 0) falhas.push(`depois do premio sobraram ${cheio.vazias} vagas abertas`);
for (const quem of ['Jean-Luc', 'Mano', 'Cookie', 'Estella']) {
  if (!cheio.nomes.some((n) => n.includes(quem))) falhas.push(`${quem} nao esta no quadro cheio`);
}
for (const [i, cor] of cheio.retratos.entries()) {
  if (!cor) { falhas.push(`a ficha ${i} nao tem retrato`); continue; }
  const [, , , a] = cor.split(',').map(Number);
  if (a < 200) falhas.push(`o retrato de ${cheio.nomes[i]} saiu em branco (${cor})`);
}
if (cheio.historias.some((n) => n < 80)) {
  falhas.push(`tem historinha curta demais: ${JSON.stringify(cheio.historias)}`);
}
if (cheio.assinaturas !== 5) falhas.push(`so ${cheio.assinaturas} fichas tem assinatura`);

if (!comecou) falhas.push('a partida contra a Estella nunca comecou');
if (naMesa && naMesa.adversario !== 'estella') {
  falhas.push(`quem entrou na mesa foi "${naMesa?.adversario}"`);
}
if (naMesa && naMesa.ovelhaDaMesa !== null && naMesa.ovelhaDaMesa > 2.6) {
  falhas.push(`a Estella nao chegou na mesa: ${naMesa.ovelhaDaMesa} dela`);
}
if (naMesa && !/Estella/.test(naMesa.placar)) {
  falhas.push(`o placar nao diz o nome dela: "${naMesa.placar}"`);
}

if (devolvida.caixote) falhas.push('o caixote ficou na cena depois da partida');
if (devolvida.noPosto !== null && devolvida.noPosto > 0.8) {
  falhas.push(`a Estella nao voltou para a porta da loja: ${devolvida.noPosto} dela`);
}
if (Math.abs(devolvida.ovelhaY ?? 0) > 0.02) {
  falhas.push(`a Estella ficou flutuando: y = ${devolvida.ovelhaY}`);
}
if (devolvida.travado) falhas.push('a partida devolveu a dupla travada');
if (devolvida.ombro) falhas.push('a camera de ombro ficou ligada');
if (!devolvida.memorias.includes('pingpong-estella')) {
  falhas.push(`a memoria da vitoria contra ela nao entrou: ${JSON.stringify(devolvida.memorias)}`);
}
if (falasDoFim.length < 3) falhas.push(`a conversa do fim nao saiu: ${JSON.stringify(falasDoFim)}`);
falhas.push(...erros);

console.log('1. tabua:', JSON.stringify(noMundo), '· prompt:', JSON.stringify(promptDoQuadro));
console.log('2. comeco:', comecando.quantas, 'fichas ·', comecando.vazias, 'vagas abertas ·',
  JSON.stringify(comecando.nomes));
console.log('3. cheio:', JSON.stringify(cheio.nomes));
console.log('   retratos:', JSON.stringify(cheio.retratos));
console.log('   historinhas (letras):', JSON.stringify(cheio.historias));
console.log('4. partida:', JSON.stringify(naMesa));
console.log('5. fim:', JSON.stringify(falasDoFim.slice(0, 3)));
console.log('   devolvida:', JSON.stringify(devolvida));

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
