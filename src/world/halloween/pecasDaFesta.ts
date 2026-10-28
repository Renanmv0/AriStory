import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { quina } from '../lojaDeRoupas';
import { acabar } from '../acabamento';
import { veioDeMadeira } from '../texturasDeCasa';
import { sorteio } from '../texturasDeChao';
import type { AboboraNoLote } from './abobora';

/*
 * AS PEÇAS DOS POSTOS DA FESTA (`docs/HALLOWEEN.md`, §2.4.1, C), além do
 * carrinho de poções do Noel (`carrinhoDePocoes.ts`): o CANTEIRO DE
 * ABÓBORAS da Josefina no gramado e a BACIA DE MAÇÃS do Capy na beira do
 * lago (a travessura dele, na etapa 5).
 *
 * O contrato do kit: base em `y = 0`, a frente olhando para `+Z`, e a cena
 * passa pela `fundir()`. As abóboras do canteiro não moram aqui: a peça diz
 * ONDE elas crescem (`aboboras`, no referencial dela) e a cena as põe no lote
 * do parque inteiro — acesas e tremendo junto com as outras, sem um desenho a
 * mais.
 */

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

// ============================================================ o canteiro

/** a altura da terra, por dentro das tábuas */
const TERRA = 0.27;

/**
 * A FOLHA DE ABÓBORA: redonda, de cinco lobos rasos, com o cabinho e a
 * nervura em V; deitada (no plano XZ), a base na origem e a ponta em `+Z`,
 * em concha (a beira sobe um tico).
 */
function geoFolhaDeAbobora(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    // cinco lobos, o recorte da base (o "coração") e a ponta
    const lobo = 1 + 0.16 * Math.cos(5 * a);
    const r = 0.5 * lobo * (1 - 0.35 * Math.exp(-((a - Math.PI * 1.5) ** 2) * 9));
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r + 0.5;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  const geo = new THREE.ShapeGeometry(s, 1);
  geo.rotateX(Math.PI / 2);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i) - 0.5;
    // a concha: a beira sobe
    pos.setY(i, 0.06 * (x * x + z * z) * 4);
  }
  geo.computeVertexNormals();
  return geo;
}

export interface CanteiroDeAboboras {
  group: THREE.Group;
  /** onde as abóboras crescem, no referencial do canteiro (a cena põe no lote dela) */
  aboboras: AboboraNoLote[];
  /** a meia largura e a meia profundidade (o colisor) */
  meio: { x: number; z: number };
}

/**
 * O CANTEIRO DE ABÓBORAS da Josefina: o caixote de tábuas com o veio (as
 * quinas em pé com o cocuruto redondo), a terra fofa em calombos, as ramas
 * serpenteando de uma abóbora a outra com as folhas grandes em concha, as
 * gavinhas enroladas, e a plaquinha fincada "Abóboras da Josefina" na letra
 * redonda dela.
 */
