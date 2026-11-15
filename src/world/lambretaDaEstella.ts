import * as THREE from 'three';
import { Estella } from '../entities/bichos/Estella';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo } from './fundir';
import { quina } from './lojaDeRoupas';
import { novaTextura } from './texturasDeChao';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * ================================================ A LAMBRETA DA ESTELLA
 *
 * O veículo da Estella na estrada (pedido do Renan, 2026-11-15): "a lambreta
 * com sidecar, ela com aquele capacete com óculos grande enquanto dirige, e no
 * sidecar uma pilha comicamente grande de roupas, bastante mesmo".
 *
 * - A LAMBRETA é a italiana de sempre: a barriga redonda atrás (o motor
 *   escondido), o assoalho de ripas de borracha, o escudo curvo na frente das
 *   pernas, a cabeça do guidão com o farol redondo e os retrovisores de
 *   haste, as rodinhas de aro creme, o banco de couro e o bagageiro cromado.
 * - O SIDECAR vai do lado de FORA da pista (o `+X`, à esquerda dela): na
 *   conversa, a câmera vem do lado do Bebito, e assim a Estella fica NA FRENTE
 *   da pilha — com o sidecar do outro lado, a torre tapava a dona.
 * - A PILHA são blocos ENCADEADOS (cada bloco é filho do de baixo), cada um um
 *   lote de roupas dobradas com a cor por cópia (as cores do catálogo da
 *   boutique): ela balança como um rabo, e o topo chega depois do pé. Por cima,
 *   o chapéu, o vestido pendurado pela beira, a manga caindo, a meia
 *   equilibrada, o cabide enganchado e o lenço voando. As fitas de amarrar
 *   cruzam a pilha (e claramente não seguram nada).
 *
 * Tudo é desenhado no tamanho de uma lambreta de verdade e o grupo `veiculo`
 * cresce no fim (`ESCALA`): perto do Bebito e na câmera de perseguição, no
 * tamanho de verdade ela sumia. A Estella cresce junto.
 */
export const ESCALA_DA_LAMBRETA = 1.55;

const RODA = 0.2;
const EIXO_FRENTE = 0.64;
const EIXO_TRAS = -0.56;
/** o sidecar: o meio da banheira e a roda dele */
const SIDECAR = { x: 0.92, z: 0.02, rodaZ: -0.04 };

type Por = (geo: THREE.BufferGeometry, cor: number, x: number, y: number, z: number, pai?: THREE.Object3D) => THREE.Mesh;

export class LambretaDaEstella {
  readonly group = new THREE.Group();
  readonly estella = new Estella({ minX: -0.2, maxX: 0.2, minZ: -0.2, maxZ: 0.2 });
  private readonly veiculo = new THREE.Group();
  private readonly rodas: THREE.Group[] = [];
  private readonly blocos: THREE.Group[] = [];
  private readonly lenco: THREE.Group[] = [];
  private relogio = 0;
  private velocidade = 0;
  /** o empurrão da pilha: positivo quando ela acelera (a pilha fica para trás) */
  private inercia = 0;
  private inerciaVel = 0;

