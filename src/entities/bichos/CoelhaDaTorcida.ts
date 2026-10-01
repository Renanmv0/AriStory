import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { letreiro } from '../../world/props';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * AS COELHAS DA TORCIDA: a LUNA e as irmãs dela, a SOL e a ESTRELLA — as três
 * cheerleaders dos Gatitos. É UM corpo só, montado por uma FICHA (`FichaDeCoelha`):
 * o pelo, as orelhas, o enfeite da cabeça, a boca, o jeito do olho e o
 * tamanho. O uniforme e os pompons são os mesmos — é o time.
 *
 * - a LUNA (a primeira que a dupla conhece): cinza-pérola, a orelha direita
 *   com a ponta dobrada e o laço amarelo na esquerda;
 * - a SOL, a animada, que fala alto e está sempre feliz: cor de damasco, as
 *   duas orelhas BEM em pé, a presilha de sol e o sorrisão de boca aberta. O
 *   gesto dela é o SALTO (`saltar`);
 * - a ESTRELLA, a calma, sempre preocupada com as duas: chocolate ao leite,
 *   as orelhas CAÍDAS dos lados (coelha de orelha caída é a silhueta mais
 *   tranquila que existe), a estrelinha dourada no alto da cabeça, as
 *   olhar sereno (o traço da pálpebra) e um sorriso pequeno. O gesto dela é a ESTRELINHA
 *   (`estrelinha`), a ginástica — o nome dela, feito movimento.
 *
 * O resto deste comentário é o da Luna, que continua valendo para as três.
 *
 * A LUNA, a coelhinha cheerleader dos Gatitos — a atlética da Escola do
 * Gatito. O nome, o time e o jeito são do Renan: ela é SUPER fã dos Gatitos e
 * se anima quando fala deles, e quando percebe que está falando demais fica
 * tímida. Ela faz aula de português na escola (com o Gatito) há bastante
 * tempo, fala português, e as expressões que escapam são do espanhol. É a
 * primeira personagem da escola; ela mora no Villa Lobos só até alguém ir lá.
 *
 * O QUE FAZ UMA COELHA SER LIDA COMO COELHA, nesta ordem:
 *
 * 1. AS ORELHAS COMPRIDAS EM PÉ, mais altas que a cabeça. É a única coisa que
 *    a câmera de 34° lê de longe. E a direita tem a PONTA DOBRADA para a
 *    frente: duas orelhas retas fazem um coelho de logotipo; uma dobrada faz
 *    um bicho de pelúcia com personalidade.
 * 2. O FOCINHO CLARO com o nariz rosa, que é o que separa coelho de gato.
 * 3. O RABINHO de algodão, uma bola branca atrás da saia.
 * 4. OS PÉS COMPRIDOS, mais longos que largos, que aparecem sentada.
 *
 * O QUE DIZ QUE ELA É A CHEERLEADER (a mesma regra do avental do Mano e da
 * fita métrica da Estella: uniforme transforma bicho em alguém):
 *
 *  - os POMPONS, um em cada mão, em bolotas amarelas e azuis. Eles são o
 *    acessório que se lê sozinho, então nascem grandes;
 *  - o top azul da escola com o "G" num círculo amarelo no peito, e a saia
 *    azul com a barra amarela — as cores que a escola do Gatito já tem
 *    (amarelo e azul, as que Brasil e Venezuela dividem nas bandeiras);
 *  - o LAÇO amarelo na base da orelha esquerda, que é o laço de torcida;
 *  - a PRESILHA DE LUA na frente da orelha dobrada, que combina com o sol da
 *    Sol e a estrela da Estrella (pedido do Renan: as três de céu).
 *
 * E ELA TEM TRÊS JEITOS, que a cena aciona durante a conversa: TORCER (pula e
 * sacode os pompons no alto), FICAR TÍMIDA (patas no rosto, orelhas caídas
 * para trás, bochecha mais corada) e SENTADA (o piquenique). O pelo é
 * cinza-pérola: o Gatito e o Pelusa já são creme.
 */
/** o que muda de uma irmã para a outra */
export interface FichaDeCoelha {
  /** a etiqueta (`userData.peca`) e o nome da cabeça: `cabeca-da-<id>` */
  id: 'luna' | 'sol' | 'estrella';
  pelo: number;
  peloClaro: number;
  orelhaDentro: number;
  bochecha: number;
  /**
   * as orelhas: `dobrada` (a da Luna: a esquerda em pé, a direita com a
   * ponta dobrada), `em-pe` (as duas retas e compridas) ou `caidas` (as duas
   * pendendo dos lados da cabeça)
   */
  orelhas: 'dobrada' | 'em-pe' | 'caidas';
  /** a presilha de céu de cada uma: a lua da Luna, o sol da Sol, a estrela da Estrella */
  enfeite: 'lua' | 'sol' | 'estrela';
  /** o laço de torcida na orelha esquerda (só a Luna) */
  laco: boolean;
  boca: 'linha' | 'sorrisao' | 'sorrisinho';
  /** o olhar calmo: o olho um tico mais fechado, com o traço da pálpebra */
  olhoSereno: boolean;
  /** o tamanho no fim (a Luna é 1,15) */
  escala: number;
  semente: number;
}

export const FICHA_DA_LUNA: FichaDeCoelha = {
  id: 'luna', pelo: P.lunaPelo, peloClaro: P.lunaPeloClaro, orelhaDentro: P.lunaOrelhaDentro,
  bochecha: P.lunaBochecha, orelhas: 'dobrada', enfeite: 'lua', laco: true, boca: 'linha', olhoSereno: false,
  escala: 1.15, semente: 20260928,
};

export const FICHA_DA_SOL: FichaDeCoelha = {
  id: 'sol', pelo: P.solPelo, peloClaro: P.solPeloClaro, orelhaDentro: P.solOrelhaDentro,
  bochecha: P.solBochecha, orelhas: 'em-pe', enfeite: 'sol', laco: false, boca: 'sorrisao', olhoSereno: false,
  // a menor das três, e a mais barulhenta
  escala: 1.08, semente: 20261001,
};

export const FICHA_DA_ESTRELLA: FichaDeCoelha = {
  id: 'estrella', pelo: P.estrellaPelo, peloClaro: P.estrellaPeloClaro, orelhaDentro: P.estrellaOrelhaDentro,
  bochecha: P.estrellaBochecha, orelhas: 'caidas', enfeite: 'estrela', laco: false, boca: 'sorrisinho', olhoSereno: true,
  // a mais alta: a que cuida das outras duas
  escala: 1.21, semente: 20261002,
};

