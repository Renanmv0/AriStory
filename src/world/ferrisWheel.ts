import * as THREE from 'three';
import { toon, flat, line } from '../core/materials';
import { letreiro } from './props';
import { PALETTE as P } from '../palette';

export interface FerrisWheelOptions {
  /** raio da roda em unidades de mundo (padrao 12) */
  radius?: number;
  /** quantidade de cabines (padrao 32) */
  cabins?: number;
  /** voltas por minuto */
  rpm?: number;
  cabinColor?: number;
  frameColor?: number;
}

/** Liga dois pontos com um cilindro: usado nas pernas e nos montantes. */
function strut(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.15, len, 8), material);
  mesh.position.copy(from).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

/**
 * A roda gigante do Villa Lobos, em versao fofa.
 * O aro gira em torno do eixo Z; as cabines ficam FORA do grupo que gira e sao
 * reposicionadas a cada frame, entao elas nunca viram de cabeca para baixo.
 * A roda inteira olha para +Z quando group.rotation.y === 0.
 */
export class FerrisWheel {
  readonly group = new THREE.Group();
  readonly cabins: THREE.Group[] = [];

  readonly radius: number;
  readonly hubHeight: number;
  /** velocidade angular em rad/s */
  speed: number;
  angle = 0;

  private readonly rim = new THREE.Group();
  private readonly cabinCount: number;
  /** as duas rodas de atrito que empurram o aro: elas giram junto */
  private readonly pneus: THREE.Group[] = [];
  /** a catraca do embarque; a cena gira o braço quando alguém passa */
  private catraca: THREE.Group | null = null;
  /** o interior da cabine: um só, que muda de cabine na hora do passeio */
  private readonly interior: THREE.Group;

