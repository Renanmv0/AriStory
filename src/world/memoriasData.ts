/**
 * As memorias penduradas no quadro do quarto do Ari.
 *
 * Uma memoria aqui NAO e uma imagem: e uma funcao que pinta a cena com a API
 * Canvas 2D na hora em que o painel abre. Mesmo principio do resto do jogo —
 * zero asset externo, tudo procedural — so que em 2D, porque uma lembranca se
 * olha de frente, como foto, e nao se anda dentro dela.
 *
 * COMO UMA FOTO VIRA CODIGO AQUI: cada memoria escolhe a estrutura que a foto
 * dela pede, e por isso a pintura e uma funcao por memoria e nao um motor so.
 *
 * - O corredor de luzinhas sai INTEIRO de um ponto de fuga: `encolhe` e
 *   `projetar` dao posicao e tamanho de cada viga, pilar, lampada e junta do
 *   chao. O olho reconhece o RITMO adensando ao longe, nao o detalhe de perto —
 *   desenhar cada peca "a olho" daria um cenario de teatro chapado.
 * - O arraia e frontal: faixas horizontais empilhadas (ceu, mata, brinquedos,
 *   grama) com os varais cruzando por cima. Ali um ponto de fuga so torceria
 *   uma cena que na foto e chapada mesmo.
 *
 * O que as duas compartilham e a ordem: de tras para a frente, cada camada
 * tapando a anterior no lugar certo. E o que dispensa qualquer recorte.
 *
 * As cores moram aqui, e nao em `palette.ts`, de proposito: sao a paleta de
 * uma foto especifica, em string CSS, e nenhum material do mundo 3D usa
 * nenhuma delas. Botar as duas coisas no mesmo lugar so encheria a paleta do
 * jogo de tons que nenhuma cena pede.
 */

export interface MemoriaPintada {
  readonly id: string;
  readonly titulo: string;
  readonly lugar: string;
  /** a legenda embaixo do quadro, na voz de quem lembra */
  readonly legenda: string;
  /** largura / altura do quadro; a tela reserva o espaco por esta conta */
  readonly proporcao: number;
  /** @param t segundos desde que o painel abriu — so o que pisca usa */
  pintar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void;
}

// --------------------------------------------------------------- perspectiva

/** Onde TODAS as linhas da cena se encontram, em fracao do quadro. */
const FUGA = { x: 0.5, y: 0.44 };

/**
 * O encolhimento com a distancia. `d` = 0 e a boca do corredor, `d` = 1 e o
 * fundo. Hiperbole, nao reta: e ela que junta as vigas ao longe.
 *
 * Como `encolhe` e hiperbolica, `d` igualmente espacado JA sai igualmente
 * espacado no mundo — por isso os aneis abaixo sao uma progressao simples e o
 * adensamento aparece sozinho.
 */
const encolhe = (d: number): number => 1 / (1 + 8.5 * d);

/**
 * Leva um ponto do plano da frente para a profundidade `d`.
 *
 * `x` e `y` sao medidos A PARTIR DO PONTO DE FUGA, em fracao do quadro: o
 * ponto (0, 0) e o fundo do corredor em qualquer profundidade, e e por isso
 * que tudo converge sem nenhuma conta a mais.
 */
const projetar = (x: number, y: number, d: number, w: number, h: number) => {
  const f = encolhe(d);
  return { x: (FUGA.x + x * f) * w, y: (FUGA.y + y * f) * h };
};

/**
 * O plano da frente, medido do ponto de fuga.
 *
 * O teto e RASO de proposito (-0.44, e nao a meia tela que a foto sugere): a
 * viga de `d` = 0 fica em `FUGA.y + TETO`, e num valor mais fundo ela nasce
 * acima da borda — o quadro perdia justamente as vigas grossas de perto, que
 * sao o que da o peso do telhado.
 */
const CHAO = 0.56;
const TETO = -0.44;
/** onde os pilares encostam, para os lados */
const LADO = 0.62;
/** o pilar para antes das vigas: em cima dele passa a longarina */
const TOPO_PILAR = -0.28;
/** os varais penduram ABAIXO das vigas, senao os fios somem por tras delas */
const VARAL = -0.34;

/** as cores do Ari e do Renan, em qualquer memoria */
const CORES_DUPLA = {
  ariCabelo: '#8f5c33',
  ariRoupa: '#e8e2d6',
  ariPele: '#f2cfb2',
  renanCabelo: '#1f1712',
  renanRoupa: '#1b1c22',
  renanPele: '#efc8a4',
  perna: '#15161c',
};

/** a noite do corredor de luzinhas */
const CORREDOR = {
  ceuTopo: '#0a1120',
  ceuBaixo: '#2b3d58',
  vigaFrente: '#6d4028',
  vigaBaixo: '#3c2115',
  longarina: '#7d4d31',
  tijolo: '#b1613f',
  tijoloSombra: '#7e4029',
  tijoloJunta: '#cd8461',
  base: '#8a8781',
  chaoPerto: '#8b7a51',
  chaoLonge: '#4a4536',
  junta: '#6f6650',
  tatil: '#77746b',
  tatilRisco: '#95928a',
  folhaClara: '#2c5741',
  folhaEscura: '#16301f',
  tronco: '#2a2119',
  fio: '#5d5346',
  luz: '#ffd489',
  luzNucleo: '#fff8e6',
};

