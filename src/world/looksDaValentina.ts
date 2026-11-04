import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { colar } from './roupasDoJardim';
import { emblemaDosGatitos } from './uniformeDosGatitos';
import { novaTextura } from './texturasDeChao';

/**
 * ===================================== O GUARDA-ROUPA DA VALENTINA (o molde)
 *
 * A Valentina é a flamingo italiana do marketing dos Gatitos — a mais vaidosa
 * da escola. O pedido do Renan: "deve ser um modelo no qual seja fácil criar
 * novas roupas, bem detalhadas e bonitas para ela". Por isso a roupa dela não
 * mora dentro do corpo (`entities/bichos/Valentina.ts`): mora AQUI, num kit,
 * e um LOOK é uma ficha de peças.
 *
 * O CORPO É DE FLAMINGO DE VERDADE (o Renan, na primeira versão: "não precisa
 * basear o modelo dela igual dos outros da escola, ela não ficou parecendo um
 * flamingo"): um OVO deitado, com as asas dobradas dos lados; o pescoço
 * comprido em S saindo do alto do peito; a cabeça pequena com o bico dobrado;
 * as pernas compridas. Roupa de ave é roupa de ave: o blazer veste o OVO (o
 * peito é a ponta da frente dele, as costas são o alto), a saia é um TUTU em
 * volta da barriga, o lenço vai na base do pescoço.
 *
 * COMO FAZER UM LOOK NOVO (é só isto):
 *
 * ```ts
 * export const LOOK_DE_GALA: LookDaValentina = {
 *   id: 'gala', nome: 'Vestido de gala',
 *   tronco: (m) => corpete(m, P.algumaCor),   // veste o ovo do corpo
 *   saia: (m) => saiaLonga(m, P.outraCor),    // em volta da barriga
 *   pescoco: (m) => colarDePerolas(m),        // na base do pescoço
 *   cabeca: (m) => tiara(m),                  // no crânio (óculos, chapéu, brinco)
 *   asa: (m, lado) => luvaDeCetim(m, lado),   // na asa (por asa)
 *   pe: (m, lado) => sandalia(m, lado),       // no pé (por perna)
 * };
 * valentina.vestir(LOOK_DE_GALA);
 * ```
 *
 * Cada vaga é uma função que recebe as MEDIDAS do corpo (`MEDIDAS_DA_VALENTINA`)
 * e devolve um `Object3D` NOVO, no referencial da vaga:
 *
 * | vaga      | pendurada em                | a origem é                          |
 * |-----------|-----------------------------|-------------------------------------|
 * | `tronco`  | o ovo do corpo              | o CENTRO do ovo; `+Z` é o peito, `+Y` as costas |
 * | `saia`    | o ovo do corpo              | idem                                |
 * | `pescoco` | a base do pescoço           | a BASE do pescoço; `+Y` sobe pelo pescoço |
 * | `cabeca`  | a cabeça                    | o centro do crânio; `+Z` é o bico    |
 * | `asa`     | a asa (por asa)             | o ombro; a asa corre para `-Z`       |
 * | `pe`      | a canela (por perna)        | o "joelho"; o tornozelo em `-canela` |
 *
 * As medidas são em números de flamingo (o corpo inteiro cresce 1,1 no fim,
 * e a peça vai junto — não precisa saber disso). A
 * esquerda dela é o `x` NEGATIVO (a regra do projeto), e `lado` é -1 na
 * esquerda e 1 na direita.
 *
 * O QUE O CORPO FAZ SOZINHO pelas peças, para o look não se preocupar:
 *
 *  - junta (`fundir`) os pedaços de mesmo material de cada vaga numa malha só;
 *  - liga a sombra em tudo;
 *  - BALANÇA o que pedir: um grupo com NOME e `userData.balanca = { amp, vel }`
 *    (as pontas do lenço, a bolsinha, um pingente) oscila em `rotation.x` em
 *    volta da pose em que nasceu, mais forte andando;
 *  - o PÉ PELADO some quando o look tem `pe` (o sapato toma o lugar dele).
 *
 * O OVO tem raios e um pedaço "por cima" da roupa: `naOvo(direcao, folga)` dá
 * o ponto e a normal da casca em qualquer direção, e `naFrente(x, y)` o ponto
 * do peito — é o que cola botão, broche e lapela sem furar nem boiar.
 */

// ===================================================================== MEDIDAS

