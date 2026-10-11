import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { flat, toon } from '../core/materials';
import type { ItemDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { acabar } from './acabamento';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { cavetinho, contorno, type Perfil } from './molduras';
import { geoDaBota, geoDoCanoDaBota, PENDURA, pendurar, roupaSolta, sentar, tipoNaArara, Vitrine } from './roupasNaArara';
import { desenhoDeTapeteRedondo, marmore, tramaDeTecido, veioDeMadeira } from './texturasDeCasa';
import { sorteio } from './texturasDeChao';

/**
 * ===================================== OS MÓVEIS DA BOUTIQUE DA ESTELLA
 *
 * A segunda reforma da loja por dentro: chique, e CONFORTÁVEL. O pedido do
 * Renan foi esse — "não precisa ser extremamente luxuoso, mas bem organizado
 * como uma loja chique de roupa". O que faz isso na tela:
 *
 *  - PAREDE ROSA-CLARO COM BOISERIE BRANCA (`boiserie`): rodapé, friso e
 *    cornija com PERFIL de verdade, e os quadros de moldura entre eles. É a
 *    parede de loja de Paris, e é ela que tira a sala da cara de galpão;
 *  - MADEIRA, MÁRMORE, VELUDO E LATÃO, e nada de cromado: o chão é parquet,
 *    os tampos e bases são de mármore, o estofado é de veludo, e o metal é
 *    sempre latão em fio (o ouro em área grande vira bijuteria);
 *  - ORGANIZADO: roupa por cor, cabide igual, peça de frente na premium,
 *    plaquinha com o nome da seção em cima de cada arara;
 *  - LUZ QUENTE QUE SE VÊ, sem luz de verdade: globo de opalina com a poça
 *    pintada no chão, arandela com o leque na parede, o nicho aceso por
 *    dentro (`pocaDeLuz`, `haloDeLampada` — o mesmo truque do quarto do Ari).
 *
 * Toda peça nasce como o kit manda: base em `y = 0`, frente em `+Z`, e a
 * etiqueta `userData.peca` (a das peças antigas, quando substituem uma — o
 * `scripts/lojinha.mjs` conta por ela). A cena passa cada uma por `fundir()`:
 * os pedaços de mesmo material viram uma malha só, e a roupa já nasce em
 * `InstancedMesh` (`world/roupasNaArara.ts`).
 *
 * Técnica (as skills de three no jogo de verdade): `ExtrudeGeometry` de forma
 * com furo (o arco do provador e o nicho da estante), `LatheGeometry`
 * (pufe capitonê com as covinhas empurradas vértice a vértice, globo, vaso
 * canelado, busto de costura), `TubeGeometry` (o latão das araras, a fita
 * métrica), `InstancedMesh` (roupa, folha, flor, livro de sapato) e
 * `<canvas>` (mármore, veludo, a plaquinha da seção).
 */

// ================================================================ base

/** caixa de quina arredondada: o tijolo de tudo que a mão encosta */
function macia(l: number, a: number, p: number, raio = 0.02): THREE.BufferGeometry {
  return new RoundedBoxGeometry(l, a, p, 2, Math.min(raio, l / 2 - 0.001, a / 2 - 0.001, p / 2 - 0.001));
}

/** uma malha posta no pai, na posição dada */
function por(
  pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material | number,
  x = 0, y = 0, z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, typeof mat === 'number' ? toon(mat) : mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

/** perfil torneado (`[raio, altura]`) */
function torneado(perfil: ReadonlyArray<readonly [number, number]>, gomos = 24): THREE.LatheGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), gomos);
}

/** um tubo pelos pontos (curva suave) */
function tubo(pontos: ReadonlyArray<readonly [number, number, number]>, raio: number, segs = 24, radial = 8): THREE.TubeGeometry {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pontos.map(([x, y, z]) => new THREE.Vector3(x, y, z))),
    segs, raio, radial, false,
  );
}

/**
 * Um caminho de RETAS COM QUINA ARREDONDADA (o latão dobrado da arara): cada
 * quina vira uma curva de raio `r`. Os pontos estão no plano XY.
 */
function dobrado(pontos: ReadonlyArray<readonly [number, number]>, r: number, z = 0): THREE.CurvePath<THREE.Vector3> {
  const caminho = new THREE.CurvePath<THREE.Vector3>();
  const v = pontos.map(([x, y]) => new THREE.Vector3(x, y, z));
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

/** escreve num canvas e devolve a textura (plaquinha, número, cartaz) */
const placas = new Map<string, THREE.CanvasTexture>();
function texturaDePlaca(
  chave: string, w: number, h: number, pintar: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const pronta = placas.get(chave);
  if (pronta) return pronta;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) pintar(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  placas.set(chave, tex);
  return tex;
}

const hex = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
/** a letra das plaquinhas: serifada, elegante, sem depender de fonte baixada */
const serifa = (px: number, italico = false): string =>
  `${italico ? 'italic ' : ''}600 ${Math.round(px)}px "Didot", "Bodoni MT", Georgia, "Times New Roman", serif`;

/**
 * A PLAQUINHA DA SEÇÃO, em cima da arara: cartão creme, filete de latão e o
 * nome em serifa vinho. É o que deixa a loja ORGANIZADA à primeira vista — a
 * dupla acha a camisaria sem precisar abrir arara por arara.
 */
function plaquinhaDaSecao(titulo: string, largura: number, altura: number): THREE.Group {
  const tex = texturaDePlaca(`secao:${titulo}`, 512, Math.round((512 * altura) / largura), (ctx, w, h) => {
    ctx.fillStyle = '#fbf7f0';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = hex(P.boutiqueOuro);
    ctx.lineWidth = h * 0.06;
    ctx.strokeRect(h * 0.1, h * 0.1, w - h * 0.2, h - h * 0.2);
    ctx.fillStyle = hex(P.boutiqueVinho);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let px = h * 0.52;
    ctx.font = serifa(px, true);
    while (px > 10 && ctx.measureText(titulo).width > w * 0.84) {
      px -= 2;
      ctx.font = serifa(px, true);
    }
    ctx.fillText(titulo, w / 2, h * 0.54);
  });
  /*
   * DUAS FACES, de costas uma para a outra, e não um plano de dois lados: o
   * plano `DoubleSide` mostra o verso ESPELHADO, e a arara é vista dos dois
   * lados — de um deles a seção sairia escrita ao contrário.
   */
  const g = new THREE.Group();
  const mat = toon(0xffffff, { mapa: tex });
  for (const lado of [1, -1] as const) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), mat);
    face.position.z = lado * 0.003;
    face.rotation.y = lado > 0 ? 0 : Math.PI;
    g.add(face);
  }
  // o cartão por trás das duas faces (a espessura do papel, de latão na borda)
  g.add(new THREE.Mesh(new THREE.BoxGeometry(largura - 0.004, altura - 0.004, 0.005), toon(P.boutiqueOuroEscuro)));
  return g;
}

// ============================================================== boiserie

/**
 * Um FRISO RETO com perfil: o perfil (`[saída, altura]`, de baixo para cima,
 * a massa do lado da parede) corre ao longo de X, com a parede em `z = 0` e
 * a saída para `+Z`.
 *
 * A QUINA É EM MEIA-ESQUADRIA: na ponta marcada, cada ponto do perfil recua
 * o quanto ele sai da parede, e a ponta vira o plano diagonal do canto. Dois
 * frisos que se encontram num canto de dentro se tocam exatamente nessa
 * diagonal — sem sobrar ponta e sem as tampas de cima no mesmo plano (que é
 * a briga de z-fighting de friso de caixa colado no canto).
 */
function frisoReto(perfil: Perfil, comprimento: number, mitraEsq = false, mitraDir = false): THREE.BufferGeometry {
  const forma = new THREE.Shape();
  const [o0, y0] = perfil[0];
  forma.moveTo(0, y0);
  if (o0 !== 0) forma.lineTo(o0, y0);
  for (const [o, y] of perfil.slice(1)) forma.lineTo(o, y);
  const [oN, yN] = perfil[perfil.length - 1];
  if (oN !== 0) forma.lineTo(0, yN);
  forma.closePath();
  const geo = new THREE.ExtrudeGeometry(forma, { depth: comprimento, bevelEnabled: false, curveSegments: 4 });
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const s = pos.getX(i);
    const z = pos.getZ(i);
    // z = 0 vira a ponta da DIREITA depois do giro; z = comprimento, a da esquerda
    if (mitraDir && z < 1e-6) pos.setZ(i, z + s);
    if (mitraEsq && z > comprimento - 1e-6) pos.setZ(i, z - s);
  }
  geo.deleteAttribute('normal');
  geo.rotateY(-Math.PI / 2);
  geo.translate(comprimento / 2, 0, 0);
  geo.computeVertexNormals();
  return geo;
}

const PERFIL_RODAPE: Perfil = [
  [0, 0], [0.024, 0], [0.024, 0.115], [0.016, 0.126], [0.019, 0.14], [0.008, 0.155], [0, 0.16],
];
const PERFIL_FRISO: Perfil = [
  [0, 0], [0.008, 0.004], [0.02, 0.016], [0.026, 0.03], [0.02, 0.044], [0.008, 0.056], [0, 0.06],
];
const PERFIL_CORNIJA: Perfil = [
  [0, 0], [0.018, 0.006], [0.024, 0.03],
  ...cavetinho([0.024, 0.03], [0.1, 0.15], 5),
  [0.11, 0.156], [0.11, 0.19], [0.122, 0.2], [0.122, 0.22], [0, 0.22],
];
/**
 * O perfil do QUADRO DE MOLDURA (o filete da boiserie), dado de fora para
 * dentro por cima: é o sentido em que o `contorno()` acerta as normais com o
 * vão (o painel) DENTRO do retângulo.
 */
const PERFIL_QUADRO: Perfil = [
  [0.046, 0], [0.046, 0.006], [0.037, 0.014], [0.023, 0.017], [0.011, 0.013], [0.003, 0.006], [0, 0],
];

/** o quadro de moldura de um painel de parede: o vão de `larg × alt`, em pé no plano XY */
function quadroDeMoldura(larg: number, alt: number): THREE.BufferGeometry {
  const geo = contorno(PERFIL_QUADRO, larg / 2, alt / 2);
  // o contorno nasce deitado (o perfil sobe em Y): de pé, o Y dele vira o Z
  geo.rotateX(Math.PI / 2);
  return geo;
}

export interface BoiserieOpts {
  /** a ponta da esquerda / da direita encontra outra parede num canto de dentro */
  mitraEsq?: boolean;
  mitraDir?: boolean;
  /** onde NÃO há quadro de moldura (atrás de um móvel alto), em X local */
  semQuadro?: ReadonlyArray<readonly [number, number]>;
}

/**
 * A BOISERIE de UMA parede: rodapé, friso na altura da cintura (0,92),
 * cornija no alto, e os quadros de moldura — baixos entre o rodapé e o friso,
 * altos entre o friso e a cornija, um par por vão de ~1,25 m.
 *
 * Ela corre ao longo de X, centrada, com a parede em `z = 0` (a face de
 * dentro) e o relevo para `+Z`. A cor é o branco da esquadria: na parede
 * rosa-claro, é o relevo branco que desenha a boiserie — e o degrau de luz do
 * toon em cada inclinação do perfil.
 */
