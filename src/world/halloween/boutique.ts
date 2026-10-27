import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../fundir';
import { caldeirao } from './pecas';
import { aboboraEsculpida } from './abobora';

/**
 * AS PEÇAS DA BOUTIQUE DE HALLOWEEN (`docs/HALLOWEEN.md`, §2.3.1): o que a
 * etapa 3 trouxe para o kit do evento.
 *
 * - `cachoDeBexigas`: o cacho de BEXIGAS DE CAVEIRA (pedido do Renan) —
 *   bexigas brancas com a caveirinha sorrindo pintada, misturadas com uma roxa
 *   e uma laranja lisas, amarradas em fitas que se enrolam até o peso;
 * - `caldeiraoDeBalas`: o caldeirão do kit cheio de balas embrulhadas;
 * - `caixaDePresente`: a caixa da Estella, listrada, com o laço de fita, a
 *   etiqueta com o nome e a TAMPA num grupo próprio (ela pula no provador);
 * - `cestaDeAbobora`: o balde de doces de plástico, com a alça e a carinha;
 * - `meiaQueVoa`, `poteDeBiscoitos`, `placaDoProvador`, `mantinhaDobrada`.
 *
 * Tudo com a base em `y = 0` e de frente para `+Z`, e termina em `fundir()`
 * (o que se mexe tem nome e fica de fora).
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

function canvasTex(l: number, a: number, desenho: (c: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = l;
  cv.height = a;
  const c = cv.getContext('2d');
  if (c) {
    c.lineJoin = 'round';
    c.lineCap = 'round';
    desenho(c);
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

// ======================================================= as bexigas de caveira

/**
 * A CARA DA CAVEIRINHA pintada na bexiga, no mapa UV da esfera: a frente da
 * esfera (`+Z`) é `u = 0,25`. Olhos grandes de feijão com o brilho, o
 * narizinho de coração de cabeça para baixo, o sorriso com os dentinhos e as
 * bochechas rosadas — caveira fofa, de festa.
 */
