import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * Kit de cenario ao ar livre. Toda peca volta como um Group com a base em y=0,
 * pronta para `w.add(w.place(bench(), x, 0, z, rot))`.
 * Prefira reaproveitar daqui a modelar coisa nova dentro de uma cena.
 */

export type TreeKind = 'redonda' | 'pinheiro' | 'palmeira' | 'florida';

export function tree(kind: TreeKind = 'redonda', scale = 1, seed = 0.5): THREE.Group {
  const g = new THREE.Group();
  const trunkH = 2.1 * scale;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13 * scale, 0.2 * scale, trunkH, 8),
    toon(P.trunk),
  );
  trunk.position.y = trunkH / 2;
  g.add(trunk);

  if (kind === 'pinheiro') {
    for (let i = 0; i < 3; i++) {
      const r = (1.1 - i * 0.26) * scale;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, 1.3 * scale, 9), toon(i === 0 ? P.leafDark : P.leafMid));
      cone.position.y = trunkH * 0.7 + i * 0.72 * scale;
      g.add(cone);
    }
  } else if (kind === 'palmeira') {
    trunk.scale.y = 1.5;
    trunk.position.y = trunkH * 0.75;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.75 * scale, 8, 6), toon(P.leafMid));
      leaf.scale.set(1.5, 0.14, 0.5);
      leaf.position.set(Math.cos(a) * 0.85 * scale, trunkH * 1.5 - 0.1, Math.sin(a) * 0.85 * scale);
      leaf.rotation.y = -a;
      leaf.rotation.z = -0.32;
      g.add(leaf);
    }
  } else {
    const leafColor = kind === 'florida' ? P.flowerPink : P.leafMid;
    const blobs: Array<[number, number, number, number]> = [
      [0, trunkH + 0.55 * scale, 0, 1.15],
      [0.62 * scale, trunkH + 0.15 * scale, 0.2 * scale, 0.78],
      [-0.5 * scale, trunkH + 0.3 * scale, -0.35 * scale, 0.88],
      [0.1 * scale, trunkH + 1.05 * scale, -0.3 * scale, 0.66],
    ];
    blobs.forEach(([x, y, z, r], i) => {
      const blob = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r * scale, 1),
        toon(i % 2 === 0 ? leafColor : kind === 'florida' ? P.flowerPink : P.leafLight),
      );
      blob.position.set(x, y, z);
      blob.rotation.set(seed * 3, seed * 5, seed * 2);
      g.add(blob);
    });
  }
  return g;
}

export function bush(scale = 1, color: number = P.bush): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 * scale, 1), toon(color));
    b.position.set((i - 1) * 0.36 * scale, 0.3 * scale + (i === 1 ? 0.12 : 0), (i % 2) * 0.18 * scale);
    g.add(b);
  }
  return g;
}

export function flowers(count = 6, radius = 0.9, colors: number[] = [P.flowerPink, P.flowerYellow, 0xffffff]): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + i * 0.7;
    const r = radius * (0.35 + ((i * 37) % 100) / 140);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 5), toon(P.leafDark));
    stem.position.set(Math.cos(a) * r, 0.15, Math.sin(a) * r);
    g.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), toon(colors[i % colors.length]));
    head.position.set(Math.cos(a) * r, 0.33, Math.sin(a) * r);
    head.scale.y = 0.7;
    g.add(head);
  }
  return g;
}

/**
 * Pedra. A `semente` amassa os vértices e muda as proporções, então duas pedras
 * do mesmo tamanho não saem iguais — sem isso a margem do lago vira uma fileira
 * de clones.
 */
export function rock(scale = 1, semente = 0.5, cor = 0x9aa0a6): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.DodecahedronGeometry(0.5 * scale, 0);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // O ruído é sorteado pela POSIÇÃO, não pelo índice: a geometria não é
    // indexada, cada triângulo tem os próprios vértices, e amassar por índice
    // rasga os cantos compartilhados — vira caco de vidro em vez de pedra.
    const n =
      Math.sin(
        Math.round(x * 1000) * 12.9898 +
          Math.round(y * 1000) * 78.233 +
          Math.round(z * 1000) * 37.719 +
          semente * 53.1,
      ) * 43758.5453;
    const k = 1 + (n - Math.floor(n) - 0.5) * 0.3;
    pos.setXYZ(i, x * k, y * k, z * k);
  }
  geo.computeVertexNormals();

  const r = new THREE.Mesh(geo, toon(cor));
  r.position.y = 0.3 * scale * (0.8 + semente * 0.4);
  r.rotation.set(semente * 6.28, semente * 4.1, semente * 2.2);
  r.scale.set(1 + semente * 0.3, 0.6 + semente * 0.4, 1.1 - semente * 0.3);
  g.add(r);
  return g;
}

/** Tufo de mato rasteiro: quebra o chão liso da beira do lago e do gramado. */
export function capim(escala = 1, cor: number = P.leafMid): THREE.Group {
  const g = new THREE.Group();
  const folhas = 6;
  for (let i = 0; i < folhas; i++) {
    const a = (i / folhas) * Math.PI * 2 + i * 0.7;
    const alto = (0.28 + ((i * 37) % 10) / 40) * escala;
    const folha = new THREE.Mesh(
      new THREE.ConeGeometry(0.035 * escala, alto, 5),
      toon(i % 3 === 0 ? P.leafDark : i % 3 === 1 ? cor : P.grassDry),
    );
    folha.position.set(Math.cos(a) * 0.11 * escala, alto * 0.45, Math.sin(a) * 0.11 * escala);
    folha.rotation.set(Math.sin(a) * 0.35, 0, Math.cos(a) * 0.35);
    g.add(folha);
  }
  return g;
}

/** Junco de beira d'água, com a taboa marrom na ponta. */
export function junco(altura = 1.2, hastes = 7): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < hastes; i++) {
    const a = (i / hastes) * Math.PI * 2 + i * 1.3;
    const raio = 0.06 + ((i * 53) % 10) / 55;
    const h = altura * (0.7 + ((i * 29) % 10) / 22);
    const haste = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.028, h, 5),
      toon(i % 2 ? P.leafDark : P.leafMid),
    );
    const inclina = 0.12 + ((i * 17) % 10) / 60;
    haste.position.set(Math.cos(a) * raio, h / 2, Math.sin(a) * raio);
    haste.rotation.set(Math.sin(a) * inclina, 0, Math.cos(a) * inclina);
    g.add(haste);

    // uma em cada três ganha a taboa
    if (i % 3 === 0) {
      const taboa = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, h * 0.16, 4, 8), toon(0x8a6a3a));
      taboa.position.set(
        Math.cos(a) * (raio + Math.cos(a) * inclina * h * 0.5),
        h * 0.97,
        Math.sin(a) * (raio + Math.sin(a) * inclina * h * 0.5),
      );
      g.add(taboa);
    }
  }
  return g;
}

/**
 * Vitória-régia. É uma calota, não um plano: fica de fato ACIMA da água e com
 * a superfície curva, então não tem como brigar com o decalque do lago.
 */
