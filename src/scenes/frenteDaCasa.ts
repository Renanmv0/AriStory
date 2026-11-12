import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Collider, SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { ARI, RENAN } from '../characters/cast';
import { cloud, flowers, lamp, meioFio, sebe, tree } from '../world/props';
import { asfalto, calcadaDePedrinha, pisoDePlacas, tapeteDeGrama } from '../world/texturasDeChao';
import { reboco } from '../world/texturasDeFachada';
import { toon } from '../core/materials';
import { uvDeParede } from '../world/acabamento';
import { fundir, fundirComoFundo } from '../world/fundir';
import {
  FACHADA, GARAGEM, MURO, PORTAO_DA_GARAGEM, fachadaDaCasa, muroDoJardim, painelDoPortao, pergoladoDaGaragem,
  pilarDoMuro, portaoDeCorrer, portaoSocial, trilhoDoPortao, type CoresDaFachada,
} from '../world/frenteDaCasa';
import { buxinhoNoVaso, heraNosMuros, type MuroComHera } from '../world/plantasDeJardim';
import { quina } from '../world/lojaDeRoupas';
import { BEBITO_MOBILE, BebitoMobile } from '../world/bebitoMobile/BebitoMobile';
import { chegadaDoBebito, renanFoiBuscar, temBebitoMobile } from '../eventos/bebitoMobile/presente';
import { sairDeCarro } from '../eventos/bebitoMobile/partida';
import { FLAG_DO_CARRO_NO_PARQUE } from '../eventos/BebitoMobile';

/**
 * A FRENTE DA CASA DO ARI: o jardim e a garagem.
 *
 * Nasceu com o Bebito Mobile (`docs/BEBITO-MOBILE.md`), e só existe no jogo
 * com a chave dele ligada (`eventos/BebitoMobile.ts`): aí a porta da rua da
 * casa sai AQUI, e é a calçada que leva ao parque. O pedido do Renan: "ao
 * sair tem um jardinzinho e ao lado uma garagem onde fica o carro; o jardim é
 * florido e fechado dos dois lados". Depois da primeira foto ele pediu a casa
 * mais funda, um MURO com plantas verdes no lugar da cerquinha branca, um
 * PORTÃO moderno na garagem e plantas novas no lugar dos canteiros redondos;
 * e depois, que o chão do jardim ficasse LIMPO: o Ari vai decorar o quintal
 * (o plano está em `docs/QUINTAL.md`).
 *
 * A PLANTA (a câmera vem do `+X/+Z`; o que é alto fica no `−X` e no `−Z`):
 *
 *        −Z  ┌──────────────┬─────────────────────────────┐
 *            │   garagem    │        a casa (funda)       │
 *            │  (pergolado) │   janela   PORTA   janela   │
 *            │              ├──── buxinho ┬ buxinho ──────┤
 *            │   o carro    m              │    a árvore  │
 *            │  de nariz    u   (grama)  lajes  (grama)  muro
 *            │  para a rua  ·  passagem    │              │
 *            │              │              │              │
 *            └ portão de correr ┴ muro ─ portão ─ muro ───┘
 *               ════════════  a calçada  ═════════════════
 *               ════════════     a rua    ════════════════   +Z
 *
 * O jardim é fechado dos dois lados: do lado da garagem, pela mureta (com a
 * passagem, para ir do carro à porta); do outro e na frente, pelo muro.
 *
 * O QUE É BAIXO FICA LONGE DO MURO DA FRENTE E DO DA DIREITA: os dois estão
 * do lado da câmera, e 1,35 m de muro escondem tudo o que tem menos de um
 * metro e está a menos de um metro e meio atrás dele. É a regra que o quintal
 * decorado vai seguir (`docs/QUINTAL.md` §3.1).
 */

const CASA = { x: 2, z: -5 };
const JARDIM = { x0: -2.9, x1: 6.7, z0: CASA.z, z1: 3 };
const VAGA = { x: -5.6, z: -1.2 };
const GAR = { x0: VAGA.x - GARAGEM.largura / 2, x1: VAGA.x + GARAGEM.largura / 2, z0: CASA.z, z1: JARDIM.z1 };
const PORTAO = { x: CASA.x, largura: 1.3 };
const CALCADA = { z0: 3.2, z1: 5.7 };
const RUA = { z0: 5.7, z1: 13.7, faixa: 7.9, comprimento: 90 };
const PASSAGEM = { z0: 0.3, z1: 1.7 };
/** o portão de correr: o meio dele fechado, e a linha do trilho (por dentro do muro da frente) */
const CORRER = { x: -5.7, z: JARDIM.z1 - 0.24 };
/** o pilar da boca da garagem (do lado do jardim) */
const X_DO_PILAR_DA_GARAGEM = CORRER.x + PORTAO_DA_GARAGEM.largura / 2 + MURO.ladoDoPilar / 2 - 0.1;

