/**
 * A ETAPA D DO ACAMPAMENTO — o que se faz NA CLAREIRA (`docs/ACAMPAMENTO.md`).
 *
 * Uma parte por pedaço (`SO=cozinha`, `SO=radinho`, `SO=vagalumes`,
 * `SO=estrelas`; sem `SO` roda todas):
 *
 * - COZINHA: o fogareiro acende de verdade (a manopla gira, a chama sai, a
 *   coroa vai à brasa, o fogareiro treme), a água ferve (a tampa sacode), o
 *   café passa pelo coador e enche as duas canecas, as mini arepas douram no
 *   budare, viram (e o lado de baixo também doura) e vão para o prato; de
 *   noite, o chocolate quente com três marshmallows em cada caneca e o miojo
 *   que amolece e fica laranja de tempero. Depois de cada um, os dois na canga
 *   com a comida na mão, a memória, e a louça de volta no lugar.
 *
 * O navegador do teste anda devagar: o relógio da clareira é acelerado pelo
 * gancho da cena (`ritmo`), e tudo é esperado por estado, nunca por tempo.
 *
 * Uso: node scripts/acampamento.mjs /caminho/prefixo   (CEL=1 para o celular)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './acampamento';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';
const CEL = process.env.CEL === '1';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);
/** PRATOS=cafe,miojo cozinha só esses (o padrão é os quatro) */
const PRATOS = process.env.PRATOS ?? '';
const prato = (nome) => !PRATOS || PRATOS.split(',').includes(nome);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage(CEL
  ? { viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, ignoreHTTPSErrors: true }
  : { viewport: { width: 1100, height: 820 }, ignoreHTTPSErrors: true });
const erros = [];
const falhas = [];
const checar = (ok, msg, dado) => { if (!ok) falhas.push(dado === undefined ? msg : `${msg}: ${JSON.stringify(dado)}`); };
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT|favicon/.test(m.text())) erros.push('console: ' + m.text()); });
const t0 = Date.now();
const foto = (nome) => {
  if (process.env.LOG) console.log(`  ${((Date.now() - t0) / 1000).toFixed(0)}s · ${nome}`);
  return page.screenshot({ path: `${OUT}-${nome}.png` });
};
const temEscolha = () => page.locator('.escolhas.show button').count();
const temFala = () => page.locator('.dialogue.show').count();
const escolhas = () => page.locator('.escolhas.show button').allTextContents();
const escolher = async (texto) => {
  for (let i = 0; i < 240 && !(await temEscolha()); i++) await page.waitForTimeout(250);
  await page.locator('.escolhas.show button', { hasText: texto }).first().click();
  await page.waitForTimeout(300);
};
/** um passo de fala: se tem fala inteira na tela, avança */
const passarUmaFala = async () => {
  if (!(await temFala())) return null;
  if (await page.evaluate(() => window.jogo.ui.typing !== null)) return null;
  const texto = (await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '';
  await page.keyboard.press('KeyE');
  return texto;
};
const teste = () => page.evaluateHandle(() => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') t = o.userData.teste; });
  return t;
});
const ir = async (onde) => {
  let prompt = '';
  for (let i = 0; i < 20; i++) {
    await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI * 1.25), [onde.x, onde.z]);
    await page.waitForTimeout(350);
    prompt = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
    if (prompt) break;
  }
  return prompt;
};
const ponto = async (nome) => (await teste()).evaluate((t, n) => t[n], nome);
const cozinha = () => page.evaluate(() => {
  // a cena não muda durante o teste: acha o gancho uma vez (varrer o parque inteiro a cada passo pesava)
  if (!window.__ganchoDaClareira) {
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') window.__ganchoDaClareira = o.userData.teste; });
  }
  const t = window.__ganchoDaClareira;
  const j = window.jogo;
  return {
    ...t.cozinha.estado,
    mao: [j.player.rig.objetoNaMao?.name ?? null, j.parceiro.rig.objetoNaMao?.name ?? null],
    sentado: j.player.riding,
    memorias: (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).map((m) => m.id),
  };
});

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ flags: { 'clareira-achada': true } })), SAVE);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });
await page.waitForTimeout(1200);
await page.mouse.click(CEL ? 195 : 550, CEL ? 300 : 410);
await (await teste()).evaluate((t) => { t.ritmo.vezes = 3; });

/**
 * A FOTO DE PERTO: a câmera de cena vai para um ponto do quadro da mesinha
 * (`[de, para]`), tira a foto e volta para onde estava — a cena só mexe na
 * câmera quando desliza, e a próxima foto tem que ser a tomada dela.
 */
