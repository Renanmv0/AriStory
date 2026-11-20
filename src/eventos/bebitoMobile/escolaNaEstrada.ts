import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { flat, toon } from '../../core/materials';
import { Estrella, Luna, Sol, type CoelhaDaTorcida } from '../../entities/bichos/CoelhaDaTorcida';
import { Gatito } from '../../entities/bichos/Gatito';
import { Flynn } from '../../entities/bichos/Flynn';
import { Valentina } from '../../entities/bichos/Valentina';
import { bolaDeBasquete } from '../../world/furniture';
import { quina } from '../../world/lojaDeRoupas';
import { fundir } from '../../world/fundir';
import { type NaPista } from '../../world/estrada';
import { PISTA } from './rota';

/**
 * ======================================== A TURMA DA ESCOLA NA PISTA (a zona escolar)
 *
 * Os eventos da rota da Escola do Gatito (`docs/VIAGEM-ESCOLA.md`), pedidos
 * pelo Renan ("crie novas interações no meio do caminho com os personagens
 * da escola"). Dois são de PARAR — a cena trata como a travessia dos bichos
 * (`travessia.ts`: o mesmo `estado`, o `naPista` que fecha a pista, a buzina
 * e o susto), e os dois pilotos já sabem frear para eles:
 *
 *  - `TravessiaDaTorcida`: a Luna, a Sol e a Estrella atravessando na faixa,
 *    com o GATITO de guarda de trânsito no meio da pista, de placa de PARE
 *    levantada (ele só aparece depois de conhecido na escola);
 *  - `BolaDoFlynn`: o Flynn quicando a bola na calçada; quando o carro chega,
 *    ela escapa e atravessa a pista quicando, e ele agradece com o apito.
 *
 * E dois de PASSAR DEVAGAR (como a rega da Josefina):
 *
 *  - `EnsaioDaValentina`: a sessão de fotos dela na calçada — o tripé, o aro
 *    de luz e o rebatedor; passando devagar, ela posa e o flash dispara;
 *  - `RadarEscolar`: a placa que mostra a velocidade do carro em números de
 *    LED, e sorri para quem passa devagar.
 *
 * QUEM ANDA NA PISTA MORA NUM QUADRO: um grupo posto na calçada de onde a
 * travessia sai, com o `+Z` apontando para a outra calçada e a escala da
 * estrada (de dentro do carro, a turma no tamanho da escola some). Os bichos
 * andam lá dentro pelo `irPara` de sempre, em metros do quadro.
 */

const V = THREE.Vector3;
const suave = (t: number): number => t * t * (3 - 2 * t);

/** o que a cena pede de quem atravessa (a mesma conversa da travessia dos bichos) */
export interface Atravessando {
  readonly group: THREE.Group;
  estado: 'esperando' | 'atravessando' | 'feito';
  readonly naPista: boolean;
  comecar(): void;
  update(dt: number): void;
  buzinar(): 'apressou' | 'escondeu' | 'nada';
  assustar(): void;
}

/** a placa de PARE de guarda de trânsito: o octógono vermelho com a borda branca, num cabo amarelo */
function placaDePare(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-de-pare';
  const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.2, 8), toon(P.escolaArmarioAmarelo));
  cabo.position.y = 0.6;
  g.add(cabo);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const oito = (r: number): void => {
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const a = Math.PI / 8 + (k * Math.PI) / 4;
        ctx.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = '#ffffff';
    oito(126);
    ctx.fillStyle = `#${P.escolaFaixa.toString(16).padStart(6, '0')}`;
    oito(112);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 70px ui-rounded, "Nunito", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PARE', 128, 132);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  // (as duas faces: quem vem de um lado e do outro lê o PARE)
  for (const lado of [1, -1]) {
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.34, 8, Math.PI / 8), toon(P.placaPintada, { mapa: tex }));
    face.position.set(0, 1.36, lado * 0.019);
    if (lado < 0) face.rotation.y = Math.PI;
    g.add(face);
  }
  const borda = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.028, 8).rotateX(Math.PI / 2).rotateZ(Math.PI / 8), toon(P.escolaFaixa));
  borda.position.y = 1.36;
  g.add(borda);
  return g;
}

