import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { PATINHO, PATO_BRANCO, PATO_CREME, PatoDoLago } from '../../entities/bichos/PatoDoLago';
import { TigreDagua } from '../../entities/bichos/TigreDagua';
import type { BichosDaTravessia } from './rota';

/**
 * ============================================ OS BICHOS QUE ATRAVESSAM A PISTA
 *
 * A faixa de pedestres da viagem de carro (`scenes/viagemDeCarro.ts`): o
 * pedido do Renan — "faixas para pararmos para animais passarem". Quem
 * atravessa são os moradores do lago do Villa Lobos, indo ou voltando dele:
 *
 *  - a PATA COM OS PATINHOS (`PatoDoLago`, a mesma classe do lago): ela na
 *    frente, eles em fila atrás, cada um seguindo o de antes. Em terra o pato
 *    ganha o que a água escondia — as patinhas laranja, que batem no passo;
 *  - os TIGRES-D'ÁGUA (`TigreDagua`): devagar, um atrás do outro, balançando
 *    o casco.
 *
 * A BUZINA muda os dois, cada um do seu jeito: a pata apressa o passo
 * (reclamando), e o tigre-d'água se ESCONDE no casco e para um instante —
 * buzinar para tartaruga só atrasa.
 *
 * Ninguém é atropelado nunca: quem garante é a cena (o carro freia sozinho
 * antes da linha). Aqui os bichos só levam o SUSTO (`assustar`): um pulinho.
 */

const V = THREE.Vector3;

/** o tamanho em terra: do tamanho de verdade, de dentro do carro, eles somem */
const ESCALA = { pato: 1.55, patinho: 1.7, tigre: 2.8 } as const;

interface Andante {
  grupo: THREE.Object3D;
  /** quanto do caminho ele já andou, em metros */
  u: number;
  /** o lugar dele na fila (metros atrás do primeiro) */
  atras: number;
  /** para o lado do caminho, em metros (a fila não é uma régua) */
  desvio: number;
  pato?: PatoDoLago;
  pes?: THREE.Object3D[];
  tigre?: TigreDagua;
  alto: number;
  fase: number;
}

export class TravessiaDeBichos {
  readonly group = new THREE.Group();
  readonly tipo: BichosDaTravessia;
  /** `esperando` na calçada, `atravessando`, e `feito` quando o último saiu da pista */
  estado: 'esperando' | 'atravessando' | 'feito' = 'esperando';
  /** a cena liga aqui o som: o grasnado, o piado */
  aoSoar: ((som: 'pato' | 'piado') => void) | null = null;
  private readonly andantes: Andante[] = [];
  private readonly de: THREE.Vector3;
  private readonly rumo: THREE.Vector3;
  private readonly lado: THREE.Vector3;
  private readonly comprimento: number;
  private readonly olhando: number;
  private readonly altoDaCalcada: number;
  /** em que trecho do caminho fica a pista (de onde até onde o carro não pode passar) */
  private readonly pista: [number, number];
  private pressa = 0;
  private escondido = 0;
  private susto = 0;
  private relogio = 0;
  private proximoSom = 1.2;

