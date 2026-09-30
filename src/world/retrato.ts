import * as THREE from 'three';

/**
 * O RETRATO DE UMA PEÇA — o modelo 3D fotografado uma vez num canvas fora da
 * tela e guardado como imagem (data URL), para um `<img>` de painel. Serve às
 * pragas do livro da estufa e aos enfeites da lojinha da Josefina.
 *
 * Nada de arquivo: é a regra do jogo, e é também o que garante que o retrato
 * nunca desmente a peça que aparece no mundo.
 *
 * UM RENDERIZADOR SÓ, preguiçoso: ele nasce na primeira foto pedida e serve a
 * todas (cada `WebGLRenderer` é um contexto WebGL, e o navegador tem poucos).
 * A luz é a mesma receita do boneco do guarda-roupa (`Previa.ts`): céu, sol e
 * contraluz próprios, para a cor da peça sair a dela e não a da cena.
 *
 * O enquadramento sai da CAIXA do modelo: peça grande e peça pequena cabem do
 * mesmo tamanho no quadro.
 */

const LADO = 256;
let renderer: THREE.WebGLRenderer | null = null;
let cena: THREE.Scene | null = null;
const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 60);
const cache = new Map<string, string>();

function montarEstudio(): { renderer: THREE.WebGLRenderer; cena: THREE.Scene } {
  if (renderer && cena) return { renderer, cena };
  const canvas = document.createElement('canvas');
  canvas.width = LADO;
  canvas.height = LADO;
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(LADO, LADO, false);
  cena = new THREE.Scene();
  cena.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.6));
  const sol = new THREE.DirectionalLight(0xfff4e0, 1.5);
  sol.position.set(3, 5, 4);
  cena.add(sol);
  const contra = new THREE.DirectionalLight(0xbfd8ff, 0.5);
  contra.position.set(-3, 2, -3);
  cena.add(contra);
  return { renderer, cena };
}

/**
 * A foto de uma peça, pronta para um `<img src>`. `chave` identifica a foto no
 * cache (a mesma chave nunca monta a peça duas vezes); `giro` é o ângulo de
 * três quartos em que ela é vista — de frente ela fica chapada.
 */
export function retratoDe(chave: string, monta: () => THREE.Object3D, giro = -0.6): string {
  const pronto = cache.get(chave);
  if (pronto) return pronto;
  const peca = monta();
  peca.rotation.y = giro;
  peca.updateMatrixWorld(true);
  const caixa = new THREE.Box3().setFromObject(peca);
  const url = fotografar(peca, caixa, 0.62, 0.38, 0.92);
  cache.set(chave, url);
  return url;
}

/**
 * O RETRATO DE ROSTO: a mesma foto, enquadrada SÓ NA CABEÇA, quase de frente
 * — o que os quadrinhos da apostila do Gatito precisam, num círculo pequeno.
 * A cabeça é o objeto de nome `cabeca` dentro do modelo (o boneco e os bichos
 * que falam na apostila dão esse nome a ela; a Luna tem o seu); sem ele, o
 * terço de cima da caixa.
 */
export function retratoDoRosto(
  chave: string, monta: () => THREE.Object3D, o: { cabeca?: string; giro?: number } = {},
): string {
  const pronto = cache.get(chave);
  if (pronto) return pronto;
  const peca = monta();
  peca.rotation.y = o.giro ?? -0.35;
  peca.updateMatrixWorld(true);
  const cabeca = peca.getObjectByName(o.cabeca ?? 'cabeca');
  const caixa = caixaVisivel(cabeca ?? peca);
  if (!cabeca) caixa.min.y = caixa.max.y - (caixa.max.y - caixa.min.y) / 3;
  // orelha comprida (a Luna) não pode encolher o rosto: o quadro para um
  // pouco acima da largura da cabeça, e a ponta da orelha sai do círculo
  const largura = Math.max(caixa.max.x - caixa.min.x, caixa.max.z - caixa.min.z);
  caixa.max.y = Math.min(caixa.max.y, caixa.min.y + largura * 1.15);
  const url = fotografar(peca, caixa, 0.7, 0.1, 0.995);
  cache.set(chave, url);
  return url;
}

/**
 * A caixa só do que APARECE. O `Box3.setFromObject` conta também o que está
 * escondido — e o boneco carrega o chapéu de campeão invisível em cima da
 * cabeça, que empurrava o rosto para o pé do retrato.
 */
function caixaVisivel(raiz: THREE.Object3D): THREE.Box3 {
  const caixa = new THREE.Box3();
  raiz.updateWorldMatrix(true, true);
  raiz.traverseVisible((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.geometry) return;
    if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
    caixa.union(m.geometry.boundingBox!.clone().applyMatrix4(m.matrixWorld));
  });
  return caixa;
}

/** Enquadra a `caixa` com `folga`, a câmera um tanto `acima` e à `frente` dela, e tira a foto. */
function fotografar(peca: THREE.Object3D, caixa: THREE.Box3, folga: number, acima: number, frente: number): string {
  const estudio = montarEstudio();
  estudio.cena.add(peca);
  const centro = caixa.getCenter(new THREE.Vector3());
  const tamanho = caixa.getSize(new THREE.Vector3());
  const raio = Math.max(tamanho.x, tamanho.y, tamanho.z) * folga;
  const longe = raio / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
  camera.position.set(centro.x, centro.y + longe * acima, centro.z + longe * frente);
  camera.lookAt(centro);
  camera.updateProjectionMatrix();
  estudio.renderer.render(estudio.cena, camera);
  const url = estudio.renderer.domElement.toDataURL('image/png');
  estudio.cena.remove(peca);
  peca.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
  });
  return url;
}
