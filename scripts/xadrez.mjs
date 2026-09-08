/**
 * O XADREZ DA ESTELLA — as REGRAS antes da tela.
 *
 * Este é o teste mais rigoroso do repositório, e é de propósito: xadrez é a
 * primeira mecânica do jogo em que uma regra errada não parece bug, parece
 * "acho que eu não podia fazer isso mesmo". Ninguém reclama de um cavalo que
 * anda torto — a pessoa só acha que entendeu errado e a partida azeda.
 *
 * A prova vem em quatro camadas, da mais barata para a mais cara:
 *
 * 1. POSIÇÕES MONTADAS. Dezesseis posições em FEN, cada uma isolando UMA regra
 *    (o L do cavalo, a diagonal do bispo, o peão que não captura para a frente,
 *    en passant, os dois roques, roque em xeque, promoção, peça cravada, xeque
 *    obrigatório, mate, afogamento). Em cada uma o teste compara a lista de
 *    destinos do motor com a lista escrita à mão aqui — igualdade de conjunto,
 *    não "contém": destino faltando e destino sobrando são os dois erros, e
 *    "contém" só pega um deles.
 * 2. A RECUSA. O motor tem que dizer NÃO para o lance ilegal e não mexer no
 *    tabuleiro — a tela só oferece lance legal, mas a segurança não pode
 *    depender do desenho.
 * 3. A OVELHA. Ela pega o mate em um, prefere a captura mais cara e nunca joga
 *    fora da lista legal.
 * 4. TRESENTAS PARTIDAS ALEATÓRIAS (o caça-bug de verdade). Cada partida joga
 *    até acabar ou 160 lances, e a cada lance confere as invariantes que
 *    nenhuma posição montada pega: peça nunca aparece do nada, rei nunca some,
 *    a vez sempre alterna, e nenhum lance estoura exceção.
 *
 * Só depois disso o teste abre a TELA e confere que ela não inventa nada: que
 * as casas acesas são exatamente os destinos do motor, que clicar em casa
 * apagada não move nada, que a ovelha responde, e que o jogador sai da mesa
 * andando.
 *
 * As regras rodam DENTRO do navegador, no mesmo bundle que o jogo publica —
 * não adianta provar as regras numa cópia do código que ninguém joga.
 *
 * Uso: node scripts/xadrez.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './xadrez';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** a mesinha, e o ponto de onde se joga — tem que bater com a cena */
