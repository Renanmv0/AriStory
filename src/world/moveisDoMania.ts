import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { flat, toon } from '../core/materials';
import { ARI, RENAN } from '../characters/cast';
import { PALETTE as P } from '../palette';
import { uvDeParede, uvEmMetros, uvEmMetrosPorTriangulo } from './acabamento';
import { haloDeLampada, pintarOWalter, pocaDeLuz } from './furniture';
import { Lote, arco, extrudar, retangulo } from './lojaDeRoupas';
import { cavetinho, type Perfil } from './molduras';
import { frisoReto } from './moveisDaBoutique';
import { letreiroDoMania } from './restauranteDoClube';
import {
  ardosia, azulejoDeMetro, espelhoDeBar, granito, inoxEscovado, tabuasDeLambri, toalhaXadrez, veioDeMadeira,
} from './texturasDeCasa';
import { reboco, tijolinho } from './texturasDeFachada';
import { sorteio } from './texturasDeChao';

/**
 * ===================================== O MANIA DE CHURRASCO, POR DENTRO
 *
 * A reforma do salão e da cozinha do restaurante do clube, com as mesmas
 * técnicas da casa do Ari, da boutique da Estella e do prédio por fora. O
 * pedido do Renan foi "melhore todos os objetos, os móveis, a iluminação e
 * tudo mais — mantenha as funcionalidades": por isso cada peça daqui ocupa o
 * MESMO lugar, tem o MESMO tamanho por fora e a MESMA etiqueta da peça antiga
 * que ela substitui (os colisores, os pontos de interação, a altura do tampo
 * onde o turno pousa o prato e os testes continuam valendo).
 *
 * O que muda na tela:
 *
 *  - A CHURRASQUEIRA é alvenaria de TIJOLINHO de verdade (o mesmo do prédio
 *    por fora, em canvas), com dois NICHOS DE LENHA em arco (furos na forma
 *    extrudada) e as achas empilhadas em instância — a casca e o corte de
 *    cada uma; o tampo de pedra, a caixa de brasa com o carvão e as brasas
 *    acesas (três lotes, o aceso com `glow`), a grelha de barras, cinco
 *    ESPETOS com picanha em meia-lua, linguiça e maminha, a coifa de inox em
 *    rampa, a chaminé, os utensílios pendurados e o LARANJA da brasa
 *    pintado na parede, no chão e no ar em volta;
 *  - a COZINHA de inox ESCOVADO (`inoxEscovado`): o fogão com quatro bocas
 *    de chama azul, trempes de ferro, botões torneados, o vidro do forno
 *    aceso, o caldeirão, a panela e a frigideira de farofa; as bancadas de
 *    borda boleada, pés com sapata e a prateleira de baixo cheia (panelas,
 *    caixotes de tomate e cebola, cubas, sal grosso); a pia de DUAS CUBAS
 *    (furos no tampo e a cuba aberta por dentro), a ducha de mola e o
 *    escorredor de louça; a geladeira industrial; as prateleiras de parede
 *    com os potes e os utensílios pendurados;
 *  - os BALCÕES de madeira com MOLDURA E ALMOFADA (montante, travessa e o
 *    painel levantado com bisel), tampo de GRANITO escuro com a quina boleada
 *    na mesma altura de antes (1,15); na passagem, o trilho das comandas e a
 *    campainha; no bar, o apoio de pé de latão e a chopeira;
 *  - o BAR: a estante com espelho, cornija com perfil, prateleiras com friso
 *    de latão e as garrafas TORNEADAS em instância (quatro feitios, a cor e o
 *    rótulo por cópia), a luz de LED pintada no espelho; as banquetas de pé
 *    torneado com aro de latão e assento de couro capitonê; a registradora
 *    antiga de latão com o teclado em degraus e o mostrador;
 *  - a LUZ: pendentes de ESMALTE no teal do clube com a poça de luz no
 *    balcão, lampiões de parede com o leque pintado, a luz da brasa, a luz de
 *    quadro em cima do Walter e as lâmpadas pescoço-de-ganso na placa — tudo
 *    luz pintada (`pocaDeLuz`, `haloDeLampada`), nenhuma luz de verdade;
 *  - a MESA posta: tampo de madeira de pés torneados, a toalha xadrez
 *    CAINDO (uma malha com as pontas descendo nas quinas e as dobras), o
 *    porta-temperos em lote, o vasinho na `floreira` (o grupo com nome que a
 *    cena esconde quando o prato chega) e as quatro cadeiras de bistrô;
 *  - as PAREDES: reboco, tijolinho atrás da grelha, azulejo de metrô atrás
 *    da pia, o lambri de tábuas em pé com rodapé e cimalha de perfil, a
 *    mureta de tijolinho com a capa de madeira, e os pilaretes torneados da
 *    entrada;
 *  - os QUADROS: as lousas de ardósia com a moldura de bisel e a canaleta de
 *    giz, a placa do nome em tábua com o filete dourado, o empregado do mês
 *    em moldura dourada e o cartaz dos CORTES DO BOI.
 *
 * E LEVE: o que se repete (acha, brasa, garrafa, rótulo, botão, tecla, pote,
 * prato no escorredor, comanda, tempero) é `Lote` (`InstancedMesh`), e a cena
 * passa cada peça por `fundir()`.
 */

// ================================================================ base

/**
 * Caixa de quina arredondada: o tijolo de tudo que a mão encosta.
 *
 * A QUINA DE ATÉ 2 CM SAI EM UM DEGRAU SÓ (um chanfro), a maior em dois: a
 * esta distância de câmera, um arredondado de 5 mm em dois degraus é a mesma
 * imagem do chanfro — e custa o triplo de triângulos (300 contra 108 por
 * caixa). Nas onze mesas, com as cadeiras, é a diferença entre 100 mil e 40
 * mil triângulos no salão.
 */
function macia(l: number, a: number, p: number, raio = 0.02): THREE.BufferGeometry {
  const r = Math.min(raio, l / 2 - 0.001, a / 2 - 0.001, p / 2 - 0.001);
  return new RoundedBoxGeometry(l, a, p, raio > 0.02 ? 2 : 1, r);
}

/** o UV em metros: a caixa decide por vértice, o resto por triângulo */
function emMetros(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  if (geo.type === 'BoxGeometry') {
    uvEmMetros(geo);
    return geo;
  }
  return uvEmMetrosPorTriangulo(geo);
}

/**
 * Uma malha posta no pai, na posição dada. Material com textura ganha o UV em
 * metros sozinho (o veio, o escovado e o granito saem do mesmo tamanho em
 * toda parte).
 */
function por(
  pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material | number,
  x = 0, y = 0, z = 0,
): THREE.Mesh {
  const material = typeof mat === 'number' ? toon(mat) : mat;
  const comMapa = (material as THREE.MeshToonMaterial).map !== null && (material as THREE.MeshToonMaterial).map !== undefined;
  const m = new THREE.Mesh(comMapa ? emMetros(geo) : geo, material);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

/**
 * Um perfil torneado (`[raio, altura]`).
 *
 * O `LatheGeometry` vira a face para FORA só quando o perfil roda no sentido
 * anti-horário (sobe por fora); escrito de cima para baixo, a peça nasce do
 * avesso e some na câmera (o lado de dentro é que fica visível). Aqui o
 * sentido é conferido pela área do perfil e acertado sozinho — e `avesso`
 * pede a face para DENTRO, que é o forro de uma cúpula.
 */
function torneado(perfil: ReadonlyArray<readonly [number, number]>, gomos = 20, avesso = false): THREE.LatheGeometry {
  let area = 0;
  for (let i = 0; i < perfil.length; i++) {
    const [r0, y0] = perfil[i];
    const [r1, y1] = perfil[(i + 1) % perfil.length];
    area += r0 * y1 - r1 * y0;
  }
  const pontos = perfil.map(([r, y]) => new THREE.Vector2(r, y));
  if ((area < 0) !== avesso) pontos.reverse();
  return new THREE.LatheGeometry(pontos, gomos);
}

/** um tubo pelos pontos (curva suave) */
function tubo(pontos: ReadonlyArray<readonly [number, number, number]>, raio: number, segs = 20, radial = 6): THREE.TubeGeometry {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pontos.map(([x, y, z]) => new THREE.Vector3(x, y, z))),
    segs, raio, radial, false,
  );
}

/** um caminho de retas com a quina arredondada em raio `r` (o tubo dobrado do puxador) */
function dobrado(pontos: ReadonlyArray<readonly [number, number, number]>, r: number): THREE.CurvePath<THREE.Vector3> {
  const caminho = new THREE.CurvePath<THREE.Vector3>();
  const v = pontos.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  let atual = v[0].clone();
  for (let i = 1; i < v.length; i++) {
    const quina = v[i];
    if (i === v.length - 1) {
      caminho.add(new THREE.LineCurve3(atual, quina));
      break;
    }
    const antes = quina.clone().sub(v[i - 1]).normalize();
    const depois = v[i + 1].clone().sub(quina).normalize();
    const entra = quina.clone().addScaledVector(antes, -r);
    const sai = quina.clone().addScaledVector(depois, r);
    caminho.add(new THREE.LineCurve3(atual, entra));
    caminho.add(new THREE.QuadraticBezierCurve3(entra, quina.clone(), sai));
    atual = sai;
  }
  return caminho;
}

/** o PUXADOR de tubo: uma alça deitada em X, saindo `afasta` para `+Z` nas duas pontas */
function alca(comprimento: number, afasta = 0.045, raio = 0.011): THREE.TubeGeometry {
  const L = comprimento / 2;
  return new THREE.TubeGeometry(
    dobrado([[-L, 0, 0], [-L, 0, afasta], [L, 0, afasta], [L, 0, 0]], Math.min(0.02, afasta * 0.45)),
    28, raio, 6, false,
  );
}

/** um retângulo de quina redonda (a forma do tampo, do furo da cuba, da placa) */
function retanguloRedondo<T extends THREE.Path>(alvo: T, cx: number, cy: number, w: number, h: number, r: number): T {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - h / 2;
  const y1 = cy + h / 2;
  alvo.moveTo(x0 + r, y0);
  alvo.lineTo(x1 - r, y0);
  alvo.quadraticCurveTo(x1, y0, x1, y0 + r);
  alvo.lineTo(x1, y1 - r);
  alvo.quadraticCurveTo(x1, y1, x1 - r, y1);
  alvo.lineTo(x0 + r, y1);
  alvo.quadraticCurveTo(x0, y1, x0, y1 - r);
  alvo.lineTo(x0, y0 + r);
  alvo.quadraticCurveTo(x0, y0, x0 + r, y0);
  return alvo;
}

/**
 * Uma MOLDURA em pé: o anel de `largura × altura` com o vão de dentro,
 * extrudado com BISEL (o chanfro pega o degrau de luz do toon nas duas
 * bordas). Nasce com a face de trás em `z = 0`.
 */
function molduraDeBisel(largura: number, altura: number, aba: number, fundo: number, bisel = 0.01): THREE.BufferGeometry {
  const fora = retanguloRedondo(new THREE.Shape(), 0, 0, largura - 2 * bisel, altura - 2 * bisel, 0.012);
  fora.holes.push(retanguloRedondo(new THREE.Path(), 0, 0, largura - 2 * aba + 2 * bisel, altura - 2 * aba + 2 * bisel, 0.006));
  const geo = new THREE.ExtrudeGeometry(fora, {
    depth: Math.max(0.002, fundo - 2 * bisel), bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel,
    bevelSegments: 2, curveSegments: 4,
  });
  geo.translate(0, 0, bisel);
  return geo;
}

/** a quaternion que leva o `+Y` para a direção dada */
function apontando(dir: THREE.Vector3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
}

/**
 * A CUBA ABERTA: o fundo e as quatro paredes de uma caixa sem tampa, com a
 * normal virada para DENTRO — é o lado que se vê, olhando de cima pelo furo
 * do tampo. A boca fica em `y = 0` e o fundo em `-fundo`.
 */
function cubaAberta(l: number, p: number, fundo: number): THREE.BufferGeometry {
  const x = l / 2;
  const z = p / 2;
  const y = -fundo;
  const quads: Array<Array<[number, number, number]>> = [
    [[-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z]],
    [[-x, y, -z], [x, y, -z], [x, 0, -z], [-x, 0, -z]],
    [[x, y, z], [-x, y, z], [-x, 0, z], [x, 0, z]],
    [[-x, y, z], [-x, y, -z], [-x, 0, -z], [-x, 0, z]],
    [[x, y, -z], [x, y, z], [x, 0, z], [x, 0, -z]],
  ];
  const pos: number[] = [];
  for (const [a, b, c, d] of quads) pos.push(...a, ...b, ...c, ...a, ...c, ...d);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

/** o pé de bancada: a sapata de nivelar, torneada, com a origem no chão */
function sapata(): THREE.LatheGeometry {
  return torneado([[0.001, 0], [0.026, 0], [0.03, 0.012], [0.022, 0.05], [0.02, 0.075], [0.001, 0.075]], 12);
}

// ============================================================ materiais

const madeira = (): THREE.MeshToonMaterial => toon(P.churrascoFaixa, { mapa: veioDeMadeira() });
const madeiraEscura = (): THREE.MeshToonMaterial => toon(P.restauranteEsquadria, { mapa: veioDeMadeira() });
const inox = (): THREE.MeshToonMaterial => toon(P.churrascoInox, { mapa: inoxEscovado() });
const inoxEscuro = (): THREE.MeshToonMaterial => toon(P.churrascoInoxEscuro, { mapa: inoxEscovado() });
const ferro = (): THREE.MeshToonMaterial => toon(P.churrascoGrelha);
const carvao = (): THREE.MeshToonMaterial => toon(P.churrascoCarvao);
const latao = (): THREE.MeshToonMaterial => toon(P.churrascoLatao);
const pedra = (): THREE.MeshToonMaterial => toon(P.restaurantePedra, { mapa: granito() });
const granitoEscuro = (): THREE.MeshToonMaterial => toon(P.churrascoGranito, { mapa: granito(0.5) });
/** o tijolo de churrascaria: o barro pintado no canvas sobre o rejunte (ver `tijolinho`) */
const tijolo = (): THREE.MeshToonMaterial => toon(P.churrascoRejunte, { mapa: tijolinho(0.84, P.churrascoTijolo) });

const hex = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const tom = (cor: number, k: number): number => new THREE.Color(cor).multiplyScalar(k).getHex();

// ======================================================= A CHURRASQUEIRA

/**
 * A CHURRASQUEIRA — o coração do lugar, e a única cor saturada da cena.
 *
 * Alvenaria de tijolinho com DOIS NICHOS DE LENHA em arco na frente (a forma
 * da frente é extrudada com os dois furos, e a parede do nicho sai do próprio
 * furo), o tampo de pedra, a caixa de brasa de ferro com o carvão e as brasas
 * acesas, a grelha, os espetos e a coifa de inox subindo até a chaminé.
 *
 * As medidas que a cena usa ficaram: o corpo de 0,95 com o tampo até 1,05,
 * 1 m de fundo (o colisor é 2,3 × 0,6), e a COIFA NASCE EM 1,94 e PARA NA
 * FRENTE DA GRELHA — quem cozinha fica a ~0,9 na frente da peça, e a 34° uma
 * coifa mais avançada esconderia a cabeça dele.
 *
 * A LUZ DA BRASA é pintada: o halo laranja sobre o carvão, o leque no tijolo
 * da parede entre a grelha e a coifa, e a poça fraca no ladrilho da frente.
 */
export function churrasqueiraDoMania(largura = 4.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'churrasqueira';
  const L = largura;
  const ALT = 0.95;
  const TAMPO = ALT + 0.1;
  const tij = tijolo();
  const deTijolo = (geo: THREE.BufferGeometry, x: number, y: number, z: number): void => {
    const m = new THREE.Mesh(uvDeParede(geo, x, y, z), tij);
    m.position.set(x, y, z);
    g.add(m);
  };

  // ------------------------------------------------- a alvenaria e os nichos
  // o miolo de trás é uma caixa; a frente é a forma com os dois arcos vazados
  deTijolo(new THREE.BoxGeometry(L, ALT, 0.5), 0, ALT / 2, -0.25);
  const NICHOS = [-L * 0.25, L * 0.25];
  const N = { meia: 0.55, base: 0.08, ombro: 0.42, flecha: 0.2 };
  const frente = retangulo(new THREE.Shape(), -L / 2, 0, L / 2, ALT);
  for (const cx of NICHOS) frente.holes.push(arco(new THREE.Path(), cx, N.base, N.ombro, N.meia, N.flecha));
  deTijolo(extrudar(frente, 0.5, 0, 16), 0, 0, 0);
  // o fundo do nicho, escuro de fuligem (um palmo na frente do miolo)
  for (const cx of NICHOS) {
    por(g, new THREE.ShapeGeometry(arco(new THREE.Shape(), cx, N.base, N.ombro, N.meia, N.flecha), 12), carvao(), 0, 0, 0.012);
  }

  /*
   * A LENHA: cada acha é um cilindro aberto (a casca) e um disco na ponta da
   * frente (o corte), em dois lotes — 28 achas, dois desenhos. Empilhadas em
   * pirâmide, cada fileira assentada no vão das de baixo.
   */
  const rnd = sorteio(1777);
  const casca = new Lote(new THREE.CylinderGeometry(1, 1, 1, 8, 1, true).rotateX(Math.PI / 2), toon(0xffffff));
  const corte = new Lote(new THREE.CircleGeometry(1, 8), toon(0xffffff));
  for (const cx of NICHOS) {
    const r = 0.062;
    for (let fila = 0; fila < 4; fila++) {
      const n = 5 - fila;
      for (let k = 0; k < n; k++) {
        const raio = r * (0.85 + rnd() * 0.25);
        const x = cx + (k - (n - 1) / 2) * r * 2.05 + (rnd() - 0.5) * 0.012;
        const y = N.base + r + fila * r * 1.78;
        const comp = 0.38 + rnd() * 0.06;
        const frenteDaAcha = 0.47 - rnd() * 0.05;
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (rnd() - 0.5) * 0.08, rnd() * 6.28));
        const centro = new THREE.Vector3(x, y, frenteDaAcha - comp / 2);
        casca.por(null, centro, q, new THREE.Vector3(raio, raio, comp), tom(P.churrascoLenha, 0.8 + rnd() * 0.35));
        const ponta = new THREE.Vector3(0, 0, comp / 2).applyQuaternion(q).add(centro);
        corte.por(null, ponta, q, new THREE.Vector3(raio * 0.92, raio * 0.92, 1), tom(P.churrascoLenhaCorte, 0.88 + rnd() * 0.15));
      }
    }
  }
  casca.montar(g);
  corte.montar(g);

  // ------------------------------------------------------ o tampo de pedra
  por(g, macia(L + 0.12, 0.1, 1.12, 0.03), pedra(), 0, ALT + 0.05, 0);

  // ------------------------------------------------------- a caixa de brasa
  const FOGO = { w: L - 0.5, d: 0.62 };
  for (const s of [-1, 1] as const) {
    por(g, macia(FOGO.w + 0.09, 0.07, 0.045, 0.01), ferro(), 0, TAMPO + 0.025, s * (FOGO.d / 2 + 0.022));
    por(g, macia(0.04, 0.066, FOGO.d, 0.01), ferro(), s * (FOGO.w / 2 + 0.02), TAMPO + 0.023, 0);
  }
  // o leito de carvão, e as brasas por cima em três lotes: apagada, acesa, viva
  por(g, new THREE.BoxGeometry(FOGO.w, 0.03, FOGO.d), carvao(), 0, TAMPO + 0.01, 0);
  const pedrinha = new THREE.IcosahedronGeometry(1, 0);
  const apagadas = new Lote(pedrinha, carvao());
  const acesas = new Lote(pedrinha, toon(P.churrascoBrasa, { glow: 0.6 }));
  const vivas = new Lote(pedrinha, toon(P.churrascoBrasaViva, { glow: 0.95 }));
  for (let i = 0; i < 120; i++) {
    const x = (rnd() - 0.5) * (FOGO.w - 0.08);
    const z = (rnd() - 0.5) * (FOGO.d - 0.08);
    const s = 0.028 + rnd() * 0.026;
    const sorte = rnd();
    const lote = sorte < 0.42 ? apagadas : sorte < 0.84 ? acesas : vivas;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3));
    lote.por(null, new THREE.Vector3(x, TAMPO + 0.025 + s * 0.35, z), q, new THREE.Vector3(s * 1.25, s * 0.7, s));
  }
  apagadas.montar(g);
  acesas.montar(g);
  vivas.montar(g);

  // ---------------------------------------------------------------- a grelha
  const Y_GRELHA = TAMPO + 0.15;
  const barras = Math.round(FOGO.w / 0.085);
  for (let i = 0; i <= barras; i++) {
    const x = -FOGO.w / 2 + (i * FOGO.w) / barras;
    por(g, new THREE.CylinderGeometry(0.008, 0.008, FOGO.d + 0.02, 5, 1, true).rotateX(Math.PI / 2), ferro(), x, Y_GRELHA, 0);
  }
  for (const s of [-1, 1] as const) {
    por(g, macia(FOGO.w + 0.05, 0.022, 0.03, 0.006), ferro(), 0, Y_GRELHA - 0.018, s * (FOGO.d / 2 - 0.01));
    for (const sx of [-1, 1] as const) {
      por(g, new THREE.CylinderGeometry(0.011, 0.011, Y_GRELHA - TAMPO - 0.02, 6), ferro(),
        sx * (FOGO.w / 2 - 0.04), (TAMPO + 0.06 + Y_GRELHA - 0.02) / 2, s * (FOGO.d / 2 - 0.01));
    }
  }

  // --------------------------------------------------------------- os espetos
  const Y_ESPETO = Y_GRELHA + 0.012;
  const espeto = (x: number, carne: 'picanha' | 'linguica' | 'maminha'): void => {
    por(g, macia(0.012, 0.004, 1.02, 0.0015), inox(), x, Y_ESPETO, 0.12);
    por(g, macia(0.036, 0.036, 0.15, 0.012), madeiraEscura(), x, Y_ESPETO, 0.66);
    por(g, new THREE.CylinderGeometry(0.02, 0.02, 0.012, 10).rotateX(Math.PI / 2), latao(), x, Y_ESPETO, 0.58);
    const zs = [-0.22, -0.07, 0.08, 0.23];
    if (carne === 'picanha') {
      // a picanha dobrada em meia-lua, a capa de gordura por fora: o espeto
      // atravessa as duas pontas da dobra
      for (const z of zs) {
        const bife = new THREE.TorusGeometry(0.05, 0.028, 6, 12, Math.PI * 1.3).rotateZ(-Math.PI * 0.15).rotateY(Math.PI / 2);
        por(g, bife, P.churrascoCarne, x, Y_ESPETO + 0.023, z);
        const capa = new THREE.TorusGeometry(0.072, 0.013, 5, 12, Math.PI * 1.05).rotateZ(-Math.PI * 0.025).rotateY(Math.PI / 2);
        por(g, capa, P.churrascoGordura, x, Y_ESPETO + 0.023, z);
      }
    } else if (carne === 'linguica') {
      for (let k = 0; k < 5; k++) {
        const gomo = new THREE.CapsuleGeometry(0.026, 0.075, 4, 8).rotateX(Math.PI / 2);
        por(g, gomo, P.churrascoLinguica, x, Y_ESPETO + 0.004, -0.27 + k * 0.125);
      }
    } else {
      for (const z of zs) por(g, macia(0.085, 0.075, 0.1, 0.028), P.churrascoCarne, x, Y_ESPETO + 0.01, z);
    }
  };
  const tipos = ['picanha', 'linguica', 'maminha', 'picanha', 'linguica'] as const;
  tipos.forEach((t, i) => espeto(-FOGO.w * 0.4 + (i * FOGO.w * 0.8) / (tipos.length - 1), t));

  // ------------------------------------------------- a coifa e a chaminé
  // o perfil da coifa (de lado): reta atrás, rampa na frente, e a saia em pé
  const COIFA = { y: 1.94, alto: 0.6, w: L + 0.24 };
  const lado = new THREE.Shape();
  lado.moveTo(-0.52, 0);
  lado.lineTo(0.56, 0);
  lado.lineTo(0.56, 0.14);
  lado.lineTo(0.12, COIFA.alto);
  lado.lineTo(-0.52, COIFA.alto);
  lado.closePath();
  const coifa = new THREE.ExtrudeGeometry(lado, { depth: COIFA.w, bevelEnabled: false });
  coifa.rotateY(-Math.PI / 2);   // o x da forma vira o z; a extrusão corre em -x
  coifa.translate(COIFA.w / 2, 0, 0);
  por(g, coifa, inox(), 0, COIFA.y, 0);
  // a cinta de baixo, um dedo para fora da coifa em toda a volta
  por(g, macia(COIFA.w + 0.04, 0.09, 1.09, 0.02), inoxEscuro(), 0, COIFA.y + 0.02, 0.035);
  // a chaminé, com o colarinho
  const larguraDaChamine = L * 0.36;
  por(g, macia(larguraDaChamine, 0.95, 0.5, 0.02), inox(), 0, COIFA.y + COIFA.alto - 0.02 + 0.475, -0.26);
  por(g, macia(larguraDaChamine + 0.05, 0.06, 0.54, 0.012), inoxEscuro(), 0, COIFA.y + COIFA.alto + 0.02, -0.25);

  // -------------------------------------- os utensílios pendurados na cinta
  const Y_TRILHO = COIFA.y - 0.06;
  const xTrilho = L / 2 - 0.42;
  por(g, new THREE.CylinderGeometry(0.008, 0.008, 0.7, 6).rotateZ(Math.PI / 2), inoxEscuro(), xTrilho, Y_TRILHO, 0.6);
  for (const s of [-1, 1] as const) {
    por(g, new THREE.CylinderGeometry(0.007, 0.007, 0.08, 6), inoxEscuro(), xTrilho + s * 0.33, Y_TRILHO + 0.04, 0.6);
  }
  // o pegador (as duas lâminas em V), o garfo trinchante e a faca de churrasco
  {
    const x = xTrilho - 0.2;
    por(g, new THREE.TorusGeometry(0.016, 0.004, 4, 10), inox(), x, Y_TRILHO - 0.018, 0.6);
    for (const s of [-1, 1] as const) {
      const lamina = por(g, macia(0.016, 0.3, 0.006, 0.002), inox(), x + s * 0.018, Y_TRILHO - 0.18, 0.6);
      lamina.rotation.z = s * 0.06;
    }
  }
  {
    const x = xTrilho + 0.02;
    por(g, new THREE.TorusGeometry(0.014, 0.004, 4, 10), inox(), x, Y_TRILHO - 0.016, 0.6);
    por(g, macia(0.03, 0.12, 0.022, 0.008), madeiraEscura(), x, Y_TRILHO - 0.09, 0.6);
    por(g, new THREE.CylinderGeometry(0.005, 0.005, 0.12, 5), inox(), x, Y_TRILHO - 0.21, 0.6);
    for (const s of [-1, 1] as const) {
      por(g, new THREE.CylinderGeometry(0.004, 0.0015, 0.1, 4), inox(), x + s * 0.012, Y_TRILHO - 0.31, 0.6);
    }
  }
  {
    const x = xTrilho + 0.22;
    por(g, new THREE.TorusGeometry(0.014, 0.004, 4, 10), inox(), x, Y_TRILHO - 0.016, 0.6);
    por(g, macia(0.032, 0.12, 0.022, 0.008), madeiraEscura(), x, Y_TRILHO - 0.09, 0.6);
    const lamina = new THREE.Shape();
    lamina.moveTo(-0.018, 0);
    lamina.lineTo(0.02, 0);
    lamina.quadraticCurveTo(0.024, -0.18, 0.0, -0.24);
    lamina.lineTo(-0.018, -0.2);
    lamina.closePath();
    por(g, extrudar(lamina, 0.004, -0.002, 6), inox(), x, Y_TRILHO - 0.15, 0.6);
  }

  // --------------------------------------------------- a luz da brasa
  for (const x of NICHOS) {
    const halo = haloDeLampada(1.55, P.churrascoBrasa, 0.3);
    halo.position.set(x, TAMPO + 0.18, 0);
    g.add(halo);
  }
  const naParede = pocaDeLuz(0.95, P.churrascoBrasa, 0.26, true);
  naParede.scale.set(2.2, 0.9, 1);
  naParede.position.set(0, (TAMPO + COIFA.y) / 2 + 0.05, -0.5);
  g.add(naParede);
  const noChao = pocaDeLuz(1.2, P.churrascoBrasa, 0.12);
  noChao.scale.set(1.9, 1, 1);
  noChao.position.set(0, 0.02, 1.05);
  g.add(noChao);
  return g;
}

