import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * =============================================== FUNDIR: menos desenho, mesma imagem
 *
 * As peças bonitas são feitas de muitos pedaços (livro, ripa, puxador,
 * almofada), e o three desenha cada malha separada: a sala do Ari chegou a 436
 * desenhos por quadro, perto do parque inteiro. Esta função junta, dentro de
 * uma peça, os pedaços que usam o MESMO material numa malha só — um desenho
 * em vez de vinte —, sem mudar nada do que se vê: os vértices são os mesmos,
 * só que já transformados para o lugar onde estavam.
 *
 * QUEM SE MEXE JUNTO VIRA UMA MALHA SÓ DENTRO DO GRUPO QUE SE MEXE. A peça é
 * percorrida e cada grupo com NOME (`dobradica`, `tambor`, `floreira`…) é
 * uma fronteira: o que está dentro dele se junta lá dentro, e o grupo continua
 * existindo com o mesmo nome — a porta continua abrindo, o tambor continua
 * girando. O que não tem nome é posição fixa, e se junta com o resto da peça.
 *
 * FICA DE FORA, intacto:
 *  - malha com NOME (`tela`, `cupula`, `edredom`): a cena procura e troca;
 *  - malha com qualquer coisa em `userData` (`livro`, `semSombra`…): alguém
 *    olha para ela;
 *  - outra peça dentro da peça (`userData.peca`): é fundida por conta
 *    própria, como fronteira;
 *  - `InstancedMesh` (já é um desenho só), sprite, linha;
 *  - material transparente ou decalque (sem `depthWrite`): neles a ORDEM de
 *    pintura entre os pedaços decide quem fica por cima (as fotos tortas do
 *    quadro de memórias), e numa malha só essa ordem mudaria;
 *  - pedaço espelhado (escala negativa vira a face do avesso).
 *
 * Os pedaços que se juntam precisam ter também o mesmo `renderOrder` e os
 * mesmos atributos de geometria; quem não fecha com ninguém fica como estava.
 *
 * `?semFundir` na URL desliga tudo — é como o teste compara a foto de antes
 * com a de depois no mesmo enquadramento.
 */
const DESLIGADO = typeof location !== 'undefined' && new URLSearchParams(location.search).has('semFundir');

export function fundir<T extends THREE.Object3D>(peca: T): T {
  if (DESLIGADO) return peca;
  peca.updateMatrixWorld(true);
  fundirDentro(peca);
  return peca;
}

/** junta os pedaços de `raiz` que não estão atrás de outra fronteira */
function fundirDentro(raiz: THREE.Object3D): void {
  const inversa = new THREE.Matrix4().copy(raiz.matrixWorld).invert();
  const grupos = new Map<string, THREE.Mesh[]>();
  const fronteiras: THREE.Object3D[] = [];

  const visitar = (o: THREE.Object3D): void => {
    for (const filho of [...o.children]) {
      if (ehFronteira(filho)) {
        fronteiras.push(filho);
        continue;
      }
      const m = filho as THREE.Mesh;
      if (podeFundir(m)) {
        const mat = m.material as THREE.Material;
        const chave = `${mat.uuid}|${m.renderOrder}|${assinatura(m.geometry)}`;
        const lista = grupos.get(chave);
        if (lista) lista.push(m);
        else grupos.set(chave, [m]);
      }
      visitar(filho);
    }
  };
  visitar(raiz);

  for (const lista of grupos.values()) {
    if (lista.length < 2) continue;
    const relativa = new THREE.Matrix4();
    const geos = lista.map((m) => {
      relativa.multiplyMatrices(inversa, m.matrixWorld);
      const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      g.applyMatrix4(relativa);
      return g;
    });
    const junta = mergeGeometries(geos, false);
    for (const g of geos) g.dispose();
    if (!junta) continue;
    const malha = new THREE.Mesh(junta, lista[0].material);
    malha.renderOrder = lista[0].renderOrder;
    malha.castShadow = lista.some((m) => m.castShadow);
    malha.receiveShadow = lista.some((m) => m.receiveShadow);
    raiz.add(malha);
    for (const m of lista) {
      m.removeFromParent();
      m.geometry.dispose();
    }
  }
  // o pai que ficou vazio (um pivô cujos pedaços foram todos juntados) sai
  podarVazios(raiz);

  for (const f of fronteiras) {
    f.updateMatrixWorld(true);
    fundirDentro(f);
  }
}

function ehFronteira(o: THREE.Object3D): boolean {
  if ((o as THREE.Mesh).isMesh) return false;
  return o.name !== '' || o.userData.peca !== undefined || o.userData.naoFundir === true;
}

function podeFundir(m: THREE.Mesh): boolean {
  if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh || (m as unknown as THREE.SkinnedMesh).isSkinnedMesh) return false;
  if (m.name !== '' || Object.keys(m.userData).length > 0) return false;
  if (Array.isArray(m.material)) return false;
  const mat = m.material as THREE.Material;
  if (mat.transparent || !mat.depthWrite) return false;
  if (m.matrixWorld.determinant() < 0) return false;
  return m.geometry.getAttribute('position') !== undefined && m.geometry.getAttribute('normal') !== undefined;
}

/** só se juntam geometrias com os mesmos atributos (nome e tamanho) */
function assinatura(g: THREE.BufferGeometry): string {
  return Object.keys(g.attributes)
    .sort()
    .map((n) => `${n}:${g.getAttribute(n).itemSize}`)
    .join(',') + (Object.keys(g.morphAttributes).length ? '|morph' : '');
}

function podarVazios(o: THREE.Object3D): void {
  for (const filho of [...o.children]) {
    podarVazios(filho);
    const vazio = filho.children.length === 0 && !(filho as THREE.Mesh).isMesh &&
      !(filho as THREE.Sprite).isSprite && filho.type === 'Group' && filho.name === '' &&
      Object.keys(filho.userData).length === 0;
    if (vazio) filho.removeFromParent();
  }
}
