import * as THREE from 'three';
import { toon } from '../../core/materials';
import { neon } from '../../core/shaders';
import { PALETTE as P } from '../../palette';
import { pedestal, semSombra } from './comum';

/**
 * ===================================== ESTAÇÃO DE ANIMAÇÃO
 *
 * O jogo anima tudo À MÃO: a caminhada é um seno no ombro e no quadril
 * (`CharacterRig.update`). A skill de animação traz o sistema do próprio
 * three, e os três bichos daqui usam cada pedaço dele:
 *
 *  - o ROBÔ BIT tem quatro CLIPES (`AnimationClip`) escritos à mão com
 *    keyframes — posição, rotação (quaternion), escala e até a COR da tela do
 *    rosto. Um `AnimationMixer` toca, e a troca de dança é um CROSSFADE: um
 *    clipe vai sumindo enquanto o outro entra, sem tranco;
 *  - a COBRINHA é uma malha com OSSOS (`SkinnedMesh` + `Skeleton`): um tubo
 *    só, com quinze ossos em fila, e cada vértice sabe de quais dois ossos ele
 *    segue (o peso). Girar os ossos em onda é o que faz ela rastejar; a
 *    cabeça e as pintinhas estão PENDURADAS nos ossos e vão junto;
 *  - o CORAÇÃO tem um alvo de MORPH: a mesma malha guarda a forma de esfera e
 *    a forma de coração, e um número de 0 a 1 diz quanto de cada uma. O
 *    clipe dele anima esse número e a escala — vira coração e bate.
 */

// ----------------------------------------------------------------- o robô

const q = (x: number, y: number, z: number): number[] =>
  new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z)).toArray();

export type DancaDoRobo = 'parado' | 'acenar' | 'pular' | 'dancar';
const ORDEM: readonly DancaDoRobo[] = ['parado', 'acenar', 'pular', 'dancar'];

export interface Robo {
  grupo: THREE.Group;
  readonly danca: DancaDoRobo;
  /** crossfade para a próxima dança; devolve qual entrou */
  trocarDanca(): DancaDoRobo;
  readonly mixer: THREE.AnimationMixer;
  tique(dt: number): void;
}