// ============================================================ O FOGÃO

/**
 * O FOGÃO INDUSTRIAL: corpo de inox escovado, quatro bocas com a CHAMA AZUL
 * acesa em volta da coroa, as trempes de ferro fundido, a faixa dos botões
 * torneados, os dois fornos com o vidro ACESO (laranja quente) e o puxador
 * de tubo, e o espelho de trás com a prateleirinha do sal e do azeite. Em
 * cima, o caldeirão de tampa, a panela de cabo e a frigideira de farofa; a
 * boca da frente à esquerda fica livre, e é nela que se vê o fogo azul.
 *
 * Por fora, o mesmo 2,4 × 0,8 × 0,92 de antes.
 */
export function fogaoDoMania(largura = 2.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'fogao-industrial';
  const L = largura;
  const PROF = 0.8;
  const TOPO = 0.925;

  por(g, new THREE.BoxGeometry(L - 0.1, 0.1, PROF - 0.12), carvao(), 0, 0.05, -0.04);
  por(g, macia(L, 0.78, PROF, 0.025), inox(), 0, 0.49, 0);
  por(g, macia(L + 0.04, 0.05, PROF + 0.02, 0.012), inox(), 0, TOPO - 0.025, 0.02);

  // a faixa dos botões, e os botões torneados num lote
  por(g, macia(L - 0.06, 0.13, 0.045, 0.012), inoxEscuro(), 0, 0.8, PROF / 2 + 0.0025);
  const botoes = new Lote(torneado([[0.001, 0], [0.03, 0], [0.034, 0.01], [0.03, 0.028], [0.016, 0.036], [0.001, 0.036]], 14), carvao());
  const aros = new Lote(new THREE.CylinderGeometry(0.042, 0.042, 0.004, 16), inox());
  const deFrente = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
  for (let i = 0; i < 6; i++) {
    const x = -L / 2 + 0.22 + (i * (L - 0.44)) / 5;
    botoes.por(null, new THREE.Vector3(x, 0.8, PROF / 2 + 0.025), deFrente, 1);
    aros.por(null, new THREE.Vector3(x, 0.8, PROF / 2 + 0.026), deFrente, 1);
  }
  botoes.montar(g);
  aros.montar(g);

  // os dois fornos: a porta, o vidro aceso e o puxador
  for (const s of [-1, 1] as const) {
    const cx = (s * L) / 4;
    const w = L / 2 - 0.1;
    por(g, macia(w, 0.52, 0.035, 0.015), inox(), cx, 0.4, PROF / 2 + 0.0125);
    por(g, macia(w - 0.24, 0.2, 0.012, 0.006), toon(P.churrascoForno, { glow: 0.3 }), cx, 0.42, PROF / 2 + 0.032);
    por(g, alca(w - 0.16, 0.05, 0.012), inox(), cx, 0.6, PROF / 2 + 0.03);
  }

  // as quatro bocas: a bacia, a coroa, a chama azul e a trempe de ferro
  const BOCAS: Array<[number, number]> = [[-L * 0.25, -0.16], [L * 0.25, -0.16], [-L * 0.25, 0.2], [L * 0.25, 0.2]];
  const chama = toon(P.churrascoChamaDeGas, { glow: 0.85 });
  for (const [x, z] of BOCAS) {
    por(g, new THREE.CylinderGeometry(0.15, 0.15, 0.012, 20), carvao(), x, TOPO + 0.004, z);
    por(g, new THREE.CylinderGeometry(0.072, 0.08, 0.025, 16), ferro(), x, TOPO + 0.02, z);
    por(g, new THREE.CylinderGeometry(0.045, 0.05, 0.012, 14), carvao(), x, TOPO + 0.038, z);
    por(g, new THREE.TorusGeometry(0.085, 0.011, 5, 20).rotateX(Math.PI / 2), chama, x, TOPO + 0.026, z);
    // a trempe: o quadro e os quatro dedos que apontam para a chama
    const TW = 0.44;
    const TD = 0.34;
    const YT = TOPO + 0.06;
    for (const sz of [-1, 1] as const) por(g, macia(TW, 0.022, 0.022, 0.005), ferro(), x, YT, z + (sz * TD) / 2);
    for (const sx of [-1, 1] as const) por(g, macia(0.022, 0.022, TD - 0.022, 0.005), ferro(), x + (sx * TW) / 2, YT, z);
    for (const sx of [-1, 1] as const) por(g, macia(0.13, 0.018, 0.018, 0.004), ferro(), x + sx * (TW / 2 - 0.075), YT + 0.002, z);
    for (const sz of [-1, 1] as const) por(g, macia(0.018, 0.018, 0.08, 0.004), ferro(), x, YT + 0.002, z + sz * (TD / 2 - 0.05));
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
      por(g, new THREE.CylinderGeometry(0.01, 0.01, YT - TOPO, 5), ferro(), x + (sx * TW) / 2, (TOPO + YT) / 2, z + (sz * TD) / 2);
    }
  }
  const SOBRE = TOPO + 0.071;

  // o caldeirão de tampa (atrás, à esquerda)
  {
    const [x, z] = BOCAS[0];
    por(g, torneado([[0.001, 0], [0.16, 0], [0.17, 0.012], [0.17, 0.27], [0.178, 0.275], [0.178, 0.285], [0.001, 0.285]], 24), inoxEscuro(), x, SOBRE, z);
    por(g, torneado([[0.001, 0.045], [0.06, 0.04], [0.14, 0.018], [0.182, 0.004], [0.182, 0], [0.001, 0]], 24), inox(), x, SOBRE + 0.285, z);
    por(g, new THREE.SphereGeometry(0.025, 10, 8), carvao(), x, SOBRE + 0.34, z);
    for (const s of [-1, 1] as const) {
      por(g, new THREE.TorusGeometry(0.03, 0.007, 4, 10, Math.PI).rotateY(Math.PI / 2).rotateZ(s * Math.PI / 2), inoxEscuro(), x + s * 0.185, SOBRE + 0.23, z);
    }
  }
  // a panela de cabo (atrás, à direita)
  {
    const [x, z] = BOCAS[1];
    por(g, torneado([[0.001, 0], [0.11, 0], [0.12, 0.01], [0.12, 0.13], [0.127, 0.135], [0.127, 0.142], [0.001, 0.142]], 22), inoxEscuro(), x, SOBRE, z);
    por(g, torneado([[0.001, 0.03], [0.05, 0.026], [0.1, 0.012], [0.13, 0.002], [0.13, 0], [0.001, 0]], 22), inox(), x, SOBRE + 0.142, z);
    por(g, new THREE.SphereGeometry(0.02, 8, 6), carvao(), x, SOBRE + 0.18, z);
    const cabo = por(g, macia(0.24, 0.022, 0.036, 0.01), carvao(), x + 0.23, SOBRE + 0.11, z);
    cabo.rotation.z = 0.18;
  }
  // a frigideira de farofa (na frente, à direita)
  {
    const [x, z] = BOCAS[3];
    por(g, torneado([[0.001, 0], [0.12, 0], [0.15, 0.04], [0.158, 0.052], [0.15, 0.054], [0.13, 0.024], [0.001, 0.024]], 24), carvao(), x, SOBRE, z);
    por(g, torneado([[0.001, 0.046], [0.06, 0.044], [0.12, 0.034], [0.134, 0.02], [0.001, 0.02]], 22), P.churrascoFarofa, x, SOBRE, z);
    const cabo = por(g, macia(0.26, 0.024, 0.036, 0.01), carvao(), x + 0.28, SOBRE + 0.06, z);
    cabo.rotation.z = 0.12;
  }

  // o espelho de trás e a prateleirinha do sal grosso e do azeite
  por(g, macia(L + 0.02, 0.3, 0.05, 0.015), inox(), 0, TOPO + 0.14, -PROF / 2 + 0.03);
  por(g, macia(L - 0.2, 0.025, 0.16, 0.006), inox(), 0, TOPO + 0.3, -PROF / 2 + 0.07);
  const Y_PRAT = TOPO + 0.3125;
  por(g, torneado([[0.001, 0], [0.05, 0], [0.052, 0.12], [0.046, 0.13], [0.001, 0.13]], 16), P.churrascoArroz, -0.7, Y_PRAT, -0.33);
  por(g, new THREE.CylinderGeometry(0.054, 0.054, 0.02, 16), P.churrascoToalha, -0.7, Y_PRAT + 0.14, -0.33);
  por(g, torneado([[0.001, 0], [0.035, 0], [0.037, 0.16], [0.02, 0.2], [0.012, 0.25], [0.001, 0.25]], 14), P.churrascoGarrafaOuro, -0.52, Y_PRAT, -0.33);
  por(g, torneado([[0.001, 0], [0.028, 0], [0.03, 0.09], [0.018, 0.11], [0.001, 0.11]], 12), P.churrascoTomate, 0.58, Y_PRAT, -0.33);
  return g;
}

// ===================================================== AS BANCADAS DE INOX

export type RecheioDaBancada = 'panelas' | 'cubas' | 'nada';

/**
 * A BANCADA DE INOX: tampo escovado com a BORDA BOLEADA (o rolo de chapa da
 * frente), a cinta de reforço, os pés tubulares com a SAPATA de nivelar, e a
 * prateleira de baixo — vazada, e CHEIA: é o que separa cozinha que trabalha
 * de cozinha de catálogo.
 *
 *  - `'panelas'` (a da parede): as panelas empilhadas, a pilha de tigelas e
 *    os caixotes de tomate e de cebola;
 *  - `'cubas'` (a ilha): as cubas de inox empilhadas, o saco de sal grosso e
 *    a pilha de pratos limpos esperando a montagem.
 *
 * `emCima` põe a tábua com a faca e a tigela de vinagrete no tampo. A ILHA
 * NÃO TEM NADA EM CIMA, de propósito: é onde o prato vai ser montado.
 */
