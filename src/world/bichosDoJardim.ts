import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';

/**
 * AS PRAGAS DA ESTUFA — os bichos do minigame do jardim.
 *
 * O plano inteiro esta em `docs/MINIGAME-JARDIM.md`. Aqui mora so a GEOMETRIA:
 * nenhuma peca daqui anda, colide ou sabe que existe uma rodada.
 *
 * ELES SAO MISTURAS DE BICHO, e nao bichos. A razao e do Renan e do Ari, e ela
 * e sobre como o jogo dá vontade de ser jogado: bicho normal levando jato de
 * agua da pena, e jogar com pena de quem esta do outro lado estraga a rodada.
 * Um bicho que e metade lagarta e metade caranguejo nao e ninguem — e uma
 * praga, e enxotar praga do canteiro dos outros e uma coisa boa de fazer.
 *
 * NENHUM BICHO COM NOME ENTRA NA RECEITA. O Capy e capivara, a Josefina e
 * tartaruga, o Noel e peru, o Jean-Luc e pato, o Walter e cachorro, o Pelusa e
 * gato, o Cookie e elefante, a Gina e girafa, a Estella e ovelha, o Mano e
 * pinguim. Usar qualquer um deles como metade de uma praga faria o jogador
 * regar uma caricatura de gente de quem ele gosta. As metades usadas aqui nao
 * pertencem a ninguem (a lista esta na skill `aristory-praga`). E rato,
 * golfinho e barata nao entram nunca — decisoes do Renan.
 *
 * ==================================================== COMO ELES SAO DESENHADOS
 *
 * TRES REGRAS, e as tres sao sobre ser lido a tres metros de distancia com
 * cinco deles na tela ao mesmo tempo:
 *
 * 1. **O TAMANHO SEPARA O TIER.** Fraco e PEQUENO (`ESCALA_DO_TIER`, no fim do
 *    arquivo), medio tem a altura de um joelho, tanque e LARGO porque largura
 *    lê como peso, e o chefe e alto. Quem olha rapido le o tamanho antes de ler
 *    a forma. Quanta agua ainda falta quem diz e a BARRA DE VIDA em cima da
 *    cabeca, que o minigame desenha — o tamanho e o relance, a barra e o exato.
 * 2. **A COR SEPARA UMA PRAGA DA OUTRA.** Cada uma tem a sua
 *    (`P.pragaLagartejo`, `P.pragaGafanhopo`, ...), e nao ha familia unica: com
 *    cinco na tela, seis tons do mesmo roxo viram uma mancha so, e o jogador
 *    precisa saber QUAL bicho esta chegando. O que elas dividem e o olho, a
 *    barriga clara e o laranja de aviso — e nenhuma cor daqui existe num
 *    canteiro, para praga nunca se confundir com planta.
 * 3. **A CARA NAO E ASSUSTADORA.** Olho redondo com pupila redonda, e so. A
 *    primeira versao tinha sobrancelha em cunha, e na tela ela virou uma faixa
 *    preta atravessando o olho: assustador, que nao e o que este minigame quer
 *    ser. Malvado eles sao pelo que FAZEM — vem comer a horta —, pela garra
 *    laranja e pelo jeito de andar.
 *
 * Cada peca devolve o grupo com a base em `y = 0` e olhando para `+Z`, como
 * todo o kit. E cada uma publica `userData.partes` com o que se mexe (pernas,
 * pincas, bracos), para o minigame animar sem ter que procurar na arvore.
 */

/** cor de olho e pupila — o mesmo par em todos eles */
const OLHO = () => toon(P.pragaOlho);
const PUPILA = () => toon(P.pragaPupila);

/**
 * UM OLHO, virado para `+Z`. Globo claro e pupila redonda, e mais nada.
 *
 * A PRIMEIRA VERSAO TINHA SOBRANCELHA, uma cunha escura por cima de cada olho,
 * para dizer "bravo" sem rosto. Na tela ela nao leu como sobrancelha: leu como
 * uma FAIXA PRETA atravessando o olho, e o bicho ficou assustador em vez de
 * malvado — que e justamente o que este minigame nao quer ser. O que diz que
 * eles sao malvados e o que eles FAZEM (vem comer a horta), a garra laranja e
 * o jeito de andar; nao precisa estar na cara.
 *
 * A pupila fica CENTRADA e apontando direto para `+Z`, nunca virada para
 * dentro: duas pupilas convergindo deixam o bicho vesgo de qualquer angulo, e
 * vesgo lê como bobo — nao como ameaca.
 */
function olhoRedondo(raio: number): THREE.Group {
  const g = new THREE.Group();

  const globo = new THREE.Mesh(new THREE.SphereGeometry(raio, 10, 8), OLHO());
  g.add(globo);

  /**
   * A PUPILA SOBE UM POUCO NO GLOBO, e isso e por causa da camera.
   *
   * No equador da esfera, apontando para `+Z`, ela some: a camera olha de 34
   * graus de cima, ve a calota SUPERIOR do olho, e a pupila fica escondida
   * pela propria testa do globo — o bicho aparece com dois olhos brancos de
   * bola de gude. Levantada 0,45 rad ela cai bem no meio do que a camera ve.
   *
   * Ela sobe, e nunca vira para DENTRO: pupila convergindo deixa o bicho vesgo
   * de qualquer angulo, e vesgo lê como bobo — nao como ameaca.
   */
  const olhar = new THREE.Group();
  olhar.rotation.x = -0.45;
  g.add(olhar);

  /**
   * A PUPILA PRECISA SOBRAR DO GLOBO, e a primeira versao nao sobrava.
   *
   * Ela era uma esfera de raio 0,56 achatada a 0,31 e centrada em `z = 0,6`:
   * o polo dela parava em `0,91` contra `1,0` do globo, ou seja, ficava
   * INTEIRA por dentro. O que aparecia na tela era so um pontinho escuro
   * vazando por uma faceta — o bicho tinha dois olhos de bola de gude.
   *
   * Agora o polo vai a `1,08`, com folga para a esfera do globo ser um poliedro
   * de 10 gomos (cuja face do meio fica em `0,95`, e nao em `1,0`).
   */
  const pupila = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.5, 8, 6), PUPILA());
  pupila.position.z = raio * 0.86;
  pupila.scale.z = 0.45;
  olhar.add(pupila);

  return g;
}

/** Uma pata curta e gorda, do tipo que so precisa existir. */
function patinha(raio: number, cor: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(raio, 8, 6), toon(cor));
  m.scale.set(1, 0.72, 1.25);
  return m;
}

type Ponto = readonly [number, number, number];
const CIMA = new THREE.Vector3(0, 1, 0);
const FRENTE = new THREE.Vector3(0, 0, 1);

/**
 * UM OSSO DE A ATÉ B — perna, antena, talo de olho. Uma cápsula deitada entre
 * as duas juntas, e é isso: desenhar perna por junta, e não por ângulo, é o
 * que evita a pegadinha do sinal do `rotation.z` no lado esquerdo (§7 da
 * skill). As pontas da cápsula passam `raio` além de A e de B — pé que tem que
 * pousar em `y = 0` tem a junta de baixo em `y = raio`.
 */
function osso(a: Ponto, b: Ponto, raio: number, material: THREE.Material, gomos = 6): THREE.Mesh {
  const va = new THREE.Vector3(...a);
  const d = new THREE.Vector3(...b).sub(va);
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(raio, Math.max(0.001, d.length()), 3, gomos), material);
  m.position.copy(va).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(CIMA, d.normalize());
  return m;
}

/** aponta o `+Y` da peça (cone, cilindro) para a direção `d` */
function apontar(m: THREE.Object3D, d: Ponto): THREE.Object3D {
  m.quaternion.setFromUnitVectors(CIMA, new THREE.Vector3(...d).normalize());
  return m;
}

/**
 * UMA ASA — de libélula, de abelha, de mosquito. Uma elipse fina que sai do
 * ombro para o lado `s`, com uma nervura por cima: sem a nervura, a lâmina
 * clara lia como uma folha grudada no bicho, e folha na praga é justamente o
 * que não pode (praga nunca se confunde com planta). Quem chama gira o grupo.
 *
 * Ela nasce DEITADA, e é de propósito: a câmera olha de 34° de cima, e asa em
 * pé fica de perfil — uma linha. Deitada (e só um tico levantada), ela mostra
 * a lâmina inteira.
 */
function asa(comprimento: number, largura: number, s: 1 | -1): THREE.Group {
  const g = new THREE.Group();
  const lamina = new THREE.Mesh(new THREE.SphereGeometry(comprimento / 2, 12, 6), toon(P.pragaAsa));
  lamina.scale.set(1, 0.08, largura / comprimento);
  lamina.position.x = s * comprimento / 2;
  g.add(lamina);
  // a nervura encosta na lâmina até perto da ponta, onde a elipse afina
  g.add(osso(
    [s * comprimento * 0.08, comprimento * 0.045, 0], [s * comprimento * 0.84, comprimento * 0.045, 0],
    comprimento * 0.018, toon(P.pragaAsaNervura), 4,
  ));
  return g;
}

/* =========================================================================
 * FRACOS — baixos, rapidos de aparecer, caem no primeiro ou segundo jato
 * ========================================================================= */

/**
 * LAGARTEJO — lagarta + caranguejo. O bicho mais comum da estufa.
 *
 * A silhueta e um tubo segmentado rente ao chao com DUAS PINCAS na frente e
 * dois olhos em talo por cima. As pincas nao sao enfeite: sao elas que dizem
 * que ele corta a planta em vez de mordiscar, e sao a unica coisa dele que
 * aparece acima da linha do canteiro quando ele esta comendo.
 *
 * ELE VEM EM TRENZINHO (§5 do plano), entao a peca foi desenhada para ficar
 * boa REPETIDA: os segmentos diminuem para tras, e quatro deles em fila leem
 * como uma fila de bichos, e nao como um bicho comprido.
 *
 * @param escala 1 e o tamanho de praga; a Mae-Lagartejo usa 1,9
 * @param corDoCorpo a cor da casca. So a Mae-Lagartejo passa este argumento —
 *   ela e a mesma peca no vinho dela; sem ele, sai o roxo do lagartejo comum.
 * @param segmentos quantos aneis o corpo tem. A mae usa QUATRO, e nao cinco:
 *   crescer o bicho inteiro por escala deixava ela com 3,5 de comprimento, mais
 *   do que qualquer peca cabe no terreiro. Mae tem que ser mais GORDA, e nao
 *   mais comprida — e aumentar o raio sem aumentar a fila e exatamente isso.
 */
