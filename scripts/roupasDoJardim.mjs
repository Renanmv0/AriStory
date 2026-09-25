/**
 * A SEGUNDA LEVA DA LOJINHA DA JOSEFINA (pedido do Renan): luvas estampadas,
 * pins de cabelo, pulseiras, vestidos floridos, camisetas de natureza,
 * camisetas largas e calças largas — e o chapéu joaninha pousando no cabelo
 * de quem veste.
 *
 *   1. toda peça nova está à venda na lojinha e veste na vaga dela, com a
 *      geometria no pai certo (luva no braço, pin na cabeça, calça na perna);
 *   2. o chapéu joaninha: no Renan a aba desce até o cabelo dele;
 *   3. cinco combinações nos dois, de frente, de costas, andando e sentados.
 *
 *   node scripts/roupasDoJardim.mjs /tmp/rj
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/rj';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const problemas = [];
const erros = [];
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) problemas.push(msg);
};
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });

const NOVAS = [
  'luvas-de-folha', 'luvas-de-girassol', 'luvas-de-joaninha', 'luvas-de-gotinha',
  'pulseira-de-flores', 'pulseira-de-pedrinhas',
  'pin-de-margarida', 'pin-de-joaninha', 'pin-de-abelhinha', 'pin-de-borboleta',
  'camiseta-de-florzinhas', 'camiseta-de-joaninha', 'camiseta-de-abelhinha', 'camiseta-de-borboleta',
  'larga-de-cogumelo', 'larga-de-sapinho', 'larga-de-lavanda',
  'vestido-de-margaridas', 'vestido-de-rosinhas', 'vestido-do-campo',
  'calca-cargo-de-jardim', 'calca-pantalona', 'calca-de-jardineiro',
];

await page.goto(`${BASE}/?cena=villa-lobos&em=-4,20&olhar=3.14`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=villa-lobos&em=-4.2,15.6&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
await page.waitForTimeout(600);
await page.mouse.click(500, 400);

// ============================================= 1. a ficha de cada peça
const fichas = await page.evaluate((ids) => ids.map((id) => {
  const f = window.aristoryItens[id];
  return { id, existe: !!f, slot: f?.slot, preco: f?.preco, extra: typeof f?.extra === 'function' };
}), NOVAS);
ok(fichas.every((f) => f.existe && f.preco > 0 && f.extra), `as ${NOVAS.length} peças existem, têm preço e geometria`);

/** o rig de cada um, e onde cada peça pendurou */
const onde = () => page.evaluate(() => {
  const j = window.jogo;
  const r = {};
  for (const quem of [j.player, j.parceiro]) {
    const rig = quem.rig;
    const pais = {};
    rig.group.traverse((o) => {
      if (!o.userData.roupa) return;
      const p = o.parent;
      const nome = p === rig.head ? 'cabeca' : p === rig.body ? 'corpo' : p === rig.armL || p === rig.armR ? 'braco'
        : p === rig.legL || p === rig.legR ? 'perna' : 'outro';
      (pais[o.userData.roupa] ??= new Set()).add(nome);
    });
    r[rig.spec.id] = Object.fromEntries(Object.entries(pais).map(([k, v]) => [k, [...v]]));
  }
  return r;
});

const vestir = (ari, renan) => page.evaluate(([ari, renan]) => {
  const j = window.jogo;
  const cat = window.aristoryItens;
  for (const [quem, ids] of [['ari', ari], ['renan', renan]]) {
    for (let v = 0; v < 6; v++) j.unequipWearable(v, quem);
    for (const id of ids) j.equipWearable(cat[id], quem);
  }
}, [ari, renan]);

