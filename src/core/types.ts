import type * as THREE from 'three';
import type { WorldBuilder } from '../world/WorldBuilder';
import type { SomNome } from '../audio/efeitos';

export interface CircleCollider {
  kind: 'circle';
  x: number;
  z: number;
  r: number;
}

export interface BoxCollider {
  kind: 'box';
  x: number;
  z: number;
  /** meia largura em X (antes da rotacao) */
  hw: number;
  /** meia profundidade em Z (antes da rotacao) */
  hd: number;
  /** rotacao em torno de Y, radianos */
  rot: number;
}

export type Collider = CircleCollider | BoxCollider;

export interface Bounds {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}

export interface SceneAmbient {
  /** cor do ceu / fundo */
  sky: number;
  fog?: number;
  fogNear?: number;
  fogFar?: number;
  sunColor?: number;
  sunIntensity?: number;
  /** direcao da luz principal (de onde ela vem) */
  sunDir?: [number, number, number];
  ambientColor?: number;
  ambientIntensity?: number;
  /** cena interna: sombra mais curta, sem ceu gigante */
  indoor?: boolean;
}

export interface SpawnPoint {
  x: number;
  z: number;
  /** angulo em radianos que o personagem olha ao nascer */
  facing?: number;
}

export interface SceneDef {
  id: string;
  /** nome mostrado no cartao de entrada da cena */
  name: string;
  subtitle?: string;
  ambient: SceneAmbient;
  /** roupa dos dois nesta cena; 'banho' e sem camisa e de calcao (padrao 'normal') */
  outfit?: 'normal' | 'banho';
  spawn: SpawnPoint;
  /** entradas nomeadas, usadas quando se chega por uma porta especifica */
  entries?: Record<string, SpawnPoint>;
  build(w: WorldBuilder): void;
}

export interface InteractableDef {
  id?: string;
  x: number;
  z: number;
  /** distancia em que o prompt aparece (padrao 2.0) */
  radius?: number;
  /** texto do prompt, ex: "Andar na roda gigante" */
  label: string;
  /** emoji do prompt */
  icon?: string;
  /** a que objeto a interacao se refere; hoje nao anima nada, ver Interactable */
  highlight?: THREE.Object3D;
  /** so pode ser usado uma vez por visita */
  once?: boolean;
  /** desempate quando dois prompts se sobrepoem: maior ganha (padrao 0) */
  priority?: number;
  onInteract(g: GameAPI): void | Promise<void>;
}

/**
 * Uma coisa que da para carregar ou vestir.
 *
 * O `icone` e um EMOJI, nao um arquivo — a regra de zero asset externo vale
 * aqui igual: nada de .png de item. Quando um item ganhar corpo no mundo, o
 * modelo vem de `world/props.ts` como qualquer outra peca, e o emoji continua
 * sendo o rosto dele no painel.
 */
export interface ItemDef {
  id: string;
  nome: string;
  /** emoji, sempre — ver o comentario acima */
  icone: string;
  /**
   * A CATEGORIA do item, e a trava do inventario.
   *
   * `mao` ocupa uma das 10 vagas da mochila, `vestivel` uma das 4 de acessorio.
   * E o proprio item que diz — obrigatorio, sem padrao — e nenhum caminho de
   * escrita converte um no outro: `SaveState.mover()` e `vestir()` RECUSAM o
   * que nao couber, em vez de carimbar um tipo novo para caber.
   */
  tipo: 'mao' | 'vestivel';
  /**
   * Vestimenta FUNCIONAL: a que muda o JOGO, nao so a aparencia.
   *
   * E a excecao da regra "roupa nao entra na mochila de mao". Os patins dao
   * 1,3x de velocidade — sao equipamento, e equipamento se carrega e se calca
   * onde a pessoa estiver, sem voltar em casa. Ja um vestido nao faz nada
   * alem de ser bonito, entao ele vive no guarda-roupa e so se troca la.
   *
   * Sem esta separacao as duas coisas brigam: ou a roupa polui as 10 vagas da
   * mochila, ou os patins viram um item que so da para calcar no quarto do
   * Ari — e o parque, que e onde se anda de patins, fica do outro lado do
   * mapa.
   *
   * So faz sentido em `tipo: 'vestivel'`; num item de mao e ignorado.
   */
  funcional?: boolean;
  /** linha curta que o painel mostra ao passar o olho */
  nota?: string;

