/**
 * AS FANTASIAS DO HALLOWEEN (`docs/HALLOWEEN.md`, §5): as cinco da caça —
 * a abóbora, o pirata, o gato preto, o espantalho e o bruxinho, seis peças
 * cada (`world/fantasiasDaCaca.ts`) — nos dois.
 *
 *   1. toda peça existe, é fantasia (o filtro 🎃) e é presente (fora do ateliê);
 *   2. cada fantasia inteira nos dois: cada peça no pai certo (cabeça, corpo,
 *      braço, perna), o pé do rig sumindo nas que o substituem, nada abaixo
 *      do chão, e as fotos — de frente, de costas, de lado, andando, sentados
 *      no banco e de perto (a cabeça, o tronco, os pés);
 *   3. as peças que se mexem mexem: o rabo do gato balança, o papagaio e o
 *      corvinho mexem a cabeça;
 *   4. o boneco do guarda-roupa com cada uma, e o filtro 🎃 mostrando as
 *      fantasias guardadas (a vestida mora no corpo, fora da lista).
 *
 *   node scripts/fantasias.mjs /tmp/fa
 *   FANTASIA=pirata node scripts/fantasias.mjs /tmp/fa   (uma só)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/fa';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = process.env.FANTASIA ?? '';

const FANTASIAS = {
  abobora: ['chapeu-de-abobora', 'macacao-de-abobora', 'meia-calca-verde', 'botinha-de-abobora', 'luvinhas-de-abobora', 'gola-de-folhas'],
  pirata: ['chapeu-de-pirata', 'camisa-de-pirata', 'calca-bufante', 'botas-de-pirata', 'espadinha-de-pirata', 'papagaio-de-pirata'],
  gato: ['orelhinhas-de-gato', 'moletom-de-gato', 'legging-de-gato', 'patinhas-de-gato', 'luvas-de-patinha', 'rabo-de-gato'],
  espantalho: ['chapeu-de-espantalho', 'camisa-de-espantalho', 'calca-de-espantalho', 'botas-de-espantalho', 'luvas-de-espantalho', 'bandana-de-espantalho'],
  bruxinho: ['chapeu-de-bruxo', 'tunica-de-bruxo', 'meia-listrada-de-bruxo', 'botinha-de-bruxo', 'vassoura-de-bruxo', 'capa-de-estrelinhas'],
};
/** onde cada vaga pendura (o tronco também no braço, pela manga) */
const PAI = { cabeca: ['cabeca'], tronco: ['corpo'], pernas: ['perna'], pes: ['perna'], maos: ['braco'], acessorio: ['corpo'] };

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
const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 2 });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
const j = (fn, arg) => page.evaluate(fn, arg);
const espera = (ms) => page.waitForTimeout(ms);

const abrir = async (query) => {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 60000 });
  await espera(900);
};
await abrir('cena=escola-ginasio&em=5,6&olhar=0.35');
await j(() => localStorage.removeItem('aristory.save.v1'));
await abrir('cena=escola-ginasio&em=5,6&olhar=0.35');

// ============================================== 1. as fichas
console.log('\n1. as fichas');
const todas = Object.values(FANTASIAS).flat();
const fichas = await j((ids) => ids.map((id) => {
  const f = window.aristoryItens[id];
  return { id, existe: !!f, slot: f?.slot, extra: typeof f?.extra === 'function', preco: f?.preco };
}), todas);
ok(fichas.every((f) => f.existe && f.extra && !f.preco), `as ${todas.length} peças existem, têm modelo e não estão à venda`);
const slots = Object.fromEntries(fichas.map((f) => [f.id, f.slot]));
for (const [nome, ids] of Object.entries(FANTASIAS)) {
  const vagas = ids.map((id) => slots[id]).sort().join(',');
  ok(vagas === 'acessorio,cabeca,maos,pernas,pes,tronco', `${nome}: uma peça por vaga (${vagas})`);
}

