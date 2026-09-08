/**
 * A ESTELLA, a ovelha costureira da lojinha de roupas do Villa Lobos.
 *
 * O que este teste guarda:
 *
 * - ela ESTÁ na calçada, na frente da vitrine, e NÃO SAI: a área que a cena
 *   passa é menor que o passo mínimo do cérebro (0,7), e é só isso que a segura
 *   ali. Quem alargar essa área põe uma ovelha passeando pelo parque, e o teste
 *   avisa;
 * - ela APARECE INTEIRA de onde a dupla para para falar com ela. É a asserção
 *   que existe por causa do TOLDO da loja: ele avança 1,05 da fachada, e a
 *   câmera de 34° faz cada peça esconder 1,5 vez a própria altura de chão atrás
 *   dela. Um passo a menos na calçada e ela seria uma costureira decapitada.
 *   O teste mede GEOMETRIA (nada alto entre ela e a câmera), e não a foto: o
 *   parque é vivo, e duas capturas do mesmo quadro já saem diferentes;
 * - o PROMPT anda junto com ela (o `moveTo` no `onUpdate`), medido contra a
 *   posição dela e não contra o balão;
 * - a APRESENTAÇÃO acontece e diz quem ela é: o nome, o orgulho da costura
 *   ("nada sai daquela porta sem eu aprovar"), o uniforme do Cookie e o
 *   xadrez;
 * - o BRINDE SAI DA MÃO DELA: um biscoitinho para CADA UM dos dois, e não um
 *   para o casal. É a mesma regra dos sorvetes do Mano, e é o teste que
 *   garante que o Renan não fique olhando o Ari comer;
 * - a MESINHA DE XADREZ existe, está montada na calçada e é BAIXA o bastante
 *   para não esconder a ovelha;
 * - ela VIRA para quem chega e DESVIRA quando a dupla vai embora, voltando a
 *   olhar para o parque (`+X`). O Mano já pagou esse bug: soltar o alvo sem
 *   mandar de volta deixa o bicho torto para sempre;
 * - ela BALE sozinha, pelo contador do motor de áudio.
 *
 * Uso: node scripts/estella.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './estella';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o `ESTELLA` da cena */
const POSTO = { x: -32.6, z: -16.5 };
/** a fachada da loja, para a conta do toldo */
const FACHADA_X = -34.8;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 640 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const irPara = (x, z, facing = Math.PI) =>
  page.evaluate(([px, pz, f]) => window.jogo.debugPlace(px, pz, f), [x, z, facing]);

const venceAFala = async (voltas = 30) => {
  const ditas = [];
  for (let i = 0; i < voltas; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 12 && !ditas.includes(t)) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(520);
  }
  return ditas;
};

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(450, 320);
await page.waitForTimeout(600);

/**
 * O HANDLE FICA GUARDADO NA JANELA.
 *
 * Varrer a cena inteira a cada amostra custa caro neste renderizador — o teste
 * do Cookie mediu o próprio teste deixando o jogo QUATRO VEZES mais lento, e aí
 * as asserções de movimento passam a medir a lentidão em vez do bicho.
 */
await page.evaluate(() => {
  window.jogo.scene.traverse((o) => {
    if (!window.__estella && o.userData?.peca === 'estella') window.__estella = o;
  });
});

const aEstella = () => page.evaluate(() => {
  const o = window.__estella;
  if (!o) return null;
  return {
    onde: [+o.position.x.toFixed(2), +o.position.z.toFixed(2)],
    giro: +o.rotation.y.toFixed(2),
    temCabeca: !!o.getObjectByName('cabeca-da-estella'),
  };
});

// ================================================ 1. ela existe, e está no posto
const nasceu = await aEstella();

/**
 * NADA ALTO ENTRE ELA E A CÂMERA.
 *
 * "À frente" é `+X/+Z`, que é de onde a câmera olha — a loja fica em `−X`, de
 * costas para ela, e por isso o prédio inteiro é FUNDO e não tampa. Quem pode
 * tampar é o que estiver do lado da câmera: o beiral do toldo, se alguém
 * mandar ele avançar mais, ou uma árvore que o espalhador plante na calçada.
 *
 * A conta é a mesma do teste do Mano: uma peça de altura `h` esconde
 * `h / tan(34°) ≈ 1,5·h` de chão atrás dela, e o que importa é a altura da peça
 * MENOS a da ovelha (1,2).
 */
