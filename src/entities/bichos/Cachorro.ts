import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O GARCOM CANINO, agora passeando pelo salao do Mania de Churrasco.
 *
 * Ele ja existia como `dogWaiter()` em `world/props.ts`, e continua existindo:
 * la ele e PECA DE CUTSCENE — nasce na porta do restaurante do clube, leva o
 * prato ate a mesa e e `dispose`ado. Peca parada, com o passo fingido por um
 * seno que a cena empurra de fora.
 *
 * Isso nao serve para quem mora no salao. Bicho que passeia precisa decidir
 * para onde vai, contornar mesa, parar, sentar e latir sozinho — que e
 * exatamente o cerebro do `Bicho`. Por isso ele foi remontado aqui em vez de
 * reaproveitado: as duas versoes tem a MESMA aparencia de proposito (mesmo
 * pelo, mesma gravata, mesma bandeja nas costas, para ser lido como o mesmo
 * cachorro), mas esta e articulada — pernas, cabeca, orelhas e rabo em grupos
 * separados, que e o que `animar()` precisa mexer.
 *
 * A BANDEJA FICA, mesmo vazia. Ele esta em servico: e a bandeja nas costas,
 * mais a gravata, que faz o bicho ler como funcionario da casa e nao como
 * cachorro que entrou da rua.
 */
