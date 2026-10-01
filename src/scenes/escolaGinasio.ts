import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import {
  bolaDeBasquete, carrinhoDeBolas, cartazDeParede, cestaDeBasquete, logoDaEscola, placarDeGinasio, windowFrame,
} from '../world/furniture';
import { bleachers, waterFountain } from '../world/props';
import { PREMIOS_DA_FESTA } from '../world/itens';
import { Particulas } from '../world/particulas';
import { assoalhoDeMadeira } from '../world/texturasDeChao';
import { ARI, RENAN } from '../characters/cast';
import type { CoelhaDaTorcida } from '../entities/bichos/CoelhaDaTorcida';
import {
  ESCOLA, LUZ_DA_ESCOLA, cascaDeSala, conversa, pontoNoMundo, posicionarParaConversar, sentarOsDois,
  soltarDaConversa,
} from './escolaComum';
import type { Irma } from '../minigames/aula/apostila';
import type { WorldBuilder } from '../world/WorldBuilder';
import {
  NOME_DA_IRMA, aulaDaVez, chamarAula, emAula, irmasNoGinasioAgora, moduloUmConcluido, novaIrma, podeChamarAula,
} from './escolaAula';

/**
 * =============================================== O GINÁSIO DA ESCOLA DO GATITO
 *
 * "Pode ter algum lugar para jogar esportes, como um ginásio também" — o
 * Renan. É a casa dos Gatitos, o time da escola: a quadra de basquete com as
 * duas cestas, a arquibancada no fundo, o placar e as faixas da torcida.
 *
 * A QUADRA CORRE NO X, com as cestas nas pontas esquerda e direita. Correndo
 * no Z, a cesta da frente ficaria entre a câmera e a quadra, com a tabela
 * tapando o garrafão inteiro; no X as duas ficam de perfil, e o que a tabela
 * esconde (1,5 × a altura dela, para cima e para a esquerda na tela) cai quase
 * todo fora da quadra.
 *
 * O ARREMESSO: na linha do lance livre de cada cesta, "Arremessar a bola". A
 * bola sai da mão num arco até o aro; entrou, ela cai pela rede e quica; não
 * entrou, ela bate no aro e espirra. A primeira sempre entra — é presente.
 */

const A = ARI.name;
const R = RENAN.name;

const GIN = { largura: 26, fundo: 18, altura: 5.0, portaX: 9 };
/**
 * A PORTA DO VESTIÁRIO (pedido do Renan: "um vestiário para a escola, para
 * facilitar a troca de roupa" — só a porta, sem cenário novo): na parede do
 * FUNDO, no canto direito, depois da arquibancada e fora da quadra. É a parede
 * que a câmera vê de frente, e o corredor entre a cesta e a parede da direita
 * leva até ela.
 */
const VESTIARIO = { x: 11.4, largura: 1.2 };
/** a quadra: 22 × 12, com o meio em z = -0,5 */
const QUADRA = { x: 0, z: -0.5, largura: 22, fundo: 12 };
/** o aro: altura de verdade (3,05), e onde cada cesta fica */
const ARO_Y = 3.05;
/** a distância do lance livre até a linha de fundo */
const LANCE_LIVRE = 5.8;