const fotoDePerto = async (nome, [de, para]) => {
  await page.evaluate(([de, para]) => {
    const j = window.jogo;
    const mesinha = j.current.world.root.getObjectByName('fogareiro').parent;
    const cam = j.cameraDeCena();
    window.__camAntes = cam ? { p: cam.position.clone(), q: cam.quaternion.clone() } : null;
    mesinha.updateWorldMatrix(true, false);
    const V = cam.position.constructor;
    j.setCameraOmbro(mesinha.localToWorld(new V(...de)), mesinha.localToWorld(new V(...para)));
  }, [de, para]);
  await page.waitForTimeout(120);
  await foto(nome);
  await page.evaluate(() => {
    const cam = window.jogo.cameraDeCena();
    if (cam && window.__camAntes) {
      cam.position.copy(window.__camAntes.p);
      cam.quaternion.copy(window.__camAntes.q);
    }
  });
};

/**
 * Cozinha um prato e acompanha: devolve o que foi visto (o máximo da chama,
 * da fervura, do tremor, as etapas, as canecas no fim, a comida na mão na
 * canga) e tira as fotos nas marcas pedidas.
 */
const cozinhar = async (opcao, marcas) => {
  const NO = await ponto('NO_FOGAREIRO');
  const prompt = await ir(NO);
  checar(/cozinhar no fogareiro/i.test(prompt), 'o prompt do fogareiro', prompt);
  await page.keyboard.press('KeyE');
  for (let i = 0; i < 40 && !(await temEscolha()); i++) await page.waitForTimeout(200);
  const menu = await escolhas();
  await escolher(opcao);
  const visto = { menu, chama: 0, fervura: 0, tremor: 0, manopla: 0, etapas: [], naMao: null, falas: [], fotos: new Set(), fim: null, max: {} };
  for (let i = 0; i < 2400; i++) {
    const c = await cozinha();
    visto.chama = Math.max(visto.chama, c.chama);
    visto.fervura = Math.max(visto.fervura, c.fervura);
    visto.tremor = Math.max(visto.tremor, c.tremor);
    visto.manopla = Math.min(visto.manopla, c.manopla);
    if (visto.etapas.at(-1) !== c.etapa) {
      visto.etapas.push(c.etapa);
      if (process.env.LOG) console.log(`    ${((Date.now() - t0) / 1000).toFixed(0)}s   ${opcao}: ${c.etapa}`);
    }
    for (const [nome, marca] of Object.entries(marcas)) {
      const quando = typeof marca === 'function' ? marca : marca.quando;
      if (!visto.fotos.has(nome) && quando(c)) {
        visto.fotos.add(nome);
        if (marca.perto) await fotoDePerto(nome, marca.perto);
        else await foto(nome);
      }
    }
    if (c.mao[0] && !visto.naMao) visto.naMao = { mao: c.mao, canecas: c.canecas, arepas: c.arepas, miojo: c.miojo };
    if (c.fazendo) visto.comecou = true;
    // acaba quando levantam da canga (ou, se nada chegou na mão, quando
    // levantam depois de cozinhar: aí o defeito aparece nas checagens, e o
    // teste não fica rodando à toa)
    if ((visto.naMao || visto.comecou) && !c.sentado && !c.fazendo) {
      visto.fim = c;
      break;
    }
    const f = await passarUmaFala();
    if (f) visto.falas.push(f);
    await page.waitForTimeout(90);
  }
  return visto;
};

