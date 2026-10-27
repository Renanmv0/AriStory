import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { geoFlor, geoFolha, quina } from '../lojaDeRoupas';
import { uvEmMetrosPorTriangulo } from '../acabamento';
import { LoteDeAboboras } from './abobora';

/*
 * AS PEÇAS DO PARQUE ENFEITADO que não se penduram (`docs/HALLOWEEN.md`,
 * §4.1): o fardo de feno, o espantalho de boas-vindas, o arco de balões, as
 * lápides fofas, o caldeirão, a guirlanda de porta, o chapéu de bruxa, o
 * lençol de fantasma da bilheteria, a plaquinha de recado e o pompom.
 *
 * Toda peça segue o contrato do kit (base em `y = 0`, olhando para `+Z`), e a
 * cena passa cada uma pela `fundir()`. O que se repete pelo parque inteiro
 * (as lápides) é um lote.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

function canvasTex(l: number, a: number, desenho: (c: CanvasRenderingContext2D) => void, repetir = false): THREE.CanvasTexture {
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
  if (repetir) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** um sorteio de semente fixa (a foto do teste não muda sozinha) */
function sorteio(semente: number): () => number {
  let s = (semente * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

// ============================================================== o feno

let palha: THREE.CanvasTexture | null = null;
/** a palha: fiapos compridos deitados, claros e escuros, sobre o branco (o material dá o amarelo) */
function texturaDePalha(): THREE.CanvasTexture {
  if (palha) return palha;
  palha = canvasTex(256, 256, (c) => {
    c.fillStyle = '#f4eee0';
    c.fillRect(0, 0, 256, 256);
    const rnd = sorteio(11);
    for (let i = 0; i < 420; i++) {
      const x = rnd() * 256;
      const y = rnd() * 256;
      const l = 18 + rnd() * 46;
      const a = (rnd() - 0.5) * 0.35;
      c.strokeStyle = rnd() < 0.5 ? 'rgba(170,130,60,0.55)' : 'rgba(255,250,225,0.8)';
      c.lineWidth = 1.5 + rnd() * 2;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      c.stroke();
    }
  }, true);
  palha.repeat.set(1 / 0.6, 1 / 0.6);
  return palha;
}

/**
 * O FARDO DE FENO: a caixa de quina bem redonda com a palha em textura, os
 * dois barbantes apertando (o fardo estufa entre eles) e os fiapos soltos
 * espetados nas beiras, em lote.
 */
export function fardoDeFeno(comprimento = 1.0, alto = 0.48, fundo = 0.6): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'fardo-de-feno';
  const corpo = uvEmMetrosPorTriangulo(quina(comprimento, alto, fundo, 0.07));
  por(g, corpo, toon(P.feno, { mapa: texturaDePalha() }), 0, alto / 2, 0);
  // os barbantes: um aro de quina redonda em volta do fardo, um tico para fora
  for (const x of [-comprimento * 0.27, comprimento * 0.27]) {
    const aro = quina(0.03, alto + 0.012, fundo + 0.012, 0.05);
    por(g, aro, toon(P.barbante), x, alto / 2, 0);
  }
  // os fiapos soltos: palitinhos finos nas beiras de cima e no pé
  const rnd = sorteio(Math.round(comprimento * 100 + fundo * 10));
  const N = 70;
  const fiapo = new THREE.CylinderGeometry(0.004, 0.006, 0.14, 3).translate(0, 0.07, 0);
  const lote = new THREE.InstancedMesh(fiapo, toon(0xffffff), N);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const emCima = i < N * 0.65;
    const lado = rnd() < 0.5 ? -1 : 1;
    const ao = rnd() < 0.5;
    // nas quinas de cima (frente/trás e pontas) e saindo do pé
    const x = ao ? (rnd() - 0.5) * comprimento * 0.95 : lado * comprimento * 0.47;
    const z = ao ? lado * fundo * 0.47 : (rnd() - 0.5) * fundo * 0.9;
    m.position.set(x, emCima ? alto - 0.03 : 0.04, z);
    const fora = new THREE.Vector3(ao ? 0 : lado, emCima ? 0.6 : -0.1, ao ? lado : 0).normalize();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), fora.add(new THREE.Vector3((rnd() - 0.5) * 0.8, rnd() * 0.5, (rnd() - 0.5) * 0.8)).normalize());
    m.scale.setScalar(0.6 + rnd() * 0.9);
    m.updateMatrix();
    lote.setMatrixAt(i, m.matrix);
    lote.setColorAt(i, cor.set(rnd() < 0.5 ? P.feno : P.fenoEscuro));
  }
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  lote.userData.semSombra = true;
  g.add(lote);
  return g;
}

// ======================================================== o espantalho

let xadrez: THREE.CanvasTexture | null = null;
const xadrezPorRepeticao = new Map<string, THREE.Texture>();
/** o xadrez da camisa, repetido `u × v` vezes no UV de 0 a 1 do cilindro */
function texturaDeXadrez(u: number, v: number): THREE.Texture {
  const chave = `${u}|${v}`;
  const pronta = xadrezPorRepeticao.get(chave);
  if (pronta) return pronta;
  const t = xadrezBase().clone();
  t.repeat.set(u, v);
  t.needsUpdate = true;
  xadrezPorRepeticao.set(chave, t);
  return t;
}
function xadrezBase(): THREE.CanvasTexture {
  if (xadrez) return xadrez;
  xadrez = canvasTex(128, 128, (c) => {
    c.fillStyle = css(P.xadrezDoEspantalho);
    c.fillRect(0, 0, 128, 128);
    // as faixas largas escuras e as finas claras, nas duas direções
    c.fillStyle = 'rgba(70,20,20,0.35)';
    c.fillRect(0, 40, 128, 40);
    c.fillRect(40, 0, 40, 128);
    c.fillStyle = 'rgba(255,230,190,0.55)';
    c.fillRect(0, 100, 128, 6);
    c.fillRect(100, 0, 6, 128);
  }, true);
  return xadrez;
}

let juta: THREE.CanvasTexture | null = null;
/**
 * O SACO DE JUTA DA CABEÇA, com a cara: a trama, os olhos de botão (a linha
 * cruzada), as bochechas, o nariz de triângulo e o sorriso costurado. A cara
 * mora em `u = 0,25`, que é a frente (`+Z`) da `SphereGeometry`.
 */
