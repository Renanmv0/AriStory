/**
 * O quarto do Ari e o armário.
 *
 * O que este teste guarda:
 * - a porta liga as DUAS pontas: da sala entra no quarto, e do quarto volta
 *   para a sala no ponto certo (porta que só vai é meio caminho);
 * - o quarto é caminhável: nenhum ponto do chão fica trancado por móvel, e o
 *   spawn não nasce dentro de um colisor;
 * - o armário desbloqueia o acervo na primeira vez e veste de verdade — a peça
 *   escolhida acaba no loadout e no corpo;
 * - a roupa SOBREVIVE à troca de cena, que é o caminho onde o `setOutfit` da
 *   cena nova poderia atropelar o guarda-roupa.
 *
 * Uso: node scripts/quarto.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './quarto';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// começa na SALA, perto da porta nova: o teste tem que atravessar de verdade
await page.goto(`${BASE}/?cena=casa&em=-4.9,-1.2&olhar=-1.57`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

const cena = () => page.evaluate(() => window.jogo.current.def.id);
const onde = () =>
  page.evaluate(() => {
    const p = window.jogo.playerPosition();
    return [+p.x.toFixed(2), +p.z.toFixed(2)];
  });

const promptAgora = async () =>
  (await page.locator('.prompt.show').textContent().catch(() => null))?.replace(/\s+/g, ' ').trim() ?? null;

/** aperta E e espera o diálogo/transição assentar */
const usar = async (esperar = 900) => {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(esperar);
};

/** fecha o que estiver aberto de diálogo, escolhendo a opção `indice` quando houver botões */
const responder = async (indice = 0, voltas = 14) => {
  for (let i = 0; i < voltas; i++) {
    if (await page.locator('.escolhas button').count()) {
      for (let n = 0; n < indice; n++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);
      }
      await usar(700);
      return true;
    }
    if (!(await page.locator('.dialogue.show').count())) return false;
    await usar(550);
  }
  return false;
};

// ------------------------------------------------------------- ida pra dentro
const promptDaSala = await promptAgora();
await usar(2600);
const dentro = await cena();
const spawn = await onde();
await page.screenshot({ path: `${OUT}-dentro.png` });

/**
 * O quarto é caminhável?
 *
 * Varre o retângulo do chão e pergunta ao colisor da cena, em vez de andar às
 * cegas: andar mede o pathfinding, não o cenário, e em câmera lenta headless
 * não daria tempo de cobrir o cômodo.
 */
const chao = await page.evaluate(() => {
  const cols = window.jogo.current.world.colliders;
  const R = 0.42; // o mesmo raio do jogador
  const bate = (x, z) => {
    for (const c of cols) {
      if (c.kind === 'circle') {
        if (Math.hypot(x - c.x, z - c.z) < R + c.r) return true;
      } else {
        const cos = Math.cos(-c.rot);
        const sin = Math.sin(-c.rot);
        const lx = (x - c.x) * cos - (z - c.z) * sin;
        const lz = (x - c.x) * sin + (z - c.z) * cos;
        const dx = Math.max(0, Math.abs(lx) - c.hw);
        const dz = Math.max(0, Math.abs(lz) - c.hd);
        if (dx * dx + dz * dz < R * R) return true;
      }
    }
    return false;
  };
  let livre = 0;
  let preso = 0;
  const mapa = [];
  for (let z = -2.8; z <= 2.8; z += 0.4) {
    let linha = '';
    for (let x = -3.4; x <= 3.4; x += 0.4) {
      const b = bate(x, z);
      b ? preso++ : livre++;
      linha += b ? '#' : '.';
    }
    mapa.push(linha);
  }
  // Alagamento a partir do spawn. Contar quanto do chão é livre não diz nada:
  // o que importa é que TUDO que é livre esteja ligado ao ponto onde a dupla
  // nasce — um pedaço de chão cercado por móvel conta como livre e é
  // inalcançável.
  const larg = mapa[0].length;
  const alt = mapa.length;
  const ix = Math.round((0.9 + 3.4) / 0.4);
  const iz = Math.round((1.7 + 2.8) / 0.4);
  const visto = new Set();
  const fila = [[ix, iz]];
  while (fila.length) {
    const [cx, cz] = fila.pop();
    const k = cz * larg + cx;
    if (cx < 0 || cz < 0 || cx >= larg || cz >= alt || visto.has(k)) continue;
    if (mapa[cz][cx] === '#') continue;
    visto.add(k);
    fila.push([cx + 1, cz], [cx - 1, cz], [cx, cz + 1], [cx, cz - 1]);
  }
  return {
    livre, preso, mapa,
    spawnLivre: !bate(0.9, 1.7),
    alcancavel: visto.size,
  };
});