/** veste a lista inteira em quem, tirando o que havia */
const vestir = (ids, quem) => j(([ids, quem]) => window.jogo.vestirConjunto(ids.map((id) => window.aristoryItens[id]), quem), [ids, quem]);
/** onde cada peça pendurou, se o pé do rig sumiu, e o ponto mais baixo das peças */
const medir = () => j(() => {
  const g = window.jogo;
  const r = {};
  for (const q of [g.player, g.parceiro]) {
    const rig = q.rig;
    const pais = {};
    let baixo = Infinity;
    const caixa = new rig.group.position.constructor();
    rig.group.updateMatrixWorld(true);
    rig.group.traverse((o) => {
      if (!o.userData.roupa) return;
      const p = o.parent;
      const nome = p === rig.head ? 'cabeca' : p === rig.body ? 'corpo' : p === rig.armL || p === rig.armR ? 'braco'
        : p === rig.legL || p === rig.legR ? 'perna' : 'outro';
      (pais[o.userData.roupa] ??= new Set()).add(nome);
      o.traverse((m) => {
        if (!m.isMesh || !m.geometry?.attributes?.position) return;
        const pos = m.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 7) {
          caixa.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
          baixo = Math.min(baixo, caixa.y);
        }
      });
    });
    const chao = rig.group.getWorldPosition(new rig.group.position.constructor()).y;
    r[rig.spec.id] = {
      pais: Object.fromEntries(Object.entries(pais).map(([k, v]) => [k, [...v]])),
      pe: rig.pes.map((p) => p.visible),
      baixo: +(baixo - chao).toFixed(3),
    };
  }
  return r;
});
/** a câmera colada num ponto do corpo de alguém, e a foto recortada em volta */
const dePerto = async (quem, altura, zoom, nome) => {
  await j(([quem, altura, zoom]) => {
    const g = window.jogo;
    const pessoa = g.playerId() === quem ? g.player : g.parceiro;
    const foco = new pessoa.rig.group.constructor();
    pessoa.rig.group.getWorldPosition(foco.position);
    foco.position.y += altura;
    g.current.world.root.add(foco);
    g.focusCamera(foco);
    g.setZoom(zoom);
    window.__foco = foco;
  }, [quem, altura, zoom]);
  await espera(1600);
  const c = await j(() => {
    const p = window.__foco.position.clone().project(window.jogo.iso.camera);
    return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight };
  });
  await page.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: Math.max(0, c.x - 160), y: Math.max(0, c.y - 135), width: 320, height: 270 } });
  await j(() => { window.jogo.focusCamera(null); window.__foco.removeFromParent(); });
};

// ============================================== 2. cada fantasia nos dois
for (const [nome, ids] of Object.entries(FANTASIAS)) {
  if (SO && SO !== nome) continue;
  console.log(`\n2. ${nome}`);
  await abrir('cena=escola-ginasio&em=5,6&olhar=0.35');
  await vestir(ids, 'ari');
  await vestir(ids, 'renan');
  await espera(500);
  const m = await medir();
  for (const quem of ['ari', 'renan']) {
    const erradas = ids.filter((id) => !(PAI[slots[id]] ?? []).every((p) => (m[quem].pais[id] ?? []).includes(p)));
    ok(erradas.length === 0, `${nome} no ${quem}: cada peça no pai certo (${erradas.map((id) => `${id}→${m[quem].pais[id]}`).join(', ') || 'todas'})`);
    ok(m[quem].pe.every((v) => !v), `${nome} no ${quem}: o pé do rig some dentro do calçado (${m[quem].pe})`);
    ok(m[quem].baixo > -0.01, `${nome} no ${quem}: nada abaixo do chão (${m[quem].baixo})`);
  }
  const posar = (olhar) => j((olhar) => { window.jogo.debugPlace(5, 6, olhar); window.jogo.setZoom(1.0); }, olhar);
  for (const [lado, olhar] of [['frente', Math.PI / 4], ['costas', Math.PI / 4 + Math.PI], ['lado', Math.PI / 4 + Math.PI / 2]]) {
    await posar(olhar);
    await espera(900);
    await page.screenshot({ path: `${OUT}-${nome}-${lado}.png` });
  }
  // andando
  await posar(Math.PI / 4);
  await j(() => window.jogo.setZoom(1.4));
  await page.keyboard.down('KeyD');
  await espera(700);
  await page.screenshot({ path: `${OUT}-${nome}-andando.png` });
  await page.keyboard.up('KeyD');
  // de perto
  await posar(Math.PI / 4);
  await espera(500);
  await dePerto('ari', 1.45, 0.55, `${nome}-cabeca-ari`);
  await dePerto('renan', 1.45, 0.55, `${nome}-cabeca-renan`);
  await dePerto('ari', 0.85, 0.7, `${nome}-tronco`);
  await dePerto('renan', 0.2, 0.6, `${nome}-pes`);
  await posar(Math.PI / 4 + Math.PI);
  await espera(500);
  await dePerto('ari', 0.9, 0.75, `${nome}-costas-perto`);
}

