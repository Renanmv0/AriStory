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
  /**
   * A FLOREIRA VAI NUM GRUPO SEPARADO, e nao solta na mesa, porque ela DISPUTA
   * O CENTRO com o prato: a comida que o garcom serve pousa exatamente aqui, e
   * sem tirar o vaso o prato atravessa as flores.
   *
   * A mesa de patio do clube resolveu isso tirando o vasinho de vez. Aqui nao
   * dava: sao onze mesas, e um salao inteiro de mesas peladas fica pobre. Entao
   * a floreira fica, com nome e atalho em `userData` — quem serve comida nesta
   * mesa esconde ela enquanto dura a refeicao.
   */
  const floreira = new THREE.Group();
  floreira.name = 'floreira';
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 10), toon(P.wallMint));
  vaso.position.y = 0.87;
  floreira.add(vaso);
  for (const side of [-1, 1]) {
    const flor = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), toon(side < 0 ? P.flowerPink : P.flowerYellow));
    flor.position.set(side * 0.05, 1.03, 0);
    floreira.add(flor);
  }
  g.add(floreira);
  g.userData.floreira = floreira;
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

/**
 * A PLACA DE FACHADA do restaurante — o letreiro com o nome da casa.
 *
 * A primeira versão era uma caixa verde chapada com o texto colado em cima: de
 * longe lia como adesivo na parede, e não como a placa de que a casa se
 * orgulha. Uma placa de churrascaria de verdade tem MOLDURA, tem cornija em
 * cima e embaixo, tem filete dourado por dentro e tem pilastra nas pontas — é
 * a soma dessas quatro coisas que faz a peça ganhar espessura numa câmera que
 * achata tudo.
 *
 * AS CAMADAS SOBEM EM ORDEM, e nenhuma divide plano com a de baixo — duas
 * faces opacas coplanares olhando para o mesmo lado serrilham:
 *
 *   moldura  -0,050 … 0,050   (a madeira por trás de tudo)
 *   fundo    -0,015 … 0,075   (o verde do quadro)
 *   filete    0,079 … 0,091   (as quatro barras douradas)
 *   texto     0,100           (o plano do letreiro)
 *
 * As pilastras são mais LARGAS que a placa (nascem centradas na ponta, e não
 * encostadas por dentro): coladas por dentro, a face externa delas cairia no
 * mesmo plano da lateral da moldura, que é o caso `max × max` que serrilha.
 *
 * O texto vem de fora, em `letreiro()`, para esta peça não conhecer canvas.
 */
export function placaDeFachada(
  texto: THREE.Mesh,
  largura = 6.2,
  altura = 1.0,
  corFundo: number = P.churrascoQuadroNegro,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-de-fachada';
  const madeira = toon(P.woodDark);
  const ouro = toon(P.churrascoBrasaViva);

  const moldura = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.1), madeira);
  g.add(moldura);

  const fundo = new THREE.Mesh(
    new THREE.BoxGeometry(largura - 0.22, altura - 0.22, 0.09), toon(corFundo),
  );
  fundo.position.z = 0.03;
  g.add(fundo);

  // o filete dourado: quatro barras finas formando um retângulo por dentro do
  // verde. Retângulo cheio viraria uma chapa de ouro — o que se quer é o fio
  const fx = largura - 0.42;
  const fy = altura - 0.42;
  for (const sy of [-1, 1] as const) {
    const barra = new THREE.Mesh(new THREE.BoxGeometry(fx, 0.035, 0.012), ouro);
    barra.position.set(0, (sy * fy) / 2, 0.085);
    g.add(barra);
  }
  for (const sx of [-1, 1] as const) {
    const barra = new THREE.Mesh(new THREE.BoxGeometry(0.035, fy - 0.035, 0.012), ouro);
    barra.position.set((sx * fx) / 2, 0, 0.085);
    g.add(barra);
  }

  // as cornijas: o beiral em cima e o rodapé embaixo. São mais FUNDAS que a
  // moldura, e é essa saliência que faz a placa ter volume de longe.
  for (const sy of [-1, 1] as const) {
    const cornija = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.3, 0.13, 0.26), madeira);
    cornija.position.set(0, (sy * altura) / 2 + sy * 0.065, 0.06);
    g.add(cornija);
    // o friso claro colado na cornija, do lado de fora: o risco que separa a
    // madeira da parede quando as duas pegam a mesma luz
    const friso = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.3, 0.03, 0.02), ouro);
    friso.position.set(0, (sy * altura) / 2 + sy * 0.065, 0.2);
    g.add(friso);
  }

  // as pilastras das pontas, com o medalhão de latão no meio de cada uma
  for (const sx of [-1, 1] as const) {
    const pilastra = new THREE.Mesh(new THREE.BoxGeometry(0.2, altura + 0.06, 0.16), madeira);
    pilastra.position.set((sx * largura) / 2, 0, 0.04);
    g.add(pilastra);
    const medalhao = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12), ouro);
    medalhao.rotation.x = Math.PI / 2;
    medalhao.position.set((sx * largura) / 2, 0, 0.14);
    g.add(medalhao);
  }

  texto.position.z = 0.1;
  g.add(texto);
  return g;
}

/* ============================================================================
 *                     O MIOLO DA LOJINHA DE ROUPAS
 *
 * As pecas de dentro da loja da Estella. Elas moram aqui, e nao em `props.ts`,
 * pela regra do kit: `props.ts` e o de fora (arvore, poste, quiosque) e
 * `furniture.ts` e o de dentro.
 * ========================================================================== */

/**
 * Sorteio REPETIVEL, e e por isso que nao ha `Math.random()` aqui.
 *
 * Uma arara sorteada com `Math.random()` fica diferente a cada `npm run build`:
 * a foto do teste nunca bate com a anterior, e "o que mudou?" passa a ser
 * impossivel de responder olhando duas capturas. Com semente, a mesma arara sai
 * igual em todo build — e continua variada, que e o que se queria de verdade.
 * E o mesmo xorshift do resto do jogo (o cerebro dos bichos, a musica).
 */
function sorteio(semente: number): () => number {
  let s = semente >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return (s % 100000) / 100000;
  };
}

/**
 * AS COLECOES DA LOJA, e esta e a decisao que faz a arara parecer uma arara.
 *
 * Cada linha e uma familia de tons que conversam entre si, do jeito que uma
 * loja de verdade agrupa a arara ("a coleção de outono", "os pasteis"). Sortear
 * cor a cor entre as doze daria uma arara com doze cores diferentes — e isso na
 * tela le como caixa de lapis de cor, nao como roupa a venda.
 *
 * A variedade vem de as ARARAS serem diferentes entre si, e nao as pecas dentro
 * de uma arara. E a mesma regra de uma vitrine de verdade.
 */
