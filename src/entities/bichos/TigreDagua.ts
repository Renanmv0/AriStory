import * as THREE from 'three';
import { toon } from '../../core/materials';
import { fundir } from '../../world/fundir';
import { PALETTE as P } from '../../palette';
import { novaTextura, sorteio } from '../../world/texturasDeChao';

/**
 * O CASCO: as placas desenhadas em canvas, vistas de cima — a fileira do meio,
 * as duas dos lados e a beirada —, com o risco amarelo dentro de cada placa,
 * que é a marca do tigre-d'água. O UV do casco é projetado de cima (ver
 * `cascoComUV`), então o desenho é o casco visto do alto.
 */
function desenhoDoCasco(): THREE.CanvasTexture {
  return novaTextura('casco-do-tigre-dagua', 1, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const c = s / 2;
    const rnd = sorteio(808);
    // a beirada: o anel de placinhas da borda
    ctx.strokeStyle = 'rgba(40,58,26,0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(c, c, s * 0.4, s * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(a) * s * 0.4, c + Math.sin(a) * s * 0.42);
      ctx.lineTo(c + Math.cos(a) * s * 0.5, c + Math.sin(a) * s * 0.5);
      ctx.stroke();
    }
    // a fileira do meio (cinco placas) e as duas dos lados (quatro cada)
    const placas: Array<[number, number, number, number]> = [];
    for (let i = 0; i < 5; i++) placas.push([c, s * (0.16 + i * 0.17), s * 0.12, s * 0.085]);
    for (const lado of [-1, 1]) for (let i = 0; i < 4; i++) placas.push([c + lado * s * 0.24, s * (0.24 + i * 0.17), s * 0.11, s * 0.085]);
    for (const [x, y, rx, ry] of placas) {
      ctx.strokeStyle = 'rgba(40,58,26,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let k = 0; k <= 6; k++) {
        const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
        const px = x + Math.cos(a) * rx;
        const py = y + Math.sin(a) * ry;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // o risco amarelo dentro da placa
      ctx.strokeStyle = 'rgba(224,198,90,0.75)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x - rx * 0.6, y + (rnd() - 0.5) * ry);
      ctx.quadraticCurveTo(x, y + (rnd() - 0.5) * ry * 1.6, x + rx * 0.6, y + (rnd() - 0.5) * ry);
      ctx.stroke();
    }
  }, 256);
}

/** a cúpula do casco com o UV projetado de cima (o desenho é o casco visto do alto) */
function cascoComUV(rx: number, ry: number, rz: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  geo.scale(rx, ry, rz);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / (rx * 2) + 0.5, 0.5 - pos.getZ(i) / (rz * 2));
  }
  return geo;
}

type Fazendo = 'sol' | 'pulando' | 'nadando' | 'subindo';

/** um lugar no tronco: onde ela fica, para onde olha, e de onde ela sobe da água */
export interface LugarNoTronco {
  x: number;
  y: number;
  z: number;
  olhando: number;
}

const PULO = 0.65;
const SUBIDA = 1.5;
/** quanto o corpo afunda nadando: só a cabeça fica de fora */
const NADANDO_Y = -0.1;

/**
 * UM TIGRE-D'ÁGUA, o cágado de casco verde com risco amarelo e a cabeça de
 * listras laranja que todo lago de parque de São Paulo tem tomando sol num
 * tronco.
 *
 * Quatro estados, e quem decide é a cena (`assustar`, `podeVoltar`):
 *
 *  - **sol**: no tronco, de pescoço esticado e patas abertas, virando a
 *    cabeça devagar — e de vez em quando esticando a pata de trás;
 *  - **pulando**: escorrega para a frente e cai n'água ("ploc"): a cena ganha
 *    a marola por `aoCair`;
 *  - **nadando**: debaixo d'água, só a cabecinha de fora, dando voltas perto
 *    do tronco (a água desenha o rastro dela);
 *  - **subindo**: volta ao lugar dela e sobe no tronco, se arrastando.
 */
export class TigreDagua {
  readonly group = new THREE.Group();
  private readonly casco = new THREE.Group();
  private readonly pescoco = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly patas: THREE.Mesh[] = [];
  private fazendo: Fazendo = 'sol';
  private t = 0;
  private fase: number;
  /** a dupla foi embora: ela pode voltar ao tronco */
  private voltar = false;
  private readonly lugar: LugarNoTronco;
  /** o centro da volta que ela dá nadando */
  private readonly centroDaVolta: { x: number; z: number };
  private anguloDaVolta = 0;
  private sentido: number;
  private readonly de = new THREE.Vector3();
  private velocidadeAgora = 0;
  private readonly antes = new THREE.Vector3();
  /** a cena liga aqui a marola e o "ploc" */
  aoCair: ((x: number, z: number) => void) | null = null;

