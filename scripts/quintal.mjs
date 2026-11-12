/**
 * O QUINTAL DECORADO, etapa 1 (`docs/QUINTAL.md`): o computador do quarto com a
 * área de trabalho e o Papita Delivery, a encomenda chegando no portão, as
 * ferramentas da garagem, e pôr no chão do quintal pelo modo de verdade.
 *
 * Tudo só com a chave do Bebito Mobile (`?bebito`, num save à parte).
 *
 * - ESCONDIDO: sem `?bebito`, o computador é o de sempre (a pergunta da pasta);
 * - COMPUTADOR: a área de trabalho (os ícones), o Papita (as duas prateleiras,
 *   o retrato de cada peça, pedir paga da carteira e põe no correio, sem
 *   dinheiro o botão apaga, a aba "Para casa" em breve), voltar, e a pasta do
 *   laboratório levando ao laboratório;
 * - ENCOMENDA: a caixa no portão, abrir põe tudo no baú, e ela some;
 * - COLOCAR: as ferramentas da garagem abrem o baú; colocar pelo modo de
 *   verdade; as regras (o caminho, o portão, fora do quintal, o alto perto do
 *   muro); o fundo da garagem pode; a pegada e a altura de cada peça; o peso
 *   do quintal cheio, antes e depois; fotos;
 * - ARRUMAR: o "Arrumar o quintal" liga o modo de edição; recarregar e tudo
 *   no lugar; a estufa não monta o que é do quintal;
 * - SAVE: enfeite sem `cena` é da estufa, e o `aCaminho` sobrevive.
 *
 * Uso: node scripts/quintal.mjs /caminho/prefixo
 *      SO=escondido|computador|encomenda|colocar|arrumar|save roda uma parte
 *      (computador, encomenda, colocar e arrumar dependem uma da outra, em fila)
 *      CEL=1 roda no celular em pé
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './quintal';
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
const ctx = await browser.newContext(process.env.CEL
  ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
  : { viewport: { width: 1200, height: 860 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') erros.push('CONSOLE: ' + m.text()); });
const abrir = async (query) => {
  await page.goto(`${BASE}/?${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
  await page.waitForTimeout(1500);
};
const disparar = (id) => page.evaluate((id) => {
  void window.jogo.current.world.interactables.find((i) => i.id === id).trigger(window.jogo);
}, id);
const deco = () => page.evaluate(() => window.jogo.decoracoes().map((d) => ({ ...d })));
const decorador = 'window.jogo.current.world.root.userData.decorador';
const peso = () => page.evaluate(async () => {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const i = window.jogo.renderer.info.render;
  return { calls: i.calls, tris: i.triangles };
});

// ================================================================== escondido
if (roda('escondido')) {
  console.log('— escondido: sem ?bebito o computador é o de sempre');
  await abrir('cena=quarto');
  await page.evaluate(() => window.jogo.setFlag('lab:pasta-vista'));
  await disparar('quarto:mesa');
  await page.waitForTimeout(2500);
  const pergunta = await page.evaluate(() => document.querySelector('.dialogue')?.textContent ?? document.body.innerText);
  confere(/Abrir a pasta/.test(pergunta) && await page.locator('.painel-do-quintal.show').count() === 0,
    'sem a chave, "Usar o computador" pergunta da pasta (sem área de trabalho)');
  await page.keyboard.press('Escape');
}

// ================================================================== computador
const PEDIDOS = [
  'quintal-hortensia-azul', 'quintal-hortensia-rosa', 'quintal-hortensia-lilas', 'quintal-lavanda', 'quintal-margaridas',
  'quintal-capim', 'quintal-agave', 'quintal-costela-de-adao', 'quintal-buxinho', 'quintal-espada-de-sao-jorge',
  'quintal-mesinha', 'quintal-guarda-sol', 'quintal-espreguicadeira', 'quintal-banco',
];
if (roda('computador')) {
  console.log('— o computador: a área de trabalho e o Papita Delivery');
  await abrir('bebito&cena=quarto');
  await page.evaluate(() => { localStorage.removeItem('aristory.save.v1.bebito'); });
  await abrir('bebito&cena=quarto');
  await page.evaluate(() => { window.jogo.setFlag('lab:pasta-vista'); window.jogo.ganhar(1500); });
  await disparar('quarto:mesa');
  await page.waitForSelector('.painel-do-quintal.show', { timeout: 8000 });
  const icones = await page.locator('.painel-do-quintal .icone .nome').allTextContents();
  confere(icones.includes('AriStory_teste') && icones.includes('Papita Delivery'), `a área de trabalho tem a pasta do laboratório e o Papita (${icones.join(', ')})`);
  await page.screenshot({ path: `${OUT}-area-de-trabalho.png` });
  await page.locator('.painel-do-quintal [data-acao="papita"]').click();
  await page.waitForTimeout(400);
  const plantas = await page.locator('.painel-do-quintal .produto').count();
  const fotos = await page.locator('.painel-do-quintal .produto .foto img').count();
  confere(plantas === 10 && fotos === plantas, `a prateleira de plantas: ${plantas} peças, ${fotos} com retrato`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}-papita-plantas.png` });
  await page.locator('.painel-do-quintal [data-acao="aba"][data-id="moveis"]').click();
  await page.waitForTimeout(600);
  confere(await page.locator('.painel-do-quintal .produto').count() === 4, 'a de móveis: 4 peças');
  await page.screenshot({ path: `${OUT}-papita-moveis.png` });
  await page.locator('.painel-do-quintal [data-acao="aba"][data-id="casa"]').click();
  await page.waitForTimeout(300);
  confere(/Em breve/.test(await page.locator('.painel-do-quintal .prateleira').textContent()), 'a aba "Para casa" diz "em breve"');
  // pedir tudo, pagando da carteira
  const saldo0 = await page.evaluate(() => window.jogo.carteira());
  let gasto = 0;
  for (const id of PEDIDOS) {
    const aba = id === 'quintal-mesinha' || id === 'quintal-guarda-sol' || id === 'quintal-espreguicadeira' || id === 'quintal-banco' ? 'moveis' : 'plantas';
    await page.locator(`.painel-do-quintal [data-acao="aba"][data-id="${aba}"]`).click();
    const botao = page.locator(`.painel-do-quintal [data-acao="pedir"][data-id="${id}"]`);
    const preco = Number((await botao.textContent()).replace(/\D/g, ''));
    await botao.click();
    gasto += preco;
    await page.waitForTimeout(120);
  }
  const saldo1 = await page.evaluate(() => window.jogo.carteira());
  confere(saldo0 - saldo1 === gasto, `pedir paga da carteira (R$ ${saldo0} → R$ ${saldo1}, ${gasto} em ${PEDIDOS.length} peças)`);
  const s = await deco();
  confere(s.length === PEDIDOS.length && s.every((d) => d.aCaminho && !d.posta), 'e cada pedido vai para o correio (a caminho, sem lugar)');
  await page.locator('.painel-do-quintal [data-acao="aba"][data-id="plantas"]').click();
  await page.waitForTimeout(200);
  const conta = await page.locator('.painel-do-quintal .produto[data-id="quintal-lavanda"] .conta').textContent();
  confere(/a caminho/.test(conta ?? ''), `o cartão conta o que está a caminho ("${conta}")`);
  // sem dinheiro: o botão apaga
  // (o dinheiro sai por fora; o próximo "pedir" volta com o saldo de verdade e não compra)
  await page.evaluate(() => window.jogo.gastar(window.jogo.carteira() - 5));
  const antesDoSemDinheiro = (await deco()).length;
  await page.locator('.painel-do-quintal [data-acao="pedir"][data-id="quintal-margaridas"]').click();
  await page.waitForTimeout(200);
  confere((await deco()).length === antesDoSemDinheiro, 'sem dinheiro, pedir não compra');
  const apagados = await page.locator('.painel-do-quintal .produto .pedir:disabled').count();
  confere(apagados === 10, `sem dinheiro, "faltam R$…" em todos (${apagados})`);
  await page.evaluate(() => window.jogo.ganhar(500));
  await page.screenshot({ path: `${OUT}-papita-pedidos.png` });
  // voltar e abrir a pasta do laboratório
  await page.locator('.painel-do-quintal [data-acao="voltar"]').click();
  await page.waitForTimeout(300);
  confere(await page.locator('.painel-do-quintal .area-de-trabalho').count() === 1, 'a seta volta para a área de trabalho');
  await page.locator('.painel-do-quintal [data-acao="laboratorio"]').click();
  const foi = await page.waitForFunction(() => window.jogo.idDaCena === 'laboratorio', null, { timeout: 40000 }).then(() => true, () => false);
  confere(foi && await page.locator('.painel-do-quintal.show').count() === 0, 'a pasta AriStory_teste leva ao laboratório (pelo caminho de sempre)');
}

// =================================================================== encomenda
if (roda('encomenda')) {
  console.log('— a encomenda no portão');
  await abrir('bebito&cena=frente-da-casa');
  const tem = await page.evaluate(() => window.jogo.current.world.interactables.some((i) => i.id === 'frente:encomenda' && i.enabled));
  confere(tem, 'com pedido a caminho, a caixa do Papita espera no portão');
  await page.evaluate(() => { window.jogo.debugPlace(1.9, 0.4, Math.PI / 2); window.jogo.setZoom(4.5); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-encomenda.png` });
  await disparar('frente:encomenda');
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(450);
    await page.keyboard.press('KeyE');
  }
  await page.waitForTimeout(600);
  const s = await deco();
  confere(s.length > 0 && s.every((d) => !d.aCaminho && !d.posta), `abrir põe tudo no baú (${s.length} peças)`);
  const sumiu = await page.evaluate(() => !window.jogo.scene.getObjectByProperty('name', 'x') && !window.jogo.current.world.interactables.some((i) => i.id === 'frente:encomenda' && i.enabled));
  confere(sumiu, 'e a caixa sai');
  await page.evaluate(() => window.jogo.setZoom(13));
}

// ===================================================================== colocar
if (roda('colocar')) {
  console.log('— as ferramentas da garagem e o chão do quintal');
  await abrir('bebito&cena=frente-da-casa');
  const vazio = await peso();
  await page.evaluate(() => { window.jogo.debugPlace(-3.95, -4.0, Math.PI); window.jogo.setZoom(5.5); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-ferramentas.png` });
  await disparar('frente:ferramentas');
  await page.waitForSelector('.painel-do-quintal.show', { timeout: 6000 });
  await page.waitForTimeout(500);
  const noBau = await page.locator('.painel-do-quintal .produto').count();
  confere(noBau === PEDIDOS.length, `o baú mostra o que chegou (${noBau})`);
  await page.screenshot({ path: `${OUT}-bau.png` });
  await page.locator('.painel-do-quintal [data-acao="colocar"][data-id="quintal-hortensia-azul"]').click();
  await page.waitForTimeout(400);
  confere(await page.evaluate(`${decorador}.decorando`), '"Colocar" fecha o baú e entra no modo de colocar');
  /** põe a peça na mão no ponto (x, z) com quem joga olhando para `f`; devolve o motivo (ou null) e se ficou */
  const por = (id, x, z, f = 0) => page.evaluate(async ([id, x, z, f, chave]) => {
    const d = eval(chave);
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    if (!d.decorando) d.colocar(id);
    const ficha = [...d.postos?.values?.() ?? []];
    void ficha;
    const raio = d.modo?.ficha.raio ?? 0.4;
    window.jogo.debugPlace(x - Math.sin(f) * (0.85 + raio), z - Math.cos(f) * (0.85 + raio), f);
    await espera(450);
    const motivo = document.querySelector('.posicionador .nao-pode')?.textContent?.trim() ?? null;
    const onde = d.modo ? [+d.modo.x.toFixed(2), +d.modo.z.toFixed(2)] : null;
    const antes = d.postas(id);
    document.querySelector('.posicionador button.colocar')?.click();
    await espera(250);
    if (d.decorando) {
      document.querySelector('.posicionador [data-botao="cancelar"]')?.click();
      await espera(150);
    }
    return { id, motivo, onde, ficou: d.postas(id) === antes + 1 };
  }, [id, x, z, f, decorador]);
  // as regras: não pode
  const recusas = [
    ['quintal-hortensia-azul', 2.0, 0.0, 'caminho'],
    ['quintal-hortensia-azul', 3.4, 2.0, 'portão'],
    ['quintal-lavanda', -1.0, 2.4, 'encostado'],
    ['quintal-hortensia-azul', 0.0, 1.0, 'caminho'],
    ['quintal-guarda-sol', 5.0, 1.6, 'alto'],
    ['quintal-hortensia-azul', 2.0, 4.6, 'fora'],
    ['quintal-hortensia-azul', -5.6, -1.2, 'fora'],
  ];
  for (const [id, x, z, re] of recusas) {
    const r = await por(id, x, z);
    confere(!r.ficou && new RegExp(re).test(r.motivo ?? ''), `${id} em (${x}, ${z}) não fica: "${r.motivo}"`);
  }
  // o quintal cheio: cada peça no seu lugar
  // (quem joga fica do lado de +Z, olhando para o fundo: na frente da casa não há onde ficar)
  const LUGARES = [
    ['quintal-hortensia-azul', -2.15, -4.3], ['quintal-hortensia-rosa', -1.1, -4.3], ['quintal-hortensia-lilas', -0.05, -4.3],
    ['quintal-espreguicadeira', -1.6, -2.3], ['quintal-lavanda', 0.3, -2.7], ['quintal-margaridas', 0.35, -1.6],
    ['quintal-capim', -0.6, -0.6], ['quintal-agave', 4.6, 1.6], ['quintal-costela-de-adao', 5.75, 0.8],
    ['quintal-espada-de-sao-jorge', 3.2, -0.2], ['quintal-mesinha', 4.6, -0.6], ['quintal-guarda-sol', 3.55, -2.4],
    ['quintal-banco', 4.4, -3.85, Math.PI / 2],
    // o fundo da garagem, atrás de onde o carro para
    ['quintal-buxinho', -7.6, -4.4],
  ];
  const resultados = [];
  // (perto do muro da frente, quem joga fica do lado da casa: do outro lado é o muro)
  for (const [id, x, z, f] of LUGARES) resultados.push(await por(id, x, z, f ?? (z > 0.5 ? 0 : Math.PI)));
  const falhou = resultados.filter((r) => !r.ficou);
  confere(falhou.length === 0, `as peças do quintal cheio ficaram (${resultados.length - falhou.length} de ${resultados.length})${falhou.length ? ' — ' + JSON.stringify(falhou) : ''}`);
  const garagem = await page.evaluate((chave) => [...eval(chave).postos.values()].find((p) => p.ficha.id === 'quintal-buxinho')?.peca.position.x ?? 0, decorador);
  confere(garagem < -7, `o fundo da garagem pode (o buxinho em x = ${garagem.toFixed(2)})`);
  const s = await deco();
  confere(s.filter((d) => d.posta).every((d) => d.posta.cena === 'quintal'), 'o save guarda cada peça com a cena "quintal"');
  // a pegada e a altura de cada peça, medidas no mundo
  const medidas = await page.evaluate((chave) => {
    const d = eval(chave);
    return [...d.postos.values()].map((p) => {
      let longe = 0;
      let alto = 0;
      const v = new p.peca.position.constructor();
      p.peca.updateMatrixWorld(true);
      p.peca.traverse((o) => {
        if (!o.isMesh || !o.geometry?.attributes?.position) return;
        if (o.renderOrder >= 3) return; // o canteirinho (decalque) não conta
        const pos = o.geometry.attributes.position;
        // (o lote instanciado: cada cópia pela matriz dela)
        const copias = o.isInstancedMesh ? o.count : 1;
        const m = new o.matrixWorld.constructor();
        for (let c = 0; c < copias; c++) {
          if (o.isInstancedMesh) {
            o.getMatrixAt(c, m);
            m.premultiply(o.matrixWorld);
          } else m.copy(o.matrixWorld);
          for (let i = 0; i < pos.count; i += 3) {
            v.fromBufferAttribute(pos, i).applyMatrix4(m);
            longe = Math.max(longe, Math.hypot(v.x - p.peca.position.x, v.z - p.peca.position.z));
            alto = Math.max(alto, v.y);
          }
        }
      });
      return { id: p.ficha.id, raio: p.ficha.raio, longe: +longe.toFixed(2), alto: +alto.toFixed(2) };
    });
  }, decorador);
  for (const m of medidas) {
    const passa = m.id !== 'quintal-guarda-sol' && m.longe > m.raio * 1.35 + 0.08;
    confere(!passa, `${m.id}: pegada ${m.raio}, vai até ${m.longe} m, ${m.alto} m de alto`);
  }
  await page.evaluate(() => { window.jogo.debugPlace(2.0, 1.6, Math.PI / 4); window.jogo.setZoom(13); });
  await page.waitForTimeout(1200);
  const cheio = await peso();
  console.log(`       peso da vista: vazio ${vazio.calls} desenhos / ${vazio.tris} triângulos → cheio ${cheio.calls} / ${cheio.tris}`);
  await page.screenshot({ path: `${OUT}-quintal-cheio.png` });
  await page.evaluate(() => { window.jogo.debugPlace(4.4, -0.2, Math.PI * 0.8); window.jogo.setZoom(5.5); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-perto-mesinha.png` });
  await page.evaluate(() => { window.jogo.debugPlace(-0.4, -0.4, Math.PI * 0.8); window.jogo.setZoom(5.5); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-perto-plantas.png` });
  await page.evaluate(() => { window.jogo.debugPlace(-0.4, 0.6, -Math.PI * 0.25); window.jogo.setZoom(5); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-perto-canteiro.png` });
  await page.evaluate(() => { window.jogo.debugPlace(-6.4, -3.2, Math.PI); window.jogo.setZoom(5.5); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-garagem.png` });
}

