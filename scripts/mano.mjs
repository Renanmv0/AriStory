/**
 * O MANO, o pinguim sorveteiro do quiosque do Villa Lobos.
 *
 * O que este teste guarda:
 *
 * - ele ESTÁ no posto, na frente do balcão, e NÃO SAI: a área que a cena passa
 *   é menor que o passo mínimo do cérebro, e é só isso que o segura ali. Se
 *   alguém alargar essa área, ele começa a passear pelo parque e o teste avisa;
 * - ele APARECE INTEIRO do lugar de onde se compra. É a asserção que existe
 *   por causa de uma palmeira que caía a 4,13 do quiosque — escapando por treze
 *   centímetros do círculo proibido — e escondia o Mano por completo. O teste
 *   mede geometria (nada alto e à frente dele), e não a foto: o parque é vivo,
 *   e duas capturas do mesmo quadro já saem diferentes;
 * - o CARINHO ganha do "Comprar sorvete" quando se chega colado nele, e só aí:
 *   os dois pontos se sobrepõem, e sem o desempate o pinguim vira cenário;
 * - a CUTSCENE DA COMPRA acontece inteira: a fala dele, a DANÇA de verdade (o
 *   corpo tem que ter mexido no eixo Z enquanto ela roda) e as duas casquinhas
 *   na mochila de cada dono;
 * - e o controle VOLTA no fim. Cutscene que trava o jogador e esquece de
 *   soltar é o pior defeito possível — o `finally` da cena existe por isso, e
 *   esta é a asserção que prova que ele funciona.
 *
 * Uso: node scripts/mano.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './mano';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o `MANO` da cena */
const POSTO = { x: 12.9, z: 20.3 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const irPara = (x, z, facing = Math.PI) =>
  page.evaluate(([px, pz, f]) => window.jogo.debugPlace(px, pz, f), [x, z, facing]);

const venceAFala = async (voltas = 30) => {
  const ditas = [];
  for (let i = 0; i < voltas; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 12) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(520);
  }
  return ditas;
};

const oMano = () => page.evaluate(() => {
  let m = null;
  window.jogo.scene.traverse((o) => {
    if (!m && o.userData?.peca === 'mano') m = o;
  });
  if (!m) return null;
  // o corpo é o primeiro grupo filho: é ele que tomba na dança
  const corpo = m.children.find((c) => c.isGroup);
  return {
    onde: [+m.position.x.toFixed(2), +m.position.z.toFixed(2)],
    giro: +m.rotation.y.toFixed(2),
    tombo: +(corpo?.rotation.z ?? 0).toFixed(4),
    temChapeu: !!m.getObjectByName('chapeu-do-mano'),
    temCabeca: !!m.getObjectByName('cabeca-do-mano'),
  };
});

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(500, 440);
await page.waitForTimeout(600);

// ================================================ 1. ele existe, e está no posto
const nasceu = await oMano();

/**
 * NADA ALTO E À FRENTE DELE.
 *
 * "À frente" é `+X/+Z`, que é de onde a câmera olha. Uma peça de altura `h`
 * esconde `h / tan(34°) ≈ 1,5·h` atrás dela, então o que importa é a altura da
 * peça MENOS a do Mano (1,0): qualquer coisa com mais de um metro, na diagonal
 * da câmera e perto o bastante, come ele.
 */
