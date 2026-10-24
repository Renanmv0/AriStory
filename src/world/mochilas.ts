import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { fundir } from './fundir';

/*
 * AS MOCHILAS — acessório preso no CORPO, com `nasCostas` na ficha (o rig
 * esconde o que a ficha pendura nas costas enquanto elas estão vestidas).
 *
 * Referencial do tronco: y = 0 no chão, +Z é a frente. As duas leem
 * `m.porBaixo` — a roupa de baixo, medida pelo rig (o moletom do Renan e o
 * vestido rodado entram nela) — para o corpo da mochila encostar nas costas
 * da roupa e as alças passarem por fora no peito.
 *
 * Técnica (threejs-geometry): a ALÇA é uma `BufferGeometry` própria — uma
 * fita acolchoada de seção arredondada correndo por uma curva que passa por
 * cima do ombro —, o corpo da mochila do Renan é um retângulo de quina
 * redonda extrudado com chanfro e ESTUFADO vértice a vértice, e o casco da
 * Josefina é uma cúpula elíptica com as placas pousadas na normal dela. Tudo
 * termina em `fundir()`: os pedaços da mesma cor viram uma malha só.
 */

/** O tronco do rig e a roupa de baixo, no que a mochila precisa saber. */
function medirTronco(m: MedidasCorpo) {
  const R = m.h * 0.105 * m.w;
  const ACHATA = 0.82;
  /** o centro das duas meias-esferas da cápsula do tronco */
  const yBaixo = m.legH + m.torsoH * 0.27;
  const yCima = m.legH + m.torsoH * 0.77;
  /** o raio da cápsula na altura `y` (encolhe nas meias-esferas) */
  const raioNaAltura = (y: number): number => {
    const d = y > yCima ? y - yCima : y < yBaixo ? yBaixo - y : 0;
    return Math.sqrt(Math.max(0, R * R - d * d));
  };
  /**
   * A distância do eixo até a superfície (do corpo OU da roupa de baixo) no
   * ponto `x` da largura, atrás (`lado = -1`) ou na frente (`lado = 1`).
   * Devolve o `z` dessa superfície.
   */
  const superficie = (y: number, x: number, lado: -1 | 1): number => {
    const r = raioNaAltura(y);
    const corpoZ = Math.abs(x) < r ? ACHATA * Math.sqrt(r * r - x * x) : 0;
    let z = corpoZ;
    if (m.porBaixo) {
      const ang = Math.atan2(x, lado * Math.max(corpoZ, 1e-4));
      const d = m.porBaixo(ang, y);
      if (d > 0) z = Math.max(z, Math.sqrt(Math.max(0, d * d - x * x)));
    }
    return lado * z;
  };
  /** o alto do ombro no ponto `x` da largura (a meia-esfera de cima) */
  const ombro = (x: number): number => yCima + Math.sqrt(Math.max(0, R * R - x * x));
  return { R, superficie, ombro };
}

/**
 * UMA ALÇA ACOLCHOADA: a fita de seção arredondada (uma superelipse, chata e
 * de quina mole) correndo pela curva `pontos`. A largura cresce no meio — é
 * onde fica a espuma, em cima do ombro — e afina nas pontas.
 *
 * O "lado" da fita é o X do corpo projetado fora da tangente: a alça corre
 * quase num plano YZ (das costas, por cima do ombro, até o peito), então a
 * fita fica sempre deitada no ombro, sem torcer.
 */
