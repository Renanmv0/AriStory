/**
 * AS FALAS DE PRÊMIO — o dono reparando na roupa que ele mesmo deu.
 *
 * Ganhar a peça é metade do presente; a outra metade é o Cookie ver o próprio
 * quepe na cabeça de alguém. O que este teste guarda:
 *
 * - **CADA UM FALA A SUA.** Vestido o prêmio dele, o bicho abre a cena grande
 *   em vez do "oi" de sempre — e a cena é DELE, não uma fala genérica com o
 *   nome trocado.
 * - **SEM A ROUPA, NADA MUDA.** É a metade que um teste de fala esquece: uma
 *   condição invertida faria os quatro falarem do prêmio o tempo todo, e a
 *   foto não acusa isso.
 * - **A CENA GRANDE ACONTECE UMA VEZ SÓ.** Na segunda conversa entra a fala
 *   curta do rodízio. Quem já viu a cena não pode ser obrigado a rever.
 * - **A PEÇA DO PARCEIRO TAMBÉM CONTA.** O prêmio é do casal; basta um dos
 *   dois estar vestindo.
 *
 * Uso: node scripts/falas.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './falas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/**
 * Quem fala, o que ele dá, e a marca da cena grande dele.
 *
 * A `marca` é uma frase que SÓ existe na fala de prêmio daquele bicho: sem
 * isso o teste passaria com qualquer diálogo na tela.
 */
