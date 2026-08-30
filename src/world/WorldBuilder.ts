import * as THREE from 'three';
import { toon } from '../core/materials';
import { Interactable } from './Interactable';
import type { Bounds, Collider, GameAPI, InteractableDef } from '../core/types';
import { bench } from './props';

export type Updater = (dt: number, elapsed: number) => void;

export interface GroundOptions {
  width: number;
  depth: number;
  color: number;
  /** desloca o centro do chao */
  x?: number;
  z?: number;
  y?: number;
}

export interface DoorOptions {
  x: number;
  z: number;
  to: string;
  entry?: string;
  label: string;
  icon?: string;
  radius?: number;
  highlight?: THREE.Object3D;
}

/**
 * API que as cenas usam para montar o mundo. Uma cena recebe um WorldBuilder e
 * so chama metodos daqui: nada de mexer no renderer, na camera ou no loop.
 */
export class WorldBuilder {
  readonly root = new THREE.Group();
  readonly colliders: Collider[] = [];
  readonly interactables: Interactable[] = [];
  readonly updaters: Updater[] = [];
  bounds: Bounds = { minX: -40, minZ: -40, maxX: 40, maxZ: 40 };

  private seed = 1337;
  /** cada decalque de chao ganha um offset proprio, para nunca piscarem entre si */
  private decalque = 0;

  constructor(readonly game: GameAPI) {}

  // ---------------------------------------------------------------- objetos

  /** Adiciona ao mundo e liga sombra em tudo que for malha. */
  add<T extends THREE.Object3D>(...objs: T[]): T {
    for (const obj of objs) {
      obj.traverse((n) => {
        if ((n as THREE.Mesh).isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
        }
      });
      this.root.add(obj);
    }
    return objs[0];
  }

  /** Posiciona e roda um objeto em uma linha so. */
  place<T extends THREE.Object3D>(obj: T, x: number, y: number, z: number, rotY = 0): T {
    obj.position.set(x, y, z);
    obj.rotation.y = rotY;
    return obj;
  }

  // ----------------------------------------------------------------- chao

