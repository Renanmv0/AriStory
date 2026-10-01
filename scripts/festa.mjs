/**
 * A FESTA DA TORCIDA — o fim do Módulo 1 (pedido do Renan): as três
 * coelhinhas chamam a dupla para comemorar no ginásio, fazem uma dança de uns
 * 10 segundos, e dão a roupa de cheerleader para o guarda-roupa dos dois.
 *
 *   1. O CONVITE: concluir a lição 6 na Sala 1 faz as três chamarem para o
 *      ginásio (a flag do convite e o aviso);
 *   2. A DANÇA, medida: entrando no ginásio com o módulo inteiro, as três vão
 *      ao palco, falam, a música troca para a da festa, e dançam juntas —
 *      a Sol salta (mais de meio metro), a Estrella dá DUAS estrelinhas (para
 *      fora e de volta: termina no lugar), a Luna gira uma volta inteira; a
 *      dança dura ~10 s de jogo; o confete cai no salto final; e fotos de
 *      cada parte. No CELULAR em pé (SO=celular), as três — estrelinha e
 *      pompons inclusos — cabem na largura da tela a dança inteira;
 *   3. O PRÊMIO: as quatro peças no guarda-roupa dos dois, a memória no
 *      diário, a música de volta, e a festa não se repete;
 *   4. A ROUPA: o uniforme (top e saia pregueada), o shortinho com o meião, o
 *      laço e os pompons nos dois — de frente, de costas, andando, sentados e
 *      de perto —, e o boneco do painel;
 *   5. O VESTIÁRIO DA ESCOLA lista a roupa na aba dos uniformes (trancada
 *      antes, dizendo que se ganha no fim do módulo).
 *
 *   node scripts/festa.mjs /tmp/fe        (SO=danca, SO=roupa… roda só uma parte)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/fe';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.includes(nome);

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
const LICOES = ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho'];
const PECAS = ['uniforme-de-torcida', 'meiao-de-torcida', 'laco-de-torcida', 'pompons-de-torcida'];

/** uma página nova, com o save de um ponto da história */
const abrir = async (cena, preparar, arg, viewport = { width: 1000, height: 800 }, escala = 1) => {
  const p = await browser.newPage({ viewport, deviceScaleFactor: escala });
  ouvir(p);
  await p.goto(`${BASE}/?cena=${cena}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.evaluate(preparar, arg);
  // a cena se monta pelo save: entra nela de novo, já com ele
  await p.goto(`${BASE}/?cena=${cena}`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.mouse.click(viewport.width / 2, viewport.height / 3);
  return p;
};
/** o save de quem terminou `n` lições */
const terminou = ([licoes, n, flags]) => {
  const j = window.jogo;
  for (const f of flags) j.setFlag(f);
  licoes.slice(0, n).forEach((id) => {
    j.save.abrirLicao(id);
    j.save.concluirLicao(id, 3);
  });
};
const FLAGS = ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'jean-luc-batido', 'escola-visitada'];

/** passa as falas com E, anotando "quem: texto", enquanto `ate` não acontece */
const falar = async (p, ate = async () => false, max = 60) => {
  const falas = [];
  for (let i = 0; i < max && !(await ate()); i++) {
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(300);
      continue;
    }
    await p.waitForTimeout(450);
    const quem = await p.evaluate(() => document.querySelector('.dialogue .who')?.textContent ?? '');
    const t = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (t) falas.push(`${quem}: ${t}`);
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(150);
  }
  return falas.filter((f, i) => !falas.slice(i + 1).some((g) => g.startsWith(f)));
};

/** as três coelhinhas do ginásio: posição, festa, salto, giros */
const irmas = (p) => p.evaluate(() => {
  const r = {};
  window.jogo.current.world.root.traverse((o) => {
    const id = o.userData?.peca;
    if (!['luna', 'sol', 'estrella'].includes(id) || r[id]) return;
    const b = o.userData.teste?.[id];
    if (!b) return;
    r[id] = {
      x: +b.x.toFixed(2), z: +b.z.toFixed(2),
      festa: b.estaNaFesta, altura: b.medidaDoGesto.altura, giroZ: b.medidaDoGesto.giro,
      giroY: b.giroNoEixo, giroDaFesta: b.giroDaFesta, estrelinha: b.estaFazendoEstrelinha, tempo: b.tempoNaFesta,
    };
  });
  return r;
});

// ============================================================ 1. o convite
if (parte('convite')) {
  console.log('\n1. o convite no fim da lição 6');
  const p = await abrir('escola-sala-1', terminou, [LICOES, 5, [...FLAGS, 'aula-chamada']]);
  await p.waitForTimeout(1500);
  await p.evaluate(() => {
    const j = window.jogo;
    j.abrirApostila = async (o = {}) => {
      if (!o.licao) return { concluidas: [] };
      j.save.abrirLicao(o.licao);
      j.save.concluirLicao(o.licao, 3);
      return { concluidas: [{ id: o.licao, estrelas: 3 }] };
    };
    j.debugPlace(-0.15, 0.55, Math.PI);
  });
  for (let i = 0; i < 24; i++) {
    if (/aula/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) break;
    await p.waitForTimeout(250);
  }
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(600);
  const falas = await falar(p, async () => p.evaluate(() => window.jogo.flag('festa-da-torcida-convite')), 80);
  console.log('      ' + falas.slice(-4).join('\n      '));
  ok(falas.some((f) => /^Luna: .*Encontrem a gente no ginásio/.test(f)), 'a Luna chama para o ginásio');
  ok(falas.some((f) => /^Sol: ¡TERMINARAM O MÓDULO!/.test(f)) && falas.some((f) => /^Estrella: /.test(f)), 'a Sol e a Estrella também falam');
  ok(await p.evaluate(() => window.jogo.flag('festa-da-torcida-convite')), 'o convite fica anotado');
  await p.close();
}

// ============================================================ 2. a dança
if (parte('danca')) {
  console.log('\n2. a festa no ginásio');
  const p = await abrir('escola-ginasio', terminou, [LICOES, 6, [...FLAGS, 'festa-da-torcida-convite']], { width: 1100, height: 800 });
  // as falas de antes da dança
  const antes = await falar(p, async () => (await irmas(p)).luna?.festa === true, 60);
  console.log('      ' + antes.join('\n      '));
  ok(antes.some((f) => /^Luna: ¡Cinco, seis, siete, ocho!/.test(f)), 'a Luna conta o "cinco, seis, sete, oito"');
  const comeco = await irmas(p);
  ok(['luna', 'sol', 'estrella'].every((id) => comeco[id]?.festa), 'as três começam a dançar juntas');
  ok(await p.evaluate(() => window.jogo.climaDaMusica) === 'festa-da-torcida', 'a música troca para a da festa');
  const lugarDaEstrella = { x: comeco.estrella.x, z: comeco.estrella.z };
  // a dança, medida a cada passo
  let picoDaSol = 0;
  let giroDaLuna = 0;
  const viradas = [];
  let estrelinhaAntes = false;
  let fotoNoAr = false;
  let fotoDeCabeca = false;
  let fotoGiro = false;
  let fotoOnda = false;
  let fotoConfete = false;
  // o navegador sem placa de vídeo anda a ~1/5 do relógio: o laço vai até a dança acabar
  const t0 = Date.now();
  for (let i = 0; Date.now() - t0 < 300000; i++) {
    const r = await irmas(p);
    if (!r.luna) break;
    picoDaSol = Math.max(picoDaSol, r.sol.altura);
    giroDaLuna = Math.max(giroDaLuna, Math.abs(r.luna.giroY));
    // cada estrelinha é uma subida de `estaFazendoEstrelinha`, e tem de passar de cabeça para baixo
    if (r.estrella.estrelinha && !estrelinhaAntes) viradas.push(false);
    if (r.estrella.estrelinha && Math.cos(r.estrella.giroZ) < -0.5) viradas[viradas.length - 1] = true;
    estrelinhaAntes = r.estrella.estrelinha;
    if (!fotoOnda && i === 6) {
      fotoOnda = true;
      await p.screenshot({ path: `${OUT}-danca-comeco.png` });
    }
    if (!fotoNoAr && r.sol.altura > 0.45) {
      fotoNoAr = true;
      await p.screenshot({ path: `${OUT}-danca-sol-no-ar.png` });
    }
    if (!fotoDeCabeca && r.estrella.estrelinha && Math.cos(r.estrella.giroZ) < -0.3) {
      fotoDeCabeca = true;
      await p.screenshot({ path: `${OUT}-danca-estrelinha.png` });
    }
    if (!fotoGiro && Math.abs(r.luna.giroY) > 2.5 && Math.abs(r.luna.giroY) < 4) {
      fotoGiro = true;
      await p.screenshot({ path: `${OUT}-danca-giro-da-luna.png` });
    }
    if (!fotoConfete && r.luna.tempo > 10.2) {
      fotoConfete = true;
      await p.screenshot({ path: `${OUT}-danca-confete.png` });
    }
    if (!r.luna.festa && !r.sol.festa && !r.estrella.festa && !r.estrella.estrelinha) break;
  }
  const fim = await irmas(p);
  giroDaLuna = Math.max(giroDaLuna, fim.luna.giroDaFesta);
  // o confete e a pose final
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}-danca-final.png` });
  console.log(`      pico da Sol ${picoDaSol.toFixed(2)} · giro da Luna ${giroDaLuna.toFixed(2)} rad · estrelinhas ${viradas.map(String).join(',')}`);
  ok(picoDaSol > 0.5, `a Sol salta no meio da dança (${picoDaSol.toFixed(2)})`);
  ok(giroDaLuna > Math.PI * 1.8, `a Luna dá uma volta inteira (${giroDaLuna.toFixed(2)} rad)`);
  ok(viradas.length === 2 && viradas.every(Boolean), `a Estrella dá DUAS estrelinhas, de cabeça para baixo nas duas (${viradas.length})`);
  const volta = Math.hypot(fim.estrella.x - lugarDaEstrella.x, fim.estrella.z - lugarDaEstrella.z);
  ok(volta < 0.3, `e termina no lugar onde começou (${volta.toFixed(2)})`);
  ok(fotoNoAr && fotoDeCabeca && fotoGiro && fotoConfete, 'as fotos pegaram o salto, a estrelinha, o giro e o confete');
  const depois = await falar(p, async () => p.evaluate(() => window.jogo.flag('festa-da-torcida')), 60);
  console.log('      ' + depois.join('\n      '));
  ok(depois.some((f) => /^Luna: Então a roupa de cheerleader agora é de vocês também!/.test(f)), 'a Luna dá a roupa de cheerleader');
  await p.waitForTimeout(1500);
  const premio = await p.evaluate((pecas) => {
    const j = window.jogo;
    const tem = (quem) => j.wardrobeItems(quem).map((i) => i.id).filter((id) => pecas.includes(id)).length;
    return {
      ari: tem('ari'), renan: tem('renan'), flag: j.flag('festa-da-torcida'),
      memoria: (j.save.data?.memories ?? JSON.parse(localStorage.getItem('aristory.save.v1')).memories ?? []).some((m) => m.id === 'festa-da-torcida'),
      clima: j.climaDaMusica,
    };
  }, PECAS);
  ok(premio.ari === 4 && premio.renan === 4, `as quatro peças no guarda-roupa dos dois (${premio.ari} e ${premio.renan})`);
  ok(premio.flag && premio.memoria, 'a festa fica anotada, e a memória entra no diário');
  ok(premio.clima !== 'festa-da-torcida', `a música volta à do ginásio (${premio.clima})`);
  await p.screenshot({ path: `${OUT}-depois.png` });
  // entrar de novo: sem festa
  await p.goto(`${BASE}/?cena=escola-ginasio`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.waitForTimeout(3500);
  const deNovo = await irmas(p);
  ok(!(await p.locator('.dialogue.show').count()) && !deNovo.luna?.festa, 'a festa não se repete');
  await p.close();
}

