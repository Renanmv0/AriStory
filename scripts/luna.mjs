/**
 * A Luna, a coelhinha cheerleader dos Gatitos, e a porta da Escola do Gatito.
 *
 * O que este teste guarda:
 * - ANTES do quadro de inscrições encher, ela não existe: nada de piquenique,
 *   as florzinhas do sorteio continuam no lugar, nenhum colisor invisível e o
 *   ônibus do parque vai direto para o clube, como sempre foi;
 * - quando o quadro enche (`jean-luc-batido`), ela aparece sentada na toalha,
 *   as florzinhas debaixo dela somem, e nenhuma outra peça da cena (árvore,
 *   poste) fica em cima do piquenique;
 * - o corpo, MEDIDO: nada afunda no chão em pose nenhuma, torcendo os dois
 *   pompons sobem acima da cabeça, tímida as patas vêm para perto do rosto e
 *   as orelhas caem para trás;
 * - a conversa inteira: ela se apresenta, torce e fica tímida no meio, fala
 *   das aulas de português do Gatito, e no fim a escola abre (flag, aviso,
 *   memória no diário) e ela volta a sentar;
 * - a segunda conversa já é outra fala;
 * - o ônibus do parque pergunta o destino e leva à escola;
 * - na primeira chegada, a Luna dá o resumo da escola (cada lugar tem que
 *   aparecer no texto), diz para procurá-la no ginásio e vai andando para lá;
 *   a dupla fica fora da frente dela e sai livre; voltando, o tour não repete;
 * - a saída da escola leva ao clube, e o ônibus do clube também oferece a
 *   escola; de volta ao parque, o piquenique foi recolhido;
 * - no ginásio ela treina (os pompons sobem e descem de verdade), para de
 *   treinar para conversar e volta ao treino no fim.
 *
 * Uso: node scripts/luna.mjs /tmp/lu
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './luna';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** tem que bater com `scenes/villaLobos.ts` */
const PIQUENIQUE = { x: -24, z: -27.6 };
const LUNA = { x: -24.35, z: -27.9 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const contexto = await browser.newContext({ viewport: { width: 1000, height: 780 } });
const page = await contexto.newPage();
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  const t = m.text();
  const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
  if (m.type() === 'error' && !ruido.some((r) => t.includes(r))) erros.push(t);
});

const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};

/** o estado do piquenique, lido do mundo */
const estado = () =>
  page.evaluate(([P, R]) => {
    const w = window.jogo.current.world;
    let luna = null;
    let piquenique = null;
    w.root.traverse((o) => {
      if (o.userData?.peca === 'luna') luna = o;
      if (o.name === 'piquenique-da-luna') piquenique = o;
    });
    // os canteiros de florzinha (a peça `flowers`: metade das malhas são as
    // cabecinhas de raio 0,09) em volta do lugar do piquenique
    const soltos = w.root.children.filter((o) => {
      const d = Math.hypot(o.position.x - P.x, o.position.z - P.z);
      const flores = o.children.filter((m) => m.geometry?.parameters?.radius === 0.09).length;
      return d < R && flores > 0 && flores * 2 === o.children.length;
    });
    const prompt = w.interactables.find((i) => i.id === 'parque:luna');
    const onibus = w.interactables.find((i) => i.id === 'door:clube:portaria');
    const colisoresNela = w.colliders.filter((c) => c.kind === 'circle' && Math.hypot(c.x - P.x, c.z - P.z) < 2).length;
    return {
      luna: luna?.visible ?? null,
      piquenique: piquenique?.visible ?? null,
      soltosVisiveis: soltos.filter((o) => o.visible).length,
      soltos: soltos.length,
      prompt: prompt ? { ativo: prompt.enabled, label: prompt.label } : null,
      onibus: onibus?.label ?? null,
      colisoresNela,
    };
  }, [PIQUENIQUE, 3.4]);

