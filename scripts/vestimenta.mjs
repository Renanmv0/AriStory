/**
 * As regras de quem pode morar onde, depois da refatoração do guarda-roupa.
 *
 * São três lugares, e não dois, e a confusão entre eles era a origem dos bugs
 * de peça duplicada e de mochila entupida de vestido:
 *
 *   mochila (10 vagas)  item de mão + vestimenta FUNCIONAL (patins)
 *   corpo (4 vagas)     o que está vestido, uma vaga por parte
 *   guarda-roupa        roupa cosmética que não está no corpo
 *
 * O que este teste guarda:
 * - roupa cosmética NUNCA entra numa vaga de mão, por nenhum caminho:
 *   `storeItem`, `addItem` com a vaga do corpo ocupada, ou arrastar;
 * - vestida, a roupa cosmética só sai por DESCARTE — arrastar para a mochila é
 *   recusado, e a tela diz por quê;
 * - os patins são a exceção: viajam na mochila e se calçam em qualquer lugar;
 * - item de mão continua sem poder ser vestido;
 * - o painel do armário separa as peças por parte do corpo.
 *
 * Uso: node scripts/vestimenta.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './vestimenta';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 760 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// o quarto do Ari é onde o armário mora
await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

/** o inventário inteiro de alguém, nos três lugares */
const inventario = (quem = 'ari') =>
  page.evaluate((q) => {
    const j = window.jogo;
    return {
      mao: j.handItems(q).map((i) => i?.id ?? null),
      corpo: j.wearables(q).map((i) => i?.id ?? null),
      armario: j.wardrobeItems(q).map((i) => i.id),
    };
  }, quem);

// ------------------------------------------------ 1. a roupa vai pro armário
// O armário abastece pelo `storeItem`, o mesmo caminho da cena. A peça tem que
// cair no guarda-roupa, e NENHUMA vaga de mão pode ser tocada.
const estocou = await page.evaluate(() => {
  const j = window.jogo;
  const I = window.aristoryItens;
  const como = [
    j.storeItem(I['vestido-rosa'], 'ari'),
    j.storeItem(I['calca-jeans'], 'ari'),
    j.storeItem(I['gorro-la'], 'ari'),
    j.storeItem(I['bota-amarela'], 'ari'),
  ];
  return { como };
});
const depoisDoEstoque = await inventario();

// ------------------------------------------- 2. vestir e tentar tirar na mão
const vestiuETentou = await page.evaluate(() => {
  const j = window.jogo;
  const vestido = j.wardrobeItems('ari').find((i) => i.id === 'vestido-rosa');
  const vestiu = j.equipWearable(vestido, 'ari');
  // TRONCO é a vaga 1; tenta arrastar de lá para uma vaga de mão vazia
  const vagaLivre = j.handItems('ari').findIndex((x) => x === null);
  const arrastou = j.moveItem({ lista: 'vestivel', indice: 1 }, { lista: 'mao', indice: vagaLivre }, 'ari');
  return { vestiu, arrastou, vagaLivre };
});
const depoisDeVestir = await inventario();

// ------------------------------------------------- 3. os patins são exceção
const funcional = await page.evaluate(() => {
  const j = window.jogo;
  const I = window.aristoryItens;
  // guardar patins põe na MOCHILA, não no armário
  const guardou = j.storeItem(I['patins'], 'ari');
  const naMao = j.handItems('ari').findIndex((x) => x?.id === 'patins');
  // e da mochila eles vão direto para os pés, sem passar pelo armário
  const calcou = j.moveItem({ lista: 'mao', indice: naMao }, { lista: 'vestivel', indice: 3 }, 'ari');
  // e voltam
  const vagaLivre = j.handItems('ari').findIndex((x) => x === null);
  const tirou = j.moveItem({ lista: 'vestivel', indice: 3 }, { lista: 'mao', indice: vagaLivre }, 'ari');
  return { guardou, naMao, calcou, tirou, armario: j.wardrobeItems('ari').map((i) => i.id) };
});

// ------------------------------------------ 4. item de mão não se veste
const itemDeMao = await page.evaluate(() => {
  const j = window.jogo;
  const sorvete = { id: 'sorvete-teste', nome: 'Sorvete', icone: '🍦', tipo: 'mao' };
  j.addItem(sorvete, 'ari');
  const onde = j.handItems('ari').findIndex((x) => x?.id === 'sorvete-teste');
  return {
    arrastou: j.moveItem({ lista: 'mao', indice: onde }, { lista: 'vestivel', indice: 1 }, 'ari'),
    vestiuDireto: j.equipWearable(sorvete, 'ari'),
    foiProArmario: j.wardrobeItems('ari').some((i) => i.id === 'sorvete-teste'),
  };
});