function alcaAcolchoada(pontos: THREE.Vector3[], largura: number, espessura: number, segmentos = 30): THREE.BufferGeometry {
  const curva = new THREE.CatmullRomCurve3(pontos, false, 'centripetal');
  const VOLTA = 12;
  const posicoes: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  const lado = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i <= segmentos; i++) {
    const u = i / segmentos;
    curva.getPointAt(u, p);
    curva.getTangentAt(u, t);
    lado.set(1, 0, 0).addScaledVector(t, -t.x).normalize();
    n.crossVectors(lado, t).normalize();
    const meio = 0.78 + 0.3 * Math.sin(Math.PI * u);
    const L = largura * meio * 0.5;
    const E = espessura * (0.7 + 0.45 * Math.sin(Math.PI * u)) * 0.5;
    for (let k = 0; k < VOLTA; k++) {
      const a = (k / VOLTA) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const cx = Math.sign(c) * Math.pow(Math.abs(c), 0.45) * L;
      const sy = Math.sign(s) * Math.pow(Math.abs(s), 0.7) * E;
      posicoes.push(p.x + lado.x * cx + n.x * sy, p.y + lado.y * cx + n.y * sy, p.z + lado.z * cx + n.z * sy);
    }
  }
  for (let i = 0; i < segmentos; i++) {
    for (let k = 0; k < VOLTA; k++) {
      const a = i * VOLTA + k;
      const b = i * VOLTA + ((k + 1) % VOLTA);
      const c = a + VOLTA;
      const d = b + VOLTA;
      // (a, c, b) e (b, c, d): a normal sai para FORA da fita
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * O CAMINHO DE UMA ALÇA, de `x` na largura: sai das costas na altura
 * `yCostas`, sobe rente à roupa, passa por cima do ombro e desce pelo peito
 * até `yPeito`. `folga` é meia espessura da fita (o que fica fora do pano).
 */
function caminhoDaAlca(m: MedidasCorpo, x: number, yCostas: number, yPeito: number, folga: number, zCostas?: number): THREE.Vector3[] {
  const t = medirTronco(m);
  const yOmbro = t.ombro(x);
  const atras = (y: number) => t.superficie(y, x, -1) - folga;
  const frente = (y: number) => t.superficie(y, x * 1.06, 1) + folga;
  const yQuase = yOmbro - m.h * 0.03;
  return [
    new THREE.Vector3(x * 0.96, yCostas, zCostas ?? atras(yCostas)),
    new THREE.Vector3(x, (yCostas + yQuase) / 2, atras((yCostas + yQuase) / 2)),
    new THREE.Vector3(x, yQuase, atras(yQuase)),
    new THREE.Vector3(x, yOmbro + folga, 0),
    new THREE.Vector3(x * 1.03, yQuase, frente(yQuase)),
    new THREE.Vector3(x * 1.08, (yQuase + yPeito) / 2, frente((yQuase + yPeito) / 2)),
    new THREE.Vector3(x * 1.12, yPeito, frente(yPeito)),
  ];
}

/** um retângulo de quinas redondas (as de cima podem ser mais redondas) */
function formaRedonda(largura: number, altura: number, rCima: number, rBaixo: number): THREE.Shape {
  const x0 = -largura / 2;
  const x1 = largura / 2;
  const y0 = -altura / 2;
  const y1 = altura / 2;
  const s = new THREE.Shape();
  s.moveTo(x0 + rBaixo, y0);
  s.lineTo(x1 - rBaixo, y0);
  s.quadraticCurveTo(x1, y0, x1, y0 + rBaixo);
  s.lineTo(x1, y1 - rCima);
  s.quadraticCurveTo(x1, y1, x1 - rCima, y1);
  s.lineTo(x0 + rCima, y1);
  s.quadraticCurveTo(x0, y1, x0, y1 - rCima);
  s.lineTo(x0, y0 + rBaixo);
  s.quadraticCurveTo(x0, y0, x0 + rBaixo, y0);
  return s;
}

/**
 * UMA ALMOFADA: a forma extrudada com chanfro largo e a face de FORA
 * estufada (mais no meio, nada na borda), como pano cheio. A face de dentro
 * fica reta em `z = 0` e a estufada cresce para `-Z` (para longe das costas).
 */
function almofada(forma: THREE.Shape, largura: number, altura: number, fundura: number, chanfro: number, estufa: number): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(forma, {
    depth: fundura, bevelEnabled: true, bevelThickness: chanfro, bevelSize: chanfro,
    bevelSegments: 4, curveSegments: 12, steps: 1,
  });
  geo.deleteAttribute('uv');
  geo.deleteAttribute('normal');
  geo = mergeVertices(geo, 1e-6);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const peso = THREE.MathUtils.clamp((z - fundura / 2) / (fundura / 2 + chanfro), 0, 1);
    const bx = Math.max(0, 1 - (2 * x / (largura + chanfro * 2)) ** 2);
    const by = Math.max(0, 1 - (2 * y / (altura + chanfro * 2)) ** 2);
    pos.setZ(i, z + estufa * peso * bx * by);
  }
  geo.computeVertexNormals();
  // de frente para trás: a estufa vai para -Z, e a face reta fica em z = 0
  geo.rotateY(Math.PI);
  geo.translate(0, 0, -chanfro);
  return geo;
}