/** o colete de guarda: a faixa laranja com o refletivo, num anel em volta do corpo da pelúcia */
function coleteDeGuarda(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.16, 16, 1, true), toon(P.cancelaAmarela, { doubleSide: true }));
  g.add(corpo);
  const refletivo = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.215, 0.035, 16, 1, true), toon(P.metalWhite, { glow: 0.3, doubleSide: true }));
  g.add(refletivo);
  return g;
}

/** o caminho de uma travessia, de calçada a calçada, e o quadro dela */
class Caminho {
  readonly quadro = new THREE.Group();
  readonly comprimento: number;
  /** em que metros do caminho fica o asfalto */
  readonly pista: [number, number];
  constructor(naPista: NaPista, s: number, lado: number, readonly escala: number, readonly altoDaCalcada: number) {
    const fora = PISTA.meia + 1.5;
    const de = naPista(s, lado * fora);
    const ate = naPista(s, -lado * (fora + 0.6));
    this.comprimento = de.distanceTo(ate);
    this.pista = [fora - PISTA.meia, fora + PISTA.meia];
    this.quadro.position.copy(de);
    this.quadro.rotation.y = Math.atan2(ate.x - de.x, ate.z - de.z);
    this.quadro.scale.setScalar(escala);
  }
  /** a altura do chão (no quadro) a `u` metros do começo: a calçada é um degrau */
  chao(u: number): number {
    const meio = THREE.MathUtils.clamp((u - this.pista[0]) / 0.4, 0, 1) * THREE.MathUtils.clamp((this.pista[1] - u) / 0.4 + 1, 0, 1);
    return ((1 - Math.min(1, meio)) * this.altoDaCalcada) / this.escala;
  }
  /** `u` (metros de verdade) do `z` do quadro */
  u(z: number): number {
    return z * this.escala;
  }
  noAsfalto(z: number, folga = 0.5): boolean {
    const u = this.u(z);
    return u > this.pista[0] - folga && u < this.pista[1] + folga;
  }
}

// ================================================================= a torcida

/**
 * AS COELHINHAS ATRAVESSANDO, com o Gatito de guarda. O Gatito pula até o
 * meio da faixa (de colete e com a placa de PARE no ombro), vira para o
 * carro e LEVANTA a placa; as três atravessam em fila (a Estrella, a que
 * cuida, por último, olhando as duas); na outra calçada a Luna torce, a Sol
 * salta e a Estrella acena; o Gatito abaixa a placa e pula de volta.
 */
export class TravessiaDaTorcida implements Atravessando {
  readonly group = new THREE.Group();
  estado: 'esperando' | 'atravessando' | 'feito' = 'esperando';
  aoSoar: ((som: 'sacudida' | 'miado' | 'apito') => void) | null = null;
  readonly coelhas: CoelhaDaTorcida[];
  readonly gatito: Gatito | null;
  private readonly caminho: Caminho;
  private readonly placa: THREE.Group | null = null;
  private relogio = 0;
  private placaAlta = 0;
  private fase: 'guarda-indo' | 'atravessando' | 'na-outra' | 'guarda-voltando' | 'pronto' = 'guarda-indo';
  private chegaram = 0;
  private festejou = false;
  /** de que lado do quadro vem o carro: no quadro, o `+X` é a pista para trás quando a travessia sai da direita */
  /** o Gatito chegou ao posto, no meio da faixa da direita */
  private noPosto = false;
  private readonly ladoDoCarro: number;

