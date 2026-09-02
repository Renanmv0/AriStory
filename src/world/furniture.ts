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
