import * as THREE from 'three';
import { IsoCamera } from './IsoCamera';
import { Input } from './Input';
import { SaveState } from './SaveState';
import { Ui } from '../ui/Ui';
import { Player } from '../entities/Player';
import { Companion } from '../entities/Companion';
import { Beijo } from '../entities/Beijo';
import { CharacterRig } from '../characters/CharacterRig';
import { WorldBuilder } from '../world/WorldBuilder';
import type { Interactable } from '../world/Interactable';
import type { GameAPI, Memory, SceneAmbient, SceneDef } from './types';
import type { CharacterSpec } from '../characters/spec';

interface LoadedScene {
  def: SceneDef;
  world: WorldBuilder;
}

/**
 * Orquestrador: cuida do renderer, das luzes, do loop e da troca de cena.
 * Cenas e interativos so conversam com ele pela interface GameAPI.
 */
export class Game implements GameAPI {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly iso = new IsoCamera();
  private readonly input: Input;
  private readonly ui: Ui;
  private readonly save = new SaveState();
  private readonly player: Player;
  private readonly parceiro: Companion;
  private readonly clock = new THREE.Clock();
  private readonly beijo: Beijo;

  private readonly hemi: THREE.HemisphereLight;
  private readonly sun: THREE.DirectionalLight;

  private current: LoadedScene | null = null;
  private hot: Interactable | null = null;
  private cameraTarget: THREE.Object3D | null = null;
  private transitioning = false;
  /** o beijo esta ao alcance neste frame (checado no fim do frame anterior) */
  private podeBeijar = false;
  private elapsed = 0;
  private shadowSpan = 0;
  private traje: 'normal' | 'banho' = 'normal';

  private readonly moveDir = new THREE.Vector3();
  private readonly camAim = new THREE.Vector3();

  constructor(
    private readonly root: HTMLElement,
    private readonly scenes: Record<string, SceneDef>,
    dupla: readonly CharacterSpec[],
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    root.appendChild(this.renderer.domElement);

    this.ui = new Ui(root);
    this.ui.setMemories(this.save.memories);
    this.ui.onTouchAction = () => this.input.tapAction();
    this.ui.onTouchSwap = () => this.input.tapSwap();
    this.ui.onTouchHold = (down) => this.input.setVirtualDown('KeyF', down);
    this.input = new Input(this.renderer.domElement);

    this.hemi = new THREE.HemisphereLight(0xffffff, 0x8aa06a, 1.05);
    this.scene.add(this.hemi);

    this.sun = new THREE.DirectionalLight(0xfff2d0, 1.5);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 220;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.04;
    const cam = this.sun.shadow.camera;
    cam.left = -22;
    cam.right = 22;
    cam.top = 22;
    cam.bottom = -22;
    cam.updateProjectionMatrix();
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.player = new Player(new CharacterRig(dupla[0]));
    this.scene.add(this.player.object);

    this.beijo = new Beijo(this.scene);

    this.parceiro = new Companion(new CharacterRig(dupla[1] ?? dupla[0]));
    this.parceiro.setVisible(dupla.length > 1);
    this.scene.add(this.parceiro.object);

    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('wheel', this.onWheel, { passive: false });
  }

  // ------------------------------------------------------------------ boot

  async start(sceneId?: string, entry?: string): Promise<void> {
    const id = sceneId ?? (this.scenes[this.save.scene] ? this.save.scene : Object.keys(this.scenes)[0]);
    this.build(id, entry);
    this.iso.snapTo(this.player.chest);
    this.renderer.render(this.scene, this.iso.camera);
    this.ui.hideBoot();
    this.renderer.setAnimationLoop(this.tick);
  }

  // ---------------------------------------------------------------- cenas