  constructor(naPista: NaPista, s: number, lado: number, altoDaCalcada: number, comGatito: boolean) {
    this.ladoDoCarro = lado;
    this.group.userData.peca = 'travessia-da-torcida';
    this.caminho = new Caminho(naPista, s, lado, 1.15, altoDaCalcada);
    this.group.add(this.caminho.quadro);
    const area = { minX: -0.2, maxX: 0.2, minZ: -0.2, maxZ: 0.2 };
    // a fila: a Luna na frente, a Sol, e a Estrella por último (é a que cuida das duas)
    this.coelhas = [new Luna(area), new Sol(area), new Estrella(area)];
    this.coelhas.forEach((c, i) => {
      c.entrarEmServico();
      // (no quadro, o `+X × lado` é o lado de onde o carro vem: a fila passa ATRÁS do Gatito)
      c.group.position.set(-lado * (0.3 + i * 0.14), this.caminho.chao(0), -0.2 - i * 0.45);
      c.group.rotation.y = 0;
      this.caminho.quadro.add(c.group);
    });
    this.gatito = comGatito ? new Gatito(area) : null;
    if (this.gatito) {
      const gt = this.gatito;
      gt.entrarEmServico();
      // a pelúcia na estrada: 1,6× a da escola (de dentro do carro, no tamanho de pelúcia ela some)
      gt.group.scale.setScalar(1.6);
      gt.group.position.set(0.9 * lado, this.caminho.chao(0), 0.4);
      this.caminho.quadro.add(gt.group);
      const placa = placaDePare();
      placa.position.set(0.32, 0, 0.05);
      placa.rotation.z = -0.85;
      gt.group.add(placa);
      this.placa = placa;
      const colete = coleteDeGuarda();
      colete.position.y = 0.2;
      gt.group.add(colete);
    } else {
      this.fase = 'atravessando';
    }
  }

  comecar(): void {
    if (this.estado !== 'esperando') return;
    this.estado = 'atravessando';
    this.relogio = 0;
    if (this.gatito) {
      // ele pula até a faixa da DIREITA (a de quem dirige), na frente da fila, do lado de onde o carro vem
      const u = PISTA.meia + 1.5 - this.ladoDoCarro * 1.4;
      void this.gatito.irPara(0.55 * this.ladoDoCarro, u / this.caminho.escala, 1.4).then(() => { this.noPosto = true; });
      this.aoSoar?.('miado');
    } else {
      this.soltarAFila();
    }
  }

  private soltarAFila(): void {
    this.fase = 'atravessando';
    const fim = this.caminho.comprimento / this.caminho.escala + 0.4;
    this.coelhas.forEach((c, i) => {
      // cada uma sai um tico depois da outra (o atraso é a distância na fila)
      void c.irPara(-this.ladoDoCarro * (0.3 + i * 0.14), fim - i * 0.75, 1.55).then(() => { this.chegaram++; });
    });
    this.aoSoar?.('sacudida');
  }

  buzinar(): 'apressou' | 'escondeu' | 'nada' {
    if (this.estado !== 'atravessando') return 'nada';
    // buzina para a torcida é aplauso: a Luna torce
    this.coelhas[0].torcer(1.6);
    this.aoSoar?.('sacudida');
    return 'nada';
  }

  assustar(): void {
    this.coelhas[1].saltar();
    this.coelhas[2].ficarTimida(1.4);
  }

  get naPista(): boolean {
    if (this.estado !== 'atravessando') return false;
    if (this.gatito && this.caminho.noAsfalto(this.gatito.group.position.z, 0.3)) return true;
    return this.coelhas.some((c) => this.caminho.noAsfalto(c.group.position.z));
  }

  /** onde o Gatito está (o teste e a câmera olham) */
  get guarda(): THREE.Object3D | null {
    return this.gatito?.group ?? null;
  }

  get alturaDaPlaca(): number {
    return this.placaAlta;
  }