  constructor(estacionada = false) {
    this.group.userData.peca = 'lambreta-da-estella';
    this.veiculo.scale.setScalar(ESCALA_DA_LAMBRETA);
    this.group.add(this.veiculo);
    const lata = new THREE.Group();
    const por: Por = (geo, cor, x, y, z, pai = lata) => {
      const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); pai.add(m); return m;
    };
    const tubo = (pontos: number[][], raio: number, cor: number, pai: THREE.Object3D = lata): THREE.Mesh => {
      const curva = new THREE.CatmullRomCurve3(pontos.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      const m = new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(6, pontos.length * 8), raio, 8), toon(cor)); pai.add(m); return m;
    };

    this.montarRodas();
    this.montarLambreta(por, tubo);
    this.montarSidecar(por, tubo);
    this.veiculo.add(fundir(lata));
    this.montarPilha();

    if (!estacionada) {
      this.estella.entrarEmServico();
      this.estella.pilotando = true;
      // sentada no banco: o traseiro dela (com o corpo inclinado) cai na almofada
      this.estella.group.position.set(0, 0.36, -0.12);
      this.estella.group.scale.setScalar(0.92);
      this.estella.apoioDoCapacete.add(capaceteDaEstella());
      this.veiculo.add(this.estella.group);
      this.update(0, 0, false);
    } else {
      // ESTACIONADA (no Villa Lobos, depois do primeiro encontro): sem ninguém, a pilha já
      // torta (o `update` dá o tombo de cada bloco) e tudo junto como fundo — ninguém a mexe
      this.update(0, 0, false);
      fundirComoFundo(this.group);
    }
  }

  /**
   * O LENÇO DO ALTO SAI VOANDO (quando ela arranca): ele some da pilha, e a cena
   * lança o pano no lugar dele (`eventos/bebitoMobile/panoNoParaBrisa.ts`).
   * Devolve onde ele estava, no mundo.
   */
  soltarPano(): THREE.Vector3 {
    const onde = new THREE.Vector3();
    this.lenco[0].getWorldPosition(onde);
    this.lenco[0].visible = false;
    return onde;
  }

  // ------------------------------------------------------------------ as rodas
  /** a rodinha de lambreta: pneu gordo, o aro creme de duas metades e o cubo cromado */
  private montarRodas(): void {
    const roda = (x: number, z: number): void => {
      const g = new THREE.Group(); g.position.set(x, RODA, z); g.rotation.y = Math.PI / 2;
      g.add(new THREE.Mesh(new THREE.TorusGeometry(RODA - 0.055, 0.058, 10, 28), toon(P.pneu)));
      for (const lado of [-1, 1]) {
        const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.03, 20).rotateX(Math.PI / 2), toon(P.lambretaCreme));
        aro.position.z = lado * 0.035; g.add(aro);
        const cubo = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), toon(P.churrascoInox));
        cubo.scale.z = 0.5; cubo.position.z = lado * 0.055; g.add(cubo);
        // os cinco parafusos do aro: são eles que mostram a roda girando
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 6).rotateX(Math.PI / 2), toon(P.churrascoInoxEscuro));
          p.position.set(Math.cos(a) * 0.075, Math.sin(a) * 0.075, lado * 0.052); g.add(p);
        }
      }
      this.rodas.push(g); this.veiculo.add(fundir(g));
    };
    roda(0, EIXO_FRENTE);
    roda(0, EIXO_TRAS);
    roda(SIDECAR.x + 0.02, SIDECAR.rodaZ);
  }

  // ------------------------------------------------------------- a lambreta
  private montarLambreta(por: Por, tubo: (p: number[][], r: number, c: number, pai?: THREE.Object3D) => THREE.Mesh): void {
    // a barriga de trás: o casco grande e as duas bochechas (o motor de um lado, o estepe do outro)
    const barriga = por(new THREE.SphereGeometry(1, 28, 18), P.lambretaMenta, 0, 0.44, -0.42);
    barriga.scale.set(0.24, 0.27, 0.5);
    for (const lado of [-1, 1]) {
      const bochecha = por(new THREE.SphereGeometry(1, 24, 16), P.lambretaMenta, lado * 0.15, 0.36, -0.46);
      bochecha.scale.set(0.15, 0.2, 0.36);
      // o friso cromado que corre na bochecha, e as grelhas de ar do motor
      const friso = por(new THREE.TorusGeometry(1, 0.05, 6, 30, Math.PI * 0.9), P.churrascoInox, lado * 0.282, 0.36, -0.46);
      friso.scale.set(0.36, 0.2, 1); friso.rotation.set(0, lado * Math.PI / 2, Math.PI * 0.05);
      for (let i = 0; i < 4; i++) {
        const fenda = por(quina(0.012, 0.075, 0.018, 0.005), P.lambretaMentaSombra, lado * 0.29, 0.38, -0.36 - i * 0.05);
        fenda.rotation.z = lado * 0.25;
      }
    }
    // a cauda: a lanterna redonda e a placa
    por(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16).rotateX(Math.PI / 2), P.onibusLanterna, 0, 0.56, -0.93);
    por(new THREE.CylinderGeometry(0.058, 0.058, 0.024, 16).rotateX(Math.PI / 2), P.churrascoInox, 0, 0.56, -0.92);
    const placa = por(quina(0.17, 0.09, 0.012, 0.01), P.lambretaCreme, 0, 0.42, -0.92); placa.rotation.x = 0.2;
    // o túnel do meio e o ASSOALHO de ripas de borracha
    const tunel = por(quina(0.16, 0.12, 0.6, 0.05), P.lambretaMenta, 0, 0.27, 0.06);
    tunel.rotation.x = -0.05;
    por(quina(0.4, 0.05, 0.62, 0.025), P.lambretaMenta, 0, 0.215, 0.12);
    for (let i = 0; i < 6; i++) por(quina(0.012, 0.012, 0.56, 0.005), P.lambretaBorracha, -0.15 + i * 0.06, 0.244, 0.12);
    for (const lado of [-1, 1]) por(quina(0.016, 0.03, 0.62, 0.008), P.churrascoInox, lado * 0.2, 0.226, 0.12);
    // o ESCUDO: a casca curva na frente das pernas, com o friso creme na beira e o emblema
    const escudo = por(new THREE.CylinderGeometry(0.3, 0.26, 0.72, 28, 1, true, -1.1, 2.2), P.lambretaMenta, 0, 0.6, 0.27);
    escudo.material = toon(P.lambretaMenta, { doubleSide: true }); escudo.rotation.x = -0.1;
    // a beira creme no alto do escudo (o arco do torus, deitado e girado para a frente)
    const beira = por(new THREE.TorusGeometry(0.3, 0.018, 6, 30, 2.2), P.lambretaCreme, 0, 0.96, 0.31);
    beira.rotation.set(Math.PI / 2 - 0.1, 0, -Math.PI / 2 - 1.1 + Math.PI);
    // o emblema da frente: o redondinho com a tesoura da costureira (canvas)
    const emblema = por(new THREE.CircleGeometry(0.075, 24), P.placaPintada, 0, 0.74, 0.585);
    emblema.material = toon(P.placaPintada, { mapa: emblemaDaEstella() }); emblema.rotation.x = -0.1;
    // a COLUNA, o para-lama da frente e o garfo
    tubo([[0, 0.3, EIXO_FRENTE - 0.02], [0, 0.62, 0.56], [0, 0.98, 0.5]], 0.04, P.lambretaMentaSombra);
    const paraLama = por(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), P.lambretaMenta, 0, RODA + 0.02, EIXO_FRENTE);
    paraLama.scale.set(0.13, 0.17, 0.27);
    por(new THREE.TorusGeometry(0.06, 0.012, 6, 14), P.churrascoInox, 0, RODA + 0.18, EIXO_FRENTE + 0.02).rotation.y = Math.PI / 2;
    // a CABEÇA DO GUIDÃO com o farol redondo de aro cromado
    const cabeca = por(new THREE.SphereGeometry(1, 20, 14), P.lambretaMenta, 0, 1.03, 0.5);
    cabeca.scale.set(0.16, 0.09, 0.13);
    por(new THREE.CylinderGeometry(0.075, 0.075, 0.04, 20).rotateX(Math.PI / 2), P.churrascoInox, 0, 1.03, 0.62);
    const farol = por(new THREE.SphereGeometry(0.066, 16, 10), P.luzDoPortao, 0, 1.03, 0.635);
    farol.scale.z = 0.4;
    // o guidão, as manoplas e os retrovisores redondos de haste
    tubo([[-0.33, 1.07, 0.44], [-0.16, 1.06, 0.5], [0.16, 1.06, 0.5], [0.33, 1.07, 0.44]], 0.017, P.churrascoInox);
    for (const lado of [-1, 1]) {
      const manopla = por(new THREE.CylinderGeometry(0.026, 0.026, 0.11, 10).rotateZ(Math.PI / 2), P.lambretaBorracha, lado * 0.37, 1.07, 0.43);
      manopla.rotation.y = lado * 0.3;
      tubo([[lado * 0.22, 1.07, 0.49], [lado * 0.28, 1.2, 0.48], [lado * 0.3, 1.31, 0.46]], 0.009, P.churrascoInox);
      por(new THREE.CylinderGeometry(0.055, 0.055, 0.018, 18).rotateX(Math.PI / 2), P.churrascoInox, lado * 0.3, 1.36, 0.46);
      por(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 18).rotateX(Math.PI / 2), P.oculosDeAviadorLente, lado * 0.3, 1.36, 0.468);
      // a lanterninha de pisca na ponta do guidão
      por(new THREE.SphereGeometry(0.022, 8, 6), P.onibusPisca, lado * 0.43, 1.07, 0.42);
    }
    // o BANCO de couro caramelo com o cordão de costura creme, em cima da barriga
    const banco = por(new THREE.CapsuleGeometry(0.13, 0.42, 6, 14).rotateX(Math.PI / 2), P.lambretaBanco, 0, 0.72, -0.3);
    banco.scale.set(1, 0.42, 1);
    const costura = por(new THREE.TorusGeometry(1, 0.012, 4, 36), P.lambretaCreme, 0, 0.7, -0.3);
    costura.scale.set(0.135, 0.27, 1); costura.rotation.x = Math.PI / 2;
    // o bagageiro cromado atrás do banco, com a frasqueira de chapéu amarrada
    for (const lado of [-1, 1]) tubo([[lado * 0.12, 0.64, -0.58], [lado * 0.12, 0.7, -0.66], [lado * 0.12, 0.7, -0.86], [lado * 0.08, 0.66, -0.9]], 0.011, P.churrascoInox);
    const frasqueira = por(new THREE.CylinderGeometry(0.12, 0.12, 0.13, 20), P.capaceteDaEstella, 0, 0.78, -0.76);
    frasqueira.scale.z = 0.8;
    por(new THREE.CylinderGeometry(0.122, 0.122, 0.022, 20), P.lambretaCreme, 0, 0.825, -0.76).scale.z = 0.8;
    por(new THREE.TorusGeometry(0.035, 0.008, 5, 12, Math.PI), P.churrascoInox, 0, 0.85, -0.76);
  }

  // --------------------------------------------------------------- o sidecar
  private montarSidecar(por: Por, tubo: (p: number[][], r: number, c: number, pai?: THREE.Object3D) => THREE.Mesh): void {
    const { x, z } = SIDECAR;
    // a BANHEIRA: o torpedo menta (meia casca de baixo), o bico da frente e a beira creme da boca
    const banheira = por(new THREE.SphereGeometry(1, 30, 16, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58), P.lambretaMenta, x, 0.62, z);
    banheira.scale.set(0.34, 0.36, 0.78);
    const bico = por(new THREE.SphereGeometry(1, 20, 12), P.lambretaMenta, x, 0.5, z + 0.52);
    bico.scale.set(0.24, 0.2, 0.32);
    const boca = por(new THREE.TorusGeometry(1, 0.035, 8, 40), P.lambretaCreme, x, 0.6, z - 0.05);
    boca.scale.set(0.31, 0.62, 1); boca.rotation.x = Math.PI / 2;
    // o para-lama da roda dele, o farolete na proa e o para-brisa curtinho
    const paraLama = por(new THREE.SphereGeometry(1, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), P.lambretaMenta, x + 0.02, RODA + 0.02, SIDECAR.rodaZ);
    paraLama.scale.set(0.11, 0.17, 0.27);
    const farolete = por(new THREE.SphereGeometry(0.045, 12, 8), P.luzDoPortao, x, 0.6, z + 0.82); farolete.scale.z = 0.5;
    por(new THREE.TorusGeometry(0.046, 0.01, 5, 14), P.churrascoInox, x, 0.6, z + 0.83);
    // o CHASSI que prende o sidecar na lambreta: dois braços cromados por baixo
    tubo([[0.1, 0.24, 0.4], [0.45, 0.28, 0.42], [x - 0.12, 0.36, 0.4]], 0.022, P.churrascoInox);
    tubo([[0.1, 0.24, -0.32], [0.45, 0.28, -0.34], [x - 0.12, 0.36, -0.36]], 0.022, P.churrascoInox);
    // o degrauzinho de entrar e a plaquinha "ATELIÊ ESTELLA" no flanco de fora
    // (o canvas é quadrado e a plaquinha é comprida: ela lê só a faixa do meio dele, pelo UV)
    const geo = new THREE.PlaneGeometry(0.42, 0.11);
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, 0.36 + uv.getY(i) * 0.28);
    // (um fio para fora da barriga da banheira, que nessa altura tem 0,33 de raio, e deitada como ela)
    const plaquinha = por(geo, P.placaPintada, x + 0.345, 0.53, z + 0.08);
    plaquinha.material = toon(P.placaPintada, { mapa: plaquinhaDoAtelie() }); plaquinha.rotation.set(0, Math.PI / 2 - 0.06, 0); plaquinha.rotateX(-0.3);
  }

  // ----------------------------------------------------------------- a pilha
  /**
   * A PILHA DE ROUPAS. Cinco blocos, cada um filho do de baixo (como os gomos
   * de um rabo): o balanço de um soma no outro, e o topo é o que mais vai. A
   * torre já nasce TORTA (cada bloco escorrega um tico para um lado, e o
   * seguinte volta): é o equilíbrio precário que faz rir.
   *
   * O que faz ler ROUPA, e não pilha de livros (a primeira versão, de lâminas
   * retas e cores escuras, lia como estante): cada peça é uma ALMOFADINHA de
   * pano dobrado (o contorno de quina redonda extrudado com o bisel gordo, a
   * beira fofa), as de baixo largas e transbordando do sidecar, e em todo
   * bloco umas PONTAS CAINDO pelas beiradas — a perna de uma calça, a manga
   * de uma blusa, a saia, a toalha — juntas numa malha de cor por vértice. As
   * cores são as do catálogo da boutique, puxadas para as claras.
   */
  private montarPilha(): void {
    const CORES = [
      P.lojaMenta, P.lojaTerracota, P.lojaRegata, P.lojaVestidoLilas, P.lojaVestidoManteiga, P.lojaCalcaBege,
      P.lojaVestidoJade, P.lojaGorroAzul, P.capaceteDaEstella, P.lojaLinho, P.lojaBotaVermelha, P.lojaGala,
      P.lojaCalcaVinho, P.lojaVestidoJadeRenda, P.lojaGorroMusgo, P.lojaVestidoLilasRenda, P.lojaCalcaOliva, P.lojaVeludoBarra,
    ];
    const BARRAS = [P.lojaLinho, P.lojaVestidoManteigaRenda, P.lojaGalaRenda, P.lojaVestidoJadeRenda, P.lojaGorroAzulBarra];
    const peca = pecaDobrada();
    const barra = quina(1, 1, 1, 0.3);
    const branco = toon(0xffffff);
    // (com 36 peças a torre passava de 5 m e virava um poste: 23, mais largas, dão um MONTÃO)
    const PECAS = [6, 5, 5, 4, 3];
    let sorte = 7;
    const rnd = (): number => { sorte = (sorte * 16807) % 2147483647; return (sorte - 1) / 2147483646; };
    let pai: THREE.Object3D = this.veiculo;
    // a pilha nasce dentro da banheira, um palmo abaixo da boca
    let base = new THREE.Vector3(SIDECAR.x, 0.5, SIDECAR.z - 0.04);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), cor = new THREE.Color();
    let indiceDeCor = 0;
    for (let b = 0; b < PECAS.length; b++) {
      const bloco = new THREE.Group();
      bloco.name = `pilha-${b}`;
      bloco.position.copy(base);
      // o tombo de cada bloco: um tico para fora, o seguinte de volta para dentro (o S da torre)
      bloco.userData.torto = { x: (b % 2 ? -0.05 : 0.07) * (b > 0 ? 1 : 0.3), z: (b % 2 ? 0.06 : -0.045) };
      pai.add(bloco);
      const n = PECAS[b];
      const lote = new THREE.InstancedMesh(peca, branco, n);
      const barras = new THREE.InstancedMesh(barra, branco, n);
      const pontas: Ponta[] = [];
      let y = 0;
      for (let i = 0; i < n; i++) {
        // embaixo as peças são largas (calças, casacos, toalhas); em cima, menores (blusas, lenços)
        const escalaY = 0.8 + rnd() * 0.55;
        // as de baixo transbordam do sidecar (ele tem 0,68 de largura e 1,5 de comprido)
        const largo = (1.45 - b * 0.12) * (0.88 + rnd() * 0.22);
        const fundo = (1.7 - b * 0.18) * (0.86 + rnd() * 0.2);
        const dx = (rnd() - 0.5) * 0.09, dz = (rnd() - 0.5) * 0.08;
        e.set((rnd() - 0.5) * 0.1, (rnd() - 0.5) * 0.7, (rnd() - 0.5) * 0.1);
        q.setFromEuler(e);
        const alto = ALTO_DA_PECA * escalaY;
        m.compose(new THREE.Vector3(dx, y + alto / 2, dz), q, s.set(largo, escalaY, fundo));
        lote.setMatrixAt(i, m);
        const c = CORES[indiceDeCor++ % CORES.length];
        lote.setColorAt(i, cor.setHex(c));
        // a barra: uma faixa na beira da frente (a gola dobrada, o cós), em duas de cada três
        const temBarra = (b + i) % 3 !== 2;
        const meiaFundo = PECA.fundo / 2 * fundo;
        m.compose(new THREE.Vector3(dx, y + alto * 0.55, dz), q, s.set(temBarra ? PECA.largura * largo * 0.96 : 0, alto * 0.45, temBarra ? 0.05 : 0));
        // a faixa vai para a beira da frente da peça, no giro dela
        const frente = new THREE.Vector3(0, 0, meiaFundo - 0.01).applyQuaternion(q);
        m.setPosition(dx + frente.x, y + alto * 0.55, dz + frente.z);
        barras.setMatrixAt(i, m);
        barras.setColorAt(i, cor.setHex(BARRAS[(b + i) % BARRAS.length]));
        // as pontas que caem: uma a cada duas peças, saindo pela beira dela para um lado
        if ((i + b) % 2 === 0) {
          const giro = e.y + [0, Math.PI / 2, Math.PI, -Math.PI / 2][(i + b * 2) % 4] + (rnd() - 0.5) * 0.6;
          pontas.push({ x: dx, y: y + alto * 0.8, z: dz, giro, beira: Math.abs(Math.cos(giro)) > 0.7 ? fundo : largo,
            largura: 0.12 + rnd() * 0.16, comprido: 0.22 + rnd() * 0.3,
            cor: c, jeito: (i + b) % 4, });
        }
        y += alto * 0.9;
      }
      lote.userData.roupas = n;
      bloco.add(lote, barras);
      if (pontas.length) bloco.add(new THREE.Mesh(pontasCaindo(pontas), toon(0xffffff, { corPorVertice: true, doubleSide: true })));
      this.blocos.push(bloco);
      pai = bloco;
      base = new THREE.Vector3((rnd() - 0.5) * 0.04, y, (rnd() - 0.5) * 0.03);
    }
    const topo = this.blocos[this.blocos.length - 1];
    this.enfeitesDaPilha(topo, base.y);
    this.cordasDaPilha();
  }

  /** o que vai no alto e pendurado: o chapéu, a meia, o vestido, a manga, o cabide e o lenço */
  private enfeitesDaPilha(topo: THREE.Group, y: number): void {
    const g = new THREE.Group();
    const por: Por = (geo, c, x, yy, z, pai = g) => { const mm = new THREE.Mesh(geo, toon(c)); mm.position.set(x, yy, z); pai.add(mm); return mm; };
    // o chapéu de aba larga com a fita, meio de lado
    const chapeu = new THREE.Group(); chapeu.position.set(0.04, y, 0); chapeu.rotation.set(0.15, 0.4, -0.18); g.add(chapeu);
    por(new THREE.CylinderGeometry(0.27, 0.28, 0.02, 28), P.lojaVestidoManteiga, 0, 0.01, 0, chapeu);
    por(new THREE.CylinderGeometry(0.13, 0.14, 0.13, 24), P.lojaVestidoManteiga, 0, 0.08, 0, chapeu);
    por(new THREE.CylinderGeometry(0.142, 0.142, 0.035, 24), P.capaceteDaEstella, 0, 0.04, 0, chapeu);
    const flor = por(new THREE.SphereGeometry(0.04, 10, 8), P.lojaTerracota, 0.13, 0.05, 0.05, chapeu); flor.scale.z = 0.6;
    // a MEIA equilibrada na aba do chapéu, listrada (duas cores: a ponta e o calcanhar)
    const meia = new THREE.Group(); meia.position.set(-0.17, y + 0.06, -0.06); meia.rotation.set(0.1, 0.6, 0.35); g.add(meia);
    por(new THREE.CapsuleGeometry(0.035, 0.16, 4, 8), P.lojaGorroAzulBarra, 0, 0.1, 0, meia);
    const pe = por(new THREE.CapsuleGeometry(0.037, 0.07, 4, 8), P.lojaBotaVermelha, 0, 0.0, 0.045, meia); pe.rotation.x = Math.PI / 2;
    // o VESTIDO pendurado pela beira de trás, caindo pelos blocos de baixo
    const vestido = new THREE.Mesh(vestidoCaido(), toon(P.lojaVestidoLilas, { doubleSide: true }));
    vestido.position.set(0, y - 0.02, -0.2); g.add(vestido);
    // a MANGA de uma camisa escapando pelo lado de fora, balançando
    // (as miudezas presas num bloco vão num grupo sem nome do bloco, fundido: uma malha por cor)
    const noBloco3 = new THREE.Group(); this.blocos[3].add(noBloco3);
    const manga = por(new THREE.CylinderGeometry(0.04, 0.055, 0.42, 10), P.lojaRegata, 0.27, 0.12, 0.06, noBloco3); manga.rotation.z = 0.25;
    por(new THREE.CylinderGeometry(0.058, 0.058, 0.04, 10), P.lojaLinho, 0.32, -0.08, 0.06, noBloco3).rotation.z = 0.25;
    // o CABIDE de madeira enganchado no bloco do meio, com uma blusa nele
    const noBloco2 = new THREE.Group(); this.blocos[2].add(noBloco2);
    const cabide = new THREE.Group(); cabide.position.set(-0.27, 0.2, 0.05); cabide.rotation.set(0, 0, -0.2); noBloco2.add(cabide);
    por(new THREE.TorusGeometry(0.04, 0.007, 5, 12, Math.PI * 1.3), P.churrascoInox, 0, 0.14, 0, cabide);
    const ombro = por(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8).rotateZ(Math.PI / 2), P.lojaMadeira, 0, 0.1, 0, cabide); ombro.scale.y = 1;
    const blusa = por(new THREE.ConeGeometry(0.17, 0.3, 4, 1, true), P.lojaVestidoJade, 0, -0.06, 0, cabide);
    blusa.rotation.y = Math.PI / 4; blusa.scale.z = 0.35;
    // o LENÇO voando atrás: três gomos encadeados, o de trás o que mais mexe
    let pai: THREE.Object3D = topo;
    for (let i = 0; i < 3; i++) {
      const gomo = new THREE.Group();
      gomo.position.set(i === 0 ? 0.12 : 0, i === 0 ? y - 0.05 : 0, i === 0 ? -0.15 : -0.17);
      const pano = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.18), toon(i % 2 ? P.lojaGala : P.capaceteDaEstella, { doubleSide: true }));
      pano.rotation.x = Math.PI / 2; pano.position.z = -0.085; gomo.add(pano);
      pai.add(gomo); this.lenco.push(gomo); pai = gomo;
    }
    topo.add(fundir(g));
    fundir(noBloco3); fundir(noBloco2);
  }

  /** as fitas de amarrar: duas voltas de corda cruzando a pilha, que (claramente) não seguram nada */
  private cordasDaPilha(): void {
    for (const [b, giro] of [[1, 0.2], [4, -0.35]] as const) {
      const corda = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 5, 30), toon(P.cordaDaPilha));
      corda.scale.set(0.29, 0.25, 1);
      corda.rotation.set(Math.PI / 2, 0, giro);
      corda.position.y = 0.2;
      const amarrado = new THREE.Group(); amarrado.add(corda);
      const no = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), toon(P.cordaDaPilha));
      no.position.set(0.28, 0.2, 0.02); amarrado.add(no);
      this.blocos[b].add(fundir(amarrado));
    }
  }

  // ----------------------------------------------------------------- o quadro
  update(dt: number, distancia: number, conversando: boolean): void {
    this.relogio += dt;
    for (const roda of this.rodas) roda.rotation.z -= distancia / (RODA * ESCALA_DA_LAMBRETA);
    // a inércia da pilha: uma mola que o tranco da aceleração empurra
    const v = dt > 0 ? distancia / dt : 0;
    const acel = dt > 0 ? (v - this.velocidade) / dt : 0;
    this.velocidade = v;
    this.inerciaVel += (-acel * 0.004 - this.inercia * 18 - this.inerciaVel * 3.2) * dt;
    this.inercia = THREE.MathUtils.clamp(this.inercia + this.inerciaVel * dt, -0.18, 0.18);
    const t = this.relogio;
    const vento = Math.min(1, v / 8);
    for (let i = 0; i < this.blocos.length; i++) {
      const k = (i + 1) / this.blocos.length;
      // balança sempre um pouquinho (é pano empilhado), mais andando, e o topo chega depois
      const ginga = Math.sin(t * 2.3 - i * 0.55) * (0.012 + vento * 0.02) * k;
      const torto = this.blocos[i].userData.torto as { x: number; z: number };
      this.blocos[i].rotation.z = torto.z + ginga;
      this.blocos[i].rotation.x = torto.x + this.inercia * 0.35 * k + Math.sin(t * 1.7 - i * 0.6) * 0.008 * k;
    }
    for (let i = 0; i < this.lenco.length; i++) {
      this.lenco[i].rotation.x = -0.15 - vento * 0.25 + Math.sin(t * (6 + vento * 6) - i * 1.1) * (0.2 + vento * 0.25);
      this.lenco[i].rotation.y = Math.sin(t * 3.1 - i) * 0.2;
    }
    this.estella.olharNaLambreta = conversando ? -0.55 : 0;
    this.estella.update(dt);
  }
}

