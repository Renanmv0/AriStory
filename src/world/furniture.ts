import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * Kit de interiores. Mesma convencao dos props: Group com base em y=0.
 */

export function rug(width = 3, depth = 2.2, color: number = P.rug): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), toon(color));
  m.position.y = 0.02;
  m.receiveShadow = true;
  return m;
}

export function sofa(color: number = P.sofa, width = 2.2): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(width, 0.42, 0.9), toon(color));
  base.position.y = 0.28;
  g.add(base);
  const back = new THREE.Mesh(new THREE.BoxGeometry(width, 0.62, 0.24), toon(color));
  back.position.set(0, 0.72, -0.35);
  g.add(back);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 0.9), toon(color));
    arm.position.set(side * (width / 2 - 0.12), 0.62, 0);
    g.add(arm);
  }
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.14, 6), toon(P.woodDark));
    foot.position.set(x * (width / 2 - 0.2), 0.07, z * 0.34);
    g.add(foot);
  }
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.34), toon(P.flowerPink));
  cushion.position.set(width / 2 - 0.5, 0.55, -0.14);
  cushion.rotation.set(0.9, 0.4, 0);
  g.add(cushion);
  return g;
}

export function coffeeTable(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.7), toon(P.wood));
  top.position.y = 0.46;
  g.add(top);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.46, 6), toon(P.woodDark));
    leg.position.set(x * 0.5, 0.23, z * 0.27);
    g.add(leg);
  }
  return g;
}

export function tvSet(on = false): THREE.Group {
  const g = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.45), toon(P.woodDark));
  stand.position.y = 0.25;
  g.add(stand);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.08), toon(0x1f2229));
  panel.position.y = 0.95;
  g.add(panel);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.36, 0.72),
    flat(on ? 0x8fd7ff : P.screen, 1),
  );
  screen.name = 'tela'; // a cena troca o material desta malha para ligar a TV
  screen.position.set(0, 0.95, 0.05);
  g.add(screen);
  return g;
}

/**
 * Estante de livros: carcaca com vao de verdade, e os livros DENTRO dele.
 *
 * A primeira versao era um bloco macico de 0,32 de profundidade com os livros
 * enfiados nele, e a face da frente dos dois caia no mesmo z (0,16). Duas
 * superficies coplanares brigam pelo mesmo pixel: as lombadas serrilhavam e
 * piscavam conforme a camera girava, e o resto do livro ficava enterrado na
 * madeira. Nao adianta empurrar o livro para a frente — ele so passaria a
 * flutuar colado numa parede. A peca precisa ser oca.
 *
 * Entao: duas laterais, um fundo recuado e as tabuas. O vao util vai de
 * `-prof/2 + espessura` (o fundo) ate `+prof/2` (a boca), e os livros vivem
 * com folga no meio dele — nenhuma face encosta em nenhuma outra.
 */
export function bookshelf(height = 2.1, width = 1.2, cor: number = P.woodDark): THREE.Group {
  const g = new THREE.Group();
  // etiqueta para o teste achar a peca na cena e medir a folga das lombadas
  g.userData.peca = 'estante';
  const prof = 0.32;
  const esp = 0.04;

  // O fundo sai 1 cm POR TRÁS das laterais, e para 1 cm antes do topo e da base.
  //
  // Alinhado com elas, ele dividia SEIS planos de face — as duas laterais, o
  // topo, a base e a traseira — e a estante serrilhava na quina toda vez que a
  // câmera girava. Sobressair também é como estante de verdade é: a costa passa
  // por trás dos montantes.
  // `width - esp` (e não `- esp * 2`): assim ele entra 2 cm em cada lateral, em
  // vez de terminar no mesmo x das tábuas
  const fundo = new THREE.Mesh(
    new THREE.BoxGeometry(width - esp, height - 0.02, esp),
    toon(P.estanteFundo),
  );
  fundo.position.set(0, height / 2, -prof / 2 - 0.005);
  g.add(fundo);

  for (const lado of [-1, 1]) {
    const lateral = new THREE.Mesh(new THREE.BoxGeometry(esp, height, prof), toon(cor));
    lateral.position.set((lado * (width - esp)) / 2, height / 2, 0);
    g.add(lateral);
  }

  // as tabuas: `vaos + 1` delas, contando a base e o topo
  const vaos = Math.max(2, Math.floor(height / 0.5));
  const alturaDoVao = height / vaos;
  for (let i = 0; i <= vaos; i++) {
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(width - esp * 2, esp, prof), toon(cor));
    // base e topo encostam na ponta; o resto fica no meio da divisao
    const y = i === 0 ? esp / 2 : i === vaos ? height - esp / 2 : alturaDoVao * i;
    tabua.position.set(0, y, 0);
    g.add(tabua);
  }

  const cores = [P.metalRed, P.fabricBlue, P.gold, P.bush, P.flowerPink];
  for (let v = 0; v < vaos; v++) {
    const chao = alturaDoVao * v + esp / 2;
    const teto = alturaDoVao * (v + 1) - esp / 2;
    const livre = teto - chao;

    // Enche a prateleira da esquerda para a direita ate acabar o espaco, com
    // larguras variadas — cinco livros iguais espacados na mao saem com cara de
    // grade. O ultimo vai tombado, apoiado na quina, como estante de verdade.
    let x = -width / 2 + esp + 0.03;
    let n = 0;
    const limite = width / 2 - esp - 0.03;
    while (n < 7) {
      const larg = 0.05 + ((v * 3 + n * 5) % 4) * 0.018;
      const alt = Math.min(livre * 0.92, 0.26 + ((v + n * 2) % 4) * 0.035);
      if (x + larg > limite) break;
      // o ultimo cabe deitado? entao ele tomba
      const tomba = n >= 3 && x + larg + alt * 0.5 > limite;

      const livro = new THREE.Mesh(
        new THREE.BoxGeometry(larg, alt, 0.17),
        toon(cores[(v * 2 + n) % cores.length]),
      );
      // z = 0.02: sobra folga para o fundo (-0.12) e para a boca (0.16), entao
      // nenhuma face do livro encosta na carcaca
      livro.position.set(0, alt / 2, 0.02);
      livro.userData.livro = true;

      // O giro mora num pivo na BASE do livro. Girando a malha direto, ela roda
      // em torno do proprio centro e a quina de baixo afunda na prateleira.
      const pivo = new THREE.Group();
      pivo.position.set(x + larg / 2, chao, 0);
      if (tomba) pivo.rotation.z = -0.42;
      pivo.add(livro);
      g.add(pivo);

      x += tomba ? larg + alt * 0.42 : larg + 0.012;
      n++;
    }
  }

  return g;
}

