import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * O Pelusa, o gato do Ari.
 *
 * Peca ANIMADA com classe propria, no molde da `FerrisWheel`: a cena instancia,
 * poe `pelusa.group` no mundo e chama `update(dt)` uma vez por quadro. O que
 * ele faz — andar, parar, sentar, miar — mora todo aqui; a cena so diz onde ele
 * pode pisar e o que acontece no carinho.
 *
 * Ele NAO usa o `CharacterRig`: aquele monta gente em pe (cabeca grande, dois
 * bracos, duas pernas em capsula) e nada ali serve para um bicho de quatro
 * patas. Um gato deste tamanho na tela cabe em oito capsulas.
 *
 * Da foto: branco creme no peito, nas patas e no focinho, com mascara, dorso e
 * cauda em cinza-taupe, e a cauda listrada.
 */

/** para onde ele esta indo, e o que esta fazendo enquanto isso */
type Humor = 'andando' | 'parado' | 'sentado';

/** passo dele, em unidades por segundo — gato passeando, nao correndo */
const VELOCIDADE = 0.62;

export interface AreaDoGato {
  /** retangulo onde ele pode pisar */
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** circulos onde ele NAO pode entrar (movel, planta, a dupla) */
  proibido?: Array<{ x: number; z: number; r: number }>;
}

export class Pelusa {
  readonly group = new THREE.Group();

  /** onde ele esta, em coordenada de mundo — a cena le isto para mover o prompt */
  get x(): number {
    return this.group.position.x;
  }
  get z(): number {
    return this.group.position.z;
  }

  /** chamado quando ele resolve miar sozinho; a cena liga no `g.som` */
  aoMiar: (() => void) | null = null;

  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly rabo = new THREE.Group();
  private readonly patas: THREE.Mesh[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly gomosDoRabo: THREE.Group[] = [];

  private humor: Humor = 'parado';
  /** quanto falta do estado atual, em segundos */
  private aguarda = 1.2;
  private alvo = new THREE.Vector3();
  private fase = 0;
  /** segundos ate o proximo miado espontaneo */
  private ateMiar = 6;
  /** 0 a 1: o quanto ele esta ronronando de carinho agora */
  private carinho = 0;
  private readonly area: AreaDoGato;
  /** sorteio proprio, com semente: dois builds seguidos andam igual */
  private semente: number;

  constructor(area: AreaDoGato, semente = 20260902) {
    this.area = area;
    this.semente = semente >>> 0 || 1;
    this.montar();
    this.group.position.set((area.minX + area.maxX) / 2, 0, (area.minZ + area.maxZ) / 2);
    this.alvo.copy(this.group.position);
  }

  // ----------------------------------------------------------------- corpo

  private montar(): void {
    const branco = toon(P.pelusaBranco);
    const cinza = toon(P.pelusaCinza);
    const escuro = toon(P.pelusaCinzaEscuro);

    // O tronco e um ELIPSOIDE, e nao uma capsula girada.
    //
    // A primeira versao usava capsula com `rotation.z = PI/2`, o que poe o
    // comprimento no eixo X — mas a cabeca e o rabo moram no eixo Z, entao o
    // corpo saia atravessado em relacao a propria cabeca, e de perto o gato
    // parecia amassado de lado. Esfera com escala nao tem eixo escondido: o
    // numero que estica o comprimento e o Z, que e para onde ele olha.
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), branco);
    tronco.scale.set(0.105, 0.098, 0.165);
    tronco.position.y = 0.175;
    this.corpo.add(tronco);

