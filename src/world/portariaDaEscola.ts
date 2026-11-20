import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { flat, toon } from '../core/materials';
import { extrudar, quina, retangulo } from './lojaDeRoupas';
import { tijolinho, reboco } from './texturasDeFachada';
import { uvDeParede } from './acabamento';
import { contornoPoligonal, cavetinho, type Perfil } from './molduras';

/**
 * ====================================================== A PORTARIA DA ESCOLA DO GATITO
 *
 * A entrada chique do pátio (`scenes/escolaPatio.ts`), pedida pelo Renan: "é
 * uma escola, então deve ter uma portaria chique". Na mesma família do
 * prédio (`world/escolaPorFora.ts`): tijolinho vermelho, pedra clara, ferro
 * batido escuro com um fio de dourado.
 *
 *  - O PORTÃO: dois pilares de tijolo com lanterna acesa em cima, o ARCO de
 *    ferro com a placa "ESCOLA DO GATITO" e a carinha do Gatito no alto, e
 *    as duas folhas de grade (lanças douradas, a faixa de argolas) abertas
 *    para dentro, encostadas na beira do calçadão;
 *  - A GRADE: a mureta de tijolo com o capeamento de pedra, os pilares a
 *    cada ~3,6 m com a bola de pedra, e a grade de lanças entre eles — as
 *    barras e as pontas são lotes, centenas de cópias em dois desenhos;
 *  - A GUARITA: um octógono pequeno de tijolo, irmão da rotunda, com a
 *    cupulazinha de metal e o pináculo, janelas de vidro de verdade (dá para
 *    ver a mesa lá dentro) e o guichê com o balcão de pedra virado para o
 *    portão;
 *  - OS BALIZADORES: os postinhos de luz baixos na beira do calçadão.
 */

const ferro = (): THREE.MeshToonMaterial => toon(P.escolaFerro);
const tijoloMat = (): THREE.MeshToonMaterial => toon(P.escolaRejunte, { mapa: tijolinho(0.95, P.escolaTijoloFora) });
const pedraMat = (): THREE.MeshToonMaterial => toon(P.escolaPedra, { mapa: reboco(1.2) });

/** uma malha posta: com textura de parede, o UV vem de `uvDeParede` */
function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const textura = (mat as THREE.MeshToonMaterial).map;
  const m = new THREE.Mesh(textura ? uvDeParede(geo, x, y, z) : geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

/** um tubo de ferro por uma lista de pontos */
function tubo(pontos: THREE.Vector3[], raio: number, gomos = 24): THREE.BufferGeometry {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos, false, 'centripetal'), gomos, raio, 6, false);
}

/** uma voluta (o "S" de ferro batido): a espiral que enrola para dentro, no plano XY */
function voluta(raio: number, voltas = 1.25, sentido = 1): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const n = 22;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = sentido * t * voltas * Math.PI * 2;
    const r = raio * (1 - t * 0.78);
    pts.push(new THREE.Vector3(Math.cos(a) * r - raio, Math.sin(a) * r, 0));
  }
  return pts;
}

/** cópias de uma geometria (lote), a matriz montada por quem chama */
class Copias {
  readonly matrizes: THREE.Matrix4[] = [];
  por(x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, giro = 0): void {
    this.matrizes.push(new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro), new THREE.Vector3(sx, sy, sz),
    ));
  }
  montar(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material): THREE.InstancedMesh | null {
    if (!this.matrizes.length) return null;
    const im = new THREE.InstancedMesh(geo, mat, this.matrizes.length);
    this.matrizes.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    pai.add(im);
    return im;
  }
}

