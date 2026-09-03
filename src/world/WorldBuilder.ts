import * as THREE from 'three';
import { toon } from '../core/materials';
import { Interactable } from './Interactable';
import type { Bounds, Collider, GameAPI, InteractableDef } from '../core/types';
import { bench, picnicTable } from './props';

export type Updater = (dt: number, elapsed: number) => void;

/**
 * A PILHA DO CHAO MORA ABAIXO DE ZERO.
 *
 * Toda peca do kit nasce com a base em `y = 0` — e o contrato do kit. O chao e
 * as manchas dele estavam em `y >= 0`, e isso dava dois defeitos que so viraram
 * visiveis quando o chao ganhou textura:
 *
 *  1. o chao de base ficava no MESMO plano da base de cada arvore, poste, banco
 *     e cerca. Dois planos iguais e a definicao de z-fighting; enquanto os dois
 *     eram verde chapado, a briga dava verde e ninguem via.
 *  2. pior: o decalque (o caminho de asfalto, a calcada, as manchas de grama) e
 *     desenhado DEPOIS do mundo solido e fica ACIMA da base das pecas — a
 *     calcada em `y = 0,012` pintava por cima dos 12 mm de baixo de todo poste
 *     plantado nela. Com a calcada texturizada, essa faixa passou a ter desenho
 *     e virou chiado no pe da peca.
 *
 * A correcao poe a pilha inteira abaixo de zero: o chao de base no fundo, os
 * decalques numa faixa fina acima dele, e `y = 0` livre para as pecas. Quem
 * decide a ordem de pintura entre decalques continua sendo o `renderOrder` (eles
 * nao gravam profundidade), entao comprimir o `y` deles nao muda nada.
 *
 * A faixa e MINUSCULA de proposito: 6 mm do fundo ate o topo. Uma pessoa tem
 * 1,75, e a camera isometrica projeta 6 mm em menos de meio pixel — ninguem ve
 * a peca flutuar, e nao ha mais plano compartilhado.
 */
const CHAO_FUNDO = 0.006;
const DECALQUE_TETO = 0.001;
const DECALQUE_PASSO = 0.00004;

export interface GroundOptions {
  width: number;
  depth: number;
  color: number;
  /** desloca o centro do chao */
  x?: number;
  z?: number;
  y?: number;
  /**
   * Textura de superficie, das pintadas em `world/texturasDeChao.ts`.
   *
   * Ela MULTIPLICA a `color`, entao o desenho tem que ser quase branco. E o
   * tamanho do azulejo ja vem embutido no `repeat` dela: `ShapeGeometry` gera
   * UV em unidades de mundo, e `PlaneGeometry` em 0..1, entao o `ground()`
   * ajusta o repeat pelo tamanho do chao e o `groundWithHoles()` nao precisa.
   */
  textura?: THREE.Texture;
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
  /**
   * Ordem de pintura dos decalques de chao. Eles nao gravam profundidade (ver
   * `ToonOptions.decal`), entao nao ha disputa de pixel entre eles: quem for
   * criado depois e desenhado depois e fica por cima. E por isso que a cena
   * deve montar o chao de baixo para cima — grama, depois a mancha de terra,
   * depois a linha pintada em cima da mancha.
   *
   * Comeca em 1 porque `renderOrder` 0 e o resto do mundo: o decalque precisa
   * vir depois dele para ser tapado corretamente pelo personagem e pelos moveis.
   */
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

  /**
   * Um chao empilhado sobre outro (o deck do clube sobre a grama) e decalque
   * como qualquer outro: sem isto a briga acontece no piso inteiro, e nao so
   * numa linha pintada.
   */
  private chaoAcimaDeOutro(y: number | undefined): boolean {
    return (y ?? 0) > 0;
  }