/** a peça dobrada de tamanho "de catálogo": a escala de cada cópia mexe em volta disto */
const PECA = { largura: 0.5, fundo: 0.38, alto: 0.08 };
const ALTO_DA_PECA = PECA.alto;

/**
 * A ALMOFADINHA DE PANO DOBRADO: o contorno de quina redonda deitado e
 * extrudado com um bisel gordo — a beira sai FOFA, arredondada em cima e
 * embaixo, como roupa dobrada (lâmina reta de caixa lia como livro). A
 * origem fica no meio da peça.
 */
function pecaDobrada(): THREE.BufferGeometry {
  const { largura: w, fundo: f, alto: h } = PECA;
  const r = 0.07, b = h * 0.42;
  const forma = new THREE.Shape();
  const x0 = -w / 2 + b, x1 = w / 2 - b, z0 = -f / 2 + b, z1 = f / 2 - b;
  forma.moveTo(x0 + r, z0);
  forma.lineTo(x1 - r, z0); forma.quadraticCurveTo(x1, z0, x1, z0 + r);
  forma.lineTo(x1, z1 - r); forma.quadraticCurveTo(x1, z1, x1 - r, z1);
  forma.lineTo(x0 + r, z1); forma.quadraticCurveTo(x0, z1, x0, z1 - r);
  forma.lineTo(x0, z0 + r); forma.quadraticCurveTo(x0, z0, x0 + r, z0);
  const geo = new THREE.ExtrudeGeometry(forma, { depth: h - 2 * b * 0.9, bevelEnabled: true, bevelThickness: b * 0.9, bevelSize: b, bevelSegments: 3, curveSegments: 4 });
  geo.rotateX(Math.PI / 2);
  geo.computeBoundingBox();
  const caixa = geo.boundingBox!;
  geo.translate(0, -(caixa.min.y + caixa.max.y) / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

/**
 * AS PONTAS QUE CAEM pelas beiradas de um bloco: cada uma é uma tira de pano
 * que sai de debaixo da peça, dobra na beira e desce, alargando e ondulando
 * na barra. `jeito` diz o que ela é — 0 a toalha (larga), 1 a perna da calça
 * (duas tiras), 2 a manga (estreita, com o punho), 3 a saia (abre em A). Todas
 * numa malha só, com a cor nos vértices.
 */
interface Ponta { x: number; y: number; z: number; giro: number; beira: number; largura: number; comprido: number; cor: number; jeito: number }
function pontasCaindo(pontas: Ponta[]): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  const cor = new THREE.Color();
  for (const p of pontas) {
    const tiras: Array<{ desloca: number; largura: number; abre: number; comprido: number }> =
      p.jeito === 1 ? [{ desloca: -0.045, largura: 0.07, abre: 0.1, comprido: p.comprido }, { desloca: 0.045, largura: 0.07, abre: 0.1, comprido: p.comprido * 0.92 }]
        : p.jeito === 2 ? [{ desloca: 0, largura: 0.06, abre: 0.25, comprido: p.comprido * 0.85 }]
          : p.jeito === 3 ? [{ desloca: 0, largura: p.largura * 0.8, abre: 0.8, comprido: p.comprido * 0.8 }]
            : [{ desloca: 0, largura: p.largura, abre: 0.15, comprido: p.comprido }];
    for (const t of tiras) {
      const geo = new THREE.PlaneGeometry(1, 1, 3, 8);
      const pos = geo.attributes.position;
      // a tira deita até a beira da peça (a escala dela na direção em que cai) e desce
      const BEIRA = PECA.fundo * 0.5 * p.beira;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i), v = 0.5 - pos.getY(i); // v: 0 no começo, 1 na barra
        const lx = t.desloca + u * t.largura * (1 + v * t.abre);
        const queda = Math.max(0, v - 0.18) / 0.82;
        const fora = BEIRA * Math.min(1, v / 0.18) + Math.sin(queda * 1.4) * 0.05;
        const ly = -queda * t.comprido + Math.sin(u * 9 + v * 4) * 0.008 * queda;
        pos.setXYZ(i, lx, ly, fora + Math.sin(u * 7) * 0.012 * queda);
      }
      geo.rotateY(p.giro);
      geo.translate(p.x, p.y, p.z);
      geo.deleteAttribute('uv');
      const cores = new Float32Array(pos.count * 3);
      cor.setHex(p.cor);
      for (let i = 0; i < pos.count; i++) {
        // a barra um tico mais escura: o pano dobra e faz sombra na ponta
        const k = 1 - Math.min(0.12, Math.max(0, p.y - pos.getY(i)) * 0.25);
        cores[i * 3] = cor.r * k; cores[i * 3 + 1] = cor.g * k; cores[i * 3 + 2] = cor.b * k;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
      partes.push(geo);
    }
  }
  const junto = mergeGeometries(partes)!;
  junto.computeVertexNormals();
  return junto;
}