let caraDeCaveira: THREE.CanvasTexture | null = null;
function texturaDaCaveira(): THREE.CanvasTexture {
  if (caraDeCaveira) return caraDeCaveira;
  caraDeCaveira = canvasTex(512, 256, (c) => {
    c.fillStyle = css(P.fantasmaDePano);
    c.fillRect(0, 0, 512, 256);
    // o brilho do látex, no alto
    const brilho = c.createRadialGradient(100, 70, 4, 100, 70, 60);
    brilho.addColorStop(0, 'rgba(255,255,255,0.9)');
    brilho.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = brilho;
    c.fillRect(30, 10, 140, 120);
    const cx = 128;
    const cy = 128;
    const escuro = '#2b2433';
    // os olhos
    for (const s of [-1, 1]) {
      c.fillStyle = escuro;
      c.beginPath();
      c.ellipse(cx + s * 30, cy - 14, 21, 25, s * 0.25, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(cx + s * 30 - 7, cy - 22, 7, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(cx + s * 30 + 6, cy - 8, 3, 0, Math.PI * 2);
      c.fill();
      // a bochecha
      c.fillStyle = 'rgba(240,130,150,0.55)';
      c.beginPath();
      c.ellipse(cx + s * 50, cy + 14, 11, 7, 0, 0, Math.PI * 2);
      c.fill();
    }
    // o narizinho: um coração de cabeça para baixo
    c.fillStyle = escuro;
    c.beginPath();
    c.moveTo(cx, cy + 18);
    c.bezierCurveTo(cx - 12, cy + 6, cx - 7, cy - 2, cx, cy + 5);
    c.bezierCurveTo(cx + 7, cy - 2, cx + 12, cy + 6, cx, cy + 18);
    c.fill();
    // o sorriso com os dentinhos
    c.strokeStyle = escuro;
    c.lineWidth = 5;
    c.beginPath();
    c.arc(cx, cy + 16, 24, 0.25, Math.PI - 0.25);
    c.stroke();
    c.lineWidth = 3;
    for (const dx of [-12, -4, 4, 12]) {
      const yy = cy + 16 + Math.sqrt(Math.max(0, 24 * 24 - dx * dx));
      c.beginPath();
      c.moveTo(cx + dx, yy - 9);
      c.lineTo(cx + dx, yy + 1);
      c.stroke();
    }
  });
  return caraDeCaveira;
}

/** uma bexiga: a esfera um tico achatada embaixo, o biquinho do nó */
function geoBexiga(raio: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(raio, 24, 18);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / raio;
    // a gota: mais larga em cima, afinando para o nó
    const k = 1 - 0.18 * Math.max(0, -y) ** 1.5;
    pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * 1.12, pos.getZ(i) * k);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * O CACHO DE BEXIGAS: `n` bexigas a alturas e ângulos diferentes, presas por
 * fitas que descem enrolando até o pesinho (uma aboborinha). Com `caveiras`
 * ele mistura uma roxa e uma laranja lisas no meio das de caveira. O grupo
 * `bexigas` balança devagar (quem chama faz o `update`, ver `balancarBexigas`).
 */
export function cachoDeBexigas(n = 5, alto = 1.9, semente = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bexigas-de-caveira';
  const rnd = ((s: number) => () => ((s = (s * 9301 + 49297) % 233280) / 233280))(semente * 977 + 13);
  const bexigas = new THREE.Group();
  bexigas.name = 'bexigas';
  const caveira = toon(0xffffff, { mapa: texturaDaCaveira() });
  const lisas = [toon(P.halloweenRoxo), toon(P.halloweenLaranja)];
  const fita = toon(P.halloweenLilas);
  const R = 0.2;
  const geo = geoBexiga(R);
  const no = new THREE.ConeGeometry(R * 0.12, R * 0.18, 8);
  const base = new THREE.Vector3(0, 0.12, 0);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd() * 0.8;
    const d = i === 0 ? 0 : 0.18 + rnd() * 0.12;
    const y = alto - (i === 0 ? 0 : 0.1 + rnd() * 0.35);
    const p = new THREE.Vector3(Math.sin(a) * d, y, Math.cos(a) * d);
    // a de caveira é a regra; uma roxa e uma laranja lisas no meio
    const lisa = n >= 4 && (i === 2 || i === 4);
    const bexiga = por(bexigas, geo, lisa ? lisas[i === 2 ? 0 : 1] : caveira, p.x, p.y, p.z);
    // de frente para a câmera (a cara em `+Z`, girada um tico para o lado)
    bexiga.rotation.y = (rnd() - 0.5) * 0.9;
    bexiga.rotation.z = (rnd() - 0.5) * 0.25;
    const ponta = por(bexigas, no, lisa ? lisas[i === 2 ? 0 : 1] : toon(P.fantasmaDePano), p.x, p.y - R * 1.17, p.z);
    ponta.rotation.x = Math.PI;
    // a fita: do nó até o peso, em zigue-zague de fita enrolada
    const pts: THREE.Vector3[] = [];
    const de = new THREE.Vector3(p.x, p.y - R * 1.25, p.z);
    for (let k = 0; k <= 10; k++) {
      const t = k / 10;
      const q = de.clone().lerp(base, t);
      q.x += Math.sin(t * 9 + i) * 0.025 * (1 - t);
      q.z += Math.cos(t * 9 + i) * 0.025 * (1 - t);
      pts.push(q);
    }
    por(bexigas, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.004, 4, false), fita);
  }
  g.add(fundirNoGrupo(bexigas));
  // o pesinho: uma aboborinha de enfeite com o laço
  const peso = aboboraEsculpida('pequena', 'sorriso');
  peso.scale.setScalar(0.55);
  g.add(peso);
  return g;
}

/** funde o que está dentro de um grupo com nome, mantendo o grupo (ele balança) */
function fundirNoGrupo(grupo: THREE.Group): THREE.Group {
  const pai = new THREE.Group();
  pai.add(grupo);
  fundir(pai);
  return grupo;
}

/** o balanço de um cacho (`update` por quadro): devagar, como bexiga presa em fita */
export function balancarBexigas(cacho: THREE.Object3D, t: number): void {
  const b = cacho.getObjectByName('bexigas');
  if (!b) return;
  const fase = (cacho.userData.fase as number | undefined) ?? (cacho.userData.fase = cacho.position.x * 1.7 + cacho.position.z);
  b.rotation.z = Math.sin(t * 0.9 + fase) * 0.035;
  b.rotation.x = Math.sin(t * 0.7 + fase * 1.3) * 0.03;
}

