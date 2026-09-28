import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import {
  bandeira, bookshelf, cafeteira, caminhaDoGatito, carteiraEscolar, cartazDeParede, chair, coffeeTable,
  counter, diningTable, escaninhos, floorLamp, fridge, globoTerrestre, lousaDeSala, maquinaDeLanches,
  mesaDoProfessor, mug, oculinhosDoGatito, pottedPlant, pufeSaco, relogioDeParede, rug, sofa, windowFrame,
} from '../world/furniture';
import { assoalhoDeMadeira } from '../world/texturasDeChao';
import { ARI, RENAN } from '../characters/cast';
import { ESCOLA, LUZ_DA_ESCOLA, cascaDeSala, conversa, pontoNoMundo, sentarOsDois } from './escolaComum';

/**
 * ========================================= AS SALAS DA ESCOLA DO GATITO
 *
 * Cada sala mora atrás de uma porta do saguão e é um cenário próprio, menor
 * (pedido do Renan: "ao passar por essa porta, a gente entraria em um outro
 * cenário"). Aqui estão as duas salas de aula, a sala de descanso e a dos
 * professores; o ginásio tem arquivo próprio, porque tem a cesta de basquete.
 *
 * AS AULAS AINDA NÃO EXISTEM, de propósito: o Renan quer fazer as aulas com
 * calma, depois. Por enquanto as salas são cenário e algumas interações — a
 * lousa, a mesa do professor, o globo, as bandeiras, sentar na carteira.
 *
 * Todas seguem a casca de sala (`cascaDeSala`): parede alta em `-X` e `-Z`,
 * mureta do lado da câmera, e a saída de volta ao saguão na mureta da frente.
 */

const A = ARI.name;
const R = RENAN.name;

/** a lixeira de falas genérica: cada vez uma, na ordem */
function revezar<T>(lista: readonly T[]): () => T {
  let i = 0;
  return () => lista[i++ % lista.length];
}

/** Comprar um lanchinho na máquina: a mesma do refeitório. */
async function comprarLanche(g: GameAPI, w: WorldBuilder): Promise<void> {
  if (!g.gastar(3)) {
    await conversa(g, [
      [g.companionName(), 'Tá sem moeda?'],
      [g.playerName(), 'A carteira tá vazia. Depois a gente volta.'],
    ]);
    return;
  }
  g.som('caixa');
  g.toast(`${w.pick(['Um pacotinho de biscoito', 'Um chocolatinho', 'Um suco de caixinha'])} caiu da máquina!`, '🍫');
}

// ===================================================== AS SALAS DE AULA

interface FichaDaSala {
  id: string;
  name: string;
  subtitle: string;
  /** a entrada do saguão para onde a porta devolve */
  volta: string;
  parede: number;
  barra: number;
  /** o que está escrito na lousa (a primeira linha é o título, em amarelo) */
  lousa: readonly string[];
  cartaz: { titulo: string; linhas: readonly string[] };
  /** os oculinhos do Gatito em cima da mesa (só na sala dele) */
  oculinhos: boolean;
  falas: {
    lousa: ReadonlyArray<readonly [string, string]>;
    mesa: ReadonlyArray<readonly [string, string]>;
    globo: ReadonlyArray<readonly [string, string]>;
    bandeiras: ReadonlyArray<readonly [string, string]>;
    cartaz: ReadonlyArray<readonly [string, string]>;
    sentar: ReadonlyArray<readonly [string, string]>;
  };
  /** a memória que entra na primeira vez que se lê a lousa */
  memoria: { id: string; title: string; note: string; icon: string };
}

/** a sala de aula: 11 × 9, a lousa no fundo, três fileiras de carteiras */
const SALA = { largura: 11, fundo: 9, altura: 3.0, portaX: 4.5 };
/** as carteiras: três colunas e três fileiras, com a faixa da porta (x > 2,5) livre */
const COLUNAS = [-3.6, -1.3, 1.0];
const FILEIRAS = [-0.8, 0.9, 2.6];

