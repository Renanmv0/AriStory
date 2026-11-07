import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { logoDaEscola, quadroDeGiz } from '../world/furniture';
import { animarVapor, geladeiraDoMania, prateleiraDaCozinha } from '../world/moveisDoMania';
import {
  JANELA_DA_CANTINA, PRATOS_DA_LIZ, SOPA_NO_BALCAO, balcaoDaCantina, bandejaComPrato, janelaDaCantina, type PratoDaLiz,
} from '../world/cantinaDaTiaLiz';
import { bancadaDePreparo, fogaoDaLiz } from '../world/cozinhaDaTiaLiz';
import { CozinhaDaLiz, LINHA } from './cozinhaDaLiz';
import { ARI, RENAN } from '../characters/cast';
import { TiaLiz } from '../entities/bichos/TiaLiz';
import { conversa, soltarDaConversa, pontoNoMundo } from './escolaComum';
import { VALENTINA_CONHECIDA } from './escolaMarketing';

/**
 * ================================================ A CANTINA DA TIA LIZ
 *
 * A TIA LIZ (pedido do Renan): a tia da cantina da escola, uma ursa
 * venezuelana com vibe acolhedora de mãe — "pode ser rígida às vezes, mas no
 * fim das contas é carinhosa com os alunos". A comida dela é a comida que a
 * referência dela fazia em casa: sopita, pasta com almôndegas, pabellón,
 * fororo e a torta tres leches (`world/cantinaDaTiaLiz.ts`).
 *
 * O POSTO é a COZINHA da Lanchonete dos Gatitos, no fundo do refeitório: um
 * cômodo próprio, com a JANELA DE SERVIR larga na parede da frente (a
 * cantina de escola americana — pedido do Renan) e a placa da Lanchonete
 * dos Gatitos em cima. Ela trabalha lá dentro, mexendo a sopita no caldeirão do balcão que
 * encosta na janela; a bandeja sai pelo parapeito de inox. E ela AMA o que
 * faz: cantarola mexendo a panela, e fala da cozinha como quem fala de casa.
 *
 * A CONVERSA: na primeira vez, a apresentação (a pergunta das mãos lavadas
 * antes do oi) e a memória; nas outras, um assunto da vez. E sempre o
 * CARDÁPIO no fim: ela serve o prato escolhido (as patas para a frente, a
 * bandeja no balcão), a dupla senta na mesa mais perto, come (a comida
 * encolhe no prato a cada garfada) e comenta. Provar os cinco dá a memória
 * "Comida de casa".
 *
 * ELA É RÍGIDA de vez em quando, e no fim cede: as mãos na cintura aparecem
 * nas falas de bronca (a sobremesa antes do almoço, o prato que não pode
 * sobrar), e a fala seguinte é sempre carinho.
 *
 * Espanhol, só o de casa: épale, mi amor, mijo, ay, ¡eso!, buen provecho,
 * caraotas, tajada, jojoto, auyama. As falas são rascunho meu, no jeito que o
 * Renan descreveu; quando ele mandar falas de verdade, entram aqui literais.
 */

const L = 'Tia Liz';
const A = ARI.name;
const R = RENAN.name;

/** a flag da apresentação dela */
export const TIA_LIZ_CONHECIDA = 'tia-liz-conhecida';
/** o prato já provado (um contador por prato: `liz.provou.<id>`) */
const provou = (id: PratoDaLiz): string => `liz.provou.${id}`;

/** uma fala, e o gesto dela nessa fala */
type Gesto = 'brava' | 'acena' | 'serve';
type Fala = readonly [string, string, Gesto?];

/** onde fica o balcão (o meio dele, no chão) */
export interface CantinaNoMundo {
  x: number;
  /** a parede do fundo (o `z0` do refeitório) */
  parede: number;
}

// =========================================================== AS CONVERSAS