export function bed(color: number = P.fabricBlue): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 2.1), toon(P.woodDark));
  base.position.y = 0.2;
  g.add(base);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.24, 2.0), toon(0xf6f2e8));
  mattress.position.y = 0.49;
  g.add(mattress);
  const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 1.35), toon(color));
  duvet.position.set(0, 0.62, 0.3);
  g.add(duvet);
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 0.4), toon(0xffffff));
  pillow.position.set(0, 0.66, -0.72);
  g.add(pillow);
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.7, 0.12), toon(P.wood));
  head.position.set(0, 0.6, -1.06);
  g.add(head);
  return g;
}

export function desk(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.7), toon(P.wood));
  top.position.y = 0.74;
  g.add(top);
  for (const x of [-0.72, 0.72]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 0.66), toon(P.woodDark));
    leg.position.set(x, 0.37, 0);
    g.add(leg);
  }
  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.06), toon(0x2b2f38));
  monitor.position.set(0, 1.08, -0.18);
  g.add(monitor);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.42), flat(0x9fd8ff));
  glow.position.set(0, 1.08, -0.14);
  g.add(glow);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.24, 8), toon(0x2b2f38));
  stand.position.set(0, 0.86, -0.18);
  g.add(stand);
  return g;
}

export function chair(color: number = P.wood): THREE.Group {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), toon(color));
  seat.position.y = 0.46;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.07), toon(color));
  back.position.set(0, 0.75, -0.22);
  g.add(back);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.06), toon(P.woodDark));
    leg.position.set(x * 0.2, 0.23, z * 0.2);
    g.add(leg);
  }
  return g;
}

export function counter(width = 2.4): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.65), toon(P.wallMint));
  body.position.y = 0.45;
  g.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.08, 0.72), toon(P.concrete));
  top.position.y = 0.94;
  g.add(top);
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.4), toon(P.metalWhite));
  sink.position.set(width / 2 - 0.55, 0.97, 0);
  g.add(sink);
  return g;
}

export function fridge(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.7), toon(P.metalWhite));
  body.position.y = 0.9;
  g.add(body);
  const split = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.03, 0.72), toon(P.metalGrey));
  split.position.y = 1.25;
  g.add(split);
  for (const y of [0.7, 1.45]) {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), toon(P.metalGrey));
    handle.position.set(0.3, y, 0.37);
    g.add(handle);
  }
  return g;
}

export function pottedPlant(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.17 * scale, 0.34 * scale, 10), toon(P.plantPot));
  pot.position.y = 0.17 * scale;
  g.add(pot);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2 * scale, 8, 6), toon(i % 2 ? P.leafMid : P.leafLight));
    leaf.scale.set(0.5, 1.5, 0.5);
    leaf.position.set(Math.cos(a) * 0.12 * scale, 0.6 * scale, Math.sin(a) * 0.12 * scale);
    leaf.rotation.z = Math.cos(a) * 0.4;
    leaf.rotation.x = -Math.sin(a) * 0.4;
    g.add(leaf);
  }
  return g;
}

/** Quadro na parede: monte com a cor que quiser e pendure com w.place(). */
export function pictureFrame(width = 0.7, height = 0.55, art: number = P.skyDusk): THREE.Group {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.05), toon(P.woodDark));
  g.add(frame);
  // decalque: a tela fica a 5 mm da frente da moldura, folga curta demais para
  // o buffer de profundidade decidir sozinho (ver `ToonOptions.decal`)
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.1, height - 0.1), flat(art, 1, true));
  canvas.position.z = 0.03;
  canvas.renderOrder = 1;
  g.add(canvas);
  return g;
}

/**
 * O quadro de memorias: placa de cortica com fotos pregadas por cima.
 *
 * As "fotos" nao mostram nada — sao retangulos brancos com um miolo colorido,
 * porque a esta distancia e do angulo da camera isometrica nada mais se leria.
 * O que a memoria mostra de verdade e o painel que abre no `w.interact`; aqui
 * o que importa e o objeto dizer de longe "tem lembranca pendurada nesta
 * parede", e para isso bastam quatro retangulos tortos e uma tachinha em cada.
 */
export function muralDeMemorias(largura = 1.3, altura = 1.0): THREE.Group {
  const g = new THREE.Group();

  const moldura = new THREE.Mesh(
    new THREE.BoxGeometry(largura, altura, 0.05),
    toon(P.woodDark),
  );
  g.add(moldura);

  /**
   * Daqui para baixo e tudo decalque, empilhado por `renderOrder`.
   *
   * O mural e a peca mais fina do jogo: a cortica fica a 5 mm da moldura, o
   * furo a 5 mm da cortica e o miolo da polaroide a 2 MM do papel. Nenhuma
   * dessas folgas sobrevive a um buffer de profundidade de celular — e a briga
   * por pixel aparece justo de perto, que e como se olha o quadro. Como
   * decalque nao grava profundidade, quem manda e a ordem de pintura abaixo, e
   * a tachinha (solida, `renderOrder` 0) continua tapando o que esta atras.
   */
  const placa = new THREE.Mesh(
    new THREE.PlaneGeometry(largura - 0.1, altura - 0.1),
    flat(P.cortica, 1, true),
  );
  placa.position.z = 0.03;
  placa.renderOrder = 1;
  g.add(placa);

  // os furos da cortica: so uns riscos escuros, para a placa nao ficar chapada
  for (let i = 0; i < 14; i++) {
    const furo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.018, 0.018),
      flat(P.corticaEscura, 1, true),
    );
    furo.renderOrder = 2;
    // espalhados por uma conta fixa: mural montado duas vezes tem que sair
    // igual, senao a foto do teste muda sozinha a cada build
    furo.position.set(
      (((i * 37) % 100) / 100 - 0.5) * (largura - 0.24),
      (((i * 61) % 100) / 100 - 0.5) * (altura - 0.24),
      0.035,
    );
    g.add(furo);
  }

  // as fotos pregadas, cada uma com a sua tachinha
  const fotos: Array<[number, number, number, number, number, number]> = [
    // x, y, largura, altura, giro, cor do miolo
    [-0.3, 0.2, 0.34, 0.28, 0.06, P.skyDusk],
    [0.26, 0.24, 0.3, 0.26, -0.09, P.water],
    [-0.24, -0.22, 0.3, 0.26, -0.05, P.flowerPink],
    [0.3, -0.2, 0.32, 0.24, 0.08, P.leafMid],
  ];
  const tachinhas = [P.heart, P.gold, P.frisbee, P.heart];

  fotos.forEach(([x, y, lw, lh, giro, cor], i) => {
    const foto = new THREE.Group();

    const papel = new THREE.Mesh(new THREE.PlaneGeometry(lw, lh), flat(P.metalWhite, 1, true));
    papel.renderOrder = 3;
    foto.add(papel);
    // a margem larga embaixo e o que faz o retangulo virar polaroide
    const miolo = new THREE.Mesh(
      new THREE.PlaneGeometry(lw - 0.06, lh - 0.1),
      flat(cor, 1, true),
    );
    miolo.position.set(0, 0.02, 0.002);
    miolo.renderOrder = 4;
    foto.add(miolo);

    const tachinha = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 8, 6),
      toon(tachinhas[i]),
    );
    tachinha.position.set(0, lh / 2 - 0.03, 0.012);
    foto.add(tachinha);

    foto.position.set(x, y, 0.04);
    foto.rotation.z = giro;
    g.add(foto);
  });

  return g;
}

