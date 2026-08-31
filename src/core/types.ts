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
  /** objeto que balanca de leve quando voce chega perto */
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
   * `mao` ocupa uma das 5 vagas da mochila, `vestivel` uma das 4 de acessorio.
   * E o proprio item que diz — obrigatorio, sem padrao — e nenhum caminho de
   * escrita converte um no outro: `SaveState.mover()` e `vestir()` RECUSAM o
   * que nao couber, em vez de carimbar um tipo novo para caber.
   */
  tipo: 'mao' | 'vestivel';
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
   * - `pes` nasce no pivo da perna, com y = 0 no quadril;
   * - `tronco` e `pernas` nascem no corpo, com y = 0 no CHAO — e onde a
   *   jaqueta e o calcao de banho ja moram.
   *
   * Devolve uma malha NOVA a cada chamada — o mesmo `Object3D` nao pode ter
   * dois pais, e o slot `pes` pendura uma copia em cada perna.
   */
  extra?(m: MedidasCorpo): THREE.Object3D;
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
  /** muda o enquadramento: valores maiores afastam a camera */
  setZoom(viewSize: number): void;
  /** trava/destrava o controle do jogador (usado em cutscenes) */
  lockPlayer(locked: boolean): void;
  setPlayerVisible(visible: boolean): void;
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
   * Poe na mochila SEM vestir. E o que o armario usa para entregar as pecas:
   * `addItem` vestiria na hora e nao sobraria nada para escolher no painel.
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
   * Abre o painel do guarda-roupa, com o boneco 3D de quem esta sendo
   * controlado. O movimento fica travado enquanto ele estiver aberto.
   */
  abrirGuardaRoupa(): void;

  wait(seconds: number): Promise<void>;
  /** true so no frame em que a tecla desceu; ignorada durante dialogo/diario */
  keyPressed(code: string): boolean;
  /** true enquanto a tecla estiver segurada; ignorada durante dialogo/diario */
  keyDown(code: string): boolean;
  /** barra de forca no HUD; 0..1, ou null para esconder */
  showCharge(valor: number | null): void;
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
