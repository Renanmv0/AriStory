import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import { flat } from '../core/materials';
import {
  bin, bleachers, building, bus, busStop, bush, canteiro, cloud, divingBoard,
  floatRing, floodlight, flowers, kiosk, lamp, parasol, picnicTable, poolLadder,
  poolShell, poolWater, showerPost, sunLounger, textSign, tree, waterFountain,
} from '../world/props';
import { ARI, RENAN } from '../characters/cast';
import { ITENS, MODA_PRAIA } from '../world/itens';

/**
 * Clube — a piscina.
 *
 * Cenário do que ainda não aconteceu: a gente ainda não foi, então o jogo vai
 * na frente. A piscina é um buraco de verdade no piso (`w.groundWithHoles`),
 * e quem entra na água afunda e passa a nadar.
 */

const PISCINA = { x: 0, z: -3, largura: 16, profundidade: 10, fundo: 1.6 };

/**
 * O piso do clube. Ele cresceu de 34×26 para 48×38 — a grama virou uma moldura
 * fina em volta em vez de metade da tela, e sobrou deck para as atrações que
 * ainda vão entrar.
 *
 * A PISCINA NÃO SE MEXE. O furo que o `groundWithHoles` abre no piso é o que
 * deixa quem afunda continuar visível; ele sai de `PISCINA`, não daqui, então
 * mexer no deck nunca arrasta o buraco junto.
 */
const DECK = { z: -2, largura: 48, profundidade: 38 };

/**
 * Onde o ônibus encosta: canto de baixo à ESQUERDA, deitado ao longo do Z.
 *
 * Ele tem 2,9 de altura, e a câmera isométrica vem de `+X/+Z` — o que estiver
 * com x ou z maior que o jogador é desenhado NA FRENTE dele. Na borda de baixo
 * (`+Z`, onde estava a cerca) um ônibus taparia quem fosse embarcar; na borda
 * da esquerda ele fica ATRÁS de quem chega, e ainda mostra a porta, que é o
 * lado interessante.
 */
const PARADA = { x: -21, z: 9 };

/**
 * O ponto de embarque, na frente da porta do ônibus.
 *
 * Depois do giro de `PI/2` a porta (local `x = 2,6`, `z = 1,25`) cai em
 * `(+1,25, -2,6)` do centro da peça. O `+2,4` em X é ela mais a folga do corpo,
 * senão quem nasce aqui já nasce dentro do colisor.
 */
const EMBARQUE = { x: PARADA.x + 2.4, z: PARADA.z - 2.6 };

function dentroDaPiscina(x: number, z: number, margem = 0): boolean {
  return (
    Math.abs(x - PISCINA.x) < PISCINA.largura / 2 - margem &&
    Math.abs(z - PISCINA.z) < PISCINA.profundidade / 2 - margem
  );
}

