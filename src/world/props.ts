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
const ALTURA_DO_CANTEIRO = 0.24;

/**
 * A alvenaria do canteiro: mureta, tampa e a terra dentro. É a parte que as
 * duas variantes (o de flor e o de palmeira) dividem.
 *
 * A FORRAÇÃO é o que faz o canteiro parecer plantado em vez de meio vazio: uma
 * calota rasa de verde cobrindo quase todo o vão, com os maços de flor por
 * cima. Sem ela sobra terra marrom aparecendo entre um maço e outro, e o
 * canteiro lê como um vaso que ninguém regou.
 *
 * Ela é CALOTA e não disco por um motivo: disco na altura da terra ficaria
 * coplanar com ela e piscaria. Superfície curva não tem esse problema.
 */
function baseDeCanteiro(raio: number): THREE.Group {
  const g = new THREE.Group();
  const altura = ALTURA_DO_CANTEIRO;

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

  const forracao = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.9, 16, 8), toon(P.leafMid));
  forracao.scale.y = 0.11;
  forracao.position.y = altura - 0.04;
  g.add(forracao);

  return g;
}

/**
 * Canteiro de flores com borda de alvenaria.
 *
 * TUDO ESCALA COM O RAIO. Antes o maço tinha 0,2 fixo, então um canteiro de
 * 1,4 ganhava as mesmas sete moitinhas de um de 1,1 e ficava ralo — quanto
 * maior o canteiro, mais vazio ele parecia. Aqui o tamanho da moita, o da flor
 * e o número de maços saem todos do raio.
 *
 * Os maços vêm em DOIS ANÉIS mais um no meio, e não num anel só: um anel
 * sozinho deixa o miolo pelado, que era o que mais chamava atenção de cima.
 */
export function canteiro(
  raio = 1.1,
  cores: number[] = [P.flowerPink, P.flowerYellow, 0xffffff, 0xb98fe0],
  semente = 0.5,
): THREE.Group {
  const g = baseDeCanteiro(raio);
  const altura = ALTURA_DO_CANTEIRO;
  const giro = semente * 6.28;

  /** [ângulo, distância do centro] de cada maço */
  const lugares: Array<[number, number]> = [[giro * 1.7, 0]];
  const externos = Math.round(9 * raio);
  const internos = Math.round(5 * raio);
  for (let i = 0; i < externos; i++) {
    lugares.push([(i / externos) * Math.PI * 2 + giro, raio * 0.68]);
  }
  for (let i = 0; i < internos; i++) {
    lugares.push([(i / internos) * Math.PI * 2 + giro + 0.7, raio * 0.36]);
  }

  const rMoita = raio * 0.2;
  const rFlor = raio * 0.068;

  lugares.forEach(([a, d], i) => {
    const cor = cores[i % cores.length];
    // um empurrãozinho pseudoaleatório, senão os dois anéis viram alvo de tiro
    const solto = ((i * 37 + semente * 100) % 10) / 10 - 0.5;
    const cx = Math.cos(a) * d + solto * raio * 0.08;
    const cz = Math.sin(a) * d - solto * raio * 0.08;

    const folhagem = new THREE.Mesh(new THREE.SphereGeometry(rMoita, 8, 6), toon(P.leafDark));
    folhagem.position.set(cx, altura + rMoita * 0.3, cz);
    folhagem.scale.y = 0.55;
    g.add(folhagem);

    // seis flores por maço, em duas alturas: quatro na roda de fora e duas
    // espetadas mais no alto, no meio
    for (let k = 0; k < 6; k++) {
      const naBorda = k < 4;
      const b = (k / (naBorda ? 4 : 2)) * Math.PI * 2 + i + (naBorda ? 0 : 0.8);
      const dFlor = naBorda ? rMoita * 0.62 : rMoita * 0.24;
      const flor = new THREE.Mesh(new THREE.SphereGeometry(rFlor, 8, 6), toon(cor));
      flor.position.set(
        cx + Math.cos(b) * dFlor,
        altura + rMoita * (naBorda ? 0.72 : 1.05) + ((k + i) % 3) * raio * 0.04,
        cz + Math.sin(b) * dFlor,
      );
      flor.scale.y = 0.8;
      g.add(flor);
    }
  });
  return g;
}

/**
 * A mesma jardineira, mas com uma PALMEIRA plantada no meio em vez de flores.
 *
 * É o canteiro de calçadão de clube: mureta redonda, forração verde no vão e
 * uma palmeira saindo do meio. As moitas em volta do tronco escondem a base
 * dele — palmeira nascendo direto da terra lisa parece espetada.
 *
 * @param escala tamanho da palmeira; 1 dá uma de ~3,5 de altura
 */
export function canteiroComPalmeira(raio = 1.3, escala = 1, semente = 0.5): THREE.Group {
  const g = baseDeCanteiro(raio);
  const altura = ALTURA_DO_CANTEIRO;

  const palmeira = tree('palmeira', escala, semente);
  // ela nasce na TERRA, não no chão: a base da peça fica no topo da mureta
  palmeira.position.y = altura;
  g.add(palmeira);

  const moitas = Math.round(7 * raio);
  for (let i = 0; i < moitas; i++) {
    const a = (i / moitas) * Math.PI * 2 + semente * 6.28;
    const d = raio * (0.45 + (((i * 53 + semente * 100) % 10) / 10) * 0.28);
    const r = raio * (0.15 + (((i * 29) % 7) / 7) * 0.07);
    const moita = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), toon(i % 2 ? P.leafDark : P.bush));
    moita.position.set(Math.cos(a) * d, altura + r * 0.3, Math.sin(a) * d);
    moita.scale.y = 0.6;
    g.add(moita);
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
  // etiqueta para o caçador de z-fighting achar a peça na cena
  g.userData.peca = 'quiosque';
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

  // Ripado da frente, só nas beiradas: o miolo é a janela de atendimento.
  //
  // A moldura de madeira é 5 cm mais LARGA que o corpo, de propósito. Antes ela
  // tinha exatamente a mesma largura (2,35), então as faces laterais dos dois
  // caíam no mesmo plano e serrilhavam numa faixa vertical na quina — e nem dá
  // para resolver estreitando, porque aí a madeira sumiria dentro do bege.
  // Saliente resolve o brilho E fica melhor: vira um batente de verdade.
  //
  // A verga é 1 cm mais funda e 4 cm mais larga que os pilares, e os dois param
  // 2 cm abaixo do topo da parede. Sem essas três folgas eles compartilhavam
  // face com face em CINCO planos (as duas laterais, a frente, o fundo e o
  // topo), porque tinham exatamente a mesma espessura e a mesma altura.
  for (const lado of [-1, 1]) {
    const pilar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.7, 0.14), madeira);
    pilar.position.set(lado * 1.1, 0.99, 0.68);
    g.add(pilar);
  }
  const verga = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.22, 0.16), madeira);
  verga.position.set(0, 1.715, 0.68);
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
  // desce 2 cm para dentro do corpo: em y = 1,94 a base da laje caía exatamente
  // no topo da parede (1,86), e a linha do beiral piscava
  const cobertura = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.16, 1.55), madeiraEscura);
  cobertura.position.set(0, 1.92, -0.05);
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

  // Quadro de preços pendurado na lateral.
  //
  // As distâncias aqui são todas contra Z-FIGHTING, e cada uma já apareceu
  // serrilhando na tela:
  // - o quadro entra 4 cm no corpo (que acaba em x = 1,175), em vez de encostar;
  // - as linhas nascem à FRENTE da face do quadro, sem tocá-la. Antes a face de
  //   trás da linha (1,23) caía exatamente na face da frente do quadro (1,23), e
  //   as listras brancas piscavam em faixa toda vez que a câmera girava.
  const quadro = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.5), toon(0x36302c));
  quadro.position.set(1.16, 1.3, 0.15);
  g.add(quadro);
  for (let i = 0; i < 3; i++) {
    const linha = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.045, 0.3 - i * 0.06), toon(claro));
    linha.position.set(1.205, 1.46 - i * 0.16, 0.15);
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