export const escolaGinasio: SceneDef = {
  id: ESCOLA.ginasio,
  name: 'Ginásio',
  subtitle: 'a casa dos Gatitos',
  ambient: { ...LUZ_DA_ESCOLA, sky: 0xe8e3d6 },
  spawn: { x: GIN.portaX, z: 7.2, facing: Math.PI },
  entries: { 'do-saguao': { x: GIN.portaX, z: 7.2, facing: Math.PI } },

  build(w) {
    const g0 = w.game;
    const { x0, z0 } = cascaDeSala(w, {
      ...GIN, parede: P.escolaParede, barra: P.escolaBarra, chao: P.escolaQuadra, textura: assoalhoDeMadeira(2.4, 10),
      vaosDoFundo: [{ c: VESTIARIO.x, largura: VESTIARIO.largura, porta: { cor: P.escolaArmarioAzul, largura: 1.0 } }],
    });

    // ================================================================ QUADRA
    // Pintada no chão, de baixo para cima: os garrafões azuis, depois as linhas.
    const meiaL = QUADRA.largura / 2;
    const meiaF = QUADRA.fundo / 2;
    const linha = P.escolaQuadraLinha;
    for (const lado of [-1, 1]) {
      w.patch(QUADRA.x + lado * (meiaL - LANCE_LIVRE / 2), QUADRA.z, LANCE_LIVRE, 4.9, P.escolaQuadraGarrafao, 0, 0.004);
    }
    const L = 0.08;
    w.patch(QUADRA.x, QUADRA.z - meiaF, QUADRA.largura, L, linha, 0, 0.008);
    w.patch(QUADRA.x, QUADRA.z + meiaF, QUADRA.largura, L, linha, 0, 0.008);
    w.patch(QUADRA.x - meiaL, QUADRA.z, L, QUADRA.fundo, linha, 0, 0.008);
    w.patch(QUADRA.x + meiaL, QUADRA.z, L, QUADRA.fundo, linha, 0, 0.008);
    w.patch(QUADRA.x, QUADRA.z, L, QUADRA.fundo, linha, 0, 0.008);
    w.ring(QUADRA.x, QUADRA.z, 1.8, L, linha, 0.008);
    for (const lado of [-1, 1]) {
      const xLance = QUADRA.x + lado * (meiaL - LANCE_LIVRE);
      w.ring(xLance, QUADRA.z, 1.8, L, linha, 0.008);
      w.patch(xLance, QUADRA.z, L, 4.9, linha, 0, 0.008);
      w.patch(QUADRA.x + lado * (meiaL - LANCE_LIVRE / 2), QUADRA.z - 2.45, LANCE_LIVRE, L, linha, 0, 0.008);
      w.patch(QUADRA.x + lado * (meiaL - LANCE_LIVRE / 2), QUADRA.z + 2.45, LANCE_LIVRE, L, linha, 0, 0.008);
    }

    // ------------------------------------------------------------ as cestas
    // A peça olha para +Z; girada, a tabela olha para dentro da quadra.
    const aros: Array<{ x: number; z: number; lado: number }> = [];
    for (const lado of [-1, 1]) {
      // a tabela fica ~1 m para dentro da linha de fundo, e o aro a 4,6 da
      // linha do lance livre — a medida de quadra de verdade
      const xBase = QUADRA.x + lado * (meiaL - 0.9);
      w.add(w.place(cestaDeBasquete(), xBase, 0, QUADRA.z, -lado * Math.PI / 2));
      // o poste fica 1,2 atrás da tabela; é ele que colide
      w.blockBox(xBase + lado * 1.2, QUADRA.z, 0.3, 0.3);
      aros.push({ x: xBase - lado * 0.26, z: QUADRA.z, lado });
    }

    // ====================================================== ARQUIBANCADA
    // Três degraus encostados no fundo, virados para a quadra.
    const ARQ_Z = z0 + 0.15 + 1.29;
    for (const x of [-6, 6]) {
      w.add(w.place(bleachers(8), x, 0, ARQ_Z));
      w.blockBox(x, ARQ_Z - 0.5, 4, 0.82);
    }

    // o placar e as faixas, na parede do fundo por cima da arquibancada
    const placar = w.add(w.place(placarDeGinasio('GATITOS', '67', 'VISITA', '66'), 0, 3.5, z0 + 0.27));
    w.add(w.place(cartazDeParede('GATITOS', ['campeões 2026'], 3.2, 1.2, '#3d68ad', '#ffe39a'), -7, 3.4, z0 + 0.17));
    w.add(w.place(cartazDeParede('VAI, GATITOS!', [], 3.6, 1.0, '#d9483f', '#ffffff'), 7, 3.4, z0 + 0.17));

    // a parede da esquerda: as janelas altas e o logo da escola
    for (const z of [-5.5, -1.5]) {
      w.add(w.place(windowFrame(1.8, 1.1), x0 + 0.16, 3.6, z, Math.PI / 2));
    }
    w.add(w.place(logoDaEscola('Gatitos', 3.6, 1.0), x0 + 0.19, 3.2, 4.6, Math.PI / 2));

    // o carrinho de bolas e o bebedouro, fora da quadra
    w.add(w.place(carrinhoDeBolas(), -9.5, 0, 7.3, 0.2));
    w.blockCircle(-9.5, 7.3, 0.55);
    w.add(w.place(waterFountain(), x0 + 0.42, 0, 7.6, Math.PI / 2));
    w.blockCircle(x0 + 0.42, 7.6, 0.32);

    // ====================================================== O VESTIÁRIO
    // A porta abre direto o painel: o guarda-roupa de sempre e a aba dos
    // UNIFORMES da escola (`abrirVestiarioDaEscola`)
    w.add(w.place(cartazDeParede('VESTIÁRIO', [], 1.5, 0.42, '#3d68ad', '#ffe39a'), VESTIARIO.x, 2.5, z0 + 0.17));
    w.interact({
      id: 'ginasio:vestiario',
      x: VESTIARIO.x, z: z0 + 1.1, radius: 1.3,
      label: 'Vestiário', icon: '👕',
      onInteract: async (g) => {
        if (!g.flag('vestiario-da-escola')) {
          g.setFlag('vestiario-da-escola');
          await conversa(g, [
            [R, 'O vestiário dos Gatitos. Tem armário até pra gente.'],
            [A, 'Então dá pra trocar de roupa aqui mesmo, sem voltar pra casa?'],
          ]);
        }
        g.abrirVestiarioDaEscola();
      },
    });

    w.door({
      x: GIN.portaX, z: GIN.fundo / 2 - 0.8, radius: 1.2,
      to: ESCOLA.saguao, entry: 'do-ginasio',
      label: 'Voltar pro saguão', icon: '🚪',
    });

    // ====================================================== ARQUIBANCADA
    // Sentar no segundo degrau: o tampo dele fica em 0,67, e o quadril do rig
    // mora ~0,47 acima da origem — daí os 0,2 da âncora.
    const DEGRAU = { y: 0.2, z: ARQ_Z - 0.5 };
    const ancoraArq = pontoNoMundo(w, -6, 0, DEGRAU.z);
    const focoArq = pontoNoMundo(w, -6, 1.2, DEGRAU.z + 1.5);
    w.interact({
      id: 'ginasio:arquibancada',
      x: -6, z: ARQ_Z + 1.1, radius: 1.5,
      label: 'Sentar na arquibancada', icon: '📣',
      onInteract: (g) =>
        sentarOsDois(g, {
          ancora: ancoraArq,
          jogador: new THREE.Vector3(-0.5, DEGRAU.y, 0),
          parceiro: new THREE.Vector3(0.5, DEGRAU.y, 0),
          facing: 0,
          foco: focoArq,
          falas: [[R, 'Daqui dá pra ver o jogo inteiro.'], [A, 'Vai, Gatitos!']],
          saida: { jogador: [-6.6, ARQ_Z + 1.3], parceiro: [-5.4, ARQ_Z + 1.3], facing: 0 },
        }),
    });

    w.interact({
      id: 'ginasio:placar',
      x: 0, z: ARQ_Z + 1.2, radius: 1.3,
      label: 'Olhar o placar', icon: '🔢',
      highlight: placar,
      onInteract: (g) =>
        conversa(g, [
          [A, 'Gatitos sessenta e sete...'],
          [R, 'Six seven. Isso tem a pata do Gatito.'],
        ]),
    });

    // ======================================================= AS IRMÃS TREINANDO
    montarAsIrmas(w);

    // ======================================================== O ARREMESSO
    const bola = bolaDeBasquete(0.12);
    bola.visible = false;
    w.add(bola);

    /** o voo em andamento: `null` quando a bola está guardada */
    let voo: {
      fase: 'arco' | 'solta';
      t: number;
      dur: number;
      de: THREE.Vector3;
      ate: THREE.Vector3;
      pico: number;
      vel: THREE.Vector3;
      quiques: number;
      vida: number;
      acerta: boolean;
      pronto: () => void;
    } | null = null;

    w.onUpdate((dt) => {
      if (!voo) return;
      if (voo.fase === 'arco') {
        voo.t = Math.min(1, voo.t + dt / voo.dur);
        const s = voo.t;
        bola.position.lerpVectors(voo.de, voo.ate, s);
        bola.position.y += voo.pico * 4 * s * (1 - s);
        bola.rotation.z -= dt * 8;
        if (s >= 1) {
          voo.fase = 'solta';
          // o resultado sai AQUI, na chegada ao aro: a dupla não espera a bola
          // terminar de quicar para comemorar
          voo.pronto();
          if (voo.acerta) {
            // entrou: cai reto pela rede
            voo.vel.set(0, -1.2, 0);
            g0.som('pegar');
          } else {
            // bateu no aro: espirra para fora e para cima
            const lado = voo.ate.x > 0 ? -1 : 1;
            voo.vel.set(lado * 1.6, 2.2, (w.rng() - 0.5) * 2);
            g0.som('quicar');
          }
        }
        return;
      }
      // solta: gravidade, quique no chão, e o atrito até parar
      voo.vida += dt;
      voo.vel.y -= 9.8 * dt;
      bola.position.addScaledVector(voo.vel, dt);
      bola.rotation.x += voo.vel.z * dt * 6;
      bola.rotation.z -= voo.vel.x * dt * 6;
      if (bola.position.y < 0.12) {
        bola.position.y = 0.12;
        if (Math.abs(voo.vel.y) > 0.9 && voo.quiques < 4) {
          voo.vel.y = -voo.vel.y * 0.55;
          voo.quiques++;
          g0.som('quicar');
        } else {
          voo.vel.y = 0;
        }
        voo.vel.x *= 0.92;
        voo.vel.z *= 0.92;
      }
      if (voo.vida > 2.0) {
        bola.visible = false;
        voo = null;
      }
    });

    const arremessar = async (g: GameAPI, aro: { x: number; z: number; lado: number }): Promise<void> => {
      // a bola ainda no ar não se pega de volta; quicando no chão, sim
      if (voo?.fase === 'arco') return;
      g.lockPlayer(true);
      g.mirarJogador({ x: aro.x, z: aro.z });
      await g.wait(0.25);
      // a primeira sempre entra; depois, seis em cada dez
      const primeira = !g.flag('escola-primeira-cesta');
      const acerta = primeira || w.rng() < 0.6;
      const eu = g.playerPosition();
      const dir = new THREE.Vector3(aro.x - eu.x, 0, aro.z - eu.z).normalize();
      const de = new THREE.Vector3(eu.x + dir.x * 0.35, 1.85, eu.z + dir.z * 0.35);
      const ate = acerta
        ? new THREE.Vector3(aro.x, ARO_Y + 0.14, aro.z)
        : new THREE.Vector3(aro.x + aro.lado * 0.26, ARO_Y + 0.1, aro.z + 0.12);
      bola.position.copy(de);
      bola.visible = true;
      g.pularJogador(0.3, 0.45);
      g.som('lancar');
      await new Promise<void>((pronto) => {
        voo = {
          fase: 'arco', t: 0, dur: 1.0, de, ate, pico: 1.3,
          vel: new THREE.Vector3(), quiques: 0, vida: 0, acerta, pronto,
        };
      });
      g.mirarJogador(null);

      if (acerta) {
        const cestas = g.bump('escola.cestas');
        g.toast(cestas === 1 ? 'Cesta!' : `Cesta! (${cestas} no total)`, '🏀');
        if (primeira) {
          g.setFlag('escola-primeira-cesta');
          await conversa(g, [
            [g.companionName(), 'Entrou!'],
            [g.playerName(), 'De primeira!'],
          ]);
          g.unlock({
            id: 'cesta-no-ginasio',
            title: 'Cesta de primeira',
            place: 'Escola do Gatito',
            note: 'O ginásio dos Gatitos, placar marcando sessenta e sete, e a primeira bola entrou limpa.',
            icon: '🏀',
          });
        } else {
          await g.say([w.pick(['Boa!', 'Linda!', 'Nem encostou no aro.'])], g.companionName());
        }
      } else {
        g.toast('Bateu no aro...', '🏀');
        await g.say([w.pick(['Quase!', 'Foi por um triz.', 'Tenta de novo!'])], g.companionName());
      }
      g.lockPlayer(false);
    };

    for (const aro of aros) {
      const xLance = QUADRA.x + aro.lado * (meiaL - LANCE_LIVRE);
      w.interact({
        id: `ginasio:arremesso-${aro.lado > 0 ? 'direita' : 'esquerda'}`,
        x: xLance, z: QUADRA.z, radius: 1.3,
        label: 'Arremessar a bola', icon: '🏀',
        onInteract: (g) => arremessar(g, aro),
      });
    }

    // a primeira visita
    if (!g0.flag('escola-ginasio')) {
      g0.setFlag('escola-ginasio');
      g0.toast('A casa dos Gatitos', '🏀');
    }
  },
};