export const frenteDaCasa: SceneDef = {
  id: 'frente-da-casa',
  name: 'A frente da casa',
  subtitle: 'o jardim e a garagem',
  ambient: {
    sky: P.skyDay,
    fog: 0xbfe6f7,
    fogNear: 95,
    fogFar: 200,
    sunColor: 0xfff4da,
    sunIntensity: 1.7,
    ambientColor: 0xd8f0ff,
    ambientIntensity: 1.0,
    sunDir: [14, 22, 12],
  },
  spawn: { x: CASA.x, z: CASA.z + 1.5, facing: 0 },
  entries: {
    'da-casa': { x: CASA.x, z: CASA.z + 1.5, facing: 0 },
    'da-rua': { x: PORTAO.x + 3.2, z: (CALCADA.z0 + CALCADA.z1) / 2, facing: -Math.PI / 2 },
    // chegando de carro: na boca da garagem, na frente do carro estacionado
    'do-carro': { x: VAGA.x + 0.4, z: VAGA.z + BEBITO_MOBILE.comprimento / 2 + 0.95, facing: 0 },
  },

  build(w) {
    const g = w.game;
    const A = ARI.name;
    const R = RENAN.name;
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };

    // ------------------------------------------------------------------ o chão
    w.ground({ width: 120, depth: 90, color: P.grass, textura: tapeteDeGrama(9) });
    w.setBounds(GAR.x0 - 6, CASA.z - 0.2, JARDIM.x1 + 9, CALCADA.z1 - 0.3);
    // a rua, a calçada e a guia (a rua atravessa a cena inteira: some nas duas pontas)
    w.patch(0, (CALCADA.z0 + CALCADA.z1) / 2, RUA.comprimento, CALCADA.z1 - CALCADA.z0, P.concrete, 0, 0.014, calcadaDePedrinha());
    w.patch(0, (RUA.z0 + RUA.z1) / 2, RUA.comprimento, RUA.z1 - RUA.z0, P.asphalt, 0, 0.018, asfalto());
    // (a faixa tracejada é UMA malha: dezoito tracinhos soltos eram dezoito desenhos)
    const tracos: THREE.BufferGeometry[] = [];
    for (let x = -RUA.comprimento / 2 + 2; x <= RUA.comprimento / 2 - 2; x += 5) tracos.push(new THREE.PlaneGeometry(2, 0.22).translate(x, 0, 0));
    w.patch(0, (RUA.z0 + RUA.z1) / 2, 2, 0.22, P.metalWhite, 0, 0.022).geometry = mergeGeometries(tracos);
    w.add(w.place(meioFio(RUA.comprimento), 0, 0, RUA.z0, Math.PI / 2));
    // o piso da garagem e a rampinha até a rua
    w.patch(VAGA.x, (GAR.z0 + CALCADA.z0) / 2, GARAGEM.largura - 0.1, CALCADA.z0 - GAR.z0, P.concrete, 0, 0.016, pisoDePlacas(1.4));

    // ------------------------------------------------------------------ a casa
    w.add(fundir(w.place(fachadaDaCasa(), CASA.x, 0, CASA.z)));
    w.blockBox(CASA.x, CASA.z - FACHADA.fundo / 2, FACHADA.largura / 2 + 0.1, FACHADA.fundo / 2 + 0.12);

    // ---------------------------------------------------------------- a garagem
    // as paredes do fundo e do lado (altas: ficam no −Z e no −X), de reboco
    const parede = (x1: number, z1: number, x2: number, z2: number, alto: number): void => {
      const m = w.wall(x1, z1, x2, z2, alto, P.wallCream, 0.24);
      m.geometry = uvDeParede(m.geometry, m.position.x, m.position.y, m.position.z);
      m.material = toon(P.wallCream, { mapa: reboco() });
    };
    const altoDaGaragem = GARAGEM.alto + 0.1;
    parede(GAR.x0, GAR.z0, CASA.x - FACHADA.largura / 2 - 0.05, GAR.z0, altoDaGaragem);
    parede(GAR.x0, GAR.z0, GAR.x0, GAR.z1 + 0.12, altoDaGaragem);
    w.add(fundir(w.place(pergoladoDaGaragem(), VAGA.x, 0, (GAR.z0 + GAR.z1) / 2)));
    for (const z of [GAR.z0 + 0.5, (GAR.z0 + GAR.z1) / 2 - 0.2, GAR.z1 - 0.6]) w.blockCircle(GAR.x1 - 0.12, z, 0.1);

    /*
     * O JARDIM É UM GRUPO SÓ, juntado por material (`fundirComoFundo`): o muro,
     * os pilares, as lajes e os vasos são enfeite parado. As plantas já são
     * lote (uma espécie, um ou dois desenhos para o jardim inteiro).
     */
    const jardim = new THREE.Group();
    jardim.userData.peca = 'jardim-da-casa';
    const E = MURO.espessura;
    /** um trecho de muro entre dois pontos (em `x` ou em `z`), com o colisor; devolve a ficha dele para a hera */
    const muro = (x1: number, z1: number, x2: number, z2: number, alto: number = MURO.alto, hera?: Partial<MuroComHera>): void => {
      const comprimento = Math.hypot(x2 - x1, z2 - z1);
      const giro = Math.atan2(-(z2 - z1), x2 - x1);
      jardim.add(w.place(muroDoJardim(comprimento, alto), (x1 + x2) / 2, 0, (z1 + z2) / 2, giro));
      w.blockBox((x1 + x2) / 2, (z1 + z2) / 2, comprimento / 2, E / 2 + 0.02, -giro);
      if (hera) muros.push({ a: [x1, z1], b: [x2, z2], altura: alto, espessura: E + 0.1, ...hera });
    };
    const muros: MuroComHera[] = [];
    const pilar = (x: number, z: number, alto: number = MURO.pilar, luz = false): void => {
      jardim.add(w.place(pilarDoMuro(alto, luz), x, 0, z));
      w.blockBox(x, z, MURO.ladoDoPilar / 2, MURO.ladoDoPilar / 2);
    };

    // a MURETA entre a garagem e o jardim, com a passagem (ela para antes do trilho do portão de correr)
    const xMureta = JARDIM.x0;
    muro(xMureta, PASSAGEM.z0, xMureta, JARDIM.z0 + 0.12, 0.8, { cobre: 0.55, queda: 0.5, semente: 31 });
    muro(xMureta, PASSAGEM.z1, xMureta, JARDIM.z1 - 0.62, 0.8);

    // --------------------------------------------- o muro da frente e os portões
    const zMuro = JARDIM.z1;
    const meioPilar = MURO.ladoDoPilar / 2;
    const xPilarE = PORTAO.x - PORTAO.largura / 2 - meioPilar;
    const xPilarD = PORTAO.x + PORTAO.largura / 2 + meioPilar;
    // (a hera vai de `a` para `b` com o lado de FORA à esquerda: o da rua na frente, o do vizinho no lado)
    muro(X_DO_PILAR_DA_GARAGEM + meioPilar, zMuro, xPilarE - meioPilar, zMuro, MURO.alto, { cobre: 0.62, queda: 0.85, semente: 11 });
    muro(xPilarD + meioPilar, zMuro, JARDIM.x1 - meioPilar, zMuro, MURO.alto, { cobre: 0.6, queda: 0.8, semente: 12 });
    muro(JARDIM.x1, zMuro - meioPilar, JARDIM.x1, JARDIM.z0 + 0.14, MURO.alto, { cobre: 0.5, queda: 0.8, semente: 13 });
    pilar(X_DO_PILAR_DA_GARAGEM, zMuro, PORTAO_DA_GARAGEM.alto + 0.2);
    pilar(xPilarE, zMuro, MURO.pilar, true);
    pilar(xPilarD, zMuro, MURO.pilar, true);
    pilar(JARDIM.x1, zMuro);
    // (por dentro do muro da frente corre o portão da garagem quando abre: ninguém anda nessa faixa)
    w.blockBox((X_DO_PILAR_DA_GARAGEM + xPilarE) / 2, zMuro - 0.28, (xPilarE - X_DO_PILAR_DA_GARAGEM) / 2, 0.14);
    // o interfone e a boca de cartas, no pilar da direita do portão
    jardim.add(w.place(painelDoPortao(), xPilarD, 1.22, zMuro + meioPilar + 0.001));
    // a hera também desce da parede do fundo da garagem, por cima do carro
    muros.push({ a: [GAR.x0 + 0.3, GAR.z0], b: [GAR.x1 - 0.3, GAR.z0], altura: altoDaGaragem, espessura: 0.26, cobre: 0.55, queda: 1.1, semente: 14 });

    // o portão social: abre sozinho quando alguém chega perto, para dentro do jardim
    const portao = w.add(fundir(w.place(portaoSocial(PORTAO.largura), PORTAO.x, 0, zMuro)));
    const folha = portao.userData.folha as THREE.Object3D;
    let aberto = 0;
    w.onUpdate((dt) => {
      const p = g.playerPosition();
      const perto = Math.hypot(p.x - PORTAO.x, p.z - zMuro) < 2.2;
      aberto += ((perto ? 1 : 0) - aberto) * Math.min(1, dt * 4);
      folha.rotation.y = aberto * 1.75;
    });

    /*
     * O PORTÃO DE CORRER DA GARAGEM: fechado, é colisor; abre sozinho (é
     * automático) quando alguém chega perto da boca, ou quando a cena manda
     * (a chegada do carro). A folha corre para o `+X`, por dentro do muro.
     */
    w.add(fundir(w.place(trilhoDoPortao(), CORRER.x, 0, CORRER.z)));
    const correr = w.add(fundir(w.place(portaoDeCorrer(), CORRER.x, 0, CORRER.z)));
    const folhaDaGaragem = correr.userData.folha as THREE.Object3D;
    const colisorDoPortao: Collider = { kind: 'box', x: CORRER.x, z: CORRER.z, hw: PORTAO_DA_GARAGEM.largura / 2, hd: 0.12, rot: 0 };
    w.colliders.push(colisorDoPortao);
    const garagem = { aberto: 0, mandado: false, querAberto: false };
    w.onUpdate((dt) => {
      const p = g.playerPosition();
      const perto = Math.abs(p.x - VAGA.x) < 3.6 && Math.abs(p.z - CORRER.z) < 3.2;
      const quer = garagem.mandado || perto;
      if (quer !== garagem.querAberto) {
        garagem.querAberto = quer;
        g.som('portaoEletrico');
      }
      const antes = garagem.aberto;
      garagem.aberto = Math.max(0, Math.min(1, garagem.aberto + (quer ? 1 : -1) * dt * 0.55));
      // (sai devagar e chega devagar, como motor de portão)
      const k = garagem.aberto * garagem.aberto * (3 - 2 * garagem.aberto);
      folhaDaGaragem.position.x = k * PORTAO_DA_GARAGEM.corre;
      const fechado = garagem.aberto < 0.12;
      const estava = w.colliders.includes(colisorDoPortao);
      if (fechado && !estava) w.colliders.push(colisorDoPortao);
      if (!fechado && estava) w.colliders.splice(w.colliders.indexOf(colisorDoPortao), 1);
      if (antes < 1 && garagem.aberto >= 1) g.som('portaDoBebito');
    });

    // ----------------------------------------------------------------- o jardim
    /*
     * O JARDIM É GRAMA LIMPA de propósito (pedido do Renan, 2026-11-12): os
     * canteiros de casca e de pedrisco, com as hortênsias, a lavanda, os
     * agaves, o capim, a costela-de-adão e as margaridas, saíram — o quintal
     * vai ser DECORADO pelos dois, e o plano disso mora em `docs/QUINTAL.md`.
     * Ficaram o caminho de lajes, os dois buxinhos da porta, a árvore florida
     * e a hera dos muros. As plantas continuam no kit
     * (`world/plantasDeJardim.ts`): é delas que sai o catálogo do quintal.
     */
    // O CAMINHO DE LAJES, com a grama entre elas: da porta ao portão, e o ramal até a passagem da garagem
    const laje = toon(P.casaLaje, { mapa: reboco(1.1) });
    const lajes: Array<[number, number, number, number]> = [];
    for (let k = 0; k < 7; k++) lajes.push([CASA.x, -3.78 + k * 1.03, 1.5, 0.82]);
    for (let k = 0; k < 4; k++) lajes.push([0.72 - k * 1.03, (PASSAGEM.z0 + PASSAGEM.z1) / 2, 0.82, 1.15]);
    for (const [x, z, lx, lz] of lajes) {
      const geo = uvDeParede(quina(lx, 0.06, lz, 0.02), x, 0, z);
      jardim.add(w.place(new THREE.Mesh(geo, laje), x, 0.012, z));
    }

    // os dois buxinhos em vaso de cimento, um de cada lado do degrau da porta
    for (const [lado, semente] of [[-1, 1], [1, 2]] as const) {
      jardim.add(w.place(buxinhoNoVaso(0.3, semente), CASA.x + lado * 1.28, 0, CASA.z + 0.5, semente));
      w.blockCircle(CASA.x + lado * 1.28, CASA.z + 0.5, 0.3);
    }
    w.add(fundirComoFundo(jardim));

    w.add(heraNosMuros(muros));
    // a árvore florida no canto de trás da direita (alta: encostada na casa, não tapa nada)
    w.add(w.place(tree('florida', 0.9, 0.37), 5.6, 0, -2.8));
    w.blockCircle(5.6, -2.8, 0.4);

    // o poste da calçada
    w.add(w.place(lamp(), 8.6, 0, CALCADA.z0 + 0.5));
    w.blockCircle(8.6, CALCADA.z0 + 0.5, 0.25);

    // -------------------------------------------------------------- a vizinhança
    /*
     * A RUA É UMA RUA DE CASINHAS. Sem vizinho, a casa ficava num gramado sem
     * fim — e a chegada do carro, que é filmada de perto (câmera de cena, com
     * horizonte), mostrava o vazio. As vizinhas saem do MESMO molde da casa do
     * Ari, cada uma de uma cor; as do outro lado da rua dão a frente para cá.
     * O quintal de cada uma é fechado por uma sebe na linha da cerca: ninguém
     * entra no jardim dos outros.
     */
    // (quatro grupos — cada lado da rua, à esquerda e à direita da casa —, para o
    // que está fora da tela não ser desenhado: num grupo só, tudo ia sempre)
    const quadra = (nome: string): THREE.Group => {
      const grupo = new THREE.Group();
      grupo.userData.peca = nome;
      return grupo;
    };
    const coresDoJardim = [P.flowerPink, P.flowerYellow, 0xffffff, P.florDoArbusto];
    const doLado = [quadra('vizinhas-do-lado'), quadra('vizinhas-do-lado')];
    const deLa = [quadra('vizinhas-de-la'), quadra('vizinhas-de-la')];
    const lado = (x: number): number => (x < CASA.x ? 0 : 1);
    // do mesmo lado: duas de cada lado da casa do Ari
    const DO_LADO: Array<[number, CoresDaFachada]> = [
      [GAR.x0 - 7.2, { parede: P.vizinhaAmarela, telhado: P.vizinhaTelhaEscura, veneziana: P.vizinhaVenezianaAzul, porta: P.wood }],
      [GAR.x0 - 20.4, { parede: P.vizinhaVerde, telhado: P.vizinhaTelhaCinza, veneziana: P.casaBranco, porta: P.woodDark }],
      [JARDIM.x1 + 8.4, { parede: P.vizinhaRosa, telhado: P.vizinhaTelhaCinza, veneziana: P.casaBranco, porta: P.woodDark }],
      [JARDIM.x1 + 21.4, { parede: P.vizinhaAzul, telhado: P.roofTile, veneziana: P.vizinhaVenezianaMostarda, porta: P.wood }],
    ];
    for (const [x, cores] of DO_LADO) {
      doLado[lado(x)].add(w.place(fachadaDaCasa({ ...cores, vizinha: true }), x, 0, CASA.z));
      for (const s of [-1, 1]) doLado[lado(x)].add(w.place(flowers(6, 0.6, coresDoJardim), x + s * 2.8, 0, CASA.z + 1.2));
    }
    // a sebe da frente dos quintais vizinhos, na linha da cerca
    doLado[0].add(w.place(sebe(29.7, 1.0), GAR.x0 - 15.15, 0, JARDIM.z1 - 0.2));
    doLado[1].add(w.place(sebe(29.4, 1.0), JARDIM.x1 + 15.3, 0, JARDIM.z1 - 0.2));
    w.blockBox(GAR.x0 - 15.2, JARDIM.z1 - 0.2, 15, 0.5);
    w.blockBox(JARDIM.x1 + 15.4, JARDIM.z1 - 0.2, 15, 0.5);
    // o outro lado da rua: a calçada, a guia, a sebe e quatro casas de frente para cá
    const zDeLa = RUA.z1 + (CALCADA.z1 - CALCADA.z0);
    w.patch(0, (RUA.z1 + zDeLa) / 2, RUA.comprimento, zDeLa - RUA.z1, P.concrete, 0, 0.014, calcadaDePedrinha());
    w.add(w.place(meioFio(RUA.comprimento), 0, 0, RUA.z1, -Math.PI / 2));
    const DE_LA: Array<[number, CoresDaFachada]> = [
      [-20.5, { parede: P.vizinhaLilas, telhado: P.vizinhaTelhaCinza, veneziana: P.casaBranco, porta: P.woodDark }],
      [-6.5, { parede: P.vizinhaAzul, telhado: P.vizinhaTelhaEscura, veneziana: P.vizinhaVenezianaVinho, porta: P.wood }],
      [7.5, { parede: P.vizinhaAmarela, telhado: P.roofTile, veneziana: P.casaVeneziana, porta: P.woodDark }],
      [21.5, { parede: P.vizinhaVerde, telhado: P.vizinhaTelhaEscura, veneziana: P.vizinhaVenezianaAzul, porta: P.wood }],
    ];
    for (const [x, cores] of DE_LA) {
      const grupo = deLa[lado(x)];
      grupo.add(w.place(fachadaDaCasa({ ...cores, vizinha: true }), x, 0, zDeLa + 7.6, Math.PI));
      // o caminho de pedrinha da porta de cada uma, a sebe com o vão do portão e as flores do quintal
      w.patch(x, zDeLa + 4.1, 1.4, 6.6, P.sand, 0, 0.016, calcadaDePedrinha(1.6, 4));
      grupo.add(w.place(sebe(6, 1.0), x - 3.9, 0, zDeLa + 0.7));
      grupo.add(w.place(sebe(6, 1.0), x + 3.9, 0, zDeLa + 0.7));
      for (const s of [-1, 1]) grupo.add(w.place(flowers(7, 0.7, coresDoJardim), x + s * 2.6, 0, zDeLa + 4.6));
    }
    for (const grupo of [...doLado, ...deLa]) w.add(fundirComoFundo(grupo));
    // as árvores: nos quintais, atrás das casas dos dois lados, e fechando as pontas da rua
    const tipos = ['redonda', 'florida', 'redonda', 'pinheiro', 'redonda'] as const;
    const plantar = (x: number, z: number, tamanho = w.range(1.0, 1.4)): void => {
      w.add(w.place(tree(w.pick(tipos), tamanho, w.rng()), x, 0, z, w.range(0, 6.28)));
    };
    // (atrás das casas deste lado: uma fileira cheia, que é o fundo da vista de sempre)
    for (let x = -42; x <= 42; x += 6) plantar(x + w.range(-1.2, 1.2), CASA.z - FACHADA.fundo - w.range(3.2, 6.5), w.range(1.35, 1.9));
    for (let x = -38; x <= 38; x += 10.5) plantar(x + w.range(-2, 2), CASA.z - FACHADA.fundo - w.range(9, 13), w.range(1.7, 2.2));
    // (entre as vizinhas deste lado, e no quintal delas)
    for (const x of [GAR.x0 - 13.8, GAR.x0 - 27, JARDIM.x1 + 15, JARDIM.x1 + 28]) plantar(x, CASA.z - 1.6, 1.3);
    for (const x of [GAR.x0 - 3.6, GAR.x0 - 17.5, JARDIM.x1 + 4.6, JARDIM.x1 + 17.6]) plantar(x, 0.6, 0.95);
    // (do outro lado: entre as casas e atrás delas)
    for (const x of [-27.5, -13.5, 0.5, 14.5, 28.5]) plantar(x, zDeLa + 6.5, 1.25);
    for (let x = -40; x <= 40; x += 8.8) plantar(x + w.range(-1.5, 1.5), zDeLa + 7.6 + FACHADA.fundo + w.range(3, 7.5), w.range(1.5, 2.0));
    // (as pontas da rua: ela some atrás das copas)
    for (const lado of [-1, 1]) {
      for (const z of [CALCADA.z0 - 1.2, zDeLa + 1.6]) plantar(lado * 36, z, 1.5);
      plantar(lado * 43, (RUA.z0 + RUA.z1) / 2 + lado * 1.5, 2.0);
    }
    // o céu: nuvens paradas no alto, longe
    for (let i = 0; i < 7; i++) {
      const c = cloud(w.range(1.8, 3));
      c.position.set(w.range(-60, 60), w.range(26, 36), i % 2 ? w.range(-55, -30) : w.range(34, 58));
      w.root.add(c);
      const vento = w.range(0.2, 0.5);
      w.onUpdate((dt) => {
        c.position.x += vento * dt;
        if (c.position.x > 62) c.position.x = -62;
      });
    }

    // ------------------------------------------------------------- as passagens
    w.door({
      x: CASA.x, z: CASA.z + 0.9, radius: 1.5,
      to: 'casa', entry: 'da-rua',
      label: 'Entrar em casa', icon: '🏠',
    });
    w.door({
      x: PORTAO.x + 6.6, z: (CALCADA.z0 + CALCADA.z1) / 2, radius: 1.8,
      to: 'villa-lobos', entry: 'portao',
      label: 'Ir pro parque', icon: '🌳',
    });

    // ------------------------------------------------------- o Bebito Mobile
    /*
     * O CARRO MORA NA GARAGEM depois do presente. Enquanto o Renan foi buscar
     * (a quest no meio), ele existe fora de vista, de laço no teto, e a
     * chegada o traz (`eventos/bebitoMobile/presente.ts`).
     */
    const chegando = renanFoiBuscar(g);
    // (quando a dupla foi de carro para o parque, a garagem fica vazia até eles voltarem)
    const carroNoParque = g.flag(FLAG_DO_CARRO_NO_PARQUE);
    if (chegando || (temBebitoMobile(g) && !carroNoParque)) {
      const ficha = g.fichaDoBebitoMobile();
      if (chegando) ficha.vagas.teto = ['laco-de-presente'];
      const carro = new BebitoMobile(ficha);
      w.add(fundir(w.place(carro.group, VAGA.x, 0, VAGA.z)));
      w.onUpdate((dt) => carro.update(dt));
      const estacionar = (): void => {
        w.blockBox(VAGA.x, VAGA.z, BEBITO_MOBILE.largura / 2 - 0.08, BEBITO_MOBILE.comprimento / 2 - 0.1);
        w.interact({
          id: 'frente:bebito-mobile',
          x: VAGA.x + 0.4, z: VAGA.z + BEBITO_MOBILE.comprimento / 2 + 0.9, radius: 2.1,
          label: 'Olhar o Bebito Mobile', icon: '🚙',
          highlight: carro.group,
          onInteract: async () => {
            const vez = g.bump('bebito:olhadas') % 3;
            const olhadas: Array<Array<readonly [string, string]>> = [
              [[A, 'Ele tá sorrindo pra gente.'], [R, 'É a grade. Mas eu também acho.']],
              [[R, 'O Jean-Luc tá de olho no painel.'], [A, 'Ele balança a cabeça concordando com tudo.']],
              [[A, 'Cabe todo mundo no banco de trás.'], [R, 'Cabe até a gente deitado.']],
            ];
            await conversa(olhadas[vez]);
          },
        });
        // a porta do motorista: é por ela que se sai de carro (`eventos/bebitoMobile/partida.ts`)
        w.interact({
          id: 'frente:sair-de-carro',
          x: VAGA.x + BEBITO_MOBILE.largura / 2 + 0.55, z: VAGA.z + 0.5, radius: 1.5,
          label: 'Sair de carro', icon: '🚙',
          highlight: carro.group,
          priority: 2,
          onInteract: async () => {
            await sairDeCarro(g, 'ida');
          },
        });
      };
      if (chegando) {
        chegadaDoBebito(w, {
          carro,
          vaga: VAGA,
          rua: { z: RUA.faixa, deLonge: 30 },
          porta: { x: CASA.x, z: CASA.z + 1.6 },
          aoEstacionar: estacionar,
          portao: (sim) => { garagem.mandado = sim; },
        });
      } else estacionar();
    }
  },
};
