import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { raquete } from '../../world/props';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O JEAN-LUC, o pato francês do lago do Villa Lobos — e o maior entusiasta de
 * tênis de mesa que este parque já teve.
 *
 * Ele estava debaixo d'água o tempo todo. Quem ganha cinco partidas na arena
 * acorda ele: o pato emerge, atravessa a margem e vem se apresentar.
 *
 * O QUE FAZ UM PATO SER LIDO COMO PATO, em ordem de importância:
 *
 * 1. **O BICO CHATO E LARGO.** É o detalhe que decide tudo. Cone (o do Mano, o
 *    do `duck()` do lago) lê como passarinho genérico; pato tem uma espátula —
 *    uma esfera ACHATADA no `y` e larga no `x`, com a mandíbula de baixo um
 *    degrau menor aparecendo por baixo. Sem isso ele é uma galinha de boina.
 * 2. **O PESCOÇO.** O Mano não tem, e o comentário dele diz por quê: "pinguim
 *    com pescoço vira pato". Este aqui É o pato, então o pescoço existe, é
 *    curto e inclina PARA A FRENTE — é o que dá a curva do peito de pato.
 * 3. **O RABINHO PARA CIMA.** Uma cunha levantada atrás. Pato de rabo caído
 *    parece pombo molhado.
 * 4. **O PÉ DE PATA, grande demais de propósito.** Palma larga, três dedos
 *    abrindo, laranja. É o que denuncia o bicho antes mesmo da cabeça na vista
 *    de cima do jogo.
 *
 * A FRANÇA ENTRA POR DUAS PEÇAS, e não por sotaque escrito no modelo: a BOINA
 * azul-marinho tombada para um lado (com o rabinho de pano no alto, que é o
 * que separa boina de disco) e a FAIXA TRICOLOR vertical no peito da camisa.
 * Duas peças bastam — três já viram fantasia.
 *
 * A CAMISA É DE JOGADOR, e por isso ela é uma casca por cima do peito e não
 * uma pintura: gola vermelha em volta do pescoço, corpo creme e a bandeirinha
 * no peito. Ela é MAIOR que o peito nos três eixos — a lição que o avental do
 * Mano pagou, quando o peitilho nasceu dentro da barriga e o bicho apareceu
 * pelado na foto.
 *
 * E ELE ANDA COM A RAQUETE NA ASA. É a peça do kit (`raquete()`), pendurada na
 * asa direita: um pato de boina é um pato de boina; um pato de boina segurando
 * uma raquete já conta a história inteira sem abrir a boca.
 */
