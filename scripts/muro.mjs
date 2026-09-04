/**
 * O muro e o portão da entrada do clube.
 *
 * O que este teste guarda:
 * - o muro FECHA: andando contra ele fora do portão, em três alturas de `z`
 *   diferentes, ninguém atravessa para dentro do clube;
 * - o portão ABRE: pelo vão, a mesma caminhada entra;
 * - e o caminho é de mão dupla — de dentro para a rua também passa;
 * - o vão tem largura de entrada de clube (mais de 6 m livres entre as
 *   pilastras), e não de porta;
 * - as folhas abertas têm colisão: elas são 3,4 m de ferro deitados para dentro,
 *   e sem colisor dava para atravessá-las como fumaça;
 * - o muro cobre o limite de caminhada inteiro, sem sobrar vão pela grama.
 *
 * ANDAR EM LINHA RETA PEDE DUAS TECLAS. O teclado é relativo à tela: cada tecla
 * anda na diagonal (`S` dá `+x` e `+z` juntos). `S`+`D` cancelam o `z` e sobra
 * o `+x` puro, que é o que atravessa o muro; `W`+`A` é a volta.
 *
 * Uso: node scripts/muro.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './muro';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3400);

const onde = () =>
  page.evaluate(() => [
    +window.jogo.player.object.position.x.toFixed(2),
    +window.jogo.player.object.position.z.toFixed(2),
  ]);

/** larga a dupla num ponto e empurra para o lado pedido por `segundos` */
const empurrar = async (x, z, teclas, segundos) => {
  await page.evaluate(([px, pz]) => window.jogo.debugPlace(px, pz, 0), [x, z]);
  await page.waitForTimeout(600);
  for (const t of teclas) await page.keyboard.down(t);
  await page.waitForTimeout(segundos * 1000);
  for (const t of teclas) await page.keyboard.up(t);
  await page.waitForTimeout(300);
  return onde();
};

const PARA_DENTRO = ['KeyS', 'KeyD'];
const PARA_A_RUA = ['KeyW', 'KeyA'];

// ------------------------------------------------- 1. o muro fecha o clube
const barrado = [];
for (const z of [-6, 0, 14]) {
  const fim = await empurrar(-27, z, PARA_DENTRO, 2.5);
  barrado.push({ z, x: fim[0] });
}

// ---------------------------------------------------- 2. o portão deixa passar
// 5,5 s de caminhada, e não 3: a dupla anda ~0,7 por segundo depois da arrancada
// e são 3,5 m da calçada até o piso do clube. Com 3 s o teste acusava um portão
// fechado que estava aberto — ela só não tinha chegado ainda.
const entrou = await empurrar(-27.5, 7, PARA_DENTRO, 5.5);
await page.screenshot({ path: `${OUT}-entrou.png` });
const saiu = await empurrar(-23, 7, PARA_A_RUA, 5.5);

// -------------------------------------------- 3. as folhas abertas seguram
// a folha de baixo fica em z = 3,5, deitada para dentro do clube. `A`+`S`
// cancelam o `x` e sobra o `+z` puro, que é o que bate nela de frente
const naFolha = await empurrar(-23.5, 2.0, ['KeyA', 'KeyS'], 2.2);

// ------------------------------------------------- 4. a peça, medida na cena
const pecas = await page.evaluate(() => {
  const achar = (nome) => {
    const todos = [];
    window.jogo.scene.traverse((o) => {
      if (o.userData?.peca === nome) {
        o.updateWorldMatrix(true, false);
        const e = o.matrixWorld.elements;
        todos.push({ x: +e[12].toFixed(2), z: +e[14].toFixed(2) });
      }
    });
    return todos;
  };
  return { portao: achar('portao-do-clube'), muros: achar('muro-do-clube') };
});

// ------------------------------------------------------------------ relatório
console.log('1. muro fecha · x final em cada z:',
  barrado.map((b) => `z ${b.z} → x ${b.x}`).join(' · '));
console.log('2. portão · de fora para dentro:', JSON.stringify(entrou),
  '· de dentro para a rua:', JSON.stringify(saiu));
console.log('3. folha aberta segura · parou em:', JSON.stringify(naFolha));
console.log('4. portão em', JSON.stringify(pecas.portao), '· trechos de muro:', pecas.muros.length);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
// o muro está em x = -25 e tem 0,31 de meia-espessura: quem para antes de
// -25,2 não passou
for (const b of barrado) {
  if (b.x > -25.2) problemas.push(`o muro deixou passar em z ${b.z} (parou em x ${b.x})`);
}
if (entrou[0] < -24) problemas.push(`não deu para entrar pelo portão (parou em x ${entrou[0]})`);
if (saiu[0] > -26) problemas.push(`não deu para sair pelo portão (parou em x ${saiu[0]})`);
// o colisor da folha vai de z 3,4 a 3,6 e o corpo tem 0,42 de raio: quem bate
// nela para pouco antes de 3
if (naFolha[1] > 3.3) problemas.push(`a folha aberta não segurou (foi até z ${naFolha[1]})`);
if (pecas.portao.length !== 1) problemas.push('o portão não está na cena uma vez só');
if (pecas.muros.length !== 2) problemas.push('faltou um dos dois trechos de muro');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
