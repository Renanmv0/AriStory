import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { BUILD_WIDTH, type CharacterSpec } from './spec';

/**
 * Monta um personagem chibi (cabeca grande, corpo pequeno) a partir de uma
 * CharacterSpec e anima a caminhada. Nenhum arquivo de modelo envolvido:
 * tudo e primitiva, entao da para iterar o visual so mexendo na ficha.
 *
 * Convencao: o personagem olha para +Z quando rotation.y === 0.
 */
export class CharacterRig {
  readonly group = new THREE.Group();
  readonly spec: CharacterSpec;

  /** altura do topo da cabeca, util para posicionar baloes e camera */
  readonly headTop: number;

  private readonly body = new THREE.Group();
  private readonly head = new THREE.Group();
  private readonly armL = new THREE.Group();
  private readonly armR = new THREE.Group();
  private readonly legL = new THREE.Group();
  private readonly legR = new THREE.Group();
  private readonly blob: THREE.Mesh;

  private phase = 0;
  private bounce = 0;
  private targetFacing = 0;

  constructor(spec: CharacterSpec) {
    this.spec = spec;
    const h = spec.height;
    const w = BUILD_WIDTH[spec.build];

    const legH = h * 0.28;
    const torsoH = h * 0.3;
    const headR = h * 0.17;
    const hipY = legH;
    const shoulderY = legH + torsoH * 0.86;
    const halfShoulder = h * 0.1 * w;
    const armLen = h * 0.3;

    this.headTop = legH + torsoH + headR * 2.1;

    const skin = toon(spec.skin);
    const shirt = toon(spec.shirt);
    const pants = toon(spec.pants);
    const shoes = toon(spec.shoes);

    // ------------------------------------------------------------- pernas
    for (const [pivot, side] of [
      [this.legL, -1],
      [this.legR, 1],
    ] as const) {
      pivot.position.set(side * h * 0.055 * w, hipY, 0);
      const leg = new THREE.Mesh(
        new THREE.CapsuleGeometry(h * 0.042 * w, legH * 0.62, 4, 10),
        pants,
      );
      leg.position.y = -legH * 0.48;
      pivot.add(leg);

      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(h * 0.075 * w, h * 0.045, h * 0.11),
        shoes,
      );
      foot.position.set(0, -legH + h * 0.022, h * 0.018);
      pivot.add(foot);
      this.body.add(pivot);
    }

    // ------------------------------------------------------------- torso
    const torso = new THREE.Mesh(
      new THREE.CapsuleGeometry(h * 0.105 * w, torsoH * 0.5, 5, 12),
      shirt,
    );
    torso.position.y = hipY + torsoH * 0.52;
    torso.scale.z = 0.82;
    this.body.add(torso);

