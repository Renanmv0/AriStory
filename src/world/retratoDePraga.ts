import * as THREE from 'three';
import { PRAGAS } from './bichosDoJardim';

/**
 * O RETRATO DE UMA PRAGA para a aba de pragas do livro — o MESMO modelo 3D
 * da rodada, fotografado uma vez num canvas fora da tela e guardado como
 * imagem (data URL). Nada de arquivo: é a regra do jogo, e é também o que
 * garante que o retrato nunca desmente o bicho que entra pelo portão.
 *
 * UM RENDERIZADOR SÓ, preguiçoso: ele nasce na primeira foto pedida e serve a
 * todas (cada `WebGLRenderer` é um contexto WebGL, e o navegador tem poucos).
 * A luz é a mesma receita do boneco do guarda-roupa (`Previa.ts`): céu, sol e
 * contraluz próprios, para a cor do bicho sair a dele e não a da cena.
 *
 * O enquadramento sai da CAIXA do modelo: a Mãe-Lagartejo e o Formiguriço
 * cabem do mesmo tamanho no quadro, e o tamanho de verdade quem diz é o tier
 * escrito embaixo.
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

/** a foto da praga, pronta para um `<img src>`; vazia se o id não existe */
export function retratoDePraga(id: string): string {
  const pronto = cache.get(id);
  if (pronto) return pronto;
  const ficha = PRAGAS.find((p) => p.id === id);
  if (!ficha) return '';
  const estudio = montarEstudio();
  const bicho = ficha.monta(1, 0.5);
  // de três quartos, como a câmera do jogo vê: de frente ele fica chapado
  bicho.rotation.y = -0.6;
  estudio.cena.add(bicho);
  bicho.updateMatrixWorld(true);
  const caixa = new THREE.Box3().setFromObject(bicho);
  const centro = caixa.getCenter(new THREE.Vector3());
  const tamanho = caixa.getSize(new THREE.Vector3());
  const raio = Math.max(tamanho.x, tamanho.y, tamanho.z) * 0.62;
  const longe = raio / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
  camera.position.set(centro.x, centro.y + longe * 0.38, centro.z + longe * 0.92);
  camera.lookAt(centro);
  camera.updateProjectionMatrix();
  estudio.renderer.render(estudio.cena, camera);
  const url = estudio.renderer.domElement.toDataURL('image/png');
  estudio.cena.remove(bicho);
  bicho.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
  });
  cache.set(id, url);
  return url;
}