/** o fundo (z) da face estufada de uma almofada no ponto (x, y) do centro dela */
function fundoDaAlmofada(largura: number, altura: number, fundura: number, chanfro: number, estufa: number, x: number, y: number): number {
  const bx = Math.max(0, 1 - (2 * x / (largura + chanfro * 2)) ** 2);
  const by = Math.max(0, 1 - (2 * y / (altura + chanfro * 2)) ** 2);
  return -(fundura + chanfro * 2 + estufa * bx * by);
}

/** um tubo (zíper, vivo, costura) por uma lista de pontos */
function tubo(pontos: THREE.Vector3[], raio: number, fechado = false): THREE.BufferGeometry {
  const curva = new THREE.CatmullRomCurve3(pontos, fechado, 'centripetal');
  return new THREE.TubeGeometry(curva, Math.max(12, pontos.length * 4), raio, 6, fechado);
}

/** um puxador de zíper pendurado: a argolinha e a plaquinha */
function puxador(h: number, metal: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  const argola = new THREE.Mesh(new THREE.TorusGeometry(h * 0.0035, h * 0.0011, 5, 10), metal);
  argola.rotation.y = Math.PI / 2;
  g.add(argola);
  const placa = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.0026, h * 0.009, 3, 8), metal);
  placa.scale.z = 0.45;
  placa.position.y = -h * 0.009;
  g.add(placa);
  return g;
}

// ===================================================== A MOCHILA DO RENAN

/**
 * A MOCHILA DO RENAN — a preta de sempre, que deixou de ser parte da ficha
 * dele (pedido do Renan: o modelo padrão fica só com a camiseta cinza e o
 * moletom preto por cima) e virou acessório do guarda-roupa, para os dois.
 *
 * O corpo é uma almofada de quina redonda (mais redonda em cima), estufada,
 * com o bolso da frente — outra almofada menor, com a plaquinha —, o zíper
 * principal contornando o alto e o do bolso, cada um com o seu puxador; a
 * alça de mão em cima; as duas alças acolchoadas por cima dos ombros, com a
 * fivela e a pontinha de fita no peito, e a alça de peito ligando as duas.
 *
 * `cor` é o pano (corpo e alças) e `corDetalhe` o vivo: os zíperes, a
 * plaquinha, a alça de mão e a de peito — os dois se pintam no ateliê. O
 * metal dos puxadores e da fivela fica.
 */