function texturaDaCabeca(): THREE.CanvasTexture {
  if (juta) return juta;
  juta = canvasTex(512, 256, (c) => {
    c.fillStyle = css(P.sacoDeJuta);
    c.fillRect(0, 0, 512, 256);
    c.strokeStyle = 'rgba(120,85,45,0.22)';
    c.lineWidth = 1.5;
    for (let i = 0; i < 512; i += 6) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i, 256);
      c.stroke();
    }
    for (let j = 0; j < 256; j += 6) {
      c.beginPath();
      c.moveTo(0, j);
      c.lineTo(512, j);
      c.stroke();
    }
    const cx = 128;
    // os olhos de botão: o botão, os quatro furinhos e a linha cruzada
    for (const s of [-1, 1]) {
      const x = cx + s * 26;
      c.fillStyle = '#3a2a3a';
      c.beginPath();
      c.arc(x, 112, 13, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#5b4558';
      c.lineWidth = 2;
      c.beginPath();
      c.arc(x, 112, 9, 0, Math.PI * 2);
      c.stroke();
      c.strokeStyle = css(P.lanternaLaranja);
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(x - 5, 107);
      c.lineTo(x + 5, 117);
      c.moveTo(x + 5, 107);
      c.lineTo(x - 5, 117);
      c.stroke();
      // a bochecha pintada
      c.fillStyle = 'rgba(232,120,120,0.55)';
      c.beginPath();
      c.ellipse(cx + s * 40, 136, 11, 7, 0, 0, Math.PI * 2);
      c.fill();
    }
    // o nariz: um triângulo de feltro laranja
    c.fillStyle = css(P.abobora);
    c.beginPath();
    c.moveTo(cx - 8, 122);
    c.lineTo(cx + 8, 122);
    c.lineTo(cx, 136);
    c.closePath();
    c.fill();
    // o sorriso costurado: a curva e os pontinhos atravessando
    c.strokeStyle = '#3a2a3a';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, 130, 30, 0.22 * Math.PI, 0.78 * Math.PI);
    c.stroke();
    for (let i = 0; i <= 6; i++) {
      const a = (0.24 + (i / 6) * 0.52) * Math.PI;
      const x = cx + Math.cos(a) * 30;
      const y = 130 + Math.sin(a) * 30;
      c.beginPath();
      c.moveTo(x - Math.cos(a) * 5, y - Math.sin(a) * 5);
      c.lineTo(x + Math.cos(a) * 5, y + Math.sin(a) * 5);
      c.stroke();
    }
  });
  return juta;
}

/** a placa de boas-vindas: madeira clara e o "Feliz Halloween!" de letra gorda, com morceguinho */
function texturaDeBoasVindas(): THREE.CanvasTexture {
  return canvasTex(512, 220, (c) => {
    c.fillStyle = '#f6e6c6';
    c.fillRect(0, 0, 512, 220);
    c.strokeStyle = 'rgba(150,100,50,0.25)';
    c.lineWidth = 2;
    for (let y = 20; y < 220; y += 48) {
      c.beginPath();
      c.moveTo(0, y);
      c.bezierCurveTo(170, y + 8, 340, y - 8, 512, y + 4);
      c.stroke();
    }
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '700 72px "Baloo 2", "Nunito", "Arial Rounded MT Bold", sans-serif';
    c.lineWidth = 12;
    c.strokeStyle = '#fff6e2';
    c.strokeText('Feliz', 256, 70);
    c.fillStyle = css(P.lanternaRoxa);
    c.fillText('Feliz', 256, 70);
    c.font = '800 70px "Baloo 2", "Nunito", "Arial Rounded MT Bold", sans-serif';
    c.strokeText('Halloween!', 256, 150);
    c.fillStyle = css(P.aboboraFunda);
    c.fillText('Halloween!', 256, 150);
  });
}

/**
 * O ESPANTALHO DE BOAS-VINDAS do portão: espetado no poste com a travessa dos
 * braços, a camisa xadrez com remendo e cinto de corda, a palha escapando da
 * barra, das mangas e do pescoço, a cabeça de saco de juta com a cara
 * costurada, o chapéu de palha de fita laranja — e a placa "Feliz
 * Halloween!" pregada no poste, na frente. ~2 m.
 */
