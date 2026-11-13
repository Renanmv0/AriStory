/**
 * O CARRO POR DENTRO (`docs/BEBITO-MOBILE-DENTRO.md`, etapa D parte 1). Tudo atrás
 * da chave própria (`?carroPorDentro`, junto de `?bebito`: o save de teste).
 *
 * - ESCONDIDO: com `?semCarroPorDentro` a porta da garagem continua "Sair de carro"
 *   (a chave do carro por dentro está ligada no jogo);
 * - ENTRAR: da garagem, "Entrar no Bebito Mobile": a câmera vai até a porta, a porta
 *   abre de verdade, quem o jogador controla senta no banco do motorista e a câmera
 *   chega aos olhos dele (a cabeça some); a porta fecha, o outro está sentado ao
 *   lado, e o menu "O que a gente faz?" aparece; olhar em volta gira o pescoço;
 * - DESCER: a câmera volta, a porta abre e fecha, e os dois ficam em pé FORA do carro,
 *   com a pose de carro desfeita, a cabeça de volta e o jogador destravado
 *   (a lição do bug da pose que ficou grudada);
 * - DESCANSAR: os encostos deitam e viram a cama, os dois deitam lado a lado (a câmera mostra os dois
 *   de cima, com corte visual do teto), a conversa curta, e o menu "Cochilar / Sair do carro"; o cochilo é
 *   um fade com ronco; sair desfaz tudo (levantar e descer); a memória e o contador no save;
 * - VIAJAR: de dentro, "Escolher destino" leva à pergunta de quem dirige e à estrada (testado
 *   com cada resposta: o motorista certo ao volante, nenhuma pose nem cabeça escondida sobrando);
 * - SEMCHAVE: na estrada, com `?semCarroPorDentro`, não existe o 👀 nem o V faz nada;
 * - PASSAGEIRO: na viagem, o 👀 (sempre na tela) liga a visão do passageiro: o carro vai no
 *   PILOTO AUTOMÁTICO, o motorista escolhido e o passageiro continuam nos mesmos bancos,
 *   a câmera entra nos olhos do passageiro, o menu "O que fazer?" é o de cada um (o Ari: cantarolar
 *   Danza Kuduro; o Renan: jogar Brawl Stars), encostar no ombro mostra os dois de frente, com o gesto no corpo, e voltar devolve o volante;
 * - PILOTO: a viagem inteira no piloto automático de jogo (nenhum tropeço nem susto, para nas
 *   faixas e no sinal, sem perseguir os corações) e a chegada com tudo desfeito.
 *
 * Uso: node scripts/carroPorDentro.mjs /caminho/prefixo
 *      SO=escondido|semChave|entrar|descansar|descer|viajar|passageiro|piloto roda uma parte (descansar e descer partem de entrar); CEL=1 no celular em pé
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './dentro';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw new Error('Use somente o preview separado do jogo oficial.');
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = process.env.SO ? process.env.SO.split(',') : null;
const roda = (parte) => !SO || SO.includes(parte);

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
  page.on('pageerror', (e) => { if (erros.length < 40) erros.push('PAGEERROR: ' + e.message); });
  return page;
};
const abrir = async (page, query) => {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  if (process.env.RAPIDO) await page.evaluate(() => window.jogo.renderer.setPixelRatio(0.5));
  await page.waitForTimeout(1200);
};
const comOCarro = (page) => page.evaluate(() => {
  for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) window.jogo.setFlag(f);
});
const rotulos = (page) => page.evaluate(() => window.jogo.current.world.interactables.filter((i) => i.enabled).map((i) => i.label));
const disparar = (page, id) => page.evaluate((i) => { void window.jogo.current.world.interactables.find((x) => x.id === i).trigger(window.jogo); }, id);
/** o que está na mão da cena: dentro, a câmera, a cabeça, as poses */
const estado = (page) => page.evaluate(() => {
  const j = window.jogo;
  const carro = j.scene.getObjectByName('bebito-mobile')?.userData.carro;
  const d = window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual;
  const cabeca = j.player.rig.cabecaNoMundo(new j.scene.position.constructor());
  const cam = j.camOmbro;
  return {
    dentro: d?.dentro ?? null,
    mistura: d?.camera?.dentro ?? null,
    ativa: d?.camera?.ativa ?? null,
    porta: carro?.portaAberta ?? null,
    montou: j.player.riding,
    cabeca: j.player.rig.head.visible,
    cabecaDele: j.parceiro.rig.head.visible,
    poseEu: j.player.rig.noCarro,
    poseEle: j.parceiro.rig.noCarro,
    ele: j.parceiro.riding,
    travado: j.player.locked,
    camera: cam ? { x: cam.position.x, y: cam.position.y, z: cam.position.z } : null,
    distanciaDoOlho: cam ? Math.hypot(cam.position.x - cabeca.x, cam.position.y - cabeca.y, cam.position.z - cabeca.z) : null,
    eu: { x: j.player.position.x, z: j.player.position.z },
    pergunta: document.querySelector('.dialogue.show, .dialogue')?.textContent?.slice(0, 80) ?? '',
    botoes: [...document.querySelectorAll('.escolhas.show button')].map((b) => b.textContent),
  };
});
/** aperta E (avança as falas) até aparecerem botões de escolha, com teto de tempo */
const ateOsBotoes = async (page, teto = 120000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < teto) {
    if (await page.evaluate(() => document.querySelectorAll('.escolhas.show button').length > 0)) return true;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
  }
  return false;
};
const aperta = async (page, n = 1) => { for (let i = 0; i < n; i++) { await page.keyboard.press('KeyE'); await page.waitForTimeout(380); } };