export function mochilaDoRenan(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const t = medirTronco(m);
  const pano = toon(peca?.cor ?? P.mochilaDoRenan);
  const vivo = toon(peca?.corDetalhe ?? P.mochilaDoRenanVivo);
  const metal = toon(P.mochilaDoRenanMetal, { glow: 0.12 });

  const L = h * 0.165 * w;
  const A = h * 0.19;
  const F = h * 0.05;
  const CH = h * 0.014;
  const ESTUFA = h * 0.018;
  const yMeio = m.legH + m.torsoH * 0.55;
  const yTopo = yMeio + A / 2 + CH;
  // encosta nas costas da roupa de baixo: o ponto mais saliente no centro
  let costas = 0;
  for (const k of [-0.5, -0.25, 0, 0.25, 0.5]) costas = Math.min(costas, t.superficie(yMeio + k * A, 0, -1));
  const zDentro = costas - h * 0.004;

  const corpoDaMochila = new THREE.Mesh(almofada(formaRedonda(L, A, L * 0.42, L * 0.2), L, A, F, CH, ESTUFA), pano);
  corpoDaMochila.position.set(0, yMeio, zDentro);
  g.add(corpoDaMochila);
  const fundo = (x: number, y: number) => zDentro + fundoDaAlmofada(L, A, F, CH, ESTUFA, x, y - yMeio);

  // o BOLSO DA FRENTE: almofada menor, mais baixa, pousada no pano estufado
  const LB = L * 0.74;
  const AB = A * 0.42;
  const FB = h * 0.012;
  const yBolso = yMeio - A * 0.2;
  const zBolso = fundo(0, yBolso) + h * 0.004;
  const bolso = new THREE.Mesh(almofada(formaRedonda(LB, AB, LB * 0.3, LB * 0.22), LB, AB, FB, h * 0.006, h * 0.006), pano);
  bolso.position.set(0, yBolso, zBolso);
  g.add(bolso);
  const fundoDoBolso = (x: number, y: number) => zBolso + fundoDaAlmofada(LB, AB, FB, h * 0.006, h * 0.006, x, y - yBolso);
  // o zíper do bolso: um arco raso de ponta a ponta, perto do alto
  const yZiperBolso = yBolso + AB * 0.3;
  const ziperBolso: THREE.Vector3[] = [];
  for (let i = 0; i <= 8; i++) {
    const x = (-0.42 + (i / 8) * 0.84) * LB;
    ziperBolso.push(new THREE.Vector3(x, yZiperBolso + Math.cos((x / LB) * Math.PI) * AB * 0.05, fundoDoBolso(x, yZiperBolso) - h * 0.0015));
  }
  g.add(new THREE.Mesh(tubo(ziperBolso, h * 0.0022), vivo));
  const pxBolso = puxador(h, metal);
  pxBolso.position.copy(ziperBolso[7]).add(new THREE.Vector3(0, -h * 0.002, -h * 0.002));
  g.add(pxBolso);
  // a plaquinha de couro no bolso, com as duas costuras
  const placa = new THREE.Mesh(new THREE.BoxGeometry(LB * 0.3, AB * 0.26, h * 0.003), vivo);
  placa.position.set(0, yBolso - AB * 0.12, fundoDoBolso(0, yBolso - AB * 0.12) - h * 0.0012);
  g.add(placa);

  // o ZÍPER PRINCIPAL: contorna o alto do corpo pela costura do meio, de um
  // lado ao outro, um fio por fora do pano
  const forma = formaRedonda(L + CH * 2, A + CH * 2, L * 0.42 + CH, L * 0.2 + CH);
  // a forma nasce embaixo e roda anti-horária: o que fica acima do corte já
  // vem em ordem, do lado direito, pelo alto, até o esquerdo
  const ordenado = forma.getSpacedPoints(64).filter((p) => p.y > -A * 0.18);
  const zCostura = zDentro - (F + CH * 2) * 0.6;
  const ziper = ordenado.map((p) => new THREE.Vector3(p.x * 1.005, yMeio + p.y * 1.005, zCostura));
  g.add(new THREE.Mesh(tubo(ziper, h * 0.0028), vivo));
  for (const ponta of [ziper[3], ziper[ziper.length - 4]]) {
    const px = puxador(h, metal);
    px.position.copy(ponta).add(new THREE.Vector3(0, -h * 0.003, -h * 0.003));
    g.add(px);
  }

  // a ALÇA DE MÃO em cima: uma meia-argola de fita
  const alcaDeMao = new THREE.Mesh(new THREE.TorusGeometry(L * 0.14, h * 0.0045, 6, 14, Math.PI), vivo);
  alcaDeMao.scale.z = 0.5;
  alcaDeMao.position.set(0, yTopo - h * 0.002, zDentro - (F + CH * 2) * 0.3);
  g.add(alcaDeMao);

  // as ALÇAS: saem do alto das costas, sobem pelo ombro e descem no peito
  const X = Math.max(h * 0.048, L * 0.3);
  const yPeito = m.legH + m.torsoH * 0.5;
  const largura = h * 0.034;
  const espessura = h * 0.011;
  const pontasDoPeito: THREE.Vector3[] = [];
  for (const lado of [-1, 1] as const) {
    const pontos = caminhoDaAlca(m, lado * X, yTopo - A * 0.12, yPeito, espessura * 0.5, zDentro - h * 0.004);
    g.add(new THREE.Mesh(alcaAcolchoada(pontos, largura, espessura), pano));
    const fim = pontos[pontos.length - 1];
    pontasDoPeito.push(fim);
    // a fivela no fim da espuma e a fita que sobra, pendurada
    const fivela = new THREE.Mesh(new THREE.BoxGeometry(largura * 0.8, h * 0.008, h * 0.004), metal);
    fivela.position.set(fim.x, fim.y - h * 0.004, fim.z + h * 0.002);
    g.add(fivela);
    const fita = new THREE.Mesh(new THREE.BoxGeometry(largura * 0.55, h * 0.04, h * 0.0025), pano);
    fita.position.set(fim.x * 1.02, fim.y - h * 0.026, fim.z + h * 0.0015);
    fita.rotation.x = 0.12;
    g.add(fita);
  }
  // a ALÇA DE PEITO: a fita fina de uma alça à outra, com o fecho no meio
  const yAlcaPeito = m.legH + m.torsoH * 0.66;
  const zPeito = t.superficie(yAlcaPeito, 0, 1) + h * 0.006;
  const xFita = pontasDoPeito[1].x * 0.98;
  const fitaDePeito = new THREE.Mesh(new THREE.BoxGeometry(xFita * 2, h * 0.007, h * 0.0025), vivo);
  fitaDePeito.position.set(0, yAlcaPeito, Math.max(zPeito, t.superficie(yAlcaPeito, xFita, 1) + espessura * 0.9));
  g.add(fitaDePeito);
  const fecho = new THREE.Mesh(new THREE.BoxGeometry(h * 0.016, h * 0.011, h * 0.004), metal);
  fecho.position.set(0, yAlcaPeito, fitaDePeito.position.z + h * 0.002);
  g.add(fecho);

  return fundir(g);
}