/** Janela vazada numa parede: moldura + vidro translucido. */
export function windowFrame(width = 1.2, height = 1.2): THREE.Group {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(width, height), flat(P.glass, 0.55));
  g.add(glass);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.08, 0.08), toon(P.metalWhite));
  bar.position.y = height / 2;
  g.add(bar);
  const bar2 = bar.clone();
  bar2.position.y = -height / 2;
  g.add(bar2);
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 0.08), toon(P.metalWhite));
    post.position.x = (side * width) / 2;
    g.add(post);
  }
  return g;
}

export function mug(color = 0xffffff): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.13, 10), toon(color));
  body.position.y = 0.065;
  g.add(body);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 6, 12), toon(color));
  handle.position.set(0.08, 0.07, 0);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);
  return g;
}

export function diningTable(width = 1.5, depth = 0.9): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.09, depth), toon(P.wood));
  top.position.y = 0.75;
  g.add(top);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), toon(P.woodDark));
    leg.position.set(x * (width / 2 - 0.14), 0.37, z * (depth / 2 - 0.14));
    g.add(leg);
  }
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 10), toon(P.wallMint));
  vaso.position.y = 0.87;
  g.add(vaso);
  for (const side of [-1, 1]) {
    const flor = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), toon(side < 0 ? P.flowerPink : P.flowerYellow));
    flor.position.set(side * 0.05, 1.03, 0);
    g.add(flor);
  }
  return g;
}

export function floorLamp(lit = true): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.06, 12), toon(P.woodDark));
  base.position.y = 0.03;
  g.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), toon(P.metalGrey));
  pole.position.y = 0.78;
  g.add(pole);
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.3, 0.34, 14, 1, true),
    toon(lit ? 0xfff0cc : 0xe6ded0, { glow: lit ? 0.5 : 0, doubleSide: true }),
  );
  shade.position.y = 1.68;
  g.add(shade);
  return g;
}

/** Prateleira de parede: pendure com w.place(shelf(), x, altura, z, rot). */
export function wallShelf(width = 1.1): THREE.Group {
  const g = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, 0.06, 0.24), toon(P.wood));
  g.add(board);
  const cores = [0xd9603f, 0x5cb04f, 0xffc94d];
  for (let i = 0; i < 3; i++) {
    const item = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.16), toon(cores[i]));
    item.position.set(-width / 2 + 0.2 + i * 0.16, 0.15, 0);
    g.add(item);
  }
  const planta = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), toon(P.leafMid));
  planta.position.set(width / 2 - 0.22, 0.16, 0);
  planta.scale.y = 0.8;
  g.add(planta);
  return g;
}

/** Armario aereo da cozinha. */
export function upperCabinets(width = 2.0): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.6, 0.34), toon(P.wallCream));
  g.add(body);
  for (const side of [-1, 1]) {
    const puxador = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.04), toon(P.metalGrey));
    puxador.position.set(side * width * 0.22, -0.18, 0.19);
    g.add(puxador);
  }
  return g;
}

export function washingMachine(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.9, 0.64), toon(P.metalWhite));
  corpo.position.y = 0.45;
  g.add(corpo);
  const porta = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), toon(0x9fb6c4));
  porta.position.set(0, 0.5, 0.33);
  porta.rotation.x = Math.PI / 2;
  g.add(porta);
  const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16), toon(0x3b4650));
  vidro.position.set(0, 0.5, 0.36);
  vidro.rotation.x = Math.PI / 2;
  g.add(vidro);
  const painel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.03), toon(0xdfe4e8));
  painel.position.set(0, 0.82, 0.33);
  g.add(painel);
  for (const x of [-0.2, 0, 0.2]) {
    const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8), toon(P.metalGrey));
    botao.position.set(x, 0.82, 0.36);
    botao.rotation.x = Math.PI / 2;
    g.add(botao);
  }
  return g;
}

/** Porta com batente. Encaixe num vao de parede com w.place(). */
/**
 * Porta com batente, para encaixar num vão de parede.
 *
 * `profundidade` é a espessura do batente: mantenha MENOR que a espessura da
 * parede (0.3 no `w.wall`) e centre a porta na linha da parede. Batente com a
 * mesma espessura da parede deixa as faces coplanares e elas piscam.
 */
export function interiorDoor(
  cor: number = P.wood,
  largura = 0.9,
  altura = 2.1,
  profundidade = 0.24,
): THREE.Group {
  const g = new THREE.Group();
  const folha = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.08), toon(cor));
  folha.position.y = altura / 2;
  g.add(folha);
  for (const side of [-1, 1]) {
    const batente = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, altura + 0.1, profundidade),
      toon(P.woodDark),
    );
    batente.position.set((side * (largura + 0.09)) / 2, (altura + 0.1) / 2, 0);
    g.add(batente);
  }
  const verga = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.2, 0.1, profundidade),
    toon(P.woodDark),
  );
  verga.position.y = altura + 0.05;
  g.add(verga);
  const maca = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), toon(P.gold, { glow: 0.15 }));
  maca.position.set(largura / 2 - 0.14, altura * 0.45, 0.07);
  g.add(maca);
  return g;
}

