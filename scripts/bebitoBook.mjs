/**
 * O BEBITO BOOK — o caderninho dos planos da barraca (`ui/bebitoBook.ts`).
 *
 * Duas partes:
 *
 * 1. AS REGRAS, sem navegador (`minigames/bebitoBook.ts`, empacotado com o
 *    esbuild do Vite): as 16 faces do caderno; a palavra que não cabe desce
 *    inteira para a linha de baixo, um parágrafo anda junto, a linha do outro
 *    empurra a página para baixo, página cheia recusa a tecla, o cursor
 *    acompanha a letra; ninguém escreve na linha do outro; e o save
 *    estragado volta limpo.
 *
 * 2. NO JOGO, na barraca da clareira: "Escrever no Bebito book" vira os dois
 *    de frente e abre o caderno FECHADO; a capa inteira na tela; as duas
 *    letras carregadas (Caveat e Kalam); abrir a capa; folhear; escrever na
 *    linha com a letra do Ari (e a data no alto se escreve sozinha); a frase
 *    longa descendo de linha sem transbordar; as teclas do jogo (T, J, I, E)
 *    não fazem nada com o cursor na linha; a caneta passa para o Renan (a
 *    letra dele); a linha do Ari fica só de leitura para ele; o Escape fecha
 *    a capa e a cena segue (corações e a memória); o save guarda cada linha
 *    com o dono; e, aberto de novo, o caderno está onde a fitinha marcou.
 *    `CEL=1` roda no celular em pé: uma página por vez, tudo dentro da tela.
 *
 * Uso: node scripts/bebitoBook.mjs /caminho/prefixo   (CEL=1 para o celular)
 */
import { build } from 'esbuild';
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './bebito';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';
const CEL = process.env.CEL === '1';
const falhas = [];
const checar = (ok, msg, dado) => { if (!ok) falhas.push(dado === undefined ? msg : `${msg}: ${JSON.stringify(dado)}`); };

