import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';
import { tijolinho, reboco } from './texturasDeFachada';
import { uvDeParede } from './acabamento';
import { sorteio } from './texturasDeChao';

/**
 * ===================================================== AS PEÇAS DO PÁTIO DA ESCOLA
 *
 * O que mora no pátio da frente da Escola do Gatito (`scenes/escolaPatio.ts`)
 * além do prédio: os três MASTROS com as bandeiras balançando, a PLACA de
 * entrada (o monumento de tijolo com o letreiro e o quadro de recados, a cara
 * de escola americana), os ARBUSTOS aparados dos canteiros, a plaquinha de
 * aviso no poste e o BICICLETÁRIO de tubo ondulado.
 */

const hex = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** um canvas pintado na hora, como textura (o fundo de cada desenho é dele) */
function pintura(px: number, py: number, pintar: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = px;
  canvas.height = py;
  const ctx = canvas.getContext('2d');
  if (ctx) pintar(ctx, px, py);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * A CARA DO GATITO em canvas — a mesma do logo da escola (`logoDaEscola`):
 * as orelhas chocolate e caramelo, a cara metade creme metade caramelo, os
 * olhinhos, o nariz e a linguinha para fora.
 */
function caraDoGatito(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  for (const [lado, cor] of [[-1, P.gatitoChocolate], [1, P.gatitoCaramelo]] as const) {
    ctx.fillStyle = hex(cor);
    ctx.beginPath();
    ctx.moveTo(cx + lado * r * 0.35, cy - r * 0.8);
    ctx.lineTo(cx + lado * r * 0.9, cy - r * 1.18);
    ctx.lineTo(cx + lado * r * 0.88, cy - r * 0.45);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = hex(P.gatitoCreme);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = hex(P.gatitoCaramelo);
  ctx.fillRect(cx + r * 0.18, cy - r, r, r * 2);
  ctx.restore();
  ctx.fillStyle = hex(P.gatitoBordado);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + lado * r * 0.42, cy - r * 0.02, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.12, cy + r * 0.22);
  ctx.lineTo(cx + r * 0.12, cy + r * 0.22);
  ctx.lineTo(cx, cy + r * 0.36);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = hex(P.gatitoLingua);
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.05, cy + r * 0.56, r * 0.13, r * 0.17, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** uma estrela de cinco pontas em canvas */
function estrela(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

// ============================================================== as bandeiras

export type Bandeira = 'gatitos' | 'brasil' | 'venezuela';

const desenhos = new Map<Bandeira, THREE.CanvasTexture>();

/** o pano de cada bandeira, desenhado uma vez só (as cores da paleta) */
function panoDaBandeira(qual: Bandeira): THREE.CanvasTexture {
  const pronto = desenhos.get(qual);
  if (pronto) return pronto;
  const tex = pintura(512, 344, (ctx, W, H) => {
    if (qual === 'gatitos') {
      // o azul dos Gatitos com a barra amarela, a cara do Gatito e o nome
      ctx.fillStyle = hex(P.bandeiraGatitosAzul);
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = hex(P.escolaArmarioAmarelo);
      ctx.fillRect(0, H * 0.06, W, H * 0.05);
      ctx.fillRect(0, H * 0.89, W, H * 0.05);
      caraDoGatito(ctx, W / 2, H * 0.42, H * 0.2);
      ctx.fillStyle = hex(P.escolaArmarioAmarelo);
      ctx.font = `800 ${Math.round(H * 0.15)}px ui-rounded, "Nunito", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GATITOS', W / 2, H * 0.77);
    } else if (qual === 'brasil') {
      // o verde, o losango amarelo, o círculo azul com a faixa e as estrelinhas
      ctx.fillStyle = hex(P.brasilVerde);
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = hex(P.brasilAmarelo);
      ctx.beginPath();
      ctx.moveTo(W * 0.085, H / 2);
      ctx.lineTo(W / 2, H * 0.085);
      ctx.lineTo(W * 0.915, H / 2);
      ctx.lineTo(W / 2, H * 0.915);
      ctx.closePath();
      ctx.fill();
      const r = H * 0.25;
      ctx.fillStyle = hex(P.brasilAzul);
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = H * 0.045;
      ctx.beginPath();
      ctx.arc(W / 2 - r * 0.25, H / 2 + r * 2.2, r * 2.35, -Math.PI * 0.62, -Math.PI * 0.32);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      const rnd = sorteio(1889);
      for (let i = 0; i < 18; i++) {
        estrela(ctx, W / 2 + (rnd() - 0.5) * r * 1.5, H / 2 + r * 0.05 + rnd() * r * 0.7, 2 + rnd() * 3);
      }
      ctx.restore();
    } else {
      // as três faixas e o arco das oito estrelas no azul
      const cores = [P.venezuelaAmarelo, P.venezuelaAzul, P.venezuelaVermelho];
      cores.forEach((c, i) => {
        ctx.fillStyle = hex(c);
        ctx.fillRect(0, (H / 3) * i, W, H / 3 + 1);
      });
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 8; i++) {
        const a = Math.PI + ((i + 0.5) / 8) * Math.PI;
        estrela(ctx, W / 2 + Math.cos(a) * H * 0.2, H * 0.62 + Math.sin(a) * H * 0.2, H * 0.03);
      }
    }
  });
  desenhos.set(qual, tex);
  return tex;
}

/**
 * O MASTRO COM A BANDEIRA: o mastro torneado de alumínio (mais grosso no pé),
 * a bola dourada no alto, a corda descendo e a presilha, num pé redondo de
 * concreto com a plaquinha. O PANO balança: uma malha de 16 × 8 refeita a
 * cada quadro (uma onda que nasce no mastro e cresce para a ponta), com a
 * normal recalculada — no sol, as dobras pegam luz e sombra.
 */
export class MastroComBandeira {
  readonly group = new THREE.Group();
  private readonly pano: THREE.Mesh;
  private readonly base: Float32Array;
  private tempo: number;
  private readonly comprimento: number;

  constructor(qual: Bandeira, alto = 9, comprimento = 2.2, fase = 0) {
    this.group.userData.peca = 'mastro';
    this.tempo = fase;
    this.comprimento = comprimento;
    const aluminio = toon(P.escolaMastro);
    const concreto = toon(P.escolaPedra, { mapa: reboco(1.2) });
    const dourado = toon(P.gold);
    const corda = toon(P.escolaCaixilho);
    // o pé de concreto, em dois degraus
    const pe = new THREE.Mesh(uvDeParede(new THREE.CylinderGeometry(0.55, 0.6, 0.32, 16)), concreto);
    pe.position.y = 0.16;
    this.group.add(pe);
    const pe2 = new THREE.Mesh(uvDeParede(new THREE.CylinderGeometry(0.34, 0.38, 0.2, 16)), concreto);
    pe2.position.y = 0.42;
    this.group.add(pe2);
    // o mastro torneado
    const mastro = new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(0.01, 0), new THREE.Vector2(0.12, 0), new THREE.Vector2(0.11, 0.25),
      new THREE.Vector2(0.085, 0.4), new THREE.Vector2(0.05, alto - 0.5), new THREE.Vector2(0.045, alto - 0.1), new THREE.Vector2(0.01, alto - 0.1),
    ], 12), aluminio);
    mastro.position.y = 0.5;
    this.group.add(mastro);
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), dourado);
    bola.position.y = alto + 0.5;
    this.group.add(bola);
    // a corda, um tico à frente do mastro, e a presilha
    const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, alto - 1.4, 4), corda);
    fio.position.set(0.075, 0.5 + (alto - 1.4) / 2 + 1.1, 0.03);
    this.group.add(fio);
    const presilha = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.04), dourado);
    presilha.position.set(0.07, 1.55, 0.03);
    this.group.add(presilha);
    // o pano: nasce colado no mastro, ao longo do +X
    const H = comprimento * 0.66;
    const geo = new THREE.PlaneGeometry(comprimento, H, 16, 8);
    geo.translate(comprimento / 2 + 0.07, 0, 0);
    this.base = Float32Array.from(geo.getAttribute('position').array as Float32Array);
    this.pano = new THREE.Mesh(geo, toon(0xffffff, { mapa: panoDaBandeira(qual), doubleSide: true }));
    this.pano.name = 'pano-da-bandeira';
    this.pano.position.y = 0.5 + alto - 0.25 - H / 2;
    this.group.add(this.pano);
    this.update(0);
  }

  update(dt: number): void {
    this.tempo += dt;
    const t = this.tempo;
    const pos = this.pano.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const L = this.comprimento;
    for (let i = 0; i < pos.count; i++) {
      const x0 = this.base[i * 3];
      const y0 = this.base[i * 3 + 1];
      const u = Math.max(0, (x0 - 0.07) / L);
      // a onda: do mastro para a ponta, mais funda na ponta; e a ponta cai um tico
      const onda = Math.sin(u * 7.5 - t * 4.2 + y0 * 1.1) * 0.16 + Math.sin(u * 3.1 - t * 2.3) * 0.08;
      arr[i * 3] = x0 - u * u * 0.08 * (1 + Math.sin(t * 1.3));
      arr[i * 3 + 1] = y0 - u * u * 0.12;
      arr[i * 3 + 2] = onda * u;
    }
    pos.needsUpdate = true;
    this.pano.geometry.computeVertexNormals();
  }
}

// ========================================================== a placa da entrada

/**
 * A PLACA DA ENTRADA: o monumento de tijolo que toda escola americana tem na
 * beira da rua — dois pilares de tijolo com o capitel de pedra, o painel azul
 * dos Gatitos com o nome (e a cara do Gatito) e, embaixo, o QUADRO DE RECADOS
 * de letrinhas pretas. Frente para `+Z`; ~5,4 m de largura e 2,7 de altura.
 */
export function placaDaEscola(recado: readonly string[] = ['BEM-VINDOS, GATITOS!', 'AULA DE PORTUGUÊS · SALA 1']): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-da-escola';
  const tijolo = toon(P.escolaRejunte, { mapa: tijolinho(0.95, P.escolaTijoloFora) });
  const pedra = toon(P.escolaPedra, { mapa: reboco(1.2) });
  const peca = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh => {
    const m = new THREE.Mesh(mat === tijolo || mat === pedra ? uvDeParede(geo, x, y, z) : geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  // a mureta de baixo e os dois pilares, com o capitel de pedra
  peca(new THREE.BoxGeometry(4.6, 0.62, 0.62), tijolo, 0, 0.31, 0);
  peca(new THREE.BoxGeometry(4.8, 0.1, 0.74), pedra, 0, 0.67, 0);
  for (const s of [-1, 1]) {
    peca(new THREE.BoxGeometry(0.72, 2.5, 0.78), tijolo, s * 2.66, 1.25, 0);
    peca(new THREE.BoxGeometry(0.9, 0.14, 0.96), pedra, s * 2.66, 2.57, 0);
    const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.34, 4), pedra);
    ponta.rotation.y = Math.PI / 4;
    ponta.position.set(s * 2.66, 2.81, 0);
    g.add(ponta);
  }
  // o painel azul, com a moldura de pedra
  peca(new THREE.BoxGeometry(4.66, 1.02, 0.3), pedra, 0, 1.92, 0);
  const nome = pintura(1024, 210, (ctx, W, H) => {
    ctx.fillStyle = hex(P.bandeiraGatitosAzul);
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = hex(P.escolaArmarioAmarelo);
    ctx.lineWidth = 8;
    ctx.strokeRect(14, 14, W - 28, H - 28);
    caraDoGatito(ctx, H * 0.62, H * 0.53, H * 0.27);
    caraDoGatito(ctx, W - H * 0.62, H * 0.53, H * 0.27);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // o nome cabe ENTRE as duas carinhas (a primeira versão tinha a letra comida por elas)
    let px = Math.round(H * 0.36);
    const cabe = W - H * 2.7;
    do {
      ctx.font = `700 ${px}px Georgia, "Times New Roman", serif`;
      px -= 2;
    } while (px > 12 && ctx.measureText('ESCOLA DO GATITO').width > cabe);
    ctx.fillText('ESCOLA DO GATITO', W / 2, H * 0.42);
    ctx.fillStyle = hex(P.escolaArmarioAmarelo);
    ctx.font = `800 ${Math.round(H * 0.15)}px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.fillText('LAR DOS GATITOS', W / 2, H * 0.76);
  });
  const painel = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 0.92), toon(0xffffff, { mapa: nome }));
  painel.position.set(0, 1.92, 0.155);
  g.add(painel);
  // o quadro de recados: branco, com as canaletas e as letrinhas pretas
  peca(new THREE.BoxGeometry(4.6, 0.78, 0.26), pedra, 0, 1.05, 0);
  const quadro = pintura(1024, 168, (ctx, W, H) => {
    ctx.fillStyle = '#f9f8f3';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(40,40,40,0.18)';
    ctx.lineWidth = 2;
    for (let k = 1; k < 4; k++) {
      ctx.beginPath();
      ctx.moveTo(0, (H / 4) * k * 1.0);
      ctx.lineTo(W, (H / 4) * k * 1.0);
      ctx.stroke();
    }
    ctx.fillStyle = '#1f1d22';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.round(H * 0.24)}px "Arial Narrow", Arial, sans-serif`;
    recado.slice(0, 2).forEach((linha, i) => ctx.fillText(linha, W / 2, H * (0.3 + i * 0.42)));
  });
  const recados = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 0.72), toon(0xffffff, { mapa: quadro }));
  recados.position.set(0, 1.03, 0.135);
  g.add(recados);
  return g;
}

// ============================================================ os arbustos

/** um pé de arbusto aparado: onde, o tamanho e a semente */
export interface PeDeArbusto {
  x: number;
  z: number;
  escala?: number;
  semente?: number;
  /** achatado (sebe baixa) ou redondo */
  forma?: 'bola' | 'almofada';
}

/**
 * OS ARBUSTOS APARADOS do pé do prédio e dos canteiros (o buxinho redondo e
 * a "almofada" baixa da foto): um icosaedro amassado pela POSIÇÃO (a mesma
 * quina recebe o mesmo empurrão em todo triângulo), com o pé escuro e o alto
 * claro pintados nos vértices. Todos os do pátio são UM lote, com o tom de
 * cada pé sorteado na cópia.
 */
export function arbustosAparados(pes: readonly PeDeArbusto[]): THREE.InstancedMesh {
  const geo = new THREE.IcosahedronGeometry(1, 3);
  const pos = geo.getAttribute('position');
  const cor = new Float32Array(pos.count * 3);
  const escuro = new THREE.Color(P.leafDark);
  const claro = new THREE.Color(P.grass).lerp(new THREE.Color(0xffffff), 0.12);
  const ruido = (x: number, y: number, z: number): number => {
    const k = Math.round(x * 40) * 73856093 ^ Math.round(y * 40) * 19349663 ^ Math.round(z * 40) * 83492791;
    return ((k >>> 0) % 1000) / 1000;
  };
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const k = 1 + (ruido(x, y, z) - 0.5) * 0.16;
    pos.setXYZ(i, x * k, Math.max(-0.35, y) * k + 0.35, z * k);
    c.copy(escuro).lerp(claro, THREE.MathUtils.clamp((y + 0.4) / 1.3, 0, 1) * (0.8 + ruido(z, x, y) * 0.4));
    cor.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
  const solta = geo.toNonIndexed();
  solta.computeVertexNormals();
  const lote = new THREE.InstancedMesh(solta, toon(0xffffff, { corPorVertice: true }), pes.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  pes.forEach((p, i) => {
    const rnd = sorteio(4100 + Math.round((p.semente ?? i) * 37));
    const s = (p.escala ?? 1) * (0.9 + rnd() * 0.2);
    const almofada = p.forma === 'almofada';
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * Math.PI * 2);
    m.compose(new THREE.Vector3(p.x, 0, p.z), q, new THREE.Vector3(s * (almofada ? 0.75 : 0.5), s * (almofada ? 0.42 : 0.55), s * (almofada ? 0.62 : 0.5)));
    lote.setMatrixAt(i, m);
    lote.setColorAt(i, new THREE.Color(0xffffff).multiplyScalar(0.88 + rnd() * 0.16));
  });
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  lote.computeBoundingSphere();
  lote.userData.peca = 'arbustos-aparados';
  return lote;
}

// ============================================================== miudezas

/**
 * A PLAQUINHA DE AVISO no poste de metal (as da foto, na beira do
 * calçadão): uma chapa branca de borda vermelha, com o desenho e o texto em
 * canvas. Frente para `+Z`.
 */
export function plaquinhaNoPoste(linhas: readonly string[], desenho?: 'pata' | 'bicicleta'): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'plaquinha-no-poste';
  const metal = toon(P.escolaMastro);
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 2.2, 8), metal);
  poste.position.y = 1.1;
  g.add(poste);
  const chapa = new THREE.Mesh(quina(0.62, 0.78, 0.03, 0.01), metal);
  chapa.position.set(0, 1.85, 0.05);
  g.add(chapa);
  const arte = pintura(256, 322, (ctx, W, H) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = hex(P.escolaFaixa);
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, W - 20, H - 20);
    ctx.fillStyle = hex(P.escolaFaixa);
    if (desenho === 'pata') {
      // a patinha: a almofada e os quatro dedinhos
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.3, W * 0.13, W * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
      for (const [dx, dy] of [[-0.17, -0.12], [-0.06, -0.19], [0.06, -0.19], [0.17, -0.12]]) {
        ctx.beginPath();
        ctx.ellipse(W / 2 + dx * W, H * 0.3 + dy * W, W * 0.045, W * 0.055, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (desenho === 'bicicleta') {
      ctx.lineWidth = 9;
      ctx.strokeStyle = hex(P.escolaFaixa);
      for (const dx of [-0.2, 0.2]) {
        ctx.beginPath();
        ctx.arc(W / 2 + dx * W, H * 0.32, W * 0.12, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(W * 0.3, H * 0.32);
      ctx.lineTo(W * 0.46, H * 0.2);
      ctx.lineTo(W * 0.62, H * 0.2);
      ctx.lineTo(W * 0.7, H * 0.32);
      ctx.moveTo(W * 0.46, H * 0.2);
      ctx.lineTo(W * 0.5, H * 0.32);
      ctx.lineTo(W * 0.62, H * 0.2);
      ctx.stroke();
    }
    ctx.fillStyle = '#26232a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const n = linhas.length;
    const px = Math.round(H * (n > 2 ? 0.1 : 0.12));
    ctx.font = `800 ${px}px ui-rounded, "Nunito", system-ui, sans-serif`;
    linhas.forEach((l, i) => ctx.fillText(l, W / 2, H * 0.62 + (i - (n - 1) / 2) * px * 1.15));
  });
  const frente = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.74), toon(0xffffff, { mapa: arte }));
  frente.position.set(0, 1.85, 0.067);
  g.add(frente);
  for (const y of [1.62, 2.08]) {
    const abracadeira = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.06), metal);
    abracadeira.position.set(0, y, 0.02);
    g.add(abracadeira);
  }
  return g;
}

/**
 * O BICICLETÁRIO de escola: um tubo só, ondulado (o "U" de ponta-cabeça
 * repetido), chumbado em duas sapatas. Frente para `+Z`, ao longo do `X`.
 */
export function bicicletario(ondas = 5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bicicletario';
  const pts: THREE.Vector3[] = [];
  const passo = 0.62;
  const largura = ondas * passo;
  for (let i = 0; i <= ondas * 16; i++) {
    const t = i / 16;
    const x = -largura / 2 + t * passo;
    const fase = (t % 1) * Math.PI;
    pts.push(new THREE.Vector3(x, 0.04 + Math.sin(fase) * 0.82, 0));
  }
  const tubo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), ondas * 24, 0.03, 8, false), toon(P.bandeiraGatitosAzul));
  g.add(tubo);
  for (const s of [-1, 1]) {
    const sapata = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.3), toon(P.escolaPedraSombra));
    sapata.position.set(s * (largura / 2), 0.025, 0);
    g.add(sapata);
  }
  return g;
}