/** o dia do arraia no Villa-Lobos */
const ARRAIA = {
  ceuTopo: '#1f74c8',
  ceuBaixo: '#a9d9f2',
  mataLonge: '#4d7f4a',
  mataPerto: '#356b39',
  // a grama de junho em SP: verde puxando para o palha, nao o verde do jogo
  gramaAlta: '#8fae55',
  gramaBaixa: '#a8bd68',
  sombra: '#5f7a3c',
  inflavelClaro: '#eeeae2',
  inflavelCinza: '#cfd2d4',
  inflavelRosa: '#f06a9c',
  bannerXadrez: '#3f8fd1',
  bannerFundo: '#fbfaf6',
  bannerRosa: '#ef5ba1',
  bannerTexto: '#e0357f',
  gato: '#fdfcf9',
  gatoTraco: '#3b3630',
  lacoVermelho: '#e0342f',
  verdeBrinquedo: '#57bd45',
  verdeBrinquedoFundo: '#3f9a32',
  azulBrinquedo: '#3aa9e8',
  azulBrinquedoFundo: '#2681bd',
  amareloBrinquedo: '#f5c518',
  roxoBrinquedo: '#8f5cc4',
  torre: '#f5822c',
  grade: '#3f6fbd',
};

/** as bandeirinhas do varal, na ordem em que se repetem */
const BANDEIRAS = [
  '#e8442f', '#f5c518', '#3d9be0', '#f07ab0',
  '#f7f4ec', '#6fc04a', '#f5822c', '#a069c4',
];

// ------------------------------------------------------------------ pedacos

/**
 * Uma palmeira em silhueta: tronco fino e folhas em leque.
 *
 * Ela existe para preencher o vao ENTRE os pilares, entao e desenhada antes
 * deles e sempre em tom escuro — na foto a vegetacao esta fora do alcance das
 * luzinhas e so aparece como recorte contra o ceu.
 */
function palmeira(
  ctx: CanvasRenderingContext2D,
  x: number,
  base: number,
  altura: number,
  cor: string,
): void {
  ctx.strokeStyle = cor;
  ctx.lineCap = 'round';

  ctx.lineWidth = Math.max(1.2, altura * 0.04);
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.quadraticCurveTo(x - altura * 0.07, base - altura * 0.55, x, base - altura);
  ctx.stroke();

  // 9 folhas em leque, tombando para fora conforme se afastam do topo.
  // Folha GROSSA e CURTA: com o traco fino a copa sumia e a palmeira virava um
  // risco verde reto no meio dos pilares.
  const copa = base - altura;
  ctx.lineWidth = Math.max(1.6, altura * 0.1);
  for (let i = 0; i < 9; i++) {
    const ang = -Math.PI * 0.94 + (i / 8) * Math.PI * 0.88;
    const alc = altura * (0.42 + 0.14 * Math.sin(i * 1.7));
    ctx.beginPath();
    ctx.moveTo(x, copa + altura * 0.04);
    ctx.quadraticCurveTo(
      x + Math.cos(ang) * alc * 0.62,
      copa + Math.sin(ang) * alc * 0.58,
      x + Math.cos(ang) * alc,
      copa + Math.sin(ang) * alc + alc * 0.34,
    );
    ctx.stroke();
  }
}

/**
 * Uma lampada do varal: halo por tras, nucleo por cima.
 *
 * O halo e um gradiente radial e e a parte cara do desenho, entao as luzes do
 * fundo (raio minusculo) recebem so o nucleo: a essa distancia o halo nao
 * aparece, mas somados os 50 gradientes pesam.
 */
