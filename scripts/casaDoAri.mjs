/**
 * A casa e o quarto do Ari com acabamento: textura, cama nova e luz.
 *
 * O que este teste guarda:
 * - o chão dos dois cômodos tem assoalho (textura no material do piso);
 * - os móveis de madeira têm veio, o sofá tem tecido e a bancada tem granito;
 * - o tapete do quarto tem franja nas duas pontas, e o da porta é capacho;
 * - a cama nova não mudou de ALTURA: o topo do edredom continua perto de 0,68,
 *   que é onde a cena de deitar põe os dois (`scripts/cama.mjs` vê a cena);
 * - o abajur do quarto e o de pé da sala apagam e acendem num clique, e a luz
 *   que se vê (halo, leque, poça) some e volta junto;
 * - a claridade das janelas está no chão e não faz sombra.
 *
 * Uso: node scripts/casaDoAri.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './casa-do-ari';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error' && !/fonts|ERR_CERT|net::/.test(m.text())) erros.push(m.text());
});

let falhas = 0;
const conferir = (nome, ok, detalhe = '') => {
  console.log(`${ok ? 'ok  ' : 'FALHOU'} ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
  if (!ok) falhas++;
};
const foto = (nome) => page.screenshot({ path: `${OUT}-${nome}.png` });

/** roda `corpo` com `R` = a raiz do mundo da cena atual */
const mundo = (corpo) =>
  page.evaluate(`(() => { const R = window.jogo.current.world.root; ${corpo} })()`);

/** quantas malhas da cena têm textura num material da cor `hex` */
const comTextura = (hex) =>
  mundo(`let n = 0; R.traverse((o) => { if (o.isMesh && o.material && o.material.map && o.material.color.getHex() === ${hex}) n++; }); return n;`);

/** a posição na tela da cúpula (malha `cupula`) número `i` */
const cupulaNaTela = (i = 0) =>
  page.evaluate((i) => {
    const R = window.jogo.current.world.root;
    const cupulas = [];
    R.traverse((o) => { if (o.name === 'cupula') cupulas.push(o); });
    const p = cupulas[i].getWorldPosition(cupulas[i].position.clone());
    p.project(window.jogo.iso.camera);
    const r = document.querySelector('canvas').getBoundingClientRect();
    return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
  }, i);

/** quantos halos (sprites) e poças de luz estão visíveis */
const luzesAcesas = () =>
  mundo(`let n = 0; R.traverse((o) => { if ((o.isSprite || (o.isMesh && o.userData.semSombra && o.parent === R)) && o.visible) n++; }); return n;`);

const clicar = async (alvo) => {
  await page.mouse.move(alvo.x, alvo.y);
  await page.waitForTimeout(400);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(500);
};

// ================================================================ o quarto
await page.goto(`${BASE}/?cena=quarto`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await foto('01-quarto');

conferir('o chão do quarto tem assoalho', (await comTextura(0xc9975c)) >= 1);
const madeira = (await comTextura(0xb5793a)) + (await comTextura(0x8a5a2a));
conferir('os móveis de madeira do quarto têm veio', madeira >= 15, `${madeira} malhas`);

const tapete = await mundo(`
  let t = null; R.traverse((o) => { if (o.userData.peca === 'tapete') t = o; });
  if (!t) return null;
  const franja = t.children.find((c) => c.isInstancedMesh);
  return { franja: franja ? franja.count : 0, desenho: !!t.children[0].material.map };
`);
conferir('o tapete do quarto tem desenho e franja', !!tapete && tapete.desenho && tapete.franja > 80, JSON.stringify(tapete));

const cama = await mundo(`
  let c = null; R.traverse((o) => { if (o.userData.peca === 'cama') c = o; });
  const edredom = c.getObjectByName('edredom');
  const pos = edredom.geometry.getAttribute('position');
  let topo = -1, base = 9;
  for (let i = 0; i < pos.count; i++) { topo = Math.max(topo, pos.getY(i)); base = Math.min(base, pos.getY(i)); }
  return { topo: +topo.toFixed(3), base: +base.toFixed(3), matelasse: !!edredom.material.map };
`);
conferir(
  'o edredom tem a altura da cama antiga e cai pelas beiradas',
  cama.topo > 0.66 && cama.topo < 0.72 && cama.base < 0.4 && cama.base > 0.1 && cama.matelasse,
  JSON.stringify(cama),
);

const claridade = await mundo(`
  let c = null; R.traverse((o) => { if (o.userData.peca === 'claridade') c = o; });
  let sombra = false; c.traverse((o) => { if (o.isMesh && o.castShadow) sombra = true; });
  return { existe: !!c, sombra };
`);
conferir('a claridade da janela está no chão e não faz sombra', claridade.existe && !claridade.sombra, JSON.stringify(claridade));

// de perto: a cama e o abajur
await page.goto(`${BASE}/?cena=quarto&em=-0.6,-1.2&zoom=2.2&olhar=3`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await foto('02-cama');

const antes = await luzesAcesas();
await clicar(await cupulaNaTela(0));
const apagado = await luzesAcesas();
const glowApagado = await mundo(`let c; R.traverse((o) => { if (o.name === 'cupula') c = o; }); return c.material.emissive ? c.material.emissive.getHex() * c.material.emissiveIntensity : 0;`);
await foto('03-abajur-apagado');
conferir('clicar no abajur apaga a cúpula e a luz dela', apagado === antes - 2 && !(glowApagado > 0), `${antes} → ${apagado}, brilho ${glowApagado}`);
await clicar(await cupulaNaTela(0));
conferir('clicar de novo acende', (await luzesAcesas()) === antes);

// ================================================================== a casa
await page.goto(`${BASE}/?cena=casa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await foto('04-casa');

conferir('o chão da sala tem assoalho', (await comTextura(0xc9975c)) >= 1);
conferir('o sofá tem tecido', (await comTextura(0xe0524a)) >= 4);
const madeiraSala = (await comTextura(0xb5793a)) + (await comTextura(0x8a5a2a));
conferir('os móveis de madeira da sala têm veio', madeiraSala >= 20, `${madeiraSala} malhas`);
conferir('a bancada da cozinha é de granito', (await comTextura(0xc9c8c2)) >= 1);
const capacho = await mundo(`
  const t = []; R.traverse((o) => { if (o.userData.peca === 'tapete') t.push(o); });
  return t.map((x) => x.children.filter((c) => c.isInstancedMesh).length);
`);
conferir('na sala, o tapete tem franja e o capacho não', capacho.length === 2 && capacho.includes(0) && capacho.includes(1), JSON.stringify(capacho));

await page.goto(`${BASE}/?cena=casa&em=-1.5,1.5&zoom=6`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await foto('05-sala');
const antesSala = await luzesAcesas();
await clicar(await cupulaNaTela(0));
const apagadoSala = await luzesAcesas();
await foto('06-sala-abajur-apagado');
conferir('o abajur de pé da sala apaga num clique', apagadoSala === antesSala - 2, `${antesSala} → ${apagadoSala}`);
await clicar(await cupulaNaTela(0));
conferir('e acende de novo', (await luzesAcesas()) === antesSala);

conferir('sem erro de console', erros.length === 0, erros.join(' | '));
await browser.close();
console.log(falhas ? `\n${falhas} falha(s)` : '\ntudo certo');
process.exit(falhas ? 1 : 0);