/** o vestido caído pela beira: um pano dobrado na beira do topo, que desce pela pilha balançando a barra */
function vestidoCaido(): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(0.34, 0.7, 6, 14);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    const t = (0.35 - y) / 0.7; // 0 em cima, 1 na barra
    // desce em pé pela beira de trás, abrindo em A, com a barra ondulando
    pos.setXYZ(i, x * (1 + t * 0.55) + Math.sin(x * 30) * 0.008 * t, -t * 0.62, -0.02 - Math.sin(t * 3) * 0.04 + Math.sin(x * 26) * 0.012 * t);
  }
  geo.computeVertexNormals();
  return geo;
}

/** o emblema do escudo: o redondo creme com a tesoura e o carretel da Estella */
function emblemaDaEstella(): THREE.Texture {
  return novaTextura('emblema-da-lambreta', 1, (ctx, s) => {
    const tinta = (c: number): string => '#' + c.toString(16).padStart(6, '0');
    ctx.fillStyle = tinta(P.lambretaCreme); ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = tinta(P.capaceteDaEstella); ctx.lineWidth = s * 0.07; ctx.beginPath(); ctx.arc(s / 2, s / 2, s * 0.43, 0, Math.PI * 2); ctx.stroke();
    // a tesoura aberta
    ctx.strokeStyle = tinta(P.lojaAlfaiataria); ctx.lineWidth = s * 0.05; ctx.lineCap = 'round';
    for (const lado of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s / 2, s * 0.5); ctx.lineTo(s / 2 + lado * s * 0.2, s * 0.24); ctx.stroke();
      ctx.beginPath(); ctx.arc(s / 2 - lado * s * 0.11, s * 0.68, s * 0.07, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s / 2, s * 0.5); ctx.lineTo(s / 2 - lado * s * 0.08, s * 0.62); ctx.stroke();
    }
  });
}