const APRESENTACAO: readonly Fala[] = [
  [L, '¡Épale! Chegaram os dois que faltavam. Antes do oi: lavaram as mãos?', 'brava'],
  [A, '...Lavamos?'],
  [R, 'Quase.'],
  [L, 'Quase não é lavada, mijo. Ali tem o bebedouro e, no corredor, a pia. Hoje eu deixo passar.', 'brava'],
  [L, 'Ay, que cara de fome. Eu sou a Liz. Tia Liz, pra vocês. A cantina é minha, a cozinha é minha, e aqui perto de mim ninguém passa fome.', 'acena'],
  [L, 'Vim da Venezuela com a minha panela debaixo do braço. Aqui é comida de casa: sopita, pasta con albóndigas, pabellón, fororo... e torta tres leches pra quem raspa o prato.'],
  [R, 'Pabellón de verdade? Igual ao da Venezuela?'],
  [L, 'Igualzinho. Arroz, caraotas negras, carne mechada e tajada. Sem tajada não é pabellón, é tristeza.'],
  [L, 'Cozinhar é o que eu mais amo nessa vida. Cada prato que sai por essa janelinha leva um pedacinho do meu coração.', 'acena'],
  [A, 'E a gente pode comer?'],
  [L, 'Ay, mi amor, claro que pode. É pra isso que eu tô aqui. Escolhe que eu sirvo.', 'acena'],
];

/** um assunto por visita, em roda (o da Valentina só depois de conhecê-la) */
function assuntos(g: GameAPI): ReadonlyArray<readonly Fala[]> {
  const lista: Array<readonly Fala[]> = [
    [
      [L, 'Chegaram! Mãos lavadas? ...Mostra.', 'brava'],
      [L, 'Hmm. Tá bom, passa. E tira esse cabelo do olho, que assim não enxerga o prato.'],
    ],
    [
      [L, 'O Flynn come três pratos depois do treino. Três! E ainda pede tres leches.'],
      [L, 'Eu finjo que brigo. Mas esse menino me enche de orgulho.', 'acena'],
    ],
    [
      [L, 'O Gatito come devagarinho, de oculinhos, e agradece o nome de cada ingrediente.'],
      [L, 'Professor bem educado é outra coisa. Aprendam com ele, que português também se aprende na mesa.'],
    ],
    [
      [L, 'Na Venezuela a gente diz "buen provecho". Aqui vocês dizem "bom apetite".'],
      [L, 'Eu digo os dois, pra garantir. Comida abençoada duas vezes não faz mal a ninguém.'],
    ],
    [
      [L, 'Vocês estão estudando muito, eu vejo. Cérebro também come, sabiam?', 'brava'],
      [L, 'Por isso a sopita tem cenoura. E por isso eu ponho um pedacinho a mais no prato de vocês.', 'acena'],
    ],
    [
      [L, 'As coelhinhas vêm aqui depois da torcida, cansadas, e dividem uma tres leches em três colherinhas.'],
      [L, 'Eu sempre corto o pedaço maior. Não conta pra ninguém.'],
    ],
  ];
  lista.push(
    [
      [L, 'Sabe o barulho que eu mais gosto? Colher raspando o prato. Quer dizer que ficou bom.', 'acena'],
      [L, 'Eu acordo antes do sol pra fazer o fororo. E acordo cantando. Pergunta pro Gatito.'],
    ],
    [
      [L, 'Tem gente que acha que cantina é só trabalho. Pra mim é a melhor janela da escola.'],
      [L, 'Daqui eu vejo todo mundo chegar com fome e sair feliz. Não tem aula que ensine isso.', 'acena'],
    ],
  );
  if (g.flag(VALENTINA_CONHECIDA)) {
    lista.push([
      [L, 'A Valentina só quer salada. Salada! Ontem eu escondi uma almôndega debaixo da alface.'],
      [L, 'Ela comeu inteira e disse "perfetto". Eu fingi que não vi.'],
    ]);
  }
  return lista;
}

