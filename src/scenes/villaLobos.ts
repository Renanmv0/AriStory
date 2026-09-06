import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import { FerrisWheel } from '../world/ferrisWheel';
import { Frisbee } from '../entities/Frisbee';
import { MESA_PING, PingPong } from '../entities/PingPong';
import {
  aroDeFrisbee, bin, bleachers, building, bus, busStop, bush, canteiro, capim, cloud,
  cone, discBag, discGolfBasket, domoDeVidro, duck, fence, floodlight, flowers,
  junco, kiosk, lamp, marcaDeMira, meioFio, mesaPingPong, nenufar, picnicTable, raquete, skateShop,
  rock, scoreboard, signBoard, textSign, tree, waterFountain, windsock,
  bolinhaPingPong,
} from '../world/props';
import { ARI, RENAN } from '../characters/cast';
import { ITENS } from '../world/itens';
import { asfalto, calcadaDePedrinha, tapeteDeGrama } from '../world/texturasDeChao';
import { Mano } from '../entities/bichos/Mano';

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
    // A MESMA grama do clube, para os dois cenários serem o mesmo mundo. Já a
    // calçada é OUTRA textura de propósito: os dois são chão claro de área
    // pública, e o que separa um do outro é a escala da unidade — placa grande
    // de borda de piscina lá, pedrinha miúda de praça aqui.
    w.ground({ width: 240, depth: 240, color: P.grass, textura: tapeteDeGrama(9) });
    /** comprimento da rua do ponto de ônibus: o cenário todo, e mais um pouco */
    const RUA_COMP = 80;
    w.setBounds(-44, -34, 44, 32);

    // Ordem de empilhamento do chão. Cada decalque também recebe um
    // polygonOffset próprio do WorldBuilder, então a altura aqui é só folga.
    for (let i = 0; i < 14; i++) {
      w.disc(w.range(-40, 40), w.range(-30, 30), w.range(2, 6), P.grassDark, 0.004);
    }
    w.disc(0, -16.5, 8.6, P.sand, 0.008); // borda da praça
    w.disc(0, -16.5, 8, P.concrete, 0.012, calcadaDePedrinha()); // praça
    w.patch(0, 4, 5.5, 56, P.asphalt, 0, 0.016, asfalto()); // caminho principal
    w.patch(0, 9, 62, 4.5, P.asphalt, 0, 0.02, asfalto()); // caminho transversal

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
    const oval = (raio: number, cor: number, altura: number, textura?: THREE.Texture): void => {
      w.patch(PISTA.x, PISTA.z, PISTA.reta * 2, raio * 2, cor, 0, altura, textura);
      w.disc(PISTA.x - PISTA.reta, PISTA.z, raio, cor, altura, textura);
      w.disc(PISTA.x + PISTA.reta, PISTA.z, raio, cor, altura, textura);
    };
    /**
     * As camadas, de baixo para cima. Cada faixa branca e' o oval de baixo
     * aparecendo por uma beirada: pinta-se branco e cobre-se o miolo com a cor
     * de cima, sobrando um anel de `FAIXA` de largura. Sai mais barato do que
     * desenhar dois aneis de verdade, e casa exatamente com a curva.
     */
    const FAIXA = 0.3;
    oval(PISTA.raio, P.metalWhite, 0.022); // borda externa
    // o asfalto da pista é o mesmo dos caminhos; as três peças do oval não
    // alinham o azulejo entre si, e não precisam: asfalto é grão solto, sem
    // junta nem fiada para denunciar a emenda
    oval(PISTA.raio - FAIXA, P.asphalt, 0.026, asfalto());
    oval(PISTA.miolo + FAIXA, P.metalWhite, 0.03); // borda interna
    oval(PISTA.miolo, P.grass, 0.034, tapeteDeGrama(9));

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
    w.patch(LOJA.x + 0.4, LOJA.z + 0.2, 10, 6.4, P.concrete, 0, 0.02, calcadaDePedrinha());
    w.patch(LOJA.x + 1.6, 7.2, 3, 7, P.asphalt, 0, 0.022, asfalto());

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
    // x = 8.9, e não 9.5: com o giro de -0,5 rad o canto da direita do quiosque
    // chega 1,68 além do centro dele, e a cerca da praça está em x = 11 — em
    // 9,5 o tapume atravessava a bilheteria de lado a lado. Aqui sobra ~0,4 de
    // folga entre a quina e a cerca.
    const bilheteria = w.add(w.place(kiosk(P.fabricBlue, { texto: 'Bilheteria' }), 8.9, 0, -20.5, -0.5));
    w.blockBox(8.9, -20.5, 1.4, 0.95, -0.5);

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

    // Grama aparada e as linhas pintadas, montadas de baixo para cima: a ordem
    // de criacao e que decide quem fica por cima (ver `WorldBuilder.decalar`).
    // O circulo central e um ANEL, e nao dois discos concentricos: com dois
    // discos a borda de um caia em cima da borda do outro e piscava. A risca do
    // meio vem depois do anel, porque em quadra de verdade ela atravessa o
    // circulo.
    // a MESMA grama do resto do parque, senão a quadra fica um retângulo liso
    // no meio de um gramado texturizado
    w.patch(QUADRA.x, QUADRA.z, QUADRA.largura, QUADRA.profundidade, P.grassDark, 0, 0.008,
      tapeteDeGrama(9));
    const linha = (x: number, z: number, larg: number, prof: number): void => {
      w.patch(x, z, larg, prof, 0xf2f4f0, 0, 0.012);
    };
    linha(QUADRA.x, qz0 + 0.3, QUADRA.largura - 1.2, 0.28);
    linha(QUADRA.x, qz1 - 0.3, QUADRA.largura - 1.2, 0.28);
    linha(qx0 + 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
    linha(qx1 - 0.6, QUADRA.z, 0.28, QUADRA.profundidade - 0.6);
    linha(qx0 + 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6); // zonas de fundo
    linha(qx1 - 6, QUADRA.z, 0.22, QUADRA.profundidade - 0.6);
    w.ring(QUADRA.x, QUADRA.z, 2.2, 0.3, 0xf2f4f0, 0.012);
    linha(QUADRA.x, QUADRA.z, 0.28, QUADRA.profundidade - 0.6); // meio

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

    // O poste de `[-4, 2]` saiu daqui: ele caia DENTRO da lojinha de patins, com
    // o pé atravessando o balcão e a cabeça saindo por cima do toldo. O balcão
    // fica em `(-3,88, 2,7)` — 72 cm dali. Em `[-4, 8]` ele volta para a fila da
    // alameda (20, 8, -8, espaçados por 12) e fica livre da loja.
    for (const [x, z] of [[-4, 20], [4, 6], [-4, -8], [4, 22], [-4, 8]] as const) {
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

    /**
     * O MANO, o pinguim sorveteiro — o primeiro bicho do parque.
     *
     * ONDE ELE FICA: na frente do balcão, do lado direito. O quiosque está
     * girado 0,3 rad, então a normal da frente dele é `(sen 0,3; cos 0,3)` =
     * `(0,30; 0,95)`; ele fica a 1,7 por essa normal, bem fora do colisor
     * (0,95 de meia profundidade), e desviado para `+X` para não ficar na
     * linha entre o jogador e o balcão.
     *
     * A PRIMEIRA POSIÇÃO ERA COLADA DEMAIS (`13,0; 19,75`): dali o pilar da
     * direita do quiosque cortava metade dele no zoom de jogo. Um bicho de
     * posto tem que aparecer INTEIRO do lugar de onde se compra.
     *
     * ELE OLHA PARA O MESMO LADO QUE O BALCÃO (`rotation.y = 0,3`), que é para
     * `+Z` — de onde a câmera olha e de onde o cliente chega. De costas para o
     * quiosque e de frente para quem compra, como todo sorveteiro.
     *
     * A ÁREA É MENOR QUE O PASSO MÍNIMO do cérebro (0,7), então ele não sai do
     * posto: é a mesma coleira da Gina na portaria, e nenhuma linha de cérebro
     * mudou por causa disso.
     */
    const MANO = { x: 12.9, z: 20.3 };
    const mano = new Mano({
      minX: MANO.x - 0.12, maxX: MANO.x + 0.12,
      minZ: MANO.z - 0.1, maxZ: MANO.z + 0.1,
    });
    mano.group.rotation.y = 0.3;
    w.add(mano.group);
    mano.aoSoar = () => g.som('pinguim');

    /**
     * O CARINHO NO MANO tem PRIORIDADE sobre "Comprar sorvete".
     *
     * Os dois pontos se sobrepõem — o de comprar tem raio 2,4 e o Mano está
     * dentro dele —, e sem o desempate o cachorrinho na sua frente vira
     * cenário. O alvo mais específico ganha: é a mesma regra que o Walter e as
     * mesas do Mania já pagaram.
     *
     * MAS O RAIO PRECISA SER MENOR QUE A DISTÂNCIA ATÉ O PONTO DE COMPRAR, e a
     * primeira versão errou isso: com 1,05 de raio e o Mano a 0,92 da âncora de
     * "Comprar sorvete" (`12; 20,6`), o carinho roubava o prompt de quem só
     * queria comprar — a ação principal do quiosque virava a difícil de achar.
     * Agora ele está a 0,95 da âncora e o raio é 0,8: parado onde se compra,
     * o prompt é comprar; um passo para cima dele, é o carinho.
     */
    const FALAS_DO_MANO = [
      'Ele bateu as asinhas. Acho que isso é oi.',
      'Ó o chapéu. O sorvete de cima parece de verdade.',
      'Mano, você é o melhor sorveteiro deste parque.',
      'Ele fica na ponta dos pés quando a gente chega.',
      'Se deixar, acho que ele dança de novo.',
    ];
    const carinhoNoMano = w.interact({
      id: 'parque:mano',
      x: mano.x, z: mano.z, radius: 0.8,
      label: 'Fazer carinho no Mano', icon: '🐧',
      highlight: mano.group,
      priority: 1,
      onInteract: async (api) => {
        mano.receberCarinho();
        api.som('pinguim');
        if (!api.flag('mano-conhecido')) {
          api.setFlag('mano-conhecido');
          await conversa([
            [R, 'Tem um pinguim atendendo o quiosque.'],
            [A, 'Tem um pinguim DE CHAPÉU DE CASQUINHA atendendo o quiosque.'],
            [R, 'Crachá e tudo. "Mano".'],
            [A, 'Oi, Mano.'],
          ]);
          // ele responde do jeito dele: uma dancinha curta de apresentação
          mano.dancar(1.8);
          api.unlock({
            id: 'mano-do-quiosque',
            title: 'O Mano',
            place: 'Parque Villa Lobos',
            note: 'O pinguim do quiosque de sorvete, de avental rosa e chapéu de casquinha. Ele dança quando fica feliz, e ele fica feliz sempre.',
            icon: '🐧',
          });
          return;
        }
        await api.say([w.pick(FALAS_DO_MANO)], A);
      },
    });

    w.onUpdate((dt) => {
      mano.update(dt);
      // ele quase não sai do lugar, mas "quase" não é "nunca": sem isto o ponto
      // fica onde ele nasceu e o carinho vira um buraco no chão
      carinhoNoMano.moveTo(mano.x, mano.z);
    });

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
      /**
       * O CÍRCULO DA SORVETERIA FOI DE 4 PARA 6,5 quando o Mano chegou.
       *
       * Com 4, uma palmeira caía em `(14,2; 22,5)` — a 4,13 do centro, escapando
       * por treze centímetros — e ela ficava bem NA FRENTE do quiosque. Copa de
       * palmeira a 3,5 de altura esconde 1,5 × (3,5 − 1) ≈ 3,7 de tudo o que
       * tiver um metro atrás dela, e o Mano tem exatamente um metro: ele sumia
       * inteiro atrás da folha, sobrando só a bolinha de sorvete do chapéu.
       * O quiosque continuava aparecendo porque ele é alto — a regra é a altura
       * do que está atrás, não a distância.
       */
      [12, 19, 6.5], [-10, 20, 3],
      // a pista e a loja entram na lista pelo mesmo motivo da praça da roda:
      // sem isto o espalhador planta árvore em cima do asfalto
      [-21, -5, 12], [-8.6, 2.5, 9],
    ];
    const livre = (x: number, z: number): boolean => {
      if (Math.abs(x) < 4 && z > -20 && z < 30) return false;
      // A RUA INTEIRA, e não um círculo em volta do ponto: o espalhador vai até
      // `x = 42`, e a calçada começa em `33,6` — era isso que plantava árvore no
      // meio do asfalto longe do ponto de ônibus.
      if (x > 33.2) return false;
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
    w.patch(-55, -10, 6, 220, P.concrete, 0, 0.03, calcadaDePedrinha());

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
      // e a rua passa por baixo da mata: sem isto a silhueta planta árvore no
      // asfalto nas duas pontas, onde o anel cruza a faixa da rua
      if (x > 33.2 && Math.abs(z) < 44) continue;
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
    // A cerca recuou de `35` para `33,5`: com a calçada alargada, em `35` ela
    // ficava plantada no MEIO dela. Agora é a divisa entre o parque e a
    // calçada, que é onde cerca de parque fica.
    w.add(w.place(fence(11, 1.4), 33.5, 0, 3.5, Math.PI / 2));
    w.add(w.place(fence(11, 1.4), 33.5, 0, 22.5, Math.PI / 2));
    w.blockBox(33.5, 3.5, 0.2, 5.5);
    w.blockBox(33.5, 22.5, 0.2, 5.5);

    // A rua e o caminho que chega nela sao a MESMA cor e se cruzavam em x 34~36:
    // dois asfaltos colados no mesmo lugar, piscando um por cima do outro. O
    // caminho agora para na calçada, e a rua começa depois dela.
    // A calçada alargou de 1,6 para 2,8: o abrigo do ponto tem 2,3 de fundo, e
    // na faixa antiga metade dele nasceria dentro da rua.
    w.patch(28.8, 13, 9.6, 5, P.asphalt, 0, 0.01, asfalto()); // caminho do parque até o vão
    // A rua atravessa o cenário INTEIRO (80 de comprimento, contra os 44 de
    // área jogável): rua que começa e acaba dentro da tela vira pátio. Ela
    // some no horizonte nas duas pontas, como rua de verdade.
    w.patch(35, 0, 2.8, RUA_COMP, P.concrete, 0, 0.014, calcadaDePedrinha()); // calçada
    w.patch(40.8, 0, 8.8, RUA_COMP, P.asphalt, 0, 0.018, asfalto()); // a rua

    // o tracejado do meio da rua. Sem ele o asfalto texturizado continua lendo
    // como pátio: é a faixa que diz "isto é uma rua, o ônibus passa por aqui".
    // Um traço de 2 m a cada 5 m, de ponta a ponta.
    for (let z = -RUA_COMP / 2 + 2; z <= RUA_COMP / 2 - 2; z += 5) {
      w.patch(40.8, z, 0.22, 2, P.metalWhite, 0, 0.022);
    }
    // a guia: o degrau entre a calçada e o asfalto
    w.add(w.place(meioFio(RUA_COMP), 36.4, 0, 0));

    // O ônibus deita ao longo do Z com `-PI/2`, que leva a porta (o `+Z` da
    // peça) para o `-X` do mundo — virada para a calçada, que é de onde a
    // dupla embarca.
    const onibus = w.add(w.place(bus(P.onibusAzul, 'Clube'), 39.5, 0, 13, -Math.PI / 2));
    w.blockBox(39.5, 13, 1.4, 4.5);

    // O abrigo abre para o `+Z` da peça; `+PI/2` põe essa boca virada para a
    // rua. O colisor pega só o fundo e o banco — a frente é vazada, e quem
    // espera precisa poder entrar embaixo do teto.
    const parada = w.add(w.place(busStop(), 35, 0, 13, Math.PI / 2));
    w.blockBox(34.3, 13, 0.4, 2.4);
    w.blockCircle(35.5, 15.65, 0.25); // o totem da parada

    const placaClube = w.add(w.place(textSign('Clube!', 0x4ec1a8), 34.4, 0, 8.6, Math.PI * 0.25));
    w.blockCircle(34.4, 8.6, 0.3);

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

    // A marca de onde o disco vai cair, enquanto a barra enche. Sem ela
    // "segure F" é adivinhação: não há como saber o que a barra vale em metros
    // de grama.
    const mira = marcaDeMira();
    mira.visible = false;
    mira.userData.mira = true; // é por aqui que o teste da força acha a marca
    w.root.add(mira);

    /**
     * Frisbee de dois, dentro da quadra.
     *
     * O disco só existe na mão enquanto você está na quadra — fora dela some, e
     * o parceiro volta a andar do seu lado. Dentro, ele se posiciona do lado
     * oposto e o lançamento é carregado: quanto mais tempo segurando F, mais
     * longe o disco vai. A mira é para onde você está olhando, então errar o
     * passe faz parte — ele corre atrás, agora com o disco ainda no ar.
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
    /** abaixo disto foi um toque, não uma carga: vira passe limpo */
    const CARGA_MINIMA = 0.12;
    /** distância do arremesso mais fraco possível */
    const DIST_MIN = 4;
    /** nenhum lançamento passa disto, nem com a barra cheia */
    const TETO = 22;
    /** meia-largura da faixa do passe perfeito, na escala da barra */
    const ZONA = 0.06;

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

    /**
     * Onde o disco deixa de existir.
     *
     * São os limites FINAIS: o `Frisbee` grampeia exatamente aqui, sem folga
     * própria. Tem que ser assim, senão a barra prometeria uma distância que a
     * grade não deixa cumprir — que era o bug. A escala antiga ia até 30 numa
     * quadra de 26, então de 60% de carga para cima todo arremesso morria no
     * mesmo alambrado e não havia força nenhuma para dosar.
     */
    const LIMITES_QUADRA = {
      minX: qx0 + 1.7,
      minZ: qz0 + 1.7,
      maxX: qx1 - 1.7,
      maxZ: qz1 - 1.7,
    };

    const limitar = (v: number, min: number, max: number): number =>
      Math.max(min, Math.min(max, v));

    /** diferença entre dois ângulos pelo caminho mais curto */
    const desvioAngular = (a: number, b: number): number =>
      Math.atan2(Math.sin(a - b), Math.cos(a - b));

    /**
     * Distância no chão, ignorando a altura.
     *
     * Quase toda medida aqui compara gente (y = 0) com o disco (y = 1 a 3), e
     * `distanceTo` somaria essa altura: o passe pareceria um metro maior do
     * que foi, e o recorde ficaria mentindo.
     */
    const noChao = (a: THREE.Vector3, b: THREE.Vector3): number =>
      Math.hypot(a.x - b.x, a.z - b.z);

    // ------------------------------------------------------- alvos da quadra
    /**
     * Aro ou cesta que vale ponto quando o disco passa por dentro.
     *
     * `recarga` faz dois papéis: é a comemoração (o aro girando) e a trava que
     * impede um voo lento de contar duas vezes no mesmo buraco.
     */
    interface Alvo {
      centro: THREE.Vector3;
      raio: number;
      pontos: number;
      /** a rosca que gira quando acerta */
      roda: THREE.Object3D | null;
      recarga: number;
    }

    const alvos: Alvo[] = [];

    const porAro = (
      x: number, z: number, altura: number, pontos: number, cor: number,
    ): void => {
      // o buraco do aro fica no Z local, então a meia-volta aponta ele para o
      // eixo em que a dupla troca passes
      const peca = w.add(w.place(aroDeFrisbee(cor, altura), x, 0, z, Math.PI / 2));
      w.blockCircle(x, z + 0.96, 0.36); // o poste
      w.blockCircle(x, z, 0.75); // e o vão: ninguém fica de pé dentro do aro
      alvos.push({
        centro: new THREE.Vector3(x, altura, z),
        raio: 0.58,
        pontos,
        roda: (peca.userData.aro as THREE.Object3D | undefined) ?? null,
        recarga: 0,
      });
    };

    // Os três ficam FORA da linha do meio, que é por onde os passes passam: um
    // alvo em cima da linha de passe seria acertado sem querer o tempo todo, e
    // ponto que cai sozinho não é ponto. Quanto mais alto, mais vale.
    porAro(13, -9.4, 1.9, 1, P.frisbee);
    porAro(23, 1.4, 2.1, 2, P.gold);
    porAro(18, -0.6, 2.5, 3, P.frisbee);

    /** distância do centro de um alvo ao trecho que o disco percorreu no quadro */
    const distanciaAoTrecho = (a: THREE.Vector3, b: THREE.Vector3, p: THREE.Vector3): number => {
      const abx = b.x - a.x;
      const aby = b.y - a.y;
      const abz = b.z - a.z;
      const len2 = abx * abx + aby * aby + abz * abz;
      if (len2 < 1e-8) return p.distanceTo(a);
      const s = limitar(
        ((p.x - a.x) * abx + (p.y - a.y) * aby + (p.z - a.z) * abz) / len2, 0, 1,
      );
      return Math.hypot(p.x - (a.x + abx * s), p.y - (a.y + aby * s), p.z - (a.z + abz * s));
    };

    /**
     * O teste é contra o TRECHO do quadro, não contra a posição.
     *
     * Num quadro ruim o disco anda 0,75 — mais que o buraco do aro — e um teste
     * de ponto simplesmente atravessaria o alvo sem ver.
     */
    const conferirAlvos = (de: THREE.Vector3, ate: THREE.Vector3): void => {
      for (const alvo of alvos) {
        if (alvo.recarga > 0) continue;
        if (distanciaAoTrecho(de, ate, alvo.centro) > alvo.raio) continue;
        alvo.recarga = 1.6;
        g.som('sino');
        g.bump('frisbee.alvos', alvo.pontos);
        g.toast(`+${alvo.pontos} no alvo!`, '🎯');
      }
    };

    const animarAlvos = (dt: number): void => {
      for (const alvo of alvos) {
        if (alvo.recarga <= 0) continue;
        alvo.recarga = Math.max(0, alvo.recarga - dt);
        if (alvo.roda) alvo.roda.rotation.z += dt * 9 * alvo.recarga;
      }
    };

    // --------------------------------------------------------- estado do jogo
    let fase: FaseDisco = 'fora';
    let esperaDele = 0;
    let carga = 0;
    let carregando = false;
    let trocasNaSessao = 0;
    let ultimoPosto: { x: number; z: number } | null = null;
    /** de onde saiu o último lançamento: é a régua do tamanho do passe */
    const saidaDoPasse = new THREE.Vector3();
    /** onde ele estava quando o disco saiu: mede o quanto teve que correr */
    const posDeleNoLancamento = new THREE.Vector3();
    /** o último lançamento saiu dentro da zona certa da barra */
    let passePerfeito = false;
    /** para onde ele corre para interceptar, e quanto falta para recalcular */
    let alvoDaCorrida: THREE.Vector3 | null = null;
    let recalcular = 0;
    /** o sorteio da pegada é UM por voo, senão ele tentaria de novo a cada quadro */
    let sorteado = false;
    let vaiPegar = true;
    /** giro do jogador no quadro anterior: é dele que sai a curva do disco */
    let olharAnterior = 0;

    /** uma fala curta no canto da tela; diálogo modal cortaria o jogo no meio */
    const falar = (linhas: string[]): void => {
      g.toast(linhas[Math.floor(Math.random() * linhas.length)], '💬');
    };

    /**
     * Até onde dá para jogar nesta direção sem bater na grade.
     *
     * É o que faz a barra medir a QUADRA e não um número inventado: 100% de
     * carga é sempre o último ponto útil daquele rumo.
     */
    const alcanceNaDirecao = (de: THREE.Vector3, ang: number): number => {
      const dx = Math.sin(ang);
      const dz = Math.cos(ang);
      const tx =
        dx > 0.001 ? (LIMITES_QUADRA.maxX - de.x) / dx
        : dx < -0.001 ? (LIMITES_QUADRA.minX - de.x) / dx
        : Infinity;
      const tz =
        dz > 0.001 ? (LIMITES_QUADRA.maxZ - de.z) / dz
        : dz < -0.001 ? (LIMITES_QUADRA.minZ - de.z) / dz
        : Infinity;
      return limitar(Math.min(tx, tz) - 1, DIST_MIN + 3, TETO);
    };

    const distDaCarga = (de: THREE.Vector3, ang: number, c: number): number =>
      DIST_MIN + (alcanceNaDirecao(de, ang) - DIST_MIN) * limitar(c, 0, 1);

    /** o inverso: que pedaço da barra cai a esta distância */
    const cargaParaDistancia = (de: THREE.Vector3, ang: number, dist: number): number => {
      const alcance = alcanceNaDirecao(de, ang);
      return limitar((dist - DIST_MIN) / Math.max(0.01, alcance - DIST_MIN), 0, 1);
    };

    /** quanta carga cai na mão dele; `null` quando ele está fora de alcance */
    const cargaDoParceiro = (
      de: THREE.Vector3, ang: number, ele: THREE.Vector3,
    ): number | null => {
      const c = cargaParaDistancia(de, ang, Math.hypot(ele.x - de.x, ele.z - de.z));
      return c > 0.02 && c < 0.99 ? c : null;
    };

    /**
     * Tapinha vira balão lento e fácil de agarrar; força total vira passe reto
     * e rasteiro. É o que dá jeito a cada arremesso sem pedir tecla nova.
     */
    const arcoDaCarga = (c: number): number => 1.35 - 0.45 * limitar(c, 0, 1);

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

      // a meta de verdade: dez SEGUIDAS, sem o disco encostar no chão
      if (trocasNaSessao >= 10 && !api.flag('memoria-frisbee-dez')) {
        api.setFlag('memoria-frisbee-dez');
        api.unlock({
          id: 'frisbee-dez',
          title: 'Dez sem deixar cair',
          place: 'Parque Villa Lobos',
          note: 'Dez trocas seguidas e nenhuma no chão. A gente parou porque deu fome, não porque errou.',
          icon: '🏆',
        });
      }
    };

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
      mira.visible = false;
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
          ? 'Segure F e solte no traço da barra'
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
      alvoDaCorrida = null;
    };

    /**
     * @param forca 0..1 da barra
     * @param curva aceleração lateral; sai do quanto o jogador estava girando
     * @param mirado só a carga solta na mão conta como passe perfeito — o toque
     * já sai na medida certa, então premiá-lo seria premiar não ter mirado
     */
    const lancar = (forca: number, curva = 0, mirado = true): void => {
      if (fase !== 'comigo') return;
      // guardado no fundo da mochila ele não voa: só o item da mão é lançável
      if (!naMinhaMao()) return;
      g.removeItem(ITENS.frisbee.id);
      const eu = g.playerPosition();
      const olhar = g.playerFacing();
      const c = limitar(forca, 0, 1);
      const alvo = cargaDoParceiro(eu, olhar, g.companionPosition());
      passePerfeito = mirado && alvo !== null && Math.abs(c - alvo) <= ZONA;
      saidaDoPasse.copy(eu);
      posDeleNoLancamento.copy(g.companionPosition());
      disco.throwAt(eu, olhar, distDaCarga(eu, olhar, c), arcoDaCarga(c), curva);
      g.som('lancar');
      sorteado = false;
      vaiPegar = true;
      alvoDaCorrida = null;
      recalcular = 0;
      fase = 'voando-pra-ele';
    };

    /** o toque no celular e o E são sempre o passe limpo: sem dosar, sem errar */
    const passeSimples = (): void => {
      const alvo = cargaDoParceiro(g.playerPosition(), g.playerFacing(), g.companionPosition());
      lancar(alvo ?? 0.5, 0, false);
    };

    const jogar = w.interact({
      id: 'parque:frisbee-jogar',
      x: QUADRA.x, z: QUADRA.z, radius: 3,
      priority: -1, // segue o jogador: nunca deve roubar o prompt de outra coisa
      label: 'Lançar o frisbee  (segure F)', icon: '🥏',
      onInteract: () => passeSimples(),
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

    w.onUpdate((dt, t) => {
      const trechoDe = disco.position.clone();
      disco.update(dt, LIMITES_QUADRA);

      const eu = g.playerPosition();
      const ele = g.companionPosition();
      const olhar = g.playerFacing();
      const dentro = naQuadra(eu.x, eu.z, 0.4);

      if (dentro && fase === 'fora') entrarNaQuadra();
      else if (!dentro && fase !== 'fora') sairDaQuadra();

      if (fase === 'fora') {
        jogar.enabled = false;
        pegar.enabled = false;
        mira.visible = false;
        olharAnterior = olhar;
        return;
      }

      if (disco.state === 'voando') conferirAlvos(trechoDe, disco.position);
      animarAlvos(dt);

      // ---------------------------------------------------------- a carga
      if (fase === 'comigo' && naMinhaMao()) {
        if (g.keyDown('KeyF')) {
          carregando = true;
          carga = Math.min(1, carga + dt / CARGA_CHEIA);
          g.showCharge(carga, cargaDoParceiro(eu, olhar, ele), ZONA);
          // a marca anda junto: é a tradução de "força" em metros de grama
          const d = distDaCarga(eu, olhar, carga);
          mira.position.set(eu.x + Math.sin(olhar) * d, 0, eu.z + Math.cos(olhar) * d);
          mira.scale.setScalar(1 + Math.sin(t * 9) * 0.06);
          mira.visible = true;
        } else if (carregando) {
          const forca = carga;
          // girar no instante de soltar manda o disco em banana; parado sai reto
          const giro = dt > 0.0001 ? desvioAngular(olhar, olharAnterior) / dt : 0;
          soltarCarga();
          if (forca < CARGA_MINIMA) passeSimples();
          else lancar(forca, limitar(giro * 0.18, -2.5, 2.5));
        }
      } else if (carregando) {
        soltarCarga();
      }
      olharAnterior = olhar;

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
          disco.holdAt(eu, olhar);
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
            // ele não joga sempre igual: às vezes solta um balão alto, às vezes
            // um passe reto, e de vez em quando põe caprichado demais e erra
            const sorte = Math.random();
            const arco = sorte < 0.3 ? RETORNO.arco * 1.35 : sorte > 0.85 ? 0.95 : RETORNO.arco;
            const erro = sorte > 0.85 ? RETORNO.erro * 2.5 : RETORNO.erro;
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
            // curva de leve no passe dele: dá vida sem tirar o disco da área de
            // pegada, que já tem o erro de mira e o desvio lateral somados
            disco.throwToward(ele, alvo, erro, arco, (Math.random() - 0.5) * 1.0);
            g.som('lancar');
            ultimoPosto = null; // ele volta a se postar assim que o disco for meu
            fase = 'voando-pra-mim';
          }
          break;
        }

        case 'voando-pra-ele': {
          // Ele corre atrás do disco ENQUANTO ele voa, mirando onde a física diz
          // que vai cair. Antes só reagia com o disco já no chão, e por isso
          // todo passe torto virava caminhada.
          recalcular -= dt;
          if (disco.state === 'voando' && recalcular <= 0) {
            recalcular = 0.25;
            const queda = disco.ondeVaiCair(LIMITES_QUADRA);
            if (!alvoDaCorrida || alvoDaCorrida.distanceTo(queda) > 0.8) {
              alvoDaCorrida = queda;
              g.commandCompanion(queda.x, queda.z);
              ultimoPosto = null;
            }
          }

          // o disco tem que ter SAÍDO antes de alguém agarrar. Sem isto, lançar
          // com o parceiro coladinho é ele pegar de volta no mesmo quadro.
          const perto =
            disco.state === 'voando' &&
            disco.position.y < 2.3 &&
            noChao(saidaDoPasse, disco.position) > 2 &&
            Math.hypot(disco.position.x - ele.x, disco.position.z - ele.z) < 1.5;

          if (perto && !sorteado) {
            // UM sorteio por voo. Passe na medida ele agarra quase sempre;
            // foguete torto, que chega rápido e longe do posto dele, escapa.
            sorteado = true;
            const correu = noChao(posDeleNoLancamento, disco.position);
            const chance = limitar(
              0.98 - disco.rasante * 0.022 - correu * 0.02 + (passePerfeito ? 0.2 : 0),
              0.35, 0.98,
            );
            vaiPegar = Math.random() < chance;
          }

          if (perto && vaiPegar) {
            g.som('pegar');
            g.holdCompanion(eu.x, eu.z);
            ultimoPosto = null;
            alvoDaCorrida = null;
            const passe = Math.round(noChao(saidaDoPasse, disco.position));
            disco.pickUp();
            esperaDele = 0.7;
            fase = 'com-ele';
            if (passePerfeito) {
              g.som('confirma');
              g.bump('frisbee.perfeitos');
              g.toast('Passe perfeito!', '🎯');
              falar(['Na mão! Perfeito.', 'Esse foi bonito, hein.', 'Assim fica fácil.']);
            } else {
              g.toast('Ele pegou no ar!', '🙌');
              falar(['Peguei!', 'Isso! Manda de novo.', 'Tá vendo? Sou bom nisso.']);
            }
            const recorde = g.stat('frisbee.maiorPasse');
            if (passe > recorde) {
              g.bump('frisbee.maiorPasse', passe - recorde);
              g.toast(`Novo recorde: ${passe} m`, '📏');
            }
            break;
          }

          if (disco.state === 'chao') {
            if (sorteado && !vaiPegar) {
              falar(['Ah, escapou!', 'Raspou na minha mão!', 'Essa eu deixei, admito.']);
            } else if (noChao(saidaDoPasse, disco.position) > 16) {
              falar([
                'Calma, não sou cachorro!',
                'Jogou pra longe demais.',
                'Vou ter que correr até lá?',
              ]);
            }
            trocasNaSessao = 0; // encostou no chão, a série morre
            if (disco.position.distanceTo(ele) < 1.6) {
              g.holdCompanion(eu.x, eu.z);
              ultimoPosto = null;
              alvoDaCorrida = null;
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
            alvoDaCorrida = null;
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
            trocasNaSessao = 0;
            if (disco.position.distanceTo(eu) < 1.9 && g.addItem(ITENS.frisbee) !== 'cheio') {
              disco.pickUp();
              fase = 'comigo';
              contarTroca(g, false);
            }
          }
          break;
        }

        case 'no-chao':
          // sem o addItem o jogo troca a fase pra 'comigo' e o disco some da
          // tela, mas o item nunca entra na mochila: nada pra lancar, nenhum
          // prompt, disco irrecuperavel ate sair e voltar da quadra
          if (disco.position.distanceTo(eu) < 1.2 && g.addItem(ITENS.frisbee) !== 'cheio') {
            disco.pickUp();
            fase = 'comigo';
            contarTroca(g, false);
          }
          break;
      }

      // carregando, o balão do E sai da tela: ele fica bem em cima do chão que
      // a marca de mira ocupa, e enquanto se mira ele não serve para nada
      jogar.enabled = fase === 'comigo' && !carregando;
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
          [R, 'Então segura o F. A marca no chão mostra onde o disco vai cair, e o traço na barra é onde eu estou.'],
          [A, 'E se eu quiser mostrar serviço?'],
          [R, 'Acerta um dos aros. Ou uma cesta, se estiver se achando.'],
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
        const perfeitos = api.stat('frisbee.perfeitos');
        const pontos = api.stat('frisbee.alvos');
        const maior = api.stat('frisbee.maiorPasse');
        const linhas: Array<[typeof A, string]> = [
          [A, recorde > 0 ? `Nosso recorde é ${recorde} trocas seguidas.` : 'O placar tá zerado.'],
          [R, total > 0 ? `E já foram ${total} no total. A gente não desiste fácil.` : 'Bora estrear isso então.'],
        ];
        if (maior > 0) linhas.push([A, `O passe mais longo que colou foi de ${maior} metros.`]);
        if (perfeitos > 0) {
          linhas.push([R, `${perfeitos} ${perfeitos === 1 ? 'passe caiu' : 'passes caíram'} certinho na minha mão.`]);
        }
        if (pontos > 0) linhas.push([A, `E ${pontos} ${pontos === 1 ? 'ponto' : 'pontos'} nos alvos. Anota aí.`]);
        return conversa(linhas);
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
      /**
       * QUEM ATENDE AGORA É O MANO, e a compra virou cena: o pedido, a fala
       * dele, a dancinha e só então as casquinhas.
       *
       * O JOGADOR FICA TRAVADO o tempo todo (`lockPlayer`), e a trava é
       * desfeita num `finally`: se qualquer `await` daqui de dentro estourar —
       * uma fala, o `wait` —, o jogo não pode ficar com a dupla congelada no
       * meio do parque para o resto da sessão.
       *
       * A DANÇA NÃO É ESPERADA COM PROMESSA. `mano.dancar(2,5)` só liga o
       * contador do bicho, e a cena espera o mesmo tempo com `api.wait`. São
       * dois relógios que andam juntos porque recebem o mesmo `dt`, e nenhum
       * dos dois segura o outro — se um dia a cena quiser continuar enquanto
       * ele dança, é só não esperar.
       */
      onInteract: async (api) => {
        api.lockPlayer(true);
        try {
          await conversa([
            [A, 'Dois, por favor.'],
            [R, 'Um de morango e um de maracujá.'],
            [A, 'Nunca pedimos diferente.'],
          ]);

          // ele vira para quem pediu antes de responder: atender de lado é o
          // que faz NPC parecer poste
          const eu = api.playerPosition();
          mano.group.rotation.y = Math.atan2(eu.x - mano.x, eu.z - mano.z);
          api.som('pinguim');
          await api.say(['Saindo um geladinho caprichado!'], 'Mano');

          mano.dancar(2.5);
          api.focusCamera(mano.group);
          api.setZoom(6.4);
          await api.wait(1.1);
          await api.say(['Ele tá dançando. Ele DANÇA.'], A);
          await api.wait(1.2);
          api.focusCamera(null);
          // 13 é o enquadramento com que a câmera nasce (`IsoCamera.viewSize`),
          // e é para ele que o parque tem que voltar: fechar num número
          // qualquer deixaria a cena inteira mais perto para sempre
          api.setZoom(13);

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
            note: 'Morango pro Ari, maracujá pro Renan, servidos por um pinguim de chapéu de casquinha que dança enquanto entrega.',
            icon: '🍦',
          });
        } finally {
          api.lockPlayer(false);
        }
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
      x: 8.9, z: -19, radius: 2.2,
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