  /**
   * `de` e `ate` são os dois pontos de calçada (no mundo); `pista` diz em que
   * metros desse caminho fica o asfalto.
   */
  constructor(tipo: BichosDaTravessia, quantos: number, de: THREE.Vector3, ate: THREE.Vector3, pista: [number, number], semente: number, altoDaCalcada = 0) {
    this.tipo = tipo;
    this.de = de.clone();
    this.pista = pista;
    this.comprimento = de.distanceTo(ate);
    this.rumo = ate.clone().sub(de).normalize();
    this.lado = new V(-this.rumo.z, 0, this.rumo.x);
    this.group.userData.peca = 'travessia-de-bichos';
    const olhando = Math.atan2(this.rumo.x, this.rumo.z);
    this.olhando = olhando;
    this.altoDaCalcada = altoDaCalcada;
    if (tipo === 'patos') {
      // a mãe e os patinhos, em fila
      const longe = { minX: -1e6, maxX: 1e6, minZ: -1e6, maxZ: 1e6 };
      for (let i = 0; i < quantos; i++) {
        const mae = i === 0;
        const pato = new PatoDoLago(longe, { ...(mae ? (semente % 2 ? PATO_BRANCO : PATO_CREME) : PATINHO), semente: semente * 7 + i });
        pato.entrarEmServico();
        pato.aoSoar = null;
        const escala = mae ? ESCALA.pato : ESCALA.patinho;
        pato.group.scale.setScalar(escala);
        // o pato do lago nasce com a barriga debaixo d'água: em terra ele sobe até ela sair do chão
        const caixa = new THREE.Box3().setFromObject(pato.group);
        const perna = (mae ? 0.07 : 0.045) * escala;
        const alto = -caixa.min.y + perna;
        const pes = this.pesDePato(pato.group, alto / escala, mae ? 1 : 0.62);
        this.group.add(pato.group);
        this.andantes.push({
          grupo: pato.group, pato, pes, alto, u: 0, fase: i * 1.7,
          atras: mae ? 0 : 0.75 + (i - 1) * 0.62,
          desvio: mae ? 0 : ((i % 2 ? 1 : -1) * 0.14),
        });
        pato.group.rotation.y = olhando;
      }
    } else {
      for (let i = 0; i < quantos; i++) {
        const tigre = new TigreDagua({ x: 0, y: 0, z: 0, olhando }, { x: 0, z: 0 }, semente * 5 + i * 3);
        tigre.group.scale.setScalar(ESCALA.tigre * (i === 0 ? 1 : 0.82));
        this.group.add(tigre.group);
        this.andantes.push({ grupo: tigre.group, tigre, alto: 0, u: 0, fase: i * 2.3, atras: i * 1.15, desvio: (i % 2 ? 1 : -1) * 0.1 });
      }
    }
    for (const a of this.andantes) this.colocar(a);
  }