export function espantalhoDeBoasVindas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'espantalho-de-boas-vindas';
  const madeira = toon(P.woodDark);
  // o poste e a travessa
  por(g, new THREE.CylinderGeometry(0.045, 0.055, 1.86, 7), madeira, 0, 0.93, -0.02);
  por(g, new THREE.CylinderGeometry(0.035, 0.035, 1.2, 6).rotateZ(Math.PI / 2), madeira, 0, 1.44, -0.02);
  // a camisa: o tronco que alarga embaixo, e as mangas pela travessa
  // o xadrez em quadros de ~20 cm: a volta do tronco tem 1,4 m e a da manga 0,5
  const pano = toon(0xffffff, { mapa: texturaDeXadrez(7, 3.4) });
  por(g, new THREE.CylinderGeometry(0.19, 0.25, 0.68, 14, 3), pano, 0, 1.18, 0);
  por(g, new THREE.SphereGeometry(0.19, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.4, 1), pano, 0, 1.52, 0);
  for (const s of [-1, 1]) {
    const manga = new THREE.CylinderGeometry(0.07, 0.085, 0.42, 10).rotateZ(Math.PI / 2);
    por(g, manga, toon(0xffffff, { mapa: texturaDeXadrez(2.5, 2.1) }), s * 0.37, 1.44, 0);
  }
  // o remendo azul no peito, com os pontinhos de costura
  const remendo = new THREE.Mesh(quina(0.12, 0.11, 0.012, 0.004), toon(P.remendoDoEspantalho));
  remendo.position.set(0.08, 1.3, 0.218);
  remendo.rotation.set(-0.07, 0.35, 0.12);
  g.add(remendo);
  // o cinto de corda
  por(g, new THREE.TorusGeometry(0.233, 0.016, 5, 20).rotateX(Math.PI / 2), toon(P.barbante), 0, 0.93, 0);
  // a cabeça de saco e a amarração do pescoço
  const cabeca = por(g, new THREE.SphereGeometry(0.2, 18, 12), toon(0xffffff, { mapa: texturaDaCabeca() }), 0, 1.72, 0.01);
  cabeca.scale.set(1, 0.95, 0.95);
  por(g, new THREE.TorusGeometry(0.1, 0.018, 5, 14).rotateX(Math.PI / 2), toon(P.barbante), 0, 1.55, 0.01);
  // o chapéu de palha: a copa torneada, a aba larga caída e a fita laranja
  const chapeu = new THREE.Group();
  chapeu.position.set(0, 1.84, 0);
  chapeu.rotation.set(-0.12, 0, 0.14);
  g.add(chapeu);
  const palhaDoChapeu = toon(P.chapeuDePalha, { mapa: texturaDePalha(), doubleSide: true });
  const aba: THREE.Vector2[] = [];
  for (let i = 0; i <= 8; i++) {
    const r = 0.12 + (i / 8) * 0.24;
    aba.push(new THREE.Vector2(r, -0.03 * Math.pow(i / 8, 2) + 0.01 * Math.sin(i)));
  }
  por(chapeu, new THREE.LatheGeometry(aba, 22), palhaDoChapeu);
  const copa = new THREE.LatheGeometry([
    new THREE.Vector2(0.15, 0), new THREE.Vector2(0.15, 0.08), new THREE.Vector2(0.135, 0.15), new THREE.Vector2(0.06, 0.18), new THREE.Vector2(0, 0.17),
  ], 18);
  por(chapeu, copa, palhaDoChapeu);
  por(chapeu, new THREE.CylinderGeometry(0.153, 0.153, 0.045, 18, 1, true), toon(P.fitaDoChapeu, { doubleSide: true }), 0, 0.03, 0);
  // a palha escapando: pela barra da camisa, pelas mangas e pelo pescoço
  const rnd = sorteio(5);
  const fio = new THREE.CylinderGeometry(0.004, 0.008, 0.16, 3).translate(0, 0.08, 0);
  const tufos: Array<[THREE.Vector3, THREE.Vector3, number]> = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    tufos.push([new THREE.Vector3(Math.sin(a) * 0.22, 0.86, Math.cos(a) * 0.22), new THREE.Vector3(Math.sin(a) * 0.3, -1, Math.cos(a) * 0.3), 1.1]);
  }
  for (const s of [-1, 1]) {
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      tufos.push([new THREE.Vector3(s * 0.58, 1.44 + Math.sin(a) * 0.05, Math.cos(a) * 0.05), new THREE.Vector3(s, Math.sin(a) * 0.6 - 0.3, Math.cos(a) * 0.6), 0.8]);
    }
  }
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    tufos.push([new THREE.Vector3(Math.sin(a) * 0.09, 1.56, Math.cos(a) * 0.09), new THREE.Vector3(Math.sin(a), 0.2, Math.cos(a)), 0.45]);
  }
  const lote = new THREE.InstancedMesh(fio, toon(0xffffff), tufos.length);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  tufos.forEach(([p, d, k], i) => {
    m.position.copy(p);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.5)).normalize());
    m.scale.setScalar(k * (0.7 + rnd() * 0.6));
    m.updateMatrix();
    lote.setMatrixAt(i, m.matrix);
    lote.setColorAt(i, cor.set(rnd() < 0.5 ? P.feno : P.chapeuDePalha));
  });
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  lote.userData.semSombra = true;
  g.add(lote);
  // a placa pregada no poste, na frente, com os dois pregos
  const placa = new THREE.Group();
  placa.position.set(0, 0.6, 0.26);
  placa.rotation.z = -0.05;
  g.add(placa);
  por(placa, quina(0.82, 0.36, 0.035, 0.012), toon(P.wood));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.3), toon(0xffffff, { mapa: texturaDeBoasVindas() }));
  face.position.z = 0.019;
  placa.add(face);
  for (const s of [-1, 1]) por(placa, new THREE.SphereGeometry(0.012, 6, 4), toon(P.aramePreto), s * 0.34, 0.12, 0.022);
  // a estaca que segura a placa
  por(g, new THREE.CylinderGeometry(0.025, 0.025, 0.5, 5), madeira, 0, 0.25, 0.23);
  return g;
}

// ====================================================== o arco de balões

/**
 * O ARCO DE BALÕES da boca do caminho: uma meia-elipse de `vao` por `alto`,
 * cada passo um cacho de quatro balões (laranja, roxo, creme e o escuro, a
 * cor girando para o arco não sair listrado), cada balão com o nózinho e o
 * brilho — e, no alto, o balão de fantasminha com a cara.
 */
