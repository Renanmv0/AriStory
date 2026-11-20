import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PALETTE as P } from '../palette';
import { brilhoEmLote, toon } from '../core/materials';

/**
 * ===================================== A LAVAGEM DO ÔNIBUS (o kit)
 *
 * As peças do Gatito lavando o ônibus escolar dos Gatitos (`eventos/gatitoLavaOOnibus.ts`) e do MUTIRÃO, quando a
 * dupla ajuda (`eventos/mutiraoDaLavagem.ts`): o balde de espuma, a espuma na lataria, as bolhas, a esponja de mão, a
 * pistola e o carrinho da mangueira, a mangueira solta até a mão, o JATO d'água (o fio, as gotas e o respingo onde
 * bate), as gotas soltas (a sacudida do gato molhado), o ARCO-ÍRIS na névoa e os brilhos do ônibus limpinho.
 *
 * O que é de mão nasce na escala de mão chibi (1,4× a de verdade: no tamanho real some entre os dedos).
 */

const sorteio = (semente: number): (() => number) => {
  let s = semente;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
};
/** o balde azul de plástico, com a alça, a espuma transbordando e a esponja reserva boiando */
export function baldeDeEspuma(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balde-de-espuma';
  const plastico = toon(P.baldeDeLavar);
  const perfil = [[0, 0.012], [0.15, 0.012], [0.16, 0.02], [0.185, 0.3], [0.2, 0.31], [0.205, 0.335], [0.19, 0.335], [0.175, 0.31], [0.142, 0.03], [0, 0.03]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(perfil, 24), plastico));
  // os frisos do plástico em volta
  for (const y of [0.11, 0.2]) {
    const friso = new THREE.Mesh(new THREE.TorusGeometry(0.162 + (y - 0.02) * 0.08, 0.006, 5, 24).rotateX(Math.PI / 2), plastico);
    friso.position.y = y;
    g.add(friso);
  }
  // a alça de arame caída para o lado, com o pegador
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.007, 5, 20, Math.PI).rotateY(Math.PI / 2), toon(P.onibusCalota));
  alca.position.y = 0.3;
  alca.rotation.x = -1.1;
  g.add(alca);
  // a espuma: bolotas brancas transbordando (uma malha), e a esponja reserva
  const bolotas: THREE.BufferGeometry[] = [];
  let s = 7;
  const sorte = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 16; i++) {
    const a = sorte() * Math.PI * 2, r = Math.sqrt(sorte()) * 0.15, raio = 0.045 + sorte() * 0.04;
    const b = new THREE.SphereGeometry(raio, 10, 7);
    b.scale(1, 0.7, 1);
    b.translate(Math.cos(a) * r, 0.32 + (0.15 - r) * 0.25 + sorte() * 0.02, Math.sin(a) * r);
    bolotas.push(b);
  }
  // dois escorridos de espuma descendo pela borda
  for (const a of [0.6, 2.4]) {
    const gota = new THREE.CapsuleGeometry(0.022, 0.07, 3, 8);
    gota.translate(Math.cos(a) * 0.2, 0.28, Math.sin(a) * 0.2);
    bolotas.push(gota);
  }
  g.add(new THREE.Mesh(mergeGeometries(bolotas.map((b) => b.index ? b.toNonIndexed() : b).map((b) => { b.deleteAttribute('uv'); return b; })) as THREE.BufferGeometry, toon(P.espumaDeSabao)));
  const reserva = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.05, 0.11), toon(P.esponjaAmarela));
  reserva.position.set(0.05, 0.37, -0.03);
  reserva.rotation.set(0.25, 0.7, -0.15);
  g.add(reserva);
  return g;
}

/**
 * A ESPUMA GRUDADA NA LATARIA: manchas brancas achatadas contra o lado do ônibus, em volta de onde ele esfrega, e
 * escorridos descendo — numa malha só. `face` é o plano do lado (`z`), e a malha fica 1 cm para fora dele.
 */
