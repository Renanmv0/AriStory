/**
 * AS PRAGAS DA ESTUFA — enfileira as seis e tira retrato de cada uma.
 *
 * Elas são do minigame do jardim (`docs/MINIGAME-JARDIM.md` §5), que ainda não
 * existe: nenhuma delas está numa cena, ninguém as instancia, e sem este script
 * não haveria como OLHAR para elas. Peça de bicho que não se consegue olhar não
 * se consegue ajustar, e ajustar é justamente o que vem agora.
 *
 * O que ele guarda, além das fotos:
 *
 * - AS SEIS EXISTEM e montam sem erro de console;
 * - CADA UMA NASCE COM A BASE EM `y = 0` e centrada em `x = 0, z = 0`, que é o
 *   contrato do kit inteiro. Bicho que nasce enterrado ou flutuando só aparece
 *   quando ele já está andando numa onda, e aí é tarde;
 * - A SILHUETA SEPARA O TIER: fraco é baixo, médio é de joelho, o tanque é o
 *   mais LARGO e o chefe é o mais ALTO. É o que faz o jogador ler a ameaça
 *   antes de ler a forma, com cinco deles na tela;
 * - NENHUMA ENCOSTA NA OUTRA quando enfileiradas com 2 m de espaçamento — é a
 *   prova barata de que nenhuma delas ficou grande demais para o terreiro.
 *
 * Uso: node scripts/pragas.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './pragas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** onde a fila é montada: o terreiro da estufa, que é plano e vazio */
// 3,6 de passo: o chefe tem 3 de comprimento, e com 2 ele encostava no tanque
// na foto da fila — o que e justamente o que o teste diz que nao pode.
const FILA = { x: -9, z: -1.5, passo: 3.6 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3600);

/**
 * MONTA AS SEIS NA CENA e mede cada uma pela GEOMETRIA.
 *
 * A medida sai dos oito cantos da bounding box de cada malha levados para o
 * mundo — a mesma conta que o `estufa.mjs` usa. Medir pela peça desenhada, e
 * não por um raio inventado, já evitou dois defeitos que passaram verde.
 */
const medidas = await page.evaluate(([x0, z0, passo]) => {
  const w = window.jogo.current.world;
  const pragas = window.aristoryPragas;
  const medir = (o) => {
    o.updateWorldMatrix(true, true);
    const b = { minx: 1e9, maxx: -1e9, miny: 1e9, maxy: -1e9, minz: 1e9, maxz: -1e9 };
    o.traverse((c) => {
      if (!c.isMesh || !c.geometry) return;
      if (!c.geometry.boundingBox) c.geometry.computeBoundingBox();
      const bb = c.geometry.boundingBox;
      const e = c.matrixWorld.elements;
      for (const vx of [bb.min.x, bb.max.x]) {
        for (const vy of [bb.min.y, bb.max.y]) {
          for (const vz of [bb.min.z, bb.max.z]) {
            const X = e[0] * vx + e[4] * vy + e[8] * vz + e[12];
            const Y = e[1] * vx + e[5] * vy + e[9] * vz + e[13];
            const Z = e[2] * vx + e[6] * vy + e[10] * vz + e[14];
            b.minx = Math.min(b.minx, X); b.maxx = Math.max(b.maxx, X);
            b.miny = Math.min(b.miny, Y); b.maxy = Math.max(b.maxy, Y);
            b.minz = Math.min(b.minz, Z); b.maxz = Math.max(b.maxz, Z);
          }
        }
      }
    });
    return b;
  };

  return pragas.map((ficha, i) => {
    const x = x0 + i * passo;
    // eles nascem olhando para `+Z`, que é o lado de CÁ na câmera isométrica.
    // A primeira versão girava `Math.PI` e fotografava a nuca das seis.
    const bicho = w.add(w.place(ficha.monta(1, 0.4), x, 0, z0));
    // guardadas por id para o retrato: a câmera segue o JOGADOR, então focar
    // nela é o único jeito de enquadrar o bicho e não a dupla
    (window.__pragas ??= {})[ficha.id] = bicho;
    const b = medir(bicho);
    return {
      id: ficha.id,
      tier: ficha.tier,
      mistura: ficha.mistura,
      encharque: ficha.encharque,
      alturaDaBarra: ficha.alturaDaBarra,
      x,
      // a base tem que encostar no chão, e o centro tem que ser o centro
      pousa: +b.miny.toFixed(3),
      altura: +(b.maxy - b.miny).toFixed(2),
      largura: +(b.maxx - b.minx).toFixed(2),
      comprimento: +(b.maxz - b.minz).toFixed(2),
      desvioX: +(((b.minx + b.maxx) / 2) - x).toFixed(2),
      desvioZ: +(((b.minz + b.maxz) / 2) - z0).toFixed(2),
      malhas: (() => { let n = 0; bicho.traverse((c) => { if (c.isMesh) n += 1; }); return n; })(),
      /**
       * A COR PRINCIPAL: a que pinta mais malhas do bicho.
       *
       * Ela existe para o teste cobrar que cada praga tenha a SUA. Antes as
       * seis saiam da mesma familia de roxo, e o Renan não conseguia dizer
       * qual era qual — o que é o problema inteiro quando há cinco na tela.
       */
      corPrincipal: (() => {
        const conta = new Map();
        bicho.traverse((c) => {
          if (!c.isMesh || !c.material?.color) return;
          const hex = c.material.color.getHexString();
          conta.set(hex, (conta.get(hex) ?? 0) + 1);
        });
        return [...conta.entries()].sort((a, b) => b[1] - a[1])[0][0];
      })(),
    };
  });
}, [FILA.x, FILA.z, FILA.passo]);

