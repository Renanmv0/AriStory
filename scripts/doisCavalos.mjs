/**
 * O 2CV DO JEAN-LUC (docs/DOIS-CAVALOS-DO-JEAN-LUC.md).
 *
 * MODELO   parado no Villa Lobos pelo atalho `?doisCavalos=x,z,giro`, com ele em
 *          pé no caixote: nada abaixo do chão, menor que o Bebito, a CABEÇA POR
 *          CIMA DO PARA-BRISA (os óculos escuros no ar, e não atrás do vidro),
 *          os ÓCULOS na frente das pupilas e acima do bico, a raquete guardada
 *          dirigindo e na janela no ponto de ping pong; e as fotos de todos os
 *          lados, de perto do rosto, da câmera do encontro, de trás (a câmera
 *          de perseguição: a mesa do bagageiro não tapa ele), andando e com a
 *          raquete na janela; e o 2CV VAZIO (o caixote do lado de fora).
 * PARQUE   ESTACIONADO no Villa Lobos só depois da memória do encontro, na vaga
 *          vizinha à do carrinho do Cookie, com a passagem de pedestres livre.
 * ESTRADA  o encontro (uma rota com o Jean-Luc): a buzina "pin-pon" na chegada e
 *          na saída, a conversa, a raquete na janela, a bolinha no ar, a hora
 *          certa de rebater, a memória e o save de verdade intacto.
 *
 * Uso: node scripts/doisCavalos.mjs /tmp/dc
 *      SO=modelo|parque|estrada roda uma parte; CEL=1 tira a foto da conversa no celular em pé
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/doisCavalos';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
const PONTO = { x: -6, z: 30 };

// a semente da viagem com o Jean-Luc (a mesma conta do jogo)
const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { gerarRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
let SEMENTE = 1;
while (gerarRota(SEMENTE, 'ida').encontro?.personagem !== 'jeanluc') SEMENTE++;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
  // ------------------------------------------------------------------ o modelo
  if (parte('modelo')) {
    const abrir = async (extra) => {
      const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
      page.on('pageerror', (e) => erros.push(e.message));
      await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&doisCavalos=${PONTO.x},${PONTO.z},0${extra}&em=${PONTO.x + 6},${PONTO.z + 8}`);
      await page.waitForFunction(() => window.doisCavalos && window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(2500);
      const foto = async (de, para, nome) => {
        await page.evaluate(([d, p, o]) => {
          const V = window.jogo.scene.position.constructor;
          window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + p[0], p[1], o.z + p[2]));
        }, [de, para, PONTO]);
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}-${nome}.png` });
      };
      const medir = () => page.evaluate(() => {
        const c = window.doisCavalos; c.group.updateMatrixWorld(true);
        const V = c.group.position.constructor;
        const caixa = (raiz, filtro = () => true) => {
          const min = new V(Infinity, Infinity, Infinity), max = new V(-Infinity, -Infinity, -Infinity), p = new V();
          raiz.traverse((x) => {
            if (!x.isMesh || x.isInstancedMesh || !filtro(x)) return;
            let visivel = true; for (let o = x; o; o = o.parent) if (!o.visible) visivel = false;
            if (!visivel) return;
            const pos = x.geometry.attributes.position;
            for (let i = 0; i < pos.count; i += 2) { p.fromBufferAttribute(pos, i).applyMatrix4(x.matrixWorld); c.group.worldToLocal(p); min.min(p); max.max(p); }
          });
          return { min: min.toArray().map((v) => +v.toFixed(3)), max: max.toArray().map((v) => +v.toFixed(3)) };
        };
        let malhas = 0, tri = 0;
        c.group.traverse((x) => { if (!x.isMesh) return; malhas++; const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (x.isInstancedMesh ? x.count : 1); });
        const pato = c.jeanLuc?.group;
        const dentroDoPato = (x) => { for (let o = x; o; o = o.parent) if (o === pato) return true; return false; };
        // os óculos e o rosto, no referencial da CABEÇA dele
        const cabeca = c.jeanLuc?.cabecaDoPato;
        const oculos = cabeca?.getObjectByName('oculos-escuros');
        let lentes = null;
        if (oculos) {
          const min = new V(Infinity, Infinity, Infinity), max = new V(-Infinity, -Infinity, -Infinity), p = new V();
          oculos.updateMatrixWorld(true);
          oculos.children.filter((f) => f.isGroup).forEach((lente) => lente.traverse((x) => {
            if (!x.isMesh || x.name !== 'lente-fume') return;
            const pos = x.geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) { p.fromBufferAttribute(pos, i).applyMatrix4(x.matrixWorld); cabeca.worldToLocal(p); min.min(p); max.max(p); }
          }));
          lentes = { min: min.toArray().map((v) => +v.toFixed(3)), max: max.toArray().map((v) => +v.toFixed(3)) };
        }
        const olhos = cabeca ? cabeca.getWorldPosition(new V()) : null;
        return {
          tudo: caixa(c.group), lata: caixa(c.group, (x) => !dentroDoPato(x)), pato: pato ? caixa(pato) : null,
          olhosNoCarro: olhos ? c.group.worldToLocal(olhos.add(new V(0, 0, 0))).toArray().map((v) => +v.toFixed(3)) : null,
          lentes, raquete: c.jeanLuc ? c.jeanLuc.raqueteNaMao.visible : null, malhas, triangulos: Math.round(tri),
        };
      });
      return { page, foto, medir };
    };
    {
      const { page, foto, medir } = await abrir('');
      const m = await medir();
      console.log('MODELO: medidas', JSON.stringify(m));
      assert.ok(m.tudo.min[1] > -0.03, 'nada abaixo do chão');
      const comprido = m.lata.max[2] - m.lata.min[2], largo = m.lata.max[0] - m.lata.min[0];
      assert.ok(comprido < 4.0 && largo < 2.0, `menor que o Bebito (${comprido.toFixed(2)} × ${largo.toFixed(2)})`);
      // a cabeça dele (o miolo do crânio, onde os olhos estão) passa da testeira do para-brisa
      assert.ok(m.olhosNoCarro[1] > 1.58, `ele olha POR CIMA do para-brisa (a cabeça em ${m.olhosNoCarro[1]})`);
      // os óculos: as lentes na frente das pupilas (que acabam em z = 0,125), acima do bico e abaixo da aba da boina
      assert.ok(m.lentes.min[2] > 0.125, `as lentes na frente das pupilas (${m.lentes.min[2]})`);
      assert.ok(m.lentes.min[1] > 0.0 && m.lentes.max[1] < 0.075, `as lentes entre o bico e a boina (${m.lentes.min[1]} a ${m.lentes.max[1]})`);
      assert.equal(m.raquete, false, 'dirigindo, a raquete fica guardada (as duas asas no volante)');
      await foto([-5.25, 4.8, 10], [-1.75, 1.25, 1], 'camera-do-encontro');
      await foto([2.6, 2.0, 4.6], [0, 0.95, 0.3], 'frente-diagonal');
      await foto([0, 1.4, 5], [0, 1.0, 0.5], 'frente');
      await foto([-4.8, 1.7, 0.4], [0, 1.0, -0.2], 'lado-do-bebito');
      await foto([4.8, 1.9, -0.6], [0, 1.0, -0.2], 'lado-de-la');
      await foto([1.8, 2.4, -5.2], [0, 1.0, -0.4], 'tras');
      await foto([0, 3.4, -8.5], [0, 1.3, 0], 'perseguicao');
      await foto([-0.4, 6.4, 1.4], [0, 0.8, -0.2], 'de-cima');
      await foto([-1.0, 1.85, 1.3], [-0.33, 1.62, -0.1], 'rosto');
      await foto([-0.55, 1.72, 0.55], [-0.33, 1.64, -0.12], 'oculos-de-perto');
      await page.evaluate(() => { window.jogo.setCameraOmbro(null); window.jogo.focusCamera(window.doisCavalos.group); window.jogo.setZoom(2.6); });
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${OUT}-isometrica.png` });
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('&andando=7');
      await foto([-3.4, 2.4, -5], [0, 1.0, -0.4], 'andando-de-tras');
      await foto([-3, 2.2, 4.6], [0, 1.0, 0.3], 'andando-de-frente');
      await page.context().close();
    }
    {
      const { page, foto, medir } = await abrir('&conversando&raquete');
      const m = await medir();
      assert.equal(m.raquete, true, 'no ponto de ping pong, a raquete sai pela janela');
      await foto([-5.25, 4.8, 10], [-1.75, 1.25, 1], 'raquete-camera-do-encontro');
      await foto([-1.0, 1.85, 1.3], [-0.33, 1.62, -0.1], 'raquete-rosto');
      await foto([-4.2, 1.9, 1.4], [-0.4, 1.3, -0.1], 'raquete-na-janela');
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('&vazio');
      await foto([2.6, 2.4, 4.4], [0, 0.8, 0.2], 'vazio-frente');
      await foto([-3.2, 2.4, 1.4], [-0.6, 0.6, -0.2], 'vazio-caixote');
      await foto([-2.2, 3.8, -2.6], [0, 0.6, -0.2], 'vazio-por-dentro');
      await page.context().close();
    }
  }
  // ------------------------------------------------------------------ estacionado no parque
  if (parte('parque')) {
    const page = await (await browser.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    const abrirParque = async (memorias) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
      await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.evaluate((memorias) => {
        const g = window.jogo;
        for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'bebito:carro-no-parque']) g.setFlag(f);
        for (const id of memorias) g.unlock({ id, title: id, place: 'Na estrada', icon: '🦆', note: 'teste' });
        g.goTo('villa-lobos', 'do-carro');
      }, memorias);
      await page.waitForFunction(() => window.jogo.idDaCena === 'villa-lobos' && !window.jogo.transitioning, null, { timeout: 120000 });
      await page.waitForTimeout(1200);
      return page.evaluate(() => {
        const k = window.jogo.current.world.root.userData.doisCavalosNoParque;
        return k ? [+k.x.toFixed(2), +k.z.toFixed(2)] : null;
      });
    };
    const vizinhos = ['cookie-na-estrada', 'mano-na-estrada', 'estella-na-estrada'];
    assert.equal(await abrirParque(vizinhos), null, 'antes do encontro, nada de 2CV no estacionamento');
    const antes = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    console.log(`  peso do estacionamento sem o 2CV: ${antes.calls} desenhos, ${Math.round(antes.triangles / 1000)} mil triângulos`);
    const depois = await abrirParque(['jeanluc-na-estrada', ...vizinhos]);
    console.log('PARQUE: o 2CV estacionado em', JSON.stringify(depois));
    assert.ok(depois && Math.abs(depois[1] + 2.12) < 0.1, 'na vaga vizinha à do carrinho do Cookie');
    const livre = await page.evaluate(() => {
      const c = window.jogo.current.world.colliders;
      const bate = (x, z) => c.some((k) => (k.kind === 'circle' ? Math.hypot(x - k.x, z - k.z) < k.r + 0.42 : Math.abs(x - k.x) < k.hw + 0.42 && Math.abs(z - k.z) < k.hd + 0.42));
      const ruins = [];
      for (let x = 49.6; x <= 54.4; x += 0.2) if (bate(x, 3.0)) ruins.push(+x.toFixed(1));
      return ruins;
    });
    assert.deepEqual(livre, [], 'a passagem de pedestres continua livre');
    await page.screenshot({ path: `${OUT}-parque-isometrica.png` });
    const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    console.log(`  peso do estacionamento com o 2CV: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
    await page.evaluate(() => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(58.5, 3.4, 1.2), new V(52.2, 0.8, -2.0)); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-parque-2cv.png` });
    await page.evaluate(() => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(63, 9.5, 4), new V(52, 1.0, 4)); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-parque-os-cinco.png` });
    await page.evaluate(() => window.jogo.setCameraOmbro(null));
    await page.context().close();
  }

  // ------------------------------------------------------------------ na estrada
  if (parte('estrada')) {
    const tela = process.env.CEL ? { width: 390, height: 844 } : { width: 1100, height: 760 };
    const page = await (await browser.newContext({ viewport: tela })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.evaluate(() => { for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) window.jogo.setFlag(f); });
    await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=ida,ari,${SEMENTE}`);
    await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem?.encontro, null, { timeout: 120000 });
    const estado = () => page.evaluate(() => {
      const n = window.jogo.current.world.root.userData.novidadesDaViagem;
      const c = n.encontro.carro;
      return {
        quem: n.encontro.personagem, fase: n.encontro.estado.fase,
        buzina: window.jogo.audio.contagem.get('buzinaDoJeanLuc') ?? 0,
        raquete: !!c.jeanLuc?.raqueteNaMao.visible, bola: !!c.bola?.visible, raquetadas: c.raquetadas,
        agulha: !!document.querySelector('.dialogue .hora-certa.show'),
      };
    });
    const e0 = await estado();
    console.log(`ESTRADA: semente ${SEMENTE}, encontro com ${e0.quem}`);
    assert.equal(e0.quem, 'jeanluc');
    await page.mouse.click(tela.width - 20, tela.height - 20); // (o som só acorda depois de um toque na página)
    await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
    let dePerto = false, buzinaNaChegada = 0, conversa = false, raquete = false, bola = false, agulha = false, ultrapassando = false;
    const t0 = Date.now();
    while (Date.now() - t0 < 400000) {
      const e = await estado();
      if (e.fase === 'alinhando' && !buzinaNaChegada) buzinaNaChegada = e.buzina;
      if (e.fase === 'ultrapassando' && !ultrapassando) {
        ultrapassando = true;
        await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 1; });
        await page.waitForFunction(() => window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.relativo > -7, null, { timeout: 60000 }).catch(() => {});
        await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 0; });
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${OUT}-estrada-1-ultrapassando.png` });
        await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 3; });
      }
      if (e.fase === 'falando' && !conversa) {
        conversa = true;
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${OUT}-estrada-2-conversa${process.env.CEL ? '-celular' : ''}.png` });
        const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
        console.log(`  peso na conversa: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
      }
      if (!dePerto && await page.evaluate(() => document.querySelector('.dialogue.show')?.textContent.includes('óculos escuros?!'))) {
        dePerto = true;
        await page.waitForTimeout(1600);
        await page.screenshot({ path: `${OUT}-estrada-2b-oculos-de-perto${process.env.CEL ? '-celular' : ''}.png` });
      }
      if (e.raquete && !raquete) {
        raquete = true;
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}-estrada-3-raquete.png` });
      }
      if (e.agulha && !agulha) {
        agulha = true;
        bola = bola || e.bola;
        await page.screenshot({ path: `${OUT}-estrada-4-bola-no-ar.png` });
        continue;
      }
      if (e.fase === 'feito') break;
      await page.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
      await page.waitForTimeout(90);
    }
    const fim = await page.evaluate(() => {
      const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
      const c = window.jogo.current.world.root.userData.novidadesDaViagem.encontro.carro;
      return {
        buzina: window.jogo.audio.contagem.get('buzinaDoJeanLuc') ?? 0,
        memoria: (save.memories ?? []).some((m) => m.id === 'jeanluc-na-estrada'),
        raquetadas: c.raquetadas,
      };
    });
    console.log(`  buzina ${fim.buzina} vezes | raquetadas ${fim.raquetadas} | memória ${fim.memoria}`);
    assert.ok(buzinaNaChegada >= 1, 'o pin-pon toca quando o 2CV chega');
    assert.ok(fim.buzina >= 2, 'e de novo quando ele vai embora');
    assert.ok(conversa && raquete && agulha && bola, `a conversa, a raquete na janela, a hora certa e a bolinha no ar (${conversa}, ${raquete}, ${agulha}, ${bola})`);
    assert.ok(fim.raquetadas >= 1, 'a raquete bateu na bolinha');
    assert.ok(dePerto, 'a tomada de perto dos óculos');
    assert.ok(fim.memoria, 'a memória "O pato de óculos escuros"');
    assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
    await page.context().close();
  }
  assert.deepEqual(erros, []);
  console.log('O 2CV do Jean-Luc está de pé.');
} finally {
  await browser.close();
}
