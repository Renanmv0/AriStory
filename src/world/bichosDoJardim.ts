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
 * gato. Usar qualquer um deles como metade de uma praga faria o jogador regar
 * uma caricatura de gente de quem ele gosta. As dez metades usadas aqui —
 * lagarta, caranguejo, gafanhoto, sapo, coelho, tatu, tucano, canguru,
 * preguica e polvo — nao pertencem a ninguem.
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
 * A ordem e a do plano: dois fracos, dois medios, um tanque, um chefe. O
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
  /** ja vem com a escala do tier aplicada; o argumento multiplica por cima */
  readonly monta: (escala?: number, semente?: number) => THREE.Group;
}

export const PRAGAS: readonly FichaDePraga[] = [
  {
    id: 'lagartejo', nome: 'Lagartejo', tier: 'fraco',
    mistura: 'lagarta + caranguejo', encharque: 2, alturaDaBarra: 0.72,
    monta: (e = 1, s) => lagartejo(ESCALA_DO_TIER.fraco * e, s),
  },
  {
    id: 'gafanhopo', nome: 'Gafanhopo', tier: 'fraco',
    mistura: 'gafanhoto + sapo', encharque: 2, alturaDaBarra: 0.74,
    monta: (e = 1, s) => gafanhopo(ESCALA_DO_TIER.fraco * e, s),
  },
  {
    id: 'coelhatu', nome: 'Coelhatu', tier: 'medio',
    mistura: 'coelho + tatu', encharque: 4, alturaDaBarra: 1.25,
    monta: (e = 1, s) => coelhatu(ESCALA_DO_TIER.medio * e, s),
  },
  {
    id: 'tucanguru', nome: 'Tucanguru', tier: 'medio',
    mistura: 'tucano + canguru', encharque: 3, alturaDaBarra: 1.45,
    monta: (e = 1, s) => tucanguru(ESCALA_DO_TIER.medio * e, s),
  },
  {
    id: 'preguipolvo', nome: 'Preguipolvo', tier: 'tanque',
    mistura: 'preguiça + polvo', encharque: 10, alturaDaBarra: 1.1,
    monta: (e = 1, s) => preguipolvo(ESCALA_DO_TIER.tanque * e, s),
  },
  {
    id: 'mae-lagartejo', nome: 'Mãe-Lagartejo', tier: 'chefe',
    mistura: 'o lagartejo em tamanho de chefe', encharque: 18, alturaDaBarra: 1.62,
    monta: (e = 1) => maeLagartejo(ESCALA_DO_TIER.chefe * e),
  },
];