    // A sela cinza do lombo: baixa e estreita, so a FAIXA das costas. Um
    // segundo corpo inteiro por cima lia como cobertor mal posto.
    const sela = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), cinza);
    sela.scale.set(0.098, 0.072, 0.142);
    sela.position.set(0, 0.203, -0.012);
    this.corpo.add(sela);

    // ------------------------------------------------------------- cabeca
    // Cabeca grande de proposito: e a mesma regra chibi do resto do jogo, e a
    // esta escala na tela e ela que faz o bicho ser lido como gato.
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 10), branco);
    cranio.scale.set(1, 0.94, 0.9);
    this.cabeca.add(cranio);

    // a mascara: uma calota cinza no alto, aberta para baixo, como na foto
    const mascara = new THREE.Mesh(
      new THREE.SphereGeometry(0.107, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.54),
      cinza,
    );
    mascara.scale.set(1, 0.94, 0.9);
    mascara.position.y = 0.004;
    this.cabeca.add(mascara);

    const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 8), branco);
    focinho.scale.set(1.05, 0.78, 0.85);
    focinho.position.set(0, -0.032, 0.072);
    this.cabeca.add(focinho);

    const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), toon(P.pelusaFocinho));
    nariz.scale.set(1.2, 0.85, 0.8);
    nariz.position.set(0, -0.024, 0.122);
    this.cabeca.add(nariz);

    for (const lado of [-1, 1]) {
      // orelha: cone com um cone rosa menor por dentro
      const orelha = new THREE.Group();
      const fora = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.085, 6), cinza);
      orelha.add(fora);
      const dentro = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.058, 6), toon(P.pelusaOrelha));
      dentro.position.z = 0.016;
      orelha.add(dentro);
      orelha.position.set(lado * 0.062, 0.092, -0.006);
      // as duas tombam para FORA. Mesma pegadinha de sinal do resto do projeto:
      // a da esquerda nasce em -X, entao `rotation.z` NEGATIVO nela e que abre.
      orelha.rotation.z = lado * 0.17;
      this.orelhas.push(orelha);
      this.cabeca.add(orelha);

      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), toon(0x2b2721));
      olho.position.set(lado * 0.044, 0.01, 0.09);
      this.olhos.push(olho);
      this.cabeca.add(olho);
    }

    this.cabeca.position.set(0, 0.288, 0.152);
    this.corpo.add(this.cabeca);

    // -------------------------------------------------------------- patas
    // a capsula tem altura total `comprimento + 2 × raio` (0,141): com o centro
    // em 0,072 a pata encosta no chao em vez de flutuar
    for (const [lado, frente] of [[-1, 1], [1, 1], [-1, -1], [1, -1]] as const) {
      const pata = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.085, 3, 6), branco);
      pata.position.set(lado * 0.062, 0.072, frente * 0.092);
      this.patas.push(pata);
      this.corpo.add(pata);
    }

    // --------------------------------------------------------------- rabo
    // Um rabo de tres gomos, cada um filho do anterior: girando so o primeiro,
    // a curva inteira acompanha. Rabo de peca unica nao chicoteia — e o
    // chicotear e metade do que faz ele parecer vivo.
    let pai: THREE.Object3D = this.rabo;
    for (let i = 0; i < 3; i++) {
      const gomo = new THREE.Group();
      const malha = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.022 - i * 0.004, 0.075, 3, 6),
        i % 2 === 0 ? cinza : escuro,
      );
      malha.position.y = 0.048;
      gomo.add(malha);
      gomo.position.y = i === 0 ? 0 : 0.094;
      // curva em S: o primeiro gomo tomba para trás e os de cima voltam para
      // a frente. Todos no mesmo ângulo dariam uma antena reta.
      gomo.rotation.x = i === 0 ? -0.75 : 0.34;
      pai.add(gomo);
      pai = gomo;
      this.gomosDoRabo.push(gomo);
    }
    this.rabo.position.set(0, 0.19, -0.168);
    this.corpo.add(this.rabo);

    this.group.add(this.corpo);
    // etiqueta para o teste achar o gato na cena e medir o passeio dele
    this.group.userData.peca = 'pelusa';
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
  }

  // -------------------------------------------------------------- cerebro

  /** Sorteio repetivel: mesma semente, mesmo passeio. */
  private sorte(): number {
    let s = this.semente;
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    this.semente = s >>> 0;
    return (this.semente % 100000) / 100000;
  }

  private cabe(x: number, z: number): boolean {
    const a = this.area;
    if (x < a.minX || x > a.maxX || z < a.minZ || z > a.maxZ) return false;
    for (const p of a.proibido ?? []) {
      if (Math.hypot(x - p.x, z - p.z) < p.r) return false;
    }
    return true;
  }

  /** Escolhe o proximo destino, ou desiste e fica parado mais um pouco. */
  private novoDestino(): void {
    for (let tentativa = 0; tentativa < 12; tentativa++) {
      const x = this.area.minX + this.sorte() * (this.area.maxX - this.area.minX);
      const z = this.area.minZ + this.sorte() * (this.area.maxZ - this.area.minZ);
      // um destino colado onde ele já está não vira caminhada nenhuma
      const dist = Math.hypot(x - this.x, z - this.z);
      if (this.cabe(x, z) && dist > 0.7) {
        this.alvo.set(x, 0, z);
        this.humor = 'andando';
        // O RELÓGIO PRECISA SER RENOVADO AQUI. Sem isto `aguarda` continua
        // negativo, o quadro seguinte cai de novo no mesmo `if`, vê que ele
        // está "andando" e o declara cansado na hora: o gato dava um passo de
        // um frame e passava o resto da vida parado.
        //
        // É teto, não duração: quem encerra a caminhada de verdade é chegar.
        this.aguarda = dist / VELOCIDADE + 2;
        return;
      }
    }
    this.humor = 'parado';
    this.aguarda = 1.5;
  }

  /**
   * O carinho: ele para onde está, senta e ronrona.
   *
   * Chamado pela cena no `onInteract`. O ronronar decai sozinho, então a cena
   * não precisa desligar nada.
   */
  receberCarinho(): void {
    this.humor = 'sentado';
    this.aguarda = 3.4;
    this.carinho = 1;
    this.ateMiar = 2.2;
  }

  update(dt: number): void {
    this.fase += dt;
    this.aguarda -= dt;
    this.ateMiar -= dt;
    if (this.carinho > 0) this.carinho = Math.max(0, this.carinho - dt * 0.42);

    // ------------------------------------------------------------ o miado
    // Espontâneo e espaçado: um gato que mia a cada dois segundos vira alarme.
    if (this.ateMiar <= 0) {
      this.ateMiar = 9 + this.sorte() * 11;
      this.aoMiar?.();
      // e ele para para miar, como gato de verdade
      if (this.humor === 'andando') {
        this.humor = 'parado';
        this.aguarda = 0.9;
      }
    }

    // --------------------------------------------------------- o que fazer
    if (this.aguarda <= 0) {
      if (this.humor === 'andando') {
        this.humor = this.sorte() < 0.35 ? 'sentado' : 'parado';
        this.aguarda = 1.4 + this.sorte() * 3;
      } else {
        this.novoDestino();
      }
    }

    let andando = false;
    if (this.humor === 'andando') {
      const dx = this.alvo.x - this.x;
      const dz = this.alvo.z - this.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.08) {
        this.humor = 'parado';
        this.aguarda = 1.2 + this.sorte() * 2.5;
      } else {
        const passo = Math.min(dist, VELOCIDADE * dt);
        this.group.position.x += (dx / dist) * passo;
        this.group.position.z += (dz / dist) * passo;
        // vira para onde anda, sem estalo
        const alvoAng = Math.atan2(dx, dz);
        let d = alvoAng - this.group.rotation.y;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        this.group.rotation.y += d * Math.min(1, dt * 7);
        andando = true;
      }
    }

    this.animar(dt, andando);
  }

  /**
   * A pose. Tudo por seno, como o resto do jogo.
   *
   * O rabo tem TRÊS velocidades diferentes por gomo (`fase * k` com `k`
   * crescendo): é a defasagem que faz a ponta chegar depois da base e a curva
   * parecer um chicote, em vez de uma barra rígida balançando.
   */
  private animar(dt: number, andando: boolean): void {
    const sentado = this.humor === 'sentado';

    if (andando) {
      const t = this.fase * 9;
      // patas em diagonal, como bicho de quatro patas anda de verdade
      this.patas[0].position.z = 0.092 + Math.sin(t) * 0.032;
      this.patas[3].position.z = -0.092 + Math.sin(t) * 0.032;
      this.patas[1].position.z = 0.092 - Math.sin(t) * 0.032;
      this.patas[2].position.z = -0.092 - Math.sin(t) * 0.032;
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.012;
      this.corpo.rotation.x = 0;
      this.corpo.rotation.z = Math.sin(t) * 0.03;
    } else {
      // volta as patas para o lugar sem estalo
      for (let i = 0; i < 4; i++) {
        const base = i < 2 ? 0.092 : -0.092;
        this.patas[i].position.z += (base - this.patas[i].position.z) * Math.min(1, dt * 8);
      }
      this.corpo.rotation.z *= 1 - Math.min(1, dt * 8);
      // sentado o traseiro desce e o peito sobe; parado, só a respiração
      const alvoX = sentado ? 0.34 : 0;
      this.corpo.rotation.x += (alvoX - this.corpo.rotation.x) * Math.min(1, dt * 5);
      const respira = Math.sin(this.fase * 1.7) * 0.006;
      const alvoY = (sentado ? 0.028 : 0) + respira;
      this.corpo.position.y += (alvoY - this.corpo.position.y) * Math.min(1, dt * 5);
    }

    // rabo: cada gomo mais rápido e mais amplo que o anterior
    const forte = andando ? 1 : 0.55;
    for (let i = 0; i < this.gomosDoRabo.length; i++) {
      const g = this.gomosDoRabo[i];
      const amp = (0.1 + i * 0.075) * forte + this.carinho * 0.1;
      g.rotation.z = Math.sin(this.fase * (2.1 + i * 0.9)) * amp;
      if (i === 0) g.rotation.x = -0.5 + Math.sin(this.fase * 1.3) * 0.12 * forte;
    }

    // cabeça: olha em volta parado, e sobe encostando na mão no carinho
    this.cabeca.rotation.y = andando ? 0 : Math.sin(this.fase * 0.6) * 0.34;
    this.cabeca.rotation.x = -this.carinho * 0.22 + Math.sin(this.fase * 1.9) * 0.02;

    // orelhas mexendo, e no carinho elas abrem mais
    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const tique = Math.sin(this.fase * 2.3 + i * 1.7);
      this.orelhas[i].rotation.z = lado * (0.22 + this.carinho * 0.12) + tique * 0.05 * lado;
    }

    // no carinho ele fecha os olhos de contente
    const abertura = 1 - this.carinho * 0.85;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.12, abertura);
  }
}
