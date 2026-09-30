/**
 * O UNIFORME DOS GATITOS — o prêmio do fim da lição 3 (pedido do Renan).
 *
 *   1. as sete peças existem, são prêmio (sem preço) e cada uma veste na vaga
 *      dela com a geometria no pai certo (boné na cabeça, camiseta e jaquetona
 *      no corpo com a manga no braço, short no quadril e na perna, calça e
 *      tênis na perna); o tênis SUBSTITUI o pé (a caixa some);
 *   2. três combinações nos dois, de frente, de costas, andando e sentados no
 *      banco, e fotos de perto: o boné, a jaquetona de costas, o tênis;
 *   3. o boneco do guarda-roupa vestido com o uniforme;
 *   4. A AULA: concluir a lição 3 na Sala 1 faz o Gatito entregar o uniforme,
 *      e as sete peças vão para o guarda-roupa dos DOIS — uma vez só;
 *   5. save antigo: quem já tinha concluído a lição 3 ganha o uniforme ao abrir
 *      o guarda-roupa.
 *
 *   node scripts/uniforme.mjs /tmp/un
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/un';
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
const ouvir = (p) => {
  p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT|favicon|fonts\.g/.test(m.text())) erros.push(m.text()); });
};
const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 2 });
ouvir(page);

const PECAS = {
  'bone-dos-gatitos': 'cabeca',
  'camiseta-dos-gatitos': 'corpo',
  'camiseta-larga-dos-gatitos': 'corpo',
  'jaquetona-dos-gatitos': 'corpo',
  'short-dos-gatitos': 'perna',
  'calca-dos-gatitos': 'perna',
  'tenis-dos-gatitos': 'perna',
};
const IDS = Object.keys(PECAS);

await page.goto(`${BASE}/?cena=villa-lobos&em=-4,20&olhar=3.14`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=villa-lobos&em=-4.2,15.6&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
await page.waitForTimeout(600);
await page.mouse.click(500, 400);

// ============================================= 1. as fichas
console.log('\n1. as fichas');
const fichas = await page.evaluate((ids) => ids.map((id) => {
  const f = window.aristoryItens[id];
  return { id, existe: !!f, preco: f?.preco, extra: typeof f?.extra === 'function' };
}), IDS);
ok(fichas.every((f) => f.existe && f.extra), 'as sete peças existem e têm geometria');
ok(fichas.every((f) => f.preco === undefined), 'nenhuma está à venda: são prêmio');

/** onde cada peça pendurou, em cada um */
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
    r[rig.spec.id] = {
      pais: Object.fromEntries(Object.entries(pais).map(([k, v]) => [k, [...v]])),
      pe: rig.pes.map((p) => p.visible),
    };
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
  { nome: 'a', ari: ['bone-dos-gatitos', 'camiseta-dos-gatitos', 'short-dos-gatitos', 'tenis-dos-gatitos'], renan: ['jaquetona-dos-gatitos', 'calca-dos-gatitos', 'tenis-dos-gatitos', 'bone-dos-gatitos'] },
  { nome: 'b', ari: ['camiseta-larga-dos-gatitos', 'calca-dos-gatitos', 'tenis-dos-gatitos'], renan: ['camiseta-dos-gatitos', 'short-dos-gatitos', 'tenis-dos-gatitos'] },
  { nome: 'c', ari: ['jaquetona-dos-gatitos', 'short-dos-gatitos', 'tenis-dos-gatitos', 'bone-dos-gatitos'], renan: ['camiseta-larga-dos-gatitos', 'calca-dos-gatitos', 'bone-dos-gatitos'] },
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
const sentado = () => page.evaluate(() => !!(window.jogo.player.riding || window.jogo.player.rig.sitting));
const levantar = async () => {
  await passarFalas('last');
  await page.waitForTimeout(900);
  ok(!(await sentado()), 'levantou do banco');
};
/** a câmera colada num ponto (a cabeça, o pé), longe da zona da roda gigante */
const dePerto = async (quem, altura, zoom, nome) => {
  const alvo = await page.evaluate(([quem, altura, zoom]) => {
    const j = window.jogo;
    const pessoa = quem === 'ari' ? j.player : j.parceiro;
    const foco = new pessoa.rig.group.constructor();
    pessoa.rig.group.getWorldPosition(foco.position);
    foco.position.y += altura;
    j.current.world.root.add(foco);
    j.focusCamera(foco);
    j.setZoom(zoom);
    window.__foco = foco;
  }, [quem, altura, zoom]);
  void alvo;
  await page.waitForTimeout(1600);
  // o zoom do jogo tem piso: a foto é RECORTADA em volta do ponto, na tela
  const c = await page.evaluate(() => {
    const p = window.__foco.position.clone().project(window.jogo.iso.camera);
    return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight };
  });
  await page.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: Math.max(0, c.x - 150), y: Math.max(0, c.y - 125), width: 300, height: 250 } });
  await page.evaluate(() => { window.jogo.focusCamera(null); window.__foco.removeFromParent(); });
};