// ================================================================ a cozinha
if (parte('cozinha')) {
  if (prato('cafe')) {
    // ---- o café coado
    const cafe = await cozinhar('Café coado', {
      'c1-acesa': (c) => c.etapa === 'aceso' || (c.chama > 0.9 && c.fazendo),
      'c2-fervendo': (c) => c.fervura > 0.8 && !c.tampaAberta,
      'c3-coando': (c) => c.etapa === 'despejando' && c.canecas[0].nivel > 0.35 && c.canecas[0].nivel < 0.7,
      'c3b-coador-de-perto': { quando: (c) => c.etapa === 'despejando' && c.canecas[1].nivel > 0.3, perto: [[0.42, 0.62, -0.3], [0.17, 0.4, 0.06]] },
      'c4-cafe-na-canga': (c) => c.mao[0] === 'caneca-1' && c.canecas[0].vapor > 0.3,
    });
    checar(cafe.menu.includes('Mini arepas') && cafe.menu.includes('Café coado') && !cafe.menu.includes('Chocolate quente'), 'de dia, o cardápio é café e mini arepas', cafe.menu);
    checar(cafe.chama > 0.95 && cafe.manopla < -1.2 && cafe.tremor > 0.001, 'o fogareiro acende: a manopla gira, a chama sai e ele treme', { chama: cafe.chama, manopla: cafe.manopla, tremor: cafe.tremor });
    checar(cafe.fervura > 0.8, 'a água ferve', cafe.fervura);
    checar(['acendendo', 'fervendo', 'coador', 'po-de-cafe', 'despejando', 'apagando'].every((e) => cafe.etapas.includes(e)), 'as etapas do café', cafe.etapas);
    const nm = cafe.naMao;
    checar(nm && nm.mao[0] === 'caneca-1' && nm.mao[1] === 'caneca-2', 'na canga, uma caneca na mão de cada um', nm?.mao);
    checar(nm && nm.canecas.every((c) => c.nivel > 0.8 && c.cor === '#4a2a17'), 'as duas canecas cheias de café', nm?.canecas);
    checar(cafe.fim && cafe.fim.chama === 0 && cafe.fim.canecas.every((c) => c.nivel === 0) && cafe.fim.memorias.includes('cafe-da-manha-na-clareira'),
      'o fogo apagado, as canecas lavadas na mesinha e a memória', cafe.fim && { chama: cafe.fim.chama, canecas: cafe.fim.canecas, mem: cafe.fim.memorias });
    checar((cafe.fim?.sons.faisca ?? 0) >= 2 && cafe.fim?.sons.chamaAcende >= 1 && cafe.fim?.sons.gasDoFogareiro > 3 && cafe.fim?.sons.tampaTremendo > 1 && cafe.fim?.sons.despejar >= 2,
      'os sons do café (faísca, chama, gás, tampa, despejar)', cafe.fim?.sons);
    console.log('café:', JSON.stringify({ chama: +cafe.chama.toFixed(2), fervura: +cafe.fervura.toFixed(2), etapas: cafe.etapas.length, fotos: [...cafe.fotos] }));
  }

  if (prato('arepas')) {
    // ---- as mini arepas
    const arepas = await cozinhar('Mini arepas', {
      'c5-arepas-cruas': (c) => c.etapa === 'dourando' && c.arepas.every((a) => a.noBudare),
      'c6-arepas-viradas': (c) => c.arepas.every((a) => a.virada) && c.arepas.some((a) => a.b > 0.2),
      'c6b-budare-de-perto': { quando: (c) => c.arepas.every((a) => a.virada) && c.arepas.some((a) => a.b > 0.35), perto: [[0.05, 0.85, -0.3], [-0.14, 0.6, 0.0]] },
      'c7-arepas-no-prato': { quando: (c) => c.etapa === 'arepas-prontas', perto: [[0.3, 0.75, -0.25], [0.0, 0.33, 0.12]] },
      'c8-arepas-na-canga': (c) => c.mao[0] === 'mini-arepa',
    });
    const prontas = arepas.naMao?.arepas ?? [];
    checar(arepas.naMao && arepas.naMao.mao.every((m) => m === 'mini-arepa'), 'na canga, uma mini arepa na mão de cada um', arepas.naMao?.mao);
    checar(prontas.length === 4 && prontas.every((a) => a.virada && a.a > 0.6 && a.b > 0.4), 'as quatro douraram dos dois lados', prontas);
    checar(prontas.filter((a) => a.noPrato).length === 2, 'duas no prato da canga (as outras duas na mão)', prontas);
    checar(['budare', 'manteiga', 'arepas-no-budare', 'dourando', 'virando', 'no-prato'].every((e) => arepas.etapas.includes(e)), 'as etapas das arepas', arepas.etapas);
    checar(arepas.fim && arepas.fim.sons.fritar > 3 && arepas.fim.sons.virar >= 8, 'o chiado da fritura e o tuc de virar', arepas.fim?.sons);
    checar(arepas.fim && !arepas.fim.budareNaBoca && arepas.fim.panela.naBoca, 'o budare volta pro caixote e a panelinha pro fogo', arepas.fim && { budare: arepas.fim.budareNaBoca, panela: arepas.fim.panela });
    console.log('arepas:', JSON.stringify({ etapas: arepas.etapas.length, fotos: [...arepas.fotos] }));
  }

  // ---- de noite: o chocolate e o miojo
  if (prato('chocolate') || prato('miojo')) {
    // a noite é da clareira: fora dela o dia volta sozinho
    await ir(await ponto('NO_FOGAREIRO'));
    await (await teste()).evaluate((t) => t.anoitecerJa());
    await page.waitForTimeout(500);
  }
  if (prato('chocolate')) {
    const choco = await cozinhar('Chocolate quente', {
      'c9-mexendo': (c) => c.etapa === 'mexendo',
      'c10-marshmallow': (c) => c.canecas.every((k) => k.marshmallows === 3) && c.fazendo,
      'c11-chocolate-na-canga': (c) => c.mao[0] === 'caneca-1',
    });
    checar(choco.menu.includes('Chocolate quente') && choco.menu.includes('Miojo') && !choco.menu.includes('Café coado'), 'de noite, chocolate e miojo', choco.menu);
    checar(choco.naMao && choco.naMao.canecas.every((c) => c.cor === '#7a4528' && c.marshmallows === 3 && c.nivel > 0.8), 'as canecas de chocolate, três marshmallows em cada', choco.naMao?.canecas);
    checar(choco.fim && choco.fim.memorias.includes('jantarzinho-no-fogareiro'), 'a memória da noite', choco.fim?.memorias);
    console.log('chocolate:', JSON.stringify([...choco.fotos]));
  }
  if (prato('miojo')) {
    const miojo = await cozinhar('Miojo', {
      'c12-miojo-amolecendo': (c) => c.etapa === 'amolecendo' && c.miojo > 0.4,
      'c13-miojo-na-canga': (c) => c.mao[0] === 'garfo-com-miojo',
    });
    checar(miojo.naMao && miojo.naMao.miojo > 0.95 && miojo.naMao.mao.every((m) => m === 'garfo-com-miojo'), 'o miojo solto e um garfo na mão de cada um', miojo.naMao);
    checar(miojo.etapas.includes('tempero'), 'o tempero', miojo.etapas);
    console.log('miojo:', JSON.stringify([...miojo.fotos]));
  }
}