  update(dt: number): void {
    this.relogio += dt;
    // (o teste lê a fase — com a fila andando, o Gatito já está no posto — e se tem alguém na pista)
    this.group.userData.fase = this.fase;
    this.group.userData.naPista = this.naPista;
    for (const c of this.coelhas) {
      c.update(dt);
      c.group.position.y = this.caminho.chao(this.caminho.u(c.group.position.z));
    }
    if (this.gatito) {
      this.gatito.update(dt);
      this.gatito.group.position.y = this.caminho.chao(this.caminho.u(this.gatito.group.position.z));
      // (só quando ele CHEGA: entre um pulo e outro ele também fica parado, e a fila saía com ele no caminho)
      if (this.fase === 'guarda-indo' && this.estado === 'atravessando' && this.noPosto) {
        // chegou ao meio: vira para quem vem e levanta a placa; aí a fila sai
        this.gatito.encarar(this.gatito.group.position.x + 3 * this.ladoDoCarro, this.gatito.group.position.z);
        this.soltarAFila();
      }
      const alvo = this.fase === 'atravessando' || this.fase === 'na-outra' ? 1 : 0;
      this.placaAlta += (alvo - this.placaAlta) * Math.min(1, dt * 5);
      if (this.placa) this.placa.rotation.z = THREE.MathUtils.lerp(-0.85, 0.05, suave(this.placaAlta));
    }
    if (this.fase === 'atravessando' && this.chegaram >= this.coelhas.length) {
      this.fase = 'na-outra';
      this.relogio = 0;
    }
    if (this.fase === 'na-outra') {
      if (!this.festejou) {
        this.festejou = true;
        // na outra calçada: a Luna torce, a Sol salta e a Estrella acena com o pompom
        this.coelhas[0].torcer(2.2);
        this.coelhas[1].saltar();
        this.coelhas[2].torcer(1.4);
        this.aoSoar?.('sacudida');
      }
      if (this.relogio > 1.2) {
        this.fase = this.gatito ? 'guarda-voltando' : 'pronto';
        if (this.gatito) void this.gatito.irPara(0.9 * this.ladoDoCarro, 0.4, 1.4);
      }
    }
    if (this.fase === 'guarda-voltando' && this.gatito && !this.caminho.noAsfalto(this.gatito.group.position.z, 0.3)) this.fase = 'pronto';
    if (this.fase === 'pronto' && this.estado === 'atravessando') this.estado = 'feito';
  }
}

// ================================================================= a bola do Flynn

/**
 * A BOLA DO FLYNN: ele quica a bola na calçada (a bola sobe e desce da mão
 * dele, no ritmo); quando o carro chega, ela escapa e atravessa a pista
 * quicando, cada quique mais baixo, até a outra calçada. Ele corre até a
 * guia e PARA; olha para um lado e para o outro (o carro esperando), atravessa
 * correndo, pega a bola e agradece com o apito e o aceno — e fica quicando
 * a bola do outro lado.
 */
export class BolaDoFlynn implements Atravessando {
  readonly group = new THREE.Group();
  estado: 'esperando' | 'atravessando' | 'feito' = 'esperando';
  aoSoar: ((som: 'quicar' | 'apito') => void) | null = null;
  readonly flynn: Flynn;
  readonly bola: THREE.Group;
  private readonly caminho: Caminho;
  private readonly ladoDoCarro: number;
  private relogio = 0;
  private z = 0;
  private altoDoQuique = 1;
  private fasePulo = 0;
  /** a bola atravessando → ele olhando os dois lados na guia → atravessando → com a bola na mão */
  private fase: 'bola' | 'olhando' | 'buscando' | 'pegou' = 'bola';
  private naGuia = false;
  private relogioDaFase = 0;

  constructor(naPista: NaPista, s: number, lado: number, altoDaCalcada: number) {
    this.ladoDoCarro = lado;
    this.group.userData.peca = 'bola-do-flynn';
    this.caminho = new Caminho(naPista, s, lado, 1.05, altoDaCalcada);
    this.group.add(this.caminho.quadro);
    this.flynn = new Flynn({ minX: -0.2, maxX: 0.2, minZ: -0.2, maxZ: 0.2 });
    this.flynn.entrarEmServico();
    this.flynn.group.position.set(-0.6 * lado, this.caminho.chao(0), -0.6);
    this.caminho.quadro.add(this.flynn.group);
    // a bola de basquete do ginásio, maior (na estrada, a do tamanho da escola é um pontinho)
    this.bola = bolaDeBasquete(0.12);
    this.bola.scale.setScalar(1.7);
    this.bola.userData.peca = 'bola-da-estrada';
    this.caminho.quadro.add(fundir(this.bola));
    this.z = -0.6;
  }