function salaDeAula(f: FichaDaSala): SceneDef {
  return {
    id: f.id,
    name: f.name,
    subtitle: f.subtitle,
    ambient: LUZ_DA_ESCOLA,
    spawn: { x: SALA.portaX, z: 3.1, facing: Math.PI },
    entries: { 'do-saguao': { x: SALA.portaX, z: 3.1, facing: Math.PI } },

    build(w) {
      const { x0, z0 } = cascaDeSala(w, {
        ...SALA, parede: f.parede, barra: f.barra, chao: P.escolaPisoSala, textura: assoalhoDeMadeira(2.4, 8),
      });

      // ---------------------------------------------------- a parede da lousa
      const lousa = w.add(w.place(lousaDeSala(f.lousa, 3.6, 1.4), 0, 1.62, z0 + 0.2));
      w.add(w.place(relogioDeParede(0.24), 0, 2.66, z0 + 0.19));
      const flagBr = w.add(w.place(bandeira('brasil', 0.9), -2.95, 1.95, z0 + 0.17));
      w.add(w.place(bandeira('venezuela', 0.9), 2.95, 1.95, z0 + 0.17));

      // a mesa do professor, de frente para a turma
      const mesa = w.add(w.place(mesaDoProfessor(), 0, 0, -2.75));
      w.blockBox(0, -2.75, 0.82, 0.42);
      if (f.oculinhos) {
        w.add(w.place(oculinhosDoGatito(), 0.15, 0.79, -2.55, 0.3));
      } else {
        w.add(w.place(mug(P.escolaFaixa), 0.2, 0.79, -2.6));
      }

      const globo = w.add(w.place(globoTerrestre(true), 4.4, 0, -3.5));
      w.blockCircle(4.4, -3.5, 0.3);
      const bolaDoGlobo = globo.getObjectByName('globo');

      // ------------------------------------------------ a parede da esquerda
      const cartaz = w.add(w.place(
        cartazDeParede(f.cartaz.titulo, f.cartaz.linhas, 2.3, 1.35), x0 + 0.17, 1.8, -1.0, Math.PI / 2,
      ));
      w.add(w.place(windowFrame(1.4, 1.1), x0 + 0.16, 1.75, 1.9, Math.PI / 2));
      w.add(w.place(bookshelf(1.9, 1.2, P.wood), x0 + 0.3, 0, -3.5, Math.PI / 2));
      w.blockBox(x0 + 0.3, -3.5, 0.2, 0.62);
      w.add(w.place(pottedPlant(1.1), -4.8, 0, 3.8));
      w.blockCircle(-4.8, 3.8, 0.3);

      // ------------------------------------------------------- as carteiras
      // Viradas para a lousa (a peça olha para +Z; meia volta).
      for (const x of COLUNAS) {
        for (const z of FILEIRAS) {
          w.add(w.place(carteiraEscolar(), x, 0, z, Math.PI));
          w.blockBox(x, z + 0.1, 0.34, 0.52);
        }
      }

      // ================================================== as interações
      w.door({
        x: SALA.portaX, z: SALA.fundo / 2 - 0.8, radius: 1.2,
        to: ESCOLA.saguao, entry: f.volta,
        label: 'Voltar pro saguão', icon: '🚪',
      });

      w.interact({
        id: `${f.id}:lousa`,
        x: 0, z: -3.65, radius: 1.7,
        label: 'Ler a lousa', icon: '🟩',
        highlight: lousa,
        onInteract: async (g) => {
          await conversa(g, f.falas.lousa);
          if (!g.flag(`${f.id}-lousa`)) {
            g.setFlag(`${f.id}-lousa`);
            g.unlock({ ...f.memoria, place: 'Escola do Gatito' });
          }
        },
      });

      w.interact({
        id: `${f.id}:mesa`,
        x: 0, z: -1.78, radius: 0.95,
        label: 'Olhar a mesa do professor', icon: '🍎',
        highlight: mesa,
        onInteract: (g) => conversa(g, f.falas.mesa),
      });

      // o globo gira quando alguém mexe nele, e para devagar
      let giro = 0;
      w.onUpdate((dt) => {
        if (!bolaDoGlobo) return;
        bolaDoGlobo.rotation.y += (0.08 + giro) * dt;
        giro *= 1 - Math.min(1, dt * 0.9);
      });
      w.interact({
        id: `${f.id}:globo`,
        x: 4.4, z: -2.7, radius: 1.0,
        label: 'Girar o globo', icon: '🌎',
        highlight: globo,
        onInteract: async (g) => {
          giro = 9;
          g.som('interagir');
          await conversa(g, f.falas.globo);
        },
      });

      w.interact({
        id: `${f.id}:bandeiras`,
        x: -2.95, z: -3.7, radius: 1.0,
        label: 'Olhar as bandeiras', icon: '🇧🇷',
        highlight: flagBr,
        onInteract: (g) => conversa(g, f.falas.bandeiras),
      });

      w.interact({
        id: `${f.id}:cartaz`,
        x: x0 + 1.0, z: -1.0, radius: 1.2,
        label: 'Ler o cartaz', icon: '🔤',
        highlight: cartaz,
        onInteract: (g) => conversa(g, f.falas.cartaz),
      });

      // SENTAR NA PRIMEIRA FILA: os dois nas carteiras do meio da fileira da
      // frente, virados para a lousa. O assento da carteira fica 0,38 atrás
      // do centro da peça (depois da meia volta, no +Z).
      const xEsq = COLUNAS[1];
      const xDir = COLUNAS[2];
      const zCadeira = FILEIRAS[0] + 0.38;
      const ancora = pontoNoMundo(w, (xEsq + xDir) / 2, 0, zCadeira);
      const foco = pontoNoMundo(w, (xEsq + xDir) / 2, 0.9, zCadeira - 1.2);
      const meio = (xDir - xEsq) / 2;
      w.interact({
        id: `${f.id}:sentar`,
        x: (xEsq + xDir) / 2, z: 0.15, radius: 1.2,
        label: 'Sentar na primeira fila', icon: '🪑',
        onInteract: (g) =>
          sentarOsDois(g, {
            ancora,
            jogador: new THREE.Vector3(-meio, 0, 0),
            parceiro: new THREE.Vector3(meio, 0, 0),
            facing: Math.PI,
            foco,
            falas: f.falas.sentar,
            saida: { jogador: [(xEsq + xDir) / 2 - 0.45, 0.15], parceiro: [(xEsq + xDir) / 2 + 0.45, 0.15], facing: Math.PI },
          }),
      });
    },
  };
}