export const COLECOES: readonly (readonly number[])[] = [
  // os pasteis
  [P.tecidoRosa, P.tecidoLilas, P.tecidoCeu, P.tecidoManteiga],
  // o outono
  [P.tecidoMostarda, P.tecidoCoral, P.tecidoVinho, P.tecidoPessego],
  // os frios
  [P.tecidoPetroleo, P.tecidoIndigo, P.tecidoCeu, P.tecidoMenta],
  // a terra
  [P.tecidoOliva, P.tecidoMostarda, P.tecidoManteiga, P.tecidoPessego],
];

export type TipoDePeca = 'camisa' | 'vestido' | 'calca' | 'casaco';

/**
 * UMA PECA DE ROUPA PENDURADA NO CABIDE.
 *
 * O truque de forma e o `CylinderGeometry` de QUATRO lados: ele e uma caixa que
 * AFINA (raio de cima diferente do de baixo), e roupa e exatamente isso — a
 * camisa abre do ombro para a barra, a saia abre muito mais, a calca fecha.
 * Com `BoxGeometry` toda peca sairia com a mesma largura em cima e embaixo, que
 * e o desenho de uma placa, nao de um pano.
 *
 * E toda peca e ACHATADA no eixo Z (`scale.z`): roupa no cabide e quase plana,
 * e e essa espessura pequena que faz doze pecas caberem lado a lado numa arara
 * sem virar um bloco macico.
 */
export function pecaPendurada(
  tipo: TipoDePeca,
  cor: number,
  corDetalhe: number,
): THREE.Group {
  const g = new THREE.Group();
  const pano = toon(cor);
  const detalhe = toon(corDetalhe);
  /** caixa que afina: 4 lados, girada 45° para as faces ficarem retas */
  const tronco = (rCima: number, rBaixo: number, alt: number, mat: THREE.Material): THREE.Mesh => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rBaixo, rCima, alt, 4, 1), mat);
    m.rotation.y = Math.PI / 4;
    return m;
  };

  if (tipo === 'calca') {
    // cos: a unica peca que pendura pela CINTURA, entao ela comeca larga e
    // desce em duas pernas com um vao no meio
    const cos = tronco(0.19, 0.2, 0.16, pano);
    cos.position.y = -0.08;
    cos.scale.z = 0.4;
    g.add(cos);
    for (const lado of [-1, 1] as const) {
      const perna = tronco(0.1, 0.085, 0.62, pano);
      perna.position.set(lado * 0.085, -0.47, 0);
      perna.scale.z = 0.55;
      g.add(perna);
    }
    const cinto = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 0.13), detalhe);
    cinto.position.y = -0.02;
    g.add(cinto);
    return g;
  }

  /*
   * ------------------------------------------------- camisa, vestido e casaco
   *
   * A ESPESSURA (`scale.z`) FOI DE 0,42 PARA 0,55 depois da primeira foto de
   * perto: com 0,42 a peca virava um recorte de papel — de perto dava para ver
   * que a camisa nao tinha lado nenhum. Roupa no cabide e fina, mas nao e
   * chapa.
   *
   * E O OMBRO E MAIS LARGO QUE O TOPO DO CORPO (0,22 contra 0,2): e a saliencia
   * do ombro que a manga pendura POR BAIXO. Sem ela as mangas nasciam na mesma
   * linha do tronco e liam como duas asas coladas no lado da peca.
   */
  const largo = tipo === 'casaco' ? 1.12 : 1;
  const ombro = tronco(0.15 * largo, 0.22 * largo, 0.12, pano);
  ombro.position.y = -0.06;
  ombro.scale.z = 0.55;
  g.add(ombro);

  const corpoAlt = tipo === 'vestido' ? 0.3 : tipo === 'casaco' ? 0.56 : 0.44;
  const corpo = tronco(0.21 * largo, (tipo === 'vestido' ? 0.17 : 0.24) * largo, corpoAlt, pano);
  corpo.position.y = -0.12 - corpoAlt / 2;
  corpo.scale.z = 0.55;
  g.add(corpo);

  if (tipo !== 'vestido') {
    // a BARRA: um risco um degrau mais escuro no fim do pano. E o detalhe que
    // faz a peca terminar em vez de simplesmente parar
    const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.245 * largo, 0.245 * largo, 0.025, 4), detalhe);
    barra.rotation.y = Math.PI / 4;
    barra.position.y = -0.12 - corpoAlt;
    barra.scale.z = 0.55;
    g.add(barra);
  }

  if (tipo === 'vestido') {
    // a saia abre MUITO (0,17 na cintura para 0,34 na barra): e a abertura que
    // separa vestido de camisa comprida na silhueta de longe
    const saia = tronco(0.17, 0.34, 0.42, pano);
    saia.position.y = -0.63;
    saia.scale.z = 0.58;
    g.add(saia);
    const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.345, 0.345, 0.03, 12), detalhe);
    barra.position.y = -0.83;
    barra.scale.z = 0.58;
    g.add(barra);
  }

  // as MANGAS penduram do ombro, afastadas e inclinadas para fora: sem elas a
  // peca e um retangulo, e retangulo pendurado nao le como camisa
  const mangaAlt = tipo === 'casaco' ? 0.42 : 0.3;
  for (const lado of [-1, 1] as const) {
    const manga = tronco(0.075 * largo, 0.055 * largo, mangaAlt, pano);
    manga.position.set(lado * 0.2 * largo, -0.16 - mangaAlt / 2, 0);
    manga.rotation.z = lado * 0.22;
    manga.scale.z = 0.55;
    g.add(manga);
  }

  // a gola: um vao escuro no alto, que e onde o cabide entra
  const gola = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.05, 10), detalhe);
  gola.position.y = -0.02;
  gola.scale.z = 0.5;
  g.add(gola);

  if (tipo === 'casaco') {
    // duas lapelas e uma fila de botoes: e o que diz "casaco" e nao "camisa
    // grande"
    for (const lado of [-1, 1] as const) {
      const lapela = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.04), detalhe);
      lapela.position.set(lado * 0.055, -0.16, 0.045);
      lapela.rotation.z = lado * 0.16;
      g.add(lapela);
    }
    for (let i = 0; i < 3; i++) {
      const botao = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5), detalhe);
      botao.position.set(0, -0.3 - i * 0.11, 0.05);
      g.add(botao);
    }
  }
  return g;
}

