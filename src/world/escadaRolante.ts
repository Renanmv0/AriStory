import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * ====================================== A ESCADA ROLANTE DA BOUTIQUE
 *
 * A peça que costura os dois andares da loja da Estella, refeita na segunda
 * reforma — e agora ela ANDA: os degraus sobem sem parar, saindo de baixo da
 * placa pente embaixo e sumindo debaixo da de cima. Antes ela era uma rampa
 * de degraus parados, e lia como escada desligada.
 *
 * Ela sobe de `+Z` para `−Z` (a cena gira, como toda peça do kit), com a base
 * em `z = +comprimento/2` (y = 0) e o topo em `−comprimento/2` (y = altura).
 *
 * =================================================== O QUE ELA TEM
 *
 *  - OS DEGRAUS são três `InstancedMesh` (o piso ranhurado, o espelho e o
 *    friso de latão na quina) — dezoito degraus em três desenhos por quadro,
 *    reposicionados a cada quadro em `update()`. O piso fica sempre deitado;
 *    no trecho inclinado cada degrau ganha o espelho até o próximo, e no
 *    plano das pontas o espelho encolhe a zero (é o degrau "se achatando"
 *    para entrar na placa pente, como numa escada de verdade);
 *  - A LATERAL é uma faixa revestida em creme, da cor da marcenaria da loja,
 *    que acompanha o lance (a forma do perfil extrudada na espessura), com o
 *    friso de latão em cima e um FIO DE LUZ quente correndo por dentro;
 *  - O VIDRO da balaustrada, bem transparente, e o CORRIMÃO de veludo vinho:
 *    UM tubo que corre o lance inteiro e dá a volta nas duas pontas, descendo
 *    em meio-círculo para dentro da balaustrada — a volta do corrimão é o
 *    desenho que todo mundo reconhece;
 *  - AS PLACAS PENTE, em cima e embaixo, com os dentes de latão.
 *
 * 6,4 de corrida para 3,9 de altura dão 31°, que é a inclinação de escada
 * rolante de verdade (30°). Abaixo de 25° ela lê como esteira de aeroporto.
 */
export class EscadaRolante {
  readonly group = new THREE.Group();
  private readonly pisos: THREE.InstancedMesh;
  private readonly espelhos: THREE.InstancedMesh;
  private readonly quinas: THREE.InstancedMesh;
  private readonly n: number;
  private readonly passo: number;
  private readonly percurso: number;
  private readonly zIni: number;
  private fase = 0;
  private readonly m = new THREE.Matrix4();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3(1, 1, 1);
  private readonly q = new THREE.Quaternion();

  /** quanto a escada anda, em metros por segundo (ao longo do chão) */
  static readonly VELOCIDADE = 0.42;

