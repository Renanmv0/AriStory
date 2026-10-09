import * as THREE from 'three';
import { toon } from '../../core/materials';
import { neon } from '../../core/shaders';
import type { SomNome } from '../../audio/efeitos';
import { PALETTE as P } from '../../palette';
import { Mola, pedestal, semSombra } from './comum';

/**
 * ===================================== ESTAÇÃO DE INTERAÇÃO
 *
 * O jogo é de teclado e joystick: chegar perto e apertar E. Aqui o mouse (e o
 * dedo) mexe no mundo direto, pelo `Raycaster` do motor (`core/Apontador.ts`):
 *
 *  - o XILOFONE: sete cristais. Passar o mouse acende o cristal e mostra o
 *    nome dele numa dica que flutua em cima (a posição 3D convertida para a
 *    tela, quadro a quadro); clicar faz ele pular numa MOLA e tocar um dos
 *    sons do jogo;
 *  - a BOLA DE PRAIA: arrastar com o mouse ou o dedo. O raio é cruzado com o
 *    plano do chão, e a bola rola de verdade — gira em volta do eixo deitado
 *    perpendicular ao movimento, o quanto andou dividido pelo raio;
 *  - o CONSOLE DO DRONE: entrega a câmera para o mouse (`OrbitControls`).
 */

export interface Cristal {
  readonly obj: THREE.Group;
  readonly nome: string;
  readonly som: SomNome;
  /** clicado: pula e gira */
  tocar(): void;
  /** o mouse está em cima */
  acender(ligado: boolean): void;
  readonly aceso: boolean;
  /** quantas vezes já foi tocado (o teste confere) */
  readonly toques: number;
}

export interface Xilofone {
  grupo: THREE.Group;
  readonly cristais: readonly Cristal[];
  tique(dt: number): void;
}

/** cada cristal com uma cor e um som do jogo — todos sintetizados na hora */
const CRISTAIS: ReadonlyArray<{ nome: string; cor: number; som: SomNome }> = [
  { nome: 'o sino', cor: P.labVermelho, som: 'sino' },
  { nome: 'a gota', cor: P.labLaranja, som: 'pingo' },
  { nome: 'a bolha', cor: P.labAmarelo, som: 'bolha' },
  { nome: 'o arco-íris', cor: P.labVerde, som: 'arcoIris' },
  { nome: 'o coração', cor: P.labCiano, som: 'coracao' },
  { nome: 'a mira', cor: P.labAzul, som: 'mira' },
  { nome: 'o estouro', cor: P.labRoxo, som: 'estouro' },
];

export function xilofone(): Xilofone {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'xilofone-de-cristais';
  const cristais: Cristal[] = [];
  const molas: Array<{ pulo: Mola; giro: Mola; corpo: THREE.Mesh }> = [];

  CRISTAIS.forEach((ficha, i) => {
    const obj = new THREE.Group();
    // em arco, abrindo para a câmera
    const a = (i / (CRISTAIS.length - 1) - 0.5) * 1.9;
    obj.position.set(Math.sin(a) * 3.1, 0, -Math.cos(a) * 1.4);
    grupo.add(obj);
    obj.add(pedestal(0.26, 0.55 + i * 0.07, P.labPedestal, ficha.cor));
    const corpo: THREE.Mesh<THREE.BufferGeometry, THREE.Material> = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.26, 0),
      toon(ficha.cor, { glow: 0.2 }),
    );
    corpo.scale.y = 1.55;
    const base = 0.55 + i * 0.07 + 0.48;
    corpo.position.y = base;
    obj.add(corpo);

    const pulo = new Mola(0, 140, 7);
    const giro = new Mola(0, 60, 5);
    molas.push({ pulo, giro, corpo });
    let aceso = false;
    let toques = 0;
    cristais.push({
      obj,
      nome: ficha.nome,
      som: ficha.som,
      get aceso() {
        return aceso;
      },
      get toques() {
        return toques;
      },
      tocar() {
        toques++;
        pulo.empurrar(4.2);
        giro.empurrar(9);
      },
      acender(ligado) {
        aceso = ligado;
        corpo.material = ligado ? neon(ficha.cor, 1.5) : toon(ficha.cor, { glow: 0.2 });
      },
    });
    corpo.userData.base = base;
  });

  let tempo = 0;
  return {
    grupo,
    cristais,
    tique(dt) {
      tempo += dt;
      molas.forEach(({ pulo, giro, corpo }, i) => {
        const y = pulo.tique(dt);
        corpo.position.y = (corpo.userData.base as number) + Math.max(-0.05, y * 0.12) + Math.sin(tempo * 1.6 + i) * 0.03;
        corpo.rotation.y = tempo * 0.5 + giro.tique(dt) * 0.4 + i;
      });
    },
  };
}