export function lagartejo(
  escala = 1, semente = 0.5, segmentos = 5, corDoCorpo?: number,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lagartejo';
  const e = escala;
  const giro = semente * 6.283;

  // a mae usa a MESMA peca com a cor dela: e o unico caso de duas pragas
  // dividindo geometria, e a cor e o que separa as duas de longe
  const ehMae = corDoCorpo !== undefined;
  const casca = toon(corDoCorpo ?? P.pragaLagartejo);
  const cascaEscura = toon(ehMae ? P.pragaMaeEscura : P.pragaLagartejoEscuro);
  const garra = toon(P.pragaGarra);

  const pernas: THREE.Object3D[] = [];
  const pincas: THREE.Object3D[] = [];

  /**
   * OS SEGMENTOS. O da frente e o maior e vai para `+Z`; eles encolhem e
   * abaixam para tras, que e o que da a leitura de "corpo de lagarta" sem
   * precisar de mais de cinco pecas.
   */
  const SEGMENTOS = Math.max(3, segmentos);
  for (let i = 0; i < SEGMENTOS; i++) {
    const t = i / (SEGMENTOS - 1);
    const raio = (0.2 - t * 0.075) * e;
    const anel = new THREE.Mesh(
      new THREE.SphereGeometry(raio, 10, 8),
      i % 2 === 0 ? casca : cascaEscura,
    );
    anel.scale.set(1.12, 0.92, 1);
    anel.position.set(0, raio * 0.92, (0.2 - i * 0.29) * e);
    g.add(anel);

    // um par de patinhas por segmento, alternando o lado que vai a frente
    for (const s of [-1, 1] as const) {
      const pe = patinha(0.055 * e, ehMae ? P.pragaMaeEscura : P.pragaLagartejoEscuro);
      pe.position.set(s * raio * 0.95, 0.05 * e, anel.position.z + (i % 2 ? 0.03 : -0.03) * e);
      g.add(pe);
      pernas.push(pe);
    }
  }

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.2 * e, 0.42 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.21 * e, 10, 8), casca);
  cranio.scale.set(1.05, 0.95, 1.1);
  cabeca.add(cranio);

  /**
   * OS OLHOS EM TALO. Eles sao o que separa este bicho de uma lagarta comum a
   * primeira vista, e ficam ALTOS de proposito: numa camera que olha de cima,
   * olho na lateral da cabeca desaparece, e olho no topo de um talo continua
   * visivel mesmo com o bicho encostado num canteiro.
   */
  for (const s of [-1, 1] as const) {
    const talo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028 * e, 0.034 * e, 0.16 * e, 6), cascaEscura,
    );
    talo.position.set(s * 0.09 * e, 0.17 * e, 0.04 * e);
    talo.rotation.z = s * -0.22;
    cabeca.add(talo);

    const olho = olhoRedondo(0.072 * e);
    olho.position.set(s * 0.11 * e, 0.26 * e, 0.05 * e);
    cabeca.add(olho);
  }

  /**
   * AS PINCAS. Cada uma e um braco curto e duas garras que se abrem num V.
   * A de cima e mais comprida que a de baixo — pinca com as duas metades
   * iguais lê como bico, e nao como tesoura.
   */
  for (const s of [-1, 1] as const) {
    const braco = new THREE.Group();
    braco.position.set(s * 0.17 * e, 0.12 * e, 0.4 * e);
    braco.rotation.y = s * 0.42;
    g.add(braco);
    pincas.push(braco);

    const antebraco = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045 * e, 0.055 * e, 0.2 * e, 6), cascaEscura,
    );
    antebraco.rotation.x = Math.PI / 2;
    antebraco.position.z = 0.1 * e;
    braco.add(antebraco);

    for (const [comp, alto, gira] of [[0.19, 0.055, 0.42], [0.14, 0.05, -0.5]] as const) {
      const metade = new THREE.Mesh(
        new THREE.ConeGeometry(alto * e, comp * e, 6), garra,
      );
      metade.rotation.x = Math.PI / 2;
      metade.rotation.z = gira;
      metade.position.set(0, gira * 0.12 * e, (0.2 + comp / 2) * e);
      braco.add(metade);
    }
  }

  g.rotation.y = giro * 0.02;
  g.userData.partes = { cabeca, pernas, pincas };
  return g;
}

/**
 * GAFANHOPO — gafanhoto + sapo. O que pula.
 *
 * Corpo gordo e baixo de sapo com as duas pernas traseiras dobradas de
 * gafanhoto, que e a silhueta inteira: duas molas saindo de uma bola. O pulo
 * dele (§5) e o primeiro "isto eu tenho que cronometrar" do minigame, entao as
 * pernas precisam ler como MOLA mesmo com ele parado — dai o angulo fechado da
 * coxa, que e o que promete o salto antes de ele acontecer.
 */
export function gafanhopo(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'gafanhopo';
  const e = escala;
  // ele nasce olhando um tico de lado, para uma fila deles nao virar um pente
  g.rotation.y = (semente - 0.5) * 0.14;

  const casca = toon(P.pragaGafanhopo);
  const barriga = toon(P.pragaBarriga);
  const escura = toon(P.pragaGafanhopoEscuro);

  // ------------------------------------------------------------- o corpo
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.27 * e, 10, 8), casca);
  corpo.scale.set(1.15, 0.86, 1.05);
  corpo.position.y = 0.24 * e;
  g.add(corpo);

  // a barriga clara, um pouco MENOR e adiantada: encostada no corpo ela
  // dividiria superficie e serrilharia
  const papo = new THREE.Mesh(new THREE.SphereGeometry(0.2 * e, 10, 8), barriga);
  papo.scale.set(1.1, 0.7, 0.9);
  papo.position.set(0, 0.16 * e, 0.13 * e);
  g.add(papo);

  /**
   * A BOCA, uma fenda escura e LARGA atravessando a frente. Sapo e boca; sem
   * ela o corpo lê como besouro.
   */
  /**
   * A BOCA E INCLINADA PARA CIMA, e nao vertical.
   *
   * Numa camera que olha em 34 graus, uma fenda na cara da frente fica de
   * perfil e some. Deitada meio radiano para tras, a mesma peca mostra a face
   * de cima — e boca e a metade "sapo" do bicho, entao ela precisa aparecer.
   */
  const boca = new THREE.Mesh(new THREE.BoxGeometry(0.36 * e, 0.05 * e, 0.11 * e), escura);
  boca.position.set(0, 0.29 * e, 0.235 * e);
  boca.rotation.x = -0.55;
  g.add(boca);

  // os olhos, altos e juntos no topo — de sapo
  for (const s of [-1, 1] as const) {
    const olho = olhoRedondo(0.086 * e);
    olho.position.set(s * 0.11 * e, 0.42 * e, 0.14 * e);
    g.add(olho);
  }

  // as antenas de gafanhoto, finas e caidas para tras
  for (const s of [-1, 1] as const) {
    // finas e curtas: as primeiras tinham 30 cm e liam como ORELHA, o que
    // fazia o bicho parecer um morcego em vez de um gafanhoto
    const antena = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009 * e, 0.014 * e, 0.22 * e, 5), escura,
    );
    antena.position.set(s * 0.07 * e, 0.52 * e, 0.0);
    antena.rotation.set(-0.7, 0, s * 0.34);
    g.add(antena);
  }

  /**
   * AS PERNAS DE MOLA. Coxa grossa apontando para CIMA e para tras, canela
   * fina descendo para a frente: e o Z dobrado do gafanhoto, e e ele que faz a
   * peca parada ja parecer que vai saltar.
   */
  /**
   * O JOELHO SOBE ACIMA DO DORSO, e essa e a conta que faz a mola existir.
   *
   * A primeira versao punha a coxa a meia altura do corpo: o topo dela ficava
   * em 0,43 contra 0,47 do dorso, entao ela sumia DENTRO da barriga e sobrava
   * so uma lasquinha escura na lateral. Gafanhoto de verdade tem o femur
   * espetado acima das costas, e e essa saliencia que promete o salto.
   *
   * As pernas tambem saem mais para fora (0,3 contra 0,22, com o corpo tendo
   * 0,31 de meia-largura): coladas no corpo, elas ficavam atras dele na vista
   * de cima.
   */
  const pernas: THREE.Object3D[] = [];
  for (const s of [-1, 1] as const) {
    const perna = new THREE.Group();
    perna.position.set(s * 0.3 * e, 0, -0.1 * e);
    g.add(perna);
    pernas.push(perna);

    const coxa = new THREE.Mesh(new THREE.CapsuleGeometry(0.082 * e, 0.26 * e, 4, 8), casca);
    coxa.position.set(0, 0.34 * e, -0.1 * e);
    coxa.rotation.x = 0.7;
    perna.add(coxa);

    const canela = new THREE.Mesh(new THREE.CapsuleGeometry(0.035 * e, 0.3 * e, 4, 6), escura);
    canela.position.set(0, 0.18 * e, 0.02 * e);
    canela.rotation.x = -0.9;
    perna.add(canela);

    const pe = patinha(0.07 * e, P.pragaGarra);
    pe.position.set(0, 0.05 * e, 0.14 * e);
    perna.add(pe);
  }

  // e as duas mãozinhas da frente, curtas
  for (const s of [-1, 1] as const) {
    const mao = patinha(0.05 * e, P.pragaGarra);
    mao.position.set(s * 0.15 * e, 0.05 * e, 0.2 * e);
    g.add(mao);
  }

  g.userData.partes = { corpo, pernas };
  return g;
}

/* =========================================================================
 * MEDIOS — aguentam 3 ou 4 jatos, e cada um tem um truque
 * ========================================================================= */

/**
 * COELHATU — coelho + tatu. O blindado que enrola.
 *
 * Duas orelhas compridas saindo de um casco de placas: a mistura lê no
 * primeiro olhar porque as duas metades ocupam partes diferentes da silhueta —
 * o casco e a massa, as orelhas sao o recorte.
 *
 * AS PLACAS SAO MEIAS-CASCAS, e nao caixas. Casca sobre casca deixa o dorso
 * curvo sem nenhuma face coplanar, que e o problema que placa reta sempre traz.
 */
export function coelhatu(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'coelhatu';
  const e = escala;

  const casco = toon(P.pragaCoelhatuCasco);
  const cascoEscuro = toon(P.pragaCoelhatuCascoEscuro);
  const pelo = toon(P.pragaCoelhatu);

  // ------------------------------------------------------------- o corpo
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.34 * e, 10, 8), pelo);
  corpo.scale.set(1, 0.88, 1.2);
  corpo.position.y = 0.32 * e;
  g.add(corpo);

  /**
   * AS PLACAS DO CASCO, tres arcos por cima do dorso. Cada uma e uma calota
   * aberta so por cima (`thetaLength` de meia volta), e elas tem RAIOS
   * DIFERENTES: iguais e empilhadas, as bordas cairiam no mesmo plano.
   */
  /**
   * ELAS PRECISAM SOBRAR DO DORSO, e a primeira versao nao sobrava.
   *
   * O corpo tem o topo em `y = 0,62` (centro 0,32 mais 0,34 x 0,88 de raio). As
   * placas tinham raio 0,35 achatado a 0,78, entao o topo delas dava 0,57 — 5
   * cm DENTRO da barriga. Na foto o bicho aparecia como um lombo liso, e a
   * metade "tatu" simplesmente nao existia.
   *
   * Agora cada uma passa do dorso e tambem do contorno lateral, que e como
   * placa de tatu de verdade e: um anel por FORA do corpo, e nao um adesivo.
   */
  for (const [i, [raio, z]] of ([[0.41, -0.14], [0.39, 0.06], [0.34, 0.25]] as const).entries()) {
    const placa = new THREE.Mesh(
      new THREE.SphereGeometry(raio * e, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.55),
      i % 2 === 0 ? casco : cascoEscuro,
    );
    placa.scale.set(1, 0.85, 0.32);
    placa.position.set(0, 0.29 * e, z * e);
    g.add(placa);
  }

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.38 * e, 0.34 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.2 * e, 10, 8), pelo);
  cranio.scale.set(1, 0.95, 1.1);
  cabeca.add(cranio);

  // o focinho e os dois dentes de roedor, que e o que diz "coelho" antes das
  // orelhas — e o que diz que ele rói a planta
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.11 * e, 8, 6), toon(P.pragaBarriga));
  focinho.scale.set(1.1, 0.8, 0.9);
  focinho.position.set(0, -0.04 * e, 0.16 * e);
  cabeca.add(focinho);
  for (const s of [-1, 1] as const) {
    const dente = new THREE.Mesh(
      new THREE.BoxGeometry(0.045 * e, 0.075 * e, 0.03 * e), toon(P.pragaOlho),
    );
    dente.position.set(s * 0.028 * e, -0.12 * e, 0.2 * e);
    cabeca.add(dente);
  }

  for (const s of [-1, 1] as const) {
    const olho = olhoRedondo(0.062 * e);
    olho.position.set(s * 0.1 * e, 0.06 * e, 0.15 * e);
    cabeca.add(olho);
  }

  // as orelhas: capsulas compridas, abertas em V e inclinadas para tras
  const orelhas: THREE.Object3D[] = [];
  for (const s of [-1, 1] as const) {
    /**
     * EM PE E ABERTAS, e nao deitadas para tras.
     *
     * Com 0,3 rad de queda so uma das duas aparecia: a de tras ficava escondida
     * atras do cranio na vista de cima, e o bicho lia como um coelho de uma
     * orelha. Quase na vertical e abertas em V, as duas sobram acima da cabeca
     * de qualquer angulo — e sao elas que carregam a metade "coelho".
     */
    const orelha = new THREE.Group();
    orelha.position.set(s * 0.1 * e, 0.16 * e, -0.01 * e);
    /**
     * O SINAL DO `rotation.z` ABRE O V — e ele estava invertido.
     *
     * A regra do `CLAUDE.md`: `rotation.z` POSITIVO na peca do lado negativo
     * empurra para DENTRO. Com `s * 0.34` as duas orelhas caiam uma por cima
     * da outra e o coelho ficava com as orelhas CRUZADAS em X. Com o sinal
     * trocado elas abrem em V, que e o desenho que estava escrito aqui.
     */
    orelha.rotation.set(-0.1, 0, s * -0.34);
    cabeca.add(orelha);
    orelhas.push(orelha);

    const fora = new THREE.Mesh(new THREE.CapsuleGeometry(0.06 * e, 0.36 * e, 4, 7), pelo);
    fora.position.y = 0.25 * e;
    orelha.add(fora);
    // o miolo e mais estreito e avanca 3 cm: encostado, dividiria superficie
    const dentro = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.032 * e, 0.28 * e, 4, 6), toon(P.pragaBarriga),
    );
    dentro.position.set(0, 0.25 * e, 0.04 * e);
    orelha.add(dentro);
  }

  // quatro patinhas curtas, mal aparecendo embaixo do casco
  const pernas: THREE.Object3D[] = [];
  for (const sx of [-1, 1] as const) {
    for (const sz of [-1, 1] as const) {
      const pe = patinha(0.08 * e, P.pragaCoelhatuEscuro);
      pe.position.set(sx * 0.22 * e, 0.07 * e, sz * 0.2 * e);
      g.add(pe);
      pernas.push(pe);
    }
  }

  g.rotation.y = (semente - 0.5) * 0.1;
  g.userData.partes = { corpo, cabeca, orelhas, pernas };
  return g;
}

