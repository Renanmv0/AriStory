/**
 * A JOSEFINA DENTRO DA ESTUFA — ela entra junto, passeia, e é ela quem começa.
 *
 * O desenho é do Renan: depois de ela contar das pragas, TODA VEZ que a dupla
 * entra na estufa ela entra atrás, e fica passeando perto das plantas. Para
 * jogar, fala-se com ela, e ela pede CONFIRMAÇÃO. Dizendo que sim, quem não
 * está sendo controlado fica LÁ ATRÁS com ela, e só quem joga vai para a frente.
 *
 * O que o teste cobra, na ordem:
 *
 * 1. ANTES do convite ela não está na estufa (é a cutscene das pragas que a
 *    traz pela primeira vez), e não há prompt de conversa.
 * 2. DEPOIS do convite ela nasce do lado de FORA da porta e atravessa a
 *    soleira — medido pela posição, e não pela foto.
 * 3. Ela passeia na metade da porta (perto das plantas) e NUNCA pisa num
 *    canteiro: amostrado por meio minuto de jogo.
 * 4. "Agora não" encerra sem mexer em ninguém.
 * 5. Sem regador na mão ela manda buscar, e a rodada não começa.
 * 6. Com o regador, o parceiro ANDA até o posto de trás, ao lado dela, e os
 *    dois ficam virados para os portões; o jogador continua solto.
 * 7. Ela avisa ("água neles") e a RODADA começa; encerrada, ela fala do fim
 *    da primeira leva e ninguém fica preso.
 *
 * Uso: node scripts/postos.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './postos';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com `scenes/estufa.ts` */
const PORTA_Z = 11;
const POSTO_DO_PARCEIRO = { x: 1.0, z: 6.8 };
const POSTO_DA_JOSEFINA = { x: -1.0, z: 6.8 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 760 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
const problemas = [];

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3600);
await page.mouse.click(500, 380);
await page.waitForTimeout(400);

const prompt = async () =>
  (await page.locator('.prompt.show').count())
    ? await page.locator('.prompt .label').textContent()
    : '';

const venceAFala = async (limite = 40) => {
  const ditas = [];
  for (let i = 0; i < limite; i++) {
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && t.length > 2 && ditas[ditas.length - 1] !== t) ditas.push(t);
    if (!(await page.locator('.dialogue.show').count())) break;
    // pergunta aberta: quem decide e o teste, nao o E
    if (await page.locator('.dialogue .escolhas button').count()) break;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(560);
  }
  return ditas;
};

const esperarPergunta = async (segundos = 20) => {
  for (let i = 0; i < segundos * 2; i++) {
    const n = await page.locator('.dialogue .escolhas button').count();
    if (n) return page.locator('.dialogue .escolhas button').allTextContents();
    if (await page.locator('.dialogue.show').count()) {
      await page.keyboard.press('KeyE');
    }
    await page.waitForTimeout(500);
  }
  return null;
};

const entrarNaEstufa = async () => {
  await page.evaluate(() => window.jogo.goTo('estufa', 'do-jardim'));
  await page.waitForTimeout(2200);
};

/** a tartaruga da cena, e onde ela esta */
const josefina = () => page.evaluate(() => {
  let j = null;
  window.jogo.current.world.root.traverse((o) => {
    if (!j && o.userData?.peca === 'josefina') j = o;
  });
  if (!j) return null;
  return { x: +j.position.x.toFixed(2), z: +j.position.z.toFixed(2), visivel: j.visible };
});

/** encosta a dupla na Josefina, do lado do terreiro, e devolve o prompt */
const encostarNela = async () => {
  const j = await josefina();
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI), [j.x, j.z - 1.1]);
  await page.waitForTimeout(700);
  return prompt();
};

// ============================================= 1. antes do convite: ninguém
await page.evaluate(() => window.jogo.setFlag('adubo-entregue'));
await entrarNaEstufa();
{
  const j = await josefina();
  if (j?.visivel) problemas.push('antes do convite a Josefina já estava na estufa');
  await page.evaluate(() => window.jogo.debugPlace(0.5, 6, Math.PI));
  await page.waitForTimeout(600);
  if (/josefina/i.test(await prompt())) problemas.push('antes do convite já dava para falar com ela');
}

