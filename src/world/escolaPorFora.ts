import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { Lote, arco, extrudar, moldeEmArco, quina, retangulo } from './lojaDeRoupas';
import { tijolinho, reboco } from './texturasDeFachada';
import { uvDeParede } from './acabamento';
import { contorno, contornoPoligonal, cavetinho, type Perfil } from './molduras';
import { novaTextura, sorteio } from './texturasDeChao';

/**
 * ================================================== A ESCOLA DO GATITO POR FORA
 *
 * O prédio da escola visto do pátio da frente (`scenes/escolaPatio.ts`), da
 * foto que o Renan mandou: "uma escola chique dos Estados Unidos, uma de
 * filme mesmo". Tijolinho vermelho com o rejunte creme, a pedra clara das
 * faixas e da cornija, as janelas de caixilho branco com o lintel de pedra, e
 * no meio a ROTUNDA octogonal com a entrada em arco, a cúpula baixa de metal
 * cinza e a lanterninha branca de colunas no alto (com o sino da escola lá
 * dentro). As duas ALAS de dois andares saem para os lados, retas.
 *
 * A PLANTA (a origem é o meio da rotunda, no chão; a frente é `+Z`):
 *
 *              ala esquerda                         ala direita
 *    ┌──────────────────────────┐ ╱‾‾‾‾‾╲ ┌──────────────────────────┐ z = −10
 *    │                          │╱       ╲│                          │
 *    │  ▢▢   ▢▢   ▢▢   ▢▢       │ rotunda │       ▢▢   ▢▢   ▢▢   ▢▢  │
 *    └──────────────────────────┘╲       ╱└──────────────────────────┘ z = 2,75
 *   x = −33                        ╲_▢▢_╱  ← o portal em arco         x = 33
 *                                    porta (z = 8,3)
 *
 * O QUE A CÂMERA VÊ MAIS É O ALTO: ela olha de cima em 34°, então o telhado
 * de cada ala (a laje com as máquinas e as clarabóias), a cúpula de gomos
 * com as costuras de metal e a lanterninha contam tanto quanto a fachada. A
 * face DIAGONAL `+X/+Z` da rotunda olha bem para a câmera de sempre.
 *
 * Como a lojinha da Estella: cada parede é um QUADRO (a face de fora em
 * `z = 0` dele) com os furos de verdade, e tudo que se repete (caixilho,
 * peitoril, lintel, coluna, costura da cúpula) é LOTE. O vidro de todas as
 * janelas é uma malha só, com a cor nos vértices (o reflexo em diagonal).
 */

// ============================================================ as medidas

const OITAVO = Math.PI / 8;
/** o raio da rotunda até o vértice do octógono */
const R = 7.6;
/** até o meio de cada face */
const APOTEMA = R * Math.cos(OITAVO);
/** a largura de cada face */
const FACE = 2 * R * Math.sin(OITAVO);
const ESP = 0.35;

const PLINTO = 0.58;
const JANELA_1 = { y0: 1.05, y1: 3.25 };
const JANELA_2 = { y0: 4.95, y1: 7.05 };
const CORNIJA_ALA = 7.5;
const TOPO_ALA = 8.75;
const LAJE = 8.2;
const TOPO_ROTUNDA = 10.6;

/** o que a cena precisa saber do prédio (colisor, porta, quanto ele ocupa) */
export const PREDIO_DA_ESCOLA = {
  raio: R,
  apotema: APOTEMA,
  /** a ala direita (a esquerda é o espelho em `x`) */
  ala: { x0: 0, x1: 33, z0: -10, z1: 2.75 },
  /** o portal da entrada, na face da frente */
  portal: { meia: 2.5, frente: APOTEMA + 1.3 },
  /** o vão do arco (meia largura e alto) */
  arco: { meia: 1.75, pernas: 2.95, alto: 3.9 },
  alto: TOPO_ALA,
  altoDaLanterna: 21,
} as const;

const ALA = PREDIO_DA_ESCOLA.ala;

// =========================================================== as texturas

/**
 * A LAJE DO TELHADO: a manta cinza em faixas de 1 m soldadas (a costura um
 * tico mais clara, com a sombrinha do lado), e umas manchas de chuva. É o que
 * mais aparece de cima, então tem que ter desenho — lisa, parecia papelão.
 */
function mantaDaLaje(): THREE.CanvasTexture {
  return novaTextura('escola:manta', 4, (ctx, s) => {
    const rnd = sorteio(4417);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1400; i++) {
      const t = rnd() < 0.5 ? 255 : 214;
      ctx.fillStyle = `rgba(${t},${t},${t},0.35)`;
      ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
    }
    for (let i = 0; i < 7; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.06 + rnd() * 0.08);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(150,150,150,0.16)');
      grad.addColorStop(1, 'rgba(150,150,150,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // quatro faixas por azulejo de 4 m: a costura a cada metro
    for (let k = 0; k < 4; k++) {
      const x = Math.round((s / 4) * k);
      ctx.fillStyle = 'rgba(120,120,120,0.35)';
      ctx.fillRect(x, 0, 3, s);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(x + 3, 0, 3, s);
    }
  });
}

/** a grade da máquina de ar do telhado: aletas deitadas */
function grelha(): THREE.CanvasTexture {
  return novaTextura('escola:grelha', 0.6, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    for (let k = 0; k < 8; k++) {
      const y = Math.round((s / 8) * k);
      ctx.fillStyle = 'rgba(90,96,102,0.55)';
      ctx.fillRect(0, y, s, Math.max(3, s * 0.03));
    }
  });
}

/** a pedra clara das faixas, dos peitoris e da cornija: quase lisa, com veio */
function pedraLisa(): THREE.CanvasTexture {
  return reboco(1.2);
}

// ===================================================== peças de desenho