export function arcoDeBaloes(vao = 5.2, alto = 3.0): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arco-de-baloes';
  // o balão: um ovo com o nózinho embaixo
  const balao = mergeGeometries([
    new THREE.SphereGeometry(0.17, 11, 8).scale(1, 1.13, 1),
    new THREE.ConeGeometry(0.03, 0.05, 6).rotateX(Math.PI).translate(0, -0.2, 0),
  ].map((x) => x.toNonIndexed()));
  const brilho = new THREE.SphereGeometry(0.035, 6, 4).scale(1, 1.5, 0.4);
  const cores = [P.abobora, P.lanternaRoxa, P.fantasmaDePano, P.balaoEscuro];
  const copias: Array<{ p: THREE.Vector3; cor: number; s: number }> = [];
  const PASSOS = Math.round((Math.PI * (vao / 2 + alto)) / 2 / 0.2);
  const rnd = sorteio(17);
  for (let i = 0; i <= PASSOS; i++) {
    const a = Math.PI - (i / PASSOS) * Math.PI;
    const c = new THREE.Vector3(Math.cos(a) * (vao / 2), Math.sin(a) * alto, 0);
    // a normal da elipse (para fora) e o eixo z: o cacho é uma cruz em volta da linha
    const n = new THREE.Vector3(Math.cos(a) / (vao / 2), Math.sin(a) / alto, 0).normalize();
    const z = new THREE.Vector3(0, 0, 1);
    const giro = i * 0.9;
    for (let k = 0; k < 4; k++) {
      const b = giro + (k * Math.PI) / 2;
      const d = n.clone().multiplyScalar(Math.cos(b)).add(z.clone().multiplyScalar(Math.sin(b)));
      copias.push({ p: c.clone().add(d.multiplyScalar(0.15)), cor: cores[(i + k) % 4], s: 0.85 + rnd() * 0.3 });
    }
  }
  const mat = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const sc = new THREE.Vector3();
  const corpo = new THREE.InstancedMesh(balao, toon(0xffffff), copias.length);
  const luz = new THREE.InstancedMesh(brilho, toon(0xffffff, { glow: 0.4 }), copias.length);
  const cor = new THREE.Color();
  copias.forEach((c, i) => {
    q.setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.5, rnd() * 6.28, (rnd() - 0.5) * 0.5));
    corpo.setMatrixAt(i, mat.compose(c.p, q, sc.setScalar(c.s)));
    corpo.setColorAt(i, cor.set(c.cor));
    // o brilho na face que dá para a câmera (+X, +Z), em cima
    const pb = c.p.clone().add(new THREE.Vector3(0.07, 0.09, 0.11).multiplyScalar(c.s));
    luz.setMatrixAt(i, mat.compose(pb, new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, 0.6, 0.3)), sc.setScalar(c.s)));
  });
  for (const im of [corpo, luz]) {
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    g.add(im);
  }
  luz.userData.semSombra = true;
  // o balão de fantasminha no topo, com os olhos, a boca e a bochecha
  const topo = new THREE.Group();
  topo.position.set(0, alto + 0.32, 0.02);
  g.add(topo);
  por(topo, new THREE.SphereGeometry(0.3, 18, 14).scale(1, 1.15, 0.9), toon(P.fantasmaDePano));
  por(topo, new THREE.ConeGeometry(0.05, 0.07, 6).rotateX(Math.PI), toon(P.fantasmaDePano), 0, -0.37, 0);
  for (const s of [-1, 1]) {
    por(topo, new THREE.SphereGeometry(0.045, 10, 8).scale(0.8, 1.2, 0.4), toon(P.olhoDeBoneco), s * 0.1, 0.06, 0.255);
    por(topo, new THREE.SphereGeometry(0.014, 6, 4).scale(1, 1, 0.4), toon(0xffffff), s * 0.1 - 0.015, 0.09, 0.272);
    por(topo, new THREE.CircleGeometry(0.035, 12).scale(1.3, 0.8, 1), toon(P.bochechaDeBoneco), s * 0.17, -0.04, 0.245).rotation.y = s * 0.55;
  }
  por(topo, new THREE.SphereGeometry(0.03, 8, 6).scale(0.9, 1.2, 0.4), toon(P.olhoDeBoneco), 0, -0.06, 0.262);
  return g;
}

// ========================================================== as lápides

/** as frases de brincadeira, uma por desenho de lápide */
export const FRASES_DAS_LAPIDES: readonly string[][] = [
  ['AQUI JAZ', 'O MEDO'],
  ['R.I.P.', 'DIETA'],
  ['BOO!'],
  ['VOLTO', 'JÁ'],
  ['DESCANSE', 'EM PAZ', '(e doce)'],
];

let frentes: THREE.CanvasTexture[] | null = null;
function frentesDasLapides(): THREE.CanvasTexture[] {
  if (frentes) return frentes;
  frentes = FRASES_DAS_LAPIDES.map((linhas, n) => canvasTex(256, 192, (c) => {
    // o fundo é a cor do isopor: o material branco multiplica e a frente some na pedra
    c.fillStyle = css(P.lapideDeIsopor);
    c.fillRect(0, 0, 256, 192);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const tam = linhas.length === 1 ? 70 : linhas.length === 2 ? 46 : 36;
    c.font = `800 ${tam}px "Baloo 2", "Nunito", "Arial Rounded MT Bold", sans-serif`;
    linhas.forEach((l, i) => {
      const y = 96 + (i - (linhas.length - 1) / 2) * tam * 1.08;
      // a letra cavada: a sombra em cima e a luz embaixo
      c.fillStyle = 'rgba(255,255,255,0.55)';
      c.fillText(l, 128, y + 2.5);
      c.fillStyle = '#4f4866';
      c.fillText(l, 128, y);
    });
    // uma cruzinha ou um morceguinho riscado, em cima
    c.strokeStyle = '#7d7693';
    c.lineWidth = 4;
    if (n % 2 === 0) {
      c.beginPath();
      c.moveTo(128, 6);
      c.lineTo(128, 30);
      c.moveTo(118, 14);
      c.lineTo(138, 14);
      c.stroke();
    }
  }));
  return frentes;
}

/**
 * AS LÁPIDES FOFAS, em lote para o parque inteiro: isopor de topo redondo
 * (um tico torta, como lápide de enfeite fincada na grama), a frase cavada na
 * frente, o musgo de feltro numa quina, uma florzinha no pé e o montinho de
 * terra na frente. Pedido do Renan: "simples e bonitinhas".
 */
export class LapidesFofas {
  private readonly lista: Array<{ x: number; z: number; giro: number; frase: number; escala: number }> = [];

  por(x: number, z: number, giro: number, frase: number, escala = 1): this {
    this.lista.push({ x, z, giro, frase: frase % FRASES_DAS_LAPIDES.length, escala });
    return this;
  }

  get quantas(): number {
    return this.lista.length;
  }