export class JeanLuc extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly pescoco = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly boina = new THREE.Group();
  private readonly asas: THREE.Group[] = [];
  private readonly pes: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly rabo = new THREE.Group();

  /**
   * Quanto ainda falta da comemoração, em segundos.
   *
   * É um ESTADO, e não uma sequência de `await` — o mesmo desenho da dança do
   * Mano. A cutscene diz "comemora por 3 s" e segue a vida dela; quem desenha é
   * o `animar` do quadro seguinte, olhando para este contador. `setTimeout`
   * aqui continuaria correndo com o jogo pausado.
   */
  private comemorando = 0;
  /** relógio próprio da comemoração, para o passo não depender de quando começou */
  private fasa = 0;

  constructor(area: AreaDoBicho) {
    super(area, {
      /**
       * PASSO MIÚDO E RÁPIDO, descanso curto: ele é elétrico. Um entusiasta
       * que fica três segundos parado entre um passo e outro vira decoração —
       * e é o `descanso`, não a velocidade, que decide isso (ver `Bicho.ts`).
       */
      velocidade: 0.52,
      descansoMin: 0.5,
      descansoMax: 1.8,
      // pato sentado vira uma bola sem silhueta, e ele perde o pescoço e o
      // rabinho, que são dois dos quatro traços que fazem ele ser pato
      chanceDeSentar: 0,
      somCadaMin: 8,
      somCadaMax: 17,
      duracaoDoCarinho: 3.4,
      semente: 20260916,
    });
    this.montar();
    this.prontoParaAparecer('jean-luc');
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const pena = toon(P.patoPena);
    const sombra = toon(P.patoPenaSombra);
    const bico = toon(P.patoBico);
    const bicoEscuro = toon(P.patoBicoEscuro);
    const camisa = toon(P.camisaDoJeanLuc);
    const azul = toon(P.azulFranca);
    const vermelho = toon(P.vermelhoFranca);

    /**
     * O TRONCO são duas esferas: a barriga, mais larga e mais COMPRIDA no `z`
     * (pato é um barco), e o peito por cima. A junção das duas dá a curva sem
     * precisar de geometria de revolução — é a mesma receita do Mano.
     */
    const barriga = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pena);
    barriga.scale.set(0.175, 0.15, 0.2);
    barriga.position.set(0, 0.2, -0.01);
    this.corpo.add(barriga);

    /**
     * O PEITO JÁ NASCE AZUL: ele NÃO é o tronco com uma camisa por cima — ele É
     * a camisa. Na primeira versão havia as duas coisas, duas esferas quase do
     * mesmo tamanho e quase concêntricas, e a foto de perfil voltou com a
     * costura pontilhada: superfícies quase tangentes brigam pelo mesmo pixel,
     * e aí não adianta qual é maior. Uma esfera só resolve na raiz.
     */
    const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), azul);
    peito.scale.set(0.162, 0.14, 0.158);
    peito.position.set(0, 0.328, 0.015);
    this.corpo.add(peito);

    /**
     * A BARRA DA CAMISA, branca, exatamente em cima da costura.
     *
     * Barriga e peito se cruzam por volta de `y = 0,275`, com raio ~0,15; ali
     * as duas superfícies chegam quase paralelas e a linha do encontro fica
     * suja. Esta faixa é mais larga que as duas e passa por fora — é o mesmo
     * papel da barra do peitilho do Mano, e o mesmo motivo.
     */
    const barra = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), camisa);
    barra.scale.set(0.172, 0.03, 0.194);
    barra.position.set(0, 0.277, 0);
    this.corpo.add(barra);

    /**
     * O RABINHO PARA CIMA, em grupo próprio para ele poder abanar. A cunha
     * aponta para trás e para o alto (`rotation.x` NEGATIVO deita para trás —
     * positivo inclinaria para a frente, que é a pegadinha que o pescoço da
     * girafa já pagou).
     */
    this.rabo.position.set(0, 0.235, -0.175);
    const penacho = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.14, 7), pena);
    penacho.rotation.x = -Math.PI * 0.32;
    penacho.position.set(0, 0.03, -0.045);
    this.rabo.add(penacho);
    // a pena de cima, mais escura e mais curta: é o degrau que faz o rabo ter
    // camada em vez de ser um chifre
    const penaDeCima = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 6), sombra);
    penaDeCima.rotation.x = -Math.PI * 0.26;
    penaDeCima.position.set(0, 0.075, -0.03);
    this.rabo.add(penaDeCima);
    this.corpo.add(this.rabo);

    // -------------------------------------------------------------- os pés
    /**
     * PÉ DE PATA, grande demais de propósito: na vista de cima do jogo é ele
     * que denuncia o bicho antes da cabeça. O grupo tem pivô no tornozelo, e é
     * ele que gira no passo.
     *
     * Eles ficam um pouco À FRENTE do centro do corpo, porque bicho vertical
     * com pé embaixo do meio parece que vai cair de bunda.
     */
    for (const lado of [-1, 1] as const) {
      const pe = new THREE.Group();
      pe.position.set(lado * 0.082, 0.05, 0.025);
      const canela = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.07, 7), bico);
      canela.position.y = -0.012;
      pe.add(canela);
      const palma = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), bico);
      palma.scale.set(0.062, 0.02, 0.085);
      palma.position.set(0, -0.04, 0.03);
      pe.add(palma);
      /**
       * Os três dedos, e o SINAL do `lado` é o que abre os de fora PARA FORA.
       * Sem ele os dois pés apontam para o mesmo lado — a pegadinha de sempre
       * deste projeto, e a mesma que o pé do Mano já resolveu assim.
       */
      for (const giro of [-0.5, 0, 0.5] as const) {
        const dedo = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.016, 0.078), bico);
        dedo.position.set(lado * giro * 0.058, -0.04, 0.09);
        dedo.rotation.y = -lado * giro;
        pe.add(dedo);
      }
      this.corpo.add(pe);
      this.pes.push(pe);
    }

    // --------------------------------------------------------------- as asas
    /**
     * ASA rente ao corpo, achatada no `x` e pendurada do ombro. O pivô fica no
     * ombro para ela abanar (na comemoração) e abrir (no carinho), girando em
     * `z` — e `rotation.z` positivo na asa da ESQUERDA, que nasce em `x`
     * negativo, empurra ela para DENTRO.
     */
    for (const lado of [-1, 1] as const) {
      const asa = new THREE.Group();
      asa.position.set(lado * 0.16, 0.34, -0.01);
      /**
       * A MANGA É FILHA DA ASA, e não do corpo.
       *
       * Ela nasceu presa no tronco, e na foto o bicho tinha buracos cremes no
       * azul: a asa balança e a manga parada ficava para trás, deixando a pena
       * atravessar o pano. Manga costurada na asa bate junto com ela, que é o
       * que roupa faz.
       */
      const manga = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), azul);
      manga.scale.set(0.042, 0.072, 0.118);
      manga.position.y = -0.045;
      asa.add(manga);
      const punho = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), camisa);
      punho.scale.set(0.04, 0.016, 0.108);
      punho.position.y = -0.112;
      asa.add(punho);

      const lamina = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), pena);
      lamina.scale.set(0.034, 0.085, 0.112);
      lamina.position.y = -0.155;
      asa.add(lamina);
      // a ponta um degrau mais escura: sem ela a asa creme some contra o corpo
      // creme na vista de cima, que é a vista do jogo
      const ponta = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), sombra);
      ponta.scale.set(0.029, 0.045, 0.075);
      ponta.position.set(0, -0.225, -0.025);
      asa.add(ponta);
      asa.rotation.z = lado * 0.1;
      this.corpo.add(asa);
      this.asas.push(asa);
    }

    /**
     * A RAQUETE, na asa DIREITA (a segunda da lista).
     *
     * O PIVÔ É O PUNHO, e não o disco — é essa a correção que o Renan pediu.
     * Antes a raquete inteira era posicionada e girada a partir do CENTRO DA
     * BORRACHA, e todo giro arrastava o cabo junto: ele terminava apontando
     * para fora e a peça flutuava ao lado da asa, como se o pato estivesse
     * levitando uma frigideira.
     *
     * Agora existe um grupo `punho` na PONTA DA ASA, e a raquete entra dentro
     * dele deslocada para cima exatamente o comprimento do cabo. A origem do
     * grupo passa a ser o ponto onde a mão segura, então girar o grupo gira a
     * raquete EM VOLTA DO PUNHO — que é o que um pulso faz.
     *
     * A conta do deslocamento: `raquete()` põe o cabo numa cápsula de raio
     * 0,035 e corpo 0,16 (altura total 0,23) centrada em `y = -0,25`, ou seja
     * a ponta de baixo do cabo fica em `-0,365`. Vezes a escala 0,58 dá
     * `-0,2117` — e é essa a subida que encosta a ponta do cabo na origem.
     */
    const punhoDaRaquete = new THREE.Group();
    punhoDaRaquete.position.set(0.015, -0.185, 0.03);
    /*
     * O GIRO EM `y` DECIDE PARA ONDE A FACE DA RAQUETE OLHA, e ele é medido
     * PARA A POSE DA APRESENTAÇÃO — não para o pato de frente.
     *
     * A raquete gira junto com o bicho, então nenhum valor serve para todas as
     * direções: com a face olhando para a câmera quando ele encara `+Z`, ela
     * fica de perfil justamente na cutscene, onde ele para virado a 1,3 rad e
     * fica falando um minuto. `-0,45` inverte a conta: a 1,3 a face cai em
     * 0,85 rad, de frente para a câmera, e é ali que ela precisa aparecer.
     *
     * O `z` NEGATIVO inclina o disco para FORA do corpo (o punho está em `x`
     * positivo), deixando o cabo levemente virado para dentro — para a mão.
     */
    punhoDaRaquete.rotation.set(0.18, -0.45, -0.3);
    const bat = raquete(P.vermelhoFranca);
    bat.scale.setScalar(0.58);
    bat.position.y = 0.2117;
    punhoDaRaquete.add(bat);
    this.asas[1].add(punhoDaRaquete);

    // ------------------------------------------------------- a bandeirinha
    /**
     * A BANDEIRINHA NO PEITO: azul, branco e vermelho lado a lado, na ordem de
     * quem olha de frente.
     *
     * Ela vem sobre um RETÂNGULO BRANCO, e esse é o truque: sem o fundo, a
     * tira branca do meio desaparecia contra a camisa (creme na primeira
     * versão, azul agora — as duas comiam uma das três cores). Com o fundo, as
     * três leem sempre.
     *
     * A pilha avança em degraus de 8 mm a partir da face da camisa (que
     * termina em `z ≈ 0,175`): encostadas, as faces brigariam pelo mesmo pixel.
     */
    const bandeira = new THREE.Mesh(new THREE.BoxGeometry(0.156, 0.098, 0.018), camisa);
    bandeira.position.set(0, 0.322, 0.168);
    this.corpo.add(bandeira);
    for (const [i, cor] of [azul, camisa, vermelho].entries()) {
      const tira = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.082, 0.016), cor);
      tira.position.set((i - 1) * 0.046, 0.322, 0.182);
      this.corpo.add(tira);
    }

    // a gola branca, um anel na base do pescoço: é o que separa "camisa de
    // jogador" de "macacão azul"
    const gola = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.019, 6, 14), camisa);
    gola.position.set(0, 0.398, 0.03);
    gola.rotation.x = Math.PI / 2 - 0.3;
    this.corpo.add(gola);

    // ----------------------------------------------------------- o pescoço
    /**
     * CURTO E INCLINADO PARA A FRENTE. `rotation.x` positivo leva o `+Y` local
     * para o `+Z`, ou seja, tomba na direção para onde ele olha — que é a curva
     * do peito de pato. Negativo deitaria o pescoço por cima do lombo, que foi
     * o bug da girafa.
     */
    this.pescoco.position.set(0, 0.4, 0.03);
    this.pescoco.rotation.x = 0.2;
    const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.072, 0.13, 10), pena);
    coluna.position.y = 0.06;
    this.pescoco.add(coluna);
    this.corpo.add(this.pescoco);

    // ------------------------------------------------------------- a cabeça
    this.cabeca.name = 'cabeca-do-jean-luc';
    this.cabeca.position.set(0, 0.135, 0.012);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pena);
    cranio.scale.set(0.115, 0.115, 0.115);
    this.cabeca.add(cranio);

    /**
     * O BICO — a peça que decide se isto é um pato.
     *
     * É uma ESPÁTULA: esfera achatada no `y`, larga no `x` e comprida no `z`,
     * com a mandíbula de baixo um degrau menor aparecendo por baixo (é a fresta
     * entre as duas que dá boca ao bico). Cone viraria passarinho genérico.
     */
    const espatula = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), bico);
    espatula.scale.set(0.078, 0.026, 0.105);
    espatula.position.set(0, -0.018, 0.115);
    this.cabeca.add(espatula);
    const mandibula = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), bicoEscuro);
    mandibula.scale.set(0.064, 0.018, 0.088);
    mandibula.position.set(0, -0.046, 0.105);
    this.cabeca.add(mandibula);
    // as narinas, dois pontinhos no alto do bico: custam duas esferas e são o
    // que faz a espátula ler como bico em vez de pá
    for (const lado of [-1, 1] as const) {
      const narina = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 6), bicoEscuro);
      narina.position.set(lado * 0.022, -0.004, 0.105);
      this.cabeca.add(narina);
    }

    /**
     * OS OLHOS: bola branca com pupila grande e um brilho. A pupila ocupa mais
     * da metade — é a régua chibi do resto do jogo, e é ela que faz o bicho ser
     * lido como fofo em vez de assustado.
     */
    for (const lado of [-1, 1] as const) {
      const branco = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), toon(P.camisaDoJeanLuc));
      branco.position.set(lado * 0.055, 0.032, 0.078);
      this.cabeca.add(branco);
      this.olhos.push(branco);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), toon(P.azulFranca));
      pupila.position.set(lado * 0.058, 0.031, 0.101);
      this.cabeca.add(pupila);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.01, 6, 6), toon(P.camisaDoJeanLuc));
      brilho.position.set(lado * 0.067, 0.044, 0.113);
      this.cabeca.add(brilho);
      // a bochecha rosada: metade da fofura por uma esfera achatada
      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), toon(P.patoBochecha));
      bochecha.scale.set(0.032, 0.022, 0.018);
      bochecha.position.set(lado * 0.082, -0.012, 0.062);
      this.cabeca.add(bochecha);
    }

    this.montarABoina();
    this.cabeca.add(this.boina);
    this.pescoco.add(this.cabeca);
    this.group.add(this.corpo);
  }

  /**
   * A BOINA, tombada para um lado.
   *
   * Três peças, e as três importam: a aba (o cinto que encosta na cabeça), a
   * cúpula macia por cima dela e o RABINHO de pano no alto — é ele que separa
   * boina de disco de plástico. Os raios são diferentes de propósito: cúpula e
   * aba do mesmo tamanho casariam as faces laterais e serrilhariam a borda
   * inteira.
   *
   * O TOMBO É EM `z`, e não em `x`: boina inclinada para a frente cairia no
   * bico, e é de lado que ela é usada.
   */
  private montarABoina(): void {
    const pano = toon(P.azulFranca);
    this.boina.position.set(0, 0.085, -0.005);
    this.boina.rotation.z = 0.3;
    this.boina.rotation.x = -0.12;

    const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.022, 14), pano);
    this.boina.add(aba);
    const cupula = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pano);
    cupula.scale.set(0.122, 0.052, 0.122);
    cupula.position.y = 0.024;
    this.boina.add(cupula);
    const rabinho = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.03, 6), pano);
    rabinho.position.y = 0.072;
    this.boina.add(rabinho);
  }

  // ------------------------------------------------------ o que a cena manda

  /**
   * COMEMORA: pula, abana as asas e sacode a raquete.
   *
   * A cutscene chama `comemorar(3)` e continua a vida dela — quem desenha é o
   * `animar`. Mesmo contrato da dança do Mano.
   */
  comemorar(segundos = 3): void {
    this.comemorando = Math.max(this.comemorando, segundos);
  }

  /** ele está comemorando agora (o teste pergunta isto) */
  get estaComemorando(): boolean {
    return this.comemorando > 0;
  }

  /**
   * Põe ele numa altura, para a cena poder afundá-lo no lago.
   *
   * O passeio nunca escreve no `y` — ele só mexe em `x` e `z` —, então a cena
   * pode usar este eixo à vontade durante a emersão sem brigar com o cérebro.
   */
  emergirAte(y: number): void {
    this.group.position.y = y;
  }

  /** a altura atual dele, para a cena interpolar a saída da água */
  get altura(): number {
    return this.group.position.y;
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, carinho, fase }: PoseDoBicho): void {
    if (this.comemorando > 0) {
      this.comemorando = Math.max(0, this.comemorando - dt);
      this.fasa += dt;
    }
    const festa = this.comemorando > 0;
    // a festa entra e sai por interpolação: ligar de um quadro para o outro dá
    // um estalo, que é o que denuncia animação de código
    const mistura = festa ? Math.min(1, this.fasa * 4) : 0;

    // a respiração de sempre por baixo de tudo, o gingado do passo por cima, e
    // o pulinho da comemoração em último
    const respiro = Math.sin(fase * 1.8) * 0.01;
    const passo = andando ? Math.abs(Math.sin(fase * 7.5)) * 0.018 : 0;
    const pulo = Math.abs(Math.sin(this.fasa * 8)) * 0.07 * mistura;
    this.corpo.position.y = respiro + passo + pulo;

    /**
     * O GINGADO. Pato anda rebolando — é o tombo lateral que faz o passo dele
     * ser de pato e não de galinha. Ele vale no passeio E na festa, só que na
     * festa é o dobro.
     */
    const ginga = andando ? Math.sin(fase * 7.5) * 0.11 : 0;
    this.corpo.rotation.z = ginga + Math.sin(this.fasa * 8) * 0.2 * mistura;

    /**
     * AS ASAS. Na festa elas batem rápido (13 rad/s contra os 8 do corpo); no
     * carinho elas abrem; andando elas seguem o passo de leve. O sinal do lado
     * é o de sempre: o mesmo ângulo positivo fecha uma e abre a outra.
     */
    /*
     * A BATIDA VAI ATÉ 0,75 rad, e não até 1,1 como na primeira tentativa.
     * Naquele ângulo a asa subia quase à horizontal e, somada à inclinação
     * para a frente, cruzava na frente do bico: o pato comemorava tapando a
     * própria cara.
     */
    const bater = festa ? (0.37 + Math.sin(this.fasa * 13) * 0.37) * mistura : 0;
    for (const [i, asa] of this.asas.entries()) {
      const lado = i === 0 ? -1 : 1;
      const doPasso = andando ? Math.sin(fase * 7.5) * 0.09 : 0;
      const alvoZ = lado * (0.1 + bater + carinho * 0.45) + doPasso;
      asa.rotation.z += (alvoZ - asa.rotation.z) * Math.min(1, dt * 12);
      // e a raquete sobe junto: na festa ele levanta a asa direita como quem
      // mostra o troféu
      const alvoX = festa ? -0.4 * mistura : 0;
      asa.rotation.x += (alvoX - asa.rotation.x) * Math.min(1, dt * 9);
    }

    // os pés: passinho miúdo andando, e na festa eles marcam o compasso
    for (const [i, pe] of this.pes.entries()) {
      const lado = i === 0 ? -1 : 1;
      const alvo = festa
        ? Math.max(0, Math.sin(this.fasa * 8 + (lado > 0 ? Math.PI : 0))) * 0.55 * mistura
        : andando ? Math.sin(fase * 7.5 + (lado > 0 ? Math.PI : 0)) * 0.5 : 0;
      pe.rotation.x += (alvo - pe.rotation.x) * Math.min(1, dt * 12);
    }

    // o rabinho abana: devagar sempre, depressa no carinho e na festa
    this.rabo.rotation.y = Math.sin(fase * (2.2 + carinho * 9 + (festa ? 8 : 0)))
      * (0.08 + carinho * 0.3 + (festa ? 0.25 : 0) * mistura);

    /**
     * O PESCOÇO E A CABEÇA. Na festa a cabeça vai ao CONTRÁRIO do corpo — é o
     * que faz o pulo parecer comemoração em vez de tremor. No carinho ela sobe
     * para encostar na mão e os olhos fecham.
     */
    this.pescoco.rotation.z = -this.corpo.rotation.z * 0.5;
    this.pescoco.rotation.x = 0.2 - carinho * 0.26 + Math.sin(fase * 2.1) * 0.025
      - (festa ? 0.12 * mistura : 0);
    this.cabeca.rotation.y = Math.sin(fase * 1.3) * 0.12 + Math.sin(this.fasa * 8) * 0.18 * mistura;
    for (const olho of this.olhos) {
      const alvo = 1 - carinho * 0.75;
      olho.scale.y += (alvo - olho.scale.y) * Math.min(1, dt * 8);
    }

    /**
     * A BOINA CHEGA ATRASADA. É um chapéu solto na cabeça de um bicho que está
     * pulando: a defasagem de meio radiano é o que faz ela parecer pousada em
     * cima, e não parafusada.
     */
    this.boina.rotation.z = 0.3 + Math.sin(this.fasa * 8 - 0.5) * 0.22 * mistura;
    this.boina.rotation.x = -0.12 + Math.sin(this.fasa * 6.4 - 0.5) * 0.1 * mistura;
  }
}
