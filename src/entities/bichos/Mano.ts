import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O MANO, o pinguim que cuida do quiosque de sorvete do Villa Lobos. O nome é
 * do Renan.
 *
 * Ele é o primeiro bicho do PARQUE — os outros quatro moram no clube — e é um
 * bicho de POSTO: fica na frente do balcão, atendendo. A área que a cena passa
 * é menor que o passo mínimo do cérebro, e é só isso que o segura ali; nenhuma
 * linha de cérebro mudou.
 *
 * O QUE FAZ UM PINGUIM SER LIDO COMO PINGUIM, e são três coisas nesta ordem:
 *
 * 1. A SILHUETA DE PERA EM PÉ. Pinguim é vertical: um ovo de cabeça para baixo,
 *    mais largo embaixo, com a cabeça encaixada quase sem pescoço. Bicho de
 *    quatro patas é comprido no `z`; este é comprido no `y`, e essa é a
 *    diferença que o olho pega antes de qualquer detalhe.
 * 2. O PLASTRÃO CLARO NA FRENTE, subindo até o queixo e desenhando um V. Sem
 *    ele o bicho é uma bolota escura; com ele já é pinguim mesmo sem bico.
 * 3. AS NADADEIRAS RENTES AO CORPO, e não braços. Elas são achatadas no `x`,
 *    penduradas do ombro e quase coladas — pinguim de braço aberto vira boneco
 *    de neve.
 *
 * O CASACO NÃO É PRETO. Preto chapado come o degradê do toon e o bicho vira um
 * buraco no cenário, do mesmo jeito que o maid e o moletom pretos já pagaram —
 * é um azul-ardósia bem escuro, que ainda mostra volume.
 *
 * O CHAPÉU DE CASQUINHA fica no `chapeu`, um grupo próprio pendurado na cabeça:
 * cone de waffle de ponta para cima, uma bola de sorvete pousada na ponta e a
 * cereja. De ponta para BAIXO ele não pararia em pé em cabeça nenhuma, e de
 * ponta para cima ele ainda lê como casquinha por causa do quadriculado — que
 * é o detalhe que separa "casquinha" de "chapéu de festa".
 *
 * A ROUPINHA DE SORVETEIRO é o mesmo rosa do quiosque (`0xf6a6c0`), e não um
 * rosa parecido: é a regra que o avental teal do Noel já usa — o uniforme diz
 * de que casa o bicho é. E ela foi desenhada para ser vista DE CIMA (a câmera
 * olha em 34°): o peitilho sobe até o peito e as alças passam por cima do
 * ombro, que é a parte que mais aparece nesse ângulo.
 */
