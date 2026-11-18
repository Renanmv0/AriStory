/**
 * O GATITO LAVANDO O ÔNIBUS (eventos/gatitoLavaOOnibus.ts, pedido do Renan: "de vez em quando o Gatito aparece ao
 * lado do ônibus dizendo que está limpando ele"), no pátio da escola (?cena=escola-patio):
 *  - QUEM: sem conhecer o Gatito, nada (mesmo com ?gatitoLavando); conhecido e com ?semGatitoLavando, nada;
 *    conhecido e com ?gatitoLavando, ele lá;
 *  - O MODELO: em pé no caixote (nada abaixo do tampo), a esponja aparecendo e ENCOSTADA na lataria (na altura da
 *    espuma), a pata fazendo a roda (a esponja anda), as bolhas subindo, o "fsh-fsh" tocando com a dupla perto;
 *  - A CONVERSA: o prompt "Falar com o Gatito", ele para de esfregar e vira para a dupla, as falas da lavagem, a
 *    memória "O ônibus brilhando" e ele de volta à esponja; a segunda conversa é uma fala só;
 *  - as fotos: de longe (a câmera do jogo), de três quartos, de perto e a conversa.
 *
 *   node scripts/gatitoLavando.mjs /tmp/gl
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/gl';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
const erros = [];
const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};
const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });

/** abre o pátio com um save de teste: `conhecido` liga o 'gatito-conhecido' */
const abrir = async (extra, conhecido) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text()); });
  const pronto = () => p.waitForFunction(() => !!window.jogo?.current?.world?.root.userData.onibusEscolarNaEscola && !window.jogo.transitioning, null, { timeout: 120000 });
  await p.goto(`${BASE}/?cena=escola-patio&semHalloween`, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await p.goto(`${BASE}/?cena=escola-patio&semHalloween`, { waitUntil: 'networkidle' });
  await pronto();
  await p.evaluate((sim) => { for (const f of ['escola-aberta', 'luna-na-escola', 'escola-visitada', ...(sim ? ['gatito-conhecido'] : [])]) window.jogo.setFlag(f); }, conhecido);
  await p.goto(`${BASE}/?cena=escola-patio&semHalloween&em=8.6,52.4${extra}`, { waitUntil: 'networkidle' });
  await pronto();
  await p.mouse.click(550, 300);
  await p.waitForTimeout(2500);
  return p;
};
const temGatito = (p) => p.evaluate(() => !!window.jogo.current.world.root.userData.gatitoLavando);

// ============================================================ 1. quem
console.log('\n1. quem aparece');
{
  const p = await abrir('&gatitoLavando', false);
  conferir(!(await temGatito(p)), 'sem conhecer o Gatito, nada de lavagem (mesmo forçada)');
  await p.close();
  const q = await abrir('&semGatitoLavando', true);
  conferir(!(await temGatito(q)), 'conhecido, mas sem sorte (?semGatitoLavando): nada');
  await q.close();
}

// ============================================================ 2. o modelo
console.log('\n2. o Gatito lavando');
const p = await abrir('&gatitoLavando', true);
conferir(await temGatito(p), 'conhecido e com ?gatitoLavando: ele está lá');
const medir = () => p.evaluate(() => {
  const { gatito, face, esponja } = window.jogo.current.world.root.userData.gatitoLavando;
  gatito.group.updateMatrixWorld(true);
  const caixa = new (window.jogo.scene.position.constructor)();
  let pe = Infinity, temEsponja = false;
  gatito.group.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    let vis = true;
    for (let a = o; a; a = a.parent) if (!a.visible) vis = false;
    if (!vis) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 3) {
      caixa.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      pe = Math.min(pe, caixa.y);
    }
  });
  gatito.group.traverse((o) => { if (o.isGroup && o.children.some((c) => c.geometry?.type === 'RoundedBoxGeometry')) temEsponja = o.visible; });
  return { pe, face, esponja: esponja.toArray(), esfregando: gatito.esfregando, temEsponja, rot: gatito.group.rotation.y, conta: window.jogo.audio.contagem.get('esfrega') ?? 0 };
});
// (o navegador do teste anda a ~1/10 do relógio: espera a pose assentar no relógio do JOGO)
await p.waitForFunction(() => window.jogo.elapsed > 3.5, null, { timeout: 300000 });
const a = await medir();
await p.waitForTimeout(700);
const b = await medir();
console.log('      ', JSON.stringify(a));
conferir(a.pe > 0.4, `em pé no caixote: nada dele abaixo do tampo (o pé em ${a.pe.toFixed(3)})`);
conferir(a.esfregando && a.temEsponja, 'esfregando, com a esponja na pata');
const folga = Math.min(a.esponja[2], b.esponja[2]) - a.face;
conferir(folga > -0.04 && folga < 0.1, `a esponja encosta na lataria (a ${(folga * 100).toFixed(1)} cm dela)`);
conferir(a.esponja[1] > 1.15 && a.esponja[1] < 1.6, `na altura da espuma (${a.esponja[1].toFixed(2)} m)`);
const anda = Math.hypot(a.esponja[0] - b.esponja[0], a.esponja[1] - b.esponja[1]);
conferir(anda > 0.01, `a esponja anda em roda (${(anda * 100).toFixed(1)} cm em 0,7 s)`);
const c = await medir();
conferir(c.conta > 0, `o "fsh-fsh" da esponja toca com a dupla perto (${c.conta})`);

