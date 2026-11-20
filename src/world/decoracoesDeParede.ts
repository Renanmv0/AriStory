import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { quina } from './lojaDeRoupas';
import { uvEmMetrosPorTriangulo } from './acabamento';
import { veioDeMadeira } from './texturasDeCasa';
import { reboco } from './texturasDeFachada';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { sorteio } from './texturasDeChao';

/**
 * AS PEÇAS QUE NÃO VÃO NO CHÃO (`docs/QUINTAL.md` §3, etapa 3): na PAREDE, EM
 * CIMA do muro, PENDURADAS na viga e no beiral, e de PONTA A PONTA. O contrato
 * de cada encaixe está na ficha (`FichaDeDecoracao.encaixe`, em
 * `world/decoracoes.ts`):
 *
 * - parede: costas em `z = 0`, frente `+Z`, o MEIO da peça em `y = 0`;
 * - em cima: base em `y = 0` (como no chão), pequena — o tampo do muro tem
 *   22 cm;
 * - pendurado: a origem é o GANCHO, e a peça desce para `−Y`;
 * - ponta a ponta: `entre(a, b)` monta no mundo, pela catenária entre as duas.
 *
 * Luz é pintada (halo e leque), como manda a skill de cenário: nenhuma luz de
 * verdade.
 */

const V = THREE.Vector3;

/** a samambaia: folhas compridas e arqueadas, caindo para os lados (um lote só) */
function samambaia(n: number, comprido: number, semente: number, pendente = false): THREE.InstancedMesh {
  const rnd = sorteio(semente);
  // a folha: uma fita estreita com o contorno em dentinhos (os folíolos)
  const forma = new THREE.Shape();
  forma.moveTo(0, 0);
  const passos = 9;
  for (let i = 1; i <= passos; i++) {
    const t = i / passos;
    const largura = 0.05 * Math.sin(Math.PI * t) * (i % 2 ? 1 : 0.6);
    forma.lineTo(largura, t * comprido);
  }
  for (let i = passos; i >= 0; i--) {
    const t = i / passos;
    const largura = 0.05 * Math.sin(Math.PI * t) * (i % 2 ? 1 : 0.6);
    forma.lineTo(-largura, t * comprido);
  }
  const geo = new THREE.ShapeGeometry(forma);
  // arqueia a fita: sobe e cai para fora (a ponta pende)
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = y / comprido;
    pos.setXYZ(i, pos.getX(i), Math.sin(t * Math.PI * 0.6) * comprido * 0.45 - (pendente ? t * t * comprido * 0.5 : 0), t * comprido * 0.75);
  }
  geo.computeVertexNormals();
  const lote = new THREE.InstancedMesh(geo, toon(P.samambaia, { doubleSide: true }), n);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  for (let i = 0; i < n; i++) {
    const giro = (i / n) * Math.PI * 2 + rnd() * 0.4;
    q.setFromEuler(new THREE.Euler(-0.1 - rnd() * 0.4, giro, 0, 'YXZ'));
    const s = 0.8 + rnd() * 0.35;
    m.compose(new V(0, 0, 0), q, new V(s, s, s));
    lote.setMatrixAt(i, m);
  }
  lote.castShadow = true;
  return lote;
}

// =============================================================== na parede

/** A ARANDELA: a chapa de parede, o braço de ferro e a lanterna de vidro acesa, com o leque de luz na parede. */
export function arandela(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-arandela';
  const ferro = toon(P.casaGrafite);
  const chapa = new THREE.Mesh(quina(0.12, 0.2, 0.025, 0.008), ferro);
  chapa.position.set(0, -0.02, 0.0125);
  g.add(chapa);
  const braco = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 6, 12, Math.PI / 2), ferro);
  braco.rotation.y = Math.PI / 2;
  braco.position.set(0, 0.0, 0.03);
  g.add(braco);
  // a lanterna: telhadinho, quatro montantes, o vidro aceso e a base
  const lanterna = new THREE.Group();
  lanterna.position.set(0, -0.03, 0.14);
  const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, 0.09), toon(P.enfeiteLanternaLuz, { glow: 0.85 }));
  lanterna.add(vidro);
  for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.14, 0.012), ferro);
    m.position.set(x * 0.047, 0, z * 0.047);
    lanterna.add(m);
  }
  const telhado = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.06, 4), ferro);
  telhado.rotation.y = Math.PI / 4;
  telhado.position.y = 0.1;
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.018, 0.11), ferro);
  base.position.y = -0.075;
  lanterna.add(telhado, base);
  g.add(lanterna);
  const halo = haloDeLampada(0.55);
  halo.position.set(0, -0.03, 0.14);
  g.add(halo);
  // o leque morno que a lanterna joga na parede, em volta dela
  const leque = pocaDeLuz(0.45, P.luzDeAbajur, 0.35, true);
  leque.position.set(0, -0.05, 0.004);
  g.add(leque);
  return g;
}

