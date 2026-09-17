import { PARCEIRO, type Adversario } from '../entities/PingPong';

/**
 * O QUADRO DE INSCRIÇÕES da arena de ping pong do Villa Lobos.
 *
 * Mesma ideia do cardápio do restaurante (`world/cardapioData.ts`) e do quadro
 * de memórias: a "fotinha" de cada desafiante NÃO é uma imagem, é uma função
 * que pinta com a API Canvas 2D na hora em que o painel abre. Zero asset
 * externo continua valendo — e um retrato pintado a código combina com o resto
 * do jogo de um jeito que um emoji nunca combinaria.
 *
 * COMO CADA RETRATO É DESENHADO. É um QUADRADO de lado `s`, e toda medida sai
 * de `s` em fração: a mesma função serve para o papel de 68 px do quadro e para
 * qualquer tamanho que a gente resolva usar depois.
 *
 * A receita é sempre a mesma, e é a de uma FOTO 3×4:
 *
 *  1. o fundo, um disco de cor chapada — é ele que separa o bicho do papel;
 *  2. o pescoço/corpo entrando por baixo, cortado pela borda;
 *  3. a CABEÇA, grande demais de propósito (a mesma régua chibi do jogo);
 *  4. a cara: olhos grandes, bochecha, boca;
 *  5. o que diz QUEM É ELE — a boina do Jean-Luc, o chapéu de casquinha do
 *     Mano, o quepe do Cookie, os óculos de meia-lua da Estella;
 *  6. e uma bolinha de ping pong em algum canto, que é o que faz o retrato ser
 *     de uma INSCRIÇÃO e não de uma carteirinha qualquer.
 *
 * O que faz o retrato ler a 68 px não é detalhe, é SILHUETA: a orelha-leque do
 * elefante, o bico-espátula do pato, o cacho de bolotas da ovelha. Cada um tem
 * uma forma inconfundível de longe, e é por ela que se reconhece o bicho antes
 * de ler o nome.
 *
 * As cores moram aqui em string CSS, e não em `palette.ts`, pelo mesmo motivo
 * das memórias e do cardápio: são a paleta de uma ilustração 2D, e nenhum
 * material do mundo 3D usa nenhuma delas.
 */

export interface DesafianteDoQuadro {
  readonly id: string;
  readonly nome: string;
  /** a linha de baixo do papel: quem ele é no parque */
  readonly apelido: string;
  /** a historinha de tênis de mesa, do jeito dele */
  readonly historia: string;
  /** o que ele escreveu à mão no fim da inscrição */
  readonly assinatura: string;
  /** como ele joga, para a mesa */
  readonly ficha: Adversario;
  /**
   * A FLAG QUE PENDURA O PAPEL DELE NO QUADRO.
   *
   * Vazia quer dizer "está lá desde sempre". Enquanto a flag não existe o
   * painel mostra uma FICHA EM BRANCO no lugar — e isso é de propósito: a
   * vaga vazia conta que tem mais gente para chegar sem entregar quem é.
   */
  readonly inscreveSe: string;
  /** @param s lado do quadrado do retrato, em pixels de dispositivo */
  pintar(ctx: CanvasRenderingContext2D, s: number): void;
}

// ------------------------------------------------------------------- cores

const C = {
  papel: '#f6ecd6',
  tinta: '#4a3524',

  // o casal
  peleAri: '#f2cfb2',
  cabeloAri: '#2b2118',
  cabeloRenan: '#8a5a32',
  camisaAri: '#2f3542',
  camisaRenan: '#f4f2ec',
  fundoCasal: '#cfe2c2',

  // Jean-Luc
  pena: '#faf5e9',
  penaSombra: '#e7dcc4',
  bicoPato: '#f2a23c',
  bicoPatoEscuro: '#d4802a',
  azulFranca: '#11488f',
  vermelhoFranca: '#e0243c',
  fundoPato: '#bcd9ea',

  // Mano
  casaco: '#39415a',
  barriga: '#fbf4e8',
  bicoPinguim: '#f0a340',
  rosaDoMano: '#f6a6c0',
  waffle: '#e0ac63',
  sorvete: '#fdf3e7',
  cereja: '#e0524a',
  fundoMano: '#cdd7ea',

  // Cookie
  elefante: '#9a94a3',
  elefanteEscuro: '#7a7585',
  orelha: '#c79aa6',
  presa: '#f3ead6',
  quepe: '#8c4a54',
  fundoCookie: '#e0d3dd',

  // Estella
  la: '#f6efe2',
  laSombra: '#e2d7c4',
  cara: '#6e5a54',
  focinho: '#c78e93',
  oculos: '#d8b45e',
  fita: '#f0d79a',
  fundoEstella: '#e6dcc6',

  olho: '#2b2118',
  brilho: '#ffffff',
  bochecha: '#f2a0a8',
  bolinha: '#fff8e6',
  bolinhaSombra: '#e4d9bd',
} as const;