export const escolaSala1 = salaDeAula({
  id: ESCOLA.sala1,
  name: 'Sala 1 — Português',
  subtitle: 'a sala do professor Gatito',
  volta: 'da-sala-1',
  parede: P.escolaParede,
  barra: P.escolaBarra,
  lousa: ['Aula de português', 'Bem-vindos, turma!', 'Prof. Gatito'],
  cartaz: {
    titulo: 'ABC do Gatito',
    linhas: ['A de abacaxi · B de bola', 'C de cafuné · D de doce', 'G de gato · S de saudade'],
  },
  oculinhos: true,
  falas: {
    lousa: [
      [R, 'Bem-vindos, turma. Professor Gatito.'],
      [A, 'A letra dele é bonitinha.'],
      [R, 'Ninguém sabe como ele escreve sem dedo.'],
    ],
    mesa: [
      [R, 'Olha, os oculinhos dele.'],
      [A, 'Ele só usa na hora da aula.'],
    ],
    globo: [
      [A, 'A Venezuela fica aqui.'],
      [R, 'E o Brasil é esse gigante do lado.'],
    ],
    bandeiras: [
      [A, 'As duas bandeiras juntas.'],
      [R, 'Como tem que ser.'],
    ],
    cartaz: [
      [A, 'C de cafuné?'],
      [R, 'Essa palavra não tem em espanhol. Depois eu te mostro o que é.'],
    ],
    sentar: [
      [R, 'Primeira fila. Aluno exemplar.'],
      [A, 'Quando a aula começar, eu sento aqui.'],
    ],
  },
  memoria: {
    id: 'sala-do-gatito',
    title: 'A sala do Gatito',
    note: 'A Sala 1, de português: lousa verde, as bandeiras do Brasil e da Venezuela lado a lado, e os oculinhos do Gatito esperando em cima da mesa.',
    icon: '📘',
  },
});

