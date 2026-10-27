import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../fundir';
import { chapeuDeBruxa } from './pecas';

/*
 * O NESSIE DE PLÁSTICO do lago (pedido do Renan: "um monstrinho do lago Ness
 * de plástico que fique passeando e ilumine o lago"). É uma BOIA INFLÁVEL:
 *
 * - o pescoço é um tubo gordo, de raio igual do começo ao fim (é ar dentro de
 *   vinil, e não um bicho), com as COSTURAS em anel onde um gomo de plástico
 *   encontra o outro;
 * - as três CORCOVAS são meias-boias saindo da água, uma menor que a outra, e
 *   a cauda enrola para cima;
 * - a cara é de brinquedo: olhões com brilho, bochecha, narinas, o sorriso e
 *   os dois chifrinhos; e, por ser Halloween, um chapeuzinho de bruxa torto;
 * - o VINIL brilha: um reflexo branco em cima de cada parte gorda, e a
 *   válvula amarela de encher numa corcova.
 *
 * A cor é pintada nos vértices (a barriga clara onde a normal olha para
 * baixo, as pintas escuras), e o corpo inteiro é UMA malha (`vinil`, com
 * nome: é ela que acende de noite, na etapa 4).
 *
 * Origem na linha d'água, olhando para `+Z`. O que fica abaixo de `y = 0` o
 * chão do mundo esconde (o lago é pintado no chão).
 */

/** pinta a geometria toda de uma cor, com a barriga (normal para baixo) mais clara */
function pintada(geo: THREE.BufferGeometry, cor: number, barriga = true): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const n of Object.keys(g.attributes)) if (n !== 'position' && n !== 'normal') g.deleteAttribute(n);
  if (!g.getAttribute('normal')) g.computeVertexNormals();
  const nor = g.getAttribute('normal');
  const a = new THREE.Color(cor);
  const b = new THREE.Color(P.nessieBarriga);
  const c = new THREE.Color();
  const cores = new Float32Array(nor.count * 3);
  for (let i = 0; i < nor.count; i++) {
    const k = barriga ? THREE.MathUtils.smoothstep(-nor.getY(i), 0.05, 0.55) : 0;
    c.copy(a).lerp(b, k);
    cores.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return g;
}

/** um tubo de boia pela curva, de raio constante, fechado nas pontas por meias-esferas */
function tuboDeBoia(pontos: THREE.Vector3[], raio: number, segs = 24): THREE.BufferGeometry[] {
  const curva = new THREE.CatmullRomCurve3(pontos);
  const tubo = new THREE.TubeGeometry(curva, segs, raio, 14, false);
  const ponta = (t: number) => {
    const p = curva.getPointAt(t);
    return new THREE.SphereGeometry(raio, 14, 10).translate(p.x, p.y, p.z);
  };
  return [tubo, ponta(0), ponta(1)];
}

/** um anel de costura em volta da curva no ponto `t` */
function costura(curva: THREE.Curve<THREE.Vector3>, t: number, raio: number): THREE.BufferGeometry {
  const p = curva.getPointAt(t);
  const d = curva.getTangentAt(t);
  const anel = new THREE.TorusGeometry(raio * 1.02, 0.012, 5, 18);
  anel.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), d));
  anel.translate(p.x, p.y, p.z);
  return anel;
}