const COMBINACOES = [
  { nome: 'a', ari: ['vestido-de-margaridas', 'luvas-de-folha', 'pin-de-margarida'], renan: ['larga-de-cogumelo', 'calca-cargo-de-jardim', 'luvas-de-girassol', 'pin-de-joaninha'] },
  { nome: 'b', ari: ['vestido-de-rosinhas', 'luvas-de-joaninha', 'pin-de-borboleta', 'pulseira-de-flores'], renan: ['camiseta-de-florzinhas', 'calca-pantalona', 'pulseira-de-pedrinhas'] },
  { nome: 'c', ari: ['vestido-do-campo', 'pin-de-abelhinha', 'luvas-de-gotinha'], renan: ['larga-de-sapinho', 'calca-de-jardineiro', 'gorro-joaninha'] },
  { nome: 'd', ari: ['camiseta-de-joaninha', 'calca-cargo-de-jardim', 'gorro-joaninha', 'pulseira-de-pedrinhas'], renan: ['camiseta-de-abelhinha', 'calca-de-jardineiro', 'pin-de-abelhinha'] },
  { nome: 'e', ari: ['larga-de-lavanda', 'calca-pantalona', 'pulseira-de-flores'], renan: ['camiseta-de-borboleta', 'calca-cargo-de-jardim', 'luvas-de-folha', 'pin-de-borboleta'] },
];
/** vence o balão: E nas falas e, se vier escolha, clica a primeira ou a última */
const passarFalas = async (qual) => {
  for (let i = 0; i < 30; i++) {
    const botoes = page.locator('.escolhas button');
    if (await botoes.count()) {
      await (qual === 'first' ? botoes.first() : botoes.last()).click();
      await page.waitForTimeout(500);
      continue;
    }
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
};
/** levanta do banco: o E pergunta "Ficar / Levantar", e escolhe levantar */
const sentado = () => page.evaluate(() => !!(window.jogo.player.riding || window.jogo.player.rig.sitting));
const levantar = async () => {
  await passarFalas('last');
  await page.waitForTimeout(900);
  ok(!(await sentado()), 'levantou do banco');
};
const vistos = new Map();
for (const c of COMBINACOES) {
  // pergunta que sobrou do banco da combinação anterior: levanta
  await levantar();
  await vestir(c.ari, c.renan);
  await page.waitForTimeout(300);
  const pais = await onde();
  for (const [quem, ids] of [['ari', c.ari], ['renan', c.renan]]) {
    for (const id of ids) if (pais[quem][id]) vistos.set(id, pais[quem][id]);
  }
  // de frente, de perto
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0); window.jogo.setZoom(1.1); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}-${c.nome}-frente.png` });
  // de costas
  await page.evaluate(() => window.jogo.debugPlace(-4.2, 15.6, Math.PI));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}-${c.nome}-costas.png` });
  // andando
  await page.evaluate(() => window.jogo.setZoom(1.8));
  await page.keyboard.down('KeyD');
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}-${c.nome}-andando.png` });
  await page.keyboard.up('KeyD');
  // sentados no banco (a perna a ~90°: onde saia e calça larga mais escapam)
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, Math.PI); window.jogo.setZoom(1.5); });
  await page.waitForTimeout(400);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1200);
  // o banco fala duas falas e pergunta "Ficar / Levantar": passa as falas
  // até a pergunta, e a foto sai com o balão escondido
  for (let i = 0; i < 20 && !(await page.locator('.escolhas button').count()); i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
  await page.addStyleTag({ content: '.dialogue{visibility:hidden}' }).then((h) => page.evaluate((el) => el.id = 'semBalao', h));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}-${c.nome}-sentados.png` });
  await page.evaluate(() => document.getElementById('semBalao')?.remove());
  await levantar();
}

const esperado = (id) => {
  if (id.startsWith('luvas') || id.startsWith('pulseira')) return 'braco';
  if (id.startsWith('pin')) return 'cabeca';
  if (id.startsWith('calca')) return 'perna';
  return 'corpo';
};
const errados = NOVAS.filter((id) => !(vistos.get(id) ?? []).includes(esperado(id)));
ok(errados.length === 0, `cada peça nasce no pai certo (erradas: ${errados.join(', ') || 'nenhuma'})`);
ok(NOVAS.every((id) => vistos.has(id)), `as ${NOVAS.length} peças foram vestidas e fotografadas`);

// ============================================= 2. o chapéu joaninha no Renan
await page.evaluate(() => {
  const j = window.jogo;
  j.equipWearable(window.aristoryItens['gorro-joaninha'], 'renan');
  j.equipWearable(window.aristoryItens['gorro-joaninha'], 'ari');
});
// o corpo só se veste no quadro seguinte
await page.waitForTimeout(300);
const chapeu = await page.evaluate(() => {
  const j = window.jogo;
  const r = {};
  for (const q of [j.player, j.parceiro]) {
    const m = q.rig.medidas;
    let base = null;
    q.rig.head.traverse((o) => {
      if (o.userData.roupa === 'gorro-joaninha' && base === null) {
        // a copa é o primeiro filho do chapéu; a altura dela é a base do chapéu
        const copa = o.children[0]?.children[0];
        base = copa ? copa.position.y : null;
      }
    });
    r[q.rig.spec.id] = { base: base / m.headR, cabelo: m.cabelo(0) / m.headR };
  }
  return r;
});
ok(Math.abs(chapeu.ari.base - 1.28) < 0.02, `no Ari o chapéu joaninha fica onde estava (base ${chapeu.ari.base.toFixed(2)}·headR)`);
ok(chapeu.renan.base < chapeu.renan.cabelo, `no Renan a base desce para dentro do cabelo (${chapeu.renan.base.toFixed(2)} < alto do cabelo ${chapeu.renan.cabelo.toFixed(2)})`);
await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0.3); window.jogo.setZoom(0.9); });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-chapeu-joaninha.png` });

// ============================================= 3. à venda na lojinha
const naLoja = await page.evaluate((ids) => {
  // o catálogo da lojinha é o que o painel desenha
  const nomes = ids.map((id) => window.aristoryItens[id]?.nome);
  return nomes.every(Boolean);
}, NOVAS);
ok(naLoja, 'toda peça nova tem nome para a vitrine');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
