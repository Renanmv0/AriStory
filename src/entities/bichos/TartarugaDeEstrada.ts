import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon } from '../../core/materials';
import { fundir } from '../../world/fundir';
import { PALETTE as P } from '../../palette';
import { novaTextura } from '../../world/texturasDeChao';

/**
 * A TARTARUGA DA ESTRADA: o tigre-d'água que atravessa a faixa de pedestres da
 * viagem de carro (`eventos/bebitoMobile/travessia.ts`). O `TigreDagua` do lago
 * é um bicho de tronco (toma sol, pula, nada) e fica como está; este é o que
 * ANDA, e por isso tem o que o do lago nunca precisou:
 *
 *  - o CASCO EM RELEVO: a cúpula tem as placas de verdade levantadas (cada uma
 *    uma bossa, as juntas são vales) e a mesma conta pinta o desenho — o claro
 *    do meio de cada placa, a junta escura, o risco amarelo —, então o relevo e
 *    a tinta nunca se desencontram. Em volta, o anel das placas da beirada, uma
 *    a uma, e embaixo o peito amarelo (o plastrão);
 *  - as QUATRO PERNAS de verdade (cada uma num pivô no quadril, com pé e
 *    garrinhas), que andam em diagonal — mão esquerda com pé direito —, o casco
 *    balançando de lado e a cabeça subindo e descendo no passo;
 *  - a CABEÇA GRANDE e fofa: olho pousado no crânio (oval escuro com brilho),
 *    o sorrisinho, a mancha laranja atrás do olho e os riscos amarelos do
 *    pescoço — o "tigre" do nome;
 *  - ESCONDER no casco (`esconder`): cabeça, pescoço e pernas recolhem para
 *    dentro e o casco desce até o chão. É o que a buzina faz com ela.
 *
 * A frente é `+Z`, como em todo bicho do jogo; a origem fica no CHÃO, debaixo
 * do meio do casco. Medidas em metros "de lago": a cena escala por cima.
 */

// ----------------------------------------------------------------- o casco

interface Placa {
  x: number;
  y: number;
  rx: number;
  ry: number;
}

/**
 * As placas do casco, no quadro do desenho (0 a 1, visto de cima, a frente do
 * bicho para BAIXO): cinco no meio e quatro de cada lado. A mesma lista pinta a
 * textura e levanta o relevo.
 */
const PLACAS: Placa[] = (() => {
  const l: Placa[] = [];
  for (let i = 0; i < 5; i++) l.push({ x: 0.5, y: 0.16 + i * 0.17, rx: 0.12, ry: 0.085 });
  for (const lado of [-1, 1]) for (let i = 0; i < 4; i++) l.push({ x: 0.5 + lado * 0.24, y: 0.24 + i * 0.17, rx: 0.11, ry: 0.085 });
  return l;
})();

const MARGINAIS = 24;