// ------------------------------------------------------------ ferramentas

/** O disco de fundo da foto 3×4, e a moldura fina dele. */
function fundo(ctx: CanvasRenderingContext2D, s: number, cor: string): void {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s * 0.47, 0, Math.PI * 2);
  ctx.fill();
}

function elipse(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, rx: number, ry: number, cor: string, giro = 0,
): void {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, giro, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * OS DOIS OLHOS, sempre pelo mesmo desenho: bola escura, brilho em cima à
 * esquerda. É o brilho que separa "olho" de "buraco" — sem ele, todo bicho
 * daqui fica assustado.
 */
function olhos(
  ctx: CanvasRenderingContext2D,
  x1: number, x2: number, y: number, r: number,
): void {
  for (const x of [x1, x2]) {
    elipse(ctx, x, y, r, r * 1.05, C.olho);
    elipse(ctx, x - r * 0.3, y - r * 0.34, r * 0.34, r * 0.34, C.brilho);
  }
}

/** A bolinha de ping pong no canto: é ela que diz de que quadro é esta foto. */
function bolinha(ctx: CanvasRenderingContext2D, s: number, x = 0.82, y = 0.8): void {
  elipse(ctx, s * x, s * y, s * 0.085, s * 0.085, C.bolinhaSombra);
  elipse(ctx, s * x - s * 0.008, s * y - s * 0.012, s * 0.075, s * 0.075, C.bolinha);
}

/** Uma raquete de brinquedo, vista de frente. */
function raquetinha(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number, cor: string, giro = -0.5,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(giro);
  ctx.fillStyle = '#9a6a3a';
  ctx.fillRect(-r * 0.16, r * 0.5, r * 0.32, r * 1.15);
  elipse(ctx, 0, 0, r * 1.06, r * 1.12, '#c98f4f');
  elipse(ctx, 0, 0, r * 0.88, r * 0.94, cor);
  ctx.restore();
}

// ------------------------------------------------------------- os retratos

/**
 * A DUPLA. Duas cabeças encostadas, uma escura e uma castanha — é assim que
 * eles aparecem no jogo inteiro, e por isso o retrato é dos DOIS: não existe
 * "jogar contra o parceiro" com um deles só na foto.
 */
function retratoDaDupla(ctx: CanvasRenderingContext2D, s: number): void {
  fundo(ctx, s, C.fundoCasal);
  /*
   * OS DOIS TÊM QUE APARECER. A primeira versão encostava as duas cabeças e a
   * da frente tapava a cara da de trás — sobrava um retrato de uma pessoa só
   * com um tufo castanho atrás da orelha. Agora a de trás fica MAIS ALTA e
   * mais para a direita: só o ombro dela é que some.
   */
  // o de trás, à direita e um degrau acima
  elipse(ctx, s * 0.69, s * 0.86, s * 0.19, s * 0.21, C.camisaRenan);
  elipse(ctx, s * 0.69, s * 0.47, s * 0.155, s * 0.165, C.peleAri);
  // a juba castanha: um monte de bolotas em volta do alto da cabeça
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (1.02 + (i / 8) * 0.96);
    elipse(ctx, s * 0.69 + Math.cos(a) * s * 0.15, s * 0.46 + Math.sin(a) * s * 0.16,
      s * 0.082, s * 0.078, C.cabeloRenan);
  }
  olhos(ctx, s * 0.645, s * 0.735, s * 0.49, s * 0.025);
  elipse(ctx, s * 0.6, s * 0.535, s * 0.034, s * 0.023, C.bochecha);
  elipse(ctx, s * 0.78, s * 0.535, s * 0.034, s * 0.023, C.bochecha);

  // o da frente, à esquerda e mais embaixo
  elipse(ctx, s * 0.33, s * 0.93, s * 0.22, s * 0.24, C.camisaAri);
  elipse(ctx, s * 0.33, s * 0.58, s * 0.175, s * 0.185, C.peleAri);
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * (0.98 + (i / 9) * 1.04);
    elipse(ctx, s * 0.33 + Math.cos(a) * s * 0.17, s * 0.56 + Math.sin(a) * s * 0.18,
      s * 0.095, s * 0.09, C.cabeloAri);
  }
  olhos(ctx, s * 0.275, s * 0.385, s * 0.6, s * 0.028);
  elipse(ctx, s * 0.22, s * 0.645, s * 0.038, s * 0.026, C.bochecha);
  elipse(ctx, s * 0.44, s * 0.645, s * 0.038, s * 0.026, C.bochecha);
  // a boca de quem está rindo
  ctx.strokeStyle = C.olho;
  ctx.lineWidth = s * 0.018;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(s * 0.328, s * 0.65, s * 0.045, 0.25, Math.PI - 0.25);
  ctx.stroke();

  bolinha(ctx, s, 0.2, 0.84);
}

