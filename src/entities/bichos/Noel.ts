import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O NOEL, o peru que trabalha no bar de sucos do clube. O nome e do Renan.
 *
 * Ele e o terceiro funcionario do clube, depois da Gina da portaria e do Capy
 * da piscina, e e o PRIMEIRO que nao fica parado num posto: o Noel passeia
 * numa faixa curta na frente do quiosque, porque ele nao consegue ficar quieto.
 * A area dele e maior que o passo minimo do cerebro, e e so isso que separa um
 * bicho de posto de um bicho que anda — nenhuma linha de cerebro mudou.
 *
 * O QUE FAZ UM PERU SER LIDO COMO PERU, e sao tres coisas, nesta ordem:
 *
 * 1. O LEQUE DA CAUDA. E a silhueta inteira do bicho. Ele e um arco de penas
 *    abertas EM PE atras do corpo, e nao um rabo deitado — deitado ele some na
 *    camera isometrica, que olha de cima. Cada pena tem a ponta clara, porque e
 *    a BARRA que faz o leque parecer leque em vez de uma mancha marrom.
 * 2. O PESCOCO PELADO E VERMELHO NA CABECA. Peru nao tem penugem no pescoco: e
 *    pele azulada com carúncula (a pelanca sobre o bico) e barbelo (a papada).
 *    Sem esses dois pendurados vermelhos, o bicho vira galinha.
 * 3. O CORPO GORDO E BAIXO, com as pernas curtas e afastadas. Peru e uma bola
 *    com um pescoco fino saindo na frente.
 *
 * A ROUPINHA DE VENDEDOR — avental teal do quiosque, viseira e cracha — e o que
 * o transforma em FUNCIONARIO, e ela foi feita para ser vista DE CIMA: o
 * avental sobe pelo peito ate o papo, e a viseira e larga. Uniforme que so
 * aparece de perfil nao aparece nunca, e foi o erro que a regata do Capy pagou.
 */
