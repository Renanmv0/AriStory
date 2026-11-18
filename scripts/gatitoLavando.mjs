/**
 * O GATITO LAVANDO O ÔNIBUS (eventos/gatitoLavaOOnibus.ts, pedido do Renan: "de vez em quando o Gatito aparece ao
 * lado do ônibus dizendo que está limpando ele"), no pátio da escola (?cena=escola-patio):
 *  - QUEM: sem conhecer o Gatito, nada (mesmo com ?gatitoLavando); conhecido e com ?semGatitoLavando, nada;
 *    conhecido e com ?gatitoLavando, ele lá;
 *  - O MODELO: em pé no caixote (nada abaixo do tampo), a esponja aparecendo e ENCOSTADA na lataria (na altura da
 *    espuma), a pata fazendo a roda (a esponja anda), as bolhas subindo, o "fsh-fsh" tocando com a dupla perto;
 *  - A CONVERSA: o prompt "Falar com o Gatito", ele para de esfregar e vira para a dupla, as falas da lavagem, a
 *    memória "O ônibus brilhando" e ele de volta à esponja; a segunda conversa é uma fala só;
 *  - as fotos: de longe (a câmera do jogo), de três quartos, de perto e a conversa.
 *
 *   node scripts/gatitoLavando.mjs /tmp/gl
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/gl';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
const ruido = ['favicon', 'fonts.googleapis', 'fonts.gstatic', 'ERR_CONNECTION_RESET', 'ERR_CERT_AUTHORITY_INVALID'];
const erros = [];
const falhas = [];
const conferir = (ok, oque, detalhe = '') => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${oque}${detalhe ? ` (${detalhe})` : ''}`);
  if (!ok) falhas.push(oque);
};
const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });

/** abre o pátio com um save de teste: `conhecido` liga o 'gatito-conhecido' */
const abrir = async (extra, conhecido) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !ruido.some((r) => m.text().includes(r))) erros.push(m.text()); });
  const pronto = () => p.waitForFunction(() => !!window.jogo?.current?.world?.root.userData.onibusEscolarNaEscola && !window.jogo.transitioning, null, { timeout: 120000 });
  await p.goto(`${BASE}/?cena=escola-patio&semHalloween`, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.removeItem('aristory.save.v1'));
  await p.goto(`${BASE}/?cena=escola-patio&semHalloween`, { waitUntil: 'networkidle' });
  await pronto();
  await p.evaluate((sim) => { for (const f of ['escola-aberta', 'luna-na-escola', 'escola-visitada', ...(sim ? ['gatito-conhecido'] : [])]) window.jogo.setFlag(f); }, conhecido);
  await p.goto(`${BASE}/?cena=escola-patio&semHalloween&em=8.6,52.4${extra}`, { waitUntil: 'networkidle' });
  await pronto();
  await p.mouse.click(550, 300);
  await p.waitForTimeout(2500);
  return p;
};
const temGatito = (p) => p.evaluate(() => !!window.jogo.current.world.root.userData.gatitoLavando);

// ============================================================ 1. quem
console.log('\n1. quem aparece');
{
  const p = await abrir('&gatitoLavando', false);
  conferir(!(await temGatito(p)), 'sem conhecer o Gatito, nada de lavagem (mesmo forçada)');
  await p.close();
  const q = await abrir('&semGatitoLavando', true);
  conferir(!(await temGatito(q)), 'conhecido, mas sem sorte (?semGatitoLavando): nada');
  await q.close();
}