// ============================================================ 1. as regras
const saida = await build({
  stdin: { contents: `export * from './src/minigames/bebitoBook';`, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, write: false, format: 'esm', platform: 'node',
});
const R = await import(`data:text/javascript;base64,${Buffer.from(saida.outputFiles[0].text).toString('base64')}`);
{
  const paginas = R.paginasDoBook();
  checar(paginas.length === 16, 'o caderno tem 16 faces (guarda, rosto, 12 perguntas, livre, guarda)', paginas.length);
  checar(paginas[0].id === 'guarda-frente' && paginas[1].id === 'rosto' && paginas[15].id === 'guarda-tras', 'a ordem do papel', paginas.map((p) => p.id));
  checar(new Set(R.PERGUNTAS.map((p) => p.id)).size === 12, 'doze perguntas, de id diferente');

  // a régua do teste: cabem 20 letras numa linha
  const cabe = (t) => t.length <= 20;
  const branco = R.linhasEmBranco();
  // cabe: só a linha muda
  let r = R.escreverNaLinha(branco, 0, 'oi bebito', 9, 'ari', cabe);
  checar(r && r.linhas[0].texto === 'oi bebito' && r.linhas[0].quem === 'ari' && r.cursor.linha === 0, 'escrever o que cabe', r);
  // a palavra que não cabe desce INTEIRA, sem o espaço, e o cursor desce junto
  r = R.escreverNaLinha(branco, 0, 'a gente vai pra praia', 21, 'ari', cabe);
  checar(r && r.linhas[0].texto === 'a gente vai pra' && r.linhas[1].texto === 'praia' && r.linhas[1].quem === 'ari'
    && r.cursor.linha === 1 && r.cursor.pos === 5, 'a palavra que não cabe desce para a linha de baixo', r && { l: r.linhas.slice(0, 2), c: r.cursor });
  // escrever no MEIO da linha cheia: o fim dela desce e o cursor fica onde estava
  const cheia = R.linhasEmBranco();
  cheia[0] = { texto: 'eu quero ver o mar', quem: 'ari' };
  r = R.escreverNaLinha(cheia, 0, 'eu quero muito ver o mar', 14, 'ari', cabe);
  checar(r && r.linhas[0].texto === 'eu quero muito ver o' && r.linhas[1].texto === 'mar' && r.cursor.linha === 0 && r.cursor.pos === 14,
    'escrever no meio: o fim desce, o cursor fica', r && { l: r.linhas.slice(0, 2), c: r.cursor });
  // um parágrafo anda junto: a de baixo, da mesma pessoa, recebe o resto na frente e quebra também
  const paragrafo = R.linhasEmBranco();
  paragrafo[0] = { texto: 'um dois tres quatro', quem: 'renan' };
  paragrafo[1] = { texto: 'cinco seis sete oito', quem: 'renan' };
  r = R.escreverNaLinha(paragrafo, 0, 'um dois tres quatro zero', 24, 'renan', cabe);
  checar(r && r.linhas[0].texto === 'um dois tres quatro' && r.linhas[1].texto === 'zero cinco seis sete' && r.linhas[2].texto === 'oito',
    'o parágrafo anda junto', r && r.linhas.slice(0, 3));
  // a linha de baixo é do OUTRO: abre uma linha antes dela, e o resto da página desce
  const misto = R.linhasEmBranco();
  misto[0] = { texto: 'eu quero ver o mar', quem: 'ari' };
  misto[1] = { texto: 'eu também', quem: 'renan' };
  r = R.escreverNaLinha(misto, 0, 'eu quero ver o mar com você', 27, 'ari', cabe);
  checar(r && r.linhas[1].texto === 'com você' && r.linhas[1].quem === 'ari' && r.linhas[2].texto === 'eu também'
    && r.linhas[2].quem === 'renan' && r.linhas.length === R.LINHAS_POR_PAGINA,
    'a linha do outro desce para dar lugar', r && r.linhas.slice(0, 3));
  // página cheia: a tecla não entra
  const lotada = R.linhasEmBranco().map((_, i) => ({ texto: i === 0 ? 'eu quero ver o mar' : `linha ${i}`, quem: i === 0 ? 'ari' : 'renan' }));
  r = R.escreverNaLinha(lotada, 0, 'eu quero ver o mar com você', 27, 'ari', cabe);
  checar(r === null, 'página cheia recusa a tecla', r);
  // a última linha não tem para onde descer
  r = R.escreverNaLinha(branco, R.LINHAS_POR_PAGINA - 1, 'a gente vai pra praia', 21, 'ari', cabe);
  checar(r === null, 'a última linha não desce', r);
  // cada um com a sua letra: ninguém escreve na linha do outro
  r = R.escreverNaLinha(misto, 1, 'eu também!', 10, 'ari', cabe);
  checar(r === null, 'o Ari não escreve na linha do Renan', r);
  // apagar tudo devolve a linha em branco (sem dono)
  r = R.escreverNaLinha(cheia, 0, '', 0, 'ari', cabe);
  checar(r && r.linhas[0].texto === '' && r.linhas[0].quem === null, 'a linha apagada fica sem dono', r && r.linhas[0]);
  // uma palavra maior que a linha quebra no meio
  r = R.escreverNaLinha(branco, 0, 'aaaaaaaaaaaaaaaaaaaaaaaaa', 25, 'ari', cabe);
  checar(r && r.linhas[0].texto.length === 20 && r.linhas[1].texto.length === 5, 'palavra gigante quebra no meio', r && r.linhas.slice(0, 2));

  // o save estragado volta limpo
  const sujo = R.normalizarBebitoBook({
    comecadoEm: 'ontem', quemComecou: 'gatito', marcador: 'viagem',
    folhas: {
      viagem: { linhas: [{ texto: 'praia', quem: 'ari' }, { texto: 'sem dono', quem: 'zé' }, { texto: 3, quem: 'renan' }], data: '20/10/26', quemData: 'renan' },
      vazia: { linhas: [] },
      quebrada: 'nada',
    },
  });
  checar(sujo.comecadoEm === null && sujo.quemComecou === null && sujo.marcador === 'viagem', 'cabeçalho do save conferido', sujo);
  checar(Object.keys(sujo.folhas).join() === 'viagem', 'só a folha escrita fica', Object.keys(sujo.folhas));
  const v = sujo.folhas.viagem;
  checar(v && v.linhas.length === R.LINHAS_POR_PAGINA && v.linhas[0].texto === 'praia' && v.linhas[1].texto === '' && v.linhas[2].texto === ''
    && v.data === '20/10/26' && v.quemData === 'renan', 'as linhas sem dono somem', v);
  checar(R.normalizarBebitoBook(undefined).folhas && R.perguntasRespondidas(sujo) === 1, 'save antigo e a conta das respondidas');
  checar(/^\d{2}\/\d{2}\/\d{2}$/.test(R.dataDeHoje(new Date(2026, 9, 20))) && R.dataDeHoje(new Date(2026, 9, 20)) === '20/10/26', 'a data à mão');
}
console.log(`1. regras: ${falhas.length ? 'com falhas' : 'ok'}`);

// =============================================================== 2. no jogo
const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
// o certificado do proxy deste ambiente não é conhecido do Chromium: sem
// `ignoreHTTPSErrors` o Google Fonts não carrega, e a foto sai com a letra de
// reserva — e a letra é justamente o que este teste olha
const page = await browser.newPage(CEL
  ? { viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, ignoreHTTPSErrors: true }
  : { viewport: { width: 1280, height: 860 }, ignoreHTTPSErrors: true });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
// o "net::ERR_" é a rede do ambiente de teste (o Google Fonts às vezes falha uma
// parte da fonte); se a letra não chegar, quem acusa é a conferência das fontes
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT|favicon/.test(m.text())) erros.push('console: ' + m.text()); });
const t0 = Date.now();
const foto = (nome) => {
  if (process.env.LOG) console.log(`  ${((Date.now() - t0) / 1000).toFixed(0)}s · ${nome}`);
  return page.screenshot({ path: `${OUT}-${nome}.png` });
};
const temEscolha = () => page.locator('.escolhas.show button').count();
const temFala = () => page.locator('.dialogue.show').count();
const escolhas = () => page.locator('.escolhas.show button').allTextContents();
const escolher = async (texto) => {
  for (let i = 0; i < 240 && !(await temEscolha()); i++) await page.waitForTimeout(250);
  await page.locator('.escolhas.show button', { hasText: texto }).first().click();
  await page.waitForTimeout(300);
};
const livro = () => page.evaluate(() => ({ aberto: window.jogo.ui.bebitoOpen, ...window.jogo.ui.bebitoBook.estado }));
/** passa as falas até `pronto()`; devolve as falas lidas */
const passarAte = async (pronto, limite = 500) => {
  const lidas = [];
  for (let i = 0; i < limite; i++) {
    if (await pronto()) break;
    if (await temFala()) {
      for (let k = 0; k < 40 && (await page.evaluate(() => window.jogo.ui.typing !== null)); k++) await page.waitForTimeout(120);
      lidas.push((await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '');
      await page.keyboard.press('KeyE');
    }
    await page.waitForTimeout(160);
  }
  return lidas;
};
const esperarLivro = async (cond, n = 120) => {
  for (let i = 0; i < n; i++) {
    const l = await livro();
    if (cond(l)) return l;
    await page.waitForTimeout(150);
  }
  return livro();
};
const entrarNaBarraca = async () => {
  const PORTA = await page.evaluate(() => {
    let t = null;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') t = o.userData.teste; });
    return t.PORTA;
  });
  let prompt = false;
  for (let i = 0; i < 20 && !prompt; i++) {
    await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI * 1.25), [PORTA.x, PORTA.z]);
    await page.waitForTimeout(350);
    prompt = /entrar na barraca/i.test((await page.locator('.prompt .label').textContent().catch(() => '')) ?? '');
  }
  await page.keyboard.press('KeyE');
  await escolher('Entrar');
  return prompt;
};
/** a caixa de um elemento na tela */
const caixa = (sel) => page.evaluate((s) => {
  const r = document.querySelector(s)?.getBoundingClientRect();
  return r ? { x: r.x, y: r.y, w: r.width, h: r.height, fim: r.right, baixo: r.bottom } : null;
}, sel);
const dentroDaTela = (c) => {
  const vw = CEL ? 390 : 1280;
  const vh = CEL ? 780 : 860;
  return !!c && c.x >= -1 && c.y >= -1 && c.fim <= vw + 1 && c.baixo <= vh + 1;
};
/** os campos de uma página aberta (o slot) */
const linhas = (slot) => page.evaluate((s) => [...document.querySelectorAll(`.bebito-book .pagina.${s} .linha`)].map((l) => ({
  valor: l.value, letra: l.classList.contains('de-ari') ? 'ari' : l.classList.contains('de-renan') ? 'renan' : '?',
  fonte: getComputedStyle(l).fontFamily, soLeitura: l.readOnly, transborda: l.scrollWidth > l.clientWidth + 1,
})), slot);

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ flags: { 'clareira-achada': true } })), SAVE);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });
await page.waitForTimeout(1200);
await page.mouse.click(CEL ? 195 : 640, CEL ? 300 : 430);
const quemJoga = await page.evaluate(() => window.jogo.player.rig.spec.id);

