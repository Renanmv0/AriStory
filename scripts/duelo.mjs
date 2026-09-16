/**
 * A PARTIDA CONTRA O JEAN-LUC, jogada de verdade.
 *
 * O que este teste guarda:
 *
 * - **ELE CABE NA MESA.** O pato tem 66 cm e o tampo tem 76: sem o caixote ele
 *   joga a partida inteira escondido atrás da própria mesa, com a boina
 *   aparecendo por cima. O teste mede a altura da cabeça dele contra o tampo.
 * - **É ELE QUE ESTÁ JOGANDO.** A raquete do outro lado é a vermelha dele (e
 *   não a azul do parceiro), e o placar da tela diz "Jean-Luc" — contra o pato
 *   ele dizia o nome de quem estava assistindo da beira.
 * - **O PARCEIRO VIRA TORCIDA**, e não desaparece: `são sempre dois em cena`
 *   continua valendo. Ele fica fora do lado de saque, na beira.
 * - **A MESA É DEVOLVIDA.** Caixote escondido, pato no chão e passeando de
 *   novo, prompts de volta: cutscene que esquece de devolver deixa o jogo
 *   quebrado para o resto da sessão.
 * - **O PRÊMIO É REAL.** Bater ele põe o Jean-Luc na lista de adversários da
 *   mesa — a partir daí o prompt de jogar PERGUNTA contra quem, e é essa
 *   pergunta a primeira linha do painel de adversários.
 *
 * A VITÓRIA É FORÇADA pondo o placar em 4 antes do último ponto, e o ponto que
 * decide é disputado de verdade. Sem isso o teste dependeria de ganhar cinco
 * pontos seguidos de um adversário que foi feito para ser difícil — e um teste
 * que falha por azar não é um teste.
 *
 * Uso: node scripts/duelo.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './duelo';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const LARG = 1000;
const ALT = 700;
/** altura do tampo da mesa, de `MESA_PING` */
const TAMPO = 0.76;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: LARG, height: ALT } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-14.5,26.4&zoom=11`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

/** os punhados de coisa que o teste lê de dentro da cena */
const ferramentas = () =>
  page.evaluate(() => {
    let mesa = null;
    window.jogo.current.world.root.traverse((n) => {
      if (n.userData?.pingpong) mesa = n;
    });
    window.__mesa = mesa;
    window.__ping = mesa.userData.pingpong;
    window.__jl = mesa.userData.jeanLuc.bicho;
    // o caixote é a única peça `caixote` da cena
    let cx = null;
    window.jogo.current.world.root.traverse((n) => {
      if (n.userData?.peca === 'caixote') cx = n;
    });
    window.__caixote = cx;
  });
await ferramentas();

/** drena o diálogo aberto, devolvendo as falas */
const drenar = async (voltas = 40) => {
  const ditas = [];
  for (let i = 0; i < voltas; i++) {
    if (!(await page.locator('.dialogue.show').count())) break;
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 3 && !ditas.includes(t)) ditas.push(t);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(380);
  }
  return ditas;
};

// ============================================ 1. a chegada dele (o pré-requisito)
await page.evaluate(() => {
  for (let i = 0; i < 5; i++) window.jogo.save.bump('pingpong.vitorias');
  window.__chegou = false;
  void window.__mesa.userData.jeanLuc.chegar().then(() => { window.__chegou = true; });
});
/*
 * A CHEGADA É ESPERADA ATÉ TERMINAR, e o teto é largo.
 *
 * A cutscene tem vinte falas E uma travessia do lago até a arena; no headless
 * (o jogo roda a ~7 fps) ela passa fácil de um minuto. Com um teto curto o
 * teste seguia EM CIMA da cutscene: a dupla ainda travada, o prompt do pato
 * ainda desligado, e as falhas que apareciam eram todas dessa corrida.
 */
let chegou = false;
for (let i = 0; i < 300; i++) {
  chegou = await page.evaluate(() => window.__chegou);
  if (chegou) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
}

// ============================================ 2. convidar para a partida
/**
 * ELE É ESTACIONADO ANTES, num canto do tablado longe da mesa.
 *
 * O pato passeia, e o círculo da mesa tem 2,6 de raio com prioridade 1: parado
 * perto dela, o prompt que aparece é "jogar ping pong" e o teste nunca chega a
 * falar com ele. Este canto está a 4,8 da mesa — fora do alcance dela e dentro
 * do 1,5 dele.
 */
await page.evaluate(async () => {
  window.__jl.entrarEmServico();
  await window.__jl.irPara(-18.3, 26.6, 1.8);
});
await page.waitForTimeout(600);
// e o que sobrou do diálogo da chegada sai daqui, senão ele conta como fala da partida
await (async () => {
  for (let i = 0; i < 12; i++) {
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(350);
  }
})();
await page.evaluate(() => window.jogo.debugPlace(-18.3, 27.5, 0));
/*
 * O prompt é lido POR CONDIÇÃO. O balão guarda o último texto enquanto está
 * escondido, então uma leitura logo depois de teleportar devolve o rótulo da
 * mesa — que era onde a dupla estava um quadro antes.
 */
let promptDele = '';
for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(300);
  promptDele = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
  if (/Jean-Luc/.test(promptDele)) break;
}
await page.keyboard.press('KeyE');
await page.waitForTimeout(700);
/**
 * AVANÇA ATÉ A PERGUNTA, esperando ANTES de insistir no `E`.
 *
 * A primeira versão pressionava `E` de 400 em 400 ms e às vezes o mesmo toque
 * que revelava a escolha já a confirmava — o teste então via `perguntou:
 * false` numa partida que tinha começado normalmente. Agora cada toque é
 * seguido de até dois segundos de espera OLHANDO o painel: só se ele não
 * aparecer é que vem o toque seguinte.
 */
let perguntou = false;
for (let volta = 0; volta < 10 && !perguntou; volta++) {
  for (let i = 0; i < 8 && !perguntou; i++) {
    perguntou = (await page.locator('.dialogue .escolhas.show button').count()) > 0;
    if (!perguntou) await page.waitForTimeout(250);
  }
  if (!perguntou) await page.keyboard.press('KeyE');
}
const opcoes = await page.locator('.dialogue .escolhas button').allTextContents().catch(() => []);
if (perguntou) await page.locator('.dialogue .escolhas button').first().click(); // "Allez!"
await page.waitForTimeout(900);
const antesDaPartida = await drenar();
/**
 * ESPERA A PARTIDA COMEÇAR POR CONDIÇÃO, e nunca pelo relógio.
 *
 * Entre o "Allez!" e o saque o pato ATRAVESSA o tablado até o lado dele — seis
 * metros a 1,6, que no headless (o jogo roda a ~7 fps) viram vinte segundos de
 * relógio de parede. A primeira versão media a mesa 1,8 s depois e encontrava
 * tudo desmontado: era o teste chegando cedo, não o jogo chegando tarde.
 */
let comecou = false;
for (let i = 0; i < 200; i++) {
  comecou = await page.evaluate(() => window.__ping.fase !== 'parado');
  if (comecou) break;
  await page.waitForTimeout(400);
}
await page.waitForTimeout(600);

// ============================================ 3. a mesa montada
const montagem = await page.evaluate((tampo) => {
  const p = window.__ping;
  const jl = window.__jl;
  // a cor da borracha da raquete do outro lado
  const disco = p.raqueteDele.children.find((c) => c.geometry?.type === 'CylinderGeometry'
    && c.geometry.parameters.radiusTop === 0.17);
  const parceiro = window.jogo.parceiro.position;
  const mesa = window.__mesa.position;
  return {
    fase: p.fase,
    adversario: p.adversario?.id ?? null,
    corDaRaquete: disco ? `#${disco.material.color.getHexString()}` : null,
    caixote: window.__caixote.visible,
    caixoteAoLado: +Math.hypot(window.__caixote.position.x - jl.x,
      window.__caixote.position.z - jl.z).toFixed(2),
    patoY: +jl.altura.toFixed(2),
    // a cabeça dele tem ~0,66 acima da base: passa do tampo?
    cabecaAcimaDoTampo: +(jl.altura + 0.66 - tampo).toFixed(2),
    placar: document.querySelector('.placar')?.textContent ?? '',
    // o parceiro NÃO pode estar no lado de saque do pato
    parceiroDaMesa: +Math.hypot(parceiro.x - mesa.x, parceiro.z - mesa.z).toFixed(2),
    parceiroDoPato: +Math.hypot(parceiro.x - jl.x, parceiro.z - jl.z).toFixed(2),
  };
}, TAMPO);
await page.screenshot({ path: `${OUT}-mesa.png` });