// ================================================== o radinho e a dança lenta
if (parte('radinho')) {
  const radio = () => page.evaluate(() => {
    const t = window.__ganchoDaClareira;
    const j = window.jogo;
    const cabeca = (rig) => rig.head.getWorldPosition(rig.head.position.clone());
    const a = j.player.rig;
    const b = j.parceiro.rig;
    const ha = cabeca(a);
    const hb = cabeca(b);
    return {
      ...t.radinho.estado,
      estado: t.estado(),
      dancando: t.dancando(),
      clima: j.climaDaMusica,
      sons: Object.fromEntries(j.audio.contagem),
      rigs: [a, b].map((r) => ({ nome: r.spec.name, danca: r.danca, papel: r.papelNaDanca, giro: r.body.rotation.y })),
      cabecas: { distancia: ha.distanceTo(hb), meio: [(ha.x + hb.x) / 2, (ha.z + hb.z) / 2] },
      sentado: j.player.riding,
      memorias: (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).map((m) => m.id),
      prompt: document.querySelector('.prompt .label')?.textContent ?? '',
    };
  });
  // garante o gancho (a parte da cozinha pode não ter rodado)
  await cozinha();
  // DE DIA o radinho não faz nada: nem prompt
  const NO = await ponto('NO_RADINHO');
  if ((await radio()).estado === 'noite') {
    // a cozinha deixou de noite: volta o dia saindo e entrando
    await page.evaluate(() => window.jogo.debugPlace(-20, 12));
    for (let i = 0; i < 40 && (await radio()).estado !== 'dia'; i++) await page.waitForTimeout(250);
  }
  const deDia = await ir(NO);
  checar(!/radinho|dançar/i.test(deDia), 'de dia o radinho não tem prompt', deDia);
  await foto('r0-radinho-de-dia');

  // DE NOITE: ligar
  await (await teste()).evaluate((t) => t.anoitecerJa());
  await page.waitForTimeout(400);
  const prompt = await ir(NO);
  checar(/ligar o radinho/i.test(prompt), 'de noite: "Ligar o radinho"', prompt);
  await page.keyboard.press('KeyE');
  const visto = { antena: 0, notas: 0, pulso: 1, sintonia: [], fotos: new Set() };
  for (let i = 0; i < 400; i++) {
    const r = await radio();
    visto.antena = Math.max(visto.antena, r.antena);
    visto.notas = Math.max(visto.notas, r.notas);
    visto.pulso = Math.max(visto.pulso, r.pulso);
    visto.sintonia.push(r.sintonia);
    if (!visto.fotos.has('r1') && r.antena > 0.3 && r.antena < 0.9) {
      visto.fotos.add('r1');
      await foto('r1-antena-esticando');
    }
    if (!visto.fotos.has('r2') && r.tocando && r.notas >= 3) {
      visto.fotos.add('r2');
      await foto('r2-radinho-tocando');
    }
    if (await temEscolha()) break;
    await passarUmaFala();
    await page.waitForTimeout(90);
  }
  const ligado = await radio();
  checar(ligado.tocando && Math.abs(ligado.sintonia - 0.62) < 0.01 && ligado.mostrador > 0.95 && visto.antena > 0.95,
    'ligado: a antena esticada, a agulha no coraçãozinho e o mostrador aceso', { antena: visto.antena, sintonia: ligado.sintonia, mostrador: ligado.mostrador });
  checar(Math.max(...visto.sintonia) > 0.645, 'a agulha passa do ponto e volta', Math.max(...visto.sintonia));
  checar(visto.notas >= 3 && visto.pulso > 1.015, 'as notinhas saindo e o rádio pulsando', { notas: visto.notas, pulso: visto.pulso });
  checar(ligado.clima === 'danca-lenta', 'a música vira a balada de baile', ligado.clima);
  checar(ligado.sons.radioLiga >= 1 && ligado.sons.antena >= 1, 'o clique, a estática e a antena', ligado.sons);

  // DANÇAR
  await escolher('Dançar');
  const danca = { meio: [], distancias: [], giro: 0, fotos: new Set(), papeis: null, ate: null };
  for (let i = 0; i < 1500; i++) {
    const r = await radio();
    if (r.dancando && r.rigs.every((x) => x.danca > 0.9)) {
      danca.papeis = r.rigs.map((x) => `${x.nome}:${x.papel}`);
      danca.meio.push(r.cabecas.meio);
      danca.distancias.push(r.cabecas.distancia);
      if (!danca.fotos.has('r3')) {
        danca.fotos.add('r3');
        await foto('r3-dancando');
      }
    }
    const giro = Math.max(...r.rigs.map((x) => Math.abs(x.giro)));
    danca.giro = Math.max(danca.giro, giro);
    if (!danca.fotos.has('r4') && giro > 2.6 && giro < 3.8) {
      danca.fotos.add('r4');
      await foto('r4-voltinha');
    }
    if ((await temEscolha()) && (await escolhas()).includes('Parar de dançar')) {
      if (!danca.fotos.has('r5')) {
        danca.fotos.add('r5');
        await foto('r5-de-novo');
      }
      await escolher('Parar de dançar');
      continue;
    }
    await passarUmaFala();
    if (danca.fotos.has('r5') && !r.sentado) {
      danca.ate = r;
      break;
    }
    await page.waitForTimeout(90);
  }
  const ds = danca.distancias;
  const mx = danca.meio.map((m) => m[0]);
  const mz = danca.meio.map((m) => m[1]);
  const vai = Math.hypot(Math.max(...mx) - Math.min(...mx), Math.max(...mz) - Math.min(...mz));
  checar(danca.papeis && danca.papeis.includes('Renan:cintura') && danca.papeis.includes('Ari:ombros'), 'o Renan na cintura, o Ari pelos ombros', danca.papeis);
  checar(ds.length > 10 && Math.min(...ds) > 0.4 && Math.max(...ds) - Math.min(...ds) < 0.12, 'as cabeças pertinho, sem bater', ds.length && { min: Math.min(...ds), max: Math.max(...ds) });
  checar(vai > 0.03, 'os dois balançam juntos para o mesmo lado (o meio das cabeças anda)', vai);
  checar(danca.giro > 5.5, 'a voltinha inteira', danca.giro);
  checar(danca.ate && danca.ate.memorias.includes('danca-lenta-na-clareira') && danca.ate.rigs.every((x) => x.danca === 0), 'a memória e os dois soltos, de pé', danca.ate && { mem: danca.ate.memorias, rigs: danca.ate.rigs });
  checar(danca.ate && danca.ate.tocando && danca.ate.clima === 'danca-lenta', 'o radinho continua tocando depois', danca.ate && { tocando: danca.ate.tocando, clima: danca.ate.clima });

  // DESLIGAR
  const deNovo = await ir(NO);
  checar(/dançar/i.test(deNovo), 'ligado, o prompt chama para dançar', deNovo);
  await page.keyboard.press('KeyE');
  await escolher('Desligar o radinho');
  for (let i = 0; i < 60 && (await radio()).ligado; i++) await page.waitForTimeout(150);
  await page.waitForTimeout(400);
  const desligado = await radio();
  checar(!desligado.ligado && desligado.antena < 0.01 && desligado.mostrador < 0.01 && desligado.clima === 'noite-na-clareira', 'desligado: a antena deitada, o mostrador apagado e a música da noite', { antena: desligado.antena, mostrador: desligado.mostrador, clima: desligado.clima });
  await foto('r6-desligado');
  console.log('radinho:', JSON.stringify({ antena: +visto.antena.toFixed(2), notas: visto.notas, pulso: +visto.pulso.toFixed(3), balanco: +vai.toFixed(3), cabecas: ds.length && [+Math.min(...ds).toFixed(2), +Math.max(...ds).toFixed(2)], giro: +danca.giro.toFixed(2) }));
}