/** o que ela diz servindo cada prato, e o que a dupla diz comendo (as garfadas) */
const PRATOS: Record<PratoDaLiz, { serve: readonly Fala[]; come: readonly Fala[]; fim: readonly Fala[] }> = {
  sopita: {
    serve: [
      [L, 'Sopita! De frango, com jojoto, auyama e cenoura. Cura gripe, cura saudade e cura segunda-feira.', 'serve'],
      [L, 'E toma tudo, viu? Caldo também é comida.', 'brava'],
    ],
    come: [
      [A, 'Tem gosto de domingo.'],
      [R, 'Tem gosto de colo.'],
      [A, 'O milho na espiga é a melhor parte.'],
    ],
    fim: [[L, '¡Eso! Raspou o fundo. O melhor fica sempre embaixo.', 'acena']],
  },
  pasta: {
    serve: [
      [L, 'Pasta con albóndigas. Almôndega feita na mão, uma por uma, do tamanho certo pra boca de vocês.', 'serve'],
    ],
    come: [
      [R, 'Ela fez bolinha por bolinha...'],
      [A, 'Dá pra sentir. O molho é docinho.'],
      [R, 'Mais uma almôndega e eu durmo aqui na mesa.'],
    ],
    fim: [
      [L, 'Nada de deixar macarrão no prato!', 'brava'],
      [L, '...Ah, não deixaram. Assim que eu gosto, mis niños.', 'acena'],
    ],
  },
  pabellon: {
    serve: [
      [L, 'Pabellón criollo, o prato da bandeira. O arroz é a nuvem, a caraota é a noite, a carne é a terra e a tajada é o sol.', 'serve'],
    ],
    come: [
      [A, 'O segredo é misturar tudo na mesma garfada.'],
      [R, 'Eu deixo a tajada por último.'],
      [A, 'Eu como a tajada primeiro.'],
    ],
    fim: [[L, 'Cada um come do seu jeito. Desde que coma TUDO. ...E comeram. Bravo!', 'acena']],
  },
  fororo: {
    serve: [
      [L, 'Fororo bem quentinho, com canela. Era o que eu fazia de manhã pra acordar quem não queria acordar.', 'serve'],
      [L, 'Assopra antes, mi amor. Língua queimada não sente gosto.', 'brava'],
    ],
    come: [
      [R, 'Parece um abraço em forma de mingau.'],
      [A, 'Tem cheirinho de milho tostado.'],
      [R, 'E a canela por cima...'],
    ],
    fim: [[L, 'Agora sim: acordados e de barriga quente. Pode ir pra aula.', 'acena']],
  },
  'tres-leches': {
    serve: [
      [L, 'Torta tres leches? Antes do almoço?', 'brava'],
      [L, 'Ay... tá bom. Só hoje. Mas amanhã é sopita primeiro, ouviram?', 'serve'],
    ],
    come: [
      [A, 'É molhadinha do jeito certo.'],
      [R, 'Três leites. Eu contei.'],
      [L, 'E um quarto ingrediente que eu não conto pra ninguém.'],
      [A, 'Qual?'],
    ],
    fim: [[L, 'Carinho, ué. Achou que era o quê?', 'acena']],
  },
};

const AGORA_NAO: readonly Fala[] = [
  [L, 'Tá bom. Mas não vai pra aula de barriga vazia, hein.', 'brava'],
  [L, 'A panela fica no fogo. Quando der fome, eu tô aqui.', 'acena'],
];

// ================================================================= O POSTO

/**
 * Põe a cantina no refeitório: o balcão novo com a comida dela, o quadro do
 * cardápio, a Tia Liz atrás do caldeirão e a conversa. Devolve ela (a cena
 * passa para quem esvazia a escola no Halloween).
 */