/** Criado-mudo com abajur. */
/**
 * Armario de duas portas. A frente e o lado +Z, como todo movel do kit.
 *
 * A porta da direita fica entreaberta: um bloco liso de 1,6 x 2,1 na camera
 * isometrica vira um paralelepipedo sem leitura, e a fresta e o que diz que
 * aquilo abre.
 */
export function armario(cor: number = P.wood, largura = 1.6, altura = 2.1): THREE.Group {
  const g = new THREE.Group();
  const prof = 0.62;

  const corpo = new THREE.Mesh(
    new THREE.BoxGeometry(largura, altura, prof),
    toon(P.woodDark),
  );
  corpo.position.y = altura / 2;
  g.add(corpo);

  // o vao escuro que aparece pela fresta
  const dentro = new THREE.Mesh(
    new THREE.BoxGeometry(largura - 0.12, altura - 0.16, 0.04),
    toon(0x3a2b1f),
  );
  dentro.position.set(0, altura / 2, prof / 2 - 0.05);
  g.add(dentro);

  const meia = largura / 2 - 0.05;
  for (const lado of [-1, 1] as const) {
    // pivo na dobradica, para a porta girar a partir da lateral
    const eixo = new THREE.Group();
    eixo.position.set(lado * meia, altura / 2, prof / 2);
    if (lado > 0) eixo.rotation.y = -0.62; // a da direita, entreaberta
    g.add(eixo);

    const folha = new THREE.Mesh(
      new THREE.BoxGeometry(meia, altura - 0.1, 0.06),
      toon(cor),
    );
    folha.position.x = -lado * meia / 2;
    eixo.add(folha);

    const puxador = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.16, 8),
      toon(P.metalGrey),
    );
    puxador.position.set(-lado * (meia - 0.12), 0, 0.06);
    eixo.add(puxador);
  }

  // pezinhos, para nao parecer que nasce do chao
  for (const x of [-1, 1] as const) {
    for (const z of [-1, 1] as const) {
      const pe = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        toon(P.woodDark),
      );
      pe.position.set(x * (largura / 2 - 0.1), 0.05, z * (prof / 2 - 0.1));
      g.add(pe);
    }
  }

  return g;
}

/**
 * Espelho de corpo inteiro, encostado na parede.
 *
 * Nao reflete nada: reflexao de verdade pede uma segunda passada de render, e o
 * jogo inteiro e toon chapado. O vidro e um plano claro e translucido, que na
 * luz do quarto le como espelho sem custar nada.
 */
export function espelho(cor: number = P.wood, altura = 1.7): THREE.Group {
  const g = new THREE.Group();
  const larg = 0.62;

  const moldura = new THREE.Mesh(
    new THREE.BoxGeometry(larg, altura, 0.07),
    toon(cor),
  );
  moldura.position.y = altura / 2;
  g.add(moldura);

  const vidro = new THREE.Mesh(
    new THREE.BoxGeometry(larg - 0.14, altura - 0.16, 0.03),
    toon(P.glass, { opacity: 0.72, glow: 0.12 }),
  );
  vidro.position.set(0, altura / 2, 0.04);
  g.add(vidro);

  // encosta na parede com uma inclinacao de leve
  g.rotation.x = -0.05;
  return g;
}

export function nightstand(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 0.4), toon(P.wood));
  corpo.position.y = 0.25;
  g.add(corpo);
  const gaveta = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.03), toon(P.woodDark));
  gaveta.position.set(0, 0.32, 0.21);
  g.add(gaveta);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.16, 8), toon(P.metalGrey));
  base.position.y = 0.58;
  g.add(base);
  const cupula = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.15, 0.18, 12, 1, true),
    toon(0xfff0cc, { glow: 0.45, doubleSide: true }),
  );
  cupula.position.y = 0.75;
  g.add(cupula);
  return g;
}

/* ========================================================================
 * MANIA DE CHURRASCO — o kit do restaurante por dentro.
 *
 * Tudo aqui obedece à mesma conta que já mordeu o quiosque, o restaurante do
 * clube e a guarita: a câmera olha de cima em 34°, então QUALQUER coisa que
 * avance por cima de alguém esconde essa pessoa. Por isso a coifa da grelha
 * não passa da frente dela, as luminárias só existem onde ninguém senta, e as
 * bancadas são baixas. Cozinha bonita que esconde o cozinheiro não serve.
 * ===================================================================== */

/**
 * A CHURRASQUEIRA — o coração do lugar, e a única cor saturada da cena.
 *
 * Ela é alvenaria de tijolo com a boca de brasa em cima, grelha de barras e
 * uma coifa de inox subindo até o teto. A brasa usa `glow`, que é o que faz
 * ela puxar o olho no meio de uma sala de madeira e creme.
 *
 * A COIFA PARA NA FRENTE DA GRELHA, e não meio metro além. Quem cozinha fica
 * a ~0,9 na frente da peça; a 34°, uma coifa a 2,0 esconde tudo que estiver a
 * 0,37 na direção da câmera. Parando na boca, ela nunca alcança a cabeça de
 * quem está grelhando.
 */