export function bancadaDoMania(
  largura = 3, comEspelho = true, recheio: RecheioDaBancada = 'panelas', emCima = true,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bancada-inox';
  const L = largura;
  const PROF = 0.75;
  const ALT = 0.92;

  por(g, macia(L, 0.04, PROF, 0.01), inox(), 0, ALT - 0.02, 0);
  // a borda boleada: na frente sempre; atrás também na ilha (solta no meio)
  for (const s of comEspelho ? [1] : [-1, 1]) {
    por(g, new THREE.CylinderGeometry(0.02, 0.02, L - 0.02, 10).rotateZ(Math.PI / 2), inox(), 0, ALT - 0.02, s * (PROF / 2 - 0.005));
  }
  por(g, macia(L - 0.06, 0.1, PROF - 0.06, 0.01), inoxEscuro(), 0, ALT - 0.09, 0);

  // os pés: quatro, ou seis na comprida
  const xs = L > 2.4 ? [-(L / 2 - 0.08), 0, L / 2 - 0.08] : [-(L / 2 - 0.08), L / 2 - 0.08];
  for (const x of xs) {
    for (const z of [-(PROF / 2 - 0.08), PROF / 2 - 0.08]) {
      por(g, new THREE.CylinderGeometry(0.02, 0.02, ALT - 0.14 - 0.07, 10), inox(), x, 0.07 + (ALT - 0.21) / 2, z);
      por(g, sapata(), inoxEscuro(), x, 0, z);
    }
  }
  const Y_PRAT = 0.24;
  por(g, macia(L - 0.12, 0.03, PROF - 0.12, 0.008), inox(), 0, Y_PRAT, 0);
  const SOBRE = Y_PRAT + 0.015;

  // o espelho é um fio mais curto e mais para a frente que o tampo: com as
  // pontas no mesmo plano, as duas chapas brigariam pelo pixel na quina
  if (comEspelho) por(g, macia(L - 0.006, 0.3, 0.025, 0.008), inox(), 0, ALT + 0.145, -PROF / 2 + 0.0155);

  if (recheio === 'panelas') {
    // três panelas, cada uma um dedo menor, empilhadas
    for (let k = 0; k < 3; k++) {
      const r = 0.2 - k * 0.025;
      por(g, torneado([[0.001, 0], [r - 0.01, 0], [r, 0.01], [r, 0.11], [r + 0.008, 0.115], [r + 0.008, 0.122], [r - 0.006, 0.122], [r - 0.006, 0.014], [0.001, 0.014]], 22),
        inoxEscuro(), -L / 2 + 0.35, SOBRE + k * 0.1, -0.02);
    }
    // a pilha de tigelas brancas, de boca para baixo
    for (let k = 0; k < 5; k++) {
      por(g, torneado([[0.001, 0.07], [0.05, 0.068], [0.1, 0.045], [0.12, 0.004], [0.12, 0], [0.11, 0], [0.09, 0.04], [0.001, 0.06]], 18),
        P.metalWhite, -L / 2 + 0.85, SOBRE + k * 0.022, 0);
    }
    // os caixotes: as ripas de madeira e o tomate e a cebola em lote
    const legumes = new Lote(new THREE.SphereGeometry(1, 8, 6), toon(0xffffff));
    const rnd = sorteio(4321);
    [[L / 2 - 0.85, P.churrascoTomate], [L / 2 - 0.35, P.churrascoCebola]].forEach(([cx, cor]) => {
      const W = 0.42;
      const D = 0.34;
      for (const s of [-1, 1] as const) {
        for (const y of [0.04, 0.13]) por(g, macia(W, 0.06, 0.02, 0.006), madeira(), cx, SOBRE + y, s * (D / 2 - 0.01));
        for (const y of [0.04, 0.13]) por(g, macia(0.02, 0.06, D - 0.04, 0.006), madeira(), cx + s * (W / 2 - 0.01), SOBRE + y, 0);
      }
      por(g, macia(W - 0.02, 0.012, D - 0.02, 0.004), madeira(), cx, SOBRE + 0.008, 0);
      for (let i = 0; i < 14; i++) {
        const r = 0.04 + rnd() * 0.012;
        const x = cx + (rnd() - 0.5) * (W - 0.12);
        const z = (rnd() - 0.5) * (D - 0.12);
        const y = SOBRE + 0.02 + r + (i > 8 ? r * 1.4 : 0);
        legumes.por(null, new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(r, r * 0.9, r), tom(cor, 0.92 + rnd() * 0.12));
      }
    });
    legumes.montar(g);
  } else if (recheio === 'cubas') {
    // as cubas de inox, três pilhas de três
    for (let p = 0; p < 3; p++) {
      for (let k = 0; k < 3; k++) {
        por(g, macia(0.32, 0.09, 0.26, 0.012), inox(), -L / 2 + 0.35 + p * 0.38, SOBRE + 0.045 + k * 0.095, -0.05);
      }
    }
    // o saco de sal grosso, de boca dobrada
    por(g, torneado([[0.001, 0], [0.14, 0], [0.17, 0.05], [0.17, 0.22], [0.13, 0.3], [0.09, 0.32], [0.001, 0.32]], 14), P.restauranteLona, 0.5, SOBRE, 0);
    por(g, new THREE.CylinderGeometry(0.172, 0.172, 0.06, 14, 1, true), P.churrascoToalha, 0.5, SOBRE + 0.14, 0);
    // a pilha de pratos limpos, esperando a montagem
    for (let k = 0; k < 9; k++) {
      por(g, torneado([[0.001, 0], [0.09, 0], [0.13, 0.012], [0.145, 0.02], [0.14, 0.024], [0.001, 0.016]], 20), P.metalWhite, L / 2 - 0.42, SOBRE + k * 0.022, 0);
    }
  }

  if (emCima) {
    // a tábua de corte com a faca, e a tigela de vinagrete
    const x = L / 2 - 0.62;
    por(g, macia(0.5, 0.03, 0.32, 0.01), madeira(), x, ALT + 0.015, 0.02);
    const lamina = por(g, macia(0.24, 0.004, 0.045, 0.0015), inox(), x - 0.02, ALT + 0.033, 0.05);
    lamina.rotation.y = 0.3;
    const cabo = por(g, macia(0.11, 0.022, 0.026, 0.008), carvao(), x + 0.14, ALT + 0.042, 0.0);
    cabo.rotation.y = 0.3;
    por(g, torneado([[0.001, 0], [0.06, 0], [0.11, 0.05], [0.115, 0.07], [0.105, 0.07], [0.001, 0.02]], 20), P.metalWhite, x - 0.55, ALT, 0.0);
    por(g, new THREE.CylinderGeometry(0.1, 0.07, 0.03, 18), P.churrascoTomate, x - 0.55, ALT + 0.045, 0.0);
    const cebolas = new Lote(new THREE.SphereGeometry(1, 8, 6), toon(P.churrascoCebola));
    for (const [dx, dz] of [[-0.9, -0.12], [-0.98, -0.02], [-0.86, 0.06]] as const) {
      cebolas.por(null, new THREE.Vector3(x + dx, ALT + 0.04, dz), new THREE.Quaternion(), new THREE.Vector3(0.045, 0.04, 0.045));
    }
    cebolas.montar(g);
  }
  return g;
}

/**
 * A PRATELEIRA DE PAREDE da cozinha: a chapa de inox com a aba de trás, as
 * duas mãos-francesas, os potes de vidro com o que tem dentro (feijão,
 * arroz, farinha, pimenta, colorau) em lote, com a tampa e o rótulo; e,
 * embaixo, o trilho com a concha, a escumadeira, a espátula e o pegador
 * pendurados (`comUtensilios`).
 *
 * A origem é o ponto da parede onde ela é chumbada (a cena põe na altura).
 */
export function prateleiraDaCozinha(largura = 1.6, comUtensilios = true): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'prateleira-da-cozinha';
  const L = largura;
  por(g, macia(L, 0.025, 0.3, 0.006), inox(), 0, 0, 0.15);
  por(g, macia(L - 0.006, 0.07, 0.012, 0.004), inox(), 0, 0.03, 0.006);
  // as mãos-francesas: um triângulo extrudado de cada lado
  for (const s of [-1, 1] as const) {
    const mao = new THREE.Shape();
    mao.moveTo(0, -0.0125);
    mao.lineTo(0.24, -0.0125);
    mao.lineTo(0.02, -0.19);
    mao.lineTo(0, -0.19);
    mao.closePath();
    const geo = extrudar(mao, 0.012, -0.006, 4);
    geo.rotateY(-Math.PI / 2);
    por(g, geo, inoxEscuro(), s * (L / 2 - 0.3), 0, 0.003);
  }
  // os potes: o vidro tingido do que mora dentro, a tampa e o rótulo
  const CONTEUDO = [P.churrascoFeijao, P.churrascoArroz, P.churrascoFarofa, P.churrascoTomate, P.churrascoCebola, P.churrascoArroz, P.churrascoFeijao];
  const TAMPA = [P.churrascoToalha, P.churrascoInox, P.flowerYellow, P.churrascoInox, P.churrascoToalha, P.leafMid, P.churrascoInox];
  const potes = new Lote(torneado([[0.001, 0], [0.05, 0], [0.055, 0.01], [0.055, 0.15], [0.045, 0.165], [0.001, 0.165]], 16), toon(0xffffff));
  const tampas = new Lote(new THREE.CylinderGeometry(1, 1, 1, 16), toon(0xffffff));
  const rnd = sorteio(828);
  const quantos = Math.floor((L - 0.2) / 0.15);
  for (let i = 0; i < quantos; i++) {
    const x = -L / 2 + 0.17 + i * 0.15 + (rnd() - 0.5) * 0.02;
    const esc = 0.85 + rnd() * 0.3;
    potes.por(null, new THREE.Vector3(x, 0.0125, 0.16), new THREE.Quaternion(), new THREE.Vector3(1, esc, 1), CONTEUDO[i % CONTEUDO.length]);
    tampas.por(null, new THREE.Vector3(x, 0.0125 + 0.165 * esc + 0.012, 0.16), new THREE.Quaternion(), new THREE.Vector3(0.052, 0.024, 0.052), TAMPA[i % TAMPA.length]);
    tampas.por(null, new THREE.Vector3(x, 0.0125 + 0.075 * esc, 0.16), new THREE.Quaternion(), new THREE.Vector3(0.0565, 0.05 * esc, 0.0565), P.churrascoRotulo);
  }
  potes.montar(g);
  tampas.montar(g);

  if (comUtensilios) {
    const Y = -0.22;
    por(g, new THREE.CylinderGeometry(0.007, 0.007, L - 0.3, 6).rotateZ(Math.PI / 2), inoxEscuro(), 0, Y, 0.06);
    for (const s of [-1, 1] as const) por(g, new THREE.CylinderGeometry(0.006, 0.006, 0.05, 6).rotateX(Math.PI / 2), inoxEscuro(), s * (L / 2 - 0.15), Y, 0.035);
    const passo = (L - 0.5) / 3;
    for (let k = 0; k < 4; k++) {
      const x = -L / 2 + 0.25 + k * passo;
      por(g, new THREE.TorusGeometry(0.014, 0.003, 4, 10), inox(), x, Y - 0.015, 0.06);
      por(g, new THREE.CylinderGeometry(0.006, 0.006, 0.2, 5), inox(), x, Y - 0.13, 0.06);
      if (k === 0) {
        // a concha
        const bacia = por(g, new THREE.SphereGeometry(0.045, 12, 8), inox(), x, Y - 0.24, 0.075);
        bacia.scale.set(1, 0.6, 1);
      } else if (k === 1) {
        // a escumadeira
        por(g, new THREE.CylinderGeometry(0.05, 0.05, 0.008, 16).rotateX(Math.PI / 2), inox(), x, Y - 0.26, 0.062);
      } else if (k === 2) {
        // a espátula
        por(g, macia(0.07, 0.09, 0.004, 0.0015), inox(), x, Y - 0.27, 0.062);
      } else {
        // o pegador
        for (const s of [-1, 1] as const) {
          const lamina = por(g, macia(0.014, 0.12, 0.005, 0.002), inox(), x + s * 0.012, Y - 0.27, 0.06);
          lamina.rotation.z = s * 0.08;
        }
      }
    }
  }
  return g;
}

// =================================================================== A PIA

/**
 * A PIA INDUSTRIAL de DUAS CUBAS: o tampo é uma forma com os dois furos
 * (extrudada e deitada), e cada cuba é uma caixa ABERTA por dentro
 * (`cubaAberta`) com o ralo — olhando de cima, vê-se o fundo e as paredes
 * dela, e não um retângulo cinza pintado. A ducha de pré-lavagem tem a
 * MOLA de verdade (um tubo em hélice), a mangueira em arco e o chuveirinho
 * pendurado; a bica giratória sai do mesmo cano. Do lado seco, o escorredor
 * de arame com os pratos em pé e as xícaras de boca para baixo (lotes), e
 * embaixo o balde.
 *
 * Por fora, o mesmo 2,2 × 0,75 de antes (o colisor da cena é 0,42 × 1,1).
 */
export function piaDoMania(largura = 2.2): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pia-industrial';
  const L = largura;
  const PROF = 0.72;
  const ALT = 0.92;
  const FUNDO = 0.3;
  const CUBAS = [-L / 2 + 0.35, -L / 2 + 0.9];
  const CW = 0.5;
  const CD = 0.44;
  const CZ = 0.03;

  // o tampo com os furos (a forma em XY: o y dela vira o -z depois de deitar)
  const forma = retanguloRedondo(new THREE.Shape(), 0, 0, L, PROF, 0.02);
  for (const cx of CUBAS) forma.holes.push(retanguloRedondo(new THREE.Path(), cx, -CZ, CW, CD, 0.04));
  const tampo = extrudar(forma, 0.04, 0, 8);
  tampo.rotateX(-Math.PI / 2);
  por(g, tampo, inox(), 0, ALT - 0.04, 0);
  por(g, new THREE.CylinderGeometry(0.02, 0.02, L - 0.02, 10).rotateZ(Math.PI / 2), inox(), 0, ALT - 0.02, PROF / 2 - 0.004);
  for (const cx of CUBAS) {
    por(g, cubaAberta(CW + 0.006, CD + 0.006, FUNDO), inoxEscuro(), cx, ALT - 0.001, CZ);
    por(g, new THREE.CylinderGeometry(0.035, 0.035, 0.006, 14), ferro(), cx, ALT - FUNDO + 0.003, CZ);
    por(g, new THREE.TorusGeometry(0.035, 0.006, 4, 14).rotateX(Math.PI / 2), inox(), cx, ALT - FUNDO + 0.006, CZ);
  }
  // o avental da frente, os pés e a prateleira de baixo
  por(g, macia(L - 0.02, 0.2, 0.025, 0.006), inox(), 0, ALT - 0.14, PROF / 2 - 0.02);
  for (const x of [-(L / 2 - 0.08), L / 2 - 0.08]) {
    for (const z of [-(PROF / 2 - 0.08), PROF / 2 - 0.08]) {
      por(g, new THREE.CylinderGeometry(0.02, 0.02, ALT - 0.24 - 0.07, 10), inox(), x, 0.07 + (ALT - 0.31) / 2, z);
      por(g, sapata(), inoxEscuro(), x, 0, z);
    }
  }
  por(g, macia(L - 0.12, 0.03, PROF - 0.12, 0.008), inox(), 0, 0.22, 0);
  // o balde vermelho, embaixo do lado seco
  por(g, torneado([[0.001, 0], [0.11, 0], [0.14, 0.24], [0.15, 0.25], [0.15, 0.26], [0.13, 0.26], [0.12, 0.03], [0.001, 0.03]], 18), P.churrascoToalha, 0.55, 0.235, 0);
  // o espelho de trás (um fio mais curto que o tampo, como o da bancada)
  por(g, macia(L - 0.006, 0.25, 0.025, 0.008), inox(), 0, ALT + 0.12, -PROF / 2 + 0.0155);

  // ------------------------------------------------------------- a ducha
  const FX = (CUBAS[0] + CUBAS[1]) / 2;
  const FZ = -0.26;
  por(g, torneado([[0.001, 0], [0.04, 0], [0.042, 0.02], [0.028, 0.05], [0.001, 0.05]], 14), inox(), FX, ALT, FZ);
  por(g, new THREE.CylinderGeometry(0.016, 0.016, 0.3, 10), inox(), FX, ALT + 0.2, FZ);
  // a bica giratória, saindo do cano para a cuba da esquerda
  por(g, tubo([[FX, ALT + 0.1, FZ], [FX - 0.04, ALT + 0.1, FZ + 0.12], [FX - 0.14, ALT + 0.08, FZ + 0.22]], 0.012, 12, 8), inox(), 0, 0, 0);
  // a mola: uma hélice em volta da mangueira
  {
    const voltas = 10;
    const de = ALT + 0.35;
    const ate = ALT + 0.6;
    const pontos: THREE.Vector3[] = [];
    for (let i = 0; i <= voltas * 16; i++) {
      const t = i / (voltas * 16);
      const a = t * voltas * Math.PI * 2;
      pontos.push(new THREE.Vector3(FX + Math.cos(a) * 0.036, de + (ate - de) * t, FZ + Math.sin(a) * 0.036));
    }
    por(g, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), voltas * 16, 0.0055, 5, false), inox(), 0, 0, 0);
  }
  // a mangueira subindo e fazendo o arco, e o chuveirinho pendurado
  por(g, tubo([[FX, ALT + 0.33, FZ], [FX, ALT + 0.66, FZ], [FX, ALT + 0.74, FZ + 0.1], [FX, ALT + 0.7, FZ + 0.25], [FX, ALT + 0.6, FZ + 0.29]], 0.012, 24, 8), carvao(), 0, 0, 0);
  por(g, torneado([[0.001, 0], [0.03, 0], [0.036, 0.03], [0.022, 0.09], [0.016, 0.11], [0.001, 0.11]], 14), inox(), FX, ALT + 0.49, FZ + 0.29);
  // o braço que segura a mangueira no espelho
  por(g, new THREE.CylinderGeometry(0.008, 0.008, 0.2, 6).rotateX(Math.PI / 2), inoxEscuro(), FX, ALT + 0.66, FZ - 0.0);

  // ------------------------------------------------------- o escorredor
  const EX = L / 2 - 0.5;
  const EW = 0.72;
  const ED = 0.36;
  const EY = ALT + 0.035;
  for (const s of [-1, 1] as const) {
    por(g, new THREE.CylinderGeometry(0.006, 0.006, EW, 6).rotateZ(Math.PI / 2), inox(), EX, EY, (s * ED) / 2);
    por(g, new THREE.CylinderGeometry(0.006, 0.006, ED, 6).rotateX(Math.PI / 2), inox(), EX + (s * EW) / 2, EY, 0);
    por(g, new THREE.CylinderGeometry(0.005, 0.005, EW, 6).rotateZ(Math.PI / 2), inox(), EX, EY + 0.11, s * 0.07);
    for (const sx of [-1, 1] as const) por(g, sapata().scale(0.35, 0.4, 0.35), inoxEscuro(), EX + (sx * EW) / 2, ALT, (s * ED) / 2);
  }
  const varetas = new Lote(new THREE.CylinderGeometry(0.004, 0.004, 0.11, 4), toon(P.churrascoInox));
  for (let i = 0; i <= 12; i++) {
    for (const s of [-1, 1] as const) varetas.por(null, new THREE.Vector3(EX - EW / 2 + 0.04 + i * 0.045, EY + 0.055, s * 0.07), new THREE.Quaternion(), 1);
  }
  varetas.montar(g);
  // os pratos em pé (a face olhando para x), cada um um pouco tombado
  const pratos = new Lote(torneado([[0.001, 0], [0.08, 0], [0.1, 0.012], [0.13, 0.024], [0.132, 0.03], [0.127, 0.032], [0.098, 0.02], [0.075, 0.009], [0.001, 0.009]], 18), toon(P.metalWhite));
  for (let i = 0; i < 7; i++) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2 - 0.18));
    pratos.por(null, new THREE.Vector3(EX - EW / 2 + 0.08 + i * 0.055, EY + 0.13, 0), q, 1);
  }
  pratos.montar(g);
  // as xícaras de boca para baixo, na ponta
  const xicaras = new Lote(torneado([[0.001, 0.07], [0.03, 0.068], [0.04, 0.03], [0.042, 0], [0.036, 0], [0.034, 0.03], [0.001, 0.06]], 14), toon(P.metalWhite));
  for (const [dx, dz] of [[0, -0.09], [0, 0.0], [0, 0.09], [-0.09, -0.045], [-0.09, 0.045]] as const) {
    xicaras.por(null, new THREE.Vector3(EX + EW / 2 - 0.07 + dx, EY + 0.005, dz), new THREE.Quaternion(), 1);
  }
  xicaras.montar(g);
  return g;
}

// ============================================================ A GELADEIRA

/**
 * A GELADEIRA INDUSTRIAL de duas portas, de inox escovado: as portas com o
 * frisinho da borracha entre elas, os puxadores de tubo em pé, as
 * dobradiças, o termômetro de mostrador verde aceso, a grade do motor em
 * cima e a de ventilação no rodapé (palhetas em lote), e a prancheta do
 * estoque presa na porta de baixo.
 *
 * 0,84 × 2,05 × 0,74: cabe no mesmo canto da antiga (o colisor é 0,45 × 0,4).
 */
export function geladeiraDoMania(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'geladeira-industrial';
  const W = 0.84;
  const D = 0.72;
  const FRENTE = D / 2;

  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) por(g, sapata(), inoxEscuro(), x * (W / 2 - 0.07), 0, z * (D / 2 - 0.07));
  por(g, macia(W, 1.85, D, 0.02), inox(), 0, 0.075 + 0.925, 0);
  // as palhetas do rodapé e da grade do motor
  const palhetas = new Lote(macia(W - 0.16, 0.012, 0.012, 0.004), toon(P.churrascoCarvao));
  por(g, macia(W - 0.1, 0.1, 0.012, 0.004), carvao(), 0, 0.14, FRENTE + 0.002);
  for (let i = 0; i < 4; i++) palhetas.por(null, new THREE.Vector3(0, 0.105 + i * 0.022, FRENTE + 0.01), new THREE.Quaternion(), 1);
  por(g, macia(W, 0.14, D, 0.015), inoxEscuro(), 0, 1.925 + 0.07, 0);
  por(g, macia(W - 0.1, 0.09, 0.012, 0.004), carvao(), 0, 1.995, FRENTE + 0.002);
  for (let i = 0; i < 3; i++) palhetas.por(null, new THREE.Vector3(0, 1.97 + i * 0.024, FRENTE + 0.01), new THREE.Quaternion(), 1);
  palhetas.montar(g);

  // as portas, a borracha entre elas, os puxadores e as dobradiças
  const PORTAS = [[0.2, 1.04], [1.06, 1.9]] as const;
  for (const [y0, y1] of PORTAS) {
    por(g, macia(W - 0.03, y1 - y0, 0.035, 0.012), inox(), 0, (y0 + y1) / 2, FRENTE + 0.012);
    const puxador = alca(0.38, 0.05, 0.012);
    puxador.rotateZ(Math.PI / 2);
    por(g, puxador, inox(), W / 2 - 0.08, y1 - 0.3, FRENTE + 0.03);
    for (const y of [y0 + 0.08, y1 - 0.08]) por(g, new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), inoxEscuro(), -W / 2 + 0.015, y, FRENTE + 0.02);
  }
  por(g, macia(W - 0.04, 0.012, 0.03, 0.004), carvao(), 0, 1.05, FRENTE + 0.004);
  // o termômetro, com o mostrador aceso
  por(g, macia(0.13, 0.06, 0.012, 0.004), carvao(), -0.2, 1.8, FRENTE + 0.033);
  por(g, new THREE.PlaneGeometry(0.09, 0.03), toon(P.leafLight, { glow: 0.8 }), -0.2, 1.8, FRENTE + 0.042);
  // a prancheta do estoque
  {
    const p = new THREE.Group();
    p.position.set(-0.12, 0.72, FRENTE + 0.032);
    p.rotation.z = 0.05;
    g.add(p);
    por(p, macia(0.2, 0.28, 0.008, 0.004), madeira(), 0, 0, 0);
    por(p, macia(0.17, 0.22, 0.004, 0.0015), P.churrascoRotulo, 0, -0.02, 0.005);
    por(p, macia(0.08, 0.025, 0.012, 0.004), inoxEscuro(), 0, 0.125, 0.006);
    const linhas = new Lote(macia(0.12, 0.006, 0.002, 0.001), toon(P.churrascoCarvao));
    for (let i = 0; i < 6; i++) linhas.por(null, new THREE.Vector3(-0.01 + (i % 2) * 0.01, 0.06 - i * 0.03, 0.0075), new THREE.Quaternion(), 1);
    linhas.montar(p);
  }
  return g;
}

