/**
 * AS GOTAS E A TELA DAS TRÊS CARTAS do minigame do jardim.
 *
 * A rodada de verdade ainda não existe; o que existe são as duas peças que ela
 * vai usar, e o treino da estufa (`?cena=estufa&treino=gotas`) que as liga. Este
 * teste faz a corrente inteira:
 *
 *   gota no chão → pisar pega → a barra enche → sobe de nível → a tela abre com
 *   o sorteio de verdade → marcar → pegar → a carta entra na mão → o regador muda
 *
 * O que ele guarda, e por quê:
 *
 * - A GOTA SE PEGA PISANDO, e só pisando: sem a carta "Bolso furado" ela não
 *   vem até você (§7 do plano — é o que tira o jogador do lugar confortável);
 * - A TELA NÃO FECHA SEM ESCOLHA. O Escape não faz nada: subir de nível sem
 *   pegar carta seria perder a melhoria por acidente;
 * - A ESCOLHA É EM DOIS TEMPOS: marcar não pega. Com um toque só, quem estava
 *   lendo pegaria a carta errada, e ela não sai mais da mão;
 * - CADA CARTA MOSTRA TUDO o que o jogador precisa para escolher: moldura da
 *   raridade, fita da família, emoji, nome, texto e as pedrinhas;
 * - NO CELULAR NADA SAI DA TELA e o botão não tapa carta nenhuma — a regra do
 *   `celular.mjs`, aplicada a esta tela.
 *
 * E tira as fotos que importam para o Renan validar o desenho: uma mesa de cada
 * raridade (incluindo a lendária e o consolo, que o sorteio raramente mostra),
 * no computador e no celular.
 *
 * Uso: node scripts/gotas.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './gotas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const problemas = [];
const erros = [];

const abrir = async (largura, altura) => {
  const page = await browser.newPage({ viewport: { width: largura, height: altura } });
  page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await page.goto(`${BASE}/?cena=estufa&treino=gotas&em=0,2`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3600);
  await page.mouse.click(largura / 2, altura / 2);
  await page.waitForTimeout(300);
  return page;
};

const estado = (page) =>
  page.evaluate(() => window.jogo.current.world.root.userData.estadoDoTreino());
const telaAberta = (page) =>
  page.evaluate(() => document.querySelector('.cartas-do-jardim')?.classList.contains('show'));

/** onde está cada gota no chão, lido da cena */
const gotasNoChao = (page) =>
  page.evaluate(() => {
    const achadas = [];
    window.jogo.current.world.root.traverse((o) => {
      if (o.userData?.peca === 'gota-de-experiencia' && o.parent?.userData?.peca === 'gotas-do-jardim') {
        achadas.push([+o.position.x.toFixed(2), +o.position.z.toFixed(2)]);
      }
    });
    return achadas;
  });

/** solta `n` gotas num ponto e espera elas pousarem */
const soltar = async (page, x, z, n) => {
  await page.evaluate(
    ([px, pz, q]) => window.jogo.current.world.root.userData.soltarGotas(px, pz, q),
    [x, z, n],
  );
  await page.waitForTimeout(2200);
};

/** pisa em cada gota, uma por uma */
const pisarEmTodas = async (page) => {
  for (let volta = 0; volta < 4; volta++) {
    const lista = await gotasNoChao(page);
    if (!lista.length) return;
    for (const [x, z] of lista) {
      await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
      await page.waitForTimeout(500);
      if (await telaAberta(page)) return;
    }
  }
};

// ======================================================= 1. no computador
const page = await abrir(1280, 820);

const barra = await page.evaluate(() => {
  const el = document.querySelector('.experiencia');
  return { mostra: el?.classList.contains('show'), texto: el?.textContent?.trim() };
});
if (!barra.mostra) problemas.push('a barra de experiência não apareceu no treino');

// o treino solta gotas sozinho; pausamos ele deixando só as nossas contarem
const antes = await estado(page);

// --- a gota NÃO vem sozinha: soltar longe e esperar não pega nada
const eu0 = await page.evaluate(() => window.jogo.playerPosition());
await soltar(page, eu0.x + 3.5, eu0.z, 2);
const depoisDeEsperar = await estado(page);
if (depoisDeEsperar.juntadas > antes.juntadas) {
  problemas.push('uma gota a 3,5 m veio sozinha, sem a carta "Bolso furado"');
}

await page.screenshot({ path: `${OUT}-chao.png` });