  // --- guarda-roupa: so para `tipo: 'vestivel'`
  /**
   * Que parte do corpo este vestivel ocupa.
   *
   * As 4 vagas de vestimenta SAO as 4 partes, na ordem de `SLOTS_ROUPA`: a
   * vaga 0 e a cabeca, a 1 o tronco, e assim por diante. E por isso que o
   * chapeu de campeao e os patins convivem — cabeca e pe sao vagas
   * diferentes — e por isso que dois chapeus nao convivem.
   */
  slot?: SlotRoupa;
  /** cor da parte principal (torso, perna, pe, calota do gorro) */
  cor?: number;
  /** cor da parte secundaria (manga, barra, cano); sem isto usa `cor` */
  corDetalhe?: number;
  /**
   * So `pernas`: a cor do CALCAO, no traje de banho.
   *
   * Existe porque no `banho` o corpo inteiro vira pele e a unica peca que
   * sobra e o calcao, que ate agora tinha a cor fixa da ficha da pessoa
   * (`spec.swim`). E a peca das pernas que manda nele, que e o mesmo lugar de
   * onde sai a calca — so que num traje diferente.
   *
   * Uma bermuda de praia declara SO isto e nao declara `cor`: sem `cor`, a
   * perna continua com a calca da ficha fora d'agua (o resolvedor ja trata
   * `cor === undefined` como "esta peca nao pinta o corpo"), entao a peca
   * simplesmente nao aparece vestida na rua. Nada de estado novo para isso.
   */
  corBanho?: number;
  /** Idem: as duas faixas da bermuda estampada. Sem isto, o calcao e liso. */
  estampaBanho?: number;
  /**
   * So `cabeca`: esconde o cabelo enquanto a peca estiver vestida.
   *
   * Existe porque cabelo aqui tem VOLUME de verdade — a juba do Ari chega a
   * ~1,6 x headR — e um gorro que a envolvesse por fora viraria um capacete.
   * Gorro de verdade achata o cabelo, e esconder e o mesmo caminho que o
   * patins ja usa para o pe que ele substitui. Um bone de aba, que so pousa
   * em cima, deixa isto desligado.
   */
  cobreCabelo?: boolean;
  /**
   * Geometria adicional no corpo.
   *
   * A peca entra como IRMA das pecas que ja existem, nunca recriando membro:
   * a caminhada e a natacao dependem dos pivos montados no construtor do rig,
   * e mexer neles e a unica coisa de fato proibida aqui.
   *
   * O REFERENCIAL muda por slot, e e o que a fabrica precisa saber:
   * - `cabeca` nasce dentro da cabeca, com y = 0 no centro do cranio;
   * - `pernas` e `pes` nascem no pivo da perna, com y = 0 no quadril;
   * - `tronco` nasce no corpo, com y = 0 no CHAO — e onde a jaqueta e o
   *   calcao de banho ja moram.
   *
   * Devolve uma malha NOVA a cada chamada — o mesmo `Object3D` nao pode ter
   * dois pais, e o slot `pes` pendura uma copia em cada perna.
   *
   * `lado` e -1 no membro de -X e 1 no de +X. Peca simetrica ignora; peca que
   * se desloca para FORA do corpo precisa multiplicar por ele, senao a copia
   * da esquerda vai para dentro. Vale 1 para cabeca e tronco, que tem copia
   * unica.
   */
  extra?(m: MedidasCorpo, lado: -1 | 1): THREE.Object3D;
  /**
   * Geometria pendurada em CADA BRACO, uma copia por lado.
   *
   * Existe porque manga grande nao pode morar no corpo: uma manga de quimono
   * cai bem abaixo da mao, e parada enquanto o braco balanca ela denuncia na
   * primeira passada. Pendurada no pivo do braco ela acompanha o movimento.
   *
   * E seguro pelo mesmo motivo que o patins e: ele ja e filho do pivo da
   * PERNA. Virar filho de um pivo nao o recria nem o move — recriar membro
   * continua sendo a unica coisa proibida.
   *
   * REFERENCIAL: o pivo do braco, y = 0 no ombro, com o braco pendendo em -Y.
   * `lado` e -1 no braco de -X e 1 no de +X — ver a nota em `extra`.
   */
  extraBraco?(m: MedidasCorpo, lado: -1 | 1): THREE.Object3D;
  /**
   * Deixa o braco nu: a manga vira pele em vez da cor da peca.
   *
   * Para top sem manga e vestido de alca. Nao da para a ficha dizer "cor de
   * pele" — a pele e de cada personagem (`spec.skin`), nao da peca —, entao
   * quem resolve e o rig, reaproveitando o material que o traje de banho ja usa.
   */
  bracosNus?: boolean;
  /** Idem para a perna: vestido, saia e short. */
  pernasNuas?: boolean;
  /**
   * Como o personagem segura isto na mao.
   *
   * - `upright`: braco esticado para a frente e o objeto em pe — sorvete, suco;
   * - `relaxed`: braco so descolado do tronco, objeto pendurado na mao — frisbee;
   * - `none`: nao muda a pose (padrao para o que nem aparece na mao).
   */
  holdPose?: HoldPose;
}