export function churrasqueira(largura = 4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'churrasqueira';

  const tijolo = toon(P.churrascoTijolo);
  const rejunte = toon(P.churrascoRejunte);
  const inox = toon(P.churrascoInox);
  const ferro = toon(P.churrascoGrelha);

  const ALT = 0.95;
  const PROF = 1.0;

  // a base de alvenaria, com uma faixa de rejunte por fiada
  const base = new THREE.Mesh(new THREE.BoxGeometry(largura, ALT, PROF), tijolo);
  base.position.y = ALT / 2;
  g.add(base);
  for (const y of [0.22, 0.46, 0.7]) {
    const fiada = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.02, 0.035, PROF + 0.02), rejunte);
    fiada.position.y = y;
    g.add(fiada);
  }
  // o vão da lenha, embaixo: um buraco escuro é o que faz ler alvenaria
  const boca = new THREE.Mesh(new THREE.BoxGeometry(largura * 0.5, 0.3, 0.08), toon(P.churrascoCarvao));
  boca.position.set(0, 0.34, PROF / 2 + 0.01);
  g.add(boca);
  for (let i = 0; i < 3; i++) {
    const lenha = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, largura * 0.42, 6), toon(P.woodDark));
    lenha.rotation.z = Math.PI / 2;
    lenha.position.set(0, 0.26 + i * 0.055, PROF / 2 - 0.02 - i * 0.03);
    g.add(lenha);
  }

  // o tampo de pedra, avançando 4 cm de cada lado
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.12, 0.1, PROF + 0.12), toon(P.muroChapim));
  tampo.position.y = ALT + 0.05;
  g.add(tampo);

  // a caixa de brasa, rebaixada dentro do tampo
  const cinzas = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.5, 0.12, PROF - 0.4), toon(P.churrascoCarvao));
  cinzas.position.y = ALT + 0.09;
  g.add(cinzas);
  for (let i = 0; i < 14; i++) {
    const t = (i + 0.5) / 14;
    const viva = i % 3 === 0;
    const brasa = new THREE.Mesh(
      new THREE.SphereGeometry(0.055 + (i % 4) * 0.008, 6, 5),
      toon(viva ? P.churrascoBrasaViva : P.churrascoBrasa, { glow: viva ? 0.6 : 0.35 }),
    );
    brasa.scale.y = 0.6;
    brasa.position.set(
      -(largura - 0.7) / 2 + t * (largura - 0.7),
      ALT + 0.14,
      ((i % 3) - 1) * 0.16,
    );
    g.add(brasa);
  }

  // a grelha: barras finas atravessando a boca, 12 cm acima da brasa
  const quantas = Math.round((largura - 0.5) / 0.13);
  for (let i = 0; i <= quantas; i++) {
    const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, PROF - 0.34, 6), ferro);
    barra.rotation.x = Math.PI / 2;
    barra.position.set(-(largura - 0.5) / 2 + (i * (largura - 0.5)) / quantas, ALT + 0.26, 0);
    g.add(barra);
  }
  for (const z of [-(PROF - 0.4) / 2, (PROF - 0.4) / 2]) {
    const aro = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.44, 0.03, 0.05), ferro);
    aro.position.set(0, ALT + 0.26, z);
    g.add(aro);
  }

  // A COIFA. Ela nasce em 1,95 e vai até 2,45, e a chaminé sobe daí — nada
  // avança para a frente da grelha, que é onde o cozinheiro fica.
  const coifa = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.2, 0.5, PROF + 0.06), inox);
  coifa.position.set(0, 2.2, -0.02);
  g.add(coifa);
  const saia = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.3, 0.09, PROF + 0.16), toon(P.churrascoInoxEscuro));
  saia.position.set(0, 1.94, -0.02);
  g.add(saia);
  const chamine = new THREE.Mesh(new THREE.BoxGeometry(largura * 0.4, 1.1, PROF - 0.2), inox);
  chamine.position.set(0, 3.0, -0.02);
  g.add(chamine);

  // os espetos encostados na lateral, que é o que diz "churrascaria" de longe
  for (let i = 0; i < 4; i++) {
    const espeto = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6), toon(P.metalGrey));
    espeto.position.set(largura / 2 - 0.1 - i * 0.11, 1.2, -PROF / 2 + 0.18);
    espeto.rotation.z = 0.18 + i * 0.02;
    g.add(espeto);
    const cabo = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), toon(P.woodDark));
    cabo.position.set(largura / 2 - 0.24 - i * 0.11, 1.9, -PROF / 2 + 0.18);
    g.add(cabo);
  }

  return g;
}

/**
 * BANCADA DE INOX — a mesa de trabalho da cozinha, e a estação de montagem
 * quando o minijogo entrar.
 *
 * Inox de cozinha profissional é chapa sobre pés tubulares com uma prateleira
 * embaixo: é essa prateleira vazada que separa a peça de um armário fechado.
 */
export function bancadaInox(largura = 3, comEspelho = true): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bancada-inox';

  const inox = toon(P.churrascoInox);
  const escuro = toon(P.churrascoInoxEscuro);
  const ALT = 0.92;
  const PROF = 0.75;

  const tampo = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.07, PROF), inox);
  tampo.position.y = ALT;
  g.add(tampo);
  // O friso da beirada, que dá a espessura da chapa dobrada. Ele é 4 cm mais
  // ESTREITO que o tampo: com a mesma largura, as duas pontas caem no mesmo
  // plano e brigam por pixel — o detector pega, o olho só vê serrilhando.
  const friso = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.04, 0.05, 0.04), escuro);
  friso.position.set(0, ALT - 0.05, PROF / 2 - 0.01);
  g.add(friso);

  const prateleira = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.16, 0.05, PROF - 0.14), escuro);
  prateleira.position.y = 0.26;
  g.add(prateleira);

  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, ALT, 8), escuro);
    pe.position.set(x * (largura / 2 - 0.12), ALT / 2, z * (PROF / 2 - 0.1));
    g.add(pe);
  }

  // o espelho d'água: a chapa que sobe na parede atrás, contra respingo
  if (comEspelho) {
    const costa = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.04, 0.34, 0.04), inox);
    costa.position.set(0, ALT + 0.17, -PROF / 2 + 0.05);
    g.add(costa);
  }

  return g;
}

/** FOGÃO INDUSTRIAL: quatro bocas de ferro, botões e uma panela em cima. */
export function fogaoIndustrial(largura = 2.2): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'fogao-industrial';

  const inox = toon(P.churrascoInox);
  const ferro = toon(P.churrascoGrelha);
  const ALT = 0.92;
  const PROF = 0.8;

  const corpo = new THREE.Mesh(new THREE.BoxGeometry(largura, ALT, PROF), inox);
  corpo.position.y = ALT / 2;
  g.add(corpo);
  // as duas portas do forno, com puxador
  for (const lado of [-1, 1]) {
    const porta = new THREE.Mesh(new THREE.BoxGeometry(largura / 2 - 0.12, 0.5, 0.04), toon(P.churrascoInoxEscuro));
    porta.position.set(lado * largura / 4, 0.42, PROF / 2 + 0.01);
    g.add(porta);
    const puxador = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, largura / 2 - 0.3, 6), ferro);
    puxador.rotation.z = Math.PI / 2;
    puxador.position.set(lado * largura / 4, 0.6, PROF / 2 + 0.06);
    g.add(puxador);
  }

  const chapa = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.06, 0.06, PROF + 0.06), ferro);
  chapa.position.y = ALT + 0.03;
  g.add(chapa);

  for (const [bx, bz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const boca = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.05, 10), toon(P.churrascoCarvao));
    boca.position.set(bx * largura * 0.24, ALT + 0.08, bz * 0.19);
    g.add(boca);
    const chama = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.05, 0.05, 8), toon(P.churrascoBrasaViva, { glow: 0.5 }));
    chama.position.set(bx * largura * 0.24, ALT + 0.09, bz * 0.19);
    g.add(chama);
    const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 8), ferro);
    botao.rotation.x = Math.PI / 2;
    botao.position.set(bx * largura * 0.24 + (bz > 0 ? 0.1 : -0.1), ALT - 0.12, PROF / 2 + 0.02);
    g.add(botao);
  }

  // uma panela numa das bocas, para a cozinha não parecer desligada
  const panela = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.24, 14), toon(P.churrascoInoxEscuro));
  panela.position.set(-largura * 0.24, ALT + 0.22, 0.19);
  g.add(panela);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.035, 14), inox);
  tampa.position.set(-largura * 0.24, ALT + 0.35, 0.19);
  g.add(tampa);
  const pegador = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), toon(P.churrascoCarvao));
  pegador.position.set(-largura * 0.24, ALT + 0.39, 0.19);
  g.add(pegador);

  return g;
}

