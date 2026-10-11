/**
 * A COLEÇÃO NOVA DA ESTELLA (pedido do Renan: "vestidos detalhados, vestido
 * mais simples porém bem feitos, diversos acessórios", de todo tipo de peça).
 *
 *   1. as 26 peças existem, têm preço na régua do andar e estão À VENDA numa
 *      fila só da boutique (araras do térreo, premium, vitrine de joias, mesa
 *      de chapéus);
 *   2. cada uma pendura a geometria no pai certo (o vestido no corpo, a manga
 *      no braço, a saia no corpo pelo `extraQuadril`, o sapato na perna, o
 *      chapéu na cabeça, a joia onde a ficha manda);
 *   3. a pele: a SAIA deixa a própria perna nua (e a calça não), o vestido de
 *      decote deixa o colo de pele (`peitoNu`);
 *   4. A SAIA VIVA: com o vestido de baile, andando e sentado, nenhum ponto da
 *      perna fica do lado de fora do pano que está abaixo dele — medido na
 *      malha, vértice a vértice, quadro a quadro; e sentado o pano avança
 *      sobre o colo;
 *   5. fotos: seis combinações nos dois, de frente, de costas, andando e
 *      sentados, e o boneco do painel provando peças.
 *
 *   node scripts/roupasDaBoutique.mjs /tmp/rb      (SO=fotos pula para as fotos)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/rb';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = process.env.SO ?? '';

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

/** a peça, onde ela pendura, e o andar da loja em que se compra */
const NOVAS = {
  'blusa-ciganinha': 'corpo', 'camisa-de-seda': 'corpo', 'sueter-de-trancas': 'corpo', 'casaco-trench': 'corpo',
  'vestido-de-linho': 'corpo', 'vestido-de-poa': 'corpo', 'vestido-chemise': 'corpo', 'vestido-envelope': 'corpo',
  'vestido-de-baile': 'corpo', 'vestido-de-cetim': 'corpo', 'vestido-de-veludo': 'corpo',
  'saia-plissada': 'corpo', 'saia-de-tule': 'corpo', 'jardineira-jeans': 'corpo',
  'sapatilha-rosa': 'perna', 'sapatilha-preta': 'perna', 'bota-de-montaria': 'perna',
  'chapeu-de-palha': 'cabeca', 'chapeu-fedora': 'cabeca', 'tiara-de-perolas': 'cabeca',
  'relogio-dourado': 'braco', 'luvas-longas': 'braco', 'bolsa-de-mao': 'braco',
  'colar-de-perolas': 'corpo', 'lenco-de-seda': 'corpo', 'bolsa-transversal': 'corpo',
};
const IDS = Object.keys(NOVAS);