export function montarACantina(
  w: WorldBuilder,
  c: CantinaNoMundo,
  mesas: ReadonlyArray<readonly [number, number]>,
): TiaLiz {
  /*
   * A COZINHA É UM CÔMODO: a parede da frente com a JANELA DE SERVIR fica
   * 2 m à frente da parede do fundo, e ela trabalha lá dentro (a cantina de
   * escola americana, pedido do Renan). O balcão de dentro encosta na
   * janela: a comida aparece pelo vão, e a bandeja sai pelo parapeito.
   */
  const J = JANELA_DA_CANTINA;
  const FUNDO = 2;
  const W = c.parede + FUNDO;
  w.add(w.place(janelaDaCantina(FUNDO), c.x, 0, W));
  const BZ = W - J.espessura / 2 - 0.85 / 2 - 0.02;
  /*
   * A FILA DA COZINHA (`cozinhaDaLiz.ts`): o fogão dela na ponta da
   * esquerda, girado (os botões e o forno para ela, as bocas para a janela),
   * o balcão térmico com o passe e as cubas, e a bancada de preparo com a
   * tábua e a tres leches. Tudo encostado na janela, na mesma linha.
   */
  const fogao = w.add(w.place(fogaoDaLiz(), c.x + LINHA.fogao, 0, BZ + 0.02, Math.PI));
  const balcao = w.add(w.place(balcaoDaCantina(), c.x + LINHA.termico, 0, BZ));
  w.add(w.place(bancadaDePreparo(), c.x + LINHA.bancada, 0, BZ));
  // o colisor vai da parede do fundo até o trilho de bandeja: ninguém entra na cozinha
  const frente = W + 0.62;
  w.blockBox(c.x, (c.parede + frente) / 2, J.largura / 2 + 0.05, (frente - c.parede) / 2);
  // a placa da lanchonete na verga da janela, e o cardápio no fundo da
  // cozinha (alto: aparece por cima da parede da frente)
  w.add(w.place(logoDaEscola('Lanchonete dos Gatitos', 3.6, 0.5), c.x, J.verga + 0.32, W + J.espessura / 2 + 0.04));
  w.add(w.place(
    quadroDeGiz(['Cardápio da Tia Liz', 'sopita · pasta con albóndigas', 'pabellón criollo · fororo', 'torta tres leches', '¡buen provecho!'], 3.4, 1.5),
    c.x, 3.6, c.parede + 0.18,
  ));
  // a geladeira na ponta da direita, e a prateleira de panelas no fundo,
  // acima da cabeça dela
  w.add(w.place(geladeiraDoMania(), c.x + 3.6, 0, c.parede + 0.48));
  for (const dx of [-2.2, 2.2]) {
    w.add(w.place(prateleiraDaCozinha(1.6), c.x + dx, 1.95, c.parede + 0.02));
  }

  /**
   * O POSTO DE ATENDER é atrás do caldeirão, no meio da janela, com a pata
   * direita (a da concha) em cima dele: mexendo, a pata para 0,26 à direita
   * e 0,35 à frente do meio dela (`scripts/tiaLiz.mjs` mede a concha dentro
   * da panela). Dali ela sai para a rotina da cozinha.
   */
  const sopa = { x: c.x + LINHA.termico + SOPA_NO_BALCAO.x, z: BZ + SOPA_NO_BALCAO.z };
  const posto = { x: sopa.x - 0.26, z: sopa.z - 0.35 };
  const liz = new TiaLiz({ minX: posto.x, maxX: posto.x, minZ: posto.z, maxZ: posto.z });
  liz.group.position.set(posto.x, 0, posto.z);
  liz.entrarEmServico();
  liz.encarar(posto.x, posto.z + 5);
  w.add(liz.group);
  liz.aoSoar = () => w.game.som('cantarolar');
  /** o som da cozinha só toca com a dupla no refeitório, perto da janela */
  const perto = (): boolean => {
    const p = w.game.playerPosition();
    return liz.group.visible && Math.hypot(p.x - c.x, p.z - W) < 9;
  };
  const cozinha = new CozinhaDaLiz(w, liz, { cx: c.x, bz: BZ, fogao, perto });
  cozinha.comecarRotina();
  /** gancho de teste: o `scripts/tiaLiz.mjs` mede ela, a concha, a panela e a cozinha */
  liz.group.userData.teste = { liz, sopa, posto, balcao, bandejaComPrato, cozinha };

  const vapor = balcao.getObjectByName('vapor-da-sopita');
  let relogio = 0;
  let calor = 0.38;
  w.onUpdate((dt) => {
    relogio += dt;
    cozinha.update(dt);
    // o vapor é fininho (o caldeirão fica bem embaixo do rosto dela) e some
    // enquanto ela conversa, para não tapar a cara de quem fala
    calor += ((liz.estaMexendo ? 0.38 : 0.12) - calor) * Math.min(1, dt * 2);
    if (vapor) animarVapor(vapor, relogio, calor);
  });

  const falar = async (g: GameAPI, falas: readonly Fala[], semGesto = false): Promise<void> => {
    for (const [quem, texto, gesto] of falas) {
      if (semGesto) { /* com as patas ocupadas na panela, ela só fala */ } else if (gesto === 'brava') liz.maosNaCintura(2.6);
      else if (gesto === 'acena') liz.acenar(1.8);
      else if (gesto === 'serve') liz.servir(2.4);
      await conversa(g, [[quem, texto]]);
    }
  };

  w.interact({
    id: 'escola:tia-liz',
    x: posto.x, z: frente + 0.55, radius: 1.5,
    priority: 1,
    label: 'Falar com a Tia Liz', icon: '🍲',
    highlight: liz.group,
    onInteract: async (g) => {
      g.lockPlayer(true);
      // a dupla para na frente da janela (a diagonal da conversa daria na parede)
      const eu = { x: posto.x + 0.35, z: frente + 0.6 };
      const par = { x: posto.x + 1.15, z: frente + 0.7 };
      g.releasePlayer(eu.x, eu.z, Math.atan2(posto.x - eu.x, posto.z - eu.z));
      g.releaseCompanion(par.x, par.z, Math.atan2(posto.x - par.x, posto.z - par.z));
      g.holdCompanion(posto.x, posto.z);
      g.focusCamera(liz.group);
      g.setZoom(8);
      /*
       * ELA LARGA O QUE ESTAVA FAZENDO (a faca volta para a tábua, a
       * frigideira para o fogo) e vem ligeira até a janela — e ACENA para a
       * dupla antes da primeira palavra (pedido do Renan).
       */
      await cozinha.atender({ x: (eu.x + par.x) / 2, z: (eu.z + par.z) / 2 });
      liz.acenar(2.2);
      g.som('cantarolar');
      await g.wait(1.1);
      let comeu = false;
      try {
        if (!g.flag(TIA_LIZ_CONHECIDA)) {
          await falar(g, APRESENTACAO);
          g.setFlag(TIA_LIZ_CONHECIDA);
          g.som('sacudida');
          g.unlock({
            id: 'a-tia-da-cantina',
            title: 'A tia da cantina',
            place: 'Refeitório da Escola do Gatito',
            note: 'Uma ursa venezuelana de cachos dourados, colar da Torre Eiffel e avental com as cores da bandeira. Perguntou se a gente tinha lavado as mãos antes de dar oi. Depois, serviu o prato mais cheio do refeitório.',
            icon: '🍲',
          });
          g.toast('Tia Liz, da cantina', '🍲');
        } else {
          const lista = assuntos(g);
          const vez = g.bump('tia-liz.conversas');
          await falar(g, lista[(vez - 1) % lista.length]);
        }
        const escolha = await g.ask(
          'O que vai ser hoje?',
          [...PRATOS_DA_LIZ.map((p) => `${p.icone} ${p.nome}`), 'Agora não'],
          L,
        );
        const prato = PRATOS_DA_LIZ[escolha];
        if (!prato) {
          await falar(g, AGORA_NAO);
          return;
        }
        comeu = true;
        await servirEComer(w, g, liz, cozinha, prato.id, { posto, frente, mesas, falar, parapeito: W + 0.12 });
      } finally {
        if (!comeu) {
          g.focusCamera(null);
          g.setZoom(13);
          soltarDaConversa(g);
        }
        cozinha.garantirRotina();
      }
    },
  });

  return liz;
}