/**
 * Aro de frisbee: um alvo para acertar de longe.
 *
 * O buraco fica no eixo Z do grupo, entao `w.place(..., giro)` aponta o aro
 * para o lado de onde o disco vem. `userData.aro` volta a rosca de fora, que a
 * cena gira quando alguem acerta.
 */
export function aroDeFrisbee(cor: number = P.frisbee, altura = 1.9, raio = 0.62): THREE.Group {
  const g = new THREE.Group();
  const lado = raio + 0.34;

  // o poste sai na cor do alvo, não em branco: branco em cima do alambrado
  // branco desaparece, e alvo que não se vê não é alvo
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, altura + raio, 10), toon(cor));
  poste.position.set(-lado, (altura + raio) / 2, 0);
  g.add(poste);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.12, 12), toon(P.metalGrey));
  base.position.set(-lado, 0.06, 0);
  g.add(base);

  // o bracinho que segura o aro pelo lado
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.07, 0.07), toon(cor));
  braco.position.set(-lado + 0.18, altura, 0);
  g.add(braco);

  const aro = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.06, 8, 26), toon(cor));
  aro.position.y = altura;
  g.add(aro);

  // fitinhas penduradas: dao o vento e deixam o alvo visivel de longe
  for (const a of [-0.9, -0.3, 0.3, 0.9]) {
    const fita = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.02), flat(P.gold));
    fita.position.set(Math.sin(a) * raio, altura - Math.cos(a) * raio - 0.17, 0);
    g.add(fita);
  }

  g.traverse((n) => {
    const m = n as THREE.Mesh;
    if (m.isMesh) m.castShadow = true;
  });
  g.userData.aro = aro;
  return g;
}

/**
 * A marca de onde o disco vai cair.
 *
 * Fica na grama, entao quem usa so mexe em `position.x/z` e em `scale`.
 *
 * Duas escolhas que parecem detalhe e nao sao. Primeiro, o anel e um TORO de
 * verdade e nao um disco chapado: decalque coplanar com a grama perde a briga
 * de profundidade com as linhas pintadas da quadra e simplesmente some — foi o
 * que aconteceu na primeira versao. Segundo, a haste em pe: em camera
 * isometrica um desenho deitado no chao se esconde atras de qualquer coisa e
 * some na distancia, e a haste e o que faz a marca ser achada de relance.
 */
export function marcaDeMira(cor: number = P.frisbee): THREE.Group {
  const g = new THREE.Group();
  const mat = flat(cor, 0.92);

  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.075, 8, 28), mat);
  anel.rotation.x = -Math.PI / 2;
  anel.position.y = 0.08;
  g.add(anel);

  const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.07, 14), mat);
  miolo.position.y = 0.08;
  g.add(miolo);

  // quatro tracinhos nas pontas: dao o giro e ajudam a ler a distancia
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const risco = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.36), mat);
    risco.rotation.y = a;
    risco.position.set(Math.sin(a) * 1.3, 0.08, Math.cos(a) * 1.3);
    g.add(risco);
  }

  const haste = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.5, 0.07), mat);
  haste.position.y = 0.75;
  g.add(haste);

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
/**
 * Arquibancada de tres degraus.
 *
 * A versao antiga encostava tudo em tudo e serrilhava a lateral inteira: eram
 * TRES pares de faces coplanares brigando pelo mesmo pixel.
 *
 *   1. a face de tras de cada degrau caia exatamente na face de tras do proprio
 *      apoio (as duas em `z = -0,5i - 0,25`);
 *   2. a face da frente do degrau de cima caia na face de tras do de baixo,
 *      porque a profundidade (0,5) era igual ao passo entre eles (0,5);
 *   3. degrau e apoio tinham a MESMA largura, entao as duas faces laterais
 *      coincidiam de ponta a ponta.
 *
 * A correcao e a mesma nos tres: sobrepor de leve em vez de encostar. O degrau
 * ficou mais fundo que o passo, e o apoio entrou para dentro nos dois eixos —
 * ele e o suporte, entao viver na sombra do degrau e onde ele deveria estar.
 */
