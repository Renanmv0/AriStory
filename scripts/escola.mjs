/**
 * A Escola do Gatito (docs/ESCOLA.md): o saguão com o corredor e o refeitório,
 * as cinco salas atrás das portas, e o Gatito passeando.
 *
 * O que este teste guarda:
 * - as seis cenas sobem sem erro, e nenhuma entrada nasce dentro de colisor;
 * - TODA porta funciona nos dois sentidos: do saguão para a sala e da sala de
 *   volta, chegando na entrada certa (na frente da porta de onde saiu);
 * - o Gatito ANDA a ronda (a trilha soma distância de verdade), nunca pisa
 *   dentro de um móvel, e o ponto de conversa anda junto com ele;
 * - a cara dele bate com a pelúcia, MEDIDA na tela e não na foto: de frente
 *   para a câmera, a metade caramelo e a orelha caramelo ficam à direita de
 *   quem olha, e a orelha chocolate à esquerda (esquerda e direita já
 *   custaram quatro bugs a este projeto);
 * - ele é um pouco maior que o Pelusa (pedido do Renan);
 * - os oculinhos nascem escondidos (só na aula) e aparecem quando pedidos;
 * - o six seven: ele fica em pé, as duas patas da frente se revezam, nada
 *   afunda no chão, o aviso aparece, e ele volta ao normal no fim;
 * - conversar com ele a primeira vez põe a memória no diário;
 * - sentar na primeira fila da Sala 1 põe os dois nas cadeiras certas;
 * - o arremesso do ginásio: a primeira bola entra e conta.
 *
 * Uso: node scripts/escola.mjs /tmp/es
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './escola';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** as cores da paleta que o teste procura na cabeça dele (src/palette.ts) */
const CARAMELO = 0xcf8d5c;
const CREME = 0xf3ecdf;
const CHOCOLATE = 0x5f4a3f;

/** cada porta do saguão: a cena de trás dela e a entrada por onde se volta */
const PORTAS = [
  { para: 'escola-sala-1', entrada: 'do-saguao', volta: 'da-sala-1' },
  { para: 'escola-sala-2', entrada: 'do-saguao', volta: 'da-sala-2' },
  { para: 'escola-ginasio', entrada: 'do-saguao', volta: 'do-ginasio' },
  { para: 'escola-descanso', entrada: 'do-corredor', volta: 'do-descanso' },
  { para: 'escola-professores', entrada: 'do-corredor', volta: 'dos-professores' },
];
const CENAS = ['escola', ...PORTAS.map((p) => p.para)];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  const t = m.text();
  const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
  if (m.type() === 'error' && !ruido.some((r) => t.includes(r))) erros.push(t);
});
const problemas = [];