// ================================================================== escondido
if (roda('escondido')) {
  console.log('— escondido: sem ?carroPorDentro a porta da garagem continua "Sair de carro"');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, 'bebito&semCarroPorDentro&cena=frente-da-casa');
  const r = await rotulos(page);
  confere(r.includes('Sair de carro') && !r.includes('Entrar no Bebito Mobile'), 'a porta do motorista é a de sempre (Sair de carro)');
  await page.context().close();
}

// ===================================================================== entrar
let ficou = null;
if (roda('entrar') || roda('descer') || roda('descansar')) {
  console.log('— entrar no carro pela garagem (e descer)');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, 'bebito&carroPorDentro&cena=frente-da-casa');
  if (process.env.JOGADOR === 'renan') await page.evaluate(() => window.jogo.swapCharacters());
  const r = await rotulos(page);
  confere(r.includes('Entrar no Bebito Mobile') && !r.includes('Sair de carro'), 'a porta do motorista vira "Entrar no Bebito Mobile"');
  await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 5; });
  const antes = await estado(page);
  await disparar(page, 'frente:sair-de-carro');
  // a câmera vai até a porta e a porta abre
  const abriu = await page.waitForFunction(() => {
    const abertura = window.jogo.scene.getObjectByName('bebito-mobile').userData.carro.portaAberta;
    return abertura > 0.5 ? abertura : false;
  }, null, { timeout: 120000 });
  const aberturaMedida = await abriu.jsonValue();
  confere(aberturaMedida > 0.5, `a porta abre de verdade (${aberturaMedida.toFixed(2)})`);
  // A foto demora no Chromium: a medida é a da abertura, antes de ela começar a fechar.
  await page.screenshot({ path: `${OUT}-1-porta-abrindo.png` });
  // quem joga entra e a câmera chega aos olhos dele
  await page.waitForFunction(() => window.jogo.player.riding, null, { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}-2-entrando.png` });
  await page.waitForFunction(() => window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual?.dentro === true, null, { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(800);
  const p2 = await estado(page);
  console.log(`   dentro: ${JSON.stringify({ dentro: p2.dentro, mistura: p2.mistura, porta: p2.porta, cabeca: p2.cabeca, pose: p2.poseEu, ele: p2.poseEle, dist: p2.distanciaDoOlho })}`);
  confere(p2.dentro === true && p2.montou && p2.travado, 'dentro do carro: quem joga montado no banco e o jogo travado');
  confere(p2.mistura >= 0.99 && p2.distanciaDoOlho < 0.25, `a câmera chegou aos olhos dele (a ${p2.distanciaDoOlho?.toFixed(3)} m da cabeça)`);
  confere(p2.cabeca === false && p2.cabecaDele === true, 'a cabeça de quem olha some (a do outro, não)');
  confere(p2.poseEu === 'dirigindo' && p2.poseEle === 'passageiro' && p2.ele, 'quem joga no volante e o outro de passageiro, sentado do lado');
  // a primeira vez: a conversa, e depois o menu (a porta fecha enquanto isso)
  for (let i = 0; i < 40; i++) {
    const e = await estado(page);
    if (e.botoes.length) break;
    await aperta(page, 1);
  }
  await page.waitForFunction(() => window.jogo.scene.getObjectByName('bebito-mobile').userData.carro.portaAberta < 0.01, null, { timeout: 60000 }).catch(() => {});
  const fechada = await estado(page);
  confere(fechada.porta < 0.01, `a porta fechou (${fechada.porta.toFixed(2)})`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}-3-dentro-menu.png` });
  const menu = await estado(page);
  confere(menu.botoes.join('|') === 'Escolher destino|Descansar no carro|Descer do carro', `o menu "O que a gente faz?" (${menu.botoes.join(', ')})`);
  ficou = page;

  /** o que tem que estar desfeito quando os dois voltam para fora do carro */
  const confereDesceu = async (page, nome) => {
    await page.waitForFunction(() => window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual?.dentro === false && !window.jogo.player.locked, null, { timeout: 180000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}-${nome}-desceu.png` });
    const fim = await estado(page);
    console.log(`   depois de descer: ${JSON.stringify({ montou: fim.montou, cabeca: fim.cabeca, poseEu: fim.poseEu, poseEle: fim.poseEle, ele: fim.ele, travado: fim.travado, porta: fim.porta, ativa: fim.ativa })}`);
    confere(!fim.montou && !fim.ele && fim.poseEu === null && fim.poseEle === null, 'desceram: nenhum dos dois montado nem com pose de carro');
    confere(fim.cabeca === true && fim.cabecaDele === true, 'a cabeça de volta nos dois');
    confere(fim.travado === false && fim.ativa === false, 'o jogador destravado e a câmera de dentro desligada');
    confere(fim.porta === 0, 'a porta fechou');
    const fora = await page.evaluate(() => {
      const j = window.jogo;
      const carro = j.scene.getObjectByName('bebito-mobile');
      const livre = (q) => !j.current.world.colliders.some((k) => (k.kind === 'circle'
        ? Math.hypot(q.x - k.x, q.z - k.z) < k.r + 0.3
        : Math.abs(q.x - k.x) < k.hw + 0.3 && Math.abs(q.z - k.z) < k.hd + 0.3));
      return { eu: livre(j.player.position), ele: livre(j.parceiro.position), cam: j.camOmbro === null || j.camOmbro === undefined, encostos: carro.userData.carro.camaFeita };
    });
    confere(fora.eu && fora.ele, 'os dois ficaram FORA dos colisores (nenhum preso dentro do carro)');
    confere(fora.cam, 'a câmera isométrica voltou');
    confere(await page.evaluate(() => window.jogo.scene.getObjectByName('bebito-mobile').getObjectByName('teto').visible), 'o teto voltou ao sair');
    confere(fora.encostos < 0.01, `os encostos voltaram para cima (${fora.encostos.toFixed(2)})`);
  };

  if (roda('descer') && !roda('descansar')) {
    // olhar em volta: gira o pescoço (o `g.olharLivre` é o manche; aqui põe o ângulo)
    await page.evaluate(() => { window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.giro = -1.2; });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}-4-olhando-o-outro.png` });
    await page.evaluate(() => { window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.giro = 1.5; });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}-5-olhando-a-janela.png` });
    await page.evaluate(() => { window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.giro = 0; });
    await page.locator('.escolhas.show button').nth(2).click();
    await confereDesceu(page, '6');
  }

  if (roda('descansar')) {
    console.log('— descansar no carro (deitados, a conversa, o cochilo)');
    await page.locator('.escolhas.show button').nth(1).click();
    await page.waitForFunction(() => window.jogo.scene.getObjectByName('bebito-mobile').userData.carro.camaFeita > 0.99, null, { timeout: 120000 });
    await page.waitForFunction(() => window.jogo.player.rig.deitado === true, null, { timeout: 60000 }).catch(() => {});
    await page.waitForFunction(() => window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.especial === 1, null, { timeout: 60000 });
    const dd = await page.evaluate(() => {
      const j = window.jogo;
      const cam = j.camOmbro;
      const dir = new (j.scene.position.constructor)(0, 0, -1).applyQuaternion(cam.quaternion);
      const carro = j.scene.getObjectByName('bebito-mobile').userData.carro;
      return {
        deitados: j.player.rig.deitado === true && j.parceiro.rig.deitado === true,
        montados: j.player.riding && j.parceiro.riding,
        ancora: j.player.object.parent?.name,
        camaFeita: carro.camaFeita,
        olhaPraCima: dir.y,
        alturaDaCamera: cam.position.y,
        peso: { ...j.renderer.info.render },
        musica: j.audio?.clima ?? null,
        tetoFechado: carro.group.getObjectByName('teto').visible,
        cabecaSumiu: j.player.rig.head.visible === false,
      };
    });
    console.log(`   deitados: ${JSON.stringify(dd)}`);
    confere(dd.camaFeita > 0.99 && dd.deitados && dd.montados && dd.ancora === 'cama', 'os encostos deitaram e os dois estão deitados na cama do carro');
    confere(dd.olhaPraCima < -0.85, `a câmera mostra os dois de cima (inclinação ${dd.olhaPraCima.toFixed(2)})`);
    confere(dd.alturaDaCamera < 3.0, 'a câmera fica abaixo das vigas da garagem');
    confere(!dd.tetoFechado, 'o corte visual do teto permite ver os dois, como na barraca');
    confere(!dd.cabecaSumiu, 'a cabeça de quem joga está visível na tomada de cima');
    await page.screenshot({ path: `${OUT}-7-descanso-vista-de-cima.png` });
    // a conversa curta, e o menu
    let menu2 = [];
    for (let i = 0; i < 40 && !menu2.length; i++) {
      menu2 = (await estado(page)).botoes;
      if (!menu2.length) await aperta(page, 1);
    }
    confere(menu2.join('|') === 'Cochilar um pouquinho|Sair do carro', `depois da conversa, o menu (${menu2.join(', ')})`);
    await page.evaluate(() => { window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.giro = -1.2; window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.altura = 0.5; });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-8-descanso-menu.png` });
    await page.evaluate(() => { window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.giro = 0; window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.altura = 1.1; });
    const guardado = await page.evaluate(() => ({
      memoria: (JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}').memories ?? []).some((m) => m.id === 'descansamos-no-bebito-mobile'),
      descansos: window.jogo.stat('bebito:descansos'),
    }));
    confere(guardado.memoria && guardado.descansos === 1, `a memória "Descansamos no Bebito Mobile" e o contador de descansos (${guardado.descansos}) foram para o save`);
    // cochilar: o fade, o ronco e acordar
    const roncos0 = await page.evaluate(() => window.jogo.audio.contagem.get('roncoNoCarro') ?? 0);
    await page.locator('.escolhas.show button').nth(0).click();
    await page.waitForFunction((n) => (window.jogo.audio.contagem.get('roncoNoCarro') ?? 0) >= n + 3, roncos0, { timeout: 180000 });
    confere(true, 'cochilou: três roncos (o fade, o ronco baixinho)');
    let depois = [];
    for (let i = 0; i < 40 && !depois.length; i++) {
      depois = (await estado(page)).botoes;
      if (!depois.length) await aperta(page, 1);
    }
    confere(depois.join('|') === 'Cochilar um pouquinho|Sair do carro', 'acordou e o menu voltou');
    // sair do carro: levanta os encostos e desce
    await page.locator('.escolhas.show button').nth(1).click();
    await confereDesceu(page, '9');
  }
  await page.context().close();
}

