import * as THREE from 'three';
import { toon } from '../core/materials';

/**
 * ============================================ ACABAMENTO: textura em móvel
 *
 * O kit de interiores (`furniture.ts`) nasceu liso: cada peça é um punhado de
 * caixas com `toon(cor)`. Dar textura a ele peça por peça seria reescrever o
 * kit inteiro — e mudaria a escola e o Mania, que usam as mesmas peças e não
 * pediram nada. Então o acabamento é DEPOIS: a cena monta a peça de sempre e
 * passa por aqui as cores que devem ganhar desenho.
 *
 * ```ts
 * acabar(w.add(w.place(desk(), …)), [[P.wood, veioDeMadeira()], [P.woodDark, veioDeMadeira()]]);
 * ```
 *
 * Quem é trocado é a malha cujo material É `toon(cor)` (o mesmo objeto do
 * cache, comparado por identidade) — a peça não precisa saber de nada, e uma
 * cor que não está na lista fica exatamente como era.
 */

/**
 * Reescreve o UV de uma geometria EM METROS, por projeção de caixa.
 *
 * O `BoxGeometry` dá UV de 0 a 1 em cada face, então uma textura de 30 cm
 * esticaria até cobrir a face inteira, seja ela uma tampa de 1,6 m ou um pé
 * de 6 cm. Aqui cada vértice ganha o UV da própria posição, lida no par de
 * eixos da face (a face que olha para cima usa `x` e `z`, a da frente usa `x`
 * e `y`…), e o desenho sai do mesmo tamanho em toda parte — o mesmo truque que
 * o `ShapeGeometry` faz de graça no chão.
 *
 * O U VAI NO LADO MAIS COMPRIDO da peça, e é isso que faz o veio correr na
 * tábua e não atravessá-la: a porta do armário tem veio em pé, a tampa da mesa
 * tem veio deitado.
 */
export function uvEmMetros(geo: THREE.BufferGeometry): void {
  const pos = geo.getAttribute('position');
  const nor = geo.getAttribute('normal');
  if (!pos || !nor) return;
  const ext = extensao(geo);
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    projetar(uv, i, [pos.getX(i), pos.getY(i), pos.getZ(i)], [nor.getX(i), nor.getY(i), nor.getZ(i)], ext);
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

/**
 * O mesmo, decidido POR TRIÂNGULO, para peça de canto arredondado
 * (`RoundedBoxGeometry`: colchão, travesseiro).
 *
 * Na quina arredondada a normal gira de vértice para vértice, e decidir o par
 * de eixos vértice a vértice põe dois eixos diferentes no MESMO triângulo — o
 * desenho inteiro se espreme dentro dele. No travesseiro, que é quase todo
 * quina, isso virou manchas cinzentas por toda a fronha. Aqui o triângulo
 * escolhe uma vez, pela normal dele, e os três vértices seguem a escolha (por
 * isso a geometria sai SEM índice: cada triângulo com os seus vértices).
 */
export function uvEmMetrosPorTriangulo(original: THREE.BufferGeometry): THREE.BufferGeometry {
  const geo = original.index ? original.toNonIndexed() : original;
  const pos = geo.getAttribute('position');
  const ext = extensao(geo);
  const uv = new Float32Array(pos.count * 2);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    const n = b.clone().sub(a).cross(c.clone().sub(a));
    for (let k = 0; k < 3; k++) {
      projetar(uv, i + k, [pos.getX(i + k), pos.getY(i + k), pos.getZ(i + k)], [n.x, n.y, n.z], ext);
    }
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

function extensao(geo: THREE.BufferGeometry): number[] {
  geo.computeBoundingBox();
  const tam = geo.boundingBox!.getSize(new THREE.Vector3());
  return [tam.x, tam.y, tam.z];
}

/** grava no `uv` o par de eixos da face de normal `nor` (ver `uvEmMetros`) */
function projetar(uv: Float32Array, i: number, p: number[], nor: number[], ext: number[]): void {
  const n = nor.map(Math.abs);
  const eixo = n[0] >= n[1] && n[0] >= n[2] ? 0 : n[1] >= n[2] ? 1 : 2;
  // os dois eixos que ficam no plano da face; o U no lado mais comprido
  let [ua, vb] = eixo === 0 ? [2, 1] : eixo === 1 ? [0, 2] : [0, 1];
  if (ext[vb] > ext[ua]) [ua, vb] = [vb, ua];
  uv[i * 2] = p[ua];
  uv[i * 2 + 1] = p[vb];
}

/**
 * Dá textura às malhas de `obj` pintadas com as cores da lista.
 *
 * Cada par é `[cor, textura]`. A textura entra no `toon()` (então continua
 * cacheada e no estilo do jogo) e o UV da malha passa para metros.
 */
export function acabar<T extends THREE.Object3D>(obj: T, trocas: ReadonlyArray<readonly [number, THREE.Texture]>): T {
  const porMaterial = new Map<THREE.Material, THREE.Material>();
  for (const [cor, textura] of trocas) porMaterial.set(toon(cor), toon(cor, { mapa: textura }));
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    const novo = porMaterial.get(m.material);
    if (!novo) return;
    // caixa reta decide o UV por vértice; peça curva (arredondada, cilindro,
    // torneada) por triângulo, senão o desenho se espreme na quina
    if (m.geometry.type === 'BoxGeometry') uvEmMetros(m.geometry);
    else m.geometry = uvEmMetrosPorTriangulo(m.geometry);
    m.material = novo;
  });
  return obj;
}