export function robo(): Robo {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'robo-bit';
  // um palquinho redondo embaixo
  const palquinho = pedestal(0.75, 0.12, P.labPedestal, P.labVerde);
  grupo.add(palquinho);

  const raiz = new THREE.Group();
  raiz.position.y = 0.15;
  grupo.add(raiz);
  // `tudo` é quem pula e gira; as partes têm NOME porque é pelo nome que a
  // trilha do clipe acha a peça ("bracoD.quaternion", "rosto.material.color")
  const tudo = new THREE.Group();
  tudo.name = 'tudo';
  raiz.add(tudo);
  const branco = toon(P.labRobo);

  for (const lado of [-1, 1] as const) {
    const perna = new THREE.Group();
    perna.name = lado < 0 ? 'pernaE' : 'pernaD';
    perna.position.set(lado * 0.15, 0.42, 0);
    tudo.add(perna);
    const canela = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.24, 4, 8), branco);
    canela.position.y = -0.2;
    perna.add(canela);
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.24), toon(P.labPedestalClaro));
    pe.position.set(0, -0.38, 0.04);
    perna.add(pe);
  }

  const corpo = new THREE.Group();
  corpo.name = 'corpo';
  corpo.position.y = 0.42;
  tudo.add(corpo);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.5, 0.4), branco);
  torso.position.y = 0.27;
  corpo.add(torso);
  const painel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.02), neon(P.labVerde, 1.8));
  painel.position.set(0, 0.3, 0.205);
  corpo.add(semSombra(painel));

  const cabeca = new THREE.Group();
  cabeca.name = 'cabeca';
  cabeca.position.y = 0.55;
  corpo.add(cabeca);
  const caixa = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.46, 0.46), branco);
  caixa.position.y = 0.23;
  cabeca.add(caixa);
  // a tela do rosto tem material PRÓPRIO: a trilha de cor do clipe pinta o
  // material, e um material do cache do `toon()` pintaria o jogo inteiro
  const rosto = new THREE.Mesh(
    new THREE.PlaneGeometry(0.48, 0.3),
    new THREE.MeshBasicMaterial({ color: P.labRoboTela }),
  );
  rosto.name = 'rosto';
  rosto.position.set(0, 0.24, 0.232);
  cabeca.add(semSombra(rosto));
  const olhos = new THREE.Group();
  olhos.name = 'olhos';
  olhos.position.set(0, 0.26, 0.236);
  cabeca.add(olhos);
  for (const lado of [-1, 1] as const) {
    const olho = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.01), neon(P.labCiano, 2.4));
    olho.position.x = lado * 0.11;
    olhos.add(semSombra(olho));
  }
  const antena = new THREE.Group();
  antena.name = 'antena';
  antena.position.y = 0.46;
  cabeca.add(antena);
  const vareta = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6), toon(P.labMetal));
  vareta.position.y = 0.11;
  antena.add(vareta);
  const bolinha = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), neon(P.labRosa, 2.4));
  bolinha.position.y = 0.24;
  antena.add(semSombra(bolinha));

  // os braços: pivô no ombro, braço pendurado em -Y. ATENÇÃO AO SINAL: o
  // braço ESQUERDO nasce em x negativo, e lá `rotation.z` POSITIVO empurra o
  // braço para DENTRO do corpo — para abrir, o esquerdo leva z negativo
  for (const lado of [-1, 1] as const) {
    const braco = new THREE.Group();
    braco.name = lado < 0 ? 'bracoE' : 'bracoD';
    braco.position.set(lado * 0.34, 0.45, 0);
    corpo.add(braco);
    const tubo = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.26, 4, 8), branco);
    tubo.position.y = -0.18;
    braco.add(tubo);
    const mao = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), toon(P.labPedestalClaro));
    mao.position.y = -0.38;
    braco.add(mao);
  }

  // ------------------------------------------------------------ os clipes
  const clipes: Record<DancaDoRobo, THREE.AnimationClip> = {
    parado: new THREE.AnimationClip('parado', 2, [
      new THREE.VectorKeyframeTrack('corpo.position', [0, 1, 2], [0, 0.42, 0, 0, 0.45, 0, 0, 0.42, 0]),
      new THREE.QuaternionKeyframeTrack('antena.quaternion', [0, 0.5, 1.5, 2], [...q(0, 0, 0), ...q(0, 0, 0.2), ...q(0, 0, -0.2), ...q(0, 0, 0)]),
      new THREE.QuaternionKeyframeTrack('bracoE.quaternion', [0, 2], [...q(0, 0, -0.12), ...q(0, 0, -0.12)]),
      new THREE.QuaternionKeyframeTrack('bracoD.quaternion', [0, 2], [...q(0, 0, 0.12), ...q(0, 0, 0.12)]),
      // a piscada: os olhos achatam por um instante
      new THREE.VectorKeyframeTrack('olhos.scale', [0, 1.55, 1.65, 1.75, 2], [1, 1, 1, 1, 1, 1, 1, 0.1, 1, 1, 1, 1, 1, 1, 1]),
    ]),
    acenar: new THREE.AnimationClip('acenar', 1.6, [
      new THREE.QuaternionKeyframeTrack('bracoD.quaternion', [0, 0.4, 0.8, 1.2, 1.6], [
        ...q(0, 0, 2.5), ...q(0, 0, 2.9), ...q(0, 0, 2.2), ...q(0, 0, 2.9), ...q(0, 0, 2.5),
      ]),
      new THREE.QuaternionKeyframeTrack('bracoE.quaternion', [0, 1.6], [...q(0, 0, -0.15), ...q(0, 0, -0.15)]),
      new THREE.QuaternionKeyframeTrack('cabeca.quaternion', [0, 0.8, 1.6], [...q(0, 0, 0), ...q(0, 0, -0.16), ...q(0, 0, 0)]),
      // a tela do rosto fica rosada enquanto ele acena: a COR também é trilha
      new THREE.ColorKeyframeTrack('rosto.material.color', [0, 0.8, 1.6], [
        ...new THREE.Color(P.labRoboTela).toArray(), ...new THREE.Color(P.labRosa).multiplyScalar(0.55).toArray(),
        ...new THREE.Color(P.labRoboTela).toArray(),
      ]),
    ]),
    pular: new THREE.AnimationClip('pular', 0.9, [
      new THREE.VectorKeyframeTrack('tudo.position', [0, 0.15, 0.45, 0.75, 0.9], [
        0, 0, 0, 0, -0.06, 0, 0, 0.62, 0, 0, 0, 0, 0, 0, 0,
      ]),
      // agacha (achata e alarga), estica no ar, e achata de novo no pouso
      new THREE.VectorKeyframeTrack('tudo.scale', [0, 0.15, 0.45, 0.75, 0.9], [
        1, 1, 1, 1.16, 0.8, 1.16, 0.92, 1.12, 0.92, 1.12, 0.86, 1.12, 1, 1, 1,
      ]),
      new THREE.QuaternionKeyframeTrack('bracoD.quaternion', [0, 0.45, 0.9], [...q(0, 0, 0.3), ...q(0, 0, 2.7), ...q(0, 0, 0.3)]),
      new THREE.QuaternionKeyframeTrack('bracoE.quaternion', [0, 0.45, 0.9], [...q(0, 0, -0.3), ...q(0, 0, -2.7), ...q(0, 0, -0.3)]),
    ]),
    dancar: new THREE.AnimationClip('dancar', 2.4, [
      new THREE.QuaternionKeyframeTrack('tudo.quaternion', [0, 0.8, 1.6, 2.4], [
        ...q(0, 0, 0), ...q(0, (Math.PI * 2) / 3, 0), ...q(0, (Math.PI * 4) / 3, 0), ...q(0, Math.PI * 2, 0),
      ]),
      new THREE.QuaternionKeyframeTrack('bracoD.quaternion', [0, 0.6, 1.2, 1.8, 2.4], [
        ...q(0, 0, 0.3), ...q(0, 0, 2.6), ...q(0, 0, 0.3), ...q(0, 0, 2.6), ...q(0, 0, 0.3),
      ]),
      new THREE.QuaternionKeyframeTrack('bracoE.quaternion', [0, 0.6, 1.2, 1.8, 2.4], [
        ...q(0, 0, -2.6), ...q(0, 0, -0.3), ...q(0, 0, -2.6), ...q(0, 0, -0.3), ...q(0, 0, -2.6),
      ]),
      new THREE.VectorKeyframeTrack('corpo.position', [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4], [
        0, 0.42, 0, 0, 0.36, 0, 0, 0.42, 0, 0, 0.36, 0, 0, 0.42, 0, 0, 0.36, 0, 0, 0.42, 0, 0, 0.36, 0, 0, 0.42, 0,
      ]),
      new THREE.QuaternionKeyframeTrack('cabeca.quaternion', [0, 0.6, 1.2, 1.8, 2.4], [
        ...q(0, 0, 0.15), ...q(0, 0, -0.15), ...q(0, 0, 0.15), ...q(0, 0, -0.15), ...q(0, 0, 0.15),
      ]),
    ]),
  };

  const mixer = new THREE.AnimationMixer(raiz);
  const acoes = Object.fromEntries(
    ORDEM.map((nome) => [nome, mixer.clipAction(clipes[nome])]),
  ) as Record<DancaDoRobo, THREE.AnimationAction>;
  let danca: DancaDoRobo = 'parado';
  acoes.parado.play();

  return {
    grupo,
    mixer,
    get danca() {
      return danca;
    },
    trocarDanca() {
      const atual = acoes[danca];
      danca = ORDEM[(ORDEM.indexOf(danca) + 1) % ORDEM.length];
      const proxima = acoes[danca];
      proxima.reset().setEffectiveWeight(1).play();
      atual.crossFadeTo(proxima, 0.35, false);
      return danca;
    },
    tique(dt) {
      mixer.update(dt);
    },
  };
}