/** o cabide: o gancho, os dois ombros e a barra de baixo */
function cabide(cor: number = P.lojaMetal): THREE.Group {
  const g = new THREE.Group();
  const m = toon(cor);
  const gancho = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 5, 12, Math.PI * 1.5), m);
  gancho.position.y = 0.075;
  gancho.rotation.z = Math.PI * 0.25;
  g.add(gancho);
  /*
   * OS DOIS OMBROS SE ENCOSTAM NO MEIO, e não se ATRAVESSAM.
   *
   * Com 0,16 eles cruzavam 1 cm um dentro do outro — e como são espelhados, a
   * caixa envolvente dos dois é a MESMA em `y` e em `z`: quatro planos
   * coplanares por cabide, vezes toda arara da loja. Com 0,152 eles se tocam e
   * param, o gancho cobre a emenda, e o `zfighting.mjs` deixa de ter o que
   * marcar (a sobreposição cai abaixo dos 4 mm que ele exige para ligar).
   */
  for (const lado of [-1, 1] as const) {
    const ombro = new THREE.Mesh(new THREE.BoxGeometry(0.152, 0.012, 0.012), m);
    ombro.position.set(lado * 0.075, -0.01, 0);
    ombro.rotation.z = lado * -0.28;
    g.add(ombro);
  }
  const barra = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.01, 0.01), m);
  barra.position.y = -0.055;
  g.add(barra);
  return g;
}

export interface AraraOpts {
  largura?: number;
  altura?: number;
  /** qual familia de cores (indice em `COLECOES`); fora da lista, sorteia */
  colecao?: number;
  /** o que pendura nela */
  tipos?: readonly TipoDePeca[];
  /** semente do sorteio: mesma semente, mesma arara em todo build */
  semente?: number;
}

/**
 * ======================================== A ARARA DE ROUPAS
 *
 * Estrutura de metal (dois pes em T, dois montantes e a barra) com uma fila de
 * cabides pendurados. E a peca que faz a loja parecer loja, e o que decide se
 * ela fica bonita nao e a geometria — e a VARIACAO. Seis regras, e cada uma
 * conserta um jeito diferente de a fila sair errada:
 *
 * 1. **A COR VEM DE UMA COLECAO**, nao do sorteio livre entre as doze. Arara
 *    com doze cores le como caixa de lapis; tres ou quatro tons que conversam
 *    leem como "a coleção de outono". A variedade fica entre as ARARAS.
 * 2. **UMA PECA DESTOA de proposito.** Uma so, sorteada, sai de outra coleção:
 *    e a peça que o olho acha primeiro, e sem ela a arara fica monotona mesmo
 *    com quatro tons.
 * 3. **CADA CABIDE GIRA UM POUCO** (±0,3 rad). Roupa pendurada nunca esta toda
 *    paralela, e este e o detalhe que mais faz a fila parecer mexida por gente.
 * 4. **AS ALTURAS DIFEREM** em centimetros, e os espacamentos tambem. Fila
 *    perfeitamente regular le como textura impressa, nao como objeto.
 * 5. **OS COMPRIMENTOS SE MISTURAM** (camisa, vestido, calca): e o que quebra a
 *    linha reta na barra de baixo da arara.
 * 6. **FALTA UMA AQUI E ALI.** Um vao no meio da fila conta uma historia — que
 *    alguem levou uma peca para o provador — e custa uma linha.
 */
export function araraDeRoupas(opts: AraraOpts = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arara-de-roupas';
  const largura = opts.largura ?? 1.8;
  const altura = opts.altura ?? 1.55;
  const rnd = sorteio(opts.semente ?? 20260908);
  const metal = toon(P.lojaMetal);
  const metalEscuro = toon(P.lojaMetalEscuro);

  // ---------------------------------------------------------- a estrutura
  for (const lado of [-1, 1] as const) {
    const x = lado * (largura / 2 - 0.05);
    // o pe em T, com quatro rodizios: arara de loja anda, e o rodizio e o
    // detalhe que diz isso
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.62), metalEscuro);
    pe.position.set(x, 0.06, 0);
    g.add(pe);
    for (const z of [-0.26, 0.26]) {
      const rodizio = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), metalEscuro);
      rodizio.position.set(x, 0.035, z);
      g.add(rodizio);
    }
    const montante = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, altura - 0.08, 8), metal);
    montante.position.set(x, 0.08 + (altura - 0.08) / 2, 0);
    g.add(montante);
  }
  const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, largura, 8), metal);
  barra.rotation.z = Math.PI / 2;
  barra.position.y = altura;
  g.add(barra);
  // a travessa de baixo, onde ficam os sapatos e as caixas
  const travessa = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, largura - 0.12, 6), metal);
  travessa.rotation.z = Math.PI / 2;
  travessa.position.y = 0.28;
  g.add(travessa);

  // ------------------------------------------------------------- as roupas
  const familia = COLECOES[(opts.colecao ?? Math.floor(rnd() * COLECOES.length)) % COLECOES.length];
  const outra = COLECOES[(COLECOES.indexOf(familia) + 2) % COLECOES.length];
  const tipos = opts.tipos ?? (['camisa', 'camisa', 'vestido', 'calca', 'casaco'] as const);
  // o passo acompanha a espessura da peca: com 0,115 e o pano mais cheio, duas
  // pecas vizinhas se atravessavam no giro
  const passo = 0.132;
  const quantas = Math.max(3, Math.floor((largura - 0.24) / passo));
  const inicio = -((quantas - 1) * passo) / 2;
  // a peca que destoa: uma so na arara, sorteada
  const destaque = Math.floor(rnd() * quantas);

  for (let i = 0; i < quantas; i++) {
    // o vao: uma em nove sai da fila, como se alguem tivesse levado a peca
    if (rnd() < 0.11) continue;
    const tipo = tipos[Math.floor(rnd() * tipos.length)];
    const cor = i === destaque
      ? outra[Math.floor(rnd() * outra.length)]
      : familia[Math.floor(rnd() * familia.length)];
    // o detalhe (gola, cinto, barra) e um degrau da MESMA cor, e nao uma cor
    // nova: contraste demais em peca de 30 cm vira sujeira na tela
    const escuro = new THREE.Color(cor).multiplyScalar(0.78).getHex();

    const conjunto = new THREE.Group();
    conjunto.add(cabide());
    const roupa = pecaPendurada(tipo, cor, escuro);
    roupa.position.y = -0.02;
    conjunto.add(roupa);
    conjunto.position.set(
      inicio + i * passo + (rnd() - 0.5) * 0.03,
      altura - 0.06 + (rnd() - 0.5) * 0.03,
      (rnd() - 0.5) * 0.05,
    );
    conjunto.rotation.y = (rnd() - 0.5) * 0.6;
    g.add(conjunto);
  }
  return g;
}

