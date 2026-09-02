/**
 * As memorias penduradas no quadro do quarto do Ari.
 *
 * Uma memoria aqui NAO e uma imagem: e uma funcao que pinta a cena com a API
 * Canvas 2D na hora em que o painel abre. Mesmo principio do resto do jogo —
 * zero asset externo, tudo procedural — so que em 2D, porque uma lembranca se
 * olha de frente, como foto, e nao se anda dentro dela.
 *
 * COMO UMA FOTO VIRA CODIGO AQUI: tudo sai de um ponto de fuga so. Uma funcao
 * de profundidade (`encolhe`) e um projetor (`projetar`) dao posicao E tamanho
 * de cada viga, pilar, lampada e junta do chao. E isso que faz a cena ler como
 * o corredor da foto mesmo desenhada com quatro formas: o olho reconhece o
 * RITMO adensando ao longe, nao o detalhe de perto. Desenhar cada peca no
 * lugar "a olho" daria um cenario de teatro chapado; derivar todas da mesma
 * conta da o corredor.
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

const CORES = {
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
  ariCabelo: '#8f5c33',
  ariRoupa: '#e8e2d6',
  renanCabelo: '#1f1712',
  renanRoupa: '#1b1c22',
  perna: '#15161c',
};

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

  ctx.fillStyle = CORES.luz;
  ctx.globalAlpha = brilho;
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = CORES.luzNucleo;
  ctx.beginPath();
  ctx.arc(x, y, raio * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/**
 * Um dos dois, de costas, andando la no fundo.
 *
 * Sao sempre dois em cena, e a esta distancia a diferenca entre eles cabe em
 * duas cores: o Ari e o claro (camisa creme), o Renan e o escuro (moletom
 * preto). Nada de rosto — contra a luz do fundo eles sao recorte.
 */
function silhueta(
  ctx: CanvasRenderingContext2D,
  x: number,
  base: number,
  altura: number,
  roupa: string,
  cabelo: string,
  passo: number,
): void {
  const larg = altura * 0.3;

  ctx.strokeStyle = CORES.perna;
  ctx.lineWidth = altura * 0.075;
  ctx.lineCap = 'round';
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x, base - altura * 0.42);
    ctx.lineTo(x + lado * larg * 0.26 * passo, base);
    ctx.stroke();
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

// -------------------------------------------------------- a memoria da foto

/**
 * O corredor de luzinhas, a noite.
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
  ceu.addColorStop(0, CORES.ceuTopo);
  ceu.addColorStop(1, CORES.ceuBaixo);
  ctx.fillStyle = ceu;
  ctx.fillRect(0, 0, w, horizonte);

  // 2. chao -----------------------------------------------------------------
  // Quente perto (as luzinhas batem nele) e frio ao longe, que e o que da a
  // sensacao de distancia sem desenhar nada a mais.
  const piso = ctx.createLinearGradient(0, horizonte, 0, h);
  piso.addColorStop(0, CORES.chaoLonge);
  piso.addColorStop(1, CORES.chaoPerto);
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
  ctx.strokeStyle = CORES.junta;
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
  ctx.fillStyle = CORES.tatil;
  ctx.beginPath();
  ctx.moveTo(tl.x, tl.y);
  ctx.lineTo(tr.x, tr.y);
  ctx.lineTo(fr.x, fr.y);
  ctx.lineTo(fl.x, fl.y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = CORES.tatilRisco;
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
        i % 2 === 0 ? CORES.folhaEscura : CORES.folhaClara,
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

      ctx.fillStyle = CORES.tijolo;
      ctx.fillRect(x, topo.y, larg, pe.y - topo.y);

      // a face virada para o centro do corredor fica na sombra
      ctx.fillStyle = CORES.tijoloSombra;
      ctx.fillRect(lado < 0 ? x + larg * 0.68 : x, topo.y, larg * 0.32, pe.y - topo.y);

      // a base de concreto
      const alturaBase = (pe.y - topo.y) * 0.09;
      ctx.fillStyle = CORES.base;
      ctx.fillRect(x - larg * 0.06, pe.y - alturaBase, larg * 1.12, alturaBase);

      // as juntas do tijolo so nos pilares de perto: mais longe viram ruido
      if (d < 0.3) {
        ctx.strokeStyle = CORES.tijoloJunta;
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
  ctx.strokeStyle = CORES.longarina;
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

    ctx.fillStyle = CORES.vigaFrente;
    ctx.fillRect(e.x, e.y, dir.x - e.x, grossura);
    // a barriga da viga, que e a parte que pega menos luz
    ctx.fillStyle = CORES.vigaBaixo;
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

    ctx.strokeStyle = CORES.fio;
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
  silhueta(ctx, chaoDeles.x - alt * 0.34, chaoDeles.y, alt, CORES.ariRoupa, CORES.ariCabelo, passo);
  silhueta(ctx, chaoDeles.x + alt * 0.34, chaoDeles.y, alt, CORES.renanRoupa, CORES.renanCabelo, -passo);

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
 * O acervo do quadro.
 *
 * Uma so por enquanto. Quando entrar a segunda, o painel ganha as setas para
 * folhear — hoje elas seriam um controle que nao leva a lugar nenhum.
 */
export const MEMORIAS: readonly MemoriaPintada[] = [
  {
    id: 'corredor-de-luzes',
    titulo: 'O corredor de luzinhas',
    lugar: 'uma noite, os dois andando',
    legenda: 'As luzinhas iam até onde a gente não enxergava mais. A gente foi junto.',
    proporcao: 3 / 4,
    pintar: corredorDeLuzes,
  },
];
