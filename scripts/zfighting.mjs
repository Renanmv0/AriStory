/**
 * Caçador de z-fighting nas peças do kit.
 *
 * Z-fighting é sempre a mesma coisa: duas superfícies opacas caindo no MESMO
 * plano, com sobreposição de área. A GPU não tem como decidir qual está na
 * frente, e o pixel alterna entre as duas conforme a câmera gira — a peça
 * serrilha e pisca.
 *
 * Este teste não fotografa nem confia no olho: ele mede. Para cada peça
 * etiquetada, pega as caixas dos filhos em espaço LOCAL (onde tudo está
 * alinhado aos eixos), e procura pares de faces que caiam no mesmo plano
 * enquanto se sobrepõem nos outros dois eixos.
 *
 * A saída lista o par e a área compartilhada, para dar para consertar sem
 * adivinhar. A correção é sempre a mesma família: SOBREPOR de leve em vez de
 * encostar, ou recuar a peça de dentro para longe da face.
 *
 * Uso: node scripts/zfighting.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** cada peça, e em que cena ela aparece */
const PECAS = [
  ['quiosque', 'villa-lobos'],
  ['arquibancada', 'villa-lobos'],
  ['estante', 'quarto'],
  ['loja-de-patins', 'villa-lobos'],
  ['restaurante', 'clube'],
  ['vestiario', 'clube'],
  ['mesa-de-patio', 'clube'],
  ['cadeira-de-patio', 'clube'],
  ['pergolado', 'clube'],
  ['muro-do-clube', 'clube'],
  ['portao-do-clube', 'clube'],
  ['guarita', 'clube'],
  ['espreguicadeira', 'clube'],
  ['mesinha-de-deque', 'clube'],
  ['onibus', 'clube'],
  ['ponto-de-onibus', 'clube'],
  ['meio-fio', 'clube'],
];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

/** procura faces coplanares dentro de uma peça, em espaço local */
const caçar = (etiqueta) =>
  page.evaluate((alvo) => {
    const achados = [];
    let peca = null;
    window.jogo.scene.traverse((o) => {
      if (!peca && o.userData?.peca === alvo) peca = o;
    });
    if (!peca) return null;

    // as caixas dos filhos, em espaço local da peça. Só malhas de caixa sem
    // rotação: com rotação a caixa deixa de ser alinhada e a conta não vale —
    // e peça girada raramente compartilha plano com a vizinha por acidente.
    const caixas = [];
    const recolher = (obj, dx, dy, dz) => {
      for (const f of obj.children) {
        const px = dx + f.position.x;
        const py = dy + f.position.y;
        const pz = dz + f.position.z;
        const girado =
          Math.abs(f.rotation.x) > 1e-6 ||
          Math.abs(f.rotation.y) > 1e-6 ||
          Math.abs(f.rotation.z) > 1e-6;
        const p = f.geometry?.parameters;
        if (f.isMesh && f.geometry?.type === 'BoxGeometry' && !girado && p) {
          // material transparente não briga por pixel opaco
          if (f.material?.transparent && (f.material.opacity ?? 1) < 0.95) continue;
          caixas.push({
            nome: f.name || `caixa${caixas.length}`,
            min: [px - (p.width * f.scale.x) / 2, py - (p.height * f.scale.y) / 2, pz - (p.depth * f.scale.z) / 2],
            max: [px + (p.width * f.scale.x) / 2, py + (p.height * f.scale.y) / 2, pz + (p.depth * f.scale.z) / 2],
            // decalque de chão resolve o empilhamento por polygonOffset de
            // propósito: não é bug, é o mecanismo
            offset: !!f.material?.polygonOffset,
          });
        }
        if (f.children?.length) recolher(f, px, py, pz);
      }
    };
    recolher(peca, 0, 0, 0);

    const EIXOS = ['x', 'y', 'z'];
    for (let a = 0; a < caixas.length; a++) {
      for (let b = a + 1; b < caixas.length; b++) {
        const A = caixas[a];
        const B = caixas[b];
        if (A.offset || B.offset) continue;
        for (let eixo = 0; eixo < 3; eixo++) {
          const o1 = (eixo + 1) % 3;
          const o2 = (eixo + 2) % 3;
          // as duas caixas têm que se sobrepor de verdade nos OUTROS dois eixos,
          // senão as faces são coplanares mas nunca aparecem no mesmo pixel
          const sobre1 = Math.min(A.max[o1], B.max[o1]) - Math.max(A.min[o1], B.min[o1]);
          const sobre2 = Math.min(A.max[o2], B.max[o2]) - Math.max(A.min[o2], B.min[o2]);
          if (sobre1 <= 0.004 || sobre2 <= 0.004) continue;

          // SÓ faces que apontam para o mesmo lado (min com min, max com max).
          //
          // `max × min` é uma caixa terminando onde a outra começa — empilhamento
          // normal, e as duas faces ficam escondidas uma pela outra. Quem
          // serrilha é o par que olha para a MESMA direção: aí as duas são
          // visíveis do lado de fora e a GPU não tem como desempatar.
          for (const [fa, fb] of [['min', 'min'], ['max', 'max']]) {
            const d = Math.abs(A[fa][eixo] - B[fb][eixo]);
            if (d < 0.0015) {
              achados.push({
                eixo: EIXOS[eixo],
                plano: +A[fa][eixo].toFixed(3),
                area: +(sobre1 * sobre2).toFixed(3),
                entre: `${A.nome}.${fa} × ${B.nome}.${fb}`,
              });
            }
          }
        }
      }
    }
    return { quantas: caixas.length, achados };
  }, etiqueta);

const relatorio = [];
for (const [etiqueta, cena] of PECAS) {
  await page.goto(`${BASE}/?cena=${cena}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  const r = await caçar(etiqueta);
  relatorio.push([etiqueta, r]);
}

let total = 0;
for (const [etiqueta, r] of relatorio) {
  if (!r) {
    console.log(`${etiqueta}: NÃO ENCONTRADA na cena`);
    total += 1;
    continue;
  }
  console.log(`${etiqueta}: ${r.quantas} caixas · ${r.achados.length} pares coplanares`);
  for (const a of r.achados.slice(0, 12)) {
    console.log(`   ${a.eixo} = ${a.plano} · área ${a.area} · ${a.entre}`);
  }
  total += r.achados.length;
}
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

await browser.close();
if (total > 0 || erros.length) {
  console.log(`FALHOU: ${total} par(es) de faces coplanares — é isso que serrilha na tela`);
  process.exit(1);
}
process.exit(0);
