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
 * - CHÃO (etapa 2, num save limpo): a prateleira "Chão" do Papita, o caminho
 *   que se pede uma vez, a árvore virando peça na primeira visita, trocar o
 *   caminho pelos cinco jeitos (fotos), tirar e pôr a hera, guardar a árvore
 *   e plantar em outro canto, os pisos (no caminho não; a mesinha e a
 *   hortênsia em cima; o último por cima), recarregar;
 * - SAVE: enfeite sem `cena` é da estufa, e o `aCaminho` sobrevive.
 *
 * Uso: node scripts/quintal.mjs /caminho/prefixo
 *      SO=escondido|computador|encomenda|colocar|arrumar|chao|alto|moveis|save roda uma parte
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
  const moveis = await page.locator('.painel-do-quintal .produto').count();
  confere(moveis === 7, `a de móveis: banco, mesinha, espreguiçadeira, guarda-sol, balanço, rede e casinha (${moveis})`);
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
  // (a árvore da casa entra no save já plantada, na primeira visita)
  const doCorreio = s.filter((d) => d.id !== 'quintal-arvore-florida');
  confere(doCorreio.length > 0 && doCorreio.every((d) => !d.aCaminho && !d.posta), `abrir põe tudo no baú (${doCorreio.length} peças)`);
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
    // (o guarda-sol e a árvore: a pegada é o pé, e a copa cobre o vizinho de propósito)
    const passa = !['quintal-guarda-sol', 'quintal-arvore-florida'].includes(m.id) && m.longe > m.raio * 1.35 + 0.08;
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
    // (a câmera desliza até o ponto: foto antes de ela assentar deixa TODA borda um subpixel fora)
    let antes = '';
    for (let i = 0; i < 12; i++) {
      await page.waitForTimeout(600);
      const agora = await page.evaluate(() => { const c = window.jogo.iso.camera; return [...c.position.toArray(), c.top].map((v) => v.toFixed(4)).join(','); });
      if (agora === antes) break;
      antes = agora;
    }
    return page.screenshot({ type: 'png' });
  };
  const sem = await foto('bebito&cena=frente-da-casa&semFundir');
  await page.screenshot({ path: `${OUT}-sem-fundir.png` });
  const pesoSem = await peso();
  const com = await foto('bebito&cena=frente-da-casa');
  await page.screenshot({ path: `${OUT}-com-fundir.png` });
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
  // (o que sobra é o capim, a lavanda e as margaridas balançando no vento entre
  // uma foto e a outra — e o mapa de diferença conferido em 2026-11-12 mostra só
  // elas; sem as plantas de vento, a diferença era de 17 pixels)
  confere(diferentes < 9000, `juntar as peças não muda a imagem (${diferentes} pixels diferentes, quase todos das plantas no vento)`);
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