const abrir = async (cena, extra = '') => {
  await page.goto(`${BASE}/?cena=${cena}${extra}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
};
const cenaAtual = () => page.evaluate(() => window.jogo.current.def.id);
const prompt = async () =>
  (await page.locator('.prompt.show').count()) ? await page.locator('.prompt .label').textContent() : '';

/** Passa as falas até acabar; numa escolha, pega a opção `escolha` (0 = a primeira). */
const passarFalas = async (escolha = 1, max = 30) => {
  const falas = [];
  for (let i = 0; i < max; i++) {
    if (await page.locator('.escolhas button').count()) {
      for (let k = 0; k < escolha; k++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);
      }
      await page.keyboard.press('KeyE');
      await page.waitForTimeout(700);
      continue;
    }
    if (!(await page.locator('.dialogue.show').count())) {
      await page.waitForTimeout(500);
      if (!(await page.locator('.dialogue.show').count()) && !(await page.locator('.escolhas button').count())) break;
      continue;
    }
    await page.waitForTimeout(700);
    const quem = await page.locator('.dialogue .who').textContent().catch(() => '');
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t) falas.push(`${quem ?? ''}: ${t}`);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(300);
  }
  return falas;
};

/** quais destes pontos (círculos de raio `r`) encostam num colisor da cena */
const dentroDeColisor = (pontos, r) =>
  page.evaluate(
    ([pts, r]) => {
      const cs = window.jogo.current.world.colliders;
      const bate = (x, z) =>
        cs.some((c) => {
          if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < c.r + r - 1e-3;
          const cos = Math.cos(-c.rot);
          const sin = Math.sin(-c.rot);
          const rx = x - c.x;
          const rz = z - c.z;
          const lx = rx * cos - rz * sin;
          const lz = rx * sin + rz * cos;
          const dx = lx - Math.max(-c.hw, Math.min(c.hw, lx));
          const dz = lz - Math.max(-c.hd, Math.min(c.hd, lz));
          return dx * dx + dz * dz < (r - 1e-3) * (r - 1e-3);
        });
      return pts.filter(([x, z]) => bate(x, z));
    },
    [pontos, r],
  );

// ============================================ 0. um jogo novo, do zero
await abrir('escola');
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
await page.mouse.click(500, 420);

// ======================================= 1. as seis cenas e as entradas
const entradasPresas = [];
for (const cena of CENAS) {
  await abrir(cena);
  const id = await cenaAtual();
  if (id !== cena) problemas.push(`a cena ${cena} não subiu (veio ${id})`);
  await page.screenshot({ path: `${OUT}-${cena}.png` });
  const pontos = await page.evaluate(() => {
    const d = window.jogo.current.def;
    return [['spawn', d.spawn], ...Object.entries(d.entries ?? {})].map(([n, p]) => [p.x, p.z, n]);
  });
  const presos = await dentroDeColisor(pontos.map(([x, z]) => [x, z]), 0.42);
  for (const [x, z] of presos) {
    const nome = pontos.find((p) => p[0] === x && p[1] === z)?.[2];
    entradasPresas.push(`${cena}:${nome} (${x}, ${z})`);
  }
}
if (entradasPresas.length) problemas.push(`entrada dentro de colisor: ${entradasPresas.join(', ')}`);

// ================================= 2. cada porta, nos dois sentidos
const portas = [];
for (const p of PORTAS) {
  await abrir('escola');
  const ida = await page.evaluate((id) => {
    const it = window.jogo.current.world.interactables.find((i) => i.id === id);
    return it ? [it.x, it.z] : null;
  }, `door:${p.para}:${p.entrada}`);
  if (!ida) {
    problemas.push(`o saguão não tem porta para ${p.para}`);
    continue;
  }
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, 0), ida);
  await page.waitForTimeout(900);
  const rotuloIda = await prompt();
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(3000);
  const chegou = await cenaAtual();

  const volta = await page.evaluate((id) => {
    const it = window.jogo.current.world.interactables.find((i) => i.id === id);
    return it ? [it.x, it.z] : null;
  }, `door:escola:${p.volta}`);
  let voltou = null;
  let ondeVoltou = null;
  let esperado = null;
  if (volta) {
    await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI), volta);
    await page.waitForTimeout(900);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(3000);
    voltou = await cenaAtual();
    [ondeVoltou, esperado] = await page.evaluate((nome) => {
      const e = window.jogo.current.def.entries?.[nome];
      const p = window.jogo.player.position;
      return [[+p.x.toFixed(2), +p.z.toFixed(2)], e ? [e.x, e.z] : null];
    }, p.volta);
  }
  const erroDeChegada = ondeVoltou && esperado ? Math.hypot(ondeVoltou[0] - esperado[0], ondeVoltou[1] - esperado[1]) : Infinity;
  portas.push({ para: p.para, rotuloIda, chegou, voltou, erroDeChegada: +erroDeChegada.toFixed(2) });
  if (chegou !== p.para) problemas.push(`a porta "${rotuloIda}" levou para ${chegou}, e não para ${p.para}`);
  if (!volta) problemas.push(`${p.para} não tem porta de volta para a entrada ${p.volta}`);
  else if (voltou !== 'escola') problemas.push(`a porta de volta de ${p.para} levou para ${voltou}`);
  else if (erroDeChegada > 1.0) problemas.push(`voltando de ${p.para}, a dupla nasceu longe da porta (${erroDeChegada.toFixed(2)})`);
}

// ================================================ 3. o Gatito passeando
await abrir('escola');
await page.evaluate(() => window.jogo.debugPlace(13, 5.5, Math.PI));
const ondeGatito = () =>
  page.evaluate(() => {
    let g = null;
    window.jogo.scene.traverse((o) => {
      if (o.userData?.peca === 'gatito') g = o;
    });
    return g ? [+g.position.x.toFixed(3), +g.position.z.toFixed(3)] : null;
  });
const existe = (await ondeGatito()) !== null;
const trilha = [];
for (let i = 0; i < 40; i++) {
  trilha.push(await ondeGatito());
  await page.waitForTimeout(700);
}
let andou = 0;
let maiorPasso = 0;
for (let i = 1; i < trilha.length; i++) {
  const d = Math.hypot(trilha[i][0] - trilha[i - 1][0], trilha[i][1] - trilha[i - 1][1]);
  andou += d;
  maiorPasso = Math.max(maiorPasso, d);
}
const pisouEmMovel = await dentroDeColisor(trilha, 0.05);
const grudado = await page.evaluate(() => {
  const it = window.jogo.current.world.interactables.find((i) => i.id === 'escola:gatito');
  let g = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'gatito') g = o;
  });
  return it && g ? Math.hypot(it.x - g.position.x, it.z - g.position.z) : Infinity;
});
if (!existe) problemas.push('o Gatito não está no saguão');
if (andou < 2) problemas.push(`o Gatito mal andou (${andou.toFixed(2)} em 28 s)`);
if (maiorPasso > 1.5) problemas.push('o Gatito teleportou');
if (pisouEmMovel.length) problemas.push(`o Gatito pisou dentro de móvel em ${JSON.stringify(pisouEmMovel[0])}`);
if (grudado > 0.05) problemas.push(`o ponto de conversa ficou ${grudado.toFixed(2)} atrás do Gatito (faltou moveTo)`);

// ================================== 4. a cara, medida na tela, e o tamanho
// Ele para na frente da dupla, de frente para a câmera (a câmera padrão vem
// de +X/+Z: olhar para PI/4 é olhar para ela).
await page.evaluate(() => {
  let g = null;
  window.jogo.scene.traverse((o) => {
    if (o.userData?.peca === 'gatito') g = o;
  });
  const t = g.userData.teste;
  t.pausar(true);
  t.gatito.entrarEmServico();
  g.position.set(13, 0, 2.5);
  g.rotation.y = Math.PI / 4;
  window.jogo.debugPlace(15.5, 5.5, Math.PI);
  window.__gat = g;
});
await page.waitForTimeout(1500);
const cara = await page.evaluate(
  ([CARAMELO, CREME, CHOCOLATE]) => {
    const g = window.__gat;
    g.updateMatrixWorld(true);
    const cam = window.jogo.iso.camera;
    const naTela = (m) => {
      m.geometry.computeBoundingBox();
      const c = m.geometry.boundingBox.getCenter(m.position.clone());
      return c.applyMatrix4(m.matrixWorld).project(cam).x;
    };
    const achar = (tipo, cor, filtro = () => true) => {
      const r = [];
      g.traverse((o) => {
        if (o.isMesh && o.geometry.type === tipo && o.material.color?.getHex() === cor && filtro(o)) r.push(o);
      });
      return r;
    };
    const metade = (cor) => achar('SphereGeometry', cor, (o) => Math.abs(o.geometry.parameters.phiLength - Math.PI) < 1e-6 && o.geometry.parameters.thetaLength > 3)[0];
    const orelha = (cor) => achar('ConeGeometry', cor)[0];
    return {
      caramelo: naTela(metade(CARAMELO)),
      creme: naTela(metade(CREME)),
      orelhaCaramelo: naTela(orelha(CARAMELO)),
      orelhaChocolate: naTela(orelha(CHOCOLATE)),
    };
  },
  [CARAMELO, CREME, CHOCOLATE],
);
if (!(cara.caramelo > cara.creme)) problemas.push('a metade caramelo da cara não está à direita de quem olha');
if (!(cara.orelhaCaramelo > cara.orelhaChocolate)) problemas.push('as orelhas estão trocadas de lado');

const caixa = () =>
  page.evaluate(() => {
    const g = window.__gat;
    g.updateMatrixWorld(true);
    let min = [1e9, 1e9, 1e9];
    let max = [-1e9, -1e9, -1e9];
    g.traverse((o) => {
      if (!o.isMesh || !o.visible) return;
      let pai = o;
      while (pai) {
        if (!pai.visible) return;
        pai = pai.parent;
      }
      o.geometry.computeBoundingBox();
      const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      min = [Math.min(min[0], bb.min.x), Math.min(min[1], bb.min.y), Math.min(min[2], bb.min.z)];
      max = [Math.max(max[0], bb.max.x), Math.max(max[1], bb.max.y), Math.max(max[2], bb.max.z)];
    });
    return { chao: min[1], altura: max[1], largura: Math.hypot(max[0] - min[0], max[2] - min[2]) };
  });
const tamanho = await caixa();

// os oculinhos: escondidos fora da aula, e aparecem quando pedidos
const oculos = await page.evaluate(() => {
  let o = null;
  window.__gat.traverse((c) => {
    if (c.userData?.peca === 'oculos-do-gatito') o = c;
  });
  const antes = o?.visible ?? null;
  window.__gat.userData.teste.gatito.usarOculos(true);
  return { antes, depois: o?.visible ?? null };
});
if (oculos.antes !== false) problemas.push('os oculinhos aparecem fora da aula');
if (oculos.depois !== true) problemas.push('os oculinhos não aparecem quando pedidos');
await page.evaluate(() => {
  window.jogo.focusCamera(window.__gat);
  window.jogo.setZoom(3);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}-gatito-oculos.png`, clip: { x: 330, y: 230, width: 340, height: 300 } });