/**
 * ======================================== OS PROVADORES
 *
 * Uma fileira de cabines encostada na parede do fundo. Elas nascem OLHANDO PARA
 * `+Z`, como toda peca do kit, e a cena gira.
 *
 * AS DIVISORIAS SAO COMPARTILHADAS: `n` cabines tem `n + 1` paredes, e nao
 * `2n`. Nao e so economia de malha — duas paredes encostadas uma na outra sao
 * duas faces coplanares, que e exatamente o que serrilha na tela.
 *
 * A CORTINA E O QUE DIZ "provador". Ela e feita de tiras verticais estreitas
 * com um seno na posicao em `z`, o que da a ONDULACAO do pano franzido sem
 * geometria deformavel: cortina em plano liso le como porta pintada. Uma das
 * cabines fica ABERTA (a cortina recuada, meia largura) — cabine aberta e o
 * convite para entrar, e as tres fechadas leem como armario.
 *
 * O ESPELHO no fundo de cada cabine e `flat()`, e nao `toon()`: espelho nao tem
 * sombra propria, e o material sem luz e o unico que da o vidro chapado e claro
 * que o olho le como reflexo nesta escala.
 */
export function provadores(
  quantas = 3,
  opts: { largura?: number; altura?: number; corCortina?: number } = {},
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'provadores';
  const larg = opts.largura ?? 1.15;
  const alt = opts.altura ?? 2.25;
  const fundo = 1.05;
  const parede = toon(P.lojaFriso);
  const madeira = toon(P.woodDark);
  const total = quantas * larg;

  // o fundo corrido
  const costas = new THREE.Mesh(new THREE.BoxGeometry(total, alt, 0.08), parede);
  costas.position.set(0, alt / 2, -fundo);
  g.add(costas);

  /*
   * AS DIVISÓRIAS: n+1, compartilhadas entre as cabines. Elas são 8 mm mais
   * baixas que o fundo — 4 mm de folga em cima e 4 embaixo — e a verga passa
   * 12 mm acima de todo mundo.
   *
   * Isso não é detalhe de marcenaria, é o conserto do serrilhado: com as cinco
   * paredes nascendo em `y = 0` e terminando em `y = alt`, junto com a verga,
   * davam 25 pares de faces coplanares — e os de CIMA são os que aparecem, que
   * a câmera olha de 34° e vê o topo de tudo. As duas folgas somem: a de baixo
   * atrás da cortina, a de cima dentro da verga.
   */
  for (let i = 0; i <= quantas; i++) {
    const x = -total / 2 + i * larg;
    const divisoria = new THREE.Mesh(new THREE.BoxGeometry(0.08, alt - 0.008, fundo), parede);
    divisoria.position.set(x, alt / 2, -fundo / 2);
    g.add(divisoria);
  }

  // a verga por cima, com o trilho da cortina
  const verga = new THREE.Mesh(new THREE.BoxGeometry(total + 0.1, 0.22, fundo + 0.06), parede);
  verga.position.set(0, alt - 0.098, -fundo / 2 + 0.02);
  g.add(verga);
  const trilho = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, total, 8), toon(P.lojaMetal));
  trilho.rotation.z = Math.PI / 2;
  trilho.position.set(0, alt - 0.28, 0.01);
  g.add(trilho);

  for (let c = 0; c < quantas; c++) {
    const cx = -total / 2 + larg * (c + 0.5);
    const aberta = c === quantas - 1;

    // ------------------------------------------------------------- a cortina
    const cortina = new THREE.Group();
    const tiras = 11;
    const largaDaTira = (aberta ? larg * 0.45 : larg - 0.1) / tiras;
    for (let t = 0; t < tiras; t++) {
      const tira = new THREE.Mesh(
        new THREE.BoxGeometry(largaDaTira * 1.06, alt - 0.42, 0.035),
        toon(opts.corCortina ?? P.lojaCortinaProvador),
      );
      /*
       * O FRANZIDO: um seno em `z` por tira. Sem ele a cortina e um plano liso,
       * e plano liso pendurado le como porta de armario.
       *
       * E CADA TIRA DESCE UM TANTO DIFERENTE (`desce`), o que e verdade de
       * cortina franzida — barra reta e coisa de porta — e e tambem o que tira
       * as tiras VIZINHAS do mesmo plano. Elas se sobrepoem 6% de proposito
       * (para nao abrir fresta), entao com todas comecando e terminando na
       * mesma linha eram 22 pares coplanares por provador. Os tres valores
       * (0, 3, 6, 9, 12, 15 mm) nunca se repetem entre vizinhas.
       */
      const desce = (t % 3) * 0.006 + (t % 2) * 0.003;
      tira.position.set(
        -((tiras - 1) * largaDaTira) / 2 + t * largaDaTira,
        (alt - 0.42) / 2 - desce,
        Math.sin(t * 1.9) * 0.035,
      );
      cortina.add(tira);
    }
    // aberta, ela recua para um lado e mostra o dentro da cabine
    cortina.position.set(cx + (aberta ? larg * 0.26 : 0), 0.08, -0.02);
    g.add(cortina);

    // ---------------------------------------------------- o dentro da cabine
    const espelho = new THREE.Mesh(
      new THREE.BoxGeometry(larg - 0.34, 1.5, 0.03),
      flat(P.lojaEspelhoVidro, 0.92),
    );
    espelho.position.set(cx, 1.05, -fundo + 0.07);
    g.add(espelho);
    const moldura = new THREE.Mesh(new THREE.BoxGeometry(larg - 0.28, 1.58, 0.02), madeira);
    moldura.position.set(cx, 1.05, -fundo + 0.055);
    g.add(moldura);

    // o banquinho e o gancho: dois objetos pequenos que enchem a cabine aberta
    const banco = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.3), madeira);
    banco.position.set(cx, 0.42, -fundo + 0.28);
    g.add(banco);
    for (const lado of [-1, 1] as const) {
      const pe = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), madeira);
      pe.position.set(cx + lado * 0.16, 0.21, -fundo + 0.28);
      g.add(pe);
    }
    const gancho = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 5, 10, Math.PI), toon(P.lojaMetal));
    gancho.position.set(cx + larg * 0.3, 1.75, -fundo + 0.1);
    gancho.rotation.x = Math.PI / 2;
    g.add(gancho);

    // o numero da cabine, numa plaquinha
    const placa = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.02), madeira);
    placa.position.set(cx, alt - 0.11, fundo * 0.02 + 0.05);
    g.add(placa);
    for (let i = 0; i <= c; i++) {
      const risco = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.08, 0.012), toon(P.lojaMetal));
      risco.position.set(cx - c * 0.022 + i * 0.044, alt - 0.11, fundo * 0.02 + 0.06);
      g.add(risco);
    }
  }
  return g;
}

/**
 * O MANEQUIM DE CHAO, vestido.
 *
 * O da vitrine (em `lojaDeRoupas.ts`) e um torso num pedestal — de fora, atras
 * do vidro, e o suficiente. Aqui dentro a dupla passa do lado dele, entao ele
 * ganha bracos, pernas e uma peca de roupa de verdade por cima.
 *
 * ELE NAO TEM ROSTO, e isso e regra e nao economia: manequim com olho vira
 * gente parada dentro da loja, e o susto e imediato. A cabeca e um ovo liso.
 */
