import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * A girafa porteira da guarita do clube.
 *
 * ELA NÃO PASSEIA, e é de propósito: é a primeira bicho do jogo que tem POSTO.
 * O cérebro do `Bicho` continua servindo inteiro — respirar, olhar em volta,
 * fazer barulho espaçado, receber carinho e se acalmar sozinha —, e quem tira
 * a caminhada é a ÁREA que a cena passa: um retângulo menor que os 70 cm de
 * distância mínima que o `novoDestino` exige de um destino. As doze tentativas
 * falham, ele volta para `parado`, e ela fica no lugar dela. Nenhuma linha do
 * cérebro precisou mudar.
 *
 * O PESCOÇO É UMA CORRENTE DE GOMOS, como o rabo do Pelusa: cada gomo é filho
 * do anterior, então girar o de baixo carrega a curva inteira, e as velocidades
 * diferentes por gomo fazem a cabeça chegar depois do peito. Pescoço de peça
 * única balançaria um poste.
 *
 * A CURVA DO PESCOÇO É PROGRESSIVA, e essa foi a correção que mais mudou o
 * bicho. Com os quatro gomos inclinados igual e forte (0,42 cada), a cabeça
 * descrevia um arco de 96° e vinha parar na altura do lombo: de lado ela lia
 * como braquiossauro, não como girafa. Girafa tem o pescoço quase em pé, com a
 * curva concentrada no ALTO — daí os ângulos crescerem de baixo (0,15) para
 * cima (0,38). O que sobra de inclinação é o suficiente para a cabeça passar da
 * parede da guarita e ficar do lado de fora da sombra do telhado, que a 34° de
 * câmera come tudo que fica para dentro.
 */