const ALTA = 1.2;
const tapando = await page.evaluate(([ox, oz, alta]) => {
  const acha = [];
  for (const o of window.jogo.current.world.root.children) {
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements;
    const x = e[12];
    const z = e[14];
    const frente = ((x - ox) + (z - oz)) * 0.707;
    if (frente < 0.4 || frente > 10) continue;
    // o desvio da diagonal: quem esconde de lado é a LARGURA da peça, e o
    // limite é fixo (2,5, o raio de uma copa larga) — proporcional à altura ele
    // acusaria a roda gigante do outro lado do parque
    const lado = Math.abs((x - ox) - (z - oz)) * 0.707;
    /**
     * A PEÇA TEM DUAS ALTURAS, e as duas contam: onde ela TERMINA e onde ela
     * COMEÇA. A linha de visada que sai da cabeça da ovelha sobe 1 para cada
     * 1,5 que anda em direção à câmera, e a peça só corta essa linha se o corpo
     * dela estiver ali — o topo acima da linha E a base abaixo.
     *
     * Sem a base, o teste acusava uma NUVEM: quatro puffs a 69 de altura,
     * passando 1,6 à frente dela. Pelo topo ela esconderia 100 de chão; pela
     * base, a visada nessa distância está a 2,3 do chão e passa 66 metros por
     * baixo da nuvem. Numa câmera ortogonal o que está muito alto sobe na TELA
     * (vira céu), em vez de cair em cima de quem está atrás.
     */
    let alto = 0;
    let baixo = Infinity;
    o.traverse((n) => {
      if (!n.isMesh) return;
      n.updateWorldMatrix(true, false);
      const y = n.matrixWorld.elements[13];
      alto = Math.max(alto, y);
      baixo = Math.min(baixo, y);
    });
    if (alto > alta && baixo < alta + frente / 1.5 && lado < 2.5 && frente < (alto - alta) * 1.5) {
      acha.push({ peca: o.userData?.peca ?? o.type, x: +x.toFixed(1), z: +z.toFixed(1), alto: +alto.toFixed(1) });
    }
  }
  return acha;
}, [POSTO.x, POSTO.z, ALTA]);

// ==================================================== 2. o prompt anda com ela
const grudado = await page.evaluate(() => {
  const it = window.jogo.current.world.interactables.find((i) => i.id === 'parque:estella');
  const o = window.__estella;
  if (!it || !o) return null;
  return {
    doPrompt: [+it.x.toFixed(3), +it.z.toFixed(3)],
    daEstella: [+o.position.x.toFixed(3), +o.position.z.toFixed(3)],
  };
});

// ======================================= 3. de perto o prompt é o dela, e ela vira
await irPara(POSTO.x + 0.9, POSTO.z + 0.6);
await page.waitForTimeout(1200);
const deColado = await prompt();

await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
/*
 * A APRESENTAÇÃO VEM EM BLOCOS, e `venceAFala` desiste no primeiro silêncio —
 * entre um `conversa` e o seguinte a caixa some por um quadro, e o teste
 * enxergava só o primeiro bloco (dava a Estella por muda sobre o xadrez, que é
 * o último). Três rodadas cobrem os quatro blocos dela, e a última também
 * espera o diário fechar a cena.
 */
const apresentacao = await venceAFala();
for (let volta = 0; volta < 3; volta++) {
  await page.waitForTimeout(900);
  for (const f of await venceAFala()) if (!apresentacao.includes(f)) apresentacao.push(f);
}
await page.waitForTimeout(900);
const encarando = await aEstella();

