import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  arcoDeEstufa, bancadaDeJardinagem, canteiroDeHorta, planta, regador, tonelDeAgua, vasoDePlanta,
} from '../world/props';
import { interiorDoor } from '../world/furniture';
import { ARI, RENAN } from '../characters/cast';
import { asfalto, calcadaDePedrinha } from '../world/texturasDeChao';
import { toon } from '../core/materials';

/**
 * A ESTUFA DA JOSEFINA — o jardim grande, por dentro.
 *
 * Esta cena e a ETAPA 0 do plano que esta em `docs/MINIGAME-JARDIM.md`: a area
 * foi construida ANTES da quest e antes de qualquer mecanica, que foi o pedido
 * do Renan. Hoje da para entrar, andar e conversar; o roguelite entra por cima
 * dela depois, e ela ja nasceu com a medida dele tomada.
 *
 * PLANTA (a camera ve `-Z` subindo a direita e `-X` subindo a esquerda):
 *
 *      ┌───── canteiros do fundo (z = -8,8) ─────┐
 *   b  │                                          │  t
 *   a  │            O TERREIRO                    │  o
 *   n  │        15 x 11 de saibro,                │  n
 *   c  │            VAZIO                         │  e
 *   a  │                                          │  l
 *      └──── canteiros da frente (z = 8,8) ───┬───┘
 *                                         a PORTA (z = 11)
 *
 * TRES DECISOES QUE NAO SAO ENFEITE, e que o minigame vai cobrar:
 *
 * 1. **O MEIO E VAZIO.** O terreiro de saibro nao tem uma peca em cima, e o
 *    teste (`scripts/estufa.mjs`) prova isso medindo os colisores. E a arena:
 *    survivor sem espaco para correr nao e survivor.
 * 2. **OS CANTEIROS ESTAO NA BEIRADA, e sao oito.** Sao eles que se defende, e
 *    estar na beirada e o que obriga o jogador a escolher um lado — se
 *    estivessem no meio, ficar parado em cima deles seria a jogada otima e nao
 *    haveria jogo.
 * 3. **OS QUATRO CANTOS ESTAO LIVRES.** Sao as bocas por onde os bichos vao
 *    entrar. Nada de movel, nada de vaso, nada de colisor neles.
 *
 * POR QUE NAO TEM TETO. Numa camera isometrica um teto sobre 30 x 22 tapa o
 * cenario inteiro. Quem faz a estufa parecer estufa aqui sao os ARCOS
 * (`arcoDeEstufa`) — duas pernas e uma meia-lua de cantoneira, sem pano de
 * vidro nenhum: lê como cobertura e deixa a camera passar.
 */

const W = 30;
const D = 22;
const hx = W / 2;
const hz = D / 2;

/** o terreiro limpo do meio — a arena do minigame */
const TERREIRO = { largura: 15, profundidade: 11 };

/** o vao da porta, na parede da frente */
const PORTA = { x: 0, z: hz, largura: 1.9, altura: 2.4 };

/**
 * ONDE FICAM OS OITO CANTEIROS.
 *
 * Seis nas paredes de fundo e frente, dois deitados nas laterais. Os das
 * laterais vao girados 90 graus: canteiro nao tem frente, entao girar nao
 * esconde nada — e alinhar todos no mesmo eixo faria a estufa parecer um
 * estacionamento de canteiro.
 */
const CANTEIROS = [
  { x: -6.6, z: -8.8, tipo: 'alface', giro: 0 },
  { x: 0, z: -8.8, tipo: 'tomate', giro: 0 },
  { x: 6.6, z: -8.8, tipo: 'girassol', giro: 0 },
  { x: -6.6, z: 8.8, tipo: 'samambaia', giro: 0 },
  { x: 0, z: 8.8, tipo: 'lavanda', giro: 0 },
  { x: 6.6, z: 8.8, tipo: 'suculenta', giro: 0 },
  { x: -12.4, z: 0, tipo: 'tomate', giro: Math.PI / 2 },
  { x: 12.4, z: 0, tipo: 'alface', giro: Math.PI / 2 },
] as const;

