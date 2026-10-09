import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { line, toon } from '../../core/materials';
import { neon } from '../../core/shaders';
import { PALETTE as P } from '../../palette';
import { etiqueta, pedestal, semSombra } from './comum';

/**
 * ===================================== ESTAÇÃO DE GEOMETRIA
 *
 * Tudo no jogo é caixa, cilindro e esfera — as primitivas prontas do three.
 * Esta estação mostra o resto da caixa de ferramentas, cada peça com um jeito
 * diferente de nascer:
 *
 *  - o CORAÇÃO é um desenho 2D (`Shape`, com curvas de Bézier) EXTRUDADO —
 *    empurrado para fora ganhando espessura, com a borda arredondada (bevel);
 *  - a FITA é um tubo que segue uma curva (`CatmullRomCurve3` + `TubeGeometry`)
 *    no formato do infinito, e um carrinho anda nela perguntando à curva onde
 *    está e para onde aponta (`getPointAt`, `getTangentAt`);
 *  - o VASO é um perfil girado em volta de um eixo (`LatheGeometry`), como no
 *    torno de cerâmica;
 *  - a CIDADE são 144 prédios FUNDIDOS numa geometria só (`mergeGeometries`):
 *    um desenho para a placa de vídeo em vez de 144. É o truque que alivia o
 *    celular quando o cenário tem muita peça parada;
 *  - o TORNADO são 260 cubos de UMA malha instanciada (`InstancedMesh`): a
 *    mesma geometria desenhada 260 vezes, cada uma com a matriz e a cor dela,
 *    refeitas todo quadro;
 *  - as ESTRELAS e a GALÁXIA são só pontos (`Points`), sem triângulo nenhum.
 *
 * "Ver os triângulos" liga o arame (`WireframeGeometry`) por cima de cada
 * peça: é a malha de verdade, que a placa de vídeo desenha.
 */

/**
 * A geometria do CORAÇÃO, centralizada, com a ponta para baixo e a frente
 * em `+Z`. `largura` em metros. Usada aqui e na vitrine dos materiais.
 */
export function geometriaDeCoracao(largura = 1): THREE.BufferGeometry {
  // o coração dos exemplos do three, desenhado de cabeça para baixo
  const s = new THREE.Shape();
  s.moveTo(5, 5);
  s.bezierCurveTo(5, 5, 4, 0, 0, 0);
  s.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  s.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
  s.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  s.bezierCurveTo(16, 7, 16, 0, 10, 0);
  s.bezierCurveTo(7, 0, 5, 5, 5, 5);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 5,
    bevelEnabled: true,
    bevelThickness: 2.2,
    bevelSize: 1.6,
    bevelSegments: 6,
    curveSegments: 30,
  });
  geo.center();
  // desvira: a ponta, que nasce em cima, vai para baixo
  geo.rotateZ(Math.PI);
  const k = largura / 25;
  geo.scale(k, k, k);
  geo.computeVertexNormals();
  return geo;
}

export interface EstacaoDeGeometria {
  grupo: THREE.Group;
  tique(dt: number): void;
  mostrarTriangulos(ligar: boolean): void;
  readonly triangulosVisiveis: boolean;
  /** quantos triângulos as peças da estação têm (o que o arame mostra) */
  readonly triangulos: number;
}

function contarTriangulos(geo: THREE.BufferGeometry): number {
  return (geo.index ? geo.index.count : geo.attributes.position.count) / 3;
}

