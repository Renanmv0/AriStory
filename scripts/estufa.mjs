/**
 * A estufa da Josefina — a área nova no fundo do jardim do clube.
 *
 * Ela é a etapa 0 do plano de `docs/MINIGAME-JARDIM.md`: a área foi construída
 * antes da quest e antes de qualquer mecânica. Este teste guarda as três coisas
 * que o minigame vai cobrar dela depois, e que são fáceis de perder numa mexida
 * de decoração:
 *
 * - A PORTA ABRE NOS DOIS SENTIDOS. Do jardim do clube para a estufa e de volta,
 *   e quem volta cai na frente da porta, no eixo do caminho de pedrinha — não do
 *   outro lado do clube;
 * - O TERREIRO DO MEIO ESTÁ VAZIO. Nenhum colisor dentro do retângulo central.
 *   É a arena: survivor sem espaço para correr não é survivor, e basta alguém
 *   pôr "um vasinho no meio pra quebrar" para o jogo inteiro ficar pior;
 * - OS OITO CANTEIROS ESTÃO NA BEIRADA e AS QUATRO BOCAS ESTÃO LIVRES. Os
 *   canteiros são o que se defende; as bocas são por onde os bichos entram.
 *
 * Mais o de sempre: a oficina (bancada, tonel, regador) existe, os arcos estão
 * de pé, e o console não reclama.
 *
 * Uso: node scripts/estufa.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './estufa';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com a cena `estufa` */
const TERREIRO = { x: 0, z: -1.5, largura: 16, profundidade: 13 };
/** e com o `PORTOES` dela: os tres vaos do fundo, por onde os bichos entram */
const PORTOES = [-8.5, 0, 8.5];
/** a parede do fundo, e o pátio jogável que fica atrás dela */
const FUNDO = -11;
const PATIO_FUNDO = -25;
/** a largura da brecha que a sebe do fundo abre no fim de cada caminho */
const BRECHA = 3.2;
/** e com o `ESTUFA` da cena do clube */
const PORTA_NO_JARDIM = { x: 25.6, z: -20.9 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 880 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);

/**
 * A ESTUFA NASCE TRANCADA, e quem abre é a quest do adubo
 * (`scripts/adubo.mjs` percorre ela inteira). Este teste é sobre o LUGAR, e
 * não sobre a chave: ele levanta a flag e recarrega.
 *
 * A recarga não é opcional — a porta é decidida na hora em que a cena é
 * montada, e escrever a flag com o clube já de pé não acorda ninguém.
 */
await page.evaluate(() => window.jogo.setFlag('adubo-entregue'));
await page.waitForTimeout(600);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(500, 440);
await page.waitForTimeout(400);

const cena = () => page.evaluate(() => window.jogo.current.def.id);
const onde = () =>
  page.evaluate(() => [
    +window.jogo.player.position.x.toFixed(2),
    +window.jogo.player.position.z.toFixed(2),
  ]);
const prompt = async () =>
  (await page.locator('.prompt.show').count())
    ? await page.locator('.prompt .label').textContent()
    : '';

// ================================================= 1. entrar pela porta nova
await page.evaluate(
  ([x, z]) => window.jogo.debugPlace(x, z + 1.0, Math.PI),
  [PORTA_NO_JARDIM.x, PORTA_NO_JARDIM.z],
);
await page.waitForTimeout(1200);
const promptDeEntrada = await prompt();
await page.screenshot({ path: `${OUT}-porta.png` });
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const cenaDepoisDeEntrar = await cena();
const chegada = await onde();

