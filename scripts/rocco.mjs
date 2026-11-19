/**
 * O ROCCO, o lobo capitão dos Dogões e rival do Flynn (docs/CARROS-DA-ESCOLA.md, "O rival do Flynn").
 *
 * MODELO   parado no pátio da escola pelo atalho `?rocco=x,z,giro&comFlynn`: os pés no chão, maior que o Flynn,
 *          o uniforme dos Dogões no corpo (a faixa, a plaquinha, o pin de osso, a braçadeira), e fotos de perto de
 *          frente, de lado, de costas, do rosto e ao lado do Flynn.
 * ROTAS    sem navegador: ele NÃO entra no sorteio (as rotas não mudam) — corre no lugar do Flynn: nunca antes de
 *          a dupla cruzar o Flynn na estrada, sempre na primeira depois, e meio a meio dali em diante.
 * ESTRADA  casa → escola numa rota do Flynn: SEM a memória do Flynn na estrada, quem vem é o Flynn; com ela, o
 *          ROCCO (o uivo na chegada e na saída, ele na calçada passando o Bebito mais rápido que o carro, parado
 *          trotando e virado para o carro, a apresentação — "quem é você?", os Dogões, o rival —, nada de toca aqui
 *          nem vidro descendo, a memória "O rival" e o save de verdade intacto); e uma segunda viagem já conhecendo,
 *          com a fala curta.
 *
 * GINASIO  o UM CONTRA UM com o Flynn no ginásio dos Gatitos: sem a memória da estrada, o treino do Flynn de sempre
 *          (e nada do Rocco); com ela mas antes do Módulo 2 (o Flynn ainda no refeitório), nada; com as duas, os dois
 *          jogando — os pés no chão, a posse trocando, a bola quicando no drible, cesta dos dois, nunca um em cima do
 *          outro, fotos de perto de cada momento (drible, marcação, arremesso, rebote, a pegada) nas duas cestas, e a
 *          CONVERSA (os dois param num ponto seguro, a apresentação, a memória "Um contra um" e o jogo voltando).
 *
 * Uso: node scripts/rocco.mjs /tmp/rc
 *      SO=modelo|rotas|estrada|ginasio roda uma parte; CEL=1 a estrada no celular em pé
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/rocco';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const CEL = !!process.env.CEL;
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { gerarRota, candidatosAoEncontro, oRoccoCorreNoLugar } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
const SENTIDO = 'casa-escola';
const FLAGS = ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'flynn-conhecido'];
/** as rotas casa → escola em que corre o Flynn; a segunda é uma em que, já conhecendo os dois, vem o Rocco */
const doFlynn = [];
for (let s = 1; doFlynn.length < 60; s++) if (gerarRota(s, SENTIDO).encontro?.personagem === 'flynn') doFlynn.push(s);
const PRIMEIRA = doFlynn[0];
const SEGUNDA = doFlynn.find((s) => s !== PRIMEIRA && oRoccoCorreNoLugar(s, true, true));

// ------------------------------------------------------------------ as rotas, sem navegador
if (parte('rotas')) {
  for (const sentido of ['casa-escola', 'escola-casa', 'parque-escola', 'clube-escola', 'escola-parque', 'escola-clube', 'ida', 'volta', 'casa-clube', 'parque-clube']) {
    assert.ok(!candidatosAoEncontro(sentido).includes('rocco'), `o Rocco não entra no sorteio de ${sentido}`);
  }
  let rocco = 0;
  for (const s of doFlynn) {
    assert.equal(oRoccoCorreNoLugar(s, false, false), false, 'antes de cruzar o Flynn na estrada, nunca o Rocco');
    assert.equal(oRoccoCorreNoLugar(s, false, true), false);
    assert.equal(oRoccoCorreNoLugar(s, true, false), true, 'a primeira corrida depois do Flynn é a do Rocco');
    if (oRoccoCorreNoLugar(s, true, true)) rocco++;
  }
  console.log(`ROTAS: o Rocco fora do sorteio; nas ${doFlynn.length} rotas do Flynn, já conhecendo os dois, o Rocco corre em ${rocco}`);
  assert.ok(rocco > doFlynn.length * 0.3 && rocco < doFlynn.length * 0.7, 'depois, meio a meio');
  assert.ok(SEGUNDA, 'tem uma rota de segunda vez para o teste');
}