/** O VASO DE PAREDE: meio vaso de barro preso na parede, com a samambaia caindo. */
export function vasoDeParede(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-vaso-de-parede';
  // meio torno (só a metade da frente), as costas retas na parede
  const perfil = [
    new THREE.Vector2(0.001, -0.12), new THREE.Vector2(0.09, -0.12), new THREE.Vector2(0.13, 0.04),
    new THREE.Vector2(0.145, 0.05), new THREE.Vector2(0.145, 0.075), new THREE.Vector2(0.13, 0.075), new THREE.Vector2(0.001, 0.04),
  ];
  const vaso = new THREE.Mesh(new THREE.LatheGeometry(perfil, 16, -Math.PI / 2, Math.PI), toon(P.plantPot, { doubleSide: true }));
  g.add(vaso);
  const costas = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.2), toon(P.plantPot));
  costas.position.set(0, -0.02, 0.002);
  g.add(costas);
  const terra = new THREE.Mesh(new THREE.CircleGeometry(0.125, 16, 0, Math.PI), toon(P.terraDeCanteiro));
  terra.rotation.x = -Math.PI / 2;
  terra.rotation.z = Math.PI;
  terra.position.y = 0.05;
  g.add(terra);
  const folhas = samambaia(14, 0.42, 515, true);
  folhas.position.set(0, 0.05, 0.06);
  g.add(folhas);
  return g;
}

/** A CASINHA DE PASSARINHO: de madeira pintada, telhadinho de duas águas, o furo redondo e o poleiro. */
export function casinhaDePassarinho(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-casinha-de-passarinho';
  const pintura = toon(P.casinhaDePassaro);
  const caixa = new THREE.Mesh(quina(0.2, 0.22, 0.18, 0.012), pintura);
  caixa.position.set(0, -0.03, 0.09);
  g.add(caixa);
  // o telhado: duas abas de madeira com veio
  const madeira = toon(P.quintalMadeira, { mapa: veioDeMadeira() });
  for (const lado of [-1, 1]) {
    const aba = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(0.16, 0.02, 0.22, 0.006)), madeira);
    aba.position.set(lado * 0.06, 0.12, 0.09);
    aba.rotation.z = -lado * 0.6;
    g.add(aba);
  }
  // o oitão: o triângulo da frente, na cor da casinha
  const oitao = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.08, 3, 1), pintura);
  oitao.scale.z = 0.8;
  oitao.position.set(0, 0.115, 0.09);
  oitao.rotation.y = Math.PI;
  g.add(oitao);
  // o furo, a borda dele e o poleiro
  const furo = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), toon(P.deckDoQuintalVao));
  furo.position.set(0, 0.0, 0.182);
  g.add(furo);
  const borda = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.007, 6, 18), toon(P.casaBranco));
  borda.position.set(0, 0, 0.182);
  g.add(borda);
  const poleiro = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.07, 6), madeira);
  poleiro.rotation.x = Math.PI / 2;
  poleiro.position.set(0, -0.07, 0.215);
  g.add(poleiro);
  // um coraçãozinho pintado em cima do furo
  const coracao = new THREE.Shape();
  coracao.moveTo(0, -0.012);
  coracao.bezierCurveTo(0.02, 0.0, 0.016, 0.02, 0, 0.008);
  coracao.bezierCurveTo(-0.016, 0.02, -0.02, 0.0, 0, -0.012);
  const c = new THREE.Mesh(new THREE.ShapeGeometry(coracao), toon(P.flowerPink));
  c.position.set(0, 0.06, 0.1815);
  g.add(c);
  return g;
}

