import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { acesoPorVertice, brilhoEmLote, luzNoChao, toon } from '../../core/materials';
import { Vento } from '../../core/shaders';

/*
 * O QUE SE PENDURA NO PARQUE ENFEITADO (`docs/HALLOWEEN.md`, §4.1): o varal
 * de bandeirolas recortadas (morceguinho, abóbora e fantasma), a lanterna de
 * papel sanfonada, o fantasminha de pano, o morceguinho de papel no fio e a
 * teia de lã com a aranhinha de feltro.
 *
 * TUDO EM LOTE, e tudo o que balança balança no VENTO do `core/shaders.ts`
 * (o mesmo do capim), com a altura NEGATIVA: a peça pendurada fica presa em
 * cima e é a ponta de baixo que voa. O lugar inteiro (ou o parque inteiro)
 * cabe em meia dúzia de desenhos por quadro: um por tipo de peça.
 *
 * O papel recortado é um quadradinho com o desenho em canvas e o `alphaTest`
 * (`Vento.material(cor, { recorte })`): o recorte com a beirinha clara do
 * papel, os olhinhos e o sorriso saem no desenho, sem um triângulo a mais.
 * Nada disso faz sombra: a sombra não balançaria junto.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** um canvas desenhado uma vez, como textura de cor */
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

// ============================================================ os recortes

/** a silhueta do morceguinho (asas abertas em meia-lua recortada), centrada em (0, 0), ~240 px de ponta a ponta */
function caminhoDoMorcego(): Path2D {
  const p = new Path2D();
  for (const s of [-1, 1]) {
    // a asa: a borda de cima em arco até a ponta, e a de baixo em três meias-luas
    p.moveTo(s * 20, -16);
    p.quadraticCurveTo(s * 66, -54, s * 118, -30);
    p.quadraticCurveTo(s * 100, -10, s * 104, 8);
    p.quadraticCurveTo(s * 84, -2, s * 74, 18);
    p.quadraticCurveTo(s * 58, 6, s * 46, 26);
    p.quadraticCurveTo(s * 34, 12, s * 18, 22);
    p.closePath();
    // a orelha
    p.moveTo(s * 10, -40);
    p.lineTo(s * 24, -66);
    p.lineTo(s * 28, -34);
    p.closePath();
  }
  p.ellipse(0, 4, 26, 32, 0, 0, Math.PI * 2);
  p.moveTo(28, -30);
  p.arc(0, -30, 28, 0, Math.PI * 2);
  return p;
}