export class Cachorro extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly rabo = new THREE.Group();
  /** dianteira esquerda, dianteira direita, traseira esquerda, traseira direita */
  private readonly pernas: THREE.Group[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly gomosDoRabo: THREE.Group[] = [];

  /** onde o prato vai pousar quando o minijogo existir */
  readonly bandeja = new THREE.Object3D();

  constructor(area: AreaDoBicho) {
    super(area, {
      // mais rapido que o gato: cachorro em servico anda decidido
      velocidade: 0.78,
      descansoMin: 1.0,
      descansoMax: 3.2,
      // ele senta pouco — esta trabalhando
      chanceDeSentar: 0.2,
      somCadaMin: 12,
      somCadaMax: 24,
      duracaoDoCarinho: 3.4,
      semente: 20260904,
    });
    this.montar();
    this.prontoParaAparecer('garcom-canino');
  }

  // ----------------------------------------------------------------- corpo

  private montar(): void {
    const pelo = toon(P.cachorroPelo);
    const creme = toon(P.cachorroPeito);
    const orelhaCor = toon(P.cachorroOrelha);

    /**
     * O tronco e um ELIPSOIDE, nao uma capsula girada: capsula deitada poe o
     * comprimento no eixo X, e a cabeca e o rabo moram no Z — o bicho sai
     * atravessado em relacao a propria cabeca.
     */
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
    tronco.scale.set(0.125, 0.115, 0.215);
    tronco.position.y = 0.3;
    this.corpo.add(tronco);

    // o peito creme: FAIXA baixa e estreita na frente, nao um segundo corpo
    const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), creme);
    peito.scale.set(0.098, 0.082, 0.115);
    peito.position.set(0, 0.27, 0.14);
    this.corpo.add(peito);

    // ---------------------------------------------------------------- patas
    /**
     * Cada perna e um GRUPO com pivo no ombro (`y = 0,235`), e nao uma malha
     * solta: o passo e uma rotacao em X em volta do ombro, que e como perna de
     * bicho anda. Mover a malha em Z faria a pata deslizar pelo chao.
     *
     * `CapsuleGeometry(r, comp)` tem altura total `comp + 2r`; a perna vai de
     * `y = 0,235` para baixo, entao a malha desce metade disso.
     */
    for (const [x, z] of [
      [-0.082, 0.135], [0.082, 0.135], [-0.082, -0.15], [0.082, -0.15],
    ] as const) {
      const perna = new THREE.Group();
      perna.position.set(x, 0.235, z);
      const osso = new THREE.Mesh(new THREE.CapsuleGeometry(0.033, 0.13, 4, 6), pelo);
      osso.position.y = -0.098;
      perna.add(osso);
      const patinha = new THREE.Mesh(new THREE.BoxGeometry(0.066, 0.042, 0.084), creme);
      patinha.position.set(0, -0.206, 0.01);
      perna.add(patinha);
      this.corpo.add(perna);
      this.pernas.push(perna);
    }

    // --------------------------------------------------------------- cabeca
    // Cabeca GRANDE, mesma regua chibi do resto do jogo: no tamanho que ele
    // ocupa na tela, e a cabeca que faz ele ser lido como cachorro.
    this.cabeca.position.set(0, 0.44, 0.19);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
    cranio.scale.set(0.108, 0.1, 0.105);
    this.cabeca.add(cranio);

    const focinho = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.08, 0.1), creme);
    focinho.position.set(0, -0.028, 0.115);
    this.cabeca.add(focinho);
    const nariz = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.038, 0.028), toon(P.cachorroFocinho));
    nariz.position.set(0, -0.012, 0.172);
    this.cabeca.add(nariz);

    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.023, 8, 6), toon(0x2b2a33));
      olho.position.set(lado * 0.052, 0.032, 0.088);
      this.cabeca.add(olho);
      this.olhos.push(olho);

      /**
       * A ORELHA CAIDA e o que faz ele parecer cachorro fofo e nao lobo. Ela e
       * um grupo com pivo NO ALTO da cabeca, para balancar pendurada.
       *
       * Pegadinha de sinal, a mesma do resto do projeto: a orelha da esquerda
       * nasce em `x` negativo, entao `rotation.z` NEGATIVO nela e que abre para
       * fora. Por isso o angulo e multiplicado por `lado`.
       */
      const orelha = new THREE.Group();
      orelha.position.set(lado * 0.088, 0.052, -0.005);
      orelha.rotation.z = lado * 0.22;
      const aba = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.14, 0.062), orelhaCor);
      aba.position.y = -0.068;
      orelha.add(aba);
      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }
    this.corpo.add(this.cabeca);

    // -------------------------------------------------------------- gravata
    // duas asas e o no, no pescoco: e ela que transforma cachorro em garcom
    for (const lado of [-1, 1] as const) {
      const asa = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.06, 0.03), toon(P.gravataBorboleta));
      asa.position.set(lado * 0.05, 0.335, 0.235);
      asa.rotation.z = lado * 0.35;
      this.corpo.add(asa);
    }
    const no = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.036, 0.04), toon(P.gravataNo));
    no.position.set(0, 0.335, 0.245);
    this.corpo.add(no);

    // ----------------------------------------------------------------- rabo
    /**
     * Rabo em GOMOS ENCADEADOS (cada um filho do anterior), com amplitude e
     * velocidade crescendo da base para a ponta: e a defasagem que faz a ponta
     * chegar depois e o rabo chicotear. Gomo unico balanca uma barra rigida.
     *
     * A base tomba PARA TRAS. `rotation.x` positivo leva o `+Y` local para o
     * `+Z`, que aqui e para a frente, para cima da propria bandeja — o rabo
     * tem que ir para o outro lado, entao o angulo e negativo.
     */
    this.rabo.position.set(0, 0.34, -0.21);
    this.rabo.rotation.x = -0.6;
    let pai: THREE.Object3D = this.rabo;
    for (let i = 0; i < 4; i++) {
      const gomo = new THREE.Group();
      gomo.position.y = i === 0 ? 0 : 0.075;
      const osso = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.026 - i * 0.003, 0.06, 3, 6),
        i === 3 ? creme : pelo,
      );
      osso.position.y = 0.04;
      gomo.add(osso);
      pai.add(gomo);
      pai = gomo;
      this.gomosDoRabo.push(gomo);
    }
    this.corpo.add(this.rabo);

    // -------------------------------------------------------------- bandeja
    /**
     * A BANDEJA TEM BORDA, e isso não é enfeite: a primeira versão era a tábua
     * chapada de 0,24 × 0,30 que o `dogWaiter()` usa na cutscene, e de perto
     * ela lia como uma PRANCHA atravessada no lombo — quase do tamanho do
     * corpo, sem nada que dissesse "isto é uma bandeja". Menor, com uma borda
     * de 1 cm em volta e apoiada numa almofadinha vermelha, ela vira bandeja.
     *
     * E ela é DE INOX, não de madeira: no salão o chão é assoalho e o pelo dele
     * é caramelo, então uma bandeja de madeira sumia nos dois. O aço é a única
     * coisa clara na silhueta dele, e é o que faz a bandeja aparecer de longe.
     */
    const apoio = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.035, 0.16), toon(P.churrascoToalha));
    apoio.position.set(0, 0.395, -0.03);
    this.corpo.add(apoio);
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.022, 0.235), toon(P.churrascoInox));
    tabua.position.set(0, 0.423, -0.03);
    this.corpo.add(tabua);
    for (const [dx, dz, larg, prof] of [
      [0, 0.118, 0.185, 0.018], [0, -0.118, 0.185, 0.018],
      [-0.093, 0, 0.018, 0.235], [0.093, 0, 0.018, 0.235],
    ] as const) {
      const borda = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.03, prof), toon(P.churrascoInoxEscuro));
      borda.position.set(dx, 0.442, -0.03 + dz);
      this.corpo.add(borda);
    }
    this.bandeja.name = 'bandeja';
    this.bandeja.position.set(0, 0.434, -0.03);
    this.corpo.add(this.bandeja);

    this.group.add(this.corpo);
  }

  // ------------------------------------------------------------------ pose

  /**
   * As patas andam EM DIAGONAL (dianteira esquerda com traseira direita), que e
   * como bicho de quatro patas anda de verdade — as quatro no mesmo compasso
   * viram um cavalinho de balanco.
   */
  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    if (andando) {
      const t = fase * 10;
      const passo = Math.sin(t) * 0.5;
      this.pernas[0].rotation.x = passo;
      this.pernas[3].rotation.x = passo;
      this.pernas[1].rotation.x = -passo;
      this.pernas[2].rotation.x = -passo;
      // o gingado: sobe-e-desce curto no passo, e nao um deslizar de caixa
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.022;
      this.corpo.rotation.x = 0;
      this.corpo.rotation.z = Math.sin(t) * 0.035;
    } else {
      // as patas voltam ao lugar por interpolacao, nunca por estalo
      for (const perna of this.pernas) {
        perna.rotation.x += (0 - perna.rotation.x) * Math.min(1, dt * 8);
      }
      this.corpo.rotation.z *= 1 - Math.min(1, dt * 8);
      /**
       * Sentado o peito SOBE e o traseiro desce. Rotacao em X positiva leva a
       * frente para BAIXO (o `+Z` desce), entao sentar e angulo NEGATIVO — o
       * sinal trocado deixa o cachorro fazendo reverencia.
       */
      const alvoX = sentado ? -0.3 : 0;
      this.corpo.rotation.x += (alvoX - this.corpo.rotation.x) * Math.min(1, dt * 5);
      // e sentado ele encolhe as pernas de tras, que e o que faz o quadril
      // encostar no chao em vez de o bicho inteiro tombar
      for (const i of [2, 3]) {
        const alvo = sentado ? 0.75 : 0;
        this.pernas[i].rotation.x += (alvo - this.pernas[i].rotation.x) * Math.min(1, dt * 5);
      }
      const respira = Math.sin(fase * 1.8) * 0.007;
      const alvoY = (sentado ? -0.03 : 0) + respira;
      this.corpo.position.y += (alvoY - this.corpo.position.y) * Math.min(1, dt * 5);
    }

    /**
     * O RABO E O TERMOMETRO DELE, e por isso ele nunca para: abanando forte
     * andando, devagar parado, e desabalado no carinho. Cachorro de rabo quieto
     * lê como bicho empalhado.
     */
    const forte = (andando ? 1 : 0.5) + carinho * 1.4;
    for (let i = 0; i < this.gomosDoRabo.length; i++) {
      const g = this.gomosDoRabo[i];
      const amp = (0.16 + i * 0.1) * forte;
      g.rotation.z = Math.sin(fase * (5.5 + i * 1.6)) * amp;
    }

    // a cabeca olha em volta parado, e sobe para encostar na mao no carinho
    this.cabeca.rotation.y = andando ? 0 : Math.sin(fase * 0.7) * 0.36;
    this.cabeca.rotation.x = -carinho * 0.26 + Math.sin(fase * 2.0) * 0.02;

    // orelhas balancando penduradas, e abrindo mais no carinho
    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const tique = Math.sin(fase * 2.6 + i * 1.4);
      this.orelhas[i].rotation.z = lado * (0.22 + carinho * 0.14) + tique * 0.06 * lado;
      this.orelhas[i].rotation.x = (andando ? Math.sin(fase * 10) * 0.08 : 0);
    }

    // no carinho ele aperta os olhos de contente
    const abertura = 1 - carinho * 0.8;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.15, abertura);
  }
}
