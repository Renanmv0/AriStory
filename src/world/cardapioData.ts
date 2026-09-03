/**
 * O cardápio do restaurante do clube.
 *
 * Mesma ideia do quadro de memórias (`world/memoriasData.ts`): a "foto" de cada
 * prato NÃO é uma imagem, é uma função que pinta com a API Canvas 2D na hora em
 * que o cardápio abre. Zero asset externo continua valendo aqui — e um prato
 * pintado a código combina melhor com o resto do jogo do que um emoji solto.
 *
 * COMO CADA PRATO É DESENHADO. A miniatura é um QUADRADO de lado `s`, e todas
 * as medidas saem de `s` em fração — assim a mesma função serve para o
 * thumbnail de 56 px da lista e para qualquer tamanho que a gente resolva usar
 * depois, sem reescrever nada.
 *
 * A receita é sempre a mesma, de trás para a frente:
 *
 *  1. o PRATO (um disco claro), que separa a comida do papel do cardápio;
 *  2. a SOMBRA da comida no prato, uma elipse escura e chapada;
 *  3. a comida em CAMADAS, cada uma tapando a de baixo no lugar certo — pão,
 *     carne, queijo, salada, pão de cima;
 *  4. os BRILHOS por último: o reflexo do copo, o fio de queijo derretido, a
 *     casquinha tostada.
 *
 * O que faz a miniatura ler a 56 px não é detalhe, é SILHUETA e CONTRASTE. Por
 * isso cada prato tem uma forma inconfundível de longe (a arepa é um círculo
 * gordo, o hambúrguer é uma pilha, o perro é uma diagonal comprida, a bebida é
 * um copo vertical) e cores fortes separadas por linhas escuras.
 *
 * As cores moram aqui em string CSS, e não em `palette.ts`, pelo mesmo motivo
 * das memórias: são a paleta de uma ilustração 2D, e nenhum material do mundo
 * 3D usa nenhuma delas.
 */

export interface PratoDoCardapio {
  readonly id: string;
  readonly nome: string;
  /** já formatado para a tela, com o símbolo */
  readonly preco: string;
  readonly descricao: string;
  /** quando existe, o prato vira o destaque da seção e o texto vira o selo */
  readonly selo?: string;
  /** @param s lado do quadrado da miniatura, em pixels de dispositivo */
  pintar(ctx: CanvasRenderingContext2D, s: number): void;
}

export interface SecaoDoCardapio {
  readonly titulo: string;
  readonly nota: string;
  readonly pratos: readonly PratoDoCardapio[];
}

// ------------------------------------------------------------------- cores

const C = {
  prato: '#fbf4e6',
  pratoSombra: '#e6dac4',
  sombra: 'rgba(74, 52, 30, 0.16)',
  contorno: '#7a4a26',

  milho: '#e9c179',
  milhoTostado: '#cf9a48',
  milhoQueimado: '#a97530',
  queijo: '#fbe6a6',
  queijoBorda: '#e9c862',

  pao: '#e2a961',
  paoEscuro: '#c88b46',
  gergelim: '#f8ebcf',
  carne: '#7c4423',
  carneEscura: '#5e3018',
  alface: '#77c05a',
  tomate: '#e05a4c',
  batata: '#f2c14e',
  batataEscura: '#d9a02f',

  salsicha: '#d5654b',
  salsichaEscura: '#b04a34',
  ketchup: '#d63b34',
  mostarda: '#f0b429',
  maionese: '#fdf6e4',

  vidro: 'rgba(255, 255, 255, 0.38)',
  vidroBorda: '#dfe9ee',
  morango: '#f2678c',
  morangoClaro: '#ff9ab4',
  manga: '#f6a83c',
  mangaClara: '#ffc76a',
  canudo: '#ff6f91',
  canudoManga: '#54b7c9',
  folha: '#4ea648',
} as const;

// ---------------------------------------------------------------- pincéis

/**
 * O prato de baixo, e ele ocupa o QUADRADO INTEIRO.
 *
 * A primeira versão era uma elipse de raio `0,44·s` no meio do quadrado, e a
 * comida em cima dela ficava minúscula: sobrava margem por todo lado, e a 58 px
 * de tela o prato virava um botão pálido com um pontinho no meio. Aqui a louça
 * é o fundo cheio — quem faz o recorte redondo é o `border-radius` do CSS — e
 * a comida pode crescer até quase a borda.
 */
