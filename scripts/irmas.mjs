/**
 * AS IRMÃS DA LUNA — a Sol e a Estrella, do piquenique ao ginásio e à aula.
 *
 * O pedido do Renan que este teste guarda: a Luna não faz piquenique sozinha
 * — as três irmãs estão sentadas juntas na toalha, a Luna fala primeiro (e é
 * ela quem leva a dupla à escola). No ginásio, antes da primeira aula, só a
 * Luna; para a segunda aula, a Luna e a SOL, e é com a Sol que se fala — ela
 * dá um SALTO; para a terceira, as três, e é com a ESTRELLA — ela dá uma
 * ESTRELINHA. Na aula, sempre as três.
 *
 * O que ele cobra:
 *
 * 1. O PIQUENIQUE: as três visíveis e sentadas na toalha, nenhuma tapando a
 *    outra na tela, cada uma de uma cor; a conversa é da Luna, e no fim as
 *    irmãs se apresentam; a Sol e a Estrella também conversam.
 * 2. O GINÁSIO ANTES DA 1ª AULA: só a Luna.
 * 3. O GINÁSIO ANTES DA 2ª: a Luna e a Sol, sem a Estrella. Falar com a Luna
 *    manda falar com a Sol (e não chama aula). Falar com a Sol: o SALTO —
 *    medido: sobe mais de meio metro e abre as pernas no alto — e depois o
 *    sinal e a chamada; as duas saem pela porta.
 * 4. O GINÁSIO ANTES DA 3ª: as três. Falar com a Estrella: a ESTRELINHA —
 *    medida: o corpo passa de cabeça para baixo, nada entra no chão, e ela
 *    volta ao lugar —, e depois a chamada.
 * 5. A SALA 1 NA AULA: as três sentadas nas carteiras.
 * 6. Fotos de tudo, e das três de perto.
 *
 * Uso: node scripts/irmas.mjs /tmp/ir
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './irmas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const IDS = ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho'];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await (await browser.newContext({ viewport: { width: 1100, height: 800 } })).newPage();
const erros = [];
const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
});

const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};

/** o save de um ponto da história: flags e quantas lições já concluídas */
const salvar = (flags, concluidas) =>
  page.evaluate(([flags, concluidas, ids]) => {
    const s = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
    s.flags = Object.fromEntries(flags.map((f) => [f, true]));
    s.apostila = {
      estrelas: Object.fromEntries(ids.slice(0, concluidas).map((id) => [id, 3])),
      abertas: ids.slice(0, concluidas),
    };
    localStorage.setItem('aristory.save.v1', JSON.stringify(s));
  }, [flags, concluidas, IDS]);

const ir = async (cena, em = '') => {
  await page.goto(`${BASE}/?cena=${cena}${em ? `&em=${em}` : ''}`, { waitUntil: 'networkidle' });
  for (let i = 0; i < 40; i++) {
    if (await page.evaluate(() => !!window.jogo?.current?.world && !window.jogo.transitioning).catch(() => false)) break;
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1500);
};

const texto = (sel) => page.evaluate((sel) => document.querySelector(sel)?.textContent ?? '', sel);
const prompt = () => texto('.prompt.show .label');
const esperarPrompt = async (re, vezes = 24) => {
  for (let i = 0; i < vezes; i++) {
    const p = await prompt();
    if (p && re.test(p)) return p;
    await page.waitForTimeout(250);
  }
  return prompt();
};

/** as irmãs da cena: visível, posição, estado, e o corpo medido (o ponto mais baixo) */
const irmas = () =>
  page.evaluate(() => {
    const r = {};
    window.jogo.current.world.root.traverse((o) => {
      const id = o.userData?.peca;
      if (!['luna', 'sol', 'estrella'].includes(id) || r[id]) return;
      const bicho = o.userData.teste?.[id];
      o.updateMatrixWorld(true);
      let minY = Infinity;
      const v = new window.jogo.scene.position.constructor();
      o.traverse((m) => {
        if (!m.isMesh || !m.visible) return;
        const pos = m.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 4) {
          v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
          minY = Math.min(minY, v.y);
        }
      });
      r[id] = {
        visivel: o.visible,
        x: +o.position.x.toFixed(2), z: +o.position.z.toFixed(2), y: +o.position.y.toFixed(2),
        estado: bicho?.estado ?? null,
        minY: +minY.toFixed(3),
        altura: bicho ? +bicho.medidaDoGesto.altura.toFixed(3) : null,
        giro: bicho ? +bicho.medidaDoGesto.giro.toFixed(3) : null,
        saltando: bicho?.estaSaltando ?? null,
        estrelinha: bicho?.estaFazendoEstrelinha ?? null,
      };
    });
    return r;
  });