/**
 * O LETREIRO DO ARCO: as letras gravadas na pedra do tímpano, como o
 * "ACADEMICS" da foto — maiúsculas com serifa, na cor de tijolo queimado, e a
 * sombrinha embaixo de cada letra (o sulco). O fundo é a cor da pedra.
 */
function letreiroDoArco(texto: string, largura: number, altura: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.max(64, Math.round((1024 * altura) / largura));
  const ctx = canvas.getContext('2d');
  const hex = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
  if (ctx) {
    const W = canvas.width;
    const H = canvas.height;
    ctx.fillStyle = hex(P.escolaPedra);
    ctx.fillRect(0, 0, W, H);
    // o veio da pedra, de leve
    const rnd = sorteio(77);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(150,130,100,0.12)';
      ctx.fillRect(rnd() * W, rnd() * H, 2, 2);
    }
    // a moldurinha da placa
    ctx.strokeStyle = 'rgba(140,118,90,0.55)';
    ctx.lineWidth = H * 0.05;
    ctx.strokeRect(H * 0.08, H * 0.1, W - H * 0.16, H * 0.8);
    let px = Math.round(H * 0.56);
    const fonte = (t: number): string => `700 ${t}px Georgia, "Times New Roman", serif`;
    const espaco = (t: number): number => t * 0.18;
    const medir = (t: number): number => {
      ctx.font = fonte(t);
      return [...texto].reduce((soma, c) => soma + ctx.measureText(c).width, 0) + espaco(t) * (texto.length - 1);
    };
    while (px > 10 && medir(px) > W * 0.86) px -= 2;
    const total = medir(px);
    ctx.font = fonte(px);
    ctx.textBaseline = 'middle';
    let x = (W - total) / 2;
    for (const c of texto) {
      // o sulco: a sombra embaixo e a luz em cima da letra
      ctx.fillStyle = 'rgba(255,250,235,0.9)';
      ctx.fillText(c, x, H / 2 - 2);
      ctx.fillStyle = hex(P.escolaLetra);
      ctx.fillText(c, x, H / 2 + 2);
      x += ctx.measureText(c).width + espaco(px);
    }
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 8;
  return new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), toon(0xffffff, { mapa: textura }));
}

/**
 * O VIDRO DE UMA JANELA: um plano com a cor nos vértices — o azul-petróleo
 * escuro embaixo, e uma faixa de reflexo do céu correndo na diagonal. Muitas
 * janelas viram UMA malha (`toon` branco com `corPorVertice`): o vidro é
 * opaco, então entra na conta da `fundir()` como qualquer pedaço.
 */
function vidroDeJanela(largura: number, altura: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(largura, altura, 4, 6);
  const pos = geo.getAttribute('position');
  const cor = new Float32Array(pos.count * 3);
  const escuro = new THREE.Color(P.escolaVidroFora);
  const brilho = new THREE.Color(P.escolaVidroBrilho);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) / largura + 0.5;
    const v = pos.getY(i) / altura + 0.5;
    // a faixa do reflexo: perto da diagonal u + v = 1,1
    const faixa = Math.max(0, 1 - Math.abs(u + v - 1.15) * 3.2);
    c.copy(escuro).lerp(brilho, Math.min(1, faixa * 0.85 + v * 0.18));
    cor[i * 3] = c.r;
    cor[i * 3 + 1] = c.g;
    cor[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
  return geo;
}

// ================================================================ o prédio