export function canteiroDeAboboras(): CanteiroDeAboboras {
  const g = new THREE.Group();
  g.userData.peca = 'canteiro-de-aboboras';
  const L = 2.2;
  const F = 1.3;
  const madeira = toon(P.madeiraDoCanteiro);
  const tabuas = new THREE.Group();
  // duas tábuas deitadas de cada lado, uma em cima da outra (com a fresta)
  for (const y of [0.075, 0.215]) {
    for (const s of [-1, 1]) {
      por(tabuas, quina(L, 0.13, 0.05, 0.012), madeira, 0, y, s * (F / 2 - 0.025));
      por(tabuas, quina(0.05, 0.13, F - 0.1, 0.012), madeira, s * (L / 2 - 0.025), y, 0);
    }
  }
  // as quinas em pé, mais altas, com o cocuruto
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      por(tabuas, quina(0.08, 0.34, 0.08, 0.015), madeira, sx * (L / 2 - 0.02), 0.17, sz * (F / 2 - 0.02));
      por(tabuas, new THREE.SphereGeometry(0.045, 10, 8), toon(P.carrinhoRoda), sx * (L / 2 - 0.02), 0.355, sz * (F / 2 - 0.02));
    }
  }
  acabar(tabuas, [[P.madeiraDoCanteiro, veioDeMadeira(0.6)]]);
  g.add(tabuas);

  // a terra fofa, em calombos
  const rnd = sorteio(4471);
  const terra = new THREE.PlaneGeometry(L - 0.1, F - 0.1, 22, 12).rotateX(-Math.PI / 2);
  const pos = terra.getAttribute('position');
  const calombos = Array.from({ length: 14 }, () => ({ x: (rnd() - 0.5) * L, z: (rnd() - 0.5) * F, r: 0.15 + rnd() * 0.2, h: 0.02 + rnd() * 0.03 }));
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let y = 0;
    for (const c of calombos) y += c.h * Math.exp(-((x - c.x) ** 2 + (z - c.z) ** 2) / (c.r * c.r));
    // a beira afunda junto da tábua
    const borda = Math.min(L / 2 - 0.05 - Math.abs(x), F / 2 - 0.05 - Math.abs(z));
    pos.setY(i, Math.min(y, borda * 0.4) + (rnd() - 0.5) * 0.006);
  }
  terra.computeVertexNormals();
  por(g, terra, toon(P.terraDoCanteiro), 0, TERRA - 0.03, 0);
  // os torrões soltos por cima
  for (let i = 0; i < 18; i++) {
    const t = por(g, new THREE.DodecahedronGeometry(0.025 + rnd() * 0.02, 0), toon(P.terraDoCanteiro), (rnd() - 0.5) * (L - 0.3), TERRA - 0.01, (rnd() - 0.5) * (F - 0.3));
    t.rotation.set(rnd() * 3, rnd() * 3, 0);
  }

  // onde as abóboras crescem: as de cara de frente para a câmera, as lisas tortinhas
  const PARA_A_CAMERA = Math.PI / 4;
  const aboboras: AboboraNoLote[] = [
    { x: -0.62, z: 0.2, y: TERRA, tamanho: 'media', cara: 'sorriso', giro: PARA_A_CAMERA - 0.3 },
    { x: 0.55, z: 0.25, y: TERRA, tamanho: 'media', cara: 'piscando', giro: PARA_A_CAMERA + 0.1 },
    { x: -0.05, z: -0.3, y: TERRA, tamanho: 'grande', giro: 0.6, tomba: 0.06 },
    { x: 0.1, z: 0.38, y: TERRA, tamanho: 'pequena', cor: P.aboboraCreme, simples: true, giro: 1.2 },
    { x: -0.82, z: -0.38, y: TERRA, tamanho: 'pequena', cor: P.aboboraClara, simples: true, giro: 2.1 },
    { x: 0.82, z: -0.32, y: TERRA, tamanho: 'pequena', simples: true, giro: -0.6, tomba: 0.1 },
  ];

  // as ramas: de abóbora em abóbora, rentes à terra, ondulando
  const rama = toon(P.folhaDeAbobora);
  const caminhos: Array<Array<[number, number]>> = [
    [[-1.0, 0.45], [-0.62, 0.2], [-0.4, -0.1], [-0.05, -0.3], [0.3, -0.05], [0.55, 0.25], [0.95, 0.45]],
    [[-0.82, -0.38], [-0.45, -0.45], [-0.05, -0.3]],
    [[0.82, -0.32], [0.45, -0.5], [0.1, 0.38]],
  ];
  const folhas: Array<{ x: number; z: number; giro: number; esc: number; tomba: number }> = [];
  for (const cam of caminhos) {
    const pts = cam.map(([x, z], i) => new THREE.Vector3(x, TERRA + 0.03 + 0.02 * Math.sin(i * 1.7), z));
    const curva = new THREE.CatmullRomCurve3(pts);
    por(g, new THREE.TubeGeometry(curva, cam.length * 10, 0.014, 5, false), rama);
    // uma folha a cada trecho, de um lado e do outro da rama
    for (let k = 1; k < cam.length * 2 - 1; k++) {
      const t = k / (cam.length * 2 - 1);
      const p = curva.getPointAt(t);
      const tg = curva.getTangentAt(t);
      const lado = k % 2 ? 1 : -1;
      const giro = Math.atan2(tg.x, tg.z) + lado * (0.9 + rnd() * 0.5);
      folhas.push({ x: p.x, z: p.z, giro, esc: 0.32 + rnd() * 0.14, tomba: 0.15 + rnd() * 0.25 });
      // a gavinha: a molinha enrolada saindo da rama
      if (k % 3 === 0) {
        const mola = Array.from({ length: 16 }, (_, i) => {
          const a = i * 0.9;
          const r = 0.03 * (1 - i / 20);
          return new THREE.Vector3(p.x - lado * tg.z * (0.05 + i * 0.006) + Math.cos(a) * r, TERRA + 0.04 + i * 0.006, p.z + lado * tg.x * (0.05 + i * 0.006) + Math.sin(a) * r);
        });
        por(g, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mola), 30, 0.004, 4, false), rama);
      }
    }
  }
  // as folhas, de pé no cabinho: um pouco inclinadas, cada uma no seu tamanho
  const folha = geoFolhaDeAbobora();
  const verde = toon(P.folhaDeAbobora, { doubleSide: true });
  const cabo = toon(P.ervaSeca);
  for (const f of folhas) {
    const pivo = new THREE.Group();
    pivo.position.set(f.x, TERRA + 0.03, f.z);
    pivo.rotation.set(0, f.giro, 0);
    const m = por(pivo, folha, verde, 0, 0.06, 0.04);
    m.scale.setScalar(f.esc);
    m.rotation.x = -f.tomba;
    por(pivo, new THREE.CylinderGeometry(0.006, 0.008, 0.08, 4).rotateX(0.6), cabo, 0, 0.03, 0.02);
    g.add(pivo);
  }

  // a plaquinha fincada na terra, na quina da frente
  const placa = new THREE.Group();
  placa.position.set(L / 2 - 0.3, TERRA, F / 2 - 0.2);
  placa.rotation.y = -0.25;
  por(placa, quina(0.035, 0.42, 0.025, 0.006), toon(P.carrinhoRoda), 0, 0.12, -0.01);
  por(placa, quina(0.38, 0.2, 0.02, 0.008), toon(P.madeiraDoCanteiro), 0, 0.3, 0.004);
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 136;
  const c = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const pintar = (): void => {
    if (!c) return;
    c.fillStyle = css(P.etiquetaDePocao);
    c.fillRect(0, 0, 256, 136);
    c.fillStyle = css(P.folhaDeAbobora);
    c.textAlign = 'center';
    c.font = '700 44px "Caveat", "Segoe Print", cursive';
    c.fillText('Abóboras', 128, 58);
    c.font = '700 34px "Caveat", "Segoe Print", cursive';
    c.fillStyle = css(P.aboboraFunda);
    c.fillText('da Josefina', 128, 104);
    c.fillStyle = css(P.abobora);
    c.beginPath();
    c.arc(30, 112, 9, 0, Math.PI * 2);
    c.arc(226, 112, 9, 0, Math.PI * 2);
    c.fill();
    tex.needsUpdate = true;
  };
  pintar();
  if (typeof document !== 'undefined' && document.fonts) void document.fonts.load('700 40px Caveat').then(pintar, () => {});
  por(placa, new THREE.PlaneGeometry(0.34, 0.17), toon(0xffffff, { mapa: tex }), 0, 0.3, 0.015);
  g.add(placa);

  return { group: g, aboboras, meio: { x: L / 2, z: F / 2 } };
}

