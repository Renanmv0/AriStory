/**
 * A FOTO DE UM ENFEITE (a skill `aristory-enfeite`): compra e põe o enfeite
 * pedido no terreiro da estufa pelo modo de colocar DE VERDADE (a mesma barra
 * que a dupla usa), e fotografa de três jeitos — de perto com a dupla do lado
 * para a escala, no zoom normal da estufa, e o cartão dele na lojinha. Sem
 * id, põe o catálogo inteiro em fila e tira a foto do conjunto.
 *
 * Também confere o que quebra um enfeite sem aparecer na foto: o retrato do
 * cartão existe, a pegada (`raio`) cobre a peça desenhada, e a altura.
 *
 *   node scripts/enfeite.mjs /tmp/en              # todos
 *   node scripts/enfeite.mjs /tmp/en flamingo     # um só (o id da ficha)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/en';
const SO = process.argv[3] ?? null;
const BASE = process.env.BASE ?? 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const problemas = [];
const erros = [];
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT/.test(m.text())) erros.push(m.text()); });
await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=estufa&em=0,3`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.decorador, null, { timeout: 30000 });
await page.waitForTimeout(1000);

// o catálogo, lido da própria loja (o painel desenha por DECORACOES)
// com girassol e o recorde na 30 (a banca inteira aberta), o cartão mostra o
// botão de comprar como a dupla vai ver
await page.evaluate(() => {
  window.jogo.bump('jardim.girassois', 1000);
  window.jogo.bump('jardim.recorde', 30);
  void window.jogo.current.world.root.userData.abrirALojinha();
});
for (let i = 0; i < 20 && !(await page.locator('.loja-da-josefina.show').count()); i++) {
  if (await page.locator('.dialogue.show').count()) await page.keyboard.press('KeyE');
  await page.waitForTimeout(300);
}
await page.locator('.loja-da-josefina [data-aba="decoracoes"]').click();
await page.waitForTimeout(500);
const catalogo = await page.evaluate(() => [...document.querySelectorAll('.loja-da-josefina .produto.decoracao')].map((c) => ({
  id: c.dataset.id,
  retrato: !!c.querySelector('img')?.src?.startsWith('data:image/png'),
})));
const ids = SO ? [SO] : catalogo.map((c) => c.id);
if (SO && !catalogo.some((c) => c.id === SO)) {
  console.log(`FALHOU: "${SO}" não está no catálogo (${catalogo.map((c) => c.id).join(', ')})`);
  process.exit(1);
}
for (const c of catalogo.filter((k) => ids.includes(k.id))) if (!c.retrato) problemas.push(`${c.id}: o cartão da loja ficou sem retrato`);
if (SO) {
  await page.locator(`.loja-da-josefina .produto[data-id="${SO}"]`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator(`.loja-da-josefina .produto[data-id="${SO}"]`).screenshot({ path: `${OUT}-cartao.png` });
} else {
  await page.screenshot({ path: `${OUT}-loja.png` });
}
await page.locator('.loja-da-josefina .fechar').click();
await page.waitForTimeout(300);

/*
 * PÕE EM FILA no terreiro, da esquerda para a direita, pelo modo de colocar:
 * a dupla fica `0,85 + raio` atrás do ponto, olhando para `+Z`. O que a barra
 * recusar é cancelado e vira problema (e não fica na mão para o próximo).
 */
