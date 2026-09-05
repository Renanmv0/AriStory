/**
 * Itens de verdade: mochila por pessoa, auto-stash, arrastar e as poses.
 *
 * A parte que este teste existe para provar é a POSSE: o sorvete de morango
 * tem que estar na mochila do Ari e o de maracujá na do Renan, e o modelo tem
 * que ficar na mão certa mesmo depois do T. O resto (arrastar, encher a
 * mochila, o frisbee guardado não voar) vem junto.
 *
 * Uso: node scripts/itens.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './itens';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/?cena=villa-lobos&em=12,22.4&olhar=3.14`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

/** o que cada um tem, e o que cada RIG está de fato segurando no mundo */
const estado = () =>
  page.evaluate(() => {
    const j = window.jogo;
    const mao = (quem) => j.getActiveHandItem(quem)?.id ?? null;
    const segurando = (rig) => {
      let achou = null;
      rig.group.traverse((o) => {
        if (!achou && o.userData?.item) achou = o.userData.item;
      });
      return achou;
    };
    return {
      controlando: j.playerId(),
      maoAri: mao('ari'),
      maoRenan: mao('renan'),
      rigDoJogador: [j.player.rig.spec.id, segurando(j.player.rig)],
      rigDoParceiro: [j.parceiro.rig.spec.id, segurando(j.parceiro.rig)],
    };
  });

// ------------------------------------------------------------- a compra
await page.keyboard.press('KeyE');
await page.waitForTimeout(600);
for (let i = 0; i < 6; i++) {
  if (!(await page.locator('.dialogue.show').count())) break;
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(600);
}
await page.waitForTimeout(1200);

// De FRENTE para a câmera, não de costas: a pose `upright` estica o braço
// para a frente, e de costas o braço esticado fica escondido atrás do corpo.
const enquadrar = () =>
  page.evaluate(() => {
    window.jogo.iso.setViewSize(3.4);
    window.jogo.player.rig.setFacing(window.jogo.iso.angle);
  });
await enquadrar();
await page.waitForTimeout(1400);

const comprou = await estado();
await page.screenshot({ path: `${OUT}-sorvetes.png` });

await page.keyboard.press('KeyT');
await page.waitForTimeout(1200);
await enquadrar();
await page.waitForTimeout(1400);
const trocado = await estado();
await page.screenshot({ path: `${OUT}-depois-do-T.png` });

// -------------------------------------------------------- o auto-stash
const cascata = await page.evaluate(() => {
  const j = window.jogo;
  const quem = j.playerId();
  const enche = [];
  // A mão já tem o sorvete; os próximos vão para as vagas seguintes. O laço
  // conta as vagas em vez de cravar um número: a mochila cresceu de 5 para 10
  // e o que este teste guarda é o COMPORTAMENTO — enche tudo, depois recusa.
  const vagas = j.handItems(quem).length;
  for (let i = 0; i < vagas; i++) {
    enche.push(j.addItem({ id: `teste-${i}`, nome: `Teste ${i}`, icone: '📦', tipo: 'mao' }, quem));
  }
  return { enche, vagas, maos: j.handItems(quem).map((x) => x?.id ?? null) };
});

