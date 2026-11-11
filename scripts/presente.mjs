/**
 * A QUEST DO PRESENTE — o Renan entrega o Bebito Mobile (`docs/BEBITO-MOBILE.md`,
 * `src/eventos/bebitoMobile/presente.ts`) — e a frente da casa do Ari.
 *
 * Tudo isso só existe com a chave do carro (`eventos/BebitoMobile.ts`); o
 * teste liga pelo endereço, com `?bebito`, num save à parte.
 *
 * - ESCONDIDO: sem `?bebito`, a porta da casa sai direto no parque e a cama
 *   do quarto é a de sempre, mesmo com a lição 10 concluída;
 * - O JARDIM: com `?bebito` e sem a quest, a porta sai no jardim, a garagem
 *   está vazia, e as duas entradas nascem fora de colisor (fotos);
 * - A QUEST: com a lição 10 concluída, deitar na cama vira dormir; o Renan
 *   pergunta da surpresa; na sala ele diz que já volta e sai; o Ari vai
 *   atrás; do lado de fora ele não está; a buzina; o carro vem pela rua, entra
 *   de ré na garagem com o Renan dirigindo e o laço no teto; os dois se
 *   encontram, a memória entra no diário e a fase vira "ganhou" (fotos de
 *   cada passo);
 * - DEPOIS: recarregando, o carro mora na garagem (sem o laço), com o
 *   "Olhar o Bebito Mobile", e o save de verdade não ganhou flag nenhuma.
 *
 * Uso: node scripts/presente.mjs /caminho/prefixo
 *      SO=escondido|jardim|quest roda uma parte
 *      CEL=1 roda no celular em pé (para olhar o enquadramento das tomadas)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './presente';
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

/** uma página nova, com o save zerado (cada contexto tem o seu) */
const pagina = async () => {
  const ctx = await browser.newContext(process.env.CEL
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
    : { viewport: { width: 1200, height: 860 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  return page;
};
const abrir = async (page, query) => {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await page.waitForTimeout(1500);
};
const cena = (page) => page.evaluate(() => window.jogo.idDaCena);
const rotulos = (page) => page.evaluate(() => window.jogo.current.world.interactables.map((i) => i.label));
const LICAO = 'partiu-praia';
const comLicao = (page) => page.evaluate((id) => { window.jogo.save.concluirLicao(id, 3); }, LICAO);
/** aperta E (avança fala, confirma a primeira opção) até `pronto()` dar verdade, com teto */
const jogarAte = async (page, pronto, teto = 120000, aCada = 350) => {
  const t0 = Date.now();
  while (Date.now() - t0 < teto) {
    if (await page.evaluate(pronto)) return true;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(aCada);
  }
  return false;
};

// ================================================================== escondido
if (roda('escondido')) {
  console.log('— escondido: sem ?bebito o jogo é o de sempre');
  const page = await pagina();
  await abrir(page, 'cena=casa');
  const r = await rotulos(page);
  confere(r.includes('Sair — ir pro parque') && !r.includes('Sair pro jardim'), 'a porta da casa sai direto no parque');
  await comLicao(page);
  await abrir(page, 'cena=quarto');
  await page.evaluate(() => { void window.jogo.current.world.interactables.find((i) => i.id === 'quarto:cama').trigger(window.jogo); });
  await page.waitForTimeout(600);
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
  }
  const depois = await page.evaluate(() => ({
    flags: Object.keys(JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').flags ?? {}).filter((f) => f.startsWith('bebito')),
    cena: window.jogo.idDaCena,
  }));
  confere(depois.flags.length === 0 && depois.cena === 'quarto', 'com a lição 10 concluída, a cama continua a de sempre (nenhuma flag do carro no save)');
  await abrir(page, 'cena=villa-lobos');
  const volta = await page.evaluate(() => window.jogo.current.world.interactables.find((i) => i.label === 'Voltar pra casa')?.id ?? '');
  confere(volta === 'door:casa:da-rua', `o parque volta direto para a casa (${volta})`);
  await page.context().close();
}

// ===================================================================== o jardim
if (roda('jardim')) {
  console.log('— o jardim e a garagem (com ?bebito, antes da quest)');
  const page = await pagina();
  await abrir(page, 'bebito&cena=casa');
  confere((await rotulos(page)).includes('Sair pro jardim'), 'com a chave, a porta da casa sai no jardim');
  await abrir(page, 'bebito&cena=frente-da-casa');
  const j = await page.evaluate(() => {
    const jogo = window.jogo;
    const livre = (x, z) => !jogo.current.world.colliders.some((c) => {
      if (c.type === 'circle' || c.kind === 'circle' || c.r !== undefined) return Math.hypot(x - c.x, z - c.z) < (c.r ?? c.radius) + 0.42;
      return false;
    });
    const p = jogo.player.position;
    return {
      carro: !!jogo.scene.getObjectByName('bebito-mobile'),
      rotulos: jogo.current.world.interactables.map((i) => i.label),
      onde: [+p.x.toFixed(2), +p.z.toFixed(2)],
      livre: livre(p.x, p.z),
      casa: !!jogo.scene.children.find(() => true),
    };
  });
  confere(!j.carro, 'antes do presente a garagem está vazia');
  confere(j.rotulos.includes('Entrar em casa') && j.rotulos.includes('Ir pro parque'), `as duas passagens existem (${j.rotulos.join(', ')})`);
  await page.evaluate(() => window.jogo.setZoom(15));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-jardim.png` });
  await page.keyboard.press('KeyQ');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-jardim-girado.png` });
  await page.keyboard.press('KeyR');
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}-jardim-girado-2.png` });
  await page.keyboard.press('KeyQ');
  await page.waitForTimeout(1200);
  const tomada = async (nome, de, para) => {
    await page.evaluate(([d, p]) => { const V = window.jogo.scene.position.constructor; window.jogo.setCameraOmbro(new V(...d), new V(...p)); }, [de, para]);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}-${nome}.png` });
  };
  await tomada('fachada', [4.5, 3.4, 8.5], [1.5, 1.6, -5]);
  await tomada('garagem', [-1.5, 3.6, 9.5], [-5.6, 1.2, -1.5]);
  await tomada('da-rua', [10, 2.6, 12], [0, 1.4, -2]);
  await tomada('de-cima', [0.01, 26, 3], [0, 0, 0]);
  await page.evaluate(() => window.jogo.setCameraOmbro(null));
  // andar da porta ao portão: o caminho está livre (o `z` cresce, o `x` quase não muda)
  await abrir(page, `bebito&cena=frente-da-casa&em=2,-3.4&olhar=0`);
  const antes = await page.evaluate(() => ({ x: window.jogo.player.position.x, z: window.jogo.player.position.z }));
  // (na câmera de sempre, S + A anda para o +Z)
  await page.keyboard.down('KeyS');
  await page.keyboard.down('KeyA');
  await page.waitForFunction(() => window.jogo.player.position.z > 3.6, null, { timeout: 60000 }).catch(() => {});
  await page.keyboard.up('KeyS');
  await page.keyboard.up('KeyA');
  const fim = await page.evaluate(() => ({ x: window.jogo.player.position.x, z: window.jogo.player.position.z }));
  confere(fim.z > 3.6 && Math.abs(fim.x - antes.x) < 0.5, `da porta ao portão, andando reto, sem esbarrar (z ${antes.z.toFixed(1)} → ${fim.z.toFixed(1)}, x ${antes.x.toFixed(2)} → ${fim.x.toFixed(2)})`);
  // chegando do parque
  await abrir(page, 'bebito&cena=villa-lobos');
  const volta = await page.evaluate(() => window.jogo.current.world.interactables.find((i) => i.label === 'Voltar pra casa')?.id ?? '');
  confere(volta === 'door:frente-da-casa:da-rua', `o parque volta pela calçada da frente da casa (${volta})`);
  await page.context().close();
}