export function boiserie(comprimento: number, altura: number, opts: BoiserieOpts = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'boiserie';
  const branco = toon(P.lojaEsquadria);
  const { mitraEsq = false, mitraDir = false } = opts;
  por(g, frisoReto(PERFIL_RODAPE, comprimento, mitraEsq, mitraDir), branco);
  por(g, frisoReto(PERFIL_FRISO, comprimento, mitraEsq, mitraDir), branco, 0, 0.92);
  por(g, frisoReto(PERFIL_CORNIJA, comprimento, mitraEsq, mitraDir), branco, 0, altura - 0.22);

  const vaos = Math.max(1, Math.round(comprimento / 1.25));
  const passo = comprimento / vaos;
  const altoDeCima = altura - 0.22 - 0.2 - 1.12;
  for (let i = 0; i < vaos; i++) {
    const cx = -comprimento / 2 + passo * (i + 0.5);
    const tapado = opts.semQuadro?.some(([a, b]) => cx > a && cx < b);
    if (tapado) continue;
    const larg = passo - 0.36;
    por(g, quadroDeMoldura(larg, 0.46), branco, cx, 0.54, 0);
    if (altoDeCima > 0.3) por(g, quadroDeMoldura(larg, altoDeCima), branco, cx, 1.12 + altoDeCima / 2, 0);
  }
  return g;
}

// ================================================================== luz

/**
 * O LUSTRE DE GLOBOS, para cima da mesa do meio: um aro de latão com seis
 * braços curvos, cada um com um globinho de opalina, e um sétimo embaixo.
 * É a peça que diz "boutique" do outro lado da sala.
 *
 * Os globos brilham por `glow` (não iluminam nada), e a luz que eles "jogam"
 * é a POÇA pintada no chão embaixo e o halo em volta — o mesmo truque do
 * abajur do quarto do Ari. Base em `y = 0` (o chão, onde fica a poça); o teto
 * é `teto`.
 *
 * GLOBO SOLTO, PENDURADO NUM FIO, NÃO SERVE AQUI: sem teto na tela (a
 * câmera vê a sala de cima), a bolinha acesa a 2,3 m de altura cai, na
 * projeção, dois metros atrás do móvel que ela ilumina — os globos do caixa
 * da primeira versão apareciam boiando na frente da escada rolante. O lustre
 * passa porque é grande e tem braços: lê como lustre de qualquer ângulo.
 */
export function lustreDeGlobos(alturaDoAro = 2.45, teto = 3.2, raioDaPoca = 1.7): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lustre';
  const latao = toon(P.boutiqueOuro);
  const opalina = toon(P.boutiqueLuz, { glow: 0.85 });
  por(g, torneado([[0.001, 0], [0.09, 0], [0.095, -0.02], [0.05, -0.045], [0.001, -0.045]], 20), latao, 0, teto);
  const haste = teto - 0.045 - alturaDoAro;
  por(g, new THREE.CylinderGeometry(0.012, 0.012, haste, 6), latao, 0, alturaDoAro + haste / 2);
  por(g, torneado([[0.001, 0.06], [0.05, 0.05], [0.07, 0.0], [0.05, -0.06], [0.001, -0.07]], 20), latao, 0, alturaDoAro);
  const aro = new THREE.TorusGeometry(0.36, 0.012, 6, 40);
  aro.rotateX(Math.PI / 2);
  por(g, aro, latao, 0, alturaDoAro);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const sobe = i % 2 === 0 ? 0.12 : -0.04;
    por(g, tubo([[c * 0.05, 0, s * 0.05], [c * 0.3, 0.02, s * 0.3], [c * 0.5, sobe - 0.02, s * 0.5], [c * 0.56, sobe + 0.04, s * 0.56]], 0.01, 12, 6), latao, 0, alturaDoAro);
    por(g, torneado([[0.001, 0.035], [0.03, 0.03], [0.035, 0.0], [0.001, 0.0]], 12), latao, c * 0.56, alturaDoAro + sobe + 0.04, s * 0.56);
    por(g, new THREE.SphereGeometry(0.085, 14, 10), opalina, c * 0.56, alturaDoAro + sobe + 0.12, s * 0.56);
  }
  por(g, new THREE.SphereGeometry(0.11, 16, 12), opalina, 0, alturaDoAro - 0.17);
  const halo = haloDeLampada(1.9, P.boutiqueLuz, 0.4);
  halo.position.y = alturaDoAro;
  g.add(halo);
  const poca = pocaDeLuz(raioDaPoca, P.luzDeAbajur, 0.28);
  poca.position.y = 0.025;
  g.add(poca);
  return g;
}

/**
 * A ARANDELA: espelho de latão na parede, braço curvo, e a cúpula de tecido
 * acesa. Na parede, o LEQUE de luz pintado por cima e por baixo da cúpula —
 * é ele que faz a parede parecer iluminada por ela.
 *
 * A origem é o ponto da parede onde ela é chumbada (a cena põe na altura);
 * a parede é `z = 0` e a luminária sai para `+Z`.
 */
export function arandelaDeBoutique(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arandela';
  const latao = toon(P.boutiqueOuro);
  const espelho = torneado([[0.001, 0.022], [0.05, 0.02], [0.06, 0.0], [0.001, 0.0]], 18);
  espelho.rotateX(Math.PI / 2);
  por(g, espelho, latao);
  por(g, tubo([[0, 0, 0.015], [0, 0.02, 0.1], [0, 0.09, 0.17], [0, 0.13, 0.18]], 0.01, 12, 6), latao);
  const cupula = torneado([[0.105, -0.07], [0.11, -0.065], [0.082, 0.07], [0.078, 0.075]], 24);
  const c = por(g, cupula, toon(P.cupula, { glow: 0.5, doubleSide: true }), 0, 0.2, 0.18);
  c.name = 'cupula';
  for (const [y, r] of [[0.2 - 0.068, 0.108], [0.2 + 0.072, 0.08]] as const) {
    const aro = new THREE.TorusGeometry(r, 0.006, 5, 24);
    aro.rotateX(Math.PI / 2);
    por(g, aro, latao, 0, y, 0.18);
  }
  const halo = haloDeLampada(0.55, P.luzDeAbajur, 0.45);
  halo.position.set(0, 0.2, 0.18);
  g.add(halo);
  for (const [y, raio] of [[0.42, 0.42], [-0.12, 0.3]] as const) {
    const leque = pocaDeLuz(raio, P.luzDeAbajur, 0.3, true);
    leque.position.set(0, y, 0.004);
    g.add(leque);
  }
  return g;
}

// ===================================================== chão e vitrine

/**
 * O TAPETE REDONDO, com o desenho inteiro pintado (`desenhoDeTapeteRedondo`):
 * barra com bolinhas, filete e medalhão. 1,4 cm de altura — a dupla pisa nele.
 */
export function tapeteRedondo(raio = 2.2, cor: number = P.boutiqueRosaAntigo): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'tapete-redondo';
  const geo = new THREE.CylinderGeometry(raio, raio, 0.014, 72);
  geo.translate(0, 0.007, 0);
  por(g, geo, toon(cor, { mapa: desenhoDeTapeteRedondo() }));
  return g;
}

/**
 * O PÓDIO dos bustos: um disco de mármore de borda boleada, com um friso de
 * latão embutido na volta.
 */
export function podio(raio = 1.0, alto = 0.12): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'podio';
  por(g, torneado([
    [0.001, alto], [raio - 0.035, alto], [raio - 0.01, alto - 0.01], [raio, alto - 0.035],
    [raio, 0.02], [raio - 0.012, 0], [0.001, 0],
  ], 48), P.boutiqueMarmore);
  const friso = new THREE.TorusGeometry(raio, 0.008, 6, 48);
  friso.rotateX(Math.PI / 2);
  por(g, friso, P.boutiqueOuro, 0, alto * 0.45);
  return acabar(g, [[P.boutiqueMarmore, marmore()]]);
}

/**
 * A FIGUEIRA-LIRA no cachepô canelado: o vaso torneado com vinte gomos (a
 * canelura é o raio ondulando em volta), o tronco fino que sobe torto, e as
 * folhas de violino — largas na ponta, cinturadas no meio, dobradas na
 * nervura — num `InstancedMesh` com cor por folha.
 */
export function figueiraLira(escala = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'figueira';
  const s = escala;
  const vaso = torneado([
    [0.001, 0], [0.15, 0], [0.18, 0.04], [0.2, 0.2], [0.21, 0.38], [0.225, 0.4], [0.225, 0.43],
    [0.205, 0.43], [0.195, 0.41], [0.001, 0.41],
  ].map(([r, y]) => [r * s, y * s] as const), 40);
  canelar(vaso, 20, 0.008 * s, 0.03 * s, 0.39 * s);
  por(g, vaso, P.lojaEsquadria);
  const terra = new THREE.CircleGeometry(0.192 * s, 24);
  terra.rotateX(-Math.PI / 2);
  por(g, terra, P.terraDeVaso, 0, 0.415 * s);
  const caule: Array<[number, number, number]> = [
    [0, 0.4, 0], [0.03, 0.8, 0.02], [-0.02, 1.15, -0.01], [0.02, 1.45, 0.01], [0.0, 1.72, 0.0],
  ];
  por(g, tubo(caule.map(([x, y, z]) => [x * s, y * s, z * s] as const), 0.022 * s, 20, 6), P.woodDark);

  const N = 26;
  const folhas = new THREE.InstancedMesh(folhaDeViolino(), toon(0xffffff, { doubleSide: true }), N);
  const rnd = sorteio(4040);
  const cores = [P.leafDark, P.leafMid, P.leafDark, P.leafLight];
  const m = new THREE.Matrix4();
  const curva = new THREE.CatmullRomCurve3(caule.map(([x, y, z]) => new THREE.Vector3(x * s, y * s, z * s)));
  for (let i = 0; i < N; i++) {
    // as folhas nascem da metade de cima do tronco para o alto, em espiral
    const t = 0.32 + (i / N) * 0.68;
    const p = curva.getPoint(t);
    const a = i * 2.4 + rnd() * 0.5;
    const tomba = 0.5 + rnd() * 0.55 - t * 0.25;
    const q = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(0, Math.PI / 2 - a, 0))
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tomba));
    const tam = (0.26 + rnd() * 0.1) * s * (1.1 - t * 0.3);
    m.compose(p, q, new THREE.Vector3(tam, tam, tam));
    folhas.setMatrixAt(i, m);
    folhas.setColorAt(i, new THREE.Color(cores[i % cores.length]));
  }
  folhas.instanceMatrix.needsUpdate = true;
  if (folhas.instanceColor) folhas.instanceColor.needsUpdate = true;
  folhas.castShadow = true;
  g.add(folhas);
  return g;
}

/** a folha de violino: 1 m, cabinho na origem, ponta em +Y, olhando +Z */
let violino: THREE.BufferGeometry | null = null;
function folhaDeViolino(): THREE.BufferGeometry {
  if (violino) return violino;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-0.2, 0.05, -0.28, 0.25, -0.22, 0.45);
  s.bezierCurveTo(-0.17, 0.58, -0.36, 0.72, -0.32, 0.9);
  s.bezierCurveTo(-0.28, 1.05, -0.1, 1.08, 0, 1.0);
  s.bezierCurveTo(0.1, 1.08, 0.28, 1.05, 0.32, 0.9);
  s.bezierCurveTo(0.36, 0.72, 0.17, 0.58, 0.22, 0.45);
  s.bezierCurveTo(0.28, 0.25, 0.2, 0.05, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 6);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // dobrada na nervura, e a ponta caindo para fora
    pos.setZ(i, Math.abs(x) * 0.3 + 0.12 * y * y);
  }
  geo.computeVertexNormals();
  violino = geo;
  return geo;
}

