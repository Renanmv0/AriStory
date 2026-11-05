import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { quadroDeGiz } from '../world/furniture';
import { animarVapor } from '../world/moveisDoMania';
import {
  PRATOS_DA_LIZ, SOPA_NO_BALCAO, balcaoDaCantina, bandejaComPrato, type PratoDaLiz,
} from '../world/cantinaDaTiaLiz';
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
 * O POSTO é atrás do balcão do refeitório, mexendo a sopita no caldeirão.
 * O balcão saiu da parede (antes ficava colado nela) para caber ela atrás; o
 * colisor fecha da parede até o trilho de bandeja, e ninguém dá a volta.
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
  // o balcão SAIU da parede: ela cabe atrás, entre o azulejo e o fundo
  const BZ = c.parede + 1.6;
  const balcao = w.add(w.place(balcaoDaCantina(8), c.x, 0, BZ));
  // o colisor vai da parede até o fim do trilho de bandeja: ninguém dá a volta
  const frente = BZ + 0.85 / 2 + 0.36;
  w.blockBox(c.x, (c.parede + frente) / 2, 4.05, (frente - c.parede) / 2);
  w.add(w.place(
    quadroDeGiz(['Cantina da Tia Liz', 'sopita · pasta con albóndigas', 'pabellón criollo · fororo', 'torta tres leches', '¡buen provecho!'], 3.4, 1.7),
    c.x, 2.75, c.parede + 0.18,
  ));

  /**
   * ELA FICA ATRÁS DO CALDEIRÃO, com a pata direita (a da concha) em cima
   * dele: a pata, mexendo, para 0,26 à direita e 0,35 à frente do meio
   * dela (`scripts/tiaLiz.mjs` mede a concha dentro da panela).
   */
  const sopa = { x: c.x + SOPA_NO_BALCAO.x, z: BZ + SOPA_NO_BALCAO.z };
  const posto = { x: sopa.x - 0.26, z: sopa.z - 0.35 };
  const liz = new TiaLiz({ minX: posto.x, maxX: posto.x, minZ: posto.z, maxZ: posto.z });
  liz.group.position.set(posto.x, 0, posto.z);
  liz.entrarEmServico();
  liz.encarar(posto.x, posto.z + 5);
  liz.mexerAPanela(true);
  w.add(liz.group);
  liz.aoSoar = () => w.game.som('cantarolar');
  /** gancho de teste: o `scripts/tiaLiz.mjs` mede ela, a concha e a panela */
  liz.group.userData.teste = { liz, sopa, posto, balcao, bandejaComPrato };

  const vapor = balcao.getObjectByName('vapor-da-sopita');
  let relogio = 0;
  let calor = 0.38;
  w.onUpdate((dt) => {
    relogio += dt;
    liz.update(dt);
    // o vapor é fininho (o caldeirão fica bem embaixo do rosto dela) e some
    // enquanto ela conversa, para não tapar a cara de quem fala
    calor += ((liz.estaMexendo ? 0.38 : 0) - calor) * Math.min(1, dt * 2);
    if (vapor) animarVapor(vapor, relogio, calor);
  });

  const falar = async (g: GameAPI, falas: readonly Fala[]): Promise<void> => {
    for (const [quem, texto, gesto] of falas) {
      if (gesto === 'brava') liz.maosNaCintura(2.6);
      else if (gesto === 'acena') liz.acenar(1.8);
      else if (gesto === 'serve') liz.servir(2.4);
      await conversa(g, [[quem, texto]]);
    }
  };

  w.interact({
    id: 'escola:tia-liz',
    x: c.x, z: frente + 0.55, radius: 1.5,
    priority: 1,
    label: 'Falar com a Tia Liz', icon: '🍲',
    highlight: liz.group,
    onInteract: async (g) => {
      g.lockPlayer(true);
      liz.mexerAPanela(false);
      // a dupla para na frente do balcão (a diagonal da conversa daria no balcão)
      const eu = { x: posto.x + 0.35, z: frente + 0.6 };
      const par = { x: posto.x + 1.15, z: frente + 0.7 };
      g.releasePlayer(eu.x, eu.z, Math.atan2(posto.x - eu.x, posto.z - eu.z));
      g.releaseCompanion(par.x, par.z, Math.atan2(posto.x - par.x, posto.z - par.z));
      g.holdCompanion(posto.x, posto.z);
      liz.encarar((eu.x + par.x) / 2, (eu.z + par.z) / 2);
      g.focusCamera(liz.group);
      g.setZoom(8);
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
        await servirEComer(w, g, liz, prato.id, { posto, frente, mesas, falar, bz: BZ });
      } finally {
        if (!comeu) {
          g.focusCamera(null);
          g.setZoom(13);
          soltarDaConversa(g);
        }
        liz.encarar(posto.x, posto.z + 5);
        liz.mexerAPanela(true);
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
  id: PratoDaLiz,
  o: {
    posto: { x: number; z: number };
    frente: number;
    bz: number;
    mesas: ReadonlyArray<readonly [number, number]>;
    falar: (g: GameAPI, falas: readonly Fala[]) => Promise<void>;
  },
): Promise<void> {
  const fala = PRATOS[id];
  // as duas bandejas aparecem no tampo, na frente dela (o prato do servir)
  const noBalcao = [bandejaComPrato(id), bandejaComPrato(id)];
  noBalcao.forEach((b, i) => {
    b.position.set(o.posto.x + 0.1 + i * 0.5, 0.93, o.bz + 0.25);
    w.root.add(b);
  });
  g.som('louca');
  await o.falar(g, fala.serve);

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