  montar(): THREE.Group {
    const g = new THREE.Group();
    g.name = 'lapides';
    g.userData.peca = 'lapides-fofas';
    if (!this.lista.length) return g;
    const L = 0.5;
    const A = 0.64;
    const forma = new THREE.Shape();
    forma.moveTo(-L / 2, 0);
    forma.lineTo(L / 2, 0);
    forma.lineTo(L / 2, A - L / 2);
    forma.absarc(0, A - L / 2, L / 2, 0, Math.PI, false);
    forma.lineTo(-L / 2, 0);
    const pedra = new THREE.ExtrudeGeometry(forma, { depth: 0.1, bevelEnabled: true, bevelSize: 0.022, bevelThickness: 0.022, bevelSegments: 2, curveSegments: 10 });
    pedra.translate(0, 0, -0.05);
    // a frente com a frase, 3 mm na frente da face
    const frente = new THREE.PlaneGeometry(0.38, 0.285).translate(0, 0.3, 0.075);
    const musgo = new THREE.IcosahedronGeometry(0.06, 1).scale(1.4, 0.5, 1.1);
    const monte = new THREE.SphereGeometry(0.22, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.26, 1.3).translate(0, 0, 0.33);
    const flor = geoFlor().scale(0.045, 0.045, 0.045);
    const miolo = new THREE.SphereGeometry(0.014, 6, 4);
    const rnd = sorteio(this.lista.length * 7 + 3);
    const mat = new THREE.Matrix4();
    const base = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const sc = new THREE.Vector3();
    const v = new THREE.Vector3();
    const bases = this.lista.map((l) => {
      e.set((rnd() - 0.5) * 0.12 - 0.04, l.giro, (rnd() - 0.5) * 0.16, 'YXZ');
      q.setFromEuler(e);
      return new THREE.Matrix4().compose(v.set(l.x, -0.03, l.z), q.clone(), sc.setScalar(l.escala).clone());
    });
    const lote = (geo: THREE.BufferGeometry, material: THREE.Material, quais: number[], local: (i: number, k: number) => THREE.Matrix4, nome: string, cor?: (i: number) => number, semSombra = false): void => {
      if (!quais.length) return;
      const im = new THREE.InstancedMesh(geo, material, quais.length);
      im.name = nome;
      const c = new THREE.Color();
      quais.forEach((i, k) => {
        im.setMatrixAt(k, mat.multiplyMatrices(bases[i], local(i, k)));
        if (cor) im.setColorAt(k, c.set(cor(i)));
      });
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere();
      if (semSombra) im.userData.semSombra = true;
      g.add(im);
    };
    const todas = this.lista.map((_, i) => i);
    const id = new THREE.Matrix4();
    lote(pedra, toon(P.lapideDeIsopor), todas, () => id, 'pedras');
    const tex = frentesDasLapides();
    FRASES_DAS_LAPIDES.forEach((_, f) => {
      lote(frente, toon(0xffffff, { mapa: tex[f] }), todas.filter((i) => this.lista[i].frase === f), () => id, `frente-${f}`, undefined, true);
    });
    // o musgo numa das quinas de cima, e um pouco no pé
    lote(musgo, toon(P.musgoDeFeltro), todas, (i) => base.compose(v.set(i % 2 ? 0.17 : -0.17, A - 0.16, 0.02), q.setFromEuler(e.set(0, 0, i % 2 ? -0.6 : 0.6)), sc.setScalar(1)), 'musgo', undefined, true);
    // o montinho de terra na frente (as lápides do parque são de enfeite: é um canteirinho)
    lote(monte, toon(P.terraDaCova), todas, () => base.makeTranslation(0, 0.03, 0), 'montinhos');
    const cores = [P.bochechaDeBoneco, P.lanternaRoxa, P.fantasmaDePano];
    lote(flor, toon(0xffffff, { doubleSide: true }), todas, (i) => base.compose(v.set(i % 2 ? -0.16 : 0.18, 0.1, 0.24), q.identity(), sc.setScalar(1)), 'flores', (i) => cores[i % cores.length], true);
    lote(miolo, toon(P.gold), todas, (i) => base.makeTranslation(i % 2 ? -0.16 : 0.18, 0.115, 0.24), 'miolos', undefined, true);
    return g;
  }
}

// =========================================================== o caldeirão

/**
 * O CALDEIRÃO de ferro: a barriga torneada, a boca virada, os três pezinhos,
 * as duas orelhas e a alça de arame. Aberto (de cima se vê o fundo escuro):
 * na festa ele enche de doces.
 */
export function caldeirao(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caldeirao';
  const ferro = toon(P.caldeirao, { doubleSide: true });
  const perfil = [
    [0.0, 0.12], [0.16, 0.12], [0.3, 0.2], [0.37, 0.34], [0.36, 0.48], [0.3, 0.58], [0.285, 0.62],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  por(g, new THREE.LatheGeometry(perfil, 22), ferro);
  por(g, new THREE.TorusGeometry(0.3, 0.035, 8, 26).rotateX(Math.PI / 2), toon(P.caldeirao), 0, 0.625, 0);
  // o fundo de dentro, mais escuro
  por(g, new THREE.CircleGeometry(0.27, 20).rotateX(-Math.PI / 2), toon(P.olhoDeBoneco), 0, 0.2, 0);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    const pe = new THREE.CylinderGeometry(0.04, 0.03, 0.16, 6);
    por(g, pe, toon(P.caldeirao), Math.sin(a) * 0.19, 0.08, Math.cos(a) * 0.19);
  }
  for (const s of [-1, 1]) {
    por(g, new THREE.TorusGeometry(0.04, 0.012, 5, 10).rotateY(Math.PI / 2), toon(P.caldeirao), s * 0.33, 0.56, 0);
  }
  // a alça de arame, de orelha a orelha, deitada para trás
  const alca = new THREE.TorusGeometry(0.33, 0.008, 4, 20, Math.PI);
  alca.rotateX(-1.1);
  por(g, alca, toon(P.aramePreto), 0, 0.56, 0);
  return g;
}

// ========================================================== a guirlanda

/**
 * A GUIRLANDA DE PORTA: o anel de cipó coberto de folhas secas (em lote, com
 * a cor do outono sorteada), cinco mini abóboras e o laço roxo embaixo.
 * Olhando para `+Z`, com o centro na origem (a cena pendura na porta).
 */
export function guirlanda(raio = 0.32): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'guirlanda';
  por(g, new THREE.TorusGeometry(raio, raio * 0.12, 6, 28), toon(P.woodDark));
  const N = 96;
  const folha = geoFolha();
  folha.scale(0.15, 0.15, 0.15);
  const lote = new THREE.InstancedMesh(folha, toon(0xffffff, { doubleSide: true }), N);
  const rnd = sorteio(23);
  const m = new THREE.Object3D();
  const cor = new THREE.Color();
  const outono = [P.folhaSeca, P.abobora, P.aboboraFunda, 0xc0432e, 0xe2b13c];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + rnd() * 0.1;
    const r = raio + (rnd() - 0.5) * raio * 0.3;
    m.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.02 + rnd() * 0.04);
    // a folha corre pelo anel (quase na tangente), deitada na frente dele
    const lado = rnd() < 0.5 ? 0.35 : -0.35;
    m.lookAt(m.position.clone().add(new THREE.Vector3(Math.cos(a + Math.PI / 2 + lado), Math.sin(a + Math.PI / 2 + lado), 0.35)));
    m.rotateZ((rnd() - 0.5) * 0.8);
    m.scale.setScalar(0.8 + rnd() * 0.5);
    m.updateMatrix();
    lote.setMatrixAt(i, m.matrix);
    lote.setColorAt(i, cor.set(outono[Math.floor(rnd() * outono.length)]));
  }
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  g.add(lote);
  // as mini abóboras, no anel, viradas para a frente
  const aboboras = new LoteDeAboboras();
  for (let i = 0; i < 5; i++) {
    const a = Math.PI / 2 + ((i - 2) / 5) * Math.PI * 1.15;
    aboboras.por({ x: Math.cos(a) * raio, y: Math.sin(a) * raio - 0.03, z: 0.05, raio: 0.055, tamanho: 'pequena', simples: true, cor: i % 2 ? P.aboboraClara : P.abobora });
  }
  g.add(aboboras.montar());
  // o laço: duas alças, o nó e as duas pontas caindo
  const laco = new THREE.Group();
  laco.position.set(0, -raio, 0.07);
  g.add(laco);
  const fita = toon(P.lacoDaGuirlanda);
  for (const s of [-1, 1]) {
    const alca = new THREE.TorusGeometry(0.055, 0.018, 6, 14).scale(1.2, 0.75, 0.6);
    por(laco, alca, fita, s * 0.07, 0.01, 0).rotation.z = s * 0.25;
    por(laco, quina(0.04, 0.16, 0.012, 0.005), fita, s * 0.04, -0.09, 0).rotation.z = s * 0.35;
  }
  por(laco, new THREE.SphereGeometry(0.03, 8, 6), fita);
  return g;
}

