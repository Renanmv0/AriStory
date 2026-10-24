/**
 * O ATELIÊ DE TINGIMENTO da Estella (mezanino da boutique): a regra, o motor,
 * o menu e o balcão.
 *
 * O que o teste guarda:
 * 1. TODA peça que o ateliê oferece responde à tinta: vestida no corpo, pintar
 *    a cor principal muda alguma coisa no modelo (cor de material ou estampa
 *    de canvas), e pintar o detalhe também, quando a peça tem detalhe. Peça
 *    nova que crava a cor por dentro da geometria cai aqui;
 * 2. prêmio de personagem e uniforme NÃO aparecem (decisão do Renan);
 * 3. a cor principal pintada não mexe no detalhe (o babado do vestido
 *    continua da cor dele);
 * 4. a tinta é POR PESSOA: a calça do Ari pintada não pinta a do Renan;
 * 5. o desbloqueio: R$ 50, uma vez só — trancado mostra o cartaz, sem saldo
 *    o botão diz quanto falta, pagando abre, e não cobra de novo;
 * 6. o menu: escolher, pintar, detalhes, cor original, vestir; a lista não
 *    pula para o topo ao pintar;
 * 7. o save: recarregar a página e a peça continua pintada no corpo;
 * 8. o balcão no mezanino: o prompt "Tingir roupas", a Estella apresenta na
 *    primeira vez e o painel abre no modo ateliê; fotos de perto.
 *
 * Uso: node scripts/tinta.mjs /caminho/prefixo
 */
import { chromium, devices } from 'playwright';

const OUT = process.argv[2] ?? './tinta';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const problemas = [];
const ok = (cond, msg) => {
  console.log(`  ${cond ? 'ok  ' : 'FALHOU'} ${msg}`);
  if (!cond) problemas.push(msg);
};
const j = (fn, arg) => page.evaluate(fn, arg);