  constructor(private readonly altura = 3.9, private readonly comprimento = 6.4) {
    const g = this.group;
    g.userData.peca = 'escada-rolante';
    const A = altura;
    const z0 = comprimento / 2;
    const LARG = 1.15;
    const latao = toon(P.boutiqueOuro);

    // ------------------------------------------------------- os degraus
    this.zIni = z0 + 0.3;
    this.percurso = comprimento + 0.6;
    this.n = Math.round(this.percurso / 0.4);
    this.passo = this.percurso / this.n;
    const piso = new THREE.BoxGeometry(LARG, 0.04, this.passo * 0.97);
    piso.translate(0, -0.02, 0);
    this.pisos = new THREE.InstancedMesh(piso, toon(P.escadaDegrau, { mapa: ranhuras() }), this.n);
    const espelho = new THREE.BoxGeometry(LARG - 0.02, 1, 0.03);
    espelho.translate(0, 0.5, 0);
    this.espelhos = new THREE.InstancedMesh(espelho, toon(P.escadaDegrauEscuro), this.n);
    const quina = new THREE.BoxGeometry(LARG - 0.08, 0.012, 0.035);
    this.quinas = new THREE.InstancedMesh(quina, latao, this.n);
    for (const im of [this.pisos, this.espelhos, this.quinas]) {
      im.castShadow = true;
      im.receiveShadow = true;
      g.add(im);
    }
    this.posicionar();
    // a esfera envolvente cobre o lance inteiro: os degraus andam, mas não saem dele
    const esfera = new THREE.Sphere(new THREE.Vector3(0, A / 2, 0), Math.hypot(A, comprimento) / 2 + 1);
    for (const im of [this.pisos, this.espelhos, this.quinas]) im.boundingSphere = esfera;

    // ------------------------------------------------ as laterais
    const creme = toon(P.boutiqueBoiserie);
    const vidro = toon(P.escadaVidro, { opacity: 0.18, doubleSide: true });
    const luz = toon(P.boutiqueLuz, { glow: 0.8 });
    const corrimao = toon(P.boutiqueVinho);
    for (const lado of [-1, 1] as const) {
      const x = lado * (LARG / 2 + 0.07);
      // a faixa revestida: em cima do degrau 12 cm, e a barriga 75 cm abaixo dele
      const zB = z0 + 0.8;
      const zT = -z0 - 0.8;
      const pe = z0 - (0.75 * comprimento) / A;
      const faixa = new THREE.Shape([
        [zB, 0.12], [z0, 0.12], [-z0, A + 0.12], [zT, A + 0.12],
        [zT, A - 0.75], [-z0, A - 0.75], [pe, 0], [zB, 0],
      ].map(([zz, y]) => new THREE.Vector2(-zz, y)));
      const geoFaixa = new THREE.ExtrudeGeometry(faixa, { depth: 0.11, bevelEnabled: false });
      geoFaixa.translate(0, 0, -0.055);
      geoFaixa.rotateY(Math.PI / 2);
      const m = new THREE.Mesh(geoFaixa, creme);
      m.position.x = x;
      g.add(m);
      // o friso de latão em cima da faixa, e o fio de luz por dentro dela
      g.add(tuboNoLance(x, 0.13, z0, A, zB, zT, 0.016, latao));
      g.add(tuboNoLance(x - lado * 0.06, 0.1, z0, A, z0 + 0.5, -z0 - 0.5, 0.01, luz));
      // o vidro
      const zv = z0 + 0.42;
      const vidroForma = new THREE.Shape([
        [zv, 0.14], [z0, 0.14], [-z0, A + 0.14], [-zv, A + 0.14],
        [-zv, A + 0.93], [-z0, A + 0.93], [z0, 0.93], [zv, 0.93],
      ].map(([zz, y]) => new THREE.Vector2(-zz, y)));
      const geoVidro = new THREE.ExtrudeGeometry(vidroForma, { depth: 0.024, bevelEnabled: false });
      geoVidro.translate(0, 0, -0.012);
      geoVidro.rotateY(Math.PI / 2);
      const v = new THREE.Mesh(geoVidro, vidro);
      v.position.x = x;
      v.renderOrder = 4;
      g.add(v);
      // o corrimão, com a volta nas duas pontas
      const corr = new THREE.Mesh(new THREE.TubeGeometry(caminhoDoCorrimao(z0, A, zv), 150, 0.042, 8, false), corrimao);
      corr.position.x = x;
      g.add(corr);
    }

    // ------------------------------------------------ as placas pente
    const aco = toon(P.escadaDegrauEscuro);
    for (const [zc, y, sentido] of [[z0 + 0.27, 0, -1], [-z0 - 0.27, A, 1]] as const) {
      const placa = new THREE.Mesh(new THREE.BoxGeometry(LARG + 0.1, 0.065, 0.7), aco);
      placa.position.set(0, y + 0.0325 + 0.004, zc);
      g.add(placa);
      for (let i = 0; i < 11; i++) {
        const dente = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.022, 0.14), latao);
        dente.position.set(-LARG / 2 + 0.08 + (i * (LARG - 0.16)) / 10, y + 0.074, zc + sentido * 0.29);
        g.add(dente);
      }
    }
  }

  /** a altura do degrau na posição `z` do lance */
  private alturaEm(z: number): number {
    const z0 = this.comprimento / 2;
    return THREE.MathUtils.clamp((z0 - z) / this.comprimento, 0, 1) * this.altura;
  }

  private posicionar(): void {
    for (let i = 0; i < this.n; i++) {
      const s = (i * this.passo + this.fase) % this.percurso;
      const z = this.zIni - s;
      const y = this.alturaEm(z);
      const zFrente = z - this.passo / 2;
      const proximo = this.alturaEm(z - this.passo);
      this.p.set(0, y, z);
      this.s.set(1, 1, 1);
      this.m.compose(this.p, this.q, this.s);
      this.pisos.setMatrixAt(i, this.m);
      // o espelho sobe do piso deste degrau até o do próximo (zero no plano)
      this.p.set(0, y - 0.035, zFrente + 0.016);
      this.s.set(1, Math.max(0.001, proximo - y + 0.03), 1);
      this.m.compose(this.p, this.q, this.s);
      this.espelhos.setMatrixAt(i, this.m);
      this.p.set(0, y + 0.002, zFrente + 0.03);
      this.s.set(1, 1, 1);
      this.m.compose(this.p, this.q, this.s);
      this.quinas.setMatrixAt(i, this.m);
    }
    this.pisos.instanceMatrix.needsUpdate = true;
    this.espelhos.instanceMatrix.needsUpdate = true;
    this.quinas.instanceMatrix.needsUpdate = true;
  }

  /** a cena chama a cada quadro: a escada anda */
  update(dt: number): void {
    this.fase = (this.fase + dt * EscadaRolante.VELOCIDADE) % this.percurso;
    this.posicionar();
  }
}