// ------------------------------------------------------------- a cobrinha

export interface Cobrinha {
  grupo: THREE.Group;
  readonly ossos: readonly THREE.Bone[];
  tique(dt: number): void;
}

/**
 * @param centro o meio da volta que ela dá, em coordenada do grupo da estação
 */
export function cobrinha(centro: { x: number; z: number }, raioDaVolta = 1.45): Cobrinha {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'cobrinha';
  const SEGMENTOS = 14;
  const COMPRIMENTO = 2.1;
  const RAIO = 0.11;
  const passo = COMPRIMENTO / SEGMENTOS;

  // o tubo, de pé em +Y, do rabo (y = 0) à cabeça (y = COMPRIMENTO)
  const geo = new THREE.CylinderGeometry(RAIO, RAIO, COMPRIMENTO, 12, SEGMENTOS * 3, false);
  geo.translate(0, COMPRIMENTO / 2, 0);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const indices: number[] = [];
  const pesos: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    // o rabo afina; perto da cabeça, grossura cheia
    const t = y / COMPRIMENTO;
    const grossura = 0.22 + 0.78 * Math.sqrt(t);
    pos.setX(i, pos.getX(i) * grossura);
    pos.setZ(i, pos.getZ(i) * grossura);
    // os dois ossos de que este vértice segue, e quanto de cada um
    const osso = Math.min(SEGMENTOS - 1, Math.floor(y / passo));
    const resto = Math.min(1, (y - osso * passo) / passo);
    indices.push(osso, osso + 1, 0, 0);
    pesos.push(1 - resto, resto, 0, 0);
  }
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(pesos, 4));
  geo.computeVertexNormals();

  const ossos: THREE.Bone[] = [];
  for (let i = 0; i <= SEGMENTOS; i++) {
    const osso = new THREE.Bone();
    osso.position.y = i === 0 ? 0 : passo;
    if (i > 0) ossos[i - 1].add(osso);
    ossos.push(osso);
  }
  const corpo = new THREE.SkinnedMesh(geo, toon(P.labCobra));
  corpo.add(ossos[0]);
  corpo.bind(new THREE.Skeleton(ossos));
  // deitada: o +Y do tubo vira o +X do mundo, a uma altura de raio do chão
  corpo.rotation.z = -Math.PI / 2;
  corpo.position.y = RAIO;
  // os ossos movem os vértices FORA da caixa que o three calculou: sem isto
  // ela some da tela quando o meio do corpo sai do lugar original
  corpo.frustumCulled = false;
  const andarilho = new THREE.Group();
  grupo.add(andarilho);
  andarilho.add(corpo);

  // as pintinhas das costas e a cabeça, PENDURADAS nos ossos. No osso, o +Y é
  // o eixo do corpo (para a frente) e o -X é para CIMA (o corpo está deitado)
  for (let i = 2; i < SEGMENTOS; i += 2) {
    const pinta = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), toon(P.labCobraBarriga));
    pinta.scale.set(0.45, 1, 1);
    pinta.position.set(-RAIO * (0.22 + 0.78 * Math.sqrt(i / SEGMENTOS)) * 0.92, passo / 2, 0);
    ossos[i].add(pinta);
  }
  const cabeca = new THREE.Group();
  cabeca.position.y = 0.08;
  ossos[SEGMENTOS].add(cabeca);
  const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), toon(P.labCobra));
  cranio.scale.set(0.8, 1.25, 1);
  cranio.position.y = 0.06;
  cabeca.add(cranio);
  for (const lado of [-1, 1] as const) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), toon(P.labBranco));
    olho.position.set(-0.07, 0.12, lado * 0.08);
    cabeca.add(olho);
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), toon(P.labRoboTela));
    pupila.position.set(-0.085, 0.14, lado * 0.1);
    cabeca.add(pupila);
  }
  const lingua = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.12, 0.03), toon(P.labVermelho));
  lingua.position.set(0.02, 0.24, 0);
  cabeca.add(lingua);

  let tempo = 0;
  let angulo = 0;
  return {
    grupo,
    ossos,
    tique(dt) {
      tempo += dt;
      // a volta: o grupo anda no círculo e aponta para a tangente
      angulo += dt * 0.42;
      const x = centro.x + Math.cos(angulo) * raioDaVolta;
      const z = centro.z + Math.sin(angulo) * raioDaVolta;
      andarilho.position.set(x, 0, z);
      const tx = -Math.sin(angulo);
      const tz = Math.cos(angulo);
      andarilho.rotation.y = Math.atan2(-tz, tx);
      // a onda: cada osso gira um pouco atrasado em relação ao da frente.
      // Girar em X (do osso) é girar em volta do eixo vertical do mundo
      ossos.forEach((osso, i) => {
        const amplitude = 0.34 * (1 - i / (SEGMENTOS + 4));
        osso.rotation.x = Math.sin(tempo * 4.2 - i * 0.62) * amplitude;
      });
      // a língua: sai e volta de vez em quando
      const lambida = Math.max(0, Math.sin(tempo * 3.1)) ** 8;
      lingua.scale.y = 0.2 + lambida;
      lingua.position.y = 0.2 + lambida * 0.06;
    },
  };
}