const limpo = async (cena = 'quarto') => {
  await page.goto(`${BASE}/?cena=${cena}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await j(() => localStorage.removeItem('aristory.save.v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
};
await limpo();

// ================================================ 1. toda peça responde
console.log('\n1. cada peça que o ateliê oferece muda de cor no corpo');
const auditoria = await j(() => {
  const T = window.aristoryTintas;
  const rig = window.jogo.player.rig;
  const foto = () => {
    const o = [];
    rig.group.traverse((m) => {
      if (!m.isMesh || !m.visible) return;
      for (const mt of [m.material].flat()) if (mt) o.push(`${mt.color?.getHex()}:${mt.map?.uuid ?? ''}`);
    });
    return o;
  };
  const mudou = (a, b) => a.length !== b.length || a.some((x, i) => x !== b[i]);
  const r = { total: 0, comDetalhe: 0, semPrincipal: [], semDetalhe: [], ofereceSemTinta: [] };
  for (const it of Object.values(window.aristoryItens)) {
    if (!T.podeTingir(it)) continue;
    r.total++;
    const l = { [it.slot]: it.id };
    rig.vestirRoupa({});
    rig.vestirRoupa(l, {});
    const a = foto();
    rig.vestirRoupa(l, { [it.id]: { cor: 0xff00ff } });
    if (!mudou(a, foto())) r.semPrincipal.push(it.id);
    if (T.temDetalhe(it)) {
      r.comDetalhe++;
      rig.vestirRoupa(l, { [it.id]: { detalhe: 0x00ff00 } });
      if (!mudou(a, foto())) r.semDetalhe.push(it.id);
    }
    rig.vestirRoupa({});
  }
  return r;
});
console.log(`   ${auditoria.total} peças, ${auditoria.comDetalhe} com detalhe`);
ok(auditoria.total >= 100, `o ateliê oferece bastante roupa (${auditoria.total})`);
ok(auditoria.semPrincipal.length === 0, `toda cor principal pinta (${auditoria.semPrincipal.join(', ') || 'todas'})`);
ok(auditoria.semDetalhe.length === 0, `todo detalhe oferecido pinta (${auditoria.semDetalhe.join(', ') || 'todos'})`);

// ================================================ 2. prêmios e uniformes ficam
console.log('\n2. prêmio de personagem e uniforme não se pintam');
const fixos = await j(() => {
  const T = window.aristoryTintas;
  const I = window.aristoryItens;
  return ['jaqueta-jean-luc', 'quepe-cookie', 'blazer-xadrez', 'gravata-do-walter', 'colete-de-garcom',
    'camiseta-dos-gatitos', 'jaquetona-dos-gatitos', 'uniforme-de-torcida', 'chapeu-de-jardineira', 'tiara-do-walter']
    .filter((id) => I[id])
    .map((id) => [id, T.podeTingir(I[id])]);
});
ok(fixos.length >= 8 && fixos.every(([, pode]) => !pode), `nenhum fica no ateliê (${fixos.filter(([, p]) => p).map(([id]) => id).join(', ') || 'ok'})`);

// ================================================ 2b. os acessórios também se pintam
console.log('\n2b. acessórios miúdos se pintam (pedido do Ari), e a mochila de casco é acessório');
const acessorios = await j(() => {
  const T = window.aristoryTintas;
  const I = window.aristoryItens;
  const ids = ['pin-de-margarida', 'pin-de-joaninha', 'pin-de-abelhinha', 'pin-de-borboleta',
    'oculos-escuros', 'oculos-redondo', 'oculos-gatinho', 'oculos-de-coracao', 'oculos-espelhado', 'oculos-de-natacao',
    'pulseira-de-flores', 'pulseira-de-pedrinhas', 'colar-havaiano', 'tiara-de-conchinhas', 'mochila-casco', 'mochila-do-renan'];
  const mochila = I['mochila-casco'];
  return {
    fora: ids.filter((id) => !I[id] || !T.podeTingir(I[id]) || !T.temDetalhe(I[id])),
    mochila: { slot: mochila.slot, presoEm: mochila.presoEm, nasCostas: mochila.nasCostas },
  };
});
ok(acessorios.fora.length === 0, `pins, óculos, pulseiras, colar, tiara e mochila têm cor e detalhe no ateliê (${acessorios.fora.join(', ') || 'todos'})`);
ok(acessorios.mochila.slot === 'acessorio' && acessorios.mochila.presoEm === 'corpo' && acessorios.mochila.nasCostas,
  `a mochila de casco é acessório nas costas (${JSON.stringify(acessorios.mochila)})`);
const comVestido = await j(() => {
  const g = window.jogo;
  const I = window.aristoryItens;
  const rig = [g.player, g.parceiro].find((q) => q.rig.spec.jacket !== undefined).rig;
  // o capuz do moletom do Renan: com uma mochila nas costas ele some
  // (o grupo `capuz` do moletom, visível de verdade: ele e todos os pais)
  const capuz = () => {
    const c = rig.group.getObjectByName('capuz');
    if (!c) return 0;
    for (let o = c; o; o = o.parent) if (!o.visible) return 0;
    return 1;
  };
  // o ponto da mochila mais perto das costas (z do corpo): o corpo, as alças
  // subindo e o fundo, tudo o que fica atrás na largura do tronco
  const R = rig.spec.height * 0.105 * rig.medidas.w;
  const encosto = (id) => {
    // sem `THREE` na página: um Vector3 de empréstimo
    const v = rig.body.position.clone();
    let maisPerto = -Infinity;
    rig.group.updateMatrixWorld(true);
    for (const obj of rig.body.children.filter((c) => c.userData.roupa === id)) {
      obj.traverse((o) => {
        if (!o.isMesh) return;
        const pos = o.geometry.getAttribute('position');
        for (let k = 0; k < pos.count; k++) {
          rig.body.worldToLocal(o.localToWorld(v.fromBufferAttribute(pos, k)));
          // a folga até as costas do moletom NAQUELE x (o cilindro de raio
          // 1,08·R achatado em 0,84): negativa = por dentro do moletom
          const RJ = R * 1.08;
          if (Math.abs(v.x) < RJ && v.z < 0 && v.y > rig.medidas.legH + rig.medidas.torsoH * 0.25 && v.y < rig.medidas.legH + rig.medidas.torsoH * 0.88) {
            const costas = -0.84 * Math.sqrt(RJ * RJ - v.x * v.x);
            maisPerto = Math.max(maisPerto, v.z - costas);
          }
        }
      });
    }
    return maisPerto;
  };
  rig.vestirRoupa({});
  const semNada = { capuz: capuz(), mochilaDaFicha: rig.spec.accessories?.includes('mochila') ?? false };
  const r = { semNada };
  for (const id of ['mochila-casco', 'mochila-do-renan']) {
    rig.vestirRoupa({ acessorio: id }, {});
    r[id] = { capuz: capuz(), encosto: encosto(id) };
  }
  // e vai com qualquer roupa de tronco: o vestido continua, o casco também
  rig.vestirRoupa({ acessorio: 'mochila-casco', tronco: 'vestido-rosa' }, {});
  const vestidos = new Set();
  rig.group.traverse((o) => { if (o.userData.roupa) vestidos.add(o.userData.roupa); });
  rig.vestirRoupa({});
  return { ...r, vestidos: [...vestidos], existe: !!I['vestido-rosa'] };
});
ok(!comVestido.semNada.mochilaDaFicha && comVestido.semNada.capuz > 0, `o Renan padrão: moletom com capuz e sem mochila na ficha (${JSON.stringify(comVestido.semNada)})`);
for (const id of ['mochila-casco', 'mochila-do-renan']) {
  const m = comVestido[id];
  ok(m.capuz === 0, `com a ${id} o capuz some (${m.capuz})`);
  ok(m.encosto <= 1e-3, `a ${id} fica por fora do moletom (o ponto mais para dentro está ${(-m.encosto * 100).toFixed(1)} cm fora das costas dele)`);
  // e encostada: o capuz (que some) já empurrou a mochila 6 cm para trás
  ok(m.encosto > -0.03, `a ${id} encosta no moletom, sem vão (${(-m.encosto * 100).toFixed(1)} cm)`);
}
ok(comVestido.vestidos.includes('mochila-casco') && comVestido.vestidos.includes('vestido-rosa'), `a mochila veste junto com o vestido (${comVestido.vestidos.join(', ')})`);

// ================================================ 3. o principal não mexe no detalhe
console.log('\n3. pintar a cor principal deixa o detalhe como era');
const detalheFica = await j(() => {
  const I = window.aristoryItens;
  const rig = window.jogo.player.rig;
  const cores = () => {
    const s = new Set();
    rig.group.traverse((m) => { if (m.isMesh && m.visible) for (const mt of [m.material].flat()) if (mt?.color) s.add(mt.color.getHex()); });
    return s;
  };
  const v = I['vestido-noite'];
  rig.vestirRoupa({});
  rig.vestirRoupa({ tronco: v.id }, { [v.id]: { cor: 0x3f9f8f } });
  const c = cores();
  rig.vestirRoupa({});
  return { temOriginal: c.has(v.corDetalhe), temNova: c.has(0x3f9f8f), sumiuAntiga: !c.has(v.cor) };
});
ok(detalheFica.temNova && detalheFica.sumiuAntiga, 'o vestido azul-noite fica verde (e o azul sai)');
ok(detalheFica.temOriginal, 'o babado continua da cor dele');

// ================================================ 5. o desbloqueio
console.log('\n5. o ateliê se paga uma vez só');
await j(() => {
  const g = window.jogo;
  for (const id of ['calca-jeans', 'vestido-noite', 'blazer-xadrez', 'camiseta-de-joaninha', 'gorro-la', 'saia-plissada']) g.storeItem(window.aristoryItens[id], g.playerId());
  g.ganhar(30);
  g.abrirAtelie();
});
await page.waitForTimeout(700);
const trancado = await j(() => ({
  cartaz: !document.querySelector('.atelie-cartaz').hidden,
  pecas: !document.querySelector('.atelie-pecas').hidden,
  botao: document.querySelector('.atelie-ficha .desbloquear')?.textContent,
  desabilitado: document.querySelector('.atelie-ficha .desbloquear')?.disabled,
  titulo: document.querySelector('.armario .titulo').textContent,
}));
ok(trancado.titulo === 'Ateliê de tingimento', `o painel abre com o nome do ateliê (${trancado.titulo})`);
ok(trancado.cartaz && !trancado.pecas, 'trancado: a lista é o cartaz, sem as peças');
ok(trancado.desabilitado && /Faltam R\$ 20/.test(trancado.botao ?? ''), `com R$ 30 o botão diz quanto falta (${trancado.botao})`);
await page.screenshot({ path: `${OUT}-1-trancado.png` });
await j(() => { window.jogo.ganhar(40); window.jogo.ui.fecharArmario(); window.jogo.abrirAtelie(); });
await page.waitForTimeout(500);
await page.locator('.atelie-ficha .desbloquear').click();
await page.waitForTimeout(700);
const pago = await j(() => ({ saldo: window.jogo.carteira(), aberto: !document.querySelector('.atelie-pecas').hidden }));
ok(pago.saldo === 20 && pago.aberto, `pagou R$ 50 (sobraram ${pago.saldo}) e a lista de peças abriu`);
await j(() => { window.jogo.ui.fecharArmario(); window.jogo.abrirAtelie(); });
await page.waitForTimeout(500);
const deNovo = await j(() => ({ saldo: window.jogo.carteira(), botao: !!document.querySelector('.atelie-ficha .desbloquear') }));
ok(deNovo.saldo === 20 && !deNovo.botao, 'reabrir não cobra de novo');
const lista = await j(() => [...document.querySelectorAll('.atelie-pecas .peca-tingivel')].map((b) => b.dataset.id));
ok(lista.includes('calca-jeans') && lista.includes('vestido-noite'), `a lista tem as roupas da pessoa (${lista.length})`);
await page.screenshot({ path: `${OUT}-2-pecas.png` });

// ================================================ 6. o menu
console.log('\n6. escolher, pintar, os detalhes, a cor original e vestir');
await page.locator('.atelie-pecas .peca-tingivel[data-id="vestido-noite"]').click();
await page.waitForTimeout(600);
const escolhido = await j(() => ({
  cartela: !document.querySelector('.atelie-cartela').hidden,
  tintas: document.querySelectorAll('.atelie-cartela .familia .tinta').length,
  partes: [...document.querySelectorAll('.atelie-ficha [data-parte-da-tinta]')].map((b) => b.dataset.parteDaTinta),
}));
ok(escolhido.cartela && escolhido.tintas >= 55, `a cartela abre com ${escolhido.tintas} tintas`);
ok(escolhido.partes.join() === 'cor,detalhe', `o vestido tem cor principal e detalhes (${escolhido.partes})`);
// a cartela rolada até o meio: pintar não pode mandar para o topo
await j(() => { document.querySelector('.armario .lista').scrollTop = 500; });
await page.waitForTimeout(200);
const antesDaTinta = await j(() => document.querySelector('.armario .lista').scrollTop);
await page.locator('.atelie-cartela .tinta[data-tinta="verdeAgua"]').click();
await page.waitForTimeout(600);
const depoisDaTinta = await j(() => document.querySelector('.armario .lista').scrollTop);
ok(antesDaTinta > 300 && Math.abs(depoisDaTinta - antesDaTinta) <= 2, `pintar não sobe a cartela (${antesDaTinta} → ${depoisDaTinta})`);
await page.locator('.atelie-ficha [data-parte-da-tinta="detalhe"]').click();
await page.waitForTimeout(300);
await page.locator('.atelie-cartela .tinta[data-tinta="amareloSol"]').click();
await page.waitForTimeout(600);
const tintasAri = await j(() => window.jogo.save.tintasDe('ari'));
ok(tintasAri['vestido-noite']?.cor === 0x7fd3c3 && tintasAri['vestido-noite']?.detalhe === 0xf7cf3c, 'o save guarda a cor principal e o detalhe do vestido');
const marcada = await j(() => document.querySelector('.atelie-cartela .tinta.atual')?.dataset.tinta);
ok(marcada === 'amareloSol', `a cartela marca a tinta da parte escolhida (${marcada})`);
await page.screenshot({ path: `${OUT}-3-pintado.png` });
// a cor original desta parte
await page.locator('.atelie-ficha .original').click();
await page.waitForTimeout(500);
const voltou = await j(() => window.jogo.save.tintasDe('ari')['vestido-noite']);
ok(voltou?.detalhe === undefined && voltou?.cor === 0x7fd3c3, 'a cor original volta só o detalhe');
await page.locator('.atelie-cartela .tinta[data-tinta="amareloSol"]').click();
await page.waitForTimeout(400);
// vestir pelo ateliê
await page.locator('.atelie-ficha .vestir-agora').click();
await page.waitForTimeout(700);
const vestido = await j(() => ({
  vestindo: window.jogo.wearables('ari').some((i) => i?.id === 'vestido-noite'),
  cores: (() => { const s = new Set(); window.jogo.player.rig.group.traverse((m) => { if (m.isMesh && m.visible) for (const mt of [m.material].flat()) if (mt?.color) s.add(mt.color.getHex()); }); return s.has(0x7fd3c3) && s.has(0xf7cf3c); })(),
}));
ok(vestido.vestindo && vestido.cores, 'vestir no ateliê põe o vestido pintado no corpo da Ari de verdade');

// ================================================ 4. por pessoa
console.log('\n4. a tinta é de cada um');
await page.locator('.atelie-ficha .outra-peca').click();
await page.waitForTimeout(400);
await page.locator('.atelie-pecas .peca-tingivel[data-id="calca-jeans"]').click();
await page.waitForTimeout(400);
await page.locator('.atelie-cartela .tinta[data-tinta="vinho"]').click();
await page.waitForTimeout(500);
await page.locator('.armario .quem button:not(.ativo)').click();
await page.waitForTimeout(1200);
const doRenan = await j(() => ({
  quem: window.jogo.playerId(),
  tintas: window.jogo.save.tintasDe('renan'),
  aberto: window.jogo.ui.armarioEhAtelie,
}));
ok(doRenan.quem === 'renan' && doRenan.aberto, 'o botão do nome troca para o Renan sem fechar o ateliê');
ok(Object.keys(doRenan.tintas).length === 0, 'as roupas do Renan continuam sem tinta');
await page.screenshot({ path: `${OUT}-4-renan.png` });
await j(() => window.jogo.ui.fecharArmario());

// ================================================ 7. o save
console.log('\n7. recarregar e a peça continua pintada');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const depoisDoF5 = await j(() => {
  const g = window.jogo;
  // o corpo do Ari pode ser o do jogador ou o do parceiro, conforme quem ficou no comando
  const rig = g.player.rig.spec.id === 'ari' ? g.player.rig : g.parceiro.rig;
  const s = new Set();
  rig.group.traverse((m) => { if (m.isMesh && m.visible) for (const mt of [m.material].flat()) if (mt?.color) s.add(mt.color.getHex()); });
  return { tinta: g.save.tintasDe('ari')['vestido-noite'], noCorpo: s.has(0x7fd3c3), flag: g.save.flag('atelie-de-tinta') };
});
ok(depoisDoF5.flag && depoisDoF5.tinta?.cor === 0x7fd3c3 && depoisDoF5.noCorpo, 'o ateliê pago e o vestido verde-água continuam depois do F5');

// ================================================ 8. o balcão no mezanino
console.log('\n8. o balcão de tingimento no mezanino');
await page.goto(`${BASE}/?cena=lojinha`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
// sobe de verdade pela escada (o mezanino só existe depois da viagem)
await j(() => window.jogo.debugPlace(2.0, -3.4, Math.PI));
await page.waitForTimeout(1200);
await page.keyboard.press('KeyE');
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(600);
  if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
}
for (let t0 = Date.now(); Date.now() - t0 < 90000;) {
  const [y, travado] = await j(() => [window.jogo.playerPosition().y, window.jogo.input?.blocked]);
  if (y > 3.5 && !travado) break;
  await page.waitForTimeout(800);
}
const peca = await j(() => {
  let achou = null;
  window.jogo.scene.traverse((o) => { if (!achou && o.userData?.peca === 'balcao-de-tingimento') achou = o; });
  if (!achou) return null;
  let potes = 0;
  achou.traverse((o) => { if (o.isInstancedMesh) potes += o.count; });
  return { visivel: achou.visible && achou.parent?.visible !== false, instancias: potes };
});
ok(peca !== null, 'o balcão de tingimento está no mezanino');
ok((peca?.instancias ?? 0) > 60, `potes, etiquetas, carretéis e bandeirolas em lote (${peca?.instancias} cópias)`);
await j(() => {
  const g = window.jogo;
  g.player.teleport(-4.95, 1.25, -Math.PI / 2, 3.9);
  g.parceiro.teleport(-4.85, 0.35, -Math.PI / 2 - 0.4, 3.9);
  g.iso.snapTo(g.player.chest);
  g.setZoom(4.2);
});
await page.waitForTimeout(1800);
const prompt = await j(() => document.querySelector('.prompt.show .label')?.textContent ?? null);
ok(prompt === 'Tingir roupas', `na frente do balcão, o prompt é "Tingir roupas" (${prompt})`);
await page.screenshot({ path: `${OUT}-5-balcao.png` });
await page.keyboard.press('KeyE');
const falas = [];
for (let i = 0; i < 12 && !(await j(() => window.jogo.ui.armarioOpen)); i++) {
  await page.waitForTimeout(500);
  const quem = await j(() => document.querySelector('.dialogue.show .who')?.textContent ?? null);
  if (quem) {
    falas.push(quem);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(200);
    await page.keyboard.press('KeyE');
  }
}
await page.waitForTimeout(800);
const abriu = await j(() => ({ aberto: window.jogo.ui.armarioOpen, atelie: window.jogo.ui.armarioEhAtelie }));
ok(falas.includes('Estella'), `a Estella apresenta o ateliê na primeira vez (${[...new Set(falas)]})`);
ok(abriu.aberto && abriu.atelie, 'e o painel abre no modo ateliê');
await page.screenshot({ path: `${OUT}-6-menu-na-loja.png` });
await j(() => window.jogo.ui.fecharArmario());
await page.waitForTimeout(400);
// o balcão girado: a câmera de outro lado
await page.keyboard.press('KeyQ');
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-7-balcao-girado.png` });