/**
 * Canelura de vaso: entre as alturas `de` e `ate`, o raio ondula com o
 * ângulo (`gomos` ondas). O fundo e a boca ficam lisos.
 */
function canelar(geo: THREE.BufferGeometry, gomos: number, fundo: number, de: number, ate: number): void {
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < de || y > ate) continue;
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 1e-4) continue;
    const a = Math.atan2(z, x);
    const k = (r - fundo * (0.5 - 0.5 * Math.cos(a * gomos))) / r;
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  geo.computeVertexNormals();
}

/**
 * UM VASINHO DE FLORES (balcão, mesa): vaso de cerâmica torneado e um buquê
 * de peônias — bolas de pétala num `InstancedMesh` — com folhas.
 */
export function vasoDeFlores(cor: number = P.lojaEsquadria, flor: number = P.boutiqueRosaAntigo): THREE.Group {
  const g = new THREE.Group();
  por(g, torneado([[0.001, 0], [0.05, 0], [0.075, 0.06], [0.07, 0.13], [0.045, 0.17], [0.05, 0.19], [0.042, 0.19], [0.001, 0.17]], 24), cor);
  const rnd = sorteio(321);
  const N = 7;
  const flores = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), toon(0xffffff), N);
  const folhas = new THREE.InstancedMesh(folhaDeViolino(), toon(P.leafMid, { doubleSide: true }), 6);
  const m = new THREE.Matrix4();
  const tons = [flor, P.boutiqueRosaClaro, flor, P.lojaEsquadria];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = i === 0 ? 0 : 0.06 + rnd() * 0.02;
    const t = 0.045 + rnd() * 0.012;
    m.compose(new THREE.Vector3(Math.cos(a) * r, 0.24 + (i === 0 ? 0.04 : rnd() * 0.03), Math.sin(a) * r),
      new THREE.Quaternion(), new THREE.Vector3(t, t * 0.8, t));
    flores.setMatrixAt(i, m);
    flores.setColorAt(i, new THREE.Color(tons[i % tons.length]));
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2 - a, 0))
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 1.1));
    m.compose(new THREE.Vector3(Math.cos(a) * 0.04, 0.19, Math.sin(a) * 0.04), q, new THREE.Vector3(0.11, 0.11, 0.11));
    folhas.setMatrixAt(i, m);
  }
  for (const im of [flores, folhas]) {
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    g.add(im);
  }
  return g;
}

// ================================================================ araras

/** a fila do catálogo que a arara vende (o `AraraDaLoja` de `world/itens.ts`) */
export interface FilaDaArara {
  readonly titulo: string;
  readonly pecas: readonly ItemDef[];
}

/** a altura da barra das araras de baixo */
const BARRA = 1.62;

/**
 * ============================================ A ARARA DA BOUTIQUE (térreo)
 *
 * Latão dobrado em U invertido, de quina redonda, plantado num PLINTO DE
 * MÁRMORE com quatro botões de latão por pé, e a plaquinha da seção em cima.
 * Ela pendura as peças do catálogo da fila, ORGANIZADAS: cada peça repetida
 * em três tamanhos, uma cor depois da outra (a fila de cor em degradê é o
 * que separa boutique de bazar), todas no mesmo cabide de madeira, de lado.
 *
 * A fila que não pendura (gorro, bota, pulseira, cartela) ganha DUAS
 * PRATELEIRAS de carvalho entre os montantes: a bota embaixo, o resto no
 * meio — e na barra o que pendura de frente (a luva no cabide de presilha).
 *
 * `userData.roupas` é quantas peças do catálogo estão à mostra: é o que o
 * `scripts/lojinha.mjs` conta (a roupa agora é instância, e não há mais um
 * grupo por cabide para contar).
 */
export function araraDaBoutique(fila: FilaDaArara, comprimento = 1.7): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arara-de-roupas';
  const L = comprimento;
  const latao = toon(P.boutiqueOuro);
  const rnd = sorteio(fila.titulo.length * 977 + 13);

  // o plinto de mármore sobre quatro botões de latão
  por(g, macia(L + 0.14, 0.05, 0.5, 0.018), P.boutiqueMarmore, 0, 0.047, 0);
  for (const sx of [-1, 1] as const) {
    for (const sz of [-1, 1] as const) {
      por(g, new THREE.CylinderGeometry(0.024, 0.028, 0.024, 12), latao, sx * (L / 2 + 0.01), 0.012, sz * 0.19);
    }
    // o colarinho onde o tubo entra no mármore
    por(g, new THREE.CylinderGeometry(0.03, 0.036, 0.035, 14), latao, sx * (L / 2), 0.09, 0);
  }
  // o latão dobrado: sobe, faz a quina, corre (a barra), e desce
  const r = 0.13;
  por(g, new THREE.TubeGeometry(dobrado([[-L / 2, 0.07], [-L / 2, BARRA], [L / 2, BARRA], [L / 2, 0.07]], r), 96, 0.017, 8, false), latao);

  // a plaquinha da seção, presa à barra por duas hastes
  const placa = plaquinhaDaSecao(fila.titulo, 0.52, 0.13);
  placa.position.set(0, BARRA + 0.135, 0);
  g.add(placa);
  for (const sx of [-1, 1] as const) {
    por(g, new THREE.CylinderGeometry(0.006, 0.006, 0.07, 6), latao, sx * 0.2, BARRA + 0.04, 0);
  }
  // o filete de latão em volta da plaquinha (ela é papel; o filete dá a moldura)
  const filete = dobrado([[-0.27, BARRA + 0.065], [-0.27, BARRA + 0.205], [0.27, BARRA + 0.205], [0.27, BARRA + 0.065], [-0.27, BARRA + 0.065]], 0.02);
  por(g, new THREE.TubeGeometry(filete, 40, 0.006, 5, false), latao);

  const v = new Vitrine();
  const penduradas = fila.pecas.filter((p) => PENDURA.has(tipoNaArara(p)));
  const sentadas = fila.pecas.filter((p) => !PENDURA.has(tipoNaArara(p)));
  const vao = L - 2 * r - 0.08;

  if (penduradas.length >= 3) {
    // de lado, três de cada, em blocos de cor
    const porPeca = Math.max(1, Math.floor(vao / 0.112 / penduradas.length));
    const total = porPeca * penduradas.length;
    const passo = vao / total;
    let k = 0;
    for (const item of penduradas) {
      for (let c = 0; c < porPeca; c++, k++) {
        const x = -vao / 2 + passo * (k + 0.5);
        pendurar(v, item, x, BARRA, 0, true, (rnd() - 0.5) * 0.09);
      }
    }
  } else if (penduradas.length) {
    // pouca coisa pendurada: de frente, bem espaçada (a luva)
    const copias = Math.max(1, Math.floor(vao / 0.3 / penduradas.length));
    const lista = penduradas.flatMap((p) => Array.from({ length: copias }, () => p));
    lista.forEach((item, i) => {
      const x = -vao / 2 + (vao / lista.length) * (i + 0.5);
      pendurar(v, item, x, BARRA, 0, false, (rnd() - 0.5) * 0.12);
    });
  }

  if (sentadas.length) {
    const carvalho = toon(P.boutiqueCarvalho);
    for (const y of [0.34, 0.98]) por(g, macia(L, 0.03, 0.4, 0.008), carvalho, 0, y, 0);
    // a bota embaixo, dois pares de cada; o resto no meio, um de cada
    const botas = sentadas.filter((p) => tipoNaArara(p) === 'bota').flatMap((p) => [p, p]);
    botas.forEach((item, i) => {
      const x = -(L - 0.24) / 2 + ((L - 0.24) / botas.length) * (i + 0.5);
      sentar(v, item, x, 0.355, 0.02, (rnd() - 0.5) * 0.2);
    });
    const meio = sentadas.filter((p) => tipoNaArara(p) !== 'bota');
    meio.forEach((item, i) => {
      const x = -(L - 0.2) / 2 + ((L - 0.2) / meio.length) * (i + 0.5);
      if (tipoNaArara(item) === 'pulseira') {
        // o suporte de pulseira: pé redondo, haste e o braço onde elas ficam enfiadas
        por(g, new THREE.CylinderGeometry(0.05, 0.055, 0.012, 16), latao, x, 1.0, -0.07);
        por(g, new THREE.CylinderGeometry(0.006, 0.006, 0.11, 6), latao, x, 1.06, -0.07);
        const braco = new THREE.CylinderGeometry(0.006, 0.006, 0.14, 6);
        braco.rotateX(Math.PI / 2);
        por(g, braco, latao, x, 1.07, 0.0);
        for (const dz of [-0.035, 0.0, 0.035]) sentar(v, item, x, 0.995, dz);
      } else {
        sentar(v, item, x, 0.995, 0.03, (rnd() - 0.5) * 0.3);
      }
    });
  }
  v.montar(g);
  g.userData.roupas = v.pecas;
  return acabar(g, [[P.boutiqueMarmore, marmore()], [P.boutiqueCarvalho, veioDeMadeira()]]);
}

/**
 * O ARCO DE LATÃO (ou de prata) da arara premium: os montantes sobem até a
 * barra e se fecham num meio-círculo em cima — o pórtico de vitrine. A
 * curva é de duas cúbicas (a aproximação de quarto de círculo), e o caminho
 * inteiro é UM tubo.
 */
function arcoDaPremium(L: number, mola: number): THREE.CurvePath<THREE.Vector3> {
  const R = L / 2;
  const k = 0.5523 * R;
  const c = new THREE.CurvePath<THREE.Vector3>();
  const v = (x: number, y: number): THREE.Vector3 => new THREE.Vector3(x, y, 0);
  c.add(new THREE.LineCurve3(v(-R, 0.09), v(-R, mola)));
  c.add(new THREE.CubicBezierCurve3(v(-R, mola), v(-R, mola + k), v(-k, mola + R), v(0, mola + R)));
  c.add(new THREE.CubicBezierCurve3(v(0, mola + R), v(k, mola + R), v(R, mola + k), v(R, mola)));
  c.add(new THREE.LineCurve3(v(R, mola), v(R, 0.09)));
  return c;
}

/**
 * ======================================= A ARARA PREMIUM (o mezanino)
 *
 * A mesma ideia da de baixo, com o que separa a peça cara numa loja de
 * verdade:
 *
 * 1. **POUCA PEÇA, DE FRENTE.** Arara lotada lê como liquidação; duas peças
 *    de frente, com espaço, leem como coleção. Aqui cada peça aparece uma vez
 *    só — "estes dois eu não vendo pra qualquer um".
 * 2. **O ARCO.** Os montantes viram um pórtico em meio-círculo, com um
 *    pinhão no alto.
 * 3. **PÉ DE MÁRMORE**, e não rodízio: ela não anda.
 *
 * O que não pendura tem lugar próprio dentro do arco: o gorro (a boina) num
 * CHAPELEIRO de latão, a bota num PEDESTAL de mármore. E a arara que só tem
 * bota leva uma CAPA DE ROUPA de veludo na barra — é como a peça de gala
 * espera a cliente.
 */