// as fotos
await p.screenshot({ path: `${OUT}-iso.png` });
const foto = async (de, para, nome) => {
  await p.evaluate(([d, q]) => {
    const { gatito } = window.jogo.current.world.root.userData.gatitoLavando;
    const o = gatito.group.position;
    const V = window.jogo.scene.position.constructor;
    window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + q[0], q[1], o.z + q[2]));
  }, [de, para]);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${OUT}-${nome}.png` });
};
await foto([4.2, 2.6, 5.2], [0, 0.9, -0.4], 'tres-quartos');
await foto([1.4, 1.25, 1.6], [0, 0.85, -0.25], 'perto');
await foto([-1.6, 1.1, 1.3], [0, 0.85, -0.25], 'perto-do-outro-lado');
await p.evaluate(() => window.jogo.setCameraOmbro(null));
await p.waitForTimeout(800);

// ============================================================ 3. a conversa
console.log('\n3. a conversa');
const conversar = async (max = 40) => {
  const falas = [];
  for (let i = 0; i < max; i++) {
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(500);
      if (!(await p.locator('.dialogue.show').count()) && falas.length) break;
      continue;
    }
    await p.waitForTimeout(450);
    const quem = await p.evaluate(() => document.querySelector('.dialogue .who')?.textContent ?? '');
    const t = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (t && !falas.includes(`${quem}: ${t}`)) falas.push(`${quem}: ${t}`);
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(150);
  }
  return falas.filter((f, i) => !falas.slice(i + 1).some((g) => g.startsWith(f)));
};
const chegarPerto = async () => {
  await p.evaluate(() => {
    const { gatito, face } = window.jogo.current.world.root.userData.gatitoLavando;
    window.jogo.debugPlace(gatito.group.position.x + 0.5, face + 1.3, Math.PI + 0.3);
  });
  for (let i = 0; i < 20; i++) {
    if (/Gatito/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) return true;
    await p.waitForTimeout(150);
  }
  return false;
};
conferir(await chegarPerto(), 'perto dele, o prompt é "Falar com o Gatito"');
await p.keyboard.press('KeyE');
await p.waitForTimeout(1600);
const durante = await medir();
conferir(!durante.esfregando, 'na conversa ele larga a esponja');
conferir(Math.abs(Math.cos(durante.rot) - Math.cos(Math.PI)) > 0.05 || Math.abs(Math.sin(durante.rot)) > 0.1, `e vira para a dupla (giro ${durante.rot.toFixed(2)})`);
await p.screenshot({ path: `${OUT}-conversa.png` });
const primeira = await conversar(60);
console.log('      ' + primeira.join('\n      '));
conferir(primeira.some((f) => /^Gatito: .*banho no ônibus/.test(f)), 'ele conta que está dando banho no ônibus');
await p.waitForTimeout(3500);
const depois = await p.evaluate(() => (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).some((m) => m.id === 'gatito-lavando-o-onibus'));
conferir(depois, 'a memória "O ônibus brilhando"');
const voltou = await medir();
conferir(voltou.esfregando, 'e ele volta a esfregar');
await p.waitForTimeout(800);
conferir(await chegarPerto(), 'dá para falar de novo');
await p.keyboard.press('KeyE');
await p.waitForTimeout(800);
const segunda = await conversar(10);
console.log('      ' + segunda.join('\n      '));
conferir(segunda.length === 1 && segunda[0].startsWith('Gatito:'), 'na segunda vez, uma fala só dele');

const peso = await p.evaluate(() => window.jogo.renderer.info.render);
console.log(`\n   peso: ${peso.calls} desenhos, ${peso.triangles} triângulos`);
conferir(erros.length === 0, 'sem erros de console', erros.slice(0, 3).join(' | '));
await browser.close();
console.log(falhas.length ? `\nFALHOU: ${falhas.join('; ')}` : '\nO Gatito está lavando o ônibus.');
process.exit(falhas.length ? 1 : 0);
