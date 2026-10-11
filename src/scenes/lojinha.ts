import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { falarDoPremio } from '../world/falasDePremio';
import { PALETTE as P } from '../palette';
import type { Collider, SceneDef } from '../core/types';
import type { Interactable } from '../world/Interactable';
import { pocaDeLuz, tapete } from '../world/furniture';
import {
  arandelaDeBoutique, araraDaBoutique, araraPremiumDaBoutique, balcaoDaBoutique, boiserie, bustoDeCostura,
  estanteEmArco, figueiraLira, lustreDeGlobos, mesaDeExposicao, mesinhaLateral, namoradeira, podio,
  provadoresDaBoutique, pufeCapitone, quadroDeArte, tapeteRedondo, vitrineDeJoias,
} from '../world/moveisDaBoutique';
import { EscadaRolante } from '../world/escadaRolante';
import { ARARAS_DA_ESTELLA, ITENS, PREMIUM_DA_ESTELLA, type AraraDaLoja } from '../world/itens';
import { espelhoMagico } from '../world/espelhoMagico';
import { acabar, uvDeParede } from '../world/acabamento';
import { fundir } from '../world/fundir';
import { parquetEmChevron } from '../world/texturasDeChao';
import { reboco } from '../world/texturasDeFachada';
import { polido, toon } from '../core/materials';
import { ARI, RENAN } from '../characters/cast';
import { Estella } from '../entities/bichos/Estella';

/**
 * ==================== A BOUTIQUE DA ESTELLA — DOIS ANDARES
 *
 * A loja de roupas do parque por dentro, depois da reforma: térreo de boutique
 * e um mezanino de peças premium, ligados por escada rolante.
 *
 * ======================= COMO DOIS ANDARES CABEM NUM MOTOR SEM ANDARES
 *
 * O motor do jogo não tem noção de "andar", e não passou a ter. Três fatos
 * dele, que juntos resolvem tudo:
 *
 *  1. a física de caminhada escreve só `x` e `z` — o `y` de quem anda fica onde
 *     for posto (por isso bastou `g.elevarDupla`, uma linha de duas atribuições);
 *  2. a colisão é 2D, então as duas plantas ocupam as MESMAS coordenadas e
 *     bastaria uma das listas valer de cada vez (`w.usarColisores`);
 *  3. a câmera mira no peito do jogador, então ela sobe junto de graça.
 *
 * Então "andar" aqui é: um grupo de geometria visível, uma lista de colisores,
 * um retângulo de limites e um conjunto de interações ligadas. Trocar de andar
 * é trocar esses quatro — `mudarDeAndar()`, lá embaixo, tem doze linhas.
 *
 * **UM ANDAR DE CADA VEZ NA TELA.** Lá de cima não se vê o térreo, e de baixo
 * não se vê o mezanino. Isso não é só economia (embora seja: é metade da
 * geometria por quadro no celular) — é o que resolve o problema de câmera de um
 * interior de dois pisos, que é a laje de cima tapar a de baixo. A única peça
 * que fica nos dois é a ESCADA, que é a costura entre eles.
 *
 * A SEGUNDA REFORMA (o pedido do Renan: "remodele o lugar inteiro, bem chique,
 * mas confortável — não precisa ser extremamente luxuoso, mas bem organizado
 * como uma loja chique de roupa") trocou TODAS as peças pelas do kit novo
 * (`world/moveisDaBoutique.ts`, `world/roupasNaArara.ts`,
 * `world/escadaRolante.ts`): parede rosa-claro com boiserie branca, parquet em
 * chevron, mármore, veludo e latão. O que funcionava continua igual — as
 * mesmas araras vendendo as mesmas filas, a escada rolante, o mezanino, o
 * espelho, o provador, o caixa e a ronda da Estella.
 *
 * A PLANTA DO TÉRREO (a câmera vê `-Z` subindo à direita, `-X` à esquerda):
 *
 *     fundo (-Z) ............ a escada rolante; e, atrás do caixa, as duas
 *                             estantes de nicho em arco, acesas por dentro
 *     esquerda (-X) ......... os três provadores de arco, e o CANTINHO de
 *                             esperar (namoradeira, mesinha, pufe, quadro)
 *     meio .................. o PÁTIO: quatro araras em volta da mesa de
 *                             mármore, num tapete redondo, debaixo do lustre
 *     entrada (+X/+Z) ....... o caixa canelado, e o pódio com os dois bustos
 *                             de costura
 *
 * A PLANTA DO MEZANINO:
 *
 *     o vão da escada ....... no canto de `-X/-Z`, cercado de guarda-corpo
 *     fundo (-Z) ............ O ESPELHO GRANDE, que reflete de verdade
 *     meio .................. três araras premium em arco, cada uma no seu
 *                             pedestal de mármore com um foco de luz
 *     esquerda (-X) ......... o cantinho de cima, com a namoradeira vinho
 */

/** o salão: 13 × 10, que é o miolo do prédio de fora (11,6 × 9,5) mais folga */
const W = 13;
const D = 10;
const x0 = -W / 2;
const z0 = -D / 2;
const H = 3.2;

/** a altura do piso do mezanino — e, por tabela, o desnível que a escada vence */
const ALTURA = 3.9;
/** o vão da porta, na mureta da frente */
const PORTA = { x: 4.1, vao: 1.5 };

/**
 * A ESCADA ROLANTE, encostada na parede do fundo e correndo no eixo X.
 *
 * O SENTIDO (base em `+X`, topo em `-X`) não é gosto: a câmera olha da diagonal
 * `+X/+Z`, e uma peça de quase cinco metros de altura esconde `1,5 × altura` de
 * chão atrás de si. Com o topo em `-X/-Z` essa sombra cai na PAREDE e no canto
 * — o único lugar da sala onde não há nada para esconder. Invertida, ela
 * apagaria meia loja.
 *
 * 6,4 de corrida para 3,9 de altura dão 31°, que é a inclinação de escada
 * rolante de verdade (30°). Abaixo de 25° ela lê como esteira de aeroporto.
 *
 * O EIXO FICA A 73 cm DA PAREDE: a escada nova tem a lateral revestida (1,4
 * de largura por fora), e no eixo antigo a balaustrada de trás entrava na
 * parede do fundo.
 */
const ESCADA = { x: -1.6, z: -4.12, corrida: 6.4 };
const BASE_DA_ESCADA = { x: ESCADA.x + ESCADA.corrida / 2, z: ESCADA.z };
const TOPO_DA_ESCADA = { x: ESCADA.x - ESCADA.corrida / 2, z: ESCADA.z };

/**
 * A RONDA DA ESTELLA — e ela é uma FILA, não um saco de pontos.
 *
 * `irPara()` anda em LINHA RETA e ignora móvel (de propósito: quem conhece a
 * planta é a cena). Com pontos soltos, metade das retas entre eles atravessava
 * uma arara. Então os pontos estão em ORDEM e ela só anda para o VIZINHO na
 * fila, dando meia-volta na ponta — os únicos trajetos possíveis são os trechos
 * desta lista, todos por corredor livre, e o `scripts/lojinha.mjs` mede um por
 * um contra os colisores (o ponto E o caminho).
 *
 * A variação vem do TEMPO, não do destino: a pausa em cada parada é sorteada
 * entre 3,5 e 7,5 s.
 *
 * AS DUAS PONTAS SÃO OS DOIS EXTREMOS DA LOJA — a boca dos provadores, no
 * fundo de `−X`, e a porta. Ela contorna o pátio das araras por fora (pelo
 * corredor dos provadores, por trás da camisaria e do caixa, e pela frente),
 * e não entra nele: o pátio é da dupla. Quem for mexer nesta lista mede antes
 * com o `scripts/lojinha.mjs`, que varre cada trecho de 10 em 10 cm.
 */
