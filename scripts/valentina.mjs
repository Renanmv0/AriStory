/**
 * A VALENTINA, a flamingo italiana do marketing dos Gatitos, no saguão da
 * escola (pedido do Renan). Mede, e não só fotografa:
 *
 * 1. O MODELO (`SO=modelo`): os pés no chão, a altura (a cabeça abaixo da do
 *    Ari), cada peça do look no pai certo (o blazer, a saia, o lenço que
 *    balança, os óculos na cabeça, a bolsinha na asa, o scarpin no pé) e o pé
 *    pelado escondido pelo sapato; NUM PÉ SÓ parada (a perna recolhida, o pé
 *    que ficou no chão); os três gestos (posar, examinar, encantar) e o
 *    olho; e as fotos de perto de todos os lados, do rosto e de cada gesto;
 * 2. O LOOK (`SO=look`): trocar de look em jogo — a vaga sem peça fica vazia,
 *    o pé pelado aparece descalça, a peça velha sai (nunca duas) e volta;
 * 3. O PASSEIO (`SO=passeio`): o desfile no canto da entrada, sem sair da
 *    área nem entrar no banner; o ponto de conversa e o colisor em cima dela;
 * 4. A CONVERSA (`SO=conversa`): a apresentação, a flag, a memória, e o
 *    JUÍZO DA ROUPA de verdade — sem nada, com o uniforme dos Gatitos nos
 *    dois, e com uma peça pelo nome —, sempre fechando num elogio;
 * 5. A TRAVA E A AULA (`SO=aula`): com o Módulo 2 feito e sem conhecer a
 *    Valentina, a coelhinha manda ir ao saguão e a aula não é chamada; depois
 *    de conhecer, a aula chama, e na Sala 1 ela está sentada na carteira
 *    atrás do Renan (o corpo no assento, os pés fora do chão), e o saguão
 *    fica sem ela.
 *
 *   node scripts/valentina.mjs /tmp/va      (SO=modelo,look… roda uma parte)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/va';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const erros = [];
const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};
const FLAGS = ['escola-aberta', 'luna-na-escola', 'gatito-conhecido', 'escola-visitada', 'festa-da-torcida', 'jean-luc-batido'];
const M1 = ['oi-tudo-bem', 'jantar-das-confusoes', 'cade-o-novelo', 'horta-da-josefina', 'fica-a-dica', 'tudo-acaba-em-inho'];
const M2 = ['um-dia-de-gatito', 'bola-pra-frente', 'ai-que-dor', 'partiu-praia', 'cartao-postal-do-rio', 'quanto-custa'];
const POSTO = { minX: 21.3, maxX: 23.0, minZ: 5.0, maxZ: 6.3, banner: { x: 21.9, z: 4.15 } };

const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });

/** uma página com um save de teste (as flags e, se pedir, as lições feitas) */
const abrir = async (cena, { licoes = [], flags = [], em = '' } = {}) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => {
    if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text());
  });
  const pronto = () => p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
  await pronto();
  await p.evaluate(([flags, licoes]) => {
    const j = window.jogo;
    for (const f of flags) j.setFlag(f);
    for (const id of licoes) {
      j.save.abrirLicao(id);
      j.save.concluirLicao(id, 3);
    }
  }, [[...FLAGS, ...flags], licoes]);
  await p.goto(`${BASE}/?cena=${cena}${em ? `&em=${em}` : ''}`, { waitUntil: 'networkidle' });
  await pronto();
  await p.mouse.click(550, 300);
  await p.waitForTimeout(1000);
  return p;
};

/** a Valentina da cena (o gancho de teste) */
const achar = `(() => { let v = null; window.jogo.current.world.root.traverse((o) => { if (!v && o.userData?.teste?.valentina) v = o.userData.teste.valentina; }); return v; })()`;
const ela = (p) => p.evaluate((achar) => {
  const v = eval(achar);
  if (!v) return null;
  const j = window.jogo;
  const pt = j.current.world.interactables?.find?.((i) => i.id === 'escola:valentina');
  const col = j.current.world.colliders?.find?.((c) => c.kind === 'circle' && Math.abs(c.r - 0.34) < 1e-6);
  return { x: v.x, z: v.z, ponto: pt ? { x: pt.x, z: pt.z } : null, colisor: col ? { x: col.x, z: col.z } : null };
}, achar);
const parar = (p, x, z, rot) => p.evaluate(([achar, x, z, rot]) => {
  const v = eval(achar);
  v.entrarEmServico();
  v.group.position.set(x, 0, z);
  v.group.rotation.y = rot;
}, [achar, x, z, rot]);

