/**
 * Deitar junto na cama do quarto do Ari.
 *
 * O que este teste guarda:
 * - os dois deitam na MESMA âncora, e ela é a que gira o corpo (-90° em X);
 * - eles ficam LADO A LADO (separados em x, na mesma profundidade) e deitados
 *   ao COMPRIMENTO da cama — cabeça na cabeceira, pés para o pé da cama;
 * - o corpo fica ACIMA do colchão, e não afundado nele;
 * - os braços MEXEM: duas leituras em instantes diferentes têm que diferir, e
 *   os dois lados têm que estar em sinais opostos (a pegadinha de sinal do
 *   braço esquerdo, que já causou bug quatro vezes neste repositório);
 * - levantar desfaz tudo: pose zerada, os dois de volta ao chão e o movimento
 *   destravado.
 *
 * Uso: node scripts/cama.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './cama';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

/** a pose dos dois, medida no mundo */
const pose = () =>
  page.evaluate(() => {
    const j = window.jogo;
    // matrixWorld direto: o Vector3 do three não está exposto no window
    const onde = (o) => {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      return [+e[12].toFixed(3), +e[13].toFixed(3), +e[14].toFixed(3)];
    };
    const um = (quem) => {
      const rig = j[quem].rig;
      return {
        raiz: onde(rig.group),
        cabeca: onde(rig.head),
        quadril: onde(rig.legL),
        // o que prova o balanço: as rotações vivas dos dois braços
        bracoE: [+rig.armL.rotation.x.toFixed(4), +rig.armL.rotation.z.toFixed(4)],
        bracoD: [+rig.armR.rotation.x.toFixed(4), +rig.armR.rotation.z.toFixed(4)],
        pernaE: [+rig.legL.rotation.x.toFixed(4), +rig.legL.rotation.z.toFixed(4)],
        // a âncora é quem vira o corpo; sem ela girada ninguém está deitado
        giroDoPai: +(j[quem].object.parent?.rotation?.x ?? 0).toFixed(3),
      };
    };
    return { jogador: um('player'), parceiro: um('parceiro') };
  });

// ------------------------------------------------- 1. chegar e aceitar deitar
await page.evaluate(() => window.jogo.debugPlace(-2.2, -0.3, Math.PI));
await page.waitForTimeout(900);
const prompt = await page.locator('.prompt .label').textContent().catch(() => '');
const dePe = await pose();

await page.keyboard.press('KeyE');
await page.waitForTimeout(1100);
const pergunta = await page.locator('.dialogue .text').textContent().catch(() => '');
const opcoes = await page.locator('.escolhas button').allTextContents();
await page.keyboard.press('KeyE'); // a primeira opção já vem selecionada
await page.waitForTimeout(2600);
await page.screenshot({ path: `${OUT}-deitado.png` });

const deitado = await pose();

// ------------------------------------------------------ 2. os braços mexem
await page.waitForTimeout(1400);
const maisTarde = await pose();
await page.screenshot({ path: `${OUT}-depois.png` });

const mexeu = (a, b) =>
  Math.abs(a.bracoE[1] - b.bracoE[1]) + Math.abs(a.bracoD[1] - b.bracoD[1]);
const balancoJogador = +mexeu(deitado.jogador, maisTarde.jogador).toFixed(4);
const balancoParceiro = +mexeu(deitado.parceiro, maisTarde.parceiro).toFixed(4);

// ------------------------------------------------------------- 3. levantar
// vence as falas e escolhe "Levantar" na segunda pergunta
for (let i = 0; i < 12; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  if (await page.locator('.escolhas button').count()) {
    await page.locator('.escolhas button').last().click(); // "Levantar"
  } else {
    await page.keyboard.press('KeyE');
  }
  await page.waitForTimeout(850);
}
await page.waitForTimeout(1600);
const dePeDeNovo = await pose();
await page.screenshot({ path: `${OUT}-levantou.png` });

const andou = await page.evaluate(async () => {
  const antes = window.jogo.player.object.position.z;
  return { antes: +antes.toFixed(2) };
});
await page.keyboard.down('KeyS');
await page.waitForTimeout(800);
await page.keyboard.up('KeyS');
const depoisDeAndar = await page.evaluate(() => +window.jogo.player.object.position.z.toFixed(2));

const noDiario = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? [])
    .some((m) => m.id === 'deitar-junto'),
);