export function nenufar(escala = 1, flor = true): THREE.Group {
  const g = new THREE.Group();
  // duas calotas sobrepostas e deslocadas: lê como folha com fenda, e não como
  // uma bolacha verde no meio da água
  for (const [dx, dz, r] of [[0, 0, 0.62], [0.34, 0.2, 0.44]] as const) {
    const folha = new THREE.Mesh(
      new THREE.SphereGeometry(r * escala, 14, 6, 0, Math.PI * 2, 0, 0.5),
      toon(P.leafLight),
    );
    folha.scale.y = 0.3;
    folha.position.set(dx * escala, 0.03, dz * escala);
    g.add(folha);
  }

  if (flor) {
    const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.08 * escala, 8, 6), toon(P.flowerYellow));
    miolo.position.set(0.16 * escala, 0.14 * escala, 0.08 * escala);
    g.add(miolo);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const petala = new THREE.Mesh(new THREE.SphereGeometry(0.06 * escala, 7, 5), toon(0xfff0f5));
      petala.position.set(
        0.16 * escala + Math.cos(a) * 0.08 * escala,
        0.12 * escala,
        0.08 * escala + Math.sin(a) * 0.08 * escala,
      );
      petala.scale.set(1.3, 0.6, 1.3);
      g.add(petala);
    }
  }
  return g;
}

/**
 * Canteiro de flores: borda de alvenaria, terra e maços de flores.
 *
 * A borda é elevada de propósito — assim o canteiro é geometria de pé e não
 * decalque de chão, que é onde mora o risco de z-fighting.
 */
export function canteiro(
  raio = 1.1,
  cores: number[] = [P.flowerPink, P.flowerYellow, 0xffffff, 0xb98fe0],
  semente = 0.5,
): THREE.Group {
  const g = new THREE.Group();
  const altura = 0.24;

  const borda = new THREE.Mesh(
    new THREE.CylinderGeometry(raio, raio * 1.05, altura, 18, 1, true),
    toon(P.brick, { doubleSide: true }),
  );
  borda.position.y = altura / 2;
  g.add(borda);

  const tampa = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.05, 6, 20), toon(P.wallCream));
  tampa.rotation.x = Math.PI / 2;
  tampa.position.y = altura;
  g.add(tampa);

  const terra = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.96, raio * 0.96, 0.08, 18), toon(P.dirt));
  terra.position.y = altura - 0.03;
  g.add(terra);

  // maços: cada um é um punhado de esferas da mesma cor, com alturas diferentes
  const macos = 7;
  for (let i = 0; i < macos; i++) {
    const a = (i / macos) * Math.PI * 2 + semente * 6.28;
    const d = raio * (0.25 + ((i * 41 + semente * 100) % 10) / 18);
    const cor = cores[i % cores.length];
    const cx = Math.cos(a) * d;
    const cz = Math.sin(a) * d;

    const folhagem = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), toon(P.leafDark));
    folhagem.position.set(cx, altura + 0.06, cz);
    folhagem.scale.y = 0.55;
    g.add(folhagem);

    for (let k = 0; k < 4; k++) {
      const b = (k / 4) * Math.PI * 2 + i;
      const flor = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), toon(cor));
      flor.position.set(
        cx + Math.cos(b) * 0.12,
        altura + 0.16 + ((k + i) % 3) * 0.05,
        cz + Math.sin(b) * 0.12,
      );
      flor.scale.y = 0.8;
      g.add(flor);
    }
  }
  return g;
}

/**
 * Domo geodésico de vidro da praça da roda gigante.
 *
 * O truque para vidro translúcido não virar bolha: a estrutura. São os
 * paralelos cruzando com os meridianos que dão a grelha, e os pilares de dentro
 * que dão o que iluminar — sem eles o toon shading não tem em que pegar.
 */
export function domoDeVidro(raio = 2.6): THREE.Group {
  const g = new THREE.Group();
  const metal = toon(P.metalWhite);
  const base = 0.26;

  // rodapé de concreto: levanta o vidro do chão e some com a linha rente à grama
  const rodape = new THREE.Mesh(new THREE.CylinderGeometry(raio * 1.03, raio * 1.06, base, 20), toon(P.concrete));
  rodape.position.y = base / 2;
  g.add(rodape);

  const cupula = new THREE.Mesh(
    new THREE.SphereGeometry(raio, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    toon(0xdff2fb, { opacity: 0.72, doubleSide: true }),
  );
  cupula.position.y = base;
  g.add(cupula);

  // meridianos (de polo a polo) e paralelos (as faixas horizontais)
  for (let i = 0; i < 8; i++) {
    const meridiano = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.045, 5, 20, Math.PI), metal);
    meridiano.rotation.set(0, (i / 8) * Math.PI, 0);
    meridiano.position.y = base;
    g.add(meridiano);
  }
  for (const altura of [0.34, 0.62, 0.85]) {
    const r = raio * Math.sqrt(Math.max(0.02, 1 - altura * altura));
    const paralelo = new THREE.Mesh(new THREE.TorusGeometry(r, 0.038, 5, 22), metal);
    paralelo.rotation.x = Math.PI / 2;
    paralelo.position.y = base + raio * altura;
    g.add(paralelo);
  }

  // aro da base em duas metades: a fresta na frente lê como entrada
  for (const lado of [0, 1]) {
    const aro = new THREE.Mesh(
      new THREE.TorusGeometry(raio, 0.09, 6, 18, Math.PI - 0.5),
      metal,
    );
    aro.rotation.x = Math.PI / 2;
    aro.rotation.z = lado ? Math.PI + 0.25 : 0.25;
    aro.position.y = base + 0.04;
    g.add(aro);
  }

  const topo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), metal);
  topo.position.y = base + raio;
  g.add(topo);

  // pilares por dentro: é o que dá volume quando a luz atravessa o vidro
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const alt = raio * 0.62;
    const pilar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, alt, 6), toon(P.metalGrey));
    pilar.position.set(Math.cos(a) * raio * 0.84, base + alt / 2, Math.sin(a) * raio * 0.84);
    g.add(pilar);
  }

  // um banco lá dentro, visto através do vidro
  const bancoInterno = bench(P.wood);
  bancoInterno.scale.setScalar(0.72);
  bancoInterno.position.set(0, base, -raio * 0.35);
  bancoInterno.rotation.y = 0.25;
  g.add(bancoInterno);

  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.36, 10), toon(P.plantPot));
  vaso.position.set(raio * 0.4, base + 0.18, raio * 0.35);
  g.add(vaso);
  const planta = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 0), toon(P.leafMid));
  planta.position.set(raio * 0.4, base + 0.55, raio * 0.35);
  g.add(planta);

  return g;
}

export function bench(color: number = P.wood): THREE.Group {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.55), toon(color));
  seat.position.y = 0.48;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.09), toon(color));
  back.position.set(0, 0.76, -0.25);
  back.rotation.x = -0.16;
  g.add(back);
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.48, 0.5), toon(P.metalGrey));
    leg.position.set(side * 0.78, 0.24, 0);
    g.add(leg);
  }
  return g;
}

export function lamp(lit = false): THREE.Group {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.4, 8), toon(P.metalGrey));
  pole.position.y = 1.7;
  g.add(pole);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62),
    toon(P.metalWhite),
  );
  head.position.y = 3.45;
  head.rotation.x = Math.PI;
  g.add(head);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 10, 8),
    toon(lit ? P.gold : 0xe8e8e0, { glow: lit ? 0.9 : 0 }),
  );
  bulb.position.y = 3.32;
  g.add(bulb);
  return g;
}

export function bin(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.75, 10), toon(0x4f7a4a));
  body.position.y = 0.38;
  g.add(body);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.04, 6, 14), toon(P.metalGrey));
  rim.position.y = 0.76;
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  return g;
}

