/**
 * AS SEIS VAGAS DE ROUPA E A BERMUDA NA RUA (pedido do Renan):
 *
 *   1. o corpo tem 6 vagas — cabeça, tronco, pernas, pés, MÃOS e ACESSÓRIO —,
 *      e cada peça nova cai na dela: luva e pulseira nas mãos, presilha e
 *      adesivo no acessório; a geometria nasce no pai certo (luva no braço,
 *      presilha na cabeça, adesivo no corpo);
 *   2. a bermuda do vestiário, vestida no PARQUE, aparece: o calção e as pernas
 *      do shorts por cima da perna de pele, com a camiseta de sempre;
 *   3. no CLUBE continua o traje de banho: sem camiseta e de shorts;
 *   4. a mochila mostra as 6 vagas, e o armário separa as peças novas nas
 *      partes "Mãos" e "Acessório";
 *   5. um save antigo, de 4 vagas, abre com as 6 e sem perder nada.
 *
 *   node scripts/vagas.mjs /tmp/vg
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/vg';
const BASE = process.env.BASE ?? 'http://localhost:4173';
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
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
const pronto = () => page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });

/** o que o corpo de cada um mostra: calção, pernas do shorts, cor da perna e onde cada peça pendurou */
const corpo = (quem) => page.evaluate((quem) => {
  const j = window.jogo;
  const rig = (quem === 'ari' ? j.player : j.parceiro).rig.spec.id === quem
    ? (quem === 'ari' ? j.player : j.parceiro).rig
    : (quem === 'ari' ? j.parceiro : j.player).rig;
  const cor = (m) => '#' + m.material.color.getHexString();
  const pais = {};
  rig.group.traverse((o) => {
    if (!o.userData.roupa) return;
    const p = o.parent;
    const onde = p === rig.head ? 'cabeca' : p === rig.body ? 'corpo' : p === rig.armL || p === rig.armR ? 'braco'
      : p === rig.legL || p === rig.legR ? 'perna' : 'outro';
    (pais[o.userData.roupa] ??= []).push(onde);
  });
  const perna = rig.trocaMaterial.find((t) => t.slot === 'pernas');
  const torso = rig.trocaMaterial.find((t) => t.slot === 'tronco' && t.parte === 'principal');
  return {
    traje: rig.traje,
    calcao: rig.calcao.visible,
    pernasDoShort: rig.pernasDoShort.every((p) => p.visible),
    pernaDePele: perna.mesh.material === perna.banho,
    torsoDePele: torso.mesh.material === torso.banho,
    pais,
    vagas: j.wearables(quem).map((i) => i?.id ?? null),
  };
}, quem);

// ============================================= 1 e 2. no parque
await page.goto(`${BASE}/?cena=villa-lobos&em=-4,20&olhar=3.14`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=villa-lobos&em=-4,20&olhar=3.14`, { waitUntil: 'networkidle' });
await pronto();
await page.waitForTimeout(600);
await page.mouse.click(550, 400);
const vestiu = await page.evaluate(() => {
  const j = window.jogo;
  const cat = window.aristoryItens;
  const ari = ['bermuda-estampada', 'luvas-de-jardim', 'presilha-estrela'].map((id) => j.equipWearable(cat[id], 'ari'));
  const renan = ['bermuda-azul', 'pulseira-micangas', 'adesivo-coracao'].map((id) => j.equipWearable(cat[id], 'renan'));
  return [...ari, ...renan];
});
ok(vestiu.every(Boolean), `as seis peças entram (${vestiu.join(', ')})`);
await page.waitForTimeout(400);
const ari = await corpo('ari');
const renan = await corpo('renan');
ok(ari.vagas.length === 6 && renan.vagas.length === 6, `o corpo tem 6 vagas (${ari.vagas.length})`);
ok(ari.vagas[4] === 'luvas-de-jardim' && ari.vagas[5] === 'presilha-estrela',
  `luva na vaga das mãos e presilha na do acessório (${JSON.stringify(ari.vagas)})`);
ok(renan.vagas[4] === 'pulseira-micangas' && renan.vagas[5] === 'adesivo-coracao',
  `pulseira nas mãos e adesivo no acessório (${JSON.stringify(renan.vagas)})`);
ok(ari.pais['luvas-de-jardim']?.length === 2 && ari.pais['luvas-de-jardim'].every((p) => p === 'braco'),
  `a luva nasce nos dois braços (${ari.pais['luvas-de-jardim']})`);
ok(ari.pais['presilha-estrela']?.[0] === 'cabeca', `a presilha nasce na cabeça (${ari.pais['presilha-estrela']})`);
ok(renan.pais['adesivo-coracao']?.[0] === 'corpo', `o adesivo nasce no corpo (${renan.pais['adesivo-coracao']})`);
ok(renan.pais['pulseira-micangas']?.every((p) => p === 'braco'), `a pulseira nasce nos braços (${renan.pais['pulseira-micangas']})`);
for (const [nome, c] of [['Ari', ari], ['Renan', renan]]) {
  ok(c.traje === 'normal' && c.calcao && c.pernasDoShort && c.pernaDePele && !c.torsoDePele,
    `${nome} de bermuda no parque: calção ${c.calcao}, pernas do shorts ${c.pernasDoShort}, perna de pele ${c.pernaDePele}, camiseta ${!c.torsoDePele}`);
}
// as fotos: de frente e de costas, de perto
await page.evaluate(() => { window.jogo.debugPlace(-4, 20, 0); window.jogo.setZoom(1.3); });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-parque-frente.png` });
await page.evaluate(() => window.jogo.debugPlace(-4, 20, Math.PI));
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-parque-costas.png` });
// andando: a perna balança por baixo do shorts
await page.evaluate(() => window.jogo.setZoom(2.2));
await page.keyboard.down('KeyD');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-parque-andando.png` });
await page.keyboard.up('KeyD');