const tapando = await page.evaluate(([mx, mz]) => {
  const acha = [];
  for (const o of window.jogo.current.world.root.children) {
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements;
    const x = e[12];
    const z = e[14];
    // o quanto ele está À FRENTE do Mano, na diagonal da câmera
    const frente = ((x - mx) + (z - mz)) * 0.707;
    if (frente < 0.4 || frente > 8) continue;
    /**
     * E o quanto ele desvia dessa diagonal. O limite é FIXO (2,5, que é o raio
     * de uma copa larga), e não proporcional à altura: quem esconde de lado é a
     * LARGURA da peça, não a altura dela. Com o limite crescendo junto com o
     * `alto`, a roda gigante — 70 m de altura a dezessete metros de distância
     * lateral — entrava na conta e acusava um bloqueio que não existe.
     */
    const lado = Math.abs((x - mx) - (z - mz)) * 0.707;
    // a altura da peça: o `y` da malha mais alta dela, pelo matrixWorld
    let alto = 0;
    o.traverse((n) => {
      if (!n.isMesh) return;
      n.updateWorldMatrix(true, false);
      alto = Math.max(alto, n.matrixWorld.elements[13]);
    });
    // ela só esconde o Mano se passar de um metro e couber no cone
    if (alto > 1.0 && lado < 2.5 && frente < (alto - 1.0) * 1.5) {
      acha.push({ peca: o.userData?.peca ?? o.type, x: +x.toFixed(1), z: +z.toFixed(1), alto: +alto.toFixed(1) });
    }
  }
  return acha;
}, [POSTO.x, POSTO.z]);

// ================================================ 2. o carinho ganha da compra
await irPara(POSTO.x + 0.3, POSTO.z + 0.5);
await page.waitForTimeout(900);
const deColado = await prompt();
await page.screenshot({ path: `${OUT}-posto.png` });

await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const apresentacao = await venceAFala();
await page.waitForTimeout(900);

/**
 * ESPERAR A DANCINHA DA APRESENTAÇÃO ACABAR ANTES DE COMPRAR.
 *
 * Ele dança 1,8 s ao se apresentar, e sem esta espera aquele rebolado ainda
 * estava rolando quando a compra começava — o teste media a dança ERRADA e
 * passaria com a dança da compra desligada. O `tombo` zerado aqui é o que faz
 * o pico medido lá embaixo valer alguma coisa.
 */
let tomboAntesDaCompra = 1;
for (let i = 0; i < 25; i++) {
  const m = await oMano();
  tomboAntesDaCompra = Math.abs(m?.tombo ?? 0);
  if (tomboAntesDaCompra < 0.01) break;
  await page.waitForTimeout(600);
}

/**
 * E DA ÂNCORA DE COMPRAR o prompt tem que ser o de comprar.
 *
 * Este é o ponto exato para onde a pessoa anda quando quer sorvete (`12; 20,6`
 * é o centro da interação). Se o carinho ganhar AQUI, a ação principal do
 * quiosque virou a difícil de achar — foi o que aconteceu com o raio de 1,05.
 */
await irPara(12, 20.6);
await page.waitForTimeout(900);
const deLonge = await prompt();

// ================================================ 3. a cutscene da compra
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);

/**
 * O TOMBO É AMOSTRADO ENQUANTO A CENA RODA, e não depois: a dança dura 2,5 s de
 * tempo de jogo e termina sozinha. Medir no fim pegaria o Mano já em pé, e o
 * teste passaria com a dança desligada.
 */
const falas = [];
let maiorTombo = 0;
let fotografou = false;
for (let i = 0; i < 40; i++) {
  const m = await oMano();
  if (m) maiorTombo = Math.max(maiorTombo, Math.abs(m.tombo));
  // a foto sai NO PICO do rebolado, e não no fim da cena: no fim ele já está
  // em pé de novo, e a única prova visual da dança seria uma pose parada
  if (!fotografou && m && Math.abs(m.tombo) > 0.22) {
    fotografou = true;
    await page.screenshot({ path: `${OUT}-danca.png` });
  }
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 12 && !falas.includes(t)) falas.push(t);
  if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
  else if (i > 12) break;   // sem diálogo e já passou da dança: a cena acabou
  await page.waitForTimeout(420);
}
if (!fotografou) await page.screenshot({ path: `${OUT}-danca.png` });
await venceAFala();
await page.waitForTimeout(1400);

const depois = await page.evaluate(() => ({
  morangoDoAri: window.jogo.hasItem('sorvete-morango', 'ari'),
  maracujaDoRenan: window.jogo.hasItem('sorvete-maracuja', 'renan'),
  memoria: (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'sorvete-villa'),
}));

/**
 * O CONTROLE VOLTOU? A prova é andar: se `lockPlayer(true)` tiver ficado de pé,
 * a tecla não move ninguém. Nada de perguntar a uma flag interna — o que
 * interessa é se o jogador consegue sair do lugar.
 */
