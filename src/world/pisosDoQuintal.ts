import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { quina } from './lojaDeRoupas';
import { uvEmMetrosPorTriangulo } from './acabamento';
import { veioDeMadeira } from './texturasDeCasa';
import { reboco } from './texturasDeFachada';
import { novaTextura, sorteio } from './texturasDeChao';
import { cascaDePinus, pedrisco } from './plantasDeJardim';

/**
 * OS PISOS DO QUINTAL (`docs/QUINTAL.md` §3.2, etapa 2): o que cobre o chão e
 * deixa outra coisa ficar EM CIMA — a mesinha no deck, a hortênsia no
 * canteiro. É o canteiro que saiu do jardim, devolvido às mãos do Ari: ele
 * põe onde quiser.
 *
 * O contrato é o dos enfeites (base em `y = 0`, centrado, frente `+Z`), e a
 * ficha diz `piso: true`: o decorador não dá colisor, deixa enfeite por cima
 * e piso cruzando piso (o que foi posto por último fica por cima — a ordem de
 * pintura do chão é o `renderOrder`, que o decorador acerta por peça).
 *
 * O chão do piso é DECALQUE (`toon(…, { decal: true })`, sem gravar
 * profundidade): colado na grama ele não pisca. O que tem altura (as tábuas
 * do deck, a guia de pedra, os tijolos da borda) é geometria de verdade, rente.
 */

/** um contorno torto em volta da origem (rx × rz), para canteiro e mancha */
function contornoTorto(rx: number, rz: number, semente: number, torto = 0.06): THREE.Vector2[] {
  const rnd = sorteio(semente);
  const fases = [rnd() * 6.28, rnd() * 6.28];
  const pts: THREE.Vector2[] = [];
  const N = 40;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k = 1 + Math.sin(a * 3 + fases[0]) * torto + Math.sin(a * 5 + fases[1]) * torto * 0.6;
    pts.push(new THREE.Vector2(Math.cos(a) * rx * k, Math.sin(a) * rz * k));
  }
  return pts;
}

/** o chão do piso: um decalque com a forma dada (pontos no plano x, −z) e o UV em metros */
function decalque(pontos: THREE.Vector2[], mat: THREE.Material, y = 0.016): THREE.Mesh {
  const geo = new THREE.ShapeGeometry(new THREE.Shape(pontos), 2);
  geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, mat);
  m.position.y = y;
  m.renderOrder = 4;
  m.receiveShadow = true;
  m.userData.semSombra = true;
  return m;
}

/** um retângulo de quina redonda, como pontos */
function retanguloRedondo(lx: number, lz: number, r: number): THREE.Vector2[] {
  const forma = new THREE.Shape();
  const x = lx / 2;
  const z = lz / 2;
  forma.moveTo(-x + r, -z);
  forma.lineTo(x - r, -z);
  forma.quadraticCurveTo(x, -z, x, -z + r);
  forma.lineTo(x, z - r);
  forma.quadraticCurveTo(x, z, x - r, z);
  forma.lineTo(-x + r, z);
  forma.quadraticCurveTo(-x, z, -x, z - r);
  forma.lineTo(-x, -z + r);
  forma.quadraticCurveTo(-x, -z, -x + r, -z);
  return forma.getPoints(6);
}

/** pedras miúdas (ou tijolos) em volta de um contorno: a borda do canteiro */
function borda(pontos: THREE.Vector2[], g: THREE.Group, geo: () => THREE.BufferGeometry, mat: THREE.Material, passo: number, semente: number, deitada = false): void {
  const rnd = sorteio(semente);
  let resto = 0;
  for (let i = 0; i < pontos.length; i++) {
    const p = pontos[i];
    const q = pontos[(i + 1) % pontos.length];
    const L = p.distanceTo(q);
    const ang = Math.atan2(q.y - p.y, q.x - p.x);
    for (let s = resto; s < L; s += passo) {
      const k = s / L;
      const m = new THREE.Mesh(geo(), mat);
      // (o ponto no plano vira x, −z no mundo)
      m.position.set(p.x + (q.x - p.x) * k, 0, -(p.y + (q.y - p.y) * k));
      m.rotation.y = ang + (deitada ? 0 : (rnd() - 0.5) * 0.5);
      g.add(m);
      resto = s + passo - L;
    }
  }
}

