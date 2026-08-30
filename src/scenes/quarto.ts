import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { PecaRoupa, SceneDef, SlotRoupa } from '../core/types';
import {
  armario, bed, bookshelf, chair, desk, espelho, nightstand,
  pictureFrame, pottedPlant, rug, wallShelf, windowFrame,
} from '../world/furniture';
import { toon } from '../core/materials';
import { ARI, RENAN } from '../characters/cast';
import { todasAsPecas } from '../world/roupas';

/**
 * Quarto do Ari.
 *
 * O quarto que já existia na casa é o da Rubi, a roommate — é dela a porta de
 * onde sai kpop. Este é o do Ari, e ele nasceu por um motivo prático: a casa
 * tem 12 × 9 e o fundo inteiro já está ocupado, então o guarda-roupa não cabia
 * lá dentro sem tirar o sofá ou a cozinha do lugar.
 *
 * Planta (a câmera vê -Z subindo à direita e -X subindo à esquerda):
 *   parede do fundo (-Z): cama · criado-mudo · estante · ARMÁRIO
 *   parede da esquerda (-X): espelho · janela · escrivaninha
 *   frente (+Z): mureta com a porta de volta para a sala
 */

const W = 8;
const D = 6.5;
const x0 = -W / 2;
const z0 = -D / 2;
const H = 2.8;

/** onde o armário encosta na parede do fundo */
const ARMARIO = { x: 2.65, z: z0 + 0.36 };

const NOMES: Record<SlotRoupa, string> = {
  cabeca: 'Cabeça',
  tronco: 'Tronco',
  pernas: 'Pernas',
  pes: 'Pés',
};