// ============================================ 4. jogar o ponto que decide
/**
 * O placar vai a 4 × 0 e o último ponto é disputado de verdade: o mouse
 * persegue o `z` da bolinha, que é o que a mão faz.
 */
await page.evaluate(() => {
  window.__ping.meus = 4;
  window.__ping.dele = 0;
});
const inicio = Date.now();
let tiros = 0;
while (Date.now() - inicio < 420000) {
  const e = await page.evaluate(() => {
    const p = window.__ping;
    return {
      fase: p.fase, meus: p.meus, dele: p.dele,
      bola: [p.bola.position.x, p.bola.position.y, p.bola.position.z],
    };
  });
  if (e.fase === 'fim' || e.fase === 'parado') break;
  // se ele empatar o ponto que decide, devolve o placar e disputa de novo:
  // o teste mede o PRÊMIO, e o adversário foi feito para ser difícil
  if (e.dele > 0) {
    await page.evaluate(() => { window.__ping.meus = 4; window.__ping.dele = 0; });
    tiros += 1;
    if (tiros > 30) break;
  }
  const alvo = Math.max(-1, Math.min(1, e.bola[2] / 0.82));
  await page.mouse.move(LARG / 2 + (alvo * LARG) / 2.2, ALT * 0.62);
  if (e.meus + e.dele > 0 && e.fase === 'jogando') {
    await page.screenshot({ path: `${OUT}-jogando.png` });
  }
  await page.waitForTimeout(60);
}
await page.waitForTimeout(1200);
const falasDoFim = await drenar();
await page.waitForTimeout(1200);