export function nessieDePlastico(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'nessie-de-plastico';
  const partes: THREE.BufferGeometry[] = [];
  const brilhos: THREE.BufferGeometry[] = [];

  // ---------------------------------------------------------- o pescoço
  const RP = 0.13;
  const pescocoPts = [
    new THREE.Vector3(0, -0.12, 0.42),
    new THREE.Vector3(0, 0.22, 0.5),
    new THREE.Vector3(0, 0.56, 0.5),
    new THREE.Vector3(0, 0.8, 0.58),
  ];
  const pescoco = new THREE.CatmullRomCurve3(pescocoPts);
  partes.push(...tuboDeBoia(pescocoPts, RP).map((x) => pintada(x, P.nessieVinil)));
  for (const t of [0.35, 0.7]) partes.push(pintada(costura(pescoco, t, RP), P.nessiePinta, false));

  // ------------------------------------------------------------ a cabeça
  const cabeca = new THREE.Vector3(0, 0.9, 0.68);
  partes.push(pintada(new THREE.SphereGeometry(0.19, 18, 14).scale(1, 0.88, 1.32).translate(cabeca.x, cabeca.y, cabeca.z), P.nessieVinil));
  // a costura da cabeça com o pescoço
  partes.push(pintada(costura(pescoco, 0.98, RP), P.nessiePinta, false));
  // os olhos (o branco saltado, a pupila e o brilho), as bochechas e as narinas
  for (const s of [-1, 1]) {
    const olho = new THREE.Vector3(s * 0.1, cabeca.y + 0.07, cabeca.z + 0.12);
    partes.push(pintada(new THREE.SphereGeometry(0.062, 12, 10).translate(olho.x, olho.y, olho.z), 0xffffff, false));
    partes.push(pintada(new THREE.SphereGeometry(0.034, 10, 8).scale(1, 1.1, 0.6).translate(olho.x + s * 0.012, olho.y, olho.z + 0.042), P.olhoDeBoneco, false));
    partes.push(pintada(new THREE.SphereGeometry(0.011, 6, 4).translate(olho.x + s * 0.005, olho.y + 0.018, olho.z + 0.064), 0xffffff, false));
    partes.push(pintada(new THREE.SphereGeometry(0.035, 10, 6).scale(1.3, 0.75, 0.4).translate(s * 0.15, cabeca.y - 0.04, cabeca.z + 0.13), P.bochechaDeBoneco, false));
    partes.push(pintada(new THREE.SphereGeometry(0.012, 6, 4).translate(s * 0.045, cabeca.y + 0.02, cabeca.z + 0.25), P.nessiePinta, false));
    // os chifrinhos: o cabinho e a bolinha
    const chifre = new THREE.Vector3(s * 0.08, cabeca.y + 0.15, cabeca.z - 0.06);
    partes.push(pintada(new THREE.CylinderGeometry(0.018, 0.025, 0.09, 8).translate(chifre.x, chifre.y + 0.03, chifre.z), P.nessieVinil, false));
    partes.push(pintada(new THREE.SphereGeometry(0.032, 10, 8).translate(chifre.x, chifre.y + 0.085, chifre.z), P.nessieValvula, false));
  }
  // o sorriso: um arco de toro deitado embaixo do focinho
  const sorriso = new THREE.TorusGeometry(0.075, 0.009, 5, 14, Math.PI * 0.8);
  sorriso.rotateZ(Math.PI + Math.PI * 0.1);
  sorriso.translate(0, cabeca.y - 0.02, cabeca.z + 0.225);
  partes.push(pintada(sorriso, P.nessiePinta, false));

  // ------------------------------------------------------ as corcovas
  const corcovas: Array<[number, number, number]> = [
    // z do meio, raio do arco, raio do tubo
    [-0.05, 0.28, 0.15],
    [-0.66, 0.23, 0.125],
  ];
  for (const [z, R, r] of corcovas) {
    const arco = new THREE.TorusGeometry(R, r, 14, 22, Math.PI);
    arco.rotateY(Math.PI / 2);
    arco.translate(0, -0.03, z);
    partes.push(pintada(arco, P.nessieVinil));
    // a costura no alto da corcova, de lado a lado
    partes.push(pintada(new THREE.TorusGeometry(r * 1.02, 0.01, 5, 18).rotateX(0).translate(0, R - 0.03, z), P.nessiePinta, false));
    brilhos.push(new THREE.SphereGeometry(0.05, 8, 6).scale(1.5, 0.45, 0.8).translate(0.04, R + r - 0.04, z + 0.05));
  }
  // as pintas: manchas achatadas em cima das corcovas e no pescoço
  const pinta = (x: number, y: number, z: number, n: THREE.Vector3, r: number): void => {
    const geo = new THREE.SphereGeometry(r, 8, 6).scale(1, 1, 0.25);
    geo.lookAt(n);
    geo.translate(x, y, z);
    partes.push(pintada(geo, P.nessiePinta, false));
  };
  pinta(0.12, 0.29, -0.13, new THREE.Vector3(0.5, 0.7, -0.3), 0.04);
  pinta(-0.11, 0.33, 0.04, new THREE.Vector3(-0.5, 0.8, 0.2), 0.035);
  pinta(0.1, 0.23, -0.7, new THREE.Vector3(0.6, 0.7, 0), 0.03);
  pinta(0.11, 0.48, 0.5, new THREE.Vector3(1, 0, 0.2), 0.035);
  pinta(-0.1, 0.62, 0.52, new THREE.Vector3(-1, 0, 0.1), 0.03);
  // a válvula de encher na corcova grande
  partes.push(pintada(new THREE.CylinderGeometry(0.022, 0.026, 0.05, 10).rotateZ(-0.9).translate(0.17, 0.25, -0.07), P.nessieValvula, false));
  partes.push(pintada(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 10).rotateZ(-0.9).translate(0.19, 0.265, -0.07), P.nessieValvula, false));

  // ------------------------------------------------------------- a cauda
  const caudaPts = [
    new THREE.Vector3(0, -0.1, -0.95),
    new THREE.Vector3(0, 0.08, -1.1),
    new THREE.Vector3(0, 0.26, -1.16),
    new THREE.Vector3(0, 0.34, -1.04),
    new THREE.Vector3(0, 0.29, -0.96),
  ];
  partes.push(...tuboDeBoia(caudaPts, 0.075, 20).map((x) => pintada(x, P.nessieVinil)));

  // o reflexo do vinil no alto da cabeça e no pescoço
  brilhos.push(new THREE.SphereGeometry(0.05, 8, 6).scale(1.4, 0.5, 1.2).translate(0.05, cabeca.y + 0.15, cabeca.z + 0.06));
  brilhos.push(new THREE.SphereGeometry(0.03, 8, 6).scale(0.8, 2.2, 0.6).translate(0.1, 0.42, 0.55));

  const vinil = new THREE.Mesh(mergeGeometries(partes), toon(0xffffff, { corPorVertice: true }));
  vinil.name = 'vinil';
  g.add(vinil);
  const brilho = new THREE.Mesh(mergeGeometries(brilhos.map((b) => b.toNonIndexed())), toon(0xffffff, { glow: 0.5 }));
  brilho.name = 'reflexo';
  brilho.userData.semSombra = true;
  g.add(brilho);

  // o chapeuzinho de bruxa, torto na cabeça, entre os chifrinhos
  const chapeu = fundir(chapeuDeBruxa());
  chapeu.scale.setScalar(0.42);
  chapeu.position.set(0.02, cabeca.y + 0.13, cabeca.z - 0.02);
  chapeu.rotation.set(-0.15, 0.3, -0.2);
  g.add(chapeu);
  return g;
}

