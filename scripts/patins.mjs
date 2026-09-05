/**
 * Os patins: o corpo, a velocidade e o parceiro.
 *
 * O que este teste prova não é que a peça aparece — é que o inventário MANDA
 * nas três pontas: calçar bota os patins no corpo, sobe o teto de velocidade
 * para 1,3× e dá o mesmo bônus ao parceiro (senão a dupla se separa em dez
 * passos). Tirar da vaga desfaz tudo no mesmo quadro.
 *
 * Uso: node scripts/patins.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './patins';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
/** tem que bater com BONUS_PATINS em entities/Player.ts */
const BONUS = 1.3;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 660 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// na pista, que é onde a mecânica vive
await page.goto(`${BASE}/?cena=villa-lobos&em=-20,1&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

const estado = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const rodas = (rig) => {
      let n = 0;
      rig.group.traverse((o) => {
        if (o.userData?.patins && o.visible) n++;
      });
      return n;
    };
    return {
      vestindoAri: j.wearables('ari').map((i) => i?.id ?? null),
      jogadorCalcado: j.player.patins,
      parceiroCalcado: j.parceiro.patins,
      pesDoJogador: rodas(j.player.rig),
      pesDoParceiro: rodas(j.parceiro.rig),
    };
  });

/**
 * O TETO de velocidade, e não a distância andada: em câmera lenta a distância
 * mistura aceleração, colisor e quantos quadros couberam no relógio.
 */
const teto = async () => {
  await page.keyboard.down('KeyW');
  let pico = 0;
  for (let i = 0; i < 14; i++) {
    await page.waitForTimeout(160);
    const v = await page.evaluate(() => {
      const p = window.jogo.player.velocity;
      return Math.hypot(p.x, p.z);
    });
    if (v > pico) pico = v;
  }
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(500);
  return pico;
};

/**
 * A CADÊNCIA da passada, em ciclos por segundo de relógio.
 *
 * Andando, o sinal que oscila é o balanço da perna (`rotation.x`); patinando é
 * o tronco caindo para o lado (`rotation.z`) — a perna de patinar só abre num
 * sentido, então ela não cruza o zero duas vezes por ciclo e serviria mal de
 * régua. A comparação entre os dois é o que este número existe para guardar:
 * a primeira versão patinava MAIS rápido do que andava.
 */
const cadencia = async () => {
  await page.keyboard.down('KeyD');
  const amostras = await page.evaluate(
    () =>
      new Promise((ok) => {
        const rig = window.jogo.player.rig;
        const fora = [];
        const t0 = performance.now();
        const passo = () => {
          const t = (performance.now() - t0) / 1000;
          fora.push(rig.patinandoAgora ? rig.body.rotation.z : rig.legL.rotation.x);
          if (t > 5) ok({ fora, dur: t });
          else requestAnimationFrame(passo);
        };
        passo();
      }),
  );
  await page.keyboard.up('KeyD');
  await page.waitForTimeout(400);
  let viradas = 0;
  for (let i = 1; i < amostras.fora.length; i++) {
    const a = amostras.fora[i - 1];
    const b = amostras.fora[i];
    if ((a <= 0 && b > 0) || (a >= 0 && b < 0)) viradas++;
  }
  return viradas / 2 / amostras.dur;
};

const descalco = await estado();
const semPatins = await teto();
const ritmoAndando = await cadencia();

// a loja entrega para quem está comprando; aqui os dois calçam de uma vez
await page.evaluate(() => {
  const j = window.jogo;
  // ficha DE VERDADE: o vestível declara a parte do corpo, e a vaga sai dela
  const par = window.aristoryItens['patins'];
  j.equipWearable(par, 'ari');
  j.equipWearable(par, 'renan');
});
await page.waitForTimeout(900);
const calcado = await estado();
await page.evaluate(() => window.jogo.iso.setViewSize(5));
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-calcado.png` });

const comPatins = await teto();
const ritmoPatinando = await cadencia();

// andando de lado, para a passada aparecer de perfil
await page.keyboard.down('KeyD');
for (let i = 0; i < 3; i++) {
  await page.waitForTimeout(420);
  await page.evaluate(() => window.jogo.iso.setViewSize(4.6));
  await page.waitForTimeout(260);
  await page.screenshot({ path: `${OUT}-patinando-${i}.png` });
}
await page.keyboard.up('KeyD');

// tirar da vaga desfaz tudo
await page.evaluate(() => {
  window.jogo.removeItem('patins', 'ari');
  window.jogo.removeItem('patins', 'renan');
});
await page.waitForTimeout(700);
const tirou = await estado();

const razao = comPatins / semPatins;
console.log('descalço · vestindo:', JSON.stringify(descalco.vestindoAri), '· patins no corpo:', descalco.pesDoJogador);
console.log('calçado · vestindo:', JSON.stringify(calcado.vestindoAri));
console.log('  no corpo — jogador:', calcado.pesDoJogador, '· parceiro:', calcado.pesDoParceiro);
console.log('  na física — jogador:', calcado.jogadorCalcado, '· parceiro:', calcado.parceiroCalcado);
console.log('cadência da passada:', ritmoAndando.toFixed(2), 'andando →', ritmoPatinando.toFixed(2), 'patinando (ciclos/s)');
console.log('teto de velocidade:', semPatins.toFixed(2), '→', comPatins.toFixed(2), '· razão', razao.toFixed(3), `(alvo ${BONUS})`);
console.log('depois de tirar · no corpo:', tirou.pesDoJogador, '· na física:', tirou.jogadorCalcado);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  descalco.pesDoJogador === 0 &&
  // dois pés em cada um dos dois
  calcado.pesDoJogador === 2 &&
  calcado.pesDoParceiro === 2 &&
  calcado.jogadorCalcado === true &&
  calcado.parceiroCalcado === true &&
  Math.abs(razao - BONUS) < 0.02 &&
  // patinar tem que ser VISIVELMENTE mais calmo que andar, e não mais agitado
  ritmoPatinando < ritmoAndando * 0.45 &&
  tirou.pesDoJogador === 0 &&
  tirou.jogadorCalcado === false;

await browser.close();
process.exit(ok ? 0 : 1);
