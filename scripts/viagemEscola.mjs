/**
 * A VIAGEM DE CARRO ATÉ A ESCOLA DO GATITO (docs/VIAGEM-ESCOLA.md), só com
 * ?bebito (o save de teste) e no preview: nunca no site oficial.
 *
 *   ROTAS     (sem navegador) as seis rotas da escola, 300 sementes cada:
 *             determinismo, os quatro eventos da escola na zona escolar, nada
 *             perto do encontro, e nenhum coração em cima de faixa de parar
 *   MENU      a escola só entra no "Pra onde vamos de Bebito?" depois da
 *             escola aberta (o convite da Luna)
 *   IDA       do parque à escola com o piloto de teste: o radar, a torcida
 *             (o Gatito de guarda na faixa da direita), o ensaio da Valentina
 *             e a bola do Flynn, cada um fotografado de longe e de perto; sem
 *             tropeço nem susto; as memórias; e a CHEGADA ANIMADA no
 *             estacionamento (a cancela, o corredor e a vaga do coração), o
 *             carro parado no lugar certo e a dupla livre
 *   RECARGA   recarregar a página no pátio: o carro na vaga, sem repetir a
 *             chegada, o "Viajar de Bebito Mobile" na porta e o ônibus virando
 *             lembrete
 *   VOLTA     da escola para casa: o carro sai da escola e volta à garagem
 *   PRESSA    os caminhos de quem NÃO dirige direito, e o save que ainda não
 *             conhece a turma: só com a escola aberta, o radar a 40 km/h é
 *             tropeço, a torcida atravessa sem o Gatito e o carro freia
 *             sozinho na faixa (o susto), sem Valentina e sem Flynn na pista;
 *             com todos apresentados, passar correndo pelo ensaio é o "saiu
 *             tremida", e a bola do Flynn sem frear também é susto — e as duas
 *             viagens chegam à escola
 *
 * Uso: node scripts/viagemEscola.mjs /tmp/ve
 *      SO=rotas|menu|ida|recarga|volta|pressa  roda uma parte (recarga e volta
 *      precisam do carro na escola: rodam a IDA antes se ela não rodou)
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado: o save do site oficial não é de teste.');
const OUT = process.argv[2] ?? '/tmp/viagem-escola';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);

const DA_ESCOLA = ['casa-escola', 'escola-casa', 'parque-escola', 'escola-parque', 'clube-escola', 'escola-clube'];
const ESCOLARES = ['radar-escolar', 'torcida', 'ensaio-da-valentina', 'bola-do-flynn'];
const DE_PARAR = ['torcida', 'bola-do-flynn', 'travessia'];
const VAGA = { x: 2.6, z: 37.3 };

// ------------------------------------------------------------------ as rotas
if (parte('rotas')) {
  const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  const { gerarRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
  for (const sentido of DA_ESCOLA) {
    const indo = sentido.endsWith('escola');
    for (let semente = 1; semente <= 300; semente++) {
      const r = gerarRota(semente, sentido);
      assert.deepEqual(r, gerarRota(semente, sentido), 'a mesma semente dá a mesma rota');
      assert.equal(r.comprimento, 1000);
      for (const tipo of ESCOLARES) assert.equal(r.eventos.filter((e) => e.tipo === tipo).length, 1, `${sentido}: um ${tipo}`);
      // a zona escolar fica na ponta da escola: no fim da ida, no começo da volta
      for (const e of r.eventos.filter((e) => ESCOLARES.includes(e.tipo))) assert.ok(indo ? e.s > 600 : e.s < 400, `${sentido}: ${e.tipo} na zona escolar`);
      if (r.encontro) assert.ok(r.eventos.every((e) => Math.abs(e.s - r.encontro.s) > 120), 'nada perto do encontro');
      const paradas = r.eventos.filter((e) => DE_PARAR.includes(e.tipo));
      assert.ok(r.coracoes.every((c) => !paradas.some((e) => c.s > e.s - 16 && c.s < e.s + 6)), `${sentido}: nenhum coração em cima da faixa`);
      assert.ok(r.coracoes.every((c) => Math.abs(c.l) <= 2.3 && c.s < r.chegada));
      assert.ok(r.trechos.some((t) => t.bioma === 'escolar'));
    }
  }
  console.log('ROTAS: 1800 rotas da escola (determinismo, a zona escolar, o encontro livre e as faixas sem coração).');
}

if (!['menu', 'ida', 'recarga', 'volta', 'pressa'].some(parte)) process.exit(0);

// ------------------------------------------------------------------ o navegador
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const erros = [];
const espera = (p, f, a, teto = 120000) => p.waitForFunction(f, a, { timeout: teto });
/** desenhar custa caro no navegador do teste: só se desenha na hora da foto */
async function desenho(p, ligado) {
  await p.evaluate((ligado) => {
    const r = window.jogo.renderer;
    window.renderNormal ??= r.render.bind(r);
    r.render = ligado ? window.renderNormal : (s, c) => { s.updateMatrixWorld(); c.updateMatrixWorld(); };
  }, ligado);
}
async function pausa(p, parado) {
  await p.evaluate((parado) => {
    const b = window.aristoryBebitoMobile;
    if (parado) { window.vezesGuardadas = [b.viagem.vezes, b.ritmoDoPresente.vezes]; b.viagem.vezes = 0; b.ritmoDoPresente.vezes = 0; }
    else if (window.vezesGuardadas) [b.viagem.vezes, b.ritmoDoPresente.vezes] = window.vezesGuardadas;
  }, parado);
}
async function foto(p, nome) {
  await pausa(p, true);
  await desenho(p, true);
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
  await p.screenshot({ path: `${OUT}-${nome}.png` });
  const info = await p.evaluate(() => ({ ...window.jogo.renderer.info.render }));
  await desenho(p, false);
  await pausa(p, false);
  console.log('  foto', nome, `${info.calls} desenhos, ${Math.round(info.triangles / 1000)} mil triângulos`);
  return info;
}
async function avancar(p) {
  await p.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
}
async function ate(p, f, teto = 180000) {
  const inicio = Date.now();
  while (Date.now() - inicio < teto) {
    if (await p.evaluate(f)) return;
    await avancar(p);
    await p.waitForTimeout(70);
  }
  throw Error('Estado esperado não chegou');
}
async function botoes(p) {
  await espera(p, () => document.querySelectorAll('.escolhas.show button').length > 0);
  return p.evaluate(() => [...document.querySelectorAll('.escolhas.show button')].map((b) => b.textContent.trim()));
}
async function escolher(p, nome) { await p.getByRole('button', { name: nome, exact: true }).click({ timeout: 30000 }); }
async function tocar(p, id) {
  await espera(p, (id) => window.jogo.current.world.interactables.some((i) => i.id === id && i.enabled), id);
  await p.evaluate((id) => { void window.jogo.current.world.interactables.find((i) => i.id === id).trigger(window.jogo); }, id);
}
/** um ponto da pista em coordenadas do mundo (a mesma conta do `naPista` da cena) */
async function naPista(p, s, l, y) {
  return p.evaluate(([s, l, y]) => {
    const b = window.aristoryBebitoMobile;
    const { x, inclina } = b.eixoDaRota(b.viagem.rota, s);
    const n = 1 / Math.hypot(inclina, 1);
    return [x + l * n, y, -s + l * inclina * n];
  }, [s, l, y]);
}
/** a câmera de perto de cada evento: [de, para], cada um em (ds, l, y) a partir do evento */
const DE_PERTO = {
  'radar-escolar': [[-5, 0, 2.4], [0, 4, 1.9]],
  'torcida': [[-7, 2.5, 3.2], [0, 0, 0.6]],
  'ensaio-da-valentina': [[-4.5, 1.5, 2.6], [0, -6, 0.9]],
  'bola-do-flynn': [[-7, 0, 3], [0, 0, 0.5]],
};

