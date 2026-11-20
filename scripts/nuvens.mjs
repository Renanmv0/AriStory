// As nuvens da frente da casa do Ari nunca ficam entre a câmera e a dupla.
//
// Na câmera isométrica (ortográfica, 34°, a 60 do alvo) uma nuvem só aparece
// no quadro quando está na linha entre a câmera e o chão — ou seja, na frente
// de alguém. O teste põe a dupla em vários pontos do jardim, da garagem e da
// rua, gira a câmera nos 8 passos e abre e fecha o zoom, e procura qualquer
// esfera de nuvem dentro do quadro. Fotografa a vista com o zoom aberto nos
// 8 giros.
//
// uso: node scripts/nuvens.mjs [/tmp/nv]   (CEL=1 roda no celular em pé)
import { chromium, devices } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const OUT = process.argv[2];
const CEL = process.env.CEL === '1';
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
let falhas = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ok ' : 'FALHA'} ${msg}`); if (!cond) falhas++; };
try {
  const ctx = await b.newContext(CEL ? { ...devices['iPhone 13'] } : { viewport: { width: 1000, height: 750 } });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(BASE + '/?bebito&semHalloween&cena=frente-da-casa');
  await p.waitForFunction(() => window.jogo?.idDaCena === 'frente-da-casa' && !window.jogo.transitioning, null, { timeout: 120000 });

  const r = await p.evaluate(() => {
    const g = window.jogo, iso = g.iso, c = iso.camera;
    const nuvens = g.scene.children.flatMap((o) => (o.name === 'nuvem' ? [o] : []));
    g.current.world.root.traverse((o) => { if (o.name === 'nuvem' && !nuvens.includes(o)) nuvens.push(o); });
    const V = c.position.constructor;
    const pontos = [[0, 2], [-6, 4], [6, 6], [3, -2], [-10, 8], [12, 10], [-4, 14], [20, 12], [-24, 12]];
    const naFrente = [];
    let vistas = 0;
    for (const [x, z] of pontos) {
      for (let k = 0; k < 8; k++) {
        iso.rotate(1);
        for (const zoom of [-30, 30]) {
          iso.zoomBy(zoom);
          const alvo = new V(x, 0, z);
          for (let i = 0; i < 150; i++) iso.update(1 / 30, alvo);
          c.updateMatrixWorld();
          vistas++;
          for (const n of nuvens) {
            n.updateMatrixWorld(true);
            for (const m of n.children) {
              const v = new V().setFromMatrixPosition(m.matrixWorld).applyMatrix4(c.matrixWorldInverse);
              const r0 = m.geometry.parameters.radius;
              const hw = (c.right - c.left) / 2, hh = (c.top - c.bottom) / 2;
              if (-v.z + r0 > c.near && Math.abs(v.x) < hw + r0 && Math.abs(v.y) < hh + r0) {
                naFrente.push({ x, z, giro: k, zoom, altura: +n.position.y.toFixed(1) });
                break;
              }
            }
          }
        }
      }
    }
    const altura = Math.min(...nuvens.map((n) => n.position.y));
    return { nuvens: nuvens.length, vistas, naFrente: naFrente.slice(0, 5), quantas: naFrente.length, altura };
  });
  ok(r.nuvens === 7, `as sete nuvens continuam no céu (${r.nuvens}, a mais baixa a ${r.altura.toFixed(1)})`);
  ok(r.quantas === 0, `nenhuma nuvem no quadro em ${r.vistas} vistas (8 giros, zoom fechado e aberto, ${r.vistas / 16} pontos)${r.quantas ? ' ' + JSON.stringify(r.naFrente) : ''}`);

  if (OUT) {
    // a vista de verdade, com o jogo andando: zoom todo aberto, um giro por foto
    await p.evaluate(() => { window.jogo.iso.zoomBy(30); });
    for (let k = 0; k < 8; k++) {
      await p.evaluate(() => window.jogo.iso.rotate(1));
      await p.waitForTimeout(900);
      await p.screenshot({ path: `${OUT}-giro${k}.png` });
    }
  }
  ok(erros.length === 0, `sem erros de console${erros.length ? ' ' + erros.slice(0, 3).join(' | ') : ''}`);
} finally {
  await b.close();
}
console.log(falhas ? `${falhas} FALHA(S)` : 'As nuvens da frente da casa ficam fora do caminho da câmera.');
process.exit(falhas ? 1 : 0);