export function araraPremiumDaBoutique(fila: FilaDaArara, opts: { prata?: boolean; comprimento?: number } = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'arara-premium';
  const L = opts.comprimento ?? 1.4;
  const metal = toon(opts.prata ? P.boutiquePrata : P.boutiqueOuro);
  const mola = 1.72;

  for (const sx of [-1, 1] as const) {
    por(g, macia(0.3, 0.09, 0.42, 0.02), P.boutiqueMarmore, sx * L / 2, 0.045, 0);
    por(g, new THREE.CylinderGeometry(0.034, 0.042, 0.04, 14), metal, sx * L / 2, 0.11, 0);
  }
  por(g, new THREE.TubeGeometry(arcoDaPremium(L, mola), 110, 0.02, 8, false), metal);
  const barra = new THREE.CylinderGeometry(0.017, 0.017, L, 10);
  barra.rotateZ(Math.PI / 2);
  por(g, barra, metal, 0, BARRA, 0);
  // o pinhão no alto do arco
  por(g, torneado([[0.001, 0.0], [0.028, 0.01], [0.034, 0.04], [0.02, 0.075], [0.006, 0.1], [0.001, 0.11]], 16), metal, 0, mola + L / 2 + 0.01);

  const v = new Vitrine();
  const penduradas = fila.pecas.filter((p) => PENDURA.has(tipoNaArara(p)));
  const sentadas = fila.pecas.filter((p) => !PENDURA.has(tipoNaArara(p)));
  const gorros = sentadas.filter((p) => tipoNaArara(p) === 'gorro');
  const botas = sentadas.filter((p) => tipoNaArara(p) === 'bota');

  // as que penduram, de frente; se divide o arco com um chapeleiro, vão para a esquerda
  const espaco = gorros.length ? L * 0.55 : L - 0.3;
  const x0 = gorros.length ? -L / 2 + 0.12 : -espaco / 2;
  penduradas.forEach((item, i) => {
    const x = x0 + (espaco / penduradas.length) * (i + 0.5);
    pendurar(v, item, x, BARRA, 0, false, 0);
  });

  gorros.forEach((item, i) => {
    // o chapeleiro: pé redondo, haste, e a cabecinha onde a boina senta
    const x = L / 2 - 0.3 - i * 0.3;
    por(g, torneado([[0.001, 0.025], [0.1, 0.02], [0.12, 0.0], [0.001, 0.0]], 20), metal, x, 0, 0.05);
    por(g, new THREE.CylinderGeometry(0.01, 0.012, 1.18, 8), metal, x, 0.6, 0.05);
    por(g, torneado([[0.001, 0.12], [0.06, 0.1], [0.085, 0.05], [0.085, 0.0], [0.001, 0.0]], 20), P.boutiqueMarmore, x, 1.18, 0.05);
    sentar(v, item, x, 1.24, 0.05);
  });

  if (botas.length) {
    // o pedestal de mármore com o par em cima
    por(g, macia(0.42, 0.26, 0.36, 0.02), P.boutiqueMarmore, 0, 0.13, 0.04);
    botas.forEach((item, i) => sentar(v, item, (i - (botas.length - 1) / 2) * 0.3, 0.26, 0.05, -0.15));
    if (!penduradas.length) {
      // a capa de roupa de veludo, com o zíper dourado
      const capa = new THREE.Shape();
      capa.moveTo(-0.07, -0.04);
      capa.lineTo(0.07, -0.04);
      capa.quadraticCurveTo(0.27, -0.07, 0.27, -0.2);
      capa.lineTo(0.27, -0.92);
      capa.quadraticCurveTo(0.27, -1.0, 0.19, -1.0);
      capa.lineTo(-0.19, -1.0);
      capa.quadraticCurveTo(-0.27, -1.0, -0.27, -0.92);
      capa.lineTo(-0.27, -0.2);
      capa.quadraticCurveTo(-0.27, -0.07, -0.07, -0.04);
      const geo = new THREE.ExtrudeGeometry(capa, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.016, bevelSegments: 2, curveSegments: 6 });
      geo.translate(0, 0, -0.025);
      por(g, geo, P.boutiqueVinho, 0, BARRA, 0);
      por(g, new THREE.BoxGeometry(0.014, 0.82, 0.104), P.boutiqueOuro, 0.0, BARRA - 0.55, 0);
      por(g, macia(0.07, 0.05, 0.11, 0.01), P.boutiqueOuro, 0.0, BARRA - 0.15, 0);
      const ganchoDaCapa = tubo([[0, -0.05, 0], [0, -0.02, 0], [-0.024, 0.01, 0], [0, 0.03, 0], [0.024, 0.01, 0]], 0.005, 12, 5);
      ganchoDaCapa.rotateY(Math.PI / 2);
      por(g, ganchoDaCapa, metal, 0, BARRA, 0);
    }
  }
  v.montar(g);
  g.userData.roupas = v.pecas;
  return acabar(g, [[P.boutiqueMarmore, marmore()], [P.boutiqueVinho, tramaDeTecido()]]);
}

// ============================================================ provadores

/**
 * A GUARNIÇÃO DE ARCO: o U de moldura em volta de um vão de porta em arco,
 * do chão (`y0`) até a mola (`mola`) e o meio-arco por cima. O de dentro fica
 * 1 cm afastado do vão: casado com o furo, a face de dentro da guarnição
 * cairia no plano do batente.
 */
function guarnicaoEmArco(cx: number, y0: number, mola: number, rx: number, ry: number, aba: number): THREE.Shape {
  const s = new THREE.Shape();
  const fora = rx + aba;
  const dentro = rx + 0.012;
  s.moveTo(cx - fora, y0);
  s.lineTo(cx - fora, mola);
  s.absellipse(cx, mola, fora, ry + aba, Math.PI, 0, true, 0);
  s.lineTo(cx + fora, y0);
  s.lineTo(cx + dentro, y0);
  s.lineTo(cx + dentro, mola);
  s.absellipse(cx, mola, dentro, ry + 0.012, 0, Math.PI, false, 0);
  s.lineTo(cx - dentro, y0);
  s.closePath();
  return s;
}

/**
 * A CORTINA FRANZIDA: um pano em grade com as pregas em seno no `z`.
 * Fechada, ela cobre o vão inteiro; ABERTA, ela é recolhida para um lado e
 * amarrada na altura da cintura — estreita na abraçadeira, aberta em cima e
 * embaixo, e com as pregas mais fundas onde está mais apertada.
 */