/** a lança dourada da ponta da barra: o cone com a bolinha embaixo (altura 1, base em y = 0) */
function geoDaLanca(): THREE.BufferGeometry {
  const pts = [
    [0.001, 0], [0.55, 0.02], [0.7, 0.12], [0.45, 0.24], [0.62, 0.36], [0.2, 0.92], [0.001, 1],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(pts, 8);
}

// ================================================================= o portão

export const PORTAO_DA_ESCOLA = {
  /** meia largura do vão, entre os pilares */
  meiaVao: 3.475,
  pilar: 0.95,
  altoDoPilar: 3.3,
  /** o comprimento de cada folha */
  folha: 3.38,
  /** o quanto a folha está aberta (gira para dentro, para o −Z) */
  abertura: 1.6,
} as const;

/**
 * O PORTÃO DA ESCOLA: a origem é o meio do vão, na linha da grade; a rua é o
 * `+Z`. As folhas são grupos com nome (`folha-esquerda`, `folha-direita`),
 * com a dobradiça no pilar — abertas, elas descansam na beira do calçadão.
 */
export function portaoDaEscola(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'portao-da-escola';
  const { meiaVao: MV, pilar: PL, altoDoPilar: AP } = PORTAO_DA_ESCOLA;
  const tijolo = tijoloMat();
  const pedra = pedraMat();
  const metal = ferro();
  const dourado = toon(P.gold);
  const luz = toon(P.luzDoPoste, { glow: 0.85 });

  // --------------------------------------------------------------- os pilares
  for (const s of [-1, 1]) {
    const x = s * (MV + PL / 2);
    por(g, new THREE.BoxGeometry(PL + 0.14, 0.5, PL + 0.14), pedra, x, 0.25, 0);
    por(g, new THREE.BoxGeometry(PL, AP - 0.5, PL), tijolo, x, 0.5 + (AP - 0.5) / 2, 0);
    // a faixa de pedra no meio e o capitel em dois degraus
    por(g, new THREE.BoxGeometry(PL + 0.06, 0.16, PL + 0.06), pedra, x, 1.9, 0);
    por(g, new THREE.BoxGeometry(PL + 0.16, 0.12, PL + 0.16), pedra, x, AP + 0.06, 0);
    por(g, new THREE.BoxGeometry(PL + 0.28, 0.14, PL + 0.28), pedra, x, AP + 0.19, 0);
    // o painel de pedra rebaixado na frente (os dois lados), com o losango
    for (const lado of [-1, 1]) {
      por(g, new THREE.BoxGeometry(PL - 0.32, 0.9, 0.04), pedra, x, 2.55, lado * (PL / 2 + 0.01));
      const losango = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.04), dourado);
      losango.rotation.z = Math.PI / 4;
      losango.position.set(x, 2.55, lado * (PL / 2 + 0.035));
      g.add(losango);
    }
    // a lanterna: o pedestal, a gaiola de ferro com o vidro aceso, o telhadinho e o pináculo
    por(g, new THREE.CylinderGeometry(0.2, 0.26, 0.2, 6), metal, x, AP + 0.36, 0);
    const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.19, 0.55, 6), luz);
    vidro.position.set(x, AP + 0.74, 0);
    g.add(vidro);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      por(g, new THREE.CylinderGeometry(0.018, 0.018, 0.6, 4), metal, x + Math.cos(a) * 0.235, AP + 0.74, Math.sin(a) * 0.235);
    }
    por(g, new THREE.ConeGeometry(0.34, 0.3, 6), metal, x, AP + 1.17, 0);
    por(g, new THREE.SphereGeometry(0.06, 8, 6), dourado, x, AP + 1.36, 0);
  }

  // ------------------------------------------------------------------ o arco
  /*
   * O ARCO de ferro batido entre os pilares: dois tubos em arco (o de baixo
   * e o de cima), as barrinhas entre eles, as volutas no pé de cada lado, a
   * placa com o nome pendurada embaixo do alto do arco e o medalhão do
   * Gatito no meio. O arco nasce em cima dos capitéis.
   */
  const NASCE = AP + 0.25;
  const arco = (y0: number, flecha: number, n = 32): THREE.Vector3[] => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = -MV - 0.1 + t * (2 * MV + 0.2);
      pts.push(new THREE.Vector3(x, y0 + flecha * Math.sin(t * Math.PI), 0));
    }
    return pts;
  };
  por(g, tubo(arco(NASCE, 1.05), 0.045, 48), metal);
  por(g, tubo(arco(NASCE + 0.42, 1.0), 0.045, 48), metal);
  // as barrinhas entre os dois arcos, e as argolas
  for (let i = 1; i < 22; i++) {
    const t = i / 22;
    const x = -MV - 0.1 + t * (2 * MV + 0.2);
    const y0 = NASCE + 1.05 * Math.sin(t * Math.PI);
    const y1 = NASCE + 0.42 + 1.0 * Math.sin(t * Math.PI);
    if (Math.abs(x) < 0.55) continue;
    por(g, new THREE.CylinderGeometry(0.018, 0.018, y1 - y0, 5), metal, x, (y0 + y1) / 2, 0);
  }
  // as volutas no pé do arco, de cada lado
  for (const s of [-1, 1]) {
    // (a mesma voluta dos dois lados, só espelhada em x: enrola para dentro do vão)
    const v = voluta(0.32, 1.15, 1).map((p) => new THREE.Vector3(s * (MV - 0.05 + p.x), NASCE + 0.12 + p.y, 0));
    por(g, tubo(v, 0.03, 30), metal);
  }
  // a placa do nome, pendurada no arco de baixo
  const placa = new THREE.Mesh(quina(3.1, 0.5, 0.06, 0.02), metal);
  placa.position.set(0, NASCE + 0.62, 0);
  g.add(placa);
  const letras = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 166;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = `#${P.escolaFerro.toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, 1024, 166);
      ctx.strokeStyle = `#${P.gold.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, 1004, 146);
      ctx.fillStyle = `#${P.gold.toString(16).padStart(6, '0')}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 92px Georgia, "Times New Roman", serif';
      ctx.fillText('ESCOLA DO GATITO', 512, 88);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  })();
  for (const lado of [-1, 1]) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.44), toon(0xffffff, { mapa: letras }));
    face.position.set(0, NASCE + 0.62, lado * 0.035);
    if (lado < 0) face.rotation.y = Math.PI;
    g.add(face);
  }
  // os elos que prendem a placa no arco
  for (const x of [-1.2, 1.2]) por(g, new THREE.TorusGeometry(0.06, 0.012, 5, 10), dourado, x, NASCE + 0.92, 0);
  // o medalhão do Gatito, no alto, entre os dois arcos
  const medalha = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = `#${P.bandeiraGatitosAzul.toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, 256, 256);
      const r = 74;
      const cx = 128;
      const cy = 134;
      for (const [lado, cor] of [[-1, P.gatitoChocolate], [1, P.gatitoCaramelo]] as const) {
        ctx.fillStyle = `#${cor.toString(16).padStart(6, '0')}`;
        ctx.beginPath();
        ctx.moveTo(cx + lado * r * 0.35, cy - r * 0.8);
        ctx.lineTo(cx + lado * r * 0.9, cy - r * 1.18);
        ctx.lineTo(cx + lado * r * 0.88, cy - r * 0.45);
        ctx.fill();
      }
      ctx.fillStyle = `#${P.gatitoCreme.toString(16).padStart(6, '0')}`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = `#${P.gatitoCaramelo.toString(16).padStart(6, '0')}`;
      ctx.fillRect(cx + r * 0.18, cy - r, r, r * 2);
      ctx.restore();
      ctx.fillStyle = '#1f1b1d';
      for (const lado of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(cx + lado * r * 0.42, cy, r * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `#${P.gatitoLingua.toString(16).padStart(6, '0')}`;
      ctx.beginPath();
      ctx.ellipse(cx + 4, cy + r * 0.55, r * 0.13, r * 0.17, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();
  const R_MEDALHA = 0.36;
  const yMedalha = NASCE + 1.25;
  for (const lado of [-1, 1]) {
    const disco = new THREE.Mesh(new THREE.CircleGeometry(R_MEDALHA, 28), toon(0xffffff, { mapa: medalha }));
    disco.position.set(0, yMedalha, lado * 0.061);
    if (lado < 0) disco.rotation.y = Math.PI;
    g.add(disco);
  }
  por(g, new THREE.CylinderGeometry(R_MEDALHA, R_MEDALHA, 0.11, 28).rotateX(Math.PI / 2), metal, 0, yMedalha, 0);
  por(g, new THREE.TorusGeometry(R_MEDALHA + 0.03, 0.035, 8, 32), dourado, 0, yMedalha, 0);
  // os raios de sol de ferro saindo do medalhão
  for (let k = 0; k < 9; k++) {
    const a = Math.PI * 0.08 + (k / 8) * Math.PI * 0.84;
    const comp = 0.32;
    const m = por(g, new THREE.CylinderGeometry(0.014, 0.014, comp, 4), dourado,
      Math.cos(a) * (R_MEDALHA + 0.05 + comp / 2), yMedalha + Math.sin(a) * (R_MEDALHA + 0.05 + comp / 2), 0);
    m.rotation.z = a - Math.PI / 2;
  }

  // ------------------------------------------------------------------ as folhas
  for (const s of [-1, 1]) {
    const folha = folhaDoPortao(s, metal, dourado);
    folha.name = s < 0 ? 'folha-esquerda' : 'folha-direita';
    folha.position.set(s * MV, 0, 0);
    // girar −s·abertura leva a ponta da folha (que nasce para o meio do vão) para o −Z, para dentro
    folha.rotation.y = -s * PORTAO_DA_ESCOLA.abertura;
    g.add(folha);
  }
  return g;
}

/**
 * UMA FOLHA do portão, com a dobradiça na origem e o comprimento para o
 * meio do vão (`−s · X`): o quadro, as barras com a lança dourada, o alto em
 * curva (mais alto no meio do portão), a faixa de argolas embaixo e a
 * voluta do canto.
 */
function folhaDoPortao(s: number, metal: THREE.Material, dourado: THREE.Material): THREE.Group {
  const f = new THREE.Group();
  const L = PORTAO_DA_ESCOLA.folha;
  const altura = (t: number): number => 2.05 + 0.4 * Math.sin((t * Math.PI) / 2); // t = 0 na dobradiça, 1 no meio
  const x = (t: number): number => -s * (0.05 + t * L);
  // o quadro: o montante da dobradiça, o do meio, a travessa de baixo, a do meio e o alto em curva
  por(f, new THREE.BoxGeometry(0.07, altura(0) + 0.05, 0.07), metal, x(0), (altura(0) + 0.05) / 2, 0);
  por(f, new THREE.BoxGeometry(0.07, altura(1) + 0.05, 0.07), metal, x(1), (altura(1) + 0.05) / 2, 0);
  por(f, new THREE.BoxGeometry(L, 0.06, 0.05), metal, x(0.5), 0.14, 0);
  por(f, new THREE.BoxGeometry(L, 0.05, 0.05), metal, x(0.5), 0.6, 0);
  const topo: THREE.Vector3[] = [];
  for (let i = 0; i <= 16; i++) topo.push(new THREE.Vector3(x(i / 16), altura(i / 16), 0));
  por(f, tubo(topo, 0.03, 32), metal);
  // as barras e as lanças (lotes)
  const barras = new Copias();
  const lancas = new Copias();
  const n = Math.round(L / 0.13);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const h = altura(t);
    barras.por(x(t), (0.14 + h + 0.1) / 2, 0, 1, h - 0.04, 1);
    lancas.por(x(t), h + 0.08, 0, 0.05, 0.2, 0.05);
  }
  barras.montar(f, new THREE.CylinderGeometry(0.014, 0.014, 1, 5), metal);
  lancas.montar(f, geoDaLanca(), dourado);
  // a faixa de argolas entre as duas travessas de baixo
  for (let t = 0.06; t < 0.97; t += 0.088) {
    por(f, new THREE.TorusGeometry(0.15, 0.014, 5, 14), metal, x(t), 0.37, 0);
  }
  // a voluta do canto da dobradiça
  const v = voluta(0.24, 1.1, 1).map((p) => new THREE.Vector3(x(0) - s * (0.3 + p.x + 0.24), altura(0) - 0.32 + p.y, 0));
  por(f, tubo(v, 0.016, 26), metal);
  return f;
}

// ================================================================== a grade

/**
 * A GRADE da frente da escola, ao longo do `+X` de 0 a `comprimento`, com a
 * rua no `+Z`: a mureta de tijolo com o capeamento, os pilares nas pontas e
 * a cada ~3,6 m (com a bola de pedra), e a grade de lanças por cima da
 * mureta. As barras, as lanças e as bolas são lotes.
 */
export function gradeDaEscola(comprimento: number): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'grade-da-escola';
  const tijolo = tijoloMat();
  const pedra = pedraMat();
  const metal = ferro();
  const dourado = toon(P.gold);
  const L = comprimento;
  // a mureta e o capeamento
  // (a mureta e o capeamento acabam DENTRO dos pilares das pontas: na mesma ponta, as faces brigariam)
  // (a mureta afunda 2 cm no chão: o fundo dela e o dos pilares não caem no mesmo plano)
  por(g, new THREE.BoxGeometry(L - 0.12, 0.6, 0.4), tijolo, L / 2, 0.28, 0);
  por(g, new THREE.BoxGeometry(L - 0.12, 0.08, 0.5), pedra, L / 2, 0.62, 0);
  // os pilares
  const vaos = Math.max(1, Math.round(L / 3.6));
  const passo = L / vaos;
  const bolas = new Copias();
  for (let i = 0; i <= vaos; i++) {
    const x = Math.min(L - 0.29, Math.max(0.29, i * passo));
    por(g, new THREE.BoxGeometry(0.58, 1.96, 0.58), tijolo, x, 0.98, 0);
    por(g, new THREE.BoxGeometry(0.7, 0.1, 0.7), pedra, x, 2.0, 0);
    por(g, new THREE.BoxGeometry(0.5, 0.08, 0.5), pedra, x, 2.09, 0);
    bolas.por(x, 2.27, 0, 0.16, 0.16, 0.16);
  }
  bolas.montar(g, new THREE.SphereGeometry(1, 12, 8), pedra);
  // a grade entre os pilares: duas travessas, as barras e as lanças
  const barras = new Copias();
  const lancas = new Copias();
  for (let i = 0; i < vaos; i++) {
    const x0 = Math.max(0.29, i * passo) + 0.29;
    const x1 = Math.min(L - 0.29, (i + 1) * passo) - 0.29;
    if (x1 - x0 < 0.3) continue;
    por(g, new THREE.BoxGeometry(x1 - x0, 0.04, 0.04), metal, (x0 + x1) / 2, 0.82, 0);
    por(g, new THREE.BoxGeometry(x1 - x0, 0.04, 0.04), metal, (x0 + x1) / 2, 1.58, 0);
    const n = Math.max(2, Math.round((x1 - x0) / 0.15));
    for (let k = 0; k <= n; k++) {
      const x = x0 + ((x1 - x0) * k) / n;
      barras.por(x, 1.18, 0, 1, 1.12, 1);
      lancas.por(x, 1.72, 0, 0.042, 0.16, 0.042);
    }
  }
  barras.montar(g, new THREE.CylinderGeometry(0.013, 0.013, 1, 5), metal);
  lancas.montar(g, geoDaLanca(), dourado);
  return g;
}