// ============================================ 5. a mesa devolvida, e o prêmio
const depois = await page.evaluate(() => {
  const jl = window.__jl;
  return {
    caixote: window.__caixote.visible,
    patoY: +jl.altura.toFixed(2),
    travado: window.jogo.player.locked === true,
    ombro: window.jogo.camOmbro !== null,
    corpoVisivel: window.jogo.player.visible !== false,
    batido: window.jogo.flag('jean-luc-batido'),
    memorias: JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}')
      .memories?.map((m) => m.id) ?? [],
  };
});

// ele volta a passear?
const trilha = await page.evaluate(async () => {
  const jl = window.__jl;
  let soma = 0;
  let ax = jl.x;
  let az = jl.z;
  for (let i = 0; i < 70; i++) {
    await new Promise((r) => setTimeout(r, 120));
    soma += Math.hypot(jl.x - ax, jl.z - az);
    ax = jl.x;
    az = jl.z;
  }
  return +soma.toFixed(2);
});

// ============================================ 6. a mesa agora pergunta
await page.evaluate(() => {
  const m = window.__mesa.position;
  window.jogo.debugPlace(m.x, m.z + 1.5, 0);
});
await page.waitForTimeout(800);
const promptDaMesa = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const escolhaDaMesa = await page.locator('.dialogue .escolhas button').allTextContents().catch(() => []);
await page.screenshot({ path: `${OUT}-lista.png` });