// ============================================================ 2. o modelo
console.log('\n2. o Gatito lavando');
const p = await abrir('&gatitoLavando', true);
conferir(await temGatito(p), 'conhecido e com ?gatitoLavando: ele está lá');
const medir = () => p.evaluate(() => {
  const { gatito, face, esponja } = window.jogo.current.world.root.userData.gatitoLavando;
  gatito.group.updateMatrixWorld(true);
  const caixa = new (window.jogo.scene.position.constructor)();
  let pe = Infinity, temEsponja = false;
  gatito.group.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    let vis = true;
    for (let a = o; a; a = a.parent) if (!a.visible) vis = false;
    if (!vis) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 3) {
      caixa.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      pe = Math.min(pe, caixa.y);
    }
  });
  gatito.group.traverse((o) => { if (o.isGroup && o.children.some((c) => c.geometry?.type === 'RoundedBoxGeometry')) temEsponja = o.visible; });
  return { pe, face, esponja: esponja.toArray(), esfregando: gatito.esfregando, temEsponja, rot: gatito.group.rotation.y, conta: window.jogo.audio.contagem.get('esfrega') ?? 0 };
});
// (o navegador do teste anda a ~1/10 do relógio: espera a pose assentar no relógio do JOGO)
await p.waitForFunction(() => window.jogo.elapsed > 3.5, null, { timeout: 300000 });
const a = await medir();
await p.waitForTimeout(700);
const b = await medir();
console.log('      ', JSON.stringify(a));
conferir(a.pe > 0.4, `em pé no caixote: nada dele abaixo do tampo (o pé em ${a.pe.toFixed(3)})`);
conferir(a.esfregando && a.temEsponja, 'esfregando, com a esponja na pata');
const folga = Math.min(a.esponja[2], b.esponja[2]) - a.face;
conferir(folga > -0.04 && folga < 0.1, `a esponja encosta na lataria (a ${(folga * 100).toFixed(1)} cm dela)`);
conferir(a.esponja[1] > 1.15 && a.esponja[1] < 1.6, `na altura da espuma (${a.esponja[1].toFixed(2)} m)`);
const anda = Math.hypot(a.esponja[0] - b.esponja[0], a.esponja[1] - b.esponja[1]);
conferir(anda > 0.01, `a esponja anda em roda (${(anda * 100).toFixed(1)} cm em 0,7 s)`);
const c = await medir();
conferir(c.conta > 0, `o "fsh-fsh" da esponja toca com a dupla perto (${c.conta})`);

