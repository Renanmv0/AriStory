import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { acabar } from './acabamento';
import { pocaDeLuz } from './furniture';
import { Lote } from './lojaDeRoupas';
import { hex, macia, por, serifa, texturaDePlaca, torneado, tubo } from './moveisDaBoutique';
import { veioDeMadeira } from './texturasDeCasa';
import { CARTELA_DE_TINTAS, TODAS_AS_TINTAS } from './tintas';

/**
 * ================================ O BALCÃO DE TINGIMENTO DA ESTELLA
 *
 * Pedido do Renan: no cantinho do mezanino da boutique (onde ficavam a
 * namoradeira e a mesinha), "um balcão para tingir as roupas — seja criativo,
 * deixe bem detalhado". É ele que abre o ateliê de tingimento
 * (`ui/atelie.ts`). O que o faz ler ATELIÊ de tinta de longe, e não "mais um
 * balcão da loja":
 *
 *  - a ESTANTE DE PIGMENTOS na parede: duas prateleiras de potes de tinta em
 *    ARCO-ÍRIS (as cores da cartela de verdade, na ordem dela), com a tampa de
 *    latão e a etiqueta de papel, sobre um painel perfurado; em cima, os rolos
 *    de tecido e os carretéis, e a plaquinha "Ateliê de Tinta";
 *  - as BANDEIROLAS de tecido tingido secando num cordão, na frente da
 *    estante — balançam devagar (`update`);
 *  - a TINA DE COBRE com a tinta girando (a superfície gira, `update`) e a pá
 *    de mexer encostada na borda;
 *  - o TAMPO DE CARVALHO MANCHADO DE TINTA (canvas: as tábuas, o veio e os
 *    respingos e marcas de pote de todas as cores) — é ele que diz "aqui se
 *    trabalha com tinta";
 *  - na bancada: a cartela de cores EM LEQUE (sete tiras, uma por família da
 *    cartela do ateliê), a caneca de pincéis, o caderno de receitas aberto, os
 *    potinhos de amostra e a pilha de tecidos já tingidos;
 *  - as GAVETAS DE PIGMENTO na frente, cada uma com a etiqueta da cor dela, e
 *    o balde de tinta no chão, ao lado.
 *
 * A luz é PINTADA: o filete aceso embaixo da estante e a poça quente na
 * bancada (o mesmo truque das arandelas da loja).
 *
 * Contrato do kit: base em `y = 0`, FRENTE em `+Z`, e a parede atrás em
 * `z = −FUNDO` (`BALCAO_DE_TINGIMENTO`). O que se mexe tem nome — `tinta-da-tina`
 * (gira) e as bandeirolas (um lote refeito a cada quadro) — e fica fora da
 * `fundir()` da cena; o resto vira poucas malhas.
 */

/** As medidas que a cena usa (colisor, onde a dupla para, a parede). */
export const BALCAO_DE_TINGIMENTO = {
  /** comprimento do balcão (eixo X da peça) */
  largura: 2.3,
  /** da frente do tampo (z = +0,14) até a parede (z = −0,5) */
  frente: 0.14,
  fundo: 0.5,
  /** o balde fica fora do balcão, na ponta de +X */
  balde: { x: 1.36, z: -0.18, raio: 0.17 },
} as const;

const L = BALCAO_DE_TINGIMENTO.largura;
/** o tampo: de z = −0,46 a +0,14 */
const ZB = -0.16;
const PROF = 0.6;
/** a altura da bancada (em cima do tampo) */
const T = 0.97;

// ============================================================ texturas

/**
 * O TAMPO DE CARVALHO MANCHADO: quatro tábuas no comprido, o veio, e por
 * cima os respingos, os pingos e as marcas redondas de fundo de pote, nas
 * cores da cartela. É pintado na proporção do tampo (2,3 × 0,6), e o tampo é
 * uma caixa com o UV de 0 a 1 em cima — nada de azulejo.
 */