  /** as duas patinhas laranja, debaixo do corpo: a perna curta e o pé de nadadeira */
  private pesDePato(pato: THREE.Object3D, alto: number, k: number): THREE.Object3D[] {
    const pes: THREE.Object3D[] = [];
    const laranja = toon(P.patoPe);
    for (const lado of [-1, 1]) {
      const pivo = new THREE.Group();
      pivo.name = lado < 0 ? 'pe-esquerdo' : 'pe-direito';
      // (o pivô fica na linha d'água, dentro do corpo; a perna desce dali até o chão)
      pivo.position.set(lado * 0.075 * k, 0, -0.02 * k);
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.014 * k, 0.014 * k, alto, 6), laranja);
      perna.position.y = -alto / 2;
      pivo.add(perna);
      const pe = new THREE.Mesh(new THREE.SphereGeometry(0.05 * k, 8, 5), laranja);
      pe.scale.set(0.9, 0.22, 1.35);
      pe.position.set(0, -alto + 0.008, 0.03 * k);
      pivo.add(pe);
      pivo.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
      pato.add(pivo);
      pes.push(pivo);
    }
    return pes;
  }

  /** põe um andante no ponto dele do caminho */
  private colocar(a: Andante): void {
    const u = a.u - a.atras;
    const p = this.de.clone().addScaledVector(this.rumo, u).addScaledVector(this.lado, a.desvio);
    a.grupo.position.x = p.x;
    a.grupo.position.z = p.z;
    // (na calçada ele está um degrau acima do asfalto: desce e sobe a guia num passo)
    const fora = Math.max(this.pista[0] - u, u - this.pista[1]);
    const degrau = this.altoDaCalcada * Math.min(1, Math.max(0, fora / 0.3 + 0.5));
    a.grupo.position.y = a.alto + degrau + (this.susto > 0 ? Math.sin((1 - this.susto) * Math.PI) * 0.28 : 0);
    a.grupo.rotation.y = this.olhando;
  }

  /** começa a atravessar (a cena chama quando o carro vem chegando) */
  comecar(): void {
    if (this.estado !== 'esperando') return;
    this.estado = 'atravessando';
    this.aoSoar?.(this.tipo === 'patos' ? 'pato' : 'piado');
  }

  /** a buzina: a pata apressa, o tigre-d'água se esconde. Devolve o que aconteceu, para a fala */
  buzinar(): 'apressou' | 'escondeu' | 'nada' {
    if (this.estado !== 'atravessando') return 'nada';
    if (this.tipo === 'patos') {
      this.pressa = 2.6;
      this.aoSoar?.('pato');
      return 'apressou';
    }
    this.escondido = 1.5;
    return 'escondeu';
  }

  /** o carro freou em cima: um pulinho de susto (ninguém se machuca) */
  assustar(): void {
    this.susto = 1;
    this.aoSoar?.('pato');
  }

  /** tem bicho no asfalto agora? (é o que fecha a pista para o carro) */
  get naPista(): boolean {
    if (this.estado !== 'atravessando') return false;
    return this.andantes.some((a) => {
      const u = a.u - a.atras;
      return u > this.pista[0] - 0.5 && u < this.pista[1] + 0.5;
    });
  }

  /** onde está o primeiro da fila, no mundo (a câmera e o teste olham) */
  get frente(): THREE.Vector3 {
    return this.andantes[0].grupo.position;
  }

  update(dt: number): void {
    this.relogio += dt;
    this.pressa = Math.max(0, this.pressa - dt);
    this.escondido = Math.max(0, this.escondido - dt);
    this.susto = Math.max(0, this.susto - dt * 2.4);
    const parado = this.estado !== 'atravessando' || this.escondido > 0;
    const velocidade = parado ? 0 : this.tipo === 'patos' ? (this.pressa > 0 ? 2.5 : 1.3) : 1.05;
    let todosFora = true;
    for (const a of this.andantes) {
      if (this.estado === 'atravessando') a.u = Math.min(this.comprimento + a.atras, a.u + velocidade * dt);
      if (a.u - a.atras < this.pista[1] + 0.6) todosFora = false;
      this.colocar(a);
      const andando = velocidade > 0 && a.u < this.comprimento + a.atras;
      if (a.pato) {
        // a cabeça e o corpo vivem pelo cérebro dele; o gingado e as patinhas são daqui
        a.pato.update(dt);
        const passo = this.relogio * (this.pressa > 0 ? 17 : 10.5) + a.fase;
        a.grupo.rotation.z = andando ? Math.sin(passo) * 0.13 : a.grupo.rotation.z * 0.8;
        a.pes?.forEach((pe, i) => {
          pe.rotation.x = andando ? Math.sin(passo + i * Math.PI) * 0.75 : pe.rotation.x * 0.8;
        });
      }
      if (a.tigre) {
        a.tigre.update(dt);
        const passo = this.relogio * 6.5 + a.fase;
        a.grupo.rotation.z = andando ? Math.sin(passo) * 0.07 : 0;
        // escondido no casco: ele abaixa e encolhe para dentro (o casco fica, o resto some por baixo)
        const dentro = Math.min(1, this.escondido * 3);
        a.grupo.position.y -= dentro * 0.05 * ESCALA.tigre;
        a.grupo.rotation.x = andando ? Math.sin(passo * 0.5) * 0.03 : 0;
      }
    }
    if (this.estado === 'atravessando') {
      this.proximoSom -= dt;
      if (this.proximoSom <= 0) {
        this.proximoSom = this.tipo === 'patos' ? 1.5 + (this.relogio % 1) : 6;
        if (this.tipo === 'patos') this.aoSoar?.(this.relogio % 2 < 1 ? 'piado' : 'pato');
      }
      if (todosFora) this.estado = 'feito';
    }
  }
}
