import type * as THREE from 'three';
import type { WorldBuilder } from '../world/WorldBuilder';

export interface CircleCollider {
  kind: 'circle';
  x: number;
  z: number;
  r: number;
}

export interface BoxCollider {
  kind: 'box';
  x: number;
  z: number;
  /** meia largura em X (antes da rotacao) */
  hw: number;
  /** meia profundidade em Z (antes da rotacao) */
  hd: number;
  /** rotacao em torno de Y, radianos */
  rot: number;
}

export type Collider = CircleCollider | BoxCollider;

export interface Bounds {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}

export interface SceneAmbient {
  /** cor do ceu / fundo */
  sky: number;
  fog?: number;
  fogNear?: number;
  fogFar?: number;
  sunColor?: number;
  sunIntensity?: number;
  /** direcao da luz principal (de onde ela vem) */
  sunDir?: [number, number, number];
  ambientColor?: number;
  ambientIntensity?: number;
  /** cena interna: sombra mais curta, sem ceu gigante */
  indoor?: boolean;
}

export interface SpawnPoint {
  x: number;
  z: number;
  /** angulo em radianos que o personagem olha ao nascer */
  facing?: number;
}

export interface SceneDef {
  id: string;
  /** nome mostrado no cartao de entrada da cena */
  name: string;
  subtitle?: string;
  ambient: SceneAmbient;
  spawn: SpawnPoint;
  /** entradas nomeadas, usadas quando se chega por uma porta especifica */
  entries?: Record<string, SpawnPoint>;
  build(w: WorldBuilder): void;
}

export interface InteractableDef {
  id?: string;
  x: number;
  z: number;
  /** distancia em que o prompt aparece (padrao 2.0) */
  radius?: number;
  /** texto do prompt, ex: "Andar na roda gigante" */
  label: string;
  /** emoji do prompt */
  icon?: string;
  /** objeto que balanca de leve quando voce chega perto */
  highlight?: THREE.Object3D;
  /** so pode ser usado uma vez por visita */
  once?: boolean;
  /** desempate quando dois prompts se sobrepoem: maior ganha (padrao 0) */
  priority?: number;
  onInteract(g: GameAPI): void | Promise<void>;
}

export interface Memory {
  id: string;
  title: string;
  place: string;
  note: string;
  icon: string;
}

/** Superficie que as cenas e os interativos usam para falar com o jogo. */
export interface GameAPI {
  /** mostra uma ou varias falas e resolve quando o jogador fecha a ultima */
  say(lines: string | string[], speaker?: string): Promise<void>;
  /** aviso curto no canto da tela */
  toast(text: string, icon?: string): void;
  /** troca de cena; entry e o nome de uma entrada da cena destino */
  goTo(sceneId: string, entry?: string): void;
  /** camera passa a seguir outro objeto; null volta pro jogador */
  focusCamera(target: THREE.Object3D | null): void;
  /** muda o enquadramento: valores maiores afastam a camera */
  setZoom(viewSize: number): void;
  /** trava/destrava o controle do jogador (usado em cutscenes) */
  lockPlayer(locked: boolean): void;
  setPlayerVisible(visible: boolean): void;
  /** flags persistentes, ex: ja regou a planta */
  flag(key: string): boolean;
  setFlag(key: string, value?: boolean): void;
  /** contadores persistentes, ex: quantos frisbees pegou */
  bump(key: string, by?: number): number;
  stat(key: string): number;
  /** desbloqueia uma memoria no diario */
  unlock(memory: Memory): void;
  wait(seconds: number): Promise<void>;
  /** posicao atual do jogador */
  playerPosition(): THREE.Vector3;
  /** angulo para onde o jogador esta olhando, em radianos */
  playerFacing(): number;
  /** prende o jogador dentro de outro objeto (cabine, carro, barco) */
  ridePlayer(host: THREE.Object3D, local: THREE.Vector3, scale?: number): void;
  /** devolve o jogador para o chao da cena */
  releasePlayer(x: number, z: number, facing?: number): void;
}
