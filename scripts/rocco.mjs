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
 * Uso: node scripts/rocco.mjs /tmp/rc
 *      SO=modelo|rotas|estrada roda uma parte; CEL=1 a estrada no celular em pé
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

const browser = parte('modelo') || parte('estrada') ? await chromium.launch({
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
  assert.deepEqual(erros, []);
  console.log('O Rocco está na estrada.');
} finally {
  await browser?.close();
}
