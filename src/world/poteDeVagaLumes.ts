import * as THREE from 'three';
import { brilhoDeLuz, brilhoEmLote, flat, luzNoChao, toon } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * ============================================ O POTE DE VAGA-LUMES (D)
 *
 * A etapa D do acampamento (`docs/ACAMPAMENTO.md`), com o pedido do Renan:
 * "pegar os vaga-lumes e soltar eles onde quisermos, daí eles iluminariam o
 * parque" — e o parque de noite para andar livre é plano futuro.
 *
 * O POTE: um vidro de conserva meio esverdeado (torneado, com o ombro, o
 * gargalo de rosca e o fundo grosso), a tampa de lata furadinha (os furos
 * pintados em canvas), a alça de arame que dá a volta no gargalo, o
 * barbante amarrado com laço e a etiqueta de papel com um coraçãozinho. A
 * tampa é um grupo com NOME (`tampa`, dobradiça num lado): abre para pegar e
 * para soltar. Lá dentro, os vaga-lumes pegos voam em volta uns dos outros,
 * cada um piscando no seu tempo, e o pote inteiro ganha um clarão que cresce
 * com quantos tem dentro.
 *
 * OS SOLTOS (`VagaLumesSoltos`): cada vez que a dupla abre o pote, os
 * vaga-lumes saem voando do pote e ficam rodando em volta daquele ponto — uma
 * nuvenzinha de luz com uma poça verde no chão embaixo. Todos os soltos de
 * todos os pontos são três desenhos (os pontos, os halos e as poças, um lote
 * cada), e a lista de pontos mora no save (`vagaLumesSoltos`): é por ela que
 * o parque de noite vai se iluminar onde eles soltaram.
 */

/** quantos cabem no pote */
export const CABEM_NO_POTE = 8;

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

let texturaDaTampa: THREE.CanvasTexture | null = null;
/** a tampa de lata vista de cima: o latão, o anel de rosca e os furinhos feitos a prego */
function tampaFurada(): THREE.CanvasTexture {
  if (texturaDaTampa) return texturaDaTampa;
  const tela = document.createElement('canvas');
  tela.width = 128;
  tela.height = 128;
  const c = tela.getContext('2d');
  if (c) {
    const g = c.createRadialGradient(54, 48, 4, 64, 64, 66);
    g.addColorStop(0, '#f2d68e');
    g.addColorStop(1, css(P.tampaDoPote));
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
    c.strokeStyle = css(P.tampaDoPoteEscura);
    c.lineWidth = 3;
    c.beginPath();
    c.arc(64, 64, 52, 0, Math.PI * 2);
    c.stroke();
    // os furos: um no meio e dois anéis em volta, com a rebarba clara de prego
    const furos: Array<[number, number]> = [[64, 64]];
    for (const [r, n] of [[18, 6], [34, 11]] as const) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r * 0.05;
        furos.push([64 + Math.cos(a) * r, 64 + Math.sin(a) * r]);
      }
    }
    for (const [x, y] of furos) {
      c.fillStyle = '#fbe9b8';
      c.beginPath();
      c.arc(x + 0.8, y + 0.8, 3.6, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#3a2c14';
      c.beginPath();
      c.arc(x, y, 2.6, 0, Math.PI * 2);
      c.fill();
    }
  }
  texturaDaTampa = new THREE.CanvasTexture(tela);
  texturaDaTampa.colorSpace = THREE.SRGBColorSpace;
  return texturaDaTampa;
}

