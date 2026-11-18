import * as THREE from 'three';
import { toon } from '../../core/materials';
import { fundir } from '../../world/fundir';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';
import type { VozDaFala } from '../../core/types';

/**
 * O PIETRO — o pavão MOTORISTA da Valentina (`docs/CARROS-DA-ESCOLA.md` §4).
 * O Renan quis a limusine conversível rosa dela e "um personagem novo" ao
 * volante; o pavão foi a proposta (nome provisório, como o da Valentina, de
 * Milão). A graça é o contraste: ela é a estrela, ele é sério, educado e de
 * uniforme — e em serviço NÃO abre o leque (a cauda vai dobrada). Quando
 * abrir (`abrirLeque`), é acontecimento.
 *
 * O que faz ele ser lido como PAVÃO, nesta ordem:
 *
 * 1. a CAUDA comprida, verde-bronze, com os OCELOS (o "olho" de cada pena:
 *    anel bronze, turquesa e o miolo azul-noite) — dezessete penas num lote
 *    só, deitadas para trás e para baixo; abertas, um leque em pé;
 * 2. o AZUL do pescoço e do peito, com o babador mais claro;
 * 3. o TOPETE em leque, de hastes finas com a pontinha em pá;
 * 4. a cara com a MÁSCARA BRANCA em volta do olho.
 *
 * O que faz ele ser o MOTORISTA: o QUEPE de chofer (copa larga, pala
 * brilhante, o cordão e o emblema dourados — o topete escapa por TRÁS), o
 * colarinho branco com a GRAVATA-BORBOLETA, os três botões dourados no peito e
 * as LUVAS BRANCAS nas pontas das asas (é a asa que vai ao volante).
 *
 * Medidas em metros de verdade: em pé, o alto do quepe fica em ~1,25 —
 * menor que a Valentina, a estrela.
 */

/** o pivô de cada perna, a base do pescoço e onde a cabeça fica */
export const MEDIDAS_DO_PAVAO = {
  quadril: { y: 0.4, x: 0.07, z: -0.02 },
  ovo: { y: 0.62, z: -0.02, rx: 0.17, ry: 0.22, rz: 0.25, inclina: -0.5 },
  cabeca: { y: 1.02, z: 0.15, rx: 0.1, ry: 0.1, rz: 0.11 },
  /** a raiz da cauda (no corpo) */
  cauda: { y: 0.5, z: -0.22 },
  /** o ombro da asa */
  ombro: { x: 0.15, y: 0.76, z: 0.03 },
  /** o comprimento da asa até a ponta da luva */
  asa: 0.3,
} as const;
const M = MEDIDAS_DO_PAVAO;
const PENAS = 23;

/** a pose de MOTORISTA: sentado, as asas no volante (o giro dele, em radianos) e a cabeça virada para quem conversa */
export interface PoseDoPavaoAoVolante {
  volante: number;
  /** para onde a cabeça olha, em radianos de giro (0 em frente; positivo vira para o `+X`, negativo para o `−X`) */
  olhar: number;
}