/**
 * TUCANGURU — tucano + canguru. O ladrao.
 *
 * O bico e MAIOR QUE A CABECA, e isso nao e exagero de estilo: e o unico jeito
 * de um bico ler numa camera que olha de cima. Ele tambem e o que denuncia o
 * bicho de longe quando ele esta fugindo com a folha.
 *
 * A postura e de canguru — inclinado para a frente, apoiado na cauda grossa —
 * porque ele precisa parecer que vai DISPARAR. Bicho que rouba e foge tem que
 * parecer rapido parado.
 */
export function tucanguru(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'tucanguru';
  const e = escala;

  const pelo = toon(P.pragaTucanguru);
  const peloEscuro = toon(P.pragaTucanguruEscuro);
  const bicoCor = toon(P.pragaTucanguruBico);
  const bicoEscuro = toon(P.pragaTucanguruBicoEscuro);

  /** o tronco inteiro se inclina para a frente, como canguru parado */
  const tronco = new THREE.Group();
  tronco.position.y = 0.56 * e;
  tronco.rotation.x = -0.24;
  g.add(tronco);

  const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.24 * e, 0.42 * e, 4, 10), pelo);
  corpo.rotation.x = 0.1;
  tronco.add(corpo);

  /**
   * A BOLSA, na barriga. Ela e o placar do roubo: e nela que a folha furtada
   * vai aparecer, entao precisa ser uma concavidade VISIVEL de frente, e nao
   * uma linha na pelagem.
   */
  const bolsa = new THREE.Mesh(new THREE.SphereGeometry(0.19 * e, 10, 8), peloEscuro);
  bolsa.scale.set(1.05, 0.9, 0.62);
  bolsa.position.set(0, -0.1 * e, 0.2 * e);
  tronco.add(bolsa);

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.36 * e, 0.06 * e);
  tronco.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.17 * e, 10, 8), pelo);
  cranio.scale.set(1, 1.05, 1);
  cabeca.add(cranio);

  /**
   * O BICO, duas metades. A de cima e mais longa e curva para baixo na ponta;
   * a de baixo e curta e reta. As duas tem COMPRIMENTOS diferentes de
   * proposito — bico simetrico lê como funil.
   */
  for (const [comp, raio, y, gira, cor] of [
    [0.52, 0.1, 0.02, -0.12, bicoCor],
    [0.36, 0.07, -0.08, 0.08, bicoEscuro],
  ] as const) {
    const metade = new THREE.Mesh(new THREE.ConeGeometry(raio * e, comp * e, 7), cor);
    metade.rotation.x = Math.PI / 2 + gira;
    metade.position.set(0, y * e, (0.14 + comp / 2) * e);
    cabeca.add(metade);
  }

  for (const s of [-1, 1] as const) {
    const olho = olhoRedondo(0.06 * e);
    olho.position.set(s * 0.09 * e, 0.07 * e, 0.11 * e);
    cabeca.add(olho);
  }

  /**
   * A CAUDA GROSSA, o terceiro apoio. Ela sai do tronco e desce ate o chao
   * atras, que e o que impede a peca inclinada de parecer que esta caindo.
   */
  const cauda = new THREE.Mesh(new THREE.CapsuleGeometry(0.11 * e, 0.5 * e, 4, 8), peloEscuro);
  // deitada em 1,15 rad ela desce 0,21 do proprio centro: em 0,16 a ponta
  // furava o chao junto com os pes
  cauda.position.set(0, 0.23 * e, -0.44 * e);
  cauda.rotation.x = 1.15;
  g.add(cauda);

  // as pernas de canguru: coxa curta, canela longa e o PÉ COMPRIDO
  const pernas: THREE.Object3D[] = [];
  for (const s of [-1, 1] as const) {
    /**
     * A ALTURA DO QUADRIL SAI DA CONTA DO PE, e nao de um chute.
     *
     * O pe e uma capsula deitada de raio 0,06 centrada 0,31 abaixo do quadril,
     * entao a sola fica em `quadril - 0,37`. Com o quadril em 0,34 o bicho
     * nascia 8,7 cm ENTERRADO, e isso so apareceu quando o teste mediu — de
     * longe, com ele andando, ninguem repara que o pe some no chao.
     */
    const perna = new THREE.Group();
    perna.position.set(s * 0.15 * e, 0.375 * e, -0.04 * e);
    g.add(perna);
    pernas.push(perna);

    const coxa = new THREE.Mesh(new THREE.CapsuleGeometry(0.095 * e, 0.2 * e, 4, 7), pelo);
    coxa.rotation.x = 0.5;
    perna.add(coxa);

    const canela = new THREE.Mesh(new THREE.CapsuleGeometry(0.055 * e, 0.24 * e, 4, 6), peloEscuro);
    canela.position.set(0, -0.2 * e, 0.06 * e);
    canela.rotation.x = -0.45;
    perna.add(canela);

    const pe = new THREE.Mesh(new THREE.CapsuleGeometry(0.06 * e, 0.22 * e, 4, 6), bicoCor);
    pe.rotation.x = Math.PI / 2;
    pe.position.set(0, -0.31 * e, 0.12 * e);
    perna.add(pe);
  }

  // e os bracinhos curtos, que e o que todo canguru tem de engracado
  for (const s of [-1, 1] as const) {
    const braco = new THREE.Mesh(new THREE.CapsuleGeometry(0.04 * e, 0.12 * e, 4, 6), peloEscuro);
    braco.position.set(s * 0.22 * e, 0.06 * e, 0.14 * e);
    braco.rotation.set(0.6, 0, s * 0.3);
    tronco.add(braco);
  }

  g.rotation.y = (semente - 0.5) * 0.12;
  g.userData.partes = { tronco, cabeca, bolsa, pernas };
  return g;
}

/* =========================================================================
 * TANQUE — lento, muita vida, e muda para onde o jogador tem que estar
 * ========================================================================= */

/**
 * PREGUIPOLVO — preguica + polvo. O tanque.
 *
 * Um corpo grande e lento com SEIS BRACOS que se esticam para os lados. E o
 * melhor desenho de jogo da turma porque ele transforma o alvo em ESCOLHA: os
 * bracos alcancam varios canteiros ao mesmo tempo, e molhar um recolhe so
 * aquele.
 *
 * O CORPO E LARGO E BAIXO, porque largura lê como peso numa camera isometrica
 * — um tanque alto lê como chefe, e chefe e outra coisa. E ele e o unico
 * esverdeado da turma (`P.pragaMusgo`): preguica com limo nas costas e uma
 * imagem real, e aqui ela serve para separar o tanque dos outros de longe.
 */
export function preguipolvo(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'preguipolvo';
  const e = escala;
  const giro = semente * 6.283;

  const musgo = toon(P.pragaMusgo);
  const musgoEscuro = toon(P.pragaMusgoEscuro);
  const barriga = toon(P.pragaBarriga);

  // ------------------------------------------------------------- o corpo
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.48 * e, 12, 9), musgo);
  corpo.scale.set(1.15, 0.82, 1);
  corpo.position.y = 0.44 * e;
  g.add(corpo);

  // as mechas de limo por cima: calotas rasas espalhadas, sem duas no mesmo
  // raio (o mesmo cuidado das placas do coelhatu)
  for (let i = 0; i < 5; i++) {
    const a = giro + (i * 6.283) / 5;
    const r = (0.15 + ((i * 0.37) % 1) * 0.1) * e;
    const mecha = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), musgoEscuro);
    mecha.scale.set(1.2, 0.45, 1.1);
    mecha.position.set(Math.cos(a) * 0.26 * e, (0.66 + i * 0.012) * e, Math.sin(a) * 0.22 * e);
    g.add(mecha);
  }

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.5 * e, 0.36 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.25 * e, 10, 8), musgo);
  cranio.scale.set(1, 0.92, 0.95);
  cabeca.add(cranio);

  /**
   * A MASCARA CLARA em volta dos olhos — a marca da cara da preguica. Ela e
   * uma calota RASA e adiantada, e nao um disco colado: disco no mesmo plano
   * do cranio serrilha.
   */
  const mascara = new THREE.Mesh(new THREE.SphereGeometry(0.21 * e, 10, 8), barriga);
  mascara.scale.set(1.08, 0.72, 0.5);
  mascara.position.set(0, 0.02 * e, 0.13 * e);
  cabeca.add(mascara);

  for (const s of [-1, 1] as const) {
    const olho = olhoRedondo(0.075 * e);
    olho.position.set(s * 0.11 * e, 0.03 * e, 0.19 * e);
    cabeca.add(olho);
  }
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.05 * e, 8, 6), musgoEscuro);
  focinho.position.set(0, -0.08 * e, 0.22 * e);
  cabeca.add(focinho);

  /**
   * OS SEIS BRACOS. Cada um e uma fila de esferas que encolhem e DESCEM, o que
   * da a curva do tentaculo sem nenhuma geometria curva. Eles saem em leque
   * para a frente e para os lados — nada aponta para tras, porque braco atras
   * do corpo nao e visto e nao ameaca canteiro nenhum.
   */
  const bracos: THREE.Object3D[] = [];
  for (let i = 0; i < 6; i++) {
    const a = -1.25 + (i / 5) * 2.5;
    const braco = new THREE.Group();
    braco.position.set(Math.sin(a) * 0.4 * e, 0.4 * e, Math.cos(a) * 0.3 * e);
    braco.rotation.y = a;
    g.add(braco);
    bracos.push(braco);

    const GOMOS = 5;
    for (let j = 0; j < GOMOS; j++) {
      const t = j / (GOMOS - 1);
      /**
       * OS GOMOS TEM QUE SE ENCOSTAR, e os primeiros nao se encostavam.
       *
       * Com o raio caindo de 0,11 para 0,045 ao longo de 0,7 de braco, o passo
       * entre dois gomos (0,175) ficava MAIOR que o diametro deles na ponta
       * (0,09): o braco virava um tracejado de bolinhas soltas no chao, em vez
       * de um tentaculo. A ponta afina menos e o braco encurta um pouco, e o
       * passo (0,13) passa a caber dentro do diametro (0,14).
       */
      const raio = (0.115 - t * 0.045) * e;
      const gomo = new THREE.Mesh(
        new THREE.SphereGeometry(raio, 8, 6),
        j % 2 === 0 ? musgo : musgoEscuro,
      );
      gomo.position.set(0, (0.02 - t * t * 0.34) * e, (0.1 + t * 0.52) * e);
      braco.add(gomo);
      /**
       * AS VENTOSAS, e sao TRES por braco, e nao quatro.
       *
       * Seis bracos vezes quatro ventosas puseram a peca em 73 malhas, acima do
       * teto de 70 que o teste cobra para um tanque — o jogo roda em celular e
       * vao existir varios deles na tela. A quarta ventosa e a da ponta, que e
       * a menor e a que menos aparece.
       */
      if (j > 0 && j < GOMOS - 1) {
        const ventosa = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.34, 6, 5), barriga);
        ventosa.scale.y = 0.5;
        ventosa.position.set(0, gomo.position.y - raio * 0.78, gomo.position.z);
        braco.add(ventosa);
      }
    }
  }

  // os pezinhos, mal aparecendo embaixo do corpo
  for (const sx of [-1, 1] as const) {
    for (const sz of [-1, 1] as const) {
      const pe = patinha(0.1 * e, P.pragaMusgoEscuro);
      pe.position.set(sx * 0.3 * e, 0.08 * e, sz * 0.24 * e);
      g.add(pe);
    }
  }

  g.userData.partes = { corpo, cabeca, bracos };
  return g;
}

