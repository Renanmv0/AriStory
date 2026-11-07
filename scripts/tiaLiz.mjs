/**
 * A TIA LIZ, a ursa venezuelana da cantina da escola (pedido do Renan). Mede,
 * e não só fotografa:
 *
 * 1. O MODELO (`SO=modelo`): os pés no chão, a altura (adulta, maior que o
 *    Flynn, abaixo da cabeça da dupla), as peças no pai certo (a concha na
 *    pata direita, o relógio e o anel nos antebraços, a trança e as molinhas
 *    na cabeça, o pingente da Torre Eiffel no corpo), os quatro gestos
 *    (mexer, servir, mãos na cintura com a sobrancelha franzida, acenar) e as
 *    fotos de perto de todos os lados, do rosto e de cada gesto;
 * 2. O POSTO (`SO=posto`): atrás do balcão, de frente para o salão, a concha
 *    DENTRO do caldeirão mexendo (a cuia abaixo da boca da panela e dentro do
 *    raio dela), ninguém dá a volta no balcão, e as fotos do balcão (de longe
 *    e de perto) com ela;
 * 3. OS PRATOS (`SO=pratos`): os cinco, cada um com a comida no grupo
 *    `comida` e foto de perto na bandeja;
 * 4. A CONVERSA (`SO=conversa`): ela larga o que fazia, vem até a janela e
 *    ACENA; a apresentação, a flag e a memória, o cardápio com os cinco e o
 *    "Agora não", servir (ela prepara, e os dois pratos montados chegam às
 *    bandejas do parapeito), a dupla sentada na mesa mais perto com uma
 *    bandeja na frente de cada um, a comida encolhendo, levantar e a louça
 *    sumir; e os cinco provados dão a memória "Comida de casa".
 * 5. A COZINHA (`SO=cozinha`): a rotina alterna sozinha entre o fogão (o fogo
 *    aceso e a frigideira sacudida), a tábua (o legume picado rodela por
 *    rodela), o caldeirão e o passeio, e uma foto de cada posto.
 * 6. OS PREPAROS (`SO=preparos`, `PRATOS=sopita,pasta` escolhe): cada prato
 *    com a sua coreografia — uma foto por passo (a louça, a concha, o
 *    espaguete, as almôndegas, as tajadas virando, a forminha, o fororo
 *    despejado, o corte da torta, o leite...), e no fim os dois pratos na
 *    bandeja com TODAS as partes da comida e o talher, e a cozinha de volta
 *    ao lugar (o pedaço da torta reposto, o refogado na frigideira).
 *
 *   node scripts/tiaLiz.mjs /tmp/tl      (SO=modelo,posto… roda uma parte)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/tl';
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

const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });

/** uma página com um save de teste */
const abrir = async (cena, { flags = [], em = '' } = {}) => {
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
  await p.evaluate((flags) => {
    for (const f of flags) window.jogo.setFlag(f);
  }, [...FLAGS, ...flags]);
  await p.goto(`${BASE}/?cena=${cena}${em ? `&em=${em}` : ''}`, { waitUntil: 'networkidle' });
  await pronto();
  await p.mouse.click(550, 300);
  await p.waitForTimeout(1000);
  return p;
};

/** o gancho de teste da cantina */
const achar = `(() => { let v = null; window.jogo.current.world.root.traverse((o) => { if (!v && o.userData?.teste?.liz) v = o.userData.teste; }); return v; })()`;

const parar = (p, x, z, rot, gesto = '') => p.evaluate(([achar, x, z, rot, gesto]) => {
  const { liz } = eval(achar);
  liz.entrarEmServico();
  liz.group.position.set(x, 0, z);
  liz.pararDeEncarar();
  liz.group.rotation.y = rot;
  liz.encarar(x + Math.sin(rot) * 5, z + Math.cos(rot) * 5);
  liz.mexerAPanela(gesto === 'mexer');
  liz.servirFalta = 0;
  liz.naCinturaFalta = 0;
  liz.acenando = 0;
  if (gesto === 'servir') liz.servir(60);
  if (gesto === 'brava') liz.maosNaCintura(60);
  if (gesto === 'acenar') liz.acenar(60);
}, [achar, x, z, rot, gesto]);