// ================================================ OS BALCÕES DE MADEIRA

export interface OpcoesDoBalcao {
  /** o lado de trás (`-Z`) é a cozinha: a prateleira de apoio de inox */
  cozinha?: boolean;
  /** o balcão do bar: apoio de pé de latão e a chopeira */
  bar?: boolean;
  /** onde fica a campainha da passagem (`x` local), ou nenhuma */
  sino?: number | null;
  /** o trilho das comandas, de `x` a `x` (local), no lado da cozinha */
  comandas?: readonly [number, number] | null;
}

/**
 * O BALCÃO DE MADEIRA — a passagem entre a cozinha e o salão, o trecho
 * lateral e o balcão do bar são a mesma peça.
 *
 * MOLDURA E ALMOFADA na frente: os montantes (em pé, mais grossos), as
 * travessas entre eles e, em cada vão, a ALMOFADA LEVANTADA — uma forma
 * extrudada com bisel largo, que o toon desenha como a moldura chanfrada de
 * marcenaria. O rodapé recuado e escuro, e o tampo de GRANITO escuro com a
 * quina boleada.
 *
 * AS MEDIDAS SÃO AS DA PEÇA ANTIGA, porque o turno mora nelas: 1,06 de corpo
 * e 0,09 de pedra (o tampo em 1,15, onde o prato pronto e a louça pousam e o
 * osso do Walter fica guardado), 0,7 de corpo e 1 m de tampo. O tampo fica
 * VAZIO onde o turno trabalha; a campainha e as comandas moram longe das
 * vagas.
 */
export function balcaoDoMania(largura = 6, opts: OpcoesDoBalcao = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balcao-de-passagem';
  const L = largura;
  const ALT = 1.06;
  const PROF = 0.7;
  const md = madeira();
  const FRENTE = (PROF - 0.06) / 2;

  por(g, macia(L - 0.06, 0.12, PROF - 0.1, 0.01), madeiraEscura(), 0, 0.05, 0);
  // o miolo é 4 mm mais curto de cada lado que os montantes das pontas: com a
  // mesma ponta, a face do lado dos dois cairia no mesmo plano
  por(g, new THREE.BoxGeometry(L - 0.008, ALT - 0.1, PROF - 0.06), md, 0, 0.1 + (ALT - 0.1) / 2, 0);

  // ------------------------------------------------ a moldura e as almofadas
  const vaos = Math.max(1, Math.round(L / 1.15));
  const vao = L / vaos;
  const MONT = 0.1;
  const Y0 = 0.11;
  const Y1 = ALT - 0.01;
  const xDoMontante = (k: number): number => (k === 0 ? -L / 2 + MONT / 2 : k === vaos ? L / 2 - MONT / 2 : -L / 2 + k * vao);
  for (let k = 0; k <= vaos; k++) {
    por(g, macia(MONT, Y1 - Y0, 0.034, 0.008), md, xDoMontante(k), (Y0 + Y1) / 2, FRENTE + 0.013);
  }
  const TRAV_BAIXO = 0.12;
  const TRAV_CIMA = 0.1;
  for (let k = 0; k < vaos; k++) {
    const a = xDoMontante(k) + MONT / 2;
    const b = xDoMontante(k + 1) - MONT / 2;
    const cx = (a + b) / 2;
    const w = b - a;
    por(g, macia(w + 0.004, TRAV_BAIXO, 0.028, 0.006), md, cx, Y0 + TRAV_BAIXO / 2, FRENTE + 0.01);
    por(g, macia(w + 0.004, TRAV_CIMA, 0.028, 0.006), md, cx, Y1 - TRAV_CIMA / 2, FRENTE + 0.01);
    // a almofada levantada: o bisel largo desenha o chanfro
    const ph = Y1 - TRAV_CIMA - (Y0 + TRAV_BAIXO) - 0.03;
    const pw = w - 0.03;
    const BISEL = 0.04;
    const almofada = new THREE.ExtrudeGeometry(retanguloRedondo(new THREE.Shape(), 0, 0, pw - 2 * BISEL, ph - 2 * BISEL, 0.01), {
      depth: 0.004, bevelEnabled: true, bevelThickness: 0.013, bevelSize: BISEL, bevelSegments: 1, curveSegments: 4,
    });
    por(g, almofada, md, cx, (Y0 + TRAV_BAIXO + Y1 - TRAV_CIMA) / 2, FRENTE + 0.002);
  }

  // ------------------------------------------------------- o tampo de granito
  por(g, macia(L + 0.2, 0.09, 1.0, 0.03), granitoEscuro(), 0, ALT + 0.045, 0);
  const TOPO = ALT + 0.09;

  if (opts.cozinha) {
    // a prateleira de apoio do lado da cozinha, na altura da bancada
    por(g, macia(L - 0.3, 0.035, 0.3, 0.008), inox(), 0, 0.72, -FRENTE - 0.12);
  }

  if (opts.sino !== undefined && opts.sino !== null) {
    // a campainha de balcão: a base escura, a cúpula de latão e o botão
    const x = opts.sino;
    por(g, torneado([[0.001, 0], [0.05, 0], [0.052, 0.012], [0.04, 0.02], [0.001, 0.02]], 18), carvao(), x, TOPO, 0.3);
    por(g, torneado([[0.001, 0.02], [0.04, 0.02], [0.044, 0.03], [0.038, 0.055], [0.02, 0.07], [0.001, 0.072]], 18), latao(), x, TOPO, 0.3);
    por(g, new THREE.CylinderGeometry(0.004, 0.004, 0.02, 5), latao(), x, TOPO + 0.08, 0.3);
    por(g, new THREE.SphereGeometry(0.009, 8, 6), latao(), x, TOPO + 0.092, 0.3);
  }

  if (opts.comandas) {
    // o trilho das comandas, no lado da cozinha: dois postes, a barra e os
    // papéis presos nela (um lote)
    const [a, b] = opts.comandas;
    const z = -0.42;
    const Y = TOPO + 0.22;
    for (const x of [a, b]) por(g, new THREE.CylinderGeometry(0.01, 0.012, 0.22, 8), inox(), x, TOPO + 0.11, z);
    por(g, macia(b - a + 0.04, 0.03, 0.03, 0.006), inox(), (a + b) / 2, Y, z);
    const papeis = new Lote(new THREE.BoxGeometry(0.075, 0.11, 0.002), toon(0xffffff));
    const rnd = sorteio(5150);
    const CORES = [P.churrascoRotulo, P.metalWhite, P.flowerYellow, P.churrascoRotulo];
    const quantos = Math.max(3, Math.floor((b - a) / 0.22));
    for (let i = 0; i < quantos; i++) {
      const x = a + 0.12 + ((b - a - 0.24) * (i + rnd() * 0.5)) / quantos;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1 + rnd() * 0.15, 0, (rnd() - 0.5) * 0.12));
      papeis.por(null, new THREE.Vector3(x, Y - 0.07, z + 0.022), q, 1, CORES[i % CORES.length]);
    }
    papeis.montar(g);
  }

  if (opts.bar) {
    // o apoio de pé de latão, com as mãos curvas e as ponteiras
    const zRail = FRENTE + 0.17;
    por(g, new THREE.CylinderGeometry(0.022, 0.022, L - 0.3, 12).rotateZ(Math.PI / 2), latao(), 0, 0.2, zRail);
    for (const s of [-1, 1] as const) por(g, new THREE.SphereGeometry(0.03, 12, 8), latao(), s * (L / 2 - 0.15), 0.2, zRail);
    const maos = Math.max(2, Math.round(L / 1.5) + 1);
    for (let i = 0; i < maos; i++) {
      const x = -(L / 2 - 0.3) + (i * (L - 0.6)) / (maos - 1);
      por(g, tubo([[x, 0.36, FRENTE + 0.03], [x, 0.35, FRENTE + 0.1], [x, 0.26, FRENTE + 0.16], [x, 0.2, zRail]], 0.012, 12, 6), latao(), 0, 0, 0);
      por(g, new THREE.CylinderGeometry(0.03, 0.03, 0.01, 12).rotateX(Math.PI / 2), latao(), x, 0.36, FRENTE + 0.033);
    }
    // a chopeira, do lado do balconista
    {
      const x = -1.6;
      const z = -0.24;
      por(g, macia(0.36, 0.022, 0.16, 0.006), inox(), x, TOPO + 0.011, z + 0.03);
      por(g, torneado([[0.001, 0], [0.05, 0], [0.045, 0.03], [0.042, 0.3], [0.06, 0.32], [0.06, 0.34], [0.001, 0.34]], 18), inox(), x, TOPO, z);
      por(g, new THREE.CylinderGeometry(0.034, 0.034, 0.01, 16).rotateX(Math.PI / 2), latao(), x, TOPO + 0.2, z + 0.044);
      for (const s of [-1, 1] as const) {
        por(g, new THREE.CylinderGeometry(0.012, 0.012, 0.09, 8).rotateX(Math.PI / 2), inox(), x + s * 0.07, TOPO + 0.27, z + 0.06);
        por(g, new THREE.CylinderGeometry(0.02, 0.016, 0.04, 8), inox(), x + s * 0.07, TOPO + 0.25, z + 0.1);
        por(g, torneado([[0.001, 0], [0.012, 0], [0.016, 0.06], [0.014, 0.1], [0.001, 0.104]], 10), carvao(), x + s * 0.07, TOPO + 0.28, z + 0.1);
      }
    }
    // dois copos de chope na beira, a espuma por cima
    for (const [x, z] of [[1.0, 0.28], [1.18, 0.22]] as const) {
      por(g, torneado([[0.001, 0], [0.03, 0], [0.034, 0.012], [0.04, 0.14], [0.001, 0.14]], 16), P.churrascoChopp, x, TOPO, z);
      por(g, torneado([[0.001, 0.13], [0.041, 0.13], [0.043, 0.15], [0.03, 0.17], [0.001, 0.175]], 16), P.metalWhite, x, TOPO, z);
    }
  }
  return g;
}

// ======================================================== O BAR E A LUZ

const PERFIL_CORNIJA_DO_BAR: Perfil = [
  [0, 0], [0.012, 0.006], [0.016, 0.028],
  ...cavetinho([0.016, 0.028], [0.065, 0.1], 4),
  [0.072, 0.104], [0.072, 0.12], [0, 0.12],
];

/**
 * A ESTANTE DO BAR: o ESPELHO no fundo (as faixas de reflexo em canvas), as
 * pilastras e a base de madeira escura, a CORNIJA com perfil em cima, três
 * prateleiras com o friso de latão, e as GARRAFAS torneadas — quatro feitios
 * (vinho, long neck, licor, a quadrada de uísque), a cor do vidro e o rótulo
 * por cópia, tudo em lote. Na de baixo, as taças.
 *
 * O LED embaixo de cada prateleira é luz pintada: o filete aceso e o leque
 * quente no espelho atrás das garrafas.
 *
 * A origem é a base no meio da parede (a cena pendura em 0,7). Ela tem 1,3
 * de altura: termina embaixo da placa do nome, que antes passava por cima
 * dela.
 */
export function estanteDoBar(largura = 3.4, altura = 1.3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'estante-de-bebidas';
  const L = largura;
  const A = altura;
  const esc = madeiraEscura();

  por(g, new THREE.BoxGeometry(L - 0.1, A - 0.1, 0.02), toon(0xffffff, { mapa: espelhoDeBar() }), 0, (A - 0.1) / 2 + 0.03, -0.035);
  // as pilastras param embaixo da tábua de cima (com o topo junto, as duas
  // faces de cima brigariam bem onde a câmera olha)
  for (const s of [-1, 1] as const) por(g, macia(0.12, A - 0.04, 0.3, 0.015), esc, s * (L / 2 - 0.06), (A - 0.04) / 2, 0.1);
  por(g, macia(L + 0.04, 0.07, 0.34, 0.012), esc, 0, 0.035, 0.12);
  por(g, macia(L + 0.06, 0.06, 0.36, 0.012), esc, 0, A - 0.03, 0.13);
  por(g, frisoReto(PERFIL_CORNIJA_DO_BAR, L - 0.24), esc, 0, A - 0.18, 0.25);

  const PRATELEIRAS = [0.07, 0.47, 0.87];
  for (const y of PRATELEIRAS.slice(1)) {
    por(g, macia(L - 0.24, 0.035, 0.26, 0.008), esc, 0, y - 0.0175, 0.08);
  }
  for (const y of PRATELEIRAS) {
    por(g, new THREE.CylinderGeometry(0.008, 0.008, L - 0.26, 6).rotateZ(Math.PI / 2), latao(), 0, y + 0.028, 0.2);
  }
  // o LED: o filete aceso embaixo de cada tábua, e o leque no espelho
  const led = toon(P.luzDeAbajur, { glow: 0.9 });
  for (const y of [0.47, 0.87, A - 0.06]) {
    por(g, macia(L - 0.32, 0.01, 0.012, 0.003), led, 0, y - 0.04, 0.17);
    const leque = pocaDeLuz(0.6, P.luzDeAbajur, 0.24, true);
    leque.scale.set((L - 0.3) / 1.2, 0.55, 1);
    leque.position.set(0, y - 0.2, -0.013);
    g.add(leque);
  }

  // ------------------------------------------------------------ as garrafas
  const feitios = [
    { geo: torneado([[0.001, 0], [0.036, 0], [0.04, 0.01], [0.04, 0.19], [0.03, 0.225], [0.014, 0.25], [0.013, 0.3], [0.016, 0.305], [0.001, 0.305]], 8), rot: [0.06, 0.16, 0.041], tam: [0.015, 0.29, 0.03] },
    { geo: torneado([[0.001, 0], [0.032, 0], [0.035, 0.01], [0.035, 0.15], [0.022, 0.2], [0.012, 0.24], [0.011, 0.265], [0.014, 0.27], [0.001, 0.27]], 8), rot: [0.05, 0.12, 0.036], tam: [0.0135, 0.255, 0.03] },
    { geo: torneado([[0.001, 0], [0.044, 0], [0.048, 0.02], [0.046, 0.14], [0.02, 0.17], [0.016, 0.21], [0.001, 0.21]], 8), rot: [0.04, 0.12, 0.049], tam: [0.018, 0.2, 0.03] },
    { geo: torneado([[0.001, 0], [0.05, 0], [0.052, 0.01], [0.052, 0.17], [0.03, 0.19], [0.016, 0.2], [0.016, 0.23], [0.001, 0.23]], 4).rotateY(Math.PI / 4), rot: null, tam: [0.019, 0.22, 0.03] },
  ] as const;
  const VIDROS = [P.churrascoGarrafaVerde, P.churrascoGarrafaAmbar, P.churrascoGarrafaVinho, P.churrascoGarrafaClara, P.churrascoGarrafaAzul, P.churrascoGarrafaOuro];
  const ROTULOS = [P.churrascoRotulo, P.churrascoRotulo, P.metalWhite, P.churrascoToalha, P.churrascoRotulo, P.churrascoQuadroNegro];
  const garrafas = feitios.map((f) => new Lote(f.geo, toon(0xffffff)));
  const cilindros = new Lote(new THREE.CylinderGeometry(1, 1, 1, 8), toon(0xffffff));
  const tacas = new Lote(torneado([[0.001, 0], [0.032, 0], [0.032, 0.005], [0.006, 0.012], [0.005, 0.07], [0.022, 0.08], [0.034, 0.11], [0.032, 0.145], [0.001, 0.145]], 10), toon(P.churrascoGarrafaClara));
  const rnd = sorteio(7070);
  PRATELEIRAS.forEach((y, p) => {
    let x = -L / 2 + 0.2;
    while (x < L / 2 - 0.2) {
      // na prateleira de baixo, um trecho do meio é das taças
      if (p === 0 && Math.abs(x) < 0.45) {
        tacas.por(null, new THREE.Vector3(x, y + 0.002, 0.1), new THREE.Quaternion(), 1);
        tacas.por(null, new THREE.Vector3(x + 0.04, y + 0.002, 0.0), new THREE.Quaternion(), 1);
        x += 0.09;
        continue;
      }
      const f = Math.floor(rnd() * feitios.length);
      const feitio = feitios[f];
      const vidro = VIDROS[Math.floor(rnd() * VIDROS.length)];
      const z = 0.06 + (rnd() - 0.5) * 0.06;
      // sem giro: o rótulo tem os mesmos gomos da garrafa, e girada ela furava o
      // rótulo pelas arestas
      garrafas[f].por(null, new THREE.Vector3(x, y + 0.002, z), new THREE.Quaternion(), 1, vidro);
      if (feitio.rot) {
        const [de, ate, r] = feitio.rot;
        cilindros.por(null, new THREE.Vector3(x, y + 0.002 + (de + ate) / 2, z), new THREE.Quaternion(), new THREE.Vector3(r, ate - de, r), ROTULOS[Math.floor(rnd() * ROTULOS.length)]);
      }
      const [rt, yt, ht] = feitio.tam;
      cilindros.por(null, new THREE.Vector3(x, y + 0.002 + yt + ht / 2, z), new THREE.Quaternion(), new THREE.Vector3(rt, ht, rt), rnd() < 0.5 ? P.churrascoGarrafaOuro : P.churrascoCarvao);
      x += 0.095 + rnd() * 0.03;
    }
  });
  for (const lote of garrafas) lote.montar(g);
  cilindros.montar(g);
  tacas.montar(g);
  return g;
}

/**
 * A BANQUETA do bar: quatro PÉS TORNEADOS abrindo para fora, o ARO DE LATÃO
 * passando por eles (o apoio do pé), o assento de madeira torneado com a
 * borda boleada e a ALMOFADA DE COURO capitonê — o botão afunda o meio, e o
 * vivo contorna a borda. O topo fica perto dos 0,78 da antiga.
 */
export function banquetaDoBar(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'banqueta';
  const ASSENTO = 0.68;
  const esc = madeiraEscura();
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    const base = new THREE.Vector3(Math.sin(a) * 0.2, 0, Math.cos(a) * 0.2);
    const topo = new THREE.Vector3(Math.sin(a) * 0.12, ASSENTO, Math.cos(a) * 0.12);
    const dir = topo.clone().sub(base);
    const len = dir.length();
    const perna = por(g, torneado([
      [0.001, 0], [0.016, 0], [0.019, len * 0.08], [0.015, len * 0.3], [0.021, len * 0.45], [0.016, len * 0.52],
      [0.019, len * 0.85], [0.022, len * 0.95], [0.022, len], [0.001, len],
    ], 10), esc, base.x, 0, base.z);
    perna.quaternion.copy(apontando(dir));
  }
  const yAro = 0.26;
  const raioDoAro = 0.2 - (0.08 * yAro) / ASSENTO;
  por(g, new THREE.TorusGeometry(raioDoAro, 0.012, 6, 24).rotateX(Math.PI / 2), latao(), 0, yAro, 0);
  por(g, torneado([[0.001, 0], [0.17, 0], [0.19, 0.012], [0.195, 0.032], [0.18, 0.05], [0.001, 0.05]], 22), esc, 0, ASSENTO, 0);
  const couro = toon(P.churrascoCouro);
  por(g, torneado([[0.001, 0.052], [0.03, 0.06], [0.08, 0.068], [0.15, 0.058], [0.172, 0.04], [0.178, 0.015], [0.17, 0], [0.001, 0]], 22), couro, 0, ASSENTO + 0.05, 0);
  por(g, new THREE.TorusGeometry(0.173, 0.007, 5, 22).rotateX(Math.PI / 2), couro, 0, ASSENTO + 0.065, 0);
  por(g, new THREE.SphereGeometry(0.012, 8, 6), couro, 0, ASSENTO + 0.104, 0);
  return g;
}

/** o mostrador da registradora: os números de cobrar, pintados */
function mostradorDaRegistradora(largura: number, altura: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = Math.round((256 * altura) / largura);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const W = canvas.width;
    const H = canvas.height;
    ctx.fillStyle = hex(P.churrascoRotulo);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = hex(P.churrascoCarvao);
    ctx.font = `bold ${Math.round(H * 0.62)}px ui-monospace, "Courier New", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('34,00', W * 0.58, H * 0.54);
    ctx.fillStyle = hex(P.churrascoToalha);
    ctx.font = `bold ${Math.round(H * 0.4)}px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.fillText('R$', W * 0.13, H * 0.54);
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), new THREE.MeshBasicMaterial({ map: textura }));
}