export const MEDIDAS_DA_VALENTINA = {
  /** o ovo do corpo: o centro, os raios (x a largura, y a altura, z o comprimento) e a inclinação (a frente sobe) */
  ovo: { y: 0.84, z: 0, rx: 0.145, ry: 0.15, rz: 0.24, inclina: -0.14 },
  /** onde a barriga ganha a saia (no referencial do ovo) */
  cinto: -0.045,
  /** o pivô das pernas (no corpo) */
  quadril: { y: 0.745, x: 0.052, z: -0.01 },
  /** do quadril ao "joelho" (que no flamingo é o tornozelo) e dele ao pé */
  coxa: 0.36,
  canela: 0.35,
  /** a base do pescoço (no corpo) e a pose dele parado: os ângulos de cada gomo, de `+Y` para `+Z` */
  pescoco: { y: 0.955, z: 0.135, gomo: 0.12, raio: 0.041, raioAlto: 0.029, pose: [0.75, 0.15, -0.45, 0.05] },
  /** o crânio (no referencial da cabeça) */
  cabeca: { rx: 0.07, ry: 0.072, rz: 0.084 },
  /** o ombro da asa (no ovo) e o tamanho da asa dobrada */
  ombro: { x: 0.1, y: 0.06, z: 0.11 },
  asa: { comprimento: 0.27, altura: 0.1 },
} as const;

export type MedidasDaValentina = typeof MEDIDAS_DA_VALENTINA;

// ====================================================================== O LOOK

/** uma peça de uma vaga: as medidas entram, um objeto NOVO sai */
type Peca = (m: MedidasDaValentina) => THREE.Object3D | null;
type PecaPorLado = (m: MedidasDaValentina, lado: -1 | 1) => THREE.Object3D | null;

export interface LookDaValentina {
  id: string;
  nome: string;
  tronco?: Peca;
  saia?: Peca;
  pescoco?: Peca;
  cabeca?: Peca;
  asa?: PecaPorLado;
  pe?: PecaPorLado;
}

/** as vagas do look, na ordem em que o corpo as veste */
export const VAGAS_DO_LOOK = ['tronco', 'saia', 'pescoco', 'cabeca', 'asa', 'pe'] as const;
export type VagaDoLook = (typeof VAGAS_DO_LOOK)[number];

// ================================================================== O OVO

/** uma casca de ovo (o corpo, ou uma roupa por cima dele, `escala` vezes maior) */
export class Ovo {
  readonly rx: number;
  readonly ry: number;
  readonly rz: number;
  constructor(m: MedidasDaValentina, readonly escala = 1) {
    this.rx = m.ovo.rx * escala;
    this.ry = m.ovo.ry * escala;
    this.rz = m.ovo.rz * escala;
  }

  /** o ponto da casca na direção `d` (do centro), com `folga` para fora, e a normal ali */
  naOvo(d: THREE.Vector3, folga = 0): { p: THREE.Vector3; n: THREE.Vector3 } {
    const t = 1 / Math.sqrt((d.x / this.rx) ** 2 + (d.y / this.ry) ** 2 + (d.z / this.rz) ** 2);
    const p = d.clone().multiplyScalar(t);
    const n = new THREE.Vector3(p.x / this.rx ** 2, p.y / this.ry ** 2, p.z / this.rz ** 2).normalize();
    return { p: p.addScaledVector(n, folga), n };
  }

  /** o ponto do PEITO (a ponta da frente) na altura `y` e a `x` do meio */
  naFrente(x: number, y: number, folga = 0): { p: THREE.Vector3; n: THREE.Vector3 } {
    const z = this.rz * Math.sqrt(Math.max(0, 1 - (x / this.rx) ** 2 - (y / this.ry) ** 2));
    const n = new THREE.Vector3(x / this.rx ** 2, y / this.ry ** 2, z / this.rz ** 2).normalize();
    return { p: new THREE.Vector3(x, y, z).addScaledVector(n, folga), n };
  }

  /** a volta do ovo na altura `y` (uma elipse no plano XZ): os raios dela */
  voltaEm(y: number): { rx: number; rz: number } {
    const k = Math.sqrt(Math.max(0, 1 - (y / this.ry) ** 2));
    return { rx: this.rx * k, rz: this.rz * k };
  }

  /**
   * A GEOMETRIA da casca, do alto até `ate` (um `y` do ovo: a casca para ali,
   * aberta embaixo). `decote` tira um V do peito: nenhum triângulo com o meio
   * dentro do V fica — `largura` é a meia-abertura no `topo`, e o V fecha em
   * `ponta`. `desde` corta a casca atrás de um `z` (o bolero, que só veste o
   * peito e os ombros).
   */
  geometria(ate = -1, decote?: { ponta: number; topo: number; largura: number }, desde = -Infinity): THREE.BufferGeometry {
    const corte = Math.acos(Math.max(-1, Math.min(1, ate / this.ry)));
    const geo = new THREE.SphereGeometry(1, 56, 32, 0, Math.PI * 2, 0, corte);
    geo.scale(this.rx, this.ry, this.rz);
    if (!decote && desde === -Infinity) return geo;
    const pos = geo.getAttribute('position');
    const idx = geo.getIndex();
    if (!idx) return geo;
    const fica: number[] = [];
    const meia = (y: number): number =>
      !decote || y <= decote.ponta ? -1 : decote.largura * Math.min(1, (y - decote.ponta) / (decote.topo - decote.ponta));
    for (let i = 0; i < idx.count; i += 3) {
      const a = idx.getX(i);
      const b = idx.getX(i + 1);
      const c = idx.getX(i + 2);
      const cx = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3;
      const cy = (pos.getY(a) + pos.getY(b) + pos.getY(c)) / 3;
      const cz = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3;
      if (decote && cz > this.rz * 0.25 && Math.abs(cx) < meia(cy)) continue;
      if (cz < desde) continue;
      fica.push(a, b, c);
    }
    geo.setIndex(fica);
    return geo;
  }
}

