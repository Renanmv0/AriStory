/**
 * A CORRIDA MATINAL DO FLYNN (docs/CARROS-DA-ESCOLA.md §3): ele não tem carro,
 * vem A PÉ pela calçada, mais rápido que o Bebito, para do lado trotando no
 * lugar, conversa e pede um TOCA AQUI pela janela de quem vai de carona.
 *
 * ROTAS    sem navegador: o Flynn mora na escola (casa ↔ escola sorteia entre ele
 *          e a Tia Liz; parque ↔ escola e clube ↔ escola também podem trazer ele).
 * ESTRADA  casa → escola: SEM conhecer o Flynn, nada de corrida e a bola dele
 *          escapa na calçada como sempre; conhecido, a corrida (o apito na chegada,
 *          ele na calçada passando o Bebito mais rápido que o carro, sem a bola na
 *          mesma viagem), a conversa trotando no lugar, o vidro da carona descendo,
 *          o braço pela janela, a pata dele no alto, o TAPA na hora certa (as duas
 *          mãos se encontrando, medido), o som, a memória e o save de verdade
 *          intacto; e uma segunda viagem ERRANDO o tapa (a mão passa no vento).
 *
 * Uso: node scripts/corridaDoFlynn.mjs /tmp/fy
 *      SO=rotas|estrada roda uma parte; CEL=1 a estrada no celular em pé
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/corrida-do-flynn';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { gerarRota, candidatosAoEncontro } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
const SENTIDO = 'casa-escola';
const sementes = [];
for (let s = 1; sementes.length < 2; s++) if (gerarRota(s, SENTIDO).encontro?.personagem === 'flynn') sementes.push(s);
const FLAGS = ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'escola-aberta', 'luna-na-escola', 'gatito-conhecido'];
const CEL = !!process.env.CEL;

// ------------------------------------------------------------------ as rotas, sem navegador
if (parte('rotas')) {
  const conta = {};
  for (const sentido of ['casa-escola', 'escola-casa', 'parque-escola', 'clube-escola', 'escola-parque', 'escola-clube']) {
    assert.ok(candidatosAoEncontro(sentido).includes('flynn'), `o Flynn pode aparecer em ${sentido}`);
    for (let s = 1; s <= 300; s++) { const q = gerarRota(s, sentido).encontro?.personagem; conta[q] = (conta[q] ?? 0) + 1; }
  }
  for (const sentido of ['ida', 'volta', 'casa-clube', 'parque-clube']) assert.ok(!candidatosAoEncontro(sentido).includes('flynn'), `e não em ${sentido}`);
  console.log(`ROTAS: nas 1800 viagens da escola, o Flynn ${conta.flynn} e a Tia Liz ${conta.tializ}`);
  assert.ok(conta.flynn > 150 && conta.tializ > 150, 'os dois aparecem bastante');
}

const browser = parte('estrada') ? await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
}) : null;
const erros = [];
try {
  if (parte('estrada')) {
    const tela = CEL ? { width: 390, height: 844 } : { width: 1100, height: 760 };
    const page = await (await browser.newContext({ viewport: tela })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    const sufixo = CEL ? '-celular' : '';
    const viajar = async (semente, rotulo, conhecido, acertar) => {
      await page.evaluate(([flags, conhecido]) => { for (const f of flags) window.jogo.setFlag(f); window.jogo.setFlag('flynn-conhecido', conhecido); }, [FLAGS, conhecido]);
      await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=${SENTIDO},ari,${semente}`);
      await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem && !window.jogo.transitioning, null, { timeout: 120000 });
      const bolaNaCena = () => page.evaluate(() => { let n = 0; window.jogo.scene.traverse((o) => { if (o.userData.peca === 'bola-do-flynn') n++; }); return n; });
      if (!conhecido) {
        const r = await page.evaluate(() => ({ encontro: !!window.jogo.current.world.root.userData.novidadesDaViagem.encontro }));
        console.log(`ESTRADA (${rotulo}): semente ${semente}, o Flynn ainda não conhecido | encontro ${r.encontro} | bola ${await bolaNaCena()}`);
        assert.equal(r.encontro, false, 'antes de conhecer o Flynn, nada de corrida');
        return '';
      }
      const estado = () => page.evaluate(() => {
        const g = window.jogo;
        const n = g.current.world.root.userData.novidadesDaViagem;
        const c = n.encontro?.carro;
        return {
          quem: n.encontro?.personagem, fase: n.encontro?.estado.fase, relativo: n.encontro?.estado.relativo,
          apito: g.audio.contagem.get('apito') ?? 0, toca: g.audio.contagem.get('tocaAqui') ?? 0,
          corrida: c?.flynn.naEstrada.corrida ?? 0, trote: !!c?.flynn.naEstrada.trote, y: c?.group.position.y ?? 0,
          pata: c?.flynn.naEstrada.tocaAqui ?? 0, janela: n.bebito.janelaAberta, braco: n.encontro?.janela ?? 0,
          agulha: !!document.querySelector('.dialogue .hora-certa.show'),
          dialogo: document.querySelector('.dialogue.show')?.textContent ?? '',
        };
      });
      const e0 = await estado();
      console.log(`ESTRADA (${rotulo}): semente ${semente}, encontro com ${e0.quem} | bola ${await bolaNaCena()}`);
      assert.equal(e0.quem, 'flynn');
      assert.equal(await bolaNaCena(), 0, 'na viagem em que ele vem correndo, a bola dele não escapa na calçada');
      await page.mouse.click(tela.width - 20, tela.height - 20); // (o som só acorda depois de um toque na página)
      await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
      let apitoNaChegada = 0, maisRapido = 0, naCalcada = true, ultrapassou = false, conversa = false, trotou = false, agulha = false, ditos = '';
      let toca = null;
      const t0 = Date.now();
      while (Date.now() - t0 < 400000) {
        const e = await estado();
        if (e.fase === 'alinhando' && !apitoNaChegada) apitoNaChegada = e.apito;
        if (e.dialogo && !ditos.endsWith(e.dialogo)) ditos += ' | ' + e.dialogo;
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
          console.log(`  parado ${agora.relativo.toFixed(2)} m à frente do meio do Bebito`);
          await page.screenshot({ path: `${OUT}-${rotulo}-2-conversa${sufixo}.png` });
          const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
          console.log(`  peso na conversa: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
        }
        if (e.agulha && !agulha) {
          agulha = true;
          const antes = await estado();
          await page.screenshot({ path: `${OUT}-${rotulo}-3-toca-aqui${sufixo}.png` });
          // na hora certa (a agulha dentro da faixa) ou longe dela, de propósito
          await page.waitForFunction((acertar) => {
            const barra = document.querySelector('.dialogue .hora-certa');
            const z = barra.querySelector('.zona'), a = barra.querySelector('.agulha');
            const pos = parseFloat(a.style.left), ini = parseFloat(z.style.left), fim = ini + parseFloat(z.style.width);
            const dentro = pos > ini + 0.25 * (fim - ini) && pos < fim - 0.25 * (fim - ini);
            const longe = pos < ini - 25 || pos > fim + 25;
            if (acertar ? dentro : longe) { document.querySelector('.dialogue.show').click(); return true; }
            return false;
          }, acertar, { polling: 'raf', timeout: 60000 });
          // as duas mãos, quadro a quadro, até o tapa acabar
          toca = await page.evaluate(() => new Promise((resolve) => {
            const g = window.jogo;
            const n = g.current.world.root.userData.novidadesDaViagem;
            const quem = g.playerId() === 'ari' ? 'parceiro' : 'jogador';
            let menor = 99, t0 = performance.now(), fotoEm = null;
            const passo = () => {
              const m = g.maoDaJanela(quem), p = n.encontro.carro.pata();
              const d = m.distanceTo(p);
              if (d < menor) {
                menor = d; fotoEm = performance.now() - t0;
                const f = (v) => n.bebito.group.worldToLocal(v.clone()).toArray().map((x) => x.toFixed(2)).join(', ');
                window.__tocaAqui = `mão (${f(m)}) pata (${f(p)})`;
              }
              if (performance.now() - t0 < 2600) requestAnimationFrame(passo); else resolve({ menor, fotoEm });
            };
            requestAnimationFrame(passo);
          }));
          console.log('  no Bebito: ' + await page.evaluate(() => window.__tocaAqui));
          console.log(`  janela ${antes.janela.toFixed(2)} | braço ${antes.braco.toFixed(2)} | pata ${antes.pata.toFixed(2)} | as mãos chegaram a ${toca.menor.toFixed(2)} m`);
          assert.ok(antes.janela > 0.95, 'o vidro de quem vai de carona desceu');
          assert.ok(antes.pata > 0.9, 'a pata do Flynn está no alto');
          if (acertar) assert.ok(toca.menor < 0.2, `as duas mãos se encontram no tapa (${toca.menor.toFixed(2)} m)`);
          else assert.ok(toca.menor > 0.25, `errando, a mão passa no vento (${toca.menor.toFixed(2)} m)`);
          continue;
        }
        if (agulha && e.dialogo.includes(acertar ? 'campeão' : 'vento') && !ditos.includes('§foto')) {
          ditos += '§foto';
          await page.screenshot({ path: `${OUT}-${rotulo}-4-${acertar ? 'tapa' : 'no-vento'}${sufixo}.png` });
        }
        if (e.fase === 'saindo' && !ditos.includes('§saindo')) {
          ditos += '§saindo';
          await page.waitForTimeout(700);
          await page.screenshot({ path: `${OUT}-${rotulo}-5-saindo${sufixo}.png` });
        }
        if (e.fase === 'feito') break;
        await page.evaluate(() => { if (!document.querySelector('.escolhas.show button') && !document.querySelector('.dialogue .hora-certa.show')) document.querySelector('.dialogue.show')?.click(); });
        await page.waitForTimeout(90);
      }
      const fim = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
        const n = window.jogo.current.world.root.userData.novidadesDaViagem;
        return {
          apito: window.jogo.audio.contagem.get('apito') ?? 0, toca: window.jogo.audio.contagem.get('tocaAqui') ?? 0,
          memoria: (save.memories ?? []).some((m) => m.id === 'flynn-na-estrada'), janela: n.bebito.janelaAberta,
        };
      });
      console.log(`  corrida ${maisRapido.toFixed(2)}× o Bebito | na calçada ${naCalcada} | trote ${trotou} | apito ${fim.apito} | tapa ${fim.toca} | memória ${fim.memoria} | janela no fim ${fim.janela}`);
      assert.ok(apitoNaChegada >= 1 && fim.apito >= 3, 'o apito na chegada, na conversa e na saída');
      assert.ok(maisRapido > 1.5, 'ele passa o Bebito correndo MAIS RÁPIDO que o carro');
      assert.ok(naCalcada, 'correndo, ele fica em cima da calçada');
      assert.ok(conversa && trotou && agulha, `a conversa trotando no lugar e a hora certa (${conversa}, ${trotou}, ${agulha})`);
      assert.equal(fim.toca, acertar ? 1 : 0, 'o som do tapa só no acerto');
      assert.equal(fim.janela, 0, 'o vidro sobe de novo');
      assert.ok(fim.memoria, 'a memória "A corrida matinal"');
      assert.match(ditos, /toca aqui/);
      assert.match(ditos, /rivais/);
      assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
      return ditos;
    };
    await viajar(sementes[0], 'sem-conhecer', false, true);
    await viajar(sementes[0], 'acertando', true, true);
    await viajar(sementes[1], 'errando', true, false);
    await page.context().close();
  }
  assert.deepEqual(erros, []);
  console.log('A corrida matinal do Flynn está de pé.');
} finally {
  await browser?.close();
}