// ============================================================ a bacia de maçãs

/** a bacia: o raio da boca e a altura da água */
const BACIA = { raio: 0.42, alto: 0.38, agua: 0.31 };

/** a maçã: a barriga torneada com a covinha em cima e embaixo */
function geoMaca(): THREE.BufferGeometry {
  const perfil = [[0, -0.04], [0.035, -0.045], [0.06, -0.03], [0.07, 0.0], [0.066, 0.03], [0.045, 0.05], [0.015, 0.045], [0, 0.035]];
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), 14);
}

interface MacaBoiando {
  x: number;
  z: number;
  fase: number;
  giro: number;
}

/**
 * A BACIA DE MAÇÃS do Capy (a brincadeira de pescar maçã com a boca): a
 * tina de aduelas com os dois arcos de ferro, a água por dentro, as maçãs
 * boiando e girando devagar com a marolinha em volta, a toalha listrada
 * jogada na beira e o caixote de maçãs do lado.
 */
export class BaciaDeMacas {
  readonly group = new THREE.Group();
  private readonly macas: THREE.InstancedMesh;
  private readonly cabinhos: THREE.InstancedMesh;
  private readonly folhinhas: THREE.InstancedMesh;
  private readonly marolas: THREE.InstancedMesh;
  private readonly boiando: MacaBoiando[] = [];
  private readonly noCaixote: THREE.Matrix4[] = [];
  private tempo = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3();

