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
  /**
   * A FLAG que destrava esta memória. Sem ela, a memória já está no quadro
   * desde o começo (as que vêm de foto). Com ela, só aparece depois de ganha
   * jogando — a das trinta ondas da estufa é a primeira.
   */
  readonly trava?: string;
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

/** a estufa da Josefina no fim da tarde — a memória das trinta ondas */
const ESTUFA = {
  vidroTopo: '#cfe6d2',
  vidroFundo: '#fff1c9',
  brilhoFundo: 'rgba(255, 226, 150, 0.55)',
  arco: '#eef3e6',
  arcoSombra: '#b9c7b1',
  chaoPerto: '#c7a57a',
  chaoLonge: '#e2c99c',
  terra: '#7a4f2e',
  borda: '#e6d2a8',
  folha: '#4f8f4a',
  folhaClara: '#79b35f',
  flor: '#b98ad6',
  ouro: '#f0c248',
  ouroEscuro: '#b98a1f',
  brilho: '#fff6cf',
  casco: '#8a7d3c',
  cascoPlaca: '#5f5424',
  contorno: '#3d3518',
  peleTartaruga: '#a8bd6a',
  gota: '#7fc8f0',
};

/**
 * AS TRINTA LEVAS — ganha jogando, e não de foto: a primeira vez que a dupla
 * vence as trinta ondas da estufa (`minigames/jardim/premios.ts`).
 *
 * Estrutura A (profundidade): os ARCOS da estufa fugindo para o fundo pelo
 * mesmo ponto de fuga do corredor de luzes, os canteiros dos dois lados, e
 * os dois de costas no corredor do meio erguendo o regador de ouro. A
 * Josefina assiste do lado. O que vive: o brilho do regador e as gotinhas
 * subindo.
 */