const RONDA: ReadonlyArray<{ x: number; z: number; onde: string }> = [
  { x: -4.6, z: 1.6, onde: 'na boca dos provadores' },
  { x: -4.6, z: -0.8, onde: 'no corredor dos provadores' },
  { x: -3.0, z: -2.75, onde: 'atrás da camisaria' },
  { x: 0.9, z: -2.75, onde: 'no corredor do fundo' },
  { x: 4.3, z: -3.25, onde: 'atrás do balcão do caixa' },
  { x: 2.4, z: -2.9, onde: 'no pé da escada rolante' },
  { x: 2.3, z: -0.6, onde: 'na lateral do caixa' },
  { x: 2.6, z: 1.6, onde: 'no meio do salão' },
  { x: 0.0, z: 4.3, onde: 'na frente da arara das calças' },
  { x: 3.4, z: 3.9, onde: 'na porta, recebendo quem chega' },
];

/**
 * O QUE ELA SOLTA ENQUANTO PASSEIA.
 *
 * Sai em TOAST (o aviso do canto), e não em caixa de diálogo: ser parado por um
 * balão a cada doze segundos transforma "explorar" em "clicar E". É a mesma
 * decisão dos gritos do Mano.
 *
 * SÃO DUAS LISTAS, e elas ALTERNAM. Se toda fala começasse com "meus queridos"
 * o bordão virava tique em dois minutos; num sorteio livre numa lista só, dava
 * para passar cinco falas sem ouvir nenhum. Alternando, o jeito dela aparece a
 * cada duas falas, sempre, e nunca duas seguidas.
 */
const FALAS_COM_CARINHO = [
  'Meus queridos, olhem essa arara do meio. Olhem!',
  'Cariños, provar não custa nada, viu. Nadinha.',
  'Meus amores, cuidado com o alfinete no chão. Sempre cai um.',
  'Meus queridos, essa bainha aí eu fiz ontem à noite. Ontem!',
  'Cariños, se apertar no ombro eu ajusto na hora.',
  'Meus amores, subam lá em cima. O que é bom tá lá em cima.',
  'Meus queridos, essa cor foi feita pra vocês. FEITA.',
  'Cariños, vocês dois de vermelho seria um escândalo. Um escândalo bom.',
  'Meus amores, tem biscoitinho no balcão. Tem sim.',
  'Meus queridos, não me deixem falando sozinha... ai, deixem. Eu gosto.',
  'Cariños, se quiserem eu meço vocês dois de olho fechado.',
  'Meus amores, o espelho de cima é o melhor da cidade. Eu garanto.',
];
const FALAS_SOLTAS = [
  'Bééé... essa coleção de outono está um arraso!',
  'Não repare a bagunça, chegaram peças novas hoje!',
  'Acho que aquele tom de azul destacaria muito a sua... lã. Digo, sua pele!',
  'Essa arara do meio é a minha favorita. Eu costurei tudo.',
  'Cada botão desta loja passou por este olho aqui, ó.',
  'Roupa boa é roupa que a pessoa esquece que tá usando.',
  'Bééé... amanhã eu remonto essa vitrine inteira. INTEIRA.',
  'A escada rolante eu mandei instalar mês passado. Um LUXO.',
  'Ninguém combina cor como eu. Ninguém.',
];

