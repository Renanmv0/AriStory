/**
 * O minigame de ping pong, jogado de verdade.
 *
 * O teste move o mouse perseguindo a bolinha (é o que a pessoa faz), lê o
 * estado da partida quadro a quadro e confere: a câmera vira perspectiva, o
 * placar aparece, os pontos sobem, a partida fecha em 5 e — se o jogador
 * ganhar — o chapéu aparece na cabeça dele e a memória entra no diário.
 *
 * Uso: node scripts/pingpong.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './pingpong';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const LARG = 900;
const ALT = 620;
const page = await browser.newPage({ viewport: { width: LARG, height: ALT } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// bem ao lado da mesa de ping pong
await page.goto(`${BASE}/?cena=villa-lobos&em=-14.5,26&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

/** estado do minigame, lido de dentro da cena pela posição da bolinha */
const estado = () =>
  page.evaluate(() => {
    const jogo = window.jogo;
    const p = window.__ping;
    // a altura da mesa é amostrada aqui junto, e não numa segunda chamada: em
    // headless o jogo roda em câmera lenta e cada ida ao browser custa quadro
    // só enquanto a partida corre: encerrada, a mesa volta a ser um
    // interativo normal e pode respirar de novo à vontade
    const emJogo = p && p.fase !== 'parado' && p.fase !== 'fim';
    if (window.__mesa && emJogo) window.__balanco.push(window.__mesa.position.y);
    return {
      perspectiva: jogo.camOmbro !== null,
      placar: document.querySelector('.placar')?.classList.contains('show') ?? false,
      fase: p?.fase ?? 'sem-partida',
      meus: p?.meus ?? -1,
      dele: p?.dele ?? -1,
      bola: p ? [p.bola.position.x, p.bola.position.y, p.bola.position.z] : null,
      chapeu: jogo.player.rig.campeao,
    };
  });

// a cena guarda a partida numa variável local; para o teste enxergar, ela é
// publicada em window.__ping pelo próprio jogo em modo de depuração
await page.evaluate(() => {
  const achar = () => {
    const mundo = window.jogo.current?.world?.root;
    if (!mundo) return null;
    let achado = null;
    mundo.traverse((o) => {
      if (!achado && o.userData?.pingpong) achado = o.userData.pingpong;
    });
    return achado;
  };
  window.__ping = achar();
});

/*
 * A MESA PERGUNTA ANTES DE COMEÇAR, e o teste prova as duas respostas.
 *
 * Ela tem 2,6 de raio e ganha de tudo na arena, então é o prompt de quase
 * todo lugar por ali — quem ia ver o quadro ou trocar de raquete esbarrava
 * nela e caía direto numa partida de cinco pontos, que não tem como
 * abandonar no meio.
 *
 * O `E` escolheria a PRIMEIRA opção sozinho, e um teste que só aperta `E`
 * passaria por aqui sem nunca saber que existe uma pergunta. Por isso ele
 * clica no botão pelo nome: primeiro no "agora não" (que não pode começar
 * nada), depois no "bora".
 */
await page.keyboard.press('KeyE');
const escolhas = page.locator('.dialogue .escolhas.show button');
let perguntou = false;
for (let i = 0; i < 12 && !perguntou; i++) {
  await page.waitForTimeout(300);
  perguntou = (await escolhas.count()) > 0;
}
const rotulos = perguntou ? await escolhas.allTextContents() : [];
if (perguntou) {
  const nao = rotulos.findIndex((r) => /agora não|agora nao/i.test(r));
  await escolhas.nth(nao >= 0 ? nao : rotulos.length - 1).click();
  await page.waitForTimeout(1200);
}
const recusou = await page.evaluate(
  () => (window.__ping?.fase ?? 'parado') === 'parado' && window.jogo.camOmbro === null,
);

// e agora de novo, dizendo que sim
await page.keyboard.press('KeyE');
for (let i = 0; i < 12; i++) {
  await page.waitForTimeout(300);
  if (await escolhas.count()) {
    const sim = (await escolhas.allTextContents()).findIndex((r) => /bora/i.test(r));
    await escolhas.nth(sim >= 0 ? sim : 0).click();
    break;
  }
}
for (let i = 0; i < 4; i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
}
await page.waitForTimeout(1200);
await page.evaluate(() => {
  const mundo = window.jogo.current?.world?.root;
  let achado = null;
  mundo.traverse((o) => {
    if (!achado && o.userData?.pingpong) achado = o.userData.pingpong;
  });
  window.__ping = achado;
});

// espiona o motivo de cada ponto: é o que prova que as regras de quique estão
// valendo, e não "quem isolou a bola ganha"
await page.evaluate(() => {
  window.__motivos = [];
  const p = window.__ping;
  const antes = p.onPonto;
  p.onPonto = (meu, motivo) => {
    window.__motivos.push(`${meu ? 'eu' : 'ele'}: ${motivo}`);
    antes?.(meu, motivo);
  };
  // e a mesa não pode balançar durante a partida
  window.__balanco = [];
  const mundo = window.jogo.current.world.root;
  let mesa = null;
  mundo.traverse((o) => {
    if (!mesa && o.userData?.pingpong) mesa = o;
  });
  window.__mesa = mesa;
});

const comecou = await estado();
await page.screenshot({ path: `${OUT}-mesa.png` });

