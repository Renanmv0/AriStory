/**
 * O REGADOR, e o ritual que abre o minigame do jardim.
 *
 * Duas coisas moram aqui, e as duas são o mesmo pedido do Renan: que a estufa
 * continue sendo um lugar onde se anda normalmente, e que o minigame comece
 * porque o jogador FOI PEGAR O REGADOR e regou as plantas.
 *
 * ================================================================= A PEÇA
 *
 * O regador é a única peça do jogo que MUDA DE CARA enquanto se joga
 * (`docs/MINIGAME-JARDIM.md` §6): cada carta que melhora ele mexe no modelo da
 * mão. Por isso ele não é uma peça e sim uma receita, e por isso este teste
 * monta várias versões e mede cada uma:
 *
 * - TODAS pousam em `y = 0` e cabem na mão (o contrato do kit);
 * - CADA MELHORIA MUDA A PEÇA DE VERDADE — bico mais longo cresce, tanque
 *   maior engorda, crivo aberto alarga. É barato escrever uma carta que não
 *   mexe em nada, e impossível notar isso olhando uma foto só;
 * - OS TRÊS ESTÁGIOS SÃO DIFERENTES ENTRE SI. Se a lata emprestada e a de
 *   competição renderizam igual, a recompensa da rodada não existe.
 *
 * =============================================================== O RITUAL
 *
 * E a corrente inteira, que é o que o jogador vai viver:
 *
 *   regador na bancada → pegar → aparece NA MÃO → regar três canteiros
 *     → a Josefina entra pela porta → ela conta das pragas → fica a flag
 *
 * O que este teste guarda: que dá para regar SEM o regador (não dá, e o jogo
 * diz onde ele está), que o mesmo canteiro não conta duas vezes, e que a
 * Josefina não aparece antes da terceira rega nem deixa de aparecer nela.
 *
 * Uso: node scripts/regador.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './regador';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** onde as versões são enfileiradas para o retrato: o terreiro, que é plano */
const FILA = { x: -6, z: -1.5, passo: 1.5 };

/** as versões que entram na fila, e o que cada uma prova */
const VERSOES = [
  ['lata', {}],
  ['latao', { estagio: 1 }],
  ['competicao', { estagio: 2 }],
  ['bico-longo', { bico: 1 }],
  ['tanque-cheio', { tanque: 1 }],
  ['crivo-aberto', { crivo: 1 }],
  // as cartas SÓ DO REGADOR que mexem na peça
  ['crivo-de-flor', { crivoDeFlor: 1 }],
  ['alca-acolchoada', { alcaAcolchoada: true }],
  ['cabo-acolchoado', { alcaAcolchoada: true, caboDeMadeira: true }],
  ['tudo', {
    estagio: 2, bico: 1, crivo: 1, tanque: 1, ponteira: true,
    caboDeMadeira: true, segundoBico: true, mangueira: true, respiro: true, nuvem: true,
    crivoDeFlor: 1, alcaAcolchoada: true,
  }],
];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const problemas = [];

await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(500, 440);
await page.waitForTimeout(400);

/* =================================================================== A PEÇA */

/**
 * Monta cada versão e mede pela GEOMETRIA DESENHADA — os oito cantos da caixa
 * de cada malha levados para o mundo. Medir por raio inventado já deixou passar
 * verde dois defeitos que estavam na tela, nas pragas.
 */