  /**
   * O chao de base afunda 5 mm.
   *
   * TODA peca do kit nasce com a base em `y = 0` — e o contrato do kit. O chao
   * tambem estava em `y = 0`, entao o tronco de cada arvore, o pe de cada
   * poste, de cada banco e de cada cerca dividia EXATAMENTE o plano do chao.
   * Duas superficies no mesmo plano e a definicao de z-fighting, e a regra do
   * projeto proibe isso desde sempre — dentro das pecas, o `zfighting.mjs` ja
   * cacava; entre peca e chao, ninguem estava olhando.
   *
   * Isso nunca apareceu enquanto o chao era uma cor chapada: dois verdes iguais
   * brigando dao um verde igual. Com a grama texturizada, o vencedor de cada
   * pixel passou a ter desenho, e a briga virou chiado na base das pecas — pior
   * ainda em tela de celular, cujo buffer de profundidade e bem mais pobre.
   *
   * 5 mm resolve por construcao e nao custa nada: uma pessoa tem 1,75, e a
   * camera isometrica projeta esses 5 mm em menos de um terco de pixel. Nao da
   * para ver a peca flutuar, e nao ha mais plano compartilhado.
   */
  private afundarChaoDeBase(y: number | undefined): number {
    return (y ?? 0) > 0 ? -DECALQUE_TETO - this.decalque * DECALQUE_PASSO : -CHAO_FUNDO;
  }

  /**
   * Uma copia da textura com o `repeat` corrigido para UV normalizado.
   *
   * E COPIA, e nao a textura original: ela e compartilhada entre as cenas, e
   * mexer no `repeat` dela aqui mudaria o chao de todo mundo. `clone()` de
   * textura divide a mesma imagem na GPU, entao a copia nao custa memoria.
   */
  private escalarPeloChao(tex: THREE.Texture, largura: number, profundidade: number): THREE.Texture {
    const copia = tex.clone();
    copia.needsUpdate = true;
    copia.repeat.set(tex.repeat.x * largura, tex.repeat.y * profundidade);
    return copia;
  }