// joga: o mouse persegue o Z da bolinha, que é o que a mão faz
const inicio = Date.now();
let ultimo = comecou;
// Uma partida até 5 leva tempo: o headless roda o jogo a ~7 fps, então cada
// ponto disputado custa dezenas de segundos de relógio. O orçamento é generoso
// de propósito — o laço sai sozinho assim que a partida fecha.
while (Date.now() - inicio < 600000) {
  const e = await estado();
  ultimo = e;
  // 'parado' = a partida acabou e o minigame se recolheu
  if (e.fase === 'fim' || e.fase === 'parado' || e.fase === 'sem-partida') break;
  if (e.bola) {
    // z local da bolinha (-0.8..0.8) → x da tela; a raquete segue
    const alvo = Math.max(-1, Math.min(1, e.bola[2] / 0.82));
    await page.mouse.move(LARG / 2 + (alvo * LARG) / 2.2, ALT * 0.62);
  }
  if (e.meus + e.dele === 1 && e.fase === 'jogando') {
    await page.screenshot({ path: `${OUT}-jogando.png` });
  }
  await page.waitForTimeout(60);
}

// avança a conversa final — e SÓ enquanto houver balão aberto, senão o E
// dispara a interação da mesa de novo e começa uma revanche no meio do teste
await page.waitForTimeout(1200);
for (let i = 0; i < 10; i++) {
  const falando = await page.locator('.dialogue.show').count();
  if (!falando) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
await page.waitForTimeout(900);
const fim = await estado();
await page.screenshot({ path: `${OUT}-fim.png` });

/*
 * O CHAPÉU VIROU ITEM: ele aparece na cabeça se, e só se, estiver numa vaga
 * de acessório. E sai de lá por UM caminho só.
 *
 * Arrastar peça vestida para a mochila é RECUSADO — roupa cosmética não ocupa
 * vaga de mão, que é a regra que o `vestimenta.mjs` guarda. Este teste cobrava
 * o contrário (era o comportamento de antes da reforma do guarda-roupa) e
 * reprovava numa coisa que está certa. Agora ele mede as duas metades: o
 * arrasto não leva o chapéu nem o tira da cabeça, e o descarte tira.
 */
const premio = await page.evaluate(() => {
  const j = window.jogo;
  const quem = j.playerId();
  const vestindo = j.wearables(quem).map((i) => i?.id ?? null);
  const slot = vestindo.indexOf('chapeu-ping-pong');
  if (slot < 0) return { vestindo, slot, naCabecaAntes: j.player.rig.campeao, arrastou: null };
  const naCabecaAntes = j.player.rig.campeao;
  const vaga = j.handItems(quem).findIndex((x) => x === null);
  const arrastou = j.moveItem({ lista: 'vestivel', indice: slot }, { lista: 'mao', indice: vaga }, quem);
  return { vestindo, slot, naCabecaAntes, vaga, arrastou };
});
await page.waitForTimeout(700);
const naCabecaAposArrasto = await page.evaluate(() => window.jogo.player.rig.campeao);

// e agora pelo caminho de verdade: o descarte
await page.evaluate(() => window.jogo.removeItem('chapeu-ping-pong', window.jogo.playerId()));
await page.waitForTimeout(700);
const naCabecaDepois = await page.evaluate(() => window.jogo.player.rig.campeao);
await page.screenshot({ path: `${OUT}-sem-chapeu.png` });

const save = await page.evaluate(() => {
  try {
    return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  } catch {
    return {};
  }
});

const motivos = await page.evaluate(() => window.__motivos ?? []);
const balanco = await page.evaluate(() => {
  const b = window.__balanco ?? [];
  return b.length ? Math.max(...b) - Math.min(...b) : -1;
});

console.log('a mesa perguntou antes:', perguntou, '·', JSON.stringify(rotulos));
console.log('  e "agora não" nao comecou partida nenhuma:', recusou);
console.log('motivos dos pontos:', motivos.join(' | ') || '(nenhum)');
console.log('balanço da mesa durante a partida:', balanco.toFixed(4), '(tem que ser 0)');
console.log('perspectiva ligada ao começar:', comecou.perspectiva);
console.log('placar na tela:', comecou.placar);
console.log('placar final:', `${ultimo.meus} × ${ultimo.dele}`, '· fase', ultimo.fase);
console.log('voltou para a isométrica:', !fim.perspectiva);
console.log('chapéu na cabeça:', fim.chapeu);
console.log('acessórios do vencedor:', JSON.stringify(premio.vestindo));
console.log('o chapéu na cabeça:', premio.naCabecaAntes,
  '· arrastar pra mochila:', premio.arrastou, '(tem que ser false)',
  '· continua na cabeça:', naCabecaAposArrasto);
console.log('  e depois do descarte:', naCabecaDepois, '(tem que ser false)');
console.log('memórias:', (save.memories ?? []).map((m) => m.id).join(', ') || '(nenhuma)');
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ganhou = ultimo.meus >= 5;
const ok =
  !erros.length &&
  // a confirmação da mesa: ela existe, e recusar não começa nada
  perguntou && recusou &&
  comecou.perspectiva &&
  comecou.placar &&
  balanco === 0 &&
  Math.max(ultimo.meus, ultimo.dele) === 5 &&
  !fim.perspectiva &&
  // o prêmio só é cobrado quando o jogador de fato ganhou
  (!ganhou ||
    (fim.chapeu &&
      premio.vestindo.includes('chapeu-ping-pong') &&
      // arrastar para a mochila é recusado, e ele NÃO sai da cabeça por isso
      premio.arrastou === false &&
      naCabecaAposArrasto === true &&
      // descartado, some da cabeça na hora
      naCabecaDepois === false &&
      (save.memories ?? []).some((m) => m.id === 'memoria-ping-pong')));

await browser.close();
process.exit(ok ? 0 : 1);
