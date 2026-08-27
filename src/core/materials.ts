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
   * Decalque de chao. Duas superficies planas na mesma altura brigam pelo mesmo
   * pixel e piscam (z-fighting). Um numero unico por decalque empurra o
   * poligono para a frente e resolve de vez, sem depender de milimetros de
   * diferenca de altura.
   */
  offset?: number;
}

const cache = new Map<string, THREE.MeshToonMaterial>();

export function toon(color: number, opts: ToonOptions = {}): THREE.MeshToonMaterial {
  const key = `${color}|${opts.glow ?? 0}|${opts.opacity ?? 1}|${opts.doubleSide ? 1 : 0}|${opts.offset ?? 0}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap: gradientMap(),
    transparent: (opts.opacity ?? 1) < 1,
    opacity: opts.opacity ?? 1,
    side: opts.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
  });
  if (opts.glow) {
    mat.emissive = new THREE.Color(color);
    mat.emissiveIntensity = opts.glow;
  }
  if (opts.offset) {
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -1;
    mat.polygonOffsetUnits = -opts.offset;
  }
  cache.set(key, mat);
  return mat;
}

/** Material chapado, sem luz: ceu, silhuetas de fundo, decalques. */
const flatCache = new Map<string, THREE.MeshBasicMaterial>();
export function flat(color: number, opacity = 1): THREE.MeshBasicMaterial {
  const key = `${color}|${opacity}`;
  const hit = flatCache.get(key);
  if (hit) return hit;
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    side: THREE.DoubleSide,
  });
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