  private build(id: string, entry?: string): void {
    const def = this.scenes[id];
    if (!def) throw new Error(`cena desconhecida: ${id}`);

    if (this.current) {
      this.scene.remove(this.current.world.root);
      this.current.world.dispose();
    }

    const world = new WorldBuilder(this);
    world.setSeed(hashSeed(id));
    def.build(world);
    this.scene.add(world.root);
    this.current = { def, world };

    this.applyAmbient(def.ambient);

    const spawn = (entry && def.entries?.[entry]) || def.spawn;
    this.player.teleport(spawn.x, spawn.z, spawn.facing ?? 0);
    this.player.locked = false;
    this.player.riding = false;
    this.player.setVisible(true);

    // o parceiro chega junto, um passo atras
    const atras = (spawn.facing ?? 0) + Math.PI;
    this.parceiro.riding = false;
    this.parceiro.teleport(
      spawn.x + Math.sin(atras) * 1.3,
      spawn.z + Math.cos(atras) * 1.3,
      spawn.facing ?? 0,
    );
    this.parceiro.setVisible(true);
    this.cameraTarget = null;
    this.hot = null;
    this.beijo.cancelar(this.player, this.parceiro);
    this.podeBeijar = false;
    this.parceiro.clearOrder();
    this.setSitting(false);
    this.setOutfit(def.outfit ?? 'normal');
    this.ui.hidePrompt();
    this.ui.sceneCard(def.name, def.subtitle);
    this.save.scene = id;
  }

  private indoor = false;

  /** A sombra tem que cobrir tudo que aparece na tela, senao objetos altos
   *  (a roda gigante) projetam sombras cortadas no chao. */
  private setShadowSpan(span: number): void {
    if (Math.abs(span - this.shadowSpan) < 1.5) return;
    this.shadowSpan = span;
    // quanto maior a area coberta, mais grosso o texel da sombra: sem escalar o
    // normalBias junto aparecem aqueles triangulos de acne em volta do jogador
    this.sun.shadow.normalBias = 0.04 * (span / 22);
    const cam = this.sun.shadow.camera;
    cam.left = -span;
    cam.right = span;
    cam.top = span;
    cam.bottom = -span;
    cam.updateProjectionMatrix();
  }

  private applyAmbient(a: SceneAmbient): void {
    this.scene.background = new THREE.Color(a.sky);
    this.scene.fog = a.fog !== undefined
      ? new THREE.Fog(a.fog, a.fogNear ?? 95, a.fogFar ?? 200)
      : null;

    this.hemi.color.setHex(a.ambientColor ?? a.sky);
    this.hemi.intensity = a.ambientIntensity ?? (a.indoor ? 1.35 : 1.0);

    this.sun.color.setHex(a.sunColor ?? 0xfff2d0);
    this.sun.intensity = a.sunIntensity ?? (a.indoor ? 0.85 : 1.6);
    const dir = a.sunDir ?? [14, 20, 9];
    this.sun.position.set(dir[0], dir[1], dir[2]);

    this.indoor = a.indoor === true;
    this.setShadowSpan(a.indoor ? 12 : 22);
    this.iso.setViewSize(a.indoor ? 10 : 14);
  }

  // ----------------------------------------------------------------- loop

  private tick = (): void => {
    const dt = Math.min(this.clock.getDelta(), 1 / 20);
    this.elapsed += dt;
    const world = this.current?.world;
    if (!world) return;

    // ------------------------------------------------------------ entrada
    const busy = this.ui.dialogueOpen || this.ui.journalOpen || this.transitioning;
    this.input.blocked = busy || this.player.locked;

    if (this.input.justPressed('KeyJ')) this.ui.toggleJournal();
    if (!busy && !this.player.locked && this.input.justPressed('KeyT')) this.swapCharacters();
    if (!busy) {
      if (this.input.justPressed('KeyQ')) this.iso.rotate(-1);
      if (this.input.justPressed('KeyR')) this.iso.rotate(1);
    }

    const acted = this.input.justPressed('KeyE') || this.input.justPressed('Space');
    if (acted && this.ui.handleAction()) {
      // o dialogo consumiu a tecla
    } else if (acted && !busy && this.hot && !this.player.locked) {
      void this.hot.trigger(this);
    } else if (acted && !busy && this.podeBeijar && !this.player.locked) {
      this.beijo.iniciar(this.player, this.parceiro, this.iso.angle);
    }

    // o beijo roda antes do movimento: e ele que segura os dois no lugar
    this.beijo.update(dt, this.player, this.parceiro);

    // ---------------------------------------------------------- movimento
    const m = this.input.move();
    this.iso.screenToWorld(m.x, m.y, this.moveDir);
    this.player.update(this.moveDir, dt, world.colliders, world.bounds);
    this.parceiro.update(this.player.position, dt, world.colliders, world.bounds);

    // ------------------------------------------------------- interativos
    this.updateHot(world, dt);
    this.updateBeijo();

    // ------------------------------------------------------------- cena
    for (const fn of world.updaters) fn(dt, this.elapsed);

    // ------------------------------------------------------------ camera
    if (this.cameraTarget) this.cameraTarget.getWorldPosition(this.camAim);
    else this.camAim.copy(this.player.chest);
    this.iso.update(dt, this.camAim);

    const span = this.indoor ? 12 : Math.max(22, this.iso.currentViewSize * 1.7);
    this.setShadowSpan(span);
    const k = span / 22;
    this.sun.target.position.copy(this.camAim);
    this.sun.position.set(this.camAim.x + 14 * k, this.camAim.y + 20 * k, this.camAim.z + 9 * k);

    this.renderer.render(this.scene, this.iso.camera);
    this.input.endFrame();
  };