const vistos = new Map();
let peSumiu = true;
if (!SO || SO.includes('fotos') || SO.includes('perto')) {
  console.log('\n2. as combinações');
  for (const c of (SO.includes('perto') ? [] : COMBINACOES)) {
    await levantar();
    await vestir(c.ari, c.renan);
    await page.waitForTimeout(300);
    const r = await onde();
    for (const [quem, ids] of [['ari', c.ari], ['renan', c.renan]]) {
      for (const id of ids) if (r[quem].pais[id]) vistos.set(id, r[quem].pais[id]);
      const deTenis = ids.includes('tenis-dos-gatitos');
      if (deTenis && r[quem].pe.some((v) => v)) peSumiu = false;
      if (!deTenis && r[quem].pe.some((v) => !v)) peSumiu = false;
    }
    await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0); window.jogo.setZoom(1.1); });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}-${c.nome}-frente.png` });
    await page.evaluate(() => window.jogo.debugPlace(-4.2, 15.6, Math.PI));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}-${c.nome}-costas.png` });
    await page.evaluate(() => window.jogo.setZoom(1.8));
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${OUT}-${c.nome}-andando.png` });
    await page.keyboard.up('KeyD');
    // sentados no banco: a perna a ~90°, onde short, calça e jaquetona mais escapam
    await page.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, Math.PI); window.jogo.setZoom(1.5); });
    await page.waitForTimeout(400);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(1200);
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
  if (!SO.includes('perto')) {
  const errados = IDS.filter((id) => !(vistos.get(id) ?? []).includes(PECAS[id]));
  ok(errados.length === 0, `cada peça nasce no pai certo (erradas: ${errados.join(', ') || 'nenhuma'})`);
  ok((vistos.get('camiseta-dos-gatitos') ?? []).includes('braco') && (vistos.get('jaquetona-dos-gatitos') ?? []).includes('braco')
    && (vistos.get('camiseta-larga-dos-gatitos') ?? []).includes('braco'), 'as mangas das camisetas e da jaquetona vão no braço');
  ok((vistos.get('short-dos-gatitos') ?? []).includes('corpo'), 'o cós do short vai no quadril (corpo)');
  ok(peSumiu, 'de tênis, a caixa do pé some; sem ele, o pé volta');
  }

  // DE PERTO, no ginásio da escola: piso aberto, sem zona de câmera nem
  // árvore no caminho
  await page.goto(`${BASE}/?cena=escola-ginasio&em=5,6&olhar=0.35`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await page.waitForTimeout(800);
  const posar = (olhar) => page.evaluate((olhar) => window.jogo.debugPlace(5, 6, olhar), olhar);
  await vestir(['bone-dos-gatitos', 'jaquetona-dos-gatitos', 'calca-dos-gatitos', 'tenis-dos-gatitos'],
    ['bone-dos-gatitos', 'camiseta-dos-gatitos', 'short-dos-gatitos', 'tenis-dos-gatitos']);
  await posar(Math.PI / 4);
  await page.waitForTimeout(800);
  await dePerto('ari', 1.45, 0.55, 'bone-ari');
  await dePerto('renan', 1.45, 0.55, 'bone-renan');
  await dePerto('ari', 0.85, 0.75, 'jaquetona-frente');
  await dePerto('renan', 0.85, 0.75, 'camiseta-frente');
  await dePerto('ari', 0.08, 0.4, 'tenis');
  await dePerto('renan', 0.35, 0.6, 'short');
  await posar(-3 * Math.PI / 4);
  await page.waitForTimeout(800);
  await dePerto('ari', 0.85, 0.75, 'jaquetona-costas');
  await dePerto('renan', 0.85, 0.75, 'camiseta-costas');
  await dePerto('ari', 0.08, 0.4, 'tenis-costas');
  await dePerto('ari', 1.45, 0.55, 'bone-costas');
  await vestir(['camiseta-larga-dos-gatitos', 'calca-dos-gatitos', 'tenis-dos-gatitos'], ['camiseta-larga-dos-gatitos', 'short-dos-gatitos']);
  await posar(Math.PI / 4);
  await page.waitForTimeout(800);
  await dePerto('ari', 0.85, 0.75, 'larga-frente');
  await dePerto('ari', 0.3, 0.6, 'calca');
  await posar(-3 * Math.PI / 4);
  await page.waitForTimeout(800);
  await dePerto('ari', 0.85, 0.75, 'larga-costas');
  await page.evaluate(() => window.jogo.setZoom(13));
}

// ============================================= 3. o boneco do guarda-roupa
if (!SO || SO.includes('painel')) {
  console.log('\n3. o boneco do guarda-roupa');
  await page.evaluate(() => {
    const j = window.jogo;
    for (const p of Object.values(window.aristoryItens).filter((i) => i.id.endsWith('-dos-gatitos'))) j.ganharPeca(p);
  });
  await vestir(['bone-dos-gatitos', 'jaquetona-dos-gatitos', 'calca-dos-gatitos', 'tenis-dos-gatitos'], []);
  await page.evaluate(() => window.jogo.abrirGuardaRoupa());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-painel.png` });
  const noArmario = await page.evaluate(() => [...document.querySelectorAll('.armario')].map((e) => e.textContent).join(' '));
  ok(/Camiseta larga dos Gatitos/.test(noArmario) && /Short dos Gatitos/.test(noArmario), 'o painel lista as peças do uniforme');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