  ground(opts: GroundOptions): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(opts.width, opts.depth, 1, 1);
    const empilhado = this.chaoAcimaDeOutro(opts.y);
    // `PlaneGeometry` da UV de 0 a 1, e nao em metros como o `ShapeGeometry`:
    // aqui o repeat precisa ser multiplicado pelo tamanho do chao para o
    // azulejo sair do mesmo tamanho nos dois caminhos
    const mapa = opts.textura ? this.escalarPeloChao(opts.textura, opts.width, opts.depth) : undefined;
    const mesh = new THREE.Mesh(geo, toon(opts.color, { decal: empilhado, mapa }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(opts.x ?? 0, this.afundarChaoDeBase(opts.y), opts.z ?? 0);
    if (empilhado) return this.decalar(mesh);
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

    const empilhado = this.chaoAcimaDeOutro(opts.y);
    const mesh = new THREE.Mesh(
      new THREE.ShapeGeometry(forma),
      toon(opts.color, { decal: empilhado, mapa: opts.textura }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(opts.x ?? 0, this.afundarChaoDeBase(opts.y), opts.z ?? 0);
    if (empilhado) return this.decalar(mesh);
    mesh.receiveShadow = true;
    this.root.add(mesh);
    return mesh;
  }

  /**
   * Registra a malha como decalque de chao: entra na fila de pintura depois do
   * mundo solido e na ordem em que a cena a criou.
   *
   * O `y` continua existindo por gosto (é bom ler a pilha do chao no codigo),
   * mas nao e mais ele que decide quem fica por cima — e a ordem de criacao.
   */
  private decalar(mesh: THREE.Mesh): THREE.Mesh {
    mesh.renderOrder = ++this.decalque;
    // e o `renderOrder` que decide quem fica por cima, entao o `y` do decalque
    // so precisa caber na faixa abaixo das pecas — ver `afundarChaoDeBase`
    mesh.position.y = -DECALQUE_TETO - this.decalque * DECALQUE_PASSO;
    mesh.receiveShadow = true;
    this.root.add(mesh);
    return mesh;
  }

  /**
   * Mancha de outra cor sobre o chao: caminho de terra, quadra, tapete.
   *
   * `textura` e opcional e serve para a mancha que e PISO, e nao tinta — a
   * calcada do parque. `PlaneGeometry` da UV de 0 a 1, entao o repeat entra
   * corrigido pelo tamanho da mancha.
   */
  patch(
    x: number, z: number, width: number, depth: number, color: number,
    rotY = 0, y = 0.01, textura?: THREE.Texture,
  ): THREE.Mesh {
    const mapa = textura ? this.escalarPeloChao(textura, width, depth) : undefined;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), toon(color, { decal: true, mapa }));
    mesh.rotation.set(-Math.PI / 2, 0, 0);
    mesh.rotation.z = rotY;
    mesh.position.set(x, y, z);
    return this.decalar(mesh);
  }

  /**
   * Mancha redonda: lago, canteiro, sombra pintada, praca.
   *
   * O UV do `CircleGeometry` tambem vai de 0 a 1, mas espalhado sobre o
   * QUADRADO que envolve o circulo — por isso o repeat sai do DIAMETRO, e nao
   * do raio. Com o raio o azulejo sairia com o dobro do tamanho.
   */
  disc(x: number, z: number, radius: number, color: number, y = 0.01, textura?: THREE.Texture): THREE.Mesh {
    const mapa = textura ? this.escalarPeloChao(textura, radius * 2, radius * 2) : undefined;
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 28), toon(color, { decal: true, mapa }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    return this.decalar(mesh);
  }

  /** Anel pintado no chao: circulo central da quadra, marca de mira, poca. */
  ring(x: number, z: number, raio: number, largura: number, color: number, y = 0.01): THREE.Mesh {
    const geo = new THREE.RingGeometry(Math.max(0, raio - largura), raio, 40);
    const mesh = new THREE.Mesh(geo, toon(color, { decal: true }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    return this.decalar(mesh);
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

  /**
   * Uma mesa de piquenique em que a dupla senta UM DE FRENTE PARA O OUTRO.
   *
   * A diferença para o `banco()` é o que os dois olham. No banco eles sentam
   * lado a lado, com o mesmo `facing`; aqui cada um pega um dos dois assentos e
   * os `facing` são OPOSTOS — `PI` para quem senta no `+Z` da âncora e `0` para
   * quem senta no `-Z`. É o `facing` do `ridePlayer` que resolve isso, e não a
   * rotação da âncora: a âncora é uma só, e ela não pode olhar para dois lados.
   *
   * @param rot para onde o comprimento da mesa aponta. Com `0` os dois sentam
   *   em `±Z` e a mesa se estende em X.
   */
  mesaDePiquenique(x: number, z: number, rot = 0): THREE.Group {
    const peca = this.add(this.place(picnicTable(), x, 0, z, rot));
    this.blockBox(x, z, 1.05, 0.75, rot);

    const assento = new THREE.Object3D();
    assento.position.set(x, 0, z);
    assento.rotation.y = rot;
    this.root.add(assento);

    const foco = new THREE.Object3D();
    foco.position.set(x, 0.95, z);
    this.root.add(foco);

    /**
     * Altura do rig dentro da âncora.
     *
     * A tábua do assento tem o topo em 0,49 e o banco de praça, em 0,53, pedia
     * `0,06` — daí este `0,02`: a diferença entre os dois assentos. O quadril do
     * rig fica ~0,45 acima da origem dele.
     */
    const ALTURA = 0.02;
    /** distância do centro até cada tábua de assento */
    const BANCO = 0.78;

    this.interact({
      id: `piquenique:${x.toFixed(1)},${z.toFixed(1)}`,
      x, z, radius: 2.1,
      label: 'Sentar na mesa', icon: '🧺',
      highlight: peca,
      onInteract: async (api) => {
        api.lockPlayer(true);
        api.ridePlayer(assento, new THREE.Vector3(0, ALTURA, BANCO), 1, Math.PI);
        api.rideCompanion(assento, new THREE.Vector3(0, ALTURA, -BANCO), 1, 0);
        api.setSitting(true);
        api.focusCamera(foco);
        await api.wait(0.5);

        // mesa é peça genérica: quem fala é quem está em cena, porque o T pode
        // ter trocado os dois de lugar
        await api.say(['De frente pra você é melhor.'], api.companionName());
        await api.say(['É. Dá pra ver você falando.'], api.playerName());

        let escolha = 0;
        while (escolha === 0) {
          escolha = await api.ask('Ficar mais um pouco?', ['Ficar', 'Levantar']);
          if (escolha === 0) await api.wait(4);
        }

        api.setSitting(false);
        api.focusCamera(null);
        // cada um sai para trás do SEU banco, e vira para a mesa
        const dx = Math.sin(rot);
        const dz = Math.cos(rot);
        api.releasePlayer(x + dx * 1.7, z + dz * 1.7, rot + Math.PI);
        api.releaseCompanion(x - dx * 1.7, z - dz * 1.7, rot);
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