  /**
   * Prompt do beijo. Ele so aparece quando nao ha interativo por perto — o
   * cenario sempre ganha do carinho, senao o sofa e a geladeira ficam
   * inalcancaveis quando os dois estao coladinhos.
   */
  private updateBeijo(): void {
    this.podeBeijar =
      !this.ui.dialogueOpen &&
      !this.ui.journalOpen &&
      !this.player.locked &&
      this.beijo.disponivel(this.player, this.parceiro);

    if (this.hot) return;
    if (this.podeBeijar) this.ui.showPrompt('💋', `Beijar ${this.parceiro.name}`);
    else this.ui.hidePrompt();
  }

  private updateHot(world: WorldBuilder, dt: number): void {
    let best: Interactable | null = null;
    let bestDist = Infinity;
    let bestPriority = -Infinity;
    const px = this.player.position.x;
    const pz = this.player.position.z;

    for (const it of world.interactables) {
      if (!it.available) continue;
      const d = it.distanceTo(px, pz);
      if (d > it.radius) continue;
      if (it.priority < bestPriority) continue;
      if (it.priority === bestPriority && d >= bestDist) continue;
      best = it;
      bestDist = d;
      bestPriority = it.priority;
    }

    if (best !== this.hot) {
      this.hot?.setHot(false);
      best?.setHot(true);
      this.hot = best;
      if (best && !this.player.locked) this.ui.showPrompt(best.icon, best.label);
      else this.ui.hidePrompt();
    }
    if (this.player.locked || this.ui.dialogueOpen) this.ui.hidePrompt();
    else if (this.hot) this.ui.showPrompt(this.hot.icon, this.hot.label);

    for (const it of world.interactables) it.update(dt);
  }

  // ------------------------------------------------------------- GameAPI

  get companionObject(): THREE.Object3D {
    return this.parceiro.object;
  }

  say(lines: string | string[], speaker?: string): Promise<void> {
    return this.ui.say(Array.isArray(lines) ? lines : [lines], speaker ?? this.player.name);
  }

  ask(pergunta: string, opcoes: string[], speaker?: string): Promise<number> {
    return this.ui.ask(pergunta, opcoes, speaker ?? this.player.name);
  }

  toast(text: string, icon?: string): void {
    this.ui.toast(text, icon);
  }

  goTo(sceneId: string, entry?: string): void {
    if (this.transitioning) return;
    this.transitioning = true;
    void (async () => {
      await this.ui.fade(true);
      this.build(sceneId, entry);
      this.iso.snapTo(this.player.chest);
      await this.ui.fade(false);
      this.transitioning = false;
    })();
  }

  focusCamera(target: THREE.Object3D | null): void {
    this.cameraTarget = target;
  }

  setZoom(viewSize: number): void {
    this.iso.setViewSize(viewSize);
  }

  lockPlayer(locked: boolean): void {
    this.player.locked = locked;
    if (locked) this.ui.hidePrompt();
  }

  setPlayerVisible(visible: boolean): void {
    this.player.setVisible(visible);
  }

  flag(key: string): boolean {
    return this.save.flag(key);
  }

  setFlag(key: string, value = true): void {
    this.save.setFlag(key, value);
  }

  bump(key: string, by = 1): number {
    return this.save.bump(key, by);
  }

  stat(key: string): number {
    return this.save.stat(key);
  }

  unlock(memory: Memory): void {
    if (this.save.addMemory(memory)) {
      this.ui.setMemories(this.save.memories);
      this.ui.toast(`Nova memória: ${memory.title}`, memory.icon);
      this.player.rig.cheer();
    }
  }

