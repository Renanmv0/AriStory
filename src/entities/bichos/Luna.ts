import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { letreiro } from '../../world/props';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
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
 *  - o LAÇO amarelo na base da orelha esquerda, que é o laço de torcida.
 *
 * E ELA TEM TRÊS JEITOS, que a cena aciona durante a conversa: TORCER (pula e
 * sacode os pompons no alto), FICAR TÍMIDA (patas no rosto, orelhas caídas
 * para trás, bochecha mais corada) e SENTADA (o piquenique). O pelo é
 * cinza-pérola: o Gatito e o Pelusa já são creme.
 */
export class Luna extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly pernas: THREE.Group[] = [];
  /** os dois braços, com pivô no ombro; o pompom é filho da pata */
  private readonly bracos: THREE.Group[] = [];
  /** os pompons, para o sacode e para o teste saber onde eles estão */
  readonly pompons: THREE.Group[] = [];
  /** as orelhas: [esquerda, direita] */
  private readonly orelhas: THREE.Group[] = [];
  /** a ponta dobrada da orelha direita, que balança atrasada */
  private readonly pontaDaOrelha = new THREE.Group();
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

  constructor(area: AreaDoBicho) {
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
      semente: 20260928,
    });
    this.montar();
    this.prontoParaAparecer('luna');
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const pelo = toon(P.lunaPelo);
    const peloClaro = toon(P.lunaPeloClaro);
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
    this.corpo.scale.setScalar(1.15);
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
    const pelo = toon(P.lunaPelo);
    const peloClaro = toon(P.lunaPeloClaro);
    const dentro = toon(P.lunaOrelhaDentro);

    this.cabeca.name = 'cabeca-da-luna';
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
    const boca = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.006, 0.008), toon(P.lunaOlho));
    boca.position.set(0, -0.05, 0.158);
    this.cabeca.add(boca);

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
      this.cabeca.add(olho);
      this.olhos.push(olho);

      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), toon(P.lunaBochecha));
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
    for (const lado of [-1, 1] as const) {
      const orelha = new THREE.Group();
      orelha.position.set(lado * 0.062, 0.115, -0.01);
      orelha.rotation.z = lado * -0.12;
      const inteira = lado < 0;
      const comprimento = inteira ? 0.19 : 0.1;
      const fora = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pelo);
      fora.scale.set(0.045, comprimento, 0.03);
      fora.position.y = comprimento * 0.95;
      orelha.add(fora);
      const miolo = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), dentro);
      miolo.scale.set(0.027, comprimento * 0.78, 0.012);
      miolo.position.set(0, comprimento * 0.95, 0.02);
      orelha.add(miolo);
      if (!inteira) {
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
      } else {
        orelha.add(this.fazerLaco());
      }
      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }
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

  /** o teste pergunta isto */
  get estaTorcendo(): boolean {
    return this.torcendo > 0;
  }
  get estaTimida(): boolean {
    return this.timida > 0;
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

    /**
     * SENTADA: as pernas giram para a frente (`rotation.x` negativo leva o
     * `-Y` da perna para o `+Z`) e o corpo desce o tamanho da perna menos a
     * espessura dela — o quadril encosta na toalha e os pés ficam de ponta
     * para cima, como quem senta no chão.
     */
    const passo = andando ? Math.sin(fase * 9) * 0.5 : 0;
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      const alvo = -Math.PI / 2 * senta + passo * lado * (1 - senta);
      perna.rotation.x += (alvo - perna.rotation.x) * Math.min(1, dt * 10);
      perna.rotation.z = lado * 0.12 * senta;
    }

    // o pulo da torcida só vale em pé; sentada ela torce só com os braços
    const pulo = Math.abs(Math.sin(t * 8.5)) * 0.07 * torce * (1 - senta);
    const respiro = Math.sin(fase * 1.6) * 0.008;
    const pulinhoDoPasso = andando ? Math.abs(Math.sin(fase * 9)) * 0.02 : 0;
    this.corpo.position.y = -0.15 * 1.15 * senta + respiro + pulo + pulinhoDoPasso;
    // tímida, ela se encolhe e balança de um lado para o outro
    this.corpo.rotation.y = Math.sin(t * 3) * 0.12 * tim;

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
      braco.rotation.z += (zAlvo - braco.rotation.z) * Math.min(1, dt * 12);
      braco.rotation.x += (xAlvo - braco.rotation.x) * Math.min(1, dt * 12);
    }
    /*
     * os pompons sacodem rápido na torcida, e quase nada no resto. E na
     * torcida eles ESTICAM 7 cm para longe da pata: o braço dela é curto (a
     * régua chibi), e só com ele o pompom não passava da altura da cabeça.
     */
    for (const [i, pompom] of this.pompons.entries()) {
      pompom.position.y = -0.2 - 0.07 * torce;
      const chacoalha = Math.sin(t * 26 + i * 1.7) * 0.45 * torce;
      pompom.rotation.z = chacoalha;
      pompom.rotation.x = chacoalha * 0.6;
      pompom.scale.setScalar(1 + Math.abs(Math.sin(t * 26 + i)) * 0.1 * torce);
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
      const zAlvo = lado * (-0.12 + 0.2 * tim) + Math.sin(t * 8.5) * 0.12 * torce;
      orelha.rotation.z += (zAlvo - orelha.rotation.z) * Math.min(1, dt * 9);
    }
    // a ponta dobrada chega atrasada: é a defasagem que faz ela parecer mole
    // (0,55 e não mais: dobrada demais, vista de cima, a ponta lia como bolinha)
    this.pontaDaOrelha.rotation.x = 0.55 + Math.sin(fase * 2.1 - 0.6) * 0.08
      + Math.sin(t * 8.5 - 0.8) * 0.3 * torce;

    // a piscada, a cada ~3,5 s; no carinho os olhos fecham contentes
    const piscando = Math.max(0, Math.sin(fase * 1.8) - 0.985) * 60;
    for (const olho of this.olhos) {
      const alvo = Math.max(0.12, 1 - carinho * 0.8 - Math.min(1, piscando));
      olho.scale.y += (alvo - olho.scale.y) * Math.min(1, dt * 18);
    }
    // tímida, a bochecha fica mais corada (cresce um pouco)
    for (const bochecha of this.bochechas) {
      const alvo = 1 + tim * 0.55;
      bochecha.scale.x = 0.034 * alvo;
      bochecha.scale.y = 0.022 * alvo;
    }
  }
}