/** um tubo que acompanha o lance a `dy` acima do degrau, de `zB` (base) a `zT` (topo) */
function tuboNoLance(
  x: number, dy: number, z0: number, A: number, zB: number, zT: number, raio: number, mat: THREE.Material,
): THREE.Mesh {
  const pts = [
    [zB, dy], [z0 + 0.12, dy], [z0, dy + 0.01], [z0 - 0.12, dy + 0.08],
    [-z0 + 0.12, A + dy - 0.08], [-z0, A + dy - 0.01], [-z0 - 0.12, A + dy], [zT, A + dy],
  ].map(([z, y]) => new THREE.Vector3(x, y, z));
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, raio, 6, false), mat);
}

/**
 * O caminho do corrimão: começa embaixo da volta da base, sobe a volta (meio
 * círculo), corre plano, sobe o lance, corre plano no topo e desce a volta de
 * cima. As quinas entre o plano e o lance são arredondadas.
 */
function caminhoDoCorrimao(z0: number, A: number, zv: number): THREE.CatmullRomCurve3 {
  const H = 0.97;
  const R = 0.21;
  const pts: THREE.Vector3[] = [];
  const volta = (zc: number, yc: number, sentido: 1 | -1, subindo: boolean): void => {
    for (let k = 0; k <= 10; k++) {
      const t = subindo ? k / 10 : 1 - k / 10;
      const a = -Math.PI / 2 + t * Math.PI;
      pts.push(new THREE.Vector3(0, yc + Math.sin(a) * R, zc + sentido * Math.cos(a) * R));
    }
  };
  volta(zv, H - R, 1, true);
  pts.push(new THREE.Vector3(0, H, z0 + 0.15));
  pts.push(new THREE.Vector3(0, H + 0.015, z0 - 0.02));
  pts.push(new THREE.Vector3(0, H + 0.1, z0 - 0.18));
  pts.push(new THREE.Vector3(0, A + H - 0.1, -z0 + 0.18));
  pts.push(new THREE.Vector3(0, A + H - 0.015, -z0 + 0.02));
  pts.push(new THREE.Vector3(0, A + H, -z0 - 0.15));
  // a volta de cima é a mesma, espelhada: desce de H para H − 2R do lado de −Z
  for (let k = 0; k <= 10; k++) {
    const a = Math.PI / 2 - (k / 10) * Math.PI;
    pts.push(new THREE.Vector3(0, A + H - R + Math.sin(a) * R, -zv - Math.cos(a) * R));
  }
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
}

/**
 * AS RANHURAS DO DEGRAU: riscos finos no sentido da subida, quase brancos (o
 * toon multiplica a cor do aço). Pintadas em canvas, como toda textura do
 * jogo; o degrau é uma caixa e o UV de 0 a 1 do piso já serve.
 */
let texRanhuras: THREE.CanvasTexture | null = null;
function ranhuras(): THREE.CanvasTexture {
  if (texRanhuras) return texRanhuras;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 16;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 16);
    ctx.fillStyle = 'rgba(120,124,132,0.3)';
    for (let i = 0; i < 16; i++) ctx.fillRect(i * 8 + 3, 0, 2.5, 16);
  }
  texRanhuras = new THREE.CanvasTexture(c);
  texRanhuras.colorSpace = THREE.SRGBColorSpace;
  return texRanhuras;
}
