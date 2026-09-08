/**
 * A LOJINHA POR DENTRO — o salão, e a ronda da Estella.
 *
 * O que este teste guarda:
 *
 * - A PORTA LIGA OS DOIS LADOS. Da calçada dá para entrar, e de dentro dá para
 *   voltar — e o ponto onde a dupla nasce dos dois lados está LIVRE. Porta que
 *   cospe alguém dentro de um colisor é o pior bug de cena que existe: o jogador
 *   fica preso e não tem como saber por quê.
 * - A ESTELLA ANDA e NÃO ATRAVESSA NADA. São duas medidas diferentes, e as duas
 *   importam:
 *     1. cada parada da ronda está fora de todo colisor (o PONTO);
 *     2. cada trecho entre paradas vizinhas passa longe de todo colisor (o
 *        CAMINHO). Esta é a que pega o bug de verdade — `irPara()` anda em linha
 *        reta, então um destino livre não garante nada sobre o meio do caminho,
 *        e foi por isso que a ronda virou uma fila de vizinhos em vez de um
 *        sorteio entre seis pontos soltos.
 *   E, por cima das duas, o teste AMOSTRA a posição dela durante um minuto e
 *   confere que ela nunca esteve dentro de um móvel — a prova de que a conta
 *   acima corresponde ao que acontece de verdade.
 * - ELA FALA SOZINHA, em toast, com as frases do Renan.
 * - O SALÃO TEM O QUE FOI PEDIDO: araras com roupa pendurada, provadores,
 *   manequins, balcão. Medido por contagem de peça, e não por foto.
 *
 * Uso: node scripts/lojinha.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './lojinha';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o `RONDA` da cena */
const RONDA = [
  [4.0, -2.1], [0.6, -3.2], [-2.4, -3.2], [-5.4, -3.0],
  [-5.4, 1.6], [-2.4, 1.9], [-0.4, 3.4], [2.6, 3.6],
];
/** a porta da loja, na calçada do parque */
const PORTA_DE_FORA = { x: -34.9, z: -16.5 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 820 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// ======================================== 1. entrar pela porta, vindo da calçada
await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(500, 420);
await page.waitForTimeout(500);

await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.6, z, Math.PI / 2), [PORTA_DE_FORA.x, PORTA_DE_FORA.z]);
await page.waitForTimeout(1200);
const promptDaPorta = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const entrou = await page.evaluate(() => window.jogo.current?.def?.id ?? window.jogo.current?.id ?? null);

// ================================================= 2. o salão tem o que foi pedido
const salao = await page.evaluate(() => {
  const conta = {};
  let roupas = 0;
  window.jogo.current.world.root.traverse((o) => {
    const p = o.userData?.peca;
    if (p) conta[p] = (conta[p] ?? 0) + 1;
  });
  // as peças de roupa penduradas: cada cabide é um grupo com uma peça dentro
  window.jogo.current.world.root.traverse((o) => {
    if (o.userData?.peca === 'arara-de-roupas') {
      roupas += o.children.filter((c) => c.isGroup).length;
    }
  });
  return { conta, roupas, malhas: window.jogo.scene.children.length };
});

// ============================== 3. a ronda: os pontos E os caminhos entre eles
/**
 * A conta é a mesma que o jogo usa para empurrar quem anda (`collision.ts`), só
 * que aqui ela é usada para PERGUNTAR em vez de empurrar: a Estella é um círculo
 * de 0,4 (ela tem 0,8 de largura no lombo), e o teste percorre cada trecho em
 * passos de 10 cm.
 */
const ronda = await page.evaluate(([pontos]) => {
  const RAIO = 0.4;
  const colisores = window.jogo.current.world.colliders;
  const bate = (x, z) => colisores.find((c) => {
    if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < RAIO + c.r;
    const cos = Math.cos(-c.rot);
    const sin = Math.sin(-c.rot);
    const lx = (x - c.x) * cos - (z - c.z) * sin;
    const lz = (x - c.x) * sin + (z - c.z) * cos;
    const dx = Math.max(Math.abs(lx) - c.hw, 0);
    const dz = Math.max(Math.abs(lz) - c.hd, 0);
    return dx * dx + dz * dz < RAIO * RAIO;
  });

  const pontosRuins = [];
  const trechosRuins = [];
  for (let i = 0; i < pontos.length; i++) {
    const [x, z] = pontos[i];
    if (bate(x, z)) pontosRuins.push(`parada ${i} (${x}, ${z})`);
    if (i === 0) continue;
    const [ax, az] = pontos[i - 1];
    const passos = Math.ceil(Math.hypot(x - ax, z - az) / 0.1);
    for (let t = 1; t < passos; t++) {
      const px = ax + ((x - ax) * t) / passos;
      const pz = az + ((z - az) * t) / passos;
      const c = bate(px, pz);
      if (c) {
        trechosRuins.push(`trecho ${i - 1}→${i} bate em ${c.kind} (${c.x.toFixed(1)}, ${c.z.toFixed(1)})`);
        break;
      }
    }
  }
  return { pontosRuins, trechosRuins, colisores: colisores.length };
}, [RONDA]);

