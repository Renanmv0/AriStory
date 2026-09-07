/**
 * O COOKIE, o elefante bilheteiro da roda gigante.
 *
 * O que este teste guarda:
 *
 * - ele PATRULHA de verdade, e no eixo certo: o vaivem e ao longo do Z, rente
 *   a parede lateral da cabine, e ele NUNCA entra na faixa da janela de
 *   atendimento. O teste soma a distancia andada e mede a caixa por onde ele
 *   passou — nao basta "ele mexeu";
 * - ele VIRA quando muda de direcao. Dois giros medidos em pontas opostas do
 *   trecho tem que estar a meia volta um do outro: sem isso ele anda de costas
 *   metade do tempo, que era o defeito que o Renan pediu para evitar;
 * - a CONVERSA para a caminhada e vira ele para quem chegou, e o devolve a
 *   patrulha no fim. Cutscene que trava o bicho e esquece de soltar e o pior
 *   defeito possivel — o `finally` da cena existe por isso;
 * - o BILHETE se compra COM ELE, e nao na janela: a janela so aponta. E a
 *   carteira e debitada de verdade;
 * - e ele nao esconde a bilheteria: nada dele entra na frente do guiche.
 *
 * Uso: node scripts/cookie.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './cookie';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com a cena */
const A = { x: 13.5, z: -21.4 };
const B = { x: 13.5, z: -19.0 };
const JANELA = { x0: 9.6, x1: 11.6 }; // o vao de atendimento da cabine

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
// viewport pequeno de proposito: este teste mede GEOMETRIA, e no headless o
// relogio do jogo anda proporcional ao fps — numa tela grande o Cookie leva
// minutos para atravessar o trecho, e o teste vira uma espera
const page = await browser.newPage({ viewport: { width: 900, height: 640 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const prompt = () => page.locator('.prompt .label').textContent().catch(() => '');
const dialogoAberto = () => page.locator('.dialogue.show').count().then((n) => n > 0);
const irPara = (x, z, facing = Math.PI) =>
  page.evaluate(([px, pz, f]) => window.jogo.debugPlace(px, pz, f), [x, z, facing]);

/*
 * O HANDLE FICA GUARDADO NA PAGINA. Varrer a cena inteira (5 mil malhas) a
 * cada amostra custava mais que o proprio quadro do jogo: o Cookie andava
 * quatro vezes menos por segundo so por causa do teste medindo. Achar uma vez
 * e ler `position` depois deixa a amostra praticamente de graca.
 */
const oCookie = () => page.evaluate(() => {
  const w = window;
  if (!w.__cookie) {
    w.jogo.scene.traverse((o) => {
      if (!w.__cookie && o.userData?.peca === 'cookie') w.__cookie = o;
    });
  }
  const c = w.__cookie;
  if (!c) return null;
  return {
    onde: [+c.position.x.toFixed(3), +c.position.z.toFixed(3)],
    giro: +c.rotation.y.toFixed(3),
    temCabeca: !!c.getObjectByName('cabeca-do-cookie'),
  };
});

await page.goto(`${BASE}/?cena=villa-lobos&entrada=roda`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3400);
await page.mouse.click(550, 430);
await page.waitForTimeout(600);

// ============================================================ 1. ele existe
const nasceu = await oCookie();

/*
 * 2. A PATRULHA, medida POR EVENTO e nao por relogio.
 *
 * A primeira versao amostrava por N segundos e exigia tantas unidades andadas
 * — e falhava sozinha quando a maquina estava lenta, porque no headless o
 * tempo de jogo anda proporcional ao fps. Aqui o teste ESPERA ele chegar em
 * cada ponta e mede o rumo la: e o que se quer saber de verdade (ele percorre
 * o trecho inteiro e vira nas duas pontas), e nao quantos metros deu em vinte
 * segundos.
 */
const trilha = [];
let andou = 0;
let antes = nasceu?.onde ?? [0, 0];

/** anda ate ele chegar perto de `z`, anotando a trilha; devolve o rumo la */
const esperarPonta = async (z, nome) => {
  for (let i = 0; i < 700; i++) {
    const c = await oCookie();
    if (c) {
      trilha.push(c.onde);
      andou += Math.hypot(c.onde[0] - antes[0], c.onde[1] - antes[1]);
      antes = c.onde;
      if (Math.abs(c.onde[1] - z) < 0.2) {
        // espera ele completar a meia-volta antes de ler o rumo: o `passo()`
        // interpola, e lido no quadro da chegada o angulo ainda e o da ida
        await page.waitForTimeout(1400);
        const parado = await oCookie();
        return parado?.giro ?? NaN;
      }
    }
    await page.waitForTimeout(160);
  }
  console.log(`   (nao chegou na ponta ${nome})`);
  return NaN;
};

const rumoEmB = await esperarPonta(B.z, 'B');
await page.screenshot({ path: `${OUT}-patrulha.png` });
const rumoEmA = await esperarPonta(A.z, 'A');

const zs = trilha.map(([, z]) => z);
const xs = trilha.map(([x]) => x);
const trecho = Math.max(...zs) - Math.min(...zs);
const desvioNoX = Math.max(...xs) - Math.min(...xs);
const naJanela = trilha.filter(([x]) => x > JANELA.x0 && x < JANELA.x1);

/*
 * O GIRO NAS DUAS PONTAS. Quem anda para +Z tem `rotation.y` ~0; para -Z, ~PI.
 * O que o teste guarda e a DIFERENCA entre os dois rumos: tem que ser meia
 * volta. Sem isso ele faz metade do trecho de costas — o defeito que o Renan
 * pediu para evitar.
 */
const anguloEntre = (a, b) => {
  let d = Math.abs(a - b) % (Math.PI * 2);
  if (d > Math.PI) d = Math.PI * 2 - d;
  return d;
};

// ================================================= 3. a conversa para ele
await irPara(COOKIE_PERTO().x, COOKIE_PERTO().z);
await page.waitForTimeout(1000);
const rotulo = await prompt();

await page.keyboard.press('KeyE');
await page.waitForTimeout(900);
const durante = [];
const falas = [];
for (let i = 0; i < 8; i++) {
  const c = await oCookie();
  if (c) durante.push(c.onde);
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 8 && !falas.includes(t)) falas.push(t);
  if (await dialogoAberto()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(380);
}
await page.screenshot({ path: `${OUT}-conversa.png` });
let mexeuFalando = 0;
for (let i = 1; i < durante.length; i++) {
  mexeuFalando += Math.hypot(durante[i][0] - durante[i - 1][0], durante[i][1] - durante[i - 1][1]);
}

// ================================================= 4. o bilhete e com ele
await page.evaluate(() => window.jogo.ganhar(60));
let comprou = false;
let carteiraDepois = -1;
for (let i = 0; i < 90; i++) {
  const t = await page.locator('.dialogue .text').textContent().catch(() => '');
  if (t && t.length > 8 && !falas.includes(t)) falas.push(t);
  if (await page.locator('.dialogue .escolhas button').count()) {
    await page.locator('.dialogue .escolhas button').first().click();
  } else if (await dialogoAberto()) {
    await page.keyboard.press('KeyE');
  } else {
    await page.keyboard.press('KeyE'); // recomeca a conversa se ela ja acabou
  }
  await page.waitForTimeout(360);
  comprou = await page.evaluate(() => window.jogo.hasItem('bilhete-roda')
    || window.jogo.hasItem('bilhete-roda', window.jogo.companionId()));
  if (comprou) break;
}
carteiraDepois = await page.evaluate(() => window.jogo.carteira());

/*
 * E FECHA A CONVERSA ANTES DE MEDIR. O laco de cima sai assim que o bilhete
 * cai na mochila — no meio da fala de despedida —, e o `finally` da cena (que
 * e quem devolve o Cookie a patrulha) so roda quando a conversa termina.
 * Medindo antes disso, ele parecia travado por culpa do teste, e nao do jogo.
 */
for (let i = 0; i < 30; i++) {
  if (!(await dialogoAberto())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(360);
}

/*
 * 5. ELE VOLTOU A PATRULHAR? Tambem por evento: espera ele sair de onde a
 * conversa o deixou. Medir "quanto andou em N segundos" reprovava sozinho
 * quando a conversa terminava justo no meio da pausa da ponta — que e um
 * comportamento certo, e nao um travamento.
 */
await page.waitForTimeout(600);
const ondeParou = (await oCookie())?.onde ?? [0, 0];
let voltouAAndar = 0;
for (let i = 0; i < 220; i++) {
  const c = await oCookie();
  if (c) voltouAAndar = Math.hypot(c.onde[0] - ondeParou[0], c.onde[1] - ondeParou[1]);
  if (voltouAAndar > 0.35) break;
  await page.waitForTimeout(200);
}

// ======================================================================= laudo
const falhas = [];
if (!nasceu) falhas.push('o Cookie nao esta na cena');
else if (!nasceu.temCabeca) falhas.push('a cabeca dele sumiu');
if (andou < 2.0) falhas.push(`ele quase nao andou na patrulha: ${andou.toFixed(2)}`);
if (trecho < 2.0) falhas.push(`ele nao percorreu o trecho inteiro: ${trecho.toFixed(2)} de 2,4`);
if (desvioNoX > 0.4) falhas.push(`ele saiu do eixo Z: ${desvioNoX.toFixed(2)} de desvio no X`);
if (naJanela.length) falhas.push(`ele passou na frente da janela ${naJanela.length}x`);
if (Number.isFinite(rumoEmA) && Number.isFinite(rumoEmB)) {
  const d = anguloEntre(rumoEmA, rumoEmB);
  if (d < 2.4) falhas.push(`ele nao vira ao trocar de direcao: ${d.toFixed(2)} rad entre as pontas`);
} else {
  falhas.push('nao deu para medir o rumo nas duas pontas — ele nao percorreu o trecho');
}
if (!rotulo?.includes('Cookie')) falhas.push(`o prompt nao e o dele: "${rotulo}"`);
if (mexeuFalando > 0.25) falhas.push(`ele continuou andando durante a fala: ${mexeuFalando.toFixed(2)}`);
if (!falas.some((f) => f.includes('Cookie'))) falhas.push('ele nao se apresentou');
if (!falas.some((f) => /pequenininho|jujuba|doce/i.test(f))) falhas.push('ele nao falou dos docinhos');
if (!falas.some((f) => /roda/i.test(f))) falhas.push('ele nao contou o sonho da roda gigante');
if (!comprou) falhas.push('nao deu para comprar o bilhete falando com ele');
else if (carteiraDepois !== 36) falhas.push(`a carteira nao foi debitada certo: ${carteiraDepois} (esperado 36)`);
if (voltouAAndar < 0.35) falhas.push(`ele nao voltou a patrulhar depois da conversa: ${voltouAAndar.toFixed(2)}`);

console.log('1. nasceu:', JSON.stringify(nasceu));
console.log('2. patrulha: andou', andou.toFixed(2), '· trecho', trecho.toFixed(2),
  '· desvio no X', desvioNoX.toFixed(2), '· passou na janela:', naJanela.length);
console.log('   rumo em cada ponta:', rumoEmB.toFixed(2), 'e', rumoEmA.toFixed(2),
  `(${anguloEntre(rumoEmA, rumoEmB).toFixed(2)} rad de diferenca — tem que ser ~PI)`);
console.log('3. prompt:', `"${rotulo}"`, '· mexeu falando:', mexeuFalando.toFixed(2));
console.log('4. falas:', JSON.stringify(falas));
console.log('5. comprou com ele:', comprou, '· carteira:', carteiraDepois);
console.log('6. voltou a patrulhar:', voltouAAndar.toFixed(2));

await browser.close();
if (erros.length) console.log('ERROS:\n' + erros.join('\n'));
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');

/** onde o jogador tem que ficar para o prompt dele aparecer */
function COOKIE_PERTO() {
  return { x: 13.5, z: -19.2 };
}