/** o desenho do casco visto de cima: junta escura, claro no meio, risco amarelo, e o anel da beirada */
function desenhoDoCasco(): THREE.CanvasTexture {
  return novaTextura('casco-da-tartaruga-de-estrada', 1, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const c = s / 2;
    // o anel da beirada: placas marginais, uma clara e uma um tico mais escura
    for (let i = 0; i < MARGINAIS; i++) {
      const a0 = (i / MARGINAIS) * Math.PI * 2;
      const a1 = ((i + 1) / MARGINAIS) * Math.PI * 2;
      ctx.fillStyle = i % 2 ? 'rgb(214,214,214)' : 'rgb(236,236,236)';
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(a0) * s * 0.405, c + Math.sin(a0) * s * 0.405);
      ctx.lineTo(c + Math.cos(a0) * s * 0.52, c + Math.sin(a0) * s * 0.52);
      ctx.lineTo(c + Math.cos(a1) * s * 0.52, c + Math.sin(a1) * s * 0.52);
      ctx.lineTo(c + Math.cos(a1) * s * 0.405, c + Math.sin(a1) * s * 0.405);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(32,48,22,0.7)';
      ctx.lineWidth = 2.4;
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(32,48,22,0.75)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.ellipse(c, c, s * 0.405, s * 0.405, 0, 0, Math.PI * 2);
    ctx.stroke();
    // as placas: o meio claro, a borda mais escura (o relevo faz o resto), a junta e o risco
    let k = 0;
    for (const p of PLACAS) {
      const px = p.x * s;
      const py = p.y * s;
      const rx = p.rx * s;
      const ry = p.ry * s;
      const caminho = (f: number): void => {
        ctx.beginPath();
        for (let v = 0; v <= 6; v++) {
          const a = (v / 6) * Math.PI * 2 + Math.PI / 6;
          const x = px + Math.cos(a) * rx * f;
          const y = py + Math.sin(a) * ry * f;
          if (v === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      };
      const g = ctx.createRadialGradient(px, py, 0, px, py, Math.max(rx, ry));
      g.addColorStop(0, 'rgb(255,255,255)');
      g.addColorStop(0.55, 'rgb(236,236,236)');
      g.addColorStop(1, 'rgb(196,196,196)');
      caminho(1);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(32,48,22,0.78)';
      ctx.lineWidth = 3.4;
      caminho(1);
      ctx.stroke();
      // o anel de crescimento da placa, bem fraquinho
      ctx.strokeStyle = 'rgba(40,58,26,0.22)';
      ctx.lineWidth = 1.6;
      caminho(0.62);
      ctx.stroke();
      // o risco amarelo (a marca do tigre-d'água): um arco em cada placa, cada um para um lado
      ctx.strokeStyle = 'rgba(236,206,84,0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const sinal = k++ % 2 ? 1 : -1;
      ctx.moveTo(px - rx * 0.55, py + ry * 0.18 * sinal);
      ctx.quadraticCurveTo(px, py - ry * 0.5 * sinal, px + rx * 0.55, py + ry * 0.12 * sinal);
      ctx.stroke();
    }
  }, 256);
}

const RX = 0.125;
const RY = 0.088;
const RZ = 0.155;
/** o quanto cada placa se levanta (fração do raio) */
const RELEVO = 0.085;

let domo: THREE.BufferGeometry | null = null;

/**
 * A cúpula do casco COM RELEVO, uma só para todas as tartarugas: cada placa é
 * uma bossa (a junta, um vale) e o UV é projetado de cima. As emendas da esfera
 * são soldadas antes de calcular as normais, senão sobra um risco de luz.
 */
function cupulaDoCasco(): THREE.BufferGeometry {
  if (domo) return domo;
  let geo: THREE.BufferGeometry = new THREE.SphereGeometry(1, 40, 18, 0, Math.PI * 2, 0, Math.PI / 2);
  geo.deleteAttribute('normal');
  geo = mergeVertices(geo, 1e-5);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = x / 2 + 0.5;
    const ny = z / 2 + 0.5;
    let h = 0;
    for (const p of PLACAS) {
      const d2 = ((nx - p.x) / p.rx) ** 2 + ((ny - p.y) / p.ry) ** 2;
      if (d2 < 1) h += Math.sqrt(1 - d2);
    }
    // perto da beirada o relevo some (a saia não alarga)
    const f = 1 + RELEVO * Math.min(1, h) * Math.min(1, y * 3.5);
    pos.setXYZ(i, x * f * RX, y * f * RY, z * f * RZ);
    uv.setXY(i, nx, 1 - ny);
  }
  geo.computeVertexNormals();
  domo = geo;
  return geo;
}

// ----------------------------------------------------------------- a tartaruga

type Perna = { pivo: THREE.Group; fase: number; frente: boolean };

/** o que a tartaruga faz neste quadro */
export interface PoseDaTartaruga {
  /** está andando (as pernas e o casco balançam no passo) */
  andando: boolean;
  /** quanto do tempo de passo já correu (radianos) */
  passo: number;
  /** 0 a 1: o quanto ela está recolhida no casco */
  esconder: number;
}