  constructor() {
    const g = this.group;
    g.name = 'bacia-de-macas';
    g.userData.peca = 'bacia-de-macas';
    const { raio: R, alto, agua } = BACIA;
    // a tina: as aduelas (a barriga um tico estufada) por fora, e por dentro mais escuro
    const tina = new THREE.Group();
    const perfil = [[R * 0.86, 0], [R * 0.95, alto * 0.45], [R, alto]].map(([r, y]) => new THREE.Vector2(r, y));
    por(tina, new THREE.LatheGeometry(perfil, 28), toon(P.madeiraDoCanteiro));
    const dentro = new THREE.LatheGeometry([[R - 0.025, alto], [R * 0.93 - 0.025, alto * 0.45], [R * 0.86 - 0.025, 0.03]].map(([r, y]) => new THREE.Vector2(r, y)), 28);
    por(tina, dentro, toon(P.carrinhoRoda, { doubleSide: true }));
    por(tina, new THREE.TorusGeometry(R - 0.012, 0.014, 5, 32).rotateX(Math.PI / 2), toon(P.carrinhoRoda), 0, alto, 0);
    acabar(tina, [[P.madeiraDoCanteiro, veioDeMadeira(0.5)]]);
    g.add(tina);
    // as frestas entre as aduelas: riscos escuros em pé, por fora
    const junta = toon(P.carrinhoFerro);
    // (cada fresta segue a barriga da tina, um fio rente por fora dela)
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.11;
      const fio = new THREE.CatmullRomCurve3(perfil.map((v) => new THREE.Vector3(Math.sin(a) * (v.x + 0.003), v.y, Math.cos(a) * (v.x + 0.003))));
      por(g, new THREE.TubeGeometry(fio, 8, 0.003, 3, false), junta);
    }
    // os dois arcos de ferro
    for (const [y, r] of [[alto * 0.2, R * 0.905], [alto * 0.78, R * 0.985]] as const) {
      por(g, new THREE.TorusGeometry(r + 0.006, 0.012, 5, 32).rotateX(Math.PI / 2), toon(P.carrinhoFerro), 0, y, 0);
    }
    // a água: um disco com um tico de brilho (é de noite, e ela pega a luz da festa)
    const disco = por(g, new THREE.CircleGeometry(R * 0.985 - 0.03, 28).rotateX(-Math.PI / 2), toon(P.aguaDaBacia, { glow: 0.25 }), 0, agua, 0);
    disco.name = 'agua-da-bacia';

    // a toalha listrada, jogada na beira: um pano dobrado por cima da borda
    const toalha = new THREE.PlaneGeometry(0.28, 0.66, 1, 18);
    const tp = toalha.getAttribute('position');
    for (let i = 0; i < tp.count; i++) {
      const u = tp.getY(i) / 0.66 + 0.5;
      // por dentro (u = 0) passa da borda e cai pelo lado de fora
      const d = u * 0.66;
      let x: number;
      let y: number;
      if (d < 0.12) {
        x = R - 0.12 + d;
        y = alto + 0.02 - (0.12 - d) * 0.15;
      } else {
        const a = Math.min(Math.PI / 2, (d - 0.12) / 0.06);
        const resto = Math.max(0, d - 0.12 - 0.06 * Math.PI / 2);
        x = R + 0.04 * Math.sin(a) + resto * 0.12;
        y = alto + 0.02 + 0.04 * (Math.cos(a) - 1) - resto;
      }
      tp.setXYZ(i, x, y, tp.getX(i) + Math.sin(u * 9) * 0.008);
    }
    toalha.computeVertexNormals();
    const cv = document.createElement('canvas');
    cv.width = 64;
    cv.height = 128;
    const c = cv.getContext('2d');
    if (c) {
      c.fillStyle = css(P.toalhaDoCapy);
      c.fillRect(0, 0, 64, 128);
      c.fillStyle = css(P.pocaoAzul);
      c.fillRect(0, 96, 64, 9);
      c.fillRect(0, 110, 64, 4);
      c.fillStyle = 'rgba(0,0,0,0.06)';
      for (let y = 0; y < 128; y += 4) c.fillRect(0, y, 64, 1);
    }
    const listras = new THREE.CanvasTexture(cv);
    listras.colorSpace = THREE.SRGBColorSpace;
    const pano = por(g, toalha, toon(0xffffff, { mapa: listras, doubleSide: true }));
    pano.rotation.y = 0.5;

    // o caixote de maçãs do lado
    const caixote = new THREE.Group();
    caixote.position.set(-R - 0.32, 0, 0.12);
    caixote.rotation.y = 0.35;
    const ripa = toon(P.madeiraDoCanteiro);
    for (const y of [0.04, 0.13, 0.22]) {
      for (const s of [-1, 1]) {
        por(caixote, quina(0.42, 0.06, 0.02, 0.005), ripa, 0, y, s * 0.15);
        // a ripa do lado um tico mais baixa: o topo dela não divide plano com o da ripa da frente
        por(caixote, quina(0.02, 0.054, 0.3, 0.005), ripa, s * 0.2, y, 0);
      }
    }
    por(caixote, quina(0.4, 0.02, 0.28, 0.004), ripa, 0, 0.02, 0);
    acabar(caixote, [[P.madeiraDoCanteiro, veioDeMadeira(0.5)]]);
    g.add(caixote);

