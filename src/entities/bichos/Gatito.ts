import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O GATITO, o professor da Escola do Gatito.
 *
 * Na vida real ele é uma pelúcia da casa do Ari e do Renan — é fingindo ser
 * ele que o Renan dá aula de português para o Ari. No jogo ele NÃO é pelúcia
 * (pedido do Renan): é a representação dele, um gato de verdade que anda pela
 * escola. O que vem da pelúcia é a CARA, e é ela que tem que bater com a foto.
 *
 * O cérebro (passear, contornar móvel, parar, sentar, miar, carinho) é todo do
 * `Bicho`. Aqui mora o corpo, a pose, os oculinhos da aula e o SIX SEVEN.
 *
 * O QUE FAZ ELE SER O GATITO, e não o Pelusa (os dois são gatos creme):
 *
 * 1. **A MEIA CARA CARAMELO.** A cabeça são duas calotas de esfera costuradas
 *    num meridiano, uma creme e uma caramelo — nenhuma sobrepõe a outra, então
 *    não há face coplanar, e é exatamente como a pelúcia é costurada. A
 *    costura passa um pouco para o lado caramelo do nariz: o nariz fica no
 *    creme, o olho daquele lado fica no caramelo.
 * 2. **AS ORELHAS DE DUAS CORES**: a do lado caramelo é caramelo, a do outro é
 *    chocolate.
 * 3. **A LINGUINHA ROSA PARA FORA**, embaixo da boca em "w".
 * 4. **A CABEÇA ENORME**, mais larga que o corpo (a pelúcia é assim).
 *
 * OS LADOS, dito do jeito que não erra: olhando o Gatito DE FRENTE, a metade
 * caramelo fica à DIREITA de quem olha. Na peça isso é o `+X` local — com ele
 * de frente para a câmera, o `+X` dele aparece do lado direito da tela. O
 * `scripts/escola.mjs` mede isso em vez de confiar na foto.
 *
 * É um pouco maior que o Pelusa (pedido do Renan): ~1,4 vez.
 */

/** a cabeça: raio e o achatado da pelúcia (mais larga que alta) */
const CABECA = { r: 0.17, sx: 1.08, sy: 0.92, sz: 0.95 };
/** o meridiano da costura: um pouco para o lado caramelo (+X) do nariz */
const COSTURA = Math.PI / 2 + Math.atan(0.2);
/** o tronco (elipsoide) */
const TRONCO = { y: 0.23, sx: 0.15, sy: 0.125, sz: 0.26 };
/** o pivô do quadril: é em volta dele que ele senta e fica em pé no six seven */
const QUADRIL = { y: 0.14, z: -0.16 };
/** a altura do ombro/quadril onde as patas se prendem */
const OMBRO = 0.19;
/** quanto dura o six seven, em segundos de jogo */
const DURA_SIX_SEVEN = 2.8;