/** O ESPELHO DE JARDIM: em arco, de moldura de ferro com voluta em cima, refletindo o céu. */
export function espelhoDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-espelho';
  const L = 0.5;
  const A = 0.8;
  const arco = (l: number, a: number): THREE.Shape => {
    const s = new THREE.Shape();
    s.moveTo(-l / 2, -a / 2);
    s.lineTo(l / 2, -a / 2);
    s.lineTo(l / 2, a / 2 - l / 2);
    s.absarc(0, a / 2 - l / 2, l / 2, 0, Math.PI, false);
    s.lineTo(-l / 2, -a / 2);
    return s;
  };
  const vidro = new THREE.Mesh(new THREE.ShapeGeometry(arco(L, A), 16), toon(P.espelhoDeJardim, { glow: 0.25 }));
  vidro.position.z = 0.02;
  g.add(vidro);
  // o reflexo: duas faixas claras em diagonal
  for (const [x, l] of [[-0.08, 0.05], [0.04, 0.025]] as const) {
    const brilho = new THREE.Mesh(new THREE.PlaneGeometry(l, A * 0.7), toon(P.casaBranco, { opacity: 0.45 }));
    brilho.rotation.z = -0.5;
    brilho.position.set(x, 0, 0.022);
    g.add(brilho);
  }
  // a moldura: um tubo pelo contorno do arco
  const pts = arco(L + 0.04, A + 0.04).getPoints(24).map((p) => new V(p.x, p.y, 0.025));
  const moldura = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.05), 96, 0.018, 6, true), toon(P.quintalFerro));
  g.add(moldura);
  // a voluta no alto do arco
  const volta: THREE.Vector3[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const a = t * Math.PI * 2.2;
    const r = 0.05 * (1 - t * 0.7);
    volta.push(new V(Math.sin(a) * r, A / 2 + 0.07 + Math.cos(a) * r, 0.025));
  }
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(volta), 24, 0.008, 5, false), toon(P.quintalFerro)));
  return g;
}

/** A TRELIÇA COM TREPADEIRA: ripas em losango e a trepadeira subindo com florzinhas (um lote de folhas e um de flores). */
export function trelicaComTrepadeira(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-trelica';
  const L = 0.7;
  const A = 1.5;
  const madeira = toon(P.casaBranco, { mapa: veioDeMadeira() });
  // as ripas em X: cada linha diagonal recortada pelo quadro (as de um sentido na frente das do outro)
  const ripaEntre = (x0: number, y0: number, x1: number, y1: number, z: number, giro: number): void => {
    const comp = Math.hypot(x1 - x0, y1 - y0);
    if (comp < 0.05) return;
    const ripa = new THREE.Mesh(uvEmMetrosPorTriangulo(new THREE.BoxGeometry(0.025, comp, 0.012)), madeira);
    ripa.position.set((x0 + x1) / 2, (y0 + y1) / 2, z);
    ripa.rotation.z = giro;
    g.add(ripa);
  };
  const hx = L / 2 - 0.02;
  const hy = A / 2 - 0.02;
  for (let c = -A; c <= A; c += 0.24) {
    // y = x + c (sobe para a direita) e y = −x + c (sobe para a esquerda), dentro do quadro
    for (const s of [1, -1]) {
      const xa = Math.max(-hx, s > 0 ? -hy - c : c - hy);
      const xb = Math.min(hx, s > 0 ? hy - c : c + hy);
      const lo = Math.min(xa, xb);
      const hi = Math.max(xa, xb);
      const x0 = Math.max(-hx, lo);
      const x1 = Math.min(hx, hi);
      if (x1 <= x0) continue;
      const y0 = s * x0 + c;
      const y1 = s * x1 + c;
      if (Math.max(y0, y1) < -hy || Math.min(y0, y1) > hy) continue;
      ripaEntre(x0, y0, x1, y1, s > 0 ? 0.02 : 0.034, -s * Math.PI / 4);
    }
  }
  for (const [l, a, x, y] of [[L, 0.035, 0, A / 2], [L, 0.035, 0, -A / 2], [0.035, A, L / 2, 0], [0.035, A, -L / 2, 0]] as const) {
    const m = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(l, a, 0.03, 0.006)), madeira);
    m.position.set(x, y, 0.027);
    g.add(m);
  }
  // a trepadeira: folhinhas e flores espalhadas subindo, mais cheia embaixo
  const rnd = sorteio(1717);
  const folha = new THREE.SphereGeometry(0.035, 6, 4).scale(1, 0.5, 0.35);
  const folhas = new THREE.InstancedMesh(folha, toon(P.heraMedia), 70);
  const flores = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 6, 4), toon(P.flowerPink), 22);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  let nf = 0;
  for (let i = 0; i < 70; i++) {
    const y = -A / 2 + Math.pow(rnd(), 1.4) * A;
    const x = (rnd() - 0.5) * L * (0.95 - (y + A / 2) / A * 0.35);
    q.setFromEuler(new THREE.Euler(0, 0, rnd() * 6.28));
    m.compose(new V(x, y, 0.05), q, new V(1, 1, 1));
    folhas.setMatrixAt(i, m);
    if (i % 3 === 0 && nf < 22) {
      m.makeTranslation(x + 0.02, y + 0.02, 0.065);
      flores.setMatrixAt(nf++, m);
    }
  }
  flores.count = nf;
  g.add(folhas, flores);
  return g;
}

