/**
 * A LOJINHA POR DENTRO — o salão, e a ronda da Estella.
 *
 * O que este teste guarda:
 *
 * - A PORTA LIGA OS DOIS LADOS. Da calçada dá para entrar, e de dentro dá para
 *   voltar — e o ponto onde a dupla nasce dos dois lados está LIVRE. Porta que
 *   cospe alguém dentro de um colisor é o pior bug de cena que existe: o jogador
 *   fica preso e não tem como saber por quê.
 * - A ESTELLA ANDA e NÃO ATRAVESSA NADA. São duas medidas diferentes, e as duas
 *   importam:
 *     1. cada parada da ronda está fora de todo colisor (o PONTO);
 *     2. cada trecho entre paradas vizinhas passa longe de todo colisor (o
 *        CAMINHO). Esta é a que pega o bug de verdade — `irPara()` anda em linha
 *        reta, então um destino livre não garante nada sobre o meio do caminho,
 *        e foi por isso que a ronda virou uma fila de vizinhos em vez de um
 *        sorteio entre seis pontos soltos.
 *   E, por cima das duas, o teste AMOSTRA a posição dela durante um minuto e
 *   confere que ela nunca esteve dentro de um móvel — a prova de que a conta
 *   acima corresponde ao que acontece de verdade.
 * - ELA FALA SOZINHA, em toast, com as frases do Renan.
 * - O SALÃO TEM O QUE FOI PEDIDO: araras com roupa pendurada, provadores,
 *   manequins, balcão. Medido por contagem de peça, e não por foto.
 * - OS DOIS ANDARES SÃO DOIS ANDARES. A escada rolante leva a dupla inteira para
 *   cima e para baixo, e na chegada o térreo some, o mezanino aparece e a LISTA
 *   DE COLISORES troca — as três, porque cada uma sozinha passa com o bug da
 *   outra.
 * - O ESPELHO REFLETE QUEM ESTÁ NA FRENTE DELE. E isso é medido comparando a
 *   textura do reflexo com a dupla no lugar e com a dupla longe: um teste de
 *   "tem pixel aceso" passa com o espelho refletindo a sala e ESQUECENDO as
 *   pessoas, que é literalmente o bug que esta peça já teve.
 *
 * Uso: node scripts/lojinha.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './lojinha';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o `RONDA` da cena */
const RONDA = [
  [-4.4, 0.35], [-2.75, 0.4], [-2.75, -3.0], [0.9, -3.0], [3.6, -2.8],
  [1.6, -2.9], [1.6, -0.6], [1.05, 1.2], [1.1, 3.3], [3.4, 3.8],
];
/**
 * O pé e o topo da escada rolante, na planta da loja. O do topo é o PATAMAR de
 * desembarque, na ponta de `−X` do rasgo — e não um ponto qualquer do mezanino:
 * é dali que dá para descer, e foi lá que a viagem passou a soltar a dupla.
 */
const PE_DA_ESCADA = { x: 2.0, z: -3.4 };
const TOPO_DA_ESCADA = { x: -5.5, z: -4.0 };
/** onde se para para se olhar no espelho do mezanino */
const FRENTE_DO_ESPELHO = { x: 3.4, z: -2.6 };
/** a porta da loja, na calçada do parque */
const PORTA_DE_FORA = { x: -34.9, z: -16.5 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 820 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// ======================================== 1. entrar pela porta, vindo da calçada
await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(500, 420);
await page.waitForTimeout(500);

await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.6, z, Math.PI / 2), [PORTA_DE_FORA.x, PORTA_DE_FORA.z]);
await page.waitForTimeout(1200);
const promptDaPorta = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const entrou = await page.evaluate(() => window.jogo.current?.def?.id ?? window.jogo.current?.id ?? null);

// ================================================= 2. o salão tem o que foi pedido
const salao = await page.evaluate(() => {
  const conta = {};
  let roupas = 0;
  window.jogo.current.world.root.traverse((o) => {
    const p = o.userData?.peca;
    if (p) conta[p] = (conta[p] ?? 0) + 1;
  });
  // as peças de roupa penduradas: cada cabide é um grupo com uma peça dentro
  window.jogo.current.world.root.traverse((o) => {
    if (o.userData?.peca === 'arara-de-roupas') {
      roupas += o.children.filter((c) => c.isGroup).length;
    }
  });
  return { conta, roupas, malhas: window.jogo.scene.children.length };
});