let texturaDaEtiqueta: THREE.CanvasTexture | null = null;
/** a etiqueta de papel: "vaga-lumes" à mão, um coraçãozinho e o furo do barbante */
function etiqueta(): THREE.CanvasTexture {
  if (texturaDaEtiqueta) return texturaDaEtiqueta;
  const tela = document.createElement('canvas');
  tela.width = 128;
  tela.height = 80;
  const c = tela.getContext('2d');
  if (c) {
    c.fillStyle = css(P.etiquetaDoPote);
    c.fillRect(0, 0, 128, 80);
    c.fillStyle = '#5a4630';
    c.font = 'bold 22px Caveat, "Comic Sans MS", cursive';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('vaga-lumes', 70, 34);
    c.fillStyle = '#e8607a';
    const x = 70;
    const y = 58;
    c.beginPath();
    c.moveTo(x, y + 8);
    c.bezierCurveTo(x - 10, y, x - 7, y - 9, x, y - 4);
    c.bezierCurveTo(x + 7, y - 9, x + 10, y, x, y + 8);
    c.fill();
    c.fillStyle = '#c9b48c';
    c.beginPath();
    c.arc(14, 40, 6, 0, Math.PI * 2);
    c.fill();
  }
  texturaDaEtiqueta = new THREE.CanvasTexture(tela);
  texturaDaEtiqueta.colorSpace = THREE.SRGBColorSpace;
  return texturaDaEtiqueta;
}

/** perfil torneado `[raio, altura]` de baixo para cima */
const torneado = (perfil: ReadonlyArray<readonly [number, number]>, segs = 24): THREE.LatheGeometry =>
  new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), segs);

/** o gargalo: onde a tampa senta */
const GARGALO = 0.118;
const RAIO_DA_BOCA = 0.036;

interface Dentro {
  /** onde ele está, no quadro do pote */
  p: THREE.Vector3;
  v: THREE.Vector3;
  pisca: number;
  periodo: number;
  /** entrando: de onde veio (no quadro do pote) e quanto já voou (0 a 1); -1 já está dentro */
  entra: number;
  de: THREE.Vector3;
}

export class PoteDeVagaLumes {
  readonly group = new THREE.Group();
  private readonly tampa = new THREE.Group();
  private readonly pontos: THREE.InstancedMesh;
  private readonly halos: THREE.InstancedMesh;
  private readonly clarao: THREE.Sprite;
  private readonly dentro: Dentro[] = [];
  private readonly m = new THREE.Object3D();
  private readonly cor = new THREE.Color();
  private relogio = 0;
  private abre = 0;
  private alvoDaTampa = 0;
  /** quem espera o último que entrou (o `pegar`), no relógio do pote */
  private readonly aoEntrar: Array<() => void> = [];