/** o corpo dela, medido no mundo */
const corpo = () =>
  page.evaluate(() => {
    let g = null;
    window.jogo.current.world.root.traverse((o) => {
      if (o.userData?.peca === 'luna') g = o;
    });
    const t = g.userData.teste;
    g.updateMatrixWorld(true);
    const caixa = new window.jogo.scene.position.constructor();
    let minY = Infinity;
    let maxY = -Infinity;
    g.traverse((m) => {
      if (!m.isMesh || !m.visible) return;
      const pos = m.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 3) {
        caixa.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
        minY = Math.min(minY, caixa.y);
        maxY = Math.max(maxY, caixa.y);
      }
    });
    let cabeca = null;
    g.traverse((o) => {
      if (o.name === 'cabeca-da-luna') cabeca = o;
    });
    const noMundo = (o) => {
      const v = new window.jogo.scene.position.constructor();
      o.getWorldPosition(v);
      return v;
    };
    const c = noMundo(cabeca);
    const pompons = t.luna.pompons.map(noMundo);
    return {
      minY: +minY.toFixed(3),
      maxY: +maxY.toFixed(3),
      cabecaY: +c.y.toFixed(3),
      pomponsY: pompons.map((p) => +p.y.toFixed(3)),
      pomponsAoRosto: pompons.map((p) => +p.distanceTo(c).toFixed(3)),
      estado: t.luna.estado,
      visivel: g.visible,
      treinando: t.luna.estaTreinando,
      torcendo: t.luna.estaTorcendo,
      timida: t.luna.estaTimida,
    };
  });

const luna = (fn) =>
  page.evaluate((codigo) => {
    let g = null;
    window.jogo.current.world.root.traverse((o) => {
      if (o.userData?.peca === 'luna') g = o;
    });
    new Function('t', codigo)(g.userData.teste);
  }, fn);

/** avança a conversa com E, anotando quem fala e os gestos que ela faz */
const conversar = async (max = 60, alvo = LUNA, foto = 'conversa') => {
  const falas = [];
  const gestos = { torceu: false, ficouTimida: false, tapando: null, parouDeTreinar: false };
  for (let i = 0; i < max; i++) {
    if (!(await page.locator('.dialogue.show').count())) {
      await page.waitForTimeout(500);
      if (!(await page.locator('.dialogue.show').count())) break;
      continue;
    }
    await page.waitForTimeout(650);
    const c = await corpo();
    /*
     * NINGUÉM NA FRENTE DELA: a câmera olha de `+X/+Z`, então quem estiver
     * à frente dela nessa direção (produto escalar positivo) e a menos de
     * 0,6 da linha de visada tapa a coelha.
     */
    if (gestos.tapando === null) {
      gestos.tapando = await page.evaluate(([L]) => {
        const c = Math.SQRT1_2;
        return [window.jogo.playerPosition(), window.jogo.companionPosition()].filter((p) => {
          const dx = p.x - L.x;
          const dz = p.z - L.z;
          const aFrente = dx * c + dz * c;
          const aoLado = Math.abs(dx * c - dz * c);
          return aFrente > 0 && aoLado < 0.6;
        }).length;
      }, [alvo]);
    }
    gestos.parouDeTreinar ||= !c.treinando;
    // a primeira torcida e a primeira vergonha da conversa ficam em foto
    if (c.torcendo && !gestos.torceu) await page.screenshot({ path: `${OUT}-${foto}-torcendo.png` });
    if (c.timida && !gestos.ficouTimida) await page.screenshot({ path: `${OUT}-${foto}-timida.png` });
    gestos.torceu ||= c.torcendo;
    gestos.ficouTimida ||= c.timida;
    const quem = await page.locator('.dialogue .who').textContent().catch(() => '');
    const t = await page.locator('.dialogue .text').textContent().catch(() => '');
    if (t && !falas.includes(`${quem}: ${t}`)) falas.push(`${quem}: ${t}`);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(250);
  }
  return { falas, gestos };
};

const escolher = async (texto) => {
  for (let i = 0; i < 20 && !(await page.locator('.escolhas.show button').count()); i++) await page.waitForTimeout(250);
  const opcoes = await page.locator('.escolhas.show button').allTextContents();
  const i = opcoes.findIndex((o) => o.includes(texto));
  if (i >= 0) await page.locator('.escolhas.show button').nth(i).click();
  return opcoes;
};