// ================================================ 2. o que tem lá dentro
const dentro = await page.evaluate(() => {
  const pecas = {};
  const canteiros = [];
  window.jogo.scene.traverse((o) => {
    const p = o.userData?.peca;
    if (!p) return;
    pecas[p] = (pecas[p] ?? 0) + 1;
    if (p === 'canteiro-de-horta') {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      canteiros.push({ x: +e[12].toFixed(2), z: +e[14].toFixed(2), planta: o.userData.planta });
    }
  });
  return {
    pecas,
    canteiros,
    especies: [...new Set(canteiros.map((c) => c.planta))].sort(),
    colisores: window.jogo.current.world.colliders.map((c) =>
      c.kind === 'circle'
        ? { kind: 'circle', x: +c.x.toFixed(2), z: +c.z.toFixed(2), r: +c.r.toFixed(2) }
        : {
            kind: 'box', x: +c.x.toFixed(2), z: +c.z.toFixed(2),
            hw: +c.hw.toFixed(2), hd: +c.hd.toFixed(2), rot: +c.rot.toFixed(3),
          },
    ),
    pontos: window.jogo.current.world.root.userData.pontosDoJardim ?? null,

    /**
     * A PEGADA DESENHADA de cada canteiro e de cada enfeite solto.
     *
     * Medir colisor não basta, e isso já escapou duas vezes: a moita tem 1,3
     * de largura e 0,42 de colisor, então ela debruça no canteiro com o centro
     * do colisor bem longe dele. Aqui a caixa sai da GEOMETRIA — os oito
     * cantos da bounding box de cada malha, levados para o mundo.
     */
    pegadas: (() => {
      const medir = (o) => {
        o.updateWorldMatrix(true, true);
        let minx = 1e9, maxx = -1e9, minz = 1e9, maxz = -1e9;
        o.traverse((c) => {
          if (!c.isMesh || !c.geometry) return;
          if (!c.geometry.boundingBox) c.geometry.computeBoundingBox();
          const bb = c.geometry.boundingBox;
          const e = c.matrixWorld.elements;
          for (const vx of [bb.min.x, bb.max.x]) {
            for (const vy of [bb.min.y, bb.max.y]) {
              for (const vz of [bb.min.z, bb.max.z]) {
                const X = e[0] * vx + e[4] * vy + e[8] * vz + e[12];
                const Z = e[2] * vx + e[6] * vy + e[10] * vz + e[14];
                minx = Math.min(minx, X); maxx = Math.max(maxx, X);
                minz = Math.min(minz, Z); maxz = Math.max(maxz, Z);
              }
            }
          }
        });
        return minx > 1e8 ? null : { minx, maxx, minz, maxz };
      };
      const raiz = window.jogo.current.world.root;
      const canteiros = [];
      const soltos = [];
      raiz.traverse((o) => {
        if (o.userData?.peca === 'canteiro-de-horta') {
          const m = medir(o);
          if (m) canteiros.push(m);
        }
      });
      for (const o of raiz.children) {
        if (!o.isGroup || o.userData?.peca) continue;
        const m = medir(o);
        if (m) soltos.push(m);
      }
      return { canteiros, soltos };
    })(),

    /**
     * OS INTERATIVOS, com a peça que cada um destaca.
     *
     * `highlight` diz A QUE OBJETO a interação se refere. Se o prompt está
     * longe dele, alguém moveu a peça e esqueceu o ponto — que foi exatamente
     * o que aconteceu quando o layout mudou por causa dos portões: a bancada e
     * o tonel trocaram de lado da estufa e os dois prompts ficaram parados.
     */
    interativos: window.jogo.current.world.interactables
      .filter((it) => it.highlight)
      .map((it) => {
        it.highlight.updateWorldMatrix(true, false);
        const e = it.highlight.matrixWorld.elements;
        return {
          id: it.id,
          ponto: [+it.x.toFixed(2), +it.z.toFixed(2)],
          alvo: [+e[12].toFixed(2), +e[14].toFixed(2)],
          raio: it.radius,
        };
      }),
  };
});