// ----------------------------------------------------------- a bola de praia

export interface BolaDePraia {
  grupo: THREE.Group;
  readonly raio: number;
  /** leva a bola até (x, z) do MUNDO, rolando; a cena limita a área antes */
  rolarAte(x: number, z: number): void;
  /** um quique quando a mão solta */
  soltar(): void;
  tique(dt: number): void;
}

export function bolaDePraia(): BolaDePraia {
  const RAIO = 0.42;
  const grupo = new THREE.Group();
  grupo.userData.peca = 'bola-de-praia';
  const giro = new THREE.Group();
  giro.position.y = RAIO;
  grupo.add(giro);
  // seis gomos: a MESMA esfera, cada uma com um pedaço do ângulo (phiStart e
  // phiLength do `SphereGeometry`) — é a costura da bola de praia
  const cores = [P.labVermelho, P.labBranco, P.labAzul, P.labBranco, P.labAmarelo, P.labBranco];
  cores.forEach((cor, i) => {
    const gomo = new THREE.Mesh(
      new THREE.SphereGeometry(RAIO, 10, 16, (i / 6) * Math.PI * 2, Math.PI / 3),
      toon(cor),
    );
    giro.add(gomo);
  });
  for (const lado of [-1, 1] as const) {
    const tampa = new THREE.Mesh(new THREE.SphereGeometry(RAIO * 0.24, 12, 8), toon(P.labBranco));
    tampa.position.y = lado * RAIO * 0.92;
    tampa.scale.y = 0.4;
    giro.add(tampa);
  }

  const quique = new Mola(0, 90, 6);
  const eixo = new THREE.Vector3();
  const volta = new THREE.Quaternion();
  return {
    grupo,
    raio: RAIO,
    rolarAte(x, z) {
      const dx = x - grupo.position.x;
      const dz = z - grupo.position.z;
      const andou = Math.hypot(dx, dz);
      if (andou < 1e-5) return;
      // rolar: o eixo é o chão perpendicular ao passo, o ângulo é passo / raio
      eixo.set(dz, 0, -dx).normalize();
      volta.setFromAxisAngle(eixo, andou / RAIO);
      giro.quaternion.premultiply(volta);
      grupo.position.x = x;
      grupo.position.z = z;
    },
    soltar() {
      quique.empurrar(3.2);
    },
    tique(dt) {
      giro.position.y = RAIO + Math.max(0, quique.tique(dt) * 0.25);
    },
  };
}

// --------------------------------------------------------- o console do drone

export interface ConsoleDoDrone {
  grupo: THREE.Group;
  tique(dt: number): void;
}

export function consoleDoDrone(): ConsoleDoDrone {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'console-do-drone';
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.95, 0.6), toon(P.labPedestal));
  corpo.position.y = 0.475;
  grupo.add(corpo);
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.7), toon(P.labPedestalClaro));
  tampo.position.y = 0.99;
  tampo.rotation.x = 0.25;
  grupo.add(tampo);
  // o manche
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.22, 8), toon(P.labMetal));
  haste.position.set(-0.18, 1.12, 0.05);
  grupo.add(haste);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), neon(P.labVermelho, 2));
  bola.position.set(-0.18, 1.24, 0.05);
  grupo.add(semSombra(bola));
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), neon(P.labCiano, 1.2));
  tela.position.set(0.2, 1.06, 0.02);
  tela.rotation.x = -Math.PI / 2 + 0.25;
  grupo.add(semSombra(tela));

  // o drone de enfeite, pairando em cima do console com as quatro hélices
  const drone = new THREE.Group();
  drone.position.y = 2.1;
  grupo.add(drone);
  const casco = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.34), toon(P.labBranco));
  drone.add(casco);
  const olho = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), neon(P.labCiano, 2.4));
  olho.position.set(0, -0.04, 0.17);
  drone.add(semSombra(olho));
  const helices: THREE.Mesh[] = [];
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const braco = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.3), toon(P.labMetal));
    braco.position.set(x * 0.15, 0, z * 0.15);
    braco.rotation.y = Math.atan2(x, z);
    drone.add(braco);
    const helice = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.01, 0.04), toon(P.labPedestalClaro));
    helice.position.set(x * 0.24, 0.06, z * 0.24);
    drone.add(helice);
    helices.push(helice);
  }

  let tempo = 0;
  return {
    grupo,
    tique(dt) {
      tempo += dt;
      drone.position.y = 2.1 + Math.sin(tempo * 2.2) * 0.12;
      drone.rotation.y = Math.sin(tempo * 0.5) * 0.6;
      drone.rotation.z = Math.sin(tempo * 1.3) * 0.08;
      helices.forEach((h, i) => (h.rotation.y = tempo * 38 * (i % 2 ? 1 : -1)));
    },
  };
}