function geoCortina(larg: number, alt: number, aberta: boolean): THREE.BufferGeometry {
  const NU = aberta ? 10 : 22;
  const NV = 9;
  const frac = (v: number): number => {
    if (!aberta) return 1;
    return v > 0.42
      ? THREE.MathUtils.lerp(0.12, 0.3, Math.pow((v - 0.42) / 0.58, 1.2))
      : THREE.MathUtils.lerp(0.24, 0.12, v / 0.42);
  };
  const pos: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= NV; j++) {
    const v = j / NV;
    const w = frac(v);
    for (let i = 0; i <= NU; i++) {
      const u = i / NU;
      const x = aberta ? -larg / 2 + u * w * larg : (u - 0.5) * larg;
      const z = Math.sin(u * Math.PI * (aberta ? 5 : 11)) * (0.022 + 0.05 * (1 - w));
      pos.push(x, v * alt, z);
    }
  }
  for (let j = 0; j < NV; j++) {
    for (let i = 0; i < NU; i++) {
      const a = j * (NU + 1) + i;
      idx.push(a, a + 1, a + NU + 2, a, a + NU + 2, a + NU + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** o número da cabine num medalhão de latão (a pedra-chave do arco) */
function medalhao(numero: string): THREE.Mesh {
  const tex = texturaDePlaca(`medalhao:${numero}`, 128, 128, (ctx, w, h) => {
    ctx.fillStyle = hex(P.boutiqueOuro);
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = hex(P.boutiqueOuroEscuro);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = hex(P.boutiqueVinho);
    ctx.font = serifa(h * 0.5);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(numero, w / 2, h * 0.54);
  });
  const geo = new THREE.CylinderGeometry(0.075, 0.075, 0.014, 32);
  geo.rotateX(Math.PI / 2);
  return new THREE.Mesh(geo, toon(0xffffff, { mapa: tex }));
}

/**
 * =========================================== OS PROVADORES DA BOUTIQUE
 *
 * Uma FACHADA com três portas em arco — a parede é uma forma com os vãos
 * recortados e extrudada, então o batente de dentro do arco sai de graça —,
 * cada vão com a sua guarnição branca, o número num medalhão de latão no
 * alto e uma cortina de veludo vinho franzida. Por trás, as divisórias e o
 * fundo das cabines.
 *
 * A CABINE DA PONTA (a de `−X`, que a cena gira para o lado da sala) fica
 * ABERTA, com a cortina amarrada de lado: dentro, o espelho de moldura de
 * latão, o banquinho de veludo e o gancho com um vestido — é o que a dupla
 * vê ao espiar ("um banquinho, um espelho e um gancho").
 *
 * Elas nascem olhando para `+Z`, com o fundo em `z = −1,02`.
 */
export function provadoresDaBoutique(quantas = 3, larg = 1.2): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'provadores';
  const T = quantas * larg;
  const ALT = 2.7;
  const FUNDO = 1.02;
  const ESP = 0.1;
  const VAO = 0.84;
  const MOLA = 1.96;
  const RY = 0.3;
  const creme = toon(P.boutiqueBoiserie);
  const branco = toon(P.lojaEsquadria);
  const latao = toon(P.boutiqueOuro);
  const centro = (c: number): number => -T / 2 + larg * (c + 0.5);

  // a fachada: o contorno com as três portas recortadas até o chão
  const fachada = new THREE.Shape();
  fachada.moveTo(-T / 2, 0);
  for (let c = 0; c < quantas; c++) {
    const cx = centro(c);
    fachada.lineTo(cx - VAO / 2, 0);
    fachada.lineTo(cx - VAO / 2, MOLA);
    fachada.absellipse(cx, MOLA, VAO / 2, RY, Math.PI, 0, true, 0);
    fachada.lineTo(cx + VAO / 2, 0);
  }
  fachada.lineTo(T / 2, 0);
  fachada.lineTo(T / 2, ALT);
  fachada.lineTo(-T / 2, ALT);
  fachada.closePath();
  const geoFachada = new THREE.ExtrudeGeometry(fachada, { depth: ESP, bevelEnabled: false, curveSegments: 18 });
  geoFachada.translate(0, 0, -ESP);
  por(g, geoFachada, creme);
  por(g, frisoReto(PERFIL_CORNIJA, T), branco, 0, ALT - 0.22, 0);

  for (let c = 0; c < quantas; c++) {
    const cx = centro(c);
    const guarnicao = new THREE.ExtrudeGeometry(guarnicaoEmArco(cx, 0, MOLA, VAO / 2, RY, 0.075), {
      depth: 0.026, bevelEnabled: false, curveSegments: 18,
    });
    por(g, guarnicao, branco);
    const m = medalhao(String(c + 1));
    m.position.set(cx, MOLA + RY + 0.07, 0.036);
    g.add(m);
    // o varão da cortina, escondido atrás da fachada nas duas pontas
    const varao = new THREE.CylinderGeometry(0.012, 0.012, VAO + 0.16, 8);
    varao.rotateZ(Math.PI / 2);
    por(g, varao, latao, cx, MOLA + 0.012, -ESP - 0.05);
    const aberta = c === 0;
    const cortina = new THREE.Mesh(geoCortina(VAO + 0.12, MOLA - 0.02, aberta), toon(P.boutiqueVinho, { doubleSide: true }));
    cortina.position.set(cx, 0.02, -ESP - 0.06);
    g.add(cortina);
  }
  // o rodapé nos pés-direitos entre as guarnições
  for (let c = 0; c <= quantas; c++) {
    const de = c === 0 ? -T / 2 : centro(c - 1) + VAO / 2 + 0.075;
    const ate = c === quantas ? T / 2 : centro(c) - VAO / 2 - 0.075;
    if (ate - de > 0.02) por(g, frisoReto(PERFIL_RODAPE, ate - de), branco, (de + ate) / 2, 0, 0);
  }

  // as divisórias (n + 1, compartilhadas) e o fundo
  const profDiv = FUNDO - ESP - 0.04;
  for (let i = 0; i <= quantas; i++) {
    let x = -T / 2 + i * larg;
    if (i === 0) x += 0.03;
    if (i === quantas) x -= 0.03;
    por(g, new THREE.BoxGeometry(0.06, ALT - 0.12, profDiv), creme, x, (ALT - 0.12) / 2, -ESP - profDiv / 2);
  }
  por(g, new THREE.BoxGeometry(T, ALT - 0.12, 0.04), creme, 0, (ALT - 0.12) / 2, -FUNDO + 0.02);

  // ---------------------------------------- dentro da cabine aberta
  const cx = centro(0);
  const fundo = -FUNDO + 0.04;
  por(g, new THREE.BoxGeometry(0.5, 1.45, 0.012), flat(P.lojaEspelhoVidro, 0.95), cx, 1.08, fundo + 0.007);
  const molduraDoEspelho = contorno([[0.032, 0], [0.032, 0.008], [0.02, 0.016], [0.006, 0.012], [0, 0.004], [0, 0]], 0.25, 0.725);
  molduraDoEspelho.rotateX(Math.PI / 2);
  por(g, molduraDoEspelho, latao, cx, 1.08, fundo);
  // o banquinho de veludo
  por(g, torneado([[0.001, 0.44], [0.12, 0.44], [0.15, 0.425], [0.162, 0.39], [0.158, 0.1], [0.14, 0.04], [0.12, 0.0], [0.001, 0.0]], 28),
    P.boutiqueRosaAntigo, cx - 0.14, 0, -0.62);
  // o gancho na divisória, com um vestido pendurado de lado
  const parede = -T / 2 + larg - 0.03;
  const pino = new THREE.CylinderGeometry(0.01, 0.01, 0.06, 8);
  pino.rotateZ(Math.PI / 2);
  por(g, pino, latao, parede - 0.03, 1.92, -0.5);
  const vestido = roupaSolta('vestido', P.lojaVestidoLilas, P.lojaVestidoLilasRenda);
  vestido.position.set(parede - 0.08, 1.92, -0.5);
  vestido.rotation.y = Math.PI / 2;
  g.add(vestido);
  const poca = pocaDeLuz(0.42, P.luzDeAbajur, 0.22);
  poca.position.set(cx, 0.02, -0.5);
  g.add(poca);
  return acabar(g, [[P.boutiqueRosaAntigo, tramaDeTecido()]]);
}

// ================================================================= balcão

/**
 * ================================================ O BALCÃO DO CAIXA
 *
 * Frente CANELADA em rosa antigo — a silhueta do corpo é uma forma com a
 * borda da frente feita de meias-luas, extrudada para cima, então as
 * caneluras pegam luz e sombra do toon sem uma malha por ripa —, rodapé
 * recuado de latão, e o tampo de mármore.
 *
 * Na ponta de `+X` (a que a câmera vê) fica o MÓDULO DE EMBRULHO, aberto de
 * lado: as sacolinhas da loja dobradas e os rolos de papel de seda. Em cima:
 * a vitrininha de bijuteria no canto (tampa de vidro, bandeja de veludo,
 * anel e colar), o tablet do caixa, a maquininha, o vaso de peônias, o pote
 * de biscoito da Estella e a campainha. Tudo o que a conversa do balcão
 * descreve está lá.
 *
 * Frente em `+Z` (de onde o cliente chega); a Estella fica do lado de `−Z`.
 */
export function balcaoDaBoutique(largura = 2.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balcao-da-loja';
  const L = largura;
  const F = 0.62;
  const BASE = 0.07;
  const CORPO = 0.88;
  const TOPO = BASE + CORPO;
  const MOD = 0.46;
  const Lf = L - MOD;
  const xf = -L / 2 + Lf / 2;
  const latao = toon(P.boutiqueOuro);

  // ------------------------------------------ o corpo canelado
  const n = Math.round(Lf / 0.085);
  const passo = Lf / n;
  const rf = passo / 2;
  const s = new THREE.Shape();
  // a forma é desenhada com `y = −z do mundo`: a frente (+Z) é o y negativo
  s.moveTo(-Lf / 2, F / 2);
  s.lineTo(Lf / 2, F / 2);
  s.lineTo(Lf / 2, -F / 2 + rf);
  for (let i = n - 1; i >= 0; i--) {
    const cx = -Lf / 2 + passo * (i + 0.5);
    s.absarc(cx, -F / 2 + rf, rf, 0, Math.PI, true);
  }
  s.closePath();
  const corpo = new THREE.ExtrudeGeometry(s, { depth: CORPO, bevelEnabled: false, curveSegments: 5 });
  corpo.rotateX(-Math.PI / 2);
  por(g, corpo, P.boutiqueRosaAntigo, xf, BASE, 0);
  // o rodapé recuado de latão, corrido por baixo do balcão inteiro
  por(g, new THREE.BoxGeometry(L - 0.04, BASE, F - 0.1), P.boutiqueOuroEscuro, 0, BASE / 2, 0);
  // o tampo de mármore
  por(g, macia(L + 0.08, 0.05, F + 0.1, 0.014), P.boutiqueMarmore, 0, TOPO + 0.025, 0);

  // ------------------------------------------ o módulo de embrulho, aberto em +X
  const xm = L / 2 - MOD / 2;
  for (const lado of [-1, 1] as const) {
    por(g, new THREE.BoxGeometry(MOD, CORPO, 0.03), P.boutiqueRosaAntigo, xm, BASE + CORPO / 2, lado * (F / 2 - 0.015));
  }
  por(g, macia(MOD - 0.004, 0.035, F - 0.062, 0.008), P.boutiqueCarvalho, xm, BASE + 0.0175, 0);
  por(g, macia(MOD - 0.004, 0.025, F - 0.062, 0.006), P.boutiqueCarvalho, xm, 0.5, 0);
  // as sacolinhas dobradas, em pilha, e os rolos de papel de seda
  for (let i = 0; i < 6; i++) {
    const saco = new THREE.Mesh(macia(0.3, 0.014, 0.36, 0.005), toon(i % 3 === 2 ? P.lojaEsquadria : P.boutiqueSacola));
    saco.position.set(xm + (i % 2) * 0.012, BASE + 0.042 + i * 0.016, (i % 3) * 0.008);
    saco.rotation.y = (i % 2 ? 1 : -1) * 0.03;
    g.add(saco);
  }
  for (const [dz, cor] of [[-0.14, P.lojaEsquadria], [0.0, P.boutiqueRosaClaro], [0.14, P.lojaEsquadria]] as const) {
    const rolo = new THREE.CylinderGeometry(0.05, 0.05, 0.36, 16);
    rolo.rotateZ(Math.PI / 2);
    por(g, rolo, cor, xm, 0.5 + 0.0125 + 0.05, dz);
  }
  // as alças de corda de duas sacolas prontas, em pé no fundo do módulo
  for (const dz of [-0.17, 0.17]) {
    por(g, macia(0.22, 0.26, 0.09, 0.008), P.boutiqueSacola, xm - 0.06, 0.525 + 0.13, dz * 0.9);
    const alca = new THREE.TorusGeometry(0.055, 0.006, 5, 14, Math.PI);
    por(g, alca, P.boutiqueVinho, xm - 0.06, 0.525 + 0.26, dz * 0.9);
  }

  // ------------------------------------------ em cima do balcão
  const sobre = TOPO + 0.05;
  // a vitrininha de bijuteria, no canto da esquerda
  const xv = -L / 2 + 0.34;
  por(g, macia(0.48, 0.028, 0.32, 0.01), P.boutiqueVinho, xv, sobre + 0.014, -0.02);
  por(g, new THREE.BoxGeometry(0.5, 0.2, 0.34), toon(P.escadaVidro, { opacity: 0.22 }), xv, sobre + 0.1 + 0.002, -0.02);
  /*
   * A ARESTA DE LATÃO: montantes de 16 mm, e as travessas de cima mais finas
   * (12 mm) e de alturas diferentes entre si — cruzando nas quinas com a mesma
   * seção, as faces delas caíam no mesmo plano (`scripts/zfighting.mjs`).
   */
  for (const sx of [-1, 1] as const) {
    for (const sz of [-1, 1] as const) {
      por(g, new THREE.BoxGeometry(0.016, 0.21, 0.016), latao, xv + sx * 0.25, sobre + 0.105, -0.02 + sz * 0.17);
    }
  }
  for (const sz of [-1, 1] as const) por(g, new THREE.BoxGeometry(0.5, 0.02, 0.012), latao, xv, sobre + 0.205, -0.02 + sz * 0.17);
  for (const sx of [-1, 1] as const) por(g, new THREE.BoxGeometry(0.012, 0.014, 0.34), latao, xv + sx * 0.25, sobre + 0.206, -0.02);
  for (const [dx, dz] of [[-0.14, -0.06], [-0.04, 0.05], [0.06, -0.05]] as const) {
    const anel = new THREE.TorusGeometry(0.024, 0.006, 6, 16);
    anel.rotateX(-1.2);
    por(g, anel, P.boutiqueOuro, xv + dx, sobre + 0.04, -0.02 + dz);
  }
  const colar = new THREE.TorusGeometry(0.075, 0.005, 5, 28);
  colar.rotateX(Math.PI / 2);
  por(g, colar, P.lojaEsquadria, xv + 0.13, sobre + 0.032, 0.02);
  por(g, new THREE.SphereGeometry(0.016, 8, 6), P.boutiqueRosaAntigo, xv + 0.13, sobre + 0.04, 0.095);

  // o vaso de peônias
  const vaso = vasoDeFlores();
  vaso.position.set(-0.35, sobre, -0.05);
  g.add(vaso);

  // o tablet do caixa, virado para quem atende, e a maquininha
  por(g, new THREE.CylinderGeometry(0.06, 0.07, 0.012, 16), latao, 0.12, sobre + 0.006, -0.05);
  por(g, new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8), latao, 0.12, sobre + 0.06, -0.05);
  const tela = por(g, macia(0.26, 0.18, 0.014, 0.008), P.tvCorpo, 0.12, sobre + 0.17, -0.07);
  tela.rotation.x = 0.35;
  por(g, macia(0.075, 0.03, 0.14, 0.008), P.tvCorpo, 0.4, sobre + 0.015, 0.05);

  // o pote de biscoito: vidro, tampa de latão, e os biscoitinhos dentro
  const xp = 0.7;
  por(g, torneado([[0.001, 0], [0.075, 0], [0.085, 0.02], [0.085, 0.15], [0.07, 0.17], [0.06, 0.18]], 24), toon(P.escadaVidro, { opacity: 0.3 }), xp, sobre, 0.0);
  por(g, torneado([[0.001, 0.035], [0.012, 0.035], [0.015, 0.02], [0.065, 0.012], [0.068, 0.0], [0.001, 0.0]], 24), latao, xp, sobre + 0.18, 0.0);
  for (let i = 0; i < 6; i++) {
    const b = new THREE.CylinderGeometry(0.045, 0.045, 0.016, 14);
    b.rotateZ(0.25 * (i % 2 ? 1 : -1));
    por(g, b, P.boutiqueBiscoito, xp + (i % 2 ? 0.012 : -0.01), sobre + 0.015 + i * 0.022, (i % 3) * 0.008 - 0.008);
  }
  // a campainha de balcão
  por(g, new THREE.CylinderGeometry(0.045, 0.05, 0.012, 16), P.boutiqueOuroEscuro, 0.98, sobre + 0.006, 0.12);
  por(g, new THREE.SphereGeometry(0.042, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), latao, 0.98, sobre + 0.012, 0.12);
  por(g, new THREE.SphereGeometry(0.01, 8, 6), latao, 0.98, sobre + 0.06, 0.12);

  return acabar(g, [
    [P.boutiqueMarmore, marmore()], [P.boutiqueCarvalho, veioDeMadeira()], [P.boutiqueVinho, tramaDeTecido()],
  ]);
}

// ======================================================= mesa de expor

/** a peça dobrada: um pano de quina macia, com a dobra da frente um tico mais alta */
let dobrada: THREE.BufferGeometry | null = null;
function geoDobrada(): THREE.BufferGeometry {
  if (dobrada) return dobrada;
  dobrada = macia(0.32, 0.044, 0.27, 0.018);
  return dobrada;
}

/**
 * A MESA DE EXPOR, no meio do pátio das araras: tampo de mármore sobre dois
 * pés de trenó em latão (o tubo dobrado num retângulo de quina redonda), uma
 * prateleira de carvalho embaixo, e em cima as pilhas de roupa DOBRADA — uma
 * cor por pilha, as cores das peças que a loja vende —, o vaso de peônias e
 * o cartãozinho "coleção nova".
 *
 * Ela existe por contraste: a loja é toda roupa pendurada, em pé; a mesa é a
 * linha deitada no meio, e é ela que faz o salão parecer arrumado por gente.
 */
export function mesaDeExposicao(pecas: readonly ItemDef[], largura = 1.6): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-de-dobrar';
  const L = largura;
  const F = 0.86;
  const ALT = 0.8;
  const latao = toon(P.boutiqueOuro);
  por(g, macia(L, 0.05, F, 0.016), P.boutiqueMarmore, 0, ALT - 0.025, 0);
  for (const sx of [-1, 1] as const) {
    const pe = new THREE.TubeGeometry(dobrado([
      [-F / 2 + 0.07, 0.012], [-F / 2 + 0.07, ALT - 0.05], [F / 2 - 0.07, ALT - 0.05], [F / 2 - 0.07, 0.012], [-F / 2 + 0.07, 0.012],
    ], 0.06), 60, 0.016, 8, false);
    pe.rotateY(-Math.PI / 2);
    por(g, pe, latao, sx * (L / 2 - 0.14), 0, 0);
  }
  por(g, macia(L - 0.25, 0.03, F - 0.1, 0.01), P.boutiqueCarvalho, 0, 0.24, 0);

  const v = new Vitrine();
  const cores = pecas.map((p) => p.cor ?? P.lojaLinho);
  const pilha = (x: number, y: number, z: number, cor: number, quantas: number, semente: number): void => {
    const rnd = sorteio(semente);
    for (let i = 0; i < quantas; i++) {
      const m = new THREE.Matrix4().compose(
        new THREE.Vector3(x + (rnd() - 0.5) * 0.012, y + 0.022 + i * 0.045, z + (rnd() - 0.5) * 0.012),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (rnd() - 0.5) * 0.06),
        new THREE.Vector3(1, 1, 1),
      );
      v.por(geoDobrada(), m, cor);
    }
  };
  const topo = ALT;
  pilha(-0.56, topo, -0.12, cores[0 % cores.length], 5, 1);
  pilha(-0.2, topo, -0.14, cores[1 % cores.length], 4, 2);
  pilha(0.52, topo, -0.1, cores[2 % cores.length], 5, 3);
  pilha(-0.48, 0.255, 0.0, cores[3 % cores.length], 3, 4);
  pilha(0.1, 0.255, 0.0, cores[0 % cores.length], 3, 5);
  v.montar(g);

  const vaso = vasoDeFlores();
  vaso.position.set(0.16, topo, -0.08);
  g.add(vaso);
  // o cartão "coleção nova", num suportinho de latão
  const tex = texturaDePlaca('colecao-nova', 256, 160, (ctx, w, h) => {
    ctx.fillStyle = '#fbf7f0';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = hex(P.boutiqueVinho);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = serifa(h * 0.26, true);
    ctx.fillText('coleção', w / 2, h * 0.36);
    ctx.fillText('nova', w / 2, h * 0.66);
  });
  const cartao = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.1), toon(0xffffff, { mapa: tex, doubleSide: true }));
  cartao.position.set(0.18, topo + 0.07, 0.24);
  cartao.rotation.x = -0.25;
  g.add(cartao);
  por(g, new THREE.BoxGeometry(0.1, 0.012, 0.04), latao, 0.18, topo + 0.006, 0.25);
  return acabar(g, [[P.boutiqueMarmore, marmore()], [P.boutiqueCarvalho, veioDeMadeira()]]);
}