const medidas = await page.evaluate(([versoes, x0, z0, passo]) => {
  const w = window.jogo.current.world;
  const fabrica = window.aristoryRegador;
  /**
   * A NUVEM DA CARTA "CHUVA" FICA DE FORA DA MEDIDA.
   *
   * Ela flutua um palmo ACIMA do regador de propósito — é o único enfeite que
   * não toca a peça, porque a lendária tem que se anunciar de longe. Contá-la
   * no tamanho reprovava o regador completo por "não caber na mão", quando o
   * que não cabia era o céu em volta dele.
   */
  const daNuvem = (c) => {
    for (let p = c; p; p = p.parent) if (p.userData?.parte === 'nuvem') return true;
    return false;
  };
  const medir = (o) => {
    o.updateWorldMatrix(true, true);
    const b = { minx: 1e9, maxx: -1e9, miny: 1e9, maxy: -1e9, minz: 1e9, maxz: -1e9 };
    o.traverse((c) => {
      if (!c.isMesh || !c.geometry || daNuvem(c)) return;
      if (!c.geometry.boundingBox) c.geometry.computeBoundingBox();
      const bb = c.geometry.boundingBox;
      const e = c.matrixWorld.elements;
      for (const vx of [bb.min.x, bb.max.x]) {
        for (const vy of [bb.min.y, bb.max.y]) {
          for (const vz of [bb.min.z, bb.max.z]) {
            const X = e[0] * vx + e[4] * vy + e[8] * vz + e[12];
            const Y = e[1] * vx + e[5] * vy + e[9] * vz + e[13];
            const Z = e[2] * vx + e[6] * vy + e[10] * vz + e[14];
            b.minx = Math.min(b.minx, X); b.maxx = Math.max(b.maxx, X);
            b.miny = Math.min(b.miny, Y); b.maxy = Math.max(b.maxy, Y);
            b.minz = Math.min(b.minz, Z); b.maxz = Math.max(b.maxz, Z);
          }
        }
      }
    });
    return b;
  };

  return versoes.map(([nome, estilo], i) => {
    const x = x0 + i * passo;
    const peca = w.add(w.place(fabrica(estilo), x, 0, z0));
    (window.__regadores ??= {})[nome] = peca;
    const b = medir(peca);
    const cores = new Set();
    let malhas = 0;
    peca.traverse((c) => {
      if (!c.isMesh) return;
      malhas += 1;
      if (c.material?.color) cores.add(c.material.color.getHexString());
    });
    return {
      nome, x, malhas,
      cores: [...cores].sort().join(','),
      pousa: +b.miny.toFixed(3),
      altura: +(b.maxy - b.miny).toFixed(3),
      largura: +(b.maxx - b.minx).toFixed(3),
      comprimento: +(b.maxz - b.minz).toFixed(3),
    };
  });
}, [VERSOES, FILA.x, FILA.z, FILA.passo]);

for (const m of medidas) {
  console.log(
    `${m.nome.padEnd(13)} ${String(m.malhas).padStart(3)} malhas · ` +
    `alt ${m.altura} · larg ${m.largura} · comp ${m.comprimento} · pousa em ${m.pousa}`,
  );
}

const v = (nome) => medidas.find((m) => m.nome === nome);

for (const m of medidas) {
  // o contrato do kit: base no chão
  if (Math.abs(m.pousa) > 0.02) problemas.push(`"${m.nome}" não pousa no chão (${m.pousa})`);
  // e uma peça de mão não pode ter tamanho de móvel
  // o completo tem bico esticado E um segundo bico atrás: 1,05 de ponta a ponta
  if (m.altura > 0.8 || m.comprimento > 1.1) {
    problemas.push(`"${m.nome}" ficou grande demais para a mão (${m.altura} x ${m.comprimento})`);
  }
  // ela fica na mão de DOIS personagens ao mesmo tempo, o tempo todo
  if (m.malhas > 46) problemas.push(`"${m.nome}" tem ${m.malhas} malhas (teto: 46)`);
}

/**
 * CADA MELHORIA TEM QUE MUDAR A PEÇA.
 *
 * É a regra do §6 do plano — "carta que mexe no regador mexe na peça da mão" —
 * e é o tipo de coisa que se quebra sem perceber ao mexer numa fórmula: o
 * número muda, o modelo não, e ninguém nota até alguém reclamar que o upgrade
 * "não fez nada".
 */
const base = v('lata');
if (v('bico-longo').comprimento <= base.comprimento + 0.08) {
  problemas.push('"Bico mais longo" não esticou o bico de verdade');
}
if (v('tanque-cheio').largura <= base.largura + 0.03) {
  problemas.push('"Tanque maior" não engordou o corpo');
}
/**
 * O CRIVO CRESCE NO EIXO DO BICO, e não na largura da peça.
 *
 * A primeira asserção olhava a altura e a largura, e as duas não mudam: o
 * crivo é um disco na ponta de um bico inclinado, e mesmo dobrado de raio ele
 * continua mais estreito que o corpo da lata. O que cresce é o comprimento —
 * e o número de furos, que é o desenho do "leque aberto".
 */