export const escolaSala2 = salaDeAula({
  id: ESCOLA.sala2,
  name: 'Sala 2 — Espanhol',
  subtitle: 'aqui o professor é o Ari',
  volta: 'da-sala-2',
  parede: P.escolaParedeSala2,
  barra: P.escolaBarraSala2,
  lousa: ['Clase de español', '¡Bienvenido, Renan!', 'Prof. Ari'],
  cartaz: {
    titulo: 'El abecedario',
    linhas: ['A de arepa · B de beso', 'C de corazón · G de gato', 'Ñ de ñapa · Z de zapato'],
  },
  oculinhos: false,
  falas: {
    lousa: [
      [R, '"¡Bienvenido, Renan!"... isso é pra mim?'],
      [A, 'Sí. Aquí el alumno eres tú.'],
    ],
    mesa: [
      [R, 'A mesa do professor Ari.'],
      [A, 'Siéntate, por favor.'],
      [R, 'Sí, profesor.'],
    ],
    globo: [
      [R, 'Cadê a Venezuela?'],
      [A, 'Aquí, al lado de Brasil.'],
    ],
    bandeiras: [
      [R, 'As mesmas duas bandeiras.'],
      [A, 'Las mismas. En las dos salas.'],
    ],
    cartaz: [
      [R, 'Ñ de... ñapa?'],
      [A, 'Es lo que te dan de regalo cuando compras algo. Un extra.'],
    ],
    sentar: [
      [A, 'Hoy vamos a aprender los saludos.'],
      [R, 'Hola... ¿cómo estás?'],
      [A, '¡Muy bien!'],
    ],
  },
  memoria: {
    id: 'o-professor-ari',
    title: 'O professor Ari',
    note: 'Na Sala 2 os papéis se invertem: quem ensina é o Ari, e o aluno de espanhol sou eu.',
    icon: '📙',
  },
});

// ===================================================== A SALA DE DESCANSO

/**
 * A SALA DE DESCANSO: sofá encostado no fundo (de frente para a câmera — quem
 * senta aparece de frente), pufes de saco no tapete, a estante de jogos, a
 * janela e a máquina de lanches.
 */
