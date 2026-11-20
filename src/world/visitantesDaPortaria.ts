/**
 * OS VISITANTES DA PORTARIA EM 3D — quem anda na fila e para no balcão.
 *
 * ETAPA 1 DA CENA (`docs/PORTARIA-DO-CLUBE.md`): quem já tem modelo no jogo
 * (a Josefina, o Noel, o Capy, o Jean-Luc, a Estella, o Mano, o Cookie, o
 * Gatito, a Tia Liz, as três irmãs, o Flynn, o Rocco, a Valentina e o Pietro)
 * vem com o modelo de verdade, pela classe dele; os NOVOS (o Seu Hipólito, a
 * Dona Alpacina, o Bento, o Tatá, os figurantes…) ainda são um SUBSTITUTO
 * declarado: um recorte de papelão pintado com o retrato da ficha, de pé numa
 * base. A etapa 2 troca o recorte por um bicho modelado e dá a cada um a
 * animação dele (a ficha já diz qual).
 *
 * O ROSTO QUE SE JULGA NÃO É ESTE: é o `Visitante.rosto` pintado pelo
 * `pintarRetrato` na mesa (o mesmo pintor e a mesma escala da foto). O 3D é o
 * cenário vivo — por isso um disfarce do Jean-Luc ainda não aparece no corpo
 * dele aqui, e aparece no rosto da mesa.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { recortePintado, toon } from '../core/materials';
import type { Bicho, AreaDoBicho } from '../entities/bichos/Bicho';
import { Capy } from '../entities/bichos/Capy';
import { Cookie } from '../entities/bichos/Cookie';
import { Estella } from '../entities/bichos/Estella';
import { Estrella, Luna, Sol } from '../entities/bichos/CoelhaDaTorcida';
import { Flynn } from '../entities/bichos/Flynn';
import { Gatito } from '../entities/bichos/Gatito';
import { JeanLuc } from '../entities/bichos/JeanLuc';
import { Josefina } from '../entities/bichos/Josefina';
import { Mano } from '../entities/bichos/Mano';
import { Noel } from '../entities/bichos/Noel';
import { Pavao } from '../entities/bichos/Pavao';
import { Rocco } from '../entities/bichos/Rocco';
import { TiaLiz } from '../entities/bichos/TiaLiz';
import { Valentina } from '../entities/bichos/Valentina';
import type { Retrato } from '../minigames/portaria/tipos';
import { macia, por } from './moveisDaBoutique';
import { PELAGEM, pintarRetrato } from './papeisDaPortaria';

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

/** a figura inteira pintada: a cabeça pelo retrato, o corpo na pelagem, e a borda branca de adesivo */
function pintarFigura(r: Retrato): HTMLCanvasElement {
  const L = 256;
  const A = 512;
  const fig = document.createElement('canvas');
  fig.width = L;
  fig.height = A;
  const c = fig.getContext('2d')!;
  const pelo = PELAGEM[r.cor] ?? P.peloCaramelo;
  const cor = `#${pelo.toString(16).padStart(6, '0')}`;
  c.lineJoin = 'round';
  c.strokeStyle = 'rgba(40,30,30,0.55)';
  c.lineWidth = 3;
  // as pernas e os pés
  for (const lado of [-1, 1]) {
    c.fillStyle = cor;
    c.beginPath(); c.roundRect(L / 2 + lado * 34 - 20, 330, 40, 140, 18); c.fill(); c.stroke();
    c.fillStyle = 'rgba(40,30,30,0.75)';
    c.beginPath(); c.ellipse(L / 2 + lado * 36, 470, 30, 14, 0, 0, Math.PI * 2); c.fill();
  }
  // os braços
  for (const lado of [-1, 1]) {
    c.fillStyle = cor;
    c.beginPath(); c.roundRect(L / 2 + lado * 80 - 18, 230, 36, 130, 16); c.fill(); c.stroke();
  }
  // o corpo
  c.fillStyle = cor;
  c.beginPath(); c.ellipse(L / 2, 300, 78, 100, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.35)';
  c.beginPath(); c.ellipse(L / 2, 315, 46, 64, 0, 0, Math.PI * 2); c.fill();
  // a cabeça (o retrato sem o fundo de estúdio, por cima dos ombros)
  pintarRetrato(c, 0, 0, L, 256, r, { fundo: false });
  // a borda de adesivo: a figura engordada em branco por trás
  const tela = document.createElement('canvas');
  tela.width = L;
  tela.height = A;
  const t = tela.getContext('2d')!;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    t.drawImage(fig, Math.cos(a) * 7, Math.sin(a) * 7);
  }
  t.globalCompositeOperation = 'source-in';
  t.fillStyle = '#fbf7ec';
  t.fillRect(0, 0, L, A);
  t.globalCompositeOperation = 'source-over';
  t.drawImage(fig, 0, 0);
  return tela;
}

