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

/**
 * Abre o painel e devolve o que está pregado nele.
 *
 * O `KeyE` ENTRA NUMA ESPERA, e não num `waitForTimeout` só: o painel fica no
 * DOM mesmo fechado (o CSS só tira o `show`), então uma leitura feita com ele
 * fechado devolve o desenho ANTERIOR sem reclamar de nada. Foi assim que a
 * conferência do prêmio leu "fechado" depois da vitória — era a pintura velha,
 * e não o estado novo.
 */
const espiarPainel = async () => {
  for (let i = 0; i < 12; i++) {
    if (await page.evaluate(
      () => document.querySelector('.quadro-de-inscricoes')?.classList.contains('show') ?? false,
    )) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(900);
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
      // A ETIQUETA DO PRÊMIO, por ficha: `fechado` (ainda não ganharam dele),
      // `aberto` (ganharam e a roupa espera o clique) ou `pego` (já está no
      // guarda-roupa). Quem não dá prêmio nenhum — a dupla — não tem etiqueta.
      premios: fichas.map((f) => {
        const p = f.querySelector('.premio');
        if (!p) return null;
        return {
          estado: ['fechado', 'aberto', 'pego'].find((c) => p.classList.contains(c)) ?? '?',
          texto: p.textContent ?? '',
        };
      }),
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
  /*
   * PARA ONDE ELA ESTÁ OLHANDO.
   *
   * O corpo dela tem que apontar para o lado de quem saca (`-X` da mesa). O
   * Renan viu ela jogando a partida inteira de PERFIL: o alvo de `encarar`
   * que a cena da loja tinha deixado pendurado continuava girando ela por
   * baixo, quarenta unidades dali.
   */
  const mesaPos = window.__mesa.position;
  let desvio = null;
  if (ov) {
    const alvo = Math.atan2((mesaPos.x - 2.07) - ov.position.x, mesaPos.z - ov.position.z);
    let d = alvo - ov.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    desvio = +(Math.abs(d) * 57.3).toFixed(1);
  }
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
    desvioDoOlhar: desvio,
    // o degrau que ela ganhou: a cena calcula para a cabeça passar do tampo
    degrau: ov ? +(ov.position.y).toFixed(2) : null,
    tampo,
    placar: document.querySelector('.placar')?.textContent ?? '',
  };
}, TAMPO);
await page.screenshot({ path: `${OUT}-partida.png` });

/**
 * E ELA ANDA PARA A FRENTE, e não de lado.
 *
 * Com um alvo de `encarar` pendurado (o que a porta da loja deixa toda vez que
 * alguém fala com ela), a rotação da caminhada era sobrescrita quadro a quadro
 * e a ovelha atravessava a cena apontada para o cliente antigo. A medida é o
 * ângulo entre o CORPO e o RUMO em que ela se move, passo a passo.
 */
const andarDireito = await page.evaluate(async () => {
  const ov = window.__mesa.userData.chamaveis.estella.bicho;
  ov.entrarEmServico();
  ov.group.position.set(-30, 0, -10);
  ov.encarar(-22, -10); // 90° fora do caminho, que é a situação do bug
  await new Promise((r) => setTimeout(r, 500));
  const amostras = [];
  let ax = ov.x;
  let az = ov.z;
  void ov.irPara(-30, -21, 0.9);
  for (let i = 0; i < 300; i++) {
    await new Promise((r) => setTimeout(r, 70));
    const dx = ov.x - ax;
    const dz = ov.z - az;
    if (Math.hypot(dx, dz) > 0.01) {
      let d = Math.atan2(dx, dz) - ov.group.rotation.y;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      amostras.push(Math.abs(d));
    }
    ax = ov.x;
    az = ov.z;
    if (Math.hypot(ov.x + 30, ov.z + 21) < 0.2) break;
  }
  amostras.sort((m, n) => m - n);
  return {
    passos: amostras.length,
    medianaEmGraus: amostras.length
      ? +(amostras[Math.floor(amostras.length / 2)] * 57.3).toFixed(1) : null,
  };
});

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

// ================================ 5b. o prêmio da Estella, no papel dela
//
// A PEÇA SÓ APARECE DEPOIS DA PARTIDA GANHA, e só entra no guarda-roupa no
// clique. É o pedido do Renan em três tempos, e cada tempo tem um defeito
// próprio que só este teste pega: prêmio que aparece de graça (a etiqueta
// `aberto` sem a vitória), prêmio que entra sozinho (a peça no armário sem o
// clique) e prêmio que some (o armário sem ela na visita seguinte).
await promptEm(QUADRO.x, QUADRO.z + 1.1, /inscri/i);
const depoisDeGanhar = await espiarPainel();
if (!depoisDeGanhar.aberto) erros.push('o quadro nao reabriu depois da partida');
const daEstella = depoisDeGanhar.nomes.findIndex((n) => /Estella/i.test(n));
const antesDoClique = await page.evaluate(() => ({
  premios: [...window.jogo.save.premios],
  armario: window.jogo.wardrobeItems('ari').map((i) => i.id),
}));