/**
 * SERVIR E COMER: ela estende as duas bandejas por cima do balcão, a tela
 * escurece, e a dupla aparece sentada na mesa mais perto, lado a lado,
 * cada um com a sua bandeja. A cada garfada a comida encolhe no
 * prato; no fim ela fala lá do balcão, e a louça fica até eles levantarem.
 */
async function servirEComer(
  w: WorldBuilder,
  g: GameAPI,
  liz: TiaLiz,
  cozinha: CozinhaDaLiz,
  id: PratoDaLiz,
  o: {
    posto: { x: number; z: number };
    frente: number;
    /** o meio do parapeito da janela, onde a bandeja sai */
    parapeito: number;
    mesas: ReadonlyArray<readonly [number, number]>;
    falar: (g: GameAPI, falas: readonly Fala[], semGesto?: boolean) => Promise<void>;
  },
): Promise<void> {
  const fala = PRATOS[id];
  /*
   * AS BANDEJAS ESPERAM NO PARAPEITO, vazias (o guardanapo e o suco), e ela
   * PREPARA o prato na frente da dupla (`CozinhaDaLiz.preparar`): cada prato
   * tem a sua coreografia, e o pronto desliza pela janela para a bandeja.
   * A primeira fala do prato vem antes (com o gesto dela); as outras, ela
   * diz cozinhando.
   */
  const noBalcao = [bandejaComPrato(id, new THREE.Group()), bandejaComPrato(id, new THREE.Group())];
  noBalcao.forEach((b, i) => {
    b.position.set(o.posto.x + 0.05 + i * 0.5, JANELA_DA_CANTINA.peitoril + 0.05, o.parapeito);
    w.root.add(b);
  });
  g.som('louca');
  const [primeira, ...resto] = fala.serve;
  await o.falar(g, [primeira[2] === 'serve' ? [primeira[0], primeira[1], 'acena'] : primeira]);
  g.setZoom(6.2);
  const preparo = cozinha.preparar(id, noBalcao);
  await o.falar(g, resto, true);
  await preparo;
  // os pratos foram: ela volta para a cozinha enquanto a dupla come
  cozinha.comecarRotina();
  g.setZoom(8);

  // a mesa mais perto de quem joga
  const eu = g.playerPosition();
  const [mx, mz] = [...o.mesas].sort((a, b) => Math.hypot(a[0] - eu.x, a[1] - eu.z) - Math.hypot(b[0] - eu.x, b[1] - eu.z))[0];
  await g.escurecerTela(true);
  g.focusCamera(null);
  soltarDaConversa(g);
  const ancora = pontoNoMundo(w, mx, 0, mz);
  const foco = pontoNoMundo(w, mx, 0.95, mz - 0.4);
  /*
   * OS DOIS LADO A LADO no banco do FUNDO (o `-Z`), de frente para a câmera:
   * um em cada banco, o da frente ficava de costas, com o cabelo tapando a
   * bandeja dele. As bandejas vão para a mesa, uma na frente de cada um (o
   * tampo é 0,78), viradas para quem come.
   */
  const LADO = 0.36;
  noBalcao.forEach((b, i) => {
    b.position.set(mx + (i === 0 ? -LADO : LADO), 0.78, mz - 0.27);
    b.rotation.y = Math.PI;
  });
  g.lockPlayer(true);
  g.ridePlayer(ancora, new THREE.Vector3(-LADO, 0, -0.74), 1, 0);
  g.rideCompanion(ancora, new THREE.Vector3(LADO, 0, -0.74), 1, 0);
  g.setSitting(true);
  g.focusCamera(foco);
  g.setZoom(6.5);
  await g.escurecerTela(false);
  await g.wait(0.4);

  // as garfadas: a comida encolhe um pedaço a cada fala
  const comidas = noBalcao
    .map((b) => (b.userData.prato as THREE.Object3D | undefined)?.getObjectByName('comida'))
    .filter((c): c is THREE.Object3D => !!c);
  const passos = fala.come.length + 1;
  let passo = 0;
  const garfada = (): void => {
    passo++;
    g.som('nhac');
    const k = Math.max(0.12, 1 - passo / passos);
    for (const c of comidas) c.scale.set(Math.sqrt(k), k, Math.sqrt(k));
  };
  for (const linha of fala.come) {
    garfada();
    await o.falar(g, [linha]);
  }
  garfada();
  for (const c of comidas) c.visible = false;
  g.som('sacudida');
  await o.falar(g, fala.fim);

  // provou: o contador do prato, e os cinco dão a memória
  g.bump(provou(id));
  const provados = PRATOS_DA_LIZ.filter((p) => g.stat(provou(p.id)) > 0).length;
  if (provados === PRATOS_DA_LIZ.length && !g.flag('liz-comida-de-casa')) {
    g.setFlag('liz-comida-de-casa');
    await o.falar(g, [
      [L, 'Provaram tudo. Tudinho! A sopita, a pasta, o pabellón, o fororo e a tres leches.', 'acena'],
      [L, 'Agora vocês são de casa. E quem é de casa volta sempre, ouviram? Sempre.'],
    ]);
    g.unlock({
      id: 'comida-de-casa',
      title: 'Comida de casa',
      place: 'Cantina da Tia Liz',
      note: 'Sopita, pasta com almôndegas, pabellón, fororo e tres leches: provamos a cantina inteira da Tia Liz. Ela disse que agora a gente é de casa.',
      icon: '🫶',
    });
    g.toast('Provaram os cinco pratos da Tia Liz', '🫶');
  }

  let escolha = 0;
  while (escolha === 0) {
    escolha = await g.ask('Ficar mais um pouco?', ['Ficar', 'Levantar']);
    if (escolha === 0) await g.wait(4);
  }
  g.setSitting(false);
  g.focusCamera(null);
  g.setZoom(13);
  g.releasePlayer(mx - LADO, mz - 1.75, Math.PI);
  g.releaseCompanion(mx + LADO, mz - 1.75, Math.PI);
  g.lockPlayer(false);
  for (const b of noBalcao) b.removeFromParent();
  ancora.removeFromParent();
  foco.removeFromParent();
  void liz;
}