// =========================================================== o caldeirão de balas

/** o caldeirão do kit cheio de balas embrulhadas, em lote (cor por cópia) */
export function caldeiraoDeBalas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caldeirao-de-balas';
  g.add(fundir(caldeirao()));
  const balas = new THREE.Group();
  // o monte: uma calota escura de fundo e as balas por cima
  por(balas, new THREE.SphereGeometry(0.29, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.32, 1), toon(P.balaoEscuro), 0, 0.58, 0);
  const geoMiolo = new THREE.SphereGeometry(0.03, 10, 8).scale(1.25, 0.85, 0.85);
  const geoPonta = new THREE.ConeGeometry(0.022, 0.03, 6);
  const cores = [P.halloweenLaranja, P.halloweenRoxo, P.verdePocao, P.lojaToldo, 0xf2cf48, P.halloweenLilas];
  const N = 30;
  const miolos = new THREE.InstancedMesh(geoMiolo, toon(0xffffff), N);
  const pontas = new THREE.InstancedMesh(mergeDuasPontas(geoPonta), toon(0xffffff), N);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const a = i * 2.39996;
    const r = 0.25 * Math.sqrt((i + 0.5) / N);
    const y = 0.6 + 0.09 * (1 - (r / 0.25) ** 2) + ((i * 7) % 3) * 0.008;
    m.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    m.rotation.set((i % 5) * 0.3, a, (i % 3) * 0.4);
    m.updateMatrix();
    miolos.setMatrixAt(i, m.matrix);
    pontas.setMatrixAt(i, m.matrix);
    cor.set(cores[i % cores.length]);
    miolos.setColorAt(i, cor);
    pontas.setColorAt(i, cor.multiplyScalar(0.85));
  }
  balas.add(miolos, pontas);
  g.add(balas);
  return g;
}

/** as duas pontas torcidas do embrulho, uma para cada lado do miolo */
function mergeDuasPontas(cone: THREE.BufferGeometry): THREE.BufferGeometry {
  const a = cone.clone().rotateZ(Math.PI / 2).translate(-0.05, 0, 0);
  const b = cone.clone().rotateZ(-Math.PI / 2).translate(0.05, 0, 0);
  const pa = a.toNonIndexed();
  const pb = b.toNonIndexed();
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(pa.attributes.position.array.length + pb.attributes.position.array.length);
  pos.set(pa.attributes.position.array as Float32Array, 0);
  pos.set(pb.attributes.position.array as Float32Array, pa.attributes.position.array.length);
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

// ============================================================ a caixa de presente

/**
 * A CAIXA DE PRESENTE da Estella: listrada (a Estella embrulha em tecido, e
 * não em papel), com a fita cruzada, o laço grande em cima e a ETIQUETA com o
 * nome de quem ganha, na letra dela. A tampa mora no grupo `tampa`, com o laço
 * junto: no provador ela pula.
 */
export function caixaDePresente(nome: string, listra: number, fundo: number, fita: number): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caixa-de-presente';
  const L = 0.34;
  const A = 0.24;
  const tecido = toon(0xffffff, {
    mapa: canvasTex(128, 64, (c) => {
      c.fillStyle = css(fundo);
      c.fillRect(0, 0, 128, 64);
      c.fillStyle = css(listra);
      for (let x = -64; x < 128; x += 24) {
        c.beginPath();
        c.moveTo(x, 64);
        c.lineTo(x + 12, 64);
        c.lineTo(x + 76, 0);
        c.lineTo(x + 64, 0);
        c.closePath();
        c.fill();
      }
    }),
  });
  const matFita = toon(fita);
  const corpo = new THREE.Group();
  por(corpo, new THREE.BoxGeometry(L, A * 0.82, L), tecido, 0, A * 0.41, 0);
  por(corpo, new THREE.BoxGeometry(L * 1.006, A * 0.82, 0.05), matFita, 0, A * 0.41, 0);
  por(corpo, new THREE.BoxGeometry(0.05, A * 0.82, L * 1.006), matFita, 0, A * 0.41, 0);
  g.add(corpo);
  const tampa = new THREE.Group();
  tampa.name = 'tampa';
  tampa.position.y = A * 0.82;
  por(tampa, new THREE.BoxGeometry(L * 1.06, A * 0.2, L * 1.06), tecido, 0, A * 0.1, 0);
  por(tampa, new THREE.BoxGeometry(L * 1.066, A * 0.2, 0.052), matFita, 0, A * 0.1, 0);
  por(tampa, new THREE.BoxGeometry(0.052, A * 0.2, L * 1.066), matFita, 0, A * 0.1, 0);
  // o laço: duas alças de fita gordas e o nó
  for (const s of [-1, 1]) {
    const alca = por(tampa, new THREE.TorusGeometry(0.06, 0.02, 8, 16).scale(1.25, 0.9, 0.7), matFita, s * 0.065, A * 0.24, 0);
    alca.rotation.set(0, 0, s * 0.45);
    const ponta = por(tampa, new THREE.BoxGeometry(0.045, 0.012, 0.11), matFita, s * 0.04, A * 0.205, 0.07);
    ponta.rotation.y = s * 0.5;
  }
  por(tampa, new THREE.SphereGeometry(0.03, 10, 8), matFita, 0, A * 0.24, 0);
  // A ETIQUETA, pendurada no laço, com o nome na letra da Estella
  const etiqueta = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 0.075),
    toon(0xffffff, {
      doubleSide: true,
      mapa: canvasTex(256, 128, (c) => {
        c.fillStyle = css(P.papelDoRecado);
        c.fillRect(0, 0, 256, 128);
        c.strokeStyle = css(fita);
        c.setLineDash([10, 7]);
        c.lineWidth = 5;
        c.strokeRect(10, 10, 236, 108);
        c.setLineDash([]);
        c.fillStyle = css(P.tintaDoRecado);
        c.font = '700 64px Caveat, "Segoe Print", cursive';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(nome, 128, 66);
      }),
    }),
  );
  etiqueta.position.set(0.1, A * 0.05, L * 0.55);
  etiqueta.rotation.set(-0.3, 0.2, -0.12);
  tampa.add(etiqueta);
  g.add(tampa);
  fundir(corpo);
  fundir(tampa);
  return g;
}