/** avança as falas com E, anotando "quem: texto"; mede as irmãs a cada volta */
const conversar = async (max = 50, medir = null) => {
  const falas = [];
  for (let i = 0; i < max; i++) {
    if (medir) await medir();
    if (!(await page.locator('.dialogue.show').count())) {
      let voltou = false;
      // o salto e a estrelinha são pausas longas sem fala (no navegador sem tela,
      // o tempo do jogo anda a uns 20% do relógio): espera até ~16s
      for (let j = 0; j < 40 && !voltou; j++) {
        if (medir) await medir();
        await page.waitForTimeout(400);
        voltou = (await page.locator('.dialogue.show').count()) > 0;
      }
      if (!voltou) break;
      continue;
    }
    await page.waitForTimeout(550);
    const quem = await texto('.dialogue .who');
    const t = await texto('.dialogue .text');
    if (t && !falas.some((f) => f === `${quem}: ${t}`)) falas.push(`${quem}: ${t}`);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(150);
  }
  // guarda só a versão completa de cada fala (a máquina de escrever deixa pedaços)
  return falas.filter((f, i) => !falas.slice(i + 1).some((g) => g.startsWith(f)));
};

/** segura as acrobacias sozinhas do ginásio (o teste aciona na hora certa) */
const semAcrobacias = () =>
  page.evaluate(() => {
    window.jogo.current.world.root.traverse((o) => o.userData?.teste?.acrobacias?.(false));
  });

// ========================================================= 1. o piquenique
console.log('\n1. o piquenique');
await ir('villa-lobos');
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await ir('villa-lobos', '-21.2,-24.8');
await page.evaluate(() => window.jogo.setFlag('jean-luc-batido'));
await page.waitForTimeout(1500);
const noPiquenique = await irmas();
conferir(['luna', 'sol', 'estrella'].every((id) => noPiquenique[id]?.visivel && noPiquenique[id].estado === 'sentado'),
  'as três estão sentadas na toalha', JSON.stringify(Object.fromEntries(Object.entries(noPiquenique).map(([k, v]) => [k, v.estado]))));
const telaX = (p) => (p.x - p.z) * Math.SQRT1_2;
const separadas = [['luna', 'sol'], ['luna', 'estrella'], ['sol', 'estrella']]
  .map(([a, b]) => Math.abs(telaX(noPiquenique[a]) - telaX(noPiquenique[b])));
conferir(separadas.every((d) => d > 0.5), 'nenhuma tapa a outra na tela', separadas.map((d) => d.toFixed(2)).join(' · '));
conferir(Object.values(noPiquenique).every((p) => Math.hypot(p.x + 24, p.z + 27.6) < 1.2), 'todas em cima da toalha');
/** a câmera colada numa irmã (a dupla sai da zona da roda gigante, que manda no zoom) */
const dePerto = async (peca, zoom, nome) => {
  await page.evaluate(([peca, zoom]) => {
    let alvo = null;
    window.jogo.current.world.root.traverse((o) => { if (!alvo && o.userData?.peca === peca) alvo = o; });
    window.jogo.debugPlace(-40, 8, 0);
    window.jogo.focusCamera(alvo);
    window.jogo.setZoom(zoom);
  }, [peca, zoom]);
  for (let i = 0; i < 60 && (await page.evaluate(() => window.jogo.iso.currentViewSize)) > zoom + 0.3; i++) {
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}-${nome}.png` });
};
await dePerto('luna', 4.2, 'piquenique');
await dePerto('sol', 2.2, 'sol-de-perto');
await dePerto('estrella', 2.2, 'estrella-de-perto');
await page.evaluate(() => {
  window.jogo.focusCamera(null);
  window.jogo.setZoom(13);
});

await page.evaluate(() => window.jogo.debugPlace(-24.35 + 1.1, -27.9 + 1.1, -2.36));
conferir(/coelhinha/.test((await esperarPrompt(/coelhinha/)) ?? ''), 'o prompt é o da Luna');
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
let fotoDaApresentacao = false;
const piquenique = await conversar(60, async () => {
  if (fotoDaApresentacao) return;
  if (/HOLA, PANAS/.test(await texto('.dialogue .text'))) {
    fotoDaApresentacao = true;
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}-piquenique-sol-se-apresenta.png` });
  }
});
console.log('      ' + piquenique.slice(-8).join('\n      '));
const iPrimeiraDaSol = piquenique.findIndex((f) => f.startsWith('Sol:'));
conferir(piquenique[0]?.startsWith('Coelhinha:') && iPrimeiraDaSol > 10, 'a Luna fala primeiro; as irmãs, no fim');
conferir(piquenique.some((f) => f.startsWith('Estrella:')), 'a Estrella também se apresenta');
conferir(await page.evaluate(() => window.jogo.flag('escola-aberta')), 'e a escola abre');
const rotulos = await page.evaluate(() => ['parque:sol', 'parque:estrella']
  .map((id) => window.jogo.current.world.interactables.find((i) => i.id === id)?.label));