export class Mano extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly chapeu = new THREE.Group();
  private readonly asas: THREE.Group[] = [];
  private readonly pes: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];

  /**
   * Quanto ainda falta da dança, em segundos.
   *
   * A dança é um ESTADO, e não uma sequência de `await`: o `animar` de cada
   * quadro olha para este contador e desenha a pose. É o que deixa a cutscene
   * do sorvete só dizer "dança por 2,4 s" e continuar a vida dela, sem
   * segurar o bicho por dentro de uma promessa.
   */
  private dancando = 0;
  /** relógio próprio da dança, para o passo não depender de quando ela começou */
  private fasa = 0;

  constructor(area: AreaDoBicho) {
    super(area, {
      /**
       * Ele é de POSTO, mas é um posto ANIMADO: a velocidade é alta e o
       * descanso é curto, porque nas poucas vezes em que a área deixa ele dar
       * um passinho, ele tem que dar depressa. Pinguim anda em passo miúdo.
       */
      velocidade: 0.5,
      descansoMin: 0.6,
      descansoMax: 2.2,
      // pinguim não senta: sentado, um bicho vertical vira uma bola sem
      // silhueta, e o Mano perde justamente o que faz ele ser pinguim
      chanceDeSentar: 0,
      somCadaMin: 10,
      somCadaMax: 22,
      duracaoDoCarinho: 3.2,
      semente: 20260907,
    });
    this.montar();
    this.prontoParaAparecer('mano');
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const casaco = toon(P.pinguimCasaco);
    const barriga = toon(P.pinguimBarriga);
    const bico = toon(P.pinguimBico);
    const bicoEscuro = toon(P.pinguimBicoEscuro);
    const uniforme = toon(P.aventalDoMano);
    const debrum = toon(P.aventalDoManoFaixa);

    /**
     * O TRONCO É UM OVO EM PÉ, mais gordo embaixo. Duas esferas escaladas em
     * vez de uma: a de baixo é a barriga e a de cima é o peito, e a junção das
     * duas dá a cintura de pinguim sem precisar de geometria de revolução.
     */
    const barrigaBaixa = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), casaco);
    barrigaBaixa.scale.set(0.2, 0.19, 0.175);
    barrigaBaixa.position.y = 0.235;
    this.corpo.add(barrigaBaixa);

    const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), casaco);
    peito.scale.set(0.175, 0.185, 0.155);
    peito.position.y = 0.39;
    this.corpo.add(peito);

    /**
     * O PLASTRÃO: a frente clara, em duas esferas que acompanham o tronco e
     * ficam 2 cm à frente dele. Ele sobe ATÉ O QUEIXO — parar na metade do
     * peito deixa uma gola escura que ninguém reconhece.
     */
    for (const [y, sx, sy, sz] of [
      [0.235, 0.15, 0.155, 0.14],
      [0.4, 0.125, 0.155, 0.12],
    ] as const) {
      const claro = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), barriga);
      claro.scale.set(sx, sy, sz);
      claro.position.set(0, y, 0.045);
      this.corpo.add(claro);
    }

    // o rabinho: uma cunha baixa atrás, quase no chão. Ele é o que impede o
    // pinguim de ler como um pinheiro de brinquedo visto de trás
    const rabo = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.13, 6), casaco);
    rabo.rotation.x = Math.PI * 0.62;
    rabo.position.set(0, 0.115, -0.155);
    this.corpo.add(rabo);

    // -------------------------------------------------------------- os pés
    /**
     * PÉ DE PATO, e não pata: uma palma achatada com três dedos que abrem. O
     * grupo tem pivô no tornozelo, e é ele que gira no passo — e no rebolado
     * da dança.
     *
     * Eles ficam BEM À FRENTE do centro (`z = 0,05`), porque pinguim é
     * desequilibrado para trás: pé embaixo do meio do corpo faz ele parecer
     * que vai cair de bunda.
     */
    for (const lado of [-1, 1] as const) {
      const pe = new THREE.Group();
      pe.position.set(lado * 0.085, 0.055, 0.05);
      const palma = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), bico);
      palma.scale.set(0.055, 0.022, 0.085);
      palma.position.z = 0.02;
      pe.add(palma);
      // os três dedos, e o sinal do `lado` é o que abre os de fora PARA FORA:
      // sem ele os dois pés apontam para o mesmo lado
      for (const giro of [-0.5, 0, 0.5] as const) {
        const dedo = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.018, 0.075), bico);
        dedo.position.set(lado * giro * 0.052, 0, 0.075);
        dedo.rotation.y = -lado * giro;
        pe.add(dedo);
      }
      this.corpo.add(pe);
      this.pes.push(pe);
    }

    // -------------------------------------------------------- as nadadeiras
    /**
     * NADADEIRA, não braço: uma lâmina achatada no `x`, pendurada do ombro e
     * quase colada no corpo. O pivô fica no ombro para a asa BATER na dança e
     * abrir no carinho, girando em `z`.
     *
     * A ponta é um degrau mais clara: sem ela a nadadeira some contra o casaco
     * escuro na vista de cima, que é a vista do jogo.
     */
    for (const lado of [-1, 1] as const) {
      const asa = new THREE.Group();
      asa.position.set(lado * 0.175, 0.44, 0.01);
      const lamina = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), casaco);
      lamina.scale.set(0.032, 0.145, 0.07);
      lamina.position.y = -0.115;
      asa.add(lamina);
      const ponta = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), toon(P.pinguimCasacoLuz));
      ponta.scale.set(0.028, 0.05, 0.055);
      ponta.position.y = -0.225;
      asa.add(ponta);
      // a asa nasce levemente aberta, e o SINAL importa: `rotation.z` positivo
      // na asa da esquerda (que nasce em `x` negativo) empurra ela para DENTRO
      asa.rotation.z = lado * 0.14;
      this.corpo.add(asa);
      this.asas.push(asa);
    }

    // --------------------------------------------------------- o uniforme
    /**
     * O PEITILHO com as duas alças, no rosa do quiosque. Ele é uma casca fina
     * na frente do plastrão — 3 mm à frente do claro, para não brigar por
     * profundidade com ele.
     */
    /**
     * A CONTA QUE DECIDE ISTO É A PROFUNDIDADE, e a primeira versão errou: o
     * plastrão claro tem a face da frente em `z = 0,185` (centro 0,045 + meio
     * eixo 0,14), e o peitilho nasceu com a dele em `0,177` — ou seja, o avental
     * inteiro ficou DENTRO da barriga e o Mano apareceu sem uniforme na foto.
     * É a mesma pegadinha da gravatinha do Walter, que nasceu dentro do
     * colarinho. Agora ele vai a `0,22`, na frente do claro com folga.
     */
    const peitilho = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), uniforme);
    peitilho.scale.set(0.118, 0.098, 0.085);
    peitilho.position.set(0, 0.225, 0.135);
    this.corpo.add(peitilho);
    const barraDoPeitilho = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.024, 0.024), debrum);
    barraDoPeitilho.position.set(0, 0.305, 0.178);
    this.corpo.add(barraDoPeitilho);
    /**
     * AS ALÇAS PASSAM POR CIMA DO OMBRO, e não só pelo peito: a câmera olha em
     * 34° e o ombro é o que ela mais vê de um bicho baixo. Alça que só cruza a
     * frente some na vista de jogo.
     */
    for (const lado of [-1, 1] as const) {
      const alca = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.19, 0.026), uniforme);
      alca.position.set(lado * 0.082, 0.41, 0.135);
      alca.rotation.x = -0.42;
      alca.rotation.z = lado * 0.2;
      this.corpo.add(alca);
    }
    // o crachá: um quadradinho claro no peito. É o detalhe que transforma
    // "pinguim de avental" em "funcionário"
    const cracha = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.04, 0.016), debrum);
    cracha.position.set(0.07, 0.315, 0.205);
    this.corpo.add(cracha);

    // ------------------------------------------------------------- a cabeça
    /**
     * QUASE SEM PESCOÇO: a cabeça encaixa direto no peito. Pinguim com pescoço
     * vira pato, e o pescoço é justamente o que ele não tem.
     */
    this.cabeca.name = 'cabeca-do-mano';
    this.cabeca.position.set(0, 0.62, 0.005);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), casaco);
    cranio.scale.set(0.145, 0.15, 0.14);
    this.cabeca.add(cranio);

    // a máscara clara do rosto, em V até em cima dos olhos
    const rosto = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), barriga);
    rosto.scale.set(0.105, 0.1, 0.09);
    rosto.position.set(0, -0.012, 0.075);
    this.cabeca.add(rosto);

    /**
     * O BICO é curto e GORDO, e aponta para `+Z`. Cone comprido vira tucano; o
     * de pinguim é quase um triângulo. A linha escura embaixo é a fenda do
     * bico, e é ela que faz o bico ter boca.
     */
    const biquinho = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.085, 8), bico);
    biquinho.rotation.x = Math.PI / 2;
    biquinho.position.set(0, -0.015, 0.155);
    this.cabeca.add(biquinho);
    const fenda = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.008, 0.07), bicoEscuro);
    fenda.position.set(0, -0.026, 0.155);
    this.cabeca.add(fenda);

    /**
     * OS OLHOS: bola branca com pupila grande e um brilho. A pupila ocupa mais
     * da metade — é a régua chibi do resto do jogo, e é o que faz o bicho ser
     * lido como fofo em vez de assustado.
     */
    for (const lado of [-1, 1] as const) {
      const branco = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), toon(P.pinguimBarriga));
      branco.position.set(lado * 0.058, 0.028, 0.108);
      this.cabeca.add(branco);
      this.olhos.push(branco);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.027, 8, 8), toon(P.pinguimCasaco));
      pupila.position.set(lado * 0.061, 0.026, 0.138);
      this.cabeca.add(pupila);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.011, 6, 6), toon(P.pinguimBarriga));
      brilho.position.set(lado * 0.07, 0.04, 0.155);
      this.cabeca.add(brilho);
      // a bochecha rosada, que é metade da fofura e custa uma esfera achatada
      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), toon(P.pinguimBochecha));
      bochecha.scale.set(0.038, 0.026, 0.02);
      bochecha.position.set(lado * 0.088, -0.032, 0.098);
      this.cabeca.add(bochecha);
    }

    this.montarOChapeu();
    this.cabeca.add(this.chapeu);
    this.corpo.add(this.cabeca);

    /**
     * ELE É PEQUENO, e cresce no fim em vez de nascer grande: com o corpo
     * montado em números de bicho de chão, um pinguim de 0,75 sumiria ao lado
     * de um quiosque de 1,7. O 1,25 põe a cabeça dele na altura do balcão.
     */
    this.corpo.scale.setScalar(1.25);
    this.group.add(this.corpo);
  }

  /**
   * O CHAPÉU DE CASQUINHA.
   *
   * O quadriculado é o que faz ler como waffle: três anéis (toros de raio igual
   * ao do cone naquela altura) e seis ripas verticais. Sem ele, o cone bege é
   * um chapéu de aniversário.
   */
  private montarOChapeu(): void {
    const waffle = toon(P.casquinhaWaffle);
    const grelha = toon(P.casquinhaGrelha);
    const ALTURA = 0.28;
    const RAIO = 0.13;

    this.chapeu.name = 'chapeu-do-mano';
    this.chapeu.position.set(0, 0.13, -0.01);

    const cone = new THREE.Mesh(new THREE.ConeGeometry(RAIO, ALTURA, 14), waffle);
    cone.position.y = ALTURA / 2;
    this.chapeu.add(cone);

    // os anéis: o raio de cada um sai da conta do cone naquela altura
    // (`R · (1 − y/H)`), mais um fio para o anel ficar por FORA da superfície
    for (const k of [0.22, 0.48, 0.72] as const) {
      const r = RAIO * (1 - k) + 0.006;
      const anel = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 5, 14), grelha);
      anel.rotation.x = Math.PI / 2;
      anel.position.y = ALTURA * k;
      this.chapeu.add(anel);
    }
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const ripa = new THREE.Mesh(new THREE.BoxGeometry(0.012, ALTURA * 0.8, 0.012), grelha);
      // ela acompanha a inclinação da parede do cone, senão fica solta no ar na
      // metade de cima
      ripa.position.set(Math.cos(a) * RAIO * 0.62, ALTURA * 0.4, Math.sin(a) * RAIO * 0.62);
      ripa.rotation.z = -Math.cos(a) * 0.42;
      ripa.rotation.x = Math.sin(a) * 0.42;
      this.chapeu.add(ripa);
    }

    // a bola de sorvete pousada na ponta, no mesmo rosa do sorvete de morango
    // do jogo, com uma casquinha de calda mais clara em cima
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.088, 12, 10), toon(P.morango));
    bola.scale.y = 0.92;
    bola.position.y = ALTURA + 0.045;
    this.chapeu.add(bola);
    const cereja = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), toon(P.cerejaDoMano));
    cereja.position.y = ALTURA + 0.145;
    this.chapeu.add(cereja);
    const cabinho = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.05, 5), toon(P.leafDark));
    cabinho.position.y = ALTURA + 0.185;
    cabinho.rotation.z = 0.4;
    this.chapeu.add(cabinho);
  }

  // ------------------------------------------------------------------ dança

  /**
   * A DANÇA DO MANO. Ele ama sorvete e ama dançar, e faz as duas coisas juntas.
   *
   * A cena chama `dancar(2.4)` e segue a vida dela — quem desenha é o `animar`
   * do quadro seguinte, olhando para o contador. Nada aqui é promessa nem
   * `setTimeout`: o relógio do bicho é o `dt` que ele já recebe, e um
   * `setTimeout` continuaria correndo com o jogo pausado.
   */
  dancar(segundos = 2.4): void {
    this.dancando = Math.max(this.dancando, segundos);
  }

  /** ele está dançando agora (o teste pergunta isto) */
  get estaDancando(): boolean {
    return this.dancando > 0;
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, carinho, fase }: PoseDoBicho): void {
    if (this.dancando > 0) {
      this.dancando = Math.max(0, this.dancando - dt);
      this.fasa += dt;
    }
    const dancando = this.dancando > 0;
    // a dança entra e sai por interpolação: ligar de um quadro para o outro
    // faz o bicho dar um estalo, que é o que denuncia animação de código
    const mistura = dancando ? Math.min(1, this.fasa * 4) : 0;

    /**
     * O REBOLADO. O corpo inteiro tomba de um lado para o outro em `z` — é o
     * eixo que o Renan pediu, e é o certo: em `x` o pinguim se curvaria para a
     * frente, e em `y` ele giraria como um pião.
     *
     * O `y` sobe junto, com o DOBRO da frequência: quem se inclina para os dois
     * lados passa pelo alto duas vezes por ciclo, e sem isso o pulinho não
     * bate com o tombo.
     */
    const balanco = Math.sin(this.fasa * 7.5) * 0.34 * mistura;
    this.corpo.rotation.z = balanco;
    this.corpo.rotation.y = Math.sin(this.fasa * 7.5) * 0.22 * mistura;
    const pulinho = Math.abs(Math.sin(this.fasa * 7.5)) * 0.05 * mistura;

    // a respiração de sempre por baixo de tudo: mesmo dançando ele respira
    const respiro = Math.sin(fase * 1.7) * 0.012;
    const passo = andando ? Math.abs(Math.sin(fase * 7)) * 0.022 : 0;
    this.corpo.position.y = respiro + passo + pulinho;

    /**
     * AS ASAS BATEM RÁPIDO na dança (12 rad/s contra os 7,5 do corpo), e para
     * CIMA E PARA BAIXO — o que num `rotation.z` de ombro quer dizer abrir e
     * fechar. O sinal do lado é o de sempre: a asa da esquerda nasce em `x`
     * negativo, então o mesmo ângulo positivo fecha uma e abre a outra.
     */
    const bater = dancando ? (0.55 + Math.sin(this.fasa * 12) * 0.55) * mistura : 0;
    const abertoNoCarinho = carinho * 0.5;
    for (const [i, asa] of this.asas.entries()) {
      const lado = i === 0 ? -1 : 1;
      const balancoDoPasso = andando ? Math.sin(fase * 7) * 0.12 : 0;
      const alvo = lado * (0.14 + bater + abertoNoCarinho) + balancoDoPasso;
      asa.rotation.z += (alvo - asa.rotation.z) * Math.min(1, dt * 12);
    }

    // os pés: passinho miúdo andando, e na dança eles marcam o compasso
    for (const [i, pe] of this.pes.entries()) {
      const lado = i === 0 ? -1 : 1;
      const alvo = dancando
        ? Math.max(0, Math.sin(this.fasa * 7.5 + (lado > 0 ? Math.PI : 0))) * 0.5 * mistura
        : andando ? Math.sin(fase * 7 + (lado > 0 ? Math.PI : 0)) * 0.45 : 0;
      pe.rotation.x += (alvo - pe.rotation.x) * Math.min(1, dt * 12);
    }

    /**
     * A CABEÇA. No carinho ela sobe e os olhos fecham; dançando ela vai ao
     * CONTRÁRIO do corpo, que é o que faz o rebolado parecer coreografia em vez
     * de tremor — a cabeça fica em pé enquanto o corpo tomba.
     */
    this.cabeca.rotation.z = -balanco * 0.55;
    this.cabeca.rotation.x = -carinho * 0.24 + Math.sin(fase * 1.9) * 0.02;
    for (const olho of this.olhos) {
      const alvo = 1 - carinho * 0.75;
      olho.scale.y += (alvo - olho.scale.y) * Math.min(1, dt * 8);
    }

    /**
     * O CHAPÉU BALANÇA ATRASADO. É um chapéu solto na cabeça de um bicho que
     * está rebolando: ele chega depois. A defasagem de meio radiano é o que faz
     * a casquinha parecer pousada em cima em vez de parafusada.
     */
    this.chapeu.rotation.z = Math.sin(this.fasa * 7.5 - 0.5) * 0.2 * mistura;
    this.chapeu.rotation.x = Math.sin(this.fasa * 6 - 0.5) * 0.09 * mistura;
  }
}