// ============================================================== as peças

/** O DECK DE MADEIRA: tábuas com veio, de 14 cm, com o vão entre elas, rente ao chão. */
export function deckDeMadeira(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-deck';
  const LX = 1.9;
  const LZ = 1.45;
  const madeira = toon(P.deckDoQuintal, { mapa: veioDeMadeira() });
  const vao = toon(P.deckDoQuintalVao);
  // o fundo escuro que aparece no vão entre as tábuas
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(LX - 0.04, 0.02, LZ - 0.04), vao);
  fundo.position.y = 0.012;
  g.add(fundo);
  const N = 10;
  const passo = LZ / N;
  const rnd = sorteio(4242);
  for (let i = 0; i < N; i++) {
    // cada tábua com o seu comprimento: as emendas desencontradas
    const corte = (rnd() - 0.5) * 0.9;
    for (const [x0, x1] of [[-LX / 2, corte], [corte, LX / 2]] as const) {
      const l = x1 - x0 - 0.012;
      const tabua = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(l, 0.03, passo - 0.018, 0.008)), madeira);
      tabua.position.set((x0 + x1) / 2, 0.036, -LZ / 2 + passo * (i + 0.5));
      g.add(tabua);
    }
  }
  // o rodapé de madeira em volta, que esconde o vão da borda
  for (const [lx, lz, x, z] of [[LX + 0.04, 0.04, 0, LZ / 2 + 0.01], [LX + 0.04, 0.04, 0, -LZ / 2 - 0.01], [0.04, LZ - 0.0, LX / 2 + 0.01, 0], [0.04, LZ, -LX / 2 - 0.01, 0]] as const) {
    const m = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(lx, 0.046, lz, 0.01)), madeira);
    m.position.set(x, 0.023, z);
    g.add(m);
  }
  return g;
}

/** O CANTEIRO DE CASCA: a mancha de casca de pínus de beira torta e a borda de seixos. */
export function canteiroDeCasca(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-canteiro-casca';
  const pts = contornoTorto(0.85, 0.85, 71);
  g.add(decalque(pts, toon(P.cascaDePinus, { mapa: cascaDePinus(), decal: true })));
  const seixo = (): THREE.BufferGeometry => new THREE.SphereGeometry(0.06, 8, 5).scale(1.2, 0.55, 0.9);
  borda(pts, g, seixo, toon(P.pedraDoCaminhoClara, { mapa: reboco(0.6) }), 0.11, 72);
  return g;
}