/* =========================================================================
 * CHEFE
 * ========================================================================= */

/**
 * MAE-LAGARTEJO — o chefe, e o lagartejo em tamanho de chefe.
 *
 * Ela e de proposito a MESMA peca aumentada, com tres acrescimos: a coroa de
 * folhas roubadas, o dorso mais alto e as pincas maiores. Isso nao e economia:
 * o jogador passou a rodada inteira espantando lagartejos, e ver a mesma
 * silhueta chegando em tamanho de chefe conta a historia dela sem uma linha de
 * texto — *isto ali e a mae daquilo tudo*.
 *
 * A COROA E DE FOLHA DA HORTA, e e o que ela tem de mais malvado: ela nao so
 * come o jardim, ela usa o jardim.
 */
export function maeLagartejo(escala = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mae-lagartejo';
  const e = escala;

  const corpo = lagartejo(1.9 * e, 0.3, 4, P.pragaMae);
  // a etiqueta da filha sai, senao um teste que conta lagartejos conta a mae
  corpo.userData.peca = undefined;
  g.add(corpo);

  /**
   * A CROSTA DO DORSO: tres calotas por cima dos segmentos da frente, em raios
   * diferentes. Ela levanta a silhueta e e o que separa a mae de "um lagartejo
   * que chegou perto da camera".
   */
  for (const [i, [raio, z]] of ([[0.3, 0.16], [0.27, -0.24], [0.22, -0.6]] as const).entries()) {
    const crosta = new THREE.Mesh(
      new THREE.SphereGeometry(raio * 1.9 * e, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5),
      toon(i % 2 === 0 ? P.pragaMaeEscura : P.pragaMaeCrosta),
    );
    crosta.scale.set(1, 0.62, 0.5);
    crosta.position.set(0, 0.34 * 1.9 * e, z * 1.9 * e);
    g.add(crosta);
  }

  /**
   * A COROA DE FOLHAS, em volta da cabeca. Cada folha e uma esfera esticada e
   * inclinada para fora; elas ficam ATRAS dos olhos em talo, para nao taparem
   * a unica parte da cara que se ve de cima.
   */
  const coroa = new THREE.Group();
  coroa.position.set(0, 0.62 * 1.9 * e, 0.3 * 1.9 * e);
  g.add(coroa);
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (0.18 + (i / 6) * 0.64) + Math.PI * 0.6;
    const folha = new THREE.Mesh(
      new THREE.SphereGeometry(0.1 * 1.9 * e, 8, 6),
      toon(i % 2 ? P.leafDark : P.leafMid),
    );
    folha.scale.set(0.42, 0.22, 1.5);
    folha.position.set(Math.cos(a) * 0.17 * 1.9 * e, 0, Math.sin(a) * 0.14 * 1.9 * e);
    folha.rotation.set(-0.5, -a + Math.PI / 2, 0);
    coroa.add(folha);
  }

  g.userData.partes = { ...corpo.userData.partes, coroa };
  return g;
}

/* =========================================================================
 * A SEGUNDA LEVA — as que estreiam da 15ª onda em diante
 *
 * Pedido do Renan: mais bicho para as ondas difíceis, e os TAMANHOS variando
 * — mais pequenininho e mais grandão, os dois. Então a régua ficou mais
 * comprida nas duas pontas: o Formiguriço é o menor da estufa (um palmo), e o
 * Escorpicamelo é o maior (mais alto que a dupla). E, como pediu, fofos: olho
 * grande, corpo redondo, e uma coisa engraçada em cada um (a lingüinha do
 * Tamandubelha, o rabinho de mola da Javaponja, os olhos de caracol do
 * Rinocaracol, os cílios do camelo).
 *
 * O plano de cada um (o que ele FAZ de diferente) está no §5 do
 * `docs/MINIGAME-JARDIM.md`. Aqui, como nos outros seis, é só a geometria.
 * ========================================================================= */

/**
 * LIBELAGARTO — lagartixa + libélula. O que voa.
 *
 * Lagartixa rosa, rente ao chão, com QUATRO ASAS de libélula abertas nas
 * costas. As duas metades não disputam a silhueta: o corpo comprido e as
 * patinhas abertas são a lagartixa, e o X de asas por cima é a libélula — e
 * asa deitada é a única coisa que a câmera de cima enxerga inteira.
 *
 * O plano (§5) é ele voar por cima do muro e pousar em qualquer ponto da
 * borda, e não pelos portões. As asas estão em `partes.asas` para bater.
 */
export function libelagarto(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'libelagarto';
  const e = escala;
  g.rotation.y = (semente - 0.5) * 0.14;

  const pele = toon(P.pragaLibelagarto);
  const escura = toon(P.pragaLibelagartoEscuro);

  // ------------------------------------------------------------- o corpo
  const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.14 * e, 0.3 * e, 4, 10), pele);
  corpo.rotation.x = Math.PI / 2;
  corpo.position.set(0, 0.19 * e, 0);
  g.add(corpo);

  // a barriga clara aparece só por baixo, de lado: é o que dá o volume
  const papo = new THREE.Mesh(new THREE.SphereGeometry(0.12 * e, 10, 6), toon(P.pragaBarriga));
  papo.scale.set(1, 0.55, 2);
  papo.position.set(0, 0.11 * e, 0.03 * e);
  g.add(papo);

  // a crista de lagarto: três espinhos baixos na linha das costas
  for (const [z, alto] of [[0.2, 0.07], [-0.02, 0.08], [-0.22, 0.06]] as const) {
    const espinho = new THREE.Mesh(new THREE.ConeGeometry(0.035 * e, alto * e, 6), escura);
    espinho.position.set(0, (0.31 + alto / 2) * e, z * e);
    g.add(espinho);
  }

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.24 * e, 0.36 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.15 * e, 10, 8), pele);
  cranio.scale.set(1.1, 0.9, 1.1);
  cabeca.add(cranio);
  // cara larga e achatada, de lagartixa sorrindo
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.11 * e, 10, 6), pele);
  focinho.scale.set(1.05, 0.62, 1);
  focinho.position.set(0, -0.05 * e, 0.12 * e);
  cabeca.add(focinho);

  // os olhos GRANDES, nos cantos de cima da cabeça: é o que faz ele ser fofo
  for (const s of [-1, 1] as const) {
    const olho = olhoRedondo(0.078 * e);
    olho.position.set(s * 0.085 * e, 0.075 * e, 0.06 * e);
    cabeca.add(olho);
  }

  /**
   * A CAUDA, em dois gomos que sobem e enrolam na ponta. A primeira era um
   * cone reto e comprido, e na foto lia como um espeto preso no bicho — cauda
   * de lagartixa fofa é grossa na base e faz a curvinha.
   */
  const cauda = new THREE.Group();
  g.add(cauda);
  cauda.add(osso([0, 0.18 * e, -0.3 * e], [0, 0.17 * e, -0.5 * e], 0.1 * e, pele, 8));
  // e a ponta são duas bolinhas subindo, e não um cone: cone lia como espeto
  for (const [r, y, z] of [[0.075, 0.2, -0.64], [0.055, 0.26, -0.74]] as const) {
    const gomo = new THREE.Mesh(new THREE.SphereGeometry(r * e, 8, 6), pele);
    gomo.position.set(0, y * e, z * e);
    cauda.add(gomo);
  }

  /**
   * AS PATAS ABERTAS de lagartixa: saem de lado, dobram no cotovelo e descem.
   * Cada uma é um grupo na origem do bicho, para o minigame subir a pata
   * inteira no passinho sem desmontar o cotovelo.
   */
  const pernas: THREE.Object3D[] = [];
  for (const z of [0.17, -0.17]) {
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Group();
      g.add(perna);
      pernas.push(perna);
      const vai = z > 0 ? 0.05 : -0.04;
      perna.add(osso([s * 0.1 * e, 0.17 * e, z * e], [s * 0.22 * e, 0.15 * e, (z + vai / 2) * e], 0.04 * e, pele));
      perna.add(osso([s * 0.22 * e, 0.15 * e, (z + vai / 2) * e], [s * 0.26 * e, 0.045 * e, (z + vai) * e], 0.035 * e, pele));
      const pe = patinha(0.05 * e, P.pragaGarra);
      pe.position.set(s * 0.27 * e, 0.036 * e, (z + vai + 0.02) * e);
      perna.add(pe);
    }
  }

  /**
   * AS QUATRO ASAS, em X. O par da frente aponta um tico para a frente e o de
   * trás para trás — asas todas paralelas liam como um par de remos. Levantam
   * só 0,16 rad, abertas para os lados como libélula pousada: com 0,4 e
   * estreitas, na foto elas ficavam de perfil e liam como quatro facas
   * espetadas nas costas.
   */
  const asas: THREE.Object3D[] = [];
  for (const [z, gira, comp] of [[0.08, -0.12, 0.42], [-0.1, 0.38, 0.38]] as const) {
    for (const s of [-1, 1] as const) {
      // largas o bastante para lerem como lâmina, e não como fio
      const a = asa(comp * e, 0.17 * e, s);
      a.position.set(s * 0.05 * e, 0.34 * e, z * e);
      a.rotation.set(0, s * gira, s * 0.16);
      g.add(a);
      asas.push(a);
    }
  }

  g.userData.partes = { cabeca, pernas, asas };
  return g;
}

/**
 * FORMIGURIÇO — formiga + ouriço. O menor da estufa.
 *
 * Um palmo de bicho. Corpo de formiga (cabeça, cinturinha, e a bundona atrás,
 * em três bolas), seis perninhas de joelho alto, as antenas dobradas — e a
 * bundona inteira coberta de espinho de ouriço, com a carinha de ouriço na
 * frente: focinho fino e o narizinho preto na ponta.
 *
 * ELE É ESCURO DE PROPÓSITO. Pequeno assim, num saibro bege, bicho claro
 * sumiria; o ameixa escuro com o espinho caramelo é o que desenha ele no chão.
 * O plano (§5) é ele vir em FILA, um atrás do outro — daí o tamanho: uma fila
 * de seis precisa caber no caminho de um portão até um canteiro.
 */