export class Gatito extends Bicho {
  /** o quadril: girar ele levanta a frente do corpo em volta das patas de trás */
  private readonly postura = new THREE.Group();
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly rabo = new THREE.Group();
  /** frente-esquerda, frente-direita, trás-esquerda, trás-direita (em -X/+X) */
  private readonly patas: THREE.Group[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly gomosDoRabo: THREE.Group[] = [];
  private readonly oculos = new THREE.Group();

  /** quanto falta do six seven; > 0 enquanto ele está fazendo */
  private sixSevenFalta = 0;
  /** o six seven tirou ele do passeio, e é ele quem devolve no fim */
  private sixSevenDevolve = false;
  /** 0 a 1: o quanto ele já está de pé para o six seven (entra e sai sem estalo) */
  private sixSevenPeso = 0;

  /** a cena liga: é aqui que ela mostra o "Six seven!" na tela */
  aoFazerSixSeven: (() => void) | null = null;

  constructor(area: AreaDoBicho) {
    super(area, {
      // anda um pouco mais que o Pelusa: professor tem sempre para onde ir
      velocidade: 0.8,
      descansoMin: 1.6,
      descansoMax: 4.2,
      chanceDeSentar: 0.3,
      somCadaMin: 12,
      somCadaMax: 24,
      semente: 20260928,
    });
    this.montar();
    this.prontoParaAparecer('gatito');
  }

  // ------------------------------------------------------------ comandos

  /**
   * O SIX SEVEN: ele senta nas patas de trás e balança as duas da frente, uma
   * sobe enquanto a outra desce — o meme que o Renan faz quando é o Gatito.
   *
   * Passeando sozinho, ele sai do passeio enquanto faz (senão o cérebro
   * sortearia um destino no meio do gesto) e volta no fim. Se a cena já está
   * no comando (a ronda da escola), ele não mexe em nada disso — quem manda é
   * ela, e a cena só pede o gesto com ele PARADO. Chamar de novo só renova.
   */
  sixSeven(): void {
    if (this.sixSevenFalta <= 0 && !this.deServico) {
      this.entrarEmServico();
      this.sixSevenDevolve = true;
    }
    this.sixSevenFalta = DURA_SIX_SEVEN;
    this.aoFazerSixSeven?.();
  }

  get fazendoSixSeven(): boolean {
    return this.sixSevenFalta > 0;
  }

  /** Os oculinhos de professor: só na hora da aula (o Renan pediu assim). */
  usarOculos(sim: boolean): void {
    this.oculos.visible = sim;
  }

  // ----------------------------------------------------------------- corpo

  /**
   * Um ponto NA SUPERFÍCIE da cabeça (o elipsoide achatado), na direção dada,
   * mais uma folga para fora. É o que cola olho, nariz, boca e bigode na cara
   * em vez de deixá-los boiando ou enterrados.
   */
  private naCabeca(dx: number, dy: number, dz: number, folga = 0): { p: THREE.Vector3; n: THREE.Vector3 } {
    const u = new THREE.Vector3(dx, dy, dz).normalize();
    const a = CABECA.r * CABECA.sx;
    const b = CABECA.r * CABECA.sy;
    const c = CABECA.r * CABECA.sz;
    const t = 1 / Math.sqrt((u.x / a) ** 2 + (u.y / b) ** 2 + (u.z / c) ** 2);
    // a normal do elipsoide nesse ponto (o gradiente), para virar a peça
    const p = u.clone().multiplyScalar(t);
    const n = new THREE.Vector3(p.x / (a * a), p.y / (b * b), p.z / (c * c)).normalize();
    p.addScaledVector(n, folga);
    return { p, n };
  }

  /** Gira a malha para o `+Z` dela apontar para `n` (a frente da peça encosta na cara). */
  private virarPara(m: THREE.Object3D, n: THREE.Vector3): void {
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  }

  private montar(): void {
    const creme = toon(P.gatitoCreme);
    const caramelo = toon(P.gatitoCaramelo);
    const chocolate = toon(P.gatitoChocolate);
    const bordado = toon(P.gatitoBordado);

    // o quadril é o pai de tudo: girar ele é sentar
    this.postura.position.set(0, QUADRIL.y, QUADRIL.z);
    this.corpo.position.set(0, -QUADRIL.y, -QUADRIL.z);
    this.postura.add(this.corpo);

    // ------------------------------------------------------------- tronco
    // Elipsoide, e não cápsula girada (a lição do Pelusa): o comprimento mora
    // no Z, que é para onde ele olha.
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), creme);
    tronco.scale.set(TRONCO.sx, TRONCO.sy, TRONCO.sz);
    tronco.position.y = TRONCO.y;
    this.corpo.add(tronco);

