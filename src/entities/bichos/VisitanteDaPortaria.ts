import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { fundir } from '../../world/fundir';
import { letra } from '../../world/uniformeDosGatitos';
import type { Retrato } from '../../minigames/portaria/tipos';
import { PELAGEM } from '../../world/retratosDaPortaria';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * ===================================== OS VISITANTES NOVOS DA PORTARIA
 *
 * Os bichos que só existem na Portaria do Clube (`docs/PORTARIA-DO-CLUBE.md`):
 * o Seu Hipólito, a Dona Alpacina e a prima Alpacona, os gêmeos Bento e Beto,
 * o Tatá do Papita Delivery, a Dona Preguiça (com o netinho no colo) e os
 * figurantes — a lontra, o bode, o coala, o panda-vermelho e o texugo.
 *
 * UMA CLASSE, MONTADA PELA FOTO. O corpo sai da ESPÉCIE, a cor e a marca saem
 * do `Retrato` do dia (o mesmo que o pintor das carteirinhas usa,
 * `world/retratosDaPortaria.ts`), e o traço de cada um sai da FICHA da
 * portaria (`ficha`): o que se reconhece de longe na fila.
 *
 *  - SEU HIPÓLITO: hipopótamo lilás, sobrancelhas brancas e fartas de sócio
 *    antigo, a toalha listrada no ombro, a BOIA DE PATINHO na cintura e o
 *    chinelo; se abana com a carteirinha;
 *  - DONA ALPACINA: alpaca de pescoço comprido, o colar de pérolas e o
 *    PENTEADO DO DIA (franja, coque, tranças, black power, moicano, coque
 *    alto, troféu) em lã de verdade; a pinta no focinho é dela;
 *  - A ALPACONA: a mesma alpaca, maior, de sobrancelha grossa e SEM a pinta;
 *  - BENTO: porquinho de colete verde, camisa, gravata-borboleta vermelha,
 *    relógio no pulso e o topete penteado; a pinta na orelha esquerda;
 *  - BETO: o mesmo porquinho de camiseta laranja larga, o BONÉ VIRADO e a
 *    bola de chiclete que cresce e estoura;
 *  - TATÁ: tamanduá de focinho-tubo, a faixa preta no peito, o rabo de
 *    vassoura, o boné do Papita e a MOCHILA TÉRMICA gigante, de celular na mão;
 *  - DONA PREGUIÇA: a máscara escura dos olhos, o XALE de crochê lilás com as
 *    florzinhas, o coque branco, os óculos de leitura e a BENGALA; no dia em
 *    que vem com o netinho, ele vem agarrado no colo dela;
 *  - a LONTRA de óculos de natação na testa e uma pedrinha na pata; o BODE de
 *    chifre, barbicha e SINO na coleira; o COALA de GORRO DE DORMIR listrado;
 *    o PANDA-VERMELHO abraçado no próprio rabo listrado; o TEXUGO de braços
 *    cruzados e cara fechada, abanando um LEQUE de papel.
 *
 * O jeito de montar é o das coelhinhas e do Flynn: o corpo em números de
 * bicho de chão (a cabeça perto de 0,6), crescido no fim pela escala; olho
 * COLADO no crânio (o oval escuro e os brilhos, virado pela normal); o que se
 * mexe tem nome e o resto se junta na `fundir`.
 */

/** clareia (k > 1) ou escurece (k < 1) uma cor da paleta */
function tom(cor: number, k: number): number {
  const c = new THREE.Color(cor);
  if (k >= 1) c.lerp(new THREE.Color(0xffffff), Math.min(1, k - 1));
  else c.multiplyScalar(k);
  return c.getHex();
}

/** o desenho do corpo de cada espécie (em números de bicho de chão) */
interface Plano {
  /** o quadril (o comprimento da perna) */
  quadril: number;
  /** o tronco: as meias-medidas do elipsoide */
  tronco: readonly [number, number, number];
  /** o crânio: as meias-medidas */
  cranio: readonly [number, number, number];
  /** quanto o pescoço sobe acima do tronco (a alpaca) */
  pescoco: number;
  /** o tamanho final */
  escala: number;
  /** a grossura dos braços e das pernas */
  membro: number;
}

const PLANOS: Readonly<Record<string, Plano>> = {
  hipopotamo: { quadril: 0.15, tronco: [0.2, 0.2, 0.18], cranio: [0.19, 0.15, 0.16], pescoco: 0, escala: 1.38, membro: 0.06 },
  alpaca: { quadril: 0.2, tronco: [0.15, 0.17, 0.14], cranio: [0.12, 0.13, 0.13], pescoco: 0.13, escala: 1.3, membro: 0.044 },
  porquinho: { quadril: 0.16, tronco: [0.16, 0.17, 0.15], cranio: [0.17, 0.15, 0.15], pescoco: 0, escala: 1.15, membro: 0.045 },
  tamandua: { quadril: 0.18, tronco: [0.13, 0.16, 0.14], cranio: [0.11, 0.11, 0.12], pescoco: 0.03, escala: 1.25, membro: 0.04 },
  preguica: { quadril: 0.13, tronco: [0.15, 0.16, 0.14], cranio: [0.15, 0.14, 0.14], pescoco: 0, escala: 1.1, membro: 0.04 },
  lontra: { quadril: 0.13, tronco: [0.12, 0.17, 0.12], cranio: [0.14, 0.13, 0.13], pescoco: 0, escala: 1.12, membro: 0.038 },
  bode: { quadril: 0.2, tronco: [0.13, 0.16, 0.13], cranio: [0.12, 0.15, 0.14], pescoco: 0.02, escala: 1.2, membro: 0.038 },
  coala: { quadril: 0.13, tronco: [0.15, 0.16, 0.14], cranio: [0.16, 0.14, 0.14], pescoco: 0, escala: 1.08, membro: 0.045 },
  pandaVermelho: { quadril: 0.14, tronco: [0.13, 0.15, 0.13], cranio: [0.15, 0.13, 0.13], pescoco: 0, escala: 1.08, membro: 0.04 },
  texugo: { quadril: 0.12, tronco: [0.16, 0.15, 0.15], cranio: [0.15, 0.13, 0.15], pescoco: 0, escala: 1.12, membro: 0.045 },
};

/** as espécies que esta classe monta (as outras têm classe própria) */
export const ESPECIES_DA_PORTARIA = Object.keys(PLANOS);

/** o tique de cada um: o gesto que ele repete na fila e no balcão */
type Tique = 'abanar' | 'cabelo' | 'pe' | 'chiclete' | 'celular' | 'bocejo' | 'pedrinha' | 'teimoso' | 'cochilo' | 'esconder' | 'leque';