// ================================================================ em cima

/** O VASINHO DE SUCULENTAS: vaso de cimento baixo com três rosetas. */
export function vasinhoDeSuculentas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-suculentas';
  const vaso = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.001, 0), new THREE.Vector2(0.07, 0), new THREE.Vector2(0.09, 0.07),
    new THREE.Vector2(0.095, 0.08), new THREE.Vector2(0.085, 0.08), new THREE.Vector2(0.08, 0.06), new THREE.Vector2(0.001, 0.06),
  ], 16), toon(P.vasoDeCimento, { mapa: reboco(0.4) }));
  g.add(vaso);
  // cada roseta: pétalas grossas em espiral (um lote por roseta, cada uma de um verde)
  const tons = [P.suculenta, P.agaveBorda, P.suculentaRosada];
  for (const [k, [x, z]] of ([[-0.035, 0.01], [0.035, -0.02], [0.01, 0.04]] as const).entries()) {
    const n = 12;
    const petala = new THREE.SphereGeometry(0.022, 6, 4).scale(0.6, 0.35, 1.2).translate(0, 0, 0.018);
    const lote = new THREE.InstancedMesh(petala, toon(tons[k]), n);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    for (let i = 0; i < n; i++) {
      const a = i * 2.4;
      const sobe = 0.3 + (i / n) * 0.8;
      q.setFromEuler(new THREE.Euler(-sobe, a, 0, 'YXZ'));
      const s = 1 - (i / n) * 0.45;
      m.compose(new V(x, 0.075 + (i / n) * 0.012, z), q, new V(s, s, s));
      lote.setMatrixAt(i, m);
    }
    g.add(lote);
  }
  return g;
}

/** O GATINHO DE CERÂMICA: sentado, de rabo enrolado nas patas, cinza com o peito branco. */
export function gatinhoDeCeramica(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-gatinho';
  const pelo = toon(P.gatinhoDeCeramica);
  const branco = toon(P.casaBranco);
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), pelo);
  corpo.scale.set(1, 1.25, 0.95);
  corpo.position.y = 0.09;
  g.add(corpo);
  const peito = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), branco);
  peito.scale.set(1, 1.3, 0.6);
  peito.position.set(0, 0.1, 0.05);
  g.add(peito);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 10), pelo);
  cabeca.position.set(0, 0.21, 0.01);
  g.add(cabeca);
  for (const lado of [-1, 1]) {
    const orelha = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.05, 4), pelo);
    orelha.position.set(lado * 0.035, 0.27, 0.0);
    orelha.rotation.z = -lado * 0.25;
    g.add(orelha);
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 5), toon(P.deckDoQuintalVao));
    olho.position.set(lado * 0.022, 0.22, 0.066);
    g.add(olho);
    const pata = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), branco);
    pata.scale.set(1, 0.7, 1.3);
    pata.position.set(lado * 0.03, 0.015, 0.06);
    g.add(pata);
  }
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 5), toon(P.flowerPink));
  focinho.position.set(0, 0.205, 0.072);
  g.add(focinho);
  // o rabo enrolado em volta das patas
  const rabo: THREE.Vector3[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI * 0.2 + (i / 10) * Math.PI * 1.1;
    rabo.push(new V(Math.cos(a) * 0.085, 0.018, Math.sin(a) * 0.075 - 0.01));
  }
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rabo), 16, 0.016, 6, false), pelo));
  return g;
}