export function bleachers(largura = 4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arquibancada';
  const PASSO = 0.5;
  for (let i = 0; i < 3; i++) {
    const alto = 0.25 + i * 0.34;
    // 0,54 de profundidade para 0,5 de passo: 4 cm de sobreposicao entre um
    // degrau e o seguinte, e nenhuma face compartilhada
    const degrau = new THREE.Mesh(
      new THREE.BoxGeometry(largura, 0.16, PASSO + 0.04),
      toon(i % 2 === 0 ? P.metalWhite : P.metalGrey),
    );
    degrau.position.set(0, alto, -i * PASSO);
    g.add(degrau);

    // mais estreito e recuado: fica inteiro dentro da projecao do degrau
    const apoio = new THREE.Mesh(
      new THREE.BoxGeometry(largura - 0.08, alto, 0.1),
      toon(P.metalGrey),
    );
    apoio.position.set(0, alto / 2, -i * PASSO - 0.19);
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

/* ------------------------------------------------------------------------ *
 *                       O RESTAURANTE DO CLUBE
 * ------------------------------------------------------------------------ */

/**
 * Cadeira de área externa: assento, encosto de ripas e quatro pés tortos.
 *
 * Fica em `props.ts` e não em `furniture.ts` de propósito — a do kit de
 * interior (`chair()`) é uma cadeira de sala, com pé grosso de madeira. Esta é
 * de pátio: mais leve, de tubo, e a mesma cor do toldo.
 */
export function cadeiraDePatio(cor: number = P.restauranteToldo): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cadeira-de-patio';
  const tubo = toon(P.metalWhite);

  const assento = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.44), toon(cor));
  assento.position.y = 0.45;
  g.add(assento);

  // Encosto: três ripas com folga entre elas. A folga é o que faz a cadeira
  // parecer de pátio em vez de um bloco — e nenhuma ripa encosta na outra.
  for (let i = 0; i < 3; i++) {
    const ripa = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.05), toon(cor));
    ripa.position.set(0, 0.62 + i * 0.13, -0.2);
    g.add(ripa);
  }
  for (const lado of [-1, 1] as const) {
    const montante = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.55, 6), tubo);
    montante.position.set(lado * 0.21, 0.7, -0.21);
    g.add(montante);
  }

  // pés: os de trás sobem até o encosto, os da frente param no assento
  for (const [x, z] of [[-0.19, 0.18], [0.19, 0.18], [-0.19, -0.18], [0.19, -0.18]] as const) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.45, 6), tubo);
    pe.position.set(x, 0.22, z);
    // abre um fio para fora: cadeira de perna reta parece banquinho
    pe.rotation.z = -Math.sign(x) * 0.05;
    pe.rotation.x = Math.sign(z) * 0.05;
    g.add(pe);
  }
  return g;
}

/**
 * Mesa redonda de área externa com quatro cadeiras e um vasinho no meio.
 *
 * As cadeiras nascem giradas em `lado * PI/2` em volta do tampo, e a rotação
 * entra ANTES da posição no código só por leitura — quem manda é a matriz, e
 * `position` e `rotation` são independentes num `Object3D`.
 */
export function mesaDePatio(cor: number = P.restauranteToldo): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-de-patio';

  const tampo = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.07, 20), toon(P.metalWhite));
  tampo.position.y = 0.74;
  g.add(tampo);
  // aro da borda, um fio abaixo do tampo para não brigar de face com ele
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 6, 20), toon(cor));
  aro.rotation.x = Math.PI / 2;
  aro.position.y = 0.72;
  g.add(aro);

  const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.72, 10), toon(P.metalGrey));
  coluna.position.y = 0.36;
  g.add(coluna);
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.06, 14), toon(P.metalGrey));
  pe.position.y = 0.03;
  g.add(pe);

  // vasinho no centro, que é o detalhe que diz "mesa posta" de longe
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.16, 10), toon(P.plantPot));
  vaso.position.y = 0.855;
  g.add(vaso);
  for (const [dx, dz, alto] of [[0, 0, 0.16], [0.05, 0.03, 0.12], [-0.04, -0.04, 0.13]] as const) {
    const flor = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), toon(P.flowerPink));
    flor.position.set(dx, 0.93 + alto * 0.5, dz);
    g.add(flor);
  }

  for (let i = 0; i < 4; i++) {
    const cadeira = cadeiraDePatio(cor);
    const a = (i * Math.PI) / 2;
    cadeira.position.set(Math.sin(a) * 1.02, 0, Math.cos(a) * 1.02);
    // a cadeira olha para o centro da mesa: `a + PI`
    cadeira.rotation.y = a + Math.PI;
    g.add(cadeira);
  }
  return g;
}

/**
 * O restaurante do clube. Prédio grande, com fachada envidraçada, toldo
 * listrado, letreiro de verdade e telhado de duas águas.
 *
 * TUDO OLHA PARA `+Z`, que é de onde a câmera vem. É a regra de peça com
 * frente: virada para o outro lado ela mostraria só a empena lisa.
 *
 * O TOLDO É A ARMADILHA DESTA PEÇA. A câmera olha de cima em 34°, então um
 * toldo fundo demais passa na frente da porta e engole a entrada. O raio que
 * sai da ponta do toldo desce `tan(34°) ≈ 0,67` por unidade de profundidade:
 * com o toldo a `3,5` e avançando `0,85`, na linha da fachada ele já está em
 * `3,5 - 0,57 = 2,93` — bem acima do topo da porta, em `2,3`. É a mesma conta
 * que o `kiosk()` teve que aprender na marca.
 *
 * @param largura vão da fachada em X
 * @param profundidade quanto o prédio avança em Z
 */
