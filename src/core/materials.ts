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