export function manequimDeLoja(
  corRoupa: number = P.tecidoRosa,
  tipo: TipoDePeca = 'vestido',
  corDetalhe?: number,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'manequim-de-loja';
  const pele = toon(P.lojaManequim);
  const metal = toon(P.lojaMetalEscuro);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.05, 14), metal);
  base.position.y = 0.025;
  g.add(base);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.62, 8), metal);
  haste.position.y = 0.34;
  g.add(haste);

  const quadril = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
  quadril.scale.set(0.17, 0.16, 0.13);
  quadril.position.y = 0.72;
  g.add(quadril);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.52, 12), pele);
  torso.scale.z = 0.78;
  torso.position.y = 1.0;
  g.add(torso);
  const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
  peito.scale.set(0.2, 0.13, 0.15);
  peito.position.y = 1.22;
  g.add(peito);
  // o pescoco decepado, que e como manequim de loja termina
  const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.14, 10), pele);
  pescoco.position.y = 1.35;
  g.add(pescoco);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 12), pele);
  cabeca.scale.set(0.11, 0.15, 0.12);
  cabeca.position.y = 1.52;
  g.add(cabeca);

  for (const lado of [-1, 1] as const) {
    const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.54, 8), pele);
    braco.position.set(lado * 0.21, 1.02, 0.02);
    braco.rotation.z = lado * 0.12;
    g.add(braco);
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.62, 8), pele);
    perna.position.set(lado * 0.075, 0.42, 0);
    g.add(perna);
  }

  // e a roupa por cima, a MESMA peca que pendura nas araras — o manequim veste
  // o que a loja vende, e nao uma roupa desenhada so para ele
  /**
   * ============================ A ROUPA DO MANEQUIM E COSTURADA NO CORPO DELE
   *
   * A primeira versao pendurava nele a MESMA peca das araras, so que maior. Nao
   * funciona, e a foto mostrou na hora: a peca do cabide e um pano CHATO de
   * quatro lados (e o desenho certo para uma roupa pendurada), e chapa achatada
   * colada num torso redondo le como uma placa espetada no boneco — o vestido
   * azul virou uma tabua e o casaco rosa uma nuvem de trapezios.
   *
   * Aqui a roupa acompanha a FORMA do manequim: cilindros um fio maiores que o
   * torso, que abrem no quadril como a saia abre, e mangas que descem POR CIMA
   * do braco que ja existe. E o mesmo caminho do manequim da vitrine.
   */
  const pano = toon(corRoupa);
  const debrum = toon(corDetalhe ?? new THREE.Color(corRoupa).multiplyScalar(0.78).getHex());
  const vestir = (rCima: number, rBaixo: number, y0: number, y1: number, mat: THREE.Material): THREE.Mesh => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rCima, rBaixo, y1 - y0, 14), mat);
    m.scale.z = 0.82;
    m.position.y = (y0 + y1) / 2;
    g.add(m);
    return m;
  };

  if (tipo === 'vestido') {
    vestir(0.21, 0.2, 1.06, 1.3, pano);          // o corpete
    vestir(0.2, 0.34, 0.62, 1.06, pano);         // a saia, abrindo no quadril
    const barra = vestir(0.345, 0.345, 0.6, 0.63, debrum);
    barra.scale.z = 0.82;
    for (const lado of [-1, 1] as const) {
      const alca = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.03), pano);
      alca.position.set(lado * 0.1, 1.32, 0.06);
      alca.rotation.z = lado * 0.08;
      g.add(alca);
    }
  } else if (tipo === 'calca') {
    vestir(0.2, 0.19, 0.62, 0.78, pano);
    for (const lado of [-1, 1] as const) {
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.5, 10), pano);
      perna.position.set(lado * 0.075, 0.36, 0);
      g.add(perna);
    }
  } else {
    // camisa e casaco: torso mais os dois bracos vestidos
    const compriment = tipo === 'casaco' ? 0.72 : 0.86;
    vestir(0.21, 0.23, compriment, 1.3, pano);
    const barra = vestir(0.235, 0.235, compriment - 0.03, compriment, debrum);
    barra.scale.z = 0.82;
    for (const lado of [-1, 1] as const) {
      const manga = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.05, tipo === 'casaco' ? 0.5 : 0.34, 10),
        pano,
      );
      manga.position.set(lado * 0.215, tipo === 'casaco' ? 1.06 : 1.14, 0.02);
      manga.rotation.z = lado * 0.12;
      g.add(manga);
    }
    if (tipo === 'casaco') {
      // a gola e a fila de botoes, que e o que separa casaco de camiseta
      for (const lado of [-1, 1] as const) {
        const lapela = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.3, 0.03), debrum);
        lapela.position.set(lado * 0.06, 1.14, 0.17);
        lapela.rotation.z = lado * 0.14;
        g.add(lapela);
      }
      const gola = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.026, 6, 14, Math.PI), debrum);
      gola.position.set(0, 1.3, 0.02);
      gola.rotation.x = Math.PI / 2;
      gola.rotation.z = Math.PI;
      g.add(gola);
    }
  }
  return g;
}

/**
 * O BALCAO DO CAIXA. Um "L" de tampo de madeira sobre corpo claro, com painel
 * frontal almofadado, prateleira interna e um pedaco de vidro na ponta — a
 * vitrininha de bijuteria que todo caixa de loja tem.
 *
 * Ele nasce olhando para `+Z` (o cliente chega por `+Z`), e a parte de dentro
 * (onde a Estella fica) e o `-Z`.
 */
