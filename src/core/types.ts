import type * as THREE from 'three';
import type { WorldBuilder } from '../world/WorldBuilder';
import type { SomNome } from '../audio/efeitos';
import type { ChessEngine, Cor } from '../entities/ChessEngine';
import type { ConviteDeXadrez, FimDeXadrez } from '../ui/mesaDeXadrez';
import type { VigiaDaOclusao } from './Oclusao';
import type {
  AcaoNaLoja, BotaoDoPosicionador, CartaNaTela, ConteudoDaLoja, ConteudoDoArsenal, ConteudoDoLivro, ContextoDaEscolha,
  EstadoDoPosicionador, FimDoJardim, PainelDoJardim, SaidaDaLoja,
} from '../minigames/jardim/tela';
import type { EstiloDeRegador } from '../world/regador';

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

/**
 * UM ENFEITE DA ESTUFA NO SAVE (a lojinha da Josefina vende, a dupla põe onde
 * quiser). Cada compra é uma UNIDADE com número próprio: dois anões são dois
 * enfeites, cada um no seu lugar. `posta` é onde ele está no chão da estufa;
 * `null` quer dizer guardado, esperando lugar.
 */
export interface DecoracaoNoSave {
  readonly uid: number;
  /** o id da ficha em `world/decoracoes.ts` */
  readonly id: string;
  readonly posta: { readonly x: number; readonly z: number; readonly giro: number } | null;
}

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
  /**
   * QUANTO CUSTA, em reais, na arara da Estella.
   *
   * So a loja le isto. Peca sem preco nao esta a venda — e o caso de tudo o
   * que ja estava no armario do Ari e do premio do Walter: eles nao aparecem
   * em vitrine nenhuma, e nao ha "preco 0" para significar isso (zero e um
   * preco, e um preco de graca). As pecas do vestiario do clube tem preco
   * (ate R$ 20, pedido do Renan): la, "desbloquear" e comprar.
   *
   * O numero e inteiro e em reais cheios, na mesma escala do resto do jogo: o
   * bilhete da roda gigante custa 24, um prato do Mania sai por 12 a 34, e um
   * turno inteiro de garcom paga uns 200. Uma peca de terreo (35 a 110) e
   * uma tarde de trabalho; uma premium do mezanino (150 a 220) e um turno bom.
   */
  preco?: number;

  // --- guarda-roupa: so para `tipo: 'vestivel'`
  /**
   * Que parte do corpo este vestivel ocupa.
   *
   * As 6 vagas de vestimenta SAO as 6 partes, na ordem de `SLOTS_ROUPA`: a
   * vaga 0 e a cabeca, a 1 o tronco, e assim por diante. E por isso que o
   * chapeu de campeao e os patins convivem — cabeca e pe sao vagas
   * diferentes — e por isso que dois chapeus nao convivem.
   */
  slot?: SlotRoupa;
  /**
   * So `acessorio`: ONDE a peca se prende. O acessorio e a vaga das coisas
   * pequenas que vao em qualquer parte do corpo (presilha no cabelo, adesivo
   * na camiseta), entao e a peca que diz em que pai ela pendura:
   * - `cabeca`: na cabeca, y = 0 no centro do cranio (como o `cabeca`);
   * - `corpo` (o padrao): no corpo, y = 0 no CHAO (como o `tronco`).
   */
  presoEm?: 'cabeca' | 'corpo';
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
   * A cor da AMOSTRA nos painéis de loja, quando a peça não pinta nada no
   * corpo (a mochila casco da Josefina: sem `cor`, a camiseta continua a da
   * pessoa, e a amostra sairia cinza).
   */
  amostra?: number;
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
   *
   * `peca` E A PROPRIA FICHA, e serve para UMA coisa: a geometria ler a COR
   * dali em vez de cravar a da paleta. Sem isso, a cor do `ItemDef` so pintava
   * a malha que ja existe no corpo (torso, perna, pe) e a geometria extra
   * saia sempre na cor de quem foi desenhado primeiro — quatro vestidos de
   * cores diferentes na arara da Estella apareciam os quatro rosa.
   *
   * Fabrica que so tem uma cor possivel pode ignorar o parametro, como faz a
   * gargantilha. Fabrica que e VESTIDA EM VARIAS CORES le `peca.cor` e
   * `peca.corDetalhe`, usando a cor antiga como padrao.
   */
  extra?(m: MedidasCorpo, lado: -1 | 1, peca: ItemDef): THREE.Object3D;
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
   * `lado` e -1 no braco de -X e 1 no de +X — ver a nota em `extra`, que vale
   * tambem para o `peca`.
   */
  extraBraco?(m: MedidasCorpo, lado: -1 | 1, peca: ItemDef): THREE.Object3D;
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
   * Idem para o PEITO: o tronco do rig vira pele. Para a camiseta SOLTA, que é
   * um casco por fora do corpo com o decote aberto — pelo decote tem que
   * aparecer pele, e não o tronco pintado da cor da camiseta.
   */
  peitoNu?: boolean;
  /**
   * Idem para o PÉ: chinelo. O pé do rig (a caixa do tênis) vira pele, e a
   * peça é só a sola e a tira por cima dele — pé descalço no chinelo.
   */
  pesNus?: boolean;
  /**
   * PEÇA DE PISCINA: aparece também no traje de banho (o clube).
   *
   * No banho o corpo inteiro vira pele e, de roupa, só ficam a cabeça e o
   * acessório — bota, luva e camiseta são de rua. O vestiário do clube vende
   * o que é feito para a beira da piscina (chinelo, boia de braço, colar de
   * flor, bermuda estampada), e é esta marca que deixa a peça continuar no
   * corpo dentro do clube. Camiseta NUNCA leva a marca: no clube é sem
   * camiseta e de shorts (pedido do Renan).
   */
  praia?: boolean;
  /**
   * Só `pernas`: a geometria que a peça tem no QUADRIL.
   *
   * O `extra` de pernas pendura no pivô de CADA perna, e não alcança o quadril
   * — e é no quadril que mora o calção da bermuda. Uma bermuda estampada põe
   * as listras, as bolinhas ou as flores do calção aqui, e as da perna do
   * shorts no `extra`.
   *
   * REFERENCIAL: o corpo, y = 0 no CHÃO — o mesmo do `tronco`. O calção do rig
   * é um cilindro de raio `0,118·h·w` (embaixo `0,112`), `0,105·h` de altura,
   * centrado em `legH + 0,012·h` e achatado em 0,85 no z.
   */
  extraQuadril?(m: MedidasCorpo, lado: -1 | 1, peca: ItemDef): THREE.Object3D;
  /**
   * Um enfeite a mais na peca, quando ela tem um modelo PROPRIO do rig.
   *
   * Hoje so o patins tem: ele nao e um `extra` de roupa, ele nasce no
   * construtor do rig e SUBSTITUI o pe (a bota engole o tornozelo, entao o
   * tenis por dentro apareceria pela costura). Enquanto existia um par so, a
   * cor dele vinha da ficha do personagem; com o premio do Mano passaram a
   * existir dois, e a ficha da peca ganhou voz: `cor` pinta a bota, `corDetalhe`
   * as rodas e o cadarco, e isto acrescenta a casquinha de sorvete na lateral.
   */
  enfeite?: 'sorvete';
  /**
   * Como o personagem segura isto na mao.
   *
   * - `upright`: braco esticado para a frente e o objeto em pe — sorvete, suco;
   * - `relaxed`: braco so descolado do tronco, objeto pendurado na mao — frisbee;
   * - `regando`: braco LEVANTADO e o objeto inclinado para a frente — regador;
   * - `none`: nao muda a pose (padrao para o que nem aparece na mao).
   */
  holdPose?: HoldPose;
}