export function espumaNaLataria(x: number, y: number, face: number): THREE.Mesh {
  const pedacos: THREE.BufferGeometry[] = [];
  let s = 11;
  const sorte = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 22; i++) {
    const a = sorte() * Math.PI * 2, r = Math.sqrt(sorte()) * 0.42;
    const raio = 0.03 + sorte() * 0.05;
    const b = new THREE.SphereGeometry(raio, 9, 6);
    b.scale(1, 0.85, 0.3);
    b.translate(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 0.7, face + 0.008);
    pedacos.push(b);
  }
  // os escorridos: a espuma descendo pela lataria até o friso de baixo
  // (gotas gordas e curtas: fininhas e compridas, de longe liam como palitos soltos no ar)
  for (let i = 0; i < 4; i++) {
    const comp = 0.07 + sorte() * 0.06;
    const gota = new THREE.SphereGeometry(0.03, 8, 6);
    gota.scale(1, comp / 0.03, 0.3);
    gota.translate(x - 0.3 + i * 0.2 + sorte() * 0.06, y - 0.3 - comp * 0.6, face + 0.008);
    pedacos.push(gota);
  }
  return new THREE.Mesh(mergeGeometries(pedacos.map((b) => { b.deleteAttribute('uv'); return b; })) as THREE.BufferGeometry, toon(P.espumaDeSabao));
}

/** AS BOLHAS: um lote que sobe da esponja e do balde, balança e estoura (cresce e some) */
export class BolhasDeSabao {
  readonly malha = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), toon(P.espumaDeSabao, { opacity: 0.5, glow: 0.25 }), 18);
  private readonly bolhas: Array<{ p: THREE.Vector3; vida: number; dura: number; tam: number; fase: number }> = [];
  private readonly m = new THREE.Matrix4();
  private sorte = 3;
  constructor() {
    this.malha.frustumCulled = false;
    this.malha.userData.semSombra = true;
    for (let i = 0; i < 18; i++) this.bolhas.push({ p: new THREE.Vector3(), vida: 99, dura: 1, tam: 0, fase: i });
  }
  private rnd(): number {
    return ((this.sorte = (this.sorte * 16807) % 2147483647) / 2147483647);
  }
  update(dt: number, fontes: THREE.Vector3[]): void {
    this.bolhas.forEach((b, i) => {
      b.vida += dt;
      if (b.vida > b.dura) {
        const f = fontes[i % fontes.length];
        b.p.set(f.x + (this.rnd() - 0.5) * 0.12, f.y + this.rnd() * 0.05, f.z + this.rnd() * 0.1);
        b.vida = 0;
        b.dura = 1.6 + this.rnd() * 2.2;
        b.tam = 0.018 + this.rnd() * 0.03;
        b.fase = this.rnd() * 6;
      }
      const k = b.vida / b.dura;
      b.p.y += dt * (0.16 + b.tam * 2);
      b.p.x += Math.sin(b.vida * 2.4 + b.fase) * dt * 0.08;
      b.p.z += dt * 0.05;
      // nasce pequenininha, cresce, e no fim incha um tico e some (o estouro)
      const tam = b.tam * Math.min(1, k * 5) * (k > 0.92 ? Math.max(0, 1 - (k - 0.92) * 12.5) * 1.3 : 1);
      this.m.makeScale(tam, tam, tam).setPosition(b.p);
      this.malha.setMatrixAt(i, this.m);
    });
    this.malha.instanceMatrix.needsUpdate = true;
  }
}


/**
 * UMA MANCHA DE ESPUMA, no plano `xy` e estufando para o `+z` (a cena a encosta na lataria): bolotas achatadas em
 * volta do meio e dois escorridos. Nasce no meio da origem, para a cena poder crescer e encolher (`scale`) a mancha
 * de quem está esfregando.
 */
export function manchaDeEspuma(semente: number, largura = 0.5, altura = 0.32): THREE.Mesh {
  const sorte = sorteio(semente);
  const pedacos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 16; i++) {
    const a = sorte() * Math.PI * 2, r = Math.sqrt(sorte());
    const raio = 0.03 + sorte() * 0.045;
    const b = new THREE.SphereGeometry(raio, 9, 6);
    b.scale(1, 0.85, 0.3);
    b.translate(Math.cos(a) * r * largura / 2, Math.sin(a) * r * altura / 2, 0);
    pedacos.push(b);
  }
  for (let i = 0; i < 2; i++) {
    const comp = 0.06 + sorte() * 0.05;
    const gota = new THREE.SphereGeometry(0.026, 8, 6);
    gota.scale(1, comp / 0.026, 0.3);
    gota.translate((i - 0.5) * largura * 0.5, -altura / 2 - comp * 0.5, 0);
    pedacos.push(gota);
  }
  return new THREE.Mesh(mergeGeometries(pedacos.map((b) => { b.deleteAttribute('uv'); return b; })) as THREE.BufferGeometry, toon(P.espumaDeSabao));
}