export function estacaoDeGeometria(rng: () => number): EstacaoDeGeometria {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'estacao-de-geometria';
  const arames: THREE.LineSegments[] = [];
  let triangulos = 0;
  const comArame = (malha: THREE.Mesh): void => {
    const arame = new THREE.LineSegments(new THREE.WireframeGeometry(malha.geometry), line(P.labCiano));
    arame.visible = false;
    malha.add(semSombra(arame));
    arames.push(arame);
    triangulos += contarTriangulos(malha.geometry);
  };

  // --------------------------------------------------- o coração extrudado
  const CENTRO_DO_CORACAO = new THREE.Vector3(-1.4, 2.35, -1.5);
  const base = pedestal(0.55, 0.95, P.labPedestal, P.labRosa);
  base.position.set(CENTRO_DO_CORACAO.x, 0, CENTRO_DO_CORACAO.z);
  grupo.add(base);
  const coracao = new THREE.Mesh(geometriaDeCoracao(1.5), toon(P.heart));
  coracao.position.copy(CENTRO_DO_CORACAO);
  grupo.add(coracao);
  comArame(coracao);

  // --------------------------------------- a fita do infinito e o carrinho
  const pontos: THREE.Vector3[] = [];
  for (let i = 0; i < 16; i++) {
    const t = (i / 16) * Math.PI * 2;
    const den = 1 + Math.sin(t) ** 2;
    pontos.push(new THREE.Vector3(
      (2.1 * Math.cos(t)) / den,
      Math.sin(2 * t) * 0.28,
      (2.1 * Math.sin(t) * Math.cos(t)) / den,
    ));
  }
  const curva = new THREE.CatmullRomCurve3(pontos, true, 'centripetal');
  const fita = new THREE.Mesh(new THREE.TubeGeometry(curva, 220, 0.045, 8, true), neon(P.labCiano, 1.9));
  fita.position.copy(CENTRO_DO_CORACAO);
  grupo.add(semSombra(fita));
  comArame(fita);
  const carrinho = new THREE.Group();
  const caixa = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.26), toon(P.labAmarelo));
  carrinho.add(caixa);
  const farol = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), neon(P.labBranco, 2.6));
  farol.position.z = 0.14;
  carrinho.add(semSombra(farol));
  fita.add(carrinho);

  // ------------------------------------------------------ o vaso de torno
  const perfil = [
    [0, 0], [0.3, 0], [0.37, 0.08], [0.4, 0.3], [0.33, 0.52], [0.2, 0.7], [0.18, 0.82], [0.25, 0.92],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const vaso = new THREE.Mesh(new THREE.LatheGeometry(perfil, 40), toon(P.labAzul, { doubleSide: true }));
  vaso.position.set(2.3, 0, -1.6);
  grupo.add(vaso);
  comArame(vaso);
  for (let i = 0; i < 5; i++) {
    const folha = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.6, 5), toon(P.labGrama));
    const a = (i / 5) * Math.PI * 2;
    folha.position.set(2.3 + Math.cos(a) * 0.07, 1.12, -1.6 + Math.sin(a) * 0.07);
    folha.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45);
    grupo.add(folha);
  }

  // ------------------------------------------------- a cidade num desenho só
  const blocos: THREE.BufferGeometry[] = [];
  const coresDosPredios = [P.labCiano, P.labRosa, P.labRoxo, P.labAzul, P.labBranco, P.labAmarelo].map(
    (c) => new THREE.Color(c),
  );
  const LADO = 12;
  const PASSO = 0.16;
  for (let i = 0; i < LADO; i++) {
    for (let j = 0; j < LADO; j++) {
      // mais alto no meio, como centro de cidade
      const meio = 1 - Math.hypot(i - (LADO - 1) / 2, j - (LADO - 1) / 2) / (LADO * 0.72);
      const altura = 0.08 + rng() * 0.55 * meio + meio * 0.3;
      const bloco = new THREE.BoxGeometry(PASSO * 0.8, altura, PASSO * 0.8);
      bloco.translate((i - (LADO - 1) / 2) * PASSO, altura / 2 + 0.36, (j - (LADO - 1) / 2) * PASSO);
      const cor = coresDosPredios[Math.floor(rng() * coresDosPredios.length)];
      const cores = new Float32Array(bloco.attributes.position.count * 3);
      for (let v = 0; v < bloco.attributes.position.count; v++) cor.toArray(cores, v * 3);
      bloco.setAttribute('color', new THREE.BufferAttribute(cores, 3));
      blocos.push(bloco);
    }
  }
  const fundida = mergeGeometries(blocos);
  for (const b of blocos) b.dispose();
  // o toon de sempre, com a cor de CADA VÉRTICE ligada: a cor de cada prédio
  // mora na geometria, e não no material — é isso que deixa um material só
  const materialDaCidade = toon(P.labBranco).clone();
  materialDaCidade.vertexColors = true;
  const cidade = new THREE.Mesh(fundida ?? new THREE.BufferGeometry(), materialDaCidade);
  cidade.position.set(1.9, 0, 1.7);
  grupo.add(cidade);
  comArame(cidade);
  const chao = new THREE.Mesh(new THREE.BoxGeometry(LADO * PASSO + 0.2, 0.36, LADO * PASSO + 0.2), toon(P.labPedestal));
  chao.position.set(1.9, 0.18, 1.7);
  grupo.add(chao);
  const legenda = etiqueta(`${LADO * LADO} prédios, 1 desenho`, 2.2, 0.42, P.labCiano);
  legenda.position.set(1.9 + 0.9, 0.45, 1.7 + 0.9);
  legenda.rotation.y = Math.PI / 4;
  grupo.add(legenda);

  // -------------------------------------------------- o tornado instanciado
  const TOTAL = 260;
  const tornado = new THREE.InstancedMesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), toon(P.labBranco), TOTAL);
  tornado.position.set(-2.1, 0, 1.7);
  const coresDoTornado = [P.labCiano, P.labRosa, P.labAmarelo, P.labVerde, P.labRoxo].map((c) => new THREE.Color(c));
  const sementes: Array<{ altura: number; fase: number; giro: number }> = [];
  for (let i = 0; i < TOTAL; i++) {
    sementes.push({ altura: rng(), fase: rng() * Math.PI * 2, giro: 0.6 + rng() * 1.2 });
    tornado.setColorAt(i, coresDoTornado[i % coresDoTornado.length]);
  }
  if (tornado.instanceColor) tornado.instanceColor.needsUpdate = true;
  // o tornado muda de forma todo quadro: a caixa que o three calcula uma vez
  // ficaria pequena e cortaria cubos da tela
  tornado.frustumCulled = false;
  grupo.add(tornado);
  triangulos += contarTriangulos(tornado.geometry) * TOTAL;
  const peca = new THREE.Object3D();

  let tempo = 0;
  const atualizarTornado = (): void => {
    for (let i = 0; i < TOTAL; i++) {
      const s = sementes[i];
      // sobe em espiral e volta embaixo: a altura anda e dá a volta em 0..1
      const h = (s.altura + tempo * 0.12) % 1;
      const raio = 0.18 + h * h * 1.1;
      const a = s.fase + tempo * s.giro * (1.6 - h);
      peca.position.set(Math.cos(a) * raio, 0.15 + h * 2.6, Math.sin(a) * raio);
      peca.rotation.set(tempo * s.giro, a, tempo * 0.7);
      peca.scale.setScalar(0.6 + h * 0.9);
      peca.updateMatrix();
      tornado.setMatrixAt(i, peca.matrix);
    }
    tornado.instanceMatrix.needsUpdate = true;
  };
  atualizarTornado();

  return {
    grupo,
    get triangulosVisiveis() {
      return arames[0].visible;
    },
    triangulos,
    mostrarTriangulos(ligar) {
      for (const a of arames) a.visible = ligar;
    },
    tique(dt) {
      tempo += dt;
      coracao.rotation.y = tempo * 0.7;
      coracao.position.y = CENTRO_DO_CORACAO.y + Math.sin(tempo * 1.4) * 0.08;
      const u = (tempo * 0.09) % 1;
      carrinho.position.copy(curva.getPointAt(u));
      carrinho.lookAt(fita.localToWorld(curva.getPointAt((u + 0.01) % 1)));
      atualizarTornado();
    },
  };
}