const FLAGS_DA_ESCOLA = ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'flynn-conhecido', 'valentina-conhecida'];
let ctx;
let p;
let foiAEscola = false;

async function abrir() {
  ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });
  p = await ctx.newPage();
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${BASE}/?bebito&carroPorDentro&semHalloween&cena=casa`);
  await espera(p, () => window.jogo?.current && !window.jogo.transitioning);
  await desenho(p, false);
}

/** a viagem inteira com o piloto de teste, fotografando cada evento da escola */
async function percorrer(sentido, motorista, comFotos) {
  await espera(p, () => window.jogo?.idDaCena === 'viagem-de-carro' && !window.jogo.transitioning && window.aristoryBebitoMobile.viagem.estado);
  await desenho(p, false);
  await p.evaluate(() => { const b = window.aristoryBebitoMobile; b.viagem.vezes = 5; b.viagem.piloto = 'bom'; b.ritmoDoPresente.vezes = 5; });
  const rota = await p.evaluate(() => window.aristoryBebitoMobile.viagem.rota);
  assert.equal(rota.sentido, sentido);
  console.log(' ', sentido, rota.eventos.map((e) => `${e.tipo}@${Math.round(e.s)}`).join(' '), '| encontro:', rota.encontro?.personagem ?? 'nenhum');
  const escolares = rota.eventos.filter((e) => ESCOLARES.includes(e.tipo));
  const fotos = new Set();
  let resumo = null;
  let guardaNaDireita = null;
  const inicio = Date.now();
  while (Date.now() - inicio < 600000) {
    const e = await p.evaluate(() => {
      const v = window.aristoryBebitoMobile.viagem;
      return { cena: window.jogo.idDaCena, s: v.estado?.s, vistos: { ...v.estado?.vistos }, tropecos: v.estado?.tropecos, sustos: v.estado?.sustos, gentilezas: v.estado?.gentilezas };
    });
    if (e.cena !== 'viagem-de-carro') break;
    resumo = e;
    for (const ev of escolares) {
      // (a travessia começa a 46 m: a foto de longe pega o começo dela)
      const longe = ev.tipo === 'torcida' || ev.tipo === 'bola-do-flynn' ? 30 : 12;
      if (comFotos && !fotos.has(ev.tipo) && e.s > ev.s - longe) {
        fotos.add(ev.tipo);
        await foto(p, `${ev.tipo}`);
        const [de, para] = DE_PERTO[ev.tipo];
        const cam = { de: await naPista(p, ev.s + de[0], de[1], de[2]), para: await naPista(p, ev.s + para[0], para[1], para[2]) };
        await p.evaluate((cam) => { window.aristoryBebitoMobile.viagem.camera = cam; }, cam);
        await foto(p, `${ev.tipo}-perto`);
        await p.evaluate(() => { window.aristoryBebitoMobile.viagem.camera = null; });
      }
    }
    // o Gatito de guarda: com a fila atravessando, ele está parado na faixa da DIREITA (a de quem dirige)
    if (guardaNaDireita === null) {
      guardaNaDireita = await p.evaluate(() => {
        let l = null;
        window.jogo.scene.traverse((o) => {
          if (o.userData.peca !== 'travessia-da-torcida' || o.userData.fase !== 'atravessando') return;
          const gatito = o.children[0].children.find((c) => c.scale.x > 1.5);
          const v = window.aristoryBebitoMobile.viagem;
          const ev = v.rota.eventos.find((e) => e.tipo === 'torcida');
          const { x, inclina } = window.aristoryBebitoMobile.eixoDaRota(v.rota, ev.s);
          const n = 1 / Math.hypot(inclina, 1);
          l = (gatito.getWorldPosition(gatito.position.clone()).x - x) / n;
        });
        return l === null ? null : l;
      });
      if (guardaNaDireita !== null) console.log(`  o Gatito de guarda a ${guardaNaDireita.toFixed(2)} m do meio da pista`);
    }
    await avancar(p);
    await p.waitForTimeout(60);
  }
  assert.ok(resumo, 'a viagem andou');
  console.log('  vistos:', Object.keys(resumo.vistos).join(', '), `| tropeços ${resumo.tropecos}, sustos ${resumo.sustos}, gentilezas ${resumo.gentilezas}`);
  assert.equal(resumo.tropecos, 0, 'o piloto de teste não tropeça');
  assert.equal(resumo.sustos, 0, 'ninguém leva susto');
  for (const tipo of ESCOLARES) assert.ok(resumo.vistos[tipo], `${tipo} aconteceu`);
  assert.ok(guardaNaDireita !== null && guardaNaDireita > 0.6 && guardaNaDireita < 2.6, 'o Gatito guarda a faixa da direita');
  return motorista;
}

try {
  // ---------------------------------------------------------------- o menu
  if (parte('menu')) {
    await abrir();
    await p.evaluate(() => {
      const g = window.jogo;
      for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'bebito:carro-no-parque']) g.setFlag(f);
      g.goTo('villa-lobos', 'do-carro');
    });
    await espera(p, () => window.jogo.idDaCena === 'villa-lobos' && !window.jogo.transitioning);
    await tocar(p, 'parque:bebito-mobile');
    const sem = await botoes(p);
    assert.ok(!sem.includes('Escola do Gatito'), 'sem a escola aberta, o carro não vai à escola');
    await escolher(p, 'Agora não');
    await p.evaluate(() => window.jogo.setFlag('escola-aberta'));
    await espera(p, () => !document.querySelector('.escolhas.show button'));
    await p.waitForTimeout(300);
    await tocar(p, 'parque:bebito-mobile');
    const com = await botoes(p);
    assert.ok(com.includes('Escola do Gatito'), 'com a escola aberta, ela entra no menu');
    console.log('MENU:', sem.join(' / '), '→', com.join(' / '));
    await escolher(p, 'Agora não');
    await ctx.close();
  }

  // ---------------------------------------------------------------- a ida e a chegada
  if (parte('ida') || parte('recarga') || parte('volta')) {
    await abrir();
    await p.evaluate((flags) => {
      const g = window.jogo;
      for (const f of [...flags, 'bebito:carro-no-parque']) g.setFlag(f);
      if (g.playerId() !== 'ari') g.swapCharacters();
      g.goTo('villa-lobos', 'do-carro');
    }, FLAGS_DA_ESCOLA);
    await espera(p, () => window.jogo.idDaCena === 'villa-lobos' && !window.jogo.transitioning);
    await tocar(p, 'parque:bebito-mobile');
    await escolher(p, 'Escola do Gatito');
    await escolher(p, 'Ari');
    await ate(p, () => window.jogo.idDaCena === 'viagem-de-carro');
    console.log('IDA:');
    await percorrer('parque-escola', 'ari', parte('ida'));
    // a chegada animada: o pátio da escola, o carro vindo pela rua, a cancela, o corredor e a vaga
    await espera(p, () => window.jogo.idDaCena === 'escola-patio' && window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada, null, 180000);
    const fasesVistas = new Set();
    const inicio = Date.now();
    while (Date.now() - inicio < 240000) {
      const c = await p.evaluate(() => window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada?.fase);
      if (c === 'concluida') break;
      if (c && !fasesVistas.has(c) && parte('ida')) {
        fasesVistas.add(c);
        await foto(p, `chegada-${fasesVistas.size}-${c}`);
      }
      await avancar(p);
      await p.waitForTimeout(80);
    }
    const chegada = await p.evaluate(() => {
      const g = window.jogo;
      const c = g.scene.getObjectByName('bebito-mobile');
      const ints = g.current.world.interactables;
      return {
        fase: c.userData.chegada.fase, motorista: c.userData.chegada.motorista,
        x: c.position.x, z: c.position.z, giro: c.rotation.y,
        livre: !g.player.locked && !g.player.riding,
        escola: g.flag('bebito:carro-na-escola'), parque: g.flag('bebito:carro-no-parque'), clube: g.flag('bebito:carro-no-clube'),
        viajar: ints.find((i) => i.id === 'escola:bebito-mobile')?.enabled,
        onibus: ints.find((i) => i.id === 'door:villa-lobos:clube')?.enabled,
        lembrete: ints.find((i) => i.id === 'escola:buscar-carro')?.enabled,
        memorias: (JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}').memories ?? []).map((m) => m.id).filter((id) => id === 'de-bebito-a-escola' || id === 'torcida-na-faixa'),
      };
    });
    console.log('  chegada:', JSON.stringify(chegada), '| fases:', [...fasesVistas].join(' → '));
    assert.equal(chegada.fase, 'concluida');
    assert.equal(chegada.motorista, 'ari');
    assert.ok(Math.abs(chegada.x - VAGA.x) < 0.05 && Math.abs(chegada.z - VAGA.z) < 0.05, 'o carro na vaga do coração');
    assert.ok(Math.abs(Math.abs(chegada.giro) - Math.PI) < 0.05, 'de nariz para a rua');
    assert.ok(chegada.livre, 'a dupla desce e fica livre');
    assert.ok(chegada.escola && !chegada.parque && !chegada.clube, 'o carro mora na escola agora');
    assert.ok(chegada.viajar && chegada.lembrete && !chegada.onibus, 'o carro na porta, e o ônibus vira lembrete');
    assert.ok(chegada.memorias.includes('de-bebito-a-escola') && chegada.memorias.includes('torcida-na-faixa'), 'as duas memórias da viagem');
    if (parte('ida')) {
      for (const f of ['apresentando', 'abrindo', 'entrando']) assert.ok(fasesVistas.has(f), `a chegada passou por ${f}`);
      await p.waitForTimeout(800);
      await foto(p, 'estacionado');
    }
    foiAEscola = true;
  }

  // ---------------------------------------------------------------- recarregar no pátio
  if (parte('recarga') && foiAEscola) {
    await p.goto(`${BASE}/?bebito&carroPorDentro&semHalloween`);
    await espera(p, () => window.jogo?.idDaCena === 'escola-patio' && !window.jogo.transitioning);
    await desenho(p, false);
    const r = await p.evaluate(() => {
      const g = window.jogo;
      const c = g.scene.getObjectByName('bebito-mobile');
      return { tem: !!c, chegada: c?.userData.chegada?.fase ?? null, x: c?.position.x, z: c?.position.z, viajar: g.current.world.interactables.find((i) => i.id === 'escola:bebito-mobile')?.enabled };
    });
    console.log('RECARGA:', JSON.stringify(r));
    assert.ok(r.tem && r.chegada === null, 'recarregar não repete a chegada');
    assert.ok(Math.abs(r.x - VAGA.x) < 0.05 && Math.abs(r.z - VAGA.z) < 0.05 && r.viajar);
    // e o carro não aparece em outro lugar
    for (const [cena, entrada] of [['frente-da-casa', undefined], ['villa-lobos', undefined], ['clube', undefined]]) {
      await p.evaluate(([c, e]) => window.jogo.goTo(c, e), [cena, entrada]);
      await espera(p, (c) => window.jogo.idDaCena === c && !window.jogo.transitioning, cena);
      assert.equal(await p.evaluate(() => !!window.jogo.scene.getObjectByName('bebito-mobile')), false, `o carro não está em ${cena}`);
    }
    await p.evaluate(() => window.jogo.goTo('escola-patio', 'do-estacionamento'));
    await espera(p, () => window.jogo.idDaCena === 'escola-patio' && !window.jogo.transitioning);
    await desenho(p, false);
  }

  // ---------------------------------------------------------------- a volta para casa
  if (parte('volta') && foiAEscola) {
    await tocar(p, 'escola:bebito-mobile');
    const opcoes = await botoes(p);
    console.log('VOLTA: o menu da escola:', opcoes.join(' / '));
    assert.deepEqual(opcoes, ['Casa do Ari', 'Parque Villa Lobos', 'Clube', 'Agora não']);
    await escolher(p, 'Casa do Ari');
    await escolher(p, 'Renan');
    await ate(p, () => window.jogo.idDaCena === 'viagem-de-carro');
    await percorrer('escola-casa', 'renan', false);
    await ate(p, () => window.jogo.idDaCena === 'frente-da-casa' && !window.jogo.transitioning, 240000);
    const casa = await p.evaluate(() => ({ carro: !!window.jogo.scene.getObjectByName('bebito-mobile'), escola: window.jogo.flag('bebito:carro-na-escola') }));
    assert.ok(casa.carro && !casa.escola, 'o carro volta à garagem e sai da escola');
    console.log('  o carro voltou para a garagem.');
  }

  // ---------------------------------------------------------------- com pressa, e sem a turma conhecida
  if (parte('pressa')) {
    /** abre uma viagem direto na estrada, com as flags dadas, o encontro fora de cena e o relógio dos toasts */
    const naEstrada = async (flags, semente) => {
      if (ctx) await ctx.close();
      await abrir();
      await p.evaluate((flags) => { for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', ...flags]) window.jogo.setFlag(f); }, flags);
      await p.goto(`${BASE}/?bebito&carroPorDentro&semHalloween&cena=viagem-de-carro&viagem=parque-escola,ari,${semente}`);
      await espera(p, () => window.jogo?.idDaCena === 'viagem-de-carro' && !window.jogo.transitioning && window.aristoryBebitoMobile.viagem.estado);
      await desenho(p, false);
      await p.evaluate(() => {
        window.toasts = [];
        new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.classList?.contains('toast')) window.toasts.push(n.textContent); })
          .observe(document.body, { childList: true, subtree: true });
        const n = window.jogo.current.world.root.userData.novidadesDaViagem;
        if (n?.encontro) { n.encontro.estado.fase = 'feito'; n.encontro.carro.group.visible = false; }
      });
    };
    const evento = (tipo) => p.evaluate((tipo) => window.aristoryBebitoMobile.viagem.rota.eventos.find((e) => e.tipo === tipo), tipo);
    const pecaNaCena = (peca) => p.evaluate((peca) => { let tem = false; window.jogo.scene.traverse((o) => { if (o.userData.peca === peca) tem = true; }); return tem; }, peca);
    const st = () => p.evaluate(() => { const v = window.aristoryBebitoMobile.viagem.estado; return { s: v.s, v: v.v, vistos: { ...v.vistos }, tropecos: v.tropecos, sustos: v.sustos, gentilezas: v.gentilezas }; });
    /** dirige distraído até passar `s`, e conta se a frente do carro passou da linha com alguém NA PISTA */
    const distraidoAte = async (s, peca, linha) => {
      await p.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.piloto = 'distraido'; v.vezes = 2.5; });
      let passou = false;
      const t0 = Date.now();
      while (Date.now() - t0 < 300000) {
        const e = await p.evaluate((peca) => {
          let naPista = false;
          window.jogo.scene.traverse((o) => { if (o.userData.peca === peca && o.userData.naPista) naPista = true; });
          return { s: window.aristoryBebitoMobile.viagem.estado.s, naPista };
        }, peca);
        if (e.naPista && e.s + 2.6 > linha + 0.25) passou = true;
        if (e.s > s) break;
        await avancar(p);
        await p.waitForTimeout(90);
      }
      return passou;
    };
    const chegarNaEscola = async () => {
      await p.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.piloto = 'bom'; v.vezes = 5; window.aristoryBebitoMobile.ritmoDoPresente.vezes = 5; });
      await ate(p, () => window.jogo.idDaCena === 'escola-patio' && window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada?.fase === 'concluida', 400000);
    };

    // A: só a escola aberta — ninguém da turma foi apresentado ainda
    console.log('PRESSA, só com a escola aberta:');
    await naEstrada(['escola-aberta'], 5);
    assert.equal(await pecaNaCena('ensaio-da-valentina'), false, 'sem a Valentina apresentada, nada de ensaio');
    assert.equal(await pecaNaCena('bola-do-flynn'), false, 'sem o Flynn apresentado, nada de bola');
    const semGatito = await p.evaluate(() => { let n = null; window.jogo.scene.traverse((o) => { if (o.userData.peca === 'travessia-da-torcida') n = o.children[0].children.filter((c) => c.scale.x > 1.5).length; }); return n; });
    assert.equal(semGatito, 0, 'a torcida atravessa sem o Gatito');
    const radar = await evento('radar-escolar');
    const torcida = await evento('torcida');
    await p.evaluate((s) => { const v = window.aristoryBebitoMobile.viagem.estado; v.s = s; v.v = 11; }, radar.s - 70);
    const passouNaFaixa = await distraidoAte(torcida.s + 10, 'travessia-da-torcida', torcida.s - 3.4);
    const a = await st();
    console.log('  ', JSON.stringify({ tropecos: a.tropecos, sustos: a.sustos, vistos: a.vistos }));
    assert.ok(a.vistos['tropeço:radar'], 'o radar a toda velocidade é tropeço');
    assert.ok(await p.evaluate(() => window.toasts.some((t) => t.includes('O radar ficou sério'))), 'e a carona reclama do radar');
    assert.ok(!passouNaFaixa, 'sem frear, o carro não passa da linha com a torcida na faixa');
    assert.equal(a.sustos, 1, 'a torcida leva o susto');
    assert.ok(a.vistos.torcida, 'e atravessa até o fim, e o carro segue');
    await foto(p, 'pressa-depois-da-torcida');
    await chegarNaEscola();
    console.log('   chegou na escola.');

    // B: todos apresentados — passar correndo pelo ensaio, e a bola sem frear
    console.log('PRESSA, com a turma toda:');
    await naEstrada(FLAGS_DA_ESCOLA, 6);
    const ensaio = await evento('ensaio-da-valentina');
    const bola = await evento('bola-do-flynn');
    await p.evaluate((s) => { const v = window.aristoryBebitoMobile.viagem.estado; v.s = s; v.v = 11; }, ensaio.s - 60);
    const passouNaBola = await distraidoAte(bola.s + 10, 'bola-do-flynn', bola.s - 3.4);
    const b = await st();
    console.log('  ', JSON.stringify({ tropecos: b.tropecos, sustos: b.sustos, vistos: b.vistos }));
    assert.ok(await p.evaluate(() => window.toasts.some((t) => t.includes('saiu tremida'))), 'correndo pelo ensaio: "saiu tremida"');
    assert.ok(b.vistos['ensaio-da-valentina'], 'o ensaio conta como visto');
    assert.ok(!passouNaBola, 'sem frear, o carro não passa por cima do Flynn');
    assert.equal(b.sustos, 1, 'o Flynn leva o susto');
    assert.ok(b.vistos['bola-do-flynn'], 'ele busca a bola, e o carro segue');
    await chegarNaEscola();
    console.log('   chegou na escola.');
  }

  if (p) assert.equal(await p.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
  assert.deepEqual(erros, []);
  console.log('Viagem da escola: tudo passou, sem erro de página.');
} catch (e) {
  if (p) {
    console.log('falha', await p.evaluate(() => ({ cena: window.jogo?.idDaCena, estado: window.aristoryBebitoMobile?.viagem.estado, dialogo: document.querySelector('.dialogue.show')?.textContent })).catch(() => null));
    await desenho(p, true).catch(() => {});
    await p.screenshot({ path: `${OUT}-falha.png` }).catch(() => {});
  }
  throw e;
} finally {
  await browser.close();
}
