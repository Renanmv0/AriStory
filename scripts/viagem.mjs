/**
 * A VIAGEM DE CARRO — a etapa C do Bebito Mobile (`docs/BEBITO-MOBILE.md`,
 * `src/scenes/viagemDeCarro.ts`, `src/eventos/bebitoMobile/rota.ts`). Tudo só
 * existe com a chave do carro; o teste liga pelo endereço, com `?bebito`.
 *
 * - ROTA: trezentas rotas sorteadas (ida e volta) obedecem as regras — oito
 *   eventos, as duas travessias (patos e tigres-d'água) nunca seguidas, o
 *   primeiro evento manso, os vãos, os corações dentro da pista e fora da
 *   faixa fechada, a curva mansa; a mesma semente dá a mesma rota;
 * - PARTIDA: na garagem, o "Sair de carro", a pergunta "Quem dirige dessa
 *   vez?", e na estrada quem foi escolhido está no lugar do motorista, de
 *   mãos no volante, com o outro de carona (nos dois casos);
 * - BOM: o piloto de teste dirige a viagem inteira — para na faixa para os
 *   bichos (que atravessam INTEIROS na frente do carro parado), para no sinal,
 *   desvia da obra e dos buracos, passa a lombada devagar e ultrapassa o
 *   ônibus —, com foto de cada evento, três estrelas, e a chegada no parque
 *   com o carro na vaga dele, no estacionamento do outro lado da rua do ônibus;
 * - DISTRAÍDO: sem ninguém no manche, o carro freia SOZINHO antes da faixa
 *   (o susto) e nunca passa por cima de um bicho;
 * - MANCHE: as teclas de verdade — virar muda de faixa, frear para, acelerar
 *   passa da velocidade de passeio, e a buzina toca e apressa os patos;
 * - VOLTA: do parque, o "Voltar pra casa" do portão vira lembrete, o carro
 *   leva de volta, e ele reaparece na garagem;
 * - PERTO: fotos de perto dos bichos atravessando e das peças da pista.
 *
 * Uso: node scripts/viagem.mjs /caminho/prefixo
 * - ESTACIONAMENTO: sem a chave ele não existe; com ela, o lote do outro
 *   lado da rua, o carro na vaga do coração, o caminho a pé da vaga até o
 *   portão do parque sem nada no meio (pela faixa atrás do ônibus), a cancela
 *   subindo, e as fotos (de longe, girando, e de perto);
 *
 * - BICHOS: os que atravessam, medidos e fotografados de perto — o patinho
 *   MENOR que a mãe (a metade, mais ou menos) e do tamanho de um bicho, o pé de
 *   todos no chão, a tartaruga nova (casco em relevo, quatro pernas, cabeça,
 *   rabo) andando, e escondida no casco quando buzinam;
 *
 *      SO=rota|partida|bom|distraido|manche|volta|estacionamento|perto|bichos roda uma parte
 *      CEL=1 roda no celular em pé; SEMENTE=7 escolhe a rota do BOM
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './viagem';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = process.env.SO ? process.env.SO.split(',') : null;
const roda = (parte) => !SO || SO.includes(parte);
const SEMENTE = Number(process.env.SEMENTE ?? 3);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const erros = [];
const falhas = [];
const confere = (ok, texto) => {
  console.log(`${ok ? '  ok ' : 'FALHA'} ${texto}`);
  if (!ok) falhas.push(texto);
};
const pagina = async () => {
  const ctx = await browser.newContext(process.env.CEL
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
    : { viewport: { width: 1200, height: 800 } });
  const page = await ctx.newPage();
  // (um erro que se repete a cada quadro não pode encher a memória do próprio teste: guarda só os primeiros)
  page.on('pageerror', (e) => { if (erros.length < 40) erros.push('PAGEERROR: ' + e.message); });
  return page;
};
const abrir = async (page, query) => {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await page.waitForTimeout(1200);
};
const naEstrada = (page) => page.waitForFunction(() => window.jogo.idDaCena === 'viagem-de-carro' && !!window.aristoryBebitoMobile.viagem.estado, null, { timeout: 60000 });
const estado = (page) => page.evaluate(() => ({ ...window.aristoryBebitoMobile.viagem.estado }));
const viagem = (page, mexe) => page.evaluate((m) => { Object.assign(window.aristoryBebitoMobile.viagem, m); }, mexe); // (sem devolver o objeto: ele guarda a câmera de dentro, e serializar o jogo inteiro estoura a memória do teste)
const comOCarro = (page) => page.evaluate(() => {
  for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) window.jogo.setFlag(f);
});
/** aperta E até `pronto()` dar verdade (avança falas e confirma a primeira opção) */
const jogarAte = async (page, pronto, teto = 60000, aCada = 350) => {
  const t0 = Date.now();
  while (Date.now() - t0 < teto) {
    if (await page.evaluate(pronto)) return true;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(aCada);
  }
  return false;
};