// ======================================================= chão (a etapa 2)
if (roda('chao')) {
  console.log('— etapa 2: os pisos, os caminhos, a árvore e a hera');
  await abrir('bebito&cena=quarto');
  await page.evaluate(() => localStorage.removeItem('aristory.save.v1.bebito'));
  await abrir('bebito&cena=quarto');
  await page.evaluate(() => { window.jogo.setFlag('lab:pasta-vista'); window.jogo.ganhar(2000); });
  await disparar('quarto:mesa');
  await page.waitForSelector('.painel-do-quintal.show', { timeout: 8000 });
  await page.locator('.painel-do-quintal [data-acao="papita"]').click();
  await page.locator('.painel-do-quintal [data-acao="aba"][data-id="chao"]').click();
  await page.waitForTimeout(700);
  const noChao = await page.locator('.painel-do-quintal .produto').evaluateAll((els) => els.map((e) => e.dataset.id));
  confere(noChao.length === 10 && !noChao.includes('quintal-caminho-lajes'), `a prateleira "Chão": 6 pisos e 4 caminhos, sem o de lajes (${noChao.length})`);
  await page.screenshot({ path: `${OUT}-papita-chao.png` });
  const COMPRAS = ['quintal-deck', 'quintal-canteiro-casca', 'quintal-canteiro-terra', 'quintal-pedrisco', 'quintal-tapete', 'quintal-gramado-de-flores',
    'quintal-caminho-pedras', 'quintal-caminho-tijolinho', 'quintal-caminho-dormentes', 'quintal-caminho-portuguesa'];
  for (const id of COMPRAS) await page.locator(`.painel-do-quintal [data-acao="pedir"][data-id="${id}"]`).click();
  await page.waitForTimeout(300);
  const selos = await page.locator('.painel-do-quintal .produto .selo').count();
  confere(selos === 4, `o caminho se pede uma vez só: o cartão vira selo (${selos})`);
  const dePlantas = ['quintal-hortensia-azul', 'quintal-mesinha'];
  for (const id of dePlantas) {
    await page.locator(`.painel-do-quintal [data-acao="aba"][data-id="${id === 'quintal-mesinha' ? 'moveis' : 'plantas'}"]`).click();
    await page.locator(`.painel-do-quintal [data-acao="pedir"][data-id="${id}"]`).click();
  }
  await page.keyboard.press('Escape');
  await abrir('bebito&cena=frente-da-casa');
  // a árvore virou peça do quintal
  const arvore = await page.evaluate(() => window.jogo.decoracoes().find((d) => d.id === 'quintal-arvore-florida'));
  confere(!!arvore?.posta && Math.abs(arvore.posta.x - 5.6) < 0.01, 'na primeira visita a árvore entra no save, no lugar de sempre');
  confere(await page.evaluate(`${decorador}.noChao`) === 1, 'e o decorador a monta');
  await disparar('frente:encomenda');
  // (só enquanto a fala está na tela: um E a mais, perto da porta, entrava em casa)
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(400);
    if (!(await page.evaluate(() => document.querySelector('.dialogue.show') !== null))) break;
    await page.keyboard.press('KeyE');
  }
  await page.waitForTimeout(500);
  const pecaNoChao = (nome) => page.evaluate((nome) => {
    let achou = 0;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === nome && o.visible && o.parent) achou++; });
    return achou;
  }, nome);
  // o caminho: trocar pelas ferramentas, um de cada vez, com foto
  const bau = async () => {
    await page.evaluate(() => window.jogo.debugPlace(-3.95, -4.0, Math.PI));
    await disparar('frente:ferramentas');
    await page.waitForSelector('.painel-do-quintal.show', { timeout: 6000 });
    await page.waitForTimeout(300);
  };
  await bau();
  const caminhos = await page.locator('.painel-do-quintal .caminhos-e-hera [data-acao="caminho"]').count();
  confere(caminhos === 5, `o baú oferece os 5 caminhos (o de lajes e os 4 comprados): ${caminhos}`);
  await page.screenshot({ path: `${OUT}-bau-caminhos.png` });
  await page.locator('.painel-do-quintal [data-acao="fechar"]').click();
  await page.waitForTimeout(300);
  for (const estilo of ['pedras', 'tijolinho', 'dormentes', 'portuguesa', 'lajes']) {
    await bau();
    await page.locator(`.painel-do-quintal [data-acao="caminho"][data-id="quintal-caminho-${estilo}"]`).click();
    await page.waitForTimeout(500);
    confere(await pecaNoChao(`caminho-${estilo}`) === 1, `o caminho vira ${estilo}`);
    await page.evaluate(() => { window.jogo.debugPlace(4.0, 0.6, -Math.PI * 0.6); window.jogo.setZoom(8); });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-caminho-${estilo}.png` });
  }
  await bau();
  await page.locator('.painel-do-quintal [data-acao="caminho"][data-id="quintal-caminho-tijolinho"]').click();
  await page.waitForTimeout(300);
  // a hera: tirar e pôr de volta
  await bau();
  await page.locator('.painel-do-quintal [data-acao="hera"]').click();
  await page.waitForTimeout(400);
  const semHera = await page.evaluate(() => !window.jogo.current.world.root.children.some((o) => o.userData?.peca === 'hera-do-muro'));
  confere(semHera && await page.evaluate(() => window.jogo.flag('quintal:sem-hera')), 'tirar a hera tira dos muros (e o save lembra)');
  await page.evaluate(() => { window.jogo.debugPlace(2.0, 1.6, Math.PI / 4); window.jogo.setZoom(13); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-sem-hera.png` });
  // a árvore: guardar e pôr em outro lugar
  const uidArvore = arvore.uid;
  await page.evaluate(([uid, chave]) => eval(chave).guardar(uid), [uidArvore, decorador]);
  await page.waitForTimeout(300);
  confere(await pecaNoChao('quintal-arvore-florida') === 0, 'guardar a árvore tira ela do jardim');
  /** põe com quem joga do lado de +Z olhando para o fundo (ou de −Z perto do muro) */
  const por = (id, x, z, f) => page.evaluate(async ([id, x, z, f, chave]) => {
    const d = eval(chave);
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    if (!d.decorando) d.colocar(id);
    const raio = d.modo?.ficha.raio ?? 0.4;
    window.jogo.debugPlace(x - Math.sin(f) * (0.85 + raio), z - Math.cos(f) * (0.85 + raio), f);
    await espera(450);
    const motivo = document.querySelector('.posicionador .nao-pode')?.textContent?.trim() ?? null;
    const antes = d.postas(id);
    document.querySelector('.posicionador button.colocar')?.click();
    await espera(250);
    if (d.decorando) {
      document.querySelector('.posicionador [data-botao="cancelar"]')?.click();
      await espera(150);
    }
    return { id, motivo, ficou: d.postas(id) === antes + 1 };
  }, [id, x, z, f ?? (z > 0.5 ? 0 : Math.PI), decorador]);
  const r1 = await por('quintal-arvore-florida', -1.7, -3.1);
  confere(r1.ficou, `e pôr de volta em outro canto (${r1.motivo ?? 'ok'})`);
  // os pisos: piso no caminho não; enfeite em cima de piso sim; piso cruzando piso sim
  const noCaminho = await por('quintal-deck', 2.0, -1.0);
  confere(!noCaminho.ficou && /caminho/.test(noCaminho.motivo ?? ''), `piso no caminho não fica ("${noCaminho.motivo}")`);
  const LUGARES = [
    ['quintal-deck', 4.65, -0.7], ['quintal-mesinha', 4.65, -0.7],
    ['quintal-canteiro-casca', -0.6, -1.0], ['quintal-hortensia-azul', -0.6, -1.0],
    ['quintal-gramado-de-flores', -1.7, -3.1],
    ['quintal-pedrisco', 4.3, -3.6], ['quintal-tapete', 4.5, -3.4],
    ['quintal-canteiro-terra', -0.4, -3.7],
  ];
  const res = [];
  for (const [id, x, z] of LUGARES) res.push(await por(id, x, z));
  const nao = res.filter((r) => !r.ficou);
  confere(nao.length === 0, `os pisos ficam, e por cima deles a mesinha e a hortênsia (${res.length - nao.length} de ${res.length})${nao.length ? ' — ' + JSON.stringify(nao) : ''}`);
  const semColisor = await page.evaluate((chave) => [...eval(chave).postos.values()].filter((p) => p.ficha.piso).every((p) => p.colisor === null), decorador);
  confere(semColisor, 'piso não tem colisor (anda-se por cima)');
  // o mais novo pinta por cima: o tapete (posto depois) por cima do pedrisco
  const ordem = await page.evaluate((chave) => {
    const d = eval(chave);
    const de = (id) => {
      let r = -1;
      [...d.postos.values()].find((p) => p.ficha.id === id)?.peca.traverse((o) => { if (o.renderOrder >= 10) r = Math.max(r, o.renderOrder); });
      return r;
    };
    return { pedrisco: de('quintal-pedrisco'), tapete: de('quintal-tapete') };
  }, decorador);
  confere(ordem.tapete > ordem.pedrisco, `o piso posto por último pinta por cima (tapete ${ordem.tapete} > pedrisco ${ordem.pedrisco})`);
  await page.evaluate(() => { window.jogo.debugPlace(2.0, 1.6, Math.PI / 4); window.jogo.setZoom(13); });
  await page.waitForTimeout(1200);
  const pesoChao = await peso();
  console.log(`       peso da vista com os pisos: ${pesoChao.calls} desenhos / ${pesoChao.tris} triângulos`);
  await page.screenshot({ path: `${OUT}-pisos.png` });
  for (const [nome, x, z, f] of [['deck', 4.0, 0.9, Math.PI * 0.85], ['canteiros', -0.4, 0.4, -Math.PI * 0.8], ['tapete', 3.0, -1.9, Math.PI * 0.6]]) {
    await page.evaluate(([x, z, f]) => { window.jogo.debugPlace(x, z, f); window.jogo.setZoom(5); }, [x, z, f]);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-perto-${nome}.png` });
  }
  // recarregar: o caminho, a hera e os pisos continuam
  await abrir('bebito&cena=frente-da-casa');
  const depois = await page.evaluate(() => ({
    hera: window.jogo.current.world.root.children.some((o) => o.userData?.peca === 'hera-do-muro'),
  }));
  confere(await pecaNoChao('caminho-tijolinho') === 1 && !depois.hera, 'recarregando, o caminho de tijolinho e os muros sem hera continuam');
  // e a hera de volta
  await bau();
  await page.locator('.painel-do-quintal [data-acao="hera"]').click();
  await page.waitForTimeout(400);
  confere(await page.evaluate(() => window.jogo.current.world.root.children.some((o) => o.userData?.peca === 'hera-do-muro')), 'e a hera volta para os muros');
}

// ======================================================= no alto (a etapa 3)
if (roda('alto')) {
  console.log('— etapa 3: na parede, em cima do muro, pendurado e de ponta a ponta');
  await abrir('bebito&cena=quarto');
  await page.evaluate(() => localStorage.removeItem('aristory.save.v1.bebito'));
  await abrir('bebito&cena=quarto');
  await page.evaluate(() => { window.jogo.setFlag('lab:pasta-vista'); window.jogo.ganhar(2000); });
  await disparar('quarto:mesa');
  await page.waitForSelector('.painel-do-quintal.show', { timeout: 8000 });
  await page.locator('.painel-do-quintal [data-acao="papita"]').click();
  await page.locator('.painel-do-quintal [data-acao="aba"][data-id="alto"]').click();
  await page.waitForTimeout(900);
  const ids = await page.locator('.painel-do-quintal .produto').evaluateAll((els) => els.map((e) => e.dataset.id));
  confere(ids.length === 15, `a prateleira "No alto": ${ids.length} peças`);
  await page.screenshot({ path: `${OUT}-papita-alto.png` });
  for (const id of ids) await page.locator(`.painel-do-quintal [data-acao="pedir"][data-id="${id}"]`).click();
  await page.locator('.painel-do-quintal [data-acao="fechar"]').click();
  await abrir('bebito&cena=frente-da-casa');
  await disparar('frente:encomenda');
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(400);
    if (!(await page.evaluate(() => document.querySelector('.dialogue.show') !== null))) break;
    await page.keyboard.press('KeyE');
  }
  /** entra com a peça na mão (se ainda não), põe quem joga em (x, z) olhando para `f`, e devolve o que a barra diz */
  const mirar = (id, x, z, f) => page.evaluate(async ([id, x, z, f, chave]) => {
    const d = eval(chave);
    if (!d.decorando) d.colocar(id);
    window.jogo.debugPlace(x, z, f);
    await new Promise((r) => setTimeout(r, 450));
    return {
      motivo: document.querySelector('.posicionador .nao-pode')?.textContent?.trim() ?? null,
      altura: document.querySelector('.posicionador .altura')?.textContent ?? null,
      ponta: document.querySelector('.posicionador .ponta')?.textContent ?? null,
    };
  }, [id, x, z, f, decorador]);
  const clicar = (botao) => page.evaluate(async (b) => {
    document.querySelector(`.posicionador [data-botao="${b}"]`)?.click();
    await new Promise((r) => setTimeout(r, 250));
  }, botao);
  const salvo = (id) => page.evaluate((id) => window.jogo.decoracoes().find((d) => d.id === id && d.posta)?.posta ?? null, id);
  const decorando = () => page.evaluate(`${decorador}.decorando`);
  // a PAREDE: a arandela na frente da porta não; ao lado, sim, e o ▲ sobe
  let r = await mirar('quintal-arandela', 2.0, -3.6, Math.PI);
  confere(/porta/.test(r.motivo ?? ''), `na frente da porta não dá ("${r.motivo}")`);
  r = await mirar('quintal-arandela', 0.9, -3.6, Math.PI);
  const antes = r.altura;
  await clicar('subir'); await clicar('subir'); await clicar('subir');
  r = await mirar('quintal-arandela', 0.9, -3.6, Math.PI);
  confere(!r.motivo && antes && r.altura && r.altura !== antes, `ao lado da porta dá, e o ▲ sobe (${antes} → ${r.altura})`);
  await page.screenshot({ path: `${OUT}-mirando-parede.png` });
  await clicar('colocar');
  const ar = await salvo('quintal-arandela');
  confere(ar?.encaixe === 'parede' && ar.sup === 'fachada' && Math.abs(ar.y - 2.2) < 0.06, `a arandela fica na fachada, a 2,2 m (${JSON.stringify(ar)})`);
  // a treliça é alta demais para o muro, e cabe na parede da garagem
  r = await mirar('quintal-trelica', 7.9, 0.0, -Math.PI / 2);
  const ondeEstou = await page.evaluate((chave) => { const d = eval(chave); const p = window.jogo.playerPosition(); return { p: [p.x.toFixed(2), p.z.toFixed(2)], sup: d.modo?.sup?.id, y: d.modo?.y }; }, decorador);
  confere(/alto demais/.test(r.motivo ?? ''), `a treliça no muro não cabe ("${r.motivo}", ${JSON.stringify(ondeEstou)})`);
  await clicar('cancelar');
  const PAREDE = [
    ['quintal-casinha-de-passarinho', 6.3, -3.6, Math.PI],
    ['quintal-vaso-de-parede', -6.9, 0.6, -Math.PI / 2],
    ['quintal-trelica', -6.9, -2.4, -Math.PI / 2],
    ['quintal-espelho', 4.8, 4.3, Math.PI],
  ];
  // EM CIMA do muro e da mureta
  const EM_CIMA = [
    ['quintal-suculentas', 4.0, 2.0, 0], ['quintal-gatinho', 5.4, 2.0, 0],
    ['quintal-lanterninha-solar', -1.8, -3.0, -Math.PI / 2], ['quintal-trio-de-vasinhos', 5.6, -0.4, Math.PI / 2],
  ];
  // PENDURADO na viga do pergolado e no beiral
  const PENDURADO = [
    ['quintal-macrame', -4.0, -2.2, Math.PI / 2], ['quintal-sino-de-vento', -4.0, 0.6, Math.PI / 2],
    ['quintal-lanterna-de-papel', 4.2, -3.6, Math.PI],
  ];
  const res = [];
  for (const [id, x, z, f] of [...PAREDE, ...EM_CIMA, ...PENDURADO]) {
    const m = await mirar(id, x, z, f);
    await clicar('colocar');
    const p = await salvo(id);
    if (await decorando()) await clicar('cancelar');
    res.push({ id, ficou: !!p, encaixe: p?.encaixe, sup: p?.sup, motivo: m.motivo });
  }
  const nao = res.filter((k) => !k.ficou);
  confere(nao.length === 0, `parede, em cima e pendurado: ${res.length - nao.length} de ${res.length}${nao.length ? ' — ' + JSON.stringify(nao) : ''}`);
  console.log('       ' + res.map((k) => `${k.id.replace('quintal-', '')}@${k.sup}`).join(' · '));
  // DE PONTA A PONTA: o primeiro E marca a ponta, o X desfaz, o segundo põe
  r = await mirar('quintal-varal-de-luzinhas', 3.6, -3.2, Math.PI);
  confere(/primeira/.test(r.ponta ?? '') && !r.motivo, `o varal pede a primeira ponta ("${r.ponta}")`);
  await clicar('colocar');
  r = await mirar('quintal-varal-de-luzinhas', 2.8, 1.8, 0);
  confere(/segunda/.test(r.ponta ?? ''), `e depois a segunda ("${r.ponta}", ${r.motivo ?? 'ok'})`);
  await page.screenshot({ path: `${OUT}-mirando-varal.png` });
  await clicar('cancelar');
  r = await mirar('quintal-varal-de-luzinhas', 3.6, -3.2, Math.PI);
  confere(/primeira/.test(r.ponta ?? '') && await decorando(), 'o X desfaz a primeira ponta (sem sair)');
  await clicar('colocar');
  await mirar('quintal-varal-de-luzinhas', 2.8, 1.8, 0);
  await clicar('colocar');
  const varal = await salvo('quintal-varal-de-luzinhas');
  confere(varal?.encaixe === 'pontaAPonta' && !!varal.ate, `o varal fica entre o beiral e o pilar (${JSON.stringify(varal)})`);
  for (const [id, a, b] of [
    ['quintal-bandeirinhas', [0.4, -3.2, Math.PI], [-2.0, -1.2, -Math.PI / 2]],
    ['quintal-cordao-de-lanternas', [6.2, -3.2, Math.PI], [6.0, 1.8, 0]],
  ]) {
    await mirar(id, ...a);
    await clicar('colocar');
    const m = await mirar(id, ...b);
    await clicar('colocar');
    const p = await salvo(id);
    if (await decorando()) await clicar('cancelar');
    confere(!!p?.ate, `${id} de ponta a ponta (${m.motivo ?? 'ok'})`);
  }
  // as fotos: o quintal inteiro, a fachada, a garagem e a rua
  for (const [nome, x, z, f, zoom] of [
    ['alto-quintal', 2.0, 1.6, Math.PI / 4, 13], ['alto-fachada', 3.0, -2.2, Math.PI * 0.85, 6],
    ['alto-garagem', -4.0, -0.4, -Math.PI * 0.6, 6], ['alto-muro', 4.8, 4.4, Math.PI, 6], ['alto-varais', 1.0, -0.5, Math.PI * 0.8, 9],
  ]) {
    await page.evaluate(([x, z, f, zoom]) => { window.jogo.debugPlace(x, z, f); window.jogo.setZoom(zoom); }, [x, z, f, zoom]);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${OUT}-${nome}.png` });
  }
  const pesoAlto = await (async () => {
    await page.evaluate(() => { window.jogo.debugPlace(2.0, 1.6, Math.PI / 4); window.jogo.setZoom(13); });
    await page.waitForTimeout(900);
    return peso();
  })();
  console.log(`       peso da vista com as 15 peças no alto: ${pesoAlto.calls} desenhos / ${pesoAlto.tris} triângulos`);
  // recarregar: tudo no lugar; e o modo de edição acha cada um pelo chão
  await abrir('bebito&cena=frente-da-casa');
  const montadas = await page.evaluate(`${decorador}.noChao`);
  const postas = await page.evaluate(() => window.jogo.decoracoes().filter((d) => d.posta?.cena === 'quintal').length);
  confere(montadas === postas && postas >= 16, `recarregando, as ${postas} peças voltam (${montadas})`);
  const sino = await page.evaluate(() => {
    let r0 = null;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'quintal-sino-de-vento') r0 = o; });
    return r0 ? r0.userData.balanco?.rotation.z ?? null : null;
  });
  await page.waitForTimeout(600);
  const sino2 = await page.evaluate(() => {
    let r0 = null;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'quintal-sino-de-vento') r0 = o; });
    return r0 ? r0.userData.balanco?.rotation.z ?? null : null;
  });
  confere(sino !== null && sino !== sino2, `o sino de vento balança (${sino?.toFixed?.(3)} → ${sino2?.toFixed?.(3)})`);
  await page.evaluate(() => window.jogo.debugPlace(-3.95, -4.0, Math.PI));
  await disparar('frente:ferramentas');
  await page.waitForSelector('.painel-do-quintal.show', { timeout: 6000 });
  await page.locator('.painel-do-quintal [data-acao="editar"]').click();
  await page.waitForTimeout(400);
  const pontos = await page.evaluate(() => window.jogo.current.world.interactables.filter((i) => i.id.startsWith('decoracao:') && i.enabled).map((i) => [i.x, i.z]));
  const noQuintal = pontos.every(([x, z]) => x > -8.2 && x < 7.8 && z > -5 && z < 4.2);
  confere(pontos.length === postas && noQuintal, `no modo de edição, o "Mexer no…" de cada peça fica no chão, perto dela (${pontos.length})`);
  await page.screenshot({ path: `${OUT}-alto-arrumando.png` });
  await page.keyboard.press('KeyX');
}

