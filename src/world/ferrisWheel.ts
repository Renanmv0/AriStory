import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon, flat } from '../core/materials';
import { letreiro } from './props';
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

const TAU = Math.PI * 2;
const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
const EIXO_Y = V(0, 1, 0);
const V2 = (x: number, y: number): THREE.Vector2 => new THREE.Vector2(x, y);

/** Cilindro de `a` até `b` (raio `r` em `a`, `r2` em `b`), sem tampa: a ponta mora dentro de outra peça. */
function tubo(a: THREE.Vector3, b: THREE.Vector3, r: number, gomos = 6, r2 = r, tampa = false): THREE.BufferGeometry {
  const d = new THREE.Vector3().subVectors(b, a);
  const geo = new THREE.CylinderGeometry(r2, r, d.length(), gomos, 1, !tampa);
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(EIXO_Y, d.normalize()));
  geo.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  return geo;
}

/**
 * Junta geometrias de origens diferentes numa só: extrusão (sem índice) com
 * cilindro e toro (com índice), guardando só o que o material lê.
 */
function juntar(geos: THREE.BufferGeometry[], comUv = false, comCor = false): THREE.BufferGeometry {
  const prontas = geos.map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    for (const nome of Object.keys(n.attributes)) {
      if (nome === 'position' || nome === 'normal') continue;
      if ((nome === 'uv' && comUv) || (nome === 'color' && comCor)) continue;
      n.deleteAttribute(nome);
    }
    return n;
  });
  const geo = mergeGeometries(prontas, false);
  if (!geo) throw new Error('roda gigante: geometrias que não juntam');
  return geo;
}

/** Pinta a geometria inteira de uma cor (para a malha de cor por vértice). */
function pintar(geo: THREE.BufferGeometry, cor: number): THREE.BufferGeometry {
  const c = new THREE.Color(cor);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

/** Coração extrudado, de pé no plano XY, com a frente em +Z. */
function geoCoracao(t: number, prof: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5 * t);
  s.bezierCurveTo(-0.15 * t, -0.3 * t, -0.5 * t, -0.05 * t, -0.5 * t, 0.18 * t);
  s.bezierCurveTo(-0.5 * t, 0.42 * t, -0.22 * t, 0.52 * t, 0, 0.3 * t);
  s.bezierCurveTo(0.22 * t, 0.52 * t, 0.5 * t, 0.42 * t, 0.5 * t, 0.18 * t);
  s.bezierCurveTo(0.5 * t, -0.05 * t, 0.15 * t, -0.3 * t, 0, -0.5 * t);
  return new THREE.ExtrudeGeometry(s, { depth: prof, bevelEnabled: false, curveSegments: 6 });
}

/** Lâmpadas de parque: UM lote, acesas pelo material. */
function lampadas(pontos: THREE.Vector3[], raio: number): THREE.InstancedMesh {
  const lote = new THREE.InstancedMesh(
    new THREE.SphereGeometry(raio, 8, 6), toon(P.luzDoPortao, { glow: 0.9 }), pontos.length,
  );
  const m = new THREE.Matrix4();
  pontos.forEach((p, i) => lote.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)));
  lote.instanceMatrix.needsUpdate = true;
  lote.userData.semSombra = true;
  lote.castShadow = false;
  return lote;
}

/** Corda de veludo (ou corrente) que cede entre dois postes. */
function corda(a: THREE.Vector3, b: THREE.Vector3, cede: number, r: number): THREE.BufferGeometry {
  const meio = a.clone().lerp(b, 0.5);
  meio.y -= cede * 2;
  const curva = new THREE.QuadraticBezierCurve3(a, meio, b);
  return new THREE.TubeGeometry(curva, 10, r, 5, false);
}

/**
 * O PISO DE MOSAICO da laje, em raios: o chão de carrossel antigo. Desenhado
 * uma vez num canvas e mapeado no disco do topo (o UV do `CircleGeometry` é o
 * quadrado inteiro, então o desenho é redondo e cabe certinho).
 */
let mosaico: THREE.CanvasTexture | null = null;
function pisoDeMosaico(): THREE.CanvasTexture {
  if (mosaico) return mosaico;
  const L = 1024;
  const m = L / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = L;
  const ctx = canvas.getContext('2d')!;
  const css = (n: number): string => `#${n.toString(16).padStart(6, '0')}`;
  ctx.fillStyle = css(P.rodaMosaicoClaro);
  ctx.fillRect(0, 0, L, L);
  // os raios, do miolo até a borda
  const GOMOS = 32;
  ctx.fillStyle = css(P.rodaMosaicoEscuro);
  for (let i = 0; i < GOMOS; i += 2) {
    ctx.beginPath();
    ctx.moveTo(m, m);
    ctx.arc(m, m, m * 0.985, (i / GOMOS) * TAU, ((i + 1) / GOMOS) * TAU);
    ctx.closePath();
    ctx.fill();
  }
  // o miolo e as duas faixas de ladrilho, uma no meio e uma na borda
  const anel = (r0: number, r1: number, cor: string): void => {
    ctx.beginPath();
    ctx.arc(m, m, m * r1, 0, TAU);
    ctx.arc(m, m, m * r0, 0, TAU, true);
    ctx.fillStyle = cor;
    ctx.fill();
  };
  anel(0, 0.2, css(P.rodaMosaicoClaro));
  anel(0.2, 0.235, css(P.rodaVermelho));
  anel(0.55, 0.6, css(P.rodaMosaicoEscuro));
  anel(0.9, 0.985, css(P.rodaVermelho));
  // o rejunte: anéis e raios finos e claros, que dizem "ladrilho" de perto
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (let r = 0.235; r < 0.9; r += 0.046) {
    ctx.beginPath();
    ctx.arc(m, m, m * r, 0, TAU);
    ctx.stroke();
  }
  for (let i = 0; i < GOMOS * 3; i++) {
    const a = (i / (GOMOS * 3)) * TAU;
    ctx.beginPath();
    ctx.moveTo(m + Math.cos(a) * m * 0.235, m + Math.sin(a) * m * 0.235);
    ctx.lineTo(m + Math.cos(a) * m * 0.9, m + Math.sin(a) * m * 0.9);
    ctx.stroke();
  }
  // a estrela do miolo
  ctx.beginPath();
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * TAU - Math.PI / 2;
    const r = (i % 2 === 0 ? 0.18 : 0.08) * m;
    const x = m + Math.cos(a) * r;
    const y = m + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.fillStyle = css(P.gold);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  mosaico = tex;
  return tex;
}

/**
 * QUANTO A GÔNDOLA PENDE ABAIXO DO EIXO. A cabine de roda gigante não é uma
 * conta no aro: ela PENDURA num eixo entre os dois aros e fica sempre em pé.
 * A âncora da cabine (`cabins[i]`) continua sendo o ponto do aro — é o eixo —,
 * e o corpo dela mora `CAIDA` abaixo.
 */