// ============================================================== a cesta de abóbora

/**
 * A CESTINHA DE ABÓBORA: o balde de doces de plástico, laranja, com os gomos,
 * a carinha recortada (pintada, preta) e a alça de arame. A base em `y = 0`;
 * na mão ela pende pela alça (`holdPose: 'relaxed'`).
 */
export function cestaDeAbobora(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cesta-de-abobora';
  const plastico = toon(P.halloweenLaranja, { doubleSide: true });
  const R = 0.1;
  const perfil: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const r = R * (0.72 + 0.32 * Math.sin(t * Math.PI * 0.9 + 0.2));
    perfil.push(new THREE.Vector2(i === 0 ? 0.001 : r, t * R * 1.5));
  }
  perfil.push(new THREE.Vector2(R * 0.86, R * 1.52));
  const geo = new THREE.LatheGeometry(perfil, 32);
  // os gomos: o raio entra em oito vincos
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const a = Math.atan2(x, z);
    const k = 1 - 0.05 * Math.pow(Math.abs(Math.cos(a * 4)), 6);
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  geo.computeVertexNormals();
  por(g, geo, plastico);
  // a boca virada
  por(g, new THREE.TorusGeometry(R * 0.87, R * 0.06, 6, 32).rotateX(Math.PI / 2), toon(P.halloweenLaranja), 0, R * 1.52, 0);
  // a carinha pintada na frente: os olhos triangulares e o sorriso de dentes
  const preto = toon(P.olhoDeBoneco);
  for (const s of [-1, 1]) {
    const olho = new THREE.Shape();
    olho.moveTo(-0.022, 0);
    olho.lineTo(0.022, 0);
    olho.lineTo(0, 0.03);
    olho.closePath();
    const m = por(g, new THREE.ShapeGeometry(olho), preto, s * 0.04, R * 0.85, 0);
    const z = Math.sqrt(Math.max(0, (R * 1.03) ** 2 - 0.04 ** 2));
    m.position.z = z;
    m.rotation.y = s * 0.4;
  }
  const boca = new THREE.Shape();
  boca.moveTo(-0.055, 0);
  boca.quadraticCurveTo(0, -0.045, 0.055, 0);
  boca.lineTo(0.03, -0.005);
  boca.lineTo(0.015, 0.008);
  boca.lineTo(0, -0.004);
  boca.lineTo(-0.015, 0.008);
  boca.lineTo(-0.03, -0.005);
  boca.closePath();
  const geoBoca = new THREE.ShapeGeometry(boca, 10);
  // dobra a boca no bojo
  const pb = geoBoca.attributes.position;
  for (let i = 0; i < pb.count; i++) {
    const x = pb.getX(i);
    const a = x / (R * 1.04);
    pb.setXYZ(i, Math.sin(a) * R * 1.045, pb.getY(i) + R * 0.6, Math.cos(a) * R * 1.045);
  }
  geoBoca.computeVertexNormals();
  por(g, geoBoca, preto);
  // a alça de arame preta, de orelha a orelha
  const alca = new THREE.TorusGeometry(R * 0.86, 0.006, 5, 24, Math.PI);
  por(g, alca, toon(P.aramePreto), 0, R * 1.52, 0);
  for (const s of [-1, 1]) por(g, new THREE.SphereGeometry(0.012, 8, 6), toon(P.aramePreto), s * R * 0.86, R * 1.52, 0);
  return fundir(g);
}