/**
 * A ESPONJA DE MÃO (a reserva do balde, na mão de quem ajuda): amarela, com a fibra verde de esfregar na face da
 * FRENTE (o `+Z` da mão, que a pose de esfregar vira para a lataria) e um tufo de espuma em cima.
 */
export function esponjaDeMao(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'esponja-de-mao';
  const corpo = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.1, 0.07, 2, 0.022), toon(P.esponjaAmarela));
  const fibra = new THREE.Mesh(new RoundedBoxGeometry(0.152, 0.102, 0.022, 2, 0.009), toon(P.esponjaVerde));
  fibra.position.z = 0.04;
  g.add(corpo, fibra);
  for (const [x, y, r] of [[0.03, 0.055, 0.026], [-0.02, 0.06, 0.021], [0.052, 0.045, 0.017], [-0.045, 0.05, 0.016]] as const) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), toon(P.espumaDeSabao));
    b.position.set(x, y, 0.01);
    g.add(b);
  }
  g.position.set(0, -0.03, 0.06);
  const mao = new THREE.Group();
  mao.add(g);
  return mao;
}

/**
 * A PISTOLA DA MANGUEIRA, na mão (o `+Z` é para onde atira): o cabo de borracha, o gatilho, o cano laranja com o
 * anel e o bocal de latão, e o engate embaixo do cabo, onde a mangueira entra. Dois pontos com nome: `ponta` (de
 * onde sai a água) e `engate` (onde a mangueira solta se prende).
 */
export function pistolaDeMangueira(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'pistola-de-mangueira';
  const laranja = toon(P.pistolaDeMangueira);
  const preto = toon(P.onibusEscolarPreto);
  const cabo = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.08, 4, 10), preto);
  cabo.rotation.x = 0.28;
  cabo.position.set(0, -0.02, -0.005);
  const cano = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.03, 0.2, 14).rotateX(Math.PI / 2), laranja);
  cano.position.set(0, 0.045, 0.07);
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.029, 0.007, 6, 16), preto);
  anel.position.set(0, 0.045, 0.125);
  const bocal = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.025, 0.05, 14).rotateX(Math.PI / 2), toon(P.limusineDourado));
  bocal.position.set(0, 0.045, 0.19);
  const gatilho = new THREE.Mesh(new RoundedBoxGeometry(0.014, 0.06, 0.03, 2, 0.006), laranja);
  gatilho.position.set(0, 0.0, 0.035);
  gatilho.rotation.x = -0.25;
  const traseira = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), laranja);
  traseira.position.set(0, 0.045, -0.03);
  const engateMalha = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.035, 12), toon(P.limusineDourado));
  engateMalha.position.set(0, -0.075, -0.018);
  g.add(cabo, cano, anel, bocal, gatilho, traseira, engateMalha);
  const ponta = new THREE.Object3D();
  ponta.name = 'ponta';
  ponta.position.set(0, 0.045, 0.22);
  const engate = new THREE.Object3D();
  engate.name = 'engate';
  engate.position.set(0, -0.095, -0.02);
  g.add(ponta, engate);
  g.scale.setScalar(1.4);
  g.position.set(0, 0.02, 0.03);
  const mao = new THREE.Group();
  mao.add(g);
  return mao;
}

/**
 * O CARRINHO DA MANGUEIRA (fica do lado dos caixotes): duas rodinhas, o cavalete azul dos Gatitos, o tambor com a
 * mangueira verde enrolada em voltas (duas cores, para a volta ler) e a alça. A ponta solta sai pela frente, embaixo
 * (`saida`, um ponto com nome), e na lavagem sem ajuda ela fica deitada no chão, enrolada num caracol.
 */
