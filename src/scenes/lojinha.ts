import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { Collider, SceneDef } from '../core/types';
import type { Interactable } from '../world/Interactable';
import {
  araraDeRoupas, araraPremium, balcaoDaLoja, caixaRegistradora, escadaRolante,
  luminariaPendente, manequimDeLoja, mesaDeDobrar, pottedPlant, prateleiraDaLoja,
  provadores, pufeDeLoja,
} from '../world/furniture';
import { espelhoMagico } from '../world/espelhoMagico';
import { porcelanatoPolido } from '../world/texturasDeChao';
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
 * A PLANTA DO TÉRREO (a câmera vê `-Z` subindo à direita, `-X` à esquerda):
 *
 *     fundo (-Z) ............ a escada rolante, e as duas prateleiras ao lado
 *     esquerda (-X) ......... os três provadores
 *     meio .................. duas ilhas de tapete, duas araras em cada
 *     entrada (+X/+Z) ....... o balcão do caixa, o pódio dos manequins, o pufe
 *
 * A PLANTA DO MEZANINO:
 *
 *     o vão da escada ....... no canto de `-X/-Z`, cercado de guarda-corpo
 *     fundo (-Z) ............ O ESPELHO GRANDE, que reflete de verdade
 *     meio .................. três araras premium, douradas, bem espaçadas
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
 */
const ESCADA = { x: -1.6, z: -4.35, corrida: 6.4 };
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
 * AS DUAS PONTAS SÃO OS DOIS EXTREMOS DA LOJA — a boca dos provadores, no fundo
 * de `−X`, e a porta. E é uma FILA e não um anel porque os provadores são um
 * BECO: entre a parede deles e a primeira arara sobra uma fresta de 29 cm, e
 * ninguém de 80 cm de lombo passa por ali. Quem for mexer nesta lista mede
 * antes com o `scripts/lojinha.mjs`, que varre cada trecho de 10 em 10 cm.
 */