// as fotos
await p.screenshot({ path: `${OUT}-iso.png` });
const foto = async (de, para, nome) => {
  await p.evaluate(([d, q]) => {
    const { gatito } = window.jogo.current.world.root.userData.gatitoLavando;
    const o = gatito.group.position;
    const V = window.jogo.scene.position.constructor;
    window.jogo.setCameraOmbro(new V(o.x + d[0], d[1], o.z + d[2]), new V(o.x + q[0], q[1], o.z + q[2]));
  }, [de, para]);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${OUT}-${nome}.png` });
};
await foto([4.2, 2.6, 5.2], [0, 0.9, -0.4], 'tres-quartos');
await foto([1.4, 1.25, 1.6], [0, 0.85, -0.25], 'perto');
await foto([-1.6, 1.1, 1.3], [0, 0.85, -0.25], 'perto-do-outro-lado');
await p.evaluate(() => window.jogo.setCameraOmbro(null));
await p.waitForTimeout(800);

// ============================================================ 3. a conversa
console.log('\n3. a conversa');
/** passa as falas; numa pergunta, responde pelo `escolher(opções)` (o índice) e anota a pergunta */
const conversar = async (max = 40, escolher = () => 1) => {
  const falas = [];
  for (let i = 0; i < max; i++) {
    await p.waitForTimeout(100);
    const opcoes = await p.evaluate(() => [...document.querySelectorAll('.escolhas.show button')].map((b) => b.textContent ?? ''));
    if (opcoes.length) {
      await p.waitForTimeout(900);
      const pergunta = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
      const k = escolher(opcoes, pergunta);
      falas.push(`? ${pergunta} [${opcoes.join(' / ')}] -> ${opcoes[k]}`);
      await p.evaluate((k) => document.querySelectorAll('.escolhas.show button')[k].click(), k);
      await p.waitForTimeout(400);
      continue;
    }
    if (!(await p.locator('.dialogue.show').count())) {
      await p.waitForTimeout(500);
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
const chegarPerto = async () => {
  await p.evaluate(() => {
    const { gatito, face } = window.jogo.current.world.root.userData.gatitoLavando;
    window.jogo.debugPlace(gatito.group.position.x + 0.5, face + 1.3, Math.PI + 0.3);
  });
  for (let i = 0; i < 20; i++) {
    if (/Gatito/.test(await p.evaluate(() => document.querySelector('.prompt.show .label')?.textContent ?? ''))) return true;
    await p.waitForTimeout(150);
  }
  return false;
};
conferir(await chegarPerto(), 'perto dele, o prompt é "Falar com o Gatito"');
await p.keyboard.press('KeyE');
await p.waitForTimeout(1600);
const durante = await medir();
conferir(!durante.esfregando, 'na conversa ele larga a esponja');
conferir(Math.abs(Math.cos(durante.rot) - Math.cos(Math.PI)) > 0.05 || Math.abs(Math.sin(durante.rot)) > 0.1, `e vira para a dupla (giro ${durante.rot.toFixed(2)})`);
await p.screenshot({ path: `${OUT}-conversa.png` });
const primeira = await conversar(60);
console.log('      ' + primeira.join('\n      '));
conferir(primeira.some((f) => /^Gatito: .*banho no ônibus/.test(f)), 'ele conta que está dando banho no ônibus');
// (a pergunta pode estar ainda sendo escrita quando as opções aparecem: quem diz que é o convite são as opções)
conferir(primeira.some((f) => /^\? .*\[Bora ajudar! \/ Agora não\] -> Agora não$/.test(f)), 'e convida a ajudar (respondemos "Agora não")');
await p.waitForTimeout(3500);
const depois = await p.evaluate(() => (JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}').memories ?? []).some((m) => m.id === 'gatito-lavando-o-onibus'));
conferir(depois, 'a memória "O ônibus brilhando"');
const voltou = await medir();
conferir(voltou.esfregando, 'e ele volta a esfregar');
await p.waitForTimeout(800);
conferir(await chegarPerto(), 'dá para falar de novo');
await p.keyboard.press('KeyE');
await p.waitForTimeout(800);
const segunda = await conversar(14);
console.log('      ' + segunda.join('\n      '));
conferir(segunda.filter((f) => f.startsWith('Gatito:')).length === 2 && !segunda.some((f) => /banho no ônibus dos Gatitos/.test(f)), 'na segunda vez, uma fala curta e o convite (sem se apresentar de novo)');

// ============================================================ 4. o mutirão
console.log('\n4. o mutirão: Renan na mangueira, Ari na esponja');
await p.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 2; });
const carteiraAntes = await p.evaluate(() => window.jogo.carteira());
conferir(await chegarPerto(), 'o prompt de novo');
await p.keyboard.press('KeyE');
await p.waitForTimeout(800);
const estado = () => p.evaluate(() => {
  const u = window.jogo.current.world.root.userData.gatitoLavando;
  const d = u.mutirao;
  const V = window.jogo.scene.position.constructor;
  const pos = (o) => (o ? o.getWorldPosition(new V()).toArray() : null);
  const save = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  return {
    fase: d.fase, face: u.face, gatito: u.gatito.group.position.toArray(), sacudindo: u.gatito.sacudindo,
    esponja: pos(d.esponja), pistola: pos(d.pistola), mancha: d.mancha ? d.mancha.scale.x : null,
    jato: d.jato ? { ligado: d.jato.ligado, alvo: d.jato.alvo.toArray(), chegou: d.jato.chegou } : null,
    arco: d.arco ? { visivel: d.arco.malha.visible, conta: d.arco.malha.geometry.drawRange.count } : null,
    mao: { ari: !!window.jogo.objetoNaMao?.('ari'), renan: !!window.jogo.objetoNaMao?.('renan') },
    memoria: (save.memories ?? []).some((m) => m.id === 'mutirao-da-lavagem'),
    jogador: window.jogo.playerPosition().toArray(),
  };
});
const vistos = {};
let maiorMancha = 0, menorMancha = 9, alvoNoGatito = Infinity, maiorArco = 0, viuSacudida = false, esponjaNaLataria = Infinity, esponjaAltura = 0;
const falasDoMutirao = [];
const t0 = Date.now();
while (Date.now() - t0 < 600000) {
  const e = await estado();
  if (!vistos[e.fase]) {
    vistos[e.fase] = true;
    console.log(`      fase: ${e.fase}`);
  }
  if (e.fase === 'esfregando' && e.esponja) {
    esponjaNaLataria = Math.min(esponjaNaLataria, Math.abs(e.esponja[2] - e.face));
    esponjaAltura = e.esponja[1];
    maiorMancha = Math.max(maiorMancha, e.mancha ?? 0);
    if (!vistos.fotoEsfregando && (e.mancha ?? 0) > 0.6) { vistos.fotoEsfregando = true; await p.screenshot({ path: `${OUT}-mutirao-1-esfregando.png` }); }
  }
  if (e.fase === 'enxaguando' && e.jato?.chegou) {
    if (!vistos.fotoEnxague && (e.mancha ?? 1) < 0.7) { vistos.fotoEnxague = true; await p.screenshot({ path: `${OUT}-mutirao-2-enxaguando.png` }); }
  }
  if (e.fase === 'pegadinha' && e.jato) {
    menorMancha = Math.min(menorMancha, e.mancha ?? 9);
    const d = Math.hypot(e.jato.alvo[0] - e.gatito[0], e.jato.alvo[2] - e.gatito[2]);
    alvoNoGatito = Math.min(alvoNoGatito, d);
    if (!vistos.fotoPegadinha && d < 0.2 && e.jato.ligado) { vistos.fotoPegadinha = true; await p.waitForTimeout(300); await p.screenshot({ path: `${OUT}-mutirao-3-pegadinha.png` }); }
  }
  if (e.sacudindo) {
    viuSacudida = true;
    if (!vistos.fotoSacudida) { vistos.fotoSacudida = true; await p.screenshot({ path: `${OUT}-mutirao-4-sacudida.png` }); }
  }
  if (e.arco) maiorArco = Math.max(maiorArco, e.arco.conta);
  if (e.fase === 'arco-iris' && e.arco?.conta > 0 && !vistos.fotoArco && e.arco.conta >= 64 * 36) {
    vistos.fotoArco = true;
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}-mutirao-5-arco-iris.png` });
  }
  if (e.fase === 'fim') break;
  // as falas e as perguntas: a mangueira fica com o Renan (a segunda opção)
  const opcoes = await p.evaluate(() => [...document.querySelectorAll('.escolhas.show button')].map((b) => b.textContent ?? ''));
  if (opcoes.length) {
    const pergunta = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    // (a pergunta ainda pode estar sendo escrita: quem decide é a opção)
    const k = opcoes.includes('Renan') ? opcoes.indexOf('Renan') : 0;
    falasDoMutirao.push(`? ${pergunta} -> ${opcoes[k]}`);
    await p.evaluate((k) => document.querySelectorAll('.escolhas.show button')[k].click(), k);
    await p.waitForTimeout(300);
    continue;
  }
  if (await p.locator('.dialogue.show').count()) {
    await p.waitForTimeout(600);
    const quem = await p.evaluate(() => document.querySelector('.dialogue .who')?.textContent ?? '');
    const t = await p.evaluate(() => document.querySelector('.dialogue .text')?.textContent ?? '');
    if (t && falasDoMutirao[falasDoMutirao.length - 1] !== `${quem}: ${t}`) falasDoMutirao.push(`${quem}: ${t}`);
    if (!vistos[`foto-${falasDoMutirao.length}`] && /Eu sou gato/.test(t)) { vistos[`foto-${falasDoMutirao.length}`] = true; await p.screenshot({ path: `${OUT}-mutirao-3b-miau.png` }); }
    await p.keyboard.press('KeyE');
    await p.waitForTimeout(200);
  } else {
    await p.waitForTimeout(250);
  }
}
console.log('      ' + falasDoMutirao.join('\n      '));
const fim = await estado();
conferir(['esfregando', 'enxaguando', 'pegadinha', 'sacudida', 'arco-iris', 'fim'].every((f) => vistos[f]), 'as fases todas, na ordem do roteiro', Object.keys(vistos).filter((k) => !k.startsWith('foto')).join(' → '));
conferir(esponjaNaLataria < 0.2, `a esponja de quem ajuda encosta na lataria (a ${(esponjaNaLataria * 100).toFixed(0)} cm, na altura ${esponjaAltura.toFixed(2)} m)`);
conferir(maiorMancha > 0.9, `a espuma cresce esfregando (${maiorMancha.toFixed(2)})`);
conferir(menorMancha < 0.05, `e o jato a enxágua (${menorMancha.toFixed(2)})`);
conferir(alvoNoGatito < 0.15, `o jato escorrega e pega o Gatito (${alvoNoGatito.toFixed(2)} m dele)`);
conferir(viuSacudida, 'a sacudida de gato molhado');
conferir(maiorArco >= 64 * 36, `o arco-íris se desenha inteiro (${maiorArco} índices)`);
conferir(falasDoMutirao.some((f) => /Renan: A mangueira é minha/.test(f)) && falasDoMutirao.some((f) => /Ari: Então eu fico com a esponja/.test(f)), 'quem escolhemos pega a mangueira, e o outro a esponja');
conferir(fim.memoria, 'a memória "Banho de mangueira"');
const carteiraDepois = await p.evaluate(() => window.jogo.carteira());
conferir(carteiraDepois - carteiraAntes === 200, `a recompensa do Gatito: R$ 200 na carteira (${carteiraAntes} → ${carteiraDepois})`);
conferir(falasDoMutirao.some((f) => /^Gatito: E serviço bem feito se paga/.test(f)), 'e ele fala da recompensa');
conferir(!fim.mao.ari && !fim.mao.renan, 'no fim as mãos vazias (a esponja e a pistola voltaram)');
await p.waitForTimeout(1500);
const depoisDoMutirao = await medir();
conferir(depoisDoMutirao.esfregando, 'e o Gatito de volta à esponja');
await p.screenshot({ path: `${OUT}-mutirao-6-depois.png` });

const peso = await p.evaluate(() => window.jogo.renderer.info.render);
console.log(`\n   peso: ${peso.calls} desenhos, ${peso.triangles} triângulos`);
conferir(erros.length === 0, 'sem erros de console', erros.slice(0, 3).join(' | '));
await browser.close();
console.log(falhas.length ? `\nFALHOU: ${falhas.join('; ')}` : '\nO Gatito está lavando o ônibus.');
process.exit(falhas.length ? 1 : 0);