// ================================================================= passageiro
const viagemDe = (quem = 'ari', semente = 3) => `bebito&carroPorDentro&cena=viagem-de-carro&viagem=ida,${quem},${semente}`;
const naEstrada = (page) => page.waitForFunction(() => window.jogo.idDaCena === 'viagem-de-carro' && !!window.aristoryBebitoMobile.viagem.estado, null, { timeout: 60000 });
const dirigindo = (page) => page.waitForFunction(() => window.aristoryBebitoMobile.viagem.estado.fase === 'dirigindo', null, { timeout: 120000 });
const viagemEstado = (page) => page.evaluate(() => {
  const j = window.jogo;
  const v = window.aristoryBebitoMobile.viagem;
  const cam = j.camOmbro;
  const cabeca = j.player.rig.cabecaNoMundo(new j.scene.position.constructor());
  const botao = document.querySelector('.botao-da-viagem');
  return {
    s: v.estado.s, v: v.estado.v, fase: v.estado.fase, visao: v.estado.visao, piloto: v.estado.piloto,
    tropecos: v.estado.tropecos, sustos: v.estado.sustos, gentilezas: v.estado.gentilezas, coracoes: v.estado.coracoes,
    mistura: v.passageiro?.camera.dentro, ativa: v.passageiro?.camera.ativa,
    poseEu: j.player.rig.noCarro, poseEle: j.parceiro.rig.noCarro,
    cabeca: j.player.rig.head.visible,
    distanciaDoOlho: cam ? Math.hypot(cam.position.x - cabeca.x, cam.position.y - cabeca.y, cam.position.z - cabeca.z) : null,
    botao: botao ? { visivel: botao.classList.contains('show'), ativo: botao.classList.contains('ativo'), icone: botao.textContent } : null,
    botoes: [...document.querySelectorAll('.escolhas.show button')].map((b) => b.textContent),
    cena: j.idDaCena,
  };
});