/** o que o Nessie precisa do lago (a `AguaDoLago` da cena) */
export interface LagoDoNessie {
  naBeira(a: number, recuo?: number): { x: number; z: number };
  rastro(i: number, x: number, z: number, rumo: number, velocidade: number, tamanho?: number): void;
  marola(x: number, z: number, forca?: number): void;
}

/**
 * O PASSEIO: ele vai e volta num arco do lago, longe da beira (o recuo da
 * margem respira), e o arco PULA o lado do trapiche — dar a volta inteira
 * passaria por baixo das tábuas. Nas pontas ele para um pouco, vira devagar
 * e volta; no meio do caminho, de vez em quando, para e fica boiando. O V
 * na água é o mesmo rastro dos patos (`agua.rastro`, na vaga `vaga`).
 */
export class NessieNoLago {
  readonly group: THREE.Group;
  private a: number;
  private sentido = 1;
  private parado = 0;
  /** quem chega no parque já o encontra nadando */
  private velocidade = 0.32;
  private tempo = 0;
  private rumo = 0;
  private proximaParada = 14;

  constructor(
    private readonly lago: LagoDoNessie,
    private readonly vaga: number,
    private readonly de = 0.95,
    private readonly ate = 5.95,
    inicio = 2.4,
  ) {
    this.group = nessieDePlastico();
    this.a = inicio;
    const p = this.ponto(this.a);
    this.group.position.set(p.x, 0, p.z);
    const q = this.ponto(this.a + 0.01);
    this.rumo = Math.atan2(q.x - p.x, q.z - p.z);
    this.group.rotation.y = this.rumo;
  }

  private ponto(a: number): { x: number; z: number } {
    return this.lago.naBeira(a, 3.1 + 0.55 * Math.sin(3 * a + 0.7));
  }

  get x(): number {
    return this.group.position.x;
  }

  get z(): number {
    return this.group.position.z;
  }

  update(dt: number): void {
    this.tempo += dt;
    const VEL = 0.32;
    if (this.parado > 0) {
      this.parado -= dt;
      this.velocidade = Math.max(0, this.velocidade - dt * 0.5);
    } else {
      this.velocidade = Math.min(VEL, this.velocidade + dt * 0.2);
      this.proximaParada -= dt;
      if (this.proximaParada <= 0) {
        this.parado = 3 + Math.random() * 3;
        this.proximaParada = 16 + Math.random() * 14;
      }
    }
    // anda pelo arco na velocidade pedida (o arco tem uns 4,5 m de raio)
    const antes = this.ponto(this.a);
    this.a += (this.sentido * this.velocidade * dt) / 4.6;
    if (this.a > this.ate || this.a < this.de) {
      this.a = THREE.MathUtils.clamp(this.a, this.de, this.ate);
      this.sentido *= -1;
      this.parado = 2.5;
    }
    const agora = this.ponto(this.a);
    const dx = agora.x - antes.x;
    const dz = agora.z - antes.z;
    // o rumo segue o caminho, virando devagar (na ponta, a volta é um U)
    if (Math.hypot(dx, dz) > 1e-5) {
      const alvo = Math.atan2(dx, dz);
      let d = alvo - this.rumo;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      this.rumo += d * Math.min(1, dt * 1.2);
    }
    // boiando: sobe e desce, balança de lado e o pescoço cabeceia um pouco
    const t = this.tempo;
    this.group.position.set(agora.x, 0.025 * Math.sin(t * 1.6), agora.z);
    this.group.rotation.set(0.04 * Math.sin(t * 1.1 + 1), this.rumo, 0.05 * Math.sin(t * 1.3));
    this.lago.rastro(this.vaga, agora.x, agora.z, this.rumo, this.velocidade / VEL, 1.7);
  }
}