    // as maçãs em lote: as que boiam e as do caixote (a cor por cópia)
    const total = 7 + 9;
    this.macas = new THREE.InstancedMesh(geoMaca(), toon(0xffffff), total);
    this.macas.name = 'macas';
    this.cabinhos = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.005, 0.006, 0.04, 4).translate(0, 0.06, 0), toon(P.carrinhoRoda), total);
    this.cabinhos.name = 'cabinhos-das-macas';
    const geoF = new THREE.SphereGeometry(1, 6, 4).scale(0.022, 0.004, 0.038).rotateX(-0.5).translate(0.012, 0.07, 0.02);
    this.folhinhas = new THREE.InstancedMesh(geoF, toon(P.folhaDeAbobora), total);
    this.folhinhas.name = 'folhinhas-das-macas';
    const rnd = sorteio(613);
    const cores = [P.macaVermelha, P.macaVermelha, P.macaVermelha, P.pocaoVerde, P.aboboraClara];
    const cor = new THREE.Color();
    for (let i = 0; i < total; i++) {
      cor.setHex(cores[i % cores.length]);
      if (cores[i % cores.length] === P.pocaoVerde) cor.multiplyScalar(0.85);
      this.macas.setColorAt(i, cor);
    }
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + rnd();
      const d = 0.08 + rnd() * (R - 0.2);
      this.boiando.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, fase: rnd() * 6, giro: rnd() * 6 });
    }
    // no caixote: duas camadas, a de cima um pouco mais para o meio
    const base = new THREE.Matrix4().compose(caixote.position, new THREE.Quaternion().setFromEuler(caixote.rotation), new THREE.Vector3(1, 1, 1));
    for (let i = 0; i < 9; i++) {
      const cima = i >= 6;
      const k = cima ? i - 6 : i;
      const lx = cima ? -0.1 + k * 0.1 : -0.12 + (k % 3) * 0.12;
      const lz = cima ? 0 : (k < 3 ? -0.065 : 0.065);
      const local = new THREE.Matrix4().compose(new THREE.Vector3(lx, cima ? 0.2 : 0.1, lz), new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 0.5, rnd() * 6, 0)), new THREE.Vector3(1, 1, 1));
      this.noCaixote.push(local.premultiply(base));
    }
    // a marolinha em volta de cada maçã boiando
    this.marolas = new THREE.InstancedMesh(new THREE.TorusGeometry(1, 0.06, 4, 20).rotateX(Math.PI / 2), toon(P.giz, { opacity: 0.5 }), 7);
    this.marolas.name = 'marolas-da-bacia';
    for (const im of [this.macas, this.cabinhos, this.folhinhas, this.marolas]) {
      im.frustumCulled = false;
      g.add(im);
    }
    this.marolas.userData.semSombra = true;
    this.update(0);
  }

  update(dt: number): void {
    this.tempo += dt;
    const t = this.tempo;
    this.boiando.forEach((b, i) => {
      const y = BACIA.agua + 0.012 + Math.sin(t * 1.8 + b.fase) * 0.008;
      this.e.set(Math.sin(t * 1.3 + b.fase) * 0.18, b.giro + t * 0.2, Math.cos(t * 1.1 + b.fase) * 0.15);
      this.m.compose(this.p.set(b.x + Math.sin(t * 0.3 + b.fase) * 0.02, y, b.z + Math.cos(t * 0.27 + b.fase) * 0.02), this.q.setFromEuler(this.e), this.s.set(1, 1, 1));
      for (const im of [this.macas, this.cabinhos, this.folhinhas]) im.setMatrixAt(i, this.m);
      const f = (t * 0.5 + b.fase) % 1;
      this.m.compose(this.p.set(this.p.x, BACIA.agua + 0.003, this.p.z), this.q.identity(), this.s.set(0.07 + f * 0.06, 1, 0.07 + f * 0.06));
      this.marolas.setMatrixAt(i, this.m);
    });
    this.noCaixote.forEach((mat, k) => {
      for (const im of [this.macas, this.cabinhos, this.folhinhas]) im.setMatrixAt(7 + k, mat);
    });
    for (const im of [this.macas, this.cabinhos, this.folhinhas, this.marolas]) im.instanceMatrix.needsUpdate = true;
  }
}
