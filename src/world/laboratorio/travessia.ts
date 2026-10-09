import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../WorldBuilder';

/**
 * ===================================== A TRAVESSIA: entrar e sair do computador
 *
 * A dupla é SUGADA pela tela do computador do Ari (ou pelo portal do
 * laboratório) e CUSPIDA do outro lado. São sempre os dois: cada um numa
 * âncora (`ridePlayer`/`rideCompanion`), e quem se mexe é a âncora.
 *
 * O movimento é um CLIPE DE KEYFRAMES da skill de animação, montado na hora:
 * vinte e tantos quadros-chave de posição, escala e rotação, calculados de
 * onde cada um está até o alvo — uma espiral que aperta, encolhendo e girando
 * cada vez mais rápido. Quem toca é um `AnimationMixer` por âncora, avançado
 * pelo `w.onUpdate` (então o menu pausa a travessia junto com o mundo), e a
 * promessa resolve no evento `finished` do mixer.
 *
 * Os dois giram em sentidos opostos e o segundo chega um tiquinho depois: em
 * espelho perfeito eles pareceriam um só boneco duplicado.
 */
export class Travessia {
  private readonly mixers = new Set<THREE.AnimationMixer>();
  private readonly ancoras: [THREE.Object3D, THREE.Object3D] = [new THREE.Object3D(), new THREE.Object3D()];
  /** para onde a câmera olha enquanto os dois estão nas âncoras */
  readonly foco = new THREE.Object3D();

  constructor(w: WorldBuilder) {
    for (const a of this.ancoras) w.root.add(a);
    w.root.add(this.foco);
    w.onUpdate((dt) => {
      for (const m of this.mixers) m.update(dt);
    });
  }

  /** os dois estão no meio de uma travessia (o teste pergunta) */
  get andando(): boolean {
    return this.mixers.size > 0;
  }

  private tocar(ancora: THREE.Object3D, clipe: THREE.AnimationClip): Promise<void> {
    return new Promise((resolve) => {
      const mixer = new THREE.AnimationMixer(ancora);
      const acao = mixer.clipAction(clipe);
      acao.setLoop(THREE.LoopOnce, 1);
      acao.clampWhenFinished = true;
      const fim = (): void => {
        mixer.removeEventListener('finished', fim);
        this.mixers.delete(mixer);
        resolve();
      };
      mixer.addEventListener('finished', fim);
      this.mixers.add(mixer);
      acao.play();
    });
  }

  /**
   * SUGA os dois de onde estão até `alvo` (um ponto do mundo): encolhem até
   * quase sumir, girando. Ao fim eles CONTINUAM nas âncoras, miudinhos dentro
   * do alvo — quem chama troca de cena em seguida, e o motor devolve os dois
   * ao chão da cena nova.
   */
  async sugar(g: GameAPI, alvo: THREE.Vector3, duracao = 1.7): Promise<void> {
    const [a, b] = this.ancoras;
    const pa = g.playerPosition().clone();
    const pb = g.companionPosition().clone();
    const fa = g.playerFacing();
    const fb = g.companionFacing();
    g.lockPlayer(true);
    a.position.copy(pa);
    a.rotation.set(0, fa, 0);
    b.position.copy(pb);
    b.rotation.set(0, fb, 0);
    g.ridePlayer(a, new THREE.Vector3(), 1, 0);
    g.rideCompanion(b, new THREE.Vector3(), 1, 0);
    this.foco.position.lerpVectors(pa, alvo, 0.5);
    await Promise.all([
      this.tocar(a, clipeDeSugar(pa, fa, alvo, duracao, 1)),
      this.tocar(b, clipeDeSugar(pb, fb, alvo, duracao * 1.1, -1)),
    ]);
  }

