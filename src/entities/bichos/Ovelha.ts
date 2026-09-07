import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * A OVELHA da lojinha de roupas do Villa Lobos — a costureira que toma conta
 * da loja e fica parada na calçada, na frente da vitrine.
 *
 * O NOME AINDA E DO RENAN. Ele disse que ainda nao decidiu, entao a classe se
 * chama `Ovelha` mesmo: quando ele escolher, muda o rotulo da interacao e a
 * fala — nao o modelo. E por isso que nada aqui dentro escreve nome nenhum.
 *
 * O QUE FAZ UMA OVELHA SER LIDA COMO OVELHA, na ordem que importa:
 *
 * 1. A LA E UM CACHO DE BOLOTAS, e nao um elipsoide liso. Esta e a coisa toda:
 *    um ovo creme com quatro palitos e um bicho generico, e o mesmo ovo coberto
 *    de bolotas ja e ovelha antes de ter cara. Sao vinte e poucas esferas
 *    distribuidas pela superficie do corpo (espiral de Fibonacci, para elas
 *    ficarem espalhadas sem sortear nada e a foto do teste nao mudar sozinha).
 * 2. O CONTRASTE CARA-E-PERNA. A cara, as orelhas e as quatro pernas sao marrom
 *    escuro contra o creme da la — sem esse contraste, o cacho de bolotas nao
 *    tem onde comecar nem onde acabar, e vira uma nuvem no chao.
 * 3. AS ORELHAS SAO HORIZONTAIS. Orelha de ovelha nao sobe: ela sai reta pelos
 *    lados, caindo um pouco, e e ela que da a largura da silhueta. Orelha em pe
 *    faz cabra; orelha comprida caindo faz coelho.
 * 4. O TOPETE DE LA entre as orelhas, que e o que impede a cabeca escura de
 *    parecer emprestada de outro bicho.
 *
 * O QUE DIZ QUE ELA E A COSTUREIRA (a mesma regra do avental do Mano e da manta
 * do Cookie — uniforme e o que transforma bicho em funcionario), e tudo isso
 * mora ACIMA da linha das costas ou na cara, que e o que a camera de 34° mostra
 * de um bicho de quatro patas:
 *
 *  - a FITA METRICA no pescoco, com as duas pontas caindo no peito. E o
 *    acessorio que se le de longe, e o unico que diz "roupa" sozinho;
 *  - os OCULOS DE MEIA-LUA na cara, de quem passa o dia medindo bainha;
 *  - a ALFINETEIRA espetada na la do lombo, com os alfinetes de cabeca
 *    colorida, e o carretel de linha ao lado dela — os dois no rosa do toldo da
 *    loja, que e como se diz de que casa ela e;
 *  - o LACINHO no topete, do mesmo rosa.
 *
 * E ELA RUMINA. Um bicho de posto passa a vida parado na tela, e a mandibula
 * mexendo devagar e o que faz ela nao virar estatua enquanto ninguem fala com
 * ela — o equivalente da orelha do Cookie abanando.
 */