export function formigurico(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'formigurico';
  const e = escala;
  g.rotation.y = (semente - 0.5) * 0.14;

  const casca = toon(P.pragaFormigurico);
  const escura = toon(P.pragaFormiguricoEscuro);
  const espinho = toon(P.pragaFormiguricoEspinho);

  // --------------------------------------- a bundona, a cinturinha, o peito
  const bunda: Ponto = [0, 0.24, -0.28];
  const RAIO = [0.2, 0.18, 0.22] as const;
  const bundona = new THREE.Mesh(new THREE.SphereGeometry(0.2 * e, 12, 9), casca);
  bundona.scale.set(RAIO[0] / 0.2, RAIO[1] / 0.2, RAIO[2] / 0.2);
  bundona.position.set(bunda[0] * e, bunda[1] * e, bunda[2] * e);
  g.add(bundona);

  const cintura = new THREE.Mesh(new THREE.SphereGeometry(0.055 * e, 8, 6), escura);
  cintura.position.set(0, 0.2 * e, -0.04 * e);
  g.add(cintura);

  const peito = new THREE.Mesh(new THREE.SphereGeometry(0.1 * e, 10, 8), casca);
  peito.scale.set(0.9, 0.85, 1.2);
  peito.position.set(0, 0.2 * e, 0.08 * e);
  g.add(peito);

  /**
   * OS ESPINHOS DE OURIÇO, em três aneis pela bundona — mas só de lado e por
   * trás: na frente dela está a cinturinha, e espinho ali furaria o peito.
   * Cada um sai na direção do próprio ponto da casca (o `d`), com metade
   * enterrada, que é o que faz eles parecerem nascer dela e não estarem
   * espetados por fora.
   */
  const aneis: ReadonlyArray<readonly [number, readonly number[]]> = [
    [0.08, [0]],
    [0.27, [-1.5, -0.75, 0, 0.75, 1.5]],
    [0.47, [-1.9, -1.27, -0.63, 0, 0.63, 1.27, 1.9]],
  ];
  for (const [polar, azimutes] of aneis) {
    const t = polar * Math.PI;
    for (const az of azimutes) {
      const d: Ponto = [Math.sin(t) * Math.sin(az), Math.cos(t), -Math.sin(t) * Math.cos(az)];
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.05 * e, 0.19 * e, 5), espinho);
      apontar(cone, d);
      cone.position.set(
        (bunda[0] + d[0] * RAIO[0] * 0.9 + d[0] * 0.07) * e,
        (bunda[1] + d[1] * RAIO[1] * 0.9 + d[1] * 0.07) * e,
        (bunda[2] + d[2] * RAIO[2] * 0.9 + d[2] * 0.07) * e,
      );
      g.add(cone);
    }
  }

  // ------------------------------------------------ a cabeça, de ouriço
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.25 * e, 0.3 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.155 * e, 10, 8), casca);
  cranio.scale.set(1.05, 0.95, 1);
  cabeca.add(cranio);
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.08 * e, 8, 6), toon(P.pragaBarriga));
  focinho.scale.set(0.85, 0.75, 1.5);
  focinho.position.set(0, -0.03 * e, 0.14 * e);
  cabeca.add(focinho);
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.036 * e, 8, 6), toon(P.pragaPupila));
  nariz.position.set(0, -0.02 * e, 0.27 * e);
  cabeca.add(nariz);

  for (const s of [-1, 1] as const) {
    const olho = olhoRedondo(0.078 * e);
    olho.position.set(s * 0.084 * e, 0.055 * e, 0.085 * e);
    cabeca.add(olho);

    // a antena de formiga, com o cotovelo: sobe, dobra e aponta para a frente
    cabeca.add(osso([s * 0.05 * e, 0.11 * e, 0.03 * e], [s * 0.1 * e, 0.25 * e, 0.06 * e], 0.016 * e, escura, 4));
    cabeca.add(osso([s * 0.1 * e, 0.25 * e, 0.06 * e], [s * 0.15 * e, 0.27 * e, 0.18 * e], 0.014 * e, escura, 4));
    const bolinha = new THREE.Mesh(new THREE.SphereGeometry(0.03 * e, 6, 5), escura);
    bolinha.position.set(s * 0.155 * e, 0.27 * e, 0.19 * e);
    cabeca.add(bolinha);
  }

  /**
   * AS SEIS PERNINHAS, CURTAS: saem do peito, dobram num joelho baixo e descem.
   *
   * A primeira versão tinha perna comprida e joelho alto, e na foto o bicho lia
   * como ARANHA — bola escura no meio de um monte de perna fina. Curtas, quase
   * escondidas embaixo dele, quem manda na silhueta passa a ser a bola de
   * espinho e a carinha de ouriço, que é o que ele é.
   */
  const pernas: THREE.Object3D[] = [];
  const R = 0.026;
  for (const [z, joelho, pe] of [[0.14, 0.06, 0.13], [0.08, 0, 0.01], [0.02, -0.06, -0.12]] as const) {
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Group();
      g.add(perna);
      pernas.push(perna);
      const j: Ponto = [s * 0.14 * e, 0.19 * e, (z + joelho) * e];
      perna.add(osso([s * 0.05 * e, 0.19 * e, z * e], j, R * e, escura, 4));
      perna.add(osso(j, [s * 0.18 * e, R * e, (z + pe) * e], R * e, escura, 4));
    }
  }

  g.userData.partes = { cabeca, pernas };
  return g;
}

/* ------------------------------------------------------------ os medios */

/**
 * TAMANDUBELHA — tamanduá + abelha. O que aspira as gotas.
 *
 * Corpo de tamanduá (o focinho comprido de canudo, as patas da frente com
 * garra, o rabão erguido) vestido de abelha: listrado de mel e preto, com as
 * antenas de bolinha e dois pares de asinhas. O rabão é listrado também, e
 * termina no ferrão laranja — é ali que as duas metades se costuram.
 *
 * A LÍNGUA APARECE, rosa, saindo da ponta do focinho. É o jeito dele (§5): ele
 * aspira as gotas do chão antes do jogador, e devolve tudo quando é espantado.
 */
export function tamandubelha(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'tamandubelha';
  const e = escala;
  g.rotation.y = (semente - 0.5) * 0.12;

  const mel = toon(P.pragaTamandubelha);
  const listra = toon(P.pragaTamandubelhaListra);
  const lingua = toon(P.pragaLingua);

  // ------------------------------------------------------------- o corpo
  // o eixo da esfera vai para +Z, para as listras serem fatias em volta dele
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.34 * e, 16, 10), mel);
  corpo.rotation.x = Math.PI / 2;
  corpo.scale.set(0.95, 1.4, 0.88);
  corpo.position.set(0, 0.5 * e, -0.02 * e);
  g.add(corpo);

  /**
   * AS LISTRAS SÃO FATIAS DE UMA ESFERA UM TICO MAIOR, com o mesmo giro e a
   * mesma escala do corpo: um anel por fora dele, e não um adesivo em cima —
   * a lição das placas do Coelhatu. Duas, na metade de trás (a "barriga de
   * abelha"); a da frente ficou lisa para a cara respirar.
   */
  for (const [de, ate] of [[0.44, 0.54], [0.64, 0.74]] as const) {
    const faixa = new THREE.Mesh(
      new THREE.SphereGeometry(0.34 * 1.03 * e, 16, 3, 0, Math.PI * 2, de * Math.PI, (ate - de) * Math.PI),
      listra,
    );
    faixa.rotation.copy(corpo.rotation);
    faixa.scale.copy(corpo.scale);
    faixa.position.copy(corpo.position);
    g.add(faixa);
  }

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.56 * e, 0.5 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.17 * e, 10, 8), mel);
  cranio.scale.set(0.9, 0.85, 1.25);
  cabeca.add(cranio);

  /**
   * O FOCINHO DE CANUDO, afinando e caindo um pouco para a frente. Ele é o
   * tamanduá inteiro: sem ele, o resto é uma abelha gorda.
   */
  const desce: Ponto = [0, -0.29, 0.957];
  const base: Ponto = [0, 0, 0.12];
  const ponta: Ponto = [0, base[1] + desce[1] * 0.46, base[2] + desce[2] * 0.46];
  const canudo = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * e, 0.1 * e, 0.46 * e, 10), mel);
  apontar(canudo, desce);
  canudo.position.set(0, (base[1] + desce[1] * 0.23) * e, (base[2] + desce[2] * 0.23) * e);
  cabeca.add(canudo);
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.045 * e, 8, 6), listra);
  nariz.position.set(0, ponta[1] * e, ponta[2] * e);
  cabeca.add(nariz);
  // a lingüinha: um fio rosa saindo da ponta, com uma bolinha no fim
  const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.012 * e, 0.014 * e, 0.12 * e, 6), lingua);
  apontar(fio, [0, -0.5, 0.87]);
  fio.position.set(0, (ponta[1] - 0.05) * e, (ponta[2] + 0.08) * e);
  cabeca.add(fio);
  const pontaDaLingua = new THREE.Mesh(new THREE.SphereGeometry(0.02 * e, 6, 5), lingua);
  pontaDaLingua.position.set(0, (ponta[1] - 0.1) * e, (ponta[2] + 0.13) * e);
  cabeca.add(pontaDaLingua);

  for (const s of [-1, 1] as const) {
    const olho = olhoRedondo(0.068 * e);
    olho.position.set(s * 0.1 * e, 0.07 * e, 0.08 * e);
    cabeca.add(olho);

    // orelhinha redonda de tamanduá
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.055 * e, 8, 6), mel);
    orelha.scale.set(1, 1, 0.5);
    orelha.position.set(s * 0.12 * e, 0.12 * e, -0.07 * e);
    cabeca.add(orelha);

    // e a antena de abelha, com a bolinha na ponta
    cabeca.add(osso([s * 0.05 * e, 0.12 * e, 0], [s * 0.14 * e, 0.32 * e, 0.1 * e], 0.013 * e, listra, 4));
    const bolinha = new THREE.Mesh(new THREE.SphereGeometry(0.036 * e, 8, 6), listra);
    bolinha.position.set(s * 0.145 * e, 0.335 * e, 0.105 * e);
    cabeca.add(bolinha);
  }

  // ------------------------------------------------------------ as asas
  const asas: THREE.Object3D[] = [];
  for (const [z, gira, comp, larg] of [[0.1, 0.35, 0.44, 0.2], [-0.06, 0.75, 0.3, 0.15]] as const) {
    for (const s of [-1, 1] as const) {
      const a = asa(comp * e, larg * e, s);
      a.position.set(s * 0.08 * e, 0.78 * e, z * e);
      a.rotation.set(0, s * gira, s * 0.55);
      g.add(a);
      asas.push(a);
    }
  }

  /**
   * O RABÃO de tamanduá, erguido, em três bolas que sobem para trás — e
   * listrado, porque é também a barriga da abelha. Na ponta, o ferrão.
   */
  const cauda = new THREE.Group();
  g.add(cauda);
  for (const [i, [r, y, z]] of ([[0.17, 0.56, -0.55], [0.16, 0.7, -0.74], [0.13, 0.84, -0.87]] as const).entries()) {
    const gomo = new THREE.Mesh(new THREE.SphereGeometry(r * e, 10, 8), i % 2 === 0 ? listra : mel);
    gomo.position.set(0, y * e, z * e);
    cauda.add(gomo);
  }
  const ferrao = new THREE.Mesh(new THREE.ConeGeometry(0.035 * e, 0.14 * e, 6), toon(P.pragaGarra));
  apontar(ferrao, [0, 0.55, -0.83]);
  ferrao.position.set(0, 0.95 * e, -1.0 * e);
  cauda.add(ferrao);

  /** as quatro patas curtas e escuras; as da frente com as garras de cavar */
  const pernas: THREE.Object3D[] = [];
  for (const z of [0.25, -0.25]) {
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Group();
      g.add(perna);
      pernas.push(perna);
      perna.add(osso([s * 0.2 * e, 0.36 * e, z * e], [s * 0.23 * e, 0.075 * e, (z + 0.02) * e], 0.075 * e, listra));
      const pe = patinha(0.085 * e, P.pragaTamandubelhaListra);
      pe.position.set(s * 0.23 * e, 0.06 * e, (z + 0.05) * e);
      perna.add(pe);
      if (z > 0) {
        for (const lado of [-1, 1]) {
          const unha = new THREE.Mesh(new THREE.ConeGeometry(0.022 * e, 0.09 * e, 5), toon(P.pragaGarra));
          apontar(unha, [0, -0.35, 1]);
          unha.position.set((s * 0.23 + lado * 0.035) * e, 0.035 * e, (z + 0.15) * e);
          perna.add(unha);
        }
      }
    }
  }

  g.userData.partes = { cabeca, pernas, asas, cauda };
  return g;
}

