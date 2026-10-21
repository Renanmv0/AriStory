import * as THREE from 'three';
import { toon } from '../../core/materials';
import { fundir } from '../../world/fundir';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/** um ponto de pesca da garça: onde ela pousa e a caixinha onde ela anda */
export interface PontoDePesca {
  x: number;
  z: number;
  /** para onde ela olha pescando (a água funda) */
  olhando: number;
}

type FazerDaGarca = 'pescando' | 'bote' | 'engolindo' | 'alerta' | 'voando';

const BOTE = 0.7;
const ENGOLIR = 1.3;

/**
 * AS POSES DO PESCOÇO: [corpo, gomo 0, 1, 2, 3, cabeça], em `rotation.x`.
 * Não foram chutadas: cada uma saiu de uma busca que pôs a cabeça e a ponta do
 * bico onde a pose pede (ver o comentário da classe) — o bote leva o bico a
 * 6 cm da água, 57 cm à frente do pé. `scripts/lago.mjs` mede.
 */
type Pose = readonly [number, number, number, number, number, number];
/** espreitando: o S para a frente, a cabeça baixa, o bico mirando a água */
const PESCA: Pose = [-0.18, 0.09, 1.52, -1.55, 1.26, 0.03];
/** o bote: o pescoço inteiro esticado para a frente e para baixo */
const BOTE_ESTICADO: Pose = [0.46, 1.49, 0.66, -0.28, -0.54, -0.32];
/** o recuo antes do bote: o S aperta, como mola */
const RECUO: Pose = [-0.26, -0.05, 1.75, -1.75, 1.3, 0.1];
/** alerta: o pescoço inteiro de pé, a cabeça alta */
const ALERTA: Pose = [-0.58, 0.39, 0.4, 0.09, -0.25, 0.02];
/** engolindo: a cabeça jogada para trás */
const ENGOLE: Pose = [-0.35, -0.29, 0.36, 0.24, 0.36, -1.0];
/** voando: o pescoço recolhido em S apertado, a cabeça junto do ombro */
const VOO: Pose = [0.05, -1.2, 2.4, -1.9, 0.9, -0.1];
/** o comprimento de cada gomo do pescoço */
const GOMO = 0.12;

const misturar = (a: Pose, b: Pose, k: number): number[] => a.map((v, i) => v + (b[i] - v) * k);
/** quanto o pé dela afunda no raso */
const NO_RASO = -0.1;
/** a altura do voo, no meio da travessia */
const ALTO = 2.8;

/**
 * A GARÇA-BRANCA: o bicho mais elegante de qualquer lago de São Paulo.
 *
 * Ela fica parada no RASO, com a água pela canela, o pescoço dobrado em S e o
 * bico apontado para a água — e de repente dá o BOTE: o pescoço inteiro
 * estica de uma vez, o bico entra na água (a cena ganha a marola por
 * `aoBicar`) e às vezes volta com um peixinho prateado atravessado, que ela
 * engole jogando a cabeça para trás.
 *
 * QUANDO A DUPLA CHEGA PERTO ela estica o pescoço (alerta) e, se chegarem
 * mais, VOA: agacha, abre as asas grandes, sobe num arco por cima do lago com
 * batidas lentas e fundas, plana e pousa do outro lado com as pernas para a
 * frente. O voo é um `irPara` do `Bicho` (reto, de serviço), e a altura e as
 * asas saem do quanto falta para chegar — o cérebro de passear é o de sempre.
 *
 * O PESCOÇO É UMA CORRENTE DE GOMOS, cada um filho do anterior: o S é cada
 * gomo dobrando para um lado, e o bote é todos esticando juntos. Lembrete de
 * sinal: `rotation.x` POSITIVO leva o `+Y` local para a frente (`+Z`).
 */