// ======================================= 4. ela anda de verdade, e não entra em nada
await page.evaluate(() => {
  window.jogo.scene.traverse((o) => {
    if (!window.__ovelha && o.userData?.peca === 'estella') window.__ovelha = o;
  });
});
const ondeEla = () => page.evaluate(() => {
  const o = window.__ovelha;
  return o ? [+o.position.x.toFixed(2), +o.position.z.toFixed(2)] : null;
});

/*
 * O TOAST E COLHIDO NO CAMINHO, e nao no fim.
 *
 * Ele some sozinho depois de alguns segundos — ler `.toasts` uma vez, no fim da
 * amostragem, e apostar em cair no meio dos tres segundos em que a fala esta na
 * tela. Aqui cada amostra da trilha aproveita e recolhe o que estiver escrito.
 */
const trilha = [];
const ditas = new Set();
for (let i = 0; i < 40; i++) {
  const onde = await ondeEla();
  if (onde) trilha.push(onde);
  for (const t of await page.evaluate(() =>
    [...document.querySelectorAll('.toasts *')].map((n) => n.textContent))) {
    if (t && t.length > 4) ditas.add(t);
  }
  await page.waitForTimeout(900);
  if (i === 8) await page.screenshot({ path: `${OUT}-salao.png` });
}
let andou = 0;
for (let i = 1; i < trilha.length; i++) {
  andou += Math.hypot(trilha[i][0] - trilha[i - 1][0], trilha[i][1] - trilha[i - 1][1]);
}
const dentroDeMovel = await page.evaluate(([pts]) => {
  const RAIO = 0.4;
  const colisores = window.jogo.current.world.colliders;
  return pts.filter(([x, z]) => colisores.some((c) => {
    if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < RAIO + c.r;
    const cos = Math.cos(-c.rot);
    const sin = Math.sin(-c.rot);
    const lx = (x - c.x) * cos - (z - c.z) * sin;
    const lz = (x - c.x) * sin + (z - c.z) * cos;
    const dx = Math.max(Math.abs(lx) - c.hw, 0);
    const dz = Math.max(Math.abs(lz) - c.hd, 0);
    return dx * dx + dz * dz < RAIO * RAIO;
  }));
}, [trilha]);

// as falas soltas: elas saem em toast, então é no toast que se procura
const falou = [...ditas].join(' | ');

// ====================================== 5. as fotos: o fundo, o caixa e a ronda
await page.evaluate(() => {
  window.jogo.debugPlace(-1.5, 1.0, Math.PI);
  window.jogo.setZoom(7.5);
});
await page.waitForTimeout(2200);
await page.screenshot({ path: `${OUT}-provadores.png` });

await page.evaluate(() => {
  window.jogo.debugPlace(3.2, 1.2, Math.PI);
  window.jogo.setZoom(6);
});
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}-caixa.png` });

await page.evaluate(() => {
  window.jogo.focusCamera(window.__ovelha);
  window.jogo.setZoom(4);
});
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}-estella.png` });
await page.evaluate(() => window.jogo.focusCamera(null));

// ============================================ 6. falar com ela, e voltar pra rua
await page.evaluate(() => {
  window.jogo.setZoom(11);
  const o = window.__ovelha;
  window.jogo.debugPlace(o.position.x + 0.7, o.position.z + 0.7, 0);
});
await page.waitForTimeout(1400);
const promptDela = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const apresentacao = [];
for (let i = 0; i < 14; i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 10 && !apresentacao.includes(t)) apresentacao.push(t);
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(480);
}
const noDiario = await page.evaluate(() => {
  const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  return (save.memories ?? []).map((m) => m.id);
});