const RONDA: ReadonlyArray<{ x: number; z: number; onde: string }> = [
  { x: -4.4, z: 0.35, onde: 'na boca dos provadores' },
  { x: -2.75, z: 0.4, onde: 'no cruzamento das duas ilhas' },
  { x: -2.75, z: -3.0, onde: 'no topo do corredor central' },
  { x: 0.9, z: -3.0, onde: 'no pé da escada rolante' },
  { x: 3.6, z: -2.8, onde: 'atrás do balcão do caixa' },
  { x: 1.6, z: -2.9, onde: 'no corredor do fundo' },
  { x: 1.6, z: -0.6, onde: 'na lateral do caixa' },
  { x: 1.05, z: 1.2, onde: 'no meio do salão' },
  { x: 1.1, z: 3.3, onde: 'na ponta da ilha da frente' },
  { x: 3.4, z: 3.8, onde: 'na porta, recebendo quem chega' },
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
    const por = (grupo: THREE.Group, obj: THREE.Object3D): THREE.Object3D => {
      grupo.add(obj);
      obj.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      return obj;
    };

    /* ==================================================================
     *                          O TÉRREO
     * ================================================================== */

    /**
     * O PISO POLIDO. É a mudança que mais muda a sala, e ela não é a cor: é o
     * `brilho`, que troca o `toon()` (degraus chapados, sem reflexo) pelo
     * `polido()` — o único material do jogo com especular. A mancha de luz anda
     * com a câmera, e é ela que diz "encerado" em vez de "pintado".
     *
     * 0,16 de brilho é cera. Acima de 0,3 o piso claro estoura em branco e vira
     * pista de gelo — testado, e é exatamente o que aconteceu com 0,45.
     */
    w.ground({
      width: W, depth: D,
      color: P.boutiquePiso,
      textura: porcelanatoPolido(1.8),
      brilho: 0.16,
    });
    w.setBounds(x0 + 0.5, z0 + 0.5, W / 2 - 0.5, D / 2 - 0.5);

    w.wall(x0, z0, W / 2, z0, H, P.boutiqueParede);
    w.wall(x0, z0, x0, D / 2, H, P.boutiqueParede);
    w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.boutiqueParede);
    w.wall(x0, D / 2, PORTA.x - PORTA.vao / 2, D / 2, 0.45, P.boutiqueParede);
    w.wall(PORTA.x + PORTA.vao / 2, D / 2, W / 2, D / 2, 0.45, P.boutiqueParede);

    /*
     * A BOISERIE. Uma parede lisa de treze metros é um galpão; o que faz ela
     * virar boutique são três linhas horizontais — rodapé alto, friso na altura
     * do peito e cimalha no alto — mais os QUADROS de moldura entre elas. É
     * marcenaria de parede, e custa seis caixas.
     */
    for (const [px, pz, larg, rot] of [
      [0, z0 + 0.09, W, 0],
      [x0 + 0.09, 0, D, Math.PI / 2],
    ] as const) {
      for (const [y, alt, cor] of [
        [0.11, 0.22, P.boutiqueBoiserie],
        [1.15, 0.06, P.boutiqueBoiserie],
        [H - 0.16, 0.12, P.boutiqueBoiserie],
      ] as const) {
        const faixa = new THREE.Mesh(new THREE.BoxGeometry(larg, alt, 0.07), toon(cor));
        faixa.position.set(px, y, pz);
        faixa.rotation.y = rot;
        por(terreo, faixa);
      }
      // os painéis almofadados entre o rodapé e o friso
      const quantos = Math.floor(larg / 2.1);
      for (let i = 0; i < quantos; i++) {
        const passo = larg / quantos;
        const d = -larg / 2 + passo * (i + 0.5);
        const painel = new THREE.Mesh(
          new THREE.BoxGeometry(passo - 0.35, 0.7, 0.04),
          toon(P.boutiqueBoiserie),
        );
        painel.position.set(px + (rot ? 0 : d), 0.68, pz + (rot ? d : 0));
        painel.rotation.y = rot;
        por(terreo, painel);
      }
    }

    /*
     * AS DUAS ILHAS DE TAPETE.
     *
     * Elas são DECALQUE (`w.patch`), e não peça com volume, e isso é uma escolha
     * de cena: tapete de boutique é raso e enorme, e um plano de verdade a 4 cm
     * do chão com dois metros de lado brigaria pelo pixel com o piso inteiro.
     * Decalque não grava profundidade — não tem como piscar.
     *
     * São dois por ilha: a borda escura e o miolo claro por cima, na ordem de
     * criação (quem vem depois fica por cima). Uma borda só já transforma um
     * retângulo pintado em "tapete".
     */
    const ILHAS = [
      { x: -2.6, z: -1.5 },
      { x: -2.6, z: 2.2 },
    ];
    for (const ilha of ILHAS) {
      w.patch(ilha.x, ilha.z, 4.9, 3.0, P.boutiqueTapeteBorda, 0, 0.012);
      w.patch(ilha.x, ilha.z, 4.5, 2.6, P.boutiqueTapete, 0, 0.016);
    }

    /*
     * AS ARARAS: duas por ilha, VIRADAS no eixo Z e de frente uma para a outra.
     *
     * Esta é a diferença de layout que faz a loja parecer boutique em vez de
     * depósito: antes eram quatro araras paralelas enfileiradas; agora são dois
     * pares que formam um CORREDOR entre si, com o tapete embaixo marcando a
     * ilha. É como uma loja de verdade organiza — o cliente entra no corredor,
     * não passa raspando por fora.
     *
     * A conta do corredor manda nas coordenadas: o colisor de cada arara tem
     * 0,35 de meia-profundidade e o jogador é um círculo de 0,42. Com os
     * montantes em `x = −3,9` e `x = −1,3`, sobram 1,9 de vão livre — a dupla
     * passa lado a lado.
     */
    const ARARAS = [
      { x: -3.9, z: -1.5, colecao: 0, semente: 101 },
      { x: -1.3, z: -1.5, colecao: 1, semente: 303, tipos: ['vestido', 'vestido', 'camisa'] as const },
      { x: -3.9, z: 2.2, colecao: 2, semente: 202 },
      { x: -1.3, z: 2.2, colecao: 3, semente: 404 },
    ];
    for (const a of ARARAS) {
      por(terreo, w.place(
        araraDeRoupas({ largura: 1.9, colecao: a.colecao, semente: a.semente, tipos: a.tipos }),
        a.x, 0, a.z, Math.PI / 2,
      ));
      w.blockBox(a.x, a.z, 0.95, 0.35, Math.PI / 2);
    }

    // os provadores mudaram para a parede de -X: a do fundo agora é da escada
    const PROVADORES = { x: x0 + 1.1, z: 0.3 };
    por(terreo, w.place(provadores(3), PROVADORES.x, 0, PROVADORES.z, Math.PI / 2));
    w.blockBox(PROVADORES.x - 0.52, PROVADORES.z, 1.78, 0.58, Math.PI / 2);

    // o balcão do caixa, perto da porta e olhando para +Z (de onde o cliente vem)
    const CAIXA = { x: 3.6, z: -1.4 };
    por(terreo, w.place(balcaoDaLoja(2.4), CAIXA.x, 0, CAIXA.z));
    w.blockBox(CAIXA.x, CAIXA.z, 1.25, 0.4);
    por(terreo, w.place(caixaRegistradora(), CAIXA.x - 0.75, 1.02, CAIXA.z, Math.PI));
    for (const [dx, cor] of [[-0.1, P.tecidoCoral], [0.12, P.tecidoCeu]] as const) {
      const novelo = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), toon(cor));
      novelo.position.set(CAIXA.x + dx, 1.09, CAIXA.z - 0.12);
      por(terreo, novelo);
    }

    /*
     * O PÓDIO DOS MANEQUINS, na entrada. Um degrau redondo de 12 cm com dois
     * manequins em cima: é o primeiro objeto de uma boutique, e é ele que faz a
     * entrada valer a pena olhar. Sem o pódio eles são dois bonecos no meio do
     * chão; com ele, são uma vitrine.
     */
    const PODIO = { x: 4.9, z: 2.2 };
    const degrau = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.2, 0.12, 24), polido(P.boutiqueBoiserie, { brilho: 0.1 }));
    degrau.position.set(PODIO.x, 0.06, PODIO.z);
    por(terreo, degrau);
    const fioDourado = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.022, 6, 28), toon(P.boutiqueOuro));
    fioDourado.rotation.x = Math.PI / 2;
    fioDourado.position.set(PODIO.x, 0.12, PODIO.z);
    por(terreo, fioDourado);
    por(terreo, w.place(manequimDeLoja(P.tecidoRosa, 'vestido'), PODIO.x - 0.4, 0.12, PODIO.z + 0.3, -0.5));
    por(terreo, w.place(manequimDeLoja(P.boutiqueVinho, 'casaco'), PODIO.x + 0.42, 0.12, PODIO.z - 0.35, -1.3));
    w.blockCircle(PODIO.x, PODIO.z, 1.2);

    por(terreo, w.place(mesaDeDobrar(1.7, 77), -1.2, 0, 4.2, 0.1));
    w.blockBox(-1.2, 4.2, 0.9, 0.5, 0.1);
    por(terreo, w.place(pufeDeLoja(P.boutiqueVinho), 2.2, 0, 2.2));
    w.blockCircle(2.2, 2.2, 0.42);
    /*
     * AS DUAS PRATELEIRAS FICAM NA PAREDE DO FUNDO, lado a lado: é a única
     * parede que a reforma deixou livre (a de `−X` virou provador, a de `+X`
     * virou pódio de vitrine), e parede nua de 13 m lê como salão por montar.
     * A segunda entra ENTRE a escada rolante e a primeira, que é o vão que
     * sobrou — daí ela ser 20 cm mais estreita.
     */
    por(terreo, w.place(prateleiraDaLoja(2.2, 11), 5.4, 0, z0 + 0.18));
    w.blockBox(5.4, z0 + 0.3, 1.15, 0.22);
    por(terreo, w.place(prateleiraDaLoja(2.0, 29), 2.9, 0, z0 + 0.18));
    w.blockBox(2.9, z0 + 0.3, 1.05, 0.22);

    /**
     * OS POSTES DE LUZ. Uma coluna fina com um globo aceso no alto, nos cantos
     * das ilhas.
     *
     * Eles NÃO iluminam de verdade (`PointLight` por poste seria quatro luzes
     * dinâmicas a mais por quadro, e o jogo roda no celular): o globo é um
     * material com `glow`, que acende sozinho sem custar nada. Numa cena que já
     * é clara, o que a luz precisa fazer é APARECER, e não iluminar.
     */
    for (const [lx, lz] of [
      [-5.4, 0.35], [-5.4, 4.1], [0.5, 0.35], [0.5, 4.1],
    ] as const) {
      const poste = new THREE.Group();
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.9, 10), toon(P.boutiqueOuro));
      haste.position.y = 0.95;
      poste.add(haste);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.07, 12), toon(P.boutiqueOuroEscuro));
      base.position.y = 0.035;
      poste.add(base);
      const cupula = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62),
        toon(P.boutiqueLuz, { glow: 0.75 }),
      );
      cupula.rotation.x = Math.PI;
      cupula.position.y = 1.96;
      poste.add(cupula);
      por(terreo, w.place(poste, lx, 0, lz));
      w.blockCircle(lx, lz, 0.22);
    }

    for (const [px, pz] of [[x0 + 0.9, D / 2 - 1.0], [W / 2 - 0.9, z0 + 0.9]] as const) {
      por(terreo, w.place(pottedPlant(1.25), px, 0, pz));
      w.blockCircle(px, pz, 0.32);
    }
    for (const px of [-3.4, 1.5]) {
      por(terreo, w.place(luminariaPendente(P.boutiqueOuro, 2.6), px, 0, 1.0));
    }

    /* ==================================================================
     *                      A ESCADA E O VÃO
     * ================================================================== */
    por(escada, w.place(escadaRolante(ALTURA, ESCADA.corrida), ESCADA.x, 0, ESCADA.z, Math.PI / 2));
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
     * A LAJE, e ela tem um VÃO.
     *
     * Ela é montada em quatro retângulos em volta do buraco por onde a escada
     * chega, em vez de um plano com furo: quatro caixas custam quatro malhas e
     * qualquer um lê o código; `Shape` com `holes` custaria uma triangulação
     * para desenhar o mesmo retângulo.
     *
     * O material é o mesmo `polido()` do térreo, um degrau mais quente — lá em
     * cima a luz que entra é a do lanternim, não a da vitrine.
     */
    const VAO = { x0: -5.7, x1: -3.8, z0: z0, z1: -3.1 };
    const laje = polido(P.mezaninoPiso, { brilho: 0.14 });
    const pedacoDeLaje = (cx: number, cz: number, larg: number, prof: number): THREE.Mesh => {
      const piso = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.26, prof), laje);
      piso.position.set(cx, ALTURA - 0.13, cz);
      piso.receiveShadow = true;
      return piso;
    };

    /**
     * A ABA DO VÃO FICA SEMPRE VISÍVEL, e ela é o conserto de um defeito que só
     * a foto mostrou: com o mezanino inteiro escondido, a escada rolante subia
     * cinco metros e terminava NO AR. Lia como escada quebrada, não como escada
     * para o andar de cima.
     *
     * Agora o pedaço de laje em volta do vão — os dois retângulos que ladeiam a
     * boca da escada — mora no grupo da ESCADA, que nunca some. De baixo se vê
     * o lance entrar num piso; de cima, ele chegar por ele. E o que essa aba
     * esconde, pela conta da câmera, é o canto de `-X/-Z`: parede, e nada mais.
     */
    for (const [cx, larg] of [
      [(x0 + VAO.x0) / 2, VAO.x0 - x0],
      [(VAO.x1 + (VAO.x1 + 1.0)) / 2, 1.0],
    ] as const) {
      escada.add(pedacoDeLaje(cx, (z0 + VAO.z1) / 2, larg, VAO.z1 - z0));
    }
    const arremate = new THREE.Mesh(
      new THREE.BoxGeometry(VAO.x1 - VAO.x0 + 0.1, 0.3, 0.1),
      toon(P.boutiqueOuro),
    );
    arremate.position.set((VAO.x0 + VAO.x1) / 2, ALTURA - 0.13, VAO.z1);
    escada.add(arremate);

    /*
     * E O RESTO DA LAJE, que só aparece lá em cima: duas peças que cobrem tudo
     * menos a aba e o vão. Sem esse recorte, laje e aba ficariam no mesmo plano
     * na mesma região — duas faces coplanares, que é o que serrilha na tela.
     */
    superior.add(pedacoDeLaje((VAO.x1 + 1.0 + W / 2) / 2, 0, W / 2 - VAO.x1 - 1.0, D));
    superior.add(pedacoDeLaje(
      (x0 + VAO.x1 + 1.0) / 2, (VAO.z1 + D / 2) / 2,
      VAO.x1 + 1.0 - x0, D / 2 - VAO.z1,
    ));

    // paredes altas do mezanino (as mesmas duas do térreo) e guarda-corpo nas
    // duas bordas que dão para a câmera
    /*
     * As duas paredes altas do mezanino são as MESMAS de baixo, um andar acima:
     * `w.wall` devolve a malha e já registra o colisor (que, aqui, entra na
     * lista do mezanino) — então basta subir a malha e mudá-la de grupo.
     */
    for (const parede of [
      w.wall(x0, z0, W / 2, z0, H - 0.9, P.boutiqueParede),
      w.wall(x0, z0, x0, D / 2, H - 0.9, P.boutiqueParede),
    ]) {
      parede.position.y += ALTURA;
      superior.add(parede);
    }

    /**
     * O GUARDA-CORPO: mureta baixa de vidro com o corrimão dourado em cima, nas
     * bordas de `+X` e `+Z` e em volta do vão da escada.
     *
     * Ele é BAIXO (0,95) pelo mesmo motivo de toda mureta de interior aqui: a
     * câmera olha de 34°, e um peitoril de altura normal taparia o mezanino
     * inteiro. E ele é de VIDRO, que é o que o faz existir sem pesar na tela.
     */
    const guardaCorpo = (ax: number, az: number, bx: number, bz: number): void => {
      const comp = Math.hypot(bx - ax, bz - az);
      const ang = Math.atan2(bx - ax, bz - az);
      const mx = (ax + bx) / 2;
      const mz = (az + bz) / 2;
      const vidro = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.8, comp),
        toon(P.escadaVidro, { opacity: 0.3, doubleSide: true }),
      );
      vidro.position.set(mx, ALTURA + 0.42, mz);
      vidro.rotation.y = ang;
      superior.add(vidro);
      const mao = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, comp), toon(P.boutiqueOuro));
      mao.position.set(mx, ALTURA + 0.86, mz);
      mao.rotation.y = ang;
      superior.add(mao);
      w.blockBox(mx, mz, 0.12, comp / 2, ang);
    };
    guardaCorpo(W / 2 - 0.1, z0, W / 2 - 0.1, D / 2 - 0.1);
    guardaCorpo(x0 + 0.1, D / 2 - 0.1, W / 2 - 0.1, D / 2 - 0.1);
    // e as três bordas do vão da escada (a quarta é por onde se chega)
    guardaCorpo(VAO.x0, VAO.z1, VAO.x1, VAO.z1);
    guardaCorpo(VAO.x0, z0, VAO.x0, VAO.z1);

    w.setBounds(x0 + 0.5, z0 + 0.5, W / 2 - 0.5, D / 2 - 0.5);

    /*
     * AS ARARAS PREMIUM: três, douradas, bem espaçadas, em fila com o mesmo
     * afastamento entre elas. Repetição regular aqui é de propósito — no térreo
     * a bagunça controlada é o charme, e em cima o alinhamento é o luxo.
     */
    const PREMIUM = [
      { x: 0.4, z: -2.2, colecao: 1, prata: false },
      { x: 0.4, z: 0.6, colecao: 3, prata: true },
      { x: 0.4, z: 3.4, colecao: 2, prata: false },
    ];
    for (const [i, a] of PREMIUM.entries()) {
      superior.add(w.place(
        araraPremium({ largura: 2.2, colecao: a.colecao, prata: a.prata, semente: 900 + i * 31 }),
        a.x, ALTURA, a.z, Math.PI / 2,
      ));
      w.blockBox(a.x, a.z, 1.1, 0.32, Math.PI / 2);
    }

    // o tapete do mezanino, desenhado por peça (decalque não sobe de altura)
    const tapeteDeCima = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.03, 7.4),
      toon(P.boutiqueTapete),
    );
    tapeteDeCima.position.set(-0.9, ALTURA + 0.015, 0.4);
    superior.add(tapeteDeCima);

    /**
     * O PROVADOR ABERTO E O ESPELHO GRANDE, no fundo do mezanino.
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
    superior.add(w.place(espelhoMagico({ largura: 2.4, altura: 2.7 }), ESPELHO.x, ALTURA, ESPELHO.z));
    w.blockBox(ESPELHO.x, ESPELHO.z - 0.1, 1.6, 0.3);
    // o tapetinho redondo na frente dele, que é onde se para para olhar
    const alvoDoEspelho = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 0.03, 24),
      toon(P.boutiqueTapeteBorda),
    );
    alvoDoEspelho.position.set(ESPELHO.x, ALTURA + 0.015, ESPELHO.z + 1.5);
    superior.add(alvoDoEspelho);

    superior.add(w.place(pufeDeLoja(P.boutiqueVinho), 5.2, ALTURA, 0.4));
    w.blockCircle(5.2, 0.4, 0.42);
    superior.add(w.place(pottedPlant(1.3), 5.5, ALTURA, 3.6));
    w.blockCircle(5.5, 3.6, 0.32);
    for (const px of [-2.4, 2.6]) {
      superior.add(w.place(luminariaPendente(P.boutiqueOuro, 2.2), px, ALTURA, 1.0));
    }

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
         * A SAÍDA É UM PASSO PARA DENTRO DA LOJA, e não em cima da placa pente:
         * soltar a dupla exatamente no fim do lance deixaria os dois dentro do
         * colisor da escada, e o primeiro quadro de física os empurraria para
         * fora com um tranco.
         */
        const saida = subindo
          ? { x: TOPO_DA_ESCADA.x + 0.2, z: TOPO_DA_ESCADA.z + 1.5 }
          : { x: BASE_DA_ESCADA.x + 0.9, z: BASE_DA_ESCADA.z + 1.2 };
        g.releasePlayer(saida.x, saida.z, Math.PI);
        g.releaseCompanion(saida.x - 0.7, saida.z + 0.5, Math.PI);
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
    doSuperior.push(w.interact({
      id: 'lojinha:descer',
      x: TOPO_DA_ESCADA.x + 0.1, z: TOPO_DA_ESCADA.z + 1.0, radius: 1.5,
      label: 'Descer a escada rolante', icon: '🛗',
      onInteract: async () => { await viajarNaEscada(false); },
    }));

    /* ==================================================================
     *                    O QUE SE OLHA EM CADA ANDAR
     * ================================================================== */
    doSuperior.push(w.interact({
      id: 'lojinha:espelho',
      x: ESPELHO.x, z: ESPELHO.z + 1.5, radius: 1.6,
      label: 'Se olhar no espelho', icon: '🪞',
      onInteract: async () => {
        await conversa([
          [A, 'Esse espelho é ENORME.'],
          [R, 'Dá pra ver a gente inteiro. Olha, tá até mexendo junto.'],
          [A, 'Vira de lado. Vira!'],
          [R, 'A Estella tem razão: é o melhor espelho da cidade.'],
        ]);
        if (!g.flag('espelho-do-mezanino')) {
          g.setFlag('espelho-do-mezanino');
          g.unlock({
            id: 'espelho-do-mezanino',
            title: 'O espelho do mezanino',
            place: 'Boutique da Estella',
            note: 'O espelho gigante do andar de cima da boutique, de moldura dourada e dois globinhos de luz. A gente ficou um tempo bobo na frente dele, vendo os dois mexerem junto.',
            icon: '🪞',
          });
        }
      },
    }));
    doSuperior.push(w.interact({
      id: 'lojinha:premium',
      x: 1.8, z: 0.6, radius: 1.6,
      label: 'Olhar as peças premium', icon: '✨',
      onInteract: async () => {
        await conversa([
          [R, 'Essas araras aqui em cima são douradas.'],
          [A, 'E tem quatro peças em cada. Quatro!'],
          [R, 'Quanto menos roupa na arara, mais cara a roupa.'],
          [A, 'Não vou nem perguntar o preço.'],
        ]);
      },
    }));
    doTerreo.push(w.interact({
      id: 'lojinha:provador',
      x: PROVADORES.x + 1.0, z: PROVADORES.z, radius: 1.5,
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
              note: 'A loja de roupas do parque por dentro, depois da reforma: piso polido, duas ilhas de arara com tapete, provadores de cortina e uma escada rolante que sobe pro mezanino das peças premium. A Estella circula entre tudo chamando a gente de "meus queridos".',
              icon: '👗',
            });
          } else {
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