/** as medidas do corpo: o mais baixo, o mais alto, a cabeça, e os nomes de tudo */
const medir = (p) => p.evaluate((achar) => {
  const j = window.jogo;
  const v = eval(achar);
  const g = v.group;
  g.updateWorldMatrix(true, true);
  const V = g.position.constructor;
  const t = new V();
  let min = Infinity;
  let max = -Infinity;
  const nomes = {};
  const caminho = (o) => { const c = []; for (let q = o; q && q !== g; q = q.parent) if (q.name) c.push(q.name); return c; };
  g.traverse((o) => {
    if (o.name) nomes[o.name] = caminho(o.parent);
    const pos = o.geometry?.attributes?.position;
    let visivel = true;
    for (let q = o; q; q = q.parent) if (!q.visible) visivel = false;
    if (!pos || !visivel) return;
    for (let i = 0; i < pos.count; i += 2) {
      t.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      min = Math.min(min, t.y);
      max = Math.max(max, t.y);
    }
  });
  let cabeca = 0;
  g.traverse((o) => { if (o.name === 'cabeca-da-valentina') cabeca = o.getWorldPosition(new V()).y; });
  const pes = {};
  g.traverse((o) => { if (o.name?.startsWith('pe-pelado')) pes[o.name] = o.visible; });
  return { min, max, cabeca, ari: j.player.rig.head.getWorldPosition(new V()).y, nomes, pes, umPe: v.numPeSo, olho: v.aberturaDoOlho, chao: g.position.y };
}, achar);

/** a foto de perto: a câmera num ponto dela, e a foto recortada em volta */
const dePerto = async (p, altura, nome, w = 320, h = 400) => {
  await p.evaluate(([achar, altura]) => {
    const j = window.jogo;
    const v = eval(achar);
    const foco = new v.group.constructor();
    v.group.getWorldPosition(foco.position);
    foco.position.y += altura;
    j.current.world.root.add(foco);
    j.focusCamera(foco);
    j.setZoom(0.6);
    window.__foco = foco;
  }, [achar, altura]);
  await p.waitForTimeout(2600);
  const c = await p.evaluate(() => {
    const v = window.__foco.position.clone().project(window.jogo.iso.camera);
    return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight };
  });
  await p.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: Math.max(0, c.x - w / 2), y: Math.max(0, c.y - h / 2), width: w, height: h } });
  await p.evaluate(() => { window.jogo.focusCamera(null); window.__foco.removeFromParent(); });
};