const cenaAgora = async () => {
  for (let i = 0; i < 24; i++) {
    await page.waitForTimeout(250);
    const id = await page.evaluate(() => (window.jogo.transitioning ? null : window.jogo.current?.def?.id));
    if (id) return id;
  }
  return null;
};

// ---------------------------------------------------- antes do quadro encher
await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=villa-lobos&em=-21.2,-24.8&olhar=3.9`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const antes = await estado();
conferir(antes.luna === false && antes.piquenique === false, 'antes do quadro: sem Luna e sem piquenique', JSON.stringify(antes));
conferir(antes.soltos >= 4 && antes.soltosVisiveis === antes.soltos, 'antes do quadro: os canteiros de florzinha continuam no lugar', `${antes.soltosVisiveis}/${antes.soltos}`);
conferir(antes.prompt && !antes.prompt.ativo, 'antes do quadro: sem conversa com ela');
conferir(antes.colisoresNela === 0, 'antes do quadro: nenhum colisor invisível no gramado');
conferir(antes.onibus === 'Pegar o ônibus pro clube', 'antes do quadro: o ônibus é o de sempre', antes.onibus);
await page.screenshot({ path: `${OUT}-antes.png` });

// --------------------------------------------------------- o quadro enche
await page.evaluate(() => window.jogo.setFlag('jean-luc-batido'));
await page.waitForTimeout(900);
const depois = await estado();
conferir(depois.luna === true && depois.piquenique === true, 'o quadro encheu: a Luna aparece fazendo piquenique');
conferir(depois.soltosVisiveis === 0, 'os canteiros de florzinha somem', `${depois.soltosVisiveis} visíveis`);
conferir(depois.prompt?.ativo && depois.prompt.label === 'Falar com a coelhinha', 'o prompt aparece, e ela ainda é "a coelhinha"', depois.prompt?.label);
conferir(depois.colisoresNela === 3, 'os colisores dela, da cesta e da flâmula entram', String(depois.colisoresNela));
const intrusos = await page.evaluate(([P]) => {
  const w = window.jogo.current.world;
  return w.root.children
    .filter((o) => o.visible && o.name !== 'piquenique-da-luna' && o.userData?.peca !== 'luna')
    .filter((o) => Math.hypot(o.position.x - P.x, o.position.z - P.z) < 1.6)
    .map((o) => `${o.userData?.peca ?? o.type}@${o.position.x.toFixed(1)},${o.position.z.toFixed(1)}`);
}, [PIQUENIQUE]);
conferir(intrusos.length === 0, 'nenhuma outra peça em cima da toalha', intrusos.join(' '));

// a mesma vista da foto do Renan: celular em pé, do lado da cúpula
await page.setViewportSize({ width: 460, height: 900 });
await page.evaluate(() => window.jogo.debugPlace(-15, -15, 2.4));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-como-na-foto.png` });
await page.setViewportSize({ width: 1000, height: 780 });

// ------------------------------------------------------- o corpo, de perto
await page.evaluate(() => {
  let g = null;
  window.jogo.current.world.root.traverse((o) => {
    if (o.userData?.peca === 'luna') g = o;
  });
  // a dupla sai da zona da roda gigante, senão ela manda no zoom
  window.jogo.debugPlace(-40, 8, 0);
  window.jogo.focusCamera(g);
  window.jogo.setZoom(3);
});
// o zoom chega por interpolação, quadro a quadro, e o parque sem placa de
// vídeo roda a poucos quadros por segundo: espera a câmera chegar de fato
for (let i = 0; i < 60 && (await page.evaluate(() => window.jogo.iso.currentViewSize)) > 3.3; i++) {
  await page.waitForTimeout(250);
}
await page.waitForTimeout(600);
const sentada = await corpo();
await page.screenshot({ path: `${OUT}-sentada.png` });
conferir(sentada.estado === 'sentado' && sentada.minY > -0.01, 'sentada na toalha, sem afundar', `menor y ${sentada.minY}`);

await luna('t.luna.levantar()');
await page.waitForTimeout(1300);
const empe = await corpo();
await page.screenshot({ path: `${OUT}-em-pe.png` });
conferir(empe.minY > -0.01 && empe.minY < 0.06, 'em pé, com os pés no chão', `menor y ${empe.minY}`);
conferir(empe.maxY > 1.1 && empe.maxY < 1.45, 'a ponta das orelhas no peito da dupla', `${empe.maxY}`);