  ground(opts: GroundOptions): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(opts.width, opts.depth, 1, 1);
    const mesh = new THREE.Mesh(geo, toon(opts.color));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(opts.x ?? 0, opts.y ?? 0, opts.z ?? 0);
    mesh.receiveShadow = true;
    this.root.add(mesh);
    return mesh;
  }

  /**
   * Chao com buracos retangulares — piscina, poco, alcapao. Sem o furo o
   * personagem submerso desapareceria por baixo do plano do piso.
   */
  groundWithHoles(
    opts: GroundOptions & { holes: Array<{ x: number; z: number; width: number; depth: number }> },
  ): THREE.Mesh {
    const hw = opts.width / 2;
    const hd = opts.depth / 2;
    const forma = new THREE.Shape();
    forma.moveTo(-hw, -hd);
    forma.lineTo(hw, -hd);
    forma.lineTo(hw, hd);
    forma.lineTo(-hw, hd);
    forma.closePath();

    // a malha nasce no plano XY e e deitada com rotation.x = -PI/2,
    // o que faz mundoZ === -formaY: por isso o Z dos furos entra invertido
    for (const h of opts.holes) {
      const buraco = new THREE.Path();
      const x1 = h.x - h.width / 2;
      const x2 = h.x + h.width / 2;
      const y1 = -h.z - h.depth / 2;
      const y2 = -h.z + h.depth / 2;
      buraco.moveTo(x1, y1);
      buraco.lineTo(x2, y1);
      buraco.lineTo(x2, y2);
      buraco.lineTo(x1, y2);
      buraco.closePath();
      forma.holes.push(buraco);
    }

    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(forma), toon(opts.color));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(opts.x ?? 0, opts.y ?? 0, opts.z ?? 0);
    mesh.receiveShadow = true;
    this.root.add(mesh);
    return mesh;
  }

  /** Mancha de outra cor sobre o chao: caminho de terra, quadra, tapete. */
  patch(x: number, z: number, width: number, depth: number, color: number, rotY = 0, y = 0.01): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      toon(color, { offset: ++this.decalque }),
    );
    mesh.rotation.set(-Math.PI / 2, 0, 0);
    mesh.rotation.z = rotY;
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    this.root.add(mesh);
    return mesh;
  }

  /** Mancha redonda: lago, canteiro, sombra pintada. */
  disc(x: number, z: number, radius: number, color: number, y = 0.01): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 28),
      toon(color, { offset: ++this.decalque }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    this.root.add(mesh);
    return mesh;
  }

  // ------------------------------------------------------------- colisores

  blockBox(x: number, z: number, hw: number, hd: number, rot = 0): void {
    this.colliders.push({ kind: 'box', x, z, hw, hd, rot });
  }

  blockCircle(x: number, z: number, r: number): void {
    this.colliders.push({ kind: 'circle', x, z, r });
  }

  /** Deriva um colisor de caixa da bounding box do objeto (ja posicionado). */
  blockFrom(obj: THREE.Object3D, shrink = 0.9): void {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    this.blockBox(center.x, center.z, (size.x / 2) * shrink, (size.z / 2) * shrink, 0);
  }

  setBounds(minX: number, minZ: number, maxX: number, maxZ: number): void {
    this.bounds = { minX, minZ, maxX, maxZ };
  }

  /** Parede solida: malha + colisor, definida por dois pontos no chao. */
  wall(
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    height = 3,
    color = 0xf3e7d3,
    thickness = 0.3,
  ): THREE.Mesh {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    const rot = Math.atan2(dz, dx);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, height, thickness), toon(color));
    mesh.position.set((x1 + x2) / 2, height / 2, (z1 + z2) / 2);
    mesh.rotation.y = -rot;
    this.add(mesh);
    this.blockBox((x1 + x2) / 2, (z1 + z2) / 2, len / 2, thickness / 2, -rot);
    return mesh;
  }

  // ------------------------------------------------------------ interacoes

  interact(def: InteractableDef): Interactable {
    const it = new Interactable(def);
    this.interactables.push(it);
    return it;
  }

  /** Interativo que leva para outra cena. */
  door(opts: DoorOptions): Interactable {
    return this.interact({
      id: `door:${opts.to}:${opts.entry ?? 'default'}`,
      x: opts.x,
      z: opts.z,
      radius: opts.radius ?? 2,
      label: opts.label,
      icon: opts.icon ?? '🚪',
      highlight: opts.highlight,
      onInteract: (g) => g.goTo(opts.to, opts.entry),
    });
  }

  /**
   * Um banco em que a dupla senta JUNTA.
   *
   * A peca, o colisor, a ancora de sentar e a interacao saem daqui de uma vez:
   * "todo banco da para sentar" so e verdade se sentar nao depender de a cena
   * lembrar de escrever a interacao. Quem quiser um banco de enfeite usa
   * `bench()` direto.
   *
   * @param rot para onde o banco olha. 0 = encosto no -Z, assento para +Z.
   */
  banco(x: number, z: number, rot = 0, cor?: number): THREE.Group {
    const peca = this.add(this.place(bench(cor), x, 0, z, rot));
    this.blockBox(x, z, 0.95, 0.35, rot);

    /**
     * A ancora carrega os dois durante a cena de sentar; a rotacao mora nela,
     * entao os rigs entram com facing 0. O `+ Math.PI` esta ali porque
     * `ridePlayer` poe o rig virado para o -Z local da ancora — sem ele os dois
     * sentam de costas para quem olha.
     */
    const assento = new THREE.Object3D();
    assento.position.set(x, 0, z);
    assento.rotation.y = rot + Math.PI;
    this.root.add(assento);

    // Alvo da camera enquanto durar. Sentado, a posicao do jogador passa a ser
    // LOCAL a ancora, e a camera, que mira no peito dele, iria parar perto da
    // origem do mundo. Foi o que aconteceu na primeira tentativa.
    const foco = new THREE.Object3D();
    foco.position.set(x, 0.9, z);
    this.root.add(foco);

    /**
     * Altura em que o objeto do personagem entra na ancora.
     *
     * O assento do banco esta a 0,53 e o quadril do rig fica ~0,45 acima da
     * origem dele — daí este 0,06. Mais alto e a dupla flutua sobre a tabua.
     */
    const ALTURA = 0.06;
    /** meia distancia entre os dois no banco, que tem 1,9 de largura */
    const LADO = 0.46;

    this.interact({
      id: `banco:${x.toFixed(1)},${z.toFixed(1)}`,
      x, z, radius: 1.9,
      label: 'Sentar no banco', icon: '🪑',
      highlight: peca,
      onInteract: async (api) => {
        api.lockPlayer(true);
        api.ridePlayer(assento, new THREE.Vector3(-LADO, ALTURA, 0.02), 1, Math.PI);
        // os DOIS com o mesmo angulo: e o -Z local da ancora, que ja esta
        // girada para o encosto ficar atras deles
        api.rideCompanion(assento, new THREE.Vector3(LADO, ALTURA, 0.02), 1, Math.PI);
        api.setSitting(true);
        api.focusCamera(foco);
        await api.wait(0.5);

        // quem fala e quem esta em cena, e nao um nome cravado: banco e peca
        // generica, e a tecla T pode ter trocado os dois de lugar
        await api.say(['Senta aqui um pouco.'], api.companionName());
        await api.say(['Só um pouquinho.'], api.playerName());

        // fica sentado enquanto quiser: o `wait` deixa a tela livre, com os
        // dois de maos dadas e as pernas balancando
        let escolha = 0;
        while (escolha === 0) {
          escolha = await api.ask('Ficar mais um pouco?', ['Ficar', 'Levantar']);
          if (escolha === 0) await api.wait(4);
        }

        api.setSitting(false);
        api.focusCamera(null);
        // sai pela frente do banco, que e o lado do assento
        const frente = rot;
        const fx = Math.sin(frente) * 1.5;
        const fz = Math.cos(frente) * 1.5;
        api.releasePlayer(x + fx - Math.cos(frente) * 0.5, z + fz + Math.sin(frente) * 0.5, frente);
        api.releaseCompanion(x + fx + Math.cos(frente) * 0.5, z + fz - Math.sin(frente) * 0.5, frente);
        api.lockPlayer(false);
      },
    });
    return peca;
  }

  onUpdate(fn: Updater): void {
    this.updaters.push(fn);
  }

  // ----------------------------------------------------------------- utils

  /** Random deterministico: a mesma cena espalha as arvores sempre igual. */
  rng(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 0xffffffff;
  }

  setSeed(seed: number): void {
    this.seed = seed >>> 0;
  }

  range(min: number, max: number): number {
    return min + this.rng() * (max - min);
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.rng() * items.length) % items.length];
  }

  dispose(): void {
    this.root.traverse((n) => {
      const mesh = n as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
    this.root.clear();
    this.colliders.length = 0;
    this.interactables.length = 0;
    this.updaters.length = 0;
    this.decalque = 0;
  }
}