/** uma pena da cauda: haste e lâmina deitadas no `+Z` (comprimento 1), o ocelo na ponta, a cor nos vértices */
function geoDaPena(): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  const pintar = (geo: THREE.BufferGeometry, cor: (y: number) => THREE.Color): THREE.BufferGeometry => {
    const pos = geo.getAttribute('position');
    const cores = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const c = cor(pos.getY(i));
      cores[i * 3] = c.r; cores[i * 3 + 1] = c.g; cores[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    return geo;
  };
  // a lâmina: fina na raiz, alarga para a ponta e fecha redonda (no plano XY, o comprimento no Y)
  const forma = new THREE.Shape();
  forma.moveTo(0.012, 0);
  forma.bezierCurveTo(0.04, 0.3, 0.075, 0.6, 0.1, 0.8);
  forma.bezierCurveTo(0.13, 0.94, 0.07, 1.02, 0, 1.02);
  forma.bezierCurveTo(-0.07, 1.02, -0.13, 0.94, -0.1, 0.8);
  forma.bezierCurveTo(-0.075, 0.6, -0.04, 0.3, -0.012, 0);
  const escura = new THREE.Color(P.pavaoCauda), clara = new THREE.Color(P.pavaoCaudaClara);
  const bronze = new THREE.Color(P.pavaoBronze);
  partes.push(pintar(new THREE.ShapeGeometry(forma, 10), (y) => {
    // a raiz bronze, o meio verde e a franja clara perto do olho
    if (y < 0.25) return bronze.clone().lerp(escura, y / 0.25);
    return escura.clone().lerp(clara, Math.min(1, (y - 0.25) / 0.6) * 0.75);
  }));
  // o ocelo: três discos empilhados um fio acima da lâmina (o anel bronze, o turquesa e o miolo de coração)
  for (const [r, cor, sobe, dy] of [
    [0.078, P.pavaoBronze, 0.002, 0.855], [0.058, P.pavaoOcelo, 0.004, 0.86], [0.032, P.pavaoOceloMiolo, 0.006, 0.865],
  ] as const) {
    const disco = new THREE.CircleGeometry(r, 16);
    disco.scale(1, 1.18, 1);
    disco.translate(0, dy, sobe);
    const c = new THREE.Color(cor);
    partes.push(pintar(disco, () => c));
  }
  // a haste: uma fitinha bronze por cima da lâmina, da raiz até o olho
  const haste = new THREE.PlaneGeometry(0.01, 0.78);
  haste.translate(0, 0.4, 0.001);
  partes.push(pintar(haste, () => bronze));
  const g = mergeSimples(partes);
  // deitada: o comprimento vai para o `+Z`, e a face de cima para o `+Y`
  g.rotateX(Math.PI / 2);
  g.rotateZ(Math.PI);
  return g;
}

/** junta geometrias de mesmos atributos (posição, normal, uv, cor), sem índice */
function mergeSimples(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const planas = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = planas.reduce((n, g) => n + g.getAttribute('position').count, 0);
  const saida = new THREE.BufferGeometry();
  for (const [nome, tam] of [['position', 3], ['normal', 3], ['color', 3]] as const) {
    const arr = new Float32Array(total * tam);
    let o = 0;
    for (const g of planas) {
      const a = g.getAttribute(nome) as THREE.BufferAttribute;
      arr.set(a.array as Float32Array, o);
      o += a.count * tam;
    }
    saida.setAttribute(nome, new THREE.BufferAttribute(arr, tam));
  }
  return saida;
}

export class Pavao extends Bicho {
  static readonly voz: VozDaFala = { nome: 'Pietro', cor: P.falaPietro };

  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly crista = new THREE.Group();
  private readonly pernas: THREE.Group[] = [];
  private readonly asas: THREE.Group[] = [];
  private readonly olhos: THREE.Group[] = [];
  private readonly luvas: THREE.Object3D[] = [];
  private cauda!: THREE.InstancedMesh;
  private relogio = 0;
  private passada = 0;
  private proximaPiscada = 2.2;
  /** o leque: 0 dobrado (em serviço), 1 aberto; e para onde ele vai */
  private leque = 0;
  private alvoDoLeque = 0;
  /** a cauda só é refeita quando mexe (ou balança) */
  private caudaFeita = -1;
  /**
   * AO VOLANTE (a limusine da Valentina): sentado, as pernas para a frente, as
   * asas nas dez e dez e a cabeça para onde a cena mandar. Nasce desligado; o
   * `animar` só escreve dentro do `if`.
   */
  aoVolante: PoseDoPavaoAoVolante | null = null;

  constructor(area: AreaDoBicho) {
    super(area, {
      // sério e sem pressa: anda devagar e para bastante (é chofer, espera)
      velocidade: 0.55,
      descansoMin: 1.5,
      descansoMax: 4,
      chanceDeSentar: 0,
      somCadaMin: 1e6,
      somCadaMax: 1e6,
      duracaoDoCarinho: 1.6,
      semente: 20261118,
    });
    this.montar();
    // o que se mexe sozinho tem nome (o corpo, as pernas, as asas e as luvas, a cabeça, o topete, os olhos, a cauda):
    // o resto se junta por material dentro de cada um
    fundir(this.group);
    this.prontoParaAparecer('pietro');
  }