// ====================================================== fundir: a mesma imagem
// (no computador: no celular o joystick e as dicas mudam entre uma carga e outra)
if (roda('colocar') && !process.env.CEL) {
  console.log('— a mesma imagem com e sem a junção das peças (?semFundir)');
  const foto = async (query) => {
    await abrir(query);
    await page.evaluate(() => { window.jogo.debugPlace(-3.95, -3.6, Math.PI); window.jogo.setZoom(13); });
    await page.waitForTimeout(1500);
    return page.screenshot({ type: 'png' });
  };
  const sem = await foto('bebito&cena=frente-da-casa&semFundir');
  const pesoSem = await peso();
  const com = await foto('bebito&cena=frente-da-casa');
  const pesoCom = await peso();
  const diferentes = await page.evaluate(async ([a, b]) => {
    const ler = async (b64) => {
      const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const c = new OffscreenCanvas(img.width, img.height).getContext('2d');
      c.drawImage(img, 0, 0);
      return c.getImageData(0, 0, img.width, img.height).data;
    };
    const [x, y] = await Promise.all([ler(a), ler(b)]);
    let n = 0;
    for (let i = 0; i < x.length; i += 4) {
      if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 24) n++;
    }
    return n;
  }, [sem.toString('base64'), com.toString('base64')]);
  console.log(`       sem juntar ${pesoSem.calls} desenhos / ${pesoSem.tris} → juntado ${pesoCom.calls} / ${pesoCom.tris}; ${diferentes} pixels diferentes`);
  confere(diferentes < 400, `juntar as peças não muda a imagem (${diferentes} pixels diferentes)`);
}

