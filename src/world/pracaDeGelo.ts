/**
 * OS ENFEITES DA PRAÇA DE GELO do Mano: o tufo de cristais, o poste de
 * lanterna de gelo e o boneco de neve — a segunda leva, feita para combinar
 * com o chalezinho da sorveteria (`world/sorveteriaDoMano.ts`).
 *
 * O GELO É LAPIDADO. As três peças de antes usavam o mesmo gelo translúcido
 * liso, que no toon vira uma mancha azul. Aqui o gelo é o `cristalino()`
 * (`core/shaders.ts`): cor por vértice (o degradê do fundo azul para a ponta
 * quase branca), facetas chatas (cada face uma normal) e a BORDA ACESA — a
 * faceta que vira de lado para a câmera clareia. É o que faz a lasca ler como
 * cristal, a coluna torcida ler como gelo esculpido e o pingente brilhar.
 *
 * A NEVE É AMASSADA: as bolas do boneco e os montinhos têm o ruído pela
 * posição (mão que modelou, não esfera de computador), e o boneco tem a cor
 * pintada nos vértices — o pé de cada bola azulado, na sombra dela mesma.
 *
 * O tamanho por fora é o de antes (os colisores da cena e as etiquetas que o
 * `gelo.mjs` conta continuam valendo).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { cristalino } from '../core/shaders';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { geoBolaDeSorvete, torno, waffle } from './sorveteriaDoMano';
import { novaTextura, sorteio } from './texturasDeChao';

const v3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

// ========================================================== GEOMETRIAS DE GELO

/**
 * Pinta o degradê do gelo nos vértices: `fundo` em `y0`, `ponta` em `y1` (e
 * acima dele). É o atributo que o `cristalino()` precisa.
 */
function degrade(geo: THREE.BufferGeometry, y0: number, y1: number, fundo: number = P.geloFundo, ponta: number = P.geloCristal): THREE.BufferGeometry {
  const a = new THREE.Color(fundo);
  const b = new THREE.Color(ponta);
  const c = new THREE.Color();
  const pos = geo.getAttribute('position');
  const cor = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = Math.min(1, Math.max(0, (pos.getY(i) - y0) / (y1 - y0)));
    c.copy(a).lerp(b, t * t * (3 - 2 * t));
    cor[i * 3] = c.r;
    cor[i * 3 + 1] = c.g;
    cor[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
  return geo;
}

/** sem índice e sem UV, com as normais de face: o formato que junta tudo de gelo numa malha */
function lapidar(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.deleteAttribute('uv');
  g.computeVertexNormals();
  return g;
}

/**
 * UMA LASCA DE CRISTAL: prisma de seis faces que afina um tico para cima, com
 * a ponta de pirâmide um pouco fora do eixo (cristal de verdade não sai
 * simétrico). Pé em `y = 0`, olhando para `+Y`. Sem índice: cada face chata.
 */
function lasca(r: number, alto: number, ponta: number, torto: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): void => {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };
  const rt = r * 0.88;
  const bico = v3(Math.cos(torto * 6) * r * 0.25, alto + ponta, Math.sin(torto * 6) * r * 0.25);
  for (let i = 0; i < 6; i++) {
    const a0 = (i / 6) * Math.PI * 2;
    const a1 = ((i + 1) / 6) * Math.PI * 2;
    const b0 = v3(Math.cos(a0) * r, 0, Math.sin(a0) * r);
    const b1 = v3(Math.cos(a1) * r, 0, Math.sin(a1) * r);
    // o anel de cima com uma ondulação: as faces da ponta saem desiguais
    const h0 = alto * (1 - 0.08 * Math.sin(i * 2.1 + torto * 9));
    const h1 = alto * (1 - 0.08 * Math.sin(((i + 1) % 6) * 2.1 + torto * 9));
    const t0 = v3(Math.cos(a0) * rt, h0, Math.sin(a0) * rt);
    const t1 = v3(Math.cos(a1) * rt, h1, Math.sin(a1) * rt);
    tri(b0, t0, b1);
    tri(b1, t0, t1);
    tri(t0, bico, t1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return degrade(geo, 0, alto + ponta);
}

/** um pingente de gelo: cone de seis faces, base em `y = 0`, ponta para baixo */
function pingente(r: number, comp: number): THREE.BufferGeometry {
  const geo = new THREE.ConeGeometry(r, comp, 6, 1, true);
  geo.rotateX(Math.PI);
  geo.translate(0, -comp / 2, 0);
  return degrade(lapidar(geo), -comp, 0, P.geloCristal, P.geloFundo);
}

/** leva a geometria para o lugar e o giro dados (para juntar várias numa só) */
function posta(geo: THREE.BufferGeometry, p: THREE.Vector3, q: THREE.Quaternion, s = 1): THREE.BufferGeometry {
  return geo.applyMatrix4(new THREE.Matrix4().compose(p, q, new THREE.Vector3(s, s, s)));
}

/** o giro que deita `+Y` na direção `a` (no chão) por `angulo` */
function inclinar(a: number, angulo: number): THREE.Quaternion {
  return new THREE.Quaternion().setFromAxisAngle(v3(Math.sin(a), 0, -Math.cos(a)), angulo);
}

/**
 * UM MONTINHO DE NEVE amassado pela posição: a esfera achatada com caroço,
 * para o pé de cada peça não ser uma calota de compasso. Base em `y = 0`.
 */
function montinho(rx: number, alto: number, rz: number, semente: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.55);
  geo.deleteAttribute('uv');
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const k = 1 + 0.09 * Math.sin(x * 4.3 + z * 2.9 + semente * 7) + 0.05 * Math.sin(z * 7.1 - x * 3 + semente * 3);
    pos.setXYZ(i, x * rx * k, (y - 0.31) * alto * 1.45, z * rz * k);
  }
  geo.computeVertexNormals();
  return geo;
}