// ------------------------------------------------------------------- armário
await page.evaluate(() => window.jogo.debugPlace(2.65, -1.5, 0));
await page.waitForTimeout(900);
const promptArmario = await promptAgora();
await usar(900);
// a conversa de primeira abertura; no fim dela o painel abre sozinho
await responder(0);
await page.waitForTimeout(1200);
const painel = await page.locator('.armario.show').count();
// as 4 partes do corpo aparecem sempre, cheias ou vazias
const partes = await page.locator('.armario .parte').count();
// as peças entraram no GUARDA-ROUPA — não nas vagas de mão, que continuam
// sendo só para item de mão e para vestimenta funcional
const inventario = await page.evaluate(() => ({
  mao: window.jogo.handItems().map((i) => i?.id ?? null),
  armario: window.jogo.wardrobeItems().map((i) => i.id),
  vestindo: window.jogo.wearables().map((i) => i?.id ?? null),
}));
await page.screenshot({ path: `${OUT}-painel.png` });

// veste a primeira peça guardada e confere que ela foi para a vaga do CORPO
// Quantas peças o armário guarda é decisão da CENA e já mudou de 4 para 6.
// O teste mede a partir do que ele mesmo viu chegar, e não de um número
// cravado — o que ele guarda é a regra, não o tamanho do acervo.
const NO_ARMARIO = inventario.armario.length;
const antes = await page.locator('.armario .peca').count();
// a camisa de propósito: ela é o caminho SÓ-COR, sem geometria própria
await page.locator('.armario .peca', { hasText: 'Camisa' }).first().click();
await page.waitForTimeout(800);
const vestido = await page.evaluate(() => window.jogo.wearables().map((i) => i?.id ?? null));
const noCorpo = await page.evaluate(() => {
  const ids = [];
  window.jogo.player.rig.group.traverse((o) => {
    if (o.userData?.roupa && o.visible) ids.push(o.userData.roupa);
  });
  const cores = {};
  for (const t of window.jogo.player.rig.trocaMaterial) {
    cores[`${t.slot}:${t.parte}`] = '#' + t.mesh.material.color.getHexString();
  }
  return { ids, cores };
});

// O boneco 3D tem canvas próprio e ele DESENHOU: um canvas com contexto e
// tamanho, e pixels que não são todos transparentes. Medir a área pintada é o
// que separa "o elemento existe" de "o boneco apareceu".
const boneco = await page.evaluate(() => {
  const c = document.querySelector('.armario canvas.boneco');
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height), buffer: c.width * c.height };
});

await page.screenshot({ path: `${OUT}-vestido.png` });

// tirar devolve a peça para o ARMÁRIO, não joga fora nem entope a mochila
await page.locator('.armario .parte.cheio').first().click();
await page.waitForTimeout(800);
const depoisDeTirar = await page.evaluate(() => ({
  mao: window.jogo.handItems().filter(Boolean).length,
  armario: window.jogo.wardrobeItems().length,
  vestindo: window.jogo.wearables().filter(Boolean).length,
}));
await page.screenshot({ path: `${OUT}-tirado.png` });

// ---------------------------------------------------- os DOIS se vestem
// O armário abastece o parceiro também: o T troca quem o painel mostra, e o
// outro tem que ter as mesmas peças para vestir.
const doParceiroAntes = await page.evaluate(() => ({
  quem: window.jogo.companionId(),
  armario: window.jogo.wardrobeItems(window.jogo.companionId()).length,
}));
// veste o gorro no PRIMEIRO antes de trocar: sem isso o teste não prova que os
// dois ficam vestidos ao mesmo tempo, só que o segundo consegue se vestir
await page.locator('.armario .peca', { hasText: 'Gorro' }).first().click();
await page.waitForTimeout(700);
await page.keyboard.press('KeyT');
await page.waitForTimeout(1200);
const depoisDoT = {
  aindaAberto: (await page.locator('.armario.show').count()) === 1,
  dono: await page.locator('.armario .dono').textContent(),
  pecas: await page.locator('.armario .peca').count(),
  controlando: await page.evaluate(() => window.jogo.playerId()),
};
// veste no segundo personagem e confere que o PRIMEIRO não perdeu nada
await page.locator('.armario .peca', { hasText: 'Calça' }).first().click();
await page.waitForTimeout(800);
const osDois = await page.evaluate(() => ({
  ari: window.jogo.wearables('ari').map((i) => i?.id ?? null),
  renan: window.jogo.wearables('renan').map((i) => i?.id ?? null),
}));
await page.screenshot({ path: `${OUT}-os-dois.png` });
await page.keyboard.press('KeyT');
await page.waitForTimeout(1000);

