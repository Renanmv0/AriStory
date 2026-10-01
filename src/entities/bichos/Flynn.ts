import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { colar } from '../../world/roupasDoJardim';
import { emblemaDosGatitos, estrela, letra, textoEmArco } from '../../world/uniformeDosGatitos';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O FLYNN — a raposa presidente da atlética dos Gatitos, o primeiro atleta da
 * escola (pedido do Renan). Super entusiasta de esporte, fala de jogo o tempo
 * todo… e é muito respeitoso: anima todo mundo, convida sem forçar, dá os
 * parabéns até para o time que ganhou dele. Ele sempre está de BANDANA dos
 * Gatitos.
 *
 * É um bicho de duas patas, no molde das coelhinhas (`CoelhaDaTorcida`): o
 * corpo em números de bicho de chão e a escala no fim. Um pouco mais alto que
 * elas — é o capitão.
 *
 * O QUE FAZ ELE SER LIDO COMO RAPOSA, nesta ordem:
 *
 * 1. as ORELHAS em triângulo, altas, com a PONTA MARROM — a silhueta;
 * 2. o FOCINHO comprido e fino, creme, com o nariz preto na ponta, e as
 *    BOCHECHAS brancas com o tufo apontando para fora;
 * 3. o RABO enorme e fofo, laranja com a PONTA BRANCA, curvado para cima;
 * 4. as "MEIAS" marrom-café nas patas da frente.
 *
 * O QUE DIZ QUE ELE É O PRESIDENTE DA ATLÉTICA (o uniforme transforma bicho
 * em alguém, a regra do avental do Mano):
 *
 *  - a BANDANA azul na testa, com as duas listras amarelas, o emblema dos
 *    Gatitos na frente e o nó atrás com as duas pontas balançando;
 *  - a REGATA azul com o número 1 (branco com borda amarela), "GATITOS" no
 *    peito, "FLYNN" e o 1 nas costas, a gola e as cavas amarelas, e o pin de
 *    estrela;
 *  - a BRAÇADEIRA DE CAPITÃO amarela com o "C", no braço esquerdo;
 *  - as MUNHEQUEIRAS brancas com a listra azul, nos dois pulsos;
 *  - o APITO prateado no cordão vermelho;
 *  - o SHORT marinho com a listra amarela do lado e o cordão do cós;
 *  - o MEIÃO branco listrado e o TÊNIS branco com a faixa coral e o cadarço
 *    amarelo.
 *
 * E DOIS GESTOS que a cena aciona na conversa: ACENAR (a pata direita no alto,
 * abanando — é como ele chega em todo mundo) e COMEMORAR (os dois punhos para
 * cima, pulinhos, o rabo a mil).
 */

const AZUL = P.gatitosAzul;
const MARINHO = P.gatitosAzulEscuro;
const AMARELO = P.gatitosAmarelo;
const BRANCO = P.gatitosBranco;

/** a casca da regata (o elipsoide por fora do tronco), em números do corpo */
const REGATA = { y: 0.452, rx: 0.12, ry: 0.138, rz: 0.098 };

/** um ponto na casca da regata, na frente (`costas` atrás), com uma folga para fora */
function naRegata(x: number, y: number, folga = 0.004, costas = false): THREE.Vector3 {
  const u = 1 - (x / REGATA.rx) ** 2 - ((y - REGATA.y) / REGATA.ry) ** 2;
  const z = REGATA.rz * Math.sqrt(Math.max(0, u)) + folga;
  return new THREE.Vector3(x, y, costas ? -z : z);
}