// ============================================================= O TUFO DE CRISTAL

/**
 * O TUFO DE CRISTAIS das quinas da praça: cinco a sete lascas de gelo
 * lapidado brotando de um montinho de neve — a do meio alta e em pé, as de
 * volta mais baixas e abrindo para fora, cada uma com a ponta torta —, as
 * lasquinhas soltas no pé e um brilho frio pintado no chão em volta (luz
 * pintada: o cristal parece ter luz própria sem acender luz nenhuma).
 *
 * As lascas são UMA malha (juntadas aqui: transparente não entra na
 * `fundir()`). A semente muda o número, a altura e a inclinação de cada uma,
 * então dois tufos nunca saem gêmeos.
 *
 * @param escala tamanho geral (1 ≈ 80 cm de altura)
 * @param semente 0..1, a variação
 */
export function cristalDeGelo(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cristal-de-gelo';
  const rnd = sorteio(Math.round(semente * 1e6) + 77);
  const e = escala;

  const monte = new THREE.Mesh(montinho(0.4 * e, 0.15 * e, 0.36 * e, semente), toon(P.neveFofa));
  g.add(monte);

  const pecas: THREE.BufferGeometry[] = [];
  // a do meio, alta, quase em pé
  pecas.push(posta(lasca(0.095 * e, 0.6 * e, 0.16 * e, rnd()), v3(0, 0.02 * e, 0), inclinar(rnd() * 6.28, 0.08)));
  const quantas = 4 + Math.floor(rnd() * 3);
  for (let i = 0; i < quantas; i++) {
    const a = (i / quantas) * Math.PI * 2 + semente * 3 + rnd() * 0.5;
    const d = (0.1 + rnd() * 0.08) * e;
    const r = (0.045 + rnd() * 0.04) * e;
    const alto = (0.18 + rnd() * 0.3) * e;
    pecas.push(posta(
      lasca(r, alto, r * (1.1 + rnd() * 0.8), rnd()),
      v3(Math.cos(a) * d, 0.01 * e, Math.sin(a) * d),
      inclinar(a, 0.35 + rnd() * 0.35),
    ));
  }
  // as lasquinhas caídas ao pé, deitadas
  for (let i = 0; i < 4; i++) {
    const a = rnd() * Math.PI * 2;
    const d = (0.3 + rnd() * 0.12) * e;
    const r = (0.02 + rnd() * 0.02) * e;
    pecas.push(posta(
      lasca(r, r * 1.5, r * 1.2, rnd()),
      v3(Math.cos(a) * d, 0.0, Math.sin(a) * d),
      inclinar(a + 1.2, 1.2 + rnd() * 0.3),
    ));
  }
  const cristais = new THREE.Mesh(mergeGeometries(pecas, false), cristalino());
  g.add(cristais);

  // o brilho frio no chão, em volta do tufo
  const brilho = pocaDeLuz(0.62 * e, P.geloCristal, 0.16);
  brilho.position.y = 0.012;
  g.add(brilho);
  return g;
}

