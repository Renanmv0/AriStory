/**
 * OS VISITANTES NOVOS DA PORTARIA (`entities/bichos/VisitanteDaPortaria.ts`):
 * cada um no balcão do minigame (`?portaria&cena=portaria&bloco=id`), com:
 * - os PÉS NO CHÃO (nada abaixo de 3 cm, nada boiando);
 * - o ROSTO declarado (`alturaDoRosto`, que o elevador do balcão usa) entre
 *   45 cm e 1,2 m, e o alto da cabeça (com o penteado) abaixo de 1,7 m;
 * - as peças que a pose mexe com NOME (a cabeça, os braços, as pernas);
 * - fotos de perto do rosto, de corpo inteiro de frente e de costas.
 * Uso: node scripts/visitantes.mjs /tmp/vi   (QUEM=hipolito,bento escolhe)
 */
import { chromium } from 'playwright';
const OUT = process.argv[2] ?? './visitantes';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const falhas = [];
const quem = (process.env.QUEM ?? 'hipolito,alpacina,alpacona,bento,beto,tata,preguica,lontra,bode,coala,pandaVermelho,texugo,dogoes').split(',');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 420, height: 420 } });
const erros = []; page.on('pageerror', (e) => erros.push(e.message));
for (const id of quem) {
  await page.goto(`${BASE}/?portaria&cena=portaria&bloco=lontra,${id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  for (let i = 0; i < 3; i++) { const h = await page.evaluate(() => window.portaria.modelos[0].group.position.y); await page.waitForTimeout(600); const h2 = await page.evaluate(() => window.portaria.modelos[0].group.position.y); if (Math.abs(h - h2) < 1e-4 && i > 3) break; }
  for (const [nome, dist, alvo, lado] of [['rosto', 0.95, 0.3, 0.15], ['corpo', 1.7, 0.45, 0.9], ['costas', 1.7, 0.45, -1]]) {
    const info = await page.evaluate(([dist, alvoDesc, lado]) => {
      const m = window.portaria.modelos[window.portaria.modelos.length - 1].group;
      if (window.portaria.modelos.length > 1) { m.position.set(3.4, 0, 5.8); }
      let top = -9, bot = 9; m.updateMatrixWorld(true);
      m.traverse((o) => { if (!o.isMesh || !o.visible) return; o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox; const e = o.matrixWorld.elements;
        for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { const wy = e[1]*x + e[5]*y + e[9]*z + e[13]; top = Math.max(top, wy); bot = Math.min(bot, wy); } });
      const V = window.jogo.playerPosition().constructor;
      const p = m.position;
      const rosto = m.userData.bicho?.alturaDoRosto;
      const y = rosto !== undefined && alvoDesc < 0.35 ? p.y + rosto : (rosto !== undefined && alvoDesc < 0.5 ? p.y + rosto * 0.6 : top - alvoDesc);
      // a câmera vai para onde o bicho olha (ou para as costas dele)
      const giro = m.rotation.y + (lado < 0 ? Math.PI : 0) + (lado > 0.5 ? 0.45 : 0);
      window.jogo.setCameraOmbro(new V(p.x + Math.sin(giro) * dist, y + 0.08 + (dist > 1.2 ? 0.25 : 0), p.z + Math.cos(giro) * dist), new V(p.x, y, p.z), 38);
      const nomes = ['corpo-do-visitante', 'braco-0', 'braco-1', 'perna-0', 'perna-1', 'cabeca-do-visitante'];
      const faltam = m.userData.peca?.startsWith('visitante-') ? nomes.filter((n) => !m.getObjectByName(n)) : [];
      return { top: +(top - p.y).toFixed(2), pe: +(bot - p.y).toFixed(3), rosto, faltam };
    }, [dist, alvo, lado]);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${id}-${nome}.png` });
    if (nome === 'rosto') {
      console.log(id, JSON.stringify(info));
      if (info.pe < -0.03 || info.pe > 0.03) falhas.push(`${id}: o pé não está no chão (${info.pe})`);
      if (info.top > 1.7) falhas.push(`${id}: alto demais (${info.top})`);
      if (id !== 'dogoes' && (info.rosto === undefined || info.rosto < 0.45 || info.rosto > 1.2)) falhas.push(`${id}: a altura do rosto (${info.rosto})`);
      if (info.faltam.length) falhas.push(`${id}: sem as peças ${info.faltam.join(', ')}`);
    }
  }
}
if (erros.length) falhas.push('erros de página: ' + erros.slice(0, 3).join(' | '));
await browser.close();
if (falhas.length) {
  console.log('FALHOU:\n- ' + falhas.join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