/**
 * A REGISTRADORA ANTIGA, de latão: a base de madeira, a gaveta do dinheiro,
 * o corpo de perfil inclinado com o TECLADO EM DEGRAUS (as teclas num lote,
 * cor por tecla), o mostrador com o valor em cima, a crista em arco e a
 * manivela do lado. É o caixa que uma churrascaria de família guarda de
 * enfeite e usa de verdade.
 */
export function caixaRegistradoraAntiga(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caixa-registradora';
  const lt = latao();
  const escuro = toon(P.churrascoLataoEscuro);
  por(g, macia(0.46, 0.05, 0.4, 0.012), madeiraEscura(), 0, 0.025, 0);
  por(g, macia(0.42, 0.1, 0.36, 0.01), lt, 0, 0.1, 0);
  por(g, macia(0.3, 0.05, 0.008, 0.003), escuro, 0, 0.1, 0.181);
  por(g, new THREE.SphereGeometry(0.014, 8, 6), carvao(), 0, 0.1, 0.19);

  // o corpo: o perfil de lado (em z, y), extrudado na largura
  const perfil = new THREE.Shape();
  perfil.moveTo(-0.17, 0);
  perfil.lineTo(0.17, 0);
  perfil.lineTo(0.17, 0.05);
  perfil.lineTo(0.02, 0.2);
  perfil.lineTo(-0.17, 0.24);
  perfil.closePath();
  const corpo = new THREE.ExtrudeGeometry(perfil, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1 });
  corpo.rotateY(-Math.PI / 2);
  corpo.translate(0.2, 0, 0);
  por(g, corpo, lt, 0, 0.15, 0);
  // os medalhões dos lados
  for (const s of [-1, 1] as const) {
    const m = por(g, new THREE.CylinderGeometry(0.06, 0.06, 0.01, 18).rotateZ(Math.PI / 2), escuro, s * 0.21, 0.27, -0.06);
    m.scale.set(1, 1.3, 1);
  }
  // as teclas, em quatro degraus pelo plano inclinado
  const normal = new THREE.Vector3(0, 0.15, 0.15).normalize();
  const q = apontando(normal);
  const teclas = new Lote(new THREE.CylinderGeometry(0.015, 0.015, 0.03, 10), toon(0xffffff));
  for (let fila = 0; fila < 4; fila++) {
    const t = 0.18 + fila * 0.2;
    const z = 0.17 - 0.15 * t;
    const y = 0.15 + 0.05 + 0.15 * t;
    for (let i = 0; i < 6; i++) {
      const x = -0.15 + i * 0.06;
      const p = new THREE.Vector3(x, y, z).addScaledVector(normal, 0.012);
      teclas.por(null, p, q, 1, i === 5 ? P.churrascoToalha : fila === 0 ? P.churrascoCarvao : P.churrascoRotulo);
    }
  }
  teclas.montar(g);
  // o mostrador em cima, com a crista em arco
  por(g, macia(0.3, 0.1, 0.1, 0.01), lt, 0, 0.44, -0.08);
  const visor = mostradorDaRegistradora(0.22, 0.06);
  visor.position.set(0, 0.44, -0.08 + 0.051);
  g.add(visor);
  const crista = new THREE.Shape();
  crista.moveTo(-0.13, 0);
  crista.absellipse(0, 0, 0.13, 0.07, Math.PI, 0, true, 0);
  crista.lineTo(-0.13, 0);
  por(g, extrudar(crista, 0.02, -0.01, 12), lt, 0, 0.49, -0.08);
  por(g, new THREE.SphereGeometry(0.018, 10, 8), lt, 0, 0.575, -0.08);
  // a manivela
  por(g, new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12).rotateZ(Math.PI / 2), escuro, 0.215, 0.24, 0.02);
  por(g, tubo([[0.225, 0.24, 0.02], [0.24, 0.24, 0.06], [0.245, 0.2, 0.1], [0.25, 0.16, 0.12]], 0.008, 10, 5), lt, 0, 0, 0);
  por(g, new THREE.CylinderGeometry(0.014, 0.014, 0.05, 8).rotateZ(Math.PI / 2), madeiraEscura(), 0.27, 0.16, 0.12);
  return g;
}

/**
 * O PENDENTE DE ESMALTE, em cima do balcão do bar: a cúpula funda no teal
 * do clube por fora e branca por dentro (duas cascas torneadas, a de dentro
 * com a normal virada para dentro), o vivo branco na boca, o soquete de
 * latão e o fio. A luz é pintada: o halo na boca e a POÇA no tampo do
 * balcão — é ela que diz que o pendente está aceso.
 *
 * SÓ EM CIMA DO BALCÃO: sobre mesa, a 34°, a cúpula apaga a cabeça de quem
 * janta (ver `luminariaPendente`).
 */
export function pendenteDeEsmalte(altura = 2.35, teto = 3.3, alturaDaPoca = 1.17, cor: number = P.restauranteToldo): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pendente';
  const fora: Array<[number, number]> = [[0.02, 0.2], [0.06, 0.19], [0.12, 0.15], [0.18, 0.08], [0.225, 0.02], [0.245, -0.025]];
  const pecas = [
    por(g, torneado(fora, 28), toon(cor), 0, altura, 0),
    por(g, torneado(fora.map(([r, y]) => [r * 0.96, y - 0.006] as [number, number]), 28, true), toon(P.cupula, { glow: 0.35 }), 0, altura, 0),
    por(g, new THREE.TorusGeometry(0.245, 0.008, 5, 32).rotateX(Math.PI / 2), P.metalWhite, 0, altura - 0.025, 0),
    por(g, torneado([[0.001, 0], [0.03, 0], [0.032, 0.05], [0.02, 0.07], [0.001, 0.07]], 14), latao(), 0, altura + 0.19, 0),
    por(g, new THREE.CylinderGeometry(0.007, 0.007, teto - altura - 0.26, 6), carvao(), 0, (altura + 0.26 + teto) / 2, 0),
    por(g, new THREE.SphereGeometry(0.06, 12, 8), toon(P.cupula, { glow: 0.9 }), 0, altura + 0.01, 0),
  ];
  // o pendente é a luz: a sombra dele no balcão cairia bem em cima da poça
  for (const m of pecas) m.userData.semSombra = true;
  const halo = haloDeLampada(0.95, P.luzDeAbajur, 0.42);
  halo.position.y = altura - 0.03;
  g.add(halo);
  const poca = pocaDeLuz(0.75, P.luzDeAbajur, 0.3);
  poca.position.y = alturaDaPoca;
  g.add(poca);
  return g;
}

/**
 * O LAMPIÃO DE PAREDE: o espelho de ferro, o braço em voluta e a lanterna
 * pendurada — quatro colunas, o vidro fosco aceso, o telhadinho em pirâmide
 * e a ponteira. Na parede, os dois leques de luz pintada (por cima e por
 * baixo), o mesmo truque da arandela da boutique.
 *
 * A origem é o ponto da parede onde ele é chumbado; sai para `+Z`.
 */
export function lampiaoDeParede(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lampiao-de-parede';
  const ferroPreto = carvao();
  por(g, torneado([[0.001, 0.02], [0.05, 0.016], [0.06, 0], [0.001, 0]], 16).rotateX(Math.PI / 2), ferroPreto, 0, 0.04, 0);
  por(g, tubo([[0, 0.05, 0.015], [0, 0.07, 0.08], [0, 0.1, 0.15], [0, 0.12, 0.2]], 0.009, 14, 6), ferroPreto);
  por(g, tubo([[0, 0.04, 0.015], [0, -0.02, 0.05], [0, -0.01, 0.1], [0, 0.03, 0.11], [0, 0.04, 0.09]], 0.006, 16, 5), ferroPreto);
  por(g, new THREE.CylinderGeometry(0.004, 0.004, 0.05, 5), ferroPreto, 0, 0.1, 0.2);

  // a lanterna
  const C = new THREE.Vector3(0, -0.03, 0.2);
  const LADO = 0.12;
  const ALTO = 0.18;
  por(g, macia(LADO - 0.01, ALTO - 0.01, LADO - 0.01, 0.004), toon(P.cupula, { glow: 0.7 }), C.x, C.y, C.z);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    por(g, macia(0.014, ALTO, 0.014, 0.003), ferroPreto, C.x + (sx * LADO) / 2, C.y, C.z + (sz * LADO) / 2);
  }
  por(g, macia(LADO + 0.03, 0.02, LADO + 0.03, 0.005), ferroPreto, C.x, C.y - ALTO / 2 - 0.005, C.z);
  por(g, torneado([[0.001, 0], [0.02, 0], [0.012, -0.03], [0.001, -0.04]], 10), ferroPreto, C.x, C.y - ALTO / 2 - 0.015, C.z);
  const telhado = new THREE.ConeGeometry(0.105, 0.07, 4).rotateY(Math.PI / 4);
  por(g, telhado, ferroPreto, C.x, C.y + ALTO / 2 + 0.035, C.z);
  por(g, new THREE.SphereGeometry(0.014, 8, 6), ferroPreto, C.x, C.y + ALTO / 2 + 0.08, C.z);

  const halo = haloDeLampada(0.6, P.luzDeAbajur, 0.45);
  halo.position.copy(C);
  g.add(halo);
  for (const [y, raio] of [[0.38, 0.42], [-0.3, 0.32]] as const) {
    const leque = pocaDeLuz(raio, P.luzDeAbajur, 0.3, true);
    leque.position.set(0, y, 0.004);
    g.add(leque);
  }
  return g;
}

// ================================================================ OS QUADROS