export type HoldPose = 'upright' | 'relaxed' | 'none';

// --- guarda-roupa -----------------------------------------------------------
//
// Roupa NAO tem armazenamento proprio: peca de roupa e um `ItemDef` como
// qualquer outro e mora numa das 4 vagas de vestimenta do inventario. E por
// isso que se troca de roupa em qualquer lugar, e nao so na frente do armario.
//
// As 4 vagas SAO estas 4 partes, nesta ordem. A vaga e o loadout.

export type SlotRoupa = 'cabeca' | 'tronco' | 'pernas' | 'pes';

/** ordem canonica dos slots; usada no diff por slot e, depois, na tela */
export const SLOTS_ROUPA: readonly SlotRoupa[] = ['cabeca', 'tronco', 'pernas', 'pes'];

/**
 * As medidas do corpo de que a fabrica de geometria precisa.
 *
 * A peca NAO conhece o rig: ela recebe numeros e devolve um `Object3D`, como
 * qualquer peca de `props.ts`. E o que impede uma roupa de sair mexendo em
 * pivo de animacao.
 */
export interface MedidasCorpo {
  /** altura total da pessoa */
  h: number;
  /** multiplicador de largura do build (BUILD_WIDTH) */
  w: number;
  headR: number;
  legH: number;
  torsoH: number;
}

/** O que uma pessoa esta vestindo: slot -> id da peca. Sai das vagas. */
export type Loadout = Partial<Record<SlotRoupa, string>>;
// --- fim guarda-roupa -------------------------------------------------------

/** Endereco de uma vaga do inventario. E o que o arrastar move de um lado para outro. */
export interface Vaga {
  lista: 'mao' | 'vestivel';
  indice: number;
}

/**
 * O que aconteceu ao tentar pegar um item.
 *
 * E um enum e nao um boolean porque quem chama precisa saber POR QUE falhou
 * para dizer a coisa certa na tela.
 */
export type Coleta = 'mao' | 'guardado' | 'repetido' | 'cheio';

export interface Memory {
  id: string;
  title: string;
  place: string;
  note: string;
  icon: string;
}

/** Superficie que as cenas e os interativos usam para falar com o jogo. */
export interface GameAPI {
  /** mostra uma ou varias falas e resolve quando o jogador fecha a ultima */
  say(lines: string | string[], speaker?: string): Promise<void>;
  /** pergunta com botoes; resolve com o indice escolhido */
  ask(pergunta: string, opcoes: string[], speaker?: string): Promise<number>;
  /** aviso curto no canto da tela */
  toast(text: string, icon?: string): void;
  /** toca um efeito sonoro; a lista está em audio/efeitos.ts */
  som(nome: SomNome): void;
  /** troca de cena; entry e o nome de uma entrada da cena destino */
  goTo(sceneId: string, entry?: string): void;
  /** camera passa a seguir outro objeto; null volta pro jogador */
  focusCamera(target: THREE.Object3D | null): void;
  /**
   * Camera "por cima do ombro": perspectiva colocada em `de` olhando para
   * `para`. Passar `null` devolve a isometrica de sempre. E o que o ping pong
   * usa para virar uma falsa primeira pessoa.
   */
  setCameraOmbro(de: THREE.Vector3 | null, para?: THREE.Vector3): void;
  /** posicao do ponteiro (mouse ou dedo) em -1..1, y para cima */
  pointer(): { x: number; y: number };
  /** placar do minigame; null esconde */
  showPlacar(dados: { eu: string; ele: string; meus: number; dele: number } | null): void;
  /**
   * Painel do turno do Mania de Churrasco: relogio, dinheiro, coracoes e a
   * bandeja de quem esta sendo controlado. `null` esconde.
   */
  showTurno(dados: {
    tempo: number;
    dinheiro: number;
    coracoes: number;
    bandeja: readonly { icone: string; titulo: string }[];
  } | null): void;
  /** muda o enquadramento: valores maiores afastam a camera */
  setZoom(viewSize: number): void;
  /** trava/destrava o controle do jogador (usado em cutscenes) */
  lockPlayer(locked: boolean): void;
  setPlayerVisible(visible: boolean): void;
  /**
   * A CARTEIRA do casal, em reais. UMA SÓ para os dois — a mochila do Ari e a
   * do Renan mostram sempre o mesmo número.
   *
   * `ganhar` devolve o saldo novo. `gastar` devolve `false` e NÃO tira nada
   * quando falta dinheiro, para uma loja poder perguntar e pagar na mesma
   * chamada em vez de ler o saldo e debitar em dois passos que podem discordar.
   */
  carteira(): number;
  ganhar(quanto: number): number;
  gastar(quanto: number): boolean;
  /** flags persistentes, ex: ja regou a planta */
  flag(key: string): boolean;
  setFlag(key: string, value?: boolean): void;
  /** contadores persistentes, ex: quantos frisbees pegou */
  bump(key: string, by?: number): number;
  stat(key: string): number;
  /** desbloqueia uma memoria no diario */
  unlock(memory: Memory): void;

