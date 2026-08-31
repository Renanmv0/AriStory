/**
 * Guarda-roupa modular — a base invisível.
 *
 * O que este teste guarda, na ordem em que importa:
 *
 * 1. ESTABILIDADE DA ANIMAÇÃO. Vestir não pode mexer em pivô: a amplitude e a
 *    cadência da caminhada têm que ser as MESMAS antes e depois, e os pivôs
 *    têm que continuar na mesma posição com a mesma contagem de filhos. É o que
 *    prova que nenhum membro foi recriado.
 * 2. MODO PARALELO. Com peças vestidas, o `setOutfit('banho')` continua
 *    funcionando e o `setOutfit('normal')` devolve a cor da PEÇA, não a da
 *    ficha. É o cenário que quebraria se o guarda-roupa escrevesse material
 *    direto em vez de passar pelo resolvedor.
 * 3. SEM PEÇA, NADA MUDOU. Save de hoje tem que renderizar idêntico ao de
 *    antes do experimento.
 * 4. CONVIVÊNCIA com os patins e o chapéu de campeão, que não passam por aqui.
 * 5. ESTADO POR PESSOA e persistência no localStorage.
 * 6. O VESTIDO nasce no CORPO, não no pescoço — a peça que forçou a liberação
 *    de geometria no tronco, e a que provaria o contrário se o mapa de pais
 *    voltasse a mandar tudo para a cabeça.
 *
 * Uso: node scripts/roupas.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './roupas';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const PECAS = ['gorro-la', 'camisa-listrada', 'calca-jeans', 'bota-amarela'];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=-4,20&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

/**
 * As cores dos 7 materiais que a roupa pode pintar, lidas do corpo de verdade.
 * `trocaMaterial` é privado em TS mas existe em runtime — é a lista canônica,
 * e ler dela é justamente o que prova que o resolvedor escreveu certo.
 */
const cores = (quem) =>
  page.evaluate((q) => {
    const j = window.jogo;
    const rig = j.player.rig.spec.id === q ? j.player.rig : j.parceiro.rig;
    const por = {};
    for (const t of rig.trocaMaterial) {
      (por[`${t.slot}:${t.parte}`] ??= []).push('#' + t.mesh.material.color.getHexString());
    }
    // um valor por chave: os dois lados do corpo têm que estar sempre iguais
    const flat = {};
    for (const [k, v] of Object.entries(por)) flat[k] = [...new Set(v)].join('/');
    return flat;
  }, quem);

/** As peças de acervo visíveis no corpo, pela etiqueta userData.roupa. */
const vestindo = (quem) =>
  page.evaluate((q) => {
    const j = window.jogo;
    const rig = j.player.rig.spec.id === q ? j.player.rig : j.parceiro.rig;
    const ids = [];
    rig.group.traverse((o) => {
      if (o.userData?.roupa && o.visible && o.parent?.visible !== false) ids.push(o.userData.roupa);
    });
    return ids.sort();
  }, quem);

/** A forma do esqueleto: se algum destes números mudar, um pivô foi mexido. */
const esqueleto = () =>
  page.evaluate(() => {
    const rig = window.jogo.player.rig;
    const p = (g) => [+g.position.x.toFixed(4), +g.position.y.toFixed(4), +g.position.z.toFixed(4)];
    return {
      legL: p(rig.legL), legR: p(rig.legR),
      armL: p(rig.armL), armR: p(rig.armR),
      // os filhos dos pivôs: perna + pé + patins (+ bota, quando vestida)
      filhos: [rig.legL.children.length, rig.armL.children.length],
    };
  });

/**
 * Amplitude e cadência da caminhada, medidas no corpo.
 *
 * Anda para a frente segurando W e amostra a rotação da perna e do braço. Em
 * headless o jogo roda a ~7 fps com o dt travado, então a cadência sai em
 * ciclos por segundo de RELÓGIO — o que importa é ela ser a mesma nas duas
 * medições, não o valor absoluto.
 */