// ============================== 3. a ronda: os pontos E os caminhos entre eles
/**
 * A conta é a mesma que o jogo usa para empurrar quem anda (`collision.ts`), só
 * que aqui ela é usada para PERGUNTAR em vez de empurrar: a Estella é um círculo
 * de 0,4 (ela tem 0,8 de largura no lombo), e o teste percorre cada trecho em
 * passos de 10 cm.
 */
const ronda = await page.evaluate(([pontos]) => {
  const RAIO = 0.4;
  const colisores = window.jogo.current.world.colliders;
  const bate = (x, z) => colisores.find((c) => {
    if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < RAIO + c.r;
    const cos = Math.cos(-c.rot);
    const sin = Math.sin(-c.rot);
    const lx = (x - c.x) * cos - (z - c.z) * sin;
    const lz = (x - c.x) * sin + (z - c.z) * cos;
    const dx = Math.max(Math.abs(lx) - c.hw, 0);
    const dz = Math.max(Math.abs(lz) - c.hd, 0);
    return dx * dx + dz * dz < RAIO * RAIO;
  });

  const pontosRuins = [];
  const trechosRuins = [];
  for (let i = 0; i < pontos.length; i++) {
    const [x, z] = pontos[i];
    if (bate(x, z)) pontosRuins.push(`parada ${i} (${x}, ${z})`);
    if (i === 0) continue;
    const [ax, az] = pontos[i - 1];
    const passos = Math.ceil(Math.hypot(x - ax, z - az) / 0.1);
    for (let t = 1; t < passos; t++) {
      const px = ax + ((x - ax) * t) / passos;
      const pz = az + ((z - az) * t) / passos;
      const c = bate(px, pz);
      if (c) {
        trechosRuins.push(`trecho ${i - 1}→${i} bate em ${c.kind} (${c.x.toFixed(1)}, ${c.z.toFixed(1)})`);
        break;
      }
    }
  }
  return { pontosRuins, trechosRuins, colisores: colisores.length };
}, [RONDA]);

// ======================================= 4. ela anda de verdade, e não entra em nada
await page.evaluate(() => {
  window.jogo.scene.traverse((o) => {
    if (!window.__ovelha && o.userData?.peca === 'estella') window.__ovelha = o;
  });
});
const ondeEla = () => page.evaluate(() => {
  const o = window.__ovelha;
  return o ? [+o.position.x.toFixed(2), +o.position.z.toFixed(2)] : null;
});

/*
 * O TOAST E COLHIDO NO CAMINHO, e nao no fim.
 *
 * Ele some sozinho depois de alguns segundos — ler `.toasts` uma vez, no fim da
 * amostragem, e apostar em cair no meio dos tres segundos em que a fala esta na
 * tela. Aqui cada amostra da trilha aproveita e recolhe o que estiver escrito.
 */
/*
 * A AMOSTRAGEM É LONGA (54 s) PORQUE A RONDA NOVA TEM PERNA CURTA. A fila de
 * dez paradas anda de dois em dois metros, e entre uma e outra ela PARA de 3,5
 * a 7,5 s — num Chromium headless, que roda o tempo de jogo umas cinco vezes
 * mais devagar que o relógio. Com a janela de 36 s da versão antiga ela mal
 * completava um trecho, e o teste reprovava a ronda por "quase não andou"
 * estando ela perfeitamente viva.
 */