// ============================================================ O POSTE DE GELO

/**
 * O POSTE DE LANTERNA DE GELO: a coluna é uma estrela de seis pontas TORCIDA
 * (um tico mais de volta de baixo a cima, gelo esculpido), em cima de um bloco
 * de gelo meio enterrado num montinho de neve, com um colarinho de neve em
 * cada ponta; a lanterna é sextavada, com o miolo aceso entre seis varetas de
 * gelo, o telhadinho de gelo com neve em cima, os pingentes em volta e uma
 * lasca de cristal na ponta. Em volta, o halo e a poça de luz pintados.
 *
 * Baixo (2,4 com a lasca) pelo mesmo motivo de antes: a câmera olha em 34°,
 * e cada metro de poste come 1,5 de chão atrás dele — poste de rua em volta
 * de uma praça de 13 apagaria as mesinhas. O pé cabe no colisor de 0,3.
 *
 * @param aceso o miolo da lanterna acende (de dia ele continua lendo como luz)
 */
export function posteDeGelo(aceso = true): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'poste-de-gelo';
  const neve = toon(P.neveFofa);
  const gelo = cristalino(0.86, 0.55);

  // ------------------------------------------------------- o pé
  g.add(new THREE.Mesh(montinho(0.3, 0.12, 0.3, 0.4), neve));
  const gelos: THREE.BufferGeometry[] = [];
  // o bloco de gelo, meio enterrado na neve
  gelos.push(degrade(lapidar(new RoundedBoxGeometry(0.28, 0.26, 0.28, 1, 0.03)).translate(0, 0.12, 0), 0, 0.25));

  // ------------------------------------------------ a coluna torcida
  {
    const y0 = 0.24;
    const y1 = 1.8;
    const pontas = 6;
    const aneis = 20;
    const volta = Math.PI * 1.3;
    const pos: number[] = [];
    const idx: number[] = [];
    const n = pontas * 2;
    for (let j = 0; j <= aneis; j++) {
      const t = j / aneis;
      const y = y0 + (y1 - y0) * t;
      const afina = 1 - 0.18 * t;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + volta * t;
        const r = (k % 2 ? 0.046 : 0.074) * afina;
        pos.push(Math.cos(a) * r, y, Math.sin(a) * r);
      }
    }
    for (let j = 0; j < aneis; j++) {
      for (let k = 0; k < n; k++) {
        const a = j * n + k;
        const b = j * n + ((k + 1) % n);
        idx.push(a, a + n, b, b, a + n, b + n);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    gelos.push(degrade(lapidar(geo), y0, y1));
  }

  // ------------------------------------------------------- a lanterna
  const Y_LANTERNA = 1.8;
  // a bandeja sextavada que segura a lanterna
  gelos.push(degrade(lapidar(torno([[0.0, 0.0], [0.07, 0.0], [0.16, 0.05], [0.18, 0.08], [0.15, 0.09], [0.0, 0.09]], 6)).translate(0, Y_LANTERNA, 0), Y_LANTERNA, Y_LANTERNA + 0.1));
  // as seis varetas nas quinas do miolo
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const vareta = lapidar(new THREE.BoxGeometry(0.024, 0.26, 0.024));
    vareta.rotateY(-a);
    vareta.translate(Math.cos(a) * 0.135, Y_LANTERNA + 0.21, Math.sin(a) * 0.135);
    gelos.push(degrade(vareta, Y_LANTERNA, Y_LANTERNA + 0.4));
  }
  // o telhadinho sextavado
  const Y_TETO = Y_LANTERNA + 0.33;
  gelos.push(degrade(lapidar(torno([[0.0, -0.01], [0.17, -0.01], [0.19, 0.01], [0.11, 0.09], [0.03, 0.13], [0.0, 0.135]], 6)).translate(0, Y_TETO, 0), Y_TETO, Y_TETO + 0.14));
  // os pingentes pendurados em volta do telhadinho
  {
    const rnd = sorteio(661);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.2;
      const comp = 0.04 + rnd() * 0.09;
      gelos.push(pingente(0.012 + comp * 0.08, comp).translate(Math.cos(a) * 0.17, Y_TETO + 0.0, Math.sin(a) * 0.17));
    }
  }
  // a lasca na ponta
  gelos.push(lasca(0.024, 0.07, 0.07, 0.3).translate(0, Y_TETO + 0.17, 0));
  g.add(new THREE.Mesh(mergeGeometries(gelos, false), gelo));

  // o miolo aceso (opaco: é ele que dá a luz)
  const miolo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.1, 0.26, 6),
    toon(aceso ? P.luzDoPoste : 0xe8e8e0, { glow: aceso ? 0.9 : 0 }),
  );
  miolo.position.y = Y_LANTERNA + 0.22;
  g.add(miolo);
  // os colarinhos de neve no pé e na cabeça da coluna, e a neve no telhado
  for (const [y, r] of [[0.27, 0.085], [1.77, 0.07]] as const) {
    const colar = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 6, 14), neve);
    colar.rotation.x = Math.PI / 2;
    colar.position.y = y;
    colar.scale.z = 0.8;
    g.add(colar);
  }
  const capuz = new THREE.Mesh(montinho(0.15, 0.08, 0.15, 0.7), neve);
  capuz.position.y = Y_TETO + 0.1;
  g.add(capuz);

  if (aceso) {
    const halo = haloDeLampada(0.8, P.luzDoPoste, 0.45);
    halo.position.y = Y_LANTERNA + 0.22;
    g.add(halo);
    const poca = pocaDeLuz(1.15, P.luzDoPoste, 0.1);
    poca.position.y = 0.013;
    g.add(poca);
  }
  return g;
}