/**
 * UMA FITA COLADA NO PEITO do ovo, entre duas bordas (listas de `[x, y]`):
 * a lapela, um galão, uma faixa. Ganha UV (u ao longo, v de uma borda à outra).
 */
export function fitaNoPeito(
  ovo: Ovo, bordaA: ReadonlyArray<readonly [number, number]>, bordaB: ReadonlyArray<readonly [number, number]>, folga: number,
): THREE.BufferGeometry {
  const n = Math.min(bordaA.length, bordaB.length);
  const pos: number[] = [];
  const uv: number[] = [];
  const ind: number[] = [];
  for (let i = 0; i < n; i++) {
    for (const [v, borda] of [[0, bordaA], [1, bordaB]] as const) {
      const { p } = ovo.naFrente(borda[i][0], borda[i][1], folga);
      pos.push(p.x, p.y, p.z);
      uv.push(i / (n - 1), v);
    }
    if (i > 0) {
      const a = (i - 1) * 2;
      ind.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(ind);
  geo.computeVertexNormals();
  return geo;
}

/** um cordão (vivo, galão) colado no peito, passando pelos pontos */
export function cordaoNoPeito(ovo: Ovo, pontos: ReadonlyArray<readonly [number, number]>, raio: number, folga: number, cor: number): THREE.Mesh {
  const curva = new THREE.CatmullRomCurve3(pontos.map(([x, y]) => ovo.naFrente(x, y, folga).p));
  return new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(12, pontos.length * 6), raio, 6, false), toon(cor));
}

/**
 * UM ANEL ELÍPTICO deitado (no plano XZ, na altura `y`): o tubo corre por uma
 * elipse de raios `rx` e `rz`. Toro escalado não serve: a escala achata a
 * grossura do tubo junto com a volta.
 */
export function anelEliptico(rx: number, rz: number, y: number, tubo: number, cor: number): THREE.Mesh {
  const n = 64;
  const pontos: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pontos.push(new THREE.Vector3(Math.sin(a) * rx, y, Math.cos(a) * rz));
  }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos, true), n, tubo, 6, true), toon(cor));
}

/** um ARCO elíptico de pé, no plano XY em `z` (a borda de trás do bolero): de `de` a `ate`, 0 = o alto */
export function arcoDePe(rx: number, ry: number, z: number, tubo: number, cor: number, de: number, ate: number): THREE.Mesh {
  const n = 48;
  const pontos: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = de + ((ate - de) * i) / n;
    pontos.push(new THREE.Vector3(Math.sin(a) * rx, Math.cos(a) * ry, z));
  }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), n, tubo, 6, false), toon(cor));
}

/** um ARCO elíptico deitado (no plano XZ, na altura `y`), só do lado da frente de `zMin` para a frente */
export function arcoDeitado(rx: number, rz: number, y: number, tubo: number, cor: number, zMin: number): THREE.Mesh {
  const a = Math.acos(Math.max(-1, Math.min(1, zMin / rz)));
  const n = 48;
  const pontos: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = -a + (2 * a * i) / n;
    pontos.push(new THREE.Vector3(Math.sin(t) * rx, y, Math.cos(t) * rz));
  }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), n, tubo, 6, false), toon(cor));
}

/** multiplica o UV de uma geometria (para a estampa ter o tamanho certo em cada peça) */
export function escalarUV(geo: THREE.BufferGeometry, su: number, sv: number): THREE.BufferGeometry {
  const uv = geo.getAttribute('uv');
  if (uv) for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  return geo;
}

/**
 * Cola uma peça numa superfície pela normal, com o "em cima" da peça virado
 * para `cima` (projetado no plano da superfície). O `colar` de sempre usa o
 * `Y` do mundo, e numa superfície quase deitada (as costas da ave) a letra
 * girava à toa.
 */
export function colarComCima(peca: THREE.Object3D, pai: THREE.Object3D, p: THREE.Vector3, n: THREE.Vector3, cima: THREE.Vector3): void {
  const z = n.clone().normalize();
  const y = cima.clone().addScaledVector(z, -cima.dot(z)).normalize();
  const x = new THREE.Vector3().crossVectors(y, z);
  peca.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  peca.position.copy(p);
  pai.add(peca);
}

