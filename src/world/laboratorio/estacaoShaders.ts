import * as THREE from 'three';
import { toon } from '../../core/materials';
import { AguaDePixel, Vento, dissolver, holograma, neon, type Dissolvente } from '../../core/shaders';
import { CharacterRig } from '../../characters/CharacterRig';
import { ARI, RENAN } from '../../characters/cast';
import { PALETTE as P } from '../../palette';
import { pedestal, semSombra, suave } from './comum';
import { geometriaDeCoracao } from './geometria';

/**
 * ===================================== ESTAÇÃO DE SHADERS
 *
 * Shader é o programinha que a placa de vídeo roda para cada vértice e para
 * cada pixel. Os quatro experimentos daqui usam o kit `core/shaders.ts`:
 *
 *  - o HOLOGRAMA do casal: os dois bonecos de verdade (o mesmo `CharacterRig`
 *    que anda pelo jogo), com todo material trocado pelo de holograma — luz
 *    na borda, linhas subindo e uma fatia que pula de vez em quando;
 *  - o PRESENTE que desmancha (dissolve por ruído, com a borda em brasa) e
 *    revela o coração que estava dentro;
 *  - o LAGO de pixels: água inteira no shader, que ondula onde cai pedrinha;
 *  - a GRAMA de vento: 1.600 folhas numa malha instanciada, balançando pelo
 *    vértice — o ventilador dá a rajada.
 */
export interface EstacaoDeShaders {
  grupo: THREE.Group;
  readonly vento: Vento;
  readonly agua: AguaDePixel;
  /** o espelho d'água (é ele que o mouse clica para jogar pedrinha) */
  readonly lagoMalha: THREE.Mesh;
  /** centro e raio do lago, no MUNDO */
  readonly lago: { x: number; z: number; raio: number };
  readonly presente: THREE.Group;
  readonly holograma: THREE.Group;
  readonly ventilador: THREE.Group;
  /** começa a abrir o presente; `false` se ele já está no meio */
  abrirPresente(): boolean;
  /** 0 = embrulhado, 1 = desmanchado */
  readonly progressoDoPresente: number;
  ligarVentilador(): void;
  tique(dt: number): void;
}

/** onde cada experimento fica, em relação ao centro da estação */
const HOLOGRAMA = { x: -1.6, z: -2.0 };
const PRESENTE = { x: 1.8, z: -1.8 };
const LAGO = { x: -1.6, z: 2.2, raio: 1.5 };
const VENTILADOR = { x: -4.3, z: -0.4 };

/** as fases do presente: embrulhado → desmanchando → aberto → refazendo */
type FaseDoPresente = 'fechado' | 'abrindo' | 'aberto' | 'fechando';