  comecar(): void {
    if (this.estado !== 'esperando') return;
    this.estado = 'atravessando';
    this.relogio = 0;
    this.altoDoQuique = 1;
    this.flynn.correr(true);
    // corre atrás dela até a guia, e para ali (não entra na pista com o carro vindo)
    void this.flynn.irPara(-0.4 * this.ladoDoCarro, this.caminho.pista[0] / this.caminho.escala - 0.35, 2.6).then(() => {
      this.flynn.correr(false);
      this.naGuia = true;
    });
  }

  buzinar(): 'apressou' | 'escondeu' | 'nada' {
    if (this.estado === 'esperando') return 'nada';
    this.flynn.acenar(1.2);
    return 'nada';
  }

  assustar(): void {
    this.flynn.acenar(1.6);
  }

  get naPista(): boolean {
    // (do escape da bola até ele voltar com ela na mão: na guia, olhando, ele também está para atravessar)
    return this.estado === 'atravessando';
  }

  /** quicando a bola ao lado dele (antes, e do outro lado no fim) */
  private quicar(): void {
    const t = (this.relogio * 1.6) % 1;
    const y = 0.95 * (1 - Math.abs(Math.sin(t * Math.PI))) + 0.12;
    const f = this.flynn.group.position;
    this.bola.position.set(f.x + 0.32, this.caminho.chao(this.caminho.u(f.z)) + y, f.z + 0.15);
    if (t < this.fasePulo) this.aoSoar?.('quicar');
    this.fasePulo = t;
  }

  update(dt: number): void {
    this.relogio += dt;
    this.relogioDaFase += dt;
    this.group.userData.naPista = this.naPista;
    this.flynn.update(dt);
    const f = this.flynn.group.position;
    f.y = this.caminho.chao(this.caminho.u(f.z));
    const fim = this.caminho.comprimento / this.caminho.escala + 0.3;
    if (this.estado === 'esperando' || this.fase === 'pegou') {
      this.quicar();
      return;
    }
    if (this.fase === 'bola') {
      // atravessando: anda reto, quicando cada vez mais baixo
      this.z = Math.min(fim, this.z + dt * 2.6);
      const t = (this.relogio * 1.9) % 1;
      if (t < this.fasePulo) { this.altoDoQuique *= 0.72; this.aoSoar?.('quicar'); }
      this.fasePulo = t;
      const y = this.altoDoQuique * 0.9 * Math.sin(t * Math.PI);
      this.bola.position.set(0.1, this.caminho.chao(this.caminho.u(this.z)) + 0.12 + y, this.z);
      this.bola.rotation.x += dt * 9;
      if (this.z >= fim && this.naGuia) { this.fase = 'olhando'; this.relogioDaFase = 0; }
      return;
    }
    this.bola.position.y = this.caminho.chao(this.caminho.u(this.z)) + 0.12;
    if (this.fase === 'olhando') {
      // na guia: olha para o lado do carro, para o outro, e atravessa
      const olho = this.relogioDaFase < 0.7 ? this.ladoDoCarro : -this.ladoDoCarro;
      this.flynn.encarar(f.x + 3 * olho, f.z + 0.6);
      if (this.relogioDaFase > 1.5) {
        this.fase = 'buscando';
        this.flynn.correr(true);
        void this.flynn.irPara(0.1 - 0.35 * this.ladoDoCarro, fim - 0.3, 2.4).then(() => {
          this.flynn.correr(false);
          this.fase = 'pegou';
          this.relogio = 0;
          this.flynn.encarar(f.x + 3 * this.ladoDoCarro, f.z - 1.2);
          this.flynn.acenar(2.4);
          this.aoSoar?.('apito');
          this.estado = 'feito';
        });
      }
    }
  }
}

// ================================================================= o ensaio da Valentina

/**
 * O ENSAIO DE FOTOS DA VALENTINA, na calçada da direita: o tripé com a
 * câmera virada para ela, o aro de luz aceso e o rebatedor dourado. Ela
 * posa de tempos em tempos; quando o carro passa devagar, ela vira para ele,
 * posa de encantada e o FLASH dispara.
 */
export class EnsaioDaValentina {
  readonly group = new THREE.Group();
  readonly valentina: Valentina;
  private readonly flash: THREE.Mesh;
  private relogio = 0;
  private brilho = 0;
  private proximaPose = 1.5;