// ============================================================= AS TEXTURAS

/**
 * A SEDA DO LENÇO: amarelo dos Gatitos com bolinhas brancas e, de vez em
 * quando, uma patinha azul — estampa de lenço italiano, nas cores do time.
 * Pintada nas cores DE VERDADE (o material entra branco), porque bolinha
 * branca em cima de amarelo não sai de multiplicar.
 */
function sedaDoLenco(): THREE.CanvasTexture {
  return novaTextura('valentina:lenco', 1, (ctx, s) => {
    ctx.fillStyle = '#f2c14a';
    ctx.fillRect(0, 0, s, s);
    const bolinha = (x: number, y: number, r: number, cor: string): void => {
      ctx.fillStyle = cor;
      for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const n = 4;
    const passo = s / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = (i + (j % 2) * 0.5) * passo;
      const y = (j + 0.5) * passo;
      if ((i + j) % 3 === 0) {
        bolinha(x, y + 3, 7, '#3f6fc6');
        for (const [dx, dy] of [[-8, -6], [0, -10], [8, -6]]) bolinha(x + dx, y + dy, 3.6, '#3f6fc6');
      } else {
        bolinha(x, y, 6.5, '#fffaf0');
      }
    }
  }, 128);
}

/**
 * O PLISSADO DA SAIA: o marinho com a sombra de cada prega e, perto da barra,
 * as duas listras amarelas. `u` dá a volta; `v` vai da barra (0) ao cinto (1).
 */
function plissadoDaSaia(pregas: number): THREE.CanvasTexture {
  const tex = novaTextura(`valentina:saia:${pregas}`, 1, (ctx, s) => {
    ctx.fillStyle = '#243f78';
    ctx.fillRect(0, 0, s, s);
    const passo = s / pregas;
    for (let i = 0; i < pregas; i++) {
      const g = ctx.createLinearGradient(i * passo, 0, (i + 1) * passo, 0);
      g.addColorStop(0, 'rgba(255,255,255,0.12)');
      g.addColorStop(0.5, 'rgba(255,255,255,0)');
      g.addColorStop(0.92, 'rgba(10,20,50,0.28)');
      g.addColorStop(1, 'rgba(10,20,50,0.35)');
      ctx.fillStyle = g;
      ctx.fillRect(i * passo, 0, passo, s);
    }
    ctx.fillStyle = '#f2c14a';
    ctx.fillRect(0, s * 0.8, s, s * 0.07);
    ctx.fillRect(0, s * 0.91, s, s * 0.035);
  }, 512);
  tex.repeat.set(1, 1);
  return tex;
}

// ============================================================ AS PEÇAS DO KIT

const AZUL = P.gatitosAzul;
const MARINHO = P.gatitosAzulEscuro;
const AMARELO = P.gatitosAmarelo;
const BRANCO = P.gatitosBranco;
const OURO = P.valentinaOuro;

/**
 * O BLAZER DOS GATITOS, versão de marketing, cortado em BOLERO: veste o peito
 * e os ombros do ovo e para no meio das costas — as costas cor-de-rosa e as
 * asas aparecem (de blazer inteiro, de cima e de trás ela virava um feijão
 * azul, e o flamingo sumia). O DECOTE EM V no peito, por onde sai o pescoço
 * e aparece a blusa branca; a LAPELA marinho com o vivo amarelo dos dois
 * lados do V; o abotoamento DUPLO dourado embaixo do V; o BROCHE dos Gatitos
 * no peito esquerdo; o lencinho amarelo no bolso do direito; e o vivo amarelo
 * correndo pela barra e pela borda de trás do bolero.
 */
