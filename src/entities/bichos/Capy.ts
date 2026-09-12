import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O CAPY, a capivara salva-vidas da piscina do clube. O nome e do Renan.
 *
 * Ele e o segundo funcionario do clube com POSTO, depois da Gina da portaria, e
 * o mecanismo e o mesmo: a cena passa uma area menor que os 70 cm de distancia
 * minima que o `novoDestino` exige, as doze tentativas falham e ele fica onde
 * esta — respirando, olhando a agua e apitando de vez em quando. Nenhuma linha
 * de cerebro precisou mudar para ele nao sair da cadeira.
 *
 * ELE MORA EM CIMA DA CADEIRA, e isso e a cena quem resolve, nao ele: o `y` do
 * grupo nunca e tocado pelo cerebro (so `x` e `z` mudam), entao a cena levanta
 * ele ate o estrado uma vez e pronto. Foi de graca, e e o mesmo motivo pelo
 * qual a Gina cabe dentro da guarita.
 *
 * CAPIVARA NAO TEM MANCHA NEM RABO, e e isso que a torna dificil: tirando o
 * focinho, ela e um bloco marrom. O que faz o bicho ser lido sao tres coisas,
 * e todas sao proporcao, nao enfeite:
 *
 * 1. o FOCINHO E QUADRADO e avanca reto, sem afinar — focinho pontudo vira
 *    porquinho-da-india, focinho redondo vira urso;
 * 2. os OLHOS E AS ORELHAS FICAM NO ALTO DA CABECA, quase na linha de cima:
 *    e o corpo de bicho que passa o dia com o resto submerso;
 * 3. as PERNAS SAO CURTAS e o corpo quase encosta no chao. Perna longa demais
 *    ja deixou ele com cara de bezerro.
 *
 * O uniforme (a regata, o apito e o oculos) e o que transforma capivara em
 * FUNCIONARIO. Sem ele o Capy seria um bicho que subiu numa cadeira.
 */