/**
 * NADA DESENHADO EM CIMA DE CANTEIRO — medido pela geometria.
 *
 * A versão anterior desta asserção comparava o CENTRO do colisor redondo com a
 * pegada do canteiro, e passou verde com duas moitas debruçadas nos canteiros
 * laterais: o colisor tem 0,42 e a moita desenhada tem 1,3. Agora as duas
 * caixas são as reais, e o que se mede é sobreposição de área.
 */
const invadeCanteiro = dentro.pegadas.soltos.filter((m) =>
  dentro.pegadas.canteiros.some((c) => {
    const sobreX = Math.min(m.maxx, c.maxx) - Math.max(m.minx, c.minx);
    const sobreZ = Math.min(m.maxz, c.maxz) - Math.max(m.minz, c.minz);
    return sobreX > 0.05 && sobreZ > 0.05;
  }),
).map((m) => [+((m.minx + m.maxx) / 2).toFixed(2), +((m.minz + m.maxz) / 2).toFixed(2)]);

/** e cada prompt tem que estar COLADO na peça que ele destaca */
const promptsSoltos = dentro.interativos.filter(
  (it) => Math.hypot(it.ponto[0] - it.alvo[0], it.ponto[1] - it.alvo[1]) > it.raio + 1.2,
);

/**
 * A CAIXA ENVOLVENTE DE UM COLISOR, no eixo do mundo.
 *
 * A primeira versão media caixa girada pelo raio (`hypot(hw, hd)`), e por isso
 * acusava as PAREDES de invadir o terreiro: uma parede de 30 de comprimento
 * vira um círculo de raio 15, que cobre a estufa inteira. Uma caixa girada por
 * `rot` tem meia-largura `|hw·cos| + |hd·sen|` em x e `|hw·sen| + |hd·cos|` em
 * z — é exato, e é o que separa parede de vaso.
 */
const envelope = (c) => {
  if (c.kind === 'circle') return { x: c.x, z: c.z, hx: c.r, hz: c.r };
  const cos = Math.abs(Math.cos(c.rot));
  const sen = Math.abs(Math.sin(c.rot));
  return { x: c.x, z: c.z, hx: c.hw * cos + c.hd * sen, hz: c.hw * sen + c.hd * cos };
};

/**
 * O terreiro vazio, medido e não olhado.
 *
 * Ele NÃO está mais centrado na origem: quando os três portões entraram, a
 * arena andou para o fundo (o campo de jogo é a faixa entre as portas e os
 * canteiros). Por isso a conta desconta o centro dele, e não o zero.
 */
const hx = TERREIRO.largura / 2;
const hz = TERREIRO.profundidade / 2;
const invadeOTerreiro = dentro.colisores.filter((c) => {
  const e = envelope(c);
  return Math.abs(e.x - TERREIRO.x) < hx + e.hx && Math.abs(e.z - TERREIRO.z) < hz + e.hz;
});

/**
 * AS TRÊS BRECHAS DA SEBE DO FUNDO, no fim de cada caminho de pedra.
 *
 * É por elas que o bicho entra no pátio, então elas têm que estar ABERTAS — e
 * o resto da linha do fundo tem que continuar FECHADO, senão o pátio deixa de
 * ser um beco e o bicho entra por qualquer lugar.
 *
 * A medida é feita na linha da sebe: para cada `x` amostrado ao longo do
 * fundo, o teste pergunta se existe colisor ali. No eixo de cada portão a
 * resposta tem que ser "não"; fora das brechas, "sim".
 */
const naLinhaDoFundo = (x) =>
  dentro.colisores.some((c) => {
    const e = envelope(c);
    return Math.abs(e.x - x) < e.hx && Math.abs(e.z - PATIO_FUNDO) < e.hz + 0.1;
  });
const brechasAbertas = PORTOES.filter((x) => !naLinhaDoFundo(x));
// e a sebe entre elas continua de pé: amostra no meio de cada trecho cheio
const trechosFechados = [-13, -4.25, 4.25, 13].filter(naLinhaDoFundo);