export function restaurante(largura = 13, profundidade = 7): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'restaurante';

  const hx = largura / 2;
  const hz = profundidade / 2;
  const altura = 4.2;

  const parede = toon(P.restauranteParede);
  const esquadria = toon(P.restauranteEsquadria);
  const vidro = toon(P.glass, { glow: 0.14 });

  // ------------------------------------------------------------ embasamento
  // Um soco de concreto meio palmo mais largo que o prédio. Ele resolve duas
  // coisas: dá o degrau que todo salão de festas tem, e afasta a parede do
  // chão — parede terminando exatamente no piso serrilha na beirada.
  const soco = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.5, 0.34, profundidade + 0.5),
    toon(P.concrete),
  );
  soco.position.y = 0.17;
  g.add(soco);

  // --------------------------------------------------------------- corpo
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, profundidade), parede);
  corpo.position.y = 0.34 + altura / 2;
  g.add(corpo);

  // faixa horizontal de um tom abaixo, na altura do peitoril: sem ela a
  // fachada vira um paredão chapado de 13 metros
  const faixa = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.06, 0.28, profundidade + 0.06),
    toon(P.restauranteFaixa),
  );
  faixa.position.y = 1.16;
  g.add(faixa);

  // ------------------------------------------------------------- fachada
  const zF = hz + 0.03;
  const PORTA = 2.4;

  /** Um pano de vidro com caixilho de madeira, colado na fachada. */
  const janelao = (x: number, larg: number, alt: number, y: number, z = zF): void => {
    const moldura = new THREE.Mesh(new THREE.BoxGeometry(larg, alt, 0.1), esquadria);
    moldura.position.set(x, y, z);
    g.add(moldura);
    // o vidro avança 3 cm da moldura: face contra face na mesma altura pisca
    const pano = new THREE.Mesh(new THREE.BoxGeometry(larg - 0.22, alt - 0.22, 0.08), vidro);
    pano.position.set(x, y, z + 0.03);
    g.add(pano);
    // Montante central, dividindo o pano em dois. Ele é 6 cm MAIS ALTO que o
    // pano de propósito: com a mesma altura os dois dividiriam as faces de cima
    // e de baixo, e face contra face na mesma altura pisca.
    const meio = new THREE.Mesh(new THREE.BoxGeometry(0.09, alt - 0.16, 0.12), esquadria);
    meio.position.set(x, y, z + 0.04);
    g.add(meio);
  };

  // dois janelões de cada lado da porta
  for (const lado of [-1, 1] as const) {
    janelao(lado * (PORTA / 2 + 1.55), 2.5, 2.0, 2.1);
    janelao(lado * (PORTA / 2 + 4.35), 2.5, 2.0, 2.1);

    // FLOREIRA sob cada janelão — o detalhe que faz o prédio parecer cuidado
    for (const dx of [PORTA / 2 + 1.55, PORTA / 2 + 4.35]) {
      const caixa = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.3, 0.34), toon(P.plantPot));
      caixa.position.set(lado * dx, 1.02, zF + 0.16);
      g.add(caixa);
      for (let i = 0; i < 5; i++) {
        const moita = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), toon(P.bush));
        moita.position.set(lado * dx - 0.85 + i * 0.42, 1.24, zF + 0.16);
        g.add(moita);
        const flor = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5),
          toon(i % 2 ? P.flowerYellow : P.flowerPink));
        flor.position.set(lado * dx - 0.85 + i * 0.42, 1.38, zF + 0.2);
        g.add(flor);
      }
    }
  }

  // ---------------------------------------------------------------- porta
  // Porta dupla de vidro, recuada 6 cm para dentro do batente.
  // O batente e as folhas MERGULHAM no soco, e em alturas diferentes (0,28 e
  // 0,32). Se os três terminassem no mesmo 0,34 em que a parede começa, as três
  // faces de baixo cairiam no mesmo plano.
  const batente = new THREE.Mesh(new THREE.BoxGeometry(PORTA + 0.34, 2.5, 0.14), esquadria);
  batente.position.set(0, 1.53, zF);
  g.add(batente);
  for (const lado of [-1, 1] as const) {
    const folha = new THREE.Mesh(new THREE.BoxGeometry(PORTA / 2 - 0.07, 2.3, 0.07), vidro);
    folha.position.set(lado * (PORTA / 4 + 0.02), 1.47, zF + 0.02);
    g.add(folha);
    const puxador = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 6), toon(P.metalGrey));
    puxador.position.set(lado * 0.16, 1.35, zF + 0.09);
    g.add(puxador);
  }
  // soleira: dois degraus que descem do soco até o piso
  for (const [i, larg] of [[0, PORTA + 1.4], [1, PORTA + 2.0]] as const) {
    const degrau = new THREE.Mesh(
      new THREE.BoxGeometry(larg, 0.17 + i * 0.02, 0.42),
      toon(P.concrete),
    );
    degrau.position.set(0, 0.25 - i * 0.17, hz + 0.28 + i * 0.4);
    g.add(degrau);
  }

  // --------------------------------------------------------------- toldo
  // Listrado, com babado recortado na ponta. Ver a conta no cabeçalho: a 3,5
  // de altura e avançando 0,85, ele não alcança o topo da porta.
  const yToldo = 3.15;
  const avanco = 0.7;
  const larguraToldo = largura - 1.2;
  const listras = 13;
  const passo = larguraToldo / listras;
  for (let i = 0; i < listras; i++) {
    const lona = new THREE.Mesh(
      new THREE.BoxGeometry(passo, 0.12, avanco),
      toon(i % 2 ? P.metalWhite : P.restauranteToldo),
    );
    lona.position.set(-larguraToldo / 2 + passo * (i + 0.5), yToldo, hz + avanco / 2);
    lona.rotation.x = -0.12; // caimento para a frente
    g.add(lona);
    // o babado: um triangulinho pendurado na ponta de cada listra
    const babado = new THREE.Mesh(
      new THREE.ConeGeometry(passo * 0.5, 0.26, 3),
      toon(i % 2 ? P.metalWhite : P.restauranteToldo),
    );
    babado.rotation.x = Math.PI;
    babado.position.set(-larguraToldo / 2 + passo * (i + 0.5), yToldo - 0.13, hz + avanco - 0.02);
    g.add(babado);
  }
  // as duas mãos-francesas que seguram o toldo
  for (const lado of [-1, 1] as const) {
    const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 6), toon(P.metalGrey));
    braco.position.set(lado * (larguraToldo / 2 - 0.1), yToldo - 0.35, hz + 0.4);
    braco.rotation.x = Math.PI / 2.6;
    g.add(braco);
  }

  // ------------------------------------------------------------ letreiro
  // A placa fica ACIMA do toldo, senão ele a esconde. O texto sai de um canvas
  // em tempo de execução — é a única "textura" que o projeto permite.
  const yPlaca = 4.05;
  const placa = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.7, 0.16), toon(P.restauranteEsquadria));
  placa.position.set(0, yPlaca, hz + 0.06);
  g.add(placa);
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(5.36, 0.84, 0.1), toon(P.restauranteToldo));
  moldura.position.set(0, yPlaca, hz + 0.02);
  g.add(moldura);
  const texto = letreiro('Restaurante', 4.5, 0.56, '#fdf6e8');
  texto.position.set(0, yPlaca, hz + 0.15);
  g.add(texto);

  // arandelas dos dois lados da porta
  for (const lado of [-1, 1] as const) {
    const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6), toon(P.metalGrey));
    braco.rotation.x = Math.PI / 2;
    braco.position.set(lado * (PORTA / 2 + 0.42), 2.5, hz + 0.13);
    g.add(braco);
    const lampiao = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), toon(P.gold, { glow: 0.5 }));
    lampiao.position.set(lado * (PORTA / 2 + 0.42), 2.44, hz + 0.24);
    g.add(lampiao);
  }

  // ------------------------------------------------------------- telhado
  // Duas águas com beiral, e a conta importa: a cumeeira fica em `CUMEEIRA`
  // acima do topo da parede, o beiral desce até a altura da parede a `balanco`
  // além dela. Daí saem a inclinação e o comprimento da água — e as duas se
  // encontram exatamente na linha do meio.
  //
  // O SINAL DA INCLINAÇÃO já mordeu aqui: a água da FRENTE (`lado = +1`) tem
  // que descer para `+Z`, e `rotation.x` positivo é que leva o `+Z` local para
  // baixo. Com o sinal trocado o telhado sobe para a frente e vira um funil.
  const yBeiral = 0.34 + altura;
  const CUMEEIRA = 1.1;
  const balanco = 0.55;
  const corrida = hz + balanco;
  const inclinacao = Math.atan2(CUMEEIRA, corrida);
  const agua = Math.hypot(corrida, CUMEEIRA);
  for (const lado of [-1, 1] as const) {
    const telha = new THREE.Mesh(
      new THREE.BoxGeometry(largura + 1.0, 0.18, agua),
      toon(P.roofTile),
    );
    telha.position.set(0, yBeiral + CUMEEIRA / 2, lado * corrida / 2);
    telha.rotation.x = lado * inclinacao;
    g.add(telha);
  }
  const cumeeira = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 1.06, 0.2, 0.42),
    toon(P.roofTile),
  );
  cumeeira.position.set(0, yBeiral + CUMEEIRA + 0.06, 0);
  g.add(cumeeira);

  // As EMPENAS, os dois triângulos que fecham as laterais debaixo do telhado.
  //
  // Elas são um prisma triangular de verdade (`ExtrudeGeometry` de um
  // triângulo), e não um cone de 3 lados: cone de 3 segmentos é uma pirâmide,
  // que de perfil não é triângulo nenhum. A forma nasce no plano XY e o giro de
  // `PI/2` em Y leva a espessura da extrusão para o X do mundo.
  const perfil = new THREE.Shape();
  perfil.moveTo(-hz, 0);
  perfil.lineTo(hz, 0);
  perfil.lineTo(0, CUMEEIRA);
  perfil.closePath();
  const formaEmpena = new THREE.ExtrudeGeometry(perfil, { depth: 0.3, bevelEnabled: false });
  for (const lado of [-1, 1] as const) {
    const empena = new THREE.Mesh(formaEmpena, parede);
    empena.rotation.y = Math.PI / 2;
    // a extrusão cresce para o `+X` do mundo depois do giro, então a da direita
    // precisa começar 0,3 antes da parede para terminar nela
    empena.position.set(lado > 0 ? hx - 0.3 : -hx, yBeiral, 0);
    g.add(empena);
  }

  // --------------------------------------------------- cozinha, no telhado
  const chamine = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.5, 0.7), toon(P.brick));
  chamine.position.set(hx - 2.2, yBeiral + 1.2, -hz * 0.35);
  g.add(chamine);
  const capa = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.9), toon(P.concrete));
  capa.position.set(hx - 2.2, yBeiral + 2.0, -hz * 0.35);
  g.add(capa);
  // a coifa da cozinha: cilindro deitado com um chapéu
  const coifa = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.85, 10), toon(P.metalGrey));
  coifa.position.set(hx - 4.0, yBeiral + 0.95, -hz * 0.2);
  g.add(coifa);
  const chapeu = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.3, 10), toon(P.metalGrey));
  chapeu.position.set(hx - 4.0, yBeiral + 1.5, -hz * 0.2);
  g.add(chapeu);

  // ------------------------------------------------- lateral e fundos
  // Janelinhas altas na lateral que a câmera vê (+X) e os condensadores do
  // ar-condicionado, que é o que todo restaurante de clube tem pendurado.
  for (let i = 0; i < 3; i++) {
    const jan = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 1.0), vidro);
    jan.position.set(hx + 0.03, 2.5, -hz + 1.4 + i * 1.9);
    g.add(jan);
    const cx = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.94, 1.14), esquadria);
    cx.position.set(hx + 0.005, 2.5, -hz + 1.4 + i * 1.9);
    g.add(cx);
  }
  for (const dz of [-1.3, 0.9]) {
    const cond = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.78), toon(P.metalWhite));
    cond.position.set(hx + 0.24, 1.7, dz);
    g.add(cond);
    const helice = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 12), toon(P.metalGrey));
    helice.rotation.z = Math.PI / 2;
    helice.position.set(hx + 0.46, 1.72, dz);
    g.add(helice);
  }

  return g;
}