const MESA = { x: -32.75 + 0.9, z: -18.7 + 0.5 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 760 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(450, 380);
await page.waitForTimeout(600);

// ===================================================== 1. as regras, uma a uma
/**
 * Cada caso é: uma posição, uma casa, e a lista EXATA de destinos que aquela
 * peça tem ali. Escrita à mão, conferida no tabuleiro — é a lista de destinos
 * que faz o teste valer alguma coisa; se ela viesse do próprio motor, o teste
 * estaria perguntando ao réu se ele é culpado.
 */
const CASOS = [
  {
    nome: 'o L do cavalo, da posicao inicial',
    fen: null, casa: 'b1', destinos: ['a3', 'c3'],
  },
  {
    // ele pula os proprios peoes, mas nao pousa em cima das proprias pecas:
    // d1 e a dama, f1 o bispo, c2 e g2 os peoes — sobram as quatro da frente
    nome: 'o cavalo pula por cima dos proprios peoes',
    fen: 'rnbqkbnr/pppppppp/8/8/8/4N3/PPPPPPPP/RNBQKB1R w KQkq - 0 1',
    casa: 'e3', destinos: ['d5', 'f5', 'c4', 'g4'],
  },
  {
    nome: 'o bispo preso atras dos proprios peoes nao tem para onde ir',
    fen: null, casa: 'c1', destinos: [],
  },
  {
    // a1 e o proprio rei (nao entra) e d4 e o peao preto (entra, e a diagonal
    // para ali): as duas pontas da mesma regra numa posicao so
    nome: 'a diagonal do bispo para na primeira peca',
    fen: '7k/8/8/8/3p4/8/1B6/K7 w - - 0 1',
    casa: 'b2', destinos: ['c3', 'd4', 'a3', 'c1'],
  },
  {
    nome: 'o peao anda uma ou duas da fila de casa',
    fen: null, casa: 'e2', destinos: ['e3', 'e4'],
  },
  {
    nome: 'fora da fila de casa o peao anda so uma',
    fen: 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
    casa: 'e3', destinos: ['e4'],
  },
  {
    nome: 'o peao NAO captura para a frente',
    fen: '4k3/8/8/8/8/4p3/4P3/4K3 w - - 0 1',
    casa: 'e2', destinos: [],
  },
  {
    nome: 'o peao captura na diagonal',
    fen: '4k3/8/8/8/8/3p1p2/4P3/4K3 w - - 0 1',
    casa: 'e2', destinos: ['e3', 'e4', 'd3', 'f3'],
  },
  {
    nome: 'en passant: a captura existe no lance seguinte',
    fen: 'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3',
    // d6 esta vazia e NAO e captura (o peao preto esta em d5, nao em d6): o
    // unico destino diagonal e a casa do en passant
    casa: 'e5', destinos: ['e6', 'f6'],
  },
  {
    nome: 'o roque dos dois lados aparece nos destinos do rei',
    fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    casa: 'e1', destinos: ['d1', 'f1', 'd2', 'e2', 'f2', 'g1', 'c1'],
  },
  {
    nome: 'em xeque nao se roca',
    fen: 'r3k2r/8/8/8/8/8/4r3/R3K2R w KQkq - 0 1',
    casa: 'e1', destinos: ['d1', 'f1', 'e2'],
  },
  {
    // cavalo em e3, rei em e1 e torre preta em e8: o cavalo esta na coluna do
    // proprio rei e nao pode sair dela
    nome: 'a peca cravada no proprio rei nao sai da linha',
    fen: '4r2k/8/8/8/8/4N3/8/4K3 w - - 0 1',
    casa: 'e3', destinos: [],
  },
  {
    // bispo preto em h4 dando xeque pela diagonal h4-g3-f2-e1: o peao de g2 so
    // pode ir a g3, que TAPA o xeque. g4 e legal em qualquer outra posicao e
    // aqui nao e
    nome: 'em xeque so vale o lance que tapa o xeque',
    fen: '4k3/8/8/8/7b/8/6P1/4K2R w K - 0 1',
    casa: 'g2', destinos: ['g3'],
  },
  {
    // e a torre, na mesma posicao, so pode COMER o bispo que da o xeque
    nome: 'em xeque a torre so pode comer quem esta dando xeque',
    fen: '4k3/8/8/8/7b/8/6P1/4K2R w K - 0 1',
    casa: 'h1', destinos: ['h4'],
  },
];

const regras = await page.evaluate((casos) => {
  const falhas = [];
  const iguais = (a, b) => {
    const A = [...a].sort().join(',');
    const B = [...b].sort().join(',');
    return A === B ? null : `esperado [${B}], veio [${A}]`;
  };
  for (const caso of casos) {
    const motor = window.jogo.motorDeXadrez('brancas', 1);
    if (caso.fen) motor.carregar(caso.fen);
    const veio = motor.destinosDe(caso.casa);
    const erro = iguais(veio, caso.destinos);
    if (erro) falhas.push(`${caso.nome}: ${erro}`);
  }
  return falhas;
}, CASOS);

// ============================================== 2. o que o motor tem que RECUSAR
const recusas = await page.evaluate(() => {
  const falhas = [];
  const motor = window.jogo.motorDeXadrez('brancas', 1);
  const antes = motor.fen();

  // lance impossivel: o peao de e2 nao vai a e5
  if (motor.jogar('e2', 'e5') !== null) falhas.push('aceitou e2-e5 (peao andando tres)');
  // peca do adversario: nao e a vez dela
  if (motor.jogar('e7', 'e5') !== null) falhas.push('aceitou mexer peca preta na vez das brancas');
  // casa vazia
  if (motor.jogar('e4', 'e5') !== null) falhas.push('aceitou lance de casa vazia');
  // cavalo andando em linha reta
  if (motor.jogar('b1', 'b3') !== null) falhas.push('aceitou cavalo andando reto');
  if (motor.fen() !== antes) falhas.push('o tabuleiro MUDOU num lance recusado');

  /*
   * O REI NAO ANDA PARA CASA ATACADA — e a torre preta em f2 desenha as duas
   * metades da regra de uma vez: ela tranca e2, d2, f1 (a fila 2 e a coluna f)
   * e o rei ainda pode COMER ela, porque ninguem a defende. Sobram d1 e f2.
   */
  const emPerigo = window.jogo.motorDeXadrez('brancas', 1);
  emPerigo.carregar('4k3/8/8/8/8/8/5r2/4K3 w - - 0 1');
  const doRei = [...emPerigo.destinosDe('e1')].sort().join(',');
  if (doRei !== 'd1,f2') falhas.push(`os lances do rei mudaram: [${doRei}], esperado [d1,f2]`);

  /*
   * E A MESMA POSICAO COM A TORRE DEFENDIDA (bispo preto em h4 segurando f2):
   * agora comer a torre e suicidio e o rei fica com uma casa so. E o caso que
   * separa "sei onde a peca ataca" de "sei o que acontece DEPOIS do meu lance".
   */
  const defendida = window.jogo.motorDeXadrez('brancas', 1);
  defendida.carregar('4k3/8/8/8/7b/8/5r2/4K3 w - - 0 1');
  const semSaida = [...defendida.destinosDe('e1')].sort().join(',');
  if (semSaida !== 'd1') falhas.push(`o rei comeu peca defendida: [${semSaida}], esperado [d1]`);
  return falhas;
});

// ================================================= 3. o fim de jogo e a promocao
const finais = await page.evaluate(() => {
  const falhas = [];

  // o mate do tolo, em quatro meio-lances
  const tolo = window.jogo.motorDeXadrez('brancas', 1);
  for (const [de, para] of [['f2', 'f3'], ['e7', 'e5'], ['g2', 'g4'], ['d8', 'h4']]) {
    if (!tolo.jogar(de, para)) falhas.push(`o mate do tolo travou em ${de}-${para}`);
  }
  if (tolo.situacao() !== 'xeque-mate') falhas.push(`o mate do tolo nao deu mate: ${tolo.situacao()}`);
  if (tolo.vencedor() !== 'pretas') falhas.push(`o mate do tolo deu vencedor errado: ${tolo.vencedor()}`);
  if (!tolo.acabou()) falhas.push('o mate do tolo nao encerrou a partida');

  // afogamento: rei preto sem lance nenhum, e sem estar em xeque
  const afogado = window.jogo.motorDeXadrez('brancas', 1);
  afogado.carregar('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
  if (afogado.situacao() !== 'afogamento') falhas.push(`nao reconheceu o afogamento: ${afogado.situacao()}`);
  if (afogado.vencedor() !== null) falhas.push('afogamento com vencedor');

  // promocao: o peao que chega vira dama
  const promove = window.jogo.motorDeXadrez('brancas', 1);
  promove.carregar('8/4P3/8/8/8/8/8/K6k w - - 0 1');
  const feito = promove.jogar('e7', 'e8');
  if (!feito?.promoveu) falhas.push('a promocao nao foi marcada no lance');
  const casaE8 = promove.tabuleiro().flat().find((c) => c.casa === 'e8');
  if (casaE8?.peca !== 'q') falhas.push(`o peao promovido virou ${casaE8?.peca}`);

  // e o xeque e anunciado no lance que o da
  const xeque = window.jogo.motorDeXadrez('brancas', 1);
  xeque.carregar('4k3/8/8/8/8/8/8/4K2R w - - 0 1');
  const lance = xeque.jogar('h1', 'h8');
  if (!lance?.xeque) falhas.push('o lance de xeque nao foi marcado');
  return falhas;
});

// ==================================================== 4. a cabeca da ovelha
const ovelha = await page.evaluate(() => {
  const falhas = [];

  // ela pega o mate em um em vez de qualquer outro lance
  // a posicao do mate do tolo: depois de 1.f3 e5 2.g4, as pretas tem Dh4 mate
  const mate = window.jogo.motorDeXadrez('brancas', 7);
  mate.carregar('rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2');
  const dela = mate.jogarPelaOvelha();
  if (mate.situacao() !== 'xeque-mate') falhas.push(`ela nao deu o mate em um: jogou ${dela?.anotacao}`);

  // ela prefere a captura mais cara: dama de graca contra peao de graca
  const captura = window.jogo.motorDeXadrez('brancas', 7);
  // cavalo preto em e4: ele alcanca a dama em c5 (9) e o peao em d2 (1)
  captura.carregar('4k3/8/8/2Q5/4n3/8/3P4/4K3 b - - 0 1');
  const escolha = captura.jogarPelaOvelha();
  if (escolha?.capturou !== 'q') falhas.push(`ela nao comeu a dama de graca: jogou ${escolha?.anotacao}`);

  // e ela nunca joga fora da lista legal
  const partida = window.jogo.motorDeXadrez('brancas', 11);
  partida.jogar('e2', 'e4');
  for (let i = 0; i < 40 && !partida.acabou(); i++) {
    const legais = partida.todosOsLances().map((l) => `${l.de}${l.para}`);
    const feito = partida.minhaVez()
      ? partida.jogar(partida.todosOsLances()[0].de, partida.todosOsLances()[0].para)
      : partida.jogarPelaOvelha();
    if (!feito) break;
    if (!legais.includes(`${feito.de}${feito.para}`)) {
      falhas.push(`lance fora da lista legal: ${feito.de}-${feito.para}`);
      break;
    }
  }
  return falhas;
});

// ============================== 5. trezentas partidas aleatorias (o caca-bug)
/**
 * O TESTE QUE ACHA O QUE POSIÇÃO MONTADA NÃO ACHA.
 *
 * Posição montada prova a regra que alguém lembrou de escrever. O que quebra um
 * tabuleiro de verdade é a milésima posição maluca que ninguém imaginou — e o
 * único jeito de visitar essas é jogar muito. Cada partida joga lances legais
 * sorteados até acabar, e a cada lance o teste confere quatro invariantes que
 * valem em QUALQUER posição de xadrez:
 *
 *  - o número de peças nunca AUMENTA (peça que nasce é o bug clássico de
 *    tabuleiro caseiro, e aparece em roque e en passant);
 *  - há sempre exatamente um rei de cada cor;
 *  - a vez sempre alterna;
 *  - nenhum lance estoura exceção.
 */
const fuzz = await page.evaluate(() => {
  const falhas = [];
  let lances = 0;
  let mates = 0;
  let empates = 0;
  const conta = (motor) => {
    const pecas = motor.tabuleiro().flat().filter((c) => c.peca);
    return {
      total: pecas.length,
      reis: pecas.filter((c) => c.peca === 'k').length,
      brancas: pecas.filter((c) => c.peca === 'k' && c.cor === 'brancas').length,
    };
  };
  for (let partida = 0; partida < 300 && falhas.length < 5; partida++) {
    const motor = window.jogo.motorDeXadrez('brancas', 1000 + partida * 37);
    let antes = conta(motor);
    let vez = motor.vezDe();
    for (let i = 0; i < 160 && !motor.acabou(); i++) {
      const legais = motor.todosOsLances();
      if (!legais.length) {
        falhas.push(`partida ${partida}: sem lances legais mas o jogo nao acabou`);
        break;
      }
      let feito;
      try {
        // metade dos lances pela cabeca da ovelha, metade sorteados: assim o
        // teste passa tanto pelas posicoes que a IA prefere quanto pelas que
        // ela nunca escolheria
        feito = i % 2 === 0
          ? motor.jogarPelaOvelha()
          : (() => {
            const l = legais[(partida * 7 + i * 13) % legais.length];
            return motor.jogar(l.de, l.para);
          })();
      } catch (e) {
        falhas.push(`partida ${partida} lance ${i}: estourou ${e.message}`);
        break;
      }
      if (!feito) {
        falhas.push(`partida ${partida} lance ${i}: o motor recusou um lance da propria lista`);
        break;
      }
      lances++;
      const agora = conta(motor);
      if (agora.total > antes.total) {
        falhas.push(`partida ${partida} lance ${i} (${feito.anotacao}): nasceu peca (${antes.total} → ${agora.total})`);
        break;
      }
      if (agora.reis !== 2 || agora.brancas !== 1) {
        falhas.push(`partida ${partida} lance ${i} (${feito.anotacao}): os reis sumiram (${JSON.stringify(agora)})`);
        break;
      }
      if (motor.vezDe() === vez) {
        falhas.push(`partida ${partida} lance ${i}: a vez nao alternou`);
        break;
      }
      vez = motor.vezDe();
      antes = agora;
    }
    if (motor.situacao() === 'xeque-mate') mates++;
    else if (motor.acabou()) empates++;
  }
  return { falhas, lances, mates, empates };
});

// ================================================== 6. a tela, no jogo de verdade
/*
 * DAQUI PARA BAIXO É A INTERFACE. A dupla já conhece a Estella (a flag entra
 * direto, para o teste do tabuleiro não depender do teste da conversa dela), e
 * a partida é jogada de verdade: clique, destino aceso, resposta da ovelha.
 */
await page.evaluate(() => window.jogo.setFlag('estella-conhecida'));
await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, 0), [MESA.x + 0.4, MESA.z + 0.4]);
await page.waitForTimeout(1200);
const promptDaMesa = await page.locator('.prompt .label').textContent().catch(() => '');

