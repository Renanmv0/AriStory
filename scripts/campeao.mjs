/**
 * O PRÊMIO DO CAMPEÃO — a festa da mesa de piquenique.
 *
 * O que este teste guarda:
 *
 * - **A META COBRA AS DUAS ETAPAS.** Ganhar de todos não basta: enquanto
 *   houver prêmio pendurado no quadro, o card fica fechado. É a metade que um
 *   teste esquece, e uma condição frouxa liberaria a festa cedo demais.
 * - **O CARD CONTA O QUE FALTA.** Meta escondida não convida ninguém a jogar,
 *   então o estado fechado mostra os dois placares.
 * - **A FESTA JUNTA OS QUATRO NA MESA.** Eles chegam ANDANDO, cada um do seu
 *   posto, e no fim voltam todos para ele — bicho que fica de serviço para
 *   sempre nunca mais passeia.
 * - **O PRÊMIO É O TRIO.** Quatrocentos na carteira, a raquete dourada no
 *   suporte e a foto de grupo pregada no quadro.
 * - **ACONTECE UMA VEZ.** Reabrir o quadro depois mostra a foto, e não o
 *   convite de novo.
 *
 * Uso: node scripts/campeao.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './campeao';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** onde a tábua mora, copiado de `villaLobos.ts` */
const QUADRO = { x: -12.4, z: 20.6 };
/** e a mesa de piquenique, que é onde a festa acontece */
const PIQUENIQUE = { x: -8.6, z: 18.4 };