/**
 * O vestiário do clube.
 *
 * Trocou o `building()` genérico, que era uma caixa com janelinhas. O que faz
 * um vestiário de piscina parecer um vestiário de piscina, em ordem de
 * importância: a MEIA PAREDE DE AZULEJO, o COBOGÓ (o tijolo vazado que ventila
 * sem deixar ver de fora), a MARQUISE sobre as duas portas e a CAIXA D'ÁGUA no
 * telhado. Nenhum dos quatro existe em prédio nenhum do resto do jogo.
 *
 * A frente olha para `+Z`, como toda peça com frente.
 *
 * A MARQUISE tem a mesma armadilha do toldo do restaurante: a câmera olha de
 * cima em 34°, e o raio que sai da ponta dela desce `0,67` por unidade de
 * profundidade. A 2,75 de altura e avançando 0,7, na linha da fachada ela está
 * em 2,28 — logo acima do topo da porta, em 2,2. Um palmo a mais de avanço e a
 * entrada some.
 */
export function vestiario(largura = 8, profundidade = 5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'vestiario';

  const hx = largura / 2;
  const hz = profundidade / 2;
  const altura = 3.0;
  const ySoco = 0.25;
  const yTopo = ySoco + altura;

  const parede = toon(P.wallCream);
  const azulejo = toon(P.vestiarioAzulejo);
  const concreto = toon(P.concrete);

  // --------------------------------------------------------------- base
  const soco = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.4, ySoco, profundidade + 0.4),
    concreto,
  );
  soco.position.y = ySoco / 2;
  g.add(soco);

  const corpo = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, profundidade), parede);
  corpo.position.y = ySoco + altura / 2;
  g.add(corpo);

  // ------------------------------------------------------- meia parede
  // A faixa de azulejo é uma casca 8 cm maior que o prédio: assim as faces
  // dela ficam FORA das faces da parede, e nenhuma das duas briga por pixel.
  // O pé dela mergulha no soco pelo mesmo motivo.
  const yAzulejo = 1.15;
  const faixa = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.08, yAzulejo, profundidade + 0.08),
    azulejo,
  );
  faixa.position.y = 0.18 + yAzulejo / 2;
  g.add(faixa);
  // duas fiadas de rejunte, e o acabamento de cima
  for (const y of [0.58, 0.92]) {
    const linha = new THREE.Mesh(
      new THREE.BoxGeometry(largura + 0.12, 0.05, profundidade + 0.12),
      toon(P.vestiarioRejunte),
    );
    linha.position.y = y;
    g.add(linha);
  }
  const arremate = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.16, 0.09, profundidade + 0.16),
    toon(P.metalWhite),
  );
  arremate.position.y = 1.33;
  g.add(arremate);

  // ------------------------------------------------------------- portas
  // Duas, lado a lado. A metade de baixo é veneziana — as ripas são o detalhe
  // que diz "porta de vestiário" mesmo de longe.
  const zF = hz + 0.03;
  const LARG_PORTA = 1.05;
  for (const lado of [-1, 1] as const) {
    const cx = lado * 1.15;

    const batente = new THREE.Mesh(
      new THREE.BoxGeometry(LARG_PORTA + 0.26, 2.36, 0.13),
      concreto,
    );
    batente.position.set(cx, 1.16, zF);
    g.add(batente);

    const folha = new THREE.Mesh(
      new THREE.BoxGeometry(LARG_PORTA, 2.16, 0.09),
      toon(P.vestiarioPorta),
    );
    folha.position.set(cx, 1.12, zF + 0.04);
    g.add(folha);

    for (let i = 0; i < 6; i++) {
      const ripa = new THREE.Mesh(
        new THREE.BoxGeometry(LARG_PORTA - 0.18, 0.08, 0.05),
        toon(P.vestiarioRejunte),
      );
      ripa.position.set(cx, 0.42 + i * 0.16, zF + 0.09);
      ripa.rotation.x = 0.35; // inclinada, como veneziana de verdade
      g.add(ripa);
    }

    const macaneta = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 6),
      toon(P.metalGrey),
    );
    macaneta.position.set(cx - lado * (LARG_PORTA / 2 - 0.14), 1.05, zF + 0.11);
    g.add(macaneta);

    // a plaquinha acima de cada porta
    const plaqueta = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.05), toon(P.metalWhite));
    plaqueta.position.set(cx, 2.44, zF + 0.05);
    g.add(plaqueta);
  }

  // ----------------------------------------------------------- marquise
  const yMarquise = 2.75;
  const avanco = 0.7;
  const laje = new THREE.Mesh(
    new THREE.BoxGeometry(largura - 1.0, 0.16, avanco),
    concreto,
  );
  laje.position.set(0, yMarquise, hz + avanco / 2);
  g.add(laje);
  // A testeira, onde vai o nome — é onde fica no vestiário de verdade. Ela é
  // 10 cm mais estreita que a laje e o topo dela para 4 cm abaixo do dela: com
  // as duas do mesmo tamanho, as faces de cima e as das pontas caíam no mesmo
  // plano e serrilhavam.
  const testeira = new THREE.Mesh(
    new THREE.BoxGeometry(largura - 1.1, 0.42, 0.1),
    toon(P.vestiarioPorta),
  );
  testeira.position.set(0, yMarquise - 0.17, hz + avanco);
  g.add(testeira);
  const nome = letreiro('Vestiário', 2.6, 0.3, '#fdf6e8');
  nome.position.set(0, yMarquise - 0.13, hz + avanco + 0.06);
  g.add(nome);
  for (const lado of [-1, 1] as const) {
    const mao = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.1), concreto);
    mao.position.set(lado * (largura / 2 - 0.85), yMarquise - 0.38, hz + 0.14);
    mao.rotation.x = -0.6;
    g.add(mao);
  }

  // ------------------------------------------------------------ cobogó
  // Tijolo vazado: uma fileira de blocos com vão entre eles, alto na parede.
  // É o que ventila o vestiário sem deixar ninguém ver de fora.
  const cobogo = (x: number, y: number, z: number, girado: boolean): void => {
    const bloco = new THREE.Mesh(
      new THREE.BoxGeometry(girado ? 0.14 : 0.34, 0.34, girado ? 0.34 : 0.14),
      parede,
    );
    bloco.position.set(x, y, z);
    g.add(bloco);
    const miolo = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.035, 6, 10),
      toon(P.wallAzul),
    );
    miolo.position.set(x + (girado ? 0.02 : 0), y, z + (girado ? 0 : 0.02));
    if (girado) miolo.rotation.y = Math.PI / 2;
    g.add(miolo);
  };
  // na fachada, dos dois lados da marquise
  for (const lado of [-1, 1] as const) {
    for (let i = 0; i < 2; i++) {
      cobogo(lado * (hx - 0.45 - i * 0.42), 2.52, zF + 0.05, false);
    }
  }
  // na lateral que a câmera vê
  for (let i = 0; i < 6; i++) {
    cobogo(hx + 0.05, 2.52, -hz + 0.7 + i * 0.7, true);
  }

  // ------------------------------------------------------------ telhado
  // Laje plana com platibanda — o vestiário de clube não tem telhado aparente,
  // tem mureta escondendo a caixa d'água (que aparece assim mesmo).
  const lajeTopo = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.5, 0.22, profundidade + 0.5),
    concreto,
  );
  lajeTopo.position.y = yTopo + 0.11;
  g.add(lajeTopo);
  // As duas da frente e do fundo vão de ponta a ponta; as das laterais param
  // ANTES delas (`profundidade - 0.1`), senão as quatro se cruzam nos cantos
  // dividindo as faces de cima e de baixo — quatro pares serrilhando de uma vez.
  // Quem fecha o canto é a peça da frente, que passa por cima.
  for (const [dx, dz, lx, lz] of [
    [0, hz + 0.1, largura + 0.5, 0.14],
    [0, -hz - 0.1, largura + 0.5, 0.14],
    [hx + 0.13, 0, 0.14, profundidade - 0.1],
    [-hx - 0.13, 0, 0.14, profundidade - 0.1],
  ] as const) {
    const platibanda = new THREE.Mesh(new THREE.BoxGeometry(lx, 0.4, lz), parede);
    platibanda.position.set(dx, yTopo + 0.42, dz);
    g.add(platibanda);
  }

  // -------------------------------------------------- caixa d'água e prumada
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.5), concreto);
  base.position.set(-hx + 1.6, yTopo + 0.42, -hz + 1.5);
  g.add(base);
  const caixa = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.62, 0.95, 14),
    toon(P.vestiarioCaixa),
  );
  caixa.position.set(-hx + 1.6, yTopo + 1.1, -hz + 1.5);
  g.add(caixa);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 12), toon(P.metalGrey));
  tampa.position.set(-hx + 1.6, yTopo + 1.63, -hz + 1.5);
  g.add(tampa);

  // a descida de água, encostada na lateral
  const prumada = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, yTopo + 0.3, 8),
    toon(P.metalWhite),
  );
  prumada.position.set(-hx - 0.14, (yTopo + 0.3) / 2, hz - 0.5);
  g.add(prumada);
  const joelho = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.4, 8), toon(P.metalWhite));
  joelho.rotation.z = Math.PI / 2;
  joelho.position.set(-hx - 0.3, 0.28, hz - 0.5);
  g.add(joelho);

  // ----------------------------------------------------- torneira e ralo
  // A torneirinha de lavar o pé, do lado da porta. Todo clube tem.
  const bica = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.34, 6), toon(P.metalGrey));
  bica.position.set(hx - 0.6, 0.62, zF + 0.16);
  bica.rotation.x = 0.9;
  g.add(bica);
  const registro = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), toon(P.metalRed));
  registro.position.set(hx - 0.6, 0.82, zF + 0.06);
  g.add(registro);

  return g;
}