const aberto = v('crivo-aberto');
if (aberto.comprimento <= base.comprimento || aberto.malhas <= base.malhas) {
  problemas.push('"Leque aberto" não alargou o crivo nem abriu furos novos');
}
// o Crivo de flor abre cinco pétalas em volta do crivo, e a Alça acolchoada
// põe a espuma na alça (a do arco e a do cabo de madeira do Braço solto)
if (v('crivo-de-flor').malhas < base.malhas + 5) problemas.push('"Crivo de flor" não abriu as pétalas');
if (v('alca-acolchoada').malhas !== base.malhas + 1) problemas.push('"Alça acolchoada" não pôs a espuma na alça');
const cabo = medidas.find((m) => m.nome === 'cabo-acolchoado');
if (!cabo || !/ff8c7a/.test(cabo.cores)) problemas.push('a espuma não aparece no cabo de madeira do Braço solto');
if (v('tudo').malhas <= base.malhas + 6) {
  problemas.push('a versão com todas as cartas não ganhou peça nenhuma');
}
// e os três estágios têm que ser distinguíveis: a recompensa da rodada é visual
const paletas = new Set(['lata', 'latao', 'competicao'].map((n) => v(n).cores));
if (paletas.size !== 3) problemas.push('os três estágios do regador têm a mesma paleta');

// ------------------------------------------------------------------- fotos
await page.evaluate(() => window.jogo.debugPlace(0, 9, 0));
await page.waitForTimeout(500);
const enquadrar = async (nome, zoom) => {
  await page.evaluate(([n, z]) => {
    window.jogo.focusCamera(n ? window.__regadores[n] : null);
    window.jogo.setZoom(z);
  }, [nome, zoom]);
  await page.waitForTimeout(1200);
};
await enquadrar('bico-longo', 8);
await page.screenshot({ path: `${OUT}-fila.png` });
for (const nome of ['lata', 'competicao', 'crivo-de-flor', 'alca-acolchoada', 'tudo']) {
  await enquadrar(nome, 1.5);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
}
await page.evaluate(() => {
  window.jogo.focusCamera(null);
  for (const o of Object.values(window.__regadores)) o.visible = false;
});

/* ================================================================= O RITUAL */

const prompt = async () =>
  (await page.locator('.prompt.show').count())
    ? await page.locator('.prompt .label').textContent()
    : '';

/**
 * ESPERA O BALÃO ABRIR antes de tentar vencê-lo.
 *
 * `venceAFala` desiste assim que não vê diálogo na tela, e a cutscene da
 * Josefina começa com ela ANDANDO: são uns quatro segundos de tartaruga
 * atravessando a porta antes da primeira fala. Sem esta espera o teste lia
 * "nenhuma fala", e depois reprovava a flag e o destravamento — três falhas,
 * todas pela mesma pressa.
 *
 * O limite é generoso (40 s de relógio de parede) porque o relógio de JOGO no
 * Chromium sem tela anda bem mais devagar que o real: os quatro segundos de
 * caminhada da Josefina podem levar três vezes isso aqui dentro.
 */
const esperarFala = async (segundos = 40) => {
  for (let i = 0; i < segundos * 2; i++) {
    if (await page.locator('.dialogue.show').count()) return true;
    await page.waitForTimeout(500);
  }
  return false;
};

const venceAFala = async (limite = 40) => {
  const ditas = [];
  for (let i = 0; i < limite; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 2 && ditas[ditas.length - 1] !== t) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(560);
  }
  return ditas;
};

/** o que a cena publicou: é dali que saem as coordenadas, nunca da cabeça */
const pontos = await page.evaluate(() => window.jogo.current.world.root.userData.pontosDoJardim);

const encostarEm = async (x, z, dx, dz) => {
  await page.evaluate(
    ([px, pz, f]) => window.jogo.debugPlace(px, pz, f),
    [x + dx, z + dz, Math.atan2(-dx, -dz)],
  );
  await page.waitForTimeout(900);
};

const naMao = () =>
  page.evaluate(() => window.jogo.getActiveHandItem()?.id ?? null);