/** o morceguinho de papel: a beira do papel, o roxo, as costelas da asa, os olhinhos, o sorriso e as presinhas */
function desenharMorcego(c: CanvasRenderingContext2D, x: number, y: number, k: number): void {
  c.save();
  c.translate(x, y);
  c.scale(k, k);
  const corpo = caminhoDoMorcego();
  c.strokeStyle = css(P.papelDeRecorte);
  c.lineWidth = 12;
  c.stroke(corpo);
  c.fillStyle = css(P.papelDeRecorte);
  c.fill(corpo);
  c.fillStyle = css(P.morcegoDePapel);
  c.fill(corpo);
  // as costelas da asa, num roxo um tico mais claro
  c.strokeStyle = '#5a4370';
  c.lineWidth = 3;
  for (const s of [-1, 1]) {
    for (const [px, py] of [[104, 8], [74, 18], [46, 26]]) {
      c.beginPath();
      c.moveTo(s * 24, -10);
      c.quadraticCurveTo(s * (px * 0.6), py * 0.2 - 18, s * px, py);
      c.stroke();
    }
  }
  // a barriguinha clara
  c.fillStyle = '#5a4370';
  c.beginPath();
  c.ellipse(0, 12, 14, 18, 0, 0, Math.PI * 2);
  c.fill();
  // os olhos: branco, a pupila e o brilho
  for (const s of [-1, 1]) {
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.ellipse(s * 11, -32, 9, 10, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = css(P.olhoDeBoneco);
    c.beginPath();
    c.arc(s * 10, -30, 5.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(s * 8, -33, 2, 0, Math.PI * 2);
    c.fill();
    // a bochecha
    c.fillStyle = css(P.bochechaDeBoneco);
    c.globalAlpha = 0.8;
    c.beginPath();
    c.ellipse(s * 19, -20, 5, 3.5, 0, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 1;
  }
  // o sorriso e as duas presinhas
  c.strokeStyle = '#ffffff';
  c.lineWidth = 2.5;
  c.beginPath();
  c.arc(0, -22, 7, 0.2 * Math.PI, 0.8 * Math.PI);
  c.stroke();
  c.fillStyle = '#ffffff';
  for (const s of [-1, 1]) {
    c.beginPath();
    c.moveTo(s * 5, -16.5);
    c.lineTo(s * 2, -16);
    c.lineTo(s * 3.5, -11);
    c.closePath();
    c.fill();
  }
  c.restore();
}

/** a abóbora de papel: três gomos, o cabinho, a folha e a cara */
function desenharAbobora(c: CanvasRenderingContext2D, x: number, y: number, k: number): void {
  c.save();
  c.translate(x, y);
  c.scale(k, k);
  const p = new Path2D();
  p.ellipse(-42, 12, 52, 62, 0, 0, Math.PI * 2);
  p.ellipse(42, 12, 52, 62, 0, 0, Math.PI * 2);
  p.ellipse(0, 10, 56, 66, 0, 0, Math.PI * 2);
  p.rect(-9, -74, 18, 26);
  c.strokeStyle = css(P.papelDeRecorte);
  c.lineWidth = 12;
  c.stroke(p);
  c.fillStyle = css(P.papelDeRecorte);
  c.fill(p);
  c.fillStyle = css(P.abobora);
  c.beginPath();
  c.ellipse(-42, 12, 52, 62, 0, 0, Math.PI * 2);
  c.ellipse(42, 12, 52, 62, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = css(P.aboboraClara);
  c.beginPath();
  c.ellipse(0, 10, 56, 66, 0, 0, Math.PI * 2);
  c.fill();
  // os vincos dos gomos
  c.strokeStyle = css(P.aboboraFunda);
  c.lineWidth = 4;
  for (const s of [-1, 1]) {
    c.beginPath();
    c.ellipse(s * 26, 12, 24, 58, 0, s > 0 ? -0.5 * Math.PI : 0.5 * Math.PI, s > 0 ? 0.5 * Math.PI : 1.5 * Math.PI);
    c.stroke();
  }
  // o cabinho e a folha
  c.fillStyle = css(P.aboboraCabinho);
  c.beginPath();
  c.moveTo(-8, -48);
  c.quadraticCurveTo(-10, -66, 2, -76);
  c.lineTo(10, -70);
  c.quadraticCurveTo(4, -62, 8, -48);
  c.fill();
  c.fillStyle = css(P.aboboraFolha);
  c.beginPath();
  c.ellipse(26, -60, 20, 10, -0.4, 0, Math.PI * 2);
  c.fill();
  // a cara: olhos de triângulo, o nariz e o sorriso de dentinho
  c.fillStyle = css(P.aboboraOco);
  for (const s of [-1, 1]) {
    c.beginPath();
    c.moveTo(s * 34, -6);
    c.lineTo(s * 12, -6);
    c.lineTo(s * 22, -26);
    c.closePath();
    c.fill();
  }
  c.beginPath();
  c.moveTo(-8, 10);
  c.lineTo(8, 10);
  c.lineTo(0, 0);
  c.closePath();
  c.fill();
  c.beginPath();
  c.moveTo(-40, 22);
  c.quadraticCurveTo(0, 62, 40, 22);
  c.quadraticCurveTo(0, 40, -40, 22);
  c.fill();
  c.fillStyle = css(P.aboboraClara);
  c.fillRect(-6, 29, 10, 9);
  c.restore();
}

/** o fantasminha de papel: a cabeça redonda, a barra ondulada, os olhos, a bochecha e o "o" */
function desenharFantasma(c: CanvasRenderingContext2D, x: number, y: number, k: number): void {
  c.save();
  c.translate(x, y);
  c.scale(k, k);
  const p = new Path2D();
  p.moveTo(-58, 70);
  p.lineTo(-58, -10);
  p.arc(0, -10, 58, Math.PI, 0);
  p.lineTo(58, 70);
  // a barra em quatro ondas
  for (let i = 0; i < 4; i++) {
    const x0 = 58 - i * 29;
    p.quadraticCurveTo(x0 - 7, 90, x0 - 14.5, 72);
    p.quadraticCurveTo(x0 - 22, 56, x0 - 29, 70);
  }
  p.closePath();
  // os bracinhos
  p.moveTo(-56, 10);
  p.quadraticCurveTo(-84, 14, -78, 34);
  p.quadraticCurveTo(-66, 30, -56, 32);
  p.moveTo(56, 10);
  p.quadraticCurveTo(84, 14, 78, 34);
  p.quadraticCurveTo(66, 30, 56, 32);
  c.strokeStyle = css(P.papelDeRecorte);
  c.lineWidth = 12;
  c.stroke(p);
  c.fillStyle = css(P.fantasmaDePano);
  c.fill(p);
  c.strokeStyle = '#ddd4c4';
  c.lineWidth = 3;
  c.stroke(p);
  c.fillStyle = css(P.olhoDeBoneco);
  for (const s of [-1, 1]) {
    c.beginPath();
    c.ellipse(s * 20, -14, 9, 13, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#ffffff';
  for (const s of [-1, 1]) {
    c.beginPath();
    c.arc(s * 20 - 3, -19, 3, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = css(P.bochechaDeBoneco);
  for (const s of [-1, 1]) {
    c.beginPath();
    c.ellipse(s * 36, 2, 8, 5, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = css(P.olhoDeBoneco);
  c.beginPath();
  c.ellipse(0, 10, 6, 8, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

export type Recorte = 'morcego' | 'abobora' | 'fantasma';
export const RECORTES: readonly Recorte[] = ['morcego', 'abobora', 'fantasma'];

let texturas: Record<Recorte | 'morcegoNoFio', THREE.CanvasTexture> | null = null;

function texturasDosRecortes(): NonNullable<typeof texturas> {
  if (texturas) return texturas;
  // a bandeirola: o recorte pendurado pelo alto, com o furinho do barbante
  const bandeirola = (desenho: (c: CanvasRenderingContext2D) => void) =>
    canvasTex(256, 256, (c) => {
      desenho(c);
      // o furinho por onde o barbante passa
      c.fillStyle = css(P.barbante);
      c.beginPath();
      c.arc(128, 14, 5, 0, Math.PI * 2);
      c.fill();
    });
  texturas = {
    morcego: bandeirola((c) => desenharMorcego(c, 128, 120, 0.98)),
    abobora: bandeirola((c) => desenharAbobora(c, 128, 136, 1.12)),
    fantasma: bandeirola((c) => desenharFantasma(c, 128, 120, 1.15)),
    // o morceguinho de galho: o fio de barbante de cima até as costas dele
    morcegoNoFio: canvasTex(256, 384, (c) => {
      c.strokeStyle = css(P.barbante);
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(128, 0);
      c.lineTo(128, 220);
      c.stroke();
      desenharMorcego(c, 128, 280, 1);
    }),
  };
  return texturas;
}

/** o quadradinho de papel, pendurado pelo meio da borda de cima (a origem) */
function geoRecorte(largura: number, altura: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(largura, altura);
  geo.translate(0, -altura / 2, 0);
  return geo;
}

// ======================================================= as peças de volume

/**
 * O FANTASMINHA DE PANO: o lençol caindo de uma cabecinha redonda, abrindo em
 * saia com dobras, a barra ondulada e dois bracinhos (o pano que a mão de
 * dentro empurra). Os olhinhos, a bochecha e o barbante de pendurar vão na
 * MESMA malha, com a cor nos vértices. Origem no alto do barbante.
 */
function geoFantasminha(): THREE.BufferGeometry {
  const VOLTA = 18;
  const LINHAS = 14;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= LINHAS; j++) {
    const s = j / LINHAS;
    for (let i = 0; i <= VOLTA; i++) {
      const t = (i / VOLTA) * Math.PI * 2;
      let r: number;
      let y: number;
      if (s < 0.38) {
        const a = (s / 0.38) * (Math.PI / 2);
        r = 0.13 * Math.sin(a);
        y = -0.06 - 0.13 * (1 - Math.cos(a));
      } else {
        const k = (s - 0.38) / 0.62;
        r = 0.13 + 0.085 * Math.pow(k, 1.4);
        y = -0.19 - 0.3 * k;
        // as dobras do pano, que crescem para baixo
        r *= 1 + 0.06 * Math.sin(7 * t + 0.6) * k;
        // os bracinhos dos dois lados
        for (const lado of [-1, 1]) {
          const da = Math.atan2(Math.sin(t - (lado * Math.PI) / 2), Math.cos(t - (lado * Math.PI) / 2));
          r += 0.05 * Math.exp(-((da / 0.32) ** 2)) * Math.exp(-(((k - 0.22) / 0.13) ** 2));
        }
        // a barra ondulada
        if (k > 0.8) y += 0.035 * Math.sin(5 * t + 1) * ((k - 0.8) / 0.2);
      }
      pos.push(Math.sin(t) * r, y, Math.cos(t) * r);
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
  const panoLiso = mergeVertices(pano);
  panoLiso.computeVertexNormals();

  const pintada = (geo: THREE.BufferGeometry, cor: number): THREE.BufferGeometry => {
    const g = geo.index ? geo.toNonIndexed() : geo;
    for (const n of Object.keys(g.attributes)) if (n !== 'position' && n !== 'normal') g.deleteAttribute(n);
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    const c = new THREE.Color(cor);
    const cores = new Float32Array(g.getAttribute('position').count * 3);
    for (let i = 0; i < cores.length; i += 3) cores.set([c.r, c.g, c.b], i);
    g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    return g;
  };
  // na frente da cabeça (+Z): os olhos achatados, o brilho e a bochecha
  const naCabeca = (geo: THREE.BufferGeometry, ang: number, alt: number, fora: number): THREE.BufferGeometry => {
    const r = 0.13 * fora;
    const y = -0.19 + Math.sin(alt) * 0.13 * fora;
    const rr = Math.cos(alt) * r;
    geo.lookAt(new THREE.Vector3(Math.sin(ang), Math.sin(alt) * 0.4, Math.cos(ang)));
    geo.translate(Math.sin(ang) * rr, y, Math.cos(ang) * rr);
    return geo;
  };
  const olho = (ang: number) => naCabeca(new THREE.SphereGeometry(0.022, 8, 6).scale(0.8, 1.15, 0.35), ang, 0.12, 0.995);
  const brilho = (ang: number) => naCabeca(new THREE.SphereGeometry(0.007, 6, 4).scale(1, 1, 0.4), ang, 0.2, 1.02);
  const bochecha = (ang: number) => naCabeca(new THREE.CircleGeometry(0.018, 10).scale(1.3, 0.8, 1), ang, -0.1, 1.012);
  const boca = naCabeca(new THREE.SphereGeometry(0.013, 8, 6).scale(0.9, 1.1, 0.3), 0, -0.2, 0.99);
  const barbante = new THREE.CylinderGeometry(0.004, 0.004, 0.07, 4).translate(0, -0.035, 0);
  return mergeGeometries([
    pintada(panoLiso, P.fantasmaDePano),
    pintada(olho(-0.33), P.olhoDeBoneco),
    pintada(olho(0.33), P.olhoDeBoneco),
    pintada(brilho(-0.37), 0xffffff),
    pintada(brilho(0.29), 0xffffff),
    pintada(bochecha(-0.62), P.bochechaDeBoneco),
    pintada(bochecha(0.62), P.bochechaDeBoneco),
    pintada(boca, P.olhoDeBoneco),
    pintada(barbante, P.barbante),
  ]);
}

/**
 * A LANTERNA DE PAPEL SANFONADA: o papel em pregas (a sanfona é o raio
 * ondulando na altura), os dois aros de arame, os fundos e a alça. Origem no
 * gancho, em cima; a cor do papel vem da cópia (a de arame fica escura de
 * qualquer jeito: a cor nos vértices multiplica a da cópia).
 */
/** o soquete da lampadinha, preso no fio (o fio passa no alto dele) */
function geoSoquete(): THREE.BufferGeometry {
  return new THREE.CylinderGeometry(0.014, 0.016, 0.04, 6).translate(0, -0.02, 0);
}

/** a lampadinha em gota, pendurada embaixo do soquete; branca nos vértices (a cor é da cópia) */
function geoLampadinha(): THREE.BufferGeometry {
  const perfil: THREE.Vector2[] = [];
  for (let i = 0; i <= 8; i++) {
    const k = i / 8;
    // a gota: larga embaixo, afinando até o soquete
    const r = 0.03 * Math.sin(Math.PI * (0.08 + 0.92 * k)) * (0.55 + 0.45 * (1 - k));
    perfil.push(new THREE.Vector2(Math.max(0.001, r), -0.04 - 0.075 * (1 - k)));
  }
  const geo = new THREE.LatheGeometry(perfil, 10);
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geo.getAttribute('position').count * 3).fill(1), 3));
  return geo;
}

function geoLanterna(): THREE.BufferGeometry {
  const perfil: THREE.Vector2[] = [];
  const N = 33;
  const BAIXO = -0.43;
  const CIMA = -0.09;
  for (let i = 0; i <= N; i++) {
    const k = i / N;
    let r = 0.07 + 0.09 * Math.pow(Math.sin(Math.PI * k), 0.75);
    // as pregas: onze dobras, mais marcadas na barriga
    r *= 1 - 0.075 * Math.abs(Math.sin(11 * Math.PI * k)) * Math.sin(Math.PI * k);
    perfil.push(new THREE.Vector2(r, BAIXO + (CIMA - BAIXO) * k));
  }
  const papel = new THREE.LatheGeometry(perfil, 14);
  const pintada = (geo: THREE.BufferGeometry, k: number): THREE.BufferGeometry => {
    const g = geo.index ? geo.toNonIndexed() : geo;
    for (const n of Object.keys(g.attributes)) if (n !== 'position' && n !== 'normal') g.deleteAttribute(n);
    const cores = new Float32Array(g.getAttribute('position').count * 3).fill(k);
    g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    return g;
  };
  const aro = (y: number) => new THREE.TorusGeometry(0.072, 0.009, 5, 16).rotateX(Math.PI / 2).translate(0, y, 0);
  const fundo = (y: number, cima: boolean) => new THREE.CircleGeometry(0.07, 16).rotateX(cima ? -Math.PI / 2 : Math.PI / 2).translate(0, y, 0);
  // a alça: meia volta de arame do aro de cima até o gancho
  const alca = new THREE.TorusGeometry(0.06, 0.004, 4, 10, Math.PI).translate(0, CIMA + 0.005, 0);
  const gancho = new THREE.CylinderGeometry(0.004, 0.004, 0.035, 4).translate(0, -0.017, 0);
  const ESCURO = 0.16;
  return mergeGeometries([
    pintada(papel, 1),
    pintada(aro(BAIXO), ESCURO),
    pintada(aro(CIMA), ESCURO),
    pintada(fundo(BAIXO - 0.002, false), 0.55),
    pintada(fundo(CIMA + 0.002, true), 0.55),
    pintada(alca, ESCURO),
    pintada(gancho, ESCURO),
  ]);
}

/**
 * A TEIA DE LÃ, no plano XY (olhando para `+Z`), com o centro na origem: os
 * raios de ângulo meio torto e a espiral cedendo entre um raio e o outro (a lã
 * é pesada). Lã grossa de propósito: teia de fio fino some nesta câmera.
 */
function geoTeia(raio: number, semente: number): THREE.BufferGeometry {
  let s = semente * 9301 + 49297;
  const rnd = (): number => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const RAIOS = 8;
  const angulos: number[] = [];
  for (let i = 0; i < RAIOS; i++) angulos.push(((i + 0.5 * (rnd() - 0.5)) / RAIOS) * Math.PI * 2);
  const comprimento = angulos.map(() => raio * (0.82 + 0.18 * rnd()));
  const pedacos: THREE.BufferGeometry[] = [];
  const FIO = 0.007;
  for (let i = 0; i < RAIOS; i++) {
    const a = angulos[i];
    const fim = new THREE.Vector3(Math.cos(a) * comprimento[i], Math.sin(a) * comprimento[i], 0);
    pedacos.push(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(), fim), 1, FIO, 3, false));
  }
  // a espiral: de raio em raio, cada trecho cedendo para o centro
  const pontos: THREE.Vector3[] = [];
  const VOLTAS = 4.6;
  const PASSOS = Math.round(VOLTAS * RAIOS);
  for (let k = 0; k <= PASSOS; k++) {
    const i = k % RAIOS;
    const f = 0.16 + 0.8 * (k / PASSOS);
    const r0 = comprimento[i] * f;
    const a0 = angulos[i] + Math.floor(k / RAIOS) * Math.PI * 2;
    pontos.push(new THREE.Vector3(Math.cos(a0) * r0, Math.sin(a0) * r0, 0));
    if (k < PASSOS) {
      // o meio do trecho, cedendo
      const j = (k + 1) % RAIOS;
      const f1 = 0.16 + 0.8 * ((k + 1) / PASSOS);
      const r1 = comprimento[j] * f1;
      let a1 = angulos[j];
      while (a1 < angulos[i]) a1 += Math.PI * 2;
      const am = (angulos[i] + a1) / 2;
      const rm = ((r0 + r1) / 2) * 0.9;
      pontos.push(new THREE.Vector3(Math.cos(am) * rm, Math.sin(am) * rm, 0));
    }
  }
  pedacos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos, false, 'centripetal'), pontos.length * 2, FIO, 3, false));
  // o miolo: um nózinho de lã
  pedacos.push(new THREE.SphereGeometry(0.02, 6, 4));
  for (const p of pedacos) {
    for (const n of Object.keys(p.attributes)) if (n !== 'position' && n !== 'normal') p.deleteAttribute(n);
  }
  return mergeGeometries(pedacos.map((p) => (p.index ? p.toNonIndexed() : p)));
}

/**
 * A ARANHINHA DE FELTRO: o pompom felpudo (a bola amassada), a cabecinha, os
 * olhões e oito perninhas dobradas. Cor nos vértices; olhando para `+Z`, com
 * as costas para `+Y` (quem põe na teia gira).
 */
function geoAranhinha(): THREE.BufferGeometry {
  const pintada = (geo: THREE.BufferGeometry, cor: number): THREE.BufferGeometry => {
    const g = geo.index ? geo.toNonIndexed() : geo;
    for (const n of Object.keys(g.attributes)) if (n !== 'position' && n !== 'normal') g.deleteAttribute(n);
    const c = new THREE.Color(cor);
    const cores = new Float32Array(g.getAttribute('position').count * 3);
    for (let i = 0; i < cores.length; i += 3) cores.set([c.r, c.g, c.b], i);
    g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    return g;
  };
  // o pompom: a felpa é ruído pela POSIÇÃO (o canto repetido leva o mesmo empurrão)
  const pompom = new THREE.IcosahedronGeometry(0.05, 2);
  const p = pompom.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const k = 1 + 0.12 * Math.sin(x * 310 + y * 170) * Math.cos(z * 230 + x * 90);
    p.setXYZ(i, x * k, y * k * 0.9, z * k * 1.1 - 0.02);
  }
  pompom.computeVertexNormals();
  const cabeca = new THREE.SphereGeometry(0.032, 10, 8).translate(0, 0.004, 0.05);
  const pernas: THREE.BufferGeometry[] = [];
  for (const s of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const a = -0.75 + i * 0.5;
      const dx = Math.cos(a) * s;
      const dz = Math.sin(-a);
      const curva = new THREE.CatmullRomCurve3([
        new THREE.Vector3(dx * 0.03, 0, dz * 0.03 + 0.01),
        new THREE.Vector3(dx * 0.075, 0.04, dz * 0.075 + 0.01),
        new THREE.Vector3(dx * 0.115, -0.03, dz * 0.11 + 0.01),
      ]);
      pernas.push(pintada(new THREE.TubeGeometry(curva, 5, 0.006, 3, false), P.aranhaDeFeltro));
    }
  }
  const olho = (x: number) => new THREE.SphereGeometry(0.014, 8, 6).translate(x, 0.016, 0.074);
  const pupila = (x: number) => new THREE.SphereGeometry(0.0075, 6, 4).translate(x * 1.08, 0.016, 0.085);
  return mergeGeometries([
    pintada(pompom, P.aranhaDeFeltro),
    pintada(cabeca, P.aranhaDeFeltro),
    ...pernas,
    pintada(olho(-0.013), 0xffffff),
    pintada(olho(0.013), 0xffffff),
    pintada(pupila(-0.013), P.olhoDeBoneco),
    pintada(pupila(0.013), P.olhoDeBoneco),
  ]);
}

// ================================================================== o lote

interface Copia {
  p: THREE.Vector3;
  giro: number;
  escala: number;
  cor?: number;
  /** a inclinação fora do giro (a aranhinha na teia, deitada no plano dela) */
  q?: THREE.Quaternion;
}

/**
 * Tudo o que se pendura num lugar (ou no parque inteiro): a cena chama os
 * métodos, `montar()` no fim, e `update(dt)` a cada quadro (o vento).
 */
export class EnfeitesDePendurar {
  /** o vento das bandeirolas e dos morceguinhos (papel leve) */
  private readonly ventoDePapel = new Vento({ forca: 0.07, altura: -0.3, direcao: [0.86, 0.5] });
  /** o do pano e da lanterna: mais pesados, balançam mais devagar e menos */
  private readonly ventoDePano = new Vento({ forca: 0.05, altura: -0.5, direcao: [0.86, 0.5] });
  private readonly recortes: Record<Recorte, Copia[]> = { morcego: [], abobora: [], fantasma: [] };
  private readonly morcegos: Copia[] = [];
  private readonly fantasmas: Copia[] = [];
  private readonly lanternas: Copia[] = [];
  private readonly aranhas: Copia[] = [];
  private readonly lampadinhas: Copia[] = [];
  private readonly cordas: THREE.BufferGeometry[] = [];
  private readonly teias: THREE.BufferGeometry[] = [];
  private proximoRecorte = 0;

  /**
   * Um varal de barbante de `a` até `b`, cedendo `barriga` no meio, com as
   * bandeirolas recortadas a cada `passo` e, se pedir, uma lanterna de papel
   * no lugar de uma bandeirola a cada `lanternaACada`.
   */
  varal(a: THREE.Vector3, b: THREE.Vector3, opts: { barriga?: number; passo?: number; lanternaACada?: number; cores?: number[] } = {}): this {
    const barriga = opts.barriga ?? 0.4;
    const ponto = (t: number): THREE.Vector3 => a.clone().lerp(b, t).add(new THREE.Vector3(0, -barriga * 4 * t * (1 - t), 0));
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 16; i++) pts.push(ponto(i / 16));
    this.cordas.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.008, 4, false));
    const comprimento = a.distanceTo(b);
    const passo = opts.passo ?? 0.42;
    const n = Math.max(1, Math.floor(comprimento / passo) - 1);
    const dir = b.clone().sub(a);
    // o plano do papel acompanha o barbante
    const giro = Math.atan2(-dir.z, dir.x);
    const cores = opts.cores ?? [P.lanternaLaranja, P.lanternaRoxa];
    let lanterna = 0;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      const p = ponto(t);
      if (opts.lanternaACada && i % opts.lanternaACada === Math.floor(opts.lanternaACada / 2)) {
        this.lanternas.push({ p: p.add(new THREE.Vector3(0, 0.01, 0)), giro, escala: 1, cor: cores[lanterna++ % cores.length] });
        continue;
      }
      const tipo = RECORTES[this.proximoRecorte++ % RECORTES.length];
      this.recortes[tipo].push({ p: p.add(new THREE.Vector3(0, 0.005, 0)), giro, escala: 1 });
    }
    return this;
  }

  /**
   * Um VARAL DE LUZINHAS (a festa, de noite): o fio de `a` até `b`, cedendo
   * `barriga` no meio, com uma lampadinha a cada `passo`, alternando as
   * `cores`. A lâmpada é chapada e clara (sem luz: ela é a luz), e o halo de
   * cada uma vem do `luzDasLuzinhas()`.
   */
  luzinhas(a: THREE.Vector3, b: THREE.Vector3, opts: { barriga?: number; passo?: number; cores?: number[] } = {}): this {
    const barriga = opts.barriga ?? 0.35;
    const ponto = (t: number): THREE.Vector3 => a.clone().lerp(b, t).add(new THREE.Vector3(0, -barriga * 4 * t * (1 - t), 0));
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 16; i++) pts.push(ponto(i / 16));
    this.cordas.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.007, 4, false));
    const n = Math.max(1, Math.floor(a.distanceTo(b) / (opts.passo ?? 0.38)) - 1);
    const cores = opts.cores ?? [P.luzinhaLaranja, P.luzinhaRoxa, P.luzinhaCreme];
    for (let i = 1; i <= n; i++) {
      this.lampadinhas.push({ p: ponto(i / (n + 1)), giro: i * 0.7, escala: 1, cor: cores[i % cores.length] });
    }
    return this;
  }

  /** um fantasminha de pano pendurado em `(x, y, z)` (o alto do barbante) */
  fantasminha(x: number, y: number, z: number, giro = 0, escala = 1): this {
    this.fantasmas.push({ p: new THREE.Vector3(x, y, z), giro, escala });
    return this;
  }

  /** um morceguinho de papel no fio, pendurado em `(x, y, z)` */
  morcego(x: number, y: number, z: number, giro = 0, escala = 1): this {
    this.morcegos.push({ p: new THREE.Vector3(x, y, z), giro, escala });
    return this;
  }

  /**
   * Um recorte de papel sozinho, colado (e não num varal): o morceguinho nos
   * raios da roda gigante, a abóbora na vitrine. `(x, y, z)` é o meio da
   * borda de cima; `giro` vira o papel (0 = de frente para `+Z`).
   */
  recorte(tipo: Recorte, x: number, y: number, z: number, giro = 0, escala = 1): this {
    this.recortes[tipo].push({ p: new THREE.Vector3(x, y, z), giro, escala });
    return this;
  }

  /** uma aranhinha de feltro sozinha, sentada num tampo (as costas para cima) */
  aranhinha(x: number, y: number, z: number, giro = 0, escala = 1): this {
    this.aranhas.push({ p: new THREE.Vector3(x, y + 0.03 * escala, z), giro, escala });
    return this;
  }

  /** uma lanterna de papel sozinha, pendurada pelo gancho em `(x, y, z)` */
  lanterna(x: number, y: number, z: number, cor: number = P.lanternaLaranja, giro = 0): this {
    this.lanternas.push({ p: new THREE.Vector3(x, y, z), giro, escala: 1, cor });
    return this;
  }

  /**
   * Uma teia de lã em pé, com o centro em `(x, y, z)`, de frente para `giro`
   * (0 = olhando para `+Z`) e tombada `inclina` para trás; com a aranhinha
   * sentada nela, se pedir.
   */
  teia(x: number, y: number, z: number, giro: number, raio = 0.45, opts: { inclina?: number; aranha?: boolean; semente?: number } = {}): this {
    const geo = geoTeia(raio, opts.semente ?? this.teias.length + 1);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-(opts.inclina ?? 0), giro, 0, 'YXZ'));
    geo.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1)));
    this.teias.push(geo);
    if (opts.aranha ?? true) {
      // sentada num canto da teia, com as costas para fora e a cara para baixo
      const local = new THREE.Vector3(raio * 0.32, raio * 0.18, 0.02).applyQuaternion(q);
      const deitada = q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0.5)));
      this.aranhas.push({ p: new THREE.Vector3(x, y, z).add(local), giro: 0, escala: 1, q: deitada });
    }
    return this;
  }

  /** quantas peças de cada tipo (para o teste) */
  contar(): Record<string, number> {
    return {
      bandeirolas: RECORTES.reduce((n, r) => n + this.recortes[r].length, 0),
      lanternas: this.lanternas.length,
      fantasminhas: this.fantasmas.length,
      morceguinhos: this.morcegos.length,
      teias: this.teias.length,
      aranhinhas: this.aranhas.length,
      varais: this.cordas.length,
    };
  }

  montar(): THREE.Group {
    const g = new THREE.Group();
    g.name = 'pendurados';
    g.userData.peca = 'enfeites-de-pendurar';
    const tex = texturasDosRecortes();
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const cor = new THREE.Color();
    const s = new THREE.Vector3();
    const lote = (geo: THREE.BufferGeometry, mat: THREE.Material, copias: Copia[], nome: string, semSombra = true): void => {
      if (!copias.length) return;
      const im = new THREE.InstancedMesh(geo, mat, copias.length);
      im.name = nome;
      copias.forEach((c, i) => {
        if (c.q) q.copy(c.q);
        else q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), c.giro);
        im.setMatrixAt(i, m.compose(c.p, q, s.setScalar(c.escala)));
        if (c.cor !== undefined) im.setColorAt(i, cor.set(c.cor));
      });
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere();
      if (semSombra) im.userData.semSombra = true;
      g.add(im);
    };
    const bandeirola = geoRecorte(0.3, 0.3);
    for (const r of RECORTES) lote(bandeirola, this.ventoDePapel.material(0xffffff, { mapa: tex[r], recorte: true }), this.recortes[r], `bandeirolas-${r}`);
    lote(geoRecorte(0.3, 0.45), this.ventoDePapel.material(0xffffff, { mapa: tex.morcegoNoFio, recorte: true }), this.morcegos, 'morceguinhos');
    lote(geoFantasminha(), this.ventoDePano.material(0xffffff, { corPorVertice: true }), this.fantasmas, 'fantasminhas');
    lote(geoLanterna(), this.ventoDePano.material(0xffffff, { corPorVertice: true }), this.lanternas, 'lanternas-de-papel');
    lote(geoAranhinha(), toon(0xffffff, { corPorVertice: true }), this.aranhas, 'aranhinhas', false);
    if (this.lampadinhas.length) {
      lote(geoSoquete(), toon(P.aramePreto), this.lampadinhas.map((c) => ({ ...c, cor: undefined })), 'soquetes');
      lote(geoLampadinha(), acesoPorVertice(), this.lampadinhas, 'lampadinhas');
    }
    if (this.cordas.length) {
      const cordas = new THREE.Mesh(mergeGeometries(this.cordas.map((c) => c.toNonIndexed())), toon(P.barbante));
      cordas.name = 'barbantes';
      cordas.userData.semSombra = true;
      g.add(cordas);
    }
    if (this.teias.length) {
      const teias = new THREE.Mesh(mergeGeometries(this.teias), toon(P.laDaTeia));
      teias.name = 'teias';
      teias.userData.semSombra = true;
      g.add(teias);
    }
    return g;
  }

  /**
   * O que uma luz pendurada joga em volta: o HALO da cor dela (um lote só,
   * `brilhoEmLote`) e, se `chao` for dado, a POÇA no chão embaixo dela
   * (`luzNoChao`, outro lote, com a cor por cópia) — `poçaACada` pula as
   * vizinhas, para as poças de um varal comprido não somarem num lençol.
   * Luz pintada: a lanterna balança de leve no vento e o halo, macio e
   * largo, nem mostra a diferença.
   */
  private luzDe(
    copias: readonly Copia[], nome: string, desce: number, tamanho: number, forca: number,
    chao: number | null, raioDaPoca: number, forcaDaPoca: number, pocaACada: number, corPadrao: number,
  ): THREE.Group | null {
    if (!copias.length) return null;
    const g = new THREE.Group();
    g.name = nome;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const cor = new THREE.Color();
    const halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(0xffffff, forca), copias.length);
    halos.name = `halos-${nome}`;
    copias.forEach((c, i) => {
      p.copy(c.p).y -= desce * c.escala;
      halos.setMatrixAt(i, m.compose(p, q, s.setScalar(tamanho * c.escala)));
      halos.setColorAt(i, cor.set(c.cor ?? corPadrao));
    });
    halos.renderOrder = 3;
    const lotes = [halos];
    if (chao !== null) {
      const comPoca = copias.filter((_, i) => i % pocaACada === 0);
      const pocas = new THREE.InstancedMesh(new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 2), luzNoChao(0xffffff, forcaDaPoca), comPoca.length);
      pocas.name = `pocas-${nome}`;
      comPoca.forEach((c, i) => {
        p.set(c.p.x, chao, c.p.z);
        pocas.setMatrixAt(i, m.compose(p, q, s.setScalar(raioDaPoca)));
        pocas.setColorAt(i, cor.set(c.cor ?? corPadrao));
      });
      pocas.renderOrder = 2;
      lotes.push(pocas);
    }
    for (const im of lotes) {
      im.instanceMatrix.needsUpdate = true;
      im.computeBoundingSphere();
      im.userData.semSombra = true;
      g.add(im);
    }
    return g;
  }

  /** As LANTERNAS ACESAS: o halo no miolo de cada uma e a poça no `chao` embaixo dela. */
  luzDasLanternas(forca = 0.7, chao: number | null = null): THREE.Group | null {
    // o miolo da lanterna fica 26 cm abaixo do gancho
    return this.luzDe(this.lanternas, 'luz-das-lanternas', 0.26, 1.5, forca, chao, 1.9, 0.32, 1, P.lanternaLaranja);
  }

  /** As LUZINHAS ACESAS: o halo de cada lampadinha e uma poça no `chao` a cada três. */
  luzDasLuzinhas(forca = 0.7, chao: number | null = null): THREE.Group | null {
    return this.luzDe(this.lampadinhas, 'luz-das-luzinhas', 0.07, 0.75, forca, chao, 1.5, 0.16, 3, P.luzinhaLaranja);
  }

  update(dt: number): void {
    this.ventoDePapel.tique(dt);
    this.ventoDePano.tique(dt);
  }
}
