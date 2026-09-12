/**
 * O vestiário do clube — a moda praia dos dois.
 *
 * O que este teste guarda, na ordem em que importa:
 *
 * 1. A COR DO CALÇÃO sai da peça das PERNAS. Escolher vermelha pinta o calção
 *    de vermelho e a estampada acende as duas faixas — e as pernas continuam
 *    sendo PELE, que é o que prova que a bermuda não virou uma calça dentro
 *    d'água.
 * 2. FORA DO BANHO ela some. A bermuda não declara `cor`, então no traje
 *    normal a perna volta para a calça da ficha. É o cenário que quebraria se
 *    a moda praia tivesse virado um segundo sistema de roupa.
 * 3. O ÓCULOS nasce dentro da CABEÇA, e sobrevive à água — como o gorro já
 *    sobrevive, e ao contrário da bota.
 * 4. ESTILOS INDEPENDENTES: o T troca de pessoa e cada uma guarda o seu
 *    traje, porque as vagas são as do inventário de cada uma.
 * 5. PERSISTÊNCIA: recarregar a página não perde a escolha.
 * 6. O painel TRAVA o movimento, e o Escape solta.
 *
 * Uso: node scripts/vestiario.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './vestiario';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const AZUL = '#2f7fd0';
const VERMELHA = '#d8453f';
const ESTAMPA = '#2fb5a8';
const FAIXA = '#fdf0d5';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 680 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const abrirCena = async () => {
  // o vestiário foi para o fundo do deck (15, -18); a dupla nasce na frente dele
  await page.goto(`${BASE}/?cena=clube&em=15,-14&olhar=3.14`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
};

await abrirCena();
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

/**
 * O traje de praia lido do CORPO, e não do save.
 *
 * A cor do calção sai do material da malha, a das pernas sai da lista
 * `trocaMaterial` (privada em TS, viva em runtime) e o óculos é procurado pela
 * etiqueta `userData.roupa` — junto com o nome do avô dele, que é o que prova
 * que a peça nasceu na cabeça e não no pescoço.
 */
const traje = (quem) =>
  page.evaluate((q) => {
    const j = window.jogo;
    const rig = j.player.rig.spec.id === q ? j.player.rig : j.parceiro.rig;
    const hex = (m) => '#' + m.color.getHexString();
    const perna = rig.trocaMaterial.find((t) => t.slot === 'pernas' && t.parte === 'principal');
    let oculos = null;
    rig.group.traverse((o) => {
      if (o.userData?.roupa !== 'oculos-escuros') return;
      oculos = { visivel: o.visible, pai: o.parent === rig.head ? 'cabeca' : 'outro' };
    });
    return {
      calcao: hex(rig.calcao.material),
      calcaoVisivel: rig.calcao.visible,
      // as faixas da estampa: quantas ligadas, e de que cor
      faixas: rig.estampa.filter((f) => f.visible).map((f) => hex(f.material)),
      perna: hex(perna.mesh.material),
      pele: hex(perna.banho),
      calcaDaFicha: hex(perna.normal),
      // a sombra fofa do chão: `submergePlayer` corta ela ao entrar na água
      sombra: rig.blob.visible,
      oculos,
    };
  }, quem);

const quemAnda = () => page.evaluate(() => window.jogo.player.rig.spec.id);
const travado = () => page.evaluate(() => window.jogo.input.blocked);

// ---------------------------------------------------------------- abrir
const prompt = await page.locator('.prompt.show').textContent().catch(() => null);
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
const falas = [];
for (let i = 0; i < 8; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  falas.push(
    (await page.locator('.dialogue .who').textContent()) + ': ' +
    (await page.locator('.dialogue .text').textContent()),
  );
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(600);
}
await page.waitForTimeout(700);

const abriu = await page.locator('.vestiario.show').count();
const travadoAberto = await travado();
const cores = await page.locator('.vestiario .bermuda').count();
await page.screenshot({ path: `${OUT}-painel.png` });

// ------------------------------------------------------- vestir o primeiro
const dono1 = await quemAnda();
await page.locator('.vestiario .oculos').click();
await page.waitForTimeout(400);
await page.locator('.vestiario .bermuda[data-id="bermuda-vermelha"]').click();
await page.waitForTimeout(700);
const vermelha = await traje(dono1);
await page.screenshot({ path: `${OUT}-vermelha.png` });

await page.locator('.vestiario .bermuda[data-id="bermuda-estampada"]').click();
await page.waitForTimeout(700);
const estampada = await traje(dono1);
await page.screenshot({ path: `${OUT}-estampada.png` });