/**
 * =================================================== AS IRMÃS NO GINÁSIO
 *
 * Depois de mostrar a escola, a Luna mora aqui (`luna-na-escola`), treinando
 * a coreografia com os pompons em loop — e, conforme as aulas passam, as
 * irmãs chegam (pedido do Renan): antes da primeira aula só a Luna; depois
 * dela, a Luna e a SOL; depois da segunda, as três, a ESTRELLA também
 * (`irmasNoGinasio`). Treinam juntas, no mesmo tempo, como torcida de verdade.
 *
 * ONDE CADA UMA FICA: numa fila na HORIZONTAL DA TELA, a Luna no meio da
 * quadra, a Sol à esquerda e a Estrella à direita, a 3 de distância. Na
 * horizontal da tela nenhuma tapa a outra; e a 3, quem conversa com uma (a
 * dupla vai para a frente-direita dela, `posicionarParaConversar`) não pisa
 * na vizinha. De frente para a câmera, longe das linhas de lance livre, que
 * são do arremesso.
 *
 * O TREINO TEM ACROBACIA: de tempos em tempos a Sol dá o SALTO e a Estrella a
 * ESTRELINHA — uma vez para cada lado, então ela sempre volta ao lugar.
 *
 * A MISSÃO DA AULA: a aula tem dona (`aula.chama`: a 1 a Luna, a 2 a Sol, a 3
 * a Estrella). Conversar com a dona: a conversa de sempre, a APRESENTAÇÃO
 * dela (a Sol mostra o salto, a Estrella a estrelinha, a Luna torce), e então
 * o SINAL toca e ela avisa da aula — e as irmãs do ginásio vão na frente
 * guardar lugar. Conversar com outra irmã, ela manda falar com a dona. Da
 * aula 4 em diante (`qualquer`), não há dona: qualquer uma das três torce e
 * chama, e as três vão juntas. Com a aula chamada, elas estão na Sala 1, e
 * não aqui.
 */