/** A LANTERNINHA SOLAR: a lanterna de mesa com a plaquinha solar em cima, acesa. */
export function lanterninhaSolar(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-lanterninha-solar';
  const ferro = toon(P.casaGrafite);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.025, 12), ferro);
  base.position.y = 0.0125;
  const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12), toon(P.enfeiteLanternaLuz, { glow: 0.85 }));
  vidro.position.y = 0.085;
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.065, 0.04, 12), ferro);
  tampa.position.y = 0.165;
  const placa = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.008, 0.07), toon(P.placaSolar));
  placa.position.y = 0.19;
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.005, 5, 12, Math.PI), ferro);
  alca.position.y = 0.195;
  g.add(base, vidro, tampa, placa, alca);
  const halo = haloDeLampada(0.42);
  halo.position.y = 0.09;
  g.add(halo);
  return g;
}

/** O TRIO DE VASINHOS DE BARRO: três tamanhos, com gerânio, alecrim e uma florzinha amarela. */
export function trioDeVasinhos(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-trio-de-vasinhos';
  const perfil = (r: number, h: number): THREE.Vector2[] => [
    new THREE.Vector2(0.001, 0), new THREE.Vector2(r * 0.75, 0), new THREE.Vector2(r, h * 0.85),
    new THREE.Vector2(r * 1.1, h * 0.88), new THREE.Vector2(r * 1.1, h), new THREE.Vector2(r * 0.95, h), new THREE.Vector2(0.001, h * 0.9),
  ];
  const barro = toon(P.plantPot);
  const vasos: Array<[number, number, number, number]> = [[-0.1, 0.055, 0.1, P.florDoArbusto], [0.0, 0.065, 0.12, P.heraMedia], [0.1, 0.05, 0.09, P.flowerYellow]];
  for (const [x, r, h, cor] of vasos) {
    const vaso = new THREE.Mesh(new THREE.LatheGeometry(perfil(r, h), 14), barro);
    vaso.position.x = x;
    g.add(vaso);
    const moita = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.95, 1), toon(P.heraMedia));
    moita.scale.y = 0.8;
    moita.position.set(x, h + r * 0.5, 0);
    g.add(moita);
    if (cor !== P.heraMedia) {
      for (let i = 0; i < 5; i++) {
        const a = i * 1.26;
        const flor = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), toon(cor));
        flor.position.set(x + Math.cos(a) * r * 0.6, h + r * 0.95, Math.sin(a) * r * 0.6);
        g.add(flor);
      }
    }
  }
  return g;
}

// ================================================================ pendurado

/** O VASO DE MACRAMÊ: as cordas trançadas descendo do gancho, o vaso no berço de nós, e a samambaia caindo. */
export function vasoDeMacrame(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-macrame';
  const corda = toon(P.quintalAlmofada);
  const argola = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 14), toon(P.quintalMadeira));
  argola.position.y = -0.03;
  g.add(argola);
  const ALTO = 0.75;
  // quatro cordas, cada uma em zigue-zague (os nós), juntando embaixo do vaso
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    const pts: THREE.Vector3[] = [new V(0, -0.06, 0)];
    for (let i = 1; i <= 8; i++) {
      const t = i / 8;
      const r = 0.13 * Math.sin(Math.min(1, t * 1.1) * Math.PI * 0.55) + (i % 2 ? 0.008 : 0);
      pts.push(new V(Math.cos(a + (i % 2 ? 0.12 : -0.12)) * r, -0.06 - t * (ALTO - 0.12), Math.sin(a + (i % 2 ? 0.12 : -0.12)) * r));
    }
    pts.push(new V(0, -ALTO - 0.02, 0));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.006, 4, false), corda));
  }
  // o nó de baixo e a franja
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), corda);
  no.position.y = -ALTO - 0.02;
  g.add(no);
  for (let i = 0; i < 8; i++) {
    const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.12, 3), corda);
    const a = (i / 8) * Math.PI * 2;
    fio.position.set(Math.cos(a) * 0.01, -ALTO - 0.09, Math.sin(a) * 0.01);
    g.add(fio);
  }
  // o vaso de barro no berço, e a samambaia
  const vaso = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.001, 0), new THREE.Vector2(0.06, 0), new THREE.Vector2(0.1, 0.12),
    new THREE.Vector2(0.108, 0.13), new THREE.Vector2(0.095, 0.13), new THREE.Vector2(0.001, 0.11),
  ], 16), toon(P.plantPot));
  vaso.position.y = -ALTO + 0.02;
  g.add(vaso);
  const folhas = samambaia(16, 0.38, 911, true);
  folhas.position.y = -ALTO + 0.15;
  g.add(folhas);
  return g;
}