// tirar a bermuda devolve a calça
await page.evaluate(() => window.jogo.unequipWearable(2, 'ari'));
await page.waitForTimeout(300);
const semBermuda = await corpo('ari');
ok(!semBermuda.calcao && !semBermuda.pernaDePele, 'tirar a bermuda devolve a calça da ficha');
await page.evaluate(() => window.jogo.equipWearable(window.aristoryItens['bermuda-estampada'], 'ari'));

// ============================================= 4. a mochila e o armário
await page.keyboard.press('KeyI');
await page.waitForTimeout(500);
const naMochila = await page.evaluate(() => document.querySelectorAll('.mochila .vestiveis .slot').length);
ok(naMochila === 6, `a mochila mostra as 6 vagas de vestimenta (${naMochila})`);
await page.screenshot({ path: `${OUT}-mochila.png` });
await page.keyboard.press('KeyI');
await page.waitForTimeout(400);
await page.evaluate(() => {
  const j = window.jogo;
  // o que está no corpo volta para o armário (o mesmo caminho do painel), para
  // ele listar por parte
  j.tirarPeca('ari', 4);
  j.tirarPeca('ari', 5);
});
await page.evaluate(() => window.jogo.abrirGuardaRoupa());
await page.waitForTimeout(900);
const partes = await page.evaluate(() => ({
  corpo: [...document.querySelectorAll('.armario .corpo > *')].map((v) => v.textContent.trim().split(/\s+/)[0]),
  grupos: [...document.querySelectorAll('.armario .acervo .grupo')].map((s) => s.querySelector('h4')?.firstChild?.textContent?.trim()),
}));
ok(partes.grupos.includes('Mãos') && partes.grupos.includes('Acessório'),
  `o armário separa as partes novas (${partes.grupos.join(', ')})`);
await page.screenshot({ path: `${OUT}-armario.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// ============================================= 3. no clube: banho, como antes
await page.evaluate(() => {
  const j = window.jogo;
  j.equipWearable(window.aristoryItens['luvas-de-jardim'], 'ari');
  j.equipWearable(window.aristoryItens['presilha-estrela'], 'ari');
  j.save?.persist?.();
});
await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await pronto();
await page.waitForTimeout(900);
const noClube = await corpo('ari');
ok(noClube.traje === 'banho' && noClube.calcao && noClube.torsoDePele,
  `no clube continua o traje de banho: sem camiseta e de shorts (${noClube.traje})`);
const extrasNoClube = await page.evaluate(() => {
  const j = window.jogo;
  const rig = j.player.rig.spec.id === 'ari' ? j.player.rig : j.parceiro.rig;
  const vis = {};
  rig.group.traverse((o) => { if (o.userData.roupa) vis[o.userData.roupa] = o.visible; });
  return vis;
});
ok(extrasNoClube['presilha-estrela'] === true && extrasNoClube['luvas-de-jardim'] === false,
  `no banho a presilha fica e a luva sai (${JSON.stringify(extrasNoClube)})`);
await page.evaluate(() => window.jogo.setZoom(1.5));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}-clube.png` });

// ============================================= 5. um save antigo, de 4 vagas
const migrou = await page.evaluate(() => {
  const chave = 'aristory.save.v1';
  const bruto = JSON.parse(localStorage.getItem(chave));
  const cat = window.aristoryItens;
  for (const quem of Object.keys(bruto.inventarios ?? {})) {
    bruto.inventarios[quem].vestiveis = [cat['gorro-la'] ?? null, null, cat['bermuda-azul'], null];
  }
  localStorage.setItem(chave, JSON.stringify(bruto));
  return Object.keys(bruto.inventarios ?? {}).length;
});
await page.reload({ waitUntil: 'networkidle' });
await pronto();
await page.waitForTimeout(500);
const depois = await page.evaluate(() => window.jogo.wearables('ari').map((i) => i?.id ?? null));
ok(migrou > 0 && depois.length === 6 && depois[2] === 'bermuda-azul',
  `um save de 4 vagas abre com 6, sem perder a bermuda (${JSON.stringify(depois)})`);

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