/** O JEAN-LUC: bico-espátula, boina tombada e a raquete sempre à mão. */
function retratoDoJeanLuc(ctx: CanvasRenderingContext2D, s: number): void {
  fundo(ctx, s, C.fundoPato);
  raquetinha(ctx, s * 0.83, s * 0.66, s * 0.13, C.vermelhoFranca, 0.5);

  // o corpo de camisa entrando por baixo
  elipse(ctx, s * 0.47, s * 0.95, s * 0.27, s * 0.24, C.azulFranca);
  // a bandeirinha no peito
  for (const [i, cor] of [C.azulFranca, C.papel, C.vermelhoFranca].entries()) {
    ctx.fillStyle = cor;
    ctx.fillRect(s * (0.4 + i * 0.048), s * 0.8, s * 0.048, s * 0.1);
  }

  elipse(ctx, s * 0.47, s * 0.54, s * 0.215, s * 0.215, C.pena);
  // o BICO: espátula larga e achatada, com a mandíbula por baixo. É ele que
  // decide se isto é um pato — cone viraria passarinho genérico
  elipse(ctx, s * 0.21, s * 0.6, s * 0.155, s * 0.075, C.bicoPatoEscuro, -0.12);
  elipse(ctx, s * 0.22, s * 0.575, s * 0.16, s * 0.072, C.bicoPato, -0.12);
  olhos(ctx, s * 0.4, s * 0.55, s * 0.5, s * 0.038);
  elipse(ctx, s * 0.32, s * 0.63, s * 0.045, s * 0.03, C.bochecha);

  // a BOINA, tombada para a direita, com o rabinho de pano no alto
  ctx.save();
  ctx.translate(s * 0.49, s * 0.35);
  ctx.rotate(0.24);
  elipse(ctx, 0, 0, s * 0.23, s * 0.105, C.azulFranca);
  elipse(ctx, 0, s * -0.035, s * 0.185, s * 0.085, C.azulFranca);
  elipse(ctx, s * 0.01, s * -0.105, s * 0.028, s * 0.03, C.azulFranca);
  ctx.restore();
  bolinha(ctx, s, 0.2, 0.86);
}