  constructor() {
    const g = this.group;
    g.name = 'pote-de-vaga-lumes';
    g.userData.peca = 'pote-de-vaga-lumes';
    // o vidro: o fundo grosso (opaco, meio verde) e o corpo transparente
    por(g, torneado([[0.0001, 0], [0.038, 0], [0.043, 0.004], [0.044, 0.012], [0.0001, 0.012]]), toon(P.vidroDoPote, { opacity: 0.75 }));
    const vidro = por(g, torneado([
      [0.044, 0.004], [0.047, 0.03], [0.047, 0.085], [0.043, 0.1], [0.036, 0.108], [0.035, GARGALO],
    ], 28), toon(P.vidroDoPote, { opacity: 0.28, doubleSide: true }));
    vidro.renderOrder = 8;
    // o brilho do vidro: um risco claro de um lado, de cima a baixo
    const risco = por(g, new THREE.PlaneGeometry(0.008, 0.07), flat(0xffffff, 0.45), -0.03, 0.058, 0.035);
    risco.rotation.y = -0.7;
    risco.renderOrder = 9;
    // a rosca do gargalo: dois aneizinhos
    for (const y of [0.11, 0.115]) {
      const anel = por(g, new THREE.TorusGeometry(0.0358, 0.0016, 4, 28).rotateX(Math.PI / 2), toon(P.vidroDoPote, { opacity: 0.5 }), 0, y, 0);
      anel.renderOrder = 8;
    }
    // o barbante: uma volta no gargalo, o laço e as duas pontas caindo
    const barbante = toon(P.barbante);
    por(g, new THREE.TorusGeometry(0.0375, 0.0022, 5, 28).rotateX(Math.PI / 2), barbante, 0, 0.103, 0);
    for (const s of [-1, 1]) {
      const alca = new THREE.TorusGeometry(0.0075, 0.0018, 5, 12);
      const m = por(g, alca, barbante, s * 0.009, 0.104, 0.04);
      m.rotation.set(0, 0, s * 0.5);
      const ponta = new THREE.CatmullRomCurve3([
        new THREE.Vector3(s * 0.002, 0.102, 0.041), new THREE.Vector3(s * 0.007, 0.088, 0.046), new THREE.Vector3(s * 0.005, 0.072, 0.048),
      ]);
      por(g, new THREE.TubeGeometry(ponta, 8, 0.0017, 4, false), barbante);
    }
    // a etiqueta pendurada no barbante
    const papel = por(g, new THREE.PlaneGeometry(0.036, 0.0225), toon(0xffffff, { mapa: etiqueta(), doubleSide: true }), 0.016, 0.066, 0.051);
    papel.rotation.set(-0.12, 0.2, -0.18);
    // a alça de arame: presa no anel do gargalo, arqueando por cima
    const arame = toon(P.arameDoPote);
    por(g, new THREE.TorusGeometry(0.0372, 0.0014, 4, 28).rotateX(Math.PI / 2), arame, 0, 0.098, 0);
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.0375, 0.098, 0), new THREE.Vector3(-0.034, 0.15, 0), new THREE.Vector3(0, 0.178, 0),
      new THREE.Vector3(0.034, 0.15, 0), new THREE.Vector3(0.0375, 0.098, 0),
    ]);
    por(g, new THREE.TubeGeometry(curva, 24, 0.0017, 5, false), arame);

    // a tampa de lata, na dobradiça do lado de trás
    this.tampa.name = 'tampa';
    this.tampa.position.set(0, GARGALO, -RAIO_DA_BOCA);
    g.add(this.tampa);
    const lata = toon(P.tampaDoPote);
    por(this.tampa, new THREE.CylinderGeometry(0.0395, 0.0395, 0.009, 28, 1, true), lata, 0, 0.0045, RAIO_DA_BOCA);
    const topo = por(this.tampa, new THREE.CircleGeometry(0.0395, 28).rotateX(-Math.PI / 2), toon(0xffffff, { mapa: tampaFurada() }), 0, 0.0091, RAIO_DA_BOCA);
    topo.renderOrder = 1;
    por(this.tampa, new THREE.TorusGeometry(0.0395, 0.0014, 4, 28).rotateX(Math.PI / 2), toon(P.tampaDoPoteEscura), 0, 0.009, RAIO_DA_BOCA);

    // os vaga-lumes lá dentro, e o clarão do pote
    this.pontos = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0055, 8, 6), flat(P.vagaLume), CABEM_NO_POTE);
    this.halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.vagaLumeBrilho, 0.95), CABEM_NO_POTE);
    this.halos.renderOrder = 62;
    for (const lote of [this.pontos, this.halos]) {
      lote.frustumCulled = false;
      lote.userData.semSombra = true;
      lote.count = 0;
      g.add(lote);
    }
    this.clarao = new THREE.Sprite(brilhoDeLuz(P.vagaLumeBrilho, 0.6));
    this.clarao.position.y = 0.06;
    this.clarao.renderOrder = 61;
    this.clarao.visible = false;
    g.add(this.clarao);
  }

  /** quantos estão dentro (os que ainda estão voando para dentro contam) */
  get quantos(): number {
    return this.dentro.length;
  }

  get cheio(): boolean {
    return this.dentro.length >= CABEM_NO_POTE;
  }

  /** a tampa aberta (0 a 1): o teste e a cena olham */
  get aberta(): number {
    return this.abre;
  }

  /**
   * PEGA UM: a tampa abre, o vaga-lume voa de onde estava (no mundo) para a
   * boca do pote e entra, e a tampa fecha. Resolve com ele dentro.
   */
  pegar(deOnde: THREE.Vector3): Promise<void> {
    if (this.cheio) return Promise.resolve();
    this.group.updateWorldMatrix(true, false);
    const de = this.group.worldToLocal(deOnde.clone());
    this.dentro.push({
      p: de.clone(), v: new THREE.Vector3(), pisca: Math.random() * 3, periodo: 1.6 + Math.random() * 1.8, entra: 0, de,
    });
    this.alvoDaTampa = 1;
    return new Promise((fim) => {
      this.aoEntrar.push(fim);
    });
  }

  /** ABRE E SOLTA TODOS: devolve quantos saíram e onde estavam (no mundo), para o voo de saída */
  soltarTodos(): THREE.Vector3[] {
    this.group.updateWorldMatrix(true, false);
    for (const fim of this.aoEntrar.splice(0)) fim();
    const saem = this.dentro.map((d) => this.group.localToWorld(d.p.clone()));
    this.dentro.length = 0;
    this.abre = 1;
    this.alvoDaTampa = 0;
    return saem;
  }

  /** `brilho`: quanto da noite já chegou (de dia eles ficam quietinhos, apagados) */
  update(dt: number, brilho: number): void {
    this.relogio += dt;
    // a tampa: abre rápido, fecha com um tranquinho
    const k = this.alvoDaTampa > this.abre ? 7 : 5;
    this.abre += (this.alvoDaTampa - this.abre) * Math.min(1, dt * k);
    this.tampa.rotation.x = -this.abre * 1.9;
    const n = this.dentro.length;
    this.pontos.count = n;
    this.halos.count = n;
    let aceso = 0;
    for (let i = 0; i < n; i++) {
      const d = this.dentro[i];
      if (d.entra >= 0) {
        // voando para dentro: um arco até a boca, e a queda lá dentro
        d.entra = Math.min(1, d.entra + dt / 0.75);
        const s = d.entra * d.entra * (3 - 2 * d.entra);
        const boca = new THREE.Vector3(0, GARGALO + 0.02, 0);
        d.p.lerpVectors(d.de, boca, Math.min(1, s * 1.15));
        d.p.y += Math.sin(Math.PI * d.entra) * 0.08;
        if (d.entra >= 1) {
          d.entra = -1;
          d.p.set((Math.random() - 0.5) * 0.04, 0.06, (Math.random() - 0.5) * 0.04);
        }
      } else {
        // lá dentro: voam devagar e batem de leve no vidro
        d.v.x += (Math.random() - 0.5) * dt * 0.3;
        d.v.y += (Math.random() - 0.5) * dt * 0.3;
        d.v.z += (Math.random() - 0.5) * dt * 0.3;
        d.v.clampLength(0, 0.035);
        d.p.addScaledVector(d.v, dt);
        const r = Math.hypot(d.p.x, d.p.z);
        if (r > 0.034) {
          d.p.x *= 0.034 / r;
          d.p.z *= 0.034 / r;
          d.v.x *= -0.6;
          d.v.z *= -0.6;
        }
        if (d.p.y < 0.022 || d.p.y > 0.098) {
          d.p.y = THREE.MathUtils.clamp(d.p.y, 0.022, 0.098);
          d.v.y *= -0.6;
        }
      }
      d.pisca += dt;
      const fase = (d.pisca % d.periodo) / d.periodo;
      const pulso = fase < 0.3 ? Math.sin((fase / 0.3) * Math.PI * 0.5) : fase < 0.65 ? Math.cos(((fase - 0.3) / 0.35) * Math.PI * 0.5) : 0;
      // de dia, ainda se vê o pontinho verde (mas sem halo)
      const luz = (0.15 + 0.85 * pulso) * brilho;
      aceso += luz;
      this.m.position.copy(d.p);
      this.m.scale.setScalar(0.6 + 0.4 * Math.max(luz, 0.4));
      this.m.updateMatrix();
      this.pontos.setMatrixAt(i, this.m.matrix);
      this.m.scale.setScalar(0.07);
      this.m.updateMatrix();
      this.halos.setMatrixAt(i, this.m.matrix);
      this.halos.setColorAt(i, this.cor.setScalar(luz));
    }
    this.pontos.instanceMatrix.needsUpdate = true;
    this.halos.instanceMatrix.needsUpdate = true;
    if (this.halos.instanceColor) this.halos.instanceColor.needsUpdate = true;
    this.halos.visible = brilho > 0.01;
    // todos lá dentro: a tampa fecha e quem esperava segue
    if (this.aoEntrar.length && this.dentro.every((d) => d.entra < 0)) {
      this.alvoDaTampa = 0;
      for (const fim of this.aoEntrar.splice(0)) fim();
    }
    // o clarão do pote cresce com quantos estão acesos
    this.clarao.visible = brilho > 0.01 && n > 0;
    this.clarao.scale.setScalar(0.12 + 0.07 * Math.sqrt(aceso));
  }
}

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