const antesDeAndar = await page.evaluate(() => {
  const p = window.jogo.playerPosition();
  return [+p.x.toFixed(2), +p.z.toFixed(2)];
});
await page.keyboard.down('KeyW');
await page.waitForTimeout(1400);
await page.keyboard.up('KeyW');
const depoisDeAndar = await page.evaluate(() => {
  const p = window.jogo.playerPosition();
  return [+p.x.toFixed(2), +p.z.toFixed(2)];
});
const andou = Math.hypot(depoisDeAndar[0] - antesDeAndar[0], depoisDeAndar[1] - antesDeAndar[1]);

// ================================================ 4. ele não sai do posto
const trilha = [];
for (let i = 0; i < 12; i++) {
  const m = await oMano();
  if (m) trilha.push(m.onde);
  await page.waitForTimeout(700);
}
const longeDoPosto = trilha.filter(
  ([x, z]) => Math.hypot(x - POSTO.x, z - POSTO.z) > 0.5,
);

// ======================================================================= laudo
const falhas = [];
if (!nasceu) falhas.push('o Mano nao esta na cena');
else {
  if (Math.hypot(nasceu.onde[0] - POSTO.x, nasceu.onde[1] - POSTO.z) > 0.3) {
    falhas.push(`ele nao nasceu no posto: ${JSON.stringify(nasceu.onde)}`);
  }
  if (!nasceu.temChapeu) falhas.push('o chapeu de casquinha sumiu');
  if (!nasceu.temCabeca) falhas.push('a cabeca dele sumiu');
}
if (tapando.length) {
  falhas.push(`tem coisa alta na frente do Mano, escondendo ele: ${JSON.stringify(tapando[0])}`);
}
if (!/carinho/i.test(deColado)) falhas.push(`colado nele o prompt nao e o carinho: "${deColado}"`);
if (!/comprar/i.test(deLonge)) falhas.push(`de longe o prompt nao voltou a ser comprar: "${deLonge}"`);
if (!apresentacao.some((f) => /pinguim/i.test(f))) {
  falhas.push('a apresentacao do Mano nao aconteceu');
}
if (!falas.some((f) => /geladinho/i.test(f))) falhas.push('o Mano nao falou na compra');
if (tomboAntesDaCompra > 0.01) {
  falhas.push(`ele ainda estava dancando a apresentacao quando a compra comecou (${tomboAntesDaCompra}) — o pico medido nao prova nada`);
}
if (maiorTombo < 0.05) falhas.push(`o Mano nao dancou na compra (maior tombo ${maiorTombo})`);
if (!depois.morangoDoAri) falhas.push('o morango nao entrou na mochila do Ari');
if (!depois.maracujaDoRenan) falhas.push('o maracuja nao entrou na mochila do Renan');
if (!depois.memoria) falhas.push('a memoria do sorvete nao entrou no diario');
if (andou < 0.4) falhas.push(`o jogador ficou travado depois da cutscene (andou ${andou.toFixed(2)})`);
if (longeDoPosto.length) falhas.push(`ele saiu do posto: ${JSON.stringify(longeDoPosto[0])}`);
falhas.push(...erros);

console.log('1. no posto:', JSON.stringify(nasceu), '· tapando:', JSON.stringify(tapando));
console.log('2. prompt colado:', JSON.stringify(deColado), '· de longe:', JSON.stringify(deLonge));
console.log('   apresentacao:', JSON.stringify(apresentacao.slice(0, 4)));
console.log('3. falas da compra:', JSON.stringify(falas.filter((f) => f.length > 14)));
console.log('   tombo antes da compra:', tomboAntesDaCompra.toFixed(3), '(tem que ser ~0)',
  '· maior tombo NA compra:', maiorTombo.toFixed(3), '(tem que ser > 0,05)');
console.log('   ', JSON.stringify(depois), '· andou depois:', andou.toFixed(2));
console.log('4. pontos da trilha fora do posto:', longeDoPosto.length, 'de', trilha.length);

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
