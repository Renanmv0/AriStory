import * as THREE from 'three';

/**
 * Materiais toon compartilhados. Tudo no jogo usa MeshToonMaterial com o mesmo
 * gradiente de 4 degraus, que e o que da a cara de "desenho fofo".
 * Os materiais sao cacheados por cor+opcoes: nunca crie material solto numa cena.
 */

let gradient: THREE.DataTexture | null = null;

function gradientMap(): THREE.DataTexture {
  if (!gradient) {
    const steps = new Uint8Array([96, 166, 214, 255]);
    gradient = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat);
    gradient.minFilter = THREE.NearestFilter;
    gradient.magFilter = THREE.NearestFilter;
    gradient.generateMipmaps = false;
    gradient.needsUpdate = true;
  }
  return gradient;
}

export interface ToonOptions {
  /** 0..1, deixa a superficie luminosa (usado em janelas acesas, luzes, coracoes) */
  glow?: number;
  /** 0..1, 1 = opaco */
  opacity?: number;
  /** desenha os dois lados (bandeiras, folhas planas) */
  doubleSide?: boolean;
  /**
   * Decalque: superficie colada em outra (linha pintada no chao, foto na
   * parede, calcada por cima do asfalto).
   *
   * Duas superficies quase na mesma altura brigam pelo mesmo pixel e piscam
   * (z-fighting). Milimetros de diferenca de altura NAO resolvem: o celular
   * costuma dar um buffer de profundidade bem mais pobre que o desktop, e la
   * um vao de 2 mm some dentro de um degrau do buffer. Foi assim que a linha
   * do meio da quadra e as manchas de grama da praca comecaram a piscar.
   *
   * O decalque resolve por construcao, com duas medidas juntas:
   *  - `polygonOffset` empurra o poligono para a frente da base em degraus do
   *    proprio buffer, e nao em metros de mundo — funciona em qualquer
   *    precisao;
   *  - `depthWrite: false` faz o decalque nao gravar profundidade nenhuma.
   *    Como nenhum decalque grava, nenhum decalque disputa com outro: quem for
   *    desenhado depois fica por cima, e ponto. Eles continuam TESTANDO
   *    profundidade, entao o personagem, o quiosque e a arvore seguem tapando
   *    o chao normalmente.
   *
   * Quem usa isto precisa mandar a ordem de pintura no `mesh.renderOrder`
   * (maior = mais por cima). O `WorldBuilder` ja faz isso sozinho em
   * `patch()`/`disc()`.
   */
  decal?: boolean;
  /**
   * Mapa de cor. Hoje so o chao usa: as texturas de piso e de grama, pintadas
   * em canvas em `world/texturasDeChao.ts`.
   *
   * A cor do material MULTIPLICA o mapa, entao o desenho tem que ser quase
   * branco — textura escura aqui vira uma segunda demao de tinta por cima da
   * cor da paleta, e o chao perde o tom.
   */
  mapa?: THREE.Texture;
}

/**
 * Empurrao do decalque, em degraus do buffer de profundidade. Quatro degraus
 * sao folga de sobra para vencer a base sem descolar visivelmente dela.
 */
const DECAL_OFFSET = 4;

const cache = new Map<string, THREE.MeshToonMaterial>();