// ---------------------------------------------------------- arrastar
await page.keyboard.press('KeyI');
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}-mochila.png` });

const arrastou = await page.evaluate(() => {
  const j = window.jogo;
  const quem = j.playerId();
  // veste um acessório e depois manda ele de volta para uma vaga de mão vazia,
  // que é o caso de uso que o Renan pediu: desequipar e guardar
  j.equipWearable(window.aristoryItens['patins'], quem);
  j.removeItem('teste-3', quem); // abre uma vaga na mão
  const vagaLivre = j.handItems(quem).findIndex((x) => x === null);
  // os patins moram na vaga dos PÉS, que é a 3 — as 4 vagas são as 4 partes
  const dosPes = j.wearables(quem).findIndex((x) => x?.id === 'patins');
  const ok = j.moveItem({ lista: 'vestivel', indice: dosPes }, { lista: 'mao', indice: vagaLivre }, quem);
  return {
    ok,
    vagaLivre,
    naMao: j.handItems(quem).map((x) => x?.id ?? null),
    vestindo: j.wearables(quem).map((x) => x?.id ?? null),
    tipoDepois: j.handItems(quem)[vagaLivre]?.tipo ?? null,
  };
});
await page.screenshot({ path: `${OUT}-desequipado.png` });

// ------------------------------------------------------- o frisbee
// Entrar na quadra é PEGAR o disco, e pegar passa pelo auto-stash. Com a
// mochila cheia a quadra não arma.
//
// Quem enche é o ARI: o reload volta o controle para ele, e a mochila que
// importa é sempre a de quem está andando.
await page.evaluate(() => {
  const j = window.jogo;
  // enche ATÉ o fim em vez de contar até um número: a mochila já cresceu de 5
  // para 10, e um 5 cravado aqui deixaria de encher sem ninguém perceber
  for (let i = 0; i < j.handItems('ari').length; i++) {
    j.addItem({ id: `entulho-${i}`, nome: `Entulho ${i}`, icone: '📦', tipo: 'mao' }, 'ari');
  }
});
await page.goto(`${BASE}/?cena=villa-lobos&em=18,-4.5&olhar=0.785`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
const comMochilaCheia = await page.evaluate(() => window.jogo.hasItem('frisbee'));

// abre uma vaga e volta: agora ele entra
await page.evaluate(() => {
  const j = window.jogo;
  const quem = j.playerId();
  // esvazia TUDO, inclusive o sorvete da vaga principal: com a mão livre o
  // frisbee tem que ir direto para ela, e não para o fundo da mochila
  for (const i of j.handItems(quem)) if (i) j.removeItem(i.id, quem);
  j.setActiveHandSlot(0, quem);
});
await page.goto(`${BASE}/?cena=villa-lobos&em=18,-4.5&olhar=0.785`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
const comVaga = await page.evaluate(() => ({
  tem: window.jogo.hasItem('frisbee'),
  naMao: window.jogo.getActiveHandItem()?.id ?? null,
}));
await enquadrar();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}-frisbee.png` });

