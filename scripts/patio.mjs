// O PÁTIO DA FRENTE DA ESCOLA DO GATITO (`scenes/escolaPatio.ts`, `docs/ESCOLA-PATIO.md`):
// o prédio de tijolinho com a rotunda, a cúpula e as alas, e o pátio com os
// mastros, os canteiros, os bancos e a placa. Por enquanto é cena à parte
// (`?cena=escola-patio`): o ônibus continua levando direto para o saguão.
//
//  - CHEGAR: da calçada da rua até a porta há um caminho livre (o eixo da
//    porta dá a volta na ilha do mastro do meio), e o nascimento e a entrada
//    do saguão caem fora dos colisores;
//  - O PRÉDIO: todo vértice do prédio na altura do corpo (25 cm a 1,9 m) cabe
//    nos colisores — ninguém atravessa uma parede, um peitoril ou o portal;
//  - A PORTA: o "Entrar na escola" leva ao saguão;
//  - AS BANDEIRAS balançam (o pano muda de um quadro para o outro);
//  - AS FOTOS: os 8 giros da câmera, o cartão-postal (a câmera na altura de
//    quem chega, como a foto do Renan) e o portal de perto, e o peso da vista.
//
// uso: node scripts/patio.mjs [/tmp/pt]   (CEL=1 no celular em pé; SMOKE_URL troca o servidor)
import { chromium, devices } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const OUT = process.argv[2] ?? '/tmp/pt';
const CEL = process.env.CEL === '1';
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
let falhas = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ok ' : 'FALHA'} ${msg}`); if (!cond) falhas++; };
const abrir = async (page, extra = '') => {
  await page.goto(`${BASE}/?semHalloween&cena=escola-patio${extra}`);
  await page.waitForFunction(() => window.jogo?.idDaCena === 'escola-patio' && !window.jogo.transitioning, null, { timeout: 120000 });
  await page.waitForTimeout(1200);
};
try {
  const ctx = await b.newContext(CEL ? { ...devices['iPhone 13'] } : { viewport: { width: 1100, height: 760 } });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.length < 5 && erros.push(e.message));
  await abrir(page);

  // ------------------------------------------------------------- chegar
  const r = await page.evaluate(() => {
    const j = window.jogo;
    const cols = j.current.world.colliders;
    const preso = (x, z, raio = 0.42) => cols.some((k) => (k.kind === 'circle'
      ? Math.hypot(x - k.x, z - k.z) < k.r + raio
      : (() => {
        // a caixa pode estar girada (o giro do colisor tem o sinal contrário ao do rotation.y)
        // (a mesma conta do `world/collision.ts`: o ponto vai para o quadro da caixa por −rot)
        const c = Math.cos(k.rot ?? 0), s = Math.sin(k.rot ?? 0);
        const dx = x - k.x, dz = z - k.z;
        const lx = dx * c + dz * s, lz = -dx * s + dz * c;
        return Math.abs(lx) < k.hw + raio && Math.abs(lz) < k.hd + raio;
      })()));
    // a rota a pé: a calçada, o calçadão, a volta na ilha do mastro, a praça e a porta
    const rota = [[0, 17.8], [0, 11], [3.2, 7], [3.2, 1], [0, -3], [0, -8], [0, -11.2]];
    const travas = [];
    for (let i = 0; i < rota.length - 1; i++) {
      const [x0, z0] = rota[i], [x1, z1] = rota[i + 1];
      const n = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.2);
      for (let k = 0; k <= n; k++) {
        const x = x0 + ((x1 - x0) * k) / n, z = z0 + ((z1 - z0) * k) / n;
        if (preso(x, z)) { travas.push([+x.toFixed(1), +z.toFixed(1)]); break; }
      }
    }
    // o gramado da frente das alas é andável até a beira do canteiro (sem parede invisível)
    const b = j.current.world.bounds;
    const gramado = [[20, -14.9], [-20, -14.9], [30, -14.9], [-12, -14.9]].filter(([x, z]) => preso(x, z) || z < b.minZ + 0.42);
    const portas = j.current.world.interactables.filter((i) => i.enabled).map((i) => i.label);
    const p = j.player.position;
    return { travas, gramado, portas, nasce: [p.x, p.z], nascePreso: preso(p.x, p.z), entradaPresa: preso(0, -20 + 8.32 + 1.6) };
  });
  ok(r.travas.length === 0, `da calçada até a porta, o caminho está livre (dando a volta na ilha do mastro)${r.travas.length ? ' ' + JSON.stringify(r.travas) : ''}`);
  ok(r.gramado.length === 0, `o gramado na frente das alas é andável até a beira dos canteiros${r.gramado.length ? ' ' + JSON.stringify(r.gramado) : ''}`);
  ok(!r.nascePreso && !r.entradaPresa, 'o nascimento e a entrada de quem sai do saguão caem fora dos colisores');
  ok(r.portas.includes('Entrar na escola'), `a porta da escola está lá (${r.portas.filter((l) => !/banco/i.test(l)).join(', ')})`);
  ok(r.portas.filter((l) => /banco/i.test(l)).length >= 10, `os bancos dão para sentar (${r.portas.filter((l) => /banco/i.test(l)).length})`);

  // ------------------------------------------------------------- o prédio
  const predio = await page.evaluate(() => {
    const j = window.jogo;
    let raiz = null;
    j.scene.traverse((o) => { if (!raiz && o.userData.peca === 'predio-da-escola') raiz = o; });
    if (!raiz) return { achou: false };
    raiz.updateMatrixWorld(true);
    const cols = j.current.world.colliders;
    const dentro = (x, z) => cols.some((k) => (k.kind === 'circle'
      ? Math.hypot(x - k.x, z - k.z) <= k.r + 0.02
      : (() => {
        const c = Math.cos(k.rot ?? 0), s = Math.sin(k.rot ?? 0);
        const dx = x - k.x, dz = z - k.z;
        return Math.abs(dx * c + dz * s) <= k.hw + 0.02 && Math.abs(-dx * s + dz * c) <= k.hd + 0.02;
      })()));
    const V = j.player.object.position.constructor;
    const M = j.player.object.matrixWorld.constructor;
    const v = new V();
    const m = new M();
    const fora = [];
    let medidos = 0;
    raiz.traverse((o) => {
      if (!o.isMesh) return;
      const pos = o.geometry.getAttribute('position');
      const copias = o.isInstancedMesh ? o.count : 1;
      for (let c = 0; c < copias; c++) {
        for (let i = 0; i < pos.count; i += 3) {
          v.fromBufferAttribute(pos, i);
          if (o.isInstancedMesh) { o.getMatrixAt(c, m); v.applyMatrix4(m); }
          v.applyMatrix4(o.matrixWorld);
          if (v.y < 0.25 || v.y > 1.9) continue;
          medidos++;
          if (!dentro(v.x, v.z) && fora.length < 6) fora.push([+v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2)]);
        }
      }
    });
    return { achou: true, medidos, fora };
  });
  ok(predio.achou && predio.medidos > 1000 && predio.fora.length === 0,
    `todo o prédio na altura do corpo cabe nos colisores (${predio.medidos} vértices${predio.fora.length ? ', fora: ' + JSON.stringify(predio.fora) : ''})`);

  // ------------------------------------------------------- as bandeiras
  const pano = async () => page.evaluate(() => {
    const ps = [];
    window.jogo.scene.traverse((o) => { if (o.name === 'pano-da-bandeira') ps.push(o.geometry.getAttribute('position').getZ(40)); });
    return ps;
  });
  const antes = await pano();
  await page.waitForTimeout(700);
  const depois = await pano();
  ok(antes.length === 3 && antes.every((z, i) => Math.abs(z - depois[i]) > 1e-4), `as três bandeiras balançam (${antes.length})`);

  // ------------------------------------------------------------- as fotos
  const peso = { calls: 0, triangles: 0 };
  await page.evaluate(() => { window.jogo.player.object.position.set(0, 0, -3); });
  for (let k = 0; k < 8; k++) {
    await page.evaluate(() => window.jogo.iso.rotate(1));
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}-giro${k}.png` });
    const info = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
    if (info.calls > peso.calls) Object.assign(peso, info);
  }
  for (const [nome, de, para] of [
    ['cartao', [0, 2.2, 14], [0, 6.5, -20]],
    ['cartao3q', [22, 6, 16], [0, 5, -16]],
    ['portal', [4.5, 3.2, -3.5], [0, 3.2, -12]],
    ['alto', [30, 30, 18], [8, 6, -20]],
  ]) {
    await page.evaluate(([de, para]) => {
      const g = window.jogo, V = g.player.object.position.constructor;
      g.setCameraOmbro(new V(...de), new V(...para), 50);
    }, [de, para]);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}-${nome}.png` });
  }
  await page.evaluate(() => window.jogo.setCameraOmbro(null));
  console.log(`   peso no pior giro: ${peso.calls} desenhos, ${peso.triangles} triângulos`);

  // ------------------------------------------------------------- a porta
  await page.evaluate(() => {
    const j = window.jogo;
    const porta = j.current.world.interactables.find((i) => i.label === 'Entrar na escola');
    porta.trigger(j);
  });
  const entrou = await page.waitForFunction(() => window.jogo.idDaCena === 'escola' && !window.jogo.transitioning, null, { timeout: 60000 }).then(() => true, () => false);
  ok(entrou, 'o "Entrar na escola" leva ao saguão');
  ok(erros.length === 0, `sem erros de console${erros.length ? ' ' + erros.join(' | ') : ''}`);
} finally {
  await b.close();
}
console.log(falhas ? `${falhas} FALHA(S)` : 'O pátio da escola está de pé.');
process.exit(falhas ? 1 : 0);