// ------------------------------- 5. na mochila, roupa vestida só se descarta
await page.keyboard.press('KeyI');
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}-mochila.png` });

const presos = await page.evaluate(() => {
  const vagas = [...document.querySelectorAll('.mochila .vestiveis .slot')];
  return vagas.map((v) => ({
    cheio: v.classList.contains('cheio'),
    preso: v.classList.contains('preso'),
    arrastavel: v.draggable,
  }));
});

// toca a vaga do tronco (o vestido) e tenta soltar numa vaga de mão
await page.locator('.mochila .vestiveis .slot').nth(1).click();
await page.waitForTimeout(300);
const comDescarte = await page.locator('.mochila .descartar').textContent();
await page.locator('.mochila .maos .slot').nth(9).click();
await page.waitForTimeout(500);
const recusa = (await page.locator('.toast').last().textContent().catch(() => null)) ?? '';
const depoisDaRecusa = await inventario();

// agora descarta de verdade
await page.locator('.mochila .descartar').click();
await page.waitForTimeout(300);
await page.locator('.mochila .descartar-sim').click();
await page.waitForTimeout(600);
const depoisDoDescarte = await inventario();
await page.screenshot({ path: `${OUT}-descarte.png` });
await page.keyboard.press('KeyI');
await page.waitForTimeout(500);

// ------------------------------------- 6. o armário separa por parte do corpo
await page.evaluate(() => window.jogo.abrirGuardaRoupa());
await page.waitForTimeout(900);
const grupos = await page.evaluate(() => {
  const secoes = [...document.querySelectorAll('.armario .acervo .grupo')];
  return secoes.map((s) => ({
    slot: s.dataset.slot,
    titulo: s.querySelector('h4')?.firstChild?.textContent?.trim() ?? '',
    quantas: s.querySelectorAll('.peca').length,
    // cada peça listada aqui tem que ser DAQUELA parte, senão a divisão mente
    ids: [...s.querySelectorAll('.peca')].map((p) => p.dataset.id),
  }));
});
const conferePorSlot = await page.evaluate((gs) => {
  const j = window.jogo;
  const todas = [...j.wardrobeItems('ari'), ...j.handItems('ari').filter((i) => i && i.tipo === 'vestivel')];
  return gs.every((g) => g.ids.every((id) => todas.find((i) => i.id === id)?.slot === g.slot));
}, grupos);
await page.screenshot({ path: `${OUT}-armario.png` });

// ------------------------------------------------------------------ relatório
console.log('1. estocar roupa · devolveu:', JSON.stringify(estocou.como));
console.log('   mão:', JSON.stringify(depoisDoEstoque.mao));
console.log('   armário:', JSON.stringify(depoisDoEstoque.armario));
console.log('2. vestiu o vestido:', vestiuETentou.vestiu, '· arrastar pra mão:', vestiuETentou.arrastou, '(tem que ser false)');
console.log('   corpo:', JSON.stringify(depoisDeVestir.corpo));
console.log('3. patins · guardou como:', funcional.guardou, '· na vaga', funcional.naMao,
  '· calçou:', funcional.calcou, '· tirou pra mão:', funcional.tirou);
console.log('   armário sem patins:', !funcional.armario.includes('patins'));
console.log('4. sorvete · arrastar pra vestimenta:', itemDeMao.arrastou, '· vestir direto:', itemDeMao.vestiuDireto,
  '· foi pro armário:', itemDeMao.foiProArmario);
console.log('5. vagas de vestimenta:', JSON.stringify(presos));
console.log('   botão:', JSON.stringify(comDescarte), '· recusa:', JSON.stringify(recusa.trim()));
console.log('   corpo depois da recusa:', JSON.stringify(depoisDaRecusa.corpo));
console.log('   corpo depois do descarte:', JSON.stringify(depoisDoDescarte.corpo),
  '· mão:', JSON.stringify(depoisDoDescarte.mao));
console.log('6. divisões do armário:', JSON.stringify(grupos.map((g) => [g.titulo, g.quantas])));
console.log('   cada peça na sua divisão:', conferePorSlot);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');

// 1. roupa cosmética não encosta nas vagas de mão
if (depoisDoEstoque.mao.some((id) => id !== null)) problemas.push('roupa entrou numa vaga de mão');
if (depoisDoEstoque.armario.length !== 4) problemas.push('as 4 peças não foram para o armário');

// 2. vestida, a roupa não sai para a mochila
if (!vestiuETentou.vestiu) problemas.push('não deu para vestir o vestido');
if (vestiuETentou.arrastou) problemas.push('deu para arrastar roupa vestida para a mochila');
if (depoisDeVestir.corpo[1] !== 'vestido-rosa') problemas.push('o vestido não ficou no tronco');

// 3. a exceção funcional
if (funcional.guardou === 'cheio') problemas.push('os patins não couberam na mochila');
if (funcional.naMao < 0) problemas.push('os patins não foram para a mochila');
if (funcional.armario.includes('patins')) problemas.push('os patins foram parar no armário');
if (!funcional.calcou) problemas.push('não deu para calçar os patins direto da mochila');
if (!funcional.tirou) problemas.push('não deu para tirar os patins de volta para a mochila');

// 4. item de mão continua sem poder ser vestido
if (itemDeMao.arrastou || itemDeMao.vestiuDireto) problemas.push('deu para vestir um item de mão');
if (itemDeMao.foiProArmario) problemas.push('item de mão foi parar no armário');

// 5. a tela: cadeado, recusa com voz, e o descarte funcionando
const tronco = presos[1];
if (!tronco?.cheio || !tronco.preso || tronco.arrastavel) {
  problemas.push('a vaga do tronco não está marcada como presa');
}
if (!/guarda-roupa/i.test(recusa)) problemas.push('a recusa não avisou que roupa só troca no armário');
if (depoisDaRecusa.corpo[1] !== 'vestido-rosa') problemas.push('o vestido saiu do corpo mesmo com a recusa');
if (!/Descartar/.test(comDescarte ?? '')) problemas.push('o botão de descarte não apareceu');
if (depoisDoDescarte.corpo[1] !== null) problemas.push('o descarte não tirou o vestido do corpo');
if (depoisDoDescarte.mao.includes('vestido-rosa')) problemas.push('o descarte jogou o vestido na mochila');

// 6. as divisões
if (grupos.length < 2) problemas.push('o armário não dividiu as peças por parte');
if (!conferePorSlot) problemas.push('alguma peça caiu na divisão da parte errada');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