export function blazerDosGatitos(m: MedidasDaValentina, cor: number = AZUL, lapela: number = MARINHO): THREE.Object3D {
  const g = new THREE.Group();
  const blazer = new Ovo(m, 1.045);
  const blusa = new Ovo(m, 1.02);
  const DECOTE = { ponta: -0.035, topo: 0.13, largura: 0.06 };
  /** onde o bolero acaba, nas costas (um `z` do ovo) */
  const ATRAS = -0.035;
  g.add(new THREE.Mesh(blusa.geometria(m.cinto + 0.02, undefined, ATRAS + 0.03), toon(BRANCO)));
  g.add(new THREE.Mesh(blazer.geometria(m.cinto, DECOTE, ATRAS), toon(cor, { doubleSide: true })));

  // A LAPELA, dos dois lados do V: a borda de dentro segue o V; a de fora abre
  // para o ombro — fina na ponta, larga em cima
  const N = 12;
  for (const lado of [-1, 1] as const) {
    const dentro: Array<[number, number]> = [];
    const fora: Array<[number, number]> = [];
    for (let i = 0; i < N; i++) {
      const k = i / (N - 1);
      const y = DECOTE.ponta + (DECOTE.topo - DECOTE.ponta) * k;
      const x = DECOTE.largura * k;
      const largura = 0.005 + 0.032 * Math.sin(Math.min(1, k * 1.1) * Math.PI * 0.5);
      dentro.push([lado * Math.max(0, x - 0.006), y]);
      fora.push([lado * (x + largura), y - largura * 0.35]);
    }
    g.add(new THREE.Mesh(fitaNoPeito(blazer, dentro, fora, 0.003), toon(lapela, { doubleSide: true })));
    g.add(cordaoNoPeito(blazer, fora, 0.0025, 0.004, AMARELO));
  }

  // o vivo amarelo: pela barra (a frente da volta do cinto) e pela borda de trás
  const barra = blazer.voltaEm(m.cinto);
  g.add(arcoDeitado(barra.rx + 0.002, barra.rz + 0.002, m.cinto + 0.002, 0.0045, AMARELO, ATRAS));
  const k = Math.sqrt(1 - (ATRAS / blazer.rz) ** 2);
  const alto = Math.acos(Math.max(-1, Math.min(1, m.cinto / (blazer.ry * k))));
  g.add(arcoDePe(blazer.rx * k + 0.002, blazer.ry * k + 0.002, ATRAS, 0.0045, AMARELO, -alto, alto));

  // o ABOTOAMENTO DUPLO: duas colunas de dois botões dourados, embaixo do V
  const ouro = toon(OURO);
  const geoBotao = new THREE.CylinderGeometry(0.009, 0.009, 0.005, 14);
  geoBotao.rotateX(Math.PI / 2);
  const geoAro = new THREE.TorusGeometry(0.0075, 0.0015, 5, 14);
  for (const y of [-0.055, -0.088]) {
    for (const lado of [-1, 1] as const) {
      const botao = new THREE.Group();
      botao.add(new THREE.Mesh(geoBotao, ouro));
      const aro = new THREE.Mesh(geoAro, ouro);
      aro.position.z = 0.0027;
      botao.add(aro);
      const { p, n } = blazer.naFrente(lado * 0.03, y, 0.002);
      colar(botao, g, p.x, p.y, p.z, n.x, n.y, n.z);
    }
  }
  // o BROCHE dos Gatitos no peito esquerdo, com o aro dourado
  const broche = new THREE.Group();
  broche.add(emblemaDosGatitos(0.016));
  broche.add(new THREE.Mesh(new THREE.TorusGeometry(0.0172, 0.002, 5, 20), ouro));
  const b = blazer.naFrente(-0.085, 0.055, 0.002);
  colar(broche, g, b.p.x, b.p.y, b.p.z, b.n.x, b.n.y, b.n.z);
  // o BOLSO do peito direito (o friso) e o lencinho amarelo saindo dele em três pontas
  const bolso = blazer.naFrente(0.085, 0.045, 0.0015);
  const friso = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.0045, 0.003), toon(lapela));
  colar(friso, g, bolso.p.x, bolso.p.y, bolso.p.z, bolso.n.x, bolso.n.y, bolso.n.z);
  const lencinho = new THREE.Shape();
  lencinho.moveTo(-0.015, 0);
  lencinho.lineTo(-0.011, 0.016);
  lencinho.lineTo(-0.005, 0.007);
  lencinho.lineTo(0.001, 0.019);
  lencinho.lineTo(0.007, 0.007);
  lencinho.lineTo(0.013, 0.015);
  lencinho.lineTo(0.015, 0);
  lencinho.closePath();
  const ponta = new THREE.Mesh(new THREE.ExtrudeGeometry(lencinho, { depth: 0.002, bevelEnabled: false }), toon(AMARELO));
  const pp = blazer.naFrente(0.085, 0.048, 0.001);
  colar(ponta, g, pp.p.x, pp.p.y, pp.p.z, pp.n.x, pp.n.y, pp.n.z);
  return g;
}

/**
 * A SAIA PLISSADA, que numa flamingo é um TUTU: pendurada no cinto (a volta
 * do ovo na barriga), abre para fora e cai um palmo, com as PREGAS de
 * verdade (o raio ondula, mais na barra) e a textura do plissado com as duas
 * listras amarelas. As pernas passam por dentro dela.
 */