// =================================================== estante em arco

/** a bolsa de mão: corpo de quina macia e a alça em arco */
let bolsa: THREE.BufferGeometry | null = null;
let alcaDaBolsa: THREE.BufferGeometry | null = null;
function geoBolsa(): [THREE.BufferGeometry, THREE.BufferGeometry] {
  if (!bolsa || !alcaDaBolsa) {
    bolsa = macia(0.26, 0.17, 0.1, 0.035);
    bolsa.translate(0, 0.085, 0);
    alcaDaBolsa = new THREE.TorusGeometry(0.075, 0.009, 6, 16, Math.PI);
    alcaDaBolsa.translate(0, 0.17, 0);
  }
  return [bolsa, alcaDaBolsa];
}

/** o chapéu de palha: copa, aba e a fita */
let chapeu: THREE.BufferGeometry | null = null;
function geoChapeu(): THREE.BufferGeometry {
  if (chapeu) return chapeu;
  chapeu = new THREE.LatheGeometry([
    [0.001, 0.0], [0.19, 0.0], [0.195, 0.008], [0.11, 0.012], [0.1, 0.09], [0.09, 0.1], [0.001, 0.1],
  ].map(([r, y]) => new THREE.Vector2(r, y)), 28);
  return chapeu;
}

/**
 * A ESTANTE DE NICHOS EM ARCO, encostada na parede: um corpo creme com dois
 * nichos de arco recortados (a forma com furo, extrudada na profundidade — as
 * paredes do nicho saem do próprio furo), o fundo rosa por trás, guarnição
 * branca em volta de cada arco, cornija em cima e duas gavetas embaixo com
 * puxador de latão.
 *
 * CADA NICHO É ACESO POR DENTRO: um spot no alto do arco e a luz pintada no
 * fundo (`pocaDeLuz` em pé), que é o que faz a estante brilhar como vitrine
 * sem uma luz de verdade a mais na cena. Dentro: sapatos, bolsas, roupa
 * dobrada e um chapéu de palha.
 *
 * Frente em `+Z`; o fundo encosta na parede em `z = −0,43`.
 */
export function estanteEmArco(largura = 2.0, semente = 11): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'prateleira-da-loja';
  const L = largura;
  const ALT = 2.6;
  const F = 0.42;
  const BAT = 0.12;
  const NW = (L - 3 * BAT) / 2;
  const PISO = 0.72;
  const MOLA = 2.02;
  const RY = NW / 2 * 0.62;
  const creme = toon(P.boutiqueBoiserie);
  const branco = toon(P.lojaEsquadria);
  const latao = toon(P.boutiqueOuro);
  const centro = (k: number): number => -L / 2 + BAT + NW / 2 + k * (NW + BAT);

  const corpo = new THREE.Shape();
  corpo.moveTo(-L / 2, 0.06);
  corpo.lineTo(L / 2, 0.06);
  corpo.lineTo(L / 2, ALT);
  corpo.lineTo(-L / 2, ALT);
  corpo.closePath();
  for (let k = 0; k < 2; k++) {
    const cx = centro(k);
    const furo = new THREE.Path();
    furo.moveTo(cx - NW / 2, PISO);
    furo.lineTo(cx + NW / 2, PISO);
    furo.lineTo(cx + NW / 2, MOLA);
    furo.absellipse(cx, MOLA, NW / 2, RY, 0, Math.PI, false, 0);
    furo.lineTo(cx - NW / 2, PISO);
    corpo.holes.push(furo);
  }
  const geoCorpo = new THREE.ExtrudeGeometry(corpo, { depth: F, bevelEnabled: false, curveSegments: 18 });
  geoCorpo.translate(0, 0, -F);
  por(g, geoCorpo, creme);
  por(g, new THREE.BoxGeometry(L - 0.02, ALT - 0.1, 0.02), P.boutiqueNicho, 0, 0.06 + (ALT - 0.1) / 2, -F - 0.01);
  por(g, new THREE.BoxGeometry(L - 0.06, 0.06, F - 0.05), P.lojaRodape, 0, 0.03, -F / 2);
  por(g, frisoReto(PERFIL_CORNIJA, L), branco, 0, ALT - 0.22, 0);

  const rnd = sorteio(semente);
  const tons = [P.tecidoRosa, P.tecidoVinho, P.lojaLinho, P.tecidoCeu, P.tecidoMostarda, P.lojaVestidoJade, P.lojaTerracota, P.tecidoLilas];
  const tom = (): number => tons[Math.floor(rnd() * tons.length)];
  const v = new Vitrine();
  const [geoDaBolsa, geoDaAlca] = geoBolsa();

  for (let k = 0; k < 2; k++) {
    const cx = centro(k);
    // a guarnição branca em volta do arco
    const guarnicao = new THREE.ExtrudeGeometry(guarnicaoEmArco(cx, PISO, MOLA, NW / 2, RY, 0.055), {
      depth: 0.022, bevelEnabled: false, curveSegments: 18,
    });
    por(g, guarnicao, branco);
    // a gaveta embaixo do nicho, com o puxador
    por(g, macia(NW + 0.06, 0.48, 0.03, 0.012), creme, cx, 0.38, 0.012);
    const puxador = new THREE.CapsuleGeometry(0.008, 0.14, 4, 8);
    puxador.rotateZ(Math.PI / 2);
    por(g, puxador, latao, cx, 0.5, 0.04);
    // as duas prateleiras de carvalho
    for (const y of [1.17, 1.6]) por(g, macia(NW + 0.006, 0.025, F - 0.06, 0.006), P.boutiqueCarvalho, cx, y, -F / 2);
    // o spot no alto do arco e a luz no fundo
    const spot = new THREE.CylinderGeometry(0.03, 0.03, 0.012, 14);
    por(g, spot, toon(P.boutiqueLuz, { glow: 0.9 }), cx, MOLA + RY - 0.01, -F / 2);
    const banho = pocaDeLuz(0.62, P.luzDeAbajur, 0.34, true);
    banho.position.set(cx, 1.62, -F + 0.004);
    g.add(banho);

    // ----- o que mora no nicho: no chão dele, dois pares de botinha (a mesma
    // bota das araras, num número menor), cada par de uma cor
    for (const dx of [-NW * 0.24, NW * 0.22]) {
      const cor = tom();
      const cano = new THREE.Color(cor).multiplyScalar(0.7).getHex();
      for (const l of [-1, 1] as const) {
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3(cx + dx + l * 0.055, PISO, -F / 2 + 0.015 * l),
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), l * 0.1 + 0.35),
          new THREE.Vector3(0.78, 0.78, 0.78),
        );
        v.por(geoDaBota(), m, cor);
        v.por(geoDoCanoDaBota(), m, cano);
      }
    }
    const corDaBolsa = tom();
    const mb = new THREE.Matrix4().compose(new THREE.Vector3(cx - NW * 0.15, 1.1825, -F / 2),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.25), new THREE.Vector3(1, 1, 1));
    v.por(geoDaBolsa, mb, corDaBolsa);
    v.por(geoDaAlca, mb, P.boutiqueOuro);
    for (let i = 0; i < 3; i++) {
      v.por(geoDobrada(), new THREE.Matrix4().compose(
        new THREE.Vector3(cx + NW * 0.2, 1.1825 + 0.022 + i * 0.045, -F / 2 + 0.02),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (rnd() - 0.5) * 0.08),
        new THREE.Vector3(0.75, 1, 0.9),
      ), i === 1 ? tom() : P.lojaLinho);
    }
    v.por(geoChapeu(), new THREE.Matrix4().compose(new THREE.Vector3(cx - NW * 0.12, 1.6125, -F / 2),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.08), new THREE.Vector3(1, 1, 1)), P.boutiqueBiscoito);
    v.por(geoDaBolsa, new THREE.Matrix4().compose(new THREE.Vector3(cx + NW * 0.25, 1.6125, -F / 2),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.3), new THREE.Vector3(0.7, 0.75, 0.9)), tom());
  }
  v.montar(g);
  return acabar(g, [[P.boutiqueCarvalho, veioDeMadeira()]]);
}