// -------------------------------- o chapéu salvo pela versão antiga
// A versão que reescrevia o `tipo` ao mover de lista deixava o chapéu gravado
// como item de MÃO. Carregado hoje, quem manda na categoria é o CATÁLOGO — e,
// como roupa cosmética não mora mais em vaga de mão, a peça não some nem fica
// presa: ela é resgatada para o guarda-roupa, de onde dá para vestir.
await page.evaluate(() => {
  const cru = JSON.parse(localStorage.getItem('aristory.save.v1') ?? '{}');
  cru.inventarios = cru.inventarios ?? {};
  cru.inventarios.ari = {
    ativo: 0,
    // repare no `tipo: 'mao'`: é exatamente o dado estragado
    mao: [{ id: 'chapeu-ping-pong', nome: 'Chapéu de campeão', icone: '👑', tipo: 'mao' },
          null, null, null, null],
    vestiveis: [null, null, null, null],
  };
  localStorage.setItem('aristory.save.v1', JSON.stringify(cru));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
const remendo = await page.evaluate(() => {
  const j = window.jogo;
  const CHAPEU = 'chapeu-ping-pong';
  // procura por ID, e não pela vaga 0: a cena pode ter posto outra coisa na
  // mão nesse meio tempo (na quadra, o frisbee entra sozinho)
  const naMao = j.handItems('ari').some((i) => i?.id === CHAPEU);
  const noArmario = j.wardrobeItems('ari').find((i) => i.id === CHAPEU) ?? null;
  const foi = noArmario ? j.equipWearable(noArmario, 'ari') : false;
  return {
    naMao,
    antes: noArmario?.tipo ?? null,
    foi,
    vestindo: j.wearables('ari').map((i) => i?.id ?? null),
  };
});
await page.waitForTimeout(600);
const chapeuNaCabeca = await page.evaluate(() => {
  const j = window.jogo;
  const rig = j.player.rig.spec.id === 'ari' ? j.player.rig : j.parceiro.rig;
  return rig.campeao;
});

// --------------------------------------------------- a trava de categoria
// Sorvete não se veste. A recusa é do SaveState; a tela só dá voz a ela.
const trava = await page.evaluate(() => {
  const j = window.jogo;
  const quem = j.playerId();
  const sorvete = { id: 'sorvete-teste', nome: 'Sorvete', icone: '🍦', tipo: 'mao' };
  const naMao = j.handItems(quem).findIndex((x) => x === null);
  j.addItem(sorvete, quem);
  const onde = j.handItems(quem).findIndex((x) => x?.id === 'sorvete-teste');
  return {
    naMao,
    // 1. arrastar item de mão para vaga de vestimenta
    paraVestimenta: j.moveItem({ lista: 'mao', indice: onde }, { lista: 'vestivel', indice: 0 }, quem),
    // 2. tentar vestir direto pela API
    vestirDireto: j.equipWearable(sorvete, quem),
    // 3. e o caminho que TEM que continuar valendo: desequipar
    vestindoDepois: j.wearables(quem).map((x) => x?.id ?? null),
  };
});

console.log('depois da compra · controlando', comprou.controlando);
console.log('  mão do Ari:', comprou.maoAri, '· mão do Renan:', comprou.maoRenan);
console.log('  rig do jogador:', JSON.stringify(comprou.rigDoJogador));
console.log('  rig do parceiro:', JSON.stringify(comprou.rigDoParceiro));
console.log('depois do T · controlando', trocado.controlando);
console.log('  rig do jogador:', JSON.stringify(trocado.rigDoJogador));
console.log('  rig do parceiro:', JSON.stringify(trocado.rigDoParceiro));
console.log('auto-stash:', JSON.stringify(cascata.enche));
console.log('  mochila cheia:', JSON.stringify(cascata.maos));
console.log('desequipar arrastando:', arrastou.ok, '→ vaga', arrastou.vagaLivre, '· tipo continua', arrastou.tipoDepois);
console.log('  na mão:', JSON.stringify(arrastou.naMao));
console.log('  vestindo:', JSON.stringify(arrastou.vestindo));
console.log('chapéu de save antigo · na mão:', remendo.naMao, '(tem que ser false) · no armário como:', remendo.antes, '· deu pra vestir:', remendo.foi);
console.log('  vestindo:', JSON.stringify(remendo.vestindo), '· na cabeça:', chapeuNaCabeca);
console.log('trava · arrastar sorvete para vestimenta:', trava.paraVestimenta, '· equipWearable direto:', trava.vestirDireto);
console.log('  vagas de vestimenta depois das tentativas:', JSON.stringify(trava.vestindoDepois));
console.log('frisbee com a mochila cheia:', comMochilaCheia, '(tem que ser false)');
console.log('frisbee com vaga livre:', comVaga.tem, '· na mão:', comVaga.naMao);
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

const paresCertos = (e) =>
  (e.rigDoJogador[0] === 'ari' ? e.rigDoJogador[1] : e.rigDoParceiro[1]) === 'sorvete-morango' &&
  (e.rigDoJogador[0] === 'renan' ? e.rigDoJogador[1] : e.rigDoParceiro[1]) === 'sorvete-maracuja';

const ok =
  !erros.length &&
  comprou.maoAri === 'sorvete-morango' &&
  comprou.maoRenan === 'sorvete-maracuja' &&
  paresCertos(comprou) &&
  trocado.controlando !== comprou.controlando &&
  // o T trocou os corpos e cada sorvete continua com o seu dono
  paresCertos(trocado) &&
  // A regra, e não o tamanho: com o sorvete já na mão sobram `vagas - 1`
  // livres, então tudo entra até acabar e só a última tentativa dá 'cheio'.
  cascata.enche.length === cascata.vagas &&
  cascata.enche.slice(0, cascata.vagas - 1).every((r) => r === 'guardado') &&
  cascata.enche[cascata.vagas - 1] === 'cheio' &&
  arrastou.ok &&
  // guardado na mochila o patins CONTINUA sendo vestível: o item não mente
  // sobre a própria categoria só porque mudou de vaga
  arrastou.tipoDepois === 'vestivel' &&
  arrastou.naMao.includes('patins') &&
  !arrastou.vestindo.includes('patins') &&
  // o chapéu estragado se conserta sozinho ao carregar: sai da vaga de mão,
  // vai parar no guarda-roupa e volta a ser vestível
  remendo.naMao === false &&
  remendo.antes === 'vestivel' &&
  remendo.foi === true &&
  remendo.vestindo[0] === 'chapeu-ping-pong' &&
  chapeuNaCabeca === true &&
  // sorvete não se veste, por nenhum dos dois caminhos
  trava.paraVestimenta === false &&
  trava.vestirDireto === false &&
  // o chapéu (legítimo) segue lá; o que não pode é o sorvete ter entrado
  !trava.vestindoDepois.includes('sorvete-teste') &&
  trava.vestindoDepois[0] === 'chapeu-ping-pong' &&
  // sem vaga não há disco; com vaga ele vai direto para a mão
  !comMochilaCheia &&
  comVaga.tem &&
  comVaga.naMao === 'frisbee';

await browser.close();
process.exit(ok ? 0 : 1);