/** O MANO: plastrão claro, chapéu de casquinha e as duas alças do avental. */
function retratoDoMano(ctx: CanvasRenderingContext2D, s: number): void {
  fundo(ctx, s, C.fundoMano);

  // o corpo de pinguim: ovo escuro com o plastrão claro na frente
  elipse(ctx, s * 0.48, s * 0.94, s * 0.28, s * 0.26, C.casaco);
  elipse(ctx, s * 0.48, s * 0.96, s * 0.19, s * 0.22, C.barriga);
  // o peitilho rosa do sorveteiro, com as duas alças por cima do ombro
  elipse(ctx, s * 0.48, s * 1.0, s * 0.155, s * 0.17, C.rosaDoMano);
  ctx.strokeStyle = C.rosaDoMano;
  ctx.lineWidth = s * 0.038;
  ctx.lineCap = 'round';
  for (const dx of [-0.12, 0.12]) {
    ctx.beginPath();
    ctx.moveTo(s * (0.48 + dx), s * 0.78);
    ctx.lineTo(s * (0.48 + dx * 0.5), s * 0.95);
    ctx.stroke();
  }

  // as nadadeiras rentes ao corpo
  elipse(ctx, s * 0.2, s * 0.92, s * 0.06, s * 0.15, C.casaco, 0.25);
  elipse(ctx, s * 0.76, s * 0.92, s * 0.06, s * 0.15, C.casaco, -0.25);

  elipse(ctx, s * 0.48, s * 0.55, s * 0.225, s * 0.215, C.casaco);
  // a máscara clara do rosto, em V até em cima dos olhos
  elipse(ctx, s * 0.48, s * 0.6, s * 0.16, s * 0.15, C.barriga);
  // o bico curto e gordo, apontando para quem olha
  ctx.fillStyle = C.bicoPinguim;
  ctx.beginPath();
  ctx.moveTo(s * 0.48, s * 0.58);
  ctx.lineTo(s * 0.56, s * 0.665);
  ctx.lineTo(s * 0.4, s * 0.665);
  ctx.closePath();
  ctx.fill();
  olhos(ctx, s * 0.405, s * 0.555, s * 0.545, s * 0.036);
  elipse(ctx, s * 0.32, s * 0.63, s * 0.045, s * 0.028, C.bochecha);

  // o CHAPÉU DE CASQUINHA: cone de waffle de ponta para cima, bola e cereja
  ctx.save();
  ctx.translate(s * 0.48, s * 0.34);
  ctx.rotate(-0.12);
  ctx.fillStyle = C.waffle;
  ctx.beginPath();
  ctx.moveTo(-s * 0.115, s * 0.03);
  ctx.lineTo(s * 0.115, s * 0.03);
  ctx.lineTo(0, -s * 0.15);
  ctx.closePath();
  ctx.fill();
  // o quadriculado, que é o que separa "casquinha" de "chapéu de festa"
  ctx.strokeStyle = C.bicoPinguim;
  ctx.lineWidth = s * 0.011;
  for (const d of [-0.05, 0.05]) {
    ctx.beginPath();
    ctx.moveTo(d * s - s * 0.03, s * 0.03);
    ctx.lineTo(d * s + s * 0.04, -s * 0.11);
    ctx.stroke();
  }
  elipse(ctx, 0, -s * 0.185, s * 0.075, s * 0.07, C.sorvete);
  elipse(ctx, s * 0.01, -s * 0.255, s * 0.03, s * 0.03, C.cereja);
  ctx.restore();
  bolinha(ctx, s, 0.83, 0.7);
}

/** O COOKIE: orelha-leque, tromba encaracolada e o quepe de bilheteiro. */
function retratoDoCookie(ctx: CanvasRenderingContext2D, s: number): void {
  fundo(ctx, s, C.fundoCookie);

  // AS ORELHAS PRIMEIRO, atrás da cabeça: elefante de desenho é lido pela
  // silhueta da orelha antes de qualquer outra coisa
  for (const [x, giro] of [[0.17, -0.3], [0.83, 0.3]] as const) {
    elipse(ctx, s * x, s * 0.52, s * 0.19, s * 0.23, C.elefanteEscuro, giro);
    elipse(ctx, s * x, s * 0.53, s * 0.13, s * 0.17, C.orelha, giro);
  }

  elipse(ctx, s * 0.5, s * 0.95, s * 0.3, s * 0.22, C.elefanteEscuro);
  elipse(ctx, s * 0.5, s * 0.56, s * 0.265, s * 0.245, C.elefante);
  // a TESTA EM DUAS BOSSAS com o vinco no meio: é ela que separa o crânio de
  // elefante do de um hipopótamo
  elipse(ctx, s * 0.39, s * 0.38, s * 0.11, s * 0.095, C.elefante);
  elipse(ctx, s * 0.61, s * 0.38, s * 0.11, s * 0.095, C.elefante);

  // A TROMBA, em gomos que afinam e enrolam para a direita
  ctx.strokeStyle = C.elefante;
  ctx.lineCap = 'round';
  const gomos: Array<[number, number, number]> = [
    [0.5, 0.68, 0.1], [0.505, 0.78, 0.085], [0.535, 0.86, 0.07],
    [0.59, 0.9, 0.055], [0.635, 0.86, 0.042],
  ];
  for (const [x, y, r] of gomos) {
    elipse(ctx, s * x, s * y, s * r, s * r, C.elefante);
  }
  // as presinhas, uma de cada lado da tromba
  for (const [x, giro] of [[0.36, 0.4], [0.64, -0.4]] as const) {
    elipse(ctx, s * x, s * 0.75, s * 0.032, s * 0.062, C.presa, giro);
  }
  olhos(ctx, s * 0.4, s * 0.6, s * 0.56, s * 0.037);
  for (const x of [0.3, 0.7]) elipse(ctx, s * x, s * 0.66, s * 0.045, s * 0.028, C.bochecha);

  // o QUEPE de bilheteiro, que é o que diz que ele trabalha aqui
  ctx.fillStyle = C.quepe;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.315, s * 0.2, s * 0.115, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(s * 0.3, s * 0.3, s * 0.4, s * 0.035);
  elipse(ctx, s * 0.5, s * 0.35, s * 0.235, s * 0.035, C.elefanteEscuro);
  bolinha(ctx, s, 0.85, 0.22);
}