await page.evaluate(() => window.jogo.debugPlace(4.1, 4.0, 0));
await page.waitForTimeout(1200);
const promptDeSair = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const voltou = await page.evaluate(() => ({
  cena: window.jogo.current?.def?.id ?? window.jogo.current?.id ?? null,
  onde: [+window.jogo.playerPosition().x.toFixed(1), +window.jogo.playerPosition().z.toFixed(1)],
}));
// e a dupla consegue andar de onde nasceu (não caiu dentro de um colisor)
const antes = voltou.onde;
await page.keyboard.down('KeyW');
await page.waitForTimeout(2200);
await page.keyboard.up('KeyW');
const depois = await page.evaluate(() =>
  [+window.jogo.playerPosition().x.toFixed(1), +window.jogo.playerPosition().z.toFixed(1)]);
const andouLaFora = Math.hypot(depois[0] - antes[0], depois[1] - antes[1]);

// ======================================================================= laudo
const falhas = [];
if (!/lojinha/i.test(promptDaPorta)) falhas.push(`nao ha porta na fachada: "${promptDaPorta}"`);
if (entrou !== 'lojinha') falhas.push(`a porta nao levou para dentro: cena "${entrou}"`);
for (const [peca, quantas] of [
  ['arara-de-roupas', 4], ['provadores', 1], ['manequim-de-loja', 2],
  ['balcao-da-loja', 1], ['mesa-de-dobrar', 1], ['prateleira-da-loja', 2], ['estella', 1],
]) {
  if ((salao.conta[peca] ?? 0) !== quantas) {
    falhas.push(`o salao tem ${salao.conta[peca] ?? 0} de "${peca}" (esperado ${quantas})`);
  }
}
if (salao.roupas < 40) falhas.push(`as araras tem so ${salao.roupas} pecas penduradas`);
falhas.push(...ronda.pontosRuins.map((p) => `parada dentro de movel: ${p}`));
falhas.push(...ronda.trechosRuins.map((t) => `a ronda atravessa movel: ${t}`));
if (andou < 3) falhas.push(`a Estella quase nao andou (${andou.toFixed(2)} em 36 s)`);
if (dentroDeMovel.length) {
  falhas.push(`ela foi vista dentro de um movel: ${JSON.stringify(dentroDeMovel.slice(0, 3))}`);
}
if (!/Estella/.test(falou)) falhas.push(`ela nao falou sozinha: "${falou}"`);
if (!/Falar com a Estella/i.test(promptDela)) falhas.push(`nao da para falar com ela: "${promptDela}"`);
if (!apresentacao.some((f) => /minha|arara|bainha/i.test(f))) {
  falhas.push(`a apresentacao dela nao aconteceu: ${JSON.stringify(apresentacao)}`);
}
if (!noDiario.includes('lojinha-por-dentro')) falhas.push('a loja nao entrou no diario');
if (!/calçada|calcada/i.test(promptDeSair)) falhas.push(`nao ha porta de volta: "${promptDeSair}"`);
if (voltou.cena !== 'villa-lobos') falhas.push(`a porta de volta nao saiu da loja: "${voltou.cena}"`);
if (andouLaFora < 0.4) falhas.push(`a dupla nasceu presa na calcada (andou ${andouLaFora.toFixed(2)})`);
falhas.push(...erros);

console.log('1. porta:', JSON.stringify(promptDaPorta), '→ cena', entrou);
console.log('2. salao:', JSON.stringify(salao.conta), '·', salao.roupas, 'pecas penduradas');
console.log('3. ronda:', ronda.pontosRuins.length ? JSON.stringify(ronda.pontosRuins) : 'as 8 paradas livres',
  '·', ronda.trechosRuins.length ? JSON.stringify(ronda.trechosRuins) : 'os 7 trechos limpos',
  `· ${ronda.colisores} colisores na cena`);
console.log('4. ela andou', andou.toFixed(2), 'em 36 s · dentro de movel:', dentroDeMovel.length);
console.log('   toast:', JSON.stringify(falou.slice(0, 120)));
console.log('5. conversa:', JSON.stringify(apresentacao.slice(0, 3)), '· diario:', JSON.stringify(noDiario));
console.log('6. volta:', JSON.stringify(promptDeSair), '→', voltou.cena, JSON.stringify(voltou.onde),
  '· andou la fora:', andouLaFora.toFixed(2));

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
