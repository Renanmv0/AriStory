import * as THREE from 'three';
import { IsoCamera } from './IsoCamera';
import { Input } from './Input';
import { SaveState } from './SaveState';
import { Ui } from '../ui/Ui';
import { Player } from '../entities/Player';
import { Companion } from '../entities/Companion';
import { Beijo } from '../entities/Beijo';
import { Coracoes } from '../entities/Coracoes';
import { MaosDadas } from '../entities/MaosDadas';
import { Som } from '../audio/Som';
import type { SomNome } from '../audio/efeitos';
import { CharacterRig } from '../characters/CharacterRig';
import { WorldBuilder } from '../world/WorldBuilder';
import type { Interactable } from '../world/Interactable';
import type { Coleta, GameAPI, ItemDef, Memory, SceneAmbient, SceneDef, Vaga } from './types';
import { ITENS, modeloDoItem } from '../world/itens';
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
  private readonly coracoes: Coracoes;
  private readonly beijo: Beijo;
  private readonly maos: MaosDadas;
  private readonly audio = new Som();

  private readonly hemi: THREE.HemisphereLight;
  private readonly sun: THREE.DirectionalLight;

  private current: LoadedScene | null = null;
  private hot: Interactable | null = null;
  private cameraTarget: THREE.Object3D | null = null;
  private transitioning = false;
  /** o beijo esta ao alcance neste frame (checado no fim do frame anterior) */
  private podeBeijar = false;
  /** id do item que cada rig esta segurando agora, para nao reconstruir a malha */
  private readonly naMao = new Map<string, string | null>();
  /** distância andada desde o último passo ouvido */
  private trilha = 0;
  private elapsed = 0;
  private shadowSpan = 0;
  private traje: 'normal' | 'banho' = 'normal';

  private readonly moveDir = new THREE.Vector3();
  private readonly camAim = new THREE.Vector3();
  /** camera de perspectiva do ping pong; só nasce quando alguém pede */
  private camOmbro: THREE.PerspectiveCamera | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly scenes: Record<string, SceneDef>,
    private readonly dupla: readonly CharacterSpec[],
    /** onde o jogo começa quando não há progresso salvo */
    private readonly cenaInicial = Object.keys(scenes)[0],
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
    // clique numa vaga da mochila escolhe qual item fica na mao
    this.ui.onEscolherSlot = (i) => this.setActiveHandSlot(i);
    this.ui.onMoverItem = (de, para) => this.moveItem(de, para);
    this.ui.onDescartar = (de) => this.descartarDaVaga(de);
    this.ui.onAbrirMochila = () => this.pintarMochila();
    this.ui.onTouchHold = (down) => this.input.setVirtualDown('KeyF', down);
    this.ui.onRestart = () => this.restart();
    this.ui.som = (nome) => this.audio.play(nome);
    this.ui.onToggleSom = () => {
      this.audio.setMudo(this.audio.ligado);
      this.ui.setSom(this.audio.ligado);
      if (this.audio.ligado) this.audio.play('menu');
    };
    this.ui.setSom(this.audio.ligado);
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

    this.coracoes = new Coracoes(this.scene);
    this.beijo = new Beijo(this.coracoes);
    this.beijo.onSom = (nome) => this.audio.play(nome);
    this.maos = new MaosDadas(this.coracoes);
    this.maos.onSom = (nome) => this.audio.play(nome);

    this.parceiro = new Companion(new CharacterRig(dupla[1] ?? dupla[0]));
    this.parceiro.setVisible(dupla.length > 1);
    this.scene.add(this.parceiro.object);

    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('wheel', this.onWheel, { passive: false });
  }

  // ------------------------------------------------------------------ boot

  async start(sceneId?: string, entry?: string): Promise<void> {
    const id = sceneId ?? (this.scenes[this.save.scene] ? this.save.scene : this.cenaInicial);
    this.build(id, entry);
    this.iso.snapTo(this.player.chest);
    this.renderer.render(this.scene, this.iso.camera);
    this.ui.hideBoot();
    this.renderer.setAnimationLoop(this.tick);
  }

  /**
   * Apaga o progresso e volta para o começo — é o "recomeçar" do menu, para
   * mostrar o jogo do zero para alguém. Zera diário, flags e contadores, põe o
   * Ari de volta no comando e leva os dois para a cena inicial.
   */
  restart(): void {
    this.save.reset();
    this.ui.setMemories(this.save.memories);
    if (this.player.rig.spec.id !== this.dupla[0].id) this.swapCharacters();
    this.ui.showHints();
    this.goTo(this.cenaInicial);
    this.audio.play('recomecar');
    this.ui.toast('Do começo, então', '🔄');
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
    this.maos.soltar(this.player, this.parceiro);
    this.coracoes.limpar();
    this.podeBeijar = false;
    this.camOmbro = null; // nenhum minigame sobrevive a uma troca de cena
    this.ui.showPlacar(null);
    this.parceiro.clearOrder();
    this.setSitting(false);
    this.setOutfit(def.outfit ?? 'normal');
    this.ui.hidePrompt();
    this.ui.sceneCard(def.name, def.subtitle);
    this.audio.setClima(id);
    this.migrarPremios();
    this.aplicarPremios();
    this.save.scene = id;
  }

  /**
   * Prêmios que ficam no corpo do personagem. O chapéu de campeão do ping pong
   * é do RIG, não do slot: ele viaja junto quando o T troca os corpos, porque
   * quem ganhou foi o personagem, não "o jogador".
   */
  private aplicarPremios(): void {
    this.sincronizarVestiveis();
  }

  /**
   * Migracao de quem ja tinha o chapeu antes de ele virar item.
   *
   * A flag `chapeu-ping-pong:<id>` era o jeito antigo. Ela nao manda mais em
   * nada; roda uma vez para o chapeu ganho ontem virar item hoje, e depois
   * disso o inventario e a unica verdade.
   */
  private migrarPremios(): void {
    for (const rig of [this.player.rig, this.parceiro.rig]) {
      const quem = rig.spec.id;
      if (!this.save.flag(`chapeu-ping-pong:${quem}`)) continue;
      if (this.save.achouItem(quem, ITENS.chapeuPingPong.id)) continue;
      this.save.vestir(quem, ITENS.chapeuPingPong);
    }
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
    const busy =
      this.ui.dialogueOpen ||
      this.ui.journalOpen ||
      this.ui.menuOpen ||
      this.ui.mochilaOpen ||
      this.transitioning;
    this.input.blocked = busy || this.player.locked;

    if (this.input.justPressed('KeyJ') && !this.ui.menuOpen) this.ui.toggleJournal();
    if (
      (this.input.justPressed('KeyI') || this.input.justPressed('Tab')) &&
      !this.ui.menuOpen &&
      !this.ui.dialogueOpen
    ) {
      if (this.ui.mochilaOpen) this.ui.closeMochila();
      else this.abrirMochila();
    }
    if (!busy && !this.player.locked && this.input.justPressed('KeyT')) this.swapCharacters();
    if (!busy) {
      if (this.input.justPressed('KeyQ')) this.iso.rotate(-1);
      if (this.input.justPressed('KeyR')) this.iso.rotate(1);
    }

    if (!busy && !this.player.locked && this.input.justPressed('KeyH')) this.maoNaMao();

    const acted = this.input.justPressed('KeyE') || this.input.justPressed('Space');
    if (acted && this.ui.handleAction()) {
      // o dialogo consumiu a tecla
    } else if (acted && !busy && this.hot && !this.player.locked) {
      // qualquer interacao do cenario solta as maos: nao da para abrir a
      // geladeira com as duas maos ocupadas
      this.maos.soltar(this.player, this.parceiro);
      this.audio.play('interagir');
      void this.hot.trigger(this);
    } else if (acted && !busy && this.podeBeijar && !this.player.locked) {
      this.maos.soltar(this.player, this.parceiro);
      this.beijo.iniciar(this.player, this.parceiro, this.iso.angle);
    } else if (acted && !busy && !this.player.locked) {
      // sem interativo por perto e sem estar de frente um para o outro, o E
      // vira o carinho de contexto: de lado a lado, da a mao. E o que permite
      // a mecanica existir no celular sem mais um botao na tela.
      this.maoNaMao();
    }

    // os dois rodam antes do movimento: sao eles que mandam nos corpos
    this.beijo.update(dt, this.player, this.parceiro);
    this.maos.update(dt, this.player, this.parceiro);

    // ---------------------------------------------------------- movimento
    const m = this.input.move();
    this.iso.screenToWorld(m.x, m.y, this.moveDir);
    const antes = this.player.position.clone();
    this.player.update(this.moveDir, dt, world.colliders, world.bounds);
    this.ouvirPassos(antes);
    this.parceiro.update(this.player.position, dt, world.colliders, world.bounds);

    this.coracoes.update(dt);
    this.sincronizarMaos();
    this.sincronizarVestiveis();

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

    this.renderer.render(this.scene, this.camOmbro ?? this.iso.camera);
    this.input.endFrame();
  };

  /**
   * O beijo esta ao alcance? Sem prompt na tela: carinho nao anuncia, e mais um
   * balao ali competindo com o dos interativos so polui. Quem nao souber
   * descobre na aba Controles do menu.
   */
  private updateBeijo(): void {
    this.podeBeijar =
      !this.ui.dialogueOpen &&
      !this.ui.journalOpen &&
      !this.ui.menuOpen &&
      !this.player.locked &&
      this.beijo.disponivel(this.player, this.parceiro);
  }

  /** Liga ou solta as maos. E o toggle, do H e do E de contexto. */
  private maoNaMao(): void {
    if (this.maos.ativo) {
      this.maos.soltar(this.player, this.parceiro);
      this.audio.play('escolha');
    } else if (this.maos.disponivel(this.player, this.parceiro)) {
      this.maos.ligar(this.player, this.parceiro);
    }
  }

  /**
   * Passo por distância andada, não por tempo: assim o som acompanha a
   * velocidade sozinho e não sai passo nenhum quando o jogador está parado.
   */
  private ouvirPassos(antes: THREE.Vector3): void {
    if (this.player.riding || this.player.locked) return;
    const andou = Math.hypot(this.player.position.x - antes.x, this.player.position.z - antes.z);
    if (andou < 0.0005) {
      this.trilha = 0;
      return;
    }
    this.trilha += andou;
    const passada = this.player.submersion > 0.05 ? 1.05 : 0.62;
    if (this.trilha >= passada) {
      this.trilha = 0;
      this.audio.play(this.player.submersion > 0.05 ? 'nadar' : 'passo');
    }
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
    this.audio.play('toast');
    this.ui.toast(text, icon);
  }

  som(nome: SomNome): void {
    this.audio.play(nome);
  }

  goTo(sceneId: string, entry?: string): void {
    if (this.transitioning) return;
    this.transitioning = true;
    this.audio.play('porta');
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

  /**
   * Troca a isométrica por uma perspectiva parada em `de`, olhando para `para`.
   *
   * Perspectiva (e não ortográfica) de propósito: num jogo em que a bolinha vem
   * na sua direção, é a convergência das linhas que diz se ela está perto ou
   * longe — em ortográfica a bolinha do outro lado da mesa tem exatamente o
   * mesmo tamanho da que está no seu nariz.
   */
  setCameraOmbro(de: THREE.Vector3 | null, para?: THREE.Vector3): void {
    if (!de) {
      this.camOmbro = null;
      return;
    }
    if (!this.camOmbro) {
      this.camOmbro = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 400);
    }
    this.camOmbro.aspect = window.innerWidth / window.innerHeight;
    this.camOmbro.position.copy(de);
    if (para) this.camOmbro.lookAt(para);
    this.camOmbro.updateProjectionMatrix();
  }

  pointer(): { x: number; y: number } {
    return this.input.pointer();
  }

  showPlacar(dados: { eu: string; ele: string; meus: number; dele: number } | null): void {
    this.ui.showPlacar(dados);
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

  // --------------------------------------------------------------- mochila
  // Cada personagem tem a sua. `quem` omitido = quem esta sendo controlado.
  // Nenhum item FAZ nada aqui: quem age e a cena, lendo `getActiveHandItem()`.

  addItem(item: ItemDef, quem = this.playerId()): Coleta {
    const como = this.save.pegar(quem, item);
    if (como === 'cheio') this.ui.toast('Mochila cheia', '🎒');
    if (como === 'mao' || como === 'guardado') this.repintarMochila();
    return como;
  }

  removeItem(id: string, quem = this.playerId()): boolean {
    const saiu = this.save.largar(quem, id);
    if (saiu) this.repintarMochila();
    return saiu;
  }

  hasItem(id: string, quem = this.playerId()): boolean {
    return this.save.achouItem(quem, id);
  }

  getActiveHandItem(quem = this.playerId()): ItemDef | null {
    return this.save.itemAtivo(quem);
  }

  setActiveHandSlot(indice: number, quem = this.playerId()): void {
    this.save.setSlotAtivo(quem, indice);
    this.repintarMochila();
  }

  activeHandSlot(quem = this.playerId()): number {
    return this.save.slotAtivo(quem);
  }

  equipWearable(item: ItemDef, slot?: number, quem = this.playerId()): boolean {
    const vestiu = this.save.vestir(quem, item, slot);
    if (vestiu) this.repintarMochila();
    return vestiu;
  }

  unequipWearable(slot: number, quem = this.playerId()): void {
    this.save.despir(quem, slot);
    this.repintarMochila();
  }

  moveItem(de: Vaga, para: Vaga, quem = this.playerId()): boolean {
    const mexeu = this.save.mover(quem, de, para);
    if (mexeu) this.repintarMochila();
    return mexeu;
  }

  handItems(quem = this.playerId()): ReadonlyArray<ItemDef | null> {
    return this.save.maos(quem);
  }

  wearables(quem = this.playerId()): ReadonlyArray<ItemDef | null> {
    return this.save.vestiveis(quem);
  }

  /** Joga fora o item de uma vaga. Nao volta de lugar nenhum. */
  private descartarDaVaga(de: Vaga): void {
    const quem = this.playerId();
    const vagas = de.lista === 'mao' ? this.save.maos(quem) : this.save.vestiveis(quem);
    const item = vagas[de.indice];
    if (!item) return;
    this.save.largar(quem, item.id);
    this.audio.play('escolha');
    this.ui.toast(`${item.nome} foi descartado`, '🗑');
    this.pintarMochila();
  }

  /** Redesenha as vagas. So custa alguma coisa com o painel aberto. */
  private repintarMochila(): void {
    if (!this.ui.mochilaOpen) return;
    this.pintarMochila();
  }

  private pintarMochila(): void {
    const quem = this.playerId();
    this.ui.renderMochila(
      this.save.maos(quem),
      this.save.vestiveis(quem),
      this.save.slotAtivo(quem),
      this.player.name,
    );
  }

  private abrirMochila(): void {
    // quem pinta e a propria Ui, ao abrir: assim o botao 🎒 do celular e a
    // tecla I passam exatamente pelo mesmo caminho
    this.ui.toggleMochila();
  }

  /**
   * Poe na mao de cada um o que estiver na vaga principal DELE.
   *
   * Roda todo quadro, mas so mexe em alguma coisa quando o id muda — e isso que
   * faz o T funcionar de graca: o modelo e filho do RIG, e o rig viaja junto com
   * a pessoa quando os corpos trocam de lugar.
   */
  /**
   * O chapeu de campeao aparece SE, E SO SE, estiver numa vaga de acessorio.
   *
   * E o que faz o arrastar valer para vestimenta tambem: tirou o chapeu da
   * vaga de acessorio na tela, ele sai da cabeca no mesmo quadro.
   */
  private sincronizarVestiveis(): void {
    for (const rig of [this.player.rig, this.parceiro.rig]) {
      const vestindo = this.save
        .vestiveis(rig.spec.id)
        .some((i) => i?.id === ITENS.chapeuPingPong.id);
      if (rig.campeao !== vestindo) rig.setCampeao(vestindo);
    }
  }

  private sincronizarMaos(): void {
    for (const rig of [this.player.rig, this.parceiro.rig]) {
      const quem = rig.spec.id;
      const item = this.save.itemAtivo(quem);
      const id = item?.id ?? null;
      if (this.naMao.get(quem) === id) continue;
      this.naMao.set(quem, id);
      rig.segurar(id ? modeloDoItem(id) : null, item?.holdPose ?? 'none');
    }
  }

  unlock(memory: Memory): void {
    if (this.save.addMemory(memory)) {
      this.audio.play('memoria');
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
    if (this.ui.dialogueOpen || this.ui.journalOpen || this.ui.menuOpen || this.player.locked) return false;
    return this.input.justPressed(code);
  }

  keyDown(code: string): boolean {
    if (this.ui.dialogueOpen || this.ui.journalOpen || this.ui.menuOpen || this.player.locked) return false;
    return this.input.isDown(code);
  }

  showCharge(valor: number | null): void {
    this.audio.carga(valor);
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

  playerId(): string {
    return this.player.rig.spec.id;
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
    this.maos.trocouCorpos(this.player, this.parceiro);
    this.audio.play('trocar');
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
    if (sentados) this.audio.play('sentar');
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
    if (this.camOmbro) {
      this.camOmbro.aspect = window.innerWidth / window.innerHeight;
      this.camOmbro.updateProjectionMatrix();
    }
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