function lampada(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  raio: number,
  brilho: number,
): void {
  if (raio > 1.4) {
    const halo = ctx.createRadialGradient(x, y, 0, x, y, raio * 6);
    halo.addColorStop(0, `rgba(255, 206, 128, ${0.58 * brilho})`);
    halo.addColorStop(0.45, `rgba(255, 178, 96, ${0.18 * brilho})`);
    halo.addColorStop(1, 'rgba(255, 170, 90, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, raio * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = CORREDOR.luz;
  ctx.globalAlpha = brilho;
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = CORREDOR.luzNucleo;
  ctx.beginPath();
  ctx.arc(x, y, raio * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/**
 * Um dos dois, de costas.
 *
 * Sao sempre dois em cena, e de costas a diferenca entre eles cabe em duas
 * cores: o Ari e o claro (camisa creme), o Renan e o escuro (moletom preto).
 * Nada de rosto — eles estao olhando o que a memoria mostra, nao a gente.
 *
 * `pele` so entra de dia e de perto: no contraluz do corredor eles sao recorte,
 * e um braco cor de pele ali seria uma mancha clara sem explicacao.
 */
function silhueta(
  ctx: CanvasRenderingContext2D,
  x: number,
  base: number,
  altura: number,
  roupa: string,
  cabelo: string,
  passo: number,
  pele?: string,
): void {
  const larg = altura * 0.3;

  ctx.strokeStyle = CORES_DUPLA.perna;
  ctx.lineWidth = altura * 0.075;
  ctx.lineCap = 'round';
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x, base - altura * 0.42);
    ctx.lineTo(x + lado * larg * 0.26 * passo, base);
    ctx.stroke();
  }

  // os bracos vao ANTES do tronco, para o ombro cobrir onde eles nascem
  if (pele) {
    ctx.strokeStyle = pele;
    ctx.lineWidth = altura * 0.055;
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + lado * larg * 0.42, base - altura * 0.72);
      ctx.lineTo(x + lado * larg * 0.52, base - altura * 0.44);
      ctx.stroke();
    }
  }

  ctx.fillStyle = roupa;
  ctx.beginPath();
  ctx.roundRect(x - larg / 2, base - altura * 0.78, larg, altura * 0.4, larg * 0.32);
  ctx.fill();

  ctx.fillStyle = cabelo;
  ctx.beginPath();
  ctx.arc(x, base - altura * 0.87, altura * 0.11, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Um varal de bandeirinhas atravessando o quadro.
 *
 * Cada bandeira e um triangulo com a BASE no fio e a ponta para baixo, e a base
 * acompanha a inclinacao do varal — pendurar todas na vertical, num varal
 * torto, faz elas parecerem coladas em cima do fio em vez de penduradas nele.
 * O balanco e minusculo de proposito: o varal e um enfeite, nao a cena.
 */
function varalDeBandeiras(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number,
  x1: number, y1: number,
  barriga: number,
  tamanho: number,
  quantas: number,
  desde: number,
  t: number,
): void {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2 + barriga;
  const ponto = (u: number) => {
    const iu = 1 - u;
    return {
      x: iu * iu * x0 + 2 * iu * u * mx + u * u * x1,
      y: iu * iu * y0 + 2 * iu * u * my + u * u * y1,
    };
  };

  ctx.strokeStyle = 'rgba(240, 240, 235, 0.85)';
  ctx.lineWidth = Math.max(0.8, tamanho * 0.05);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(mx, my, x1, y1);
  ctx.stroke();

  for (let i = 0; i < quantas; i++) {
    const u = (i + 0.5) / quantas;
    const a = ponto(Math.max(0, u - 0.012));
    const b = ponto(Math.min(1, u + 0.012));
    // a normal do fio: e ela que faz a bandeira cair PERPENDICULAR ao varal
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const comp = Math.hypot(dx, dy) || 1;
    const nx = -dy / comp;
    const ny = dx / comp;
    const balanco = Math.sin(t * 1.1 + i * 0.8) * tamanho * 0.06;

    ctx.fillStyle = BANDEIRAS[(i + desde) % BANDEIRAS.length];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(
      (a.x + b.x) / 2 - nx * tamanho + balanco,
      (a.y + b.y) / 2 - ny * tamanho,
    );
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * A gatinha do banner: cabeca oval, duas orelhas, laco e bigodes.
 *
 * Nao e um decalque de personagem — e a forma que o banner da festa tinha,
 * reduzida ao que se le num quadro deste tamanho: quatro formas e tres riscos.
 */
function gatinha(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.fillStyle = ARRAIA.gato;
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + lado * r * 0.92, y - r * 0.28);
    ctx.lineTo(x + lado * r * 0.62, y - r * 1.15);
    ctx.lineTo(x + lado * r * 0.16, y - r * 0.6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = ARRAIA.lacoVermelho;
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + r * (0.78 + lado * 0.24), y - r * 0.5, r * 0.26, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = ARRAIA.gatoTraco;
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + lado * r * 0.36, y - r * 0.02, r * 0.09, r * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = ARRAIA.amareloBrinquedo;
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.14, r * 0.11, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = ARRAIA.gatoTraco;
  ctx.lineWidth = Math.max(0.5, r * 0.05);
  for (const lado of [-1, 1]) {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(x + lado * r * 0.6, y + r * 0.1 + i * r * 0.14);
      ctx.lineTo(x + lado * r * 1.02, y + r * 0.04 + i * r * 0.2);
      ctx.stroke();
    }
  }
}

/**
 * Um brinquedo inflavel: bloco arredondado com gomos e vinco no topo.
 *
 * Os GOMOS sao o que faz a forma ler como inflavel e nao como caixa — sem eles
 * o verde comprido da foto vira um muro verde. Sao so linhas verticais mais
 * escuras, espacadas pela largura da peca.
 */
function inflavel(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, larg: number, alt: number,
  cor: string, corGomo: string,
): void {
  const raio = Math.min(alt * 0.42, larg * 0.2);
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.roundRect(x, y, larg, alt, raio);
  ctx.fill();

  ctx.strokeStyle = corGomo;
  ctx.lineWidth = Math.max(0.7, alt * 0.045);
  const gomos = Math.max(2, Math.round(larg / (alt * 0.75)));
  for (let i = 1; i < gomos; i++) {
    const gx = x + (larg * i) / gomos;
    ctx.beginPath();
    ctx.moveTo(gx, y + alt * 0.14);
    ctx.lineTo(gx, y + alt * 0.86);
    ctx.stroke();
  }
  // o vinco de cima, onde a lona dobra
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
  ctx.lineWidth = Math.max(0.8, alt * 0.07);
  ctx.beginPath();
  ctx.moveTo(x + raio, y + alt * 0.16);
  ctx.lineTo(x + larg - raio, y + alt * 0.16);
  ctx.stroke();
}

// -------------------------------------------------------- a memoria da foto

/**
 * O corredor de luzinhas, a noite: onde os dois comecaram a namorar.
 *
 * Pintado de tras para a frente, como quem monta um cenario: ceu, chao,
 * vegetacao, pilares, teto, os varais, e por ultimo os dois andando. A ordem
 * importa — cada camada tapa a anterior no lugar certo, e e o que dispensa
 * qualquer recorte.
 */
function corredorDeLuzes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
): void {
  const p = (x: number, y: number, d: number) => projetar(x, y, d, w, h);
  const horizonte = FUGA.y * h;

  // 1. ceu ------------------------------------------------------------------
  const ceu = ctx.createLinearGradient(0, 0, 0, horizonte);
  ceu.addColorStop(0, CORREDOR.ceuTopo);
  ceu.addColorStop(1, CORREDOR.ceuBaixo);
  ctx.fillStyle = ceu;
  ctx.fillRect(0, 0, w, horizonte);

  // 2. chao -----------------------------------------------------------------
  // Quente perto (as luzinhas batem nele) e frio ao longe, que e o que da a
  // sensacao de distancia sem desenhar nada a mais.
  const piso = ctx.createLinearGradient(0, horizonte, 0, h);
  piso.addColorStop(0, CORREDOR.chaoLonge);
  piso.addColorStop(1, CORREDOR.chaoPerto);
  ctx.fillStyle = piso;
  ctx.fillRect(0, horizonte, w, h - horizonte);

  // a poca de luz quente no chao logo abaixo dos varais: e ela que amarra o
  // chao ao teto, senao a calcada parece iluminada por outra cena
  const pocaDeLuz = ctx.createRadialGradient(
    FUGA.x * w, h * 0.86, 0,
    FUGA.x * w, h * 0.86, w * 0.62,
  );
  pocaDeLuz.addColorStop(0, 'rgba(255, 196, 122, 0.3)');
  pocaDeLuz.addColorStop(1, 'rgba(255, 190, 120, 0)');
  ctx.fillStyle = pocaDeLuz;
  ctx.fillRect(0, horizonte, w, h - horizonte);

  // as juntas do bloquete: a mesma progressao das vigas, no chao
  ctx.strokeStyle = CORREDOR.junta;
  for (let i = 0; i < 26; i++) {
    const d = i * 0.036;
    const e = p(-LADO, CHAO, d);
    const dir = p(LADO, CHAO, d);
    // some ao longe em vez de saturar: `encolhe` cai rapido, entao sem o teto
    // as juntas de perto ficavam todas no alpha 1 e as do fundo, invisiveis
    ctx.globalAlpha = Math.min(0.42, 0.42 * encolhe(d) * 3.2);
    ctx.lineWidth = Math.max(0.5, 3 * encolhe(d));
    ctx.beginPath();
    ctx.moveTo(e.x, e.y);
    ctx.lineTo(dir.x, dir.y);
    ctx.stroke();
  }

  // as juntas no sentido do caminho: saem do ponto de fuga como tudo o mais, e
  // sao elas que fecham a GRADE do bloquete. So com as transversais o chao
  // ficava um lencol liso ocupando a metade de baixo do quadro
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 1;
  for (let i = -6; i <= 6; i++) {
    if (i === 0) continue;
    const frente = p(i * 0.1, CHAO, 0);
    ctx.beginPath();
    ctx.moveTo(FUGA.x * w, FUGA.y * h);
    ctx.lineTo(frente.x, frente.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // a faixa tatil, que sai do ponto de fuga e abre ate a base
  const tl = p(-0.05, CHAO, 0);
  const tr = p(0.05, CHAO, 0);
  const fl = p(-0.05, CHAO, 0.97);
  const fr = p(0.05, CHAO, 0.97);
  ctx.fillStyle = CORREDOR.tatil;
  ctx.beginPath();
  ctx.moveTo(tl.x, tl.y);
  ctx.lineTo(tr.x, tr.y);
  ctx.lineTo(fr.x, fr.y);
  ctx.lineTo(fl.x, fl.y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = CORREDOR.tatilRisco;
  for (let i = 0; i < 22; i++) {
    const d = i * 0.042;
    const e = p(-0.038, CHAO, d);
    const dir = p(0.038, CHAO, d);
    ctx.lineWidth = Math.max(0.5, 3.2 * encolhe(d));
    ctx.beginPath();
    ctx.moveTo(e.x, e.y);
    ctx.lineTo(dir.x, dir.y);
    ctx.stroke();
  }

  // 3. vegetacao ------------------------------------------------------------
  // Atras dos pilares, entao vem antes deles. Do fundo para a frente.
  //
  // O pe vai no CHAO, e nao a meia altura: plantada no meio da parede ela
  // flutuava na linha das vigas, e o que se via era um arbusto pendurado. Alta
  // o bastante (0.85) para a copa passar por cima do topo dos pilares, que e
  // como a palmeira aparece na foto — por cima da coluna, contra o ceu.
  for (let i = 5; i >= 0; i--) {
    const d = 0.12 + i * 0.15;
    const f = encolhe(d);
    for (const lado of [-1, 1]) {
      const pe = p(lado * (LADO + 0.13), CHAO, d);
      palmeira(
        ctx,
        pe.x,
        pe.y,
        h * 0.85 * f,
        i % 2 === 0 ? CORREDOR.folhaEscura : CORREDOR.folhaClara,
      );
    }
  }

  // 4. pilares --------------------------------------------------------------
  // Um a cada tres vigas, como na foto. Do fundo para a frente: o de perto
  // tapa o de tras e e so isso que da a profundidade da fileira.
  for (let i = 7; i >= 0; i--) {
    const d = i * 0.115;
    const f = encolhe(d);
    const larg = w * 0.085 * f;
    for (const lado of [-1, 1]) {
      const pe = p(lado * LADO, CHAO, d);
      const topo = p(lado * LADO, TOPO_PILAR, d);
      const x = pe.x - larg / 2;

      ctx.fillStyle = CORREDOR.tijolo;
      ctx.fillRect(x, topo.y, larg, pe.y - topo.y);

      // a face virada para o centro do corredor fica na sombra
      ctx.fillStyle = CORREDOR.tijoloSombra;
      ctx.fillRect(lado < 0 ? x + larg * 0.68 : x, topo.y, larg * 0.32, pe.y - topo.y);

      // a base de concreto
      const alturaBase = (pe.y - topo.y) * 0.09;
      ctx.fillStyle = CORREDOR.base;
      ctx.fillRect(x - larg * 0.06, pe.y - alturaBase, larg * 1.12, alturaBase);

      // as juntas do tijolo so nos pilares de perto: mais longe viram ruido
      if (d < 0.3) {
        ctx.strokeStyle = CORREDOR.tijoloJunta;
        ctx.lineWidth = Math.max(0.5, 1.6 * f);
        ctx.globalAlpha = 0.5;
        const alto = pe.y - alturaBase;
        for (let j = 1; j < 14; j++) {
          const y = topo.y + ((alto - topo.y) * j) / 14;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + larg, y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    }
  }

  // 5. teto -----------------------------------------------------------------
  // As duas longarinas correm no sentido do corredor, do ponto de fuga ate a
  // boca; as travessas atravessam. As longarinas vao primeiro porque as
  // travessas passam por baixo delas na foto.
  ctx.strokeStyle = CORREDOR.longarina;
  ctx.lineCap = 'butt';
  for (const lado of [-1, 1]) {
    const frente = p(lado * LADO * 1.05, TOPO_PILAR, 0);
    const fundo = p(lado * LADO * 1.05, TOPO_PILAR, 0.95);
    ctx.lineWidth = w * 0.03;
    ctx.beginPath();
    ctx.moveTo(frente.x, frente.y);
    ctx.lineTo(fundo.x, fundo.y);
    ctx.stroke();
  }

  for (let i = 17; i >= 0; i--) {
    const d = i * 0.052;
    const f = encolhe(d);
    const e = p(-LADO * 1.16, TETO, d);
    const dir = p(LADO * 1.16, TETO, d);
    const grossura = Math.max(1, h * 0.05 * f);

    ctx.fillStyle = CORREDOR.vigaFrente;
    ctx.fillRect(e.x, e.y, dir.x - e.x, grossura);
    // a barriga da viga, que e a parte que pega menos luz
    ctx.fillStyle = CORREDOR.vigaBaixo;
    ctx.fillRect(e.x, e.y + grossura * 0.62, dir.x - e.x, grossura * 0.38);
  }

  // 6. os varais ------------------------------------------------------------
  // Cada varal vai de uma viga a OUTRA, trocando de lado: e o ziguezague que
  // aparece na foto. Sem a troca de lado sairiam faixas paralelas, que e o que
  // um varal de festa junina parece — nao este corredor.
  const VARAIS = 9;
  for (let i = 0; i < VARAIS; i++) {
    const d0 = 0.02 + i * 0.095;
    const d1 = d0 + 0.095;
    const lado = i % 2 === 0 ? -1 : 1;
    const a = p(lado * LADO * 1.02, VARAL, d0);
    const b = p(-lado * LADO * 1.02, VARAL, d1);
    // a barriga do fio: quanto mais perto, mais ele cai
    const barriga = h * 0.06 * encolhe(d0);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 + barriga;

    ctx.strokeStyle = CORREDOR.fio;
    ctx.lineWidth = Math.max(0.4, 1.8 * encolhe(d0));
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.stroke();

    const quantas = 7;
    for (let j = 0; j <= quantas; j++) {
      const u = j / quantas;
      // ponto da quadratica, para a lampada pendurar EM cima do fio
      const iu = 1 - u;
      const x = iu * iu * a.x + 2 * iu * u * mx + u * u * b.x;
      const y = iu * iu * a.y + 2 * iu * u * my + u * u * b.y;
      const f = encolhe(d0 + (d1 - d0) * u);
      const brilho = 0.82 + 0.18 * Math.sin(t * 1.6 + i * 2.1 + j * 0.9);
      lampada(ctx, x, y + h * 0.012 * f, Math.max(0.7, w * 0.015 * f), brilho);
    }
  }

  // O amontoado de luz no fundo do corredor, onde os varais se encontram.
  // Pequeno e concentrado: com raio grande ele lavava o fundo inteiro e virava
  // um muro cinza atras dos dois, em vez de um brilho.
  const fundo = ctx.createRadialGradient(
    FUGA.x * w, FUGA.y * h - h * 0.02, 0,
    FUGA.x * w, FUGA.y * h - h * 0.02, w * 0.085,
  );
  fundo.addColorStop(0, 'rgba(255, 232, 182, 0.9)');
  fundo.addColorStop(0.35, 'rgba(255, 196, 118, 0.34)');
  fundo.addColorStop(1, 'rgba(255, 180, 100, 0)');
  ctx.fillStyle = fundo;
  ctx.fillRect(0, 0, w, h);

  // 7. os dois --------------------------------------------------------------
  const passo = Math.sin(t * 2.4);
  const chaoDeles = p(0, CHAO, 0.66);
  const alt = h * 0.5 * encolhe(0.66);
  silhueta(ctx, chaoDeles.x - alt * 0.34, chaoDeles.y, alt, CORES_DUPLA.ariRoupa, CORES_DUPLA.ariCabelo, passo);
  silhueta(ctx, chaoDeles.x + alt * 0.34, chaoDeles.y, alt, CORES_DUPLA.renanRoupa, CORES_DUPLA.renanCabelo, -passo);

  // 8. o acabamento ---------------------------------------------------------
  // Um banho quente por cima costura as camadas na mesma luz, e a vinheta
  // fecha os cantos — sem ela o desenho fica com cara de recorte colado.
  ctx.fillStyle = 'rgba(255, 176, 96, 0.07)';
  ctx.fillRect(0, 0, w, h);

  const vinheta = ctx.createRadialGradient(
    w / 2, h * 0.48, w * 0.2,
    w / 2, h * 0.48, w * 0.78,
  );
  vinheta.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vinheta.addColorStop(1, 'rgba(6, 9, 16, 0.62)');
  ctx.fillStyle = vinheta;
  ctx.fillRect(0, 0, w, h);
}

/**
 * O arraia da Hello Kitty, no Villa-Lobos.
 *
 * Esta memoria NAO usa a perspectiva do corredor, e essa e a graca de a
 * pintura ser uma funcao por memoria: aqui a foto e frontal, de dia, e o que
 * organiza a cena sao FAIXAS horizontais empilhadas (ceu, mata, brinquedos,
 * grama) com os varais de bandeirinha cruzando por cima de tudo. Forcar o
 * ponto de fuga aqui so torceria um cenario que na foto e chapado mesmo.
 *
 * A ordem tambem e de tras para a frente, e os varais vao POR ULTIMO: na foto
 * eles passam na frente do ceu, do tobogao e ate do banner.
 */
function arraiaDaHelloKitty(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
): void {
  const HORIZONTE = 0.585;
  const chao = HORIZONTE * h;

  // 1. ceu ------------------------------------------------------------------
  const ceu = ctx.createLinearGradient(0, 0, 0, chao);
  ceu.addColorStop(0, ARRAIA.ceuTopo);
  ceu.addColorStop(1, ARRAIA.ceuBaixo);
  ctx.fillStyle = ceu;
  ctx.fillRect(0, 0, w, chao);

  // 2. a mata do parque, atras de tudo --------------------------------------
  for (const [inicio, fim, altura, cor] of [
    [-0.05, 0.5, 0.15, ARRAIA.mataLonge],
    [0.42, 1.05, 0.125, ARRAIA.mataLonge],
    [-0.05, 1.05, 0.08, ARRAIA.mataPerto],
  ] as const) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(inicio * w, chao);
    for (let x = inicio; x <= fim; x += 0.035) {
      const copa = chao - altura * h * (0.6 + 0.4 * Math.abs(Math.sin(x * 27)));
      ctx.lineTo(x * w, copa);
    }
    ctx.lineTo(fim * w, chao);
    ctx.closePath();
    ctx.fill();
  }

  // 3. o tobogao inflavel ---------------------------------------------------
  // A peca mais alta da foto, e o que ancora o lado esquerdo. Trapezio largo
  // (nao triangulo): o de verdade tem a torre reta e a pista descendo do lado.
  const topo = 0.235 * h;
  ctx.fillStyle = ARRAIA.inflavelClaro;
  ctx.beginPath();
  ctx.moveTo(0.0 * w, chao);
  ctx.lineTo(0.245 * w, topo);
  ctx.lineTo(0.4 * w, topo);
  ctx.lineTo(0.5 * w, chao);
  ctx.closePath();
  ctx.fill();

  // a pista que desce para a esquerda, um degrau mais escura
  ctx.fillStyle = ARRAIA.inflavelCinza;
  ctx.beginPath();
  ctx.moveTo(0.0 * w, chao);
  ctx.lineTo(0.245 * w, topo);
  ctx.lineTo(0.315 * w, topo);
  ctx.lineTo(0.14 * w, chao);
  ctx.closePath();
  ctx.fill();

  // a tenda do alto
  ctx.fillStyle = ARRAIA.inflavelCinza;
  ctx.beginPath();
  ctx.moveTo(0.235 * w, topo + 0.012 * h);
  ctx.lineTo(0.325 * w, 0.175 * h);
  ctx.lineTo(0.412 * w, topo + 0.012 * h);
  ctx.closePath();
  ctx.fill();

  // a faixa rosa da base, que e o que diz "é o brinquedo da Hello Kitty"
  ctx.fillStyle = ARRAIA.inflavelRosa;
  ctx.beginPath();
  ctx.moveTo(0.055 * w, chao - 0.075 * h);
  ctx.lineTo(0.47 * w, chao - 0.075 * h);
  ctx.lineTo(0.485 * w, chao - 0.035 * h);
  ctx.lineTo(0.04 * w, chao - 0.035 * h);
  ctx.closePath();
  ctx.fill();

  // a metade da direita apanha menos sol: sem este degrau o tobogao vira um
  // recorte de papel branco, que foi como ele saiu na primeira foto
  ctx.fillStyle = 'rgba(112, 126, 138, 0.34)';
  ctx.beginPath();
  ctx.moveTo(0.325 * w, topo);
  ctx.lineTo(0.4 * w, topo);
  ctx.lineTo(0.5 * w, chao);
  ctx.lineTo(0.33 * w, chao);
  ctx.closePath();
  ctx.fill();

  // A boca por onde se sai do escorregador: rente ao chao, logo acima da faixa
  // rosa. Na primeira tentativa ela ficou a meia altura da torre e o que se via
  // era um bolso cinza flutuando no meio do brinquedo.
  ctx.fillStyle = 'rgba(84, 95, 105, 0.5)';
  ctx.beginPath();
  ctx.roundRect(0.135 * w, chao - 0.075 * h, 0.145 * w, 0.04 * h, 0.014 * w);
  ctx.fill();

  // os gomos da lona
  ctx.strokeStyle = 'rgba(138, 148, 156, 0.75)';
  ctx.lineWidth = Math.max(0.8, h * 0.0045);
  for (let i = 1; i < 6; i++) {
    const u = i / 6;
    ctx.beginPath();
    ctx.moveTo((0.245 + u * 0.155) * w, topo);
    ctx.lineTo((0.0 + u * 0.5) * w, chao);
    ctx.stroke();
  }

  // 4. o banner do arraia ---------------------------------------------------
  const bx = 0.42 * w;
  const by = 0.425 * h;
  const bl = 0.62 * w;
  const ba = 0.075 * h;

  ctx.fillStyle = ARRAIA.bannerFundo;
  ctx.fillRect(bx, by, bl, ba);
  // o xadrez de festa junina, so nas pontas — o meio e onde mora o texto
  ctx.fillStyle = ARRAIA.bannerXadrez;
  const quad = ba / 3;
  for (let cx = 0; cx < bl; cx += quad) {
    for (let cy = 0; cy < ba; cy += quad) {
      const naPonta = cx < quad * 2.2 || cx > bl - quad * 5.5;
      if (naPonta && Math.round(cx / quad + cy / quad) % 2 === 0) {
        ctx.fillRect(bx + cx, by + cy, quad, quad);
      }
    }
  }
  // o bloco rosa das datas, na ponta direita
  ctx.fillStyle = ARRAIA.bannerRosa;
  ctx.fillRect(bx + bl - quad * 4.4, by, quad * 4.4, ba);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(bx + bl - quad * 4, by + ba * (0.25 + i * 0.2), quad * 3.4, ba * 0.08);
  }

  gatinha(ctx, bx + bl - quad * 6.4, by + ba * 0.46, ba * 0.4);

  ctx.fillStyle = ARRAIA.bannerTexto;
  ctx.font = `900 ${Math.round(ba * 0.42)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ARRAIÁ', bx + bl * 0.42, by + ba * 0.5);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // 5. os brinquedos da frente ----------------------------------------------
  inflavel(ctx, 0.05 * w, chao - 0.055 * h, 0.13 * w, 0.055 * h,
    ARRAIA.roxoBrinquedo, '#6f45a0');
  inflavel(ctx, 0.36 * w, chao - 0.085 * h, 0.12 * w, 0.085 * h,
    ARRAIA.azulBrinquedo, ARRAIA.azulBrinquedoFundo);
  inflavel(ctx, 0.47 * w, chao - 0.05 * h, 0.06 * w, 0.05 * h,
    ARRAIA.amareloBrinquedo, '#cf9f0e');
  // o comprido verde, que na foto atravessa metade do quadro
  inflavel(ctx, 0.52 * w, chao - 0.075 * h, 0.5 * w, 0.075 * h,
    ARRAIA.verdeBrinquedo, ARRAIA.verdeBrinquedoFundo);

  // as grades azuis de proteção
  ctx.strokeStyle = ARRAIA.grade;
  ctx.lineWidth = Math.max(0.7, h * 0.0035);
  for (let i = 0; i < 9; i++) {
    const gx = (0.19 + i * 0.019) * w;
    ctx.beginPath();
    ctx.moveTo(gx, chao - 0.035 * h);
    ctx.lineTo(gx, chao);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0.185 * w, chao - 0.032 * h);
  ctx.lineTo(0.36 * w, chao - 0.032 * h);
  ctx.stroke();

  // 6. a torre laranja da direita, cortada pela borda ------------------------
  ctx.strokeStyle = ARRAIA.torre;
  ctx.lineWidth = Math.max(1.2, w * 0.008);
  ctx.beginPath();
  ctx.moveTo(0.9 * w, chao + 0.3 * h);
  ctx.lineTo(0.955 * w, chao - 0.09 * h);
  ctx.moveTo(1.02 * w, chao + 0.3 * h);
  ctx.lineTo(0.985 * w, chao - 0.09 * h);
  ctx.stroke();
  ctx.lineWidth = Math.max(0.8, w * 0.005);
  for (let i = 0; i < 7; i++) {
    const u = i / 7;
    const y0 = chao - 0.09 * h + u * 0.39 * h;
    const y1 = chao - 0.09 * h + ((i + 1) / 7) * 0.39 * h;
    const e0 = 0.955 + u * (0.9 - 0.955);
    const d0 = 0.985 + u * (1.02 - 0.985);
    const e1 = 0.955 + ((i + 1) / 7) * (0.9 - 0.955);
    const d1 = 0.985 + ((i + 1) / 7) * (1.02 - 0.985);
    ctx.beginPath();
    ctx.moveTo(e0 * w, y0);
    ctx.lineTo(d1 * w, y1);
    ctx.moveTo(d0 * w, y0);
    ctx.lineTo(e1 * w, y1);
    ctx.stroke();
  }

  // 7. a grama --------------------------------------------------------------
  const grama = ctx.createLinearGradient(0, chao, 0, h);
  grama.addColorStop(0, ARRAIA.gramaAlta);
  grama.addColorStop(1, ARRAIA.gramaBaixa);
  ctx.fillStyle = grama;
  ctx.fillRect(0, chao, w, h - chao);

  // o caminho de terra por onde todo mundo passa, entre os brinquedos e o gramado
  ctx.fillStyle = '#c6b184';
  ctx.beginPath();
  ctx.moveTo(0, chao);
  ctx.lineTo(w, chao);
  ctx.lineTo(w, chao + 0.028 * h);
  for (let x = 1; x >= 0; x -= 0.05) {
    ctx.lineTo(x * w, chao + (0.026 + 0.008 * Math.sin(x * 21)) * h);
  }
  ctx.closePath();
  ctx.fill();

  // A sombra da arvore que toma a frente da foto.
  //
  // Uma mancha DIFUSA (gradiente) com meia duzia de recortes por cima, e nao
  // dezenas de manchinhas iguais: a versao anterior espalhava 90 elipses do
  // mesmo tamanho e o que saia era uma textura de bolhas verdes, uniforme
  // demais para ler como sombra. Sombra de copa e uma massa so, mordida nas
  // bordas.
  const copa = ctx.createRadialGradient(
    0.44 * w, 0.92 * h, 0,
    0.44 * w, 0.92 * h, 0.62 * w,
  );
  copa.addColorStop(0, 'rgba(78, 100, 50, 0.34)');
  copa.addColorStop(0.6, 'rgba(78, 100, 50, 0.16)');
  copa.addColorStop(1, 'rgba(78, 100, 50, 0)');
  ctx.fillStyle = copa;
  ctx.fillRect(0, chao, w, h - chao);

  ctx.fillStyle = ARRAIA.sombra;
  ctx.globalAlpha = 0.16;
  for (const [cx, cy, rx, ry, giro] of [
    [0.2, 0.87, 0.16, 0.045, 0.2],
    [0.66, 0.9, 0.2, 0.05, -0.15],
    [0.38, 0.99, 0.3, 0.06, 0.05],
    [0.86, 0.83, 0.13, 0.035, 0.3],
  ] as const) {
    ctx.beginPath();
    ctx.ellipse(cx * w, cy * h, rx * w, ry * h, giro, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 8. os dois, olhando os brinquedos ---------------------------------------
  const passo = Math.sin(t * 2.1);
  const alt = 0.185 * h;
  silhueta(ctx, 0.4 * w, 0.86 * h, alt, CORES_DUPLA.ariRoupa, CORES_DUPLA.ariCabelo, passo, CORES_DUPLA.ariPele);
  silhueta(ctx, 0.49 * w, 0.86 * h, alt, CORES_DUPLA.renanRoupa, CORES_DUPLA.renanCabelo, -passo, CORES_DUPLA.renanPele);

  // 9. as bandeirinhas, por cima de tudo ------------------------------------
  varalDeBandeiras(ctx, -0.04 * w, 0.1 * h, 1.04 * w, 0.045 * h,
    0.028 * h, 0.05 * h, 15, 0, t);
  varalDeBandeiras(ctx, -0.04 * w, 0.235 * h, 1.04 * w, 0.145 * h,
    0.03 * h, 0.045 * h, 16, 3, t);
  varalDeBandeiras(ctx, -0.04 * w, 0.33 * h, 1.04 * w, 0.3 * h,
    0.026 * h, 0.038 * h, 18, 6, t);

  // 10. o sol de junho -------------------------------------------------------
  ctx.fillStyle = 'rgba(255, 236, 180, 0.09)';
  ctx.fillRect(0, 0, w, h);
  const vinheta = ctx.createRadialGradient(
    w / 2, h * 0.5, w * 0.3,
    w / 2, h * 0.5, w * 0.85,
  );
  vinheta.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vinheta.addColorStop(1, 'rgba(20, 30, 40, 0.3)');
  ctx.fillStyle = vinheta;
  ctx.fillRect(0, 0, w, h);
}

/**
 * O acervo do quadro.
 *
 * Uma so por enquanto. Quando entrar a segunda, o painel ganha as setas para
 * folhear — hoje elas seriam um controle que nao leva a lugar nenhum.
 */
export const MEMORIAS: readonly MemoriaPintada[] = [
  {
    id: 'o-pedido',
    titulo: 'O pedido',
    lugar: 'onde a gente começou, oficialmente',
    legenda: 'As luzinhas iam até onde a gente não enxergava mais. A gente foi junto.',
    proporcao: 3 / 4,
    pintar: corredorDeLuzes,
  },
  {
    id: 'arraia',
    titulo: 'O arraiá da Hello Kitty',
    lugar: 'Parque Villa-Lobos, em junho',
    legenda: 'Um campo inteiro de brinquedo inflável, e a gente parado olhando com cara de criança.',
    proporcao: 3 / 4,
    pintar: arraiaDaHelloKitty,
  },
];