// ============================================================ O BONECO DE NEVE

/** o tricô do cachecol: listras rosa e creme, com as carreiras de ponto em V */
function trico(): THREE.CanvasTexture {
  return novaTextura('praca:trico', 0.25, (ctx, s) => {
    const css = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;
    ctx.fillStyle = css(P.sorveteriaRosa);
    ctx.fillRect(0, 0, s / 2, s);
    ctx.fillStyle = css(P.sorveteriaCreme);
    ctx.fillRect(s / 2, 0, s / 2, s);
    // os pontos: V em fila, claros em cima e com a sombrinha embaixo
    const passo = s / 8;
    for (let y = 0; y < s; y += passo) {
      for (let x = 0; x < s; x += passo) {
        ctx.strokeStyle = 'rgba(90,40,50,0.18)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + passo * 0.1, y + passo * 0.15);
        ctx.lineTo(x + passo * 0.5, y + passo * 0.85);
        ctx.lineTo(x + passo * 0.9, y + passo * 0.15);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.beginPath();
        ctx.moveTo(x + passo * 0.15, y + passo * 0.05);
        ctx.lineTo(x + passo * 0.5, y + passo * 0.6);
        ctx.stroke();
      }
    }
  });
}

/**
 * O BONECO DE NEVE do canto da praça — o freguês da casa.
 *
 * - TRÊS BOLAS AMASSADAS (o ruído pela posição: mão que fez), numa malha só
 *   com a cor pintada nos vértices — o pé de cada bola azulado, na sombra
 *   dela mesma —, com o montinho de neve do pé e três bolinhas de reserva
 *   empilhadas do lado;
 * - o rosto: olhos de carvão com o pontinho de brilho, as bochechas rosadas,
 *   o nariz de cenoura torneado com os anéis e o sorriso de pedrinhas;
 * - os braços de galho que DOBRAM (tubos em curva, com os dedinhos): um
 *   acenando para quem chega e o outro segurando uma casquinha de morango;
 * - o cachecol de tricô listrado, com as duas pontas caindo sobre a barriga
 *   e a franjinha;
 * - o chapéu de casquinha (o mesmo do Mano), agora de waffle de verdade, com
 *   a bola de morango e a cereja.
 *
 * O rosto olha para `+Z`; a cena gira o boneco para a entrada da praça. O
 * SINAL dos braços: o da DIREITA nasce em `x` positivo.
 *
 * @param escala 1 ≈ 2,1 de altura com o chapéu
 */