// ======================================================= os vaga-lumes no pote
if (parte('vagalumes')) {
  const vl = () => page.evaluate(() => {
    const t = window.__ganchoDaClareira;
    const j = window.jogo;
    const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
    return {
      estado: t.estado(),
      naMao: t.poteNaMao(),
      jogador: j.player.rig.spec.id,
      noPote: t.pote.quantos,
      tampa: t.pote.aberta,
      soltos: t.soltos.quantos,
      pontos: t.soltos.lista.length,
      save: save.vagaLumesSoltos ?? [],
      memorias: (save.memories ?? []).map((m) => m.id),
      sons: Object.fromEntries(j.audio.contagem),
      prompt: document.querySelector('.prompt .label')?.textContent ?? '',
      maoObj: j.player.rig.objetoNaMao?.name ?? null,
    };
  });
  /** a câmera de cena perto de um ponto do mundo (para ver o pote e os vaga-lumes) */
  const fotoNoMundo = async (nome, alvo, de) => {
    await page.evaluate(([alvo, de]) => {
      const j = window.jogo;
      const V = j.player.object.position.constructor;
      j.setCameraOmbro(new V(alvo[0] + de[0], alvo[1] + de[1], alvo[2] + de[2]), new V(...alvo));
    }, [alvo, de]);
    await page.waitForTimeout(150);
    await foto(nome);
    await page.evaluate(() => window.jogo.setCameraOmbro(null));
  };
  const ondeEstou = () => page.evaluate(() => { const p = window.jogo.player.object.getWorldPosition(window.jogo.player.object.position.clone()); return [p.x, p.y, p.z]; });
  await cozinha();
  if ((await vl()).estado !== 'noite') {
    await ir(await ponto('NO_FOGAREIRO'));
    await (await teste()).evaluate((t) => t.anoitecerJa());
    await page.waitForTimeout(400);
  }
  const antes = await vl();
  // PEGAR O POTE
  const prompt = await ir(await ponto('NO_POTE'));
  checar(/pegar o pote/i.test(prompt), 'de noite: "Pegar o pote de vaga-lumes"', prompt);
  await page.keyboard.press('KeyE');
  for (let i = 0; i < 30; i++) {
    if ((await vl()).naMao && !(await temFala())) break;
    await passarUmaFala();
    await page.waitForTimeout(250);
  }
  const comPote = await vl();
  checar(comPote.naMao === comPote.jogador && comPote.maoObj === 'pote-na-mao', 'o pote na mão de quem joga', { naMao: comPote.naMao, obj: comPote.maoObj });

  /** chega pertinho do vaga-lume mais perto e aperta E (ele anda: tenta de novo até pegar) */
  const pegarUm = async () => {
    const antesDe = (await vl()).noPote;
    for (let tenta = 0; tenta < 16; tenta++) {
      const alvo = await (await teste()).evaluate((t) => {
        const eu = window.jogo.player.object.position;
        const i = t.vagaLumes.maisPerto(eu.x, eu.z, 30);
        const p = t.vagaLumes.onde(i);
        return [p.x, p.z];
      });
      await page.evaluate(([x, z]) => window.jogo.debugPlace(x - 0.2, z - 0.2, Math.PI * 0.25), alvo);
      await page.waitForTimeout(250);
      const pr = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
      if (!/pegar o vaga-lume/i.test(pr)) continue;
      await page.keyboard.press('KeyE');
      for (let i = 0; i < 40 && (await vl()).noPote === antesDe; i++) await page.waitForTimeout(100);
      // espera ele entrar e a tampa fechar
      for (let i = 0; i < 40 && (await vl()).tampa > 0.05; i++) await page.waitForTimeout(100);
      if ((await vl()).noPote === antesDe + 1) return true;
    }
    return false;
  };
  // PEGAR TRÊS
  for (let k = 0; k < 3; k++) {
    const ok = await pegarUm();
    if (k === 0 && ok) await fotoNoMundo('v1-pegou-um', await ondeEstou().then((p) => [p[0], p[1] + 0.6, p[2]]), [0.9, 0.3, 0.9]);
    checar(ok, `pegou o vaga-lume ${k + 1}`);
  }
  const tres = await vl();
  checar(tres.noPote === 3 && tres.sons.vagaLume >= 3, 'três no pote, com o "plim" de cada um', { noPote: tres.noPote, sons: tres.sons.vagaLume });
  await fotoNoMundo('v2-tres-no-pote', await ondeEstou().then((p) => [p[0], p[1] + 0.5, p[2]]), [0.75, 0.15, 0.75]);

  // SOLTAR: num cantinho livre da clareira (sem vaga-lume pertinho e sem outro prompt)
  const livres = await (await teste()).evaluate((t) => {
    const cos = Math.cos(Math.PI / 4);
    const daTenda = (lx, lz) => ({ x: t.TENDA.x + lx * cos + lz * cos, z: t.TENDA.z - lx * cos + lz * cos });
    return [[1.1, 3.55], [-1.0, 3.7], [1.5, 3.2], [0.9, 4.3], [-1.6, 3.2], [2.2, 3.6], [-0.4, 4.6]].map(([a, b]) => daTenda(a, b));
  });
  let soltarPrompt = '';
  for (const lugar of livres) {
    await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI * 1.25), [lugar.x, lugar.z]);
    for (let i = 0; i < 4 && !/soltar/i.test(soltarPrompt); i++) {
      await page.waitForTimeout(250);
      soltarPrompt = (await page.locator('.prompt .label').textContent().catch(() => '')) ?? '';
    }
    if (/soltar/i.test(soltarPrompt)) break;
  }
  checar(/soltar os vaga-lumes aqui/i.test(soltarPrompt), 'com vaga-lume no pote: "Soltar os vaga-lumes aqui"', soltarPrompt);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(600);
  const soltando = await ondeEstou();
  await fotoNoMundo('v3-soltando', [soltando[0], 0.7, soltando[2]], [1.6, 0.9, 1.6]);
  for (let i = 0; i < 30; i++) {
    if (!(await temFala()) && i > 4) break;
    await passarUmaFala();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1500);
  const solto = await vl();
  checar(solto.noPote === 0 && solto.soltos === antes.soltos + 3 && solto.pontos === antes.pontos + 1, 'os três saíram do pote e ficaram rodando ali', { noPote: solto.noPote, soltos: solto.soltos, pontos: solto.pontos });
  checar(solto.save.length === antes.save.length + 1 && solto.save.at(-1).n === 3 && solto.save.at(-1).cena === 'villa-lobos', 'o ponto foi para o save', solto.save.at(-1));
  checar(solto.memorias.includes('vaga-lumes-soltos') && solto.sons.soltarVagaLumes >= 1, 'a memória e o som de soltar', { mem: solto.memorias, som: solto.sons.soltarVagaLumes });
  await fotoNoMundo('v4-rodando', [soltando[0], 0.6, soltando[2]], [1.4, 1.6, 1.4]);
  await foto('v5-de-longe');

  // GUARDAR com um dentro, e a noite acabar: ele é solto do lado das mochilas
  checar(await pegarUm(), 'pegou mais um para guardar');
  const guardar = await ir(await ponto('NO_POTE'));
  checar(/guardar o pote/i.test(guardar), 'com o pote na mão: "Guardar o pote"', guardar);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(500);
  const guardado = await vl();
  checar(!guardado.naMao && guardado.noPote === 1, 'o pote guardado, com o vaga-lume dentro', { naMao: guardado.naMao, noPote: guardado.noPote });
  await page.evaluate(() => window.jogo.debugPlace(-20, 12));
  for (let i = 0; i < 40 && (await vl()).estado !== 'dia'; i++) await page.waitForTimeout(250);
  await page.waitForTimeout(600);
  const deDia = await vl();
  checar(deDia.noPote === 0 && deDia.save.length === solto.save.length + 1 && deDia.save.at(-1).n === 1, 'a noite acabou: o do pote foi solto do lado das mochilas', { noPote: deDia.noPote, save: deDia.save.at(-1) });

  // RECARREGAR: os soltos continuam lá
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => { window.__ganchoDaClareira = null; });
  await cozinha();
  const recarregado = await vl();
  checar(recarregado.soltos === solto.soltos + 1 && recarregado.pontos === solto.pontos + 1, 'recarregou: os soltos continuam lá', { soltos: recarregado.soltos, pontos: recarregado.pontos });
  console.log('vagalumes:', JSON.stringify({ noPote: tres.noPote, soltos: recarregado.soltos, pontos: recarregado.pontos, save: recarregado.save.length }));
}

