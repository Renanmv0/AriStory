import * as THREE from 'three';
import { brilhoDeLuz, toon } from '../../core/materials';
import { neon } from '../../core/shaders';
import type { SceneAmbient } from '../../core/types';
import { PALETTE as P } from '../../palette';
import { aroNoChao, pedestal, semSombra } from './comum';

/**
 * ============================================ ESTAÇÃO DE LUZ: o palco
 *
 * O jogo inteiro é iluminado por DUAS luzes: o céu (`HemisphereLight`) e o sol
 * (`DirectionalLight`, a única que faz sombra). A luz de um abajur ou de uma
 * lanterninha é FALSA — uma poça pintada no chão (`luzNoChao`), porque cada
 * luz de verdade a mais muda a conta de luzes da cena e o three recompila o
 * shader de todos os materiais (ver `materials.ts`).
 *
 * Aqui é o lugar onde a luz de verdade pode existir, e ela mora na cena desde
 * a montagem — nunca nasce nem morre no meio do jogo. Ligar e desligar é mexer
 * na INTENSIDADE (0 = apagada): a conta de luzes não muda, e nada recompila.
 *
 *  - três `PointLight` (vermelha, verde e azul) girando em cima do tablado
 *    branco: onde duas se cruzam, as cores SOMAM — vermelho com verde dá
 *    amarelo, as três juntas dão branco. É a mesma conta do pixel de tela;
 *  - um `SpotLight` (o holofote): cone de luz com borda macia (`penumbra`) e
 *    SOMBRA própria. No modo holofote ele persegue a dupla pelo palco;
 *  - o feixe que se vê no ar é uma peça à parte (um cone translúcido): luz de
 *    verdade não aparece no ar, só onde bate.
 *
 * O ciclo do dia (o relógio de sol) mexe nas duas luzes do motor pelo
 * `g.luzDoCeu()` — é a cena que chama, com as contas de `cicloDoDia()`.
 */
export type ModoDoPalco = 'show' | 'holofote' | 'cores';

export interface Palco {
  grupo: THREE.Group;
  readonly modo: ModoDoPalco;
  /** passa para o próximo modo e devolve qual ficou */
  trocarModo(): ModoDoPalco;
  /** `alvo` é quem o holofote persegue (no modo holofote), em coordenada do mundo */
  tique(dt: number, alvo: THREE.Vector3 | null): void;
  readonly luzes: { cores: readonly THREE.PointLight[]; holofote: THREE.SpotLight };
}

const RAIO = 3.3;
/** força de cada lâmpada colorida, em candela (o three usa unidade física) */
const FORCA_COR = 2.2;
const FORCA_HOLOFOTE = 15;