// ------------------------------------------------------------------ relatório
const cabecaEPes = (p) => `cabeça z=${p.cabeca[2]} · quadril z=${p.quadril[2]}`;
console.log('1. prompt:', JSON.stringify(prompt));
console.log('   pergunta:', JSON.stringify(pergunta), '·', JSON.stringify(opcoes));
console.log('2. deitados · giro da âncora:', deitado.jogador.giroDoPai,
  '(tem que ser -1.571)');
console.log('   jogador  ·', cabecaEPes(deitado.jogador), '· altura', deitado.jogador.raiz[1]);
console.log('   parceiro ·', cabecaEPes(deitado.parceiro), '· altura', deitado.parceiro.raiz[1]);
console.log('   lado a lado · x:', deitado.jogador.raiz[0], 'e', deitado.parceiro.raiz[0],
  '· mesma profundidade:', deitado.jogador.raiz[2] === deitado.parceiro.raiz[2]);
console.log('3. braços · jogador', JSON.stringify(deitado.jogador.bracoE),
  JSON.stringify(deitado.jogador.bracoD));
console.log('   mexeram em 1,4 s ·', balancoJogador, 'e', balancoParceiro);
console.log('4. levantou · giro da âncora:', dePeDeNovo.jogador.giroDoPai,
  '· braços:', JSON.stringify(dePeDeNovo.jogador.bracoE), JSON.stringify(dePeDeNovo.jogador.bracoD));
console.log('   andou depois de levantar:', andou.antes, '→', depoisDeAndar);
console.log('   memória no diário:', noDiario);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (!/deitar/i.test(prompt ?? '')) problemas.push('o prompt de deitar não apareceu');
if (opcoes.length !== 2) problemas.push('a pergunta de deitar não ofereceu as duas opções');

// 2. a âncora deitou os dois, lado a lado e ao comprimento da cama
for (const [nome, p] of [['jogador', deitado.jogador], ['parceiro', deitado.parceiro]]) {
  if (Math.abs(p.giroDoPai + Math.PI / 2) > 0.01) {
    problemas.push(`${nome}: a âncora não está girada -90° em X`);
  }
  // a cabeça tem que estar MAIS PERTO da cabeceira (z menor) que o quadril
  if (!(p.cabeca[2] < p.quadril[2] - 0.4)) {
    problemas.push(`${nome}: não está deitado ao comprimento da cama`);
  }
  // acima do colchão (topo do edredom ≈ 0,69) e não flutuando longe dele
  if (!(p.raiz[1] > 0.7 && p.raiz[1] < 1.05)) {
    problemas.push(`${nome}: altura ${p.raiz[1]} não bate com o colchão`);
  }
}
if (Math.abs(deitado.jogador.raiz[0] - deitado.parceiro.raiz[0]) < 0.35) {
  problemas.push('os dois não ficaram lado a lado — estão em cima um do outro');
}
if (Math.abs(deitado.jogador.raiz[2] - deitado.parceiro.raiz[2]) > 0.05) {
  problemas.push('um deitou mais para a cabeceira que o outro');
}

// 3. o balanço dos braços: existe, e os dois lados abrem para FORA
if (balancoJogador < 0.005 || balancoParceiro < 0.005) {
  problemas.push('os braços não estão mexendo (pose parada)');
}
for (const [nome, p] of [['jogador', deitado.jogador], ['parceiro', deitado.parceiro]]) {
  // braço esquerdo nasce em -X: `rotation.z` NEGATIVO nele é que abre para fora
  if (!(p.bracoE[1] < 0 && p.bracoD[1] > 0)) {
    problemas.push(`${nome}: os braços não abrem para fora (pegadinha de sinal)`);
  }
  if (!(p.pernaE[1] < 0)) problemas.push(`${nome}: a perna esquerda não abre para fora`);
}

// 4. levantar desfaz tudo
if (Math.abs(dePeDeNovo.jogador.giroDoPai) > 0.01) problemas.push('continuou preso à âncora deitada');
if (Math.abs(dePeDeNovo.jogador.bracoE[1] - 0.08) > 0.001) problemas.push('a pose do braço não voltou ao normal');
if (dePeDeNovo.jogador.raiz[1] > 0.2) problemas.push('levantou mas ficou flutuando');
if (Math.abs(depoisDeAndar - andou.antes) < 0.15) problemas.push('não deu para andar depois de levantar');
if (!noDiario) problemas.push('a memória de deitar junto não entrou no diário');
if (Math.abs(dePe.jogador.giroDoPai) > 0.01) problemas.push('já começou preso a uma âncora');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