// ------------------------------------------------------- o coração de morph

export interface CoracaoQueBate {
  grupo: THREE.Group;
  readonly malha: THREE.Mesh;
  /** bate mais rápido por alguns segundos */
  animar(): void;
  readonly mixer: THREE.AnimationMixer;
  tique(dt: number): void;
}

/**
 * O raio do CORAÇÃO 3D na direção `d` — a superfície de Taubin,
 * `(x² + 9/4·y² + z² − 1)³ − x²z³ − 9/80·y²z³ = 0` (z para cima, y a
 * profundidade). Anda do centro para fora até sair do coração, e refina por
 * bisseção. Como o coração não tem buraco visto do centro, cada direção tem
 * UM raio — e é isso que deixa ele ser alvo de morph de uma esfera.
 */
function raioDoCoracao(d: THREE.Vector3): number {
  const f = (r: number): number => {
    const x = d.x * r;
    const z = d.y * r;
    const y = d.z * r;
    const a = x * x + 2.25 * y * y + z * z - 1;
    return a * a * a - x * x * z * z * z - 0.1125 * y * y * z * z * z;
  };
  let dentro = 0;
  let fora = 0.02;
  while (fora < 2.5 && f(fora) < 0) {
    dentro = fora;
    fora += 0.02;
  }
  for (let i = 0; i < 12; i++) {
    const meio = (dentro + fora) / 2;
    if (f(meio) < 0) dentro = meio;
    else fora = meio;
  }
  return (dentro + fora) / 2;
}