/** o prédio inteiro, centrado no meio da rotunda, com a frente para `+Z` */
export function predioDaEscola(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'predio-da-escola';
  const rnd = sorteio(1909);

  // ------------------------------------------------------------- materiais
  const tijolo = toon(P.escolaRejunte, { mapa: tijolinho(0.95, P.escolaTijoloFora) });
  const pedra = toon(P.escolaPedra, { mapa: pedraLisa() });
  const pedraEscura = toon(P.escolaPedraSombra, { mapa: pedraLisa() });
  const laje = toon(P.escolaLaje, { mapa: mantaDaLaje() });
  const caixilhoMat = toon(P.escolaCaixilho);
  const metalDaCupula = toon(P.escolaCupula);
  const frisoDaCupula = toon(P.escolaCupulaFriso);
  const branco = toon(P.escolaLanterna);
  const dourado = toon(P.gold);
  const maquina = toon(P.escolaMaquinaDoTeto);
  const grade = toon(P.escolaMaquinaDoTeto, { mapa: grelha() });
  const escuro = toon(P.escolaVidroFora);
  const vidroMat = toon(0xffffff, { corPorVertice: true });
  const luzDaLanterna = toon(P.luzDoPoste, { glow: 0.85 });

  // ------------------------------------------------------------- os lotes
  // (sem índice: a caixa do lote é a mesma para as três, e o `zfighting.mjs` leria as três como caixas
  // coplanares na origem — o que ele mede é a caixa da GEOMETRIA, e não as cópias)
  const caixa = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
  /** a madeira branca dos caixilhos: cada barra é uma cópia */
  const caixilhos = new Lote(caixa, caixilhoMat);
  /** peitoril, lintel e chave do arco: a pedra das janelas */
  const pedras = new Lote(caixa, toon(0xffffff));
  const costuras = new Lote(caixa, frisoDaCupula);
  const colunas = new Lote(new THREE.CylinderGeometry(1, 1, 1, 12), branco);
  const vidros: THREE.BufferGeometry[] = [];
  const corDaPedra = (): number => new THREE.Color(P.escolaPedra).multiplyScalar(0.94 + rnd() * 0.08).getHex();

  // ------------------------------------------------------- quadros e peças
  const quadro = (x: number, z: number, giro: number): THREE.Group => {
    const q = new THREE.Group();
    q.position.set(x, 0, z);
    q.rotation.y = giro;
    q.updateMatrix();
    g.add(q);
    return q;
  };
  const peca = (pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material,
    x = 0, y = 0, z = 0): THREE.Mesh => {
    const textura = (mat as THREE.MeshToonMaterial).map;
    const m = new THREE.Mesh(textura ? uvDeParede(geo, x, y, z) : geo, mat);
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  };
  const barra = (q: THREE.Object3D, x: number, y: number, z: number, l: number, a: number, p: number, giro = 0): void => {
    caixilhos.por(q, new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), giro), new THREE.Vector3(l, a, p));
  };
  const pedraEm = (q: THREE.Object3D, x: number, y: number, z: number, l: number, a: number, p: number, cor = corDaPedra()): void => {
    pedras.por(q, new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(l, a, p), cor);
  };
  const vidroEm = (q: THREE.Object3D, geo: THREE.BufferGeometry, x: number, y: number, z: number): void => {
    geo.translate(x, y, z);
    geo.applyMatrix4(q.matrix);
    vidros.push(geo);
  };

  /**
   * UMA JANELA no quadro: o furo (devolvido para a parede), o caixilho branco
   * recuado 8 cm (seis vidraças: o montante do meio e duas travessas), o
   * vidro, o peitoril de pedra que avança e o lintel com a pedra-chave.
   */
  const janela = (q: THREE.Object3D, cx: number, y0: number, y1: number, larg: number): THREE.Path => {
    const meia = larg / 2;
    const alto = y1 - y0;
    const zc = -0.13;
    const fundo = 0.1;
    const b = 0.085;
    // (o batente entra 1 cm no tijolo: casado com o furo, as faces de dentro brigariam)
    barra(q, cx - meia + b / 2 - 0.005, (y0 + y1) / 2, zc, b + 0.01, alto + 0.02, fundo);
    barra(q, cx + meia - b / 2 + 0.005, (y0 + y1) / 2, zc, b + 0.01, alto + 0.02, fundo);
    barra(q, cx, y1 - b / 2 + 0.005, zc, larg - 2 * b, b + 0.01, fundo);
    barra(q, cx, y0 + b / 2 - 0.005, zc, larg - 2 * b, b + 0.01, fundo);
    // as vidraças: o montante e as duas travessas, mais finos e um tico para dentro
    barra(q, cx, (y0 + y1) / 2, zc - 0.01, 0.05, alto - 2 * b, fundo * 0.8);
    for (const t of [1 / 3, 2 / 3]) barra(q, cx, y0 + alto * t, zc - 0.01, larg - 2 * b, 0.05, fundo * 0.8);
    vidroEm(q, vidroDeJanela(larg - 0.1, alto - 0.1), cx, (y0 + y1) / 2, zc - 0.03);
    // o peitoril: avança da parede e sobra dos lados
    // (o alto dele fica 1 cm abaixo do chão do vão, e o lintel 1 cm acima do teto: rentes, brigariam)
    pedraEm(q, cx, y0 - 0.07, 0.07, larg + 0.26, 0.12, 0.24);
    // o lintel, com a chave no meio, um tico mais alta e mais saída
    pedraEm(q, cx, y1 + 0.18, 0.03, larg + 0.38, 0.34, 0.1);
    pedraEm(q, cx, y1 + 0.2, 0.06, 0.28, 0.44, 0.14);
    return retangulo(new THREE.Path(), cx - meia, y0, cx + meia, y1);
  };
  /** a janela redonda do friso da rotunda (o óculo), com a cruz e o aro de pedra */
  const oculo = (q: THREE.Object3D, cx: number, cy: number, raio: number): THREE.Path => {
    const furo = new THREE.Path();
    furo.absarc(cx, cy, raio, 0, Math.PI * 2, false);
    const aro = new THREE.Shape();
    aro.absarc(cx, cy, raio + 0.16, 0, Math.PI * 2, false);
    const dentro = new THREE.Path();
    dentro.absarc(cx, cy, raio, 0, Math.PI * 2, true);
    aro.holes.push(dentro);
    peca(q, extrudar(aro, 0.08, -0.02, 24), pedra);
    vidroEm(q, new THREE.CircleGeometry(raio, 20).setAttribute('color',
      new THREE.BufferAttribute(new Float32Array(Array.from({ length: 22 }, (_, i) => {
        const c = new THREE.Color(P.escolaVidroFora).lerp(new THREE.Color(P.escolaVidroBrilho), i % 5 === 1 ? 0.6 : 0.1);
        return [c.r, c.g, c.b];
      }).flat()), 3)), cx, cy, -0.12);
    barra(q, cx, cy, -0.1, 0.06, raio * 2, 0.08);
    barra(q, cx, cy, -0.1, raio * 2, 0.06, 0.08);
    return furo;
  };
  /** a parede de tijolo de um quadro, de `x0` a `x1`, com os furos */
  const parede = (q: THREE.Object3D, x0: number, x1: number, alto: number, furos: THREE.Path[]): void => {
    const forma = retangulo(new THREE.Shape(), x0, 0, x1, alto);
    forma.holes.push(...furos);
    peca(q, extrudar(forma, ESP, -ESP, 12), tijolo);
  };
  /** a pilastra de tijolo, saltada 12 cm da parede, do plinto até a cornija */
  const pilastra = (q: THREE.Object3D, x: number, larg: number, ate: number): void => {
    peca(q, new THREE.BoxGeometry(larg, ate - PLINTO + 0.02, 0.16), tijolo, x, (PLINTO + ate) / 2, 0.06);
  };

  // --------------------------------------------------------------- as alas
  /*
   * AS ALAS: a frente tem quatro tramos entre as pilastras, duas janelas por
   * tramo em cada andar; a ponta tem dois tramos; o fundo repete a frente. A
   * ala esquerda é a direita espelhada — feita de novo com `lado = −1`, e não
   * com escala negativa (que vira a face do avesso e a `fundir()` não junta).
   */
  const CENTRO_X = (ALA.x0 + ALA.x1) / 2;
  const CENTRO_Z = (ALA.z0 + ALA.z1) / 2;
  const MEIA_X = (ALA.x1 - ALA.x0) / 2;
  const MEIA_Z = (ALA.z1 - ALA.z0) / 2;
  const PILASTRAS_DA_FRENTE = [7.45, 13.95, 20.45, 26.95, 32.83];
  const tramosDaFrente = [10.7, 17.2, 23.7, 29.83];
  for (const lado of [1, -1]) {
    const cx = lado * CENTRO_X;
    // a frente (+z) e o fundo (−z): o x local da frente é o do mundo; o do fundo, o contrário
    for (const [z, giro, sinal] of [[ALA.z1, 0, 1], [ALA.z0, Math.PI, -1]] as const) {
      const q = quadro(cx, z, giro);
      const local = (xMundo: number): number => (xMundo - cx) * sinal;
      const furos: THREE.Path[] = [];
      for (const t of tramosDaFrente) {
        for (const d of [-1.4, 1.4]) {
          const xl = local(lado * (t + d));
          furos.push(janela(q, xl, JANELA_1.y0, JANELA_1.y1, 1.5));
          furos.push(janela(q, xl, JANELA_2.y0, JANELA_2.y1, 1.5));
        }
      }
      parede(q, -MEIA_X, MEIA_X, TOPO_ALA, furos);
      // (a da quina passa 14 cm da ponta, e a da ponta para 2 cm antes dela: a quina dá a volta sem face no plano da outra)
      for (const p of PILASTRAS_DA_FRENTE) pilastra(q, local(lado * p), p > 32 ? 0.62 : 0.7, CORNIJA_ALA);
    }
    // a ponta: a face de fora olha para `lado · X`
    const q = quadro(lado * ALA.x1, CENTRO_Z, lado * Math.PI / 2);
    const furos: THREE.Path[] = [];
    for (const xl of [-4.4, -1.6, 1.6, 4.4]) {
      furos.push(janela(q, xl, JANELA_1.y0, JANELA_1.y1, 1.4));
      furos.push(janela(q, xl, JANELA_2.y0, JANELA_2.y1, 1.4));
    }
    parede(q, -MEIA_Z, MEIA_Z, TOPO_ALA, furos);
    for (const xl of [-MEIA_Z + 0.34, 0, MEIA_Z - 0.34]) pilastra(q, xl, xl === 0 ? 0.7 : 0.6, CORNIJA_ALA);

    // as molduras que dão a volta na ala: o plinto, a faixa entre os andares, a cornija e o capeamento
    const molduras: Array<[Perfil, THREE.Material]> = [
      [[[0, 0], [0.18, 0], [0.18, PLINTO - 0.06], [0.08, PLINTO], [0, PLINTO]], pedraEscura],
      [[[0, 3.84], [0.19, 3.86], [0.19, 4.16], [0.09, 4.24], [0, 4.24]], pedra],
      [[
        [0, CORNIJA_ALA], [0.19, CORNIJA_ALA], [0.19, CORNIJA_ALA + 0.14],
        ...cavetinho([0.19, CORNIJA_ALA + 0.14], [0.36, CORNIJA_ALA + 0.42]),
        [0.36, CORNIJA_ALA + 0.56], [0, CORNIJA_ALA + 0.56],
      ], pedra],
      [[[0, TOPO_ALA - 0.04], [0.07, TOPO_ALA - 0.04], [0.07, TOPO_ALA + 0.14], [-ESP - 0.07, TOPO_ALA + 0.14], [-ESP - 0.07, TOPO_ALA - 0.04]], pedra],
    ];
    for (const [perfil, mat] of molduras) {
      const m = new THREE.Mesh(contorno(perfil, MEIA_X, MEIA_Z), mat);
      m.position.set(cx, 0, CENTRO_Z);
      g.add(m);
    }

    // a laje do telhado, por dentro da platibanda (a manta com o UV em metros)
    const lajeGeo = new THREE.BoxGeometry(ALA.x1 - ALA.x0 - 0.1, 0.3, ALA.z1 - ALA.z0 - 0.1);
    peca(g, lajeGeo, laje, cx, LAJE - 0.15, CENTRO_Z);
    telhadoDaAla(g, cx, lado, { maquina, grade, escuro, vidroMat, vidros, pedra: pedraEscura });
  }

  // ------------------------------------------------------------- a rotunda
  /*
   * A ROTUNDA: oito faces, cada uma um quadro com o meio em `APOTEMA` e a
   * face para fora. A face 0 é a da frente (a do portal), a 1 é a diagonal
   * `+X/+Z` (a que olha para a câmera de sempre), e as do fundo ficam dentro
   * das alas — delas só aparece o que passa da laje.
   */
  const verticeAng = (k: number): number => OITAVO + (k * Math.PI) / 4;
  const vertice = (k: number, r = R): THREE.Vector2 => new THREE.Vector2(r * Math.sin(verticeAng(k)), r * Math.cos(verticeAng(k)));
  // o polígono percorrido com a parte de fora à direita: do vértice 7 (−X da frente) para o 0, o 1…
  const octogono = Array.from({ length: 8 }, (_, i) => vertice((i + 7) % 8));
  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4;
    const q = quadro(Math.sin(ang) * APOTEMA, Math.cos(ang) * APOTEMA, ang);
    const furos: THREE.Path[] = [];
    const vista = k === 0 || k === 1 || k === 7;
    if (k === 1 || k === 7) {
      for (const xl of [-1.25, 1.25]) {
        furos.push(janela(q, xl, JANELA_1.y0, JANELA_1.y1, 1.3));
        furos.push(janela(q, xl, JANELA_2.y0, JANELA_2.y1, 1.3));
      }
    } else if (k === 0) {
      for (const xl of [-1.25, 1.25]) furos.push(janela(q, xl, JANELA_2.y0 + 0.25, JANELA_2.y1, 1.3));
    }
    if (vista) furos.push(oculo(q, 0, 9.15, 0.5));
    parede(q, -FACE / 2 - 0.01, FACE / 2 + 0.01, TOPO_ROTUNDA, furos);
  }
  // as quinas: uma pilastra de tijolo em cada vértice, que esconde a emenda das faces
  for (let k = 0; k < 8; k++) {
    const v = vertice(k);
    const m = peca(g, new THREE.BoxGeometry(0.62, TOPO_ROTUNDA - PLINTO - 0.4, 0.3), tijolo, 0, 0, 0);
    m.position.set(v.x, PLINTO + (TOPO_ROTUNDA - PLINTO - 0.4) / 2, v.y);
    m.rotation.y = verticeAng(k);
  }
  const moldurasDaRotunda: Array<[Perfil, THREE.Material]> = [
    [[[0, 0], [0.24, 0], [0.24, PLINTO - 0.06], [0.14, PLINTO], [0, PLINTO]], pedraEscura],
    [[[0, 3.84], [0.25, 3.86], [0.25, 4.16], [0.15, 4.24], [0, 4.24]], pedra],
    [[[0, CORNIJA_ALA], [0.25, CORNIJA_ALA], [0.25, CORNIJA_ALA + 0.5], [0, CORNIJA_ALA + 0.5]], pedra],
    [[
      [0, TOPO_ROTUNDA - 0.6], [0.25, TOPO_ROTUNDA - 0.6], [0.25, TOPO_ROTUNDA - 0.44],
      ...cavetinho([0.25, TOPO_ROTUNDA - 0.44], [0.48, TOPO_ROTUNDA - 0.12]),
      [0.48, TOPO_ROTUNDA + 0.06], [0, TOPO_ROTUNDA + 0.06],
    ], pedra],
  ];
  for (const [perfil, mat] of moldurasDaRotunda) g.add(new THREE.Mesh(contornoPoligonal(perfil, octogono), mat));

  portalDaEntrada(g, { tijolo, pedra, pedraEscura, caixilhoMat, dourado, luz: luzDaLanterna, peca, barra, pedraEm, vidroEm });
  cupula(g, { metalDaCupula, costuras, branco, colunas, dourado, escuro, pedra });

  caixilhos.montar(g);
  pedras.montar(g);
  costuras.montar(g);
  colunas.montar(g);
  // todo o vidro do prédio numa malha
  const vidro = new THREE.Mesh(mergeGeometries(vidros.map((v) => (v.index ? v.toNonIndexed() : v))), vidroMat);
  g.add(vidro);
  return g;
}