export function saiaPlissada(m: MedidasDaValentina, pregas = 44): THREE.Object3D {
  const ovo = new Ovo(m, 1.03);
  const volta = ovo.voltaEm(m.cinto);
  // curtinho e quase reto: aberto demais, num corpo comprido, virava abajur
  const ALTO = 0.075;
  const ABRE = 0.016;
  const voltas = pregas * 4;
  const aneis = 6;
  const pos: number[] = [];
  const uv: number[] = [];
  const ind: number[] = [];
  for (let j = 0; j <= aneis; j++) {
    const t = j / aneis;
    const y = m.cinto - ALTO * t;
    for (let i = 0; i <= voltas; i++) {
      const a = (i / voltas) * Math.PI * 2;
      const fase = ((i / voltas) * pregas) % 1;
      const prega = Math.abs(fase - 0.5) * 2;
      const k = 1 + ((ABRE * t) / Math.min(volta.rx, volta.rz)) * 1.4 + (prega - 0.5) * 0.08 * t;
      pos.push(Math.sin(a) * volta.rx * k, y, Math.cos(a) * volta.rz * k);
      uv.push(i / voltas, 1 - t);
    }
  }
  for (let j = 0; j < aneis; j++) {
    for (let i = 0; i < voltas; i++) {
      const a = j * (voltas + 1) + i;
      const b = a + voltas + 1;
      ind.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(ind);
  geo.computeVertexNormals();
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, toon(BRANCO, { doubleSide: true, mapa: plissadoDaSaia(pregas) })));
  // o cós amarelo, no cinto, por cima do vivo do blazer
  g.add(anelEliptico(volta.rx * 1.012, volta.rz * 1.012, m.cinto - 0.004, 0.006, AMARELO));
  return g;
}

/**
 * O LENÇO DE SEDA na base do pescoço: a volta (um toro, com a estampa de
 * bolinha e patinha), o NÓ do lado esquerdo da frente e as DUAS PONTAS caindo
 * pelo peito — num grupo que balança sozinho (`userData.balanca`). Na vaga
 * `pescoco` o `+Y` sobe pelo pescoço e o `+Z` é a frente do pescoço.
 */
export function lencoDeSeda(m: MedidasDaValentina): THREE.Object3D {
  const g = new THREE.Group();
  const seda = toon(BRANCO, { mapa: sedaDoLenco(), doubleSide: true });
  // amarrado um palmo ACIMA da base: rente ao peito, de frente, o anel com a
  // blusa branca dentro lia como um buraco no peito
  const Y = 0.075;
  const R = m.pescoco.raio + 0.002;
  const volta = new THREE.Mesh(escalarUV(new THREE.TorusGeometry(R, 0.011, 10, 36), 4, 1), seda);
  volta.rotation.x = Math.PI / 2;
  volta.position.y = Y;
  g.add(volta);
  // o nó: um botão de seda do lado esquerdo da frente
  const a = -0.55;
  const no = new THREE.Mesh(escalarUV(new THREE.SphereGeometry(0.02, 12, 10), 1.5, 0.75), seda);
  no.scale.set(1.15, 0.95, 0.85);
  no.position.set(Math.sin(a) * (R + 0.01), Y - 0.004, Math.cos(a) * (R + 0.01));
  g.add(no);
  // as pontas: duas lâminas de seda caindo do nó, uma mais longa, abertas em V
  const pontas = new THREE.Group();
  pontas.name = 'balanca:pontas-do-lenco';
  pontas.userData.balanca = { amp: 0.14, vel: 2.3 };
  pontas.position.set(Math.sin(a) * (R + 0.014), Y - 0.01, Math.cos(a) * (R + 0.014));
  pontas.rotation.set(-0.45, a, 0);
  const lamina = (comp: number): THREE.BufferGeometry => {
    const s = new THREE.Shape();
    s.moveTo(-0.011, 0);
    s.quadraticCurveTo(-0.018, -comp * 0.55, -0.008, -comp);
    s.lineTo(0.005, -comp * 0.86);
    s.quadraticCurveTo(0.016, -comp * 0.45, 0.011, 0);
    s.closePath();
    return escalarUV(new THREE.ShapeGeometry(s, 8), 12, 12);
  };
  for (const [comp, gira] of [[0.08, 0.3], [0.064, -0.3]] as const) {
    const p = new THREE.Mesh(lamina(comp), seda);
    p.rotation.z = gira;
    p.position.z = 0.003;
    pontas.add(p);
  }
  g.add(pontas);
  return g;
}

/**
 * OS ÓCULOS DE SOL empurrados para o alto da cabeça (o gesto mais vaidoso que
 * existe): armação GATINHO dourada, as lentes esfumadas e a ponte, deitados
 * no alto do crânio acompanhando a curva.
 */