/** as bocas dos portões: nada a menos de 1,4 delas */
const bocas = dentro.pontos?.bocas ?? [];
const bocasEntupidas = bocas.filter((b) =>
  dentro.colisores.some((c) => {
    const e = envelope(c);
    const dx = Math.max(0, Math.abs(e.x - b.x) - e.hx);
    const dz = Math.max(0, Math.abs(e.z - b.z) - e.hz);
    return Math.hypot(dx, dz) < 1.4;
  }),
);

await page.screenshot({ path: `${OUT}-dentro.png` });

// ================================================ 3. andar até o fundo
/**
 * A travessia prova que o meio é andável de verdade, e não só livre de colisor
 * na conta: o jogo empurra quem esbarra.
 *
 * `W` sozinho anda na DIAGONAL (a câmera é isométrica: nenhuma tecla anda num
 * eixo só), então o teste mede DISTÂNCIA PERCORRIDA, e não o `z` final. E mede
 * por amostra: o Chromium sem tela roda o tempo de jogo bem mais devagar que o
 * relógio, e o que denuncia esbarrão é um trecho que não anda, não um total
 * pequeno.
 */
await page.evaluate(() => window.jogo.debugPlace(5.5, 4, Math.PI));
await page.waitForTimeout(700);
const trilha = [await onde()];
await page.keyboard.down('KeyW');
for (let i = 0; i < 9; i++) {
  await page.waitForTimeout(900);
  trilha.push(await onde());
}
await page.keyboard.up('KeyW');
await page.waitForTimeout(400);
const depoisDeAtravessar = await onde();
const trechos = trilha.slice(1).map((p, i) => +Math.hypot(p[0] - trilha[i][0], p[1] - trilha[i][1]).toFixed(2));
const andou = trechos.reduce((a, b) => a + b, 0);
/**
 * O ESBARRÃO SE MEDE CONTRA OS OUTROS TRECHOS, e não contra um número fixo.
 *
 * O relógio de jogo aqui depende de quanta máquina sobra: a mesma travessia
 * limpa já deu 1,3 por amostra com a máquina livre e 0,44 com outro navegador
 * rodando ao lado. Um limite absoluto reprova o teste por carga, que é
 * exatamente o tipo de falha que ensina a ignorar teste vermelho.
 *
 * Colisão tem outra assinatura: UM trecho quase parado no meio de trechos
 * normais. Comparar cada um com a mediana pega isso em qualquer velocidade.
 */
const ordenados = [...trechos].sort((a, b) => a - b);
const mediana = ordenados[Math.floor(ordenados.length / 2)];
const travados = trechos.filter((t) => t < mediana * 0.5);

/**
 * ================================ 3.5. OS TRÊS PORTÕES DEIXAM SAIR
 *
 * A asserção de que o minigame inteiro depende, e ela não se mede por folga
 * geométrica: mede-se ANDANDO. Uma pilastra ou uma soleira de alvenaria atravessada
 * no vão só aparece quando alguém tenta passar.
 *
 * Agora "passar" quer dizer SAIR: o pátio de trás é jogável (foi pedido do
 * Renan — interceptar o bicho lá fora enquanto vem pouco, recuar para dentro
 * quando vier muito), então atravessar o portão tem que levar a dupla para
 * `z < -11`, do outro lado da parede.
 */