export class VisitanteDaPortaria extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly pernas: THREE.Group[] = [];
  private readonly bracos: THREE.Group[] = [];
  private readonly olhos: THREE.Group[] = [];
  private readonly rabo = new THREE.Group();
  /** o que o tique mexe (a bola de chiclete, o leque, o celular…) */
  private readonly extra = new THREE.Group();
  private readonly plano: Plano;
  private readonly pelo: number;
  private readonly claro: number;
  private readonly escuro: number;
  private readonly tique: Tique;
  private relogio = 0;
  private piscada = 3;
  private respiro = 0;

  /**
   * @param ficha o id da ficha da portaria (`hipolito`, `bento`, `lontra`…)
   * @param retrato a foto do dia (a espécie, a cor, a marca, o penteado)
   * @param comNetinho a Dona Preguiça vem com o neto no colo
   */
  constructor(area: AreaDoBicho, readonly ficha: string, readonly retrato: Retrato, comNetinho = false) {
    super(area, {
      velocidade: ficha === 'preguica' ? 0.35 : ficha === 'tata' ? 1.2 : 0.75,
      descansoMin: 1.5,
      descansoMax: 4,
      chanceDeSentar: 0,
      somCadaMin: 1e6,
      somCadaMax: 1e6,
      semente: ficha.length * 977 + (retrato.cor?.length ?? 0) * 31,
    });
    this.plano = PLANOS[retrato.especie] ?? PLANOS.lontra;
    this.pelo = PELAGEM[retrato.cor] ?? P.peloCaramelo;
    this.claro = tom(this.pelo, 1.45);
    this.escuro = tom(this.pelo, 0.7);
    this.tique = TIQUES[ficha] ?? TIQUES[retrato.especie] ?? 'pe';
    this.montar(comNetinho);
    this.prontoParaAparecer(`visitante-${ficha}`);
    this.nomearOQueSeMexe();
    fundir(this.group);
  }

  /** a altura do meio do rosto (o elevador do balcão mede por ela, e não pelo alto do penteado) */
  get alturaDoRosto(): number {
    // (a escala de verdade do corpo: a Alpacona é 10% maior que a prima)
    return this.cabeca.position.y * this.corpo.scale.x;
  }

  // ================================================================ as peças

  private mat(cor: number): THREE.Material {
    return toon(cor);
  }

  private esfera(pai: THREE.Object3D, cor: number, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0, seg = 16): THREE.Mesh {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, seg, Math.max(6, Math.round(seg * 0.75))), this.mat(cor));
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  }

  private capsula(pai: THREE.Object3D, cor: number, r: number, comp: number, x = 0, y = 0, z = 0): THREE.Mesh {
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, comp, 4, 12), this.mat(cor));
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  }

  private tubo(pai: THREE.Object3D, cor: number, pontos: ReadonlyArray<readonly [number, number, number]>, raio: number, segs = 20): THREE.Mesh {
    const curva = new THREE.CatmullRomCurve3(pontos.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    const m = new THREE.Mesh(new THREE.TubeGeometry(curva, segs, raio, 8, false), this.mat(cor));
    pai.add(m);
    return m;
  }

  /** um ponto na casca do crânio (a direção em ângulos) e a normal dele */
  private naCasca(ax: number, ay: number): { p: THREE.Vector3; n: THREE.Vector3 } {
    const [cx, cy, cz] = this.plano.cranio;
    const d = new THREE.Vector3(Math.sin(ax) * Math.cos(ay), Math.sin(ay), Math.cos(ax) * Math.cos(ay));
    const p = new THREE.Vector3(d.x * cx, d.y * cy, d.z * cz);
    const n = new THREE.Vector3(p.x / (cx * cx), p.y / (cy * cy), p.z / (cz * cz)).normalize();
    return { p, n };
  }

  /** algo POUSADO na casca do crânio, virado pela normal (o olho, a pinta, a bochecha) */
  private pousar(obj: THREE.Object3D, ax: number, ay: number, fora = 0.001): void {
    const { p, n } = this.naCasca(ax, ay);
    obj.position.copy(p).addScaledVector(n, fora);
    obj.lookAt(obj.position.clone().add(n));
    this.cabeca.add(obj);
  }

  // ================================================================ o corpo

  private montar(comNetinho: boolean): void {
    const r = this.retrato;
    const f = this.ficha;
    const Pl = this.plano;
    const especie = r.especie;
    const roupa = ROUPA[f];
    const membro = Pl.membro;

    // ---- as pernas: pivô no quadril, o pé encostando no chão
    for (const lado of [-1, 1] as const) {
      const perna = new THREE.Group();
      perna.position.set(lado * Pl.tronco[0] * 0.48, Pl.quadril, 0);
      const comp = Math.max(0.01, Pl.quadril - membro * 1.6);
      const corDaPerna = especie === 'pandaVermelho' ? 0x3a2622 : roupa?.calca ?? this.pelo;
      this.capsula(perna, corDaPerna, membro, comp, 0, -Pl.quadril / 2 + membro * 0.3, 0);
      const corDoPe = especie === 'bode' ? 0x3d3330 : especie === 'pandaVermelho' ? 0x2b1d1a : tom(corDaPerna === this.pelo ? this.pelo : this.pelo, 0.9);
      this.esfera(perna, corDoPe, membro * 1.25, membro * 0.75, membro * 1.9, 0, -Pl.quadril + membro * 0.75, membro * 0.8, 12);
      if (f === 'hipolito') {
        // o chinelo de dedo, azul, embaixo do pé
        const chinelo = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16), this.mat(P.portariaChinelo));
        chinelo.scale.set(membro * 1.4, 0.012, membro * 2.3);
        chinelo.position.set(0, -Pl.quadril + 0.006, membro * 0.8);
        perna.add(chinelo);
        this.tubo(perna, P.portariaChinelo, [[-membro * 0.8, -Pl.quadril + 0.012, membro * 0.2], [0, -Pl.quadril + membro * 1.2, membro * 1.8], [membro * 0.8, -Pl.quadril + 0.012, membro * 0.2]], 0.007, 10);
      }
      this.corpo.add(perna);
      this.pernas.push(perna);
    }

    // ---- o tronco (o pelo) e a roupa por fora
    const [tx, ty, tz] = Pl.tronco;
    const troncoY = Pl.quadril + ty * 0.85;
    this.esfera(this.corpo, this.pelo, tx, ty, tz, 0, troncoY, 0, 20);
    // a barriga clara (o tamanduá tem a faixa preta no lugar)
    if (especie !== 'tamandua') this.esfera(this.corpo, especie === 'pandaVermelho' ? 0x3a2622 : this.claro, tx * 0.62, ty * 0.7, tz * 0.4, 0, troncoY - ty * 0.08, tz * 0.68, 16);
    if (roupa) this.vestir(roupa, troncoY);

    // ---- o pescoço e a cabeça
    const ombro = troncoY + ty * 0.72;
    const alturaDaCabeca = troncoY + ty * 0.8 + Pl.pescoco + Pl.cranio[1] * 0.85;
    if (Pl.pescoco > 0.05) {
      // o pescoço comprido de alpaca, de lã, um tico para a frente
      this.capsula(this.corpo, this.claro, Pl.cranio[0] * 0.55, Pl.pescoco + 0.04, 0, troncoY + ty * 0.7 + Pl.pescoco / 2, 0.03);
    }
    this.cabeca.position.set(0, alturaDaCabeca, especie === 'alpaca' ? 0.04 : 0.01);
    this.cabeca.name = `cabeca-do-visitante`;
    this.montarCabeca();
    this.corpo.add(this.cabeca);

    // ---- os braços: pivô no ombro, abertos um tico para fora
    for (const lado of [-1, 1] as const) {
      const braco = new THREE.Group();
      braco.position.set(lado * tx * 0.92, ombro, 0);
      const comp = especie === 'preguica' ? 0.17 : 0.11;
      const corDoBraco = especie === 'pandaVermelho' ? 0x3a2622 : roupa?.manga ?? this.pelo;
      this.capsula(braco, corDoBraco, membro * 0.85, comp, 0, -comp / 2 - membro * 0.4, 0);
      const pata = this.esfera(braco, especie === 'pandaVermelho' ? 0x2b1d1a : this.pelo, membro * 1.05, membro * 1.05, membro * 1.05, 0, -comp - membro * 0.9, 0, 12);
      if (especie === 'preguica' || especie === 'tamandua' || especie === 'texugo' || especie === 'coala') {
        // as garras compridas (de preguiça, de tamanduá e de cavar)
        for (let k = -1; k <= 1; k++) {
          const garra = new THREE.Mesh(new THREE.ConeGeometry(0.008, especie === 'preguica' ? 0.05 : 0.03, 6), this.mat(0xe9e0cf));
          garra.position.set(k * 0.014, -comp - membro * 1.9, 0.012);
          garra.rotation.x = Math.PI;
          braco.add(garra);
        }
      }
      braco.rotation.z = lado * 0.18;
      void pata;
      this.corpo.add(braco);
      this.bracos.push(braco);
    }

    // ---- o rabo
    this.montarRabo(troncoY);

    // ---- o traço de cada um
    this.montarTraco(troncoY, comNetinho);

    this.corpo.scale.setScalar(Pl.escala * (f === 'alpacona' ? 1.1 : 1));
    this.group.add(this.corpo);
  }

  /** a roupa por cima do tronco: a casca maior que ele, a gola e os detalhes */
  private vestir(roupa: Roupa, troncoY: number): void {
    const [tx, ty, tz] = this.plano.tronco;
    const casca = this.esfera(this.corpo, roupa.cor, tx * 1.07, ty * 0.78, tz * 1.08, 0, troncoY - ty * 0.08, 0, 20);
    casca.name = 'roupa';
    if (roupa.camisa) {
      // a gola em V da camisa por baixo do colete (o Bento)
      const gola = new THREE.Mesh(new THREE.ConeGeometry(tx * 0.42, ty * 0.55, 3), this.mat(roupa.camisa));
      gola.rotation.set(Math.PI, 0, 0);
      gola.scale.z = 0.25;
      gola.position.set(0, troncoY + ty * 0.38, tz * 0.98);
      this.corpo.add(gola);
      // os botões do colete
      for (let k = 0; k < 3; k++) this.esfera(this.corpo, 0xe7dcc0, 0.009, 0.009, 0.005, 0, troncoY - ty * 0.05 - k * 0.045, tz * 1.07, 8);
    }
  }

  // ================================================================ a cabeça

  private montarCabeca(): void {
    const r = this.retrato;
    const especie = r.especie;
    const [cx, cy, cz] = this.plano.cranio;
    const pelo = this.pelo;
    const claro = this.claro;
    const escuro = this.escuro;
    const h = this.cabeca;
    this.esfera(h, pelo, cx, cy, cz, 0, 0, 0, 22);

    // ---- o rosto de cada espécie (a máscara, a listra, o focinho)
    switch (especie) {
      case 'hipopotamo': {
        // o focinhão claro, com as narinas EM CIMA, e a boquinha sorrindo embaixo
        this.esfera(h, tom(pelo, 1.2), cx * 0.86, cy * 0.62, cz * 0.62, 0, -cy * 0.36, cz * 0.66, 20);
        for (const lado of [-1, 1]) this.esfera(h, escuro, 0.016, 0.01, 0.012, lado * 0.045, -cy * 0.08, cz * 1.14, 10);
        this.sorriso(0, -cy * 0.62, cz * 1.2, 0.05);
        break;
      }
      case 'alpaca': {
        // o focinho curto e claro, o narizinho em Y, e a lã em volta da cara
        this.esfera(h, tom(claro, 1.1), cx * 0.62, cy * 0.45, cz * 0.48, 0, -cy * 0.45, cz * 0.68, 16);
        this.esfera(h, 0x6b4a3a, 0.014, 0.01, 0.01, 0, -cy * 0.3, cz * 1.13, 8);
        this.sorriso(0, -cy * 0.62, cz * 1.08, 0.025);
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2;
          this.esfera(h, claro, 0.05, 0.05, 0.05, Math.cos(a) * cx * 0.95, cy * 0.15 + Math.sin(a) * cy * 0.5, -cz * 0.25, 10);
        }
        break;
      }
      case 'porquinho': {
        // o disco do focinho, com as duas narinas
        const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.058, 0.04, 20), this.mat(tom(pelo, 0.93)));
        disco.rotation.x = Math.PI / 2;
        disco.position.set(0, -cy * 0.28, cz * 0.98);
        h.add(disco);
        for (const lado of [-1, 1]) this.esfera(h, 0xa0545e, 0.011, 0.016, 0.006, lado * 0.02, -cy * 0.28, cz * 0.98 + 0.021, 8);
        this.sorriso(0, -cy * 0.62, cz * 0.9, 0.035);
        break;
      }
      case 'tamandua': {
        // o focinho-tubo, comprido e curvado para baixo, com o narizinho preto na ponta
        this.tubo(h, tom(pelo, 1.1), [[0, -cy * 0.15, cz * 0.6], [0, -cy * 0.35, cz * 1.4], [0, -cy * 0.75, cz * 2.0], [0, -cy * 1.2, cz * 2.2]], 0.032, 16);
        this.esfera(h, 0x2b2622, 0.022, 0.016, 0.018, 0, -cy * 1.25, cz * 2.22, 10);
        break;
      }
      case 'preguica': {
        // a cara clara, a máscara escura puxada para trás em volta dos olhos, o sorriso de vovó
        this.esfera(h, tom(pelo, 1.25), cx * 0.78, cy * 0.7, cz * 0.4, 0, -cy * 0.1, cz * 0.7, 18);
        for (const lado of [-1, 1]) {
          const mancha = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), this.mat(0x4a3428));
          mancha.scale.set(0.045, 0.02, 0.008);
          mancha.rotation.z = lado * -0.4;
          // (a cara clara avança 4 cm à frente do crânio: a máscara vai por cima dela)
          this.pousar(mancha, lado * 0.4, 0.08, 0.03);
        }
        this.esfera(h, 0x3a2a24, 0.018, 0.012, 0.01, 0, -cy * 0.25, cz * 1.08, 8);
        this.sorriso(0, -cy * 0.48, cz * 1.04, 0.035);
        break;
      }
      case 'lontra': {
        // o focinho claro e largo, o narizão preto e os bigodes
        this.esfera(h, 0xf3e6d2, cx * 0.62, cy * 0.42, cz * 0.4, 0, -cy * 0.38, cz * 0.72, 16);
        this.esfera(h, 0x2b2622, 0.026, 0.018, 0.014, 0, -cy * 0.22, cz * 1.07, 10);
        const corDoBigode = r.marca === 'bigodeBranco' ? 0xffffff : 0x3d2c26;
        for (const lado of [-1, 1]) for (const k of [-1, 1]) {
          this.tubo(h, corDoBigode, [[lado * 0.035, -cy * 0.36 + k * 0.008, cz * 1.0], [lado * 0.09, -cy * 0.33 + k * 0.016, cz * 0.95], [lado * 0.13, -cy * 0.3 + k * 0.026, cz * 0.82]], 0.0025, 8);
        }
        this.sorriso(0, -cy * 0.55, cz * 1.0, 0.03);
        break;
      }
      case 'bode': {
        // o focinho comprido e quadrado, as narinas, e a barbicha
        this.esfera(h, tom(pelo, 1.15), cx * 0.75, cy * 0.4, cz * 0.6, 0, -cy * 0.55, cz * 0.6, 16);
        for (const lado of [-1, 1]) this.esfera(h, 0x2b2622, 0.01, 0.014, 0.008, lado * 0.025, -cy * 0.5, cz * 1.12, 8);
        const barba = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 10), this.mat(0xefe8da));
        barba.rotation.x = Math.PI;
        barba.position.set(0, -cy * 1.15, cz * 0.75);
        h.add(barba);
        break;
      }
      case 'coala': {
        // o NARIZÃO preto e oval, a cara clara embaixo
        this.esfera(h, 0xe9e6e1, cx * 0.55, cy * 0.42, cz * 0.4, 0, -cy * 0.42, cz * 0.68, 16);
        const nariz = r.marca === 'narizGrande' ? 1.35 : 1;
        this.esfera(h, 0x2b2622, 0.04 * nariz, 0.05 * nariz, 0.03, 0, -cy * 0.18, cz * 1.02, 14);
        break;
      }
      case 'pandaVermelho': {
        // a cara branca: as gotas em cima dos olhos, o focinho, e as "lágrimas" ferrugem
        this.esfera(h, 0xf7efe4, cx * 0.55, cy * 0.4, cz * 0.45, 0, -cy * 0.42, cz * 0.7, 16);
        for (const lado of [-1, 1]) {
          const gota = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), this.mat(0xf7efe4));
          gota.scale.set(0.028, 0.017, 0.006);
          this.pousar(gota, lado * 0.33, 0.42, 0.002);
          const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), this.mat(0xf7efe4));
          bochecha.scale.set(0.045, 0.035, 0.008);
          this.pousar(bochecha, lado * 0.7, -0.18, 0.001);
        }
        this.esfera(h, 0x2b2622, 0.02, 0.014, 0.012, 0, -cy * 0.25, cz * 1.12, 8);
        if (r.marca === 'manchaNaTesta') {
          const mancha = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), this.mat(0xf7efe4));
          mancha.scale.set(0.035, 0.022, 0.006);
          this.pousar(mancha, 0, 0.62, 0.002);
        }
        break;
      }
      case 'texugo': {
        // a listra branca do nariz à nuca, e as duas faixas pretas da máscara
        const listra = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), this.mat(0xf2efe8));
        listra.scale.set(cx * 0.32, cy * 1.02, cz * 1.02);
        h.add(listra);
        for (const lado of [-1, 1]) {
          const faixa = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), this.mat(0x24222a));
          faixa.scale.set(cx * 0.35, cy * 0.7, cz * 0.75);
          faixa.position.set(lado * cx * 0.5, cy * 0.05, cz * 0.38);
          h.add(faixa);
        }
        this.esfera(h, 0xf2efe8, cx * 0.32, cy * 0.32, cz * 0.5, 0, -cy * 0.35, cz * 0.75, 14);
        this.esfera(h, 0x2b2622, 0.02, 0.014, 0.012, 0, -cy * 0.3, cz * 1.22, 8);
        if (r.marca === 'cicatrizNoNariz') this.tubo(h, 0x7a3a2e, [[0.02, -cy * 0.15, cz * 1.15], [0.04, -cy * 0.28, cz * 1.13]], 0.003, 4);
        break;
      }
    }

    // ---- os olhos colados (e a cor deles), as bochechas
    const meio = especie === 'coala' || especie === 'preguica';
    for (const lado of [-1, 1] as const) {
      const olho = new THREE.Group();
      const escuroDoOlho = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), this.mat(0x231c1c));
      escuroDoOlho.scale.set(0.019, meio ? 0.012 : 0.024, 0.005);
      olho.add(escuroDoOlho);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), this.mat(0xffffff));
      brilho.scale.set(0.007, 0.007, 0.003);
      brilho.position.set(lado * 0.006, meio ? 0.004 : 0.009, 0.0045);
      olho.add(brilho);
      const brilhinho = new THREE.Mesh(new THREE.SphereGeometry(1, 6, 4), this.mat(0xffffff));
      brilhinho.scale.set(0.0035, 0.0035, 0.002);
      brilhinho.position.set(-lado * 0.006, -0.006, 0.0055);
      olho.add(brilhinho);
      if (meio) {
        // a pálpebra de quem cochila: um traço escuro por cima
        const palpebra = new THREE.Mesh(new THREE.TorusGeometry(0.019, 0.0035, 5, 12, Math.PI * 0.9), this.mat(0x231c1c));
        palpebra.rotation.z = Math.PI * 0.05;
        palpebra.position.z = 0.004;
        olho.add(palpebra);
      }
      if (especie === 'alpaca' && this.ficha === 'alpacina') {
        // os cílios da vaidosa, no canto de fora
        for (const k of [0, 1]) {
          const cilio = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.004, 0.003), this.mat(0x231c1c));
          cilio.position.set(lado * (0.018 + k * 0.004), 0.016 - k * 0.008, 0.003);
          cilio.rotation.z = lado * (0.55 - k * 0.3);
          olho.add(cilio);
        }
      }
      const ax = (OLHO_AFASTADO as Record<string, number>)[especie] ?? 0.38;
      const ay = especie === 'hipopotamo' ? 0.3 : especie === 'bode' ? 0.18 : 0.12;
      this.pousar(olho, lado * ax, ay, 0.0015);
      this.olhos.push(olho);
      const bochecha = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), this.mat(0xf3a0a8));
      bochecha.scale.set(0.026, 0.016, 0.005);
      this.pousar(bochecha, lado * (ax + 0.28), ay - 0.32, 0.002);
      // as sobrancelhas de quem tem cara: a Alpacona, o bode, o texugo
      const brava = especie === 'texugo' || especie === 'bode' || this.ficha === 'alpacona';
      if (brava) {
        const sob = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.009, 0.006), this.mat(especie === 'texugo' ? 0x2b2626 : 0x6b5440));
        sob.rotation.z = lado * -0.35;
        this.pousar(sob, lado * ax, ay + 0.3, 0.004);
      }
    }

    // ---- as orelhas
    this.montarOrelhas();

    // ---- a marca que distingue (a que a lupa compara com a foto)
    const m = r.marca;
    if (m === 'pintaNoFocinho') {
      const pinta = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), this.mat(0x6b4a3a));
      pinta.scale.set(0.02, 0.016, 0.006);
      pinta.position.set(0.035, -cy * 0.42, cz * 1.1);
      h.add(pinta);
    }
    if (m === 'pintasNoFocinho') {
      for (const [dx, dy] of [[-0.06, -0.42], [-0.035, -0.5], [0.055, -0.46]] as const) this.esfera(h, 0x3d2c26, 0.009, 0.009, 0.005, dx, cy * dy, cz * 1.13, 8);
    }
    if (m === 'cicatrizNaSobrancelha') this.tubo(h, 0x7a3a2e, [[0.03, cy * 0.45, cz * 0.88], [0.06, cy * 0.25, cz * 0.9]], 0.003, 4);
  }

  /** a boquinha sorrindo: um arco fino */
  private sorriso(x: number, y: number, z: number, largura: number): void {
    const arco = new THREE.Mesh(new THREE.TorusGeometry(largura / 2, 0.0035, 5, 12, Math.PI), this.mat(0x3a2622));
    arco.rotation.z = Math.PI;
    arco.position.set(x, y, z);
    this.cabeca.add(arco);
  }

  private montarOrelhas(): void {
    const r = this.retrato;
    const especie = r.especie;
    const [cx, cy] = this.plano.cranio;
    for (const lado of [-1, 1] as const) {
      const orelha = new THREE.Group();
      orelha.name = `orelha-${lado < 0 ? 'direita' : 'esquerda'}`;
      const dentro = especie === 'porquinho' ? tom(this.pelo, 0.85) : 0xe9b7b0;
      switch (especie) {
        case 'hipopotamo':
        case 'lontra':
        case 'texugo':
        case 'preguica':
        case 'tamandua': {
          if (especie === 'preguica') break;
          orelha.position.set(lado * cx * 0.72, cy * 0.72, -0.01);
          this.esfera(orelha, this.pelo, 0.035, 0.03, 0.02, 0, 0, 0, 10);
          this.esfera(orelha, this.escuro, 0.02, 0.017, 0.01, 0, 0, 0.012, 8);
          break;
        }
        case 'alpaca': {
          // a orelha de banana, em pé, um tico para fora
          orelha.position.set(lado * cx * 0.55, cy * 0.85, -0.01);
          orelha.rotation.z = -lado * 0.25;
          this.esfera(orelha, this.pelo, 0.025, 0.07, 0.02, 0, 0.06, 0, 12);
          this.esfera(orelha, tom(this.pelo, 0.9), 0.012, 0.05, 0.01, 0, 0.06, 0.012, 10);
          break;
        }
        case 'porquinho': {
          // a orelha caída para a frente, triângulo macio
          orelha.position.set(lado * cx * 0.62, cy * 0.75, 0.02);
          orelha.rotation.set(0.9, 0, -lado * 0.5);
          const o = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.09, 12), this.mat(this.pelo));
          o.scale.z = 0.4;
          o.position.y = 0.04;
          orelha.add(o);
          const d = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 10), this.mat(dentro));
          d.scale.z = 0.3;
          d.position.set(0, 0.035, 0.008);
          orelha.add(d);
          if (r.marca === 'pintaNaOrelhaEsquerda' && lado > 0) {
            // a pinta do Bento: na orelha ESQUERDA (o `+X`, que de frente fica à direita de quem olha)
            this.esfera(orelha, 0x7a3f4a, 0.016, 0.02, 0.008, 0, 0.04, 0.017, 8);
          }
          break;
        }
        case 'bode': {
          // a orelha deitada para o lado
          orelha.position.set(lado * cx * 0.85, cy * 0.45, -0.02);
          orelha.rotation.z = -lado * 1.35;
          this.esfera(orelha, this.pelo, 0.022, 0.06, 0.012, 0, 0.05, 0, 10);
          if (r.marca === 'brincoNaOrelha' && lado < 0) {
            const brinco = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 6, 14), this.mat(0xe8c24a));
            brinco.position.set(0, 0.09, 0.01);
            orelha.add(brinco);
          }
          // o chifre, curvado para trás (o torto do figurante entorta um)
          const torto = r.marca === 'chifreTorto' && lado > 0;
          this.tubo(this.cabeca, 0xd6c5a2, [[lado * 0.04, cy * 0.8, -0.01], [lado * 0.06, cy * 1.25, -0.04], [lado * (torto ? 0.14 : 0.08), cy * (torto ? 1.3 : 1.55), -0.11]], 0.012, 12);
          break;
        }
        case 'coala': {
          // as orelhonas de coala, redondas e fofas, com o tufo branco
          orelha.position.set(lado * cx * 0.95, cy * 0.55, -0.02);
          this.esfera(orelha, this.pelo, 0.075, 0.07, 0.03, 0, 0, 0, 14);
          this.esfera(orelha, 0xf4f1ec, 0.05, 0.045, 0.02, lado * 0.008, 0, 0.014, 12);
          if (r.marca === 'orelhaRasgadinha' && lado < 0) this.esfera(orelha, this.claro, 0.02, 0.02, 0.035, -0.06, 0.04, 0, 8);
          break;
        }
        case 'pandaVermelho': {
          // a orelha pontuda com a borda branca
          orelha.position.set(lado * cx * 0.72, cy * 0.75, -0.01);
          orelha.rotation.z = -lado * 0.25;
          const o = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 12), this.mat(0xf7efe4));
          o.scale.z = 0.45;
          o.position.y = 0.035;
          orelha.add(o);
          const d = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.06, 10), this.mat(this.pelo));
          d.scale.z = 0.3;
          d.position.set(0, 0.03, 0.008);
          orelha.add(d);
          break;
        }
      }
      this.cabeca.add(orelha);
    }
  }

  // ================================================================ o rabo

  private montarRabo(troncoY: number): void {
    const r = this.retrato;
    const especie = r.especie;
    const [, ty, tz] = this.plano.tronco;
    this.rabo.name = 'rabo';
    this.rabo.position.set(0, troncoY - ty * 0.55, -tz * 0.9);
    this.corpo.add(this.rabo);
    switch (especie) {
      case 'porquinho':
        // o rabinho enrolado em mola
        this.tubo(this.rabo, this.pelo, Array.from({ length: 9 }, (_, i) => {
          const a = i * 0.9;
          return [Math.cos(a) * 0.022, 0.01 + i * 0.006, -0.01 - Math.sin(a) * 0.022 - i * 0.004] as const;
        }), 0.007, 30);
        break;
      case 'tamandua':
        // o rabo de vassoura: comprido, fofo, para cima e para trás
        for (let i = 0; i < 6; i++) this.esfera(this.rabo, i % 2 ? this.pelo : tom(this.pelo, 0.85), 0.05 + i * 0.008, 0.06, 0.035, 0, 0.03 + i * 0.05, -0.05 - i * 0.03, 10);
        break;
      case 'lontra':
        this.tubo(this.rabo, this.pelo, [[0, 0, 0], [0, -0.06, -0.08], [0, -0.12, -0.14]], 0.03, 10);
        break;
      case 'texugo':
      case 'bode':
      case 'hipopotamo':
        this.esfera(this.rabo, this.escuro, 0.025, 0.035, 0.025, 0, 0, -0.01, 8);
        break;
      case 'alpaca':
        this.esfera(this.rabo, this.claro, 0.045, 0.05, 0.04, 0, 0.02, -0.02, 10);
        break;
      case 'pandaVermelho': {
        // o rabo listrado, ENROLADO NA FRENTE do corpo, abraçado (ele é tímido)
        this.rabo.position.set(0, troncoY - ty * 0.45, 0);
        const N = 9;
        for (let i = 0; i < N; i++) {
          const a = -Math.PI * 0.6 + (i / (N - 1)) * Math.PI * 1.25;
          const raio = this.plano.tronco[0] * 1.25;
          this.esfera(this.rabo, i % 2 ? tom(this.pelo, 0.6) : this.pelo, 0.048, 0.048, 0.055,
            Math.sin(a) * raio, 0.04 + i * 0.012, Math.cos(a) * raio * 0.95, 10);
        }
        break;
      }
      default:
        break;
    }
  }

  // ================================================================ o traço de cada um

  private montarTraco(troncoY: number, comNetinho: boolean): void {
    const f = this.ficha;
    const r = this.retrato;
    const [tx, ty, tz] = this.plano.tronco;
    const [cx, cy, cz] = this.plano.cranio;
    const h = this.cabeca;
    const especie = r.especie;

    // ---- o penteado do dia (a alpaca)
    if (especie === 'alpaca') this.montarPenteado(r.cabelo ?? 'franja');

    // ---- o que vai na cabeça
    if (f === 'hipolito') {
      // as sobrancelhas brancas e fartas do sócio mais antigo
      for (const lado of [-1, 1]) {
        const sob = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), this.mat(0xf6f2ea));
        sob.scale.set(0.035, 0.014, 0.012);
        sob.rotation.z = lado * -0.2;
        this.pousar(sob, lado * 0.42, 0.58, 0.004);
      }
    }
    if (f === 'bento') {
      // o topete penteado de lado
      const topete = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), this.mat(tom(this.pelo, 0.88)));
      topete.scale.set(0.06, 0.025, 0.05);
      topete.rotation.z = -0.4;
      topete.position.set(0.03, cy * 0.95, 0.02);
      h.add(topete);
    }
    if (f === 'beto') this.montarBone(P.portariaBoneBeto, true);
    if (f === 'tata') {
      this.montarBone(P.portariaPapita, false);
      // o "P" do Papita na frente do boné
      const p = letra('P', 0.045, P.portariaPapitaEscuro);
      p.position.set(0, cy * 0.78, cz * 0.88);
      p.rotation.x = -0.35;
      h.add(p);
    }
    if (f === 'preguica') {
      // o coque branquinho de vovó, com a florzinha de crochê
      this.esfera(h, 0xf6f2ea, 0.055, 0.045, 0.05, 0, cy * 1.02, -0.03, 12);
      this.esfera(h, P.portariaXaleFlor, 0.02, 0.02, 0.012, 0.05, cy * 0.95, 0.02, 8);
      // os óculos de leitura na ponta do nariz, com a correntinha
      for (const lado of [-1, 1]) {
        const aro = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.0035, 6, 18), this.mat(0x7a5a3a));
        this.pousar(aro, lado * 0.3, -0.05, 0.03);
      }
      this.tubo(h, P.portariaRelogio, [[-0.08, -cy * 0.05, cz * 0.88], [-cx * 0.95, -cy * 0.55, cz * 0.4], [-cx * 0.7, -cy * 1.05, cz * 0.5]], 0.0018, 12);
    }
    if (especie === 'lontra') {
      // os óculos de natação na testa: a tira em volta e as duas lentes azuis
      const tira = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 6, 28), this.mat(P.portariaOculosNatacao));
      tira.scale.set(cx * 1.02, cz * 1.02, cx * 1.0);
      tira.rotation.x = Math.PI / 2 - 0.35;
      tira.position.y = cy * 0.45;
      h.add(tira);
      for (const lado of [-1, 1]) {
        const lente = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.02, 16), this.mat(P.portariaOculosNatacao));
        lente.rotation.x = Math.PI / 2;
        this.pousar(lente, lado * 0.3, 0.52, 0.006);
        const vidro = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16), this.mat(tom(P.portariaOculosNatacao, 1.6)));
        this.pousar(vidro, lado * 0.3, 0.52, 0.017);
      }
    }
    if (especie === 'coala') {
      // o gorro de dormir listrado, caindo para o lado, com o pompom
      const gorro = new THREE.Group();
      gorro.position.set(0, cy * 0.65, -0.01);
      gorro.rotation.z = -0.5;
      for (let i = 0; i < 4; i++) {
        const r0 = cx * (0.92 - i * 0.22);
        const r1 = cx * (0.92 - (i + 1) * 0.22);
        const gomo = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(0.01, r1), r0, 0.07, 18), this.mat(i % 2 ? P.portariaGorroListra : P.portariaGorro));
        gomo.position.y = 0.035 + i * 0.07;
        gomo.rotation.z = i * -0.12;
        gorro.add(gomo);
      }
      const barra = new THREE.Mesh(new THREE.TorusGeometry(cx * 0.92, 0.018, 8, 24), this.mat(P.portariaGorroListra));
      barra.rotation.x = Math.PI / 2;
      gorro.add(barra);
      this.esfera(gorro, P.portariaGorroListra, 0.03, 0.03, 0.03, -0.06, 0.3, 0, 10);
      h.add(gorro);
    }

    // ---- no corpo
    if (f === 'hipolito') {
      // a BOIA DE PATINHO na cintura: o aro amarelo, a cabeça do pato e o bico
      const boia = new THREE.Group();
      boia.position.set(0, troncoY - ty * 0.35, 0);
      const aro = new THREE.Mesh(new THREE.TorusGeometry(tx * 1.15, 0.05, 10, 32), this.mat(P.portariaBoiaPato));
      aro.rotation.x = Math.PI / 2;
      aro.scale.set(1, tz / tx, 1);
      boia.add(aro);
      this.esfera(boia, P.portariaBoiaPato, 0.055, 0.06, 0.055, 0, 0.07, tz * 1.2, 14);
      this.esfera(boia, P.portariaBoiaBico, 0.035, 0.014, 0.03, 0, 0.065, tz * 1.2 + 0.055, 10);
      for (const lado of [-1, 1]) this.esfera(boia, 0x231c1c, 0.008, 0.01, 0.005, lado * 0.025, 0.09, tz * 1.2 + 0.045, 6);
      this.corpo.add(boia);
      // a toalha listrada no ombro direito, caindo na frente e atrás
      const toalha = new THREE.Group();
      toalha.position.set(-tx * 0.55, troncoY + ty * 0.68, 0);
      for (const z of [1, -1]) {
        const pano = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.012), this.mat(P.portariaToalha));
        pano.position.set(0, -0.08, z * tz * 0.85);
        pano.rotation.x = z * 0.25;
        toalha.add(pano);
        for (const k of [0, 1]) {
          const listra = new THREE.Mesh(new THREE.BoxGeometry(0.092, 0.018, 0.014), this.mat(P.portariaToalhaListra));
          listra.position.set(0, -0.06 - k * 0.06, z * tz * 0.85);
          listra.rotation.x = z * 0.25;
          toalha.add(listra);
        }
      }
      const dobra = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.09, 16, 1, false, 0, Math.PI), this.mat(P.portariaToalha));
      dobra.rotation.set(0, 0, Math.PI / 2);
      dobra.scale.set(1, 1, tz * 17);
      dobra.position.y = 0.005;
      toalha.add(dobra);
      this.corpo.add(toalha);
    }
    if (especie === 'alpaca') {
      // o colar de pérolas na base do pescoço
      const N = 16;
      const colar = new THREE.InstancedMesh(new THREE.SphereGeometry(0.013, 8, 6), this.mat(P.portariaPerola), N);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        m4.makeTranslation(Math.sin(a) * cx * 0.62, troncoY + ty * 0.78 - Math.max(0, Math.cos(a)) * 0.04, 0.03 + Math.cos(a) * cx * 0.62);
        colar.setMatrixAt(i, m4);
      }
      colar.instanceMatrix.needsUpdate = true;
      this.corpo.add(colar);
    }
    if (f === 'bento') {
      // a gravata-borboleta vermelha na gola, e o relógio dourado no pulso
      const laco = new THREE.Group();
      laco.position.set(0, troncoY + ty * 0.62, tz * 0.97);
      for (const lado of [-1, 1]) {
        const asa = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.05, 4), this.mat(P.portariaGravata));
        asa.rotation.z = lado * Math.PI / 2;
        asa.position.x = lado * 0.024;
        asa.scale.z = 0.5;
        laco.add(asa);
      }
      this.esfera(laco, tom(P.portariaGravata, 0.8), 0.012, 0.014, 0.01, 0, 0, 0.004, 8);
      this.corpo.add(laco);
      const relogio = new THREE.Mesh(new THREE.TorusGeometry(this.plano.membro * 0.95, 0.008, 6, 16), this.mat(P.portariaRelogio));
      relogio.rotation.x = Math.PI / 2;
      relogio.position.y = -0.1;
      this.bracos[1]?.add(relogio);
    }
    if (f === 'beto') {
      // a bola de chiclete (cresce e estoura no tique)
      this.extra.name = 'chiclete';
      this.extra.position.set(0, -cy * 0.62, cz * 0.92);
      this.esfera(this.extra, P.portariaChiclete, 0.05, 0.05, 0.05, 0, 0, 0.04, 14);
      h.add(this.extra);
    }
    if (f === 'tata') {
      // a MOCHILA TÉRMICA do Papita: a caixa amarela nas costas, a tampa e o "P"
      const mochila = new THREE.Group();
      mochila.position.set(0, troncoY + ty * 0.15, -tz * 1.05 - 0.12);
      const caixa = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.24), this.mat(P.portariaPapita));
      mochila.add(caixa);
      const tampa = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.03, 0.25), this.mat(P.portariaPapitaEscuro));
      tampa.position.y = 0.16;
      mochila.add(tampa);
      const selo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.01, 20), this.mat(P.portariaCamisa));
      selo.rotation.x = Math.PI / 2;
      selo.position.z = -0.125;
      mochila.add(selo);
      const p = letra('P', 0.09, P.portariaPapitaEscuro);
      p.position.set(0, 0, -0.131);
      p.rotation.y = Math.PI;
      mochila.add(p);
      this.corpo.add(mochila);
      // as alças por cima dos ombros
      for (const lado of [-1, 1]) this.tubo(this.corpo, P.portariaPapitaEscuro, [[lado * tx * 0.5, troncoY + ty * 0.3, -tz * 1.05], [lado * tx * 0.55, troncoY + ty * 0.85, 0], [lado * tx * 0.5, troncoY + ty * 0.2, tz * 0.95]], 0.012, 12);
      // a faixa preta de tamanduá, do ombro ao peito
      const faixa = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), this.mat(0x2b2622));
      faixa.scale.set(tx * 0.25, ty * 0.75, tz * 1.02);
      faixa.rotation.z = 0.7;
      faixa.position.set(-tx * 0.25, troncoY + ty * 0.2, 0);
      this.corpo.add(faixa);
      // o celular na pata
      this.extra.name = 'celular';
      const celular = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.065, 0.008), this.mat(P.portariaCelular));
      this.extra.add(celular);
      const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.028, 0.052), toon(0x8fd0f0, { glow: 0.6 }));
      tela.position.z = 0.0045;
      this.extra.add(tela);
      this.extra.position.set(0, -0.2, 0.04);
      this.bracos[0]?.add(this.extra);
    }
    if (f === 'preguica') {
      // o XALE de crochê lilás nos ombros, com as florzinhas
      const xale = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), this.mat(P.portariaXale));
      xale.scale.set(tx * 1.12, ty * 0.8, tz * 1.12);
      xale.position.y = troncoY + ty * 0.05;
      this.corpo.add(xale);
      for (const lado of [-1, 1]) this.esfera(this.corpo, P.portariaXaleFlor, 0.022, 0.022, 0.012, lado * tx * 0.55, troncoY + ty * 0.45, tz * 0.95, 8);
      // a bengala na pata direita
      const bengala = new THREE.Group();
      bengala.name = 'bengala';
      // (a pata fica a ~17 cm do chão no corpo de vovó: a bengala desce até ele, sem atravessar)
      this.tubo(bengala, P.portariaBengala, [[0, 0.01, 0], [0, -0.08, 0.02], [0, -0.155, 0.02]], 0.009, 8);
      this.tubo(bengala, P.portariaBengala, [[0, 0.01, 0], [0, 0.04, 0.03], [0, 0.02, 0.06]], 0.009, 8);
      bengala.position.set(0, -0.2, 0.03);
      this.bracos[0]?.add(bengala);
      if (comNetinho) this.montarNetinho(troncoY);
    }
    if (especie === 'lontra') {
      // a pedrinha lisa na pata (o tique equilibra no nariz)
      this.extra.name = 'pedrinha';
      this.esfera(this.extra, 0x9aa0a6, 0.026, 0.018, 0.022, 0, 0, 0, 10);
      this.extra.position.set(0, -0.2, 0.02);
      this.bracos[1]?.add(this.extra);
    }
    if (especie === 'bode') {
      // a coleira vermelha com o SINO dourado
      const coleira = new THREE.Mesh(new THREE.TorusGeometry(cx * 0.6, 0.012, 8, 24), this.mat(P.portariaColeira));
      coleira.rotation.x = Math.PI / 2 - 0.2;
      coleira.position.set(0, troncoY + ty * 0.85, 0.01);
      this.corpo.add(coleira);
      const sino = new THREE.Mesh(new THREE.LatheGeometry([
        new THREE.Vector2(0, 0.05), new THREE.Vector2(0.012, 0.048), new THREE.Vector2(0.02, 0.03), new THREE.Vector2(0.03, 0.005), new THREE.Vector2(0.032, 0),
      ], 14), toon(P.portariaSino, { doubleSide: true }));
      sino.name = 'sino';
      sino.position.set(0, troncoY + ty * 0.85 - 0.075, cx * 0.62);
      this.corpo.add(sino);
    }
    if (especie === 'texugo') {
      // o leque de papel na pata (ele reclama do calor)
      this.extra.name = 'leque';
      for (let i = 0; i < 7; i++) {
        const vareta = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.075, 0.003), this.mat(i % 2 ? P.portariaLeque : tom(P.portariaLeque, 0.85)));
        vareta.position.y = 0.035;
        const giro = new THREE.Group();
        giro.rotation.z = -0.75 + i * 0.25;
        giro.add(vareta);
        this.extra.add(giro);
      }
      this.extra.position.set(0, -0.22, 0.03);
      this.bracos[1]?.add(this.extra);
    }
    if (r.marca === 'manchaNoPeito') this.esfera(this.corpo, 0xf2ead8, tx * 0.35, ty * 0.25, 0.02, 0, troncoY + ty * 0.3, tz * 0.98, 12);
    if (r.marca === 'caudaListrada') { /* o rabo do panda-vermelho já é listrado; a marca escurece as listras */ }
  }

  /** o boné (a aba para trás no Beto) */
  private montarBone(cor: number, virado: boolean): void {
    const [cx, cy] = this.plano.cranio;
    const bone = new THREE.Group();
    bone.position.set(0, cy * 0.3, 0);
    const copa = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), this.mat(cor));
    copa.scale.set(cx * 1.04, cy * 0.85, cx * 1.04);
    bone.add(copa);
    this.esfera(bone, tom(cor, 0.8), 0.014, 0.01, 0.014, 0, cy * 0.85, 0, 8);
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(cx * 0.62, cx * 0.62, 0.012, 18, 1, false, 0, Math.PI), this.mat(tom(cor, 0.85)));
    aba.position.set(0, 0.004, virado ? -cx * 0.9 : cx * 0.9);
    aba.rotation.y = virado ? Math.PI : 0;
    aba.rotation.x = virado ? 0.15 : -0.15;
    aba.scale.z = 0.9;
    bone.add(aba);
    this.cabeca.add(bone);
  }

  /** o PENTEADO DO DIA da alpaca: lã de verdade, em bolotas */
  private montarPenteado(cabelo: string): void {
    const [cx, cy, cz] = this.plano.cranio;
    const la = tom(this.pelo, 1.12);
    const h = this.cabeca;
    const bolota = (x: number, y: number, z: number, r: number): void => { this.esfera(h, la, r, r, r, x, y, z, 10); };
    // a base de lã sempre: a calota em cima
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      bolota(Math.cos(a) * cx * 0.55, cy * 0.85, Math.sin(a) * cz * 0.5, 0.045);
    }
    switch (cabelo) {
      case 'franja':
        for (let i = -2; i <= 2; i++) bolota(i * 0.03, cy * 0.62, cz * 0.82, 0.04);
        break;
      case 'coque':
      case 'cocoAlto': {
        const alto = cabelo === 'cocoAlto' ? 0.26 : 0.16;
        for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; bolota(Math.cos(a) * 0.04, cy + alto, Math.sin(a) * 0.04 - 0.02, 0.045); }
        bolota(0, cy + alto + 0.045, -0.02, 0.045);
        if (cabelo === 'cocoAlto') for (let k = 0; k < 2; k++) bolota(0, cy + 0.07 + k * 0.07, -0.02, 0.035);
        break;
      }
      case 'trancas':
      case 'tranca':
        for (const lado of cabelo === 'trancas' ? [-1, 1] : [1]) for (let k = 0; k < 5; k++) bolota(lado * cx * 1.0, cy * 0.4 - k * 0.055, -0.01 + k * 0.012, 0.03 - k * 0.002);
        break;
      case 'blackPower':
        for (let i = 0; i < 26; i++) {
          const y = 1 - (i / 25) * 1.2;
          const rr = Math.sqrt(Math.max(0, 1 - y * y));
          const a = i * 2.4;
          bolota(Math.cos(a) * rr * cx * 1.5, cy * 0.7 + y * cy * 0.9, Math.sin(a) * rr * cz * 1.3 - 0.03, 0.06);
        }
        break;
      case 'moicano':
        for (let k = 0; k < 6; k++) bolota(0, cy * 1.05 + Math.sin((k / 5) * Math.PI) * 0.1, cz * 0.7 - k * 0.06, 0.04);
        break;
      case 'trofeu': {
        // o troféu dourado em cima do penteado (o dia em que ela ganhou o concurso de penteado)
        const taca = new THREE.Mesh(new THREE.LatheGeometry([
          new THREE.Vector2(0.04, 0), new THREE.Vector2(0.015, 0.02), new THREE.Vector2(0.012, 0.05), new THREE.Vector2(0.06, 0.12), new THREE.Vector2(0.055, 0.125),
        ], 16), toon(0xe8c24a, { doubleSide: true }));
        taca.position.set(0, cy * 1.0, -0.01);
        h.add(taca);
        break;
      }
    }
  }

  /** o NETINHO da Dona Preguiça: uma preguicinha agarrada no colo dela */
  private montarNetinho(troncoY: number): void {
    const [, ty, tz] = this.plano.tronco;
    const n = new THREE.Group();
    n.name = 'netinho';
    n.position.set(0.02, troncoY + ty * 0.05, tz * 1.05);
    this.esfera(n, this.pelo, 0.055, 0.065, 0.05, 0, 0, 0.01, 14);
    const cabeca = new THREE.Group();
    cabeca.position.set(0, 0.08, 0.025);
    this.esfera(cabeca, this.pelo, 0.055, 0.05, 0.05, 0, 0, 0, 14);
    this.esfera(cabeca, tom(this.pelo, 1.25), 0.042, 0.035, 0.02, 0, -0.005, 0.04, 12);
    for (const lado of [-1, 1]) {
      this.esfera(cabeca, 0x4a3428, 0.016, 0.008, 0.006, lado * 0.02, 0.008, 0.052, 8);
      this.esfera(cabeca, 0x231c1c, 0.006, 0.008, 0.003, lado * 0.02, 0.01, 0.056, 6);
      // os bracinhos abraçando a avó
      this.tubo(n, this.pelo, [[lado * 0.04, 0.03, 0.02], [lado * 0.09, 0.05, -0.02], [lado * 0.12, 0.05, -0.07]], 0.014, 8);
    }
    n.add(cabeca);
    this.corpo.add(n);
  }

  // ================================================================ o que se mexe

  private nomearOQueSeMexe(): void {
    this.corpo.name = 'corpo-do-visitante';
    this.pernas.forEach((p, i) => { p.name = `perna-${i}`; });
    this.bracos.forEach((b, i) => { b.name = `braco-${i}`; });
    this.olhos.forEach((o, i) => { o.name = `olho-${i}`; });
    if (!this.extra.name) this.extra.name = 'extra';
  }

  protected animar(dt: number, { andando, fase }: PoseDoBicho): void {
    this.relogio += dt;
    const t = this.relogio;
    const lento = this.ficha === 'preguica' ? 0.5 : 1;
    // ---- andar: as pernas e os braços em oposição, o corpo subindo a cada passo
    const passo = andando ? Math.sin(fase * 9 * lento) : 0;
    this.pernas.forEach((p, i) => { p.rotation.x += ((i ? -1 : 1) * passo * 0.55 - p.rotation.x) * Math.min(1, dt * 10); });
    this.respiro = Math.sin(t * 2.1 * lento) * 0.012;
    this.corpo.position.y = andando ? Math.abs(Math.sin(fase * 9 * lento)) * 0.02 : 0;
    this.corpo.scale.y = this.corpo.scale.x * (1 + this.respiro);

    // ---- a piscada
    this.piscada -= dt;
    const fechado = this.piscada < 0.12 && this.piscada > 0;
    if (this.piscada <= 0) this.piscada = 2.5 + ((t * 7.3) % 3);
    for (const o of this.olhos) o.scale.y = fechado ? 0.15 : 1;

    // ---- os braços: balançam andando, e o TIQUE de cada um quando parado
    const [bd, be] = this.bracos;
    let alvoD = { x: andando ? -passo * 0.4 : 0, z: -0.18 };
    let alvoE = { x: andando ? passo * 0.4 : 0, z: 0.18 };
    let cabecaX = Math.sin(t * 0.7) * 0.04;
    let cabecaZ = Math.sin(t * 0.45) * 0.05;
    const ciclo = (t % 6) / 6;
    const noTique = !andando && ciclo > 0.55;
    const k = noTique ? Math.sin(((ciclo - 0.55) / 0.45) * Math.PI) : 0;
    switch (this.tique) {
      case 'abanar':
        // o Seu Hipólito se abana com a carteirinha
        alvoD = { x: -1.2 * k, z: -0.3 + Math.sin(t * 14) * 0.25 * k };
        break;
      case 'cabelo':
        // a vaidosa ajeita o penteado
        alvoE = { x: -2.2 * k, z: 0.6 * k };
        cabecaZ += Math.sin(t * 3) * 0.08 * k;
        break;
      case 'pe':
        // o Bento bate o pé, de relógio na mão
        if (!andando) this.pernas[1].rotation.x = -Math.max(0, Math.sin(t * 9)) * 0.25 * k;
        alvoE = { x: -1.3 * k, z: 0.5 * k };
        break;
      case 'chiclete': {
        // o Beto faz a bola de chiclete crescer… e estourar
        const bola = noTique ? Math.min(1, (ciclo - 0.55) / 0.4) : 0;
        this.extra.scale.setScalar(bola < 0.98 ? 0.2 + bola * 1.1 : 0.01);
        alvoD = { x: -0.2, z: -0.35 };
        break;
      }
      case 'celular':
        // o Tatá não larga o celular
        alvoD = { x: -1.1 - 0.2 * k, z: -0.25 };
        cabecaX = 0.25;
        break;
      case 'bocejo':
        // a vovó boceja devagar
        cabecaX = -0.25 * k;
        alvoE = { x: -1.5 * k, z: 0.3 };
        break;
      case 'pedrinha':
        alvoE = { x: -1.0 - Math.abs(Math.sin(t * 6)) * 0.4 * k, z: 0.2 };
        break;
      case 'teimoso':
        // o bode bate o casco e balança a cabeça (o sino tilinta)
        cabecaZ += Math.sin(t * 10) * 0.12 * k;
        break;
      case 'cochilo':
        // o coala cochila em pé: a cabeça vai caindo… e volta num susto
        cabecaX = 0.3 * k;
        break;
      case 'esconder':
        // o panda-vermelho se encolhe atrás do rabo
        cabecaX = 0.2 * k;
        this.cabeca.position.y += 0;
        break;
      case 'leque':
        // o texugo de braços cruzados, abanando o leque
        alvoD = { x: -1.0, z: 0.95 };
        alvoE = { x: -1.2, z: -0.4 + Math.sin(t * 12) * 0.3 };
        break;
    }
    const suave = Math.min(1, dt * 6);
    if (bd) { bd.rotation.x += (alvoD.x - bd.rotation.x) * suave; bd.rotation.z += (alvoD.z - bd.rotation.z) * suave; }
    if (be) { be.rotation.x += (alvoE.x - be.rotation.x) * suave; be.rotation.z += (alvoE.z - be.rotation.z) * suave; }
    this.cabeca.rotation.x += (cabecaX - this.cabeca.rotation.x) * suave;
    this.cabeca.rotation.z += (cabecaZ - this.cabeca.rotation.z) * suave;
    this.rabo.rotation.y = Math.sin(t * 2.4) * 0.15;
  }
}