// ======================================================= olhar as estrelas
if (parte('estrelas')) {
  const ceu = () => page.evaluate(() => {
    const t = window.__ganchoDaClareira;
    const j = window.jogo;
    const c = t.ceu;
    const cam = j.cameraDeCena();
    // o coração na tela: as doze estrelas dele projetadas na câmera de cena
    let naTela = 0;
    if (cam) {
      cam.updateMatrixWorld();
      const lote = c.estrelasDoCoracao;
      lote.updateMatrixWorld();
      const M = lote.matrixWorld.clone();
      const m = M.clone();
      const v = cam.position.clone();
      for (let i = 0; i < lote.count; i++) {
        lote.getMatrixAt(i, m);
        v.set(0, 0, 0).applyMatrix4(m).applyMatrix4(M).project(cam);
        if (Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95 && v.z < 1) naTela++;
      }
    }
    const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
    return {
      estado: t.estado(),
      olhando: t.olhandoOCeu(),
      achado: c.coracaoAchado,
      caindo: c.caindo,
      visivel: c.group.visible,
      naTela,
      deitado: j.player.rig.deitado,
      deLado: j.player.rig.deLado,
      sentado: j.player.riding,
      sons: Object.fromEntries(j.audio.contagem),
      memorias: (save.memories ?? []).map((m) => m.id),
    };
  });
  await cozinha();
  if ((await ceu()).estado !== 'noite') {
    await ir(await ponto('NO_FOGAREIRO'));
    await (await teste()).evaluate((t) => t.anoitecerJa());
    await page.waitForTimeout(400);
  }
  const prompt = await ir(await ponto('NA_CANGA'));
  checar(/olhar as estrelas/i.test(prompt), 'de noite, a canga chama para olhar as estrelas', prompt);
  await page.keyboard.press('KeyE');
  await escolher('Deitar e olhar as estrelas');
  const visto = { achado: 0, naTela: 0, caiu: false, deLado: 0, fotos: new Set(), fim: null };
  const marca = async (nome, ok) => {
    if (ok && !visto.fotos.has(nome)) {
      visto.fotos.add(nome);
      await foto(nome);
    }
  };
  for (let i = 0; i < 1500; i++) {
    const c = await ceu();
    visto.achado = Math.max(visto.achado, c.achado);
    if (c.achado > 0.95) visto.naTela = Math.max(visto.naTela, c.naTela);
    if (c.caindo > 0) visto.caiu = true;
    visto.deLado = Math.max(visto.deLado, c.deLado);
    await marca('e1-deitados', c.olhando && c.deitado && i > 6);
    await marca('e2-o-ceu', c.olhando && c.achado === 0 && visto.fotos.has('e1-deitados') && i > 40);
    await marca('e3-o-coracao', c.achado > 0.97);
    await marca('e4-estrela-cadente', c.caindo > 0.35 && c.caindo < 0.7);
    await marca('e5-o-beijo', c.deLado > 0.95);
    if (visto.fotos.has('e1-deitados') && !c.olhando && !c.sentado) {
      visto.fim = c;
      break;
    }
    await passarUmaFala();
    await page.waitForTimeout(90);
  }
  checar(visto.achado > 0.97 && visto.naTela === 12, 'o coração riscado inteiro, as doze estrelas dentro do quadro', { achado: visto.achado, naTela: visto.naTela });
  checar(visto.caiu, 'a estrela cadente passou');
  checar(visto.deLado > 0.95, 'viraram de frente para o beijo', visto.deLado);
  checar(visto.fim && visto.fim.memorias.includes('estrela-cadente') && visto.fim.sons.estrelaCadente >= 1 && visto.fim.sons.constelacao >= 1,
    'a memória e os sons (o coração e a estrela cadente)', visto.fim && { mem: visto.fim.memorias, sons: [visto.fim.sons.constelacao, visto.fim.sons.estrelaCadente] });
  checar(visto.fim && !visto.fim.visivel && !visto.fim.deitado && visto.fim.achado < 0.05, 'levantaram: o céu de cena guardado e o risco apagado', visto.fim && { visivel: visto.fim.visivel, deitado: visto.fim.deitado, achado: visto.fim.achado });
  console.log('estrelas:', JSON.stringify({ achado: +visto.achado.toFixed(2), naTela: visto.naTela, caiu: visto.caiu, fotos: [...visto.fotos] }));
}

checar(erros.length === 0, 'sem erro de console', erros);
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:\n - ' + falhas.join('\n - '));
  process.exit(1);
}
console.log('tudo certo');