export class Noel extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly pescoco = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly leque = new THREE.Group();
  private readonly penasDoLeque: THREE.Group[] = [];
  private readonly asas: THREE.Group[] = [];
  private readonly patas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly barbelo = new THREE.Group();

  constructor(area: AreaDoBicho) {
    super(area, {
      /**
       * ELE E ELETRICO: anda depressa, quase nao para e quase nunca senta.
       *
       * O descanso e o numero que mais importa aqui, e ele ja esteve errado.
       * Com 0,7-2,0 s de pausa numa faixa de 2,4, o Noel passava a maior parte
       * do tempo PARADO entre dois passinhos curtos — media 1,0 de caminhada
       * onde o Walter, que so passeia pelo salao, media 4,8. Bicho inquieto que
       * fica parado nao e inquieto.
       */
      velocidade: 0.85,
      descansoMin: 0.2,
      descansoMax: 0.7,
      chanceDeSentar: 0.05,
      // e falante: gluglu a cada 8-16 s, bem mais que os outros bichos
      somCadaMin: 8,
      somCadaMax: 16,
      duracaoDoCarinho: 3.0,
      semente: 20260906,
    });
    this.montar();
    this.prontoParaAparecer('noel');
  }

  // ----------------------------------------------------------------- corpo

  private montar(): void {
    const pena = toon(P.peruPena);
    const penaClara = toon(P.peruPenaClara);
    const barra = toon(P.peruBarra);
    const pele = toon(P.peruCabeca);
    const vermelho = toon(P.peruCarunculo);
    const avental = toon(P.aventalDoNoel);

    /**
     * O CORPO E UMA BOLA, e nao um charuto: peru e largo e curto. O eixo mais
     * comprido e o `z`, mas so um pouco — 0,2 contra 0,17 de largura.
     */
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pena);
    tronco.scale.set(0.17, 0.165, 0.2);
    tronco.position.y = 0.29;
    this.corpo.add(tronco);
    // o papo claro, na frente e embaixo: e ele que da a barriga do peru
    const papo = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), penaClara);
    papo.scale.set(0.13, 0.115, 0.13);
    papo.position.set(0, 0.245, 0.1);
    this.corpo.add(papo);

    // ------------------------------------------------------------- as patas
    /**
     * PERNA CURTA E AFASTADA, num grupo com pivo no quadril. O dedo do meio
     * aponta para a frente e os dois de fora abrem — pe de passaro sem dedo
     * separado vira palito.
     */
    for (const lado of [-1, 1] as const) {
      const perna = new THREE.Group();
      perna.position.set(lado * 0.075, 0.175, 0.015);
      const canela = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.06, 4, 6), toon(P.peruPata));
      canela.position.y = -0.055;
      perna.add(canela);
      for (const [dx, dz, giro] of [[0, 0.055, 0], [-0.04, 0.03, -0.6], [0.04, 0.03, 0.6]] as const) {
        const dedo = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.018, 0.075), toon(P.peruPata));
        dedo.position.set(dx, -0.105, dz);
        dedo.rotation.y = giro;
        perna.add(dedo);
      }
      this.corpo.add(perna);
      this.patas.push(perna);
    }

    // -------------------------------------------------------------- as asas
    // Dobradas no corpo, com pivo no ombro: no carinho e no gluglu elas abrem.
    for (const lado of [-1, 1] as const) {
      const asa = new THREE.Group();
      asa.position.set(lado * 0.155, 0.315, 0.01);
      const pluma = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), pena);
      pluma.scale.set(0.045, 0.1, 0.155);
      asa.add(pluma);
      const ponta = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.09), barra);
      ponta.position.set(0, -0.055, -0.09);
      asa.add(ponta);
      this.corpo.add(asa);
      this.asas.push(asa);
    }

    /**
     * ------------------------------------------------------------- O LEQUE
     *
     * Onze penas num arco de 150°, EM PE atras do corpo. Cada pena e um grupo
     * girado em Z (para abrir o leque) e inclinado em X (para o leque deitar um
     * pouco para tras, como no bicho de verdade).
     *
     * A PONTA CLARA DE CADA PENA E OBRIGATORIA. Sem a barra, as onze penas
     * viram uma mancha marrom unica atras do peru — o leque so existe porque a
     * borda dele e mais clara que o miolo.
     */
    // O LEQUE FICA QUASE EM PE (-0,3, e nao -0,42). Deitado para tras ele
    // encurta na camera de 34°, que ja olha de cima: perde metade da area
    // justo na vista em que o jogo e jogado.
    this.leque.name = 'leque-do-noel';
    this.leque.position.set(0, 0.31, -0.16);
    this.leque.rotation.x = -0.3;
    const PENAS = 11;
    for (let i = 0; i < PENAS; i++) {
      const k = i / (PENAS - 1) - 0.5;          // -0,5 a 0,5
      const gomo = new THREE.Group();
      gomo.rotation.z = k * 2.6;                 // 150° de abertura no total
      const comprimento = 0.4 - Math.abs(k) * 0.09;
      const haste = new THREE.Mesh(
        new THREE.BoxGeometry(0.052, comprimento, 0.022),
        i % 2 === 0 ? pena : penaClara,
      );
      haste.position.y = comprimento / 2;
      gomo.add(haste);
      const pontaClara = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.07, 0.024), barra);
      pontaClara.position.y = comprimento - 0.02;
      gomo.add(pontaClara);
      this.leque.add(gomo);
      this.penasDoLeque.push(gomo);
    }
    this.corpo.add(this.leque);

    // ------------------------------------------------------- pescoco e cabeca
    /**
     * O PESCOCO E PELADO, e sobe em S: um gomo saindo do peito e a cabeca
     * pousada em cima dele. Pescoco reto vira ganso.
     */
    this.pescoco.name = 'pescoco-do-noel';
    this.pescoco.position.set(0, 0.36, 0.115);
    this.pescoco.rotation.x = -0.28;
    const gogo = new THREE.Mesh(new THREE.CapsuleGeometry(0.037, 0.1, 4, 8), pele);
    gogo.position.y = 0.085;
    this.pescoco.add(gogo);

    this.cabeca.name = 'cabeca-do-noel';
    this.cabeca.position.set(0, 0.165, 0.012);
    this.cabeca.rotation.x = 0.3;
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
    cranio.scale.set(0.052, 0.055, 0.055);
    this.cabeca.add(cranio);

    const bico = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.075, 8), toon(P.peruBico));
    bico.position.set(0, -0.008, 0.06);
    bico.rotation.x = Math.PI / 2;
    this.cabeca.add(bico);

    /**
     * A CARÚNCULA (a pelanca vermelha que cai sobre o bico) e O BARBELO (a
     * papada) — sao os dois pendurados que fazem o bicho ser peru e nao
     * galinha. O barbelo fica num grupo proprio porque ele BALANCA: e o detalhe
     * que mais mostra que o Noel esta animado.
     */
    const carunculo = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.05, 4, 6), vermelho);
    carunculo.position.set(0, 0.008, 0.062);
    carunculo.rotation.x = 0.35;
    this.cabeca.add(carunculo);

    this.barbelo.position.set(0, -0.03, 0.032);
    const papada = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), vermelho);
    papada.scale.set(0.026, 0.045, 0.02);
    papada.position.y = -0.032;
    this.barbelo.add(papada);
    this.cabeca.add(this.barbelo);

    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), toon(0x2b2a33));
      olho.position.set(lado * 0.04, 0.016, 0.036);
      this.cabeca.add(olho);
      this.olhos.push(olho);
    }
    this.pescoco.add(this.cabeca);
    this.corpo.add(this.pescoco);

    // ------------------------------------------------------------- uniforme
    /**
     * O AVENTAL SOBE PELO PEITO, e nao fica so na barriga: a camera olha o
     * bicho de cima, e uniforme na barriga de um passaro nao aparece nunca.
     * Foi o erro que a regata do Capy pagou, e aqui ele ja nasce corrigido.
     */
    const peitilho = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), avental);
    peitilho.scale.set(0.135, 0.13, 0.115);
    peitilho.position.set(0, 0.275, 0.13);
    this.corpo.add(peitilho);
    // a alcinha por cima do ombro, que fecha o avental por tras
    for (const lado of [-1, 1] as const) {
      const alca = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.075, 0.05), avental);
      alca.position.set(lado * 0.075, 0.375, 0.075);
      this.corpo.add(alca);
    }
    // o bolso do avental e o crachá: dois retangulos claros que leem de longe
    const bolso = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.045, 0.02), toon(P.aventalFaixa));
    bolso.position.set(0, 0.235, 0.235);
    this.corpo.add(bolso);
    const cracha = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.032, 0.018), toon(P.aventalFaixa));
    cracha.position.set(0.075, 0.325, 0.2);
    this.corpo.add(cracha);

    /**
     * A VISEIRA. Aba larga e BAIXA na testa, nao um bone: o bico do peru avanca
     * muito, e um bone fechado esconderia a cabeca inteira da camera.
     */
    const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.028, 10), avental);
    aro.position.set(0, 0.048, 0.002);
    this.cabeca.add(aro);
    const aba = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.016, 0.075), avental);
    aba.position.set(0, 0.042, 0.055);
    aba.rotation.x = -0.2;
    this.cabeca.add(aba);

    /**
     * O NOEL E GRANDE PARA UM BICHO DESTE JOGO, e e de proposito: peru de
     * verdade bate no joelho de gente. Montado no tamanho do Pelusa ele lia
     * como galinha, e na vista de jogo virava uma bolota marrom ao lado do
     * quiosque — media 0,55 de altura contra 1,75 da dupla.
     *
     * A escala vai no CORPO inteiro, e nao numero por numero: as proporcoes ja
     * estao afinadas entre si, e mexer em cada medida so abriria chance de
     * quebrar uma delas.
     */
    this.corpo.scale.setScalar(1.45);
    this.group.add(this.corpo);
  }

  // ------------------------------------------------------------------ pose

  /**
   * O NOEL E O BICHO MAIS AGITADO DO JOGO, e a pose e que diz isso. Enquanto os
   * outros respiram devagar, ele:
   *
   * - balanca o corpo no ritmo do passo, e continua balancando parado;
   * - abre e fecha o leque sozinho, de tempos em tempos — e o tique dele;
   * - sacode o barbelo, que e a pelanca do queixo, o tempo todo;
   * - e no carinho ele ABRE O LEQUE INTEIRO e bate as asas, que e o que um peru
   *   contente faz de verdade.
   */
  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    if (andando) {
      const t = fase * 11;
      // as duas patas alternadas, e o corpo gingando de lado: peru anda
      // rebolando, e e esse gingado que o separa de uma bola deslizando
      this.patas[0].rotation.x = Math.sin(t) * 0.6;
      this.patas[1].rotation.x = -Math.sin(t) * 0.6;
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.028;
      this.corpo.rotation.z = Math.sin(t) * 0.09;
      this.corpo.rotation.x = 0;
    } else {
      for (const perna of this.patas) {
        perna.rotation.x += (0 - perna.rotation.x) * Math.min(1, dt * 8);
      }
      // parado ele NAO fica quieto: continua com um balancinho curto
      const inquieto = Math.sin(fase * 3.1) * 0.03;
      this.corpo.rotation.z += (inquieto - this.corpo.rotation.z) * Math.min(1, dt * 6);
      const alvoX = sentado ? -0.22 : 0;
      this.corpo.rotation.x += (alvoX - this.corpo.rotation.x) * Math.min(1, dt * 5);
      const respira = Math.sin(fase * 2.4) * 0.01;
      const alvoY = (sentado ? -0.05 : 0) + respira;
      this.corpo.position.y += (alvoY - this.corpo.position.y) * Math.min(1, dt * 5);
    }

    /**
     * O LEQUE ABRE E FECHA. Em repouso ele fica a 55% da abertura; no carinho
     * vai a 100%. O seno lento por cima e o tique dele — peru de leque parado
     * lê como enfeite pregado nas costas.
     */
    const abertura = 0.55 + carinho * 0.45 + Math.sin(fase * 0.8) * 0.12;
    for (let i = 0; i < this.penasDoLeque.length; i++) {
      const k = i / (this.penasDoLeque.length - 1) - 0.5;
      this.penasDoLeque[i].rotation.z = k * 2.6 * abertura;
    }
    this.leque.rotation.x = -0.42 + carinho * 0.16;

    // as asas: coladas no corpo, e batendo quando ele esta contente
    const bate = carinho * Math.sin(fase * 14) * 0.55;
    for (let i = 0; i < this.asas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      this.asas[i].rotation.z = lado * (0.1 + carinho * 0.3 + Math.abs(bate));
    }

    // o pescoco olha em volta parado, e o bico sobe no carinho
    this.pescoco.rotation.y = andando ? 0 : Math.sin(fase * 0.9) * 0.4;
    this.pescoco.rotation.x = -0.28 - carinho * 0.12;
    this.cabeca.rotation.x = 0.3 + Math.sin(fase * 2.2) * 0.05;

    // O BARBELO BALANCA SEMPRE, e mais forte quando ele anda ou esta contente:
    // e o detalhe pequeno que faz o bicho parecer vivo de perto
    const sacode = (andando ? 1 : 0.5) + carinho;
    this.barbelo.rotation.x = Math.sin(fase * 9) * 0.22 * sacode;
    this.barbelo.rotation.z = Math.cos(fase * 7) * 0.14 * sacode;

    // no carinho ele aperta os olhos de contente
    const olhoAberto = 1 - carinho * 0.7;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.2, olhoAberto);
  }
}