// ======================================================================= rota
if (roda('rota')) {
  console.log('— a rota: trezentas viagens sorteadas');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  const r = await page.evaluate(() => {
    const { gerarRota } = window.aristoryBebitoMobile;
    const ruins = [];
    const ordens = new Set();
    let inclinaMaxima = 0;
    for (let semente = 1; semente <= 150; semente++) {
      for (const sentido of ['ida', 'volta']) {
        const rota = gerarRota(semente, sentido);
        const tipos = rota.eventos.map((e) => e.tipo);
        const onde = `${sentido} ${semente}`;
        ordens.add(tipos.join(','));
        if (tipos.length !== 8) ruins.push(`${onde}: ${tipos.length} eventos`);
        const conta = (t) => tipos.filter((x) => x === t).length;
        if (conta('travessia') !== 2) ruins.push(`${onde}: ${conta('travessia')} travessias`);
        for (const t of ['semaforo', 'obra', 'buracos', 'lombada', 'poca', 'onibus']) if (conta(t) !== 1) ruins.push(`${onde}: ${t} × ${conta(t)}`);
        const bichos = rota.eventos.filter((e) => e.tipo === 'travessia').map((e) => e.bichos).sort().join(',');
        if (bichos !== 'patos,tigres') ruins.push(`${onde}: travessias de ${bichos}`);
        if (tipos[0] !== 'poca' && tipos[0] !== 'lombada') ruins.push(`${onde}: começa com ${tipos[0]}`);
        for (let i = 1; i < tipos.length; i++) {
          if (tipos[i] === 'travessia' && tipos[i - 1] === 'travessia') ruins.push(`${onde}: duas travessias seguidas`);
          if (rota.eventos[i].s - rota.eventos[i - 1].s < 55) ruins.push(`${onde}: vão de ${(rota.eventos[i].s - rota.eventos[i - 1].s).toFixed(0)} m`);
        }
        const depoisDoOnibus = tipos[tipos.indexOf('onibus') + 1];
        if (['travessia', 'semaforo', 'obra'].includes(depoisDoOnibus)) ruins.push(`${onde}: ${depoisDoOnibus} logo depois do ônibus`);
        if (rota.eventos[0].s < 70 || rota.eventos[7].s > rota.comprimento - 100) ruins.push(`${onde}: evento colado na ponta`);
        for (const c of rota.coracoes) {
          if (Math.abs(c.l) > 2.3) ruins.push(`${onde}: coração fora da pista (${c.l.toFixed(2)})`);
          for (const e of rota.eventos) {
            // nenhum coração dentro da faixa fechada de uma obra
            const fechada = e.faixa === 0 ? -1.75 : 1.75;
            if (e.tipo === 'obra' && c.s > e.s && c.s < e.s + 16 && Math.abs(c.l - fechada) < 1.2) ruins.push(`${onde}: coração dentro da obra`);
          }
        }
        for (let s = 0; s <= rota.comprimento; s += 2) inclinaMaxima = Math.max(inclinaMaxima, Math.abs(window.aristoryBebitoMobile.eixoDaRota(rota, s).inclina));
      }
    }
    const a = JSON.stringify(gerarRota(42, 'ida').eventos);
    const b = JSON.stringify(gerarRota(42, 'ida').eventos);
    const c = JSON.stringify(gerarRota(43, 'ida').eventos);
    return { ruins: ruins.slice(0, 8), quantas: ruins.length, ordens: ordens.size, inclinaMaxima, igual: a === b, outra: a !== c };
  });
  confere(r.quantas === 0, `trezentas rotas obedecem as regras${r.quantas ? ' — ' + r.ruins.join(' · ') : ''}`);
  confere(r.ordens > 40, `as viagens saem diferentes (${r.ordens} ordens de eventos em 300)`);
  confere(r.inclinaMaxima < 0.5, `a curva é mansa (inclinação máxima ${r.inclinaMaxima.toFixed(2)})`);
  confere(r.igual && r.outra, 'a mesma semente dá a mesma rota, e outra semente dá outra');
  await page.context().close();
}