// ===================================================== os móveis (a etapa 4)
if (roda('moveis')) {
  console.log('— etapa 4: os móveis de usar, o Pelusa e o regador');
  await abrir('bebito&cena=quarto');
  await page.evaluate(() => localStorage.removeItem('aristory.save.v1.bebito'));
  await abrir('bebito&cena=frente-da-casa');
  // (as peças direto no baú: a compra e a encomenda já têm teste)
  await page.evaluate(() => {
    const ids = ['quintal-balanco', 'quintal-rede', 'quintal-casinha-do-pelusa', 'quintal-mesinha', 'quintal-espreguicadeira', 'quintal-banco', 'quintal-hortensia-rosa'];
    const lista = window.jogo.decoracoes();
    let uid = lista.reduce((m, d) => Math.max(m, d.uid), 0);
    window.jogo.salvarDecoracoes([...lista, ...ids.map((id) => ({ uid: ++uid, id, posta: null }))]);
  });
  await abrir('bebito&cena=frente-da-casa');
  const por = (id, x, z, f) => page.evaluate(async ([id, x, z, f, chave]) => {
    const d = eval(chave);
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    if (!d.decorando) d.colocar(id);
    const raio = d.modo?.ficha.raio ?? 0.4;
    window.jogo.debugPlace(x - Math.sin(f) * (0.85 + raio), z - Math.cos(f) * (0.85 + raio), f);
    await espera(450);
    const motivo = document.querySelector('.posicionador .nao-pode')?.textContent?.trim() ?? null;
    document.querySelector('.posicionador button.colocar')?.click();
    await espera(250);
    if (d.decorando) {
      document.querySelector('.posicionador [data-botao="cancelar"]')?.click();
      await espera(150);
    }
    return { id, motivo, ficou: d.postas(id) === 1 };
  }, [id, x, z, f ?? Math.PI, decorador]);
  const LUGARES = [
    ['quintal-balanco', -1.3, -3.3], ['quintal-mesinha', 0.1, -1.2], ['quintal-hortensia-rosa', -1.6, -0.4],
    ['quintal-rede', 4.45, -0.9], ['quintal-espreguicadeira', 5.0, 1.6, Math.PI / 2], ['quintal-casinha-do-pelusa', -2.1, -1.4, Math.PI],
  ];
  const res = [];
  for (const [id, x, z, f] of LUGARES) res.push(await por(id, x, z, f));
  const nao = res.filter((r) => !r.ficou);
  confere(nao.length === 0, `os móveis no quintal (${res.length - nao.length} de ${res.length})${nao.length ? ' — ' + JSON.stringify(nao) : ''}`);
  const uidDe = (id) => page.evaluate(([id, chave]) => eval(chave).pecas().find((p) => p.ficha.id === id)?.uid, [id, decorador]);
  /** dispara o uso do móvel e vai apertando E nas falas até a pergunta "Ficar mais um pouco?" */
  const usar = async (id, foto) => {
    const uid = await uidDe(id);
    const ponto = await page.evaluate((uid) => {
      const p = window.jogo.current.world.interactables.find((i) => i.id === `usar:${uid}`);
      return p ? { label: p.label, enabled: p.enabled } : null;
    }, uid);
    await page.evaluate((uid) => { void window.jogo.current.world.interactables.find((i) => i.id === `usar:${uid}`).trigger(window.jogo); }, uid);
    // (o E só avança FALA: na pergunta ele escolheria "Ficar", e o balanço embalaria de novo)
    let chegou = false;
    for (let i = 0; i < 300 && !chegou; i++) {
      await page.waitForTimeout(500);
      const { texto, escolhas } = await page.evaluate(() => ({
        texto: document.querySelector('.dialogue.show')?.textContent ?? '',
        escolhas: document.querySelectorAll('.dialogue.show .escolhas button').length,
      }));
      if (escolhas >= 2 || /Fic/.test(texto)) {
        if (escolhas >= 2 && /Ficar mais um pouco/.test(texto)) chegou = true;
      } else if (texto) await page.keyboard.press('KeyE');
    }
    const estado = await page.evaluate(() => ({ preso: window.jogo.player.locked }));
    await page.screenshot({ path: `${OUT}-${foto}.png` });
    return { ponto, chegou, ...estado };
  };
  const levantar = async () => {
    await page.locator('.escolhas button').nth(1).click();
    await page.waitForFunction(() => !window.jogo.player.locked, null, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(400);
    return page.evaluate(() => !window.jogo.player.locked);
  };
  for (const [id, foto, rotulo] of [['quintal-mesinha', 'usando-mesinha', /mesinha/], ['quintal-rede', 'usando-rede', /rede/]]) {
    const u = await usar(id, foto);
    confere(u.ponto && rotulo.test(u.ponto.label) && u.chegou && u.preso, `${id}: "${u.ponto?.label}", os dois no lugar e a pergunta de ficar`);
    confere(await levantar(), `${id}: levantar solta os dois`);
  }
  // o balanço embala enquanto ficam
  const ub = await usar('quintal-balanco', 'usando-balanco');
  const giros = await page.evaluate(([chave]) => {
    const d = eval(chave);
    const p = d.pecas().find((k) => k.ficha.id === 'quintal-balanco');
    return p.peca.getObjectByName('balanco')?.rotation.x ?? null;
  }, [decorador]);
  confere(ub.chegou && ub.ponto && /Balançar/.test(ub.ponto.label) && giros !== null && Math.abs(giros) > 0.02, `o balanço embala com os dois (${giros?.toFixed?.(3)} rad, ${JSON.stringify(ub)})`);
  confere(await levantar(), 'e para, e solta os dois');
  // o Pelusa na casinha
  const pelusa = await page.evaluate(() => window.jogo.current.world.interactables.find((i) => i.id === 'frente:pelusa'));
  confere(!!pelusa, 'com a casinha no quintal, o Pelusa está nela');
  const miados0 = await page.evaluate(() => window.jogo.audio?.contagem?.get?.('miado') ?? 0);
  await disparar('frente:pelusa');
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(400);
    if (!(await page.evaluate(() => document.querySelector('.dialogue.show') !== null))) break;
    await page.keyboard.press('KeyE');
  }
  // (a dupla sai da frente, e a câmera olha para o Pelusa)
  await page.evaluate(() => {
    window.jogo.debugPlace(4.5, 1.2, 0);
    const gato = window.jogo.current.world.interactables.find((i) => i.id === 'frente:pelusa')?.highlight ?? null;
    window.jogo.focusCamera(gato);
    // (a hortênsia do teste ficou bem na frente da porta da casinha: some só para a foto)
    const h = window.jogo.current.world.root.userData.decorador.pecas().find((p) => p.ficha.id === 'quintal-hortensia-rosa');
    if (h) h.peca.visible = false;
    window.jogo.setZoom(3.2);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-pelusa.png` });
  await page.evaluate(() => {
    window.jogo.focusCamera(null);
    const h = window.jogo.current.world.root.userData.decorador.pecas().find((p) => p.ficha.id === 'quintal-hortensia-rosa');
    if (h) h.peca.visible = true;
  });
  confere(await page.evaluate(() => window.jogo.flag('quintal:pelusa-na-casinha')), 'o carinho no Pelusa da casinha');
  void miados0;
  // o regador: pegar nas ferramentas e regar a hortênsia
  await page.evaluate(() => window.jogo.debugPlace(-3.95, -4.0, Math.PI));
  await disparar('frente:ferramentas');
  await page.waitForSelector('.painel-do-quintal.show', { timeout: 6000 });
  await page.locator('.painel-do-quintal [data-acao="regador"]').click();
  await page.waitForTimeout(400);
  await page.evaluate(() => window.jogo.debugPlace(-1.6, 0.9, Math.PI));
  await page.waitForTimeout(700);
  const rega = await page.evaluate(() => {
    const p = window.jogo.current.world.interactables.find((i) => i.id === 'frente:regar');
    return p ? { enabled: p.enabled, label: p.label } : null;
  });
  confere(rega?.enabled && /hortênsia/.test(rega.label), `com o regador, perto da hortênsia: "${rega?.label}"`);
  await disparar('frente:regar');
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.jogo.setZoom(5));
  await page.screenshot({ path: `${OUT}-regando.png` });
  await page.waitForFunction(() => window.jogo.stat?.('quintal:regadas') >= 1 || (window.jogo.save?.data?.stats?.['quintal:regadas'] ?? 0) >= 1, null, { timeout: 30000 }).catch(() => {});
  const regadas = await page.evaluate(() => window.jogo.stat ? window.jogo.stat('quintal:regadas') : -1);
  confere(regadas >= 1, `regou (${regadas})`);
  // as fotos do quintal mobiliado
  await page.evaluate(() => { window.jogo.debugPlace(2.0, 1.6, Math.PI / 4); window.jogo.setZoom(13); });
  await page.waitForTimeout(1200);
  const pesoMoveis = await peso();
  console.log(`       peso da vista com os móveis: ${pesoMoveis.calls} desenhos / ${pesoMoveis.tris} triângulos`);
  await page.screenshot({ path: `${OUT}-moveis.png` });
  for (const [nome, x, z, f] of [['balanco', -0.4, -1.6, -Math.PI * 0.8], ['rede', 3.2, 0.6, Math.PI * 0.75]]) {
    await page.evaluate(([x, z, f]) => { window.jogo.debugPlace(x, z, f); window.jogo.setZoom(5.5); }, [x, z, f]);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}-perto-${nome}.png` });
  }
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