/** escreve a giz: o traço duas vezes, um deslocado e fraco, que é o pó do giz */
function escreverAGiz(linhas: readonly string[], largura: number, altura: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.round((512 * altura) / largura);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const W = canvas.width;
    const H = canvas.height;
    const passo = H / (linhas.length + 0.8);
    const fonte = (px: number, negrito: boolean): string => `${negrito ? 'bold ' : ''}${Math.round(px)}px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    linhas.forEach((linha, i) => {
      const titulo = i === 0;
      const y = passo * (i + 0.75) + (titulo ? 0 : passo * 0.12);
      ctx.font = fonte(passo * (titulo ? 0.6 : 0.46), titulo);
      const cor = titulo ? '255,233,168' : '244,241,230';
      ctx.fillStyle = `rgba(${cor},0.3)`;
      ctx.fillText(linha, W / 2 + 2, y + 2);
      ctx.fillStyle = `rgba(${cor},0.92)`;
      ctx.fillText(linha, W / 2, y);
      if (titulo) {
        // o risquinho embaixo do título
        const larg = Math.min(W * 0.7, ctx.measureText(linha).width * 1.1);
        ctx.strokeStyle = `rgba(${cor},0.75)`;
        ctx.lineWidth = Math.max(3, H * 0.008);
        ctx.beginPath();
        ctx.moveTo(W / 2 - larg / 2, y + passo * 0.38);
        ctx.quadraticCurveTo(W / 2, y + passo * 0.3, W / 2 + larg / 2, y + passo * 0.38);
        ctx.stroke();
      }
    });
    // a chaminha de giz no canto de baixo
    const cx = W * 0.88;
    const cy = H * 0.88;
    const r = Math.min(W, H) * 0.045;
    ctx.fillStyle = 'rgba(255,170,90,0.85)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 1.6);
    ctx.quadraticCurveTo(cx + r * 1.2, cy - r * 0.2, cx + r * 0.6, cy + r);
    ctx.lineTo(cx - r * 0.6, cy + r);
    ctx.quadraticCurveTo(cx - r * 1.2, cy - r * 0.2, cx, cy - r * 1.6);
    ctx.fill();
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), new THREE.MeshBasicMaterial({ map: textura, transparent: true }));
}

/**
 * A LOUSA do Mania: ardósia com o rastro do apagador (`ardosia`), a moldura
 * de madeira com bisel, a CANALETA embaixo com os gizes e o apagador, e o
 * texto escrito a giz (canvas). É a mesma peça para o prato do dia e para a
 * escala do Walter.
 *
 * A origem é o meio da lousa, encostada na parede em `z = 0`.
 */
export function lousaDoMania(linhas: readonly string[], largura = 1.6, altura = 1.2): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lousa';
  por(g, molduraDeBisel(largura, altura, 0.08, 0.045), madeiraEscura(), 0, 0, 0.006);
  por(g, new THREE.BoxGeometry(largura - 0.1, altura - 0.1, 0.02), toon(0xffffff, { mapa: ardosia() }), 0, 0, 0.018);
  const escrita = escreverAGiz(linhas, largura - 0.2, altura - 0.2);
  escrita.position.z = 0.032;
  escrita.renderOrder = 1;
  g.add(escrita);
  // a canaleta, os gizes e o apagador
  const yC = -altura / 2 - 0.01;
  por(g, macia(largura - 0.06, 0.025, 0.08, 0.008), madeiraEscura(), 0, yC, 0.05);
  por(g, new THREE.CylinderGeometry(0.008, 0.008, 0.07, 6).rotateZ(Math.PI / 2), P.metalWhite, -largura * 0.3, yC + 0.02, 0.06);
  por(g, new THREE.CylinderGeometry(0.008, 0.008, 0.05, 6).rotateZ(Math.PI / 2 + 0.3), P.flowerYellow, -largura * 0.22, yC + 0.02, 0.07);
  por(g, macia(0.13, 0.03, 0.05, 0.008), madeira(), largura * 0.28, yC + 0.03, 0.055);
  por(g, macia(0.124, 0.012, 0.046, 0.004), P.churrascoGrelha, largura * 0.28, yC + 0.012, 0.055);
  return g;
}

/**
 * A PLACA DO NOME, em cima do bar: a tábua escura de quina boleada e bisel,
 * o filete de latão por dentro, o nome em dourado (o mesmo `letreiroDoMania`
 * do prédio por fora — as duas placas são da mesma casa) e três lâmpadas
 * PESCOÇO-DE-GANSO jogando luz pintada nela.
 *
 * A etiqueta é a da antiga (`placa-de-fachada`). Origem no meio da placa,
 * com a parede em `z = 0`.
 */
export function placaDoSalao(texto: string, largura = 6.2, altura = 0.9): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-de-fachada';
  const tabua = toon(P.restauranteLetreiro, { mapa: veioDeMadeira() });
  const BISEL = 0.018;
  const placa = new THREE.ExtrudeGeometry(retanguloRedondo(new THREE.Shape(), 0, 0, largura - 2 * BISEL, altura - 2 * BISEL, 0.06), {
    depth: 0.035, bevelEnabled: true, bevelThickness: BISEL, bevelSize: BISEL, bevelSegments: 2, curveSegments: 6,
  });
  placa.translate(0, 0, BISEL);
  por(g, placa, tabua, 0, 0, 0.01);
  const FRENTE = 0.01 + 0.035 + 2 * BISEL;
  const filete = retanguloRedondo(new THREE.Shape(), 0, 0, largura - 0.16, altura - 0.16, 0.045);
  filete.holes.push(retanguloRedondo(new THREE.Path(), 0, 0, largura - 0.2, altura - 0.2, 0.03));
  por(g, extrudar(filete, 0.008, FRENTE - 0.004, 6), latao(), 0, 0, 0);
  const nome = letreiroDoMania(texto, largura * 0.86, altura * 0.62);
  nome.position.z = FRENTE + 0.006;
  g.add(nome);

  // as lâmpadas pescoço-de-ganso, e a luz delas na tábua
  for (const x of [-largura * 0.32, 0, largura * 0.32]) {
    const topo = altura / 2;
    por(g, macia(0.08, 0.05, 0.02, 0.006), carvao(), x, topo - 0.06, FRENTE + 0.008);
    por(g, tubo([[x, topo - 0.06, FRENTE + 0.01], [x, topo + 0.12, FRENTE + 0.03], [x, topo + 0.2, FRENTE + 0.16], [x, topo + 0.17, FRENTE + 0.27]], 0.009, 16, 6), carvao());
    // a cúpula com a boca virada para a tábua (para baixo e para trás), e o
    // forro aceso por dentro
    const cupula = por(g, torneado([[0.001, 0.07], [0.03, 0.065], [0.06, 0.02], [0.07, 0], [0.066, -0.004], [0.001, 0.05]], 18), toon(P.restauranteToldo), x, topo + 0.15, FRENTE + 0.29);
    cupula.rotation.x = 1.0;
    const forro = por(g, torneado([[0.001, 0.045], [0.056, 0.016], [0.064, 0.0]], 18, true), toon(P.cupula, { glow: 0.9 }), x, topo + 0.15, FRENTE + 0.29);
    forro.rotation.x = 1.0;
    const brilho = haloDeLampada(0.36, P.luzDeAbajur, 0.4);
    brilho.position.set(x, topo + 0.12, FRENTE + 0.25);
    g.add(brilho);
    const luz = pocaDeLuz(0.55, P.luzDeAbajur, 0.32, true);
    luz.scale.set(1.3, 0.85, 1);
    luz.position.set(x, 0.02, FRENTE + 0.012);
    g.add(luz);
  }
  return g;
}

/**
 * O QUADRO DE EMPREGADO DO MÊS, com o retrato do Walter (o mesmo pintado em
 * canvas da peça antiga, `pintarOWalter`): agora em MOLDURA DOURADA de bisel
 * duplo, com o vidro e a LUZ DE QUADRO de latão em cima, jogando o leque
 * pintado no retrato — o troféu do funcionário iluminado como em museu.
 *
 * A etiqueta é a da antiga (`quadro-empregado-do-mes`, o `mesas.mjs` acha
 * por ela). Origem no meio do quadro, com a parede em `z = 0`.
 */
export function quadroDoWalter(largura = 0.82, altura = 1.02): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quadro-empregado-do-mes';
  por(g, molduraDeBisel(largura, altura, 0.07, 0.045, 0.012), latao(), 0, 0, 0.004);
  por(g, new THREE.BoxGeometry(largura - 0.1, altura - 0.1, 0.01), carvao(), 0, 0, 0.012);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.round((512 * altura) / largura);
  const ctx = canvas.getContext('2d');
  if (ctx) pintarOWalter(ctx, canvas.width, canvas.height, hex);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const arte = new THREE.Mesh(new THREE.PlaneGeometry(largura - 0.12, altura - 0.12), new THREE.MeshBasicMaterial({ map: textura }));
  arte.position.z = 0.03;
  arte.renderOrder = 1;
  g.add(arte);
  const vidro = new THREE.Mesh(new THREE.PlaneGeometry(largura - 0.14, (altura - 0.14) * 0.4), flat(0xffffff, 0.09, true));
  vidro.position.set(0, altura * 0.2, 0.034);
  vidro.renderOrder = 2;
  g.add(vidro);
  // a luz de quadro: o braço, a calha de latão e o leque no retrato
  const yL = altura / 2 + 0.1;
  por(g, tubo([[0, altura / 2 - 0.02, 0.04], [0, yL - 0.02, 0.06], [0, yL, 0.12]], 0.007, 10, 5), latao());
  por(g, new THREE.CylinderGeometry(0.026, 0.026, largura * 0.45, 14).rotateZ(Math.PI / 2), latao(), 0, yL, 0.13);
  por(g, macia(largura * 0.42, 0.008, 0.022, 0.003), toon(P.cupula, { glow: 0.9 }), 0, yL - 0.024, 0.13);
  const leque = pocaDeLuz(0.5, P.luzDeAbajur, 0.26, true);
  leque.scale.set(1.15, 1.3, 1);
  leque.position.set(0, altura * 0.12, 0.037);
  g.add(leque);
  return g;
}

/**
 * UM ROSTINHO NA PLAQUINHA: a cabeça redonda, os cachos em bolotas por cima
 * (a cor e a pele saem da ficha da pessoa, `characters/cast.ts`), os olhos,
 * as bochechas e o sorriso — e a presilha de estrela, no Ari.
 */
function pintarUmRosto(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, pele: number, cabelo: number, estrela: boolean): void {
  // o medalhão dourado atrás
  ctx.fillStyle = hex(P.churrascoLatao);
  ctx.beginPath();
  ctx.arc(x, y, r * 1.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f6ecd6';
  ctx.beginPath();
  ctx.arc(x, y, r * 1.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r * 1.42, 0, Math.PI * 2);
  ctx.clip();
  // os cachos de trás, o rosto, e os cachos da frente em cima da testa
  ctx.fillStyle = hex(cabelo);
  for (const [dx, dy, k] of [[-0.85, -0.2, 0.5], [0.85, -0.2, 0.5], [-0.95, 0.35, 0.42], [0.95, 0.35, 0.42]] as const) {
    ctx.beginPath();
    ctx.arc(x + dx * r, y + dy * r, k * r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = hex(pele);
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.18, r * 0.82, r * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hex(cabelo);
  for (const [dx, dy, k] of [[-0.6, -0.55, 0.42], [-0.15, -0.75, 0.45], [0.35, -0.7, 0.44], [0.75, -0.45, 0.4], [-0.85, -0.15, 0.36], [0.88, -0.1, 0.34], [0.05, -0.42, 0.34]] as const) {
    ctx.beginPath();
    ctx.arc(x + dx * r, y + dy * r, k * r, 0, Math.PI * 2);
    ctx.fill();
  }
  // os olhos, as bochechas e o sorriso
  ctx.fillStyle = '#2b2320';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + s * r * 0.3, y + r * 0.22, r * 0.09, r * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(240,120,130,0.55)';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + s * r * 0.52, y + r * 0.45, r * 0.13, r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#2b2320';
  ctx.lineWidth = r * 0.07;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y + r * 0.42, r * 0.16, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // a presilha de estrela do Ari, no cacho da esquerda
  if (estrela) {
    ctx.fillStyle = '#f7e7a8';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 === 0 ? r * 0.24 : r * 0.1;
      const px = x - r * 0.62 + Math.cos(a) * rr;
      const py = y - r * 0.5 + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/**
 * A ARTE DA PLAQUINHA: o papel creme com o fio vinho, o título, os dois
 * rostinhos lado a lado nos medalhões dourados, os nomes embaixo e o rodapé
 * com a casa e as dezoito estrelas da temporada (seis turnos, três cada).
 */
function pintarAPlaquinha(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  const papel = '#f4e8cc';
  const vinho = hex(P.gravataBorboleta);
  ctx.fillStyle = papel;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = vinho;
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, W - 24, H - 24);
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = vinho;
  ctx.font = `bold ${Math.round(H * 0.105)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillText('FUNCIONÁRIOS DO MÊS', W / 2, H * 0.14);
  const r = H * 0.17;
  pintarUmRosto(ctx, W * 0.32, H * 0.47, r, ARI.skin, ARI.hair.color, true);
  pintarUmRosto(ctx, W * 0.68, H * 0.47, r, RENAN.skin, RENAN.hair.color, false);
  ctx.fillStyle = '#3a2a22';
  ctx.font = `bold ${Math.round(H * 0.1)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillText(`${ARI.name} e ${RENAN.name}`, W / 2, H * 0.76);
  ctx.fillStyle = hex(P.churrascoLatao);
  ctx.font = `${Math.round(H * 0.058)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillText('Mania de Churrasco · ★★★ nos seis turnos', W / 2, H * 0.88);
}

/**
 * A PLAQUINHA DE FUNCIONÁRIOS DO MÊS — o prêmio da temporada (decisão do
 * Renan): fechar os seis turnos com três estrelas pendura ela ao lado do
 * quadro do Walter. Mesma família do quadro dele (moldura dourada de bisel,
 * a arte em canvas sob o vidro), mas deitada e menor — o quadro do patrão
 * continua sendo o maior da parede. Origem no meio, com a parede em `z = 0`.
 */
export function plaquinhaDosFuncionarios(largura = 0.78, altura = 0.52): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'plaquinha-funcionarios-do-mes';
  por(g, molduraDeBisel(largura, altura, 0.06, 0.04, 0.01), latao(), 0, 0, 0.004);
  por(g, new THREE.BoxGeometry(largura - 0.08, altura - 0.08, 0.01), carvao(), 0, 0, 0.012);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.round((512 * altura) / largura);
  const ctx = canvas.getContext('2d');
  if (ctx) pintarAPlaquinha(ctx, canvas.width, canvas.height);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const arte = new THREE.Mesh(new THREE.PlaneGeometry(largura - 0.1, altura - 0.1), new THREE.MeshBasicMaterial({ map: textura }));
  arte.position.z = 0.03;
  arte.renderOrder = 1;
  g.add(arte);
  const vidro = new THREE.Mesh(new THREE.PlaneGeometry(largura - 0.12, (altura - 0.12) * 0.4), flat(0xffffff, 0.09, true));
  vidro.position.set(0, altura * 0.2, 0.034);
  vidro.renderOrder = 2;
  g.add(vidro);
  return g;
}

/** o cartaz dos cortes: o boi de perfil, dividido nos cortes com o nome de cada um */
function pintarOsCortes(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  const papel = '#f1e2c2';
  const vinho = hex(P.gravataBorboleta);
  ctx.fillStyle = papel;
  ctx.fillRect(0, 0, W, H);
  // o fio duplo da borda
  ctx.strokeStyle = vinho;
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, W - 52, H - 52);
  // o título na faixa
  ctx.fillStyle = vinho;
  ctx.fillRect(40, H * 0.07, W - 80, H * 0.11);
  ctx.fillStyle = papel;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.round(H * 0.07)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillText('CORTES DO BOI', W / 2, H * 0.125);

  // o boi, num quadro de 1 × 0,62 levado para o canvas
  const S = W * 0.86;
  const ox = W * 0.07;
  const oy = H * 0.3;
  const P2 = (x: number, y: number): [number, number] => [ox + x * S, oy + y * S];
  const corpo = new Path2D();
  const passos: Array<[number, number] | [number, number, number, number]> = [
    [0.1, 0.12], [0.19, 0.14, 0.2, 0.12], [0.27, 0.035, 0.31, 0.05], [0.36, 0.12, 0.34, 0.1],
    [0.6, 0.11, 0.48, 0.105], [0.88, 0.12, 0.8, 0.1], [0.94, 0.3, 0.95, 0.16], [0.9, 0.42, 0.93, 0.38],
    [0.895, 0.58], [0.84, 0.58], [0.83, 0.44], [0.6, 0.46, 0.72, 0.47], [0.38, 0.45, 0.48, 0.46],
    [0.365, 0.58], [0.305, 0.58], [0.29, 0.43], [0.16, 0.34, 0.22, 0.42], [0.04, 0.28, 0.1, 0.32],
    [0.01, 0.2, 0.0, 0.25], [0.1, 0.12, 0.03, 0.13],
  ];
  const [sx, sy] = P2(0.1, 0.12);
  corpo.moveTo(sx, sy);
  for (const p of passos.slice(1)) {
    if (p.length === 2) {
      const [x, y] = P2(p[0], p[1]);
      corpo.lineTo(x, y);
    } else {
      const [cx, cy] = P2(p[2], p[3]);
      const [x, y] = P2(p[0], p[1]);
      corpo.quadraticCurveTo(cx, cy, x, y);
    }
  }
  corpo.closePath();
  ctx.fillStyle = hex(P.churrascoTijolo);
  ctx.fill(corpo);
  // o chifre, a orelha e o rabo
  ctx.strokeStyle = hex(P.churrascoTijolo);
  ctx.lineCap = 'round';
  ctx.lineWidth = S * 0.018;
  ctx.beginPath();
  ctx.moveTo(...P2(0.12, 0.13));
  ctx.quadraticCurveTo(...P2(0.17, 0.08), ...P2(0.15, 0.03));
  ctx.stroke();
  ctx.lineWidth = S * 0.01;
  ctx.beginPath();
  ctx.moveTo(...P2(0.92, 0.15));
  ctx.quadraticCurveTo(...P2(0.98, 0.25), ...P2(0.965, 0.42));
  ctx.stroke();
  ctx.fillStyle = hex(P.churrascoTijolo);
  ctx.beginPath();
  ctx.ellipse(...P2(0.966, 0.44), S * 0.012, S * 0.026, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(...P2(0.165, 0.15), S * 0.03, S * 0.014, 0.4, 0, Math.PI * 2);
  ctx.fill();
  // as linhas dos cortes, só dentro do boi
  ctx.save();
  ctx.clip(corpo);
  ctx.strokeStyle = papel;
  ctx.lineWidth = Math.max(3, S * 0.006);
  const linha = (pontos: Array<[number, number]>): void => {
    ctx.beginPath();
    ctx.moveTo(...P2(...pontos[0]));
    for (const p of pontos.slice(1)) ctx.lineTo(...P2(...p));
    ctx.stroke();
  };
  linha([[0.22, 0.15], [0.37, 0.15]]);
  linha([[0.37, 0.05], [0.37, 0.3]]);
  linha([[0.2, 0.3], [0.62, 0.3]]);
  linha([[0.37, 0.21], [0.62, 0.21]]);
  linha([[0.62, 0.05], [0.62, 0.5]]);
  linha([[0.62, 0.3], [0.97, 0.3]]);
  linha([[0.76, 0.05], [0.76, 0.3]]);
  linha([[0.76, 0.17], [0.97, 0.2]]);
  linha([[0.73, 0.3], [0.73, 0.5]]);
  linha([[0.83, 0.3], [0.83, 0.5]]);
  linha([[0.0, 0.2], [0.2, 0.3]]);
  ctx.restore();
  // os nomes
  ctx.fillStyle = papel;
  ctx.font = `bold ${Math.round(S * 0.026)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  for (const [nome, x, y] of [
    ['cupim', 0.3, 0.1], ['acém', 0.29, 0.22], ['peito', 0.3, 0.37], ['contrafilé', 0.495, 0.165],
    ['costela', 0.495, 0.255], ['ponta', 0.495, 0.37], ['alcatra', 0.69, 0.235], ['picanha', 0.865, 0.24],
    ['maminha', 0.675, 0.4], ['fraldinha', 0.78, 0.4], ['coxão', 0.89, 0.37],
  ] as const) {
    ctx.fillText(nome, ...P2(x, y));
  }
  // o pé do cartaz
  ctx.fillStyle = vinho;
  ctx.font = `bold ${Math.round(H * 0.045)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillText('MANIA DE CHURRASCO', W / 2, H * 0.86);
  for (let i = 0; i < 3; i++) {
    const cx = W / 2 + (i - 1) * W * 0.07;
    const cy = H * 0.92;
    const r = H * 0.014;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const rr = k % 2 === 0 ? r : r * 0.45;
      if (k === 0) ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      else ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * O CARTAZ DOS CORTES DO BOI, no lugar do quadro verde sem nada dentro: o
 * mapa do boi que toda churrascaria tem na parede, pintado em canvas na hora
 * (o boi de perfil, as linhas e o nome de cada corte), numa moldura fina
 * escura com vidro.
 */
export function cartazDosCortes(largura = 0.62, altura = 0.82): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cartaz-dos-cortes';
  por(g, molduraDeBisel(largura, altura, 0.035, 0.03, 0.006), carvao(), 0, 0, 0.004);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.round((512 * altura) / largura);
  const ctx = canvas.getContext('2d');
  if (ctx) pintarOsCortes(ctx, canvas.width, canvas.height);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  const arte = new THREE.Mesh(new THREE.PlaneGeometry(largura - 0.05, altura - 0.05), new THREE.MeshBasicMaterial({ map: textura }));
  arte.position.z = 0.018;
  arte.renderOrder = 1;
  g.add(arte);
  const vidro = new THREE.Mesh(new THREE.PlaneGeometry(largura - 0.06, (altura - 0.06) * 0.35), flat(0xffffff, 0.08, true));
  vidro.position.set(0, altura * 0.22, 0.022);
  vidro.renderOrder = 2;
  g.add(vidro);
  return g;
}

// ============================================================== AS MESAS

/**
 * As medidas que a CENA da mesa e o TURNO usam, e que a mesa nova manteve
 * da `diningTable(1,5; 1,0)` antiga: o prato servido pousa em `y = 0,82`, a
 * louça suja em 0,8 (a toalha fica entre os dois, em 0,812), a dupla senta
 * nas cadeiras de `x = ±0,55`, `z = ±0,95`, com o topo do assento em 0,50.
 */
export const MESA_DO_SALAO = { largura: 1.5, fundo: 1.0, toalha: 0.812, assento: 0.5 } as const;

/**
 * A TOALHA XADREZ de uma mesa RETANGULAR, jogada por cima: o tampo plano e a
 * SAIA que dá a volta no retângulo de quina redonda e cai — pouco no meio de
 * cada lado (o joelho de quem senta), e mais nas QUATRO PONTAS, onde o pano
 * sobra e desce em bico. As dobras são uma onda em volta, que só existe
 * embaixo. O UV é em metros: o tampo no chão (`x`, `z`), a saia desenrolada
 * (o caminho em volta, a altura) — o xadrez sai reto nos dois.
 */
function toalhaRetangular(hx: number, hz: number, topo: number): THREE.BufferGeometry[] {
  const R = 0.05;
  // o contorno de quina redonda, amostrado com o comprimento acumulado
  const pontos: Array<{ x: number; z: number; nx: number; nz: number; s: number; canto: number }> = [];
  const lados = [
    { de: [hx - R, -hz], ate: [-hx + R, -hz], n: [0, -1] },
    { de: [-hx, -hz + R], ate: [-hx, hz - R], n: [-1, 0] },
    { de: [-hx + R, hz], ate: [hx - R, hz], n: [0, 1] },
    { de: [hx, hz - R], ate: [hx, -hz + R], n: [1, 0] },
  ] as const;
  const centros = [[-hx + R, -hz + R], [-hx + R, hz - R], [hx - R, hz - R], [hx - R, -hz + R]] as const;
  const angulos = [[-Math.PI / 2, -Math.PI], [Math.PI, Math.PI / 2], [Math.PI / 2, 0], [0, -Math.PI / 2]] as const;
  let s = 0;
  let ultimo: [number, number] | null = null;
  const anda = (x: number, z: number, nx: number, nz: number, canto: number): void => {
    if (ultimo) s += Math.hypot(x - ultimo[0], z - ultimo[1]);
    ultimo = [x, z];
    pontos.push({ x, z, nx, nz, s, canto });
  };
  lados.forEach((lado, i) => {
    const PASSOS = 12;
    for (let k = 0; k < PASSOS; k++) {
      const t = k / PASSOS;
      const x = lado.de[0] + (lado.ate[0] - lado.de[0]) * t;
      const z = lado.de[1] + (lado.ate[1] - lado.de[1]) * t;
      // a ponta pesa perto das quinas: 1 no canto, 0 no meio do lado
      const meio = Math.abs(t - 0.5) * 2;
      anda(x, z, lado.n[0], lado.n[1], Math.pow(meio, 6));
    }
    const [cx, cz] = centros[i];
    const [a0, a1] = angulos[i];
    for (let k = 0; k < 6; k++) {
      const a = a0 + ((a1 - a0) * k) / 6;
      anda(cx + Math.cos(a) * R, cz - Math.sin(a) * R, Math.cos(a), -Math.sin(a), 1);
    }
  });
  const primeiro = pontos[0];
  anda(primeiro.x, primeiro.z, primeiro.nx, primeiro.nz, primeiro.canto);
  const N = pontos.length;

  const malha = (linhas: number, ponto: (i: number, j: number) => [number, number, number, number, number]): THREE.BufferGeometry => {
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    for (let j = 0; j <= linhas; j++) {
      for (let i = 0; i < N; i++) {
        const [x, y, z, u, v] = ponto(i, j);
        pos.push(x, y, z);
        uv.push(u, v);
      }
    }
    for (let j = 0; j < linhas; j++) {
      for (let i = 0; i < N - 1; i++) {
        const a = j * N + i;
        const b = a + 1;
        const c = a + N;
        const d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };

  // o tampo: um leque do centro até a borda, com a quina macia
  const aneis: Array<[number, number]> = [[0, topo], [1, topo], [1.0, topo - 0.006]];
  const tampo = malha(aneis.length - 1, (i, j) => {
    const p = pontos[i];
    const [k, y] = aneis[j];
    const fora = j === 2 ? 0.014 : 0;
    const x = p.x * k + p.nx * fora;
    const z = p.z * k + p.nz * fora;
    return [x, y, z, x, z];
  });
  // a saia: da quina até a barra, abrindo um pouco e dobrando embaixo
  const LINHAS = 5;
  const NO_LADO = 0.12;
  const NA_PONTA = 0.26;
  const saia = malha(LINHAS, (i, j) => {
    const p = pontos[i];
    const t = j / LINHAS;
    const queda = NO_LADO + (NA_PONTA - NO_LADO) * p.canto;
    const dobra = 0.018 * Math.sin(p.s * 22) * t * t;
    const sai = 0.016 + 0.012 * t + 0.05 * p.canto * t * t + dobra;
    const y = topo - 0.006 - queda * t;
    return [p.x + p.nx * sai, y, p.z + p.nz * sai, p.s, y];
  });
  return [tampo, saia];
}

/**
 * A CADEIRA DE BISTRÔ do salão: a mesma família da cadeira da área externa
 * (o encosto de duas travessas CURVAS, os pés de trás subindo em curva até
 * ele), na madeira do lambri e com a almofada de couro das banquetas — e com
 * o topo do assento nos 0,50 em que a pose de sentado da cena encaixa.
 */
export function cadeiraDoSalao(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cadeira-do-salao';
  const md = madeira();
  const topo = MESA_DO_SALAO.assento;
  por(g, macia(0.46, 0.05, 0.44, 0.015), md, 0, topo - 0.085, 0);
  por(g, macia(0.42, 0.06, 0.4, 0.028), toon(P.churrascoCouro), 0, topo - 0.03, 0.005);
  for (const s of [-1, 1] as const) {
    // sem as tampas: a de cima encosta no assento e a de baixo no chão
    const pe = new THREE.CylinderGeometry(0.024, 0.017, topo - 0.11, 8, 1, true);
    pe.translate(0, (topo - 0.11) / 2, 0);
    const m = por(g, pe, md, s * 0.19, 0, 0.17);
    m.rotation.set(0.04, 0, -s * 0.04);
  }
  const atras = (y: number): number => -0.17 - 0.08 * Math.max(0, (y - topo + 0.11) / 0.5);
  for (const s of [-1, 1] as const) {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.19, 0, -0.15),
      new THREE.Vector3(s * 0.19, topo - 0.11, atras(topo - 0.11)),
      new THREE.Vector3(s * 0.195, 0.72, atras(0.72)),
      new THREE.Vector3(s * 0.2, 0.94, atras(0.94)),
    ]);
    por(g, new THREE.TubeGeometry(curva, 8, 0.021, 6, false), md);
  }
  const travessa = (y0: number, y1: number): void => {
    const R = 0.8;
    const meia = 0.21;
    const ang = Math.asin(meia / R);
    const forma = new THREE.Shape();
    forma.absarc(0, 0, R + 0.012, -Math.PI / 2 - ang, -Math.PI / 2 + ang, false);
    forma.absarc(0, 0, R - 0.012, -Math.PI / 2 + ang, -Math.PI / 2 - ang, true);
    forma.closePath();
    const geo = new THREE.ExtrudeGeometry(forma, { depth: y1 - y0, bevelEnabled: false, curveSegments: 4 });
    geo.rotateX(Math.PI / 2);
    por(g, geo, md, 0, y1, atras((y0 + y1) / 2) + R * Math.cos(ang));
  };
  travessa(0.84, 0.94);
  travessa(0.64, 0.7);
  // as travessas de baixo: as pontas moram dentro dos pés, então sem tampa
  for (const s of [-1, 1] as const) por(g, new THREE.CylinderGeometry(0.011, 0.011, 0.33, 6, 1, true).rotateX(Math.PI / 2), md, s * 0.19, 0.16, 0.01);
  por(g, new THREE.CylinderGeometry(0.011, 0.011, 0.38, 6, 1, true).rotateZ(Math.PI / 2), md, 0, 0.2, -0.155);
  return g;
}

/**
 * A MESA DO SALÃO, posta: o tampo de madeira com a SAIA de cinta e os
 * QUATRO PÉS TORNEADOS, a TOALHA XADREZ caindo (`toalhaRetangular`), o
 * porta-temperos na ponta da direita (longe do centro, onde o garçom pousa o
 * prato) e as QUATRO CADEIRAS de bistrô nos mesmos lugares das antigas.
 *
 * O VASINHO MORA NO GRUPO `floreira`, com o atalho em `userData.floreira`,
 * na origem da mesa: é ele que a cena e o turno escondem enquanto o prato
 * está na mesa. As cadeiras perdem a etiqueta aqui dentro, para a `fundir()`
 * juntar a madeira delas com a da mesa.
 */
export function mesaDoSalao(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-do-salao';
  const { largura: W, fundo: D, toalha: TOPO } = MESA_DO_SALAO;
  const md = madeira();
  const TAMPO = TOPO - 0.003;
  // o tampo (a cinta embaixo dele fica toda atrás da saia da toalha, e não
  // entra: seriam 400 triângulos por mesa que ninguém vê)
  por(g, macia(W - 0.04, 0.045, D - 0.04, 0.012), md, 0, TAMPO - 0.0225, 0);
  const alto = TAMPO - 0.045;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    por(g, torneado([
      [0.001, 0], [0.022, 0], [0.026, 0.03], [0.02, 0.1], [0.026, alto * 0.42], [0.02, alto * 0.5],
      [0.03, alto * 0.62], [0.03, alto * 0.72], [0.032, alto * 0.74], [0.032, alto], [0.001, alto],
    ], 8), md, sx * (W / 2 - 0.13), 0, sz * (D / 2 - 0.13));
  }
  const pano = toon(0xffffff, { mapa: toalhaXadrez() });
  for (const geo of toalhaRetangular(W / 2 - 0.02, D / 2 - 0.02, TOPO)) g.add(new THREE.Mesh(geo, pano));

  // a floreira: o vasinho torneado com três flores
  const floreira = new THREE.Group();
  floreira.name = 'floreira';
  por(floreira, torneado([[0.001, 0], [0.04, 0], [0.055, 0.04], [0.05, 0.09], [0.03, 0.12], [0.032, 0.135], [0.001, 0.135]], 12), P.vasoCreme, 0, TOPO, 0);
  for (const [dx, dz, y, cor] of [[-0.03, 0.01, 0.2, P.flowerPink], [0.03, -0.01, 0.22, P.flowerYellow], [0.0, 0.03, 0.18, P.churrascoToalha]] as const) {
    por(floreira, tubo([[0, TOPO + 0.12, 0], [dx * 0.6, TOPO + y - 0.05, dz * 0.6], [dx, TOPO + y, dz]], 0.004, 6, 4), P.leafMid);
    por(floreira, new THREE.SphereGeometry(0.03, 7, 5), cor, dx, TOPO + y, dz);
    por(floreira, new THREE.SphereGeometry(0.012, 6, 5), P.flowerYellow, dx, TOPO + y + 0.022, dz);
  }
  for (const s of [-1, 1] as const) {
    const folha = por(floreira, new THREE.SphereGeometry(0.03, 8, 6), P.leafMid, s * 0.035, TOPO + 0.15, 0);
    folha.scale.set(1, 0.35, 0.55);
    folha.rotation.z = s * 0.5;
  }
  g.add(floreira);
  g.userData.floreira = floreira;

  // o porta-temperos na ponta da direita: a bandejinha e os três frascos
  {
    const bandeja = new THREE.Group();
    bandeja.position.set(W / 2 - 0.2, TOPO, 0);
    bandeja.rotation.y = Math.PI / 2;
    g.add(bandeja);
    por(bandeja, macia(0.2, 0.025, 0.09, 0.008), madeiraEscura(), 0, 0.0125, 0);
    const frascos = new Lote(new THREE.CylinderGeometry(0.02, 0.022, 0.1, 8), toon(0xffffff));
    const bicos = new Lote(new THREE.ConeGeometry(0.014, 0.035, 8), toon(0xffffff));
    [P.churrascoToalha, P.flowerYellow, P.leafMid].forEach((cor, i) => {
      const x = -0.06 + i * 0.06;
      frascos.por(null, new THREE.Vector3(x, 0.075, 0), new THREE.Quaternion(), 1, cor);
      bicos.por(null, new THREE.Vector3(x, 0.142, 0), new THREE.Quaternion(), 1, i === 2 ? P.gold : P.metalWhite);
    });
    frascos.montar(bandeja);
    bicos.montar(bandeja);
  }

  // as quatro cadeiras, nos lugares das antigas
  for (const [dx, dz, rot] of [
    [-0.55, 0.95, Math.PI], [0.55, 0.95, Math.PI], [-0.55, -0.95, 0], [0.55, -0.95, 0],
  ] as const) {
    const cadeira = cadeiraDoSalao();
    delete cadeira.userData.peca;
    cadeira.position.set(dx, 0, dz);
    cadeira.rotation.y = rot;
    g.add(cadeira);
  }
  return g;
}

// ============================================== PAREDE, PORTA E ENTRADA

/**
 * Dá acabamento a uma parede que a cena levantou com `w.wall` (a malha que
 * ele devolve): o UV de parede (`uvDeParede`: o `v` na altura, a partir do
 * chão) e o material — reboco, tijolinho ou azulejo.
 */
export function revestir(parede: THREE.Mesh, acabamento: 'reboco' | 'tijolo', cor: number = P.churrascoParede): THREE.Mesh {
  const geo = parede.geometry as THREE.BoxGeometry;
  const meiaAltura = geo.parameters.height / 2;
  parede.geometry = uvDeParede(geo, parede.position.x + parede.position.z, meiaAltura, 0);
  parede.material = acabamento === 'reboco' ? toon(cor, { mapa: reboco() }) : tijolo();
  return parede;
}

/**
 * UM PANO DE REVESTIMENTO para colar numa parede: tijolinho (atrás da
 * grelha) ou azulejo de metrô (atrás da pia), de `comprimento × altura` e 4
 * cm de espessura. Corre em X, com a parede em `z = 0`. O azulejo ganha o
 * arremate boleado em cima.
 */
export function panoDeParede(comprimento: number, altura: number, tipo: 'tijolo' | 'azulejo'): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = tipo === 'tijolo' ? 'pano-de-tijolo' : 'pano-de-azulejo';
  const mat = tipo === 'tijolo' ? tijolo() : toon(0xffffff, { mapa: azulejoDeMetro() });
  const geo = new THREE.BoxGeometry(comprimento, altura, 0.04);
  const m = new THREE.Mesh(uvDeParede(geo, 0, altura / 2, 0), mat);
  m.position.set(0, altura / 2, 0.02);
  g.add(m);
  if (tipo === 'azulejo') {
    const arremate = new THREE.CylinderGeometry(0.022, 0.022, comprimento, 10).rotateZ(Math.PI / 2);
    por(g, arremate, P.churrascoAzulejo, 0, altura, 0.03);
  }
  return g;
}