// ==================================================================== partida
if (roda('partida')) {
  console.log('— a partida: sair de carro e "quem dirige dessa vez?"');
  for (const [indice, nome, id] of [[0, 'Ari', 'ari'], [1, 'Renan', 'renan']]) {
    const page = await pagina();
    await abrir(page, 'bebito&cena=frente-da-casa');
    await comOCarro(page);
    await abrir(page, 'bebito&cena=frente-da-casa');
    const rotulos = await page.evaluate(() => window.jogo.current.world.interactables.map((i) => i.label));
    if (indice === 0) confere(rotulos.includes('Sair de carro'), `com o carro na garagem, a porta dele oferece "Sair de carro" (${rotulos.join(', ')})`);
    await page.evaluate(() => { void window.jogo.current.world.interactables.find((i) => i.id === 'frente:sair-de-carro').trigger(window.jogo); });
    await page.waitForSelector('.escolhas.show button', { timeout: 15000 });
    if (indice === 0) await page.screenshot({ path: `${OUT}-partida-1-vamos.png` });
    await page.locator('.escolhas.show button').first().click();
    await page.waitForFunction(() => [...document.querySelectorAll('.escolhas.show button')].some((b) => b.textContent.includes('Renan')), null, { timeout: 15000 });
    // (a pergunta é escrita letra por letra)
    await page.waitForFunction(() => (document.querySelector('.dialogue .text')?.textContent ?? '').includes('?'), null, { timeout: 15000 }).catch(() => {});
    const pergunta = await page.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (indice === 0) {
      confere(pergunta.includes('Quem dirige dessa vez?'), 'a viagem pergunta "Quem dirige dessa vez?"');
      await page.screenshot({ path: `${OUT}-partida-2-quem-dirige.png` });
    }
    await page.locator('.escolhas.show button').nth(indice).click();
    await jogarAte(page, () => window.jogo.idDaCena === 'viagem-de-carro');
    await naEstrada(page);
    await page.waitForTimeout(1500);
    const lugares = await page.evaluate(() => {
      const j = window.jogo;
      const carro = j.scene.getObjectByName('bebito-mobile').userData.carro;
      const dentroDe = (corpo, ancora) => { for (let p = corpo; p; p = p.parent) if (p === ancora) return true; return false; };
      const jogadorDirige = dentroDe(j.player.object, carro.assentos.motorista);
      const parceiroDirige = dentroDe(j.parceiro.object, carro.assentos.motorista);
      const jogadorCarona = dentroDe(j.player.object, carro.assentos.passageiro);
      const parceiroCarona = dentroDe(j.parceiro.object, carro.assentos.passageiro);
      return { quemJoga: j.playerId(), jogadorDirige, parceiroDirige, jogadorCarona, parceiroCarona };
    });
    const dirige = lugares.jogadorDirige ? lugares.quemJoga : lugares.quemJoga === 'ari' ? 'renan' : 'ari';
    confere(dirige === id && (lugares.jogadorDirige ? lugares.parceiroCarona : lugares.jogadorCarona && lugares.parceiroDirige), `escolhendo ${nome}, é ${nome} no lugar do motorista e o outro de carona (${JSON.stringify(lugares)})`);
    // de perto, pela frente do carro: quem está de mãos no volante
    await viagem(page, { vezes: 0 });
    const frente = await page.evaluate(() => { const c = window.jogo.scene.getObjectByName('bebito-mobile').position; return [c.x, c.z]; });
    await viagem(page, { camera: { de: [frente[0] + 0.4, 2.0, frente[1] - 5.2], para: [frente[0], 1.35, frente[1]] } });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}-partida-3-${id}-dirige.png` });
    await page.context().close();
  }
}

// ================================================================= o piloto bom
if (roda('bom')) {
  console.log(`— a viagem inteira, com o piloto de teste (rota ${SEMENTE})`);
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, `bebito&cena=viagem-de-carro&viagem=ida,renan,${SEMENTE}`);
  await naEstrada(page);
  await viagem(page, { piloto: 'bom', vezes: 3 });
  const rota = await page.evaluate(() => window.aristoryBebitoMobile.viagem.rota);
  console.log('   ' + rota.eventos.map((e) => `${e.tipo}@${e.s.toFixed(0)}`).join('  '));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-bom-0-partida.png` });
  // Os encontros do caminho antigo vêm antes dos oito obstáculos. Avançar
  // a conversa evita que o teste espere uma distância com um balão aberto.
  if (rota.encontro) confere(await jogarAte(page, () => window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.fase === 'feito', 240000, 150), 'o encontro sorteado terminou');
  let n = 1;
  let pesoMaximo = { calls: 0, triangles: 0 };
  let bichoNaFrenteDoCarroAndando = false;
  for (const e of rota.eventos) {
    await page.waitForFunction((s) => window.aristoryBebitoMobile.viagem.estado.s > s - 15, e.s, { timeout: 240000 }).catch(() => {});
    if (e.tipo === 'travessia' || e.tipo === 'semaforo') {
      // espera ele parar na linha, e fotografa parado
      await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.v < 0.3, null, { timeout: 60000 }).catch(() => {});
      await page.waitForTimeout(900);
    }
    await page.screenshot({ path: `${OUT}-bom-${n}-${e.tipo}.png` });
    const info = await page.evaluate(() => ({ calls: window.jogo.renderer.info.render.calls, triangles: window.jogo.renderer.info.render.triangles }));
    if (info.triangles > pesoMaximo.triangles) pesoMaximo = info;
    if (e.tipo === 'travessia') {
      // parado, os bichos passam NA FRENTE do carro: nenhum fica atrás da linha do para-choque
      const st = await estado(page);
      if (st.v > 0.5) bichoNaFrenteDoCarroAndando = true;
      confere(st.v < 0.5 && st.s + 2.6 <= e.s - 3.2, `na travessia de ${e.bichos}, o carro parou antes da linha (a ${(e.s - 3.4 - st.s - 2.6).toFixed(1)} m dela)`);
    }
    n++;
  }
  confere(!bichoNaFrenteDoCarroAndando, 'ele esperou parado enquanto os bichos atravessavam');
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.fase === 'chegando', null, { timeout: 240000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-bom-9-chegando.png` });
  const fim = await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.fase === 'fim', null, { timeout: 120000 }).then(() => true).catch(() => false);
  const st = await estado(page);
  confere(fim, 'a viagem chega ao fim e o carro para sozinho');
  const v = st.vistos;
  confere(v.travessia === 2 && v.semaforo === 1 && v.obra === 1 && v.buracos === 1 && v.lombada === 1 && v.poca === 1 && v.onibus === 1,
    `passou pelos oito eventos (${JSON.stringify(v)})`);
  confere(st.tropecos === 0 && st.sustos === 0, `dirigindo direito, nenhum tropeço e nenhum susto (${st.tropecos}, ${st.sustos})`);
  confere(st.gentilezas === 3, `parou para as duas travessias e no sinal (${st.gentilezas} gentilezas)`);
  confere(st.coracoes >= 30, `pegou corações pelo caminho (${st.coracoes})`);
  console.log(`   peso no pior ponto: ${pesoMaximo.calls} desenhos, ${pesoMaximo.triangles} triângulos`);
  // a conversa da chegada, e o parque com o carro estacionado
  await viagem(page, { vezes: 1 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}-bom-10-chegou.png` });
  const noParque = await jogarAte(page, () => window.jogo.idDaCena === 'villa-lobos' && !!window.jogo.current, 60000, 400);
  await page.waitForTimeout(1500);
  const parque = await page.evaluate(() => {
    const j = window.jogo;
    const c = j.scene.getObjectByName('bebito-mobile');
    const p = j.player.position;
    const livre = !j.current.world.colliders.some((k) => (k.kind === 'circle'
      ? Math.hypot(p.x - k.x, p.z - k.z) < k.r + 0.4
      : Math.abs(p.x - k.x) < k.hw + 0.4 && Math.abs(p.z - k.z) < k.hd + 0.4));
    return {
      carro: !!c, onde: c ? [+c.position.x.toFixed(1), +c.position.z.toFixed(1)] : null,
      flag: j.flag('bebito:carro-no-parque'), livre, dupla: [+p.x.toFixed(1), +p.z.toFixed(1)],
      rotulos: j.current.world.interactables.filter((i) => i.enabled).map((i) => i.label),
      memoria: JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}').memories?.some((m) => m.id === 'primeira-viagem') ?? false,
      travado: j.player.locked, cameraDeCena: !!j.cameraDeCena(), painel: document.querySelector('.painel-da-viagem')?.classList.contains('show'),
      // a pose de carro e as pernas dos dois (o bug do Renan: saíam do carro de volante na mão)
      poses: [j.player.rig, j.parceiro.rig].map((r) => ({ noCarro: r.noCarro, perna: r.legL.rotation.x, braco: r.armL.rotation.x })),
    };
  });
  confere(parque.poses.every((q) => q.noCarro === null && Math.abs(q.perna) < 0.3 && Math.abs(q.braco) < 0.3),
    `ao sair do carro os dois voltam à pose de pé (nenhum de volante na mão): ${JSON.stringify(parque.poses.map((q) => [q.noCarro, +q.perna.toFixed(2), +q.braco.toFixed(2)]))}`);
  confere(noParque && parque.carro && parque.flag && Math.abs(parque.onde[0] - 51.9) < 0.1 && Math.abs(parque.onde[1] - 5.5) < 0.1, `chegaram no Villa Lobos e o carro está na vaga dele, no estacionamento (${parque.onde})`);
  confere(parque.livre && !parque.travado && !parque.cameraDeCena && !parque.painel, `a dupla desce na calçada, solta, com a câmera e a tela de sempre (${parque.dupla})`);
  confere(parque.memoria, 'a primeira viagem virou memória no diário');
  confere(parque.rotulos.includes('Viajar de Bebito Mobile'), 'o carro oferece a escolha do próximo destino');
  await page.evaluate(() => window.jogo.setZoom(13));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-bom-11-no-parque.png` });
  await page.context().close();
}

// ================================================================== distraído
if (roda('distraido')) {
  console.log('— sem ninguém no manche: o carro não passa por cima de ninguém');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  // (procura uma rota em que a primeira coisa que fecha a pista é uma travessia)
  const semente = await page.evaluate(() => {
    for (let s = 1; s < 200; s++) {
      const tipos = window.aristoryBebitoMobile.gerarRota(s, 'ida').eventos.map((e) => e.tipo);
      const i = tipos.indexOf('travessia');
      if (!window.aristoryBebitoMobile.gerarRota(s, 'ida').encontro && i <= 2 && !tipos.slice(0, i).some((t) => t === 'obra' || t === 'onibus')) return s;
    }
    return 1;
  });
  await abrir(page, `bebito&cena=viagem-de-carro&viagem=ida,ari,${semente}`);
  await naEstrada(page);
  await viagem(page, { piloto: 'distraido', vezes: 2.5 });
  const travessia = await page.evaluate(() => window.aristoryBebitoMobile.viagem.rota.eventos.find((e) => e.tipo === 'travessia'));
  // acompanha o carro até ele parar na faixa: a frente dele nunca passa da linha com bicho na pista
  let passou = false;
  let parou = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 200000) {
    const st = await estado(page);
    if (st.s + 2.6 > travessia.s - 3.4 + 0.25 && !st.vistos.travessia) passou = true;
    if (st.vistos.susto && st.v < 0.2) { parou = true; break; }
    if (st.s > travessia.s + 12) break;
    await page.waitForTimeout(120);
  }
  await page.screenshot({ path: `${OUT}-distraido-1-susto.png` });
  const st = await estado(page);
  confere(parou && !passou, `sem frear, o carro freou sozinho antes da faixa (parou a ${(travessia.s - 3.4 - st.s - 2.6).toFixed(2)} m da linha)`);
  confere(st.vistos.susto === 1, 'os bichos levaram o susto (e a carona reclamou)');
  // e depois que eles passam, o carro segue sozinho
  const seguiu = await page.waitForFunction((s) => window.aristoryBebitoMobile.viagem.estado.s > s + 8, travessia.s, { timeout: 120000 }).then(() => true).catch(() => false);
  const depois = await estado(page);
  confere(seguiu && depois.sustos === 1 && depois.gentilezas === 0, 'quando a faixa esvazia ele segue, com um susto na conta e sem a gentileza');
  await page.context().close();
}

// ===================================================================== manche
if (roda('manche')) {
  console.log('— o manche de verdade: virar, frear, acelerar e buzinar');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, 'bebito&cena=viagem-de-carro&viagem=ida,ari,3');
  await naEstrada(page);
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.fase === 'dirigindo' && window.aristoryBebitoMobile.viagem.estado.v > 3, null, { timeout: 60000 });
  await page.screenshot({ path: `${OUT}-manche-0-dica.png` });
  const a = await estado(page);
  confere(a.aviso.includes('freia') || a.aviso.includes('Manche'), `no começo o painel ensina os comandos ("${a.aviso}")`);
  await page.keyboard.down('ArrowLeft');
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.l < -1.2, null, { timeout: 30000 }).catch(() => {});
  await page.keyboard.up('ArrowLeft');
  const b = await estado(page);
  confere(b.l < -1.2, `seta para a esquerda leva para a faixa da esquerda (l ${a.l.toFixed(2)} → ${b.l.toFixed(2)})`);
  await page.keyboard.down('KeyD');
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.l > 1.2, null, { timeout: 30000 }).catch(() => {});
  await page.keyboard.up('KeyD');
  confere((await estado(page)).l > 1.2, 'D leva de volta para a da direita');
  await page.keyboard.down('ArrowUp');
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.v > 11.5, null, { timeout: 30000 }).catch(() => {});
  const rapido = await estado(page);
  await page.keyboard.up('ArrowUp');
  confere(rapido.v > 11.5, `seta para cima acelera além do passeio (${rapido.v.toFixed(1)} m/s)`);
  await page.keyboard.down('ArrowDown');
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.v < 0.2, null, { timeout: 30000 }).catch(() => {});
  const parado = await estado(page);
  await page.waitForTimeout(600);
  const aindaParado = await estado(page);
  await page.keyboard.up('ArrowDown');
  confere(parado.v < 0.2 && aindaParado.s - parado.s < 0.05, 'seta para baixo freia até parar, e segurando ele fica parado');
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.v > 6, null, { timeout: 30000 }).catch(() => {});
  confere((await estado(page)).v > 6, 'soltando o freio ele volta a andar sozinho');
  const buzinas0 = await page.evaluate(() => window.jogo.audio.contagem.get('buzinaDoBebito') ?? 0);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
  const buzinas1 = await page.evaluate(() => window.jogo.audio.contagem.get('buzinaDoBebito') ?? 0);
  confere(buzinas1 === buzinas0 + 1, 'E buzina');
  await page.context().close();
}

// ====================================================================== volta
if (roda('volta')) {
  console.log('— a volta: do parque para casa, de carro');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await page.evaluate(() => window.jogo.setFlag('bebito:carro-no-parque', true));
  await abrir(page, 'bebito&cena=frente-da-casa');
  const garagem = await page.evaluate(() => !!window.jogo.scene.getObjectByName('bebito-mobile'));
  confere(!garagem, 'com o carro no parque, a garagem de casa fica vazia');
  await abrir(page, 'bebito&cena=villa-lobos&entrada=do-carro');
  const parque = await page.evaluate(() => {
    const j = window.jogo;
    return {
      carro: !!j.scene.getObjectByName('bebito-mobile'),
      rotulos: j.current.world.interactables.filter((i) => i.enabled).map((i) => `${i.id}|${i.label}`),
    };
  });
  confere(parque.carro, 'o carro está no estacionamento');
  confere(parque.rotulos.includes('parque:de-carro|Voltar pra casa') && !parque.rotulos.some((r) => r.startsWith('door:frente-da-casa')), 'o "Voltar pra casa" do portão virou lembrete: quem veio de carro volta de carro');
  await page.evaluate(() => window.jogo.setZoom(12));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}-volta-1-no-parque.png` });
  await page.evaluate(() => { void window.jogo.current.world.interactables.find((i) => i.id === 'parque:bebito-mobile').trigger(window.jogo); });
  await page.waitForSelector('.escolhas.show button', { timeout: 15000 });
  await page.locator('.escolhas.show button').first().click();
  await page.waitForFunction(() => [...document.querySelectorAll('.escolhas.show button')].some((b) => b.textContent.includes('Renan')), null, { timeout: 15000 });
  await page.locator('.escolhas.show button').nth(0).click();
  await jogarAte(page, () => window.jogo.idDaCena === 'viagem-de-carro');
  await naEstrada(page);
  const rota = await page.evaluate(() => ({ sentido: window.aristoryBebitoMobile.viagem.rota.sentido, biomas: window.aristoryBebitoMobile.viagem.rota.trechos.map((t) => t.bioma).join(' → ') }));
  confere(rota.sentido === 'volta' && rota.biomas === 'parque → avenida → bairro', `a volta sai da beira do parque e chega no bairro (${rota.biomas})`);
  await viagem(page, { piloto: 'bom', vezes: 3.5 });
  if (await page.evaluate(() => !!window.aristoryBebitoMobile.viagem.rota.encontro)) confere(await jogarAte(page, () => window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.fase === 'feito', 240000, 150), 'o encontro da volta terminou');
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.fase === 'chegando', null, { timeout: 400000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}-volta-2-chegando-em-casa.png` });
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.fase === 'fim', null, { timeout: 120000 }).catch(() => {});
  await viagem(page, { vezes: 1 });
  const emCasa = await jogarAte(page, () => window.jogo.idDaCena === 'frente-da-casa' && !!window.jogo.current, 60000, 400);
  await page.waitForTimeout(1500);
  const casa = await page.evaluate(() => {
    const j = window.jogo;
    const c = j.scene.getObjectByName('bebito-mobile');
    return { carro: !!c, x: c?.position.x, flag: j.flag('bebito:carro-no-parque'), travado: j.player.locked };
  });
  confere(emCasa && casa.carro && Math.abs(casa.x + 5.6) < 0.05 && !casa.flag && !casa.travado, 'chegaram em casa, e o carro voltou para a garagem');
  await page.evaluate(() => window.jogo.setZoom(13));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-volta-3-em-casa.png` });
  await page.context().close();
}