// ============================================ A MOCHILA CASCO DA JOSEFINA

/**
 * A MOCHILA CASCO DA JOSEFINA — o casco de tartaruga gordinho PARA O LADO,
 * com o aro claro em volta (o jeito dela, que o Renan pediu para manter),
 * agora com o casco de verdade:
 *
 * - a CÚPULA é um elipsoide mais largo que alto, e as PLACAS (os escudos)
 *   pousam na normal dela — a do meio, o anel de seis em volta e as
 *   marginais miúdas perto da borda —, cada uma com o miolo mais claro dos
 *   anéis de crescimento; o vão escuro entre elas é a própria cúpula;
 * - o ARO é uma rosca gorda da cor da barriga, com a borda recortada em
 *   ondinhas, e um fundo (o plastrão) fechando o vão até a cúpula;
 * - os quatro PEZINHOS gordos saindo de baixo do aro, com as unhinhas, e o
 *   rabinho embaixo;
 * - o LAÇO rosa dela (de alça, nó e duas pontas) no alto;
 * - as alças acolchoadas por cima dos ombros, com a fivelinha redonda.
 *
 * `cor` são as placas e `corDetalhe` o laço; o vão entre as placas e as
 * alças são o casco um tom abaixo (na cor de sempre, o `tartarugaEscudo`).
 */