  constructor(opts: FerrisWheelOptions = {}) {
    // etiqueta para o caçador de z-fighting e para os testes acharem a peça
    this.group.userData.peca = 'roda-gigante';
    const R = (this.radius = opts.radius ?? 12);
    const count = (this.cabinCount = opts.cabins ?? 32);
    this.speed = ((opts.rpm ?? 0.9) * Math.PI * 2) / 60;
    const frameMat = toon(opts.frameColor ?? P.metalWhite);
    const hubY = (this.hubHeight = R + 2.6);
    const spread = R * 0.075; // distancia entre os dois aros

    // ------------------------------------------------------------- aros
    for (const z of [-spread, spread]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R, R * 0.019, 8, 72), frameMat);
      ring.position.z = z;
      this.rim.add(ring);
    }

    // montantes entre os dois aros (a trelica que aparece na foto)
    const lattice = Math.min(48, count * 2);
    for (let i = 0; i < lattice; i++) {
      const a = (i / lattice) * Math.PI * 2;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(R * 0.012, R * 0.012, spread * 2), frameMat);
      bar.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      this.rim.add(bar);
    }

    // zigue-zague da trelica, desenhado como linha (barato e legivel)
    const zig: number[] = [];
    for (let i = 0; i < lattice; i++) {
      const a1 = (i / lattice) * Math.PI * 2;
      const a2 = ((i + 1) / lattice) * Math.PI * 2;
      const z1 = i % 2 === 0 ? -spread : spread;
      const z2 = i % 2 === 0 ? spread : -spread;
      zig.push(Math.cos(a1) * R, Math.sin(a1) * R, z1, Math.cos(a2) * R, Math.sin(a2) * R, z2);
    }
    this.rim.add(new THREE.LineSegments(buildLines(zig), line(0xdfe6ea)));

    // --------------------------------------------------------- cabos/raios
    const spokes: number[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const x = Math.cos(a) * R;
      const y = Math.sin(a) * R;
      spokes.push(0, 0, -spread * 0.5, x, y, -spread);
      spokes.push(0, 0, spread * 0.5, x, y, spread);
    }
    this.rim.add(new THREE.LineSegments(buildLines(spokes), line(0xeef3f6)));

    // ------------------------------------------------------------- cubo
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.085, R * 0.085, R * 0.3, 14), frameMat);
    hub.rotation.x = Math.PI / 2;
    this.rim.add(hub);
    for (const z of [-R * 0.17, R * 0.17]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.11, R * 0.07, R * 0.06, 14), toon(P.metalGrey));
      cap.rotation.x = Math.PI / 2;
      cap.position.z = z;
      this.rim.add(cap);
    }

    this.rim.position.y = hubY;
    this.group.add(this.rim);

    // ------------------------------------------------------------ cabines
    const cabinMat = toon(opts.cabinColor ?? P.metalWhite);
    const glassMat = toon(0x6fb6d8, { opacity: 0.5 });
    const pod = R * 0.068; // raio da capsula: cabe uma pessoa em escala de jogo
    for (let i = 0; i < count; i++) {
      const cabin = new THREE.Group();

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, pod * 1.1, 0.09), toon(P.metalGrey));
      arm.position.y = pod * 1.25;
      cabin.add(arm);

      const shell = new THREE.Mesh(new THREE.CapsuleGeometry(pod, pod * 0.5, 5, 16), cabinMat);
      shell.scale.set(1, 1, 0.92);
      cabin.add(shell);

      const band = new THREE.Mesh(new THREE.CylinderGeometry(pod * 1.02, pod * 1.02, pod * 0.95, 18, 1, true), glassMat);
      band.position.y = pod * 0.12;
      band.scale.z = 0.92;
      cabin.add(band);

      cabin.traverse((n) => {
        if ((n as THREE.Mesh).isMesh) n.castShadow = true;
      });
      this.cabins.push(cabin);
      this.group.add(cabin);
    }
    this.interior = this.montarOInterior();
    this.group.add(this.interior);

    // ------------------------------------------------------------- pernas
    const legSpan = R * 0.42;
    const hubFront = new THREE.Vector3(0, hubY, -R * 0.04);
    const hubBack = new THREE.Vector3(0, hubY, R * 0.04);
    const feet: Array<[THREE.Vector3, THREE.Vector3]> = [
      [hubFront, new THREE.Vector3(-R * 0.2, 0, -legSpan)],
      [hubFront, new THREE.Vector3(R * 0.2, 0, -legSpan)],
      [hubBack, new THREE.Vector3(-R * 0.2, 0, legSpan)],
      [hubBack, new THREE.Vector3(R * 0.2, 0, legSpan)],
    ];
    for (const [a, b] of feet) {
      const leg = strut(a.clone(), b.clone(), R * 0.03, frameMat);
      leg.castShadow = true;
      this.group.add(leg);
    }

    // travessa entre as pernas
    for (const z of [-legSpan, legSpan]) {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(R * 0.42, R * 0.022, R * 0.022), frameMat);
      cross.position.set(0, R * 0.16, z);
      this.group.add(cross);
    }

    this.montarABase(R, legSpan);

    this.layout();
  }

  /**
   * ================================================== A BASE, E COMO ELA ANDA
   *
   * A roda em si já estava boa; o chão dela era uma laje, quatro tambores lisos
   * e uma caixa cinza. O que faltava era o que uma roda gigante de verdade tem
   * embaixo — e, sobretudo, o que a faz GIRAR: nada ali explicava o movimento.
   *
   * O QUE FOI ACRESCENTADO, e por que cada coisa:
   *
   * - as RODAS DE ATRITO. É assim que roda gigante de verdade anda: dois pneus
   *   pressionam o aro por baixo e empurram. Eles giram de verdade no `update`,
   *   na velocidade certa (`v = ω·R / r`), então quem olhar para o pé da roda vê
   *   a máquina funcionando em vez de um aro girando por mágica;
   * - a CASA DE MÁQUINAS ao lado deles, com respiro e porta: é de onde a força
   *   sai;
   * - os BLOCOS DE FUNDAÇÃO com chumbadores, um por pé. Perna de aço que
   *   encosta no gramado não sustenta sessenta toneladas, e a falta deles era o
   *   que mais fazia a roda parecer pousada em cima do parque;
   * - os CONTRAPESOS deixaram de ser cilindros lisos: cinta, tampa e parafuso;
   * - a PLATAFORMA DE EMBARQUE virou plataforma mesmo — tábuas, degrau, corrimão
   *   de fila, CATRACA e o posto do bilheteiro. É por ela que se entra, e é ela
   *   que dá sentido ao bilhete;
   * - a CERCA DE CORRENTE em volta da laje, com o vão na frente da plataforma:
   *   ela diz onde a pessoa pode pisar sem precisar de nenhum aviso.
   *
   * A ORIENTAÇÃO: `+Z` é a frente (de onde a câmera olha e por onde o jogador
   * chega), e é para lá que vai tudo o que precisa ser visto — a plataforma, a
   * catraca, o toldo. A casa de máquinas fica do lado, em `-X`, para não
   * disputar espaço com o embarque.
   */
  private montarABase(R: number, legSpan: number): void {
    const concreto = toon(P.concrete);
    const madeira = toon(P.wood);
    const madeiraEscura = toon(P.woodDark);
    const metal = toon(P.metalWhite);
    const metalEscuro = toon(P.metalGrey);

    // ---------------------------------------------------------- a laje
    const base = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.62, R * 0.67, 0.35, 26), concreto);
    base.position.y = 0.16;
    base.receiveShadow = true;
    this.group.add(base);
    // a faixa amarela pintada na borda: decalque ACIMA do topo da laje
    // (0,335 contra 0,335 — sobe 1 cm) para não brigar por profundidade
    const faixa = new THREE.Mesh(new THREE.TorusGeometry(R * 0.56, 0.055, 5, 30), toon(P.roupaBota));
    faixa.rotation.x = Math.PI / 2;
    faixa.position.y = 0.345;
    this.group.add(faixa);

    // -------------------------------------------- fundação de cada pé
    for (const [x, z] of [
      [-R * 0.2, -legSpan], [R * 0.2, -legSpan],
      [-R * 0.2, legSpan], [R * 0.2, legSpan],
    ] as const) {
      const bloco = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.92, 0.72, 4), concreto);
      bloco.rotation.y = Math.PI / 4;
      bloco.position.set(x, 0.36, z);
      bloco.castShadow = true;
      this.group.add(bloco);
      // os quatro chumbadores: sem eles o bloco é um cubo de concreto qualquer
      for (const [dx, dz] of [[-0.44, -0.44], [0.44, -0.44], [-0.44, 0.44], [0.44, 0.44]] as const) {
        const parafuso = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 6), metalEscuro);
        parafuso.position.set(x + dx, 0.75, z + dz);
        this.group.add(parafuso);
      }
    }

    // ------------------------------------------------------ contrapesos
    const dx = R * 0.4;
    const dz = legSpan * 0.92;
    for (const [x, z] of [[-dx, -dz], [dx, -dz], [-dx, dz], [dx, dz]] as const) {
      /**
       * MENORES DO QUE ERAM. Com `R·0,055` de raio e `R·0,16` de altura eles
       * ficavam do tamanho da porta da casa de máquinas — quatro tonéis de óleo
       * espalhados pela laje. Contrapeso é baixo e atarracado: ele existe para
       * ficar embaixo, e não para competir com a plataforma.
       */
      const alto = R * 0.105;
      const tambor = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.042, R * 0.046, alto, 12), toon(P.metalRed));
      tambor.position.set(x, alto / 2, z);
      tambor.castShadow = true;
      this.group.add(tambor);
      // as duas cintas e a tampa: é o que separa "tambor" de "cilindro"
      for (const k of [0.32, 0.68] as const) {
        const cinta = new THREE.Mesh(new THREE.TorusGeometry(R * 0.045, 0.03, 5, 14), toon(P.woodDark));
        cinta.rotation.x = Math.PI / 2;
        cinta.position.set(x, alto * k, z);
        this.group.add(cinta);
      }
      const tampa = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.048, R * 0.048, 0.09, 12), metalEscuro);
      tampa.position.set(x, alto + 0.04, z);
      this.group.add(tampa);
    }

    // ----------------------------------------------- as rodas de atrito
    /**
     * ELAS ENCOSTAM NO ARO POR BAIXO, e é daí que sai o movimento.
     *
     * O ponto mais baixo do aro está em `hubHeight − R`; o pneu de raio `r`
     * tocando ali tem o centro em `hubHeight − R − r`. Errar essa conta deixa o
     * pneu ou flutuando ou enterrado no aro, e a peça inteira perde o sentido.
     */
    const raioDoPneu = R * 0.075;
    const alturaDoPneu = this.hubHeight - R - raioDoPneu;
    for (const z of [-R * 0.075, R * 0.075]) {
      const pneu = new THREE.Group();
      const borracha = new THREE.Mesh(
        new THREE.CylinderGeometry(raioDoPneu, raioDoPneu, R * 0.05, 14), toon(P.churrascoCarvao),
      );
      borracha.rotation.x = Math.PI / 2;
      pneu.add(borracha);
      // o cubo claro no meio: é ele que deixa a rotação VISÍVEL. Um pneu preto
      // liso girando parece um pneu preto parado.
      const cubo = new THREE.Mesh(
        new THREE.CylinderGeometry(raioDoPneu * 0.38, raioDoPneu * 0.38, R * 0.056, 10), metal,
      );
      cubo.rotation.x = Math.PI / 2;
      pneu.add(cubo);
      for (const giro of [0, Math.PI / 2] as const) {
        const raio = new THREE.Mesh(
          new THREE.BoxGeometry(raioDoPneu * 1.5, 0.05, R * 0.058), toon(P.metalGrey),
        );
        raio.rotation.z = giro;
        pneu.add(raio);
      }
      pneu.position.set(0, alturaDoPneu, z);
      this.group.add(pneu);
      this.pneus.push(pneu);
      // o braço que segura o pneu contra o aro
      const braco = new THREE.Mesh(new THREE.BoxGeometry(0.16, alturaDoPneu, 0.16), metalEscuro);
      braco.position.set(0, alturaDoPneu / 2, z);
      this.group.add(braco);
    }

    // -------------------------------------------------- casa de máquinas
    const casa = new THREE.Group();
    casa.position.set(-R * 0.5, 0, legSpan * 0.25);
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.5, 1.5), toon(P.wallCream));
    corpo.position.y = 0.75;
    corpo.castShadow = true;
    casa.add(corpo);
    // o telhado é mais LARGO que o corpo, senão as faces laterais dos dois
    // caem no mesmo plano e serrilham na quina
    const telhado = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.16, 1.74), madeiraEscura);
    telhado.position.y = 1.58;
    casa.add(telhado);
    const porta = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.1, 0.06), madeira);
    porta.position.set(0.45, 0.55, 0.78);
    casa.add(porta);
    // o respiro: três lâminas, que é o que diz "tem motor aqui dentro"
    for (let i = 0; i < 3; i++) {
      const lamina = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.07, 0.05), metalEscuro);
      lamina.position.set(-0.45, 1.0 - i * 0.14, 0.78);
      casa.add(lamina);
    }
    this.group.add(casa);

    // ------------------------------------------------------ a plataforma
    /**
     * A PLATAFORMA FICA NA BORDA DA LAJE, e não colada nas pernas: é onde o
     * jogador de fato chega. O colisor da cena bloqueia um círculo de 7,2 em
     * volta do centro, então a frente do deque tem que parar um fio dentro
     * dele — senão a pessoa anda por dentro da madeira.
     */
    const plataforma = new THREE.Group();
    plataforma.position.set(0, 0, 6.0);

    const deque = new THREE.Mesh(new THREE.BoxGeometry(R * 0.62, 0.42, 2.2), madeiraEscura);
    deque.position.y = 0.21;
    deque.receiveShadow = true;
    plataforma.add(deque);
    // as tábuas, um decalque fino por cima do deque
    for (let i = 0; i < 9; i++) {
      const tabua = new THREE.Mesh(new THREE.BoxGeometry(R * 0.6, 0.03, 0.2), madeira);
      tabua.position.set(0, 0.435, -0.96 + i * 0.24);
      plataforma.add(tabua);
    }
    /**
     * DOIS DEGRAUS, e não um. O deque tem 42 cm; um degrau só de 20 deixava um
     * paredão de 22 cm no meio do caminho, que lê como tropeço e não como
     * escada.
     */
    for (const [i, z] of [1.24, 1.56].entries()) {
      const alturaDoDegrau = 0.28 - i * 0.14;
      const degrau = new THREE.Mesh(new THREE.BoxGeometry(2.2, alturaDoDegrau, 0.32), madeiraEscura);
      degrau.position.set(0, alturaDoDegrau / 2, z);
      plataforma.add(degrau);
    }

    // o corrimão da fila: dois trilhos paralelos formando o corredor
    for (const lado of [-1, 1] as const) {
      for (const z of [-0.7, 0.1, 0.9] as const) {
        const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95, 8), metal);
        poste.position.set(lado * 1.5, 0.9, z);
        plataforma.add(poste);
      }
      const trilho = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 1.75), metal);
      trilho.position.set(lado * 1.5, 1.3, 0.1);
      plataforma.add(trilho);
    }

    /**
     * A CATRACA, no meio do corredor. Três braços a 120°, e é ela que faz o
     * bilhete existir: sem uma catraca no caminho, "comprar bilhete" seria uma
     * regra escrita em lugar nenhum.
     */
    const catraca = new THREE.Group();
    catraca.position.set(0, 0.42, 1.0);
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.95, 12), metalEscuro);
    pedestal.position.y = 0.48;
    catraca.add(pedestal);
    const cabeca = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.16, 12), metal);
    cabeca.position.y = 1.02;
    catraca.add(cabeca);
    for (let i = 0; i < 3; i++) {
      const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), metal);
      braco.rotation.z = Math.PI / 2;
      braco.position.set(Math.cos((i * Math.PI * 2) / 3) * 0.45, 0.95, Math.sin((i * Math.PI * 2) / 3) * 0.45);
      braco.rotation.y = -(i * Math.PI * 2) / 3;
      catraca.add(braco);
    }
    plataforma.add(catraca);
    this.catraca = catraca;

    // o posto do bilheteiro, do lado da catraca: um púlpito com uma luminária
    const pulpito = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.05, 0.6), madeira);
    pulpito.position.set(-1.95, 0.52, 0.9);
    plataforma.add(pulpito);
    const tampoDoPulpito = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.08, 0.74), madeiraEscura);
    tampoDoPulpito.position.set(-1.95, 1.09, 0.9);
    plataforma.add(tampoDoPulpito);

    /**
     * O PÓRTICO, e não um toldo por cima.
     *
     * Aqui havia uma meia-cana vermelha de três metros pairando sobre o
     * embarque, e ela cometia o erro que a cadeira do salva-vidas já pagou:
     * numa câmera de 34°, o que está ACIMA E À FRENTE esconde o que está
     * atrás — o toldo comia a catraca, o púlpito e quem estivesse embarcando,
     * e de longe a plataforma era um tijolo vermelho. Cobertura só ficaria
     * bem numa câmera que olha de lado.
     *
     * O pórtico resolve as duas coisas: ele é VERTICAL, então não tapa nada, e
     * ainda diz o nome da atração — que é o que um toldo tentava dizer.
     */
    const portico = new THREE.Group();
    portico.position.set(0, 0, 1.25);
    for (const lado of [-1, 1] as const) {
      const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.0, 10), metal);
      coluna.position.set(lado * 2.3, 1.5, 0);
      portico.add(coluna);
      // a lâmpada no alto de cada coluna
      const luz = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), toon(P.luzDoPortao));
      luz.position.set(lado * 2.3, 3.16, 0);
      portico.add(luz);
    }
    const viga = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.15, 0.18), metal);
    viga.position.y = 2.9;
    portico.add(viga);
    // a placa pendurada na viga, com a fita vermelha da casa
    const placa = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.75, 0.1), toon(P.fabricRed));
    placa.position.y = 2.42;
    portico.add(placa);
    const filete = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 0.11), toon(P.wallCream));
    filete.position.set(0, 2.42, 0.01);
    portico.add(filete);
    // o nome, desenhado num canvas como todas as placas do jogo
    const nome = letreiro('RODA GIGANTE', 2.35, 0.34, '#c0392b');
    nome.position.set(0, 2.42, 0.07);
    portico.add(nome);
    // as lampadinhas da moldura, como em parque de verdade
    for (let i = 0; i < 7; i++) {
      const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), toon(P.luzDoPortao));
      bulbo.position.set(-1.35 + i * 0.45, 2.85, 0.12);
      portico.add(bulbo);
    }
    plataforma.add(portico);

    // a coberturinha do púlpito do bilheteiro: pequena, e SÓ sobre ele
    const chapeuDoPulpito = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.1, 0.95), toon(P.fabricRed));
    chapeuDoPulpito.position.set(-1.95, 1.95, 0.9);
    plataforma.add(chapeuDoPulpito);
    const hasteDoPulpito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), metal);
    hasteDoPulpito.position.set(-1.95, 1.5, 0.62);
    plataforma.add(hasteDoPulpito);

    this.group.add(plataforma);

    // --------------------------------------------- a cerca de corrente
    /**
     * Ela contorna a laje e ABRE na frente da plataforma. O vão não é enfeite:
     * cerca fechada em volta de uma coisa em que se entra é uma contradição que
     * o olho percebe antes da cabeça.
     */
    const raioDaCerca = R * 0.72;
    const POSTES = 18;
    const pontos: number[] = [];
    for (let i = 0; i < POSTES; i++) {
      const a = (i / POSTES) * Math.PI * 2;
      // o vão da frente: pula os postes que caem na boca da plataforma
      const naFrente = Math.sin(a) > 0.72;
      if (naFrente) continue;
      const x = Math.cos(a) * raioDaCerca;
      const z = Math.sin(a) * raioDaCerca;
      const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.85, 8), metalEscuro);
      poste.position.set(x, 0.42, z);
      this.group.add(poste);
      // a corrente pendurada até o próximo poste, desenhada como linha
      const b = ((i + 1) / POSTES) * Math.PI * 2;
      if (Math.sin(b) > 0.72) continue;
      pontos.push(x, 0.72, z, Math.cos(b) * raioDaCerca, 0.72, Math.sin(b) * raioDaCerca);
    }
    this.group.add(new THREE.LineSegments(buildLines(pontos), line(P.metalGrey)));
  }

  /**
   * ================================================ O INTERIOR DA CABINE
   *
   * Só se vê de dentro, e só durante os quarenta segundos de primeira pessoa
   * lá em cima — por isso ele é UM só e muda de cabine (`abrirCabine`) em vez
   * de existir 32 vezes. A casca da cabine é `FrontSide`: de dentro ela some
   * sozinha e o parque aparece inteiro, o que faz do vão entre o peitoril e o
   * teto uma janela que dá a volta completa sem custar um único polígono.
   *
   * O que este método desenha é a MOLDURA dessa janela: piso, peitoril,
   * montantes, aro de cima, teto e a lâmpada. O piso fica na altura em que os
   * pés dos dois pousam (`PISO`), que é a mesma que a cena usa no `ridePlayer`.
   *
   * AS MEDIDAS SÃO AS DA GENTE DE DENTRO, não as da cápsula. Os dois viajam em
   * escala 0,55 e sentados o olho deles fica 0,72 acima do piso — um interior
   * do tamanho da casca (1,55 de largura por 1,0 de altura) lia como um salão
   * baixo e largo, não como uma cabine. Este aqui é da largura deles, e a
   * casca por fora não denuncia nada: ela é invisível de dentro.
   */
  static readonly PISO = -0.34;

  private montarOInterior(): THREE.Group {
    const g = new THREE.Group();
    const piso = FerrisWheel.PISO;
    const raio = 0.54;
    const achatado = 0.92; // a cápsula é espremida em z; a moldura acompanha

    const chao = new THREE.Mesh(
      new THREE.CylinderGeometry(raio * 0.94, raio * 0.94, 0.05, 20),
      toon(P.cabinePiso),
    );
    chao.scale.z = achatado;
    chao.position.y = piso - 0.025;
    g.add(chao);

    // saia opaca do peitoril: fecha o pé da janela para não se ver o vazio
    const saia = new THREE.Mesh(
      new THREE.CylinderGeometry(raio, raio, 0.13, 22, 1, true),
      toon(P.cabineEsquadria, { doubleSide: true }),
    );
    saia.scale.z = achatado;
    saia.position.y = piso + 0.065;
    g.add(saia);

    /*
     * OS BANCOS OLHAM PARA +Z, que é onde o parque está.
     *
     * A primeira versão sentava os dois de costas para ele: da cabine se via a
     * grama vazia e o skyline da cidade, e o parque — o lago, a cúpula, o
     * quiosque do Mano — ficava atrás da nuca. Aqui o banco com encosto é o de
     * `z` NEGATIVO, e quem senta nele olha para a frente da roda.
     *
     * E É UM BANCO SÓ. Tinha um segundo, baixo, na frente — mas o parque, visto
     * do alto, fica LÁ EMBAIXO: o olhar desce uns 30° para achar o lago e a
     * cúpula, e a essa inclinação o banco da frente era a única coisa na tela.
     * Sem ele dá para olhar até uns 48°, que é onde o peitoril começa.
     */
    const madeira = toon(P.cabineBanco);
    const estofo = toon(P.cabineEstofado);
    for (const [z, comEncosto] of [[-0.28, true]] as const) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.27, 0.24), madeira);
      base.position.set(0, piso + 0.135, z);
      g.add(base);
      const almofada = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.07, 0.22), estofo);
      almofada.position.set(0, piso + 0.305, z);
      g.add(almofada);
      if (!comEncosto) continue;
      const encosto = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.34, 0.06), madeira);
      encosto.position.set(0, piso + 0.5, z - 0.12);
      encosto.rotation.x = -0.14;
      g.add(encosto);
      const forro = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.04), estofo);
      forro.position.set(0, piso + 0.5, z - 0.08);
      forro.rotation.x = -0.14;
      g.add(forro);
    }

    // ---------------------------------------------------- esquadria da janela
    const esquadria = toon(P.cabineEsquadria);
    const topo = piso + 0.94; // o aro da janela para logo abaixo da borda da calota
    const MONTANTES = 8;
    for (let i = 0; i < MONTANTES; i++) {
      // meio passo de rotação: assim nenhum montante nasce bem no meio da
      // vista de quem está sentado olhando para fora
      const a = ((i + 0.5) / MONTANTES) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.04, topo - piso - 0.13, 0.04), esquadria);
      m.position.set(Math.cos(a) * raio, (piso + 0.13 + topo) / 2, Math.sin(a) * raio * achatado);
      m.rotation.y = -a;
      g.add(m);
    }
    const aro = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.03, 6, 22), esquadria);
    aro.rotation.x = Math.PI / 2;
    aro.scale.y = achatado;
    aro.position.y = topo;
    g.add(aro);

    /*
     * O TETO É `flat()`, e não `toon()`: virado para baixo ele não pega nada
     * do sol e o material sombreado saía verde-oliva escuro, com cara de
     * caverna. Sem luz, chapado, ele fica creme — que é a cor que ele tem.
     */
    /*
     * O TETO É UMA CALOTA, e não um disco. Com um disco do tamanho do aro
     * sobrava uma fresta entre a borda dele e a casca, e por essa fresta se via
     * o braço da cabine: uma caixa preta pendurada no céu bem no alto da tela.
     * A calota tem o raio da própria cápsula (0,80 contra 0,816) e o mesmo
     * centro do capuz dela, então ela forra a casca por dentro sem furo nenhum
     * — e começa acima do aro da janela, para não comer a vista de lado.
     */
    const teto = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 20, 10, 0, Math.PI * 2, 0, 1.0),
      flat(P.cabineEsquadria),
    );
    teto.scale.z = achatado;
    teto.position.y = 0.204;
    g.add(teto);

    // a lâmpada: a única luz do lado de dentro, e o que faz a cabine parecer
    // um lugar em vez de um buraco
    // a haste também é chapada: virada para baixo, sombreada, ela saía preta
    const haste = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.06, 6),
      flat(P.cabineEsquadria),
    );
    haste.position.y = 0.83;
    g.add(haste);
    const lampada = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 10),
      toon(P.cabineLuz, { glow: 0.7 }),
    );
    lampada.position.y = 0.775;
    g.add(lampada);

    g.visible = false;
    return g;
  }

  /**
   * Põe o interior dentro de `cabine` e o acende. A cabine some da física e da
   * lógica do resto: quem chama é a cutscene do passeio.
   */
  abrirCabine(cabine: THREE.Group): void {
    cabine.add(this.interior);
    this.interior.visible = true;
    this.atravessarAEstrutura(true);
    /*
     * E A CASCA PARA DE FAZER SOMBRA. Ela envolve os dois por todos os lados,
     * então enquanto ela projetava sombra os dois viajavam dentro do próprio
     * escuro: o parceiro saía preto, sem rosto. De fora ninguém sente falta —
     * a essa altura a sombra dela no chão é um borrão a trinta metros.
     */
    cabine.traverse((n) => {
      if ((n as THREE.Mesh).isMesh) n.castShadow = false;
    });
    // e o braço some: ele nasce ACIMA da calota do teto e aparecia como uma
    // caixinha cinza pendurada no céu, no alto da tela. De dentro ninguém
    // precisa dele; de fora, nesses quarenta segundos, ninguém está olhando.
    const braco = cabine.children[0];
    if (braco) braco.visible = false;
  }

  /**
   * ======================== A ESTRUTURA VIRA VIDRO ENQUANTO ALGUÉM ESTÁ DENTRO
   *
   * Os dois olham para o PARQUE, que fica em +Z — e entre a cabine e o parque
   * está a metade da frente da roda: um aro, a treliça e o leque de cabos. De
   * dentro isso corta a vista em fatias.
   *
   * A solução não é sumir com a roda (sem ela não se está numa roda gigante):
   * é deixá-la quase invisível, um fantasma de vidro por onde o parque
   * aparece inteiro e a estrutura continua sendo lida. `depthWrite = false` é
   * o que faz de verdade a diferença — sem isso ela some da imagem mas
   * continua tapando tudo no buffer de profundidade.
   *
   * Os materiais são CÓPIAS, e não o original com a opacidade mexida: o
   * `toon()` guarda material em cache, e mexer no branco da roda apagaria
   * meio parque junto.
   */
  private readonly fantasmas = new Map<THREE.Material, THREE.Material>();
  private readonly trocados: Array<{
    alvo: THREE.Object3D & { material: THREE.Material };
    original: THREE.Material;
    sombra: boolean;
  }> = [];

  private atravessarAEstrutura(ligado: boolean): void {
    if (!ligado) {
      for (const t of this.trocados) {
        t.alvo.material = t.original;
        t.alvo.castShadow = t.sombra;
      }
      this.trocados.length = 0;
      return;
    }
    this.rim.traverse((n) => {
      const alvo = n as THREE.Object3D & { material?: THREE.Material | THREE.Material[] };
      if (!alvo.material || Array.isArray(alvo.material)) return;
      const original = alvo.material;
      let copia = this.fantasmas.get(original);
      if (!copia) {
        copia = original.clone();
        copia.transparent = true;
        // a linha some mais que a barra: um leque de 64 cabos soma opacidade e
        // vira névoa se cada fio for tão visível quanto uma viga
        copia.opacity = (original as THREE.LineBasicMaterial).isLineBasicMaterial ? 0.05 : 0.1;
        copia.depthWrite = false;
        this.fantasmas.set(original, copia);
      }
      this.trocados.push({
        alvo: alvo as THREE.Object3D & { material: THREE.Material },
        original,
        sombra: alvo.castShadow,
      });
      alvo.material = copia;
      // e para de fazer sombra: a treliça riscava o rosto dos dois lá dentro
      alvo.castShadow = false;
    });
  }

  /** Recolhe o interior; a cabine volta a ser uma cápsula fechada como as outras. */
  fecharCabine(): void {
    const cabine = this.interior.parent;
    this.interior.visible = false;
    this.group.add(this.interior);
    this.atravessarAEstrutura(false);
    if (cabine && cabine !== this.group) {
      cabine.traverse((n) => {
        if ((n as THREE.Mesh).isMesh) n.castShadow = true;
      });
      const braco = cabine.children[0];
      if (braco) braco.visible = true;
    }
  }

  /** angulo (rad) da cabine i no plano da roda */
  private cabinAngle(i: number): number {
    return this.angle + (i / this.cabinCount) * Math.PI * 2;
  }

  private layout(): void {
    for (let i = 0; i < this.cabins.length; i++) {
      const a = this.cabinAngle(i);
      this.cabins[i].position.set(
        Math.cos(a) * this.radius,
        this.hubHeight + Math.sin(a) * this.radius,
        0,
      );
    }
  }

  update(dt: number): void {
    this.angle += this.speed * dt;
    this.rim.rotation.z = this.angle;
    /**
     * OS PNEUS GIRAM NA VELOCIDADE CERTA, e não numa qualquer: quem encosta no
     * aro anda com ele, então `v = ω·R` na borda, e o pneu de raio `r` gira a
     * `ω·R/r`. Com um número inventado a roda de atrito patinaria à vista de
     * todo mundo — e o detalhe existe justamente para mostrar como ela anda.
     */
    const giroDoPneu = (this.speed * this.radius) / (this.radius * 0.075);
    for (const pneu of this.pneus) pneu.rotation.z -= giroDoPneu * dt;
    this.layout();
  }

  /** Dá um terço de volta na catraca: alguém acabou de passar. */
  girarACatraca(): void {
    if (this.catraca) this.catraca.rotation.y -= (Math.PI * 2) / 3;
  }

  /** A cabine que esta passando mais perto do ponto de embarque (embaixo). */
  boardingCabin(): THREE.Group {
    let best = this.cabins[0];
    let bestY = Infinity;
    for (const cabin of this.cabins) {
      if (cabin.position.y < bestY) {
        bestY = cabin.position.y;
        best = cabin;
      }
    }
    return best;
  }

  /** Quantas voltas a cabine ja deu desde `fromAngle`. */
  turnsSince(fromAngle: number): number {
    return (this.angle - fromAngle) / (Math.PI * 2);
  }
}

function buildLines(points: number[]): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geo;
}
