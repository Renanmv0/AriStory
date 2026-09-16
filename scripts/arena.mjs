/**
 * A ARENA DE PING PONG do Villa Lobos: o tablado e o que mora em volta dele.
 *
 * O que este teste guarda:
 *
 * - **A MESA ESTÁ PARALELA À GRADE DE BAIXO E LONGE DO LAGO.** As duas coisas
 *   são medidas, e não olhadas: o giro do grupo da mesa tem que ser zero (a
 *   grade do portão corre ao longo do X em `z = 28`) e a distância até o
 *   centro d'água tem que passar dos 13 — eram 11 antes, e o pedido era
 *   justamente afastar.
 * - **A ARENA ESTÁ MONTADA.** Tablado, moldura, banco, placar, suporte de
 *   raquetes e balde: peça que some da cena é peça que ninguém vai achar.
 * - **DÁ PARA ANDAR NELA.** Cada lugar onde a dupla precisa ficar de pé para
 *   jogar (`MESA_PING.plano + 0,55` de cada lado) está fora de todo colisor,
 *   e o corredor da câmera de ombro também.
 * - **NENHUMA ÁRVORE NA CLAREIRA.** Foi o pedido que abriu esta rodada: da
 *   foto do Renan a mesa de piquenique estava enterrada numa moita. O teste
 *   conta copa dentro do raio da arena e em volta da mesa.
 * - **AS TRÊS INTERAÇÕES NOVAS RESPONDEM**, e a da mesa continua ganhando
 *   delas de perto — colado na mesa o prompt tem que ser "jogar".
 * - **A RAQUETE TROCA DE COR DE VERDADE** quando se escolhe outra no suporte.
 *
 * Uso: node scripts/arena.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './arena';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** onde a arena mora, copiado de `villaLobos.ts` — é o contrato do cenário */
const ARENA = { x: -14.5, z: 24.2, largura: 10.4, profundidade: 6 };
const MESA = { x: -14.5, z: 24.4 };
const LAGO = { x: -21, z: 11 };
/** `MESA_PING.plano + 0.55`: onde cada um fica de pé para jogar */
const LADO = 2.6 / 2 + 0.22 + 0.55;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 720 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-14.5,26.4&zoom=11`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// ============================================ 1. a mesa: giro e distância
const aMesa = await page.evaluate(() => {
  let achada = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.pingpong) achada = n;
  });
  if (!achada) return null;
  return { x: achada.position.x, z: achada.position.z, giro: achada.rotation.y };
});
const doLago = aMesa ? Math.hypot(aMesa.x - LAGO.x, aMesa.z - LAGO.z) : 0;

// ============================================ 2. o inventário de peças
const conta = await page.evaluate(() => {
  const soma = {};
  window.jogo.current.world.root.traverse((n) => {
    const nome = n.userData?.peca;
    if (nome) soma[nome] = (soma[nome] ?? 0) + 1;
  });
  return soma;
});

// ============================================ 3. os lugares de jogo livres
/**
 * Cada ponto é testado pelo COLISOR do mundo, e não por olho: é o mesmo
 * caminho que o jogador percorre andando, então um ponto que passa aqui é um
 * ponto onde a dupla consegue mesmo ficar de pé.
 */
const pontos = [
  ['saque -X', MESA.x - LADO, MESA.z],
  ['saque +X', MESA.x + LADO, MESA.z],
  ['câmera de ombro', MESA.x - LADO - 1.6, MESA.z],
  ['frente da mesa', MESA.x, MESA.z + 1.6],
  ['entrada +Z', ARENA.x, ARENA.z + ARENA.profundidade / 2 - 0.6],
  ['quina -X/+Z', ARENA.x - 3.6, ARENA.z + 2.2],
];
const presos = await page.evaluate((lista) => {
  const ruins = [];
  for (const [nome, x, z] of lista) {
    window.jogo.debugPlace(x, z, 0);
    const p = window.jogo.playerPosition();
    // colidiu = o motor empurrou a dupla para longe do ponto pedido
    if (Math.hypot(p.x - x, p.z - z) > 0.35) ruins.push([nome, +p.x.toFixed(2), +p.z.toFixed(2)]);
  }
  return ruins;
}, pontos);

// ============================================ 4. a clareira
/**
 * Conta pela ETIQUETA (`userData.peca === 'arvore'`), e não pela geometria: a
 * primeira versão procurava "cilindro mais esfera" e acusava o poste da arena
 * e a própria mesa de ping pong como se fossem mata.
 */
const arvores = await page.evaluate((a) => {
  const perto = [];
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.peca !== 'arvore') return;
    // a posição de mundo sai da matriz (elementos 12 e 14): o `three` não
    // está publicado no `window`, e um `Vector3` aqui dentro não existe
    n.updateWorldMatrix(true, false);
    const x = n.matrixWorld.elements[12];
    const z = n.matrixWorld.elements[14];
    const d = Math.hypot(x - a.x, z - a.z);
    if (d < 9) perto.push([+x.toFixed(1), +z.toFixed(1), +d.toFixed(1)]);
  });
  return perto;
}, ARENA);

await page.screenshot({ path: `${OUT}-arena.png` });

// ============================================ 5. as interações, uma a uma
/** leva a dupla até um ponto e devolve o prompt que aparece */
const promptEm = async (x, z) => {
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
  await page.waitForTimeout(700);
  return (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
};
/** aperta E e drena o diálogo, devolvendo as falas */
const conversar = async (voltas = 10) => {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
  const falas = [];
  for (let i = 0; i < voltas; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 4 && !falas.includes(t)) falas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
  }
  return falas;
};

const promptDaMesa = await promptEm(MESA.x, MESA.z + 1.5);
const promptDoPlacar = await promptEm(-17.6, 23.6);
const placarZerado = await conversar();
const promptDoCesto = await promptEm(-11.4, 26.9);
const noCesto = await conversar();
const promptDoSuporte = await promptEm(-10.6, 23.6);

// ---------------------------------- a raquete da mesa troca de cor de verdade
const corDaRaquete = () =>
  page.evaluate(() => {
    let mesa = null;
    window.jogo.current.world.root.traverse((n) => {
      if (n.userData?.pingpong) mesa = n;
    });
    /*
     * A raquete é achada pela POSIÇÃO LOCAL, e não pela ordem dos filhos. A
     * primeira versão pegava "a primeira filha com disco de 0,17" e dava a
     * resposta errada de propósito: trocar a raquete remove a velha e põe a
     * nova NO FIM da lista, então depois da troca quem passava a ser a
     * primeira era a OUTRA raquete da mesa, a azul, que ninguém tocou.
     */
    for (const filho of mesa.children) {
      if (!filho.isGroup || filho.visible === false) continue;
      if (Math.abs(filho.position.x - (-0.78)) > 0.01) continue;
      const disco = filho.children.find((c) => c.geometry?.type === 'CylinderGeometry'
        && c.geometry.parameters.radiusTop === 0.17);
      if (disco) return `#${disco.material.color.getHexString()}`;
    }
    return null;
  });