// ---------------------------------------- 1. regar sem o regador não vai
const primeiro = pontos.canteiros[1];
await encostarEm(primeiro.x, primeiro.z, 0, -2.4);
const rotuloSemLata = await prompt();
if (!/regar/i.test(rotuloSemLata ?? '')) {
  problemas.push(`o canteiro não oferece "Regar" (li "${rotuloSemLata}")`);
}
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
const semLata = (await venceAFala()).join(' ');
if (!/regador/i.test(semLata)) {
  problemas.push('regar de mãos vazias não diz onde está o regador');
}
if (await naMao()) problemas.push('alguém já estava com item na mão antes de pegar nada');

// ------------------------------------------------ 2. pegar o regador
await encostarEm(pontos.oficina.x, pontos.oficina.z + 1.8, 1.3, 0);
let rotulo = await prompt();
if (!/pegar o regador/i.test(rotulo ?? '')) {
  // a bancada e o regador dividem vizinhança; tenta o outro lado antes de falhar
  await encostarEm(pontos.oficina.x, pontos.oficina.z + 1.8, 1.3, 1.0);
  rotulo = await prompt();
}
if (!/pegar o regador/i.test(rotulo ?? '')) {
  problemas.push(`não achei "Pegar o regador" ao lado da bancada (li "${rotulo}")`);
}
await page.keyboard.press('KeyE');
await page.waitForTimeout(700);
await venceAFala();

if ((await naMao()) !== 'regador') {
  problemas.push('o regador não foi parar na mão depois de pegar');
}

/**
 * ELE APARECE NA MÃO, e PENDURADO PELA ALÇA.
 *
 * O gesto é o pedido do Renan, e ele é medível: a mão segura a barra da alça e
 * a lata pende dela. Na primeira versão a peça nascia com a BASE na mão e
 * ficava equilibrada em cima do punho como uma bandeja — e "está na mão" era
 * verdade nas duas, então a asserção antiga (só a altura do ponto de preensão)
 * passaria verde no gesto errado.
 *
 * O que separa os dois é onde a peça está EM RELAÇÃO ao ponto da mão: pendurada,
 * o corpo dela fica abaixo; apoiada, acima. E ela não pode raspar no chão, que
 * é o preço de pendurar num boneco de braço curto.
 */
const naMaoMedido = await page.evaluate(() => {
  let achado = null;
  window.jogo.player.object.traverse((o) => {
    if (!achado && o.userData?.item === 'regador') achado = o;
  });
  if (!achado) return { existe: false };
  achado.updateWorldMatrix(true, true);
  // o ponto da MÃO: o grupo do item nasce nela, então é a translação dele
  const mao = achado.matrixWorld.elements[13];
  let alto = -1e9;
  let baixo = 1e9;
  achado.traverse((c) => {
    if (!c.isMesh || !c.geometry) return;
    if (!c.geometry.boundingBox) c.geometry.computeBoundingBox();
    const bb = c.geometry.boundingBox;
    const e = c.matrixWorld.elements;
    for (const vx of [bb.min.x, bb.max.x]) {
      for (const vy of [bb.min.y, bb.max.y]) {
        for (const vz of [bb.min.z, bb.max.z]) {
          const Y = e[1] * vx + e[5] * vy + e[9] * vz + e[13];
          alto = Math.max(alto, Y);
          baixo = Math.min(baixo, Y);
        }
      }
    }
  });
  return { existe: true, mao: +mao.toFixed(2), alto: +alto.toFixed(2), baixo: +baixo.toFixed(2) };
});
if (!naMaoMedido.existe) {
  problemas.push('o regador não apareceu na mão do personagem');
} else {
  const { mao, alto, baixo } = naMaoMedido;
  console.log(`na mão: pega em ${mao} · topo ${alto} · base ${baixo}`);
  // PENDURADO: o corpo da lata fica abaixo do ponto da mão
  if (baixo > mao - 0.12) {
    problemas.push(`o regador não pende da mão (pega em ${mao}, base em ${baixo})`);
  }
  // e a ALÇA, que é o que a mão segura, fica na altura da mão
  if (Math.abs(alto - mao) > 0.1) {
    problemas.push(`a alça não está na mão (pega em ${mao}, topo da peça em ${alto})`);
  }
  // sem raspar no chão: braço curto de boneco chibi mais lata comprida
  if (baixo < 0.16) problemas.push(`o regador raspa no chão (base em ${baixo})`);
  // e sem virar mochila: a mão não pode estar na altura do ombro
  if (mao > 0.9) problemas.push(`a mão está alta demais para carregar pendurado (${mao})`);
}