export class Flynn extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly pernas: THREE.Group[] = [];
  /** os dois braços, com pivô no ombro: [esquerdo, direito] */
  private readonly bracos: THREE.Group[] = [];
  /** o rabo em gomos encadeados, da base para a ponta */
  private readonly gomosDoRabo: THREE.Group[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Group[] = [];
  /** as duas pontas do nó da bandana, que balançam */
  private readonly pontasDaBandana: THREE.Group[] = [];

  /** o relógio dele (os senos), e quanto falta de cada gesto */
  private relogio = 0;
  private acenando = 0;
  private comemorando = 0;
  private misturaAceno = 0;
  private misturaFesta = 0;
  private proximaPiscada = 2.5;
  private proximaOrelhada = 4;
  private orelhada = -1;
  /** a altura do pulinho neste quadro (o teste lê) */
  private puloAgora = 0;

  constructor(area: AreaDoBicho) {
    super(area, {
      // elétrico, mas educado: anda bem, e para pouco em cada canto
      velocidade: 0.85,
      descansoMin: 0.8,
      descansoMax: 2.4,
      chanceDeSentar: 0,
      // o barulho dele é o apito — quem toca é a cena, na conversa
      somCadaMin: 1e6,
      somCadaMax: 1e6,
      duracaoDoCarinho: 2,
      semente: 20261003,
    });
    this.montar();
    this.prontoParaAparecer('flynn');
  }

  // ---------------------------------------------------------------- gestos

  /** a pata direita no alto, abanando: o "oi!" dele */
  acenar(segundos = 1.8): void {
    this.acenando = Math.max(this.acenando, segundos);
  }

  /** os dois punhos para cima e pulinhos: o "vão, Gatitos!" */
  comemorar(segundos = 1.8): void {
    this.comemorando = Math.max(this.comemorando, segundos);
  }

  /** o teste pergunta isto */
  get estaAcenando(): boolean {
    return this.acenando > 0;
  }
  get estaComemorando(): boolean {
    return this.comemorando > 0;
  }
  get alturaDoPulo(): number {
    return this.puloAgora;
  }
  /** o quanto a pata direita subiu (rad): 0 com o braço baixo, perto de 3 no alto */
  get bracoDireitoNoAlto(): number {
    return Math.abs(this.bracos[1]?.rotation.z ?? 0);
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const pelo = toon(P.flynnPelo);
    const claro = toon(P.flynnPeloClaro);
    const escuro = toon(P.flynnPeloEscuro);
    const azul = toon(AZUL);
    const marinho = toon(MARINHO);
    const amarelo = toon(AMARELO);
    const branco = toon(BRANCO);

    // ------------------------------------------------------------ as pernas
    /**
     * Pivô no QUADRIL (`y = 0,29`). De cima para baixo: a coxa de pelo, a
     * perna do short por cima dela, o meião branco do joelho ao tornozelo e o
     * tênis. A sola do tênis termina em `-0,29`: encosta no chão.
     *
     * PERNA DE ATLETA (pedido do Renan: "mais magro, com uma aparência mais
     * atlética"): comprida e fina — a primeira versão tinha a perna curta e
     * gordinha das coelhinhas, e ele lia como mascote, não como capitão.
     */
    for (const lado of [-1, 1] as const) {
      const perna = new THREE.Group();
      perna.position.set(lado * 0.054, 0.29, 0);
      const coxa = new THREE.Mesh(new THREE.CapsuleGeometry(0.037, 0.13, 4, 10), pelo);
      coxa.position.y = -0.1;
      perna.add(coxa);
      // a perna do short, solta na coxa, com a listra amarela do lado de fora
      const doShort = new THREE.Mesh(new THREE.CapsuleGeometry(0.047, 0.04, 4, 12), marinho);
      doShort.position.y = -0.035;
      perna.add(doShort);
      const listra = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.08, 0.02), amarelo);
      listra.position.set(lado * 0.047, -0.035, 0);
      perna.add(listra);
      // o meião: o tubo branco, a dobra de cima e as duas listras (azul e amarela)
      const meiao = new THREE.Mesh(new THREE.CylinderGeometry(0.039, 0.035, 0.1, 14), branco);
      meiao.position.y = -0.19;
      perna.add(meiao);
      const dobra = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.041, 0.016, 14), branco);
      dobra.position.y = -0.145;
      perna.add(dobra);
      for (const [y, alto, mat] of [[-0.161, 0.008, azul], [-0.173, 0.006, amarelo]] as const) {
        const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.0395, 0.0392, alto, 14), mat);
        faixa.position.y = y;
        perna.add(faixa);
      }
      perna.add(this.fazerTenis(lado));
      this.corpo.add(perna);
      this.pernas.push(perna);
    }

    // -------------------------------------------------------------- o short
    // cintura fina: o short é mais estreito que o peito (o V do atleta)
    const short = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.108, 0.11, 20), marinho);
    short.position.y = 0.305;
    this.corpo.add(short);
    const cos = new THREE.Mesh(new THREE.CylinderGeometry(0.097, 0.098, 0.02, 20, 1, true), toon(BRANCO, { doubleSide: true }));
    cos.position.y = 0.352;
    this.corpo.add(cos);
    // o cordão do cós, as duas pontinhas caindo na frente
    for (const lado of [-1, 1] as const) {
      const cordao = new THREE.Mesh(new THREE.CapsuleGeometry(0.004, 0.026, 3, 6), amarelo);
      cordao.position.set(lado * 0.011, 0.33, 0.098);
      cordao.rotation.z = lado * 0.15;
      this.corpo.add(cordao);
      const listra = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.1, 0.024), amarelo);
      listra.position.set(lado * 0.102, 0.302, 0);
      listra.rotation.z = -lado * 0.1;
      this.corpo.add(listra);
    }

    // ------------------------------------------------------ o tronco e a regata
    // o tronco de pelo fica INTEIRO dentro da regata: maior que ela, ele furava
    // o tecido em bicos (o serrilhado de duas esferas se cortando); quem
    // aparece em cima é o pescoço
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pelo);
    tronco.scale.set(0.11, 0.128, 0.086);
    tronco.position.y = REGATA.y - 0.002;
    this.corpo.add(tronco);
    const regata = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), azul);
    regata.scale.set(REGATA.rx, REGATA.ry, REGATA.rz);
    regata.position.y = REGATA.y;
    this.corpo.add(regata);
    // o peito branco de raposa aparecendo na gola, e o pescoço
    const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.054, 0.09, 14), pelo);
    pescoco.position.y = 0.6;
    this.corpo.add(pescoco);
    const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), claro);
    peito.scale.set(0.048, 0.04, 0.03);
    peito.position.set(0, 0.578, 0.034);
    this.corpo.add(peito);
    // a gola e as cavas amarelas
    const gola = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.008, 6, 24), amarelo);
    gola.rotation.x = Math.PI / 2;
    gola.scale.set(1, 0.85, 1);
    gola.position.y = 0.575;
    this.corpo.add(gola);
    // a cava abraça a raiz do braço: estreita e comprida, rente a ele (um aro
    // largo e redondo virava uma argola solta do lado do ombro)
    for (const lado of [-1, 1] as const) {
      const cava = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 18), amarelo);
      cava.rotation.y = Math.PI / 2;
      cava.scale.set(1, 1.3, 0.85);
      cava.position.set(lado * 0.113, 0.522, 0);
      this.corpo.add(cava);
    }
    // o NÚMERO 1 no peito: branco com a borda amarela (a letra de time)
    // um tico abaixo do meio do peito: mais alto, o apito tapava o número
    const n1 = naRegata(0, REGATA.y - 0.04);
    colar(letra('1', 0.088, AMARELO, true), this.corpo, n1.x, n1.y, n1.z, 0, 0, 1);
    const n1b = naRegata(0, REGATA.y - 0.04, 0.006);
    colar(letra('1', 0.077, BRANCO), this.corpo, n1b.x, n1b.y, n1b.z, 0, 0, 1);
    // "GATITOS" em arco no alto do peito, e "FLYNN" e o 1 nas costas
    const raioEm = (y: number): number => REGATA.rx * Math.sqrt(1 - ((y - REGATA.y) / REGATA.ry) ** 2);
    const yPeito = REGATA.y + 0.05;
    textoEmArco(this.corpo, 'GATITOS', {
      raio: raioEm(yPeito) * 1.02, achata: REGATA.rz / REGATA.rx, y: yPeito,
      passo: 0.17, curva: 0.0006, inclina: 0.05, alto: 0.02, cor: AMARELO,
    });
    const yNome = REGATA.y + 0.052;
    textoEmArco(this.corpo, 'FLYNN', {
      raio: raioEm(yNome) * 1.02, achata: REGATA.rz / REGATA.rx, y: yNome, costas: true,
      passo: 0.22, curva: 0.0007, inclina: 0.05, alto: 0.027, cor: BRANCO, contorno: AMARELO,
    });
    const c1 = naRegata(0, REGATA.y - 0.025, 0.004, true);
    colar(letra('1', 0.088, AMARELO, true), this.corpo, c1.x, c1.y, c1.z, 0, 0, -1);
    const c1b = naRegata(0, REGATA.y - 0.025, 0.006, true);
    colar(letra('1', 0.077, BRANCO), this.corpo, c1b.x, c1b.y, c1b.z, 0, 0, -1);
    // o PIN de estrela amarela, no peito esquerdo dele
    const pin = naRegata(-0.066, REGATA.y + 0.02, 0.002);
    const estrelinha = estrela(0.012, AMARELO);
    colar(estrelinha, this.corpo, pin.x, pin.y, pin.z, pin.x / REGATA.rx ** 2, (pin.y - REGATA.y) / REGATA.ry ** 2, pin.z / REGATA.rz ** 2);

    this.corpo.add(this.fazerApito());
    this.corpo.add(this.fazerRabo());

    // ------------------------------------------------------------ os braços
    /**
     * Pivô no OMBRO. De cima para baixo: o braço de pelo laranja (a regata é
     * sem manga), a MEIA marrom do antebraço, a munhequeira e a pata. A
     * braçadeira de capitão vai no braço ESQUERDO (o `x` negativo), com o "C"
     * virado para fora.
     */
    for (const lado of [-1, 1] as const) {
      const braco = new THREE.Group();
      // o ombro um tico mais largo que a cintura: o V do atleta
      braco.position.set(lado * 0.13, 0.55, 0);
      const cima = new THREE.Mesh(new THREE.CapsuleGeometry(0.029, 0.1, 4, 10), pelo);
      cima.position.y = -0.07;
      braco.add(cima);
      const antebraco = new THREE.Mesh(new THREE.CapsuleGeometry(0.027, 0.06, 4, 10), escuro);
      antebraco.position.y = -0.148;
      braco.add(antebraco);
      const pata = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), escuro);
      pata.position.y = -0.205;
      braco.add(pata);
      const munhequeira = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.032, 14), branco);
      munhequeira.position.y = -0.168;
      braco.add(munhequeira);
      const listra = new THREE.Mesh(new THREE.CylinderGeometry(0.0335, 0.0335, 0.008, 14), azul);
      listra.position.y = -0.168;
      braco.add(listra);
      if (lado < 0) {
        const bracadeira = new THREE.Mesh(new THREE.CylinderGeometry(0.0325, 0.032, 0.034, 14), amarelo);
        bracadeira.name = 'bracadeira-de-capitao';
        bracadeira.position.y = -0.058;
        braco.add(bracadeira);
        for (const y of [-0.0425, -0.0735]) {
          const filete = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.004, 14), marinho);
          filete.position.y = y;
          braco.add(filete);
        }
        colar(letra('C', 0.024, MARINHO), braco, lado * 0.0335, -0.058, 0, lado, 0, 0);
      }
      braco.rotation.z = lado * 0.14;
      this.corpo.add(braco);
      this.bracos.push(braco);
    }

    this.montarCabeca();
    this.corpo.add(this.cabeca);

    /**
     * ELE CRESCE NO FIM, como as coelhinhas: montado em números de bicho de
     * chão, a escala 1,35 põe a cabeça na altura do ombro da dupla e a ponta
     * das orelhas na da testa — o mais alto da atlética, e ainda um bicho (com
     * 1,25 e o corpo das coelhinhas ele ficava do tamanho delas, e o capitão
     * sumia no refeitório).
     */
    this.corpo.scale.setScalar(1.35);
    this.group.add(this.corpo);
  }

  /**
   * O TÊNIS: o corpo branco (um elipsoide comprido no `z`), a sola creme um
   * tico maior por baixo, a faixa coral dos dois lados, o bico, a lingueta e
   * três passadas de cadarço amarelo em cima. No referencial da perna (pivô
   * no quadril): a sola encosta no chão em `y = -0,29`.
   */
  private fazerTenis(lado: -1 | 1): THREE.Group {
    const g = new THREE.Group();
    const Z = 0.028;
    // `Y` é o centro do corpo do tênis: a sola fica 0,022 abaixo, e o fundo dela no chão
    const Y = -0.252;
    const corpo = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), toon(BRANCO));
    corpo.scale.set(0.048, 0.034, 0.082);
    corpo.position.set(0, Y, Z);
    g.add(corpo);
    const sola = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), toon(P.gatitosCreme));
    sola.scale.set(0.052, 0.016, 0.087);
    sola.position.set(0, Y - 0.022, Z);
    g.add(sola);
    const faixa = toon(P.flynnTenisFaixa);
    for (const s of [-1, 1] as const) {
      const risco = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.011, 0.066), faixa);
      risco.position.set(s * 0.046, Y - 0.002, Z - 0.004);
      risco.rotation.x = 0.25;
      g.add(risco);
    }
    // o bico, um tico mais claro, e a lingueta azul atrás do cadarço
    const bico = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.gatitosCreme));
    bico.scale.set(0.04, 0.022, 0.028);
    bico.position.set(0, Y - 0.01, Z + 0.062);
    g.add(bico);
    const lingueta = new THREE.Mesh(new THREE.BoxGeometry(0.027, 0.022, 0.012), toon(AZUL));
    lingueta.position.set(0, Y + 0.033, Z - 0.012);
    lingueta.rotation.x = -0.4;
    g.add(lingueta);
    const cadarco = toon(AMARELO);
    for (const [dz, dy] of [[0.0, 0.034], [0.021, 0.031], [0.04, 0.025]] as const) {
      const passada = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.005, 0.006), cadarco);
      passada.position.set(0, Y + dy, Z + dz);
      g.add(passada);
    }
    void lado;
    return g;
  }

  /**
   * O APITO no cordão vermelho: o cordão é um tubo fechado que passa por trás
   * do pescoço e desce pelo peito COLADO na casca da regata (os pontos saem
   * de `naRegata`, senão ele atravessa o tecido ou voa); o apito pendurado
   * no ponto mais baixo, com o bocal virado para o lado.
   */
  private fazerApito(): THREE.Group {
    const g = new THREE.Group();
    const frente = (x: number, y: number): THREE.Vector3 => naRegata(x, y, 0.006);
    const pontos = [
      new THREE.Vector3(0, 0.622, -0.046),
      new THREE.Vector3(-0.052, 0.612, -0.01),
      frente(-0.05, 0.56),
      frente(-0.025, 0.512),
      frente(0, 0.494),
      frente(0.025, 0.512),
      frente(0.05, 0.56),
      new THREE.Vector3(0.052, 0.612, -0.01),
    ];
    const curva = new THREE.CatmullRomCurve3(pontos, true);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 48, 0.0042, 6, true), toon(P.flynnCordao)));
    const prata = toon(P.flynnApito);
    const onde = naRegata(0, 0.48, 0.016);
    const apito = new THREE.Group();
    apito.name = 'apito';
    apito.position.copy(onde);
    const camara = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 10), prata);
    camara.position.x = 0.008;
    apito.add(camara);
    const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.0105, 0.0105, 0.032, 12), prata);
    corpo.rotation.z = Math.PI / 2;
    corpo.position.x = -0.008;
    apito.add(corpo);
    const bocal = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.008, 0.012), prata);
    bocal.position.x = -0.03;
    apito.add(bocal);
    const furinho = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.004, 0.004), toon(P.flynnNariz));
    furinho.position.set(0.004, 0.011, 0.006);
    apito.add(furinho);
    const argola = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0018, 5, 10), prata);
    argola.position.set(0.006, 0.017, 0);
    apito.add(argola);
    g.add(apito);
    return g;
  }

  /**
   * O RABO, a marca da raposa: cinco gomos encadeados (cada um filho do
   * anterior), saindo de baixo do short para TRÁS e curvando para CIMA, cada
   * vez mais gordo, e a PONTA BRANCA. O primeiro gomo aponta para trás e um
   * pouco para baixo; os seguintes dobram para cima (`rotation.x` positivo
   * leva o `+Y` local para o `+Z` local, e a cadeia vira um "J" deitado).
   */
  private fazerRabo(): THREE.Group {
    const base = new THREE.Group();
    base.position.set(0, 0.3, -0.09);
    const pelo = toon(P.flynnPelo);
    const claro = toon(P.flynnPeloClaro);
    const GOMOS = [
      { comp: 0.055, larg: 0.038, dobra: -1.95 },
      { comp: 0.07, larg: 0.055, dobra: 0.45 },
      { comp: 0.075, larg: 0.068, dobra: 0.42 },
      { comp: 0.075, larg: 0.072, dobra: 0.42 },
      { comp: 0.07, larg: 0.064, dobra: 0.35 },
    ];
    let pai: THREE.Object3D = base;
    GOMOS.forEach((s, i) => {
      const gomo = new THREE.Group();
      gomo.rotation.x = s.dobra;
      if (i > 0) gomo.position.y = GOMOS[i - 1].comp;
      const ponta = i === GOMOS.length - 1;
      const bola = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), ponta ? claro : pelo);
      bola.scale.set(s.larg, s.comp * 0.85, s.larg * 0.95);
      bola.position.y = s.comp * 0.5;
      gomo.add(bola);
      if (ponta) {
        // a pontinha final, mais fina, branca
        const bico = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), claro);
        bico.scale.set(s.larg * 0.6, s.comp * 0.55, s.larg * 0.6);
        bico.position.y = s.comp * 1.05;
        gomo.add(bico);
      }
      pai.add(gomo);
      pai = gomo;
      this.gomosDoRabo.push(gomo);
    });
    return base;
  }

  private montarCabeca(): void {
    const pelo = toon(P.flynnPelo);
    const claro = toon(P.flynnPeloClaro);
    const escuro = toon(P.flynnPeloEscuro);
    const preto = toon(P.flynnNariz);

    this.cabeca.name = 'cabeca-do-flynn';
    this.cabeca.position.set(0, 0.73, 0.008);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), pelo);
    cranio.scale.set(0.155, 0.135, 0.14);
    this.cabeca.add(cranio);

    // ------------------------------------------- o rosto: bochechas e focinho
    /**
     * A MÁSCARA BRANCA da raposa: as duas bochechas creme embaixo dos olhos,
     * cada uma com o TUFO apontando para fora e para baixo (o desenho de
     * raposa de livro infantil), e o focinho comprido entre elas.
     */
    for (const lado of [-1, 1] as const) {
      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), claro);
      bochecha.scale.set(0.075, 0.058, 0.062);
      bochecha.position.set(lado * 0.075, -0.05, 0.07);
      this.cabeca.add(bochecha);
      const tufo = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.075, 8), claro);
      tufo.position.set(lado * 0.148, -0.06, 0.03);
      tufo.rotation.z = -lado * (Math.PI / 2 + 0.45);
      this.cabeca.add(tufo);
      const rosado = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), toon(P.flynnBochecha));
      rosado.scale.set(0.026, 0.017, 0.012);
      rosado.position.set(lado * 0.098, -0.03, 0.112);
      this.cabeca.add(rosado);
    }
    const focinho = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), claro);
    focinho.scale.set(0.058, 0.045, 0.078);
    focinho.position.set(0, -0.05, 0.108);
    this.cabeca.add(focinho);
    // a ponte do focinho, laranja, descendo da testa até o nariz
    const ponte = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pelo);
    ponte.scale.set(0.034, 0.03, 0.07);
    ponte.position.set(0, -0.02, 0.115);
    this.cabeca.add(ponte);
    const nariz = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), preto);
    nariz.scale.set(0.022, 0.017, 0.017);
    nariz.position.set(0, -0.034, 0.184);
    this.cabeca.add(nariz);
    const brilhoDoNariz = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 6), claro);
    brilhoDoNariz.position.set(-0.007, -0.027, 0.199);
    this.cabeca.add(brilhoDoNariz);
    // o SORRISÃO de boca aberta (ele está sempre feliz de ver alguém) e a língua
    const boca = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 12, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), preto,
    );
    boca.scale.set(1.25, 1, 0.5);
    boca.position.set(0, -0.07, 0.158);
    this.cabeca.add(boca);
    const lingua = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toon(P.lunaNariz));
    lingua.scale.set(1.4, 0.7, 0.6);
    lingua.position.set(0, -0.087, 0.163);
    this.cabeca.add(lingua);

    // ------------------------------------------------------------- os olhos
    /**
     * Grandes e ÂMBAR, cada um num grupo com pivô no centro (a piscada é o
     * `scale.y`): o branco, a íris âmbar, a pupila e dois brilhos. Em cima, a
     * SOBRANCELHA em arco, alta — o olhar de quem acha tudo ótimo.
     */
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Group();
      olho.position.set(lado * 0.06, 0.012, 0.112);
      const branco = new THREE.Mesh(new THREE.SphereGeometry(0.033, 12, 10), claro);
      olho.add(branco);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 10), toon(P.flynnOlho));
      iris.position.set(lado * 0.002, -0.001, 0.019);
      olho.add(iris);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), toon(P.flynnPupila));
      pupila.position.set(lado * 0.002, -0.002, 0.032);
      olho.add(pupila);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 6, 6), claro);
      brilho.position.set(lado * 0.007, 0.011, 0.045);
      olho.add(brilho);
      const brilhinho = new THREE.Mesh(new THREE.SphereGeometry(0.0038, 6, 6), claro);
      brilhinho.position.set(-lado * 0.007, -0.009, 0.046);
      olho.add(brilhinho);
      this.cabeca.add(olho);
      this.olhos.push(olho);
      const sobrancelha = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.0042, 5, 12, Math.PI * 0.6), escuro);
      sobrancelha.rotation.z = Math.PI * 0.2;
      sobrancelha.position.set(lado * 0.062, 0.034, 0.124);
      this.cabeca.add(sobrancelha);
    }

    // ------------------------------------------------------------ as orelhas
    /**
     * Pivô na BASE, no alto do crânio, inclinadas um tico para fora (o sinal de
     * sempre: a esquerda nasce em `x` negativo, então para fora é
     * `-lado · ângulo`). Cada orelha: o triângulo laranja (um cone achatado), o
     * miolo creme na frente e a PONTA MARROM.
     */
    for (const lado of [-1, 1] as const) {
      const orelha = new THREE.Group();
      orelha.position.set(lado * 0.082, 0.1, -0.012);
      orelha.rotation.z = -lado * 0.3;
      const fora = new THREE.Mesh(new THREE.ConeGeometry(0.062, 0.16, 14), pelo);
      fora.scale.z = 0.5;
      fora.position.y = 0.07;
      orelha.add(fora);
      const dentro = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.11, 12), toon(P.flynnOrelhaDentro));
      dentro.scale.z = 0.35;
      dentro.position.set(0, 0.055, 0.017);
      orelha.add(dentro);
      const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.031, 0.058, 12), escuro);
      ponta.scale.z = 0.55;
      ponta.position.y = 0.126;
      orelha.add(ponta);
      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }

    this.cabeca.add(this.fazerBandana());
  }

  /**
   * A BANDANA DOS GATITOS, amarrada na testa: uma faixa que acompanha o
   * crânio (um tronco de cone aberto, mais estreito em cima — o crânio afina
   * — e 4% por fora dele, senão o pelo atravessa), as duas listras amarelas
   * nas beiradas, o EMBLEMA dos Gatitos na frente (o círculo com o G e as
   * orelhinhas de gato) e o NÓ atrás, com as duas pontas caindo para trás.
   */
  private fazerBandana(): THREE.Group {
    const g = new THREE.Group();
    g.name = 'bandana-dos-gatitos';
    const Y = 0.078;
    const ALTO = 0.034;
    const R = { x: 0.155, z: 0.14, y: 0.135 };
    const raioEm = (y: number): number => Math.sqrt(Math.max(0, 1 - (y / R.y) ** 2));
    const cima = raioEm(Y + ALTO / 2);
    const baixo = raioEm(Y - ALTO / 2);
    const faixa = new THREE.Mesh(
      new THREE.CylinderGeometry(cima * 1.05, baixo * 1.05, ALTO, 36, 1, true), toon(AZUL, { doubleSide: true }),
    );
    faixa.scale.set(R.x, 1, R.z);
    faixa.position.y = Y;
    g.add(faixa);
    for (const [y, f] of [[Y + ALTO / 2 - 0.003, cima], [Y - ALTO / 2 + 0.003, baixo]] as const) {
      const listra = new THREE.Mesh(
        new THREE.CylinderGeometry(f * 1.065, f * 1.065, 0.006, 36, 1, true), toon(AMARELO, { doubleSide: true }),
      );
      listra.scale.set(R.x, 1, R.z);
      listra.position.y = y;
      g.add(listra);
    }
    // o emblema na frente da testa
    const emblema = emblemaDosGatitos(0.024);
    emblema.position.set(0, Y - 0.002, R.z * raioEm(Y) * 1.05 - 0.001);
    g.add(emblema);
    // o nó atrás: duas bolotas, e as duas pontas caindo para trás e para fora
    const azul = toon(AZUL, { doubleSide: true });
    const zNo = -R.z * raioEm(Y) * 1.05 - 0.004;
    for (const lado of [-1, 1] as const) {
      const bolota = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 8), azul);
      bolota.scale.set(1, 0.85, 0.7);
      bolota.position.set(lado * 0.012, Y, zNo);
      g.add(bolota);
      const pivo = new THREE.Group();
      pivo.position.set(lado * 0.008, Y - 0.006, zNo);
      // `rotation.x` positivo leva o `-Y` (para onde a ponta cai) para o `-Z`: para trás
      pivo.rotation.set(0.55, 0, -lado * 0.35);
      const ponta = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.075, 0.005), azul);
      ponta.position.y = -0.037;
      pivo.add(ponta);
      const bico = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.008, 0.0055), toon(AMARELO));
      bico.position.y = -0.071;
      pivo.add(bico);
      g.add(pivo);
      this.pontasDaBandana.push(pivo);
    }
    return g;
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, carinho, fase }: PoseDoBicho): void {
    this.relogio += dt;
    const t = this.relogio;
    this.acenando = Math.max(0, this.acenando - dt);
    this.comemorando = Math.max(0, this.comemorando - dt);
    const suave = Math.min(1, dt * 7);
    this.misturaAceno += ((this.acenando > 0 ? 1 : 0) - this.misturaAceno) * suave;
    this.misturaFesta += ((this.comemorando > 0 ? 1 : 0) - this.misturaFesta) * suave;
    const aceno = this.misturaAceno;
    const festa = this.misturaFesta;

    // ------------------------------------------------ as pernas e o pulinho
    const passo = andando ? Math.sin(fase * 10) : 0;
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      perna.rotation.x += (passo * 0.6 * lado - perna.rotation.x) * Math.min(1, dt * 12);
    }
    this.puloAgora = festa * Math.abs(Math.sin(t * 8)) * 0.07;
    const respiro = Math.sin(t * 1.8) * 0.006;
    const doPasso = andando ? Math.abs(Math.sin(fase * 10)) * 0.018 : 0;
    this.corpo.position.y = respiro + doPasso + this.puloAgora;

    // ------------------------------------------------------------ os braços
    /**
     * Três destinos misturados: o balanço da caminhada (oposto às pernas), o
     * ACENO (a direita bem no alto, abanando) e a COMEMORAÇÃO (os dois punhos
     * para cima, sacudindo). Abrir para fora é `lado · ângulo` em `rotation.z`.
     */
    for (const [i, braco] of this.bracos.entries()) {
      const lado = i === 0 ? -1 : 1;
      let z = lado * 0.16;
      let x = -passo * 0.5 * lado;
      if (lado > 0 && aceno > 0) {
        const alto = lado * (Math.PI - 0.45) + Math.sin(t * 13) * 0.3;
        z += (alto - z) * aceno;
        x *= 1 - aceno;
      }
      if (festa > 0) {
        const alto = lado * (2.65 + Math.sin(t * 16 + i) * 0.12);
        z += (alto - z) * festa;
        x += (-0.2 - x) * festa;
      }
      braco.rotation.z += (z - braco.rotation.z) * Math.min(1, dt * 12);
      braco.rotation.x += (x - braco.rotation.x) * Math.min(1, dt * 12);
    }

    // -------------------------------------------------------------- a cabeça
    // inclinada de leve, simpática; no aceno, inclina mais para o lado de quem chega
    this.cabeca.rotation.z = Math.sin(t * 1.3) * 0.04 + aceno * 0.12 - festa * 0.05 * Math.sin(t * 8);
    this.cabeca.rotation.x = Math.sin(t * 0.9) * 0.02 - festa * 0.08;

    // ---------------------------------------------------------------- o rabo
    // abana sempre (é uma raposa feliz), mais rápido andando, no carinho e na festa
    const animo = Math.min(1, (andando ? 0.5 : 0) + carinho + festa + aceno * 0.6);
    const vel = 3.2 + animo * 6;
    const amp = 0.14 + animo * 0.2;
    for (const [i, gomo] of this.gomosDoRabo.entries()) {
      gomo.rotation.z = Math.sin(t * vel - i * 0.7) * amp * (0.5 + i * 0.25);
    }

    // ------------------------------------------- as pontas da bandana balançam
    for (const [i, ponta] of this.pontasDaBandana.entries()) {
      const lado = i === 0 ? -1 : 1;
      ponta.rotation.x = 0.55 + Math.sin(t * 2.6 + i) * 0.08 + (andando ? Math.abs(Math.sin(fase * 10)) * 0.25 : 0) + festa * 0.3;
      ponta.rotation.z = -lado * 0.35 + Math.sin(t * 2.1 + i * 2) * 0.06;
    }

    // ------------------------------------------- as orelhas: uma mexidinha
    this.proximaOrelhada -= dt;
    if (this.proximaOrelhada <= 0) {
      this.orelhada = 0;
      this.proximaOrelhada = 3 + this.sorte() * 5;
    }
    let mexe = 0;
    if (this.orelhada >= 0) {
      this.orelhada += dt;
      mexe = Math.sin(Math.min(1, this.orelhada / 0.35) * Math.PI) * 0.25;
      if (this.orelhada > 0.35) this.orelhada = -1;
    }
    for (const [i, orelha] of this.orelhas.entries()) {
      const lado = i === 0 ? -1 : 1;
      // no carinho e na festa, elas abrem um tico; a mexidinha é só na direita
      orelha.rotation.z = -lado * (0.3 + (carinho + festa) * 0.12) - (lado > 0 ? mexe : 0);
    }

    // ------------------------------------------------------------- a piscada
    this.proximaPiscada -= dt;
    let abertura = 1;
    if (this.proximaPiscada < 0.14) abertura = Math.max(0.08, Math.abs(this.proximaPiscada - 0.07) / 0.07);
    if (this.proximaPiscada <= 0) this.proximaPiscada = 2.5 + this.sorte() * 3;
    // contente (carinho, festa), ele sorri de olho apertadinho
    abertura = Math.min(abertura, 1 - (carinho * 0.55 + festa * 0.4));
    for (const olho of this.olhos) olho.scale.y = abertura;
  }
}