export function balcaoDaLoja(largura = 2.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balcao-da-loja';
  const corpo = toon(P.lojaFriso);
  const tampo = toon(P.lojaBalcao);
  const alt = 1.0;
  const fundo = 0.62;

  /*
   * O CORPO NASCE 5 mm ACIMA DO CHÃO, e quem encosta no piso é o rodapé. Com
   * os dois nascendo em `y = 0` sobrava 1,49 m² de barriga coplanar com a
   * barriga do rodapé — a maior área do relatório do `zfighting.mjs` na loja
   * inteira. De quebra, os 5 mm fecham a fresta que havia entre o corpo e o
   * tampo.
   */
  const caixa = new THREE.Mesh(new THREE.BoxGeometry(largura, alt - 0.06, fundo), corpo);
  caixa.position.set(0, (alt - 0.06) / 2 + 0.005, 0);
  g.add(caixa);
  const tampoM = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.1, 0.07, fundo + 0.12), tampo);
  tampoM.position.y = alt - 0.02;
  g.add(tampoM);

  // as almofadas do painel da frente: tres quadros rasos, o detalhe que separa
  // um balcao de marcenaria de uma caixa de papelao
  const quantas = Math.max(2, Math.round(largura / 0.8));
  for (let i = 0; i < quantas; i++) {
    const w2 = (largura - 0.2) / quantas;
    const painel = new THREE.Mesh(new THREE.BoxGeometry(w2 - 0.1, alt - 0.34, 0.03), toon(P.lojaParedeDentro));
    painel.position.set(-largura / 2 + 0.1 + w2 * (i + 0.5), (alt - 0.06) / 2, fundo / 2 + 0.005);
    g.add(painel);
  }
  const rodape = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.04, 0.1, fundo + 0.04), toon(P.lojaRodape));
  rodape.position.y = 0.05;
  g.add(rodape);

  // a vitrininha de vidro na ponta: bijuteria em cima de um pano
  const vitrine = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, fundo - 0.14), flat(P.lojaEspelhoVidro, 0.34));
  vitrine.position.set(largura / 2 - 0.34, alt + 0.16, 0);
  g.add(vitrine);
  const pano = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.02, fundo - 0.18), toon(P.lojaCortinaProvador));
  pano.position.set(largura / 2 - 0.34, alt + 0.03, 0);
  g.add(pano);
  for (let i = 0; i < 3; i++) {
    const joia = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), toon(P.gold));
    joia.position.set(largura / 2 - 0.48 + i * 0.14, alt + 0.06, (i % 2) * 0.08 - 0.04);
    g.add(joia);
  }

  // a prateleira de dentro, com as sacolas da loja
  const prateleira = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.14, 0.04, fundo - 0.16), toon(P.woodDark));
  prateleira.position.set(0, 0.42, -0.02);
  g.add(prateleira);
  for (let i = 0; i < 3; i++) {
    const sacola = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.1), toon(P.lojaToldo));
    sacola.position.set(-largura / 2 + 0.35 + i * 0.42, 0.59, -0.02);
    sacola.rotation.y = (i - 1) * 0.16;
    g.add(sacola);
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 5, 10, Math.PI), toon(P.lojaEsquadria));
    alca.position.set(sacola.position.x, 0.75, -0.02);
    alca.rotation.y = sacola.rotation.y;
    g.add(alca);
  }
  return g;
}

/**
 * A MESA DE DOBRAR, com as pilhas de roupa dobrada.
 *
 * Ela existe por contraste: a loja inteira e roupa PENDURADA, tudo vertical e
 * na mesma altura. Uma mesa baixa no meio, com pilhas horizontais, quebra essa
 * linha — e e o que faz o salao parecer arrumado por alguem em vez de gerado.
 *
 * As pilhas sao caixas achatadas em `y` empilhadas com um giro pequeno em cada
 * camada: pilha perfeitamente alinhada le como um bloco pintado de listras.
 */
export function mesaDeDobrar(largura = 1.6, semente = 7): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-de-dobrar';
  const rnd = sorteio(semente);
  const madeira = toon(P.lojaBalcao);
  const alt = 0.78;

  const tampo = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.07, 0.85), madeira);
  tampo.position.y = alt;
  g.add(tampo);
  for (const sx of [-1, 1] as const) {
    for (const sz of [-1, 1] as const) {
      const pe = new THREE.Mesh(new THREE.BoxGeometry(0.08, alt, 0.08), toon(P.woodDark));
      pe.position.set(sx * (largura / 2 - 0.12), alt / 2, sz * 0.32);
      g.add(pe);
    }
  }
  /*
   * A prateleira de baixo é 1 cm mais estreita QUE A LINHA DOS PÉS, e não
   * rente a ela: com `largura - 0.16` a lateral dela caía exatamente no plano
   * da face de fora do pé (os dois dão `largura/2 − 0.08`, para qualquer
   * largura), e faces coplanares é o que serrilha.
   */
  const baixo = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.18, 0.04, 0.7), toon(P.woodDark));
  baixo.position.y = 0.24;
  g.add(baixo);

  const familia = COLECOES[Math.floor(rnd() * COLECOES.length)];
  const pilhas = Math.max(2, Math.round(largura / 0.55));
  for (let i = 0; i < pilhas; i++) {
    const x = -largura / 2 + (largura / pilhas) * (i + 0.5);
    const quantas = 3 + Math.floor(rnd() * 3);
    for (let c = 0; c < quantas; c++) {
      const pano = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.055, 0.3),
        toon(familia[Math.floor(rnd() * familia.length)]),
      );
      pano.position.set(x + (rnd() - 0.5) * 0.03, alt + 0.06 + c * 0.058, (rnd() - 0.5) * 0.05);
      pano.rotation.y = (rnd() - 0.5) * 0.3;
      g.add(pano);
    }
  }
  return g;
}

/**
 * A PRATELEIRA DE PAREDE da loja: tres tabuas com sapatos, chapeus e caixas.
 *
 * Ela e RASA (0,32) de proposito: prateleira funda encostada na parede do fundo
 * come o pouco chao que sobra num interior, e a camera de 34° so mostra a borda
 * de cima de qualquer coisa colocada nela.
 */
export function prateleiraDaLoja(largura = 2.2, semente = 3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'prateleira-da-loja';
  const rnd = sorteio(semente);
  const madeira = toon(P.lojaBalcao);
  const fundo = 0.32;
  const alturas = [0.55, 1.05, 1.55];

  for (const lado of [-1, 1] as const) {
    const lateral = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.85, fundo), madeira);
    lateral.position.set(lado * (largura / 2), 0.92, -fundo / 2);
    g.add(lateral);
  }
  const familia = COLECOES[Math.floor(rnd() * COLECOES.length)];
  /*
   * A TÁBUA É 1,2 cm MAIS RASA QUE A LATERAL, 6 mm recuados de cada lado. Com
   * a mesma profundidade das duas, a frente e o fundo de cada tábua caíam no
   * mesmo plano da frente e do fundo das laterais — doze pares coplanares numa
   * peça de cinco caixas. E prateleira de verdade tem esse recuo mesmo.
   */
  for (const [n, y] of alturas.entries()) {
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.05, fundo - 0.012), madeira);
    tabua.position.set(0, y, -fundo / 2);
    g.add(tabua);

    const quantos = 3 + Math.floor(rnd() * 2);
    for (let i = 0; i < quantos; i++) {
      const x = -largura / 2 + (largura / quantos) * (i + 0.5) + (rnd() - 0.5) * 0.08;
      const cor = toon(familia[Math.floor(rnd() * familia.length)]);
      if (n === 0) {
        // sapatos: dois blocos com o bico arredondado, um do lado do outro
        for (const s of [-1, 1] as const) {
          const sapato = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.22), cor);
          sapato.position.set(x + s * 0.06, y + 0.06, -fundo / 2 + 0.02);
          sapato.rotation.y = (rnd() - 0.5) * 0.25;
          g.add(sapato);
          const bico = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), cor);
          bico.scale.set(1, 0.7, 1);
          bico.position.set(sapato.position.x, y + 0.06, -fundo / 2 + 0.13);
          g.add(bico);
        }
      } else if (n === 1) {
        // chapeus: copa e aba
        const copa = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.12, 12), cor);
        copa.position.set(x, y + 0.09, -fundo / 2);
        g.add(copa);
        const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.02, 14), cor);
        aba.position.set(x, y + 0.04, -fundo / 2);
        g.add(aba);
      } else {
        // caixas de sapato, com a tampa de outra cor
        const caixa = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.24), cor);
        caixa.position.set(x, y + 0.1, -fundo / 2);
        caixa.rotation.y = (rnd() - 0.5) * 0.2;
        g.add(caixa);
        const tampa = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.26), toon(P.lojaParedeDentro));
        tampa.position.set(x, y + 0.2, -fundo / 2);
        tampa.rotation.y = caixa.rotation.y;
        g.add(tampa);
      }
    }
  }
  return g;
}