  /**
   * CUSPE os dois de `origem` até os pés deles (`destinos`), crescendo de
   * miudinhos ao tamanho de gente num arco, e solta no chão olhando para
   * `olhar`. É a chegada — do laboratório ou de volta no quarto.
   */
  async cuspir(
    g: GameAPI,
    origem: THREE.Vector3,
    destinos: readonly [THREE.Vector3, THREE.Vector3],
    olhar: number,
    duracao = 1.3,
  ): Promise<void> {
    const [a, b] = this.ancoras;
    g.lockPlayer(true);
    for (const ancora of [a, b]) {
      ancora.position.copy(origem);
      ancora.scale.setScalar(0.04);
    }
    g.ridePlayer(a, new THREE.Vector3(), 1, 0);
    g.rideCompanion(b, new THREE.Vector3(), 1, 0);
    this.foco.position.lerpVectors(origem, destinos[0], 0.6);
    await Promise.all([
      this.tocar(a, clipeDeCuspir(origem, destinos[0], olhar, duracao, 1)),
      this.tocar(b, clipeDeCuspir(origem, destinos[1], olhar, duracao * 1.12, -1)),
    ]);
    g.releasePlayer(destinos[0].x, destinos[0].z, olhar);
    g.releaseCompanion(destinos[1].x, destinos[1].z, olhar);
    for (const ancora of [a, b]) ancora.scale.setScalar(1);
    g.lockPlayer(false);
  }
}

const QUADROS = 28;

/** quaternion de "girado `giro` em volta do Y e inclinado `inclina` para a frente" */
function pose(giro: number, inclina: number): number[] {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(inclina, giro, 0, 'YXZ')).toArray();
}

function clipeDeSugar(de: THREE.Vector3, giro0: number, para: THREE.Vector3, duracao: number, lado: number): THREE.AnimationClip {
  const tempos: number[] = [];
  const pos: number[] = [];
  const esc: number[] = [];
  const rot: number[] = [];
  const dx = para.x - de.x;
  const dz = para.z - de.z;
  const d = Math.hypot(dx, dz) || 1;
  // o lado da espiral: perpendicular ao caminho
  const px = (-dz / d) * lado;
  const pz = (dx / d) * lado;
  for (let k = 0; k <= QUADROS; k++) {
    const t = k / QUADROS;
    // começa devagar (resistindo) e acelera no fim: é sucção
    const e = t * t * (1.6 - 0.6 * t);
    const espiral = Math.sin(t * Math.PI * 2.5) * (1 - t) * 0.55;
    tempos.push(t * duracao);
    pos.push(
      de.x + dx * e + px * espiral,
      de.y + (para.y - de.y) * e + Math.sin(t * Math.PI) * 0.35 * (1 - t),
      de.z + dz * e + pz * espiral,
    );
    const s = Math.max(0.03, 1 - 0.97 * Math.pow(t, 1.4));
    esc.push(s, s, s);
    rot.push(...pose(giro0 + lado * t * t * Math.PI * 7, Math.min(0.5, t * 0.9)));
  }
  return new THREE.AnimationClip('sugar', duracao, [
    new THREE.VectorKeyframeTrack('.position', tempos, pos),
    new THREE.VectorKeyframeTrack('.scale', tempos, esc),
    new THREE.QuaternionKeyframeTrack('.quaternion', tempos, rot),
  ]);
}

function clipeDeCuspir(de: THREE.Vector3, para: THREE.Vector3, olhar: number, duracao: number, lado: number): THREE.AnimationClip {
  const tempos: number[] = [];
  const pos: number[] = [];
  const esc: number[] = [];
  const rot: number[] = [];
  for (let k = 0; k <= QUADROS; k++) {
    const t = k / QUADROS;
    // sai rápido e freia no pouso
    const e = 1 - (1 - t) * (1 - t);
    tempos.push(t * duracao);
    pos.push(
      de.x + (para.x - de.x) * e,
      de.y + (para.y - de.y) * e + Math.sin(t * Math.PI) * 0.9,
      de.z + (para.z - de.z) * e,
    );
    const s = 0.04 + 0.96 * Math.min(1, e * 1.15);
    esc.push(s, s, s);
    rot.push(...pose(olhar + lado * (1 - e) * Math.PI * 4, 0));
  }
  return new THREE.AnimationClip('cuspir', duracao, [
    new THREE.VectorKeyframeTrack('.position', tempos, pos),
    new THREE.VectorKeyframeTrack('.scale', tempos, esc),
    new THREE.QuaternionKeyframeTrack('.quaternion', tempos, rot),
  ]);
}