await page.keyboard.press('KeyE');
await page.waitForTimeout(700);
/*
 * A FALA DE ABERTURA VEM ANTES DO TABULEIRO, e ela e datilografada: o primeiro
 * E completa o texto na tela e o segundo fecha o balao. Esperar por CONTAGEM de
 * teclas dava certo por sorte — o laco insiste ate a caixa de fala sumir, que e
 * quando a mesa abre.
 */
let abertura = '';
for (let i = 0; i < 10; i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > abertura.length) abertura = t;
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(450);
}
await page.waitForTimeout(900);

/*
 * A PINTURA DAS CASAS TEM UM JEITO CERTO, e ele nao e detalhe de decoracao:
 * "casa clara na direita de quem joga" e a regra do tabuleiro montado, e quem
 * joga xadrez estranha na hora. h1 e h8 sao as duas ancoras — h1 clara, a1
 * escura.
 */
const cores = await page.evaluate(() => {
  const cor = (casa) => {
    const c = document.querySelector(`.xadrez .casa[data-casa="${casa}"]`);
    return c?.classList.contains('escura') ? 'escura' : 'clara';
  };
  return { a1: cor('a1'), h1: cor('h1'), a8: cor('a8'), h8: cor('h8') };
});

const abriu = await page.evaluate(() => ({
  aberto: !!document.querySelector('.xadrez.show'),
  casas: document.querySelectorAll('.xadrez .casa').length,
  pecas: document.querySelectorAll('.xadrez .grade .peca').length,
  travado: !!document.querySelector('.tela-aberta'),
}));
await page.screenshot({ path: `${OUT}-mesa.png` });