const PERFIL_RODAPE_DO_SALAO: Perfil = [
  [0, 0], [0.028, 0], [0.028, 0.1], [0.02, 0.11], [0.023, 0.124], [0.01, 0.138], [0, 0.142],
];
const PERFIL_CIMALHA: Perfil = [
  [0, 0], [0.018, 0.004], [0.028, 0.016], [0.034, 0.036], [0.026, 0.05], [0.032, 0.06], [0.024, 0.074], [0, 0.08],
];

/**
 * O LAMBRI DO SALÃO: tábuas em pé de 10 cm (`tabuasDeLambri`), o RODAPÉ e a
 * CIMALHA com perfil de verdade (os mesmos `frisoReto` da boiserie da
 * Estella, em madeira escura). Corre em X, com a parede em `z = 0`.
 */
export function lambriDoSalao(comprimento: number, altura = 1.05): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lambri';
  const tabuas = toon(P.churrascoFaixa, { mapa: tabuasDeLambri() });
  // as tábuas param 4 mm antes das pontas do rodapé e da cimalha
  const geo = new THREE.BoxGeometry(comprimento - 0.008, altura - 0.14, 0.025);
  const m = new THREE.Mesh(uvDeParede(geo, 0, (altura - 0.14) / 2 + 0.12, 0), tabuas);
  m.position.set(0, 0.12 + (altura - 0.14) / 2, 0.0125);
  g.add(m);
  por(g, frisoReto(PERFIL_RODAPE_DO_SALAO, comprimento), madeiraEscura(), 0, 0, 0);
  por(g, frisoReto(PERFIL_CIMALHA, comprimento), madeiraEscura(), 0, altura - 0.06, 0);
  return g;
}

/**
 * A CAPA DE MADEIRA de uma mureta: a tábua boleada por cima do tijolinho,
 * um dedo mais larga que o muro dos dois lados. `comprimento` corre em X.
 */
export function capaDeMureta(comprimento: number, espessura = 0.3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'capa-de-mureta';
  por(g, macia(comprimento, 0.06, espessura + 0.08, 0.02), madeiraEscura(), 0, 0.02, 0);
  return g;
}

/**
 * O PILARETE da entrada da frente: o dado de baixo, o fuste torneado, o
 * capitel quadrado e a bola. Ele arremata a ponta da mureta onde o cliente
 * do turno entra.
 */
export function pilarete(alto = 0.82): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pilarete';
  const esc = madeiraEscura();
  por(g, macia(0.2, 0.2, 0.2, 0.02), esc, 0, 0.1, 0);
  por(g, torneado([
    [0.001, 0.2], [0.07, 0.2], [0.075, 0.23], [0.05, 0.27], [0.055, 0.38], [0.045, 0.46],
    [0.06, 0.52], [0.045, 0.58], [0.05, alto - 0.14], [0.07, alto - 0.12], [0.001, alto - 0.12],
  ], 16), esc);
  por(g, macia(0.18, 0.07, 0.18, 0.015), esc, 0, alto - 0.085, 0);
  por(g, new THREE.SphereGeometry(0.065, 16, 12), esc, 0, alto + 0.01, 0);
  return g;
}

/**
 * A PORTA DE SERVIÇO, vai e vem: a folha de madeira com a ESCOTILHA redonda
 * (um furo na forma extrudada, o aro de inox dos dois lados e o vidro), a
 * chapa de chute e a chapa de empurrar de inox nas duas faces, e o batente.
 *
 * O CONTRATO DA `interiorDoor` CONTINUA: a folha e as chapas moram na
 * `dobradica` (o grupo com nome, na lateral esquerda), e a porta vai
 * centrada na linha da parede.
 *
 * O VÃO DA PAREDE É MAIOR QUE A PORTA (2,2 contra 1,1), e sobrava um buraco
 * dos dois lados por onde se via o fundo. `vao` e `alturaDaParede` fecham
 * esse buraco com reboco — o `recuo` é onde fica a linha da parede no `z`
 * da porta (a cena põe a porta 10 cm para dentro).
 */
export function portaDeServico(
  cor: number = P.churrascoFaixa, largura = 1.1, altura = 2.2,
  vao = 2.2, alturaDaParede = 3.3, recuo = -0.1,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'porta-de-servico';
  const md = toon(cor, { mapa: veioDeMadeira() });
  const esc = madeiraEscura();

  const dobradica = new THREE.Group();
  dobradica.name = 'dobradica';
  dobradica.position.x = -largura / 2;
  g.add(dobradica);
  const ESC = { x: largura / 2, y: altura * 0.7, r: 0.17 };
  const folha = retangulo(new THREE.Shape(), 0, 0, largura, altura);
  folha.holes.push(new THREE.Path().absarc(ESC.x, ESC.y, ESC.r, 0, Math.PI * 2, true));
  por(dobradica, extrudar(folha, 0.06, -0.03, 24), md, 0, 0, 0);
  for (const s of [-1, 1] as const) {
    por(dobradica, new THREE.TorusGeometry(ESC.r + 0.005, 0.022, 8, 28), inox(), ESC.x, ESC.y, s * 0.03);
    por(dobradica, macia(largura - 0.06, 0.3, 0.008, 0.003), inox(), largura / 2, 0.18, s * 0.034);
    por(dobradica, macia(0.11, 0.32, 0.006, 0.002), inox(), largura - 0.14, altura * 0.47, s * 0.033);
  }
  const vidro = new THREE.Mesh(new THREE.CircleGeometry(ESC.r, 28), flat(P.restauranteVidro, 0.55));
  vidro.position.set(ESC.x, ESC.y, 0);
  vidro.renderOrder = 2;
  dobradica.add(vidro);

  // o batente e a verga
  for (const s of [-1, 1] as const) {
    por(g, macia(0.09, altura + 0.1, 0.24, 0.01), esc, (s * (largura + 0.09)) / 2, (altura + 0.1) / 2, 0);
  }
  // a verga cobre o alto dos batentes e sai meio centímetro na frente deles
  por(g, macia(largura + 0.2, 0.11, 0.25, 0.01), esc, 0, altura + 0.055, 0);

  // o resto do vão, em reboco: os dois lados e o alto
  const parede = toon(P.churrascoParede, { mapa: reboco() });
  const deLado = (vao - largura - 0.18) / 2;
  if (deLado > 0.005) {
    for (const s of [-1, 1] as const) {
      const geo = new THREE.BoxGeometry(deLado, alturaDaParede, 0.3);
      const x = s * (largura / 2 + 0.09 + deLado / 2);
      const m = new THREE.Mesh(uvDeParede(geo, x, alturaDaParede / 2, 0), parede);
      m.position.set(x, alturaDaParede / 2, recuo);
      g.add(m);
    }
  }
  const sobra = alturaDaParede - altura - 0.1;
  if (sobra > 0.005) {
    const geo = new THREE.BoxGeometry(largura + 0.18, sobra, 0.3);
    const m = new THREE.Mesh(uvDeParede(geo, 0, altura + 0.1 + sobra / 2, 0), parede);
    m.position.set(0, altura + 0.1 + sobra / 2, recuo);
    g.add(m);
  }
  return g;
}

// ================================================== AS MELHORIAS DO TURNO

/*
 * As peças das MELHORIAS da escala do Walter (§13.6 de
 * `docs/MINIGAME-RESTAURANTE.md`). O princípio é o do regador da estufa: a
 * melhoria não é um ícone no canto da tela, é uma coisa que se vê no salão —
 * a bandeja na mão dos dois, o bloquinho na hora de anotar, a chapa nova na
 * ilha, o cavalete na entrada, o rádio no bar e o carrinho entre as mesas.
 */

/** onde cada prato pousa na bandeja (x, z), na de sempre e na grande */
export const VAGAS_DA_BANDEJA = {
  normal: [[-0.075, 0.005], [0.075, -0.005]],
  grande: [[-0.125, 0.03], [0, -0.05], [0.125, 0.03]],
} as const;

/**
 * A BANDEJA DE GARÇOM — a de inox redonda que os dois seguram durante o turno,
 * e a GRANDE (a melhoria "Bandeja grande"), oval, que cabe três coisas.
 *
 * O prato é torneado: o fundo raso, a borda que sobe e vira para fora, e a
 * cortiça antiderrapante por dentro. O que a dupla carrega pousa no grupo
 * `carga` (as vagas em `VAGAS_DA_BANDEJA`), e anda junto com a mão.
 *
 * A origem é a MÃO: o prato fica um dedo acima dela e um tico para a frente,
 * que é como garçom segura — a palma por baixo do meio.
 */
export function bandejaDeGarcom(grande = false): THREE.Group {
  const g = new THREE.Group();
  g.name = 'bandeja';
  g.userData.peca = 'bandeja-de-garcom';
  const R = grande ? 0.185 : 0.155;
  const prato = new THREE.Group();
  prato.position.set(0, 0.025, 0.05);
  if (grande) prato.scale.x = 1.35;
  g.add(prato);
  por(prato, torneado([
    [0.001, 0], [R * 0.93, 0], [R * 0.985, 0.006], [R * 1.02, 0.024], [R * 1.035, 0.027],
    [R * 1.01, 0.028], [R * 0.975, 0.012], [R * 0.95, 0.009], [0.001, 0.009],
  ], 36), inox());
  // a cortiça fica um fio ACIMA do fundo (0,0095 a 0,0125): encostada nele, as
  // duas faces de cima brigariam pelo pixel
  por(prato, new THREE.CylinderGeometry(R * 0.74, R * 0.74, 0.003, 36), P.churrascoCortica, 0, 0.011, 0);
  const carga = new THREE.Group();
  carga.name = 'carga';
  carga.position.set(0, 0.038, 0.05);
  g.add(carga);
  g.userData.carga = carga;
  g.userData.vagas = grande ? VAGAS_DA_BANDEJA.grande : VAGAS_DA_BANDEJA.normal;
  return g;
}

/** a folha da comanda: as linhas azuis, a margem e o pedido rabiscado a lápis */
let folhaDaComanda: THREE.CanvasTexture | null = null;
function texturaDaComanda(): THREE.CanvasTexture {
  if (folhaDaComanda) return folhaDaComanda;
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = hex(P.churrascoComanda);
    ctx.fillRect(0, 0, 192, 256);
    ctx.strokeStyle = hex(P.churrascoComandaLinha);
    ctx.lineWidth = 3;
    for (let y = 46; y < 256; y += 26) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(182, y);
      ctx.stroke();
    }
    ctx.strokeStyle = hex(P.churrascoTomate);
    ctx.beginPath();
    ctx.moveTo(34, 10);
    ctx.lineTo(34, 250);
    ctx.stroke();
    // o pedido: três linhas a lápis, cada uma do seu tamanho
    ctx.strokeStyle = 'rgba(60,60,70,0.85)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (const [y, fim] of [[40, 150], [66, 120], [92, 165]] as const) {
      ctx.beginPath();
      ctx.moveTo(44, y);
      for (let x = 44; x < fim; x += 10) ctx.lineTo(x + 5, y - 4 + ((x / 10) % 2) * 8);
      ctx.stroke();
    }
  }
  folhaDaComanda = new THREE.CanvasTexture(canvas);
  folhaDaComanda.colorSpace = THREE.SRGBColorSpace;
  folhaDaComanda.anisotropy = 4;
  return folhaDaComanda;
}

/**
 * O BLOQUINHO DE COMANDAS — a melhoria que corta pela metade o tempo de
 * anotar. Ele aparece na mão de quem anota, na hora de anotar: a capa de
 * couro, o maço de folhas, a espiral em cima, a folha pautada com o pedido
 * rabiscado, e o lápis amarelo deitado por cima, de borracha cor-de-rosa.
 *
 * Inclinado para quem segura (é para ele que a folha está virada), mas não
 * tanto que a câmera de cima perca a folha.
 */
export function bloquinhoDeComandas(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'bloquinho';
  g.userData.peca = 'bloquinho-de-comandas';
  const b = new THREE.Group();
  b.position.set(0, 0.03, 0.05);
  b.rotation.x = -0.45;
  // NA ESCALA DO CORPO CHIBI: do tamanho de um bloquinho de verdade ele some
  // na mão (a foto mostrou um risquinho na cintura). Cabeção pede bloco grande
  b.scale.setScalar(1.7);
  g.add(b);
  const L = 0.085;
  const C = 0.115;
  por(b, macia(L, 0.008, C, 0.004), P.churrascoCouro, 0, 0.004, 0);
  por(b, macia(L - 0.006, 0.01, C - 0.01, 0.002), P.churrascoComanda, 0, 0.012, 0.003);
  const folha = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.01, C - 0.016), toon(0xffffff, { mapa: texturaDaComanda() }));
  folha.rotation.x = -Math.PI / 2;
  folha.position.set(0, 0.0175, 0.004);
  b.add(folha);
  // a espiral: sete argolinhas atravessando a beira de cima
  for (let i = 0; i < 7; i++) {
    por(b, new THREE.TorusGeometry(0.0055, 0.0011, 4, 10).rotateY(Math.PI / 2), P.metalWhite, -L / 2 + 0.012 + i * ((L - 0.024) / 6), 0.012, -C / 2 + 0.004);
  }
  // o lápis: o corpo sextavado, a ponta de madeira, o grafite, a virola e a borracha
  const lapis = new THREE.Group();
  lapis.position.set(0.008, 0.024, 0.008);
  lapis.rotation.set(0, 0.55, Math.PI / 2);
  b.add(lapis);
  por(lapis, new THREE.CylinderGeometry(0.0045, 0.0045, 0.1, 6), P.churrascoLapis, 0, 0, 0);
  por(lapis, new THREE.ConeGeometry(0.0045, 0.018, 6), P.churrascoLapisMadeira, 0, -0.059, 0).rotation.x = Math.PI;
  por(lapis, new THREE.ConeGeometry(0.0016, 0.006, 6), P.churrascoCarvao, 0, -0.0675, 0).rotation.x = Math.PI;
  por(lapis, new THREE.CylinderGeometry(0.0048, 0.0048, 0.01, 8), latao(), 0, 0.055, 0);
  por(lapis, new THREE.CylinderGeometry(0.0044, 0.0044, 0.009, 8), P.churrascoBorracha, 0, 0.0645, 0);
  return g;
}

/**
 * A CHAPA NOVA DO WALTER — a melhoria "Chapa nova", em cima da ilha da cozinha.
 *
 * Uma chapa de lanchonete de verdade: o corpo de inox ESCOVADO com o painel
 * dos botões inclinado na frente, a chapa de ferro grossa com a canaleta de
 * gordura, o espelho e as abas dos lados, os pés de sapata — e comida em cima:
 * hambúrguer, linguiça e a cebola dourando. As chamas azuis acesas por baixo da
 * beira são o que diz "está ligada".
 *
 * `dupla` é o segundo nível ("dois pratos de cada vez"): a chapa larga de duas
 * zonas, com a divisória no meio, dois pares de botões e comida dos dois lados.
 */
