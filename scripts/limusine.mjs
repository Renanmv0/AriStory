/**
 * A LIMUSINE CONVERSÍVEL DA VALENTINA (docs/CARROS-DA-ESCOLA.md §4), com o Pietro, o pavão motorista.
 *
 * MODELO   parada no Villa Lobos pelo atalho `?limusine=x,z,giro`: nada abaixo do chão, a largura cabendo na
 *          faixa, o comprimento (ela é comprida de propósito), o PIETRO ao volante do lado do Bebito (a cabeça por
 *          cima do para-brisa, as duas luvas no aro do volante, a cauda dobrada pendurada POR CIMA da porta e para
 *          fora da lataria, sem encostar no chão), a VALENTINA no sofá do lado de lá, virada para o Bebito, dentro da
 *          cabine e acima do piso, de óculos gatinho NA FRENTE dos olhos; o tapete vermelho, o flamingo do capô, a
 *          câmera e as chapeleiras; o peso; e as fotos de todos os lados, de perto de cada um, da câmera do
 *          encontro (deitada e no celular em pé), andando e VAZIA (a versão estacionada).
 * ESTRADA  casa → escola com a Valentina conhecida: a buzina, a SESSÃO DE FOTOS (o Pietro ergue a câmera, a pose
 *          escolhida, o flash, a polaroid voando e parando no PAINEL do Bebito da cena, gravada na ficha), a memória,
 *          nenhum ensaio de fotos na calçada na mesma viagem; e a viagem SEGUE até a escola: a chegada animada do
 *          Bebito e o DESFILE (a limusine na frente do portão, o Pietro com o rolo, o tapete se desenrolando, o leque,
 *          ela descendo e desfilando até o portão, o tapete enrolado de volta e a limusine indo embora), com foto de
 *          cada fase, a flag e a memória "O tapete vermelho"; e o pátio recarregado com a limusine ESTACIONADA de lado
 *          no lote. Uma segunda viagem já com a polaroid: o oi, sem foto nova.
 * PIETRO   o pavão sozinho pelo atalho `?pavao=x,z,giro`: em pé com os pés no chão, o quepe por cima da cabeça e o
 *          topete por trás dele, e o LEQUE aberto (`&leque`) em pé atrás do corpo.
 *
 * Uso: node scripts/limusine.mjs /tmp/lm
 *      SO=modelo|pietro|estrada roda uma parte; CEL=1 a estrada no celular em pé
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4177';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw Error('Use o preview isolado.');
const OUT = process.argv[2] ?? '/tmp/limusine';
const PONTO = { x: -6, z: 30 };
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const erros = [];
try {
  const abrir = async (atalho, extra, espera = 6000, tela = { width: 1100, height: 760 }) => {
    const page = await (await browser.newContext({ viewport: tela })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&${atalho}=${PONTO.x},${PONTO.z},0${extra}&em=${PONTO.x + 8},${PONTO.z + 9}`);
    await page.waitForFunction((a) => window[a] && window.jogo?.current && !window.jogo.transitioning, atalho, { timeout: 120000 });
    await page.waitForTimeout(espera);
    const foto = async (de, para, nome) => {
      await page.evaluate(([d, p, o]) => {
        const V = window.jogo.scene.position.constructor;
        window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + p[0], p[1], o.z + p[2]));
      }, [de, para, PONTO]);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${OUT}-${nome}.png` });
    };
    return { page, foto };
  };

  if (parte('modelo')) {
    {
      const { page, foto } = await abrir('limusine', '');
      const m = await page.evaluate(() => {
        const c = window.limusine; c.group.updateMatrixWorld(true);
        const V = c.group.position.constructor;
        const local = (p) => c.group.worldToLocal(p);
        const caixa = (raiz, filtro = () => true) => {
          const min = new V(Infinity, Infinity, Infinity), max = new V(-Infinity, -Infinity, -Infinity), p = new V();
          raiz.traverse((x) => {
            if (!x.isMesh || x.isInstancedMesh || !filtro(x)) return;
            let vis = true; for (let o = x; o; o = o.parent) if (!o.visible) vis = false;
            if (!vis) return;
            const pos = x.geometry.attributes.position;
            for (let i = 0; i < pos.count; i += 2) { local(p.fromBufferAttribute(pos, i).applyMatrix4(x.matrixWorld)); min.min(p); max.max(p); }
          });
          return { min: min.toArray().map((v) => +v.toFixed(3)), max: max.toArray().map((v) => +v.toFixed(3)) };
        };
        const bichos = [c.pietro.group, c.valentina.group];
        const dentro = (x) => { for (let o = x; o; o = o.parent) if (bichos.includes(o)) return true; return false; };
        let malhas = 0, tri = 0;
        c.group.traverse((x) => { if (!x.isMesh) return; malhas++; const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (x.isInstancedMesh ? x.count : 1); });
        // a cauda do Pietro: cada pena amostrada da raiz à ponta, no referencial do carro
        const cauda = c.pietro.group.getObjectByName('cauda-do-pavao');
        const mi = new c.group.matrix.constructor(), p = new V();
        let pontaX = Infinity, chao = Infinity, naPorta = Infinity;
        for (let i = 0; i < cauda.count; i++) {
          cauda.getMatrixAt(i, mi);
          for (let t = 0; t <= 1.0001; t += 0.05) {
            local(p.set(0, 0, t).applyMatrix4(mi).applyMatrix4(cauda.matrixWorld));
            pontaX = Math.min(pontaX, p.x); chao = Math.min(chao, p.y);
            if (Math.abs(p.x + 0.8) < 0.04 && p.z > 0 && p.z < 1.1) naPorta = Math.min(naPorta, p.y);
          }
        }
        const luvas = [0, 1].map((l) => local(c.pietro.pontaDaLuva(l)).toArray().map((v) => +v.toFixed(3)));
        const cabeca = local(c.pietro.cabecaDoPavao.getWorldPosition(new V()));
        // os óculos gatinho: cada lente na frente do olho dela (mais longe do meio da cabeça que o olho, e perto dele)
        const cranio = c.valentina.group.getObjectByName('cranio-da-valentina');
        const oculos = c.valentina.group.getObjectByName('oculos-no-rosto');
        const centro = cranio.getWorldPosition(new V());
        const olhos = ['olho-esquerdo', 'olho-direito'].map((n) => c.valentina.group.getObjectByName(n).getWorldPosition(new V()));
        const lentes = oculos ? ['lente-esquerda', 'lente-direita'].map((n) => oculos.getObjectByName(n)).filter(Boolean).map((x) => x.getWorldPosition(new V())) : [];
        const nosOlhos = lentes.length === 2 && olhos.every((o, i) => {
          const l = lentes.reduce((a, b) => (a.distanceTo(o) < b.distanceTo(o) ? a : b));
          return l.distanceTo(o) < 0.05 && l.distanceTo(centro) > o.distanceTo(centro);
        });
        const conta = (g) => { let n = 0; g.traverse((x) => { if (x.isMesh) n++; }); return n; };
        const ondeEsta = (g) => local(g.getWorldPosition(new V())).toArray().map((v) => +v.toFixed(2));
        return {
          tudo: caixa(c.group), lata: caixa(c.group, (x) => !dentro(x)),
          pietro: { onde: ondeEsta(c.pietro.group), caixa: caixa(c.pietro.group), cabeca: +cabeca.y.toFixed(2), luvas },
          valentina: { onde: ondeEsta(c.valentina.group), caixa: caixa(c.valentina.group), giro: +c.valentina.group.rotation.y.toFixed(2), look: c.valentina.lookAtual?.id, nosOlhos },
          cauda: { pontaX: +pontaX.toFixed(2), chao: +chao.toFixed(2), naPorta: +naPorta.toFixed(2) },
          pecas: ['quepe-do-motorista'].map((n) => !!c.group.getObjectByName(n)),
          malhas, triangulos: Math.round(tri), malhasDoPietro: conta(c.pietro.group), malhasDaValentina: conta(c.valentina.group),
        };
      });
      console.log('MODELO:', JSON.stringify({ tudo: m.tudo, lata: m.lata, malhas: m.malhas, triangulos: m.triangulos, pietro: m.malhasDoPietro, valentina: m.malhasDaValentina }));
      console.log('  Pietro:', JSON.stringify(m.pietro), '| cauda:', JSON.stringify(m.cauda));
      console.log('  Valentina:', JSON.stringify(m.valentina));
      assert.ok(m.tudo.min[1] > -0.03, 'nada abaixo do chão');
      const largura = m.lata.max[0] - m.lata.min[0], comprimento = m.lata.max[2] - m.lata.min[2];
      assert.ok(largura < 2.05, `a largura cabe na faixa (${largura.toFixed(2)})`);
      assert.ok(comprimento > 6 && comprimento < 6.8, `comprida de limusine (${comprimento.toFixed(2)} m)`);
      assert.ok(m.pietro.onde[0] < -0.2 && m.pietro.onde[2] > 0.2, 'o Pietro ao volante, na frente, do lado do Bebito (−X)');
      assert.ok(m.pietro.cabeca > 1.3, `a cabeça do Pietro por cima do para-brisa (${m.pietro.cabeca})`);
      for (const l of m.pietro.luvas) {
        const d = Math.hypot(l[0] + 0.4, l[1] - 1.1, l[2] - 0.94);
        assert.ok(d > 0.06 && d < 0.26, `a luva no aro do volante (${d.toFixed(2)} m do meio)`);
      }
      assert.ok(m.cauda.pontaX < -0.98, `a cauda passa para fora da lataria (${m.cauda.pontaX})`);
      assert.ok(m.cauda.chao > 0.35, `a cauda não encosta no chão (${m.cauda.chao})`);
      assert.ok(m.cauda.naPorta > 0.9, `a cauda passa POR CIMA da porta (${m.cauda.naPorta})`);
      assert.ok(m.valentina.onde[0] > 0.2 && m.valentina.onde[2] < 0 && m.valentina.onde[2] > -1.7, `a Valentina no sofá do lado de lá (${m.valentina.onde})`);
      assert.ok(Math.abs(m.valentina.giro + Math.PI / 2) < 0.05, 'virada para o Bebito (−X)');
      assert.ok(m.valentina.caixa.min[1] > 0.37, `nada dela atravessa o piso (${m.valentina.caixa.min[1]})`);
      assert.ok(m.valentina.caixa.max[0] < 0.95, `nada dela sai pela lateral de lá (${m.valentina.caixa.max[0]})`);
      assert.equal(m.valentina.look, 'limusine');
      assert.ok(m.valentina.nosOlhos, 'os óculos gatinho na frente dos olhos dela');
      assert.ok(m.pecas.every(Boolean), 'o quepe');
      const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
      console.log(`  peso com ela parada no parque: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
      await foto([-5.5, 3.2, 5.0], [0, 0.8, 0], 'tres-quartos');
      await foto([-6.5, 1.6, 0], [0, 0.9, 0], 'lado-do-bebito');
      await foto([6.5, 1.8, -0.4], [0, 0.9, 0], 'lado-de-la');
      await foto([0.3, 1.3, 6.5], [0, 0.8, 0], 'frente');
      await foto([4.5, 2.6, -6], [0, 0.8, -0.5], 'tras');
      await foto([-0.5, 8.5, -0.4], [0, 0, 0], 'de-cima');
      await foto([-2.0, 1.9, 1.9], [-0.4, 1.35, 0.6], 'o-pietro');
      await foto([-0.9, 1.75, 1.75], [-0.4, 1.5, 0.6], 'o-pietro-rosto');
      await foto([-2.2, 2.2, -0.9], [0.4, 1.4, -0.85], 'a-valentina');
      await foto([-1.0, 1.75, -0.85], [0.35, 1.62, -0.85], 'a-valentina-rosto');
      await foto([0.2, 1.1, 3.6], [0, 0.95, 2.7], 'o-flamingo');
      await foto([1.2, 1.9, -3.4], [0, 1.0, -2.3], 'o-tapete');
      // a câmera do encontro na estrada (a de sempre, com a tela deitada): da frente, do lado do Bebito
      await foto([-4.55, 3.84, 8.0], [-1.75, 1.25, 1.0], 'camera-do-encontro');
      await page.evaluate(() => { window.jogo.setCameraOmbro(null); window.jogo.focusCamera(window.limusine.group); window.jogo.setZoom(2.6); });
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${OUT}-isometrica.png` });
      await page.context().close();
    }
    {
      // no celular em pé, a câmera do encontro vem mais de longe (1,65)
      const { page, foto } = await abrir('limusine', '&conversando', 6000, { width: 390, height: 844 });
      await foto([-(3.5 * 1.65 + 1.75), 4.8 * 1.65, 10 * 1.65], [-1.75, 1.25, 1.0], 'camera-do-encontro-celular');
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('limusine', '&andando=8');
      await foto([-3.4, 2.6, -6.4], [0, 1.0, -0.4], 'andando-de-tras');
      await page.context().close();
    }
    {
      const { page, foto } = await abrir('limusine', '&vazio', 2500);
      const v = await page.evaluate(() => { let malhas = 0, tri = 0; window.limusine.group.traverse((x) => { if (!x.isMesh) return; malhas++; const g = x.geometry; tri += (g.index ? g.index.count : g.attributes.position.count) / 3 * (x.isInstancedMesh ? x.count : 1); }); return { malhas, tri: Math.round(tri) }; });
      console.log(`  vazia (estacionada): ${v.malhas} malhas, ${v.tri} triângulos`);
      assert.ok(v.malhas < 60, 'vazia, ela se junta como fundo');
      await foto([-5.5, 3.2, 5.0], [0, 0.8, 0], 'vazia');
      await foto([-2.2, 2.6, -0.4], [0.2, 0.8, -0.6], 'vazia-por-dentro');
      await page.context().close();
    }
  }

  if (parte('estrada')) {
    const codigo = ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts', import.meta.url), 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    const { gerarRota } = await import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
    const SENTIDO = 'casa-escola';
    const sementes = [];
    for (let k = 1; sementes.length < 2; k++) if (gerarRota(k, SENTIDO).encontro?.personagem === 'valentina') sementes.push(k);
    const FLAGS = ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou', 'escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'valentina-conhecida'];
    const CEL = !!process.env.CEL;
    const sufixo = CEL ? '-celular' : '';
    const tela = CEL ? { width: 390, height: 844 } : { width: 1100, height: 760 };
    const page = await (await browser.newContext({ viewport: tela })).newPage();
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/?bebito&semHalloween&cena=casa`);
    await page.waitForFunction(() => window.jogo?.current && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.evaluate((flags) => { for (const f of flags) window.jogo.setFlag(f); }, FLAGS);
    const avancar = () => page.evaluate(() => {
      const opcoes = document.querySelectorAll('.escolhas.show button');
      // (a pose: o "beijinho na bochecha", a segunda)
      if (opcoes.length) { opcoes[Math.min(1, opcoes.length - 1)].click(); return; }
      document.querySelector('.dialogue.show')?.click();
    });
    const viajar = async (semente, rotulo, primeira) => {
      await page.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=${SENTIDO},ari,${semente}`);
      await page.waitForFunction(() => window.jogo?.current?.world.root.userData.novidadesDaViagem && !window.jogo.transitioning, null, { timeout: 120000 });
      const ensaio = await page.evaluate(() => { let n = 0; window.jogo.scene.traverse((o) => { if (o.userData.peca === 'ensaio-da-valentina') n++; }); return n; });
      const estado = () => page.evaluate(() => {
        const g = window.jogo;
        const n = g.current?.world.root.userData.novidadesDaViagem;
        const c = n?.encontro?.carro;
        const painel = n?.bebito.encaixes.painel.map((e) => e.children.find((x) => x.name.startsWith('detalhe:'))?.name ?? null);
        return {
          cena: g.idDaCena, quem: n?.encontro?.personagem, fase: n?.encontro?.estado.fase,
          buzina: g.audio.contagem.get('buzinaDaLimusine') ?? 0, flashes: c?.flashes ?? 0, noAr: c?.polaroidsNoAr ?? 0,
          painel, escolhas: document.querySelectorAll('.escolhas.show button').length,
          dialogo: document.querySelector('.dialogue.show')?.textContent ?? '',
          desfile: g.current?.world.root.userData.desfileDaValentina?.estado.fase ?? null,
        };
      });
      const e0 = await estado();
      console.log(`ESTRADA (${rotulo}): semente ${semente}, encontro com ${e0.quem} | ensaio na calçada ${ensaio}`);
      assert.equal(e0.quem, 'valentina');
      assert.equal(ensaio, 0, 'na viagem em que ela vem de limusine, não tem o ensaio de fotos na calçada');
      await page.mouse.click(tela.width - 20, tela.height - 20);
      await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.vezes = 3; v.piloto = 'bom'; });
      let conversa = false, escolheu = false, voou = false, flash = false, ditos = '';
      const t0 = Date.now();
      while (Date.now() - t0 < 400000) {
        const e = await estado();
        if (e.dialogo && !ditos.endsWith(e.dialogo)) ditos += ' | ' + e.dialogo;
        if (e.fase === 'falando' && !conversa) {
          conversa = true;
          await page.waitForTimeout(1500);
          await page.screenshot({ path: `${OUT}-${rotulo}-1-conversa${sufixo}.png` });
          const r = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
          console.log(`  peso na conversa: ${r.calls} desenhos, ${Math.round(r.triangles / 1000)} mil triângulos`);
        }
        if (e.escolhas && !escolheu) { escolheu = true; await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}-${rotulo}-2-a-camera${sufixo}.png` }); }
        if (e.flashes && !flash) { flash = true; await page.screenshot({ path: `${OUT}-${rotulo}-3-flash${sufixo}.png` }); }
        if (e.noAr && !voou) { voou = true; await page.screenshot({ path: `${OUT}-${rotulo}-4-polaroid${sufixo}.png` }); }
        if (e.fase === 'feito') break;
        await avancar();
        await page.waitForTimeout(90);
      }
      const fim = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
        const n = window.jogo.current.world.root.userData.novidadesDaViagem;
        return {
          buzina: window.jogo.audio.contagem.get('buzinaDaLimusine') ?? 0, flashes: n.encontro.carro.flashes,
          memoria: (save.memories ?? []).some((m) => m.id === 'valentina-na-estrada'),
          painelNoCarro: n.bebito.encaixes.painel.map((e) => e.children.find((x) => x.name.startsWith('detalhe:'))?.name ?? null),
          naFicha: window.jogo.fichaDoBebitoMobile().vagas.painel,
        };
      });
      console.log(`  buzina ${fim.buzina} | flashes ${fim.flashes} | painel ${JSON.stringify(fim.painelNoCarro)} | ficha ${JSON.stringify(fim.naFicha)} | memória ${fim.memoria}`);
      assert.ok(fim.buzina >= 3, 'a buzina na chegada, na conversa e na saída');
      assert.ok(fim.memoria, 'a memória "Perfetto!"');
      assert.ok(fim.naFicha.filter((id) => id?.startsWith('polaroid-')).length === 1, 'uma polaroid só, na ficha');
      if (primeira) {
        assert.ok(conversa && escolheu && flash && voou, `a conversa, a pose, o flash e a polaroid voando (${conversa}, ${escolheu}, ${flash}, ${voou})`);
        assert.ok(fim.naFicha.includes('polaroid-beijinho'), 'a polaroid da pose escolhida (o beijinho) na ficha');
        assert.ok(fim.painelNoCarro.includes('detalhe:polaroid-beijinho'), 'e no painel do Bebito da cena, na hora');
      } else {
        assert.equal(fim.flashes, 0, 'com a polaroid no painel, ela não tira outra foto');
        assert.match(ditos, /melhor foto/);
      }
      assert.equal(await page.evaluate(() => localStorage.getItem('aristory.save.v1')), null, 'o save de verdade fica intacto');
      return ditos;
    };
    await viajar(sementes[0], 'primeira', true);
    // a viagem SEGUE até a escola: a chegada animada do Bebito e, depois dela, o DESFILE
    await page.evaluate(() => { window.aristoryBebitoMobile.viagem.vezes = 6; window.aristoryBebitoMobile.ritmoDoPresente.vezes = 2; });
    // (até lá, as falas do fim da viagem e da chegada vão passando)
    for (const t = Date.now(); Date.now() - t < 600000;) {
      if (await page.evaluate(() => window.jogo.idDaCena === 'escola-patio' && !!window.jogo.current?.world.root.userData.desfileDaValentina).catch(() => false)) break;
      await avancar().catch(() => {});
      await page.waitForTimeout(300);
    }
    const fasesVistas = new Set();
    const t1 = Date.now();
    let tapeteMaior = 0;
    while (Date.now() - t1 < 500000) {
      const d = await page.evaluate(() => {
        const u = window.jogo.current.world.root.userData.desfileDaValentina;
        const lim = u.limusine.group.position;
        const v = u.limusine.valentina.group.getWorldPosition(new (lim.constructor)());
        return { fase: u.estado.fase, tapete: u.estado.tapete, limX: +lim.x.toFixed(2), vZ: +v.z.toFixed(2), vY: +v.y.toFixed(2), leque: u.limusine.pietro.aberturaDoLeque };
      });
      tapeteMaior = Math.max(tapeteMaior, d.tapete);
      if (!fasesVistas.has(d.fase)) {
        fasesVistas.add(d.fase);
        if (d.fase !== 'fim' && d.fase !== 'chegando') {
          await page.waitForTimeout(d.fase === 'tapete' ? 600 : 1300);
          await page.screenshot({ path: `${OUT}-desfile-${fasesVistas.size}-${d.fase}${sufixo}.png` });
        }
        console.log(`  desfile: ${d.fase} (limusine em x ${d.limX}, Valentina em z ${d.vZ}, leque ${d.leque.toFixed(2)})`);
      }
      if (d.fase === 'fim') break;
      await avancar();
      await page.waitForTimeout(120);
    }
    const depois = await page.evaluate(() => {
      const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
      return { flag: window.jogo.flag('valentina-desfilou'), memoria: (save.memories ?? []).some((m) => m.id === 'valentina-na-escola') };
    });
    console.log(`  fases: ${[...fasesVistas].join(' → ')} | tapete ${tapeteMaior.toFixed(2)} | flag ${depois.flag} | memória ${depois.memoria}`);
    for (const f of ['parada', 'pietro', 'tapete', 'descendo', 'desfilando', 'indo', 'fim']) assert.ok(fasesVistas.has(f), `o desfile passou por ${f}`);
    assert.ok(tapeteMaior > 0.99, 'o tapete se desenrolou até o portão');
    assert.ok(depois.flag && depois.memoria, 'a flag e a memória "O tapete vermelho"');
    // recarregando o pátio: a limusine estacionada de lado no lote, e nada de desfile de novo
    await page.evaluate(() => window.jogo.goTo('escola-patio'));
    await page.waitForFunction(() => window.jogo.idDaCena === 'escola-patio' && !window.jogo.transitioning, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    const lote = await page.evaluate(() => ({ vaga: window.jogo.current.world.root.userData.limusineNaEscola ?? null, desfile: !!window.jogo.current.world.root.userData.desfileDaValentina }));
    console.log(`  no lote: ${JSON.stringify(lote)}`);
    assert.ok(lote.vaga && !lote.desfile, 'depois do desfile, a limusine mora estacionada no lote, e o desfile não repete');
    await page.evaluate((v) => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(v.x - 6, 4.5, v.z + 8), new V(v.x, 0.8, v.z)); }, lote.vaga);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}-no-lote${sufixo}.png` });
    await page.evaluate(() => window.jogo.setCameraOmbro(null));
    // a segunda viagem: já com a polaroid no painel
    await viajar(sementes[1], 'de-novo', false);
    await page.context().close();
  }

  if (parte('pietro')) {
    for (const [extra, nome] of [['', 'pietro'], ['&leque', 'pietro-leque']]) {
      const { page, foto } = await abrir('pavao', extra);
      if (extra) await page.waitForFunction(() => window.pavao.aberturaDoLeque > 0.95, null, { timeout: 120000 });
      const r = await page.evaluate(() => {
        const g = window.pavao.group; g.updateMatrixWorld(true);
        const V = g.position.constructor;
        let min = Infinity, max = -Infinity; const p = new V();
        g.traverse((x) => { if (!x.isMesh || x.isInstancedMesh) return; const pos = x.geometry.attributes.position; for (let i = 0; i < pos.count; i += 3) { p.fromBufferAttribute(pos, i).applyMatrix4(x.matrixWorld); min = Math.min(min, p.y); max = Math.max(max, p.y); } });
        const quepe = g.getObjectByName('quepe-do-motorista').getWorldPosition(new V()).y;
        const cabeca = window.pavao.cabecaDoPavao.getWorldPosition(new V()).y;
        return { min: +min.toFixed(3), max: +max.toFixed(3), quepe: +quepe.toFixed(2), cabeca: +cabeca.toFixed(2), leque: +window.pavao.aberturaDoLeque.toFixed(2) };
      });
      console.log(`PIETRO (${nome}):`, JSON.stringify(r));
      assert.ok(r.min > -0.02 && r.min < 0.03, 'os pés no chão');
      assert.ok(r.quepe > r.cabeca, 'o quepe por cima da cabeça');
      if (extra) assert.ok(r.leque > 0.9, 'o leque abre');
      await foto([0.6, 1.0, 2.2], [0, 0.75, 0], `${nome}-frente`);
      await foto([1.9, 1.3, 1.6], [0, 0.7, -0.1], `${nome}-tres-quartos`);
      await foto([-1.6, 1.4, -2.2], [0, 0.6, -0.3], `${nome}-costas`);
      if (!extra) await foto([0.25, 1.15, 0.85], [0, 1.02, 0.15], `${nome}-rosto`);
      await page.context().close();
    }
  }
  assert.deepEqual(erros, []);
  console.log('A limusine da Valentina está de pé.');
} finally {
  await browser.close();
}