// o clique na etiqueta não pode desafiar ninguém: ele para de subir para a
// ficha, senão pegar a roupa começaria uma partida
if (daEstella >= 0) {
  await page.locator('.quadro-de-inscricoes .ficha').nth(daEstella)
    .locator('.premio').click();
  await page.waitForTimeout(900);
}
const depoisDoClique = await page.evaluate(() => ({
  aindaAberto: document.querySelector('.quadro-de-inscricoes')?.classList.contains('show') ?? false,
  estado: [...document.querySelectorAll('.quadro-de-inscricoes .ficha')]
    .map((f) => f.querySelector('.premio')?.className ?? null),
  premios: [...window.jogo.save.premios],
  armarioAri: window.jogo.wardrobeItems('ari').map((i) => i.id),
  armarioRenan: window.jogo.wardrobeItems('renan').map((i) => i.id),
}));
await page.screenshot({ path: `${OUT}-premio.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(600);

// e ela CONTINUA lá depois de recarregar: o prêmio é do casal para sempre,
// como a peça paga na boutique
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const depoisDoReload = await page.evaluate(() => {
  window.jogo.abrirGuardaRoupa();
  const r = {
    premios: [...window.jogo.save.premios],
    armarioAri: window.jogo.wardrobeItems('ari').map((i) => i.id),
    armarioRenan: window.jogo.wardrobeItems('renan').map((i) => i.id),
  };
  window.jogo.ui.fecharArmario();
  return r;
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
if (naMesa && naMesa.desvioDoOlhar !== null && naMesa.desvioDoOlhar > 20) {
  falhas.push(`ela esta jogando de perfil: ${naMesa.desvioDoOlhar}° fora do rumo da mesa`);
}

if (andarDireito.passos < 20) {
  falhas.push(`a caminhada dela nao foi medida (${andarDireito.passos} passos)`);
} else if (andarDireito.medianaEmGraus > 15) {
  falhas.push(`ela anda de lado: ${andarDireito.medianaEmGraus}° entre o corpo e o rumo`);
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

// 5b. os prêmios
// quatro etiquetas (a dupla não dá prêmio), todas FECHADAS antes da vitória
const etiquetas = cheio.premios.filter(Boolean);
if (etiquetas.length !== 4) {
  falhas.push(`o quadro cheio tem ${etiquetas.length} etiquetas de premio, esperado 4`);
}
if (cheio.premios[0] !== null) falhas.push('a ficha da dupla ganhou etiqueta de premio');
if (etiquetas.some((p) => p.estado !== 'fechado')) {
  falhas.push(`premio aberto sem vitoria: ${JSON.stringify(cheio.premios)}`);
}
// depois da partida ganha, SÓ o dela abre
const daEstellaDepois = depoisDeGanhar.premios[daEstella];
if (!daEstellaDepois || daEstellaDepois.estado !== 'aberto') {
  falhas.push(`o premio da Estella nao abriu depois da vitoria: ${JSON.stringify(daEstellaDepois)}`);
}
if (depoisDeGanhar.premios.filter((p) => p && p.estado !== 'fechado').length !== 1) {
  falhas.push(`abriu premio de quem nao foi batido: ${JSON.stringify(depoisDeGanhar.premios)}`);
}
if (antesDoClique.premios.length !== 0) {
  falhas.push(`o premio entrou sozinho, sem o clique: ${JSON.stringify(antesDoClique.premios)}`);
}
// o clique pega a roupa e NÃO desafia ninguém: o painel continua aberto
if (!depoisDoClique.aindaAberto) falhas.push('o clique no premio fechou o quadro');
if (depoisDoClique.premios.length !== 4) {
  falhas.push(`o conjunto da Estella nao entrou inteiro: ${JSON.stringify(depoisDoClique.premios)}`);
}
for (const quem of ['armarioAri', 'armarioRenan']) {
  const faltando = depoisDoClique.premios.filter((id) => !depoisDoClique[quem].includes(id));
  if (faltando.length) falhas.push(`${quem} sem as pecas ${JSON.stringify(faltando)}`);
}
if (!depoisDoClique.estado[daEstella]?.includes('pego')) {
  falhas.push(`a etiqueta nao virou "pego": ${JSON.stringify(depoisDoClique.estado)}`);
}
// e a peça continua lá na próxima visita ao armário, como a comprada
if (depoisDoReload.premios.length !== 4) {
  falhas.push(`o premio nao sobreviveu ao reload: ${JSON.stringify(depoisDoReload.premios)}`);
}
for (const quem of ['armarioAri', 'armarioRenan']) {
  const faltando = depoisDoReload.premios.filter((id) => !depoisDoReload[quem].includes(id));
  if (faltando.length) falhas.push(`depois do reload, ${quem} sem ${JSON.stringify(faltando)}`);
}
falhas.push(...erros);

console.log('1. tabua:', JSON.stringify(noMundo), '· prompt:', JSON.stringify(promptDoQuadro));
console.log('2. comeco:', comecando.quantas, 'fichas ·', comecando.vazias, 'vagas abertas ·',
  JSON.stringify(comecando.nomes));
console.log('3. cheio:', JSON.stringify(cheio.nomes));
console.log('   retratos:', JSON.stringify(cheio.retratos));
console.log('   historinhas (letras):', JSON.stringify(cheio.historias));
console.log('4. partida:', JSON.stringify(naMesa));
console.log('   andando:', andarDireito.passos, 'passos ·',
  andarDireito.medianaEmGraus, 'graus entre o corpo e o rumo');
console.log('5. fim:', JSON.stringify(falasDoFim.slice(0, 3)));
console.log('   devolvida:', JSON.stringify(devolvida));
console.log('5b. premios no quadro cheio:',
  JSON.stringify(cheio.premios.map((p) => p?.estado ?? '—')));
console.log('    depois da vitoria:',
  JSON.stringify(depoisDeGanhar.premios.map((p) => p?.estado ?? '—')));
console.log('    antes do clique, no save:', JSON.stringify(antesDoClique.premios));
console.log('    depois do clique:', JSON.stringify(depoisDoClique.premios),
  '· quadro aberto:', depoisDoClique.aindaAberto);
console.log('    no armario do Ari:', JSON.stringify(depoisDoClique.armarioAri));
console.log('    depois do reload:', JSON.stringify(depoisDoReload.premios));

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