/** PIA INDUSTRIAL: cuba funda, torneira alta de mola e a louça escorrendo. */
export function piaIndustrial(largura = 2.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pia-industrial';

  const inox = toon(P.churrascoInox);
  const escuro = toon(P.churrascoInoxEscuro);
  const ALT = 0.92;
  const PROF = 0.75;

  const tampo = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.07, PROF), inox);
  tampo.position.y = ALT;
  g.add(tampo);
  const saia = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.1, 0.5, PROF - 0.08), escuro);
  saia.position.y = ALT - 0.32;
  g.add(saia);
  for (const x of [-1, 1]) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, ALT - 0.55, 8), escuro);
    pe.position.set(x * (largura / 2 - 0.15), (ALT - 0.55) / 2, 0);
    g.add(pe);
  }

  // a cuba, afundada no tampo
  const cuba = new THREE.Mesh(new THREE.BoxGeometry(largura * 0.42, 0.1, PROF - 0.24), toon(P.churrascoInoxEscuro));
  cuba.position.set(-largura * 0.22, ALT + 0.01, 0);
  g.add(cuba);
  const agua = new THREE.Mesh(new THREE.BoxGeometry(largura * 0.38, 0.02, PROF - 0.3), flat(P.glass, 0.5));
  agua.position.set(-largura * 0.22, ALT + 0.045, 0);
  g.add(agua);

  // a torneira alta, de cozinha profissional
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), inox);
  base.position.set(-largura * 0.22, ALT + 0.08, -PROF / 2 + 0.14);
  g.add(base);
  const cano = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.62, 8), inox);
  cano.position.set(-largura * 0.22, ALT + 0.42, -PROF / 2 + 0.14);
  g.add(cano);
  const curva = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.028, 6, 12, Math.PI), inox);
  curva.position.set(-largura * 0.22, ALT + 0.72, -PROF / 2 + 0.27);
  curva.rotation.y = Math.PI / 2;
  g.add(curva);

  // o escorredor: pratos em pé, do lado seco
  for (let i = 0; i < 5; i++) {
    const prato = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.022, 14), toon(0xfdfaf3));
    prato.rotation.x = Math.PI / 2;
    prato.rotation.z = 0.12;
    prato.position.set(largura * 0.16 + i * 0.07, ALT + 0.17, 0);
    g.add(prato);
  }

  return g;
}

/**
 * BALCÃO DE PASSAGEM — a praça, onde o prato pronto espera o garçom.
 *
 * É a peça mais importante do restaurante para o que vem depois: ela é a
 * fronteira entre a cozinha e o salão, e vai ser onde o cozinheiro larga e o
 * garçom pega. Por isso o tampo é generoso e VAZIO — o que aparece nele é o
 * prato, não o enfeite.
 */
export function balcaoDePassagem(largura = 6): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balcao-de-passagem';

  const madeira = toon(P.churrascoFaixa);
  const ALT = 1.06;
  const PROF = 0.7;

  const corpo = new THREE.Mesh(new THREE.BoxGeometry(largura, ALT, PROF), madeira);
  corpo.position.y = ALT / 2;
  g.add(corpo);

  // as almofadas de madeira da frente: painéis salientes, o mesmo desenho do
  // muro do clube, para o restaurante pertencer ao mesmo mundo
  const vaos = Math.max(1, Math.round(largura / 1.6));
  for (let i = 0; i < vaos; i++) {
    const painel = new THREE.Mesh(
      new THREE.BoxGeometry(largura / vaos - 0.24, 0.56, 0.04), toon(P.churrascoPiso),
    );
    painel.position.set(-largura / 2 + (i + 0.5) * (largura / vaos), 0.52, PROF / 2 + 0.02);
    g.add(painel);
  }
  // o rodapé afunda 2 cm no piso: nascendo em `y = 0` como o corpo, as duas
  // faces de baixo caem no mesmo plano
  const rodape = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.04, 0.1, PROF + 0.06), toon(P.woodDark));
  rodape.position.y = 0.03;
  g.add(rodape);

  // o tampo de pedra, avançando dos dois lados
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.2, 0.09, PROF + 0.3), toon(P.muroChapim));
  tampo.position.y = ALT + 0.045;
  g.add(tampo);

  // a prateleira de apoio do lado da cozinha, na altura da bancada
  const apoio = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.3, 0.05, 0.3), toon(P.churrascoInox));
  apoio.position.set(0, 0.72, -PROF / 2 - 0.1);
  g.add(apoio);

  return g;
}

/** BANQUETA ALTA do balcão: assento redondo, apoio de pé e pés de tubo. */
export function banquetaAlta(cor: number = P.churrascoFaixa): THREE.Group {
  const g = new THREE.Group();
  const metal = toon(P.churrascoInoxEscuro);
  const assento = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.09, 14), toon(cor));
  assento.position.y = 0.68;
  g.add(assento);
  const almofada = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.185, 0.05, 14), toon(P.churrascoToalha));
  almofada.position.y = 0.735;
  g.add(almofada);
  const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.64, 8), metal);
  coluna.position.y = 0.32;
  g.add(coluna);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 14), metal);
  aro.position.y = 0.22;
  aro.rotation.x = Math.PI / 2;
  g.add(aro);
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.23, 0.04, 14), metal);
  pe.position.y = 0.02;
  g.add(pe);
  return g;
}