const QUEM = [
  {
    id: 'jean-luc', peca: 'jaqueta-jean-luc', bicho: 'jean-luc',
    prompt: /Jean-Luc/i, marca: /petit canard|ATTENDEZ/i, curta: /jaqueta|patinho|Liberté|bom em vocês/i,
  },
  {
    id: 'cookie', peca: 'quepe-cookie', bicho: 'cookie',
    prompt: /Cookie/i, marca: /meu quepe/i, curta: /aba|estrelinha|quepe|azul/i,
  },
  {
    id: 'mano', peca: 'patins-mano', bicho: 'mano',
    prompt: /Mano/i, marca: /OS PATINS/i, curta: /casquinha|pista|patins|Roda uma vez/i,
  },
  {
    id: 'estella', peca: 'blazer-xadrez', bicho: 'estella',
    prompt: /Estella/i, marca: /sem encomenda|Para aí/i, curta: /casa preta|dama|bota|lapela/i,
  },
];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 980, height: 820 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-12.4,22&zoom=10`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

/*
 * O ESTADO DE QUEM JÁ JOGOU COM TODO MUNDO, escrito direto — e o RELOAD.
 *
 * As partidas de verdade são de `duelo.mjs` e `quadro.mjs`; aqui o que está
 * em teste é a FALA, e jogar quatro partidas de cinco pontos para chegar nela
 * levaria vinte minutos de relógio sem provar nada a mais.
 *
 * O reload depois das flags NÃO é enfeite. O Jean-Luc só nasce na arena para
 * quem já o conhece — quem não conhece nem vê o pato, e o ponto de fala dele
 * nasce desligado. Isso é lido UMA VEZ, na montagem da cena, então escrever a
 * flag com a cena já de pé não acorda ninguém: é preciso montar de novo.
 *
 * Os dois sorvetes na mão entram pelo mesmo motivo do bilhete do Cookie: sem
 * eles, falar com o Mano abre a cutscene inteira do primeiro pedido (com
 * câmera, dança e tudo), e ela é mais longa que a paciência do teste.
 */
await page.evaluate(() => {
  const j = window.jogo;
  for (const f of [
    'cookie-apresentado', 'cookie-falou-do-uniforme', 'mano-conhecido', 'mano-atendeu',
    'estella-conhecida', 'jean-luc-conhecido', 'jean-luc-batido',
    'batido-jean-luc', 'batido-cookie', 'batido-mano', 'batido-estella',
  ]) j.setFlag(f);
  j.addItem(window.aristoryItens['bilhete-roda']);
  j.addItem(window.aristoryItens['sorvete-morango'], 'ari');
  j.addItem(window.aristoryItens['sorvete-maracuja'], 'renan');
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

/** onde cada bicho está agora, pela etiqueta que a cena põe nele */
const ondeEsta = (peca) =>
  page.evaluate((p) => {
    let achado = null;
    window.jogo.current.world.root.traverse((n) => {
      if (n.userData?.peca === p) achado = n;
    });
    return achado ? [+achado.position.x.toFixed(2), +achado.position.z.toFixed(2)] : null;
  }, peca);

/** põe (ou tira) a peça no corpo de alguém */
const vestir = (peca, quem) =>
  page.evaluate(([p, q]) => {
    const j = window.jogo;
    for (const v of j.wearables(q)) if (v) j.removeItem(v.id, q);
    return j.equipWearable(window.aristoryItens[p], q);
  }, [peca, quem]);

const despirTodos = () =>
  page.evaluate(() => {
    const j = window.jogo;
    for (const q of ['ari', 'renan']) {
      for (const v of j.wearables(q)) if (v) j.removeItem(v.id, q);
    }
  });

/**
 * Chega perto, abre a conversa e devolve TUDO que foi dito.
 *
 * O `E` avança a fala e também escolhe a primeira opção de um `ask`, então a
 * Estella (que pergunta "jogar xadrez ou só um oi" depois de reparar na
 * roupa) precisa do clique no botão certo — senão o teste entra numa partida
 * de xadrez em vez de ler a fala.
 */
const conversarCom = async (x, z, prompt) => {
  // primeiro FECHA o que estiver aberto: com um balão na tela não há prompt
  // nenhum, e a leitura sairia vazia sem dizer por quê
  for (let i = 0; i < 60; i++) {
    if (!(await page.locator('.dialogue.show').count())) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(300);
  }
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
  let texto = '';
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(250);
    texto = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
    if (prompt.test(texto)) break;
  }
  if (!prompt.test(texto)) return { prompt: texto, falas: [] };

  await page.keyboard.press('KeyE');
  const falas = [];
  // a cutscene de um bicho passa de trinta falas com espera de câmera no meio:
  // um teto curto aqui fecharia a leitura no meio da conversa, e a LEITURA
  // SEGUINTE herdaria a cauda desta como se fosse resposta
  for (let i = 0; i < 200; i++) {
    await page.waitForTimeout(320);
    if (!(await page.locator('.dialogue.show').count())) break;
    const t = (await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '';
    if (t && t.length > 2 && falas[falas.length - 1] !== t) falas.push(t);
    // um `ask` na tela: "Só um oi" é a saída que não entra em minigame
    const botoes = page.locator('.dialogue .escolhas.show button');
    if (await botoes.count()) {
      const rotulos = await botoes.allTextContents();
      const oi = rotulos.findIndex((r) => /oi|agora não|não/i.test(r));
      await botoes.nth(oi >= 0 ? oi : rotulos.length - 1).click();
      await page.waitForTimeout(400);
      continue;
    }
    await page.keyboard.press('KeyE');
  }
  await page.waitForTimeout(400);
  return { prompt: texto, falas };
};

const resultado = [];
for (const q of QUEM) {
  const onde = await ondeEsta(q.bicho);
  if (!onde) {
    resultado.push({ ...q, erro: 'nao achei o bicho na cena' });
    continue;
  }
  const [x, z] = onde;

  // 1. SEM a roupa: tem que ser a conversa de sempre
  await despirTodos();
  await page.waitForTimeout(500);
  const semRoupa = await conversarCom(x, z + 1.0, q.prompt);

  // 2. COM a roupa, a primeira vez: a cena grande
  await vestir(q.peca, 'ari');
  await page.waitForTimeout(700);
  const primeira = await conversarCom(x, z + 1.0, q.prompt);

  // 3. COM a roupa, de novo: a curta do rodízio
  const segunda = await conversarCom(x, z + 1.0, q.prompt);

  // 4. e a peça no PARCEIRO também vale — o prêmio é do casal
  await despirTodos();
  await vestir(q.peca, 'renan');
  await page.waitForTimeout(700);
  const noParceiro = await conversarCom(x, z + 1.0, q.prompt);

  resultado.push({ ...q, semRoupa, primeira, segunda, noParceiro });
  await page.screenshot({ path: `${OUT}-${q.id}.png` });
}
await despirTodos();

// ----------------------------------------------------------------- veredito
const falhas = [];
for (const r of resultado) {
  if (r.erro) { falhas.push(`${r.id}: ${r.erro}`); continue; }
  if (!r.semRoupa.falas.length) falhas.push(`${r.id}: sem a roupa, ele nao falou nada`);
  if (r.semRoupa.falas.some((f) => r.marca.test(f))) {
    falhas.push(`${r.id}: falou do premio SEM a roupa vestida`);
  }
  if (!r.primeira.falas.some((f) => r.marca.test(f))) {
    falhas.push(`${r.id}: a cena do premio nao saiu: ${JSON.stringify(r.primeira.falas.slice(0, 3))}`);
  }
  if (r.segunda.falas.some((f) => r.marca.test(f))) {
    falhas.push(`${r.id}: a cena grande repetiu na segunda conversa`);
  }
  if (!r.segunda.falas.some((f) => r.curta.test(f))) {
    falhas.push(`${r.id}: a fala curta do rodizio nao saiu: ${JSON.stringify(r.segunda.falas)}`);
  }
  if (!r.noParceiro.falas.some((f) => r.curta.test(f) || r.marca.test(f))) {
    falhas.push(`${r.id}: com a peca no parceiro ele nao reparou: ${JSON.stringify(r.noParceiro.falas)}`);
  }
}
falhas.push(...erros);

for (const r of resultado) {
  console.log(`— ${r.id}`);
  if (r.erro) { console.log('  ', r.erro); continue; }
  console.log('   sem a roupa:', JSON.stringify(r.semRoupa.falas.slice(0, 2)));
  console.log('   vestido (1a):', JSON.stringify(r.primeira.falas.slice(0, 3)));
  console.log('   vestido (2a):', JSON.stringify(r.segunda.falas.slice(0, 2)));
  console.log('   no parceiro:', JSON.stringify(r.noParceiro.falas.slice(0, 2)));
}

if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  await browser.close();
  process.exit(1);
}
console.log('\nsem erros');
await browser.close();