conferir(rotulos[0] === 'Falar com a Sol' && rotulos[1] === 'Falar com a Estrella', 'depois de apresentadas, pelo nome', rotulos.join(' / '));
await page.evaluate(() => window.jogo.debugPlace(-24 + 0.45 + 1.4, -27.6 - 0.55 + 0.2, -2.36));
await esperarPrompt(/Sol/);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const comASol = await conversar();
conferir(comASol.some((f) => f.startsWith('Sol:')), 'a Sol conversa', comASol[0] ?? '');

// ============================================ 2. o ginásio antes da 1ª aula
console.log('\n2. o ginásio antes da 1ª aula');
await salvar(['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'jean-luc-batido'], 0);
await ir('escola-ginasio', '1.6,4');
let gin = await irmas();
conferir(gin.luna?.visivel && !gin.sol && !gin.estrella, 'só a Luna', Object.keys(gin).join(','));
await page.screenshot({ path: `${OUT}-ginasio-0.png` });

// ============================================ 3. o ginásio antes da 2ª aula
console.log('\n3. o ginásio antes da 2ª aula: a Sol e o salto');
await salvar(['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'jean-luc-batido'], 1);
await ir('escola-ginasio', '1.6,4');
await semAcrobacias();
gin = await irmas();
conferir(gin.luna?.visivel && gin.sol?.visivel && !gin.estrella, 'a Luna e a Sol, sem a Estrella', Object.keys(gin).join(','));
await page.screenshot({ path: `${OUT}-ginasio-1.png` });

await page.evaluate(() => window.jogo.debugPlace(0.9, 3.3, -2.4));
await esperarPrompt(/Luna/);
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const comALuna = await conversar();
conferir(comALuna.some((f) => f.includes('Sol')) && !(await page.evaluate(() => window.jogo.flag('aula-chamada'))),
  'a Luna manda falar com a Sol, e não chama a aula', comALuna.at(-1) ?? '');

const SOL = gin.sol;
await page.evaluate(([S]) => window.jogo.debugPlace(S.x + 0.9, S.z + 0.9, -2.4), [SOL]);
conferir(/Sol/.test((await esperarPrompt(/Sol/)) ?? ''), 'o prompt é o da Sol');
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
let picoDoSalto = 0;
let fotoDoSalto = false;
const salto = await conversar(60, async () => {
  const s = (await irmas()).sol;
  if (!s) return;
  picoDoSalto = Math.max(picoDoSalto, s.altura);
  if (!fotoDoSalto && s.altura > 0.55) {
    fotoDoSalto = true;
    await page.screenshot({ path: `${OUT}-sol-no-ar.png` });
  }
});
console.log('      ' + salto.join('\n      '));
conferir(picoDoSalto > 0.5, 'a Sol salta: sobe mais de meio metro', picoDoSalto.toFixed(2));
conferir(fotoDoSalto, 'e a foto pegou ela no ar');
conferir(salto.some((f) => /SINAL/.test(f)) && (await page.evaluate(() => window.jogo.flag('aula-chamada'))),
  'depois do salto, o sinal e a chamada da aula 2');
const saem = await (async () => {
  for (let i = 0; i < 120; i++) {
    const r = await irmas();
    if (!r.luna?.visivel && !r.sol?.visivel) return true;
    await page.waitForTimeout(500);
  }
  return false;
})();
conferir(saem, 'a Luna e a Sol vão para a aula pela porta');

// ============================================ 4. o ginásio antes da 3ª aula
console.log('\n4. o ginásio antes da 3ª aula: a Estrella e a estrelinha');
await salvar(['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'jean-luc-batido'], 2);
await ir('escola-ginasio', '1.6,4');
await semAcrobacias();
gin = await irmas();
conferir(['luna', 'sol', 'estrella'].every((id) => gin[id]?.visivel), 'as três treinando');
await page.screenshot({ path: `${OUT}-ginasio-2.png` });
const EST = gin.estrella;
// a dupla chega pela frente-esquerda dela (à direita dela, na tela, fica a quadra livre)
await page.evaluate(([E]) => window.jogo.debugPlace(E.x + 1.0, E.z + 0.5, -2.2), [EST]);
conferir(/Estrella/.test((await esperarPrompt(/Estrella/)) ?? ''), 'o prompt é o da Estrella');
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
let maisDeCabecaParaBaixo = 0;
let menorY = Infinity;
let fotoDaEstrelinha = false;
const estrelinha = await conversar(60, async () => {
  const e = (await irmas()).estrella;
  if (!e?.estrelinha) return;
  const deCabeca = Math.abs(Math.cos(e.giro));
  if (Math.cos(e.giro) < -0.5) maisDeCabecaParaBaixo += 1;
  menorY = Math.min(menorY, e.minY);
  if (!fotoDaEstrelinha && Math.cos(e.giro) < -0.3) {
    fotoDaEstrelinha = true;
    await page.screenshot({ path: `${OUT}-estrella-de-cabeca-para-baixo.png` });
  }
  return deCabeca;
});
console.log('      ' + estrelinha.join('\n      '));
conferir(maisDeCabecaParaBaixo > 0, 'a Estrella dá a estrelinha: passa de cabeça para baixo', `${maisDeCabecaParaBaixo} medidas`);
conferir(menorY > -0.03, 'e nada entra no chão durante a volta', menorY.toFixed(3));
conferir(fotoDaEstrelinha, 'e a foto pegou ela de cabeça para baixo');
conferir(estrelinha.some((f) => /Estrella: Ouviram\? É o sinal/.test(f)) && (await page.evaluate(() => window.jogo.flag('aula-chamada'))),
  'depois da estrelinha, a chamada da aula 3');

// ================================== 4b. as aulas 4, 5 e 6: qualquer uma chama
console.log('\n4b. as aulas 4, 5 e 6: qualquer uma das três chama');
const PERTO = { luna: [0.9, 0.9, -2.4], sol: [0.9, 0.9, -2.4], estrella: [1.0, 0.5, -2.2] };
for (const [concluidas, quem, marca] of [[3, 'sol', /gênero das palavras/], [4, 'estrella', /verbo ficar/], [5, 'luna', /última aula do módulo/]]) {
  await salvar(['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'jean-luc-batido'], concluidas);
  await ir('escola-ginasio', '1.6,4');
  await semAcrobacias();
  const aqui = await irmas();
  conferir(['luna', 'sol', 'estrella'].every((id) => aqui[id]?.visivel), `aula ${concluidas + 1}: as três no ginásio`);
  const [dx, dz, olhar] = PERTO[quem];
  await page.evaluate(([P, dx, dz, olhar]) => window.jogo.debugPlace(P.x + dx, P.z + dz, olhar), [aqui[quem], dx, dz, olhar]);
  const nome = quem === 'luna' ? 'Luna' : quem === 'sol' ? 'Sol' : 'Estrella';
  conferir(new RegExp(nome).test((await esperarPrompt(new RegExp(nome))) ?? ''), `aula ${concluidas + 1}: o prompt é o da ${nome}`);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
  const falas = await conversar(40);
  console.log('      ' + falas.join('\n      '));
  conferir(falas.some((f) => marca.test(f)) && (await page.evaluate(() => window.jogo.flag('aula-chamada'))),
    `aula ${concluidas + 1}: falar com a ${nome} chama a aula`, falas.at(-1) ?? '');
  if (concluidas === 3) {
    const foram = await (async () => {
      for (let i = 0; i < 120; i++) {
        const r = await irmas();
        if (['luna', 'sol', 'estrella'].every((id) => !r[id]?.visivel)) return true;
        await page.waitForTimeout(500);
      }
      return false;
    })();
    conferir(foram, 'e as três vão juntas para a aula pela porta');
  }
}

// ================================================================= 5. a aula
console.log('\n5. a Sala 1 na aula');
await ir('escola-sala-1');
const naSala = await irmas();
conferir(['luna', 'sol', 'estrella'].every((id) => naSala[id]?.visivel && naSala[id].estado === 'sentado' && Math.abs(naSala[id].y - 0.47) < 0.02),
  'as três sentadas nas carteiras', JSON.stringify(naSala));
await page.evaluate(() => window.jogo.debugPlace(1.8, 1.2, -2.6));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}-sala-com-as-tres.png` });

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
await browser.close();
process.exit(falhas.length ? 1 : 0);
