/**
 * O garçom canino passeando pelo salão, e a porta de serviço desobstruída.
 *
 * O que este teste guarda:
 * - A PORTA DE SERVIÇO NÃO TEM MÓVEL NA FRENTE. Foi reclamação do Renan: a pia
 *   de 2,6 corria pela parede da esquerda e o colisor dela caía bem no vão da
 *   porta, então quem entrava do clube esbarrava nela antes de dar um passo. O
 *   teste mede duas coisas: nenhum colisor invade o retângulo de entrada, e a
 *   dupla larga da porta e caminha para dentro da cozinha sem travar;
 * - O GARÇOM PASSEIA. Ele é o mesmo cachorro que serve a mesa lá fora, e agora
 *   mora aqui: a trilha tem que somar distância de verdade (o bug clássico de
 *   bicho é dar um passo de um quadro e congelar);
 * - ele fica DENTRO do salão e não atravessa mesa nem o balcão de passagem —
 *   o balcão não colide para bicho, quem segura ele é a área;
 * - o prompt de carinho ANDA JUNTO com ele;
 * - ele LATE sozinho, e o carinho faz ele parar.
 *
 * Uso: node scripts/garcom.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './garcom';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** as mesmas mesas que a cena declara como proibidas para ele */
const MESAS = [
  [3.6, -5.2], [9.4, -5.2],
  [-9.2, 1.2], [-4.6, 1.2], [0.2, 1.2], [5.2, 1.2], [10.0, 1.2],
  [-7.2, 5.6], [-2.4, 5.6], [2.6, 5.6], [7.6, 5.6],
];
/** a área do salão que a cena dá para ele (x0 = -12, D/2 = 9, PASSAGEM.z = -2) */
const AREA = { minX: -10.8, maxX: 10.8, minZ: -0.9, maxZ: 7.8 };
/** o vão da porta de serviço: PORTA.z = -4,4 e o vão tem 1,1 para cada lado */
const ENTRADA = { minX: -12, maxX: -9.6, minZ: -5.5, maxZ: -3.3 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1150, height: 860 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=mania-de-churrasco`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
// o primeiro clique é o que tem permissão de acordar o áudio
await page.mouse.click(575, 430);
await page.waitForTimeout(500);

const onde = () =>
  page.evaluate(() => {
    let g = null;
    window.jogo.scene.traverse((o) => {
      if (o.userData?.peca === 'garcom-canino') g = o;
    });
    return g ? [+g.position.x.toFixed(3), +g.position.z.toFixed(3)] : null;
  });

const daDupla = () =>
  page.evaluate(() => [
    +window.jogo.player.object.position.x.toFixed(2),
    +window.jogo.player.object.position.z.toFixed(2),
  ]);

// =================================================== 1. a porta desobstruída
/**
 * Mede os COLISORES contra o retângulo de entrada, e não "andei e não bati":
 * andar prova o caminho de hoje; o retângulo prova que nenhum móvel novo vai
 * poder nascer ali sem o teste acusar.
 */
const invasores = await page.evaluate((E) => {
  const achados = [];
  for (const c of window.jogo.current.world.colliders) {
    if (c.kind === 'box') {
      // as paredes da casca também são caixas, e elas TÊM que estar na borda:
      // só interessa quem invade o miolo do retângulo
      const min = [c.x - c.hw, c.z - c.hd];
      const max = [c.x + c.hw, c.z + c.hd];
      const sobreX = Math.min(max[0], E.maxX) - Math.max(min[0], E.minX);
      const sobreZ = Math.min(max[1], E.maxZ) - Math.max(min[1], E.minZ);
      if (sobreX > 0.06 && sobreZ > 0.06) {
        achados.push({ tipo: 'box', x: +c.x.toFixed(2), z: +c.z.toFixed(2),
          area: +(sobreX * sobreZ).toFixed(2) });
      }
    } else {
      const px = Math.max(E.minX, Math.min(E.maxX, c.x));
      const pz = Math.max(E.minZ, Math.min(E.maxZ, c.z));
      if (Math.hypot(c.x - px, c.z - pz) < c.r - 0.06) {
        achados.push({ tipo: 'circle', x: +c.x.toFixed(2), z: +c.z.toFixed(2), r: c.r });
      }
    }
  }
  return achados;
}, ENTRADA);

// e a caminhada de verdade: da porta para dentro da cozinha
// `S`+`D` cancelam o `z` e sobra o `+x` puro, que é o rumo de quem entra
await page.evaluate(() => window.jogo.debugPlace(-11.2, -4.4, Math.PI / 2));
await page.waitForTimeout(700);
const antesDeEntrar = await daDupla();
for (const t of ['KeyS', 'KeyD']) await page.keyboard.down(t);
await page.waitForTimeout(4500);
for (const t of ['KeyS', 'KeyD']) await page.keyboard.up(t);
await page.waitForTimeout(300);
const depoisDeEntrar = await daDupla();
const entrou = depoisDeEntrar[0] - antesDeEntrar[0];
await page.screenshot({ path: `${OUT}-porta.png` });

// ======================================================= 2. o garçom passeia
const existe = (await onde()) !== null;
// a dupla fica num canto do salão, longe, para não empurrar o cachorro
await page.evaluate(() => window.jogo.debugPlace(-10.2, 7.4, 0));
const trilha = [];
for (let i = 0; i < 26; i++) {
  trilha.push(await onde());
  await page.waitForTimeout(700);
}
await page.screenshot({ path: `${OUT}-salao.png` });

let andou = 0;
let maiorPasso = 0;
for (let i = 1; i < trilha.length; i++) {
  const d = Math.hypot(trilha[i][0] - trilha[i - 1][0], trilha[i][1] - trilha[i - 1][1]);
  andou += d;
  maiorPasso = Math.max(maiorPasso, d);
}
const pontos = new Set(trilha.map((p) => p.join(','))).size;

const foraDaArea = trilha.filter(
  ([x, z]) => x < AREA.minX - 0.3 || x > AREA.maxX + 0.3 || z < AREA.minZ - 0.3 || z > AREA.maxZ + 0.3,
);
const dentroDeMesa = [];
for (const [x, z] of trilha) {
  for (const [mx, mz] of MESAS) {
    if (Math.hypot(x - mx, z - mz) < 1.45 * 0.92) dentroDeMesa.push(`mesa ${mx},${mz} em ${x},${z}`);
  }
}

// ============================================ 3. o prompt anda junto com ele
const grudado = await page.evaluate(() => {
  const it = window.jogo.current.world.interactables.find((i) => i.id === 'mania:garcom');
  let g = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'garcom-canino') g = o;
  });
  if (!it || !g) return null;
  return {
    doPrompt: [+it.x.toFixed(3), +it.z.toFixed(3)],
    doCachorro: [+g.position.x.toFixed(3), +g.position.z.toFixed(3)],
    // longe do centro da área, onde ele nasceu? senão a medida não prova nada
    saiuDoNinho: Math.hypot(g.position.x - 0, g.position.z - 3.45),
  };
});
const distancia = grudado
  ? Math.hypot(grudado.doPrompt[0] - grudado.doCachorro[0], grudado.doPrompt[1] - grudado.doCachorro[1])
  : Infinity;

// ================================================= 4. latido e carinho
const latidosAntes = await page.evaluate(
  () => Object.fromEntries(window.jogo.audio.contagem).latido ?? 0,
);

const p = await onde();
await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.55, z + 0.55, 0), p);
await page.waitForTimeout(900);
const promptPerto = await page.locator('.prompt .label').textContent().catch(() => '');
await page.keyboard.press('KeyE');
await page.waitForTimeout(900);

const falas = [];
for (let i = 0; i < 10; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.waitForTimeout(800);
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t) falas.push(t);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(300);
}
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-carinho.png` });

