import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, ItemDef, SceneDef } from '../core/types';
import { FerrisWheel } from '../world/ferrisWheel';
import { Cookie } from '../entities/bichos/Cookie';
import { lojaDeRoupas } from '../world/lojaDeRoupas';
import { Frisbee } from '../entities/Frisbee';
import { MESA_PING, PingPong } from '../entities/PingPong';
import {
  aroDeFrisbee, bin, bleachers, bonecoDeNeve, bordaDeGelo, building, bus, busStop, bush,
  cestaDeBiscoitos, mesinhaDeXadrez,
  canteiro, capim, cloud, cone, cristalDeGelo, discBag, discGolfBasket, domoDeVidro, duck,
  fence, floodlight, flowers, iceCream, junco, kiosk, lamp, marcaDeMira, meioFio, mesaDeSorveteria,
  mesaPingPong, nenufar, picnicTable, posteDeGelo, raquete, skateShop,
  rock, scoreboard, signBoard, textSign, ticketBooth, tree, waterFountain, windsock,
  bolinhaPingPong,
} from '../world/props';
import { ARI, RENAN } from '../characters/cast';
import { ITENS } from '../world/itens';
import { asfalto, calcadaDePedrinha, gelo, tapeteDeGrama } from '../world/texturasDeChao';
import { Mano } from '../entities/bichos/Mano';
import { Estella } from '../entities/bichos/Estella';

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

    /*
     * Tapume e domo geodésico da praça da roda, como na foto.
     *
     * SÓ O DA ESQUERDA. O de `x = 11` passava rente ao fundo da bilheteria e
     * cortava a cabine ao meio na câmera de 34° — e é justamente por ali que
     * agora corre o corredor calçado até o campinho de frisbee. Do lado de lá
     * ele continua: é o que fecha a praça contra o mato.
     */
    w.add(w.place(fence(9, 1.2, P.metalWhite), -11, 0, -20, Math.PI / 2));
    w.blockBox(-11, -20, 0.2, 4.5);
    // a cúpula virou peça do kit: estrutura completa (meridianos, paralelos,
    // pilares por dentro) mora em props.ts, a cena só posiciona
    w.add(w.place(domoDeVidro(2.6), -9.5, 0, -21, 0.4));
    w.blockCircle(-9.5, -21, 2.7);

    /*
     * ===================================== A BILHETERIA, E O CORREDOR ATÉ ELA
     *
     * PARALELA À RODA: o aro gira no plano XY, então a roda é uma parede
     * virada para ±Z. A cabine sem giro nenhum (`rotY = 0`, fachada para +Z)
     * fica exatamente no mesmo alinhamento — as duas se olham do mesmo jeito, e
     * quem chega pelo caminho principal vê a fachada inteira em vez de uma
     * quina. Era o giro de −0,5 rad da versão de quiosque que quebrava isso.
     *
     * ONDE: `x = 10,6`, fora do disco de pedrinha da praça (raio 8) e fora do
     * caminho de quem vai para a roda. O tapume que passava aqui saiu.
     *
     * O CORREDOR é o vão entre a fachada dela (`z = −19,5`) e a borda do
     * campinho de frisbee (`z = −14`): 5,5 de passagem calçada, a mesma largura
     * do caminho principal do parque. Ele encosta na praça de um lado e no
     * campo do outro, então dá para ir da roda ao frisbee sem pisar na grama.
     */
    const BILHETERIA = { x: 10.6, z: -20.4 };
    w.patch(BILHETERIA.x, -16.9, 6.4, 6.6, P.concrete, 0, 0.014, calcadaDePedrinha());
    const bilheteria = w.add(w.place(ticketBooth(), BILHETERIA.x, 0, BILHETERIA.z));
    w.blockBox(BILHETERIA.x, BILHETERIA.z, 1.53, 1.08);

    /**
     * O COOKIE, o elefante da bilheteria.
     *
     * AO LADO DA CABINE, e nao na frente: a janela de atendimento fica em
     * `x = 9,6…11,6`, e ele tem 1,2 de largura — plantado na frente dela, ele
     * seria a bilheteria. Aqui ele fica encostado na parede lateral de `+X`,
     * fora do vao da janela e fora do corredor que leva ao campinho.
     *
     * A AREA E MENOR QUE O PASSO MINIMO do cerebro (0,7), entao por enquanto
     * ele fica no lugar — e a mesma coleira da Gina na portaria. A patrulha
     * dele entra depois, quando o Renan aprovar a conta da caminhada.
     */
    const COOKIE = { x: 13.5, z: -20.6 };
    /**
     * A PATRULHA: um vaivem curto pelo eixo Z, rente a parede lateral da
     * cabine. Pelo Z e nao pelo X porque o X passa na frente da janela de
     * atendimento (`9,6…11,6`), e ele tem 1,84 de largura com as orelhas.
     *
     * 2,4 de trecho a 0,42 de velocidade = 5,7 s por perna, mais a pausa da
     * ponta: um ciclo de uns 16 s.
     */
    const COOKIE_A = { x: COOKIE.x, z: -21.4 };
    const COOKIE_B = { x: COOKIE.x, z: -19.0 };
    const cookie = new Cookie({
      minX: COOKIE.x - 0.12, maxX: COOKIE.x + 0.12,
      minZ: COOKIE.z - 0.1, maxZ: COOKIE.z + 0.1,
    });
    cookie.group.rotation.y = 0;
    w.add(cookie.group);
    /*
     * ELE ANDA POR ORDEM DA CENA, e nao pelo passeio do cerebro. A area dele e
     * a coleira de sempre (menor que o passo minimo), entao o cerebro nunca
     * sorteia nada; quem manda e este laco.
     *
     * E o vaivem usa `seguir()`, e nao `irPara()`: `irPara` devolve uma
     * promessa por chamada, e interromper a caminhada para conversar deixaria
     * essa promessa pendurada para sempre — o laco travaria na primeira
     * conversa. `seguir` nao promete nada: chegar so limpa a missao.
     *
     * POR QUE NAO `Math.sin` NA POSICAO: o `x`/`z` sairia certo, mas o flag
     * `andando` (que e o que mexe as PERNAS) nasce dentro do cerebro. Escrito
     * de fora, o motor acha que ele esta parado e o Cookie desliza pelo chao
     * como estatua em trilho. E o retorno de 180° sairia em estalo, enquanto o
     * `passo()` da base ja interpola pelo lado curto — 0,45 s de meia-volta.
     */
    cookie.entrarEmServico();
    let cookieVaiPraFrente = true;
    let cookieEsperando = 0;
    let cookieConversando = false;
    w.onUpdate((dt, tempo) => {
      cookie.update(dt);
      pedirBilhete.moveTo(cookie.x, cookie.z);
      if (cookieConversando) return; // parado, olhando para quem chegou

      const alvo = cookieVaiPraFrente ? COOKIE_B : COOKIE_A;
      if (Math.hypot(alvo.x - cookie.x, alvo.z - cookie.z) < 0.12) {
        // a pausa da ponta varia com o relogio da cena: nao e sorteio (que
        // mexeria na sequencia semeada do mundo), mas tambem nao e metronomo
        if (cookieEsperando <= 0) cookieEsperando = 1.2 + (Math.sin(tempo * 0.7) + 1) * 0.6;
        cookieEsperando -= dt;
        if (cookieEsperando <= 0) {
          cookieVaiPraFrente = !cookieVaiPraFrente;
          cookieEsperando = 0;
        }
        return;
      }
      cookie.seguir(alvo.x, alvo.z, 0.42);
    });

    // ------------------------------------------- entorno da roda gigante
    // Tudo aqui é posicionado na mão de propósito: o espalhador de vegetação
    // (`livre()`, mais abaixo) proíbe 20 unidades em volta da roda, para não
    // nascer árvore no meio da praça. Sem isto a praça fica um prato de
    // concreto com a roda em cima.
    /*
     * OS DOIS DO LADO DA BILHETERIA SAÍRAM: (6,4; −13,6) e (8,6; −17,4).
     * Os dois pousavam na pedrinha, um na boca da praça e o outro bem na
     * frente do guichê — canteiro de 1 de raio COM COLISOR no meio da
     * passagem. Os dois do lado de lá ficam: aquele lado não tem cabine nem
     * corredor, e sem nenhum canteiro a praça vira um prato de concreto.
     */
    const canteirosPraca: Array<[number, number, number]> = [
      [-6.4, -13.6, 1.15], [-8.6, -17.4, 0.95],
    ];
    for (const [x, z, r] of canteirosPraca) {
      w.add(w.place(canteiro(r, undefined, w.rng()), x, 0, z, w.range(0, 6.28)));
      w.blockCircle(x, z, r + 0.1);
    }

    /*
    /*
     * O POSTE DE (12,2; −19) VIROU (7; −14,5): a 2,1 da bilheteria ele subia
     * bem no meio da fachada e cortava o letreiro em duas. E o que decide não é
     * a distância, é o DESVIO da diagonal da câmera — `(x − z)/√2`: em
     * (12,2; −19) ele desviava só 0,7 da bilheteria, ou seja, estava na linha
     * de visada dela. Daqui ele desvia 6,7, ilumina a boca do corredor, e a
     * fachada fica limpa.
     */
    for (const [x, z] of [[-7.6, -11.4], [7.6, -11.4], [-12.2, -19], [7, -14.5]] as const) {
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

    /* ================================================= A PRAÇA DE GELO
     *
     * O quiosque do Mano estava sozinho no meio do gramado. Agora ele é o
     * fundo de uma pracinha inteira: uma lâmina de gelo com borda de neve,
     * quatro mesinhas de guarda-sol de frente para o balcão, postes baixos nas
     * quinas e um boneco de neve no canto.
     *
     * O QUIOSQUE FOI PARA A PONTA DE -Z, encostado na borda de trás, e ficou
     * RETO (sem os 0,3 rad de giro que tinha). Duas razões: com a peça na
     * ponta a arena inteira sobra livre na frente dela, que é o que faz uma
     * praça ser praça; e com o piso alinhado aos eixos, um quiosque torto lê
     * como prédio caído — é a mesma lição que a loja de patins já tinha dado.
     *
     * ONDE ELA CABE: `x` de 7,2 a 20,4 e `z` de 14,8 a 26. Fica fora do banco
     * de (4,2; 14), da lixeira de (3,4; 17) e do poste de (4; 22) do lado de
     * -X; a 2 do gradil do portão (`z = 28`); e bem longe do alambrado do
     * campinho, que termina em `z = 5`.
     */
    const PRACA = { x: 13.8, z: 20.4, largura: 13.2, profundidade: 11.2 };
    /** o quiosque, na borda de trás da praça, de frente para a arena (+Z) */
    const SORVETERIA = { x: PRACA.x, z: 16.1 };

    /**
     * Retângulo de cantos redondos, montado com dois `patch` cruzados e quatro
     * `disc` nas quinas.
     *
     * Rinque não tem quina viva, e um retângulo seco no meio do gramado lê como
     * tapete jogado. São seis decalques por camada — e decalque nunca briga com
     * decalque, então empilhar as camadas não custa piscada nenhuma.
     */
    const lamina = (
      larg: number, prof: number, cor: number, altura: number, raio: number,
      textura?: THREE.Texture,
    ): void => {
      w.patch(PRACA.x, PRACA.z, larg, prof - raio * 2, cor, 0, altura, textura);
      w.patch(PRACA.x, PRACA.z, larg - raio * 2, prof, cor, 0, altura, textura);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          w.disc(
            PRACA.x + sx * (larg / 2 - raio), PRACA.z + sz * (prof / 2 - raio),
            raio, cor, altura, textura,
          );
        }
      }
    };

    /*
     * O CHÃO DE GELO É DECALQUE OPACO, e não caixa translúcida.
     *
     * A tentação era um palco baixo de material transparente. Duas coisas
     * matam a ideia: uma caixa com topo acima de zero enterra o pé de todo
     * mundo que pisa nela (o kit inteiro nasce com a base em `y = 0`), e um
     * chão translúcido deixa a GRAMA aparecer por baixo do rinque — verde por
     * dentro do gelo. O brilho vem da textura (`gelo()`, riscos de patim e véu
     * leitoso pintados em canvas), e o gelo com transparência de verdade mora
     * nas peças que têm volume: o cristal, o caco da borda, a haste do poste.
     *
     * Duas camadas: a neve pisada da beirada, e a lâmina por cima dela.
     */
    lamina(PRACA.largura + 1.5, PRACA.profundidade + 1.5, P.geloSombra, 0.006, 2.9, gelo());
    lamina(PRACA.largura, PRACA.profundidade, P.geloPiso, 0.01, 2.4, gelo());
    // os riscos de quem já patinou aqui: dois arcos que se cruzam, no meio da
    // arena. Anel pintado, e não dois discos — dois discos brigariam na borda
    w.ring(PRACA.x - 0.9, PRACA.z + 1.3, 2.4, 0.11, 0xf4fdff, 0.014);
    w.ring(PRACA.x + 1.4, PRACA.z + 0.3, 1.6, 0.09, 0xf4fdff, 0.016);

    /*
     * A BORDA: banco de neve baixo, com as quinas abertas.
     *
     * Ela contorna a praça inteira, quinas incluídas — as quinas são um pedaço
     * curto na diagonal, apoiado no meio do arco de 2,4 de raio. Sem eles a
     * borda vira quatro barras soltas no gelo em vez de uma beirada. Só a
     * FRENTE tem um vão de 3,6 no meio: a porta da praça, virada para quem
     * chega do portão do parque.
     *
     * A peça tem 23 cm e NÃO ganha colisor: é beira, não muro.
     */
    const bx = PRACA.largura / 2;
    const bz = PRACA.profundidade / 2;
    const RAIO_QUINA = 2.4;
    for (const lado of [-1, 1] as const) {
      w.add(w.place(bordaDeGelo(6), PRACA.x + lado * bx, 0, PRACA.z));
      w.add(w.place(bordaDeGelo(4), PRACA.x + lado * 3.5, 0, PRACA.z + bz, Math.PI / 2));
    }
    w.add(w.place(bordaDeGelo(8), PRACA.x, 0, PRACA.z - bz, Math.PI / 2));
    /*
     * As quinas. O centro do arco fica a `(larg/2 − raio; prof/2 − raio)` do
     * meio da praça, e o meio do arco, mais `raio × √½` na diagonal. A peça
     * nasce deitada ao longo do Z, então o giro que a alinha com a tangente é
     * 45° numa diagonal e 135° na outra — quem decide é o sinal do produto
     * `sx · sz`.
     */
    for (const sx of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        const cx = PRACA.x + sx * (bx - RAIO_QUINA + RAIO_QUINA * 0.707);
        const cz = PRACA.z + sz * (bz - RAIO_QUINA + RAIO_QUINA * 0.707);
        w.add(w.place(bordaDeGelo(2.6), cx, 0, cz, sx * sz > 0 ? Math.PI * 0.75 : Math.PI * 0.25));
      }
    }

    // balcão virado para +Z: assim quem compra fica na frente do quiosque na
    // tela, e não escondido atrás dele
    w.add(w.place(kiosk(P.sorveteriaRosa, { tipo: 'sorvete' }), SORVETERIA.x, 0, SORVETERIA.z));
    w.blockBox(SORVETERIA.x, SORVETERIA.z, 1.4, 0.95);

    /*
     * AS QUATRO MESINHAS, uma por quadrante da arena, todas olhando para o
     * balcão. Elas ficam a 3,5 e 7,5 do quiosque em Z: nenhuma cai em cima do
     * ponto de comprar (que fica a 2 do balcão) nem na linha entre ele e a
     * entrada da praça.
     *
     * A distância entre duas mesas vizinhas nunca é menor que 4, e cada uma
     * bloqueia 1 de raio — sobra vão de sobra para passar entre elas (o jogador
     * tem 0,42).
     */
    const MESAS: Array<[number, number, number]> = [
      // x, z, sabor da taça
      [9.9, 19.9, P.morango],
      [17.7, 19.7, P.maracuja],
      [11.2, 24.1, P.chocolate],
      [16.6, 23.8, P.limao],
    ];
    /**
     * As mesinhas ficam guardadas: é NELAS que a dupla senta, e o grupo de cada
     * uma é a âncora da cutscene. Sentar num objeto que já carrega posição e
     * giro dispensa qualquer conta de seno e cosseno na hora de acomodar os
     * dois — o padrão de cutscene do jogo inteiro.
     */
    const MESINHAS: THREE.Group[] = [];
    for (const [mx, mz, sabor] of MESAS) {
      const mesinha = mesaDeSorveteria(P.sorveteriaRosa, sabor);
      w.add(w.place(mesinha, mx, 0, mz, Math.atan2(SORVETERIA.x - mx, SORVETERIA.z - mz)));
      w.blockCircle(mx, mz, 1);
      MESINHAS.push(mesinha);
    }

    // os postes das quinas. Baixos (2,3) para não apagarem as mesinhas: cada
    // metro de poste esconde 1,5 de chão atrás dele nesta câmera
    for (const [px, pz] of [[8.4, 16.4], [19.2, 16.4], [8.6, 24.6]] as const) {
      w.add(w.place(posteDeGelo(), px, 0, pz));
      w.blockCircle(px, pz, 0.3);
    }

    /*
     * A quarta quina é do boneco de neve, e ele OLHA PARA O VÃO DA ENTRADA.
     *
     * Virado para o meio da praça ele ficava de costas para a câmera padrão
     * (que vem de +X/+Z) e ninguém via o rosto — sobrava um monte de neve com
     * cachecol. Olhando para a porta ele recebe quem chega, e o nariz de
     * cenoura e o chapéu de casquinha aparecem.
     */
    const BONECO = { x: 19.1, z: 24.4 };
    const ENTRADA = { x: PRACA.x, z: PRACA.z + PRACA.profundidade / 2 };
    w.add(w.place(
      bonecoDeNeve(1), BONECO.x, 0, BONECO.z,
      Math.atan2(ENTRADA.x - BONECO.x, ENTRADA.z - BONECO.z),
    ));
    w.blockCircle(BONECO.x, BONECO.z, 0.55);

    // Tufos de cristal: dois ladeando o quiosque, dentro do rinque, e dois na
    // neve pisada do lado de FORA da borda — cristal em cima da borda ficaria
    // atravessado nela.
    for (const [cx, cz, esc, sem] of [
      [11.4, 15.4, 1.15, 0.2], [16.3, 15.5, 0.95, 0.62],
      [6.8, 20.8, 1.05, 0.41], [21.0, 21.2, 1.2, 0.88],
    ] as const) {
      w.add(w.place(cristalDeGelo(esc, sem), cx, 0, cz, sem * 6.28));
      w.blockCircle(cx, cz, 0.45 * esc);
    }

    /* ---------------------------------------------------- O GELO ESCORREGA
     *
     * Dentro do rinque o chão deixa de agarrar: o empurrão do pé pega menos e
     * quase nada freia quem já está em movimento (ver `Player.derrapagem`).
     * Solte a tecla correndo e a dupla desliza sozinha por uns metros; faça a
     * curva e ela sai aberta, olhando para onde está indo.
     *
     * A CONTA É A DO RETÂNGULO DE CANTOS REDONDOS, a mesma forma que o piso
     * desenha: recua meia largura menos o raio em cada eixo, e o que sobra é
     * medido contra o raio da quina. Sem isso as quatro quinas escorregariam
     * fora do gelo, em cima da grama.
     *
     * E ENTRA INTERPOLADO. Ligar de um quadro para o outro dá um tranco na
     * borda do rinque — é a mesma lição da submersão na beira do lago. Com
     * `dt × 6` a passagem leva menos de dois décimos: o tempo de um passo, e
     * curto o bastante para quem entra correndo já entrar escorregando.
     */
    const noGelo = (x: number, z: number): boolean => {
      const dx = Math.max(0, Math.abs(x - PRACA.x) - (bx - RAIO_QUINA));
      const dz = Math.max(0, Math.abs(z - PRACA.z) - (bz - RAIO_QUINA));
      return (
        Math.abs(x - PRACA.x) <= bx && Math.abs(z - PRACA.z) <= bz &&
        dx * dx + dz * dz <= RAIO_QUINA * RAIO_QUINA
      );
    };
    /**
     * DE PATINS O GELO VIRA PISTA.
     *
     * Quem entra no rinque a pé escorrega e pronto: o pé patina no lugar e nada
     * freia. Com os patins da lojinha calçados, a lâmina crava de lado — a
     * aceleração volta quase toda, o freio existe e o teto de velocidade sobe
     * mais um quarto (ver `Player.derrapagem` e a `lamina` que mora lá).
     * Nenhuma linha disso está aqui: a cena só diz ONDE tem gelo, e quem calça
     * o patins é o inventário. Esta parte é só a primeira vez, que merece uma
     * fala.
     */
    const dePatins = (): boolean => g.wearables().some((i) => i?.id === ITENS.patins.id);
    let escorregando = 0;
    let ultimoNoGelo: THREE.Vector3 | null = null;
    /**
     * A velocidade da dupla no quadro, publicada para quem vier depois.
     *
     * O motor não publica velocidade e não precisa publicar: aqui ela sai da
     * posição de um quadro para o outro. Quem também lê isto é a reação do
     * Mano, mais abaixo — e ela pode ler porque este `onUpdate` foi registrado
     * ANTES, e os `onUpdate` rodam na ordem em que a cena os criou.
     */
    let velocidadeNoGelo = 0;
    /** uma cutscene do gelo por vez: a primeira volta e o grito do Mano */
    let cenaDoGelo = false;

    w.onUpdate((dt) => {
      const onde = g.playerPosition();
      const alvo = noGelo(onde.x, onde.z) ? 1 : 0;
      escorregando += (alvo - escorregando) * Math.min(1, dt * 6);
      g.setEscorregadio(escorregando);

      velocidadeNoGelo = ultimoNoGelo && dt > 0
        ? Math.hypot(onde.x - ultimoNoGelo.x, onde.z - ultimoNoGelo.z) / dt
        : 0;
      ultimoNoGelo = onde.clone();

      if (cenaDoGelo || g.flag('patinou-no-gelo')) return;
      if (escorregando < 0.75 || !dePatins() || velocidadeNoGelo < 3.2) return;
      /**
       * A PRIMEIRA VOLTA DE PATINS NO GELO, uma vez só na vida do save.
       *
       * A trava é ligada ANTES do `await`: sem ela, os quadros que rodam
       * enquanto a primeira fala aparece entrariam aqui de novo e a conversa
       * começaria três vezes por cima de si mesma.
       */
      cenaDoGelo = true;
      void (async () => {
        g.setFlag('patinou-no-gelo');
        g.lockPlayer(true);
        await conversa([
          [R, 'Ó, no gelo o patins pega!'],
          [A, 'PEGA MESMO. Olha eu indo.'],
          [R, 'Vai devagar que eu vou atrás.'],
        ]);
        g.lockPlayer(false);
        g.unlock({
          id: 'patinar-no-gelo',
          title: 'Patinando no gelo',
          place: 'Parque Villa Lobos',
          note: 'Os patins da lojinha viraram outra coisa quando pisaram no rinque do Mano: no gelo a lâmina crava e dá para correr de verdade. Descalço ali só dá para escorregar.',
          icon: '⛸️',
        });
        cenaDoGelo = false;
      })();
    });

    /**
     * A placa da pista, ao lado do vão da borda — do lado de FORA da praça, na
     * neve pisada, para não virar obstáculo no meio da porta.
     */
    w.add(w.place(textSign('Pista de gelo', P.geloFundo), 11.4, 0, 26.7, 0.2));
    w.blockCircle(11.4, 26.7, 0.3);

    /**
     * O MANO, o pinguim sorveteiro — o primeiro bicho do parque.
     *
     * ONDE ELE FICA: na frente do balcão, do lado direito. Com o quiosque reto
     * na borda da praça, a normal da frente dele é `(0; 1)`; ele fica a 1,7 por
     * essa normal, bem fora do colisor (0,95 de meia profundidade), e desviado
     * 0,9 para `+X` para não ficar na linha entre o jogador e o balcão.
     *
     * A PRIMEIRA POSIÇÃO ERA COLADA DEMAIS (`13,0; 19,75`): dali o pilar da
     * direita do quiosque cortava metade dele no zoom de jogo. Um bicho de
     * posto tem que aparecer INTEIRO do lugar de onde se compra.
     *
     * ELE OLHA PARA O MESMO LADO QUE O BALCÃO (`rotation.y = 0`), que é para
     * `+Z` — de onde a câmera olha e de onde o cliente chega. De costas para o
     * quiosque e de frente para quem compra, como todo sorveteiro.
     *
     * A ÁREA É MENOR QUE O PASSO MÍNIMO do cérebro (0,7), então ele não sai do
     * posto: é a mesma coleira da Gina na portaria, e nenhuma linha de cérebro
     * mudou por causa disso.
     */
    const MANO = { x: SORVETERIA.x + 0.9, z: SORVETERIA.z + 1.7 };
    const mano = new Mano({
      minX: MANO.x - 0.12, maxX: MANO.x + 0.12,
      minZ: MANO.z - 0.1, maxZ: MANO.z + 0.1,
    });
    mano.group.rotation.y = 0;
    w.add(mano.group);
    mano.aoSoar = () => g.som('pinguim');

    /**
     * O POSTO DE CIMA — onde o Mano fica enquanto a dupla está na roda gigante.
     *
     * Uma das falas lá de cima é sobre ele ("olha o Mano lá embaixo"), e do
     * alto da roda ele estava ATRÁS do quiosque: a roda fica em (0; −26) e o
     * quiosque na borda da praça de gelo, então quem olha de lá vê o telhado, e
     * o Mano — que atende pela FRENTE — some por trás dele.
     *
     * Este ponto é o LADO do quiosque: 2,8 pelo eixo lateral dele, que com a
     * peça reta é o `+X` puro. A visada da roda sobe quase pelo Z (a razão
     * `x/z` da linha até aqui é 0,4), então esses 2,8 são quase todos
     * PERPENDICULARES a ela: sobram uns 2,6 fora da silhueta do quiosque,
     * folga de sobra sobre a meia-largura de 1,4. E o caminho até lá passa
     * raspando POR FORA do colisor, sem atravessar a peça.
     *
     * E ele fica OLHANDO PARA A RODA: se a fala é sobre ele, que ele esteja
     * olhando de volta.
     */
    const MANO_DE_LADO = { x: SORVETERIA.x + 2.8, z: SORVETERIA.z };
    const OLHANDO_A_RODA = Math.atan2(-MANO_DE_LADO.x, -26 - MANO_DE_LADO.z);

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
     * "Comprar sorvete" (2 na frente do balcão), o carinho roubava o prompt de quem só
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
      /**
       * O RÓTULO NÃO PODE PROMETER O QUE ELE NÃO VAI DAR. Com sorvete na mão
       * ele não vende outro, então o prompt deixa de dizer "pedir sorvete" e
       * passa a dizer "falar" — a pessoa aperta E sabendo o que vai acontecer.
       */
      const conversando = aindaTemSorvete();
      pedirSorvete.label = conversando ? 'Falar com o Mano' : 'Pedir sorvete pro Mano';
      pedirSorvete.icon = conversando ? '🐧' : '🍦';
    });

    /* ============================ O MANO REAGE A QUEM PASSA PATINANDO
     *
     * Ele trabalha ali porque gosta do friozinho; ver a dupla cruzando o
     * rinque de patins na frente do balcão é a melhor coisa do dia dele. Então
     * ele VIRA para acompanhar, bate as asas e grita.
     *
     * O GRITO É TOAST, e não diálogo: quem está patinando a 7 por segundo não
     * pode ser parado por um balão a cada volta — em três voltas a mecânica que
     * o Renan pediu viraria uma sala de espera. A ÚNICA vez em que ele para a
     * dupla de verdade é a primeira, que é quando há o que dizer.
     *
     * E ele volta a olhar para a frente depois. Sem isso o pinguim fica torto
     * para sempre, encarando um ponto onde já não tem ninguém.
     */
    const GRITOS_DO_MANO = [
      'Isso! Mais uma volta!',
      'Curva bonita, hein!',
      'Devagar na quina! Devagar!',
      'Eu não patino: eu escorrego. É diferente.',
      'Vai, vai, vai!',
      'Se cair, cai rindo!',
    ];
    /**
     * Quanto falta para ele poder gritar de novo, e quanto falta para desvirar.
     *
     * SEIS SEGUNDOS E MEIO entre um grito e outro: é o tempo de uma volta no
     * rinque. Menos que isso e ele vira alarme — a mesma razão pela qual o
     * barulho espontâneo dos bichos é espaçado.
     */
    let esperaDoGrito = 0;
    let olhandoAte = 0;

    w.onUpdate((dt) => {
      if (esperaDoGrito > 0) esperaDoGrito -= dt;
      if (olhandoAte > 0) {
        olhandoAte -= dt;
        // de volta ao balcão: o posto dele olha para +Z, que é de onde o
        // cliente chega
        if (olhandoAte <= 0) mano.group.rotation.y = 0;
      }

      if (cenaDoGelo || esperaDoGrito > 0) return;
      if (escorregando < 0.7 || !dePatins() || velocidadeNoGelo < 3.2) return;
      const onde = g.playerPosition();
      // 5,5 é o alcance de um grito de balcão: passar pelo outro lado do
      // rinque (13 de largura) não puxa reação nenhuma
      if (Math.hypot(onde.x - mano.x, onde.z - mano.z) > 5.5) return;

      esperaDoGrito = 6.5;
      olhandoAte = 2.8;
      mano.group.rotation.y = Math.atan2(onde.x - mano.x, onde.z - mano.z);
      mano.dancar(1.1);
      g.som('pinguim');

      /**
       * A PRIMEIRA VEZ ELE PARA A DUPLA — e só depois que a primeira volta já
       * aconteceu (`patinou-no-gelo`). As duas cenas moram no mesmo rinque e
       * disparam com a mesma condição; sem esta ordem elas se atropelariam na
       * mesma passada, uma conversa por cima da outra.
       */
      if (!g.flag('mano-viu-patinar') && g.flag('patinou-no-gelo')) {
        cenaDoGelo = true;
        void (async () => {
          g.setFlag('mano-viu-patinar');
          g.lockPlayer(true);
          await g.say(['VOCÊS PATINAM!'], 'Mano');
          await conversa([
            [A, 'A gente alugou na lojinha ali.'],
            [R, 'No gelo eles pegam de verdade.'],
          ]);
          await g.say([
            'Eu tenho pé de pato. Eu escorrego, que não é a mesma coisa.',
            'Mas eu fico olhando. É o melhor dia quando tem gente patinando aqui.',
          ], 'Mano');
          mano.dancar(2.2);
          await conversa([[A, 'Depois a gente te ensina.']]);
          await g.say(['EU VOU QUERER.'], 'Mano');
          g.lockPlayer(false);
          cenaDoGelo = false;
        })();
        return;
      }

      g.toast(`Mano: ${w.pick(GRITOS_DO_MANO)}`, '🐧');
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

    /**
     * ============================ A LOJINHA DE ROUPAS (o "mini shopping")
     *
     * ONDE: a ponta oeste do parque, de costas para o rio. A faixa
     * `x −48…−28 · z −30…−6` foi MEDIDA — varrendo as peças da cena, ali só
     * existiam árvores do espalhador (e uma nuvem, a 66 de altura).
     *
     * ELA É A ÚNICA PEÇA DO JOGO COM A FACHADA EM `+X`, e é de propósito. A
     * convenção do repositório é fachada para `+Z` porque a câmera vem da
     * diagonal `+X/+Z` — mas quem decide se uma fachada aparece é o produto
     * escalar com essa diagonal, e ele dá 0,707 tanto para `+Z` quanto para
     * `+X`: as duas são vistas de meio perfil, do mesmo jeito. O que manda aqui
     * é o mundo: o rio corre ao longo do `Z`, então uma loja PARALELA AO RIO
     * tem as costas em `−X` (a água) e a porta em `+X` (o resto do parque).
     *
     * A CONTA DA CÂMERA fica até mais folgada que na esquina da rua: 8,2 de
     * altura escondem 12,2 de chão na diagonal, e a partir daqui essa faixa
     * cega cai em `(−48,6; −13,6)` — fora do mundo caminhável, que termina em
     * `x = −44`. Não há nada atrás dela para esconder.
     *
     * A FOLGA ATÉ A PISTA decidiu as DUAS coordenadas:
     *
     *  - o `x`, porque o oval de patins chega a `x = −31` e o prédio (que
     *    avança 5,2 pela frente a partir do centro) para em `−34,8`: sobram
     *    3,8 de calçada entre a vitrine e o asfalto — espaço para a dupla
     *    parar na frente e para a ovelha ficar no posto;
     *  - o `z`, que saiu de `−5` para `−16,5`. Em `−5` a loja ficava bem de
     *    frente para a pista, e não havia meio-termo: ela tem 11,6 de
     *    comprimento e a pista ocupa `z −10…0`, então qualquer deslocamento
     *    menor que onze deixaria metade dela ainda na frente. Daqui a ponta
     *    dela para em `−10,7`, com 70 cm de folga da boca da pista.
     */
    const LOJINHA = { x: -40, z: -16.5 };
    w.add(w.place(lojaDeRoupas(), LOJINHA.x, 0, LOJINHA.z, Math.PI / 2));
    /*
     * O COLISOR DO PRÉDIO PARA NA LINHA DOS VASOS, e não um metro antes dela.
     *
     * Medido na peça: a parede da vitrine está em `x = −34,8` e os vasos da
     * calçada avançam até `−35,45`; o capacho (4 cm de altura) é o único que
     * passa disso, e capacho não barra ninguém. A caixa ia até `−35,8`, o que
     * deixava a dupla parada meio metro antes dos vasos, olhando a vitrine de
     * longe sem nada no caminho. Agora a frente do colisor é a própria linha dos
     * vasos: dá para encostar na vitrine, e não dá para atravessar um vaso de
     * 1,3 de altura.
     *
     * Os fundos continuam em `−44,3`, que é onde a parede de trás encosta no
     * barranco do rio: centro em `−39,87` com meia-profundidade de 4,43.
     */
    w.blockBox(-39.87, LOJINHA.z, 5.7, 4.43, Math.PI / 2);
    /*
     * A CALÇADA CORRE NA FRENTE, ao longo do `Z` como a loja: da esquina do
     * prédio até a beira da pista. É por ela que se chega — quem vem do parque
     * contorna a pista de patins e sai de frente para a vitrine.
     */
    w.patch(-33.2, -15, 4.4, 16, P.concrete, 0, 0.015, calcadaDePedrinha());

    /**
     * ---------------------------------- A ESTELLA, A OVELHA QUE CUIDA DA LOJA
     *
     * O nome e o jeito sao do Renan: ela tem MUITO orgulho das roupinhas que
     * cria, e e obcecada por elas — nenhum modelo sai da loja sem passar pela
     * aprovacao dela. E ela adora dar brinde em docinho: foi ela que fez o
     * uniforme de bilheteiro do Cookie, e no dia da entrega deu um biscoitinho
     * pra ele. Ele amou.
     *
     * ONDE ELA FICA saiu de uma conta que ja estava escrita no predio: o toldo
     * avanca 1,05 da fachada, e a camera de 34° faz cada peca esconder 1,5 vez
     * a propria altura de chao atras dela — quem ficar debaixo do toldo aparece
     * decapitado. A fachada esta em `x = −34,8`, entao qualquer coisa a mais de
     * 2 dali aparece inteira. Ela esta a 2,2, na calcada (que vai de −35,4 a
     * −31), bem na frente da porta.
     *
     * ELA OLHA PARA `+X`, que e para o resto do parque: de costas para a
     * vitrine e de frente para quem chega, como toda lojista de porta de loja.
     *
     * A AREA E MENOR QUE O PASSO MINIMO do cerebro (0,7), e e so isso que a
     * segura no posto — a mesma coleira da Gina na portaria e do Mano no
     * quiosque. Nenhuma linha de cerebro mudou por causa dela.
     */
    const ESTELLA = { x: -32.6, z: -16.5 };
    const estella = new Estella({
      minX: ESTELLA.x - 0.12, maxX: ESTELLA.x + 0.12,
      minZ: ESTELLA.z - 0.12, maxZ: ESTELLA.z + 0.12,
    });
    estella.group.rotation.y = Math.PI / 2;
    w.add(estella.group);
    estella.aoSoar = () => g.som('balido');

    /*
     * A CESTA DE BISCOITO FICA DO LADO DELA, e ela existe para o brinde nao sair
     * do nada: quando a Estella entrega um biscoitinho, ele vem de um lugar que
     * ja estava ali na tela. Ela vai no `+Z` (o lado da camera) e um pouco a
     * frente, fora da sombra do toldo pela mesma conta que vale para a ovelha.
     */
    const CESTA = { x: ESTELLA.x + 0.25, z: ESTELLA.z + 1.05 };
    w.add(w.place(cestaDeBiscoitos(), CESTA.x, 0, CESTA.z, 0.3));
    // e o caixote da cesta tinha o problema CONTRARIO do tabuleiro: um caixote
    // de 46 cm no meio da calcada que a dupla atravessava como fantasma
    w.blockCircle(CESTA.x, CESTA.z, 0.34);

    /*
     * A MESINHA DE XADREZ, a outra paixao dela (o Renan contou depois): fica na
     * calcada, do lado de la da ovelha, com uma partida no meio esperando
     * adversario. Ela vai a 2,2 dela pelo `−Z`, longe o bastante para nao
     * roubar o prompt de falar (raio 1,3) e perto o bastante para ler como
     * "aquilo ali e dela".
     *
     * E ela e BAIXA (0,66 no tampo): pela conta da camera esconde 1,5 × 0,66 ≈
     * 1 de chao atras de si, e a ovelha esta no `+Z` dela — na frente, do lado
     * da camera. Mesinha nenhuma tapa costureira nenhuma.
     */
    const XADREZ = { x: ESTELLA.x - 0.15, z: ESTELLA.z - 2.2 };
    w.add(w.place(mesinhaDeXadrez(), XADREZ.x, 0, XADREZ.z, -0.35));
    /**
     * O COLISOR É UM CÍRCULO, do tamanho da mesa — o mesmo que as mesinhas da
     * praça de gelo usam.
     *
     * Ele nasceu como `blockBox(…, 1.7, 1.0, …)`, e isso era um MURO INVISÍVEL:
     * o `blockBox` recebe MEIA largura e MEIA profundidade, então aquilo era uma
     * caixa de 3,4 × 2,0 para uma mesa de 0,84 de diâmetro. A calçada aqui tem
     * 4,4 de largura e a caixa atravessava quase toda ela — dava para ver a
     * mesinha e não dava para passar do lado dela, que é justamente onde a dupla
     * para para jogar. O Renan esbarrou nisso na primeira partida.
     *
     * 0,95 de raio cobre o tampo (0,42) e os dois banquinhos, que chegam a 0,81
     * do centro. Sobram 1,3 de passagem para o lado da rua e 1,7 para o lado da
     * vitrine: a dupla circula a mesa inteira sem esbarrar em nada que não veja.
     */
    w.blockCircle(XADREZ.x, XADREZ.z, 0.95);

    const E = 'Estella';
    /*
     * O QUE ELA FALA depois de apresentada, e sao as duas obsessoes dela: a
     * roupa que ela mesma fez e o docinho. Nada aqui promete a loja aberta —
     * entrar para comprar e o proximo pedaco.
     */
    const FALAS_DA_ESTELLA = [
      'Essa costura aqui? Minha. Ponto por ponto.',
      'Nada sai desta porta sem eu aprovar. Nada.',
      'Deixa eu ver essa manga... hm. Podia subir dois dedos.',
      'Come um biscoitinho. Come, vai.',
      'Eu meço vocês dois de olho fechado, viu.',
      'Roupa boa é roupa que a pessoa esquece que tá usando.',
      'Tá vendo aquele tabuleiro? Tá esperando vocês.',
      'Eu jogo de brancas, mas dou as pretas pra vocês. Sou boa demais.',
      'Costura e xadrez é a mesma coisa: é ver o final antes de começar.',
    ];
    const falarComEstella = w.interact({
      id: 'parque:estella',
      x: estella.x, z: estella.z, radius: 1.3,
      label: 'Falar com a Estella', icon: '🐑',
      highlight: estella.group,
      onInteract: async (api) => {
        const eu = api.playerPosition();
        estella.encarar(eu.x, eu.z);
        estella.receberCarinho();
        api.som('balido');
        if (!api.flag('estella-conhecida')) {
          api.setFlag('estella-conhecida');
          await conversa([
            [R, 'Tem uma ovelha de óculos na porta da loja.'],
            [E, 'Tem uma COSTUREIRA de óculos na porta da loja dela. Estella.'],
            [A, 'Oi, Estella.'],
            [E, 'Oi, meus amores. Vocês repararam na vitrine? Repararam?'],
            [E, 'Eu que fiz. Tudo. Cada bainha daquilo passou por aqui ó, por este olho.'],
            [R, 'A senhora faz roupa pro parque inteiro?'],
            [E, 'Faço. E nada sai daquela porta sem eu aprovar. NADA.'],
          ]);
          /*
           * O UNIFORME DO COOKIE E DELA, e e por isso que a manta, o quepe e o
           * cracha dele saem nas cores da bilheteria: quem costurou foi ela.
           * Esta fala e a costura entre as duas fichas.
           */
          await conversa([
            [E, 'Viu o elefante da bilheteria? A mantinha dele, o quepe, o crachá.'],
            [A, 'O Cookie.'],
            [E, 'O Cookie. Aquilo é meu. Provei três vezes na orelha dele até cair certo.'],
            [E, 'E quando ficou pronto eu dei um biscoitinho pra ele. Ele quase chorou.'],
            [R, 'Biscoitinho?'],
          ]);
          /*
           * E ELA JA DA O BRINDE. Um para cada — a mesma regra dos sorvetes do
           * Mano: o que decide nao e o sabor, e de quem e a mao.
           */
          estella.oferecerBiscoito(4);
          api.addItem(ITENS.biscoitoDaEstella, ARI.id);
          api.addItem(ITENS.biscoitoDaEstella, RENAN.id);
          api.som('sorvete');
          api.toast('Biscoitinho da Estella', '🍪');
          await conversa([
            [E, 'Biscoitinho. Toma, um pra cada. Ninguém sai da minha porta de mão vazia.'],
            [A, 'Obrigado, Estella.'],
            [E, 'Voltem quando eu abrir. Vou vestir vocês dois de cima a baixo.'],
          ]);
          /*
           * E O TABULEIRO. Ela mesma aponta para a mesinha que ja estava ali na
           * calcada — o objeto veio primeiro, a fala explica.
           */
          await conversa([
            [R, 'A senhora tem um tabuleiro de xadrez montado ali fora.'],
            [E, 'Tenho. Montado e no meio de uma partida, que é como eu gosto.'],
            [E, 'Ninguém aqui joga comigo. O elefante é grande demais pra cadeirinha, o pinguim derruba as peças.'],
            [A, 'A gente joga.'],
            [E, 'AH. Vocês jogam?'],
            [E, 'Então guarda esse biscoito pra depois da partida. Eu volto pra esse tabuleiro todo dia.'],
          ]);
          api.unlock({
            id: 'estella-da-lojinha',
            title: 'A Estella',
            place: 'Parque Villa Lobos',
            note: 'A ovelha costureira da lojinha de roupas do parque: óculos de meia-lua, fita métrica no pescoço e alfinete espetado na lã. Tem orgulho de cada costura que faz — nada sai da loja sem a aprovação dela — e não deixa ninguém ir embora sem um biscoitinho. O uniforme do Cookie é dela. E ela ama xadrez: tem um tabuleiro montado na calçada, sempre no meio de uma partida, esperando alguém sentar.',
            icon: '🐑',
          });
          return;
        }
        /*
         * DEPOIS DE APRESENTADA, FALAR COM ELA E TAMBEM CONVIDAR PARA JOGAR.
         *
         * O tabuleiro tem o ponto dele na calcada, mas quem chega perto da
         * ovelha e nao repara na mesinha ficaria sem saber que da para jogar —
         * e a partida e a coisa mais legal que ela tem. Duas portas para a
         * mesma mesa.
         */
        const escolha = await api.ask('Falar com ela', ['Jogar xadrez', 'Só um oi'], E);
        if (escolha === 0) {
          await partidaDeXadrez(api);
          return;
        }
        await api.say([w.pick(FALAS_DA_ESTELLA)], E);
      },
    });

    /**
     * ============================== A PARTIDA DE XADREZ CONTRA A ESTELLA
     *
     * A cena nao sabe uma regra de xadrez, e a tela tambem nao: as duas so
     * perguntam ao motor (`entities/ChessEngine.ts`, que embrulha a `chess.js`).
     * O que mora aqui e o que e DELA — as falas, a cor com que ela joga, o que
     * acontece depois do mate.
     *
     * A DUPLA JOGA DE BRANCAS porque quem comeca ataca, e porque e ela mesma
     * quem oferece isso na fala ("dou as pretas pra vocês, sou boa demais").
     *
     * O `lockPlayer` some com o joystick enquanto a mesa esta aberta, e o
     * `finally` devolve o controle aconteca o que acontecer — desistir no
     * Escape, mate em quatro lances ou fechar no meio. Cutscene que trava e
     * esquece de soltar e o pior defeito possivel.
     */
    const provocacoesDaEstella = [
      'Meu cavalo já previu seus próximos 3 movimentos.',
      'Você vai entregar seu bispo assim de bandeja? Bééé...',
      'Eu jogo isso desde antes de você nascer. E eu tenho quatro anos.',
      'Hmm. Interessante. Errado, mas interessante.',
      'Já vi essa abertura. Terminou mal pra quem jogou.',
      'Pensa com calma. Eu tenho o dia todo, meu amor.',
    ];
    let partidasGanhas = 0;

    const partidaDeXadrez = async (api: GameAPI): Promise<void> => {
      estella.encarar(api.playerPosition().x, api.playerPosition().z);
      await api.say(['Bééé... acha que tem raciocínio rápido suficiente para me vencer?'], E);
      api.lockPlayer(true);
      try {
        /*
         * A SEMENTE MUDA A CADA PARTIDA (`lancesFeitos` de nada adianta aqui —
         * o motor e novo). Sem isso ela repetiria a mesma partida inteira toda
         * vez que a dupla sentasse, e a segunda partida seria um replay.
         */
        const motor = api.motorDeXadrez('brancas', 20260908 + partidasGanhas * 7919 + Math.floor(Date.now() / 1000) % 100000);
        const fim = await api.abrirXadrez(motor, {
          nome: 'Estella',
          avatar: '🐑',
          provocacoes: provocacoesDaEstella,
          ganhou: 'Xeque-mate, meu amor. Eu avisei. Bééé.',
          perdeu: 'Não. NÃO. Isso não aconteceu. Joga de novo.',
          empatou: 'Empate. Empate é o xadrez dizendo que vocês dois têm razão.',
        });
        estella.receberCarinho();
        if (fim === 'ganhei') {
          partidasGanhas++;
          await conversa([
            [E, 'Eu... você... QUE?'],
            [A, 'A gente ganhou.'],
            [E, 'Ganharam. Ganharam mesmo. Ninguém nunca me ganhou.'],
            [E, 'Toma outro biscoitinho. Você merece. Os dois merecem.'],
          ]);
          api.addItem(ITENS.biscoitoDaEstella, ARI.id);
          api.addItem(ITENS.biscoitoDaEstella, RENAN.id);
          api.som('sorvete');
          api.toast('Biscoitinho da Estella', '🍪');
          api.unlock({
            id: 'xadrez-com-a-estella',
            title: 'A partida com a Estella',
            place: 'Parque Villa Lobos',
            note: 'A ovelha da lojinha se acha a maior mestra de xadrez do parque, e passou a partida inteira dizendo que o cavalo dela já tinha previsto tudo. A gente ganhou dela. Ela ficou uns três segundos sem falar, e depois deu biscoitinho pros dois.',
            icon: '♟️',
          });
        } else if (fim === 'perdi') {
          await conversa([
            [E, 'Não fica assim. Perder pra mim não é vergonha nenhuma.'],
            [R, 'Ela é boa mesmo.'],
            [E, 'Eu sou ÓTIMA. Senta aí de novo quando quiser.'],
          ]);
        } else if (fim === 'empate') {
          await api.say(['Empate. Isso quer dizer que vocês quase me ganharam. QUASE.'], E);
        } else {
          await api.say(['Ah, desiste não... o tabuleiro fica aqui, viu.'], E);
        }
      } finally {
        api.lockPlayer(false);
      }
    };

    /*
     * O PONTO DA MESA fica do lado do banquinho, e nao no meio do tabuleiro:
     * o raio de 1,6 pega quem chega pela calcada, e o prompt aparece antes de a
     * dupla esbarrar no colisor da mesinha.
     */
    w.interact({
      id: 'parque:xadrez',
      x: XADREZ.x + 0.9, z: XADREZ.z + 0.5, radius: 1.6,
      label: 'Jogar xadrez com a Estella', icon: '♟️',
      onInteract: async (api) => {
        if (!api.flag('estella-conhecida')) {
          /*
           * NINGUEM JOGA COM UM TABULEIRO DE ESTRANHO. Sem conhecer a Estella, a
           * mesinha e so uma mesinha — e a fala manda falar com ela, que e onde
           * a partida comeca de verdade.
           */
          await conversa([
            [R, 'Tem uma partida no meio aqui.'],
            [A, 'É de alguém. Olha a ovelha ali na porta olhando pra gente.'],
          ]);
          return;
        }
        await partidaDeXadrez(api);
      },
    });

    w.onUpdate((dt) => {
      estella.update(dt);
      // ela quase não sai do lugar, mas "quase" não é "nunca": sem isto o ponto
      // fica onde ela nasceu e a conversa vira um buraco na calçada
      falarComEstella.moveTo(estella.x, estella.z);
      /*
       * LONGE DELA, ELA VOLTA A OLHAR A RUA — e o jeito de fazer isso é mandar
       * ela encarar um ponto lá no `+X`, e não largar o alvo: `pararDeEncarar`
       * só solta o volante, e ela ficaria torta para sempre no ângulo em que o
       * último cliente a deixou. Foi o que o Mano já pagou no quiosque.
       */
      const eu = g.playerPosition();
      if (Math.hypot(eu.x - estella.x, eu.z - estella.z) > 4) {
        estella.encarar(ESTELLA.x + 5, ESTELLA.z);
      }
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
       *
       * E DE 6,5 FOI PARA 10 quando a praça de gelo tomou o lugar do gramado: a
       * meia-diagonal do piso é 8,7, e árvore plantada em cima do rinque seria
       * árvore nascendo dentro do gelo.
       */
      [PRACA.x, PRACA.z, 10], [-10, 20, 3],
      // a pista e a loja entram na lista pelo mesmo motivo da praça da roda:
      // sem isto o espalhador planta árvore em cima do asfalto
      [-21, -5, 12], [-8.6, 2.5, 9],
      // a lojinha: 11 de raio cobre o prédio (11,6 × 9,5) e a calçada dele.
      // Sem isto o espalhador planta árvore dentro da vitrine
      [-40, -16.5, 11],
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
    /**
     * O QUE FOI ENTREGUE DESTA VEZ, e para quem.
     *
     * Antes o relógio do derretimento apagava dois ids cravados no código —
     * morango do Ari, maracujá do Renan. Na mesinha dá para pedir "o que o
     * Mano escolher", e aí vêm chocolate e limão: com os ids cravados, esses
     * dois nunca derreteriam e a dupla ficaria de casquinha na mão para sempre.
     * Agora quem entrega anota aqui o que entregou.
     */
    let naMaoDeles: Array<{ item: ItemDef; dono: string }> = [];

    /** entrega um par de sorvetes e liga o relógio do derretimento */
    const entregarSorvetes = (doAri: ItemDef, doRenan: ItemDef): void => {
      naMaoDeles = [{ item: doAri, dono: ARI.id }, { item: doRenan, dono: RENAN.id }];
      g.addItem(doAri, ARI.id);
      g.addItem(doRenan, RENAN.id);
      sorveteRestante = 50;
    };

    w.onUpdate((dt) => {
      if (sorveteRestante <= 0) return;
      sorveteRestante -= dt;
      if (sorveteRestante <= 0) {
        for (const { item, dono } of naMaoDeles) g.removeItem(item.id, dono);
        naMaoDeles = [];
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

    /**
     * O SORVETE AGORA SE PEDE AO MANO, e não ao quiosque.
     *
     * Antes a dupla falava entre si e as casquinhas apareciam; agora tem alguém
     * do outro lado do balcão, e a conversa é com ele. Da primeira vez ele
     * conta por que um pinguim foi parar numa sorveteria — o friozinho —, e é
     * dessa conversa que sai a dança: ele fica feliz de falar disso.
     *
     * O JOGADOR FICA TRAVADO a cena inteira, e a trava sai num `finally`: se
     * qualquer `await` daqui de dentro estourar, o jogo não pode ficar com a
     * dupla congelada no meio do parque para o resto da sessão.
     *
     * A DANÇA NÃO É ESPERADA COM PROMESSA. `mano.dancar(2,6)` só liga o
     * contador do bicho, e a cena espera com `api.wait`. São dois relógios que
     * andam juntos porque recebem o mesmo `dt`, e nenhum segura o outro.
     */
    const PEDIDOS_DO_MANO = [
      'Morango e maracujá, já sei de cor!',
      'Deixa comigo! Acabei de abrir o freezer, tá geladinho.',
      'Vocês pedem sempre igual. Eu gosto disso.',
      'Dois! Adoro quando é dois.',
    ];

    /**
     * COM SORVETE NA MÃO ELE NÃO VENDE OUTRO — ele repara.
     *
     * É a única resposta honesta: `addItem` recusaria o repetido de qualquer
     * jeito, e a cena inteira aconteceria para não entregar nada. Em vez disso
     * ele nota que vocês ainda estão comendo o de antes, faz uma graça e
     * guarda o próximo no gelo.
     */
    const AINDA_COMENDO = [
      'Come esse primeiro, vai! O próximo eu deixo geladinho aqui.',
      'Sorvete é um de cada vez. Senão o segundo derrete esperando.',
      'Eu guardo o de vocês no gelo. Pode voltar quando acabar esse.',
      'Tá bom esse? Tá bom, né. Eu escolhi.',
    ];
    /**
     * Algum dos dois ainda está com casquinha na mão.
     *
     * Pergunta pela LISTA do que foi entregue, e não por dois ids fixos: na
     * mesinha o sabor pode ser outro, e um teste cravado em morango diria que a
     * mão está vazia com o chocolate derretendo nela.
     */
    const aindaTemSorvete = (): boolean =>
      naMaoDeles.some(({ item, dono }) => g.hasItem(item.id, dono));

    const pedirSorvete = w.interact({
      id: 'parque:sorveteria',
      x: SORVETERIA.x, z: SORVETERIA.z + 2, radius: 2.4,
      label: 'Pedir sorvete pro Mano', icon: '🍦',
      highlight: mano.group,
      onInteract: async (api) => {
        api.lockPlayer(true);
        try {
          // ele vira para quem pediu antes de responder: atender de lado é o
          // que faz NPC parecer poste
          const eu = api.playerPosition();
          mano.group.rotation.y = Math.atan2(eu.x - mano.x, eu.z - mano.z);

          if (aindaTemSorvete()) {
            api.som('pinguim');
            await api.say(['Opa! Mas vocês ainda estão com o de antes.'], 'Mano');
            await api.say([w.pick(AINDA_COMENDO)], 'Mano');
            // uma batidinha de asa curta: ele fica contente de ver vocês
            // comendo o que ele entregou, mas não é a dança inteira
            mano.dancar(1.0);
            await conversa([
              [A, 'Ele reparou.'],
              [R, 'Ele repara em tudo.'],
            ]);
            return;
          }

          const primeira = !api.flag('mano-atendeu');
          if (primeira) {
            api.setFlag('mano-atendeu');
            await conversa([
              [R, 'Oi. Dois, por favor.'],
              [A, 'Um de morango e um de maracujá.'],
            ]);
            api.som('pinguim');
            await api.say(['Morango e maracujá! Boa escolha, boa escolha.'], 'Mano');
            await conversa([
              [A, 'Posso perguntar uma coisa? Por que um pinguim numa sorveteria?'],
            ]);
            await api.say([
              'Ah, é o friozinho. Eu abro a tampa do freezer e fico ali pertinho.',
              'Um dia me deram o avental. Disseram que, já que eu ia ficar mesmo, era melhor eu trabalhar.',
            ], 'Mano');
            await conversa([
              [R, 'Faz sentido.'],
            ]);
            await api.say(['E eu adoro isso aqui. Fico tão feliz que às vezes eu…'], 'Mano');
          } else {
            await conversa([
              [R, 'Mano, os dois de sempre.'],
            ]);
            api.som('pinguim');
            await api.say([w.pick(PEDIDOS_DO_MANO)], 'Mano');
          }

          // …que às vezes ele dança. A frase de cima termina aqui, dançando.
          mano.dancar(2.6);
          api.focusCamera(mano.group);
          api.setZoom(6.4);
          await api.wait(1.1);
          await api.say([primeira ? 'Ele tá dançando. Ele DANÇA.' : 'Lá vem a dancinha.'], A);
          await api.wait(1.2);
          api.focusCamera(null);
          // 13 é o enquadramento com que a câmera nasce (`IsoCamera.viewSize`),
          // e é para ele que o parque tem que voltar: fechar num número
          // qualquer deixaria a cena inteira mais perto para sempre
          api.setZoom(13);

          await api.say(['Toma! Um de cada, do jeito que vocês pediram.'], 'Mano');

          // cada casquinha vai para a mochila do dono, não para uma bolsa comum
          entregarSorvetes(ITENS.sorveteMorango, ITENS.sorveteMaracuja);
          api.som('sorvete');
          api.toast('Morango e maracujá', '🍦');
          if (primeira) {
            await conversa([
              [A, 'Obrigado, Mano.'],
              [R, 'Ele já voltou pro freezer.'],
            ]);
          }
          api.unlock({
            id: 'sorvete-villa',
            title: 'Sorvete no parque',
            place: 'Parque Villa Lobos',
            note: 'Morango pro Ari, maracujá pro Renan, pedidos pro Mano — o pinguim que trabalha ali porque gosta do friozinho, e que dança de felicidade quando fala nisso.',
            icon: '🍦',
          });
        } finally {
          api.lockPlayer(false);
        }
      },
    });

    /* ==================================================================== *
     *        A MESINHA: sentar, pedir da mesa e o Mano servir na mesa
     *
     * O balcão continua existindo — quem quer sorvete rápido pede lá. Aqui é a
     * outra coisa: sentar na sombra, ele VIR até a mesa anotar, voltar ao
     * quiosque, trazer as duas casquinhas na bandeja, e uns segundos dos dois
     * comendo antes de levantar.
     *
     * TUDO ACONTECE NA ÂNCORA DA MESA. O grupo da peça já carrega posição e
     * giro, então sentar é `ridePlayer(mesa, (-0,78; 0; 0))` — exatamente onde
     * fica a cadeirinha da esquerda — e nenhuma conta de seno e cosseno entra
     * aqui. É o mesmo padrão das mesas do Mania de Churrasco.
     *
     * ELE ANDA POR ORDEM DA CENA (`entrarEmServico` + `irPara`), e não pelo
     * cérebro: a área dele é uma coleira de 24 cm em volta do posto, e o
     * passeio nunca o levaria à mesa. Ao voltar, a cena PRECISA mandá-lo de
     * volta ao posto antes de `voltarAPassear()` — a coleira é menor que o
     * passo mínimo do cérebro, então largar ele solto na mesa o deixaria
     * plantado ali para sempre.
     * ==================================================================== */

    /** o Mano TROTA atendendo mesa; o passeio dele é 0,5 */
    const TROTE_DO_MANO = 1.45;

    /** ponto do mundo a partir de coordenada local da mesinha */
    const naMesinha = (mesa: THREE.Group, x: number, z: number): THREE.Vector3 =>
      mesa.localToWorld(new THREE.Vector3(x, 0, z));

    /**
     * As falas de quem já sentou aqui antes. A primeira vez tem conversa
     * própria; da segunda em diante ele varia, senão a mesinha vira gravação.
     */
    const CHEGADA_DO_MANO = [
      'Mesa na sombra! Boa escolha.',
      'Oi de novo! Já vou anotar.',
      'Essa mesa é a melhor. Não conta pras outras.',
      'Cheguei! Podem falar.',
    ];
    const ENTREGA_DO_MANO = [
      'Dois! Do jeitinho que vocês pediram.',
      'Aqui está. Antes que derreta!',
      'Serviço de mesa. Eu adoro fazer isso.',
    ];

    const sentarNaMesinha = async (api: GameAPI, mesa: THREE.Group): Promise<void> => {
      api.lockPlayer(true);
      // onde ele para para atender: na frente da mesa pelo lado da CÂMERA (a
      // mesa olha para o quiosque, então a frente dela é `-Z` local). Atrás,
      // ele atenderia escondido pelo guarda-sol e por quem está sentado.
      const posto = naMesinha(mesa, 0, -1.3);
      const olhandoPraMesa = Math.atan2(mesa.position.x - posto.x, mesa.position.z - posto.z);

      try {
        // os dois se sentam nas duas cadeirinhas, um de frente para o outro
        api.ridePlayer(mesa, new THREE.Vector3(-0.78, 0, 0), 1, Math.PI / 2);
        api.rideCompanion(mesa, new THREE.Vector3(0.78, 0, 0), 1, -Math.PI / 2);
        api.setSitting(true);
        api.focusCamera(mesa);
        api.setZoom(7.6);
        await api.wait(0.7);

        // com casquinha na mão não se pede outra: senta, come e conversa
        if (aindaTemSorvete()) {
          await conversa([
            [R, 'Senta aqui. Tem sombra e tem mesa.'],
            [A, 'E a gente já tem o que comer.'],
          ]);
          api.setSaboreando(true);
          await api.wait(3.4);
          api.setSaboreando(false);
          return;
        }

        const primeira = !api.flag('mesinha-atendida');
        if (primeira) {
          await conversa([
            [A, 'A gente pode sentar aqui e esperar?'],
            [R, 'Tem mesa, tem guarda-sol e tem um pinguim de avental. Pode.'],
          ]);
        }

        // --------------------------------------------- ele vem até a mesa
        mano.entrarEmServico();
        api.som('pinguim');
        await mano.irPara(posto.x, posto.z, TROTE_DO_MANO);
        mano.group.rotation.y = olhandoPraMesa;
        await api.wait(0.3);
        await api.say([primeira ? 'Mesa na sombra! Boa escolha.' : w.pick(CHEGADA_DO_MANO)], 'Mano');

        const escolha = await api.ask('O que vai ser?', [
          'Os dois de sempre',
          'O que o Mano escolher',
          'Só sentar um pouco',
        ]);

        if (escolha === 2) {
          await api.say(['Fica à vontade! Quando bater vontade é só chamar.'], 'Mano');
          await conversa([[A, 'A gente só queria sentar mesmo.']]);
          void mano.irPara(MANO.x, MANO.z, TROTE_DO_MANO).then(() => {
            mano.group.rotation.y = 0;
            mano.voltarAPassear();
          });
          await api.wait(1.2);
          return;
        }

        // o pedido: o de sempre, ou o que ele escolher — e ele escolhe
        // chocolate e limão, que são os dois sabores da casa
        const pedido = escolha === 0
          ? [
              { item: ITENS.sorveteMorango, cor: P.morango },
              { item: ITENS.sorveteMaracuja, cor: P.maracuja },
            ]
          : [
              { item: ITENS.sorveteChocolate, cor: P.chocolate },
              { item: ITENS.sorveteLimao, cor: P.limao },
            ];
        await api.say([
          escolha === 0
            ? 'Morango e maracujá. Anotado — mas eu já sabia.'
            : 'Ah, essa eu gosto. Confia em mim.',
        ], 'Mano');

        // ------------------------------------- ele volta ao quiosque e serve
        /**
         * A CÂMERA VAI COM ELE. Focada na mesa, a viagem até o quiosque
         * aconteceria inteira fora da tela — e a viagem é justamente o que se
         * quer ver. Ela volta para a mesa quando ele chega com a bandeja. É a
         * mesma escolha que a ida do Walter à cozinha já tinha feito.
         */
        api.focusCamera(mano.group);
        api.setZoom(9);
        await mano.irPara(MANO.x, MANO.z, TROTE_DO_MANO);
        mano.group.rotation.y = 0;
        // o tempo de montar as duas casquinhas atrás do balcão
        await api.wait(1.2);
        mano.levarBandeja(true);
        const casquinhas = pedido.map(({ cor }, i) => {
          const c = iceCream(cor);
          c.position.set(i === 0 ? -0.06 : 0.06, 0.1, 0);
          mano.bandeja.add(c);
          return c;
        });
        api.som('sorvete');
        await api.wait(0.6);

        await mano.irPara(posto.x, posto.z, TROTE_DO_MANO);
        mano.group.rotation.y = olhandoPraMesa;
        api.focusCamera(mesa);
        api.setZoom(7.6);
        await api.wait(0.5);
        await api.say([w.pick(ENTREGA_DO_MANO)], 'Mano');

        // as casquinhas da bandeja somem no mesmo quadro em que as de verdade
        // aparecem na mão de cada um: para o olho, é a mesma casquinha passando
        for (const c of casquinhas) {
          mano.bandeja.remove(c);
          c.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
          });
        }
        mano.levarBandeja(false);
        entregarSorvetes(pedido[0].item, pedido[1].item);
        api.som('sorvete');
        api.toast(`${pedido[0].item.nome} e ${pedido[1].item.nome.toLowerCase()}`, '🍦');
        mano.dancar(1.4);

        // ele volta para o posto enquanto os dois comem: a cena não espera por
        // ele, e é isso que faz a praça parecer viva em vez de encenada
        void mano.irPara(MANO.x, MANO.z, TROTE_DO_MANO).then(() => {
          mano.group.rotation.y = 0;
          mano.voltarAPassear();
        });

        // --------------------------------------------------- e eles comem
        api.setSaboreando(true);
        await api.wait(1.6);
        await conversa(primeira
          ? [
              [A, 'Ele trouxe na mesa. Na MESA.'],
              [R, 'Eu vou querer sentar aqui todo sábado.'],
            ]
          : [[R, w.pick(['Esse tá melhor que o de ontem.', 'Deixa eu provar o seu.', 'A sombra daqui é boa.'])]]);
        await api.wait(2.6);
        api.setSaboreando(false);

        if (primeira) {
          api.setFlag('mesinha-atendida');
          api.unlock({
            id: 'mesinha-do-gelo',
            title: 'Serviço de mesa',
            place: 'Parque Villa Lobos',
            note: 'Sentaram numa mesinha da praça de gelo e o Mano foi até lá anotar o pedido, voltou ao quiosque e trouxe as duas casquinhas na bandeja.',
            icon: '⛱️',
          });
        }
      } finally {
        api.setSaboreando(false);
        api.setSitting(false);
        api.focusCamera(null);
        // 13 é o enquadramento com que a câmera nasce (`IsoCamera.viewSize`)
        api.setZoom(13);
        // cada um levanta para trás da sua cadeira, do lado da câmera, longe do
        // colisor da mesa (raio 1) — 1,7 do centro é folga de sobra para o 0,42
        // do corpo
        const saiEu = naMesinha(mesa, -1.05, -1.35);
        const saiEle = naMesinha(mesa, 1.05, -1.35);
        api.releasePlayer(saiEu.x, saiEu.z, Math.atan2(mesa.position.x - saiEu.x, mesa.position.z - saiEu.z));
        api.releaseCompanion(saiEle.x, saiEle.z, Math.atan2(mesa.position.x - saiEle.x, mesa.position.z - saiEle.z));
        api.lockPlayer(false);
      }
    };

    /**
     * TODA MESINHA SENTA. O ponto do prompt fica na frente dela, do lado da
     * câmera, e tem raio 1,6: menor que a distância até a mesa vizinha (4), e
     * fora do ponto de comprar no balcão.
     */
    for (const [i, mesa] of MESINHAS.entries()) {
      const chegada = naMesinha(mesa, 0, -1.5);
      w.interact({
        id: `parque:mesinha-${i}`,
        x: chegada.x, z: chegada.z, radius: 1.6,
        label: 'Sentar na mesinha', icon: '⛱️',
        highlight: mesa,
        onInteract: (api) => sentarNaMesinha(api, mesa),
      });
    }

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

    /**
     * ================================ QUEM VENDE O BILHETE É O COOKIE
     *
     * Este é o primeiro lugar do jogo que GASTA a carteira do casal. Ela nasceu
     * no turno do Mania de Churrasco e até agora só enchia; aqui ela esvazia, e
     * o dinheiro passa a querer dizer alguma coisa.
     *
     * E a venda mora NELE, e não na cabine: uma bilheteria com a janela vazia é
     * um objeto, e o Renan pediu um bilheteiro. O ponto da cabine continua
     * existindo — mas só para mandar a dupla falar com ele, que é o que uma
     * janela vazia faria na vida real.
     *
     * SEM DINHEIRO NÃO TRAVA NADA: ele mesmo manda a dupla trabalhar um turno
     * no Mania, que é uma volta de trinta segundos de caminhada e um minigame
     * que já existe. Um jogo-presente não pode ter beco sem saída — mas pode
     * ter um caminho.
     */
    const PRECO_DO_BILHETE = 24;
    const C = 'Cookie';

    /** as falas dele quando a dupla volta, depois da apresentação */
    const OI_DO_COOKIE = [
      'Oi de novo! Eu reconheci vocês pelo passo. Passo leve.',
      'Voltaram! Eu tava aqui, andando de um lado pro outro. É o que eu faço.',
      'Oi! Desculpa a orelha, ela abana sozinha quando eu fico contente.',
      'Vocês de novo. Que bom. Ninguém vem duas vezes.',
    ];

    const pedirBilhete = w.interact({
      id: 'parque:cookie',
      x: COOKIE.x, z: COOKIE.z, radius: 2.6,
      label: 'Falar com o Cookie', icon: '🐘',
      highlight: cookie.group,
      onInteract: async (api) => {
        /*
         * ELE PARA E OLHA. `entrarEmServico()` limpa a missão de caminhada (as
         * pernas voltam ao repouso sozinhas, por interpolação) e o `encarar`
         * gira o corpo dele para quem chegou, devagar. Sem isto ele continuaria
         * o vaivém falando de costas.
         */
        cookieConversando = true;
        cookie.entrarEmServico();
        const eu = api.playerPosition();
        cookie.encarar(eu.x, eu.z);
        api.lockPlayer(true);
        try {
          if (!api.flag('cookie-apresentado')) {
            api.setFlag('cookie-apresentado');
            await conversa([
              [A, 'Oi...'],
              [C, 'Oi! Oi. Desculpa, eu falo baixinho, mas mesmo assim...'],
              [C, 'As pessoas dão um passinho pra trás quando eu digo oi. Não é maldade delas. Eu sou grande.'],
              [R, 'A gente não deu passo nenhum.'],
              [C, 'Vocês não deram.'],
            ]);
            await api.wait(0.8);
            await conversa([
              [C, 'Obrigado.'],
              [C, 'Eu sou o Cookie. Eu cuido dos bilhetes daqui.'],
              [A, 'Cookie por causa de biscoito?'],
              [C, 'Por causa de biscoito. Eu gosto de tudo que é doce e pequenininho.'],
              [C, 'Bala, jujuba, aquele confeitinho colorido que gruda no dente. Coisa que cabe na pontinha da tromba.'],
            ]);

            // ele olha para cima ANTES da fala do sonho, e não durante: o
            // gesto precisa chegar primeiro, senão a fala explica um boneco
            // parado. 7 s cobrem as três linhas que vêm depois.
            cookie.olharProAlto(7);
            await api.wait(1.2);
            await conversa([
              [C, 'Um dia eu subo naquilo ali.'],
              [R, 'Na roda?'],
              [C, 'Na roda. Eu vendo bilhete dela faz não sei quanto tempo, e nunca coube numa cabine.'],
              [C, 'Mas todo mundo desce daquilo sorrindo. Eu fico aqui embaixo vendo. Já é um pedacinho, né?'],
              [A, 'É um pedacinho.'],
            ]);
            api.unlock({
              id: 'cookie',
              title: 'O Cookie',
              place: 'Parque Villa Lobos',
              note: 'O elefante que vende os bilhetes da roda gigante. Bonzinho, meio sem jeito do próprio tamanho, e apaixonado por doce pequenininho. Sonha em subir na roda — nunca coube numa cabine.',
              icon: '🐘',
            });
          } else if (api.flag('estella-conhecida') && !api.flag('cookie-falou-do-uniforme')) {
            /**
             * O LADO DELE DA MESMA HISTORIA, uma vez so.
             *
             * A Estella conta que fez o uniforme dele e deu um biscoitinho; o
             * Cookie conta o que aquilo significou. A fala so existe depois de
             * conhecer os dois, porque antes disso ela seria um elefante
             * falando de uma ovelha que ninguem viu.
             *
             * ELE OLHA PARA O PROPRIO QUEPE enquanto fala — `olharProAlto` e o
             * gesto que ele ja tem, e aqui ele serve de novo: cabeca e tromba
             * subindo, so que agora e orgulho, e nao sonho.
             */
            api.setFlag('cookie-falou-do-uniforme');
            cookie.olharProAlto(5);
            await conversa([
              [C, 'Vocês foram lá na ovelha, né? Na Estella.'],
              [A, 'Fomos.'],
              [C, 'Isso aqui é dela.'],
              [C, 'A manta, o quepe, o crachá com o meu nome. Ela mediu a minha orelha três vezes.'],
              [C, 'Nunca ninguém tinha feito roupa do meu tamanho. Sempre é "não temos". Sempre.'],
              [R, 'E ficou bom.'],
              [C, 'Ficou. E no dia que ficou pronto ela me deu um biscoitinho.'],
              [C, 'Eu guardei metade pro dia seguinte. Só pra ter de novo no dia seguinte.'],
            ]);
            api.unlock({
              id: 'uniforme-do-cookie',
              title: 'O uniforme do Cookie',
              place: 'Parque Villa Lobos',
              note: 'A Estella costurou a manta, o quepe e o crachá do Cookie nas cores da bilheteria dele, e mediu a orelha três vezes até cair certo. Foi a primeira roupa feita do tamanho dele. No dia da entrega ela deu um biscoitinho, e ele guardou metade pro dia seguinte.',
              icon: '🧵',
            });
          } else {
            await api.say([w.pick(OI_DO_COOKIE)], C);
          }

          // --------------------------------------------------------- o bilhete
          if (api.hasItem(ITENS.bilheteDaRoda.id) || api.hasItem(ITENS.bilheteDaRoda.id, api.companionId())) {
            await conversa([
              [C, 'Vocês já estão com o de vocês! Não vou vender dois.'],
              [A, 'Tá aqui na mochila.'],
              [C, 'Então vão. A fila tá curta.'],
            ]);
            return;
          }

          await conversa([
            [A, 'A gente queria dois pra roda gigante.'],
            [C, 'Dois. Na mesma cabine, né? É sempre na mesma cabine, com vocês.'],
          ]);
          if (api.carteira() < PRECO_DO_BILHETE) {
            await conversa([
              [C, `São vinte e quatro reais os dois. Vocês têm ${api.carteira()}.`],
              [C, 'Não fica com essa cara. O Walter do Mania de Churrasco tá sempre precisando de gente.'],
              [C, 'Um turno lá e vocês voltam. Eu tô aqui. Eu tô sempre aqui.'],
            ]);
            api.toast(`Faltam R$ ${PRECO_DO_BILHETE - api.carteira()}`, '🎟️');
            return;
          }

          const vai = await api.ask(
            `Dois lugares na mesma cabine — R$ ${PRECO_DO_BILHETE}?`,
            ['Comprar', 'Agora não'],
            A,
          );
          if (vai !== 0) {
            await api.say(['Sem pressa. A roda não vai a lugar nenhum. Eu também não.'], C);
            return;
          }
          if (!api.gastar(PRECO_DO_BILHETE)) return;

          api.addItem(ITENS.bilheteDaRoda);
          api.som('caixa');
          api.toast(`Bilhete comprado · R$ ${api.carteira()} na carteira`, '🎟️');
          await conversa([
            [C, 'Prontinho. Rasguei bem no picotado, olha.'],
            [C, 'A catraca é ali na plataforma. Quando chegarem lá em cima, acenem pra cá.'],
            [A, 'A gente acena.'],
            [C, 'Eu vou estar olhando.'],
          ]);
        } finally {
          // SEMPRE devolve ele para a patrulha, por qualquer saída da conversa:
          // um `return` no meio que esquecesse isto deixaria o Cookie parado
          // olhando para o vazio pelo resto da sessão
          cookie.pararDeEncarar();
          cookieConversando = false;
          api.lockPlayer(false);
        }
      },
    });

    /*
     * A JANELA VAZIA. O ponto da cabine continua, mas agora ele só aponta para
     * o Cookie: quem anda até o guichê tem que descobrir alguma coisa ali, e
     * não bater numa parede muda.
     */
    w.interact({
      id: 'parque:bilheteria',
      x: BILHETERIA.x, z: BILHETERIA.z + 2.1, radius: 2.0,
      label: 'Guichê', icon: '🎟️',
      highlight: bilheteria,
      onInteract: async (api) => {
        await conversa([
          [A, 'Não tem ninguém na janelinha.'],
          [R, 'Tem sim. Olha do lado.'],
        ]);
        api.toast('Quem vende é o Cookie, do lado da cabine', '🐘');
      },
    });

    // ---------------------------------------------------- a roda gigante
    let voltaAtual: { resolve: () => void; de: number; voltas: number } | null = null;
    const esperarVoltas = (voltas: number): Promise<void> =>
      new Promise((resolve) => {
        voltaAtual = { resolve, de: wheel.angle, voltas };
      });

    /**
     * ======================================= A VOLTA EM PRIMEIRA PESSOA
     *
     * Enquanto `cabineDoPasseio` existe, a câmera do jogo é uma perspectiva
     * parada DENTRO da cabine, na altura dos olhos de quem está sentado. O
     * jogador não anda — mas continua com o manche, e o manche vira o olhar:
     * para os lados o parque passa pela janela que dá a volta inteira, e para
     * o lado do parceiro ele está ali, sentadinho, de mão dada.
     *
     * O olhar é acumulado num ângulo próprio (não é a câmera isométrica): a
     * câmera é recolocada do zero a cada quadro a partir da matriz de mundo da
     * cabine, então ela acompanha a subida sem ninguém precisar animá-la.
     */
    // espera por uma condição do mundo (a cabine chegar ao alto), e não por um
    // relógio: a roda anda pelo `dt`, e um `setTimeout` erraria o ponto
    let esperaAtual: { resolve: () => void; condicao: () => boolean } | null = null;
    const esperarQue = (condicao: () => boolean): Promise<void> =>
      new Promise((resolve) => {
        esperaAtual = { resolve, condicao };
      });

    let cabineDoPasseio: THREE.Group | null = null;
    let olharGiro = 0.3; // começa olhando o parque (ver o embarque)
    let olharAltura = -0.3;
    const LADO_DO_JOGADOR = -0.38;
    const olho = new THREE.Vector3();
    const miraDaCabine = new THREE.Vector3();

    const olharNaCabine = (dt: number): void => {
      const cabine = cabineDoPasseio;
      if (!cabine) return;
      const m = g.olharLivre();
      olharGiro -= m.x * 1.5 * dt;
      olharAltura = Math.max(-0.75, Math.min(0.6, olharAltura + m.y * 0.9 * dt));
      // o pescoço tem limite: nem de costas para a janela, nem de costas para
      // o parceiro. A frente é o giro ZERO (+Z, o lado do parque), e 2,2 rad
      // para cada lado cobrem a cabine inteira sem perder onde é a frente.
      olharGiro = Math.max(-2.2, Math.min(2.2, olharGiro));

      // ENCOSTADO NO BANCO, e não na beirada: 10 cm à frente do encosto o topo
      // dele cortava a tela no meio quando o jogador virava para o parceiro.
      // Sentado até o fundo, ele fica onde encosto tem que ficar — no rodapé.
      olho.set(LADO_DO_JOGADOR, FerrisWheel.PISO + 0.74, -0.28);
      cabine.localToWorld(olho);
      miraDaCabine.set(
        LADO_DO_JOGADOR + Math.sin(olharGiro) * 6,
        FerrisWheel.PISO + 0.74 + olharAltura * 6,
        -0.28 + Math.cos(olharGiro) * 6,
      );
      cabine.localToWorld(miraDaCabine);
      g.setCameraOmbro(olho, miraDaCabine);
    };

    // perto da roda a camera abre, para caber a coisa toda na tela
    let zoomLivre = true;
    w.onUpdate((dt) => {
      wheel.update(dt);
      olharNaCabine(dt);
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
      if (esperaAtual && esperaAtual.condicao()) {
        const done = esperaAtual.resolve;
        esperaAtual = null;
        done();
      }
    });

    w.interact({
      id: 'parque:roda-gigante',
      x: 0, z: -18.6, radius: 3,
      label: 'Andar na roda gigante', icon: '🎡',
      onInteract: async (api) => {
        /*
         * A CATRACA COBRA. Um bilhete vale a cabine inteira — os dois lugares
         * — então basta que ele esteja na mochila de QUALQUER um dos dois; o
         * casal divide carteira, divide bilhete. Quem carrega é quem entrega.
         */
        const dono = api.hasItem(ITENS.bilheteDaRoda.id)
          ? undefined
          : api.hasItem(ITENS.bilheteDaRoda.id, api.companionId())
            ? api.companionId()
            : null;
        if (dono === null) {
          await conversa([
            [A, 'A catraca não abre sem bilhete.'],
            [R, 'A bilheteria é aquela ali do lado do lago.'],
          ]);
          api.toast('Compre o bilhete na bilheteria', '🎟️');
          return;
        }

        zoomLivre = false;
        api.lockPlayer(true);
        await conversa([
          [R, 'A fila tá curta hoje.'],
          [A, 'Bora subir?'],
        ]);
        api.removeItem(ITENS.bilheteDaRoda.id, dono);
        wheel.girarACatraca();
        api.som('caixa');
        api.toast('Bilhete picotado', '🎟️');

        /*
         * A VOLTA É LENTA DE PROPÓSITO. A versão antiga multiplicava a
         * velocidade por 5 para despachar a cena em doze segundos; aqui ela
         * anda quase no passo normal da roda (uma volta em ~45s), porque o
         * tempo é metade da coisa. Ninguém sobe numa roda gigante com pressa.
         */
        const cabine = wheel.boardingCabin();
        const velocidade = wheel.speed;
        wheel.speed = velocidade * 1.35;

        // os dois entram na mesma cabine, lado a lado no banco de trás,
        // olhando para fora (-Z) — que é justamente para onde o parque está
        api.som('sino'); // a sineta de "vai começar" antes de a cabine subir
        wheel.abrirCabine(cabine);
        // o Mano sai da frente do quiosque e vai para o lado dele, para dar
        // para ver quando a fala lá de cima falar dele
        mano.entrarEmServico();
        void mano.irPara(MANO_DE_LADO.x, MANO_DE_LADO.z).then(() => {
          mano.group.rotation.y = OLHANDO_A_RODA;
        });
        // OS DOIS OLHAM PARA O PARQUE, que é +Z: `facing` gira a partir de +Z,
        // então a frente é o zero. O parceiro senta um dedo mais atrás e virado
        // para o lado do jogador (x negativo, daí o giro NEGATIVO): assim,
        // quando o jogador vira a cabeça, ele encontra o ROSTO dele, e não uma
        // orelha colada na lente.
        api.ridePlayer(cabine, new THREE.Vector3(LADO_DO_JOGADOR, FerrisWheel.PISO, -0.28), 0.55, 0);
        api.rideCompanion(cabine, new THREE.Vector3(0.38, FerrisWheel.PISO, -0.28), 0.55, -0.8);
        api.setSitting(true); // sentadinhos, e de mão dada — o `setSitting` faz as duas coisas
        api.focusCamera(cabine); // o sol e a sombra seguem a cabine

        // primeira pessoa: o corpo do jogador sairia dentro da lente
        api.setPlayerVisible(false);
        // a volta ABRE com ele em quadro, e não com a paisagem: a primeira
        // coisa que se vê lá dentro é o outro sentadinho ali do lado
        /*
         * A VOLTA ABRE OLHANDO PARA O PARQUE, e não para o parceiro.
         *
         * Ele senta a 76 cm, de lado — e num celular EM PÉ a janela é estreita
         * (uns 33° de campo na horizontal): abrindo virado para ele, a primeira
         * coisa da volta era um rosto ocupando a tela inteira. Olhando para a
         * frente o parque aparece, e ele está a um giro de distância — que é o
         * que o passeio pede para o jogador fazer de qualquer jeito.
         *
         * 0,3 rad é a direção do quiosque do Mano, que é para onde uma das
         * falas lá de cima aponta.
         */
        olharGiro = 0.3;
        // e o olhar começa INCLINADO PARA BAIXO: o parque fica embaixo, e na
        // horizontal a cabine mostra o céu e o skyline em vez dele
        olharAltura = -0.3;
        cabineDoPasseio = cabine;
        api.toast('Olhe em volta — setas ou WASD', '👀');

        await conversa([
          [A, 'Que janela...'],
          [R, 'Dá a volta inteira. Não tem canto sem vista.'],
        ]);
        await esperarVoltas(0.12);
        await conversa([
          [A, 'Olha o Mano lá embaixo. Do tamanho de um pinguinzinho de geladeira.'],
          [R, 'Ele é do tamanho de um pinguim, amor.'],
          [A, 'Você entendeu.'],
        ]);
        await esperarVoltas(0.13);

        /*
         * A PARADA NO ALTO. É o motivo de a volta existir: a roda trava com a
         * cabine no ponto mais alto, e por uns segundos não acontece nada —
         * dá tempo de girar o olhar, ver o parque inteiro, e voltar para o
         * outro, que está sentado bem ali do lado.
         */
        await esperarQue(() => cabine.position.y > wheel.hubHeight + wheel.radius * 0.94);
        wheel.speed = 0;
        api.som('sino');
        await api.wait(1.6);
        await conversa([
          [R, 'Parou.'],
          [A, 'Parou no alto. Sempre para no alto.'],
        ]);
        await api.wait(2.2);
        await conversa([
          [A, 'Toda vez que a gente passava aqui embaixo você olhava pra cima e dizia "um dia a gente sobe".'],
          [R, 'Pronto. Subimos.'],
          [A, 'Eu ia dizer que daqui dá pra ver o parque inteiro.'],
          [A, 'Mas eu tô olhando pra você.'],
        ]);
        api.som('coracao');
        await api.wait(2.4);
        await conversa([
          [R, 'A gente pode ficar mais um pouquinho.'],
          [A, 'A roda é que decide.'],
        ]);

        wheel.speed = velocidade * 1.35;
        await esperarVoltas(0.2);
        await conversa([
          [R, 'Descendo já é saudade.'],
          [A, 'A gente sobe de novo.'],
        ]);
        // até a cabine encostar embaixo de novo — a volta fecha inteira
        await esperarQue(() => cabine.position.y < wheel.hubHeight - wheel.radius * 0.94);

        cabineDoPasseio = null;
        g.setCameraOmbro(null);
        wheel.fecharCabine();
        // e o Mano volta para o balcão, olhando para quem chega
        void mano.irPara(MANO.x, MANO.z).then(() => {
          mano.group.rotation.y = 0.3;
          mano.voltarAPassear();
        });
        wheel.speed = velocidade;
        api.setSitting(false);
        api.setPlayerVisible(true);
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