await page.evaluate(() => window.jogo.setZoom(4.5));
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}-na-mao.png` });
await page.evaluate(() => window.jogo.setZoom(11));

// ------------------------------------------------ 3. regar três canteiros
const flag = (nome) => page.evaluate((f) => window.jogo.flag(f), nome);
const regadas = () => page.evaluate(() => window.jogo.stat('estufa.regadas'));

const regar = async (i) => {
  const c = pontos.canteiros[i];
  // os das laterais se aborda pelo lado de dentro; os da frente, por baixo
  const [dx, dz] = Math.abs(c.x) > 11 ? [-Math.sign(c.x) * 2.3, 0] : [0, -2.4];
  await encostarEm(c.x, c.z, dx, dz);
  const r = await prompt();
  if (!/regar/i.test(r ?? '')) return `sem prompt de regar no canteiro ${i} (li "${r}")`;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
  return null;
};

const falha1 = await regar(1);
if (falha1) problemas.push(falha1);
await venceAFala();
if ((await regadas()) !== 1) problemas.push('a primeira rega não contou');

// o MESMO canteiro de novo: não pode contar duas vezes
await encostarEm(pontos.canteiros[1].x, pontos.canteiros[1].z, 0, -2.4);
if (/regar/i.test((await prompt()) ?? '')) {
  problemas.push('o canteiro já regado continua oferecendo "Regar"');
}

const falha2 = await regar(2);
if (falha2) problemas.push(falha2);
await venceAFala();
if (await flag('jardim.convite')) {
  problemas.push('a Josefina apareceu antes da terceira rega');
}

const falha3 = await regar(5);
if (falha3) problemas.push(falha3);
// ela entra andando: a fala só começa depois de a tartaruga cruzar a porta
if (!(await esperarFala())) problemas.push('a Josefina não chegou a falar nada');
await page.screenshot({ path: `${OUT}-josefina.png` });
const cutscene = (await venceAFala(60)).join(' ');
await page.waitForTimeout(2200);

if (!/pinça|pula|portões|portao|portões/i.test(cutscene)) {
  problemas.push('a Josefina não falou das pragas na cutscene');
}
if (!/água|agua/i.test(cutscene)) {
  problemas.push('a Josefina não disse que a arma é água');
}
if (!(await flag('jardim.convite'))) {
  problemas.push('a terceira rega não deixou a flag do convite');
}
if ((await regadas()) !== 3) {
  problemas.push(`contei ${await regadas()} regas, e deviam ser 3`);
}
if ((await naMao()) !== 'regador') {
  problemas.push('o regador sumiu da mão durante a cutscene');
}

/**
 * E O JOGADOR VOLTA A ANDAR DEPOIS DELA.
 *
 * Anda ATÉ SAIR DO LUGAR, com teto, e não por um tempo fixo: travado anda 0,00,
 * e é só isso que a asserção precisa separar. A versão de 900 ms reprovava uma
 * dupla livre que andou 0,20 numa máquina carregada — o relógio de jogo do
 * Chromium sem tela depende de quanta máquina sobra.
 */
const antes = await page.evaluate(() => window.jogo.playerPosition());
let andou = 0;
await page.keyboard.down('KeyW');
for (let i = 0; i < 20 && andou < 0.4; i++) {
  await page.waitForTimeout(300);
  const agora = await page.evaluate(() => window.jogo.playerPosition());
  andou = Math.hypot(agora.x - antes.x, agora.z - antes.z);
}
await page.keyboard.up('KeyW');
if (andou < 0.4) problemas.push(`ninguém destravou depois da cutscene (andou ${andou.toFixed(2)} em 6 s)`);

await page.screenshot({ path: `${OUT}-depois.png` });

// ------------------------------------------------------------------ relatório
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
process.exit(0);