// ============================================================ 2b. a dança no celular
if (parte('celular')) {
  console.log('\n2b. a dança no celular em pé');
  const vp = { width: 390, height: 844 };
  const p = await abrir('escola-ginasio', terminou, [LICOES, 6, [...FLAGS, 'festa-da-torcida-convite']], vp);
  await falar(p, async () => (await irmas(p)).luna?.festa === true, 60);
  /** o canto mais à esquerda e o mais à direita das três na tela (pompons inclusos) */
  const naTela = () => p.evaluate(() => {
    const j = window.jogo;
    let min = Infinity;
    let max = -Infinity;
    j.current.world.root.traverse((o) => {
      const id = o.userData?.peca;
      if (!['luna', 'sol', 'estrella'].includes(id) || !o.userData.teste?.[id]) return;
      const caixa = new window.THREE_Box3().setFromObject(o);
      for (const x of [caixa.min.x, caixa.max.x]) for (const z of [caixa.min.z, caixa.max.z]) {
        const v = new caixa.min.constructor(x, (caixa.min.y + caixa.max.y) / 2, z).project(j.iso.camera);
        const px = (v.x + 1) / 2 * innerWidth;
        min = Math.min(min, px);
        max = Math.max(max, px);
      }
    });
    return { min, max };
  });
  await p.evaluate(() => {
    // a classe Box3 do próprio jogo, achada pela Vector3 da câmera
    const V = window.jogo.iso.camera.position.constructor;
    window.THREE_Box3 = class {
      setFromObject(o) {
        o.updateWorldMatrix(true, true);
        this.min = new V(Infinity, Infinity, Infinity);
        this.max = new V(-Infinity, -Infinity, -Infinity);
        const v = new V();
        o.traverse((m) => {
          const pos = m.geometry?.attributes?.position;
          if (!pos || !m.visible) return;
          for (let i = 0; i < pos.count; i += 7) {
            v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
            this.min.min(v);
            this.max.max(v);
          }
        });
        return this;
      }
    };
  });
  let pior = { min: Infinity, max: -Infinity };
  let foto = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 300000) {
    const r = await irmas(p);
    const t = await naTela();
    pior = { min: Math.min(pior.min, t.min), max: Math.max(pior.max, t.max) };
    if (!foto && (r.estrella.estrelinha && Math.cos(r.estrella.giroZ) < -0.3)) {
      foto = true;
      await p.screenshot({ path: `${OUT}-celular-estrelinha.png` });
    }
    if (r.luna.tempo > 10.2 || !r.luna.festa) break;
  }
  await p.screenshot({ path: `${OUT}-celular-final.png` });
  console.log(`      da esquerda ${pior.min.toFixed(0)} px à direita ${pior.max.toFixed(0)} px (tela de ${vp.width})`);
  ok(pior.min >= 0 && pior.max <= vp.width, 'as três cabem na tela do celular a dança inteira, estrelinha e pompons inclusos');
  await p.close();
}

