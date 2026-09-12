/**
 * A barra de força obedece?
 *
 * Este é o teste que faltava. A escala antiga ia até 30 unidades numa quadra de
 * 26, e o disco era grampeado no alambrado: de 60% de carga para cima TODO
 * arremesso morria no mesmo lugar, e não havia força nenhuma para dosar. Nada
 * media isso, então ninguém viu.
 *
 * Aqui o teste segura F por três tempos diferentes e mede onde o disco PAROU de
 * verdade, lendo a posição quadro a quadro. Exige três distâncias distintas e
 * crescentes, e a maior delas dentro das linhas — não encostada na grade.
 *
 * Uso: node scripts/forca.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './forca';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com a cena */
const TETO = 22;
const DIST_MIN = 4;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 860, height: 560 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

// canto oeste da quadra, olhando para o leste: é o rumo mais longo que existe,
// então há espaço para os três lançamentos serem diferentes
await page.goto(`${BASE}/?cena=villa-lobos&entrada=portao&em=8,-4.5&olhar=1.5708`, {
  waitUntil: 'networkidle',
});
await page.waitForTimeout(3600);

const disco = () =>
  page.evaluate(() => {
    const jogo = window.jogo;
    const d = jogo.current?.world?.root?.children.find(
      (n) => n.isMesh && n.geometry?.parameters?.radiusTop === 0.28,
    );
    const marca = jogo.current?.world?.root?.children.find((n) => n.userData?.mira);
    const eu = jogo.player.position;
    const ele = jogo.parceiro.position;
    return {
      x: d.position.x, y: d.position.y, z: d.position.z,
      ele: { x: ele.x, z: ele.z },
      d: Math.hypot(d.position.x - eu.x, d.position.z - eu.z),
      fase: d.userData.fase ?? '?',
      eu: { x: eu.x, z: eu.z },
      mira: marca ? { visible: marca.visible, x: marca.position.x, z: marca.position.z } : null,
    };
  });

const naMao = async () => {
  const e = await disco();
  return e.fase === 'comigo' && Math.abs(e.y - 1.02) < 0.03;
};

/** espera o disco voltar para a minha mão andando até ele quando preciso */
async function recuperar(limite = 45000) {
  const fim = Date.now() + limite;
  while (Date.now() < fim) {
    if (await naMao()) return true;
    const e = await disco();
    if (e.y < 0.1) {
      // caiu: anda até em cima dele. A direção de tela sai do giro da câmera.
      const giro = await page.evaluate(() => window.jogo.iso.angle);
      const dx = e.x - e.eu.x;
      const dz = e.z - e.eu.z;
      const dist = Math.hypot(dx, dz) || 1;
      const c = Math.cos(giro);
      const sn = Math.sin(giro);
      const sx = (dx * c - dz * sn) / dist;
      const sy = (-dx * sn - dz * c) / dist;
      for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD']) await page.keyboard.up(k);
      if (sx > 0.3) await page.keyboard.down('KeyD');
      if (sx < -0.3) await page.keyboard.down('KeyA');
      if (sy > 0.3) await page.keyboard.down('KeyW');
      if (sy < -0.3) await page.keyboard.down('KeyS');
      await page.waitForTimeout(200);
      for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD']) await page.keyboard.up(k);
    }
    await page.waitForTimeout(350);
  }
  return false;
}

/**
 * Põe o jogador no canto oeste olhando para o leste, e o parceiro no posto dele
 * do outro lado. `debugPlace` larga o parceiro colado no jogador, e colado ele
 * agarra o disco antes de o voo começar — não sobraria nada para medir.
 */
const recolocar = async () => {
  await page.evaluate(() => {
    window.jogo.debugPlace(8, -4.5, Math.PI / 2);
    window.jogo.parceiro.teleport(19, -4.5, -Math.PI / 2);
    // teleportar não cancela a ordem antiga: sem isto ele volta andando para
    // onde a cena mandou antes, e chega perto o bastante para agarrar o disco
    // no primeiro metro de voo
    window.jogo.parceiro.goTo(19, -4.5);
  });
  await page.waitForTimeout(500);
};

/**
 * Segura F por `ms` e devolve a distância em que o disco parou (ou foi pego
 * pelo parceiro), mais o que a marca de mira mostrava no instante da soltura.
 */
async function lancar(ms) {
  await recolocar();
  await page.keyboard.down('KeyF');
  await page.waitForTimeout(ms);
  const meio = await disco();
  const saida = { x: meio.eu.x, z: meio.eu.z };
  await page.keyboard.up('KeyF');

  // Segue o voo. A régua é a distância até o PONTO DE SAÍDA, não até o jogador:
  // o jogador não anda aqui, mas o ponto de saída é o que a barra prometeu.
  const longe = (e) => Math.hypot(e.x - saida.x, e.z - saida.z);
  let melhor = 0;
  let parado = 0;
  const prazo = Date.now() + 20000;
  let ultima = null;
  // onde o parceiro estava quando o disco saiu, e onde estava com ele ainda
  // no ar: é assim que se mede se ele corre para interceptar ou só espera
  const eleNaSaida = meio.ele;
  let eleNoAr = meio.ele;
  while (Date.now() < prazo) {
    await page.waitForTimeout(120);
    const e = await disco();
    if (e.y > 0.5) eleNoAr = e.ele;
    melhor = Math.max(melhor, longe(e));
    if (ultima && Math.abs(longe(e) - longe(ultima)) < 0.05 && e.y < 0.5) parado += 1;
    else parado = 0;
    ultima = e;
    // pego no ar pelo parceiro também encerra o voo
    if (parado >= 3 || e.fase === 'com-ele' || e.fase === 'buscando') break;
  }
  const correu = Math.hypot(eleNoAr.x - eleNaSaida.x, eleNoAr.z - eleNaSaida.z);
  return { alcance: melhor, mira: meio.mira, saida, correu, parou: ultima };
}