export function picnicTable(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 1.0), toon(P.wood));
  top.position.y = 0.76;
  g.add(top);
  for (const side of [-1, 1]) {
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.76, 0.9), toon(P.woodDark));
    legs.position.set(side * 0.75, 0.38, 0);
    g.add(legs);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.34), toon(P.wood));
    seat.position.set(0, 0.45, side * 0.78);
    g.add(seat);
    const seatLeg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.08), toon(P.woodDark));
    seatLeg.position.set(0, 0.22, side * 0.78);
    g.add(seatLeg);
  }
  return g;
}

export function fence(length = 4, height = 1.1, color: number = P.metalGrey): THREE.Group {
  const g = new THREE.Group();
  const posts = Math.max(2, Math.round(length / 1.2));
  for (let i = 0; i <= posts; i++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, height, 6), toon(color));
    post.position.set(-length / 2 + (i / posts) * length, height / 2, 0);
    g.add(post);
  }
  for (const y of [height * 0.35, height * 0.8]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.06), toon(color));
    rail.position.y = y;
    g.add(rail);
  }
  return g;
}

export function signBoard(color: number = P.wood, accent: number = P.metalWhite): THREE.Group {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), toon(P.woodDark));
  post.position.y = 0.8;
  g.add(post);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.08), toon(color));
  board.position.y = 1.5;
  g.add(board);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.02), toon(accent));
  stripe.position.set(0, 1.62, 0.05);
  g.add(stripe);
  return g;
}

export function cloud(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const mat = flat(0xffffff, 0.92);
  const parts: Array<[number, number, number, number]> = [
    [0, 0, 0, 1.2],
    [1.1, -0.16, 0.2, 0.85],
    [-1.0, -0.2, -0.1, 0.75],
    [0.4, 0.5, -0.2, 0.7],
  ];
  for (const [x, y, z, r] of parts) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r * scale, 10, 8), mat);
    m.position.set(x * scale, y * scale, z * scale);
    g.add(m);
  }
  return g;
}

/** O que o quiosque vende: muda a vitrine do balcão e o enfeite do letreiro. */
export type KioskTipo = 'simples' | 'sorvete' | 'suco';

export interface KioskOpts {
  tipo?: KioskTipo;
  /** texto do letreiro; sem isso, o tipo escolhe um */
  texto?: string;
}

/**
 * Toldo listrado de barril: meia-cana com faixas alternadas e babado na ponta.
 *
 * O cilindro nasce com o eixo em Y; girar `z = PI/2` deita ele ao longo do X,
 * e aí o angulo do setor vira direto altura × profundidade — `theta = 0` aponta
 * para a frente (+Z) e `theta = PI/2` para cima.
 */
function toldo(largura: number, raio: number, cor: number, claro: number): THREE.Group {
  const g = new THREE.Group();
  const faixas = 9;
  const passo = largura / faixas;
  const de = 0.35;
  const arco = 1.15;

  const lona = new THREE.Group();
  lona.rotation.z = Math.PI / 2;
  for (let i = 0; i < faixas; i++) {
    const faixa = new THREE.Mesh(
      new THREE.CylinderGeometry(raio, raio, passo * 1.02, 10, 1, true, de, arco),
      toon(i % 2 === 0 ? cor : claro, { doubleSide: true }),
    );
    faixa.position.y = -largura / 2 + passo * (i + 0.5);
    lona.add(faixa);
  }
  g.add(lona);

  // babado: as bolinhas da ponta da frente, que é o que deixa com cara de doce
  const py = Math.sin(de) * raio;
  const pz = Math.cos(de) * raio;
  for (let i = 0; i < faixas; i++) {
    const bola = new THREE.Mesh(
      new THREE.SphereGeometry(passo * 0.36, 8, 6),
      toon(i % 2 === 0 ? cor : claro),
    );
    bola.position.set(-largura / 2 + passo * (i + 0.5), py - passo * 0.2, pz);
    bola.scale.set(1, 1.15, 0.7);
    g.add(bola);
  }
  return g;
}

/**
 * Quiosque de parque: cabine de madeira com balcão, toldo listrado, letreiro
 * escrito e uma vitrine que muda com o que ele vende.
 *
 * A boca fica em +Z: posicione girado de forma que quem compra fique na frente
 * dele na tela, e não escondido atrás.
 */