// ============================================================ o telhado da ala

interface CoisasDoTelhado {
  maquina: THREE.Material;
  grade: THREE.Material;
  escuro: THREE.Material;
  vidroMat: THREE.Material;
  vidros: THREE.BufferGeometry[];
  pedra: THREE.Material;
}

/**
 * O ALTO DA ALA, que a câmera de 34° vê tanto quanto a fachada: duas máquinas
 * de ar (a caixa de quina macia, a grade nas laterais e o ventilador em cima)
 * e uma fila de clarabóias (a moldura e o vidro inclinado), mais os ralos.
 */
function telhadoDaAla(g: THREE.Group, cx: number, lado: number, c: CoisasDoTelhado): void {
  const t = new THREE.Group();
  t.position.set(cx, LAJE, (ALA.z0 + ALA.z1) / 2);
  g.add(t);
  // as máquinas de ar, no fundo (o lado que a fachada esconde menos)
  for (const dx of [-6.5, 5.5]) {
    const x = dx * lado;
    const corpo = new THREE.Mesh(quina(2.2, 1.1, 1.6, 0.06), c.maquina);
    corpo.position.set(x, 0.55, -3.4);
    t.add(corpo);
    const lateral = new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(2.24, 0.7, 1.64)), c.grade);
    lateral.position.set(x, 0.5, -3.4);
    t.add(lateral);
    const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.12, 20), c.maquina);
    aro.position.set(x + 0.3, 1.14, -3.4);
    t.add(aro);
    const boca = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.13, 20), c.escuro);
    boca.position.set(x + 0.3, 1.145, -3.4);
    t.add(boca);
    // as pás do ventilador (paradas; o motor é o miolo)
    for (let k = 0; k < 4; k++) {
      const pa = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.02, 0.14), c.maquina);
      pa.position.set(x + 0.3, 1.2, -3.4);
      pa.rotation.y = (k * Math.PI) / 4 + 0.3;
      t.add(pa);
    }
    const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10), c.escuro);
    miolo.position.set(x + 0.3, 1.24, -3.4);
    t.add(miolo);
    // a base de concreto em que ela pousa
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 2.0), c.pedra);
    base.position.set(x, 0.06, -3.4);
    t.add(base);
  }
  // as clarabóias, numa fila no meio da laje
  for (const dx of [-6.2, -1.5, 3.2, 7.9]) {
    const x = dx * lado;
    const moldura = new THREE.Mesh(quina(1.5, 0.32, 1.1, 0.04), c.maquina);
    moldura.position.set(x, 0.16, 0.6);
    t.add(moldura);
    const vidro = vidroDeJanela(1.3, 0.95);
    vidro.rotateX(-Math.PI / 2 + 0.18);
    vidro.translate(x, 0.35, 0.6);
    vidro.applyMatrix4(new THREE.Matrix4().makeTranslation(t.position.x, t.position.y, t.position.z));
    c.vidros.push(vidro);
  }
}