function montarAsIrmas(w: WorldBuilder): void {
  const g0 = w.game;
  if (!g0.flag('luna-na-escola') || emAula(g0)) return;

  const TREINO = { x: QUADRA.x, z: QUADRA.z + 2.9 };
  /** a horizontal da tela (a câmera olha de `+X/+Z`) */
  const DIREITA_DA_TELA = { x: Math.SQRT1_2, z: -Math.SQRT1_2 };
  const ESPACO = 3;
  const POSTOS: Record<Irma, { x: number; z: number }> = {
    luna: TREINO,
    sol: { x: TREINO.x - DIREITA_DA_TELA.x * ESPACO, z: TREINO.z - DIREITA_DA_TELA.z * ESPACO },
    estrella: { x: TREINO.x + DIREITA_DA_TELA.x * ESPACO, z: TREINO.z + DIREITA_DA_TELA.z * ESPACO },
  };
  const PARA_A_CAMERA = { x: 10, z: 10 };
  const L = NOME_DA_IRMA.luna;
  const S = NOME_DA_IRMA.sol;
  const E = NOME_DA_IRMA.estrella;

  interface NoGinasio {
    id: Irma;
    bicho: CoelhaDaTorcida;
    colisor: { kind: 'circle'; x: number; z: number; r: number };
    conversando: boolean;
    indo: boolean;
  }
  const presentes: NoGinasio[] = irmasNoGinasioAgora(g0).map((id) => {
    const p = POSTOS[id];
    const bicho = novaIrma(id, { minX: p.x - 0.2, maxX: p.x + 0.2, minZ: p.z - 0.2, maxZ: p.z + 0.2 });
    bicho.entrarEmServico();
    bicho.group.position.set(p.x, 0, p.z);
    bicho.group.rotation.y = Math.PI / 4;
    bicho.encarar(p.x + PARA_A_CAMERA.x, p.z + PARA_A_CAMERA.z);
    bicho.treinar(true);
    w.add(bicho.group);
    const colisor = { kind: 'circle' as const, x: p.x, z: p.z, r: 0.42 };
    w.colliders.push(colisor);
    return { id, bicho, colisor, conversando: false, indo: false };
  });
  const achar = (id: Irma): NoGinasio | undefined => presentes.find((p) => p.id === id);

  // ------------------------------------------------------ as falas de sempre
  /**
   * UMA CONVERSA POR VEZ, revezando. A Luna é a de sempre; a SOL fala alto e
   * está sempre feliz (os gritos saem em maiúscula); a ESTRELLA é calma e
   * sempre preocupada com as irmãs. As três falam português com o espanhol da
   * Venezuela escapando — e nenhuma fala DE ONDE veio.
   */
  const FALAS: Record<Irma, Array<(g: GameAPI, b: CoelhaDaTorcida) => Promise<void>>> = {
    luna: [
      async (g) => {
        await conversa(g, [
          [L, '¡Épale, panas! Vieram me ver treinar?'],
          [L, 'Senta ali na arquibancada que eu faço a coreografia inteira. Do começo!'],
        ]);
      },
      async (g, b) => {
        await conversa(g, [[L, 'Tô ensaiando uma parte nova. Olha só!']]);
        b.torcer(2.8);
        g.som('sacudida');
        await conversa(g, [[L, '¡Vamos, Gatitos! ¡Vamos, Gatitos! ¡Uh!']]);
        b.ficarTimida(2.4);
        await conversa(g, [[L, '...Não olhem tanto. ¡Qué pena!']]);
      },
      async (g, b) => {
        await conversa(g, [
          [L, 'Hoje na aula o Gatito explicou que "esquisito" é estranho. Estranho!'],
          [L, 'Eu achava que era gostoso. Passei um mês elogiando a comida dos outros de esquisita.'],
        ]);
        b.ficarTimida(2.2);
        await conversa(g, [[L, 'Naguará... ninguém me avisou.']]);
      },
      async (g) => {
        await conversa(g, [[L, 'Sabiam que o Gatito cochila na sala dos professores entre uma aula e outra? Tem até caminha. Eu queria ser professora só por isso.']]);
      },
      async (g, b) => {
        b.torcer(1.8);
        g.som('sacudida');
        await conversa(g, [[L, '¡Gatitos! ...Desculpa. Às vezes sai sozinho.']]);
      },
    ],
    sol: [
      async (g, b) => {
        b.torcer(2);
        g.som('sacudida');
        await conversa(g, [[S, '¡ÉPALE, PANAS! ¡Vocês vieram! Hoje eu tô com energia pra treinar o dia INTEIRO!']]);
      },
      async (g) => {
        await conversa(g, [
          [S, 'Sabiam que eu sou a que grita mais alto da torcida? A Estrella diz que dá pra ouvir do estacionamento.'],
          [S, '¡Y ES VERDAD! ¡Jajaja!'],
        ]);
      },
      async (g, b) => {
        b.torcer(2.4);
        g.som('sacudida');
        await conversa(g, [[S, 'G-A-T-I-T-O-S! ¡GATITOS!'], [S, '...Foi alto? Foi alto. ¡Chévere!']]);
      },
      async (g) => {
        await conversa(g, [[S, 'A Luna sabe as coreografias, a Estrella lembra da água, e eu faço o barulho. ¡Time perfeito!']]);
      },
    ],
    estrella: [
      async (g) => {
        await conversa(g, [[E, 'Oi, panas. Tudo bem? Beberam água hoje? Aqui no ginásio faz um calor...']]);
      },
      async (g) => {
        await conversa(g, [
          [E, 'A Sol pula alto demais. Eu fico embaixo, com o coração na mão.'],
          [E, '¡Ay, Dios! Um dia ela vai parar no placar.'],
        ]);
      },
      async (g) => {
        await conversa(g, [[E, 'A Luna fala muito dos Gatitos, né? Deixa ela. É o jeito dela de ser feliz.']]);
      },
      async (g) => {
        await conversa(g, [[E, 'Eu treino a estrelinha todo dia. Devagar e bem feita, que é pra ninguém se machucar.']]);
      },
    ],
  };

  /** o que cada uma diz quando a aula é de OUTRA irmã: "fala com ela" */
  const MANDA_PARA: Record<Irma, Record<Irma, string>> = {
    luna: {
      luna: '',
      sol: 'A Sol tá doida pra mostrar uma coisa pra vocês. Falem com ela, antes que ela exploda!',
      estrella: 'A Estrella quer mostrar uma coisa pra vocês, mas é tímida pra pedir. Falem com ela!',
    },
    sol: {
      luna: '¡La Luna! A Luna é que sabe o horário da aula! Fala com ela!',
      sol: '',
      estrella: '¡PANAS! A Estrella tem uma surpresa! Falem com ela, falem!',
    },
    estrella: {
      luna: 'A Luna sabe o horário da aula. Pergunta pra ela, tá?',
      sol: 'A Sol quer mostrar o salto dela. Vão lá, senão ela não sossega.',
      estrella: '',
    },
  };

  /** sem conhecer o Gatito, ninguém chama aula: elas mandam conhecer o professor */
  const CONHECAM_O_GATITO: Record<Irma, string> = {
    luna: 'Ah! Já conheceram o professor Gatito? Ele vive passeando pelo saguão. Vão lá dar um oi! Depois voltem aqui, que eu sei o horário de todas as aulas.',
    sol: '¡YA VA! Vocês nem conheceram o professor Gatito? ¡Vayan! Ele fica passeando pelo saguão!',
    estrella: 'Vocês já conheceram o professor Gatito? Ele fica no saguão. É um amor.',
  };

  const esperar = async (g: GameAPI, ate: () => boolean): Promise<void> => {
    for (let i = 0; i < 80 && !ate(); i++) await g.wait(0.1);
  };

  // ---------------------------------------------- a apresentação da dona da aula
  /**
   * ANTES DO SINAL, a dona da aula mostra o que treinou (pedido do Renan: "ver
   * ela dando um salto no ginásio", "a Estrella quer mostrar ela dando uma
   * estrelinha"). As irmãs que estão ali reagem.
   */
  const apresentar = async (g: GameAPI, quem: NoGinasio): Promise<void> => {
    const b = quem.bicho;
    if (quem.id === 'sol') {
      await conversa(g, [[S, '¡ÉPALE! Querem ver o meu salto novo? O mais alto dos Gatitos! ¡Miren!']]);
      b.saltar();
      g.som('sacudida');
      await g.wait(0.4);
      await esperar(g, () => !b.estaSaltando);
      b.torcer(1.6);
      await conversa(g, [[S, '¡¿VIRAM?! ¡QUÉ NOTA! Dois metros, no mínimo!']]);
      if (achar('luna')) await conversa(g, [[L, 'Uns setenta centímetros, Sol.'], [S, '¡DOS METROS!']]);
      return;
    }
    if (quem.id === 'estrella') {
      await conversa(g, [
        [E, 'Eu treinei uma coisa... vocês querem ver? Uma estrelinha.'],
        [E, 'Com cuidado, tá? Sem ninguém muito perto.'],
      ]);
      b.estrelinha(-1);
      g.som('trocar');
      await g.wait(0.4);
      await esperar(g, () => !b.estaFazendoEstrelinha);
      const sol = achar('sol');
      sol?.bicho.torcer(2);
      g.som('sacudida');
      if (sol) await conversa(g, [[S, '¡BRAVO! ¡BRAVÍSIMO, MANA!']]);
      if (achar('luna')) await conversa(g, [[L, 'Perfeita, Estrella!']]);
      await conversa(g, [[E, 'Ay... obrigada. Ninguém se machucou, né?']]);
      // e volta andando para o lugar dela
      await b.irPara(POSTOS.estrella.x, POSTOS.estrella.z, 0.9);
      return;
    }
    b.torcer(1.6);
    g.som('sacudida');
  };

  // ------------------------------------------------------------ a saída
  /** chamada a aula, as irmãs do ginásio vão para a Sala 1: uma atrás da outra, até a porta */
  const irParaAula = (): void => {
    presentes.forEach((p, n) => {
      p.indo = true;
      p.bicho.treinar(false);
      p.bicho.pararDeEncarar();
      const i = w.colliders.indexOf(p.colisor);
      if (i >= 0) w.colliders.splice(i, 1);
      void (async () => {
        await g0.wait(n * 0.5);
        await p.bicho.irPara(GIN.portaX - 1.5, GIN.fundo / 2 - 2.5, 1.5);
        await p.bicho.irPara(GIN.portaX, GIN.fundo / 2 - 0.8, 1.5);
        p.bicho.group.visible = false;
      })();
    });
    for (const c of conversas) c.enabled = false;
  };

  // --------------------------------------------------------- as conversas
  const conversas = presentes.map((quem) => {
    const ponto = w.interact({
      id: `ginasio:${quem.id}`,
      x: POSTOS[quem.id].x, z: POSTOS[quem.id].z,
      // sozinha, a Luna tem a quadra toda; com as irmãs, cada uma a sua vez
      radius: presentes.length > 1 ? 1.4 : 1.8,
      label: `Falar com a ${NOME_DA_IRMA[quem.id]}`, icon: quem.id === 'sol' ? '🌞' : quem.id === 'estrella' ? '⭐' : '🐰',
      highlight: quem.bicho.group,
      onInteract: async (g) => {
        const b = quem.bicho;
        quem.conversando = true;
        // uma acrobacia no meio termina antes da conversa (a estrelinha volta ao lugar)
        await esperar(g, () => !b.estaSaltando && !b.estaFazendoEstrelinha);
        if (quem.id === 'estrella') await b.irPara(POSTOS.estrella.x, POSTOS.estrella.z, 0.9);
        b.treinar(false);
        const aqui = { x: b.x, z: b.z };
        const meio = posicionarParaConversar(g, aqui);
        b.encarar(meio.x, meio.z);
        g.focusCamera(b.group);
        g.setZoom(8);
        let chamou = false;
        try {
          // a conversa de sempre primeiro; a aula vem DEPOIS, com o sinal tocando no meio
          const chave = `${quem.id}.conversas`;
          const vez = g.bump(chave);
          const lista = FALAS[quem.id];
          await lista[(vez - 1) % lista.length](g, b);
          const licao = aulaDaVez(g);
          if (licao && podeChamarAula(g)) {
            const dona = licao.aula.chama;
            if (dona === 'qualquer') {
              // sem dona: quem a dupla escolheu comemora, e o sinal toca
              b.encarar(meio.x, meio.z);
              b.torcer(1.6);
              g.som('sacudida');
              await g.wait(0.5);
              await chamarAula(g);
              chamou = true;
            } else if (dona === quem.id) {
              b.encarar(meio.x, meio.z);
              await apresentar(g, quem);
              b.encarar(meio.x, meio.z);
              await chamarAula(g);
              chamou = true;
            } else if (achar(dona)) {
              await conversa(g, [[NOME_DA_IRMA[quem.id], MANDA_PARA[quem.id][dona]]]);
            }
          } else if (licao && !g.flag('gatito-conhecido')) {
            // a aula é do Gatito: sem conhecer o professor, ela manda conhecer primeiro
            await conversa(g, [[NOME_DA_IRMA[quem.id], CONHECAM_O_GATITO[quem.id]]]);
          }
        } finally {
          g.focusCamera(null);
          g.setZoom(13);
          soltarDaConversa(g);
          quem.conversando = false;
          if (chamou) {
            irParaAula();
          } else {
            b.encarar(b.x + PARA_A_CAMERA.x, b.z + PARA_A_CAMERA.z);
            b.treinar(true);
          }
        }
      },
    });
    return ponto;
  });

  // ------------------------------------------------ o treino e as acrobacias
  /** quanto falta para a próxima acrobacia de cada uma (tempo de jogo) */
  const falta: Record<Irma, number> = { luna: 1e9, sol: 7, estrella: 11 };
  let ladoDaEstrelinha: 1 | -1 = -1;
  /** gancho de teste: o `scripts/irmas.mjs` segura as acrobacias sozinhas e aciona na hora */
  let acrobaciasLigadas = true;
  for (const p of presentes) {
    p.bicho.group.userData.teste = {
      [p.id]: p.bicho,
      luna: p.id === 'luna' ? p.bicho : undefined,
      acrobacias: (sim: boolean) => {
        acrobaciasLigadas = sim;
      },
    };
  }
  w.onUpdate((dt) => {
    for (const [n, p] of presentes.entries()) {
      p.bicho.update(dt);
      conversas[n].moveTo(p.bicho.x, p.bicho.z);
      p.colisor.x = p.bicho.x;
      p.colisor.z = p.bicho.z;
      if (!acrobaciasLigadas || p.conversando || p.indo || p.id === 'luna') continue;
      falta[p.id] -= dt;
      if (falta[p.id] > 0) continue;
      if (p.id === 'sol') {
        p.bicho.saltar();
        falta.sol = 9 + ((n * 7 + Math.floor(p.bicho.x * 13)) % 5);
      } else {
        p.bicho.estrelinha(ladoDaEstrelinha);
        ladoDaEstrelinha = ladoDaEstrelinha === 1 ? -1 : 1;
        falta.estrella = 12 + ((n * 5) % 4);
      }
    }
  });

  // ================================================== A FESTA DA TORCIDA
  /**
   * Pedido do Renan: "depois de terminar a última aula desse módulo, as 3
   * coelhinhas chamam para comemorar no ginásio e fazem uma dança de uns 10
   * segundos, uma cutscene inteira. Após isso elas ficam felizes e liberam a
   * roupa das cheerleaders".
   *
   * O convite é no fim da lição 6 (`escolaAula.ts`); a festa acontece na
   * próxima vez que a dupla entra aqui com o módulo inteiro concluído — e vale
   * também para quem já tinha terminado o módulo antes de a festa existir.
   *
   * O PALCO é o lugar de treino, com as três em fila na horizontal da tela (a
   * Estrella à esquerda, a Luna no meio, a Sol à direita) viradas para a
   * câmera; a dupla assiste da frente, à direita. A dança é das coelhinhas
   * (`dancarAFesta`, 10,8 s): a cena só as põe no lugar, liga a música da
   * festa, chama as três no mesmo quadro, e solta o confete no salto final.
   */
  const festaPendente = moduloUmConcluido(g0) && !g0.flag('festa-da-torcida') && presentes.length === 3;
  if (!festaPendente) return;
  const D = DIREITA_DA_TELA;
  const PALCO = TREINO;
  const LUGAR: Record<Irma, { x: number; z: number }> = {
    estrella: { x: PALCO.x - D.x * 1.7, z: PALCO.z - D.z * 1.7 },
    luna: { x: PALCO.x, z: PALCO.z },
    sol: { x: PALCO.x + D.x * 1.7, z: PALCO.z + D.z * 1.7 },
  };

  // o confete: bolinhas nas cores dos Gatitos, chovendo devagar e balançando
  const confete = new Particulas(360, 0.2, 1, 4);
  w.add(confete.malha);
  w.onUpdate((dt) => confete.update(dt));
  /** quem marca a hora do confete: enquanto houver alguém aqui, ele cai quando a dança dela chegar no salto final */
  let confeteNoSalto: CoelhaDaTorcida | null = null;
  w.onUpdate(() => {
    if (!confeteNoSalto || (confeteNoSalto.estaNaFesta && confeteNoSalto.tempoNaFesta < 9.95)) return;
    confeteNoSalto = null;
    soltarConfete();
    g0.som('sacudida');
  });
  const soltarConfete = (): void => {
    const cores = [P.gatitosAmarelo, P.gatitosAzul, P.gatitosBranco, P.lunaPomponAzul, P.flowerPink];
    for (let i = 0; i < 220; i++) {
      const a = i * 2.39996;
      const r = 0.3 + (i % 9) * 0.32;
      confete.emitir({
        x: PALCO.x + Math.cos(a) * r, y: 3.0 + (i % 6) * 0.22, z: PALCO.z + Math.sin(a) * r,
        vx: Math.cos(a) * 0.5, vy: 0.8, vz: Math.sin(a) * 0.5,
        vida: 3.4, tamanho: 0.03 + (i % 3) * 0.008, cor: cores[i % cores.length],
        gravidade: 2.0, arrasto: 1.4, balanco: 0.7,
      });
    }
  };

  /*
   * A câmera mira o MEIO DA DANÇA, não a Luna: a estrelinha da Estrella sai
   * 1,15 para a esquerda da tela, então o que se mexe vai de ~3,3 à esquerda
   * da Luna a ~2,2 à direita — o meio fica 0,58 à esquerda dela, e um tico à
   * frente (para a câmera). A largura (9) cabe isso e a dupla assistindo à
   * direita; `enquadrar`, e não `setZoom`, porque no celular em pé a mesma
   * altura cortava as pontas da fila (lá a dupla sai do quadro, e as três
   * ficam inteiras e centradas).
   */
  const foco = new THREE.Object3D();
  foco.position.set(PALCO.x + 0.78 - D.x * 0.58, 0.7, PALCO.z + 0.78 - D.z * 0.58);
  w.add(foco);

  const festa = async (g: GameAPI): Promise<void> => {
    acrobaciasLigadas = false;
    for (const c of conversas) c.enabled = false;
    const meio = posicionarParaConversar(g, PALCO, 2.6, 2.3);
    g.focusCamera(foco);
    g.enquadrar(9, 5.2);
    try {
      // cada uma termina o que estava fazendo e vai para o seu lugar no palco
      await Promise.all(presentes.map(async (p) => {
        p.bicho.treinar(false);
        await esperar(g, () => !p.bicho.estaSaltando && !p.bicho.estaFazendoEstrelinha);
        await p.bicho.irPara(LUGAR[p.id].x, LUGAR[p.id].z, 1.6);
        p.bicho.encarar(meio.x, meio.z);
      }));
      for (const p of presentes) p.bicho.torcer(2);
      g.som('sacudida');
      await conversa(g, [
        [L, '¡LLEGARON! Seis lições, panas. O Módulo 1 inteirinho!'],
        [S, '¡ESTO HAY QUE CELEBRARLO! A gente montou uma coreografia SÓ pra vocês!'],
        [E, 'Ensaiamos a semana toda. Fiquem aí, tá? Pra ninguém levar pompom na cara.'],
      ]);
      // as três de frente para a plateia (a câmera, e a dupla ao lado dela)
      for (const p of presentes) p.bicho.encarar(p.bicho.x + PARA_A_CAMERA.x, p.bicho.z + PARA_A_CAMERA.z);
      await conversa(g, [[L, '¡Cinco, seis, siete, ocho!']]);
      g.trocarMusica('festa-da-torcida');
      /*
       * O LADO DE FORA DA ESTRELLA, no corpo dela: a estrelinha anda no `+X`
       * dela vezes o sentido, e de frente para a câmera o `+X` dela aponta para
       * a direita da tela — onde estão as irmãs. Fora é o contrário.
       */
      const olhar = Math.atan2(PARA_A_CAMERA.x, PARA_A_CAMERA.z);
      const xDela = { x: Math.cos(olhar), z: -Math.sin(olhar) };
      const paraFora = { x: LUGAR.estrella.x - PALCO.x, z: LUGAR.estrella.z - PALCO.z };
      const fora: 1 | -1 = xDela.x * paraFora.x + xDela.z * paraFora.z >= 0 ? 1 : -1;
      for (const p of presentes) p.bicho.dancarAFesta(p.id, fora);
      /*
       * O confete cai no salto final (as três sobem juntas aos 10 s), no
       * RELÓGIO DA DANÇA e não no `g.wait`: aquele é de parede, e num celular
       * lento (ou no navegador do teste) o jogo anda mais devagar que ela — o
       * confete caía antes do salto, ou depois de tudo.
       */
      confeteNoSalto = presentes[0].bicho;
      // a dança dura 10,8 s de jogo; a trava só existe para não prender a dupla
      for (let i = 0; i < 900 && presentes.some((p) => p.bicho.estaNaFesta || p.bicho.estaFazendoEstrelinha); i++) {
        await g.wait(0.1);
      }
      await g.wait(0.6);
      for (const p of presentes) p.bicho.torcer(2.8);
      await conversa(g, [
        [S, '¡¿VIRAAAM?! ¡PERFEITA! ¡Nem a Estrella errou!'],
        [E, 'Eu nunca erro, Sol. Eu só vou devagar.'],
        [L, 'Panas... quem termina o Módulo vira torcida oficial dos Gatitos. É a regra. Eu acabei de inventar, mas é a regra.'],
        [L, 'Então a roupa de cheerleader agora é de vocês também! Igualzinha à nossa!'],
        [S, '¡CON POMPONES Y TODO! ¡Y EL LAZO!'],
        [E, 'E o meião, que o ginásio é friozinho de manhã. Já deixamos tudo no guarda-roupa de vocês.'],
        [g.companionName(), 'A gente vai ficar a cara de vocês.'],
        [S, '¡Y AHORA VIENE EL MÓDULO 2! ...Quer dizer: e agora vem o Módulo 2! É só chamar a gente pra aula!'],
      ]);
      for (const peca of PREMIOS_DA_FESTA) g.ganharPeca(peca);
      g.setFlag('festa-da-torcida');
      g.som('memoria');
      g.toast('Roupa de cheerleader no guarda-roupa dos dois', '📣');
      g.unlock({
        id: 'festa-da-torcida',
        title: 'A festa da torcida',
        place: 'Ginásio da Escola do Gatito',
        note: 'O Módulo 1 inteiro — e a Luna, a Sol e a Estrella fizeram uma coreografia só pra gente, com confete e tudo. Agora a gente também é da torcida dos Gatitos.',
        icon: '📣',
      });
    } finally {
      g.trocarMusica(null);
      g.focusCamera(null);
      g.setZoom(13);
      soltarDaConversa(g);
      acrobaciasLigadas = true;
      for (const c of conversas) c.enabled = true;
      // de volta ao treino, cada uma no seu posto
      for (const p of presentes) {
        void p.bicho.irPara(POSTOS[p.id].x, POSTOS[p.id].z, 1.2).then(() => {
          p.bicho.encarar(p.bicho.x + PARA_A_CAMERA.x, p.bicho.z + PARA_A_CAMERA.z);
          p.bicho.treinar(true);
        });
      }
    }
  };
  // um tiquinho depois de entrar (o nome da sala aparece primeiro)
  let espera = 0;
  w.onUpdate((dt) => {
    if (espera < 0) return;
    espera += dt;
    if (espera < 1.4) return;
    espera = -1;
    void festa(g0);
  });
}
