/**
 * A mesa do restaurante do clube: sentar, conversar e ler o cardápio.
 *
 * O que este teste guarda:
 *
 * 1. OS DOIS SENTAM DE FRENTE UM PARA O OUTRO. A cutscene põe cada um numa
 *    cadeira da mesa, e os dois olham em direções OPOSTAS — é o que separa esta
 *    cena do banco, onde eles sentam lado a lado olhando para o mesmo lado.
 * 2. O CARDÁPIO TRAVA O JOGO. Painel aberto, o WASD não anda: a cutscene está
 *    esperando ele fechar, e movimento solto deixaria o boneco sair de baixo da
 *    própria cena.
 * 3. AS MINIATURAS SÃO PINTADAS. Cada prato tem um canvas com pixel de verdade
 *    dentro — se a função de pintura quebrar, o canvas fica em branco e ninguém
 *    percebe olhando o HTML.
 * 4. O CARDÁPIO TEM O QUE FOI PEDIDO: arepa em destaque, os dois hambúrgueres,
 *    o perro e as duas bebidas.
 * 5. FECHOU, LEVANTOU. O Escape fecha, a dupla sai da cadeira e o movimento
 *    volta — senão o jogo fica preso sentado.
 *
 * Uso: node scripts/cardapio.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './cardapio';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 780 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=clube&em=-16.5,-4.9&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const onde = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const p = j.player.rig.group;
    const c = j.parceiro.rig.group;
    const mundo = (o) => {
      const v = new (o.position.constructor)();
      o.getWorldPosition(v);
      return [+v.x.toFixed(2), +v.z.toFixed(2)];
    };
    const olhar = (o) => {
      const q = o.getWorldQuaternion(new (o.quaternion.constructor)());
      const e = new (j.player.rig.group.rotation.constructor)().setFromQuaternion(q, 'YXZ');
      return +e.y.toFixed(2);
    };
    return {
      jogador: mundo(p), parceiro: mundo(c),
      olharJogador: olhar(p), olharParceiro: olhar(c),
      sentados: j.player.rig.sitting === true && j.parceiro.rig.sitting === true,
    };
  });

// ------------------------------------------------- abrir a cena da mesa
for (let t = 0; t < 40 && !(await page.locator('.dialogue.show').count()); t++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(250);
}
await page.waitForTimeout(500);
const naMesa = await onde();
await page.screenshot({ path: `${OUT}-sentados.png` });

// passar o diálogo até o cardápio abrir
for (let t = 0; t < 30 && !(await page.locator('.cardapio.show').count()); t++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
}
await page.waitForTimeout(700);

const abriu = await page.locator('.cardapio.show').count() > 0;
await page.screenshot({ path: `${OUT}-cardapio.png` });

// ------------------------------------------------------------ o conteúdo
const conteudo = await page.evaluate(() => {
  const secoes = [...document.querySelectorAll('.cardapio .secao')].map((s) => ({
    titulo: s.querySelector('h3 span')?.textContent ?? '',
    pratos: [...s.querySelectorAll('.prato')].map((p) => ({
      nome: p.querySelector('b')?.textContent ?? '',
      preco: p.querySelector('em')?.textContent ?? '',
      temDescricao: (p.querySelector('p')?.textContent ?? '').length > 30,
      destaque: p.classList.contains('destaque'),
      selo: p.querySelector('.selo')?.textContent ?? null,
    })),
  }));
  // quantos pixels não-transparentes tem cada miniatura: canvas em branco = 0
  const fotos = [...document.querySelectorAll('.cardapio .foto')].map((c) => {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let pintados = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 8) pintados++;
    return Math.round((pintados / (c.width * c.height)) * 100);
  });
  const maos = [...document.querySelectorAll('.cardapio .mao')].length;
  return { secoes, fotos, maos };
});

// ------------------------------------------------- o painel trava o jogo
const antes = await onde();
await page.keyboard.down('KeyW');
await page.waitForTimeout(900);
await page.keyboard.up('KeyW');
const depois = await onde();
const travado =
  Math.abs(antes.jogador[0] - depois.jogador[0]) < 0.05 &&
  Math.abs(antes.jogador[1] - depois.jogador[1]) < 0.05;

// --------------------------------------------------------------- fechar
await page.keyboard.press('Escape');
await page.waitForTimeout(1200);
const fechou = !(await page.locator('.cardapio.show').count());
const emPe = await onde();
await page.keyboard.down('KeyW');
await page.waitForTimeout(900);
await page.keyboard.up('KeyW');
const andou = await onde();
const soltou =
  Math.abs(emPe.jogador[0] - andou.jogador[0]) > 0.3 ||
  Math.abs(emPe.jogador[1] - andou.jogador[1]) > 0.3;
await page.screenshot({ path: `${OUT}-depois.png` });

// --------------------------------------------------------------- relatorio
const falhas = [];
const conferir = (ok, msg) => { if (!ok) falhas.push(msg); };

console.log(`sentados: ${naMesa.sentados}`);
console.log(`  jogador em ${naMesa.jogador} olhando ${naMesa.olharJogador}`);
console.log(`  parceiro em ${naMesa.parceiro} olhando ${naMesa.olharParceiro}`);
conferir(naMesa.sentados, 'a dupla não sentou');
// de frente um para o outro: meia volta de diferença entre os dois ângulos
const diff = Math.abs(Math.atan2(
  Math.sin(naMesa.olharJogador - naMesa.olharParceiro),
  Math.cos(naMesa.olharJogador - naMesa.olharParceiro),
));
console.log(`  diferença de olhar: ${diff.toFixed(2)} rad (tem que ser perto de ${Math.PI.toFixed(2)})`);
conferir(Math.abs(diff - Math.PI) < 0.25, 'não estão de frente um para o outro');
// e um de cada lado da mesa: as posições têm que se separar
const vao = Math.hypot(naMesa.jogador[0] - naMesa.parceiro[0], naMesa.jogador[1] - naMesa.parceiro[1]);
console.log(`  vão entre os dois: ${vao.toFixed(2)} (a mesa tem 2,04 de cadeira a cadeira)`);
conferir(vao > 1.6, 'os dois sentaram no mesmo lugar');

console.log(`cardápio abriu: ${abriu} · mãos na tela: ${conteudo.maos}`);
conferir(abriu, 'o cardápio não abriu');
conferir(conteudo.maos === 2, 'faltam as duas mãos segurando o cardápio');

for (const s of conteudo.secoes) {
  console.log(`  ${s.titulo}: ${s.pratos.map((p) => `${p.nome} ${p.preco}`).join(' · ')}`);
}
const todos = conteudo.secoes.flatMap((s) => s.pratos);
const nomes = todos.map((p) => p.nome.toLowerCase()).join(' | ');
for (const [termo, oque] of [
  ['arepa', 'arepa'], ['duplo', 'duplo burger'], ['quarteirão', 'quarteirão'],
  ['perro', 'perro caliente'], ['morango', 'suco de morango'], ['smoothie', 'smoothie'],
]) {
  conferir(nomes.includes(termo), `falta ${oque} no cardápio`);
}
conferir(todos.every((p) => p.preco.length > 0), 'tem prato sem preço');
conferir(todos.every((p) => p.temDescricao), 'tem prato sem descrição');
const destaque = todos.find((p) => p.destaque);
console.log(`  destaque: ${destaque?.nome} — ${destaque?.selo}`);
conferir(!!destaque && destaque.nome.toLowerCase().includes('arepa'), 'a arepa não está em destaque');
conferir(!!destaque?.selo?.toLowerCase().includes('ari'), 'o selo não diz que é o favorito do Ari');

console.log(`  miniaturas pintadas (% da área): ${conteudo.fotos.join(', ')}`);
conferir(conteudo.fotos.length === todos.length, 'faltou miniatura em algum prato');
conferir(conteudo.fotos.every((p) => p > 20), 'tem miniatura em branco');

console.log(`movimento travado com o cardápio aberto: ${travado}`);
conferir(travado, 'dava para andar com o cardápio aberto');
console.log(`fechou no Escape: ${fechou} · levantou e voltou a andar: ${soltou}`);
conferir(fechou, 'o Escape não fechou o cardápio');
conferir(soltou, 'a dupla ficou presa depois de fechar o cardápio');

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
await browser.close();
if (falhas.length || erros.length) {
  console.log('FALHOU:\n - ' + [...falhas, ...erros].join('\n - '));
  process.exit(1);
}
process.exit(0);
