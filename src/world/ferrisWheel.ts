import * as THREE from 'three';
import { toon, line } from '../core/materials';
import { PALETTE as P } from '../palette';

export interface FerrisWheelOptions {
  /** raio da roda em unidades de mundo (padrao 12) */
  radius?: number;
  /** quantidade de cabines (padrao 32) */
  cabins?: number;
  /** voltas por minuto */
  rpm?: number;
  cabinColor?: number;
  frameColor?: number;
}

/** Liga dois pontos com um cilindro: usado nas pernas e nos montantes. */
function strut(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.15, len, 8), material);
  mesh.position.copy(from).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

/**
 * A roda gigante do Villa Lobos, em versao fofa.
 * O aro gira em torno do eixo Z; as cabines ficam FORA do grupo que gira e sao
 * reposicionadas a cada frame, entao elas nunca viram de cabeca para baixo.
 * A roda inteira olha para +Z quando group.rotation.y === 0.
 */
export class FerrisWheel {
  readonly group = new THREE.Group();
  readonly cabins: THREE.Group[] = [];

  readonly radius: number;
  readonly hubHeight: number;
  /** velocidade angular em rad/s */
  speed: number;
  angle = 0;

  private readonly rim = new THREE.Group();
  private readonly cabinCount: number;

  constructor(opts: FerrisWheelOptions = {}) {
    const R = (this.radius = opts.radius ?? 12);
    const count = (this.cabinCount = opts.cabins ?? 32);
    this.speed = ((opts.rpm ?? 0.9) * Math.PI * 2) / 60;
    const frameMat = toon(opts.frameColor ?? P.metalWhite);
    const hubY = (this.hubHeight = R + 2.6);
    const spread = R * 0.075; // distancia entre os dois aros

    // ------------------------------------------------------------- aros
    for (const z of [-spread, spread]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R, R * 0.019, 8, 72), frameMat);
      ring.position.z = z;
      this.rim.add(ring);
    }

    // montantes entre os dois aros (a trelica que aparece na foto)
    const lattice = Math.min(48, count * 2);
    for (let i = 0; i < lattice; i++) {
      const a = (i / lattice) * Math.PI * 2;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(R * 0.012, R * 0.012, spread * 2), frameMat);
      bar.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      this.rim.add(bar);
    }

    // zigue-zague da trelica, desenhado como linha (barato e legivel)
    const zig: number[] = [];
    for (let i = 0; i < lattice; i++) {
      const a1 = (i / lattice) * Math.PI * 2;
      const a2 = ((i + 1) / lattice) * Math.PI * 2;
      const z1 = i % 2 === 0 ? -spread : spread;
      const z2 = i % 2 === 0 ? spread : -spread;
      zig.push(Math.cos(a1) * R, Math.sin(a1) * R, z1, Math.cos(a2) * R, Math.sin(a2) * R, z2);
    }
    this.rim.add(new THREE.LineSegments(buildLines(zig), line(0xdfe6ea)));

    // --------------------------------------------------------- cabos/raios
    const spokes: number[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const x = Math.cos(a) * R;
      const y = Math.sin(a) * R;
      spokes.push(0, 0, -spread * 0.5, x, y, -spread);
      spokes.push(0, 0, spread * 0.5, x, y, spread);
    }
    this.rim.add(new THREE.LineSegments(buildLines(spokes), line(0xeef3f6)));

    // ------------------------------------------------------------- cubo
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.085, R * 0.085, R * 0.3, 14), frameMat);
    hub.rotation.x = Math.PI / 2;
    this.rim.add(hub);
    for (const z of [-R * 0.17, R * 0.17]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.11, R * 0.07, R * 0.06, 14), toon(P.metalGrey));
      cap.rotation.x = Math.PI / 2;
      cap.position.z = z;
      this.rim.add(cap);
    }

    this.rim.position.y = hubY;
    this.group.add(this.rim);

    // ------------------------------------------------------------ cabines
    const cabinMat = toon(opts.cabinColor ?? P.metalWhite);
    const glassMat = toon(0x6fb6d8, { opacity: 0.5 });
    const pod = R * 0.068; // raio da capsula: cabe uma pessoa em escala de jogo
    for (let i = 0; i < count; i++) {
      const cabin = new THREE.Group();

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, pod * 1.1, 0.09), toon(P.metalGrey));
      arm.position.y = pod * 1.25;
      cabin.add(arm);

      const shell = new THREE.Mesh(new THREE.CapsuleGeometry(pod, pod * 0.5, 5, 16), cabinMat);
      shell.scale.set(1, 1, 0.92);
      cabin.add(shell);

      const band = new THREE.Mesh(new THREE.CylinderGeometry(pod * 1.02, pod * 1.02, pod * 0.95, 18, 1, true), glassMat);
      band.position.y = pod * 0.12;
      band.scale.z = 0.92;
      cabin.add(band);

      cabin.traverse((n) => {
        if ((n as THREE.Mesh).isMesh) n.castShadow = true;
      });
      this.cabins.push(cabin);
      this.group.add(cabin);
    }

    // ------------------------------------------------------------- pernas
    const legSpan = R * 0.42;
    const hubFront = new THREE.Vector3(0, hubY, -R * 0.04);
    const hubBack = new THREE.Vector3(0, hubY, R * 0.04);
    const feet: Array<[THREE.Vector3, THREE.Vector3]> = [
      [hubFront, new THREE.Vector3(-R * 0.2, 0, -legSpan)],
      [hubFront, new THREE.Vector3(R * 0.2, 0, -legSpan)],
      [hubBack, new THREE.Vector3(-R * 0.2, 0, legSpan)],
      [hubBack, new THREE.Vector3(R * 0.2, 0, legSpan)],
    ];
    for (const [a, b] of feet) {
      const leg = strut(a.clone(), b.clone(), R * 0.03, frameMat);
      leg.castShadow = true;
      this.group.add(leg);
    }

    // travessa entre as pernas
    for (const z of [-legSpan, legSpan]) {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(R * 0.42, R * 0.022, R * 0.022), frameMat);
      cross.position.set(0, R * 0.16, z);
      this.group.add(cross);
    }

    // ------------------------------------------------- base e contrapesos
    const base = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.62, R * 0.67, 0.35, 26), toon(P.concrete));
    base.position.y = 0.16;
    base.receiveShadow = true;
    this.group.add(base);

    const dx = R * 0.4;
    const dz = legSpan * 0.92;
    for (const [x, z] of [[-dx, -dz], [dx, -dz], [-dx, dz], [dx, dz]] as const) {
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.055, R * 0.055, R * 0.16, 12), toon(P.metalRed));
      drum.position.set(x, R * 0.08, z);
      drum.castShadow = true;
      this.group.add(drum);
    }

    // cabine de embarque
    const dock = new THREE.Mesh(new THREE.BoxGeometry(R * 0.55, 0.55, R * 0.3), toon(P.metalGrey));
    dock.position.set(0, 0.4, legSpan * 0.9);
    dock.castShadow = true;
    dock.receiveShadow = true;
    this.group.add(dock);

    const toldo = new THREE.Mesh(
      new THREE.CylinderGeometry(R * 0.13, R * 0.13, R * 0.34, 14, 1, false, 0, Math.PI),
      toon(P.fabricRed),
    );
    toldo.position.set(0, 1.9, legSpan * 0.9);
    toldo.rotation.set(0, 0, Math.PI / 2);
    toldo.scale.z = 0.6;
    this.group.add(toldo);
    for (const x of [-R * 0.15, R * 0.15]) {
      const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), toon(P.metalWhite));
      poste.position.set(x, 0.9, legSpan * 0.9);
      this.group.add(poste);
    }

    this.layout();
  }

  /** angulo (rad) da cabine i no plano da roda */
  private cabinAngle(i: number): number {
    return this.angle + (i / this.cabinCount) * Math.PI * 2;
  }

  private layout(): void {
    for (let i = 0; i < this.cabins.length; i++) {
      const a = this.cabinAngle(i);
      this.cabins[i].position.set(
        Math.cos(a) * this.radius,
        this.hubHeight + Math.sin(a) * this.radius,
        0,
      );
    }
  }

  update(dt: number): void {
    this.angle += this.speed * dt;
    this.rim.rotation.z = this.angle;
    this.layout();
  }

  /** A cabine que esta passando mais perto do ponto de embarque (embaixo). */
  boardingCabin(): THREE.Group {
    let best = this.cabins[0];
    let bestY = Infinity;
    for (const cabin of this.cabins) {
      if (cabin.position.y < bestY) {
        bestY = cabin.position.y;
        best = cabin;
      }
    }
    return best;
  }

  /** Quantas voltas a cabine ja deu desde `fromAngle`. */
  turnsSince(fromAngle: number): number {
    return (this.angle - fromAngle) / (Math.PI * 2);
  }
}

function buildLines(points: number[]): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geo;
}