// ====================================================== o chapéu de bruxa

/**
 * O CHAPÉU DE BRUXA: a aba larga e um tico ondulada, a copa em cone que
 * dobra na ponta, a fita laranja e a fivela dourada. Base no chão da aba.
 */
export function chapeuDeBruxa(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'chapeu-de-bruxa';
  const pano = toon(P.chapeuDeBruxa, { doubleSide: true });
  const aba: THREE.Vector2[] = [];
  for (let i = 0; i <= 6; i++) {
    const k = i / 6;
    aba.push(new THREE.Vector2(0.16 + 0.26 * k, 0.03 * k * k));
  }
  por(g, new THREE.LatheGeometry(aba, 28), pano);
  // a copa: o cone torto (a ponta dobra para trás e cai)
  const ALTO = 0.56;
  const copa = new THREE.CylinderGeometry(0.008, 0.17, ALTO, 18, 12, true);
  copa.translate(0, ALTO / 2, 0);
  const p = copa.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const t = THREE.MathUtils.clamp(y / ALTO, 0, 1);
    const dobra = Math.pow(t, 2.4);
    p.setXYZ(i, p.getX(i) + 0.03 * Math.sin(t * 3), y - 0.12 * dobra, p.getZ(i) - 0.2 * dobra);
  }
  copa.computeVertexNormals();
  por(g, copa, pano);
  por(g, new THREE.CylinderGeometry(0.168, 0.172, 0.06, 18, 1, true), toon(P.fitaDoChapeu, { doubleSide: true }), 0, 0.045, 0);
  // a fivela: o quadradinho dourado vazado na frente da fita
  const fivela = new THREE.Group();
  fivela.position.set(0, 0.045, 0.172);
  g.add(fivela);
  const ouro = toon(P.fivelaDourada);
  for (const [x, y, l, a] of [[0, 0.032, 0.07, 0.014], [0, -0.032, 0.07, 0.014], [-0.03, 0, 0.014, 0.07], [0.03, 0, 0.014, 0.07]] as const) {
    por(fivela, quina(l, a, 0.012, 0.004), ouro, x, y, 0);
  }
  return g;
}

// ============================================ o lençol de fantasma da bilheteria

/**
 * O LENÇOL DE FANTASMA jogado por cima do telhado cônico da bilheteria do
 * Cookie: o pano seguindo o cone oval (um tico por fora dele), passando da
 * beira e caindo em barra ondulada — e os dois olhões e a boquinha na frente.
 * A bilheteria vira um fantasminha. As medidas são as do telhado
 * (`bilheteriaDaRoda`: a beira em 2,3, o cone de 1,75 × 1,22 e 1,25 de alto).
 */