// ===================================================================== viajar
if (roda('viajar')) {
  console.log('— viajar de dentro do carro (cada resposta de "Quem dirige dessa vez?")');
  for (const [indice, quem] of [[0, 'Ari'], [1, 'Renan']]) {
    const page = await pagina();
    await abrir(page, 'bebito&cena=casa');
    await comOCarro(page);
    await abrir(page, 'bebito&carroPorDentro&cena=frente-da-casa');
  if (process.env.JOGADOR === 'renan') await page.evaluate(() => window.jogo.swapCharacters());
    await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 3; });
    await disparar(page, 'frente:sair-de-carro');
    await page.waitForFunction(() => window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual?.dentro === true, null, { timeout: 120000 });
    await ateOsBotoes(page);
    await page.locator('.escolhas.show button').nth(0).click();
    // "Quem dirige dessa vez?" (a pergunta da primeira volta é pulada: já escolheram Viajar)
    await page.waitForFunction(() => [...document.querySelectorAll('.escolhas.show button')].some((b) => b.textContent === 'Renan'), null, { timeout: 30000 });
    await page.locator('.escolhas.show button').nth(indice).click();
    for (let i = 0; i < 30; i++) {
      if (await page.evaluate(() => window.jogo.idDaCena === 'viagem-de-carro' && !!window.aristoryBebitoMobile.viagem.estado)) break;
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(500);
    }
    await page.waitForFunction(() => window.jogo.idDaCena === 'viagem-de-carro' && window.aristoryBebitoMobile.viagem.estado.fase === 'dirigindo', null, { timeout: 120000 }).catch(() => {});
    await page.waitForTimeout(800);
    const e = await page.evaluate(() => {
      const j = window.jogo;
      const motorista = window.aristoryBebitoMobile.viagem.estado;
      return {
        cena: j.idDaCena, fase: motorista.fase,
        poseEu: j.player.rig.noCarro, poseEle: j.parceiro.rig.noCarro,
        cabeca: j.player.rig.head.visible, cabecaDele: j.parceiro.rig.head.visible,
        eu: j.player.rig.spec.name, travado: j.player.locked,
        porta: document.querySelector('.botao-da-viagem')?.classList.contains('show'),
      };
    });
    console.log(`   ${quem} ao volante: ${JSON.stringify(e)}`);
    confere(e.cena === 'viagem-de-carro' && e.fase === 'dirigindo', `${quem}: saiu da garagem e a viagem começou (${e.cena}, ${e.fase})`);
    const esperadoEu = e.eu === quem ? 'dirigindo' : 'passageiro';
    confere(e.poseEu === esperadoEu && e.poseEle === (esperadoEu === 'dirigindo' ? 'passageiro' : 'dirigindo'), `${quem} dirige: quem joga (${e.eu}) está de ${e.poseEu} e o outro de ${e.poseEle}`);
    confere(e.cabeca === true && e.cabecaDele === true, 'nenhuma cabeça ficou escondida na viagem');
    confere(e.travado === true, 'quem joga está travado ao volante, como em toda viagem');
    await page.screenshot({ path: `${OUT}-v${indice}-na-estrada.png` });
    await page.context().close();
  }
}