const trilha = [];
const ditas = new Set();
for (let i = 0; i < 60; i++) {
  const onde = await ondeEla();
  if (onde) trilha.push(onde);
  for (const t of await page.evaluate(() =>
    [...document.querySelectorAll('.toasts *')].map((n) => n.textContent))) {
    if (t && t.length > 4) ditas.add(t);
  }
  await page.waitForTimeout(900);
  if (i === 8) await page.screenshot({ path: `${OUT}-salao.png` });
}
let andou = 0;
for (let i = 1; i < trilha.length; i++) {
  andou += Math.hypot(trilha[i][0] - trilha[i - 1][0], trilha[i][1] - trilha[i - 1][1]);
}
const dentroDeMovel = await page.evaluate(([pts]) => {
  const RAIO = 0.4;
  const colisores = window.jogo.current.world.colliders;
  return pts.filter(([x, z]) => colisores.some((c) => {
    if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < RAIO + c.r;
    const cos = Math.cos(-c.rot);
    const sin = Math.sin(-c.rot);
    const lx = (x - c.x) * cos - (z - c.z) * sin;
    const lz = (x - c.x) * sin + (z - c.z) * cos;
    const dx = Math.max(Math.abs(lx) - c.hw, 0);
    const dz = Math.max(Math.abs(lz) - c.hd, 0);
    return dx * dx + dz * dz < RAIO * RAIO;
  }));
}, [trilha]);

// as falas soltas: elas saem em toast, então é no toast que se procura
const falou = [...ditas].join(' | ');

// ====================================== 5. as fotos: o fundo, o caixa e a ronda
await page.evaluate(() => {
  window.jogo.debugPlace(-1.5, 1.0, Math.PI);
  window.jogo.setZoom(7.5);
});
await page.waitForTimeout(2200);
await page.screenshot({ path: `${OUT}-provadores.png` });

await page.evaluate(() => {
  window.jogo.debugPlace(3.2, 1.2, Math.PI);
  window.jogo.setZoom(6);
});
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}-caixa.png` });

await page.evaluate(() => {
  window.jogo.focusCamera(window.__ovelha);
  window.jogo.setZoom(4);
});
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}-estella.png` });
await page.evaluate(() => window.jogo.focusCamera(null));

// ============================================ 6. falar com ela, e voltar pra rua
await page.evaluate(() => {
  window.jogo.setZoom(11);
  const o = window.__ovelha;
  window.jogo.debugPlace(o.position.x + 0.7, o.position.z + 0.7, 0);
});
await page.waitForTimeout(1400);
const promptDela = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const apresentacao = [];
for (let i = 0; i < 14; i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 10 && !apresentacao.includes(t)) apresentacao.push(t);
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(480);
}
const noDiario = await page.evaluate(() => {
  const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  return (save.memories ?? []).map((m) => m.id);
});

// ================================== 7. a escada rolante, o mezanino e o espelho
/**
 * A VIAGEM É ESPERADA POR CONDIÇÃO, NUNCA POR RELÓGIO. O Chromium headless roda
 * o tempo de jogo umas cinco vezes mais devagar que o relógio de parede, então
 * um `waitForTimeout` do tamanho do tween (4,2 s) fotografa a dupla no meio da
 * escada. O teste espera a ALTURA passar de 3,5 E o controle voltar.
 */
const subir = async () => {
  const t0 = Date.now();
  while (Date.now() - t0 < 90000) {
    const [, y] = await page.evaluate(() => {
      const q = window.jogo.playerPosition();
      return [+q.x.toFixed(2), +q.y.toFixed(2)];
    });
    const travado = await page.evaluate(() => window.jogo.input?.blocked ?? null);
    if (y > 3.5 && !travado) return +((Date.now() - t0) / 1000).toFixed(0);
    await page.waitForTimeout(800);
  }
  return null;
};
const descer = async () => {
  const t0 = Date.now();
  while (Date.now() - t0 < 90000) {
    const y = await page.evaluate(() => +window.jogo.playerPosition().y.toFixed(2));
    const travado = await page.evaluate(() => window.jogo.input?.blocked ?? null);
    if (y < 0.4 && !travado) return +((Date.now() - t0) / 1000).toFixed(0);
    await page.waitForTimeout(800);
  }
  return null;
};