export function lencolDaBilheteria(beira = 2.3, hx = 1.75, hz = 1.22, alto = 1.25): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lencol-de-fantasma';
  const VOLTA = 48;
  const LINHAS = 14;
  const FOLGA = 1.035;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= LINHAS; j++) {
    const s = j / LINHAS;
    for (let i = 0; i <= VOLTA; i++) {
      const t = (i / VOLTA) * Math.PI * 2;
      let r: number;
      let y: number;
      if (s < 0.78) {
        // o cone: do bico (s = 0) até a beira
        const k = s / 0.78;
        r = k * FOLGA;
        y = beira + alto * (1 - k) + 0.035;
      } else {
        // a queda: o pano passa da beira e cai em pé, ondulando
        const k = (s - 0.78) / 0.22;
        r = FOLGA + 0.04 * k;
        y = beira + 0.035 - 0.42 * k + (k > 0.6 ? 0.06 * Math.sin(9 * t) * ((k - 0.6) / 0.4) : 0);
      }
      // as dobras que descem do bico
      const dobra = 1 + 0.025 * Math.sin(11 * t) * Math.min(1, s * 1.5);
      pos.push(Math.sin(t) * hx * r * dobra, y, Math.cos(t) * hz * r * dobra);
    }
  }
  for (let j = 0; j < LINHAS; j++) {
    for (let i = 0; i < VOLTA; i++) {
      const a = j * (VOLTA + 1) + i;
      const b = a + VOLTA + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const pano = new THREE.BufferGeometry();
  pano.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  pano.setIndex(idx);
  pano.computeVertexNormals();
  por(g, pano, toon(P.fantasmaDePano, { doubleSide: true }));
  // a cara, na frente do cone: o ponto da superfície e a normal dela
  const naCara = (t: number, k: number, fora: number): { p: THREE.Vector3; n: THREE.Vector3 } => {
    const r = k * FOLGA * fora;
    const p = new THREE.Vector3(Math.sin(t) * hx * r, beira + alto * (1 - k) + 0.035, Math.cos(t) * hz * r);
    const n = new THREE.Vector3(Math.sin(t) / hx, (alto > 0 ? 1 / alto : 0) * 0.9, Math.cos(t) / hz).normalize();
    return { p, n };
  };
  const pregar = (geo: THREE.BufferGeometry, mat: THREE.Material, t: number, k: number, fora = 1.0): void => {
    const { p, n } = naCara(t, k, fora);
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(p).addScaledVector(n, 0.02);
    m.lookAt(m.position.clone().add(n));
    g.add(m);
  };
  for (const s of [-1, 1]) {
    pregar(new THREE.SphereGeometry(0.13, 14, 10).scale(0.8, 1.15, 0.25), toon(P.olhoDeBoneco), s * 0.3, 0.62);
    pregar(new THREE.SphereGeometry(0.035, 8, 6).scale(1, 1, 0.3), toon(0xffffff), s * 0.3 - 0.04, 0.58, 1.04);
    pregar(new THREE.CircleGeometry(0.08, 14).scale(1.4, 0.8, 1), toon(P.bochechaDeBoneco), s * 0.52, 0.72, 1.01);
  }
  pregar(new THREE.SphereGeometry(0.07, 10, 8).scale(0.9, 1.1, 0.25), toon(P.olhoDeBoneco), 0, 0.8);
  return g;
}

// ======================================================= a plaquinha de recado

export interface Recado {
  /** o recado, linha por linha (a plaquinha quebra as compridas) */
  texto: string;
  /** a assinatura, com o bichinho */
  assinatura: string;
  /** a letra: `caveat` (redonda) ou `kalam` (de forma) */
  letra?: 'caveat' | 'kalam';
  /** a cor da caneta */
  tinta?: number;
  /** quem "fala" o recado quando a dupla lê (numa plaquinha de várias letras) */
  quem?: string;
}

const FONTE = { caveat: '"Caveat", "Segoe Print", "Bradley Hand", cursive', kalam: '"Kalam", "Segoe Print", "Comic Sans MS", cursive' };

/** quebra `texto` em linhas que caibam em `largura` */
function quebrar(c: CanvasRenderingContext2D, texto: string, largura: number): string[] {
  const linhas: string[] = [];
  for (const paragrafo of texto.split('\n')) {
    let atual = '';
    for (const palavra of paragrafo.split(' ')) {
      const tenta = atual ? `${atual} ${palavra}` : palavra;
      if (c.measureText(tenta).width > largura && atual) {
        linhas.push(atual);
        atual = palavra;
      } else atual = tenta;
    }
    linhas.push(atual);
  }
  return linhas;
}

/** o papel do recado: as linhas do caderno, o texto na letra de cada um, e a assinatura */
function desenharRecados(c: CanvasRenderingContext2D, l: number, a: number, recados: readonly Recado[]): void {
  c.clearRect(0, 0, l, a);
  c.fillStyle = css(P.papelDoRecado);
  c.fillRect(0, 0, l, a);
  // as pautas
  c.strokeStyle = 'rgba(120,150,200,0.25)';
  c.lineWidth = 2;
  for (let y = 46; y < a; y += 34) {
    c.beginPath();
    c.moveTo(14, y);
    c.lineTo(l - 14, y);
    c.stroke();
  }
  const margem = 40;
  const faixa = (a - 24) / recados.length;
  recados.forEach((r, k) => {
    const y0 = 12 + k * faixa;
    const fonte = FONTE[r.letra ?? 'caveat'];
    // o maior tamanho em que o recado e a assinatura cabem na faixa dele
    let tam = 54;
    let linhas: string[] = [];
    for (; tam > 16; tam -= 2) {
      c.font = `700 ${tam}px ${fonte}`;
      linhas = quebrar(c, r.texto, l - margem * 2);
      if ((linhas.length + 1) * tam * 1.02 <= faixa - 6) break;
    }
    c.fillStyle = css(r.tinta ?? P.tintaDoRecado);
    c.textBaseline = 'top';
    c.textAlign = 'left';
    linhas.forEach((linha, i) => c.fillText(linha, margem, y0 + i * tam * 1.02));
    c.textAlign = 'right';
    c.fillText(r.assinatura, l - margem, y0 + linhas.length * tam * 1.02);
    if (k > 0) {
      c.strokeStyle = 'rgba(0,0,0,0.12)';
      c.setLineDash([8, 8]);
      c.beginPath();
      c.moveTo(20, y0 - 4);
      c.lineTo(l - 20, y0 - 4);
      c.stroke();
      c.setLineDash([]);
    }
  });
}

/**
 * A PLAQUINHA DE RECADO que fica no posto de quem foi se arrumar: a tabuinha
 * de moldura com o papel do recado preso por dois percevejos, na letra de
 * cada um. `cavalete` em pé no chão (o jeito de quiosque), `pendurada` num
 * barbante (porta, balcão), `parede` sem nada (a cena prega). O recado é
 * redesenhado quando as letras de mão (as do Bebito book) terminam de
 * carregar.
 */
export function plaquinhaDeRecado(recados: readonly Recado[], opts: { largura?: number; altura?: number; modo?: 'cavalete' | 'pendurada' | 'parede' } = {}): THREE.Group {
  const L = opts.largura ?? 0.62;
  const A = opts.altura ?? 0.46;
  const modo = opts.modo ?? 'cavalete';
  const g = new THREE.Group();
  g.userData.peca = 'plaquinha-de-recado';
  g.userData.recados = recados.map((r) => r.texto);
  const quadro = new THREE.Group();
  g.add(quadro);
  const madeira = toon(P.wood);
  // a tábua e a moldura (as réguas em pé entre as deitadas, mais grossas)
  por(quadro, quina(L, A, 0.025, 0.006), madeira);
  for (const s of [-1, 1]) {
    por(quadro, quina(L, 0.045, 0.03, 0.008), toon(P.woodDark), 0, s * (A / 2 - 0.022), 0.004);
    por(quadro, quina(0.045, A - 0.09, 0.034, 0.008), toon(P.woodDark), s * (L / 2 - 0.022), 0, 0.004);
  }
  // o papel do recado, torto, e os percevejos
  const PX = 512;
  const PY = Math.round((PX * (A - 0.12)) / (L - 0.12));
  const cv = document.createElement('canvas');
  cv.width = PX;
  cv.height = PY;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const pintar = (): void => {
    if (!ctx) return;
    desenharRecados(ctx, PX, PY, recados);
    tex.needsUpdate = true;
  };
  pintar();
  if (typeof document !== 'undefined' && document.fonts) {
    void Promise.all([document.fonts.load('700 40px Caveat'), document.fonts.load('700 40px Kalam')]).then(pintar, () => {});
  }
  const papel = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.13, A - 0.13), toon(0xffffff, { mapa: tex }));
  papel.position.z = 0.0145;
  papel.rotation.z = 0.025;
  papel.name = 'recado';
  quadro.add(papel);
  for (const s of [-1, 1]) {
    por(quadro, new THREE.SphereGeometry(0.014, 8, 6).scale(1, 1, 0.6), toon(s < 0 ? P.lanternaRoxa : P.abobora), s * (L / 2 - 0.1), A / 2 - 0.1, 0.018);
  }
  if (modo === 'cavalete') {
    // as duas pernas da frente, a de trás e a régua de apoio
    quadro.position.set(0, 0.78, 0.02);
    quadro.rotation.x = -0.14;
    for (const s of [-1, 1]) {
      const perna = por(g, quina(0.04, 1.12, 0.03, 0.008), madeira, s * (L / 2 - 0.08), 0.55, 0.06);
      perna.rotation.x = -0.14;
    }
    const tras = por(g, quina(0.04, 1.1, 0.03, 0.008), madeira, 0, 0.53, -0.16);
    tras.rotation.x = 0.28;
    por(g, quina(L - 0.06, 0.035, 0.05, 0.008), madeira, 0, 0.52 - A / 2 + 0.01, 0.09).rotation.x = -0.14;
  } else if (modo === 'pendurada') {
    // o barbante em V até o prego, em cima
    quadro.position.set(0, -0.32, 0);
    for (const s of [-1, 1]) {
      const a = new THREE.Vector3(s * (L / 2 - 0.06), -0.32 + A / 2, 0);
      const b = new THREE.Vector3(0, 0, 0);
      const d = b.clone().sub(a);
      const fio = new THREE.CylinderGeometry(0.004, 0.004, d.length(), 4);
      fio.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
      por(g, fio, toon(P.barbante), (a.x + b.x) / 2, (a.y + b.y) / 2, 0.005);
    }
    por(g, new THREE.SphereGeometry(0.012, 6, 4), toon(P.aramePreto), 0, 0, 0.005);
  }
  return g;
}