/* ============ 3b. DEPOIS DE APRESENTADA, FALAR COM ELA OFERECE A PARTIDA
 *
 * A mesinha tem o ponto dela na calçada, mas quem chega pela ovelha precisa
 * poder sentar sem descobrir o tabuleiro sozinho — são duas portas para a mesma
 * mesa, e esta é a que fica em cima dela. (A partida em si é o
 * `scripts/xadrez.mjs`; aqui só se prova que o convite existe e que o "só um
 * oi" continua devolvendo uma fala dela.)
 */
/*
 * ESVAZIA A CAIXA DE FALA ANTES DE APERTAR O E.
 *
 * Com a apresentação ainda rolando, o E avança a fala em vez de abrir a
 * interação de novo — e o teste lia "nenhuma opção" achando que o convite não
 * existia. Espera a caixa sumir; só aí o E vale como interagir.
 */
for (let i = 0; i < 30 && (await page.locator('.dialogue.show').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
await page.waitForTimeout(600);
await page.keyboard.press('KeyE');
await page.waitForTimeout(1100);
const opcoes = await page.evaluate(() =>
  [...document.querySelectorAll('.escolhas button')].map((b) => b.textContent));
if (opcoes.length) {
  const soUmOi = opcoes.findIndex((t) => /oi/i.test(t ?? ''));
  await page.click(`.escolhas button:nth-child(${soUmOi + 1})`);
  await page.waitForTimeout(700);
}
const falaSolta = await venceAFala(10);


/**
 * A FOTO DE PERTO É OBRIGATÓRIA, e é ela que prova o modelo: de longe qualquer
 * bolota creme parece uma ovelha. Duas — a cara (onde moram o óculos, a fita e
 * o focinho ruminando) e o lombo (a almofada de alfinete e o carretel).
 */
/*
 * A CÂMERA VAI NELA, e a dupla vai EMBORA antes.
 *
 * A primeira versão só aproximava a câmera do jogador parado ao lado dela — e o
 * retrato saiu com o cabelão do Renan bem em cima da ovelha, porque a câmera
 * segue a DUPLA e eles estavam entre ela e a lente. Aqui os dois são mandados
 * para longe e a câmera passa a mirar o grupo dela.
 */
await page.evaluate(([x, z]) => {
  window.jogo.debugPlace(x + 9, z + 8, 0);
  window.jogo.focusCamera(window.__estella);
  window.jogo.setZoom(2.6);
}, [POSTO.x, POSTO.z]);
await page.waitForTimeout(2400);
await page.screenshot({ path: `${OUT}-perto.png` });

await page.evaluate(() => window.jogo.setZoom(7));
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}-loja.png` });
await page.evaluate(() => window.jogo.focusCamera(null));

// ====================================== 4. longe dela, ela volta a olhar o parque
await irPara(POSTO.x + 9, POSTO.z + 7);
await page.evaluate(() => window.jogo.setZoom(11));
await page.waitForTimeout(3000);
const desvirou = await aEstella();
await page.screenshot({ path: `${OUT}-posto.png` });

/* ================= 4b. A CALÇADA PRECISA SER ANDÁVEL DOS DOIS LADOS DA MESA
 *
 * Esta asserção existe por causa de um muro invisível: a mesinha de xadrez foi
 * colocada com `blockBox(…, 1,7, 1,0, …)`, e o `blockBox` recebe MEIA largura —
 * era uma caixa de 3,4 × 2,0 para uma mesa de 0,84 de diâmetro, atravessando a
 * calçada quase de ponta a ponta. Dava para VER a passagem e não dava para
 * passar, que é o pior tipo de bug de cenário: a pessoa acha que o jogo travou.
 *
 * O teste mede o mundo pela mesma conta que o jogo usa (o jogador é um círculo
 * de 0,42), em quatro pontos que têm que estar livres — os dois lados da mesa e
 * os dois lados da cesta — e em dois que têm que estar BLOQUEADOS, senão a
 * "correção" seria apagar o colisor e deixar a dupla andar por dentro da mesa.
 */
const calcada = await page.evaluate(([mx, mz, cx, cz]) => {
  const RAIO = 0.42;
  const colisores = window.jogo.current.world.colliders;
  const bate = (x, z) => colisores.some((c) => {
    if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < RAIO + c.r;
    const cos = Math.cos(-c.rot);
    const sin = Math.sin(-c.rot);
    const rx = x - c.x;
    const rz = z - c.z;
    const lx = rx * cos - rz * sin;
    const lz = rx * sin + rz * cos;
    const dx = Math.max(Math.abs(lx) - c.hw, 0);
    const dz = Math.max(Math.abs(lz) - c.hd, 0);
    return dx * dx + dz * dz < RAIO * RAIO;
  });
  return {
    // livres: passar pelos dois lados da mesinha, e pelos dois da cesta
    ladoDaRua: bate(mx + 1.6, mz),
    ladoDaVitrine: bate(mx - 1.7, mz),
    antesDaMesa: bate(mx, mz + 1.6),
    aoLadoDaCesta: bate(cx + 1.0, cz),
    // e dá para chegar perto da vitrine: o colisor do prédio para na linha dos
    // vasos (−35,45), então o centro da dupla alcança −35,03
    naFrenteDaVitrine: bate(-34.9, -16.5),
    // e o que TEM que barrar: o meio da mesa e o meio do caixote
    emCimaDaMesa: bate(mx, mz),
    emCimaDaCesta: bate(cx, cz),
    emCimaDoVaso: bate(-35.6, -18.3),
    emCimaDaLoja: bate(-40, -16.5),
  };
}, [-32.75, -18.7, -32.35, -15.45]);

// ================================================ 5. ela não sai do posto, e bale
const trilha = [];
for (let i = 0; i < 14; i++) {
  const o = await aEstella();
  if (o) trilha.push(o.onde);
  await page.waitForTimeout(700);
}
const longeDoPosto = trilha.filter(([x, z]) => Math.hypot(x - POSTO.x, z - POSTO.z) > 0.5);
const balidos = await page.evaluate(
  () => Object.fromEntries(window.jogo.audio.contagem).balido ?? 0,
);

/*
 * O BRINDE E A MESINHA. O biscoito e medido POR PESSOA — um para cada, e nao um
 * para o casal —, e a mesinha e medida pela ALTURA: peca alta na calcada, do
 * lado da camera, esconde quem esta atras dela (1,5 vez a propria altura).
 */
const brinde = await page.evaluate(() => ({
  doAri: window.jogo.hasItem('biscoito-estella', 'ari'),
  doRenan: window.jogo.hasItem('biscoito-estella', 'renan'),
}));
const mesinha = await page.evaluate(() => {
  let m = null;
  window.jogo.scene.traverse((o) => {
    if (!m && o.userData?.peca === 'mesinha-de-xadrez') m = o;
  });
  if (!m) return null;
  let alto = 0;
  m.traverse((n) => {
    if (!n.isMesh) return;
    n.updateWorldMatrix(true, false);
    alto = Math.max(alto, n.matrixWorld.elements[13]);
  });
  m.updateWorldMatrix(true, false);
  return { x: +m.matrixWorld.elements[12].toFixed(1), z: +m.matrixWorld.elements[14].toFixed(1), alto: +alto.toFixed(2) };
});

const noDiario = await page.evaluate(() => {
  const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  return (save.unlocks ?? save.memories ?? []).map((m) => m.id ?? m);
});

// ======================================================================= laudo
const falhas = [];
if (!nasceu) falhas.push('a Estella nao esta na cena');
else {
  if (Math.hypot(nasceu.onde[0] - POSTO.x, nasceu.onde[1] - POSTO.z) > 0.3) {
    falhas.push(`ela nao nasceu no posto: ${JSON.stringify(nasceu.onde)}`);
  }
  if (!nasceu.temCabeca) falhas.push('a cabeca dela sumiu');
  // ela nasce olhando para +X, que é o resto do parque
  if (Math.abs(nasceu.giro - Math.PI / 2) > 0.2) {
    falhas.push(`ela nao nasceu de frente para o parque: giro ${nasceu.giro}`);
  }
  // e a 2,2 da fachada: fora da sombra do toldo, que avança 1,05
  const daFachada = nasceu.onde[0] - FACHADA_X;
  if (daFachada < 2) falhas.push(`ela esta debaixo do toldo (${daFachada.toFixed(2)} da fachada)`);
}
if (tapando.length) {
  falhas.push(`tem coisa alta na frente dela, escondendo ela: ${JSON.stringify(tapando[0])}`);
}
if (!grudado) falhas.push('nao achei o ponto de interacao dela');
else if (Math.hypot(grudado.doPrompt[0] - grudado.daEstella[0], grudado.doPrompt[1] - grudado.daEstella[1]) > 0.2) {
  falhas.push(`o prompt nao esta em cima dela: ${JSON.stringify(grudado)}`);
}
if (!/estella/i.test(deColado)) falhas.push(`perto dela o prompt nao e o dela: "${deColado}"`);
if (!apresentacao.some((f) => /Estella/.test(f))) falhas.push('ela nao disse o nome dela');
if (!apresentacao.some((f) => /aprovar|costureira/i.test(f))) {
  falhas.push('a apresentacao nao diz que nada sai da loja sem ela aprovar');
}
if (!apresentacao.some((f) => /Cookie/i.test(f))) {
  falhas.push('ela nao contou que fez o uniforme do Cookie');
}
if (!apresentacao.some((f) => /xadrez|tabuleiro/i.test(f))) {
  falhas.push('ela nao falou do xadrez');
}
if (!brinde.doAri || !brinde.doRenan) {
  falhas.push(`o biscoitinho nao saiu para os dois: ${JSON.stringify(brinde)}`);
}
if (!mesinha) falhas.push('a mesinha de xadrez nao esta na calcada');
else if (mesinha.alto > 1.2) {
  falhas.push(`a mesinha de xadrez ficou alta demais e esconde a ovelha (${mesinha.alto})`);
}
if (!noDiario.includes('estella-da-lojinha')) falhas.push('ela nao entrou no diario');
for (const [onde, barrado] of Object.entries(calcada)) {
  const temQueBarrar = onde.startsWith('emCima');
  if (barrado !== temQueBarrar) {
    falhas.push(temQueBarrar
      ? `da para andar por dentro da peca: ${onde}`
      : `tem parede invisivel na calcada: ${onde}`);
  }
}
if (!opcoes.some((t) => /xadrez/i.test(t ?? ''))) {
  falhas.push(`falar com ela nao oferece a partida: ${JSON.stringify(opcoes)}`);
}
if (!falaSolta.length) falhas.push('o "so um oi" nao devolveu fala nenhuma dela');
if (encarando && Math.abs(encarando.giro - (nasceu?.giro ?? 0)) < 0.1) {
  falhas.push(`ela nao virou para quem chegou (giro ${encarando.giro})`);
}
if (desvirou && Math.abs(desvirou.giro - Math.PI / 2) > 0.25) {
  falhas.push(`ela ficou torta depois que a dupla foi embora: giro ${desvirou.giro}`);
}
if (longeDoPosto.length) falhas.push(`ela saiu do posto: ${JSON.stringify(longeDoPosto[0])}`);
if (balidos < 1) falhas.push('ela nao baliu sozinha nenhuma vez');
falhas.push(...erros);

console.log('1. no posto:', JSON.stringify(nasceu), '· tapando:', JSON.stringify(tapando));
console.log('2. prompt grudado:', JSON.stringify(grudado));
console.log('3. prompt de perto:', JSON.stringify(deColado));
console.log('   apresentacao:', JSON.stringify(apresentacao));
console.log('   giro: nasceu', nasceu?.giro, '· encarando', encarando?.giro, '· desvirou', desvirou?.giro);
console.log('3b. escolhas ao falar com ela:', JSON.stringify(opcoes), '·', JSON.stringify(falaSolta));
console.log('4b. calcada:', JSON.stringify(calcada));
console.log('4. brinde:', JSON.stringify(brinde), '· mesinha:', JSON.stringify(mesinha));
console.log('   diario:', JSON.stringify(noDiario.filter((i) => /estella|loj/i.test(i))));
console.log('5. pontos fora do posto:', longeDoPosto.length, 'de', trilha.length, '· balidos:', balidos);

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