export const estufa: SceneDef = {
  id: 'estufa',
  name: 'A estufa da Josefina',
  subtitle: 'onde ela guarda as coisas sérias',
  ambient: {
    // vidro esverdeado por cima: a luz aqui e mais quente e mais fechada que a
    // do clube, e e por isso que entrar na estufa PARECE entrar em algum lugar
    sky: 0xcdead9,
    fog: 0xdaf0e4,
    fogNear: 40,
    fogFar: 130,
    sunColor: 0xfff4dc,
    sunIntensity: 1.5,
    ambientColor: 0xe2f4e6,
    ambientIntensity: 1.2,
    sunDir: [10, 20, 8],
  },
  spawn: { x: PORTA.x, z: hz - 2.4, facing: Math.PI },
  entries: {
    // quem entra pela porta cai um passo para dentro dela, ja de costas para a
    // saida e olhando para o fundo da estufa
    'do-jardim': { x: PORTA.x, z: hz - 2.4, facing: Math.PI },
  },

  build(w) {
    const g = w.game;
    const A = ARI.name;
    const R = RENAN.name;
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };

    // ----------------------------------------------------------------- chao
    // terra batida no geral, saibro no terreiro. As duas cores sao proximas de
    // proposito: o terreiro precisa LER como area limpa sem virar uma mancha
    // clara no meio da estufa.
    // a terra batida leva o GRAO do asfalto (que e so um agregado quase branco,
    // e multiplica a cor): 30 x 22 de marrom chapado lê como papel colorido, e
    // e o mesmo conserto que o gramado do clube ja levou
    w.ground({ width: W + 4, depth: D + 4, color: P.estufaChao, textura: asfalto(1.6) });
    w.patch(
      0, 0, TERREIRO.largura, TERREIRO.profundidade, P.estufaSaibro, 0, 0.012,
      calcadaDePedrinha(0.4, 5),
    );
    // os dois caminhos que ligam o terreiro as paredes, para o saibro nao ficar
    // uma ilha no meio da terra
    w.patch(0, 0, 2.2, D - 1.5, P.estufaSaibro, 0, 0.016, calcadaDePedrinha(0.4, 5));
    w.patch(0, 0, W - 1.5, 2.2, P.estufaSaibro, 0, 0.016, calcadaDePedrinha(0.4, 5));

    w.setBounds(-hx + 0.8, -hz + 0.8, hx - 0.8, hz - 0.8);

    // -------------------------------------------------------------- as paredes
    /**
     * PAREDE ALTA SO EM `-X` E `-Z` (regra da skill de cenario): dos dois lados
     * que a camera olha de frente, mureta baixa, senao o vidro tapa a estufa
     * inteira. Como e tudo vidro, a diferenca de altura quase nao aparece — o
     * que se ve nos dois lados abertos e a soleira e os montantes.
     */
    w.wall(-hx, -hz, hx, -hz, 3.2, P.estufaVidro, 0.18);
    w.wall(-hx, -hz, -hx, hz, 3.2, P.estufaVidro, 0.18);
    w.wall(hx, -hz, hx, hz, 0.62, P.estufaVidro, 0.18);
    // a parede da frente vem partida em duas, com o vao da porta no meio
    const meiaFrente = (W - PORTA.largura) / 2;
    for (const s of [-1, 1] as const) {
      const xIni = s * (PORTA.largura / 2);
      w.wall(xIni, hz, xIni + s * meiaFrente, hz, 0.62, P.estufaVidro, 0.18);
    }

    // a soleira de alvenaria correndo por baixo de tudo, que e o que tira o
    // vidro de cima do chao — vidro terminando no piso serrilha na beirada
    for (const [x, z, larg, prof] of [
      [0, -hz, W + 0.4, 0.34],
      [0, hz, W + 0.4, 0.34],
      [-hx, 0, 0.34, D + 0.4],
      [hx, 0, 0.34, D + 0.4],
    ] as const) {
      const soleira = new THREE.Mesh(
        new THREE.BoxGeometry(larg, 0.22, prof), toon(P.estufaBase),
      );
      soleira.position.set(x, 0.11, z);
      w.add(soleira);
    }

    /**
     * OS ARCOS. Cinco, de 6 em 6 no eixo X, cada um vencendo a profundidade
     * inteira. Eles sao a unica coisa que diz "isto tem cobertura", e sao
     * finos o bastante (16 cm) para nao tirarem nada da vista de cima.
     */
    for (const x of [-12, -6, 0, 6, 12]) {
      w.add(w.place(arcoDeEstufa(D, 5.4, 2.2), x, 0, 0));
    }

    // ---------------------------------------------------------------- a porta
    const batentes = new THREE.Group();
    for (const s of [-1, 1] as const) {
      const poste = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, PORTA.altura, 0.16), toon(P.estufaEstrutura),
      );
      poste.position.set(s * (PORTA.largura / 2 + 0.07), PORTA.altura / 2, PORTA.z);
      batentes.add(poste);
    }
    const verga = new THREE.Mesh(
      new THREE.BoxGeometry(PORTA.largura + 0.34, 0.16, 0.2), toon(P.estufaEstrutura),
    );
    verga.position.set(PORTA.x, PORTA.altura + 0.08, PORTA.z);
    batentes.add(verga);
    w.add(batentes);

    // a folha, centrada NA LINHA da parede (a regra do batente: folha deslocada
    // deixa a face dela no mesmo plano da face da parede, e as duas piscam)
    const folha = w.add(w.place(
      interiorDoor(P.estufaEstrutura, PORTA.largura - 0.16, PORTA.altura - 0.14, 0.2),
      PORTA.x, 0, PORTA.z,
    ));

    w.door({
      x: PORTA.x, z: hz - 1.6,
      to: 'clube', entry: 'da-estufa',
      label: 'Voltar pro jardim', icon: '🚪',
      highlight: folha,
    });

    // ------------------------------------------------------------ os canteiros
    for (const { x, z, tipo, giro } of CANTEIROS) {
      w.add(w.place(canteiroDeHorta(tipo, 3.2, 1.6, ((x + z) / 7) % 1), x, 0, z, giro));
      // o colisor acompanha o giro: nos dois deitados a caixa troca de eixo
      if (giro === 0) w.blockBox(x, z, 1.6, 0.8);
      else w.blockBox(x, z, 0.8, 1.6);
    }

    // ------------------------------------------- a oficina, na parede esquerda
    const bancada = w.add(w.place(bancadaDeJardinagem(2.8), -hx + 1.1, 0, -4.6, Math.PI / 2));
    w.blockBox(-hx + 1.1, -4.6, 0.45, 1.4);
    // o regador do plano (§4 do MINIGAME-JARDIM) largado ao lado dela: ele ja
    // esta no cenario muito antes de virar arma
    w.add(w.place(regador(), -hx + 1.5, 0, -2.8, 1.1));

    const tonel = w.add(w.place(tonelDeAgua(1.25), -hx + 1.2, 0, 4.4));
    w.blockCircle(-hx + 1.2, 4.4, 0.55);
    const tonelMenor = w.add(w.place(tonelDeAgua(0.95), -hx + 1.1, 0, 5.9));
    w.blockCircle(-hx + 1.1, 5.9, 0.42);

    // ------------------------------------ as mudas em vaso, na parede direita
    // Elas sobem parte das plantas do chao: um galpao com tudo na mesma altura
    // fica achatado na camera isometrica, e os vasos sao o que da relevo.
    const bancadaDois = w.add(w.place(bancadaDeJardinagem(2.4), hx - 1.1, 0, 4.6, -Math.PI / 2));
    w.blockBox(hx - 1.1, 4.6, 0.45, 1.2);
    for (const [z, tipo, alto] of [
      [-5.6, 'samambaia', 0.4],
      [-4.2, 'girassol', 0.32],
      [-2.8, 'suculenta', 0.3],
      [1.4, 'lavanda', 0.36],
    ] as const) {
      w.add(w.place(vasoDePlanta(tipo, alto, ((z + 9) / 11) % 1), hx - 1.2, 0, z));
      w.blockCircle(hx - 1.2, z, 0.26);
    }

    // as mudinhas plantadas direto na terra, encostadas nas paredes de fundo e
    // de frente. Sem colisor: tem 30 cm, e cercar isso faria um labirinto
    for (let i = 0; i < 9; i++) {
      const x = -10.4 + i * 2.6;
      w.add(w.place(planta('lavanda', 1.1, (i * 0.31) % 1), x, 0, -hz + 1.0));
      w.add(w.place(planta('suculenta', 1.05, (i * 0.47) % 1), x, 0, hz - 1.0));
    }

    // =========================================================== as conversas

    let jaOlhou = false;
    w.interact({
      id: 'estufa:bancada',
      x: -hx + 2.1, z: -4.6, radius: 1.8,
      label: 'Olhar a bancada', icon: '🪴',
      highlight: bancada,
      onInteract: async (api) => {
        if (!jaOlhou) {
          jaOlhou = true;
          await conversa([
            [A, 'Olha o tamanho disso aqui. A horta lá fora era o quintal — ISTO é o trabalho dela.'],
            [R, 'Tem vaso vazio esperando muda, terra ensacada, tudo etiquetado. Ela pensou em cada coisa.'],
            [A, 'E tá tudo limpo. Nada de bagunça de oficina.'],
            [R, 'Quem cuida de planta aprende a esperar. Quem espera arruma as coisas enquanto isso.'],
          ]);
          api.unlock({
            id: 'estufa-da-josefina',
            title: 'A estufa da Josefina',
            place: 'Clube',
            note: 'Atrás da horta tinha uma porta de vidro, e atrás dela um jardim inteiro. Ela nunca contou — só deixou a porta destrancada.',
            icon: '🪴',
          });
          return;
        }
        await conversa([
          [R, 'Os vasinhos estão em ordem de tamanho. Ela ia gostar de saber que a gente reparou.'],
          [A, 'Eu ia gostar de saber onde ela arruma paciência pra isso.'],
        ]);
      },
    });

    w.interact({
      id: 'estufa:tonel',
      x: -hx + 2.2, z: 4.4, radius: 1.8,
      label: 'Espiar o tonel', icon: '💧',
      highlight: tonel,
      onInteract: async () => {
        await conversa([
          [A, 'Água da chuva. Tem até folha boiando.'],
          [R, 'É de propósito, sabia? Planta não gosta muito de água de torneira.'],
          [A, 'Como é que você sabe disso?'],
          [R, 'Eu ouvi a Josefina falando. Eu ouço as coisas.'],
        ]);
      },
    });

    w.interact({
      id: 'estufa:terreiro',
      x: 0, z: 0, radius: 2.2,
      label: 'Olhar o terreiro', icon: '👀',
      onInteract: async () => {
        await conversa([
          [R, 'Repara que o meio tá vazio. Tudo plantado na beirada, e o centro limpo.'],
          [A, 'Sobrou espaço ou foi de propósito?'],
          [R, 'Com ela? Foi de propósito. Só não sei ainda pra quê.'],
        ]);
      },
    });

    // o segundo tonel e a segunda bancada ficam so de cenario por enquanto —
    // marcados aqui para o minigame achar depois sem ter que varrer a cena
    w.root.userData.pontosDoJardim = {
      terreiro: { x: 0, z: 0, ...TERREIRO },
      tonel: { x: -hx + 1.2, z: 4.4 },
      tonelReserva: { x: tonelMenor.position.x, z: tonelMenor.position.z },
      oficina: { x: bancadaDois.position.x, z: bancadaDois.position.z },
      canteiros: CANTEIROS.map(({ x, z }) => ({ x, z })),
      bocas: [
        { x: -hx + 2, z: -hz + 2 }, { x: hx - 2, z: -hz + 2 },
        { x: -hx + 2, z: hz - 2 }, { x: hx - 2, z: hz - 2 },
      ],
    };
  },
};