export function carrinhoDeMangueira(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'carrinho-de-mangueira';
  const azul = toon(P.carrinhoDeMangueira);
  const verde = toon(P.mangueiraVerde);
  const verdeEscuro = toon(P.mangueiraVerdeEscuro);
  const preto = toon(P.onibusEscolarPreto);
  const EIXO = 0.42;
  // o cavalete: dois "A" de tubo, um de cada lado do tambor, e a travessa de baixo
  for (const s of [-1, 1]) {
    for (const z of [-0.2, 0.2]) {
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), azul);
      perna.position.set(s * 0.25, 0.24, z * 0.55);
      perna.rotation.x = -z * 0.9;
      g.add(perna);
    }
    // o cubo do eixo
    const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12).rotateZ(Math.PI / 2), azul);
    cubo.position.set(s * 0.26, EIXO, 0);
    g.add(cubo);
    // a rodinha de trás
    const roda = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.025, 8, 18).rotateY(Math.PI / 2), preto);
    roda.position.set(s * 0.29, 0.09, -0.16);
    g.add(roda);
  }
  const travessa = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8).rotateZ(Math.PI / 2), azul);
  travessa.position.set(0, 0.09, -0.16);
  g.add(travessa);
  // o pé da frente
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.56, 8).rotateZ(Math.PI / 2), azul);
  pe.position.set(0, 0.025, 0.2);
  g.add(pe);
  // o tambor e as voltas da mangueira
  const tambor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.44, 16).rotateZ(Math.PI / 2), azul);
  tambor.position.y = EIXO;
  g.add(tambor);
  for (const s of [-1, 1]) {
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24).rotateZ(Math.PI / 2), azul);
    aba.position.set(s * 0.23, EIXO, 0);
    g.add(aba);
  }
  for (let camada = 0; camada < 3; camada++) {
    for (let i = 0; i < 7; i++) {
      const volta = new THREE.Mesh(new THREE.TorusGeometry(0.125 + camada * 0.034, 0.018, 6, 22).rotateY(Math.PI / 2), (i + camada) % 2 ? verdeEscuro : verde);
      volta.position.set(-0.18 + i * 0.06, EIXO, 0);
      g.add(volta);
    }
  }
  // a alça em cima, com a manopla
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.016, 6, 20, Math.PI).rotateY(Math.PI / 2), azul);
  alca.position.set(0, EIXO + 0.02, -0.04);
  alca.rotation.x = -0.35;
  g.add(alca);
  // a manivela do lado
  const manivela = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.14, 0.03, 2, 0.01), preto);
  manivela.position.set(0.27, EIXO - 0.05, 0);
  g.add(manivela);
  const saida = new THREE.Object3D();
  saida.name = 'saida';
  saida.position.set(0.0, EIXO - 0.22, 0.12);
  g.add(saida);
  return g;
}

/** a ponta da mangueira deitada no chão, enrolada num caracol (quando ninguém está com ela) */
export function mangueiraEnroladaNoChao(): THREE.Mesh {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 60; i++) {
    const a = i / 60 * Math.PI * 4.2;
    const r = 0.06 + a * 0.028;
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0.022, Math.sin(a) * r));
  }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.021, 6), toon(P.mangueiraVerde));
}

/**
 * A MANGUEIRA SOLTA: do carrinho até a mão de quem segura a pistola, deitada no chão no meio do caminho e subindo
 * até o engate. É um tubo refeito a cada quadro pelos pontos (o caminho mexe com o braço), só enquanto aparece.
 */
export class MangueiraSolta {
  readonly malha = new THREE.Mesh(new THREE.BufferGeometry(), toon(P.mangueiraVerde));
  constructor() {
    this.malha.frustumCulled = false;
    this.malha.visible = false;
  }
  /** de `a` (a saída do carrinho) até `b` (o engate da pistola), com o meio deitado no chão */
  esticar(a: THREE.Vector3, b: THREE.Vector3): void {
    const meio = a.clone().lerp(b, 0.5);
    const pe = a.clone().lerp(b, 0.82);
    const pts = [
      a,
      new THREE.Vector3(a.x, 0.04, a.z).lerp(b, 0.12).setY(0.03),
      new THREE.Vector3(meio.x + 0.25, 0.022, meio.z + 0.18),
      new THREE.Vector3(pe.x, 0.022, pe.z),
      new THREE.Vector3(b.x, b.y * 0.45, b.z + 0.05),
      b,
    ];
    const velha = this.malha.geometry;
    this.malha.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), 40, 0.021, 6);
    velha.dispose();
  }
}

