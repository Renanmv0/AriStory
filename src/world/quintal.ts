import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { quina } from './lojaDeRoupas';
import { uvEmMetrosPorTriangulo } from './acabamento';
import { veioDeMadeira } from './texturasDeCasa';
import { novaTextura } from './texturasDeChao';

/**
 * AS PEÇAS DO QUINTAL DECORADO (`docs/QUINTAL.md`) que não são enfeite: a
 * CAIXA DA ENCOMENDA do Papita Delivery, que espera no portão, e o PAINEL DE
 * FERRAMENTAS da garagem, por onde se decora. Contrato do kit: base em
 * `y = 0` (o painel: as costas em `z = 0`, encostadas na parede), frente
 * para `+Z`, sem colisor.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** a etiqueta do Papita Delivery: a batatinha sorrindo e o nome, em canvas */
function etiquetaDoPapita(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = css(P.papitaAmarelo);
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 152, 18);
    ctx.fill();
    ctx.strokeStyle = css(P.papitaVerde);
    ctx.lineWidth = 6;
    ctx.stroke();
    // a batatinha: um ovo torto marrom, com pintinhas, olhos e sorriso
    ctx.fillStyle = '#c99358';
    ctx.beginPath();
    ctx.ellipse(66, 74, 40, 50, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a8763f';
    for (const [x, y] of [[50, 50], [84, 98], [44, 100], [88, 58]]) {
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#3a2614';
    for (const x of [54, 76]) {
      ctx.beginPath();
      ctx.arc(x, 70, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#3a2614';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(65, 82, 11, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.fillStyle = '#ff9aa8';
    for (const x of [44, 86]) {
      ctx.beginPath();
      ctx.ellipse(x, 84, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // o nome
    ctx.fillStyle = css(P.papitaVerde);
    ctx.font = '900 40px "Nunito", ui-rounded, system-ui, sans-serif';
    ctx.fillText('Papita', 116, 72);
    ctx.fillStyle = '#5a3d0c';
    ctx.font = '800 26px "Nunito", ui-rounded, system-ui, sans-serif';
    ctx.fillText('Delivery', 118, 108);
  }
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

let etiquetaPronta: THREE.CanvasTexture | null = null;

/**
 * A CAIXA DA ENCOMENDA: papelão de quina macia, as abas fechadas com a fita
 * adesiva por cima (uma faixa no comprimento, descendo pelas pontas), e a
 * etiqueta do Papita no lado da câmera. `tamanho` cresce com o pedido.
 */
export function caixaDeEncomenda(tamanho = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caixa-da-encomenda';
  const L = 0.62 * tamanho;
  const A = 0.4 * tamanho;
  const F = 0.46 * tamanho;
  const papelao = toon(P.papelao);
  const corpo = new THREE.Mesh(quina(L, A, F, 0.018), papelao);
  corpo.position.y = A / 2;
  g.add(corpo);
  // a junta das duas abas: um friso escuro no meio da tampa, um fio acima
  const junta = new THREE.Mesh(new THREE.BoxGeometry(L - 0.04, 0.004, 0.012), toon(P.papelaoEscuro));
  junta.position.set(0, A + 0.002, 0);
  g.add(junta);
  // a fita: por cima da junta e descendo pelas duas pontas
  const fita = toon(P.fitaAdesiva);
  const cima = new THREE.Mesh(new THREE.BoxGeometry(L + 0.008, 0.006, 0.08), fita);
  cima.position.set(0, A + 0.005, 0);
  g.add(cima);
  for (const lado of [-1, 1]) {
    const desce = new THREE.Mesh(new THREE.BoxGeometry(0.006, A * 0.42, 0.08), fita);
    desce.position.set(lado * (L / 2 + 0.003), A - A * 0.21, 0);
    g.add(desce);
  }
  // a etiqueta do Papita, colada na frente (+Z) e no lado de +X
  etiquetaPronta ??= etiquetaDoPapita();
  const etiqueta = toon(0xffffff, { mapa: etiquetaPronta });
  const frente = new THREE.Mesh(new THREE.PlaneGeometry(0.3 * tamanho, 0.19 * tamanho), etiqueta);
  frente.position.set(-L * 0.12, A * 0.52, F / 2 + 0.003);
  g.add(frente);
  const lado = new THREE.Mesh(new THREE.PlaneGeometry(0.22 * tamanho, 0.14 * tamanho), etiqueta);
  lado.rotation.y = Math.PI / 2;
  lado.position.set(L / 2 + 0.003, A * 0.45, 0.06);
  g.add(lado);
  // a setinha "este lado para cima", pintada no papelão
  const seta = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.05, 3), toon(P.papelaoEscuro));
  seta.rotation.z = Math.PI / 2;
  seta.rotation.x = Math.PI / 2;
  seta.scale.z = 0.1;
  seta.position.set(L * 0.3, A * 0.66, F / 2 + 0.003);
  g.add(seta);
  return g;
}

/** o painel de furinhos (eucatex): os furos em grade, numa textura de canvas */
function furinhos(): THREE.CanvasTexture {
  return novaTextura('painel-de-furinhos', 0.2, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = 'rgba(90, 64, 30, 0.55)';
    const n = 4;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        ctx.beginPath();
        ctx.arc((i + 0.5) * (s / n), (j + 0.5) * (s / n), s * 0.035, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

/** um cabo de madeira da ferramenta, em pé, com o gancho em cima */
function cabo(comprimento: number, raio = 0.016): THREE.Mesh {
  const m = new THREE.Mesh(uvEmMetrosPorTriangulo(new THREE.CylinderGeometry(raio, raio, comprimento, 8)), toon(P.ferramentaCabo, { mapa: veioDeMadeira() }));
  m.position.y = -comprimento / 2;
  return m;
}

/** A pá: o cabo, o punho em T e a lâmina curva de metal. */
function pa(): THREE.Group {
  const g = new THREE.Group();
  const metal = toon(P.ferramentaMetal);
  g.add(cabo(0.62));
  const punho = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.12, 8), toon(P.ferramentaCabo));
  punho.rotation.z = Math.PI / 2;
  punho.position.y = 0.02;
  g.add(punho);
  // a lâmina: um pedaço de cilindro aberto (curva de pá), afinando na ponta
  const forma = new THREE.Shape();
  forma.moveTo(-0.08, 0);
  forma.lineTo(0.08, 0);
  forma.quadraticCurveTo(0.09, -0.16, 0, -0.24);
  forma.quadraticCurveTo(-0.09, -0.16, -0.08, 0);
  const lamina = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 1, curveSegments: 8 }), metal);
  lamina.position.set(0, -0.6, -0.004);
  g.add(lamina);
  const gola = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.05, 8), metal);
  gola.position.y = -0.6;
  g.add(gola);
  return g;
}

