/**
 * OS VISITANTES DA PORTARIA EM 3D — quem anda na fila e para no balcão.
 *
 * Quem já tem modelo no jogo (a Josefina, o Noel, o Capy, o Jean-Luc, a
 * Estella, o Mano, o Cookie, o Gatito, a Tia Liz, as três irmãs, o Flynn, o
 * Rocco, a Valentina e o Pietro) vem pela classe dele; os Dogões, pela ficha
 * de atleta do time (`FICHA_DO_DOGAO`); e os NOVOS (o Seu Hipólito, as
 * alpacas, os gêmeos, o Tatá, a Dona Preguiça e os figurantes) pelo
 * `VisitanteDaPortaria`, montado pela foto do dia, cada um com o seu traço.
 *
 * O ROSTO QUE SE JULGA é o `Visitante.rosto` pintado na mesa (o mesmo pintor
 * e a mesma escala da foto); o 3D é o mesmo bicho, vivo. O disfarce do
 * Jean-Luc ainda aparece só no rosto da mesa, e quem vem em grupo só na foto
 * da janela (o netinho é a exceção: vem no colo da avó).
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { Bicho, AreaDoBicho } from '../entities/bichos/Bicho';
import { Capy } from '../entities/bichos/Capy';
import { Cookie } from '../entities/bichos/Cookie';
import { Estella } from '../entities/bichos/Estella';
import { Estrella, Luna, Sol } from '../entities/bichos/CoelhaDaTorcida';
import { Flynn } from '../entities/bichos/Flynn';
import { VisitanteDaPortaria } from '../entities/bichos/VisitanteDaPortaria';
import { Gatito } from '../entities/bichos/Gatito';
import { JeanLuc } from '../entities/bichos/JeanLuc';
import { Josefina } from '../entities/bichos/Josefina';
import { Mano } from '../entities/bichos/Mano';
import { Noel } from '../entities/bichos/Noel';
import { Pavao } from '../entities/bichos/Pavao';
import { FICHA_DO_DOGAO, Rocco } from '../entities/bichos/Rocco';
import { TiaLiz } from '../entities/bichos/TiaLiz';
import { Valentina } from '../entities/bichos/Valentina';
import type { Retrato } from '../minigames/portaria/tipos';
import { macia, por } from './moveisDaBoutique';

/** um visitante em 3D: o grupo, o andar e o virar */
export interface ModeloDeVisitante {
  readonly group: THREE.Group;
  /** o modelo de verdade (a etapa 2 dá um para todo mundo) */
  readonly deVerdade: boolean;
  irPara(x: number, z: number, velocidade?: number): Promise<void>;
  encarar(x: number, z: number): void;
  update(dt: number): void;
  dispose(): void;
}

/** a área do bicho na portaria: grande, porque é a cena que manda (de serviço ele não sorteia passeio) */
const AREA: AreaDoBicho = { minX: -40, maxX: 40, minZ: -40, maxZ: 40 };

/** as fichas que já têm modelo no jogo */
const CLASSES: Readonly<Record<string, (a: AreaDoBicho) => Bicho>> = {
  josefina: (a) => new Josefina(a),
  noel: (a) => new Noel(a),
  capy: (a) => new Capy(a),
  jeanluc: (a) => new JeanLuc(a),
  estella: (a) => new Estella(a),
  mano: (a) => new Mano(a),
  cookie: (a) => new Cookie(a),
  gatito: (a) => new Gatito(a),
  tializ: (a) => new TiaLiz(a),
  luna: (a) => new Luna(a),
  sol: (a) => new Sol(a),
  estrella: (a) => new Estrella(a),
  flynn: (a) => new Flynn(a),
  rocco: (a) => new Rocco(a),
  valentina: (a) => new Valentina(a),
  pietro: (a) => new Pavao(a),
};

/** quem tem modelo de verdade (o teste e a cena perguntam) */
export const temModelo = (ficha: string): boolean => ficha in CLASSES;

/** o bicho de verdade, de serviço */
class VisitanteDeVerdade implements ModeloDeVisitante {
  readonly deVerdade = true;
  readonly group: THREE.Group;
  constructor(private readonly bicho: Bicho) {
    this.group = bicho.group;
    bicho.entrarEmServico();
  }

  irPara(x: number, z: number, velocidade?: number): Promise<void> {
    this.bicho.pararDeEncarar();
    return this.bicho.irPara(x, z, velocidade);
  }

  encarar(x: number, z: number): void {
    this.bicho.encarar(x, z);
  }

  update(dt: number): void {
    this.bicho.update(dt);
  }

  dispose(): void {}
}

/**
 * O visitante em 3D de uma ficha: quem já existe no jogo, pela classe dele; os
 * Dogões, pela ficha de atleta do time; e os novos (`VisitanteDaPortaria`),
 * montados pela foto do dia — o netinho vem no colo da avó quando está no grupo.
 */
export function modeloDoVisitante(ficha: string, rosto: Retrato, grupo: readonly string[] = []): ModeloDeVisitante {
  const classe = CLASSES[ficha];
  if (classe) return new VisitanteDeVerdade(classe(AREA));
  if (ficha === 'dogoes') return new VisitanteDeVerdade(new Flynn(AREA, FICHA_DO_DOGAO));
  return new VisitanteDeVerdade(new VisitanteDaPortaria(AREA, ficha, rosto, grupo.includes('netinho')));
}