// ============================================ 7. veredito
const falhas = [];
if (!chegou) falhas.push('a cutscene de chegada nunca terminou');
if (!/Jean-Luc/.test(promptDele)) falhas.push(`nao da para abordar o pato: "${promptDele}"`);
if (!perguntou) falhas.push('ele nunca ofereceu a partida');
if (!opcoes.some((o) => /allez/i.test(o))) falhas.push(`a oferta nao tem o "Allez!": ${JSON.stringify(opcoes)}`);
if (!comecou) falhas.push('a partida nunca comecou (90 s de espera)');
if (antesDaPartida.length < 3) falhas.push(`a conversa antes da partida nao saiu: ${antesDaPartida.length}`);

if (montagem.adversario !== 'jean-luc') falhas.push(`quem entrou na mesa foi "${montagem.adversario}"`);
if (montagem.corDaRaquete !== '#e0243c') {
  falhas.push(`a raquete do outro lado nao e a dele: ${montagem.corDaRaquete}`);
}
if (!montagem.caixote) falhas.push('o caixote nao apareceu');
if (montagem.caixoteAoLado > 0.3) falhas.push(`o caixote nao esta sob ele: ${montagem.caixoteAoLado}`);
if (montagem.cabecaAcimaDoTampo < 0.25) {
  falhas.push(`ele nao passa do tampo: a cabeca sobra ${montagem.cabecaAcimaDoTampo}`);
}
if (!/Jean-Luc/.test(montagem.placar)) falhas.push(`o placar nao diz o nome dele: "${montagem.placar}"`);
if (montagem.parceiroDoPato < 1.5) {
  falhas.push(`o parceiro ficou em cima do pato: ${montagem.parceiroDoPato}`);
}

if (depois.caixote) falhas.push('o caixote ficou na cena depois da partida');
if (Math.abs(depois.patoY) > 0.02) falhas.push(`o pato ficou flutuando: y = ${depois.patoY}`);
if (depois.travado) falhas.push('a partida devolveu a dupla travada');
if (depois.ombro) falhas.push('a camera de ombro ficou ligada');
if (!depois.corpoVisivel) falhas.push('o corpo de quem jogou nao voltou');
if (trilha < 0.6) falhas.push(`o pato nao voltou a passear: andou ${trilha} em ~8 s`);

if (!depois.batido) falhas.push('a vitoria nao gravou a flag `jean-luc-batido`');
if (!depois.memorias.includes('jean-luc-batido')) {
  falhas.push(`a memoria do duelo nao entrou: ${JSON.stringify(depois.memorias)}`);
}
if (falasDoFim.length < 4) falhas.push(`a conversa do fim nao saiu: ${JSON.stringify(falasDoFim)}`);
if (!/ping pong/i.test(promptDaMesa)) falhas.push(`a mesa perdeu o prompt: "${promptDaMesa}"`);
if (!escolhaDaMesa.some((o) => /jean-luc/i.test(o))) {
  falhas.push(`a mesa nao lista o Jean-Luc: ${JSON.stringify(escolhaDaMesa)}`);
}
if (escolhaDaMesa.length !== 2) {
  falhas.push(`a lista de adversarios tem ${escolhaDaMesa.length} nomes, esperado 2`);
}
falhas.push(...erros);

console.log('1. convite:', JSON.stringify(promptDele), '·', JSON.stringify(opcoes));
for (const f of antesDaPartida.slice(0, 3)) console.log('   ·', f);
console.log('2. mesa montada:', JSON.stringify(montagem));
console.log('   pontos que ele tomou antes de eu fechar:', tiros);
console.log('3. fim:', JSON.stringify(falasDoFim.slice(0, 3)));
console.log('4. devolvida:', JSON.stringify(depois), '· passeio', trilha);
console.log('5. lista da mesa:', JSON.stringify(escolhaDaMesa));

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