await page.evaluate(() => window.__gat.userData.teste.gatito.usarOculos(false));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-gatito-frente.png`, clip: { x: 330, y: 230, width: 340, height: 300 } });
await page.evaluate(() => {
  window.__gat.rotation.y = Math.PI / 4 + 0.7;
});
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}-gatito-lado.png`, clip: { x: 330, y: 230, width: 340, height: 300 } });
await page.evaluate(() => {
  window.__gat.rotation.y = Math.PI / 4;
});

// ======================================================== 5. o six seven
await page.evaluate(() => window.__gat.userData.teste.gatito.sixSeven());
await page.waitForTimeout(300);
// o aviso é lido logo: ele some sozinho depois de uns segundos
const avisos = await page.locator('.toast').allTextContents();
const amostras = [];
for (let i = 0; i < 14; i++) {
  await page.waitForTimeout(450);
  amostras.push(
    await page.evaluate(() => {
      const gt = window.__gat.userData.teste.gatito;
      return { fazendo: gt.fazendoSixSeven, postura: gt.postura.rotation.x, p0: gt.patas[0].rotation.x, p1: gt.patas[1].rotation.x };
    }),
  );
  if (i === 5) await page.screenshot({ path: `${OUT}-gatito-sixseven.png`, clip: { x: 330, y: 200, width: 340, height: 330 } });
}
const noChaoDePe = (await caixa()).chao;
const dePe = Math.min(...amostras.map((a) => a.postura));
const revezou = amostras.some((a) => a.p0 - a.p1 > 0.2) && amostras.some((a) => a.p1 - a.p0 > 0.2);
// e ele volta: espera o gesto acabar
let voltouAoNormal = false;
for (let i = 0; i < 40 && !voltouAoNormal; i++) {
  await page.waitForTimeout(500);
  voltouAoNormal = await page.evaluate(() => {
    const gt = window.__gat.userData.teste.gatito;
    return !gt.fazendoSixSeven && gt.postura.rotation.x > -0.08;
  });
}
if (dePe > -0.8) problemas.push(`no six seven ele não ficou em pé (giro ${dePe.toFixed(2)})`);
if (!revezou) problemas.push('no six seven as patas da frente não se revezaram');
if (noChaoDePe < -0.01) problemas.push(`no six seven ele afundou no chão (${noChaoDePe.toFixed(3)})`);
if (!avisos.some((t) => /six seven/i.test(t))) problemas.push('o "Six seven!" não apareceu na tela');
if (!voltouAoNormal) problemas.push('depois do six seven ele não voltou ao normal');