/** as medidas do corpo: o mais baixo, o mais alto, e os nomes de tudo (com o caminho dos pais) */
const medir = (p) => p.evaluate((achar) => {
  const j = window.jogo;
  const { liz } = eval(achar);
  const g = liz.group;
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
  let malhas = 0;
  g.traverse((o) => { if (o.isMesh) malhas++; });
  return { min, max, ari: j.player.rig.head.getWorldPosition(new V()).y, nomes, malhas };
}, achar);

/** a foto de perto: a câmera num ponto dela, e a foto recortada em volta */
const dePerto = async (p, altura, nome, w = 320, h = 400, zoom = 0.6, alvo = null) => {
  await p.evaluate(([achar, altura, zoom, alvo]) => {
    const j = window.jogo;
    const { liz } = eval(achar);
    const foco = new liz.group.constructor();
    if (alvo) foco.position.set(alvo[0], 0, alvo[1]);
    else liz.group.getWorldPosition(foco.position);
    foco.position.y += altura;
    j.current.world.root.add(foco);
    j.focusCamera(foco);
    j.setZoom(zoom);
    window.__foco = foco;
  }, [achar, altura, zoom, alvo]);
  await p.waitForTimeout(2600);
  const c = await p.evaluate(() => {
    const v = window.__foco.position.clone().project(window.jogo.iso.camera);
    return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight };
  });
  await p.screenshot({ path: `${OUT}-${nome}.png`, clip: { x: Math.max(0, c.x - w / 2), y: Math.max(0, c.y - h / 2), width: w, height: h } });
  await p.evaluate(() => { window.jogo.focusCamera(null); window.__foco.removeFromParent(); });
};

