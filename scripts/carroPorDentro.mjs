/**
 * O CARRO POR DENTRO (`docs/BEBITO-MOBILE-DENTRO.md`, etapa D parte 1). Tudo atrás
 * da chave própria (`?carroPorDentro`, junto de `?bebito`: o save de teste).
 *
 * - ESCONDIDO: sem `?carroPorDentro` a porta da garagem continua "Sair de carro"
 *   (a chave do carro por dentro está desligada no jogo);
 * - ENTRAR: da garagem, "Entrar no Bebito Mobile": a câmera vai até a porta, a porta
 *   abre de verdade, quem o jogador controla senta no banco do motorista e a câmera
 *   chega aos olhos dele (a cabeça some); a porta fecha, o outro está sentado ao
 *   lado, e o menu "O que a gente faz?" aparece; olhar em volta gira o pescoço;
 * - DESCER: a câmera volta, a porta abre e fecha, e os dois ficam em pé FORA do carro,
 *   com a pose de carro desfeita, a cabeça de volta e o jogador destravado
 *   (a lição do bug da pose que ficou grudada);
 * - DESCANSAR: os encostos deitam e viram a cama, os dois deitam lado a lado (a câmera olha o
 *   teto, que fica FECHADO), a conversa curta, e o menu "Cochilar / Sair do carro"; o cochilo é
 *   um fade com ronco; sair desfaz tudo (levantar e descer); a memória e o contador no save;
 * - VIAJAR: de dentro, "Viajar pro Villa Lobos" leva à pergunta de quem dirige e à estrada.
 *
 * Uso: node scripts/carroPorDentro.mjs /caminho/prefixo
 *      SO=escondido|entrar|descansar|descer roda uma parte (descansar e descer partem de entrar); CEL=1 no celular em pé
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './dentro';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
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
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  return page;
};
const abrir = async (page, query) => {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
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
const aperta = async (page, n = 1) => { for (let i = 0; i < n; i++) { await page.keyboard.press('KeyE'); await page.waitForTimeout(380); } };

// ================================================================== escondido
if (roda('escondido')) {
  console.log('— escondido: sem ?carroPorDentro a porta da garagem continua "Sair de carro"');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, 'bebito&cena=frente-da-casa');
  const r = await rotulos(page);
  confere(r.includes('Sair de carro') && !r.includes('Entrar no Bebito Mobile'), 'a porta do motorista é a de sempre (Sair de carro)');
  await page.context().close();
}

// ===================================================================== entrar
let ficou = null;
if (roda('entrar') || roda('descer')) {
  console.log('— entrar no carro pela garagem (e descer)');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  await comOCarro(page);
  await abrir(page, 'bebito&carroPorDentro&cena=frente-da-casa');
  const r = await rotulos(page);
  confere(r.includes('Entrar no Bebito Mobile') && !r.includes('Sair de carro'), 'a porta do motorista vira "Entrar no Bebito Mobile"');
  await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 2; });
  const antes = await estado(page);
  await disparar(page, 'frente:sair-de-carro');
  // a câmera vai até a porta e a porta abre
  await page.waitForFunction(() => window.jogo.scene.getObjectByName('bebito-mobile').userData.carro.portaAberta > 0.5, null, { timeout: 120000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}-1-porta-abrindo.png` });
  const p1 = await estado(page);
  confere(p1.porta > 0.5, `a porta abre de verdade (${p1.porta.toFixed(2)})`);
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
  confere(menu.botoes.join('|') === 'Viajar pro Villa Lobos|Descansar no carro|Descer do carro', `o menu "O que a gente faz?" (${menu.botoes.join(', ')})`);
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
    await page.waitForTimeout(1500);
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
        musica: j.audio?.clima ?? null,
        tetoFechado: carro.group.getObjectByName('teto').visible,
        cabecaSumiu: j.player.rig.head.visible === false,
      };
    });
    console.log(`   deitados: ${JSON.stringify(dd)}`);
    confere(dd.camaFeita > 0.99 && dd.deitados && dd.montados && dd.ancora === 'cama', 'os encostos deitaram e os dois estão deitados na cama do carro');
    confere(dd.olhaPraCima > 0.6, `a câmera olha o teto (inclinação ${dd.olhaPraCima.toFixed(2)})`);
    confere(dd.tetoFechado, 'o teto continua fechado (a garagem é coberta: sem céu)');
    confere(dd.cabecaSumiu, 'a cabeça de quem olha continua escondida');
    await page.screenshot({ path: `${OUT}-7-deitados-olhando-o-teto.png` });
    // a conversa curta, e o menu
    let menu2 = [];
    for (let i = 0; i < 40 && !menu2.length; i++) {
      menu2 = (await estado(page)).botoes;
      if (!menu2.length) await aperta(page, 1);
    }
    confere(menu2.join('|') === 'Cochilar um pouquinho|Sair do carro', `depois da conversa, o menu (${menu2.join(', ')})`);
    await page.evaluate(() => { window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.giro = -1.2; window.aristoryBebitoMobile.depuracaoDoCarroPorDentro.atual.camera.altura = 0.5; });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}-8-deitados-olhando-o-outro.png` });
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

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
console.log(falhas.length ? `${falhas.length} FALHA(S)` : 'tudo certo');
await browser.close();
process.exit(erros.length || falhas.length ? 1 : 0);