/** os quatro prêmios, por dono — a mesma lista de `PREMIOS_DA_ARENA` */
const PECAS = {
  'jean-luc': ['jaqueta-jean-luc'],
  cookie: ['quepe-cookie'],
  mano: ['patins-mano'],
  estella: ['blazer-xadrez', 'calca-xadrez', 'coroa-dama', 'bota-xadrez'],
};

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 980, height: 900 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=${QUADRO.x},${QUADRO.z + 1.2}&zoom=10`,
  { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

/*
 * O estado de quem já jogou com todo mundo, escrito direto e com RELOAD — as
 * partidas de verdade são de `duelo.mjs` e `quadro.mjs`, e o Jean-Luc só nasce
 * na arena para quem já o conhece, o que é lido na montagem da cena.
 */
await page.evaluate(() => {
  const j = window.jogo;
  for (const f of [
    'jean-luc-conhecido', 'jean-luc-batido', 'mano-conhecido', 'estella-conhecida',
    'cookie-apresentado',
    'batido-jean-luc', 'batido-cookie', 'batido-mano', 'batido-estella',
  ]) j.setFlag(f);
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

/** leva a dupla até o quadro e abre o painel, esperando ele de fato abrir */
const abrirQuadro = async () => {
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, 0), [QUADRO.x, QUADRO.z + 1.1]);
  for (let i = 0; i < 16; i++) {
    if (await page.evaluate(
      () => document.querySelector('.quadro-de-inscricoes')?.classList.contains('show') ?? false,
    )) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(800);
  return page.evaluate(() => {
    const card = document.querySelector('.quadro-de-inscricoes .campeao');
    if (!card) return { achou: false };
    const foto = card.querySelector('canvas');
    let cor = null;
    if (foto) {
      const ctx = foto.getContext('2d');
      const d = ctx.getImageData(Math.floor(foto.width / 2), Math.floor(foto.height / 2), 1, 1).data;
      cor = `${d[0]},${d[1]},${d[2]},${d[3]}`;
    }
    return {
      achou: true,
      aberto: document.querySelector('.quadro-de-inscricoes')?.classList.contains('show') ?? false,
      estado: ['fechado', 'aberto', 'pego'].find((c) => card.classList.contains(c)) ?? '?',
      texto: (card.textContent ?? '').replace(/\s+/g, ' ').trim(),
      temFoto: !!foto,
      corDaFoto: cor,
    };
  });
};

const fechar = async () => {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
};

// ====================== 1. ganhou de todos, mas não pegou os prêmios
const semPegarNada = await abrirQuadro();
await page.screenshot({ path: `${OUT}-fechado.png` });
await fechar();

// ====================== 2. pega três dos quatro: ainda falta
await page.evaluate((mapa) => {
  const j = window.jogo;
  for (const id of ['jean-luc', 'cookie', 'mano']) {
    for (const peca of mapa[id]) {
      j.save.registrarPremio(peca);
      for (const quem of ['ari', 'renan']) j.storeItem(window.aristoryItens[peca], quem);
    }
  }
}, PECAS);
await page.waitForTimeout(500);
const faltandoUm = await abrirQuadro();
await fechar();

// ====================== 3. pega o quarto: a festa abre
await page.evaluate((mapa) => {
  const j = window.jogo;
  for (const peca of mapa.estella) {
    j.save.registrarPremio(peca);
    for (const quem of ['ari', 'renan']) j.storeItem(window.aristoryItens[peca], quem);
  }
}, PECAS);
await page.waitForTimeout(500);
const liberado = await abrirQuadro();
await page.screenshot({ path: `${OUT}-aberto.png` });

const carteiraAntes = await page.evaluate(() => window.jogo.carteira());

// ====================== 4. a festa
await page.locator('.quadro-de-inscricoes .campeao').click();
await page.waitForTimeout(1200);

/** a cutscene acabou? o balão some nas esperas de câmera, o travamento não */
const ocupado = async () =>
  (await page.locator('.dialogue.show').count()) > 0
  || (await page.evaluate(() => window.jogo.player.locked === true));

const falas = [];
let juntos = null;
for (let i = 0; i < 400; i++) {
  await page.waitForTimeout(300);
  if (!(await ocupado())) break;
  if (await page.locator('.dialogue.show').count()) {
    const t = (await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '';
    if (t && t.length > 2 && falas[falas.length - 1] !== t) falas.push(t);
    await page.keyboard.press('KeyE');
  }
  // a foto do momento em que os quatro estão em volta da mesa
  if (juntos === null) {
    const perto = await page.evaluate((mesa) => {
      const onde = {};
      window.jogo.current.world.root.traverse((n) => {
        if (n.userData?.peca) onde[n.userData.peca] = n.position;
      });
      return ['jean-luc', 'cookie', 'mano', 'estella'].map((id) => {
        const p = onde[id];
        return p ? +Math.hypot(p.x - mesa.x, p.z - mesa.z).toFixed(2) : null;
      });
    }, PIQUENIQUE);
    if (perto.every((d) => d !== null && d < 2.6)) {
      juntos = perto;
      await page.screenshot({ path: `${OUT}-festa.png` });
    }
  }
}
await page.waitForTimeout(1500);

const depois = await page.evaluate(() => {
  const j = window.jogo;
  const onde = {};
  j.current.world.root.traverse((n) => {
    if (n.userData?.peca) onde[n.userData.peca] = [+n.position.x.toFixed(2), +n.position.z.toFixed(2)];
  });
  return {
    carteira: j.carteira(),
    campeao: j.flag('campeao-da-arena'),
    raquete: j.flag('raquete-dourada'),
    travado: j.player.locked === true,
    ombro: j.camOmbro !== null,
    postos: onde,
    memorias: JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}')
      .memories?.map((m) => m.id) ?? [],
  };
});

// ====================== 5. o quadro agora mostra a foto
const comFoto = await abrirQuadro();
await page.screenshot({ path: `${OUT}-foto.png` });
await fechar();

// ====================== 6. a raquete dourada está no suporte
/*
 * O SUPORTE É PROCURADO NA CENA, e não por uma coordenada escrita aqui.
 *
 * Copiar a posição para o teste é o jeito garantido de mirar no lugar errado
 * no dia em que a arena andar meio metro — e foi o que aconteceu: o teste
 * ficou parado a seis unidades dele esperando um prompt que estava do outro
 * lado. E o ponto dele tem `priority: -1` (a mesa e o quadro ganham de perto),
 * então não basta chegar: é preciso dar a volta até o prompt ser o dele.
 */
const noSuporte = await page.evaluate(() => {
  let suporte = null;
  window.jogo.current.world.root.traverse((n) => {
    if (n.userData?.peca === 'suporte-de-raquetes') suporte = n;
  });
  return {
    achouSuporte: !!suporte,
    onde: suporte ? [+suporte.position.x.toFixed(2), +suporte.position.z.toFixed(2)] : null,
  };
});
let opcoes = [];
let achouOPrompt = false;
if (noSuporte.onde) {
  const voltas = [[0, 1.2], [0, -1.2], [1.2, 0], [-1.2, 0],
    [0.9, 0.9], [-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9]];
  for (const [dx, dz] of voltas) {
    await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, 0),
      [noSuporte.onde[0] + dx, noSuporte.onde[1] + dz]);
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(300);
      const visivel = await page.locator('.prompt.show').count();
      const rotulo = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
      if (visivel && /raquete/i.test(rotulo)) { achouOPrompt = true; break; }
    }
    if (achouOPrompt) break;
  }
}
await page.keyboard.press('KeyE');
for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(300);
  const botoes = page.locator('.dialogue .escolhas.show button');
  if (await botoes.count()) {
    opcoes = await botoes.allTextContents();
    const ouro = opcoes.findIndex((r) => /dourada/i.test(r));
    await botoes.nth(ouro >= 0 ? ouro : 0).click();
    break;
  }
  await page.keyboard.press('KeyE');
}
await page.waitForTimeout(1500);
const raqueteEscolhida = await page.evaluate(() => {
  const j = window.jogo;
  let mesa = null;
  j.current.world.root.traverse((n) => { if (n.userData?.pingpong) mesa = n; });
  const cores = [];
  mesa?.userData.pingpong.minhaRaquete.traverse((n) => {
    if (n.isMesh) cores.push('#' + n.material.color.getHexString());
  });
  return { flag: j.flag('ping-raquete-dourada'), naPartida: [...new Set(cores)] };
});

// ------------------------------------------------------------- veredito
const falhas = [];
if (!semPegarNada.achou) falhas.push('o card do campeao nao existe no quadro');
if (semPegarNada.estado !== 'fechado') {
  falhas.push(`ganhou de todos sem pegar premio e o card ja abriu: ${semPegarNada.estado}`);
}
if (!/4 de 4/.test(semPegarNada.texto) || !/0 de 4/.test(semPegarNada.texto)) {
  falhas.push(`o card fechado nao conta o que falta: "${semPegarNada.texto}"`);
}
if (faltandoUm.estado !== 'fechado') {
  falhas.push(`com um premio pendurado o card abriu: ${faltandoUm.estado}`);
}
if (liberado.estado !== 'aberto') {
  falhas.push(`com tudo feito o card nao abriu: ${liberado.estado}`);
}
if (falas.length < 20) falhas.push(`a festa foi curta demais: ${falas.length} falas`);
if (!juntos) falhas.push('os quatro nunca ficaram juntos em volta da mesa');
if (depois.carteira - carteiraAntes !== 400) {
  falhas.push(`a vaquinha rendeu ${depois.carteira - carteiraAntes}, esperado 400`);
}
if (!depois.campeao) falhas.push('a flag do campeao nao foi gravada');
if (!depois.raquete) falhas.push('a raquete dourada nao foi liberada');
if (depois.travado) falhas.push('a festa devolveu a dupla travada');
if (depois.ombro) falhas.push('a camera de ombro ficou ligada');
if (!depois.memorias.includes('campeao-da-arena')) {
  falhas.push(`a memoria da festa nao entrou: ${JSON.stringify(depois.memorias)}`);
}
// todos voltaram para o posto: nenhum pode ter ficado na mesa de piquenique
for (const [id, p] of Object.entries(depois.postos)) {
  if (!['jean-luc', 'cookie', 'mano', 'estella'].includes(id)) continue;
  if (Math.hypot(p[0] - PIQUENIQUE.x, p[1] - PIQUENIQUE.z) < 3) {
    falhas.push(`${id} ficou na mesa de piquenique depois da festa: ${JSON.stringify(p)}`);
  }
}
if (comFoto.estado !== 'pego') falhas.push(`depois da festa o card e "${comFoto.estado}"`);
if (!comFoto.temFoto) falhas.push('o card virou "pego" sem a foto de grupo');
if (comFoto.corDaFoto) {
  const [, , , a] = comFoto.corDaFoto.split(',').map(Number);
  if (a < 200) falhas.push(`a foto de grupo saiu em branco (${comFoto.corDaFoto})`);
}
if (!achouOPrompt) falhas.push(`nao achei o prompt do suporte em ${JSON.stringify(noSuporte.onde)}`);
if (!opcoes.some((o) => /dourada/i.test(o))) {
  falhas.push(`a dourada nao entrou no suporte: ${JSON.stringify(opcoes)}`);
}
if (!raqueteEscolhida.flag) falhas.push('escolher a dourada nao gravou a flag');
if (!raqueteEscolhida.naPartida.includes('#e0b33f')) {
  falhas.push(`a raquete da PARTIDA nao ficou dourada: ${JSON.stringify(raqueteEscolhida.naPartida)}`);
}
falhas.push(...erros);

console.log('1. sem pegar nada:', JSON.stringify(semPegarNada.estado), '·', semPegarNada.texto);
console.log('2. faltando um premio:', JSON.stringify(faltandoUm.estado), '·', faltandoUm.texto);
console.log('3. tudo feito:', JSON.stringify(liberado.estado));
console.log('4. a festa:', falas.length, 'falas · os quatro na mesa a', JSON.stringify(juntos));
console.log('   primeiras:', JSON.stringify(falas.slice(0, 3)));
console.log('   carteira:', carteiraAntes, '→', depois.carteira,
  '· raquete dourada:', depois.raquete);
console.log('   postos depois:', JSON.stringify(depois.postos));
console.log('5. o card virou:', comFoto.estado, '· foto:', comFoto.temFoto,
  '· cor no meio:', comFoto.corDaFoto);
console.log('6. suporte em', JSON.stringify(noSuporte.onde), '· prompt:', achouOPrompt);
console.log('   opções:', JSON.stringify(opcoes), '·', JSON.stringify(raqueteEscolhida));

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
