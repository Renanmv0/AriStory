import * as THREE from 'three';

/**
 * A MATRIZ SÓ É REFEITA QUANDO O OBJETO MEXE.
 *
 * O Three refaz, a cada frame, a matriz de TODO objeto da cena: `compose()` da
 * posição, rotação e escala, e depois a multiplicação pela matriz do pai. No
 * Villa Lobos são ~6.900 objetos, e quase todos são pedaço de banco, folha de
 * árvore, tábua de cerca — coisas que nunca saem do lugar depois que a cena
 * monta. Era ~1 ms de CPU por frame num servidor, e várias vezes isso num
 * celular, recalculando o mesmo número de sempre.
 *
 * O jeito manual de evitar isso é `matrixAutoUpdate = false` nas peças
 * paradas. Aqui não dá: há centenas de lugares no jogo que movem coisa DEPOIS
 * da montagem (os bichos, a roda gigante, a porta, o item que vai da mão para
 * a mesa, a peça do xadrez), e marcar à mão é garantia de um dia congelar
 * alguma coisa que devia se mexer. Então a decisão é automática e por objeto:
 * `updateMatrix()` guarda a pose com que compôs a matriz da última vez e, se a
 * pose e o pai continuam os mesmos, não faz nada — nem marca o mundo para ser
 * refeito. Sem essa marca, `updateMatrixWorld()` também não multiplica, e não
 * força os filhos: a subárvore parada inteira sai de graça.
 *
 * Por construção, a imagem é a mesma: se a pose é idêntica, o `compose()`
 * daria exatamente a matriz que já está lá. Os dois casos que enganariam a
 * comparação estão cobertos:
 *
 * - TROCA DE PAI (`add`/`attach` de outro grupo) sem mudar a pose local: a
 *   posição local é a mesma, mas o lugar no mundo mudou. Por isso o pai entra
 *   na comparação.
 * - ESCRITA DIRETA em `.matrix`: com `matrixAutoUpdate` ligado o Three já
 *   jogaria essa escrita fora no frame seguinte, então nenhum código do jogo
 *   faz isso (e `applyMatrix4`, que mexe na matriz, devolve para a pose).
 *
 * `scripts/matriz.mjs` confere a promessa: roda cada cena e compara a matriz
 * de mundo de todo objeto com a que o Three calcularia do zero.
 */

interface ComPose {
  _pose?: Float64Array;
  _poseDoPai?: THREE.Object3D | null;
}

let ligado = false;

export function matrizSoQuandoMexe(): void {
  if (ligado) return;
  ligado = true;

  THREE.Object3D.prototype.updateMatrix = function (this: THREE.Object3D & ComPose): void {
    const p = this.position;
    const q = this.quaternion;
    const s = this.scale;
    let pose = this._pose;

    if (
      pose !== undefined &&
      this._poseDoPai === this.parent &&
      pose[0] === p.x && pose[1] === p.y && pose[2] === p.z &&
      pose[3] === q.x && pose[4] === q.y && pose[5] === q.z && pose[6] === q.w &&
      pose[7] === s.x && pose[8] === s.y && pose[9] === s.z
    ) {
      return;
    }

    // Float64: a mesma precisão do número em JS. Float32 arredondaria e toda
    // comparação daria diferente — correto, mas sem ganho nenhum.
    if (pose === undefined) pose = this._pose = new Float64Array(10);
    pose[0] = p.x; pose[1] = p.y; pose[2] = p.z;
    pose[3] = q.x; pose[4] = q.y; pose[5] = q.z; pose[6] = q.w;
    pose[7] = s.x; pose[8] = s.y; pose[9] = s.z;
    this._poseDoPai = this.parent;

    this.matrix.compose(p, q, s);
    this.matrixWorldNeedsUpdate = true;
  };
}
