/**
 * As maos dadas, medidas.
 *
 * Nao basta a foto: o que faz a mecanica funcionar e a dupla PARAR junta. O
 * teste anda, para, vira, mede a distancia entre os dois quadro a quadro e
 * confere que ela nao respira; depois espera os coracoes subirem.
 *
 * Uso: node scripts/maos.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './maos';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-4,6`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const estado = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const a = j.player.position;
    const b = j.parceiro.position;
    return {
      dist: Math.hypot(b.x - a.x, b.z - a.z),
      giroA: j.player.rig.facing,
      giroB: j.parceiro.rig.facing,
      maosA: j.player.rig.holdingHands,
      maosB: j.parceiro.rig.holdingHands,
      coracoes: (() => {
        let n = 0;
        let baixo = false;
        j.scene.traverse((o) => {
          if (!o.userData?.coracao) return;
          n++;
          // recem-solto: sobe 0.72/s e some em 1.7s, entao a foto so pega ele
          // perto do par se for tirada nos primeiros palmos
          if (o.position.y < 2.5) baixo = true;
        });
        return { n, baixo };
      })(),
    };
  });

const solto = await estado();
await page.keyboard.press('KeyH');
await page.waitForTimeout(400);
const ligado = await estado();

// de perto, para conferir que as maos se encontram mesmo e nao ficam duas
// garras no ar a um palmo uma da outra
const perto = (v) => page.evaluate((n) => window.jogo.iso.setViewSize(n), v);
// o par se alinha na perpendicular a quem olha; virado para o eixo da camera,
// um esconde o outro e nao da para ver mao nenhuma. Virar o jogador para o
// proprio angulo da camera poe os dois lado a lado na horizontal da tela.
const virar = (giro) =>
  page.evaluate((g) => {
    window.jogo.player.rig.setFacing(window.jogo.iso.angle + g);
  }, giro);
await perto(3.4);
for (const [giro, nome] of [[0, 'perto'], [Math.PI, 'perto-frente']]) {
  await virar(giro);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
}
await perto(14);
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-parados.png` });

// anda um bocado, virando: e na curva que um par mal amarrado se separa
const amostras = [];
for (const [tecla, quanto] of [['KeyW', 900], ['KeyD', 900], ['KeyS', 700], ['KeyA', 700]]) {
  await page.keyboard.down(tecla);
  const fim = Date.now() + quanto;
  while (Date.now() < fim) {
    amostras.push((await estado()).dist);
    await page.waitForTimeout(70);
  }
  if (tecla === 'KeyD') await page.screenshot({ path: `${OUT}-andando.png` });
  await page.keyboard.up(tecla);
  await page.waitForTimeout(250);
  amostras.push((await estado()).dist);
}
const parado = await estado();

// Os coracoes sobem de 3 em 3 segundos e vivem 1.7s, entao contar "antes e
// depois" da negativo na hora errada. O que vale e o pico ao longo da espera.
// de perto e de lado, senao o coracao sai do tamanho de um pixel entre duas
// cabecas e a foto nao prova nada
await perto(3.4);
await virar(Math.PI);
await page.waitForTimeout(800);
let pico = 0;
for (let i = 0; i < 40; i++) {
  const c = (await estado()).coracoes;
  if (c.n > pico) pico = c.n;
  if (c.baixo) await page.screenshot({ path: `${OUT}-coracao.png` });
  await page.waitForTimeout(180);
}

await perto(14);
await page.waitForTimeout(400);

// e o H de novo solta
await page.keyboard.press('KeyH');
await page.waitForTimeout(500);
const soltou = await estado();

const min = Math.min(...amostras);
const max = Math.max(...amostras);
const giro = Math.abs(Math.atan2(Math.sin(parado.giroA - parado.giroB), Math.cos(parado.giroA - parado.giroB)));

console.log('distancia antes de dar a mao:', solto.dist.toFixed(2));
console.log('distancia ao dar a mao:', ligado.dist.toFixed(2), '(alvo 0.95)');
console.log('bracos ligados:', ligado.maosA, ligado.maosB);
console.log('distancia andando: min', min.toFixed(2), 'max', max.toFixed(2), '· variacao', (max - min).toFixed(2));
console.log('desalinhamento de direcao ao parar:', giro.toFixed(3), 'rad');
console.log('coracoes que subiram (pico simultaneo):', pico);
console.log('bracos ao soltar:', soltou.maosA, soltou.maosB);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  ligado.maosA && ligado.maosB &&
  Math.abs(ligado.dist - 0.95) < 0.12 &&
  max - min < 0.35 &&
  giro < 0.05 &&
  pico > 0 &&
  !soltou.maosA && !soltou.maosB;

await browser.close();
process.exit(ok ? 0 : 1);