  // --------------------------------------------------------- mochila
  // Cada personagem tem a SUA mochila. `quem` e o id da ficha ('ari',
  // 'renan'); omitido, vale quem esta sendo controlado agora.
  /**
   * Coleta com auto-stash: tenta a vaga principal, depois as outras quatro.
   * Nada e sobrescrito nunca — mochila cheia devolve 'cheio' e o item fica onde
   * estava.
   */
  addItem(item: ItemDef, quem?: string): Coleta;
  /**
   * Guarda SEM vestir. E o que o armario usa para entregar as pecas:
   * `addItem` vestiria na hora e nao sobraria nada para escolher no painel.
   *
   * ONDE guarda depende da categoria, e nao de quem chama: roupa cosmetica vai
   * para o guarda-roupa (`wardrobeItems`), item de mao e vestimenta funcional
   * vao para as vagas da mochila.
   */
  storeItem(item: ItemDef, quem?: string): Coleta;
  /** Tira um item da mochila ou dos acessorios, onde quer que ele esteja. */
  removeItem(id: string, quem?: string): boolean;
  hasItem(id: string, quem?: string): boolean;
  /** O que esta DE FATO na mao: o item do slot principal, ou null. */
  getActiveHandItem(quem?: string): ItemDef | null;
  /** Escolhe qual das 5 vagas e a principal. */
  setActiveHandSlot(indice: number, quem?: string): void;
  activeHandSlot(quem?: string): number;
  /**
   * Veste um acessorio. A vaga NAO e escolhida: ela vem do `slot` da ficha,
   * porque as 4 vagas de vestimenta sao as 4 partes do corpo.
   */
  equipWearable(item: ItemDef, quem?: string): boolean;
  unequipWearable(slot: number, quem?: string): void;
  /** Move (ou troca) um item entre duas vagas. E o que o arrastar usa. */
  moveItem(de: Vaga, para: Vaga, quem?: string): boolean;
  /** As 5 vagas da mochila, na ordem da tela; null e vaga vazia. */
  handItems(quem?: string): ReadonlyArray<ItemDef | null>;
  /** As 4 vagas de acessorio, na ordem da tela (= a ordem de `SLOTS_ROUPA`). */
  wearables(quem?: string): ReadonlyArray<ItemDef | null>;
  /**
   * O guarda-roupa: as pecas cosmeticas que a pessoa tem e NAO esta vestindo.
   *
   * E uma lista propria, fora das 10 vagas da mochila, porque roupa cosmetica
   * nao ocupa vaga de mao — era o que enchia o inventario de vestido e fazia a
   * mesma peca aparecer em dois lugares.
   */
  wardrobeItems(quem?: string): ReadonlyArray<ItemDef>;
  /**
   * Abre o painel do guarda-roupa, com o boneco 3D de quem esta sendo
   * controlado. O movimento fica travado enquanto ele estiver aberto.
   */
  abrirGuardaRoupa(): void;
  /**
   * Abre o vestiario do clube: o guarda-roupa encolhido na moda praia — o
   * oculos escuros e a cor da bermuda. Trava o movimento igual ao armario.
   *
   * Nao e um segundo sistema de roupa: ele mexe nas mesmas vagas do corpo, com
   * os mesmos itens, no mesmo save. Cada pessoa tem o seu.
   */
  abrirVestiario(): void;
  /**
   * Abre o quadro de memorias e pinta a memoria de `id` (as do catalogo em
   * `world/memoriasData.ts`). O movimento fica travado enquanto ele estiver
   * aberto. Nao faz nada se o id nao existir.
   */
  abrirMemoria(id: string): void;
  /**
   * Abre o cardapio do restaurante em primeira pessoa (o acervo mora em
   * `world/cardapioData.ts`). Trava o movimento enquanto estiver aberto, e a
   * promessa so resolve quando ele FECHA — e o que deixa a cutscene da mesa
   * escrever "senta, conversa, le o cardapio, pede, levanta" em linha reta.
   *
   * Resolve com o ID do prato escolhido, ou `null` se a pessoa saiu sem pedir.
   * O id serve para duas coisas: o nome que sai na fala (`pratoPorId`) e a peca
   * 3D que o garcom entrega (`pratoServido`).
   *
   * `casa` e o nome que sai no alto da folha. E a MESMA cozinha nos dois lados
   * da parede — o cardapio nao muda —, mas quem senta na area externa esta no
   * "Restaurante do Clube" e quem senta la dentro esta no "Mania de Churrasco".
   */
  abrirCardapio(casa?: string): Promise<string | null>;