/** passa as falas com E, anotando "quem: texto", até `ate` acontecer */
const conversar = async (p, ate, max = 60) => {
  const falas = [];
  for (let i = 0; i < max && !(await ate()); i++) {
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(400);
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
/** os botões de uma pergunta aberta */
const opcoes = (p) => p.evaluate(() => [...document.querySelectorAll('.dialogue.show .choices button, .dialogue.show button')].map((b) => b.textContent.trim()));
const escolher = (p, rotulo) => p.evaluate((rotulo) => {
  const b = [...document.querySelectorAll('.dialogue.show button')].find((x) => x.textContent.includes(rotulo));
  b?.click();
  return !!b;
}, rotulo);
const temPergunta = async (p, texto) => (await opcoes(p)).some((o) => o.includes(texto));

/** a dupla na frente do balcão, com o prompt da Tia Liz na tela */
const chegarPerto = async (p) => {
  const pt = await p.evaluate(() => {
    const i = window.jogo.current.world.interactables.find((i) => i.id === 'escola:tia-liz');
    return { x: i.x, z: i.z };
  });
  await p.evaluate(({ x, z }) => window.jogo.debugPlace(x, z + 0.3, Math.PI), pt);
  for (let i = 0; i < 20; i++) {
    if (/Tia Liz/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) return true;
    await p.waitForTimeout(150);
  }
  return false;
};

// um lugar aberto do refeitório, entre as mesas (para as fotos dela de corpo inteiro)
const X0 = -35;
const Z0 = 0.4;

// ============================================================ 1. o modelo
if (parte('modelo')) {
  console.log('\n1. o modelo');
  const p = await abrir('escola', { em: '-33,5' });
  await p.evaluate(() => window.jogo.debugPlace(-33, 5, 0));
  await parar(p, X0, Z0, Math.PI / 4);
  await p.waitForTimeout(600);
  const m = await medir(p);
  console.log(`      piso ${m.min.toFixed(3)} · topo ${m.max.toFixed(2)} · cabeça do Ari ${m.ari.toFixed(2)} · ${m.malhas} malhas`);
  conferir(m.min > -0.02 && m.min < 0.03, `os pés no chão (${m.min.toFixed(3)})`);
  conferir(m.max > 1.45 && m.max < 1.76, `adulta, e não passa da dupla (o topo a ${m.max.toFixed(2)})`);
  const em = (peca, pai) => (m.nomes[peca] ?? []).includes(pai);
  conferir(em('concha-da-liz', 'antebraco-direito-da-liz'), 'a concha na pata direita');
  conferir(em('tranca-da-liz', 'cabeca-da-liz') && em('mola-da-liz-6', 'cabeca-da-liz'), 'a trança e as molinhas na cabeça');
  conferir(em('pingente-torre-eiffel', '') || m.nomes['pingente-torre-eiffel'] !== undefined, 'o pingente da Torre Eiffel no peito');
  conferir(em('olho-esquerdo-da-liz', 'cabeca-da-liz') && em('sobrancelha-direita-da-liz', 'cabeca-da-liz'), 'os olhos e as sobrancelhas na cabeça');

  for (const [rot, nome] of [[Math.PI / 4, 'frente'], [0, 'tres-quartos'], [-Math.PI / 4, 'lado'], [-3 * Math.PI / 4, 'costas'], [Math.PI, 'costas-2'], [Math.PI / 2, 'outro-lado']]) {
    await parar(p, X0, Z0, rot);
    await dePerto(p, 0.85, nome, 400, 500);
  }
  await parar(p, X0, Z0, Math.PI / 4);
  await dePerto(p, 1.35, 'rosto', 300, 260, 0.4);
  await parar(p, X0, Z0, 0);
  await dePerto(p, 1.35, 'rosto-lado', 300, 260, 0.4);

  // os gestos
  for (const gesto of ['mexer', 'servir', 'brava', 'acenar']) {
    await parar(p, X0, Z0, Math.PI / 4, gesto);
    await p.waitForTimeout(1500);
    const g = await p.evaluate((achar) => {
      const { liz } = eval(achar);
      return { mexe: liz.estaMexendo, serve: liz.estaServindo, brava: liz.estaBrava, franzido: liz.franzido, aceno: liz.estaAcenando };
    }, achar);
    const ok = gesto === 'mexer' ? g.mexe : gesto === 'servir' ? g.serve : gesto === 'brava' ? g.brava && g.franzido > 0.6 : g.aceno;
    conferir(ok, `o gesto: ${gesto}`, JSON.stringify(g));
    await dePerto(p, 0.9, `gesto-${gesto}`, 400, 500);
  }
  await p.close();
}

// ============================================================== 2. o posto
if (parte('posto')) {
  console.log('\n2. o posto');
  const p = await abrir('escola', { em: '-27,-6' });
  // ela está na rotina: acelera a cozinha e espera ela chegar no caldeirão
  // (o navegador do teste anda devagar: espera a pose de mexer assentar)
  await p.evaluate((achar) => { eval(achar).cozinha.vezes = 4; }, achar);
  await p.waitForFunction((achar) => { const t = eval(achar); return t.cozinha.estacao === 'sopa' && t.liz.misturaMexe > 0.985; }, achar, { timeout: 240000 });
  await p.evaluate((achar) => { eval(achar).cozinha.vezes = 0.05; }, achar);
  const r = await p.evaluate((achar) => {
    const { liz, sopa, posto, balcao } = eval(achar);
    const V = liz.group.position.constructor;
    let cuia = null;
    liz.group.traverse((o) => { if (o.name === 'concha-da-liz') cuia = o; });
    cuia.updateWorldMatrix(true, false);
    const ponta = new V(0, -0.15, 0.01).applyMatrix4(cuia.matrixWorld);
    const pega = new V(0, 0, 0).applyMatrix4(cuia.matrixWorld);
    return {
      x: liz.x, z: liz.z, rot: liz.group.rotation.y, mexe: liz.estaMexendo, cuiaVisivel: cuia.visible,
      sopa, posto, ponta: { x: ponta.x, y: ponta.y, z: ponta.z }, pega: { x: pega.x, y: pega.y, z: pega.z },
      bz: balcao.position.z,
      mistura: liz.misturaMexe, estado: liz.estado,
      braco: [liz.bracos[1].rotation.x, liz.bracos[1].rotation.z, liz.antebracos[1].rotation.x, liz.antebracos[1].rotation.z].map((n) => +n.toFixed(2)),
    };
  }, achar);
  const d = Math.hypot(r.ponta.x - r.sopa.x, r.ponta.z - r.sopa.z);
  console.log(`      ela (${r.x.toFixed(2)}, ${r.z.toFixed(2)}) · cuia (${r.ponta.x.toFixed(2)}, ${r.ponta.y.toFixed(2)}, ${r.ponta.z.toFixed(2)}) · sopa (${r.sopa.x.toFixed(2)}, ${r.sopa.z.toFixed(2)}) · pata a ${r.pega.y.toFixed(2)} · braço ${r.braco} · mistura ${r.mistura} ${r.estado}`);
  conferir(r.mexe && r.cuiaVisivel, 'ela mexendo a panela, com a concha na mão');
  conferir(Math.abs(r.rot) < 0.2, `de frente para o salão (giro ${r.rot.toFixed(2)})`);
  conferir(d < 0.13 && r.ponta.y < 1.0 && r.ponta.y > 0.86, `a cuia dentro do caldeirão (a ${d.toFixed(3)} do meio, altura ${r.ponta.y.toFixed(2)})`);
  conferir(r.pega.y > 1.0, `a pata acima da boca da panela (${r.pega.y.toFixed(2)})`);

  // ninguém dá a volta no balcão: os pontos atrás dele não são pisáveis
  const atras = await p.evaluate((posto) => {
    const w = window.jogo.current.world;
    const livre = (x, z) => !w.colliders.some((c) => c.kind === 'circle'
      ? Math.hypot(x - c.x, z - c.z) < c.r + 0.42
      : Math.abs(x - c.x) < (c.hw ?? c.halfW ?? 0) + 0.42 && Math.abs(z - c.z) < (c.hd ?? c.halfD ?? 0) + 0.42);
    const pts = [];
    for (let x = -31; x <= -23; x += 0.5) pts.push([x, posto.z]);
    return pts.filter(([x, z]) => livre(x, z)).length;
  }, r.posto);
  conferir(atras === 0, `atrás do balcão não se pisa (${atras} pontos livres)`);

  await p.evaluate(() => window.jogo.debugPlace(-25, -7.8, Math.PI));
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}-cantina.png` });
  await dePerto(p, 1.0, 'balcao', 760, 460, 2.6, [r.sopa.x, r.sopa.z]);
  await dePerto(p, 1.2, 'mexendo', 360, 360, 0.75);
  await dePerto(p, 1.0, 'balcao-esquerda', 480, 320, 1.1, [r.sopa.x - 1.4, r.sopa.z + 0.25]);
  await dePerto(p, 1.0, 'balcao-direita', 480, 320, 1.1, [r.sopa.x + 1.6, r.sopa.z + 0.25]);
  const info = await p.evaluate(() => window.jogo.renderer.info.render);
  console.log(`      a vista da cantina: ${info.calls} desenhos, ${info.triangles} triângulos`);
  await p.close();
}

// ============================================================= 3. os pratos
if (parte('pratos')) {
  console.log('\n3. os pratos');
  const p = await abrir('escola', { em: '-24,-1' });
  const ids = ['sopita', 'pasta', 'pabellon', 'fororo', 'tres-leches'];
  // cada prato numa bandeja na mesa do meio (o tampo a 0,78)
  const r = await p.evaluate(([achar, ids]) => {
    const { bandejaComPrato } = eval(achar);
    const w = window.jogo.current.world;
    return ids.map((id, i) => {
      const b = bandejaComPrato(id);
      b.position.set(-32.2 + i * 0.6, 0.78, 3.6);
      w.root.add(b);
      const comida = b.userData.prato.getObjectByName('comida');
      return { id, comida: !!comida, filhos: comida?.children.length ?? 0 };
    });
  }, [achar, ids]);
  for (const x of r) conferir(x.comida && x.filhos > 0, `${x.id}: a comida no grupo próprio (${x.filhos} pedaços)`);
  await p.evaluate(() => window.jogo.debugPlace(-27, 6, 0));
  for (const [i, id] of ids.entries()) {
    await dePerto(p, 0.85, `prato-${id}`, 300, 260, 0.36, [-32.2 + i * 0.6, 3.6]);
  }
  await dePerto(p, 0.85, 'pratos', 760, 300, 1.1, [-31, 3.6]);
  await p.close();
}

// ============================================================ 4. a conversa
if (parte('conversa')) {
  console.log('\n4. a conversa');
  const p = await abrir('escola', { em: '-27,-7' });
  await p.evaluate((achar) => { eval(achar).cozinha.vezes = 3; }, achar);
  conferir(await chegarPerto(p), 'o prompt "Falar com a Tia Liz" na frente do balcão');
  await p.keyboard.press('KeyE');
  // ela larga o que fazia, vem até a janela e ACENA antes da primeira fala
  let acenou = false;
  for (let i = 0; i < 60 && !acenou; i++) {
    acenou = await p.evaluate((achar) => eval(achar).liz.estaAcenando, achar);
    if (!acenou) await p.waitForTimeout(150);
  }
  const naJanela = await p.evaluate((achar) => { const t = eval(achar); return { x: t.liz.x, z: t.liz.z, posto: t.posto, rot: t.liz.group.rotation.y }; }, achar);
  conferir(acenou, 'ela acena ao vir atender');
  conferir(Math.hypot(naJanela.x - naJanela.posto.x, naJanela.z - naJanela.posto.z) < 0.15, `ela atende na janela do caldeirão (${naJanela.x.toFixed(2)}, ${naJanela.z.toFixed(2)})`);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}-aceno.png` });
  const falas = await conversar(p, () => temPergunta(p, 'Sopita'));
  console.log(falas.map((f) => `      ${f}`).join('\n'));
  conferir(falas.some((f) => f.startsWith('Tia Liz: ¡Épale!')), 'a apresentação começa pelas mãos lavadas');
  const ops = await opcoes(p);
  console.log(`      cardápio: ${ops.join(' | ')}`);
  conferir(ops.length === 6 && ops.some((o) => o.includes('Pabellón')) && ops.some((o) => o.includes('Agora não')), 'o cardápio com os cinco e o "Agora não"');
  const conhecida = await p.evaluate(() => ({ flag: window.jogo.flag('tia-liz-conhecida'), mem: !!window.jogo.save?.data?.memories?.some?.((m) => m.id === 'a-tia-da-cantina') }));
  conferir(conhecida.flag, 'a flag da apresentação');
  await p.screenshot({ path: `${OUT}-cardapio.png` });

  // pede o pabellón
  await escolher(p, 'Pabellón');
  // ela PREPARA na frente da dupla (as falas do prato saem cozinhando)
  let viuPreparo = false;
  const servindo = [];
  for (let i = 0; i < 400; i++) {
    const est = await p.evaluate((achar) => ({ passo: eval(achar).cozinha.passo, sentado: !!(window.jogo.player.sitting ?? window.jogo.player.rig?.sentado) }), achar);
    if (est.sentado) break;
    if (est.passo && !viuPreparo) {
      viuPreparo = true;
      await p.screenshot({ path: `${OUT}-preparando.png` });
    }
    if (await p.locator('.dialogue.show').count()) servindo.push(...(await conversar(p, async () => false, 1)));
    else await p.waitForTimeout(300);
  }
  console.log([...new Set(servindo)].map((f) => `      ${f}`).join('\n'));
  conferir(viuPreparo, 'ela prepara o prato na cozinha');
  const noBalcao = await p.evaluate(() => {
    let n = 0;
    let montados = 0;
    const det = [];
    window.jogo.current.world.root.traverse((o) => {
      if (o.userData?.peca !== 'bandeja-da-cantina') return;
      n++;
      const pr = o.userData.prato;
      const partes = pr?.getObjectByName('comida')?.children ?? [];
      det.push(partes.map((c) => `${c.name}:${c.visible ? 1 : 0}`).join(',') + ` talher:${pr?.getObjectByName('talher')?.visible ? 1 : 0}`);
      if (partes.length && partes.every((c) => c.visible) && pr.getObjectByName('talher')?.visible) montados++;
    });
    return { n, montados, det };
  });
  conferir(noBalcao.n === 2 && noBalcao.montados === 2, `as duas bandejas servidas com o prato montado (${noBalcao.montados}/${noBalcao.n})`, noBalcao.det.join(' | '));
  // passa as falas até a pergunta de ficar
  const comendo = [];
  let fotoComendo = false;
  for (let i = 0; i < 40 && !(await temPergunta(p, 'Levantar')); i++) {
    if (!fotoComendo) {
      const menor = await p.evaluate(() => {
        let k = 1;
        window.jogo.current.world.root.traverse((o) => { if (o.name === 'comida' && o.visible) k = Math.min(k, o.scale.y); });
        return k;
      });
      if (menor < 0.8) {
        fotoComendo = true;
        console.log(`      comendo: a comida a ${(menor * 100).toFixed(0)}%`);
        await p.waitForTimeout(1500);
        await p.screenshot({ path: `${OUT}-comendo.png` });
      }
    }
    comendo.push(...(await conversar(p, () => temPergunta(p, 'Levantar'), 1)));
  }
  console.log([...new Set(comendo)].map((f) => `      ${f}`).join('\n'));
  const mesa = await p.evaluate(() => {
    const j = window.jogo;
    const eu = j.playerPosition();
    let vazias = 0;
    let comidas = 0;
    j.current.world.root.traverse((o) => { if (o.name === 'comida') { comidas++; if (!o.visible) vazias++; } });
    return { x: eu.x, z: eu.z, comidas, vazias };
  });
  console.log(`      sentado em (${mesa.x.toFixed(2)}, ${mesa.z.toFixed(2)})`);
  conferir(mesa.comidas === 2 && mesa.vazias === 2, `os dois pratos limpos (${mesa.vazias}/${mesa.comidas})`);
  await p.screenshot({ path: `${OUT}-prato-limpo.png` });
  await escolher(p, 'Levantar');
  await p.waitForTimeout(1200);
  const depois = await p.evaluate(() => {
    let n = 0;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'bandeja-da-cantina') n++; });
    return { n, travado: window.jogo.player.locked ?? false, provou: window.jogo.stat('liz.provou.pabellon') };
  });
  conferir(depois.n === 0, 'levantou, e a louça foi recolhida');
  conferir(depois.provou === 1, 'o pabellón contado como provado');

  // os outros quatro: a conversa da vez e o prato (as falas passam rápido)
  for (const nome of ['Sopita', 'albóndigas', 'Fororo', 'tres leches']) {
    await chegarPerto(p);
    await p.keyboard.press('KeyE');
    await conversar(p, () => temPergunta(p, nome));
    await escolher(p, nome);
    await conversar(p, () => temPergunta(p, 'Levantar'), 400);
    console.log(`      ${nome}: ${await temPergunta(p, 'Levantar') ? 'comeu' : 'NÃO chegou a comer'} (passo ${await p.evaluate((achar) => eval(achar).cozinha.passo, achar)})`);
    if (nome === 'tres leches') await p.screenshot({ path: `${OUT}-tres-leches-na-mesa.png` });
    await escolher(p, 'Levantar');
    await p.waitForTimeout(1200);
  }
  const fim = await p.evaluate(() => ({
    flag: window.jogo.flag('liz-comida-de-casa'),
    provados: ['sopita', 'pasta', 'pabellon', 'fororo', 'tres-leches'].map((id) => window.jogo.stat(`liz.provou.${id}`)),
  }));
  conferir(fim.flag, 'os cinco provados dão a memória "Comida de casa"', fim.provados.join(','));

  // e o "Agora não"
  await chegarPerto(p);
  await p.keyboard.press('KeyE');
  await conversar(p, () => temPergunta(p, 'Agora não'));
  await escolher(p, 'Agora não');
  const tchau = await conversar(p, async () => false, 6);
  conferir(tchau.some((f) => f.includes('barriga vazia')), 'o "Agora não" com a bronca carinhosa');
  await p.close();
}