const andar = async () => {
  await page.keyboard.down('KeyW');
  const dados = await page.evaluate(
    () =>
      new Promise((ok) => {
        const rig = window.jogo.player.rig;
        const perna = [];
        const braco = [];
        const t0 = performance.now();
        const passo = () => {
          const t = (performance.now() - t0) / 1000;
          perna.push(rig.legL.rotation.x);
          braco.push(rig.armL.rotation.x);
          if (t > 5) ok({ perna, braco, dur: t });
          else requestAnimationFrame(passo);
        };
        passo();
      }),
  );
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(400);

  const medir = (vals) => {
    const alto = Math.max(...vals);
    const baixo = Math.min(...vals);
    const meio = (alto + baixo) / 2;
    let viradas = 0;
    for (let i = 1; i < vals.length; i++) {
      const a = vals[i - 1] - meio;
      const b = vals[i] - meio;
      if ((a <= 0 && b > 0) || (a >= 0 && b < 0)) viradas++;
    }
    return { amplitude: (alto - baixo) / 2, ciclos: viradas / 2 / dados.dur };
  };
  return { perna: medir(dados.perna), braco: medir(dados.braco) };
};

// ---------------------------------------------------------------- 3. sem peça
const semPecaNormal = await cores('ari');
await page.evaluate(() => window.jogo.setOutfit('banho'));
await page.waitForTimeout(400);
const semPecaBanho = await cores('ari');
await page.evaluate(() => window.jogo.setOutfit('normal'));
await page.waitForTimeout(400);
const voltouIgual = JSON.stringify(await cores('ari')) === JSON.stringify(semPecaNormal);
// no banho tudo vira pele: as 4 chaves têm que ter a MESMA cor
const peleUnica = new Set(Object.values(semPecaBanho)).size === 1;

// ------------------------------------------------- 1. animação: antes de vestir
const esqueletoAntes = await esqueleto();
const andarAntes = await andar();

// ----------------------------------------------------------------- vestir tudo
// As peças são ITENS: vestir é pôr na vaga de vestimenta do inventário. Não há
// acervo separado nem `wearClothing` — foi essa unificação que o guarda-roupa
// ganhou quando peça de roupa virou item de verdade.
const vestiu = await page.evaluate((ids) => {
  const j = window.jogo;
  const cat = window.aristoryItens;
  return ids.map((id) => j.equipWearable(cat[id], 'ari'));
}, PECAS);
await page.waitForTimeout(700);

const loadout = await page.evaluate(() => window.jogo.wearables('ari').map((i) => i?.id ?? null));
const comPeca = await cores('ari');
const noCorpo = await vestindo('ari');

// -------------------------------------------------- 1. animação: depois de vestir
const esqueletoDepois = await esqueleto();
const andarDepois = await andar();
await page.screenshot({ path: `${OUT}-vestido.png` });

// -------------------------------------------------------------- 2. modo paralelo
await page.evaluate(() => window.jogo.setOutfit('banho'));
await page.waitForTimeout(500);
const banhoComPeca = await cores('ari');
const banhoNoCorpo = await vestindo('ari');
await page.screenshot({ path: `${OUT}-banho.png` });
await page.evaluate(() => window.jogo.setOutfit('normal'));
await page.waitForTimeout(500);
const voltouComPeca = JSON.stringify(await cores('ari')) === JSON.stringify(comPeca);

// -------------------------------------------------------- 4. convivência: patins
await page.evaluate(() => {
  const j = window.jogo;
  // a bota sai primeiro: patins e bota são os dois do slot dos PÉS, e a vaga é
  // uma só — é justamente essa exclusividade que as vagas tipadas garantem
  j.removeItem('bota-amarela', 'ari');
  j.equipWearable(window.aristoryItens['patins'], 'ari');
});
await page.waitForTimeout(600);
const comPatins = await vestindo('ari');
await page.evaluate(() => {
  const j = window.jogo;
  j.removeItem('patins', 'ari');
  j.equipWearable(window.aristoryItens['bota-amarela'], 'ari');
});
await page.waitForTimeout(600);
const semPatins = await vestindo('ari');

// -------------------------------------------------- 5. estado por pessoa e save
const doRenanAntes = await vestindo('renan');
await page.keyboard.press('KeyT');
await page.waitForTimeout(1200);
const depoisDoT = { ari: await vestindo('ari'), renan: await vestindo('renan') };

await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const depoisDoReload = await page.evaluate(() => ({
  ari: window.jogo.wearables('ari').map((i) => i?.id ?? null),
  renan: window.jogo.wearables('renan').map((i) => i?.id ?? null),
}));