/**
 * GOTAS SOLTAS: um lote de gotinhas de água com gravidade — o respingo onde o jato bate, a chuva do jato para o céu
 * e a sacudida do gato molhado. `soltar(ponto, velocidade)` põe uma no ar; elas encolhem no fim da vida e somem no
 * chão.
 */
export class GotasSoltas {
  readonly malha: THREE.InstancedMesh;
  private readonly gotas: Array<{ p: THREE.Vector3; v: THREE.Vector3; vida: number; dura: number; tam: number }> = [];
  private proxima = 0;
  private readonly m = new THREE.Matrix4();
  constructor(quantas = 90) {
    this.malha = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 7, 5), toon(P.jatoAgua, { opacity: 0.85, glow: 0.18 }), quantas);
    this.malha.frustumCulled = false;
    this.malha.userData.semSombra = true;
    for (let i = 0; i < quantas; i++) {
      this.gotas.push({ p: new THREE.Vector3(), v: new THREE.Vector3(), vida: 0, dura: 1, tam: 0 });
      this.malha.setMatrixAt(i, this.m.makeScale(0, 0, 0));
    }
  }
  soltar(ponto: THREE.Vector3, vel: THREE.Vector3, tam = 0.03, dura = 0.7): void {
    const g = this.gotas[this.proxima];
    this.proxima = (this.proxima + 1) % this.gotas.length;
    g.p.copy(ponto);
    g.v.copy(vel);
    g.vida = dura;
    g.dura = dura;
    g.tam = tam;
  }
  update(dt: number): void {
    this.gotas.forEach((g, i) => {
      if (g.vida <= 0) return;
      g.vida -= dt;
      g.v.y -= 9.8 * dt;
      g.p.addScaledVector(g.v, dt);
      const tam = g.vida <= 0 || g.p.y < 0.01 ? 0 : g.tam * Math.min(1, (g.vida / g.dura) * 3);
      if (tam === 0) g.vida = 0;
      // a gota estica na direção em que cai (a velocidade): fica com cara de pingo, e não de bolinha
      const vel = g.v.length();
      const estica = 1 + Math.min(1.6, vel * 0.18);
      this.m.makeScale(tam, tam * estica, tam).setPosition(g.p);
      this.malha.setMatrixAt(i, this.m);
    });
    this.malha.instanceMatrix.needsUpdate = true;
  }
}

/**
 * O JATO DA MANGUEIRA: da `ponta` da pistola até onde bate, numa curva (a água sai reta e cai um tico): um fio
 * translúcido refeito a cada quadro, as gotas correndo por ele, e o RESPINGO onde bate (na lataria, abrindo para os
 * lados e para cima; ou, apontado para o céu, a chuva caindo em leque — é nela que mora o arco-íris).
 */