/** passa as falas com E, anotando "quem: texto", até `ate` acontecer */
const conversar = async (p, ate, max = 50) => {
  const falas = [];
  for (let i = 0; i < max && !(await ate()); i++) {
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(400);
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
const chegarPerto = async (p, rotulo = /Valentina/) => {
  const f = await ela(p);
  await p.evaluate(({ x, z }) => window.jogo.debugPlace(x + 0.7, z + 0.7, Math.atan2(-0.7, -0.7)), f);
  for (let i = 0; i < 20; i++) {
    if (rotulo.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) return true;
    await p.waitForTimeout(150);
  }
  return false;
};
const X0 = 22.2;
const Z0 = 5.7;

// ============================================================ 1. o modelo
if (parte('modelo')) {
  console.log('\n1. o modelo');
  const p = await abrir('escola', { em: '16,2' });
  await parar(p, X0, Z0, Math.PI / 4);
  await p.waitForTimeout(600);
  const m = await medir(p);
  console.log(`      piso ${m.min.toFixed(3)} · topo ${m.max.toFixed(2)} · cabeça ${m.cabeca.toFixed(2)} · cabeça do Ari ${m.ari.toFixed(2)}`);
  conferir(m.min > -0.02 && m.min < 0.03, `os pés no chão (${m.min.toFixed(3)})`);
  // o alto da cabeça dela fica abaixo do alto da do Ari (1,72), mas ela é alta: pernas e pescoço de flamingo
  conferir(m.max < 1.85 && m.max > 1.5, `mais baixa que a dupla, mas alta (o topo a ${m.max.toFixed(2)})`);
  const em = (peca, pai) => (m.nomes[peca] ?? []).includes(pai);
  conferir(em('roupa:tronco', 'ovo-da-valentina') && em('roupa:saia', 'ovo-da-valentina'), 'o blazer e o tutu vestindo o ovo do corpo');
  conferir(em('balanca:pontas-do-lenco', 'base-do-pescoco'), 'o lenço na base do pescoço, com as pontas que balançam');
  conferir(em('oculos-na-cabeca', 'cranio-da-valentina'), 'os óculos no alto do crânio');
  conferir(em('balanca:bolsinha', 'asa-esquerda'), 'a bolsinha pendurada na asa esquerda');
  conferir(em('roupa:asa', 'asa-direita') && em('roupa:pe', 'joelho-direito'), 'o punho do blazer na asa e o scarpin no pé');
  conferir(Object.values(m.pes).every((v) => v === false), 'o pé pelado escondido pelo sapato', JSON.stringify(m.pes));

  await p.evaluate(() => window.jogo.debugPlace(16, 2, 0));
  await p.waitForTimeout(500);
  for (const [rot, nome] of [[Math.PI / 4, 'frente'], [0, 'tres-quartos'], [-Math.PI / 4, 'lado'], [-3 * Math.PI / 4, 'costas'], [Math.PI, 'costas-2'], [Math.PI / 2, 'outro-lado']]) {
    await parar(p, X0, Z0, rot);
    await dePerto(p, 0.85, nome, 380, 480);
  }
  await parar(p, X0, Z0, Math.PI / 4);
  await dePerto(p, 1.6, 'rosto', 280, 250);
  await parar(p, X0, Z0, 0);
  await dePerto(p, 1.6, 'rosto-lado', 280, 250);

  // num pé só: parada, ela recolhe a perna direita
  await parar(p, X0, Z0, Math.PI / 4);
  let maior = 0;
  for (let i = 0; i < 16; i++) {
    await p.waitForTimeout(400);
    maior = Math.max(maior, (await medir(p)).umPe);
  }
  const m1 = await medir(p);
  conferir(maior > 0.9, `parada, ela fica num pé só (${maior.toFixed(2)})`);
  conferir(m1.min > -0.02 && m1.min < 0.03, `e o pé que ficou continua no chão (${m1.min.toFixed(3)})`);
  await dePerto(p, 0.85, 'num-pe-so', 380, 480);

  // os gestos
  // um gesto por vez: o anterior é cancelado (o relógio do jogo no teste anda a ~1/4 e eles se sobrepunham)
  const gesto = (nome) => p.evaluate(([achar, nome]) => {
    const v = eval(achar);
    v.posando = 0;
    v.examinando = 0;
    v.encantada = 0;
    v[nome](8);
  }, [achar, nome]);
  for (const [nome, pergunta, foto] of [['posar', 'estaPosando', 'posando'], ['examinar', 'estaExaminando', 'examinando'], ['encantar', 'estaEncantada', 'encantada']]) {
    await gesto(nome);
    // o navegador do teste roda o jogo a ~1/5 da velocidade: a mistura do gesto leva uns segundos
    await p.waitForTimeout(2600);
    const ok = await p.evaluate(([achar, q]) => eval(achar)[q], [achar, pergunta]);
    const mm = await medir(p);
    // posar é a pose de flamingo: num pé só; examinar e encantar, nos dois
    conferir(ok && (nome === 'posar' ? mm.umPe > 0.6 : mm.umPe < 0.5), `${nome}: o gesto liga${nome === 'posar' ? ', num pé só' : ' e ela volta aos dois pés'}`);
    // a cabeça desce devagar (e o jogo no teste anda a ~1/4): espera o pescoço chegar
    let cab = await p.evaluate((achar) => eval(achar).alturaDaCabeca, achar);
    for (let i = 0; nome === 'examinar' && i < 20 && cab > m.cabeca - 0.06; i++) {
      await p.waitForTimeout(400);
      cab = Math.min(cab, await p.evaluate((achar) => eval(achar).alturaDaCabeca, achar));
    }
    if (nome === 'examinar') conferir(cab < m.cabeca - 0.05, `examinando, o pescoço desce (a cabeça de ${m.cabeca.toFixed(2)} para ${cab.toFixed(2)})`);
    if (nome === 'examinar') conferir(mm.olho < 0.7, `examinando, o olho aperta (${mm.olho.toFixed(2)})`);
    if (nome === 'encantar') conferir(mm.olho < 0.4, `encantada, o olho fecha de contente (${mm.olho.toFixed(2)})`);
    await dePerto(p, 0.85, foto, 380, 480);
    await p.waitForTimeout(6000);
  }
  await p.close();
}

// ======================================================== só o rosto (ajuste rápido)
if (SO === 'rosto') {
  const p = await abrir('escola', { em: '16,2' });
  for (const [rot, nome] of [[Math.PI / 4, 'rosto'], [0, 'rosto-lado'], [Math.PI / 2, 'rosto-outro-lado']]) {
    await parar(p, X0, Z0, rot);
    await dePerto(p, 1.6, nome, 280, 250);
  }
  for (const [rot, nome] of [[Math.PI / 4, 'frente'], [0, 'tres-quartos'], [-Math.PI / 4, 'lado'], [-3 * Math.PI / 4, 'costas']]) {
    await parar(p, X0, Z0, rot);
    await dePerto(p, 0.85, nome, 380, 480);
  }
  await p.close();
}

// ============================================================ 2. o look
if (parte('look')) {
  console.log('\n2. trocar de look');
  const p = await abrir('escola', { em: '16,2' });
  await parar(p, X0, Z0, Math.PI / 4);
  const r = await p.evaluate((achar) => {
    const v = eval(achar);
    const conta = (nome) => { let n = 0; v.group.traverse((o) => { if (o.name === nome) n += 1; }); return n; };
    const pes = () => { const r = []; v.group.traverse((o) => { if (o.name?.startsWith('pe-pelado')) r.push(o.visible); }); return r; };
    const antes = v.lookAtual;
    v.vestir({ id: 'teste', nome: 'só a saia', saia: antes.saia });
    const so = { tronco: conta('roupa:tronco'), saia: conta('roupa:saia'), pe: conta('roupa:pe'), pes: pes() };
    v.vestir(antes);
    v.vestir(antes);
    const volta = { tronco: conta('roupa:tronco'), saia: conta('roupa:saia'), pe: conta('roupa:pe'), manga: conta('roupa:asa'), pes: pes() };
    return { so, volta };
  }, achar);
  conferir(r.so.tronco === 0 && r.so.saia === 1 && r.so.pe === 0, 'um look só de saia: o resto das vagas vazio', JSON.stringify(r.so));
  conferir(r.so.pes.every(Boolean), 'descalça, o pé de flamingo aparece');
  conferir(r.volta.tronco === 1 && r.volta.saia === 1 && r.volta.pe === 2 && r.volta.manga === 2 && r.volta.pes.every((v) => !v),
    'vestir o look de novo (duas vezes) não duplica peça', JSON.stringify(r.volta));
  await p.close();
}

// ============================================================ 3. o passeio
if (parte('passeio')) {
  console.log('\n3. o desfile no canto da entrada');
  const p = await abrir('escola', { em: '16,2' });
  let antes = await ela(p);
  conferir(!!antes, 'a Valentina está no saguão', JSON.stringify(antes));
  let trilha = 0;
  let fora = 0;
  let longe = 0;
  for (let i = 0; i < 90; i++) {
    await p.waitForTimeout(400);
    const f = await ela(p);
    trilha += Math.hypot(f.x - antes.x, f.z - antes.z);
    antes = f;
    if (f.x < POSTO.minX - 0.05 || f.x > POSTO.maxX + 0.05 || f.z < POSTO.minZ - 0.05 || f.z > POSTO.maxZ + 0.05) fora += 1;
    const dp = f.ponto ? Math.hypot(f.ponto.x - f.x, f.ponto.z - f.z) : 99;
    const dc = f.colisor ? Math.hypot(f.colisor.x - f.x, f.colisor.z - f.z) : 99;
    if (dp > 0.05 || dc > 0.05) longe += 1;
  }
  // ela para e faz pose em cada canto (1,4 a 3,6 s), e o navegador do teste roda o jogo a ~1/4
  conferir(trilha > 0.6, `ela desfila de verdade (${trilha.toFixed(2)} de trilha)`);
  conferir(fora === 0, 'nunca sai do canto dela', String(fora));
  conferir(longe === 0, 'o ponto de conversa e o colisor andam em cima dela', String(longe));
  // ao lado da dupla, para o tamanho
  await parar(p, X0, Z0, Math.PI / 4);
  await p.evaluate(([x, z]) => { window.jogo.debugPlace(x + 1.1, z - 0.4, -Math.PI / 2); window.jogo.setZoom(4.5); }, [X0, Z0]);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}-com-a-dupla.png` });
  await p.evaluate((achar) => eval(achar).voltarAPassear(), achar);
  await p.evaluate(() => { window.jogo.debugPlace(18.5, 2.5, Math.PI / 2); window.jogo.setZoom(9); });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}-saguao.png` });
  await p.evaluate(() => window.jogo.setZoom(5));
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}-banner.png` });
  await p.close();
}

// ============================================================ 4. a conversa
if (parte('conversa')) {
  console.log('\n4. a conversa e o juízo da roupa');
  const p = await abrir('escola', { em: '16,2' });
  // sem nada vestido nos dois
  await p.evaluate(() => {
    const j = window.jogo;
    for (const quem of ['ari', 'renan']) for (let s = 0; s < 6; s++) j.unequipWearable(s, quem);
  });
  conferir(await chegarPerto(p), 'perto dela, o prompt é "Falar com a Valentina"');
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}-conversa.png` });
  const ap = await conversar(p, () => p.evaluate(() => window.jogo.flag('valentina-conhecida')), 60);
  console.log('      ' + ap.join('\n      '));
  conferir(ap.some((f) => /^Valentina: Valentina, muito prazer. Vim de Milão/.test(f)), 'ela se apresenta: de Milão, do marketing');
  conferir(ap.some((f) => /^Valentina: Básico|^Valentina: Sem um acessório/.test(f)), 'sem nada vestido, o juízo do básico');
  const italiano = ap.filter((f) => /\b(Ciao|Allora|Mamma mia|Perfetto|Andiamo|Bellissim|Brav|cara mia)\b/i.test(f)).length;
  conferir(italiano >= 2 && italiano <= 4, `algumas expressões em italiano, não muitas (${italiano} falas)`);
  await p.waitForTimeout(1200);
  const depois = await p.evaluate(() => ({
    flag: window.jogo.flag('valentina-conhecida'),
    memoria: (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).some((m) => m.id === 'a-diva-do-marketing'),
  }));
  conferir(depois.flag && depois.memoria, 'a flag e a memória "A diva do marketing"');

  // os dois de uniforme dos Gatitos
  await p.evaluate(() => {
    const j = window.jogo;
    const I = window.aristoryItens;
    for (const quem of ['ari', 'renan']) j.equipWearable(I['camiseta-dos-gatitos'], quem);
  });
  await p.waitForTimeout(1500);
  conferir(await chegarPerto(p), 'depois da conversa ela volta ao posto, e dá para falar de novo');
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(700);
  const segunda = await conversar(p, async () => false, 20);
  console.log('      ' + segunda.join('\n      '));
  conferir(segunda.some((f) => /de Gatitos|dos Gatitos/.test(f)) && !segunda.some((f) => /Milão/.test(f)), 'com os dois de Gatitos, ela repara no uniforme (sem se apresentar de novo)');
  await p.waitForTimeout(1500);

  // uma peça pelo nome: o boné no Ari, e o Renan sem nada dos Gatitos
  await p.evaluate(() => {
    const j = window.jogo;
    const I = window.aristoryItens;
    for (const quem of ['ari', 'renan']) for (let s = 0; s < 6; s++) j.unequipWearable(s, quem);
    j.equipWearable(I['chapeu-de-palha'] ?? Object.values(I).find((i) => i.tipo === 'vestivel' && i.slot === 'cabeca' && !i.id.includes('gatitos')), 'ari');
  });
  await p.waitForTimeout(500);
  conferir(await chegarPerto(p), 'e de novo');
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(700);
  const terceira = await conversar(p, async () => false, 20);
  console.log('      ' + terceira.join('\n      '));
  conferir(terceira.some((f) => /Ousado/.test(f)) && terceira.some((f) => /funciona|chegam perto|senso de estilo/.test(f)), 'com uma peça, ela diz o nome dela e elogia no fim');
  await p.close();
}