  /**
   * Coloca a dupla num ponto da cena. Existe para depuracao: e o que o
   * parametro ?em=x,z da URL usa para tirar retrato longe de parede.
   */
  debugPlace(x: number, z: number, facing = Math.PI / 4): void {
    this.player.teleport(x, z, facing);
    this.parceiro.teleport(x - 1.2, z - 0.4, facing);
    this.iso.snapTo(this.player.chest);
  }

  keyPressed(code: string): boolean {
    if (this.ui.dialogueOpen || this.ui.journalOpen || this.player.locked) return false;
    return this.input.justPressed(code);
  }

  keyDown(code: string): boolean {
    if (this.ui.dialogueOpen || this.ui.journalOpen || this.player.locked) return false;
    return this.input.isDown(code);
  }

  showCharge(valor: number | null): void {
    this.ui.showCharge(valor);
  }

  wait(seconds: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
  }

  playerPosition(): THREE.Vector3 {
    return this.player.position.clone();
  }

  playerFacing(): number {
    return this.player.rig.group.rotation.y;
  }

  playerName(): string {
    return this.player.name;
  }

  companionName(): string {
    return this.parceiro.name;
  }

  companionPosition(): THREE.Vector3 {
    return this.parceiro.position.clone();
  }

  companionFacing(): number {
    return this.parceiro.rig.facing;
  }

  /** Troca os corpos entre quem anda e quem acompanha. Ninguem sai do lugar. */
  swapCharacters(): void {
    if (this.player.riding || this.parceiro.riding) return;
    const doJogador = this.player.rig;
    this.player.swapRig(this.parceiro.rig);
    this.parceiro.swapRig(doJogador);
    this.setOutfit(this.traje);
    this.ui.toast(`Agora você é ${this.player.name}`, '🔁');
  }

  submergePlayer(valor: number): void {
    this.player.submersion = THREE.MathUtils.clamp(valor, 0, 1);
  }

  submergeCompanion(valor: number): void {
    this.parceiro.submersion = THREE.MathUtils.clamp(valor, 0, 1);
  }

  rideCompanion(host: THREE.Object3D, local: THREE.Vector3, scale = 1, facing = Math.PI): void {
    host.add(this.parceiro.object);
    this.parceiro.object.position.copy(local);
    this.parceiro.object.scale.setScalar(scale);
    this.parceiro.rig.group.rotation.y = facing;
    this.parceiro.rig.setFacing(facing);
    this.parceiro.riding = true;
  }

  commandCompanion(x: number, z: number): void {
    this.parceiro.goTo(x, z);
  }

  freeCompanion(): void {
    this.parceiro.clearOrder();
  }

  holdCompanion(olharX: number, olharZ: number): void {
    this.parceiro.hold(olharX, olharZ);
  }

  setSitting(sentados: boolean): void {
    this.player.rig.setSitting(sentados);
    this.parceiro.rig.setSitting(sentados);
  }

  setOutfit(traje: 'normal' | 'banho'): void {
    this.player.rig.setOutfit(traje);
    this.parceiro.rig.setOutfit(traje);
    this.traje = traje;
  }

  releaseCompanion(x: number, z: number, facing = 0): void {
    this.scene.add(this.parceiro.object);
    this.parceiro.object.scale.setScalar(1);
    this.parceiro.riding = false;
    this.parceiro.teleport(x, z, facing);
  }

  ridePlayer(host: THREE.Object3D, local: THREE.Vector3, scale = 1): void {
    host.add(this.player.object);
    this.player.object.position.copy(local);
    this.player.object.scale.setScalar(scale);
    this.player.rig.group.rotation.y = Math.PI;
    this.player.riding = true;
    this.player.locked = true;
    this.ui.hidePrompt();
  }

  releasePlayer(x: number, z: number, facing = 0): void {
    this.scene.add(this.player.object);
    this.player.object.scale.setScalar(1);
    this.player.riding = false;
    this.player.teleport(x, z, facing);
    this.player.locked = false;
  }

  // ----------------------------------------------------------------- misc

  private onResize = (): void => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.iso.resize(window.innerWidth, window.innerHeight);
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.iso.zoomBy(Math.sign(e.deltaY) * 1.1);
  };

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this.onResize);
    this.input.dispose();
    this.renderer.dispose();
    this.root.replaceChildren();
  }
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
