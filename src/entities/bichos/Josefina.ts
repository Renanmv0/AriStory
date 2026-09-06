import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * A JOSEFINA, a tartaruga jardineira do clube. O nome e o jeito sao do Renan:
 * tranquila, carinhosa, ama as plantinhas dela e adora contar historia.
 *
 * Ela e a quarta funcionaria do clube e a mais LENTA de todas — de proposito.
 * A Gina e o Capy ficam em posto, o Noel nao para quieto, e a Josefina anda
 * devagar pelo jardim inteiro, parando muito. O `jeito` dela e o oposto exato
 * do peru, e e so isso que separa as duas personalidades: mesmo cerebro, numeros
 * diferentes.
 *
 * O QUE FAZ UMA TARTARUGA SER LIDA COMO TARTARUGA, na ordem que importa:
 *
 * 1. O CASCO E UMA CUPULA ACHATADA COM PLACAS. As placas (os "escudos") sao o
 *    desenho — sem elas o casco vira uma pedra verde. Elas vao em duas coroas
 *    mais a do meio, que e como o casco de verdade e dividido.
 * 2. O PESCOCO SAI DA FRENTE DO CASCO, grosso e enrugado, e a cabeca fica
 *    BAIXA. Cabeca alta vira dinossauro.
 * 3. AS PATAS SAO COLUNAS CURTAS E GROSSAS, quase sem articulacao, saindo por
 *    baixo da borda do casco.
 *
 * O QUE DIZ QUE ELA E JARDINEIRA: o VASINHO nas costas — o pedido do Renan —,
 * mais o aventalzinho de jardim e a pazinha presa nele. O vasinho fica no ALTO
 * do casco, que e a parte que a camera isometrica mais mostra: acessorio de
 * tartaruga tem que ir em cima, porque de lado o casco esconde tudo.
 *
 * E O LACINHO ROSA na cabeca, tambem pedido dele. Ele fica entre os olhos e o
 * casco, na unica faixa de cabeca que sobra visivel de cima.
 */