// ============================================================ 5. a trava e a aula
if (parte('aula')) {
  console.log('\n5. a trava do Módulo 3 e a aula com ela');
  const p = await abrir('escola-ginasio', { licoes: [...M1, ...M2], em: '0,2' });
  // falar com uma coelhinha: sem conhecer a Valentina, a aula não é chamada
  const irma = await p.evaluate(() => window.jogo.current.world.interactables.filter((i) => /^escola-ginasio:(luna|sol|estrella)$/.test(i.id) || /coelh|Luna|Sol|Estrella/.test(i.label ?? '')).map((i) => ({ id: i.id, x: i.x, z: i.z, label: i.label })));
  console.log('      ' + JSON.stringify(irma.slice(0, 3)));
  if (irma.length) {
    const alvo = irma[0];
    await p.evaluate(({ x, z }) => window.jogo.debugPlace(x + 0.6, z + 0.6, Math.atan2(-0.6, -0.6)), alvo);
    await p.waitForTimeout(800);
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(800);
    const falas = await conversar(p, async () => false, 25);
    console.log('      ' + falas.join('\n      '));
    conferir(falas.some((f) => /Valentina/.test(f)), 'a coelhinha manda conhecer a Valentina no saguão');
    conferir(!(await p.evaluate(() => window.jogo.flag('aula-chamada'))), 'e a aula do Módulo 3 não é chamada antes disso');
  } else {
    conferir(false, 'achar uma coelhinha no ginásio');
  }
  // conhecida e com a aula chamada: na Sala 1 ela está sentada atrás do Renan
  await p.evaluate(() => { window.jogo.setFlag('valentina-conhecida'); window.jogo.setFlag('aula-chamada'); });
  await p.goto(`${BASE}/?cena=escola-sala-1`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  const sala = await p.evaluate((achar) => {
    const v = eval(achar);
    if (!v) return null;
    const pt = window.jogo.current.world.interactables.find((i) => /:valentina$/.test(i.id));
    return { x: v.x, z: v.z, y: v.group.position.y, ponto: !!pt };
  }, achar);
  conferir(!!sala && Math.abs(sala.x - 1.0) < 0.05 && Math.abs(sala.y - 0.47) < 0.02 && sala.ponto, 'na Sala 1, ela na carteira da segunda fila, atrás do Renan', JSON.stringify(sala));
  if (sala) {
    await p.waitForTimeout(1200);
    const m = await medir(p);
    conferir(m.min > 0.1, `sentada, os pés balançam fora do chão (${m.min.toFixed(2)})`);
    // a dupla sai da frente (o cabelo do Ari tapava a foto)
    await p.evaluate(() => window.jogo.debugPlace(3.3, -2.2, Math.PI));
    await p.waitForTimeout(600);
    await dePerto(p, 0.55, 'sentada', 380, 400);
    await p.evaluate(() => { window.jogo.debugPlace(0.2, 0.3, Math.PI); window.jogo.setZoom(8); });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${OUT}-sala-1.png` });
  }
  await p.goto(`${BASE}/?cena=escola`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => !!window.jogo?.current?.world && !window.jogo.transitioning, null, { timeout: 30000 });
  await p.waitForTimeout(800);
  conferir(!(await ela(p)), 'com a aula chamada, o saguão fica sem ela (está na Sala 1)');
  await p.close();
}

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nconsole limpo');
if (erros.length) falhas.push('erros no console');
await browser.close();
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\ntudo certo');
process.exit(falhas.length ? 1 : 0);