// ===================================================================== arrumar
if (roda('arrumar')) {
  console.log('— arrumar o quintal, recarregar, e a estufa');
  await abrir('bebito&cena=frente-da-casa');
  const postas = (await deco()).filter((d) => d.posta?.cena === 'quintal').length;
  const montadas = await page.evaluate(`${decorador}.noChao`);
  confere(postas > 0 && montadas === postas, `recarregando, as ${postas} peças do quintal voltam ao lugar (${montadas})`);
  await page.evaluate(() => window.jogo.debugPlace(-3.95, -4.0, Math.PI));
  await disparar('frente:ferramentas');
  await page.waitForSelector('.painel-do-quintal.show', { timeout: 6000 });
  await page.locator('.painel-do-quintal [data-acao="editar"]').click();
  await page.waitForTimeout(500);
  const ligados = await page.evaluate(() => window.jogo.current.world.interactables.filter((i) => i.id.startsWith('decoracao:') && i.enabled).length);
  confere(ligados === postas, `"Arrumar o quintal" acorda o "Mexer no…" de cada peça (${ligados})`);
  await page.screenshot({ path: `${OUT}-arrumando.png` });
  // guardar uma pelo modo de edição (a pergunta e "Guardar")
  const uid = await page.evaluate((chave) => [...eval(chave).postos.keys()][0], decorador);
  await page.evaluate(([uid, chave]) => eval(chave).guardar(uid), [uid, decorador]);
  await page.waitForTimeout(300);
  confere((await deco()).find((d) => d.uid === uid)?.posta === null, 'guardar devolve a peça ao baú');
  await page.keyboard.press('KeyX');
  await page.waitForTimeout(300);
  confere(!(await page.evaluate(`${decorador}.editando`)), 'o X sai do modo de edição');
  await abrir('bebito&cena=estufa');
  const naEstufa = await page.evaluate(() => window.jogo.current.world.root.userData.decorador?.noChao ?? -1);
  confere(naEstufa === 0, `a estufa não monta o que é do quintal (${naEstufa})`);
}