// ======================================================= as miudezas da cena

/** a MEIA que voa por cima da cortina do provador: listrada, de cano curto */
export function meiaQueVoa(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'meia-que-voa';
  const listra = toon(0xffffff, {
    mapa: canvasTex(64, 64, (c) => {
      c.fillStyle = css(P.halloweenLaranja);
      c.fillRect(0, 0, 64, 64);
      c.fillStyle = css(P.halloweenRoxo);
      for (let y = 0; y < 64; y += 16) c.fillRect(0, y, 64, 8);
    }),
  });
  const cano = new THREE.CylinderGeometry(0.035, 0.032, 0.14, 12);
  por(g, cano, listra, 0, 0.07, 0);
  const pe = new THREE.CapsuleGeometry(0.032, 0.08, 4, 10);
  pe.rotateX(Math.PI / 2);
  por(g, pe, listra, 0, 0.0, 0.05);
  return fundir(g);
}

/** o pote de vidro de biscoitos de fantasminha, em cima do balcão */
export function poteDeBiscoitos(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pote-de-biscoitos';
  const vidro = toon(0xdff1f2, { opacity: 0.45 });
  por(g, new THREE.CylinderGeometry(0.1, 0.1, 0.2, 20, 1, true), vidro, 0, 0.1, 0);
  por(g, new THREE.CylinderGeometry(0.105, 0.105, 0.035, 20), toon(P.halloweenRoxo), 0, 0.215, 0);
  por(g, new THREE.SphereGeometry(0.025, 10, 8), toon(P.halloweenRoxo), 0, 0.245, 0);
  // os biscoitos de fantasminha, empilhados dentro
  const biscoito = new THREE.Shape();
  biscoito.moveTo(-0.035, -0.035);
  biscoito.lineTo(-0.035, 0.005);
  biscoito.absarc(0, 0.005, 0.035, Math.PI, 0, true);
  biscoito.lineTo(0.035, -0.035);
  biscoito.lineTo(0.018, -0.025);
  biscoito.lineTo(0, -0.035);
  biscoito.lineTo(-0.018, -0.025);
  biscoito.closePath();
  const geoB = new THREE.ExtrudeGeometry(biscoito, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1 });
  const massa = toon(P.fantasmaDePano);
  const olho = toon(P.olhoDeBoneco);
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Group();
    por(b, geoB, massa);
    for (const s of [-1, 1]) por(b, new THREE.SphereGeometry(0.006, 6, 4), olho, s * 0.012, 0.01, 0.018);
    b.position.set((i % 2 ? 0.03 : -0.03), 0.05 + Math.floor(i / 2) * 0.07, (i % 3) * 0.01 - 0.01);
    b.rotation.set(0, (i - 1.5) * 0.4, (i - 1.5) * 0.25);
    g.add(b);
  }
  return fundir(g);
}

