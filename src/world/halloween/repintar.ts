import * as THREE from 'three';

/*
 * REPINTAR UMA PEÇA PRONTA (`docs/HALLOWEEN.md`, §4.1): a sorveteria do Mano,
 * os guarda-sóis, a loja de patins e a roda ganham as cores do Halloween —
 * roxo e laranja — enquanto o evento dura.
 *
 * É CAMADA: a fábrica da peça não muda uma linha. Esta função anda pela peça
 * JÁ MONTADA e troca, por uma cópia repintada:
 *
 *  - o MATERIAL (a cor e a cor acesa do `glow`), clonado com o
 *    `onBeforeCompile` junto (o gelo, o vento e o cristal continuam sendo o
 *    gelo, o vento e o cristal);
 *  - a TEXTURA de canvas (as listras do toldo, a lona do guarda-sol): o
 *    desenho é copiado pixel por pixel para um canvas novo;
 *  - a COR NOS VÉRTICES (a peça juntada por cor, o cristal em degradê) e a COR
 *    POR CÓPIA dos lotes, numa cópia da geometria ou do atributo.
 *
 * O original nunca é tocado: o material do cache do `toon()`, a textura da
 * fábrica e a geometria continuam os mesmos para quem mais os usa.
 *
 * Quem decide a cor nova é uma `Repintura` (sRGB de 0 a 1 entra, sai a nova ou
 * `null` para deixar como está). Há duas prontas: a troca de cores da paleta
 * (mantendo o sombreado do desenho) e o giro de matiz (o gelo azul vira lilás).
 */

export type Repintura = (r: number, g: number, b: number) => readonly [number, number, number] | null;

const rgb = (hex: number): [number, number, number] => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
const lum = (r: number, g: number, b: number): number => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * Troca cada cor `de` (da paleta) pela `para`. O que está PERTO da cor (a
 * listra com a trama por cima, o degrau de sombra pintado) leva a cor nova na
 * mesma claridade relativa — o desenho continua, só muda de cor.
 */
export function trocaDeCores(trocas: ReadonlyArray<readonly [number, number]>, tolerancia = 0.2): Repintura {
  const lista = trocas.map(([de, para]) => ({ de: rgb(de), para: rgb(para) }));
  return (r, g, b) => {
    let melhor: (typeof lista)[number] | null = null;
    let dist = tolerancia;
    for (const t of lista) {
      const d = Math.hypot(r - t.de[0], g - t.de[1], b - t.de[2]);
      if (d < dist) {
        dist = d;
        melhor = t;
      }
    }
    if (!melhor) return null;
    const k = THREE.MathUtils.clamp(lum(r, g, b) / Math.max(0.02, lum(...melhor.de)), 0.4, 1.4);
    return [Math.min(1, melhor.para[0] * k), Math.min(1, melhor.para[1] * k), Math.min(1, melhor.para[2] * k)];
  };
}

/**
 * Gira o matiz do que cai na faixa `[de0, de1]` (em graus) para perto de
 * `para`, mantendo a claridade e a saturação: o azul-gelo vira lilás. O que é
 * quase cinza (saturação abaixo de `satMin`) fica como está.
 */
export function giroDeMatiz(de0: number, de1: number, para: number, satMin = 0.06, mais = 1.15): Repintura {
  const c = new THREE.Color();
  const hsl = { h: 0, s: 0, l: 0 };
  return (r, g, b) => {
    c.setRGB(r, g, b);
    c.getHSL(hsl);
    const h = hsl.h * 360;
    if (hsl.s < satMin || h < de0 || h > de1) return null;
    const meio = (de0 + de1) / 2;
    c.setHSL((((para + (h - meio) * 0.5) % 360) + 360) % 360 / 360, Math.min(1, hsl.s * mais), hsl.l);
    return [c.r, c.g, c.b];
  };
}

/** a primeira repintura que mexer na cor ganha */
export function juntas(...lista: Repintura[]): Repintura {
  return (r, g, b) => {
    for (const f of lista) {
      const x = f(r, g, b);
      if (x) return x;
    }
    return null;
  };
}

// ================================================================== o motor

/** o que já foi repintado (a mesma peça em dez mesinhas usa um material só) */
const materiais = new WeakMap<Repintura, Map<THREE.Material, THREE.Material>>();
const texturas = new WeakMap<Repintura, Map<THREE.Texture, THREE.Texture>>();
const geometrias = new WeakMap<Repintura, Map<THREE.BufferGeometry, THREE.BufferGeometry>>();

const tmp = new THREE.Color();

/** a cor (no espaço linear do three) repintada, ou `null` */
function corNova(c: THREE.Color, f: Repintura): THREE.Color | null {
  tmp.copy(c).convertLinearToSRGB();
  const x = f(tmp.r, tmp.g, tmp.b);
  if (!x) return null;
  return new THREE.Color().setRGB(x[0], x[1], x[2], THREE.SRGBColorSpace);
}

