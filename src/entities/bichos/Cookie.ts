import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O COOKIE, o elefante da bilheteria da roda gigante. O nome e a historia sao
 * do Renan: um elefante bonzinho que assusta as pessoas so pelo tamanho, que
 * ama doce pequenininho, e que sonha em andar na roda gigante e nunca coube.
 *
 * ELE E GRANDE DE PROPOSITO, e o tamanho e a historia dele: 2,05 do chao ao
 * alto da cabeca, contra 1,75 de uma pessoa e 3,4 da bilheteria inteira. Um
 * elefante fofo mas pequeno seria um bichinho a mais no parque — o que faz a
 * lore dele funcionar e ele ser MAIOR que o casal e, ainda assim, manso.
 *
 * O QUE FAZ UM BLOCO CINZA VIRAR ELEFANTE, em ordem de importancia:
 *
 * 1. a TROMBA, e ela e uma corrente de gomos encadeados (cada um filho do
 *    anterior), afinando da raiz para a ponta. Gomo unico balanca uma barra
 *    rigida; encadeada, a ponta chega depois e a curva chicoteia. E a mesma
 *    matematica do rabo do Pelusa e do pescoco da Gina;
 * 2. as ORELHAS, e elas precisam ser GRANDES e CHATAS. Elefante de desenho e
 *    lido pela silhueta da orelha antes de qualquer outra coisa — sao dois
 *    leques de 0,8 de altura, quase do tamanho da cabeca;
 * 3. as PATAS COLUNA. Elefante nao tem perna, tem pilar: cilindro grosso,
 *    quase sem afinar, com a almofada do pe e tres unhas. Perna em capsula
 *    fina, do jeito que o gato e o cachorro usam, o transformaria em cavalo;
 * 4. a TESTA ABAULADA em duas cupulas. O cranio de elefante sobe em duas
 *    bossas com um vinco no meio, e e isso que separa a cabeca dele da de um
 *    hipopotamo.
 *
 * O CINZA PUXA PARA O ROXO (`P.elefantePele`), e nao para o azul: cinza
 * azulado, no toon shading, sai como pedra.
 */