export const lojinha: SceneDef = {
  id: 'lojinha',
  name: 'Boutique da Estella',
  subtitle: 'dois andares de roupa nova',
  ambient: {
    sky: 0xf7efe8,
    indoor: true,
    sunColor: 0xfff6ea,
    sunIntensity: 0.95,
    ambientColor: 0xfdf4ec,
    // loja de roupa é iluminada demais de propósito: é assim que se enxerga cor
    // de tecido, e é o que separa a sala de dentro do parque lá fora
    ambientIntensity: 1.6,
    sunDir: [9, 16, 11],
  },
  spawn: { x: PORTA.x, z: D / 2 - 1.5, facing: Math.PI },
  entries: {
    'da-calcada': { x: PORTA.x, z: D / 2 - 1.5, facing: Math.PI },
  },

  build(w) {
    const g = w.game;
    const A = ARI.name;
    const R = RENAN.name;
    const E = 'Estella';
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };

    /*
     * OS TRÊS GRUPOS. `terreo` e `superior` se revezam na tela; `escada` fica
     * sempre visível, porque ela é a única peça que pertence aos dois andares —
     * de baixo se vê ela subir, de cima se vê ela chegar pelo vão do piso.
     */
    const terreo = new THREE.Group();
    const superior = new THREE.Group();
    const escada = new THREE.Group();
    w.add(terreo);
    w.add(superior);
    w.add(escada);

    /** atalho: monta a peça e pendura no grupo do andar certo */
    const por = <T extends THREE.Object3D>(grupo: THREE.Group, obj: T): T => {
      grupo.add(obj);
      obj.traverse((o) => {
        // luz que se vê (poça, leque) não faz sombra
        if ((o as THREE.Mesh).isMesh && !o.userData.semSombra) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      return obj;
    };
    /** a peça do kit, posta e FUNDIDA (`world/fundir.ts`): mesma imagem, menos desenho */
    const peca = <T extends THREE.Object3D>(grupo: THREE.Group, obj: T, x: number, y: number, z: number, rot = 0): T =>
      por(grupo, fundir(w.place(obj, x, y, z, rot)));
    /** a face de dentro das paredes (elas têm 30 cm, centradas na linha) */
    const INTERNA = 0.15;
    /** a parede rosa-claro, com a demão de reboco */
    const rebocar = (parede: THREE.Mesh): THREE.Mesh => acabar(parede, [[P.boutiqueRosaClaro, reboco()]]);

    /* ==================================================================
     *                          O TÉRREO
     * ================================================================== */

    /**
     * O PARQUET EM CHEVRON, encerado. A primeira reforma pôs porcelanato bege
     * (chique, e frio); a segunda trocou por madeira clara em ponto húngaro, que
     * é o piso de boutique de Paris — e é a mudança que mais deixa a sala
     * CONFORTÁVEL. Continua `polido()` (o único material com especular): a
     * mancha de luz que anda com a câmera é o que diz "encerado".
     */
    w.ground({
      width: W, depth: D,
      color: P.boutiqueCarvalho,
      textura: parquetEmChevron(2.4),
      brilho: 0.14,
    });
    w.setBounds(x0 + 0.5, z0 + 0.5, W / 2 - 0.5, D / 2 - 0.5);

    rebocar(w.wall(x0, z0, W / 2, z0, H, P.boutiqueRosaClaro));
    rebocar(w.wall(x0, z0, x0, D / 2, H, P.boutiqueRosaClaro));
    rebocar(w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.boutiqueRosaClaro));
    rebocar(w.wall(x0, D / 2, PORTA.x - PORTA.vao / 2, D / 2, 0.45, P.boutiqueRosaClaro));
    rebocar(w.wall(PORTA.x + PORTA.vao / 2, D / 2, W / 2, D / 2, 0.45, P.boutiqueRosaClaro));
    // o capeamento branco das muretas da frente
    const capear = (cx: number, cz: number, comp: number, rot: number): void => {
      const cap = new THREE.Mesh(new RoundedBoxGeometry(comp, 0.04, 0.36, 2, 0.012), toon(P.lojaEsquadria));
      cap.position.set(cx, 0.47, cz);
      cap.rotation.y = rot;
      por(terreo, cap);
    };
    // o da mureta de +X cobre o canto; o da frente para antes dele (as duas
    // tampas no mesmo plano, por cima uma da outra, serrilhariam)
    capear(W / 2, (z0 + 0.15 + D / 2 + 0.18) / 2, D / 2 + 0.18 - (z0 + 0.15), Math.PI / 2);
    const esquerdaDaPorta = PORTA.x - PORTA.vao / 2;
    const direitaDaPorta = PORTA.x + PORTA.vao / 2;
    capear((x0 + INTERNA + esquerdaDaPorta) / 2, D / 2, esquerdaDaPorta - (x0 + INTERNA), 0);
    capear((direitaDaPorta + W / 2 - 0.18) / 2, D / 2, W / 2 - 0.18 - direitaDaPorta, 0);

    /*
     * A BOISERIE nas duas paredes altas: rodapé, friso, cornija e os quadros de
     * moldura, brancos na parede rosa. As duas se encontram no canto de `−X/−Z`
     * em meia-esquadria. Onde um móvel alto encosta (os provadores, o quadro do
     * cantinho), a parede fica sem quadro — ninguém emoldura o que está atrás
     * de um armário.
     */
    // (sem quadro atrás das estantes do fundo, em X local da parede de −Z)
    peca(terreo, boiserie(W - INTERNA, H, { mitraEsq: true, semQuadro: [[2.5, 6.5]] }), INTERNA / 2, 0, z0 + INTERNA);
    peca(terreo, boiserie(D - 2 * INTERNA, H, {
      mitraDir: true,
      // em X local da parede de −X (que é o −Z do mundo): provadores e o quadro
      semQuadro: [[-2.3, 1.7], [-4.9, -2.6]],
    }), x0 + INTERNA, 0, 0, Math.PI / 2);

    /*
     * O PÁTIO DAS ARARAS, no meio do salão: as quatro araras em volta de uma
     * mesa de mármore, em cima de um tapete redondo, debaixo do lustre. Cada
     * arara fecha um lado do pátio (duas correndo em X, duas em Z), e os quatro
     * cantos ficam ABERTOS — é por eles que se entra. É a planta de boutique
     * de verdade: o cliente entra no pátio e as araras olham para ele.
     *
     * As contas do vão: o colisor da arara tem 0,3 de meia-profundidade e o da
     * mesa, 0,45; entre a mesa e cada arara sobram 1,33 m (de lado) e 1,85 m
     * (nas pontas) — a dupla anda em volta da mesa lado a lado.
     */
    const C = { x: -1.3, z: 0.85 };
    peca(terreo, tapeteRedondo(2.15, P.boutiqueRosaAntigo), C.x, 0, C.z);
    peca(terreo, mesaDeExposicao(ARARAS_DA_ESTELLA[0].pecas.concat(ARARAS_DA_ESTELLA[2].pecas)), C.x, 0, C.z);
    w.blockBox(C.x, C.z, 0.82, 0.45);
    peca(terreo, lustreDeGlobos(2.5, H, 1.8), C.x, 0, C.z);

    /**
     * A ORDEM DAQUI É A ORDEM DE `ARARAS_DA_ESTELLA` — camisaria, vestidos,
     * calçaria, e frio, pé e miudezas. Cada arara do chão é a vitrine de uma
     * fila do catálogo e PENDURA AS PEÇAS DELA (`araraDaBoutique` lê a ficha):
     * quem abre a arara de vestidos vê no painel os vestidos que estão
     * pendurados nela. A plaquinha em cima de cada uma diz a seção.
     *
     * O PROMPT FICA NO EIXO DA ARARA, com raio 1,5: o colisor tem 0,3 de
     * meia-profundidade, então quem para dos dois lados (e nas pontas) está no
     * raio, e quem só atravessa o pátio pelo meio, não.
     */
    const ARARAS = [
      // a frente de cada uma (a plaquinha, a bota na prateleira) olha para a câmera
      { x: C.x, z: C.z - 2.6, rot: 0 },             // camisaria, fechando o fundo do pátio
      { x: C.x + 2.45, z: C.z, rot: Math.PI / 2 },   // vestidos, o lado da entrada
      { x: C.x, z: C.z + 2.6, rot: 0 },             // calçaria, o lado da frente
      { x: C.x - 2.45, z: C.z, rot: Math.PI / 2 },   // frio e pé, o lado dos provadores
    ];
    for (const [i, a] of ARARAS.entries()) {
      peca(terreo, araraDaBoutique(ARARAS_DA_ESTELLA[i]), a.x, 0, a.z, a.rot);
      w.blockBox(a.x, a.z, 0.92, 0.3, a.rot);
    }

    // os provadores na parede de −X, com a cabine aberta virada para o cantinho
    const PROVADORES = { x: x0 + INTERNA + 1.04, z: 0.3 };
    peca(terreo, provadoresDaBoutique(3, 1.2), PROVADORES.x, 0, PROVADORES.z, Math.PI / 2);
    w.blockBox(PROVADORES.x - 0.5, PROVADORES.z, 1.84, 0.58, Math.PI / 2);
    /** onde se para para espiar a cabine aberta (a de `+Z`, a do canto) */
    const CABINE_ABERTA = { x: PROVADORES.x + 0.95, z: PROVADORES.z + 1.2 };

    /*
     * O CANTINHO DE ESPERAR, entre os provadores e a mureta da frente: a
     * namoradeira de veludo encostada na parede, a mesinha de mármore, um pufe
     * capitonê de frente, o tapete, duas arandelas e um quadro. É o "conforto"
     * do pedido do Renan — loja chique em que dá vontade de sentar enquanto o
     * outro prova.
     */
    peca(terreo, tapete(1.7, 2.4, P.boutiqueRosaClaro), -5.0, 0, 3.45);
    peca(terreo, namoradeira(P.boutiqueRosaAntigo, 1.6), x0 + INTERNA + 0.4, 0, 3.45, Math.PI / 2);
    w.blockBox(x0 + INTERNA + 0.4, 3.45, 0.8, 0.4, Math.PI / 2);
    peca(terreo, mesinhaLateral(), -5.95, 0, 2.42);
    w.blockCircle(-5.95, 2.42, 0.27);
    peca(terreo, pufeCapitone(P.boutiqueVinho), -4.72, 0, 3.45);
    w.blockCircle(-4.72, 3.45, 0.38);
    peca(terreo, figueiraLira(0.95), -5.95, 0, 4.5);
    w.blockCircle(-5.95, 4.5, 0.24);
    for (const z of [2.85, 4.05]) peca(terreo, arandelaDeBoutique(), x0 + INTERNA, 1.85, z, Math.PI / 2);
    peca(terreo, quadroDeArte(0.62, 0.8, 3), x0 + INTERNA, 1.95, 3.45, Math.PI / 2);

    /*
     * O CAIXA, de frente para a entrada; atrás dele,
     * as duas estantes de nicho em arco na parede do fundo — acesas por
     * dentro, como vitrine.
     */
    const CAIXA = { x: 4.3, z: -1.7 };
    peca(terreo, balcaoDaBoutique(2.4), CAIXA.x, 0, CAIXA.z);
    w.blockBox(CAIXA.x, CAIXA.z, 1.25, 0.42);
    for (const [x, semente] of [[3.6, 11], [5.45, 29]] as const) {
      peca(terreo, estanteEmArco(1.8, semente), x, 0, z0 + INTERNA + 0.45);
      w.blockBox(x, z0 + INTERNA + 0.23, 0.9, 0.24);
    }
    peca(terreo, figueiraLira(0.9), 6.0, 0, -3.6);
    w.blockCircle(6.0, -3.6, 0.24);

    /*
     * O PÓDIO DA VITRINE, do lado da porta: um disco de mármore com dois
     * BUSTOS DE COSTURA (a Estella é costureira; o manequim dela é o do
     * ateliê), vestindo peças da loja — o vestido jade e a camisa terracota —,
     * e o foco de luz pintado em cima. O eixo da porta (`x = 4,1`) fica livre: o pódio
     * começa 45 cm à direita dele.
     */
    const PODIO = { x: 5.45, z: 2.0 };
    peca(terreo, podio(0.9, 0.12), PODIO.x, 0, PODIO.z);
    peca(terreo, bustoDeCostura(ITENS.vestidoJade), PODIO.x - 0.3, 0.12, PODIO.z + 0.25, 0.55);
    peca(terreo, bustoDeCostura(ITENS.camisaTerracota), PODIO.x + 0.32, 0.12, PODIO.z - 0.28, 0.95);
    w.blockCircle(PODIO.x, PODIO.z, 0.9);
    // o foco de vitrine em cima do pódio: luz pintada, como a das araras premium
    const focoDoPodio = pocaDeLuz(0.95, P.luzDeAbajur, 0.26);
    focoDoPodio.position.set(PODIO.x, 0.14, PODIO.z);
    terreo.add(focoDoPodio);
    // o capacho da porta
    peca(terreo, tapete(1.4, 0.8, P.boutiqueVinho, 'capacho'), PORTA.x, 0, D / 2 - 0.6);

    // o canto de baixo da escada: a figueira e uma arandela
    peca(terreo, figueiraLira(1.0), -5.85, 0, -4.3);
    w.blockCircle(-5.85, -4.3, 0.24);
    peca(terreo, arandelaDeBoutique(), x0 + INTERNA, 1.85, -2.42, Math.PI / 2);

    /* ==================================================================
     *                      A ESCADA E O VÃO
     * ================================================================== */
    const escadaRolante = new EscadaRolante(ALTURA, ESCADA.corrida);
    por(escada, fundir(w.place(escadaRolante.group, ESCADA.x, 0, ESCADA.z, Math.PI / 2)));
    w.onUpdate((dt) => escadaRolante.update(dt));
    /*
     * O CORPO DA ESCADA BARRA, MENOS AS DUAS PONTAS: é por elas que se entra.
     * O colisor cobre o lance do meio (4,6 dos 6,4), deixando 0,9 livres em
     * cada ponta — espaço para a dupla chegar ao pé e para descer no topo.
     */
    w.blockBox(ESCADA.x, ESCADA.z, 2.3, 0.75);

    const portaDaLoja = w.door({
      x: PORTA.x, z: D / 2 - 0.85,
      to: 'villa-lobos', entry: 'da-lojinha',
      label: 'Voltar pra calçada', icon: '🚪',
    });

    // daqui para baixo, tudo o que for construído entra na lista do MEZANINO
    const colisoresTerreo: Collider[] = w.colisoresAgora();
    w.usarColisores([]);

    /* ==================================================================
     *                          O MEZANINO
     * ================================================================== */

    /**
     * A LAJE, e ela tem um VÃO — que é um RASGO COMPRIDO, e não um buraco.
     *
     * Ela é montada em retângulos em volta do buraco por onde a escada chega,
     * em vez de um plano com furo: caixas custam caixas e qualquer um lê o
     * código; `Shape` com `holes` custaria uma triangulação para desenhar o
     * mesmo retângulo.
     *
     * O COMPRIMENTO DO RASGO NÃO É GOSTO, e ele já nasceu curto uma vez. O vão
     * cobria só a boca da escada (1,9 m), e aí a dupla subia POR BAIXO da laje
     * até quase o fim do lance — com a cabeça saindo pelo piso do mezanino no
     * meio do caminho, que foi o defeito que o Renan viu na foto.
     *
     * A conta é a de prédio de verdade: o rasgo tem que começar onde ainda há
     * pé-direito para uma pessoa em cima do degrau. A 31° de inclinação, a
     * cabeça (1,8 m acima do degrau) encosta na barriga da laje (3,77 m) quando
     * o degrau está a 1,97 m — ou seja, a 1,5 m do pé da escada. Terminar o
     * rasgo em `x = −0,8` dá 3,4 m de corrida coberta e meio metro de folga
     * sobre a cabeça mais alta da dupla (a do chapéu de festa).
     *
     * E a ponta de `−X` (o patamar de desembarque) é PISO CHEIO: é ali que se
     * pisa ao sair da placa pente, e era ali que antes havia um guarda-corpo de
     * vidro a setenta centímetros do nariz de quem chegava.
     */
    const VAO = { x0: -5.05, x1: -0.8, z0: z0, z1: -3.1 };
    /*
     * O PISO DE CIMA É O MESMO PARQUET, e o desenho CONTINUA de um pedaço de
     * laje para o outro: o UV é lido na posição do mundo (`uvDeParede`), e não
     * na de cada caixa — senão a emenda entre o patamar e o resto da laje
     * mostraria o chevron desencontrado.
     */
    const laje = polido(P.boutiqueCarvalho, { brilho: 0.12, mapa: parquetEmChevron(2.4) });
    /*
     * A LAJE RECEBE **E PROJETA** SOMBRA.
     *
     * O `receiveShadow` é o óbvio: é nela que cai a sombra de quem anda lá em
     * cima. O `castShadow` é o que faltava, e sem ele a laje é um piso que a
     * LUZ ATRAVESSA — a sombra da dupla no mezanino não parava no piso, ela
     * seguia reto e ia cair no térreo, cinco metros abaixo.
     */
    const pedacoDeLaje = (cx: number, cz: number, larg: number, prof: number): THREE.Mesh => {
      const geo = uvDeParede(new THREE.BoxGeometry(larg, 0.26, prof), cx, ALTURA - 0.13, cz);
      const piso = new THREE.Mesh(geo, laje);
      piso.position.set(cx, ALTURA - 0.13, cz);
      piso.receiveShadow = true;
      piso.castShadow = true;
      return piso;
    };

    /**
     * A ABA DO VÃO FICA SEMPRE VISÍVEL, e ela é o conserto de um defeito que só
     * a foto mostrou: com o mezanino inteiro escondido, a escada rolante subia
     * cinco metros e terminava NO AR. Lia como escada quebrada, não como escada
     * para o andar de cima.
     *
     * Agora o PATAMAR DE DESEMBARQUE — o pedaço de laje entre a parede do fundo
     * e a boca do rasgo, que é onde a placa pente entrega a dupla — mora no
     * grupo da ESCADA, que nunca some. De baixo se vê o lance entrar num piso;
     * de cima, ele chegar por ele. E o que esse patamar esconde, pela conta da
     * câmera, é o canto de `-X/-Z`: parede, e nada mais.
     */
    escada.add(pedacoDeLaje(
      (x0 + VAO.x0) / 2, (z0 + VAO.z1) / 2,
      VAO.x0 - x0, VAO.z1 - z0,
    ));

    /*
     * E O RESTO DA LAJE, que só aparece lá em cima: duas peças que cobrem tudo
     * menos o patamar e o rasgo. Sem esse recorte, laje e patamar ficariam no
     * mesmo plano na mesma região — faces coplanares, que é o que serrilha.
     */
    superior.add(pedacoDeLaje((VAO.x1 + W / 2) / 2, 0, W / 2 - VAO.x1, D));
    superior.add(pedacoDeLaje(
      (x0 + VAO.x1) / 2, (VAO.z1 + D / 2) / 2,
      VAO.x1 - x0, D / 2 - VAO.z1,
    ));
    // o arremate dourado na borda comprida do rasgo, por baixo do guarda-corpo
    const arremate = new THREE.Mesh(
      new THREE.BoxGeometry(VAO.x1 - VAO.x0, 0.3, 0.1),
      toon(P.boutiqueOuro),
    );
    arremate.position.set((VAO.x0 + VAO.x1) / 2, ALTURA - 0.13, VAO.z1 - 0.05);
    por(superior, arremate);

    /*
     * As duas paredes altas do mezanino são as MESMAS de baixo, um andar acima:
     * `w.wall` devolve a malha e já registra o colisor (que, aqui, entra na
     * lista do mezanino) — então basta subir a malha e mudá-la de grupo. Com
     * a mesma boiserie de baixo, na altura de cima.
     */
    const H2 = H - 0.9;
    for (const parede of [
      w.wall(x0, z0, W / 2, z0, H2, P.boutiqueRosaClaro),
      w.wall(x0, z0, x0, D / 2, H2, P.boutiqueRosaClaro),
    ]) {
      parede.position.y += ALTURA;
      por(superior, rebocar(parede));
    }
    peca(superior, boiserie(W - INTERNA, H2, { mitraEsq: true, semQuadro: [[1.45, 5.35]] }), INTERNA / 2, ALTURA, z0 + INTERNA);
    peca(superior, boiserie(D - 2 * INTERNA, H2, { mitraDir: true, semQuadro: [[-1.9, -0.2]] }), x0 + INTERNA, ALTURA, 0, Math.PI / 2);

    /**
     * O GUARDA-CORPO: vidro baixo entre um trilho de latão no pé e o corrimão
     * de latão redondo em cima, com um montante a cada metro e pouco, nas
     * bordas de `+X` e `+Z` e na borda comprida do rasgo.
     *
     * Ele é BAIXO (0,95) pelo mesmo motivo de toda mureta de interior aqui: a
     * câmera olha de 34°, e um peitoril de altura normal taparia o mezanino
     * inteiro. E ele é de VIDRO, que é o que o faz existir sem pesar na tela.
     */
    const latao = toon(P.boutiqueOuro);
    const vidroDoGuarda = toon(P.escadaVidro, { opacity: 0.22, doubleSide: true });
    /** todo o guarda-corpo num grupo só, FUNDIDO no fim: o latão vira uma malha */
    const guarda = new THREE.Group();
    const guardaCorpo = (ax: number, az: number, bx: number, bz: number): void => {
      const comp = Math.hypot(bx - ax, bz - az);
      const ang = Math.atan2(bx - ax, bz - az);
      const mx = (ax + bx) / 2;
      const mz = (az + bz) / 2;
      const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.78, comp), vidroDoGuarda);
      vidro.position.set(mx, ALTURA + 0.48, mz);
      vidro.rotation.y = ang;
      vidro.renderOrder = 4;
      guarda.add(vidro);
      const trilho = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, comp), latao);
      trilho.position.set(mx, ALTURA + 0.04, mz);
      trilho.rotation.y = ang;
      guarda.add(trilho);
      const mao = new THREE.CylinderGeometry(0.032, 0.032, comp + 0.064, 12);
      mao.rotateX(Math.PI / 2);
      const corrimao = new THREE.Mesh(mao, latao);
      corrimao.position.set(mx, ALTURA + 0.9, mz);
      corrimao.rotation.y = ang;
      guarda.add(corrimao);
      const montantes = Math.max(1, Math.round(comp / 1.3));
      for (let i = 0; i <= montantes; i++) {
        const t = i / montantes;
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.82, 8), latao);
        m.position.set(ax + (bx - ax) * t, ALTURA + 0.49, az + (bz - az) * t);
        guarda.add(m);
      }
      w.blockBox(mx, mz, 0.12, comp / 2, ang);
    };
    guardaCorpo(W / 2 - 0.1, z0, W / 2 - 0.1, D / 2 - 0.1);
    guardaCorpo(x0 + 0.1, D / 2 - 0.1, W / 2 - 0.16, D / 2 - 0.1);
    /*
     * O RASGO TEM UM GUARDA-CORPO SÓ: a borda comprida, a que dá para o salão.
     *
     * As outras três não levam vidro, e nenhuma delas é um buraco aberto:
     *  - a de `−Z` é a parede do fundo;
     *  - a de `+X` fica a 2,4 m acima do lance e é INALCANÇÁVEL a pé (para
     *    chegar nela seria preciso passar por dentro da escada);
     *  - e a de `−X` é POR ONDE SE CHEGA — o patamar e a placa pente são a
     *    mesma superfície, e foi um vidro fechando justamente essa ponta que
     *    fazia a dupla terminar a viagem do lado errado dele.
     *
     * Quem impede de andar rasgo adentro a partir do patamar é o colisor da
     * escada, logo abaixo, e não uma mureta.
     *
     * O VIDRO COMEÇA 85 cm PARA DENTRO, e não na ponta do rasgo. Quem fecha a
     * ponta de `−X` é a BALAUSTRADA DA PRÓPRIA ESCADA, que sobe junto com o
     * lance e chega mais alta que o piso do mezanino — é assim num shopping de
     * verdade, e é o que deixa a boca livre para desembarcar. Com o vidro indo
     * até `VAO.x0`, o patamar virava um beco (medido andando, não estimado).
     */
    guardaCorpo(VAO.x0 + 0.85, VAO.z1, VAO.x1, VAO.z1);
    por(superior, fundir(guarda));
    /*
     * E O RASGO INTEIRO É COLISOR.
     *
     * O colisor do lance mora na lista do TÉRREO (ele é quem impede de andar
     * por dentro da escada lá embaixo), então aqui em cima o buraco ficava
     * aberto: dava para sair do patamar e andar quatro metros rasgo adentro,
     * no ar, por cima dos degraus. É ele, e não a mureta, que segura a dupla.
     */
    w.blockBox((VAO.x0 + VAO.x1) / 2, (z0 + VAO.z1) / 2,
      (VAO.x1 - VAO.x0) / 2, (VAO.z1 - z0) / 2);

    w.setBounds(x0 + 0.5, z0 + 0.5, W / 2 - 0.5, D / 2 - 0.5);

    /**
     * AS ARARAS PREMIUM: três arcos (dois dourados e um de prata) em fila, cada
     * um num PEDESTAL redondo de mármore com o seu foco de luz pintado em cima
     * — a peça cara exposta como em galeria.
     *
     * DÁ PARA ANDAR ENTRE ELAS, e a conta tem um passo fácil de esquecer — o
     * RAIO DA DUPLA ENTRA DUAS VEZES: entre dois pedestais de 0,95 de raio a
     * 2,85 m um do outro sobram 0,95 m de vão, e a faixa por onde o CENTRO da
     * dupla passa é esse vão menos 2 × 0,42 = 11 cm de folga. Passa — e a fila
     * cabe no comprimento do mezanino com o espelho e o cantinho em volta.
     *
     * O PROMPT TEM RAIO 1,75: o pedestal é colisor, e quem para na beira dele
     * fica a 0,95 + 0,42 = 1,37 do centro da arara.
     */
    const PREMIUM = [
      { x: 0.4, z: -2.35, prata: false },
      { x: 0.4, z: 0.5, prata: true },
      { x: 0.4, z: 3.35, prata: false },
    ];
    // a passadeira: o tapete comprido debaixo da fila, de um pedestal ao outro
    peca(superior, tapete(2.5, 7.8, P.boutiqueRosaClaro), PREMIUM[1].x, ALTURA, PREMIUM[1].z);
    for (const [i, a] of PREMIUM.entries()) {
      peca(superior, podio(0.95, 0.08), a.x, ALTURA, a.z);
      peca(superior, araraPremiumDaBoutique(PREMIUM_DA_ESTELLA[i], { prata: a.prata }), a.x, ALTURA + 0.08, a.z, Math.PI / 2);
      const foco = pocaDeLuz(0.9, P.luzDeAbajur, 0.3);
      // 2 cm acima do tampo: a 6 mm o foco brigava com ele e saía em raios
      foco.position.set(a.x, ALTURA + 0.1, a.z);
      superior.add(foco);
      w.blockCircle(a.x, a.z, 0.95);
    }

    /**
     * O ESPELHO GRANDE, no fundo do mezanino.
     *
     * O espelho é a peça que reflete de verdade (`world/espelhoMagico.ts`): uma
     * segunda câmera e um `WebGLRenderTarget`, com o frustum montado em cima do
     * retângulo do vidro. Quem para na frente se vê — com a roupa que está
     * vestindo.
     *
     * ELE OLHA PARA `+Z`, encostado na parede do fundo, e isso é o que faz o
     * reflexo valer: a câmera do jogo vem da diagonal `+X/+Z`, então quem se
     * olha nele está entre ele e a câmera — e aparece no reflexo de frente.
     */
    const ESPELHO = { x: 3.4, z: z0 + 0.6 };
    peca(superior, espelhoMagico({ largura: 2.4, altura: 2.7 }), ESPELHO.x, ALTURA, ESPELHO.z);
    w.blockBox(ESPELHO.x, ESPELHO.z - 0.1, 1.75, 0.32);
    // o tapetinho redondo na frente dele, que é onde se para para olhar
    peca(superior, tapeteRedondo(1.15, P.boutiqueRosaAntigo), ESPELHO.x, ALTURA, ESPELHO.z + 1.5);
    peca(superior, pufeCapitone(P.boutiqueRosaAntigo, 0.32), ESPELHO.x + 2.05, ALTURA, ESPELHO.z + 1.6);
    w.blockCircle(ESPELHO.x + 2.05, ESPELHO.z + 1.6, 0.34);
    peca(superior, figueiraLira(0.95), 5.85, ALTURA, z0 + 0.5);
    w.blockCircle(5.85, z0 + 0.5, 0.24);

    // o cantinho de cima: namoradeira de veludo vinho, mesinha, pufe e quadro
    peca(superior, tapete(1.7, 2.4, P.boutiqueRosaClaro), -5.0, ALTURA, 1.05);
    peca(superior, namoradeira(P.boutiqueVinho, 1.6), x0 + INTERNA + 0.4, ALTURA, 1.05, Math.PI / 2);
    w.blockBox(x0 + INTERNA + 0.4, 1.05, 0.8, 0.4, Math.PI / 2);
    peca(superior, mesinhaLateral(), -5.95, ALTURA, 2.25);
    w.blockCircle(-5.95, 2.25, 0.27);
    peca(superior, pufeCapitone(P.boutiqueRosaAntigo, 0.34), -4.72, ALTURA, 1.05);
    w.blockCircle(-4.72, 1.05, 0.36);
    for (const z of [0.25, 1.85]) peca(superior, arandelaDeBoutique(), x0 + INTERNA, ALTURA + 1.6, z, Math.PI / 2);
    peca(superior, quadroDeArte(0.62, 0.72, 4), x0 + INTERNA, ALTURA + 1.45, 1.05, Math.PI / 2);
    peca(superior, figueiraLira(0.9), -5.9, ALTURA, 4.35);
    w.blockCircle(-5.9, 4.35, 0.24);
    peca(superior, figueiraLira(0.9), 5.75, ALTURA, 4.3);
    w.blockCircle(5.75, 4.3, 0.24);
    for (const x of [-1.2, 1.2]) peca(superior, arandelaDeBoutique(), x, ALTURA + 1.6, z0 + INTERNA);

    /*
     * A VITRINE DE JOIAS, no meio do caminho entre o cantinho e a fila das
     * premium: é a peça baixa que segura o meio do mezanino (sem ela, o andar
     * era um salão vazio com três araras numa ponta).
     */
    peca(superior, vitrineDeJoias(1.3), -2.4, ALTURA, 3.3);
    w.blockBox(-2.4, 3.3, 0.68, 0.31);

    const colisoresSuperior: Collider[] = w.colisoresAgora();
    w.usarColisores(colisoresTerreo);

    /* ==================================================================
     *                   TROCAR DE ANDAR, E A VIAGEM
     * ================================================================== */

    /** as interações que só valem num andar */
    const doTerreo: Interactable[] = [portaDaLoja];
    const doSuperior: Interactable[] = [];
    let andar: 0 | 1 = 0;

    /**
     * TROCAR DE ANDAR É TROCAR QUATRO COISAS, e nenhuma delas mora no motor.
     */
    const mudarDeAndar = (novo: 0 | 1): void => {
      andar = novo;
      terreo.visible = novo === 0;
      superior.visible = novo === 1;
      w.usarColisores(novo === 0 ? colisoresTerreo : colisoresSuperior);
      for (const it of doTerreo) it.enabled = novo === 0;
      for (const it of doSuperior) it.enabled = novo === 1;
      g.elevarDupla(novo === 0 ? 0 : ALTURA);
    };

    /**
     * A VIAGEM DA ESCADA.
     *
     * A dupla ENTRA NUMA ÂNCORA (o mesmo mecanismo da cabine da roda gigante) e
     * a âncora desliza pela diagonal. Sem isso, a física de caminhada continuaria
     * rodando embaixo do movimento e a colisão empurraria os dois para fora da
     * escada no meio da subida — que é exatamente o bug que o roteiro pediu para
     * evitar.
     *
     * O DESLIZE É LINEAR, e não suavizado nas pontas: escada rolante é uma
     * máquina, ela anda na mesma velocidade do começo ao fim. Suavizar aqui faria
     * parecer elevador.
     *
     * A TROCA DE ANDAR ACONTECE NO MEIO DO CAMINHO (55%), e não no fim: é o
     * momento em que a dupla passa da altura da laje. Trocar no fim deixaria o
     * mezanino aparecer de uma vez com os dois já lá em cima; trocar no começo
     * sumiria com o térreo debaixo dos pés deles.
     */
    const ancora = new THREE.Object3D();
    w.add(ancora);
    let viagem: {
      t: number; dur: number;
      de: THREE.Vector3; para: THREE.Vector3;
      destino: 0 | 1; trocou: boolean;
      pronto: () => void;
    } | null = null;

    const deslizar = (de: THREE.Vector3, para: THREE.Vector3, destino: 0 | 1): Promise<void> =>
      new Promise((pronto) => {
        viagem = { t: 0, dur: 4.2, de, para, destino, trocou: false, pronto };
      });

    const viajarNaEscada = async (subindo: boolean): Promise<void> => {
      const pe = new THREE.Vector3(BASE_DA_ESCADA.x, 0.1, BASE_DA_ESCADA.z);
      const topo = new THREE.Vector3(TOPO_DA_ESCADA.x, ALTURA + 0.1, TOPO_DA_ESCADA.z);
      const de = subindo ? pe : topo;
      const para = subindo ? topo : pe;
      // de costas para onde ela vai: quem sobe olha para a frente do lance
      const olhar = Math.atan2(para.x - de.x, para.z - de.z);

      g.lockPlayer(true);
      ancora.position.copy(de);
      ancora.rotation.y = olhar;
      g.ridePlayer(ancora, new THREE.Vector3(0.3, 0, 0), 1, 0);
      g.rideCompanion(ancora, new THREE.Vector3(-0.3, 0, -0.55), 1, 0);
      g.focusCamera(ancora);
      g.som('porta');
      try {
        await deslizar(de, para, subindo ? 1 : 0);
      } finally {
        g.focusCamera(null);
        /*
         * A SAÍDA É UM PASSO À FRENTE, no sentido em que o lance estava indo, e
         * não em cima da placa pente: soltar a dupla exatamente no fim do lance
         * deixaria os dois dentro do colisor da escada, e o primeiro quadro de
         * física os empurraria para fora com um tranco.
         *
         * EM CIMA, ESSE PASSO É PARA `−X`, no PATAMAR — e isso é o conserto de
         * um defeito que a foto mostrou. A saída ficava em `+Z`, um metro e
         * meio para dentro do salão: como o rasgo da escada é fechado dos dois
         * lados compridos por guarda-corpo, a dupla subia e reaparecia DO OUTRO
         * LADO do vidro, que é a única parte do trajeto que ela não poderia ter
         * feito a pé.
         *
         * Os dois saem EM FILA (um atrás do outro em `z`), e não lado a lado: o
         * patamar tem 1,45 m entre a parede e o guarda-corpo do rasgo, e dois
         * corpos lado a lado não cabem sem um deles nascer dentro de um colisor.
         */
        const saida = subindo
          ? { x: TOPO_DA_ESCADA.x - 0.75, z: TOPO_DA_ESCADA.z + 0.1, olhar: 0, fila: true }
          : { x: BASE_DA_ESCADA.x + 0.9, z: BASE_DA_ESCADA.z + 1.2, olhar: Math.PI, fila: false };
        g.releasePlayer(saida.x, saida.z, saida.olhar);
        g.releaseCompanion(
          saida.fila ? saida.x : saida.x - 0.7,
          saida.z + (saida.fila ? 0.75 : 0.5),
          saida.olhar,
        );
        // e SÓ DEPOIS a altura: `releasePlayer` teleporta, e teleporte zera o `y`
        g.elevarDupla(subindo ? ALTURA : 0);
        g.lockPlayer(false);
      }
    };

    w.onUpdate((dt) => {
      if (!viagem) return;
      viagem.t = Math.min(1, viagem.t + dt / viagem.dur);
      ancora.position.lerpVectors(viagem.de, viagem.para, viagem.t);
      if (!viagem.trocou && viagem.t > 0.55) {
        viagem.trocou = true;
        mudarDeAndar(viagem.destino);
      }
      if (viagem.t >= 1) {
        const fim = viagem.pronto;
        viagem = null;
        fim();
      }
    });

    /**
     * ==================== AS ARARAS QUE VENDEM
     *
     * Uma interação por arara, e todas iguais: a primeira vez ela fala (é a
     * loja DELA, e ela apresenta a fila), e daí em diante abre direto. O
     * painel é o mesmo para as sete — quem muda é a lista de peças, que vem
     * do catálogo (`world/itens.ts`), e não daqui: a cena não sabe quanto
     * custa um vestido, ela sabe onde fica a arara.
     */
    const araraQueVende = (
      fila: AraraDaLoja,
      x: number,
      z: number,
      chave: string,
      raio = 1.5,
    ): Interactable => w.interact({
      id: `lojinha:arara-${chave}`,
      /*
       * O RAIO É 1,5, e o número saiu de medir e não de gosto: a arara corre
       * no eixo Z com 0,35 de meia-profundidade em X, e a dupla é um círculo
       * de 0,42 — quem chega pela frente para a 0,77 do eixo, mas quem chega
       * pela PONTA para a 1,37, que é o que um raio de 1,3 deixava de fora.
       */
      x, z, radius: raio,
      label: `Ver a arara: ${fila.titulo.toLowerCase()}`, icon: '🛍️',
      onInteract: async () => {
        if (!g.flag(`arara-${chave}`)) {
          g.setFlag(`arara-${chave}`);
          await conversa([[E, fila.fala]]);
        }
        g.abrirLoja(fila.titulo, fila.pecas);
      },
    });

    for (const [i, a] of ARARAS.entries()) {
      doTerreo.push(araraQueVende(ARARAS_DA_ESTELLA[i], a.x, a.z, `terreo-${i}`));
    }
    for (const [i, a] of PREMIUM.entries()) {
      doSuperior.push(araraQueVende(PREMIUM_DA_ESTELLA[i], a.x, a.z, `premium-${i}`, 1.75));
    }

    doTerreo.push(w.interact({
      id: 'lojinha:subir',
      x: BASE_DA_ESCADA.x + 0.75, z: BASE_DA_ESCADA.z + 0.35, radius: 1.5,
      label: 'Subir a escada rolante', icon: '🛗',
      onInteract: async () => {
        if (!g.flag('mezanino-visto')) {
          g.setFlag('mezanino-visto');
          await conversa([
            [R, 'Ela colocou escada rolante numa loja deste tamanho.'],
            [A, 'Ela colocou escada rolante numa loja deste tamanho.'],
          ]);
        }
        await viajarNaEscada(true);
      },
    }));
    /*
     * O prompt de descer mora no PATAMAR, junto com o ponto de desembarque —
     * do outro lado do guarda-corpo ele pedia para descer uma escada que dali
     * não dá para alcançar a pé.
     */
    doSuperior.push(w.interact({
      id: 'lojinha:descer',
      x: TOPO_DA_ESCADA.x - 0.75, z: TOPO_DA_ESCADA.z + 0.45, radius: 1.6,
      label: 'Descer a escada rolante', icon: '🛗',
      onInteract: async () => { await viajarNaEscada(false); },
    }));

    /* ==================================================================
     *                    O QUE SE OLHA EM CADA ANDAR
     * ================================================================== */
    doSuperior.push(w.interact({
      id: 'lojinha:espelho',
      x: ESPELHO.x, z: ESPELHO.z + 1.5, radius: 1.6,
      label: 'Se arrumar no espelho', icon: '🪞',
      /**
       * O ESPELHO É O PROVADOR: ele abre o GUARDA-ROUPA DE CASA.
       *
       * Isso não é um atalho de conveniência, é o que fecha o ciclo da loja.
       * Roupa comprada aqui vai para o guarda-roupa (`storeItem`), e o
       * guarda-roupa só se mexia no armário do quarto, do outro lado do mapa
       * — dava para comprar um vestido e não ter como vesti-lo sem pegar o
       * ônibus. Agora compra-se na arara e veste-se no espelho, dois andares
       * da mesma loja.
       *
       * E não há guarda-roupa novo nenhum: é o MESMO painel do armário, com o
       * mesmo acervo e as mesmas quatro vagas do corpo. O espelho é só outra
       * porta para ele.
       */
      onInteract: async () => {
        if (!g.flag('espelho-do-mezanino')) {
          await conversa([
            [A, 'Esse espelho é ENORME.'],
            [R, 'Dá pra ver a gente inteiro. Olha, tá até mexendo junto.'],
            [A, 'Vira de lado. Vira!'],
            [R, 'A Estella tem razão: é o melhor espelho da cidade.'],
            [E, 'É pra isso que ele serve, meus amores. Vistam o que compraram!'],
          ]);
          g.setFlag('espelho-do-mezanino');
          g.unlock({
            id: 'espelho-do-mezanino',
            title: 'O espelho do mezanino',
            place: 'Boutique da Estella',
            note: 'O espelho gigante do andar de cima da boutique, de moldura dourada e dois globinhos de luz. A gente ficou um tempo bobo na frente dele, vendo os dois mexerem junto.',
            icon: '🪞',
          });
        }
        g.abrirGuardaRoupa();
      },
    }));
    doTerreo.push(w.interact({
      id: 'lojinha:provador',
      x: CABINE_ABERTA.x, z: CABINE_ABERTA.z, radius: 1.5,
      label: 'Espiar o provador', icon: '🪞',
      onInteract: async () => {
        await conversa([
          [R, 'A cabine do canto tá aberta.'],
          [A, 'Tem um banquinho, um espelho e um gancho. É maior do que parece.'],
          [R, 'Quando ela abrir a loja a gente prova tudo.'],
          [A, 'TUDO.'],
        ]);
      },
    }));
    doTerreo.push(w.interact({
      id: 'lojinha:caixa',
      x: CAIXA.x, z: CAIXA.z + 1.1, radius: 1.4,
      label: 'Olhar o balcão', icon: '🧾',
      onInteract: async () => {
        await conversa([
          [A, 'Tem uma vitrininha de bijuteria aqui no canto do balcão.'],
          [R, 'E as sacolinhas da loja embaixo, todas dobradas.'],
          [A, 'Ela pensou em tudo.'],
        ]);
      },
    }));

    /* ==================================================================
     *                        A ESTELLA NO SALÃO
     * ================================================================== */
    /**
     * ELA NASCE NA ÚLTIMA PARADA DA FILA, e não num ponto bonito escolhido à
     * mão. O primeiro passeio dela sai de onde ela está: nascendo fora da fila,
     * essa PRIMEIRA caminhada é a única que ninguém mediu — e foi exatamente ela
     * que cortou a loja na diagonal, passando por dentro do pufe, enquanto todos
     * os trechos da lista estavam limpos.
     */
    const INICIO = RONDA[RONDA.length - 1];
    const estella = new Estella({
      minX: INICIO.x, maxX: INICIO.x,
      minZ: INICIO.z, maxZ: INICIO.z,
    });
    estella.group.rotation.y = Math.PI;
    estella.entrarEmServico();
    por(terreo, estella.group);
    estella.aoSoar = () => g.som('balido');

    let atual = RONDA.length - 1;
    let passo = -1;
    let andando = false;
    let espera = 1.2;
    let ateFalar = 6;
    let comCarinho = false;
    let ultimaFala = '';
    let conversando = false;

    const DENTRO_DA_LOJA = [
      'Meus queridos! Essa arara chegou hoje. Hoje mesmo, ainda tá quentinha.',
      'Cariños, provem o que quiserem. Provar é de graça.',
      'Eu costuro tudo aqui atrás. Tudo. Sozinha.',
      'Meus amores, se quiserem eu meço vocês dois direitinho.',
      'Um dia desses eu faço um par de roupa igual pros dois. Combinando.',
      'Meus queridos, já subiram? O espelho de lá é o melhor da cidade.',
      'Cariños, sentem no pufe. Ele é bem mais confortável do que parece.',
      'Meus amores, se sumir um cabide eu sei. Eu sempre sei.',
    ];
    const pontoDaConversa = w.interact({
      id: 'lojinha:estella',
      x: estella.x, z: estella.z, radius: 1.4,
      label: 'Falar com a Estella', icon: '🐑',
      highlight: estella.group,
      onInteract: async (api) => {
        conversando = true;
        const eu = api.playerPosition();
        estella.encarar(eu.x, eu.z);
        estella.receberCarinho();
        api.som('balido');
        try {
          if (!api.flag('lojinha-visitada')) {
            api.setFlag('lojinha-visitada');
            await conversa([
              [E, 'Entraram! Entraram mesmo!'],
              [A, 'A loja é linda, Estella.'],
              [E, 'É minha. Cada arara, cada bainha, cada botão.'],
              [E, 'Reformei tudo, viu. Piso novo, escada rolante, o mezanino...'],
              [E, 'Ainda não tô vendendo, tá? Falta acertar o preço de umas peças.'],
              [E, 'Mas olhem à vontade. Olhar é de graça, e provar também.'],
            ]);
            api.unlock({
              id: 'lojinha-por-dentro',
              title: 'A boutique da Estella',
              place: 'Boutique da Estella',
              note: 'A loja de roupas do parque por dentro, depois da reforma: parquet de madeira, quatro araras em volta de uma mesa de mármore, provadores de arco com cortina de veludo, um sofazinho pra esperar, e uma escada rolante que sobe pro mezanino das peças premium. A Estella circula entre tudo chamando a gente de "meus queridos".',
              icon: '👗',
            });
          } else if (!(await falarDoPremio(api, 'estella'))) {
            // o conjunto de xadrez ganha do "oi" de sempre, aqui como na
            // calçada: ela é a mesma ovelha nos dois lados da porta
            await api.say([w.pick(DENTRO_DA_LOJA)], E);
          }
        } finally {
          conversando = false;
        }
      },
    });
    doTerreo.push(pontoDaConversa);

    w.onUpdate((dt) => {
      // ela mora no térreo: lá em cima ela nem anda, para não gastar quadro
      if (andar !== 0) return;
      estella.update(dt);
      pontoDaConversa.moveTo(estella.x, estella.z);

      ateFalar -= dt;
      if (ateFalar <= 0) {
        ateFalar = 10 + w.rng() * 5;
        comCarinho = !comCarinho;
        const lista = comCarinho ? FALAS_COM_CARINHO : FALAS_SOLTAS;
        let fala = w.pick(lista);
        for (let tentativa = 0; tentativa < 4 && fala === ultimaFala; tentativa++) {
          fala = w.pick(lista);
        }
        ultimaFala = fala;
        if (!conversando) g.toast(`Estella: ${fala}`, '🐑');
      }

      if (andando || conversando || viagem) return;
      espera -= dt;
      if (espera > 0) return;

      if (atual + passo >= RONDA.length || atual + passo < 0) passo = -passo;
      atual += passo;
      const parada = RONDA[atual];
      andando = true;
      void estella.irPara(parada.x, parada.z, 0.5).then(() => {
        andando = false;
        espera = 3.5 + w.rng() * 4;
      });
    });

    // o mezanino começa escondido: a dupla entra pelo térreo
    mudarDeAndar(0);
  },
};