// ================================================ o celular
console.log('\n9. no celular em pé');
const cel = await (await browser.newContext(devices['iPhone 13'])).newPage();
cel.on('pageerror', (e) => erros.push('CEL PAGEERROR: ' + e.message));
await cel.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await cel.waitForTimeout(2500);
await cel.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await cel.reload({ waitUntil: 'networkidle' });
await cel.waitForTimeout(3000);
await cel.evaluate(() => {
  const g = window.jogo;
  for (const id of ['calca-jeans', 'vestido-noite', 'gorro-la', 'saia-plissada']) g.storeItem(window.aristoryItens[id], g.playerId());
  g.ganhar(50);
  g.abrirAtelie();
});
await cel.waitForTimeout(700);
await cel.screenshot({ path: `${OUT}-cel-1-trancado.png` });
await cel.locator('.atelie-ficha .desbloquear').tap();
await cel.waitForTimeout(600);
await cel.locator('.atelie-pecas .peca-tingivel[data-id="saia-plissada"]').tap();
await cel.waitForTimeout(600);
await cel.locator('.atelie-cartela .tinta[data-tinta="celeste"]').tap();
await cel.waitForTimeout(700);
const noCel = await cel.evaluate(() => {
  const s = document.querySelector('.armario .sheet');
  const b = document.querySelector('.armario .moldura').getBoundingClientRect();
  return { vaza: s.scrollWidth > s.clientWidth + 1, boneco: b.height > 200 && b.top >= 0, tinta: window.jogo.save.tintasDe('ari')['saia-plissada']?.cor };
});
ok(!noCel.vaza, 'no celular, nada do ateliê vaza para o lado');
ok(noCel.boneco, 'o boneco fica à vista em cima, com a cartela embaixo');
ok(noCel.tinta === 0x5fa8e0, 'tocar na tinta pinta a saia no celular');
await cel.screenshot({ path: `${OUT}-cel-2-pintado.png` });

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