export function coracaoQueBate(): CoracaoQueBate {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'coracao-de-morph';
  grupo.add(pedestal(0.5, 0.95, P.labPedestal, P.heart));

  const geo = new THREE.SphereGeometry(0.42, 56, 40);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const alvo = new Float32Array(pos.count * 3);
  const d = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    const r = raioDoCoracao(d);
    // centraliza (o coração vai de -1 a 1,25 na altura) e encaixa no tamanho da esfera
    alvo[i * 3] = d.x * r * 0.38;
    alvo[i * 3 + 1] = (d.y * r - 0.12) * 0.38;
    alvo[i * 3 + 2] = d.z * r * 0.38;
  }
  // as normais da forma de coração: uma geometria de mentira com as posições
  // do alvo, e o three calcula
  const molde = new THREE.BufferGeometry();
  molde.setAttribute('position', new THREE.BufferAttribute(alvo, 3));
  molde.setIndex(geo.index);
  molde.computeVertexNormals();
  geo.morphAttributes.position = [new THREE.BufferAttribute(alvo, 3)];
  geo.morphAttributes.normal = [molde.attributes.normal];

  const malha = new THREE.Mesh(geo, toon(P.heart));
  malha.position.y = 0.95 + 0.52;
  grupo.add(malha);

  // o clipe: esfera → coração (1 s), bate três vezes "tum-tum", e volta
  const tempos: number[] = [];
  const escalas: number[] = [];
  const marcar = (t: number, s: number): void => {
    tempos.push(t);
    escalas.push(s, s, s);
  };
  marcar(0, 1);
  marcar(1.0, 1);
  for (let b = 0; b < 3; b++) {
    const t0 = 1.2 + b * 0.75;
    marcar(t0, 1);
    marcar(t0 + 0.1, 1.16);
    marcar(t0 + 0.22, 1);
    marcar(t0 + 0.32, 1.09);
    marcar(t0 + 0.45, 1);
  }
  marcar(4.6, 1);
  const clipe = new THREE.AnimationClip('bater', 5.2, [
    new THREE.NumberKeyframeTrack('.morphTargetInfluences[0]', [0, 1.0, 3.9, 4.8, 5.2], [0, 1, 1, 0, 0]),
    new THREE.VectorKeyframeTrack('.scale', tempos, escalas),
  ]);
  const mixer = new THREE.AnimationMixer(malha);
  const acao = mixer.clipAction(clipe);
  acao.play();

  let empolgado = 0;
  let tempo = 0;
  return {
    grupo,
    malha,
    mixer,
    animar() {
      empolgado = 4;
    },
    tique(dt) {
      tempo += dt;
      empolgado = Math.max(0, empolgado - dt);
      acao.timeScale += ((empolgado > 0 ? 2.4 : 1) - acao.timeScale) * Math.min(1, dt * 3);
      mixer.update(dt);
      malha.rotation.y = Math.sin(tempo * 0.6) * 0.5;
    },
  };
}