/**
 * O PUFE DE PROVAR SAPATO, redondo e estofado.
 *
 * Ele existe pela mesma razão da mesa de dobrar: a loja é toda vertical e alta
 * (arara, manequim, prateleira), e um objeto BAIXO e redondo perto da porta
 * quebra essa linha. Em loja de verdade ele fica sempre ali, para quem senta
 * para experimentar sapato.
 */
export function pufeDeLoja(cor: number = P.lojaCortinaProvador): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pufe-de-loja';
  const estofado = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.32, 0.2, 16), toon(cor));
  estofado.position.y = 0.38;
  g.add(estofado);
  // a almofada de cima, um pouco mais clara e abaulada
  const almofada = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon(cor));
  almofada.scale.y = 0.34;
  almofada.position.y = 0.47;
  g.add(almofada);
  // o botão do meio, que é o que faz o estofado parecer estofado
  const botao = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), toon(P.lojaBalcao));
  botao.scale.y = 0.5;
  botao.position.y = 0.55;
  g.add(botao);
  for (let i = 0; i < 4; i++) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.3, 6), toon(P.woodDark));
    pe.position.set(Math.cos(i * 1.57) * 0.22, 0.15, Math.sin(i * 1.57) * 0.22);
    pe.rotation.z = Math.cos(i * 1.57) * 0.12;
    pe.rotation.x = -Math.sin(i * 1.57) * 0.12;
    g.add(pe);
  }
  return g;
}

/**
 * ====================================== A ESCADA ROLANTE DA BOUTIQUE
 *
 * Ela sobe de `+Z` para `−Z` (a cena gira, como toda peça do kit), com a base
 * em `z = +comprimento/2` e o topo em `−comprimento/2`.
 *
 * O QUE FAZ UMA RAMPA VIRAR ESCADA ROLANTE, e é nesta ordem:
 *
 * 1. OS DEGRAUS SÃO DEGRAUS, e não uma rampa lisa com riscos. Cada um tem
 *    espelho (a face vertical) e piso (a face horizontal), e é a serrilha que
 *    o olho reconhece de longe. Rampa com textura de degrau lê como escada
 *    rolante desligada.
 * 2. AS LATERAIS SÃO DE VIDRO, inclinadas junto com o lance. Vidro é o que
 *    separa "escada rolante de loja" de "escada de emergência": a de shopping
 *    é sempre um painel transparente com o corrimão escuro correndo por cima.
 * 3. O CORRIMÃO É ESCURO E GORDO. É a única linha de contraste da peça, e é
 *    ela que desenha a diagonal na tela — o vidro quase não aparece, os
 *    degraus são claros, e sem o corrimão a escada some no piso claro.
 * 4. AS DUAS PLACAS PENTE, em cima e embaixo, onde o degrau "entra no chão".
 *    Elas custam duas caixas e são o detalhe que faz a escada ter começo e fim
 *    em vez de flutuar.
 *
 * A ALTURA E O COMPRIMENTO vêm de fora porque quem manda é o pé-direito do
 * andar: a cena passa a altura do mezanino e o comprimento que cabe na sala, e
 * a inclinação sai da divisão. Escada rolante de verdade tem 30°; abaixo de 25°
 * ela lê como esteira de aeroporto, e acima de 40° como escada de mão.
 */