/** o que a tela mostra numa casa, para comparar com o motor */
const lerTabuleiro = () => page.evaluate(() => {
  const fora = {};
  for (const casa of document.querySelectorAll('.xadrez .casa')) {
    const p = casa.querySelector('.peca');
    fora[casa.dataset.casa] = p ? `${p.classList.contains('brancas') ? 'b' : 'p'}${p.textContent}` : '';
  }
  return fora;
});
const acesas = () => page.evaluate(() =>
  [...document.querySelectorAll('.xadrez .casa.ir, .xadrez .casa.comer')].map((c) => c.dataset.casa).sort());
const clicar = (casa) => page.click(`.xadrez .casa[data-casa="${casa}"]`);

// clicar numa peça minha acende EXATAMENTE os destinos dela
await clicar('e2');
await page.waitForTimeout(300);
const destinosDoPeao = await acesas();
const marcadas = await page.evaluate(() =>
  [...document.querySelectorAll('.xadrez .casa.marcada')].map((c) => c.dataset.casa));

// clicar numa peça DELA não marca nada
await clicar('e7');
await page.waitForTimeout(250);
const marcouDela = await page.evaluate(() => document.querySelectorAll('.xadrez .casa.marcada').length);

// selecionar de novo e clicar numa casa APAGADA não move nada
await clicar('e2');
await page.waitForTimeout(250);
const antesDoIlegal = await lerTabuleiro();
await clicar('e5');
await page.waitForTimeout(400);
const depoisDoIlegal = await lerTabuleiro();