export function mochilaCascoDaJosefina(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const t = medirTronco(m);
  const R = t.R;
  // na altura das OMOPLATAS, e não no meio do tronco: mochila baixa, vista de
  // trás, ficava escondida atrás das mãos balançando
  const y = m.legH + m.torsoH * 0.64;

  const corPlaca = peca?.cor ?? P.tartarugaCasco;
  const corVao = corPlaca === P.tartarugaCasco
    ? P.tartarugaEscudo
    : new THREE.Color(corPlaca).multiplyScalar(0.77).getHex();
  const placa = toon(corPlaca);
  const miolo = toon(new THREE.Color(corPlaca).offsetHSL(0, 0.02, 0.07).getHex());
  const vao = toon(corVao);
  const barriga = toon(P.tartarugaBarriga);
  const pele = toon(P.tartarugaPele);

  // as medidas do casco: a cúpula é gordinha para o lado (mais larga que
  // alta) e o aro, quase redondo, fica um tanto maior que ela
  const A = R * 1.2; // meia-largura da cúpula
  const B = R * 0.86; // meia-altura
  const D = R * 1.0; // o quanto ela sai das costas
  const ARO_X = R * 1.3;
  const ARO_Y = R * 1.12;

  // encosta nas costas da roupa de baixo, pela parte mais saliente: o meio
  // da cúpula e o contorno do aro (que, embaixo, abraça o moletom pelos lados)
  let base = 0;
  for (const k of [-1, -0.5, 0, 0.5, 1]) {
    for (const x of [0, A * 0.5]) base = Math.min(base, t.superficie(y + k * B, x, -1) - h * 0.006);
  }
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    base = Math.min(base, t.superficie(y + Math.sin(a) * ARO_Y, Math.cos(a) * ARO_X, -1) - R * 0.15);
  }

  // o FUNDO (plastrão): um prato raso da cor da barriga fechando o aro
  const ABRE = Math.PI * 0.22;
  const fundura = R * 0.25;
  const prato = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, ABRE), barriga);
  prato.rotation.x = -Math.PI / 2;
  // a borda do prato (raio sen(ABRE) da esfera) chega no aro
  prato.scale.set(ARO_X / Math.sin(ABRE), fundura, ARO_Y / Math.sin(ABRE));
  prato.position.set(0, y, base + R * 0.03 + fundura * Math.cos(ABRE));
  g.add(prato);

  // a CÚPULA: o vão escuro entre as placas
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), vao);
  cupula.rotation.x = -Math.PI / 2;
  cupula.scale.set(A, D, B);
  cupula.position.set(0, y, base);
  g.add(cupula);

  /** o ponto da cúpula (θ = 0 no alto do casco, π/2 na borda) e a normal dele */
  const naCupula = (theta: number, phi: number) => {
    const s = Math.sin(theta);
    const p = new THREE.Vector3(A * s * Math.cos(phi), y + B * s * Math.sin(phi), base - D * Math.cos(theta));
    const n = new THREE.Vector3((p.x) / (A * A), (p.y - y) / (B * B), (p.z - base) / (D * D)).normalize();
    return { p, n };
  };
  /** uma placa hexagonal (chanfrada) com o miolo claro, deitada na cúpula */
  const porPlaca = (theta: number, phi: number, raio: number, giro = 0) => {
    const { p, n } = naCupula(theta, phi);
    const g2 = new THREE.Group();
    const casca = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.84, raio, R * 0.07, 6), placa);
    casca.rotation.y = giro;
    g2.add(casca);
    const dentro = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.44, raio * 0.54, R * 0.03, 6), miolo);
    dentro.position.y = R * 0.04;
    dentro.rotation.y = giro;
    g2.add(dentro);
    g2.position.copy(p).addScaledVector(n, R * 0.012);
    g2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    g.add(g2);
  };
  // a do meio, o anel de seis e as marginais
  porPlaca(0, 0, R * 0.3, Math.PI / 6);
  for (let k = 0; k < 6; k++) porPlaca(0.78, (k / 6) * Math.PI * 2 + Math.PI / 6, R * 0.29);
  for (let k = 0; k < 12; k++) porPlaca(1.28, (k / 12) * Math.PI * 2, R * 0.17, Math.PI / 6);

  // o ARO: a rosca gorda em volta, e a borda recortada em ondinhas
  const aro = new THREE.Mesh(new THREE.TorusGeometry(1, 0.09, 10, 40), barriga);
  aro.scale.set(ARO_X, ARO_Y, R * 1.1);
  aro.position.set(0, y, base + R * 0.02);
  g.add(aro);
  for (let k = 0; k < 22; k++) {
    const a = (k / 22) * Math.PI * 2;
    const onda = new THREE.Mesh(new THREE.SphereGeometry(R * 0.11, 8, 6), barriga);
    onda.scale.set(1, 1, 0.75);
    onda.position.set(Math.cos(a) * ARO_X * 1.06, y + Math.sin(a) * ARO_Y * 1.06, base + R * 0.04);
    g.add(onda);
  }

  // os PEZINHOS: quatro patinhas gordas saindo de baixo do aro, nas diagonais,
  // com três unhinhas cada; e o rabinho embaixo
  for (const [a, comp] of [[0.62, 1], [Math.PI - 0.62, 1], [-0.72, 0.85], [Math.PI + 0.72, 0.85]] as const) {
    const pe = new THREE.Group();
    const perna = new THREE.Mesh(new THREE.SphereGeometry(R * 0.2, 12, 8), pele);
    perna.scale.set(1.25 * comp, 0.85, 0.7);
    pe.add(perna);
    for (const u of [-1, 0, 1]) {
      const unha = new THREE.Mesh(new THREE.SphereGeometry(R * 0.045, 6, 5), barriga);
      unha.position.set(R * 0.2 * 1.15 * comp, u * R * 0.075, R * 0.04);
      pe.add(unha);
    }
    pe.position.set(Math.cos(a) * ARO_X * 1.12, y + Math.sin(a) * ARO_Y * 1.08, base + R * 0.1);
    pe.rotation.z = a;
    g.add(pe);
  }
  const rabo = new THREE.Mesh(new THREE.ConeGeometry(R * 0.09, R * 0.28, 8), pele);
  rabo.rotation.z = Math.PI;
  rabo.position.set(0, y - ARO_Y * 1.18, base + R * 0.08);
  g.add(rabo);

  // o LAÇO dela no alto do aro: duas alças, o nó e as duas pontinhas
  const corLaco = toon(peca?.corDetalhe ?? P.lacoDaJosefina);
  const laco = new THREE.Group();
  for (const lado of [-1, 1] as const) {
    const alca = new THREE.Mesh(new THREE.SphereGeometry(h * 0.017, 12, 8), corLaco);
    alca.scale.set(1.25, 0.8, 0.55);
    alca.position.set(lado * h * 0.018, h * 0.002, 0);
    alca.rotation.z = lado * 0.3;
    laco.add(alca);
    const ponta = new THREE.Mesh(new THREE.BoxGeometry(h * 0.009, h * 0.022, h * 0.004), corLaco);
    ponta.position.set(lado * h * 0.008, -h * 0.014, -h * 0.002);
    ponta.rotation.z = lado * 0.35;
    laco.add(ponta);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(h * 0.008, 10, 8), corLaco);
  no.position.z = -h * 0.004;
  laco.add(no);
  laco.position.set(0, y + ARO_Y * 1.12, base - R * 0.12);
  laco.rotation.x = 0.25;
  g.add(laco);

  // as ALÇAS: das costas, por cima do ombro, até o peito, com a fivelinha
  // redonda da cor da barriga
  const X = Math.max(h * 0.048, R * 0.5);
  const espessura = h * 0.01;
  const yPeito = m.legH + m.torsoH * 0.55;
  for (const lado of [-1, 1] as const) {
    const pontos = caminhoDaAlca(m, lado * X, y + B * 0.6, yPeito, espessura * 0.5, base - R * 0.03);
    g.add(new THREE.Mesh(alcaAcolchoada(pontos, h * 0.03, espessura), vao));
    const fim = pontos[pontos.length - 1];
    const fivela = new THREE.Mesh(new THREE.TorusGeometry(h * 0.007, h * 0.0025, 6, 12), barriga);
    fivela.position.set(fim.x, fim.y + h * 0.004, fim.z + h * 0.003);
    g.add(fivela);
  }

  return fundir(g);
}
