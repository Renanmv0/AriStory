import * as THREE from 'three';
import { brilhoDeLuz, line, toon } from '../../core/materials';
import { neon } from '../../core/shaders';
import { PALETTE as P } from '../../palette';
import { pedestal, rotulo, semSombra } from './comum';

/**
 * ===================================== ESTAÇÃO DE FUNDAMENTOS: o sistema solar
 *
 * A skill de fundamentos é sobre a HIERARQUIA de `Object3D`: todo objeto
 * mora dentro de outro, e a posição dele é sempre em relação ao pai. Um
 * sistema solar é o exemplo de livro, e aqui ele é do casal:
 *
 *   sol
 *   ├── órbita do Ari ── planeta Ari (com anel)
 *   └── órbita do Renan ── planeta Renan
 *                           └── órbita da lua ── lua Pelusa (com orelhinha)
 *
 * NENHUM planeta calcula seno e cosseno. Cada "órbita" é um grupo vazio no
 * centro do pai, e girar o grupo carrega o filho junto, na distância em que
 * ele foi posto. A lua faz a volta dela em torno do Renan enquanto o Renan faz
 * a dele em torno do sol — duas rotações empilhadas, e a conta de onde a lua
 * está no MUNDO é o three que faz, multiplicando as matrizes da linhagem.
 *
 * Os EIXOS (`AxesHelper`: vermelho X, verde Y, azul Z) mostram o referencial
 * de cada nível: o do sol fica parado, o do planeta Renan gira com a órbita, e
 * o da lua gira dentro de um referencial que já está girando.
 */
export interface SistemaSolar {
  grupo: THREE.Group;
  tique(dt: number): void;
  /** liga/desliga os eixos de cada referencial */
  mostrarEixos(ligar: boolean): void;
  readonly eixosVisiveis: boolean;
  /** multiplica a passagem do tempo (1 = normal) */
  velocidade: number;
  readonly planetas: { ari: THREE.Object3D; renan: THREE.Object3D; lua: THREE.Object3D };
}

/** a altura do plano das órbitas: acima da cabeça de quem anda por baixo */
const ALTURA = 2.75;

function circulo(raio: number, cor: number): THREE.LineLoop {
  const pontos: THREE.Vector3[] = [];
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    pontos.push(new THREE.Vector3(Math.cos(a) * raio, 0, Math.sin(a) * raio));
  }
  return semSombra(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pontos), line(cor)));
}

export function sistemaSolar(): SistemaSolar {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'sistema-solar';

  // o pilar que segura o sol, e o sol em cima dele
  grupo.add(pedestal(0.5, ALTURA - 0.95, P.labPedestal, P.labSol));

  const sol = new THREE.Group();
  sol.name = 'sol';
  sol.position.y = ALTURA;
  grupo.add(sol);
  const esfera = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 20), neon(P.labSol, 1.15));
  sol.add(semSombra(esfera));
  const halo = new THREE.Sprite(brilhoDeLuz(P.labSol, 0.45));
  halo.scale.setScalar(1.9);
  sol.add(semSombra(halo));

  // ------------------------------------------------------- o planeta Ari
  const orbitaAri = new THREE.Group();
  orbitaAri.name = 'orbita-ari';
  sol.add(orbitaAri);
  sol.add(circulo(1.9, P.labCiano));
  const planetaAri = new THREE.Group();
  planetaAri.position.x = 1.9;
  orbitaAri.add(planetaAri);
  const corpoAri = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), toon(P.labPlanetaAri));
  planetaAri.add(corpoAri);
  // o anel, inclinado: é filho do planeta, então viaja com ele sem conta nenhuma
  const anel = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.56, 48), toon(P.labAmarelo, { doubleSide: true }));
  anel.rotation.x = -Math.PI / 2 + 0.45;
  planetaAri.add(anel);
  const nomeAri = rotulo('Ari', P.labLaranja, 1.0);
  nomeAri.position.y = 0.62;
  planetaAri.add(nomeAri);

  // ----------------------------------------------------- o planeta Renan
  const orbitaRenan = new THREE.Group();
  orbitaRenan.name = 'orbita-renan';
  orbitaRenan.rotation.y = 2.1;
  sol.add(orbitaRenan);
  sol.add(circulo(3.05, P.labRoxo));
  const planetaRenan = new THREE.Group();
  planetaRenan.position.x = 3.05;
  orbitaRenan.add(planetaRenan);
  const corpoRenan = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16), toon(P.labPlanetaRenan));
  planetaRenan.add(corpoRenan);
  // uma faixa clara no equador, para o giro do planeta aparecer
  const faixa = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 6, 40), toon(P.labRoxo));
  faixa.rotation.x = Math.PI / 2;
  corpoRenan.add(faixa);
  const nomeRenan = rotulo('Renan', P.labRoxo, 1.15);
  nomeRenan.position.y = 0.72;
  planetaRenan.add(nomeRenan);

  // ------------------------------------------- a lua Pelusa, em volta do Renan
  const orbitaLua = new THREE.Group();
  orbitaLua.name = 'orbita-lua';
  planetaRenan.add(orbitaLua);
  planetaRenan.add(circulo(0.72, P.labLuaPelusa));
  const lua = new THREE.Group();
  lua.position.x = 0.72;
  orbitaLua.add(lua);
  const corpoLua = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), toon(P.labLuaPelusa));
  lua.add(corpoLua);
  // as orelhinhas: é a lua do gato, afinal
  for (const lado of [-1, 1] as const) {
    const orelha = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 4), toon(P.labMetal));
    orelha.position.set(lado * 0.065, 0.12, 0);
    orelha.rotation.z = -lado * 0.35;
    lua.add(orelha);
  }
  const nomeLua = rotulo('Pelusa', P.labLuaPelusa, 0.95);
  nomeLua.position.y = 0.4;
  lua.add(nomeLua);

  // ------------------------------------------------------------ os eixos
  const eixos: THREE.AxesHelper[] = [];
  for (const [pai, tamanho] of [[sol, 3.6], [planetaRenan, 0.95], [lua, 0.4]] as const) {
    const e = new THREE.AxesHelper(tamanho);
    e.visible = false;
    pai.add(semSombra(e));
    eixos.push(e);
  }

  let tempo = 0;
  const estacao: SistemaSolar = {
    grupo,
    velocidade: 1,
    get eixosVisiveis() {
      return eixos[0].visible;
    },
    planetas: { ari: planetaAri, renan: planetaRenan, lua },
    mostrarEixos(ligar) {
      for (const e of eixos) e.visible = ligar;
    },
    tique(dt) {
      tempo += dt * estacao.velocidade;
      // só GIROS. Nenhuma posição é recalculada aqui: quem leva cada planeta
      // pelo caminho é o pai dele
      orbitaAri.rotation.y = tempo * 0.55;
      corpoAri.rotation.y = tempo * 1.8;
      orbitaRenan.rotation.y = 2.1 + tempo * 0.33;
      corpoRenan.rotation.y = tempo * 1.2;
      orbitaLua.rotation.y = tempo * 2.1;
      corpoLua.rotation.y = -tempo * 0.8;
    },
  };
  return estacao;
}