/**
 * MOSQUIPÓTAMO — hipopótamo + mosquito. O que bebe o tonel.
 *
 * Um hipopótamo gorducho e lilás EM CIMA DE SEIS PERNAS FININHAS de mosquito,
 * com asa comprida e a trombinha de canudo saindo do focinho rosado. A graça
 * inteira é o contraste: o corpo mais redondo da turma equilibrado nas pernas
 * mais finas — é o que se lê de longe, e é engraçado antes de ser ameaça.
 *
 * O jeito dele (§5): ignora canteiro e vai no TONEL beber. A tromba é o canudo.
 */
export function mosquipotamo(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mosquipotamo';
  const e = escala;
  g.rotation.y = (semente - 0.5) * 0.12;

  const pele = toon(P.pragaMosquipotamo);
  const escura = toon(P.pragaMosquipotamoEscuro);
  const rosado = toon(P.pragaMosquipotamoFocinho);

  // ------------------------------------------------------------- o corpo
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.34 * e, 12, 10), pele);
  corpo.scale.set(1.05, 0.9, 1.15);
  corpo.position.set(0, 0.62 * e, 0);
  g.add(corpo);
  // a barriga rosada, aparecendo por baixo entre as pernas
  const barriga = new THREE.Mesh(new THREE.SphereGeometry(0.28 * e, 10, 8), rosado);
  barriga.scale.set(1, 0.7, 1.1);
  barriga.position.set(0, 0.47 * e, 0.05 * e);
  g.add(barriga);
  // e o rabinho de hipopótamo, que é um pompom
  const rabo = new THREE.Mesh(new THREE.SphereGeometry(0.05 * e, 6, 5), escura);
  rabo.scale.set(0.8, 1.2, 0.8);
  rabo.position.set(0, 0.64 * e, -0.39 * e);
  g.add(rabo);

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.7 * e, 0.4 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.22 * e, 10, 8), pele);
  cranio.scale.set(1.05, 0.9, 1);
  cabeca.add(cranio);
  /** o focinhão rosado, mais LARGO que a cabeça — é ele que diz "hipopótamo" */
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.19 * e, 12, 8), rosado);
  focinho.scale.set(1.2, 0.75, 0.85);
  focinho.position.set(0, -0.08 * e, 0.2 * e);
  cabeca.add(focinho);
  for (const s of [-1, 1] as const) {
    // as ventas por cima do focinho, como hipopótamo n'água
    const venta = new THREE.Mesh(new THREE.SphereGeometry(0.03 * e, 6, 5), escura);
    venta.scale.y = 0.6;
    venta.position.set(s * 0.07 * e, 0, 0.33 * e);
    cabeca.add(venta);
    // e os dois dentinhos de baixo, aparecendo
    const dente = new THREE.Mesh(new THREE.BoxGeometry(0.04 * e, 0.06 * e, 0.03 * e), toon(P.pragaOlho));
    dente.position.set(s * 0.08 * e, -0.14 * e, 0.34 * e);
    cabeca.add(dente);

    // os olhos em cima da cabeça, também de hipopótamo
    const olho = olhoRedondo(0.078 * e);
    olho.position.set(s * 0.1 * e, 0.13 * e, 0.04 * e);
    cabeca.add(olho);
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.04 * e, 6, 5), escura);
    orelha.scale.set(0.8, 1.2, 0.6);
    orelha.position.set(s * 0.15 * e, 0.17 * e, -0.08 * e);
    cabeca.add(orelha);

    // as antenas de mosquito, de pluminha na ponta
    cabeca.add(osso([s * 0.06 * e, 0.17 * e, 0.02 * e], [s * 0.15 * e, 0.36 * e, 0.14 * e], 0.012 * e, escura, 4));
    const pluma = new THREE.Mesh(new THREE.SphereGeometry(0.045 * e, 7, 5), escura);
    pluma.scale.set(0.7, 1, 0.7);
    pluma.position.set(s * 0.155 * e, 0.38 * e, 0.15 * e);
    cabeca.add(pluma);
  }
  /** a tromba: o canudo laranja de mosquito, saindo da boca e descendo */
  const tromba = new THREE.Mesh(new THREE.CylinderGeometry(0.012 * e, 0.024 * e, 0.36 * e, 6), toon(P.pragaGarra));
  const rumoDaTromba: Ponto = [0, -0.45, 0.893];
  apontar(tromba, rumoDaTromba);
  tromba.position.set(0, (-0.1 + rumoDaTromba[1] * 0.18) * e, (0.33 + rumoDaTromba[2] * 0.18) * e);
  cabeca.add(tromba);

  // ------------------------------------------------------------ as asas
  const asas: THREE.Object3D[] = [];
  for (const s of [-1, 1] as const) {
    const a = asa(0.6 * e, 0.2 * e, s);
    a.position.set(s * 0.12 * e, 0.9 * e, -0.05 * e);
    // varridas para trás, como mosquito pousado
    a.rotation.set(0, s * 1.0, s * 0.35);
    g.add(a);
    asas.push(a);
  }

  /**
   * AS SEIS PERNAS DE PAU: o fêmur sai do corpo e SOBE até o joelho, e a
   * canela desce comprida até o chão, bem longe do corpo. É a aranha-de-pernas
   * da silhueta, e precisa sobrar do corpo de qualquer ângulo.
   */
  const pernas: THREE.Object3D[] = [];
  const R = 0.022;
  for (const [z, joelho, pe] of [[0.18, 0.12, 0.3], [0, 0, 0.02], [-0.18, -0.12, -0.3]] as const) {
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Group();
      g.add(perna);
      pernas.push(perna);
      const j: Ponto = [s * 0.5 * e, 0.66 * e, (z + joelho) * e];
      perna.add(osso([s * 0.22 * e, 0.5 * e, z * e], j, R * e, escura, 4));
      perna.add(osso(j, [s * 0.64 * e, R * e, (z + pe) * e], R * e, escura, 4));
    }
  }

  g.userData.partes = { cabeca, pernas, asas };
  return g;
}

/* ----------------------------------------------------------- os tanques */

/**
 * RINOCARACOL — rinoceronte + caracol. O que se esconde na concha.
 *
 * Rinoceronte cinza, parrudo, de quatro patas de pilar — com uma CONCHA DE
 * CARACOL enorme nas costas e os olhos na ponta de dois talos, como caracol.
 * O chifre continua lá, laranja: é a arma dele, e a única coisa pontuda.
 *
 * A ESPIRAL É UM TUBO desenhado em cima da concha, dos dois lados, e não um
 * anel em volta: aneis concêntricos liam como alvo de tiro, e espiral é que é
 * caracol. O plano (§5): vem em investida reta, e quando está meio encharcado
 * se fecha na concha uns segundos, sem levar água.
 */
export function rinocaracol(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'rinocaracol';
  const e = escala;
  g.rotation.y = (semente - 0.5) * 0.1;

  const pele = toon(P.pragaRinocaracol);
  const escura = toon(P.pragaRinocaracolEscuro);
  const garra = toon(P.pragaGarra);

  // ------------------------------------------------------------- o corpo
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.52 * e, 14, 10), pele);
  corpo.scale.set(1.15, 0.82, 1.4);
  corpo.position.set(0, 0.72 * e, 0.05 * e);
  g.add(corpo);

  /** as quatro patas de pilar, com duas unhas claras na frente de cada uma */
  const pernas: THREE.Object3D[] = [];
  for (const z of [0.44, -0.4]) {
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Group();
      perna.position.set(s * 0.36 * e, 0, z * e);
      g.add(perna);
      pernas.push(perna);
      const pilar = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * e, 0.17 * e, 0.5 * e, 10), escura);
      pilar.position.y = 0.25 * e;
      perna.add(pilar);
      for (const x of [-0.065, 0.065]) {
        const unha = new THREE.Mesh(new THREE.SphereGeometry(0.045 * e, 6, 5), toon(P.pragaBarriga));
        unha.scale.set(1, 0.7, 0.8);
        unha.position.set(x * e, 0.035 * e, 0.155 * e);
        perna.add(unha);
      }
    }
  }

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.78 * e, 0.82 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.3 * e, 12, 9), pele);
  cranio.scale.set(0.95, 0.85, 1.15);
  cabeca.add(cranio);
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.24 * e, 12, 8), pele);
  focinho.scale.set(1, 0.82, 0.95);
  focinho.position.set(0, -0.1 * e, 0.28 * e);
  cabeca.add(focinho);

  /** o chifrão, na ponta do focinho, e o chifrinho de trás */
  for (const [r, alto, y, z, rumo] of [
    [0.11, 0.38, 0.06, 0.38, [0, 0.95, 0.3]],
    [0.07, 0.18, 0.2, 0.18, [0, 0.97, 0.25]],
  ] as const) {
    const chifre = new THREE.Mesh(new THREE.ConeGeometry(r * e, alto * e, 10), garra);
    apontar(chifre, rumo);
    const n = Math.hypot(...rumo);
    chifre.position.set(0, (y + (rumo[1] / n) * alto / 2) * e, (z + (rumo[2] / n) * alto / 2) * e);
    cabeca.add(chifre);
  }

  for (const s of [-1, 1] as const) {
    const venta = new THREE.Mesh(new THREE.SphereGeometry(0.035 * e, 6, 5), escura);
    venta.scale.z = 0.5;
    venta.position.set(s * 0.1 * e, -0.08 * e, 0.49 * e);
    cabeca.add(venta);

    // orelhinha de rinoceronte, virada para fora
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.07 * e, 8, 6), pele);
    orelha.scale.set(0.7, 1.2, 0.5);
    orelha.position.set(s * 0.25 * e, 0.2 * e, -0.12 * e);
    orelha.rotation.z = s * -0.5;
    cabeca.add(orelha);

    /**
     * OS OLHOS NA PONTA DOS TALOS, de caracol. Ficam no alto e abertos em V,
     * e é aqui que mora a fofura dele: um bicho de uma tonelada olhando por
     * cima de tudo com dois olhinhos de antena.
     */
    cabeca.add(osso([s * 0.09 * e, 0.18 * e, 0], [s * 0.2 * e, 0.5 * e, 0.06 * e], 0.036 * e, pele));
    const olho = olhoRedondo(0.088 * e);
    olho.position.set(s * 0.21 * e, 0.56 * e, 0.07 * e);
    cabeca.add(olho);
  }

  // ----------------------------------------------------------- a concha
  const concha = new THREE.Group();
  concha.position.set(0, 1.2 * e, -0.12 * e);
  g.add(concha);
  const CASCO = { x: 0.31, y: 0.475, z: 0.5 };
  const casca = new THREE.Mesh(new THREE.SphereGeometry(0.5 * e, 16, 12), toon(P.pragaConcha));
  casca.scale.set(CASCO.x / 0.5, CASCO.y / 0.5, CASCO.z / 0.5);
  concha.add(casca);

  /**
   * A ESPIRAL, dos dois lados: um caminho que dá duas voltas e meia, fechando
   * do aro para o miolo, desenhado EM CIMA da casca (o `x` de cada ponto é a
   * própria superfície dela, mais um tico). O miolo é a parte mais estufada.
   */
  for (const s of [-1, 1] as const) {
    const pontos: THREE.Vector3[] = [];
    const N = 44;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const r = 0.9 - t * 0.82;
      const a = -1.9 + t * Math.PI * 5;
      const u = Math.cos(a) * r;
      const v = Math.sin(a) * r;
      const x = s * (CASCO.x * Math.sqrt(Math.max(0, 1 - r * r)) + 0.012);
      pontos.push(new THREE.Vector3(x * e, u * CASCO.y * e, v * CASCO.z * e));
    }
    const caminho = new THREE.CatmullRomCurve3(pontos);
    const espiral = new THREE.Mesh(
      new THREE.TubeGeometry(caminho, 80, 0.028 * e, 5, false), toon(P.pragaConchaEscura),
    );
    concha.add(espiral);
  }

  // o rabinho, com o tufo na ponta
  g.add(osso([0, 0.82 * e, -0.66 * e], [0, 0.62 * e, -0.8 * e], 0.03 * e, pele, 4));
  const tufo = new THREE.Mesh(new THREE.SphereGeometry(0.055 * e, 6, 5), escura);
  tufo.position.set(0, 0.58 * e, -0.83 * e);
  g.add(tufo);

  g.userData.partes = { cabeca, pernas, concha };
  return g;
}