export const escolaDescanso: SceneDef = {
  id: ESCOLA.descanso,
  name: 'Sala de descanso',
  subtitle: 'cinco minutinhos entre uma aula e outra',
  ambient: LUZ_DA_ESCOLA,
  spawn: { x: 3.2, z: 2.6, facing: Math.PI },
  entries: { 'do-corredor': { x: 3.2, z: 2.6, facing: Math.PI } },

  build(w) {
    const { x0, z0 } = cascaDeSala(w, {
      largura: 10, fundo: 8, altura: 3.0, parede: P.wallMint, chao: P.escolaPisoSala,
      textura: assoalhoDeMadeira(2.4, 8), portaX: 3.2,
    });

    w.add(w.place(rug(5.2, 3.4, P.escolaArmarioAmarelo), 0, 0, -0.9));

    // o sofá, no fundo, olhando para a câmera
    const SOFA = { x: -1.2, z: z0 + 0.62 };
    const sofaObj = w.add(w.place(sofa(P.escolaSofa, 2.6), SOFA.x, 0, SOFA.z));
    w.blockBox(SOFA.x, SOFA.z, 1.3, 0.46);
    w.add(w.place(coffeeTable(), SOFA.x, 0, SOFA.z + 1.5));
    w.blockBox(SOFA.x, SOFA.z + 1.5, 0.55, 0.32);

    // os pufes de saco
    const PUFES: ReadonlyArray<[number, number, number]> = [[2.0, -1.2, P.escolaPufe], [3.3, 0.2, P.escolaArmarioAzul], [-3.2, 0.6, P.flowerPink]];
    for (const [x, z, cor] of PUFES) {
      w.add(w.place(pufeSaco(cor), x, 0, z, 0.2));
      w.blockCircle(x, z, 0.5);
    }

    const estante = w.add(w.place(bookshelf(1.9, 1.3, P.wood), 2.9, 0, z0 + 0.3));
    w.blockBox(2.9, z0 + 0.3, 0.66, 0.2);
    w.add(w.place(floorLamp(true), x0 + 0.55, 0, z0 + 0.55));
    w.blockCircle(x0 + 0.55, z0 + 0.55, 0.25);
    const janela = w.add(w.place(windowFrame(1.6, 1.2), x0 + 0.16, 1.75, -1.1, Math.PI / 2));
    const maquina = w.add(w.place(maquinaDeLanches(P.escolaFaixa), x0 + 0.53, 0, 1.9, Math.PI / 2));
    w.blockBox(x0 + 0.53, 1.9, 0.4, 0.5);
    w.add(w.place(pottedPlant(1.1), x0 + 0.6, 0, 3.3));
    w.blockCircle(x0 + 0.6, 3.3, 0.3);
    w.add(w.place(
      cartazDeParede('Silêncio, por favor', ['(pode cochilar)'], 1.4, 0.7, '#fff6dc', '#5f8f6b'),
      0.9, 2.1, z0 + 0.17,
    ));

    w.door({
      x: 3.2, z: 3.2, radius: 1.2,
      to: ESCOLA.saguao, entry: 'do-descanso',
      label: 'Voltar pro corredor', icon: '🚪',
    });

    // --------------------------------------------------------- sentar no sofá
    // A âncora fica 0,22 à frente do meio do sofá, como a do sofá da casa.
    const ancoraSofa = pontoNoMundo(w, SOFA.x, 0, SOFA.z + 0.22);
    const focoSofa = pontoNoMundo(w, SOFA.x, 0.9, SOFA.z + 0.8);
    w.interact({
      id: 'descanso:sofa',
      x: SOFA.x, z: SOFA.z + 1.0, radius: 1.3,
      label: 'Sentar no sofá', icon: '🛋️',
      highlight: sofaObj,
      onInteract: (g) =>
        sentarOsDois(g, {
          ancora: ancoraSofa,
          jogador: new THREE.Vector3(-0.55, 0.02, 0),
          parceiro: new THREE.Vector3(0.55, 0.02, 0),
          facing: 0,
          foco: focoSofa,
          falas: [[R, 'Cinco minutinhos de descanso.'], [A, 'Dez.']],
          saida: { jogador: [SOFA.x - 1.0, SOFA.z + 2.4], parceiro: [SOFA.x + 1.0, SOFA.z + 2.4], facing: 0 },
        }),
    });

    // ---------------------------------------------------- afundar nos pufes
    // Os dois pufes da direita: a âncora fica no primeiro, e o segundo é um
    // deslocamento dentro dela. Afundado, o quadril desce um pouco.
    const [p1, p2] = PUFES;
    const ancoraPufe = pontoNoMundo(w, p1[0], 0, p1[1]);
    const focoPufe = pontoNoMundo(w, (p1[0] + p2[0]) / 2, 0.8, (p1[1] + p2[1]) / 2);
    w.interact({
      id: 'descanso:pufe',
      x: (p1[0] + p2[0]) / 2 - 0.3, z: (p1[1] + p2[1]) / 2 + 0.6, radius: 1.3,
      label: 'Afundar nos pufes', icon: '🫘',
      onInteract: (g) =>
        sentarOsDois(g, {
          ancora: ancoraPufe,
          jogador: new THREE.Vector3(0, -0.06, 0.12),
          parceiro: new THREE.Vector3(p2[0] - p1[0], -0.06, p2[1] - p1[1] + 0.12),
          facing: 0,
          foco: focoPufe,
          falas: [[A, 'Daqui eu não levanto mais.'], [R, 'Nem eu. Me acorda quando o sinal tocar.']],
          saida: { jogador: [p1[0] - 0.4, p1[1] + 1.2], parceiro: [p2[0] - 0.3, p2[1] + 1.2], facing: 0 },
        }),
    });

    const jogos = revezar<ReadonlyArray<readonly [string, string]>>([
      [[R, 'Tem Uno, dominó e um quebra-cabeça de mil peças.'], [A, 'O de mil peças a gente termina outro dia.']],
      [[A, 'Quem deixou o dominó sem a peça do seis?'], [R, 'Foi o Gatito. Certeza.']],
    ]);
    w.interact({
      id: 'descanso:estante',
      x: 2.9, z: z0 + 1.3, radius: 1.1,
      label: 'Olhar os jogos', icon: '🎲',
      highlight: estante,
      onInteract: (g) => conversa(g, jogos()),
    });
    w.interact({
      id: 'descanso:janela',
      x: x0 + 1.1, z: -1.1, radius: 1.2,
      label: 'Olhar pela janela', icon: '🪟',
      highlight: janela,
      onInteract: (g) =>
        conversa(g, [
          [A, 'Dá pra ver o ginásio daqui.'],
          [R, 'Com a luz acesa. Deve ter treino dos Gatitos.'],
        ]),
    });
    w.interact({
      id: 'descanso:lanches',
      x: x0 + 1.5, z: 1.9, radius: 1.1,
      label: 'Comprar um lanchinho (R$ 3)', icon: '🍫',
      highlight: maquina,
      onInteract: (g) => comprarLanche(g, w),
    });
  },
};