/**
 * E AGORA A PARTIDA DE VERDADE: quatro lances, jogados como uma pessoa joga.
 *
 * O teste NAO escolhe lance nenhum — ele clica numa peca, olha que casas
 * acenderam e clica na primeira. E de proposito: assim ele joga o que a TELA
 * oferece, e qualquer casa acesa que nao fosse um lance legal apareceria aqui
 * como um lance recusado (a tela deixaria de mexer a peca).
 *
 * O TEMPO DELA E MEDIDO, e nao lido de um texto: a pausa de "estar pensando" e
 * um pedido do Renan (1 a 2 segundos), e o unico jeito honesto de provar que
 * ela existe e cronometrar do meu clique ate a peca dela mudar de casa. O texto
 * "está pensando…" e conferido de tabela, amostrado durante essa espera.
 */
const jogarUmLance = async () => {
  const minhas = await page.evaluate(() =>
    [...document.querySelectorAll('.xadrez .casa')]
      .filter((c) => c.querySelector('.peca.brancas'))
      .map((c) => c.dataset.casa));
  for (const casa of minhas) {
    await clicar(casa);
    const abertas = await acesas();
    if (!abertas.length) continue;
    const antes = await lerTabuleiro();
    const t0 = Date.now();
    await clicar(abertas[0]);
    // espera a resposta dela, amostrando o estado no caminho
    let viuPensando = false;
    let respondeu = null;
    for (let i = 0; i < 60; i++) {
      const agora = await page.evaluate(() => ({
        estado: document.querySelector('.xadrez .estado')?.textContent ?? '',
        balao: document.querySelector('.xadrez .balao')?.textContent ?? '',
        pretas: [...document.querySelectorAll('.xadrez .casa')]
          .filter((c) => c.querySelector('.peca.pretas')).map((c) => c.dataset.casa).join(','),
        pecas: document.querySelectorAll('.xadrez .grade .peca').length,
        fim: !!document.querySelector('.xadrez .estado.fim'),
      }));
      if (/pensando/i.test(agora.estado)) viuPensando = true;
      const pretasAntes = Object.keys(antes).filter((c) => antes[c]?.startsWith('p')).join(',');
      if (agora.pretas !== pretasAntes || agora.fim) {
        respondeu = { ...agora, ms: Date.now() - t0 };
        break;
      }
      await page.waitForTimeout(100);
    }
    return { de: casa, para: abertas[0], viuPensando, respondeu, antes };
  }
  return null;
};

