import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  claridadeDaJanela, haloDeLampada, interiorDoor, mug, pictureFrame, pocaDeLuz, tapete,
  windowFrame,
} from '../world/furniture';
import {
  abajurDePe, armarioAereo, cadeiraDeJantar, geladeira, jiboiaEmVaso, maquinaDeLavar,
  mesaDeJantar, mesinhaDeCentro, pia, prateleiraDeParede, rackComTv, sofaFofo, telaDeTvLigada,
} from '../world/moveisDaCasa';
import { heart } from '../world/props';
import { toon } from '../core/materials';
import { acabar } from '../world/acabamento';
import { assoalhoDeMadeira } from '../world/texturasDeChao';
import { granito, tramaDeTecido, veioDeMadeira } from '../world/texturasDeCasa';
import { ARI, RENAN } from '../characters/cast';

/**
 * Casa do Ari — apartamento pequeno, montado a partir do esboço do Renan.
 *
 * Planta (a câmera padrão vê -Z subindo à direita e -X subindo à esquerda):
 *   fundo (-Z), da esquerda p/ direita: cozinha · porta da Rubi · porta do banheiro
 *   parede esquerda (-X): porta do quarto do Ari, a TV e a janela
 *   sofá no meio da sala, de frente para a TV
 *   máquina de lavar no canto direito, perto da porta da rua
 *
 * Convenção de interiores: parede inteira só em -X e -Z; o resto é mureta,
 * senão a parede tapa a câmera isométrica. A sala é um retângulo só.
 */