// =============================================================== o pompom

/**
 * O POMPOM de líder de torcida: dezenas de fitinhas finas saindo do miolo,
 * cada uma num tom (as duas cores, em lote). Centro na origem.
 */
export function pompom(cor: number = P.abobora, cor2: number = P.balaoEscuro): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pompom';
  const N = 90;
  const fita = new THREE.BoxGeometry(0.012, 0.11, 0.003).translate(0, 0.055, 0);
  const lote = new THREE.InstancedMesh(fita, toon(0xffffff, { doubleSide: true }), N);
  const m = new THREE.Object3D();
  const c = new THREE.Color();
  const rnd = sorteio(31);
  for (let i = 0; i < N; i++) {
    // a espiral de Fibonacci: as fitas espalhadas sem buraco
    const y = 1 - (2 * (i + 0.5)) / N;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    const d = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    m.position.set(0, 0, 0);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
    m.rotateY(rnd() * 3);
    m.scale.set(1, 0.8 + rnd() * 0.4, 1);
    m.updateMatrix();
    lote.setMatrixAt(i, m.matrix);
    lote.setColorAt(i, c.set(rnd() < 0.62 ? cor : cor2));
  }
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  g.add(lote);
  por(g, new THREE.SphereGeometry(0.03, 8, 6), toon(cor));
  return g;
}

// ====================================================== o pano de fechado

/**
 * O PANO DE "FECHADO" jogado por cima da vitrine de um balcão (a sorveteria
 * do Mano, de manhã): deitado em cima do tampo (`fundo` para trás), dobrando
 * na quina e caindo `queda` pela frente, em ondinhas — com o "FECHADO" bordado
 * na parte que cai. Origem na quina da frente do tampo; olhando para `+Z`.
 */
export function panoDeFechado(largura = 2.2, fundo = 0.5, queda = 0.42, texto = 'FECHADO'): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pano-de-fechado';
  const NX = 28;
  const NS = 12;
  const R = 0.05;
  const curva = (Math.PI / 2) * R;
  const total = fundo + curva + queda;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= NS; j++) {
    const s = (j / NS) * total;
    for (let i = 0; i <= NX; i++) {
      const u = i / NX;
      const x = (u - 0.5) * largura;
      let y: number;
      let z: number;
      if (s < fundo) {
        y = R;
        z = -fundo + s - R;
      } else if (s < fundo + curva) {
        const a = (s - fundo) / R;
        y = Math.cos(a) * R;
        z = -R + Math.sin(a) * R;
      } else {
        const d = s - fundo - curva;
        // a parte que cai ondula, mais na barra
        y = -d;
        z = 0.012 * Math.sin(x * 13 + 0.6) * (d / queda) + 0.004;
      }
      pos.push(x, y + 0.006, z + 0.006);
      uv.push(u, 1 - s / total);
    }
  }
  for (let j = 0; j < NS; j++) {
    for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i;
      const b = a + NX + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const parteDaQueda = queda / total;
  const tex = canvasTex(512, Math.round((512 * total) / largura), (c) => {
    const W = c.canvas.width;
    const H = c.canvas.height;
    c.fillStyle = css(P.fantasmaDePano);
    c.fillRect(0, 0, W, H);
    // a barra listrada laranja e roxa, na beira de baixo e nos lados
    const faixa = 14;
    for (let x = 0; x < W; x += 28) {
      c.fillStyle = css(P.abobora);
      c.fillRect(x, H - faixa, 14, faixa);
      c.fillStyle = css(P.lanternaRoxa);
      c.fillRect(x + 14, H - faixa, 14, faixa);
    }
    // o bordado, no meio da parte que cai
    const yMeio = H - (parteDaQueda * H) / 2 - 4;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const tam = Math.min(parteDaQueda * H * 0.5, 80);
    c.font = `800 ${tam}px "Baloo 2", "Nunito", "Arial Rounded MT Bold", sans-serif`;
    c.fillStyle = css(P.aboboraFunda);
    c.fillText(texto, W / 2, yMeio);
    // os pontinhos da costura em volta
    c.strokeStyle = css(P.lanternaRoxa);
    c.setLineDash([6, 6]);
    c.lineWidth = 3;
    c.strokeRect(14, H - parteDaQueda * H + 10, W - 28, parteDaQueda * H - faixa - 18);
  });
  por(g, geo, toon(0xffffff, { mapa: tex, doubleSide: true }));
  return g;
}