export class Girafa extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly pescoco = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly gomos: THREE.Group[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly patas: THREE.Mesh[] = [];
  private readonly gomosDoRabo: THREE.Group[] = [];

  /**
   * A inclinação de repouso de cada gomo do pescoço, para os senos oscilarem em
   * volta dela.
   *
   * O SINAL AQUI JÁ ESTEVE ERRADO, e o erro era invisível na foto: `rotation.x`
   * POSITIVO leva o `+Y` local para o `+Z`, que é para onde o bicho olha. Com os
   * quatro negativos o pescoço se deitava para TRÁS, por cima do próprio lombo —
   * e como a girafa é simétrica, de longe parecia só uma curva estranha. Quem
   * pegou foi o teste, medindo o `z` da cabeça contra a parede da guarita: ela
   * estava 57 cm atrás do pescoço, e não 60 à frente.
   */
  private static readonly CURVA = [0.15, 0.22, 0.3, 0.38];

  constructor(area: AreaDoBicho) {
    super(area, {
      // ela quase não anda, mas quando o cérebro a solta é um passo de bicho
      // grande: devagar e comprido
      velocidade: 0.4,
      descansoMin: 2.6,
      descansoMax: 6,
      // porteiro não senta no posto
      chanceDeSentar: 0,
      somCadaMin: 14,
      somCadaMax: 26,
      semente: 7071988,
    });
    this.montar();
    this.prontoParaAparecer('girafa');
  }

  // ----------------------------------------------------------------- corpo

  private montar(): void {
    const pelo = toon(P.girafaPelo);
    const mancha = toon(P.girafaMancha);
    const claro = toon(P.girafaClaro);
    const casco = toon(P.girafaCasco);
    const crina = toon(P.girafaCrina);

    /**
     * A MANCHA É UMA PASTILHA POUSADA POR FORA, e não um pedaço de outra cor
     * dentro da malha. Ela nasce 1 cm além da superfície e é ACHATADA no eixo
     * que aponta para fora, então acompanha a curva sem cortar nada — e duas
     * superfícies curvas nunca caem no mesmo plano, que é o que serrilharia.
     *
     * No pescoço (cilindro em pé) o eixo que aponta para fora é o X, e é ele
     * que fica achatado. Nada de `lookAt` aqui: `lookAt` mede em espaço de
     * mundo, e estas pastilhas nascem dentro de um gomo que ainda vai girar.
     */
    const pastilhaLateral = (
      pai: THREE.Object3D, lado: -1 | 1, raio: number, y: number, r: number,
    ): void => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), mancha);
      m.scale.set(0.42, 1, 1);
      m.position.set(lado * (raio + 0.008), y, 0);
      pai.add(m);
    };

    // ------------------------------------------------------------- tronco
    // Elipsoide, e não cápsula girada: a cápsula põe o comprimento no X, e a
    // cabeça e o rabo moram no Z — o bicho sai atravessado em relação a si
    // mesmo. (Foi o primeiro erro que o Pelusa pagou em foto.)
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pelo);
    tronco.scale.set(0.28, 0.35, 0.5);
    tronco.position.y = 1.38;
    this.corpo.add(tronco);
    // a garupa de girafa cai para trás: o peito é mais alto que o traseiro
    tronco.rotation.x = 0.12;

    const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
    peito.scale.set(0.26, 0.3, 0.24);
    peito.position.set(0, 1.5, 0.33);
    this.corpo.add(peito);

    /**
     * A CERNELHA — o cupim de músculo que toda girafa tem no lombo, logo atrás
     * do pescoço. Sem ela o tronco visto de cima é um disco, e o bicho lê como
     * mesa de quatro pés: é ela que dá a linha caindo da nuca para a garupa.
     */
    const cernelha = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
    cernelha.scale.set(0.23, 0.19, 0.3);
    cernelha.position.set(0, 1.62, 0.14);
    this.corpo.add(cernelha);

    const barriga = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), claro);
    barriga.scale.set(0.22, 0.15, 0.42);
    barriga.position.set(0, 1.23, -0.02);
    this.corpo.add(barriga);

    for (const [x, y, z, r] of [
      [0.19, 1.56, 0.18, 0.1], [-0.21, 1.52, -0.04, 0.11], [0.22, 1.4, -0.2, 0.09],
      [-0.17, 1.6, -0.28, 0.08], [0.15, 1.64, -0.06, 0.07], [-0.24, 1.34, 0.16, 0.08],
      [0.09, 1.68, 0.3, 0.07], [-0.11, 1.66, -0.42, 0.07],
    ] as const) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), mancha);
      p.scale.set(1, 1, 0.5);
      p.position.set(x, y, z);
      p.lookAt(0, y, 0);
      this.corpo.add(p);
    }

    // --------------------------------------------------------------- patas
    /**
     * Perna de girafa é comprida e reta, com o casco escuro na ponta. A cápsula
     * tem altura total `comprimento + 2·raio`: com o centro em metade disso ela
     * encosta no chão em vez de flutuar — a mesma conta da pata do Pelusa.
     */
    for (const [lado, frente] of [[-1, 1], [1, 1], [-1, -1], [1, -1]] as const) {
      const perna = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 1.0, 4, 8), pelo);
      perna.position.set(lado * 0.19, 0.57, frente * 0.3);
      this.patas.push(perna);
      this.corpo.add(perna);

      const joelho = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), pelo);
      joelho.position.set(lado * 0.19, 0.62, frente * 0.3);
      this.corpo.add(joelho);

      const cascoM = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.088, 0.11, 10), casco);
      cascoM.position.set(lado * 0.19, 0.055, frente * 0.3);
      this.corpo.add(cascoM);
    }

    // ------------------------------------------------------------- pescoço
    /**
     * Quatro gomos encadeados, cada um mais fino que o anterior. A inclinação
     * de repouso está em `CURVA`, e ela é MAIOR embaixo: pescoço que sai do
     * corpo já deitado e vai endireitando lê como debruçado na janela; ângulo
     * igual em todos daria uma rampa reta.
     */
    let pai: THREE.Object3D = this.pescoco;
    for (let i = 0; i < 4; i++) {
      const gomo = new THREE.Group();
      const raio = 0.15 - i * 0.014;
      const malha = new THREE.Mesh(new THREE.CylinderGeometry(raio - 0.012, raio, 0.3, 10), pelo);
      malha.position.y = 0.15;
      gomo.add(malha);

      // duas manchas por gomo, uma de cada lado, desencontradas na altura
      for (const lado of [-1, 1] as const) {
        pastilhaLateral(malha, lado, raio * 0.92, (i % 2 === 0 ? -0.04 : 0.06), raio * 0.52);
      }

      /**
       * A CRINA. Ela é uma crista CONTÍNUA descendo a nuca, e não um tufo por
       * gomo: com peças curtas e largas ela lia como faixa de curativo enrolada
       * no pescoço. Fina, alta e do comprimento inteiro do gomo, vira crina.
       */
      const tufo = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.1, 0.32), crina);
      tufo.position.set(0, 0.155, -raio * 0.78);
      tufo.rotation.x = -0.1;
      gomo.add(tufo);

      gomo.position.y = i === 0 ? 0 : 0.3;
      gomo.rotation.x = Girafa.CURVA[i];
      pai.add(gomo);
      pai = gomo;
      this.gomos.push(gomo);
    }
    this.pescoco.position.set(0, 1.68, 0.26);
    this.corpo.add(this.pescoco);

    // -------------------------------------------------------------- cabeça
    // A cabeça volta a nivelar: o pescoço chega inclinado ~50° e ela desfaz
    // isso, porque girafa olha para a frente, não para o chão.
    // Os quatro gomos somam 1,05 rad de inclinação; a cabeça desfaz 0,8 deles.
    // O que sobra é o olhar levemente para baixo de quem está atrás do balcão
    // olhando quem chega — e de uma girafa a dupla é vista sempre de cima.
    this.cabeca.position.y = 0.3;
    this.cabeca.rotation.x = -0.8;
    // etiqueta para o teste conseguir medir onde a cabeça foi parar: é ela que
    // precisa estar do lado de fora da parede e acima do balcão
    this.cabeca.name = 'cabeca-da-girafa';
    pai.add(this.cabeca);

    const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), pelo);
    cranio.scale.set(0.95, 1, 1.05);
    this.cabeca.add(cranio);

    const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.098, 10, 8), claro);
    focinho.scale.set(0.92, 0.82, 1.25);
    focinho.position.set(0, -0.03, 0.15);
    this.cabeca.add(focinho);

    for (const lado of [-1, 1]) {
      const narina = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5), toon(P.girafaCasco));
      narina.scale.set(1, 0.7, 0.6);
      narina.position.set(lado * 0.038, -0.012, 0.256);
      this.cabeca.add(narina);
    }

    // a boca: um sulco escuro achatado, que é o que dá o sorriso de longe
    const boca = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), toon(P.girafaCasco));
    boca.scale.set(0.9, 0.16, 0.5);
    boca.position.set(0, -0.078, 0.2);
    this.cabeca.add(boca);

    for (const lado of [-1, 1]) {
      /**
       * OSSICONE: o chifrinho coberto de pelo que só girafa tem, com o tufo
       * escuro na ponta. É ele que faz a silhueta ser lida como girafa mesmo
       * quando a cabeça é a única coisa visível pela janela da guarita.
       */
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.13, 6), pelo);
      haste.position.set(lado * 0.052, 0.16, -0.01);
      haste.rotation.z = lado * -0.16;
      this.cabeca.add(haste);
      const pompom = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), crina);
      pompom.position.set(lado * 0.062, 0.228, -0.012);
      this.cabeca.add(pompom);

      // orelha: uma folha achatada, aberta para fora
      const orelha = new THREE.Group();
      const folha = new THREE.Mesh(new THREE.SphereGeometry(0.062, 8, 6), pelo);
      folha.scale.set(1.45, 0.3, 0.75);
      orelha.add(folha);
      const dentro = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), claro);
      dentro.scale.set(1.3, 0.24, 0.6);
      dentro.position.y = 0.014;
      orelha.add(dentro);
      orelha.position.set(lado * 0.13, 0.08, -0.03);
      // pegadinha de sinal: a da esquerda nasce em -x, e `rotation.z` negativo
      // nela é que abre para FORA
      orelha.rotation.z = lado * 0.5;
      orelha.rotation.y = lado * -0.3;
      this.orelhas.push(orelha);
      this.cabeca.add(orelha);

      // olho grande, com pálpebra e cílios — é o que dá simpatia de porteiro
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), toon(0xfdfaf3));
      olho.position.set(lado * 0.088, 0.038, 0.078);
      this.olhos.push(olho);
      this.cabeca.add(olho);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.021, 8, 6), toon(0x2b2721));
      pupila.position.set(lado * 0.1, 0.036, 0.104);
      this.cabeca.add(pupila);
      for (let c = 0; c < 3; c++) {
        const cilio = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.008, 0.008), toon(0x2b2721));
        cilio.position.set(lado * 0.1, 0.072, 0.076 - c * 0.022);
        cilio.rotation.z = lado * 0.5;
        this.cabeca.add(cilio);
      }
    }

    /**
     * O QUEPE DO PORTEIRO. Ele é o que transforma uma girafa em funcionário do
     * clube, então tem os três pedaços que um quepe tem: copa, tarja e aba. A
     * aba aponta para a frente da cabeça e é achatada, para não virar telhado.
     */
    const copa = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.085, 14), toon(P.guaritaFaixa));
    copa.position.set(0, 0.135, 0.012);
    this.cabeca.add(copa);
    const tarja = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.128, 0.03, 14), toon(P.portaoFerro));
    tarja.position.set(0, 0.096, 0.012);
    this.cabeca.add(tarja);
    const aba = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI), toon(P.portaoFerro));
    aba.scale.set(1, 0.14, 0.95);
    aba.position.set(0, 0.09, 0.05);
    aba.rotation.y = Math.PI / 2;
    this.cabeca.add(aba);
    const brasao = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toon(P.gold));
    brasao.scale.set(1, 1, 0.4);
    brasao.position.set(0, 0.14, 0.118);
    this.cabeca.add(brasao);

    // ------------------------------------------------------- gravata e apito
    // no peito, logo abaixo do pescoço: é o que se vê pela janela da guarita
    const gravata = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), toon(P.gravataBorboleta));
    gravata.scale.set(1.5, 0.7, 0.5);
    gravata.position.set(0, 1.66, 0.44);
    this.corpo.add(gravata);
    const noDaGravata = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toon(P.gravataNo));
    noDaGravata.position.set(0, 1.66, 0.47);
    this.corpo.add(noDaGravata);

    const cordao = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 6, 14, Math.PI), toon(P.portaoFerro));
    cordao.position.set(0, 1.6, 0.4);
    cordao.rotation.set(Math.PI / 2, 0, 0);
    this.corpo.add(cordao);
    const apito = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.075, 8), toon(P.gold));
    apito.position.set(0, 1.48, 0.42);
    apito.rotation.x = Math.PI / 2;
    this.corpo.add(apito);

    // ---------------------------------------------------------------- rabo
    let paiDoRabo: THREE.Object3D = new THREE.Group();
    const raboBase = paiDoRabo as THREE.Group;
    for (let i = 0; i < 3; i++) {
      const gomo = new THREE.Group();
      const malha = new THREE.Mesh(new THREE.CylinderGeometry(0.022 - i * 0.004, 0.026 - i * 0.004, 0.16, 6), pelo);
      malha.position.y = -0.08;
      gomo.add(malha);
      gomo.position.y = i === 0 ? 0 : -0.16;
      gomo.rotation.x = i === 0 ? 0.2 : 0.12;
      paiDoRabo.add(gomo);
      paiDoRabo = gomo;
      this.gomosDoRabo.push(gomo);
    }
    const vassoura = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), crina);
    vassoura.scale.set(0.7, 1.5, 0.7);
    vassoura.position.y = -0.19;
    paiDoRabo.add(vassoura);
    raboBase.position.set(0, 1.58, -0.48);
    this.corpo.add(raboBase);

    this.group.add(this.corpo);
  }

  // ------------------------------------------------------------------ pose

  /**
   * Porteira parada não pode virar estátua: o que a mantém viva é a soma de
   * quatro senos lentos e defasados — a respiração no peito, o pescoço
   * balançando, a cabeça olhando a rua e o rabo enxotando mosca.
   */
  protected animar(dt: number, { andando, carinho, fase }: PoseDoBicho): void {
    if (andando) {
      const t = fase * 5.5;
      // patas em diagonal, como todo bicho de quatro patas anda
      this.patas[0].position.z = 0.3 + Math.sin(t) * 0.09;
      this.patas[3].position.z = -0.3 + Math.sin(t) * 0.09;
      this.patas[1].position.z = 0.3 - Math.sin(t) * 0.09;
      this.patas[2].position.z = -0.3 - Math.sin(t) * 0.09;
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.03;
    } else {
      for (let i = 0; i < 4; i++) {
        const base = i < 2 ? 0.3 : -0.3;
        this.patas[i].position.z += (base - this.patas[i].position.z) * Math.min(1, dt * 6);
      }
      // a respiração: um sobe e desce de 2 cm, bem lento
      const respira = Math.sin(fase * 1.1) * 0.02;
      this.corpo.position.y += (respira - this.corpo.position.y) * Math.min(1, dt * 4);
    }

    /**
     * O PESCOÇO. Cada gomo oscila em volta da própria curva de repouso, e com
     * frequência crescente de baixo para cima: é a defasagem que faz a cabeça
     * chegar depois do peito, como pescoço de verdade. No carinho ele desce
     * mais um pouco, que é a girafa baixando a cabeça para a mão.
     */
    const balanco = andando ? 1.4 : 1;
    for (let i = 0; i < this.gomos.length; i++) {
      const g = this.gomos[i];
      const amp = (0.02 + i * 0.014) * balanco;
      g.rotation.x = Girafa.CURVA[i] + carinho * 0.09 + Math.sin(fase * (0.8 + i * 0.45)) * amp;
      g.rotation.z = Math.sin(fase * (0.5 + i * 0.3) + i) * amp * 0.8;
    }

    // a cabeça acompanha o pescoço para continuar nivelada, e olha a rua
    // no carinho ela baixa mais a cabeça, que é o gesto de chegar perto
    this.cabeca.rotation.x = -0.8 + carinho * 0.16 + Math.sin(fase * 0.9) * 0.05;
    this.cabeca.rotation.y = Math.sin(fase * 0.42) * 0.42 * (1 - carinho);

    // orelhas: um tique de vez em quando, e abertas no carinho
    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const tique = Math.sin(fase * 1.8 + i * 2.1);
      this.orelhas[i].rotation.z = lado * (0.5 + carinho * 0.16) + tique * 0.07 * lado;
    }

    // rabo enxotando mosca — o gomo de baixo devagar, a ponta rápida
    for (let i = 0; i < this.gomosDoRabo.length; i++) {
      const g = this.gomosDoRabo[i];
      const amp = (0.09 + i * 0.07) * (1 + carinho);
      g.rotation.z = Math.sin(fase * (1.6 + i * 0.8)) * amp;
    }

    // no carinho ela aperta os olhos de contente
    const abertura = 1 - carinho * 0.8;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.14, abertura);
  }
}