/** quanto o alto da cabeça do visitante deve chegar, para o rosto cair no meio do guichê */
export const ALTO_DO_ROSTO = 1.95;
/** e onde o MEIO do rosto deve ficar (quem sabe a altura do rosto, como os visitantes novos) */
export const MEIO_DO_ROSTO = 1.74;

/** a altura do elevador para um modelo: o que falta para o alto da cabeça chegar ao `ALTO_DO_ROSTO` */
export function alturaDoElevador(modelo: THREE.Object3D): number {
  // os visitantes novos dizem onde fica o rosto (o penteado da alpaca não pode empurrar a cara para baixo do balcão)
  const bicho = modelo.userData.bicho as { alturaDoRosto?: number } | undefined;
  if (bicho?.alturaDoRosto !== undefined) return Math.max(0, Math.min(1.45, MEIO_DO_ROSTO - bicho.alturaDoRosto));
  let topo = 0;
  modelo.updateMatrixWorld(true);
  const caixa = new THREE.Box3();
  modelo.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.visible) return;
    if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
    caixa.copy(m.geometry.boundingBox!).applyMatrix4(m.matrixWorld);
    topo = Math.max(topo, caixa.max.y - modelo.position.y);
  });
  return Math.max(0, Math.min(1.45, ALTO_DO_ROSTO - topo));
}

/**
 * O ELEVADOR DO BALCÃO: a guarita é de girafa — o balcão fica a 1,25 do chão,
 * na altura da cabeça da dupla, e quase todo visitante é menor que isso. Na
 * frente do guichê, um disco de madeira em cima de um pistão de três gomos
 * (o creme e o verde da guarita, a borda amarela de cuidado) sobe cada um até
 * o rosto ficar no meio do vidro; desce para ele sair. A Gina aperta o botão.
 */
export class ElevadorDoBalcao {
  readonly group = new THREE.Group();
  private readonly disco = new THREE.Group();
  private readonly gomos: THREE.Mesh[] = [];
  /** a altura do disco agora */
  altura = 0;
  private alvo = 0;
  private pronto: (() => void) | null = null;

  constructor() {
    this.group.name = 'elevador-do-balcao';
    const creme = toon(P.guaritaParede);
    const verde = toon(P.guaritaFaixa);
    const amarelo = toon(P.cancelaAmarela);
    const ferro = toon(P.portaoFerro);
    // a base no chão, com a sapata
    por(this.group, macia(1.0, 0.06, 1.0, 0.03), verde, 0, 0.03, 0);
    // os três gomos do pistão (o de baixo é o mais largo)
    for (let i = 0; i < 3; i++) {
      const r = 0.16 - i * 0.035;
      const gomo = por(this.group, new THREE.CylinderGeometry(r, r, 0.5, 20), i % 2 ? creme : toon(P.inox), 0, 0.3, 0);
      this.gomos.push(gomo);
    }
    // o disco: o tampo de madeira com a borda amarela e o corrimão em meia-lua atrás
    this.group.add(this.disco);
    por(this.disco, new THREE.CylinderGeometry(0.5, 0.5, 0.07, 36), toon(P.guaritaBalcao), 0, -0.035, 0);
    const borda = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.022, 8, 40), amarelo);
    borda.rotation.x = Math.PI / 2;
    borda.position.y = -0.01;
    this.disco.add(borda);
    const arco = (y: number): void => {
      const a = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.014, 6, 24, Math.PI), ferro);
      a.rotation.x = Math.PI / 2;
      // (a meia-volta fica do lado do balcão, o `−Z` do elevador, que olha para a rua)
      a.rotation.z = Math.PI;
      a.position.y = y;
      this.disco.add(a);
    };
    arco(0.42);
    arco(0.24);
    for (let i = 0; i <= 4; i++) {
      const a = Math.PI + (i / 4) * Math.PI;
      por(this.disco, new THREE.CylinderGeometry(0.014, 0.014, 0.44, 6), ferro, Math.cos(a) * 0.46, 0.21, Math.sin(a) * 0.46);
    }
  }

  /** sobe (ou desce) até `h`; resolve quando chegou */
  irPara(h: number): Promise<void> {
    this.pronto?.();
    this.alvo = h;
    return new Promise((pronto) => {
      this.pronto = pronto;
    });
  }

  update(dt: number): void {
    const d = this.alvo - this.altura;
    const passo = dt * 0.9;
    if (Math.abs(d) <= passo) {
      this.altura = this.alvo;
      if (this.pronto) {
        const p = this.pronto;
        this.pronto = null;
        p();
      }
    } else this.altura += Math.sign(d) * passo;
    const h = this.altura + 0.07;
    this.disco.position.y = h;
    // os gomos se esticam: cada um cobre um terço do caminho, um pouco por dentro do outro
    this.gomos.forEach((gomo, i) => {
      const alto = Math.max(0.05, (h - 0.06) / 3 + 0.04);
      gomo.scale.y = alto / 0.5;
      gomo.position.y = 0.06 + i * ((h - 0.06) / 3) + alto / 2 - (i ? 0.02 : 0);
    });
  }
}