// ============================================= 4. a aula: o Gatito entrega
if (!SO || SO.includes('aula')) {
  console.log('\n4. a aula da lição 3');
  const pa = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  ouvir(pa);
  await pa.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  await pa.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await pa.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  await pa.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await pa.evaluate(() => {
    const j = window.jogo;
    for (const f of ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'jean-luc-batido']) j.setFlag(f);
    j.save.abrirLicao('oi-tudo-bem');
    j.save.concluirLicao('oi-tudo-bem', 3);
    j.save.abrirLicao('jantar-das-confusoes');
    j.save.concluirLicao('jantar-das-confusoes', 3);
    j.setFlag('aula-chamada');
  });
  // a sala se monta pelo save: entra de novo
  await pa.reload({ waitUntil: 'networkidle' });
  await pa.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await pa.waitForTimeout(1500);
  const antes = await pa.evaluate(() => window.jogo.wardrobeItems('ari').filter((i) => i.id.endsWith('-dos-gatitos')).length);
  ok(antes === 0, 'antes da lição 3, nenhuma peça do uniforme no guarda-roupa');
  // o livro é trocado por um que conclui a lição na hora (o scripts/aula.mjs
  // responde a apostila de verdade; aqui o que importa é o que vem depois)
  await pa.evaluate(() => {
    const j = window.jogo;
    j.abrirApostila = async (o = {}) => {
      if (o.licao) {
        j.save.abrirLicao(o.licao);
        j.save.concluirLicao(o.licao, 3);
        return { concluidas: [{ id: o.licao, estrelas: 3 }] };
      }
      return { concluidas: [] };
    };
  });
  await pa.evaluate(() => window.jogo.debugPlace(-0.15, 0.55, Math.PI));
  for (let i = 0; i < 24; i++) {
    const t = await pa.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? '');
    if (/aula/.test(t)) break;
    await pa.waitForTimeout(250);
  }
  await pa.keyboard.press('KeyE');
  await pa.waitForTimeout(600);
  const falas = [];
  let fotoDaEntrega = false;
  for (let i = 0; i < 80; i++) {
    if (!(await pa.locator('.dialogue.show').count())) {
      let voltou = false;
      for (let j = 0; j < 30 && !voltou; j++) {
        await pa.waitForTimeout(400);
        voltou = (await pa.locator('.dialogue.show').count()) > 0;
      }
      if (!voltou) break;
      continue;
    }
    await pa.waitForTimeout(550);
    const quem = await pa.evaluate(() => document.querySelector('.dialogue .who')?.textContent ?? '');
    const t = await pa.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (t && !falas.includes(`${quem}: ${t}`)) falas.push(`${quem}: ${t}`);
    if (!fotoDaEntrega && /uniforme dos Gatitos/.test(t)) {
      fotoDaEntrega = true;
      await pa.screenshot({ path: `${OUT}-entrega.png` });
    }
    await pa.keyboard.press('KeyE');
    await pa.waitForTimeout(200);
  }
  const completas = falas.filter((f, i) => !falas.slice(i + 1).some((g) => g.startsWith(f)));
  console.log('      ' + completas.slice(-9).join('\n      '));
  ok(completas.some((f) => /Por completar esta aula, vocês ganham o uniforme dos Gatitos/.test(f)), 'o Gatito diz que a aula dá o uniforme');
  ok(completas.some((f) => /^Sol: ¡EL UNIFORME!/.test(f)), 'a Sol comemora');
  const depois = await pa.evaluate(() => {
    const j = window.jogo;
    const ids = (quem) => j.wardrobeItems(quem).map((i) => i.id).filter((id) => id.endsWith('-dos-gatitos'));
    return { ari: ids('ari'), renan: ids('renan'), premios: j.save.premios.filter((id) => id.endsWith('-dos-gatitos')) };
  });
  ok(depois.ari.length === 7 && depois.renan.length === 7, `as sete peças no guarda-roupa dos dois (${depois.ari.length} e ${depois.renan.length})`);
  ok(depois.premios.length === 7, 'e anotadas como prêmio no save');
  // uma vez só: sentar de novo não repete a entrega
  const flag = await pa.evaluate(() => window.jogo.flag('premio-da-licao-cade-o-novelo'));
  ok(flag, 'a entrega fica marcada (não se repete)');
  await pa.close();
}

// ============================================= 5. save antigo
if (!SO || SO.includes('antigo')) {
  console.log('\n5. save antigo');
  const pv = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  ouvir(pv);
  await pv.goto(`${BASE}/?cena=casa`, { waitUntil: 'networkidle' });
  await pv.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await pv.goto(`${BASE}/?cena=casa`, { waitUntil: 'networkidle' });
  await pv.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  const r = await pv.evaluate(() => {
    const j = window.jogo;
    for (const id of ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo']) {
      j.save.abrirLicao(id);
      j.save.concluirLicao(id, 2);
    }
    const antes = j.wardrobeItems('ari').filter((i) => i.id.endsWith('-dos-gatitos')).length;
    j.abrirGuardaRoupa();
    const depois = j.wardrobeItems('renan').filter((i) => i.id.endsWith('-dos-gatitos')).length;
    return { antes, depois };
  });
  ok(r.antes === 0 && r.depois === 7, `quem já tinha a lição 3 ganha o uniforme ao abrir o guarda-roupa (${r.antes} → ${r.depois})`);
  await pv.close();
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'console limpo');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