export type HoldPose = 'upright' | 'relaxed' | 'regando' | 'borrifando' | 'none';

// --- guarda-roupa -----------------------------------------------------------
//
// Roupa NAO tem armazenamento proprio: peca de roupa e um `ItemDef` como
// qualquer outro e mora numa das 6 vagas de vestimenta do inventario. E por
// isso que se troca de roupa em qualquer lugar, e nao so na frente do armario.
//
// As 6 vagas SAO estas 6 partes, nesta ordem. A vaga e o loadout. As duas
// ultimas vieram depois (pedido do Renan): `maos` e a das luvas e pulseiras, e
// `acessorio` e a das coisas pequenas que vao em qualquer parte do corpo —
// presilha, adesivo, broche. A ordem so CRESCE no fim: a vaga 0 continua sendo
// a cabeca, entao save antigo de 4 vagas le certo.

export type SlotRoupa = 'cabeca' | 'tronco' | 'pernas' | 'pes' | 'maos' | 'acessorio';

/** ordem canonica dos slots; usada no diff por slot e, depois, na tela */
export const SLOTS_ROUPA: readonly SlotRoupa[] = ['cabeca', 'tronco', 'pernas', 'pes', 'maos', 'acessorio'];

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
  /**
   * o comprimento do braco, do ombro a ponta da mao: e dele que a luva e a
   * pulseira (`maos`) tiram o pulso (~0,8·armLen) e a mao (~0,92·armLen)
   */
  armLen: number;
  /**
   * Até onde o CABELO vai, a partir do centro do crânio, na direção que faz
   * `angulo` (radianos) com o alto da cabeça, no plano de orelha a orelha
   * (positivo para `+X`). É o chão de peça que pousa POR CIMA do cabelo sem
   * cobri-lo (tiara, orelhinha). Medido do cabelo montado, não chutado: o
   * cacheado do Ari passa de 1,5·headR e os cachos curtos do Renan ficam em
   * ~1,3 — um número só servia para um dos dois, e a orelhinha sumia no outro.
   */
  cabelo(angulo: number): number;
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
  /**
   * Enquadra um retangulo do MUNDO, em vez de fixar so a altura.
   *
   * `setZoom` diz a ALTURA do enquadramento, e a largura sai do formato da
   * tela (`w = h * aspecto`). Num monitor deitado sobra largura; num celular
   * em pe, o mesmo numero da menos de um terco dela, e quem estiver nas
   * pontas da cena some do quadro.
   *
   * Use isto em cutscene com gente espalhada: a cena diz o que precisa CABER,
   * em unidades de mundo, e a camera escolhe o zoom que serve para as duas
   * telas. Em tela larga o resultado e identico ao `setZoom(altura)`.
   */
  enquadrar(largura: number, altura: number): void;
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
  /**
   * Uma peça GANHA jogando (os marcos da estufa, e o que vier): vai para o
   * guarda-roupa DOS DOIS e fica anotada em `save.premios`, então volta a cada
   * abertura do armário e do espelho da boutique — descartar tira do corpo,
   * nunca da vida. Devolve `false` se ela já era de vocês.
   */
  ganharPeca(peca: ItemDef): boolean;
  /** já pagaram por esta peça (ou ela já está com quem joga)? */
  jaTemPeca(id: string): boolean;
  /**
   * COMPRA UMA ROUPA com preço: debita da carteira do casal e guarda no
   * guarda-roupa dos dois, com o aviso na tela. O mesmo caminho da arara da
   * boutique — a lojinha da Josefina usa este.
   */
  comprarPeca(peca: ItemDef): 'comprou' | 'ja-tem' | 'sem-dinheiro' | 'sem-espaco' | 'sem-preco';
  /** os enfeites da estufa no save (ver `DecoracaoNoSave`) */
  decoracoes(): readonly DecoracaoNoSave[];
  /** troca a lista de enfeites inteira no save */
  salvarDecoracoes(lista: readonly DecoracaoNoSave[]): void;
  /**
   * Abre a banca da Josefina (abas de roupas e de decorações). `agir` faz as
   * compras sem fechar o painel e devolve o conteúdo novo; o painel resolve
   * quando fecha, dizendo se a dupla foi provar roupa ou colocar um enfeite.
   */
  abrirLojaDaJosefina(conteudo: ConteudoDaLoja, agir: (a: AcaoNaLoja) => ConteudoDaLoja): Promise<SaidaDaLoja>;
  /**
   * A barra do modo de decorar (o enfeite na mão, se cabe, e os botões de
   * girar, colocar e cancelar). `null` esconde. A cena chama todo quadro.
   */
  posicionador(estado: EstadoDoPosicionador | null, aoBotao?: (b: BotaoDoPosicionador) => void): void;
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
  /** As 6 vagas de vestimenta, na ordem da tela (= a ordem de `SLOTS_ROUPA`). */
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
   * Abre o VESTIARIO do clube: o painel do guarda-roupa com o nome
   * "Vestiario" e duas abas — o guarda-roupa de sempre e as ROUPAS DE PISCINA
   * (`MODA_PRAIA`), que se provam no boneco (de traje de banho) e se
   * desbloqueiam pagando, a ate R$ 20. Desbloqueada, a peca vira roupa de todo
   * guarda-roupa dos dois. Trava o movimento igual ao armario.
   *
   * Nao e um segundo sistema de roupa: ele mexe nas mesmas vagas do corpo, com
   * os mesmos itens, no mesmo save. Cada pessoa tem o seu.
   */
  abrirVestiario(): void;
  /**
   * Abre uma ARARA da boutique da Estella: a vitrine daquela fila, com o
   * boneco de prova ao lado. Trava o movimento igual ao armario.
   *
   * PROVAR NAO MEXE NO SAVE — a peca provada so veste o boneco do painel.
   * Quem escreve e o botao de comprar, e ele debita da carteira do casal e
   * guarda a peca no guarda-roupa de quem esta sendo controlado (roupa
   * cosmetica nao ocupa vaga de mao). Peca sem `preco` na ficha e ignorada.
   */
  abrirLoja(titulo: string, pecas: readonly ItemDef[]): void;
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
  /**
   * Abre o quadro de inscricoes da arena de ping pong e resolve com o `id` do
   * desafiante escolhido (ou `null`, que e sair sem desafiar ninguem).
   *
   * Quem esta no quadro sai das FLAGS, e nao de uma lista que a cena passa: a
   * inscricao de cada um e um `inscreveSe` na ficha dele
   * (`world/adversariosData.ts`), e o motor le o save. Assim a cena so precisa
   * dizer "abre" — e o quadro se monta sozinho conforme o jogo anda.
   */
  abrirQuadroDeInscricoes(): Promise<string | null>;
  /**
   * A TELA DAS TRÊS CARTAS da rodada do jardim: resolve com o `id` da carta
   * pega. Nunca com `null` — ela não fecha sem escolha, porque subir de nível
   * sem pegar carta seria perder a melhoria. Trava o movimento enquanto aberta.
   *
   * Quem monta as cartas é o minigame (`minigames/jardim/tela.ts`); a tela só
   * desenha e devolve.
   */
  escolherCartaDoJardim(cartas: readonly CartaNaTela[], contexto: ContextoDaEscolha): Promise<string>;
  /**
   * O LIVRO DAS CARTAS: põe uma carta na coleção (fica no save, entre
   * rodadas). Devolve se ela era nova.
   */
  desbloquearCartaDoJardim(id: string): boolean;
  /** as ids das cartas já descobertas, na ordem em que apareceram */
  cartasDoLivro(): readonly string[];
  /**
   * Abre o LIVRO DA ESTUFA com o baralho inteiro (as descobertas aparecem, as
   * outras são vaga cinza) e, com `conteudo`, as abas de pragas e de
   * recompensas. Resolve com a ONDA do marco que a dupla mandou resgatar, ou
   * `null` quando só fechou.
   */
  abrirLivroDeCartas(cartas: readonly CartaNaTela[], conteudo?: ConteudoDoLivro | null): Promise<string | null>;
  /**
   * Abre o PAINEL DAS ARMAS da estufa (a bancada ao lado da parede das armas):
   * uma aba por arma, com a meta e as cartas dela. Resolve com o id da arma que
   * a dupla mandou usar, ou `null` quando só fechou.
   */
  abrirArsenal(conteudo: ConteudoDoArsenal): Promise<string | null>;
  /** A tela do fim da rodada do jardim: os números e as cartas da mão. */
  mostrarFimDoJardim(fim: FimDoJardim): Promise<void>;
  /** A barra de experiência da rodada do jardim, no alto; `null` esconde. */
  showExperiencia(dados: { nivel: number; noNivel: number; custo: number } | null): void;
  /**
   * TROCA O DESENHO DO REGADOR QUE ESTÁ NA MÃO dos dois.
   *
   * É a regra do §6 do plano: carta que mexe no regador mexe na peça da mão. A
   * mão de cartas calcula o estilo (`MaoDeCartas.estiloDoRegador()`) e a cena
   * entrega aqui; `null` volta para o regador de fábrica.
   */
  vestirRegador(estilo: Partial<EstiloDeRegador> | null): void;
  /**
   * O PAINEL DA RODADA DO JARDIM: a onda, a água no tanque e quantos canteiros
   * ainda estão de pé. `null` esconde. A barra de experiência é outra
   * (`showExperiencia`), porque ela também aparece no treino.
   */
  showJardim(dados: PainelDoJardim | null): void;
  /**
   * O BOTÃO DA AJUDA DO PAR foi apertado (o botão do painel ou a tecla F)?
   * Devolve uma vez e esquece: quem pergunta é a rodada, a cada quadro.
   */
  pedidoDeAjudaDoPar(): boolean;
  /**
   * TROCA A MÚSICA por um clima de `CLIMAS` que não é de cena (a defesa da
   * estufa). `null` volta para o clima da cena atual. A troca espera o
   * compasso fechar, como toda virada de clima.
   */
  trocarMusica(clima: string | null): void;
  /**
   * A OCLUSÃO (`core/Oclusao.ts`): o que fica entre a câmera e estes pontos
   * (e a dupla, sempre) fica translúcido. `ignorar` são os objetos dos próprios
   * pontos, que nunca esmaecem. `null` desliga e devolve tudo como estava.
   */
  vigiarOclusao(vigia: VigiaDaOclusao | null): void;
  /**
   * VIRA O JOGADOR PARA UM PONTO enquanto ele está PARADO — é o regador da
   * rodada apontando para o bicho que ele rega. Andando, quem manda no giro
   * continua sendo a direção da tecla. `null` solta.
   */
  mirarJogador(alvo: { x: number; z: number } | null): void;
  /** Multiplica a velocidade de andar de quem é controlado (as cartas de passo). 1 = normal. */
  setVelocidadeDoJogador(multiplicador: number): void;
  /**
   * A PEÇA QUE ESTÁ NA MÃO de quem é controlado (ou de `quem`), ou `null`.
   *
   * É o objeto pendurado na mão: a rodada do jardim gira, sacode e vira ele
   * de ponta-cabeça nas animações de ataque, e acha a ponta do bico por ele.
   * O objeto é refeito quando o item muda — pegue de novo a cada quadro.
   */
  objetoNaMao(quem?: string): THREE.Object3D | null;
  /** o giro atual da câmera, em radianos (ela gira de 45 em 45 graus) */
  anguloDaCamera(): number;
  /**
   * UM PULINHO de quem é controlado: o corpo sobe e desce num arco curto,
   * sem sair do lugar no chão. É a carta Pulinho, do jardim, passando por cima
   * de um bicho pequeno.
   */
  pularJogador(altura?: number, duracao?: number): void;
  /**
   * TRAVA O T (a troca de personagem). A rodada do jardim trava: quem está
   * atrás fica atrás, e só a carta Troca de turno destrava.
   */
  bloquearTroca(bloqueado: boolean): void;
  /** Solta `quantos` corações subindo da dupla — o mesmo coração do beijo. */
  soltarCoracoes(quantos?: number): void;
  /**
   * Abre a mesa de xadrez em DOM e resolve quando a PARTIDA acaba (por mate,
   * empate ou desistencia). Trava o movimento enquanto estiver aberta.
   *
   * A cena entrega o motor pronto — e ela quem escolhe a cor da dupla e a
   * semente do sorteio da adversaria — e as falas de quem convidou. O motor de
   * xadrez em si mora em `entities/ChessEngine.ts`, e nem a cena nem a tela
   * conhecem uma regra sequer: as duas so perguntam a ele.
   */
  abrirXadrez(motor: ChessEngine, convite: ConviteDeXadrez): Promise<FimDeXadrez>;
  /**
   * Um motor de xadrez novo para uma partida.
   *
   * A CENA e quem cria, e nao a tela, porque e ela que decide de que cor a
   * dupla joga e com que semente a adversaria sorteia — dois numeros que sao
   * daquela partida daquele personagem, e nao da interface.
   */
  motorDeXadrez(minhaCor?: Cor, semente?: number): ChessEngine;
  /**
   * Poe a dupla num PISO de outra altura — o mezanino da boutique e o unico
   * lugar do jogo em que o chao nao esta em `y = 0`.
   *
   * Nada no motor precisou virar "sistema de andares" para isso: a fisica de
   * caminhada escreve so `x` e `z`, e a colisao e 2D. Quem decide o que existe
   * em cada andar e a CENA — ela troca os colisores, os limites, o que esta
   * visivel e quais interacoes ligam. Isto aqui e so a altura do piso.
   */
  elevarDupla(altura: number): void;

  wait(seconds: number): Promise<void>;
  /** true so no frame em que a tecla desceu; ignorada durante dialogo/diario */
  keyPressed(code: string): boolean;
  /** true enquanto a tecla estiver segurada; ignorada durante dialogo/diario */
  keyDown(code: string): boolean;
  /**
   * O manche CRU (setas, WASD ou o joystick do celular), que chega mesmo com o
   * jogador travado e com uma fala na tela. E o olhar em volta da cabine da
   * roda gigante: la a cutscene tira o andar e devolve o olhar.
   */
  olharLivre(): { x: number; y: number };
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

  /**
   * Os dois levam a boca, de vez em quando, o que estiverem segurando.
   *
   * E o "alguns segundos tomando sorvete" da mesinha da praca de gelo: quem
   * nao esta com nada na mao continua parado normal. A cena liga, espera, e
   * desliga — como o `setSitting`.
   */
  setSaboreando(ativo: boolean): void;

  // --------------------------------------------------- piso escorregadio
  /**
   * O quanto o chao debaixo da dupla escorrega: 0 = seco, 1 = gelo.
   *
   * Vale para os DOIS, e e a cena que decide — quadro a quadro, comparando a
   * posicao com o piso, e interpolando na borda (do mesmo jeito que a agua faz
   * com a submersao). Sem interpolar, entrar no rinque vira um tranco.
   */
  setEscorregadio(valor: number): void;

  // -------------------------------------------------------------- agua
  /** 0 = seco, 1 = submerso ate o pescoco */
  submergePlayer(valor: number): void;
  submergeCompanion(valor: number): void;
  /** troca a roupa dos dois: 'banho' e sem camisa e de calcao */
  setOutfit(traje: 'normal' | 'banho'): void;
}
