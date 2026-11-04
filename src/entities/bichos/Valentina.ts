import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { fundir } from '../../world/fundir';
import {
  LOOK_GATITOS_CHIQUE, MEDIDAS_DA_VALENTINA as M, VAGAS_DO_LOOK,
  type LookDaValentina, type VagaDoLook,
} from '../../world/looksDaValentina';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';
import type { VozDaFala } from '../../core/types';

/**
 * A VALENTINA — a flamingo italiana, de Milão, que trabalha no MARKETING dos
 * Gatitos (pedido do Renan). Vaidosa, bem vaidosa mesmo: uma "boss girl".
 * Repara na roupa de todo mundo e julga — mas não é má: sempre dá um jeito de
 * elogiar. Faz a aula de português junto com a dupla.
 *
 * O CORPO É DE FLAMINGO DE VERDADE, e não o molde em pé das coelhinhas e do
 * Flynn (o Renan, na primeira versão: "não precisa basear o modelo dela igual
 * dos outros da escola, ela não ficou parecendo um flamingo, ficou bem
 * feia"). O que faz ela ser lida como flamingo, nesta ordem:
 *
 * 1. o PESCOÇO comprido em S — uma malha só, um tubo que afina, refeito a
 *    cada quadro pelos ângulos dos quatro gomos (o "osso feito em código"):
 *    curva, estica e abaixa sem emenda nenhuma;
 * 2. as PERNAS compridas e finas, com o "joelho" (que no flamingo é o
 *    tornozelo) dobrando para trás — e, parada, ela fica NUM PÉ SÓ;
 * 3. o CORPO em ovo deitado, a frente um tico mais alta, com as ASAS dobradas
 *    dos lados, coral, e as penas de voo PRETAS na ponta, por cima da cauda;
 * 4. a CABEÇA pequena com o BICO grosso que dobra para baixo no meio, claro
 *    com a ponta preta.
 *
 * O FOFO vem da cabeça um tico maior que a de verdade, do olho grande colado
 * na cara (a lição do Flynn) e do blush. O VAIDOSO vem do olho de DELINEADO
 * GATINHO com cílios, dos óculos de sol empurrados para a cabeça e das
 * pérolas — e dos gestos: POSAR (o pescoço alto, uma asa aberta como leque e
 * um pé só, a pose de flamingo que é pose de modelo), EXAMINAR (o pescoço
 * desce e a cabeça varre a roupa de quem chegou, de cima a baixo, o olho
 * apertado) e ENCANTAR-SE (as asas batendo, o olho fechado de contente).
 *
 * A ROUPA mora no kit `world/looksDaValentina.ts`, como uma ficha de peças
 * por vaga ("um modelo no qual seja fácil criar novas roupas"): look novo é
 * uma ficha nova, e `vestir(look)` troca na hora.
 */

/**
 * ELA CRESCE UM TICO NO FIM: medida em números de flamingo, ela ficava com a
 * cabeça no ombro do Ari e sumia do lado da dupla. Com 1,15 o alto da cabeça
 * chega perto do deles — modelo é alta.
 */
const ESCALA = 1.15;
/** a cabeça um tico maior que a de flamingo de verdade: é ela que segura o fofo, no estilo do jogo */
const CABECA = 1.22;

/** as poses do pescoço: o ângulo de cada gomo (de `+Y` para `+Z`) e o da cabeça */
type PoseDoPescoco = readonly [number, number, number, number, number];
/** parada: o S de flamingo, a cabeça por cima do peito */
const REPOUSO: PoseDoPescoco = [M.pescoco.pose[0], M.pescoco.pose[1], M.pescoco.pose[2], M.pescoco.pose[3], 0.15];
/** examinando: o pescoço desce para a frente e a cabeça chega perto da roupa de quem está ali */
const EXAME: PoseDoPescoco = [1.0, 0.95, 0.55, 0.75, 0.55];
/** posando: o pescoço alto e quase reto, o bico para cima */
const ORGULHO: PoseDoPescoco = [0.42, 0.05, -0.18, -0.05, -0.18];

/** os grupos de quem balança sozinho (as pontas do lenço, a bolsinha…) */
interface Balancante {
  obj: THREE.Object3D;
  base: number;
  amp: number;
  vel: number;
}

/**
 * UM TUBO QUE AFINA por uma curva (o bico do flamingo, o pescoço): um anel
 * por amostra, de raio `raio(u)`, achatado `achata` no `x`. A curva mora no
 * plano YZ, então o lado do anel é sempre o `X` — sem quadro de Frenet
 * torcendo no meio.
 */