// ============================================================= 5. a cozinha
if (parte('cozinha')) {
  console.log('\n5. a cozinha');
  const p = await abrir('escola', { em: '-27,-6' });
  await p.evaluate((achar) => {
    const t = eval(achar);
    t.cozinha.vezes = 4;
    const f = new t.liz.group.constructor();
    f.position.y = 1.0;
    t.liz.group.add(f);
    window.jogo.focusCamera(f);
    window.jogo.setZoom(2.6);
  }, achar);
  const vistos = new Set();
  let picou = 0;
  let fogo = false;
  let sacudiu = 0;
  for (let i = 0; i < 260 && vistos.size < 4; i++) {
    const e = await p.evaluate((achar) => {
      const t = eval(achar);
      const c = t.cozinha;
      const V = t.liz.group.position.constructor;
      const casa = c.casas.get(c.frigideira);
      const agora = c.frigideira.getWorldPosition(new V());
      const deCasa = casa ? agora.distanceTo(casa.pai.localToWorld(casa.pos.clone())) : 0;
      return { est: c.estacao, tabua: c.tabua.naTabua, fogo: c.chamas.some((x) => x), deCasa, mexe: t.liz.estaMexendo };
    }, achar);
    picou = Math.max(picou, e.tabua);
    fogo ||= e.fogo;
    sacudiu = Math.max(sacudiu, e.deCasa);
    const pronto = e.est === 'tabua' ? e.tabua >= 3 : e.est === 'fogao' ? e.fogo : e.est === 'sopa' ? e.mexe : e.est === 'passeio';
    if (pronto && !vistos.has(e.est)) {
      vistos.add(e.est);
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${OUT}-rotina-${e.est}.png`, clip: { x: 270, y: 180, width: 560, height: 440 } });
    }
    await p.waitForTimeout(300);
  }
  console.log(`      postos: ${[...vistos].join(', ')} · rodelas na tábua até ${picou} · fogo ${fogo} · frigideira saiu ${(sacudiu * 100).toFixed(0)} cm de casa`);
  conferir(['fogao', 'tabua', 'sopa', 'passeio'].every((x) => vistos.has(x)), 'a rotina passa pelo fogão, pela tábua, pelo caldeirão e pelo passeio');
  conferir(picou >= 5, `ela pica o legume rodela por rodela (${picou})`);
  conferir(fogo, 'o fogo acende no fogão');
  conferir(sacudiu > 0.02, `ela levanta e sacode a frigideira (${(sacudiu * 100).toFixed(0)} cm)`);
  await p.close();
}

// ============================================================ 6. os preparos
if (parte('preparos')) {
  console.log('\n6. os preparos');
  const ids = (process.env.PRATOS ?? 'sopita,pasta,pabellon,fororo,tres-leches').split(',');
  for (const id of ids) {
    const p = await abrir('escola', { em: '-27,-6' });
    await p.evaluate(([achar, id]) => {
      const t = eval(achar);
      t.cozinha.vezes = 3;
      const G = t.liz.group.constructor;
      const bandejas = [t.bandejaComPrato(id, new G()), t.bandejaComPrato(id, new G())];
      bandejas.forEach((b, i) => { b.position.set(t.posto.x + 0.05 + i * 0.5, 0.95, -9.96); window.jogo.current.world.root.add(b); });
      window.__bandejas = bandejas;
      window.__fim = false;
      t.cozinha.preparar(id, bandejas).then(() => { window.__fim = true; }, (e) => { window.__fim = 'erro: ' + e.message; });
      const f = new G();
      f.position.y = 1.0;
      t.liz.group.add(f);
      window.jogo.focusCamera(f);
      window.jogo.setZoom(2.4);
    }, [achar, id]);
    const passos = [];
    for (let i = 0; i < 500; i++) {
      const e = await p.evaluate((achar) => ({ passo: eval(achar).cozinha.passo, fim: window.__fim }), achar);
      if (e.fim) break;
      if (e.passo && !passos.includes(e.passo)) {
        passos.push(e.passo);
        await p.waitForTimeout(900);
        await p.screenshot({ path: `${OUT}-preparo-${id}-${passos.length}-${e.passo}.png`, clip: { x: 270, y: 180, width: 560, height: 440 } });
      }
      await p.waitForTimeout(250);
    }
    const r = await p.evaluate((achar) => {
      const t = eval(achar);
      const c = t.cozinha;
      const pratos = window.__bandejas.map((b) => {
        const pr = b.userData.prato;
        const partes = pr?.getObjectByName('comida')?.children ?? [];
        return { partes: partes.length, visiveis: partes.filter((x) => x.visible).length, talher: !!pr?.getObjectByName('talher')?.visible, naBandeja: pr?.parent === b };
      });
      return { fim: window.__fim, pratos, pedaco: c.refratario.pedaco.visible && c.refratario.pedaco.parent === c.refratario.group, refogado: c.frigideira.getObjectByName('refogado').visible, maos: t.liz.maos.map((m) => m.children.length) };
    }, achar);
    console.log(`      ${id}: ${passos.join(' → ')}`);
    conferir(r.fim === true, `${id}: a preparação chega ao fim`, String(r.fim));
    conferir(r.pratos.every((x) => x.naBandeja && x.partes > 0 && x.visiveis === x.partes && x.talher), `${id}: os dois pratos montados na bandeja`, JSON.stringify(r.pratos));
    conferir(r.pedaco && r.refogado && r.maos.every((n) => n === 0), `${id}: a cozinha de volta ao lugar (o pedaço da torta, o refogado, as patas vazias)`);
    await dePerto(p, 1.0, `preparo-${id}-pronto`, 420, 300, 1.0, [-27.13, -9.96]);
    await p.close();
  }
}

console.log(erros.length ? `\nERROS DE CONSOLE:\n${erros.join('\n')}` : '\nsem erro de console');
await browser.close();
if (falhas.length || erros.length) {
  console.log(`\n${falhas.length} falha(s)`);
  process.exit(1);
}
console.log('\ntudo certo');