function trintaLevas(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
  const fundo = FUGA.y * h;

  // 1. o vidro do fundo e a luz da tarde entrando -------------------------
  const vidro = ctx.createLinearGradient(0, 0, 0, fundo + h * 0.1);
  vidro.addColorStop(0, ESTUFA.vidroTopo);
  vidro.addColorStop(1, ESTUFA.vidroFundo);
  ctx.fillStyle = vidro;
  ctx.fillRect(0, 0, w, h);
  const luz = ctx.createRadialGradient(FUGA.x * w, fundo, 0, FUGA.x * w, fundo, w * 0.28);
  luz.addColorStop(0, ESTUFA.brilhoFundo);
  luz.addColorStop(1, 'rgba(255, 226, 150, 0)');
  ctx.fillStyle = luz;
  ctx.fillRect(0, 0, w, h);

  // 2. o chão de saibro, do fundo para a frente ---------------------------
  const esq = projetar(-LADO, CHAO, 0, w, h);
  const dir = projetar(LADO, CHAO, 0, w, h);
  const chao = ctx.createLinearGradient(0, fundo, 0, h);
  chao.addColorStop(0, ESTUFA.chaoLonge);
  chao.addColorStop(1, ESTUFA.chaoPerto);
  ctx.fillStyle = chao;
  ctx.beginPath();
  ctx.moveTo(FUGA.x * w, fundo);
  ctx.lineTo(dir.x + w, h);
  ctx.lineTo(esq.x - w, h);
  ctx.closePath();
  ctx.fill();

  // 3. os canteiros dos dois lados, de trás para a frente -----------------
  for (let i = 9; i >= 0; i--) {
    const d0 = i * 0.075;
    const d1 = d0 + 0.055;
    for (const lado of [-1, 1]) {
      const perto = (x: number, y: number) => projetar(lado * x, y, d0, w, h);
      const longe = (x: number, y: number) => projetar(lado * x, y, d1, w, h);
      const ALTURA = 0.035;
      // a borda de madeira, depois a terra por cima
      ctx.fillStyle = ESTUFA.borda;
      ctx.beginPath();
      for (const p of [perto(0.2, CHAO), perto(0.55, CHAO), longe(0.55, CHAO), longe(0.2, CHAO)]) ctx.lineTo(p.x, p.y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = ESTUFA.terra;
      ctx.beginPath();
      for (const p of [perto(0.22, CHAO - ALTURA), perto(0.53, CHAO - ALTURA), longe(0.53, CHAO - ALTURA), longe(0.22, CHAO - ALTURA)]) ctx.lineTo(p.x, p.y);
      ctx.closePath();
      ctx.fill();
      // as mudas: três tufos por canteiro, e uma flor de vez em quando
      for (let k = 0; k < 3; k++) {
        const q = projetar(lado * (0.28 + k * 0.1), CHAO - ALTURA, d0 + 0.028, w, h);
        const r = 0.05 * encolhe(d0) * w;
        ctx.fillStyle = (i + k) % 2 ? ESTUFA.folha : ESTUFA.folhaClara;
        ctx.beginPath();
        ctx.arc(q.x, q.y - r * 0.6, r, 0, Math.PI * 2);
        ctx.fill();
        if ((i * 3 + k) % 4 === 0) {
          ctx.fillStyle = ESTUFA.flor;
          ctx.beginPath();
          ctx.arc(q.x + r * 0.3, q.y - r * 1.3, r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // 4. os ARCOS da estufa, do fundo para a frente -------------------------
  for (let i = 12; i >= 0; i--) {
    const d = i * 0.07;
    const f = encolhe(d);
    const pe = projetar(-LADO * 1.05, CHAO, d, w, h);
    const pe2 = projetar(LADO * 1.05, CHAO, d, w, h);
    const ombro = projetar(-LADO * 1.05, TOPO_PILAR, d, w, h);
    const raioX = (pe2.x - pe.x) / 2;
    const raioY = (TOPO_PILAR - TETO) * f * h * 1.05;
    ctx.lineCap = 'round';
    for (const [cor, larg] of [[ESTUFA.arcoSombra, 0.024], [ESTUFA.arco, 0.016]] as const) {
      ctx.strokeStyle = cor;
      ctx.lineWidth = Math.max(1.2, larg * f * w);
      ctx.beginPath();
      ctx.moveTo(pe.x, pe.y);
      ctx.lineTo(ombro.x, ombro.y);
      ctx.ellipse(ombro.x + raioX, ombro.y, raioX, raioY, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(pe2.x, pe2.y);
      ctx.stroke();
    }
  }

  // 6. os dois, de costas, erguendo o regador de ouro ---------------------
  const alt = 0.3 * h;
  const base = 0.97 * h;
  const ax = 0.43 * w;
  const rx = 0.57 * w;
  // os braços de dentro sobem até o regador (antes do tronco, como na silhueta)
  const regY = base - alt * 1.3;
  ctx.strokeStyle = CORES_DUPLA.ariPele;
  ctx.lineWidth = alt * 0.055;
  ctx.lineCap = 'round';
  // o braço sai do ombro de DENTRO e passa por fora da cabeça (o raio dela é
  // 0,11·alt): reto do meio do ombro, ele atravessava a cabeça e sumia
  ctx.beginPath();
  ctx.moveTo(ax + alt * 0.1, base - alt * 0.74);
  ctx.quadraticCurveTo(ax + alt * 0.17, base - alt * 0.95, w * 0.5 - 0.085 * w * 0.45, regY + 0.085 * w * 0.45);
  ctx.stroke();
  ctx.strokeStyle = CORES_DUPLA.renanPele;
  ctx.beginPath();
  ctx.moveTo(rx - alt * 0.1, base - alt * 0.74);
  ctx.quadraticCurveTo(rx - alt * 0.17, base - alt * 0.95, w * 0.5 + 0.085 * w * 0.45, regY + 0.085 * w * 0.45);
  ctx.stroke();
  silhueta(ctx, ax, base, alt, CORES_DUPLA.ariRoupa, CORES_DUPLA.ariCabelo, 0.3, CORES_DUPLA.ariPele);
  silhueta(ctx, rx, base, alt, CORES_DUPLA.renanRoupa, CORES_DUPLA.renanCabelo, -0.3, CORES_DUPLA.renanPele);

  // o regador de ouro, lá em cima
  const cx = 0.5 * w;
  const cy = regY;
  const s = 0.085 * w;
  ctx.fillStyle = ESTUFA.ouroEscuro;
  ctx.beginPath();
  ctx.moveTo(cx + s * 0.5, cy - s * 0.2);
  ctx.lineTo(cx + s * 1.35, cy - s * 0.95);
  ctx.lineTo(cx + s * 1.5, cy - s * 0.8);
  ctx.lineTo(cx + s * 0.6, cy + s * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = ESTUFA.ouro;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.62, cy + s * 0.5);
  ctx.lineTo(cx - s * 0.5, cy - s * 0.5);
  ctx.lineTo(cx + s * 0.5, cy - s * 0.5);
  ctx.lineTo(cx + s * 0.62, cy + s * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ESTUFA.ouroEscuro;
  ctx.lineWidth = s * 0.14;
  ctx.beginPath();
  ctx.arc(cx - s * 0.1, cy - s * 0.5, s * 0.42, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = ESTUFA.ouro;
  ctx.beginPath();
  ctx.ellipse(cx + s * 1.45, cy - s * 0.9, s * 0.18, s * 0.1, -0.7, 0, Math.PI * 2);
  ctx.fill();
  // o brilho que pisca na lata
  const pisca = 0.5 + 0.5 * Math.sin(t * 2.6);
  ctx.globalAlpha = 0.35 + 0.55 * pisca;
  ctx.fillStyle = ESTUFA.brilho;
  const bx = cx - s * 0.25;
  const by = cy - s * 0.1;
  const br = s * (0.28 + 0.12 * pisca);
  ctx.beginPath();
  ctx.moveTo(bx, by - br);
  ctx.lineTo(bx + br * 0.22, by);
  ctx.lineTo(bx, by + br);
  ctx.lineTo(bx - br * 0.22, by);
  ctx.closePath();
  ctx.moveTo(bx - br, by);
  ctx.lineTo(bx, by + br * 0.22);
  ctx.lineTo(bx + br, by);
  ctx.lineTo(bx, by - br * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // 7. as gotinhas subindo do regador, devagar ----------------------------
  ctx.fillStyle = ESTUFA.gota;
  for (let i = 0; i < 9; i++) {
    const fase = (t * 0.18 + i * 0.137) % 1;
    const gx = cx + Math.sin(i * 2.4 + t * 0.7) * s * (1.2 + i * 0.18);
    const gy = cy - s * 0.8 - fase * h * 0.3;
    const gr = s * 0.14 * (1 - fase * 0.4);
    ctx.globalAlpha = 0.85 * (1 - fase);
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.moveTo(gx - gr, gy);
    ctx.lineTo(gx, gy - gr * 2.1);
    ctx.lineTo(gx + gr, gy);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 7b. a Josefina, no corredor à direita, na frente de tudo: mais escura que
  //     as mudas e com contorno — verde no meio de canteiro some ----------
  const jx = 0.73 * w;
  const jy = 0.95 * h;
  const jr = 0.085 * w;
  ctx.fillStyle = ESTUFA.peleTartaruga;
  ctx.beginPath();
  ctx.ellipse(jx - jr * 1.05, jy - jr * 0.55, jr * 0.32, jr * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const px of [-0.6, 0.6]) {
    ctx.beginPath();
    ctx.ellipse(jx + px * jr, jy - jr * 0.05, jr * 0.2, jr * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = ESTUFA.casco;
  ctx.strokeStyle = ESTUFA.contorno;
  ctx.lineWidth = jr * 0.08;
  ctx.beginPath();
  ctx.ellipse(jx, jy - jr * 0.35, jr, jr * 0.62, 0, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = ESTUFA.cascoPlaca;
  for (const [ox, oy] of [[-0.45, -0.55], [0, -0.75], [0.45, -0.55]] as const) {
    ctx.beginPath();
    ctx.ellipse(jx + ox * jr, jy + oy * jr, jr * 0.22, jr * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 8. o banho de fim de tarde, e a vinheta -------------------------------
  ctx.fillStyle = 'rgba(255, 196, 110, 0.08)';
  ctx.fillRect(0, 0, w, h);
  const vinheta = ctx.createRadialGradient(w / 2, h * 0.5, w * 0.3, w / 2, h * 0.5, w * 0.85);
  vinheta.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vinheta.addColorStop(1, 'rgba(40, 50, 30, 0.3)');
  ctx.fillStyle = vinheta;
  ctx.fillRect(0, 0, w, h);
}

/** a festa dentro da abóbora — a memória do concurso de fantasias */
const FESTA = {
  polpaClara: '#ffc879',
  polpa: '#f5953a',
  polpaFunda: '#dc7322',
  nervura: '#b9581a',
  fiapo: '#ffe1a3',
  semente: '#fff4da',
  escuro: '#2a1210',
  lustre: '#3b2a1e',
  vela: '#fff1d0',
  chama: '#ffc25a',
  chamaMiolo: '#fff8e0',
  fio: '#4a2a1a',
  morcego: '#2b2033',
  tabua: '#7a4e33',
  tabuaClara: '#9c6a45',
  tabuaJunta: '#5a3622',
  saia: '#4a2a6e',
  saiaDobra: '#35204f',
  saiaLuz: '#5d3a86',
  barra: '#f39a3c',
  chao: '#4a2a1a',
  chaoLuz: '#7a4a2c',
  placa: '#f6e7c8',
  placaBorda: '#e8731f',
  placaLetra: '#5a2a17',
  plaquinha: '#f5861f',
  plaquinhaGomo: '#d0661a',
  cabinho: '#5b7a2c',
  vareta: '#8a6a48',
  coracao: '#e8435a',
  ouro: '#f2c14e',
  ouroSombra: '#c9952c',
  brilho: '#fff6cf',
  perola: '#fff3e2',
  pedraRoxa: '#9a52e0',
  arminho: '#8a63c4',
  arminhoPinta: '#2a1d3a',
  veludo: '#6e2a86',
  aboborinha: '#f5861f',
  traco: '#2a1d1a',
  bochecha: 'rgba(240, 110, 120, 0.5)',
  // as fantasias da dupla (as que a Estella costurou)
  capa: '#2a2233',
  capaForro: '#b8233f',
  colete: '#7a1f35',
  camisa: '#f6efe2',
  calca: '#26232c',
  feltro: '#3f3150',
  feltroClaro: '#54436a',
  barrigaDeMorcego: '#c9b2e6',
  membrana: '#6b5585',
  // os convidados
  la: '#f6efe2',
  laSombra: '#e2d7c4',
  caraDeOvelha: '#5b4a46',
  oculosDela: '#d8b45e',
  aranha: '#2c2236',
  aranhaListra: '#8a55c4',
  pinguim: '#39415a',
  pinguimBarriga: '#fbf4e8',
  bicoLaranja: '#f0a340',
  lencol: '#f3efe6',
  lencolDobra: '#d9d2c4',
  elefante: '#9a94a3',
  laco: '#f07ab0',
  girafa: '#f0c46a',
  girafaMancha: '#a9702c',
  girafaCasco: '#5b432c',
  cabeloDeNoiva: '#1e1a22',
  raio: '#f7f4ec',
  veu: 'rgba(250, 248, 255, 0.45)',
  raposa: '#e5793a',
  raposaClara: '#fff4e6',
  lobo: '#8f8a98',
  bandana: '#3f6fc6',
  jaleco: '#f7f5ef',
  peruPena: '#6b4a34',
  peruPenaClara: '#b98d5e',
  peruCabeca: '#8ba3b8',
  carunculo: '#d44a3f',
  oculosDeProtecao: '#4fb3b0',
  algodao: '#fbf8f2',
  casco: '#6d8a3f',
  escudo: '#53692f',
  peleDeTartaruga: '#92ab5c',
  espinho: '#e0603a',
  capivara: '#9c6a44',
  capivaraFocinho: '#4a3128',
  tubarao: '#7d93ad',
  tubaraoBarriga: '#e8eef2',
  pato: '#faf5e9',
  mascara: '#fffdf8',
  cartola: '#1c1820',
  capaDeOpera: '#5a1a2e',
  rosa: '#d0283f',
  cachorro: '#c98b52',
  cachorroOrelha: '#a96f3c',
  atadura: '#efe7d6',
  ataduraLinha: '#cbbfa6',
  gravata: '#c8283a',
  bandeja: '#c9ccd2',
  gato: '#f3ecdf',
  gatoCaramelo: '#cf8d5c',
  focinhoPreto: '#1f1b1d',
  coelhaLuna: '#d8d4de',
  coelhaSol: '#f0b27c',
  coelhaEstrella: '#8c6a55',
  orelhaDentro: '#f3a9ba',
  coruja: '#2c3a6e',
  corujaPena: '#3d4f8c',
  corujaOlho: '#f6d36a',
  lua: '#f9d45c',
  caveira: '#fbf7ee',
  tule: 'rgba(196, 226, 255, 0.55)',
  saiaDeEstrelas: '#1f2a5c',
  estrela: '#ffd84a',
};

const CONFETE = ['#f5c518', '#e8435a', '#7fd0f0', '#a069c4', '#7fd16a', '#ff9a3c', '#fff4da'];

const circulo = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, cor: string): void => {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

const elipse = (
  ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, cor: string, giro = 0,
): void => {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, giro, 0, Math.PI * 2);
  ctx.fill();
};

const poligono = (ctx: CanvasRenderingContext2D, pontos: ReadonlyArray<readonly [number, number]>, cor: string): void => {
  ctx.fillStyle = cor;
  ctx.beginPath();
  for (const [x, y] of pontos) ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
};

/**
 * A cara de foto: os olhinhos fechados de sorriso (dois "^"), a boca e as
 * bochechas. É a mesma para todo mundo de propósito — no "Xiiis!" ninguém
 * está de olho aberto, e é isso que faz a foto parecer de festa.
 */
function carinhaDeFoto(
  ctx: CanvasRenderingContext2D, x: number, y: number, r: number, boca = true, cor: string = FESTA.traco,
): void {
  ctx.strokeStyle = cor;
  ctx.lineWidth = Math.max(1.1, r * 0.13);
  ctx.lineCap = 'round';
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(x + lado * r * 0.38, y + r * 0.08, r * 0.15, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  if (boca) {
    ctx.beginPath();
    ctx.arc(x, y + r * 0.3, r * 0.17, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  }
  for (const lado of [-1, 1]) elipse(ctx, x + lado * r * 0.6, y + r * 0.34, r * 0.17, r * 0.1, FESTA.bochecha);
}

/**
 * Um bicho de frente, no corpinho chibi do jogo: os pés, o tronco e a cabeça
 * grande. Devolve onde a cabeça ficou, para cada um vestir a fantasia dele
 * por cima.
 */
function corpinho(
  ctx: CanvasRenderingContext2D, x: number, base: number, a: number, corpo: string, cabeca: string, pe: string = corpo,
): { hy: number; hr: number } {
  for (const lado of [-1, 1]) elipse(ctx, x + lado * a * 0.09, base - a * 0.035, a * 0.08, a * 0.045, pe);
  elipse(ctx, x, base - a * 0.28, a * 0.18, a * 0.24, corpo);
  const hy = base - a * 0.68;
  const hr = a * 0.22;
  circulo(ctx, x, hy, hr, cabeca);
  return { hy, hr };
}

/** o morceguinho de papel do varal (e o da coroa do rei) */
function morceguinho(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, cor: string, bate = 0): void {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.moveTo(x, y - r * 0.15);
  for (const lado of [-1, 1]) {
    ctx.moveTo(x, y - r * 0.25);
    ctx.lineTo(x + lado * r * 1.1, y - r * (0.55 + bate));
    ctx.lineTo(x + lado * r * 0.85, y + r * 0.05);
    ctx.lineTo(x + lado * r * 0.55, y - r * 0.1);
    ctx.lineTo(x + lado * r * 0.3, y + r * 0.2);
    ctx.lineTo(x, y + r * 0.1);
  }
  ctx.fill();
  circulo(ctx, x, y - r * 0.05, r * 0.32, cor);
  poligono(ctx, [[x - r * 0.28, y - r * 0.2], [x - r * 0.2, y - r * 0.6], [x - r * 0.05, y - r * 0.3]], cor);
  poligono(ctx, [[x + r * 0.28, y - r * 0.2], [x + r * 0.2, y - r * 0.6], [x + r * 0.05, y - r * 0.3]], cor);
}

/** a faísca de quatro pontas que pisca no ouro das coroas e na varinha */
function faisca(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alfa: number): void {
  if (alfa <= 0.02) return;
  ctx.globalAlpha = alfa;
  ctx.fillStyle = FESTA.brilho;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r * 0.22, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r * 0.22, y);
  ctx.closePath();
  ctx.moveTo(x - r, y);
  ctx.lineTo(x, y + r * 0.22);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y - r * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

/** uma estrelinha de cinco pontas cheia */
function estrelinha(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, cor: string): void {
  ctx.fillStyle = cor;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * A coroa de rainha do Ari: o aro de ouro, as pontas em ARCO (os flancos
 * côncavos, como a peça 3D), uma pérola em cada ponta, as pedrinhas roxas no
 * aro e a aboborinha na frente.
 */
function coroaDaRainha(ctx: CanvasRenderingContext2D, x: number, y: number, larg: number, t: number): void {
  const alto = larg * 0.2;
  const ponta = larg * 0.42;
  const n = 5;
  const passo = larg / n;
  ctx.fillStyle = FESTA.ouro;
  ctx.beginPath();
  ctx.moveTo(x - larg / 2, y);
  ctx.lineTo(x - larg / 2, y - alto);
  for (let i = 0; i < n; i++) {
    const x0 = x - larg / 2 + i * passo;
    const meio = x0 + passo / 2;
    const p = ponta * (i === 2 ? 1.15 : i === 1 || i === 3 ? 0.95 : 0.8);
    ctx.quadraticCurveTo(meio - passo * 0.08, y - alto - p * 0.4, meio, y - alto - p);
    ctx.quadraticCurveTo(meio + passo * 0.08, y - alto - p * 0.4, x0 + passo, y - alto);
  }
  ctx.lineTo(x + larg / 2, y);
  ctx.closePath();
  ctx.fill();
  // o lado de baixo do aro, um degrau mais escuro
  ctx.fillStyle = FESTA.ouroSombra;
  ctx.fillRect(x - larg / 2, y - alto * 0.35, larg, alto * 0.35);
  for (let i = 0; i < n; i++) {
    const meio = x - larg / 2 + i * passo + passo / 2;
    const p = ponta * (i === 2 ? 1.15 : i === 1 || i === 3 ? 0.95 : 0.8);
    circulo(ctx, meio, y - alto - p, larg * 0.05, FESTA.perola);
    if (i !== 2) circulo(ctx, meio, y - alto * 0.55, larg * 0.04, FESTA.pedraRoxa);
  }
  // a aboborinha na frente
  const ay = y - alto * 0.6;
  elipse(ctx, x, ay, larg * 0.1, larg * 0.08, FESTA.aboborinha);
  ctx.strokeStyle = FESTA.plaquinhaGomo;
  ctx.lineWidth = Math.max(1, larg * 0.012);
  ctx.beginPath();
  ctx.moveTo(x, ay - larg * 0.07);
  ctx.lineTo(x, ay + larg * 0.07);
  ctx.stroke();
  ctx.fillStyle = FESTA.cabinho;
  ctx.fillRect(x - larg * 0.012, ay - larg * 0.11, larg * 0.024, larg * 0.04);
  faisca(ctx, x + larg * 0.28, y - alto - ponta * 0.7, larg * 0.11, Math.max(0, Math.sin(t * 2.1)));
  faisca(ctx, x - larg * 0.32, y - alto * 0.5, larg * 0.08, Math.max(0, Math.sin(t * 2.1 + 2.4)));
}

/**
 * A coroa de rei do Renan: a cúpula de veludo por trás, as pontas retas com
 * bolinha, o arminho roxo com as pintinhas embaixo e o morceguinho de feltro
 * na frente.
 */
function coroaDoRei(ctx: CanvasRenderingContext2D, x: number, y: number, larg: number, t: number): void {
  const alto = larg * 0.3;
  elipse(ctx, x, y - alto * 0.9, larg * 0.42, larg * 0.34, FESTA.veludo);
  const n = 4;
  ctx.fillStyle = FESTA.ouro;
  ctx.beginPath();
  ctx.moveTo(x - larg / 2, y);
  ctx.lineTo(x - larg / 2, y - alto - larg * 0.28);
  for (let i = 1; i <= n; i++) {
    const xi = x - larg / 2 + (i * larg) / n;
    ctx.lineTo(xi - larg / n / 2, y - alto * 0.85);
    ctx.lineTo(xi, y - alto - larg * 0.28);
  }
  ctx.lineTo(x + larg / 2, y);
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i <= n; i++) circulo(ctx, x - larg / 2 + (i * larg) / n, y - alto - larg * 0.3, larg * 0.055, FESTA.ouro);
  // o arminho, gordinho, por baixo de tudo
  ctx.fillStyle = FESTA.arminho;
  ctx.beginPath();
  ctx.roundRect(x - larg * 0.56, y - larg * 0.1, larg * 1.12, larg * 0.2, larg * 0.1);
  ctx.fill();
  for (let i = 0; i < 6; i++) {
    const px = x - larg * 0.45 + i * larg * 0.18;
    elipse(ctx, px, y - larg * 0.005 + (i % 2) * larg * 0.03, larg * 0.018, larg * 0.032, FESTA.arminhoPinta);
  }
  morceguinho(ctx, x, y - alto * 0.62, larg * 0.14, FESTA.morcego);
  faisca(ctx, x - larg * 0.3, y - alto - larg * 0.2, larg * 0.1, Math.max(0, Math.sin(t * 1.9 + 1.2)));
  faisca(ctx, x + larg * 0.4, y - alto * 0.5, larg * 0.08, Math.max(0, Math.sin(t * 1.9 + 3.7)));
}

/** o Ari, de frente, de vampiro, com a coroa de rainha */
function ariDeVampiro(ctx: CanvasRenderingContext2D, x: number, base: number, a: number, t: number): void {
  // a capa por trás, aberta, mostrando o forro vermelho
  poligono(ctx, [[x - a * 0.16, base - a * 0.5], [x - a * 0.3, base - a * 0.06], [x + a * 0.3, base - a * 0.06], [x + a * 0.16, base - a * 0.5]], FESTA.capa);
  poligono(ctx, [[x - a * 0.13, base - a * 0.48], [x - a * 0.24, base - a * 0.09], [x + a * 0.24, base - a * 0.09], [x + a * 0.13, base - a * 0.48]], FESTA.capaForro);
  // as pernas e o corpo
  for (const lado of [-1, 1]) {
    ctx.fillStyle = FESTA.calca;
    ctx.fillRect(x + lado * a * 0.075 - a * 0.045, base - a * 0.2, a * 0.09, a * 0.18);
    elipse(ctx, x + lado * a * 0.08, base - a * 0.025, a * 0.07, a * 0.035, FESTA.calca);
  }
  ctx.fillStyle = FESTA.camisa;
  ctx.beginPath();
  ctx.roundRect(x - a * 0.13, base - a * 0.5, a * 0.26, a * 0.32, a * 0.07);
  ctx.fill();
  poligono(ctx, [[x - a * 0.13, base - a * 0.42], [x - a * 0.025, base - a * 0.3], [x - a * 0.04, base - a * 0.19], [x - a * 0.13, base - a * 0.19]], FESTA.colete);
  poligono(ctx, [[x + a * 0.13, base - a * 0.42], [x + a * 0.025, base - a * 0.3], [x + a * 0.04, base - a * 0.19], [x + a * 0.13, base - a * 0.19]], FESTA.colete);
  // os braços da capa caindo dos ombros
  for (const lado of [-1, 1]) {
    poligono(ctx, [[x + lado * a * 0.12, base - a * 0.5], [x + lado * a * 0.22, base - a * 0.46], [x + lado * a * 0.21, base - a * 0.22], [x + lado * a * 0.13, base - a * 0.24]], FESTA.capa);
  }
  // a gola alta da capa, atrás da cabeça
  for (const lado of [-1, 1]) {
    poligono(ctx, [[x + lado * a * 0.06, base - a * 0.5], [x + lado * a * 0.26, base - a * 0.72], [x + lado * a * 0.2, base - a * 0.5]], FESTA.capaForro);
  }
  // o cabelo cacheado, volumoso: a massa de trás, o rosto, e os cachos da frente
  const hy = base - a * 0.71;
  const hr = a * 0.2;
  for (let i = 0; i < 11; i++) {
    const ang = Math.PI * (0.92 + (i / 10) * 1.16);
    circulo(ctx, x + Math.cos(ang) * hr * 1.05, hy + Math.sin(ang) * hr * 0.95 + hr * 0.15, hr * 0.42, CORES_DUPLA.ariCabelo);
  }
  circulo(ctx, x, hy + hr * 0.08, hr * 0.92, CORES_DUPLA.ariPele);
  for (let i = 0; i < 6; i++) {
    circulo(ctx, x - hr * 0.62 + i * hr * 0.25, hy - hr * 0.62 + Math.abs(i - 2.5) * hr * 0.06, hr * 0.27, CORES_DUPLA.ariCabelo);
  }
  carinhaDeFoto(ctx, x, hy + hr * 0.12, hr * 0.85);
  coroaDaRainha(ctx, x, hy - hr * 0.72, hr * 1.25, t);
}

/**
 * As asinhas abertas do Renan, de bainha recortada, batendo devagar. Saem do
 * corpo dele porque vão ATRÁS do Ari: desenhadas junto com ele, a da esquerda
 * tapava a capa do vampiro.
 */
function asinhasDoRenan(ctx: CanvasRenderingContext2D, x: number, base: number, a: number, t: number): void {
  const bate = Math.sin(t * 2.2) * 0.04;
  for (const lado of [-1, 1]) {
    ctx.fillStyle = FESTA.membrana;
    ctx.beginPath();
    ctx.moveTo(x + lado * a * 0.1, base - a * 0.48);
    ctx.lineTo(x + lado * a * 0.42, base - a * (0.6 + bate));
    ctx.lineTo(x + lado * a * 0.4, base - a * 0.36);
    ctx.lineTo(x + lado * a * 0.32, base - a * 0.4);
    ctx.lineTo(x + lado * a * 0.27, base - a * 0.3);
    ctx.lineTo(x + lado * a * 0.19, base - a * 0.35);
    ctx.lineTo(x + lado * a * 0.12, base - a * 0.26);
    ctx.closePath();
    ctx.fill();
  }
}

/** o Renan, de frente, de morceguinho, com a coroa de rei (as asinhas vão antes, por `asinhasDoRenan`) */
function renanDeMorceguinho(ctx: CanvasRenderingContext2D, x: number, base: number, a: number, t: number): void {
  for (const lado of [-1, 1]) {
    ctx.fillStyle = FESTA.feltro;
    ctx.fillRect(x + lado * a * 0.075 - a * 0.045, base - a * 0.2, a * 0.09, a * 0.18);
    elipse(ctx, x + lado * a * 0.08, base - a * 0.025, a * 0.07, a * 0.035, FESTA.calca);
  }
  ctx.fillStyle = FESTA.feltro;
  ctx.beginPath();
  ctx.roundRect(x - a * 0.15, base - a * 0.51, a * 0.3, a * 0.33, a * 0.09);
  ctx.fill();
  elipse(ctx, x, base - a * 0.33, a * 0.085, a * 0.11, FESTA.barrigaDeMorcego);
  for (const lado of [-1, 1]) {
    ctx.fillStyle = FESTA.feltroClaro;
    ctx.beginPath();
    ctx.roundRect(x + lado * a * 0.17 - a * 0.04, base - a * 0.48, a * 0.08, a * 0.24, a * 0.04);
    ctx.fill();
  }
  // a cabeça: o rosto e os cachos curtos e escuros por cima
  const hy = base - a * 0.71;
  const hr = a * 0.19;
  circulo(ctx, x, hy + hr * 0.05, hr, CORES_DUPLA.renanPele);
  for (let i = 0; i < 7; i++) {
    const ang = Math.PI * (1.0 + (i / 6) * 1.0);
    circulo(ctx, x + Math.cos(ang) * hr * 0.82, hy + Math.sin(ang) * hr * 0.72 - hr * 0.05, hr * 0.3, CORES_DUPLA.renanCabelo);
  }
  carinhaDeFoto(ctx, x, hy + hr * 0.14, hr * 0.85);
  coroaDoRei(ctx, x, hy - hr * 0.62, hr * 1.05, t);
}

/** a plaquinha de voto: a abóbora de chapa na vareta, com a carinha e o coração */
function plaquinhaDeVoto(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, giro: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(giro);
  ctx.fillStyle = FESTA.vareta;
  ctx.fillRect(-r * 0.08, 0, r * 0.16, r * 2.3);
  elipse(ctx, 0, 0, r * 1.15, r, FESTA.plaquinha);
  ctx.strokeStyle = FESTA.plaquinhaGomo;
  ctx.lineWidth = Math.max(1, r * 0.1);
  for (const dx of [-0.45, 0.45]) {
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(dx) * r * 1.15, r * 0.95, 0, -Math.PI / 2, Math.PI / 2, dx < 0);
    ctx.stroke();
  }
  ctx.fillStyle = FESTA.cabinho;
  ctx.fillRect(-r * 0.12, -r * 1.25, r * 0.24, r * 0.35);
  // o coração no meio da chapa
  ctx.fillStyle = FESTA.coracao;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.45);
  ctx.bezierCurveTo(-r * 0.75, -r * 0.05, -r * 0.35, -r * 0.6, 0, -r * 0.22);
  ctx.bezierCurveTo(r * 0.35, -r * 0.6, r * 0.75, -r * 0.05, 0, r * 0.45);
  ctx.fill();
  ctx.restore();
}

/** um coelhinho das três irmãs: as orelhas compridas, o corpinho e o focinho */
function coelhinha(
  ctx: CanvasRenderingContext2D, x: number, base: number, a: number, pelo: string, roupa: string,
): { hy: number; hr: number } {
  for (const lado of [-1, 1]) {
    elipse(ctx, x + lado * a * 0.1, base - a * 1.0, a * 0.065, a * 0.2, pelo, lado * 0.18);
    elipse(ctx, x + lado * a * 0.1, base - a * 0.99, a * 0.032, a * 0.14, FESTA.orelhaDentro, lado * 0.18);
  }
  const c = corpinho(ctx, x, base, a, roupa, pelo, pelo);
  circulo(ctx, x, c.hy + c.hr * 0.3, c.hr * 0.11, FESTA.orelhaDentro);
  return c;
}

/**
 * A RAINHA E O REI DA FESTA — ganha jogando: a foto de todos no fim do
 * concurso de fantasias, no salão de dentro da abóbora gigante
 * (`eventos/halloween/noSalao.ts`, a flag `FLAG_DA_FOTO`).
 *
 * Estrutura B (frontal): é uma foto de grupo, posada, e foto de grupo é reta.
 * De trás para a frente: a parede de polpa com os gomos subindo para o
 * cabinho, o lustre de velas, o varal de morceguinhos, a placa do concurso,
 * quem ficou atrás no tablado, o tablado com a dupla coroada no meio, a saia
 * de veludo, e a fileira da frente no chão — o Walter no meio, como no jogo.
 * Todo mundo de olho fechado de sorriso: é o "Xiiis!".
 *
 * O que vive: as chamas das velas, o confete caindo, as faíscas nas coroas e
 * na varinha da Estrella, as plaquinhas balançando — e o flash, que estoura
 * branco quando o quadro abre e some em menos de um segundo.
 */
function rainhaEReiDaFesta(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
  const PALCO = 0.655 * h;
  const SAIA = 0.785 * h;

  // 1. a polpa da abóbora, acesa pelo lustre no alto ------------------------
  const polpa = ctx.createRadialGradient(0.5 * w, 0.2 * h, 0, 0.5 * w, 0.35 * h, 0.85 * h);
  polpa.addColorStop(0, FESTA.polpaClara);
  polpa.addColorStop(0.35, FESTA.polpa);
  polpa.addColorStop(0.75, FESTA.polpaFunda);
  polpa.addColorStop(1, FESTA.escuro);
  ctx.fillStyle = polpa;
  ctx.fillRect(0, 0, w, h);

  // os gomos: nervuras subindo do chão e fechando lá em cima, no cabinho
  ctx.lineCap = 'round';
  for (let i = -6; i <= 6; i++) {
    const pe = 0.5 + i * 0.16;
    const bojo = 0.5 + i * 0.13;
    ctx.strokeStyle = FESTA.nervura;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 0.014 * w;
    ctx.beginPath();
    ctx.moveTo(pe * w, 0.8 * h);
    ctx.quadraticCurveTo(bojo * w, 0.18 * h, 0.5 * w, -0.04 * h);
    ctx.stroke();
    // o lado aceso de cada gomo, logo ao lado da nervura
    ctx.strokeStyle = FESTA.polpaClara;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 0.02 * w;
    ctx.beginPath();
    ctx.moveTo((pe + 0.075) * w, 0.8 * h);
    ctx.quadraticCurveTo((bojo + 0.06) * w, 0.2 * h, 0.5 * w, -0.04 * h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // um punhado de fiapos e sementes no alto, poucos e quietos
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 9; i++) {
    const sx = (0.08 + ((i * 0.618) % 1) * 0.84) * w;
    const sy = (0.02 + ((i * 0.377) % 1) * 0.07) * h;
    elipse(ctx, sx, sy, 0.006 * w, 0.011 * w, i % 3 ? FESTA.fiapo : FESTA.semente, i * 0.7);
  }
  ctx.globalAlpha = 1;

  // 2. o lustre de velas no meio do teto -----------------------------------
  const lx = 0.5 * w;
  const ly = 0.105 * h;
  ctx.strokeStyle = FESTA.fio;
  ctx.lineWidth = Math.max(1, 0.006 * w);
  ctx.beginPath();
  ctx.moveTo(lx, 0);
  ctx.lineTo(lx, ly);
  ctx.stroke();
  // halos primeiro (são os gradientes caros: só sete)
  const VELAS = 7;
  const velas: Array<{ x: number; y: number; f: number }> = [];
  for (let i = 0; i < VELAS; i++) {
    const ang = Math.PI * (0.08 + (i / (VELAS - 1)) * 0.84);
    const vx = lx - Math.cos(ang) * 0.12 * w;
    const vy = ly + Math.sin(ang) * 0.022 * h - 0.012 * h;
    const f = 1 + 0.16 * Math.sin(t * 9 + i * 1.7) + 0.08 * Math.sin(t * 23 + i);
    velas.push({ x: vx, y: vy, f });
    const halo = ctx.createRadialGradient(vx, vy - 0.02 * h, 0, vx, vy - 0.02 * h, 0.07 * w * f);
    halo.addColorStop(0, 'rgba(255, 214, 140, 0.55)');
    halo.addColorStop(1, 'rgba(255, 190, 110, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(vx, vy - 0.02 * h, 0.07 * w * f, 0, Math.PI * 2);
    ctx.fill();
  }
  // o aro, a metade de trás, as velas e a metade da frente
  ctx.strokeStyle = FESTA.lustre;
  ctx.lineWidth = 0.012 * w;
  ctx.beginPath();
  ctx.ellipse(lx, ly, 0.13 * w, 0.025 * h, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  for (const v of velas) {
    ctx.fillStyle = FESTA.vela;
    ctx.fillRect(v.x - 0.007 * w, v.y - 0.026 * h, 0.014 * w, 0.026 * h);
    elipse(ctx, v.x, v.y - 0.035 * h, 0.009 * w, 0.014 * h * v.f, FESTA.chama);
    elipse(ctx, v.x, v.y - 0.032 * h, 0.004 * w, 0.007 * h * v.f, FESTA.chamaMiolo);
  }
  ctx.beginPath();
  ctx.ellipse(lx, ly, 0.13 * w, 0.025 * h, 0, 0, Math.PI);
  ctx.stroke();

  // 3. o varal de morceguinhos, do lustre às paredes -----------------------
  for (const lado of [-1, 1]) {
    const x0 = lx + lado * 0.13 * w;
    const x1 = lx + lado * 0.56 * w;
    const y0 = ly;
    const y1 = 0.15 * h;
    const meioY = 0.25 * h;
    ctx.strokeStyle = FESTA.fio;
    ctx.lineWidth = Math.max(1, 0.004 * w);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) / 2, meioY, x1, y1);
    ctx.stroke();
    for (let k = 1; k <= 5; k++) {
      const u = k / 6;
      const bx = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * ((x0 + x1) / 2) + u * u * x1;
      const by = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * meioY + u * u * y1;
      morceguinho(ctx, bx, by + 0.016 * h, 0.022 * w, FESTA.morcego, 0.12 * Math.sin(t * 3 + k * 1.3 + lado));
    }
  }

  // 4. a placa do concurso, pendurada do lustre ----------------------------
  const px = 0.5 * w;
  const py = 0.235 * h;
  const pl = 0.4 * w;
  const pa = 0.085 * h;
  ctx.strokeStyle = FESTA.fio;
  ctx.lineWidth = Math.max(1, 0.004 * w);
  ctx.beginPath();
  ctx.moveTo(px - pl * 0.3, py - pa / 2);
  ctx.lineTo(lx - 0.06 * w, ly + 0.012 * h);
  ctx.moveTo(px + pl * 0.3, py - pa / 2);
  ctx.lineTo(lx + 0.06 * w, ly + 0.012 * h);
  ctx.stroke();
  ctx.fillStyle = FESTA.placaBorda;
  ctx.beginPath();
  ctx.roundRect(px - pl / 2, py - pa / 2, pl, pa, pa * 0.22);
  ctx.fill();
  ctx.fillStyle = FESTA.placa;
  ctx.beginPath();
  ctx.roundRect(px - pl / 2 + pa * 0.09, py - pa / 2 + pa * 0.09, pl - pa * 0.18, pa * 0.82, pa * 0.16);
  ctx.fill();
  ctx.fillStyle = FESTA.placaLetra;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${Math.round(pa * 0.4)}px system-ui, sans-serif`;
  ctx.fillText('CONCURSO', px, py - pa * 0.12);
  ctx.font = `italic 600 ${Math.round(pa * 0.26)}px Georgia, serif`;
  ctx.fillText('de fantasias', px, py + pa * 0.24);

  // 5. o tampo do tablado, onde fica quem sobe ------------------------------
  const tampo = ctx.createLinearGradient(0, PALCO - 0.06 * h, 0, PALCO + 0.02 * h);
  tampo.addColorStop(0, FESTA.tabua);
  tampo.addColorStop(1, FESTA.tabuaClara);
  ctx.fillStyle = tampo;
  ctx.beginPath();
  ctx.moveTo(0.06 * w, PALCO - 0.055 * h);
  ctx.lineTo(0.94 * w, PALCO - 0.055 * h);
  ctx.lineTo(1.0 * w, PALCO + 0.02 * h);
  ctx.lineTo(0, PALCO + 0.02 * h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = FESTA.tabuaJunta;
  ctx.lineWidth = Math.max(1, 0.003 * w);
  for (let k = 1; k < 4; k++) {
    const y = PALCO - 0.055 * h + k * 0.019 * h;
    ctx.beginPath();
    ctx.moveTo(0.06 * w - k * 0.015 * w, y);
    ctx.lineTo(0.94 * w + k * 0.015 * w, y);
    ctx.stroke();
  }

  // 6. quem ficou atrás, no fundo do tablado -------------------------------
  const atras = PALCO - 0.04 * h;

  // o Cookie de lençol: o maior, então fica no canto do fundo
  {
    const x = 0.88 * w;
    const a = 0.3 * h;
    const larg = 0.105 * w;
    for (const lado of [-1, 1]) elipse(ctx, x + lado * larg * 1.02, atras - a * 0.7, larg * 0.32, larg * 0.42, FESTA.lencolDobra);
    ctx.fillStyle = FESTA.lencol;
    ctx.beginPath();
    ctx.moveTo(x - larg * 1.05, atras);
    ctx.lineTo(x - larg * 0.95, atras - a * 0.62);
    ctx.quadraticCurveTo(x - larg, atras - a * 1.02, x, atras - a * 1.02);
    ctx.quadraticCurveTo(x + larg, atras - a * 1.02, x + larg * 0.95, atras - a * 0.62);
    ctx.lineTo(x + larg * 1.05, atras);
    for (let k = 5; k >= 0; k--) {
      const bx = x - larg * 1.05 + (k / 5) * larg * 2.1;
      ctx.quadraticCurveTo(bx + larg * 0.21, atras + 0.012 * h * (k % 2 ? 1 : -0.4), bx, atras);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = FESTA.lencolDobra;
    ctx.lineWidth = 0.006 * w;
    for (const dx of [-0.55, 0.1, 0.6]) {
      ctx.beginPath();
      ctx.moveTo(x + dx * larg, atras - a * 0.45);
      ctx.quadraticCurveTo(x + dx * larg * 1.15, atras - a * 0.2, x + dx * larg * 0.95, atras);
      ctx.stroke();
    }
    const oy = atras - a * 0.78;
    for (const lado of [-1, 1]) elipse(ctx, x + lado * larg * 0.32, oy, larg * 0.11, larg * 0.15, FESTA.traco);
    // a tromba saindo pelo furo, com o laço na ponta
    elipse(ctx, x, oy + larg * 0.32, larg * 0.14, larg * 0.11, FESTA.traco);
    ctx.strokeStyle = FESTA.elefante;
    ctx.lineWidth = larg * 0.2;
    ctx.beginPath();
    ctx.moveTo(x, oy + larg * 0.32);
    ctx.quadraticCurveTo(x - larg * 0.05, oy + larg * 0.9, x + larg * 0.3, oy + larg * 1.0 + Math.sin(t * 1.6) * larg * 0.04);
    ctx.stroke();
    morceguinho(ctx, x + larg * 0.38, oy + larg * 0.98, larg * 0.2, FESTA.laco, 0.3);
  }

  // a Gina, de noiva do Frankenstein: o pescoção e o cabelo altíssimo
  {
    const x = 0.1 * w;
    const a = 0.18 * h;
    // o corpinho sem a cabeça de sempre: a dela mora lá em cima do pescoço
    for (const lado of [-1, 1]) elipse(ctx, x + lado * a * 0.09, atras - a * 0.035, a * 0.08, a * 0.045, FESTA.girafaCasco);
    elipse(ctx, x, atras - a * 0.28, a * 0.18, a * 0.24, FESTA.girafa);
    for (const [dx, dy] of [[-0.08, 0.3], [0.09, 0.22], [0.0, 0.4]] as const) {
      elipse(ctx, x + dx * a, atras - dy * a, a * 0.05, a * 0.04, FESTA.girafaMancha);
    }
    const topo = atras - a * 1.55;
    // o véu de gaze, por trás de tudo da cabeça
    ctx.fillStyle = FESTA.veu;
    ctx.beginPath();
    ctx.moveTo(x - a * 0.05, topo - a * 0.25);
    ctx.lineTo(x - a * 0.32, atras - a * 0.4);
    ctx.lineTo(x + a * 0.34, atras - a * 0.45);
    ctx.lineTo(x + a * 0.08, topo - a * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = FESTA.girafa;
    ctx.fillRect(x - a * 0.07, topo, a * 0.14, atras - a * 0.85 - topo);
    for (let k = 0; k < 3; k++) {
      elipse(ctx, x + (k % 2 ? 0.03 : -0.03) * a, topo + a * (0.3 + k * 0.28), a * 0.04, a * 0.035, FESTA.girafaMancha);
      circulo(ctx, x + a * 0.075, topo + a * (0.22 + k * 0.28), a * 0.022, FESTA.lobo);
    }
    const hy = topo;
    elipse(ctx, x, hy, a * 0.17, a * 0.15, FESTA.girafa);
    // o cabelo de noiva: a torre preta com os dois raios brancos
    ctx.fillStyle = FESTA.cabeloDeNoiva;
    ctx.beginPath();
    ctx.roundRect(x - a * 0.11, hy - a * 0.55, a * 0.22, a * 0.45, a * 0.1);
    ctx.fill();
    elipse(ctx, x, hy - a * 0.5, a * 0.14, a * 0.09, FESTA.cabeloDeNoiva);
    ctx.strokeStyle = FESTA.raio;
    ctx.lineWidth = a * 0.03;
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + lado * a * 0.06, hy - a * 0.12);
      ctx.lineTo(x + lado * a * 0.02, hy - a * 0.27);
      ctx.lineTo(x + lado * a * 0.07, hy - a * 0.34);
      ctx.lineTo(x + lado * a * 0.03, hy - a * 0.5);
      ctx.stroke();
    }
    for (const lado of [-1, 1]) {
      ctx.fillStyle = FESTA.girafa;
      ctx.fillRect(x + lado * a * 0.15 - a * 0.015, hy - a * 0.24, a * 0.03, a * 0.14);
      circulo(ctx, x + lado * a * 0.15, hy - a * 0.25, a * 0.03, FESTA.girafaCasco);
    }
    carinhaDeFoto(ctx, x, hy, a * 0.15);
  }

  // o Flynn de lobisomem, alto, espiando por cima do ombro da Estella
  {
    const x = 0.185 * w;
    const a = 0.2 * h;
    const { hy, hr } = corpinho(ctx, x, atras, a, FESTA.lobo, FESTA.raposa, FESTA.raposa);
    elipse(ctx, x, atras - a * 0.34, a * 0.1, a * 0.12, FESTA.raposaClara);
    poligono(ctx, [[x - a * 0.13, atras - a * 0.5], [x + a * 0.13, atras - a * 0.5], [x, atras - a * 0.38]], FESTA.bandana);
    for (const lado of [-1, 1]) {
      poligono(ctx, [[x + lado * hr * 0.25, hy - hr * 0.7], [x + lado * hr * 0.95, hy - hr * 1.5], [x + lado * hr * 0.95, hy - hr * 0.35]], FESTA.raposa);
      poligono(ctx, [[x + lado * hr * 0.45, hy - hr * 0.8], [x + lado * hr * 1.15, hy - hr * 1.35], [x + lado * hr * 1.0, hy - hr * 0.5]], FESTA.lobo);
    }
    elipse(ctx, x, hy + hr * 0.4, hr * 0.55, hr * 0.42, FESTA.raposaClara);
    circulo(ctx, x, hy + hr * 0.22, hr * 0.12, FESTA.traco);
    carinhaDeFoto(ctx, x, hy, hr, false);
  }

  // o Noel de cientista: o leque de penas, o jaleco e os óculos na testa
  {
    const x = 0.79 * w;
    const a = 0.19 * h;
    for (let k = 0; k < 7; k++) {
      const ang = Math.PI * (1.1 + (k / 6) * 0.8);
      elipse(ctx, x + Math.cos(ang) * a * 0.32, atras - a * 0.45 + Math.sin(ang) * a * 0.32, a * 0.07, a * 0.2,
        k % 2 ? FESTA.peruPena : FESTA.peruPenaClara, ang + Math.PI / 2);
    }
    const { hy, hr } = corpinho(ctx, x, atras, a, FESTA.jaleco, FESTA.peruCabeca, FESTA.bicoLaranja);
    for (const [dx, cor] of [[-0.07, '#7fd16a'], [-0.03, '#e8435a'], [0.01, '#7fd0f0']] as const) {
      ctx.fillStyle = cor;
      ctx.fillRect(x + dx * a, atras - a * 0.42, a * 0.025, a * 0.09);
    }
    for (let k = 0; k < 4; k++) circulo(ctx, x - hr * 0.45 + k * hr * 0.3, hy - hr * 0.95, hr * 0.28, FESTA.algodao);
    for (const lado of [-1, 1]) {
      circulo(ctx, x + lado * hr * 0.36, hy - hr * 0.45, hr * 0.26, FESTA.lustre);
      circulo(ctx, x + lado * hr * 0.36, hy - hr * 0.45, hr * 0.18, FESTA.oculosDeProtecao);
    }
    poligono(ctx, [[x - hr * 0.2, hy + hr * 0.15], [x + hr * 0.2, hy + hr * 0.15], [x, hy + hr * 0.45]], FESTA.bicoLaranja);
    elipse(ctx, x + hr * 0.12, hy + hr * 0.62, hr * 0.1, hr * 0.22, FESTA.carunculo);
    carinhaDeFoto(ctx, x, hy - hr * 0.05, hr * 0.9, false);
  }

  // 7. a fileira do tablado: a Estella, a dupla coroada e o Mano ------------
  // a Estella de aranha, ao lado do Ari (no jogo ela fica ali, apresentando)
  {
    const x = 0.275 * w;
    const a = 0.19 * h;
    const base = PALCO;
    ctx.lineCap = 'round';
    for (const lado of [-1, 1]) {
      for (const k of [0, 1]) {
        const y0 = base - a * (0.38 - k * 0.1);
        const jx = x + lado * a * (0.36 + k * 0.04);
        const jy = y0 - a * (0.12 - k * 0.04);
        for (const [cor, larg] of [[FESTA.aranha, 0.06], [FESTA.aranhaListra, 0.025]] as const) {
          ctx.strokeStyle = cor;
          ctx.lineWidth = a * larg;
          ctx.setLineDash(cor === FESTA.aranhaListra ? [a * 0.03, a * 0.05] : []);
          ctx.beginPath();
          ctx.moveTo(x + lado * a * 0.12, y0);
          ctx.lineTo(jx, jy);
          ctx.lineTo(jx + lado * a * 0.06, y0 + a * 0.16);
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]);
    corpinho(ctx, x, base, a, FESTA.aranha, FESTA.la, FESTA.aranha);
    const hy = base - a * 0.68;
    const hr = a * 0.22;
    for (let i = 0; i < 9; i++) {
      const ang = (i / 9) * Math.PI * 2;
      circulo(ctx, x + Math.cos(ang) * hr * 0.85, hy + Math.sin(ang) * hr * 0.85, hr * 0.38, i % 2 ? FESTA.la : FESTA.laSombra);
    }
    elipse(ctx, x, hy + hr * 0.15, hr * 0.6, hr * 0.7, FESTA.caraDeOvelha);
    carinhaDeFoto(ctx, x, hy + hr * 0.1, hr * 0.62, true, FESTA.la);
    ctx.strokeStyle = FESTA.oculosDela;
    ctx.lineWidth = Math.max(1, hr * 0.08);
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(x + lado * hr * 0.24, hy + hr * 0.12, hr * 0.18, 0, Math.PI * 2);
      ctx.stroke();
    }
    // a tiara de olhinhos de aranha
    for (let k = 0; k < 4; k++) {
      const ox = x - hr * 0.45 + k * hr * 0.3;
      circulo(ctx, ox, hy - hr * 0.95, hr * 0.13, FESTA.camisa);
      circulo(ctx, ox, hy - hr * 0.93, hr * 0.07, FESTA.traco);
    }
  }

  asinhasDoRenan(ctx, 0.585 * w, PALCO, 0.27 * h, t);
  ariDeVampiro(ctx, 0.425 * w, PALCO, 0.27 * h, t);
  renanDeMorceguinho(ctx, 0.585 * w, PALCO, 0.27 * h, t);

  // o Mano de vampiro, igualzinho ao Ari (de propósito)
  {
    const x = 0.73 * w;
    const a = 0.18 * h;
    const base = PALCO;
    poligono(ctx, [[x - a * 0.16, base - a * 0.5], [x - a * 0.3, base - a * 0.05], [x + a * 0.3, base - a * 0.05], [x + a * 0.16, base - a * 0.5]], FESTA.capa);
    poligono(ctx, [[x - a * 0.13, base - a * 0.48], [x - a * 0.24, base - a * 0.08], [x + a * 0.24, base - a * 0.08], [x + a * 0.13, base - a * 0.48]], FESTA.capaForro);
    const { hy, hr } = corpinho(ctx, x, base, a, FESTA.pinguim, FESTA.pinguim, FESTA.bicoLaranja);
    elipse(ctx, x, base - a * 0.26, a * 0.12, a * 0.18, FESTA.pinguimBarriga);
    for (const lado of [-1, 1]) {
      poligono(ctx, [[x + lado * a * 0.08, base - a * 0.5], [x + lado * a * 0.3, base - a * 0.78], [x + lado * a * 0.2, base - a * 0.48]], FESTA.capaForro);
    }
    circulo(ctx, x, hy, hr, FESTA.pinguim);
    elipse(ctx, x, hy + hr * 0.2, hr * 0.72, hr * 0.62, FESTA.pinguimBarriga);
    elipse(ctx, x + hr * 0.1, hy - hr * 0.95, hr * 0.32, hr * 0.18, FESTA.pinguim, -0.4);
    carinhaDeFoto(ctx, x, hy + hr * 0.02, hr * 0.85, false);
    poligono(ctx, [[x - hr * 0.2, hy + hr * 0.25], [x + hr * 0.2, hy + hr * 0.25], [x, hy + hr * 0.5]], FESTA.bicoLaranja);
    poligono(ctx, [[x - hr * 0.13, hy + hr * 0.42], [x - hr * 0.07, hy + hr * 0.42], [x - hr * 0.1, hy + hr * 0.55]], FESTA.camisa);
    poligono(ctx, [[x + hr * 0.07, hy + hr * 0.42], [x + hr * 0.13, hy + hr * 0.42], [x + hr * 0.1, hy + hr * 0.55]], FESTA.camisa);
    circulo(ctx, x, base - a * 0.47, a * 0.035, FESTA.ouro);
  }

  // 8. a saia de veludo do tablado, a barra laranja e o babado --------------
  ctx.fillStyle = FESTA.saia;
  ctx.fillRect(0, PALCO + 0.02 * h, w, SAIA - PALCO - 0.02 * h);
  for (let k = 0; k < 14; k++) {
    const x = (k + 0.5) * (w / 14);
    ctx.fillStyle = FESTA.saiaDobra;
    ctx.fillRect(x - 0.012 * w, PALCO + 0.04 * h, 0.024 * w, SAIA - PALCO - 0.04 * h);
    ctx.fillStyle = FESTA.saiaLuz;
    ctx.fillRect(x + 0.02 * w, PALCO + 0.04 * h, 0.01 * w, SAIA - PALCO - 0.04 * h);
  }
  ctx.fillStyle = FESTA.barra;
  ctx.fillRect(0, PALCO + 0.02 * h, w, 0.016 * h);
  for (let k = 0; k < 16; k++) {
    const x = (k + 0.5) * (w / 16);
    ctx.fillStyle = FESTA.barra;
    ctx.beginPath();
    ctx.arc(x, PALCO + 0.036 * h, w / 32, 0, Math.PI);
    ctx.fill();
  }

  // 9. o assoalho do salão --------------------------------------------------
  const chao = ctx.createLinearGradient(0, SAIA, 0, h);
  chao.addColorStop(0, FESTA.chao);
  chao.addColorStop(1, FESTA.chaoLuz);
  ctx.fillStyle = chao;
  ctx.fillRect(0, SAIA, w, h - SAIA);
  ctx.strokeStyle = FESTA.tabuaJunta;
  ctx.lineWidth = Math.max(1, 0.003 * w);
  for (let k = 1; k < 5; k++) {
    const y = SAIA + k * (h - SAIA) / 5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 10. a fileira da frente, no chão ----------------------------------------
  const frente = 0.975 * h;
  const fa = 0.165 * h;

  // a Josefina de dragãozinho: o casco com os espinhos, o capuz de chifrinho
  {
    const x = 0.075 * w;
    const a = fa;
    for (const lado of [-1, 1]) elipse(ctx, x + lado * a * 0.28, frente - a * 0.45, a * 0.14, a * 0.07, FESTA.coracao, lado * 0.5);
    elipse(ctx, x, frente - a * 0.25, a * 0.32, a * 0.25, FESTA.casco);
    for (let k = 0; k < 5; k++) {
      const ang = Math.PI * (1.15 + (k / 4) * 0.7);
      const ex = x + Math.cos(ang) * a * 0.32;
      const ey = frente - a * 0.25 + Math.sin(ang) * a * 0.25;
      poligono(ctx, [[ex - a * 0.04, ey + a * 0.02], [ex + Math.cos(ang) * a * 0.09, ey + Math.sin(ang) * a * 0.09], [ex + a * 0.04, ey + a * 0.02]], FESTA.espinho);
      if (k % 2) elipse(ctx, ex - Math.cos(ang) * a * 0.12, ey - Math.sin(ang) * a * 0.1, a * 0.06, a * 0.045, FESTA.escudo);
    }
    elipse(ctx, x, frente - a * 0.12, a * 0.22, a * 0.12, FESTA.peleDeTartaruga);
    const hy = frente - a * 0.6;
    const hr = a * 0.19;
    circulo(ctx, x, hy, hr * 1.15, FESTA.casco);
    for (const lado of [-1, 1]) {
      poligono(ctx, [[x + lado * hr * 0.3, hy - hr * 0.95], [x + lado * hr * 0.6, hy - hr * 1.6], [x + lado * hr * 0.75, hy - hr * 0.75]], FESTA.barra);
    }
    circulo(ctx, x, hy + hr * 0.1, hr * 0.85, FESTA.peleDeTartaruga);
    carinhaDeFoto(ctx, x, hy + hr * 0.1, hr * 0.85);
  }

  // o Capy de tubarão: o capuz cinza-azulado com os dentinhos e a barbatana
  {
    const x = 0.185 * w;
    const a = fa;
    const { hy, hr } = corpinho(ctx, x, frente, a, FESTA.tubarao, FESTA.tubarao, FESTA.capivaraFocinho);
    elipse(ctx, x, frente - a * 0.26, a * 0.11, a * 0.15, FESTA.tubaraoBarriga);
    poligono(ctx, [[x - hr * 0.35, hy - hr * 0.85], [x + hr * 0.15, hy - hr * 1.7], [x + hr * 0.35, hy - hr * 0.85]], FESTA.tubarao);
    elipse(ctx, x, hy + hr * 0.18, hr * 0.7, hr * 0.68, FESTA.capivara);
    for (let k = 0; k < 6; k++) {
      const dx = x - hr * 0.6 + k * hr * 0.24;
      poligono(ctx, [[dx - hr * 0.1, hy - hr * 0.48], [dx + hr * 0.1, hy - hr * 0.48], [dx, hy - hr * 0.3]], FESTA.camisa);
    }
    elipse(ctx, x, hy + hr * 0.42, hr * 0.32, hr * 0.2, FESTA.capivaraFocinho);
    carinhaDeFoto(ctx, x, hy + hr * 0.05, hr * 0.8, false);
    circulo(ctx, x + a * 0.06, frente - a * 0.4, a * 0.025, FESTA.ouro);
  }

  // o Jean-Luc, o Fantasma da Ópera: a cartolinha, a meia-máscara e a rosa
  {
    const x = 0.285 * w;
    const a = fa * 0.95;
    poligono(ctx, [[x - a * 0.15, frente - a * 0.5], [x - a * 0.26, frente - a * 0.1], [x + a * 0.26, frente - a * 0.1], [x + a * 0.15, frente - a * 0.5]], FESTA.cartola);
    poligono(ctx, [[x - a * 0.12, frente - a * 0.48], [x - a * 0.2, frente - a * 0.13], [x + a * 0.2, frente - a * 0.13], [x + a * 0.12, frente - a * 0.48]], FESTA.capaDeOpera);
    const { hy, hr } = corpinho(ctx, x, frente, a, FESTA.pato, FESTA.pato, FESTA.bicoLaranja);
    elipse(ctx, x - hr * 0.36, hy - hr * 0.02, hr * 0.42, hr * 0.38, FESTA.mascara);
    ctx.strokeStyle = FESTA.laSombra;
    ctx.lineWidth = Math.max(1, hr * 0.06);
    ctx.beginPath();
    ctx.ellipse(x - hr * 0.36, hy - hr * 0.02, hr * 0.42, hr * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
    carinhaDeFoto(ctx, x, hy - hr * 0.05, hr * 0.85, false);
    elipse(ctx, x, hy + hr * 0.42, hr * 0.38, hr * 0.17, FESTA.bicoLaranja);
    circulo(ctx, x + hr * 0.42, hy + hr * 0.42, hr * 0.17, FESTA.rosa);
    ctx.fillStyle = FESTA.cartola;
    ctx.fillRect(x - hr * 0.62, hy - hr * 0.95, hr * 1.24, hr * 0.14);
    ctx.fillRect(x - hr * 0.38, hy - hr * 1.65, hr * 0.76, hr * 0.74);
    ctx.fillStyle = FESTA.capaForro;
    ctx.fillRect(x - hr * 0.38, hy - hr * 1.08, hr * 0.76, hr * 0.12);
  }

  // o Gatito de Walter: as orelhas caídas de cachorro e o focinho de bolinha
  {
    const x = 0.39 * w;
    const a = fa * 0.95;
    for (const lado of [-1, 1]) {
      poligono(ctx, [[x + lado * a * 0.05, frente - a * 0.82], [x + lado * a * 0.17, frente - a * 1.0], [x + lado * a * 0.2, frente - a * 0.78]], FESTA.gato);
    }
    const { hy, hr } = corpinho(ctx, x, frente, a, FESTA.gato, FESTA.gato, FESTA.gatoCaramelo);
    for (const lado of [-1, 1]) {
      // a orelha de cachorro nasce no ALTO da cabeça e cai pelo lado: com uma
      // tiara escura por cima e a orelha na altura do rosto, lia como fone
      ctx.fillStyle = FESTA.cachorroOrelha;
      ctx.beginPath();
      ctx.moveTo(x + lado * hr * 0.35, hy - hr * 0.85);
      ctx.quadraticCurveTo(x + lado * hr * 1.35, hy - hr * 0.95, x + lado * hr * 1.15, hy + hr * 0.25);
      ctx.quadraticCurveTo(x + lado * hr * 0.85, hy + hr * 0.35, x + lado * hr * 0.75, hy - hr * 0.35);
      ctx.closePath();
      ctx.fill();
      poligono(ctx, [[x, frente - a * 0.5], [x + lado * a * 0.1, frente - a * 0.55], [x + lado * a * 0.1, frente - a * 0.45]], FESTA.gravata);
    }
    carinhaDeFoto(ctx, x, hy, hr * 0.9, false);
    circulo(ctx, x, hy + hr * 0.3, hr * 0.17, FESTA.focinhoPreto);
  }

  // as três irmãs, juntinhas do lado direito
  // a Luna de coruja da meia-noite
  {
    const x = 0.615 * w;
    const a = fa;
    const { hy, hr } = coelhinha(ctx, x, frente, a, FESTA.coelhaLuna, FESTA.coruja);
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = FESTA.corujaPena;
      ctx.beginPath();
      ctx.arc(x - a * 0.12 + k * a * 0.12, frente - a * 0.42, a * 0.065, 0, Math.PI);
      ctx.fill();
    }
    ctx.fillStyle = FESTA.coruja;
    ctx.beginPath();
    ctx.arc(x, hy, hr * 1.12, Math.PI * 1.02, Math.PI * 1.98);
    ctx.fill();
    for (const lado of [-1, 1]) {
      poligono(ctx, [[x + lado * hr * 0.6, hy - hr * 0.75], [x + lado * hr * 1.0, hy - hr * 1.4], [x + lado * hr * 1.05, hy - hr * 0.5]], FESTA.coruja);
      circulo(ctx, x + lado * hr * 0.45, hy - hr * 0.62, hr * 0.24, FESTA.corujaOlho);
      circulo(ctx, x + lado * hr * 0.45, hy - hr * 0.62, hr * 0.11, FESTA.traco);
    }
    carinhaDeFoto(ctx, x, hy + hr * 0.08, hr * 0.85, false);
    ctx.fillStyle = FESTA.lua;
    ctx.beginPath();
    ctx.arc(x, frente - a * 0.36, a * 0.05, 0, Math.PI * 2);
    ctx.arc(x + a * 0.02, frente - a * 0.375, a * 0.042, 0, Math.PI * 2, true);
    ctx.fill();
  }

  // a Sol de caveirinha catrina: a coroa de flores e a saia de babado
  {
    const x = 0.725 * w;
    const a = fa;
    const { hy, hr } = coelhinha(ctx, x, frente, a, FESTA.coelhaSol, FESTA.coelhaSol);
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = CONFETE[k];
      ctx.beginPath();
      ctx.arc(x, frente - a * (0.12 + k * 0.05), a * (0.2 - k * 0.025), Math.PI, 0);
      ctx.fill();
    }
    elipse(ctx, x, hy + hr * 0.1, hr * 0.7, hr * 0.6, FESTA.caveira);
    for (const lado of [-1, 1]) {
      circulo(ctx, x + lado * hr * 0.38, hy + hr * 0.05, hr * 0.24, FESTA.traco);
      circulo(ctx, x + lado * hr * 0.66, hy + hr * 0.42, hr * 0.13, FESTA.coracao);
    }
    carinhaDeFoto(ctx, x, hy + hr * 0.02, hr * 0.85, true, FESTA.caveira);
    for (let k = 0; k < 5; k++) circulo(ctx, x - hr * 0.8 + k * hr * 0.4, hy - hr * 0.85 + Math.abs(k - 2) * hr * 0.12, hr * 0.17, CONFETE[(k + 1) % CONFETE.length]);
  }

  // a Estrella de fadinha das estrelas: as asas de tule e a varinha
  {
    const x = 0.835 * w;
    const a = fa;
    for (const lado of [-1, 1]) {
      elipse(ctx, x + lado * a * 0.24, frente - a * 0.48, a * 0.15, a * 0.2, FESTA.tule, lado * 0.5);
      elipse(ctx, x + lado * a * 0.2, frente - a * 0.25, a * 0.1, a * 0.12, FESTA.tule, -lado * 0.4);
    }
    const { hy, hr } = coelhinha(ctx, x, frente, a, FESTA.coelhaEstrella, FESTA.saiaDeEstrelas);
    for (let k = 0; k < 4; k++) estrelinha(ctx, x - a * 0.1 + k * a * 0.07, frente - a * (0.15 + (k % 2) * 0.12), a * 0.025, FESTA.estrela);
    carinhaDeFoto(ctx, x, hy + hr * 0.05, hr * 0.85);
    // a varinha erguida, com a estrela piscando
    const vx = x + a * 0.32;
    const vy = frente - a * 0.95;
    ctx.strokeStyle = FESTA.camisa;
    ctx.lineWidth = Math.max(1, a * 0.025);
    ctx.beginPath();
    ctx.moveTo(x + a * 0.16, frente - a * 0.35);
    ctx.lineTo(vx, vy);
    ctx.stroke();
    estrelinha(ctx, vx, vy, a * 0.08, FESTA.estrela);
    faisca(ctx, vx + a * 0.1, vy - a * 0.08, a * 0.08, 0.5 + 0.5 * Math.sin(t * 3.1));
  }

  // as plaquinhas que ainda ficaram no alto, balançando
  for (const [px2, alt, fase] of [[0.15, 0.8, 0], [0.67, 0.79, 1.7], [0.93, 0.8, 3.1]] as const) {
    plaquinhaDeVoto(ctx, px2 * w, alt * h, 0.028 * w, Math.sin(t * 1.8 + fase) * 0.18);
  }

  // o Walter de múmia garçom, no meio e na frente, com a bandeja de doces
  {
    const x = 0.5 * w;
    const a = fa * 1.05;
    const base = 0.99 * h;
    const { hy, hr } = corpinho(ctx, x, base, a, FESTA.atadura, FESTA.cachorro, FESTA.atadura);
    ctx.strokeStyle = FESTA.ataduraLinha;
    ctx.lineWidth = Math.max(1, a * 0.012);
    for (let k = 0; k < 5; k++) {
      const y = base - a * (0.1 + k * 0.08);
      ctx.beginPath();
      ctx.moveTo(x - a * 0.17, y + a * 0.03);
      ctx.lineTo(x + a * 0.17, y - a * 0.02);
      ctx.stroke();
    }
    for (const lado of [-1, 1]) elipse(ctx, x + lado * hr * 0.92, hy + hr * 0.1, hr * 0.27, hr * 0.55, FESTA.cachorroOrelha, lado * 0.2);
    // a atadura atravessando a testa, com a ponta solta balançando
    ctx.fillStyle = FESTA.atadura;
    ctx.save();
    ctx.translate(x, hy - hr * 0.45);
    ctx.rotate(-0.15);
    ctx.fillRect(-hr * 1.0, -hr * 0.14, hr * 2.0, hr * 0.28);
    ctx.restore();
    poligono(ctx, [[x + hr * 0.85, hy - hr * 0.6], [x + hr * 1.35, hy - hr * (0.35 + Math.sin(t * 2.6) * 0.12)], [x + hr * 1.3, hy - hr * 0.15], [x + hr * 0.85, hy - hr * 0.35]], FESTA.atadura);
    elipse(ctx, x, hy + hr * 0.4, hr * 0.42, hr * 0.3, FESTA.laSombra);
    circulo(ctx, x, hy + hr * 0.28, hr * 0.13, FESTA.focinhoPreto);
    carinhaDeFoto(ctx, x, hy - hr * 0.02, hr * 0.85, false);
    for (const lado of [-1, 1]) {
      poligono(ctx, [[x, base - a * 0.5], [x + lado * a * 0.1, base - a * 0.56], [x + lado * a * 0.1, base - a * 0.44]], FESTA.gravata);
    }
    // a bandeja de doces erguida do lado
    const bx = x + a * 0.36;
    const by = base - a * 0.62;
    ctx.strokeStyle = FESTA.atadura;
    ctx.lineWidth = a * 0.06;
    ctx.beginPath();
    ctx.moveTo(x + a * 0.15, base - a * 0.42);
    ctx.lineTo(bx, by + a * 0.02);
    ctx.stroke();
    elipse(ctx, bx, by, a * 0.18, a * 0.04, FESTA.bandeja);
    for (let k = 0; k < 4; k++) circulo(ctx, bx - a * 0.11 + k * a * 0.075, by - a * 0.04, a * 0.035, CONFETE[k]);
  }

  // 11. o confete caindo por cima de tudo ----------------------------------
  for (let i = 0; i < 46; i++) {
    const fase = (t * 0.06 + i * 0.137) % 1;
    const cx = ((i * 0.618) % 1) * w + Math.sin(t * 1.3 + i) * 0.015 * w;
    const cy = (fase * 1.1 - 0.05) * h;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 2 + i);
    ctx.fillStyle = CONFETE[i % CONFETE.length];
    ctx.fillRect(-0.006 * w, -0.0035 * w, 0.012 * w, 0.007 * w);
    ctx.restore();
  }

  // 12. o banho quente da festa e a vinheta ---------------------------------
  ctx.fillStyle = 'rgba(255, 170, 90, 0.06)';
  ctx.fillRect(0, 0, w, h);
  const vinheta = ctx.createRadialGradient(w / 2, h * 0.5, w * 0.35, w / 2, h * 0.5, w * 0.9);
  vinheta.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vinheta.addColorStop(1, 'rgba(40, 10, 30, 0.35)');
  ctx.fillStyle = vinheta;
  ctx.fillRect(0, 0, w, h);

  // 13. o flash da foto: estoura quando o quadro abre e some ---------------
  if (t < 0.9) {
    const k = 1 - t / 0.9;
    ctx.fillStyle = `rgba(255, 252, 240, ${(0.85 * k * k).toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }
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
  {
    id: 'trinta-levas',
    titulo: 'As trinta levas',
    lugar: 'Estufa da Josefina',
    legenda: 'Trinta levas de bicho e a estufa de pé. Até a mãe deles desistiu da gente.',
    proporcao: 3 / 4,
    // ganha jogando: só entra no quadro depois de resgatar o marco das trinta ondas
    trava: 'jardim.resgate-30',
    pintar: trintaLevas,
  },
  {
    id: 'rainha-e-rei-da-festa',
    titulo: 'A rainha e o rei da festa',
    lugar: 'Casinha da Abóbora, no Halloween',
    legenda: 'Treze plaquinhas apontando pra gente, duas coroas e todo mundo apertadinho na foto. Xiiis!',
    proporcao: 3 / 4,
    // ganha jogando: a foto de todos no fim do concurso de fantasias
    // (`FLAG_DA_FOTO`, em eventos/halloween/noSalao.ts)
    trava: 'halloween:foto-da-festa',
    pintar: rainhaEReiDaFesta,
  },
];
