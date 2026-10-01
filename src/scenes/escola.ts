import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  armariosDeEscola, balcaoDeRefeitorio, cartazDeParede, escadariaDoSaguao, interiorDoor, logoDaEscola,
  maquinaDeLanches, mesaDeRefeitorio, placaDePorta, pottedPlant, quadroDeGiz, relogioDeParede,
  vitrineDeTrofeus, windowFrame,
} from '../world/furniture';
import { bin, mesaDePatio, waterFountain } from '../world/props';
import { ladrilhoDeEscola, pisoDePlacas } from '../world/texturasDeChao';
import { ARI, RENAN } from '../characters/cast';
import { Gatito } from '../entities/bichos/Gatito';
import { aulaDaVez, emAula } from './escolaAula';
import { montarOFlynn } from './escolaAtletica';
import { Luna } from '../entities/bichos/CoelhaDaTorcida';
import {
  ESCOLA, LUZ_DA_ESCOLA, conversa, maquinaQueEntrega, paredeComVaos, pontoNoMundo, posicionarParaConversar,
  sentarOsDois,
  soltarDaConversa,
} from './escolaComum';

/**
 * ============================================= A ESCOLA DO GATITO — O SAGUÃO
 *
 * A parte principal da escola, pedida pelo Renan como "um hall grande, com
 * armários, algumas mesas, algumas escadas (que por enquanto não levam a lugar
 * nenhum)", e de lá "um corredor um pouco mais fino que abre para uma área
 * maior, a cafeteria". A inspiração é escola de filme (High School Musical),
 * sem copiar: escola padrão, espaçosa. O plano está em `docs/ESCOLA.md`.
 *
 * CADA SALA TEM UMA PORTA, e atrás dela mora um cenário próprio e menor:
 * Sala 1 (português, a do Gatito), Sala 2 (espanhol, ainda sem professor),
 * sala de descanso, sala dos professores e ginásio. O refeitório fica AQUI,
 * no mesmo cenário (pedido do Renan).
 *
 * A PLANTA (a câmera vê `-Z` subindo à direita e `-X` subindo à esquerda):
 *
 *      REFEITÓRIO (-39..-15)     CORREDOR (-15..0)          SAGUÃO (0..26)
 *     ┌───────────────────┐                        ┌──────────────────────────┐ z=-14
 *     │ balcão · cardápio │                        │ S1 ╱escadaria╲ S2        │
 *     │                   │┌──────────────────────┐│    ╲ troféus ╱           │
 *     │ mesas compridas   ││ professores  descanso││armários        mesas     │
 *     │   ····· eixo z=0 ···········································  eixo x=13  │
 *     │ mesas compridas   │└──────────────────────┘│ginásio         mesas     │
 *     └───────────────────┘                        └────────── porta ─────────┘ z=+8
 *
 * PAREDE ALTA SÓ EM `-X` E `-Z` (a convenção de interior do jogo), com tudo que
 * é alto pendurado nelas: a escadaria e as portas das salas na parede do fundo
 * do saguão, os armários e o ginásio na da esquerda, as portas da sala de
 * descanso e dos professores no fundo do corredor, o balcão no fundo do
 * refeitório. Nos lados da câmera, mureta.
 *
 * O CHÃO É UM SÓ DESENHO nos três pedaços: o ladrilho repete a cada 2,5, e as
 * pontas do saguão (x = 0, z = 8) e do corredor (x = -15, z = 3) caem em
 * múltiplos disso — por isso o xadrez atravessa a boca do corredor sem emenda.
 */

const SAGUAO = { x0: 0, x1: 26, z0: -14, z1: 8, h: 5.6 };
const CORREDOR = { x0: -15, x1: 0, z0: -3, z1: 3, h: 3.6 };
const REFEITORIO = { x0: -39, x1: -15, z0: -12, z1: 10, h: 4.4 };

/** as portas das salas, no saguão e no corredor */
const PORTA = {
  sala1: { x: 2.8, z: SAGUAO.z0 },
  sala2: { x: 23.2, z: SAGUAO.z0 },
  ginasio: { x: SAGUAO.x0, z: 5.5 },
  descanso: { x: -4, z: CORREDOR.z0 },
  professores: { x: -11, z: CORREDOR.z0 },
  rua: { x: 13, z: SAGUAO.z1 },
};

/** a escadaria: centrada no eixo da entrada, encostada na parede do fundo */
const ESCADA = { x: 13, z: SAGUAO.z0 + 0.15 + 1.1, altura: 3.2, lance: 5.6, patamar: 4 };

/** as mesas redondas do saguão, fora dos dois eixos */
const MESAS_DO_SAGUAO: ReadonlyArray<[number, number]> = [[7, -6.5], [7, 4.8], [19.5, -6.5], [19.5, 4.8]];

/**
 * As mesas compridas do refeitório: duas colunas e quatro fileiras, com a
 * faixa do meio (o eixo z = 0, que vem do corredor) livre.
 */