// --- pisar pega: junta até subir de nível
await soltar(page, eu0.x + 2, eu0.z + 1, 6);
await pisarEmTodas(page);
for (let i = 0; i < 20 && !(await telaAberta(page)); i++) {
  await soltar(page, eu0.x + 1.5, eu0.z - 1, 3);
  await pisarEmTodas(page);
}
const aoAbrir = await estado(page);
console.log(`juntadas: ${aoAbrir.juntadas} · nível ${aoAbrir.nivel} · escolhendo ${aoAbrir.escolhendo}`);
if (!(await telaAberta(page))) {
  problemas.push('juntou gotas e a tela das cartas não abriu');
} else {
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}-tela.png` });

  // --- cada carta mostra tudo
  const cartas = await page.evaluate(() =>
    [...document.querySelectorAll('.cartas-do-jardim .carta-jardim')].map((el) => ({
      classes: el.className,
      fita: el.querySelector('.fita')?.textContent?.trim(),
      emoji: el.querySelector('.emoji')?.textContent?.trim(),
      nome: el.querySelector('.nome')?.textContent?.trim(),
      texto: el.querySelector('.texto')?.textContent?.trim(),
      raridade: el.querySelector('.raridade')?.textContent?.trim(),
      pedras: el.querySelectorAll('.pedras i.cheia').length,
      selo: !!el.querySelector('.selo.regador'),
    })),
  );
  for (const c of cartas) console.log(`  [${c.raridade}] ${c.fita} · ${c.emoji} ${c.nome} — ${c.texto}`);
  if (cartas.length !== 3) problemas.push(`a mesa tem ${cartas.length} cartas, e não 3`);
  for (const c of cartas) {
    if (!/r-(comum|incomum|raro|lendario|consolo)/.test(c.classes)) problemas.push(`carta sem moldura de raridade: ${c.nome}`);
    if (!c.fita || !c.emoji || !c.nome || !c.texto || !c.raridade) problemas.push(`carta com peça faltando: ${JSON.stringify(c)}`);
    if (c.pedras < 1) problemas.push(`carta sem pedrinha de raridade: ${c.nome}`);
  }

  // --- o Escape NÃO fecha
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  if (!(await telaAberta(page))) problemas.push('o Escape fechou a tela das cartas sem escolha');

  // --- marcar NÃO pega (dois tempos)
  await page.keyboard.press('Digit2');
  await page.waitForTimeout(500);
  const marcada = await page.evaluate(() =>
    document.querySelector('.cartas-do-jardim .carta-jardim.marcada')?.getAttribute('data-i'),
  );
  if (marcada !== '1') problemas.push(`a tecla 2 não marcou a segunda carta (marcou ${marcada})`);
  if (!(await telaAberta(page))) problemas.push('marcar uma carta já fechou a tela — era para ser em dois tempos');
  /**
   * A MARCADA SOBE DE VERDADE — a animação de entrada não pode segurar o lugar
   * dela (foi um defeito real: com `forwards` ela nunca subia).
   *
   * O teste ESPERA a subida, e não mede depois de um tempo fixo: o Chromium sem
   * tela desenha devagar, e a transição de 0,22 s levava mais de meio segundo
   * aqui. Medir cedo reprovava uma carta que subia direitinho.
   */
  let subiu = 0;
  for (let i = 0; i < 20 && subiu > -6; i++) {
    await page.waitForTimeout(200);
    subiu = await page.evaluate(() => {
      const [a, b] = [...document.querySelectorAll('.cartas-do-jardim .carta-jardim')].slice(0, 2);
      return b.getBoundingClientRect().top - a.getBoundingClientRect().top;
    });
  }
  if (subiu > -6) problemas.push(`a carta marcada não subiu na mesa (diferença de ${subiu.toFixed(1)} px)`);
  await page.screenshot({ path: `${OUT}-marcada.png` });

  const idEsperado = await page.evaluate(() => {
    const el = document.querySelector('.cartas-do-jardim .carta-jardim.marcada');
    return el?.getAttribute('aria-label');
  });
  const tinhaSelo = cartas[1]?.selo;

  // --- E pega
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1200);
  if (await telaAberta(page)) problemas.push('o E não pegou a carta marcada');
  const depois = await estado(page);
  console.log(`na mão: ${depois.mao.join(', ') || '(nada)'} · pegou "${idEsperado}"`);
  if (depois.mao.length !== 1 && !/consolo/i.test(cartas[1]?.raridade ?? '')) {
    problemas.push(`a carta pega não entrou na mão (mão: ${JSON.stringify(depois.mao)})`);
  }

  // --- a carta que muda o regador muda a peça da mão
  await page.waitForTimeout(600);
  const estilo = await page.evaluate(() => {
    let achado = null;
    window.jogo.player.object.traverse((o) => {
      if (!achado && o.userData?.peca === 'regador' && o.userData.estilo) achado = o.userData.estilo;
    });
    return achado;
  });
  if (!estilo) {
    problemas.push('o regador não está na mão durante o treino');
  } else if (tinhaSelo) {
    const mudou = Object.entries(estilo).some(([k, v]) => k !== 'estagio' && (v === true || (typeof v === 'number' && v > 0)));
    if (!mudou) problemas.push('a carta com o selo "muda o regador" não mudou a peça da mão');
  }
}

// ========================= 2. a vitrine: uma mesa de cada raridade, no computador
/**
 * O sorteio raramente mostra uma lendária, e nunca mostra um consolo com o
 * baralho cheio. Para o Renan validar o desenho das quatro molduras, o teste
 * monta a mesa à mão, com cartas de verdade do baralho.
 */
const vitrine = async (pg, ids, arquivo) => {
  await pg.evaluate((lista) => {
    const todas = window.aristoryCartas;
    const cartas = lista.map((id) => todas.find((c) => c.id === id));
    void window.jogo.escolherCartaDoJardim(cartas, {
      nivel: 7,
      mao: todas.slice(0, 6).map((c) => ({ id: c.id, nome: c.nome, icone: c.icone, raridade: c.raridade })),
    });
  }, ids);
  await pg.waitForTimeout(1600);
  await pg.screenshot({ path: arquivo });
};
const fechar = async (pg) => {
  await pg.keyboard.press('Digit1');
  await pg.waitForTimeout(300);
  await pg.keyboard.press('KeyE');
  await pg.waitForTimeout(900);
};

const MESA_A = ['bico-2', 'orvalho', 'pressao'];               // comum (série), incomum, rara
const MESA_B = ['chuva', 'os-dois-na-frente', 'gole-de-agua']; // lendária, lendária, consolo
// os tres textos mais compridos do baralho, um de cada familia: a mesa mais alta
const MESA_C = ['agua-com-sabao', 'troca-de-turno', 'planta-carnivora'];

await vitrine(page, MESA_A, `${OUT}-vitrine-a.png`);
await fechar(page);
await vitrine(page, MESA_B, `${OUT}-vitrine-b.png`);
await fechar(page);
await vitrine(page, MESA_C, `${OUT}-vitrine-c.png`);
await fechar(page);
await page.close();

// ================================================ 3. no celular, em pé
const cel = await abrir(390, 844);
await vitrine(cel, MESA_A, `${OUT}-celular-a.png`);

const medir = async (mesa) => {
  const medidas = await cel.evaluate(() => {
    const vw = window.innerWidth;
    const cartas = [...document.querySelectorAll('.cartas-do-jardim .carta-jardim')].map((el) => el.getBoundingClientRect());
    const botao = document.querySelector('.cartas-do-jardim .pegar').getBoundingClientRect();
    const textos = [...document.querySelectorAll('.cartas-do-jardim .texto')].map(
      (el) => el.scrollWidth <= el.clientWidth + 1,
    );
    return {
      vw,
      fora: cartas.filter((r) => r.left < -1 || r.right > vw + 1).length,
      sobrepoe: cartas.filter((r) => !(botao.bottom <= r.top || botao.top >= r.bottom)).length,
      textosInteiros: textos.every(Boolean),
      alturas: cartas.map((r) => Math.round(r.height)),
    };
  });
  console.log(`celular ${mesa}: ${JSON.stringify(medidas)}`);
  if (medidas.fora) problemas.push(`${mesa}: ${medidas.fora} carta(s) saem da tela do celular`);
  if (medidas.sobrepoe) problemas.push(`${mesa}: o botão "pegar" tapa ${medidas.sobrepoe} carta(s) no celular`);
  if (!medidas.textosInteiros) problemas.push(mesa + ': um texto de carta vaza para o lado no celular');
};
await medir('a');

await fechar(cel);
await vitrine(cel, MESA_B, `${OUT}-celular-b.png`);
await fechar(cel);
await vitrine(cel, MESA_C, `${OUT}-celular-c.png`);
await medir('c');
await cel.close();

// ------------------------------------------------------------------ relatório
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
process.exit(0);