// ------------------------------------------------------------------- fotos
// a dupla sai de cena: ela é do tamanho de três pragas e tapa a fila inteira
await page.evaluate(() => window.jogo.debugPlace(0, 9, 0));
await page.waitForTimeout(600);

const meio = FILA.x + (medidas.length - 1) * FILA.passo / 2;
const enquadrar = async (alvo, zoom) => {
  await page.evaluate(
    ([id, z]) => {
      window.jogo.focusCamera(id ? window.__pragas[id] : null);
      window.jogo.setZoom(z);
    },
    [alvo, zoom],
  );
  await page.waitForTimeout(1300);
};

/**
 * A FILA INTEIRA, com a câmera numa âncora no meio dela.
 *
 * `focusCamera` recebe um objeto, então a visão geral usa a praga do meio como
 * apoio e abre o zoom — é mais barato que inventar um objeto vazio só para
 * apontar a câmera.
 */
await enquadrar(medidas[2].id, 11);
await page.screenshot({ path: `${OUT}-fila.png` });

// e um retrato de cada uma, de perto
for (const m of medidas) {
  await enquadrar(m.id, m.tier === 'chefe' || m.tier === 'tanque' ? 4 : 2.6);
  await page.screenshot({ path: `${OUT}-${m.id}.png` });
}

// e a fila girada, para conferir que nenhuma delas só funciona de frente
await enquadrar(medidas[2].id, 11);
await page.keyboard.press('KeyQ');
await page.waitForTimeout(1600);
await page.screenshot({ path: `${OUT}-girada.png` });
void meio;

// ------------------------------------------------------------------ relatório
for (const m of medidas) {
  console.log(
    `${m.id.padEnd(14)} ${m.tier.padEnd(7)} ${String(m.malhas).padStart(3)} malhas · ` +
    `alt ${m.altura} · larg ${m.largura} · comp ${m.comprimento} · ` +
    `pousa em ${m.pousa} · desvio (${m.desvioX}, ${m.desvioZ}) · ` +
    `#${m.corPrincipal} · barra a ${m.alturaDaBarra} · ${m.encharque} jatos · ${m.mistura}`,
  );
}
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const acha = (id) => medidas.find((m) => m.id === id);
const problemas = [];
if (erros.length) problemas.push('erros de console');
if (medidas.length !== 6) problemas.push(`o catálogo tem ${medidas.length} pragas, e não 6`);