function prato(ctx: CanvasRenderingContext2D, s: number): void {
  const g = ctx.createRadialGradient(s * 0.42, s * 0.36, s * 0.05, s * 0.5, s * 0.5, s * 0.62);
  g.addColorStop(0, '#fffaf0');
  g.addColorStop(1, C.pratoSombra);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  // o filete da beirada da louça
  ctx.strokeStyle = 'rgba(122, 90, 48, 0.16)';
  ctx.lineWidth = s * 0.03;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.5, s * 0.44, s * 0.44, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/** A sombra chapada da comida em cima do prato. */
function sombra(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.fillStyle = C.sombra;
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, r * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Retângulo de cantos redondos — a base de pão, salsicha e batata. */
function pilula(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

/** Um traço grosso de molho, em zigue-zague. */
function molho(
  ctx: CanvasRenderingContext2D,
  cor: string, largura: number,
  x0: number, y0: number, x1: number, y1: number, ondas: number, altura: number,
): void {
  ctx.strokeStyle = cor;
  ctx.lineWidth = largura;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const passos = ondas * 2;
  for (let i = 0; i <= passos; i++) {
    const k = i / passos;
    const x = x0 + (x1 - x0) * k;
    const y = y0 + (y1 - y0) * k + (i % 2 ? altura : -altura);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/**
 * O copo, que as duas bebidas compartilham.
 *
 * Ele é desenhado em três tempos: o líquido primeiro (senão o vidro
 * translúcido não tem o que escurecer), o vidro por cima com transparência, e
 * o brilho vertical por último, que é o que faz o olho ler "copo" e não
 * "retângulo colorido".
 */
function copo(
  ctx: CanvasRenderingContext2D, s: number,
  liquido: string, liquidoTopo: string, canudo: string,
): void {
  const x = s * 0.3;
  const larg = s * 0.4;
  const topo = s * 0.24;
  const base = s * 0.84;

  // o canudo entra ANTES do vidro: assim a parte de dentro dele fica atrás do
  // brilho e a de fora, na frente
  ctx.strokeStyle = canudo;
  ctx.lineWidth = s * 0.055;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + larg * 0.62, base - s * 0.06);
  ctx.lineTo(x + larg * 0.86, topo - s * 0.12);
  ctx.stroke();

  // o líquido, com o topo mais claro
  const g = ctx.createLinearGradient(0, topo, 0, base);
  g.addColorStop(0, liquidoTopo);
  g.addColorStop(1, liquido);
  ctx.fillStyle = g;
  pilula(ctx, x + s * 0.02, topo + s * 0.06, larg - s * 0.04, base - topo - s * 0.08, s * 0.06);

  // o vidro
  ctx.fillStyle = C.vidro;
  pilula(ctx, x, topo, larg, base - topo, s * 0.07);
  ctx.strokeStyle = C.vidroBorda;
  ctx.lineWidth = s * 0.028;
  ctx.beginPath();
  ctx.roundRect(x, topo, larg, base - topo, s * 0.07);
  ctx.stroke();

  // o brilho, uma faixa clara colada na parede esquerda
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  pilula(ctx, x + s * 0.05, topo + s * 0.1, s * 0.05, base - topo - s * 0.26, s * 0.03);
}

// ----------------------------------------------------------------- pratos

/**
 * A AREPA. Disco gordo de milho na chapa, aberto ao meio, com o queijo
 * escorrendo pela boca. É o prato do Ari, e é o que ganha o destaque da tela.
 */
function arepa(ctx: CanvasRenderingContext2D, s: number): void {
  prato(ctx, s);
  sombra(ctx, s * 0.5, s * 0.72, s * 0.3);

  // o disco, visto quase de frente e um fio de lado
  ctx.fillStyle = C.milhoTostado;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.53, s * 0.31, s * 0.29, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.milho;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.5, s * 0.3, s * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  // um fio escuro em volta: o milho e a louça são dois cremes, e sem o
  // contorno a arepa sumia no prato quando a miniatura encolhia
  ctx.strokeStyle = C.contorno;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = s * 0.022;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.5, s * 0.3, s * 0.28, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // as marcas da chapa: manchas mais escuras, sempre nos mesmos lugares
  ctx.fillStyle = C.milhoQueimado;
  ctx.globalAlpha = 0.35;
  for (const [dx, dy, r] of [[-0.12, -0.1, 0.06], [0.14, -0.04, 0.05], [-0.02, 0.13, 0.055]]) {
    ctx.beginPath();
    ctx.ellipse(s * (0.5 + dx), s * (0.5 + dy), s * r, s * r * 0.7, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // a boca aberta, e o queijo saindo por ela
  ctx.strokeStyle = C.milhoQueimado;
  ctx.lineWidth = s * 0.03;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.5, s * 0.3, s * 0.28, 0, 0.15, Math.PI - 0.15);
  ctx.stroke();

  ctx.fillStyle = C.queijoBorda;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.68, s * 0.24, s * 0.09, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.queijo;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.67, s * 0.22, s * 0.075, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  // o fio pingando, que é o detalhe que diz "queijo quente"
  ctx.fillStyle = C.queijo;
  ctx.beginPath();
  ctx.ellipse(s * 0.6, s * 0.73, s * 0.035, s * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Arepa recheada, a versão com carne desfiada e abacate por cima. */
function arepaRecheada(ctx: CanvasRenderingContext2D, s: number): void {
  arepa(ctx, s);
  // a carne desfiada saindo pela boca, por cima do queijo
  ctx.strokeStyle = C.carne;
  ctx.lineWidth = s * 0.035;
  ctx.lineCap = 'round';
  for (const [dx, dy] of [[-0.12, 0.0], [-0.02, 0.03], [0.08, 0.0]]) {
    ctx.beginPath();
    ctx.moveTo(s * (0.5 + dx), s * (0.64 + dy));
    ctx.lineTo(s * (0.5 + dx + 0.09), s * (0.68 + dy));
    ctx.stroke();
  }
  // abacate
  ctx.fillStyle = C.folha;
  ctx.beginPath();
  ctx.ellipse(s * 0.36, s * 0.62, s * 0.07, s * 0.04, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * O HAMBÚRGUER. Pilha vista de lado, que é a silhueta que ninguém confunde, e
 * três batatas espetadas do lado direito.
 */
function hamburguer(ctx: CanvasRenderingContext2D, s: number, andares = 2): void {
  prato(ctx, s);
  sombra(ctx, s * 0.44, s * 0.78, s * 0.28);

  // as batatas primeiro: elas ficam ATRÁS da pilha
  for (const [i, [dx, dy, giro]] of ([[0.72, 0.5, -0.35], [0.79, 0.55, -0.1], [0.68, 0.6, 0.25]] as const).entries()) {
    ctx.save();
    ctx.translate(s * dx, s * dy);
    ctx.rotate(giro);
    ctx.fillStyle = i === 1 ? C.batataEscura : C.batata;
    pilula(ctx, -s * 0.035, -s * 0.16, s * 0.07, s * 0.32, s * 0.03);
    ctx.restore();
  }

  const cx = s * 0.44;
  const larg = s * 0.5;
  const x = cx - larg / 2;
  // do chão para cima: a pilha é uma sequência de camadas, cada uma pousando
  // sobre a anterior
  let y = s * 0.76;

  const camada = (altura: number, cor: string, sobra = 0): void => {
    y -= altura;
    ctx.fillStyle = cor;
    pilula(ctx, x - sobra, y, larg + sobra * 2, altura, altura * 0.45);
  };

  // pão de baixo
  ctx.fillStyle = C.paoEscuro;
  pilula(ctx, x, y - s * 0.09, larg, s * 0.09, s * 0.03);
  y -= s * 0.09;

  for (let i = 0; i < andares; i++) {
    camada(s * 0.085, i % 2 ? C.carneEscura : C.carne, s * 0.015);
    // o queijo escorrendo: uma faixa amarela com as pontas caídas
    y -= s * 0.045;
    ctx.fillStyle = C.queijo;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.035, y);
    ctx.lineTo(x + larg + s * 0.035, y);
    ctx.lineTo(x + larg + s * 0.03, y + s * 0.05);
    ctx.lineTo(x + larg * 0.7, y + s * 0.03);
    ctx.lineTo(x + larg * 0.42, y + s * 0.075);
    ctx.lineTo(x + larg * 0.16, y + s * 0.03);
    ctx.lineTo(x - s * 0.03, y + s * 0.055);
    ctx.closePath();
    ctx.fill();
  }

  // alface, uma tira ondulada saindo dos dois lados
  y -= s * 0.05;
  ctx.fillStyle = C.alface;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.05, y + s * 0.05);
  for (let i = 0; i <= 8; i++) {
    const k = i / 8;
    ctx.lineTo(x - s * 0.05 + (larg + s * 0.1) * k, y + (i % 2 ? s * 0.012 : s * 0.05));
  }
  ctx.lineTo(x + larg + s * 0.05, y + s * 0.05);
  ctx.closePath();
  ctx.fill();

  // pão de cima, uma calota com gergelim
  const yPao = y - s * 0.005;
  ctx.fillStyle = C.pao;
  ctx.beginPath();
  ctx.ellipse(cx, yPao, larg / 2, s * 0.15, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.gergelim;
  for (const [dx, dy] of [[-0.13, -0.06], [-0.02, -0.09], [0.1, -0.055], [0.05, -0.02]]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * dx, yPao + s * dy, s * 0.022, s * 0.013, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** O QUARTEIRÃO: um hambúrguer de um andar só, mas com o disco mais gordo. */
function quarteirao(ctx: CanvasRenderingContext2D, s: number): void {
  hamburguer(ctx, s, 1);
  // uma rodela de tomate espiando por baixo do pão de cima
  ctx.fillStyle = C.tomate;
  ctx.beginPath();
  ctx.ellipse(s * 0.24, s * 0.44, s * 0.06, s * 0.03, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * O PERRO CALIENTE. Diagonal comprida — é a silhueta que separa ele do
 * hambúrguer de longe — com os três molhos e a batata palha por cima.
 */
function perroCaliente(ctx: CanvasRenderingContext2D, s: number): void {
  prato(ctx, s);
  sombra(ctx, s * 0.5, s * 0.74, s * 0.32);

  ctx.save();
  ctx.translate(s * 0.5, s * 0.55);
  ctx.rotate(-0.22);

  // o pão aberto
  ctx.fillStyle = C.paoEscuro;
  pilula(ctx, -s * 0.36, -s * 0.09, s * 0.72, s * 0.22, s * 0.11);
  ctx.fillStyle = C.pao;
  pilula(ctx, -s * 0.36, -s * 0.11, s * 0.72, s * 0.18, s * 0.09);

  // a salsicha, saindo pelas duas pontas
  ctx.fillStyle = C.salsichaEscura;
  pilula(ctx, -s * 0.4, -s * 0.115, s * 0.8, s * 0.11, s * 0.055);
  ctx.fillStyle = C.salsicha;
  pilula(ctx, -s * 0.4, -s * 0.125, s * 0.8, s * 0.095, s * 0.05);

  // os três molhos, um sobre o outro
  molho(ctx, C.mostarda, s * 0.032, -s * 0.32, -s * 0.06, s * 0.32, -s * 0.06, 4, s * 0.022);
  molho(ctx, C.ketchup, s * 0.032, -s * 0.3, -s * 0.02, s * 0.3, -s * 0.02, 4, s * 0.022);
  molho(ctx, C.maionese, s * 0.028, -s * 0.28, -s * 0.1, s * 0.28, -s * 0.1, 4, s * 0.018);

  // a batata palha por cima — é o que faz o perro parecer "bem recheado"
  ctx.strokeStyle = C.batata;
  ctx.lineWidth = s * 0.018;
  ctx.lineCap = 'round';
  for (const [dx, dy, a] of [
    [-0.24, -0.13, 0.5], [-0.1, -0.15, -0.4], [0.04, -0.13, 0.6],
    [0.18, -0.15, -0.3], [-0.17, -0.16, -0.6], [0.26, -0.12, 0.35],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(s * dx, s * dy);
    ctx.lineTo(s * (dx + Math.cos(a) * 0.09), s * (dy + Math.sin(a) * 0.09));
    ctx.stroke();
  }
  ctx.restore();
}

/** SUCO DE MORANGO, com o morango espetado na borda. */
function sucoDeMorango(ctx: CanvasRenderingContext2D, s: number): void {
  prato(ctx, s);
  sombra(ctx, s * 0.5, s * 0.85, s * 0.26);
  copo(ctx, s, C.morango, C.morangoClaro, C.canudo);

  // o morango na borda
  ctx.fillStyle = '#e34b6d';
  ctx.beginPath();
  ctx.moveTo(s * 0.26, s * 0.24);
  ctx.bezierCurveTo(s * 0.16, s * 0.24, s * 0.16, s * 0.36, s * 0.26, s * 0.4);
  ctx.bezierCurveTo(s * 0.36, s * 0.36, s * 0.36, s * 0.24, s * 0.26, s * 0.24);
  ctx.fill();
  ctx.fillStyle = C.folha;
  ctx.beginPath();
  ctx.ellipse(s * 0.26, s * 0.24, s * 0.06, s * 0.025, 0, 0, Math.PI * 2);
  ctx.fill();

  // gotinhas de gelado escorrendo no vidro
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (const [dx, dy] of [[0.62, 0.42], [0.66, 0.56], [0.6, 0.68]]) {
    ctx.beginPath();
    ctx.ellipse(s * dx, s * dy, s * 0.017, s * 0.028, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** SMOOTHIE DE MANGA COM BANANA: o copo laranja e a rodela de banana em cima. */
function smoothie(ctx: CanvasRenderingContext2D, s: number): void {
  prato(ctx, s);
  sombra(ctx, s * 0.5, s * 0.85, s * 0.26);
  copo(ctx, s, C.manga, C.mangaClara, C.canudoManga);

  // a rodela de banana espetada na borda
  ctx.fillStyle = '#f6e7b8';
  ctx.beginPath();
  ctx.ellipse(s * 0.28, s * 0.3, s * 0.075, s * 0.075, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e0cd92';
  ctx.lineWidth = s * 0.018;
  ctx.beginPath();
  ctx.ellipse(s * 0.28, s * 0.3, s * 0.075, s * 0.075, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#d9c489';
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.6;
    ctx.beginPath();
    ctx.ellipse(s * (0.28 + Math.cos(a) * 0.026), s * (0.3 + Math.sin(a) * 0.026), s * 0.012, s * 0.012, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // a fatia de manga do outro lado
  ctx.fillStyle = C.manga;
  ctx.beginPath();
  ctx.ellipse(s * 0.74, s * 0.32, s * 0.055, s * 0.09, 0.5, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------- o acervo

export const CARDAPIO: readonly SecaoDoCardapio[] = [
  {
    titulo: 'Arepas',
    nota: 'na chapa, servidas quentes — a casa vive delas',
    pratos: [
      {
        id: 'arepa-queijo',
        nome: 'Arepa de queijo',
        preco: 'R$ 18',
        descricao:
          'Massa de milho na chapa até criar casquinha, aberta ainda quente e ' +
          'recheada de queijo branco que escorre antes de você conseguir morder.',
        selo: 'o favorito do Ari',
        pintar: arepa,
      },
      {
        id: 'arepa-recheada',
        nome: 'Arepa recheada',
        preco: 'R$ 26',
        descricao:
          'A mesma arepa, agora com carne desfiada macia, queijo e abacate ' +
          'em fatias finas por cima.',
        pintar: arepaRecheada,
      },
    ],
  },
  {
    titulo: 'Hambúrgueres',
    nota: 'todos com batata frita dourada, sem exceção',
    pratos: [
      {
        id: 'duplo-queijo',
        nome: 'Duplo Burger com Queijo',
        preco: 'R$ 34',
        descricao:
          'Dois discos de carne selados na chapa, duas fatias de queijo ' +
          'derretendo entre eles, alface crocante e pão de gergelim. Com batata frita.',
        pintar: (ctx, s) => hamburguer(ctx, s, 2),
      },
      {
        id: 'quarteirao',
        nome: 'Quarteirão com Queijo',
        preco: 'R$ 30',
        descricao:
          'Um disco só, mas do tamanho do pão inteiro, com queijo, tomate e ' +
          'aquele pão macio que amassa na mão. Com batata frita.',
        pintar: quarteirao,
      },
    ],
  },
  {
    titulo: 'Perros Calientes',
    nota: 'do jeito tradicional, transbordando',
    pratos: [
      {
        id: 'perro-tradicional',
        nome: 'Perro Caliente Tradicional',
        preco: 'R$ 24',
        descricao:
          'Salsicha grelhada sobrando dos dois lados do pão, os três molhos ' +
          'em zigue-zague e uma montanha de batata palha por cima.',
        pintar: perroCaliente,
      },
    ],
  },
  {
    titulo: 'Bebidas',
    nota: 'geladas, saindo do liquidificador',
    pratos: [
      {
        id: 'suco-morango',
        nome: 'Suco de morango',
        preco: 'R$ 12',
        descricao:
          'Morango batido na hora, bem gelado, com o copo suando do lado de fora.',
        pintar: sucoDeMorango,
      },
      {
        id: 'smoothie-manga-banana',
        nome: 'Smoothie de manga com banana',
        preco: 'R$ 15',
        descricao:
          'Manga madura e banana batidas juntas até ficar grosso o bastante ' +
          'para o canudo reclamar.',
        pintar: smoothie,
      },
    ],
  },
];