export function bonecoDeNeve(escala = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'boneco-de-neve';
  const corpo = new THREE.Group();
  corpo.scale.setScalar(escala);
  g.add(corpo);

  const carvao = toon(P.churrascoCarvao);
  const galho = toon(P.woodDark);

  // ------------------------------------------------------ as bolas de neve
  const BOLAS: Array<[number, number, number, number]> = [
    // raio, x, y, z do centro
    [0.44, 0, 0.4, 0],
    [0.32, 0.04, 1.02, -0.03],
    [0.24, -0.03, 1.5, 0.02],
  ];
  const clara = new THREE.Color(P.neveFofa);
  const funda = new THREE.Color(P.neveFunda);
  const tom = new THREE.Color();
  /** uma bola amassada com o pé azulado, já no lugar */
  const bola = (r: number, x: number, y: number, z: number, semente: number, fundo = -0.95, gomos = 22, aneis = 15): THREE.BufferGeometry => {
    const geo = new THREE.SphereGeometry(r, gomos, aneis);
    geo.deleteAttribute('uv');
    const pos = geo.getAttribute('position');
    const cor = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const pz = pos.getZ(i);
      const k = 1 + 0.035 * Math.sin(px * 19 + pz * 13 + semente) * Math.sin(py * 15 - px * 7 + semente * 2)
        + 0.02 * Math.sin(pz * 31 + py * 9);
      pos.setXYZ(i, px * k + x, py * k + y, pz * k + z);
      const t = Math.min(1, Math.max(0, (py / r - fundo) / (0.35 - fundo)));
      tom.copy(funda).lerp(clara, t * t * (3 - 2 * t));
      cor[i * 3] = tom.r;
      cor[i * 3 + 1] = tom.g;
      cor[i * 3 + 2] = tom.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
    geo.computeVertexNormals();
    return geo;
  };
  const neves = BOLAS.map(([r, x, y, z], i) => bola(r, x, y, z, i * 2.3));
  // o montinho do pé, mais largo e achatado
  {
    const pe = bola(0.56, 0, 0.0, 0, 9.1, -0.2, 20, 10);
    pe.scale(1, 0.22, 1);
    neves.push(pe);
  }
  // as três bolinhas de reserva, empilhadas do lado
  // (bolinha de 10 cm: 12 gomos bastam)
  neves.push(bola(0.1, 0.4, 0.09, 0.3, 4.4, -0.95, 12, 8), bola(0.09, 0.5, 0.08, 0.17, 5.5, -0.95, 12, 8), bola(0.085, 0.45, 0.24, 0.24, 6.6, -0.95, 12, 8));
  corpo.add(new THREE.Mesh(mergeGeometries(neves, false), toon(0xffffff, { corPorVertice: true })));

  /** um ponto na superfície da bola `i`, a partir do desvio (dx, dy) da frente dela, e a normal ali */
  const naBola = (i: number, dx: number, dy: number, sobe = 0): [THREE.Vector3, THREE.Vector3] => {
    const [r, x, y, z] = BOLAS[i];
    const dz = Math.sqrt(Math.max(0, r * r - dx * dx - dy * dy));
    const n = v3(dx, dy, dz).normalize();
    return [v3(x + dx, y + dy, z + dz).addScaledVector(n, sobe), n];
  };
  /** uma pedrinha de carvão achatada, deitada na superfície */
  const pedrinha = (i: number, dx: number, dy: number, tam: number): void => {
    const [p, n] = naBola(i, dx, dy, tam * 0.2);
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 7, 5), carvao);
    m.scale.set(tam, tam * 0.9, tam * 0.55);
    m.position.copy(p);
    m.quaternion.setFromUnitVectors(v3(0, 0, 1), n);
    corpo.add(m);
  };

  // --------------------------------------------------------------- o rosto
  for (const lado of [-1, 1]) {
    pedrinha(2, lado * 0.085, 0.06, 0.036);
    // o brilho do olho, em cima e para o lado da luz
    const [p] = naBola(2, lado * 0.085 - 0.012, 0.075, 0.03);
    const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 4), toon(0xffffff, { glow: 0.4 }));
    brilho.position.copy(p);
    corpo.add(brilho);
    // a bochecha rosada
    const [pb, nb] = naBola(2, lado * 0.135, -0.03, 0.004);
    const bochecha = new THREE.Mesh(new THREE.CircleGeometry(0.034, 14), toon(0xf6a2b5));
    bochecha.position.copy(pb);
    bochecha.quaternion.setFromUnitVectors(v3(0, 0, 1), nb);
    corpo.add(bochecha);
  }
  // o sorriso de pedrinhas
  for (let i = 0; i < 6; i++) {
    const a = -0.65 + (i / 5) * 1.3;
    pedrinha(2, Math.sin(a) * 0.1, -0.075 - Math.cos(a) * 0.035 + 0.035, 0.016);
  }
  // o nariz de cenoura: torneado, com os aneizinhos
  {
    const [p, n] = naBola(2, -0.01, -0.005, -0.01);
    const cenoura = new THREE.Mesh(torno([
      [0.0, 0.0], [0.04, 0.0], [0.042, 0.02], [0.036, 0.04], [0.038, 0.06], [0.03, 0.09], [0.032, 0.11],
      [0.022, 0.15], [0.023, 0.17], [0.012, 0.22], [0.0, 0.25],
    ], 10), toon(P.laranja));
    cenoura.position.copy(p);
    // o eixo da cenoura na normal do rosto, um tico para baixo
    cenoura.quaternion.setFromUnitVectors(v3(0, 1, 0), n.clone().add(v3(0, -0.15, 0)).normalize());
    corpo.add(cenoura);
  }

  // ------------------------------------------------------------ os botões
  for (let i = 0; i < 3; i++) pedrinha(1, 0.0, 0.1 - i * 0.12, 0.03);

  // --------------------------------------------------------- os braços de galho
  const tubo = (pontos: THREE.Vector3[], r: number, gomos: number): void => {
    corpo.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), gomos, r, 5), galho));
  };
  /*
   * o da DIREITA (x positivo) acena: sai do ombro, sobe QUASE EM PÉ e um tico
   * para trás, e abre os dedos lá em cima. Aberto para o lado (como foi
   * primeiro) ele apontava para a câmera — que fica do lado `+x` dele — e a
   * subida inteira sumia no escorço: lia como braço caído.
   */
  tubo([v3(0.24, 1.12, -0.02), v3(0.38, 1.3, -0.07), v3(0.45, 1.55, -0.11), v3(0.47, 1.8, -0.12)], 0.021, 10);
  tubo([v3(0.465, 1.76, -0.12), v3(0.53, 1.86, -0.12), v3(0.57, 1.9, -0.12)], 0.012, 4);
  tubo([v3(0.47, 1.78, -0.12), v3(0.45, 1.88, -0.12), v3(0.44, 1.95, -0.12)], 0.012, 4);
  tubo([v3(0.42, 1.42, -0.09), v3(0.52, 1.47, -0.1), v3(0.58, 1.5, -0.1)], 0.01, 3);
  // o da ESQUERDA (x negativo) dobra para a frente e segura a casquinha
  const MAO = v3(-0.42, 1.06, 0.34);
  tubo([v3(-0.25, 1.1, 0.02), v3(-0.42, 1.04, 0.1), v3(-0.46, 1.03, 0.24), MAO], 0.021, 10);
  tubo([MAO.clone().add(v3(0, -0.01, -0.02)), MAO.clone().add(v3(0.06, 0.02, 0.05))], 0.011, 2);
  tubo([MAO.clone().add(v3(0, -0.01, -0.02)), MAO.clone().add(v3(-0.05, 0.03, 0.06))], 0.011, 2);
  {
    const casquinha = new THREE.Group();
    casquinha.position.copy(MAO).add(v3(0.0, -0.02, 0.0));
    casquinha.add(new THREE.Mesh(
      torno([[0.003, 0], [0.02, 0.04], [0.042, 0.13], [0.047, 0.14], [0.043, 0.145]], 10),
      toon(P.casquinhaWaffle, { mapa: waffle(1 / 4) }),
    ));
    const b = new THREE.Mesh(geoBolaDeSorvete(0.052, 12, 8), toon(P.morango));
    b.position.y = 0.17;
    casquinha.add(b);
    casquinha.rotation.z = 0.15;
    corpo.add(casquinha);
  }

  // ------------------------------------------------------------- o cachecol
  {
    const pano = toon(0xffffff, { mapa: trico() });
    const volta = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.062, 8, 26), pano);
    volta.rotation.x = Math.PI / 2;
    volta.position.set(0.01, 1.255, 0);
    volta.scale.set(1, 1, 0.85);
    corpo.add(volta);
    // as duas pontas caindo pela barriga: tira de pano encostada na bola do
    // meio, com o UV correndo no comprimento (as listras atravessam a tira)
    for (const [x0, abre, comp] of [[0.13, 0.03, 0.4], [0.21, 0.08, 0.34]] as const) {
      const geo = new THREE.BoxGeometry(0.085, comp, 0.022, 1, 8, 1);
      const pos = geo.getAttribute('position');
      const uv = geo.getAttribute('uv');
      const [, bx, by, bz] = BOLAS[1];
      const R = BOLAS[1][0] + 0.03;
      for (let i = 0; i < pos.count; i++) {
        const lx = pos.getX(i);
        const s = (comp / 2 - pos.getY(i)) / comp; // 0 em cima, 1 embaixo
        const lz = pos.getZ(i);
        const x = x0 + abre * s + lx;
        const y = 1.22 - comp * s;
        const dx = x - bx;
        const dy = y - by;
        const z = bz + Math.sqrt(Math.max(0.02, R * R - dx * dx - dy * dy)) + lz;
        pos.setXYZ(i, x, y, z);
        uv.setXY(i, s * comp * 4, (lx + 0.0425) / 0.085);
      }
      geo.computeVertexNormals();
      // a tira já está dobrada na geometria: deixa de ser "caixa" para o
      // caçador de z-fighting (ele mediria as duas pontas como a mesma caixa)
      corpo.add(new THREE.Mesh(new THREE.BufferGeometry().copy(geo), pano));
      // a franjinha na ponta
      for (let k = 0; k < 5; k++) {
        const fx = x0 + abre + (k / 4 - 0.5) * 0.07;
        const fy = 1.22 - comp - 0.02;
        const dx = fx - bx;
        const dy = fy - by;
        const fz = bz + Math.sqrt(Math.max(0.02, R * R - dx * dx - dy * dy));
        const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.045, 4), toon(P.sorveteriaCreme));
        fio.position.set(fx, fy, fz);
        corpo.add(fio);
      }
    }
  }

  // -------------------------------------------------------------- o chapéu
  {
    const chapeu = new THREE.Group();
    chapeu.position.set(-0.04, 1.69, 0.0);
    chapeu.rotation.set(-0.08, 0, 0.14);
    chapeu.add(new THREE.Mesh(
      torno([[0.0, 0.0], [0.17, 0.0], [0.19, 0.012], [0.185, 0.035], [0.16, 0.05], [0.05, 0.36], [0.018, 0.4], [0.0, 0.405]], 16),
      toon(P.casquinhaWaffle, { mapa: waffle(1 / 6) }),
    ));
    const b = new THREE.Mesh(geoBolaDeSorvete(0.1), toon(P.morango));
    b.position.y = 0.44;
    chapeu.add(b);
    const cereja = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), toon(P.cerejaDoMano));
    cereja.position.y = 0.55;
    chapeu.add(cereja);
    chapeu.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(v3(0, 0.57, 0), v3(0.01, 0.62, 0), v3(0.035, 0.64, 0.005)), 5, 0.005, 4),
      toon(P.leafDark),
    ));
    corpo.add(chapeu);
  }
  return g;
}