/* ------------------------------------------------------------------------ *
 *                   OS PRATOS SERVIDOS, E O GARÇOM
 * ------------------------------------------------------------------------ */

/**
 * A louça que todo prato servido divide: um disco raso com a beirada erguida.
 *
 * Ela é pequena de propósito — 0,26 de raio. O prato fica em cima de uma mesa
 * de 0,74 e é visto de longe, e uma louça de tamanho "realista" ao lado de um
 * boneco chibi lê como uma tampa de bueiro.
 */
function pratoDeLouca(raio = 0.26): THREE.Group {
  const g = new THREE.Group();
  const fundo = new THREE.Mesh(
    new THREE.CylinderGeometry(raio * 0.82, raio * 0.7, 0.02, 16),
    toon(P.metalWhite),
  );
  fundo.position.y = 0.012;
  g.add(fundo);
  // a beirada é um toro, e não um segundo cilindro: cilindro sobre cilindro
  // dividiria a face de cima com o fundo e serrilharia
  const borda = new THREE.Mesh(new THREE.TorusGeometry(raio * 0.88, 0.022, 6, 18), toon(P.metalWhite));
  borda.rotation.x = Math.PI / 2;
  borda.position.y = 0.03;
  g.add(borda);
  return g;
}

/** A AREPA servida: o disco de milho na louça, com o queijo saindo da boca. */
export function arepaServida(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arepa-queijo';
  g.add(pratoDeLouca());

  const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.075, 14), toon(P.arepaMilho));
  disco.position.y = 0.08;
  g.add(disco);
  const tampo = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.018, 14), toon(P.arepaTostada));
  tampo.position.y = 0.125;
  g.add(tampo);

  // o queijo escorrendo pela boca, no lado que olha para a câmera
  const fio = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.06), toon(P.arepaQueijo));
  fio.position.set(0, 0.08, 0.13);
  g.add(fio);
  const pingo = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toon(P.arepaQueijo));
  pingo.position.set(0.05, 0.055, 0.16);
  g.add(pingo);
  return g;
}