    if (spec.shirtAccent !== undefined) {
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(h * 0.108 * w, h * 0.108 * w, h * 0.03, 14, 1, true),
        toon(spec.shirtAccent, { doubleSide: true }),
      );
      stripe.position.y = hipY + torsoH * 0.72;
      stripe.scale.z = 0.82;
      this.body.add(stripe);
    }

    // ------------------------------------------------------------- bracos
    for (const [pivot, side] of [
      [this.armL, -1],
      [this.armR, 1],
    ] as const) {
      pivot.position.set(side * halfShoulder, shoulderY, 0);
      const sleeve = new THREE.Mesh(
        new THREE.CapsuleGeometry(h * 0.036 * w, armLen * 0.34, 4, 10),
        shirt,
      );
      sleeve.position.y = -armLen * 0.24;
      pivot.add(sleeve);

      const forearm = new THREE.Mesh(
        new THREE.CapsuleGeometry(h * 0.032 * w, armLen * 0.28, 4, 10),
        skin,
      );
      forearm.position.y = -armLen * 0.66;
      pivot.add(forearm);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(h * 0.04 * w, 10, 8), skin);
      hand.position.y = -armLen * 0.92;
      pivot.add(hand);
      this.body.add(pivot);
    }

    // ------------------------------------------------------------- cabeca
    this.head.position.y = legH + torsoH + headR * 0.92;

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(h * 0.035, h * 0.04, h * 0.05, 10),
      skin,
    );
    neck.position.y = -headR * 0.85;
    this.head.add(neck);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(headR, 20, 16), skin);
    skull.scale.set(1, 1.04, 0.94);
    this.head.add(skull);

    // olhos e bochechas ficam na frente (+Z)
    const eyeMat = toon(spec.eyes);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.14, 10, 8), eyeMat);
      eye.position.set(side * headR * 0.35, headR * 0.06, headR * 0.86);
      eye.scale.set(1, 1.25, 0.6);
      this.head.add(eye);

      const blush = new THREE.Mesh(new THREE.CircleGeometry(headR * 0.16, 12), flat(spec.blush, 0.75));
      blush.position.set(side * headR * 0.56, -headR * 0.22, headR * 0.8);
      blush.rotation.y = side * 0.35;
      this.head.add(blush);
    }

    const mouth = new THREE.Mesh(
      new THREE.TorusGeometry(headR * 0.16, headR * 0.035, 6, 14, Math.PI),
      eyeMat,
    );
    mouth.position.set(0, -headR * 0.34, headR * 0.86);
    mouth.rotation.set(0, 0, Math.PI);
    this.head.add(mouth);

    this.buildHair(headR);
    this.buildAccessories(headR, armLen, shoulderY, halfShoulder, torsoH, hipY, w);

    this.body.add(this.head);
    this.group.add(this.body);

    // sombra fofa desenhada, alem da sombra real do sol
    this.blob = new THREE.Mesh(
      new THREE.CircleGeometry(h * 0.16 * w, 18),
      flat(0x2b3a2b, 0.22),
    );
    this.blob.rotation.x = -Math.PI / 2;
    this.blob.position.y = 0.02;
    this.group.add(this.blob);

    this.group.traverse((n) => {
      if ((n as THREE.Mesh).isMesh && n !== this.blob) {
        n.castShadow = true;
        n.receiveShadow = false;
      }
    });
  }

  // ------------------------------------------------------------------ cabelo

  private buildHair(headR: number): void {
    const { style, color } = this.spec.hair;
    const mat = toon(color);

    const cap = (scale: number, y: number) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(headR * scale, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62),
        mat,
      );
      m.position.y = y;
      this.head.add(m);
      return m;
    };

    switch (style) {
      case 'raspado': {
        cap(1.02, headR * 0.02).scale.set(1, 0.82, 0.96);
        break;
      }
      case 'curto': {
        const c = cap(1.06, headR * 0.04);
        c.scale.set(1, 0.95, 0.98);
        const fringe = new THREE.Mesh(
          new THREE.BoxGeometry(headR * 1.5, headR * 0.34, headR * 0.42),
          mat,
        );
        fringe.position.set(0, headR * 0.6, headR * 0.62);
        fringe.rotation.x = -0.18;
        this.head.add(fringe);
        break;
      }
      case 'franja': {
        cap(1.07, headR * 0.02);
        const fringe = new THREE.Mesh(
          new THREE.CylinderGeometry(headR * 1.05, headR * 1.05, headR * 0.4, 18, 1, false, Math.PI * 0.15, Math.PI * 0.7),
          mat,
        );
        fringe.position.set(0, headR * 0.5, 0);
        this.head.add(fringe);
        break;
      }
      case 'ondulado': {
        cap(1.08, headR * 0.02);
        for (const side of [-1, 1]) {
          const lobe = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.46, 12, 10), mat);
          lobe.position.set(side * headR * 0.85, headR * 0.1, -headR * 0.1);
          lobe.scale.set(0.8, 1.15, 1);
          this.head.add(lobe);
        }
        break;
      }
      case 'coque': {
        cap(1.06, headR * 0.02);
        const bun = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.42, 12, 10), mat);
        bun.position.set(0, headR * 0.72, -headR * 0.82);
        this.head.add(bun);
        break;
      }
      case 'cacheado': {
        cap(0.98, headR * 0.02);
        const curls = 14;
        for (let i = 0; i < curls; i++) {
          const a = (i / curls) * Math.PI * 2;
          const ring = i % 2 === 0 ? 0.78 : 0.52;
          const curl = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.3, 8, 7), mat);
          curl.position.set(
            Math.cos(a) * headR * ring,
            headR * (0.42 + (i % 3) * 0.16),
            Math.sin(a) * headR * ring * 0.92,
          );
          this.head.add(curl);
        }
        break;
      }
    }
  }

  // -------------------------------------------------------------- acessorios

  private buildAccessories(
    headR: number,
    armLen: number,
    shoulderY: number,
    halfShoulder: number,
    torsoH: number,
    hipY: number,
    w: number,
  ): void {
    const acc = this.spec.accessories ?? [];
    const accMat = toon(this.spec.accessoryColor ?? 0x2f3440);

    if (acc.includes('oculos')) {
      for (const side of [-1, 1]) {
        const lens = new THREE.Mesh(
          new THREE.TorusGeometry(headR * 0.24, headR * 0.045, 8, 16),
          accMat,
        );
        lens.position.set(side * headR * 0.36, headR * 0.06, headR * 0.9);
        this.head.add(lens);
      }
      const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(headR * 0.3, headR * 0.05, headR * 0.05),
        accMat,
      );
      bridge.position.set(0, headR * 0.06, headR * 0.92);
      this.head.add(bridge);
    }

    if (acc.includes('bone')) {
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(headR * 1.1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
        accMat,
      );
      dome.position.y = headR * 0.1;
      this.head.add(dome);
      const visor = new THREE.Mesh(
        new THREE.CylinderGeometry(headR * 1.05, headR * 1.05, headR * 0.08, 16, 1, false, Math.PI * 0.15, Math.PI * 0.7),
        accMat,
      );
      visor.position.set(0, headR * 0.12, headR * 0.28);
      visor.rotation.x = -0.12;
      this.head.add(visor);
    }

    if (acc.includes('barba')) {
      const beard = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.72, 14, 12), toon(this.spec.hair.color));
      beard.position.set(0, -headR * 0.42, headR * 0.28);
      beard.scale.set(1, 0.72, 0.85);
      this.head.add(beard);
    }

    if (acc.includes('fone')) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(headR * 1.05, headR * 0.08, 8, 20, Math.PI), accMat);
      band.position.y = headR * 0.05;
      band.rotation.z = Math.PI / 2;
      band.rotation.y = Math.PI / 2;
      this.head.add(band);
      for (const side of [-1, 1]) {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(headR * 0.28, headR * 0.28, headR * 0.16, 12), accMat);
        cup.position.set(side * headR * 1.02, headR * 0.02, 0);
        cup.rotation.z = Math.PI / 2;
        this.head.add(cup);
      }
    }

    if (acc.includes('corrente')) {
      const chain = new THREE.Mesh(
        new THREE.TorusGeometry(headR * 0.42, headR * 0.035, 6, 20),
        toon(0xffc94d, { glow: 0.2 }),
      );
      chain.position.y = -headR * 0.95;
      chain.rotation.x = Math.PI / 2;
      this.head.add(chain);
    }

    if (acc.includes('relogio')) {
      const watch = new THREE.Mesh(
        new THREE.CylinderGeometry(this.spec.height * 0.035, this.spec.height * 0.035, this.spec.height * 0.018, 10),
        accMat,
      );
      watch.position.y = -armLen * 0.8;
      watch.rotation.z = Math.PI / 2;
      this.armL.add(watch);
    }

    if (acc.includes('mochila')) {
      const bag = new THREE.Mesh(
        new THREE.BoxGeometry(halfShoulder * 1.7, torsoH * 0.62, this.spec.height * 0.09),
        accMat,
      );
      bag.position.set(0, hipY + torsoH * 0.6, -this.spec.height * 0.11 * w);
      this.body.add(bag);
      const strapY = shoulderY;
      for (const side of [-1, 1]) {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(this.spec.height * 0.022, torsoH * 0.5, this.spec.height * 0.02),
          accMat,
        );
        strap.position.set(side * halfShoulder * 0.6, strapY - torsoH * 0.2, this.spec.height * 0.085 * w);
        this.body.add(strap);
      }
    }
  }

  // ------------------------------------------------------------------ animar

  /** angulo alvo em radianos; o rig gira suavemente ate la */
  setFacing(angle: number): void {
    this.targetFacing = angle;
  }

  get facing(): number {
    return this.group.rotation.y;
  }

  /** faz o personagem pular de alegria uma vez */
  cheer(): void {
    this.bounce = 1;
  }

  /**
   * @param dt delta em segundos
   * @param speed velocidade horizontal atual em unidades/s (0 = parado)
   */
  update(dt: number, speed: number): void {
    // giro suave para o angulo alvo, pelo caminho mais curto
    let delta = this.targetFacing - this.group.rotation.y;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    this.group.rotation.y += delta * Math.min(1, dt * 14);

    const walking = speed > 0.05;
    this.phase += dt * (walking ? 3.2 + speed * 1.9 : 1.4);

    const swing = walking ? Math.min(0.62, 0.16 + speed * 0.14) : 0.04;
    const s = Math.sin(this.phase * (walking ? 2 : 1));

    this.legL.rotation.x = walking ? s * swing : 0;
    this.legR.rotation.x = walking ? -s * swing : 0;
    this.armL.rotation.x = walking ? -s * swing * 0.85 : Math.sin(this.phase) * 0.05;
    this.armR.rotation.x = walking ? s * swing * 0.85 : -Math.sin(this.phase) * 0.05;
    this.armL.rotation.z = 0.08;
    this.armR.rotation.z = -0.08;

    // pulinho de comemoracao
    if (this.bounce > 0) {
      this.bounce = Math.max(0, this.bounce - dt * 1.6);
      const b = Math.sin((1 - this.bounce) * Math.PI) * 0.28;
      this.body.position.y = b;
      this.head.rotation.z = Math.sin((1 - this.bounce) * Math.PI * 2) * 0.12;
    } else {
      const bob = walking ? Math.abs(Math.cos(this.phase * 2)) * 0.035 : Math.sin(this.phase) * 0.012;
      this.body.position.y = bob;
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
    }

    this.body.rotation.x = walking ? 0.06 : 0;
    this.head.rotation.x = walking ? -0.05 : Math.sin(this.phase * 0.6) * 0.03;
  }

  dispose(): void {
    this.group.traverse((n) => {
      const mesh = n as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
  }
}