// ============================================== 3. o que se mexe
if (!SO || SO === 'gato' || SO === 'pirata' || SO === 'espantalho') {
  console.log('\n3. o que se mexe');
  await abrir('cena=escola-ginasio&em=5,6&olhar=0.35');
  // o Ari de gato com o chapéu do corvinho; o Renan de pirata com o papagaio
  await vestir([...FANTASIAS.gato.slice(1), 'chapeu-de-espantalho'], 'ari');
  await vestir(FANTASIAS.pirata, 'renan');
  const ler = () => j(() => {
    const s = window.jogo.scene;
    const v = (nome, eixo) => +(s.getObjectByName(nome)?.rotation[eixo] ?? NaN).toFixed(4);
    return { rabo: v('rabo-4', 'z'), papagaio: v('cabeca-do-papagaio', 'y'), corvinho: v('cabeca-do-corvinho', 'y') };
  });
  // (o rig refaz o acessório quando a roupa de baixo troca: espera ele assentar)
  let a = await ler();
  for (let i = 0; i < 40 && !(Number.isFinite(a.rabo) && Number.isFinite(a.corvinho) && Number.isFinite(a.papagaio)); i++) {
    await espera(500);
    a = await ler();
  }
  await espera(2500);
  const b = await ler();
  ok(Number.isFinite(a.rabo) && a.rabo !== b.rabo, `o rabo do gato balança (${a.rabo} → ${b.rabo})`);
  ok(Number.isFinite(a.papagaio) && a.papagaio !== b.papagaio, `o papagaio mexe a cabeça (${a.papagaio} → ${b.papagaio})`);
  ok(Number.isFinite(a.corvinho) && (a.corvinho !== b.corvinho || b.corvinho !== 0), `o corvinho mexe a cabeça (${a.corvinho} → ${b.corvinho})`);
}

// ============================================== 4. sentados no banco (o parque)
console.log('\n4. sentados');
const sentados = SO ? [SO] : Object.keys(FANTASIAS);
for (const nome of sentados) {
  await abrir('cena=villa-lobos&em=-4.2,15.6&olhar=3.14');
  await vestir(FANTASIAS[nome], 'ari');
  await vestir(FANTASIAS[nome], 'renan');
  await j(() => { window.jogo.debugPlace(-4.2, 15.6, Math.PI); window.jogo.setZoom(1.4); });
  await espera(500);
  await page.keyboard.press('KeyE');
  await espera(1200);
  for (let i = 0; i < 20 && !(await page.locator('.escolhas button').count()); i++) {
    await page.keyboard.press('KeyE');
    await espera(400);
  }
  await page.addStyleTag({ content: '.dialogue{visibility:hidden}' });
  await espera(700);
  const sentado = await j(() => !!window.jogo.player.rig.sitting || !!window.jogo.player.riding);
  ok(sentado, `${nome}: os dois sentam no banco`);
  await page.screenshot({ path: `${OUT}-${nome}-sentados.png` });
}

// ============================================== 5. o boneco do guarda-roupa
console.log('\n5. o guarda-roupa');
await abrir('cena=escola-ginasio&em=5,6&olhar=0.35');
await j((todas) => { for (const id of todas) window.jogo.ganharPeca(window.aristoryItens[id]); }, todas);
for (const nome of (SO ? [SO] : Object.keys(FANTASIAS))) {
  await vestir(FANTASIAS[nome], await j(() => window.jogo.playerId()));
  await j(() => window.jogo.abrirGuardaRoupa());
  await espera(1500);
  await page.screenshot({ path: `${OUT}-${nome}-painel.png` });
  await page.keyboard.press('Escape');
  await espera(500);
}
await j(() => window.jogo.abrirGuardaRoupa());
await espera(800);
const filtro = await j(() => {
  const b = [...document.querySelectorAll('.armario .filtro button')].find((x) => /🎃|Fantasia/.test(x.textContent));
  b?.click();
  return b?.textContent ?? null;
});
await espera(800);
const naLista = await j(() => [...document.querySelectorAll('.armario .lista .peca.fantasia')].filter((p) => p.offsetParent !== null).length);
ok(!!filtro && naLista >= todas.length - 6, `o filtro 🎃 mostra as fantasias guardadas (${filtro}: ${naLista} peças à vista)`);
await page.screenshot({ path: `${OUT}-filtro.png` });

console.log(erros.length ? '\nERROS:\n' + erros.join('\n') : '\nsem erros');
await browser.close();
if (problemas.length || erros.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
