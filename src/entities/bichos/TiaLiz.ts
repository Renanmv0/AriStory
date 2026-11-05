import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { fundir } from '../../world/fundir';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';
import type { VozDaFala } from '../../core/types';

/**
 * A TIA LIZ — a tia da cantina da Escola do Gatito. Uma ursa venezuelana com
 * jeito de mãe: firme quando precisa ("primeiro a sopita, depois o doce"), e
 * carinhosa no fim de toda conversa. O nome, o jeito e a comida vêm do Renan,
 * e a referência é de verdade (ver `docs/ESCOLA.md`, §18) — por isso o
 * cuidado é ela sair FOFA: uma ursinha bonita, de bochecha rosada e sorrisão,
 * e nunca uma ursa pesada ou desajeitada.
 *
 * O QUE FAZ ELA SER LIDA COMO URSA, nesta ordem:
 *
 * 1. as ORELHAS REDONDAS no alto da cabeça, saindo do meio do cabelo;
 * 2. o FOCINHO claro e curto, com o nariz de chocolate arredondado;
 * 3. o corpo REDONDINHO e a cabeça grande (a régua chibi da escola), com o
 *    rabinho de bolota atrás.
 *
 * O QUE DIZ QUE ELA É A TIA LIZ (a foto do Renan):
 *
 *  - os CACHOS LOIRO-DOURADOS, volumosos, com a raiz mais escura — um
 *    "capacete" de raiz e, por cima, dezenas de cachinhos e as molinhas que
 *    caem até o ombro;
 *  - as TRANCINHAS rentes de um lado da cabeça (o lado ESQUERDO de quem olha,
 *    como na foto: o `-X` da peça), terminando numa trança que cai atrás da
 *    orelha;
 *  - a BLUSA VERDE-OLIVA de manguinha, gola padre e o RECORTE EM GOTA no
 *    peito, com o botãozinho na gola;
 *  - o COLAR da TORRE EIFFEL dourada, pendurado na frente do recorte;
 *  - o ANEL dourado, o RELÓGIO no pulso e as UNHAS LILÁS (as garrinhas da
 *    ursa, pintadas);
 *  - o SORRISÃO de boca aberta.
 *
 * O QUE DIZ QUE ELA É DA CANTINA: o AVENTAL creme amarrado na cintura, com a
 * barra nas três cores da bandeira da Venezuela (amarelo, azul e vermelho) e o
 * bolso com um coraçãozinho bordado; e o tamanco lilás de cozinha.
 *
 * GESTOS que a cena aciona: MEXER A PANELA (o jeito dela parada atrás do
 * balcão, com a concha), SERVIR (as duas patas para a frente, com o prato na
 * `bandeja`), as MÃOS NA CINTURA (a tia brava — sobrancelha franzida e a boca
 * apertada; dura pouco) e ACENAR.
 *
 * Os pedaços se juntam (`fundir`) no fim: cada grupo que mexe tem NOME, e é
 * dentro dele que os pedaços do mesmo material viram uma malha só.
 */

/** a escala do corpo: montado em números de bicho, cresce no fim (ver `montar`) */
const ESCALA = 1.12;

/** o crânio (elipsoide), no referencial da cabeça */
const CRANIO = { x: 0.25, y: 0.225, z: 0.23 };
/** a blusa (o elipsoide do tronco), no referencial do corpo */
const BLUSA = { y: 0.72, rx: 0.2, ry: 0.25, rz: 0.165 };
/** os três raios da blusa, no formato que `naCasca` lê */
const RAIOS_DA_BLUSA = { x: BLUSA.rx, y: BLUSA.ry, z: BLUSA.rz };
/** o ombro, onde o braço se prende */
const OMBRO = { x: 0.19, y: 0.875 };
/** o comprimento do braço até o cotovelo, e do cotovelo ao meio da pata */
const BRACO = { cima: 0.16, antebraco: 0.16 };

/** um ponto num elipsoide centrado em `c`, na frente (+Z), e a normal ali */
function naCasca(
  c: { x?: number; y: number; z?: number }, r: { x: number; y: number; z: number },
  x: number, y: number, folga = 0, costas = false,
): { p: THREE.Vector3; n: THREE.Vector3 } {
  const cx = c.x ?? 0;
  const cz = c.z ?? 0;
  const u = 1 - ((x - cx) / r.x) ** 2 - ((y - c.y) / r.y) ** 2;
  const dz = r.z * Math.sqrt(Math.max(0, u)) * (costas ? -1 : 1);
  const n = new THREE.Vector3((x - cx) / r.x ** 2, (y - c.y) / r.y ** 2, dz / r.z ** 2).normalize();
  const p = new THREE.Vector3(x, y, cz + dz).addScaledVector(n, folga);
  return { p, n };
}

/** vira `o` para a normal `n` (o +Z local passa a apontar para fora) */
function virarPara(o: THREE.Object3D, n: THREE.Vector3): void {
  o.lookAt(o.position.clone().add(n));
}

/** A GOTA do recorte da blusa: a ponta para cima, a barriga redonda embaixo */
function formaDeGota(alto: number): THREE.Shape {
  const r = alto * 0.28;
  const cy = -alto / 2 + r;
  const topo = alto / 2;
  const d = topo - cy;
  const a = Math.asin(r / d);
  const s = new THREE.Shape();
  s.moveTo(0, topo);
  const t1 = Math.PI / 2 - (Math.PI / 2 - a);
  s.lineTo(Math.cos(t1) * r, cy + Math.sin(t1) * r);
  s.absarc(0, cy, r, t1, Math.PI - t1 - Math.PI * 2, true);
  s.lineTo(0, topo);
  return s;
}

/** O CORAÇÃOZINHO bordado no bolso do avental (e, na cena, o do prato) */
export function formaDeCoracao(l: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, -l * 0.5);
  s.bezierCurveTo(-l * 0.1, -l * 0.35, -l * 0.55, -l * 0.1, -l * 0.5, l * 0.18);
  s.bezierCurveTo(-l * 0.45, l * 0.5, -l * 0.05, l * 0.5, 0, l * 0.22);
  s.bezierCurveTo(l * 0.05, l * 0.5, l * 0.45, l * 0.5, l * 0.5, l * 0.18);
  s.bezierCurveTo(l * 0.55, -l * 0.1, l * 0.1, -l * 0.35, 0, -l * 0.5);
  return s;
}

/**
 * A TORRE EIFFEL do colar: a silhueta (as quatro pernas abertas embaixo, o
 * arco entre elas, a cintura, os dois andares e a agulha), num recorte
 * extrudado bem fino. De longe ela é um triângulo dourado comprido; de perto,
 * é a torre.
 */
