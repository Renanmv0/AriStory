/**
 * O VESTIÁRIO DO CLUBE — um guarda-roupa com duas abas (pedido do Renan).
 *
 * O que este teste guarda, na ordem em que importa:
 *
 * 1. É O GUARDA-ROUPA: o mesmo painel, com o nome "Vestiário", as duas abas
 *    (Guarda-roupa e Roupas de piscina) e o boneco de traje de banho. Quem
 *    ainda não tem nada de piscina chega direto na vitrine. Trava o movimento.
 * 2. A VITRINE vende as peças de `MODA_PRAIA` por parte do corpo, cada uma a
 *    até R$ 20. Provar não gasta; sem dinheiro, o botão diz quanto falta.
 * 3. DESBLOQUEAR É COMPRAR: sai da carteira do casal e a peça vai para o
 *    guarda-roupa dos DOIS — e vira roupa de todo guarda-roupa (o do quarto
 *    também). Depois o mesmo botão veste e tira ali mesmo.
 * 4. A peça de piscina fica no corpo DENTRO do clube (a estampa da bermuda, o
 *    chinelo) e o óculos vai junto com o chapéu (óculos agora é acessório).
 * 5. Provar uma camiseta põe o boneco de roupa de rua; o botão volta ao banho.
 * 6. O T troca de pessoa com o painel aberto; o Escape fecha e solta.
 * 7. SAVE ANTIGO: o óculos que estava na vaga da cabeça muda para o
 *    acessório (e a presilha que estava lá vai para o guarda-roupa), e as
 *    peças que o vestiário antigo dava de graça continuam de quem tinha.
 * 8. O guarda-roupa de CASA continua sem abas.
 *
 * Uso: node scripts/vestiario.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './vestiario';
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
const page = await browser.newPage({ viewport: { width: 1000, height: 820 } });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });

const abrirCena = async (cena = 'clube', em = '15,-14') => {
  await page.goto(`${BASE}/?cena=${cena}&em=${em}&olhar=3.14`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await page.waitForTimeout(1500);
};
const passarFalas = async () => {
  for (let i = 0; i < 12; i++) {
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
  }
};
const j = (fn, arg) => page.evaluate(fn, arg);
const painel = () => j(() => {
  const a = document.querySelector('.armario');
  const ficha = a.querySelector('.ficha');
  return {
    aberto: a.classList.contains('show'),
    vestiario: a.classList.contains('modo-vestiario'),
    titulo: a.querySelector('.titulo').textContent,
    aba: a.classList.contains('aba-piscina') ? 'piscina' : 'vestir',
    produtos: a.querySelectorAll('.vitrine-piscina .produto').length,
    botao: ficha.querySelector('.agir').textContent,
    botaoLigado: !ficha.querySelector('.agir').disabled,
    aviso: ficha.querySelector('.aviso').textContent,
    traje: a.querySelector('.traje .ativo')?.dataset.traje ?? null,
    dono: a.querySelector('.dono').textContent,
    corpo: a.querySelector('.corpo').textContent,
  };
});
const clicarProduto = async (id) => {
  await page.locator(`.armario .vitrine-piscina .produto[data-id="${id}"]`).click();
  await page.waitForTimeout(350);
};
const agir = async () => {
  await page.locator('.armario .ficha .agir').click();
  await page.waitForTimeout(400);
};
const quemAnda = () => j(() => window.jogo.player.rig.spec.id);

// ============================================================ 1. abrir
await abrirCena();
await j(() => localStorage.removeItem('aristory.save.v1'));
await abrirCena();
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
await passarFalas();
await page.waitForTimeout(700);
let p = await painel();
ok(p.aberto && p.vestiario && p.titulo === 'Vestiário', `o vestiário é o guarda-roupa com outro nome ("${p.titulo}")`);
ok(p.aba === 'piscina', 'sem nada de piscina ainda, ele abre direto na aba de roupas de piscina');
ok(p.traje === 'banho', 'o boneco abre de traje de banho');
ok(await j(() => window.jogo.input.blocked), 'o painel trava o movimento');
const catalogo = await j(() => window.aristoryModaPraia.map((x) => ({ id: x.id, preco: x.preco })));
ok(p.produtos === catalogo.length && catalogo.length >= 28, `a vitrine mostra as ${catalogo.length} peças de piscina`);
ok(catalogo.every((x) => x.preco > 0 && x.preco <= 20), 'nenhuma passa de R$ 20');
const partes = await j(() => [...document.querySelectorAll('.armario .vitrine-piscina h4')].map((h) => h.textContent));
ok(partes.length === 6 && /Cabe/.test(partes[0]) && /Acess/.test(partes[5]), `a vitrine vem por parte do corpo (${partes.join(' · ')})`);
await page.screenshot({ path: `${OUT}-painel.png` });

// ============================================================ 2. sem dinheiro
const saldo0 = await j(() => window.jogo.carteira());
await j((s) => window.jogo.ganhar(-s), saldo0);
await clicarProduto('bermuda-havaiana');
p = await painel();
ok(!p.botaoLigado && /Faltam R\$ 18/.test(p.botao) && p.aviso.length > 0, `sem dinheiro: "${p.botao}" e o aviso`);

// ============================================================ 3. desbloquear
await j(() => window.jogo.ganhar(120));
await clicarProduto('bermuda-havaiana'); // tira a prova
await clicarProduto('bermuda-havaiana'); // e prova de novo, já com dinheiro
p = await painel();
ok(p.botaoLigado && p.botao === 'Desbloquear por R$ 18', `com dinheiro: "${p.botao}"`);
await page.screenshot({ path: `${OUT}-provando.png` });
await agir();
const dono1 = await quemAnda();
const outro1 = dono1 === 'ari' ? 'renan' : 'ari';
const depois = await j(([a, b]) => ({
  saldo: window.jogo.carteira(),
  doDono: window.jogo.wardrobeItems(a).some((i) => i.id === 'bermuda-havaiana'),
  doOutro: window.jogo.wardrobeItems(b).some((i) => i.id === 'bermuda-havaiana'),
}), [dono1, outro1]);
ok(depois.saldo === 102, `desbloquear cobrou R$ 18 (sobrou R$ ${depois.saldo})`);
ok(depois.doDono && depois.doOutro, 'a bermuda foi para o guarda-roupa dos dois');
p = await painel();
ok(p.botao === 'Vestir agora', `depois de desbloquear, o botão veste ("${p.botao}")`);
await agir();
const vestida = await j((q) => window.jogo.wearables(q).map((i) => i?.id ?? null), dono1);
ok(vestida[2] === 'bermuda-havaiana', 'e veste na hora, na vaga das pernas');
p = await painel();
ok(p.botao === 'Tirar', 'vestida, o botão tira');

// ============================================================ 4. no clube
// chapéu e óculos juntos, e o chinelo de piscina
for (const id of ['chapeu-de-praia', 'oculos-de-coracao', 'chinelo-florido']) {
  await clicarProduto(id);
  await agir(); // desbloqueia
  await agir(); // veste
}
const corpo = await j((q) => {
  const jg = window.jogo;
  const rig = jg.player.rig.spec.id === q ? jg.player.rig : jg.parceiro.rig;
  const vis = {};
  rig.group.traverse((o) => { if (o.userData.roupa) vis[o.userData.roupa] = (vis[o.userData.roupa] ?? true) && o.visible; });
  return { vis, vagas: jg.wearables(q).map((i) => i?.id ?? null) };
}, dono1);
ok(corpo.vagas[0] === 'chapeu-de-praia' && corpo.vagas[5] === 'oculos-de-coracao', `chapéu na cabeça e óculos no acessório, juntos (${corpo.vagas.join(', ')})`);
ok(corpo.vis['bermuda-havaiana'] && corpo.vis['chinelo-florido'] && corpo.vis['oculos-de-coracao'] && corpo.vis['chapeu-de-praia'],
  'no clube (traje de banho) a estampa, o chinelo, o óculos e o chapéu aparecem');
await page.screenshot({ path: `${OUT}-vestido.png` });

// ============================================================ 5. camiseta põe de rua
await clicarProduto('camisa-havaiana');
p = await painel();
ok(p.traje === 'normal', 'provar a camisa havaiana põe o boneco de roupa de rua (no clube é sem camiseta)');
await page.screenshot({ path: `${OUT}-camisa.png` });
await page.locator('.armario .traje [data-traje="banho"]').click();
await page.waitForTimeout(300);
p = await painel();
ok(p.traje === 'banho', 'e o botão volta o boneco para o traje de banho');

// ============================================================ 6. a outra aba, o T e o Escape
await page.locator('.armario .abas [data-aba="vestir"]').click();
await page.waitForTimeout(400);
p = await painel();
ok(p.aba === 'vestir' && /Bermuda havaiana/.test(p.corpo), 'a aba Guarda-roupa mostra o corpo, com a bermuda vestida');
await page.screenshot({ path: `${OUT}-guarda-roupa.png` });
await page.keyboard.press('KeyT');
await page.waitForTimeout(900);
const dono2 = await quemAnda();
p = await painel();
ok(dono2 !== dono1 && p.aberto, `o T troca de pessoa com o painel aberto (agora ${dono2})`);
await page.locator('.armario .abas [data-aba="piscina"]').click();
await page.waitForTimeout(400);
const etiqueta = await j(() => document.querySelector('.armario .produto[data-id="bermuda-havaiana"] em').textContent);
ok(/é de vocês/.test(etiqueta), `para o outro a bermuda também já é dos dois ("${etiqueta}")`);
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
p = await painel();
ok(!p.aberto && !(await j(() => window.jogo.input.blocked)), 'o Escape fecha e solta o movimento');

// persistência: recarregar não perde nada
await abrirCena();
const recarregado = await j((q) => ({
  vagas: window.jogo.wearables(q).map((i) => i?.id ?? null),
  tem: window.jogo.jaTemPeca('oculos-de-coracao'),
}), dono1);
ok(recarregado.vagas[2] === 'bermuda-havaiana' && recarregado.tem, 'recarregar a página guarda o que foi desbloqueado e vestido');

// ============================================================ 7. save antigo
await j(() => {
  const chave = 'aristory.save.v1';
  const bruto = JSON.parse(localStorage.getItem(chave));
  const cat = window.aristoryItens;
  bruto.compradas = [];
  for (const quem of Object.keys(bruto.inventarios ?? {})) {
    // como o vestiário antigo deixava: óculos na CABEÇA, presilha no acessório,
    // e as bermudas grátis no guarda-roupa
    bruto.inventarios[quem].vestiveis = [cat['oculos-escuros'], null, null, null, null, cat['presilha-estrela']];
    bruto.inventarios[quem].acervo = [cat['bermuda-azul'], cat['bermuda-vermelha']];
  }
  localStorage.setItem(chave, JSON.stringify(bruto));
});
await abrirCena();
const migrado = await j(() => ({
  vagas: window.jogo.wearables('ari').map((i) => i?.id ?? null),
  acervo: window.jogo.wardrobeItems('ari').map((i) => i.id),
}));
ok(migrado.vagas[0] === null && migrado.vagas[5] === 'oculos-escuros',
  `o óculos da vaga da cabeça mudou para o acessório (${migrado.vagas.join(', ')})`);
ok(migrado.acervo.includes('presilha-estrela'), 'e a presilha que estava lá foi para o guarda-roupa, sem sumir');
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
await passarFalas();
await page.waitForTimeout(600);
// quem já tem peça de piscina abre na aba do guarda-roupa: vai para a vitrine
p = await painel();
ok(p.aberto && p.aba === 'vestir', 'quem já tem peça de piscina abre na aba Guarda-roupa');
await page.locator('.armario .abas [data-aba="piscina"]').click();
await page.waitForTimeout(400);
const herdadas = await j(() => ['oculos-escuros', 'bermuda-azul', 'bermuda-vermelha', 'bermuda-amarela']
  .map((id) => document.querySelector(`.armario .produto[data-id="${id}"] em`)?.textContent ?? '?'));
ok(/é de|vestindo/.test(herdadas[0]) && /é de/.test(herdadas[1]) && /é de/.test(herdadas[2]) && /R\$/.test(herdadas[3]),
  `o que o vestiário antigo deu continua de vocês, o resto se paga (${herdadas.join(' · ')})`);
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// ============================================================ 8. em casa, sem abas
await abrirCena('quarto', '0,0');
await j(() => window.jogo.abrirGuardaRoupa());
await page.waitForTimeout(700);
p = await painel();
ok(p.aberto && !p.vestiario && p.titulo === 'Guarda-roupa' && p.aba === 'vestir', 'o guarda-roupa de casa continua sem abas');
const abasVisiveis = await j(() => getComputedStyle(document.querySelector('.armario .abas')).display);
ok(abasVisiveis === 'none', 'as abas não aparecem em casa');
await page.keyboard.press('Escape');

// ============================================================ celular
await page.setViewportSize({ width: 390, height: 844 });
await abrirCena();
await j(() => window.jogo.abrirVestiario());
await page.waitForTimeout(500);
await page.locator('.armario .abas [data-aba="piscina"]').click();
await page.waitForTimeout(300);
await clicarProduto('bermuda-de-melancia');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-celular.png` });
const cabe = await j(() => {
  const s = document.querySelector('.armario .sheet').getBoundingClientRect();
  return s.width <= window.innerWidth && s.left >= 0;
});
ok(cabe, 'no celular a folha cabe na tela');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
