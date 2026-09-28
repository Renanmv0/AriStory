import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import {
  bolaDeBasquete, carrinhoDeBolas, cartazDeParede, cestaDeBasquete, logoDaEscola, placarDeGinasio, windowFrame,
} from '../world/furniture';
import { bleachers, waterFountain } from '../world/props';
import { assoalhoDeMadeira } from '../world/texturasDeChao';
import { ARI, RENAN } from '../characters/cast';
import { Luna } from '../entities/bichos/Luna';
import {
  ESCOLA, LUZ_DA_ESCOLA, cascaDeSala, conversa, pontoNoMundo, posicionarParaConversar, sentarOsDois,
  soltarDaConversa,
} from './escolaComum';

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

    // ====================================================== A LUNA TREINANDO
    /*
     * Depois de mostrar a escola, a Luna mora aqui (`luna-na-escola`),
     * treinando a coreografia com os pompons em loop. Ela fica no meio da
     * quadra, entre o círculo central e a lateral da frente: de frente para a
     * câmera, sem nada em cima nem na frente dela, e longe das duas linhas de
     * lance livre, que são do arremesso.
     *
     * Conversar PARA o treino: ela se vira para a dupla, fala, e volta a
     * treinar. As falas se revezam, uma por conversa.
     */
    if (g0.flag('luna-na-escola')) {
      const TREINO = { x: QUADRA.x, z: QUADRA.z + 2.9 };
      const PARA_A_CAMERA = { x: TREINO.x + 10, z: TREINO.z + 10 };
      const luna = new Luna({
        minX: TREINO.x - 0.2, maxX: TREINO.x + 0.2,
        minZ: TREINO.z - 0.2, maxZ: TREINO.z + 0.2,
      });
      luna.entrarEmServico();
      luna.group.position.set(TREINO.x, 0, TREINO.z);
      luna.group.rotation.y = Math.PI / 4;
      luna.encarar(PARA_A_CAMERA.x, PARA_A_CAMERA.z);
      luna.treinar(true);
      w.add(luna.group);
      w.blockCircle(TREINO.x, TREINO.z, 0.42);
      /** gancho de teste: o `scripts/luna.mjs` mede a coreografia */
      luna.group.userData.teste = { luna };
      w.onUpdate((dt) => luna.update(dt));

      const L = 'Luna';
      const falas: Array<(g: GameAPI) => Promise<void>> = [
        async (g) => {
          await conversa(g, [
            [L, '¡Épale, panas! Vieram me ver treinar?'],
            [L, 'Senta ali na arquibancada que eu faço a coreografia inteira. Do começo!'],
          ]);
        },
        async (g) => {
          await conversa(g, [[L, 'Tô ensaiando uma parte nova. Olha só!']]);
          luna.torcer(2.8);
          g.som('sacudida');
          await conversa(g, [[L, '¡Vamos, Gatitos! ¡Vamos, Gatitos! ¡Uh!']]);
          luna.ficarTimida(2.4);
          await conversa(g, [[L, '...Não olhem tanto. ¡Qué pena!']]);
        },
        async (g) => {
          await conversa(g, [
            [L, 'Hoje na aula o Gatito explicou que "esquisito" é estranho. Estranho!'],
            [L, 'Eu achava que era gostoso. Passei um mês elogiando a comida dos outros de esquisita.'],
          ]);
          luna.ficarTimida(2.2);
          await conversa(g, [[L, 'Naguará... ninguém me avisou.']]);
        },
        async (g) => {
          await conversa(g, [[L, 'Sabiam que o Gatito pula em vez de andar? Ele é pelúcia, né. Pelúcia não tem joelho.']]);
        },
        async (g) => {
          luna.torcer(1.8);
          g.som('sacudida');
          await conversa(g, [[L, '¡Gatitos! ...Desculpa. Às vezes sai sozinho.']]);
        },
      ];

      w.interact({
        id: 'ginasio:luna',
        x: TREINO.x, z: TREINO.z, radius: 1.8,
        label: 'Falar com a Luna', icon: '🐰',
        highlight: luna.group,
        onInteract: async (g) => {
          luna.treinar(false);
          const meio = posicionarParaConversar(g, TREINO);
          luna.encarar(meio.x, meio.z);
          g.focusCamera(luna.group);
          g.setZoom(8);
          try {
            const vez = g.bump('luna.conversas');
            await falas[(vez - 1) % falas.length](g);
          } finally {
            g.focusCamera(null);
            g.setZoom(13);
            soltarDaConversa(g);
            luna.encarar(PARA_A_CAMERA.x, PARA_A_CAMERA.z);
            luna.treinar(true);
          }
        },
      });
    }

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