  constructor(naPista: NaPista, s: number, rumo: number) {
    this.group.userData.peca = 'ensaio-da-valentina';
    // do lado ESQUERDO, o da praça: o direito é o da escola, e a grade tapava ela
    const lado = -1;
    // (`l` a partir do meio da pista; a calçada vai de 3,5 a 6,1, um degrau acima do gramado)
    const onde = (ds: number, l: number): THREE.Vector3 => naPista(s + ds, lado * l, l < PISTA.meia + PISTA.calcada ? 0.14 : 0);
    this.valentina = new Valentina({ minX: -0.2, maxX: 0.2, minZ: -0.2, maxZ: 0.2 });
    this.valentina.entrarEmServico();
    // na estrada, um tico maior que na escola (como o Gatito): de dentro do carro, no tamanho dela, ela sumia
    this.valentina.group.scale.setScalar(1.3);
    // no gramado logo depois da calçada, de frente para a pista: o tripé fica entre ela e a rua
    this.valentina.group.position.copy(onde(0, 7.4));
    this.valentina.group.position.y += 0.012; // (em cima do papel do fundo infinito)
    this.valentina.group.rotation.y = rumo - Math.PI / 2;
    this.group.add(this.valentina.group);
    // o FUNDO INFINITO atrás dela: dois pedestais, a travessa e o papel menta descendo e
    // virando chão por baixo dos pés dela (é ele que faz o gramado ler como estúdio)
    const fundo = new THREE.Group();
    fundo.userData.peca = 'fundo-infinito';
    const metalDoFundo = toon(P.escolaFerro);
    for (const x of [-1.32, 1.32]) {
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 2.5, 6), metalDoFundo);
      pedestal.position.set(x, 1.25, -0.06);
      fundo.add(pedestal);
      for (let k = 0; k < 3; k++) {
        const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 5), metalDoFundo);
        const a = (k / 3) * Math.PI * 2 + 0.5;
        pe.position.set(x + Math.cos(a) * 0.15, 0.12, -0.06 + Math.sin(a) * 0.15);
        pe.rotation.set(Math.sin(a) * 1.05, 0, -Math.cos(a) * 1.05);
        fundo.add(pe);
      }
    }
    const travessa = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.72, 10).rotateZ(Math.PI / 2), metalDoFundo);
    travessa.position.set(0, 2.42, -0.06);
    fundo.add(travessa);
    fundo.add(papelDoFundoInfinito(2.5, 2.3, 0.42, 1.5));
    fundo.position.copy(onde(0, 8.5));
    fundo.rotation.y = rumo - Math.PI / 2;
    this.group.add(fundir(fundo));
    // o tripé com a câmera, um pouco à frente na calçada, virado para ela
    const tripe = new THREE.Group();
    tripe.userData.peca = 'tripe-da-valentina';
    const metal = toon(P.escolaFerro);
    for (let k = 0; k < 3; k++) {
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 1.25, 6), metal);
      const a = (k / 3) * Math.PI * 2;
      perna.position.set(Math.cos(a) * 0.18, 0.6, Math.sin(a) * 0.18);
      perna.rotation.set(Math.sin(a) * 0.28, 0, -Math.cos(a) * 0.28);
      tripe.add(perna);
    }
    const corpo = new THREE.Mesh(quina(0.26, 0.18, 0.14, 0.03), metal);
    corpo.position.y = 1.32;
    tripe.add(corpo);
    const lente = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.14, 14).rotateX(Math.PI / 2), toon(P.escolaVidroFora));
    lente.position.set(0, 1.32, 0.13);
    tripe.add(lente);
    tripe.position.copy(onde(0.4, 4.9));
    tripe.lookAt(this.valentina.group.position.x, tripe.position.y, this.valentina.group.position.z);
    this.group.add(fundir(tripe));
    // o aro de luz, aceso, ao lado da câmera
    const aro = new THREE.Group();
    aro.userData.peca = 'aro-de-luz';
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 1.5, 6), metal);
    haste.position.y = 0.75;
    aro.add(haste);
    const anel = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 8, 28), toon(P.luzDoPoste, { glow: 0.9 }));
    anel.position.y = 1.6;
    aro.add(anel);
    aro.position.copy(onde(-1.6, 5.5));
    aro.lookAt(this.valentina.group.position.x, aro.position.y, this.valentina.group.position.z);
    this.group.add(fundir(aro));
    // o rebatedor dourado, do outro lado dela
    const rebatedor = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24), toon(P.gold, { doubleSide: true }));
    rebatedor.position.copy(onde(1.7, 7.3));
    rebatedor.position.y += 0.75;
    rebatedor.lookAt(this.valentina.group.position.x, rebatedor.position.y, this.valentina.group.position.z);
    this.group.add(rebatedor);
    // o flash: um clarão que acende e apaga em cima da câmera
    this.flash = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), flat(P.flashDaFoto, 0.9));
    this.flash.position.copy(tripe.position).add(new V(0, 1.5, 0));
    this.flash.visible = false;
    this.flash.userData.semSombra = true;
    this.group.add(this.flash);
  }

  /** o carro passou: devagar, ela posa encantada e o flash dispara; rápido, ela fica examinando */
  passou(devagar: boolean, carro: THREE.Vector3): void {
    this.valentina.encarar(carro.x, carro.z);
    if (devagar) {
      this.valentina.encantar(2.2);
      this.brilho = 1;
    } else {
      this.valentina.examinar(2.2);
    }
  }

  update(dt: number, perto: boolean): void {
    this.group.visible = perto;
    if (!perto) return;
    this.relogio += dt;
    this.valentina.update(dt);
    this.proximaPose -= dt;
    if (this.proximaPose <= 0) {
      this.proximaPose = 3 + (this.relogio % 1.7);
      this.valentina.posar(2.1);
    }
    this.brilho = Math.max(0, this.brilho - dt * 2.2);
    this.flash.visible = this.brilho > 0.02;
    this.flash.scale.setScalar(0.6 + this.brilho * 2.6);
  }
}