export function toon(color: number, opts: ToonOptions = {}): THREE.MeshToonMaterial {
  const key = `${color}|${opts.glow ?? 0}|${opts.opacity ?? 1}|${opts.doubleSide ? 1 : 0}|${opts.decal ? 1 : 0}|${opts.mapa?.uuid ?? ''}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap: gradientMap(),
    transparent: (opts.opacity ?? 1) < 1,
    opacity: opts.opacity ?? 1,
    side: opts.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
    map: opts.mapa ?? null,
  });
  if (opts.glow) {
    mat.emissive = new THREE.Color(color);
    mat.emissiveIntensity = opts.glow;
  }
  if (opts.decal) aplicarDecal(mat);
  cache.set(key, mat);
  return mat;
}

/** Liga o modo decalque num material ja pronto. Ver `ToonOptions.decal`. */
function aplicarDecal(mat: THREE.Material): void {
  mat.polygonOffset = true;
  mat.polygonOffsetFactor = -1;
  mat.polygonOffsetUnits = -DECAL_OFFSET;
  mat.depthWrite = false;
}

/** Material chapado, sem luz: ceu, silhuetas de fundo, decalques. */
const flatCache = new Map<string, THREE.MeshBasicMaterial>();
/**
 * ============================== PISO POLIDO: o unico material com BRILHO
 *
 * O `MeshToonMaterial` nao tem reflexo especular — ele e feito de degraus
 * chapados, e e isso que da a cara de desenho ao jogo inteiro. Piso polido de
 * boutique precisa da mancha de luz que anda com a camera, e por isso aqui
 * entra o `MeshPhongMaterial`: mesma cor da paleta, mesmo mapa de textura, mais
 * um destaque especular fraco e largo.
 *
 * ELE E EXCECAO, E NAO ALTERNATIVA. Use so em chao de interior encerado (a
 * boutique da Estella) — parede, movel e peca de cenario continuam no `toon()`,
 * senao o jogo perde a unidade de estilo num piso de cada vez.
 *
 * `shininess` ALTO com `specular` BAIXO e a combinacao certa: alto e baixo
 * juntos dao uma mancha PEQUENA e discreta, que le como cera. Specular forte
 * num piso claro estoura em branco e vira gelo.
 */
export interface PolidoOptions {
  /** 0..1, quanto o piso reflete a luz (0,18 e cera; 0,5 ja e gelo) */
  brilho?: number;
  mapa?: THREE.Texture;
}

const polidoCache = new Map<string, THREE.MeshPhongMaterial>();

export function polido(color: number, opts: PolidoOptions = {}): THREE.MeshPhongMaterial {
  const brilho = opts.brilho ?? 0.18;
  const key = `${color}|${brilho}|${opts.mapa?.uuid ?? ''}`;
  const hit = polidoCache.get(key);
  if (hit) return hit;
  const tom = Math.round(brilho * 255);
  const mat = new THREE.MeshPhongMaterial({
    color,
    map: opts.mapa ?? null,
    specular: new THREE.Color(`rgb(${tom},${tom},${tom})`),
    shininess: 90,
    // sem isto o piso fica mais escuro que o resto da sala: o Phong nao tem o
    // degrade do toon, que ja clareia a base
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.16,
  });
  polidoCache.set(key, mat);
  return mat;
}

export function flat(color: number, opacity = 1, decal = false): THREE.MeshBasicMaterial {
  const key = `${color}|${opacity}|${decal ? 1 : 0}`;
  const hit = flatCache.get(key);
  if (hit) return hit;
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    side: THREE.DoubleSide,
  });
  if (decal) aplicarDecal(mat);
  flatCache.set(key, mat);
  return mat;
}

/** Linha fina para cabos, grades e aros. */
const lineCache = new Map<number, THREE.LineBasicMaterial>();
export function line(color: number): THREE.LineBasicMaterial {
  const hit = lineCache.get(color);
  if (hit) return hit;
  const mat = new THREE.LineBasicMaterial({ color });
  lineCache.set(color, mat);
  return mat;
}

/**
 * A VARIANTE TRANSLÚCIDA de um material que já existe — é o que a oclusão usa
 * (`core/Oclusao.ts`) para deixar a parede ou a árvore que tapa um bicho meio
 * transparente. Uma por material, guardada: os materiais do jogo são
 * compartilhados, então mexer na opacidade do original apagaria TODAS as
 * peças que usam a mesma cor. `depthWrite` desligado para quem está atrás
 * aparecer inteiro através dela.
 */
const translucidos = new WeakMap<THREE.Material, Map<number, THREE.Material>>();
/**
 * Uma por material E por opacidade: a oclusão usa 0,28, e o enfeite "na mão"
 * do modo de decorar da estufa usa mais (ele tem que ler como a peça, só que
 * ainda não posta).
 */
export function translucido(mat: THREE.Material, opacidade = 0.28): THREE.Material {
  let porOpacidade = translucidos.get(mat);
  if (!porOpacidade) {
    porOpacidade = new Map();
    translucidos.set(mat, porOpacidade);
  }
  const hit = porOpacidade.get(opacidade);
  if (hit) return hit;
  const t = mat.clone();
  t.transparent = true;
  t.opacity = Math.min(mat.opacity, opacidade);
  t.depthWrite = false;
  porOpacidade.set(opacidade, t);
  return t;
}

/**
 * A LUZ DE ENFEITE (a lanterninha e o varal de luzinhas da estufa): luz que se
 * VÊ, sem luz de verdade no motor. Duas peças:
 *
 * - `luzNoChao(cor)`: o material da POÇA DE LUZ — um disco no chão com um
 *   degradê redondo (desenhado em canvas, a única textura que o jogo aceita)
 *   somado à cor de baixo (`AdditiveBlending`): o piso em volta da lâmpada
 *   clareia e esquenta;
 * - `brilhoDeLuz(cor)`: o HALO macio em volta da lâmpada, num sprite (sempre
 *   de frente para a câmera).
 *
 * POR QUE NÃO `PointLight`: cada luz nova muda a CONTA de luzes da cena, e o
 * three recompila o shader de todos os materiais quando isso acontece — pôr
 * uma lanterninha travaria o jogo um instante, e dez delas pesariam no
 * celular. A poça é um disco a mais; o efeito na tela é o mesmo.
 */
let texturaDeLuz: THREE.CanvasTexture | null = null;
function degradeDeLuz(): THREE.CanvasTexture {
  if (texturaDeLuz) return texturaDeLuz;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }
  texturaDeLuz = new THREE.CanvasTexture(canvas);
  return texturaDeLuz;
}

const luzesNoChao = new Map<string, THREE.MeshBasicMaterial>();
export function luzNoChao(color: number, forca = 0.55): THREE.MeshBasicMaterial {
  const key = `${color}|${forca}`;
  const hit = luzesNoChao.get(key);
  if (hit) return hit;
  const mat = new THREE.MeshBasicMaterial({
    color, map: degradeDeLuz(), transparent: true, opacity: forca,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  luzesNoChao.set(key, mat);
  return mat;
}

const brilhos = new Map<string, THREE.SpriteMaterial>();
export function brilhoDeLuz(color: number, forca = 0.8): THREE.SpriteMaterial {
  const key = `${color}|${forca}`;
  const hit = brilhos.get(key);
  if (hit) return hit;
  const mat = new THREE.SpriteMaterial({
    color, map: degradeDeLuz(), transparent: true, opacity: forca,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  brilhos.set(key, mat);
  return mat;
}