function torreEiffel(alto: number, ouro: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  g.name = 'pingente-torre-eiffel';
  const k = alto / 0.062;
  const p = (x: number, y: number): [number, number] => [x * k, y * k];
  const s = new THREE.Shape();
  const contorno: Array<[number, number]> = [
    p(-0.022, 0), p(-0.014, 0.004), p(-0.012, 0.014), p(-0.016, 0.017), p(-0.016, 0.021),
    p(-0.009, 0.021), p(-0.0065, 0.036), p(-0.0095, 0.038), p(-0.0095, 0.041), p(-0.004, 0.041),
    p(-0.0012, 0.056), p(0, 0.062), p(0.0012, 0.056), p(0.004, 0.041), p(0.0095, 0.041),
    p(0.0095, 0.038), p(0.0065, 0.036), p(0.009, 0.021), p(0.016, 0.021), p(0.016, 0.017),
    p(0.012, 0.014), p(0.014, 0.004), p(0.022, 0),
  ];
  s.moveTo(...contorno[0]);
  for (const ponto of contorno.slice(1)) s.lineTo(...ponto);
  // o arco entre as pernas é um furo de verdade: é ele que diz "torre" e não "pinheiro"
  const arco = new THREE.Path();
  arco.moveTo(0.0085 * k, 0);
  arco.absarc(0, 0, 0.0085 * k, 0, Math.PI, false);
  arco.lineTo(0.0085 * k, 0);
  s.holes.push(arco);
  const torre = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.0028, bevelEnabled: false, curveSegments: 6 }), ouro);
  torre.position.set(0, -alto, -0.0014);
  g.add(torre);
  // a argolinha que prende na corrente
  const argola = new THREE.Mesh(new THREE.TorusGeometry(0.0035, 0.0011, 5, 10), ouro);
  argola.position.y = 0.002;
  g.add(argola);
  return g;
}