const MESAS_DO_REFEITORIO: ReadonlyArray<[number, number]> = [
  [-31, -7.4], [-22.5, -7.4], [-31, -3.6], [-22.5, -3.6],
  [-31, 3.6], [-22.5, 3.6], [-31, 7.4], [-22.5, 7.4],
];

/**
 * A RONDA DO GATITO: uma FILA de pontos, do fundo do refeitório até o canto do
 * saguão perto da Sala 2 (o jeito da Estella na boutique). Ele só anda para o
 * vizinho na fila — `irPara` vai em linha reta e ignora móvel, e cada trecho
 * desta lista passa por corredor livre: a faixa do meio do refeitório, o
 * corredor, a frente do saguão, o eixo da entrada e a frente da escadaria.
 */
const RONDA: ReadonlyArray<{ x: number; z: number }> = [
  { x: -35, z: 0 },
  { x: -26.5, z: 0 },
  { x: -18, z: 0 },
  { x: -11, z: 0.3 },
  { x: -4, z: 0.3 },
  { x: 4, z: 0 },
  { x: 13, z: 0.5 },
  { x: 13, z: -8.9 },
  { x: 16.8, z: -9.3 },
  { x: 22.5, z: -10 },
  { x: 22.5, z: -3 },
];

/**
 * O que o Gatito fala quando a dupla vai conversar com ele.
 *
 * RASCUNHO MEU: o Renan contou que o Gatito "não tem muitos bordões, ele só
 * ajuda o Ari a aprender português" — e que às vezes faz o six seven. Quando
 * ele mandar falas de verdade, entram aqui literais.
 */
const FALAS_DO_GATITO = [
  'Oi, Ari! Tudo bem? Pode falar comigo em português, viu.',
  'Uma palavra nova por dia já é muita coisa.',
  'Errar faz parte. É errando que a gente aprende.',
  'A Sala 2 é de espanhol, mas ainda estou procurando professor. Se souberem de alguém...',
  'Já passaram no refeitório? Sexta tem arepa.',
  'A lousa da Sala 1 eu mesmo escrevo. Não me perguntem como.',
];

/** com lição para dar, ele lembra quem sabe o horário (a missão da aula: `escolaGinasio.ts`) */
const DICA_DA_AULA = 'A próxima aula está quase na hora! Quem sabe o horário de tudo é a Luna: ela vive no ginásio.';
/** e com o curso inteiro feito (os dois módulos) */
const DEPOIS_DO_MODULO = 'O Módulo 3 ainda está no forno. Enquanto isso, revisem a apostila: tem estrelinha pra melhorar.';