const CAIDA = 1.35;
/** o piso da cabine, medido do centro da casca (o interior foi feito nesta régua) */
const PISO_DA_CASCA = -0.34;

/**
 * A roda gigante do Villa Lobos, em versao fofa.
 * O aro gira em torno do eixo Z; as cabines ficam FORA do grupo que gira e sao
 * reposicionadas a cada frame, entao elas nunca viram de cabeca para baixo.
 * A roda inteira olha para +Z quando group.rotation.y === 0.
 *
 * A REFORMA DE OUTUBRO (o Renan pediu a área inteira mais bonita):
 * - o ARO é uma treliça de verdade — dois anéis por lado com o zigue-zague
 *   entre eles, a coroa vermelha no meio dos raios, os raios CRUZADOS (cada um
 *   sai do miolo um tico adiantado ou atrasado, o desenho de roda de
 *   bicicleta) e a roseta de pétalas com o miolo dourado no centro;
 * - as LUZINHAS dão a volta no aro e na coroa: um lote só, acesas pelo
 *   material, girando junto;
 * - as CABINES são gôndolas penduradas (a `CAIDA`), BRANCAS como as do
 *   parque de verdade (o Renan conferiu), com o coração na barriga, o
 *   caixilho da janela e a forquilha até o eixo. São QUATRO LOTES para as 32 (corpo, acabamento,
 *   vidro e forquilha): a matriz de cada uma é refeita por quadro, e a âncora
 *   de cada cabine continua sendo um `Group` — é nele que a dupla monta;
 * - as PERNAS viraram dois cavaletes de treliça (as pernas afinando, as
 *   travessas e os X), com sapata vermelha no pé e o mancal dourado no alto.
 */
export class FerrisWheel {
  readonly group = new THREE.Group();
  /** as âncoras das cabines (o ponto do eixo de cada uma): é nelas que a dupla monta */
  readonly cabins: THREE.Group[] = [];

  readonly radius: number;
  readonly hubHeight: number;
  /** velocidade angular em rad/s */
  speed: number;
  angle = 0;

  private readonly rim = new THREE.Group();
  private readonly cabinCount: number;
  /** as duas rodas de atrito que empurram o aro: elas giram junto */
  private readonly pneus: THREE.Group[] = [];
  /** a catraca do embarque; a cena gira o braço quando alguém passa */
  private catraca: THREE.Group | null = null;
  /** o interior da cabine: um só, que muda de cabine na hora do passeio */
  private readonly interior: THREE.Group;
  /** os quatro lotes das gôndolas, refeitos a cada quadro */
  private readonly corpos: THREE.InstancedMesh;
  private readonly acabamentos: THREE.InstancedMesh;
  private readonly vidros: THREE.InstancedMesh;
  private readonly forquilhas: THREE.InstancedMesh;
  /** a cabine que tem gente dentro: perde a forquilha e o caixilho (de dentro eles tapavam a vista) */
  private ocupada = -1;