const browser = parte('modelo') || parte('estrada') || parte('ginasio') ? await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
}) : null;
const erros = [];
try {
  // ---------------------------------------------------------------- o modelo
  if (parte('modelo')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?semHalloween&cena=escola-patio&rocco=0,6,0.785&comFlynn`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning && window.rocco, null, { timeout: 120000 });
    await page.evaluate(() => window.jogo.debugPlace(-14, -6, 0));
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const r = window.rocco.group;
      r.updateMatrixWorld(true);
      const caixa = (g) => {
        let min = 99, max = -99;
        g.traverse((o) => {
          if (!o.isMesh || !o.visible) return;
          o.geometry.computeBoundingBox();
          const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
          min = Math.min(min, b.min.y); max = Math.max(max, b.max.y);
        });
        return { min, max };
      };
      const flynn = window.flynnDoLado?.group;
      const nomes = new Set();
      r.traverse((o) => nomes.add(o.name));
      return { rocco: caixa(r), flynn: flynn ? caixa(flynn) : null, nomes: [...nomes] };
    });
    console.log(`MODELO: piso ${m.rocco.min.toFixed(3)} · topo ${m.rocco.max.toFixed(2)} (o Flynn: ${m.flynn?.max.toFixed(2)})`);
    assert.ok(m.rocco.min > -0.02 && m.rocco.min < 0.03, 'os pés no chão');
    assert.ok(m.flynn && m.rocco.max > m.flynn.max + 0.03, 'mais alto que o Flynn');
    console.log(`  peças com nome: ${m.nomes.filter(Boolean).join(', ')}`);
    assert.ok(m.nomes.includes('cabeca-do-rocco'), 'a cabeça dele, pelo nome');
    const dePerto = async (giro, altura, nome, w = 320, h = 400) => {
      await page.evaluate(([giro, altura]) => {
        const j = window.jogo;
        window.rocco.group.rotation.y = giro;
        const foco = new window.rocco.group.constructor();
        window.rocco.group.getWorldPosition(foco.position);
        foco.position.y += altura;
        j.current.world.root.add(foco);
        j.focusCamera(foco);
        j.setZoom(0.6);
        window.__foco = foco;
      }, [giro, altura]);
      await page.waitForTimeout(2600);
      const c = await page.evaluate(() => {
        const v = window.__foco.position.clone().project(window.jogo.iso.camera);
        return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight };
      });
      await page.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: Math.max(0, c.x - w / 2), y: Math.max(0, c.y - h / 2), width: w, height: h } });
      await page.evaluate(() => { window.jogo.focusCamera(null); window.__foco.removeFromParent(); });
    };
    await dePerto(0.785, 0.8, 'lado-a-lado', 520, 460);
    await dePerto(0.785, 0.85, 'frente');
    await dePerto(-0.785, 0.85, 'lado');
    await dePerto(-2.36, 0.85, 'costas');
    await dePerto(0.785, 1.12, 'rosto', 260, 220);
    await page.context().close();
  }

  // ---------------------------------------------------------------- a estrada
  if (parte('estrada')) {
    const tela = CEL ? { width: 390, height: 844 } : { width: 1100, height: 760 };
    const page = await (await browser.newContext({ viewport: tela })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.evaluate((flags) => { for (const f of flags) window.jogo.setFlag(f); }, FLAGS);
    const sufixo = CEL ? '-celular' : '';
    const abrir = async (semente) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=${SENTIDO},ari,${semente}`);
      await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem && !window.jogo.transitioning, null, { timeout: 120000 });
      return page.evaluate(() => window.jogo.current.world.root.userData.novidadesDaViagem.encontro?.personagem ?? null);
    };

    // 1. antes de a dupla cruzar o Flynn na estrada, a corrida é dele
    const antes = await abrir(PRIMEIRA);
    console.log(`ESTRADA: semente ${PRIMEIRA}, sem a memória do Flynn na estrada → ${antes}`);
    assert.equal(antes, 'flynn', 'antes de conhecer o Flynn na estrada, quem corre é ele');
    await page.evaluate(() => window.jogo.unlock({ id: 'flynn-na-estrada', title: 'A corrida matinal', place: 'Na estrada', icon: '🦊', note: 'teste' }));

    const viajar = async (semente, rotulo, primeira) => {
      const quem = await abrir(semente);
      console.log(`ESTRADA (${rotulo}): semente ${semente} → ${quem}`);
      assert.equal(quem, 'rocco', 'com o Flynn já cruzado, vem o Rocco');
      const estado = () => page.evaluate(() => {
        const g = window.jogo;
        const n = g.current.world.root.userData.novidadesDaViagem;
        const c = n.encontro?.carro;
        return {
          fase: n.encontro?.estado.fase, relativo: n.encontro?.estado.relativo,
          uivo: g.audio.contagem.get('uivo') ?? 0, apito: g.audio.contagem.get('apito') ?? 0,
          corrida: c?.flynn.naEstrada.corrida ?? 0, trote: !!c?.flynn.naEstrada.trote, y: c?.group.position.y ?? 0,
          pata: c?.flynn.naEstrada.tocaAqui ?? 0, janela: n.bebito.janelaAberta, peca: c?.group.userData.peca,
          agulha: !!document.querySelector('.dialogue .hora-certa.show'),
          dialogo: document.querySelector('.dialogue.show')?.textContent ?? '',
          toast: document.querySelector('.toasts')?.textContent ?? '',
        };
      });
      const e0 = await estado();
      assert.equal(e0.peca, 'corrida-do-rocco');
      await page.mouse.click(tela.width - 20, tela.height - 20); // (o som só acorda depois de um toque na página)
      await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
      let uivoNaChegada = 0, maisRapido = 0, naCalcada = true, ultrapassou = false, conversa = false, trotou = false;
      let agulha = false, janela = 0, pata = 0, ditos = '', toasts = '';
      const t0 = Date.now();
      while (Date.now() - t0 < 400000) {
        const e = await estado();
        if (e.fase === 'alinhando' && !uivoNaChegada) uivoNaChegada = e.uivo;
        if (e.dialogo && !ditos.endsWith(e.dialogo)) ditos += ' | ' + e.dialogo;
        if (e.toast && !toasts.includes(e.toast)) toasts += ' | ' + e.toast;
        if (e.agulha) agulha = true;
        janela = Math.max(janela, e.janela);
        pata = Math.max(pata, e.pata);
        if (e.fase === 'ultrapassando') {
          maisRapido = Math.max(maisRapido, e.corrida);
          if (e.y < 0.1) naCalcada = false;
          if (!ultrapassou && e.relativo > -2) {
            ultrapassou = true;
            await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 0; });
            await page.waitForTimeout(500);
            await page.screenshot({ path: `${OUT}-${rotulo}-1-passando${sufixo}.png` });
            await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 3; });
          }
        }
        if (e.fase === 'falando' && !conversa) {
          conversa = true;
          await page.waitForTimeout(1500);
          const agora = await estado();
          ditos += ' | ' + agora.dialogo;
          trotou = agora.trote;
          if (agora.y < 0.1) naCalcada = false;
          console.log(`  parado ${agora.relativo.toFixed(2)} m à frente do meio do Bebito, na altura ${agora.y.toFixed(2)}`);
          await page.screenshot({ path: `${OUT}-${rotulo}-2-conversa${sufixo}.png` });
          const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
          console.log(`  peso na conversa: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
        }
        if (conversa && e.dialogo.includes('rival') && !ditos.includes('§rival')) {
          ditos += '§rival';
          await page.screenshot({ path: `${OUT}-${rotulo}-3-rival${sufixo}.png` });
        }
        if (e.fase === 'saindo' && !ditos.includes('§saindo')) {
          ditos += '§saindo';
          await page.waitForTimeout(700);
          await page.screenshot({ path: `${OUT}-${rotulo}-4-saindo${sufixo}.png` });
        }
        if (e.fase === 'feito') break;
        await page.evaluate(() => { if (!document.querySelector('.escolhas.show button') && !document.querySelector('.dialogue .hora-certa.show')) document.querySelector('.dialogue.show')?.click(); });
        await page.waitForTimeout(90);
      }
      const fim = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
        return { uivo: window.jogo.audio.contagem.get('uivo') ?? 0, apito: window.jogo.audio.contagem.get('apito') ?? 0, memoria: (save.memories ?? []).some((m) => m.id === 'rocco-na-estrada') };
      });
      console.log(`  corrida ${maisRapido.toFixed(2)}× o Bebito | na calçada ${naCalcada} | trote ${trotou} | uivo ${fim.uivo} | memória ${fim.memoria}`);
      console.log(`  falas:${ditos.replaceAll('§rival', '').replaceAll('§saindo', '')}`);
      assert.ok(uivoNaChegada >= 1 && fim.uivo >= 3, 'o uivo na chegada, na conversa e na saída');
      assert.ok(maisRapido > 1.5, 'ele passa o Bebito correndo MAIS RÁPIDO que o carro');
      assert.ok(naCalcada, 'ele fica em cima da calçada, correndo e conversando');
      assert.ok(conversa && trotou, 'a conversa trotando no lugar');
      assert.ok(!agulha && janela < 0.02 && pata < 0.05, 'nada de toca aqui: sem hora certa, sem vidro descendo, sem pata no alto');
      assert.ok(fim.memoria, 'a memória "O rival"');
      if (primeira) {
        assert.match(toasts, /quem é esse lobo/);
        assert.match(ditos, /Quem é você/);
        assert.match(ditos, /Dogões/);
        assert.match(ditos, /rival do Flynn/);
      } else {
        assert.match(ditos, /de novo/);
        assert.doesNotMatch(ditos, /Quem é você/);
      }
      assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
    };
    await viajar(PRIMEIRA, 'primeira', true);
    await viajar(SEGUNDA, 'segunda', false);
    await page.context().close();
  }
  // ---------------------------------------------------------------- o ginásio
  if (parte('ginasio')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    const M1 = ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho'];
    const BASICO = ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'escola-visitada', 'escola-ginasio', 'flynn-conhecido', 'flynn-treinando'];
    const pronto = () => page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    const jogo = () => page.evaluate(() => {
      let u = null, f = null;
      window.jogo.current.world.root.traverse((o) => {
        if (!u && o.userData?.teste?.umContraUm) u = o;
        if (!f && o.userData?.teste?.flynn) f = o;
      });
      return { umContraUm: !!u, treinoDoFlynn: !!f?.userData.teste.treino };
    });
    /** um save limpo (no preview), com o que cada caso pede */
    const abrir = async (rotulo, { modulo2, rocco }) => {
      await page.goto(`${BASE}/?semHalloween&cena=escola`);
      await pronto();
      await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
      await page.goto(`${BASE}/?semHalloween&cena=escola`);
      await pronto();
      await page.evaluate(([flags, m1, modulo2, rocco]) => {
        const j = window.jogo;
        for (const f of flags) j.setFlag(f);
        if (modulo2) {
          j.setFlag('festa-da-torcida');
          for (const id of m1) { j.save.abrirLicao(id); j.save.concluirLicao(id, 3); }
          j.save.abrirLicao('um-dia-de-gatito');
        }
        if (rocco) j.unlock({ id: 'rocco-na-estrada', title: 'O rival', place: 'Na estrada', icon: '🐺', note: 'teste' });
      }, [BASICO, M1, modulo2, rocco]);
      await page.goto(`${BASE}/?semHalloween&cena=escola-ginasio&em=0,5`);
      await pronto();
      await page.waitForTimeout(800);
      const r = await jogo();
      console.log(`GINÁSIO (${rotulo}): um contra um ${r.umContraUm} | treino do Flynn ${r.treinoDoFlynn}`);
      return r;
    };
    let r = await abrir('sem conhecer o Rocco', { modulo2: true, rocco: false });
    assert.ok(!r.umContraUm && r.treinoDoFlynn, 'sem a memória da estrada, o treino do Flynn de sempre');
    r = await abrir('antes do Módulo 2', { modulo2: false, rocco: true });
    assert.ok(!r.umContraUm && !r.treinoDoFlynn, 'com o Flynn ainda no refeitório, ninguém joga');
    r = await abrir('os dois', { modulo2: true, rocco: true });
    assert.ok(r.umContraUm && !r.treinoDoFlynn, 'com as duas coisas, o um contra um no lugar do treino');

    const u = (f) => page.evaluate((f) => {
      let t = null;
      window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.umContraUm) t = o.userData.teste.umContraUm; });
      return new Function('u', `return (${f})(u)`)(t);
    }, f.toString());
    const estado = () => u((t) => {
      const b = t.posicaoDaBola();
      return { el: window.jogo.elapsed, at: t.atacante, bola: t.bola, est: t.estados(), pts: t.pontos, pausado: t.pausado,
        f: { x: t.flynn.x, z: t.flynn.z }, r: { x: t.rocco.x, z: t.rocco.z }, b: { x: b.x, y: b.y, z: b.z }, m: JSON.parse(JSON.stringify(t.medidas)) };
    });
    // os pés no chão (os dois parados, um instante)
    const pes = await u((t) => {
      const min = (g) => { let m = 99; g.updateMatrixWorld(true); g.traverse((o) => { if (o.isMesh && o.visible) { o.geometry.computeBoundingBox(); m = Math.min(m, o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).min.y); } }); return m; };
      return { flynn: min(t.flynn.group), rocco: min(t.rocco.group) };
    });
    console.log(`  pés: Flynn ${pes.flynn.toFixed(3)} · Rocco ${pes.rocco.toFixed(3)}`);
    assert.ok(pes.flynn > -0.03 && pes.rocco > -0.03, 'ninguém abaixo do chão');

    // a câmera segue a jogada de perto (quem ataca, ou o meio dos dois quando estão perto)
    await page.evaluate(() => {
      let t = null;
      window.jogo.current.world.root.traverse((o) => { if (!t && o.userData?.teste?.umContraUm) t = o.userData.teste.umContraUm; });
      const foco = new t.flynn.group.constructor();
      window.jogo.current.world.root.add(foco);
      window.jogo.focusCamera(foco);
      window.jogo.setZoom(5.5);
      window.__seguir = true;
      const loop = () => {
        if (!window.__seguir) return;
        const a = t.atacante === 'flynn' ? t.flynn : t.rocco, d = t.atacante === 'flynn' ? t.rocco : t.flynn;
        const perto = Math.hypot(a.x - d.x, a.z - d.z) < 3.5;
        foco.position.set(perto ? (a.x + d.x) / 2 : a.x, 0.9, perto ? (a.z + d.z) / 2 : a.z);
        requestAnimationFrame(loop);
      };
      loop();
    });
    const fotos = new Set();
    let ultimo = '';
    let maiorBola = 0, menorBola = 99, fora = 0;
    const t0 = Date.now();
    while (Date.now() - t0 < 420000) {
      const e = await estado();
      if (e.bola === 'drible') { maiorBola = Math.max(maiorBola, e.b.y); menorBola = Math.min(menorBola, e.b.y); }
      // ninguém sai da quadra (22 × 12, o meio em z = -0,5)
      for (const q of [e.f, e.r]) if (Math.abs(q.x) > 11 || Math.abs(q.z + 0.5) > 6) fora++;
      const chave = `${e.est[e.at]}-${e.bola}-${e.at}`;
      if (chave !== ultimo) {
        ultimo = chave;
        const nome = `${e.at}-${e.est[e.at]}-${e.bola}`;
        if (!fotos.has(nome) && ['driblando-drible', 'arremessando-arco', 'depois-caindo', 'depois-rebote', 'pegando-na-mao', 'arremessando-na-mao'].some((k) => nome.endsWith(k))) {
          fotos.add(nome);
          await page.waitForTimeout(nome.endsWith('driblando-drible') ? 900 : 120);
          await page.screenshot({ path: `${OUT}-ginasio-${nome}.png` });
        }
      }
      if (e.m.cestas.flynn >= 1 && e.m.cestas.rocco >= 1 && e.m.erros >= 1 && e.m.posses >= 4) break;
      await page.waitForTimeout(120);
    }
    const fim = await estado();
    console.log(`  ${fim.el.toFixed(0)} s de jogo: ${fim.m.posses} trocas de posse, cestas Flynn ${fim.m.cestas.flynn} · Rocco ${fim.m.cestas.rocco}, ${fim.m.erros} no aro, ${fim.m.quiques} quiques no drible (a bola de ${menorBola.toFixed(2)} a ${maiorBola.toFixed(2)} m), o mais perto um do outro ${fim.m.menorDistancia.toFixed(2)} m`);
    assert.ok(fim.m.cestas.flynn >= 1 && fim.m.cestas.rocco >= 1, 'os dois fazem cesta');
    assert.ok(fim.m.erros >= 1, 'e uma bate no aro (o rebote)');
    assert.ok(fim.m.posses >= 4, 'a posse troca');
    assert.ok(fim.m.quiques > 10 && menorBola < 0.2 && maiorBola > 0.4, 'a bola quica no drible, do chão até a pata');
    assert.ok(fim.m.menorDistancia > 0.6, 'nunca um em cima do outro');
    assert.equal(fora, 0, 'ninguém sai da quadra');

    // A CONVERSA: a dupla chega perto de quem está com a bola, o prompt, e o E
    await page.evaluate(() => { window.__seguir = false; window.jogo.focusCamera(null); window.jogo.setZoom(13); });
    let prompt = '';
    for (let i = 0; i < 120 && !/Flynn e o Rocco/.test(prompt); i++) {
      const e = await estado();
      if (e.bola === 'drible' || e.bola === 'chao') {
        const a = e.at === 'flynn' ? e.f : e.r;
        await page.evaluate(({ x, z }) => window.jogo.debugPlace(x + 0.7, z + 0.7, Math.atan2(-0.7, -0.7)), a);
      }
      await page.waitForTimeout(150);
      prompt = await page.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? '');
    }
    console.log(`  prompt: "${prompt}"`);
    assert.match(prompt, /Falar com o Flynn e o Rocco/);
    const possesAntes = (await estado()).m.posses;
    await page.keyboard.press('KeyE');
    const falas = [];
    let fotoDaConversa = false;
    for (let i = 0; i < 160; i++) {
      const e = await estado();
      const dialogo = await page.evaluate(() => document.querySelector('.dialogue.show') ? `${document.querySelector('.dialogue .who')?.textContent}: ${document.querySelector('.dialogue .text')?.textContent}` : '');
      if (dialogo) {
        assert.ok(e.pausado, 'conversando, o jogo para');
        await page.waitForTimeout(450);
        const d = await page.evaluate(() => `${document.querySelector('.dialogue .who')?.textContent}: ${document.querySelector('.dialogue .text')?.textContent}`);
        if (!falas.includes(d)) falas.push(d);
        if (!fotoDaConversa && /rival|melhor/.test(d)) {
          fotoDaConversa = true;
          await page.screenshot({ path: `${OUT}-ginasio-conversa.png` });
        }
        await page.keyboard.press('KeyE');
      } else if (falas.length > 3 && !e.pausado) break;
      await page.waitForTimeout(150);
    }
    console.log('  ' + falas.join('\n  '));
    const memoria = await page.evaluate(() => window.jogo.temMemoria('um-contra-um-no-ginasio'));
    assert.ok(falas.some((f) => /^Rocco: /.test(f)) && falas.some((f) => /^Flynn: /.test(f)), 'os dois falam');
    assert.ok(memoria, 'a memória "Um contra um"');
    // o jogo volta
    const t1 = Date.now();
    let registro = 0;
    while (Date.now() - t1 < 120000 && (await estado()).m.posses === possesAntes) {
      await page.waitForTimeout(300);
      if (Date.now() - t1 > registro * 15000) {
        registro++;
        const e = await estado();
        const eu = await page.evaluate(() => ({ p: window.jogo.playerPosition(), c: window.jogo.companionPosition() }));
        console.log(`  esperando o jogo voltar: ${JSON.stringify({ at: e.at, bola: e.bola, est: e.est, pausado: e.pausado, f: e.f, r: e.r, eu })}`);
      }
    }
    assert.ok((await estado()).m.posses > possesAntes, 'e o jogo volta de onde parou');
    const peso = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    console.log(`  peso do ginásio (vista de sempre): ${peso.calls} desenhos, ${Math.round(peso.triangles / 1000)} mil triângulos`);
    await page.context().close();
  }
  assert.deepEqual(erros, []);
  console.log('O Rocco está na estrada.');
} finally {
  await browser?.close();
}