// ============================================================ estofados

/**
 * O PUFE CAPITONÊ: torneado (barriga redonda, tampo abaulado), com as
 * COVINHAS do capitonê empurradas vértice a vértice — cada botão afunda o
 * tampo em volta dele num sino suave, e o toon desenha a covinha sozinho —,
 * os botões, e os quatro pés de latão.
 */
export function pufeCapitone(cor: number = P.boutiqueVinho, raio = 0.36): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pufe-de-loja';
  const r = raio;
  const perfil: Array<readonly [number, number]> = [[0.001, 0.08], [r * 0.82, 0.08], [r * 0.95, 0.12], [r, 0.24], [r * 0.97, 0.35], [r * 0.9, 0.4]];
  for (let i = 1; i <= 7; i++) {
    const t = i / 7;
    perfil.push([r * 0.9 * (1 - t) + 0.001 * t, 0.4 + 0.075 * Math.sin((t * Math.PI) / 2)]);
  }
  const geo = new THREE.LatheGeometry(perfil.map(([a, b]) => new THREE.Vector2(a, b)), 40);
  // os botões: um no meio e seis em volta
  const botoes: Array<[number, number]> = [[0, 0]];
  for (let i = 0; i < 6; i++) botoes.push([Math.cos((i / 6) * Math.PI * 2) * r * 0.5, Math.sin((i / 6) * Math.PI * 2) * r * 0.5]);
  const pos = geo.getAttribute('position');
  const altura = (x: number, z: number): number => {
    let y = 0;
    for (const [bx, bz] of botoes) y -= 0.022 * Math.exp(-((x - bx) ** 2 + (z - bz) ** 2) / (0.055 * 0.055));
    return y;
  };
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) < 0.385) continue;
    pos.setY(i, pos.getY(i) + altura(pos.getX(i), pos.getZ(i)));
  }
  geo.computeVertexNormals();
  por(g, geo, cor);
  const escuro = new THREE.Color(cor).multiplyScalar(0.7).getHex();
  for (const [bx, bz] of botoes) {
    const d = Math.hypot(bx, bz) / (r * 0.9);
    const yTopo = 0.4 + 0.075 * Math.sin(((1 - d) * Math.PI) / 2) + altura(bx, bz);
    por(g, new THREE.SphereGeometry(0.014, 8, 6), escuro, bx, yTopo + 0.004, bz);
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const pe = new THREE.CylinderGeometry(0.018, 0.012, 0.09, 8);
    pe.translate(0, 0.045, 0);
    por(g, pe, P.boutiqueOuro, Math.cos(a) * r * 0.62, 0, Math.sin(a) * r * 0.62);
  }
  return acabar(g, [[cor, tramaDeTecido()]]);
}

/**
 * A NAMORADEIRA DE VELUDO: o cantinho de esperar enquanto o outro prova. O
 * encosto é CANELADO (quatro gomos em pé, de quina bem redonda), os braços
 * são rolos, o assento é uma almofada só, e os pés são palitos de latão. Duas
 * almofadas soltas, uma de cada cor, uma delas torta — sinal de gente.
 *
 * Frente em `+Z`, encosto em `−Z`.
 */
export function namoradeira(cor: number = P.boutiqueRosaAntigo, largura = 1.6): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'namoradeira';
  const L = largura;
  por(g, macia(L, 0.2, 0.76, 0.06), cor, 0, 0.2 + 0.1, 0);
  por(g, macia(L - 0.32, 0.14, 0.62, 0.06), cor, 0, 0.4 + 0.07, 0.05);
  const gomos = 4;
  const largGomo = (L - 0.3) / gomos;
  for (let i = 0; i < gomos; i++) {
    const gomo = por(g, macia(largGomo + 0.01, 0.52, 0.17, 0.075), cor, -(L - 0.3) / 2 + largGomo * (i + 0.5), 0.4 + 0.27, -0.29);
    gomo.rotation.x = -0.13;
  }
  for (const l of [-1, 1] as const) {
    por(g, macia(0.17, 0.42, 0.76, 0.08), cor, l * (L / 2 - 0.085), 0.2 + 0.21, 0);
  }
  for (const sx of [-1, 1] as const) {
    for (const sz of [-1, 1] as const) {
      const pe = new THREE.CylinderGeometry(0.022, 0.013, 0.2, 8);
      pe.translate(0, 0.1, 0);
      por(g, pe, P.boutiqueOuro, sx * (L / 2 - 0.1), 0, sz * 0.28);
    }
  }
  const a1 = por(g, macia(0.34, 0.32, 0.12, 0.06), P.boutiqueVinho, -L / 2 + 0.4, 0.66, -0.13);
  a1.rotation.set(-0.3, 0.25, 0.1);
  const a2 = por(g, macia(0.32, 0.3, 0.12, 0.06), P.lojaLinho, L / 2 - 0.38, 0.65, -0.14);
  a2.rotation.set(-0.28, -0.3, -0.18);
  return acabar(g, [[cor, tramaDeTecido()], [P.boutiqueVinho, tramaDeTecido()], [P.lojaLinho, tramaDeTecido()]]);
}

/**
 * A MESINHA LATERAL: tampo redondo de mármore num pé torneado de latão, com
 * duas revistas de moda e uma xícara em cima.
 */
export function mesinhaLateral(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesinha-lateral';
  por(g, torneado([[0.001, 0.02], [0.17, 0.016], [0.18, 0.0], [0.001, 0.0]], 28), P.boutiqueOuro);
  por(g, torneado([[0.03, 0.02], [0.022, 0.1], [0.018, 0.4], [0.026, 0.52], [0.05, 0.545], [0.001, 0.55]], 20), P.boutiqueOuro);
  por(g, new THREE.CylinderGeometry(0.25, 0.25, 0.03, 40), P.boutiqueMarmore, 0, 0.565, 0);
  for (const [i, cor] of [[0, P.boutiqueRosaAntigo], [1, P.lojaEsquadria]] as const) {
    const rev = por(g, new THREE.BoxGeometry(0.2, 0.012, 0.27), cor, -0.05 + i * 0.02, 0.586 + i * 0.012, -0.02);
    rev.rotation.y = 0.3 - i * 0.5;
  }
  por(g, torneado([[0.001, 0.0], [0.03, 0.0], [0.04, 0.05], [0.042, 0.06], [0.036, 0.06], [0.03, 0.01], [0.001, 0.01]], 18), P.lojaEsquadria, 0.13, 0.58, 0.08);
  return acabar(g, [[P.boutiqueMarmore, marmore()]]);
}

/**
 * UM QUADRO DE PAREDE: gravura abstrata pintada em canvas (o arco rosa, o
 * sol de mostarda, a onda vinho — o tipo de quadro de loja de roupa), com
 * passe-partout branco e moldura fina de latão. A parede é `z = 0`.
 */