/**
 * LUMINÁRIA PENDENTE — e ela só pode existir ONDE NINGUÉM SENTA.
 *
 * Pendente é a armadilha clássica desta câmera: a 34°, uma cúpula a 2,3
 * esconde a cabeça de quem estiver a 40 cm dela na direção da câmera, e a
 * cabeça de quem está SENTADO a mais de um metro. Sobre mesa, ela apaga
 * justamente quem está jantando. Sobre o balcão, onde as pessoas ficam de pé
 * e afastadas, ela é só bonita.
 */
export function luminariaPendente(cor: number = P.churrascoTijolo, altura = 2.35): THREE.Group {
  const g = new THREE.Group();
  const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.9, 6), toon(P.churrascoCarvao));
  fio.position.y = altura + 0.45;
  g.add(fio);
  const cupula = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.13, 0.26, 14, 1, true),
    toon(cor, { doubleSide: true }),
  );
  cupula.position.y = altura;
  g.add(cupula);
  const lampada = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), toon(0xfff2cf, { glow: 0.65 }));
  lampada.position.y = altura - 0.11;
  g.add(lampada);
  return g;
}

/** ARANDELA de parede: a luz que não tapa ninguém, porque mora colada no reboco. */
export function arandela(): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.06), toon(P.churrascoCarvao));
  g.add(base);
  const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 6), toon(P.churrascoCarvao));
  braco.rotation.x = Math.PI / 2;
  braco.position.z = 0.11;
  g.add(braco);
  const cupula = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.08, 0.16, 12, 1, true),
    toon(0xfff0cc, { glow: 0.5, doubleSide: true }),
  );
  cupula.position.set(0, 0.06, 0.2);
  g.add(cupula);
  return g;
}

/**
 * QUADRO DE GIZ com o cardápio do dia. O texto sai de um canvas em tempo de
 * execução — a mesma exceção do letreiro das placas, nenhum arquivo entra.
 */
export function quadroDeGiz(linhas: readonly string[], largura = 1.6, altura = 1.2): THREE.Group {
  const g = new THREE.Group();
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.06), toon(P.woodDark));
  g.add(moldura);
  const lousa = new THREE.Mesh(
    new THREE.BoxGeometry(largura - 0.12, altura - 0.12, 0.03), toon(P.churrascoQuadroNegro),
  );
  lousa.position.z = 0.03;
  g.add(lousa);

  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = Math.round((384 * (altura - 0.16)) / (largura - 0.16));
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const passo = canvas.height / (linhas.length + 0.6);
    linhas.forEach((linha, i) => {
      const titulo = i === 0;
      ctx.fillStyle = titulo ? '#ffe9a8' : '#f4f1e6';
      ctx.font = `${titulo ? 'bold ' : ''}${Math.round(passo * (titulo ? 0.62 : 0.46))}px ui-rounded, "Nunito", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(linha, canvas.width / 2, passo * (i + 0.7));
    });
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const escrita = new THREE.Mesh(
    new THREE.PlaneGeometry(largura - 0.16, altura - 0.16),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
  escrita.position.z = 0.05;
  g.add(escrita);
  return g;
}

/** ESTANTE DE BEBIDAS do bar: prateleiras com garrafas de cores variadas. */
export function estanteDeBebidas(largura = 2.4, altura = 1.6): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'estante-de-bebidas';
  const madeira = toon(P.churrascoFaixa);

  const fundo = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.05), toon(P.estanteFundo));
  fundo.position.y = altura / 2;
  g.add(fundo);
  // As laterais moram DENTRO do fundo, nos três eixos: mesma largura, mesma
  // altura e mesmo pé fariam seis pares de faces coplanares — a peça inteira
  // serrilhando nas bordas.
  for (const lado of [-1, 1]) {
    const lateral = new THREE.Mesh(new THREE.BoxGeometry(0.07, altura - 0.06, 0.26), madeira);
    lateral.position.set(lado * (largura / 2 - 0.05), altura / 2, 0.13);
    g.add(lateral);
  }

  const CORES = [0x8ec3dd, 0xd94f43, 0xf0b429, 0x77c05a, 0xb98a54, 0xd9738f];
  for (let p = 0; p < 3; p++) {
    const y = 0.34 + p * 0.44;
    const prateleira = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.14, 0.05, 0.24), madeira);
    prateleira.position.set(0, y, 0.13);
    g.add(prateleira);
    const quantas = Math.floor((largura - 0.4) / 0.19);
    for (let i = 0; i < quantas; i++) {
      const cor = CORES[(p * 3 + i) % CORES.length];
      const alturaGarrafa = 0.24 + ((i + p) % 3) * 0.04;
      const garrafa = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.055, alturaGarrafa, 8), toon(cor),
      );
      garrafa.position.set(-largura / 2 + 0.24 + i * 0.19, y + 0.025 + alturaGarrafa / 2, 0.13);
      g.add(garrafa);
      const gargalo = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.028, 0.08, 6), toon(cor));
      gargalo.position.set(-largura / 2 + 0.24 + i * 0.19, y + 0.025 + alturaGarrafa + 0.04, 0.13);
      g.add(gargalo);
    }
  }
  return g;
}

/** CAIXA REGISTRADORA, para o balcão do bar ter função. */
export function caixaRegistradora(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.34), toon(P.churrascoInoxEscuro));
  corpo.position.y = 0.11;
  g.add(corpo);
  const teclado = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.2), toon(P.churrascoCarvao));
  teclado.position.set(0, 0.23, 0.06);
  teclado.rotation.x = -0.16;
  g.add(teclado);
  const tela = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.04), toon(P.churrascoCarvao));
  tela.position.set(0, 0.34, -0.09);
  tela.rotation.x = 0.2;
  g.add(tela);
  const brilho = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.13), toon(0x9fe6c8, { glow: 0.4 }));
  brilho.position.set(0, 0.34, -0.06);
  brilho.rotation.x = 0.2;
  g.add(brilho);
  return g;
}

/**
 * O QUADRO DE EMPREGADO DO MES, com o retrato do Walter.
 *
 * O retrato e PINTADO NUM CANVAS na hora em que a cena sobe — mesmo principio
 * do texto das placas e das memorias do quarto: nenhuma imagem entra no
 * repositorio. Aqui o canvas ganha ainda outro papel: e a unica forma de o
 * Walter aparecer de FRENTE no jogo. O modelo 3D dele so e visto de cima, na
 * isometrica; um retrato olhando para quem passa e uma cara nova do mesmo
 * personagem, e e o que faz o quadro ter graca.
 *
 * A moldura tem VIDRO de verdade (um decalque claro por cima da arte, com
 * `renderOrder` para nao brigar com ela): sem o reflexo, quadro na parede lia
 * como adesivo.
 */
export function quadroDoEmpregadoDoMes(largura = 0.82, altura = 1.02): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quadro-empregado-do-mes';
  const css = (cor: number): string => `#${cor.toString(16).padStart(6, '0')}`;

  const moldura = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.055), toon(P.woodDark));
  g.add(moldura);
  // o filete dourado por dentro da moldura, que e o que separa "quadro" de
  // "tabua pregada na parede"
  const filete = new THREE.Mesh(
    new THREE.BoxGeometry(largura - 0.07, altura - 0.07, 0.06), toon(P.churrascoBrasaViva),
  );
  filete.position.z = 0.004;
  g.add(filete);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.round((512 * altura) / largura);
  const ctx = canvas.getContext('2d');
  if (ctx) pintarOWalter(ctx, canvas.width, canvas.height, css);

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const arte = new THREE.Mesh(
    new THREE.PlaneGeometry(largura - 0.12, altura - 0.12),
    new THREE.MeshBasicMaterial({ map: textura }),
  );
  /**
   * A ARTE VAI NA FRENTE DO FILETE, e essa altura já esteve errada: com a arte
   * em `z = 0,031` e o filete terminando em `0,037`, o retrato ficava ENTERRADO
   * dentro da moldura dourada e o quadro aparecia como um retângulo de ouro
   * chapado. As três camadas sobem em ordem: filete até 0,034, arte em 0,038,
   * vidro em 0,040.
   */
  arte.position.z = 0.038;
  arte.renderOrder = 1;
  g.add(arte);

  // o vidro: uma faixa clara na diagonal, de canto a canto do alto
  const vidro = new THREE.Mesh(
    new THREE.PlaneGeometry(largura - 0.12, (altura - 0.12) * 0.42),
    flat(0xffffff, 0.09, true),
  );
  vidro.position.set(0, altura * 0.22, 0.04);
  vidro.renderOrder = 2;
  g.add(vidro);

  return g;
}