export class JatoDeMangueira {
  readonly group = new THREE.Group();
  private readonly fio = new THREE.Mesh(new THREE.BufferGeometry(), toon(P.jatoAgua, { opacity: 0.5, glow: 0.2 }));
  private readonly gotasDoFio: THREE.InstancedMesh;
  readonly respingo = new GotasSoltas(140);
  private readonly origem = new THREE.Vector3();
  private readonly direcao = new THREE.Vector3(0, 0, 1);
  /** onde bate (o fim da curva) */
  readonly alvo = new THREE.Vector3();
  /** a normal de onde bate (a lataria olha para o `+Z`); `null` é o céu: a água cai em chuva */
  normal: THREE.Vector3 | null = new THREE.Vector3(0, 0, 1);
  /** 0 a 1: a pressão (abre e fecha devagar) */
  private forca = 0;
  ligado = false;
  private fase = 0;
  private respingar = 0;
  private readonly curva = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
  private readonly m = new THREE.Matrix4();
  private readonly sorte = sorteio(4242);
  constructor() {
    this.fio.frustumCulled = false;
    this.fio.userData.semSombra = true;
    this.gotasDoFio = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 7, 5), toon(P.jatoAgua, { opacity: 0.85, glow: 0.18 }), 36);
    this.gotasDoFio.frustumCulled = false;
    this.gotasDoFio.userData.semSombra = true;
    this.group.add(this.fio, this.gotasDoFio, this.respingo.malha);
  }
  /** de onde sai e para onde a pistola aponta (a cena lê da `ponta` a cada quadro) */
  apontar(origem: THREE.Vector3, direcao: THREE.Vector3): void {
    this.origem.copy(origem);
    this.direcao.copy(direcao).normalize();
  }
  /** quanto do caminho a água já percorreu (0 a 1): ela leva um instante para chegar ao alvo quando liga */
  get chegou(): boolean {
    return this.forca > 0.85;
  }
  update(dt: number): void {
    this.forca += ((this.ligado ? 1 : 0) - this.forca) * Math.min(1, dt * (this.ligado ? 3.5 : 6));
    this.fase += dt * 2.6;
    const visivel = this.forca > 0.02;
    this.fio.visible = this.gotasDoFio.visible = visivel;
    // a curva: sai na direção da pistola, e cai até o alvo; com pouca pressão, ela encurta e despenca perto do bico
    const d = this.origem.distanceTo(this.alvo);
    const fim = this.origem.clone().lerp(this.alvo, Math.max(0.05, this.forca));
    fim.y -= (1 - this.forca) * 0.6;
    this.curva.v0.copy(this.origem);
    this.curva.v1.copy(this.origem).addScaledVector(this.direcao, d * 0.5 * this.forca).add(new THREE.Vector3(0, d * 0.12 * this.forca, 0));
    this.curva.v2.copy(fim);
    if (visivel) {
      const velha = this.fio.geometry;
      this.fio.geometry = new THREE.TubeGeometry(this.curva, 24, 0.02 + 0.012 * this.forca, 6);
      velha.dispose();
      const p = new THREE.Vector3();
      for (let i = 0; i < 36; i++) {
        const t = (this.fase + i / 36) % 1;
        this.curva.getPoint(t, p);
        // as gotas se soltam do fio: mais longe do bico, mais espalhadas e maiores
        const solto = t * t * 0.09;
        p.x += Math.sin(i * 12.9 + this.fase * 3) * solto;
        p.y += Math.cos(i * 7.3 + this.fase * 2.1) * solto;
        const tam = (0.018 + 0.016 * t) * this.forca;
        this.m.makeScale(tam, tam, tam).setPosition(p);
        this.gotasDoFio.setMatrixAt(i, this.m);
      }
      this.gotasDoFio.instanceMatrix.needsUpdate = true;
    }
    // o respingo: com a água chegando, um punhado de gotas por quadro, onde bate
    if (this.chegou && this.ligado) {
      this.respingar += dt * (this.normal ? 70 : 90);
      while (this.respingar >= 1) {
        this.respingar -= 1;
        const r = this.sorte, ponto = this.alvo.clone();
        if (this.normal) {
          const n = this.normal;
          const v = n.clone().multiplyScalar(0.6 + r() * 1.3).add(new THREE.Vector3((r() - 0.5) * 2.6, 0.4 + r() * 1.8, 0));
          ponto.addScaledVector(n, 0.03);
          this.respingo.soltar(ponto, v, 0.018 + r() * 0.022, 0.5 + r() * 0.3);
        } else {
          // a chuva: espalha em leque ao redor do ponto mais alto e cai devagar (a névoa onde aparece o arco-íris)
          const a = r() * Math.PI * 2, rr = r() * 1.6;
          ponto.add(new THREE.Vector3(Math.cos(a) * rr, (r() - 0.5) * 0.3, Math.sin(a) * rr * 0.5));
          this.respingo.soltar(ponto, new THREE.Vector3(Math.cos(a) * 0.4, 0.2 + r() * 0.6, Math.sin(a) * 0.2), 0.016 + r() * 0.016, 1.4);
        }
      }
    }
    this.respingo.update(dt);
  }
}