export const casa: SceneDef = {
  id: 'casa',
  name: 'Casa do Ari',
  subtitle: 'domingo de manhã, café ainda quente',
  ambient: {
    sky: 0xefe4d4,
    indoor: true,
    sunColor: 0xfff0d4,
    sunIntensity: 1.0,
    ambientColor: 0xfdf3e3,
    ambientIntensity: 1.4,
    sunDir: [9, 15, 11],
  },
  spawn: { x: 1.4, z: 2.4, facing: Math.PI },
  entries: {
    'da-rua': { x: 3.4, z: 3.1, facing: Math.PI },
    // sai da porta virado para dentro da sala (+X)
    'do-quarto': { x: -5.05, z: -1.2, facing: Math.PI / 2 },
  },

  build(w) {
    const g0 = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g0.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    const W = 12;
    const D = 9;
    const x0 = -W / 2;
    const z0 = -D / 2;
    const H = 2.8;

    // --------------------------------------------------------------- casca
    // o mesmo assoalho de tábua do quarto do Ari: a casa é uma só
    w.ground({ width: W, depth: D, color: P.floorWood, textura: assoalhoDeMadeira(2.4, 8) });
    w.setBounds(x0 + 0.45, z0 + 0.45, W / 2 - 0.45, D / 2 - 0.45);

    /**
     * O acabamento (`world/acabamento.ts`): a madeira dos móveis ganha veio, o
     * sofá ganha tecido mesclado e a pedra da bancada vira granito. Só as
     * cores da lista mudam; o resto da peça fica como o kit fez.
     */
    const veio = veioDeMadeira();
    const envernizar = <T extends THREE.Object3D>(obj: T): T =>
      acabar(obj, [[P.wood, veio], [P.woodDark, veio]]);

    // Parede da esquerda, com um VÃO para a porta do quarto do Ari.
    //
    // Duas coisas decidiram este lugar. O vão em si não é enfeite: a parede tem
    // 0,3 de espessura e a folha da porta 0,08, então porta largada no meio de
    // parede inteira fica enterrada dentro dela e some — é por isso que a
    // parede do fundo também é feita em pedaços.
    //
    // E a porta dele fica nesta parede, e não na do fundo: o fundo tem a
    // cozinha na ponta da esquerda e as duas portas da Rubi e do banheiro na
    // da direita. Nesta parede a face olha para a câmera, do mesmo jeito que a
    // TV e a janela.
    const zDoAri = -1.2;
    const vaoAri = 0.95;
    w.wall(x0, z0, x0, zDoAri - vaoAri / 2, H, P.wallMint);
    w.wall(x0, zDoAri + vaoAri / 2, x0, D / 2, H, P.wallMint);
    w.wall(x0, D / 2, W / 2, D / 2, 0.45, P.wallCream);
    w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.wallCream);

    // ------------------------------- parede do fundo: a Rubi e o banheiro
    // A sala é um retângulo só. O quarto da Rubina (a roommate do Ari) e o
    // banheiro são PORTAS na parede do fundo, do lado direito — a cozinha fica
    // na ponta da esquerda da mesma parede.
    //
    // Já foram um bloco fechado, com paredes e teto, no meio da sala: a caixa
    // tapava a sala na câmera e ficava com pedaços faltando. O Renan pediu
    // portas na parede, e é o que a casa de verdade tem.
    //
    // A parede vai em pedaços, com um VÃO por porta (porta largada no meio da
    // parede inteira some dentro dela), e cada porta fica CENTRADA na linha da
    // parede: o batente (0,24) é mais fino que a parede (0,3), e posto à frente
    // a face dele encostava na da parede e as duas piscavam.
    const xQuarto = 1.5; // a porta do quarto da Rubi
    const xBanheiro = 4.3; // a porta do banheiro
    const vao = 0.95;
    const bordas = [
      x0, xQuarto - vao / 2,
      xQuarto + vao / 2, xBanheiro - vao / 2,
      xBanheiro + vao / 2, W / 2,
    ];
    for (let i = 0; i < bordas.length; i += 2) {
      w.wall(bordas[i], z0, bordas[i + 1], z0, H, P.wallCream);
    }
    const portaQuarto = w.add(envernizar(w.place(interiorDoor(P.woodDark, 0.85, 2.05), xQuarto, 0, z0)));
    const portaBanheiro = w.add(w.place(interiorDoor(P.gold, 0.85, 2.05), xBanheiro, 0, z0));

    // uns enfeites no trecho de parede entre as duas portas
    w.add(envernizar(w.place(pictureFrame(0.6, 0.75, P.wallMint), (xQuarto + xBanheiro) / 2, 1.75, z0 + 0.17)));
    w.add(envernizar(w.place(prateleiraDeParede(0.9), 5.3, 1.7, z0 + 0.26)));

    // ------------------------------------------------- porta do quarto do Ari
    // Centrada na linha da parede, pela mesma razão das outras: batente posto à
    // frente encosta na face da parede e as duas piscam.
    w.add(w.place(interiorDoor(P.fabricBlue, 0.9, 2.1), x0, 0, zDoAri, Math.PI / 2));
    w.door({
      x: x0 + 0.85, z: zDoAri,
      to: 'quarto', entry: 'da-sala',
      label: 'Entrar no quarto do Ari', icon: '🚪',
    });

    // ------------------------------------------------------ cozinha (lilás)
    w.add(envernizar(acabar(w.place(pia(3.6), -3.4, 0, z0 + 0.48), [[P.concrete, granito()]])));
    w.blockBox(-3.4, z0 + 0.42, 1.8, 0.4);
    w.add(envernizar(w.place(armarioAereo(2.6), -3.4, 2.0, z0 + 0.32)));
    // na parede da esquerda: no fundo ela ficava escondida atrás do bloco
    w.add(w.place(geladeira(), x0 + 0.5, 0, -2.6, Math.PI / 2));
    w.blockBox(x0 + 0.45, -2.6, 0.38, 0.42);

    // A MESA DE JANTAR mora no lado direito da sala, onde antes ficava o bloco
    // do quarto da Rubi e do banheiro: no meio do caminho entre a porta da rua
    // e a do banheiro, longe das duas. A cozinha ficava cheia e esse lado,
    // vazio.
    const MESA = { x: 3.5, z: -0.6 };
    const mesa = w.add(envernizar(w.place(mesaDeJantar(1.5, 0.9), MESA.x, 0, MESA.z)));
    w.blockBox(MESA.x, MESA.z, 0.8, 0.52);
    w.add(envernizar(w.place(cadeiraDeJantar(P.flowerPink), MESA.x - 1.1, 0, MESA.z, Math.PI / 2)));
    w.add(envernizar(w.place(cadeiraDeJantar(P.wallMint), MESA.x + 1.1, 0, MESA.z, -Math.PI / 2)));

    // ------------------------------------- sala: TV na esquerda, sofá de frente
    const tv = w.add(envernizar(w.place(rackComTv(), x0 + 0.4, 0, 0.6, Math.PI / 2)));
    w.blockBox(x0 + 0.35, 0.6, 0.3, 0.9);
    const tela = tv.getObjectByName('tela') as THREE.Mesh;

    w.add(w.place(tapete(3.0, 2.6, P.rug), -2.5, 0, 0.6));
    const tecido = tramaDeTecido(0.5);
    const sofaObj = w.add(envernizar(acabar(
      w.place(sofaFofo(P.fabricRed, 2.4), -0.3, 0, 0.6, -Math.PI / 2),
      [[P.fabricRed, tecido], [P.flowerPink, tecido], [P.cupula, tecido]],
    )));
    w.blockBox(-0.3, 0.6, 0.5, 1.2);
    w.add(envernizar(w.place(mesinhaDeCentro(), -2.4, 0, 0.6, Math.PI / 2)));
    w.blockBox(-2.4, 0.6, 0.38, 0.62);
    const caneca = w.add(w.place(mug(0xfff2e0), -2.4, 0.5, 0.9));

    const abajur = w.add(envernizar(w.place(abajurDePe(true), -0.4, 0, 2.3)));
    w.blockCircle(-0.4, 2.3, 0.3);
    // a luz que se vê (ver o quarto): a poça morna no chão e o halo da cúpula
    const poca = w.add(w.place(pocaDeLuz(1.05, P.luzDeAbajur, 0.4), -0.4, 0.006, 2.3));
    const halo = w.add(w.place(haloDeLampada(0.95), -0.4, 1.68, 2.3));
    // acende e apaga com um clique (ou um toque) no abajur, como o do quarto
    const cupula = abajur.getObjectByName('cupula') as THREE.Mesh;
    let abajurAceso = true;
    w.clicavel(abajur, {
      dica: 'Abajur',
      alturaDaDica: 2.05,
      aoClicar: (g) => {
        abajurAceso = !abajurAceso;
        cupula.material = toon(abajurAceso ? P.cupula : P.cupulaApagada, { glow: abajurAceso ? 0.5 : 0, doubleSide: true });
        poca.visible = abajurAceso;
        halo.visible = abajurAceso;
        g.som('clique');
      },
    });

    // --------------------------------------------- área de serviço (verde)
    // longe das portas do fundo: aqui ela não tranca a passagem de ninguém
    // de frente para a sala (+Z), e não para a parede de dentro: virada para
    // -X a escotilha ficava do lado que a câmera nunca vê
    const maquina = w.add(w.place(maquinaDeLavar(), W / 2 - 0.65, 0, 2.9));
    w.blockBox(W / 2 - 0.65, 2.9, 0.36, 0.35);

    // ------------------------------------------------ janela (rosa) e enfeites
    w.add(w.place(windowFrame(1.8, 1.3), x0 + 0.16, 1.75, 2.4, Math.PI / 2));
    // a claridade que essa janela joga no chão da sala
    w.add(w.place(claridadeDaJanela(1.8, 1.3, 1.75), x0 + 0.15, 0, 2.4, Math.PI / 2));
    w.add(envernizar(w.place(pictureFrame(0.8, 0.6, P.skyDusk), -3.4, 1.95, z0 + 0.17)));
    w.add(envernizar(w.place(prateleiraDeParede(1.1), -1.6, 1.8, z0 + 0.27)));
    w.add(w.place(jiboiaEmVaso(1.15), x0 + 0.8, 0, D / 2 - 1.0));
    const plantinha = w.add(w.place(jiboiaEmVaso(0.8, P.plantPot), 4.9, 0, 1.4));

    const coracao = w.place(heart(0.75), -0.3, 2.4, 0.6);
    coracao.visible = false;
    w.add(coracao);

    // ---------------------------------------------------------- porta da rua
    // trecho de parede alta na mureta da frente, só para a porta ter onde morar
    const zPorta = D / 2;
    w.wall(2.0, zPorta, 2.9, zPorta, 2.6, P.wallCream);
    w.wall(3.9, zPorta, 4.9, zPorta, 2.6, P.wallCream);
    const porta = w.add(envernizar(w.place(interiorDoor(P.woodDark, 0.95, 2.1), 3.4, 0, zPorta, Math.PI)));
    w.blockBox(3.4, zPorta, 0.5, 0.12);
    w.add(w.place(tapete(1.4, 0.8, P.capacho, 'capacho'), 3.4, 0, D / 2 - 1.0));

    // ----------------------------------------------- âncoras da cena do sofá
    // o "assento" carrega os dois durante a cutscene; a rotação mora nele,
    // então o rig entra com facing 0 e sai olhando para a TV
    const assento = new THREE.Object3D();
    // à frente do encosto, senão o espaldar do sofá tapa os dois na câmera iso
    assento.position.set(-0.52, 0, 0.6);
    assento.rotation.y = -Math.PI / 2;
    w.root.add(assento);

    const focoSofa = new THREE.Object3D();
    focoSofa.position.set(-1.9, 1.05, 0.6);
    w.root.add(focoSofa);

    let tvLigada = false;
    const ligarTv = (ligada: boolean): void => {
      tvLigada = ligada;
      // ligada, a tela mostra o show (o palco, o holofote e o piano, em canvas)
      tela.material = ligada ? telaDeTvLigada() : toon(P.tvTelaApagada);
    };

    // ------------------------------------------------------------ interações
    w.interact({
      id: 'casa:sofa',
      // centrado no próprio sofá: dá pra sentar chegando por qualquer lado
      x: -0.3, z: 0.6, radius: 2.0,
      label: 'Sentar no sofá', icon: '🛋️',
      highlight: sofaObj,
      onInteract: async (g) => {
        const sentar = await g.ask('Parece muito confortável, sentar?', ['Sim', 'Não']);
        if (sentar !== 0) {
          await g.say(['Depois. Se sentar agora, não levanta mais.']);
          return;
        }

        g.lockPlayer(true);
        g.ridePlayer(assento, new THREE.Vector3(-0.52, 0.02, 0), 1, 0);
        g.rideCompanion(assento, new THREE.Vector3(0.52, 0.02, 0), 1, 0);
        g.setSitting(true);
        ligarTv(true);
        g.focusCamera(focoSofa);
        g.setZoom(7.2);
        await g.wait(0.9);

        await g.say(['Está passando Bo Burnham.']);
        await g.say([
          'Você já sabe a letra inteira e mesmo assim espera a parte que gosta.',
          `E aí olha pro lado pra ver se ${g.companionName()} tá rindo também.`,
        ]);

        const ficar = await g.ask('Ficar mais um pouco?', ['Fica', 'Bora pro parque']);
        if (ficar === 0) {
          await g.say(['Mais um. Só mais um.', 'Nunca é só mais um.']);
        }

        g.setSitting(false);
        g.focusCamera(null);
        g.setZoom(10);
        g.releasePlayer(-1.6, 0.4, -Math.PI / 2);
        g.releaseCompanion(-1.6, 1.5, -Math.PI / 2);
        g.lockPlayer(false);

        g.unlock({
          id: 'sofa-preguica',
          title: 'Domingo sem pressa',
          place: 'Casa do Ari',
          note: 'Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.',
          icon: '🛋️',
        });
      },
    });

    w.interact({
      id: 'casa:tv',
      x: x0 + 1.4, z: 0.6, radius: 1.5,
      label: 'Ligar a TV', icon: '📺',
      highlight: tv,
      onInteract: async (g) => {
        ligarTv(!tvLigada);
        if (tvLigada) g.som('tv');
        g.toast(tvLigada ? 'TV ligada' : 'TV desligada', '📺');
        if (tvLigada) await g.say(['Está passando Bo Burnham.']);
      },
    });

    w.interact({
      id: 'casa:geladeira',
      x: x0 + 1.5, z: -2.6, radius: 1.4,
      label: 'Abrir a geladeira', icon: '🧊',
      onInteract: (g) =>
        g.say(['Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas.']),
    });

    w.interact({
      id: 'casa:pia',
      x: -2.2, z: z0 + 1.3, radius: 1.4,
      label: 'Olhar a pia', icon: '🚰',
      onInteract: (g) => g.say(['Por algum milagre, a pia está limpa…']),
    });

    w.interact({
      id: 'casa:mesa',
      x: MESA.x, z: MESA.z + 1.0, radius: 1.4,
      label: 'Pôr a mesa', icon: '🍽️',
      highlight: mesa,
      onInteract: async (g) => {
        await conversa([
          [A, 'Dois pratos, duas canecas. Já virou automático.'],
          [R, 'Três, se a Rubi sair do quarto.'],
        ]);
        g.toast('Mesa posta', '🍽️');
      },
    });

    w.interact({
      id: 'casa:maquina',
      x: W / 2 - 0.9, z: 3.7, radius: 1.4,
      label: 'Ver a máquina de lavar', icon: '🧺',
      highlight: maquina,
      onInteract: async (g) => {
        if (g.flag('roupa-lavando')) {
          await conversa([
            [R, 'Ainda tá centrifugando.'],
            [A, 'Esse barulho é a trilha sonora dessa casa.'],
          ]);
          return;
        }
        g.setFlag('roupa-lavando');
        g.toast('Máquina ligada', '🫧');
        await conversa([
          [A, 'Bota pra lavar agora que quando a gente voltar do parque já tá pronto.'],
          [R, 'Contanto que a Rubi não encha ela de novo antes.'],
        ]);
      },
    });

    w.interact({
      id: 'casa:banheiro',
      x: xBanheiro, z: z0 + 1.2, radius: 1.3,
      label: 'Bater na porta do banheiro', icon: '🚪',
      highlight: portaBanheiro,
      onInteract: () =>
        conversa([
          [R, 'Tem alguém aí?'],
          [A, 'É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro.'],
        ]),
    });

    w.interact({
      id: 'casa:quarto',
      x: xQuarto, z: z0 + 1.2, radius: 1.4,
      label: 'Porta do quarto', icon: '🎧',
      highlight: portaQuarto,
      onInteract: async (g) => {
        await conversa([
          [A, 'Acho que a Rubi está ouvindo kpop'],
          [R, 'Para variar né'],
        ]);
        g.unlock({
          id: 'quarto-manha',
          title: 'Do outro lado da porta',
          place: 'Casa do Ari',
          note: 'Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.',
          icon: '🎧',
        });
      },
    });

    w.interact({
      id: 'casa:planta',
      x: 4.9, z: 2.4, radius: 1.4,
      label: 'Regar a plantinha', icon: '🪴',
      highlight: plantinha,
      onInteract: async (g) => {
        if (g.flag('planta-regada')) {
          await g.say(['Já bebeu água hoje. Tá mais cuidada que a gente.']);
          return;
        }
        g.setFlag('planta-regada');
        plantinha.scale.multiplyScalar(1.2);
        g.toast('A plantinha cresceu um tiquinho', '🌱');
        await g.say(['Pronto. Ela finge que não gosta, mas gosta.']);
      },
    });

    w.interact({
      id: 'casa:cafe',
      x: -2.4, z: 1.6, radius: 1.3,
      label: 'Tomar o café', icon: '☕',
      highlight: caneca,
      onInteract: async (g) => {
        await g.say(['Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto.']);
        g.toast('+1 disposição', '☕');
      },
    });

    w.interact({
      id: 'casa:janela',
      x: x0 + 1.3, z: 2.4, radius: 1.5,
      label: 'Olhar pela janela', icon: '🪟',
      onInteract: async (g) => {
        await g.say([
          'O dia tá bom demais pra ficar em casa.',
          'Dá tempo de ir no parque e ainda voltar antes do sol cair.',
        ]);
        g.unlock({
          id: 'ceu-laranja',
          title: 'O céu laranja',
          place: 'Casa do Ari',
          note: 'Da janela dele dá pra ver o céu mudando de cor no fim da tarde.',
          icon: '🌇',
        });
      },
    });

    w.door({
      x: 3.4, z: D / 2 - 1.2,
      to: 'villa-lobos', entry: 'portao',
      label: 'Sair — ir pro parque', icon: '🚪',
      highlight: porta,
      radius: 1.7,
    });

    // -------------------------------------------------------------- ambiente
    // a roupa rodando atrás do vidro enquanto a máquina está ligada
    const tambor = maquina.getObjectByName('tambor');
    w.onUpdate((dt) => {
      if (tambor && w.game.flag('roupa-lavando')) tambor.rotation.z -= dt * 5;
    });
    w.onUpdate((_dt, t) => {
      coracao.visible = w.game.flag('planta-regada');
      coracao.position.y = 2.4 + Math.sin(t * 1.6) * 0.12;
      coracao.rotation.y = t * 0.9;
    });
  },
};