/**
 * O papel do fundo infinito: uma folha que desce reta, faz a curva de raio `r`
 * e vira chão para a frente (o `+Z`), com a ponta da frente rente à grama.
 */
function papelDoFundoInfinito(largura: number, alto: number, r: number, chao: number): THREE.Mesh {
  const reto = alto - r;
  const arco = (Math.PI / 2) * r;
  const total = reto + arco + chao;
  const geo = new THREE.PlaneGeometry(largura, total, 2, 28);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    // (o `y` do plano vai de +total/2 em cima a −total/2 embaixo: vira o caminho `t` ao longo do papel)
    const t = total / 2 - pos.getY(i);
    let y: number;
    let z: number;
    if (t <= reto) { y = alto - t; z = 0; }
    else if (t <= reto + arco) {
      const a = (t - reto) / r;
      y = r - Math.sin(a) * r;
      z = r - Math.cos(a) * r;
    } else { y = 0; z = r + (t - reto - arco); }
    pos.setXYZ(i, pos.getX(i), y + 0.012, z);
  }
  geo.computeVertexNormals();
  const papel = new THREE.Mesh(geo, toon(P.painelMenta, { doubleSide: true }));
  papel.userData.semSombra = true;
  return papel;
}

// ================================================================= o radar escolar

/**
 * O RADAR DA ZONA ESCOLAR: a placa amarela "SUA VELOCIDADE" num poste, com o
 * número em LED (a velocidade do carro em km/h, redesenhado só quando o
 * número muda) e o rostinho: sorrindo verde para quem está devagar, sério
 * âmbar para quem está rápido.
 */
export class RadarEscolar {
  readonly group = new THREE.Group();
  private readonly canvas = document.createElement('canvas');
  private readonly textura: THREE.CanvasTexture;
  private numero = -1;
  private devagar = true;
  /** o limite, em km/h (o mesmo dos outros "passe devagar": 6,2 m/s) */
  static readonly LIMITE = 22;

