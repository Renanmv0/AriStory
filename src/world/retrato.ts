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
  const estudio = montarEstudio();
  const peca = monta();
  peca.rotation.y = giro;
  estudio.cena.add(peca);
  peca.updateMatrixWorld(true);
  const caixa = new THREE.Box3().setFromObject(peca);
  const centro = caixa.getCenter(new THREE.Vector3());
  const tamanho = caixa.getSize(new THREE.Vector3());
  const raio = Math.max(tamanho.x, tamanho.y, tamanho.z) * 0.62;
  const longe = raio / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
  camera.position.set(centro.x, centro.y + longe * 0.38, centro.z + longe * 0.92);
  camera.lookAt(centro);
  camera.updateProjectionMatrix();
  estudio.renderer.render(estudio.cena, camera);
  const url = estudio.renderer.domElement.toDataURL('image/png');
  estudio.cena.remove(peca);
  peca.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
  });
  cache.set(chave, url);
  return url;
}