export function oculosNaCabeca(m: MedidasDaValentina): THREE.Object3D {
  const g = new THREE.Group();
  g.name = 'oculos-na-cabeca';
  const ouro = toon(OURO, { doubleSide: true });
  const lente = toon(P.valentinaLente, { doubleSide: true });
  const e = 0.85;
  const gatinho = (escala: number, lado: -1 | 1): THREE.Shape => {
    const s = new THREE.Shape();
    const k = escala * e;
    const X = (x: number): number => x * lado * k;
    s.moveTo(X(-0.018), 0.004 * k);
    s.quadraticCurveTo(X(-0.02), -0.014 * k, X(-0.002), -0.015 * k);
    s.quadraticCurveTo(X(0.018), -0.015 * k, X(0.021), 0.002 * k);
    s.quadraticCurveTo(X(0.024), 0.012 * k, X(0.027), 0.016 * k);
    s.quadraticCurveTo(X(0.008), 0.014 * k, X(-0.012), 0.012 * k);
    s.quadraticCurveTo(X(-0.018), 0.011 * k, X(-0.018), 0.004 * k);
    return s;
  };
  for (const lado of [-1, 1] as const) {
    const aro = gatinho(1.18, lado);
    aro.holes.push(gatinho(0.92, lado));
    const armacao = new THREE.Mesh(new THREE.ExtrudeGeometry(aro, { depth: 0.004, bevelEnabled: false, curveSegments: 8 }), ouro);
    armacao.position.x = lado * 0.024;
    g.add(armacao);
    const vidro = new THREE.Mesh(new THREE.ShapeGeometry(gatinho(0.92, lado), 8), lente);
    vidro.position.set(lado * 0.024, 0, 0.0015);
    g.add(vidro);
  }
  const ponte = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0016, 5, 10, Math.PI), ouro);
  ponte.position.set(0, 0.004, 0.002);
  g.add(ponte);
  // em cima da testa, deitado para trás pela normal do crânio ali
  const C = m.cabeca;
  const y = C.ry * 0.88;
  const z = C.rz * Math.sqrt(1 - 0.88 ** 2) * 1.02;
  g.position.set(0, y + 0.002, z);
  g.rotation.x = -Math.atan2(y / C.ry ** 2, z / C.rz ** 2);
  return g;
}

/** os BRINCOS DE PÉROLA: o ponto dourado na lateral da cabeça e a pérola pendurada */
export function brincosDePerola(m: MedidasDaValentina): THREE.Object3D {
  const g = new THREE.Group();
  const ouro = toon(OURO);
  const perola = toon(P.valentinaPerola);
  for (const lado of [-1, 1] as const) {
    const x = lado * m.cabeca.rx * 0.97;
    const y = -0.018;
    const z = -0.01;
    const ponto = new THREE.Mesh(new THREE.SphereGeometry(0.0042, 8, 6), ouro);
    ponto.position.set(x, y, z);
    g.add(ponto);
    const argola = new THREE.Mesh(new THREE.TorusGeometry(0.004, 0.0011, 5, 10), ouro);
    argola.position.set(x + lado * 0.0015, y - 0.006, z);
    argola.rotation.y = Math.PI / 2;
    g.add(argola);
    const gota = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 12, 10), perola);
    gota.position.set(x + lado * 0.002, y - 0.017, z);
    gota.scale.set(1, 1.12, 1);
    g.add(gota);
  }
  return g;
}

/** o que vai na cabeça no look dos Gatitos: os óculos e os brincos */
export function cabecaDosGatitos(m: MedidasDaValentina): THREE.Object3D {
  const g = new THREE.Group();
  g.add(oculosNaCabeca(m));
  g.add(brincosDePerola(m));
  return g;
}

/**
 * O PUNHO DO BLAZER na asa: a manga do blazer de uma ave é a faixa azul que
 * abraça a dobra da asa (o "ombro" dela), com o vivo amarelo e um botão
 * dourado — o blazer continua pela asa sem tapar as penas.
 */
export function punhoNaAsa(m: MedidasDaValentina, lado: -1 | 1, cor: number = AZUL): THREE.Object3D {
  const g = new THREE.Group();
  const faixa = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.034, 20, 1, true), toon(cor, { doubleSide: true }));
  faixa.rotation.x = Math.PI / 2;
  faixa.scale.set(0.034, 1, 0.056);
  faixa.position.set(lado * 0.006, -0.012, -0.045);
  g.add(faixa);
  for (const dz of [-0.017, 0.017]) {
    const vivo = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 5, 20), toon(AMARELO));
    vivo.scale.set(0.035, 0.057, 0.06);
    vivo.position.set(lado * 0.006, -0.012, -0.045 + dz);
    g.add(vivo);
  }
  const botao = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 6), toon(OURO));
  botao.position.set(lado * 0.042, -0.012, -0.045);
  g.add(botao);
  void m;
  return g;
}

/**
 * A BOLSINHA ESTRUTURADA pendurada na dobra da asa: o corpo amarelo de quinas
 * arredondadas, a aba azul, o fecho dourado com o mini emblema, e a alça em
 * arco dourada. Do lado de fora da asa, e balançando sozinha.
 */