  constructor(naPista: NaPista, s: number, rumo: number) {
    this.group.userData.peca = 'radar-escolar';
    const metal = toon(P.escolaMastro);
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.6, 8), metal);
    poste.position.y = 1.3;
    this.group.add(poste);
    // a placa de cima, amarela, e o painel de LED embaixo
    const placa = new THREE.Mesh(quina(0.9, 0.42, 0.05, 0.02), toon(P.escolaArmarioAmarelo));
    placa.position.set(0, 2.62, 0.05);
    this.group.add(placa);
    const letreiro = document.createElement('canvas');
    letreiro.width = 256;
    letreiro.height = 120;
    const c = letreiro.getContext('2d');
    if (c) {
      c.fillStyle = `#${P.escolaArmarioAmarelo.toString(16).padStart(6, '0')}`;
      c.fillRect(0, 0, 256, 120);
      c.fillStyle = '#26232a';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.font = '800 34px ui-rounded, "Nunito", system-ui, sans-serif';
      c.fillText('ZONA ESCOLAR', 128, 38);
      c.font = '700 26px ui-rounded, "Nunito", system-ui, sans-serif';
      c.fillText('SUA VELOCIDADE', 128, 86);
    }
    const tLetreiro = new THREE.CanvasTexture(letreiro);
    tLetreiro.colorSpace = THREE.SRGBColorSpace;
    const frente = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.4), toon(P.placaPintada, { mapa: tLetreiro }));
    frente.position.set(0, 2.62, 0.081);
    this.group.add(frente);
    const caixa = new THREE.Mesh(quina(0.9, 0.62, 0.14, 0.04), toon(P.escolaFerro));
    caixa.position.set(0, 2.02, 0.08);
    this.group.add(caixa);
    this.canvas.width = 256;
    this.canvas.height = 176;
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    // o LED é luz própria: material chapado com o mapa (como o letreiro do ônibus)
    // (o LED acende sozinho, sem sombra do toon: material básico com o mapa próprio, como os
    // letreiros acesos do Mania em `world/restauranteDoClube.ts`; o `flat()` é cacheado e não leva mapa)
    const led = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.55), new THREE.MeshBasicMaterial({ map: this.textura }));
    led.name = 'led-do-radar';
    led.position.set(0, 2.02, 0.156);
    this.group.add(led);
    this.desenhar(0, true);
    const lado = 1;
    this.group.position.copy(naPista(s, lado * (PISTA.meia + 0.6), 0.14));
    // a frente para quem vem (a placa olha para trás na pista)
    this.group.rotation.y = rumo + Math.PI;
  }

  private desenhar(kmh: number, devagar: boolean): void {
    const c = this.canvas.getContext('2d');
    if (!c) return;
    c.fillStyle = '#121216';
    c.fillRect(0, 0, 256, 176);
    const cor = devagar ? '#5fe08a' : '#ffb340';
    c.fillStyle = cor;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '900 92px "Courier New", monospace';
    c.fillText(String(kmh).padStart(2, '0'), 92, 92);
    // o rostinho
    c.strokeStyle = cor;
    c.lineWidth = 7;
    c.beginPath();
    c.arc(200, 82, 34, 0, Math.PI * 2);
    c.stroke();
    for (const dx of [-12, 12]) {
      c.beginPath();
      c.arc(200 + dx, 72, 4.5, 0, Math.PI * 2);
      c.fill();
    }
    c.beginPath();
    if (devagar) c.arc(200, 86, 15, 0.15 * Math.PI, 0.85 * Math.PI);
    else { c.moveTo(186, 100); c.lineTo(214, 100); }
    c.stroke();
    c.font = '700 22px ui-rounded, "Nunito", system-ui, sans-serif';
    c.fillText(devagar ? 'OBRIGADO!' : 'DEVAGAR', 128, 152);
    this.textura.needsUpdate = true;
  }

  /** a velocidade (m/s) do carro, quando ele está à vista; parado longe, a placa mostra 00 */
  update(v: number, perto: boolean): void {
    this.group.visible = perto;
    if (!perto) return;
    const kmh = Math.round(v * 3.6);
    const devagar = kmh <= RadarEscolar.LIMITE;
    if (kmh !== this.numero || devagar !== this.devagar) {
      this.numero = kmh;
      this.devagar = devagar;
      this.desenhar(kmh, devagar);
    }
  }
}