export class Garca extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly gomos: THREE.Group[] = [];
  private readonly cabeca = new THREE.Group();
  private readonly pernas: THREE.Group[] = [];
  private readonly joelhos: THREE.Group[] = [];
  private readonly asasDobradas: THREE.Mesh[] = [];
  private readonly ombros: THREE.Group[] = [];
  private readonly cotovelos: THREE.Group[] = [];
  private readonly peixinho: THREE.Mesh;
  private fazendo: FazerDaGarca = 'pescando';
  private tEstado = 0;
  private ateBote = 4;
  private pegou = false;
  /**
   * A MEDIDA DO BOTE: o ponto mais baixo a que o bico chegou no último bote.
   * O teste lê daqui, e não da foto: o bote dura um piscar, e o navegador do
   * teste mostra poucos quadros por segundo (o mesmo `medidaDoGesto` das
   * coelhinhas).
   */
  bicoMaisBaixo = Infinity;
  /** o voo: de onde saiu e quanto mede a travessia */
  private readonly saida = new THREE.Vector2();
  private travessia = 1;
  private destino: PontoDePesca | null = null;
  /** a cena liga aqui a marola e o som: o bico entrou na água em (x, z) */
  aoBicar: ((x: number, z: number) => void) | null = null;
  /** a cena liga aqui o grasnado e o bater de asas da decolagem */
  aoVoar: (() => void) | null = null;
  /** e aqui a marola do pouso */
  aoPousar: ((x: number, z: number) => void) | null = null;

  constructor(ponto: PontoDePesca, semente = 4242) {
    super(Garca.areaDe(ponto), {
      velocidade: 0.22,
      descansoMin: 4,
      descansoMax: 10,
      chanceDeSentar: 0,
      somCadaMin: 60,
      somCadaMax: 120,
      semente,
    });
    this.peixinho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), toon(P.peixePrata));
    this.montar();
    this.prontoParaAparecer('garca');
    // em pé no raso: a água pela canela (o chão do mundo esconde o pé)
    this.group.position.set(ponto.x, NO_RASO, ponto.z);
    this.group.rotation.y = ponto.olhando;
    this.encarar(ponto.x + Math.sin(ponto.olhando) * 3, ponto.z + Math.cos(ponto.olhando) * 3);
  }

  /** a caixinha de passear em volta de um ponto de pesca: ela dá uns passos e só */
  private static areaDe(p: PontoDePesca): AreaDoBicho {
    return { minX: p.x - 0.7, maxX: p.x + 0.7, minZ: p.z - 0.7, maxZ: p.z + 0.7 };
  }

  get voando(): boolean {
    return this.fazendo === 'voando';
  }

  get fazendoAgora(): FazerDaGarca {
    return this.fazendo;
  }

  /** a altura do bico agora, no mundo (o teste mede o bote por aqui) */
  pontaDoBico(): THREE.Vector3 {
    const p = new THREE.Vector3(0, -0.006, 0.185);
    this.cabeca.updateWorldMatrix(true, false);
    return this.cabeca.localToWorld(p);
  }

  private montar(): void {
    const pena = toon(P.garcaPena);
    const sombra = toon(P.garcaPenaSombra);
    const perna = toon(P.garcaPerna);

    // ------------------------------------------------------------ o corpo
    this.corpo.position.y = 0.6;
    this.corpo.rotation.x = -0.32;
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pena);
    tronco.scale.set(0.095, 0.105, 0.24);
    this.corpo.add(tronco);
    const cauda = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 6), sombra);
    cauda.scale.set(1, 1, 0.35);
    cauda.rotation.x = -Math.PI / 2 - 0.25;
    cauda.position.set(0, -0.02, -0.26);
    this.corpo.add(cauda);
    // as plumas de noivado no lombo, caindo por cima da cauda
    for (const lado of [-1, 0, 1]) {
      const pluma = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.012, 0.3, 4), pena);
      pluma.position.set(lado * 0.025, 0.06, -0.24);
      pluma.rotation.set(-Math.PI / 2 - 0.42, 0, lado * 0.12);
      this.corpo.add(pluma);
    }
    for (const lado of [-1, 1]) {
      const asa = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), sombra);
      asa.scale.set(0.035, 0.08, 0.22);
      asa.position.set(lado * 0.075, 0.02, -0.04);
      // o alto da asa encosta no lombo: a da esquerda (em -X) tomba com `z` negativo
      asa.rotation.z = lado * 0.18;
      this.asasDobradas.push(asa);
      this.corpo.add(asa);

      // a asa ABERTA do voo: ombro → cotovelo, escondida enquanto ela está no chão
      const ombro = new THREE.Group();
      ombro.position.set(lado * 0.07, 0.05, 0.03);
      const interna = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6), pena);
      interna.scale.set(0.24, 0.016, 0.12);
      interna.position.x = lado * 0.22;
      ombro.add(interna);
      const cotovelo = new THREE.Group();
      cotovelo.position.x = lado * 0.42;
      const externa = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6), pena);
      externa.scale.set(0.24, 0.013, 0.1);
      externa.position.set(lado * 0.2, 0, -0.03);
      cotovelo.add(externa);
      // as pontas das rêmiges, um tom mais escuro
      const ponta = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 5), sombra);
      ponta.scale.set(0.1, 0.012, 0.07);
      ponta.position.set(lado * 0.38, 0, -0.05);
      cotovelo.add(ponta);
      ombro.add(cotovelo);
      ombro.visible = false;
      this.ombros.push(ombro);
      this.cotovelos.push(cotovelo);
      this.corpo.add(ombro);
    }

    // ------------------------------------------- o pescoço em gomos e a cabeça
    let pai: THREE.Object3D = this.corpo;
    const raio = [0.034, 0.03, 0.026, 0.023];
    for (let i = 0; i < 4; i++) {
      const gomo = new THREE.Group();
      gomo.position.set(0, i === 0 ? 0.07 : GOMO, i === 0 ? 0.17 : 0);
      const malha = new THREE.Mesh(new THREE.CapsuleGeometry(raio[i], GOMO - 0.015, 3, 8), pena);
      malha.position.y = GOMO / 2;
      gomo.add(malha);
      pai.add(gomo);
      this.gomos.push(gomo);
      pai = gomo;
    }
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 8), pena);
    cranio.scale.set(0.9, 0.9, 1.25);
    this.cabeca.add(cranio);
    // o bico de adaga, comprido e amarelo: é ele que diz "garça" de longe
    const bico = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.17, 7), toon(P.garcaBico));
    bico.rotation.x = Math.PI / 2;
    bico.position.set(0, -0.006, 0.1);
    this.cabeca.add(bico);
    for (const lado of [-1, 1]) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), toon(P.garcaOlho));
      olho.position.set(lado * 0.026, 0.008, 0.02);
      this.cabeca.add(olho);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.0045, 6, 4), toon(P.pragaPupila));
      pupila.position.set(lado * 0.031, 0.009, 0.023);
      this.cabeca.add(pupila);
    }
    // o peixinho atravessado no bico (só aparece quando ela pega)
    this.peixinho.scale.set(0.012, 0.018, 0.05);
    this.peixinho.rotation.y = Math.PI / 2;
    this.peixinho.position.set(0, -0.006, 0.12);
    this.peixinho.visible = false;
    this.cabeca.add(this.peixinho);
    this.cabeca.position.y = GOMO;
    pai.add(this.cabeca);

    // ------------------------------------------------------------ as pernas
    // quadril → (tíbia) → calcanhar (o "joelho" que dobra para TRÁS) → tarso → pé
    for (const lado of [-1, 1]) {
      const quadril = new THREE.Group();
      quadril.position.set(lado * 0.04, 0.54, 0.0);
      const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.22, 6), perna);
      tibia.position.y = -0.11;
      quadril.add(tibia);
      const joelho = new THREE.Group();
      joelho.position.y = -0.22;
      const tarso = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.32, 6), perna);
      tarso.position.y = -0.16;
      joelho.add(tarso);
      // o pé: três dedos para a frente e um para trás
      for (const [a, comp] of [[-0.45, 0.09], [0, 0.1], [0.45, 0.09], [Math.PI, 0.05]] as const) {
        const dedo = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.006, comp, 4), perna);
        dedo.rotation.set(Math.PI / 2, 0, 0);
        dedo.position.set(Math.sin(a) * comp * 0.5, -0.32, Math.cos(a) * comp * 0.5);
        dedo.rotation.y = a;
        joelho.add(dedo);
      }
      quadril.add(joelho);
      this.pernas.push(quadril);
      this.joelhos.push(joelho);
      this.group.add(quadril);
    }
    this.group.add(this.corpo);
    // o que se mexe (ou some) tem nome, e é fronteira do \`fundir\`
    this.corpo.name = 'corpo';
    this.cabeca.name = 'cabeca';
    this.peixinho.name = 'peixinho';
    for (const o of this.gomos) o.name = 'gomo';
    for (const o of this.pernas) o.name = 'quadril';
    for (const o of this.joelhos) o.name = 'joelho';
    for (const o of this.ombros) o.name = 'ombro';
    for (const o of this.cotovelos) o.name = 'cotovelo';
    for (const o of this.asasDobradas) o.name = 'asa-dobrada';
    fundir(this.group);
  }

  /** a dupla está a `dist` daqui: perto, ela fica alerta; mais perto, ela voa */
  sentir(dist: number): void {
    if (this.fazendo === 'voando') return;
    if (dist < 3.4 && this.fazendo !== 'alerta' && this.fazendo !== 'bote') {
      this.fazendo = 'alerta';
      this.tEstado = 0;
      this.peixinho.visible = false;
    } else if (dist > 4.2 && this.fazendo === 'alerta') {
      this.fazendo = 'pescando';
      this.tEstado = 0;
    }
  }

  /** voa para outro ponto de pesca */
  voarPara(ponto: PontoDePesca): void {
    if (this.fazendo === 'voando') return;
    this.fazendo = 'voando';
    this.tEstado = 0;
    this.destino = ponto;
    this.peixinho.visible = false;
    this.saida.set(this.x, this.z);
    this.travessia = Math.max(1, Math.hypot(ponto.x - this.x, ponto.z - this.z));
    for (const o of this.ombros) o.visible = true;
    this.aoVoar?.();
    this.entrarEmServico();
    void this.irPara(ponto.x, ponto.z, 2.4).then(() => this.pousar());
  }

  private pousar(): void {
    const p = this.destino;
    if (!p) return;
    this.fazendo = 'pescando';
    this.tEstado = 0;
    this.ateBote = 3 + this.sorte() * 4;
    for (const o of this.ombros) o.visible = false;
    const a = Garca.areaDe(p);
    Object.assign(this.area, a);
    this.group.position.y = NO_RASO;
    this.group.rotation.y = p.olhando;
    this.voltarAPassear();
    this.encarar(p.x + Math.sin(p.olhando) * 3, p.z + Math.cos(p.olhando) * 3);
    this.aoPousar?.(p.x, p.z);
  }

  /** o bote, já (o teste chama para medir o bico na água) */
  darOBote(): void {
    if (this.fazendo === 'voando') return;
    this.fazendo = 'bote';
    this.tEstado = 0;
    this.pegou = this.sorte() < 0.45;
    this.bicoMaisBaixo = Infinity;
  }

  protected animar(dt: number, { andando, fase }: PoseDoBicho): void {
    this.tEstado += dt;
    let alvo: number[] = [...PESCA];
    let rapido = false;

    switch (this.fazendo) {
      case 'pescando': {
        if (!andando) {
          this.ateBote -= dt;
          if (this.ateBote <= 0) this.darOBote();
        }
        // andando o pescoço sobe um pouco; parada, a cabeça mira a água devagar
        if (andando) alvo = misturar(PESCA, ALERTA, 0.35);
        alvo[5] += Math.sin(fase * 0.7) * 0.12;
        alvo[1] += Math.sin(fase * 0.45) * 0.05;
        break;
      }
      case 'bote': {
        const k = this.tEstado / BOTE;
        // recolhe (0–0,25), dispara (0,25–0,4), fica (0,4–0,6), volta
        if (k < 0.25) alvo = misturar(PESCA, RECUO, k / 0.25);
        else if (k < 0.4) alvo = misturar(RECUO, BOTE_ESTICADO, (k - 0.25) / 0.15);
        else if (k < 0.62) alvo = [...BOTE_ESTICADO];
        else alvo = misturar(BOTE_ESTICADO, PESCA, Math.min(1, (k - 0.62) / 0.38));
        rapido = true;
        if (this.tEstado - dt < BOTE * 0.4 && this.tEstado >= BOTE * 0.4) {
          const bico = this.pontaDoBico();
          this.aoBicar?.(bico.x, bico.z);
        }
        if (k >= 1) {
          this.fazendo = this.pegou ? 'engolindo' : 'pescando';
          this.tEstado = 0;
          this.peixinho.visible = this.pegou;
          this.ateBote = 5 + this.sorte() * 8;
        }
        break;
      }
      case 'engolindo': {
        // joga a cabeça para trás, e o peixe some garganta abaixo
        const k = this.tEstado / ENGOLIR;
        alvo = misturar(PESCA, ENGOLE, Math.sin(Math.min(1, k) * Math.PI));
        if (k > 0.55) this.peixinho.visible = false;
        if (k >= 1) {
          this.fazendo = 'pescando';
          this.tEstado = 0;
        }
        break;
      }
      case 'alerta':
        // o pescoço inteiro esticado para cima, a cabeça girando atenta
        alvo = [...ALERTA];
        this.cabeca.rotation.y = Math.sin(fase * 2.2) * 0.5;
        break;
      case 'voando':
        this.animarVoo(dt, fase);
        return;
    }
    if (this.fazendo !== 'alerta') this.cabeca.rotation.y *= 1 - Math.min(1, dt * 4);
    this.aplicar(alvo, rapido ? 1 : Math.min(1, dt * 7));
    this.pernasEmPe(andando, fase);
    if (this.fazendo === 'bote') this.bicoMaisBaixo = Math.min(this.bicoMaisBaixo, this.pontaDoBico().y);
  }

  /** leva o corpo, os gomos e a cabeça para a pose (`k` = quanto, neste quadro) */
  private aplicar(pose: readonly number[], k: number): void {
    this.corpo.rotation.x += (pose[0] - this.corpo.rotation.x) * k;
    for (let i = 0; i < 4; i++) this.gomos[i].rotation.x += (pose[i + 1] - this.gomos[i].rotation.x) * k;
    this.cabeca.rotation.x += (pose[5] - this.cabeca.rotation.x) * k;
  }

  /** em pé (ou dando uns passos devagar, levantando bem o pé) */
  private pernasEmPe(andando: boolean, fase: number): void {
    this.corpo.position.y = 0.6 + Math.sin(fase * 1.1) * 0.004;
    for (let i = 0; i < 2; i++) {
      const passo = andando ? Math.max(0, Math.sin(fase * 3.2 + i * Math.PI)) : 0;
      this.pernas[i].rotation.x = -0.45 * passo;
      this.joelhos[i].rotation.x = 0.9 * passo;
    }
    for (const a of this.asasDobradas) a.visible = true;
  }

  /**
   * O VOO: a altura e as asas saem do quanto falta para chegar. Decola
   * agachando e abrindo as asas, sobe batendo devagar, plana no meio e pousa
   * com as pernas para a frente e as asas abertas freando.
   */
  private animarVoo(dt: number, fase: number): void {
    const falta = Math.hypot((this.destino?.x ?? this.x) - this.x, (this.destino?.z ?? this.z) - this.z);
    const k = Math.max(0, Math.min(1, 1 - falta / this.travessia));
    const arco = Math.sin(k * Math.PI);
    // sai do raso e volta ao raso: no começo e no fim o pé está na água
    const altura = arco * ALTO * Math.min(1, this.tEstado * 1.8) + NO_RASO * (1 - arco);
    this.group.position.y = altura;
    // o corpo deitado, o pescoço recolhido em S apertado, as pernas para trás
    const pousando = k > 0.82;
    const voo = [...VOO];
    if (pousando) voo[0] = -0.55;
    this.aplicar(voo, Math.min(1, dt * 5));
    // as pernas: esticadas para TRÁS no voo (`rotation.x` positivo leva o pé
    // para `-Z`) e para a FRENTE no pouso, já procurando o chão
    for (let i = 0; i < 2; i++) {
      this.pernas[i].rotation.x += ((pousando ? -0.5 : 1.35) - this.pernas[i].rotation.x) * Math.min(1, dt * 5);
      this.joelhos[i].rotation.x += ((pousando ? 0.6 : 0.05) - this.joelhos[i].rotation.x) * Math.min(1, dt * 5);
    }
    for (const a of this.asasDobradas) a.visible = false;
    // a batida: funda e lenta subindo, e planando no meio da travessia
    const plana = k > 0.38 && k < 0.7;
    const bate = plana ? 0.12 + Math.sin(fase * 1.5) * 0.04 : Math.sin(this.tEstado * 9.5) * 0.75;
    for (let i = 0; i < 2; i++) {
      const lado = i === 0 ? -1 : 1;
      // a da esquerda (em -X) sobe com `z` NEGATIVO
      this.ombros[i].rotation.z = lado * bate;
      this.cotovelos[i].rotation.z = lado * (plana ? 0.05 : Math.sin(this.tEstado * 9.5 - 0.9) * 0.45);
      this.ombros[i].rotation.y = lado * (pousando ? -0.35 : 0);
    }
  }
}