export function kiosk(color: number = P.fabricRed, opts: KioskOpts = {}): THREE.Group {
  const g = new THREE.Group();
  const tipo = opts.tipo ?? 'simples';
  const claro = P.wallCream;
  const madeira = toon(P.wood);
  const madeiraEscura = toon(P.woodDark);

  // ------------------------------------------------------------- estrutura
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.16, 1.9), madeiraEscura);
  deck.position.y = 0.08;
  g.add(deck);

  const corpo = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.7, 1.4), toon(claro));
  corpo.position.set(0, 1.01, -0.05);
  g.add(corpo);

  // ripado da frente, só nas beiradas: o miolo é a janela de atendimento
  for (const lado of [-1, 1]) {
    const pilar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.7, 0.14), madeira);
    pilar.position.set(lado * 1.045, 1.01, 0.68);
    g.add(pilar);
  }
  const verga = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.22, 0.14), madeira);
  verga.position.set(0, 1.75, 0.68);
  g.add(verga);

  // o vão escuro dá profundidade: sem ele a frente vira uma parede lisa. Ele
  // fica entre o tampo do balcão e a verga — mais baixo que isso e some atrás
  // do próprio balcão
  const vao = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.44, 0.06), toon(0x5b4636));
  vao.position.set(0, 1.42, 0.66);
  g.add(vao);

  const balcao = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.14, 0.78), madeira);
  balcao.position.set(0, 1.12, 0.94);
  g.add(balcao);
  const bordo = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 2.5, 10), madeiraEscura);
  bordo.rotation.z = Math.PI / 2;
  bordo.position.set(0, 1.12, 1.32);
  g.add(bordo);

  for (const lado of [-1, 1]) {
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 8), toon(P.metalWhite));
    perna.position.set(lado * 1.18, 0.6, 1.24);
    g.add(perna);
  }

  // ----------------------------------------------------------- toldo e teto
  const cobertura = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.16, 1.55), madeiraEscura);
  cobertura.position.set(0, 1.94, -0.05);
  g.add(cobertura);

  // o toldo é curto de propósito: a câmera olha de cima em 34°, então qualquer
  // aba mais avançada que isto passa na frente da vitrine e esconde tudo
  const lona = toldo(2.5, 0.44, color, claro);
  lona.position.set(0, 1.54, 0.62);
  g.add(lona);

  // ------------------------------------------------------------- letreiro
  const texto = opts.texto ?? (tipo === 'sorvete' ? 'Sorvete' : tipo === 'suco' ? 'Sucos' : '');
  const placa = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.5, 0.12), toon(color));
  placa.position.set(0, 2.3, -0.05);
  g.add(placa);
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.62, 0.08), toon(claro));
  moldura.position.set(0, 2.3, -0.09);
  g.add(moldura);
  if (texto) {
    const escrito = letreiro(texto, 1.5, 0.34);
    escrito.position.set(0, 2.3, 0.02);
    g.add(escrito);
  }

  // ------------------------------------------------- vitrine e enfeite alto
  if (tipo === 'sorvete') {
    // casquinha gigante em cima do letreiro: é o que se vê de longe
    const gigante = iceCream(P.morango);
    gigante.scale.setScalar(2.6);
    gigante.position.set(0, 2.78, -0.05);
    g.add(gigante);

    // cuba aberta, como gelateria de verdade: vidro por cima ficaria tapando
    // as bolas justo de onde a câmera olha
    const bandeja = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.16, 0.56), toon(P.metalWhite));
    bandeja.position.set(-0.58, 1.26, 1.06);
    g.add(bandeja);
    const sabores = [P.morango, P.maracuja, P.chocolate];
    sabores.forEach((sabor, i) => {
      const cuba = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.22, 10), toon(P.metalWhite));
      cuba.position.set(-1.0 + i * 0.36, 1.29, 1.06);
      g.add(cuba);
      const bola = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), toon(sabor));
      bola.position.set(-1.0 + i * 0.36, 1.42, 1.06);
      bola.scale.y = 0.8;
      g.add(bola);
    });

    // pilha de casquinhas do outro lado do balcão
    for (let i = 0; i < 3; i++) {
      const casq = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 10), toon(0xd8a45c));
      casq.position.set(0.72, 1.34 + i * 0.07, 1.04 + i * 0.02);
      casq.rotation.x = Math.PI;
      g.add(casq);
    }
  } else if (tipo === 'suco') {
    // laranja gigante em cima do letreiro, com folhinha
    const fruta = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), toon(P.laranja));
    fruta.position.set(0, 2.85, -0.05);
    g.add(fruta);
    const folha = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), toon(P.leafMid));
    folha.position.set(0.14, 3.12, -0.05);
    folha.scale.set(1.5, 0.4, 0.8);
    folha.rotation.z = 0.5;
    g.add(folha);

    // jarras com suco de verdade dentro
    const sucos = [P.laranja, P.limao];
    sucos.forEach((suco, i) => {
      const jarra = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.14, 0.42, 12, 1, true),
        toon(P.glass, { opacity: 0.45, doubleSide: true }),
      );
      jarra.position.set(-0.78 + i * 0.42, 1.4, 1.06);
      g.add(jarra);
      const dentro = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.28, 12), toon(suco));
      dentro.position.set(-0.78 + i * 0.42, 1.33, 1.06);
      g.add(dentro);
      const torneira = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 6), toon(P.metalGrey));
      torneira.position.set(-0.78 + i * 0.42, 1.26, 1.2);
      torneira.rotation.x = Math.PI / 2;
      g.add(torneira);
    });

    // fruteira
    const cesta = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.12, 12), toon(P.plantPot));
    cesta.position.set(0.42, 1.25, 1.06);
    g.add(cesta);
    const frutas: Array<[number, number, number, number]> = [
      [0.32, 1.34, 1.03, P.laranja],
      [0.52, 1.34, 1.08, P.limao],
      [0.42, 1.4, 1.05, P.morango],
    ];
    for (const [x, y, z, cor] of frutas) {
      const fr = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), toon(cor));
      fr.position.set(x, y, z);
      g.add(fr);
    }

    // copo de canudos
    const copo = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.2, 10), toon(claro));
    copo.position.set(0.95, 1.29, 1.06);
    g.add(copo);
    const canudos = [P.morango, P.limao, P.fabricBlue];
    canudos.forEach((cor, i) => {
      const canudo = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.34, 6), toon(cor));
      canudo.position.set(0.93 + i * 0.03, 1.44, 1.06 - i * 0.02);
      canudo.rotation.z = (i - 1) * 0.18;
      g.add(canudo);
    });
  }

  // quadro de preços pendurado na lateral
  const quadro = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.5), toon(0x36302c));
  quadro.position.set(1.2, 1.3, 0.15);
  g.add(quadro);
  for (let i = 0; i < 3; i++) {
    const linha = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.045, 0.3 - i * 0.06), toon(claro));
    linha.position.set(1.24, 1.46 - i * 0.16, 0.15);
    g.add(linha);
  }

  return g;
}

/** Predio simples de fundo, com janelinhas. */
export function building(
  width = 4,
  height = 6,
  depth = 4,
  wall: number = P.wallCream,
  roof: number = P.roofTile,
  windowColor: number = P.glass,
): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), toon(wall));
  body.position.y = height / 2;
  g.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.35, depth + 0.3), toon(roof));
  top.position.y = height + 0.17;
  g.add(top);

  const cols = Math.max(1, Math.floor(width / 1.4));
  const rows = Math.max(1, Math.floor(height / 1.6));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.06), toon(windowColor, { glow: 0.15 }));
      const x = -width / 2 + (width / cols) * (c + 0.5);
      const y = 0.9 + (height / rows) * r;
      win.position.set(x, y, depth / 2 + 0.02);
      g.add(win);
      const back = win.clone();
      back.position.z = -depth / 2 - 0.02;
      g.add(back);
    }
  }
  return g;
}

/**
 * Mesa de ping pong. Medidas em escala de jogo (uma pessoa tem 1,75): tampo de
 * 2,6 × 1,4 a 76cm do chão, que é a proporção da mesa de verdade sem ficar
 * gigante ao lado dos personagens chibi.
 *
 * As linhas brancas são caixas com altura própria, não planos colados no tampo:
 * plano coplanar com o tampo pisca (z-fighting), e caixa de 8mm nunca pisca.
 */
export function mesaPingPong(cor: number = P.mesaVerde): THREE.Group {
  const g = new THREE.Group();
  const larg = 2.6; // ao longo de X — é a direção em que a bolinha viaja
  const prof = 1.4;
  const alturaTampo = 0.76;
  const linha = toon(0xf4f7f5);

  const tampo = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.06, prof), toon(cor));
  tampo.position.y = alturaTampo;
  g.add(tampo);

  // borda pintada + linha do meio, no comprimento
  for (const z of [-prof / 2 + 0.05, prof / 2 - 0.05, 0]) {
    const risco = new THREE.Mesh(new THREE.BoxGeometry(larg - 0.02, 0.008, 0.05), linha);
    risco.position.set(0, alturaTampo + 0.032, z);
    g.add(risco);
  }
  for (const x of [-larg / 2 + 0.04, larg / 2 - 0.04]) {
    const risco = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.008, prof - 0.02), linha);
    risco.position.set(x, alturaTampo + 0.032, 0);
    g.add(risco);
  }

  // ------------------------------------------------------------- a rede
  const rede = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.19, prof + 0.16),
    toon(0xfbfdfc, { opacity: 0.72, doubleSide: true }),
  );
  rede.position.y = alturaTampo + 0.13;
  g.add(rede);
  const fita = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, prof + 0.18), toon(0xffffff));
  fita.position.y = alturaTampo + 0.225;
  g.add(fita);
  for (const z of [-(prof + 0.16) / 2, (prof + 0.16) / 2]) {
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.24, 8), toon(P.metalGrey));
    poste.position.set(0, alturaTampo + 0.12, z);
    g.add(poste);
  }

  // ------------------------------------------------------------- pernas
  for (const x of [-larg / 2 + 0.22, larg / 2 - 0.22]) {
    for (const z of [-prof / 2 + 0.18, prof / 2 - 0.18]) {
      const perna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.045, alturaTampo, 8),
        toon(P.metalGrey),
      );
      perna.position.set(x, alturaTampo / 2, z);
      g.add(perna);
    }
    // travessa unindo o par, como as mesas dobráveis de parque
    const travessa = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, prof - 0.36), toon(P.metalGrey));
    travessa.position.set(x, alturaTampo * 0.35, 0);
    g.add(travessa);
  }

  return g;
}

/** Bolinha de ping pong. Pequena de verdade: some se for muito maior. */
export function bolinhaPingPong(): THREE.Mesh {
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), toon(0xfff8e6, { glow: 0.12 }));
  bola.castShadow = true;
  return bola;
}