/** quanto os olhos se afastam do meio, por espécie (o ângulo na casca do crânio) */
const OLHO_AFASTADO = { hipopotamo: 0.42, alpaca: 0.4, porquinho: 0.36, tamandua: 0.42, preguica: 0.4, lontra: 0.36, bode: 0.45, coala: 0.36, pandaVermelho: 0.36, texugo: 0.42 };

/** a roupa de cada um (quem não tem, é o pelo) */
interface Roupa {
  cor: number;
  manga?: number;
  calca?: number;
  camisa?: number;
}
const ROUPA: Readonly<Record<string, Roupa>> = {
  bento: { cor: P.portariaColete, manga: P.portariaCamisa, camisa: P.portariaCamisa },
  beto: { cor: P.portariaCamisetaBeto, manga: P.portariaCamisetaBeto },
  tata: { cor: P.portariaPapita },
};

/** o tique de cada ficha (e o da espécie, para os figurantes) */
const TIQUES: Readonly<Record<string, Tique>> = {
  hipolito: 'abanar', alpacina: 'cabelo', alpacona: 'cabelo', bento: 'pe', beto: 'chiclete', tata: 'celular',
  preguica: 'bocejo', lontra: 'pedrinha', bode: 'teimoso', coala: 'cochilo', pandaVermelho: 'esconder', texugo: 'leque',
};