const atravessou = [];
for (const x of PORTOES) {
  await page.evaluate(([px]) => window.jogo.debugPlace(px, -6.5, 0), [x]);
  await page.waitForTimeout(800);
  /**
   * `W` + `D` JUNTOS andam em `-Z` puro, e não `W` + `A`.
   *
   * Na câmera isométrica padrão nenhuma tecla anda num eixo do mundo sozinha.
   * A skill de cenário registra o par de ida (`D` + `S` para `+X`); daí sai o
   * resto por simetria, e `W` + `A` — que foi a primeira tentativa — anda em
   * `-X`. O teste acusou os três portões de não deixarem passar quando na
   * verdade a dupla estava andando de lado, paralela à parede.
   */
  /**
   * ANDA ATÉ SAIR, e não por um número fixo de passos.
   *
   * A primeira versão andava 16 amostras e exigia chegar a `z < -11,8`. Isso
   * mede DISTÂNCIA PERCORRIDA, que aqui depende de quanta máquina sobra: com
   * outro navegador rodando ao lado, dois dos três portões pararam em -11,2 e
   * -11,7 (ou seja, JÁ TINHAM SAÍDO) e o teste os reprovou mesmo assim.
   *
   * O que se quer provar é travessia, não velocidade: anda até cruzar a linha
   * da parede com folga, e desiste depois de um teto generoso de passos.
   */
  await page.keyboard.down('KeyW');
  await page.keyboard.down('KeyD');
  let fim = await onde();
  for (let i = 0; i < 24 && fim[1] > FUNDO - 2; i++) {
    await page.waitForTimeout(700);
    fim = await onde();
  }
  await page.keyboard.up('KeyD');
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(400);
  fim = await onde();
  atravessou.push({ portao: x, chegou: fim });
}

/**
 * ========================= 3.6. MAS NÃO DÁ PARA CONTORNAR A ESTUFA
 *
 * O pátio é um beco: sebe nos dois lados e no fundo, e a única ligação com a
 * estufa são os três portões. Era assim que a versão anterior falhava — o
 * gramado dava a volta no prédio e dava para voltar pela frente por fora.
 *
 * O teste põe a dupla lá fora, encosta ela na sebe de cada lado e confere que
 * ela não passa da quina da estufa.
 */
const tentouContornar = [];
for (const s of [-1, 1]) {
  await page.evaluate(([sx]) => window.jogo.debugPlace(sx * 12, -18, 0), [s]);
  await page.waitForTimeout(700);
  // S+D anda em +X; W+A anda em -X
  const teclas = s > 0 ? ['KeyS', 'KeyD'] : ['KeyW', 'KeyA'];
  for (const t of teclas) await page.keyboard.down(t);
  for (let i = 0; i < 10; i++) await page.waitForTimeout(700);
  for (const t of teclas) await page.keyboard.up(t);
  await page.waitForTimeout(400);
  tentouContornar.push({ lado: s, parou: await onde() });
}
await page.screenshot({ path: `${OUT}-portoes.png` });

// ================================================ 4. as conversas da cena
const conversar = async (x, z) => {
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
  await page.waitForTimeout(1200);
  const rotulo = await prompt();
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(900);
  const ditas = [];
  for (let i = 0; i < 14; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 8) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(650);
  }
  return { rotulo, ditas };
};

const naBancada = await conversar(-12.4, -4.6);
const noTonel = await conversar(-12.3, 4.4);
const noTerreiro = await conversar(0, 1.6);

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'estufa-da-josefina'),
);

// ================================================ 5. voltar pro jardim
await page.evaluate(() => window.jogo.debugPlace(0, 8.6, 0));
await page.waitForTimeout(1200);
const promptDeSaida = await prompt();
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const cenaDepoisDeSair = await cena();
const volta = await onde();
await page.screenshot({ path: `${OUT}-volta.png` });

// ------------------------------------------------------------------ relatório
console.log('1. prompt no jardim:', JSON.stringify(promptDeEntrada),
  '· cena:', cenaDepoisDeEntrar, '· chegou em', JSON.stringify(chegada));
console.log('2. peças:', JSON.stringify(dentro.pecas));
console.log('   canteiros:', dentro.canteiros.length,
  '· espécies:', JSON.stringify(dentro.especies));
console.log('   colisores:', dentro.colisores.length,
  '· invadindo o terreiro:', invadeOTerreiro.length,
  '· bocas entupidas:', bocasEntupidas.length);
console.log('   brechas abertas na sebe do fundo:', brechasAbertas.length,
  '· trechos de sebe de pé:', trechosFechados.length,
  '· enfeite em cima de canteiro:', invadeCanteiro.length,
  '· prompts soltos da peça:', promptsSoltos.length);