export function quadroDeArte(largura = 0.7, altura = 0.9, semente = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quadro-de-arte';
  const tex = texturaDePlaca(`arte:${semente}`, 256, Math.round((256 * altura) / largura), (ctx, w, h) => {
    const rnd = sorteio(semente * 97);
    ctx.fillStyle = '#fbf8f3';
    ctx.fillRect(0, 0, w, h);
    const m = w * 0.12;
    ctx.fillStyle = '#f2ebe2';
    ctx.fillRect(m, m, w - 2 * m, h - 2 * m);
    ctx.save();
    ctx.beginPath();
    ctx.rect(m, m, w - 2 * m, h - 2 * m);
    ctx.clip();
    const cx = w / 2 + (rnd() - 0.5) * w * 0.15;
    ctx.fillStyle = hex(P.boutiqueRosaAntigo);
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.22, h - m);
    ctx.lineTo(cx - w * 0.22, h * 0.52);
    ctx.arc(cx, h * 0.52, w * 0.22, Math.PI, 0);
    ctx.lineTo(cx + w * 0.22, h - m);
    ctx.fill();
    ctx.fillStyle = hex(semente % 2 ? P.tecidoMostarda : P.lojaMenta);
    ctx.beginPath();
    ctx.arc(cx + w * (rnd() < 0.5 ? -0.16 : 0.17), h * 0.33, w * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = hex(P.boutiqueVinho);
    ctx.lineWidth = w * 0.025;
    ctx.beginPath();
    for (let x = m; x <= w - m; x += 4) {
      const y = h * 0.78 + Math.sin((x / w) * Math.PI * 3 + semente) * h * 0.03;
      if (x === m) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  });
  por(g, new THREE.BoxGeometry(largura, altura, 0.02), P.lojaEsquadria, 0, 0, 0.01);
  por(g, new THREE.PlaneGeometry(largura - 0.01, altura - 0.01), toon(0xffffff, { mapa: tex }), 0, 0, 0.0205);
  const moldura = contorno([[0.024, 0], [0.024, 0.018], [0.014, 0.026], [0.004, 0.022], [0, 0.012], [0, 0]], largura / 2, altura / 2);
  moldura.rotateX(Math.PI / 2);
  por(g, moldura, P.boutiqueOuro, 0, 0, 0);
  return g;
}

// ========================================================= o busto de costura

/**
 * =========================================== O BUSTO DE COSTURA (manequim)
 *
 * A Estella é COSTUREIRA, e o manequim da loja dela não é o boneco de
 * plástico de loja de departamento: é o busto de costura — o torso de linho
 * torneado (quadril, cintura, busto, ombro e o pescoço com o pinhão de
 * madeira), espetado num pé de madeira torneado com tripé. É o objeto do
 * ateliê, e é chique sem esforço.
 *
 * Ele VESTE a peça que recebe, costurada em cima do torso (e não pendurada):
 *  - vestido: corpete justo, a faixa da cintura e a saia rodada que cai por
 *    cima do pé, com o godê (a barra ondula em volta) e a renda na barra;
 *  - camisa: o corpo, as mangas curtas, a gola e a carcela de botões.
 *
 * E a FITA MÉTRICA amarela pendurada no pescoço, que é a assinatura dela.
 */
export function bustoDeCostura(roupa: ItemDef): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'manequim-de-loja';
  const madeira = toon(P.woodDark);
  const latao = toon(P.boutiqueOuro);

  // o tripé e o pé torneado
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    por(g, tubo([[c * 0.03, 0.3, s * 0.03], [c * 0.14, 0.2, s * 0.14], [c * 0.26, 0.06, s * 0.26], [c * 0.3, 0.025, s * 0.3]], 0.017, 14, 6), madeira);
    por(g, new THREE.SphereGeometry(0.022, 8, 6), latao, c * 0.3, 0.022, s * 0.3);
  }
  por(g, torneado([[0.001, 0.28], [0.035, 0.28], [0.04, 0.31], [0.022, 0.35], [0.018, 0.62], [0.026, 0.8], [0.032, 0.84], [0.02, 0.87], [0.001, 0.87]], 14), madeira);
  const anel = new THREE.TorusGeometry(0.024, 0.008, 6, 14);
  anel.rotateX(Math.PI / 2);
  por(g, anel, latao, 0, 0.6, 0);

  // o torso de linho
  const torso = torneado([
    [0.001, 0.86], [0.15, 0.86], [0.178, 0.9], [0.19, 0.97], [0.178, 1.05], [0.142, 1.13],
    [0.15, 1.2], [0.18, 1.28], [0.178, 1.34], [0.155, 1.41], [0.075, 1.46], [0.056, 1.5], [0.05, 1.56], [0.001, 1.57],
  ], 28);
  torso.scale(1, 1, 0.78);
  por(g, torso, P.lojaManequim);
  por(g, torneado([[0.001, 0.0], [0.04, 0.0], [0.045, 0.02], [0.025, 0.05], [0.012, 0.07], [0.001, 0.075]], 12), madeira, 0, 1.565, 0);

  const pano = roupa.cor ?? P.lojaVestidoJade;
  const det = roupa.corDetalhe ?? new THREE.Color(pano).multiplyScalar(0.8).getHex();
  const tipo = tipoNaArara(roupa);
  /** um pedaço de roupa torneado por cima do torso (achatado como ele) */
  const vestir = (perfil: ReadonlyArray<readonly [number, number]>, cor: number, achata = 0.8, gomos = 28): THREE.Mesh => {
    const geo = torneado(perfil, gomos);
    geo.scale(1, 1, achata);
    return por(g, geo, cor);
  };
  if (tipo === 'vestido') {
    vestir([[0.152, 1.12], [0.16, 1.2], [0.19, 1.28], [0.19, 1.34], [0.172, 1.37]], pano, 0.8);
    // a saia rodada, com o godê: a barra ondula em volta, mais fundo embaixo
    const saia = torneado([[0.158, 1.14], [0.2, 1.05], [0.235, 0.94], [0.28, 0.78], [0.33, 0.6], [0.35, 0.54]], 48);
    const pos = saia.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = THREE.MathUtils.clamp((1.05 - y) / 0.5, 0, 1);
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const a = Math.atan2(z, x);
      const k = 1 + 0.07 * t * Math.cos(a * 9);
      pos.setX(i, x * k);
      pos.setZ(i, z * k * 0.86);
    }
    saia.computeVertexNormals();
    por(g, saia, toon(pano, { doubleSide: true }));
    const faixa = new THREE.TorusGeometry(0.15, 0.018, 8, 32);
    faixa.rotateX(Math.PI / 2);
    faixa.scale(1, 1, 0.82);
    por(g, faixa, det, 0, 1.135, 0);
    const renda = new THREE.TorusGeometry(0.35, 0.016, 6, 64);
    renda.rotateX(Math.PI / 2);
    const pr = renda.getAttribute('position');
    for (let i = 0; i < pr.count; i++) {
      const x = pr.getX(i);
      const z = pr.getZ(i);
      const a = Math.atan2(z, x);
      const k = 1 + 0.07 * Math.cos(a * 9);
      pr.setX(i, x * k);
      pr.setZ(i, z * k * 0.86);
    }
    renda.computeVertexNormals();
    por(g, renda, det, 0, 0.55, 0);
    for (const l of [-1, 1] as const) {
      por(g, tubo([[l * 0.09, 1.35, 0.11], [l * 0.11, 1.43, 0.05], [l * 0.1, 1.44, -0.04], [l * 0.09, 1.36, -0.1]], 0.009, 10, 5), pano);
    }
  } else {
    vestir([[0.192, 0.93], [0.192, 0.97], [0.182, 1.05], [0.152, 1.13], [0.16, 1.2], [0.19, 1.28], [0.188, 1.34], [0.165, 1.41], [0.085, 1.455]], pano, 0.8);
    const barra = new THREE.TorusGeometry(0.192, 0.014, 6, 32);
    barra.rotateX(Math.PI / 2);
    barra.scale(1, 1, 0.8);
    por(g, barra, det, 0, 0.935, 0);
    for (const l of [-1, 1] as const) {
      const manga = new THREE.CapsuleGeometry(0.055, 0.1, 4, 10);
      manga.scale(1, 1, 0.8);
      const m = por(g, manga, pano, l * 0.2, 1.33, 0);
      m.rotation.z = l * 0.65;
      const punho = new THREE.TorusGeometry(0.052, 0.01, 6, 14);
      punho.rotateX(Math.PI / 2);
      const p = por(g, punho, det, l * 0.245, 1.27, 0);
      p.rotation.z = l * 0.65;
    }
    const gola = new THREE.TorusGeometry(0.085, 0.016, 6, 24);
    gola.rotateX(Math.PI / 2);
    gola.scale(1, 1, 0.8);
    por(g, gola, det, 0, 1.45, 0);
    por(g, new THREE.BoxGeometry(0.03, 0.42, 0.02), det, 0, 1.18, 0.147);
    for (let i = 0; i < 4; i++) por(g, new THREE.SphereGeometry(0.009, 8, 6), P.lojaEsquadria, 0, 1.33 - i * 0.1, 0.16);
  }
  // a fita métrica, pendurada no pescoço e caindo pelos dois lados da frente
  por(g, tubo([
    [-0.08, 1.12, 0.15], [-0.07, 1.3, 0.13], [-0.06, 1.46, 0.07], [0, 1.5, -0.04], [0.06, 1.46, 0.07], [0.075, 1.3, 0.13], [0.06, 1.05, 0.155],
  ], 0.008, 40, 5), P.boutiqueFita);
  return acabar(g, [[P.lojaManequim, tramaDeTecido()]]);
}

// ======================================================== vitrine de joias

/**
 * A VITRINE DE JOIAS do mezanino: um balcãozinho canelado em rosa antigo com
 * tampo de mármore e, em cima, a caixa de VIDRO com aresta de latão — dentro,
 * a bandeja de veludo vinho com anéis, colares e brincos. De cima (que é como
 * a câmera vê), o vidro mostra tudo o que está dentro.
 *
 * Frente em `+Z`.
 */
export function vitrineDeJoias(largura = 1.3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'vitrine-de-joias';
  const L = largura;
  const F = 0.56;
  const BASE = 0.06;
  const CORPO = 0.78;
  const latao = toon(P.boutiqueOuro);
  // o corpo canelado nos quatro lados: a forma é um retângulo de bordas em meia-lua
  const n = Math.round(L / 0.08);
  const passo = L / n;
  const rf = passo / 2;
  const s = new THREE.Shape();
  s.moveTo(-L / 2, F / 2 - rf);
  for (let i = 0; i < n; i++) s.absarc(-L / 2 + passo * (i + 0.5), F / 2 - rf, rf, Math.PI, 0, true);
  s.lineTo(L / 2, -F / 2 + rf);
  for (let i = n - 1; i >= 0; i--) s.absarc(-L / 2 + passo * (i + 0.5), -F / 2 + rf, rf, 0, Math.PI, true);
  s.closePath();
  const corpo = new THREE.ExtrudeGeometry(s, { depth: CORPO, bevelEnabled: false, curveSegments: 4 });
  corpo.rotateX(-Math.PI / 2);
  por(g, corpo, P.boutiqueRosaAntigo, 0, BASE, 0);
  por(g, new THREE.BoxGeometry(L - 0.06, BASE, F - 0.1), P.boutiqueOuroEscuro, 0, BASE / 2, 0);
  const topo = BASE + CORPO;
  por(g, macia(L + 0.06, 0.04, F + 0.06, 0.012), P.boutiqueMarmore, 0, topo + 0.02, 0);
  const sobre = topo + 0.04;
  // a bandeja de veludo e as joias
  por(g, macia(L - 0.12, 0.025, F - 0.14, 0.01), P.boutiqueVinho, 0, sobre + 0.0125, 0);
  const rnd = sorteio(888);
  for (let i = 0; i < 7; i++) {
    const x = -L / 2 + 0.16 + ((L - 0.32) / 6) * i;
    if (i % 3 === 0) {
      const colar = new THREE.TorusGeometry(0.075, 0.006, 5, 28);
      colar.rotateX(Math.PI / 2);
      colar.scale(1, 1, 1.3);
      por(g, colar, i % 2 ? P.lojaEsquadria : P.boutiqueOuro, x, sobre + 0.03, 0.0);
      por(g, new THREE.SphereGeometry(0.018, 8, 6), i % 2 ? P.lojaVestidoJade : P.boutiqueRosaAntigo, x, sobre + 0.034, 0.1);
    } else {
      for (const dz of [-0.07, 0.07]) {
        const anel = new THREE.TorusGeometry(0.022, 0.006, 6, 14);
        anel.rotateX(-1.1 + (rnd() - 0.5) * 0.4);
        por(g, anel, P.boutiqueOuro, x, sobre + 0.045, dz);
        if (rnd() < 0.6) por(g, new THREE.OctahedronGeometry(0.011, 0), rnd() < 0.5 ? P.metalWhite : P.tecidoCeu, x, sobre + 0.068, dz);
      }
    }
  }
  // a caixa de vidro com a aresta de latão
  const alto = 0.26;
  por(g, new THREE.BoxGeometry(L - 0.04, alto, F - 0.04), toon(P.escadaVidro, { opacity: 0.2 }), 0, sobre + alto / 2 + 0.002, 0);
  // (a mesma regra da aresta da vitrininha do balcão: seções diferentes nas quinas)
  for (const sx of [-1, 1] as const) {
    for (const sz of [-1, 1] as const) {
      por(g, new THREE.BoxGeometry(0.016, alto + 0.01, 0.016), latao, sx * (L / 2 - 0.02), sobre + alto / 2, sz * (F / 2 - 0.02));
    }
    por(g, new THREE.BoxGeometry(0.012, 0.014, F - 0.04), latao, sx * (L / 2 - 0.02), sobre + alto + 0.001, 0);
  }
  for (const sz of [-1, 1] as const) por(g, new THREE.BoxGeometry(L - 0.04, 0.02, 0.012), latao, 0, sobre + alto, sz * (F / 2 - 0.02));
  return acabar(g, [[P.boutiqueMarmore, marmore()], [P.boutiqueVinho, tramaDeTecido()]]);
}