/**
 * JAVAPONJA — javali + esponja-do-mar. O que bebe o jato.
 *
 * Um javali gordo, redondão e baixo, feito de ESPONJA: amarelo, cheio de
 * furinho, com a crina de cerdas no lombo, as presas pra cima, as orelhas
 * caídas e o rabinho de mola. Os furos são o que separa ele de um porquinho
 * amarelo — tirando eles, some a metade "esponja".
 *
 * O jeito dele (§5): os jatos INCHAM ele em vez de espantar logo, e quando
 * finalmente vai embora espirra a água toda numa poça em volta. Por isso ele é
 * o mais REDONDO dos grandes: o corpo é o que vai crescer.
 */
export function javaponja(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'javaponja';
  const e = escala;
  g.rotation.y = (semente - 0.5) * 0.1;

  const esponja = toon(P.pragaJavaponja);
  const escura = toon(P.pragaJavaponjaEscuro);
  const furo = toon(P.pragaJavaponjaFuro);

  // ------------------------------------------------------------- o corpo
  const C = { y: 0.72, x: 0.684, h: 0.534, z: 0.754 };
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.58 * e, 16, 12), esponja);
  corpo.scale.set(C.x / 0.58, C.h / 0.58, C.z / 0.58);
  corpo.position.set(0, C.y * e, 0);
  g.add(corpo);

  /**
   * OS FURINHOS DA ESPONJA: bolinhas escuras achatadas, meio enterradas na
   * casca e deitadas NA NORMAL dela (a conta da elipse), de tamanhos
   * diferentes. Em cima e dos lados, que é o que a câmera vê; embaixo ninguém
   * olha, e a frente é da cabeça.
   */
  const furos: ReadonlyArray<readonly [number, number, number]> = [
    [0.22, 0.5, 0.06], [0.25, -0.45, 0.07], [0.3, 0.88, 0.055], [0.33, -0.92, 0.065],
    [0.37, 0.28, 0.05], [0.4, -0.22, 0.06], [0.42, 0.63, 0.075], [0.45, -0.66, 0.06],
    [0.5, 0.97, 0.05], [0.52, 0.42, 0.055], [0.55, -0.44, 0.068], [0.58, 0.76, 0.05],
    [0.6, -0.8, 0.056], [0.14, -0.9, 0.05],
  ];
  for (const [polar, azimute, r] of furos) {
    const t = polar * Math.PI;
    const a = azimute * Math.PI;
    const d = [Math.sin(t) * Math.sin(a), Math.cos(t), Math.sin(t) * Math.cos(a)];
    const normal = new THREE.Vector3(d[0] / C.x, d[1] / C.h, d[2] / C.z).normalize();
    const buraco = new THREE.Mesh(new THREE.SphereGeometry(r * e, 8, 6), furo);
    buraco.scale.z = 0.35;
    buraco.quaternion.setFromUnitVectors(FRENTE, normal);
    buraco.position.set(d[0] * C.x * 0.99 * e, (C.y + d[1] * C.h * 0.99) * e, d[2] * C.z * 0.99 * e);
    g.add(buraco);
  }

  // a crina: cinco cerdas pelo lombo, deitadas para trás
  for (const z of [0.45, 0.25, 0.05, -0.15, -0.35]) {
    const topo = C.y + C.h * Math.sqrt(1 - (z / C.z) ** 2);
    const cerda = new THREE.Mesh(new THREE.ConeGeometry(0.055 * e, 0.17 * e, 6), furo);
    cerda.rotation.x = -0.45;
    cerda.position.set(0, (topo + 0.045) * e, (z - 0.02) * e);
    g.add(cerda);
  }

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 0.72 * e, 0.72 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.38 * e, 14, 10), esponja);
  cranio.scale.set(1.05, 0.95, 1);
  cabeca.add(cranio);
  /** o focinho de disco, que é o javali de frente */
  const focinho = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * e, 0.2 * e, 0.2 * e, 14), escura);
  focinho.rotation.x = Math.PI / 2;
  focinho.position.set(0, -0.1 * e, 0.4 * e);
  cabeca.add(focinho);

  for (const s of [-1, 1] as const) {
    const venta = new THREE.Mesh(new THREE.SphereGeometry(0.042 * e, 8, 6), furo);
    venta.scale.z = 0.4;
    venta.position.set(s * 0.065 * e, -0.1 * e, 0.5 * e);
    cabeca.add(venta);

    // as presas, saindo do canto da boca e subindo para fora
    const presa = new THREE.Mesh(new THREE.ConeGeometry(0.045 * e, 0.2 * e, 7), toon(P.pragaOlho));
    apontar(presa, [s * 0.35, 0.9, 0.25]);
    presa.position.set(s * 0.19 * e, -0.11 * e, 0.44 * e);
    cabeca.add(presa);

    const olho = olhoRedondo(0.09 * e);
    olho.position.set(s * 0.15 * e, 0.12 * e, 0.28 * e);
    cabeca.add(olho);

    /**
     * AS ORELHAS CAÍDAS, de porquinho: uma folha achatada que sai do alto da
     * cabeça e tomba para a frente e para fora. A primeira era um cone em pé,
     * e na foto lia como chifre.
     */
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.13 * e, 10, 6), esponja);
    orelha.scale.set(0.62, 0.24, 1);
    orelha.position.set(s * 0.25 * e, 0.3 * e, 0.02 * e);
    orelha.rotation.set(0.55, s * -0.45, s * -0.55);
    cabeca.add(orelha);
  }

  /** as patas curtas, de casco escuro */
  const pernas: THREE.Object3D[] = [];
  for (const z of [0.42, -0.42]) {
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Group();
      g.add(perna);
      pernas.push(perna);
      perna.add(osso([s * 0.36 * e, 0.34 * e, z * e], [s * 0.38 * e, 0.15 * e, (z + 0.02) * e], 0.12 * e, escura));
      const casco = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * e, 0.13 * e, 0.1 * e, 10), furo);
      casco.position.set(s * 0.38 * e, 0.05 * e, (z + 0.02) * e);
      perna.add(casco);
    }
  }

  // o rabinho de mola: um anel quase fechado, de pé, visto de lado
  const rabo = new THREE.Mesh(new THREE.TorusGeometry(0.075 * e, 0.024 * e, 6, 14, Math.PI * 1.6), escura);
  rabo.rotation.y = Math.PI / 2;
  rabo.position.set(0, 0.86 * e, -0.8 * e);
  g.add(rabo);

  g.userData.partes = { cabeca, pernas };
  return g;
}

/* -------------------------------------------------------------- o chefe */

/**
 * ESCORPICAMELO — camelo + escorpião. O chefe novo, e o maior bicho da estufa.
 *
 * Um camelo alto, de duas corcovas, pernas compridas de joelho grosso e o
 * pescoção em curva — e, no lugar do rabo, a CAUDA DE ESCORPIÃO subindo por
 * trás e fazendo o arco por cima das corcovas, com o ferrão laranja apontando
 * para a frente. De longe ele é a silhueta mais alta do jardim; de perto, ele
 * é um camelo ranzinza de beiço caído e cílio comprido.
 *
 * O jeito dele (§5): entra e vai direto no TONEL beber — as corcovas enchem e
 * o tonel seca —, e quando está meio encharcado as corcovas murcham e ele fica
 * rápido. Por isso as corcovas estão em `partes.corcovas`: são elas que vão
 * encher e murchar.
 */