  constructor(opts: FerrisWheelOptions = {}) {
    // etiqueta para o caçador de z-fighting e para os testes acharem a peça
    this.group.userData.peca = 'roda-gigante';
    const R = (this.radius = opts.radius ?? 12);
    const count = (this.cabinCount = opts.cabins ?? 32);
    this.speed = ((opts.rpm ?? 0.9) * Math.PI * 2) / 60;
    const frameMat = toon(opts.frameColor ?? P.metalWhite);
    // 30 cm mais alto que a roda antiga: a gôndola agora pende abaixo do eixo,
    // e a de baixo tem que passar acima da laje
    const hubY = (this.hubHeight = R + 2.9);
    const spread = R * 0.075; // distancia entre os dois aros

    // ------------------------------------------------------------- o aro
    const branco: THREE.BufferGeometry[] = [];
    const vermelho: THREE.BufferGeometry[] = [];
    const dourado: THREE.BufferGeometry[] = [];
    const DENTRO = R - 0.85; // o anel de dentro da treliça
    const luzes: THREE.Vector3[] = [];
    for (const s of [-1, 1] as const) {
      const z = s * spread;
      branco.push(new THREE.TorusGeometry(R, 0.17, 6, 128).translate(0, 0, z));
      branco.push(new THREE.TorusGeometry(DENTRO, 0.11, 5, 128).translate(0, 0, z));
      // o zigue-zague entre os dois anéis: é ele que faz o aro ler treliça
      const N = 64;
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * TAU;
        const a1 = ((i + 0.5) / N) * TAU;
        const a2 = ((i + 1) / N) * TAU;
        const fora0 = V(Math.cos(a0) * R, Math.sin(a0) * R, z);
        const meio = V(Math.cos(a1) * DENTRO, Math.sin(a1) * DENTRO, z);
        const fora1 = V(Math.cos(a2) * R, Math.sin(a2) * R, z);
        branco.push(tubo(fora0, meio, 0.05, 4), tubo(meio, fora1, 0.05, 4));
      }
      // os raios CRUZADOS: cada um sai do miolo adiantado ou atrasado
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU;
        const desvio = (i % 2 === 0 ? 1 : -1) * 0.42;
        branco.push(tubo(
          V(Math.cos(a + desvio) * 0.9, Math.sin(a + desvio) * 0.9, s * 0.62),
          V(Math.cos(a) * DENTRO, Math.sin(a) * DENTRO, z),
          0.045, 5,
        ));
      }
      // a coroa vermelha no meio dos raios
      vermelho.push(new THREE.TorusGeometry(R * 0.5, 0.1, 6, 96).translate(0, 0, z));
      // as luzinhas: na cara de fora do anel grande e da coroa
      for (let i = 0; i < 48; i++) {
        const a = ((i + 0.5) / 48) * TAU;
        luzes.push(V(Math.cos(a) * R, Math.sin(a) * R, s * (spread + 0.2)));
      }
      for (let i = 0; i < 24; i++) {
        const a = ((i + 0.5) / 24) * TAU;
        luzes.push(V(Math.cos(a) * R * 0.5, Math.sin(a) * R * 0.5, s * (spread + 0.15)));
      }
    }
    // os eixos das gôndolas, de um aro ao outro (cada cabine pendura num)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU;
      const x = Math.cos(a) * R;
      const y = Math.sin(a) * R;
      branco.push(tubo(V(x, y, -spread - 0.12), V(x, y, spread + 0.12), 0.075, 8, 0.075, true));
    }

    // o miolo: o tambor, as duas rosetas de pétalas e a cúpula dourada
    branco.push(new THREE.CylinderGeometry(0.95, 0.95, 1.5, 24).rotateX(Math.PI / 2));
    const flor = new THREE.Shape();
    for (let k = 0; k <= 120; k++) {
      const t = (k / 120) * TAU;
      const r = 1.18 + 0.32 * Math.abs(Math.cos(5 * t));
      if (k === 0) flor.moveTo(Math.cos(t) * r, Math.sin(t) * r);
      else flor.lineTo(Math.cos(t) * r, Math.sin(t) * r);
    }
    const roseta = new THREE.ExtrudeGeometry(flor, { depth: 0.1, bevelEnabled: false, curveSegments: 4 });
    vermelho.push(roseta.clone().translate(0, 0, 0.74), roseta.clone().translate(0, 0, -0.84));
    for (const s of [-1, 1] as const) {
      dourado.push(new THREE.SphereGeometry(0.4, 16, 6, 0, TAU, 0, Math.PI / 2)
        .rotateX((s * Math.PI) / 2).translate(0, 0, s * 0.84));
      // uma bolinha dourada na ponta de cada pétala
      for (let k = 0; k < 10; k++) {
        const t = (k / 10) * TAU;
        dourado.push(new THREE.SphereGeometry(0.085, 8, 5).translate(Math.cos(t) * 1.38, Math.sin(t) * 1.38, s * 0.86));
      }
    }

    const aroBranco = new THREE.Mesh(juntar(branco), frameMat);
    const aroVermelho = new THREE.Mesh(juntar(vermelho), toon(P.rodaVermelho));
    const aroDourado = new THREE.Mesh(juntar(dourado), toon(P.gold));
    this.rim.add(aroBranco, aroVermelho, aroDourado, lampadas(luzes, 0.12));
    this.rim.name = 'aro';
    this.rim.position.y = hubY;
    this.group.add(this.rim);

    // ------------------------------------------------------------ cabines
    /*
     * A GÔNDOLA, em quatro lotes. O corpo (a bacia de baixo e o domo de cima)
     * é branco, como no parque de verdade; o acabamento (os
     * aros da janela, o caixilho, o coração, a bolinha do domo) tem a cor
     * pintada nos vértices; o vidro é a faixa da janela; e a forquilha vai do
     * domo até o eixo. Tudo em volta da âncora: o corpo mora `CAIDA` abaixo.
     */
    const Z = 0.92; // a cápsula é um tico espremida em z, como a antiga
    const bacia = new THREE.LatheGeometry([
      new THREE.Vector2(0, -1.02), new THREE.Vector2(0.3, -1.0), new THREE.Vector2(0.56, -0.92),
      new THREE.Vector2(0.72, -0.78), new THREE.Vector2(0.8, -0.6), new THREE.Vector2(0.83, -0.42),
      new THREE.Vector2(0.835, -0.28),
    ], 24);
    const domo = new THREE.LatheGeometry([
      new THREE.Vector2(0.86, 0.5), new THREE.Vector2(0.84, 0.62), new THREE.Vector2(0.74, 0.78),
      new THREE.Vector2(0.55, 0.92), new THREE.Vector2(0.3, 1.0), new THREE.Vector2(0, 1.03),
    ], 24);
    const geoCorpo = juntar([bacia, domo]).scale(1, 1, Z).translate(0, -CAIDA, 0);

    const branca = (g: THREE.BufferGeometry): THREE.BufferGeometry => pintar(g, P.metalWhite);
    const acab: THREE.BufferGeometry[] = [
      branca(new THREE.TorusGeometry(0.845, 0.045, 5, 28).rotateX(Math.PI / 2).translate(0, -0.29, 0)),
      branca(new THREE.TorusGeometry(0.875, 0.05, 5, 28).rotateX(Math.PI / 2).translate(0, 0.5, 0)),
      pintar(new THREE.SphereGeometry(0.09, 10, 6).translate(0, 1.06, 0), P.gold),
      pintar(new THREE.SphereGeometry(0.07, 8, 5).translate(0, -1.03, 0), P.gold),
    ];
    for (let k = 0; k < 8; k++) {
      const a = ((k + 0.5) / 8) * TAU;
      acab.push(branca(new THREE.BoxGeometry(0.045, 0.8, 0.045).translate(Math.cos(a) * 0.84, 0.11, Math.sin(a) * 0.84)));
    }
    const coracao = geoCoracao(0.34, 0.03);
    acab.push(pintar(coracao.clone().translate(0, -0.62, 0.79), P.rodaVermelho));
    acab.push(pintar(coracao.clone().rotateY(Math.PI).translate(0, -0.62, -0.79), P.rodaVermelho));
    const geoAcabamento = juntar(acab, false, true).scale(1, 1, Z).translate(0, -CAIDA, 0);

    const geoVidro = new THREE.CylinderGeometry(0.835, 0.835, 0.8, 24, 1, true)
      .scale(1, 1, Z).translate(0, 0.11 - CAIDA, 0);

    // a forquilha: a luva no eixo e os dois braços até o domo
    const topoDoDomo = 0.8 - CAIDA;
    const geoForquilha = juntar([
      new THREE.CylinderGeometry(0.11, 0.11, 1.36, 10).rotateX(Math.PI / 2),
      tubo(V(0, 0, 0.6), V(0, topoDoDomo, 0.6), 0.045, 6),
      tubo(V(0, 0, -0.6), V(0, topoDoDomo, -0.6), 0.045, 6),
      tubo(V(0, topoDoDomo, -0.6), V(0, topoDoDomo, 0.6), 0.04, 6),
    ]);

    const lote = (geo: THREE.BufferGeometry, mat: THREE.Material): THREE.InstancedMesh => {
      const m = new THREE.InstancedMesh(geo, mat, count);
      m.frustumCulled = false; // elas andam: a esfera envolvente de nascença não vale
      this.group.add(m);
      return m;
    };
    this.corpos = lote(geoCorpo, toon(opts.cabinColor ?? P.metalWhite));
    this.acabamentos = lote(geoAcabamento, toon(0xffffff, { corPorVertice: true }));
    this.vidros = lote(geoVidro, toon(P.glass, { opacity: 0.45 }));
    this.vidros.userData.semSombra = true;
    this.forquilhas = lote(geoForquilha, toon(P.metalGrey));
    for (let i = 0; i < count; i++) {
      const ancora = new THREE.Group();
      this.cabins.push(ancora);
      this.group.add(ancora);
    }
    this.interior = this.montarOInterior();
    this.interior.position.y = -CAIDA;
    this.group.add(this.interior);

    // ------------------------------------------------------- os cavaletes
    /*
     * Dois cavaletes de treliça, um de cada lado do aro: as pernas afinam até
     * o mancal, com travessas e X entre elas. Os pés são os de antes (os
     * blocos de fundação, a laje e o colisor da cena contam com eles).
     */
    const legSpan = R * 0.42;
    const estrutura: THREE.BufferGeometry[] = [];
    const sapatas: THREE.BufferGeometry[] = [];
    const mancais: THREE.BufferGeometry[] = [];
    for (const s of [-1, 1] as const) {
      const topo = V(0, hubY, s * 1.45);
      const pes = [V(-R * 0.2, 0.72, s * legSpan), V(R * 0.2, 0.72, s * legSpan)];
      for (const pe of pes) {
        estrutura.push(tubo(pe, topo, 0.3, 10, 0.18));
        sapatas.push(new THREE.CylinderGeometry(0.44, 0.5, 0.14, 14).translate(pe.x, 0.79, pe.z));
      }
      const fracoes = [0.12, 0.34, 0.56, 0.76];
      const degraus = fracoes.map((k) => [pes[0].clone().lerp(topo, k), pes[1].clone().lerp(topo, k)]);
      for (const [a, b] of degraus) estrutura.push(tubo(a, b, 0.1, 6));
      for (let i = 0; i < degraus.length - 1; i++) {
        estrutura.push(
          tubo(degraus[i][0], degraus[i + 1][1], 0.065, 5),
          tubo(degraus[i][1], degraus[i + 1][0], 0.065, 5),
        );
      }
      mancais.push(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 18).rotateX(Math.PI / 2).translate(0, hubY, s * 1.45));
      sapatas.push(new THREE.SphereGeometry(0.3, 14, 6, 0, TAU, 0, Math.PI / 2)
        .rotateX((s * Math.PI) / 2).translate(0, hubY, s * 1.65));
    }
    const cavaletes = new THREE.Mesh(juntar(estrutura), frameMat);
    cavaletes.castShadow = true;
    this.group.add(cavaletes);
    this.group.add(new THREE.Mesh(juntar(sapatas), toon(P.rodaVermelho)));
    this.group.add(new THREE.Mesh(juntar(mancais), toon(P.gold)));
    // o eixo fixo que atravessa o miolo
    const eixo = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 3.2, 14).rotateX(Math.PI / 2), toon(P.metalGrey));
    eixo.position.y = hubY;
    this.group.add(eixo);

    this.montarABase(R, legSpan);

    this.layout();
  }

  /**
   * ================================================== A BASE, E COMO ELA ANDA
   *
   * A roda em si já estava boa; o chão dela era uma laje, quatro tambores lisos
   * e uma caixa cinza. O que faltava era o que uma roda gigante de verdade tem
   * embaixo — e, sobretudo, o que a faz GIRAR: nada ali explicava o movimento.
   *
   * O QUE FOI ACRESCENTADO, e por que cada coisa:
   *
   * - as RODAS DE ATRITO. É assim que roda gigante de verdade anda: dois pneus
   *   pressionam o aro por baixo e empurram. Eles giram de verdade no `update`,
   *   na velocidade certa (`v = ω·R / r`), então quem olhar para o pé da roda vê
   *   a máquina funcionando em vez de um aro girando por mágica;
   * - a CASA DE MÁQUINAS ao lado deles, com respiro e porta: é de onde a força
   *   sai;
   * - os BLOCOS DE FUNDAÇÃO com chumbadores, um por pé. Perna de aço que
   *   encosta no gramado não sustenta sessenta toneladas, e a falta deles era o
   *   que mais fazia a roda parecer pousada em cima do parque;
   * - os CONTRAPESOS deixaram de ser cilindros lisos: cinta, tampa e parafuso;
   * - a PLATAFORMA DE EMBARQUE virou plataforma mesmo — tábuas, degrau, corrimão
   *   de fila, CATRACA e o posto do bilheteiro. É por ela que se entra, e é ela
   *   que dá sentido ao bilhete;
   * - a CERCA DE CORRENTE em volta da laje, com o vão na frente da plataforma:
   *   ela diz onde a pessoa pode pisar sem precisar de nenhum aviso.
   *
   * A ORIENTAÇÃO: `+Z` é a frente (de onde a câmera olha e por onde o jogador
   * chega), e é para lá que vai tudo o que precisa ser visto — a plataforma, a
   * catraca, o toldo. A casa de máquinas fica do lado, em `-X`, para não
   * disputar espaço com o embarque.
   */
  private montarABase(R: number, legSpan: number): void {
    const concreto = toon(P.concrete);
    const madeira = toon(P.wood);
    const madeiraEscura = toon(P.woodDark);
    const metal = toon(P.metalWhite);
    const metalEscuro = toon(P.metalGrey);

    // ---------------------------------------------------------- a laje
    // a lateral de concreto, sem tampa: o topo é o PISO DE MOSAICO em raios,
    // o chão de carrossel antigo (a faixa vermelha da borda é a do desenho)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.62, R * 0.67, 0.35, 48, 1, true), concreto);
    base.position.y = 0.16;
    base.receiveShadow = true;
    this.group.add(base);
    const piso = new THREE.Mesh(
      new THREE.CircleGeometry(R * 0.62, 64).rotateX(-Math.PI / 2),
      toon(0xffffff, { mapa: pisoDeMosaico() }),
    );
    piso.position.y = 0.335;
    piso.receiveShadow = true;
    this.group.add(piso);

    // -------------------------------------------- fundação de cada pé
    for (const [x, z] of [
      [-R * 0.2, -legSpan], [R * 0.2, -legSpan],
      [-R * 0.2, legSpan], [R * 0.2, legSpan],
    ] as const) {
      const bloco = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.92, 0.72, 4), concreto);
      bloco.rotation.y = Math.PI / 4;
      bloco.position.set(x, 0.36, z);
      bloco.castShadow = true;
      this.group.add(bloco);
      // os quatro chumbadores: sem eles o bloco é um cubo de concreto qualquer
      for (const [dx, dz] of [[-0.44, -0.44], [0.44, -0.44], [-0.44, 0.44], [0.44, 0.44]] as const) {
        const parafuso = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 6), metalEscuro);
        parafuso.position.set(x + dx, 0.75, z + dz);
        this.group.add(parafuso);
      }
    }

    // ------------------------------------------------------ contrapesos
    const dx = R * 0.4;
    const dz = legSpan * 0.92;
    for (const [x, z] of [[-dx, -dz], [dx, -dz], [-dx, dz], [dx, dz]] as const) {
      /**
       * MENORES DO QUE ERAM. Com `R·0,055` de raio e `R·0,16` de altura eles
       * ficavam do tamanho da porta da casa de máquinas — quatro tonéis de óleo
       * espalhados pela laje. Contrapeso é baixo e atarracado: ele existe para
       * ficar embaixo, e não para competir com a plataforma.
       */
      const alto = R * 0.105;
      const tambor = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.042, R * 0.046, alto, 12), toon(P.metalRed));
      tambor.position.set(x, alto / 2, z);
      tambor.castShadow = true;
      this.group.add(tambor);
      // as duas cintas e a tampa: é o que separa "tambor" de "cilindro"
      for (const k of [0.32, 0.68] as const) {
        const cinta = new THREE.Mesh(new THREE.TorusGeometry(R * 0.045, 0.03, 5, 14), toon(P.woodDark));
        cinta.rotation.x = Math.PI / 2;
        cinta.position.set(x, alto * k, z);
        this.group.add(cinta);
      }
      const tampa = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.048, R * 0.048, 0.09, 12), metalEscuro);
      tampa.position.set(x, alto + 0.04, z);
      this.group.add(tampa);
    }

    // ----------------------------------------------- as rodas de atrito
    /**
     * ELAS ENCOSTAM NO ARO POR BAIXO, e é daí que sai o movimento.
     *
     * O ponto mais baixo do aro está em `hubHeight − R`; o pneu de raio `r`
     * tocando ali tem o centro em `hubHeight − R − r`. Errar essa conta deixa o
     * pneu ou flutuando ou enterrado no aro, e a peça inteira perde o sentido.
     */
    const raioDoPneu = R * 0.075;
    const alturaDoPneu = this.hubHeight - R - raioDoPneu;
    for (const z of [-R * 0.075, R * 0.075]) {
      const pneu = new THREE.Group();
      const borracha = new THREE.Mesh(
        new THREE.CylinderGeometry(raioDoPneu, raioDoPneu, R * 0.05, 14), toon(P.churrascoCarvao),
      );
      borracha.rotation.x = Math.PI / 2;
      pneu.add(borracha);
      // o cubo claro no meio: é ele que deixa a rotação VISÍVEL. Um pneu preto
      // liso girando parece um pneu preto parado.
      const cubo = new THREE.Mesh(
        new THREE.CylinderGeometry(raioDoPneu * 0.38, raioDoPneu * 0.38, R * 0.056, 10), metal,
      );
      cubo.rotation.x = Math.PI / 2;
      pneu.add(cubo);
      for (const giro of [0, Math.PI / 2] as const) {
        const raio = new THREE.Mesh(
          new THREE.BoxGeometry(raioDoPneu * 1.5, 0.05, R * 0.058), toon(P.metalGrey),
        );
        raio.rotation.z = giro;
        pneu.add(raio);
      }
      pneu.position.set(0, alturaDoPneu, z);
      this.group.add(pneu);
      this.pneus.push(pneu);
      // o braço que segura o pneu contra o aro
      const braco = new THREE.Mesh(new THREE.BoxGeometry(0.16, alturaDoPneu, 0.16), metalEscuro);
      braco.position.set(0, alturaDoPneu / 2, z);
      this.group.add(braco);
    }

    // -------------------------------------------------- casa de máquinas
    const casa = new THREE.Group();
    casa.position.set(-R * 0.5, 0, legSpan * 0.25);
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.5, 1.5), toon(P.wallCream));
    corpo.position.y = 0.75;
    corpo.castShadow = true;
    casa.add(corpo);
    // o telhado é mais LARGO que o corpo, senão as faces laterais dos dois
    // caem no mesmo plano e serrilham na quina
    // o telhado de duas águas, no vermelho de circo, com o oitão creme e a
    // cumeeira dourada (o oitão para 2 cm antes da parede de cada lado)
    const oitao = new THREE.Shape([V2(-0.75, 0), V2(0.75, 0), V2(0, 0.52)]);
    casa.add(new THREE.Mesh(
      new THREE.ExtrudeGeometry(oitao, { depth: 2.06, bevelEnabled: false }).rotateY(Math.PI / 2).translate(-1.03, 1.49, 0),
      toon(P.wallCream),
    ));
    for (const s of [-1, 1] as const) {
      const agua = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.07, 1.06), toon(P.rodaVermelho));
      agua.rotation.x = s * 0.6;
      agua.position.set(0, 1.78, s * 0.43);
      casa.add(agua);
    }
    const cumeeira = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.5, 10).rotateZ(Math.PI / 2), toon(P.gold));
    cumeeira.position.y = 2.06;
    casa.add(cumeeira);
    // a escotilha redonda, que diz "máquina" melhor que uma janela
    const escotilha = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 6, 18), toon(P.gold));
    escotilha.position.set(-0.45, 0.45, 0.78);
    casa.add(escotilha);
    const vidroDaEscotilha = new THREE.Mesh(new THREE.CircleGeometry(0.19, 18), toon(P.churrascoCarvao));
    vidroDaEscotilha.position.set(-0.45, 0.45, 0.765);
    casa.add(vidroDaEscotilha);
    const porta = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.1, 0.06), madeira);
    porta.position.set(0.45, 0.55, 0.78);
    casa.add(porta);
    // o respiro: três lâminas, que é o que diz "tem motor aqui dentro"
    for (let i = 0; i < 3; i++) {
      const lamina = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.07, 0.05), metalEscuro);
      lamina.position.set(-0.45, 1.0 - i * 0.14, 0.78);
      casa.add(lamina);
    }
    this.group.add(casa);

    // ------------------------------------------------------ a plataforma
    /**
     * A PLATAFORMA FICA NA BORDA DA LAJE, e não colada nas pernas: é onde o
     * jogador de fato chega. O colisor da cena bloqueia um círculo de 7,2 em
     * volta do centro, então a frente do deque tem que parar um fio dentro
     * dele — senão a pessoa anda por dentro da madeira.
     */
    const plataforma = new THREE.Group();
    plataforma.position.set(0, 0, 6.0);

    const deque = new THREE.Mesh(new THREE.BoxGeometry(R * 0.62, 0.42, 2.2), madeiraEscura);
    deque.position.y = 0.21;
    deque.receiveShadow = true;
    plataforma.add(deque);
    // as tábuas, um decalque fino por cima do deque
    for (let i = 0; i < 9; i++) {
      const tabua = new THREE.Mesh(new THREE.BoxGeometry(R * 0.6, 0.03, 0.2), madeira);
      tabua.position.set(0, 0.435, -0.96 + i * 0.24);
      plataforma.add(tabua);
    }
    /**
     * DOIS DEGRAUS, e não um. O deque tem 42 cm; um degrau só de 20 deixava um
     * paredão de 22 cm no meio do caminho, que lê como tropeço e não como
     * escada.
     */
    for (const [i, z] of [1.24, 1.56].entries()) {
      const alturaDoDegrau = 0.28 - i * 0.14;
      const degrau = new THREE.Mesh(new THREE.BoxGeometry(2.2, alturaDoDegrau, 0.32), madeiraEscura);
      degrau.position.set(0, alturaDoDegrau / 2, z);
      plataforma.add(degrau);
    }

    // a fila: pedestais de latão com a corda de veludo cedendo entre eles
    const latao: THREE.BufferGeometry[] = [];
    const veludo: THREE.BufferGeometry[] = [];
    for (const lado of [-1, 1] as const) {
      const zs = [-0.7, 0.1, 0.9];
      for (const z of zs) {
        latao.push(new THREE.CylinderGeometry(0.04, 0.05, 0.9, 10).translate(lado * 1.5, 0.87, z));
        latao.push(new THREE.CylinderGeometry(0.14, 0.17, 0.05, 14).translate(lado * 1.5, 0.455, z));
        latao.push(new THREE.SphereGeometry(0.075, 10, 6).translate(lado * 1.5, 1.35, z));
      }
      for (let i = 0; i < zs.length - 1; i++) {
        veludo.push(corda(V(lado * 1.5, 1.25, zs[i]), V(lado * 1.5, 1.25, zs[i + 1]), 0.09, 0.035));
      }
    }
    plataforma.add(new THREE.Mesh(juntar(latao), toon(P.gold)));
    plataforma.add(new THREE.Mesh(juntar(veludo), toon(P.rodaVeludo)));

    /**
     * A CATRACA, no meio do corredor. Três braços a 120°, e é ela que faz o
     * bilhete existir: sem uma catraca no caminho, "comprar bilhete" seria uma
     * regra escrita em lugar nenhum.
     */
    const catraca = new THREE.Group();
    catraca.position.set(0, 0.42, 1.0);
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.95, 12), metalEscuro);
    pedestal.position.y = 0.48;
    catraca.add(pedestal);
    const cabeca = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.16, 12), metal);
    cabeca.position.y = 1.02;
    catraca.add(cabeca);
    for (let i = 0; i < 3; i++) {
      const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), metal);
      braco.rotation.z = Math.PI / 2;
      braco.position.set(Math.cos((i * Math.PI * 2) / 3) * 0.45, 0.95, Math.sin((i * Math.PI * 2) / 3) * 0.45);
      braco.rotation.y = -(i * Math.PI * 2) / 3;
      catraca.add(braco);
    }
    plataforma.add(catraca);
    this.catraca = catraca;

    // o posto do bilheteiro, do lado da catraca: um púlpito com uma luminária
    const pulpito = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.05, 0.6), madeira);
    pulpito.position.set(-1.95, 0.52, 0.9);
    plataforma.add(pulpito);
    const tampoDoPulpito = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.08, 0.74), madeiraEscura);
    tampoDoPulpito.position.set(-1.95, 1.09, 0.9);
    plataforma.add(tampoDoPulpito);

    /**
     * O PÓRTICO, e não um toldo por cima.
     *
     * Aqui havia uma meia-cana vermelha de três metros pairando sobre o
     * embarque, e ela cometia o erro que a cadeira do salva-vidas já pagou:
     * numa câmera de 34°, o que está ACIMA E À FRENTE esconde o que está
     * atrás — o toldo comia a catraca, o púlpito e quem estivesse embarcando,
     * e de longe a plataforma era um tijolo vermelho. Cobertura só ficaria
     * bem numa câmera que olha de lado.
     *
     * O pórtico resolve as duas coisas: ele é VERTICAL, então não tapa nada, e
     * ainda diz o nome da atração — que é o que um toldo tentava dizer.
     */
    const portico = new THREE.Group();
    portico.position.set(0, 0, 1.25);
    for (const lado of [-1, 1] as const) {
      const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.0, 10), metal);
      coluna.position.set(lado * 2.3, 1.5, 0);
      portico.add(coluna);
      // a lâmpada no alto de cada coluna
      const luz = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), toon(P.luzDoPortao));
      luz.position.set(lado * 2.3, 3.16, 0);
      portico.add(luz);
    }
    const viga = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.15, 0.18), metal);
    viga.position.y = 2.9;
    portico.add(viga);
    // a placa pendurada na viga, com a fita vermelha da casa
    const placa = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.75, 0.1), toon(P.fabricRed));
    placa.position.y = 2.42;
    portico.add(placa);
    const filete = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 0.11), toon(P.wallCream));
    filete.position.set(0, 2.42, 0.01);
    portico.add(filete);
    // o nome, desenhado num canvas como todas as placas do jogo
    const nome = letreiro('RODA GIGANTE', 2.35, 0.34, '#c0392b');
    nome.position.set(0, 2.42, 0.07);
    portico.add(nome);
    // as lampadinhas da moldura, como em parque de verdade
    for (let i = 0; i < 7; i++) {
      const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), toon(P.luzDoPortao));
      bulbo.position.set(-1.35 + i * 0.45, 2.85, 0.12);
      portico.add(bulbo);
    }
    // o ARCO de luzinhas por cima da viga, com o coração dourado no alto
    const arco: THREE.Vector3[] = [];
    for (let k = 0; k <= 24; k++) {
      const t = k / 24;
      arco.push(V(-2.3 + 4.6 * t, 3.0 + Math.sin(Math.PI * t) * 0.85, 0));
    }
    const curvaDoArco = new THREE.CatmullRomCurve3(arco);
    portico.add(new THREE.Mesh(new THREE.TubeGeometry(curvaDoArco, 40, 0.085, 6, false), toon(P.rodaVermelho)));
    portico.add(lampadas(curvaDoArco.getSpacedPoints(14).slice(1, -1).map((p) => p.add(V(0, 0, 0.1))), 0.075));
    const coracaoDoArco = new THREE.Mesh(geoCoracao(0.55, 0.1).translate(0, 0, -0.05), toon(P.gold));
    coracaoDoArco.position.set(0, 3.95, 0);
    portico.add(coracaoDoArco);
    plataforma.add(portico);

    // a coberturinha do púlpito do bilheteiro: pequena, e SÓ sobre ele
    const chapeuDoPulpito = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.1, 0.95), toon(P.fabricRed));
    chapeuDoPulpito.position.set(-1.95, 1.95, 0.9);
    plataforma.add(chapeuDoPulpito);
    const hasteDoPulpito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), metal);
    hasteDoPulpito.position.set(-1.95, 1.5, 0.62);
    plataforma.add(hasteDoPulpito);

    this.group.add(plataforma);

    // --------------------------------------------- a cerca de corrente
    /**
     * Ela contorna a laje e ABRE na frente da plataforma. O vão não é enfeite:
     * cerca fechada em volta de uma coisa em que se entra é uma contradição que
     * o olho percebe antes da cabeça.
     */
    const raioDaCerca = R * 0.72;
    const POSTES = 18;
    const postes: THREE.BufferGeometry[] = [];
    const bolas: THREE.BufferGeometry[] = [];
    const correntes: THREE.BufferGeometry[] = [];
    for (let i = 0; i < POSTES; i++) {
      const a = (i / POSTES) * Math.PI * 2;
      // o vão da frente: pula os postes que caem na boca da plataforma
      const naFrente = Math.sin(a) > 0.72;
      if (naFrente) continue;
      const x = Math.cos(a) * raioDaCerca;
      const z = Math.sin(a) * raioDaCerca;
      postes.push(new THREE.CylinderGeometry(0.06, 0.08, 0.85, 8).translate(x, 0.42, z));
      bolas.push(new THREE.SphereGeometry(0.09, 10, 6).translate(x, 0.9, z));
      // a corrente cedendo até o próximo poste
      const b = ((i + 1) / POSTES) * Math.PI * 2;
      if (Math.sin(b) > 0.72) continue;
      correntes.push(corda(V(x, 0.74, z), V(Math.cos(b) * raioDaCerca, 0.74, Math.sin(b) * raioDaCerca), 0.08, 0.028));
    }
    this.group.add(new THREE.Mesh(juntar(postes), metalEscuro));
    this.group.add(new THREE.Mesh(juntar(bolas), toon(P.gold)));
    this.group.add(new THREE.Mesh(juntar(correntes), toon(P.rodaVermelho)));
  }

  /**
   * ================================================ O INTERIOR DA CABINE
   *
   * Só se vê de dentro, e só durante os quarenta segundos de primeira pessoa
   * lá em cima — por isso ele é UM só e muda de cabine (`abrirCabine`) em vez
   * de existir 32 vezes. A casca da cabine é `FrontSide`: de dentro ela some
   * sozinha e o parque aparece inteiro, o que faz do vão entre o peitoril e o
   * teto uma janela que dá a volta completa sem custar um único polígono.
   *
   * O que este método desenha é a MOLDURA dessa janela: piso, peitoril,
   * montantes, aro de cima, teto e a lâmpada. O piso fica na altura em que os
   * pés dos dois pousam (`PISO`), que é a mesma que a cena usa no `ridePlayer`.
   *
   * AS MEDIDAS SÃO AS DA GENTE DE DENTRO, não as da cápsula. Os dois viajam em
   * escala 0,55 e sentados o olho deles fica 0,72 acima do piso — um interior
   * do tamanho da casca (1,55 de largura por 1,0 de altura) lia como um salão
   * baixo e largo, não como uma cabine. Este aqui é da largura deles, e a
   * casca por fora não denuncia nada: ela é invisível de dentro.
   */
  static readonly PISO = PISO_DA_CASCA - CAIDA;

  private montarOInterior(): THREE.Group {
    const g = new THREE.Group();
    const piso = PISO_DA_CASCA;
    const raio = 0.54;
    const achatado = 0.92; // a cápsula é espremida em z; a moldura acompanha

    const chao = new THREE.Mesh(
      new THREE.CylinderGeometry(raio * 0.94, raio * 0.94, 0.05, 20),
      toon(P.cabinePiso),
    );
    chao.scale.z = achatado;
    chao.position.y = piso - 0.025;
    g.add(chao);

    // saia opaca do peitoril: fecha o pé da janela para não se ver o vazio
    const saia = new THREE.Mesh(
      new THREE.CylinderGeometry(raio, raio, 0.13, 22, 1, true),
      toon(P.cabineEsquadria, { doubleSide: true }),
    );
    saia.scale.z = achatado;
    saia.position.y = piso + 0.065;
    g.add(saia);

    /*
     * OS BANCOS OLHAM PARA +Z, que é onde o parque está.
     *
     * A primeira versão sentava os dois de costas para ele: da cabine se via a
     * grama vazia e o skyline da cidade, e o parque — o lago, a cúpula, o
     * quiosque do Mano — ficava atrás da nuca. Aqui o banco com encosto é o de
     * `z` NEGATIVO, e quem senta nele olha para a frente da roda.
     *
     * E É UM BANCO SÓ. Tinha um segundo, baixo, na frente — mas o parque, visto
     * do alto, fica LÁ EMBAIXO: o olhar desce uns 30° para achar o lago e a
     * cúpula, e a essa inclinação o banco da frente era a única coisa na tela.
     * Sem ele dá para olhar até uns 48°, que é onde o peitoril começa.
     */
    const madeira = toon(P.cabineBanco);
    const estofo = toon(P.cabineEstofado);
    for (const [z, comEncosto] of [[-0.28, true]] as const) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.27, 0.24), madeira);
      base.position.set(0, piso + 0.135, z);
      g.add(base);
      const almofada = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.07, 0.22), estofo);
      almofada.position.set(0, piso + 0.305, z);
      g.add(almofada);
      if (!comEncosto) continue;
      const encosto = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.34, 0.06), madeira);
      encosto.position.set(0, piso + 0.5, z - 0.12);
      encosto.rotation.x = -0.14;
      g.add(encosto);
      const forro = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.04), estofo);
      forro.position.set(0, piso + 0.5, z - 0.08);
      forro.rotation.x = -0.14;
      g.add(forro);
    }

    /*
     * ------------------------------------------- esquadria da janela, DE VIDRO
     *
     * Os montantes são a única coisa da cabine que fica ENTRE o olho e o
     * parque, e a menos de 20 cm do rosto: num celular em pé, onde a janela é
     * estreita, um deles sozinho tapava metade da tela. Eles ficam
     * translúcidos (0,3) e mais finos, então continuam desenhando a moldura da
     * janela sem ser a janela.
     *
     * `depthWrite = false` no material clonado é o que faz a diferença de
     * verdade: transparente e escrevendo profundidade, o montante some da
     * imagem mas continua apagando o que está atrás dele. E é CLONE porque o
     * `toon()` guarda material em cache — mexer no original mudaria toda peça
     * creme do jogo.
     */
    const esquadria = toon(P.cabineEsquadria);
    const vidro = toon(P.cabineEsquadria, { opacity: 0.3 }).clone();
    vidro.depthWrite = false;
    const topo = piso + 0.94; // o aro da janela para logo abaixo da borda da calota
    const MONTANTES = 8;
    for (let i = 0; i < MONTANTES; i++) {
      // meio passo de rotação: assim nenhum montante nasce bem no meio da
      // vista de quem está sentado olhando para fora
      const a = ((i + 0.5) / MONTANTES) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.032, topo - piso - 0.13, 0.032), vidro);
      m.position.set(Math.cos(a) * raio, (piso + 0.13 + topo) / 2, Math.sin(a) * raio * achatado);
      m.rotation.y = -a;
      g.add(m);
    }
    const aro = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.03, 6, 22), esquadria);
    aro.rotation.x = Math.PI / 2;
    aro.scale.y = achatado;
    aro.position.y = topo;
    g.add(aro);

    /*
     * O TETO É `flat()`, e não `toon()`: virado para baixo ele não pega nada
     * do sol e o material sombreado saía verde-oliva escuro, com cara de
     * caverna. Sem luz, chapado, ele fica creme — que é a cor que ele tem.
     */
    /*
     * O TETO É UMA CALOTA, e não um disco. Com um disco do tamanho do aro
     * sobrava uma fresta entre a borda dele e a casca, e por essa fresta se via
     * o braço da cabine: uma caixa preta pendurada no céu bem no alto da tela.
     * A calota tem o raio da própria cápsula (0,80 contra 0,816) e o mesmo
     * centro do capuz dela, então ela forra a casca por dentro sem furo nenhum
     * — e começa acima do aro da janela, para não comer a vista de lado.
     */
    const teto = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 20, 10, 0, Math.PI * 2, 0, 1.0),
      flat(P.cabineEsquadria),
    );
    teto.scale.z = achatado;
    teto.position.y = 0.204;
    g.add(teto);

    // a lâmpada: a única luz do lado de dentro, e o que faz a cabine parecer
    // um lugar em vez de um buraco
    // a haste também é chapada: virada para baixo, sombreada, ela saía preta
    const haste = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.06, 6),
      flat(P.cabineEsquadria),
    );
    haste.position.y = 0.83;
    g.add(haste);
    const lampada = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 10),
      toon(P.cabineLuz, { glow: 0.7 }),
    );
    lampada.position.y = 0.775;
    g.add(lampada);

    g.visible = false;
    return g;
  }

  /**
   * Põe o interior dentro de `cabine` e o acende. A cabine some da física e da
   * lógica do resto: quem chama é a cutscene do passeio.
   */
  abrirCabine(cabine: THREE.Group): void {
    cabine.add(this.interior);
    this.interior.visible = true;
    this.atravessarAEstrutura(true);
    /*
     * E AS GÔNDOLAS PARAM DE FAZER SOMBRA. A casca envolve os dois por todos
     * os lados, então enquanto ela projetava sombra os dois viajavam dentro do
     * próprio escuro: o parceiro saía preto, sem rosto. São lotes, então param
     * todas — de fora ninguém sente falta: a essa altura a câmera está lá
     * dentro.
     */
    for (const lote of [this.corpos, this.acabamentos, this.forquilhas]) lote.castShadow = false;
    // e a forquilha e o caixilho DESTA somem: de dentro, a forquilha aparecia
    // pendurada no céu no alto da tela, e o caixilho cortava a vista em fatias
    // (o interior tem o seu, translúcido)
    this.ocupada = this.cabins.indexOf(cabine);
    this.layout();
  }

  /**
   * ======================== A ESTRUTURA VIRA VIDRO ENQUANTO ALGUÉM ESTÁ DENTRO
   *
   * Os dois olham para o PARQUE, que fica em +Z — e entre a cabine e o parque
   * está a metade da frente da roda: um aro, a treliça e o leque de cabos. De
   * dentro isso corta a vista em fatias.
   *
   * A solução não é sumir com a roda (sem ela não se está numa roda gigante):
   * é deixá-la quase invisível, um fantasma de vidro por onde o parque
   * aparece inteiro e a estrutura continua sendo lida. `depthWrite = false` é
   * o que faz de verdade a diferença — sem isso ela some da imagem mas
   * continua tapando tudo no buffer de profundidade.
   *
   * Os materiais são CÓPIAS, e não o original com a opacidade mexida: o
   * `toon()` guarda material em cache, e mexer no branco da roda apagaria
   * meio parque junto.
   */
  private readonly fantasmas = new Map<THREE.Material, THREE.Material>();
  private readonly trocados: Array<{
    alvo: THREE.Object3D & { material: THREE.Material };
    original: THREE.Material;
    sombra: boolean;
  }> = [];

  private atravessarAEstrutura(ligado: boolean): void {
    if (!ligado) {
      for (const t of this.trocados) {
        t.alvo.material = t.original;
        t.alvo.castShadow = t.sombra;
      }
      this.trocados.length = 0;
      return;
    }
    this.rim.traverse((n) => {
      const alvo = n as THREE.Object3D & { material?: THREE.Material | THREE.Material[] };
      if (!alvo.material || Array.isArray(alvo.material)) return;
      const original = alvo.material;
      let copia = this.fantasmas.get(original);
      if (!copia) {
        copia = original.clone();
        copia.transparent = true;
        // a linha some mais que a barra: um leque de 64 cabos soma opacidade e
        // vira névoa se cada fio for tão visível quanto uma viga
        copia.opacity = (original as THREE.LineBasicMaterial).isLineBasicMaterial ? 0.05 : 0.1;
        copia.depthWrite = false;
        this.fantasmas.set(original, copia);
      }
      this.trocados.push({
        alvo: alvo as THREE.Object3D & { material: THREE.Material },
        original,
        sombra: alvo.castShadow,
      });
      alvo.material = copia;
      // e para de fazer sombra: a treliça riscava o rosto dos dois lá dentro
      alvo.castShadow = false;
    });
  }

  /** Recolhe o interior; a cabine volta a ser uma cápsula fechada como as outras. */
  fecharCabine(): void {
    this.interior.visible = false;
    this.group.add(this.interior);
    this.atravessarAEstrutura(false);
    for (const lote of [this.corpos, this.acabamentos, this.forquilhas]) lote.castShadow = true;
    this.ocupada = -1;
    this.layout();
  }

  /** angulo (rad) da cabine i no plano da roda */
  private cabinAngle(i: number): number {
    return this.angle + (i / this.cabinCount) * Math.PI * 2;
  }

  private readonly matriz = new THREE.Matrix4();
  private readonly sumida = new THREE.Matrix4().makeScale(0, 0, 0);

  private layout(): void {
    const m = this.matriz;
    for (let i = 0; i < this.cabins.length; i++) {
      const a = this.cabinAngle(i);
      const x = Math.cos(a) * this.radius;
      const y = this.hubHeight + Math.sin(a) * this.radius;
      this.cabins[i].position.set(x, y, 0);
      m.makeTranslation(x, y, 0);
      this.corpos.setMatrixAt(i, m);
      this.vidros.setMatrixAt(i, m);
      const dela = i === this.ocupada ? this.sumida : m;
      this.acabamentos.setMatrixAt(i, dela);
      this.forquilhas.setMatrixAt(i, dela);
    }
    for (const lote of [this.corpos, this.vidros, this.acabamentos, this.forquilhas]) {
      lote.instanceMatrix.needsUpdate = true;
    }
  }

  update(dt: number): void {
    this.angle += this.speed * dt;
    this.rim.rotation.z = this.angle;
    /**
     * OS PNEUS GIRAM NA VELOCIDADE CERTA, e não numa qualquer: quem encosta no
     * aro anda com ele, então `v = ω·R` na borda, e o pneu de raio `r` gira a
     * `ω·R/r`. Com um número inventado a roda de atrito patinaria à vista de
     * todo mundo — e o detalhe existe justamente para mostrar como ela anda.
     */
    const giroDoPneu = (this.speed * this.radius) / (this.radius * 0.075);
    for (const pneu of this.pneus) pneu.rotation.z -= giroDoPneu * dt;
    this.layout();
  }

  /** Dá um terço de volta na catraca: alguém acabou de passar. */
  girarACatraca(): void {
    if (this.catraca) this.catraca.rotation.y -= (Math.PI * 2) / 3;
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