// ======================================= 6. conversar com ele pela primeira vez
await page.evaluate(() => window.jogo.debugPlace(13.9, 3.4, -Math.PI * 0.75));
await page.waitForTimeout(1000);
const rotuloGatito = await prompt();
await page.keyboard.press('KeyE');
await page.waitForTimeout(800);
const conversaComGatito = await passarFalas(1);
await page.waitForTimeout(800);
const memoriaDoGatito = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).some((m) => m.id === 'o-professor-gatito'),
);
if (!/gatito/i.test(rotuloGatito ?? '')) problemas.push(`perto dele o prompt era "${rotuloGatito}"`);
if (conversaComGatito.length < 4) problemas.push('a conversa do primeiro encontro não aconteceu');
if (!memoriaDoGatito) problemas.push('a memória do Gatito não entrou no diário');

// ======================================== 7. sentar na primeira fila da Sala 1
await abrir('escola-sala-1');
const sentar = await page.evaluate(() => {
  const it = window.jogo.current.world.interactables.find((i) => i.id === 'escola-sala-1:sentar');
  return it ? [it.x, it.z] : null;
});
let sentados = null;
if (!sentar) problemas.push('a Sala 1 não tem o "sentar na primeira fila"');
else {
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI), sentar);
  await page.waitForTimeout(900);
  await page.keyboard.press('KeyE');
  // até a pergunta "Ficar mais um pouco?"
  for (let i = 0; i < 20 && !(await page.locator('.escolhas button').count()); i++) {
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(500);
  }
  sentados = await page.evaluate(() => {
    const j = window.jogo;
    const pp = j.playerPosition();
    const pc = j.companionPosition();
    return {
      sentados: j.player.rig.sitting === true && j.parceiro.rig.sitting === true,
      jogador: [+pp.x.toFixed(2), +pp.z.toFixed(2)],
      parceiro: [+pc.x.toFixed(2), +pc.z.toFixed(2)],
    };
  });
  await page.screenshot({ path: `${OUT}-sala1-sentados.png` });
  await passarFalas(1);
  await page.waitForTimeout(800);
  // as cadeiras do meio da fila da frente: colunas -1,3 e 1,0, assento em z -0,42
  const erroJ = Math.hypot(sentados.jogador[0] + 1.3, sentados.jogador[1] + 0.42);
  const erroP = Math.hypot(sentados.parceiro[0] - 1.0, sentados.parceiro[1] + 0.42);
  if (!sentados.sentados) problemas.push('na primeira fila os dois não sentaram');
  if (erroJ > 0.3 || erroP > 0.3) problemas.push(`sentados fora das cadeiras: ${JSON.stringify(sentados)}`);
  const depois = await page.evaluate(() => {
    const p = window.jogo.player.position;
    return [[+p.x.toFixed(2), +p.z.toFixed(2)], window.jogo.player.rig.sitting];
  });
  if (depois[1]) problemas.push('depois de "Levantar" eles continuaram sentados');
  const presoDepois = await dentroDeColisor([depois[0]], 0.3);
  if (presoDepois.length) problemas.push('ao levantar da carteira, a dupla ficou dentro de um colisor');
}