export class TiaLiz extends Bicho {
  /** a voz dela na caixa de fala: o nome e a cor da etiqueta (`vozes.ts`) */
  static readonly voz: VozDaFala = { nome: 'Tia Liz', cor: P.falaLiz };

  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  /** os dois braços, pivô no ombro: [esquerdo (-X), direito (+X)] */
  private readonly bracos: THREE.Group[] = [];
  /** os antebraços, pivô no cotovelo */
  private readonly antebracos: THREE.Group[] = [];
  private readonly pernas: THREE.Group[] = [];
  private readonly olhos: THREE.Group[] = [];
  private readonly sobrancelhas: THREE.Group[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly boca = new THREE.Group();
  /** as molinhas que caem até o ombro: balançam de leve */
  private readonly molas: THREE.Group[] = [];
  /** a concha de sopa, na pata direita: só aparece mexendo a panela */
  private readonly concha = new THREE.Group();

  /**
   * ONDE O PRATO VIAJA quando ela serve: na frente da barriga, na altura das
   * patas esticadas. A cena pendura o prato aqui (`attach`) e depois passa
   * para o balcão — é o contrato da bandeja do Walter.
   */
  readonly bandeja = new THREE.Object3D();

  private relogio = 0;
  private passada = 0;
  private mexendo = false;
  private servirFalta = 0;
  private naCinturaFalta = 0;
  private acenando = 0;
  private misturaMexe = 0;
  private misturaServe = 0;
  private misturaBrava = 0;
  private misturaAceno = 0;
  private proximaPiscada = 2.4;

  constructor(area: AreaDoBicho) {
    super(area, {
      // ela anda pouco: o lugar dela é atrás do balcão, de olho na panela
      velocidade: 0.5,
      descansoMin: 3,
      descansoMax: 6,
      chanceDeSentar: 0,
      // quem fala é a cena; o barulho dela é cantarolar mexendo a panela
      somCadaMin: 14,
      somCadaMax: 30,
      duracaoDoCarinho: 2.5,
      semente: 20261105,
    });
    this.montar();
    fundir(this.group);
    this.prontoParaAparecer('tia-liz');
  }

  // ---------------------------------------------------------------- gestos

  /** parada atrás do balcão, com a concha na panela (o jeito de sempre dela) */
  mexerAPanela(sim: boolean): void {
    this.mexendo = sim;
  }

  /** as duas patas para a frente, com o prato na `bandeja` */
  servir(segundos = 2): void {
    this.servirFalta = Math.max(this.servirFalta, segundos);
  }

  /** as mãos na cintura, sobrancelha franzida: a tia brava (dura pouco) */
  maosNaCintura(segundos = 2.2): void {
    this.naCinturaFalta = Math.max(this.naCinturaFalta, segundos);
  }

  /** a pata direita no alto, abanando */
  acenar(segundos = 1.8): void {
    this.acenando = Math.max(this.acenando, segundos);
  }

  /** o teste pergunta isto */
  get estaMexendo(): boolean {
    return this.misturaMexe > 0.5;
  }
  get estaServindo(): boolean {
    return this.servirFalta > 0;
  }
  get estaBrava(): boolean {
    return this.naCinturaFalta > 0;
  }
  get estaAcenando(): boolean {
    return this.acenando > 0;
  }
  /** o quanto a sobrancelha está franzida agora (0 a 1) */
  get franzido(): number {
    return this.misturaBrava;
  }

  // ------------------------------------------------------------------ corpo

  private montar(): void {
    const pelo = toon(P.lizPelo);
    const blusa = toon(P.lizBlusa);
    const calca = toon(P.lizCalca);
    const ouro = toon(P.lizOuro);

    // ------------------------------------------------------------ as pernas
    /**
     * Pivô no QUADRIL (`y = 0,40`): a perna da calça jeans e o TAMANCO lilás
     * de cozinha, redondinho, com a sola clara. A sola encosta no chão.
     */
    for (const lado of [-1, 1] as const) {
      const perna = new THREE.Group();
      perna.name = lado < 0 ? 'perna-esquerda-da-liz' : 'perna-direita-da-liz';
      perna.position.set(lado * 0.085, 0.4, 0);
      const coxa = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.22, 4, 12), calca);
      coxa.position.y = -0.17;
      perna.add(coxa);
      const barra = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.012, 6, 16), toon(P.lizCalcaBarra));
      barra.rotation.x = Math.PI / 2;
      barra.position.y = -0.315;
      perna.add(barra);
      const tamanco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), toon(P.lizTamanco));
      tamanco.scale.set(0.072, 0.048, 0.112);
      tamanco.position.set(0, -0.352, 0.03);
      perna.add(tamanco);
      const sola = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.022, 18), toon(P.lizTamancoSola));
      sola.scale.set(0.075, 1, 0.115);
      sola.position.set(0, -0.389, 0.03);
      perna.add(sola);
      // os furinhos de ventilação do tamanco, em cima do bico
      for (const [dx, dz] of [[-0.022, 0.07], [0.022, 0.07], [0, 0.088], [-0.03, 0.045], [0.03, 0.045]] as const) {
        const furo = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 6, 5), toon(P.lizTamancoSola));
        const u = 1 - (dx / 0.072) ** 2 - (dz / 0.112) ** 2;
        furo.position.set(dx, -0.352 + 0.048 * Math.sqrt(Math.max(0, u)) - 0.004, 0.03 + dz);
        furo.scale.y = 0.5;
        perna.add(furo);
      }
      this.corpo.add(perna);
      this.pernas.push(perna);
    }

    // ------------------------------------------------- o quadril e o rabinho
    const quadril = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), calca);
    quadril.scale.set(0.17, 0.12, 0.14);
    quadril.position.y = 0.46;
    this.corpo.add(quadril);
    const rabinho = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), pelo);
    rabinho.position.set(0, 0.45, -0.145);
    this.corpo.add(rabinho);

    // --------------------------------------------------------- o tronco: a blusa
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), blusa);
    tronco.scale.set(BLUSA.rx, BLUSA.ry, BLUSA.rz);
    tronco.position.y = BLUSA.y;
    this.corpo.add(tronco);
    // a barra da blusa por cima do quadril: um anel que solta o tecido
    const barraDaBlusa = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.016, 8, 28), blusa);
    barraDaBlusa.rotation.x = Math.PI / 2;
    barraDaBlusa.scale.set(1, 0.84, 1);
    barraDaBlusa.position.y = 0.535;
    this.corpo.add(barraDaBlusa);

    // ----------------------------------------------------- a gola e o pescoço
    const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.09, 16), pelo);
    pescoco.position.y = 1.0;
    this.corpo.add(pescoco);
    /**
     * GOLA PADRE: uma faixa em pé, aberta só na frente (o vão é onde começa o
     * recorte em gota). É um cilindro aberto de face dupla, com o vão virado
     * para o `+Z`.
     */
    const gola = new THREE.Mesh(
      new THREE.CylinderGeometry(0.087, 0.096, 0.05, 28, 1, true, 0.16, Math.PI * 2 - 0.32),
      toon(P.lizBlusa, { doubleSide: true }),
    );
    gola.position.y = 0.975;
    this.corpo.add(gola);
    const debrum = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.006, 5, 28, Math.PI * 2 - 0.32), toon(P.lizBlusaSombra));
    debrum.rotation.set(Math.PI / 2, 0, Math.PI / 2 + 0.16);
    debrum.position.y = 1.0;
    this.corpo.add(debrum);
    // o botãozinho na gola, do lado do vão
    const botao = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), toon(P.lizBotao));
    botao.position.set(0.016, 0.982, 0.094);
    this.corpo.add(botao);

    // o RECORTE EM GOTA: o pelo aparecendo, pousado na casca da blusa
    {
      const { p, n } = naCasca(BLUSA, RAIOS_DA_BLUSA, 0, 0.905, 0.0015);
      const gota = new THREE.Mesh(new THREE.ShapeGeometry(formaDeGota(0.075), 10), pelo);
      gota.position.copy(p);
      virarPara(gota, n);
      // a gota tem que ficar EM PÉ: o `lookAt` mantém o +Y para cima
      this.corpo.add(gota);
      const borda = new THREE.Mesh(new THREE.ShapeGeometry(formaDeGota(0.085), 10), toon(P.lizBlusaSombra));
      borda.position.copy(p).addScaledVector(n, -0.0008);
      virarPara(borda, n);
      this.corpo.add(borda);
    }

    // ------------------------------------------- o colar da Torre Eiffel
    /**
     * A CORRENTE passa por trás do pescoço, desce pelos lados da gola e
     * encontra o pingente na frente do recorte — os pontos da frente saem da
     * casca da blusa, senão ela atravessa o tecido ou voa.
     */
    {
      const frente = (x: number, y: number): THREE.Vector3 => naCasca(BLUSA, RAIOS_DA_BLUSA, x, y, 0.006).p;
      const pontos = [
        new THREE.Vector3(0, 1.0, -0.092),
        new THREE.Vector3(-0.094, 0.99, -0.01),
        frente(-0.06, 0.94),
        frente(-0.022, 0.905),
        frente(0, 0.897),
        frente(0.022, 0.905),
        frente(0.06, 0.94),
        new THREE.Vector3(0.094, 0.99, -0.01),
      ];
      const corrente = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos, true), 48, 0.0022, 5, true), ouro,
      );
      this.corpo.add(corrente);
      const { p, n } = naCasca(BLUSA, RAIOS_DA_BLUSA, 0, 0.87, 0.012);
      const torre = torreEiffel(0.058, ouro);
      torre.position.set(0, 0.897, p.z);
      // levemente deitada no peito, como pingente de verdade
      torre.rotation.x = -Math.atan2(n.y, n.z) * 0.6;
      this.corpo.add(torre);
    }

    this.montarAvental();

    // ------------------------------------------------------------ os braços
    this.montarBracos();

    // ------------------------------------------------------------ a cabeça
    this.montarCabeca();
    this.corpo.add(this.cabeca);

    this.bandeja.position.set(0, 0.86, 0.36);
    this.corpo.add(this.bandeja);

    /**
     * ELA CRESCE NO FIM: montada em números de bicho, a escala 1,12 põe o alto
     * dos cachos um palmo abaixo da cabeça da dupla. É adulta — maior que o
     * Flynn e as coelhinhas — e o ombro fica acima do tampo do balcão da
     * cantina (0,905), com o peito, o colar e o rosto inteiros à mostra.
     */
    this.corpo.scale.setScalar(ESCALA);
    this.group.add(this.corpo);
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
  }

  /**
   * O AVENTAL de cintura: a saia creme na frente (um pedaço de cone aberto),
   * a faixa da cintura dando a volta, o laço atrás, a barra nas três cores
   * da Venezuela e o bolso com o coração bordado.
   */
  private montarAvental(): void {
    const creme = toon(P.lizAvental, { doubleSide: true });
    const ABRE = 3.45;
    const INICIO = -ABRE / 2;
    const TOPO = 0.565;
    const ALTO = 0.36;
    const R0 = 0.172;
    const R1 = 0.24;
    const ACHATA = 0.86;
    const raioEm = (y: number): number => R0 + ((TOPO - y) / ALTO) * (R1 - R0);
    const saia = new THREE.Mesh(new THREE.CylinderGeometry(R0, R1, ALTO, 32, 1, true, INICIO, ABRE), creme);
    saia.scale.z = ACHATA;
    saia.position.y = TOPO - ALTO / 2;
    this.corpo.add(saia);
    // a barra tricolor: amarelo em cima, azul, vermelho embaixo (a bandeira)
    const faixas: Array<[number, number]> = [[P.venezuelaAmarelo, 0], [P.venezuelaAzul, 1], [P.venezuelaVermelho, 2]];
    for (const [cor, i] of faixas) {
      const ALT = 0.014;
      const y = TOPO - ALTO + 0.05 - i * ALT;
      const r0 = raioEm(y + ALT / 2) + 0.003;
      const r1 = raioEm(y - ALT / 2) + 0.003;
      const faixa = new THREE.Mesh(
        new THREE.CylinderGeometry(r0, r1, ALT, 32, 1, true, INICIO + 0.02, ABRE - 0.04), toon(cor, { doubleSide: true }),
      );
      faixa.scale.z = ACHATA;
      faixa.position.y = y;
      this.corpo.add(faixa);
    }
    // a faixa da cintura dando a volta inteira, e o laço atrás
    const cinto = new THREE.Mesh(new THREE.TorusGeometry(R0 + 0.004, 0.014, 6, 32), toon(P.lizAvental));
    cinto.rotation.x = Math.PI / 2;
    cinto.scale.set(1, ACHATA, 1.4);
    cinto.position.y = TOPO;
    this.corpo.add(cinto);
    const zAtras = -(R0 + 0.01) * ACHATA;
    for (const lado of [-1, 1] as const) {
      const alca = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.011, 6, 14), toon(P.lizAvental));
      alca.scale.set(1.3, 0.8, 0.6);
      alca.position.set(lado * 0.038, TOPO + 0.006, zAtras - 0.008);
      alca.rotation.z = lado * 0.25;
      this.corpo.add(alca);
      const ponta = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.1, 0.006), creme);
      ponta.position.set(lado * 0.022, TOPO - 0.055, zAtras - 0.01);
      ponta.rotation.set(0.15, 0, lado * 0.18);
      this.corpo.add(ponta);
    }
    const no = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), toon(P.lizAvental));
    no.position.set(0, TOPO, zAtras - 0.01);
    this.corpo.add(no);

    // o BOLSO: um retalho curvo na frente, um tico para a direita, e o coração
    const yBolso = TOPO - 0.2;
    const rBolso = raioEm(yBolso) + 0.004;
    const bolso = new THREE.Mesh(
      new THREE.CylinderGeometry(rBolso - 0.006, rBolso + 0.006, 0.09, 10, 1, true, 0.08, 0.5), toon(P.lizAventalBolso, { doubleSide: true }),
    );
    bolso.scale.z = ACHATA;
    bolso.position.y = yBolso;
    this.corpo.add(bolso);
    const angulo = 0.33;
    const coracao = new THREE.Mesh(new THREE.ShapeGeometry(formaDeCoracao(0.034), 8), toon(P.venezuelaVermelho));
    const xC = Math.sin(angulo) * (rBolso + 0.0035);
    const zC = Math.cos(angulo) * (rBolso + 0.0035) * ACHATA;
    coracao.position.set(xC, yBolso + 0.008, zC);
    coracao.lookAt(new THREE.Vector3(xC * 2, yBolso + 0.008, zC * 2 / ACHATA ** 2));
    this.corpo.add(coracao);
  }

  /**
   * OS BRAÇOS, com cotovelo (as mãos na cintura pedem dobra): pivô no ombro,
   * a manguinha bufante da blusa, o braço de pelo, e o antebraço com pivô no
   * cotovelo e a pata na ponta. As garrinhas são as UNHAS LILÁS; o relógio vai
   * no pulso esquerdo (`-X`) e o anel na pata direita. A concha mora na pata
   * direita, escondida até ela mexer a panela.
   */
  private montarBracos(): void {
    const pelo = toon(P.lizPelo);
    const blusa = toon(P.lizBlusa);
    const unha = toon(P.lizUnha);
    const ouro = toon(P.lizOuro);
    for (const lado of [-1, 1] as const) {
      const braco = new THREE.Group();
      braco.name = lado < 0 ? 'braco-esquerdo-da-liz' : 'braco-direito-da-liz';
      braco.position.set(lado * OMBRO.x, OMBRO.y, 0);
      const manga = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), blusa);
      manga.scale.set(0.078, 0.088, 0.08);
      manga.position.set(lado * 0.008, -0.04, 0);
      braco.add(manga);
      const bainha = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.011, 6, 16), toon(P.lizBlusaSombra));
      bainha.rotation.x = Math.PI / 2;
      bainha.position.y = -0.1;
      braco.add(bainha);
      const cima = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.08, 4, 10), pelo);
      cima.position.y = -0.11;
      braco.add(cima);

      const antebraco = new THREE.Group();
      antebraco.name = lado < 0 ? 'antebraco-esquerdo-da-liz' : 'antebraco-direito-da-liz';
      antebraco.position.y = -BRACO.cima;
      const fora = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.09, 4, 10), pelo);
      fora.position.y = -0.07;
      antebraco.add(fora);
      const pata = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
      pata.scale.set(0.062, 0.058, 0.06);
      pata.position.y = -BRACO.antebraco;
      antebraco.add(pata);
      // a almofadinha clara da palma, virada para o corpo
      const palma = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), toon(P.lizFocinho));
      palma.scale.set(0.012, 0.034, 0.034);
      palma.position.set(-lado * 0.055, -BRACO.antebraco - 0.005, 0.004);
      antebraco.add(palma);
      // as quatro garrinhas de unha lilás, na ponta da pata
      for (const k of [-1.5, -0.5, 0.5, 1.5]) {
        const garra = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), unha);
        garra.scale.set(0.011, 0.016, 0.01);
        const a = k * 0.32;
        garra.position.set(Math.sin(a) * 0.02 + lado * 0.004, -BRACO.antebraco - 0.054, Math.cos(a) * 0.028);
        garra.rotation.x = 0.4;
        antebraco.add(garra);
      }
      if (lado < 0) {
        // o RELÓGIO: a pulseira dourada e o mostrador do lado de fora do pulso
        const pulseira = new THREE.Mesh(new THREE.TorusGeometry(0.049, 0.008, 6, 18), ouro);
        pulseira.rotation.x = Math.PI / 2;
        pulseira.position.y = -0.105;
        antebraco.add(pulseira);
        const mostrador = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.008, 14), ouro);
        mostrador.rotation.z = Math.PI / 2;
        mostrador.position.set(lado * 0.053, -0.105, 0);
        antebraco.add(mostrador);
        const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.003, 14), toon(P.lizRelogio));
        vidro.rotation.z = Math.PI / 2;
        vidro.position.set(lado * 0.058, -0.105, 0);
        antebraco.add(vidro);
      } else {
        // o ANEL dourado, abraçando a garrinha do meio-de-fora
        const anel = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.0045, 6, 12), ouro);
        anel.position.set(0.01, -BRACO.antebraco - 0.04, 0.03);
        anel.rotation.x = Math.PI / 2 + 0.4;
        antebraco.add(anel);
        const pedra = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), toon(P.lizUnha));
        pedra.position.set(0.01, -BRACO.antebraco - 0.035, 0.045);
        antebraco.add(pedra);
        antebraco.add(this.fazerConcha());
      }
      braco.add(antebraco);
      braco.rotation.z = lado * 0.16;
      this.corpo.add(braco);
      this.bracos.push(braco);
      this.antebracos.push(antebraco);
    }
  }

  /**
   * A CONCHA DE SOPA: o cabo de inox saindo da pata para baixo e a cuia na
   * ponta. Ela mora no antebraço direito e, mexendo, é girada ao contrário
   * do braço a cada quadro (`animar`): fica sempre em pé, com a cuia
   * afundada na sopa da panela do balcão e o cabo subindo até a pata.
   */
  private fazerConcha(): THREE.Group {
    const g = this.concha;
    g.name = 'concha-da-liz';
    g.position.set(0, -BRACO.antebraco, 0.02);
    const inox = toon(P.churrascoInox);
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), inox);
    cabo.position.y = -0.07;
    g.add(cabo);
    const cuia = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), toon(P.churrascoInox, { doubleSide: true }),
    );
    cuia.position.set(0, -0.15, 0.01);
    g.add(cuia);
    g.visible = false;
    return g;
  }

  // ------------------------------------------------------------------ cabeça

  private montarCabeca(): void {
    const pelo = toon(P.lizPelo);
    const claro = toon(P.lizFocinho);
    const escuro = toon(P.lizNariz);
    const branco = toon(P.lizBrilho);

    this.cabeca.name = 'cabeca-da-liz';
    this.cabeca.position.set(0, 1.2, 0.01);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), pelo);
    cranio.scale.set(CRANIO.x, CRANIO.y, CRANIO.z);
    this.cabeca.add(cranio);
    const naCabeca = (x: number, y: number, folga = 0): { p: THREE.Vector3; n: THREE.Vector3 } =>
      naCasca({ y: 0 }, CRANIO, x, y, folga);

    // ------------------------------------------------- o focinho e o nariz
    const FOCINHO = { y: -0.07, z: 0.188, rx: 0.108, ry: 0.078, rz: 0.075 };
    const focinho = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 14), claro);
    focinho.scale.set(FOCINHO.rx, FOCINHO.ry, FOCINHO.rz);
    focinho.position.set(0, FOCINHO.y, FOCINHO.z);
    this.cabeca.add(focinho);
    // o nariz de chocolate, arredondado (mais largo em cima), e o brilho dele
    const nariz = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), escuro);
    nariz.scale.set(0.044, 0.03, 0.03);
    nariz.position.set(0, -0.032, 0.258);
    this.cabeca.add(nariz);
    const brilhoDoNariz = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), branco);
    brilhoDoNariz.scale.set(0.011, 0.007, 0.004);
    brilhoDoNariz.position.set(-0.012, -0.02, 0.286);
    this.cabeca.add(brilhoDoNariz);
    // o risquinho do nariz até a boca
    const risco = new THREE.Mesh(new THREE.CapsuleGeometry(0.0035, 0.022, 3, 6), escuro);
    risco.position.set(0, -0.072, 0.26);
    risco.rotation.x = -0.3;
    this.cabeca.add(risco);

    // ------------------------------------------------------- o sorrisão
    /**
     * A BOCA ABERTA num sorriso largo (o "D" deitado), com a fileira de
     * dentinhos em cima e a língua rosa embaixo — é o sorriso da foto. Fica
     * num grupo próprio: brava, ela aperta a boca (o grupo achata no `y`).
     */
    this.boca.name = 'boca-da-liz';
    this.boca.position.set(0, -0.093, 0.254);
    this.boca.rotation.x = -0.35;
    const fundoDaBoca = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), toon(P.lizBoca),
    );
    fundoDaBoca.scale.set(1.75, 1.05, 0.45);
    this.boca.add(fundoDaBoca);
    const dentes = new THREE.Mesh(new THREE.CapsuleGeometry(0.006, 0.062, 3, 8), branco);
    dentes.rotation.z = Math.PI / 2;
    dentes.position.set(0, -0.006, 0.006);
    dentes.scale.set(1, 1, 0.6);
    this.boca.add(dentes);
    const lingua = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 6), toon(P.lizLingua));
    lingua.scale.set(1.5, 0.7, 0.6);
    lingua.position.set(0, -0.022, 0.004);
    this.boca.add(lingua);
    this.cabeca.add(this.boca);

    // ---------------------------------------------- as bochechas rosadas
    for (const lado of [-1, 1] as const) {
      const { p, n } = naCabeca(lado * 0.148, -0.05, 0.002);
      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), toon(P.lizBochecha));
      bochecha.position.copy(p);
      virarPara(bochecha, n);
      bochecha.scale.set(0.038, 0.024, 0.006);
      this.cabeca.add(bochecha);
    }

    // ---------------------------------------------------------- os olhos
    /**
     * Olho colado na cara (a lição do Flynn): um oval castanho-escuro achatado
     * na normal do crânio, o brilho grande e o pequeno, e os CÍLIOS — dois
     * risquinhos no canto de fora, que é o que deixa o olhar de mulher sem
     * maquiagem pesada. A piscada é o `scale.y` do grupo.
     */
    for (const lado of [-1, 1] as const) {
      const { p, n } = naCabeca(lado * 0.088, 0.02, 0.001);
      const olho = new THREE.Group();
      olho.name = lado < 0 ? 'olho-esquerdo-da-liz' : 'olho-direito-da-liz';
      olho.position.copy(p);
      virarPara(olho, n);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), toon(P.lizOlho));
      iris.scale.set(0.026, 0.034, 0.007);
      olho.add(iris);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), branco);
      brilho.scale.set(0.009, 0.009, 0.003);
      brilho.position.set(lado * 0.007, 0.013, 0.006);
      olho.add(brilho);
      const brilhinho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), branco);
      brilhinho.scale.set(0.0045, 0.0045, 0.002);
      brilhinho.position.set(-lado * 0.007, -0.01, 0.0068);
      olho.add(brilhinho);
      for (const [k, giro] of [[0, 0.5], [1, 0.95]] as const) {
        const cilio = new THREE.Mesh(new THREE.CapsuleGeometry(0.0028, 0.013, 3, 5), escuro);
        cilio.position.set(lado * (0.022 + k * 0.004), 0.024 - k * 0.01, 0.003);
        cilio.rotation.z = -lado * giro;
        olho.add(cilio);
      }
      this.cabeca.add(olho);
      this.olhos.push(olho);

      // a sobrancelha, num grupo que gira: franzida para dentro na tia brava
      const s = naCabeca(lado * 0.085, 0.085, 0.003);
      const sobrancelha = new THREE.Group();
      sobrancelha.name = lado < 0 ? 'sobrancelha-esquerda-da-liz' : 'sobrancelha-direita-da-liz';
      sobrancelha.position.copy(s.p);
      virarPara(sobrancelha, s.n);
      const arco = new THREE.Mesh(new THREE.CapsuleGeometry(0.0055, 0.034, 3, 6), toon(P.lizCabeloRaiz));
      arco.rotation.z = Math.PI / 2;
      sobrancelha.add(arco);
      this.cabeca.add(sobrancelha);
      this.sobrancelhas.push(sobrancelha);
    }

    // -------------------------------------------------------- as orelhas
    for (const lado of [-1, 1] as const) {
      const orelha = new THREE.Group();
      orelha.name = lado < 0 ? 'orelha-esquerda-da-liz' : 'orelha-direita-da-liz';
      orelha.position.set(lado * 0.175, 0.165, -0.035);
      orelha.rotation.z = -lado * 0.5;
      const fora = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pelo);
      fora.scale.set(0.072, 0.07, 0.034);
      fora.position.y = 0.035;
      orelha.add(fora);
      const dentro = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), toon(P.lizOrelhaDentro));
      dentro.scale.set(0.044, 0.042, 0.016);
      dentro.position.set(0, 0.035, 0.022);
      orelha.add(dentro);
      this.cabeca.add(orelha);
      this.orelhas.push(orelha);
    }

    this.montarCabelo();
  }

  /**
   * OS CACHOS. Três camadas, de dentro para fora:
   *
   * 1. a RAIZ: uma calota um tico maior que o crânio, inclinada para trás (a
   *    testa fica livre e a nuca coberta), na cor escura da raiz;
   * 2. os CACHINHOS: bolotas douradas espalhadas pela calota numa espiral de
   *    Fibonacci (sem sortear: a foto do teste não muda sozinha), em dois tons,
   *    deixando livre o lado das trancinhas e o pé de cada orelha;
   * 3. as MOLINHAS que caem até o ombro, atrás e dos lados — cada uma um
   *    grupo que balança de leve.
   *
   * E as TRANCINHAS rentes no `-X`: três fileiras de gominhos que vão da testa
   * para trás da orelha e se juntam numa trança que cai.
   */
  private montarCabelo(): void {
    const raiz = toon(P.lizCabeloRaiz);
    const dourado = toon(P.lizCabelo);
    const luz = toon(P.lizCabeloLuz);
    const tranca = toon(P.lizTranca);
    const INCLINA = 0.5;
    const ABERTURA = 1.48;
    const R = { x: CRANIO.x * 1.045, y: CRANIO.y * 1.06, z: CRANIO.z * 1.05 };

    const calota = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, ABERTURA), raiz);
    calota.scale.set(R.x, R.y, R.z);
    calota.rotation.x = -INCLINA;
    calota.position.y = 0.012;
    this.cabeca.add(calota);

    /** o lado das trancinhas: ali não nasce cachinho */
    const ladoDaTranca = (x: number, y: number, z: number): boolean => x < -0.1 && z > -0.11 && y < 0.17;
    const pertoDaOrelha = (x: number, y: number, z: number): boolean => {
      for (const o of this.orelhas) {
        const dx = x - o.position.x;
        const dy = y - (o.position.y + 0.03);
        const dz = z - o.position.z;
        if (dx * dx + dy * dy + dz * dz < 0.062 ** 2) return true;
      }
      return false;
    };

    /*
     * OS CACHINHOS pela calota: muitos e miúdos (a primeira versão, com
     * bolotas de 5 cm, virou uma couve-flor). Cada um é um icosaedro um tico
     * comprido e girado ao acaso — o facetado pega a luz do toon em degraus,
     * como cacho de verdade —, em três tons de dourado. A raiz aparece só no
     * fundo, entre eles.
     */
    const N = 380;
    const ouro = Math.PI * (3 - Math.sqrt(5));
    const eixo = new THREE.Euler(-INCLINA, 0, 0);
    const v = new THREE.Vector3();
    const bola = new THREE.IcosahedronGeometry(1, 1);
    const tons = [dourado, luz, dourado, dourado, luz, toon(P.lizTranca)];
    let k = 0;
    const cacho = (px: number, py: number, pz: number, r: number): void => {
      const m = new THREE.Mesh(bola, tons[k % tons.length]);
      m.scale.set(r, r * 1.22, r);
      m.position.set(px, py, pz);
      m.rotation.set((k * 1.7) % 3.1, (k * 2.3) % 3.1, (k * 0.9) % 3.1);
      this.cabeca.add(m);
      k++;
    };
    for (let i = 0; i < N; i++) {
      const y = 1 - (i + 0.5) / N * 2;
      const raio = Math.sqrt(1 - y * y);
      const a = i * ouro;
      v.set(Math.cos(a) * raio, y, Math.sin(a) * raio);
      // só a parte da esfera que a calota cobre (no referencial dela, antes de inclinar)
      if (Math.acos(v.y) > ABERTURA - 0.04) continue;
      v.applyEuler(eixo);
      const px = v.x * R.x * 1.07;
      const py = v.y * R.y * 1.07 + 0.012;
      const pz = v.z * R.z * 1.07;
      if (ladoDaTranca(px, py, pz) || pertoDaOrelha(px, py, pz)) continue;
      // na franja (frente e baixo), cachinhos menores: não pesam sobre os olhos
      const naFranja = pz > 0.13 && py < 0.17;
      cacho(px, py, pz, naFranja ? 0.026 : 0.031 + (i % 3) * 0.005);
    }
    // a FRANJA: uma fileira de cachinhos na beira da calota, um tico para fora
    // e para baixo, que esconde a borda da raiz (sem ela, a raiz lia como uma
    // faixa de cabelo na testa)
    for (let i = 0; i <= 22; i++) {
      const phi = -1.45 + (i / 22) * 2.9;
      v.set(Math.sin(phi) * Math.sin(ABERTURA - 0.03), Math.cos(ABERTURA - 0.03), Math.cos(phi) * Math.sin(ABERTURA - 0.03));
      v.applyEuler(eixo);
      const px = v.x * R.x * 1.04;
      const py = v.y * R.y * 1.04 + 0.006;
      const pz = v.z * R.z * 1.04;
      if (ladoDaTranca(px, py, pz) || pertoDaOrelha(px, py, pz)) continue;
      cacho(px, py, pz, 0.024 + (i % 2) * 0.004);
    }

    /*
     * AS MOLINHAS que caem até o ombro: cada uma é um CACHO EM ESPIRAL de
     * verdade (um tubo numa hélice, afinando na ponta), atrás e dos lados,
     * nunca na frente do rosto. São elas que dizem "cacheado" de longe.
     */
    const MOLAS = 14;
    for (let i = 0; i < MOLAS; i++) {
      const a = -2.1 + (i / (MOLAS - 1)) * 4.2; // em volta da nuca, de um lado ao outro
      const x = Math.sin(a + Math.PI) * R.x * 0.96;
      const z = Math.cos(a + Math.PI) * R.z * 0.96 - 0.02;
      if (x < -0.1 && z > -0.13) continue; // o lado das trancinhas é curto
      const mola = new THREE.Group();
      mola.name = `mola-da-liz-${i}`;
      mola.position.set(x, -0.02, z);
      // as do meio da nuca descem mais; as dos lados são mais curtas
      const voltas = 3.6 + (1 - Math.abs(a) / 2.1) * 2.2;
      const passo = 0.034;
      const raio = 0.02;
      const pontos: THREE.Vector3[] = [];
      for (let t = 0; t <= voltas * 12; t++) {
        const ang = (t / 12) * Math.PI * 2 + i;
        const enc = 1 - (t / (voltas * 12)) * 0.35;
        pontos.push(new THREE.Vector3(Math.cos(ang) * raio * enc, -(t / 12) * passo, Math.sin(ang) * raio * enc));
      }
      const helice = new THREE.CatmullRomCurve3(pontos);
      const fio = new THREE.Mesh(new THREE.TubeGeometry(helice, Math.round(voltas * 12), 0.012, 6, false), i % 3 === 0 ? luz : dourado);
      mola.add(fio);
      const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), i % 3 === 0 ? luz : dourado);
      ponta.position.copy(pontos[pontos.length - 1]);
      mola.add(ponta);
      mola.rotation.x = -0.12;
      mola.rotation.z = Math.sin(a) * 0.15;
      mola.userData.base = { x: mola.rotation.x, z: mola.rotation.z };
      this.cabeca.add(mola);
      this.molas.push(mola);
    }

    // as trancinhas rentes no -X: três fileiras da testa para trás da orelha
    for (const [f, yIni, yFim] of [[0, 0.15, 0.06], [1, 0.1, 0.0], [2, 0.05, -0.05]] as const) {
      const GOMOS = 9;
      for (let j = 0; j < GOMOS; j++) {
        const t = j / (GOMOS - 1);
        const z = 0.12 - t * 0.27;
        const y = yIni + (yFim - yIni) * t;
        // o x sai da casca da calota no y e z do gomo
        const u = 1 - ((y - 0.012) / R.y) ** 2 - (z / R.z) ** 2;
        if (u <= 0) continue;
        const x = -R.x * Math.sqrt(u) - 0.004;
        const gomo = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), tranca);
        gomo.scale.set(0.012, 0.016, 0.022);
        gomo.position.set(x, y, z);
        gomo.lookAt(x, y - (yIni - yFim) * 0.2, z - 0.1);
        gomo.rotateY(0);
        this.cabeca.add(gomo);
      }
      void f;
    }
    // e a trança que junta as três e cai atrás da orelha
    const trancaQueCai = new THREE.Group();
    trancaQueCai.name = 'tranca-da-liz';
    trancaQueCai.position.set(-R.x * 0.82, -0.04, -0.15);
    for (let j = 0; j < 8; j++) {
      const gomo = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), tranca);
      gomo.scale.set(0.02, 0.026, 0.02);
      gomo.position.set((j % 2 ? 1 : -1) * 0.006, -j * 0.034, 0);
      gomo.rotation.z = (j % 2 ? 1 : -1) * 0.5;
      trancaQueCai.add(gomo);
    }
    const ponteira = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), luz);
    ponteira.position.y = -0.29;
    trancaQueCai.add(ponteira);
    trancaQueCai.rotation.set(-0.1, 0, -0.08);
    trancaQueCai.userData.base = { x: trancaQueCai.rotation.x, z: trancaQueCai.rotation.z };
    this.cabeca.add(trancaQueCai);
    this.molas.push(trancaQueCai);
  }

  // ------------------------------------------------------------------- pose

  protected animar(dt: number, { andando, carinho }: PoseDoBicho): void {
    this.relogio += dt;
    const t = this.relogio;
    this.servirFalta = Math.max(0, this.servirFalta - dt);
    this.naCinturaFalta = Math.max(0, this.naCinturaFalta - dt);
    this.acenando = Math.max(0, this.acenando - dt);
    const suave = Math.min(1, dt * 6);
    // servir, acenar e a mão na cintura passam na frente da panela
    const outroGesto = this.servirFalta > 0 || this.naCinturaFalta > 0 || this.acenando > 0;
    this.misturaMexe += ((this.mexendo && !andando && !outroGesto ? 1 : 0) - this.misturaMexe) * suave;
    this.misturaServe += ((this.servirFalta > 0 ? 1 : 0) - this.misturaServe) * suave;
    this.misturaBrava += ((this.naCinturaFalta > 0 ? 1 : 0) - this.misturaBrava) * suave;
    this.misturaAceno += ((this.acenando > 0 ? 1 : 0) - this.misturaAceno) * suave;
    const mexe = this.misturaMexe;
    const serve = this.misturaServe;
    const brava = this.misturaBrava;
    const aceno = this.misturaAceno;
    this.concha.visible = mexe > 0.25;

    // ------------------------------------------------------- pernas e passo
    if (andando) this.passada += dt * 8;
    const passo = andando ? Math.sin(this.passada) : 0;
    for (const [i, perna] of this.pernas.entries()) {
      const lado = i === 0 ? -1 : 1;
      perna.rotation.x += (passo * 0.45 * lado - perna.rotation.x) * Math.min(1, dt * 12);
    }
    const respiro = Math.sin(t * 1.6) * 0.006;
    this.corpo.position.y = respiro + (andando ? Math.abs(Math.sin(this.passada)) * 0.015 : 0);
    // mexendo, o corpo acompanha a colher num balancinho de quem cozinha cantarolando
    this.corpo.rotation.y = mexe * Math.sin(t * 2.2) * 0.05 + brava * 0.12;
    this.corpo.rotation.z = Math.sin(t * 1.1) * 0.012 + mexe * Math.sin(t * 2.2) * 0.02;

    // ------------------------------------------------------------ os braços
    /**
     * Cada pose diz o ombro (`rotation.x` para a frente é negativo,
     * `rotation.z` para fora é `lado · ângulo`) e o cotovelo, e elas se
     * misturam pelos pesos. MÃOS NA CINTURA: o braço abre para fora e o
     * antebraço volta para dentro, a pata pousando no quadril.
     */
    for (const [i, braco] of this.bracos.entries()) {
      const lado = i === 0 ? -1 : 1;
      const ante = this.antebracos[i];
      let ox = -passo * 0.35 * lado + Math.sin(t * 1.6 + i) * 0.03;
      let oz = lado * 0.16;
      let cx = -0.12;
      let cz = 0;
      /*
       * MEXER A PANELA: só a direita. O braço vai para a frente um tico acima
       * da horizontal e o antebraço segue reto: a pata para em cima da panela
       * do balcão (que é de embutir, com a boca a 1 m), e a concha desce dela
       * em pé até a sopa. A roda pequena no ombro é o mexer.
       */
      if (lado > 0 && mexe > 0) {
        const roda = t * 3.1;
        const mx = -1.86 + Math.cos(roda) * 0.07;
        const mz = 0.12 + Math.sin(roda) * 0.1;
        ox += (mx - ox) * mexe;
        oz += (mz - oz) * mexe;
        cx += (-0.1 - cx) * mexe;
      }
      // a esquerda, enquanto a direita mexe, descansa na barriga
      if (lado < 0 && mexe > 0) {
        ox += (-0.55 - ox) * mexe;
        oz += (0.05 * lado - oz) * mexe;
        cx += (-1.15 - cx) * mexe;
        cz += (lado * 0.5 - cz) * mexe;
      }
      if (serve > 0) {
        ox += (-1.15 - ox) * serve;
        oz += (-lado * 0.18 - oz) * serve;
        cx += (-0.35 - cx) * serve;
      }
      // as mãos na cintura: o braço abre, o cotovelo aponta para fora e a pata
      // volta e pousa no lado da barriga (com braço de chibi, é o que alcança)
      if (brava > 0) {
        ox += (0.1 - ox) * brava;
        oz += (lado * 0.62 - oz) * brava;
        cx += (0 - cx) * brava;
        cz += (-lado * 1.35 - cz) * brava;
      }
      if (lado > 0 && aceno > 0) {
        ox += (0 - ox) * aceno;
        oz += (lado * 2.55 - oz) * aceno;
        cx += (0 - cx) * aceno;
        cz += (lado * (0.35 + Math.sin(t * 12) * 0.35) - cz) * aceno;
      }
      const k = Math.min(1, dt * 10);
      braco.rotation.x += (ox - braco.rotation.x) * k;
      braco.rotation.z += (oz - braco.rotation.z) * k;
      ante.rotation.x += (cx - ante.rotation.x) * k;
      ante.rotation.z += (cz - ante.rotation.z) * k;
    }
    // a concha fica em pé: gira ao contrário do braço e do antebraço direitos
    this.concha.rotation.x = -(this.bracos[1].rotation.x + this.antebracos[1].rotation.x);
    this.concha.rotation.z = -(this.bracos[1].rotation.z + this.antebracos[1].rotation.z);

    // -------------------------------------------------------------- a cabeça
    // mexendo, ela olha a panela (cabeça baixa) e cantarola balançando
    this.cabeca.rotation.x = Math.sin(t * 0.9) * 0.02 + mexe * 0.22 - serve * 0.05 + brava * 0.06;
    this.cabeca.rotation.z = Math.sin(t * 1.3) * 0.03 + mexe * Math.sin(t * 2.2) * 0.06 - brava * 0.12 + aceno * 0.1;
    // a sobrancelha: franzida (ponta de dentro para baixo) na tia brava
    for (const [i, s] of this.sobrancelhas.entries()) {
      const lado = i === 0 ? -1 : 1;
      s.rotation.z = lado * (-0.08 + brava * 0.45);
      s.position.y = 0.085 * (1 - brava * 0.12) + 0.006 * aceno;
    }
    // a boca: o sorrisão aperta quando ela fica brava
    this.boca.scale.set(1 - brava * 0.35, 1 - brava * 0.7, 1);

    // ------------------------------------------------- as molinhas balançam
    for (const [i, mola] of this.molas.entries()) {
      const base = mola.userData.base as { x: number; z: number };
      mola.rotation.x = base.x + Math.sin(t * 2 + i) * 0.04 + (andando ? Math.abs(Math.sin(this.passada)) * 0.08 : 0);
      mola.rotation.z = base.z + Math.sin(t * 1.7 + i * 1.3) * 0.04 + mexe * Math.sin(t * 2.2) * 0.05;
    }

    // ------------------------------------------------------------- a piscada
    this.proximaPiscada -= dt;
    let abertura = 1;
    if (this.proximaPiscada < 0.14) abertura = Math.max(0.08, Math.abs(this.proximaPiscada - 0.07) / 0.07);
    if (this.proximaPiscada <= 0) this.proximaPiscada = 2.4 + this.sorte() * 3;
    // contente (carinho, aceno), ela sorri de olho apertadinho; brava, aperta um tico
    abertura = Math.min(abertura, 1 - carinho * 0.55 - aceno * 0.4 - brava * 0.25);
    for (const olho of this.olhos) olho.scale.y = abertura;
  }
}