/** O RECORTE de papelão: o substituto declarado dos visitantes novos (etapa 2 troca) */
class VisitanteDeRecorte implements ModeloDeVisitante {
  readonly deVerdade = false;
  readonly group = new THREE.Group();
  private readonly textura: THREE.CanvasTexture;
  private readonly material: THREE.Material;
  private readonly figura = new THREE.Group();
  private missao: { x: number; z: number; vel: number; pronto: () => void } | null = null;
  private alvo: { x: number; z: number } | null = null;
  private fase = Math.random() * 6;
  private andando = 0;

  constructor(retrato: Retrato) {
    this.textura = new THREE.CanvasTexture(pintarFigura(retrato));
    this.textura.colorSpace = THREE.SRGBColorSpace;
    const ALTO = 1.62;
    const LARGO = ALTO / 2;
    const mat = recortePintado(this.textura);
    this.material = mat;
    const placa = new THREE.Mesh(new THREE.PlaneGeometry(LARGO, ALTO), mat);
    placa.position.y = ALTO / 2 + 0.05;
    this.figura.add(placa);
    // a base de madeira e o pé de papelão atrás
    por(this.group, macia(0.36, 0.05, 0.2, 0.012), toon(P.woodDark), 0, 0.025, -0.02);
    const pe = por(this.figura, macia(0.04, 0.9, 0.012, 0.004), toon(P.papelaoEscuro), 0, 0.5, -0.12);
    pe.rotation.x = -0.25;
    this.group.add(this.figura);
  }

  irPara(x: number, z: number, velocidade = 1.3): Promise<void> {
    this.alvo = null;
    return new Promise((pronto) => {
      this.missao = { x, z, vel: velocidade, pronto };
    });
  }

  encarar(x: number, z: number): void {
    this.alvo = { x, z };
  }

  update(dt: number): void {
    this.fase += dt;
    const m = this.missao;
    const g = this.group;
    if (m) {
      const dx = m.x - g.position.x;
      const dz = m.z - g.position.z;
      const d = Math.hypot(dx, dz);
      const passo = m.vel * dt;
      g.rotation.y = Math.atan2(dx, dz);
      if (d <= passo) {
        g.position.x = m.x;
        g.position.z = m.z;
        this.missao = null;
        m.pronto();
      } else {
        g.position.x += (dx / d) * passo;
        g.position.z += (dz / d) * passo;
      }
      this.andando = Math.min(1, this.andando + dt * 4);
    } else {
      this.andando = Math.max(0, this.andando - dt * 4);
      if (this.alvo) {
        const alvo = Math.atan2(this.alvo.x - g.position.x, this.alvo.z - g.position.z);
        let d = alvo - g.rotation.y;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        g.rotation.y += d * Math.min(1, dt * 4);
      }
    }
    // o recorte "anda" saltitando e balançando; parado, respira
    const k = this.andando;
    this.figura.position.y = Math.abs(Math.sin(this.fase * 7)) * 0.06 * k + Math.sin(this.fase * 1.6) * 0.004;
    this.figura.rotation.z = Math.sin(this.fase * 7) * 0.06 * k;
  }

  dispose(): void {
    this.textura.dispose();
    this.material.dispose();
  }
}

/** o visitante em 3D de uma ficha (o rosto só serve ao recorte) */
export function modeloDoVisitante(ficha: string, rosto: Retrato): ModeloDeVisitante {
  const classe = CLASSES[ficha];
  return classe ? new VisitanteDeVerdade(classe(AREA)) : new VisitanteDeRecorte(rosto);
}

/** quanto o alto da cabeça do visitante deve chegar, para o rosto cair no meio do guichê */
export const ALTO_DO_ROSTO = 1.95;

/** a altura do elevador para um modelo: o que falta para o alto da cabeça chegar ao `ALTO_DO_ROSTO` */
export function alturaDoElevador(modelo: THREE.Object3D): number {
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
