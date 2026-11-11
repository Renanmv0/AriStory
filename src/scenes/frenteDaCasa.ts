import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { ARI, RENAN } from '../characters/cast';
import { canteiro, cloud, flowers, lamp, meioFio, sebe, tree } from '../world/props';
import { arbustoFlorido } from '../world/acampamento';
import { asfalto, calcadaDePedrinha, pisoDePlacas, tapeteDeGrama } from '../world/texturasDeChao';
import { reboco } from '../world/texturasDeFachada';
import { toon } from '../core/materials';
import { uvDeParede } from '../world/acabamento';
import { fundir, fundirComoFundo } from '../world/fundir';
import { FACHADA, GARAGEM, caixaDeCorreio, cercaBranca, fachadaDaCasa, pergoladoDaGaragem, portaozinho, type CoresDaFachada } from '../world/frenteDaCasa';
import { BEBITO_MOBILE, BebitoMobile } from '../world/bebitoMobile/BebitoMobile';
import { chegadaDoBebito, renanFoiBuscar, temBebitoMobile } from '../eventos/bebitoMobile/presente';

/**
 * A FRENTE DA CASA DO ARI: o jardim e a garagem.
 *
 * Nasceu com o Bebito Mobile (`docs/BEBITO-MOBILE.md`), e só existe no jogo
 * com a chave dele ligada (`eventos/BebitoMobile.ts`): aí a porta da rua da
 * casa sai AQUI, e é o portãozinho do jardim que leva ao parque. O pedido do
 * Renan: "ao sair tem um jardinzinho e ao lado uma garagem onde fica o carro;
 * o jardim é florido e fechado dos dois lados".
 *
 * A PLANTA (a câmera vem do `+X/+Z`; o que é alto fica no `−X` e no `−Z`):
 *
 *        −Z  ┌──────────────┬─────────────────────────────┐
 *            │   garagem    │        a casa (fachada)     │
 *            │  (pergolado) │   janela   PORTA   janela   │
 *            │              ├─────────────────────────────┤
 *            │   o carro    │  canteiros   │    canteiros │
 *            │  de nariz    m    o JARDIM  caminho        cerca
 *            │  para a rua  u              │              │
 *            │              ·  passagem    │              │
 *            └── a boca ────┴── cerca ── portão ── cerca ─┘
 *               ════════════  a calçada  ═════════════════
 *               ════════════     a rua    ════════════════   +Z
 *
 * O jardim é fechado dos dois lados: do lado da garagem, por uma mureta com
 * flor em cima (e uma passagem, para ir do carro à porta); do outro, pela
 * cerquinha branca — baixa, porque é o lado da câmera.
 */