export function palco(): Palco {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'palco';

  // o tablado: branco, para a luz colorida ter onde aparecer. 3 cm de altura —
  // a dupla anda em y = 0 e afunda esses 3 cm, que a câmera não enxerga
  const tablado = new THREE.Mesh(new THREE.CylinderGeometry(RAIO, RAIO + 0.08, 0.03, 56), toon(P.labBranco));
  tablado.position.y = 0.015;
  grupo.add(tablado);
  grupo.add(aroNoChao(RAIO + 0.12, P.labAmarelo, 0.035));

  // a estátua: um nó de toro branco, girando — a peça cheia de curva onde a
  // mistura das cores aparece melhor
  const base = pedestal(0.5, 0.8, P.labPedestal, P.labAmarelo);
  base.position.z = -1.9;
  grupo.add(base);
  const estatua = new THREE.Mesh(new THREE.TorusKnotGeometry(0.42, 0.14, 160, 18), toon(P.labBranco));
  estatua.position.set(0, 0.8 + 0.72, -1.9);
  grupo.add(estatua);

  // ------------------------------------------------------- as três cores
  const cores: THREE.PointLight[] = [];
  const lampadas: THREE.Object3D[] = [];
  for (const cor of [P.labVermelho, P.labVerde, P.labAzul]) {
    const luz = new THREE.PointLight(cor, FORCA_COR, 7.5, 2);
    grupo.add(luz);
    cores.push(luz);
    // a lâmpada que se vê: a bolinha de neon e o halo
    const lampada = new THREE.Group();
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), neon(cor, 2.4));
    lampada.add(semSombra(bola));
    const halo = new THREE.Sprite(brilhoDeLuz(cor, 0.6));
    halo.scale.setScalar(0.7);
    lampada.add(semSombra(halo));
    grupo.add(lampada);
    lampadas.push(lampada);
  }

  // -------------------------------------------------------- o holofote
  const holofote = new THREE.SpotLight(P.labBranco, FORCA_HOLOFOTE, 16, 0.36, 0.5, 2);
  // pendurado no canto de TRÁS do palco: um poste na frente taparia o tablado
  // inteiro para a câmera, que olha de +X/+Z
  holofote.position.set(-1.7, 7.0, -1.6);
  holofote.castShadow = true;
  holofote.shadow.mapSize.set(1024, 1024);
  holofote.shadow.bias = -0.0003;
  holofote.shadow.normalBias = 0.03;
  holofote.shadow.camera.near = 2;
  holofote.shadow.camera.far = 14;
  grupo.add(holofote);
  grupo.add(holofote.target);
  holofote.target.position.set(0, 0, -0.6);

  // a lata do holofote, lá em cima, num braço que sai de um poste
  const POSTE = new THREE.Vector3(-2.75, 0, -2.65);
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 7.5, 10), toon(P.labMetal));
  poste.position.set(POSTE.x, 3.75, POSTE.z);
  grupo.add(poste);
  const vao = Math.hypot(holofote.position.x - POSTE.x, holofote.position.z - POSTE.z);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, vao), toon(P.labMetal));
  braco.position.set((holofote.position.x + POSTE.x) / 2, 7.35, (holofote.position.z + POSTE.z) / 2);
  braco.rotation.y = Math.atan2(holofote.position.x - POSTE.x, holofote.position.z - POSTE.z);
  grupo.add(braco);
  const lata = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.5, 14), toon(P.labPedestal));
  lata.position.copy(holofote.position);
  grupo.add(lata);

  // o feixe: cone translúcido somado por cima do que está atrás. A geometria
  // nasce com a ponta na origem e a boca em +Z, de comprimento 1 — aí o
  // `lookAt` aponta e o `scale.z` estica até o chão
  const geoFeixe = new THREE.ConeGeometry(1, 1, 32, 1, true);
  geoFeixe.translate(0, -0.5, 0);
  geoFeixe.rotateX(-Math.PI / 2);
  const feixe = new THREE.Mesh(
    geoFeixe,
    new THREE.MeshBasicMaterial({
      color: P.labBranco, transparent: true, opacity: 0.1,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }),
  );
  feixe.position.copy(holofote.position);
  grupo.add(semSombra(feixe));

  let modo: ModoDoPalco = 'show';
  let tempo = 0;
  const alvoLocal = new THREE.Vector3();
  const mira = new THREE.Vector3(0, 0, -0.6);
  const mundoDoFeixe = new THREE.Vector3();

  const aplicarModo = (): void => {
    const coresLigadas = modo !== 'holofote';
    cores.forEach((l, i) => {
      l.intensity = coresLigadas ? FORCA_COR : 0;
      lampadas[i].visible = coresLigadas;
    });
    const holofoteLigado = modo !== 'cores';
    holofote.intensity = holofoteLigado ? FORCA_HOLOFOTE : 0;
    feixe.visible = holofoteLigado;
  };
  aplicarModo();

  return {
    grupo,
    get modo() {
      return modo;
    },
    luzes: { cores, holofote },
    trocarModo() {
      modo = modo === 'show' ? 'holofote' : modo === 'holofote' ? 'cores' : 'show';
      aplicarModo();
      return modo;
    },
    tique(dt, alvo) {
      tempo += dt;
      estatua.rotation.y = tempo * 0.5;
      estatua.rotation.x = Math.sin(tempo * 0.4) * 0.25;
      // as três cores dão a volta, defasadas de um terço, subindo e descendo
      cores.forEach((luz, i) => {
        const a = tempo * 0.9 + (i * Math.PI * 2) / 3;
        luz.position.set(Math.cos(a) * 1.9, 2.1 + Math.sin(tempo * 1.3 + i) * 0.35, Math.sin(a) * 1.9 - 0.4);
        lampadas[i].position.copy(luz.position);
      });

      // o holofote: no modo dele persegue a dupla (dentro do tablado); nos
      // outros, descansa na estátua
      if (modo === 'holofote' && alvo) {
        grupo.worldToLocal(alvoLocal.copy(alvo));
        const d = Math.hypot(alvoLocal.x, alvoLocal.z);
        if (d > RAIO - 0.4) alvoLocal.multiplyScalar((RAIO - 0.4) / d);
        alvoLocal.y = 0;
      } else {
        alvoLocal.set(0, 1.2, -1.9);
      }
      mira.lerp(alvoLocal, Math.min(1, dt * 4));
      holofote.target.position.copy(mira);

      // o feixe aponta para onde o holofote aponta, e estica até lá
      grupo.localToWorld(mundoDoFeixe.copy(mira));
      feixe.lookAt(mundoDoFeixe);
      const comprimento = holofote.position.distanceTo(mira);
      const boca = Math.tan(holofote.angle) * comprimento;
      feixe.scale.set(boca, boca, comprimento);
    },
  };
}