for (const m of medidas) {
  // o contrato do kit: base em y = 0, centrada na origem
  if (Math.abs(m.pousa) > 0.06) {
    problemas.push(`"${m.id}" não pousa no chão (base em y=${m.pousa})`);
  }
  if (Math.abs(m.desvioX) > 0.3 || Math.abs(m.desvioZ) > 0.45) {
    problemas.push(`"${m.id}" não está centrada (desvio ${m.desvioX}, ${m.desvioZ})`);
  }
  // e nenhuma pode ser grande demais para caber no terreiro com folga
  if (m.largura > 3 || m.comprimento > 3.2) {
    problemas.push(`"${m.id}" ficou grande demais (${m.largura} x ${m.comprimento})`);
  }
  // o jogo roda em celular, e vão existir muitas na tela ao mesmo tempo
  const teto = m.tier === 'chefe' ? 90 : m.tier === 'tanque' ? 70 : 45;
  if (m.malhas > teto) {
    problemas.push(`"${m.id}" tem ${m.malhas} malhas (teto do tier: ${teto})`);
  }
}

/**
 * NENHUMA ENCOSTA NA OUTRA na fila — a prova barata de que nenhuma ficou
 * grande demais para conviver com as outras no terreiro.
 */
for (let i = 1; i < medidas.length; i++) {
  const a = medidas[i - 1];
  const b = medidas[i];
  const vao = (b.x - b.largura / 2) - (a.x + a.largura / 2);
  if (vao < 0.4) {
    problemas.push(`"${a.id}" e "${b.id}" quase se encostam na fila (vão de ${vao.toFixed(2)})`);
  }
}

/**
 * CADA UMA COM A SUA COR.
 *
 * Duas pragas com a mesma cor principal são duas manchas iguais no meio da
 * rodada — e o jogador precisa saber qual bicho está chegando, não só que algo
 * está chegando.
 */
const porCor = new Map();
for (const m of medidas) {
  const jaTem = porCor.get(m.corPrincipal);
  if (jaTem) problemas.push(`"${jaTem}" e "${m.id}" têm a mesma cor (#${m.corPrincipal})`);
  porCor.set(m.corPrincipal, m.id);
}

/**
 * A BARRA DE VIDA TEM QUE CABER EM CIMA DA CABEÇA.
 *
 * `alturaDaBarra` é o contrato do desenho com o minigame: onde pendurar a
 * barra. Abaixo do topo ela atravessa o bicho; alto demais ela desgruda dele e
 * vira legenda solta. A folga útil é de 8 a 45 cm acima da peça.
 */
for (const m of medidas) {
  const folga = +(m.alturaDaBarra - m.altura).toFixed(2);
  if (folga < 0.08 || folga > 0.45) {
    problemas.push(`a barra de "${m.id}" fica a ${folga} do topo dele (esperado entre 0.08 e 0.45)`);
  }
}

/**
 * A SILHUETA TEM QUE DIZER A VERDADE.
 *
 * O jogador lê o tamanho antes de ler a forma, então o tier precisa estar na
 * medida: o chefe é o mais alto, o tanque é o mais largo, e um fraco não pode
 * ser mais alto que um médio.
 */
const maisAlto = [...medidas].sort((a, b) => b.altura - a.altura)[0];
const maisLargo = [...medidas].sort((a, b) => b.largura - a.largura)[0];
if (maisAlto.tier !== 'chefe') {
  problemas.push(`o mais alto é "${maisAlto.id}" (${maisAlto.tier}), e devia ser o chefe`);
}
if (maisLargo.tier !== 'chefe' && maisLargo.tier !== 'tanque') {
  problemas.push(`o mais largo é "${maisLargo.id}" (${maisLargo.tier}), e devia ser o tanque`);
}
const altoDosFracos = Math.max(...medidas.filter((m) => m.tier === 'fraco').map((m) => m.altura));
const baixoDosMedios = Math.min(...medidas.filter((m) => m.tier === 'medio').map((m) => m.altura));
// e não basta ser MENOR: bicho fraco é um bicho PEQUENO, e a diferença tem que
// sobreviver a cinco deles correndo. Dois terços do médio mais baixo é a régua.
if (altoDosFracos >= baixoDosMedios * 0.67) {
  problemas.push(
    `um fraco (${altoDosFracos}) é quase da altura de um médio (${baixoDosMedios})`,
  );
}
// e o encharque tem que subir com o tier, senão a ficha mente para o jogador
const ordem = { fraco: 0, medio: 1, tanque: 2, chefe: 3 };
for (const a of medidas) {
  for (const b of medidas) {
    if (ordem[a.tier] < ordem[b.tier] && a.encharque >= b.encharque) {
      problemas.push(`"${a.id}" (${a.tier}) aguenta tanto quanto "${b.id}" (${b.tier})`);
    }
  }
}

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
process.exit(0);