export class TartarugaDeEstrada {
  readonly group = new THREE.Group();
  private readonly corpo = new THREE.Group();
  private readonly pescoco = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly olhos: THREE.Group[] = [];
  private readonly rabo = new THREE.Group();
  private readonly pernas: Perna[] = [];
  private recolhida = 0;
  private balanco = 0;
  private relogio: number;
  private piscar = 0;
  private proximoPiscar: number;

  constructor(semente = 0) {
    this.relogio = (semente % 13) * 0.7;
    this.proximoPiscar = 1.5 + (semente % 5) * 0.6;
    this.montar();
    this.group.userData.peca = 'tartaruga-de-estrada';
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
  }

  private montar(): void {
    const pele = toon(P.tigreDaguaPele);
    const peleEscura = toon(P.tigreDaguaCascoEscuro);
    const amarelo = toon(P.tigreDaguaListra);
    const laranja = toon(P.tigreDaguaRisco);
    const escuro = toon(P.pragaPupila);

    // ---- o casco, a beirada e o peito
    const casco = new THREE.Group();
    casco.name = 'casco';
    const domoMalha = new THREE.Mesh(cupulaDoCasco(), toon(P.tigreDaguaCasco, { mapa: desenhoDoCasco() }));
    domoMalha.position.y = 0.002;
    casco.add(domoMalha);
    // a saia de baixo do domo: o anel verde-escuro que fecha a base
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.018, 28), peleEscura);
    aba.scale.set(RX * 1.01, 1, RZ * 1.01);
    aba.position.y = 0.0;
    casco.add(aba);
    // o peito (plastrão): amarelo, um tico menor que a saia, aparece embaixo e de lado
    const peito = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.94, 0.014, 24), amarelo);
    peito.scale.set(RX * 0.93, 1, RZ * 0.93);
    peito.position.y = -0.012;
    casco.add(peito);
    // as placas da beirada, uma a uma, em relevo em volta da base (cada uma uma pastilha)
    const pastilha = new THREE.SphereGeometry(1, 6, 4);
    for (let i = 0; i < MARGINAIS; i++) {
      const a = ((i + 0.5) / MARGINAIS) * Math.PI * 2;
      const m = new THREE.Mesh(pastilha, i % 2 ? peleEscura : toon(P.tigreDaguaCasco));
      m.scale.set(0.02, 0.0085, 0.021);
      m.position.set(Math.sin(a) * RX * 0.985, 0.006, Math.cos(a) * RZ * 0.985);
      m.rotation.y = a;
      casco.add(m);
    }
    this.corpo.add(casco);

    // ---- o corpo de pele que aparece entre o casco e o peito
    const barriga = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), pele);
    barriga.scale.set(RX * 0.82, 0.03, RZ * 0.82);
    barriga.position.y = -0.003;
    this.corpo.add(barriga);

    // ---- as quatro pernas, cada uma no seu pivô (no quadril, por baixo da saia)
    const coxa = new THREE.CylinderGeometry(0.02, 0.016, 0.052, 8).translate(0, -0.026, 0);
    const pe = new THREE.SphereGeometry(1, 8, 6);
    const garra = new THREE.ConeGeometry(0.0034, 0.011, 5).rotateX(Math.PI / 2);
    for (const [lx, lz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]] as const) {
      const frente = lz > 0;
      const pivo = new THREE.Group();
      pivo.name = `perna-${lx < 0 ? 'e' : 'd'}${frente ? 'f' : 't'}`;
      pivo.position.set(lx * RX * 0.74, -0.004, lz * RZ * 0.6);
      const k = frente ? 1.1 : 1;
      const perna = new THREE.Mesh(coxa, pele);
      perna.scale.set(k, 1, k);
      pivo.add(perna);
      const sola = new THREE.Mesh(pe, pele);
      sola.scale.set(0.027 * k, 0.0105, 0.036 * k);
      sola.position.set(0, -0.0485, 0.009);
      pivo.add(sola);
      for (const gx of [-0.011, 0, 0.011]) {
        const g = new THREE.Mesh(garra, amarelo);
        g.position.set(gx * k, -0.0495, 0.04 * k);
        pivo.add(g);
      }
      this.corpo.add(pivo);
      // a fase: mão esquerda com pé direito (e a da frente contra a de trás)
      this.pernas.push({ pivo, fase: (lx * lz > 0 ? 0 : Math.PI), frente });
    }

    // ---- o rabinho
    const rabo = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 6).rotateX(-Math.PI / 2).translate(0, 0, -0.025), pele);
    this.rabo.add(rabo);
    this.rabo.name = 'rabo';
    this.rabo.position.set(0, 0.004, -RZ * 0.9);
    this.corpo.add(this.rabo);

    // ---- o pescoço (sai da frente do casco, sobe e a cabeça olha reto) e a cabeça
    const colo = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.027, 0.085, 10).rotateX(Math.PI / 2).translate(0, 0, 0.04), pele);
    this.pescoco.add(colo);
    for (const lado of [-1, 1]) {
      // os dois riscos amarelos do pescoço
      const risco = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4), amarelo);
      risco.scale.set(0.0028, 0.0055, 0.034);
      risco.position.set(lado * 0.0225, 0.004, 0.042);
      risco.rotation.y = lado * 0.04;
      this.pescoco.add(risco);
    }
    const A = 0.043;
    const B = 0.037;
    const C = 0.05;
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pele);
    cranio.scale.set(A, B, C);
    this.cabeca.add(cranio);
    // o focinho: um tico mais claro na ponta, e o sorriso
    const focinho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), toon(P.tigreDaguaPele));
    focinho.scale.set(0.02, 0.014, 0.014);
    focinho.position.set(0, -0.006, C * 0.88);
    this.cabeca.add(focinho);
    const sorriso = new THREE.Mesh(new THREE.TorusGeometry(0.0105, 0.0018, 4, 12, Math.PI), escuro);
    sorriso.rotation.z = Math.PI;
    sorriso.position.set(0, -0.0145, C * 0.915);
    this.cabeca.add(sorriso);
    for (const lado of [-1, 1]) {
      // a mancha laranja atrás do olho: o "tigre" do nome
      const mancha = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), laranja);
      mancha.scale.set(0.0042, 0.0095, 0.019);
      mancha.position.set(lado * (A * 0.96), 0.002, -0.012);
      mancha.rotation.y = lado * 0.12;
      this.cabeca.add(mancha);
      const risquinho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4), amarelo);
      risquinho.scale.set(0.0028, 0.0035, 0.02);
      risquinho.position.set(lado * (A * 0.94), -0.011, -0.001);
      risquinho.rotation.y = lado * 0.1;
      this.cabeca.add(risquinho);
      // o olho: um grupo POUSADO na superfície do crânio, virado pela normal, tudo achatado nele
      const dir = new THREE.Vector3(lado * 0.64, 0.34, 0.72).normalize();
      const t = 1 / Math.hypot(dir.x / A, dir.y / B, dir.z / C);
      const ponto = dir.clone().multiplyScalar(t);
      const normal = new THREE.Vector3(ponto.x / (A * A), ponto.y / (B * B), ponto.z / (C * C)).normalize();
      const olho = new THREE.Group();
      olho.name = 'olho';
      olho.position.copy(ponto);
      olho.lookAt(ponto.clone().add(normal));
      const bola = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), escuro);
      bola.scale.set(0.0082, 0.0102, 0.0016);
      bola.position.z = -0.0002;
      olho.add(bola);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(1, 6, 4), toon(P.patoPena));
      brilho.scale.set(0.0028, 0.0028, 0.0012);
      brilho.position.set(lado * -0.0018, 0.0036, 0.0013);
      olho.add(brilho);
      this.cabeca.add(olho);
      this.olhos.push(olho);
    }
    this.cabeca.name = 'cabeca';
    this.cabeca.position.z = 0.088;
    this.pescoco.add(this.cabeca);
    this.pescoco.name = 'pescoco';
    this.pescoco.position.set(0, 0.034, RZ * 0.78);
    this.corpo.add(this.pescoco);

    this.corpo.name = 'corpo';
    this.group.add(this.corpo);
    fundir(this.group);
    this.pose({ andando: false, passo: 0, esconder: 0 }, 0);
  }

  /** o casco fica a esta altura do chão (as pernas aguentam ele) */
  static readonly ALTURA_DO_CORPO = 0.066;

  /** um quadro: relógio de piscar e a pose do passo */
  update(dt: number, p: PoseDaTartaruga): void {
    this.relogio += dt;
    this.pose(p, dt);
  }

  private pose(p: PoseDaTartaruga, dt: number): void {
    // o recolher vai e volta devagar (um "tec" rápido para dentro, mais calmo para fora)
    const alvo = p.esconder;
    const vel = alvo > this.recolhida ? 9 : 3.2;
    this.recolhida += (alvo - this.recolhida) * Math.min(1, dt * vel);
    if (dt === 0) this.recolhida = alvo;
    const k = this.recolhida;
    const sai = 1 - k;
    // andar: quanto ele pesa (some quando recolhida)
    this.balanco += ((p.andando && k < 0.3 ? 1 : 0) - this.balanco) * Math.min(1, dt * 7);
    if (dt === 0) this.balanco = p.andando && k < 0.3 ? 1 : 0;
    const b = this.balanco;
    const passo = p.passo;

    // o corpo todo: sobe nas pernas; desce até o chão quando se esconde
    const y = TartarugaDeEstrada.ALTURA_DO_CORPO - 0.044 * k;
    this.corpo.position.y = y + Math.abs(Math.sin(passo)) * 0.0035 * b + Math.sin(this.relogio * 1.6) * 0.0012 * (1 - b);
    // o casco balança de lado com o passo (e roda um tico em volta de si)
    this.corpo.rotation.z = Math.sin(passo) * 0.04 * b;
    this.corpo.rotation.y = Math.sin(passo + Math.PI / 2) * 0.04 * b;
    this.corpo.rotation.x = Math.sin(passo * 2) * 0.012 * b;

    // as pernas: diagonal, e recolhem (encolhem e sobem para dentro)
    for (const perna of this.pernas) {
      const balanca = Math.sin(passo + perna.fase) * 0.62 * b;
      perna.pivo.rotation.x = balanca * sai;
      perna.pivo.scale.setScalar(1 - 0.68 * k);
      perna.pivo.scale.y = 1 - 0.74 * k;
    }
    // o rabo balança de leve e encolhe
    this.rabo.rotation.y = Math.sin(passo * 0.5 + 1) * 0.35 * b;
    this.rabo.scale.setScalar(1 - 0.7 * k);

    // o pescoço: sobe e olha; no susto recolhe para dentro do casco
    const olhar = Math.sin(this.relogio * 0.7) * 0.28 * (1 - b * 0.7);
    this.pescoco.rotation.x = -0.42 + 0.3 * k;
    this.pescoco.position.z = RZ * 0.78 - RZ * 0.62 * k;
    this.pescoco.position.y = 0.034 - 0.012 * k;
    this.pescoco.scale.z = 1 - 0.78 * k;
    this.pescoco.rotation.y = olhar * sai * 0.5;
    this.cabeca.rotation.x = 0.42 - 0.3 * k + Math.sin(passo * 2) * 0.07 * b + Math.sin(this.relogio * 1.1) * 0.03;
    this.cabeca.rotation.y = olhar * sai;
    this.cabeca.scale.setScalar(1 - 0.38 * k);

    // piscar: um traço rápido de tempos em tempos (e fechados quando recolhida)
    if (dt > 0) {
      this.proximoPiscar -= dt;
      if (this.proximoPiscar <= 0) {
        this.piscar = 0.14;
        this.proximoPiscar = 2.2 + ((this.relogio * 7.3) % 2.4);
      }
      this.piscar = Math.max(0, this.piscar - dt);
    }
    const fechado = Math.max(k > 0.5 ? 1 : 0, this.piscar > 0 ? Math.sin((this.piscar / 0.14) * Math.PI) : 0);
    for (const o of this.olhos) o.scale.y = Math.max(0.12, 1 - fechado * 0.9);
  }
}