await page.evaluate(([x, z]) => {
  window.jogo.debugPlace(x, z, Math.PI);
  window.jogo.setZoom(11);
}, [PE_DA_ESCADA.x, PE_DA_ESCADA.z]);
await page.waitForTimeout(1400);
const promptDoPe = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
for (let i = 0; i < 8 && (await page.locator('.dialogue.show').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
const segundosSubindo = await subir();
const laEmCima = await page.evaluate(() => {
  const q = window.jogo.playerPosition();
  const c = window.jogo.companionPosition();
  return { jogador: [+q.x.toFixed(2), +q.y.toFixed(2), +q.z.toFixed(2)], parceiroY: +c.y.toFixed(2) };
});
await page.screenshot({ path: `${OUT}-mezanino.png` });

/**
 * O ANDAR TROCOU DE VERDADE: peça do térreo escondida, peça do mezanino na
 * tela, e a lista de colisores é OUTRA. As três juntas, porque cada uma sozinha
 * passa com o bug da outra — já apareceu mezanino desenhado com os colisores do
 * térreo, e a dupla andava atravessando arara premium.
 */
const andar = await page.evaluate(() => {
  const naTela = (peca) => {
    let achou = null;
    window.jogo.scene.traverse((o) => { if (!achou && o.userData?.peca === peca) achou = o; });
    if (!achou) return null;
    for (let q = achou; q; q = q.parent) if (!q.visible) return false;
    return true;
  };
  return {
    balcao: naTela('balcao-da-loja'),
    premium: naTela('arara-premium'),
    espelho: naTela('espelho-magico'),
    colisores: window.jogo.current.world.colliders.length,
  };
});

/**
 * O ESPELHO REFLETE A DUPLA, e a prova é uma COMPARAÇÃO, não um "não está
 * preto". A textura do reflexo é lida duas vezes — com a dupla na frente do
 * vidro e com ela longe — e as duas TÊM que ser diferentes.
 *
 * É exatamente o bug que essa peça já teve: o reflexo estava vivo, cheio de
 * sala, e quem se olhava nele não aparecia (o frustum saía do olho da câmera
 * ORTOGRÁFICA, a trinta e cinco metros de lado, e jogava quem estava na frente
 * do vidro para fora de quadro). Um teste de "tem pixel aceso" passaria.
 */
await page.evaluate(([x, z]) => {
  window.jogo.debugPlace(x, z, Math.PI);
  window.jogo.elevarDupla(3.9);
  window.jogo.setZoom(7);
}, [FRENTE_DO_ESPELHO.x, FRENTE_DO_ESPELHO.z]);
await page.waitForTimeout(2500);
const promptDoEspelho = await page.locator('.prompt .label').textContent().catch(() => '');
await page.screenshot({ path: `${OUT}-espelho.png` });

const lerOEspelho = () => page.evaluate(() => {
  let vidro = null;
  window.jogo.scene.traverse((o) => { if (o.name === 'vidro-do-espelho') vidro = o; });
  if (!vidro) return null;
  const alvo = vidro.alvo;
  const lado = 96;
  const buf = new Uint8Array(lado * lado * 4);
  window.jogo.renderer.readRenderTargetPixels(
    alvo,
    Math.round((alvo.width - lado) / 2), Math.round((alvo.height - lado) / 2),
    lado, lado, buf,
  );
  return Array.from(buf);
});
const espelhoComEla = await lerOEspelho();
await page.evaluate(() => {
  window.jogo.player.teleport(-4.5, 1.5, 0, 3.9);
  window.jogo.parceiro.teleport(-5.2, 1.5, 0, 3.9);
});
await page.waitForTimeout(1200);
const espelhoSemEla = await lerOEspelho();
let mudou = 0;
let aceso = 0;
if (espelhoComEla && espelhoSemEla) {
  for (let i = 0; i < espelhoComEla.length; i += 4) {
    if (espelhoComEla[i] + espelhoComEla[i + 1] + espelhoComEla[i + 2] > 30) aceso++;
    const d = Math.abs(espelhoComEla[i] - espelhoSemEla[i])
      + Math.abs(espelhoComEla[i + 1] - espelhoSemEla[i + 1])
      + Math.abs(espelhoComEla[i + 2] - espelhoSemEla[i + 2]);
    if (d > 24) mudou++;
  }
}
const pixels = espelhoComEla ? espelhoComEla.length / 4 : 0;

// e a viagem de volta: o topo da escada devolve a dupla ao térreo
await page.evaluate(([x, z]) => {
  window.jogo.debugPlace(x, z, 0);
  window.jogo.elevarDupla(3.9);
  window.jogo.setZoom(11);
}, [TOPO_DA_ESCADA.x, TOPO_DA_ESCADA.z]);
await page.waitForTimeout(1600);
const promptDoTopo = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
for (let i = 0; i < 8 && (await page.locator('.dialogue.show').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
const segundosDescendo = await descer();
const laEmBaixo = await page.evaluate(() => {
  const q = window.jogo.playerPosition();
  return [+q.x.toFixed(2), +q.y.toFixed(2), +q.z.toFixed(2)];
});

// ================================================= 8. e a porta de volta pra rua
await page.evaluate(() => window.jogo.debugPlace(4.1, 4.0, 0));
await page.waitForTimeout(1200);
const promptDeSair = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(3000);
const voltou = await page.evaluate(() => ({
  cena: window.jogo.current?.def?.id ?? window.jogo.current?.id ?? null,
  onde: [+window.jogo.playerPosition().x.toFixed(1), +window.jogo.playerPosition().z.toFixed(1)],
}));
// e a dupla consegue andar de onde nasceu (não caiu dentro de um colisor)
const antes = voltou.onde;
await page.keyboard.down('KeyW');
await page.waitForTimeout(2200);
await page.keyboard.up('KeyW');
const depois = await page.evaluate(() =>
  [+window.jogo.playerPosition().x.toFixed(1), +window.jogo.playerPosition().z.toFixed(1)]);
const andouLaFora = Math.hypot(depois[0] - antes[0], depois[1] - antes[1]);

// ======================================================================= laudo
const falhas = [];
if (!/lojinha/i.test(promptDaPorta)) falhas.push(`nao ha porta na fachada: "${promptDaPorta}"`);
if (entrou !== 'lojinha') falhas.push(`a porta nao levou para dentro: cena "${entrou}"`);
for (const [peca, quantas] of [
  ['arara-de-roupas', 4], ['provadores', 1], ['manequim-de-loja', 2],
  ['balcao-da-loja', 1], ['mesa-de-dobrar', 1], ['prateleira-da-loja', 2], ['estella', 1],
  ['escada-rolante', 1], ['arara-premium', 3], ['espelho-magico', 1],
]) {
  if ((salao.conta[peca] ?? 0) !== quantas) {
    falhas.push(`o salao tem ${salao.conta[peca] ?? 0} de "${peca}" (esperado ${quantas})`);
  }
}
if (salao.roupas < 40) falhas.push(`as araras tem so ${salao.roupas} pecas penduradas`);
falhas.push(...ronda.pontosRuins.map((p) => `parada dentro de movel: ${p}`));
falhas.push(...ronda.trechosRuins.map((t) => `a ronda atravessa movel: ${t}`));
if (andou < 3) falhas.push(`a Estella quase nao andou (${andou.toFixed(2)} em 54 s)`);
if (dentroDeMovel.length) {
  falhas.push(`ela foi vista dentro de um movel: ${JSON.stringify(dentroDeMovel.slice(0, 3))}`);
}
if (!/Estella/.test(falou)) falhas.push(`ela nao falou sozinha: "${falou}"`);
/*
 * O BORDAO DELA. As falas alternam "com carinho" e "solta", entao em tres ou
 * quatro falas ouvidas pelo menos uma tem que trazer o tratamento — e o teste
 * so pode cobrar isso PORQUE elas alternam: com sorteio livre numa lista so,
 * esta assercao passaria a depender de sorte e falharia sozinha de vez em
 * quando, que e o pior tipo de teste.
 */
if (ditas.size >= 2 && !/(meus queridos|cariños|meus amores)/i.test(falou)) {
  falhas.push(`ela nao chamou a dupla de "meus queridos/cariños/meus amores": "${falou}"`);
}
if (!/Falar com a Estella/i.test(promptDela)) falhas.push(`nao da para falar com ela: "${promptDela}"`);
if (!apresentacao.some((f) => /minha|arara|bainha/i.test(f))) {
  falhas.push(`a apresentacao dela nao aconteceu: ${JSON.stringify(apresentacao)}`);
}
if (!noDiario.includes('lojinha-por-dentro')) falhas.push('a loja nao entrou no diario');

// -------------------------------------------------- os dois andares e o espelho
if (!/subir/i.test(promptDoPe)) falhas.push(`nao da para subir no pe da escada: "${promptDoPe}"`);
if (segundosSubindo === null) falhas.push('a viagem de subida nunca terminou (90 s)');
if (laEmCima.jogador[1] < 3.5) falhas.push(`a escada nao entregou o mezanino: ${JSON.stringify(laEmCima.jogador)}`);
if (Math.abs(laEmCima.parceiroY - laEmCima.jogador[1]) > 0.3) {
  falhas.push(`o parceiro ficou num andar diferente (y ${laEmCima.parceiroY})`);
}
if (andar.balcao !== false) falhas.push('o terreo continua na tela com a dupla no mezanino');
if (andar.premium !== true) falhas.push('as araras premium nao apareceram no mezanino');
if (andar.espelho !== true) falhas.push('o espelho nao apareceu no mezanino');
if (andar.colisores === ronda.colisores) {
  falhas.push(`os colisores nao trocaram de andar (${andar.colisores} nos dois)`);
}
if (!/espelho/i.test(promptDoEspelho)) falhas.push(`nao da para se olhar no espelho: "${promptDoEspelho}"`);
if (!pixels) falhas.push('o espelho nao tem alvo de reflexo para ler');
else {
  if (aceso < pixels * 0.5) falhas.push(`o reflexo saiu apagado (${aceso} de ${pixels} pixels acesos)`);
  if (mudou < pixels * 0.02) falhas.push(`a dupla nao aparece no reflexo (so ${mudou} de ${pixels} pixels mudaram quando ela saiu da frente)`);
}
if (!/descer/i.test(promptDoTopo)) falhas.push(`nao da para descer no topo: "${promptDoTopo}"`);
if (segundosDescendo === null) falhas.push('a viagem de descida nunca terminou (90 s)');
if (laEmBaixo[1] > 0.4) falhas.push(`a descida nao devolveu o terreo: ${JSON.stringify(laEmBaixo)}`);

if (!/calçada|calcada/i.test(promptDeSair)) falhas.push(`nao ha porta de volta: "${promptDeSair}"`);
if (voltou.cena !== 'villa-lobos') falhas.push(`a porta de volta nao saiu da loja: "${voltou.cena}"`);
if (andouLaFora < 0.4) falhas.push(`a dupla nasceu presa na calcada (andou ${andouLaFora.toFixed(2)})`);
falhas.push(...erros);

console.log('1. porta:', JSON.stringify(promptDaPorta), '→ cena', entrou);
console.log('2. salao:', JSON.stringify(salao.conta), '·', salao.roupas, 'pecas penduradas');
console.log('3. ronda:',
  ronda.pontosRuins.length ? JSON.stringify(ronda.pontosRuins) : `as ${RONDA.length} paradas livres`,
  '·', ronda.trechosRuins.length ? JSON.stringify(ronda.trechosRuins) : `os ${RONDA.length - 1} trechos limpos`,
  `· ${ronda.colisores} colisores no terreo`);
console.log('4. ela andou', andou.toFixed(2), 'em 54 s · dentro de movel:', dentroDeMovel.length);
console.log('   toast:', JSON.stringify(falou.slice(0, 120)));
console.log('5. conversa:', JSON.stringify(apresentacao.slice(0, 3)), '· diario:', JSON.stringify(noDiario));
console.log('6. escada:', JSON.stringify(promptDoPe), '→', JSON.stringify(laEmCima.jogador),
  `em ${segundosSubindo}s ·`, JSON.stringify(promptDoTopo), '→', JSON.stringify(laEmBaixo),
  `em ${segundosDescendo}s`);
console.log('   andar:', JSON.stringify(andar));
console.log('7. espelho:', JSON.stringify(promptDoEspelho), '·', aceso, 'de', pixels, 'pixels acesos ·',
  mudou, 'mudaram quando a dupla saiu da frente');
console.log('8. volta:', JSON.stringify(promptDeSair), '→', voltou.cena, JSON.stringify(voltou.onde),
  '· andou la fora:', andouLaFora.toFixed(2));

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