await luna('t.luna.torcer(8)');
await page.waitForTimeout(1600);
await page.screenshot({ path: `${OUT}-torcendo.png` });
// a torcida reveza os braços: mede a MÉDIA de um segundo, e não um quadro solto
const quadros = [];
for (let i = 0; i < 6; i++) {
  quadros.push(await corpo());
  await page.waitForTimeout(180);
}
const media = (f) => quadros.reduce((a, q) => a + f(q), 0) / quadros.length;
const pomponsNoAlto = [0, 1].map((i) => +media((q) => q.pomponsY[i] - q.cabecaY).toFixed(3));
conferir(pomponsNoAlto.every((d) => d > 0), 'torcendo, os dois pompons ficam acima da cabeça', `em média ${pomponsNoAlto} acima do centro dela`);
conferir(Math.min(...quadros.map((q) => q.minY)) > -0.01, 'torcendo, nada afunda no chão');

await luna('t.luna.ficarTimida(6)');
await page.waitForTimeout(1600);
const timida = await corpo();
await page.screenshot({ path: `${OUT}-timida.png` });
conferir(timida.pomponsAoRosto.every((d) => d < 0.38), 'tímida, as patas vêm para perto do rosto', `${timida.pomponsAoRosto}`);
conferir(timida.minY > -0.01, 'tímida, nada afunda no chão', `${timida.minY}`);

await luna('t.sentar()');
await page.evaluate(() => {
  window.jogo.focusCamera(null);
  window.jogo.setZoom(11);
});

// ------------------------------------------------------------ a conversa
await page.evaluate(([L]) => window.jogo.debugPlace(L.x + 1.1, L.z + 1.1, -2.36), [LUNA]);
await page.waitForTimeout(1200);
const prompt = await page.locator('.prompt.show .label').textContent().catch(() => null);
conferir(prompt === 'Falar com a coelhinha', 'na frente dela, o prompt é o dela', prompt ?? '(nenhum)');
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const primeira = await conversar();
console.log('      ' + primeira.falas.join('\n      '));
const inteira = primeira.falas.join(' ');
conferir(inteira.includes('Eu sou a Luna'), 'ela se apresenta');
conferir(inteira.includes('aula de português') && inteira.includes('Gatito'), 'ela conta das aulas de português do Gatito');
conferir(primeira.gestos.torceu && primeira.gestos.ficouTimida, 'ela torce e fica tímida no meio da conversa', JSON.stringify(primeira.gestos));
conferir(primeira.gestos.tapando === 0, 'na conversa, nenhum dos dois fica entre ela e a câmera', `${primeira.gestos.tapando} tapando`);
const fim = await page.evaluate(() => {
  const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  return {
    aberta: window.jogo.flag('escola-aberta'),
    memoria: (save.memories ?? []).some((m) => m.id === 'luna-piquenique'),
    label: window.jogo.current.world.interactables.find((i) => i.id === 'parque:luna')?.label,
  };
});
const avisos = await page.locator('.toast').allTextContents();
conferir(fim.aberta, 'no fim a escola abre (escola-aberta)');
conferir(fim.memoria, 'a memória do piquenique entra no diário');
conferir(avisos.some((a) => a.includes('Escola do Gatito')), 'o aviso da parada nova aparece', avisos.join(' | '));
conferir(fim.label === 'Falar com a Luna', 'depois de apresentada, ela é "a Luna"', fim.label);
await page.waitForTimeout(800);
conferir((await corpo()).estado === 'sentado', 'e ela volta a sentar');

await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const segunda = await conversar(8);
conferir(segunda.falas.length > 0 && !segunda.falas.some((f) => f.includes('Eu sou a Luna')), 'a segunda conversa é outra', segunda.falas[0] ?? '');