/** o salto da Sol: agacha, sobe, abre as pernas no alto (o "toe touch") e aterrissa */
const DURA_SALTO = 1.55;
/** quanto o salto sobe, em unidades do mundo */
const ALTURA_DO_SALTO = 0.72;
/** a estrelinha da Estrella: prepara, roda uma volta inteira de lado, e a pose */
const DURA_ESTRELINHA = 1.7;
/** quanto ela anda de lado durante a volta */
const PASSO_DA_ESTRELINHA = 1.15;
/** o centro da volta, na altura do quadril (em unidades do corpo, antes da escala) */
const CENTRO_DA_VOLTA = 0.4;
/** quanto o olho sereno (o da Estrella) fica aberto, de 0 a 1 */
const ABERTURA_SERENA = 0.8;
/**
 * A DANÇA DA FESTA do fim do Módulo 1 (pedido do Renan: "uma dança de uns 10
 * segundos"): 10,8 s na contagem de torcida, a 120 por minuto — dois tempos
 * por segundo, a mesma batida da música da festa (`festa-da-torcida`).
 */
export const DURA_DA_FESTA = 10.8;
/** o lugar de cada uma na dança: a Estrella à esquerda da tela, a Luna no meio, a Sol à direita */
export type PapelNaFesta = 'luna' | 'sol' | 'estrella';

export class CoelhaDaTorcida extends Bicho {
  readonly ficha: FichaDeCoelha;
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly pernas: THREE.Group[] = [];
  /** os dois braços, com pivô no ombro; o pompom é filho da pata */
  private readonly bracos: THREE.Group[] = [];
  /** os pompons, para o sacode e para o teste saber onde eles estão */
  readonly pompons: THREE.Group[] = [];
  /** as orelhas: [esquerda, direita] */
  private readonly orelhas: THREE.Group[] = [];
  /** a ponta dobrada da orelha direita (só a da Luna), que balança atrasada */
  private readonly pontaDaOrelha = new THREE.Group();
  private temPontaDobrada = false;
  /** o quanto cada orelha abre para fora, em repouso (caída é quase 2,3 rad) */
  private aberturaDaOrelha = 0.12;
  private readonly olhos: THREE.Group[] = [];
  private readonly bochechas: THREE.Mesh[] = [];

  /** quanto falta de cada gesto, em segundos, e o relógio próprio dele */
  private torcendo = 0;
  private timida = 0;
  private relogioDoGesto = 0;
  /** o quanto cada pose já entrou (0 a 1), para nada mudar num estalo */
  private misturaTorcida = 0;
  private misturaTimida = 0;
  private misturaSentada = 0;
  /** o treino no ginásio: ligado pela cena, e o relógio da coreografia */
  private treinoLigado = false;
  private relogioDoTreino = 0;
  private misturaTreino = 0;
  /** o salto e a estrelinha: o relógio de cada um, negativo quando parado */
  private relogioDoSalto = -1;
  private relogioDaEstrelinha = -1;
  /** para que lado (do corpo dela) a estrelinha anda: 1 é o +X dela */
  private sentidoDaEstrelinha: 1 | -1 = 1;
  /** a altura do salto neste quadro (o teste lê) */
  private alturaAgora = 0;
  /** a dança da festa: o relógio dela (negativo parada), o papel e o lado de fora */
  private relogioDaFesta = -1;
  private papelNaFesta: PapelNaFesta = 'luna';
  private sentidoDaFesta: 1 | -1 = 1;
  private maiorGiroDaFesta = 0;