// ================================ 2. depois do convite: ela entra atrás da dupla
await page.evaluate(() => {
  window.jogo.setFlag('jardim.convite');
  window.jogo.goTo('clube', 'da-estufa');
});
await page.waitForTimeout(2000);
await page.evaluate(() => window.jogo.goTo('estufa', 'do-jardim'));
await page.waitForTimeout(700);
{
  const j = await josefina();
  console.log('ao entrar, a Josefina esta em', j);
  if (!j?.visivel) problemas.push('depois do convite ela não aparece na estufa');
  else if (j.z < PORTA_Z) problemas.push(`ela já nasceu do lado de dentro (z ${j.z}), sem atravessar a porta`);
}
await page.screenshot({ path: `${OUT}-entrando.png` });

// espera ela cruzar a soleira. O relogio de JOGO no Chromium sem tela anda a
// uns 1/5 do de parede, entao os seis segundos da travessia viram meio minuto
let dentro = false;
for (let i = 0; i < 180 && !dentro; i++) {
  await page.waitForTimeout(500);
  const j = await josefina();
  dentro = j && j.z < PORTA_Z - 3;
}
if (!dentro) problemas.push('ela não atravessou a porta para dentro da estufa');
await page.screenshot({ path: `${OUT}-dentro.png` });

// ============================== 3. ela passeia perto das plantas, sem pisar em nada
{
  const pontos = await page.evaluate(() => window.jogo.current.world.root.userData.pontosDoJardim);
  const noCanteiro = (x, z) => pontos.canteiros.some((c) => {
    const deitado = Math.abs(c.x) > 11;
    const [mx, mz] = deitado ? [0.8, 1.6] : [1.6, 0.8];
    return Math.abs(x - c.x) < mx && Math.abs(z - c.z) < mz;
  });
  // afasta a dupla, para nada ficar no caminho dela
  await page.evaluate(() => window.jogo.debugPlace(0, -4, Math.PI));
  let pisou = 0;
  let foraDaArea = 0;
  const vistos = [];
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(500);
    const j = await josefina();
    vistos.push(j);
    if (noCanteiro(j.x, j.z)) pisou++;
    if (j.z < 0.8 || Math.abs(j.x) > 12.6) foraDaArea++;
  }
  const andou = Math.max(...vistos.map((v) => Math.hypot(v.x - vistos[0].x, v.z - vistos[0].z)));
  console.log(`passeio: andou ate ${andou.toFixed(2)} m do ponto de partida`);
  if (pisou) problemas.push(`ela pisou num canteiro em ${pisou} amostras`);
  if (foraDaArea) problemas.push(`ela saiu da metade das plantas em ${foraDaArea} amostras`);
  if (andou < 0.4) problemas.push('ela não passeou nada lá dentro');
}

// ================================================ 4. "agora não" não mexe em nada
{
  const r = await encostarNela();
  if (!/falar com a josefina/i.test(r)) problemas.push(`perto dela o prompt é "${r}"`);
  await page.keyboard.press('KeyE');
  const opcoes = await esperarPergunta();
  console.log('ela pergunta:', opcoes);
  if (!opcoes || opcoes.length !== 2) {
    problemas.push('ela não pediu confirmação com duas opções');
  } else {
    await page.locator('.dialogue .escolhas button').nth(1).click();
    await page.waitForTimeout(600);
    const resto = (await venceAFala()).join(' ');
    if (!/chamar/i.test(resto)) problemas.push('o "agora não" não teve resposta dela');
  }
}

// ================================================= 5. sem regador, não começa
{
  await encostarNela();
  await page.keyboard.press('KeyE');
  const opcoes = await esperarPergunta();
  if (opcoes) {
    await page.locator('.dialogue .escolhas button').nth(0).click();
    await page.waitForTimeout(600);
    const resto = (await venceAFala()).join(' ');
    if (!/regador/i.test(resto)) problemas.push('sem regador ela não mandou buscar o regador');
    const p = await page.evaluate(() => window.jogo.companionPosition());
    if (Math.hypot(p.x - POSTO_DO_PARCEIRO.x, p.z - POSTO_DO_PARCEIRO.z) < 0.6) {
      problemas.push('sem regador o parceiro foi para o posto mesmo assim');
    }
  } else {
    problemas.push('a segunda conversa não abriu a pergunta');
  }
}