function tampoManchado(): THREE.CanvasTexture {
  return texturaDePlaca('atelie:tampo', 1024, 268, (ctx, w, h) => {
    const base = new THREE.Color(P.atelieTampo);
    // as tábuas, cada uma num tom
    const tabuas = 4;
    for (let i = 0; i < tabuas; i++) {
      const c = base.clone().offsetHSL(0, 0, (i % 2 ? -0.03 : 0.02) + (i === 2 ? -0.015 : 0));
      ctx.fillStyle = `#${c.getHexString()}`;
      ctx.fillRect(0, (i * h) / tabuas, w, h / tabuas);
      ctx.fillStyle = 'rgba(90, 60, 30, 0.35)';
      ctx.fillRect(0, (i * h) / tabuas, w, 2);
    }
    // o veio: ondas finas correndo no comprido
    ctx.lineWidth = 1.2;
    let s = 7;
    const r = (): number => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let k = 0; k < 46; k++) {
      const y0 = r() * h;
      ctx.strokeStyle = `rgba(120, 80, 40, ${0.08 + r() * 0.1})`;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 16) {
        const y = y0 + Math.sin(x * 0.012 + k) * 4 + Math.sin(x * 0.041 + k * 3) * 1.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // os respingos e pingos, nas cores da cartela (sem os neutros, que somem)
    const cores = TODAS_AS_TINTAS.filter((t) => !CARTELA_DE_TINTAS.at(-1)?.tintas.includes(t)).map((t) => hex(t.cor));
    for (let k = 0; k < 34; k++) {
      const x = r() * w;
      const y = r() * h;
      const cor = cores[Math.floor(r() * cores.length)];
      ctx.fillStyle = cor;
      ctx.globalAlpha = 0.55 + r() * 0.35;
      const raio = 3 + r() * 11;
      ctx.beginPath();
      ctx.arc(x, y, raio, 0, Math.PI * 2);
      ctx.fill();
      // as gotinhas que saem do respingo
      for (let g = 0; g < 4 + Math.floor(r() * 5); g++) {
        const a = r() * Math.PI * 2;
        const d = raio * (1.4 + r() * 2.2);
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 1 + r() * 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // as marcas redondas de fundo de pote (anel)
    ctx.lineWidth = 3;
    for (let k = 0; k < 7; k++) {
      ctx.strokeStyle = cores[Math.floor(r() * cores.length)];
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(r() * w, r() * h, 16 + r() * 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

/** O PAINEL PERFURADO do fundo da estante: rosa-claro com os furinhos. */
function painelPerfurado(): THREE.CanvasTexture {
  const tex = texturaDePlaca('atelie:painel', 128, 128, (ctx, w, h) => {
    ctx.fillStyle = hex(P.boutiqueRosaClaro);
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(120, 80, 90, 0.38)';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.arc((i + 0.5) * (w / 4), (j + 0.5) * (h / 4), 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** A SUPERFÍCIE DA TINTA NA TINA: o fúcsia com o redemoinho mais claro. */
function redemoinho(): THREE.CanvasTexture {
  return texturaDePlaca('atelie:redemoinho', 256, 256, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const fundo = ctx.createRadialGradient(cx, cy, 4, cx, cy, w / 2);
    fundo.addColorStop(0, hex(P.tintaPink));
    fundo.addColorStop(1, hex(P.tintaMagenta));
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, w, h);
    // três braços de espiral, mais claros
    for (let braco = 0; braco < 3; braco++) {
      ctx.strokeStyle = braco === 1 ? 'rgba(255, 210, 235, 0.55)' : 'rgba(255, 150, 200, 0.6)';
      ctx.lineWidth = 7 - braco * 1.5;
      ctx.beginPath();
      for (let t = 0; t < 1; t += 0.02) {
        const a = t * Math.PI * 3.2 + (braco * Math.PI * 2) / 3;
        const raio = t * w * 0.46;
        const x = cx + Math.cos(a) * raio;
        const y = cy + Math.sin(a) * raio;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // o brilho da luz na tinta
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.17, cy - h * 0.2, w * 0.09, h * 0.035, -0.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * AS SETE TIRAS DA CARTELA EM LEQUE NUMA TEXTURA SÓ, lado a lado (uma coluna
 * de 64 px por família: as cores dela e a etiqueta branca). Com uma textura
 * por tira e um material por face, o leque custava ~40 desenhos por quadro;
 * com a textura única e o UV de cada tira apontando para a sua coluna, as
 * sete viram uma malha na `fundir()` — e a imagem é a mesma.
 */
const COLUNA_DA_TIRA = 64;
function cartelaDoLeque(): THREE.CanvasTexture {
  const n = CARTELA_DE_TINTAS.length;
  return texturaDePlaca('atelie:leque', COLUNA_DA_TIRA * n, 256, (ctx, _w, h) => {
    ctx.fillStyle = '#fbf8f2';
    ctx.fillRect(0, 0, COLUNA_DA_TIRA * n, h);
    CARTELA_DE_TINTAS.forEach((familia, i) => {
      const x0 = i * COLUNA_DA_TIRA;
      const w = COLUNA_DA_TIRA;
      const cores = familia.tintas.slice(0, 6);
      const alto = (h * 0.78) / cores.length;
      cores.forEach((t, k) => {
        ctx.fillStyle = hex(t.cor);
        ctx.fillRect(x0 + 4, 4 + k * alto, w - 8, alto - 4);
      });
      ctx.fillStyle = 'rgba(80, 60, 70, 0.55)';
      ctx.fillRect(x0 + 10, h * 0.86, w - 20, 4);
      ctx.fillRect(x0 + 10, h * 0.91, (w - 20) * 0.6, 4);
    });
  });
}

/**
 * O UV de uma caixa com a TAMPA DE CIMA mostrando um retângulo da textura e
 * as outras faces num ponto liso dela (o papel), para a caixa inteira caber
 * num material só. `BoxGeometry`: a face de cima são os vértices 8 a 11.
 */
function uvSoNaTampa(geo: THREE.BufferGeometry, u0: number, u1: number, liso: readonly [number, number]): void {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    if (i >= 8 && i < 12) uv.setX(i, u0 + uv.getX(i) * (u1 - u0));
    else uv.setXY(i, liso[0], liso[1]);
  }
  uv.needsUpdate = true;
}

/** As duas páginas do caderno de receitas: amostras redondas e a letra. */
function paginasDoCaderno(): THREE.CanvasTexture {
  return texturaDePlaca('atelie:caderno', 256, 160, (ctx, w, h) => {
    ctx.fillStyle = '#fdfaf3';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(170, 140, 120, 0.35)';
    ctx.fillRect(w / 2 - 1, 0, 2, h);
    // as linhas da pauta
    ctx.strokeStyle = 'rgba(120, 150, 200, 0.28)';
    ctx.lineWidth = 1;
    for (let y = 22; y < h; y += 14) {
      ctx.beginPath();
      ctx.moveTo(8, y);
      ctx.lineTo(w - 8, y);
      ctx.stroke();
    }
    // as amostras pintadas à mão, com a receita do lado
    const amostras = [P.tintaVerdeAgua, P.tintaLilas, P.tintaCoral, P.tintaAmareloSol, P.tintaAzulCeu, P.tintaRosaChiclete];
    amostras.forEach((cor, k) => {
      const lado = k < 3 ? 0 : 1;
      const x = 20 + lado * (w / 2);
      const y = 30 + (k % 3) * 42;
      ctx.fillStyle = hex(cor);
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hex(P.atelieCerda);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x + 18, y - 4);
      for (let t = 0; t < 70; t += 6) ctx.lineTo(x + 18 + t, y - 4 + Math.sin(t * 0.7 + k) * 2.2);
      ctx.moveTo(x + 18, y + 6);
      for (let t = 0; t < 44; t += 6) ctx.lineTo(x + 18 + t, y + 6 + Math.sin(t * 0.9 + k * 2) * 2);
      ctx.stroke();
    });
  });
}

/** A plaquinha da estante: "Ateliê de Tinta", serifa vinho, filete de latão. */
function texturaDaPlaca(): THREE.CanvasTexture {
  return texturaDePlaca('atelie:placa', 512, 136, (ctx, w, h) => {
    ctx.fillStyle = '#fbf7f0';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = hex(P.boutiqueOuro);
    ctx.lineWidth = 6;
    ctx.strokeRect(9, 9, w - 18, h - 18);
    // a fileira de gotinhas coloridas embaixo do nome
    const gotas = [P.tintaVermelhoCereja, P.tintaLaranja, P.tintaAmareloSol, P.tintaVerdeFolha, P.tintaCeleste, P.tintaVioleta, P.tintaRosaChiclete];
    gotas.forEach((cor, k) => {
      ctx.fillStyle = hex(cor);
      ctx.beginPath();
      ctx.arc(w / 2 + (k - 3) * 26, h * 0.78, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = hex(P.boutiqueVinho);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = serifa(h * 0.4, true);
    ctx.fillText('Ateliê de Tinta', w / 2, h * 0.4);
  });
}

// ============================================================ geometrias

/**
 * A BANDEIROLA de tecido: um retângulo de pano com a barra em ondinha,
 * pendurado pela borda de cima (`y = 0` no cordão, pano para baixo), com uma
 * ondulação no meio para não parecer papel.
 */
function geoBandeirola(): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(0.11, 0.15, 4, 6);
  geo.translate(0, -0.075, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const fundo = -y / 0.15;
    // a barra em ondinha: os vértices de baixo sobem e descem
    if (y < -0.149) pos.setY(i, y + Math.sin(x * 60) * 0.008);
    pos.setZ(i, Math.sin(x * 40 + fundo * 2) * 0.008 * fundo);
  }
  geo.computeVertexNormals();
  return geo;
}

// ============================================================ a junção

/**
 * AS PEÇAS DE COR LISA VIRAM UMA MALHA SÓ, com a cor nos vértices.
 *
 * O balcão tem dezenas de miudezas de uma cor cada (os tecidos dobrados, os
 * potinhos, os pincéis, a tina, o balde, o latão), e a `fundir()` só junta o
 * que divide MATERIAL — cada cor era um desenho a mais por quadro. Aqui elas
 * viram uma malha de `toon(branco, corPorVertice)`, o material das árvores: o
 * toon multiplica a cor do material (branca) pela do vértice (a da peça), e a
 * imagem é a mesma (comparada pixel a pixel com a de antes).
 *
 * Fica de fora o que não pode: o que tem textura (o carvalho, o tampo, a
 * plaquinha), o que brilha, o transparente, o de dois lados, o lote, e o que
 * mora num grupo com nome (a tinta da tina, que gira).
 */
const SEM_JUNCAO = typeof location !== 'undefined' && new URLSearchParams(location.search).has('semFundir');
function juntarPorCor(raiz: THREE.Group): void {
  // `?semFundir` desliga esta junção também: é como o `zfighting.mjs` mede
  // caixa por caixa, e como se compara a foto de antes
  if (SEM_JUNCAO) return;
  raiz.updateMatrixWorld(true);
  const inversa = new THREE.Matrix4().copy(raiz.matrixWorld).invert();
  const pedacos: THREE.BufferGeometry[] = [];
  const sair: THREE.Mesh[] = [];
  const temNome = (o: THREE.Object3D | null): boolean => {
    for (let p = o; p && p !== raiz; p = p.parent) if (p.name) return true;
    return false;
  };
  raiz.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh || Array.isArray(m.material)) return;
    const mat = m.material as THREE.MeshToonMaterial;
    if (!mat.isMeshToonMaterial || mat.map || mat.transparent || mat.side !== THREE.FrontSide || mat.vertexColors) return;
    if (mat.emissiveIntensity > 0 && mat.emissive.getHex() !== 0) return;
    if (temNome(m) || Object.keys(m.userData).length > 0) return;
    const geo = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone());
    for (const nome of Object.keys(geo.attributes)) if (nome !== 'position' && nome !== 'normal') geo.deleteAttribute(nome);
    geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inversa, m.matrixWorld));
    const n = geo.attributes.position.count;
    const cor = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) cor.set([mat.color.r, mat.color.g, mat.color.b], i * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
    pedacos.push(geo);
    sair.push(m);
  });
  if (pedacos.length < 2) return;
  const junta = mergeGeometries(pedacos);
  if (!junta) return;
  for (const m of sair) m.removeFromParent();
  raiz.add(new THREE.Mesh(junta, toon(0xffffff, { corPorVertice: true })));
}

// ============================================================ a peça

export class BalcaoDeTingimento {
  readonly group = new THREE.Group();
  /** a superfície da tinta da tina, que gira */
  private readonly tinta: THREE.Object3D;
  /** as bandeirolas: um lote, a matriz de cada uma refeita no `update` */
  private readonly bandeirolas: THREE.InstancedMesh;
  private readonly pontosDoCordao: THREE.Vector3[] = [];
  private tempo = 0;

  constructor() {
    const g = this.group;
    g.userData.peca = 'balcao-de-tingimento';
    const latao = toon(P.boutiqueOuro);
    const carvalho = P.boutiqueCarvalho;
    const { fundo } = BALCAO_DE_TINGIMENTO;

    // ------------------------------------------------ o balcão de gavetas
    const BASE = 0.07;
    const CORPO = T - 0.04 - BASE;
    // o rodapé recuado, de latão escuro
    por(g, new THREE.BoxGeometry(L - 0.06, BASE, PROF - 0.1), P.boutiqueOuroEscuro, 0, BASE / 2, ZB - 0.02);
    // a carcaça de carvalho (laterais, fundo, as travessas entre as gavetas)
    for (const sx of [-1, 1] as const) {
      por(g, macia(0.05, CORPO, PROF - 0.04, 0.01), carvalho, sx * (L / 2 - 0.025), BASE + CORPO / 2, ZB - 0.01);
    }
    por(g, new THREE.BoxGeometry(L - 0.1, CORPO - 0.02, 0.03), carvalho, 0, BASE + CORPO / 2, ZB - PROF / 2 + 0.035);
    const COLS = 4;
    const LINHAS = 2;
    const largGaveta = (L - 0.1 - (COLS - 1) * 0.03) / COLS;
    const altGaveta = (CORPO - 0.03 - (LINHAS - 1) * 0.03) / LINHAS;
    const zFrente = ZB + PROF / 2 - 0.035;
    // as travessas de carvalho que separam as gavetas (atrás da frente delas).
    // Elas ENTRAM no fundo (5 e 10 mm, cada uma de um tanto) e param em
    // profundidades diferentes na frente: com a mesma medida, as faces das
    // pontas caíam no plano do fundo e umas das outras (`zfighting.mjs`)
    for (let c = 1; c < COLS; c++) {
      const x = -L / 2 + 0.05 + c * (largGaveta + 0.03) - 0.015;
      por(g, new THREE.BoxGeometry(0.03, CORPO - 0.012, 0.5), carvalho, x, BASE + CORPO / 2, -0.175);
    }
    por(g, new THREE.BoxGeometry(L - 0.12, 0.03, 0.5), carvalho, 0, BASE + 0.015 + altGaveta + 0.015, -0.18);
    // as frentes das gavetas: almofada creme, puxador de latão e a etiqueta
    // da cor do pigmento (um lote de etiquetas, cor por cópia)
    const etiquetas = new Lote(new THREE.BoxGeometry(0.11, 0.045, 0.007), toon(0xffffff));
    const corDasGavetas = [P.tintaVermelhoCereja, P.tintaLaranja, P.tintaAmareloSol, P.tintaVerdeFolha, P.tintaTurquesa, P.tintaAzulRoyal, P.tintaVioleta, P.tintaRosaChiclete];
    const q0 = new THREE.Quaternion();
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLS; c++) {
        const x = -L / 2 + 0.05 + largGaveta / 2 + c * (largGaveta + 0.03);
        const y = BASE + 0.015 + altGaveta / 2 + (LINHAS - 1 - l) * (altGaveta + 0.03);
        por(g, macia(largGaveta - 0.008, altGaveta - 0.008, 0.03, 0.012), P.atelieGaveta, x, y, zFrente + 0.016);
        // o friso da almofada: um retângulo de latão fininho, 4 mm para fora
        const friso = new THREE.Shape();
        const fx = largGaveta / 2 - 0.035;
        const fy = altGaveta / 2 - 0.035;
        friso.moveTo(-fx, -fy);
        friso.lineTo(fx, -fy);
        friso.lineTo(fx, fy);
        friso.lineTo(-fx, fy);
        friso.closePath();
        const dentro = new THREE.Path();
        dentro.moveTo(-fx + 0.008, -fy + 0.008);
        dentro.lineTo(-fx + 0.008, fy - 0.008);
        dentro.lineTo(fx - 0.008, fy - 0.008);
        dentro.lineTo(fx - 0.008, -fy + 0.008);
        dentro.closePath();
        friso.holes.push(dentro);
        por(g, new THREE.ExtrudeGeometry(friso, { depth: 0.004, bevelEnabled: false }), latao, x, y, zFrente + 0.031);
        // o puxador em concha
        const concha = new THREE.SphereGeometry(0.03, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        concha.rotateX(Math.PI / 2);
        concha.scale(1.3, 0.55, 0.7);
        por(g, concha, latao, x, y - 0.03, zFrente + 0.035);
        etiquetas.por(null, new THREE.Vector3(x, y + 0.04, zFrente + 0.035), q0, 1, corDasGavetas[l * COLS + c]);
      }
    }
    etiquetas.montar(g);

    // o tampo de carvalho manchado de tinta (caixa: o UV de cima vai de 0 a 1)
    const tampo = new THREE.Mesh(new THREE.BoxGeometry(L + 0.06, 0.045, PROF + 0.04), toon(0xffffff, { mapa: tampoManchado() }));
    tampo.position.set(0, T - 0.0225, ZB);
    g.add(tampo);

    // ------------------------------------------------ a estante de pigmentos
    const E0 = 1.15;
    const E1 = 2.14;
    const EP = 0.26;
    const zE = -fundo + EP / 2;
    // as laterais e o chapéu (cornija com um degrauzinho), de carvalho
    for (const sx of [-1, 1] as const) {
      por(g, macia(0.045, E1 - E0, EP, 0.008), carvalho, sx * (L / 2 - 0.0425), (E0 + E1) / 2, zE);
    }
    por(g, macia(L + 0.02, 0.045, EP + 0.05, 0.01), carvalho, 0, E1 + 0.0225, zE + 0.02);
    por(g, macia(L - 0.04, 0.025, EP + 0.02, 0.006), carvalho, 0, E1 - 0.0125, zE + 0.005);
    // o painel perfurado do fundo, com o UV repetido a cada 25 cm
    const painel = new THREE.PlaneGeometry(L - 0.09, E1 - E0);
    const uv = painel.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ((L - 0.09) / 0.25), uv.getY(i) * ((E1 - E0) / 0.25));
    por(g, painel, toon(0xffffff, { mapa: painelPerfurado() }), 0, (E0 + E1) / 2, -fundo + 0.012);
    // as prateleiras (a de baixo é o fundo da estante) com a borda de latão
    const PRAT = [E0, 1.47, 1.79];
    for (const y of PRAT) {
      por(g, macia(L - 0.085, 0.03, EP - 0.01, 0.006), carvalho, 0, y + 0.015, zE);
      por(g, new THREE.BoxGeometry(L - 0.09, 0.012, 0.008), latao, 0, y + 0.024, zE + EP / 2 - 0.003);
    }
    // o filete de luz embaixo da estante e a poça quente na bancada
    por(g, new THREE.BoxGeometry(L - 0.2, 0.012, 0.02), toon(P.boutiqueLuz, { glow: 0.9 }), 0, E0 - 0.008, zE + 0.06);
    for (const x of [-0.6, 0.6]) {
      const poca = pocaDeLuz(0.62, P.luzDeAbajur, 0.32);
      poca.position.set(x, T + 0.004, ZB - 0.05);
      g.add(poca);
    }

    // OS POTES DE PIGMENTO, em arco-íris: as cores da cartela, na ordem dela
    const nPotes = 10;
    const espaco = (L - 0.2) / nPotes;
    const conteudo = new Lote(new THREE.CylinderGeometry(0.046, 0.046, 0.115, 14), toon(0xffffff));
    const tampas = new Lote(torneado([[0.001, 0.03], [0.04, 0.03], [0.05, 0.022], [0.05, 0.0], [0.001, 0.0]], 14), latao);
    const rotulos = new Lote(new THREE.BoxGeometry(0.062, 0.045, 0.004), toon(P.atelieCeramica));
    const vidro = new Lote(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 14, 1, true), toon(P.escadaVidro, { opacity: 0.35 }));
    const tintasDaEstante = TODAS_AS_TINTAS.filter((_, i) => i % 3 === 0).slice(0, nPotes * 2);
    for (const [k, t] of tintasDaEstante.entries()) {
      const prat = PRAT[k < nPotes ? 0 : 1] + 0.03;
      const x = -L / 2 + 0.1 + espaco * (0.5 + (k % nPotes));
      const z = zE + 0.02;
      conteudo.por(null, new THREE.Vector3(x, prat + 0.0575, z), q0, 1, t.cor);
      // o pescoço de vidro vazio, acima da tinta, antes da tampa
      vidro.por(null, new THREE.Vector3(x, prat + 0.13, z), q0, 1);
      tampas.por(null, new THREE.Vector3(x, prat + 0.145, z), q0, 1);
      rotulos.por(null, new THREE.Vector3(x, prat + 0.055, z + 0.047), q0, 1);
    }
    conteudo.montar(g);
    tampas.montar(g);
    rotulos.montar(g);
    vidro.montar(g);

    // a prateleira de cima: carretéis de linha e os rolos de tecido deitados
    const linha = new Lote(new THREE.CylinderGeometry(0.03, 0.03, 0.065, 12), toon(0xffffff));
    const bordas = new Lote(new THREE.CylinderGeometry(0.038, 0.038, 0.01, 12), toon(carvalho));
    const corDosCarreteis = [P.tintaCoral, P.tintaAmareloSol, P.tintaMenta, P.tintaAzulCeu, P.tintaLavanda, P.tintaRosaChiclete];
    const y3 = PRAT[2] + 0.03;
    corDosCarreteis.forEach((cor, k) => {
      const x = -L / 2 + 0.14 + k * 0.095;
      linha.por(null, new THREE.Vector3(x, y3 + 0.0425, zE + 0.03), q0, 1, cor);
      bordas.por(null, new THREE.Vector3(x, y3 + 0.005, zE + 0.03), q0, 1);
      bordas.por(null, new THREE.Vector3(x, y3 + 0.08, zE + 0.03), q0, 1);
    });
    linha.montar(g);
    bordas.montar(g);
    const corDosRolos = [P.tintaVerdeAgua, P.tintaLilas, P.tintaPessego];
    corDosRolos.forEach((cor, k) => {
      const rolo = new THREE.CylinderGeometry(0.05, 0.05, 0.42, 16);
      rolo.rotateZ(Math.PI / 2);
      const x = L / 2 - 0.36;
      // empilhados em pirâmide: dois embaixo e um em cima
      const y = y3 + 0.05 + (k === 2 ? 0.085 : 0);
      const z = zE + (k === 2 ? 0.0 : k === 0 ? -0.05 : 0.055);
      por(g, rolo, cor, x, y, z);
      // a ponta solta do pano, caindo um pouco pela frente do rolo
      if (k === 1) por(g, macia(0.16, 0.12, 0.006, 0.002), cor, x + 0.08, y - 0.05, z + 0.05);
    });

    // a plaquinha "Ateliê de Tinta", em pé no chapéu da estante
    const placa = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.165), toon(0xffffff, { mapa: texturaDaPlaca() }));
    placa.position.set(0, E1 + 0.045 + 0.0825 + 0.01, zE + 0.04);
    placa.rotation.x = -0.12;
    g.add(placa);
    por(g, macia(0.64, 0.185, 0.012, 0.004), P.boutiqueOuroEscuro, 0, E1 + 0.045 + 0.0825 + 0.01, zE + 0.033).rotation.x = -0.12;

    // ------------------------------------------------ as bandeirolas
    // o cordão vai de uma lateral da estante à outra, cedendo no meio, na
    // frente da prateleira de cima
    const zC = zE + EP / 2 + 0.03;
    const nB = 11;
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = -L / 2 + 0.06 + t * (L - 0.12);
      const y = E1 - 0.03 - Math.sin(t * Math.PI) * 0.11;
      this.pontosDoCordao.push(new THREE.Vector3(x, y, zC));
    }
    por(g, tubo(this.pontosDoCordao.map((p) => [p.x, p.y, p.z] as const), 0.004, 40, 5), P.atelieCordao);
    for (const sx of [-1, 1] as const) {
      por(g, new THREE.SphereGeometry(0.012, 8, 6), latao, sx * (L / 2 - 0.06), E1 - 0.03, zC);
    }
    this.bandeirolas = new THREE.InstancedMesh(geoBandeirola(), toon(0xffffff, { doubleSide: true }), nB);
    this.bandeirolas.name = 'bandeirolas';
    this.bandeirolas.frustumCulled = false;
    this.bandeirolas.userData.semSombra = true;
    const corDasBandeirolas = [
      P.tintaVermelhoCereja, P.tintaLaranja, P.tintaAmareloSol, P.tintaPistache, P.tintaVerdeAgua, P.tintaCeleste,
      P.tintaAzulRoyal, P.tintaVioleta, P.tintaOrquidea, P.tintaRosaChiclete, P.tintaCoral,
    ];
    corDasBandeirolas.forEach((cor, i) => this.bandeirolas.setColorAt(i, new THREE.Color(cor)));
    g.add(this.bandeirolas);
    this.posicionarBandeirolas(0);

    // ------------------------------------------------ em cima da bancada
    // A TINA DE COBRE, com a tinta girando e a pá encostada
    const xT = -0.62;
    const zT = -0.05;
    const tina = torneado([
      [0.001, 0.0], [0.15, 0.0], [0.175, 0.02], [0.19, 0.1], [0.19, 0.2], [0.2, 0.225],
      [0.185, 0.235], [0.172, 0.22], [0.172, 0.04], [0.001, 0.04],
    ], 28);
    por(g, tina, P.atelieCobre, xT, T, zT);
    // as duas faixas de cobre escuro e as alças
    for (const y of [0.06, 0.17]) {
      const faixa = new THREE.TorusGeometry(0.191, 0.006, 5, 32);
      faixa.rotateX(Math.PI / 2);
      por(g, faixa, P.atelieCobreEscuro, xT, T + y, zT);
    }
    for (const sx of [-1, 1] as const) {
      const alca = new THREE.TorusGeometry(0.04, 0.008, 6, 14, Math.PI);
      alca.rotateY(Math.PI / 2);
      por(g, alca, latao, xT + sx * 0.2, T + 0.16, zT);
    }
    // a tinta: um disco com o redemoinho, logo abaixo da borda (o que gira)
    const tinta = new THREE.Mesh(new THREE.CircleGeometry(0.17, 28), toon(0xffffff, { mapa: redemoinho() }));
    tinta.rotation.x = -Math.PI / 2;
    const giro = new THREE.Group();
    giro.name = 'tinta-da-tina';
    giro.position.set(xT, T + 0.205, zT);
    giro.add(tinta);
    g.add(giro);
    this.tinta = giro;
    // a pá de mexer, encostada na borda, com a ponta suja de tinta
    const pa = new THREE.Group();
    por(pa, macia(0.026, 0.42, 0.016, 0.006), carvalho, 0, 0.21, 0);
    por(pa, macia(0.06, 0.1, 0.012, 0.005), P.tintaMagenta, 0, 0.03, 0);
    pa.position.set(xT + 0.1, T + 0.1, zT + 0.05);
    pa.rotation.set(-0.25, 0, -0.42);
    g.add(pa);

    // os potinhos de amostra, abertos, na frente da tina
    const potinho = torneado([[0.001, 0], [0.03, 0], [0.034, 0.01], [0.034, 0.045], [0.03, 0.047], [0.029, 0.04], [0.001, 0.04]], 14);
    for (const [dx, dz, cor] of [[-0.38, 0.06, P.tintaAmareloSol], [-0.3, 0.1, P.tintaTurquesa], [-0.22, 0.06, P.tintaCoral]] as const) {
      por(g, potinho, P.atelieCeramica, xT + dx + 0.55, T, zT + dz);
      const sup = new THREE.CircleGeometry(0.029, 14);
      sup.rotateX(-Math.PI / 2);
      por(g, sup, cor, xT + dx + 0.55, T + 0.041, zT + dz);
    }

    // A CARTELA EM LEQUE: sete tiras (uma por família), presas no rebite
    const xL = 0.08;
    const zL = 0.0;
    const leque = toon(0xffffff, { mapa: cartelaDoLeque() });
    const nTiras = CARTELA_DE_TINTAS.length;
    CARTELA_DE_TINTAS.forEach((_, i) => {
      const geo = new THREE.BoxGeometry(0.05, 0.004, 0.22);
      // a borda da tira é o papel: o pixel branco do alto da coluna dela
      uvSoNaTampa(geo, i / nTiras, (i + 1) / nTiras, [(i + 0.02) / nTiras, 0.995]);
      const tira = new THREE.Mesh(geo, leque);
      // a tira gira em volta do rebite, que fica na ponta de baixo dela
      const pivo = new THREE.Group();
      pivo.position.set(xL, T + 0.003 + i * 0.0045, zL + 0.08);
      pivo.rotation.y = -0.75 + i * 0.25;
      tira.position.z = -0.095;
      tira.geometry.rotateY(Math.PI);
      pivo.add(tira);
      g.add(pivo);
    });
    por(g, new THREE.CylinderGeometry(0.009, 0.009, 0.04, 10), latao, xL, T + 0.018, zL + 0.08);

    // o caderno de receitas, aberto
    const capa = macia(0.36, 0.012, 0.23, 0.004);
    const caderno = new THREE.Group();
    por(caderno, capa, P.boutiqueVinho, 0, 0.006, 0);
    // um material só: a borda das folhas é o papel do canto da textura
    const geoPaginas = new THREE.BoxGeometry(0.34, 0.008, 0.21);
    uvSoNaTampa(geoPaginas, 0, 1, [0.004, 0.996]);
    const paginas = new THREE.Mesh(geoPaginas, toon(0xffffff, { mapa: paginasDoCaderno() }));
    paginas.position.y = 0.016;
    caderno.add(paginas);
    // a fitinha de marcar página, saindo por baixo
    por(caderno, new THREE.BoxGeometry(0.012, 0.002, 0.06), P.boutiqueFita, 0.02, 0.003, 0.135);
    caderno.position.set(-0.22, T, 0.02);
    caderno.rotation.y = 0.22;
    g.add(caderno);

    // a caneca de pincéis
    const xC = 0.48;
    const zC2 = -0.1;
    por(g, torneado([[0.001, 0], [0.05, 0], [0.056, 0.01], [0.056, 0.12], [0.06, 0.13], [0.052, 0.13], [0.05, 0.02], [0.001, 0.02]], 18), P.atelieCeramica, xC, T, zC2);
    const asa = new THREE.TorusGeometry(0.03, 0.008, 6, 12, Math.PI);
    asa.rotateZ(-Math.PI / 2);
    por(g, asa, P.atelieCeramica, xC + 0.058, T + 0.065, zC2);
    // uma faixa de tinta escorrida na caneca
    por(g, new THREE.CylinderGeometry(0.0575, 0.0575, 0.012, 18, 1, true), P.tintaVerdeAgua, xC, T + 0.095, zC2);
    const pontaDosPinceis = [P.tintaAzulRoyal, P.tintaAmareloSol, P.tintaRosaChiclete, P.atelieCerda];
    pontaDosPinceis.forEach((ponta, k) => {
      const p = new THREE.Group();
      por(p, new THREE.CylinderGeometry(0.006, 0.009, 0.2, 8), k % 2 ? P.boutiqueVinho : carvalho, 0, 0.1, 0);
      por(p, new THREE.CylinderGeometry(0.009, 0.009, 0.03, 8), P.boutiquePrata, 0, 0.215, 0);
      por(p, torneado([[0.009, 0], [0.011, 0.02], [0.006, 0.045], [0.001, 0.05]], 8), ponta, 0, 0.23, 0);
      const a = (k / pontaDosPinceis.length) * Math.PI * 2;
      p.position.set(xC + Math.cos(a) * 0.02, T + 0.015, zC2 + Math.sin(a) * 0.02);
      p.rotation.set(Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22);
      g.add(p);
    });

    // a pilha de tecidos já tingidos, dobrados
    const xP = 0.9;
    const pano = [P.tintaRosaBebe, P.tintaAmareloSol, P.tintaMenta, P.tintaLavanda, P.tintaCoral];
    pano.forEach((cor, k) => {
      const dobra = por(g, macia(0.3, 0.04, 0.24, 0.016), cor, xP + (k % 2 ? 0.01 : -0.008), T + 0.02 + k * 0.041, -0.05 + (k % 3) * 0.006);
      dobra.rotation.y = (k % 2 ? 1 : -1) * 0.05;
    });

    // ------------------------------------------------ o balde no chão
    const { balde } = BALCAO_DE_TINGIMENTO;
    por(g, torneado([[0.001, 0], [0.12, 0], [0.125, 0.01], [0.145, 0.25], [0.155, 0.255], [0.14, 0.26], [0.13, 0.03], [0.001, 0.03]], 22), P.atelieZinco, balde.x, 0, balde.z);
    for (const y of [0.06, 0.2]) {
      const aro = new THREE.TorusGeometry(0.128 + y * 0.08, 0.005, 5, 26);
      aro.rotateX(Math.PI / 2);
      por(g, aro, P.boutiquePrata, balde.x, y, balde.z);
    }
    const supBalde = new THREE.CircleGeometry(0.135, 22);
    supBalde.rotateX(-Math.PI / 2);
    por(g, supBalde, P.tintaCeleste, balde.x, 0.235, balde.z);
    // a alça de arame e a tinta que escorreu pela borda até o chão
    const arame = new THREE.TorusGeometry(0.15, 0.005, 5, 20, Math.PI);
    arame.rotateY(0.6);
    por(g, arame, P.boutiquePrata, balde.x, 0.255, balde.z);
    por(g, macia(0.03, 0.12, 0.012, 0.006), P.tintaCeleste, balde.x + 0.07, 0.19, balde.z + 0.128).rotation.x = -0.08;
    const pinguinho = new THREE.CircleGeometry(0.07, 18);
    pinguinho.rotateX(-Math.PI / 2);
    pinguinho.scale(1.3, 1, 0.8);
    por(g, pinguinho, P.tintaCeleste, balde.x + 0.09, 0.004, balde.z + 0.2);

    acabar(g, [[carvalho, veioDeMadeira()]]);
    juntarPorCor(g);
  }

  /** As bandeirolas penduradas no cordão, balançando com o tempo `t`. */
  private posicionarBandeirolas(t: number): void {
    const n = this.bandeirolas.count;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const um = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < n; i++) {
      const k = (i + 0.5) / n;
      const p = this.pontosDoCordao[Math.round(k * (this.pontosDoCordao.length - 1))];
      // cada uma no seu tempo: uma brisa que passa de ponta a ponta
      e.set(Math.sin(t * 1.4 + i * 0.7) * 0.12, 0, Math.sin(t * 0.9 + i) * 0.04);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(p.x, p.y - 0.004, p.z), q, um);
      this.bandeirolas.setMatrixAt(i, m);
    }
    this.bandeirolas.instanceMatrix.needsUpdate = true;
  }

  update(dt: number): void {
    this.tempo += dt;
    this.tinta.rotation.y -= dt * 0.35;
    this.posicionarBandeirolas(this.tempo);
  }
}