// ================================================================= a guarita

/** a guarita: o raio até o vértice e o alto da parede */
export const GUARITA_DA_ESCOLA = { raio: 1.8, alto: 2.85 } as const;

/**
 * A GUARITA: o octógono de tijolo, irmão pequeno da rotunda. A face 0 olha
 * para a rua (`+Z`), a 6 e a 7 para o portão (`−X`), que é onde fica o
 * GUICHÊ com o balcão de pedra; a porta é a face 5 (para o pátio). As
 * janelas são de vidro de verdade: lá dentro, a mesa com a tela acesa, a
 * cadeira e o abajur. Em cima, a cupulazinha de metal com o pináculo.
 */
export function guaritaDaEscola(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'guarita-da-escola';
  const { raio: R, alto: H } = GUARITA_DA_ESCOLA;
  const OITAVO = Math.PI / 8;
  const AP = R * Math.cos(OITAVO);
  const FACE = 2 * R * Math.sin(OITAVO);
  const tijolo = tijoloMat();
  const pedra = pedraMat();
  const pedraEscura = toon(P.escolaPedraSombra, { mapa: reboco(1.2) });
  const caixilho = toon(P.escolaCaixilho);
  const metal = toon(P.escolaCupula);
  const friso = toon(P.escolaCupulaFriso);
  const dourado = toon(P.gold);
  const vidro = flat(P.escolaVidroBrilho, 0.22);
  const vidros: THREE.BufferGeometry[] = [];
  const ESP = 0.25;

  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4;
    const q = new THREE.Group();
    q.position.set(Math.sin(ang) * AP, 0, Math.cos(ang) * AP);
    q.rotation.y = ang;
    q.updateMatrix();
    g.add(q);
    const forma = retangulo(new THREE.Shape(), -FACE / 2 - 0.01, 0, FACE / 2 + 0.01, H);
    const janela = k === 0 || k === 1 || k === 6 || k === 7;
    if (janela) {
      const y0 = k === 7 ? 1.0 : 0.95;
      const y1 = 2.25;
      const meia = 0.5;
      forma.holes.push(retangulo(new THREE.Path(), -meia, y0, meia, y1));
      // o caixilho (a cruz e o batente) e o vidro, recuados
      por(q, new THREE.BoxGeometry(0.07, y1 - y0 + 0.02, 0.08), caixilho, -meia + 0.03, (y0 + y1) / 2, -0.12);
      por(q, new THREE.BoxGeometry(0.07, y1 - y0 + 0.02, 0.08), caixilho, meia - 0.03, (y0 + y1) / 2, -0.12);
      // (as travessas um tico mais rasas que os montantes: nas quinas, as faces não casam)
      por(q, new THREE.BoxGeometry(2 * meia - 0.12, 0.07, 0.07), caixilho, 0, y1 - 0.03, -0.12);
      por(q, new THREE.BoxGeometry(2 * meia - 0.12, 0.07, 0.07), caixilho, 0, y0 + 0.03, -0.12);
      por(q, new THREE.BoxGeometry(0.04, y1 - y0 - 0.1, 0.05), caixilho, 0, (y0 + y1) / 2, -0.125);
      por(q, new THREE.BoxGeometry(2 * meia - 0.12, 0.04, 0.045), caixilho, 0, y0 + (y1 - y0) * 0.62, -0.125);
      const v = new THREE.PlaneGeometry(2 * meia - 0.06, y1 - y0 - 0.06);
      v.translate(0, (y0 + y1) / 2, -0.14);
      v.applyMatrix4(q.matrix);
      vidros.push(v);
      // o peitoril; no guichê (a face 7), o balcão de pedra que avança
      if (k === 7) por(q, new THREE.BoxGeometry(1.3, 0.08, 0.6), pedra, 0, y0 - 0.05, 0.1);
      else por(q, new THREE.BoxGeometry(1.2, 0.09, 0.22), pedra, 0, y0 - 0.06, 0.06);
      // o lintel de pedra
      por(q, new THREE.BoxGeometry(1.3, 0.24, 0.08), pedra, 0, y1 + 0.13, 0.02);
    }
    if (k === 5) {
      // a porta: o vão até o chão, a folha de madeira pintada com a janelinha
      forma.holes.length = 0;
      const porta = new THREE.Shape();
      porta.moveTo(-FACE / 2 - 0.01, 0);
      porta.lineTo(-0.45, 0);
      porta.lineTo(-0.45, 2.15);
      porta.lineTo(0.45, 2.15);
      porta.lineTo(0.45, 0);
      porta.lineTo(FACE / 2 + 0.01, 0);
      porta.lineTo(FACE / 2 + 0.01, H);
      porta.lineTo(-FACE / 2 - 0.01, H);
      porta.closePath();
      por(q, extrudar(porta, ESP, -ESP, 4), tijolo);
      por(q, new THREE.BoxGeometry(0.88, 2.12, 0.06), toon(P.bandeiraGatitosAzul), 0, 1.07, -0.14);
      por(q, new THREE.BoxGeometry(0.04, 0.2, 0.06), dourado, 0.32, 1.05, -0.09);
      por(q, new THREE.BoxGeometry(1.04, 0.24, 0.08), pedra, 0, 2.28, 0.02);
      continue;
    }
    por(q, extrudar(forma, ESP, -ESP, 4), tijolo);
  }
  const octogono = Array.from({ length: 8 }, (_, i) => {
    const a = OITAVO + (((i + 7) % 8) * Math.PI) / 4;
    return new THREE.Vector2(R * Math.sin(a), R * Math.cos(a));
  });
  const molduras: Array<[Perfil, THREE.Material]> = [
    [[[0, 0], [0.14, 0], [0.14, 0.4], [0.07, 0.46], [0, 0.46]], pedraEscura],
    [[[0, H - 0.34], [0.12, H - 0.34], ...cavetinho([0.12, H - 0.34], [0.3, H - 0.08]), [0.3, H + 0.06], [0, H + 0.06]], pedra],
  ];
  for (const [perfil, mat] of molduras) g.add(new THREE.Mesh(contornoPoligonal(perfil, octogono), mat));

  // a cúpula de metal de oito gomos, a lanterninha e o pináculo
  const torno = (pts: Array<[number, number]>): THREE.BufferGeometry => {
    const geo = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 8, OITAVO).toNonIndexed();
    geo.computeVertexNormals();
    return geo;
  };
  g.add(new THREE.Mesh(torno([[R - 0.2, H], [R + 0.36, H + 0.08], [R + 0.3, H + 0.2], [R - 0.4, H + 0.75], [0.62, H + 1.25], [0.55, H + 1.32], [0.01, H + 1.32]]), metal));
  // as costuras da cúpula, uma em cada quina
  // (em dois trechos, seguindo o perfil da cúpula: reta de ponta a ponta, ela entrava no metal na dobra)
  const perfilDaCupula: Array<[number, number]> = [[R + 0.3, H + 0.2], [R - 0.4, H + 0.75], [0.62, H + 1.25]];
  for (let k = 0; k < 8; k++) {
    const a = OITAVO + (k * Math.PI) / 4;
    for (let i = 0; i < perfilDaCupula.length - 1; i++) {
      const [r0, y0] = perfilDaCupula[i];
      const [r1, y1] = perfilDaCupula[i + 1];
      const de = new THREE.Vector3(r0 * Math.sin(a), y0 + 0.03, r0 * Math.cos(a));
      const ate = new THREE.Vector3(r1 * Math.sin(a), y1 + 0.03, r1 * Math.cos(a));
      const dir = ate.clone().sub(de);
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.07, dir.length() + 0.04, 0.07), friso);
      m.position.copy(de.clone().add(ate).multiplyScalar(0.5));
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      g.add(m);
    }
  }
  const lanterna = new THREE.Mesh(torno([[0.5, H + 1.3], [0.5, H + 1.72], [0.6, H + 1.78], [0.38, H + 2.05], [0.01, H + 2.12]]), toon(P.escolaLanterna));
  g.add(lanterna);
  por(g, new THREE.SphereGeometry(0.1, 10, 8), dourado, 0, H + 2.2, 0);
  por(g, new THREE.ConeGeometry(0.035, 0.5, 6), dourado, 0, H + 2.5, 0);

  // lá dentro: o chão, a mesa com a tela acesa, a cadeira e o abajur (o que se vê pelo vidro)
  const dentro = new THREE.Group();
  g.add(dentro);
  por(dentro, new THREE.CylinderGeometry(AP - 0.2, AP - 0.2, 0.04, 8), toon(P.escolaPiso), 0, 0.02, 0);
  // a mesa encostada no guichê (do lado do portão)
  // (o balcão de dentro corre ao longo da face 7, por baixo do guichê)
  const mesa = por(dentro, quina(1.2, 0.82, 0.5, 0.03), toon(P.wood), -0.8, 0.41, 0.66);
  mesa.rotation.y = -Math.PI / 4;
  const tela = por(dentro, new THREE.BoxGeometry(0.42, 0.28, 0.03), toon(P.escolaVidroBrilho, { glow: 0.7 }), -0.8, 1.0, 0.56);
  tela.rotation.y = Math.PI * 0.75;
  por(dentro, quina(0.48, 0.5, 0.48, 0.06), toon(P.escolaSofa), -0.25, 0.25, 0.1);
  por(dentro, new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), dourado, -0.45, 1.02, 0.98);
  por(dentro, new THREE.ConeGeometry(0.15, 0.16, 10, 1, true), toon(P.luzDoPoste, { glow: 0.8 }), -0.45, 1.27, 0.98);

  g.add(new THREE.Mesh(mergeOuNada(vidros), vidro));
  return g;
}

function mergeOuNada(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  for (const geo of geos) {
    const solta = geo.index ? geo.toNonIndexed() : geo;
    pos.push(...(solta.getAttribute('position').array as Float32Array));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

// ============================================================ os balizadores

/**
 * OS BALIZADORES: o postinho de luz baixo da beira do calçadão — o corpo de
 * ferro, a faixa acesa embaixo do chapéu e o chapéu. Três lotes para todos.
 */
export function balizadores(pontos: ReadonlyArray<readonly [number, number]>): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balizadores';
  const corpos = new Copias();
  const luzes = new Copias();
  const chapeus = new Copias();
  for (const [x, z] of pontos) {
    corpos.por(x, 0.32, z, 1, 1, 1);
    luzes.por(x, 0.7, z, 1, 1, 1);
    chapeus.por(x, 0.82, z, 1, 1, 1);
  }
  corpos.montar(g, new THREE.CylinderGeometry(0.08, 0.1, 0.64, 10), ferro());
  luzes.montar(g, new THREE.CylinderGeometry(0.075, 0.075, 0.12, 10), toon(P.luzDoPoste, { glow: 0.85 }));
  chapeus.montar(g, new THREE.CylinderGeometry(0.06, 0.13, 0.1, 10), ferro());
  return g;
}