/** a terra fofa de canteiro: torrões claros e escuros (a cor vem do material) */
function terra(): THREE.CanvasTexture {
  return novaTextura('terra-de-canteiro', 0.9, (ctx, s) => {
    const rnd = sorteio(909);
    ctx.fillStyle = '#e2d6cc';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 700; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = 1.5 + rnd() * 4;
      const v = 170 + Math.floor(rnd() * 80);
      ctx.fillStyle = `rgb(${v},${v - 10},${v - 18})`;
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          ctx.beginPath();
          ctx.ellipse(x + dx, y + dy, r, r * 0.7, rnd() * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  });
}

/** O CANTEIRO DE TERRA: oval, de terra fofa, com a borda de tijolinho em serrilha. */
export function canteiroDeTerra(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-canteiro-terra';
  const pts = contornoTorto(0.8, 0.55, 81, 0.02);
  g.add(decalque(pts, toon(P.terraDeCanteiro, { mapa: terra(), decal: true })));
  // o tijolo de quina, meio enterrado e inclinado: a serrilha clássica de canteiro
  const tijolo = (): THREE.BufferGeometry => {
    const geo = quina(0.07, 0.13, 0.04, 0.008);
    geo.rotateX(0.0);
    geo.rotateZ(0.6);
    geo.translate(0, 0.02, 0);
    return geo;
  };
  borda(pts, g, tijolo, toon(P.tijolinhoGuia, { mapa: reboco(0.5) }), 0.075, 82, true);
  return g;
}

/** O PEDRISCO: a mancha de pedrisco branco de quina redonda, com a guia de cimento. */
export function manchaDePedrisco(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-pedrisco';
  const LX = 1.6;
  const LZ = 1.05;
  g.add(decalque(retanguloRedondo(LX, LZ, 0.25), toon(P.pedriscoBranco, { mapa: pedrisco(), decal: true })));
  // a guia: um tubo de cimento de seção quadrada pelo contorno
  const contorno = retanguloRedondo(LX + 0.08, LZ + 0.08, 0.29).map((p) => new THREE.Vector3(p.x, 0.02, -p.y));
  const curva = new THREE.CatmullRomCurve3(contorno, true, 'catmullrom', 0.1);
  const guia = new THREE.Mesh(new THREE.TubeGeometry(curva, 120, 0.035, 4, true), toon(P.casaLaje, { mapa: reboco(0.6) }));
  g.add(guia);
  return g;
}

/** o tapete de área externa: listras largas e a barra com losangos, em canvas */
function desenhoDoTapeteDeFora(): THREE.CanvasTexture {
  const chave = 'tapete-de-fora';
  return novaTextura(chave, 1, (ctx, s) => {
    const azul = '#5f8fb8';
    const creme = '#f6efe2';
    const terracota = '#e48a6e';
    ctx.fillStyle = creme;
    ctx.fillRect(0, 0, s, s);
    // as listras no meio
    const faixas = [azul, creme, terracota, creme, azul, creme, terracota, creme];
    const alto = s / faixas.length;
    faixas.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, i * alto, s, alto * 0.8);
    });
    // a trama: risquinhos que fazem a palha de plástico trançada
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < s; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 2, s);
      ctx.stroke();
    }
  }, 256);
}

/** O TAPETE DE ÁREA EXTERNA: listrado de azul e terracota, com a franjinha nas pontas. */
export function tapeteDeFora(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-tapete';
  const LX = 1.7;
  const LZ = 1.15;
  const textura = desenhoDoTapeteDeFora();
  const mat = toon(0xffffff, { mapa: textura, decal: true });
  // (o UV do decalque é em metros; o desenho é de 1 m: o tapete mostra ~1,7 listras na largura)
  g.add(decalque(retanguloRedondo(LX, LZ, 0.05), mat, 0.018));
  // a franja: fios curtos nas duas pontas
  const fio = toon(P.quintalAlmofada);
  for (const lado of [-1, 1]) {
    for (let i = 0; i < 26; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.006, 0.07), fio);
      m.rotation.y = Math.PI / 2;
      m.position.set(lado * (LX / 2 + 0.03), 0.008, -LZ / 2 + 0.05 + i * ((LZ - 0.1) / 25));
      g.add(m);
    }
  }
  return g;
}

/** O GRAMADO DE FLORZINHAS: um tapete de florzinhas miúdas no meio da grama, num lote só. */
export function gramadoDeFlores(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-gramado-de-flores';
  const rnd = sorteio(6006);
  const N = 150;
  const flor = new THREE.SphereGeometry(0.03, 6, 4).scale(1, 0.55, 1);
  const lote = new THREE.InstancedMesh(flor, toon(0xffffff), N);
  const haste = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.004, 0.005, 1, 4), toon(P.costelaTalo), N);
  const cores = [P.margaridaBranca, P.flowerYellow, P.lavandaEspiga, P.flowerPink, P.margaridaBranca];
  const m = new THREE.Matrix4();
  const c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    // espalhadas num redondo de beira mole (mais juntas no meio)
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 0.9 * (0.85 + rnd() * 0.15);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = 0.05 + rnd() * 0.08;
    m.makeTranslation(x, h, z);
    lote.setMatrixAt(i, m);
    lote.setColorAt(i, c.set(cores[Math.floor(rnd() * cores.length)]));
    m.makeScale(1, h, 1).setPosition(x, h / 2, z);
    haste.setMatrixAt(i, m);
  }
  lote.castShadow = false;
  haste.castShadow = false;
  g.add(lote, haste);
  // a grama mais escura embaixo, onde as flores estão
  g.add(decalque(contornoTorto(0.95, 0.95, 61, 0.08), toon(P.gramadoDeFlores, { decal: true }), 0.012));
  return g;
}