// ------------------------------------------------- a. a escolha e a capa
await entrarNaBarraca();
await passarAte(() => temEscolha());
const menu = await escolhas();
checar(menu.includes('Escrever no Bebito book'), 'a escolha do caderno na barraca', menu);
await escolher('Escrever no Bebito book');
const falasAntes = await passarAte(async () => (await livro()).aberto);
const pose = await page.evaluate(() => ({
  jeito: window.jogo.beijoDeitado.comoEstao,
  giroA: window.jogo.player.rig.group.rotation.y,
  giroB: window.jogo.parceiro.rig.group.rotation.y,
}));
checar(pose.jeito === 'frente' && Math.abs(pose.giroA) > 1.2 && Math.abs(pose.giroB) > 1.2 && Math.sign(pose.giroA) !== Math.sign(pose.giroB),
  'os dois de frente um pro outro com o caderno aberto', pose);
checar(falasAntes.some((f) => /Bebito book/.test(f)), 'a primeira vez, o Renan apresenta o caderno', falasAntes);
let l = await livro();
checar(l.aberto && !l.capaAberta, 'o caderno aparece fechado', l);
await page.waitForTimeout(900);
// `document.fonts.check` diz "sim" até quando a folha da fonte nem chegou: o
// que vale é a face carregada. A rede deste ambiente às vezes derruba uma
// parte da fonte — o caderno pede de novo (`garantirLetras`), e o teste dá
// a ele três chances, como o jogo daria a cada vez que o caderno abre
let fontes = null;
for (let k = 0; k < 4; k++) {
  fontes = await page.evaluate(async () => {
    await document.fonts.ready;
    const carregada = (f) => [...document.fonts].some((x) => x.family.replace(/["']/g, '') === f && x.status === 'loaded');
    return { caveat: carregada('Caveat'), kalam: carregada('Kalam'), tentativa: 0 };
  });
  fontes.tentativa = k;
  if (fontes.caveat && fontes.kalam) break;
  await page.evaluate(() => window.jogo.ui.bebitoBook.garantirLetras());
  await page.waitForTimeout(2500);
}
checar(fontes.caveat && fontes.kalam, 'as duas letras de mão carregadas', fontes);
const capa = await caixa('.bebito-book .capa');
checar(dentroDaTela(capa) && capa.w > (CEL ? 300 : 360), 'a capa inteira na tela', capa);
const barra = await caixa('.bebito-book .barra-do-caderno');
checar(dentroDaTela(barra) && barra.y >= capa.baixo - 2, 'a barra embaixo do caderno, dentro da tela', { barra, capa });
const naPolaroid = await page.evaluate(() => [...document.querySelectorAll('.bebito-book .polaroid img')].map((i) => i.naturalWidth));
checar(naPolaroid.length === 2 && naPolaroid.every((w) => w > 0), 'a polaroid com o rosto dos dois', naPolaroid);
await foto('1-capa');

// ------------------------------------------------- b. abrir a capa
await page.locator('.bebito-book .capa').click({ position: { x: 120, y: 120 } });
await page.waitForTimeout(500);
await foto('2-abrindo');
l = await esperarLivro((x) => x.capaAberta && !x.animando);
checar(l.capaAberta && l.pagina === (CEL ? 'rosto' : 'guarda-frente'), 'a capa abre na primeira página', l);
await page.waitForTimeout(300);
await foto('3-aberto');
const rosto = await page.evaluate(() => document.querySelector('.bebito-book .pagina.rosto')?.textContent ?? '');
checar(/Bebito/.test(rosto) && /\d{2}\/\d{2}\/\d{2}/.test(rosto) && /Ari/.test(rosto) && /Renan/.test(rosto), 'a folha de rosto: nomes e data', rosto.replace(/\s+/g, ' ').slice(0, 200));

// ------------------------------------------------- c. folhear e escrever
await page.locator('.bebito-book .virar.depois').click();
await page.waitForTimeout(250);
await foto('4-virando');
l = await esperarLivro((x) => !x.animando);
checar(l.pagina === 'viagem', 'a próxima página é a primeira pergunta', l);
const slot = CEL ? 'dir' : 'esq';
await page.locator(`.bebito-book .pagina.${slot} .linha[data-i="0"]`).click();
const frase = 'A gente vai pra praia, e já depois pega um avião pra ver a neve juntinhos pela primeira vez';
await page.keyboard.type(frase, { delay: 12 });
await page.waitForTimeout(500);
let ls = await linhas(slot);
const escrito = ls.map((x) => x.valor).filter(Boolean);
checar(escrito.join(' ') === frase, 'a frase inteira, quebrada em linhas', escrito);
checar(escrito.length >= 2 && ls.slice(0, escrito.length).every((x) => x.letra === quemJoga && !x.transborda),
  'cada pedaço na letra de quem joga, sem transbordar', ls.slice(0, 4));
checar(/caveat/i.test(ls[0].fonte) === (quemJoga === 'ari'), 'a letra do Ari é a Caveat', ls[0].fonte);
const data = await page.evaluate((s) => document.querySelector(`.bebito-book .pagina.${s} .data b`)?.textContent ?? '', slot);
checar(/^\d{2}\/\d{2}\/\d{2}$/.test(data), 'a data se escreveu sozinha no alto', data);
const jogo = await page.evaluate(() => ({
  quem: window.jogo.player.rig.spec.id, diario: window.jogo.ui.journalOpen, mochila: window.jogo.ui.mochilaOpen,
  fala: window.jogo.ui.dialogueOpen,
}));
checar(jogo.quem === quemJoga && !jogo.diario && !jogo.mochila && !jogo.fala, 'as teclas do jogo quietas enquanto escreve (T, J, I, E)', jogo);
const sons = await page.evaluate(() => window.jogo.audio.contagem.get('rabisco') ?? 0);
checar(sons > 5, 'a caneta risca o papel', sons);

// a caneta passa para o outro
const outro = quemJoga === 'ari' ? 'renan' : 'ari';
await page.locator(`.bebito-book .caneta[data-quem="${outro}"]`).click();
await page.waitForTimeout(250);
l = await livro();
checar(l.caneta === outro, 'a caneta trocou de mão', l);
const linhaDoOutro = escrito.length + 1;
await page.locator(`.bebito-book .pagina.${slot} .linha[data-i="${linhaDoOutro}"]`).click();
await page.keyboard.type('E eu quero ver o mar com você', { delay: 12 });
await page.waitForTimeout(400);
ls = await linhas(slot);
checar(ls[linhaDoOutro].valor === 'E eu quero ver o mar com você' && ls[linhaDoOutro].letra === outro, 'a linha na letra do outro', ls[linhaDoOutro]);
checar(/kalam/i.test(ls[linhaDoOutro].fonte) === (outro === 'renan'), 'a letra do Renan é a Kalam', ls[linhaDoOutro].fonte);
checar(ls[0].soLeitura, 'a linha do primeiro fica só de leitura para o outro', ls[0]);
await page.locator(`.bebito-book .pagina.${slot} .linha[data-i="0"]`).click();
await page.waitForTimeout(300);
const recado = await page.evaluate(() => document.querySelector('.bebito-book .dica-do-caderno.show')?.textContent ?? '');
checar(/letra d/.test(recado), 'o recado de que a linha é do outro', recado);
await page.keyboard.type('xyz');
ls = await linhas(slot);
checar(!ls[0].valor.includes('xyz'), 'e ela não muda', ls[0]);
await page.locator('.bebito-book .dica-do-caderno').evaluate((d) => d.classList.remove('show'));
await page.mouse.click(5, 5);
await page.waitForTimeout(300);
await foto('5-escrito');
if (CEL) {
  // no celular: a página inteira dentro da tela
  const pg = await caixa('.bebito-book .pagina.dir');
  checar(dentroDaTela(pg), 'a página inteira na tela do celular', pg);
}

// mais uma página e volta
await page.keyboard.press('ArrowRight');
l = await esperarLivro((x) => !x.animando);
checar(l.pagina === (CEL ? 'casa' : 'bichinho'), 'a seta folheia para a frente', l);
await page.keyboard.press('ArrowLeft');
l = await esperarLivro((x) => !x.animando);
checar(l.pagina === 'viagem', 'e para trás', l);

// ------------------------------------------------- d. fechar e a cena segue
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
await foto('6-fechando');
l = await esperarLivro((x) => !x.aberto, 80);
checar(!l.aberto, 'o Escape fecha o caderno', l);
const falasDepois = await passarAte(async () => (await temEscolha()) > 0);
checar(falasDepois.some((f) => /planos|escrito/.test(f)), 'a conversa depois de escrever', falasDepois);
const depois = await page.evaluate((k) => {
  const s = JSON.parse(localStorage.getItem(k) ?? '{}');
  return {
    memoria: (s.memories ?? []).some((m) => m.id === 'bebito-book'),
    jeito: window.jogo.beijoDeitado.comoEstao,
    caderno: s.bebitoBook,
  };
}, SAVE);
checar(depois.memoria, 'a memória do Bebito book', depois.memoria);
checar(depois.jeito === null, 'de volta de barriga pra cima', depois.jeito);
const folha = depois.caderno?.folhas?.viagem;
checar(folha && folha.linhas[0].quem === quemJoga && folha.linhas[linhaDoOutro].quem === outro
  && folha.linhas.filter((x) => x.texto).length === escrito.length + 1 && folha.data === data,
  'o save guarda cada linha com o dono e a data', folha);
checar(depois.caderno?.marcador === 'viagem' && /^\d{2}\/\d{2}\/\d{2}$/.test(depois.caderno?.comecadoEm ?? ''), 'a fitinha e o começo', depois.caderno);

// ------------------------------------------------- e. aberto de novo, onde parou
await escolher('Escrever no Bebito book');
await passarAte(async () => (await livro()).aberto);
await page.waitForTimeout(700);
await page.locator('.bebito-book .virar.depois').click();
l = await esperarLivro((x) => x.capaAberta && !x.animando);
checar(l.pagina === 'viagem', 'aberto de novo, na página da fitinha', l);
ls = await linhas(slot);
checar(ls.map((x) => x.valor).filter(Boolean).length === escrito.length + 1, 'o que foi escrito continua lá', ls.map((x) => x.valor));
await page.waitForTimeout(300);
await foto('7-de-novo');
await page.locator('.bebito-book .fechar-caderno').click();
await esperarLivro((x) => !x.aberto, 80);
await passarAte(async () => (await temEscolha()) > 0);

checar(erros.length === 0, 'sem erro de console', erros);
console.log(`2. no jogo${CEL ? ' (celular)' : ''}: quem joga ${quemJoga}, ${escrito.length} linhas, data ${data}, ${sons} riscos`);
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:\n - ' + falhas.join('\n - '));
  process.exit(1);
}
console.log('tudo certo');