// ------------------------------------------------------- o ônibus do parque
await page.evaluate(() => window.jogo.debugPlace(37.6, 13.2, 1.6));
await page.waitForTimeout(1200);
const rotulo = await page.locator('.prompt.show .label').textContent().catch(() => null);
conferir(rotulo === 'Pegar o ônibus', 'o ônibus do parque agora pergunta', rotulo ?? '(nenhum)');
await page.keyboard.press('KeyE');
const opcoesParque = await escolher('Escola do Gatito');
conferir(opcoesParque.includes('Clube') && opcoesParque.includes('Escola do Gatito'), 'no parque: clube ou escola', opcoesParque.join(' / '));
const naEscola = await cenaAgora();
conferir(naEscola === 'escola', 'o ônibus deixa na escola', naEscola ?? '');

// ------------------------------------------------- a Luna mostra a escola
/** tem que bater com `scenes/escola.ts` */
const LUNA_NA_ENTRADA = { x: 11.45, z: 6.05 };
for (let i = 0; i < 40 && !(await page.locator('.dialogue.show').count()); i++) await page.waitForTimeout(250);
const tour = await conversar(60, LUNA_NA_ENTRADA, 'tour');
console.log('      ' + tour.falas.join('\n      '));
const noTour = tour.falas.join(' ');
const lugares = ['saguão', 'troféus', 'segundo andar', 'Sala 1', 'Sala 2', 'sala de descanso', 'sala dos professores', 'refeitório', 'ginásio'];
const faltando = lugares.filter((l) => !noTour.includes(l));
conferir(faltando.length === 0, 'na chegada, a Luna dá o resumo da escola', faltando.length ? `faltou: ${faltando.join(', ')}` : `${lugares.length} lugares`);
conferir(noTour.includes('ginásio treinando'), 'e diz para procurar por ela no ginásio');
conferir(tour.gestos.torceu && tour.gestos.ficouTimida, 'no tour ela torce e fica tímida', JSON.stringify(tour.gestos));
conferir(tour.gestos.tapando === 0, 'no tour, nenhum dos dois fica entre ela e a câmera', `${tour.gestos.tapando} tapando`);
let foiProGinasio = false;
for (let i = 0; i < 160 && !foiProGinasio; i++) {
  await page.waitForTimeout(250);
  foiProGinasio = !(await corpo()).visivel;
}
const depoisDoTour = await page.evaluate(() => ({
  flag: window.jogo.flag('luna-na-escola'),
  travado: window.jogo.player.locked,
}));
conferir(depoisDoTour.flag && foiProGinasio, 'depois do tour ela vai para o ginásio (e sai do saguão)');
conferir(!depoisDoTour.travado, 'e a dupla fica livre');
await page.screenshot({ path: `${OUT}-chegando-na-escola.png` });

// ------------------------------------------- da escola ao clube, e de volta
const porta = await page.evaluate(() => {
  const i = window.jogo.current.world.interactables.find((p) => p.id === 'door:villa-lobos:clube');
  return { x: i.x, z: i.z };
});
await page.evaluate(([p]) => window.jogo.debugPlace(p.x, p.z + 0.3, Math.PI), [porta]);
await page.waitForTimeout(1000);
await page.keyboard.press('KeyE');
const opcoesEscola = await escolher('Clube');
conferir(opcoesEscola.includes('Parque') && opcoesEscola.includes('Clube'), 'na escola: parque ou clube', opcoesEscola.join(' / '));
conferir((await cenaAgora()) === 'clube', 'da escola se chega ao clube');
await page.waitForTimeout(1500);
const embarque = await page.evaluate(() => {
  const i = window.jogo.current.world.interactables.find((p) => p.id === 'door:villa-lobos:clube');
  return { x: i.x, z: i.z };
});
await page.evaluate(([p]) => window.jogo.debugPlace(p.x + 0.3, p.z, 4.7), [embarque]);
await page.waitForTimeout(1000);
await page.keyboard.press('KeyE');
const opcoesClube = await escolher('Parque');
conferir(opcoesClube.includes('Escola do Gatito') && opcoesClube.includes('Parque'), 'no clube: parque ou escola', opcoesClube.join(' / '));
conferir((await cenaAgora()) === 'villa-lobos', 'e o clube leva de volta ao parque');
await page.waitForTimeout(1500);
const parqueDepois = await estado();
conferir(parqueDepois.luna === false && parqueDepois.piquenique === false, 'de volta ao parque, o piquenique foi recolhido');
conferir(parqueDepois.soltosVisiveis === parqueDepois.soltos && parqueDepois.colisoresNela === 0, 'as florzinhas voltam e não sobra colisor', `${parqueDepois.soltosVisiveis}/${parqueDepois.soltos}`);