export class Josefina extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly pescoco = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly patas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly rabo = new THREE.Group();
  private readonly laco = new THREE.Group();
  /** a plantinha do vasinho das costas, que balanca quando ela anda */
  private readonly muda = new THREE.Group();

  constructor(area: AreaDoBicho) {
    super(area, {
      /**
       * A MAIS LENTA DO JOGO, e o numero e a personalidade. O Noel anda a 0,85
       * e descansa 0,2-0,7; ela anda a 0,3 e descansa 3-7. Sao os mesmos dois
       * campos, e sao eles que fazem uma parecer eletrica e a outra, tranquila.
       */
      velocidade: 0.3,
      descansoMin: 3.0,
      descansoMax: 7.0,
      // ela para MUITO, e quase sempre recolhida, cuidando de alguma planta
      chanceDeSentar: 0.55,
      // e caladinha: um ronronado a cada 20-38 s
      somCadaMin: 20,
      somCadaMax: 38,
      duracaoDoCarinho: 5.0,
      semente: 20260907,
    });
    this.montar();
    this.prontoParaAparecer('josefina');
  }

  // ----------------------------------------------------------------- corpo

  private montar(): void {
    const casco = toon(P.tartarugaCasco);
    const escudo = toon(P.tartarugaEscudo);
    const barriga = toon(P.tartarugaBarriga);
    const pele = toon(P.tartarugaPele);
    const rosa = toon(P.lacoDaJosefina);

    /**
     * O CASCO: meia esfera achatada. `SphereGeometry` cortada na metade
     * (`thetaLength = PI/2`) em vez de uma esfera inteira enterrada — assim ela
     * nao tem barriga escondida dentro do plastrao, e o casco tem mesmo uma
     * borda, que e onde as patas saem.
     */
    const cupula = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      casco,
    );
    cupula.scale.set(1, 0.62, 1.15);
    cupula.position.y = 0.16;
    this.corpo.add(cupula);

    /**
     * AS PLACAS DO CASCO. Sem elas o casco e uma pedra verde: e o desenho das
     * placas que faz o bicho ser tartaruga a qualquer distancia.
     *
     * A divisao e a de verdade: uma placa central no alto e duas coroas em
     * volta, a de fora menor e mais rente a borda. Cada placa e uma caixa
     * achatada, girada para acompanhar a curva do casco.
     */
    const placa = (raio: number, tamanho: number, alturaK: number, giro: number, tomba: number): void => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(tamanho, 0.022, tamanho * 0.86), escudo);
      p.position.set(
        Math.cos(giro) * raio,
        0.16 + Math.sqrt(Math.max(0, 1 - (raio / 0.32) ** 2)) * 0.186 * alturaK,
        Math.sin(giro) * raio * 1.15,
      );
      p.rotation.y = -giro;
      p.rotation.z = Math.cos(giro) * tomba;
      p.rotation.x = -Math.sin(giro) * tomba;
      this.corpo.add(p);
    };
    // a do meio
    const centro = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.022, 0.12), escudo);
    centro.position.y = 0.35;
    this.corpo.add(centro);
    for (let i = 0; i < 6; i++) placa(0.13, 0.105, 1, (i / 6) * Math.PI * 2 + 0.3, 0.42);
    for (let i = 0; i < 9; i++) placa(0.245, 0.085, 1, (i / 9) * Math.PI * 2, 0.95);

    // a borda do casco: um aro claro que separa a cupula das patas
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.295, 0.032, 6, 20), barriga);
    aro.rotation.x = Math.PI / 2;
    aro.scale.z = 1.15;
    aro.position.y = 0.155;
    this.corpo.add(aro);

    // ---------------------------------------------------------------- patas
    /**
     * COLUNAS CURTAS E GROSSAS, saindo por baixo da borda do casco. Tartaruga
     * quase nao dobra a perna: o passo dela e a coluna inteira indo para a
     * frente e para tras, e por isso o pivo fica no alto de cada uma.
     */
    for (const [x, z] of [
      [-0.185, 0.2], [0.185, 0.2], [-0.185, -0.2], [0.185, -0.2],
    ] as const) {
      const perna = new THREE.Group();
      perna.position.set(x, 0.135, z);
      const coluna = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.045, 4, 7), pele);
      coluna.position.y = -0.05;
      perna.add(coluna);
      const pe = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.04, 0.115), pele);
      pe.position.y = -0.11;
      perna.add(pe);
      // as unhinhas, que sao o que faz o pe nao parecer um toco
      for (const dx of [-0.03, 0.03] as const) {
        const unha = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.035, 5), barriga);
        unha.position.set(dx, -0.115, 0.062);
        unha.rotation.x = Math.PI / 2;
        perna.add(unha);
      }
      this.corpo.add(perna);
      this.patas.push(perna);
    }

    // ------------------------------------------------------ pescoco e cabeca
    /**
     * O PESCOCO SAI DA FRENTE DO CASCO e e GROSSO. Ele encolhe quando ela
     * descansa — que e a coisa mais tartaruga que existe, e o que a pose usa
     * para mostrar que ela esta sossegada.
     */
    this.pescoco.name = 'pescoco-da-josefina';
    this.pescoco.position.set(0, 0.215, 0.28);
    this.pescoco.rotation.x = -0.15;
    const gogo = new THREE.Mesh(new THREE.CapsuleGeometry(0.062, 0.075, 4, 8), pele);
    gogo.position.z = 0.06;
    gogo.rotation.x = Math.PI / 2;
    this.pescoco.add(gogo);
    // as ruguinhas do pescoco: dois aneis finos, o detalhe que mais aparece
    // quando a camera chega perto
    for (const dz of [0.02, 0.08] as const) {
      const ruga = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.009, 5, 10), toon(P.tartarugaCasco));
      ruga.position.z = dz;
      this.pescoco.add(ruga);
    }

    this.cabeca.name = 'cabeca-da-josefina';
    this.cabeca.position.set(0, 0.035, 0.17);
    // CABECA GRANDE, regua chibi do jogo. Na primeira versao ela tinha 0,082 de
    // raio e ficava metade enfiada na borda do casco: de longe a Josefina era
    // uma cupula verde com um vaso em cima, sem cara nenhuma.
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
    cranio.scale.set(0.098, 0.088, 0.112);
    this.cabeca.add(cranio);
    // o bico: tartaruga nao tem dentes, tem uma quina de cor mais clara
    const bico = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.024, 0.038), barriga);
    bico.position.set(0, -0.036, 0.096);
    this.cabeca.add(bico);
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.019, 8, 6), toon(0x2b2a33));
      olho.position.set(lado * 0.058, 0.026, 0.078);
      this.cabeca.add(olho);
      this.olhos.push(olho);
      // a bochecha rosada: e ela que faz a Josefina parecer CARINHOSA e nao so
      // velha. Decalque de material chapado, colado no cranio.
      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(0.026, 7, 5), rosa);
      bochecha.scale.set(1, 0.6, 0.35);
      bochecha.position.set(lado * 0.074, -0.014, 0.062);
      this.cabeca.add(bochecha);
    }

    /**
     * O LACINHO ROSA, o pedido do Renan. Ele fica no ALTO da cabeca, entre os
     * olhos e o casco: e a unica faixa de cabeca que a camera isometrica mostra
     * inteira. Duas asas em cone e um no no meio — o mesmo desenho do laco do
     * Ari, so que menor.
     */
    this.laco.position.set(0, 0.086, 0.015);
    for (const lado of [-1, 1] as const) {
      const asa = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.078, 6), rosa);
      asa.position.set(lado * 0.056, 0, 0);
      asa.rotation.z = lado * Math.PI * 0.5;
      this.laco.add(asa);
      const fita = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.05, 0.012), toon(0xe07399));
      fita.position.set(lado * 0.03, -0.035, -0.01);
      fita.rotation.z = lado * 0.4;
      this.laco.add(fita);
    }
    const no = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), toon(0xe07399));
    this.laco.add(no);
    this.cabeca.add(this.laco);
    this.pescoco.add(this.cabeca);
    this.corpo.add(this.pescoco);

    // ----------------------------------------------------------------- rabo
    this.rabo.position.set(0, 0.19, -0.29);
    const rabinho = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.11, 6), pele);
    rabinho.rotation.x = -Math.PI / 2;
    rabinho.position.z = -0.05;
    this.rabo.add(rabinho);
    this.corpo.add(this.rabo);

    // ----------------------------------------------- a roupa de jardineira
    /**
     * O VASINHO NAS COSTAS — o pedido do Renan, e o detalhe que conta a
     * historia dela inteira. Ele vai no ALTO do casco, encaixado na placa
     * central: acessorio de tartaruga tem que ir em cima, porque de lado o
     * proprio casco esconde qualquer coisa pendurada.
     */
    const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.048, 0.085, 10), toon(P.barroDoVaso));
    vaso.position.set(0, 0.4, -0.02);
    this.corpo.add(vaso);
    const borda = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.018, 10), toon(P.barroDaBorda));
    borda.position.set(0, 0.442, -0.02);
    this.corpo.add(borda);
    const terrinha = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.014, 8), toon(P.terraUmida));
    terrinha.position.set(0, 0.45, -0.02);
    this.corpo.add(terrinha);

    // a plantinha do vaso, num grupo proprio: ela BALANCA quando a Josefina
    // anda, e e o que faz o vasinho parecer carregado e nao colado
    this.muda.position.set(0, 0.455, -0.02);
    const caule = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.075, 6), toon(P.leafDark));
    caule.position.y = 0.037;
    this.muda.add(caule);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.4;
      const folha = new THREE.Mesh(new THREE.SphereGeometry(0.045, 7, 6), toon(P.folhaAlface));
      folha.scale.set(1, 0.32, 1.5);
      folha.position.set(Math.cos(a) * 0.035, 0.078, Math.sin(a) * 0.035);
      folha.rotation.y = a;
      folha.rotation.x = -0.3;
      this.muda.add(folha);
    }
    const florzinha = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), toon(P.florCamelia));
    florzinha.scale.y = 0.75;
    florzinha.position.y = 0.105;
    this.muda.add(florzinha);
    this.corpo.add(this.muda);

    /**
     * O AVENTALZINHO e a PAZINHA. O casco nao aceita roupa — e uma cupula
     * dura —, entao o avental e uma FAIXA na frente, entre o pescoco e a borda
     * do casco, que e onde caberia o peitilho de um avental de verdade.
     */
    const peitilho = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, 0.045), toon(P.aventalDoNoel));
    peitilho.position.set(0, 0.13, 0.245);
    peitilho.rotation.x = -0.25;
    this.corpo.add(peitilho);
    const bolso = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.045, 0.02), toon(P.aventalFaixa));
    bolso.position.set(0, 0.11, 0.272);
    bolso.rotation.x = -0.25;
    this.corpo.add(bolso);
    // a pazinha espetada no bolso, com o cabo para fora
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.1, 6), toon(P.wood));
    cabo.position.set(0.055, 0.185, 0.265);
    cabo.rotation.x = -0.25;
    this.corpo.add(cabo);
    const pa = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.055, 0.014), toon(P.metalGrey));
    pa.position.set(0.055, 0.13, 0.28);
    pa.rotation.x = -0.25;
    this.corpo.add(pa);

    this.group.add(this.corpo);
  }

  // ------------------------------------------------------------------ pose

  /**
   * A POSE DELA E O CONTRARIO DA DO NOEL, e de proposito: onde ele treme, ela
   * respira. Tudo aqui e lento.
   *
   * A COISA MAIS TARTARUGA QUE ELA FAZ e ENCOLHER O PESCOCO quando para. Nao e
   * enfeite: e o gesto que o bicho tem e nenhum outro do jogo tem, e e ele que
   * faz a Josefina parecer sossegada em vez de so devagar.
   */
  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    if (andando) {
      // O passo e LENTO (fase * 4, contra 11 do peru) e as patas vao em
      // diagonal, como bicho de quatro patas anda de verdade.
      const t = fase * 4;
      const passo = Math.sin(t) * 0.38;
      this.patas[0].rotation.x = passo;
      this.patas[3].rotation.x = passo;
      this.patas[1].rotation.x = -passo;
      this.patas[2].rotation.x = -passo;
      // o casco balanca de lado no passo — tartaruga anda gingando
      this.corpo.rotation.z = Math.sin(t) * 0.055;
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.012;
    } else {
      for (const perna of this.patas) {
        perna.rotation.x += (0 - perna.rotation.x) * Math.min(1, dt * 4);
      }
      this.corpo.rotation.z *= 1 - Math.min(1, dt * 4);
      // sentada ela AFUNDA: o casco desce e as patas somem embaixo dele
      const alvoY = sentado ? -0.055 : 0;
      this.corpo.position.y += (alvoY - this.corpo.position.y) * Math.min(1, dt * 3);
      const respira = Math.sin(fase * 1.1) * 0.006;
      this.corpo.position.y += respira * dt * 3;
    }

    /**
     * O PESCOCO ENCOLHE E ESTICA. Parada e sossegada ele recolhe; no carinho
     * ela estica o pescoco INTEIRO para fora, que e o gesto de quem confia em
     * quem chegou. Sem isso ela seria uma pedra verde que anda.
     */
    /**
     * MESMO RECOLHIDA ELA MOSTRA A CARA. O piso do encolhimento era 0,14, e com
     * ele a cabeca ficava enfiada na borda do casco — e como ela passa a maior
     * parte do tempo parada, era assim que ela aparecia quase sempre. Agora o
     * piso e 0,25: recolhida ela so encolhe o pescoco, nao a cabeca.
     */
    const esticado = (andando ? 0.72 : 0.25) + carinho * 0.7;
    const alvoZ = 0.24 + esticado * 0.19;
    this.pescoco.position.z += (alvoZ - this.pescoco.position.z) * Math.min(1, dt * 3.2);
    this.pescoco.rotation.x = -0.15 - carinho * 0.22;
    // e ele olha em volta bem devagar, vendo as plantas
    this.pescoco.rotation.y = andando ? 0 : Math.sin(fase * 0.32) * 0.42;

    // a cabecinha assente de leve o tempo todo: e o "sim, sim" de quem esta
    // contando uma historia
    this.cabeca.rotation.x = Math.sin(fase * 1.5) * 0.06 + carinho * 0.1;

    /**
     * A PLANTINHA DO VASO BALANCA, e o laco tambem. Sao os dois detalhes que
     * ficam vivos quando o resto dela esta parado — bicho lento precisa de
     * alguma coisa em movimento, senao lê como estatua e nao como sossego.
     */
    const vento = andando ? 1.6 : 0.7;
    this.muda.rotation.z = Math.sin(fase * 2.2) * 0.13 * vento;
    this.muda.rotation.x = Math.cos(fase * 1.7) * 0.09 * vento;
    this.laco.rotation.z = Math.sin(fase * 2.6) * 0.1 * vento + carinho * 0.15;

    this.rabo.rotation.y = Math.sin(fase * 1.9) * 0.2 * (andando ? 1 : 0.4);

    // no carinho ela fecha os olhinhos de contente
    const aberto = 1 - carinho * 0.8;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.15, aberto);
  }
}