// -------------------------------------------------- o outro, com o painel aberto
await page.keyboard.press('KeyT');
await page.waitForTimeout(900);
const dono2 = await quemAnda();
const antesDoOutro = await traje(dono2);
await page.locator('.vestiario .bermuda[data-id="bermuda-azul"]').click();
await page.waitForTimeout(700);
const azul = await traje(dono2);
// e o primeiro não pode ter mudado de traje junto
const primeiroDepois = await traje(dono1);
await page.screenshot({ path: `${OUT}-os-dois.png` });

// ------------------------------------------------------------- fechar
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
const fechou = !(await page.locator('.vestiario.show').count());
const soltou = !(await travado());

// ---------------------------------------- fora d'água a bermuda não aparece
await page.evaluate(() => window.jogo.setOutfit('normal'));
await page.waitForTimeout(500);
const naRua = await traje(dono1);
await page.screenshot({ path: `${OUT}-de-roupa.png` });
await page.evaluate(() => window.jogo.setOutfit('banho'));
await page.waitForTimeout(400);

// ------------------------------------------------- dentro d'água, de óculos
// volta para quem está de óculos, e entra na piscina DE VERDADE: quem chama
// `submergePlayer` aqui é a própria cena, todo quadro, pela posição — uma
// chamada de fora seria apagada no quadro seguinte.
await page.keyboard.press('KeyT');
await page.waitForTimeout(900);
await page.evaluate(() => window.jogo.debugPlace(0, -3, 0));
await page.waitForTimeout(1800);
const naAgua = await traje(dono1);
await page.screenshot({ path: `${OUT}-na-agua.png` });

// ------------------------------------------------------------ persistência
await abrirCena();
const depoisDoReload = await traje(dono1);
const outroDepoisDoReload = await traje(dono2);

console.log('prompt:', (prompt ?? '').replace(/\s+/g, ' ').trim());
console.log('conversa:\n  ' + falas.join('\n  '));
console.log(`painel: ${abriu ? 'abriu' : 'NÃO abriu'} · ${cores} cores · movimento ${travadoAberto ? 'travado' : 'SOLTO'}`);
console.log(`${dono1} de vermelha:`, JSON.stringify(vermelha));
console.log(`${dono1} de estampada:`, JSON.stringify(estampada));
console.log(`${dono2} antes:`, JSON.stringify(antesDoOutro.calcao), '· depois:', JSON.stringify(azul.calcao));
console.log(`${dono1} continua:`, primeiroDepois.calcao, '· óculos', JSON.stringify(primeiroDepois.oculos));
console.log('de roupa na rua:', JSON.stringify(naRua));
console.log('na água:', JSON.stringify(naAgua.oculos), '· calção', naAgua.calcao, '· sombra', naAgua.sombra);
console.log(`depois do reload: ${dono1} ${depoisDoReload.calcao} / ${dono2} ${outroDepoisDoReload.calcao}`);
console.log('fechou no Escape:', fechou, '· movimento solto:', soltou);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  abriu === 1 && travadoAberto && cores === 4 &&
  // 1. a cor sai da peça das pernas, e a perna continua pele
  vermelha.calcao === VERMELHA && vermelha.calcaoVisivel &&
  vermelha.perna === vermelha.pele &&
  vermelha.faixas.length === 0 &&
  // a estampada acende as duas faixas
  estampada.calcao === ESTAMPA &&
  estampada.faixas.length === 2 && estampada.faixas.every((c) => c === FAIXA) &&
  // 3. o óculos nasce na cabeça e está visível
  vermelha.oculos?.visivel === true && vermelha.oculos.pai === 'cabeca' &&
  // 4. estilos independentes: o outro começa sem bermuda e o primeiro não muda
  antesDoOutro.calcao !== AZUL && azul.calcao === AZUL &&
  primeiroDepois.calcao === ESTAMPA &&
  // 2. fora do banho a perna volta para a calça da ficha e o calção some
  naRua.perna === naRua.calcaDaFicha && !naRua.calcaoVisivel &&
  // 3. o óculos sobrevive à água, e a sombra do chão continua sendo cortada
  naAgua.oculos?.visivel === true && naAgua.calcao === ESTAMPA && naAgua.sombra === false &&
  vermelha.sombra === true &&
  // 5. persistência
  depoisDoReload.calcao === ESTAMPA && outroDepoisDoReload.calcao === AZUL &&
  // 6. o Escape solta o movimento
  fechou && soltou;

await browser.close();
process.exit(ok ? 0 : 1);