await page.goto(`${BASE}/?cena=villa-lobos&em=-4,20&olhar=3.14`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=villa-lobos&em=-4.2,15.6&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
await page.waitForTimeout(600);
await page.mouse.click(500, 400);

const vestir = (ari, renan) => page.evaluate(([ari, renan]) => {
  const j = window.jogo;
  const cat = window.aristoryItens;
  for (const [quem, ids] of [['ari', ari], ['renan', renan]]) {
    for (let v = 0; v < 6; v++) j.unequipWearable(v, quem);
    for (const id of ids) j.equipWearable(cat[id], quem);
  }
}, [ari, renan]);

if (SO !== 'fotos') {
  // ============================================= 1. a ficha e a fila de cada peça
  const fichas = await page.evaluate((ids) => {
    const filas = window.aristoryBoutique;
    return ids.map((id) => {
      const f = window.aristoryItens[id];
      const onde = filas.filter((fila) => fila.ids.includes(id));
      return {
        id, existe: !!f, preco: f?.preco, extra: typeof f?.extra === 'function',
        filas: onde.map((x) => x.titulo), andar: onde[0]?.andar,
      };
    });
  }, IDS);
  ok(fichas.every((f) => f.existe && f.extra), `as ${IDS.length} peças existem e têm geometria`);
  const semFila = fichas.filter((f) => f.filas.length !== 1);
  ok(semFila.length === 0, `cada peça está à venda numa fila só da boutique (${semFila.map((f) => `${f.id}: ${f.filas.length}`).join(', ') || 'todas'})`);
  const foraDaRegua = fichas.filter((f) => !(f.andar === 'terreo' ? f.preco >= 35 && f.preco <= 110 : f.preco >= 150 && f.preco <= 220));
  ok(foraDaRegua.length === 0, `preço na régua do andar: térreo 35–110, mezanino 150–220 (${foraDaRegua.map((f) => `${f.id} R$ ${f.preco}`).join(', ') || 'todas'})`);

  // ============================================= 2. o pai certo de cada peça
  const onde = () => page.evaluate(() => {
    const j = window.jogo;
    const rig = j.player.rig;
    const pais = {};
    rig.group.traverse((o) => {
      if (!o.userData.roupa) return;
      const p = o.parent;
      const nome = p === rig.head ? 'cabeca' : p === rig.body ? 'corpo' : p === rig.armL || p === rig.armR ? 'braco'
        : p === rig.legL || p === rig.legR ? 'perna' : 'outro';
      (pais[o.userData.roupa] ??= new Set()).add(nome);
    });
    return Object.fromEntries(Object.entries(pais).map(([k, v]) => [k, [...v]]));
  });
  const errados = [];
  for (const id of IDS) {
    await vestir([id], []);
    await page.waitForTimeout(120);
    const pais = (await onde())[id] ?? [];
    if (!pais.includes(NOVAS[id])) errados.push(`${id} em ${pais.join('/') || 'lugar nenhum'}`);
  }
  ok(errados.length === 0, `cada peça nasce no pai certo (${errados.join(', ') || 'todas'})`);

  // ============================================= 3. a pele
  const pele = (ids) => page.evaluate(async (ids) => {
    const j = window.jogo;
    const cat = window.aristoryItens;
    for (let v = 0; v < 6; v++) j.unequipWearable(v, 'ari');
    for (const id of ids) j.equipWearable(cat[id], 'ari');
    await new Promise((r) => setTimeout(r, 200));
    const rig = j.player.rig;
    const skin = rig.spec.skin;
    const cor = (m) => m.material.color.getHex();
    const perna = rig.legL.children.find((c) => c.isMesh && c.geometry.type === 'CapsuleGeometry');
    const torso = rig.body.children.find((c) => c.isMesh && c.geometry.type === 'CapsuleGeometry');
    const corDaPele = new (perna.material.color.constructor)(skin).getHex();
    return { perna: cor(perna) === corDaPele, torso: cor(torso) === corDaPele };
  }, ids);
  const deSaia = await pele(['saia-plissada']);
  ok(deSaia.perna, 'a saia plissada deixa a própria perna de pele');
  const deTule = await pele(['saia-de-tule', 'blusa-ciganinha']);
  ok(deTule.perna && deTule.torso, 'a saia de tule com a ciganinha: perna de pele e colo de pele');
  const deCalca = await pele(['calca-bege']);
  ok(!deCalca.perna, 'a calça continua cobrindo a perna');
  const deBaile = await pele(['vestido-de-baile']);
  ok(deBaile.perna && deBaile.torso, 'o vestido de baile: perna nua e o colo de pele por cima do decote');
  const deSeda = await pele(['camisa-de-seda']);
  ok(!deSeda.torso, 'a camisa de seda (sem decote) não mostra o peito');

  // ============================================= 4. a saia viva
  /**
   * A conta: cada ponto da perna (os mesmos da saia: coxa, canela, calcanhar e
   * bico) e cada linha do pano ABAIXO dele — na direção do ponto, o pano tem
   * que estar pelo menos tão longe do eixo quanto o ponto. A pior folga de
   * todos os quadros é o resultado (negativa = a perna furou o pano).
   */
  const medirSaia = () => page.evaluate(() => {
    const j = window.jogo;
    const rig = j.player.rig;
    let saia = null;
    rig.body.traverse((o) => { if (o.userData?.viva && !saia) saia = o; });
    if (!saia) return null;
    const h = rig.medidas.h;
    const pos = saia.geometry.attributes.position;
    // as linhas do pano (mesma altura = mesma linha)
    const linhas = new Map();
    for (let i = 0; i < pos.count; i++) {
      const y = +pos.getY(i).toFixed(4);
      (linhas.get(y) ?? linhas.set(y, []).get(y)).push(i);
    }
    const amostras = [[0, -0.09, 0], [0, -0.16, 0], [0, -0.225, 0], [0, -0.255, -0.022], [0, -0.252, 0.064]];
    let pior = Infinity;
    let frente = -Infinity;
    for (const pivo of [rig.legL, rig.legR]) {
      const sentado = Math.abs(pivo.rotation.x) > 1.0;
      for (const [k, [x, y, z]] of amostras.entries()) {
        // sentado o pé sai pela frente do pano, de propósito (ver `saiaViva`)
        if (sentado && k >= 3) continue;
        // o ponto no corpo: o quaternion do pivô aplicado à mão (v' = v + w·t + q×t, t = 2·q×v)
        const q = pivo.quaternion;
        const vx = x * h;
        const vy = y * h;
        const vz = z * h;
        const tx = 2 * (q.y * vz - q.z * vy);
        const ty = 2 * (q.z * vx - q.x * vz);
        const tz = 2 * (q.x * vy - q.y * vx);
        const px = vx + q.w * tx + (q.y * tz - q.z * ty) + pivo.position.x;
        const py = vy + q.w * ty + (q.z * tx - q.x * tz) + pivo.position.y;
        const pz = vz + q.w * tz + (q.x * ty - q.y * tx) + pivo.position.z;
        const rp = Math.hypot(px, pz);
        if (rp < h * 0.02) continue;
        const ang = Math.atan2(px, pz);
        for (const [yl, idx] of linhas) {
          if (yl > py) continue;
          // o vértice da linha mais perto da direção do ponto
          let melhor = null;
          let dif = Infinity;
          for (const i of idx) {
            const d = Math.abs(Math.atan2(Math.sin(Math.atan2(pos.getX(i), pos.getZ(i)) - ang), Math.cos(Math.atan2(pos.getX(i), pos.getZ(i)) - ang)));
            if (d < dif) { dif = d; melhor = i; }
          }
          const folga = Math.hypot(pos.getX(melhor), pos.getZ(melhor)) - rp;
          if (folga < pior) pior = folga;
        }
      }
    }
    for (let i = 0; i < pos.count; i++) frente = Math.max(frente, pos.getZ(i));
    return { pior: +(pior / h).toFixed(4), frente: +(frente / h).toFixed(3) };
  });

  await vestir(['vestido-de-baile'], ['vestido-de-cetim']);
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0); window.jogo.setZoom(1.5); });
  await page.waitForTimeout(500);
  const parada = await medirSaia();
  ok(parada !== null, 'o vestido de baile tem a saia viva');
  // andando: amostra quadro a quadro
  let piorAndando = Infinity;
  await page.keyboard.down('KeyD');
  for (let i = 0; i < 18; i++) {
    await page.waitForTimeout(110);
    const m = await medirSaia();
    if (m) piorAndando = Math.min(piorAndando, m.pior);
  }
  await page.keyboard.up('KeyD');
  ok(piorAndando > -0.004, `andando, a perna nunca fura o pano (pior folga ${piorAndando}·h)`);
  // sentado no banco: o pano avança sobre o colo
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, Math.PI); window.jogo.setZoom(1.3); });
  await page.waitForTimeout(400);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1200);
  for (let i = 0; i < 20 && !(await page.locator('.escolhas button').count()); i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(800);
  const sentada = await medirSaia();
  ok(sentada && sentada.pior > -0.004, `sentada, a coxa fica debaixo do pano (pior folga ${sentada?.pior}·h)`);
  // a perna deitada acaba no tornozelo, a 0,225·h do quadril: o pano tem que chegar lá
  ok(sentada && parada && sentada.frente > parada.frente + 0.04 && sentada.frente >= 0.25,
    `sentada, o pano avança sobre o colo até o tornozelo (frente ${parada?.frente}·h em pé → ${sentada?.frente}·h sentada)`);
  // levanta
  for (let i = 0; i < 20; i++) {
    const botoes = page.locator('.escolhas button');
    if (await botoes.count()) { await botoes.last().click(); await page.waitForTimeout(500); continue; }
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(900);
}

// ============================================= 5. as fotos
const COMBINACOES = [
  { nome: 'baile', ari: ['vestido-de-baile', 'tiara-de-perolas', 'luvas-longas', 'colar-de-perolas'], renan: ['vestido-de-cetim', 'sapatilha-preta'] },
  { nome: 'campo', ari: ['blusa-ciganinha', 'saia-plissada', 'sapatilha-rosa', 'chapeu-de-palha', 'relogio-dourado'], renan: ['casaco-trench', 'bota-de-montaria', 'chapeu-fedora', 'bolsa-transversal'] },
  { nome: 'florido', ari: ['vestido-envelope', 'sapatilha-preta', 'bolsa-de-mao'], renan: ['sueter-de-trancas', 'jardineira-jeans', 'lenco-de-seda'] },
  { nome: 'seda', ari: ['camisa-de-seda', 'saia-de-tule', 'sapatilha-rosa'], renan: ['vestido-de-poa'] },
  { nome: 'veludo', ari: ['vestido-de-veludo', 'bota-de-montaria'], renan: ['vestido-chemise', 'sapatilha-preta', 'relogio-dourado'] },
  { nome: 'linho', ari: ['vestido-de-linho', 'chapeu-de-palha'], renan: ['jardineira-jeans', 'chapeu-fedora'] },
];
const sentado = () => page.evaluate(() => !!(window.jogo.player.riding || window.jogo.player.rig.sitting));
const levantar = async () => {
  for (let i = 0; i < 30; i++) {
    const botoes = page.locator('.escolhas button');
    if (await botoes.count()) { await botoes.last().click(); await page.waitForTimeout(500); continue; }
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(900);
};
for (const c of COMBINACOES) {
  if (await sentado()) await levantar();
  await vestir(c.ari, c.renan);
  await page.waitForTimeout(300);
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0.4); window.jogo.setZoom(0.75); });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}-${c.nome}-frente.png` });
  await page.evaluate(() => window.jogo.debugPlace(-4.2, 15.6, Math.PI + 0.4));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}-${c.nome}-costas.png` });
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0); window.jogo.setZoom(1.5); });
  await page.keyboard.down('KeyD');
  await page.waitForTimeout(650);
  await page.screenshot({ path: `${OUT}-${c.nome}-andando.png` });
  await page.keyboard.up('KeyD');
  await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, Math.PI); window.jogo.setZoom(1.3); });
  await page.waitForTimeout(400);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1200);
  for (let i = 0; i < 20 && !(await page.locator('.escolhas button').count()); i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
  }
  const balao = await page.addStyleTag({ content: '.dialogue{visibility:hidden}' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}-${c.nome}-sentados.png` });
  await balao.evaluate((el) => el.remove());
  await levantar();
}

// o boneco do painel provando: a loja aberta com a coleção inteira
await page.evaluate((ids) => {
  const j = window.jogo;
  for (let v = 0; v < 6; v++) j.unequipWearable(v, 'ari');
  j.abrirLoja('Coleção nova', ids.map((id) => window.aristoryItens[id]));
}, IDS);
await page.waitForTimeout(800);
const naGrade = await page.locator('.loja .vitrine .peca').count();
ok(naGrade === IDS.length, `o painel lista as ${IDS.length} peças (${naGrade})`);
for (const id of ['vestido-de-baile', 'vestido-envelope', 'casaco-trench', 'chapeu-de-palha']) {
  await page.locator(`.loja .vitrine .peca[data-id="${id}"]`).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-painel-${id}.png` });
}
await page.keyboard.press('Escape');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