// ============================================================= estacionamento
if (roda('estacionamento')) {
  console.log('— o estacionamento do outro lado da rua do ônibus');
  const page = await pagina();
  // sem a chave (?semBebito, agora que ela está ligada), o parque é o de sempre
  await abrir(page, 'semBebito&cena=villa-lobos');
  const semChave = await page.evaluate(() => ({
    lote: (() => { let tem = false; window.jogo.current.world.root.traverse((o) => { if (o.userData.peca === 'estacionamento') tem = true; }); return tem; })(),
    limite: window.jogo.current.world.bounds.maxX,
  }));
  confere(!semChave.lote && semChave.limite === 44, `sem a chave do carro não há estacionamento, e o parque acaba na rua (x ${semChave.limite})`);
  // com a chave e o carro em casa: o lote com a vaga do coração vazia
  await abrir(page, 'bebito&cena=villa-lobos');
  await comOCarro(page);
  await abrir(page, 'bebito&cena=villa-lobos&em=50.6,1.6&olhar=2.4');
  const vazio = await page.evaluate(() => {
    const j = window.jogo;
    let lote = false;
    j.current.world.root.traverse((o) => { if (o.userData.peca === 'estacionamento') lote = true; });
    return { lote, carro: !!j.scene.getObjectByName('bebito-mobile'), limite: j.current.world.bounds.maxX };
  });
  confere(vazio.lote && !vazio.carro && vazio.limite > 60, `com a chave, o estacionamento existe (até x ${vazio.limite}), e com o carro em casa a vaga dele está vazia`);
  await page.evaluate(() => window.jogo.setZoom(9));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-estacionamento-1-vaga-vazia.png` });
  // com o carro no parque
  await page.evaluate(() => window.jogo.setFlag('bebito:carro-no-parque', true));
  await abrir(page, 'bebito&cena=villa-lobos&entrada=do-carro');
  const lote = await page.evaluate(() => {
    const j = window.jogo;
    const c = j.scene.getObjectByName('bebito-mobile');
    const colisores = j.current.world.colliders;
    const bate = (x, z, r = 0.42) => colisores.some((k) => (k.kind === 'circle'
      ? Math.hypot(x - k.x, z - k.z) < k.r + r
      : (() => {
        // (caixa girada: o giro do colisor tem o sinal contrário ao do `rotation.y`)
        const c0 = Math.cos(k.rot ?? 0);
        const s0 = Math.sin(k.rot ?? 0);
        const dx = x - k.x;
        const dz = z - k.z;
        const lx = dx * c0 - dz * s0;
        const lz = dx * s0 + dz * c0;
        return Math.abs(lx) < k.hw + r && Math.abs(lz) < k.hd + r;
      })()));
    // o caminho a pé: da descida, pela passagem da cerca viva, a faixa atrás do ônibus, a calçada do parque e o vão
    const pontos = [[51.2, 3.0], [47.0, 3.0], [41.0, 3.0], [35.6, 3.0], [35.6, 9.0], [35.4, 13.0], [32.5, 13.0]];
    const ruins = [];
    for (let i = 0; i < pontos.length - 1; i++) {
      const [ax, az] = pontos[i];
      const [bx, bz] = pontos[i + 1];
      const n = Math.ceil(Math.hypot(bx - ax, bz - az) / 0.2);
      for (let k = 0; k <= n; k++) {
        const x = ax + ((bx - ax) * k) / n;
        const z = az + ((bz - az) * k) / n;
        if (bate(x, z)) { ruins.push([+x.toFixed(1), +z.toFixed(1)]); break; }
      }
    }
    const p = j.player.position;
    return {
      onde: c ? [+c.position.x.toFixed(2), +c.position.z.toFixed(2), +c.rotation.y.toFixed(2)] : null,
      descida: [+p.x.toFixed(1), +p.z.toFixed(1)], descidaLivre: !bate(p.x, p.z, 0.4),
      ruins,
      // a cerca viva fecha o lote: de fora da passagem e da entrada não se entra
      fechado: bate(48.65, -20) && bate(48.65, 0) && bate(48.65, 20) && bate(56, 13.05) && bate(56, -13.05),
      rotulos: j.current.world.interactables.filter((i) => i.enabled).map((i) => i.label),
    };
  });
  confere(lote.onde && Math.abs(lote.onde[0] - 51.9) < 0.05 && Math.abs(lote.onde[1] - 5.5) < 0.05 && Math.abs(lote.onde[2] + 1.57) < 0.02,
    `o carro está na vaga do coração, de nariz para a rua (${lote.onde})`);
  confere(lote.descidaLivre, `a dupla desce na passagem, fora de qualquer colisor (${lote.descida})`);
  confere(lote.ruins.length === 0, `da vaga ao portão do parque, a pé, nada no caminho${lote.ruins.length ? ' — bate em ' + JSON.stringify(lote.ruins) : ''}`);
  confere(lote.fechado, 'a cerca viva fecha o lote: só se entra pela passagem e pela entrada da cancela');
  confere(lote.rotulos.includes('Voltar pra casa de carro'), 'na passagem, o carro oferece "Voltar pra casa de carro"');
  // as fotos: a vista de sempre, girando, e de cima
  await page.evaluate(() => window.jogo.setZoom(14));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}-estacionamento-2-chegada.png` });
  await page.keyboard.press('KeyQ');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}-estacionamento-3-girado.png` });
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(1400);
  const tomada = async (nome, de, para) => {
    await page.evaluate(([d, p]) => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(...d), new V(...p)); }, [de, para]);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-estacionamento-${nome}.png` });
  };
  await tomada('4-de-cima', [56.5, 30, 14], [52, 0, 0]);
  await tomada('5-do-ponto', [35.4, 2.6, 0.2], [52, 1, 4]);
  await tomada('6-o-bebito', [57.8, 2.6, 3.0], [51.9, 1.1, 5.4]);
  await tomada('7-carros', [56.4, 2.4, -11.2], [61, 0.8, -2]);
  await page.evaluate(() => window.jogo.setCameraOmbro(null));
  // a cancela sobe quando alguém chega perto da entrada
  await abrir(page, 'bebito&cena=villa-lobos&em=46.4,-10.8&olhar=1.57');
  const anguloDoBraco = () => { let r = 0; window.jogo.scene.traverse((o) => { if (o.name === 'braco-da-cancela') r = o.rotation.z; }); return r; };
  await page.waitForFunction(anguloDoBraco, null, { timeout: 1 }).catch(() => {});
  await page.waitForFunction(`(${anguloDoBraco.toString()})() > 1.0`, null, { timeout: 30000 }).catch(() => {});
  const braco = await page.evaluate(anguloDoBraco);
  confere(braco > 1.0, `a cancela sobe com a dupla na entrada (${braco.toFixed(2)} rad)`);
  await page.evaluate(() => window.jogo.setZoom(9));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-estacionamento-8-cancela.png` });
  // o peso da vista da chegada
  await abrir(page, 'bebito&cena=villa-lobos&entrada=do-carro');
  await page.waitForTimeout(1500);
  const peso = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
  console.log(`   peso na chegada de carro: ${peso.calls} desenhos, ${peso.triangles} triângulos`);
  await page.context().close();
}

// ====================================================================== bichos
if (roda('bichos')) {
  console.log('— os bichos da travessia: tamanho, pés no chão, e a tartaruga andando e escondida');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, `bebito&cena=viagem-de-carro&viagem=ida,ari,${SEMENTE}`);
  await naEstrada(page);
  await viagem(page, { piloto: 'bom', vezes: 3 });
  const rota = await page.evaluate(() => window.aristoryBebitoMobile.viagem.rota);
  const ponto = (s, l) => page.evaluate(([a, b]) => window.aristoryBebitoMobile.viagem.naPista(a, b), [s, l]);
  const fotoEm = async (nome, sOlho, lOlho, alto, sAlvo, lAlvo, altoDoAlvo = 0.5) => {
    const de = await ponto(sOlho, lOlho);
    const para = await ponto(sAlvo, lAlvo);
    await viagem(page, { camera: { de: [de.x, alto, de.z], para: [para.x, altoDoAlvo, para.z] } });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}-bichos-${nome}.png` });
    await viagem(page, { camera: null });
  };
  // a caixa de cada andante, no mundo: [largura, altura, comprimento] e o ponto mais baixo
  const medir = (mx, mz) => page.evaluate(([mx, mz]) => {
    // o grupo cuja fila está perto da faixa deste evento
    let T = null;
    let menor = 1e9;
    window.jogo.scene.traverse((o) => {
      if (o.userData.peca !== 'travessia-de-bichos') return;
      const d = Math.hypot(o.children[0].position.x - mx, o.children[0].position.z - mz);
      if (d < menor) { menor = d; T = o; }
    });
    if (!T) return [];
    const B = window.jogo.scene.position.constructor;
    return T.children.map((c) => {
      let minY = 1e9, maxY = -1e9;
      const v = new B();
      c.updateMatrixWorld(true);
      c.traverse((o) => {
        if (!o.isMesh || !o.geometry.attributes.position) return;
        const p = o.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y); }
      });
      return { peca: c.userData.peca ?? c.name, alto: maxY - minY, chao: minY, y: c.position.y };
    });
  }, [mx, mz]);
  for (const e of rota.eventos.filter((x) => x.tipo === 'travessia')) {
    // os bichos começam a atravessar quando o carro chega perto: devagar desde antes, para pegar a mãe no meio da faixa
    await page.waitForFunction((s) => window.aristoryBebitoMobile.viagem.estado.s > s - 30, e.s, { timeout: 240000 }).catch(() => {});
    await viagem(page, { vezes: 0.5 });
    const lado = e.lado ?? 1;
    // espera a mãe (ou a primeira tartaruga) chegar no meio da faixa, e segura o relógio quase parado
    const meio = await ponto(e.s, 0);
    const chegou = await page.waitForFunction(([mx, mz]) => {
      const grupos = [];
      window.jogo.scene.traverse((o) => { if (o.userData.peca === 'travessia-de-bichos') grupos.push(o); });
      return grupos.some((T) => { const f = T.children[0]; return Math.hypot(f.position.x - mx, f.position.z - mz) < 1.0; });
    }, [meio.x, meio.z], { timeout: 120000, polling: 100 }).then(() => true).catch(() => false);
    await viagem(page, { vezes: 0.02 });
    confere(chegou, `${e.bichos}: o primeiro chegou ao meio da faixa`);
    // a vista do jogo (a câmera de perseguição), como no celular do Renan
    await page.screenshot({ path: `${OUT}-bichos-${e.bichos}-jogo.png` });
    const caixas = await medir(meio.x, meio.z);
    if (e.bichos === 'patos') {
      const [mae, ...filhotes] = caixas;
      console.log(`   mãe ${mae.alto.toFixed(2)} m de altura; patinhos ${filhotes.map((f) => f.alto.toFixed(2)).join(', ')}`);
      confere(filhotes.length >= 2 && filhotes.every((f) => f.alto < mae.alto * 0.7), 'cada patinho é bem menor que a mãe (menos de 70% dela)');
      confere(mae.alto < 1.0, `a pata não passa de 1 m de altura (${mae.alto.toFixed(2)} m)`);
      console.log(`   pés mais baixos: ${caixas.map((c) => c.chao.toFixed(3)).join(', ')}`);
      confere(caixas.every((c) => c.chao > -0.05), 'nenhum pato afundou no chão');
      await fotoEm('patos-3-4', e.s + 3.2, lado * 2.6, 0.8, e.s - 0.2, 0, 0.3);
      await fotoEm('patos-de-lado', e.s + 0.4, -4.2 * lado, 0.55, e.s, 0, 0.25);
    } else {
      const t = caixas[0];
      console.log(`   tartaruga ${t.alto.toFixed(2)} m de altura, ponto mais baixo ${t.chao.toFixed(3)}`);
      confere(t.chao > -0.03, 'a tartaruga não afunda no asfalto');
      await fotoEm('tigres-3-4', e.s + 3.0, lado * 2.4, 0.85, e.s - 0.2, 0, 0.3);
      await fotoEm('tigres-de-lado', e.s + 0.5, -3.8 * lado, 0.5, e.s, 0, 0.3);
      await fotoEm('tigres-de-frente', e.s - 4.2, 0.4 * lado, 0.55, e.s - 0.2, 0, 0.3);
      // a buzina: ela se esconde no casco
      // (com o piloto de teste ligado a buzina é ignorada: o manche é de verdade só para este botão)
      await viagem(page, { vezes: 1, piloto: 'nenhum' });
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(900);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(600);
      await viagem(page, { vezes: 0.02 });
      await fotoEm('tigres-escondida', e.s + 3.0, lado * 2.4, 0.85, e.s - 0.2, 0, 0.3);
    }
    await viagem(page, { vezes: 3, piloto: 'bom' });
  }
  await page.context().close();
}