/** O SINO DE VENTO: a tampinha de madeira, os tubos de metal pendurados e o badalo — balançando. */
export function sinoDeVento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-sino-de-vento';
  const fio = toon(P.casaGrafite);
  const metal = toon(P.sinoDeVento);
  const corpo = new THREE.Group();
  g.add(corpo);
  g.userData.balanco = corpo;
  const gancho = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.18, 4), fio);
  gancho.position.y = -0.09;
  corpo.add(gancho);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), toon(P.quintalMadeira, { mapa: veioDeMadeira() }));
  tampa.position.y = -0.19;
  corpo.add(tampa);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const comprido = 0.22 + (i % 3) * 0.07;
    const cordinha = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.04, 3), fio);
    cordinha.position.set(Math.cos(a) * 0.06, -0.22, Math.sin(a) * 0.06);
    const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, comprido, 8), metal);
    tubo.position.set(Math.cos(a) * 0.06, -0.24 - comprido / 2, Math.sin(a) * 0.06);
    corpo.add(cordinha, tubo);
  }
  const badalo = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 12), toon(P.quintalMadeira));
  badalo.position.y = -0.33;
  const vela = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.004), toon(P.flowerPink));
  vela.position.y = -0.46;
  const cordao = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.28, 3), fio);
  cordao.position.y = -0.34;
  corpo.add(badalo, vela, cordao);
  return g;
}

/** o sino balança no vento (a peça no chão e a na mão, igual: pelo tempo) */
export function balancarSino(peca: THREE.Object3D, t: number): void {
  const c = peca.userData.balanco as THREE.Object3D | undefined;
  if (!c) return;
  c.rotation.z = Math.sin(t * 1.7) * 0.06 + Math.sin(t * 3.1) * 0.025;
  c.rotation.x = Math.sin(t * 1.3 + 1) * 0.04;
}

/** A LANTERNA DE PAPEL: o globo de gomos acesos, os aros e o cordão, com o halo. */
export function lanternaDePapel(cor: number = P.lanternaDePapel): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-lanterna-de-papel';
  const cordao = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.25, 4), toon(P.casaGrafite));
  cordao.position.y = -0.125;
  g.add(cordao);
  // o globo: um torno de gomos (o papel franzido nas costelas)
  const perfil: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const r = Math.sin(t * Math.PI) * 0.15 * (i % 2 ? 0.96 : 1);
    perfil.push(new THREE.Vector2(Math.max(0.03, r), -0.25 - t * 0.28));
  }
  const globo = new THREE.Mesh(new THREE.LatheGeometry(perfil, 20), toon(cor, { glow: 0.55 }));
  g.add(globo);
  for (const y of [-0.25, -0.53]) {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.006, 5, 14), toon(P.casaGrafite));
    aro.rotation.x = Math.PI / 2;
    aro.position.y = y;
    g.add(aro);
  }
  const halo = haloDeLampada(0.75, cor, 0.5);
  halo.position.y = -0.39;
  g.add(halo);
  return g;
}

// ============================================================ de ponta a ponta

/** a catenária entre duas pontas: `n + 1` pontos, a barriga proporcional ao vão */
export function catenaria(a: THREE.Vector3, b: THREE.Vector3, n = 24): THREE.Vector3[] {
  const L = a.distanceTo(b);
  const barriga = 0.12 + L * 0.06;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = a.clone().lerp(b, t);
    p.y -= barriga * 4 * t * (1 - t);
    pts.push(p);
  }
  return pts;
}