// ------------------------------------------- 6. o vestido: geometria no TRONCO
//
// A peça que forçou a liberação de geometria no tronco. O que se guarda aqui é
// que ela nasceu no lugar certo do esqueleto: antes, o mapa de pais era um
// ternário de duas vias e TUDO que não fosse `pes` caía na cabeça — um vestido
// teria nascido no pescoço e ninguém veria até a foto.
await page.evaluate(() => {
  const j = window.jogo;
  const cat = window.aristoryItens;
  // tira o que está nas vagas de cabeça e tronco para o vestido caber
  j.removeItem('gorro-la', 'ari');
  j.removeItem('camisa-listrada', 'ari');
  j.equipWearable(cat['vestido-rosa'], 'ari');
  j.equipWearable(cat['gargantilha-laco'], 'ari');
});
await page.waitForTimeout(900);

const vestido = await page.evaluate(() => {
  const rig = window.jogo.player.rig;
  const conta = (raiz, id) => {
    let n = 0;
    raiz.traverse((o) => { if (o.userData?.roupa === id) n++; });
    return n;
  };
  const cor = (slot, parte) => [...new Set(
    rig.trocaMaterial.filter((t) => t.slot === slot && t.parte === parte)
      .map((t) => '#' + t.mesh.material.color.getHexString()),
  )].join('/');
  return {
    // a cabeça é filha do corpo, então a saia contada no corpo desconta a cabeça
    saiaNoCorpo: conta(rig.body, 'vestido-rosa') - conta(rig.head, 'vestido-rosa'),
    saiaNaCabeca: conta(rig.head, 'vestido-rosa'),
    gargantilhaNaCabeca: conta(rig.head, 'gargantilha-laco'),
    pele: '#' + rig.spec.skin.toString(16),
    torso: cor('tronco', 'principal'),
    manga: cor('tronco', 'detalhe'),
    pernas: cor('pernas', 'principal'),
    // o laço e o cinto da ficha do Ari não podem flutuar sobre o vestido
    fichaVisivel: rig.sobreTronco.filter((o) => o.visible).length,
  };
});
await page.screenshot({ path: `${OUT}-o-vestido.png` });

// no banho o vestido some e a gargantilha fica, a mesma regra do gorro
await page.evaluate(() => window.jogo.setOutfit('banho'));
await page.waitForTimeout(600);
const vestidoNoBanho = await vestindo('ari');
await page.evaluate(() => window.jogo.setOutfit('normal'));
await page.waitForTimeout(600);

// ------------------------------------------------------------------- relatório
const perto = (a, b, tol) => Math.abs(a - b) <= tol;
/**
 * A AMPLITUDE é o sinal; a cadência é quase só ruído.
 *
 * A amplitude sai de máximo menos mínimo e é estável em duas casas (0.611 vs
 * 0.612 numa rodada real). A cadência conta cruzamentos de zero em ~5 s de
 * relógio a uns 7 fps irregulares, então ela varia sozinha de rodada para
 * rodada — uma tolerância apertada aqui reprova o teste por casa decimal, não
 * por regressão. Ela vira uma banda larga, que ainda pega o que importa: a
 * passada dobrar ou cair pela metade, que foi o bug real dos patins.
 */
const mesmaAnim =
  perto(andarAntes.perna.amplitude, andarDepois.perna.amplitude, 0.03) &&
  perto(andarAntes.braco.amplitude, andarDepois.braco.amplitude, 0.03) &&
  andarDepois.perna.ciclos > andarAntes.perna.ciclos * 0.5 &&
  andarDepois.perna.ciclos < andarAntes.perna.ciclos * 2;
const mesmoEsqueleto =
  JSON.stringify(esqueletoAntes.legL) === JSON.stringify(esqueletoDepois.legL) &&
  JSON.stringify(esqueletoAntes.legR) === JSON.stringify(esqueletoDepois.legR) &&
  JSON.stringify(esqueletoAntes.armL) === JSON.stringify(esqueletoDepois.armL) &&
  JSON.stringify(esqueletoAntes.armR) === JSON.stringify(esqueletoDepois.armR);

console.log('— sem peça nenhuma');
console.log('  normal:', JSON.stringify(semPecaNormal));
console.log('  banho vira pele única:', peleUnica, '· voltou igual:', voltouIgual);
console.log('— vestindo');
console.log('  equipWearable:', JSON.stringify(vestiu), '· vagas:', JSON.stringify(loadout));
console.log('  cores:', JSON.stringify(comPeca));
console.log('  geometria no corpo:', JSON.stringify(noCorpo));
console.log('— animação (o ponto)');
console.log('  perna antes:', andarAntes.perna.amplitude.toFixed(3), 'rad ·',
  andarAntes.perna.ciclos.toFixed(2), 'ciclos/s');