/** Raquete: cilindro achatado com cabo, do jeito que a memória desenha. */
export function raquete(cor: number = P.metalRed): THREE.Group {
  const g = new THREE.Group();

  const borracha = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 20), toon(cor));
  borracha.rotation.x = Math.PI / 2;
  g.add(borracha);

  // a madeira aparece como um aro fino em volta da borracha
  const madeira = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.022, 20), toon(P.wood));
  madeira.rotation.x = Math.PI / 2;
  g.add(madeira);

  const cabo = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.16, 4, 8), toon(P.woodDark));
  cabo.position.y = -0.25;
  g.add(cabo);

  g.traverse((n) => {
    const m = n as THREE.Mesh;
    if (m.isMesh) m.castShadow = true;
  });
  return g;
}

/** Frisbee: usado como prop parado e como projetil no minigame. */
export function frisbee(color: number = P.frisbee): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.07, 20), toon(color));
  mesh.castShadow = true;
  return mesh;
}

/** Coracaozinho flutuante, para recompensas e momentos fofos. */
export function heart(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(P.heart, { glow: 0.35 });
  for (const side of [-1, 1]) {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.16 * scale, 10, 8), mat);
    lobe.position.set(side * 0.13 * scale, 0.1 * scale, 0);
    g.add(lobe);
  }
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22 * scale, 0.34 * scale, 10), mat);
  tip.position.y = -0.1 * scale;
  tip.rotation.x = Math.PI;
  g.add(tip);
  return g;
}

/** Patinho de lago, com corpo que boia. */
export function duck(color = 0xf6f2e8): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), toon(color));
  body.scale.set(1.3, 0.85, 1);
  body.position.y = 0.12;
  g.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.24, 8), toon(color));
  neck.position.set(0, 0.28, 0.14);
  g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), toon(color));
  head.position.set(0, 0.4, 0.16);
  g.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), toon(P.gold));
  beak.position.set(0, 0.39, 0.28);
  beak.rotation.x = Math.PI / 2;
  g.add(beak);
  return g;
}

/**
 * Um patins de rodinha, sozinho.
 *
 * Nasce com a sola em y = 0 e a ponta para +Z, do tamanho de um pe de
 * personagem (~0.28 de comprimento). E a mesma peca que serve de amostra no
 * balcao da lojinha e, mais tarde, de calcado no `CharacterRig` — por isso ela
 * mora no kit e nao dentro de nenhum dos dois.
 *
 * @param cor cor do cano da bota
 */
export function patins(cor: number = P.wallCream): THREE.Group {
  const g = new THREE.Group();
  // etiqueta para o teste conseguir contar os pes calcados
  g.userData.patins = true;
  const RODA = 0.045;

  // a bota fica ACIMA das rodas: o eixo delas e o chao da peca
  const bota = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.15, 0.26), toon(cor));
  bota.position.set(0, RODA * 2 + 0.115, 0.01);
  g.add(bota);

  const cano = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.13, 0.15), toon(cor));
  cano.position.set(0, RODA * 2 + 0.25, -0.04);
  g.add(cano);

  const cadarco = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.04, 0.13), toon(P.frisbee));
  cadarco.position.set(0, RODA * 2 + 0.235, 0.02);
  g.add(cadarco);

  const chassi = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.28), toon(P.metalGrey));
  chassi.position.set(0, RODA * 2 + 0.015, 0.01);
  g.add(chassi);

  // duas rodas de cada lado, como patins de quatro rodinhas
  for (const lado of [-1, 1]) {
    for (const frente of [-1, 1]) {
      const roda = new THREE.Mesh(
        new THREE.CylinderGeometry(RODA, RODA, 0.035, 10),
        toon(P.frisbee),
      );
      roda.rotation.z = Math.PI / 2;
      roda.position.set(lado * 0.062, RODA, 0.01 + frente * 0.095);
      g.add(roda);
    }
  }
  return g;
}

/**
 * A loja de patins do parque.
 *
 * Nao e um quiosque: e um PREDIO pequeno, com vitrine de vidro de verdade,
 * telhado inclinado que avanca sobre a calcada e um balcao lateral so para
 * entregar os patins. O quiosque do sorvete e uma barraca de 2,8 de largura;
 * esta loja tem 7,4 e altura de porta, e a diferenca de escala e o ponto.
 *
 * Nasce com a VITRINE virada para +Z e o balcao de entrega no lado +X, que e
 * de onde a camera isometrica olha — assim a fachada e o atendimento aparecem
 * os dois, em vez de um esconder o outro.
 */