/** um ponto de vaga-lumes soltos, como o save guarda (no mundo da cena) */
export interface PontoDeVagaLumes {
  x: number;
  z: number;
  n: number;
}

interface Solto {
  /** o centro da roda dele e o jeito de rodar */
  cx: number;
  cz: number;
  raio: number;
  altura: number;
  w: number;
  fase: number;
  sobe: number;
  pisca: number;
  periodo: number;
  /** saindo do pote: de onde (no mundo) e quanto já voou (0 a 1); -1 já está na roda */
  sai: number;
  de: THREE.Vector3;
}

/** quantos soltos cabem, de todos os pontos juntos (os mais antigos dão lugar) */
const CABEM_SOLTOS = 160;
const POCAS = 24;

/**
 * OS VAGA-LUMES SOLTOS: cada ponto onde a dupla abriu o pote vira uma
 * nuvenzinha que roda ali para sempre, com a poça de luz verde no chão.
 */
export class VagaLumesSoltos {
  readonly group = new THREE.Group();
  private readonly pontos: THREE.InstancedMesh;
  private readonly halos: THREE.InstancedMesh;
  private readonly pocas: THREE.InstancedMesh;
  private readonly soltos: Solto[] = [];
  private readonly lugares: PontoDeVagaLumes[] = [];
  private readonly m = new THREE.Object3D();
  private readonly cor = new THREE.Color();
  private relogio = 0;