console.log('  perna depois:', andarDepois.perna.amplitude.toFixed(3), 'rad ·',
  andarDepois.perna.ciclos.toFixed(2), 'ciclos/s');
console.log('  braço antes:', andarAntes.braco.amplitude.toFixed(3),
  '· depois:', andarDepois.braco.amplitude.toFixed(3));
console.log('  pivôs intactos:', mesmoEsqueleto,
  '· filhos', JSON.stringify(esqueletoAntes.filhos), '→', JSON.stringify(esqueletoDepois.filhos));
console.log('— modo paralelo');
console.log('  no banho:', JSON.stringify(banhoComPeca));
console.log('  no banho, no corpo:', JSON.stringify(banhoNoCorpo), '(só o gorro)');
console.log('  voltou para a peça, não para a ficha:', voltouComPeca);
console.log('— convivência');
console.log('  com patins:', JSON.stringify(comPatins), '· de bota de novo:', JSON.stringify(semPatins));
console.log('— por pessoa e save');
console.log('  Renan antes:', JSON.stringify(doRenanAntes), '· depois do T:', JSON.stringify(depoisDoT));
console.log('  depois do reload:', JSON.stringify(depoisDoReload));
console.log('— o vestido');
console.log('  saia no corpo:', vestido.saiaNoCorpo, '· na cabeça:', vestido.saiaNaCabeca, '(tem que ser 0)');
console.log('  gargantilha na cabeça:', vestido.gargantilhaNaCabeca);
console.log('  torso:', vestido.torso, '· manga:', vestido.manga, '· pernas:', vestido.pernas,
  '· pele:', vestido.pele);
console.log('  laço/cinto da ficha visíveis:', vestido.fichaVisivel, '(tem que ser 0)');
console.log('  no banho, no corpo:', JSON.stringify(vestidoNoBanho), '(só a gargantilha)');
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const ok =
  !erros.length &&
  // 3. sem peça, nada mudou
  peleUnica && voltouIgual &&
  // vestir funcionou
  vestiu.every(Boolean) &&
  loadout.filter(Boolean).length === 4 &&
  noCorpo.join() === 'bota-amarela,bota-amarela,gorro-la' &&
  comPeca['tronco:principal'] === '#4a7fe0' &&
  comPeca['tronco:detalhe'] === '#f3f1ec' &&
  comPeca['pernas:principal'] === '#3f5a86' &&
  comPeca['pes:principal'] === '#ffc94d' &&
  // 1. animação intacta
  mesmaAnim && mesmoEsqueleto &&
  // 2. modo paralelo: banho vence no corpo, gorro fica
  new Set(Object.values(banhoComPeca)).size === 1 &&
  banhoNoCorpo.join() === 'gorro-la' &&
  voltouComPeca &&
  // 4. patins engolem a bota e devolvem depois
  comPatins.join() === 'gorro-la' &&
  // 5. a roupa é do CORPO, não de "o jogador": depois do T o Ari continua
  // vestido mesmo tendo virado o parceiro, e o Renan continua sem nada
  doRenanAntes.length === 0 &&
  depoisDoT.ari.join() === 'bota-amarela,bota-amarela,gorro-la' &&
  depoisDoT.renan.length === 0 &&
  // a bota virou patins lá em cima, então voltam 3 peças + patins
  depoisDoReload.ari.filter(Boolean).length === 4 &&
  depoisDoReload.renan.filter(Boolean).length === 0 &&
  // 6. o vestido nasceu no CORPO, não no pescoço — é o que prova o mapa de
  // pais de 3 vias; a gargantilha continua na cabeça
  vestido.saiaNoCorpo === 1 && vestido.saiaNaCabeca === 0 &&
  vestido.gargantilhaNaCabeca === 1 &&
  // vestido sem manga e de perna de fora: as duas viram PELE, o torso fica rosa
  vestido.torso === '#f6d3d8' &&
  vestido.manga === vestido.pele &&
  vestido.pernas === vestido.pele &&
  // e o laço preto e o cinto de estrela do Ari somem por baixo dele
  vestido.fichaVisivel === 0 &&
  // no banho o vestido some e a gargantilha fica
  vestidoNoBanho.join() === 'gargantilha-laco';

await browser.close();
process.exit(ok ? 0 : 1);