  constructor(lugar: LugarNoTronco, centroDaVolta: { x: number; z: number }, semente: number) {
    this.lugar = lugar;
    this.centroDaVolta = centroDaVolta;
    this.fase = (semente % 97) * 0.37;
    this.sentido = semente % 2 ? 1 : -1;
    this.montar();
    this.group.userData.peca = 'tigre-dagua';
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    this.group.position.set(lugar.x, lugar.y, lugar.z);
    this.group.rotation.y = lugar.olhando;
    this.antes.copy(this.group.position);
  }

  get x(): number {
    return this.group.position.x;
  }
  get z(): number {
    return this.group.position.z;
  }
  get naAgua(): boolean {
    return this.fazendo === 'nadando';
  }
  get noTronco(): boolean {
    return this.fazendo === 'sol';
  }
  get velocidade(): number {
    return this.velocidadeAgora;
  }
  get fazendoAgora(): Fazendo {
    return this.fazendo;
  }

  private montar(): void {
    const casco = new THREE.Mesh(cascoComUV(0.13, 0.068, 0.16), toon(P.tigreDaguaCasco, { mapa: desenhoDoCasco() }));
    casco.position.y = 0.012;
    this.casco.add(casco);
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.016, 22), toon(P.tigreDaguaCascoEscuro));
    aba.scale.set(0.134, 1, 0.164);
    aba.position.y = 0.006;
    this.casco.add(aba);
    const barriga = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.012, 18), toon(P.tigreDaguaListra));
    barriga.scale.set(0.11, 1, 0.14);
    barriga.position.y = -0.004;
    this.casco.add(barriga);

    const pele = toon(P.tigreDaguaPele);
    const risco = toon(P.tigreDaguaRisco);
    // as quatro patas, saindo por baixo da aba
    for (const [lx, lz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]] as const) {
      const pata = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), pele);
      pata.scale.set(0.035, 0.014, 0.055);
      pata.position.set(lx * 0.115, 0.0, lz * 0.1);
      pata.rotation.y = lx * lz * 0.6;
      this.patas.push(pata);
      this.casco.add(pata);
    }
    const rabo = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 6), pele);
    rabo.rotation.x = -Math.PI / 2;
    rabo.position.set(0, 0.002, -0.17);
    this.casco.add(rabo);

    // o pescoço sai da frente do casco; a cabeça na ponta dele
    const colo = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.08, 8), pele);
    colo.rotation.x = Math.PI / 2;
    colo.position.z = 0.04;
    this.pescoco.add(colo);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 8), pele);
    cranio.scale.set(0.85, 0.75, 1.25);
    this.cabeca.add(cranio);
    for (const lado of [-1, 1]) {
      // as listras laranja do lado da cabeça (o "tigre" do nome)
      const listra = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 5), risco);
      listra.scale.set(0.006, 0.007, 0.03);
      listra.position.set(lado * 0.025, 0.002, -0.005);
      listra.rotation.y = lado * 0.15;
      this.cabeca.add(listra);
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 4), toon(P.pragaPupila));
      olho.position.set(lado * 0.02, 0.01, 0.022);
      this.cabeca.add(olho);
    }
    this.cabeca.position.z = 0.085;
    this.pescoco.add(this.cabeca);
    this.pescoco.position.set(0, 0.02, 0.13);
    this.casco.add(this.pescoco);
    this.group.add(this.casco);
    this.casco.name = 'casco';
    this.pescoco.name = 'pescoco';
    this.cabeca.name = 'cabeca';
    for (const p of this.patas) p.name = 'pata';
    fundir(this.group);
  }

  /** a dupla chegou: pula n'água daqui a `atraso` segundos (uma de cada vez) */
  assustar(atraso: number): void {
    if (this.fazendo !== 'sol') return;
    this.fazendo = 'pulando';
    this.t = -atraso;
    this.de.copy(this.group.position);
  }

  /**
   * Pode voltar ao tronco: a dupla foi embora. Ela nada mais um pouquinho
   * (cada uma no seu tempo) e sobe.
   */
  podeVoltar(pode = true): void {
    this.voltar = pode;
  }

  update(dt: number): void {
    this.fase += dt;
    this.t += dt;
    const ph = this.fase;
    const g = this.group.position;
    switch (this.fazendo) {
      case 'sol': {
        // a cabeça vira devagar; o pescoço espicha e encolhe com a respiração
        this.cabeca.rotation.y = Math.sin(ph * 0.35) * 0.45;
        this.cabeca.rotation.x = -0.15 + Math.sin(ph * 0.5) * 0.05;
        this.pescoco.scale.z = 1 + Math.sin(ph * 0.6) * 0.06;
        // a pata de trás esticada para trás, tomando sol (vem e vai)
        const estica = Math.max(0, Math.sin(ph * 0.22));
        this.patas[2].position.z = -0.1 - estica * 0.05;
        this.patas[3].position.z = -0.1 - estica * 0.04;
        this.casco.rotation.x = 0;
        this.casco.position.y = Math.sin(ph * 0.9) * 0.002;
        break;
      }
      case 'pulando': {
        if (this.t < 0) break;
        const k = Math.min(1, this.t / PULO);
        const frente = new THREE.Vector3(Math.sin(this.lugar.olhando), 0, Math.cos(this.lugar.olhando));
        g.set(
          this.de.x + frente.x * 0.45 * k,
          this.de.y + (NADANDO_Y - this.de.y) * k + Math.sin(k * Math.PI) * 0.08,
          this.de.z + frente.z * 0.45 * k,
        );
        this.casco.rotation.x = 0.55 * Math.sin(k * Math.PI);
        // o pescoço recolhe no susto
        this.pescoco.scale.z = 1 - 0.5 * Math.sin(k * Math.PI);
        if (k >= 1) {
          this.fazendo = 'nadando';
          this.t = 0;
          this.voltar = false;
          this.casco.rotation.x = 0;
          this.anguloDaVolta = Math.atan2(g.z - this.centroDaVolta.z, g.x - this.centroDaVolta.x);
          this.aoCair?.(g.x, g.z);
        }
        break;
      }
      case 'nadando': {
        // a volta perto do tronco, só a cabeça de fora
        this.anguloDaVolta += this.sentido * dt * 0.22;
        const raio = 1.1 + Math.sin(ph * 0.3) * 0.25;
        const alvoX = this.centroDaVolta.x + Math.cos(this.anguloDaVolta) * raio;
        const alvoZ = this.centroDaVolta.z + Math.sin(this.anguloDaVolta) * raio;
        // cada uma nada um tanto antes de voltar (a fase dela decide quanto)
        const voltando = this.voltar && this.t > 7 + (this.sentido > 0 ? 2.5 : 0);
        const ax = voltando ? this.pertoDoLugar().x : alvoX;
        const az = voltando ? this.pertoDoLugar().z : alvoZ;
        const dx = ax - g.x;
        const dz = az - g.z;
        const d = Math.hypot(dx, dz);
        if (d > 0.02) {
          const rumo = Math.atan2(dx, dz);
          let giro = rumo - this.group.rotation.y;
          while (giro > Math.PI) giro -= Math.PI * 2;
          while (giro < -Math.PI) giro += Math.PI * 2;
          this.group.rotation.y += giro * Math.min(1, dt * 2.5);
          const anda = Math.min(d, dt * 0.28);
          g.x += Math.sin(this.group.rotation.y) * anda;
          g.z += Math.cos(this.group.rotation.y) * anda;
        }
        g.y = NADANDO_Y + Math.sin(ph * 1.7) * 0.006;
        // a cabeça erguida para ficar de fora d'água
        this.pescoco.scale.z = 1;
        this.casco.rotation.x = -0.32;
        this.cabeca.rotation.x = 0.3;
        this.cabeca.rotation.y = Math.sin(ph * 0.8) * 0.2;
        // as patas remando
        for (let i = 0; i < 4; i++) this.patas[i].rotation.x = Math.sin(ph * 5 + i * 1.6) * 0.5;
        if (voltando && d < 0.05) {
          this.fazendo = 'subindo';
          this.t = 0;
          this.de.copy(g);
        }
        break;
      }
      case 'subindo': {
        const k = Math.min(1, this.t / SUBIDA);
        const s = k * k * (3 - 2 * k);
        g.set(
          this.de.x + (this.lugar.x - this.de.x) * s,
          this.de.y + (this.lugar.y - this.de.y) * s,
          this.de.z + (this.lugar.z - this.de.z) * s,
        );
        let giro = this.lugar.olhando - this.group.rotation.y;
        while (giro > Math.PI) giro -= Math.PI * 2;
        while (giro < -Math.PI) giro += Math.PI * 2;
        this.group.rotation.y += giro * Math.min(1, dt * 3);
        this.casco.rotation.x = -0.4 * Math.sin(k * Math.PI);
        for (let i = 0; i < 4; i++) this.patas[i].rotation.x = Math.sin(ph * 7 + i * 1.6) * 0.4 * (1 - k);
        if (k >= 1) {
          this.fazendo = 'sol';
          this.t = 0;
          this.group.rotation.y = this.lugar.olhando;
          for (const p of this.patas) p.rotation.x = 0;
        }
        break;
      }
    }
    this.velocidadeAgora += (Math.hypot(g.x - this.antes.x, g.z - this.antes.z) / Math.max(dt, 1e-4) - this.velocidadeAgora) * Math.min(1, dt * 6);
    this.antes.copy(g);
  }

  /** o ponto na água bem na frente do lugar dela, de onde ela sobe */
  private pertoDoLugar(): { x: number; z: number } {
    return {
      x: this.lugar.x + Math.sin(this.lugar.olhando) * 0.45,
      z: this.lugar.z + Math.cos(this.lugar.olhando) * 0.45,
    };
  }
}