export const clube: SceneDef = {
  id: 'clube',
  name: 'Clube',
  subtitle: 'a piscina que a gente ainda não conhece',
  // chegou no clube, já está de calção
  outfit: 'banho',
  ambient: {
    sky: 0x9fdcff,
    fog: 0xd6f0ff,
    fogNear: 100,
    fogFar: 210,
    sunColor: 0xfff6e0,
    sunIntensity: 1.75,
    ambientColor: 0xdcf2ff,
    ambientIntensity: 1.05,
    sunDir: [15, 22, 11],
  },
  // Quem chega, chega DE ÔNIBUS: o ponto de entrada é a porta dele, virado
  // para dentro do clube (+X). Antes era o portão da cerca, no meio da borda
  // de baixo — a cerca saiu e o ônibus tomou o lugar dela.
  spawn: { x: EMBARQUE.x, z: EMBARQUE.z, facing: Math.PI / 2 },
  entries: {
    portaria: { x: EMBARQUE.x, z: EMBARQUE.z, facing: Math.PI / 2 },
    beira: { x: 0, z: 3.5, facing: Math.PI },
  },

  build(w) {
    const g = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;
    const buraco = {
      x: PISCINA.x,
      z: PISCINA.z,
      width: PISCINA.largura,
      depth: PISCINA.profundidade,
    };

    // -------------------------------------------------------------- terreno
    // grama e deck precisam do MESMO furo, senao a grama aparece no fundo da piscina
    w.groundWithHoles({ width: 160, depth: 160, color: P.grass, holes: [buraco] });
    // O furo do `groundWithHoles` é LOCAL à malha: ele acaba em
    // `opts.z + hole.z` no mundo. A grama nasce em `z = 0`, então para ela o
    // furo já cai no lugar; o deck nasce deslocado, e o furo dele precisa
    // descontar esse deslocamento.
    //
    // Isso já estava errado por 1 unidade antes desta mudança (deck em `-1`,
    // piscina em `-3`) — é a faixa de grama que aparecia colada na borda de
    // trás da piscina, com o trampolim em cima dela. Com o deck maior o erro
    // ia dobrar, então ele morre aqui.
    w.groundWithHoles({
      width: DECK.largura,
      depth: DECK.profundidade,
      color: 0xe4e0d6,
      y: 0.015,
      z: DECK.z,
      holes: [{ ...buraco, z: buraco.z - DECK.z }],
    });
    // o limite de caminhada fica DENTRO do deck: assim ninguém pisa na grama,
    // que agora é só a moldura de fora
    w.setBounds(-22, -19, 22, 16);

    // ------------------------------------------------------------- piscina
    w.add(w.place(poolShell(PISCINA.largura, PISCINA.profundidade, PISCINA.fundo), PISCINA.x, 0, PISCINA.z));
    const agua = poolWater(PISCINA.largura, PISCINA.profundidade);
    agua.position.set(PISCINA.x, -0.12, PISCINA.z);
    w.root.add(agua);

    // linhas de raia pintadas no fundo — decalque: colada no piso da piscina,
    // ela so nao briga com ele porque nao grava profundidade
    for (const x of [-5.2, -1.8, 1.8, 5.2]) {
      const raia = new THREE.Mesh(
        new THREE.PlaneGeometry(0.24, PISCINA.profundidade - 1.4),
        flat(0x3f8ab0, 1, true),
      );
      raia.rotation.x = -Math.PI / 2;
      raia.position.set(PISCINA.x + x, -PISCINA.fundo + 0.08, PISCINA.z);
      raia.renderOrder = 1;
      w.root.add(raia);
    }

    for (const x of [-5, 5]) {
      w.add(w.place(poolLadder(), x, 0, PISCINA.z + PISCINA.profundidade / 2));
    }
    const trampolim = w.add(
      w.place(divingBoard(), 0, 0, PISCINA.z - PISCINA.profundidade / 2 - 1.6),
    );
    w.blockBox(0, PISCINA.z - PISCINA.profundidade / 2 - 1.9, 0.4, 0.4);

    // boias na agua
    const boias = [floatRing(P.frisbee), floatRing(0xffd85e), floatRing(0x6fd3f0)];
    boias.forEach((b, i) => {
      w.place(b, -4.5 + i * 4.6, -0.05, PISCINA.z - 1.6 + (i % 2) * 2.6);
      w.root.add(b);
    });

    // ----------------------------------------------------------- espreguicadeiras
    const cores = [P.fabricBlue, P.fabricRed, 0x5cb04f, 0xffc94d];
    for (let i = 0; i < 6; i++) {
      const x = -7.5 + i * 3;
      w.add(w.place(sunLounger(cores[i % cores.length]), x, 0, 5.4, Math.PI));
      w.blockBox(x, 5.4, 0.36, 0.85);
      if (i % 2 === 0) {
        w.add(w.place(parasol(i % 4 === 0 ? P.fabricRed : 0x4a7fe0), x + 1.5, 0, 6.9));
        w.blockCircle(x + 1.5, 6.9, 0.3);
      }
    }
    const espreguicadeira = w.add(w.place(sunLounger(P.rug), 10.5, 0, 2.2, -Math.PI / 2));
    w.blockBox(10.5, 2.2, 0.85, 0.36);
    w.add(w.place(parasol(0xff8fb1), 11.6, 0, 3.6));
    w.blockCircle(11.6, 3.6, 0.3);

    // ------------------------------------------------------ apoio do clube
    const chuveiro = w.add(w.place(showerPost(), -11, 0, 2.5, -Math.PI / 2));
    w.blockCircle(-11, 2.5, 0.3);

    // balcão virado para +Z: de costas para a câmera ninguém via o bar
    const bar = w.add(w.place(kiosk(0x4ec1a8, { tipo: 'suco' }), -12.5, 0, 7.2, 0.35));
    w.blockBox(-12.5, 7.2, 1.4, 1, 0.35);

    // O vestiário foi para o FUNDO do deck (era `13, -9`), encostado no limite
    // novo. Ele tem 3,2 de altura: no meio do cenário ele tapava a piscina, e
    // lá atrás a câmera pega a fachada dele de frente sem esconder nada.
    const vestiario = w.add(w.place(building(6, 3.2, 4, P.wallCream, 0x7aa6c4), 15, 0, -18));
    w.blockBox(15, -18, 3, 2);
    // O banco saiu de perto da piscina e foi para a lateral direita, virado
    // para a água (`-X`). Ele já tinha saído da frente da porta do vestiário
    // uma vez — quem chegasse na porta só via "Sentar no banco" — e agora que a
    // porta mudou de lugar ele continua longe dela.
    w.banco(14, -3, -Math.PI / 2);

    // ------------------------------------------------- ocupando o deck novo
    // Nada aqui é atração: é o mobiliário que faz um pátio de concreto parecer
    // um clube. Tudo sai do kit, e a única regra é a de sempre — peça com
    // frente olha para `+Z`, senão a câmera pega só o fundo liso dela.

    // A ARQUIBANCADA da piscina, uma de cada lado do trampolim. Os degraus
    // sobem para `-Z` e o assento olha para `+Z`, ou seja, para a água.
    for (const x of [-7, 7]) {
      w.add(w.place(bleachers(6), x, 0, -12.5));
      w.blockBox(x, -13.2, 3, 1);
    }

    // A ÁREA DE MESAS, no fundo à esquerda — o canto que ficou mais vazio com
    // o deck novo. Guarda-sol em duas delas, que é o que sempre tem.
    for (const [x, z, comSol] of [[-17, -7, true], [-13, -12, false], [-18, -15, true]] as const) {
      w.add(w.place(picnicTable(), x, 0, z));
      w.blockBox(x, z, 1.1, 0.8);
      if (comSol) {
        w.add(w.place(parasol(0x5cb04f), x + 1.7, 0, z + 1.2));
        w.blockCircle(x + 1.7, z + 1.2, 0.3);
      }
    }
    w.add(w.place(bin(), -11.5, 0, -6.5));
    w.blockCircle(-11.5, -6.5, 0.3);

    // CANTEIROS quebrando o concreto. Eles têm borda elevada de propósito:
    // mancha pintada no chão brigaria com o deck, calota com volume não briga
    // com nada.
    for (const [x, z, r] of [
      [-20, -3, 1.3], [-4, -17, 1.1], [12, 6, 1.2], [19, -8, 1.4], [8, 12, 1.1],
    ] as const) {
      w.add(w.place(canteiro(r), x, 0, z));
      w.blockCircle(x, z, r);
    }

    // O CALÇADÃO da frente: postes em fila, bebedouro e lixeira. É a faixa por
    // onde todo mundo entra, e era só concreto liso.
    for (const x of [-9, -2, 5, 12]) {
      w.add(w.place(lamp(), x, 0, 12));
      w.blockCircle(x, 12, 0.25);
    }
    w.add(w.place(waterFountain(), 11.5, 0, 3.4));
    w.blockBox(11.5, 3.4, 0.3, 0.25);
    w.add(w.place(bin(), 6.5, 0, 11.4));
    w.blockCircle(6.5, 11.4, 0.3);

    // O PONTO DE ÔNIBUS, ao lado de quem já está parado ali. A cobertura abre
    // para `+Z`; a fila fica de frente para a câmera.
    w.add(w.place(busStop(), -17, 0, 12.5));
    w.blockBox(-17, 11.9, 1.9, 1);

    // PLACAS. É o que mais faz um lugar parecer clube de verdade: o texto sai
    // de um canvas em tempo de execução, que é a única "textura" que o projeto
    // permite.
    for (const [texto, cor, x, z] of [
      ['Piscina', P.fabricBlue, 3, 9.6],
      ['Sucos', 0x4ec1a8, -15.5, 10.2],
      ['Vestiário', 0x7aa6c4, 15, -12.6],
    ] as const) {
      w.add(w.place(textSign(texto, cor), x, 0, z));
      w.blockCircle(x, z, 0.25);
    }

    // REFLETORES nos dois cantos do fundo — clube que fecha tarde tem.
    for (const x of [-20, 21]) {
      w.add(w.place(floodlight(), x, 0, -19));
      w.blockCircle(x, -19, 0.35);
    }

    // ------------------------------------------------------------ jardim
    // A vegetação seguiu o deck para fora: com o piso em 48×38, as palmeiras
    // que estavam em `±18` nasceriam no meio do concreto. Elas voltam a ser a
    // moldura verde da cena, agora na beirada do piso novo.
    w.setSeed(90210);
    const bordaX = DECK.largura / 2 + 1.5;
    const bordaZ = DECK.profundidade / 2 + 1.5;
    for (const [x, z] of [
      [-bordaX, -8], [-bordaX, 4], [bordaX, 2], [bordaX, -10],
      [-9, -bordaZ + DECK.z], [11, -bordaZ + DECK.z], [-4, bordaZ + DECK.z],
    ] as const) {
      w.add(w.place(tree('palmeira', w.range(0.95, 1.2), w.rng()), x, 0, z));
      w.blockCircle(x, z, 0.5);
    }
    for (let i = 0; i < 26; i++) {
      const x = w.range(-34, 34);
      const z = w.range(-32, 28);
      // nada de arbusto brotando no deck
      if (Math.abs(x) < DECK.largura / 2 + 1 &&
        Math.abs(z - DECK.z) < DECK.profundidade / 2 + 1) continue;
      w.add(w.place(i % 2 ? bush(w.range(0.7, 1.1)) : flowers(6, 1.1), x, 0, z));
    }
    for (let i = 0; i < 6; i++) {
      const c = cloud(w.range(1.8, 3));
      c.position.set(w.range(-60, 60), w.range(40, 52), w.range(-50, 30));
      w.root.add(c);
      const deriva = w.range(0.2, 0.5);
      w.onUpdate((dt) => {
        c.position.x += deriva * dt;
        if (c.position.x > 62) c.position.x = -62;
      });
    }

    // ------------------------------------------------------------ a saida
    // A cerca da borda de baixo saiu inteira (as duas brancas e o portão
    // dourado): quem fecha o clube agora é o limite invisível, e quem leva
    // embora é o ônibus.
    //
    // `rotation.y = PI/2` deita o ônibus ao longo do Z e leva a porta dele (que
    // nasce no `+Z` local) para o `+X` do mundo — virada para dentro do clube,
    // que é de onde a dupla chega.
    const onibus = w.add(w.place(bus(), PARADA.x, 0, PARADA.z, Math.PI / 2));
    w.blockBox(PARADA.x, PARADA.z, 1.3, 4.3);

    w.door({
      x: EMBARQUE.x, z: EMBARQUE.z,
      to: 'villa-lobos', entry: 'clube',
      label: 'Pegar o ônibus pro parque', icon: '🚌',
      highlight: onibus,
      radius: 2.4,
    });

    // -------------------------------------------------------------- respingos
    interface Respingo {
      mesh: THREE.Mesh;
      vy: number;
      vida: number;
    }
    const respingos: Respingo[] = [];
    const espirrar = (x: number, z: number, quantos = 12): void => {
      g.som('agua'); // todo respingo faz barulho: piscina, trampolim e chuveiro
      for (let i = 0; i < quantos; i++) {
        const gota = new THREE.Mesh(
          new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 6, 5),
          flat(0xdff4ff, 0.9),
        );
        const a = (i / quantos) * Math.PI * 2;
        const r = 0.2 + Math.random() * 0.5;
        gota.position.set(x + Math.cos(a) * r, -0.1, z + Math.sin(a) * r);
        w.root.add(gota);
        respingos.push({ mesh: gota, vy: 2.2 + Math.random() * 2.4, vida: 1 });
      }
    };

    // -------------------------------------------------------------- a agua
    let molhadoJog = 0;
    let molhadoPar = 0;
    let jaNadou = false;

    w.onUpdate((dt, t) => {
      // ondulacao de superficie
      agua.position.y = -0.12 + Math.sin(t * 1.4) * 0.015;

      boias.forEach((b, i) => {
        b.position.y = -0.05 + Math.sin(t * 1.1 + i * 1.7) * 0.05;
        b.rotation.y = Math.sin(t * 0.4 + i) * 0.4;
      });

      const pj = g.playerPosition();
      const pp = g.companionPosition();
      const alvoJog = dentroDaPiscina(pj.x, pj.z, 0.2) ? 1 : 0;
      const alvoPar = dentroDaPiscina(pp.x, pp.z, 0.2) ? 1 : 0;

      // transicao suave: sem isso o corpo pula 90cm de uma vez na borda
      molhadoJog += (alvoJog - molhadoJog) * Math.min(1, dt * 5);
      molhadoPar += (alvoPar - molhadoPar) * Math.min(1, dt * 5);
      g.submergePlayer(molhadoJog);
      g.submergeCompanion(molhadoPar);

      if (alvoJog === 1 && !jaNadou) {
        jaNadou = true;
        espirrar(pj.x, pj.z, 10);
        g.toast('Água morninha', '💦');
        g.unlock({
          id: 'piscina-clube',
          title: 'A piscina do clube',
          place: 'Clube',
          note: 'A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.',
          icon: '🏊',
        });
      }

      for (let i = respingos.length - 1; i >= 0; i--) {
        const r = respingos[i];
        r.vy -= 9 * dt;
        r.mesh.position.y += r.vy * dt;
        r.vida -= dt * 0.9;
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, r.vida);
        if (r.vida <= 0 || r.mesh.position.y < -0.6) {
          w.root.remove(r.mesh);
          r.mesh.geometry.dispose();
          respingos.splice(i, 1);
        }
      }
    });

    // ----------------------------------------------------------- interacoes
    // objeto invisivel que carrega o personagem durante o pulo
    const salto = new THREE.Object3D();
    w.root.add(salto);

    w.interact({
      id: 'clube:trampolim',
      x: 0, z: PISCINA.z - PISCINA.profundidade / 2 - 0.6, radius: 2.2,
      label: 'Pular do trampolim', icon: '🤿',
      highlight: trampolim,
      onInteract: async (api) => {
        api.lockPlayer(true);
        await api.say(['Do trampolim?', 'Do trampolim.']);

        const partida = new THREE.Vector3(0, 0.95, PISCINA.z - PISCINA.profundidade / 2 - 0.4);
        const chegada = new THREE.Vector3(0, -0.6, PISCINA.z + 1.2);
        salto.position.copy(partida);
        api.ridePlayer(salto, new THREE.Vector3(0, 0, 0), 1);

        const duracao = 1.15;
        for (let tempo = 0; tempo < duracao; tempo += 1 / 60) {
          const k = tempo / duracao;
          salto.position.lerpVectors(partida, chegada, k);
          salto.position.y += Math.sin(k * Math.PI) * 2.6; // o arco do pulo
          await api.wait(1 / 60);
        }

        espirrar(chegada.x, chegada.z, 18);
        api.releasePlayer(chegada.x, chegada.z, Math.PI);
        api.lockPlayer(false);
        api.toast('Splash!', '💦');
        api.unlock({
          id: 'trampolim',
          title: 'O pulo do trampolim',
          place: 'Clube',
          note: 'Você jurou que não ia pular. Pulou primeiro.',
          icon: '🤿',
        });
      },
    });

    w.interact({
      id: 'clube:espreguicadeira',
      x: 9.4, z: 2.2, radius: 1.8,
      label: 'Deitar na espreguiçadeira', icon: '🌞',
      highlight: espreguicadeira,
      onInteract: async (api) => {
        await api.say([
          'Sol na cara, barulho de água, ninguém com pressa.',
          `${api.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`,
        ]);
        api.toast('+1 preguiça boa', '🌞');
      },
    });

    // ---------------------------------------------------------------- sucos
    // Morango do Renan, pêssego do Ari — cada um na mochila do seu dono. Quem
    // põe o copo na mão é o motor, e o T não muda nada: a malha é filha do rig.
    let sucoRestante = 0;

    w.onUpdate((dt) => {
      if (sucoRestante <= 0) return;
      sucoRestante -= dt;
      if (sucoRestante <= 0) {
        g.removeItem(ITENS.sucoMorango.id, RENAN.id);
        g.removeItem(ITENS.sucoPessego.id, ARI.id);
        g.toast('Acabou o suco', '🍹');
      }
    });

    w.interact({
      id: 'clube:bar',
      x: -12.2, z: 9.2, radius: 2.2,
      label: 'Pedir alguma coisa gelada', icon: '🍹',
      highlight: bar,
      onInteract: async (api) => {
        await conversa([
          [R, 'Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito.'],
          [A, 'Awnn gracias amorzito'],
        ]);
        sucoRestante = 50;
        api.addItem(ITENS.sucoMorango, RENAN.id);
        api.addItem(ITENS.sucoPessego, ARI.id);
        api.som('sorvete'); // a mesma sineta de "toma, é seu" da sorveteria
        api.toast('Morango e pêssego', '🍹');
      },
    });

    w.interact({
      id: 'clube:chuveiro',
      x: -9.8, z: 2.5, radius: 1.8,
      label: 'Tomar uma chuveirada', icon: '🚿',
      highlight: chuveiro,
      onInteract: async (api) => {
        espirrar(-10.6, 2.5, 8);
        await api.say(['Gelada. Sempre gelada.']);
      },
    });

    w.interact({
      id: 'clube:vestiario',
      x: 15, z: -15.4, radius: 2, priority: 1,
      label: 'Vestiário', icon: '🩳',
      highlight: vestiario,
      onInteract: async (api) => {
        // Abastece os DOIS a cada abertura, como o armário do quarto: as peças
        // são de cada pessoa, e o `storeItem` recusa o que ela já tem, então
        // repor sai de graça e o vestiário também repõe o que foi descartado.
        for (const quem of [api.playerId(), api.companionId()]) {
          api.storeItem(ITENS.oculosEscuros, quem);
          for (const peca of MODA_PRAIA) api.storeItem(peca, quem);
        }

        if (!api.flag('vestiario-clube')) {
          api.setFlag('vestiario-clube');
          await conversa([
            [A, 'Cinco minutos pra trocar de roupa. Você demora quinze.'],
            [R, 'Eu demoro porque escolho. Você só pega a primeira que vê.'],
          ]);
        }
        api.abrirVestiario();
      },
    });
  },
};