export function bolsinha(m: MedidasDaValentina, lado: -1 | 1, cor: number = AMARELO, aba: number = AZUL): THREE.Object3D {
  const g = new THREE.Group();
  g.name = 'balanca:bolsinha';
  g.userData.balanca = { amp: 0.1, vel: 2.6 };
  g.position.set(lado * 0.05, -0.02, -0.04);
  const ouro = toon(OURO);
  const corpo = new THREE.Mesh(new RoundedBoxGeometry(0.028, 0.058, 0.074, 2, 0.008), toon(cor));
  corpo.position.set(0, -0.085, 0);
  g.add(corpo);
  const tampa = new THREE.Mesh(new RoundedBoxGeometry(0.032, 0.026, 0.077, 2, 0.007), toon(aba));
  tampa.position.set(0, -0.062, 0);
  g.add(tampa);
  const fecho = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.005, 12), ouro);
  fecho.rotation.z = Math.PI / 2;
  fecho.position.set(lado * 0.017, -0.07, 0);
  g.add(fecho);
  colar(emblemaDosGatitos(0.0055), g, lado * 0.0198, -0.07, 0, lado, 0, 0);
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.0026, 6, 18, Math.PI), ouro);
  alca.rotation.y = Math.PI / 2;
  alca.position.set(0, -0.05, 0);
  g.add(alca);
  void m;
  return g;
}

/** a asa no look dos Gatitos: o punho do blazer nas duas, e a bolsinha na esquerda */
export function asaDosGatitos(m: MedidasDaValentina, lado: -1 | 1): THREE.Object3D {
  const g = new THREE.Group();
  g.add(punhoNaAsa(m, lado));
  if (lado < 0) g.add(bolsinha(m, lado));
  return g;
}

/**
 * O SCARPIN de bico fino no pé de flamingo: a CONCHA do sapato (meia esfera
 * aberta em cima), o PEITO DO PÉ fechado até o bico, o SALTINHO fino atrás
 * com a ponta dourada, a palmilha creme e o LACINHO amarelo. No referencial do
 * "joelho": o tornozelo em `y = -canela`, e o chão 3 cm abaixo dele.
 */
export function scarpin(m: MedidasDaValentina, lado: -1 | 1, cor: number = MARINHO, laco: number = AMARELO): THREE.Object3D {
  const g = new THREE.Group();
  const CHAO = -m.canela - 0.03;
  const sapato = toon(cor, { doubleSide: true });
  const concha = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), sapato);
  concha.scale.set(0.026, 0.028, 0.052);
  concha.rotation.x = Math.PI;
  concha.position.set(0, CHAO + 0.032, 0.016);
  g.add(concha);
  const palmilha = new THREE.Mesh(new THREE.CircleGeometry(1, 16), toon(P.gatitosCreme));
  palmilha.rotation.x = -Math.PI / 2;
  palmilha.scale.set(0.018, 0.037, 1);
  palmilha.position.set(0, CHAO + 0.013, 0.006);
  g.add(palmilha);
  const peito = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), sapato);
  peito.scale.set(0.022, 0.0155, 0.035);
  peito.position.set(0, CHAO + 0.02, 0.043);
  g.add(peito);
  const bico = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.035, 10), sapato);
  bico.rotation.x = Math.PI / 2;
  bico.scale.set(1.45, 1, 0.75);
  bico.position.set(0, CHAO + 0.009, 0.078);
  g.add(bico);
  const salto = new THREE.Mesh(new THREE.CylinderGeometry(0.0072, 0.0042, 0.035, 8), sapato);
  salto.position.set(0, CHAO + 0.0175, -0.022);
  g.add(salto);
  const ponta = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0048, 0.005, 8), toon(OURO));
  ponta.position.set(0, CHAO + 0.0025, -0.022);
  g.add(ponta);
  const matLaco = toon(laco);
  for (const s of [-1, 1] as const) {
    const asa = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.016, 4), matLaco);
    asa.rotation.z = (s * Math.PI) / 2;
    asa.scale.set(1, 1, 0.45);
    asa.position.set(s * 0.008, CHAO + 0.036, 0.05);
    g.add(asa);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.0046, 8, 6), matLaco);
  no.position.set(0, CHAO + 0.036, 0.051);
  g.add(no);
  void lado;
  return g;
}

// ==================================================================== OS LOOKS

/**
 * O LOOK DE SEMPRE: o uniforme dos Gatitos "com vibe super chique" (pedido
 * do Renan). As cores do time — o azul, o marinho, o amarelo e o branco —, e
 * o dourado das joias como o único toque dela.
 */
export const LOOK_GATITOS_CHIQUE: LookDaValentina = {
  id: 'gatitos-chique',
  nome: 'Gatitos chique',
  tronco: (m) => blazerDosGatitos(m),
  saia: (m) => saiaPlissada(m),
  pescoco: (m) => lencoDeSeda(m),
  cabeca: (m) => cabecaDosGatitos(m),
  asa: (m, lado) => asaDosGatitos(m, lado),
  pe: (m, lado) => scarpin(m, lado),
};

/** todos os looks dela, pelo id (a cena e o teste escolhem por aqui) */
export const LOOKS_DA_VALENTINA: Record<string, LookDaValentina> = {
  [LOOK_GATITOS_CHIQUE.id]: LOOK_GATITOS_CHIQUE,
};