// ================================ 6. com o regador: cada um no seu posto
{
  await page.evaluate(() => window.jogo.addItem(window.aristoryItens.regador));
  await encostarNela();
  await page.keyboard.press('KeyE');
  const opcoes = await esperarPergunta();
  if (!opcoes) {
    problemas.push('com o regador a pergunta não abriu');
  } else {
    await page.locator('.dialogue .escolhas button').nth(0).click();
    await page.waitForTimeout(600);
    // vence as falas ate o parceiro chegar e falar do posto. Entre as falas
    // ha um silencio longo (o parceiro andando ate la), entao o laco so
    // desiste depois de muito tempo sem balao nenhum
    const ditas = [];
    let foto = false;
    let semBalao = 0;
    for (let i = 0; i < 400 && semBalao < 120; i++) {
      const t = await page.locator('.dialogue .text').textContent().catch(() => '');
      if (!foto && /vai lá/i.test(t)) {
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${OUT}-postos.png` });
        foto = true;
        const p = await page.evaluate(() => window.jogo.companionPosition());
        const dist = Math.hypot(p.x - POSTO_DO_PARCEIRO.x, p.z - POSTO_DO_PARCEIRO.z);
        console.log(`parceiro no posto: a ${dist.toFixed(2)} m`);
        if (dist > 0.6) problemas.push(`o parceiro não chegou no posto de trás (a ${dist.toFixed(2)} m)`);
        const eu = await page.evaluate(() => window.jogo.playerPosition());
        if (eu.z > 6) problemas.push('quem joga foi parar no posto de trás');
      }
      if (await page.locator('.dialogue.show').count()) {
        semBalao = 0;
        if (t && t.length > 2 && ditas[ditas.length - 1] !== t) ditas.push(t);
        await page.keyboard.press('KeyE');
        await page.waitForTimeout(560);
      } else {
        semBalao++;
        // a fala final ja saiu e o balao fechou: a rodada comecou
        if (ditas.some((d) => /água neles/i.test(d))) break;
        await page.waitForTimeout(500);
      }
    }
    if (!foto) problemas.push('o parceiro nunca disse que ficou lá atrás');
    const j = await josefina();
    const dj = Math.hypot(j.x - POSTO_DA_JOSEFINA.x, j.z - POSTO_DA_JOSEFINA.z);
    console.log(`Josefina no posto: a ${dj.toFixed(2)} m`);
    if (dj > 0.6) problemas.push(`a Josefina não chegou no posto dela (a ${dj.toFixed(2)} m)`);
    if (!/três portões|tres portoes/i.test(ditas.join(' '))) {
      problemas.push('ela não explicou de onde os dois de trás olham');
    }
    /*
     * DEPOIS DOS POSTOS A RODADA COMEÇA (etapa 3). Este teste não joga a
     * rodada — quem joga é o `rodada.mjs` —: ele confere que ela ligou e a
     * encerra na hora, para seguir conferindo que ninguém fica preso.
     */
    const ligou = await page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado().rodando);
    console.log(`a rodada começou: ${ligou}`);
    if (!ligou) problemas.push('depois dos postos a rodada não começou');
    await page.evaluate(() => window.jogo.current.world.root.userData.rodada.terminar());
    await page.waitForTimeout(600);
    const fim = (await venceAFala()).join(' ');
    if (!/primeira leva/i.test(fim)) problemas.push('no fim da rodada a Josefina não falou');
  }
  // o jogador continua solto depois. Anda ATE sair do lugar (com teto), e nao
  // por 900 ms: com a maquina carregada o relogio do jogo anda devagar, e o
  // tempo fixo reprovava um jogador que estava solto
  const antes = await page.evaluate(() => window.jogo.playerPosition());
  let andou = 0;
  await page.keyboard.down('KeyW');
  for (let i = 0; i < 20 && andou < 0.4; i++) {
    await page.waitForTimeout(250);
    const agora = await page.evaluate(() => window.jogo.playerPosition());
    andou = Math.hypot(agora.x - antes.x, agora.z - antes.z);
  }
  await page.keyboard.up('KeyW');
  const travado = await page.evaluate(() => window.jogo.player.locked === true);
  if (travado || andou < 0.4) {
    problemas.push(`o jogador ficou travado depois de assumir os postos (andou ${andou.toFixed(2)} m)`);
  }
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
