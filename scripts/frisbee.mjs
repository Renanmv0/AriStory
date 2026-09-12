/**
 * O passe de volta do parceiro.
 *
 * A regra da mecânica: ele para de andar, mira e joga num ponto ALÉM do
 * jogador, para o disco cruzar voando por cima em vez de cair nos pés dele.
 * O teste lança, fica PARADO, e mede a trajetória de volta de verdade lendo a
 * posição do disco quadro a quadro:
 *   - a que altura ele passou por quem recebe (rente ao chão = mirou nos pés)
 *   - quanto tempo ficou dentro da janela de pegada no ar
 *
 * Uso: node scripts/frisbee.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './frisbee';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com o RETORNO da cena */
const ALCANCE = 3.0;
const RAIO = 2.1;
/** altura em que o disco fica quando está na mão de alguém (Frisbee.holdAt) */
const NA_MAO = 1.02;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
// tela pequena de propósito: no Chromium headless o render é por software e
// o jogo anda em câmera lenta se a janela for grande
const page = await browser.newPage({ viewport: { width: 860, height: 560 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&entrada=portao&em=18,-4.5&olhar=0.785`, {
  waitUntil: 'networkidle',
});
await page.waitForTimeout(3200);

// Grava disco e jogador quadro a quadro. O disco de jogo é o único cilindro de
// raio 0.28 pendurado DIRETO na raiz do mundo — os outros dois estão dentro do
// grupo da bolsa de discos, parados no canto da quadra.
await page.evaluate(() => {
  const jogo = window.jogo;
  window.__amostras = [];
  let disco = null;
  const achar = () =>
    jogo.current?.world?.root?.children.find(
      (n) => n.isMesh && n.geometry?.parameters?.radiusTop === 0.28,
    ) ?? null;
  const passo = () => {
    disco = disco ?? achar();
    if (disco?.visible) {
      const eu = jogo.player.position;
      const ele = jogo.parceiro.position;
      window.__amostras.push({
        t: performance.now(),
        y: disco.position.y,
        d: Math.hypot(disco.position.x - eu.x, disco.position.z - eu.z),
        cx: ele.x,
        cz: ele.z,
      });
      if (window.__amostras.length > 6000) window.__amostras.shift();
    }
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
});

/** posição do disco e do jogador agora, mais o giro da câmera */
const estado = () =>
  page.evaluate(() => {
    const jogo = window.jogo;
    const disco = jogo.current?.world?.root?.children.find(
      (n) => n.isMesh && n.geometry?.parameters?.radiusTop === 0.28,
    );
    const eu = jogo.player.position;
    return {
      dx: disco.position.x - eu.x,
      dz: disco.position.z - eu.z,
      y: disco.position.y,
      giro: jogo.iso.angle,
    };
  });

const TECLAS = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
const soltarTudo = async () => {
  for (const k of TECLAS) await page.keyboard.up(k);
};

/** anda até encostar no disco caído; a direção de tela sai do giro da câmera */
async function buscarDisco(limite = 8000) {
  const fim = Date.now() + limite;
  while (Date.now() < fim) {
    const e = await estado();
    const dist = Math.hypot(e.dx, e.dz);
    if (e.y > 0.5 || dist < 1.0) break; // já pegou (ou está na mão de alguém)
    const c = Math.cos(e.giro);
    const s = Math.sin(e.giro);
    // inverso de IsoCamera.screenToWorld — a matriz é a própria inversa
    const x = (e.dx * c - e.dz * s) / dist;
    const y = (-e.dx * s - e.dz * c) / dist;
    await soltarTudo();
    if (x > 0.3) await page.keyboard.down('KeyD');
    if (x < -0.3) await page.keyboard.down('KeyA');
    if (y > 0.3) await page.keyboard.down('KeyW');
    if (y < -0.3) await page.keyboard.down('KeyS');
    await page.waitForTimeout(220);
  }
  await soltarTudo();
  await page.waitForTimeout(400);
}

/** o disco está na minha mão? */
const comigo = async () => {
  const e = await estado();
  return Math.abs(e.y - NA_MAO) < 0.02 && Math.hypot(e.dx, e.dz) < 0.6;
};

/**
 * Corta o último voo de volta: começa quando o disco sai da mão dele
 * (`y` deixa de ser 1.02 e sobe) e acaba quando cai no chão ou entra na minha.
 */
function voltaDe(amostras) {
  const naMao = (a) => Math.abs(a.y - NA_MAO) < 0.02;
  let fim = -1;
  for (let i = amostras.length - 1; i > 0; i--) {
    if (!naMao(amostras[i]) && amostras[i].y > 0.1) {
      fim = i;
      break;
    }
  }
  if (fim < 0) return [];
  let ini = fim;
  while (ini > 0 && !naMao(amostras[ini - 1])) ini -= 1;
  const voo = amostras.slice(ini, fim + 1);
  // só interessa o voo que veio de longe: o meu próprio lançamento sai de perto
  return voo.length > 5 && voo[0].d > 4 ? voo : [];
}

// a quadra abre a câmera para caber os dois; para a foto vale aproximar
await page.evaluate(() => window.jogo.setZoom(12));

const rodadas = [];
for (let i = 0; i < 3; i++) {
  if (!(await comigo())) await buscarDisco();
  if (!(await comigo())) {
    if (process.env.DEBUG) console.log('  [dbg] disco não veio para a mão', await estado());
    rodadas.push(null);
    continue;
  }

  await page.evaluate(() => {
    window.__amostras = [];
  });
  await page.keyboard.down('KeyF');
  await page.waitForTimeout(380); // passe curto: ele busca e devolve mais rápido
  await page.keyboard.up('KeyF');

  // daqui para a frente ninguém anda: o disco tem que voltar sozinho. Espera
  // pelo estado, não pelo relógio: headless o jogo roda em câmera lenta.
  let amostras = [];
  let voo = [];
  const prazo = Date.now() + 60000;
  let fotografou = false;
  let mirou = false;
  while (Date.now() < prazo) {
    await page.waitForTimeout(700);
    amostras = await page.evaluate(() => window.__amostras);
    voo = voltaDe(amostras);
    const agora = await estado();
    const naMaoDele = Math.abs(agora.y - NA_MAO) < 0.02 && Math.hypot(agora.dx, agora.dz) > 3;
    if (!mirou && naMaoDele) {
      await page.screenshot({ path: `${OUT}-mira-${i + 1}.png` }); // ele parado, mirando
      mirou = true;
    }
    // no ar e chegando: é a foto que mostra o disco vindo por cima
    if (!fotografou && agora.y > 1.5 && Math.hypot(agora.dx, agora.dz) < 7 && voo.length) {
      await page.screenshot({ path: `${OUT}-volta-${i + 1}.png` });
      fotografou = true;
    }
    // acabou quando o disco caiu no chão ou entrou na minha mão
    const ultima = amostras[amostras.length - 1];
    if (voo.length && ultima && (ultima.y < 0.1 || (await comigo()))) break;
  }
  if (process.env.DEBUG) {
    const alturas = amostras.filter((_, k) => k % 20 === 0).map((a) => `${a.y.toFixed(2)}/${a.d.toFixed(1)}`);
    console.log('  [dbg] amostras', amostras.length, alturas.join(' '));
  }
  if (!voo.length) {
    rodadas.push(null);
    continue;
  }
  // requisito 1: com o disco na mão ele fica parado. Mede o quanto ele andou
  // enquanto segurava (disco na mão e longe de mim = na mão dele).
  let andou = 0;
  for (let k = 1; k < amostras.length; k++) {
    const a = amostras[k];
    const b = amostras[k - 1];
    const segurando = Math.abs(a.y - NA_MAO) < 0.02 && a.d > 3;
    if (segurando) andou += Math.hypot(a.cx - b.cx, a.cz - b.cz);
  }

  let perto = voo[0];
  let janela = 0;
  for (let k = 1; k < voo.length; k++) {
    if (voo[k].d < perto.d) perto = voo[k];
    if (voo[k].d < RAIO && voo[k].y < ALCANCE && voo[k].y > 0.07) {
      janela += (voo[k].t - voo[k - 1].t) / 1000;
    }
  }
  rodadas.push({ altura: perto.y, dist: perto.d, janela, andou, pegou: await comigo() });
}

await page.screenshot({ path: `${OUT}-fim.png` });

for (const [i, r] of rodadas.entries()) {
  if (!r) {
    console.log(`volta ${i + 1}: não deu tempo de medir`);
    continue;
  }
  console.log(
    `volta ${i + 1}: ele andou ${r.andou.toFixed(2)} com o disco na mão` +
      ` · passou a ${r.dist.toFixed(2)} de mim, a ${r.altura.toFixed(2)} de altura` +
      ` · ${r.pegou ? 'peguei parado' : 'não peguei'}`,
  );
}
console.log('trocas:', await page.evaluate(() => {
  try {
    return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').stats?.['frisbee.trocas'] ?? 0;
  } catch {
    return -1;
  }
}));
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const medidas = rodadas.filter(Boolean);
// passar rente ao chão significa que ele voltou a mirar nos pés
const altas = medidas.filter((r) => r.altura > 0.6).length;
const pegas = medidas.filter((r) => r.pegou).length;
// ele não pode lançar andando
const parado = medidas.filter((r) => r.andou < 0.35).length;
await browser.close();
process.exit(
  erros.length || medidas.length < 2 || altas < 2 || pegas < 2 || parado < medidas.length ? 1 : 0,
);