const postos = await page.evaluate(async (ids) => {
  const d = window.jogo.current.world.root.userData.decorador;
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const res = [];
  // um só vai em x = 3: entre dois arcos da estufa (eles passam em x = 0, ±6, ±12)
  let x = ids.length === 1 ? 3 : -7;
  let z = 0.5;
  for (const id of ids) {
    window.jogo.bump('jardim.girassois', 50);
    d.comprar(id);
    d.colocar(id);
    // o raio vem do anel do fantasma (o decorador desenha o anel com ele)
    await espera(100);
    let raio = 0.3;
    window.jogo.current.world.root.traverse((o) => {
      if (o.isMesh && o.geometry?.type === 'RingGeometry' && o.geometry.parameters.outerRadius - o.geometry.parameters.innerRadius < 0.08) {
        raio = o.geometry.parameters.innerRadius;
      }
    });
    if (ids.length > 1 && x + raio > 7) { x = -7; z -= 2.2; }
    x += raio;
    window.jogo.debugPlace(x, z - (0.85 + raio), 0);
    await espera(450);
    const motivo = document.querySelector('.posicionador .nao-pode')?.textContent ?? null;
    document.querySelector('.posicionador button.colocar')?.click();
    await espera(300);
    if (d.decorando) {
      document.querySelector('.posicionador [data-botao="cancelar"]')?.click();
      await espera(200);
    }
    // a peça no mundo: altura e o quanto ela passa da pegada
    let peca = null;
    window.jogo.current.world.root.traverse((o) => {
      if (o.userData?.peca?.startsWith?.('enfeite') && Math.abs(o.position.x - x) < 1e-3 && Math.abs(o.position.z - z) < 1e-3) peca = o;
    });
    let alto = 0;
    let largo = 0;
    if (peca) {
      peca.updateWorldMatrix(true, true);
      peca.traverse((m) => {
        // a luz (poça aditiva e halo) não é peça: fica de fora da medida
        if (!m.isMesh || m.isSprite || m.material?.blending === 2 || !m.geometry?.attributes?.position) return;
        // vértice por vértice: a caixa de uma esfera tem quinas que ela não tem
        const pos = m.geometry.attributes.position;
        const v = { x: 0, y: 0, z: 0 };
        const e = m.matrixWorld.elements;
        for (let i = 0; i < pos.count; i++) {
          const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
          v.x = e[0] * px + e[4] * py + e[8] * pz + e[12];
          v.y = e[1] * px + e[5] * py + e[9] * pz + e[13];
          v.z = e[2] * px + e[6] * py + e[10] * pz + e[14];
          alto = Math.max(alto, v.y);
          largo = Math.max(largo, Math.hypot(v.x - x, v.z - z));
        }
      });
    }
    res.push({ id, raio, ficou: !!peca && d.postas(id) > 0, motivo, alto: +alto.toFixed(2), largo: +largo.toFixed(2), x: +x.toFixed(2), z });
    x += raio + 0.5;
  }
  return res;
}, ids);

for (const p of postos) {
  const aviso = [];
  if (!p.ficou) problemas.push(`${p.id}: não ficou no chão (${p.motivo ?? 'sem motivo na barra'})`);
  // a pegada é o círculo que o enfeite ocupa: a peça pode passar dela um palmo, não mais
  if (p.ficou && p.largo > p.raio * 1.35 + 0.08) {
    problemas.push(`${p.id}: a peça vai até ${p.largo} m do centro e o raio é ${p.raio} — aumente o raio`);
  }
  if (p.alto > 1.4) aviso.push(`ALTO (${p.alto} m): tapa a dupla no lado da porta`);
  console.log(`  ${p.ficou ? 'ok ' : 'FALHOU'}  ${p.id.padEnd(22)} raio ${p.raio} · vai até ${p.largo} m · ${p.alto} m de altura ${aviso.join(' ')}`);
}

// as fotos: de perto com a dupla do lado, e no zoom normal da estufa
// a câmera olha de +X/+Z: a dupla fica ATRÁS do enfeite (em -X/-Z), senão tapa
const alvo = SO ? postos[0] : { x: 0, z: -1 };
await page.evaluate(({ x, z, so }) => {
  window.jogo.debugPlace(x - (so ? 1.1 : 0), z - (so ? 1.0 : -3.2), so ? 0.8 : Math.PI);
  window.jogo.setZoom(so ? 3.6 : 14);
}, { x: alvo.x, z: alvo.z, so: !!SO });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-perto.png` });
// e do outro lado (duas voltas do R): enfeite tem costas também
for (let i = 0; i < 2; i++) { await page.keyboard.press('KeyR'); await page.waitForTimeout(300); }
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}-girado.png` });

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log(`tudo certo — fotos em ${OUT}-*.png`);
process.exit(0);