/** O ancinho: o cabo, a barra e os dentes curvos. */
function ancinho(): THREE.Group {
  const g = new THREE.Group();
  const metal = toon(P.ferramentaMetal);
  g.add(cabo(0.72));
  const barra = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.022), metal);
  barra.position.y = -0.73;
  g.add(barra);
  for (let i = 0; i < 9; i++) {
    const dente = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.004, 0.07, 5), metal);
    dente.position.set(-0.135 + i * 0.034, -0.77, 0.008);
    dente.rotation.x = 0.35;
    g.add(dente);
  }
  return g;
}

/** A tesoura de poda: duas lâminas de metal e os cabos verdes, abertinha. */
function tesoura(): THREE.Group {
  const g = new THREE.Group();
  for (const lado of [-1, 1]) {
    const braco = new THREE.Group();
    braco.rotation.z = lado * 0.16;
    const lamina = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.016, 0.1, 6), toon(P.ferramentaMetal));
    lamina.scale.z = 0.35;
    lamina.position.y = 0.05;
    const empunhadura = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.14, 4, 8), toon(P.ferramentaVerde));
    empunhadura.position.y = -0.1;
    braco.add(lamina, empunhadura);
    g.add(braco);
  }
  const pino = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 10), toon(P.metalGrey));
  pino.rotation.x = Math.PI / 2;
  g.add(pino);
  return g;
}

/** A pazinha de mão, de cabo verde. */
function pazinha(): THREE.Group {
  const g = new THREE.Group();
  const empunhadura = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.1, 4, 8), toon(P.ferramentaVerde));
  empunhadura.position.y = -0.07;
  g.add(empunhadura);
  const forma = new THREE.Shape();
  forma.moveTo(-0.045, 0);
  forma.lineTo(0.045, 0);
  forma.quadraticCurveTo(0.05, -0.1, 0, -0.15);
  forma.quadraticCurveTo(-0.05, -0.1, -0.045, 0);
  const lamina = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: 0.006, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 1, curveSegments: 8 }), toon(P.ferramentaMetal));
  lamina.position.set(0, -0.14, -0.003);
  g.add(lamina);
  return g;
}

/** um gancho do painel: o fio de metal que sai dos furos e segura a ferramenta */
function gancho(): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.004, 4, 10, Math.PI), toon(P.metalGrey));
  m.rotation.y = Math.PI / 2;
  m.position.z = 0.02;
  return m;
}

/**
 * O PAINEL DE FERRAMENTAS DE JARDIM, na parede do fundo da garagem: a placa de
 * furinhos com moldura de madeira, a pá, o ancinho, a tesoura de poda e a
 * pazinha penduradas nos ganchos, e embaixo a prateleira com o regador, os
 * vasinhos de barro empilhados e o rolo de barbante. É a porta do baú do
 * quintal ("pelas ferramentas na garagem", o Renan).
 */