// ============================================================ 3. a roupa
const vestir = (p, ari, renan) => p.evaluate(([ari, renan]) => {
  const j = window.jogo;
  const cat = window.aristoryItens;
  for (const [quem, ids] of [['ari', ari], ['renan', renan]]) {
    for (let v = 0; v < 6; v++) j.unequipWearable(v, quem);
    for (const id of ids) j.equipWearable(cat[id], quem);
  }
}, [ari, renan]);
const onde = (p) => p.evaluate(() => {
  const j = window.jogo;
  const r = {};
  for (const quem of [j.player, j.parceiro]) {
    const rig = quem.rig;
    const pais = {};
    rig.group.traverse((o) => {
      if (!o.userData.roupa) return;
      const pai = o.parent;
      const nome = pai === rig.head ? 'cabeca' : pai === rig.body ? 'corpo' : pai === rig.armL || pai === rig.armR ? 'braco'
        : pai === rig.legL || pai === rig.legR ? 'perna' : 'outro';
      (pais[o.userData.roupa] ??= new Set()).add(nome);
    });
    r[rig.spec.id] = Object.fromEntries(Object.entries(pais).map(([k, v]) => [k, [...v]]));
  }
  return r;
});
/** a câmera num ponto da pessoa, e a foto RECORTADA em volta dele (o zoom tem piso) */
const dePerto = async (p, quem, altura, nome, w = 300, h = 250) => {
  await p.evaluate(([quem, altura]) => {
    const j = window.jogo;
    const pessoa = quem === 'ari' ? j.player : j.parceiro;
    const foco = new pessoa.rig.group.constructor();
    pessoa.rig.group.getWorldPosition(foco.position);
    foco.position.y += altura;
    j.current.world.root.add(foco);
    j.focusCamera(foco);
    j.setZoom(0.6);
    window.__foco = foco;
  }, [quem, altura]);
  await p.waitForTimeout(1600);
  const c = await p.evaluate(() => {
    const v = window.__foco.position.clone().project(window.jogo.iso.camera);
    return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight };
  });
  await p.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: Math.max(0, c.x - w / 2), y: Math.max(0, c.y - h / 2), width: w, height: h } });
  await p.evaluate(() => { window.jogo.focusCamera(null); window.__foco.removeFromParent(); });
};

