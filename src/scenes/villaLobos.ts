import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import { FerrisWheel } from '../world/ferrisWheel';
import { Frisbee } from '../entities/Frisbee';
import { MESA_PING, PingPong } from '../entities/PingPong';
import {
  bin, bleachers, building, bus, busStop, bush, canteiro, capim, cloud,
  cone, discBag, discGolfBasket, domoDeVidro, duck, fence, floodlight, flowers,
  junco, kiosk, lamp, mesaPingPong, nenufar, picnicTable, raquete, skateShop,
  rock, scoreboard, signBoard, textSign, tree, waterFountain, windsock,
  bolinhaPingPong,
} from '../world/props';
import { ARI, RENAN } from '../characters/cast';
import { ITENS } from '../world/itens';

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
    clube: { x: 33, z: 13, facing: Math.PI * 1.5 },
  },

  build(w) {
    const g = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    /**
     * A loja de patins e a pista oval, no gramado entre o lago e a cúpula.
     *
     * A loja fica ao alcance de quem desce do caminho transversal (z ≈ 9) e
     * LONGE da areia do lago (raio 9,2 a partir de -21,11): a primeira tentativa
     * plantou o prédio com um canto dentro da praia. A pista ocupa os fundos
     * dela, no -Z, e para de sobra antes do caminho principal (x ≈ 0).
     */
    /**
     * A loja fica RETA (sem giro): com a fachada torta em relação ao gramado e
     * às calçadas, que são todos alinhados aos eixos, ela lê como um prédio
     * caído. E reta a colisão também fica simples de acertar.
     */
    const LOJA = { x: -8.6, z: 2.5 };
    /**
     * Oval: duas retas de `reta` para cada lado e uma calota de `raio` na ponta.
     *
     * Plantada no MEIO do gramado, e não encostada na praça da roda: a primeira
     * posição deixava a ponta a 8 unidades da cúpula, e de cima (a câmera olha
     * o -Z subindo para a direita) a pista parecia colada nela. Agora são 12.
     */
    const PISTA = { x: -21, z: -5, reta: 5, raio: 5, miolo: 2.4 };
    /**
     * O balcão de entrega, no lado +X da loja.
     *
     * Estes números saem da geometria de `skateShop()`, e é por não terem saído
     * que a colisão estava quebrada: a caixa antiga ficava a 5,9 do centro
     * enquanto o balcão de verdade está a 4,65 — dava para atravessar o móvel e
     * esbarrar no vazio ao lado dele.
     */
    const BALCAO = { x: LOJA.x + 4.72, z: LOJA.z + 0.2 };

    // A quadra de frisbee: fora dela o disco nem aparece na mão.
    const QUADRA = { x: 18, z: -4.5, largura: 26, profundidade: 19 };
    /** onde a mesa de ping pong mora, e para que lado o tampo aponta */
    // longe da areia do lago (raio 9,2 a partir de -21,11) e sem esbarrar na
    // mesa de piquenique
    const PING = { x: -15.5, z: 20.5, giro: 0.35 };
    const naQuadra = (x: number, z: number, margem = 0): boolean =>
      Math.abs(x - QUADRA.x) < QUADRA.largura / 2 - margem &&
      Math.abs(z - QUADRA.z) < QUADRA.profundidade / 2 - margem;

    // ------------------------------------------------------------- terreno
    // bem maior que a area jogavel: la de cima da roda gigante da para ver longe
    w.ground({ width: 240, depth: 240, color: P.grass });
    w.setBounds(-44, -34, 44, 32);

    // Ordem de empilhamento do chão. Cada decalque também recebe um
    // polygonOffset próprio do WorldBuilder, então a altura aqui é só folga.
    for (let i = 0; i < 14; i++) {
      w.disc(w.range(-40, 40), w.range(-30, 30), w.range(2, 6), P.grassDark, 0.004);
    }
    w.disc(0, -16.5, 8.6, P.sand, 0.008); // borda da praça
    w.disc(0, -16.5, 8, P.concrete, 0.012); // praça
    w.patch(0, 4, 5.5, 56, P.asphalt, 0, 0.016); // caminho principal
    w.patch(0, 9, 62, 4.5, P.asphalt, 0, 0.02); // caminho transversal

    /**
     * A pista oval, composta à mão.
     *
     * O `WorldBuilder` não tem anel oval, e não precisa ter: a forma sai de um
     * retângulo com uma calota em cada ponta. Primeiro o asfalto inteiro, e por
     * cima a MESMA forma menor pintada de grama — é o miolo vazado que faz ler
     * como pista de corrida em vez de pátio.
     *
     * Cada `patch`/`disc` já recebe o seu próprio `polygonOffset` do
     * WorldBuilder; as alturas abaixo são a folga declarada por cima disso.
     */
    const oval = (raio: number, cor: number, altura: number): void => {
      w.patch(PISTA.x, PISTA.z, PISTA.reta * 2, raio * 2, cor, 0, altura);
      w.disc(PISTA.x - PISTA.reta, PISTA.z, raio, cor, altura);
      w.disc(PISTA.x + PISTA.reta, PISTA.z, raio, cor, altura);
    };
    /**
     * As camadas, de baixo para cima. Cada faixa branca e' o oval de baixo
     * aparecendo por uma beirada: pinta-se branco e cobre-se o miolo com a cor
     * de cima, sobrando um anel de `FAIXA` de largura. Sai mais barato do que
     * desenhar dois aneis de verdade, e casa exatamente com a curva.
     */
    const FAIXA = 0.3;
    oval(PISTA.raio, P.metalWhite, 0.022); // borda externa
    oval(PISTA.raio - FAIXA, P.asphalt, 0.026);
    oval(PISTA.miolo + FAIXA, P.metalWhite, 0.03); // borda interna
    oval(PISTA.miolo, P.grass, 0.034);

    /**
     * Tracejado do meio da raia, como risco de rua.
     *
     * Nas retas os traços são paralelos ao eixo X; nas curvas eles giram junto
     * com a tangente. Um retângulo deitado tem o lado maior no X local, e girar
     * em Y por `-(ângulo + 90°)` é o que alinha esse lado com a tangente do
     * círculo — sem isso os traços da curva apontam para o centro.
     */
    const rMeio = (PISTA.raio + PISTA.miolo) / 2;
    const TRACO: [number, number] = [1.15, 0.17];
    for (const lado of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        const x = PISTA.x - PISTA.reta + 1 + (i * (PISTA.reta * 2 - 2)) / 4;
        w.patch(x, PISTA.z + lado * rMeio, TRACO[0], TRACO[1], P.metalWhite, 0, 0.038);
      }
      const cx = PISTA.x + lado * PISTA.reta;
      for (let i = 0; i < 6; i++) {
        const meia = -Math.PI / 2 + ((i + 0.5) / 6) * Math.PI;
        const ang = lado > 0 ? meia : meia + Math.PI;
        w.patch(
          cx + Math.cos(ang) * rMeio,
          PISTA.z + Math.sin(ang) * rMeio,
          TRACO[0], TRACO[1], P.metalWhite,
          -(ang + Math.PI / 2), 0.038,
        );
      }
    }

    // linha de largada, atravessando a raia da frente
    w.patch(PISTA.x + PISTA.reta * 0.55, PISTA.z + rMeio,
      0.32, PISTA.raio - PISTA.miolo - FAIXA * 2, P.metalWhite, 0, 0.04);

    // calçada da loja e a trilha que sobe até o caminho transversal
    // colada no prédio de propósito: mais larga que isto e o canto de cima
    // invade a areia do lago, que chega a 9,2 do centro em (-21, 11)
    w.patch(LOJA.x + 0.4, LOJA.z + 0.2, 10, 6.4, P.concrete, 0, 0.02);
    w.patch(LOJA.x + 1.6, 7.2, 3, 7, P.asphalt, 0, 0.022);

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
    // a cúpula virou peça do kit: estrutura completa (meridianos, paralelos,
    // pilares por dentro) mora em props.ts, a cena só posiciona
    w.add(w.place(domoDeVidro(2.6), -9.5, 0, -21, 0.4));
    w.blockCircle(-9.5, -21, 2.7);

    // virada para +Z, como a sorveteria: a camera olha de +x/+z, entao quiosque
    // de costas para ela vira uma caixa lisa
    const bilheteria = w.add(w.place(kiosk(P.fabricBlue, { texto: 'Bilheteria' }), 9.5, 0, -20.5, -0.5));
    w.blockBox(9.5, -20.5, 1.4, 0.95, -0.5);

    // ------------------------------------------- entorno da roda gigante
    // Tudo aqui é posicionado na mão de propósito: o espalhador de vegetação
    // (`livre()`, mais abaixo) proíbe 20 unidades em volta da roda, para não
    // nascer árvore no meio da praça. Sem isto a praça fica um prato de
    // concreto com a roda em cima.
    const canteirosPraca: Array<[number, number, number]> = [
      [-6.4, -13.6, 1.15], [6.4, -13.6, 1.15], [-8.6, -17.4, 0.95], [8.6, -17.4, 0.95],
    ];
    for (const [x, z, r] of canteirosPraca) {
      w.add(w.place(canteiro(r, undefined, w.rng()), x, 0, z, w.range(0, 6.28)));
      w.blockCircle(x, z, r + 0.1);
    }

    for (const [x, z] of [[-7.6, -11.4], [7.6, -11.4], [-12.2, -19], [12.2, -19]] as const) {
      w.add(w.place(lamp(false), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    for (const [x, z, r] of [[-3.6, -12.2, 0.1], [3.6, -12.2, -0.1], [-13.2, -22.5, 1.1]] as const) {
      w.banco(x, z, r);
    }

    for (const [x, z] of [[6.9, -18.9], [-5.2, -11.6]] as const) {
      w.add(w.place(bin(), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    // mato e pedra rente à praça, para a clareira não terminar numa linha reta
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + w.range(-0.1, 0.1);
      const d = w.range(10.5, 13.5);
      const x = Math.cos(a) * d;
      const z = -18 + Math.sin(a) * d * 0.7;
      if (Math.abs(x) < 4.5 && z > -14) continue; // deixa o caminho principal livre
      if (i % 3 === 0) w.add(w.place(bush(w.range(0.6, 1), P.leafDark), x, 0, z));
      else if (i % 3 === 1) w.add(w.place(capim(w.range(0.9, 1.4)), x, 0, z, w.range(0, 6.28)));
      else w.add(w.place(rock(w.range(0.4, 0.8), w.rng()), x, 0, z, w.range(0, 6.28)));
    }

    // ------------------------------------------------------------- o lago
    w.disc(-21, 11, 9.2, P.sand, 0.024); // acima do caminho, que encosta aqui
    w.disc(-21, 11, 8.5, P.water, 0.028);
    w.blockCircle(-21, 11, 8.8);
    const patos = [duck(), duck(0xe8e2d0), duck()];
    patos.forEach((d, i) => {
      w.place(d, -21 + Math.cos(i * 2.1) * 4.5, 0.1, 11 + Math.sin(i * 2.1) * 3.5, i * 1.7);
      w.add(d);
    });

    // Margem: o anel regular de arbustos de antes lia como cerca viva plantada
    // por régua. Agora é sorteio na faixa da beira, misturando pedra de tamanhos
    // bem diferentes, capim e arbusto — e a distância varia, então a silhueta
    // da margem deixa de ser um círculo perfeito.
    const NO_LAGO = { x: -21, z: 11 };
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * Math.PI * 2 + w.range(-0.09, 0.09);
      const d = w.range(9.1, 11.4);
      const x = NO_LAGO.x + Math.cos(a) * d;
      const z = NO_LAGO.z + Math.sin(a) * d;
      const sorte = i % 4;
      if (sorte === 0) w.add(w.place(bush(w.range(0.6, 1), P.leafDark), x, 0, z));
      else if (sorte === 1) w.add(w.place(capim(w.range(0.9, 1.5)), x, 0, z, w.range(0, 6.28)));
      else if (sorte === 2) w.add(w.place(rock(w.range(0.45, 1.5), w.rng()), x, 0, z, w.range(0, 6.28)));
      else w.add(w.place(flowers(5, 0.8), x, 0, z));
    }

    // pedras grandes meio dentro d'água, que é o que dá profundidade à borda
    for (const [a, d, esc] of [[0.9, 8.4, 1.6], [2.6, 8.7, 1.1], [4.3, 8.3, 1.9], [5.6, 8.9, 1.2]] as const) {
      const x = NO_LAGO.x + Math.cos(a) * d;
      const z = NO_LAGO.z + Math.sin(a) * d;
      w.add(w.place(rock(esc, (a % 1), 0x8f959b), x, -0.12, z, a));
      w.blockCircle(x, z, 0.4 * esc);
    }

    // juncos na beira e vitórias-régias boiando (calotas acima da água: não
    // encostam no decalque do lago, então não há z-fighting)
    for (const [a, d] of [[1.5, 8.2], [3.4, 8.4], [5.1, 8.1], [0.2, 8.5]] as const) {
      w.add(w.place(junco(w.range(1.1, 1.6)), NO_LAGO.x + Math.cos(a) * d, 0, NO_LAGO.z + Math.sin(a) * d));
    }
    const lirios = [
      [1.1, 6.6, 1, true], [2.9, 7.2, 0.8, false], [4.6, 6.1, 1.15, true],
      [0.4, 7.4, 0.9, true], [3.8, 5.2, 1.05, false], [5.9, 6.8, 0.85, true],
    ] as const;
    for (const [a, d, esc, flor] of lirios) {
      const lirio = w.place(nenufar(esc, flor), NO_LAGO.x + Math.cos(a) * d, 0.045, NO_LAGO.z + Math.sin(a) * d);
      lirio.rotation.y = a;
      w.add(lirio);
    }

    // ------------------------------------------------- quadra de frisbee
    const qx0 = QUADRA.x - QUADRA.largura / 2; // 5
    const qx1 = QUADRA.x + QUADRA.largura / 2; // 31
    const qz0 = QUADRA.z - QUADRA.profundidade / 2; // -14
    const qz1 = QUADRA.z + QUADRA.profundidade / 2; // 5

    // grama aparada e as linhas pintadas
    w.patch(QUADRA.x, QUADRA.z, QUADRA.largura, QUADRA.profundidade, P.grassDark, 0, 0.008);
    const linha = (x: number, z: number, larg: number, prof: number): void => {
      w.patch(x, z, larg, prof, 0xf2f4f0, 0, 0.012);
    };
    linha(QUADRA.x, qz0 + 0.3, QUADRA.largura - 1.2, 0.28);
    linha(QUADRA.x, qz1 - 0.3, QUADRA.largura - 1.2, 0.28);
    linha(qx0 + 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
    linha(qx1 - 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
    linha(QUADRA.x, QUADRA.z, 0.28, QUADRA.profundidade - 0.6); // meio
    linha(qx0 + 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6); // zonas de fundo
    linha(qx1 - 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6);
    w.disc(QUADRA.x, QUADRA.z, 2.2, 0xf2f4f0, 0.011);
    w.disc(QUADRA.x, QUADRA.z, 1.9, P.grassDark, 0.012);

    // alambrado, com a entrada aberta do lado do caminho principal
    const alambrado = (x: number, z: number, comp: number, girado: boolean): void => {
      w.add(w.place(fence(comp, 1.5, P.metalWhite), x, 0, z, girado ? Math.PI / 2 : 0));
      if (girado) w.blockBox(x, z, 0.2, comp / 2);
      else w.blockBox(x, z, comp / 2, 0.2);
    };
    alambrado(QUADRA.x, qz0, QUADRA.largura, false); // fundo
    alambrado(QUADRA.x, qz1, QUADRA.largura, false); // frente
    alambrado(qx1, QUADRA.z, QUADRA.profundidade, true); // leste
    alambrado(qx0, qz0 + 3.75, 7.5, true); // oeste, parte de baixo
    alambrado(qx0, qz1 - 3.75, 7.5, true); // oeste, parte de cima — o vão fica no meio

    // as cestas de disc golf nas duas pontas: é o que diz "aqui é de frisbee"
    w.add(w.place(discGolfBasket(), qx0 + 3, 0, QUADRA.z));
    w.blockCircle(qx0 + 3, QUADRA.z, 0.5);
    const cestaLeste = w.add(w.place(discGolfBasket(P.frisbee), qx1 - 3, 0, QUADRA.z));
    w.blockCircle(qx1 - 3, QUADRA.z, 0.5);

    const placar = w.add(w.place(scoreboard(), QUADRA.x, 0, qz0 + 1.2));
    w.blockBox(QUADRA.x, qz0 + 1.2, 1, 0.2);

    const arquibancada = w.add(w.place(bleachers(6), QUADRA.x, 0, qz1 - 1.2, Math.PI));
    w.blockBox(QUADRA.x, qz1 - 1.4, 3, 0.8);

    const bebedouro = w.add(w.place(waterFountain(), qx0 + 1.6, 0, QUADRA.z + 4.2, Math.PI / 2));
    w.blockCircle(qx0 + 1.6, QUADRA.z + 4.2, 0.4);

    const sacola = w.add(w.place(discBag(), qx0 + 1.8, 0, QUADRA.z - 3.4, 0.4));

    const biruta = w.add(w.place(windsock(), qx1 - 1.6, 0, qz1 - 2.4));
    w.blockCircle(qx1 - 1.6, qz1 - 2.4, 0.3);
    const mangaBiruta = biruta.userData.manga as THREE.Object3D;
    w.onUpdate((_dt, t) => {
      biruta.rotation.y = Math.sin(t * 0.3) * 0.5 + 0.6;
      mangaBiruta.rotation.z = Math.sin(t * 1.7) * 0.12 - 0.06;
    });

    for (const [fx, fz] of [[qx0 + 1, qz0 + 1], [qx1 - 1, qz0 + 1], [qx0 + 1, qz1 - 1], [qx1 - 1, qz1 - 1]] as const) {
      w.add(w.place(floodlight(), fx, 0, fz, Math.atan2(QUADRA.x - fx, QUADRA.z - fz)));
      w.blockCircle(fx, fz, 0.4);
    }
    for (const [cx, cz] of [[qx0 + 6, qz0 + 1.4], [qx0 + 6, qz1 - 1.4], [qx1 - 6, qz0 + 1.4], [qx1 - 6, qz1 - 1.4]] as const) {
      w.add(w.place(cone(), cx, 0, cz));
    }

    // placa da quadra, na entrada
    const placaCampinho = w.add(w.place(textSign('Frisbee!', P.frisbee), qx0 - 1.8, 0, QUADRA.z + 3.4, Math.PI * 0.25));
    w.blockCircle(qx0 - 1.8, QUADRA.z + 3.4, 0.3);

    // -------------------------------------------------------- mobiliario
    const bancos: Array<[number, number, number]> = [
      [-4.2, 14, 0], [4.2, 14, Math.PI], [-4.2, -2, 0], [4.2, -6, Math.PI],
      [-12, 9.5, Math.PI / 2],
    ];
    for (const [x, z, r] of bancos) w.banco(x, z, r);

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

    // ------------------------------------------------ mesa de ping pong
    // O tampo fica ao longo do X local: é nessa direção que a bolinha viaja, e
    // é por isso que a mesa entra girada mas tudo dentro dela usa coordenada
    // local — a física do minigame não precisa saber o giro da mesa.
    const mesaPing = mesaPingPong();
    const raqueteA = raquete(P.metalRed);
    raqueteA.position.set(-0.78, 0.82, 0.3);
    raqueteA.rotation.set(-Math.PI / 2, 0, 0.7);
    mesaPing.add(raqueteA);
    const raqueteB = raquete(P.fabricBlue);
    raqueteB.position.set(0.82, 0.82, -0.28);
    raqueteB.rotation.set(-Math.PI / 2, 0, -2.3);
    mesaPing.add(raqueteB);
    const bolinha = bolinhaPingPong();
    bolinha.position.set(0.36, 0.845, 0.42);
    mesaPing.add(bolinha);

    w.add(w.place(mesaPing, PING.x, 0, PING.z, PING.giro));
    w.blockBox(PING.x, PING.z, 1.45, 0.85, PING.giro);
    // as raquetes e a bolinha de enfeite somem quando a partida começa
    const enfeitesPing = [raqueteA, raqueteB, bolinha];

    // sorveteria
    // balcão virado para +Z: assim quem compra fica na frente do quiosque na
    // tela, e não escondido atrás dele
    const quiosque = w.add(w.place(kiosk(0xf6a6c0, { tipo: 'sorvete' }), 12, 0, 18.6, 0.3));
    w.blockBox(12, 18.6, 1.4, 0.95, 0.3);

    // --------------------------------------------------- loja de patins
    const loja = w.add(w.place(skateShop(P.fabricBlue), LOJA.x, 0, LOJA.z));
    // o teste acha a loja por aqui para comparar o colisor com o desenho
    loja.userData.loja = true;
    /**
     * A colisão, decalcada da geometria de `skateShop()`:
     *  - o prédio vai de x −3,7 a 3,7 e de z −2,33 (parede do fundo) a 2,2
     *    (a vitrine);
     *  - o balcão e os pés do abrigo ocupam x 4,08 a 5,32 e z −1,4 a 1,8;
     *  - as duas colunas da frente ficam nos cantos do beiral.
     * A laje e o toldo não entram: passam bem acima da cabeça.
     */
    w.blockBox(LOJA.x, LOJA.z - 0.05, 3.7, 2.3);
    w.blockBox(BALCAO.x, BALCAO.z, 0.65, 1.6);
    for (const lado of [-1, 1]) {
      w.blockCircle(LOJA.x + lado * 4.05, LOJA.z + 2.82, 0.16);
    }

    // bancos de calçar, na lateral livre da loja — e não mais perto do lago
    // que isto, senão eles sentam na areia
    for (const dz of [-1.4, 1.0]) w.banco(LOJA.x - 5.6, LOJA.z + dz, Math.PI / 2);

    for (const [x, z] of [
      [PISTA.x - PISTA.reta - PISTA.raio - 1.4, PISTA.z],
      [PISTA.x + PISTA.reta + PISTA.raio + 1.4, PISTA.z],
    ] as const) {
      w.add(w.place(lamp(false), x, 0, z));
      w.blockCircle(x, z, 0.35);
    }

    // Circuito de zigue-zague na raia, alternando entre a borda de fora e a de
    // dentro. SEM colisor de propósito — cone que barra o passo vira parede, e
    // a graça é desviar.
    const CONES = 14;
    for (let i = 0; i < CONES; i++) {
      const a = (i / CONES) * Math.PI * 2;
      // o raio alterna, e o comprimento da reta entra só no eixo X: é o que
      // espalha os cones ao longo do oval e não em volta de um círculo
      const r = i % 2 === 0 ? PISTA.miolo + 0.9 : PISTA.raio - 0.9;
      const x = PISTA.x + Math.cos(a) * r + Math.sign(Math.cos(a)) * PISTA.reta * Math.abs(Math.cos(a));
      const z = PISTA.z + Math.sin(a) * r;
      w.add(w.place(cone(), x, 0, z, w.range(0, 6.28)));
    }

    w.interact({
      id: 'parque:patins',
      x: BALCAO.x + 1.8, z: BALCAO.z, radius: 2.4,
      label: 'Alugar patins', icon: '🛼',
      highlight: loja,
      onInteract: async (api) => {
        if (api.hasItem(ITENS.patins.id)) {
          await conversa([
            [R, 'A gente já pegou um par.'],
            [A, 'É, e eu ainda não caí. Ainda.'],
          ]);
          return;
        }
        await conversa([
          [R, 'Um par pra cada um, moço.'],
          [A, 'Eu não sei patinar direito, hein.'],
          [R, 'Por isso eu vou do seu lado.'],
        ]);
        api.equipWearable(ITENS.patins);
        api.som('sorvete'); // a mesma sineta de "toma, é seu" dos quiosques
        api.toast('Patins calçados', '🛼');
        api.unlock({
          id: 'patins-villa',
          title: 'Patins no Villa',
          place: 'Parque Villa Lobos',
          note: 'A pista tem cone pra desviar e a gente desviou de quase todos.',
          icon: '🛼',
        });
      },
    });

    // ------------------------------------------------------------ vegetacao
    const proibido: Array<[number, number, number]> = [
      [0, -26, 20], [-21, 11, 12], [18, -4.5, 17], [0, 4, 6], [0, 9, 6],
      [12, 19, 4], [-10, 20, 3], [37, 13, 8],
      // a pista e a loja entram na lista pelo mesmo motivo da praça da roda:
      // sem isto o espalhador planta árvore em cima do asfalto
      [-21, -5, 12], [-8.6, 2.5, 9],
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

    // ---------------------------------------- ponto de ônibus para o clube
    // a cerca do parque tem um vão aqui; do outro lado é a rua, com o ônibus
    // parado esperando. A placa escrita deixa claro para onde ele vai.
    w.add(w.place(fence(11, 1.4), 35, 0, 3.5, Math.PI / 2));
    w.add(w.place(fence(11, 1.4), 35, 0, 22.5, Math.PI / 2));
    w.blockBox(35, 3.5, 0.2, 5.5);
    w.blockBox(35, 22.5, 0.2, 5.5);

    w.patch(30, 13, 12, 5, P.asphalt); // caminho do parque até o vão
    w.patch(40, 13, 12, 34, P.asphalt); // a rua
    w.patch(35.6, 13, 1.6, 34, P.concrete, 0, 0.012); // calçada

    const onibus = w.add(w.place(bus(0x3f7fd6), 39.5, 0, 13, -Math.PI / 2));
    w.blockBox(39.5, 13, 1.5, 4.3);

    const parada = w.add(w.place(busStop(), 36.4, 0, 13, -Math.PI / 2));
    w.blockBox(35.9, 13, 0.3, 1.8);

    const placaClube = w.add(w.place(textSign('Clube!', 0x4ec1a8), 36.4, 0, 8.6, Math.PI * 0.25));
    w.blockCircle(36.4, 8.6, 0.3);

    w.door({
      x: 37.6, z: 13,
      to: 'clube', entry: 'portaria',
      label: 'Pegar o ônibus pro clube', icon: '🚌',
      highlight: onibus,
      radius: 2.6,
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
    disco.mesh.visible = false;
    disco.onLand = () => g.som('quicar');
    w.root.add(disco.mesh);

    /**
     * Frisbee de dois, dentro da quadra.
     *
     * O disco só existe na mão enquanto você está na quadra — fora dela some, e
     * o Renan volta a andar do seu lado. Dentro, ele se posiciona do lado oposto
     * e o lançamento é carregado: quanto mais tempo segurando F, mais longe o
     * disco vai. A mira é para onde você está olhando, então errar o passe faz
     * parte — ele corre atrás.
     */
    type FaseDisco =
      | 'fora'
      | 'comigo'
      | 'voando-pra-ele'
      | 'buscando'
      | 'com-ele'
      | 'voando-pra-mim'
      | 'no-chao';

    const CARGA_CHEIA = 1.3; // segundos até a força total
    const DIST_MIN = 6;
    const DIST_MAX = 30;

    /**
     * O passe de volta do parceiro.
     *
     * Ele não mira nos pés de quem vai receber: mira num ponto ALÉM, então o
     * disco cruza a área do jogador ainda no ar, em vez de aterrissar em cima
     * dele. Com o arco mais alto ele também chega mais devagar. As duas coisas
     * juntas dobram a janela de interceptação (medida na física: ~0,3 s antes,
     * ~0,6 s agora), que é o ponto da mecânica — pegar voando, não catar do chão.
     */
    const RETORNO = {
      /** quanto o alvo passa do jogador, em unidades */
      alem: 3.5,
      /** multiplicador da subida; 1 é passe reto */
      arco: 1.2,
      /** erro de mira: pouco, senão ele nunca acerta a área */
      erro: 0.06,
      /** desvio lateral do alvo, em unidades */
      desvio: 1.4,
      /** altura máxima em que dá para agarrar (o disco passa por cima da cabeça) */
      alcance: 3.0,
      /** raio em volta de quem recebe */
      raio: 2.1,
      /** o quanto ele pode estar torto para considerar que já mirou (rad) */
      mira: 0.12,
    };

    // O disco não passa da grade: sem isso ele cai do lado de fora e o
    // parceiro fica batendo no alambrado tentando alcançar.
    const LIMITES_QUADRA = {
      minX: qx0 + 0.7,
      minZ: qz0 + 0.7,
      maxX: qx1 - 0.7,
      maxZ: qz1 - 0.7,
    };

    let fase: FaseDisco = 'fora';
    let esperaDele = 0;
    let carga = 0;
    let carregando = false;
    let trocasNaSessao = 0;
    let ultimoPosto: { x: number; z: number } | null = null;

    const contarTroca = (api: typeof g, noAr: boolean): void => {
      api.som('pegar');
      trocasNaSessao += 1;
      const total = api.bump('frisbee.trocas');

      const recorde = api.stat('frisbee.recorde');
      if (trocasNaSessao > recorde) api.bump('frisbee.recorde', trocasNaSessao - recorde);

      if (noAr) api.toast('Pegou no ar!', '🥏');
      else if (trocasNaSessao % 5 === 0) api.toast(`${trocasNaSessao} trocas seguidas!`, '🥏');

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

    const limitar = (v: number, min: number, max: number): number =>
      Math.max(min, Math.min(max, v));

    /** diferença entre dois ângulos pelo caminho mais curto */
    const desvioAngular = (a: number, b: number): number =>
      Math.atan2(Math.sin(a - b), Math.cos(a - b));

    /** Onde o parceiro se planta para receber: lado oposto, dentro das linhas. */
    const postoDoParceiro = (eu: THREE.Vector3): { x: number; z: number } => {
      const lado = eu.x < QUADRA.x ? 1 : -1;
      return {
        x: limitar(eu.x + lado * 11, qx0 + 2, qx1 - 2),
        z: limitar(eu.z, qz0 + 2, qz1 - 2),
      };
    };

    const soltarCarga = (): void => {
      carregando = false;
      carga = 0;
      g.showCharge(null);
    };

    /** o disco só é meu se estiver na MINHA vaga principal */
    const naMinhaMao = (): boolean => g.getActiveHandItem()?.id === ITENS.frisbee.id;

    /** avisou que a mochila estava cheia; zera ao sair da quadra */
    let avisouCheio = false;

    /**
     * Entrar na quadra é PEGAR o disco, e pegar passa pelo auto-stash.
     *
     * Mochila cheia não arma a quadra: sem vaga não há disco, e o aviso sai uma
     * vez só — o teste de entrada roda todo quadro.
     */
    const entrarNaQuadra = (): boolean => {
      const como = g.addItem(ITENS.frisbee);
      if (como === 'cheio') {
        if (!avisouCheio) {
          avisouCheio = true;
          g.toast('Sem vaga pro frisbee', '🥏');
        }
        return false;
      }
      fase = 'comigo';
      disco.pickUp();
      trocasNaSessao = 0;
      ultimoPosto = null;
      g.setZoom(19); // abre o enquadramento: dá pra ver o parceiro e mirar
      // Mão ocupada: o disco vai para a mochila e o F não faz nada até ele ser
      // escolhido. Sem dizer isso, a pessoa fica apertando F na quadra achando
      // que quebrou.
      g.toast(
        como === 'mao'
          ? 'Segure F para lançar mais longe'
          : 'Frisbee guardado — escolha ele na mochila (I)',
        '🥏',
      );
      return true;
    };

    const sairDaQuadra = (): void => {
      fase = 'fora';
      avisouCheio = false;
      g.removeItem(ITENS.frisbee.id);
      disco.mesh.visible = false;
      soltarCarga();
      g.freeCompanion();
      g.setZoom(14);
      ultimoPosto = null;
    };

    const lancar = (forca: number): void => {
      if (fase !== 'comigo') return;
      // guardado no fundo da mochila ele não voa: só o item da mão é lançável
      if (!naMinhaMao()) return;
      g.removeItem(ITENS.frisbee.id);
      const dist = DIST_MIN + (DIST_MAX - DIST_MIN) * limitar(forca, 0, 1);
      disco.throwAt(g.playerPosition(), g.playerFacing(), dist);
      g.som('lancar');
      fase = 'voando-pra-ele';
    };

    const jogar = w.interact({
      id: 'parque:frisbee-jogar',
      x: QUADRA.x, z: QUADRA.z, radius: 3,
      priority: -1, // segue o jogador: nunca deve roubar o prompt de outra coisa
      label: 'Lançar o frisbee  (segure F)', icon: '🥏',
      onInteract: () => lancar(0.55),
    });

    const pegar = w.interact({
      id: 'parque:frisbee-pegar',
      x: QUADRA.x, z: QUADRA.z, radius: 1.8,
      label: 'Pegar o frisbee', icon: '🥏',
      onInteract: (api) => {
        if (api.addItem(ITENS.frisbee) === 'cheio') return;
        disco.pickUp();
        fase = 'comigo';
        contarTroca(api, false);
      },
    });

    w.onUpdate((dt) => {
      disco.update(dt, LIMITES_QUADRA);

      const eu = g.playerPosition();
      const ele = g.companionPosition();
      const dentro = naQuadra(eu.x, eu.z, 0.4);

      if (dentro && fase === 'fora') entrarNaQuadra();
      else if (!dentro && fase !== 'fora') sairDaQuadra();

      if (fase === 'fora') {
        jogar.enabled = false;
        pegar.enabled = false;
        return;
      }

      // ---------------------------------------------------------- a carga
      if (fase === 'comigo' && naMinhaMao()) {
        if (g.keyDown('KeyF')) {
          carregando = true;
          carga = Math.min(1, carga + dt / CARGA_CHEIA);
          g.showCharge(carga);
        } else if (carregando) {
          const forca = carga;
          soltarCarga();
          lancar(forca);
        }
      } else if (carregando) {
        soltarCarga();
      }

      // ------------------------------------------------ o parceiro se posta
      if (fase === 'comigo' || fase === 'no-chao') {
        const posto = postoDoParceiro(eu);
        if (!ultimoPosto || Math.hypot(posto.x - ultimoPosto.x, posto.z - ultimoPosto.z) > 2.5) {
          g.commandCompanion(posto.x, posto.z);
          ultimoPosto = posto;
        }
      }

      // a fase fica legível de fora: é por ela que o teste do frisbee sabe de
      // quem é o disco sem ter que adivinhar pela altura da malha
      disco.mesh.userData.fase = fase;

      // ------------------------------------------------------ o vai e volta
      switch (fase) {
        case 'comigo':
          // Quem o jogador VÊ na mão é o modelo pendurado no rig. O objeto de
          // física continua acompanhando a mão, só invisível: assim ele não
          // teleporta no lançamento e continua sendo a fonte de verdade de
          // onde o disco está.
          disco.holdAt(eu, g.playerFacing());
          disco.mesh.visible = false;
          break;

        case 'com-ele': {
          // 1. parado: com o disco na mão ele não anda mais, fica plantado
          // 2. mirando: vira para encarar onde o jogador está agora
          const paraMim = Math.atan2(eu.x - ele.x, eu.z - ele.z);
          g.holdCompanion(eu.x, eu.z);
          disco.holdAt(ele, paraMim);

          esperaDele -= dt;
          const mirado = Math.abs(desvioAngular(g.companionFacing(), paraMim)) < RETORNO.mira;
          // o `-1` é rede de segurança: se por algum motivo ele não fechar a
          // mira, o passe sai mesmo assim em vez de travar a partida
          if (esperaDele <= 0 && (mirado || esperaDele < -1)) {
            // 3. o alvo fica ALÉM do jogador, na mesma linha: é isso que faz o
            // disco passar voando por ele em vez de cair nos pés dele
            const dx = eu.x - ele.x;
            const dz = eu.z - ele.z;
            const dist = Math.hypot(dx, dz) || 1;
            const alvo = new THREE.Vector3(
              limitar(
                eu.x + (dx / dist) * RETORNO.alem + (Math.random() - 0.5) * RETORNO.desvio,
                qx0 + 1.5, qx1 - 1.5,
              ),
              0,
              limitar(
                eu.z + (dz / dist) * RETORNO.alem + (Math.random() - 0.5) * RETORNO.desvio,
                qz0 + 1.5, qz1 - 1.5,
              ),
            );
            disco.throwToward(ele, alvo, RETORNO.erro, RETORNO.arco);
            g.som('lancar');
            ultimoPosto = null; // ele volta a se postar assim que o disco for meu
            fase = 'voando-pra-mim';
          }
          break;
        }

        case 'voando-pra-ele': {
          // pegada no ar: passou perto dele na altura certa, ele agarra
          const noAr =
            disco.state === 'voando' &&
            disco.position.y < 2.3 &&
            Math.hypot(disco.position.x - ele.x, disco.position.z - ele.z) < 1.5;
          if (noAr) {
            g.som('pegar');
            g.holdCompanion(eu.x, eu.z);
            ultimoPosto = null;
            disco.pickUp();
            esperaDele = 0.7;
            fase = 'com-ele';
            g.toast('Ele pegou no ar!', '🙌');
            break;
          }
          if (disco.state === 'chao') {
            if (disco.position.distanceTo(ele) < 1.6) {
              g.holdCompanion(eu.x, eu.z);
              ultimoPosto = null;
              disco.pickUp();
              esperaDele = 0.8;
              fase = 'com-ele';
            } else {
              g.commandCompanion(disco.position.x, disco.position.z);
              ultimoPosto = null;
              fase = 'buscando';
            }
          }
          break;
        }

        case 'buscando':
          if (disco.position.distanceTo(ele) < 1.1) {
            // parou de correr aqui: quem lança andando joga torto
            g.holdCompanion(eu.x, eu.z);
            ultimoPosto = null;
            disco.pickUp();
            esperaDele = 0.9;
            fase = 'com-ele';
          }
          break;

        case 'voando-pra-mim': {
          // o disco vem por cima da cabeça, então o teto da pegada é mais alto
          // que o do passe raso — é a janela de interceptação da mecânica
          const noAr =
            disco.state === 'voando' &&
            disco.position.y < RETORNO.alcance &&
            Math.hypot(disco.position.x - eu.x, disco.position.z - eu.z) < RETORNO.raio;
          if (noAr) {
            if (g.addItem(ITENS.frisbee) === 'cheio') break;
            disco.pickUp();
            fase = 'comigo';
            contarTroca(g, true);
            break;
          }
          if (disco.state === 'chao') {
            fase = 'no-chao';
            if (disco.position.distanceTo(eu) < 1.9 && g.addItem(ITENS.frisbee) !== 'cheio') {
              disco.pickUp();
              fase = 'comigo';
              contarTroca(g, false);
            }
          }
          break;
        }

        case 'no-chao':
          if (disco.position.distanceTo(eu) < 1.2) {
            disco.pickUp();
            fase = 'comigo';
            contarTroca(g, false);
          }
          break;
      }

      jogar.enabled = fase === 'comigo';
      pegar.enabled = fase === 'no-chao';
      if (fase === 'comigo') jogar.moveTo(eu.x, eu.z);
      else pegar.moveTo(disco.position.x, disco.position.z);
    });


    // -------------------------------------------- interações da quadra
    w.interact({
      id: 'parque:placa-quadra',
      x: qx0 - 1.8, z: QUADRA.z + 4.8, radius: 2.2,
      label: 'Ler a placa', icon: '🪧',
      highlight: placaCampinho,
      onInteract: () =>
        conversa([
          [R, 'QUADRA LIVRE — respeite quem chegou primeiro.'],
          [A, 'Hoje só tem a gente.'],
          [R, 'Então segura o F e manda ver. Quanto mais tempo segurar, mais longe vai.'],
        ]),
    });

    w.interact({
      id: 'parque:placar',
      x: QUADRA.x, z: qz0 + 2.6, radius: 2.2,
      label: 'Ver o placar', icon: '🔢',
      highlight: placar,
      onInteract: (api) => {
        const recorde = api.stat('frisbee.recorde');
        const total = api.stat('frisbee.trocas');
        return conversa([
          [A, recorde > 0 ? `Nosso recorde é ${recorde} trocas seguidas.` : 'O placar tá zerado.'],
          [R, total > 0 ? `E já foram ${total} no total. A gente não desiste fácil.` : 'Bora estrear isso então.'],
        ]);
      },
    });

    w.interact({
      id: 'parque:arquibancada',
      x: QUADRA.x, z: qz1 - 2.6, radius: 2.4,
      label: 'Sentar na arquibancada', icon: '🪑',
      highlight: arquibancada,
      onInteract: () =>
        conversa([
          [R, 'Cansei. Cinco minutos.'],
          [A, 'Você falou cinco minutos faz meia hora.'],
          [R, 'E olha que descanso bem, hein.'],
        ]),
    });

    w.interact({
      id: 'parque:bebedouro',
      x: qx0 + 2.8, z: QUADRA.z + 4.2, radius: 1.8,
      label: 'Beber água', icon: '🚰',
      highlight: bebedouro,
      onInteract: async (api) => {
        await conversa([
          [A, 'A água daqui é sempre meio quente.'],
          [R, 'Mas depois de correr atrás de disco, tá ótima.'],
        ]);
        api.toast('Água (meio quente)', '🚰');
      },
    });

    w.interact({
      id: 'parque:sacola',
      x: qx0 + 2.8, z: QUADRA.z - 3.4, radius: 1.8,
      label: 'Olhar os discos', icon: '🎒',
      highlight: sacola,
      onInteract: () =>
        conversa([
          [R, 'Tem uns três discos aqui de gente que esqueceu.'],
          [A, 'Um deles é seu. Desde março.'],
          [R, '…é, pode ser.'],
        ]),
    });

    w.interact({
      id: 'parque:cesta',
      x: qx1 - 4.4, z: QUADRA.z, radius: 2.2,
      label: 'Ver a cesta', icon: '🧺',
      highlight: cestaLeste,
      onInteract: () =>
        conversa([
          [A, 'Um dia a gente acerta essa cesta.'],
          [R, 'Já acertei uma vez!'],
          [A, 'Você acertou o poste. É diferente.'],
        ]),
    });

    w.interact({
      id: 'parque:biruta',
      x: qx1 - 3, z: qz1 - 2.4, radius: 2,
      label: 'Ver o vento', icon: '🎏',
      highlight: biruta,
      onInteract: () =>
        conversa([
          [R, 'O vento tá indo pra lá.'],
          [A, 'Então joga contra que o disco fica no ar mais tempo.'],
          [R, 'Ou joga a favor e ele vai parar no estacionamento. Já aconteceu.'],
        ]),
    });

    // -------------------------------------------- interações do ponto
    w.interact({
      id: 'parque:ponto-onibus',
      x: 36.4, z: 15.4, radius: 2.2,
      label: 'Esperar no ponto', icon: '🚏',
      highlight: parada,
      onInteract: () =>
        conversa([
          [A, 'Esse é o que passa no clube?'],
          [R, 'É esse. Já tá parado, é só subir.'],
        ]),
    });

    w.interact({
      id: 'parque:placa-clube',
      x: 36.4, z: 7.0, radius: 2.2,
      label: 'Ler a placa', icon: '🪧',
      highlight: placaClube,
      onInteract: () =>
        conversa([
          [R, '"Clube!" — com exclamação e tudo.'],
          [A, 'Quem escreveu isso tava animado.'],
        ]),
    });

    // ----------------------------------------------------- outras interacoes
    w.interact({
      id: 'parque:lago',
      x: -13, z: 11, radius: 2.6,
      label: 'Olhar o lago', icon: '🦆',
      onInteract: async (api) => {
        api.som('pato');
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
    // Morango do Ari, maracujá do Renan. Agora são ITENS, cada um na mochila do
    // seu dono: quem põe o modelo na mão é o motor, e o T não muda nada porque
    // a malha é filha do rig, que viaja com a pessoa.
    let sorveteRestante = 0;

    w.onUpdate((dt) => {
      if (sorveteRestante <= 0) return;
      sorveteRestante -= dt;
      if (sorveteRestante <= 0) {
        g.removeItem(ITENS.sorveteMorango.id, ARI.id);
        g.removeItem(ITENS.sorveteMaracuja.id, RENAN.id);
        g.toast('Acabou o sorvete', '🍦');
      }
    });

    // ------------------------------------------------------- ping pong
    /**
     * A partida roda inteira em coordenada LOCAL da mesa (ver PingPong.ts): o
     * grupo do minigame entra como filho da mesa, então o giro dela sai de
     * graça e nenhuma conta aqui precisa de seno e cosseno.
     */
    const partida = new PingPong(5);
    partida.guardar();
    mesaPing.add(partida.grupo);
    partida.onSom = (nome) => g.som(nome);
    // pendurada na mesa para scripts/pingpong.mjs conseguir ler o placar e a
    // posição da bolinha de fora — mesmo espírito do `window.jogo`
    mesaPing.userData.pingpong = partida;

    /** ponto do mundo a partir de coordenada local da mesa */
    const naMesa = (x: number, z: number): THREE.Vector3 => {
      const v = new THREE.Vector3(x, 0, z);
      mesaPing.localToWorld(v);
      return v;
    };

    let jogando = false;
    const LADO = MESA_PING.plano + 0.55; // onde cada um fica de pé

    const encerrarPing = (): void => {
      jogando = false;
      partida.guardar();
      for (const e of enfeitesPing) e.visible = true;
      g.showPlacar(null);
      g.setCameraOmbro(null);
      g.setPlayerVisible(true);
      g.lockPlayer(false);
      g.freeCompanion();
      jogarPing.enabled = true;
    };

    w.onUpdate((dt) => {
      if (!jogando) return;
      partida.update(dt, g.pointer());
      // o update pode ter terminado a partida (onFim → encerrarPing), e aí o
      // placar já foi escondido: pintar de novo aqui o traria de volta na tela
      if (!jogando) return;
      g.showPlacar({
        eu: g.playerName(),
        ele: g.companionName(),
        meus: partida.meus,
        dele: partida.dele,
      });
    });

    const jogarPing = w.interact({
      id: 'parque:pingpong',
      x: PING.x, z: PING.z, radius: 2.6,
      label: 'Jogar ping pong', icon: '🏓',
      highlight: mesaPing,
      onInteract: async (api) => {
        if (jogando) return;
        await conversa([
          [A, 'Cinco pontos?'],
          [R, 'Cinco pontos. E o perdedor carrega a bolsa até em casa.'],
        ]);

        // cada um de um lado, olhando para o outro
        const meu = naMesa(-LADO, 0);
        const dele = naMesa(LADO, 0);
        api.releasePlayer(meu.x, meu.z, Math.atan2(dele.x - meu.x, dele.z - meu.z));
        api.releaseCompanion(dele.x, dele.z, Math.atan2(meu.x - dele.x, meu.z - dele.z));
        api.holdCompanion(meu.x, meu.z);
        api.lockPlayer(true);

        // Falsa primeira pessoa: atrás e ACIMA da cabeça, olhando para o
        // centro da mesa. Duas correções que a foto cobrou: câmera na altura
        // dos olhos deixa a juba do Ari tapando metade da tela, e mirar no
        // parceiro (que está longe) joga a mesa para fora do quadro — o alvo
        // certo é o meio da mesa.
        const atras = naMesa(-LADO - 1.6, 0);
        const meio = naMesa(0, 0);
        api.setCameraOmbro(
          new THREE.Vector3(atras.x, 2.35, atras.z),
          new THREE.Vector3(meio.x, 0.9, meio.z),
        );
        // O corpo de quem joga sai de cena: é primeira pessoa, e a juba do Ari
        // tapa a mesa inteira e a própria raquete se ficar na frente da câmera.
        // Quem continua em cena é o parceiro, do outro lado.
        api.setPlayerVisible(false);

        for (const e of enfeitesPing) e.visible = false;
        // desliga o interativo: sem isso a mesa continua com o "respiro" do
        // destaque, e como ela é o pai da bolinha a partida inteira balança
        jogarPing.enabled = false;
        partida.comecar();
        jogando = true;
        api.toast('Mexa o mouse para mover a raquete', '🏓');
      },
    });

    partida.onPonto = (meu) => {
      g.som(meu ? 'confirma' : 'quicar');
    };

    partida.onFim = (ganhei) => {
      void (async () => {
        encerrarPing();
        if (ganhei) {
          g.som('memoria');
          g.toast('Campeão de ping pong!', '🏆');
          // o chapéu é do personagem que estava jogando, não do "slot"
          // o chapéu é um ITEM: entra na primeira vaga de acessório livre de
          // quem ganhou, e some da cabeça se for arrastado para fora dela
          g.equipWearable(ITENS.chapeuPingPong);
          await conversa([
            [A, 'Cinco a ' + partida.dele + '.'],
            [R, 'Você ganhou o chapéu. Vai ter que usar.'],
          ]);
          g.unlock({
            id: 'memoria-ping-pong',
            title: 'A mesa do parque',
            place: 'Parque Villa Lobos',
            note: 'Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.',
            icon: '🏓',
          });
        } else {
          await conversa([
            [R, 'Cinco a ' + partida.meus + '. Revanche?'],
            [A, 'Sempre revanche.'],
          ]);
        }
      })();
    };

    w.interact({
      id: 'parque:sorveteria',
      x: 12, z: 20.6, radius: 2.4,
      label: 'Comprar sorvete', icon: '🍦',
      highlight: quiosque,
      onInteract: async (api) => {
        await conversa([
          [A, 'Dois, por favor.'],
          [R, 'Um de morango e um de maracujá.'],
          [A, 'Nunca pedimos diferente.'],
        ]);
        sorveteRestante = 50;
        // cada casquinha vai para a mochila do dono, não para uma bolsa comum
        api.addItem(ITENS.sorveteMorango, ARI.id);
        api.addItem(ITENS.sorveteMaracuja, RENAN.id);
        api.som('sorvete');
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
        await conversa([
          [R, 'A toalha xadrez de sempre.'],
          [A, 'E o pão de queijo já frio.'],
          [R, 'Frio é melhor. Aceita.'],
        ]);
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
      onInteract: () =>
        conversa([
          [A, 'Dois pra roda gigante.'],
          [R, 'Sempre dois.'],
        ]),
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
        await conversa([
          [R, 'A fila tá curta hoje.'],
          [A, 'Bora subir?'],
        ]);

        const cabine = wheel.boardingCabin();
        const velocidade = wheel.speed;
        wheel.speed = velocidade * 5; // a volta cenica dura ~12s, nao um minuto
        // os dois entram na mesma cabine, um de cada lado
        api.som('sino'); // a sineta de "vai começar" antes de a cabine subir
        api.ridePlayer(cabine, new THREE.Vector3(-0.3, -0.34, 0), 0.55);
        api.rideCompanion(cabine, new THREE.Vector3(0.3, -0.34, 0), 0.55);
        api.focusCamera(cabine);
        api.setZoom(38);

        await esperarVoltas(0.25);
        await conversa([
          [A, 'Daqui dá pra ver o parque inteiro.'],
          [R, 'E aquele pedacinho do rio ali atrás.'],
        ]);
        await esperarVoltas(0.35);
        await conversa([
          [A, 'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],
          [R, 'Pronto. Subimos.'],
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
