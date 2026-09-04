import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  arandela, balcaoDePassagem, bancadaInox, banquetaAlta, caixaRegistradora, chair,
  churrasqueira, diningTable, estanteDeBebidas, fogaoIndustrial, fridge, interiorDoor,
  luminariaPendente, pictureFrame, piaIndustrial, pottedPlant, quadroDeGiz, rug,
  upperCabinets, wallShelf,
} from '../world/furniture';
import { letreiro } from '../world/props';
import { toon } from '../core/materials';
import { assoalhoDeMadeira, pisoDePlacas } from '../world/texturasDeChao';
import { ARI, RENAN } from '../characters/cast';

/**
 * Mania de Churrasco — o restaurante do clube POR DENTRO.
 *
 * Este é o primeiro cenário construído para receber um jogo de verdade depois.
 * Ele é, de propósito, duas salas coladas:
 *
 *   COZINHA (esquerda/fundo)      |  SALÃO (frente/direita)
 *   grelha, fogão, pia, bancadas  |  mesas, bar, caixa
 *                    ↑ o balcão de passagem separa os dois
 *
 * O BALCÃO DE PASSAGEM É A PEÇA MAIS IMPORTANTE DAQUI, e ele já nasce no lugar
 * certo: quando o minijogo entrar, é nele que o prato pronto vai esperar o
 * garçom. Um restaurante com cozinha e salão sem fronteira não teria onde
 * pendurar essa mecânica.
 *
 * PLANTA (a câmera vê `-Z` subindo à direita e `-X` subindo à esquerda):
 *
 *   parede do fundo (-Z), da esquerda para a direita:
 *     geladeira · CHURRASQUEIRA · fogão · bancada || bar com estante de bebidas
 *   parede da esquerda (-X):
 *     pia · bancada · PORTA DE SERVIÇO (é por onde se entra, vinda do clube)
 *   meio:
 *     balcão de passagem correndo no X, e outro correndo no Z, com o vão de
 *     serviço entre os dois
 *   frente (+Z) e direita (+X):
 *     mureta baixa — parede alta desses dois lados taparia o salão inteiro
 *
 * POR QUE ELE É MAIOR QUE O PRÉDIO DE FORA. A casca no clube tem 13 × 7 e aqui
 * são 24 × 18. É mentira consciente, e é o padrão do gênero: interior no
 * tamanho do exterior daria um salão de quatro mesas onde não cabe cozinha
 * nenhuma — e o que este cenário precisa é justamente caber um jogo dentro.
 */

const W = 24;
const D = 18;
const x0 = -W / 2;
const z0 = -D / 2;
const H = 3.3;

/** a fronteira entre a cozinha e o salão */
const PASSAGEM = { z: -2, xIni: -11.5, xFim: -2 };
/** o balcão que fecha a cozinha do lado do bar */
const LATERAL = { x: 0.5, zIni: z0 + 0.2, zFim: -2 };
/** a porta de serviço, na parede da esquerda: é por onde se entra */
const PORTA = { z: -5 };