  wait(seconds: number): Promise<void>;
  /** true so no frame em que a tecla desceu; ignorada durante dialogo/diario */
  keyPressed(code: string): boolean;
  /** true enquanto a tecla estiver segurada; ignorada durante dialogo/diario */
  keyDown(code: string): boolean;
  /**
   * Barra de forca no HUD; 0..1, ou null para esconder. `alvo` marca um ponto
   * da barra (a forca que acerta o parceiro) e `zona` e a largura da faixa de
   * acerto em volta dele.
   */
  showCharge(valor: number | null, alvo?: number | null, zona?: number): void;
  /** posicao atual do jogador */
  playerPosition(): THREE.Vector3;
  /** angulo para onde o jogador esta olhando, em radianos */
  playerFacing(): number;
  /** prende o jogador dentro de outro objeto (cabine, carro, sofa) */
  ridePlayer(host: THREE.Object3D, local: THREE.Vector3, scale?: number, facing?: number): void;
  /** devolve o jogador para o chao da cena */
  releasePlayer(x: number, z: number, facing?: number): void;

  // ------------------------------------------------------------- a dupla
  /** nome de quem esta sendo controlado agora */
  playerName(): string;
  /** id da ficha de quem esta sendo controlado ('ari', 'renan') */
  playerId(): string;
  /** nome de quem esta acompanhando */
  companionName(): string;
  /** id da ficha de quem esta acompanhando */
  companionId(): string;
  companionPosition(): THREE.Vector3;
  /** angulo para onde o parceiro esta olhando AGORA (o giro e suave) */
  companionFacing(): number;
  rideCompanion(host: THREE.Object3D, local: THREE.Vector3, scale?: number, facing?: number): void;
  /** manda o parceiro ate um ponto em vez de seguir voce */
  commandCompanion(x: number, z: number): void;
  /** devolve o parceiro ao comportamento de seguir */
  freeCompanion(): void;
  /** para o parceiro onde ele esta e vira ele para encarar um ponto */
  holdCompanion(olharX: number, olharZ: number): void;
  /** os dois sentam (ou levantam) */
  setSitting(sentados: boolean): void;
  /**
   * Os dois deitam (ou levantam). Quem VIRA o corpo e a ancora da cena — um
   * `Object3D` com `rotation.x = -PI/2` passado ao `ridePlayer`/`rideCompanion`;
   * isto so troca a animacao para a pose de descanso, com o balanco dos bracos.
   */
  setLying(deitados: boolean): void;
  releaseCompanion(x: number, z: number, facing?: number): void;
  /** troca quem o jogador controla */
  swapCharacters(): void;

  // -------------------------------------------------------------- agua
  /** 0 = seco, 1 = submerso ate o pescoco */
  submergePlayer(valor: number): void;
  submergeCompanion(valor: number): void;
  /** troca a roupa dos dois: 'banho' e sem camisa e de calcao */
  setOutfit(traje: 'normal' | 'banho'): void;
}