/**
 * Tempos de MUNDO REAL, não de jogo. Headless o Chromium roda o jogo em câmera
 * lenta (~7 fps, com o dt travado em 1/20), então a barra enche cerca de três
 * vezes mais devagar que no navegador de verdade — daí os números grandes.
 */
const tempos = [700, 2600, 8000];
const medidas = [];
for (const [i, ms] of tempos.entries()) {
  if (!(await recuperar())) {
    console.log(`lançamento ${i + 1}: o disco não voltou para a mão`);
    medidas.push(null);
    continue;
  }
  const r = await lancar(ms);
  medidas.push({ ms, ...r });
  await page.screenshot({ path: `${OUT}-${i + 1}.png` });
}

// a marca de mira: aparece com F apertado e some ao soltar
await recuperar();
await recolocar();
await page.keyboard.down('KeyF');
await page.waitForTimeout(700);
const comF = await disco();
await page.screenshot({ path: `${OUT}-mira.png` });
await page.keyboard.up('KeyF');
await page.waitForTimeout(600);
const semF = await disco();

for (const [i, m] of medidas.entries()) {
  if (!m) continue;
  const alvo = m.mira
    ? Math.hypot(m.mira.x - m.saida.x, m.mira.z - m.saida.z).toFixed(1)
    : '—';
  console.log(
    `F por ${m.ms}ms: o disco foi a ${m.alcance.toFixed(1)} · a marca prometia ${alvo}` +
      ` · ele correu ${m.correu.toFixed(1)} com o disco no ar`,
  );
}
console.log(
  `marca de mira: com F ${comF.mira?.visible ? 'aparece' : 'NÃO aparece'}` +
    ` · sem F ${semF.mira?.visible ? 'CONTINUA na tela' : 'some'}`,
);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

// ------------------------------------------------- um passe dentro do aro
// De 2 unidades a oeste do aro de (13, -9.4): o disco ainda está subindo aí,
// na altura do buraco, então qualquer carga média atravessa.
let pontos = 0;
for (let tentativa = 0; tentativa < 3 && pontos === 0; tentativa++) {
  if (!(await recuperar())) break;
  await page.evaluate(() => {
    window.jogo.debugPlace(11, -9.4, Math.PI / 2);
    window.jogo.parceiro.teleport(24, -9.4, -Math.PI / 2);
    window.jogo.parceiro.goTo(24, -9.4);
  });
  await page.waitForTimeout(500);
  await page.keyboard.down('KeyF');
  await page.waitForTimeout(1800);
  await page.keyboard.up('KeyF');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}-aro.png` });
  pontos = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').stats?.['frisbee.alvos'] ?? 0;
    } catch {
      return -1;
    }
  });
}
console.log('pontos nos alvos:', pontos);

const boas = medidas.filter(Boolean);
await browser.close();

const problemas = [];
if (erros.length) problemas.push('erros de console');
if (boas.length < 3) problemas.push('um dos lançamentos não aconteceu');
else {
  // o coração do teste: força diferente TEM que dar distância diferente
  for (let i = 1; i < boas.length; i++) {
    if (boas[i].alcance - boas[i - 1].alcance < 3) {
      problemas.push(
        `força ${boas[i].ms}ms não foi mais longe que ${boas[i - 1].ms}ms` +
          ` (${boas[i - 1].alcance.toFixed(1)} → ${boas[i].alcance.toFixed(1)})`,
      );
    }
  }
  // a barra tem que dizer a verdade: a marca prometeu, o disco entregou
  for (const m of boas) {
    const prometido = Math.hypot(m.mira.x - m.saida.x, m.mira.z - m.saida.z);
    if (Math.abs(m.alcance - prometido) > 4) {
      problemas.push(
        `a marca prometeu ${prometido.toFixed(1)} e o disco foi a ${m.alcance.toFixed(1)}`,
      );
    }
  }
  if (boas[0].alcance < DIST_MIN - 1) problemas.push('o tapinha nem saiu da mão');
  if (boas[2].alcance > TETO + 2) problemas.push('a carga cheia passou do teto da quadra');
}
if (pontos <= 0) problemas.push('nenhum passe registrou ponto no aro');
// o passe longo passa MUITO do posto dele: se ele não sair do lugar enquanto o
// disco voa, a interceptação não está acontecendo
if (boas.length === 3 && boas[2].correu < 1.5) {
  problemas.push(`ele não correu atrás do passe longo (andou ${boas[2].correu.toFixed(1)})`);
}
if (!comF.mira?.visible) problemas.push('a marca de mira não aparece com F apertado');
if (semF.mira?.visible) problemas.push('a marca de mira não some ao soltar');

if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
process.exit(0);