export function escadaRolante(altura = 3.9, comprimento = 6.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'escada-rolante';
  const largura = 1.15;
  const aco = toon(P.escadaDegrau);
  const acoEscuro = toon(P.escadaDegrauEscuro);
  // o vidro e BEM transparente (0,2) e a saia baixa: visto de 34° de cima, um
  // painel de 7,5 de comprimento vira uma faixa enorme atravessando o salao, e
  // com 0,34 de opacidade ele apagava tudo o que passava por baixo
  const vidro = toon(P.escadaVidro, { opacity: 0.2, doubleSide: true });
  const corrimao = toon(P.escadaCorrimao);

  const z0 = comprimento / 2;   // a base, em +Z
  const inclinacao = Math.atan2(altura, comprimento);
  const lance = Math.hypot(altura, comprimento);

  // ------------------------------------------------------------- os degraus
  /*
   * O PASSO É MEDIDO NA HORIZONTAL (0,4), e não ao longo da rampa: assim o
   * piso de cada degrau tem sempre a mesma profundidade aparente, que é o que
   * acontece numa escada rolante de verdade (o degrau é sempre do mesmo
   * tamanho, quem muda é a altura entre eles).
   */
  const passo = 0.4;
  const quantos = Math.floor(comprimento / passo);
  for (let i = 0; i <= quantos; i++) {
    const t = i / quantos;
    const z = z0 - t * comprimento;
    const y = t * altura;
    const piso = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.06, passo * 0.94), aco);
    piso.position.set(0, y + 0.03, z);
    g.add(piso);
    /*
     * O espelho do degrau, a face vertical que fecha o desnível.
     *
     * Ele é 2 cm MAIS ESTREITO que o piso e nasce 4 mm ACIMA dele, e os dois
     * números são de conserto: nascendo com a mesma largura e no mesmo `y`, o
     * espelho e o piso de cada degrau davam duas faces laterais e uma face de
     * baixo COPLANARES — vinte e tantos pares num lance só, que é o que
     * serrilha quando a escada aparece de lado.
     */
    const degrau = altura / quantos;
    if (i < quantos) {
      const face = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.02, degrau, 0.05), acoEscuro);
      face.position.set(0, y + degrau / 2 + 0.004, z - passo * 0.47);
      g.add(face);
    }
    // os frisos amarelos da borda do degrau, de dois em dois
    if (i % 2 === 0) {
      const friso = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.1, 0.02, 0.04), toon(P.boutiqueOuro));
      friso.position.set(0, y + 0.07, z + passo * 0.4);
      g.add(friso);
    }
  }

  // ----------------------------------------------------- as laterais e o corrimão
  /**
   * O SINAL DA INCLINAÇÃO, e ele já nasceu trocado uma vez.
   *
   * `rotation.x = θ` leva o `+Z` local para `(0, −sen θ, cos θ)`: com θ
   * POSITIVO a ponta de `+Z` DESCE. E `+Z` aqui é a BASE (o degrau `i = 0`
   * nasce em `z0` com `y = 0`), então é `+inclinacao` que faz a lateral subir
   * junto com os degraus.
   *
   * Com o sinal trocado a lateral subia ao contrário: o painel e o corrimão
   * cruzavam a escada em X, e a ponta alta deles ficava sobre a BASE — quatro
   * metros no ar, sobre o piso do mezanino, um risco escuro flutuando ao lado
   * do espelho. Só a foto DE CIMA mostrou; do térreo a diagonal errada ainda
   * lia como diagonal.
   */
  for (const lado of [-1, 1] as const) {
    const x = lado * (largura / 2 + 0.06);

    const painel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.78, lance), vidro);
    painel.position.set(x, altura / 2 + 0.46, 0);
    painel.rotation.x = inclinacao;
    g.add(painel);

    // a saia de aço por baixo do vidro, que é o que esconde o maquinário
    const saia = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, lance), acoEscuro);
    saia.position.set(x, altura / 2 + 0.03, 0);
    saia.rotation.x = inclinacao;
    g.add(saia);

    const mao = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, lance), corrimao);
    mao.position.set(x, altura / 2 + 0.89, 0);
    mao.rotation.x = inclinacao;
    g.add(mao);
    // as duas voltas do corrimão, nas pontas: meio toro deitado
    for (const [zz, yy] of [[z0, 0], [-z0, altura]] as const) {
      const volta = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.055, 6, 12, Math.PI), corrimao);
      volta.position.set(x, yy + 0.7, zz);
      volta.rotation.y = Math.PI / 2;
      volta.rotation.z = inclinacao + (yy === 0 ? Math.PI : 0);
      g.add(volta);
    }
  }

  // -------------------------------------------------------- as placas pente
  for (const [zz, yy] of [[z0 + 0.22, 0], [-z0 - 0.22, altura]] as const) {
    /*
     * A placa é 1 cm mais BAIXA que o degrau e nasce 5 mm acima do piso do
     * andar: com 0,08 de altura a partir do zero, a barriga dela ficava no
     * mesmo plano da barriga do primeiro degrau (0,25 m² coplanares) e o topo
     * dela, no mesmo plano do friso.
     */
    const pente = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.24, 0.07, 0.5), acoEscuro);
    pente.position.set(0, yy + 0.04, zz);
    g.add(pente);
    for (let i = 0; i < 9; i++) {
      const dente = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.16), toon(P.boutiqueOuro));
      dente.position.set(-largura / 2 + 0.07 + i * (largura - 0.14) / 8, yy + 0.085, zz + (yy === 0 ? -0.2 : 0.2));
      g.add(dente);
    }
  }
  return g;
}

/**
 * ====================================== A ARARA PREMIUM DO MEZANINO
 *
 * A mesma ideia da arara de baixo, com três diferenças que são o que separa a
 * peça cara da peça comum numa loja de verdade:
 *
 * 1. **MENOS ROUPA, MAIS ESPAÇO.** É o sinal mais forte de todos: arara lotada
 *    lê como liquidação, arara com seis peças espaçadas lê como coleção. O
 *    passo aqui é 0,3 contra os 0,132 lá de baixo.
 * 2. **METAL DOURADO E ARCO NO ALTO.** O tubo reto vira um pórtico com dois
 *    cantos arredondados (um toro de um quarto de volta em cada ponta), que é
 *    o desenho de vitrine de butique.
 * 3. **BASE DE MÁRMORE**, e não pé de rodízio: ela não anda. Arara premium é
 *    móvel fixo, e o pé pesado diz isso sozinho.
 *
 * As roupas são as MESMAS de baixo (`pecaPendurada`) — a diferença está em como
 * elas são apresentadas, não no que são. É o que uma boutique faz.
 */
export function araraPremium(opts: AraraOpts & { prata?: boolean } = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arara-premium';
  const largura = opts.largura ?? 2.0;
  const altura = opts.altura ?? 1.7;
  const rnd = sorteio(opts.semente ?? 20260911);
  const metal = toon(opts.prata ? P.boutiquePrata : P.boutiqueOuro);
  const pedra = toon(P.boutiqueBoiserie);

  const meia = largura / 2 - 0.18;
  for (const lado of [-1, 1] as const) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.42), pedra);
    base.position.set(lado * meia, 0.045, 0);
    g.add(base);
    const sapata = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.06, 10), metal);
    sapata.position.set(lado * meia, 0.11, 0);
    g.add(sapata);

    const montante = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, altura - 0.32, 10),
      metal,
    );
    montante.position.set(lado * meia, 0.13 + (altura - 0.32) / 2, 0);
    g.add(montante);

    /*
     * O CANTO ARREDONDADO: um quarto de toro ligando o montante à barra. É o
     * detalhe que transforma dois tubos e uma barra num PÓRTICO — e pórtico é
     * o que uma arara de vitrine tem.
     */
    const canto = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.028, 6, 10, Math.PI / 2), metal);
    canto.position.set(lado * (meia - 0.18), altura - 0.19, 0);
    canto.rotation.z = lado > 0 ? 0 : Math.PI / 2;
    g.add(canto);
  }

  const barra = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, largura - 0.72, 10),
    metal,
  );
  barra.rotation.z = Math.PI / 2;
  barra.position.y = altura - 0.01;
  g.add(barra);

  // ------------------------------------------------------------- as roupas
  const familia = COLECOES[(opts.colecao ?? 0) % COLECOES.length];
  const tipos = opts.tipos ?? (['vestido', 'casaco', 'vestido'] as const);
  const passo = 0.3;
  const quantas = Math.max(3, Math.floor((largura - 0.9) / passo));
  const inicio = -((quantas - 1) * passo) / 2;
  for (let i = 0; i < quantas; i++) {
    const conjunto = new THREE.Group();
    conjunto.add(cabide(opts.prata ? P.boutiquePrata : P.boutiqueOuro));
    const cor = familia[i % familia.length];
    conjunto.add(pecaPendurada(
      tipos[Math.floor(rnd() * tipos.length)],
      cor,
      new THREE.Color(cor).multiplyScalar(0.78).getHex(),
    ));
    conjunto.position.set(inicio + i * passo, altura - 0.08, (rnd() - 0.5) * 0.03);
    // quase de frente, e não de lado: em arara premium a peça é EXPOSTA, e o
    // giro pequeno (0,12 contra 0,6) é o que diz "arrumada uma a uma"
    conjunto.rotation.y = (rnd() - 0.5) * 0.24;
    g.add(conjunto);
  }
  return g;
}