// ------------------------------------------------------- o céu de pontos

/**
 * AS ESTRELAS: pontos espalhados numa casca em volta da plataforma, mais
 * embaixo do que em cima — a câmera olha de cima, e o que ela vê de vazio é o
 * que está ABAIXO da borda. Câmera ortográfica não diminui ponto com a
 * distância, então o tamanho é em pixels (`sizeAttenuation: false`).
 */
export function ceuDeEstrelas(rng: () => number, quantas = 1400): THREE.Points {
  const pos = new Float32Array(quantas * 3);
  const cor = new Float32Array(quantas * 3);
  const tons = [P.labBranco, P.labCiano, P.labAmarelo, P.labRosa].map((c) => new THREE.Color(c));
  for (let i = 0; i < quantas; i++) {
    const a = rng() * Math.PI * 2;
    const r = 26 + rng() * 34;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = -30 + rng() * 34;
    pos[i * 3 + 2] = Math.sin(a) * r;
    tons[rng() < 0.7 ? 0 : 1 + Math.floor(rng() * 3)].toArray(cor, i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
  const pontos = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 2.2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false,
  }));
  pontos.frustumCulled = false;
  return semSombra(pontos);
}

/**
 * A GALÁXIA: braços em espiral de pontos, do miolo amarelo para a borda roxa,
 * girando devagar. Cada ponto mora a uma distância e num braço; o giro dos
 * braços cresce com a distância, e é isso que desenha a espiral.
 */
export function galaxia(rng: () => number, quantas = 5200, raio = 13): THREE.Points {
  const pos = new Float32Array(quantas * 3);
  const cor = new Float32Array(quantas * 3);
  const miolo = new THREE.Color(P.labAmarelo);
  const borda = new THREE.Color(P.labRoxo);
  const c = new THREE.Color();
  const BRACOS = 4;
  for (let i = 0; i < quantas; i++) {
    const d = Math.pow(rng(), 1.6) * raio;
    const braco = ((i % BRACOS) / BRACOS) * Math.PI * 2;
    const espalha = (rng() - 0.5) * (0.4 + d * 0.06) * 2;
    const a = braco + d * 0.42 + espalha;
    pos[i * 3] = Math.cos(a) * d + (rng() - 0.5) * 0.6;
    pos[i * 3 + 1] = (rng() - 0.5) * (1.2 - d / raio) * 1.2;
    pos[i * 3 + 2] = Math.sin(a) * d + (rng() - 0.5) * 0.6;
    c.lerpColors(miolo, borda, d / raio).toArray(cor, i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
  const pontos = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 2.4, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  pontos.frustumCulled = false;
  return semSombra(pontos);
}