// ================================================= A SALA DOS PROFESSORES

/**
 * A SALA DOS PROFESSORES: a mesa de reunião no meio, os escaninhos na parede
 * da esquerda, o cantinho do café no fundo, e a caminha do Gatito — é aqui
 * que ele cochila entre uma aula e outra.
 */
export const escolaProfessores: SceneDef = {
  id: ESCOLA.professores,
  name: 'Sala dos professores',
  subtitle: 'só professores (e gatinhos)',
  ambient: LUZ_DA_ESCOLA,
  spawn: { x: 3.2, z: 2.6, facing: Math.PI },
  entries: { 'do-corredor': { x: 3.2, z: 2.6, facing: Math.PI } },

  build(w) {
    const { x0, z0 } = cascaDeSala(w, {
      largura: 10, fundo: 8, altura: 3.0, parede: P.wallCream, chao: P.escolaPisoSala,
      textura: assoalhoDeMadeira(2.4, 8), portaX: 3.2,
    });

    // a mesa de reunião e as seis cadeiras em volta
    const MESA = { x: -0.4, z: -0.2 };
    w.add(w.place(diningTable(2.6, 1.2), MESA.x, 0, MESA.z));
    w.blockBox(MESA.x, MESA.z, 1.62, 1.12);
    for (const [dx, dz, rot] of [
      [-0.7, -0.95, 0], [0.7, -0.95, 0], [-0.7, 0.95, Math.PI], [0.7, 0.95, Math.PI],
      [-1.65, 0, Math.PI / 2], [1.65, 0, -Math.PI / 2],
    ] as const) {
      w.add(w.place(chair(P.woodDark), MESA.x + dx, 0, MESA.z + dz, rot));
    }
    // a caneca do Gatito é do tamanho dele
    w.add(w.place(mug(P.gatitoCaramelo), MESA.x + 0.6, 0.78, MESA.z - 0.1)).scale.setScalar(1.9);
    w.add(w.place(mug(P.metalWhite), MESA.x - 0.5, 0.78, MESA.z + 0.2));
    w.add(w.place(mug(P.escolaArmarioAzul), MESA.x - 0.9, 0.78, MESA.z - 0.3));

    // o fundo: o cantinho do café, a geladeira e o quadro de recados
    const bancada = w.add(w.place(counter(2.2), 1.7, 0, z0 + 0.5));
    w.blockBox(1.7, z0 + 0.5, 1.15, 0.38);
    w.add(w.place(cafeteira(), 1.1, 0.98, z0 + 0.52));
    w.add(w.place(mug(P.escolaFaixa), 1.55, 0.98, z0 + 0.62));
    w.add(w.place(mug(P.escolaArmarioAmarelo), 1.8, 0.98, z0 + 0.58));
    w.add(w.place(fridge(), 3.85, 0, z0 + 0.48));
    w.blockBox(3.85, z0 + 0.48, 0.42, 0.4);
    const recados = w.add(w.place(
      cartazDeParede('Recados', ['Reunião: sexta, 16h', 'Quem pegou o grampeador?', 'Não comer o biscoito do Gatito'], 2.0, 1.2),
      -2.2, 1.75, z0 + 0.17,
    ));
    w.add(w.place(relogioDeParede(0.24), -0.4, 2.55, z0 + 0.19));

    // a esquerda: os escaninhos e a janela
    const nichos = w.add(w.place(escaninhos(4, 3), x0 + 0.36, 0, -1.3, Math.PI / 2));
    w.blockBox(x0 + 0.36, -1.3, 0.22, 0.86);
    w.add(w.place(windowFrame(1.4, 1.1), x0 + 0.16, 1.75, 1.6, Math.PI / 2));
    w.add(w.place(pottedPlant(1.1), x0 + 0.6, 0, z0 + 0.6));
    w.blockCircle(x0 + 0.6, z0 + 0.6, 0.3);

    // a caminha do Gatito, no canto da frente
    const CAMINHA = { x: x0 + 1.1, z: 2.6 };
    const caminha = w.add(w.place(caminhaDoGatito(P.escolaArmarioAzul), CAMINHA.x, 0, CAMINHA.z));
    w.blockCircle(CAMINHA.x, CAMINHA.z, 0.5);

    w.door({
      x: 3.2, z: 3.2, radius: 1.2,
      to: ESCOLA.saguao, entry: 'dos-professores',
      label: 'Voltar pro corredor', icon: '🚪',
    });

    w.interact({
      id: 'professores:cafe',
      x: 1.2, z: z0 + 1.4, radius: 1.1,
      label: 'Tomar um cafezinho', icon: '☕',
      highlight: bancada,
      onInteract: async (g) => {
        g.som('gluglu');
        g.toast('Cafezinho de sala dos professores', '☕');
        await conversa(g, [
          [A, 'Café de sala dos professores.'],
          [R, 'O mais forte da escola.'],
        ]);
      },
    });
    w.interact({
      id: 'professores:escaninhos',
      x: x0 + 1.3, z: -1.3, radius: 1.2,
      label: 'Olhar os escaninhos', icon: '🗂️',
      highlight: nichos,
      onInteract: (g) =>
        conversa(g, [
          [A, 'Tem um com o nome do Gatito.'],
          [R, 'E outro com o seu. Professor de espanhol, lembra?'],
          [A, 'Profesor Ari. Me gusta.'],
        ]),
    });
    w.interact({
      id: 'professores:caminha',
      x: CAMINHA.x + 0.9, z: CAMINHA.z - 0.3, radius: 1.1,
      label: 'Olhar a caminha', icon: '🧶',
      highlight: caminha,
      onInteract: async (g) => {
        await conversa(g, [
          [A, 'É aqui que o Gatito cochila entre uma aula e outra.'],
          [R, 'Com o novelo do lado. Achados e perdidos, né.'],
        ]);
        if (!g.flag('escola-professores')) {
          g.setFlag('escola-professores');
          g.unlock({
            id: 'sala-dos-professores',
            title: 'A sala dos professores',
            place: 'Escola do Gatito',
            note: 'Café forte, escaninho com o nome do Gatito e outro com o do Ari, e a caminha azul com o novelo rosa do lado.',
            icon: '☕',
          });
        }
      },
    });
    w.interact({
      id: 'professores:recados',
      x: -2.2, z: z0 + 1.2, radius: 1.1,
      label: 'Ler os recados', icon: '📝',
      highlight: recados,
      onInteract: (g) =>
        conversa(g, [
          [R, '"Não comer o biscoito do Gatito."'],
          [A, 'Esse recado é pra quem?'],
          [R, 'Pra mim, provavelmente.'],
        ]),
    });
  },
};
