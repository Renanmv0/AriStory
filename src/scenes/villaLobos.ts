import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import { FerrisWheel } from '../world/ferrisWheel';
import { Frisbee } from '../entities/Frisbee';
import {
  bench, bin, building, bush, cloud, cone, duck, fence, flowers, iceCream,
  kiosk, lamp, picnicTable, rock, signBoard, tree,
} from '../world/props';
import { ARI, RENAN } from '../characters/cast';

/**
 * Parque Villa Lobos — o cenario grande, com a roda gigante ao fundo,
 * o campinho de frisbee e o lago.
 */
export const villaLobos: SceneDef = {
  id: 'villa-lobos',
  name: 'Parque Villa Lobos',
  subtitle: 'sábado de manhã, vento bom',
  ambient: {
    sky: P.skyDay,
    // a camera fica a 60 unidades do alvo: a nevoa so pode comecar depois disso
    fog: 0xbfe6f7,
    fogNear: 95,
    fogFar: 200,
    sunColor: 0xfff4da,
    sunIntensity: 1.7,
    ambientColor: 0xd8f0ff,
    ambientIntensity: 1.0,
    sunDir: [16, 22, 10],
  },
  spawn: { x: 0, z: 26, facing: Math.PI },
  entries: {
    portao: { x: 0, z: 26, facing: Math.PI },
    roda: { x: 0, z: -17, facing: 0 },
    clube: { x: 30, z: 12, facing: Math.PI * 1.5 },
  },

  build(w) {
    const g = w.game;

    // ------------------------------------------------------------- terreno
    // bem maior que a area jogavel: la de cima da roda gigante da para ver longe
    w.ground({ width: 240, depth: 240, color: P.grass });
    w.setBounds(-44, -34, 44, 32);

    // caminhos
    w.patch(0, 4, 5.5, 56, P.asphalt);
    w.patch(0, 9, 62, 4.5, P.asphalt);
    w.disc(0, -16.5, 8, P.concrete);
    w.disc(0, -16.5, 8.6, P.sand, 0.005);

    // manchas de grama mais clara, quebra a chapadao
    for (let i = 0; i < 14; i++) {
      w.disc(w.range(-40, 40), w.range(-30, 30), w.range(2, 6), P.grassDark, 0.005);
    }

    // ---------------------------------------------------------- roda gigante
    const wheel = new FerrisWheel({ radius: 12, cabins: 32, rpm: 1.0 });
    w.place(wheel.group, 0, 0, -26);
    w.add(wheel.group);
    w.blockCircle(0, -26, 7.2);

    // tapume e domo geodesico da praca da roda, como na foto
    for (const x of [-11, 11]) {
      w.add(w.place(fence(9, 1.2, P.metalWhite), x, 0, -20, Math.PI / 2));
      w.blockBox(x, -20, 0.2, 4.5);
    }
    const domo = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshToonMaterial({ color: 0xdff2fb, transparent: true, opacity: 0.55 }),
    );
    domo.position.set(-9.5, 0, -21);
    w.add(domo);
    w.blockCircle(-9.5, -21, 2.6);

    const bilheteria = w.add(w.place(kiosk(P.fabricBlue), 9.5, 0, -20.5, Math.PI));
    w.blockBox(9.5, -20.5, 1.3, 0.9);

    // ------------------------------------------------------------- o lago
    w.disc(-21, 11, 8.5, P.water, 0.02);
    w.disc(-21, 11, 9.2, P.sand, 0.01);
    w.blockCircle(-21, 11, 8.8);
    const patos = [duck(), duck(0xe8e2d0), duck()];
    patos.forEach((d, i) => {
      w.place(d, -21 + Math.cos(i * 2.1) * 4.5, 0.1, 11 + Math.sin(i * 2.1) * 3.5, i * 1.7);
      w.add(d);
    });
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      w.add(w.place(bush(0.7, P.leafDark), -21 + Math.cos(a) * 9.8, 0, 11 + Math.sin(a) * 9.8));
    }

    // ---------------------------------------------------- campinho de frisbee
    w.patch(17, 3, 22, 18, P.grassDark, 0, 0.008);
    for (const [cx, cz] of [[8, -5], [26, -5], [8, 11], [26, 11]] as const) {
      w.add(w.place(cone(), cx, 0, cz));
    }
    const placaCampinho = w.add(w.place(signBoard(P.wood, P.frisbee), 8.5, 0, 12.5, -0.4));
    w.interact({
      id: 'parque:campinho',
      x: 8.5, z: 13.6, radius: 2,
      label: 'Ler a placa', icon: '🪧',
      highlight: placaCampinho,
      onInteract: (api) =>
        api.say([
          'CAMPO LIVRE — não pisar no canteiro.',
          `Aperte F pra jogar o frisbee pro ${api.companionName()}. Ele devolve.`,
        ]),
    });

    // -------------------------------------------------------- mobiliario
    const bancos: Array<[number, number, number]> = [
      [-4.2, 14, 0], [4.2, 14, Math.PI], [-4.2, -2, 0], [4.2, -6, Math.PI],
      [-12, 9.5, Math.PI / 2],
    ];
    for (const [x, z, r] of bancos) {
      w.add(w.place(bench(), x, 0, z, r));
      w.blockBox(x, z, 1, 0.35, r);
    }

    for (const [x, z] of [[-4, 20], [4, 6], [-4, -8], [4, 22], [-4, 2]] as const) {
      w.add(w.place(lamp(false), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }
    for (const [x, z] of [[3.4, 17], [-3.4, 11]] as const) {
      w.add(w.place(bin(), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    const mesa = w.add(w.place(picnicTable(), -10, 0, 20, 0.3));
    w.blockBox(-10, 20, 1, 0.9, 0.3);

    // sorveteria
    // balcão virado para +Z: assim quem compra fica na frente do quiosque na
    // tela, e não escondido atrás dele
    const quiosque = w.add(w.place(kiosk(0xf6a6c0), 12, 0, 18.6, 0.3));
    w.blockBox(12, 18.6, 1.3, 0.9, 0.3);
    const casquinhaPlaca = w.add(w.place(iceCream(P.morango), 12, 2.55, 18.4, 0.3));
    casquinhaPlaca.scale.setScalar(3);

    // ------------------------------------------------------------ vegetacao
    const proibido: Array<[number, number, number]> = [
      [0, -26, 20], [-21, 11, 12], [17, 3, 14], [0, 4, 6], [0, 9, 6], [12, 19, 4], [-10, 20, 3],
    ];
    const livre = (x: number, z: number): boolean => {
      if (Math.abs(x) < 4 && z > -20 && z < 30) return false;
      return !proibido.some(([px, pz, r]) => Math.hypot(x - px, z - pz) < r);
    };

    const kinds = ['redonda', 'redonda', 'pinheiro', 'florida', 'palmeira'] as const;
    let plantadas = 0;
    for (let i = 0; i < 260 && plantadas < 64; i++) {
      const x = w.range(-42, 42);
      const z = w.range(-32, 30);
      if (!livre(x, z)) continue;
      const scale = w.range(0.85, 1.5);
      w.add(w.place(tree(w.pick(kinds), scale, w.rng()), x, 0, z, w.range(0, 6.28)));
      w.blockCircle(x, z, 0.45 * scale);
      plantadas++;
    }
    for (let i = 0; i < 90; i++) {
      const x = w.range(-42, 42);
      const z = w.range(-32, 30);
      if (!livre(x, z)) continue;
      if (i % 3 === 0) w.add(w.place(flowers(6, 1.1), x, 0, z));
      else if (i % 3 === 1) w.add(w.place(bush(w.range(0.7, 1.2)), x, 0, z));
      else w.add(w.place(rock(w.range(0.5, 1)), x, 0, z));
    }

    // ---------------------------------------------------------- horizonte
    // o rio, os predios e a mata que aparecem quando a roda gigante sobe
    w.patch(-66, -10, 18, 220, P.water, 0, 0.02);
    w.patch(-55, -10, 6, 220, P.concrete, 0, 0.03);

    for (let i = 0; i < 22; i++) {
      const alto = w.range(7, 20);
      const largo = w.range(4, 9);
      w.add(
        w.place(
          building(largo, alto, largo * 0.9, w.pick([P.wallCream, P.concrete, P.wallMint]), P.metalGrey),
          w.range(-95, 60), 0, -96 - w.range(0, 16),
        ),
      );
    }
    for (let i = 0; i < 14; i++) {
      const alto = w.range(6, 16);
      w.add(
        w.place(building(w.range(4, 8), alto, 5, P.wallCream, P.roofTile), 92 + w.range(0, 16), 0, w.range(-60, 40)),
      );
    }

    // mata fechada em volta, so silhueta
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * Math.PI * 2;
      const raio = 62 + w.range(0, 28);
      const x = Math.cos(a) * raio;
      const z = Math.sin(a) * raio * 0.9;
      if (x < -50) continue; // do outro lado do rio nao tem mata
      w.add(w.place(tree(w.pick(kinds), w.range(1.2, 2.2), w.rng()), x, 0, z, w.range(0, 6.28)));
    }

    // --------------------------------------------------------------- ceu
    for (let i = 0; i < 9; i++) {
      const c = cloud(w.range(1.6, 3.2));
      // a camera do passeio sobe ate ~60u de altura: nuvem baixa demais entra
      // na frente da roda gigante em vez de ficar de enfeite no fundo
      c.position.set(w.range(-70, 70), w.range(56, 70), w.range(-60, 45));
      w.root.add(c);
      const drift = w.range(0.25, 0.6);
      w.onUpdate((dt) => {
        c.position.x += drift * dt;
        if (c.position.x > 56) c.position.x = -56;
      });
    }

    // ------------------------------------------------------------- portao
    const portao = w.add(w.place(signBoard(P.wood, P.metalWhite), 2.6, 0, 27.5, Math.PI));
    w.add(w.place(fence(16, 1.4), -10, 0, 28));
    w.add(w.place(fence(16, 1.4), 10, 0, 28));
    w.blockBox(-10, 28, 8, 0.2);
    w.blockBox(10, 28, 8, 0.2);

    // saida lateral: o clube fica a uns dez minutos a pe
    const placaClube = w.add(w.place(signBoard(P.wood, 0x4ec1a8), 34, 0, 12, -Math.PI / 2));
    w.add(w.place(fence(12, 1.4), 35, 0, 6, Math.PI / 2));
    w.add(w.place(fence(12, 1.4), 35, 0, 19, Math.PI / 2));
    w.blockBox(35, 6, 0.2, 6);
    w.blockBox(35, 19, 0.2, 6);
    w.patch(30, 12, 12, 5, P.asphalt);

    w.door({
      x: 33, z: 12,
      to: 'clube', entry: 'portaria',
      label: 'Ir pro clube', icon: '🏊',
      highlight: placaClube,
      radius: 2.4,
    });

    w.door({
      x: 0, z: 27,
      to: 'casa', entry: 'da-rua',
      label: 'Voltar pra casa', icon: '🏠',
      highlight: portao,
      radius: 2.2,
    });

    // ------------------------------------------------------------- frisbee
    const disco = new Frisbee(P.frisbee);
    disco.pickUp();
    w.root.add(disco.mesh);

    /**
     * Frisbee de dois: você joga pro parceiro, ele corre atrás se cair longe,
     * pega e devolve. Se o disco cair perto de você, você pega sozinho; senão
     * tem que ir buscar. Cada ida e volta completa conta uma troca.
     */
    type FaseDisco = 'comigo' | 'voando-pra-ele' | 'buscando' | 'com-ele' | 'voando-pra-mim' | 'no-chao';
    let fase: FaseDisco = 'comigo';
    let esperaDele = 0;
    let trocasNaSessao = 0;

    const contarTroca = async (api: typeof g): Promise<void> => {
      trocasNaSessao += 1;
      const total = api.bump('frisbee.trocas');
      if (trocasNaSessao % 5 === 0) {
        api.toast(`${trocasNaSessao} trocas seguidas!`, '🥏');
      }
      if (total >= 10 && !api.flag('memoria-frisbee')) {
        api.setFlag('memoria-frisbee');
        api.unlock({
          id: 'frisbee-villa',
          title: 'Frisbee no Villa',
          place: 'Parque Villa Lobos',
          note: 'Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.',
          icon: '🥏',
        });
      }
    };

    const jogar = w.interact({
      id: 'parque:frisbee-jogar',
      x: 17, z: 3, radius: 3,
      priority: -1, // segue o jogador, entao nunca deve roubar o prompt de outra coisa
      label: 'Jogar o frisbee  (F)', icon: '🥏',
      onInteract: () => lancar(),
    });

    const lancar = (): void => {
      if (fase !== 'comigo') return;
      disco.throwToward(g.playerPosition(), g.companionPosition(), 0.22);
      fase = 'voando-pra-ele';
    };

    const pegar = w.interact({
      id: 'parque:frisbee-pegar',
      x: 17, z: 3, radius: 1.8,
      label: 'Pegar o frisbee', icon: '🥏',
      onInteract: async (api) => {
        disco.pickUp();
        fase = 'comigo';
        await contarTroca(api);
      },
    });

    w.onUpdate((dt) => {
      disco.update(dt, w.bounds);
      // atalho dedicado: perto de uma porta ou de um banco o prompt do frisbee
      // perde a vez (ele tem prioridade baixa de propósito), mas o F sempre vale
      if (g.keyPressed('KeyF')) lancar();

      const eu = g.playerPosition();
      const ele = g.companionPosition();

      switch (fase) {
        case 'comigo':
          disco.holdAt(eu, g.playerFacing());
          break;

        case 'com-ele':
          disco.holdAt(ele, Math.atan2(eu.x - ele.x, eu.z - ele.z));
          esperaDele -= dt;
          if (esperaDele <= 0) {
            disco.throwToward(ele, eu, 0.26);
            fase = 'voando-pra-mim';
          }
          break;

        case 'voando-pra-ele':
          if (disco.state === 'chao') {
            if (disco.position.distanceTo(ele) < 1.6) {
              disco.pickUp();
              esperaDele = 0.8;
              fase = 'com-ele';
            } else {
              g.commandCompanion(disco.position.x, disco.position.z);
              fase = 'buscando';
            }
          }
          break;

        case 'buscando':
          if (disco.position.distanceTo(ele) < 1.1) {
            g.freeCompanion();
            disco.pickUp();
            esperaDele = 0.9;
            fase = 'com-ele';
          }
          break;

        case 'voando-pra-mim':
          if (disco.state === 'chao') {
            fase = 'no-chao';
            // caiu na sua mao: pega sozinho, sem precisar apertar nada
            if (disco.position.distanceTo(eu) < 1.9) {
              disco.pickUp();
              fase = 'comigo';
              void contarTroca(g);
            }
          }
          break;

        case 'no-chao':
          if (disco.position.distanceTo(eu) < 1.2) {
            disco.pickUp();
            fase = 'comigo';
            void contarTroca(g);
          }
          break;
      }

      jogar.enabled = fase === 'comigo';
      pegar.enabled = fase === 'no-chao';
      if (fase === 'comigo') jogar.moveTo(eu.x, eu.z);
      else pegar.moveTo(disco.position.x, disco.position.z);
    });


    // ----------------------------------------------------- outras interacoes
    w.interact({
      id: 'parque:lago',
      x: -13, z: 11, radius: 2.6,
      label: 'Olhar o lago', icon: '🦆',
      onInteract: async (api) => {
        await api.say(['Que lago bonito... dá até vontade de pular'], RENAN.name);
        await api.say(['Então vamos! Hahahha'], ARI.name);
        await api.say(['NÃAAOOO'], RENAN.name);
        api.unlock({
          id: 'lago-pular',
          title: 'Vontade de pular',
          place: 'Parque Villa Lobos',
          note: 'Um dos dois sempre tem uma ideia. O outro sempre grita.',
          icon: '🦆',
        });
      },
    });

    // ------------------------------------------------------------- sorvetes
    // um morango para o Ari e um maracujá para o Renan; trocar de personagem
    // com T troca a mão, não o sabor
    const sorveteAri = iceCream(P.morango);
    const sorveteRenan = iceCream(P.maracuja);
    sorveteAri.visible = false;
    sorveteRenan.visible = false;
    w.root.add(sorveteAri, sorveteRenan);
    let sorveteRestante = 0;

    const segurarNaEsquerda = (obj: THREE.Object3D, pos: THREE.Vector3, facing: number): void => {
      obj.visible = true;
      // mão esquerda: a direita é onde o frisbee fica
      obj.position.set(
        pos.x + Math.sin(facing - Math.PI / 2) * 0.42,
        1.14,
        pos.z + Math.cos(facing - Math.PI / 2) * 0.42,
      );
      obj.rotation.y = facing;
    };

    w.onUpdate((dt) => {
      if (sorveteRestante <= 0) return;
      sorveteRestante -= dt;

      const doJogador = g.playerName() === ARI.name ? sorveteAri : sorveteRenan;
      const doParceiro = doJogador === sorveteAri ? sorveteRenan : sorveteAri;
      const eu = g.playerPosition();
      const ele = g.companionPosition();
      segurarNaEsquerda(doJogador, eu, g.playerFacing());
      segurarNaEsquerda(doParceiro, ele, Math.atan2(eu.x - ele.x, eu.z - ele.z));

      if (sorveteRestante <= 0) {
        sorveteAri.visible = false;
        sorveteRenan.visible = false;
        g.toast('Acabou o sorvete', '🍦');
      }
    });

    w.interact({
      id: 'parque:sorveteria',
      x: 12, z: 20.6, radius: 2.4,
      label: 'Comprar sorvete', icon: '🍦',
      highlight: quiosque,
      onInteract: async (api) => {
        await api.say(['Dois, por favor.', 'Um de morango e um de maracujá.']);
        sorveteRestante = 50;
        api.toast('Morango e maracujá', '🍦');
        api.unlock({
          id: 'sorvete-villa',
          title: 'Sorvete no parque',
          place: 'Parque Villa Lobos',
          note: 'Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.',
          icon: '🍦',
        });
      },
    });

    w.interact({
      id: 'parque:piquenique',
      x: -10, z: 21.6, radius: 2.2,
      label: 'Arrumar o piquenique', icon: '🧺',
      highlight: mesa,
      onInteract: async (api) => {
        await api.say(['A toalha xadrez, o pão de queijo frio e o sol batendo de lado.']);
        api.unlock({
          id: 'piquenique',
          title: 'Piquenique de sábado',
          place: 'Parque Villa Lobos',
          note: 'Sempre a mesma mesa, sempre a mesma toalha.',
          icon: '🧺',
        });
      },
    });

    w.interact({
      id: 'parque:bilheteria',
      x: 9.5, z: -19, radius: 2.2,
      label: 'Bilheteria', icon: '🎟️',
      highlight: bilheteria,
      onInteract: (api) => api.say(['Dois pra roda gigante. Sempre dois.']),
    });

    // ---------------------------------------------------- a roda gigante
    let voltaAtual: { resolve: () => void; de: number; voltas: number } | null = null;
    const esperarVoltas = (voltas: number): Promise<void> =>
      new Promise((resolve) => {
        voltaAtual = { resolve, de: wheel.angle, voltas };
      });

    // perto da roda a camera abre, para caber a coisa toda na tela
    let zoomLivre = true;
    w.onUpdate((dt) => {
      wheel.update(dt);
      // só manda na câmera perto da roda gigante; longe dela o jogador
      // continua livre para dar zoom com a roda do mouse
      if (zoomLivre) {
        const p = g.playerPosition();
        const d = Math.hypot(p.x, p.z + 26);
        if (d < 28) {
          const t = Math.max(0, Math.min(1, (d - 8) / 20));
          g.setZoom(36 - t * 21);
        }
      }
      patos.forEach((d, i) => {
        d.position.y = 0.1 + Math.sin(performance.now() / 900 + i) * 0.05;
      });
      if (voltaAtual && wheel.turnsSince(voltaAtual.de) >= voltaAtual.voltas) {
        const done = voltaAtual.resolve;
        voltaAtual = null;
        done();
      }
    });

    w.interact({
      id: 'parque:roda-gigante',
      x: 0, z: -18.6, radius: 3,
      label: 'Andar na roda gigante', icon: '🎡',
      onInteract: async (api) => {
        zoomLivre = false;
        api.lockPlayer(true);
        await api.say(['A fila tá curta hoje.', 'Bora subir?']);

        const cabine = wheel.boardingCabin();
        const velocidade = wheel.speed;
        wheel.speed = velocidade * 5; // a volta cenica dura ~12s, nao um minuto
        // os dois entram na mesma cabine, um de cada lado
        api.ridePlayer(cabine, new THREE.Vector3(-0.3, -0.34, 0), 0.55);
        api.rideCompanion(cabine, new THREE.Vector3(0.3, -0.34, 0), 0.55);
        api.focusCamera(cabine);
        api.setZoom(38);

        await esperarVoltas(0.25);
        await api.say([
          'Daqui dá pra ver o parque inteiro.',
          'E aquele pedacinho do rio ali atrás.',
        ]);
        await esperarVoltas(0.35);
        await api.say([
          'Toda vez que a gente passa aqui embaixo, você olha pra cima e diz "um dia a gente sobe".',
          'Pronto. Subimos.',
        ]);
        await esperarVoltas(0.4);

        wheel.speed = velocidade;
        api.focusCamera(null);
        api.releasePlayer(0, -17.6, 0);
        api.releaseCompanion(-1.1, -17.9, 0);
        api.lockPlayer(false);
        zoomLivre = true;

        api.unlock({
          id: 'roda-gigante',
          title: 'A roda gigante',
          place: 'Parque Villa Lobos',
          note: 'A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.',
          icon: '🎡',
        });
      },
    });
  },
};
