/**
 * Sentar no banco, os dois juntos.
 *
 * O que este teste guarda: que TODO banco tem a interação (ela nasce do
 * `w.banco()`, não de a cena lembrar de escrever), que os dois sentam virados
 * para o mesmo lado e de mãos dadas, que as pernas balançam devagar, e que
 * levantar desfaz tudo.
 *
 * Uso: node scripts/banco.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './banco';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 660 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-4.2,15.6&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

/** quantos bancos da cena têm interação de sentar */
const quantos = await page.evaluate(
  () => window.jogo.current.world.interactables.filter((i) => i.id?.startsWith('banco:')).length,
);

const estado = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const frente = (rig) => {
      rig.group.updateWorldMatrix(true, false);
      const q = rig.group.getWorldQuaternion(new (rig.group.quaternion.constructor)());
      const v = rig.group.position.clone().set(0, 0, 1).applyQuaternion(q);
      return [+v.x.toFixed(2), +v.z.toFixed(2)];
    };
    return {
      sentados: j.player.rig.sitting === true && j.parceiro.rig.sitting === true,
      maos: j.player.rig.holdingHands && j.parceiro.rig.holdingHands,
      riding: j.player.riding && j.parceiro.riding,
      olhando: [frente(j.player.rig), frente(j.parceiro.rig)],
      // a posição de mundo tem que sair certa mesmo sentado, senão as regras
      // de câmera da cena disparam achando que ele está em outro lugar
      mundo: [
        +j.playerPosition().x.toFixed(1),
        +j.playerPosition().z.toFixed(1),
      ],
    };
  });

const prompt = await page.locator('.prompt.show').textContent().catch(() => null);
await page.keyboard.press('KeyE');
await page.waitForTimeout(700);
for (let i = 0; i < 3; i++) {
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(700);
}
await page.waitForTimeout(900);
const sentado = await estado();
await page.screenshot({ path: `${OUT}-sentados.png` });

/** o balanço das pernas, amostrado no relógio */
const balanco = await page.evaluate(
  () =>
    new Promise((ok) => {
      const rig = window.jogo.player.rig;
      const vals = [];
      const t0 = performance.now();
      const passo = () => {
        const t = (performance.now() - t0) / 1000;
        vals.push(rig.legL.rotation.x);
        if (t > 6) ok({ vals, dur: t });
        else requestAnimationFrame(passo);
      };
      passo();
    }),
);
const amplitude = (Math.max(...balanco.vals) - Math.min(...balanco.vals)) / 2;
let viradas = 0;
const meio = (Math.max(...balanco.vals) + Math.min(...balanco.vals)) / 2;
for (let i = 1; i < balanco.vals.length; i++) {
  const a = balanco.vals[i - 1] - meio;
  const b = balanco.vals[i] - meio;
  if ((a <= 0 && b > 0) || (a >= 0 && b < 0)) viradas++;
}
const ciclos = viradas / 2 / balanco.dur;

// Levantar. Duas coisas a respeitar: o balão digita a fala e o primeiro E
// completa a digitação em vez de avançar, então é preciso continuar apertando;
// e os botões de escolha andam com as SETAS LATERAIS (ou A/D), não com as
// verticais.
let escolheu = false;
for (let i = 0; i < 45; i++) {
  if (await page.locator('.escolhas button').count()) {
    escolheu = true;
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(250);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(700);
    break;
  }
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
}
for (let i = 0; i < 5; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(600);
}
await page.waitForTimeout(1200);
const empe = await estado();

console.log('bancos com interação nesta cena:', quantos);
console.log('prompt:', (prompt ?? '').replace(/\s+/g, ' ').trim());
console.log('sentados:', sentado.sentados, '· de mãos dadas:', sentado.maos, '· nos dois assentos:', sentado.riding);
console.log('para onde olham:', JSON.stringify(sentado.olhando), '(têm que ser iguais)');
console.log('posição de mundo sentado:', JSON.stringify(sentado.mundo), '(perto de -4.2, 14)');
console.log('pernas · amplitude', amplitude.toFixed(3), 'rad ·', ciclos.toFixed(2), 'ciclos/s de relógio');
console.log('depois de levantar · sentados:', empe.sentados, '· de mãos dadas:', empe.maos);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const mesmoLado =
  Math.abs(sentado.olhando[0][0] - sentado.olhando[1][0]) < 0.05 &&
  Math.abs(sentado.olhando[0][1] - sentado.olhando[1][1]) < 0.05;

const ok =
  !erros.length &&
  quantos >= 8 &&
  /Sentar no banco/.test(prompt ?? '') &&
  sentado.sentados &&
  sentado.maos &&
  sentado.riding &&
  mesmoLado &&
  Math.hypot(sentado.mundo[0] + 4.2, sentado.mundo[1] - 14) < 1.5 &&
  // balanço de verdade, e devagar
  amplitude > 0.1 &&
  ciclos > 0 && ciclos < 0.5 &&
  !empe.sentados &&
  !empe.maos;

await browser.close();
process.exit(ok ? 0 : 1);