export function skateShop(cor: number = P.fabricBlue): THREE.Group {
  const g = new THREE.Group();
  const LARG = 7.4;
  const PROF = 4.4;
  const ALT = 2.9;
  const claro = toon(P.wallCream);
  const madeira = toon(P.wood);
  const madeiraEscura = toon(P.woodDark);
  const metal = toon(P.metalWhite);

  // ------------------------------------------------------------- fundacao
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(LARG + 1.6, 0.18, PROF + 1.4),
    toon(P.concrete),
  );
  base.position.set(0.4, 0.09, 0.3);
  g.add(base);

  // ---------------------------------------------------------------- caixa
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(LARG, ALT, 0.26), claro);
  fundo.position.set(0, 0.18 + ALT / 2, -PROF / 2);
  g.add(fundo);
  for (const lado of [-1, 1]) {
    const parede = new THREE.Mesh(new THREE.BoxGeometry(0.26, ALT, PROF), claro);
    parede.position.set(lado * (LARG / 2 - 0.13), 0.18 + ALT / 2, 0);
    g.add(parede);
  }

  // ------------------------------------------------------------- vitrine
  // peitoril baixo + tres panos de vidro. O vidro e translucido de verdade
  // (`opacity`), entao da para ver as prateleiras la dentro.
  const peitoril = new THREE.Mesh(new THREE.BoxGeometry(LARG, 0.6, 0.3), madeiraEscura);
  peitoril.position.set(0, 0.48, PROF / 2 - 0.1);
  g.add(peitoril);

  const vidro = toon(P.glass, { opacity: 0.5, doubleSide: true });
  const PANOS = 3;
  const vaoTotal = LARG - 0.5;
  const largPano = vaoTotal / PANOS - 0.16;
  for (let i = 0; i < PANOS; i++) {
    const x = -vaoTotal / 2 + vaoTotal / PANOS * (i + 0.5);
    const pano = new THREE.Mesh(new THREE.BoxGeometry(largPano, 1.75, 0.08), vidro);
    pano.position.set(x, 1.68, PROF / 2 - 0.1);
    g.add(pano);
  }
  // montantes: e o caixilho que faz o vidro ler como vitrine e nao como parede
  for (let i = 0; i <= PANOS; i++) {
    const x = -vaoTotal / 2 + (vaoTotal / PANOS) * i;
    const montante = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.05, 0.22), metal);
    montante.position.set(x, 1.68, PROF / 2 - 0.1);
    g.add(montante);
  }
  const travessa = new THREE.Mesh(new THREE.BoxGeometry(LARG, 0.18, 0.24), metal);
  travessa.position.set(0, 2.68, PROF / 2 - 0.1);
  g.add(travessa);

  // prateleiras atras do vidro, com os pares expostos
  for (const [altura, cores] of [
    [1.15, [P.morango, P.fabricBlue, P.gold]],
    [1.95, [P.maracuja, P.wallCream]],
  ] as const) {
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(LARG - 1.2, 0.1, 0.6), madeira);
    tabua.position.set(0, altura, PROF / 2 - 0.75);
    g.add(tabua);
    cores.forEach((c, i) => {
      const par = new THREE.Group();
      for (const lado of [-1, 1]) {
        const pe = patins(c);
        pe.position.x = lado * 0.09;
        par.add(pe);
      }
      par.scale.setScalar(0.8);
      par.position.set((i - (cores.length - 1) / 2) * 1.5, altura + 0.05, PROF / 2 - 0.75);
      par.rotation.y = 0.3;
      g.add(par);
    });
  }

  // ------------------------------------------------------------- telhado
  // Laje inclinada que AVANCA sobre a calcada: e a sombra dela no chao que da
  // volume a loja de longe.
  const laje = new THREE.Mesh(
    new THREE.BoxGeometry(LARG + 1.1, 0.24, PROF + 1.3),
    madeiraEscura,
  );
  laje.position.set(0, ALT + 0.42, 0.35);
  laje.rotation.x = -0.07;
  g.add(laje);
  // friso claro por baixo: sem ele a laje vira um retangulo marrom chapado, que
  // e o que mais pesa na silhueta vista de cima
  const friso = new THREE.Mesh(
    new THREE.BoxGeometry(LARG + 1.34, 0.08, PROF + 1.54),
    metal,
  );
  friso.position.set(0, ALT + 0.29, 0.35);
  friso.rotation.x = -0.07;
  g.add(friso);

  // A testeira sobe ACIMA da laje, na beirada da frente. Embaixo do beiral ela
  // fica escondida: a camera olha de 34° e o telhado passa por cima do nome.
  // Ela precisa passar A FRENTE da beirada da laje (que chega a PROF/2 + 1.0):
  // 10 cm atras dela ja bastavam para o beiral cortar o nome numa camera que
  // olha de cima.
  const testeira = new THREE.Mesh(new THREE.BoxGeometry(LARG + 1.34, 0.74, 0.22), toon(cor));
  testeira.position.set(0, ALT + 0.46, PROF / 2 + 1.18);
  g.add(testeira);
  const escrito = letreiro('Patins', 3.2, 0.46);
  escrito.position.set(0, ALT + 0.46, PROF / 2 + 1.31);
  g.add(escrito);

  for (const lado of [-1, 1]) {
    const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, ALT + 0.3, 8), metal);
    coluna.position.set(lado * (LARG / 2 + 0.35), (ALT + 0.3) / 2, PROF / 2 + 0.62);
    g.add(coluna);
  }

  // ------------------------------------------------ balcao lateral (+X)
  // E aqui que os patins sao entregues: fica de lado, virado para +X, para nao
  // disputar espaco com a vitrine.
  const bx = LARG / 2 + 0.95;
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.16, 3.0), madeira);
  tampo.position.set(bx, 1.06, 0.2);
  g.add(tampo);
  const bordo = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.0, 10), madeiraEscura);
  bordo.position.set(bx + 0.55, 1.06, 0.2);
  g.add(bordo);
  const saia = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 2.8), claro);
  saia.position.set(bx - 0.1, 0.6, 0.2);
  g.add(saia);

  const abrigo = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 3.2), toon(cor));
  abrigo.position.set(bx + 0.1, 2.35, 0.2);
  g.add(abrigo);
  for (const z of [-1.2, 1.5]) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.35, 8), metal);
    pe.position.set(bx + 0.6, 1.17, 0.2 + z);
    g.add(pe);
  }

  // dois pares no tampo, prontos para levar
  [P.morango, P.gold].forEach((c, i) => {
    const par = new THREE.Group();
    for (const lado of [-1, 1]) {
      const pe = patins(c);
      pe.position.x = lado * 0.09;
      par.add(pe);
    }
    par.position.set(bx, 1.14, -0.55 + i * 1.4);
    par.rotation.y = Math.PI / 2 + 0.2;
    g.add(par);
  });

  return g;
}

/** Cone laranja: marca o campinho, a quadra, a obra. */
export function cone(): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.34), toon(P.frisbee));
  base.position.y = 0.025;
  g.add(base);
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.45, 10), toon(P.frisbee));
  body.position.y = 0.26;
  g.add(body);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.09, 10), toon(0xffffff));
  stripe.position.y = 0.28;
  g.add(stripe);
  return g;
}

/**
 * Casco da piscina: fundo e as quatro paredes internas. Deve ser usado junto
 * de `w.groundWithHoles()`, senao o piso tapa o buraco.
 */
export function poolShell(width: number, depth: number, fundo = 1.5): THREE.Group {
  const g = new THREE.Group();
  const azulejo = toon(0x9fd8e8);
  const esp = 0.12;

  const chao = new THREE.Mesh(new THREE.BoxGeometry(width, esp, depth), toon(0x3f8fb0));
  chao.position.y = -fundo;
  chao.receiveShadow = true;
  g.add(chao);

  for (const [w2, d2, x, z] of [
    [width, esp, 0, -depth / 2],
    [width, esp, 0, depth / 2],
    [esp, depth, -width / 2, 0],
    [esp, depth, width / 2, 0],
  ] as const) {
    const parede = new THREE.Mesh(new THREE.BoxGeometry(w2, fundo, d2), azulejo);
    parede.position.set(x, -fundo / 2, z);
    parede.receiveShadow = true;
    g.add(parede);
  }

  // faixa escura da borda, como azulejo de piscina de clube
  for (const [w2, d2, x, z] of [
    [width + 0.3, 0.18, 0, -depth / 2 - 0.12],
    [width + 0.3, 0.18, 0, depth / 2 + 0.12],
    [0.18, depth + 0.3, -width / 2 - 0.12, 0],
    [0.18, depth + 0.3, width / 2 + 0.12, 0],
  ] as const) {
    const faixa = new THREE.Mesh(new THREE.BoxGeometry(w2, 0.06, d2), toon(0x4b8fb5));
    faixa.position.set(x, 0.02, z);
    g.add(faixa);
  }
  return g;
}

/** Superficie da agua. Transparente para dar pra ver quem esta nadando. */
export function poolWater(width: number, depth: number): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth, 12, 8),
    new THREE.MeshToonMaterial({ color: 0x5fc4e0, transparent: true, opacity: 0.62 }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.12;
  return mesh;
}

export function sunLounger(cor: number = P.fabricBlue): THREE.Group {
  const g = new THREE.Group();
  const quadro = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 1.7), toon(P.metalWhite));
  quadro.position.y = 0.36;
  g.add(quadro);
  const tecido = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 1.5), toon(cor));
  tecido.position.y = 0.42;
  g.add(tecido);
  const encosto = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.7), toon(cor));
  encosto.position.set(0, 0.6, -0.75);
  encosto.rotation.x = -0.75;
  g.add(encosto);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.36, 6), toon(P.metalWhite));
    pe.position.set(x * 0.3, 0.18, z * 0.72);
    g.add(pe);
  }
  return g;
}

export function parasol(cor: number = P.fabricRed): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.12, 12), toon(P.concrete));
  base.position.y = 0.06;
  g.add(base);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.4, 8), toon(P.wood));
  haste.position.y = 1.2;
  g.add(haste);
  const lona = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.5, 12), toon(cor));
  lona.position.y = 2.35;
  g.add(lona);
  const listra = new THREE.Mesh(new THREE.ConeGeometry(1.17, 0.18, 12, 1, true), toon(0xffffff, { doubleSide: true }));
  listra.position.y = 2.2;
  g.add(listra);
  const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), toon(P.gold));
  ponta.position.y = 2.62;
  g.add(ponta);
  return g;
}

