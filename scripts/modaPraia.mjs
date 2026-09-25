/**
 * A MODA PRAIA DO VESTIÁRIO (pedido do Renan): as bermudas estampadas, os
 * óculos, os chinelos, a boia de patinho, o colar havaiano, o chapéu de
 * praia, a touca, a tiara e as camisas — vestidas nos dois.
 *
 *   1. toda peça de `MODA_PRAIA` existe, custa até R$ 20 e nasce no pai certo
 *      (óculos e chapéu na cabeça, chinelo e estampa da perna nas pernas, a
 *      estampa do calção e o colar no corpo, a boia no braço);
 *   2. NO CLUBE (traje de banho) a peça de piscina continua no corpo: a
 *      estampa da bermuda, o chinelo (com o pé de pele), a boia e o colar; a
 *      camisa havaiana, não — no clube é sem camiseta;
 *   3. o óculos (acessório) e o chapéu (cabeça) vão JUNTOS;
 *   4. fotos: três combinações nos dois, no clube e no parque, de frente, de
 *      costas e de perto.
 *
 *   node scripts/modaPraia.mjs /tmp/mp
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/mp';
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

const COMBINACOES = [
  {
    nome: 'a',
    ari: ['chapeu-de-praia', 'oculos-de-coracao', 'bermuda-havaiana', 'chinelo-florido', 'colar-havaiano'],
    renan: ['oculos-espelhado', 'bermuda-listrada', 'chinelo-slide', 'boia-de-patinho'],
  },
  {
    nome: 'b',
    ari: ['touca-de-natacao', 'oculos-de-natacao', 'bermuda-de-melancia', 'chinelo-de-melancia', 'boia-de-patinho'],
    renan: ['tiara-de-conchinhas', 'oculos-gatinho', 'bermuda-de-abacaxi', 'chinelo-verde-limao', 'colar-havaiano'],
  },
  {
    nome: 'c',
    ari: ['oculos-redondo', 'bermuda-de-bolinhas', 'chinelo-azul', 'regata-listrada'],
    renan: ['chapeu-de-praia', 'oculos-escuros', 'bermuda-de-ondinhas', 'camisa-havaiana', 'chinelo-azul'],
  },
];

const vestir = (ari, renan) => page.evaluate(([ari, renan]) => {
  const j = window.jogo;
  const cat = window.aristoryItens;
  for (const [quem, ids] of [['ari', ari], ['renan', renan]]) {
    for (let v = 0; v < 6; v++) j.unequipWearable(v, quem);
    for (const id of ids) j.equipWearable(cat[id], quem);
  }
}, [ari, renan]);

/** o que cada corpo tem pendurado: pai e se está visível, por peça */
const pendurado = () => page.evaluate(() => {
  const j = window.jogo;
  const r = {};
  for (const q of [j.player, j.parceiro]) {
    const rig = q.rig;
    const pecas = {};
    rig.group.traverse((o) => {
      if (!o.userData.roupa) return;
      const p = o.parent;
      const pai = p === rig.head ? 'cabeca' : p === rig.body ? 'corpo' : p === rig.armL || p === rig.armR ? 'braco'
        : p === rig.legL || p === rig.legR ? 'perna' : 'outro';
      const e = (pecas[o.userData.roupa] ??= { pais: [], visivel: true });
      if (!e.pais.includes(pai)) e.pais.push(pai);
      e.visivel = e.visivel && o.visible;
    });
    const pe = rig.trocaMaterial.find((t) => t.slot === 'pes');
    r[rig.spec.id] = { pecas, peDePele: pe.mesh.material === pe.banho };
  }
  return r;
});