    /**
     * AS MANCHAS DO CORPO SÃO RETALHOS de uma casca um tico maior que o
     * tronco — só um pedaço dela, e não um segundo corpo inteiro por cima (que
     * lia como cobertor mal posto no Pelusa).
     *
     * Na `SphereGeometry`, `phi = PI/2` é a frente (`+Z`), `phi = PI` é o `+X`
     * (o lado caramelo), `phi = 0` é o `-X` e `3PI/2` é o traseiro. `theta` vai
     * do alto (0) para baixo (PI).
     *
     * Cada lado tem a sua cor, como na pelúcia: o lado da cara caramelo tem a
     * mancha caramelo no OMBRO; o lado da orelha chocolate tem a mancha
     * chocolate no LOMBO, perto do quadril.
     */
    const retalho = (cor: THREE.Material, phi0: number, phiLen: number, th0: number, thLen: number): void => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12, phi0, phiLen, th0, thLen), cor);
      m.scale.set(TRONCO.sx * 1.03, TRONCO.sy * 1.03, TRONCO.sz * 1.03);
      m.position.y = TRONCO.y;
      this.corpo.add(m);
    };
    retalho(caramelo, 1.85, 1.15, Math.PI * 0.26, Math.PI * 0.46);
    retalho(chocolate, 4.95, 1.55, Math.PI * 0.1, Math.PI * 0.46);

    // ------------------------------------------------------------- cabeça
    const cranio = new THREE.Group();
    cranio.scale.set(CABECA.sx, CABECA.sy, CABECA.sz);
    this.cabeca.add(cranio);
    // as duas metades costuradas: a caramelo em volta do +X, a creme no resto
    cranio.add(new THREE.Mesh(new THREE.SphereGeometry(CABECA.r, 22, 16, COSTURA, Math.PI), caramelo));
    cranio.add(new THREE.Mesh(new THREE.SphereGeometry(CABECA.r, 22, 16, COSTURA + Math.PI, Math.PI), creme));

    // olhos: pontinhos pretos, bem afastados — achatados contra a cara, como
    // bordado. Achatar no Z da própria peça e virar ela pela normal da cabeça
    // é o que deixa o pontinho rente à curva.
    for (const lado of [-1, 1]) {
      const { p, n } = this.naCabeca(lado * 0.46, 0.06, 0.88, -0.004);
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.021, 10, 8), bordado);
      olho.scale.set(1, 1.08, 0.42);
      olho.position.copy(p);
      this.virarPara(olho, n);
      this.olhos.push(olho);
      this.cabeca.add(olho);
    }

    // nariz: pretinho, mais largo que alto
    {
      const { p, n } = this.naCabeca(0, -0.1, 1, -0.003);
      const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.021, 10, 8), bordado);
      nariz.scale.set(1.25, 0.85, 0.5);
      nariz.position.copy(p);
      this.virarPara(nariz, n);
      this.cabeca.add(nariz);
    }

    // a boca em "w": dois arquinhos de toro abertos para cima, lado a lado
    for (const lado of [-1, 1]) {
      const { p, n } = this.naCabeca(lado * 0.1, -0.3, 1, 0.002);
      const arco = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.0045, 4, 12, Math.PI), bordado);
      const eixo = new THREE.Object3D();
      eixo.position.copy(p);
      this.virarPara(eixo, n);
      // o toro nasce com o arco para cima (∩); meia volta faz o sorriso (∪)
      arco.rotation.z = Math.PI;
      eixo.add(arco);
      this.cabeca.add(eixo);
    }

    // A LINGUINHA: rosa, pendurada embaixo da boca, um tico para fora da cara.
    // Um pouco para o lado creme, como na foto.
    {
      const { p, n } = this.naCabeca(-0.07, -0.47, 1, 0.006);
      const lingua = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), toon(P.gatitoLingua));
      lingua.scale.set(0.95, 1.2, 0.5);
      lingua.position.copy(p);
      this.virarPara(lingua, n);
      this.cabeca.add(lingua);
    }

    // os bigodes: três riscos em cada bochecha, deitados na curva da cara
    for (const lado of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const { p, n } = this.naCabeca(lado * 0.86, -0.12 - i * 0.14, 0.52, 0.002);
        const risco = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.006, 0.006), bordado);
        // a base: o X do risco segue a tangente horizontal da cara, o Z sai dela
        const tangente = new THREE.Vector3(0, 1, 0).cross(n).normalize();
        const cima = new THREE.Vector3().crossVectors(n, tangente).normalize();
        risco.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(tangente, cima, n));
        // o leque: o de cima sobe, o de baixo desce
        risco.rotateZ((1 - i) * 0.16 * lado);
        risco.position.copy(p);
        this.cabeca.add(risco);
      }
    }

    // as orelhas: a do lado caramelo (+X) é caramelo, a outra é chocolate
    for (const lado of [-1, 1]) {
      const orelha = new THREE.Group();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 10), lado > 0 ? caramelo : chocolate);
      cone.scale.set(1, 1, 0.55);
      cone.position.y = 0.04;
      orelha.add(cone);
      const { p } = this.naCabeca(lado * 0.56, 0.8, -0.06, -0.012);
      orelha.position.copy(p);
      // tombam para FORA: com a ponta para cima, é `rotation.z` com o sinal
      // CONTRÁRIO ao do lado que a leva para fora (o topo anda `-h·sen θ`)
      orelha.rotation.z = -lado * 0.34;
      this.orelhas.push(orelha);
      this.cabeca.add(orelha);
    }

    // OS OCULINHOS DE PROFESSOR: dois aros redondos na frente dos olhos, a
    // ponte reta entre eles e as hastes correndo rente à cabeça até a orelha.
    // Escondidos fora da aula.
    {
      const aro = toon(P.gatitoOculos);
      /** uma barrinha reta de `a` até `b`, deitada entre os dois pontos */
      const barra = (a: THREE.Vector3, b: THREE.Vector3): THREE.Mesh => {
        const d = b.clone().sub(a);
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.006, d.length()), aro);
        m.position.copy(a).add(b).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.normalize());
        return m;
      };
      const R = 0.036;
      const centros: THREE.Vector3[] = [];
      for (const lado of [-1, 1]) {
        const { p, n } = this.naCabeca(lado * 0.46, 0.06, 0.88, 0.016);
        const lente = new THREE.Mesh(new THREE.TorusGeometry(R, 0.0055, 6, 18), aro);
        lente.position.copy(p);
        this.virarPara(lente, n);
        this.oculos.add(lente);
        centros.push(p);
        // a haste: da borda de fora do aro até perto da orelha, colada na cara
        const borda = p.clone().add(new THREE.Vector3(lado * R, 0, 0));
        const atras = this.naCabeca(lado * 0.97, 0.1, 0.18, 0.006).p;
        this.oculos.add(barra(borda, atras));
      }
      // a ponte: reta, de uma borda de dentro à outra, na altura dos olhos
      const [esq, dir] = centros;
      this.oculos.add(barra(
        esq.clone().add(new THREE.Vector3(R, 0.004, 0.004)),
        dir.clone().add(new THREE.Vector3(-R, 0.004, 0.004)),
      ));
      this.oculos.userData.peca = 'oculos-do-gatito';
      this.oculos.visible = false;
      this.cabeca.add(this.oculos);
    }

    this.cabeca.position.set(0, 0.39, 0.25);
    this.corpo.add(this.cabeca);

    // -------------------------------------------------------------- patas
    // Cada pata pende de um pivô no ombro (ou no quadril): é girar o pivô que
    // faz o passo e o six seven. A cápsula tem altura total `comp + 2r`
    // (0,19), e o centro dela a meio caminho do ombro até o chão — encosta.
    for (const [lado, frente] of [[-1, 1], [1, 1], [-1, -1], [1, -1]] as const) {
      const pivo = new THREE.Group();
      pivo.position.set(lado * 0.085, OMBRO, frente * 0.15);
      const pata = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 4, 8), creme);
      pata.position.y = -OMBRO / 2;
      pivo.add(pata);
      this.patas.push(pivo);
      this.corpo.add(pivo);
    }

    // --------------------------------------------------------------- rabo
    // Caramelo, fino, subindo em gancho: três gomos encadeados (cada um filho
    // do anterior), o primeiro tombando para trás e os de cima voltando.
    let pai: THREE.Object3D = this.rabo;
    for (let i = 0; i < 3; i++) {
      const gomo = new THREE.Group();
      const malha = new THREE.Mesh(new THREE.CapsuleGeometry(0.03 - i * 0.004, 0.09, 3, 8), caramelo);
      malha.position.y = 0.058;
      gomo.add(malha);
      gomo.position.y = i === 0 ? 0 : 0.114;
      gomo.rotation.x = i === 0 ? -0.62 : 0.5;
      pai.add(gomo);
      pai = gomo;
      this.gomosDoRabo.push(gomo);
    }
    this.rabo.position.set(0, 0.3, -0.24);
    this.corpo.add(this.rabo);

    this.group.add(this.postura);
  }

  // ------------------------------------------------------------------ pose

  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    const suave = Math.min(1, dt * 7);

    // o relógio do six seven
    if (this.sixSevenFalta > 0) {
      this.sixSevenFalta -= dt;
      if (this.sixSevenFalta <= 0 && this.sixSevenDevolve) {
        this.sixSevenDevolve = false;
        this.voltarAPassear();
      }
    }
    const querDePe = this.sixSevenFalta > 0 ? 1 : 0;
    this.sixSevenPeso += (querDePe - this.sixSevenPeso) * Math.min(1, dt * 6);
    const pe = this.sixSevenPeso;

    // --------------------------------------------------------- a postura
    // sentado a frente sobe um pouco; no six seven ele fica quase em pé
    const alvoPostura = (sentado ? -0.32 : 0) * (1 - pe) - 1.05 * pe;
    this.postura.rotation.x += (alvoPostura - this.postura.rotation.x) * suave;
    // em pé, o giro em volta do quadril enfiava 2 cm do traseiro no chão
    // (medido): o quadril sobe junto com o gesto
    this.postura.position.y = QUADRIL.y + 0.04 * pe;

    // ------------------------------------------------------------ as patas
    if (andando && pe < 0.05) {
      const t = fase * 9;
      const s = Math.sin(t) * 0.55;
      // em diagonal: frente-esquerda com trás-direita
      this.patas[0].rotation.x = s;
      this.patas[3].rotation.x = s;
      this.patas[1].rotation.x = -s;
      this.patas[2].rotation.x = -s;
      this.corpo.position.y = -QUADRIL.y + Math.abs(Math.sin(t)) * 0.014;
      this.corpo.rotation.z = Math.sin(t) * 0.03;
    } else {
      /**
       * O SIX SEVEN nas patas da frente. A postura já girou o corpo em
       * `-1,05`, e a soma dos dois giros é o que aponta a pata no mundo: com
       * `-PI/2` na soma ela fica deitada para a frente, na altura do peito. Em
       * volta disso uma sobe enquanto a outra desce — a balança do meme.
       *
       * As de trás dobram para a frente, e é isso que faz ler "sentado nas
       * patas de trás" em vez de "tombado para trás".
       */
      const balanca = Math.sin(fase * 8) * 0.62;
      const frenteBase = (-Math.PI / 2 + 1.05) * pe;
      const alvos = [
        frenteBase + balanca * pe,
        frenteBase - balanca * pe,
        0.75 * pe,
        0.75 * pe,
      ];
      for (let i = 0; i < 4; i++) {
        this.patas[i].rotation.x += (alvos[i] - this.patas[i].rotation.x) * suave;
      }
      this.corpo.rotation.z *= 1 - suave;
      const respira = Math.sin(fase * 1.7) * 0.006;
      this.corpo.position.y += (-QUADRIL.y + respira - this.corpo.position.y) * suave;
    }

    // --------------------------------------------------------------- rabo
    const forte = andando ? 1 : 0.55;
    for (let i = 0; i < this.gomosDoRabo.length; i++) {
      const g = this.gomosDoRabo[i];
      const amp = (0.1 + i * 0.075) * forte + carinho * 0.12 + pe * 0.1;
      g.rotation.z = Math.sin(fase * (2.1 + i * 0.9)) * amp;
      if (i === 0) g.rotation.x = -0.62 + Math.sin(fase * 1.3) * 0.12 * forte;
    }

    // -------------------------------------------------------------- cabeça
    // de pé, a cabeça desfaz o giro do corpo para continuar olhando para a
    // frente (e não para o teto), e balança no ritmo do "six… seven"
    const olhaEmVolta = andando || pe > 0.05 ? 0 : Math.sin(fase * 0.6) * 0.34;
    this.cabeca.rotation.y = olhaEmVolta + Math.sin(fase * 5) * 0.12 * pe;
    this.cabeca.rotation.x = -carinho * 0.22 + Math.sin(fase * 1.9) * 0.02 + 0.95 * pe;

    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const tique = Math.sin(fase * 2.3 + i * 1.7);
      this.orelhas[i].rotation.z = -lado * (0.34 + carinho * 0.12) - tique * 0.05 * lado;
    }

    // no carinho ele fecha os olhinhos de contente
    const abertura = 1 - carinho * 0.85;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.12, abertura) * 1.08;
  }
}