/** a plaquinha "Provador assombrado", pendurada por duas correntinhas */
export function placaDoProvador(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-do-provador';
  const papel = toon(0xffffff, {
    mapa: canvasTex(384, 128, (c) => {
      c.fillStyle = css(P.halloweenRoxoEscuro);
      c.fillRect(0, 0, 384, 128);
      c.strokeStyle = css(P.halloweenLaranjaClaro);
      c.lineWidth = 6;
      c.strokeRect(10, 10, 364, 108);
      c.fillStyle = css(P.halloweenLaranjaClaro);
      c.font = '700 50px Caveat, "Segoe Print", cursive';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('Provador assombrado', 192, 60);
      // um fantasminha de cada lado
      for (const x of [34, 350]) {
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(x, 56, 14, Math.PI, 0);
        c.lineTo(x + 14, 82);
        c.lineTo(x + 7, 76);
        c.lineTo(x, 82);
        c.lineTo(x - 7, 76);
        c.lineTo(x - 14, 82);
        c.closePath();
        c.fill();
        c.fillStyle = '#2b2433';
        c.beginPath();
        c.arc(x - 5, 56, 2.6, 0, Math.PI * 2);
        c.arc(x + 5, 56, 2.6, 0, Math.PI * 2);
        c.fill();
      }
    }),
  });
  por(g, new THREE.BoxGeometry(0.72, 0.24, 0.02), papel, 0, 0, 0);
  const corrente = toon(P.boutiqueOuro);
  for (const s of [-1, 1]) {
    const fio = por(g, new THREE.CylinderGeometry(0.004, 0.004, 0.22, 4), corrente, s * 0.28, 0.23, 0);
    fio.rotation.z = s * 0.25;
  }
  return fundir(g);
}

/** a mantinha laranja de tricô, dobrada no braço da namoradeira */
export function mantinhaDobrada(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mantinha-dobrada';
  const trico = toon(0xffffff, {
    mapa: canvasTex(64, 64, (c) => {
      c.fillStyle = css(P.halloweenLaranja);
      c.fillRect(0, 0, 64, 64);
      c.strokeStyle = 'rgba(120,50,10,0.25)';
      c.lineWidth = 3;
      for (let x = 0; x < 64; x += 8) {
        for (let y = -8; y < 64; y += 8) {
          c.beginPath();
          c.moveTo(x, y);
          c.lineTo(x + 4, y + 5);
          c.lineTo(x + 8, y);
          c.stroke();
        }
      }
      c.fillStyle = css(P.halloweenRoxo);
      c.fillRect(0, 50, 64, 6);
    }),
  });
  for (let k = 0; k < 3; k++) {
    const dobra = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.42, 4, 10), trico);
    dobra.rotation.z = Math.PI / 2;
    dobra.scale.set(1, 1, 2.2);
    dobra.position.set(0, 0.03 + k * 0.045, 0);
    g.add(dobra);
  }
  return fundir(g);
}

/** o MAPINHA enrolado, como ele fica na mão: o rolo de papel com a fitinha roxa */
export function mapinhaEnrolado(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mapinha-enrolado';
  const papel = toon(0xfbe6c4);
  const rolo = new THREE.CylinderGeometry(0.028, 0.028, 0.2, 14);
  rolo.rotateZ(Math.PI / 2);
  por(g, rolo, papel, 0, 0.03, 0);
  // a ponta do papel que escapa do rolo, e as bordas um tico mais escuras
  const aba = por(g, new THREE.PlaneGeometry(0.2, 0.05), toon(0xf3d6a8, { doubleSide: true }), 0, 0.012, 0.03);
  aba.rotation.x = -1.2;
  for (const s of [-1, 1]) por(g, new THREE.TorusGeometry(0.026, 0.004, 5, 14).rotateY(Math.PI / 2), toon(0xe2bf8a), s * 0.1, 0.03, 0);
  // a fitinha roxa amarrada no meio, com o lacinho
  por(g, new THREE.TorusGeometry(0.031, 0.006, 6, 18).rotateY(Math.PI / 2), toon(P.halloweenRoxo), 0, 0.03, 0);
  for (const s of [-1, 1]) {
    const alca = por(g, new THREE.TorusGeometry(0.014, 0.004, 5, 10), toon(P.halloweenRoxo), s * 0.012, 0.062, 0);
    alca.rotation.z = s * 0.6;
  }
  return fundir(g);
}