export class Cookie extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly tromba: THREE.Group[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly patas: THREE.Group[] = [];
  private readonly olhos: THREE.Group[] = [];
  private readonly rabo: THREE.Group[] = [];

  /**
   * O SONHO: quanto tempo ele ainda fica olhando para o alto, em segundos.
   *
   * A cena liga isto na fala em que ele conta da roda gigante. Nao e um estado
   * do cerebro — ele continua respirando e abanando a orelha do mesmo jeito,
   * so a cabeca e a tromba sobem.
   */
  private sonhando = 0;
  /** para onde ele deve virar o corpo, quando a cena manda encarar alguem */
  private encarando: { x: number; z: number } | null = null;

  constructor(area: AreaDoBicho) {
    super(area, {
      // elefante nao corre: passo largo e lento. E a lentidao dele que faz o
      // tamanho ler como manso em vez de ameacador
      velocidade: 0.42,
      descansoMin: 1.6,
      descansoMax: 3.6,
      // ele nao senta: elefante sentado vira circo, e o Cookie e um bicho que
      // mora ali, nao um numero
      chanceDeSentar: 0,
      somCadaMin: 13,
      somCadaMax: 26,
      duracaoDoCarinho: 4.6,
      semente: 20260907,
    });
    this.montar();
    this.prontoParaAparecer('cookie');
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const pele = toon(P.elefantePele);
    const escuro = toon(P.elefanteEscuro);
    const claro = toon(P.elefanteClaro);
    const rosa = toon(P.elefanteOrelha);

    /**
     * O TRONCO E UM ELIPSOIDE, e nao uma capsula deitada: capsula girada poe o
     * comprimento no eixo X, e a cabeca e o rabo moram no Z — o bicho sairia
     * atravessado em relacao a propria cabeca. Elefante e um barril alto: mais
     * alto que largo, e com a cernelha (a bossa do ombro) subindo na frente.
     */
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pele);
    tronco.scale.set(0.6, 0.58, 0.82);
    tronco.position.y = 1.24;
    this.corpo.add(tronco);

    const cernelha = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
    cernelha.scale.set(0.5, 0.42, 0.4);
    cernelha.position.set(0, 1.5, 0.3);
    this.corpo.add(cernelha);

    // a barriga, um tom mais claro e baixa: e o que tira a cara de balao liso
    const barriga = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), claro);
    barriga.scale.set(0.5, 0.32, 0.7);
    barriga.position.set(0, 1.02, -0.02);
    this.corpo.add(barriga);

    // ------------------------------------------------------------- as patas
    /**
     * PATA COLUNA. Cilindro grosso que quase nao afina (0,21 embaixo contra
     * 0,24 em cima), pivo no ombro, almofada do pe e tres unhas. A almofada
     * encosta no chao: um cilindro de altura `h` centrado em `-h/2` a partir da
     * base da perna, senao o bicho flutua.
     */
    for (const [x, z] of [
      [-0.38, 0.42], [0.38, 0.42], [-0.4, -0.44], [0.4, -0.44],
    ] as const) {
      const perna = new THREE.Group();
      perna.position.set(x, 0.86, z);

      const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 0.72, 10), pele);
      coluna.position.y = -0.36;
      perna.add(coluna);

      const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.235, 0.14, 12), escuro);
      pe.position.y = -0.79;
      perna.add(pe);

      // tres unhas na frente do pe, achatadas contra a almofada
      for (const u of [-1, 0, 1] as const) {
        const unha = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), toon(P.elefanteUnha));
        unha.scale.set(1, 0.7, 0.6);
        unha.position.set(u * 0.11, -0.8, 0.2);
        perna.add(unha);
      }

      this.corpo.add(perna);
      this.patas.push(perna);
    }

    // ------------------------------------------------------------- a cabeca
    // etiqueta: e por ela que o teste acha a cabeca para medir, em vez de
    // adivinhar qual grupo e qual (o Capy e a Gina fazem igual)
    this.cabeca.name = 'cabeca-do-cookie';
    this.cabeca.position.set(0, 1.7, 0.8);

    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 12), pele);
    cranio.scale.set(0.38, 0.36, 0.34);
    this.cabeca.add(cranio);

    /**
     * A TESTA EM DUAS BOSSAS, com o vinco no meio. E o que separa a cabeca de
     * elefante da de hipopotamo — o cranio dele sobe em duas cupulas, e nao
     * numa calota lisa.
     */
    for (const lado of [-1, 1] as const) {
      const bossa = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
      bossa.scale.set(0.21, 0.2, 0.2);
      bossa.position.set(lado * 0.15, 0.25, 0.06);
      this.cabeca.add(bossa);
    }

    // ------------------------------------------------------------ as orelhas
    /**
     * O LEQUE. Uma esfera achatada em X vira um disco de borda arredondada —
     * mais barato e mais fofo que um plano recortado, e nao tem face de tras
     * sumindo quando a camera gira.
     *
     * PEGADINHA DE SINAL: a orelha da esquerda nasce em `x` NEGATIVO, entao e
     * `rotation.z` NEGATIVO nela que abre para fora. O `lado` multiplica.
     */
    for (const lado of [-1, 1] as const) {
      const orelha = new THREE.Group();
      orelha.position.set(lado * 0.3, 0.04, -0.02);
      orelha.rotation.z = lado * 0.2;
      /**
       * O SINAL DESTE GIRO E O QUE FAZ A ORELHA APARECER. O leque e chato no
       * eixo X, entao a cara dele aponta para `±X`; girando em `Y` para o lado
       * ERRADO (`-0,55`) ela vira para tras e, da camera, some numa lasca
       * cinza. Com `+0,55` o leque abre para a FRENTE e para fora — que e como
       * elefante de desenho e reconhecido antes de qualquer outra coisa.
       */
      orelha.rotation.y = lado * 0.55;

      // e ela recua um pouco (`z = −0,12`): centrada na cabeca, ela engolia a
      // bochecha e o olho, e o bicho ficava sem rosto
      const leque = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), pele);
      leque.scale.set(0.05, 0.4, 0.36);
      leque.position.set(lado * 0.06, -0.04, -0.12);
      orelha.add(leque);

      /*
       * O ROSADO VAI NA FACE DE DENTRO, que e a que a camera ve.
       *
       * Com o leque girado `+0,55` em Y, a normal de FORA (`+X`) aponta para
       * tras; quem sobra virada para a frente e a de DENTRO, em `x` quase zero.
       * O rosa nasceu do lado errado (`+0,028`, enterrado no meio do leque) e
       * simplesmente nao existia na tela.
       */
      const dentro = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), rosa);
      dentro.scale.set(0.022, 0.31, 0.28);
      dentro.position.set(lado * -0.005, -0.04, -0.12);
      orelha.add(dentro);

      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }

    /**
     * -------------------------------------------------------------- os olhos
     *
     * A PUPILA OLHA PARA A FRENTE, e nao para cima. A primeira versao era uma
     * bola escura so, centrada em `z = 0,28` — dentro do cranio, que nessa
     * altura tem 0,337 de raio em z. Sobrava a CALOTA DE CIMA da bola para
     * fora, e uma calota de cima e exatamente o desenho de um olho revirado:
     * o Cookie ficava olhando para o teto.
     *
     * Agora sao tres peças, cada uma um degrau a frente da outra, e a direcao
     * do olhar vira geometria em vez de acidente: o globo claro encostado na
     * face, a PUPILA escura na frente dele (apontando para `+Z`, que e para
     * onde ele olha) e o brilho na frente da pupila.
     *
     * Elas moram num grupo por olho porque a piscada do carinho escala o olho
     * inteiro em `y` — escalando so a bola escura, a pupila afundava no globo.
     */
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Group();
      olho.position.set(lado * 0.19, 0, 0.29);
      olho.rotation.y = lado * 0.24; // acompanhando a curva da cara

      // as duas peças sao ACHATADAS em z (`scale.z`): disco deitado na cara, e
      // nao bola espetada nela. Bola mostra a calota de cima e le como olho
      // revirado; disco mostra a face inteira e le como olho olhando
      const globo = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), toon(0xf7f2ea));
      globo.scale.z = 0.5;
      olho.add(globo);

      // a pupila come quase todo o globo: sobra um fio de branco em volta, que
      // e o suficiente para dizer para onde ele olha sem virar olho de boneco
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), toon(0x2b2733));
      pupila.scale.z = 0.5;
      pupila.position.z = 0.014;
      olho.add(pupila);

      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 6), toon(0xfdfbf6));
      brilho.position.set(lado * 0.014, 0.016, 0.036);
      olho.add(brilho);

      this.cabeca.add(olho);
      this.olhos.push(olho);

      // a sobrancelha de elefante triste-bonzinho: um risco fino por cima
      const sobrancelha = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.022, 0.02), escuro);
      sobrancelha.position.set(lado * 0.2, 0.12, 0.31);
      sobrancelha.rotation.z = lado * 0.22;
      this.cabeca.add(sobrancelha);
    }

    // ------------------------------------------------------------- as presas
    for (const lado of [-1, 1] as const) {
      const presa = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.34, 7), toon(P.elefantePresa));
      presa.position.set(lado * 0.17, -0.22, 0.26);
      presa.rotation.x = 2.5; // a ponta olha para frente e para cima
      presa.rotation.z = lado * 0.2;
      this.cabeca.add(presa);
    }

    // ------------------------------------------------------------- a tromba
    /**
     * CINCO GOMOS ENCADEADOS, cada um filho do anterior, afinando de 0,15 na
     * raiz para 0,055 na ponta. A raiz sai da testa, entre os olhos, e desce.
     *
     * CINCO, e nao seis: com seis a ponta chegava ao chao e a tromba lia como
     * vassoura arrastando. Com cinco ela para na altura do joelho, que e onde
     * tromba de elefante para de verdade.
     *
     * `rotation.x` POSITIVO leva o `+Y` local para o `+Z` — inclina para a
     * FRENTE, para onde ele olha. Como os gomos apontam para BAIXO, o que faz a
     * tromba curvar para a frente aqui e o angulo NEGATIVO em cada gomo, e o
     * primeiro deles ja nasce apontando para baixo.
     */
    let pai: THREE.Group = this.cabeca;
    const GOMOS = 5;
    for (let i = 0; i < GOMOS; i++) {
      const gomo = new THREE.Group();
      // o primeiro pendura da testa; os outros, da ponta do anterior
      gomo.position.set(0, i === 0 ? -0.12 : -0.19, i === 0 ? 0.27 : 0);
      // a curva cresce para a ponta: e o que faz a tromba pender em C em vez
      // de descer como um cano reto
      gomo.rotation.x = i === 0 ? -0.15 : -0.06 - i * 0.05;

      const t = i / (GOMOS - 1);
      const r0 = 0.15 - t * 0.09;
      const r1 = 0.15 - (i + 1) / (GOMOS - 1) * 0.09;
      const cano = new THREE.Mesh(
        new THREE.CylinderGeometry(Math.max(0.05, r1), r0, 0.2, 9),
        pele,
      );
      cano.position.y = -0.1;
      gomo.add(cano);

      // os aneis da tromba: um sulco por gomo, um fio mais gordo que o cano
      const anel = new THREE.Mesh(new THREE.TorusGeometry(r0 * 0.98, 0.016, 5, 10), escuro);
      anel.rotation.x = Math.PI / 2;
      anel.position.y = -0.03;
      gomo.add(anel);

      pai.add(gomo);
      this.tromba.push(gomo);
      pai = gomo;
    }
    // a pontinha da tromba, rosada por dentro: e onde ele pega o doce
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 8), rosa);
    ponta.scale.set(1, 0.8, 1);
    ponta.position.y = -0.2;
    this.tromba[GOMOS - 1].add(ponta);

    this.uniforme();
    this.corpo.add(this.cabeca);

    // --------------------------------------------------------------- o rabo
    let paiDoRabo: THREE.Group = this.corpo;
    for (let i = 0; i < 3; i++) {
      const gomo = new THREE.Group();
      gomo.position.set(0, i === 0 ? 1.38 : -0.16, i === 0 ? -0.78 : 0);
      gomo.rotation.x = i === 0 ? -0.3 : 0.06;
      const osso = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.042, 0.17, 6), pele);
      osso.position.y = -0.085;
      gomo.add(osso);
      paiDoRabo.add(gomo);
      this.rabo.push(gomo);
      paiDoRabo = gomo;
    }
    const tufo = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), escuro);
    tufo.scale.set(0.7, 1.2, 0.7);
    tufo.position.y = -0.2;
    this.rabo[2].add(tufo);

    this.group.add(this.corpo);
  }


  /**
   * ================================================== O UNIFORME DE BILHETEIRO
   *
   * Ele TRABALHA ali, e sem uniforme era um elefante que por acaso estava do
   * lado de uma cabine. O mesmo que o avental fez pelo Mano: e a roupa que
   * transforma bicho em funcionario.
   *
   * AS CORES SAO AS DA BILHETERIA — o azul da cinta, o creme da parede e o
   * vermelho do telhado —, e nao um azul parecido: e o uniforme DAQUELA
   * cabine, e e assim que quem olha entende que ele pertence a ela.
   *
   * Sao quatro peças, e cada uma existe por um motivo diferente:
   *  - o QUEPE, que e o que se le de longe, e o unico que aparece por cima da
   *    silhueta dele;
   *  - o COLETE, dois painos no peito, que e o que se le de perto;
   *  - o CRACHA, que e o que diz que ele tem nome e cargo;
   *  - a BOLSA DE BILHETES a tiracolo, que e o que diz o que ele VENDE.
   */
  private uniforme(): void {
    const pano = toon(P.fabricBlue);
    const debrum = toon(P.wallCream);
    const fita = toon(P.fabricRed);
    const couro = toon(P.woodDark);

    // ------------------------------------------------------------- o quepe
    /*
     * ELE POUSA ENTRE AS DUAS BOSSAS DA TESTA, que sobem ate 0,45: mais baixo
     * que isso o quepe nasce DENTRO do cranio e vira uma faixa azul na careca.
     * E ele tomba um pouco para a frente, que e como bone de trabalho fica.
     */
    const quepe = new THREE.Group();
    quepe.position.set(0, 0.4, 0.09);
    quepe.rotation.x = 0.18;

    const copa = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10, 0, Math.PI * 2, 0, 1.25), pano);
    copa.scale.set(1, 0.72, 0.95);
    quepe.add(copa);

    // a faixa vermelha na base da copa, 1 cm mais gorda que ela: encostada no
    // mesmo raio, as duas superficies brigam pelo mesmo pixel
    const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.253, 0.258, 0.06, 14, 1, true), fita);
    faixa.scale.z = 0.95;
    faixa.position.y = 0.012;
    quepe.add(faixa);

    // a aba, achatada e avancando so para a frente
    /*
     * A ABA AVANÇA DE VERDADE (`z = 0,17` com 1,5 de esticada), senao ela nasce
     * dentro da copa e o quepe vira touca. Meia esfera achatada: `phiLength`
     * de meia volta girada para a frente da um leque, e nao um disco inteiro.
     */
    const aba = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 8, 0, Math.PI, 0, Math.PI / 2), pano);
    aba.scale.set(1, 0.09, 1.5);
    aba.rotation.y = -Math.PI / 2;
    aba.position.set(0, -0.012, 0.17);
    quepe.add(aba);

    // o botãozinho do alto
    const botao = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), debrum);
    botao.position.y = 0.19;
    quepe.add(botao);

    this.cabeca.add(quepe);

    // -------------------------------------------------------------- a manta
    /*
     * A ROUPA DELE VAI NAS COSTAS, e nao no peito, e o motivo e a CAMERA.
     *
     * A primeira versao era um colete de dois painos no peito: num bicho de
     * quatro patas, a cabeca fica logo acima do peito e a camera olha de cima
     * em 34° — o colete inteiro ficava na sombra do proprio queixo dele, e da
     * distancia de jogo nao existia. O que esta camera enxerga de um quadrupede
     * e o LOMBO, entao a roupa que se ve e a manta.
     *
     * Ela e uma casca de cilindro com o eixo em Z (o comprimento do corpo),
     * aberta de 75° a 284° a partir de baixo: passa por cima e desce um palmo
     * dos dois lados. Raio 0,63 contra os 0,6 do tronco — 3 cm de folga, que e
     * pano caindo em cima de corpo em vez de tatuagem.
     */
    const manta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.63, 0.63, 1.06, 20, 1, true, Math.PI * 0.42, Math.PI * 1.16),
      toon(P.fabricBlue, { doubleSide: true }),
    );
    manta.rotation.x = Math.PI / 2; // poe o eixo do cilindro no Z
    manta.position.set(0, 1.26, 0.06);
    this.corpo.add(manta);

    // os debruns creme nas duas bordas, um fio maiores que a manta para nao
    // dividirem superficie com ela
    for (const z of [-0.46, 0.58]) {
      const borda = new THREE.Mesh(
        new THREE.CylinderGeometry(0.645, 0.645, 0.07, 20, 1, true, Math.PI * 0.42, Math.PI * 1.16),
        toon(P.wallCream, { doubleSide: true }),
      );
      borda.rotation.x = Math.PI / 2;
      borda.position.set(0, 1.26, z);
      this.corpo.add(borda);
    }

    // a faixa vermelha no meio do lombo, na mesma familia do telhado da cabine
    const faixaDaManta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.652, 0.652, 0.12, 20, 1, true, Math.PI * 0.42, Math.PI * 1.16),
      toon(P.fabricRed, { doubleSide: true }),
    );
    faixaDaManta.rotation.x = Math.PI / 2;
    faixaDaManta.position.set(0, 1.26, 0.06);
    this.corpo.add(faixaDaManta);

    // a peitoral que segura a manta: uma tira por cima do ombro de cada lado
    for (const lado of [-1, 1] as const) {
      const tira = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.5, 0.055), toon(P.wallCream));
      tira.position.set(lado * 0.42, 1.42, 0.38);
      tira.rotation.x = -0.5;
      tira.rotation.z = lado * 0.3;
      this.corpo.add(tira);
    }

    // ------------------------------------------------------------- o cracha
    // na tira do ombro direito, virado para a camera, e nao no peito escondido
    const cracha = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.03), debrum);
    cracha.position.set(0.47, 1.36, 0.5);
    cracha.rotation.set(-0.5, 0, 0.3);
    this.corpo.add(cracha);
    const risco = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.018, 0.014), fita);
    risco.position.set(0.482, 1.335, 0.516);
    risco.rotation.set(-0.5, 0, 0.3);
    this.corpo.add(risco);

    // ------------------------------------------------ a bolsa de bilhetes
    /*
     * A TIRACOLO, do lado esquerdo, na altura em que a tromba alcança: e dali
     * que sai o bilhete. A alca e um toro inclinado em volta do peito — o
     * mesmo truque do cordao do apito do Capy.
     */
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.028, 6, 18), couro);
    alca.position.set(0, 1.3, 0.2);
    alca.rotation.x = 1.32;
    alca.rotation.y = 0.42;
    this.corpo.add(alca);

    const bolsa = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.16), couro);
    bolsa.position.set(-0.58, 1.0, 0.24);
    bolsa.rotation.y = 0.3;
    this.corpo.add(bolsa);
    const tampa = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.12, 0.175), toon(P.wood));
    tampa.position.set(-0.58, 1.11, 0.24);
    tampa.rotation.y = 0.3;
    this.corpo.add(tampa);

    // o rolo de bilhetes espiando para fora da bolsa: e o que diz o que ele vende
    const rolo = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.09, 10), debrum);
    rolo.position.set(-0.52, 1.17, 0.28);
    rolo.rotation.z = Math.PI / 2;
    rolo.rotation.y = 0.3;
    this.corpo.add(rolo);
    const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.095, 8), fita);
    miolo.position.set(-0.52, 1.17, 0.28);
    miolo.rotation.z = Math.PI / 2;
    miolo.rotation.y = 0.3;
    this.corpo.add(miolo);
  }

  // ------------------------------------------------------- ordens da cena

  /**
   * Vira o corpo para um ponto, devagar. A cena chama antes de falar com ele:
   * NPC que conversa de perfil parece que nao viu ninguem chegar.
   *
   * Ele guarda o PONTO, e nao o angulo, porque quem chama sabe onde o jogador
   * esta e nao precisa fazer a conta do `atan2` de novo.
   */
  encarar(x: number, z: number): void {
    this.encarando = { x, z };
  }

  /** Larga o alvo: ele volta a olhar para onde anda. */
  pararDeEncarar(): void {
    this.encarando = null;
  }

  /** Levanta a cabeca e a tromba para o ceu — o sonho da roda gigante. */
  olharProAlto(segundos: number): void {
    this.sonhando = segundos;
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, carinho, fase }: PoseDoBicho): void {
    if (this.sonhando > 0) this.sonhando = Math.max(0, this.sonhando - dt);
    const sonho = this.sonhando > 0 ? 1 : 0;

    // vira o corpo para quem ele esta encarando, sem estalo
    if (this.encarando) {
      const alvo = Math.atan2(this.encarando.x - this.x, this.encarando.z - this.z);
      let d = alvo - this.group.rotation.y;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      this.group.rotation.y += d * Math.min(1, dt * 4);
    }

    /**
     * O PASSO. Patas em diagonal (dianteira esquerda com traseira direita), num
     * seno LENTO: 4,4 contra os 8 do Capy. Passo rapido num bicho deste tamanho
     * lia como bichinho correndo — e escala se le pelo RITMO tanto quanto pelo
     * tamanho.
     */
    if (andando) {
      const t = fase * 4.4;
      const passo = Math.sin(t) * 0.3;
      this.patas[0].rotation.x = passo;
      this.patas[3].rotation.x = passo;
      this.patas[1].rotation.x = -passo;
      this.patas[2].rotation.x = -passo;
      // o corpo sobe meio passo a cada apoio, e gingar de lado e o que da peso
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.03;
      this.corpo.rotation.z = Math.sin(t) * 0.035;
    } else {
      for (const perna of this.patas) {
        perna.rotation.x += (0 - perna.rotation.x) * Math.min(1, dt * 6);
      }
      this.corpo.rotation.z *= 1 - Math.min(1, dt * 6);
      const respira = Math.sin(fase * 1.1) * 0.014;
      this.corpo.position.y += (respira - this.corpo.position.y) * Math.min(1, dt * 5);
    }

    /**
     * A ORELHA ABANA SEMPRE. Elefante parado nao fica imovel: ele venta a
     * propria orelha o dia inteiro, e e esse detalhe que faz o bicho estar vivo
     * quando ele nao esta andando. No carinho ela abre mais.
     */
    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const venta = Math.sin(fase * 1.7 + i * 1.1) * 0.13;
      this.orelhas[i].rotation.y = lado * (-0.5 - carinho * 0.35) + venta * lado;
      this.orelhas[i].rotation.z = lado * (0.16 + carinho * 0.1);
    }

    /**
     * A TROMBA. Cada gomo balanca com a fase ATRASADA em relacao ao anterior
     * (`i * 0.55`) e com amplitude CRESCENDO para a ponta: e a defasagem que
     * faz a ponta chegar depois e a tromba chicotear em vez de girar como uma
     * barra rigida.
     *
     * Ela tem tres jeitos, e todos somam no mesmo angulo:
     *  - solta, balancando de leve para os lados;
     *  - no CARINHO, enrolada para cima, indo em direcao a mao;
     *  - no SONHO, esticada para o alto, apontando para a roda gigante.
     */
    const enrolar = Math.max(carinho, sonho);
    for (let i = 0; i < this.tromba.length; i++) {
      const t = i / (this.tromba.length - 1);
      const solto = Math.sin(fase * 1.9 - i * 0.55) * (0.05 + t * 0.1);
      const base = i === 0 ? -0.15 : -0.08;
      // levantar a tromba e girar cada gomo para TRAS (x positivo abaixa a
      // ponta porque os gomos apontam para baixo)
      const alvo = base + solto + enrolar * (0.16 + t * 0.34);
      this.tromba[i].rotation.x += (alvo - this.tromba[i].rotation.x) * Math.min(1, dt * 4);
      this.tromba[i].rotation.z += (solto * 0.7 - this.tromba[i].rotation.z) * Math.min(1, dt * 4);
    }

    // a cabeca: sobe no sonho e no carinho, e balanca de leve o tempo todo
    const alvoCabeca = -sonho * 0.5 - carinho * 0.14 + Math.sin(fase * 1.1) * 0.02;
    this.cabeca.rotation.x += (alvoCabeca - this.cabeca.rotation.x) * Math.min(1, dt * 4);

    // olho fechando no carinho — e o que faz o bicho parecer que gostou
    const abertura = 1 - carinho * 0.8;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.12, abertura);

    // o rabo, com a mesma defasagem da tromba, so que curtinho
    for (let i = 0; i < this.rabo.length; i++) {
      const t = (i + 1) / this.rabo.length;
      this.rabo[i].rotation.z = Math.sin(fase * 2.4 - i * 0.7) * 0.1 * t * (1 + carinho);
    }
  }
}