// ======================================================================== save
if (roda('save')) {
  console.log('— o save');
  await abrir('bebito&cena=quarto');
  const r = await page.evaluate(() => {
    const antes = window.jogo.decoracoes();
    window.jogo.salvarDecoracoes([
      { uid: 901, id: 'flamingo', posta: { x: 1, z: 2, giro: 0 } },
      { uid: 902, id: 'quintal-lavanda', posta: null, aCaminho: true },
      { uid: 903, id: 'quintal-agave', posta: { x: 1, z: 2, giro: 0, cena: 'quintal' }, aCaminho: true },
    ]);
    const depois = window.jogo.decoracoes().map((d) => ({ ...d }));
    window.jogo.salvarDecoracoes(antes);
    return depois;
  });
  confere(r[0].posta?.cena === 'estufa', 'enfeite sem "cena" (save antigo) é da estufa');
  confere(r[1].aCaminho === true && r[1].posta === null, 'o "a caminho" sobrevive à leitura');
  confere(r[2].posta?.cena === 'quintal' && !r[2].aCaminho, 'peça no chão não fica "a caminho"');
}

await browser.close();
if (erros.length) console.log('erros de console:\n  ' + erros.join('\n  '));
console.log(falhas.length || erros.length ? `\n${falhas.length} falha(s), ${erros.length} erro(s)` : '\ntudo certo');
process.exit(falhas.length || erros.length ? 1 : 0);
