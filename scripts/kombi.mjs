/**
 * A KOMBI DE SORVETE DO MANO (docs/KOMBI-DO-MANO.md).
 *
 * MODELO   parada no Villa Lobos pelo atalho `?kombi=x,z,giro`, com o Mano ao
 *          volante: nada abaixo do chão, a largura cabendo na faixa, e as
 *          fotos de perto de todos os lados (a cara com o V e o emblema, o teto
 *          com a neve e a casquinha de três bolas, a janela de venda fechada e
 *          aberta com as duas casquinhas, a traseira e o Mano ao volante).
 * ESTRADA  o encontro (rota casa → parque, semente com o Mano): a musiquinha
 *          tocando na chegada, o sopro do freezer e a GEADA no para-brisa
 *          (soprando, embaçado, desembaçando, foi, com foto), a conversa, as
 *          DUAS CASQUINHAS na mochila (morango do Ari, maracujá do Renan), a
 *          dancinha, a musiquinha de novo na saída e a memória.
 *
 * Uso: node scripts/kombi.mjs /tmp/km
 *      SO=modelo|estrada roda uma parte
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/kombi';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const PONTO = { x: -6, z: 30 };

// a semente da viagem com o Mano (a mesma conta do jogo)
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { gerarRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
let SEMENTE = 1;
while (gerarRota(SEMENTE, 'ida').encontro?.personagem !== 'mano') SEMENTE++;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
  // ------------------------------------------------------------------ o modelo
  if (parte('modelo')) {
    for (const conversando of [false, true]) {
      const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
      page.on('pageerror', (e) => erros.push(e.message));
      await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&kombi=${PONTO.x},${PONTO.z},0${conversando ? '&conversando' : ''}&em=${PONTO.x + 6},${PONTO.z + 8}`);
      await page.waitForFunction(() => window.kombi && window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(2500);
      if (!conversando) {
        const m = await page.evaluate(() => {
          const k = window.kombi; k.group.updateMatrixWorld(true);
          const V = k.group.position.constructor;
          const min = new V(Infinity, Infinity, Infinity), max = new V(-Infinity, -Infinity, -Infinity), p = new V();
          let malhas = 0, tri = 0;
          k.group.traverse((x) => {
            if (!x.isMesh) return;
            malhas++;
            const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (x.isInstancedMesh ? x.count : 1);
            if (!x.visible || x.isInstancedMesh) return;
            const pos = g.attributes.position;
            for (let i = 0; i < pos.count; i += 3) { p.fromBufferAttribute(pos, i).applyMatrix4(x.matrixWorld); min.min(p); max.max(p); }
          });
          return { min: min.toArray().map((v) => +v.toFixed(2)), max: max.toArray().map((v) => +v.toFixed(2)), malhas, triangulos: Math.round(tri) };
        });
        console.log('MODELO: medidas', JSON.stringify(m));
        assert.ok(m.min[1] > -0.03, 'nada abaixo do chão');
        assert.ok(m.max[0] - m.min[0] < 3.3, 'cabe na faixa (com os retrovisores)');
      }
      const foto = async (de, para, nome) => {
        await page.evaluate(([d, p, o]) => {
          const V = window.jogo.scene.position.constructor;
          window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + p[0], p[1], o.z + p[2]));
        }, [de, para, PONTO]);
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}-${nome}.png` });
      };
      if (!conversando) {
        await foto([3.6, 2.4, 6.4], [0, 1.4, 0.4], 'frente-diagonal');
        await foto([0, 1.3, 6.2], [0, 1.2, 1], 'frente');
        await foto([-6.2, 2.4, 1.2], [0, 1.5, 0], 'lado-da-janela');
        await foto([6.4, 2.6, -1.0], [0, 1.4, 0], 'lado-de-la');
        await foto([2.4, 2.6, -6.6], [0, 1.4, -0.5], 'tras');
        await foto([-2.5, 5.6, 3.5], [0, 2.6, -0.4], 'teto');
        await foto([-1.8, 2.0, 3.2], [-0.42, 1.8, 1.3], 'mano-ao-volante');
        await page.evaluate(() => { window.jogo.setCameraOmbro(null); window.jogo.focusCamera(window.kombi.group); window.jogo.setZoom(2.2); });
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}-isometrica.png` });
      } else {
        await foto([-4.8, 2.3, 0.4], [-0.6, 1.6, -0.6], 'janela-aberta');
        await foto([-2.4, 2.0, -0.2], [-1.0, 1.55, -0.6], 'casquinhas-na-bancada');
      }
      await page.context().close();
    }
  }

  // ------------------------------------------------------------------ na estrada
  if (parte('estrada')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.evaluate(() => { for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) window.jogo.setFlag(f); });
    await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=ida,ari,${SEMENTE}`);
    await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem?.encontro, null, { timeout: 120000 });
    const estado = () => page.evaluate(() => {
      const n = window.jogo.current.world.root.userData.novidadesDaViagem;
      return { quem: n.encontro.personagem, fase: n.encontro.estado.fase, geada: n.geada?.momento ?? null, musica: window.jogo.audio.contagem.get('musiquinhaDoSorvete') ?? 0 };
    });
    const e0 = await estado();
    console.log(`ESTRADA: semente ${SEMENTE}, encontro com ${e0.quem}`);
    assert.equal(e0.quem, 'mano');
    assert.equal(e0.geada, 'guardada');
    // (o som só acorda depois de um toque na página)
    await page.mouse.click(1080, 740);
    await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
    const momentos = new Set();
    let musicaNaChegada = 0, conversa = false, dancou = false;
    const t0 = Date.now();
    while (Date.now() - t0 < 400000) {
      const e = await estado();
      if (e.fase === 'alinhando' && !musicaNaChegada) musicaNaChegada = e.musica;
      if (e.geada && !momentos.has(e.geada)) {
        momentos.add(e.geada);
        if (e.geada === 'soprando' || e.geada === 'embacado' || e.geada === 'desembacando') {
          await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 0; });
          await page.waitForTimeout(e.geada === 'soprando' ? 200 : 500);
          await page.screenshot({ path: `${OUT}-geada-${momentos.size}-${e.geada}.png` });
          await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 1; });
          if (e.geada === 'soprando') {
            // no meio do sopro, os flocos voando
            await page.waitForTimeout(700);
            await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 0; });
            await page.waitForTimeout(300);
            await page.screenshot({ path: `${OUT}-geada-${momentos.size}-flocos.png` });
            await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 1; });
          }
        }
      }
      if (e.fase === 'falando' && !conversa) {
        conversa = true;
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${OUT}-conversa.png` });
      }
      const fala = await page.evaluate(() => document.querySelector('.dialogue.show')?.textContent ?? '');
      if (fala.includes('dancinha') && !dancou) {
        dancou = await page.evaluate(() => window.jogo.current.world.root.userData.novidadesDaViagem.encontro.carro.mano.estaDancando);
        await page.waitForTimeout(600);
        await page.screenshot({ path: `${OUT}-dancinha.png` });
      }
      if (e.fase === 'feito' && (e.geada === 'foi' || e.geada === 'guardada')) break;
      await page.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
      await page.waitForTimeout(90);
    }
    const fim = await page.evaluate(() => {
      const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
      return {
        musica: window.jogo.audio.contagem.get('musiquinhaDoSorvete') ?? 0,
        memoria: (save.memories ?? []).some((m) => m.id === 'mano-na-estrada'),
        mochila: JSON.stringify(save).match(/sorvete-(morango|maracuja)/g) ?? [],
      };
    });
    console.log('  geada:', [...momentos].join(' → '), '| musiquinha', fim.musica, 'vezes | casquinhas no save', fim.mochila.join(', '), '| memória', fim.memoria);
    for (const m of ['soprando', 'embacado', 'desembacando', 'foi']) assert.ok(momentos.has(m), `a geada passou por ${m}`);
    assert.ok(musicaNaChegada >= 1, 'a musiquinha toca quando a Kombi chega');
    assert.ok(fim.musica >= 2, 'e de novo quando ela vai embora');
    assert.ok(conversa && dancou, 'a conversa e a dancinha');
    assert.ok(fim.mochila.includes('sorvete-morango') && fim.mochila.includes('sorvete-maracuja'), 'as duas casquinhas na mochila');
    assert.ok(fim.memoria, 'a memória "A Kombi gelada"');
    assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
    await page.context().close();
  }
  assert.deepEqual(erros, []);
  console.log('A Kombi do Mano está de pé.');
} finally {
  await browser.close();
}