// =================================================================== semChave
if (roda('semChave')) {
  console.log('— na estrada, sem ?carroPorDentro: nada novo aparece');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, 'bebito&semCarroPorDentro&cena=viagem-de-carro&viagem=ida,ari,3');
  await naEstrada(page);
  await dirigindo(page);
  await page.keyboard.press('KeyV');
  await page.waitForTimeout(1200);
  const e = await viagemEstado(page);
  confere(!e.botao?.visivel, 'sem a chave não há botão 👀 na tela');
  confere(e.visao === 'fora' && e.piloto === false && e.poseEu === 'dirigindo', 'a tecla V não faz nada (quem joga continua dirigindo, sem piloto)');
  await page.context().close();
}

if (roda('passageiro')) {
  console.log('— a visão do passageiro (o carro no piloto automático)');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, viagemDe('renan'));
  await naEstrada(page);
  await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 2; window.aristoryBebitoMobile.viagem.vezes = 2; });
  await dirigindo(page);
  const antes = await viagemEstado(page);
  confere(antes.botao?.visivel && antes.botao.icone === '👀' && antes.visao === 'fora', `o 👀 está sempre na tela durante a viagem (${antes.botao?.icone})`);
  confere(antes.poseEu === 'passageiro' && antes.poseEle === 'dirigindo', 'Renan dirige e Ari é o passageiro');
  await page.screenshot({ path: `${OUT}-p1-de-fora.png` });
  // liga a visão do passageiro tocando o botão
  await page.locator('.botao-da-viagem').click();
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.passageiro.camera.dentro >= 0.99, null, { timeout: 120000 });
  await page.waitForTimeout(800);
  const d1 = await viagemEstado(page);
  console.log(`   dentro: ${JSON.stringify({ visao: d1.visao, piloto: d1.piloto, mistura: d1.mistura, eu: d1.poseEu, ele: d1.poseEle, cabeca: d1.cabeca, dist: d1.distanciaDoOlho })}`);
  confere(d1.visao === 'dentro' && d1.piloto === true, 'a visão de dentro está ligada e o carro no piloto automático');
  confere(d1.poseEu === 'passageiro' && d1.poseEle === 'dirigindo', 'o motorista e o passageiro continuam nos mesmos bancos');
  confere(d1.cabeca === false && d1.distanciaDoOlho < 0.3, `a câmera está nos olhos de quem joga (a ${d1.distanciaDoOlho?.toFixed(3)} m), a cabeça dele some`);
  confere(d1.botao?.ativo && d1.botao.icone === '🚙', 'o botão fica marcado (🚙: visão externa)');
  await page.screenshot({ path: `${OUT}-p2-dentro-olhando-a-estrada.png` });
  // o carro continua andando sozinho (mesmo com o menu e as falas abertas)
  const s0 = (await viagemEstado(page)).s;
  // o E abre o menu do passageiro
  await page.keyboard.press('KeyE');
  await page.waitForFunction(() => document.querySelectorAll('.escolhas.show button').length > 0, null, { timeout: 30000 });
  const menu = await viagemEstado(page);
  confere(menu.botoes.join('|') === 'Cantarolar Danza Kuduro|Elogiar Renan|Encostar no ombro de Renan|Só olhar a paisagem', `o menu do Ari de carona (${menu.botoes.join(', ')})`);
  await page.screenshot({ path: `${OUT}-p3-menu.png` });
  const camAntes = await page.evaluate(() => ({ x: window.jogo.camOmbro.position.x, z: window.jogo.camOmbro.position.z }));
  // encostar no ombro: o olho vai para o lado do motorista
  await page.locator('.escolhas.show button').nth(2).click();
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.passageiro.camera.encostar === 1, null, { timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}-p4-no-ombro.png` });
  const frente = await page.evaluate(() => {
    const j = window.jogo;
    const carro = j.scene.getObjectByName('bebito-mobile');
    const cam = carro.worldToLocal(j.camOmbro.position.clone());
    return { z: cam.z, cabecas: j.player.rig.head.visible && j.parceiro.rig.head.visible, inclina: j.player.rig.body.rotation.z };
  });
  confere(frente.z > 2 && frente.cabecas && frente.inclina < -0.2, 'o carinho é visto de frente, com as duas cabeças visíveis e o passageiro inclinado');
  // as falas, e voltar ao menu
  confere(await ateOsBotoes(page), 'depois do ombro, o menu volta');
  // cantarolar Danza Kuduro
  const cant0 = await page.evaluate(() => window.jogo.audio.contagem.get('cantarolarKuduro') ?? 0);
  await page.locator('.escolhas.show button').nth(0).click();
  await page.waitForFunction((n) => (window.jogo.audio.contagem.get('cantarolarKuduro') ?? 0) > n, cant0, { timeout: 30000 });
  confere(true, 'o Ari cantarola Danza Kuduro (o som tocou)');
  confere(await ateOsBotoes(page), 'depois do canto, o menu volta');
  // O Renan de verdade (troca de personagem, câmera e gesto) é conferido em carroCamerasEChegada.mjs.
  // o carro andou todo esse tempo, sozinho
  const s1 = (await viagemEstado(page)).s;
  confere(s1 > s0 + 5, `o carro seguiu sozinho durante o menu e as falas (${s0.toFixed(0)} → ${s1.toFixed(0)} m)`);
  await page.context().close();
}

// ===================================================================== piloto
if (roda('piloto')) {
  console.log('— a viagem inteira no piloto automático de jogo (visão do passageiro)');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, viagemDe('ari'));
  await naEstrada(page);
  await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 3; window.aristoryBebitoMobile.viagem.vezes = 3; });
  await dirigindo(page);
  await page.locator('.botao-da-viagem').click();
  await page.waitForFunction(() => window.aristoryBebitoMobile.viagem.passageiro.camera.dentro >= 0.99, null, { timeout: 120000 });
  // (cada evento da pista, uma foto de dentro: o carro parando na faixa sozinho)
  let fotos = 0;
  let fim = null;
  const t0 = Date.now();
  while (Date.now() - t0 < 900000) {
    const e = await viagemEstado(page);
    if (e.fase === 'fim') { fim = e; fim.vistos = await page.evaluate(() => ({ ...window.aristoryBebitoMobile.viagem.estado.vistos })); break; }
    if (e.v < 0.3 && e.s > 20 && fotos < 4) {
      await page.screenshot({ path: `${OUT}-q${fotos++}-parado-no-piloto.png` });
    }
    await page.waitForTimeout(1500);
  }
  confere(!!fim, 'o piloto chegou ao fim da viagem sozinho');
  if (fim) {
    console.log(`   no fim: ${JSON.stringify({ tropecos: fim.tropecos, sustos: fim.sustos, gentilezas: fim.gentilezas, coracoes: fim.coracoes, vistos: fim.vistos })}`);
    confere(fim.tropecos === 0 && fim.sustos === 0, `nenhum tropeço nem susto (${fim.tropecos}, ${fim.sustos})`);
    confere(fim.gentilezas >= 3, `parou para as duas travessias e no sinal (${fim.gentilezas} gentilezas)`);
  }
  // a chegada: as falas, e o parque, com tudo desfeito
  for (let i = 0; i < 80; i++) {
    const e = await viagemEstado(page);
    if (e.cena === 'villa-lobos') break;
    await aperta(page, 1);
  }
  try {
  await page.waitForFunction(() => window.jogo.idDaCena === 'villa-lobos' && !window.jogo.player.locked && window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada?.fase === 'concluida', null, { timeout: 360000 });
  } catch (erro) {
    console.log('diagnóstico da chegada:', await page.evaluate(() => ({ cena: window.jogo.idDaCena, travado: window.jogo.player.locked, chegada: window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada, dialogo: document.querySelector('.dialogue.show')?.textContent })));
    await page.screenshot({ path: `${OUT}-falha-na-chegada.png` });
    throw erro;
  }
  const chegou = await page.evaluate(() => ({
    cena: window.jogo.idDaCena, poseEu: window.jogo.player.rig.noCarro, poseEle: window.jogo.parceiro.rig.noCarro,
    cabeca: window.jogo.player.rig.head.visible, travado: window.jogo.player.locked,
    botao: document.querySelector('.botao-da-viagem')?.classList.contains('show'),
    cam: window.jogo.camOmbro == null,
  }));
  confere(chegou.cena === 'villa-lobos' && chegou.poseEu === null && chegou.poseEle === null && chegou.cabeca === true, 'chegaram ao parque em pé, sem pose de carro e com a cabeça de volta');
  confere(!chegou.travado && !chegou.botao && chegou.cam, 'destravados, sem o botão da viagem e com a câmera de sempre');
  await page.context().close();
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
console.log(falhas.length ? `${falhas.length} FALHA(S)` : 'tudo certo');
await browser.close();
process.exit(erros.length || falhas.length ? 1 : 0);