const lances = [];
for (let i = 0; i < 4; i++) {
  const lance = await jogarUmLance();
  if (!lance) break;
  lances.push(lance);
  if (lance.respondeu?.fim) break;
}
const balao = lances.map((l) => l.respondeu?.balao ?? '').filter(Boolean).pop() ?? '';
const pecasNaTela = lances.at(-1)?.respondeu?.pecas ?? 0;
await page.screenshot({ path: `${OUT}-partida.png` });

// e a saída: desistir fecha a mesa, solta o jogador e ela ainda fala
await page.click('.xadrez .sair');
await page.waitForTimeout(900);
const fechou = await page.evaluate(() => !document.querySelector('.xadrez.show'));
for (let i = 0; i < 8 && (await page.locator('.dialogue.show').count()); i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(420);
}
const antesDeAndar = await page.evaluate(() => {
  const p = window.jogo.playerPosition();
  return [+p.x.toFixed(2), +p.z.toFixed(2)];
});
await page.keyboard.down('KeyW');
await page.waitForTimeout(2200);
await page.keyboard.up('KeyW');
const depoisDeAndar = await page.evaluate(() => {
  const p = window.jogo.playerPosition();
  return [+p.x.toFixed(2), +p.z.toFixed(2)];
});
const andou = Math.hypot(depoisDeAndar[0] - antesDeAndar[0], depoisDeAndar[1] - antesDeAndar[1]);

// ======================================================================= laudo
const falhas = [];
falhas.push(...regras, ...recusas, ...finais, ...ovelha, ...fuzz.falhas);
if (fuzz.lances < 3000) falhas.push(`o fuzz jogou pouco: ${fuzz.lances} lances`);
if (fuzz.mates < 1) falhas.push('nenhuma das 300 partidas terminou em mate — o fim de jogo nao esta sendo exercitado');