if (parte('roupa')) {
  console.log('\n3. a roupa de cheerleader');
  const p = await abrir('villa-lobos', () => {}, null, { width: 1000, height: 800 }, 2);
  await p.goto(`${BASE}/?cena=villa-lobos&em=-4.2,15.6&olhar=3.14`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.waitForTimeout(800);
  await vestir(p, PECAS, [...PECAS, 'tenis-dos-gatitos']);
  await p.waitForTimeout(400);
  const pais = await onde(p);
  ok(pais.ari['uniforme-de-torcida']?.includes('corpo') && pais.ari['meiao-de-torcida']?.includes('perna')
    && pais.ari['laco-de-torcida']?.includes('cabeca') && pais.ari['pompons-de-torcida']?.includes('braco'),
  'cada peça no pai certo: uniforme no corpo, meião na perna, laço na cabeça, pompom no braço');
  const pele = await p.evaluate(() => {
    const j = window.jogo;
    const rig = j.player.rig;
    // o braço (manga) e a perna saem de pele
    const t = rig.trocaMaterial;
    const manga = t.find((x) => x.slot === 'tronco' && x.parte === 'detalhe');
    const perna = t.find((x) => x.slot === 'pernas');
    return { manga: manga.mesh.material === manga.banho, perna: perna.mesh.material === perna.banho, calcao: rig.calcao.visible };
  });
  ok(pele.manga && pele.perna && pele.calcao, 'braço e perna de pele, e o shortinho azul por baixo da saia');
  await p.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, 0); window.jogo.setZoom(1.1); });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}-roupa-frente.png` });
  await p.evaluate(() => window.jogo.debugPlace(-4.2, 15.6, Math.PI));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}-roupa-costas.png` });
  await p.evaluate(() => window.jogo.setZoom(1.8));
  await p.keyboard.down('KeyD');
  await p.waitForTimeout(450);
  await p.screenshot({ path: `${OUT}-roupa-andando.png` });
  await p.keyboard.up('KeyD');
  // sentados no banco
  await p.evaluate(() => { window.jogo.debugPlace(-4.2, 15.6, Math.PI); window.jogo.setZoom(1.5); });
  await p.waitForTimeout(400);
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(1200);
  for (let i = 0; i < 20 && !(await p.locator('.escolhas button').count()); i++) {
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(400);
  }
  await p.addStyleTag({ content: '.dialogue{visibility:hidden}' });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}-roupa-sentados.png` });
  await p.close();

  // de perto, no ginásio (piso aberto, sem zona de câmera)
  const g = await abrir('escola-ginasio', () => {}, null, { width: 1000, height: 800 }, 2);
  await g.goto(`${BASE}/?cena=escola-ginasio&em=5,6`, { waitUntil: 'networkidle' });
  await g.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await g.waitForTimeout(800);
  await vestir(g, PECAS, [...PECAS, 'tenis-dos-gatitos']);
  await g.evaluate(() => window.jogo.debugPlace(5, 6, Math.PI / 4));
  await g.waitForTimeout(900);
  await dePerto(g, 'ari', 0.62, 'perto-ari-frente', 300, 340);
  await dePerto(g, 'renan', 0.62, 'perto-renan-frente', 300, 340);
  await dePerto(g, 'ari', 1.35, 'perto-laco');
  await dePerto(g, 'ari', 0.3, 'perto-saia');
  await dePerto(g, 'ari', 0.12, 'perto-meiao');
  await g.evaluate(() => window.jogo.debugPlace(5, 6, -3 * Math.PI / 4));
  await g.waitForTimeout(900);
  await dePerto(g, 'ari', 0.62, 'perto-ari-costas', 300, 340);
  await dePerto(g, 'renan', 0.75, 'perto-renan-costas', 300, 380);
  // o boneco do painel
  await g.evaluate((pecas) => {
    const j = window.jogo;
    for (const id of pecas) j.ganharPeca(window.aristoryItens[id]);
    j.abrirGuardaRoupa();
  }, PECAS);
  await g.waitForTimeout(1400);
  await g.screenshot({ path: `${OUT}-painel.png` });
  await g.close();
}

// ============================================================ 4. o vestiário
if (parte('vestiario')) {
  console.log('\n4. o vestiário da escola');
  const p = await abrir('escola-ginasio', terminou, [LICOES, 3, FLAGS]);
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.jogo.abrirVestiarioDaEscola());
  await p.waitForTimeout(800);
  const vitrine = () => p.evaluate((pecas) => [...document.querySelectorAll('.armario .vitrine-piscina .produto')]
    .filter((b) => pecas.includes(b.dataset.id))
    .map((b) => ({ id: b.dataset.id, trancada: b.classList.contains('trancada'), etiqueta: b.querySelector('em').textContent })), PECAS);
  let v = await vitrine();
  ok(v.length === 4 && v.every((x) => x.trancada && /terminar o módulo/.test(x.etiqueta)),
    `antes da festa, a roupa de torcida aparece trancada ("${v[0]?.etiqueta}")`);
  await p.evaluate((pecas) => {
    const j = window.jogo;
    j.ui.fecharArmario();
    for (const id of pecas) j.ganharPeca(window.aristoryItens[id]);
    j.abrirVestiarioDaEscola();
  }, PECAS);
  await p.waitForTimeout(800);
  v = await vitrine();
  ok(v.every((x) => !x.trancada), 'depois, destrancada');
  for (const id of PECAS) {
    await p.click(`.armario .vitrine-piscina .produto[data-id="${id}"]`);
    await p.waitForTimeout(250);
  }
  const vestida = await p.evaluate((pecas) => {
    const j = window.jogo;
    const ids = j.save.vestiveis(j.playerId()).map((x) => x?.id);
    return pecas.every((id) => ids.includes(id));
  }, PECAS);
  ok(vestida, 'um clique em cada peça veste a roupa inteira');
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}-vestiario.png` });
  await p.close();
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'console limpo');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