function fioEntre(a: THREE.Vector3, b: THREE.Vector3, cor: number = P.casaGrafite): THREE.Mesh {
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(catenaria(a, b)), 48, 0.008, 4, false), toon(cor));
}

/** O VARAL DE LUZINHAS: o fio, as lampadinhas acesas (um lote) e um halo a cada três. */
export function varalDeLuzinhasEntre(a: THREE.Vector3, b: THREE.Vector3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-varal-de-luzinhas';
  g.add(fioEntre(a, b));
  const curva = new THREE.CatmullRomCurve3(catenaria(a, b));
  const n = Math.max(6, Math.round(a.distanceTo(b) / 0.32));
  const bulbo = new THREE.SphereGeometry(0.035, 10, 8).scale(0.85, 1.15, 0.85);
  const lote = new THREE.InstancedMesh(bulbo, toon(P.enfeiteLanternaLuz, { glow: 0.9 }), n);
  const soquete = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.014, 0.014, 0.03, 6), toon(P.casaGrafite), n);
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const p = curva.getPoint((i + 0.5) / n);
    m.makeTranslation(p.x, p.y - 0.035, p.z);
    soquete.setMatrixAt(i, m);
    m.makeTranslation(p.x, p.y - 0.085, p.z);
    lote.setMatrixAt(i, m);
    if (i % 3 === 1) {
      const halo = haloDeLampada(0.38, P.enfeiteLanternaLuz, 0.5);
      halo.position.set(p.x, p.y - 0.085, p.z);
      g.add(halo);
    }
  }
  lote.castShadow = false;
  g.add(lote, soquete);
  return g;
}

/** AS BANDEIRINHAS: o barbante e as bandeirinhas de papel de cor alternada, penduradas pela ponta. */
export function bandeirinhasEntre(a: THREE.Vector3, b: THREE.Vector3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-bandeirinhas';
  g.add(fioEntre(a, b, P.fitaAdesiva));
  const curva = new THREE.CatmullRomCurve3(catenaria(a, b));
  const n = Math.max(6, Math.round(a.distanceTo(b) / 0.28));
  const tri = new THREE.BufferGeometry().setFromPoints([new V(-0.09, 0, 0), new V(0.09, 0, 0), new V(0, -0.17, 0)]);
  tri.computeVertexNormals();
  const cores = [P.flowerPink, P.flowerYellow, P.lavandaEspiga, P.quintalLonaListra, P.quintalAlmofadaListra, P.heraClara];
  const lote = new THREE.InstancedMesh(tri, toon(0xffffff, { doubleSide: true }), n);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const p = curva.getPoint(t);
    const d = curva.getTangent(t);
    q.setFromAxisAngle(new V(0, 1, 0), Math.atan2(-d.z, d.x));
    m.compose(p, q, new V(1, 1, 1));
    lote.setMatrixAt(i, m);
    lote.setColorAt(i, c.set(cores[i % cores.length]));
  }
  lote.castShadow = false;
  g.add(lote);
  return g;
}

/** O CORDÃO DE LANTERNAS: lanterninhas de papel redondas, acesas, num barbante. */
export function cordaoDeLanternasEntre(a: THREE.Vector3, b: THREE.Vector3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-cordao-de-lanternas';
  g.add(fioEntre(a, b));
  const curva = new THREE.CatmullRomCurve3(catenaria(a, b));
  const n = Math.max(4, Math.round(a.distanceTo(b) / 0.7));
  const cores = [P.lanternaDePapel, P.flowerPink, P.flowerYellow];
  for (let i = 0; i < n; i++) {
    const p = curva.getPoint((i + 0.5) / n);
    const l = lanternaDePapel(cores[i % cores.length]);
    l.scale.setScalar(0.45);
    l.position.copy(p);
    g.add(l);
  }
  return g;
}

/** o retrato de uma peça de ponta a ponta: um vão de 2,4 m, a 1,6 m do chão */
export function amostraEntre(entre: (a: THREE.Vector3, b: THREE.Vector3) => THREE.Group): () => THREE.Group {
  return () => entre(new V(-1.2, 1.6, 0), new V(1.2, 1.6, 0));
}