export function painelDeFerramentas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'painel-de-ferramentas';
  const LARG = 1.3;
  const ALT = 0.95;
  const BASE = 0.95;
  const madeira = toon(P.ferramentaCabo, { mapa: veioDeMadeira() });
  // a placa de furinhos (UV em metros, a grade em canvas) e a moldura
  const placa = new THREE.Mesh(uvEmMetrosPorTriangulo(new THREE.BoxGeometry(LARG, ALT, 0.015)), toon(P.painelDeFuros, { mapa: furinhos() }));
  placa.position.set(0, BASE + ALT / 2, 0.012);
  g.add(placa);
  for (const [l, a, x, y] of [
    [LARG + 0.06, 0.04, 0, BASE + ALT + 0.01], [LARG + 0.06, 0.04, 0, BASE - 0.01],
    [0.04, ALT, -LARG / 2 - 0.01, BASE + ALT / 2], [0.04, ALT, LARG / 2 + 0.01, BASE + ALT / 2],
  ] as const) {
    const m = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(l, a, 0.035, 0.008)), madeira);
    m.position.set(x, y, 0.02);
    g.add(m);
  }
  // as ferramentas, cada uma no seu gancho
  const pendurar = (peca: THREE.Object3D, x: number, y: number, giro = 0): void => {
    const gch = gancho();
    gch.position.set(x, y + 0.01, 0.02);
    g.add(gch);
    peca.position.set(x, y, 0.045);
    peca.rotation.z = giro;
    g.add(peca);
  };
  pendurar(pa(), -0.45, BASE + ALT - 0.06);
  pendurar(ancinho(), -0.15, BASE + ALT - 0.06);
  pendurar(tesoura(), 0.17, BASE + ALT - 0.2, 0.1);
  pendurar(pazinha(), 0.42, BASE + ALT - 0.14);
  // a prateleira de baixo, nas mãos-francesas
  const prateleira = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(LARG, 0.03, 0.3, 0.008)), madeira);
  prateleira.position.set(0, BASE - 0.12, 0.16);
  g.add(prateleira);
  for (const lado of [-1, 1]) {
    const mao = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.2, 0.025), toon(P.metalGrey));
    mao.position.set(lado * (LARG / 2 - 0.12), BASE - 0.22, 0.02);
    const braco = new THREE.Mesh(new THREE.BoxGeometry(0.019, 0.025, 0.24), toon(P.metalGrey));
    braco.position.set(lado * (LARG / 2 - 0.12), BASE - 0.15, 0.13);
    g.add(mao, braco);
  }
  const yP = BASE - 0.105;
  // o regador de lata: o corpo torneado, o bico comprido e a alça
  const lata = toon(P.ferramentaVerde);
  const corpo = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.001, 0), new THREE.Vector2(0.09, 0), new THREE.Vector2(0.095, 0.02),
    new THREE.Vector2(0.09, 0.17), new THREE.Vector2(0.06, 0.2), new THREE.Vector2(0.001, 0.2),
  ], 20), lata);
  corpo.position.set(-0.38, yP, 0.16);
  g.add(corpo);
  const bico = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.28, 8), lata);
  bico.position.set(-0.38 + 0.17, yP + 0.14, 0.16);
  bico.rotation.z = -0.95;
  g.add(bico);
  const crivo = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.016, 0.03, 10), toon(P.ferramentaMetal));
  crivo.position.set(-0.38 + 0.285, yP + 0.215, 0.16);
  crivo.rotation.z = -0.95;
  g.add(crivo);
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.009, 5, 14, Math.PI), lata);
  alca.position.set(-0.4, yP + 0.2, 0.16);
  g.add(alca);
  // os vasinhos de barro empilhados (um torno só, repetido)
  const perfil = [
    new THREE.Vector2(0.001, 0), new THREE.Vector2(0.05, 0), new THREE.Vector2(0.065, 0.08),
    new THREE.Vector2(0.074, 0.083), new THREE.Vector2(0.074, 0.1), new THREE.Vector2(0.066, 0.1), new THREE.Vector2(0.06, 0.012), new THREE.Vector2(0.001, 0.012),
  ];
  const barro = toon(P.plantPot);
  for (let i = 0; i < 3; i++) {
    const vaso = new THREE.Mesh(new THREE.LatheGeometry(perfil, 18), barro);
    vaso.position.set(0.05, yP + i * 0.035, 0.16);
    g.add(vaso);
  }
  const vasoDeLado = new THREE.Mesh(new THREE.LatheGeometry(perfil, 18), barro);
  vasoDeLado.position.set(0.25, yP + 0.075, 0.16);
  vasoDeLado.rotation.z = Math.PI / 2;
  g.add(vasoDeLado);
  // o rolo de barbante
  const rolo = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 14), toon(P.fitaAdesiva));
  rolo.position.set(0.47, yP + 0.04, 0.16);
  g.add(rolo);
  return g;
}