export function poolLadder(): THREE.Group {
  const g = new THREE.Group();
  for (const x of [-0.24, 0.24]) {
    const corrimao = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 6, 14, Math.PI), toon(P.metalGrey));
    corrimao.position.set(x, 0.72, -0.22);
    corrimao.rotation.set(0, Math.PI / 2, 0);
    g.add(corrimao);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.5, 8), toon(P.metalGrey));
    haste.position.set(x, 0.05, -0.44);
    g.add(haste);
  }
  for (let i = 0; i < 3; i++) {
    const degrau = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.1), toon(P.metalGrey));
    degrau.position.set(0, -0.15 - i * 0.34, -0.44);
    g.add(degrau);
  }
  return g;
}

/** Boia que fica boiando na agua (anime o y com w.onUpdate). */
export function floatRing(cor: number = P.frisbee): THREE.Group {
  const g = new THREE.Group();
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.16, 10, 20), toon(cor));
  anel.rotation.x = Math.PI / 2;
  g.add(anel);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const listra = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.165, 10, 6, Math.PI / 5), toon(0xffffff));
    listra.rotation.set(Math.PI / 2, 0, a);
    g.add(listra);
  }
  return g;
}

export function showerPost(): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.1, 12), toon(P.concrete));
  base.position.y = 0.05;
  g.add(base);
  const cano = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), toon(P.metalGrey));
  cano.position.y = 1.1;
  g.add(cano);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.07), toon(P.metalGrey));
  braco.position.set(0.22, 2.16, 0);
  g.add(braco);
  const crivo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.1, 12), toon(P.metalWhite));
  crivo.position.set(0.44, 2.08, 0);
  g.add(crivo);
  return g;
}

/** Trampolim baixo da beira da piscina. */
export function divingBoard(): THREE.Group {
  const g = new THREE.Group();
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), toon(P.concrete));
  pedestal.position.y = 0.4;
  g.add(pedestal);
  const prancha = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 2.4), toon(0xf0f4f6));
  prancha.position.set(0, 0.85, 1.0);
  g.add(prancha);
  for (const x of [-0.36, 0.36]) {
    const corrimao = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.04, 6, 14, Math.PI), toon(P.metalGrey));
    corrimao.position.set(x, 0.9, 0.1);
    corrimao.rotation.set(0, Math.PI / 2, 0);
    g.add(corrimao);
  }
  return g;
}

/** Casquinha de sorvete. Use w.onUpdate + a posicao da mao para "entregar". */
export function iceCream(sabor: number = P.flowerPink): THREE.Group {
  const g = new THREE.Group();
  const casquinha = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.22, 10), toon(0xd8a45c));
  casquinha.position.y = -0.02;
  casquinha.rotation.x = Math.PI;
  g.add(casquinha);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), toon(sabor));
  bola.position.y = 0.13;
  g.add(bola);
  const bolinha = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 7), toon(sabor));
  bolinha.position.set(0.03, 0.22, -0.02);
  g.add(bolinha);
  return g;
}

/**
 * Copo de suco com canudo. Irmao da `iceCream()`: nasce na origem, com o
 * fundo do copo em y = 0, para a cena so precisar poe-lo na altura da mao.
 *
 * @param sabor cor do suco (P.morango, P.pessego...)
 */
export function copoDeSuco(sabor: number = P.laranja): THREE.Group {
  const g = new THREE.Group();
  // etiqueta para o teste conseguir achar os copos na cena
  g.userData.suco = true;

  // O CORPO DO COPO E O PROPRIO SUCO. A tentacao e fazer um copo claro com o
  // suco por dentro — em toon shading isso da um cilindro branco e pronto: a
  // parede e opaca, esconde o liquido e ninguem descobre o sabor. Quem tem que
  // ser visto de longe e a cor da fruta, entao ela fica por fora.
  const suco = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.062, 0.26, 12), toon(sabor));
  suco.position.y = 0.13;
  g.add(suco);

  // aro claro na boca do copo: e o que faz ler "copo" e nao "cilindro colorido"
  const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.09, 0.035, 12), toon(0xfdfbf6));
  aro.position.y = 0.25;
  g.add(aro);

  const fundo = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.066, 0.025, 12), toon(0xfdfbf6));
  fundo.position.y = 0.012;
  g.add(fundo);

  const canudo = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 6), toon(0xfdfbf6));
  canudo.position.set(0.04, 0.31, 0.014);
  canudo.rotation.z = -0.34;
  g.add(canudo);

  // rodela de fruta espetada na borda, um tom acima do suco
  const rodela = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.014, 10), toon(P.gold));
  rodela.position.set(-0.085, 0.26, 0);
  rodela.rotation.x = Math.PI / 2;
  rodela.rotation.z = 0.3;
  g.add(rodela);

  return g;
}

/**
 * Cesta de disc golf: poste, aro e as correntes penduradas.
 * É o marco visual que diz "aqui é lugar de jogar frisbee".
 */
export function discGolfBasket(cor: number = P.metalGrey): THREE.Group {
  const g = new THREE.Group();
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.5, 10), toon(cor));
  poste.position.y = 0.75;
  g.add(poste);

  const cesta = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.38, 0.42, 14, 1, true), toon(cor));
  cesta.position.y = 1.0;
  g.add(cesta);

  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.045, 6, 20), toon(cor));
  aro.position.y = 1.72;
  aro.rotation.x = Math.PI / 2;
  g.add(aro);

  const topo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8), toon(cor));
  topo.position.y = 1.9;
  g.add(topo);

  // correntes: linhas verticais do aro até a cesta
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const corrente = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.62, 4), toon(0xc9d0d6));
    corrente.position.set(Math.cos(a) * 0.5, 1.4, Math.sin(a) * 0.5);
    g.add(corrente);
  }
  return g;
}

/** Placar de madeira da quadra. */
export function scoreboard(): THREE.Group {
  const g = new THREE.Group();
  for (const x of [-0.8, 0.8]) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.5, 0.12), toon(P.woodDark));
    pe.position.set(x, 0.75, 0);
    g.add(pe);
  }
  const painel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.12), toon(P.wood));
  painel.position.y = 2.0;
  g.add(painel);
  const faixa = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 0.03), toon(P.frisbee));
  faixa.position.set(0, 2.45, 0.08);
  g.add(faixa);
  // "números" do placar: blocos escuros
  for (const x of [-0.45, 0.45]) {
    const numero = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.03), toon(0x2b2f38));
    numero.position.set(x, 1.9, 0.08);
    g.add(numero);
  }
  return g;
}

/** Arquibancada de três degraus. */
export function bleachers(largura = 4): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const degrau = new THREE.Mesh(
      new THREE.BoxGeometry(largura, 0.16, 0.5),
      toon(i % 2 === 0 ? P.metalWhite : P.metalGrey),
    );
    degrau.position.set(0, 0.25 + i * 0.34, -i * 0.5);
    g.add(degrau);
    const apoio = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.25 + i * 0.34, 0.1), toon(P.metalGrey));
    apoio.position.set(0, (0.25 + i * 0.34) / 2, -i * 0.5 - 0.2);
    g.add(apoio);
  }
  return g;
}

/** Bebedouro de parque. */
export function waterFountain(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.95, 0.36), toon(P.concrete));
  corpo.position.y = 0.48;
  g.add(corpo);
  const cuba = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.12, 12), toon(P.metalWhite));
  cuba.position.set(0, 1.0, 0.05);
  g.add(cuba);
  const bica = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8), toon(P.metalGrey));
  bica.position.set(0, 1.12, -0.06);
  bica.rotation.x = 0.5;
  g.add(bica);
  return g;
}