const antesDoRepouso = await onde();
await page.waitForTimeout(1600);
const depoisDoRepouso = await onde();
const andouNoCarinho = Math.hypot(
  depoisDoRepouso[0] - antesDoRepouso[0],
  depoisDoRepouso[1] - antesDoRepouso[1],
);
const latidosDepois = await page.evaluate(
  () => Object.fromEntries(window.jogo.audio.contagem).latido ?? 0,
);

// ------------------------------------------------------------------ relatório
console.log('1. porta · colisores dentro do vão de entrada:', invasores.length,
  JSON.stringify(invasores.slice(0, 3)));
console.log('   da porta para dentro andou', entrou.toFixed(2), 'no x ·',
  JSON.stringify(antesDeEntrar), '→', JSON.stringify(depoisDeEntrar));
console.log('2. o garçom existe:', existe);
console.log('   passeou', andou.toFixed(2), 'unidades em 18 s ·', pontos, 'posições distintas',
  '· maior passo', maiorPasso.toFixed(2));
console.log('   fora da área:', foraDaArea.length, '· dentro de mesa:', dentroDeMesa.length,
  dentroDeMesa.slice(0, 2).join(' | '));
console.log('3. ponto de interação:', JSON.stringify(grudado?.doPrompt),
  '· cachorro:', JSON.stringify(grudado?.doCachorro),
  '· distância:', distancia.toFixed(3));
console.log('   já tinha saído de onde nasceu:', grudado?.saiuDoNinho.toFixed(2));
console.log('   prompt ao chegar perto:', JSON.stringify(promptPerto));
console.log('4. latidos:', latidosAntes, '→', latidosDepois);
console.log('   falas do carinho:', JSON.stringify(falas));
console.log('   andou durante o carinho:', andouNoCarinho.toFixed(2), '(tem que ser pouco)');
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (invasores.length) {
  problemas.push(`tem móvel no vão da porta de serviço: ${JSON.stringify(invasores[0])}`);
}
// 4,5 s de caminhada a ~0,7 por segundo; o que interessa é ter SAÍDO da porta
// para dentro da cozinha, e não ter chegado a um ponto exato
if (entrou < 1.6) problemas.push(`travou ao entrar pela porta (andou só ${entrou.toFixed(2)})`);
if (!existe) problemas.push('o garçom canino não está no salão');
if (andou < 1.5) problemas.push(`o cachorro mal andou (${andou.toFixed(2)} unidades em 18 s)`);
if (pontos < 8) problemas.push(`o cachorro ficou parado no mesmo lugar (${pontos} posições)`);
if (maiorPasso > 1.4) problemas.push('o cachorro teleportou de um ponto a outro');
if (foraDaArea.length) problemas.push(`saiu do salão ${foraDaArea.length}×`);
if (dentroDeMesa.length) problemas.push(`atravessou uma mesa: ${dentroDeMesa[0]}`);
if (!grudado) problemas.push('não achei o ponto de interação do garçom');
else {
  if (grudado.saiuDoNinho < 0.5) problemas.push('ele não saiu de onde nasceu: a medida não prova nada');
  if (distancia > 0.05) {
    problemas.push(`o ponto de interação ficou ${distancia.toFixed(2)} atrás dele (faltou moveTo)`);
  }
}
if (!/garçom|garcom/i.test(promptPerto ?? '')) problemas.push('o prompt do carinho não apareceu');
if (falas.length < 3) problemas.push('a conversa do carinho não aconteceu');
if (latidosDepois <= latidosAntes) problemas.push('ele não latiu nem no carinho');
if (andouNoCarinho > 0.5) problemas.push('ele saiu andando em vez de ficar quieto no carinho');

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