export function escorpicamelo(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'escorpicamelo';
  const e = escala;
  g.rotation.y = (semente - 0.5) * 0.08;

  const pelo = toon(P.pragaCamelo);
  const escuro = toon(P.pragaCameloEscuro);
  const claro = toon(P.pragaCameloClaro);

  // ------------------------------------------------------------- o corpo
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.5 * e, 14, 10), pelo);
  corpo.scale.set(0.9, 0.78, 1.4);
  corpo.position.set(0, 1.3 * e, 0);
  g.add(corpo);
  const barriga = new THREE.Mesh(new THREE.SphereGeometry(0.42 * e, 12, 8), claro);
  barriga.scale.set(0.85, 0.55, 1.25);
  barriga.position.set(0, 1.12 * e, 0.05 * e);
  g.add(barriga);

  const corcovas: THREE.Object3D[] = [];
  for (const [r, z] of [[0.3, 0.26], [0.28, -0.3]] as const) {
    const corcova = new THREE.Mesh(new THREE.SphereGeometry(r * e, 12, 9), pelo);
    corcova.scale.set(0.85, 0.95, 1);
    corcova.position.set(0, 1.72 * e, z * e);
    g.add(corcova);
    corcovas.push(corcova);
  }

  /** as pernas compridas: coxa, o joelho grosso de camelo, a canela e o pé chato */
  const pernas: THREE.Object3D[] = [];
  for (const z of [0.45, -0.45]) {
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Group();
      g.add(perna);
      pernas.push(perna);
      const joelho: Ponto = [s * 0.26 * e, 0.6 * e, (z + 0.04) * e];
      perna.add(osso([s * 0.24 * e, 1.08 * e, z * e], joelho, 0.1 * e, pelo));
      const bola = new THREE.Mesh(new THREE.SphereGeometry(0.105 * e, 8, 6), escuro);
      bola.position.set(...joelho);
      perna.add(bola);
      perna.add(osso(joelho, [s * 0.26 * e, 0.14 * e, z * e], 0.07 * e, pelo));
      const pe = new THREE.Mesh(new THREE.SphereGeometry(0.14 * e, 10, 6), escuro);
      pe.scale.set(1.1, 0.45, 1.3);
      pe.position.set(s * 0.26 * e, 0.063 * e, (z + 0.05) * e);
      perna.add(pe);
    }
  }

  /** o pescoção: um tubo só, na curva de camelo — desce, e sobe até a cabeça */
  const pescoco = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.42 * e, 0.52 * e),
    new THREE.Vector3(0, 1.45 * e, 0.86 * e),
    new THREE.Vector3(0, 1.74 * e, 1.1 * e),
    new THREE.Vector3(0, 2.03 * e, 1.18 * e),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(pescoco, 20, 0.14 * e, 9, false), pelo));

  // ------------------------------------------------------------ a cabeca
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 2.1 * e, 1.22 * e);
  g.add(cabeca);

  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.2 * e, 12, 9), pelo);
  cranio.scale.set(0.9, 0.88, 1.1);
  cabeca.add(cranio);
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.17 * e, 12, 8), pelo);
  focinho.scale.set(0.92, 0.78, 1.15);
  focinho.position.set(0, -0.06 * e, 0.2 * e);
  cabeca.add(focinho);
  /** o beiço caído — a cara de camelo ranzinza, que é mais engraçada que brava */
  const beico = new THREE.Mesh(new THREE.SphereGeometry(0.1 * e, 10, 6), claro);
  beico.scale.set(1.1, 0.55, 1);
  beico.position.set(0, -0.17 * e, 0.26 * e);
  cabeca.add(beico);
  // o topete de pelo no alto da cabeça
  const topete = new THREE.Mesh(new THREE.SphereGeometry(0.09 * e, 8, 6), escuro);
  topete.scale.set(1.3, 0.7, 1);
  topete.position.set(0, 0.17 * e, -0.02 * e);
  cabeca.add(topete);

  for (const s of [-1, 1] as const) {
    const venta = new THREE.Mesh(new THREE.SphereGeometry(0.028 * e, 6, 5), toon(P.pragaPupila));
    venta.scale.set(1.4, 0.5, 0.6);
    venta.position.set(s * 0.06 * e, 0, 0.355 * e);
    cabeca.add(venta);

    const olho = olhoRedondo(0.075 * e);
    olho.position.set(s * 0.11 * e, 0.07 * e, 0.12 * e);
    cabeca.add(olho);
    /**
     * OS CÍLIOS, dois por olho, no canto de cima e de FORA — camelo é famoso
     * pelo cílio. Ficam acima da pupila (que sobe 0,45 rad) e abrem para fora:
     * cílio por cima do olho leria como a sobrancelha que o Renan mandou tirar.
     */
    for (const [dx, dy, abre] of [[0.045, 0.068, 0.5], [0.07, 0.05, 0.95]] as const) {
      const cilio = new THREE.Mesh(new THREE.CylinderGeometry(0.006 * e, 0.009 * e, 0.07 * e, 4), toon(P.pragaPupila));
      cilio.position.set((s * 0.11 + s * dx) * e, (0.07 + dy + 0.02) * e, 0.15 * e);
      cilio.rotation.set(0.3, 0, s * -abre);
      cabeca.add(cilio);
    }

    // a orelhinha é redonda e da cor do pelo: comprida e escura, lia como chifre
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.05 * e, 8, 6), pelo);
    orelha.scale.set(0.7, 1.15, 0.55);
    orelha.position.set(s * 0.15 * e, 0.14 * e, -0.08 * e);
    orelha.rotation.z = s * -0.6;
    cabeca.add(orelha);
  }

  /**
   * A CAUDA DE ESCORPIÃO: dez gomos por uma curva que sai do traseiro, sobe
   * para trás e faz o arco por cima das corcovas. O passo entre dois gomos
   * (≈0,19) é MENOR que o diâmetro deles (0,23) — a lição do Preguipolvo:
   * passo maior que o gomo vira tracejado de bolinha. No fim, o bulbo e o
   * ferrão laranja, apontando para a frente e para baixo.
   */
  const caminho = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.42, -0.62),
    new THREE.Vector3(0, 1.6, -0.92),
    new THREE.Vector3(0, 1.98, -1.02),
    new THREE.Vector3(0, 2.3, -0.88),
    new THREE.Vector3(0, 2.48, -0.58),
    new THREE.Vector3(0, 2.46, -0.3),
  ]);
  const cauda = new THREE.Group();
  g.add(cauda);
  const GOMOS = 10;
  for (let i = 0; i < GOMOS; i++) {
    const p = caminho.getPointAt(0.04 + (i / (GOMOS - 1)) * 0.92);
    const gomo = new THREE.Mesh(
      new THREE.SphereGeometry((0.125 - i * 0.002) * e, 10, 7),
      toon(i % 2 === 0 ? P.pragaEscorpiao : P.pragaEscorpiaoClaro),
    );
    gomo.position.copy(p).multiplyScalar(e);
    cauda.add(gomo);
  }
  const fim = caminho.getPointAt(1);
  const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.15 * e, 10, 8), toon(P.pragaEscorpiaoClaro));
  bulbo.scale.set(1, 0.9, 1.2);
  bulbo.position.set(0, (fim.y - 0.04) * e, (fim.z + 0.1) * e);
  cauda.add(bulbo);
  const rumo: Ponto = [0, -0.6, 0.8];
  const ferrao = new THREE.Mesh(new THREE.ConeGeometry(0.055 * e, 0.22 * e, 8), toon(P.pragaGarra));
  apontar(ferrao, rumo);
  ferrao.position.set(0, (fim.y - 0.04 - 0.6 * 0.24) * e, (fim.z + 0.1 + 0.8 * 0.24) * e);
  cauda.add(ferrao);

  g.userData.partes = { cabeca, pernas, corcovas, cauda };
  return g;
}

/* =========================================================================
 * O CATALOGO
 * ========================================================================= */

/**
 * O TAMANHO DE CADA UM, e por que ele nao e 1 para todos.
 *
 * Bicho fraco e um bicho PEQUENO. A peca e a mesma, so encolhida: um Lagartejo
 * de 42 cm de altura ao lado de um Coelhatu de 1 m nao precisa de nenhuma
 * explicacao, e essa diferenca continua legivel com cinco deles em movimento —
 * que e o momento em que ninguem tem tempo de olhar a cara de ninguem.
 *
 * Ela NAO e a unica coisa que conta o perigo: quem diz quanta agua falta e a
 * BARRA DE VIDA em cima da cabeca (§5 do plano), que o minigame desenha. O
 * tamanho e a leitura de relance; a barra e a leitura exata.
 */
const ESCALA_DO_TIER = { fraco: 0.72, medio: 1, tanque: 1, chefe: 1 } as const;

/**
 * O CATALOGO, para quem for montar onda e para os testes.
 *
 * A ordem e a do tier: os quatro fracos, os quatro medios, os tres tanques e
 * os dois chefes (a primeira leva e a segunda misturadas por tier). O
 * `encharque` e o `alturaDaBarra` sao o contrato do desenho com o jogo —
 * quanto jato ele aguenta, e onde a barra de vida tem que flutuar para nao
 * atravessar a cabeca dele — e ficam aqui porque quem desenhou e quem sabe.
 */
export interface FichaDePraga {
  readonly id: string;
  readonly nome: string;
  readonly tier: 'fraco' | 'medio' | 'tanque' | 'chefe';
  readonly mistura: string;
  /** quantos jatos de regador basico ele aguenta */
  readonly encharque: number;
  /** a que altura pendurar a barra de vida, em metros do chao */
  readonly alturaDaBarra: number;
  /**
   * quantas GOTAS (a experiencia da rodada) ele solta ao ser espantado. Sobe
   * com o tier, na mesma regua do `encharque`: quem deu mais trabalho paga
   * mais (§7 do `docs/MINIGAME-JARDIM.md`)
   */
  readonly gotas: number;
  /**
   * como a Josefina chama ele no grito ("É A Mãe-Lagartejo!", "É O
   * Escorpicamelo!"). Só o chefe é chamado pelo nome; sem isto, é "o".
   */
  readonly artigo?: 'o' | 'a';
  /** ja vem com a escala do tier aplicada; o argumento multiplica por cima */
  readonly monta: (escala?: number, semente?: number) => THREE.Group;
}

export const PRAGAS: readonly FichaDePraga[] = [
  {
    id: 'lagartejo', nome: 'Lagartejo', tier: 'fraco',
    mistura: 'lagarta + caranguejo', encharque: 2, alturaDaBarra: 0.72, gotas: 1,
    monta: (e = 1, s) => lagartejo(ESCALA_DO_TIER.fraco * e, s),
  },
  {
    id: 'gafanhopo', nome: 'Gafanhopo', tier: 'fraco',
    mistura: 'gafanhoto + sapo', encharque: 2, alturaDaBarra: 0.74, gotas: 1,
    monta: (e = 1, s) => gafanhopo(ESCALA_DO_TIER.fraco * e, s),
  },
  /*
   * O MENOR DA ESTUFA: o fraco já é encolhido a 0,72, e o Formiguriço encolhe
   * mais 0,72 por cima — um palmo de bicho. Pedido do Renan: variar os
   * tamanhos, mais pequenininho e mais grandão.
   */
  {
    id: 'libelagarto', nome: 'Libelagarto', tier: 'fraco',
    mistura: 'lagartixa + libélula', encharque: 2, alturaDaBarra: 0.5, gotas: 1,
    monta: (e = 1, s) => libelagarto(ESCALA_DO_TIER.fraco * e, s),
  },
  {
    id: 'formigurico', nome: 'Formiguriço', tier: 'fraco',
    mistura: 'formiga + ouriço', encharque: 1, alturaDaBarra: 0.42, gotas: 1,
    monta: (e = 1, s) => formigurico(ESCALA_DO_TIER.fraco * 0.72 * e, s),
  },
  {
    id: 'coelhatu', nome: 'Coelhatu', tier: 'medio',
    mistura: 'coelho + tatu', encharque: 4, alturaDaBarra: 1.25, gotas: 3,
    monta: (e = 1, s) => coelhatu(ESCALA_DO_TIER.medio * e, s),
  },
  {
    id: 'tucanguru', nome: 'Tucanguru', tier: 'medio',
    mistura: 'tucano + canguru', encharque: 3, alturaDaBarra: 1.45, gotas: 2,
    monta: (e = 1, s) => tucanguru(ESCALA_DO_TIER.medio * e, s),
  },
  {
    id: 'tamandubelha', nome: 'Tamandubelha', tier: 'medio',
    mistura: 'tamanduá + abelha', encharque: 3, alturaDaBarra: 1.25, gotas: 2,
    monta: (e = 1, s) => tamandubelha(ESCALA_DO_TIER.medio * e, s),
  },
  {
    id: 'mosquipotamo', nome: 'Mosquipótamo', tier: 'medio',
    mistura: 'hipopótamo + mosquito', encharque: 4, alturaDaBarra: 1.35, gotas: 3,
    monta: (e = 1, s) => mosquipotamo(ESCALA_DO_TIER.medio * e, s),
  },
  {
    id: 'preguipolvo', nome: 'Preguipolvo', tier: 'tanque',
    mistura: 'preguiça + polvo', encharque: 10, alturaDaBarra: 1.1, gotas: 8,
    monta: (e = 1, s) => preguipolvo(ESCALA_DO_TIER.tanque * e, s),
  },
  {
    id: 'rinocaracol', nome: 'Rinocaracol', tier: 'tanque',
    mistura: 'rinoceronte + caracol', encharque: 12, alturaDaBarra: 1.9, gotas: 8,
    monta: (e = 1, s) => rinocaracol(ESCALA_DO_TIER.tanque * e, s),
  },
  {
    id: 'javaponja', nome: 'Javaponja', tier: 'tanque',
    mistura: 'javali + esponja-do-mar', encharque: 11, alturaDaBarra: 1.6, gotas: 8,
    monta: (e = 1, s) => javaponja(ESCALA_DO_TIER.tanque * e, s),
  },
  {
    id: 'mae-lagartejo', nome: 'Mãe-Lagartejo', tier: 'chefe', artigo: 'a',
    mistura: 'o lagartejo em tamanho de chefe', encharque: 18, alturaDaBarra: 1.62, gotas: 25,
    monta: (e = 1) => maeLagartejo(ESCALA_DO_TIER.chefe * e),
  },
  {
    id: 'escorpicamelo', nome: 'Escorpicamelo', tier: 'chefe', artigo: 'o',
    mistura: 'camelo + escorpião', encharque: 22, alturaDaBarra: 2.85, gotas: 25,
    monta: (e = 1, s) => escorpicamelo(ESCALA_DO_TIER.chefe * e, s),
  },
];