// ================================================ 8. o arremesso no ginásio
await abrir('escola-ginasio');
const lance = await page.evaluate(() => {
  const it = window.jogo.current.world.interactables.find((i) => i.id === 'ginasio:arremesso-esquerda');
  return it ? [it.x, it.z] : null;
});
let cestas = 0;
let primeira = false;
if (!lance) problemas.push('o ginásio não tem o arremesso');
else {
  await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 0.3, z, -Math.PI / 2), lance);
  await page.waitForTimeout(900);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}-ginasio-arremesso.png` });
  // o voo leva um segundo de JOGO, que aqui é bem mais de relógio: espera a
  // cesta contar (com teto), passando as falas que aparecerem no caminho
  for (let i = 0; i < 60; i++) {
    cestas = await page.evaluate(() => window.jogo.stat('escola.cestas'));
    if (cestas > 0) break;
    await page.waitForTimeout(500);
  }
  await passarFalas(1);
  await page.waitForTimeout(800);
  cestas = await page.evaluate(() => window.jogo.stat('escola.cestas'));
  primeira = await page.evaluate(() => window.jogo.flag('escola-primeira-cesta'));
  if (cestas !== 1) problemas.push(`a primeira bola não contou como cesta (${cestas})`);
  if (!primeira) problemas.push('a primeira cesta não ficou marcada');
}

// ----------------------------------------------------------------- relatório
console.log('1. cenas:', CENAS.join(', '));
console.log('2. portas:');
for (const p of portas) console.log(`   ${p.rotuloIda?.trim()} → ${p.chegou} → ${p.voltou} (chegada a ${p.erroDeChegada} da entrada)`);
console.log('3. Gatito: andou', andou.toFixed(2), '· maior passo', maiorPasso.toFixed(2), '· pisou em móvel', pisouEmMovel.length, '· prompt a', grudado.toFixed(3));
console.log('4. cara na tela (x de -1 a 1):', JSON.stringify(Object.fromEntries(Object.entries(cara).map(([k, v]) => [k, +v.toFixed(3)]))));
console.log('   tamanho:', JSON.stringify(Object.fromEntries(Object.entries(tamanho).map(([k, v]) => [k, +v.toFixed(3)]))), '(o Pelusa tem 0,45 de alto)');
console.log('   oculinhos:', JSON.stringify(oculos));
console.log('5. six seven: giro mínimo', dePe.toFixed(2), '· patas se revezaram', revezou, '· chão', noChaoDePe.toFixed(3), '· voltou', voltouAoNormal);
console.log('   avisos:', JSON.stringify(avisos));
console.log('6. conversa:', JSON.stringify(conversaComGatito));
console.log('   memória no diário:', memoriaDoGatito);
console.log('7. primeira fila:', JSON.stringify(sentados));
console.log('8. cestas:', cestas, '· primeira marcada:', primeira);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');

if (erros.length) problemas.push('erros de console');
// um pouco maior que o Pelusa (0,45 de alto): nem igual, nem o dobro
if (tamanho.altura < 0.52 || tamanho.altura > 0.8) problemas.push(`altura do Gatito fora do combinado (${tamanho.altura.toFixed(2)})`);
if (tamanho.chao < -0.01) problemas.push(`o Gatito afunda no chão (${tamanho.chao.toFixed(3)})`);

await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + problemas.join('\n- '));
  process.exit(1);
}
console.log('OK');
process.exit(0);