/**
 * O RELÓGIO DE SOL: a peça que a dupla usa para passar um dia inteiro no
 * laboratório. O ponteiro (gnômon) é um triângulo de pé num disco com as doze
 * marcas; quem faz o dia passar é a cena.
 */
export function relogioDeSol(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'relogio-de-sol';
  g.add(pedestal(0.55, 0.85, P.labPedestal, P.labLaranja));
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 36), toon(P.labBranco));
  disco.position.y = 0.92;
  g.add(disco);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const marca = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, i % 3 === 0 ? 0.12 : 0.07), toon(P.labPedestal));
    marca.position.set(Math.sin(a) * 0.4, 0.95, Math.cos(a) * 0.4);
    marca.rotation.y = a;
    g.add(marca);
  }
  const forma = new THREE.Shape();
  forma.moveTo(0, 0);
  forma.lineTo(0.36, 0);
  forma.lineTo(0, 0.3);
  forma.closePath();
  const gnomon = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: 0.03, bevelEnabled: false }), toon(P.labMetal));
  gnomon.position.set(-0.015, 0.94, -0.18);
  gnomon.rotation.y = -Math.PI / 2;
  g.add(gnomon);
  return g;
}

// ------------------------------------------------------- o ciclo do dia

const NOITE = new THREE.Color(P.labCeu);
const AURORA = new THREE.Color(P.skyDusk);
const DIA = new THREE.Color(P.skyDay);
const SOL_DO_MEIO_DIA = new THREE.Color(P.sunWarm);
const tmp = new THREE.Color();
const tmpSol = new THREE.Color();

/**
 * A LUZ DE UM MOMENTO DO DIA, para o `g.luzDoCeu()`. `t` vai de 0 a 1: nasce
 * em 0, meio-dia em 0,25, pôr do sol em 0,5 e noite até 1 (e volta a nascer).
 * O sol anda num arco de leste a oeste — a sombra da dupla gira junto —, e de
 * noite fica a lua: luz fraca, azulada, vinda de cima.
 */
export function cicloDoDia(t: number, noite: Partial<SceneAmbient>): Partial<SceneAmbient> {
  const a = (((t % 1) + 1) % 1) * Math.PI * 2;
  const altura = Math.sin(a);
  if (altura <= 0) return { ...noite };
  // a cor do céu: aurora perto do horizonte, azul no alto
  const k = Math.min(1, altura * 1.6);
  tmp.lerpColors(NOITE, AURORA, Math.min(1, altura * 6)).lerp(DIA, Math.max(0, k * 1.15 - 0.15));
  tmpSol.setHex(P.skyDusk).lerp(SOL_DO_MEIO_DIA, k);
  return {
    sky: tmp.getHex(),
    ambientColor: tmp.getHex(),
    ambientIntensity: 0.55 + k * 0.55,
    sunColor: tmpSol.getHex(),
    sunIntensity: 0.4 + k * 1.3,
    sunDir: [Math.cos(a) * 22, Math.max(1.5, altura * 22), 6],
  };
}