/** Sacola com discos sobressalentes, largada na beira da quadra. */
export function discBag(): THREE.Group {
  const g = new THREE.Group();
  const bolsa = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.34), toon(0x4a5568));
  bolsa.position.y = 0.2;
  g.add(bolsa);
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.028, 6, 14, Math.PI), toon(0x2f3440));
  alca.position.set(0, 0.42, 0);
  alca.rotation.y = Math.PI / 2;
  g.add(alca);
  const cores = [P.frisbee, 0x5fb0d6, 0xffd85e];
  cores.forEach((c, i) => {
    const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.05, 16), toon(c));
    disco.position.set(0.34 + i * 0.02, 0.06 + i * 0.06, 0.22);
    disco.rotation.z = 0.12;
    g.add(disco);
  });
  return g;
}

/** Refletor alto de quadra. */
export function floodlight(): THREE.Group {
  const g = new THREE.Group();
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 5.5, 8), toon(P.metalGrey));
  poste.position.y = 2.75;
  g.add(poste);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.1), toon(P.metalGrey));
  braco.position.set(0.35, 5.5, 0);
  g.add(braco);
  for (const x of [0.1, 0.6]) {
    const luminaria = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.22), toon(0x3b4250));
    luminaria.position.set(x, 5.62, 0);
    luminaria.rotation.z = -0.35;
    g.add(luminaria);
    const lente = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.03), toon(0xfff0cc, { glow: 0.25 }));
    lente.position.set(x + 0.04, 5.52, 0);
    lente.rotation.z = -0.35;
    g.add(lente);
  }
  return g;
}

/** Biruta: diz de que lado o vento está indo. Anime a rotação com w.onUpdate. */
export function windsock(): THREE.Group {
  const g = new THREE.Group();
  const mastro = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 3.0, 8), toon(P.metalGrey));
  mastro.position.y = 1.5;
  g.add(mastro);

  const manga = new THREE.Group();
  manga.position.y = 2.9;
  const faixas = [P.frisbee, 0xffffff, P.frisbee, 0xffffff];
  faixas.forEach((cor, i) => {
    const raioA = 0.26 - i * 0.04;
    const raioB = 0.22 - i * 0.04;
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(raioA, raioB, 0.3, 12, 1, true),
      toon(cor, { doubleSide: true }),
    );
    seg.rotation.z = Math.PI / 2;
    seg.position.x = 0.2 + i * 0.3;
    manga.add(seg);
  });
  g.add(manga);
  g.userData.manga = manga;
  return g;
}

/**
 * Palavra escrita, como um plano solto olhando para +Z. A textura é desenhada
 * num canvas em tempo de execução — continua sendo tudo procedural, nenhum
 * arquivo de imagem entra no repositório.
 *
 * Quem usa: `textSign()` (a placa do ponto de ônibus) e o letreiro do quiosque.
 */
export function letreiro(
  texto: string,
  largura: number,
  altura: number,
  corTexto = '#ffffff',
): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = Math.max(64, Math.round((384 * altura) / largura));
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = corTexto;
    ctx.font = `bold ${Math.round(canvas.height * 0.62)}px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2 + 4);
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(largura, altura),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
}

/** Placa de rua com texto de verdade, num poste. */
export function textSign(texto: string, corPlaca: number = P.fabricBlue, corTexto = '#ffffff'): THREE.Group {
  const g = new THREE.Group();
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), toon(P.metalGrey));
  poste.position.y = 1.2;
  g.add(poste);

  const largura = 2.1;
  const altura = 0.9;
  const placa = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.1), toon(corPlaca));
  placa.position.y = 2.45;
  g.add(placa);

  const moldura = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.12, altura + 0.12, 0.06), toon(P.metalWhite));
  moldura.position.set(0, 2.45, -0.03);
  g.add(moldura);

  const texto3d = letreiro(texto, largura * 0.86, altura * 0.68, corTexto);
  texto3d.position.set(0, 2.45, 0.06);
  g.add(texto3d);
  return g;
}

/** Ônibus urbano parado no ponto. */
export function bus(cor: number = 0x3f7fd6): THREE.Group {
  const g = new THREE.Group();
  const comp = 8.4;
  const alt = 2.6;
  const larg = 2.5;

  const corpo = new THREE.Mesh(new THREE.BoxGeometry(comp, alt, larg), toon(cor));
  corpo.position.y = 1.55;
  g.add(corpo);

  const teto = new THREE.Mesh(new THREE.BoxGeometry(comp - 0.2, 0.22, larg - 0.15), toon(P.metalWhite));
  teto.position.y = 2.9;
  g.add(teto);

  const faixa = new THREE.Mesh(new THREE.BoxGeometry(comp + 0.04, 0.3, larg + 0.04), toon(P.metalWhite));
  faixa.position.y = 0.6;
  g.add(faixa);

  // janelas dos dois lados
  for (const z of [larg / 2 + 0.02, -larg / 2 - 0.02]) {
    for (let i = 0; i < 4; i++) {
      const janela = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.05), toon(P.glass, { glow: 0.12 }));
      janela.position.set(-comp / 2 + 1.4 + i * 1.85, 2.1, z);
      g.add(janela);
    }
  }

  // para-brisa e traseira
  for (const [x, rot] of [[comp / 2 + 0.02, 0], [-comp / 2 - 0.02, 0]] as const) {
    const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, larg - 0.5), toon(P.glass, { glow: 0.12 }));
    vidro.position.set(x, 2.1, 0);
    vidro.rotation.y = rot;
    g.add(vidro);
  }

  // porta sanfonada
  const porta = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.9, 1.0), toon(0x2b3440));
  porta.position.set(comp / 2 - 1.6, 1.2, larg / 2 + 0.02);
  g.add(porta);

  // letreiro de destino
  const letreiro = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.34, 0.05), toon(0x1f2229));
  letreiro.position.set(comp / 2 - 0.4, 2.75, larg / 2 + 0.02);
  g.add(letreiro);

  for (const [x, z] of [[comp / 2 - 1.9, larg / 2], [comp / 2 - 1.9, -larg / 2], [-comp / 2 + 1.6, larg / 2], [-comp / 2 + 1.6, -larg / 2]] as const) {
    const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 14), toon(0x22242a));
    roda.position.set(x, 0.5, z);
    roda.rotation.x = Math.PI / 2;
    g.add(roda);
    const calota = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.38, 12), toon(P.metalGrey));
    calota.position.set(x, 0.5, z);
    calota.rotation.x = Math.PI / 2;
    g.add(calota);
  }
  return g;
}

/** Ponto de ônibus com cobertura e banco. */
export function busStop(cor: number = P.metalGrey): THREE.Group {
  const g = new THREE.Group();
  for (const x of [-1.5, 1.5]) {
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.5, 8), toon(cor));
    poste.position.set(x, 1.25, -0.6);
    g.add(poste);
  }
  const cobertura = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 1.6), toon(cor));
  cobertura.position.set(0, 2.5, -0.2);
  cobertura.rotation.x = -0.06;
  g.add(cobertura);
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 0.08), toon(P.glass, { glow: 0.08 }));
  fundo.position.set(0, 1.35, -1.15);
  g.add(fundo);
  const banco = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 0.4), toon(P.wood));
  banco.position.set(0, 0.5, -0.9);
  g.add(banco);
  for (const x of [-1.2, 1.2]) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.36), toon(cor));
    pe.position.set(x, 0.25, -0.9);
    g.add(pe);
  }
  return g;
}