/**
 * O ARCO-ÍRIS na névoa da mangueira: uma fita em arco com as seis cores da paleta (cada faixa com a borda viva:
 * os vértices são duplicados na emenda), translúcida e de dois lados. Ele ENTRA DESENHANDO, de uma ponta à outra
 * (`mostrar(k)`, o `drawRange` andando pela fita), e sai encolhendo.
 */
export class ArcoIrisNaNevoa {
  readonly malha: THREE.Mesh;
  private readonly porPasso: number;
  private readonly passos = 64;
  constructor(raio = 2.6, largura = 0.46) {
    const cores = [P.arcoIris1, P.arcoIris2, P.arcoIris3, P.arcoIris4, P.arcoIris5, P.arcoIris6].map((c) => new THREE.Color(c));
    const faixa = largura / cores.length;
    const pos: number[] = [], cor: number[] = [], idx: number[] = [];
    // por passo do arco: as seis faixas, cada uma com os seus dois vértices de dentro e de fora
    for (let i = 0; i <= this.passos; i++) {
      const a = Math.PI * (1 - i / this.passos);
      for (let f = 0; f < cores.length; f++) {
        for (const r of [raio - f * faixa, raio - (f + 1) * faixa]) {
          pos.push(Math.cos(a) * r, Math.sin(a) * r, 0);
          cor.push(cores[f].r, cores[f].g, cores[f].b);
        }
      }
    }
    const porLinha = cores.length * 2;
    for (let i = 0; i < this.passos; i++) {
      for (let f = 0; f < cores.length; f++) {
        const a = i * porLinha + f * 2, b = a + 1, c = a + porLinha, d = b + porLinha;
        idx.push(a, b, c, b, d, c);
      }
    }
    this.porPasso = cores.length * 6;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cor, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    this.malha = new THREE.Mesh(geo, toon(0xffffff, { corPorVertice: true, opacity: 0.55, doubleSide: true }));
    this.malha.userData.semSombra = true;
    this.malha.renderOrder = 6;
    this.mostrar(0);
  }
  /** 0 a 1: quanto do arco já está desenhado, da ponta da esquerda para a da direita */
  mostrar(k: number): void {
    const n = Math.round(THREE.MathUtils.clamp(k, 0, 1) * this.passos);
    this.malha.geometry.setDrawRange(0, n * this.porPasso);
    this.malha.visible = n > 0;
  }
}

/**
 * OS BRILHOS do ônibus limpinho: estrelinhas de luz pintada (o `brilhoEmLote`) piscando na lataria lavada, cada uma
 * no seu tempo. `acender(pontos)` põe onde brilham; `apagar` some com todas.
 */
export class BrilhosDeLimpo {
  readonly malha: THREE.InstancedMesh;
  private pontos: THREE.Vector3[] = [];
  private tempo = 0;
  private forca = 0;
  private alvo = 0;
  private readonly m = new THREE.Matrix4();
  constructor(private readonly quantos = 24) {
    this.malha = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.metalWhite, 0.95), quantos);
    this.malha.frustumCulled = false;
    this.malha.userData.semSombra = true;
    this.malha.renderOrder = 7;
    for (let i = 0; i < quantos; i++) this.malha.setMatrixAt(i, this.m.makeScale(0, 0, 0));
  }
  acender(pontos: THREE.Vector3[]): void {
    this.pontos = pontos.slice(0, this.quantos);
    this.alvo = 1;
  }
  apagar(): void {
    this.alvo = 0;
  }
  update(dt: number): void {
    this.tempo += dt;
    this.forca += (this.alvo - this.forca) * Math.min(1, dt * 2.5);
    for (let i = 0; i < this.quantos; i++) {
      const p = this.pontos[i];
      // cada uma pisca no seu ritmo: uma estrelinha acende rápido e apaga devagar
      const pisca = p ? Math.max(0, Math.sin(this.tempo * (2.2 + (i % 5) * 0.45) + i * 1.7)) ** 3 : 0;
      const tam = (0.14 + (i % 3) * 0.06) * pisca * this.forca;
      this.m.makeScale(tam, tam, tam);
      if (p) this.m.setPosition(p);
      this.malha.setMatrixAt(i, this.m);
    }
    this.malha.instanceMatrix.needsUpdate = true;
  }
}