function tuboAfinado(
  curva: THREE.Curve<THREE.Vector3>, u0: number, u1: number, raio: (u: number) => number,
  achata = 1, aneis = 14, lados = 14,
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const n = (aneis + 1) * (lados + 1);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
  const uv: number[] = [];
  const ind: number[] = [];
  for (let i = 0; i <= aneis; i++) for (let j = 0; j <= lados; j++) uv.push(j / lados, i / aneis);
  for (let i = 0; i < aneis; i++) {
    for (let j = 0; j < lados; j++) {
      const a = i * (lados + 1) + j;
      const b = a + lados + 1;
      // a ordem que deixa a face virada para FORA (ao contrário, o tubo ficava
      // do avesso: de frente, via-se através do pescoço, e ele parecia oco)
      ind.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(ind);
  moldarTubo(geo, curva, u0, u1, raio, achata, aneis, lados);
  return geo;
}

/** escreve (ou reescreve) os vértices de um `tuboAfinado` — o pescoço faz isto a cada quadro */
function moldarTubo(
  geo: THREE.BufferGeometry, curva: THREE.Curve<THREE.Vector3>, u0: number, u1: number,
  raio: (u: number) => number, achata: number, aneis: number, lados: number,
): void {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const lado = new THREE.Vector3(1, 0, 0);
  const normal = new THREE.Vector3();
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  let k = 0;
  for (let i = 0; i <= aneis; i++) {
    const u = u0 + ((u1 - u0) * i) / aneis;
    curva.getPoint(u, p);
    curva.getTangent(u, t);
    normal.crossVectors(t, lado).normalize();
    const r = raio(u);
    for (let j = 0; j <= lados; j++) {
      const a = (j / lados) * Math.PI * 2;
      pos.setXYZ(k++, p.x + Math.cos(a) * r * achata, p.y + normal.y * Math.sin(a) * r, p.z + normal.z * Math.sin(a) * r);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

export class Valentina extends Bicho {
  /** a voz dela na caixa de fala: o nome e a cor da etiqueta (`vozes.ts`) */
  static readonly voz: VozDaFala = { nome: 'Valentina', cor: P.falaValentina };

  /** o corpo inteiro (o balanço, a altura sentada) */
  private readonly corpo = new THREE.Group();
  /** o ovo do corpo, inclinado: a roupa de tronco e a saia moram aqui */
  private readonly ovo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  /** o crânio, um tico à frente e acima da ponta do pescoço: o rosto e a vaga `cabeca` moram aqui */
  private readonly cranio = new THREE.Group();
  /** a base do pescoço: gira com o primeiro gomo (o lenço mora aqui) */
  private readonly basePescoco = new THREE.Group();
  /** o pescoço é UMA malha, refeita a cada quadro pela pose dos gomos */
  private readonly pescoco: THREE.Mesh;
  private readonly curvaDoPescoco = new THREE.CatmullRomCurve3(Array.from({ length: 7 }, () => new THREE.Vector3()));
  private readonly anguloDoPescoco: number[] = [...REPOUSO];
  /** as pernas (pivô no quadril) e os "joelhos": [esquerda, direita] */
  private readonly pernas: THREE.Group[] = [];
  private readonly joelhos: THREE.Group[] = [];
  private readonly pesPelados: THREE.Group[] = [];
  /** as asas dobradas (pivô no ombro): [esquerda, direita] */
  private readonly asas: THREE.Group[] = [];
  private readonly olhos: THREE.Group[] = [];

  private look: LookDaValentina | null = null;
  private balancantes: Balancante[] = [];

  /** o relógio dela, e quanto falta de cada gesto */
  private relogio = 0;
  private passada = 0;
  private posando = 0;
  private examinando = 0;
  private encantada = 0;
  private misturaPose = 0;
  private misturaExame = 0;
  private misturaEncanto = 0;
  private misturaUmPe = 0;
  private misturaSentada = 0;
  private parada = 0;
  private proximaPiscada = 2.2;

  constructor(area: AreaDoBicho) {
    super(area, {
      // desfila devagar, e para em cada canto fazendo pose
      velocidade: 0.62,
      descansoMin: 1.4,
      descansoMax: 3.6,
      chanceDeSentar: 0,
      // ela não faz barulho sozinha: quem fala é a cena
      somCadaMin: 1e6,
      somCadaMax: 1e6,
      duracaoDoCarinho: 2,
      semente: 20261104,
    });
    this.pescoco = new THREE.Mesh(
      tuboAfinado(this.curvaDoPescoco, 0, 1, (u) => this.raioDoPescoco(u), 1, 24, 12),
      toon(P.valentinaPena),
    );
    this.montar();
    this.moldarPescoco();
    this.vestir(LOOK_GATITOS_CHIQUE);
    fundir(this.group);
    this.prontoParaAparecer('valentina');
  }

  // ------------------------------------------------------------------ o look

  /** o look que ela está usando */
  get lookAtual(): LookDaValentina | null {
    return this.look;
  }

  /**
   * VESTE UM LOOK: tira as peças das vagas e pendura as novas, cada uma no
   * pai da vaga dela (ver a tabela em `looksDaValentina.ts`). Vaga que o look
   * não tem fica vazia — e o pé, sem sapato, é o pé de flamingo.
   */
  vestir(look: LookDaValentina): void {
    this.look = look;
    for (const vaga of VAGAS_DO_LOOK) this.vestirVaga(look, vaga);
    for (const pe of this.pesPelados) pe.visible = !look.pe;
    this.balancantes = [];
    this.corpo.traverse((o) => {
      const b = o.userData.balanca as { amp: number; vel: number } | undefined;
      if (b) this.balancantes.push({ obj: o, base: o.rotation.x, amp: b.amp, vel: b.vel });
    });
  }

  private vestirVaga(look: LookDaValentina, vaga: VagaDoLook): void {
    const porLado = (lista: THREE.Group[]): Array<{ pai: THREE.Object3D; lado: -1 | 1 }> =>
      lista.map((pai, i) => ({ pai, lado: i === 0 ? -1 : 1 }));
    const so = (pai: THREE.Object3D): Array<{ pai: THREE.Object3D; lado: -1 | 1 }> => [{ pai, lado: 1 }];
    const pais = vaga === 'asa' ? porLado(this.asas)
      : vaga === 'pe' ? porLado(this.joelhos)
        : vaga === 'cabeca' ? so(this.cranio)
          : vaga === 'pescoco' ? so(this.basePescoco)
            : so(this.ovo);
    for (const { pai, lado } of pais) {
      const nome = `roupa:${vaga}`;
      for (const velho of pai.children.filter((c) => c.name === nome)) pai.remove(velho);
      const fazer = look[vaga];
      const peca = !fazer ? null
        : vaga === 'asa' || vaga === 'pe'
          ? (fazer as (m: typeof M, lado: -1 | 1) => THREE.Object3D | null)(M, lado)
          : (fazer as (m: typeof M) => THREE.Object3D | null)(M);
      if (!peca) continue;
      const grupo = new THREE.Group();
      grupo.name = nome;
      grupo.add(peca);
      grupo.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) o.castShadow = true;
      });
      pai.add(grupo);
      // um look trocado em jogo também se junta (o do nascimento se junta com
      // o corpo inteiro, no construtor)
      if (this.group.parent) fundir(grupo);
    }
  }

  // ---------------------------------------------------------------- gestos

  /** o pescoço alto, a asa direita aberta como leque e um pé só: "olha eu aqui" */
  posar(segundos = 2.4): void {
    this.posando = Math.max(this.posando, segundos);
  }

  /** o pescoço desce e a cabeça varre a roupa de quem chegou, de olho apertado */
  examinar(segundos = 2.6): void {
    this.examinando = Math.max(this.examinando, segundos);
  }

  /** as asas batendo e o olho fechado de contente: "bellissimo!" */
  encantar(segundos = 1.8): void {
    this.encantada = Math.max(this.encantada, segundos);
  }

  /** o teste pergunta isto */
  get estaPosando(): boolean {
    return this.posando > 0;
  }
  get estaExaminando(): boolean {
    return this.examinando > 0;
  }
  get estaEncantada(): boolean {
    return this.encantada > 0;
  }
  /** 0 com os dois pés no chão, 1 equilibrada num pé só */
  get numPeSo(): number {
    return this.misturaUmPe;
  }
  /** a abertura do olho agora (1 aberto, perto de 0 fechado) */
  get aberturaDoOlho(): number {
    return this.olhos[0]?.scale.y ?? 1;
  }
  /** a altura da cabeça no mundo (o exame abaixa, a pose sobe) */
  get alturaDaCabeca(): number {
    return this.cabeca.getWorldPosition(new THREE.Vector3()).y;
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const pena = toon(P.valentinaPena);
    const clara = toon(P.valentinaPenaClara);
    const forte = toon(P.valentinaPenaForte);
    const preta = toon(P.valentinaPenaPonta);
    const perna = toon(P.valentinaPerna);
    this.corpo.name = 'corpo-da-valentina';

    // ----------------------------------------------------------------- o ovo
    this.ovo.name = 'ovo-da-valentina';
    this.ovo.position.set(0, M.ovo.y, M.ovo.z);
    this.ovo.rotation.x = M.ovo.inclina;
    const ovo = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), pena);
    ovo.scale.set(M.ovo.rx, M.ovo.ry, M.ovo.rz);
    this.ovo.add(ovo);
    // A CAUDA: penas curtas, claras, saindo da ponta de trás e caindo um tico
    for (const [x, comp, mat] of [[-0.03, 0.07, clara], [0, 0.085, pena], [0.03, 0.07, clara]] as const) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mat);
      p.scale.set(0.026, 0.012, comp);
      p.position.set(x, 0.01, -M.ovo.rz - comp * 0.35);
      p.rotation.set(-0.22, x * 4, 0);
      this.ovo.add(p);
    }

    // ------------------------------------------------------- as asas dobradas
    /**
     * Pivô no OMBRO, no alto do peito; a asa corre para TRÁS pelo flanco,
     * fechando um tico para o meio das costas (o ovo afina atrás). Camadas,
     * de dentro para fora: o leque coral, a fileira de coberteiras claras em
     * escama na borda de baixo, as secundárias coral e, na ponta, as quatro
     * PRIMÁRIAS PRETAS — a marca do flamingo de asa fechada.
     */
    for (const lado of [-1, 1] as const) {
      const ombro = new THREE.Group();
      ombro.name = lado < 0 ? 'asa-esquerda' : 'asa-direita';
      ombro.position.set(lado * 0.118, M.ombro.y, M.ombro.z);
      ombro.rotation.set(0.02, lado * 0.17, 0);
      const leque = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), forte);
      leque.scale.set(0.028, 0.094, 0.17);
      leque.position.set(lado * 0.02, -0.012, -0.12);
      ombro.add(leque);
      for (let i = 0; i < 5; i++) {
        const escama = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), pena);
        escama.scale.set(0.012, 0.024, 0.032);
        escama.position.set(lado * 0.034, -0.074 + i * 0.006, -0.03 - i * 0.046);
        escama.rotation.x = 0.2;
        ombro.add(escama);
      }
      for (const [dy, dz, comp] of [[0.016, -0.24, 0.075], [-0.01, -0.245, 0.08], [-0.036, -0.23, 0.07]] as const) {
        const sec = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), forte);
        sec.scale.set(0.011, 0.02, comp);
        sec.position.set(lado * 0.024, dy, dz);
        ombro.add(sec);
      }
      for (const [dy, dz, comp, gira] of [[0.024, -0.32, 0.07, 0.12], [0.004, -0.33, 0.075, 0.04], [-0.016, -0.325, 0.07, -0.05], [-0.034, -0.31, 0.06, -0.14]] as const) {
        const prim = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), preta);
        prim.scale.set(0.009, 0.014, comp);
        prim.position.set(lado * 0.02, dy, dz);
        prim.rotation.x = gira;
        ombro.add(prim);
      }
      this.ovo.add(ombro);
      this.asas.push(ombro);
    }
    this.corpo.add(this.ovo);

    // ------------------------------------------------------------ as pernas
    /**
     * Pivô no QUADRIL, debaixo do ovo. A coxa de penas some dentro do corpo;
     * a perna fina e rosa desce até o "JOELHO" — que no flamingo é o
     * tornozelo, e dobra para trás —, a bolinha da junta, a canela e o pé. O
     * pé descalço (três dedos com a membrana) some quando o look calça um
     * sapato.
     */
    for (const lado of [-1, 1] as const) {
      const quadril = new THREE.Group();
      quadril.name = lado < 0 ? 'perna-esquerda' : 'perna-direita';
      quadril.position.set(lado * M.quadril.x, M.quadril.y, M.quadril.z);
      const coxa = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.04, 4, 10), pena);
      coxa.position.y = -0.02;
      quadril.add(coxa);
      const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.0158, 0.0135, M.coxa - 0.04, 10), perna);
      tibia.position.y = -0.04 - (M.coxa - 0.04) / 2;
      quadril.add(tibia);
      const joelho = new THREE.Group();
      joelho.name = lado < 0 ? 'joelho-esquerdo' : 'joelho-direito';
      joelho.position.y = -M.coxa;
      joelho.add(new THREE.Mesh(new THREE.SphereGeometry(0.021, 12, 10), perna));
      const canela = new THREE.Mesh(new THREE.CylinderGeometry(0.0133, 0.0118, M.canela, 10), perna);
      canela.position.y = -M.canela / 2;
      joelho.add(canela);
      const pe = this.fazerPePelado(lado);
      joelho.add(pe);
      this.pesPelados.push(pe);
      quadril.add(joelho);
      this.corpo.add(quadril);
      this.pernas.push(quadril);
      this.joelhos.push(joelho);
    }

    // ------------------------------------------- o pescoço e a cabeça
    this.pescoco.name = 'pescoco-da-valentina';
    // a malha muda a cada quadro: sem recorte por esfera (ela mudaria junto)
    this.pescoco.frustumCulled = false;
    this.corpo.add(this.pescoco);
    this.basePescoco.name = 'base-do-pescoco';
    this.basePescoco.position.set(0, M.pescoco.y, M.pescoco.z);
    this.corpo.add(this.basePescoco);
    this.montarCabeca();
    this.corpo.add(this.cabeca);
    this.corpo.scale.setScalar(ESCALA);
    this.group.add(this.corpo);
  }

  /** o raio do pescoço ao longo dele: grosso na base (entra no peito), fino em cima, e engrossa um tico na nuca */
  private raioDoPescoco(u: number): number {
    const { raio, raioAlto } = M.pescoco;
    const base = u < 0.18 ? 1 + (0.18 - u) * 1.4 : 1;
    const nuca = u > 0.9 ? 1 + (u - 0.9) * 2.5 : 1;
    return (raio + (raioAlto - raio) * Math.min(1, u / 0.9)) * base * nuca;
  }

  /**
   * O PESCOÇO VIVO: os quatro gomos encadeados pelos ângulos de agora (de
   * `+Y` para `+Z`), a curva passando pelas juntas (com um ponto enterrado no
   * peito antes da base, para a emenda sumir dentro do corpo) e a cabeça na
   * ponta. A malha é reescrita no lugar, sem geometria nova.
   */
  private moldarPescoco(): void {
    const a = this.anguloDoPescoco;
    const L = M.pescoco.gomo;
    const pts = this.curvaDoPescoco.points;
    pts[0].set(0, M.pescoco.y - Math.cos(a[0]) * L * 0.6, M.pescoco.z - Math.sin(a[0]) * L * 0.6);
    pts[1].set(0, M.pescoco.y, M.pescoco.z);
    for (let i = 0; i < 4; i++) {
      pts[i + 2].set(0, pts[i + 1].y + Math.cos(a[i]) * L, pts[i + 1].z + Math.sin(a[i]) * L);
    }
    // o último ponto entra na cabeça, para o pescoço fechar dentro do crânio
    const topo = pts[5];
    pts[6].set(0, topo.y + Math.cos(a[4]) * 0.04, topo.z + Math.sin(a[4]) * 0.04);
    moldarTubo(this.pescoco.geometry, this.curvaDoPescoco, 0, 1, (u) => this.raioDoPescoco(u), 1, 24, 12);
    this.cabeca.position.copy(topo);
    this.cabeca.rotation.x = a[4];
    this.basePescoco.rotation.x = a[0];
  }

  /** o pé de flamingo descalço: três dedos para a frente, um atrás, e a membrana entre eles */
  private fazerPePelado(lado: -1 | 1): THREE.Group {
    const g = new THREE.Group();
    g.name = lado < 0 ? 'pe-pelado-esquerdo' : 'pe-pelado-direito';
    const perna = toon(P.valentinaPerna);
    const CHAO = -M.canela - 0.03;
    for (const [a, comp] of [[-0.5, 0.065], [0, 0.075], [0.5, 0.065], [Math.PI, 0.028]] as const) {
      const dedo = new THREE.Mesh(new THREE.CapsuleGeometry(0.0068, comp, 3, 6), perna);
      dedo.rotation.set(Math.PI / 2, 0, 0);
      dedo.position.set(0, 0, comp / 2);
      const giro = new THREE.Group();
      giro.rotation.y = a;
      giro.add(dedo);
      giro.position.set(0, CHAO + 0.007, 0.004);
      g.add(giro);
    }
    const leque = new THREE.Shape();
    leque.moveTo(0, 0);
    for (let i = 0; i <= 8; i++) {
      const a = -0.5 + i / 8;
      const r = 0.06 - Math.abs(Math.sin((i * Math.PI) / 4)) * 0.01;
      leque.lineTo(Math.sin(a) * r, Math.cos(a) * r);
    }
    leque.closePath();
    const membrana = new THREE.Mesh(new THREE.ShapeGeometry(leque), toon(P.valentinaPena, { doubleSide: true }));
    membrana.rotation.x = Math.PI / 2;
    membrana.position.set(0, CHAO + 0.005, 0.004);
    g.add(membrana);
    const calcanhar = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), perna);
    calcanhar.position.y = -M.canela;
    g.add(calcanhar);
    return g;
  }

  private montarCabeca(): void {
    const pena = toon(P.valentinaPena);
    const clara = toon(P.valentinaPenaClara);
    const C = M.cabeca;
    this.cabeca.name = 'cabeca-da-valentina';
    // o crânio fica um tico à frente e acima da ponta do pescoço (é nele, e não
    // na ponta do pescoço, que a vaga `cabeca` pendura os óculos e os brincos)
    const centro = this.cranio;
    centro.name = 'cranio-da-valentina';
    centro.position.set(0, 0.045 * CABECA, 0.012 * CABECA);
    centro.scale.setScalar(CABECA);
    this.cabeca.add(centro);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 18), pena);
    cranio.scale.set(C.rx, C.ry, C.rz);
    centro.add(cranio);
    /** um ponto na superfície do crânio, e a normal dali */
    const naCara = (x: number, y: number): { p: THREE.Vector3; n: THREE.Vector3 } => {
      const z = C.rz * Math.sqrt(Math.max(0, 1 - (x / C.rx) ** 2 - (y / C.ry) ** 2));
      const n = new THREE.Vector3(x / C.rx ** 2, y / C.ry ** 2, z / C.rz ** 2).normalize();
      return { p: new THREE.Vector3(x, y, z), n };
    };
    const naPele = (o: THREE.Object3D, x: number, y: number, folga = 0.001): void => {
      const { p, n } = naCara(x, y);
      o.position.copy(p).addScaledVector(n, folga);
      o.lookAt(o.position.clone().add(n));
      centro.add(o);
    };

    // -------------------------------------------------- a máscara e o bico
    // a pele clara em volta da raiz do bico (o rosto do flamingo é mais claro ali)
    const mascara = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), clara);
    mascara.scale.set(0.04, 0.034, 0.03);
    mascara.position.set(0, -0.016, 0.062);
    centro.add(mascara);
    /**
     * O BICO: grosso na raiz, sai reto da cara, DOBRA para baixo no meio e
     * afina até a ponta. A parte clara até 62% e a ponta PRETA depois — o
     * mesmo tubo cortado no mesmo anel, sem emenda.
     */
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.014, 0.058),
      new THREE.Vector3(0, -0.019, 0.106),
      new THREE.Vector3(0, -0.035, 0.14),
      new THREE.Vector3(0, -0.07, 0.152),
      new THREE.Vector3(0, -0.1, 0.139),
    ]);
    const raio = (u: number): number => 0.025 - 0.017 * u ** 0.85;
    const CORTE = 0.62;
    centro.add(new THREE.Mesh(tuboAfinado(curva, 0, CORTE, raio, 0.8, 12), toon(P.valentinaBico)));
    const pretoDoBico = toon(P.valentinaBicoPonta);
    centro.add(new THREE.Mesh(tuboAfinado(curva, CORTE, 1, raio, 0.8, 10), pretoDoBico));
    const fim = new THREE.Mesh(new THREE.SphereGeometry(raio(1), 10, 8), pretoDoBico);
    fim.scale.x = 0.8;
    fim.position.copy(curva.getPointAt(1));
    centro.add(fim);
    for (const lado of [-1, 1] as const) {
      const narina = new THREE.Mesh(new THREE.CapsuleGeometry(0.0018, 0.007, 2, 5), pretoDoBico);
      narina.rotation.x = Math.PI / 2 - 0.1;
      narina.position.set(lado * 0.0078, -0.004, 0.096);
      centro.add(narina);
    }

    // ---------------------------------------------------------- os olhos
    /**
     * OLHO COLADO NA CARA (a lição do Flynn e do Gatito): um grupo pousado no
     * crânio, virado pela normal, e tudo achatado no `z` dele — o oval escuro,
     * a metade de baixo cor de mel, os dois brilhos. E o que faz dela a
     * Valentina: o DELINEADO GATINHO (o arco por cima com o puxadinho para
     * fora e para cima no canto) e três CÍLIOS no canto de fora. Tudo dentro
     * do grupo do olho, para piscar junto.
     */
    const delineado = toon(P.valentinaDelineado);
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Group();
      olho.name = lado < 0 ? 'olho-esquerdo' : 'olho-direito';
      const escuro = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), toon(P.valentinaPupila));
      escuro.scale.set(0.0145, 0.0185, 0.004);
      olho.add(escuro);
      const mel = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), toon(P.valentinaOlho));
      mel.scale.set(0.011, 0.0085, 0.003);
      mel.position.set(0, -0.007, 0.0025);
      olho.add(mel);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), clara);
      brilho.scale.set(0.0056, 0.0056, 0.002);
      brilho.position.set(lado * 0.0048, 0.0075, 0.004);
      olho.add(brilho);
      const brilhinho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), clara);
      brilhinho.scale.set(0.0027, 0.0027, 0.0015);
      brilhinho.position.set(-lado * 0.0048, -0.0045, 0.005);
      olho.add(brilhinho);
      const arco = new THREE.Mesh(new THREE.TorusGeometry(0.0168, 0.0022, 5, 18, Math.PI * 0.62), delineado);
      arco.rotation.z = Math.PI * 0.19;
      arco.scale.set(1, 1.12, 0.4);
      arco.position.z = 0.0015;
      olho.add(arco);
      const cantoA = lado > 0 ? Math.PI * 0.19 : Math.PI * 0.81;
      const canto = new THREE.Vector3(Math.cos(cantoA) * 0.0168, Math.sin(cantoA) * 0.0168 * 1.12, 0.0015);
      const puxado = new THREE.Mesh(new THREE.CapsuleGeometry(0.0019, 0.0078, 2, 6), delineado);
      puxado.position.copy(canto).add(new THREE.Vector3(lado * 0.0038, 0.0024, 0));
      puxado.rotation.z = -lado * 1.0;
      puxado.scale.z = 0.4;
      olho.add(puxado);
      for (const [k, comp] of [[0.26, 0.0068], [0.34, 0.0076], [0.42, 0.006]] as const) {
        const a = lado > 0 ? Math.PI * k : Math.PI * (1 - k);
        const cilio = new THREE.Mesh(new THREE.CapsuleGeometry(0.001, comp, 2, 4), delineado);
        const r = 0.0183;
        cilio.position.set(Math.cos(a) * (r + comp * 0.45), Math.sin(a) * (r + comp * 0.45) * 1.12, 0.0015);
        cilio.rotation.z = a - Math.PI / 2 - lado * 0.35;
        cilio.scale.z = 0.5;
        olho.add(cilio);
      }
      // de frente (a vista do jogo) o olho precisa aparecer: mais para a frente que o de flamingo de verdade
      naPele(olho, lado * 0.035, 0.016);
      this.olhos.push(olho);
      const blush = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.valentinaBochecha));
      blush.scale.set(0.013, 0.008, 0.003);
      naPele(blush, lado * 0.05, -0.018, 0.0012);
    }
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, sentado, carinho }: PoseDoBicho): void {
    this.relogio += dt;
    const t = this.relogio;
    this.posando = Math.max(0, this.posando - dt);
    this.examinando = Math.max(0, this.examinando - dt);
    this.encantada = Math.max(0, this.encantada - dt);
    const suave = Math.min(1, dt * 5);
    const ir = (atual: number, alvo: number): number => atual + (alvo - atual) * suave;
    this.misturaPose = ir(this.misturaPose, this.posando > 0 ? 1 : 0);
    this.misturaExame = ir(this.misturaExame, this.examinando > 0 ? 1 : 0);
    this.misturaEncanto = ir(this.misturaEncanto, this.encantada > 0 || carinho > 0.3 ? 1 : 0);
    this.misturaSentada = ir(this.misturaSentada, sentado ? 1 : 0);
    const pose = this.misturaPose;
    const exame = this.misturaExame;
    const encanto = this.misturaEncanto;
    const sentada = this.misturaSentada;
    if (andando) this.passada += dt * 7.5;
    const fase = this.passada;

    /*
     * NUM PÉ SÓ: parada um tempinho (sem andar, sem gesto, de pé) — ou
     * posando, que é a pose de flamingo e a de modelo —, ela recolhe a perna
     * direita: a coxa um tico para a frente e o "joelho" dobrando a canela
     * para trás e para cima, rente à coxa. O corpo passa para cima da perna
     * que ficou.
     */
    const quieta = !andando && !sentado && this.examinando <= 0 && this.encantada <= 0;
    this.parada = quieta ? this.parada + dt : 0;
    const querUmPe = quieta && (this.parada > 2.4 || this.posando > 0);
    this.misturaUmPe += ((querUmPe ? 1 : 0) - this.misturaUmPe) * Math.min(1, dt * 3);
    const umPe = this.misturaUmPe * (1 - sentada);

    // ------------------------------------------------------------ as pernas
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      const p = fase + (lado < 0 ? 0 : Math.PI);
      let quadril = andando ? Math.sin(p) * 0.32 : 0;
      // a canela dobra para trás enquanto a perna vem para a frente (o passo no ar)
      let joelho = andando ? Math.max(0, Math.sin(p + 1.2)) * 1.15 : 0;
      if (lado > 0) {
        // a canela volta rente à coxa e o pé fica debaixo do corpo
        // (o joelho aponta para a frente, o "Z" de flamingo dormindo)
        quadril += (-0.9 - quadril) * umPe;
        joelho += (3.25 - joelho) * umPe;
      }
      // sentada: as pernas dobradas debaixo do corpo, como flamingo deitado
      quadril += (-1.45 - quadril) * sentada;
      joelho += (2.85 - joelho) * sentada;
      const k = Math.min(1, dt * 10);
      perna.rotation.x += (quadril - perna.rotation.x) * k;
      this.joelhos[i].rotation.x += (joelho - this.joelhos[i].rotation.x) * k;
    }
    const respiro = Math.sin(t * 1.7) * 0.004;
    const doPasso = andando ? Math.abs(Math.sin(fase)) * 0.014 : 0;
    const pulinho = encanto * Math.abs(Math.sin(t * 9)) * 0.012 * (1 - sentada);
    this.corpo.position.x = -umPe * 0.034 * ESCALA;
    // sentada, o fundo do ovo assenta no assento
    this.corpo.position.y = respiro + doPasso + pulinho - sentada * (M.ovo.y - M.ovo.ry) * ESCALA;
    // o ovo balança com o passo, e inclina de leve para a perna que ficou
    this.ovo.rotation.z = (andando ? Math.sin(fase) * 0.05 : 0) + umPe * 0.05;
    this.ovo.rotation.x = M.ovo.inclina + (andando ? Math.sin(fase * 2) * 0.02 : 0) - pose * 0.05;

    // ---------------------------------------------------------------- as asas
    for (const [i, asa] of this.asas.entries()) {
      const lado = i === 0 ? -1 : 1;
      let y = lado * 0.17;
      let x = 0.02;
      let z = 0;
      // POSANDO: a direita abre para fora e para cima, como um leque
      if (lado > 0 && pose > 0) {
        y += (lado * 0.17 - lado * 1.05 - y) * pose;
        x += (0.45 + Math.sin(t * 6) * 0.04 - x) * pose;
        z += (lado * 0.35 - z) * pose;
      }
      // ENCANTADA: as duas batendo
      if (encanto > 0) {
        y += (lado * 0.17 - lado * (0.25 + Math.abs(Math.sin(t * 13)) * 0.55) - y) * encanto;
        x += (0.3 - x) * encanto;
      }
      const k = Math.min(1, dt * 9);
      asa.rotation.y += (y - asa.rotation.y) * k;
      asa.rotation.x += (x - asa.rotation.x) * k;
      asa.rotation.z += (z - asa.rotation.z) * k;
    }

    // ------------------------------------------------ o pescoço e a cabeça
    /*
     * A pose do pescoço é a mistura das três (repouso, exame, orgulho). O
     * exame VARRE: o último gomo e a cabeça sobem e descem devagar, medindo
     * a roupa de cima a baixo. Andando, a cabeça vai para a frente e volta a
     * cada passo (o andar de ave), com o último gomo segurando o bico firme.
     */
    const varre = Math.sin(t * 1.6) * 0.22;
    const bob = andando ? Math.sin(fase * 2) * 0.09 : 0;
    for (let i = 0; i < 5; i++) {
      let alvo = REPOUSO[i] + (EXAME[i] - REPOUSO[i]) * exame;
      alvo += (ORGULHO[i] - alvo) * pose;
      if (i === 3 || i === 4) alvo += varre * exame;
      if (i === 0) alvo += bob;
      if (i === 3) alvo -= bob * 0.6;
      if (i === 2) alvo += encanto * Math.sin(t * 7) * 0.12 + Math.sin(t * 0.9) * 0.02;
      this.anguloDoPescoco[i] += (alvo - this.anguloDoPescoco[i]) * Math.min(1, dt * 6);
    }
    this.moldarPescoco();
    // a cabeça tomba de charme posando, e balança contente
    this.cabeca.rotation.z = pose * 0.16 + encanto * Math.sin(t * 6) * 0.1 + Math.sin(t * 0.6) * 0.03;
    this.cabeca.rotation.y = exame * Math.sin(t * 0.9) * 0.12;

    // ------------------------------------- o que balança (o lenço, a bolsinha)
    const vento = andando ? 1 : 0.35;
    for (const [i, b] of this.balancantes.entries()) {
      b.obj.rotation.x = b.base + Math.sin(t * b.vel + i * 1.3) * b.amp * vento + (andando ? Math.abs(Math.sin(fase)) * b.amp : 0);
    }

    // ------------------------------------------------------------- a piscada
    this.proximaPiscada -= dt;
    let abertura = 0.92;
    if (this.proximaPiscada < 0.14) abertura = Math.max(0.08, Math.abs(this.proximaPiscada - 0.07) / 0.07) * 0.92;
    if (this.proximaPiscada <= 0) this.proximaPiscada = 2.4 + this.sorte() * 3;
    abertura = Math.min(abertura, 0.92 - exame * 0.38, 1 - encanto * 0.78);
    for (const olho of this.olhos) olho.scale.y = abertura;
  }
}