export const escola: SceneDef = {
  id: ESCOLA.saguao,
  name: 'Escola do Gatito',
  subtitle: 'o saguão, antes do sinal',
  ambient: LUZ_DA_ESCOLA,
  spawn: { x: PORTA.rua.x, z: 5.8, facing: Math.PI },
  entries: {
    'da-rua': { x: PORTA.rua.x, z: 5.8, facing: Math.PI },
    'da-sala-1': { x: PORTA.sala1.x, z: -11.6, facing: 0 },
    'da-sala-2': { x: PORTA.sala2.x, z: -11.6, facing: 0 },
    'do-ginasio': { x: 1.9, z: PORTA.ginasio.z, facing: Math.PI / 2 },
    'do-descanso': { x: PORTA.descanso.x, z: -1.3, facing: 0 },
    'dos-professores': { x: PORTA.professores.x, z: -1.3, facing: 0 },
  },

  build(w) {
    const g0 = w.game;
    const A = ARI.name;
    const R = RENAN.name;
    const G = 'Gatito';

    // ================================================================= CHÃO
    // Os três pedaços encostam borda com borda (nenhum por cima do outro).
    const ladrilho = ladrilhoDeEscola(2.5);
    w.ground({
      width: SAGUAO.x1 - SAGUAO.x0, depth: SAGUAO.z1 - SAGUAO.z0,
      x: (SAGUAO.x0 + SAGUAO.x1) / 2, z: (SAGUAO.z0 + SAGUAO.z1) / 2,
      color: P.escolaPiso, textura: ladrilho,
    });
    w.ground({
      width: CORREDOR.x1 - CORREDOR.x0, depth: CORREDOR.z1 - CORREDOR.z0,
      x: (CORREDOR.x0 + CORREDOR.x1) / 2, z: (CORREDOR.z0 + CORREDOR.z1) / 2,
      color: P.escolaPiso, textura: ladrilho,
    });
    w.ground({
      width: REFEITORIO.x1 - REFEITORIO.x0, depth: REFEITORIO.z1 - REFEITORIO.z0,
      x: (REFEITORIO.x0 + REFEITORIO.x1) / 2, z: (REFEITORIO.z0 + REFEITORIO.z1) / 2,
      color: P.escolaParede, textura: pisoDePlacas(1.25),
    });
    w.setBounds(REFEITORIO.x0 + 0.45, SAGUAO.z0 + 0.45, SAGUAO.x1 - 0.45, REFEITORIO.z1 - 0.45);

    // =============================================================== PAREDES
    const porta = { cor: P.escolaArmarioAzul, largura: 1.0 };
    // o fundo do saguão: as duas salas de aula nas pontas, a escadaria no meio
    paredeComVaos(w, 'x', SAGUAO.z0, SAGUAO.x0, SAGUAO.x1, SAGUAO.h, P.escolaParede, [
      { c: PORTA.sala1.x, largura: 1.2, porta },
      { c: PORTA.sala2.x, largura: 1.2, porta },
    ], 1, P.escolaBarra);
    // a esquerda do saguão: a boca do corredor (sem porta, e com a verga na
    // altura do corredor) e as portas duplas do ginásio
    paredeComVaos(w, 'z', SAGUAO.x0, SAGUAO.z0, SAGUAO.z1, SAGUAO.h, P.escolaParede, [
      { c: 0, largura: CORREDOR.z1 - CORREDOR.z0, altura: CORREDOR.h },
      { c: PORTA.ginasio.z, largura: 1.8, porta: { cor: P.escolaFaixa, largura: 1.6 } },
    ], 1, P.escolaBarra);
    w.wall(SAGUAO.x1, SAGUAO.z0, SAGUAO.x1, SAGUAO.z1, 0.45, P.escolaParede);
    // a frente, com o vão da entrada no eixo x = 13
    w.wall(SAGUAO.x0, SAGUAO.z1, PORTA.rua.x - 0.9, SAGUAO.z1, 0.45, P.escolaParede);
    w.wall(PORTA.rua.x + 0.9, SAGUAO.z1, SAGUAO.x1, SAGUAO.z1, 0.45, P.escolaParede);

    // o corredor: as duas portas no fundo, e mureta na frente
    paredeComVaos(w, 'x', CORREDOR.z0, CORREDOR.x0, CORREDOR.x1, CORREDOR.h, P.escolaParedeAzul, [
      { c: PORTA.descanso.x, largura: 1.2, porta: { cor: P.escolaSofa, largura: 1.0 } },
      { c: PORTA.professores.x, largura: 1.2, porta: { cor: P.wood, largura: 1.0 } },
    ]);
    w.wall(CORREDOR.x0, CORREDOR.z1, CORREDOR.x1, CORREDOR.z1, 0.45, P.escolaParedeAzul);

    // o refeitório: fundo e esquerda altos; do lado do corredor e na frente,
    // mureta (é o lado da câmera)
    paredeComVaos(w, 'x', REFEITORIO.z0, REFEITORIO.x0, REFEITORIO.x1, REFEITORIO.h, P.escolaParede, [], 1, P.escolaBarra);
    paredeComVaos(w, 'z', REFEITORIO.x0, REFEITORIO.z0, REFEITORIO.z1, REFEITORIO.h, P.escolaParede, [], 1, P.escolaBarra);
    w.wall(REFEITORIO.x1, REFEITORIO.z0, REFEITORIO.x1, CORREDOR.z0, 0.45, P.escolaParede);
    w.wall(REFEITORIO.x1, CORREDOR.z1, REFEITORIO.x1, REFEITORIO.z1, 0.45, P.escolaParede);
    w.wall(REFEITORIO.x0, REFEITORIO.z1, REFEITORIO.x1, REFEITORIO.z1, 0.45, P.escolaParede);

    // ================================================================ SAGUÃO
    // ------------------------------------------------------------ a escadaria
    // Maciça, contra a parede do fundo. Ela não leva a lugar nenhum por
    // enquanto: o patamar para numa porta fechada.
    const escada = w.add(w.place(
      escadariaDoSaguao(ESCADA.altura, ESCADA.lance, 2.2, ESCADA.patamar), ESCADA.x, 0, ESCADA.z,
    ));
    w.blockBox(ESCADA.x, ESCADA.z, ESCADA.patamar / 2 + ESCADA.lance + 0.1, 1.15);
    // a porta do segundo andar, em cima do patamar, rente à parede
    w.add(w.place(interiorDoor(P.escolaRodape, 1.1, 2.1), ESCADA.x, ESCADA.altura + 0.05, SAGUAO.z0 + 0.27));
    const emBreve = w.add(w.place(
      cartazDeParede('Em breve', ['2º andar'], 0.7, 0.42, '#ffe39a', '#3d68ad'),
      ESCADA.x + 0.05, ESCADA.altura + 1.45, SAGUAO.z0 + 0.43,
    ));

    // os dois painéis na parede, por cima dos lances (acima do corrimão)
    w.add(w.place(logoDaEscola('Escola do Gatito', 4.4, 1.15), 7.7, 4.35, SAGUAO.z0 + 0.19));
    w.add(w.place(
      cartazDeParede('Bem-vindos!', ['¡Bienvenidos!'], 3.4, 1.15, '#fff6dc', '#3d68ad'),
      18.3, 4.35, SAGUAO.z0 + 0.17,
    ));

    // ----------------------------------------------- a vitrine de troféus
    // No pé do patamar, no fim do eixo da entrada: é a primeira coisa que se vê.
    const vitrine = w.add(w.place(vitrineDeTrofeus(2.2), ESCADA.x, 0, ESCADA.z + 1.4));
    w.blockBox(ESCADA.x, ESCADA.z + 1.4, 1.12, 0.3);

    // -------------------------------------------- as placas das salas de aula
    w.add(w.place(placaDePorta('Sala 1 · Português', 'Clase de portugués'), PORTA.sala1.x, 2.62, SAGUAO.z0 + 0.19));
    w.add(w.place(placaDePorta('Sala 2 · Espanhol', 'Clase de español'), PORTA.sala2.x, 2.62, SAGUAO.z0 + 0.19));
    w.add(w.place(relogioDeParede(0.3), 25.1, 3.1, SAGUAO.z0 + 0.19));

    // ------------------------------------------------------------ armários
    // Na parede da esquerda, virados para dentro (+X): o corredor de armário
    // de escola de filme.
    const armarioA = w.add(w.place(armariosDeEscola(10), 0.38, 0, -11.2, Math.PI / 2));
    w.blockBox(0.38, -11.2, 0.26, 2.32);
    w.add(w.place(armariosDeEscola(9, [P.escolaArmarioAmarelo, P.escolaArmarioAzul]), 0.38, 0, -6.1, Math.PI / 2));
    w.blockBox(0.38, -6.1, 0.26, 2.1);
    const mural = w.add(w.place(
      cartazDeParede('Mural de avisos', [
        'Aula de português: com o Prof. Gatito',
        'Clase de español: ¡se busca profesor!',
        'Treino dos Gatitos: terça e quinta',
        'Achados e perdidos: um novelo de lã rosa',
      ], 3.2, 1.35),
      0.17, 2.8, -8.6, Math.PI / 2,
    ));

    // o bebedouro, entre a boca do corredor e o ginásio
    const bebedouro = w.add(w.place(waterFountain(), 0.42, 0, 3.85, Math.PI / 2));
    w.blockCircle(0.42, 3.85, 0.32);

    // a placa do ginásio e a faixa da torcida, em cima da boca do corredor
    w.add(w.place(placaDePorta('Ginásio', 'Gimnasio'), 0.19, 2.62, PORTA.ginasio.z, Math.PI / 2));
    w.add(w.place(
      cartazDeParede('VAI, GATITOS!', [], 4.6, 1.1, '#3d68ad', '#ffe39a'),
      0.19, 4.6, 0, Math.PI / 2,
    ));

    // ------------------------------------------- mesas e bancos do saguão
    for (const [x, z] of MESAS_DO_SAGUAO) {
      w.add(w.place(mesaDePatio(P.escolaArmarioAzul), x, 0, z, 0.3));
      w.blockCircle(x, z, 1.35);
    }
    w.banco(24.6, -1.6, -Math.PI / 2, P.escolaArmarioAzul);
    w.banco(24.6, 2.6, -Math.PI / 2, P.escolaArmarioAzul);

    for (const [x, z] of [[25.2, 7.2], [1.0, 7.2], [25.2, -13.2]] as const) {
      w.add(w.place(pottedPlant(1.25), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    // ============================================================ CORREDOR
    w.add(w.place(armariosDeEscola(11, [P.escolaArmarioAzul]), -7.5, 0, CORREDOR.z0 + 0.38));
    w.blockBox(-7.5, CORREDOR.z0 + 0.38, 2.55, 0.26);
    w.add(w.place(armariosDeEscola(6, [P.escolaArmarioAmarelo]), -13.3, 0, CORREDOR.z0 + 0.38));
    w.blockBox(-13.3, CORREDOR.z0 + 0.38, 1.4, 0.26);
    w.add(w.place(armariosDeEscola(6, [P.escolaArmarioAmarelo]), -1.78, 0, CORREDOR.z0 + 0.38));
    w.blockBox(-1.78, CORREDOR.z0 + 0.38, 1.4, 0.26);
    w.add(w.place(placaDePorta('Sala de descanso', 'Sala de descanso'), PORTA.descanso.x, 2.62, CORREDOR.z0 + 0.19));
    w.add(w.place(placaDePorta('Sala dos professores', 'Sala de profesores'), PORTA.professores.x, 2.62, CORREDOR.z0 + 0.19));
    // o aviso na porta dos professores
    w.add(w.place(
      cartazDeParede('Só professores', ['(e gatinhos)'], 0.62, 0.4, '#fff6dc', '#8a5a2a'),
      PORTA.professores.x + 0.1, 1.55, CORREDOR.z0 + 0.07,
    ));

    // ========================================================== REFEITÓRIO
    const balcao = w.add(w.place(balcaoDeRefeitorio(8), -27, 0, REFEITORIO.z0 + 0.65));
    w.blockBox(-27, REFEITORIO.z0 + 0.8, 4.05, 0.65);
    w.add(w.place(
      quadroDeGiz(['Cardápio do dia', 'arroz · feijão · frango', 'macarrão · salada', 'sobremesa: brigadeiro', 'sexta: dia de arepa'], 3.4, 1.7),
      -27, 2.75, REFEITORIO.z0 + 0.18,
    ));
    w.add(w.place(
      cartazDeParede('Refeitório', ['Comedor'], 2.8, 1.05, '#3d68ad', '#ffffff'), -19.2, 3.05, REFEITORIO.z0 + 0.17,
    ));
    w.add(w.place(waterFountain(), -16.4, 0, REFEITORIO.z0 + 0.42));
    w.blockCircle(-16.4, REFEITORIO.z0 + 0.42, 0.32);
    w.add(w.place(relogioDeParede(0.3), -35, 3.1, REFEITORIO.z0 + 0.19));

    // as janelas na parede da esquerda, e as máquinas de lanche nas pontas
    for (const z of [-6, -0.5, 5]) {
      w.add(w.place(windowFrame(2.4, 1.5), REFEITORIO.x0 + 0.17, 2.15, z, Math.PI / 2));
    }
    const maquinas = [
      { z: -9.8, cor: P.escolaFaixa },
      { z: 8.4, cor: P.escolaArmarioAzul },
    ];
    const pecasDasMaquinas = maquinas.map((m) => {
      w.blockBox(REFEITORIO.x0 + 0.53, m.z, 0.4, 0.5);
      return w.add(w.place(maquinaDeLanches(m.cor), REFEITORIO.x0 + 0.53, 0, m.z, Math.PI / 2));
    });
    for (const [x, z] of [[REFEITORIO.x0 + 0.5, -8.2], [-17.4, REFEITORIO.z0 + 0.5]] as const) {
      w.add(w.place(bin(), x, 0, z));
      w.blockCircle(x, z, 0.3);
    }
    w.add(w.place(pottedPlant(1.2), -16, 0, 9.2));
    w.blockCircle(-16, 9.2, 0.35);

    // as mesas compridas, e sentar nelas de frente um para o outro
    const FALAS_DA_MESA: ReadonlyArray<ReadonlyArray<readonly [boolean, string]>> = [
      [[false, 'Guardei lugar pra você.'], [true, 'Mesa de refeitório de filme.']],
      [[true, 'Aqui cabe a turma inteira.'], [false, 'Mas hoje é só a gente.']],
      [[false, 'Quando tiver alguém no balcão, a gente almoça aqui.'], [true, 'Combinado.']],
    ];
    let vezDaMesa = 0;
    MESAS_DO_REFEITORIO.forEach(([x, z], i) => {
      w.add(w.place(mesaDeRefeitorio(3.4, i % 2 === 0 ? P.escolaArmarioAzul : P.escolaArmarioAmarelo), x, 0, z));
      w.blockBox(x, z, 1.72, 0.95);
      const ancora = pontoNoMundo(w, x, 0, z);
      const foco = pontoNoMundo(w, x, 0.95, z);
      w.interact({
        id: `escola:mesa-${i}`,
        x, z, radius: 2.0,
        label: 'Sentar à mesa', icon: '🍽️',
        onInteract: async (g) => {
          const falas = FALAS_DA_MESA[vezDaMesa++ % FALAS_DA_MESA.length];
          // mesa é peça genérica: quem fala é quem está em cena (o T troca)
          await sentarOsDois(g, {
            ancora,
            // um em cada banco, os dois olhando para o meio da mesa
            jogador: new THREE.Vector3(0, 0, 0.74),
            parceiro: new THREE.Vector3(0, 0, -0.74),
            facing: Math.PI,
            facingParceiro: 0,
            foco,
            falas: falas.map(([doJogador, t]) => [doJogador ? g.playerName() : g.companionName(), t] as const),
            saida: { jogador: [x, z + 1.75], parceiro: [x, z - 1.75], facing: Math.PI },
          });
        },
      });
    });

    // ========================================================= INTERAÇÕES
    // -------------------------------------------------------------- portas
    w.door({
      x: PORTA.sala1.x, z: PORTA.sala1.z + 1.0, radius: 1.3,
      to: ESCOLA.sala1, entry: 'do-saguao',
      label: 'Entrar na Sala 1 — Português', icon: '📘',
    });
    w.door({
      x: PORTA.sala2.x, z: PORTA.sala2.z + 1.0, radius: 1.3,
      to: ESCOLA.sala2, entry: 'do-saguao',
      label: 'Entrar na Sala 2 — Espanhol', icon: '📙',
    });
    w.door({
      x: PORTA.ginasio.x + 1.0, z: PORTA.ginasio.z, radius: 1.4,
      to: ESCOLA.ginasio, entry: 'do-saguao',
      label: 'Entrar no ginásio', icon: '🏀',
    });
    w.door({
      x: PORTA.descanso.x, z: PORTA.descanso.z + 1.0, radius: 1.2,
      to: ESCOLA.descanso, entry: 'do-corredor',
      label: 'Entrar na sala de descanso', icon: '🛋️',
    });
    w.door({
      x: PORTA.professores.x, z: PORTA.professores.z + 1.0, radius: 1.2,
      to: ESCOLA.professores, entry: 'do-corredor',
      label: 'Entrar na sala dos professores', icon: '☕',
    });
    // A escola abre pelo ônibus, depois de conhecer a Luna no piquenique do
    // Villa Lobos (`escola-aberta`). A porta da rua é o ponto: dali o ônibus
    // volta para o parque ou segue para o clube.
    w.interact({
      id: 'door:villa-lobos:clube',
      x: PORTA.rua.x, z: PORTA.rua.z - 0.9, radius: 1.5,
      label: 'Sair da escola (pegar o ônibus)', icon: '🚌',
      onInteract: async (g) => {
        const destino = await g.ask('Pra onde a gente vai?', ['Parque', 'Clube', 'Ficar na escola']);
        if (destino === 0) g.goTo('villa-lobos', 'clube');
        else if (destino === 1) g.goTo('clube', 'portaria');
      },
    });

    // ------------------------------------------------------------ a escada
    for (const x of [ESCADA.x - ESCADA.patamar / 2 - ESCADA.lance - 0.7, ESCADA.x + ESCADA.patamar / 2 + ESCADA.lance + 0.7]) {
      w.interact({
        id: `escola:escada-${x > ESCADA.x ? 'direita' : 'esquerda'}`,
        x, z: ESCADA.z + 0.4, radius: 1.1,
        label: 'Subir a escada', icon: '🪜',
        highlight: escada,
        onInteract: async (g) => {
          if (!g.flag('escola-escada')) {
            g.setFlag('escola-escada');
            await conversa(g, [
              [A, 'Aonde vai essa escada?'],
              [R, 'Pro segundo andar.'],
              [A, 'E o que tem lá?'],
              [R, 'Ainda ninguém sabe. Tá escrito "em breve" na porta.'],
            ]);
            return;
          }
          g.toast('O segundo andar ainda está fechado', '🚧');
        },
      });
    }

    w.interact({
      id: 'escola:trofeus',
      x: ESCADA.x, z: ESCADA.z + 2.35, radius: 1.3,
      label: 'Ver os troféus', icon: '🏆',
      highlight: vitrine,
      onInteract: (g) =>
        conversa(g, [
          [R, 'Gatitos, campeões.'],
          [A, 'O time da escola se chama Gatitos?'],
          [R, 'Claro. Tem até troféu com cara de gato.'],
        ]),
    });

    w.interact({
      id: 'escola:armarios',
      x: 1.4, z: -11.8, radius: 1.3,
      label: 'Abrir um armário', icon: '🔐',
      highlight: armarioA,
      onInteract: (g) =>
        conversa(g, [
          [A, 'Armário de escola de filme.'],
          [R, 'Só falta a gente colar uma foto aqui dentro.'],
        ]),
    });

    w.interact({
      id: 'escola:mural',
      x: 1.4, z: -8.6, radius: 1.2,
      label: 'Ler o mural de avisos', icon: '📌',
      highlight: mural,
      onInteract: (g) =>
        conversa(g, [
          [A, 'Aula de português, com o professor Gatito.'],
          [R, 'Clase de español... "se busca profesor".'],
          [A, 'Tão procurando professor de espanhol.'],
          [A, 'Achados e perdidos: um novelo de lã rosa.'],
          [R, 'Esse aí é do Gatito, certeza.'],
        ]),
    });

    w.interact({
      id: 'escola:bebedouro',
      x: 1.3, z: 3.85, radius: 1.0,
      label: 'Beber água', icon: '💧',
      highlight: bebedouro,
      onInteract: (g) => {
        g.som('agua');
        g.toast('Água geladinha', '💧');
      },
    });

    w.interact({
      id: 'escola:balcao',
      x: -27, z: REFEITORIO.z0 + 2.1, radius: 1.6,
      label: 'Ver o cardápio', icon: '📋',
      highlight: balcao,
      onInteract: (g) =>
        conversa(g, [
          [A, 'Arroz, feijão, frango, macarrão e salada. E brigadeiro.'],
          [R, 'E sexta é dia de arepa.'],
          [A, 'Mas não tem ninguém servindo.'],
          [R, 'Deve estar no intervalo. Depois a gente volta.'],
        ]),
    });

    // comprar, ver o lanche cair na gaveta e pegar (ver `maquinaQueEntrega`)
    maquinas.forEach((m, i) => {
      maquinaQueEntrega(w, {
        id: `escola:lanches-${i}`, maquina: pecasDasMaquinas[i],
        x: REFEITORIO.x0 + 1.5, z: m.z,
      });
    });

    // ============================================== O FLYNN, NO REFEITÓRIO
    // o presidente da atlética dos Gatitos (`escolaAtletica.ts`)
    montarOFlynn(w, REFEITORIO);

    // =============================================================== GATITO
    // Ele nasce na ÚLTIMA parada da fila (a lição da Estella: nascendo fora
    // dela, a primeira caminhada é a única que ninguém mediu).
    const INICIO = RONDA[RONDA.length - 1];
    const gatito = new Gatito({ minX: INICIO.x, maxX: INICIO.x, minZ: INICIO.z, maxZ: INICIO.z });
    gatito.group.rotation.y = Math.PI;
    gatito.entrarEmServico();
    w.add(gatito.group);
    // com a aula chamada pela Luna, ele está na Sala 1 esperando a turma
    // (`escolaAula.ts`): o saguão fica sem o diretor até a aula acabar
    const naAula = emAula(g0);
    gatito.group.visible = !naAula;

    const pertoDaDupla = (raio: number): boolean => {
      const p = g0.playerPosition();
      return Math.hypot(p.x - gatito.x, p.z - gatito.z) < raio;
    };
    // o miado sai do gato, mas quem toca é o motor — e só se a dupla estiver
    // por perto: a escola é grande, e miado do outro lado dela é ruído
    gatito.aoSoar = () => {
      if (pertoDaDupla(12)) g0.som('miado');
    };
    gatito.aoFazerSixSeven = () => {
      if (pertoDaDupla(14)) g0.toast('Gatito: Six seven!', '🐱');
    };

    let atual = RONDA.length - 1;
    let passo = -1;
    let andando = false;
    let espera = 1.5;
    let conversando = false;
    /** gancho de teste: o `scripts/escola.mjs` segura a ronda para fotografar */
    let pausado = false;
    gatito.group.userData.teste = {
      gatito,
      pausar: (sim: boolean) => {
        pausado = sim;
      },
    };

    const falarComGatito = w.interact({
      id: 'escola:gatito',
      x: gatito.x, z: gatito.z, radius: 1.3,
      label: 'Falar com o Gatito', icon: '🐱',
      highlight: gatito.group,
      onInteract: async (g) => {
        conversando = true;
        const eu = g.playerPosition();
        gatito.encarar(eu.x, eu.z);
        gatito.receberCarinho();
        g.som('miado');
        try {
          if (!g.flag('gatito-conhecido')) {
            g.setFlag('gatito-conhecido');
            await conversa(g, [
              [R, 'Ari... olha quem tá aqui.'],
              [A, '¡Un gatito!'],
              [G, 'Gatito, com G maiúsculo. Oi, Ari! Oi, Renan! Bem-vindos à Escola do Gatito.'],
              [G, 'Eu sou o diretor da escola. E o professor de português também.'],
              [G, 'As aulas começam em breve. Vocês não querem ser meus alunos?'],
              [A, 'Eu quero! Tô muito interessado.'],
              [R, 'Eu já sei português... mas eu vou junto, pra te acompanhar.'],
              [G, 'Combinado: dois alunos novos na Sala 1!'],
              [A, 'Um gato diretor de escola...'],
              [R, 'Olha a língua pra fora. Ele já gostou de você.'],
            ]);
            gatito.sixSeven();
            g.unlock({
              id: 'o-professor-gatito',
              title: 'O professor Gatito',
              place: 'Escola do Gatito',
              note: 'Um gato de verdade, de língua pra fora e meia cara caramelo, é o diretor da escola e o professor de português. Convidou a gente para as aulas: o Ari topou na hora, e eu vou junto.',
              icon: '🐱',
            });
            return;
          }
          if (w.rng() < 0.35) {
            gatito.sixSeven();
            return;
          }
          const vez = aulaDaVez(g);
          const dica = vez ? DICA_DA_AULA : g.progressoDaApostila().abertas.length ? DEPOIS_DO_MODULO : null;
          await g.say([dica && w.rng() < 0.5 ? dica : w.pick(FALAS_DO_GATITO)], G);
        } finally {
          conversando = false;
        }
      },
    });

    /* ============================================ A LUNA MOSTRA A ESCOLA
     *
     * Na PRIMEIRA chegada depois do convite (`escola-aberta`), a Luna está
     * esperando na entrada: ela dá um resumo de como é o lugar e o que tem
     * nele, diz para procurar por ela no ginásio e vai para lá treinar. Daí
     * em diante ela mora no ginásio (`luna-na-escola`), e o saguão volta a ser
     * só do Gatito.
     *
     * ELA ESPERA ONDE A DUPLA DESCE, meio passo à esquerda na tela: o
     * `posicionarParaConversar` põe os dois na diagonal dela, e deste ponto a
     * diagonal cai quase em cima da entrada — ninguém é teleportado para
     * longe de onde desceu do ônibus.
     *
     * O CAMINHO ATÉ O GINÁSIO passa ENTRE as mesas e a mureta da frente (z =
     * 6,9): em linha reta, na altura da porta, ela atravessaria a mesa de
     * (7; 4,8) como fantasma.
     */
    const LUNA_NA_ENTRADA = { x: 11.45, z: 6.05 };
    const PELO_CANTO = { x: 7, z: 6.9 };
    const NA_PORTA_DO_GINASIO = { x: PORTA.ginasio.x + 0.9, z: PORTA.ginasio.z };
    const vaiMostrar = g0.flag('escola-aberta') && !g0.flag('luna-na-escola');
    const luna = new Luna({
      minX: LUNA_NA_ENTRADA.x - 0.2, maxX: LUNA_NA_ENTRADA.x + 0.2,
      minZ: LUNA_NA_ENTRADA.z - 0.2, maxZ: LUNA_NA_ENTRADA.z + 0.2,
    });
    luna.entrarEmServico();
    luna.group.position.set(LUNA_NA_ENTRADA.x, 0, LUNA_NA_ENTRADA.z);
    luna.group.rotation.y = Math.PI / 4;
    luna.group.visible = vaiMostrar;
    if (vaiMostrar) w.add(luna.group);
    /** gancho de teste: o `scripts/luna.mjs` confere onde ela foi parar */
    luna.group.userData.teste = { luna };

    const L = 'Luna';
    const mostrarAEscola = async (): Promise<void> => {
      const meio = posicionarParaConversar(g0, LUNA_NA_ENTRADA);
      luna.encarar(meio.x, meio.z);
      g0.focusCamera(luna.group);
      g0.setZoom(8);
      try {
        await conversa(g0, [
          [L, '¡Llegaron! Bem-vindos, panas! Esta é a Escola do Gatito.'],
          [L, 'Eu prometi um tour, então lá vai. Rapidinho.'],
          [L, 'Aqui é o saguão. Os armários azuis e amarelos são dos alunos, e a vitrine lá no fundo é a dos troféus dos Gatitos. Eu conto eles toda semana.'],
          [L, 'A escada vai pro segundo andar, mas ele tá fechado. Ninguém sabe o que tem lá em cima. Eu acho que o Gatito sabe.'],
          [L, 'As duas portas do fundo são as salas: a Sala 1 é de português, a do professor Gatito. A Sala 2 é de espanhol.'],
          [L, 'Pelo corredor tem a sala de descanso, com sofá e pufe, e a sala dos professores. Lá tem cafezinho. Não conta pra ninguém que eu falei.'],
          [L, 'E no fim do corredor fica o refeitório. Arroz, feijão, frango... e sexta tem arepa!'],
        ]);
        luna.torcer(2.6);
        g0.som('sacudida');
        await conversa(g0, [[L, 'E aquela porta ali do lado é o ginásio! A casa dos Gatitos! Quadra, arquibancada, placar, tudo!']]);
        luna.ficarTimida(3);
        await conversa(g0, [
          [L, '...Ya va. Falei tudo de uma vez, né? ¡Qué pena! Eu ensaiei esse tour.'],
          [R, 'Foi o melhor tour que eu já fiz.'],
          [A, 'E eu nem me perdi.'],
          [L, 'Bom! Se quiserem conversar, eu tô no ginásio treinando a coreografia nova. É só me procurar.'],
        ]);
        luna.torcer(2);
        g0.som('sacudida');
        await conversa(g0, [[L, '¡Chao, panas! ¡Vamos, Gatitos!']]);
      } finally {
        g0.focusCamera(null);
        g0.setZoom(13);
        soltarDaConversa(g0);
        g0.setFlag('luna-na-escola');
      }
      g0.toast('A Luna está treinando no ginásio', '🏀');
      luna.pararDeEncarar();
      await luna.irPara(PELO_CANTO.x, PELO_CANTO.z, 1.5);
      await luna.irPara(NA_PORTA_DO_GINASIO.x, NA_PORTA_DO_GINASIO.z, 1.5);
      luna.group.visible = false;
    };

    let esperaDaLuna = vaiMostrar ? 0 : -1;
    w.onUpdate((dt) => {
      if (luna.group.visible) luna.update(dt);
      if (esperaDaLuna < 0) return;
      esperaDaLuna += dt;
      // depois da memória de chegar (1,2 s), para o aviso dela não cair no meio
      if (esperaDaLuna < 1.6) return;
      esperaDaLuna = -1;
      void mostrarAEscola();
    });

    // ------------------------------------------- a memória de chegar aqui
    let chegou = 0;
    w.onUpdate((dt) => {
      if (chegou < 0) return;
      chegou += dt;
      if (chegou > 1.2) {
        chegou = -1;
        if (!g0.flag('escola-visitada')) {
          g0.setFlag('escola-visitada');
          g0.unlock({
            id: 'escola-do-gatito',
            title: 'A Escola do Gatito',
            place: 'Escola do Gatito',
            note: 'Um saguão enorme com escadaria, armários azuis e amarelos, e um refeitório no fim do corredor. O professor de português é o Gatito.',
            icon: '🏫',
          });
        }
      }
    });

    falarComGatito.enabled = !naAula;
    w.onUpdate((dt, t) => {
      // o aviso de "em breve" balança de leve, pendurado na porta
      emBreve.rotation.z = Math.sin(t * 1.3) * 0.03;
      if (naAula) return;
      gatito.update(dt);
      falarComGatito.moveTo(gatito.x, gatito.z);

      if (andando || conversando || pausado || gatito.fazendoSixSeven) return;
      espera -= dt;
      if (espera > 0) return;

      if (atual + passo >= RONDA.length || atual + passo < 0) passo = -passo;
      atual += passo;
      const parada = RONDA[atual];
      andando = true;
      void gatito.irPara(parada.x, parada.z, 0.85).then(() => {
        andando = false;
        espera = 2.5 + w.rng() * 4;
        // de vez em quando, parado, ele faz o six seven — se tiver plateia
        if (pertoDaDupla(10) && w.rng() < 0.3) gatito.sixSeven();
      });
    });
  },
};