const CASA = { x: 2, z: -5 };
const JARDIM = { x0: -2.9, x1: 6.7, z0: CASA.z, z1: 3 };
const VAGA = { x: -5.6, z: -1.2 };
const GAR = { x0: VAGA.x - GARAGEM.largura / 2, x1: VAGA.x + GARAGEM.largura / 2, z0: CASA.z, z1: CASA.z + GARAGEM.fundo };
const PORTAO = { x: CASA.x, largura: 1.3 };
const CALCADA = { z0: 3.2, z1: 5.7 };
const RUA = { z0: 5.7, z1: 13.7, faixa: 7.9, comprimento: 90 };
const PASSAGEM = { z0: 0.3, z1: 1.7 };

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
    // o piso da garagem e a rampinha até a rua; o caminho de pedrinha da porta ao portão
    w.patch(VAGA.x, (GAR.z0 + CALCADA.z0) / 2, GARAGEM.largura - 0.1, CALCADA.z0 - GAR.z0, P.concrete, 0, 0.016, pisoDePlacas(1.4));
    w.patch(CASA.x, (JARDIM.z0 + CALCADA.z0) / 2 + 0.2, 1.5, CALCADA.z0 - JARDIM.z0 - 0.4, P.sand, 0, 0.016, calcadaDePedrinha(1.6, 4));
    // a passagem da garagem para o jardim
    w.patch((GAR.x1 + CASA.x) / 2 - 0.4, (PASSAGEM.z0 + PASSAGEM.z1) / 2, CASA.x - GAR.x1 + 0.4, 1.1, P.sand, 0, 0.016, calcadaDePedrinha(1.6, 4));

    // ------------------------------------------------------------------ a casa
    w.add(fundir(w.place(fachadaDaCasa(), CASA.x, 0, CASA.z)));
    w.blockBox(CASA.x, CASA.z - FACHADA.fundo / 2, FACHADA.largura / 2 + 0.1, FACHADA.fundo / 2 + 0.12);

    // ---------------------------------------------------------------- a garagem
    // as paredes do fundo e do lado (altas: ficam no −Z e no −X), de reboco, com o capeamento
    const parede = (x1: number, z1: number, x2: number, z2: number, alto: number): void => {
      const m = w.wall(x1, z1, x2, z2, alto, P.wallCream, 0.24);
      m.geometry = uvDeParede(m.geometry, m.position.x, m.position.y, m.position.z);
      m.material = toon(P.wallCream, { mapa: reboco() });
    };
    parede(GAR.x0, GAR.z0, GAR.x1 + 0.2, GAR.z0, GARAGEM.alto + 0.1);
    parede(GAR.x0, GAR.z0, GAR.x0, GAR.z1, GARAGEM.alto + 0.1);
    w.add(fundir(w.place(pergoladoDaGaragem(), VAGA.x, 0, (GAR.z0 + GAR.z1) / 2)));
    for (const x of [GAR.x0 + 0.16, GAR.x1 - 0.16]) {
      for (const z of [GAR.z1 - 0.25, (GAR.z0 + GAR.z1) / 2 - 0.4]) w.blockCircle(x, z, 0.13);
    }
    // a MURETA entre a garagem e o jardim, com flor em cima, e a passagem
    const xMureta = JARDIM.x0;
    w.wall(xMureta, JARDIM.z0, xMureta, PASSAGEM.z0, 0.8, P.wallCream, 0.22);
    w.wall(xMureta, PASSAGEM.z1, xMureta, JARDIM.z1, 0.8, P.wallCream, 0.22);
    /*
     * O JARDIM É UM GRUPO SÓ, juntado por material (`fundirComoFundo`): as
     * moitas, os canteiros, as flores e a cerca são enfeite parado — soltos,
     * cada canteiro eram cem bolinhas, cem desenhos.
     */
    const jardim = new THREE.Group();
    jardim.userData.peca = 'jardim-da-casa';
    for (const [z, escala, semente] of [[-4.2, 0.7, 3], [-3.0, 0.62, 4], [-1.8, 0.7, 5], [-0.6, 0.6, 6], [2.35, 0.62, 7]] as const) {
      jardim.add(w.place(arbustoFlorido(escala, semente, [P.florDoArbusto, P.flowerYellow, P.florDoArbustoBranca]), xMureta + 0.02, 0.62, z));
    }

    // ----------------------------------------------------------------- o jardim
    // a cerquinha branca: o lado da direita (o da câmera) e a frente, com o portãozinho no meio
    const zLado = (JARDIM.z0 + 0.2 + JARDIM.z1) / 2;
    const cLado = JARDIM.z1 - JARDIM.z0 - 0.2;
    jardim.add(w.place(cercaBranca(cLado), JARDIM.x1, 0, zLado, Math.PI / 2));
    w.blockBox(JARDIM.x1, zLado, 0.1, cLado / 2);
    const trechos: Array<[number, number]> = [[xMureta + 0.1, PORTAO.x - PORTAO.largura / 2 - 0.08], [PORTAO.x + PORTAO.largura / 2 + 0.08, JARDIM.x1]];
    for (const [a, b] of trechos) {
      jardim.add(w.place(cercaBranca(b - a), (a + b) / 2, 0, JARDIM.z1));
      w.blockBox((a + b) / 2, JARDIM.z1, (b - a) / 2, 0.1);
    }
    const portao = w.add(w.place(portaozinho(PORTAO.largura), PORTAO.x, 0, JARDIM.z1));
    const folha = portao.userData.folha as THREE.Object3D;
    let aberto = 0;
    w.onUpdate((dt) => {
      // o portãozinho abre sozinho quando alguém chega perto, para dentro do jardim
      const p = g.playerPosition();
      const perto = Math.hypot(p.x - PORTAO.x, p.z - JARDIM.z1) < 2.2;
      aberto += ((perto ? 1 : 0) - aberto) * Math.min(1, dt * 4);
      folha.rotation.y = aberto * 1.75;
    });
    jardim.add(w.place(caixaDeCorreio(), PORTAO.x + PORTAO.largura / 2 + 0.55, 0, JARDIM.z1 + 0.32, -0.2));
    w.blockCircle(PORTAO.x + PORTAO.largura / 2 + 0.55, JARDIM.z1 + 0.32, 0.2);

    // os canteiros e as moitas floridas: encostados na casa e dos dois lados do caminho
    const coresDoJardim = [P.flowerPink, P.flowerYellow, 0xffffff, P.florDoArbusto];
    for (const [x, z, raio, semente] of [[-0.9, -0.6, 1.15, 0.2], [5.0, -0.9, 1.2, 0.6], [4.7, 1.7, 0.85, 0.9], [0.1, 1.9, 0.8, 0.4]] as const) {
      jardim.add(w.place(canteiro(raio, coresDoJardim, semente), x, 0, z));
      w.blockCircle(x, z, raio * 0.82);
    }
    for (const [x, z, escala, semente] of [[-1.9, -4.2, 0.95, 21], [-0.2, -4.3, 0.8, 22], [4.2, -4.3, 0.85, 23], [5.9, -4.1, 1.0, 24], [-2.2, -2.3, 0.75, 25]] as const) {
      jardim.add(w.place(arbustoFlorido(escala, semente), x, 0, z));
      w.blockCircle(x, z, 0.45 * escala);
    }
    for (const [x, z] of [[1.0, -2.6], [3.1, -2.2], [0.9, 0.3], [3.2, 0.6], [5.6, 0.5], [-1.6, 0.9]] as const) {
      jardim.add(w.place(flowers(7, 0.55, coresDoJardim), x, 0, z));
    }
    w.add(fundirComoFundo(jardim));
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
    for (let x = -40; x <= 40; x += 8.8) plantar(x + w.range(-1.5, 1.5), zDeLa + 13 + w.range(1.5, 6), w.range(1.5, 2.0));
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
    if (chegando || temBebitoMobile(g)) {
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
      };
      if (chegando) {
        chegadaDoBebito(w, {
          carro,
          vaga: VAGA,
          rua: { z: RUA.faixa, deLonge: 30 },
          porta: { x: CASA.x, z: CASA.z + 1.6 },
          aoEstacionar: estacionar,
        });
      } else estacionar();
    }
  },
};