// ============================================================== o portal

interface CoisasDoPortal {
  tijolo: THREE.Material;
  pedra: THREE.Material;
  pedraEscura: THREE.Material;
  caixilhoMat: THREE.Material;
  dourado: THREE.Material;
  luz: THREE.Material;
  peca: (pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x?: number, y?: number, z?: number) => THREE.Mesh;
  barra: (q: THREE.Object3D, x: number, y: number, z: number, l: number, a: number, p: number, giro?: number) => void;
  pedraEm: (q: THREE.Object3D, x: number, y: number, z: number, l: number, a: number, p: number, cor?: number) => void;
  vidroEm: (q: THREE.Object3D, geo: THREE.BufferGeometry, x: number, y: number, z: number) => void;
}

/**
 * O PORTAL DA ENTRADA: um bloco de tijolo saltado 1,3 m da face da frente,
 * com o ARCO de verdade atravessando (o túnel de tijolo), o arco de pedra
 * com a chave em volta, a placa "ESCOLA DO GATITO" no friso de cima e a
 * cornija. Lá no fundo do arco, a porta de vidro: duas folhas, as duas
 * vidraças do lado e a bandeira em leque, tudo de caixilho branco — a porta
 * da foto. E as duas arandelas acesas.
 */
function portalDaEntrada(g: THREE.Group, c: CoisasDoPortal): void {
  const MEIA = PREDIO_DA_ESCOLA.portal.meia;
  const FUNDO = PREDIO_DA_ESCOLA.portal.frente - APOTEMA;
  const { meia: AR, pernas: PERNAS } = PREDIO_DA_ESCOLA.arco;
  const RY = PREDIO_DA_ESCOLA.arco.alto - PERNAS;
  const TOPO = 5.15;
  const q = new THREE.Group();
  q.position.set(0, 0, PREDIO_DA_ESCOLA.portal.frente);
  q.updateMatrix();
  g.add(q);
  // o bloco: a frente com o arco recortado até o chão, extrudada para trás até a rotunda
  const forma = new THREE.Shape();
  forma.moveTo(-MEIA, 0);
  forma.lineTo(-AR, 0);
  forma.lineTo(-AR, PERNAS);
  forma.absellipse(0, PERNAS, AR, RY, Math.PI, 0, true, 0);
  forma.lineTo(AR, 0);
  forma.lineTo(MEIA, 0);
  forma.lineTo(MEIA, TOPO);
  forma.lineTo(-MEIA, TOPO);
  forma.closePath();
  c.peca(q, extrudar(forma, FUNDO + 0.3, -FUNDO - 0.3, 20), c.tijolo);
  // o arco de pedra em volta do vão, com a chave
  c.peca(q, extrudar(moldeEmArco(0, PLINTO, PERNAS, AR, RY, AR + 0.32, RY + 0.32), 0.1, -0.03, 24), c.pedra);
  c.pedraEm(q, 0, PERNAS + RY + 0.2, 0.05, 0.42, 0.62, 0.16);
  // as impostas: o bloco de pedra onde o arco nasce
  for (const s of [-1, 1]) c.pedraEm(q, s * (AR + 0.16), PERNAS - 0.08, 0.06, 0.56, 0.22, 0.18);
  // a placa do friso, a cornija e o plinto do portal
  const letreiro = letreiroDoArco('ESCOLA DO GATITO', 3.9, 0.62);
  letreiro.position.set(0, 4.62, 0.05);
  q.add(letreiro);
  c.pedraEm(q, 0, 4.62, 0.01, 4.1, 0.78, 0.06);
  const cornija: Perfil = [
    [0, TOPO - 0.42], [0.16, TOPO - 0.42], [0.16, TOPO - 0.3],
    ...cavetinho([0.16, TOPO - 0.3], [0.34, TOPO - 0.06]),
    [0.34, TOPO + 0.1], [0, TOPO + 0.1],
  ];
  // (o bloco vai da frente, `z = 0`, até 30 cm dentro da rotunda)
  const MEIO_DO_BLOCO = -(FUNDO + 0.3) / 2;
  const corn = new THREE.Mesh(contorno(cornija, MEIA, (FUNDO + 0.3) / 2), c.pedra);
  corn.position.set(0, 0, MEIO_DO_BLOCO);
  q.add(corn);
  // o alto do portal: a tampa de pedra e uma platibandinha
  c.peca(q, new THREE.BoxGeometry(MEIA * 2 + 0.56, 0.12, FUNDO + 0.6), c.pedraEscura, 0, TOPO + 0.15, MEIO_DO_BLOCO + 0.15);
  const plinto = new THREE.Mesh(contorno([[0, 0], [0.12, 0], [0.12, PLINTO - 0.05], [0.05, PLINTO], [0, PLINTO]], MEIA, (FUNDO + 0.3) / 2, [
    { lado: 'frente', de: -AR - 0.02, ate: AR + 0.02 },
  ]), c.pedra);
  plinto.position.set(0, 0, MEIO_DO_BLOCO);
  q.add(plinto);

  // ------------------------------------------------- a porta, no fundo do arco
  const ZP = -FUNDO + 0.22;
  const vidroArco = new THREE.ShapeGeometry(arco(new THREE.Shape(), 0, 0, PERNAS, AR, RY), 24);
  const cor = new Float32Array(vidroArco.getAttribute('position').count * 3);
  const pos = vidroArco.getAttribute('position');
  const e = new THREE.Color(P.escolaVidroFora);
  const b = new THREE.Color(P.escolaVidroBrilho);
  for (let i = 0; i < pos.count; i++) {
    const t = Math.max(0, 1 - Math.abs(pos.getX(i) / AR + pos.getY(i) / 3.9 - 0.75) * 2.4);
    const k = e.clone().lerp(b, t * 0.75 + (pos.getY(i) / 3.9) * 0.12);
    cor.set([k.r, k.g, k.b], i * 3);
  }
  vidroArco.setAttribute('color', new THREE.BufferAttribute(cor, 3));
  c.vidroEm(q, vidroArco, 0, 0, ZP - 0.03);
  const B = 0.1;
  // o batente: as duas pernas e a travessa da bandeira
  c.barra(q, -AR + B / 2, PERNAS / 2, ZP, B, PERNAS, 0.14);
  c.barra(q, AR - B / 2, PERNAS / 2, ZP, B, PERNAS, 0.14);
  c.barra(q, 0, 2.62, ZP, AR * 2, 0.12, 0.14);
  // as duas folhas (0,95 cada, no meio) e as vidraças do lado
  for (const x of [-0.95, 0, 0.95]) c.barra(q, x, 1.31, ZP + 0.01, 0.12, 2.56, 0.12);
  for (const x of [-1.32, 1.32]) c.barra(q, x, 1.31, ZP, 0.07, 2.56, 0.1);
  c.barra(q, 0, 0.06, ZP + 0.01, AR * 2, 0.12, 0.14);
  // o rodapé de alumínio das folhas e o puxador de barra
  for (const s of [-1, 1]) {
    c.barra(q, s * 0.475, 0.2, ZP + 0.02, 0.83, 0.28, 0.08);
    const puxador = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), c.dourado);
    puxador.rotation.z = Math.PI / 2;
    puxador.position.set(s * 0.45, 1.05, ZP + 0.1);
    q.add(puxador);
  }
  // a bandeira em leque: os raios saindo do meio da travessa
  for (let k = 1; k < 6; k++) {
    const a = Math.PI - (k / 6) * Math.PI;
    const comp = Math.hypot(Math.cos(a) * AR, Math.sin(a) * RY) * 0.95 + (PERNAS - 2.62);
    c.barra(q, Math.cos(a) * comp / 2, 2.62 + Math.sin(a) * comp / 2, ZP, 0.05, comp, 0.08, a - Math.PI / 2);
  }
  // o chão do arco: a soleira de pedra
  c.pedraEm(q, 0, 0.03, -FUNDO / 2 + 0.1, AR * 2, 0.06, FUNDO + 0.1, P.escolaPedraSombra);

  // as arandelas dos dois lados do arco: braço de ferro, a lanterna acesa e o telhadinho
  for (const s of [-1, 1]) {
    const x = s * (MEIA - 0.42);
    const braco = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.3), c.caixilhoMat);
    braco.position.set(x, 2.55, 0.15);
    q.add(braco);
    const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.36, 6), c.luz);
    vidro.position.set(x, 2.4, 0.32);
    q.add(vidro);
    const chapeu = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.16, 6), c.dourado);
    chapeu.position.set(x, 2.66, 0.32);
    q.add(chapeu);
    const fundoDaLanterna = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.08, 6), c.dourado);
    fundoDaLanterna.position.set(x, 2.18, 0.32);
    q.add(fundoDaLanterna);
  }
}