  /** abre (ou dobra) o leque da cauda, devagar */
  abrirLeque(sim: boolean): void {
    this.alvoDoLeque = sim ? 1 : 0;
  }
  get aberturaDoLeque(): number {
    return this.leque;
  }
  /** o crânio (o teste mede a cabeça, o quepe e o rosto por ele) */
  get cabecaDoPavao(): THREE.Object3D {
    return this.cabeca;
  }
  /** a ponta de cada luva, no mundo: [esquerda, direita] */
  pontaDaLuva(lado: 0 | 1, alvo = new THREE.Vector3()): THREE.Vector3 {
    return this.luvas[lado].getWorldPosition(alvo);
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const azul = toon(P.pavaoAzul);
    const azulClaro = toon(P.pavaoAzulClaro);
    const branco = toon(P.pavaoRosto);
    const dourado = toon(P.motoristaDourado);
    this.corpo.name = 'corpo-do-pavao';
    this.group.add(this.corpo);

    // ------------------------------------------------------------- as pernas
    const perna = toon(P.pavaoPerna);
    for (const lado of [-1, 1] as const) {
      const quadril = new THREE.Group();
      quadril.name = lado < 0 ? 'perna-esquerda' : 'perna-direita';
      quadril.position.set(lado * M.quadril.x, M.quadril.y, M.quadril.z);
      const coxa = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), azul);
      coxa.scale.set(0.05, 0.08, 0.06);
      coxa.position.y = -0.02;
      quadril.add(coxa);
      const tarso = new THREE.Mesh(new THREE.CapsuleGeometry(0.017, 0.3, 3, 8), perna);
      tarso.position.y = -0.2;
      quadril.add(tarso);
      // os dedos: três para a frente, abertos, e um para trás
      for (const [giro, comp] of [[-0.45, 0.07], [0, 0.085], [0.45, 0.07], [Math.PI, 0.045]] as const) {
        const dedo = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, comp, 3, 6), perna);
        dedo.rotation.set(Math.PI / 2, 0, 0);
        const pivo = new THREE.Group();
        pivo.position.y = -M.quadril.y + 0.012;
        pivo.rotation.y = giro;
        dedo.position.z = comp / 2 + 0.01;
        pivo.add(dedo);
        quadril.add(pivo);
      }
      this.corpo.add(quadril);
      this.pernas.push(quadril);
    }

    // ------------------------------------------------------- o ovo e o peito
    const ovo = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), azul);
    ovo.scale.set(M.ovo.rx, M.ovo.ry, M.ovo.rz);
    ovo.position.set(0, M.ovo.y, M.ovo.z);
    ovo.rotation.x = M.ovo.inclina;
    this.corpo.add(ovo);
    // o babador mais claro, o brilho do peito de pavão
    const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), azulClaro);
    peito.scale.set(0.115, 0.16, 0.1);
    peito.position.set(0, 0.69, 0.1);
    peito.rotation.x = -0.25;
    this.corpo.add(peito);
    // os três botões dourados do uniforme, pregados no babador
    for (const [i, y] of [0.73, 0.66, 0.59].entries()) {
      const k = (y - 0.69) / 0.16;
      const z = 0.1 + 0.1 * Math.sqrt(Math.max(0, 1 - k * k)) + 0.012 - Math.abs(k) * 0.02;
      const botao = new THREE.Mesh(new THREE.SphereGeometry(0.0105, 8, 6), dourado);
      botao.scale.z = 0.6;
      botao.position.set(0, y + i * 0, z);
      this.corpo.add(botao);
    }

    // ------------------------------------------------------------- o pescoço
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.7, 0.08),
      new THREE.Vector3(0, 0.82, 0.15),
      new THREE.Vector3(0, 0.93, 0.165),
      new THREE.Vector3(0, 1.0, 0.15),
    ]);
    this.corpo.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 12, 0.062, 12, false), azul));
    // o colarinho branco e a gravata-borboleta, na base do pescoço
    const colarinho = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.014, 8, 20), branco);
    colarinho.position.set(0, 0.835, 0.15);
    colarinho.rotation.x = Math.PI / 2 - 0.45;
    this.corpo.add(colarinho);
    const preto = toon(P.motoristaQuepe);
    const no = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), preto);
    no.position.set(0, 0.812, 0.222);
    this.corpo.add(no);
    for (const lado of [-1, 1] as const) {
      const aba = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.05, 10), preto);
      aba.rotation.z = lado * Math.PI / 2;
      aba.scale.z = 0.45;
      aba.position.set(lado * 0.03, 0.812, 0.217);
      this.corpo.add(aba);
    }

    // -------------------------------------------------------------- as asas
    const asa = toon(P.pavaoAsa);
    const listra = toon(P.pavaoAsaListra);
    const luva = toon(P.motoristaLuva);
    for (const lado of [-1, 1] as const) {
      const ombro = new THREE.Group();
      ombro.name = lado < 0 ? 'asa-esquerda' : 'asa-direita';
      ombro.position.set(lado * M.ombro.x, M.ombro.y, M.ombro.z);
      // a asa pende como um braço, larga no ombro e afinando para a luva
      const pa = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), asa);
      pa.scale.set(0.036, 0.15, 0.085);
      pa.position.set(lado * 0.012, -0.13, -0.01);
      ombro.add(pa);
      // as listras escuras de asa de pavão, três barras atravessadas
      for (const [dy, larg] of [[-0.07, 0.07], [-0.13, 0.065], [-0.19, 0.05]] as const) {
        const barra = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6), listra);
        barra.scale.set(0.038, 0.012, larg);
        barra.position.set(lado * 0.013, dy, -0.012);
        ombro.add(barra);
      }
      // a luva branca na ponta: a palma, três dedos e o punho
      const mao = new THREE.Group();
      mao.name = lado < 0 ? 'luva-esquerda' : 'luva-direita';
      mao.position.set(lado * 0.01, -M.asa + 0.035, 0.0);
      mao.scale.setScalar(1.3);
      const palma = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), luva);
      palma.scale.set(0.028, 0.034, 0.03);
      mao.add(palma);
      for (const dz of [-0.016, 0, 0.016]) {
        const dedo = new THREE.Mesh(new THREE.CapsuleGeometry(0.0095, 0.024, 3, 6), luva);
        dedo.position.set(0, -0.034, dz);
        mao.add(dedo);
      }
      const punho = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 6, 14), luva);
      punho.rotation.x = Math.PI / 2;
      punho.position.y = 0.03;
      mao.add(punho);
      const ponta = new THREE.Object3D();
      ponta.name = lado < 0 ? 'ponta-da-luva-esquerda' : 'ponta-da-luva-direita';
      ponta.position.y = -0.05;
      mao.add(ponta);
      ombro.add(mao);
      this.luvas.push(ponta);
      this.corpo.add(ombro);
      this.asas.push(ombro);
    }

    // ------------------------------------------------------------- a cauda
    this.cauda = new THREE.InstancedMesh(geoDaPena(), toon(0xffffff, { corPorVertice: true, doubleSide: true }), PENAS);
    this.cauda.name = 'cauda-do-pavao';
    this.cauda.frustumCulled = false;
    this.corpo.add(this.cauda);
    // a raiz fofa de onde as penas saem (as coberteiras): sem ela, a cauda parecia um feixe de fios espetado no corpo
    const raiz = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), toon(P.pavaoCauda));
    raiz.scale.set(0.13, 0.06, 0.2);
    raiz.position.set(0, M.cauda.y - 0.035, M.cauda.z - 0.1);
    raiz.rotation.x = 0.4;
    this.corpo.add(raiz);

    this.montarCabeca();
  }

  private montarCabeca(): void {
    const azul = toon(P.pavaoAzul);
    const branco = toon(P.pavaoRosto);
    const C = M.cabeca;
    this.cabeca.name = 'cabeca-do-pavao';
    this.cabeca.position.set(0, C.y, C.z);
    this.corpo.add(this.cabeca);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 18), azul);
    cranio.scale.set(C.rx, C.ry, C.rz);
    this.cabeca.add(cranio);
    const naCara = (x: number, y: number): { p: THREE.Vector3; n: THREE.Vector3 } => {
      const z = C.rz * Math.sqrt(Math.max(0, 1 - (x / C.rx) ** 2 - (y / C.ry) ** 2));
      const n = new THREE.Vector3(x / C.rx ** 2, y / C.ry ** 2, z / C.rz ** 2).normalize();
      return { p: new THREE.Vector3(x, y, z), n };
    };
    const naPele = (o: THREE.Object3D, x: number, y: number, folga = 0.001): void => {
      const { p, n } = naCara(x, y);
      o.position.copy(p).addScaledVector(n, folga);
      o.lookAt(o.position.clone().add(n));
      this.cabeca.add(o);
    };

    // a máscara branca de pavão: a meia-lua debaixo do olho (o risco de cima, que o pavão tem, ficava embaixo da pala
    // e lia como um dentinho)
    for (const lado of [-1, 1] as const) {
      const baixo = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), branco);
      baixo.scale.set(0.03, 0.017, 0.004);
      naPele(baixo, lado * 0.052, -0.012, 0.0015);
      baixo.rotateZ(lado * 0.25);
    }

    // o olho colado na cara (o molde do Flynn e da Valentina)
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Group();
      olho.name = lado < 0 ? 'olho-esquerdo' : 'olho-direito';
      const escuro = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), toon(P.pavaoPupila));
      escuro.scale.set(0.016, 0.02, 0.004);
      olho.add(escuro);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), toon(P.pavaoOlho));
      iris.scale.set(0.012, 0.009, 0.003);
      iris.position.set(0, -0.0075, 0.0025);
      olho.add(iris);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), branco);
      brilho.scale.set(0.006, 0.006, 0.002);
      brilho.position.set(lado * 0.005, 0.008, 0.004);
      olho.add(brilho);
      const brilhinho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), branco);
      brilhinho.scale.set(0.0028, 0.0028, 0.0015);
      brilhinho.position.set(-lado * 0.005, -0.005, 0.005);
      olho.add(brilhinho);
      naPele(olho, lado * 0.046, 0.014, 0.002);
      this.olhos.push(olho);
      const blush = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.valentinaBochecha));
      blush.scale.set(0.013, 0.008, 0.003);
      naPele(blush, lado * 0.066, -0.03, 0.0015);
    }

    // o bico: curto, claro, um tico para baixo
    const bico = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 10), toon(P.pavaoBico));
    bico.rotation.x = Math.PI / 2 + 0.3;
    bico.scale.x = 0.85;
    bico.position.set(0, -0.022, C.rz + 0.018);
    this.cabeca.add(bico);

    // o topete em leque, escapando por TRÁS do quepe
    this.crista.name = 'topete-do-pavao';
    this.crista.position.set(0, 0.07, -0.045);
    this.crista.rotation.x = -0.35;
    const haste = toon(P.pavaoBronze);
    const pazinha = toon(P.pavaoCrista);
    const miolo = toon(P.pavaoOceloMiolo);
    for (let i = 0; i < 7; i++) {
      const a = (i - 3) * 0.17;
      const pena = new THREE.Group();
      pena.rotation.z = a;
      const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0035, 0.13, 5), haste);
      fio.position.y = 0.065;
      pena.add(fio);
      const pa = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), pazinha);
      pa.scale.set(0.016, 0.022, 0.006);
      pa.position.y = 0.14;
      pena.add(pa);
      const ponto = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), miolo);
      ponto.scale.set(0.007, 0.009, 0.0065);
      ponto.position.set(0, 0.142, 0.001);
      pena.add(ponto);
      this.crista.add(pena);
    }
    this.cabeca.add(this.crista);

    // o QUEPE de chofer: a faixa, a copa larga, a pala, o cordão e o emblema
    const quepe = new THREE.Group();
    quepe.name = 'quepe-do-motorista';
    quepe.position.set(0, 0.075, 0.012);
    quepe.rotation.x = 0.14;
    const preto = toon(P.motoristaQuepe);
    const dourado = toon(P.motoristaDourado);
    const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.087, 0.038, 24), preto);
    quepe.add(faixa);
    const copa = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.092, 0.034, 24), preto);
    copa.position.y = 0.034;
    quepe.add(copa);
    const tampo = new THREE.Mesh(new THREE.SphereGeometry(0.112, 24, 6, 0, Math.PI * 2, 0, Math.PI / 2), preto);
    tampo.scale.y = 0.16;
    tampo.position.y = 0.05;
    quepe.add(tampo);
    const pala = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.008, 18, 1, false, -Math.PI / 2, Math.PI), preto);
    pala.scale.z = 0.75;
    pala.position.set(0, -0.016, 0.055);
    pala.rotation.x = 0.32;
    quepe.add(pala);
    const cordao = new THREE.Mesh(new THREE.CapsuleGeometry(0.0045, 0.12, 3, 6), dourado);
    cordao.rotation.z = Math.PI / 2;
    cordao.position.set(0, -0.004, 0.09);
    quepe.add(cordao);
    const emblema = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), dourado);
    emblema.scale.z = 0.45;
    emblema.position.set(0, 0.03, 0.107);
    emblema.rotation.x = -0.25;
    quepe.add(emblema);
    this.cabeca.add(quepe);
  }

  // ---------------------------------------------------------------- a cauda

  /** cada pena: dobrada (deitada para trás e para baixo, em escamas) e aberta (o leque em pé) */
  private refazerCauda(t: number): void {
    const k = this.leque;
    const dobrada = new THREE.Object3D(), aberta = new THREE.Object3D();
    const q = new THREE.Quaternion(), m = new THREE.Matrix4();
    const base = new THREE.Vector3(0, M.cauda.y, M.cauda.z);
    const balanco = Math.sin(t * 1.3) * 0.025;
    for (let i = 0; i < PENAS; i++) {
      const u = i / (PENAS - 1);
      // DOBRADA: um vestido de penas deitado para trás até quase o chão — as mais compridas embaixo e no meio, as
      // de cima mais curtas e abrindo para os lados, em escama, para cada olho aparecer
      const fileira = i % 3, lado = (fileira - 1) * (0.35 + 0.45 * (1 - u));
      dobrada.rotation.order = 'YXZ';
      if (this.aoVolante) {
        // AO VOLANTE a cauda não cabe no carro: vai para o lado da porta (o −X), por cima dela, e pende para fora
        dobrada.position.copy(base).add(new THREE.Vector3(-0.12 - i * 0.002, 0.08 + i * 0.006, 0.05 + lado * 0.05));
        dobrada.rotation.set(0.25 - u * 0.05, -Math.PI / 2 + lado * 0.25 + balanco, lado * 0.3);
      } else {
        dobrada.position.copy(base).add(new THREE.Vector3(lado * 0.06, 0.01 + i * 0.006, -i * 0.003));
        dobrada.rotation.set(0.47 - u * 0.12, Math.PI + lado * 0.32 + balanco, lado * 0.35);
      }
      dobrada.scale.setScalar(1.0 - u * 0.5);
      dobrada.updateMatrix();
      // ABERTA: as penas em roda, em pé atrás do corpo, viradas para a frente
      const a = (u - 0.5) * 2.7 + balanco * 0.5;
      const dir = new THREE.Vector3(Math.sin(a), Math.cos(a), -0.18).normalize();
      const cima = new THREE.Vector3(0, 0, 1).addScaledVector(dir, -dir.z).normalize();
      const x = new THREE.Vector3().crossVectors(cima, dir).normalize();
      m.makeBasis(x, cima, dir);
      aberta.position.copy(base).add(new THREE.Vector3(0, 0.12, -0.02 - Math.abs(u - 0.5) * 0.02 + (i % 2) * 0.006));
      aberta.quaternion.setFromRotationMatrix(m);
      aberta.scale.setScalar(0.92 - Math.abs(u - 0.5) * 0.2);
      aberta.updateMatrix();
      // a mistura das duas
      const pos = dobrada.position.clone().lerp(aberta.position, k);
      dobrada.updateMatrix();
      q.copy(new THREE.Quaternion().setFromEuler(dobrada.rotation)).slerp(aberta.quaternion, k);
      const esc = THREE.MathUtils.lerp(dobrada.scale.x, aberta.scale.x, k);
      m.compose(pos, q, new THREE.Vector3(esc, esc, esc));
      this.cauda.setMatrixAt(i, m);
    }
    this.cauda.instanceMatrix.needsUpdate = true;
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando }: PoseDoBicho): void {
    this.relogio += dt;
    const t = this.relogio;
    const volante = this.aoVolante;
    const suave = Math.min(1, dt * 6);

    // o leque abre devagar (é acontecimento) e a cauda balança um tico
    this.leque += (this.alvoDoLeque - this.leque) * Math.min(1, dt * 1.8);
    if (Math.abs(this.leque - this.caudaFeita) > 0.002 || this.leque > 0.01 || andando || !volante) {
      this.refazerCauda(t);
      this.caudaFeita = this.leque;
    }

    // o respiro e o passo
    if (andando) this.passada += dt * 7;
    const passo = andando ? Math.sin(this.passada) : 0;
    this.corpo.position.y = Math.sin(t * 1.7) * 0.005 + (andando ? Math.abs(passo) * 0.012 : 0);

    // as pernas: andando, o passo; ao volante, sentado com as pernas para a frente
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      const alvo = volante ? -Math.PI / 2 + 0.15 : passo * 0.5 * lado;
      perna.rotation.x += (alvo - perna.rotation.x) * Math.min(1, dt * 10);
    }

    // as asas: penduradas como braços; ao volante, para a frente nas dez e dez, subindo e descendo com o giro
    for (const [i, asa] of this.asas.entries()) {
      const lado = i === 0 ? -1 : 1;
      let x = andando ? -passo * 0.25 * lado : 0.1;
      let z = lado * 0.12;
      if (volante) {
        x = -1.25 + lado * THREE.MathUtils.clamp(volante.volante, -1.4, 1.4) * 0.2;
        z = -lado * 0.18;
      }
      asa.rotation.x += (x - asa.rotation.x) * suave;
      asa.rotation.z += (z - asa.rotation.z) * suave;
    }

    // a cabeça: o balancinho de pavão andando, e ao volante olhando para onde a cena manda
    const olhar = volante ? volante.olhar : Math.sin(t * 0.45) * 0.25;
    this.cabeca.rotation.y += (olhar - this.cabeca.rotation.y) * Math.min(1, dt * 4);
    this.cabeca.position.z = M.cabeca.z + (andando ? Math.sin(this.passada * 2) * 0.012 : 0);
    this.cabeca.rotation.z = Math.sin(t * 1.1) * 0.03;
    // o topete balança atrasado
    this.crista.rotation.z = Math.sin(t * 2.3) * 0.06 + (andando ? Math.sin(this.passada * 2 - 0.6) * 0.08 : 0);

    // a piscada
    this.proximaPiscada -= dt;
    let abertura = 1;
    if (this.proximaPiscada < 0.14) abertura = Math.max(0.08, Math.abs(this.proximaPiscada - 0.07) / 0.07);
    if (this.proximaPiscada <= 0) this.proximaPiscada = 2.4 + this.sorte() * 3;
    for (const olho of this.olhos) olho.scale.y = abertura;
  }
}