// ====================================================================== a quest
if (roda('quest')) {
  console.log('— a quest do presente');
  const page = await pagina();
  await abrir(page, 'bebito&cena=quarto');
  // sem a lição 10, a cama é a de sempre
  const antes = await page.evaluate(() => window.jogo.flag('bebito:surpresa'));
  await comLicao(page);
  await abrir(page, 'bebito&cena=quarto');
  await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 2.5; });
  confere(!antes, 'a quest não começou antes da hora');

  // 1. o quarto: deitar vira dormir, e o Renan pergunta da surpresa
  await page.evaluate(() => { void window.jogo.current.world.interactables.find((i) => i.id === 'quarto:cama').trigger(window.jogo); });
  await page.waitForTimeout(700);
  await page.keyboard.press('KeyE'); // "Deitar"
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}-1-deitados.png` });
  let pergunta = false;
  const chegou = await jogarAte(page, () => window.jogo.idDaCena === 'casa' && !!window.jogo.current, 90000, 500);
  pergunta = await page.evaluate(() => window.jogo.flag('bebito:surpresa'));
  confere(chegou && pergunta, 'dormiram, o Renan perguntou da surpresa, e os dois foram para a sala');
  const quem = await page.evaluate(() => window.jogo.playerId());
  confere(quem === 'ari', `na quest quem se controla é o Ari (${quem})`);

  // 2. a sala: ele diz que já volta e sai pela porta
  await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 2.5; });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}-2-na-sala.png` });
  const saiu = await jogarAte(page, () => window.jogo.flag('bebito:renan-saiu'), 120000, 450);
  await page.waitForTimeout(500);
  const sumiu = await page.evaluate(() => window.jogo.parceiro.object.visible === false);
  await page.screenshot({ path: `${OUT}-3-ele-saiu.png` });
  confere(saiu && sumiu, 'o Renan disse que já volta, andou até a porta e saiu (o Ari ficou sozinho na sala)');

  // 3. a frente da casa: ele não está; a buzina; o carro chega e entra de ré
  const fora = await jogarAte(page, () => window.jogo.idDaCena === 'frente-da-casa' && !!window.jogo.scene.getObjectByName('bebito-mobile'), 90000, 450);
  confere(fora, 'o Ari foi atrás, para a frente da casa');
  await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 2; });
  const carro = () => page.evaluate(() => {
    const c = window.jogo.scene.getObjectByName('bebito-mobile');
    return c ? { x: c.position.x, z: c.position.z, giro: c.rotation.y } : null;
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-4-cade-ele.png` });
  const longe = await carro();
  confere(longe.x > 20, `o carro espera fora de vista, lá na rua (x = ${longe.x.toFixed(1)})`);
  const buzinas0 = await page.evaluate(() => window.jogo.audio?.contagem?.get('buzinaDoBebito') ?? 0);
  // na rua
  await jogarAte(page, () => { const c = window.jogo.scene.getObjectByName('bebito-mobile'); return c.position.x < 12; }, 120000, 400);
  await page.screenshot({ path: `${OUT}-5-na-rua.png` });
  const naRua = await page.evaluate(() => {
    const j = window.jogo;
    const c = j.scene.getObjectByName('bebito-mobile');
    let dentro = false;
    for (let p = j.parceiro.object; p; p = p.parent) if (p === c) dentro = true;
    return { dentro, laco: !!c.getObjectByName('detalhe:laco-de-presente'), z: c.position.z, giro: c.rotation.y };
  });
  confere(naRua.dentro, 'o Renan vem DENTRO do carro, no lugar do motorista');
  confere(naRua.laco, 'o carro chega de laço no teto');
  // de ré, no meio da curva
  await jogarAte(page, () => { const c = window.jogo.scene.getObjectByName('bebito-mobile'); return c.rotation.y > -1.0 && c.position.x > -8.5; }, 120000, 300);
  await page.screenshot({ path: `${OUT}-6-de-re.png` });
  // estacionado, a conversa
  await jogarAte(page, () => { const c = window.jogo.scene.getObjectByName('bebito-mobile'); return Math.abs(c.position.z + 1.2) < 0.02; }, 120000, 300);
  await page.screenshot({ path: `${OUT}-7-estacionou.png` });
  await page.waitForFunction(() => window.jogo.emDialogo(), null, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-7-surpresa.png` });
  const ganhou = await jogarAte(page, () => window.jogo.flag('bebito:ganhou') && !window.jogo.emDialogo(), 120000, 450);
  await page.waitForFunction(() => !window.jogo.cameraDeCena(), null, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(800);
  const fim = await page.evaluate(() => {
    const j = window.jogo;
    const c = j.scene.getObjectByName('bebito-mobile');
    const save = JSON.parse(localStorage.getItem('aristory.save.v1.bebito') ?? '{}');
    const real = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
    return {
      x: c.position.x, z: c.position.z, giro: c.rotation.y,
      parceiroVisivel: j.parceiro.object.visible, parceiroSolto: !j.parceiro.riding, jogadorSolto: !j.player.riding,
      memoria: (save.memories ?? []).some((m) => m.id === 'bebito-mobile'),
      noReal: Object.keys(real.flags ?? {}).filter((f) => f.startsWith('bebito')).length,
      buzinas: j.audio?.contagem?.get('buzinaDoBebito') ?? 0,
      cameraDeCena: !!j.cameraDeCena(),
      rotulos: j.current.world.interactables.map((i) => i.label),
    };
  });
  await page.evaluate(() => window.jogo.setZoom(14));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-8-depois.png` });
  confere(ganhou, 'o carro foi entregue (a fase virou "ganhou")');
  confere(Math.abs(fim.x + 5.6) < 0.02 && Math.abs(fim.z + 1.2) < 0.02 && Math.abs(fim.giro) < 0.01, `o carro parou na vaga, de nariz para a rua (${fim.x.toFixed(2)}, ${fim.z.toFixed(2)})`);
  confere(fim.parceiroVisivel && fim.parceiroSolto && fim.jogadorSolto && !fim.cameraDeCena, `no fim os dois estão de pé, soltos, e a câmera de sempre voltou (${JSON.stringify([fim.parceiroVisivel, fim.parceiroSolto, fim.jogadorSolto, fim.cameraDeCena])})`);
  confere(fim.memoria, 'a memória "O Bebito Mobile" entrou no diário');
  confere(fim.noReal === 0, 'o save de verdade não ganhou flag nenhuma (a quest correu no save do ?bebito)');
  if (fim.buzinas !== null) confere(fim.buzinas - buzinas0 >= 2, `a buzina tocou na chegada e ao estacionar (${fim.buzinas - buzinas0})`);
  confere(fim.rotulos.includes('Olhar o Bebito Mobile'), 'estacionado, o carro ganha o "Olhar o Bebito Mobile"');

  // DEPOIS: recarregando, o carro mora na garagem, sem o laço, e a quest não repete
  await abrir(page, 'bebito&cena=frente-da-casa');
  const depois = await page.evaluate(() => {
    const j = window.jogo;
    const c = j.scene.getObjectByName('bebito-mobile');
    return {
      carro: !!c, x: c?.position.x, laco: !!c?.getObjectByName('detalhe:laco-de-presente'),
      travado: j.player.riding, rotulos: j.current.world.interactables.map((i) => i.label),
    };
  });
  confere(depois.carro && Math.abs(depois.x + 5.6) < 0.02 && !depois.laco, 'depois, o carro mora na garagem (e o laço saiu)');
  confere(depois.rotulos.includes('Olhar o Bebito Mobile'), 'e dá para olhar o carro');
  await page.evaluate(() => window.jogo.setZoom(14));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}-9-na-garagem.png` });
  await abrir(page, 'bebito&cena=quarto');
  await page.evaluate(() => { void window.jogo.current.world.interactables.find((i) => i.id === 'quarto:cama').trigger(window.jogo); });
  await page.waitForTimeout(600);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
  }
  confere((await cena(page)) === 'quarto', 'a cama volta a ser a de sempre: a quest não repete');
  await page.context().close();
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
console.log(falhas.length ? `${falhas.length} FALHA(S)` : 'tudo certo');
await browser.close();
process.exit(erros.length || falhas.length ? 1 : 0);