export function chapaDoWalter(dupla = false): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = dupla ? 'chapa-dupla' : 'chapa-nova';
  const L = dupla ? 1.0 : 0.62;
  const P0 = 0.46;
  const corpo = 0.11;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) por(g, sapata(), inoxEscuro(), sx * (L / 2 - 0.05), 0, sz * (P0 / 2 - 0.06)).scale.set(0.8, 0.5, 0.8);
  por(g, macia(L, corpo, P0, 0.012), inox(), 0, 0.037 + corpo / 2, 0);
  // o painel dos botões: uma rampa na frente, de inox mais escuro
  const rampa = macia(L - 0.02, 0.07, 0.05, 0.008);
  por(g, rampa, inoxEscuro(), 0, 0.075, P0 / 2 + 0.012).rotation.x = -0.5;
  const zonas = dupla ? [-L / 4, L / 4] : [0];
  for (const zx of zonas) {
    for (const dx of [-0.07, 0.07]) {
      const botao = por(g, torneado([[0.001, 0], [0.019, 0], [0.02, 0.012], [0.014, 0.022], [0.001, 0.024]], 14), carvao(), zx + dx, 0.08, P0 / 2 + 0.03);
      botao.rotation.x = Math.PI / 2 - 0.5;
    }
  }
  const topo = 0.037 + corpo;
  // a CHAPA de ferro, grossa, e a canaleta de gordura na frente
  por(g, macia(L - 0.04, 0.022, P0 - 0.1, 0.004), ferro(), 0, topo + 0.011, -0.02);
  por(g, macia(L - 0.04, 0.012, 0.04, 0.004), inoxEscuro(), 0, topo + 0.006, P0 / 2 - 0.035);
  // o espelho atrás e as abas dos lados, de inox
  por(g, macia(L, 0.09, 0.012, 0.004), inox(), 0, topo + 0.045, -P0 / 2 + 0.006);
  for (const s of [-1, 1]) por(g, macia(0.012, 0.06, P0 - 0.07, 0.004), inox(), s * (L / 2 - 0.006), topo + 0.03, -0.02);
  if (dupla) por(g, macia(0.012, 0.028, P0 - 0.1, 0.003), inox(), 0, topo + 0.035, -0.02);

  // A COMIDA: hambúrguer (torneado, com a casca mais escura em cima),
  // linguiça em gomo e a cebola em anéis
  const yComida = topo + 0.022;
  const hamburguer = torneado([[0.001, 0], [0.042, 0], [0.046, 0.008], [0.043, 0.016], [0.001, 0.017]], 16);
  for (const zx of zonas) {
    for (const [dx, dz] of [[-0.12, -0.06], [0.0, 0.03], [0.12, -0.05]] as const) {
      por(g, hamburguer, P.churrascoCarne, zx + dx * (dupla ? 0.85 : 1), yComida, dz);
    }
    const linguica = tubo([[-0.07, 0, 0], [-0.02, 0, 0.012], [0.03, 0, 0.006], [0.07, 0, -0.01]], 0.013, 12, 8);
    por(g, linguica, P.churrascoLinguica, zx + 0.02, yComida + 0.012, 0.11);
    for (const [cx, cz] of [[-0.11, 0.1], [0.12, 0.1]] as const) {
      const anel = por(g, new THREE.TorusGeometry(0.018, 0.005, 5, 12).rotateX(Math.PI / 2), P.churrascoCebola, zx + cx * (dupla ? 0.85 : 1), yComida + 0.006, cz);
      anel.scale.set(1, 1, 0.8);
    }
  }
  // AS CHAMAS por baixo da beira da chapa, acesas (glow), uma fileira por zona
  const chama = toon(P.churrascoChamaDeGas, { glow: 0.9 });
  for (const zx of zonas) {
    const largura = dupla ? L / 2 - 0.12 : L - 0.14;
    const n = Math.round(largura / 0.035);
    for (let i = 0; i < n; i++) {
      const c = por(g, new THREE.ConeGeometry(0.008, 0.022, 5), chama, zx - largura / 2 + (i + 0.5) * (largura / n), topo - 0.006, P0 / 2 - 0.004);
      c.userData.semSombra = true;
    }
  }
  return g;
}

/**
 * O CAVALETE DA FILA — a melhoria "Plaquinha de reserva", na entrada.
 *
 * A lousa de calçada que todo restaurante cheio põe na porta: dois painéis
 * de ardósia em "A", na moldura de madeira, presos em cima pela dobradiça de
 * latão, com o recado a giz virado para a câmera. É o que diz a quem chega
 * que tem lugar na fila (o quarto) e que vale a pena esperar (a paciência
 * dura mais).
 *
 * Origem no chão, no meio da base; a face escrita olha para `+Z`.
 */
export function cavaleteDaFila(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cavalete-da-fila';
  const LARG = 0.56;
  const ALT = 0.86;
  const ABRE = 0.2;
  for (const s of [1, -1] as const) {
    const painel = new THREE.Group();
    // os dois painéis se encontram no alto, e as pernas abrem embaixo
    painel.position.set(0, ALT, 0);
    // o pé da face escrita (`s = 1`) vai para a FRENTE: é ela que a câmera vê
    painel.rotation.x = -s * ABRE;
    g.add(painel);
    const face = new THREE.Group();
    face.position.set(0, -ALT / 2, s * 0.018);
    if (s < 0) face.rotation.y = Math.PI;
    painel.add(face);
    por(face, molduraDeBisel(LARG, ALT, 0.05, 0.03, 0.008), madeiraEscura(), 0, 0, -0.015);
    por(face, new THREE.BoxGeometry(LARG - 0.08, ALT - 0.08, 0.012), toon(P.churrascoQuadroNegro, { mapa: ardosia() }), 0, 0, -0.008);
    if (s > 0) {
      // linhas CURTAS: a letra de giz sai do tamanho da altura da linha, e
      // "Aguarde aqui" numa linha só estourava a largura da lousa
      const texto = escreverAGiz(['Fila', 'aguarde', 'aqui, que', 'o Walter', 'já vem!'], LARG - 0.12, ALT - 0.16);
      texto.position.set(0, 0.02, 0.0005);
      face.add(texto);
    }
  }
  // a dobradiça de latão no alto, atravessada
  por(g, new THREE.CylinderGeometry(0.012, 0.012, LARG - 0.06, 10).rotateZ(Math.PI / 2), latao(), 0, ALT - 0.005, 0);
  return g;
}

/** a frente do alto-falante: o tecido de trama e as ripas de madeira por cima */
let tecidoDoRadio: THREE.CanvasTexture | null = null;
function texturaDoRadio(): THREE.CanvasTexture {
  if (tecidoDoRadio) return tecidoDoRadio;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = hex(P.churrascoRadioTecido);
    ctx.fillRect(0, 0, 256, 256);
    // a trama: manchinhas soltas, nada de grade (ver "Textura em móvel")
    const sorte = sorteio(17);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(90,70,40,${0.05 + sorte() * 0.06})`;
      ctx.fillRect(sorte() * 256, sorte() * 256, 2 + sorte() * 2, 2);
    }
    // as ripas em pé, de madeira escura, com a sombra de um lado
    for (let x = 22; x < 256; x += 42) {
      ctx.fillStyle = 'rgba(70,40,20,0.9)';
      ctx.fillRect(x, 0, 12, 256);
      ctx.fillStyle = 'rgba(40,20,10,0.35)';
      ctx.fillRect(x + 12, 0, 4, 256);
    }
  }
  tecidoDoRadio = new THREE.CanvasTexture(canvas);
  tecidoDoRadio.colorSpace = THREE.SRGBColorSpace;
  return tecidoDoRadio;
}

/** a nota musical (colcheia), chata, olhando para `+Z`, com 1 de altura */
function geoNota(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // a cabeça inclinada, a haste e a bandeirinha
  s.absellipse(0, 0.12, 0.2, 0.14, 0, Math.PI * 2, false, -0.4);
  const cabeca = new THREE.ShapeGeometry(s, 12);
  const haste = new THREE.ShapeGeometry(new THREE.Shape([
    new THREE.Vector2(0.14, 0.14), new THREE.Vector2(0.2, 0.14), new THREE.Vector2(0.2, 1), new THREE.Vector2(0.14, 1),
  ]));
  const bandeira = new THREE.Shape();
  bandeira.moveTo(0.2, 1);
  bandeira.quadraticCurveTo(0.42, 0.85, 0.44, 0.58);
  bandeira.quadraticCurveTo(0.36, 0.76, 0.2, 0.8);
  bandeira.closePath();
  const geo = mergeGeometries([cabeca, haste, new THREE.ShapeGeometry(bandeira, 8)]);
  return geo ?? cabeca;
}

/**
 * O RÁDIO DO SALÃO — a melhoria "Rádio do salão", no balcão do bar.
 *
 * Rádio de mesa antigo, de capela: a caixa de madeira com o alto em arco
 * (forma extrudada com bisel), a frente de tecido com as ripas, o mostrador
 * aceso de âmbar com os risquinhos da sintonia, os dois botões de latão e os
 * pezinhos. E ele TOCA: as notas sobem, balançam e somem em cima dele — um
 * `InstancedMesh` só, refeito a cada quadro pelo `update`.
 *
 * A origem é o tampo onde ele pousa; a frente olha para `+Z`.
 */
export class RadioDoBar {
  readonly group = new THREE.Group();
  private readonly notas: THREE.InstancedMesh;
  private tempo = 0;
  private readonly matriz = new THREE.Matrix4();
  private readonly NOTAS = 4;

  constructor() {
    const g = this.group;
    g.userData.peca = 'radio-do-bar';
    const L = 0.34;
    const A = 0.24;
    const F = 0.13;
    // a caixa: base reta, o alto em arco
    const forma = new THREE.Shape();
    forma.moveTo(-L / 2, 0);
    forma.lineTo(L / 2, 0);
    forma.lineTo(L / 2, A - L / 2 + 0.04);
    forma.absarc(0, A - L / 2 + 0.04, L / 2, 0, Math.PI, false);
    forma.lineTo(-L / 2, 0);
    const caixa = new THREE.ExtrudeGeometry(forma, {
      depth: F - 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 2, curveSegments: 18,
    });
    caixa.translate(0, 0.018, -F / 2 + 0.01);
    por(g, caixa, madeiraEscura());
    // a frente: o arco de tecido com ripas, um pouco menor, saindo 3 mm
    const frente = new THREE.Shape();
    const r = L / 2 - 0.04;
    const yArco = A - L / 2 + 0.04;
    frente.moveTo(-r, 0.09);
    frente.lineTo(r, 0.09);
    frente.lineTo(r, yArco);
    frente.absarc(0, yArco, r, 0, Math.PI, false);
    frente.lineTo(-r, 0.09);
    const tecido = new THREE.ShapeGeometry(frente, 16);
    // o UV da forma vem em metros: leva para 0..1 na caixa da frente
    const uv = tecido.attributes.uv as THREE.BufferAttribute;
    const pos = tecido.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + r) / (2 * r), (pos.getY(i) - 0.09) / (yArco + r - 0.09));
    const pano = new THREE.Mesh(tecido, toon(0xffffff, { mapa: texturaDoRadio() }));
    pano.position.set(0, 0.018, F / 2 + 0.003);
    g.add(pano);
    // o mostrador aceso, embaixo do tecido, com o ponteiro
    por(g, macia(0.16, 0.034, 0.008, 0.003), toon(P.churrascoMostrador, { glow: 0.55 }), 0, 0.06, F / 2 + 0.004);
    por(g, new THREE.BoxGeometry(0.003, 0.03, 0.004), P.churrascoTomate, 0.025, 0.06, F / 2 + 0.009);
    for (const s of [-1, 1]) {
      const botao = por(g, torneado([[0.001, 0], [0.018, 0], [0.019, 0.01], [0.013, 0.02], [0.001, 0.021]], 14), latao(), s * 0.125, 0.06, F / 2 + 0.002);
      botao.rotation.x = Math.PI / 2;
    }
    for (const s of [-1, 1]) por(g, macia(0.05, 0.018, F - 0.02, 0.005), carvao(), s * 0.11, 0.009, 0);

    this.notas = new THREE.InstancedMesh(geoNota(), toon(P.churrascoNota, { glow: 0.35, doubleSide: true }), this.NOTAS);
    // as notas andam: a esfera envolvente é a da subida inteira
    this.notas.frustumCulled = false;
    this.notas.userData.semSombra = true;
    g.add(this.notas);
    this.update(0);
  }

  /** as notas sobem do alto do rádio, balançando, e somem lá em cima */
  update(dt: number): void {
    this.tempo += dt;
    const q = new THREE.Quaternion();
    const giro = new THREE.Euler();
    for (let i = 0; i < this.NOTAS; i++) {
      const k = (this.tempo * 0.32 + i / this.NOTAS) % 1;
      // cresce na saída, fica, e encolhe a zero no fim
      const s = 0.07 * Math.min(1, k * 6) * Math.min(1, (1 - k) * 4);
      giro.set(0, Math.PI / 4, Math.sin(this.tempo * 3 + i) * 0.35);
      q.setFromEuler(giro);
      this.matriz.compose(
        new THREE.Vector3(Math.sin(k * 7 + i * 2.1) * 0.08 + (i % 2 ? 0.05 : -0.05), 0.3 + k * 0.55, 0),
        q, new THREE.Vector3(s, s, s),
      );
      this.notas.setMatrixAt(i, this.matriz);
    }
    this.notas.instanceMatrix.needsUpdate = true;
  }
}

/**
 * O CARRINHO DE LOUÇA — a melhoria "Carrinho de louça", entre as mesas.
 *
 * O carrinho de serviço de inox: duas bandejas de borda levantada, os quatro
 * tubos, a alça de empurrar numa ponta e os rodízios de borracha com o garfo.
 * Em cima, a bacia cinza de recolher a louça (com pratos e uma caneca dentro);
 * embaixo, a pilha de pratos limpos e os guardanapos dobrados.
 *
 * Quem larga a louça nele vê a pilha crescer em cima: `userData.pilhas` são
 * os lugares (no quadro da peça) e `userData.tampo` a altura da bandeja de cima.
 */
export function carrinhoDeLouca(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'carrinho-de-louca';
  const L = 0.86;
  const P0 = 0.5;
  const RODA = 0.045;
  const Y_BAIXO = 0.24;
  const Y_CIMA = 0.8;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const x = sx * (L / 2 - 0.04);
      const z = sz * (P0 / 2 - 0.04);
      // o tubo para 3 mm ABAIXO do tampo de cima: rente a ele, a tampa do tubo
      // e o tampo brigariam pelo pixel
      const alto = Y_CIMA + 0.007 - RODA * 2;
      por(g, new THREE.CylinderGeometry(0.013, 0.013, alto, 10), inox(), x, RODA * 2 + alto / 2, z);
      // o rodízio: o garfo e a roda de borracha
      por(g, macia(0.03, 0.04, 0.05, 0.006), inoxEscuro(), x, RODA * 2 + 0.005, z);
      por(g, new THREE.CylinderGeometry(RODA, RODA, 0.022, 14).rotateZ(Math.PI / 2), carvao(), x, RODA, z);
    }
  }
  // as duas bandejas, cada uma com a borda levantada nos quatro lados
  for (const y of [Y_BAIXO, Y_CIMA]) {
    por(g, macia(L, 0.02, P0, 0.006), inox(), 0, y, 0);
    // as bordas passam 2 mm da bandeja nas pontas, e as compridas param antes
    // das curtas: nenhuma ponta rente a outra
    for (const s of [-1, 1]) {
      por(g, macia(L - 0.03, 0.04, 0.012, 0.004), inox(), 0, y + 0.025, s * (P0 / 2 - 0.004));
      por(g, macia(0.012, 0.04, P0 - 0.02, 0.004), inox(), s * (L / 2 - 0.004), y + 0.025, 0);
    }
  }
  // a alça de empurrar, na ponta da direita
  const empurrar = alca(P0 - 0.12, 0.09, 0.013).rotateY(-Math.PI / 2);
  por(g, empurrar, inox(), L / 2, Y_CIMA + 0.05, 0);

  // A BACIA de recolher, na metade da esquerda de cima: as paredes, o fundo e
  // a borda virada; dentro, três pratos inclinados e uma caneca
  const bx = -0.17;
  const BL = 0.4;
  const BP = 0.36;
  const BA = 0.13;
  const yb = Y_CIMA + 0.01;
  // o fundo é um fio mais baixo que as paredes, e as paredes curtas ficam
  // por dentro das compridas: nada de face rente a face nas quinas
  por(g, macia(BL - 0.01, 0.012, BP - 0.01, 0.004), P.churrascoBacia, bx, yb + 0.004, 0);
  for (const s of [-1, 1]) {
    por(g, macia(BL, BA, 0.012, 0.004), P.churrascoBacia, bx, yb + 0.002 + BA / 2, s * (BP / 2 - 0.006));
    por(g, macia(0.012, BA - 0.006, BP - 0.02, 0.004), P.churrascoBacia, bx + s * (BL / 2 - 0.009), yb + 0.002 + BA / 2, 0);
  }
  const prato = torneado([[0.001, 0], [0.06, 0], [0.085, 0.012], [0.1, 0.02], [0.098, 0.023], [0.08, 0.016], [0.001, 0.01]], 18);
  for (const [dx, dz, inc] of [[-0.06, -0.05, 0.5], [0.0, 0.0, 0.45], [0.06, 0.05, 0.4]] as const) {
    const p = por(g, prato, P.churrascoAzulejo, bx + dx, yb + 0.07, dz);
    p.rotation.set(inc, 0.3, 0);
  }
  por(g, torneado([[0.001, 0], [0.03, 0], [0.032, 0.06], [0.029, 0.062], [0.026, 0.008], [0.001, 0.008]], 14), P.churrascoAzulejo, bx + 0.11, yb + 0.012, -0.1);
  // embaixo: a pilha de pratos limpos e os guardanapos dobrados
  for (let i = 0; i < 9; i++) por(g, prato, P.churrascoAzulejo, -0.18, Y_BAIXO + 0.012 + i * 0.016, 0);
  for (let i = 0; i < 3; i++) por(g, macia(0.16, 0.022, 0.16, 0.008), P.churrascoToalha, 0.18, Y_BAIXO + 0.022 + i * 0.023, 0).rotation.y = i * 0.12;

  g.userData.tampo = Y_CIMA + 0.012;
  g.userData.pilhas = [[0.2, -0.1], [0.2, 0.12]];
  return g;
}

// ============================================ AS PEÇAS DOS TURNOS 3 E 4

/**
 * O VAPOR DO PRATO QUENTE — do turno 4 em diante o prato esfria, e o jogador
 * precisa VER quanto calor sobra. São quatro baforadas brancas e macias que
 * sobem do prato e somem; o motor do turno anima (`animarVapor`) e encolhe as
 * três conforme o prato esfria. Frio, não sai vapor nenhum.
 *
 * As baforadas são transparentes: ficam fora da `fundir()` sozinhas, e não
 * fazem sombra.
 */
export function vaporDePrato(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'vapor';
  // grande de propósito: é para ler no zoom do turno, do outro lado do
  // salão — com 3 cm a baforada virava um pontinho até de perto
  const bola = new THREE.IcosahedronGeometry(0.065, 1);
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Mesh(bola, flat(P.churrascoVapor, 0.55));
    b.userData.semSombra = true;
    g.add(b);
  }
  return g;
}

/**
 * Anima o vapor: cada baforada sobe 30 cm num ciclo, abrindo e sumindo, e o
 * tamanho de todas acompanha o `calor` (1 = saiu da chapa, 0 = frio).
 */
export function animarVapor(vapor: THREE.Object3D, tempo: number, calor: number): void {
  vapor.visible = calor > 0.02;
  if (!vapor.visible) return;
  vapor.children.forEach((b, i) => {
    const k = (tempo * 0.5 + i / vapor.children.length) % 1;
    b.position.set(Math.sin(k * 6 + i * 2) * 0.05, 0.12 + k * 0.5, Math.cos(k * 5 + i) * 0.03);
    b.scale.setScalar(calor * (0.6 + k * 0.9) * Math.min(1, (1 - k) * 3));
  });
}

/** o texto do cartão de reservado, a mão, com o elefantinho no canto */
let cartaoReservado: THREE.CanvasTexture | null = null;
function texturaDoReservado(): THREE.CanvasTexture {
  if (cartaoReservado) return cartaoReservado;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = hex(P.churrascoReservado);
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = hex(P.churrascoTomate);
    ctx.lineWidth = 5;
    ctx.strokeRect(9, 9, 238, 110);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = hex(P.churrascoCouro);
    ctx.font = 'bold 44px ui-rounded, "Nunito", system-ui, sans-serif';
    ctx.fillText('Reservado', 128, 52);
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('pro Cookie', 128, 92);
  }
  cartaoReservado = new THREE.CanvasTexture(canvas);
  cartaoReservado.colorSpace = THREE.SRGBColorSpace;
  cartaoReservado.anisotropy = 4;
  return cartaoReservado;
}

/**
 * A PLAQUINHA DE RESERVADO — o Cookie é grande demais para uma mesa só, e a
 * mesa do lado fica fechada enquanto ele estiver: em cima dela o garçom põe o
 * cartão dobrado em "A", "Reservado — pro Cookie", dos dois lados.
 *
 * Origem no tampo; a face escrita olha para `+Z` (e a de trás para `-Z`).
 */
export function reservadoNaMesa(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'reservado-na-mesa';
  // o dobro de um cartão de verdade: é para ler no zoom do turno, do outro
  // lado do salão (no tamanho real ele virava um quadradinho bege)
  const L = 0.5;
  const A = 0.25;
  const ABRE = 0.32;
  const papel = toon(0xffffff, { mapa: texturaDoReservado(), doubleSide: true });
  for (const s of [1, -1] as const) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(L, A), papel);
    // as duas faces se encontram no alto, e a de trás é a mesma gira de costas
    face.position.set(0, (A / 2) * Math.cos(ABRE), s * (A / 2) * Math.sin(ABRE));
    face.rotation.set(-s * ABRE, s < 0 ? Math.PI : 0, 0);
    g.add(face);
  }
  return g;
}