  constructor(area: AreaDoBicho, ficha: FichaDeCoelha) {
    super(area, {
      // ela é de POSTO (o piquenique): a área que a cena passa a segura ali
      velocidade: 0.6,
      descansoMin: 1.5,
      descansoMax: 3.5,
      chanceDeSentar: 0,
      // coelho não faz barulho: o som dela é o do pompom, e quem toca é a cena
      somCadaMin: 1e6,
      somCadaMax: 1e6,
      duracaoDoCarinho: 2.5,
      semente: ficha.semente,
    });
    this.ficha = ficha;
    this.montar();
    this.prontoParaAparecer(ficha.id);
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const pelo = toon(this.ficha.pelo);
    const peloClaro = toon(this.ficha.peloClaro);
    const uniforme = toon(P.lunaUniforme);
    const faixa = toon(P.lunaUniformeFaixa);

    // ------------------------------------------------------------ as pernas
    /**
     * Pivô no QUADRIL (`y = 0,2`), para a perna girar inteira para a frente
     * quando ela senta. O pé é um elipsoide comprido no `z` e encosta no chão:
     * o centro dele fica a um raio acima da sola.
     */
    for (const lado of [-1, 1] as const) {
      const perna = new THREE.Group();
      perna.position.set(lado * 0.06, 0.2, 0);
      const coxa = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 4, 10), pelo);
      coxa.position.y = -0.095;
      perna.add(coxa);
      const pe = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), peloClaro);
      pe.scale.set(0.05, 0.03, 0.095);
      pe.position.set(0, -0.17, 0.045);
      perna.add(pe);
      this.corpo.add(perna);
      this.pernas.push(perna);
    }

    // -------------------------------------------------------------- a saia
    // um cone aberto embaixo, azul, com a barra amarela em volta
    const saia = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.19, 0.1, 16), uniforme);
    saia.position.y = 0.22;
    this.corpo.add(saia);
    const barra = new THREE.Mesh(new THREE.TorusGeometry(0.188, 0.013, 6, 24), faixa);
    barra.rotation.x = Math.PI / 2;
    barra.position.y = 0.176;
    this.corpo.add(barra);

    // ------------------------------------------------------------- o tronco
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pelo);
    tronco.scale.set(0.13, 0.15, 0.115);
    tronco.position.y = 0.36;
    this.corpo.add(tronco);
    /**
     * O TOP é uma casca POR FORA do tronco (maior nos três eixos) e mais baixa
     * que ele: o pescoço de pelo aparece por cima, e é isso que faz o top ser
     * roupa e não a cor do bicho.
     */
    const top = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), uniforme);
    top.scale.set(0.138, 0.12, 0.123);
    top.position.y = 0.37;
    this.corpo.add(top);
    /**
     * O EMBLEMA: um círculo amarelo com o "G" azul, no meio do peito. Ele fica
     * na linha do equador do top, onde a casca está mais para a frente — mais
     * para cima, a curva afasta a casca e o emblema ficaria voando.
     */
    const emblema = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), faixa);
    emblema.scale.set(0.052, 0.052, 0.014);
    emblema.position.set(0, 0.375, 0.118);
    this.corpo.add(emblema);
    const letraG = letreiro('G', 0.08, 0.08, '#3f6fc6');
    letraG.position.set(0, 0.377, 0.1335);
    this.corpo.add(letraG);

    // o rabinho de algodão, atrás da saia e um pouco para fora dela
    const rabo = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), peloClaro);
    rabo.position.set(0, 0.25, -0.17);
    this.corpo.add(rabo);

    // ------------------------------------------------------------ os braços
    /**
     * Pivô no OMBRO. Em pé, os braços ficam ABERTOS e um pouco à frente, com
     * os pompons na altura do quadril: fechados, as bolotas entrariam na saia.
     * O sinal é o de sempre — o braço esquerdo nasce em `x` negativo, então
     * abrir para fora é `lado * ângulo` em `rotation.z`.
     */
    for (const lado of [-1, 1] as const) {
      const braco = new THREE.Group();
      braco.position.set(lado * 0.125, 0.46, 0);
      const antebraco = new THREE.Mesh(new THREE.CapsuleGeometry(0.034, 0.1, 4, 10), pelo);
      antebraco.position.y = -0.085;
      braco.add(antebraco);
      const pata = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), peloClaro);
      pata.position.y = -0.17;
      braco.add(pata);
      const pompom = this.fazerPompom();
      pompom.position.y = -0.2;
      braco.add(pompom);
      braco.rotation.z = lado * 0.45;
      braco.rotation.x = -0.3;
      this.corpo.add(braco);
      this.bracos.push(braco);
      this.pompons.push(pompom);
    }

    this.montarCabeca();
    this.corpo.add(this.cabeca);

    /**
     * ELA CRESCE NO FIM, como o Mano: montada em números de bicho de chão, a
     * cabeça chega a 0,87 e a ponta das orelhas a 1,28 — no peito da dupla,
     * que é a altura certa para uma coelha em pé ao lado de gente.
     */
    this.corpo.scale.setScalar(this.ficha.escala);
    this.group.add(this.corpo);
  }

  /**
   * O POMPOM: um miolo amarelo e 22 bolotas espalhadas pela superfície dele
   * (espiral de Fibonacci, sem sorteio, para a foto do teste não mudar), uma
   * amarela, uma azul. Bolota de uma cor só vira bola de lã; as duas cores
   * alternando é o que diz "pompom de torcida".
   */
  private fazerPompom(): THREE.Group {
    const g = new THREE.Group();
    g.name = 'pompom';
    const amarelo = toon(P.lunaPomponAmarelo);
    const azul = toon(P.lunaPomponAzul);
    const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 8), amarelo);
    g.add(miolo);
    const N = 22;
    const ouro = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * ouro;
      const bolota = new THREE.Mesh(new THREE.SphereGeometry(0.034, 7, 6), i % 2 ? azul : amarelo);
      bolota.position.set(Math.cos(a) * r * 0.068, y * 0.068, Math.sin(a) * r * 0.068);
      g.add(bolota);
    }
    return g;
  }

  private montarCabeca(): void {
    const f = this.ficha;
    const pelo = toon(f.pelo);
    const peloClaro = toon(f.peloClaro);
    const dentro = toon(f.orelhaDentro);

    this.cabeca.name = `cabeca-da-${f.id}`;
    this.cabeca.position.set(0, 0.62, 0.005);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 14), pelo);
    cranio.scale.set(0.15, 0.14, 0.14);
    this.cabeca.add(cranio);

    // o focinho claro, o nariz rosa e a boquinha
    const focinho = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), peloClaro);
    focinho.scale.set(0.075, 0.055, 0.05);
    focinho.position.set(0, -0.04, 0.11);
    this.cabeca.add(focinho);
    const nariz = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.lunaNariz));
    nariz.scale.set(0.022, 0.016, 0.014);
    nariz.position.set(0, -0.014, 0.156);
    this.cabeca.add(nariz);
    this.cabeca.add(this.fazerBoca());

    /**
     * OS OLHOS, cada um num grupo com pivô no centro dele: a piscada é o
     * `scale.y` do grupo, e o branco, a pupila e o brilho fecham juntos.
     * O cílio da ponta de fora é o que diz "ela".
     */
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Group();
      olho.position.set(lado * 0.058, 0.02, 0.112);
      const branco = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), peloClaro);
      olho.add(branco);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), toon(P.lunaOlho));
      pupila.position.set(lado * 0.002, -0.002, 0.023);
      olho.add(pupila);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 6), peloClaro);
      brilho.position.set(lado * 0.01, 0.012, 0.043);
      olho.add(brilho);
      const cilio = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.01), toon(P.lunaOlho));
      cilio.position.set(lado * 0.03, 0.026, 0.014);
      cilio.rotation.z = lado * 0.5;
      olho.add(cilio);
      if (f.olhoSereno) {
        /*
         * O OLHAR CALMO da Estrella: um TRAÇO de pálpebra, escuro, abraçando
         * o alto da pupila — e o olho um tico mais fechado (`ABERTURA_SERENA`
         * na piscada). Começou como uma meia esfera de pelo por cima do olho,
         * e de perto virou um calombo marrom tapando o branco, com o cílio
         * boiando acima dele: olho de sono, não de calma.
         */
        const traco = new THREE.Mesh(
          new THREE.TorusGeometry(0.0255, 0.0042, 6, 14, Math.PI * 0.86), toon(P.lunaOlho),
        );
        traco.rotation.z = Math.PI * 0.07;
        traco.position.set(lado * 0.002, -0.002, 0.033);
        olho.add(traco);
      }
      this.cabeca.add(olho);
      this.olhos.push(olho);

      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), toon(f.bochecha));
      bochecha.scale.set(0.034, 0.022, 0.015);
      bochecha.position.set(lado * 0.09, -0.035, 0.105);
      this.cabeca.add(bochecha);
      this.bochechas.push(bochecha);
    }

    // ------------------------------------------------------------ as orelhas
    /**
     * Pivô na BASE, no alto do crânio. Cada orelha é o pelo por fora e o rosa
     * por dentro, 1 cm à frente — o rosa é menor nos três eixos, então ele
     * nunca vaza pela borda.
     *
     * A DIREITA TEM DOIS GOMOS: a base em pé e a ponta dobrada para a frente
     * (`rotation.x` positivo leva o `+Y` para o `+Z`, para onde ela olha).
     */
    const caidas = f.orelhas === 'caidas';
    this.aberturaDaOrelha = caidas ? 2.2 : f.orelhas === 'em-pe' ? 0.07 : 0.12;
    for (const lado of [-1, 1] as const) {
      const orelha = new THREE.Group();
      // a caída nasce mais para o lado do crânio, senão ela atravessa a testa
      orelha.position.set(lado * (caidas ? 0.1 : 0.062), caidas ? 0.09 : 0.115, -0.01);
      orelha.rotation.z = -lado * this.aberturaDaOrelha;
      const dobrada = f.orelhas === 'dobrada' && lado > 0;
      const comprimento = dobrada ? 0.1 : f.orelhas === 'em-pe' ? 0.21 : caidas ? 0.16 : 0.19;
      const fora = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pelo);
      fora.scale.set(0.045, comprimento, 0.03);
      fora.position.y = comprimento * 0.95;
      orelha.add(fora);
      const miolo = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), dentro);
      miolo.scale.set(0.027, comprimento * 0.78, 0.012);
      miolo.position.set(0, comprimento * 0.95, 0.02);
      orelha.add(miolo);
      if (dobrada) {
        this.temPontaDobrada = true;
        this.pontaDaOrelha.position.y = 0.18;
        const ponta = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pelo);
        ponta.scale.set(0.043, 0.095, 0.028);
        ponta.position.y = 0.085;
        this.pontaDaOrelha.add(ponta);
        const pontaDentro = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), dentro);
        pontaDentro.scale.set(0.025, 0.07, 0.011);
        pontaDentro.position.set(0, 0.085, 0.019);
        this.pontaDaOrelha.add(pontaDentro);
        this.pontaDaOrelha.rotation.x = 0.55;
        orelha.add(this.pontaDaOrelha);
      } else if (lado < 0 && f.laco) {
        orelha.add(this.fazerLaco());
      } else if (lado < 0 && f.enfeite === 'sol') {
        orelha.add(this.fazerPresilhaDeSol());
      }
      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }
    // a estrelinha da Estrella vai no ALTO da cabeça, entre as orelhas caídas:
    // é a parte da cabeça que a câmera de cima mais vê
    if (f.enfeite === 'estrela') this.cabeca.add(this.fazerEstrelinhaDeCabelo());
    // a lua da Luna vai do outro lado do laço, na frente da orelha dobrada
    if (f.enfeite === 'lua') this.cabeca.add(this.fazerPresilhaDeLua());
  }

  /**
   * A BOCA: a linha da Luna; o SORRISÃO da Sol, meia-lua escura de boca
   * aberta com a língua rosa (é a que fala alto); o SORRISINHO da Estrella,
   * um arco pequeno e fechado.
   */
  private fazerBoca(): THREE.Object3D {
    const escuro = toon(P.lunaOlho);
    const f = this.ficha;
    if (f.boca === 'sorrisao') {
      const g = new THREE.Group();
      const aberta = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 12, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), escuro,
      );
      aberta.scale.set(1.2, 1, 0.45);
      aberta.position.set(0, -0.047, 0.152);
      g.add(aberta);
      const lingua = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toon(P.lunaNariz));
      lingua.scale.set(1.4, 0.7, 0.6);
      lingua.position.set(0, -0.064, 0.158);
      g.add(lingua);
      return g;
    }
    if (f.boca === 'sorrisinho') {
      const arco = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0035, 5, 12, Math.PI), escuro);
      arco.rotation.z = Math.PI;
      arco.position.set(0, -0.044, 0.157);
      return arco;
    }
    const linha = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.006, 0.008), escuro);
    linha.position.set(0, -0.05, 0.158);
    return linha;
  }

  /** A PRESILHA DE SOL da Sol: o miolo amarelo e oito raios laranja, na base da orelha. */
  private fazerPresilhaDeSol(): THREE.Group {
    const g = new THREE.Group();
    g.position.set(0, 0.04, 0.042);
    const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.014, 16), toon(P.solPresilhaMiolo));
    miolo.rotation.x = Math.PI / 2;
    g.add(miolo);
    const laranja = toon(P.solPresilha);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const raio = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.03, 5), laranja);
      raio.position.set(Math.cos(a) * 0.043, Math.sin(a) * 0.043, -0.002);
      raio.rotation.z = a - Math.PI / 2;
      g.add(raio);
    }
    return g;
  }

  /** A ESTRELINHA da Estrella: cinco pontas, achatada, deitada um pouco para a frente. */
  private fazerEstrelinhaDeCabelo(): THREE.Mesh {
    const forma = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + (i / 10) * Math.PI * 2;
      const r = i % 2 ? 0.022 : 0.052;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) forma.moveTo(x, y);
      else forma.lineTo(x, y);
    }
    forma.closePath();
    const geo = new THREE.ExtrudeGeometry(forma, { depth: 0.016, bevelEnabled: false });
    geo.translate(0, 0, -0.008);
    const estrela = new THREE.Mesh(geo, toon(P.estrellaEstrela));
    estrela.name = 'estrelinha-da-estrella';
    // em cima da cabeça, um pouco para a frente e inclinada para a câmera
    estrela.position.set(0.035, 0.135, 0.05);
    estrela.rotation.set(-0.55, 0, -0.25);
    return estrela;
  }

  /**
   * A PRESILHA DE LUA da Luna: uma lua crescente — o arco de fora é meio
   * círculo, o de dentro meia elipse fina, e as duas pontas se encontram em
   * cima e embaixo. Presa na cabeça, na frente da orelha dobrada (a direita
   * dela, x positivo), e virada para a câmera.
   */
  private fazerPresilhaDeLua(): THREE.Mesh {
    const R = 0.052;
    const forma = new THREE.Shape();
    const passos = 14;
    for (let i = 0; i <= passos; i++) {
      const a = Math.PI / 2 + (i / passos) * Math.PI;
      if (i === 0) forma.moveTo(Math.cos(a) * R, Math.sin(a) * R);
      else forma.lineTo(Math.cos(a) * R, Math.sin(a) * R);
    }
    for (let i = passos - 1; i > 0; i--) {
      const a = Math.PI / 2 + (i / passos) * Math.PI;
      forma.lineTo(Math.cos(a) * R * 0.3, Math.sin(a) * R);
    }
    forma.closePath();
    // a borda arredondada (o bisel) é o que faz ela ser presilha, e não pintura no pelo
    const geo = new THREE.ExtrudeGeometry(forma, {
      depth: 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.004, bevelSegments: 2,
    });
    geo.translate(0, 0, -0.006);
    const lua = new THREE.Mesh(geo, toon(P.lunaLua));
    lua.name = 'lua-da-luna';
    lua.position.set(0.08, 0.102, 0.078);
    lua.rotation.set(-0.5, 0.55, -0.35);
    return lua;
  }

  /**
   * O LAÇO DE TORCIDA, preso na base da orelha esquerda e À FRENTE dela: no
   * alto da cabeça ele brigaria com as duas orelhas. Duas alças achatadas, o nó
   * azul no meio e as duas pontinhas caindo.
   */
  private fazerLaco(): THREE.Group {
    const laco = new THREE.Group();
    laco.position.set(0, 0.045, 0.045);
    const amarelo = toon(P.lunaLaco);
    for (const lado of [-1, 1] as const) {
      const alca = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), amarelo);
      alca.scale.set(0.05, 0.034, 0.02);
      alca.position.x = lado * 0.047;
      alca.rotation.z = lado * 0.35;
      laco.add(alca);
      const fita = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.05, 0.01), amarelo);
      fita.position.set(lado * 0.016, -0.036, 0);
      fita.rotation.z = lado * 0.3;
      laco.add(fita);
    }
    const no = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), toon(P.lunaUniforme));
    no.position.z = 0.012;
    laco.add(no);
    return laco;
  }

  // --------------------------------------------------------------- gestos

  /** Pula e sacode os pompons no alto. A cena chama e segue a vida. */
  torcer(segundos = 2.4): void {
    this.torcendo = Math.max(this.torcendo, segundos);
    this.timida = 0;
  }

  /** Patas no rosto e orelhas para trás: ela percebeu que falou demais. */
  ficarTimida(segundos = 2.6): void {
    this.timida = Math.max(this.timida, segundos);
    this.torcendo = 0;
  }

  /**
   * O TREINO NO GINÁSIO: a coreografia com os pompons, em loop, até a cena
   * mandar parar (para conversar, por exemplo). Os gestos da conversa
   * (`torcer`, `ficarTimida`) passam por cima dele enquanto duram.
   */
  treinar(sim: boolean): void {
    this.treinoLigado = sim;
  }

  /**
   * O SALTO DA SOL: agacha (a preparação), sobe ~0,7, abre as pernas para os
   * lados lá no alto com os pompons em V — o "toe touch" das cheerleaders —,
   * e aterrissa dobrando. Ela para de treinar enquanto salta, e volta.
   */
  saltar(): void {
    if (this.relogioDoSalto >= 0 || this.relogioDaEstrelinha >= 0) return;
    this.relogioDoSalto = 0;
  }

  /**
   * A ESTRELINHA DA ESTRELLA: braços para cima, e uma volta inteira de lado
   * com braços e pernas abertos em X (a estrela), andando ~1,15 para o lado
   * `sentido` DELA (1 é a direita dela). No fim ela fica onde a volta acabou.
   */
  estrelinha(sentido: 1 | -1 = 1): void {
    if (this.relogioDoSalto >= 0 || this.relogioDaEstrelinha >= 0) return;
    this.relogioDaEstrelinha = 0;
    this.sentidoDaEstrelinha = sentido;
  }

  /**
   * A DANÇA DA FESTA, do começo ao fim, sozinha (`DURA_DA_FESTA`): a cena só
   * põe as três no lugar e chama as três no mesmo quadro — o relógio é de cada
   * uma, mas começa junto e anda com o mesmo `dt`, então elas não se perdem.
   * `sentidoDeFora` é o lado (do corpo dela) que se afasta das irmãs: é para
   * lá que a Estrella dá a primeira estrelinha, e de lá que ela volta.
   */
  dancarAFesta(papel: PapelNaFesta = this.ficha.id, sentidoDeFora: 1 | -1 = 1): void {
    this.papelNaFesta = papel;
    this.sentidoDaFesta = sentidoDeFora;
    this.relogioDaFesta = 0;
    this.maiorGiroDaFesta = 0;
    this.torcendo = 0;
    this.timida = 0;
  }

  get estaNaFesta(): boolean {
    return this.relogioDaFesta >= 0;
  }
  /** em que segundo da dança ela está (-1 fora dela) */
  get tempoNaFesta(): number {
    return this.relogioDaFesta;
  }
  /** a maior volta que o corpo deu na última dança (o teste não pega o pico por amostra) */
  get giroDaFesta(): number {
    return this.maiorGiroDaFesta;
  }
  /** quanto o corpo girou em volta de si (o giro da Luna na dança) */
  get giroNoEixo(): number {
    return this.corpo.rotation.y;
  }

  get estaSaltando(): boolean {
    return this.relogioDoSalto >= 0;
  }
  get estaFazendoEstrelinha(): boolean {
    return this.relogioDaEstrelinha >= 0;
  }
  /** o quanto o corpo está acima do chão agora (o salto), e o giro da estrelinha */
  get medidaDoGesto(): { altura: number; giro: number } {
    return { altura: this.alturaAgora, giro: this.corpo.rotation.z };
  }

  /** o teste pergunta isto */
  get estaTreinando(): boolean {
    return this.treinoLigado;
  }
  get estaTorcendo(): boolean {
    return this.torcendo > 0;
  }
  get estaTimida(): boolean {
    return this.timida > 0;
  }

  /**
   * A COREOGRAFIA DO TREINO: quatro passos de dois segundos, em loop, na
   * contagem de torcida (quatro tempos por segundo). Cada passo devolve só os
   * ALVOS — o `animar` chega neles com a mesma suavização de sempre, então a
   * troca de um passo para o outro não estala.
   *
   *  1. alto-e-baixo: um braço no alto e o outro embaixo, trocando a cada
   *     tempo, com um pulinho em cada troca;
   *  2. V alto, V baixo: os dois no alto, os dois embaixo;
   *  3. o giro: uma volta inteira com os pompons no alto, e a pose final;
   *  4. os chutes: braços em T e uma perna de cada vez chutando à frente.
   *
   * `bracos` é quanto cada braço abre (o `rotation.z` sem o sinal do lado),
   * `pernas` é o `rotation.x` de cada perna (negativo é para a frente).
   */
  private passoDaCoreografia(ct: number): {
    bracos: [number, number]; frente: number; pernas: [number, number];
    pulo: number; giro: number; sacode: number;
  } {
    const passo = Math.floor(ct / 2) % 4;
    const u = (ct % 2) / 2;
    const tempo = Math.floor(ct * 4) % 2;
    const quique = Math.abs(Math.sin(ct * Math.PI * 4));
    const ALTO = 2.7;
    if (passo === 0) {
      return {
        bracos: tempo ? [ALTO, 0.55] : [0.55, ALTO], frente: -0.15, pernas: [0, 0],
        pulo: quique * 0.05, giro: 0, sacode: 0.4,
      };
    }
    if (passo === 1) {
      return {
        bracos: tempo ? [ALTO, ALTO] : [0.95, 0.95], frente: tempo ? -0.1 : -0.35, pernas: [0, 0],
        pulo: tempo ? quique * 0.06 : 0, giro: 0, sacode: 0.35,
      };
    }
    if (passo === 2) {
      // a volta ocupa a primeira metade; a segunda é a pose, de pompom no alto
      const volta = Math.min(1, u * 2);
      const suave = volta * volta * (3 - 2 * volta);
      return {
        bracos: [ALTO, ALTO], frente: -0.1, pernas: [0, 0],
        pulo: u < 0.5 ? 0.03 : 0, giro: suave * Math.PI * 2, sacode: u < 0.5 ? 0.2 : 0.5,
      };
    }
    return {
      bracos: [Math.PI / 2, Math.PI / 2], frente: 0, pernas: tempo ? [-1.05, 0] : [0, -1.05],
      pulo: 0, giro: 0, sacode: 0.25,
    };
  }

  /**
   * A COREOGRAFIA DA FESTA, em seis partes, na contagem de 120 por minuto
   * (um tempo a cada meio segundo). Devolve os mesmos ALVOS do treino, e o
   * `animar` chega neles suavizando — o salto e a estrelinha passam por cima,
   * no relógio deles.
   *
   *  0–2 s   ABERTURA: as três juntas, V alto e V baixo, com um pulinho no alto;
   *  2–4 s   A ONDA: os pompons sobem em sequência, da esquerda da tela para a
   *          direita (Estrella, Luna, Sol), duas vezes;
   *  4–6 s   O DESTAQUE DA SOL: ela dá o salto no meio; as outras sacodem os
   *          pompons alto-e-baixo para ela;
   *  6–8 s   O GIRO DA LUNA, uma volta inteira de pompons no alto; a Sol chuta;
   *          a Estrella dá a estrelinha para fora;
   *  8–9,6 s OS CHUTES: a Luna e a Sol chutam juntas enquanto a Estrella volta
   *          rodando para o lugar;
   *  9,6 s→  O FINAL: agacham, saltam juntas e param na pose — a Luna de V alto,
   *          a Sol e a Estrella espelhadas, um pompom no alto e a outra mão na
   *          cintura —, sacudindo.
   */
  private passoDaFesta(t: number): {
    bracos: [number, number]; frente: number; pernas: [number, number];
    pulo: number; giro: number; sacode: number;
  } {
    const J = CoelhaDaTorcida.janela;
    const ALTO = 2.7;
    const BAIXO = 0.55;
    const papel = this.papelNaFesta;
    const tempo = Math.floor(t * 2) % 2;
    const quique = Math.abs(Math.sin(t * Math.PI * 2));
    const chutes = {
      bracos: [Math.PI / 2, Math.PI / 2] as [number, number], frente: 0,
      pernas: (tempo ? [-1.05, 0] : [0, -1.05]) as [number, number], pulo: 0, giro: 0, sacode: 0.35,
    };
    if (t < 2) {
      return {
        bracos: tempo ? [0.95, 0.95] : [ALTO, ALTO], frente: tempo ? -0.35 : -0.1, pernas: [0, 0],
        pulo: tempo ? 0 : quique * 0.06, giro: 0, sacode: 0.45,
      };
    }
    if (t < 4) {
      const atraso = papel === 'estrella' ? 0 : papel === 'luna' ? 0.25 : 0.5;
      const c = t - 2 - atraso;
      const no = c >= 0 && c % 1 < 0.5;
      return {
        bracos: no ? [ALTO, ALTO] : [BAIXO, BAIXO], frente: no ? -0.1 : -0.3, pernas: [0, 0],
        pulo: no ? Math.sin(((c % 1) / 0.5) * Math.PI) * 0.07 : 0, giro: 0, sacode: no ? 0.6 : 0.2,
      };
    }
    if (t < 6) {
      return {
        bracos: tempo ? [ALTO, BAIXO] : [BAIXO, ALTO], frente: -0.15, pernas: [0, 0],
        pulo: quique * 0.04, giro: 0, sacode: 0.6,
      };
    }
    if (t < 8) {
      if (papel === 'luna') {
        const volta = J(t, 6.0, 7.0);
        return {
          bracos: [ALTO, ALTO], frente: -0.1, pernas: [0, 0],
          pulo: t < 7 ? 0.03 : quique * 0.04, giro: volta * Math.PI * 2, sacode: t < 7 ? 0.3 : 0.6,
        };
      }
      return chutes;
    }
    if (t < 9.6) return chutes;
    // o final: agacha, salta junta, e a pose
    const agacha = J(t, 9.6, 9.85) * (1 - J(t, 9.95, 10.05));
    const noAr = t > 10.0 && t < 10.4 ? (t - 10.0) / 0.4 : -1;
    if (noAr < 0 && t < 10.0) {
      return { bracos: [0.3, 0.3], frente: 0.35 * agacha, pernas: [0, 0], pulo: -0.025 * agacha, giro: 0, sacode: 0.2 };
    }
    if (noAr >= 0) {
      return { bracos: [ALTO, ALTO], frente: -0.1, pernas: [0, 0], pulo: 4 * 0.16 * noAr * (1 - noAr), giro: 0, sacode: 0.8 };
    }
    const pose: [number, number] = papel === 'luna' ? [ALTO, ALTO] : papel === 'sol' ? [0.2, ALTO] : [ALTO, 0.2];
    return { bracos: pose, frente: papel === 'luna' ? -0.1 : 0.15, pernas: [0, 0], pulo: 0, giro: 0, sacode: 0.9 };
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    this.torcendo = Math.max(0, this.torcendo - dt);
    this.timida = Math.max(0, this.timida - dt);
    if (this.torcendo > 0 || this.timida > 0) this.relogioDoGesto += dt;
    else this.relogioDoGesto = 0;

    // toda pose entra e sai por interpolação, nunca num estalo
    const suave = Math.min(1, dt * 6);
    this.misturaTorcida += ((this.torcendo > 0 ? 1 : 0) - this.misturaTorcida) * suave;
    this.misturaTimida += ((this.timida > 0 ? 1 : 0) - this.misturaTimida) * suave;
    this.misturaSentada += ((sentado ? 1 : 0) - this.misturaSentada) * Math.min(1, dt * 5);
    const t = this.relogioDoGesto;
    const torce = this.misturaTorcida;
    const tim = this.misturaTimida;
    const senta = this.misturaSentada;

    // A FESTA: o relógio dela anda, e nos tempos certos ela mesma dispara as
    // acrobacias (o salto da Sol, as duas estrelinhas da Estrella)
    if (this.relogioDaFesta >= 0) {
      const antes = this.relogioDaFesta;
      this.relogioDaFesta += dt;
      const agora = this.relogioDaFesta;
      const passou = (marca: number): boolean => antes < marca && agora >= marca;
      if (this.papelNaFesta === 'sol' && passou(4.1)) this.saltar();
      if (this.papelNaFesta === 'estrella' && passou(6.0)) this.estrelinha(this.sentidoDaFesta);
      if (this.papelNaFesta === 'estrella' && passou(8.0)) this.estrelinha(this.sentidoDaFesta === 1 ? -1 : 1);
      if (agora >= DURA_DA_FESTA) {
        this.relogioDaFesta = -1;
        this.torcer(1.8);
      }
    }
    const naFesta = this.relogioDaFesta >= 0;

    // o salto e a estrelinha andam no relógio deles, e pausam o treino
    if (this.relogioDoSalto >= 0) {
      this.relogioDoSalto += dt;
      if (this.relogioDoSalto >= DURA_SALTO) this.relogioDoSalto = -1;
    }
    if (this.relogioDaEstrelinha >= 0) {
      this.relogioDaEstrelinha += dt;
      if (this.relogioDaEstrelinha >= DURA_ESTRELINHA) this.terminarEstrelinha();
    }
    const acrobacia = this.relogioDoSalto >= 0 || this.relogioDaEstrelinha >= 0;

    // o treino só vale em pé, parada, e sem gesto de conversa por cima
    // a dança da festa é um "treino" com outra coreografia e outro relógio
    const treinando = (this.treinoLigado || naFesta) && !sentado && !andando && !acrobacia;
    if (treinando && !naFesta) this.relogioDoTreino += dt;
    // na festa a pose entra mais depressa: a dança começa no "oito" da contagem
    this.misturaTreino += ((treinando ? 1 : 0) - this.misturaTreino) * Math.min(1, dt * (naFesta ? 10 : 4));
    const tr = this.misturaTreino * Math.max(0, 1 - torce - tim);
    const passoDoTreino = naFesta ? this.passoDaFesta(this.relogioDaFesta) : this.passoDaCoreografia(this.relogioDoTreino);

    /**
     * SENTADA: as pernas giram para a frente (`rotation.x` negativo leva o
     * `-Y` da perna para o `+Z`) e o corpo desce o tamanho da perna menos a
     * espessura dela — o quadril encosta na toalha e os pés ficam de ponta
     * para cima, como quem senta no chão.
     */
    const passo = andando ? Math.sin(fase * 9) * 0.5 : 0;
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      const base = -Math.PI / 2 * senta + passo * lado * (1 - senta);
      const alvo = base + (passoDoTreino.pernas[i] - base) * tr;
      perna.rotation.x += (alvo - perna.rotation.x) * Math.min(1, dt * 10);
      perna.rotation.z = lado * 0.12 * senta;
    }

    // o pulo da torcida só vale em pé; sentada ela torce só com os braços
    const pulo = Math.abs(Math.sin(t * 8.5)) * 0.07 * torce * (1 - senta);
    const respiro = Math.sin(fase * 1.6) * 0.008;
    const pulinhoDoPasso = andando ? Math.abs(Math.sin(fase * 9)) * 0.02 : 0;
    this.corpo.position.y = -0.15 * this.ficha.escala * senta + respiro + pulo + pulinhoDoPasso
      + passoDoTreino.pulo * tr;
    // tímida, ela se encolhe e balança de um lado para o outro; no treino, o
    // giro da coreografia
    this.corpo.rotation.y = Math.sin(t * 3) * 0.12 * tim + passoDoTreino.giro * tr;
    if (naFesta) this.maiorGiroDaFesta = Math.max(this.maiorGiroDaFesta, Math.abs(this.corpo.rotation.y));

    /**
     * OS BRAÇOS. Três destinos misturados pelas poses:
     *  - de pé: abertos (0,45) e um pouco à frente;
     *  - torcendo: bem no alto, em V, revezando (um sobe enquanto o outro
     *    desce um pouco), que é a coreografia de pompom;
     *  - tímida: as patas vêm ao rosto — `rotation.x` bem negativo levanta o
     *    braço para a FRENTE, e o `rotation.z` vira para DENTRO.
     */
    for (const [i, braco] of this.bracos.entries()) {
      const lado = i === 0 ? -1 : 1;
      // 2,7 rad é quase na vertical, em V, sem o pompom encostar na orelha
      const revezando = Math.sin(t * 8.5 + (lado > 0 ? Math.PI : 0)) * 0.2;
      const abertoTorcendo = 2.7 + revezando;
      const zAlvo = lado * (0.45 * (1 - torce - tim) + abertoTorcendo * torce - 0.2 * tim)
        + (andando ? 0 : Math.sin(fase * 1.6 + lado) * 0.03);
      // tímida, as patas param na altura da boca: mais alto, os pompons
      // tapavam a cara inteira, e a graça é os olhos espiando por cima deles
      const xAlvo = -0.3 * (1 - torce - tim) - 0.1 * torce - 1.95 * tim
        + (andando ? Math.sin(fase * 9 + (lado > 0 ? Math.PI : 0)) * 0.35 : 0);
      const zFinal = zAlvo + (lado * passoDoTreino.bracos[i] - zAlvo) * tr;
      const xFinal = xAlvo + (passoDoTreino.frente - xAlvo) * tr;
      braco.rotation.z += (zFinal - braco.rotation.z) * Math.min(1, dt * 12);
      braco.rotation.x += (xFinal - braco.rotation.x) * Math.min(1, dt * 12);
    }
    /*
     * os pompons sacodem rápido na torcida, e quase nada no resto. E na
     * torcida eles ESTICAM 7 cm para longe da pata: o braço dela é curto (a
     * régua chibi), e só com ele o pompom não passava da altura da cabeça.
     */
    for (const [i, pompom] of this.pompons.entries()) {
      pompom.position.y = -0.2 - 0.07 * Math.min(1, torce + tr);
      const relogio = t + this.relogioDoTreino + Math.max(0, this.relogioDaFesta);
      const forca = 0.45 * torce + passoDoTreino.sacode * tr;
      const chacoalha = Math.sin(relogio * 26 + i * 1.7) * forca;
      pompom.rotation.z = chacoalha;
      pompom.rotation.x = chacoalha * 0.6;
      pompom.scale.setScalar(1 + Math.abs(Math.sin(relogio * 26 + i)) * 0.22 * forca);
    }

    /**
     * A CABEÇA: tímida ela olha para baixo (`rotation.x` positivo inclina para
     * a frente); torcendo ela sobe o queixo; no carinho, a mesma subida.
     */
    const cabecaX = 0.28 * tim - 0.12 * torce - carinho * 0.2 + Math.sin(fase * 1.3) * 0.02;
    this.cabeca.rotation.x += (cabecaX - this.cabeca.rotation.x) * Math.min(1, dt * 8);
    this.cabeca.rotation.z = Math.sin(t * 8.5) * 0.1 * torce;

    /**
     * AS ORELHAS: em pé, com um tremelique de vez em quando (a cada ~4 s uma
     * delas mexe); torcendo, bem eretas; tímida, CAÍDAS PARA TRÁS — que em
     * orelha de coelho é `rotation.x` negativo, levando a ponta para o `-Z`.
     */
    for (const [i, orelha] of this.orelhas.entries()) {
      const lado = i === 0 ? -1 : 1;
      const tremelique = Math.max(0, Math.sin(fase * 1.55 + i * 2.4) - 0.93) * 4;
      const xAlvo = -0.85 * tim + 0.05 * torce - tremelique * 0.25;
      orelha.rotation.x += (xAlvo - orelha.rotation.x) * Math.min(1, dt * 9);
      const zAlvo = -lado * this.aberturaDaOrelha + lado * 0.2 * tim + Math.sin(t * 8.5) * 0.12 * torce;
      orelha.rotation.z += (zAlvo - orelha.rotation.z) * Math.min(1, dt * 9);
    }
    // a ponta dobrada chega atrasada: é a defasagem que faz ela parecer mole
    // (0,55 e não mais: dobrada demais, vista de cima, a ponta lia como bolinha)
    if (this.temPontaDobrada) {
      this.pontaDaOrelha.rotation.x = 0.55 + Math.sin(fase * 2.1 - 0.6) * 0.08
        + Math.sin(t * 8.5 - 0.8) * 0.3 * torce;
    }

    // a piscada, a cada ~3,5 s; no carinho os olhos fecham contentes
    const piscando = Math.max(0, Math.sin(fase * 1.8) - 0.985) * 60;
    for (const olho of this.olhos) {
      const aberto = this.ficha.olhoSereno ? ABERTURA_SERENA : 1;
      const alvo = Math.max(0.12, aberto - carinho * 0.8 - Math.min(1, piscando));
      olho.scale.y += (alvo - olho.scale.y) * Math.min(1, dt * 18);
    }
    // tímida, a bochecha fica mais corada (cresce um pouco)
    for (const bochecha of this.bochechas) {
      const alvo = 1 + tim * 0.55;
      bochecha.scale.x = 0.034 * alvo;
      bochecha.scale.y = 0.022 * alvo;
    }

    // --------------------------------------------------- as acrobacias
    this.corpo.position.x = 0;
    this.corpo.rotation.z = 0;
    this.alturaAgora = 0;
    if (this.relogioDoSalto >= 0) this.poseDoSalto(this.relogioDoSalto);
    else if (this.relogioDaEstrelinha >= 0) this.poseDaEstrelinha(this.relogioDaEstrelinha);
  }

  /** 0 a 1 entre `a` e `b`, suave nas duas pontas */
  private static janela(x: number, a: number, b: number): number {
    const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return u * u * (3 - 2 * u);
  }

  /**
   * A POSE DO SALTO, por cima da pose normal (quem chama é o `animar`, no fim).
   * Tempos: 0–0,28 agacha; 0,28–1,18 no ar (uma parábola); o "toe touch" no
   * alto, entre 0,5 e 0,95; 1,18–1,55 aterrissa e endireita.
   */
  private poseDoSalto(t: number): void {
    const J = CoelhaDaTorcida.janela;
    const agacha = J(t, 0, 0.22) * (1 - J(t, 0.22, 0.32)) + J(t, 1.16, 1.24) * (1 - J(t, 1.3, 1.55));
    const noAr = t > 0.28 && t < 1.18 ? (t - 0.28) / 0.9 : -1;
    const h = noAr >= 0 ? 4 * ALTURA_DO_SALTO * noAr * (1 - noAr) : 0;
    const abre = J(t, 0.42, 0.62) * (1 - J(t, 0.88, 1.05));
    this.alturaAgora = h;
    this.corpo.position.y += h - agacha * 0.07;
    // no ar, pernas para os lados (a esquerda nasce em -X: abrir é `lado * ângulo`)
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      perna.rotation.z = lado * (1.3 * abre);
      perna.rotation.x = -0.35 * abre + 0.3 * agacha;
    }
    // agachada, braços para trás e para baixo; subindo, V alto; no toe touch, T aberto
    const sobe = J(t, 0.22, 0.4) * (1 - J(t, 1.1, 1.4));
    for (const [i, braco] of this.bracos.entries()) {
      const lado = i === 0 ? -1 : 1;
      braco.rotation.z = lado * (0.3 * agacha + 2.55 * sobe * (1 - abre) + 1.75 * abre);
      braco.rotation.x = 0.5 * agacha - 0.1 * sobe;
    }
    for (const [i, pompom] of this.pompons.entries()) {
      const chacoalha = Math.sin(t * 30 + i * 1.7) * 0.5 * sobe;
      pompom.rotation.z = chacoalha;
      pompom.scale.setScalar(1 + Math.abs(chacoalha) * 0.3);
    }
    // o queixo sobe no alto, e as orelhas ficam para trás com o vento da subida
    this.cabeca.rotation.x = -0.22 * sobe;
    for (const orelha of this.orelhas) orelha.rotation.x = -0.45 * (noAr >= 0 ? Math.sin(noAr * Math.PI) : 0);
  }

  /**
   * A POSE DA ESTRELINHA. Tempos: 0–0,35 prepara (braços no alto, o corpo
   * inclina para o lado da volta); 0,35–1,3 a volta, com o corpo girando no
   * plano da frente dela em volta do QUADRIL, andando para o lado; 1,3–1,7 a
   * pose final, de braços em V.
   *
   * O giro é em volta de um ponto na altura do quadril (`CENTRO_DA_VOLTA`), e
   * não do pé: girando em volta do pé, ela entraria no chão de cabeça. A
   * conta: o centro fica parado (só anda para o lado), então a posição do
   * corpo é o centro menos o centro girado.
   */
  private poseDaEstrelinha(t: number): void {
    const J = CoelhaDaTorcida.janela;
    const s = this.sentidoDaEstrelinha;
    const prepara = J(t, 0, 0.3);
    const volta = J(t, 0.35, 1.3);
    const aberta = J(t, 0.3, 0.45) * (1 - J(t, 1.25, 1.45));
    const pose = J(t, 1.3, 1.45) * (1 - J(t, 1.55, 1.7));
    const h = CENTRO_DA_VOLTA * this.ficha.escala;
    // inclina uns 15° antes de ir; a volta é negativa para a direita dela
    const giro = -s * (prepara * 0.26 * (1 - volta) + volta * Math.PI * 2);
    const anda = volta * PASSO_DA_ESTRELINHA * s;
    // um tico de voo no meio da volta, para mão e pé não raspar o chão
    const voo = Math.sin(volta * Math.PI) * 0.05;
    this.corpo.rotation.z = giro;
    this.corpo.rotation.y = 0;
    this.corpo.position.x = anda + h * Math.sin(giro);
    this.corpo.position.y += h - h * Math.cos(giro) + voo;
    this.alturaAgora = voo;
    // a estrela: braços para o alto e abertos, pernas abertas — um X
    for (const [i, braco] of this.bracos.entries()) {
      const lado = i === 0 ? -1 : 1;
      braco.rotation.z = lado * (2.45 * Math.max(prepara, pose) * (1 - aberta) + 2.35 * aberta);
      braco.rotation.x = 0;
    }
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      perna.rotation.z = lado * 0.85 * aberta;
      perna.rotation.x = 0;
    }
    for (const orelha of this.orelhas) orelha.rotation.x = -0.3 * aberta;
  }

  /** a volta acabou: o passo para o lado vira posição de verdade, sem pulo */
  private terminarEstrelinha(): void {
    this.relogioDaEstrelinha = -1;
    const passo = new THREE.Vector3(PASSO_DA_ESTRELINHA * this.sentidoDaEstrelinha, 0, 0)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.group.rotation.y);
    this.group.position.add(passo);
    this.corpo.position.x = 0;
    this.corpo.rotation.z = 0;
  }
}

/** A LUNA, a primeira irmã: é ela quem convida a dupla e mostra a escola. */
export class Luna extends CoelhaDaTorcida {
  constructor(area: AreaDoBicho) {
    super(area, FICHA_DA_LUNA);
  }
}

/** A SOL, a animada: fala alto, está sempre feliz, e o gesto dela é o salto. */
export class Sol extends CoelhaDaTorcida {
  constructor(area: AreaDoBicho) {
    super(area, FICHA_DA_SOL);
  }
}

/** A ESTRELLA, a calma, sempre de olho nas duas: o gesto dela é a estrelinha. */
export class Estrella extends CoelhaDaTorcida {
  constructor(area: AreaDoBicho) {
    super(area, FICHA_DA_ESTRELLA);
  }
}