/** A AREPA RECHEADA: a mesma, com carne desfiada por cima. */
export function arepaRecheadaServida(): THREE.Group {
  const g = arepaServida();
  g.userData.peca = 'arepa-recheada';
  for (const [x, z, giro] of [[-0.05, 0.1, 0.3], [0.04, 0.12, -0.4], [0, 0.07, 0.1]] as const) {
    const fiapo = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.022, 0.03), toon(P.hamburguerCarne));
    fiapo.position.set(x, 0.14, z);
    fiapo.rotation.y = giro;
    g.add(fiapo);
  }
  return g;
}

/**
 * O HAMBÚRGUER servido: a pilha, e as batatas ao lado.
 *
 * Cada camada é mais estreita ou mais larga que a vizinha de propósito. Duas
 * camadas do MESMO raio dividiriam a face de cima de uma com a de baixo da
 * outra — e é aí que a pilha começa a serrilhar quando a câmera gira.
 */
export function hamburguerServido(andares = 2): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = andares > 1 ? 'duplo-queijo' : 'quarteirao';
  g.add(pratoDeLouca(0.3));

  let y = 0.045;
  const camada = (altura: number, raio: number, cor: number, lados = 14): void => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, altura, lados), toon(cor));
    m.position.y = y + altura / 2;
    g.add(m);
    y += altura;
  };

  camada(0.045, 0.135, P.hamburguerPao);
  for (let i = 0; i < andares; i++) {
    camada(0.04, 0.145, i % 2 ? P.hamburguerCarneEscura : P.hamburguerCarne);
    camada(0.014, 0.152, P.arepaQueijo, 4); // o queijo, quadrado como fatia
  }
  camada(0.022, 0.148, P.hamburguerAlface, 16);

  // o pão de cima é meia esfera achatada, com gergelim
  const topo = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.hamburguerPao));
  topo.scale.y = 0.62;
  topo.position.y = y;
  g.add(topo);
  for (const [dx, dz] of [[-0.05, 0.03], [0.04, -0.02], [0.01, 0.06], [-0.02, -0.05]] as const) {
    const semente = new THREE.Mesh(new THREE.SphereGeometry(0.011, 6, 4), toon(P.hamburguerGergelim));
    semente.position.set(dx, y + 0.06, dz);
    g.add(semente);
  }

  // as batatas, espetadas na borda da louça
  for (const [dx, dz, giro] of [[0.2, 0.06, 0.4], [0.23, -0.02, -0.2], [0.18, -0.08, 0.15]] as const) {
    const batata = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.13, 0.03), toon(P.hamburguerBatata));
    batata.position.set(dx, 0.11, dz);
    batata.rotation.set(0.3, giro, giro);
    g.add(batata);
  }
  return g;
}