// ====================================================================== perto
if (roda('perto')) {
  console.log('— de perto: os bichos atravessando e as peças da pista');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, `bebito&cena=viagem-de-carro&viagem=ida,ari,${SEMENTE}`);
  await naEstrada(page);
  await viagem(page, { piloto: 'bom', vezes: 3 });
  const rota = await page.evaluate(() => window.aristoryBebitoMobile.viagem.rota);
  const ponto = (s, l) => page.evaluate(([a, b]) => window.aristoryBebitoMobile.viagem.naPista(a, b), [s, l]);
  const fotoEm = async (nome, sOlho, lOlho, alto, sAlvo, lAlvo, altoDoAlvo = 0.5) => {
    const de = await ponto(sOlho, lOlho);
    const para = await ponto(sAlvo, lAlvo);
    await viagem(page, { camera: { de: [de.x, alto, de.z], para: [para.x, altoDoAlvo, para.z] } });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}-perto-${nome}.png` });
    await viagem(page, { camera: null });
  };
  for (const e of rota.eventos) {
    await page.waitForFunction((s) => window.aristoryBebitoMobile.viagem.estado.s > s - 14, e.s, { timeout: 240000 }).catch(() => {});
    if (e.tipo === 'travessia') {
      await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.v < 0.3, null, { timeout: 60000 }).catch(() => {});
      await viagem(page, { vezes: 0.6 });
      await page.waitForTimeout(1600);
      // de frente para os bichos, com o carro parado atrás deles
      await fotoEm(`${e.bichos}`, e.s + 4.2, 0.6, 1.5, e.s - 0.2, 0, 0.45);
      await fotoEm(`${e.bichos}-de-lado`, e.s + 1.2, -4.6 * (e.lado ?? 1), 0.9, e.s, 0, 0.35);
      await viagem(page, { vezes: 3 });
    } else if (e.tipo === 'obra') {
      await fotoEm('obra', e.s - 9, e.faixa === 0 ? 3 : -3, 2.4, e.s + 4, e.faixa === 0 ? -1.75 : 1.75, 0.5);
    } else if (e.tipo === 'semaforo') {
      await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.v < 0.3, null, { timeout: 60000 }).catch(() => {});
      await fotoEm('semaforo', e.s - 12, -1.5, 2.6, e.s + 2, 1.4, 3.2);
    } else if (e.tipo === 'lombada') {
      await fotoEm('lombada', e.s - 7, -2.6, 1.6, e.s, 0.4, 0.1);
    } else if (e.tipo === 'buracos') {
      await fotoEm('buracos', e.s - 6, 0, 2.6, e.s + 6, 0, 0);
    } else if (e.tipo === 'poca') {
      await fotoEm('poca', e.s - 6, e.faixa === 0 ? 1 : -1, 2.0, e.s, e.faixa === 0 ? -1.75 : 1.75, 0);
    }
  }
  await page.context().close();
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
console.log(falhas.length ? `${falhas.length} FALHA(S)` : 'tudo certo');
await browser.close();
process.exit(erros.length || falhas.length ? 1 : 0);