export const maniaDeChurrasco: SceneDef = {
  id: 'mania-de-churrasco',
  name: 'Mania de Churrasco',
  subtitle: 'o restaurante por dentro, com a cozinha acesa',
  ambient: {
    sky: 0xf3e2c8,
    indoor: true,
    sunColor: 0xfff0d2,
    sunIntensity: 0.9,
    ambientColor: 0xfaeede,
    ambientIntensity: 1.5,
    sunDir: [12, 16, 10],
  },
  // um passo para dentro da cozinha, não colado na porta: o parceiro nasce
  // atrás e ficaria dentro da parede
  spawn: { x: x0 + 1.6, z: PORTA.z, facing: Math.PI / 2 },
  entries: {
    'dos-fundos': { x: x0 + 1.6, z: PORTA.z, facing: Math.PI / 2 },
  },

  build(w) {
    const g = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    // ---------------------------------------------------------------- casca
    // o assoalho corre no salão inteiro; o ladrilho da cozinha vem por cima
    w.ground({ width: W, depth: D, color: P.churrascoPiso, textura: assoalhoDeMadeira(2.4) });
    w.setBounds(x0 + 0.5, z0 + 0.5, W / 2 - 0.5, D / 2 - 0.5);

    /**
     * O PISO DA COZINHA é outro: ladrilho claro em vez da madeira do salão.
     * É o jeito mais barato de dizer "aqui é área de trabalho" sem construir
     * parede nenhuma — e a placa de 1 m dá o tamanho certo de ladrilho de
     * cozinha industrial.
     */
    w.patch(
      (x0 + LATERAL.x) / 2, (z0 + PASSAGEM.z) / 2,
      LATERAL.x - x0, PASSAGEM.z - z0,
      P.churrascoLadrilho, 0, 0.01, pisoDePlacas(1),
    );

    // Parede inteira só em -X e -Z. Nos dois lados que dão para a câmera,
    // mureta: parede alta ali taparia o salão inteiro.
    w.wall(x0, z0, W / 2, z0, H, P.churrascoParede);
    w.wall(W / 2, z0, W / 2, D / 2, 0.5, P.churrascoParede);
    w.wall(x0, D / 2, W / 2, D / 2, 0.5, P.churrascoParede);
    // a parede da esquerda vem em dois trechos, com o vão da porta no meio
    w.wall(x0, z0, x0, PORTA.z - 1.1, H, P.churrascoParede);
    w.wall(x0, PORTA.z + 1.1, x0, D / 2, H, P.churrascoParede);

    /**
     * A FAIXA DE TIJOLO do fundo, atrás da churrasqueira. Ela é o que dá o
     * cheiro do lugar antes de qualquer texto: churrascaria é tijolo aparente,
     * e o tijolo só aparece onde o fogo está.
     */
    const tijolo = new THREE.Mesh(new THREE.BoxGeometry(13, H - 0.1, 0.06), toon(P.churrascoTijolo));
    tijolo.position.set(x0 + 6.5, (H - 0.1) / 2, z0 + 0.17);
    w.add(tijolo);
    for (let i = 0; i < 7; i++) {
      const fiada = new THREE.Mesh(new THREE.BoxGeometry(13, 0.035, 0.075), toon(P.churrascoRejunte));
      fiada.position.set(x0 + 6.5, 0.4 + i * 0.42, z0 + 0.17);
      w.add(fiada);
    }

    /**
     * O lambri de madeira do salão: meia parede, da altura de uma cadeira.
     *
     * SÓ NAS PAREDES DE VERDADE. Ele nasceu também na borda `+X`, que é MURETA
     * de 0,5 — e um lambri de 1,05 numa mureta de 0,5 é uma tábua flutuando no
     * ar. Vale para tudo que se pendura: nesta cena só `-X` e `-Z` têm parede.
     */
    for (const [x, z, larg, rot] of [
      [x0 + 18.5, z0 + 0.16, 11, 0],
      [x0 + 0.16, D / 2 - 5.5, 7, Math.PI / 2],
    ] as const) {
      const lambri = new THREE.Mesh(new THREE.BoxGeometry(larg, 1.05, 0.06), toon(P.churrascoFaixa));
      lambri.position.set(x, 0.525, z);
      lambri.rotation.y = rot;
      w.add(lambri);
      const trilho = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.09, 0.12), toon(P.woodDark));
      trilho.position.set(x, 1.08, z);
      trilho.rotation.y = rot;
      w.add(trilho);
    }

    // rodapé em toda a volta: o risco escuro que tira o ar de caixa vazia
    for (const [x, z, larg, rot] of [
      [0, z0 + 0.06, W, 0],
      [x0 + 0.06, 0, D, Math.PI / 2],
    ] as const) {
      const rodape = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.14, 0.05), toon(P.woodDark));
      rodape.position.set(x, 0.07, z);
      rodape.rotation.y = rot;
      w.add(rodape);
    }

    // ------------------------------------------------------------- a porta
    const porta = w.add(w.place(
      interiorDoor(P.churrascoFaixa, 1.1, 2.2), x0 + 0.1, 0, PORTA.z, Math.PI / 2,
    ));
    w.door({
      x: x0 + 1.0, z: PORTA.z,
      to: 'clube', entry: 'dos-fundos-do-restaurante',
      label: 'Voltar pro clube', icon: '🚪',
      highlight: porta,
    });

    // ============================================================= COZINHA

    /**
     * A CHURRASQUEIRA, encostada no tijolo. Ela é a única cor saturada da cena
     * e fica no fundo à esquerda — o canto que a câmera desenha por último, e
     * portanto o que nunca tapa ninguém.
     */
    const GRELHA = { x: x0 + 3.6, z: z0 + 0.7 };
    const grelha = w.add(w.place(churrasqueira(4.4), GRELHA.x, 0, GRELHA.z));
    w.blockBox(GRELHA.x, GRELHA.z, 2.3, 0.6);

    w.add(w.place(fridge(), x0 + 0.75, 0, z0 + 0.6));
    w.blockBox(x0 + 0.75, z0 + 0.6, 0.45, 0.4);

    w.add(w.place(fogaoIndustrial(2.4), x0 + 7.4, 0, z0 + 0.55));
    w.blockBox(x0 + 7.4, z0 + 0.55, 1.25, 0.45);

    w.add(w.place(bancadaInox(3.2), x0 + 10.4, 0, z0 + 0.5));
    w.blockBox(x0 + 10.4, z0 + 0.5, 1.6, 0.4);
    w.add(w.place(upperCabinets(2.4), x0 + 10.4, 1.75, z0 + 0.2));

    // a pia e a bancada da parede da esquerda, viradas para dentro da cozinha
    const pia = w.add(w.place(piaIndustrial(2.6), x0 + 0.5, 0, z0 + 2.9, Math.PI / 2));
    w.blockBox(x0 + 0.5, z0 + 2.9, 0.42, 1.35);
    w.add(w.place(wallShelf(1.2), x0 + 0.16, 1.75, z0 + 2.9, Math.PI / 2));

    /**
     * A ILHA DE MONTAGEM, solta no meio da cozinha. É a bancada onde o prato
     * vai ser montado quando o jogo existir — e é por isso que ela está VAZIA:
     * o que tem que aparecer nela é a comida.
     */
    const ILHA = { x: x0 + 6.2, z: z0 + 4.6 };
    const ilha = w.add(w.place(bancadaInox(3.6, false), ILHA.x, 0, ILHA.z));
    w.blockBox(ILHA.x, ILHA.z, 1.8, 0.42);

    // ==================================================== BALCÃO DE PASSAGEM
    const larguraPassagem = PASSAGEM.xFim - PASSAGEM.xIni;
    const passagem = w.add(w.place(
      balcaoDePassagem(larguraPassagem),
      (PASSAGEM.xIni + PASSAGEM.xFim) / 2, 0, PASSAGEM.z,
    ));
    w.blockBox((PASSAGEM.xIni + PASSAGEM.xFim) / 2, PASSAGEM.z, larguraPassagem / 2, 0.5);

    // o trecho que corre no Z e fecha a cozinha do lado do bar
    const comprimentoLateral = LATERAL.zFim - LATERAL.zIni;
    w.add(w.place(
      balcaoDePassagem(comprimentoLateral),
      LATERAL.x, 0, (LATERAL.zIni + LATERAL.zFim) / 2, Math.PI / 2,
    ));
    w.blockBox(LATERAL.x, (LATERAL.zIni + LATERAL.zFim) / 2, 0.5, comprimentoLateral / 2);

    // ============================================================== SALÃO

    /**
     * O BAR, no fundo à direita, com a estante de bebidas na parede e as
     * banquetas de frente para ele. As duas únicas luminárias pendentes da
     * cena moram aqui: sobre o balcão ninguém senta de frente para a câmera,
     * então elas não apagam a cabeça de ninguém.
     */
    const BAR = { x: 6.5, z: z0 + 0.9 };
    const bar = w.add(w.place(balcaoDePassagem(6.4), BAR.x, 0, BAR.z));
    w.blockBox(BAR.x, BAR.z, 3.3, 0.5);
    w.add(w.place(estanteDeBebidas(3.4, 1.7), BAR.x, 0.7, z0 + 0.2));
    w.add(w.place(caixaRegistradora(), BAR.x + 2.4, 1.16, BAR.z + 0.1));
    for (const dx of [-2.2, -0.8, 0.6, 2.0]) {
      w.add(w.place(banquetaAlta(), BAR.x + dx, 0, BAR.z + 0.95, Math.PI));
      w.blockCircle(BAR.x + dx, BAR.z + 0.95, 0.3);
    }
    for (const dx of [-1.9, 1.9]) w.add(w.place(luminariaPendente(), BAR.x + dx, 0, BAR.z + 0.2));

    /**
     * AS MESAS. Nove, em três fileiras desencontradas — enfileirar tudo em
     * grade dá cara de refeitório, e não de casa que enche no domingo.
     *
     * A toalha xadrez é um decalque fino em cima do tampo: com ela, a mesa
     * deixa de ser um disco de madeira e vira mesa posta.
     */
    const MESAS = [
      [3.6, -5.2], [9.4, -5.2],
      [-9.2, 1.2], [-4.6, 1.2], [0.2, 1.2], [5.2, 1.2], [10.0, 1.2],
      [-7.2, 5.6], [-2.4, 5.6], [2.6, 5.6], [7.6, 5.6],
    ] as const;
    for (const [x, z] of MESAS) {
      w.add(w.place(diningTable(1.5, 1.0), x, 0, z));
      w.blockBox(x, z, 0.8, 0.55);
      /**
       * A TOALHA COBRE O TAMPO E CAI 12 CM DOS LADOS. A primeira versão era um
       * decalque de 2 cm em `y = 0,755` — dentro do tampo, que vai de 0,705 a
       * 0,795: ela existia e não aparecia. Toalha que não pendura não é toalha,
       * é adesivo.
       */
      const toalha = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.17, 1.14), toon(P.churrascoToalha));
      toalha.position.set(x, 0.73, z);
      w.add(toalha);
      // as quatro cadeiras: duas de frente para a câmera e duas de costas, e é
      // essa alternância que faz a fileira parecer ocupada por gente diferente
      for (const [dx, dz, rot] of [
        [-0.55, 0.95, Math.PI], [0.55, 0.95, Math.PI],
        [-0.55, -0.95, 0], [0.55, -0.95, 0],
      ] as const) {
        w.add(w.place(chair(P.churrascoFaixa), x + dx, 0, z + dz, rot));
        w.blockCircle(x + dx, z + dz, 0.26);
      }
    }

    // ------------------------------------------------------------- enfeites
    // o letreiro do nome, em cima do bar: é a primeira coisa que se lê ao entrar
    const placaFundo = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.9, 0.08), toon(P.churrascoQuadroNegro));
    placaFundo.position.set(BAR.x, 2.5, z0 + 0.2);
    w.add(placaFundo);
    const nome = letreiro('Mania de Churrasco', 5.6, 0.62, '#ffd88a');
    nome.position.set(BAR.x, 2.52, z0 + 0.26);
    w.add(nome);

    const lousa = w.add(w.place(
      quadroDeGiz(['Hoje', 'picanha na brasa', 'arepa recheada', 'suco de morango'], 1.7, 1.35),
      -8.5, 1.85, z0 + 0.18,
    ));

    /**
     * As arandelas moram nas DUAS paredes de verdade (`-Z` e `-X`). Estavam na
     * borda `+X`, que é mureta de 0,5: cinco luminárias boiando no vazio a dois
     * metros do chão.
     */
    for (const [x, z, rot] of [
      [-2.0, z0 + 0.14, 0], [1.6, z0 + 0.14, 0], [11.0, z0 + 0.14, 0],
      [x0 + 0.14, 1.5, Math.PI / 2], [x0 + 0.14, 6.0, Math.PI / 2],
    ] as const) {
      w.add(w.place(arandela(), x, 2.15, z, rot));
    }

    w.add(w.place(pictureFrame(0.9, 0.7, P.churrascoTijolo), 11.4, 1.9, z0 + 0.16));
    w.add(w.place(pictureFrame(0.7, 0.9, P.grassDark), -0.6, 1.95, z0 + 0.16));

    for (const [x, z] of [[W / 2 - 1.0, D / 2 - 1.2], [x0 + 1.1, D / 2 - 1.2], [11.2, -1.4]] as const) {
      w.add(w.place(pottedPlant(1.2), x, 0, z));
      w.blockCircle(x, z, 0.32);
    }

    // o capacho da entrada de serviço, para a porta não abrir no vazio
    w.add(w.place(rug(1.6, 1.1, P.churrascoTijolo), x0 + 1.5, 0, PORTA.z));

    // ========================================================= interações

    w.interact({
      id: 'mania:grelha',
      x: GRELHA.x, z: GRELHA.z + 1.5, radius: 2.2,
      label: 'Olhar a churrasqueira', icon: '🔥',
      highlight: grelha,
      onInteract: async (api) => {
        await conversa([
          [R, 'A brasa tá acesa. Tem gente que volta pra cá depois do almoço.'],
          [A, 'Tá quente mesmo. Chega a esquentar a cara.'],
          [R, 'Cheiro bom, né?'],
          [A, 'Cheiro de domingo.'],
        ]);
        api.toast('Cheiro de brasa', '🔥');
        api.unlock({
          id: 'brasa-do-mania',
          title: 'A brasa acesa',
          place: 'Mania de Churrasco',
          note: 'A cozinha vazia com a churrasqueira acesa, esperando alguém voltar.',
          icon: '🔥',
        });
      },
    });

    w.interact({
      id: 'mania:passagem',
      x: (PASSAGEM.xIni + PASSAGEM.xFim) / 2, z: PASSAGEM.z + 1.3, radius: 2.4,
      label: 'Olhar o balcão de passagem', icon: '🍽️',
      highlight: passagem,
      onInteract: async () => {
        await conversa([
          [A, 'É aqui que a comida sai da cozinha, né?'],
          [R, 'É. Um bota de um lado, o outro pega do outro.'],
          [A, 'A gente daria conta?'],
          [R, 'Você na cozinha e eu no salão? A gente daria conta.'],
          [A, 'Então um dia a gente volta e faz um turno.'],
        ]);
      },
    });

    w.interact({
      id: 'mania:bar',
      x: BAR.x, z: BAR.z + 1.9, radius: 2.4,
      label: 'Olhar o bar', icon: '🥤',
      highlight: bar,
      onInteract: async (api) => {
        await conversa([
          [R, 'Olha o tanto de garrafa.'],
          [A, 'E o caixa aberto. Confiam mesmo na gente.'],
          [R, 'Confiam na girafa, que deixou a gente entrar.'],
        ]);
        api.som('sino');
      },
    });

    w.interact({
      id: 'mania:lousa',
      x: -8.5, z: z0 + 1.5, radius: 2,
      label: 'Ler o quadro do dia', icon: '🖍️',
      highlight: lousa,
      onInteract: async () => {
        await conversa([
          [A, 'Picanha na brasa, arepa recheada e suco de morango.'],
          [R, 'Escreveram o seu almoço inteiro num quadro.'],
          [A, 'Eles me conhecem.'],
        ]);
      },
    });

    w.interact({
      id: 'mania:ilha',
      x: ILHA.x, z: ILHA.z + 1.2, radius: 2,
      label: 'Olhar a bancada', icon: '🔪',
      highlight: ilha,
      onInteract: async (api) => {
        await conversa([
          [R, 'Bancada limpa, tudo no lugar.'],
          [A, 'É aqui que monta o prato.'],
        ]);
        api.toast('Tudo no lugar, esperando', '🔪');
      },
    });

    w.interact({
      id: 'mania:pia',
      x: x0 + 1.5, z: z0 + 2.9, radius: 1.8,
      label: 'Olhar a pia', icon: '🚰',
      highlight: pia,
      onInteract: async () => {
        await conversa([
          [A, 'Louça toda lavada.'],
          [R, 'Alguém saiu daqui com a consciência tranquila.'],
        ]);
      },
    });
  },
};