/** O PERRO CALIENTE servido: pão, salsicha sobrando dos dois lados e molhos. */
export function perroServido(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'perro-tradicional';
  g.add(pratoDeLouca(0.3));

  const pao = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.28, 4, 10), toon(P.hamburguerPao));
  pao.rotation.z = Math.PI / 2;
  pao.position.y = 0.1;
  g.add(pao);

  const salsicha = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, 0.34, 4, 10), toon(P.perroSalsicha));
  salsicha.rotation.z = Math.PI / 2;
  salsicha.position.y = 0.15;
  g.add(salsicha);

  // os molhos: três fitas finas por cima da salsicha, em alturas diferentes
  for (const [i, cor] of [P.perroMostarda, P.perroKetchup, P.metalWhite].entries()) {
    const fita = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.02), toon(cor));
    fita.position.set(0, 0.186 + i * 0.014, -0.028 + i * 0.028);
    g.add(fita);
  }
  // a batata palha
  for (const [dx, dz, giro] of [[-0.1, 0.02, 0.5], [-0.02, -0.03, -0.3], [0.07, 0.03, 0.8], [0.13, -0.02, 0.1]] as const) {
    const palha = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.008, 0.008), toon(P.hamburguerBatata));
    palha.position.set(dx, 0.215, dz);
    palha.rotation.y = giro;
    g.add(palha);
  }
  return g;
}

/* ---- fim dos pratos servidos ---- */

/**
 * A peça 3D de um prato do cardápio, pelo ID DA FICHA.
 *
 * É esta função que amarra as duas metades do prato: a ficha em
 * `world/cardapioData.ts` (nome, preço, miniatura) e o modelo que o garçom
 * entrega. Prato sem linha aqui aparece no cardápio, é pedido em voz alta, e o
 * cachorro chega na mesa de costas vazias — por isso o `scripts/novo-prato.mjs`
 * escreve a linha junto com o resto.
 *
 * As bebidas reaproveitam o `copoDeSuco()` que já existe no kit: o copo do
 * clube serve inteiro, e só a cor da fruta muda.
 */
export function pratoServido(id: string): THREE.Group | null {
  switch (id) {
    case 'arepa-queijo': return arepaServida();
    case 'arepa-recheada': return arepaRecheadaServida();
    case 'duplo-queijo': return hamburguerServido(2);
    case 'quarteirao': return hamburguerServido(1);
    case 'perro-tradicional': return perroServido();
    case 'suco-morango': return copoDeSuco(P.morango);
    case 'smoothie-manga-banana': return copoDeSuco(P.maracuja);
    /* ---- novos pratos entram acima ---- */
    default: return null;
  }
}

/**
 * O GARÇOM CANINO: um cachorrinho de quatro patas, de gravata borboleta, com
 * uma bandeja plana nas costas.
 *
 * A BANDEJA É UM `Object3D` VAZIO, e não uma malha. O prato entra nela como
 * filho, então acompanha o cachorro de graça enquanto ele anda; na hora de
 * servir, a cena só troca o prato de pai para a mesa. Sem a âncora, entregar
 * viraria copiar posição frame a frame, e o prato tremeria no caminho.
 *
 * Ela está exposta em `g.userData.bandeja` e também tem `name = 'bandeja'`:
 * duas portas para a mesma coisa, porque quem procura no runtime (o teste)
 * costuma preferir o nome, e quem escreve a cutscene prefere o userData.
 *
 * O cachorro olha para `+Z` como toda peça, o que aqui quer dizer: o focinho
 * aponta para `+Z` e o rabo fica no `-Z`.
 */
export function dogWaiter(cor: number = P.cachorroPelo): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'garcom-canino';

  const pelo = toon(cor);
  const peloClaro = toon(P.cachorroPeito);

  // ---------------------------------------------------------------- corpo
  const tronco = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.4), pelo);
  tronco.position.set(0, 0.3, -0.02);
  g.add(tronco);
  // o peito claro, um fio mais estreito para não dividir face com o tronco
  const peito = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.12, 0.14), peloClaro);
  peito.position.set(0, 0.27, 0.16);
  g.add(peito);

  // ---------------------------------------------------------------- patas
  for (const [x, z] of [[-0.075, 0.13], [0.075, 0.13], [-0.075, -0.15], [0.075, -0.15]] as const) {
    const perna = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.07), pelo);
    perna.position.set(x, 0.11, z);
    g.add(perna);
    const patinha = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.05, 0.095), peloClaro);
    patinha.position.set(x, 0.025, z + 0.012);
    g.add(patinha);
  }

  // --------------------------------------------------------------- cabeça
  const cabeca = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.19), pelo);
  cabeca.position.set(0, 0.45, 0.2);
  g.add(cabeca);
  const focinho = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.085, 0.1), peloClaro);
  focinho.position.set(0, 0.41, 0.31);
  g.add(focinho);
  const nariz = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.04, 0.03), toon(P.cachorroFocinho));
  nariz.position.set(0, 0.425, 0.365);
  g.add(nariz);
  for (const lado of [-1, 1] as const) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), toon(0x2b2a33));
    olho.position.set(lado * 0.055, 0.48, 0.295);
    g.add(olho);
    // a orelha caída, que é o que faz o cachorro parecer fofo e não lobo
    const orelha = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.06), toon(P.cachorroOrelha));
    orelha.position.set(lado * 0.115, 0.44, 0.17);
    orelha.rotation.z = lado * 0.28;
    g.add(orelha);
  }

  // --------------------------------------------------------------- gravata
  // Duas asas e o nó: é o que transforma o cachorro em GARÇOM. Ela fica no
  // pescoço, entre a cabeça e o peito, virada para a frente.
  for (const lado of [-1, 1] as const) {
    const asa = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.06, 0.03), toon(P.gravataBorboleta));
    asa.position.set(lado * 0.05, 0.345, 0.245);
    asa.rotation.z = lado * 0.35;
    g.add(asa);
  }
  const no = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.04), toon(P.gravataNo));
  no.position.set(0, 0.345, 0.255);
  g.add(no);

  // ----------------------------------------------------------------- rabo
  const rabo = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), pelo);
  rabo.position.set(0, 0.38, -0.24);
  rabo.rotation.x = 0.7;
  g.add(rabo);
  const ponta = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), peloClaro);
  ponta.position.set(0, 0.45, -0.3);
  g.add(ponta);

  // -------------------------------------------------------------- bandeja
  const tabua = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.3), toon(P.wood));
  tabua.position.set(0, 0.41, -0.02);
  g.add(tabua);

  const bandeja = new THREE.Object3D();
  bandeja.name = 'bandeja';
  bandeja.position.set(0, 0.42, -0.02);
  g.add(bandeja);
  g.userData.bandeja = bandeja;

  return g;
}