/** O retrato: a cabeca do Walter de frente, com a faixa e o nome. */
function pintarOWalter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  css: (cor: number) => string,
): void {
  // ------------------------------------------------------------ o fundo
  ctx.fillStyle = css(P.churrascoParede);
  ctx.fillRect(0, 0, w, h);

  // a faixa do titulo, no alto
  ctx.fillStyle = css(P.churrascoQuadroNegro);
  ctx.fillRect(0, 0, w, h * 0.13);
  ctx.fillStyle = css(P.churrascoBrasaViva);
  ctx.font = `bold ${Math.round(h * 0.052)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EMPREGADO DO MÊS', w / 2, h * 0.066);

  // o oval do retrato, num tom quente
  const cx = w / 2;
  const cy = h * 0.45;
  const rx = w * 0.37;
  const ry = h * 0.25;
  ctx.fillStyle = css(P.churrascoTijolo);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00000018';
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.012, rx * 0.94, ry * 0.94, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---------------------------------------------------------- o cachorro
  const R = w * 0.19;   // o raio da cabeca, e a regua de tudo abaixo

  /**
   * A GRAVATA VEM PRIMEIRO, porque ela fica atras do queixo — e vem BAIXA, em
   * `R * 1,08`. Na primeira versao ela estava em `0,92` e a linguinha, que vai
   * ate `R * 0,81`, cobria o no e as duas asas: sobrava um borrao vermelho onde
   * era para ter uma gravata borboleta.
   */
  ctx.fillStyle = css(P.gravataBorboleta);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + R * 1.08);
    ctx.lineTo(cx + lado * R * 0.66, cy + R * 0.84);
    ctx.lineTo(cx + lado * R * 0.66, cy + R * 1.32);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = css(P.gravataNo);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 1.08, R * 0.15, R * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // as orelhas caidas, uma de cada lado, ANTES da cabeca para ficarem atras
  ctx.fillStyle = css(P.cachorroOrelha);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.9, cy + R * 0.2, R * 0.34, R * 0.68, lado * 0.24, 0, Math.PI * 2);
    ctx.fill();
  }

  // a cabeca
  ctx.fillStyle = css(P.cachorroPelo);
  ctx.beginPath();
  ctx.ellipse(cx, cy - R * 0.06, R * 0.86, R * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // o focinho claro
  ctx.fillStyle = css(P.cachorroPeito);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 0.36, R * 0.44, R * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();

  // a linguinha de fora, que e o que faz o retrato ser FOFO e nao 3x4
  ctx.fillStyle = css(P.churrascoToalha);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 0.62, R * 0.15, R * 0.19, 0, 0, Math.PI * 2);
  ctx.fill();

  // o nariz
  ctx.fillStyle = css(P.cachorroFocinho);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 0.22, R * 0.17, R * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(1, R * 0.055);
  ctx.strokeStyle = css(P.cachorroFocinho);
  ctx.beginPath();
  ctx.moveTo(cx, cy + R * 0.33);
  ctx.lineTo(cx, cy + R * 0.46);
  ctx.stroke();

  // os olhos, com o brilhinho
  for (const lado of [-1, 1]) {
    ctx.fillStyle = css(P.cachorroFocinho);
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.34, cy - R * 0.16, R * 0.12, R * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.3, cy - R * 0.22, R * 0.045, R * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // as sobrancelhas claras: sao elas que dao EXPRESSAO a um focinho simetrico
  ctx.fillStyle = css(P.cachorroPeito);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.36, cy - R * 0.42, R * 0.14, R * 0.07, lado * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // ------------------------------------------------------------- o nome
  ctx.fillStyle = css(P.churrascoQuadroNegro);
  ctx.font = `bold ${Math.round(h * 0.085)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillText('WALTER', w / 2, h * 0.795);
  ctx.font = `${Math.round(h * 0.037)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillStyle = css(P.churrascoFaixa);
  ctx.fillText('garçom · atendimento nota 10', w / 2, h * 0.862);

  // as estrelinhas embaixo, o carimbo de que ele ganhou
  ctx.fillStyle = css(P.churrascoBrasaViva);
  for (let i = 0; i < 5; i++) {
    estrela(ctx, w * (0.3 + i * 0.1), h * 0.94, h * 0.023);
  }
}

/** Uma estrela de cinco pontas, cheia. */
function estrela(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const raio = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(ang) * raio;
    const y = cy + Math.sin(ang) * raio;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}