/** a plaquinha do flanco do sidecar: "ATELIÊ ESTELLA" com a fita métrica correndo embaixo */
function plaquinhaDoAtelie(): THREE.Texture {
  const tex = novaTextura('plaquinha-do-sidecar', 1, (ctx, s) => {
    const tinta = (c: number): string => '#' + c.toString(16).padStart(6, '0');
    // a plaquinha usa a faixa de 0,36 a 0,64 do canvas (em `y` de canvas: 0,36 a 0,64 também)
    ctx.fillStyle = tinta(P.lambretaCreme); ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = tinta(P.capaceteDaEstella); ctx.fillRect(0, s * 0.57, s, s * 0.07);
    ctx.fillStyle = tinta(P.lojaAlfaiataria);
    for (let i = 0; i < 32; i++) ctx.fillRect(i * s / 32, s * 0.57, s * 0.005, i % 2 ? s * 0.018 : s * 0.032);
    ctx.fillStyle = tinta(P.lojaVeludo); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `800 ${s * 0.12}px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.fillText('ATELIÊ ESTELLA', s / 2, s * 0.465, s * 0.94);
  }, 512);
  return tex;
}

/**
 * O CAPACETE com os ÓCULOS GRANDES de aviador (o pedido do Renan): o coquinho
 * aberto rosa com a faixa creme de ponta a ponta e o botão de pressão nos
 * lados, por cima do topete de lã — as orelhas da ovelha saem por baixo da
 * beira. Os óculos são dois aros grossos de couro com a lente clara, a ponte
 * e a tira em volta da cabeça. O grupo vai na cabeça dela e vira junto.
 */
function capaceteDaEstella(): THREE.Group {
  const capacete = new THREE.Group(); capacete.name = 'capacete-da-estella';
  const casco = new THREE.Group(); casco.position.set(0, 0.06, -0.01); capacete.add(casco);
  const R = { x: 0.205, y: 0.2, z: 0.215 }, BORDA = 1.35;
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 16, 0, Math.PI * 2, 0, BORDA), toon(P.capaceteDaEstella));
  cupula.scale.set(R.x, R.y, R.z); casco.add(cupula);
  // a beira de couro
  const beira = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 6, 40).rotateX(Math.PI / 2), toon(P.oculosDeAviador));
  beira.scale.set(R.x * Math.sin(BORDA), R.y * 0.8, R.z * Math.sin(BORDA)); beira.position.y = R.y * Math.cos(BORDA); casco.add(beira);
  // a faixa creme da testa à nuca
  const a0 = Math.PI / 2 - (BORDA - 0.05);
  const faixa = new THREE.TorusGeometry(1.01, 0.06, 4, 40, Math.PI - 2 * a0); faixa.rotateZ(a0); faixa.rotateY(Math.PI / 2);
  const listra = new THREE.Mesh(faixa, toon(P.capaceteDaEstellaFaixa)); listra.scale.set(R.x, R.y, R.z); casco.add(listra);
  // os botões de pressão dos lados
  for (const lado of [-1, 1]) {
    const botao = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 6), toon(P.churrascoInox));
    botao.position.set(lado * R.x * 0.97, R.y * Math.cos(BORDA) + 0.03, 0); botao.scale.x = 0.5; casco.add(botao);
  }
  // os ÓCULOS DE AVIADOR na frente dos olhos (os olhos dela moram em ±0,085, 0,028, 0,122)
  const oculos = new THREE.Group(); oculos.name = 'oculos-de-aviador'; oculos.position.set(0, 0.03, 0.15); capacete.add(oculos);
  for (const lado of [-1, 1]) {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.02, 8, 24), toon(P.oculosDeAviador));
    aro.position.set(lado * 0.075, 0, 0); aro.rotation.y = lado * 0.28; oculos.add(aro);
    const cromo = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.007, 5, 24), toon(P.churrascoInox));
    cromo.position.set(lado * 0.079, 0, 0.012); cromo.rotation.y = lado * 0.28; oculos.add(cromo);
    const lente = new THREE.Mesh(new THREE.CircleGeometry(0.056, 24), toon(P.oculosDeAviadorLente, { opacity: 0.38 }));
    lente.position.set(lado * 0.077, 0, 0.006); lente.rotation.y = lado * 0.28; oculos.add(lente);
    // o brilho na lente
    const brilho = new THREE.Mesh(new THREE.CircleGeometry(0.014, 10), toon(P.capaceteDaEstellaFaixa));
    brilho.position.set(lado * 0.077 - 0.02, 0.022, 0.012); brilho.rotation.y = lado * 0.28; oculos.add(brilho);
  }
  const ponte = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.04, 6).rotateZ(Math.PI / 2), toon(P.oculosDeAviador));
  ponte.position.set(0, 0.006, -0.008); oculos.add(ponte);
  // a tira em volta da cabeça, na altura dos óculos
  const tira = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 4, 36).rotateX(Math.PI / 2), toon(P.oculosDeAviador));
  tira.scale.set(0.168, 0.4, 0.168); tira.position.set(0, 0.03, -0.01); capacete.add(tira);
  return fundir(capacete);
}