// veste tudo de novo para a troca de cena valer alguma coisa
await page.evaluate(() => {
  const j = window.jogo;
  // tira do ARMÁRIO antes de vestir: `vestir` recusa item que a pessoa já tem,
  // e estar guardado conta como ter
  for (const i of [...j.wardrobeItems()]) {
    j.removeItem(i.id);
    j.equipWearable(i);
  }
});
await page.keyboard.press('Escape');
await page.waitForTimeout(700);
const fechou = (await page.locator('.armario.show').count()) === 0;

// ------------------------------------------------------------------ estante
// A estante era um bloco maciço com os livros enfiados dentro, e a face da
// frente dos dois caía no mesmo z: as lombadas serrilhavam. O que este bloco
// guarda é a FOLGA — nenhum livro pode encostar na boca nem no fundo da peça.
const estante = await page.evaluate(() => {
  let peca = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'estante') peca = o;
  });
  if (!peca) return null;

  // a face mais à frente da carcaça, e a de cada livro, no espaço da peça
  const frenteDe = (m, extra = 0) =>
    m.position.z + extra + (m.geometry?.parameters?.depth ?? 0) / 2;
  const fundoDe = (m, extra = 0) =>
    m.position.z + extra - (m.geometry?.parameters?.depth ?? 0) / 2;

  let bocaDaPeca = -Infinity;
  let fundoDaPeca = Infinity;
  const livros = [];
  for (const filho of peca.children) {
    if (filho.isMesh && !filho.userData?.livro) {
      bocaDaPeca = Math.max(bocaDaPeca, frenteDe(filho));
      fundoDaPeca = Math.min(fundoDaPeca, fundoDe(filho));
    }
    // os livros moram num pivô (é ele que dá o tombo girando pela base)
    for (const neto of filho.children ?? []) {
      if (neto.userData?.livro) {
        livros.push({ frente: frenteDe(neto, filho.position.z), fundo: fundoDe(neto, filho.position.z) });
      }
    }
  }
  return {
    bocaDaPeca, fundoDaPeca,
    quantos: livros.length,
    folgaNaFrente: Math.min(...livros.map((l) => bocaDaPeca - l.frente)),
    folgaNoFundo: Math.min(...livros.map((l) => l.fundo - fundoDaPeca)),
    // a peça é OCA: alguma tábua tem que estar recuada em relação à boca
    temVao: peca.children.some((c) => c.isMesh && frenteDe(c) < bocaDaPeca - 0.05),
  };
});

// e a conversa cita os dois livros favoritos, cada um na boca de quem é dono
await page.evaluate(() => window.jogo.debugPlace(0.35, -1.8, 0));
await page.waitForTimeout(900);
const promptEstante = await promptAgora();
const falas = [];
await page.keyboard.press('KeyE');
for (let i = 0; i < 24; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  // espera a máquina de escrever terminar antes de ler, senão sai meia frase
  await page.waitForTimeout(900);
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  const quem = await page.locator('.dialogue .who').textContent().catch(() => '');
  if (t) falas.push(`${quem}: ${t}`);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(350);
}
await page.waitForTimeout(700);
const conversaDaEstante = falas.join(' | ');
const dialogoFechou = (await page.locator('.dialogue.show').count()) === 0;
const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'os-dois-livros'),
);

// ------------------------------------------------------------ volta pra sala
await page.evaluate(() => window.jogo.debugPlace(0.9, 2.0, 0));
await page.waitForTimeout(900);
const promptVolta = await promptAgora();
await usar(2600);
const voltou = await cena();
const ondeVoltou = await onde();
// a roupa tem que atravessar a troca de cena
const depoisDaCena = await page.evaluate(() => window.jogo.wearables('ari').map((i) => i?.id ?? null));

console.log('prompt na sala:', promptDaSala);
console.log('entrou em:', dentro, '· nasceu em', JSON.stringify(spawn));
console.log('chão do quarto · livre:', chao.livre, '· bloqueado:', chao.preso,
  '· spawn limpo:', chao.spawnLivre, '· alcançável do spawn:', chao.alcancavel);
// mapa de cima (-Z no topo, como a planta): '.' anda, '#' não
for (const linha of chao.mapa) console.log('   ' + linha);
console.log('prompt do armário:', promptArmario);
console.log('painel abriu:', painel === 1, '· partes do corpo:', partes,
  '· buraco do boneco:', JSON.stringify(boneco));
console.log('as peças foram pro ARMÁRIO:', inventario.armario.length,
  '· mochila intacta:', JSON.stringify(inventario.mao));