// =========================================================== a cúpula

interface CoisasDaCupula {
  metalDaCupula: THREE.Material;
  costuras: Lote;
  branco: THREE.Material;
  colunas: Lote;
  dourado: THREE.Material;
  escuro: THREE.Material;
  pedra: THREE.Material;
}

/** um torno de 8 gomos com a QUINA do octógono no lugar da quina da rotunda, facetado */
function tornoOitavado(perfil: Array<[number, number]>): THREE.BufferGeometry {
  // o LatheGeometry põe o vértice em `phi`: x = r sen(phi), z = r cos(phi), como a rotunda
  const geo = new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), 8, OITAVO);
  const solta = geo.toNonIndexed();
  solta.computeVertexNormals();
  // o torno acerta o sentido pelo perfil: escrito de baixo para cima, de fora para dentro, a face olha para fora
  return solta;
}

/**
 * A CÚPULA: o telhado baixo de oito gomos de metal cinza com as costuras em
 * pé (a chapa de metal "standing seam" da foto), e a LANTERNINHA branca no
 * alto — o tambor, oito colunas, a cornija, a cupulazinha e o pináculo
 * dourado. Lá dentro, pendurado entre as colunas, o SINO da escola.
 */
function cupula(g: THREE.Group, c: CoisasDaCupula): void {
  const Y0 = TOPO_ROTUNDA + 0.02;
  const R0 = R + 0.35;
  const Y1 = 14.0;
  const R1 = 2.55;
  // o telhado: uma aba que pinga, a barriga côncava e a borda em cima
  const perfil: Array<[number, number]> = [
    [R - 0.3, Y0 - 0.05], [R0, Y0 + 0.08], [R0 - 0.05, Y0 + 0.26],
    [R0 - 1.6, Y0 + 1.15], [R0 - 3.0, Y0 + 2.1], [R1 + 0.2, Y1 - 0.15], [R1, Y1], [0.01, Y1],
  ];
  g.add(new THREE.Mesh(tornoOitavado(perfil), c.metalDaCupula));
  // as costuras: seis por gomo, do pé da barriga até a borda de cima, em pé na chapa
  const baixo = (k: number, r: number, y: number): THREE.Vector3 => {
    const a = OITAVO + (k * Math.PI) / 4;
    return new THREE.Vector3(r * Math.sin(a), y, r * Math.cos(a));
  };
  for (let k = 0; k < 8; k++) {
    for (let j = 0; j <= 6; j++) {
      const t = j / 6;
      for (const [ra, ya, rb, yb] of [
        [R0 - 0.05, Y0 + 0.26, R0 - 1.6, Y0 + 1.15],
        [R0 - 1.6, Y0 + 1.15, R0 - 3.0, Y0 + 2.1],
        [R0 - 3.0, Y0 + 2.1, R1 + 0.2, Y1 - 0.15],
      ] as const) {
        const a = baixo(k, ra, ya).lerp(baixo(k + 1, ra, ya), t);
        const b = baixo(k, rb, yb).lerp(baixo(k + 1, rb, yb), t);
        const meio = a.clone().add(b).multiplyScalar(0.5);
        // a costura fica em pé sobre a chapa: sobe meia altura na direção da normal do gomo
        const dir = b.clone().sub(a);
        const comp = dir.length();
        const fora = new THREE.Vector3(Math.sin(OITAVO + (k + 0.5) * Math.PI / 4), 0, Math.cos(OITAVO + (k + 0.5) * Math.PI / 4));
        const normal = fora.clone().multiplyScalar(dir.y).add(new THREE.Vector3(0, -dir.dot(fora), 0)).normalize();
        meio.addScaledVector(normal, 0.03);
        const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(
          new THREE.Vector3().crossVectors(dir.clone().normalize(), normal),
          dir.clone().normalize(), normal,
        ));
        if (j === 0 || j === 6) continue; // a quina do gomo tem a sua (mais grossa, abaixo)
        c.costuras.por(null, meio, quat, new THREE.Vector3(0.05, comp, 0.07));
      }
    }
  }
  // a quina de cada gomo: uma costura mais grossa, do pé até a lanterna
  for (let k = 0; k < 8; k++) {
    const pontos: Array<[number, number]> = [[R0 - 0.05, Y0 + 0.26], [R0 - 1.6, Y0 + 1.15], [R0 - 3.0, Y0 + 2.1], [R1 + 0.2, Y1 - 0.15]];
    for (let i = 0; i < pontos.length - 1; i++) {
      const a = baixo(k, pontos[i][0], pontos[i][1]);
      const b = baixo(k, pontos[i + 1][0], pontos[i + 1][1]);
      const dir = b.clone().sub(a);
      const meio = a.clone().add(b).multiplyScalar(0.5);
      const radial = new THREE.Vector3(meio.x, 0, meio.z).normalize();
      const normal = radial.clone().multiplyScalar(dir.y).add(new THREE.Vector3(0, -dir.dot(radial), 0)).normalize();
      meio.addScaledVector(normal, 0.05);
      const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(
        new THREE.Vector3().crossVectors(dir.clone().normalize(), normal),
        dir.clone().normalize(), normal,
      ));
      c.costuras.por(null, meio, quat, new THREE.Vector3(0.1, dir.length() + 0.04, 0.11));
    }
  }

  // ------------------------------------------------------- a lanterninha
  const L0 = Y1;
  // o tambor branco, com uma cornijinha
  g.add(new THREE.Mesh(tornoOitavado([
    [2.42, L0 - 0.1], [2.42, L0 + 0.62], [2.56, L0 + 0.7], [2.56, L0 + 0.86], [2.2, L0 + 0.9], [0.01, L0 + 0.9],
  ]), c.branco));
  const PE = L0 + 0.9;
  const ALTO_COLUNA = 2.35;
  const TOPO_COL = PE + ALTO_COLUNA;
  // a lanterna é ABERTA, como a da foto: entre as colunas se vê o céu e o sino.
  // Por baixo da cupulazinha, o forro (a mesma casca, do avesso, mais escura)
  g.add(new THREE.Mesh(tornoOitavado([[0.01, TOPO_COL + 0.04], [2.25, TOPO_COL + 0.04]]), c.pedra));
  for (let k = 0; k < 8; k++) {
    const a = OITAVO + (k * Math.PI) / 4;
    const r = 2.05;
    // a coluna com a base e o capitel (três cópias do mesmo cilindro)
    c.colunas.por(null, new THREE.Vector3(r * Math.sin(a), PE + ALTO_COLUNA / 2, r * Math.cos(a)), new THREE.Quaternion(), new THREE.Vector3(0.12, ALTO_COLUNA, 0.12));
    c.colunas.por(null, new THREE.Vector3(r * Math.sin(a), PE + 0.08, r * Math.cos(a)), new THREE.Quaternion(), new THREE.Vector3(0.2, 0.16, 0.2));
    c.colunas.por(null, new THREE.Vector3(r * Math.sin(a), TOPO_COL - 0.08, r * Math.cos(a)), new THREE.Quaternion(), new THREE.Vector3(0.2, 0.16, 0.2));
  }
  // o guarda-corpo baixo entre as colunas: uma faixa branca a meia altura de um palmo
  g.add(new THREE.Mesh(tornoOitavado([[2.12, PE], [2.12, PE + 0.55], [2.0, PE + 0.55], [2.0, PE]]), c.branco));
  // a cornija de cima e a cupulazinha, e o pináculo dourado
  g.add(new THREE.Mesh(tornoOitavado([
    [2.2, TOPO_COL - 0.02], [2.5, TOPO_COL + 0.1], [2.5, TOPO_COL + 0.38], [2.28, TOPO_COL + 0.46],
    [2.0, TOPO_COL + 0.9], [1.45, TOPO_COL + 1.45], [0.75, TOPO_COL + 1.8], [0.3, TOPO_COL + 1.92], [0.01, TOPO_COL + 1.94],
  ]), c.branco));
  const PINACULO = TOPO_COL + 1.94;
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), c.dourado);
  bola.position.y = PINACULO + 0.18;
  g.add(bola);
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.07, 1.1, 8), c.dourado);
  ponta.position.y = PINACULO + 0.9;
  g.add(ponta);
  const anel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.18, 10), c.dourado);
  anel.position.y = PINACULO + 0.02;
  g.add(anel);
  // o sino: torneado, a boca virada para baixo, pendurado na trave
  const sino = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.01, 0), new THREE.Vector2(0.55, 0.02), new THREE.Vector2(0.5, 0.12), new THREE.Vector2(0.4, 0.4),
    new THREE.Vector2(0.34, 0.75), new THREE.Vector2(0.24, 0.9), new THREE.Vector2(0.01, 0.95),
  ], 16), c.dourado);
  sino.position.y = PE + 0.75;
  g.add(sino);
  const trave = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.14, 0.16), c.branco);
  trave.position.y = PE + 1.82;
  g.add(trave);
  const argola = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 12), c.dourado);
  argola.position.y = PE + 1.72;
  g.add(argola);
}