export const quarto: SceneDef = {
  id: 'quarto',
  name: 'Quarto do Ari',
  subtitle: 'a porta que fica sempre encostada',
  ambient: {
    sky: 0xe2eef7,
    indoor: true,
    sunColor: 0xfff4de,
    sunIntensity: 0.95,
    ambientColor: 0xeaf3fb,
    ambientIntensity: 1.45,
    sunDir: [10, 15, 12],
  },
  // um passo para dentro, não colado na passagem: entrando pela porta, o
  // parceiro nasce atrás e ficaria em cima da mureta
  spawn: { x: 0.9, z: 1.7, facing: Math.PI },
  entries: {
    'da-sala': { x: 0.9, z: 1.7, facing: Math.PI },
  },

  build(w) {
    const g0 = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g0.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    // --------------------------------------------------------------- casca
    w.ground({ width: W, depth: D, color: P.floorWood });
    w.setBounds(x0 + 0.45, z0 + 0.45, W / 2 - 0.45, D / 2 - 0.45);

    // Parede inteira só em -X e -Z; nos dois lados abertos, mureta. Parede alta
    // do lado da câmera taparia o quarto inteiro.
    w.wall(x0, z0, W / 2, z0, H, P.wallAzul);
    w.wall(x0, z0, x0, D / 2, H, P.wallAzul);
    w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.wallAzul);

    // Mureta da frente com um vão no meio, e NENHUM batente alto.
    //
    // A primeira versão tinha dois trechos de 2,5 ladeando a porta, como a
    // parede da rua na sala. Aqui não funciona: a saída fica no meio da parede
    // que dá para a câmera, e os dois pilares caíram exatamente entre a câmera
    // e a dupla — o casal sumia atrás deles ao entrar. A folha da porta mora do
    // lado da SALA, que é de onde ela se vê; deste lado é só a passagem.
    const xPorta = 0.9;
    const vao = 1.1;
    w.wall(x0, D / 2, xPorta - vao / 2, D / 2, 0.45, P.wallAzul);
    w.wall(xPorta + vao / 2, D / 2, W / 2, D / 2, 0.45, P.wallAzul);

    // rodapé: um risco escuro na base da parede tira o ar de caixa vazia
    for (const [x, z, larg, rot] of [
      [0, z0 + 0.06, W, 0],
      [x0 + 0.06, 0, D, Math.PI / 2],
    ] as const) {
      const rodape = new THREE.Mesh(
        new THREE.BoxGeometry(larg, 0.12, 0.05),
        toon(0xb9cddc),
      );
      rodape.position.set(x, 0.06, z);
      rodape.rotation.y = rot;
      w.add(rodape);
    }

    // ------------------------------------------------- parede do fundo (-Z)
    const cama = w.add(w.place(bed(P.fabricBlue), -2.2, 0, -1.75));
    w.blockBox(-2.2, -1.75, 0.78, 1.08);

    w.add(w.place(nightstand(), -1.05, 0, -2.72));
    w.blockBox(-1.05, -2.72, 0.24, 0.22);

    const estante = w.add(w.place(bookshelf(1.9, 1.1), 0.15, 0, z0 + 0.22));
    w.blockBox(0.15, z0 + 0.22, 0.55, 0.18);

    const movel = w.add(w.place(armario(P.wallMint), ARMARIO.x, 0, ARMARIO.z));
    w.blockBox(ARMARIO.x, ARMARIO.z, 0.8, 0.32);

    // ---------------------------------------------- parede da esquerda (-X)
    // O espelho fica ao lado do armário na hora de se olhar, mas na parede de
    // -X ele aparece de frente para a câmera em vez de de perfil.
    const espelhoObj = w.add(w.place(espelho(P.woodDark), x0 + 0.12, 0, -0.6, Math.PI / 2));

    w.add(w.place(windowFrame(1.6, 1.2), x0 + 0.16, 1.7, 1.0, Math.PI / 2));

    // escrivaninha virada para -X: assim o monitor olha para dentro do quarto
    // e quem senta fica de costas para a parede, não para a câmera
    const escrivaninha = w.add(w.place(desk(), x0 + 0.5, 0, 2.0, -Math.PI / 2));
    w.blockBox(x0 + 0.5, 2.0, 0.4, 0.82);
    w.add(w.place(chair(P.woodDark), x0 + 1.35, 0, 2.0, -Math.PI / 2));

    // ------------------------------------------------------------- enfeites
    w.add(w.place(rug(2.6, 2.0, P.rug), 0.3, 0, 1.1));
    // o canto de +X ficava um vazio marrom do tamanho de meia sala
    w.add(w.place(pottedPlant(1.15), W / 2 - 0.75, 0, 0.9));
    w.blockCircle(W / 2 - 0.75, 0.9, 0.3);
    w.add(w.place(pictureFrame(0.6, 0.75, P.flowerPink), -2.2, 1.85, z0 + 0.17));
    w.add(w.place(wallShelf(0.9), 1.05, 1.9, z0 + 0.19));

    // ------------------------------------------------------- porta pra sala
    w.door({
      x: xPorta, z: D / 2 - 0.7,
      to: 'casa', entry: 'do-quarto',
      label: 'Voltar pra sala', icon: '🚪',
    });

    // ------------------------------------------------------------- o armário
    //
    // Enquanto o painel do guarda-roupa não existe, a escolha é por diálogo:
    // um `ask` para o slot e outro para a peça. Quando o painel chegar, esta
    // interação passa a abri-lo e o resto daqui não muda.
    w.interact({
      id: 'quarto:armario',
      x: ARMARIO.x, z: ARMARIO.z + 1.25, radius: 1.8,
      label: 'Abrir o armário', icon: '🚪',
      highlight: movel,
      onInteract: async (g) => {
        // Primeira vez: as roupas que já estavam lá dentro entram no acervo. É
        // o armário dele — as peças não precisam ser "ganhas" em lugar nenhum.
        if (!g.flag('armario-aberto')) {
          g.setFlag('armario-aberto');
          for (const peca of todasAsPecas()) g.unlockClothing(peca.id);
          await conversa([
            [A, 'Pode mexer, fica à vontade.'],
            [R, 'Tem mais roupa aqui do que no meu apartamento inteiro.'],
          ]);
          g.unlock({
            id: 'armario-do-ari',
            title: 'O armário do Ari',
            place: 'Quarto do Ari',
            note: 'Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.',
            icon: '👕',
          });
        }

        const acervo = g.wardrobe();
        if (acervo.length === 0) {
          await conversa([[A, 'Tá vazio. Nem eu sei o que aconteceu aqui.']]);
          return;
        }

        const slots: SlotRoupa[] = ['cabeca', 'tronco', 'pernas', 'pes'];
        const qual = await g.ask(
          `Vestir o quê, ${g.playerName()}?`,
          slots.map((s) => NOMES[s]),
        );
        const slot = slots[qual];

        const doSlot = acervo.filter((p: PecaRoupa) => p.slot === slot);
        if (doSlot.length === 0) {
          await conversa([[A, `Não tenho nada de ${NOMES[slot].toLowerCase()} aqui.`]]);
          return;
        }

        const vestido = g.clothingLoadout()[slot];
        const opcoes = [...doSlot.map((p) => p.nome), vestido ? 'Tirar' : 'Deixar assim'];
        const escolha = await g.ask(NOMES[slot], opcoes);

        if (escolha >= doSlot.length) {
          if (vestido) {
            g.removeClothing(slot);
            g.som('escolha');
            g.toast('Tirou a peça', '🧺');
          }
          return;
        }

        const peca = doSlot[escolha];
        g.wearClothing(peca.id);
        g.som('escolha');
        g.toast(peca.nome, peca.icone);
      },
    });

    // -------------------------------------------------------- as outras coisas
    w.interact({
      id: 'quarto:espelho',
      x: x0 + 0.95, z: -0.6, radius: 1.5,
      label: 'Se olhar no espelho', icon: '🪞',
      highlight: espelhoObj,
      onInteract: async (g) => {
        const l = g.clothingLoadout();
        const quantas = Object.keys(l).length;
        if (quantas === 0) {
          await conversa([
            [R, 'Tô bem assim?'],
            [A, 'Tá. Mas tem um armário inteiro logo ali.'],
          ]);
          return;
        }
        await conversa([
          [A, `Olha só, ${g.playerName()}.`],
          [R, 'Ficou bom mesmo.'],
        ]);
      },
    });

    w.interact({
      id: 'quarto:cama',
      x: -2.2, z: -0.5, radius: 1.6,
      label: 'Olhar a cama', icon: '🛏️',
      highlight: cama,
      onInteract: () =>
        conversa([
          [R, 'Essa cama é bem melhor que a minha.'],
          [A, 'É a mesma cama de sempre.'],
          [R, 'Não é a cama então.'],
        ]),
    });

    w.interact({
      id: 'quarto:mesa',
      x: x0 + 1.5, z: 2.0, radius: 1.5,
      label: 'Olhar a escrivaninha', icon: '💻',
      highlight: escrivaninha,
      onInteract: () =>
        conversa([
          [A, 'É daqui que eu te mando mensagem de madrugada.'],
          [R, 'Eu sei. Eu tô acordado do outro lado.'],
        ]),
    });

    w.interact({
      id: 'quarto:estante',
      x: 0.35, z: -2.2, radius: 1.4,
      label: 'Olhar a estante', icon: '📚',
      highlight: estante,
      onInteract: () =>
        conversa([
          [R, 'Você leu todos esses?'],
          [A, 'Comecei todos esses.'],
        ]),
    });
  },
};