console.log('  vestindo:', JSON.stringify(inventario.vestindo));
console.log('peças guardadas no painel:', antes);
console.log('depois de vestir uma:', JSON.stringify(vestido));
console.log('no corpo:', JSON.stringify(noCorpo.ids),
  '· torso:', noCorpo.cores['tronco:principal'],
  '· manga:', noCorpo.cores['tronco:detalhe']);
console.log('depois de tirar · no armário:', depoisDeTirar.armario, '· na mochila:', depoisDeTirar.mao,
  '· vestindo:', depoisDeTirar.vestindo);
console.log('o parceiro também recebeu · peças no armário dele:', doParceiroAntes.armario);
console.log('depois do T · painel segue aberto:', depoisDoT.aindaAberto,
  '· dono:', depoisDoT.dono, '· peças:', depoisDoT.pecas);
console.log('os dois vestidos · ari:', JSON.stringify(osDois.ari));
console.log('                   renan:', JSON.stringify(osDois.renan));
console.log('Esc fechou o painel:', fechou);
console.log('estante:', JSON.stringify(estante));
console.log('prompt da estante:', promptEstante);
console.log('conversa:', conversaDaEstante);
console.log('memória dos dois livros:', noDiario, '· diálogo fechou:', dialogoFechou);
console.log('prompt de volta:', promptVolta);
console.log('voltou para:', voltou, 'em', JSON.stringify(ondeVoltou));
console.log('roupa sobreviveu à troca de cena:', JSON.stringify(depoisDaCena));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  /quarto do Ari/i.test(promptDaSala ?? '') &&
  dentro === 'quarto' &&
  // o spawn não pode cair dentro de móvel
  Math.abs(spawn[0] - 0.9) < 0.6 && Math.abs(spawn[1] - 1.7) < 0.8 &&
  chao.spawnLivre &&
  chao.livre > 150 &&
  // nada de chão ilhado: quase todo espaço livre alcançável a pé do spawn
  chao.alcancavel > chao.livre * 0.9 &&
  /armário/i.test(promptArmario ?? '') &&
  // o painel, com o boneco e as 4 partes do corpo
  painel === 1 && partes === 4 &&
  boneco !== null && boneco.w > 80 && boneco.h > 150 && boneco.buffer > 0 &&
  // As peças entram no GUARDA-ROUPA, e nenhuma encosta nas vagas de mão: era
  // exatamente isso que entupia o inventário de vestido. O armário ENTREGA em
  // vez de vestir, então o corpo começa vazio e há o que escolher no painel.
  NO_ARMARIO >= 4 &&
  inventario.mao.every((id) => id === null) &&
  inventario.vestindo.filter(Boolean).length === 0 &&
  antes === NO_ARMARIO &&
  // vestir pelo painel põe na vaga certa, e o corpo obedece
  vestido[1] === 'camisa-listrada' &&
  noCorpo.cores['tronco:principal'] === '#4a7fe0' &&
  // tirar DEVOLVE para o armário, não joga fora nem ocupa vaga de mão
  depoisDeTirar.armario === NO_ARMARIO &&
  depoisDeTirar.mao === 0 &&
  depoisDeTirar.vestindo === 0 &&
  // o armário abastece OS DOIS: o parceiro tem as peças sem nunca ter aberto
  doParceiroAntes.armario === NO_ARMARIO &&
  // o T troca o dono do painel sem fechá-lo
  depoisDoT.aindaAberto && depoisDoT.pecas === NO_ARMARIO &&
  /Renan/.test(depoisDoT.dono ?? '') &&
  depoisDoT.controlando === 'renan' &&
  // e os DOIS ficam vestidos ao mesmo tempo, cada um com a sua peça
  osDois.renan[2] === 'calca-jeans' &&
  osDois.ari[0] === 'gorro-la' &&
  fechou &&
  // a estante é oca e nenhum livro encosta na carcaça (era o z-fighting)
  estante !== null &&
  estante.temVao &&
  estante.quantos >= 6 &&
  estante.folgaNaFrente > 0.02 &&
  estante.folgaNoFundo > 0.02 &&
  // e a conversa cita os dois favoritos, cada um pelo nome inteiro
  /estante/i.test(promptEstante ?? '') &&
  /Aristóteles e Dante Descobrem os Segredos do Universo/.test(conversaDaEstante) &&
  /A Toca das Raposas/.test(conversaDaEstante) &&
  noDiario &&
  dialogoFechou &&
  /sala/i.test(promptVolta ?? '') &&
  voltou === 'casa' &&
  Math.abs(ondeVoltou[0] + 5.05) < 1.0 && Math.abs(ondeVoltou[1] + 1.2) < 1.0 &&
  depoisDaCena.filter(Boolean).length >= 2;

await browser.close();
process.exit(ok ? 0 : 1);