const abrir = async (cena, em, olhar) => {
  await page.goto(`${BASE}/?cena=${cena}&em=${em}&olhar=${olhar}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await page.waitForTimeout(900);
};

// ============================================================ 1. as fichas
await abrir('clube', '15,-13', '3.14');
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await abrir('clube', '15,-13', '3.14');
const fichas = await page.evaluate(() => {
  const lista = window.aristoryModaPraia ?? [];
  return lista.map((p) => ({ id: p.id, slot: p.slot, preco: p.preco, praia: !!p.praia, presoEm: p.presoEm }));
});
ok(fichas.length >= 28, `o vestiário vende ${fichas.length} peças (as 5 de antes e as novas)`);
ok(fichas.every((f) => typeof f.preco === 'number' && f.preco > 0 && f.preco <= 20), 'toda peça custa entre R$ 1 e R$ 20');
ok(fichas.filter((f) => f.id.startsWith('oculos')).every((f) => f.slot === 'acessorio' && f.presoEm === 'cabeca'),
  'todo óculos é acessório preso na cabeça');

// ============================================================ 2. no clube
const esperado = {
  'chapeu-de-praia': 'cabeca', 'touca-de-natacao': 'cabeca', 'tiara-de-conchinhas': 'cabeca',
  'colar-havaiano': 'corpo', 'camisa-havaiana': 'corpo', 'regata-listrada': 'corpo',
  'boia-de-patinho': 'braco',
};
const paiEsperado = (id) => esperado[id] ?? (id.startsWith('oculos') ? 'cabeca' : 'perna');
const vistos = new Map();
const noClube = {};
for (const c of COMBINACOES) {
  await vestir(c.ari, c.renan);
  await page.waitForTimeout(400);
  noClube[c.nome] = await pendurado();
  for (const [quem, ids] of [['ari', c.ari], ['renan', c.renan]]) {
    for (const id of ids) {
      const e = noClube[c.nome][quem].pecas[id];
      if (e) vistos.set(id, e);
    }
  }
  await page.evaluate(() => { window.jogo.debugPlace(15, -13, 0); window.jogo.setZoom(1.2); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}-clube-${c.nome}-frente.png` });
  await page.evaluate(() => window.jogo.debugPlace(15, -13, Math.PI));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}-clube-${c.nome}-costas.png` });
  await page.evaluate(() => { window.jogo.debugPlace(15, -13, 0.35); window.jogo.setZoom(0.75); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}-clube-${c.nome}-perto.png` });
}

const erradas = [...vistos].filter(([id, e]) => !e.pais.includes(paiEsperado(id))).map(([id]) => id);
ok(erradas.length === 0, `cada peça nasce no pai certo (erradas: ${erradas.join(', ') || 'nenhuma'})`);
const bermudas = [...vistos].filter(([id]) => id.startsWith('bermuda'));
ok(bermudas.every(([, e]) => e.pais.includes('corpo') && e.pais.includes('perna')),
  'a bermuda estampada tem estampa no quadril (corpo) e na perna');
// no clube: a peça de piscina aparece, a camisa não
const a = noClube.a;
ok(a.ari.pecas['bermuda-havaiana']?.visivel && a.ari.pecas['chinelo-florido']?.visivel && a.ari.pecas['colar-havaiano']?.visivel,
  'no clube a estampa da bermuda, o chinelo e o colar continuam no corpo');
ok(a.renan.pecas['boia-de-patinho']?.visivel, 'a boia de patinho vai para a piscina');
ok(a.ari.pecas['chapeu-de-praia']?.visivel && a.ari.pecas['oculos-de-coracao']?.visivel, 'chapéu e óculos juntos, os dois visíveis');
ok(a.ari.peDePele && a.renan.peDePele, 'de chinelo, o pé é de pele');
ok(noClube.c.renan.pecas['camisa-havaiana']?.visivel === false, 'a camisa havaiana não aparece no clube (sem camiseta)');

// ============================================================ 3. no parque
const noParque = {};
for (const c of COMBINACOES) {
  await abrir('villa-lobos', '-4.2,15.6', '3.14');
  await vestir(c.ari, c.renan);
  await page.waitForTimeout(400);
  noParque[c.nome] = await pendurado();
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0); window.jogo.setZoom(1.2); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}-parque-${c.nome}-frente.png` });
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0.35); window.jogo.setZoom(0.75); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}-parque-${c.nome}-perto.png` });
}
ok(noParque.c.renan.pecas['camisa-havaiana']?.visivel === true, 'no parque a camisa havaiana aparece');
ok(noParque.a.ari.pecas['bermuda-havaiana']?.visivel === true, 'no parque a bermuda estampada aparece, com a estampa');
ok(noParque.a.ari.peDePele, 'de chinelo no parque, o pé continua de pele');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