for (const a of atravessou) {
  console.log(`3.5 portão x=${a.portao} · saiu para`, JSON.stringify(a.chegou));
}
for (const c of tentouContornar) {
  console.log(`3.6 encostou na sebe do lado ${c.lado > 0 ? '+X' : '-X'} ·`, JSON.stringify(c.parou));
}
console.log('3. travessia do meio: (5.5, 4) →', JSON.stringify(depoisDeAtravessar),
  '· andou', andou.toFixed(2), '· mediana por amostra', mediana,
  '· trechos:', JSON.stringify(trechos));
console.log('4. bancada:', JSON.stringify(naBancada.rotulo));
for (const f of naBancada.ditas) console.log('   ', f);
console.log('   tonel:', JSON.stringify(noTonel.rotulo),
  '· terreiro:', JSON.stringify(noTerreiro.rotulo));
console.log('   memória no diário:', noDiario);
console.log('5. prompt de saída:', JSON.stringify(promptDeSaida),
  '· cena:', cenaDepoisDeSair, '· voltou em', JSON.stringify(volta));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!/estufa/i.test(promptDeEntrada ?? '')) problemas.push('a porta da estufa não acende no jardim');
if (cenaDepoisDeEntrar !== 'estufa') problemas.push(`entrar levou para "${cenaDepoisDeEntrar}"`);
if (Math.abs(chegada[0]) > 1 || chegada[1] < 6) {
  problemas.push(`quem entra não cai na frente da porta (${chegada})`);
}
if (dentro.canteiros.length !== 8) {
  problemas.push(`a estufa tem ${dentro.canteiros.length} canteiros, e não 8`);
}
if (dentro.especies.length < 5) {
  problemas.push(`só ${dentro.especies.length} espécies — a estufa é o jardim GRANDE`);
}
// nenhum canteiro pode estar no meio: eles são a beirada que se defende
if (dentro.canteiros.some((c) => Math.abs(c.x) < hx && Math.abs(c.z) < hz)) {
  problemas.push('tem canteiro dentro do terreiro');
}
if (invadeOTerreiro.length) {
  problemas.push(`${invadeOTerreiro.length} colisor(es) dentro do terreiro: ` +
    JSON.stringify(invadeOTerreiro.slice(0, 4)));
}
if (bocas.length !== 3) problemas.push(`a cena publica ${bocas.length} bocas, e não as 3 dos portões`);
if (bocas.some((b) => b.z > -8)) {
  problemas.push('as bocas saíram da parede do fundo: ' + JSON.stringify(bocas));
}
// e o portão tem que deixar SAIR de verdade, andando
for (const a of atravessou) {
  // "saiu" = o corpo inteiro passou do plano da parede (que tem 9 cm de
  // espessura). Portão bloqueado pararia a dupla ~meio metro ANTES dela.
  if (a.chegou[1] > FUNDO - 1) {
    problemas.push(`o portão x=${a.portao} não deixa sair (parou em z=${a.chegou[1]})`);
  }
  if (a.chegou[1] < PATIO_FUNDO) {
    problemas.push(`o pátio não tem fundo: saiu para z=${a.chegou[1]}`);
  }
}
// ... e o pátio não pode dar a volta no prédio
for (const c of tentouContornar) {
  if (Math.abs(c.parou[0]) > 14.6) {
    problemas.push(`dá para contornar a estufa pelo lado ${c.lado > 0 ? '+X' : '-X'} (x=${c.parou[0]})`);
  }
  if (c.parou[1] > FUNDO) {
    problemas.push(`dá para voltar pela frente por fora (z=${c.parou[1]})`);
  }
}
// o pátio precisa estar publicado para o minigame achar os pontos de entrada
if ((dentro.pontos?.entradas ?? []).length !== 3) {
  problemas.push('a cena não publica os três pontos de entrada do pátio');
}
// as entradas ficam do lado de FORA da sebe: bicho que nasce dentro do pátio
// não dá tempo de ser interceptado, que é a jogada inteira
if ((dentro.pontos?.entradas ?? []).some((e) => e.z > PATIO_FUNDO)) {
  problemas.push('os bichos nasceriam DENTRO do pátio: ' + JSON.stringify(dentro.pontos.entradas));
}
// as três brechas abertas...
if (brechasAbertas.length !== 3) {
  problemas.push(`só ${brechasAbertas.length} das 3 brechas da sebe estão abertas`);
}
// ... e a sebe entre elas de pé, senão o pátio deixa de ser um beco
if (trechosFechados.length !== 4) {
  problemas.push(`a sebe do fundo tem buraco: só ${trechosFechados.length} de 4 trechos fechados`);
}
if (BRECHA < 2.4) problemas.push('a brecha ficou estreita demais para um corpo passar');
// nada de moita brotando do meio da alface
if (invadeCanteiro.length) {
  problemas.push(`${invadeCanteiro.length} enfeite(s) em cima de canteiro: ` +
    JSON.stringify(invadeCanteiro.slice(0, 4)));
}
// e nenhum prompt apontando para onde a peça NÃO está mais
for (const it of promptsSoltos) {
  problemas.push(
    `o prompt "${it.id}" está a ${Math.hypot(it.ponto[0] - it.alvo[0], it.ponto[1] - it.alvo[1]).toFixed(1)} ` +
    `da peça que ele destaca (ponto ${JSON.stringify(it.ponto)}, peça ${JSON.stringify(it.alvo)})`,
  );
}
if (!dentro.pecas['portao-de-jardim'] || dentro.pecas['portao-de-jardim'] !== 3) {
  problemas.push(`são ${dentro.pecas['portao-de-jardim'] ?? 0} portões, e não 3`);
}
// o jardim de fora: é ele que faz o portão parecer entrada, e não buraco
if ((dentro.pecas['arvore'] ?? 0) < 4) {
  problemas.push('o jardim de fora sumiu — sem ele o portão vira buraco na parede');
}
if (bocasEntupidas.length) problemas.push(`${bocasEntupidas.length} boca(s) com colisor em cima`);
if (!dentro.pecas['tonel-de-agua']) problemas.push('o tonel de água sumiu');
if (!dentro.pecas['bancada-de-jardinagem']) problemas.push('a bancada de jardinagem sumiu');
if (!dentro.pecas['regador']) problemas.push('o regador sumiu — é a arma do minigame');
if ((dentro.pecas['arco-de-estufa'] ?? 0) < 3) {
  problemas.push('faltam arcos: sem eles a estufa lê como pátio, e não como estufa');
}
// atravessar o meio: nenhum trecho destoando dos outros (esbarrão), e a dupla
// realmente saiu do lugar (o limite baixo é só contra "não andou nada")
if (travados.length) {
  problemas.push(`travou ao atravessar o terreiro (trechos: ${JSON.stringify(trechos)})`);
}
if (andou < 2) problemas.push(`mal saiu do lugar no terreiro (${andou.toFixed(2)})`);
if (naBancada.ditas.length < 4) problemas.push('a conversa da bancada não aconteceu');
if (!noDiario) problemas.push('a memória da estufa não entrou no diário');
if (!noTonel.ditas.length) problemas.push('o tonel não rende conversa');
if (!noTerreiro.ditas.length) problemas.push('o terreiro não rende conversa');
if (cenaDepoisDeSair !== 'clube') problemas.push(`sair levou para "${cenaDepoisDeSair}"`);
if (Math.hypot(volta[0] - PORTA_NO_JARDIM.x, volta[1] - PORTA_NO_JARDIM.z) > 2) {
  problemas.push(`quem volta não cai na frente da estufa (${volta})`);
}

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