  constructor() {
    this.group.userData.peca = 'vaga-lumes-soltos';
    this.pontos = new THREE.InstancedMesh(new THREE.SphereGeometry(0.024, 8, 6), flat(P.vagaLume), CABEM_SOLTOS);
    this.halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.vagaLumeBrilho, 0.95), CABEM_SOLTOS);
    this.halos.renderOrder = 62;
    // a poça de luz no chão, uma por ponto (deitada, somada ao que está embaixo)
    this.pocas = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), luzNoChao(P.vagaLumeBrilho, 0.72), POCAS);
    this.pocas.renderOrder = 2;
    for (const lote of [this.pontos, this.halos, this.pocas]) {
      lote.frustumCulled = false;
      lote.userData.semSombra = true;
      lote.count = 0;
      this.group.add(lote);
    }
  }

  /** os pontos de agora (na ordem em que foram soltos) */
  get lista(): readonly PontoDeVagaLumes[] {
    return this.lugares;
  }

  get quantos(): number {
    return this.soltos.length;
  }

  /** os que já estavam soltos (do save): aparecem já rodando, sem o voo de saída */
  carregar(lista: readonly PontoDeVagaLumes[]): void {
    for (const l of lista) this.soltar(l.x, l.z, l.n, []);
  }

  /**
   * SOLTA `n` VAGA-LUMES em `(x, z)`: saem de `de` (onde estavam no pote, no
   * mundo; vazio = já nascem na roda) e vão rodar ali.
   */
  soltar(x: number, z: number, n: number, de: readonly THREE.Vector3[]): void {
    if (n <= 0) return;
    this.lugares.push({ x, z, n });
    while (this.lugares.length > POCAS) {
      const velho = this.lugares.shift();
      if (velho) this.soltos.splice(0, velho.n);
    }
    for (let i = 0; i < n; i++) {
      const voa = de[i];
      this.soltos.push({
        cx: x, cz: z,
        raio: 0.22 + Math.random() * 0.55,
        altura: 0.3 + Math.random() * 1.1,
        w: (0.25 + Math.random() * 0.35) * (Math.random() < 0.5 ? -1 : 1),
        fase: Math.random() * Math.PI * 2,
        sobe: Math.random() * Math.PI * 2,
        pisca: Math.random() * 3,
        periodo: 1.8 + Math.random() * 2.4,
        sai: voa ? 0 : -1,
        de: voa ? voa.clone() : new THREE.Vector3(),
      });
    }
    while (this.soltos.length > CABEM_SOLTOS) this.soltos.shift();
  }

  update(dt: number, brilho: number): void {
    this.relogio += dt;
    this.group.visible = brilho > 0.01 && this.soltos.length > 0;
    if (!this.group.visible) return;
    const t = this.relogio;
    const n = this.soltos.length;
    this.pontos.count = n;
    this.halos.count = n;
    for (let i = 0; i < n; i++) {
      const s = this.soltos[i];
      const a = s.fase + t * s.w;
      const alvo = new THREE.Vector3(
        s.cx + Math.cos(a) * s.raio,
        s.altura + Math.sin(t * 0.7 + s.sobe) * 0.12,
        s.cz + Math.sin(a) * s.raio,
      );
      if (s.sai >= 0) {
        // saindo do pote: espalham num arco para cima antes de achar a roda
        s.sai = Math.min(1, s.sai + dt / 1.6);
        const k = s.sai * s.sai * (3 - 2 * s.sai);
        alvo.lerpVectors(s.de, alvo, k);
        alvo.y += Math.sin(Math.PI * s.sai) * 0.35;
        if (s.sai >= 1) s.sai = -1;
      }
      s.pisca += dt;
      const fase = (s.pisca % s.periodo) / s.periodo;
      const pulso = fase < 0.25 ? Math.sin((fase / 0.25) * Math.PI * 0.5) : fase < 0.6 ? Math.cos(((fase - 0.25) / 0.35) * Math.PI * 0.5) : 0;
      const luz = (0.08 + 0.92 * pulso) * brilho;
      this.m.position.copy(alvo);
      this.m.scale.setScalar(0.35 + 0.65 * luz);
      this.m.updateMatrix();
      this.pontos.setMatrixAt(i, this.m.matrix);
      this.m.scale.setScalar(0.36);
      this.m.updateMatrix();
      this.halos.setMatrixAt(i, this.m.matrix);
      this.halos.setColorAt(i, this.cor.setScalar(luz));
    }
    // a poça: o tamanho pelo tanto que tem, e respirando devagar
    this.pocas.count = this.lugares.length;
    for (let i = 0; i < this.lugares.length; i++) {
      const l = this.lugares[i];
      this.m.position.set(l.x, 0.004, l.z);
      this.m.scale.setScalar(1.1 + Math.sqrt(l.n) * 0.42 + Math.sin(t * 0.9 + i) * 0.05);
      this.m.updateMatrix();
      this.pocas.setMatrixAt(i, this.m.matrix);
      this.pocas.setColorAt(i, this.cor.setScalar(brilho * Math.min(1, 0.6 + l.n * 0.07)));
    }
    for (const lote of [this.pontos, this.halos, this.pocas]) {
      lote.instanceMatrix.needsUpdate = true;
      if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
    }
  }
}