// ------------------------------------------ a escola de novo: sem tour
await page.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const tourDeNovo = await page.locator('.dialogue.show').count();
conferir(tourDeNovo === 0 && !(await corpo()).visivel, 'voltando à escola, o tour não se repete e ela não está no saguão');

// ------------------------------------------------------ o ginásio: o treino
await page.goto(`${BASE}/?cena=escola-ginasio`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const treino = [];
for (let i = 0; i < 10; i++) {
  treino.push(await corpo());
  await page.waitForTimeout(600);
}
const alturas = treino.flatMap((q) => q.pomponsY);
const amplitude = Math.max(...alturas) - Math.min(...alturas);
conferir(treino.every((q) => q.visivel && q.treinando), 'no ginásio a Luna está treinando');
conferir(amplitude > 0.2, 'e a coreografia mexe os pompons de verdade', `sobem e descem ${amplitude.toFixed(2)}`);
conferir(Math.min(...treino.map((q) => q.minY)) > -0.01, 'treinando, nada afunda no chão');
await page.evaluate(() => {
  let g = null;
  window.jogo.current.world.root.traverse((o) => {
    if (o.userData?.peca === 'luna') g = o;
  });
  window.jogo.focusCamera(g);
  window.jogo.setZoom(4);
});
for (let i = 0; i < 40 && (await page.evaluate(() => window.jogo.iso.currentViewSize)) > 4.3; i++) {
  await page.waitForTimeout(250);
}
for (let i = 0; i < 3; i++) {
  await page.screenshot({ path: `${OUT}-treino-${i + 1}.png` });
  await page.waitForTimeout(1300);
}
await page.evaluate(() => {
  window.jogo.focusCamera(null);
  window.jogo.setZoom(13);
});

/** tem que bater com `scenes/escolaGinasio.ts` */
const TREINO = { x: 0, z: 2.4 };
await page.evaluate(([T]) => window.jogo.debugPlace(T.x + 1.2, T.z + 0.6, -2.0), [TREINO]);
await page.waitForTimeout(1200);
const promptGin = await page.locator('.prompt.show .label').textContent().catch(() => null);
conferir(promptGin === 'Falar com a Luna', 'no ginásio dá para falar com ela', promptGin ?? '(nenhum)');
await page.keyboard.press('KeyE');
await page.waitForTimeout(500);
const noGinasio = await conversar(12, TREINO, 'ginasio');
console.log('      ' + noGinasio.falas.join('\n      '));
conferir(noGinasio.falas.some((f) => f.includes('Vieram me ver treinar')), 'a primeira conversa no ginásio', noGinasio.falas[0] ?? '');
conferir(noGinasio.gestos.parouDeTreinar, 'para conversar, ela para de treinar');
conferir(noGinasio.gestos.tapando === 0, 'no ginásio, nenhum dos dois fica entre ela e a câmera', `${noGinasio.gestos.tapando} tapando`);
await page.waitForTimeout(1000);
const voltou = await corpo();
conferir(voltou.treinando && !(await page.evaluate(() => window.jogo.player.locked)), 'no fim ela volta a treinar e a dupla fica livre');

// ------------------------------------ e sem a Luna, o ônibus é o de sempre
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));
await page.goto(`${BASE}/?cena=villa-lobos&em=37.6,13.2&olhar=1.6`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
await page.keyboard.press('KeyE');
await page.waitForTimeout(700);
const perguntou = await page.locator('.escolhas.show button').count();
conferir(perguntou === 0 && (await cenaAgora()) === 'clube', 'save novo: o ônibus vai direto ao clube, sem perguntar');

console.log(erros.length ? 'ERROS:\n' + erros.slice(0, 10).join('\n') : 'sem erros de console');
console.log(falhas.length ? `\n${falhas.length} FALHA(S)` : '\ntudo certo');
await browser.close();
process.exit(falhas.length || erros.length ? 1 : 0);