function texturaNova(t: THREE.Texture, f: Repintura): THREE.Texture | null {
  let cache = texturas.get(f);
  if (!cache) texturas.set(f, (cache = new Map()));
  if (cache.has(t)) return cache.get(t) ?? null;
  const img = t.image as CanvasImageSource & { width: number; height: number };
  if (!(typeof HTMLCanvasElement !== 'undefined' && img instanceof HTMLCanvasElement) || !img.width) {
    return null;
  }
  const cv = document.createElement('canvas');
  cv.width = img.width;
  cv.height = img.height;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  const dados = ctx.getImageData(0, 0, cv.width, cv.height);
  const p = dados.data;
  let mexeu = false;
  // uma tabela por cor: o canvas tem poucas cores (listras, trama, luz)
  const lembra = new Map<number, readonly [number, number, number] | null>();
  for (let i = 0; i < p.length; i += 4) {
    if (p[i + 3] === 0) continue;
    const chave = (p[i] << 16) | (p[i + 1] << 8) | p[i + 2];
    let x = lembra.get(chave);
    if (x === undefined) {
      x = f(p[i] / 255, p[i + 1] / 255, p[i + 2] / 255);
      lembra.set(chave, x);
    }
    if (!x) continue;
    p[i] = Math.round(x[0] * 255);
    p[i + 1] = Math.round(x[1] * 255);
    p[i + 2] = Math.round(x[2] * 255);
    mexeu = true;
  }
  if (!mexeu) {
    cache.set(t, t);
    return null;
  }
  ctx.putImageData(dados, 0, 0);
  const nova = t.clone();
  nova.image = cv;
  nova.needsUpdate = true;
  cache.set(t, nova);
  return nova;
}

function materialNovo(m: THREE.Material, f: Repintura): THREE.Material {
  let cache = materiais.get(f);
  if (!cache) materiais.set(f, (cache = new Map()));
  const pronto = cache.get(m);
  if (pronto) return pronto;
  const comCor = m as THREE.Material & { color?: THREE.Color; emissive?: THREE.Color; emissiveIntensity?: number; map?: THREE.Texture | null };
  const cor = comCor.color ? corNova(comCor.color, f) : null;
  const acesa = comCor.emissive && (comCor.emissiveIntensity ?? 0) > 0 ? corNova(comCor.emissive, f) : null;
  const mapa = comCor.map ? texturaNova(comCor.map, f) : null;
  if (!cor && !acesa && !mapa) {
    cache.set(m, m);
    return m;
  }
  const novo = m.clone() as typeof comCor;
  // o `clone` não leva o shader estendido: o gelo, o vento e o cristal vão junto
  novo.onBeforeCompile = m.onBeforeCompile;
  novo.customProgramCacheKey = m.customProgramCacheKey;
  if (cor && novo.color) novo.color.copy(cor);
  if (acesa && novo.emissive) novo.emissive.copy(acesa);
  if (mapa) novo.map = mapa;
  cache.set(m, novo);
  return novo;
}

/** repinta um atributo de cor (linear, de 0 a 1) numa cópia; `null` se nada mudou */
function corDeAtributo(a: THREE.BufferAttribute, f: Repintura): THREE.BufferAttribute | null {
  const novo = a.clone();
  let mexeu = false;
  const c = new THREE.Color();
  for (let i = 0; i < a.count; i++) {
    c.setRGB(a.getX(i), a.getY(i), a.getZ(i));
    const n = corNova(c, f);
    if (!n) continue;
    novo.setXYZ(i, n.r, n.g, n.b);
    mexeu = true;
  }
  return mexeu ? novo : null;
}

function geometriaNova(g: THREE.BufferGeometry, f: Repintura): THREE.BufferGeometry {
  let cache = geometrias.get(f);
  if (!cache) geometrias.set(f, (cache = new Map()));
  const pronta = cache.get(g);
  if (pronta) return pronta;
  const cor = g.getAttribute('color') as THREE.BufferAttribute | undefined;
  const nova = cor ? corDeAtributo(cor, f) : null;
  if (!nova) {
    cache.set(g, g);
    return g;
  }
  const copia = g.clone();
  copia.setAttribute('color', nova);
  cache.set(g, copia);
  return copia;
}

/**
 * Repinta a peça (e tudo dentro dela). Devolve quantas malhas mudaram — o
 * teste confere que a repintura pegou de verdade.
 */
export function repintar(raiz: THREE.Object3D, f: Repintura): number {
  let n = 0;
  raiz.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh && !(o as THREE.Sprite).isSprite) return;
    let mudou = false;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    const novos = mats.map((x) => materialNovo(x, f));
    if (novos.some((x, i) => x !== mats[i])) {
      m.material = Array.isArray(m.material) ? novos : novos[0];
      mudou = true;
    }
    if (m.isMesh && mats.some((x) => (x as THREE.MeshToonMaterial).vertexColors)) {
      const g = geometriaNova(m.geometry, f);
      if (g !== m.geometry) {
        m.geometry = g;
        mudou = true;
      }
    }
    const lote = o as THREE.InstancedMesh;
    if (lote.isInstancedMesh && lote.instanceColor) {
      const nova = corDeAtributo(lote.instanceColor, f);
      if (nova) {
        lote.instanceColor = nova as THREE.InstancedBufferAttribute;
        lote.instanceColor.needsUpdate = true;
        mudou = true;
      }
    }
    if (mudou) n++;
  });
  return n;
}