if (!/xadrez/i.test(promptDaMesa)) falhas.push(`o prompt da mesa nao e o do xadrez: "${promptDaMesa}"`);
if (!/raciocínio|Bééé/i.test(abertura)) falhas.push(`ela nao provocou antes de comecar: "${abertura}"`);
if (!abriu.aberto) falhas.push('o tabuleiro nao abriu');
if (abriu.casas !== 64) falhas.push(`o tabuleiro tem ${abriu.casas} casas`);
if (abriu.pecas !== 32) falhas.push(`o tabuleiro comecou com ${abriu.pecas} pecas`);
if (!abriu.travado) falhas.push('o jogo nao marcou tela-aberta (os botoes de toque continuam clicaveis por baixo)');
if (cores.a1 !== 'escura' || cores.h1 !== 'clara' || cores.a8 !== 'clara' || cores.h8 !== 'escura') {
  falhas.push(`o tabuleiro esta pintado ao contrario: ${JSON.stringify(cores)}`);
}
if (String(destinosDoPeao) !== String(['e3', 'e4'])) {
  falhas.push(`as casas acesas do peao de e2 nao batem: [${destinosDoPeao}]`);
}
if (String(marcadas) !== String(['e2'])) falhas.push(`a marcacao ficou em [${marcadas}]`);
if (marcouDela !== 0) falhas.push('clicar numa peca dela marcou a casa');
if (JSON.stringify(antesDoIlegal) !== JSON.stringify(depoisDoIlegal)) {
  falhas.push('clicar numa casa apagada mexeu no tabuleiro');
}
if (lances.length < 4) falhas.push(`a tela so deixou jogar ${lances.length} lances`);
for (const [i, l] of lances.entries()) {
  if (!l.respondeu) {
    falhas.push(`lance ${i + 1} (${l.de}-${l.para}): a ovelha nao respondeu`);
    continue;
  }
  if (!l.viuPensando) falhas.push(`lance ${i + 1}: ela respondeu sem passar por "pensando"`);
  if (l.respondeu.ms < 800) falhas.push(`lance ${i + 1}: ela respondeu em ${l.respondeu.ms}ms (sem pausa)`);
  if (l.respondeu.ms > 6000) falhas.push(`lance ${i + 1}: ela demorou ${l.respondeu.ms}ms`);
  if (l.respondeu.pecas > 32) falhas.push(`lance ${i + 1}: a tela ficou com ${l.respondeu.pecas} pecas`);
}
if (!balao) falhas.push('ela nao provocou nenhuma vez em quatro lances');
if (!fechou) falhas.push('a mesa nao fechou no desistir');
if (andou < 0.4) falhas.push(`o jogador ficou travado depois da partida (andou ${andou.toFixed(2)})`);
falhas.push(...erros);

console.log('1. regras:', regras.length ? JSON.stringify(regras) : `${CASOS.length} posicoes, todas certas`);
console.log('2. recusas:', recusas.length ? JSON.stringify(recusas) : 'lance ilegal recusado e tabuleiro intacto');
console.log('3. fim de jogo:', finais.length ? JSON.stringify(finais) : 'mate, afogamento, promocao e xeque ok');
console.log('4. a ovelha:', ovelha.length ? JSON.stringify(ovelha) : 'pega o mate, come a peca mais cara, so joga legal');
console.log('5. fuzz:', fuzz.lances, 'lances em 300 partidas ·', fuzz.mates, 'mates ·', fuzz.empates, 'empates/afogamentos ·',
  fuzz.falhas.length ? JSON.stringify(fuzz.falhas) : 'invariantes de pe');
console.log('6. tela:', JSON.stringify(abriu), '· cantos:', JSON.stringify(cores), '· acesas do peao:', JSON.stringify(destinosDoPeao));
console.log('   lances pela tela:', lances.map((l) => `${l.de}-${l.para} (${l.respondeu?.ms ?? '—'}ms)`).join(' · '));
console.log('   balao:', JSON.stringify(balao), '· pecas na tela:', pecasNaTela,
  '· fechou:', fechou, '· andou depois:', andou.toFixed(2));

await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