export class Capy extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly patas: THREE.Group[] = [];
  private readonly oculos = new THREE.Group();

  constructor(area: AreaDoBicho) {
    super(area, {
      // devagar: e capivara, e ele esta trabalhando sentado
      velocidade: 0.45,
      descansoMin: 2.2,
      descansoMax: 5.0,
      // no posto ele passa o tempo sentado, olhando a agua
      chanceDeSentar: 0.75,
      somCadaMin: 16,
      somCadaMax: 30,
      duracaoDoCarinho: 4.0,
      semente: 20260905,
    });
    this.montar();
    this.prontoParaAparecer('capy');
  }

  // ----------------------------------------------------------------- corpo

  private montar(): void {
    const pelo = toon(P.capivaraPelo);
    const escuro = toon(P.capivaraEscuro);
    const claro = toon(P.capivaraClaro);
    const vermelho = toon(P.salvaVidasVermelho);

    /**
     * O tronco e um ELIPSOIDE, e nao uma capsula girada: capsula deitada poe o
     * comprimento no eixo X, e a cabeca mora no Z. Capivara e um barril — mais
     * larga e mais alta, proporcionalmente, que gato ou cachorro.
     */
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
    tronco.scale.set(0.17, 0.155, 0.255);
    tronco.position.y = 0.27;
    this.corpo.add(tronco);
    // a garupa alta: capivara sobe da nuca para o traseiro, e e essa linha que
    // separa ela de um porquinho
    const garupa = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), pelo);
    garupa.scale.set(0.155, 0.135, 0.13);
    garupa.position.set(0, 0.31, -0.13);
    this.corpo.add(garupa);

    // ---------------------------------------------------------------- patas
    /**
     * PERNA CURTA, e cada uma num grupo com pivo no ombro: o passo e rotacao em
     * volta do ombro, nao malha deslizando pelo chao.
     */
    for (const [x, z] of [
      [-0.105, 0.145], [0.105, 0.145], [-0.105, -0.155], [0.105, -0.155],
    ] as const) {
      const perna = new THREE.Group();
      perna.position.set(x, 0.185, z);
      const osso = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, 0.075, 4, 6), pelo);
      osso.position.y = -0.075;
      perna.add(osso);
      const pata = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.045, 0.1), escuro);
      pata.position.set(0, -0.16, 0.008);
      perna.add(pata);
      this.corpo.add(perna);
      this.patas.push(perna);
    }

    // --------------------------------------------------------------- cabeca
    // CABECA GRANDE, mesma regua chibi do resto do jogo. Ela nasceu com 0,115
    // de raio contra 0,17 de tronco e o bicho lia como bloco marrom com uma
    // bolinha na frente: no tamanho que ele ocupa na tela, e a cabeca que diz
    // que especie e aquilo.
    // etiqueta: e por ela que o teste acha a cabeca para medir a varredura,
    // em vez de adivinhar qual grupo e qual (a Gina faz igual)
    this.cabeca.name = 'cabeca-do-capy';
    this.cabeca.position.set(0, 0.4, 0.235);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
    cranio.scale.set(0.145, 0.128, 0.15);
    this.cabeca.add(cranio);

    /**
     * O FOCINHO QUADRADO, e ele e a assinatura da capivara: uma caixa que sai
     * reta da cabeca, sem afinar e sem arredondar. Focinho em cone vira
     * roedor pequeno; em esfera, vira urso.
     */
    const focinho = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.09, 0.115), pelo);
    focinho.position.set(0, -0.032, 0.145);
    this.cabeca.add(focinho);
    const beico = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.045, 0.04), claro);
    beico.position.set(0, -0.058, 0.19);
    this.cabeca.add(beico);
    const narina = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.028, 0.026), toon(P.capivaraFocinho));
    narina.position.set(0, 0.002, 0.2);
    this.cabeca.add(narina);

    for (const lado of [-1, 1] as const) {
      // OLHO NO ALTO: capivara enxerga com o resto do corpo dentro d'agua
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), toon(0x2b2a33));
      olho.position.set(lado * 0.072, 0.062, 0.1);
      this.cabeca.add(olho);
      this.olhos.push(olho);

      /**
       * ORELHINHA REDONDA E PEQUENA, tambem no alto. Pegadinha de sinal, a
       * mesma do resto do projeto: a da esquerda nasce em `x` negativo, entao
       * `rotation.z` NEGATIVO nela e que abre para fora — por isso o angulo vai
       * multiplicado por `lado`.
       */
      const orelha = new THREE.Group();
      orelha.position.set(lado * 0.108, 0.1, -0.02);
      orelha.rotation.z = lado * 0.3;
      const concha = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), escuro);
      concha.scale.set(0.6, 1, 1);
      orelha.add(concha);
      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }

    /**
     * O OCULOS ESCURO, num grupo proprio para poder SUMIR no carinho: ele tira
     * o oculos quando alguem chega perto, e e o unico jeito de os olhos dele
     * aparecerem. Bicho de oculos escuro nao consegue fazer cara de contente.
     */
    this.oculos.name = 'oculos-do-capy';
    const lente = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.038, 0.028), toon(0x2b2a33));
    lente.position.set(0, 0.064, 0.118);
    this.oculos.add(lente);
    for (const lado of [-1, 1] as const) {
      const haste = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.014, 0.11), toon(0x2b2a33));
      haste.position.set(lado * 0.09, 0.066, 0.06);
      this.oculos.add(haste);
    }
    this.cabeca.add(this.oculos);
    this.corpo.add(this.cabeca);

    // ------------------------------------------------------------- uniforme
    /**
     * A REGATA TEM QUE APARECER DE CIMA, e a primeira versao nao aparecia.
     *
     * Ela era mais BAIXA que o tronco (0,115 contra 0,155 de meia-altura),
     * entao sobrava so uma tira vermelha nas laterais — e a camera isometrica
     * olha o lombo do bicho, nao o flanco. Da vista de jogo o salva-vidas era
     * uma capivara marrom sem uniforme nenhum, e o uniforme e o que transforma
     * bicho em funcionaria.
     *
     * Agora ela e mais alta e mais larga que o tronco e mais curta no `z`: veste
     * o meio do lombo e deixa a garupa e o pescoco de fora, que e o desenho de
     * uma regata vista de cima.
     */
    const regata = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), vermelho);
    regata.scale.set(0.178, 0.163, 0.155);
    regata.position.set(0, 0.272, 0.025);
    this.corpo.add(regata);

    // A CRUZ BRANCA VAI DEITADA NO LOMBO, e nao em pe nas costas: em pe ela
    // ficava perpendicular a vista e sumia. Deitada, ela e a unica coisa que se
    // le a distancia de jogo.
    const barra = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.02, 0.13), toon(P.salvaVidasBranco));
    barra.position.set(0, 0.432, 0.02);
    this.corpo.add(barra);
    const traves = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.02, 0.032), toon(P.salvaVidasBranco));
    traves.position.set(0, 0.432, 0.02);
    this.corpo.add(traves);

    // o apito no cordao, no peito
    const cordao = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.009, 6, 14), toon(P.salvaVidasBranco));
    cordao.position.set(0, 0.375, 0.13);
    cordao.rotation.x = 1.35;
    this.corpo.add(cordao);
    const apito = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.034, 0.03), toon(P.churrascoInox));
    apito.position.set(0, 0.318, 0.185);
    this.corpo.add(apito);

    this.group.add(this.corpo);
  }

  // ------------------------------------------------------------------ pose

  /**
   * Ele e um bicho de POSTO: passa quase todo o tempo sentado, e o que tem que
   * estar vivo e a VARREDURA — a cabeca indo de um lado ao outro da piscina,
   * devagar. Bicho de guarda parado de cabeca fixa lê como estatua.
   */
  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    if (andando) {
      const t = fase * 8;
      const passo = Math.sin(t) * 0.42;
      this.patas[0].rotation.x = passo;
      this.patas[3].rotation.x = passo;
      this.patas[1].rotation.x = -passo;
      this.patas[2].rotation.x = -passo;
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.016;
      this.corpo.rotation.x = 0;
      this.corpo.rotation.z = Math.sin(t) * 0.028;
    } else {
      for (const perna of this.patas) {
        perna.rotation.x += (0 - perna.rotation.x) * Math.min(1, dt * 8);
      }
      this.corpo.rotation.z *= 1 - Math.min(1, dt * 8);
      /**
       * Sentado, o peito SOBE e o traseiro desce. Rotacao em X positiva leva a
       * frente para BAIXO, entao sentar e angulo NEGATIVO — com o sinal trocado
       * ele faz reverencia em vez de sentar.
       */
      const alvoX = sentado ? -0.26 : 0;
      this.corpo.rotation.x += (alvoX - this.corpo.rotation.x) * Math.min(1, dt * 5);
      for (const i of [2, 3]) {
        const alvo = sentado ? 0.7 : 0;
        this.patas[i].rotation.x += (alvo - this.patas[i].rotation.x) * Math.min(1, dt * 5);
      }
      const respira = Math.sin(fase * 1.5) * 0.008;
      const alvoY = (sentado ? -0.024 : 0) + respira;
      this.corpo.position.y += (alvoY - this.corpo.position.y) * Math.min(1, dt * 5);
    }

    /**
     * A VARREDURA DA PISCINA: a cabeca vai de um lado ao outro num seno LENTO
     * (0,45), com uma parada no meio de cada ponta. Rapido demais vira bicho
     * nervoso; parado, vira estatua. No carinho ele para de varrer e olha para
     * quem chegou.
     */
    const varre = Math.sin(fase * 0.45) * 0.62;
    this.cabeca.rotation.y += (varre * (1 - carinho) - this.cabeca.rotation.y) * Math.min(1, dt * 3);
    this.cabeca.rotation.x = -carinho * 0.2 + Math.sin(fase * 1.7) * 0.02;

    // orelhinha girando, e abrindo mais no carinho
    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const tique = Math.sin(fase * 2.1 + i * 1.9);
      this.orelhas[i].rotation.z = lado * (0.3 + carinho * 0.16) + tique * 0.06 * lado;
    }

    // NO CARINHO ELE TIRA O OCULOS. É o unico jeito de os olhos aparecerem, e
    // e o que faz o funcionario virar bicho por um instante.
    this.oculos.visible = carinho < 0.25;
    const abertura = 1 - carinho * 0.75;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.15, abertura);
  }
}