export function estacaoDeShaders(origem: { x: number; z: number }, rng: () => number): EstacaoDeShaders {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'estacao-de-shaders';
  const vento = new Vento({ forca: 0.13, altura: 0.5, direcao: [0.86, 0.5] });

  // ---------------------------------------------------------- o holograma
  const projetor = new THREE.Group();
  projetor.position.set(HOLOGRAMA.x, 0, HOLOGRAMA.z);
  grupo.add(projetor);
  projetor.add(pedestal(0.7, 0.35, P.labPedestal, P.labHolograma));
  const lente = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.03, 32), neon(P.labHolograma, 1.05));
  lente.position.y = 0.4;
  projetor.add(semSombra(lente));
  const holo = holograma(P.labHolograma);
  const casal = new THREE.Group();
  casal.position.y = 0.42;
  projetor.add(semSombra(casal));
  const rigs = [ARI, RENAN].map((ficha, i) => {
    const rig = new CharacterRig(ficha);
    rig.group.scale.setScalar(0.74);
    rig.group.position.x = i === 0 ? -0.28 : 0.28;
    rig.group.traverse((n) => {
      if ((n as THREE.Mesh).isMesh) (n as THREE.Mesh).material = holo.material;
      // sprite não aceita material de malha; e holograma não tem halo
      else if ((n as THREE.Sprite).isSprite) n.visible = false;
    });
    casal.add(rig.group);
    return rig;
  });
  // o cone de luz que sai da lente: holograma precisa de onde vir
  const geoCone = new THREE.CylinderGeometry(0.62, 0.42, 1.25, 28, 1, true);
  const cone = new THREE.Mesh(geoCone, neon(P.labHolograma, 0.5, 0.06));
  cone.position.y = 0.42 + 0.62;
  projetor.add(semSombra(cone));

  // ----------------------------------------------------------- o presente
  const presente = new THREE.Group();
  presente.position.set(PRESENTE.x, 0, PRESENTE.z);
  grupo.add(presente);
  presente.add(pedestal(0.55, 0.7, P.labPedestal, P.labRosa));
  const caixaMat = dissolver(P.labRosa, P.labAmarelo, 3.2);
  const fitaMat: Dissolvente = dissolver(P.labAmarelo, P.labLaranja, 3.2);
  // as duas partes desmancham juntas: o MESMO uniforme de progresso nas duas
  fitaMat.uniforms.uProgresso = caixaMat.uniforms.uProgresso;
  fitaMat.uniforms.uTempo = caixaMat.uniforms.uTempo;
  const embrulho = new THREE.Group();
  embrulho.position.y = 0.7 + 0.4;
  presente.add(embrulho);
  const caixa = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.78, 0.78), caixaMat.material);
  embrulho.add(caixa);
  for (const giro of [0, Math.PI / 2]) {
    const tira = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.13), fitaMat.material);
    tira.rotation.y = giro;
    embrulho.add(tira);
  }
  for (const lado of [-1, 1] as const) {
    const laco = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 8, 20), fitaMat.material);
    laco.position.set(lado * 0.12, 0.45, 0);
    laco.rotation.set(0, Math.PI / 2, lado * 0.6);
    embrulho.add(laco);
  }
  // o que estava dentro: só aparece quando o embrulho desmancha
  const coracao = new THREE.Mesh(geometriaDeCoracao(0.5), neon(P.heart, 1.9));
  coracao.position.y = 0.7 + 0.4;
  presente.add(semSombra(coracao));

  // ------------------------------------------------------------- o lago
  const lago = { x: origem.x + LAGO.x, z: origem.z + LAGO.z, raio: LAGO.raio };
  const agua = new AguaDePixel({
    centro: [lago.x, lago.z], raio: LAGO.raio,
    fundo: P.labAguaFundo, raso: P.labAguaRaso, brilho: P.labAguaBrilho,
  });
  const lagoMalha = new THREE.Mesh(new THREE.CircleGeometry(LAGO.raio, 64), agua.material);
  lagoMalha.rotation.x = -Math.PI / 2;
  lagoMalha.position.set(LAGO.x, 0.012, LAGO.z);
  lagoMalha.receiveShadow = false;
  grupo.add(semSombra(lagoMalha));
  // a borda de pedra: pedrinhas em volta, nenhuma no mesmo plano da água
  const PEDRAS = 22;
  for (let i = 0; i < PEDRAS; i++) {
    const a = (i / PEDRAS) * Math.PI * 2 + rng() * 0.1;
    const pedra = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.16 + rng() * 0.07, 0),
      toon(i % 3 === 0 ? P.labPedestalClaro : P.labPedestal),
    );
    pedra.position.set(LAGO.x + Math.cos(a) * (LAGO.raio + 0.08), 0.05, LAGO.z + Math.sin(a) * (LAGO.raio + 0.08));
    pedra.rotation.set(rng() * 3, rng() * 3, rng() * 3);
    pedra.scale.y = 0.55;
    grupo.add(pedra);
  }

  // ------------------------------------------------------------- a grama
  const FOLHAS = 1600;
  const folha = new THREE.PlaneGeometry(0.07, 0.5, 1, 4);
  // afina a ponta: quanto mais alto o vértice, mais perto do eixo
  const pos = folha.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) + 0.25;
    pos.setXY(i, pos.getX(i) * (1 - (y / 0.5) * 0.85), y);
  }
  folha.computeVertexNormals();
  const grama = new THREE.InstancedMesh(folha, vento.material(P.labBranco), FOLHAS);
  const peca = new THREE.Object3D();
  const raiz = new THREE.Color(P.labGramaRaiz);
  const ponta = new THREE.Color(P.labGrama);
  const cor = new THREE.Color();
  let plantadas = 0;
  for (let tentativa = 0; plantadas < FOLHAS && tentativa < FOLHAS * 8; tentativa++) {
    const x = -4.8 + rng() * 5.6;
    const z = -0.6 + rng() * 5.3;
    // nada dentro do lago, nem colado na pedra, nem em cima do ventilador
    if (Math.hypot(x - LAGO.x, z - LAGO.z) < LAGO.raio + 0.3) continue;
    if (Math.hypot(x - VENTILADOR.x, z - VENTILADOR.z) < 0.55) continue;
    peca.position.set(x, 0, z);
    peca.rotation.set(0, rng() * Math.PI, 0);
    peca.scale.set(1, 0.65 + rng() * 0.75, 1);
    peca.updateMatrix();
    grama.setMatrixAt(plantadas, peca.matrix);
    grama.setColorAt(plantadas, cor.lerpColors(raiz, ponta, 0.35 + rng() * 0.65));
    plantadas++;
  }
  grama.count = plantadas;
  grama.instanceMatrix.needsUpdate = true;
  if (grama.instanceColor) grama.instanceColor.needsUpdate = true;
  // folha balançando não projeta sombra (ver o `Vento`): recebe só
  grupo.add(semSombra(grama));

  // --------------------------------------------------------- o ventilador
  const ventilador = new THREE.Group();
  ventilador.position.set(VENTILADOR.x, 0, VENTILADOR.z);
  // de frente para onde o vento sopra
  ventilador.rotation.y = Math.atan2(0.86, 0.5);
  grupo.add(ventilador);
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.08, 20), toon(P.labPedestal));
  pe.position.y = 0.04;
  ventilador.add(pe);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.05, 10), toon(P.labMetal));
  haste.position.y = 0.55;
  ventilador.add(haste);
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.3, 14), toon(P.labPedestalClaro));
  motor.rotation.x = Math.PI / 2;
  motor.position.set(0, 1.12, -0.08);
  ventilador.add(motor);
  const grade = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.025, 8, 36), neon(P.labCiano, 1.8));
  grade.position.set(0, 1.12, 0.1);
  ventilador.add(semSombra(grade));
  const helice = new THREE.Group();
  helice.position.set(0, 1.12, 0.1);
  ventilador.add(helice);
  for (let i = 0; i < 4; i++) {
    const pa = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.36, 0.02), toon(P.labBranco));
    pa.position.y = 0.2;
    const braco = new THREE.Group();
    braco.rotation.z = (i / 4) * Math.PI * 2;
    pa.rotation.y = 0.35;
    braco.add(pa);
    helice.add(braco);
  }
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), toon(P.labPedestal));
  helice.add(miolo);

  // --------------------------------------------------------------- o tempo
  let tempo = 0;
  let fase: FaseDoPresente = 'fechado';
  let relogioDaFase = 0;
  let giroDoVentilador = 1.2;
  let ventoLigado = 0;

  return {
    grupo,
    vento,
    agua,
    lagoMalha,
    lago,
    presente,
    holograma: projetor,
    ventilador,
    get progressoDoPresente() {
      return caixaMat.uniforms.uProgresso.value;
    },
    abrirPresente() {
      if (fase !== 'fechado') return false;
      fase = 'abrindo';
      relogioDaFase = 0;
      return true;
    },
    ligarVentilador() {
      ventoLigado = 3.2;
      vento.soprar(1.9);
    },
    tique(dt) {
      tempo += dt;
      vento.tique(dt);
      agua.tique(dt);
      holo.uniforms.uTempo.value = tempo;
      caixaMat.uniforms.uTempo.value = tempo;

      // o casal de luz gira devagar e respira (o rig de verdade anima sozinho)
      casal.rotation.y = Math.sin(tempo * 0.4) * 0.9;
      for (const rig of rigs) rig.update(dt, 0);

      // o presente: desmancha em 1,8 s, fica aberto 2,6 s e se refaz em 1,4 s
      relogioDaFase += dt;
      const p = caixaMat.uniforms.uProgresso;
      if (fase === 'abrindo') {
        p.value = suave(relogioDaFase / 1.8);
        if (relogioDaFase >= 1.8) { fase = 'aberto'; relogioDaFase = 0; }
      } else if (fase === 'aberto') {
        p.value = 1;
        if (relogioDaFase >= 2.6) { fase = 'fechando'; relogioDaFase = 0; }
      } else if (fase === 'fechando') {
        p.value = 1 - suave(relogioDaFase / 1.4);
        if (relogioDaFase >= 1.4) { fase = 'fechado'; relogioDaFase = 0; p.value = 0; }
      }
      embrulho.rotation.y = tempo * 0.35;
      // o coração sobe um palmo quando o embrulho some, e pulsa
      coracao.position.y = 1.1 + p.value * 0.45 + Math.sin(tempo * 2) * 0.03;
      coracao.rotation.y = tempo * 1.1;
      coracao.scale.setScalar(0.85 + p.value * 0.3 + Math.max(0, Math.sin(tempo * 7)) * 0.05 * p.value);
      coracao.visible = p.value > 0.02;

      // o ventilador: gira sempre devagar; ligado, dispara e sopra
      ventoLigado = Math.max(0, ventoLigado - dt);
      const alvo = ventoLigado > 0 ? 26 : 1.2;
      giroDoVentilador += (alvo - giroDoVentilador) * Math.min(1, dt * 2.5);
      helice.rotation.z -= giroDoVentilador * dt;
    },
  };
}