const corAntes = await corDaRaquete();
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
// drena a fala de abertura até a pergunta aparecer
for (let i = 0; i < 6 && !(await page.locator('.dialogue .escolhas.show button').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
const perguntou = (await page.locator('.dialogue .escolhas.show button').count()) > 0;
const opcoes = await page.locator('.dialogue .escolhas button').allTextContents().catch(() => []);
if (perguntou) await page.locator('.dialogue .escolhas button').nth(1).click(); // a verde
await page.waitForTimeout(1100);
for (let i = 0; i < 6 && (await page.locator('.dialogue.show').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
}
const corDepois = await corDaRaquete();
await page.screenshot({ path: `${OUT}-raquete.png` });

// ============================================ 6. veredito
const falhas = [];
if (!aMesa) falhas.push('a mesa de ping pong sumiu da cena');
else {
  if (Math.abs(aMesa.giro) > 0.01) {
    falhas.push(`a mesa nao esta paralela a grade (giro ${aMesa.giro.toFixed(2)})`);
  }
  if (doLago < 13) falhas.push(`a mesa continua perto do lago: ${doLago.toFixed(1)} (minimo 13)`);
}
const esperado = {
  'borda-de-tablado': 4,
  'placar-de-ping-pong': 1,
  'suporte-de-raquetes': 1,
  'cesto-de-bolinhas': 1,
};
for (const [nome, quantas] of Object.entries(esperado)) {
  if ((conta[nome] ?? 0) !== quantas) {
    falhas.push(`${nome}: ${conta[nome] ?? 0} na cena, esperado ${quantas}`);
  }
}
if (presos.length) falhas.push(`lugar de jogo dentro de colisor: ${JSON.stringify(presos)}`);
if (arvores.length) falhas.push(`arvore dentro da clareira da arena: ${JSON.stringify(arvores)}`);
if (!/ping pong/i.test(promptDaMesa)) {
  falhas.push(`colado na mesa o prompt nao e o da partida: "${promptDaMesa}"`);
}
if (!/placar/i.test(promptDoPlacar)) falhas.push(`o placar nao tem prompt: "${promptDoPlacar}"`);
if (placarZerado.length < 2) falhas.push(`o placar nao conversou: ${JSON.stringify(placarZerado)}`);
if (!/balde|bolinha/i.test(promptDoCesto)) falhas.push(`o balde nao tem prompt: "${promptDoCesto}"`);
if (noCesto.length < 2) falhas.push(`o balde nao conversou: ${JSON.stringify(noCesto)}`);
if (!/raquete/i.test(promptDoSuporte)) falhas.push(`o suporte nao tem prompt: "${promptDoSuporte}"`);
if (!perguntou) falhas.push('o suporte nao perguntou qual raquete');
if (corAntes === corDepois) {
  falhas.push(`a raquete da mesa nao trocou de cor (continua ${corAntes})`);
}
falhas.push(...erros);

console.log('1. mesa:', JSON.stringify(aMesa), '· do lago:', doLago.toFixed(1));
console.log('2. pecas:', JSON.stringify(
  Object.fromEntries(Object.entries(conta).filter(([k]) => k in esperado)),
));
console.log('3. lugares de jogo:', presos.length ? JSON.stringify(presos) : `os ${pontos.length} livres`);
console.log('4. clareira:', arvores.length ? JSON.stringify(arvores) : 'nenhuma arvore em 9 de raio');
console.log('5. prompts:', JSON.stringify([promptDaMesa, promptDoPlacar, promptDoCesto, promptDoSuporte]));
console.log('   placar zerado:', JSON.stringify(placarZerado));
console.log('   balde:', JSON.stringify(noCesto));
console.log('6. raquete:', JSON.stringify(opcoes), '·', corAntes, '→', corDepois);

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