/** A ESTELLA: cacho de bolotas, orelha horizontal e óculos de meia-lua. */
function retratoDaEstella(ctx: CanvasRenderingContext2D, s: number): void {
  fundo(ctx, s, C.fundoEstella);

  // O CACHO DE BOLOTAS. É esta a coisa toda: um ovo liso é um bicho genérico,
  // e o mesmo ovo coberto de bolotas já é ovelha antes de ter cara.
  for (let i = 0; i < 14; i++) {
    const a = Math.PI * (0.98 + (i / 13) * 1.04);
    const r = s * (0.085 + (i % 3) * 0.012);
    elipse(ctx, s * 0.5 + Math.cos(a) * s * 0.29, s * 0.72 + Math.sin(a) * s * 0.28,
      r, r * 0.95, i % 2 ? C.la : C.laSombra);
  }
  elipse(ctx, s * 0.5, s * 0.82, s * 0.3, s * 0.26, C.la);

  // AS ORELHAS SÃO HORIZONTAIS: orelha em pé faz cabra, orelha caindo faz
  // coelho — é a largura da silhueta que faz ovelha
  for (const [x, giro] of [[0.19, 0.42], [0.81, -0.42]] as const) {
    elipse(ctx, s * x, s * 0.55, s * 0.115, s * 0.052, C.cara, giro);
  }

  elipse(ctx, s * 0.5, s * 0.55, s * 0.185, s * 0.205, C.cara);
  // o topete de lã entre as orelhas, que impede a cara escura de parecer
  // emprestada de outro bicho
  for (const [dx, dy] of [[-0.085, -0.155], [0, -0.185], [0.085, -0.155]] as const) {
    elipse(ctx, s * (0.5 + dx), s * (0.55 + dy), s * 0.085, s * 0.08, C.la);
  }
  elipse(ctx, s * 0.5, s * 0.665, s * 0.085, s * 0.062, C.focinho);
  elipse(ctx, s * 0.47, s * 0.645, s * 0.016, s * 0.012, C.cara);
  elipse(ctx, s * 0.53, s * 0.645, s * 0.016, s * 0.012, C.cara);
  olhos(ctx, s * 0.43, s * 0.57, s * 0.55, s * 0.032);

  // OS ÓCULOS DE MEIA-LUA de quem passa o dia medindo bainha: meio aro por
  // baixo do olho, e não um círculo — aro fechado vira óculos de nadar
  /*
   * O aro passa POR BAIXO DO OLHO, e não em volta dele: na primeira versão os
   * dois meios-aros abraçavam as pupilas e a cara escura virava uma máscara de
   * bandido. Meia-lua é meia-lua — ela fica na metade de baixo.
   */
  ctx.strokeStyle = C.oculos;
  ctx.lineWidth = s * 0.014;
  for (const x of [0.43, 0.57]) {
    ctx.beginPath();
    ctx.arc(s * x, s * 0.568, s * 0.047, 0.15, Math.PI - 0.15);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(s * 0.478, s * 0.568);
  ctx.lineTo(s * 0.522, s * 0.568);
  ctx.stroke();

  // a FITA MÉTRICA no pescoço, com as duas pontas caindo no peito
  ctx.strokeStyle = C.fita;
  ctx.lineWidth = s * 0.038;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(s * 0.33, s * 0.72);
  ctx.quadraticCurveTo(s * 0.5, s * 0.82, s * 0.67, s * 0.72);
  ctx.stroke();
  bolinha(ctx, s, 0.84, 0.3);
}

// ------------------------------------------------------------ os inscritos

/**
 * A LISTA, na ordem em que o quadro mostra.
 *
 * O PARCEIRO VEM PRIMEIRO e está sempre lá: é contra ele que se aprende a
 * mexer a raquete, e um quadro que começa vazio não convida ninguém. Os outros
 * chegam por flag — e o Jean-Luc, quando cai, traz os três de uma vez, que é
 * exatamente o que ele promete na cara dura ao perder.
 *
 * AS FICHAS SÃO MEDIDAS, não escolhidas no olho: `scripts/balanco.mjs` simula
 * partidas contra cada uma e cobra a faixa. A `pontaria` é o número que decide
 * — é ele que faz um adversário COLOCAR a bola onde você não está, em vez de
 * só devolver com mais teimosia.
 */
export const INSCRITOS: readonly DesafianteDoQuadro[] = [
  {
    id: 'parceiro',
    nome: 'A dupla',
    apelido: 'os donos da mesa',
    historia:
      'Jogam desde sempre, sempre até cinco, e sempre com a mesma regra: quem '
      + 'perde carrega a bolsa até em casa. Nenhum dos dois joga bem. Os dois '
      + 'juram que o outro joga pior.',
    assinatura: 'a gente já estava aqui',
    // a ficha do parceiro é A REFERÊNCIA do motor, e não uma cópia com os
    // mesmos números: duas listas iguais viram duas listas diferentes no
    // primeiro ajuste
    ficha: PARCEIRO,
    inscreveSe: '',
    pintar: retratoDaDupla,
  },
  {
    id: 'jean-luc',
    nome: 'Jean-Luc',
    apelido: 'o pato do lago',
    historia:
      'Passou seis anos debaixo d\'água assistindo às partidas do fundo do lago. '
      + 'Treina na correnteza, porque «la balle s\'enfuit» e quem alcança bolinha '
      + 'na correnteza alcança tudo. Devolve na quina que você acabou de deixar.',
    assinatura: 'Jean-Luc · enchanté',
    ficha: {
      id: 'jean-luc', cor: 0xe0243c, erro: 0.8, feio: 0.2, rapidez: 5.4, desvio: 0.7, pontaria: 2.2,
    },
    inscreveSe: 'jean-luc-conhecido',
    pintar: retratoDoJeanLuc,
  },
  {
    id: 'mano',
    nome: 'Mano',
    apelido: 'o pinguim da sorveteria',
    historia:
      'Diz que joga igualzinho a servir casquinha: rápido, alegre e derrubando '
      + 'metade no caminho. Comemora cada ponto dançando, inclusive os que toma. '
      + 'É o adversário mais divertido do parque e o mais fácil de distrair.',
    assinatura: 'Mano (posso dançar entre os pontos?)',
    ficha: {
      id: 'mano', cor: 0xf6a6c0, erro: 1.1, feio: 0.3, rapidez: 5.2, desvio: 1.2, pontaria: 1.1,
    },
    inscreveSe: 'jean-luc-batido',
    pintar: retratoDoMano,
  },
  {
    id: 'cookie',
    nome: 'Cookie',
    apelido: 'o elefante da bilheteria',
    historia:
      'Segura a raquete com a tromba, o que lhe dá um alcance que ninguém tem. '
      + 'O problema é a força: ele tem medo de machucar a bolinha e bate devagar '
      + 'demais. Nunca coube na roda gigante, mas cabe atrás da mesa — e isso, '
      + 'para ele, já é muita coisa.',
    assinatura: 'Cookie · prometo pegar leve',
    ficha: {
      id: 'cookie', cor: 0x9a94a3, erro: 0.9, feio: 0.22, rapidez: 6.2, desvio: 0.9, pontaria: 0.8,
    },
    inscreveSe: 'jean-luc-batido',
    pintar: retratoDoCookie,
  },
  {
    id: 'estella',
    nome: 'Estella',
    apelido: 'a ovelha da boutique',
    historia:
      'Trata a mesa como um tabuleiro: pensa três jogadas à frente e devolve '
      + 'exatamente onde você não vai estar. Entre um ponto e outro comenta a sua '
      + 'roupa. Ela não faz isso para desconcentrar — ela faz porque reparou '
      + 'mesmo —, mas desconcentra.',
    assinatura: 'Estella · e essa camisa, meu bem?',
    ficha: {
      id: 'estella', cor: 0xc4565a, erro: 0.75, feio: 0.16, rapidez: 5.6, desvio: 0.6, pontaria: 2.6,
    },
    inscreveSe: 'jean-luc-batido',
    pintar: retratoDaEstella,
  },
];
