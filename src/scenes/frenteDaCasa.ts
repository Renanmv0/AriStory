import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Collider, SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { ARI, RENAN } from '../characters/cast';
import { cloud, flowers, lamp, meioFio, sebe, tree } from '../world/props';
import { caminhoDoQuintal, type TrechoDeCaminho } from '../world/caminhosDoQuintal';
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
import { BEBITO_MOBILE, BebitoMobile } from '../world/bebitoMobile/BebitoMobile';
import { chegadaDoBebito, renanFoiBuscar, temBebitoMobile } from '../eventos/bebitoMobile/presente';
import { sairDeCarro } from '../eventos/bebitoMobile/partida';
import { FLAG_DO_CARRO_NO_PARQUE } from '../eventos/BebitoMobile';
import { Decorador, type Cofre, type RegrasDoLugar, type Superficie } from '../world/decorador';
import type { FichaDeDecoracao } from '../world/decoracoes';
import { VENTO_DO_QUINTAL } from '../world/decoracoesDoQuintal';
import { caixaDeEncomenda, painelDeFerramentas } from '../world/quintal';
import { regadorDeJardim } from '../world/regador';
import { Pelusa } from '../entities/bichos/Pelusa';
import type { Interactable } from '../world/Interactable';
import {
  FLAG_SEM_HERA, abrirAEncomenda, caminhoAtivo, conteudoDoBau, encomendasACaminho, plantarAArvoreDaCasa, trocarHera, usarCaminho,
} from '../eventos/quintal';

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
    /*
     * O CAMINHO DA CASA: da porta ao portão, e o ramal até a passagem da
     * garagem. Nasceu de lajes com a grama entre elas; o Papita vende outros
     * jeitos, e as ferramentas da garagem trocam (`world/caminhosDoQuintal.ts`).
     * O TRAÇADO é sempre esse — é ele que a regra do quintal deixa livre.
     */
    const TRECHOS: TrechoDeCaminho[] = [
      { a: [CASA.x, -4.19], b: [CASA.x, 2.89], largura: 1.5 },
      { a: [1.13, (PASSAGEM.z0 + PASSAGEM.z1) / 2], b: [-2.68, (PASSAGEM.z0 + PASSAGEM.z1) / 2], largura: 1.15 },
    ];
    let caminho: THREE.Object3D | null = null;
    const montarCaminho = (): void => {
      if (caminho) {
        w.root.remove(caminho);
        caminho.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
      }
      caminho = w.add(fundirComoFundo(caminhoDoQuintal(caminhoAtivo(g), TRECHOS)));
    };
    montarCaminho();

    // os dois buxinhos em vaso de cimento, um de cada lado do degrau da porta
    for (const [lado, semente] of [[-1, 1], [1, 2]] as const) {
      jardim.add(w.place(buxinhoNoVaso(0.3, semente), CASA.x + lado * 1.28, 0, CASA.z + 0.5, semente));
      w.blockCircle(CASA.x + lado * 1.28, CASA.z + 0.5, 0.3);
    }
    w.add(fundirComoFundo(jardim));

    // a HERA dos muros: dá para tirar (e pôr de volta) pelas ferramentas da garagem
    const hera = heraNosMuros(muros);
    if (!g.flag(FLAG_SEM_HERA)) w.add(hera);
    /*
     * A ÁRVORE FLORIDA do canto de trás da direita é PEÇA DO QUINTAL desde a
     * etapa 2 (`docs/QUINTAL.md`): na primeira visita ela entra no save no
     * lugar de sempre, e o decorador a monta (com o colisor do tronco) — e
     * guarda e muda de lugar, como qualquer enfeite.
     */
    plantarAArvoreDaCasa(g, { x: 5.6, z: -2.8 });

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

    // ------------------------------------------------------ o quintal decorado
    /*
     * O QUINTAL DECORADO (`docs/QUINTAL.md`): o MESMO decorador da estufa, com
     * as regras daqui. O que se põe vem do baú, e o baú enche pelo correio (o
     * Papita Delivery, no computador do quarto). Pôr e arrumar é pelas
     * ferramentas da garagem — "pelas ferramentas na garagem para editar as
     * decorações", o Renan.
     */
    const traseiraDoCarro = VAGA.z - BEBITO_MOBILE.comprimento / 2;
    const FERRAMENTAS = { x: -3.95, z: GAR.z0 + 0.13 };
    const alturas = new Map<string, number>();
    /** a altura de um enfeite, medida do modelo uma vez só */
    const altoDe = (ficha: FichaDeDecoracao): number => {
      let alto = alturas.get(ficha.id);
      if (alto === undefined) {
        const peca = ficha.monta();
        alto = new THREE.Box3().setFromObject(peca).max.y;
        peca.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
        alturas.set(ficha.id, alto);
      }
      return alto;
    };
    const dentro = (x: number, z: number, r: number, x0: number, x1: number, z0: number, z1: number): boolean =>
      x - r >= x0 && x + r <= x1 && z - r >= z0 && z + r <= z1;
    /*
     * AS SUPERFÍCIES DO QUINTAL (etapa 3): onde se prende o que não vai no
     * chão. Só as paredes que a câmera VÊ (a câmera vem do `+X/+Z`): a fachada,
     * as duas paredes da garagem por dentro, a face de fora do muro (a da rua
     * e a do lado), e a mureta do lado do jardim. Os tampos são o alto do muro
     * e da mureta; as vigas, a do pergolado do lado do jardim e o beiral.
     */
    const xCasa0 = CASA.x - FACHADA.largura / 2;
    const xCasa1 = CASA.x + FACHADA.largura / 2;
    const jx = FACHADA.janela.x;
    const meiaJanela = FACHADA.janela.largura / 2 + 0.5; // (com as venezianas abertas)
    const buracoX = (x0: number, x1: number, y0: number, y1: number, nome: string, a = xCasa0 + 0.1) =>
      ({ s0: x0 - a, s1: x1 - a, y0, y1, nome });
    const yTopoDoMuro = MURO.alto + 0.02;
    const fora = zMuro + E / 2 + 0.002;
    const SUPERFICIES: Superficie[] = [
      {
        id: 'fachada', tipo: 'parede', nome: 'a fachada', a: [xCasa0 + 0.1, CASA.z], b: [xCasa1 - 0.1, CASA.z], y0: 0.3, y1: 2.95, normal: [0, 1],
        buracos: [
          buracoX(CASA.x - 0.7, CASA.x + 0.7, 0, 2.35, 'da porta'),
          buracoX(CASA.x + 0.72, CASA.x + 1.32, 1.55, 2.5, 'do lampião'),
          buracoX(CASA.x - jx - meiaJanela, CASA.x - jx + meiaJanela, 0.62, 2.45, 'da janela'),
          buracoX(CASA.x + jx - meiaJanela, CASA.x + jx + meiaJanela, 0.62, 2.45, 'da janela'),
        ],
      },
      {
        id: 'garagem-fundo', tipo: 'parede', nome: 'a parede da garagem', a: [GAR.x0 + 0.2, GAR.z0 + 0.12], b: [GAR.x1 - 0.25, GAR.z0 + 0.12],
        y0: 0.4, y1: 2.15, normal: [0, 1],
        buracos: [
          { s0: FERRAMENTAS.x - 0.7 - (GAR.x0 + 0.2), s1: FERRAMENTAS.x + 0.7 - (GAR.x0 + 0.2), y0: 0.7, y1: 2.0, nome: 'das ferramentas' },
          { s0: VAGA.x - 1.6 - (GAR.x0 + 0.2), s1: VAGA.x - 0.2 - (GAR.x0 + 0.2), y0: 0.95, y1: 1.65, nome: 'da prateleira' },
        ],
      },
      { id: 'garagem-lado', tipo: 'parede', nome: 'a parede da garagem', a: [GAR.x0 + 0.12, GAR.z0 + 0.2], b: [GAR.x0 + 0.12, GAR.z1 - 0.3], y0: 0.4, y1: 2.6, normal: [1, 0] },
      { id: 'muro-rua-1', tipo: 'parede', nome: 'o muro', a: [X_DO_PILAR_DA_GARAGEM + meioPilar, fora], b: [xPilarE - meioPilar, fora], y0: 0.2, y1: 1.3, normal: [0, 1] },
      { id: 'muro-rua-2', tipo: 'parede', nome: 'o muro', a: [xPilarD + meioPilar, fora], b: [JARDIM.x1 - meioPilar, fora], y0: 0.2, y1: 1.3, normal: [0, 1] },
      { id: 'muro-lado', tipo: 'parede', nome: 'o muro', a: [JARDIM.x1 + E / 2 + 0.002, JARDIM.z0 + 0.2], b: [JARDIM.x1 + E / 2 + 0.002, zMuro - meioPilar], y0: 0.2, y1: 1.3, normal: [1, 0] },
      { id: 'mureta-1', tipo: 'parede', nome: 'a mureta', a: [JARDIM.x0 + E / 2 + 0.002, JARDIM.z0 + 0.2], b: [JARDIM.x0 + E / 2 + 0.002, PASSAGEM.z0], y0: 0.1, y1: 0.75, normal: [1, 0] },
      // os tampos: o alto do muro da frente, do muro do lado e da mureta (de onde se põe: do jardim)
      { id: 'topo-rua-1', tipo: 'emCima', nome: 'o muro', a: [X_DO_PILAR_DA_GARAGEM + meioPilar, zMuro], b: [xPilarE - meioPilar, zMuro], y0: yTopoDoMuro, normal: [0, -1] },
      { id: 'topo-rua-2', tipo: 'emCima', nome: 'o muro', a: [xPilarD + meioPilar, zMuro], b: [JARDIM.x1 - meioPilar, zMuro], y0: yTopoDoMuro, normal: [0, -1] },
      { id: 'topo-lado', tipo: 'emCima', nome: 'o muro', a: [JARDIM.x1, JARDIM.z0 + 0.2], b: [JARDIM.x1, zMuro - meioPilar], y0: yTopoDoMuro, normal: [-1, 0] },
      { id: 'topo-mureta-1', tipo: 'emCima', nome: 'a mureta', a: [JARDIM.x0, JARDIM.z0 + 0.2], b: [JARDIM.x0, PASSAGEM.z0], y0: 0.82, normal: [1, 0] },
      { id: 'topo-mureta-2', tipo: 'emCima', nome: 'a mureta', a: [JARDIM.x0, PASSAGEM.z1], b: [JARDIM.x0, zMuro - 0.62], y0: 0.82, normal: [1, 0] },
      // as vigas: a do pergolado do lado do jardim e o beiral da casa
      { id: 'viga-pergolado', tipo: 'pendurado', nome: 'a viga do pergolado', a: [GAR.x1 - 0.12, GAR.z0 + 0.3], b: [GAR.x1 - 0.12, GAR.z1 - 0.4], y0: GARAGEM.alto - 0.08, normal: [0, 0] },
      { id: 'beiral', tipo: 'pendurado', nome: 'o beiral', a: [xCasa0 - 0.2, CASA.z + 0.42], b: [xCasa1 + 0.2, CASA.z + 0.42], y0: FACHADA.alto - 0.12, normal: [0, 0] },
    ];
    // os pontos de amarrar o de ponta a ponta: o alto dos pilares, os postes do pergolado e o beiral
    const AMARRAS = [
      { x: X_DO_PILAR_DA_GARAGEM, y: PORTAO_DA_GARAGEM.alto + 0.2, z: zMuro },
      { x: xPilarE, y: MURO.pilar, z: zMuro },
      { x: xPilarD, y: MURO.pilar, z: zMuro },
      { x: JARDIM.x1, y: MURO.pilar, z: zMuro },
      ...[GAR.z0 + 0.5, (GAR.z0 + GAR.z1) / 2 - 0.2, GAR.z1 - 0.6].map((z) => ({ x: GAR.x1 - 0.12, y: GARAGEM.alto - 0.05, z })),
      ...[xCasa0 + 0.3, CASA.x - 1.6, CASA.x + 1.6, xCasa1 - 0.3].map((x) => ({ x, y: FACHADA.alto - 0.15, z: CASA.z + 0.42 })),
    ];
    const regrasDoQuintal: RegrasDoLugar = {
      ondeGuardar: 'pelas ferramentas da garagem',
      superficies: SUPERFICIES,
      amarras: AMARRAS,
      proibido: (x, z, r, ficha) => {
        const noJardim = dentro(x, z, r, JARDIM.x0 + E / 2 + 0.04, JARDIM.x1 - E / 2 - 0.04, CASA.z + 0.08, zMuro - E / 2 - 0.04);
        // o fundo da garagem, atrás do carro e fora do corredor das ferramentas
        const naGaragem = dentro(x, z, r, GAR.x0 + 0.16, FERRAMENTAS.x - 0.75, GAR.z0 + 0.16, traseiraDoCarro - 0.3);
        if (!noJardim && !naGaragem) return 'fora do quintal';
        if (noJardim) {
          // o caminho de lajes (da porta ao portão) e o ramal até a passagem da mureta
          if (Math.abs(x - CASA.x) < 0.75 + r + 0.06) return 'no caminho de lajes';
          if (x < CASA.x && Math.abs(z - (PASSAGEM.z0 + PASSAGEM.z1) / 2) < 0.6 + r) return 'no caminho da garagem';
          if (Math.hypot(x - PORTAO.x, z - zMuro) < 1.5 + r) return 'na frente do portão';
          // o que é ALTO fica longe dos muros do lado da câmera: senão tapa o quintal
          // (o muro da direita só tapa da metade do jardim para a frente: no fundo, encostado na casa, pode — é onde a árvore nasceu)
          if (ficha && altoDe(ficha) > 1.45 && (zMuro - z < 2.3 || (JARDIM.x1 - x < 2.3 && z > CASA.z + 2.6))) return 'alto demais perto do muro';
        }
        return null;
      },
    };
    const reais: Cofre = {
      saldo: () => g.carteira(),
      gastar: (n) => g.gastar(n),
      escrever: (n) => `R$ ${n}`,
      icone: '💰',
    };
    const decorador = new Decorador(w, regrasDoQuintal, reais, 'quintal');
    // (os testes acham o decorador por aqui, como na estufa)
    w.root.userData.decorador = decorador;

    /*
     * O PELUSA NO QUINTAL (etapa 4): com a casinha dele posta, ele vem morar
     * aqui fora também — tira um cochilo na porta da casinha, metade dentro,
     * metade fora, e aceita carinho. Guardou a casinha, ele volta para dentro.
     */
    let pelusa: Pelusa | null = null;
    let carinhoNoPelusa: Interactable | null = null;
    const verOPelusa = (): void => {
      const casinha = decorador.pecas().find((p) => p.ficha.id === 'quintal-casinha-do-pelusa');
      if (casinha && !pelusa) {
        const f = casinha.giro;
        const px = casinha.x + Math.sin(f) * 0.24;
        const pz = casinha.z + Math.cos(f) * 0.24;
        pelusa = new Pelusa({ minX: px - 0.1, maxX: px + 0.1, minZ: pz - 0.1, maxZ: pz + 0.1 });
        pelusa.sentarEm(px, pz, f, 0.04);
        pelusa.deitar(true);
        pelusa.aoSoar = () => g.som('miado');
        w.add(pelusa.group);
        const gato = pelusa;
        carinhoNoPelusa = w.interact({
          id: 'frente:pelusa',
          x: px + Math.sin(f) * 0.5, z: pz + Math.cos(f) * 0.5, radius: 1.2,
          label: 'Fazer carinho no Pelusa', icon: '🐈',
          highlight: gato.group,
          onInteract: async () => {
            gato.receberCarinho();
            g.som('miado');
            if (!g.flag('quintal:pelusa-na-casinha')) {
              g.setFlag('quintal:pelusa-na-casinha');
              await g.say(['Ele gostou da casinha.'], g.companionName());
              await g.say(['Ele gostou foi da almofada.'], g.playerName());
            }
          },
        });
        if (decorador.ocupado) carinhoNoPelusa.enabled = false;
      } else if (!casinha && pelusa) {
        w.root.remove(pelusa.group);
        const i = carinhoNoPelusa ? w.interactables.indexOf(carinhoNoPelusa) : -1;
        if (i >= 0) w.interactables.splice(i, 1);
        pelusa = null;
        carinhoNoPelusa = null;
      }
    };
    decorador.aoMudar = verOPelusa;
    verOPelusa();
    w.onUpdate((dt) => pelusa?.update(dt));

    /*
     * O REGADOR (etapa 4): "Plantas não PRECISAM ser regadas, mas podem." Ele
     * mora na prateleira das ferramentas; pego, vai na mão de quem joga, e
     * perto de cada planta aparece o "Regar…": a água sai em arco do bico, a
     * planta dá uma balançadinha de contente. Nada murcha sem ele.
     */
    let comRegador = false;
    const pegarRegador = (sim: boolean): void => {
      comRegador = sim;
      g.segurarNaCena(g.playerId(), sim ? regadorDeJardim() : null, 'regando');
      g.toast(sim ? 'Regador na mão: chegue perto de uma planta' : 'Regador de volta na prateleira', '💧');
    };
    const gotas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 6, 4).scale(1, 1.4, 1), toon(P.jatoAgua, { opacity: 0.85 }), 18);
    gotas.visible = false;
    gotas.frustumCulled = false;
    w.root.add(gotas);
    /** a planta que o "Regar…" está mirando agora */
    let plantaNaMira: number | null = null;
    const regar = w.interact({
      id: 'frente:regar',
      x: 0, z: 0, radius: 1.6,
      label: 'Regar', icon: '💧',
      priority: 1,
      onInteract: async () => {
        const alvo = decorador.pecas().find((p) => p.uid === plantaNaMira);
        if (!alvo) return;
        g.lockPlayer(true);
        const eu = g.playerPosition();
        const f = Math.atan2(alvo.x - eu.x, alvo.z - eu.z);
        g.releasePlayer(eu.x, eu.z, f);
        g.lockPlayer(true);
        // o arco de gotas, do bico até a planta
        const bico = new THREE.Vector3(eu.x + Math.sin(f) * 0.55, 0.95, eu.z + Math.cos(f) * 0.55);
        const fim = new THREE.Vector3(alvo.x, 0.35, alvo.z);
        const m = new THREE.Matrix4();
        gotas.visible = true;
        for (let k = 0; k < 42; k++) {
          if (k % 14 === 0) g.som('jato');
          for (let i = 0; i < gotas.count; i++) {
            const t = ((k / 42) * 3 + i / gotas.count) % 1;
            const p = bico.clone().lerp(fim, t);
            p.y += Math.sin(t * Math.PI) * 0.25 - t * 0.1;
            p.x += Math.sin(i * 7.3) * 0.05 * t;
            p.z += Math.cos(i * 5.1) * 0.05 * t;
            m.makeTranslation(p.x, p.y, p.z);
            gotas.setMatrixAt(i, m);
          }
          gotas.instanceMatrix.needsUpdate = true;
          // a planta balança de contente
          alvo.peca.scale.setScalar(1 + Math.sin(k * 0.45) * 0.025);
          await g.wait(1 / 30);
        }
        gotas.visible = false;
        alvo.peca.scale.setScalar(1);
        g.som('brotar');
        g.bump('quintal:regadas');
        const nome = alvo.ficha.nome.charAt(0).toLowerCase() + alvo.ficha.nome.slice(1);
        g.toast(`${alvo.ficha.artigo === 'a' ? 'A' : 'O'} ${nome} agradece`, '💧');
        g.lockPlayer(false);
      },
    });
    regar.enabled = false;
    w.onUpdate(() => {
      if (!comRegador || decorador.ocupado) {
        regar.enabled = false;
        return;
      }
      const eu = g.playerPosition();
      let melhor: ReturnType<typeof decorador.pecas>[number] | null = null;
      let d = 1.9;
      for (const p of decorador.pecas()) {
        if (!(p.ficha as { regavel?: boolean }).regavel) continue;
        const dd = Math.hypot(p.x - eu.x, p.z - eu.z);
        if (dd < d) {
          d = dd;
          melhor = p;
        }
      }
      regar.enabled = !!melhor;
      if (melhor) {
        regar.moveTo(melhor.x, melhor.z);
        plantaNaMira = melhor.uid;
        regar.label = `Regar ${melhor.ficha.artigo} ${melhor.ficha.nome.charAt(0).toLowerCase()}${melhor.ficha.nome.slice(1)}`;
      }
    });
    w.onUpdate((dt) => VENTO_DO_QUINTAL.tique(dt));

    // AS FERRAMENTAS DA GARAGEM: o painel na parede do fundo, ao lado do carro
    const painel = w.add(fundir(w.place(painelDeFerramentas(), FERRAMENTAS.x, 0, FERRAMENTAS.z)));
    w.blockBox(FERRAMENTAS.x, FERRAMENTAS.z + 0.18, 0.66, 0.2);
    w.interact({
      id: 'frente:ferramentas',
      x: FERRAMENTAS.x, z: FERRAMENTAS.z + 0.95, radius: 1.3,
      label: 'Decorar o quintal', icon: '🧰',
      highlight: painel,
      onInteract: async () => {
        if (decorador.ocupado) return;
        const saida = await g.abrirBauDoQuintal(conteudoDoBau(g, comRegador));
        if (saida?.tipo === 'colocar') decorador.colocar(saida.id);
        else if (saida?.tipo === 'editar') decorador.editar();
        else if (saida?.tipo === 'caminho' && usarCaminho(g, saida.id)) {
          montarCaminho();
          g.som('brotar');
          g.toast('Caminho novo da porta ao portão', '🛤️');
        } else if (saida?.tipo === 'regador') {
          pegarRegador(!comRegador);
        } else if (saida?.tipo === 'hera') {
          const ficou = trocarHera(g);
          if (ficou) w.add(hera);
          else w.root.remove(hera);
          g.som(ficou ? 'brotar' : 'menu');
          g.toast(ficou ? 'A hera voltou para os muros' : 'Os muros sem hera', '🌿');
        }
      },
    });

    /*
     * A ENCOMENDA DO PAPITA: o que foi pedido no computador espera numa caixa
     * de papelão ao lado do caminho de lajes, logo depois do portão. (Ao pé do
     * pilar ela sumia: 1,35 m de muro do lado da câmera escondem uma caixa de
     * 40 cm até um metro e meio atrás dele.) Abrir põe tudo no baú.
     */
    if (encomendasACaminho(g) > 0) {
      const quantas = encomendasACaminho(g);
      const ENCOMENDA = { x: CASA.x + 1.2, z: zMuro - 2.0 };
      const caixa = w.add(fundir(w.place(caixaDeEncomenda(quantas > 3 ? 1.25 : 1), ENCOMENDA.x, 0, ENCOMENDA.z, -0.35)));
      const colisor: Collider = { kind: 'circle', x: ENCOMENDA.x, z: ENCOMENDA.z, r: 0.36 };
      w.colliders.push(colisor);
      const ponto = w.interact({
        id: 'frente:encomenda',
        x: ENCOMENDA.x, z: ENCOMENDA.z, radius: 1.4,
        label: 'Abrir a encomenda', icon: '📦',
        highlight: caixa,
        priority: 2,
        onInteract: async () => {
          const chegou = abrirAEncomenda(g);
          g.som('pegar');
          w.root.remove(caixa);
          w.colliders.splice(w.colliders.indexOf(colisor), 1);
          ponto.enabled = false;
          const lista = chegou.length > 3 ? `${chegou.slice(0, 3).join(', ')} e mais ${chegou.length - 3}` : chegou.join(', ');
          await g.say([`Chegou do Papita Delivery: ${lista}.`, 'Foi tudo para as ferramentas da garagem.'], g.companionName());
        },
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