export class Ovelha extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly focinho = new THREE.Group();
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Group[] = [];
  private readonly patas: THREE.Group[] = [];
  private readonly rabo: THREE.Group[] = [];
  private readonly laco = new THREE.Group();
  /** as duas pontas da fita metrica, que balancam quando ela anda */
  private readonly pontasDaFita: THREE.Group[] = [];

  /** para onde ela deve virar, quando a cena manda encarar alguem */
  private encarando: { x: number; z: number } | null = null;

  constructor(area: AreaDoBicho) {
    super(area, {
      // ovelha anda devagar e para muito: ela e uma lojista na porta da loja,
      // nao um bicho passeando
      velocidade: 0.4,
      descansoMin: 2.2,
      descansoMax: 5,
      // ela nao senta: quem atende de pe atende de pe
      chanceDeSentar: 0,
      somCadaMin: 12,
      somCadaMax: 24,
      duracaoDoCarinho: 4.2,
      semente: 20260910,
    });
    this.montar();
    this.prontoParaAparecer('ovelha');
  }

  // ------------------------------------------------------------------- corpo

  private montar(): void {
    const la = toon(P.ovelhaLa);
    const laSombra = toon(P.ovelhaLaSombra);
    const cara = toon(P.ovelhaCara);
    const caraClara = toon(P.ovelhaCaraClara);
    const casco = toon(P.ovelhaCasco);

    /**
     * O MIOLO DO CORPO e um elipsoide (e nao capsula girada, que poria o
     * comprimento no X enquanto a cabeca mora no Z), mas ele quase nao aparece:
     * ele e so o volume por baixo, para nao sobrar buraco entre duas bolotas.
     * Quem se ve e o cacho.
     */
    const RAIO = new THREE.Vector3(0.3, 0.28, 0.4);
    const ALTURA = 0.62;
    const miolo = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), laSombra);
    miolo.scale.copy(RAIO);
    miolo.position.y = ALTURA;
    this.corpo.add(miolo);

    /**
     * O CACHO DE LA. Espiral de Fibonacci na superficie do elipsoide: `y` desce
     * em passo constante e o angulo gira sempre o mesmo tanto (o angulo aureo,
     * 2,3999 rad), e o resultado sao pontos espalhados sem nenhum sorteio —
     * bolota sorteada mudaria de lugar a cada build e a foto do teste nunca
     * bateria com a anterior.
     *
     * A BARRIGA FICA DE FORA (`ny > -0,45`): bolota embaixo do bicho nao aparece
     * de angulo nenhum e ainda empurra a la para dentro das pernas.
     *
     * O tamanho de cada bolota varia num seno do indice — variacao repetivel,
     * pelo mesmo motivo. La toda do mesmo tamanho vira bolha de sabao.
     */
    const N = 30;
    for (let i = 0; i < N; i++) {
      const ny = 1 - (2 * (i + 0.5)) / N;
      if (ny < -0.45) continue;
      const r = Math.sqrt(Math.max(0, 1 - ny * ny));
      const ang = i * 2.399963;
      const nx = Math.cos(ang) * r;
      const nz = Math.sin(ang) * r;
      // 0,88 do raio: a bolota nasce um pouco DENTRO da casca, senao ela fica
      // pousada por fora e o cacho abre buraco entre uma e outra
      const bolota = new THREE.Mesh(
        new THREE.SphereGeometry(0.115 + Math.abs(Math.sin(i * 1.7)) * 0.04, 10, 8),
        i % 3 === 0 ? laSombra : la,
      );
      bolota.position.set(nx * RAIO.x * 0.88, ALTURA + ny * RAIO.y * 0.88, nz * RAIO.z * 0.88);
      this.corpo.add(bolota);
    }

    // ------------------------------------------------------------- as pernas
    /**
     * PALITO ESCURO COM CASCO. A perna e um pivo no ombro (e o pivo que gira no
     * passo, nao a malha) com um cilindro fino descendo e o casco na ponta.
     *
     * A PERNA E CURTA. A primeira versao tinha 0,53 do chao ao ombro e a foto de
     * perto voltou com uma cabra: perna comprida e fina levanta o corpo e some
     * com a barriga, e ovelha e um bicho BAIXO — o cacho de la quase encosta no
     * joelho.
     *
     * A ALTURA FECHA NO CHAO: pivo em 0,44, cilindro de 0,35 (centro em −0,175)
     * e casco de 0,09 (centro em −0,395) — a base do casco cai exatamente em
     * `y = 0`. Bicho flutuando um centimetro aparece na foto de perto.
     */
    for (const [x, z] of [
      [-0.19, 0.26], [0.19, 0.26], [-0.19, -0.26], [0.19, -0.26],
    ] as const) {
      const perna = new THREE.Group();
      perna.position.set(x, 0.44, z);

      const osso = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.058, 0.35, 8), cara);
      osso.position.y = -0.175;
      perna.add(osso);

      const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.064, 0.09, 8), casco);
      pe.position.y = -0.395;
      perna.add(pe);

      // a meia de la em cima da perna, cobrindo a junta com o corpo
      const meia = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), la);
      meia.scale.y = 0.8;
      meia.position.y = -0.04;
      perna.add(meia);

      this.corpo.add(perna);
      this.patas.push(perna);
    }

    // ------------------------------------------------------------- o pescoco
    const pescoco = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), cara);
    pescoco.scale.set(0.11, 0.15, 0.13);
    pescoco.position.set(0, 0.88, 0.28);
    pescoco.rotation.x = -0.45;
    this.corpo.add(pescoco);

    /*
     * A GOLA DE LA cobre onde o pescoco escuro entra no cacho — mas ela nao pode
     * subir por CIMA do pescoco: a bolota que ficava em `(0; 0,87; 0,20)`
     * engolia a fita metrica inteira, que e justamente a peca que diz que ela
     * trabalha com roupa. Ela desceu para tras, virando ombro em vez de gola.
     */
    for (const [gx, gy, gz] of [
      [-0.11, 0.84, 0.24], [0.11, 0.84, 0.24], [0, 0.9, 0.1], [0, 0.72, 0.3],
    ] as const) {
      const bolota = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), la);
      bolota.position.set(gx, gy, gz);
      this.corpo.add(bolota);
    }

    // -------------------------------------------------------------- a cabeca
    // etiqueta, para o teste achar a cabeca em vez de adivinhar qual grupo e
    // qual (o Cookie, o Capy e a Gina fazem igual)
    this.cabeca.name = 'cabeca-da-ovelha';
    /*
     * A CABECA SOBE ACIMA DA LINHA DA LA. O cacho de bolotas chega a `y = 1,02`
     * no lombo, e com a cabeca em 0,91 a ovelha ficava CORCUNDA: o pescoco
     * afundava no proprio velo, e a fita metrica junto com ele. Ovelha de
     * verdade carrega a cabeca na altura das costas, e e essa linha que deixa o
     * pescoco a mostra para o resto do kit de costureira aparecer.
     */
    this.cabeca.position.set(0, 1.0, 0.37);

    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 12), cara);
    cranio.scale.set(0.15, 0.16, 0.17);
    this.cabeca.add(cranio);

    /**
     * O FOCINHO MORA NUM GRUPO PROPRIO porque ele RUMINA: e ele que sobe e
     * desce mastigando. Junto com ele vao o nariz e a boca, senao a boca fica
     * parada enquanto o queixo mexe.
     */
    const buco = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), caraClara);
    buco.scale.set(0.088, 0.072, 0.1);
    this.focinho.add(buco);
    const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), toon(P.ovelhaFocinho));
    nariz.scale.set(1.4, 0.8, 0.7);
    nariz.position.set(0, 0.022, 0.085);
    this.focinho.add(nariz);
    const boca = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.02), toon(P.ovelhaCasco));
    boca.position.set(0, -0.038, 0.078);
    this.focinho.add(boca);
    this.focinho.position.set(0, -0.075, 0.125);
    this.cabeca.add(this.focinho);

    /**
     * AS ORELHAS SAO HORIZONTAIS, e e a pegadinha de sinal de sempre: a da
     * esquerda nasce em `x` negativo. Duas rotacoes, cada uma com o seu motivo:
     *
     *  - `rotation.z = -lado * 0,45` faz as duas CAIREM (girar o braco `+X`
     *    para `−Y` pede angulo negativo; do outro lado o espelho inverte);
     *  - `rotation.y = lado * 0,3` varre as duas PARA TRAS (girar `+X` em `Y`
     *    positivo leva para `−Z`; do outro lado, de novo, o espelho).
     *
     * Sem o `lado` multiplicando, uma orelha cai e a outra sobe — o bug que
     * so aparece girando a camera.
     */
    for (const lado of [-1, 1] as const) {
      const orelha = new THREE.Group();
      orelha.position.set(lado * 0.12, 0.035, 0.01);
      orelha.rotation.z = -lado * 0.45;
      orelha.rotation.y = lado * 0.3;

      const folha = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), cara);
      folha.scale.set(0.115, 0.038, 0.075);
      folha.position.x = lado * 0.11;
      orelha.add(folha);
      // o rosado de dentro, um fio menor e por baixo — que e o lado que a
      // camera ve numa orelha caida
      const dentro = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.ovelhaFocinho));
      dentro.scale.set(0.09, 0.028, 0.055);
      dentro.position.set(lado * 0.11, -0.014, 0.006);
      orelha.add(dentro);

      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }

    /**
     * OS OLHOS, no mesmo desenho de tres peças do Cookie: globo claro encostado
     * na cara, pupila ACHATADA em `z` na frente dele e o brilho na frente da
     * pupila. Bola escura espetada na cara mostra so a calota de cima, que e o
     * desenho de um olho revirado.
     */
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Group();
      olho.position.set(lado * 0.085, 0.028, 0.122);
      olho.rotation.y = lado * 0.3;

      const globo = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), toon(0xf7f2ea));
      globo.scale.z = 0.5;
      olho.add(globo);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.027, 10, 8), toon(0x2b2733));
      pupila.scale.z = 0.5;
      pupila.position.z = 0.012;
      olho.add(pupila);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.01, 6, 6), toon(0xfdfbf6));
      brilho.position.set(lado * 0.009, 0.011, 0.026);
      olho.add(brilho);

      this.cabeca.add(olho);
      this.olhos.push(olho);
    }

    /**
     * O TOPETE. Cinco bolotas em cima do cranio, entre as orelhas — e o que
     * costura a cabeca escura no cacho de la do corpo. Sem ele a cabeca parece
     * emprestada de outro bicho.
     */
    for (const [tx, ty, tz] of [
      [0, 0.15, 0.03], [-0.075, 0.125, 0.05], [0.075, 0.125, 0.05],
      [-0.05, 0.13, -0.06], [0.05, 0.13, -0.06],
    ] as const) {
      const bolota = new THREE.Mesh(new THREE.SphereGeometry(0.072, 10, 8), la);
      bolota.position.set(tx, ty, tz);
      this.cabeca.add(bolota);
    }

    this.corpo.add(this.cabeca);

    // ---------------------------------------------------------------- o rabo
    // curtinho e de la, como o de ovelha de verdade: dois gomos encadeados
    let pai: THREE.Group = this.corpo;
    for (let i = 0; i < 2; i++) {
      const gomo = new THREE.Group();
      gomo.position.set(0, i === 0 ? 0.74 : -0.09, i === 0 ? -0.4 : -0.02);
      gomo.rotation.x = i === 0 ? 0.9 : 0.4;
      const bolota = new THREE.Mesh(new THREE.SphereGeometry(0.08 - i * 0.018, 10, 8), la);
      bolota.position.y = -0.06;
      gomo.add(bolota);
      pai.add(gomo);
      this.rabo.push(gomo);
      pai = gomo;
    }

    this.costureira();
    this.group.add(this.corpo);
  }

  /**
   * ==================================================== O KIT DE COSTUREIRA
   *
   * Tudo aqui esta ou na CARA ou EM CIMA DO LOMBO, e isso nao e decoracao: a
   * camera olha de 34°, e de um bicho de quatro patas ela ve o alto das costas
   * e o rosto. Foi a licao que a manta do Cookie pagou — o colete no peito dele
   * ficava na sombra do proprio queixo e simplesmente nao existia na tela.
   *
   * A FITA NAO CAI NO PEITO, ela DEITA NO OMBRO — e e a mesma licao, aplicada
   * de novo. Num bicho de quatro patas a cabeca fica logo acima do peito, e
   * qualquer coisa pendurada ali passa a existir so para quem olhasse por
   * baixo. Fita metrica de costureira cai dos dois lados do pescoco mesmo, e
   * dai ela escorrega para as costas: e onde a camera de 34° enxerga.
   */
  private costureira(): void {
    const fita = toon(P.ovelhaFita);
    const traco = toon(P.ovelhaCasco);
    const rosa = toon(P.lojaToldo);

    // ------------------------------------------------------- a fita metrica
    /*
     * O ARO no pescoco, inclinado junto com ele. Toro de raio 0,15 sobre um
     * pescoco de 0,13 de meia-largura: 2 cm de folga, que e fita pousada em
     * cima de bicho em vez de tatuagem.
     */
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.014, 5, 16), fita);
    aro.position.set(0, 0.92, 0.3);
    aro.rotation.x = Math.PI / 2 - 0.45;
    this.corpo.add(aro);

    /**
     * AS DUAS PONTAS CAEM DE JEITOS DIFERENTES, e isso e o oposto de descuido.
     *
     * A camera de 34° so mostra duas superficies de um bicho de quatro patas: o
     * LOMBO e o FLANCO DE PERTO. Uma ponta em cada, entao:
     *
     *  - a comprida DEITA NAS COSTAS (`rotation.x` de 1,42 — quase deitada:
     *    positivo leva o `−Y` da tira para o `−Z`, que e para tras);
     *  - a curta ESCORREGA PELO FLANCO, quase de lado, e vai no `−X` DELA. O
     *    lado nao e capricho: parada na porta da loja ela olha para o `+X` do
     *    mundo, e com esse giro o `−X` dela e o `+Z` do mundo — que e o flanco
     *    virado para a camera. No `+X` a fita existia e ninguem via.
     *
     * As duas emparelhadas em cima do lombo era a versao anterior: a de tras
     * sumia atras da de cima e sobrava uma fita so, que na foto lia como um
     * lapis esquecido em cima da ovelha.
     *
     * Cada uma guarda a PROPRIA base em `userData`, porque o balanco do `animar`
     * soma em cima dela — com um angulo cravado la, o primeiro quadro desfaria
     * tudo isto.
     */
    const PONTAS = [
      { lado: -1, comprimento: 0.3, pos: [-0.14, 1.0, 0.26], rot: [1.42, -0.42] },
      { lado: -1, comprimento: 0.26, pos: [-0.22, 0.94, 0.24], rot: [0.25, -0.85] },
    ] as const;
    for (const { comprimento, pos, rot } of PONTAS) {
      const ponta = new THREE.Group();
      ponta.position.set(pos[0], pos[1], pos[2]);
      ponta.rotation.x = rot[0];
      ponta.rotation.z = rot[1];
      ponta.userData.base = { x: rot[0], z: rot[1] };

      const tira = new THREE.Mesh(new THREE.BoxGeometry(0.085, comprimento, 0.012), fita);
      tira.position.y = -comprimento / 2;
      ponta.add(tira);
      /*
       * OS TRACINHOS SAO O QUE SEPARA "fita metrica" de "fita de presente", e
       * eles precisam ser GROSSOS: com 7 mm de comprimento e 4 de espessura, na
       * distancia de jogo, a fita voltava da foto como um palito amarelo liso.
       * Cinco por ponta, alternando a marca cheia e a metade, que e o desenho de
       * uma fita de verdade.
       */
      for (let i = 0; i < 5; i++) {
        /*
         * A MARCA VAI NAS DUAS FACES DA TIRA. A que deita no lombo gira 1,42 em
         * `x`, e isso vira o `+Z` local para BAIXO: os tracinhos ficavam todos
         * virados para dentro da la, e a fita voltava da foto como uma regua
         * amarela lisa. Fita de verdade tem numero dos dois lados mesmo.
         */
        for (const face of [-1, 1] as const) {
          const marca = new THREE.Mesh(
            new THREE.BoxGeometry(i % 2 === 0 ? 0.062 : 0.036, 0.011, 0.006),
            traco,
          );
          marca.position.set(i % 2 === 0 ? 0 : -0.014, -0.035 - i * 0.048, face * 0.009);
          ponta.add(marca);
        }
      }

      this.corpo.add(ponta);
      this.pontasDaFita.push(ponta);
    }

    // --------------------------------------------------------- os oculinhos
    /*
     * MEIA-LUA, na ponta do focinho: o aro e um toro CORTADO pela metade de
     * baixo (`arc` de meia volta, girado para ficar com a boca para cima), que
     * e o desenho de oculos de leitura. Aro inteiro viraria oculos de mergulho.
     *
     * Eles ficam presos na CABECA, e nao no focinho: o focinho mastiga.
     */
    const oculos = new THREE.Group();
    oculos.position.set(0, -0.012, 0.128);
    for (const lado of [-1, 1] as const) {
      const aroDoOculos = new THREE.Mesh(
        new THREE.TorusGeometry(0.048, 0.007, 5, 12, Math.PI),
        toon(P.ovelhaOculos),
      );
      aroDoOculos.position.set(lado * 0.085, 0.035, 0.02);
      aroDoOculos.rotation.z = Math.PI; // a boca do arco para cima: meia-lua
      oculos.add(aroDoOculos);
      // a haste, indo para tras em direcao a orelha
      const haste = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.008, 0.1), toon(P.ovelhaOculos));
      haste.position.set(lado * 0.125, 0.04, -0.03);
      haste.rotation.y = -lado * 0.35;
      oculos.add(haste);
    }
    const ponte = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.008, 0.01), toon(P.ovelhaOculos));
    ponte.position.set(0, 0.036, 0.03);
    oculos.add(ponte);
    this.cabeca.add(oculos);

    // ------------------------------------------------------- a alfineteira
    /*
     * ESPETADA NA LA DO LOMBO, no `−X` dela (o flanco que a camera ve, pelo
     * mesmo motivo da fita), com quatro alfinetes de cabeca
     * colorida. Ela fica no ALTO (`y = 1,02`, acima da linha das costas), que e
     * onde a camera isometrica passa o olho — e onde uma costureira de verdade
     * larga a almofada quando as maos estao ocupadas.
     */
    const almofada = new THREE.Mesh(new THREE.SphereGeometry(0.072, 10, 8), toon(P.ovelhaAlfineteira));
    almofada.scale.y = 0.8;
    almofada.position.set(-0.13, 0.93, -0.06);
    this.corpo.add(almofada);
    for (let i = 0; i < 4; i++) {
      const ang = i * 1.4;
      const alfinete = new THREE.Group();
      alfinete.position.set(-0.13, 0.96, -0.06);
      alfinete.rotation.set(Math.sin(ang) * 0.5, 0, Math.cos(ang) * 0.5);
      const agulha = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.075, 5), toon(0xd9dde0));
      agulha.position.y = 0.037;
      alfinete.add(agulha);
      const cabeca = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 6, 5),
        toon([P.lojaToldo, P.gold, P.morango, P.lojaVitrine][i]),
      );
      cabeca.position.y = 0.078;
      alfinete.add(cabeca);
      this.corpo.add(alfinete);
    }

    // o carretel de linha ao lado, deitado na la
    const carretel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 10), rosa);
    carretel.position.set(0.13, 0.92, -0.09);
    carretel.rotation.z = Math.PI / 2;
    carretel.rotation.y = 0.3;
    this.corpo.add(carretel);
    for (const x of [0.098, 0.162]) {
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.012, 10), toon(P.lojaEsquadria));
      flange.position.set(x, 0.92, -0.09);
      flange.rotation.z = Math.PI / 2;
      flange.rotation.y = 0.3;
      this.corpo.add(flange);
    }

    // ------------------------------------------------------------- o lacinho
    // no topete, no rosa do toldo da loja: o mesmo desenho de duas asas e um no
    // do laco da Josefina e do Ari
    this.laco.position.set(0, 0.21, 0.03);
    for (const lado of [-1, 1] as const) {
      const asa = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.066, 6), rosa);
      asa.position.set(lado * 0.048, 0, 0);
      asa.rotation.z = lado * Math.PI * 0.5;
      this.laco.add(asa);
    }
    const no = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), toon(P.lojaTijolo));
    this.laco.add(no);
    this.cabeca.add(this.laco);
  }

  // --------------------------------------------------------- ordens da cena

  /**
   * Vira para um ponto, devagar. A cena chama antes de falar com ela: lojista
   * que atende de perfil parece que nao viu o cliente chegar.
   */
  encarar(x: number, z: number): void {
    this.encarando = { x, z };
  }

  /** Larga o alvo: ela volta a olhar para onde anda. */
  pararDeEncarar(): void {
    this.encarando = null;
  }

  // -------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, carinho, fase }: PoseDoBicho): void {
    if (this.encarando) {
      const alvo = Math.atan2(this.encarando.x - this.x, this.encarando.z - this.z);
      let d = alvo - this.group.rotation.y;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      this.group.rotation.y += d * Math.min(1, dt * 4);
    }

    // o passo: patas em diagonal, num seno curto — perna de ovelha e curta, e
    // passo curto e o que faz ela trotar em vez de marchar
    if (andando) {
      const t = fase * 6.5;
      const passo = Math.sin(t) * 0.34;
      this.patas[0].rotation.x = passo;
      this.patas[3].rotation.x = passo;
      this.patas[1].rotation.x = -passo;
      this.patas[2].rotation.x = -passo;
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.018;
      this.corpo.rotation.z = Math.sin(t) * 0.03;
    } else {
      for (const perna of this.patas) {
        perna.rotation.x += (0 - perna.rotation.x) * Math.min(1, dt * 7);
      }
      this.corpo.rotation.z *= 1 - Math.min(1, dt * 7);
      const respira = Math.sin(fase * 1.4) * 0.01;
      this.corpo.position.y += (respira - this.corpo.position.y) * Math.min(1, dt * 5);
    }

    /**
     * A RUMINACAO. O focinho sobe e desce num seno rapido, mas so em PARTE do
     * tempo: `max(0, sin)` elevado deixa ela mastigando uns segundos e parando
     * uns segundos, que e como bicho rumina. Mastigar sem parar vira tique.
     */
    const vontade = Math.max(0, Math.sin(fase * 0.35));
    this.focinho.position.y = -0.075 - Math.abs(Math.sin(fase * 7)) * 0.012 * vontade;
    this.focinho.rotation.x = Math.abs(Math.sin(fase * 7)) * 0.16 * vontade;

    // as orelhas mexem sozinhas, e no carinho elas LEVANTAM (orelha subindo e o
    // jeito mais barato de um bicho dizer que gostou)
    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const tique = Math.sin(fase * 2.1 + i * 1.3) * 0.07;
      this.orelhas[i].rotation.z = -lado * (0.45 - carinho * 0.3 + tique);
      this.orelhas[i].rotation.x = Math.sin(fase * 1.6 + i) * 0.06;
    }

    // a cabeca olha em volta parada, e sobe no carinho
    this.cabeca.rotation.y = andando ? 0 : Math.sin(fase * 0.5) * 0.3;
    const alvoCabeca = -carinho * 0.2 + Math.sin(fase * 1.2) * 0.025;
    this.cabeca.rotation.x += (alvoCabeca - this.cabeca.rotation.x) * Math.min(1, dt * 4);

    // olho fechando de contente
    const abertura = 1 - carinho * 0.82;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.12, abertura);

    // o lacinho e as pontas da fita balancam — sao os detalhes que dizem que ela
    // esta viva quando esta parada na porta da loja
    this.laco.rotation.z = Math.sin(fase * 2.4) * 0.09 * (andando ? 1.6 : 1) + carinho * 0.14;
    for (let i = 0; i < this.pontasDaFita.length; i++) {
      const ponta = this.pontasDaFita[i];
      const balanco = Math.sin(fase * (andando ? 5.5 : 1.5) - i * 0.6) * (andando ? 0.16 : 0.05);
      /*
       * O BALANCO SOMA NA BASE QUE O `montar` DEIXOU, e nao substitui: as duas
       * pontas caem de jeitos diferentes (uma no lombo, outra no flanco), e um
       * angulo cravado aqui desfaria isso no primeiro quadro.
       */
      const base = ponta.userData.base as { x: number; z: number };
      ponta.rotation.z = base.z + balanco;
      ponta.rotation.x = base.x + balanco * 0.5;
    }

    // o rabinho, com a defasagem de sempre entre os dois gomos
    for (let i = 0; i < this.rabo.length; i++) {
      const t = (i + 1) / this.rabo.length;
      this.rabo[i].rotation.z = Math.sin(fase * 3 - i * 0.7) * 0.14 * t * (1 + carinho);
    }
  }
}
