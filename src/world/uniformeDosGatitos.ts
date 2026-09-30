import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { camisetaLarga, colar, corpo, mangaLarga } from './roupasDoJardim';
import { anelNoCalcao, camadaDeSola, formaDaSola, noCalcao, pe, short } from './roupasDePiscina';

/**
 * O UNIFORME DOS GATITOS — o prêmio do fim da lição 3 da apostila do Gatito.
 *
 * Pedido do Renan: "o uniforme inteiro", nas cores do time dos Gatitos, com
 * cara de coisa que a atlética de uma escola venderia — boné estilizado, uma
 * camiseta justa e uma LARGA, uma jaquetona, short, calça e tênis —, "muito
 * detalhados".
 *
 * A LINGUAGEM DAS SETE PEÇAS, para elas lerem como um conjunto:
 * - o azul e o amarelo da Luna (as cores que Brasil e Venezuela dividem), o
 *   azul-marinho da ribana e o branco do couro e da sola (`gatitos*` na
 *   paleta);
 * - o EMBLEMA DOS GATITOS em todas: o disco amarelo com o aro e o "G" azuis e
 *   duas ORELHINHAS DE GATO saindo do alto (`emblemaDosGatitos`) — é o que faz
 *   a peça ser do time e não uma camiseta azul qualquer;
 * - "GATITOS" escrito em ARCO, de letra grossa de time (`textoEmArco`), nas
 *   costas da jaquetona e no peito das camisetas.
 *
 * O REFERENCIAL é o de cada vaga (skill `aristory-roupa`):
 *
 * | vaga / campo                  | y = 0 fica em          |
 * |-------------------------------|------------------------|
 * | `tronco`, `extraQuadril`      | o CHÃO                 |
 * | `pernas`, `pes` (`extra`)     | o quadril (por perna)  |
 * | `extraBraco`                  | o ombro (por braço)    |
 * | `cabeca`                      | o centro do crânio     |
 *
 * E a pegadinha de sempre: a perna e o braço ESQUERDOS nascem em `x`
 * negativo. Tudo o que vai "para fora" (a faixa do short, a listra da calça,
 * o remendo da manga) multiplica pelo `lado`.
 */

const AZUL = P.gatitosAzul;
const MARINHO = P.gatitosAzulEscuro;
const AMARELO = P.gatitosAmarelo;
const BRANCO = P.gatitosBranco;

/** um tom mais escuro da mesma cor (costura, pesponto) */
const escuro = (cor: number, quanto = 0.78): number => new THREE.Color(cor).multiplyScalar(quanto).getHex();

// ================================================================ as letras

/**
 * UMA LETRA, pintada num canvas (a textura desenhada em tempo de execução é a
 * única que o projeto aceita). O desenho é BRANCO e a cor sai do material —
 * o `toon` multiplica o mapa pela cor —, então o mesmo "G" serve em qualquer
 * cor. `contorno` desenha a letra engordada por um traço: é a camada de trás
 * da letra de time (a "chenille" com a borda de outra cor).
 *
 * Guardadas por letra: a mesma textura serve a toda peça vestida.
 */
const GLIFOS = new Map<string, THREE.CanvasTexture>();
function glifo(ch: string, contorno = false): THREE.CanvasTexture {
  const chave = `${ch}|${contorno ? 1 : 0}`;
  const pronto = GLIFOS.get(chave);
  if (pronto) return pronto;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = '900 100px "Arial Black", "Arial", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineJoin = 'round';
    // um traço por fora engrossa a letra (a de time é gorda, e a fonte de
    // sistema do navegador nem sempre tem peso 900); o contorno engrossa mais
    ctx.lineWidth = contorno ? 24 : 7;
    ctx.strokeText(ch, 64, 70);
    ctx.fillText(ch, 64, 70);
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  GLIFOS.set(chave, textura);
  return textura;
}

/**
 * A malha de uma letra: um quadrado de `alto` de lado, olhando para `+Z`.
 * O `alphaTest` recorta o fundo transparente do canvas — sem ele o quadrado
 * inteiro sairia pintado. Material de toon (e não chapado): a letra pega a
 * mesma luz da roupa e não "acende" na sombra.
 */
function letra(ch: string, alto: number, cor: number, contorno = false): THREE.Mesh {
  const mat = toon(cor, { mapa: glifo(ch, contorno) });
  mat.alphaTest = 0.5;
  return new THREE.Mesh(new THREE.PlaneGeometry(alto, alto), mat);
}

interface Arco {
  /** o raio da superfície (a cápsula ou o casco) e o achatamento dela em z */
  raio: number;
  achata: number;
  /** a altura do meio da palavra */
  y: number;
  /** nas costas (lida por quem está atrás) em vez de no peito */
  costas?: boolean;
  /** o ângulo entre uma letra e a seguinte, em radianos */
  passo: number;
  /** quanto as pontas descem (o arco), por letra² a partir do meio */
  curva: number;
  /** quanto cada letra tomba para acompanhar o arco, por letra */
  inclina: number;
  alto: number;
  cor: number;
  /** a borda da letra, de outra cor (a letra de time) */
  contorno?: number;
}

/**
 * UMA PALAVRA EM ARCO numa superfície de revolução: uma letra por vez, cada
 * uma colada na casca e virada para fora (`colar`), com as pontas descendo e
 * tombando — o "GATITOS" de camiseta de time. Letra por letra, e não uma
 * placa só: uma placa reta num tronco redondo enterra as pontas.
 *
 * Nas COSTAS quem lê está atrás, olhando para `+Z`: a esquerda dele é o `+X`,
 * e a primeira letra tem de ficar lá. O ângulo parte de `PI` e SOBE com a
 * letra (`PI + k·passo`, com `k` negativo no começo da palavra) — a primeira
 * versão descia e escreveu "SOTITAG" nas costas da jaquetona.
 */
function textoEmArco(pai: THREE.Object3D, texto: string, a: Arco): void {
  // cada letra anda a SUA largura (o "I" é estreito): o passo é o de uma letra
  // cheia, e as outras ocupam a fração dele
  const largura = (ch: string): number => (ch === 'I' ? 0.5 : 1);
  const larguras = [...texto].map(largura);
  const total = larguras.reduce((x, y) => x + y, 0);
  let andou = -total / 2;
  for (let i = 0; i < texto.length; i++) {
    const k = andou + larguras[i] / 2;
    andou += larguras[i];
    const ang = a.costas ? Math.PI + k * a.passo : k * a.passo;
    const x = Math.sin(ang) * a.raio;
    const z = Math.cos(ang) * a.raio * a.achata;
    const y = a.y - a.curva * k * k;
    const peca = new THREE.Group();
    if (a.contorno !== undefined) peca.add(letra(texto[i], a.alto * 1.12, a.contorno, true));
    const frente = letra(texto[i], a.alto, a.cor);
    frente.position.z = a.alto * 0.02;
    peca.add(frente);
    // a normal da elipse, e não a do círculo: no tronco achatado a letra de
    // canto ficaria de viés
    colar(peca, pai, x, y, z, Math.sin(ang), 0, Math.cos(ang) / a.achata);
    peca.rotateZ(-k * a.inclina);
  }
}

// =============================================================== o emblema

/**
 * O EMBLEMA DOS GATITOS, olhando para `+Z` com as costas em `z = 0`, e `e`
 * de raio. Disco amarelo, o aro e o "G" azuis, e as duas ORELHINHAS DE GATO
 * saindo do alto do disco, cada uma com o miolo azul — o time é de gatos.
 *
 * O "G" é GEOMETRIA (um toro aberto, a barra e o pé), e não letra de canvas:
 * é a marca, e ela aparece pequena no boné, no tênis e na manga, onde uma
 * textura de 128 px viraria borrão.
 */
function emblemaDosGatitos(e: number, fundo: number = AMARELO, tinta: number = AZUL): THREE.Group {
  const g = new THREE.Group();
  const matFundo = toon(fundo);
  const matTinta = toon(tinta);
  const esp = e * 0.16;

  const disco = new THREE.Mesh(new THREE.CylinderGeometry(e, e, esp, 32), matFundo);
  disco.rotation.x = Math.PI / 2;
  disco.position.z = esp / 2;
  g.add(disco);

  // as orelhinhas: um triângulo de base no alto do disco, ponta para fora. A
  // da esquerda é a da direita espelhada (escala -1 em x), e por isso o
  // material é de dupla face: o espelho vira o avesso do polígono
  const orelha = new THREE.Shape();
  const naBorda = (a: number, raio: number): [number, number] => [Math.cos(a) * e * raio, Math.sin(a) * e * raio];
  orelha.moveTo(...naBorda(0.7, 0.96));
  orelha.lineTo(...naBorda(0.98, 1.52));
  orelha.lineTo(...naBorda(1.42, 0.96));
  orelha.closePath();
  const miolo = new THREE.Shape();
  miolo.moveTo(...naBorda(0.84, 1.08));
  miolo.lineTo(...naBorda(0.99, 1.38));
  miolo.lineTo(...naBorda(1.24, 1.06));
  miolo.closePath();
  const geoOrelha = new THREE.ExtrudeGeometry(orelha, { depth: esp, bevelEnabled: false });
  const geoMiolo = new THREE.ExtrudeGeometry(miolo, { depth: esp * 0.3, bevelEnabled: false });
  for (const lado of [-1, 1] as const) {
    const o = new THREE.Mesh(geoOrelha, toon(fundo, { doubleSide: true }));
    o.scale.x = lado;
    g.add(o);
    const m = new THREE.Mesh(geoMiolo, toon(tinta, { doubleSide: true }));
    m.scale.x = lado;
    m.position.z = esp;
    g.add(m);
  }

  // o aro, rente à borda
  const aro = new THREE.Mesh(new THREE.TorusGeometry(e * 0.87, e * 0.06, 6, 36), matTinta);
  aro.position.z = esp;
  g.add(aro);

  // O "G": o arco começa no alto à direita (45°) e dá a volta pela esquerda até
  // um pouco abaixo do meio, à direita; a barra entra do lado e o pé desce até
  // o fim do arco
  const arco = new THREE.Mesh(new THREE.TorusGeometry(e * 0.48, e * 0.1, 8, 30, Math.PI * 1.62), matTinta);
  arco.rotation.z = Math.PI / 4;
  arco.position.z = esp;
  g.add(arco);
  const barra = new THREE.Mesh(new THREE.BoxGeometry(e * 0.36, e * 0.17, e * 0.16), matTinta);
  barra.position.set(e * 0.3, -e * 0.01, esp);
  g.add(barra);
  const pe = new THREE.Mesh(new THREE.BoxGeometry(e * 0.17, e * 0.26, e * 0.16), matTinta);
  pe.position.set(e * 0.405, -e * 0.13, esp);
  g.add(pe);
  return g;
}

/**
 * O "G" BORDADO da jaquetona: o mesmo desenho do emblema, grosso, com uma
 * borda de outra cor por trás — a letra de feltro de jaqueta de atlética.
 */
function letraG(e: number, cor: number, borda: number): THREE.Group {
  const g = new THREE.Group();
  const camada = (grossura: number, mat: THREE.Material, z: number): void => {
    const arco = new THREE.Mesh(new THREE.TorusGeometry(e * 0.62, e * grossura, 8, 34, Math.PI * 1.62), mat);
    arco.rotation.z = Math.PI / 4;
    arco.position.z = z;
    arco.scale.z = 0.5;
    g.add(arco);
    const barra = new THREE.Mesh(new THREE.BoxGeometry(e * 0.46, e * grossura * 1.7, e * grossura), mat);
    barra.position.set(e * 0.38, -e * 0.01, z);
    g.add(barra);
    const pe = new THREE.Mesh(new THREE.BoxGeometry(e * grossura * 1.7, e * 0.36, e * grossura), mat);
    pe.position.set(e * 0.53, -e * 0.17, z);
    g.add(pe);
  };
  camada(0.22, toon(borda), 0);
  camada(0.14, toon(cor), e * 0.06);
  return g;
}

/**
 * UMA PATINHA DE GATO, olhando para `+Z`, com `e` de meia-largura: a almofada
 * grande embaixo e os quatro dedinhos em arco — o carimbo das costas.
 */
function patinha(e: number, cor: number): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  const almofada = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), mat);
  almofada.scale.set(e * 0.95, e * 0.78, e * 0.18);
  almofada.position.y = -e * 0.25;
  g.add(almofada);
  for (const [x, y, r] of [[-0.86, 0.6, 0.3], [-0.32, 1.02, 0.32], [0.32, 1.02, 0.32], [0.86, 0.6, 0.3]] as const) {
    const dedo = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mat);
    dedo.scale.set(e * r, e * r * 1.15, e * 0.16);
    dedo.position.set(e * x, e * y, 0);
    dedo.rotation.z = -x * 0.35;
    g.add(dedo);
  }
  return g;
}

/** uma estrelinha de cinco pontas deitada no plano XY, olhando para `+Z` */
function estrela(raio: number, cor: number): THREE.Mesh {
  const f = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i / 10) * Math.PI * 2;
    const r = i % 2 ? raio * 0.45 : raio;
    if (i === 0) f.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else f.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  f.closePath();
  return new THREE.Mesh(new THREE.ExtrudeGeometry(f, { depth: raio * 0.25, bevelEnabled: false }), toon(cor));
}

// ================================================================= o boné

/**
 * O BONÉ DOS GATITOS: seis gomos azuis, a aba amarela, o botão no alto, o
 * emblema na testa — e, por ser dos Gatitos, DUAS ORELHINHAS DE GATO em cima.
 *
 * Pousa em cima do cabelo de quem veste (a conta do chapéu joaninha): a base
 * é o alto MEDIDO do cabelo (`m.cabelo(0)`) menos um tanto. Nos cachos do Ari
 * o cabelo sobra em volta da copa; no cabelo curto do Renan a copa assenta
 * rente. Sem `cobreCabelo`: boné não some com o cabelo de ninguém.
 */
function boneDosGatitos(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const azul = peca?.cor ?? AZUL;
  const amarelo = peca?.corDetalhe ?? AMARELO;
  const BORDA = m.cabelo(0) - r * 0.2;
  const RAIO = r * 0.9;
  const ALTO = 0.72;
  const bone = new THREE.Group();
  // tombado para a frente: a aba desce um tico sobre a testa
  bone.rotation.x = 0.1;
  g.add(bone);

  const copa = new THREE.Mesh(new THREE.SphereGeometry(RAIO, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), toon(azul));
  copa.position.y = BORDA;
  copa.scale.y = ALTO;
  bone.add(copa);
  // a faixa de baixo da copa, um fio mais larga: o que segura o boné
  const faixa = new THREE.Mesh(new THREE.CylinderGeometry(RAIO * 1.005, RAIO * 1.01, r * 0.07, 24, 1, true), toon(azul, { doubleSide: true }));
  faixa.position.y = BORDA - r * 0.02;
  bone.add(faixa);

  // OS SEIS GOMOS: uma fatia finíssima da mesma esfera, um pouco maior, em
  // cada costura — é o "boné de verdade" de perto
  const costura = toon(MARINHO);
  for (let k = 0; k < 6; k++) {
    const fatia = new THREE.Mesh(
      new THREE.SphereGeometry(RAIO * 1.012, 2, 10, (k * Math.PI) / 3 - 0.012, 0.024, 0, Math.PI * 0.52),
      costura,
    );
    fatia.position.y = BORDA;
    fatia.scale.y = ALTO;
    bone.add(fatia);
    // o ilhós do gomo: um furinho bordado a meia altura
    const a = (k * Math.PI) / 3 + Math.PI / 6;
    const polar = 0.62;
    const ilhos = new THREE.Mesh(new THREE.SphereGeometry(r * 0.028, 8, 6), toon(P.gatitosIlhos));
    ilhos.position.set(
      Math.sin(polar) * Math.sin(a) * RAIO * 1.005,
      BORDA + Math.cos(polar) * RAIO * ALTO,
      Math.sin(polar) * Math.cos(a) * RAIO * 1.005,
    );
    ilhos.scale.setScalar(0.9);
    // o da frente fica debaixo do emblema; o de trás, debaixo da regulagem
    if (Math.abs(Math.cos(a)) < 0.9) bone.add(ilhos);
  }
  // o botão do alto
  const botao = new THREE.Mesh(new THREE.SphereGeometry(r * 0.075, 10, 8), toon(amarelo));
  botao.scale.y = 0.6;
  botao.position.y = BORDA + RAIO * ALTO + r * 0.01;
  bone.add(botao);

  // A ABA: meia calota achatada, só na frente. A fatia de `phi` 0 a PI da
  // esfera do three já é a metade de `z` positivo — girar em Y (como no boné da
  // Gina) manda a aba para o lado
  const aba = new THREE.Mesh(new THREE.SphereGeometry(RAIO * 0.97, 18, 8, 0, Math.PI, 0, Math.PI / 2), toon(amarelo));
  aba.scale.set(1.08, 0.07, 1.34);
  // um tico para a frente: a aba sobra na testa, e dos lados quase some
  aba.position.set(0, BORDA - r * 0.06, RAIO * 0.12);
  bone.add(aba);
  // o pesponto da aba: dois arcos brancos acompanhando a borda
  const topoDaAba = BORDA - r * 0.06;
  for (const [k, sobe] of [[0.86, 0.034], [0.74, 0.046]] as const) {
    const linha = new THREE.Mesh(new THREE.TorusGeometry(1, r * 0.011, 4, 30, Math.PI), toon(BRANCO));
    linha.rotation.x = Math.PI / 2;
    linha.scale.set(RAIO * 0.97 * 1.08 * k, RAIO * 0.97 * 1.34 * k, 1);
    linha.position.set(0, topoDaAba + r * sobe, RAIO * 0.12);
    bone.add(linha);
  }

  // O EMBLEMA NA TESTA: colado no gomo da frente, virado para fora da copa
  const polarFrente = 1.08;
  const yE = BORDA + Math.cos(polarFrente) * RAIO * ALTO;
  const zE = Math.sin(polarFrente) * RAIO * 1.01;
  colar(emblemaDosGatitos(r * 0.19, amarelo, azul), bone, 0, yE, zE, 0, Math.cos(polarFrente) / ALTO, Math.sin(polarFrente));

  // AS ORELHINHAS DE GATO: em cima, dos dois lados, um tico para a frente —
  // triângulo azul com o miolo amarelo, cada uma virada para a diagonal
  const orelha = new THREE.Shape();
  orelha.moveTo(-r * 0.25, 0);
  orelha.quadraticCurveTo(-r * 0.07, r * 0.22, 0, r * 0.46);
  orelha.quadraticCurveTo(r * 0.07, r * 0.22, r * 0.25, 0);
  orelha.closePath();
  const miolo = new THREE.Shape();
  miolo.moveTo(-r * 0.14, r * 0.05);
  miolo.quadraticCurveTo(-r * 0.04, r * 0.19, 0, r * 0.35);
  miolo.quadraticCurveTo(r * 0.04, r * 0.19, r * 0.14, r * 0.05);
  miolo.closePath();
  const geoOrelha = new THREE.ExtrudeGeometry(orelha, {
    depth: r * 0.06, bevelEnabled: true, bevelThickness: r * 0.02, bevelSize: r * 0.02, bevelSegments: 2,
  });
  geoOrelha.translate(0, 0, -r * 0.03);
  const geoMiolo = new THREE.ExtrudeGeometry(miolo, { depth: r * 0.02, bevelEnabled: false });
  for (const lado of [-1, 1] as const) {
    const polar = 0.62;
    const a = lado * 0.78;
    const pivo = new THREE.Group();
    pivo.position.set(
      Math.sin(polar) * Math.sin(a) * RAIO * 0.96,
      BORDA + Math.cos(polar) * RAIO * ALTO - r * 0.04,
      Math.sin(polar) * Math.cos(a) * RAIO * 0.96,
    );
    pivo.rotation.y = a * 0.7;
    pivo.rotation.z = -lado * 0.32;
    bone.add(pivo);
    pivo.add(new THREE.Mesh(geoOrelha, toon(azul)));
    const dentro = new THREE.Mesh(geoMiolo, toon(amarelo));
    dentro.position.z = r * 0.05;
    pivo.add(dentro);
  }

  // A REGULAGEM de trás: o arco da abertura e a fivelinha amarela
  const abertura = new THREE.Mesh(new THREE.TorusGeometry(r * 0.2, r * 0.025, 5, 16, Math.PI), toon(MARINHO));
  abertura.position.set(0, BORDA - r * 0.04, -RAIO * 1.0);
  bone.add(abertura);
  const fivela = new THREE.Mesh(new THREE.BoxGeometry(r * 0.16, r * 0.07, r * 0.03), toon(amarelo));
  fivela.position.set(0, BORDA - r * 0.03, -RAIO * 1.02);
  bone.add(fivela);
  return g;
}

// ======================================================== a camiseta justa

/** o raio da cápsula do tronco do rig numa altura `y` (a partir do chão) */
function raioDoTronco(m: MedidasCorpo, y: number): number {
  const r = corpo(m).raioTorso;
  const baixo = m.legH + m.torsoH * 0.27;
  const cima = m.legH + m.torsoH * 0.77;
  const d = y < baixo ? baixo - y : y > cima ? y - cima : 0;
  return Math.sqrt(Math.max(0, r * r - d * d));
}

/**
 * A CAMISETA DOS GATITOS, a JUSTA: pinta o tronco do rig de azul (a `cor` da
 * ficha) e acrescenta o que faz dela camiseta de time — a gola careca
 * amarela ("ringer"), a barra amarela, o "GATITOS" em arco no peito com o
 * emblema embaixo, e na manga (`mangaDaCamisetaDosGatitos`) o punho amarelo
 * com o filete branco e o emblema pequeno no braço esquerdo.
 *
 * Nada de casca por cima: é a cápsula do rig que veste, então as peças se
 * colam nela — a conta do raio em cada altura é `raioDoTronco`.
 */
function camisetaDosGatitos(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpo(m);
  const r = c.raioTorso;
  const hipY = m.legH;
  const amarelo = toon(AMARELO);

  // a gola careca: o anel amarelo por baixo do queixo, tombado para a frente
  // (a de trás fica sob o crânio, que é maior que o tronco)
  const gola = new THREE.Mesh(new THREE.TorusGeometry(r * 0.64, h * 0.0085, 6, 26), amarelo);
  gola.rotation.x = Math.PI / 2 - 0.3;
  gola.position.set(0, hipY + m.torsoH * 0.9 + h * 0.012, r * 0.2);
  g.add(gola);

  // a barra: uma faixa amarela na cintura, colada na curva da cápsula
  const y0 = hipY + h * 0.006;
  const y1 = hipY + h * 0.02;
  const barra = new THREE.Mesh(
    new THREE.CylinderGeometry(raioDoTronco(m, y1) * 1.03, raioDoTronco(m, y0) * 1.03, y1 - y0, 26, 1, true),
    toon(AMARELO, { doubleSide: true }),
  );
  barra.position.y = (y0 + y1) / 2;
  barra.scale.z = c.ACHATA;
  g.add(barra);

  // o peito: "GATITOS" em arco, e o emblema embaixo
  textoEmArco(g, 'GATITOS', {
    raio: r * 1.012, achata: c.ACHATA, y: hipY + m.torsoH * 0.72,
    passo: 0.15, curva: h * 0.0011, inclina: 0.055, alto: h * 0.021, cor: AMARELO,
  });
  const emblema = emblemaDosGatitos(h * 0.024);
  emblema.position.set(0, hipY + m.torsoH * 0.47, r * c.ACHATA + h * 0.001);
  g.add(emblema);
  // nas costas, a patinha amarela — abaixo do cabelo, que no Ari desce muito
  colar(patinha(h * 0.026, AMARELO), g, 0, hipY + m.torsoH * 0.42, -r * c.ACHATA - h * 0.0015, 0, 0, -1);
  return g;
}

/** a manga da camiseta justa: o punho amarelo, o filete branco, e o emblema no braço esquerdo */
function mangaDaCamisetaDosGatitos(m: MedidasCorpo, lado: -1 | 1 = 1): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const raioManga = h * 0.038 * w;
  // a manga do rig é uma cápsula até `0,41·armLen`: o punho fica na boca dela
  const boca = -m.armLen * 0.41;
  const punho = new THREE.Mesh(new THREE.CylinderGeometry(raioManga * 1.1, raioManga * 1.1, h * 0.014, 16, 1, true), toon(AMARELO, { doubleSide: true }));
  punho.position.y = boca + h * 0.005;
  g.add(punho);
  const filete = new THREE.Mesh(new THREE.CylinderGeometry(raioManga * 1.07, raioManga * 1.07, h * 0.004, 16, 1, true), toon(BRANCO, { doubleSide: true }));
  filete.position.y = boca + h * 0.018;
  g.add(filete);
  if (lado === -1) {
    colar(emblemaDosGatitos(h * 0.011), g, lado * raioManga * 1.02, -m.armLen * 0.2, 0, lado, 0, 0);
  }
  return g;
}

// ======================================================== a camiseta larga

/**
 * A estampa da LARGA: o "GATITOS" azul em arco, o emblema GRANDE e três
 * estrelinhas amarelas embaixo (as três estrelas da apostila — ela é o prêmio
 * de quem terminou a lição 3). E, nas costas, o emblema pequeno na nuca.
 *
 * A casca da larga é um tronco de cone de `1,1·raioTorso` no ombro a `1,2`
 * na barra, achatado em 0,92: o raio em cada altura sai dessa conta.
 */
function estampaDaLargaDosGatitos(m: MedidasCorpo, frenteZ: number, y: number): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const r = corpo(m).raioTorso;
  const ACHATA = 0.92;
  const topo = m.legH + m.torsoH * 0.88;
  const barra = m.legH - h * 0.035;
  const raioEm = (yy: number): number => r * (1.1 + 0.1 * THREE.MathUtils.clamp((topo - yy) / (topo - barra), 0, 1));

  const yTexto = y + h * 0.058;
  textoEmArco(g, 'GATITOS', {
    raio: raioEm(yTexto) * 1.012, achata: ACHATA, y: yTexto,
    passo: 0.148, curva: h * 0.0013, inclina: 0.06, alto: h * 0.024, cor: AZUL, contorno: AMARELO,
  });
  const emblema = emblemaDosGatitos(h * 0.03);
  emblema.position.set(0, y - h * 0.004, frenteZ * 1.0 + h * 0.002);
  g.add(emblema);
  const yEstrelas = y - h * 0.052;
  for (const k of [-1, 0, 1]) {
    const ang = k * 0.2;
    const rr = raioEm(yEstrelas) * 1.01;
    colar(estrela(h * 0.009, AMARELO), g, Math.sin(ang) * rr, yEstrelas - Math.abs(k) * h * 0.004, Math.cos(ang) * rr * ACHATA, Math.sin(ang), 0, Math.cos(ang) / ACHATA);
  }
  // nas costas, o emblema pequeno logo abaixo da nuca, e a patinha azul grande
  const yNuca = topo - h * 0.05;
  colar(emblemaDosGatitos(h * 0.014), g, 0, yNuca, -raioEm(yNuca) * ACHATA * 1.01, 0, 0, -1);
  const yPata = m.legH + m.torsoH * 0.36;
  colar(patinha(h * 0.034, AZUL), g, 0, yPata, -raioEm(yPata) * ACHATA * 1.012, 0, 0, -1);
  return g;
}

const camisetaLargaDosGatitos = camisetaLarga(estampaDaLargaDosGatitos);

/** a manga larga, com uma listra amarela logo acima da dobra azul */
function mangaLargaDosGatitos(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = mangaLarga(m, lado, peca);
  const { h, w } = m;
  const y = -m.armLen * 0.5 + h * 0.03;
  // o tubo da manga larga vai de 0,058 a 0,066·h·w: na altura da listra, ~0,0645
  const listra = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0655 * w, h * 0.0657 * w, h * 0.006, 16, 1, true), toon(AMARELO, { doubleSide: true }));
  listra.position.y = y;
  g.add(listra);
  return g;
}

// =============================================================== a jaquetona

/**
 * A JAQUETONA DOS GATITOS: a jaqueta de atlética ("varsity") — corpo de lã
 * azul, mangas de couro branco, ribana azul-marinho com dois filetes amarelos
 * na gola, no punho e no cós, os botões de pressão dourados na frente, o "G"
 * de feltro amarelo com borda branca no peito esquerdo, o emblema no direito,
 * os bolsos de viés com vivo de couro, e nas costas o "GATITOS" em arco em
 * cima do emblema grande.
 *
 * GRANDE (pedido do Renan), mas com a conta do moletom na cabeça: casco mais
 * gordo que `~1,13·raioTorso` engole o braço colado no corpo e a silhueta vira
 * um bloco. A folga que se vê vem da barra comprida que FRANZE no cós, dos
 * ombros cheios e das mangas mais grossas (`mangaDaJaquetona`), que passam por
 * fora do casco.
 */
function jaquetonaDosGatitos(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const r = corpo(m).raioTorso;
  const hipY = m.legH;
  const ombroY = hipY + m.torsoH * 0.86;
  const topoTorso = hipY + m.torsoH;
  const ACHATA = 0.95;
  const azul = peca?.cor ?? AZUL;
  const matAzul = toon(azul);
  const matAzulDuplo = toon(azul, { doubleSide: true });
  const marinho = toon(MARINHO, { doubleSide: true });
  const amarelo = toon(AMARELO, { doubleSide: true });
  const couro = toon(peca?.corDetalhe ?? BRANCO);

  const RAIO = r * 1.13;
  const RAIO_COS = r * 1.06;
  const BARRA = hipY - h * 0.012;
  const COS = h * 0.032;
  const TOPO = ombroY + m.torsoH * 0.03;
  const frenteZ = RAIO * ACHATA;

  // o casco estufa um tico embaixo, antes de franzir no cós
  const baseDoCasco = BARRA + COS + h * 0.008;
  const casco = new THREE.Mesh(new THREE.CylinderGeometry(RAIO, RAIO * 1.02, TOPO - baseDoCasco, 28), matAzul);
  casco.position.y = (TOPO + baseDoCasco) / 2;
  casco.scale.z = ACHATA;
  g.add(casco);
  const franzido = new THREE.Mesh(new THREE.CylinderGeometry(RAIO * 1.02, RAIO_COS * 1.03, h * 0.008, 28, 1, true), matAzulDuplo);
  franzido.position.y = BARRA + COS + h * 0.004;
  franzido.scale.z = ACHATA;
  g.add(franzido);
  const ombro = new THREE.Mesh(new THREE.SphereGeometry(RAIO, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), matAzul);
  ombro.position.y = TOPO;
  ombro.scale.set(1, 0.42, ACHATA);
  g.add(ombro);

  // --------------------------------------------------------- as ribanas
  /** um anel de ribana marinho com dois filetes amarelos */
  const ribana = (raioCima: number, raioBaixo: number, y0: number, alto: number, achata: number): void => {
    const faixa = new THREE.Mesh(new THREE.CylinderGeometry(raioCima, raioBaixo, alto, 28, 1, true), marinho);
    faixa.position.y = y0 + alto / 2;
    faixa.scale.z = achata;
    g.add(faixa);
    for (const t of [0.34, 0.62]) {
      const raio = THREE.MathUtils.lerp(raioBaixo, raioCima, t) * 1.012;
      const filete = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, alto * 0.13, 28, 1, true), amarelo);
      filete.position.y = y0 + alto * t;
      filete.scale.z = achata;
      g.add(filete);
    }
  };
  // o cós
  ribana(RAIO_COS * 1.03, RAIO_COS, BARRA, COS, ACHATA);
  // A GOLA em pé. Mesma conta do moletom: mais estreita que ~1,7·raioTorso ela
  // nasce inteira atrás do crânio (que é maior que o tronco) e não aparece
  const golaY = topoTorso - h * 0.012;
  ribana(r * 1.72, r * 1.14, golaY, h * 0.052, 0.95);

  // ----------------------------------------------------- a frente e os botões
  const vista = new THREE.Mesh(new THREE.BoxGeometry(h * 0.006, TOPO - BARRA - COS + h * 0.01, h * 0.006), toon(escuro(azul)));
  vista.position.set(0, (TOPO + BARRA + COS) / 2, frenteZ * 0.995);
  g.add(vista);
  const dourado = toon(P.fechoDourado);
  const primeiro = BARRA + COS + h * 0.02;
  const ultimo = golaY - h * 0.006;
  for (let k = 0; k < 5; k++) {
    const y = THREE.MathUtils.lerp(primeiro, ultimo, k / 4);
    const pressao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0058, 10, 8), dourado);
    pressao.scale.z = 0.5;
    // o último fica na gola, que é mais larga: acompanha a curva dela
    const z = y > topoTorso ? r * 1.5 * 0.95 : frenteZ;
    pressao.position.set(0, y, z * 1.002);
    g.add(pressao);
  }

  // ----------------------------------------------------- o peito
  /** um ponto no casco, `x` para o lado, e a normal da elipse ali */
  const noCasco = (x: number, y: number, obj: THREE.Object3D): void => {
    const z = Math.sqrt(Math.max(0, RAIO * RAIO - x * x)) * ACHATA;
    colar(obj, g, x, y, z * 1.005, x / RAIO, 0, z / (RAIO * ACHATA * ACHATA));
  };
  // o "G" de feltro no peito ESQUERDO de quem veste (x negativo)
  noCasco(-r * 0.5, hipY + m.torsoH * 0.6, letraG(h * 0.03, AMARELO, BRANCO));
  // e o emblema no direito
  noCasco(r * 0.52, hipY + m.torsoH * 0.63, emblemaDosGatitos(h * 0.017));

  // os bolsos de viés com o vivo de couro branco (cada um num pivô girado em Y,
  // com a inclinação da boca DENTRO dele — a mesma conta do moletom)
  for (const lado of [-1, 1] as const) {
    const pivo = new THREE.Group();
    pivo.rotation.y = lado * 0.62;
    pivo.scale.z = ACHATA;
    const vivo = new THREE.Mesh(new THREE.BoxGeometry(h * 0.013, h * 0.06, h * 0.012), couro);
    vivo.position.set(0, hipY + m.torsoH * 0.2, RAIO * 1.0);
    vivo.rotation.z = lado * 0.36;
    pivo.add(vivo);
    g.add(pivo);
  }

  // ----------------------------------------------------- as costas
  // mais BAIXO que numa jaqueta de verdade: a juba do Ari desce até o meio das
  // costas, e o "GATITOS" no alto sumia debaixo dela
  textoEmArco(g, 'GATITOS', {
    raio: RAIO * 1.012, achata: ACHATA, y: hipY + m.torsoH * 0.585, costas: true,
    passo: 0.13, curva: h * 0.0015, inclina: 0.07, alto: h * 0.026, cor: AMARELO, contorno: BRANCO,
  });
  colar(emblemaDosGatitos(h * 0.029), g, 0, hipY + m.torsoH * 0.29, -frenteZ * 1.004, 0, 0, -1);
  return g;
}

/**
 * A MANGA DA JAQUETONA: couro branco, mais grossa que a do moletom (a
 * jaquetona é GRANDE), e o punho de ribana marinho com os dois filetes. No
 * braço esquerdo o emblema; no direito uma estrela amarela — os remendos de
 * jaqueta de atlética.
 */
function mangaDaJaquetona(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const ATE = 0.8;
  const couro = peca?.corDetalhe ?? BRANCO;
  const ombro = new THREE.Mesh(new THREE.SphereGeometry(h * 0.066 * w, 14, 10), toon(couro));
  ombro.position.y = -m.armLen * 0.03;
  ombro.scale.set(1, 0.92, 0.95);
  g.add(ombro);
  const tubo = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.064 * w, h * 0.057 * w, m.armLen * ATE, 16, 1, true), toon(couro, { doubleSide: true }));
  tubo.position.y = -m.armLen * ATE * 0.5;
  g.add(tubo);
  // o punho: ribana mais estreita que a boca da manga (franze), com os filetes
  const alto = h * 0.03;
  const y0 = -m.armLen * ATE - h * 0.006;
  const punho = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.053 * w, h * 0.049 * w, alto, 16), toon(MARINHO));
  punho.position.y = y0 - alto / 2 + h * 0.01;
  g.add(punho);
  for (const t of [0.35, 0.65]) {
    const filete = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0525 * w, h * 0.0515 * w, alto * 0.13, 16, 1, true), toon(AMARELO, { doubleSide: true }));
    filete.position.y = y0 - alto + h * 0.01 + alto * (1 - t);
    filete.scale.setScalar(1.012);
    g.add(filete);
  }
  // o remendo do braço, do lado de fora
  const y = -m.armLen * 0.27;
  const raio = THREE.MathUtils.lerp(h * 0.064 * w, h * 0.057 * w, 0.27 / ATE);
  const remendo = lado === -1 ? emblemaDosGatitos(h * 0.015) : estrela(h * 0.016, AMARELO);
  colar(remendo, g, lado * raio * 1.01, y, 0, lado, 0, 0);
  return g;
}

// ================================================================= o short

/**
 * O CÓS DO SHORT DOS GATITOS (no quadril, `extraQuadril`): o elástico marinho
 * com o vivo amarelo, o cordão branco com as ponteiras, e a faixa amarela
 * descendo pelos dois lados do calção.
 *
 * O short é a BERMUDA do rig (`corBanho`, sem `cor`): na rua e no clube ele
 * veste o mesmo calção e as mesmas pernas de shorts, e esta peça e a da perna
 * (`pernaDoShortDosGatitos`) são o que ele tem a mais.
 */
function cosDoShortDosGatitos(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const s = short(m);
  g.add(anelNoCalcao(m, 0.8, 1.0, MARINHO, 1.035));
  g.add(anelNoCalcao(m, 0.76, 0.8, AMARELO, 1.04));
  // a faixa de cada lado: amarela, com os dois vivos brancos
  for (const lado of [-1, 1] as const) {
    const p = noCalcao(m, lado * Math.PI / 2, 0.36, 1.045);
    const faixa = new THREE.Group();
    const alto = s.altura * 0.7;
    const amarela = new THREE.Mesh(new THREE.BoxGeometry(h * 0.014, alto, h * 0.003), toon(AMARELO));
    faixa.add(amarela);
    for (const lx of [-1, 1]) {
      const vivo = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0028, alto, h * 0.003), toon(BRANCO));
      vivo.position.set(lx * h * 0.0085, 0, h * 0.0004);
      faixa.add(vivo);
    }
    colar(faixa, g, p.x, p.y, p.z, p.nx, 0, p.nz);
  }
  // o cordão: o nózinho na frente e as duas pontas caindo, com a ponteira
  const n = noCalcao(m, 0, 0.9, 1.05);
  const no = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0045, 8, 6), toon(BRANCO));
  no.position.set(n.x, n.y, n.z);
  g.add(no);
  for (const lado of [-1, 1] as const) {
    const cordao = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0022, h * 0.0022, h * 0.03, 6), toon(BRANCO));
    cordao.position.set(n.x + lado * h * 0.006, n.y - h * 0.016, n.z + h * 0.002);
    cordao.rotation.z = lado * 0.22;
    g.add(cordao);
    const ponteira = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.003, h * 0.003, h * 0.008, 6), toon(AMARELO));
    ponteira.position.set(n.x + lado * h * 0.0095, n.y - h * 0.033, n.z + h * 0.002);
    ponteira.rotation.z = lado * 0.22;
    g.add(ponteira);
  }
  return g;
}

/**
 * A PERNA DO SHORT DOS GATITOS, no pivô de cada perna: um tubo mais comprido
 * e folgado que a perna de shorts do rig (short de treino vai até o meio da
 * coxa), com a faixa amarela e os vivos brancos do lado de fora, a barra com
 * o vivo amarelo, e o emblema na perna esquerda.
 */
function pernaDoShortDosGatitos(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const s = short(m);
  const pano = peca?.corBanho ?? AZUL;
  const TOPO = s.pernaTopo;
  const BARRA = -m.legH * 0.47;
  const rTopo = h * 0.058 * w;
  const rBarra = h * 0.071 * w;
  const comprimento = TOPO - BARRA;
  const raioEm = (y: number): number => rTopo + (rBarra - rTopo) * ((TOPO - y) / comprimento);
  const tubo = new THREE.Mesh(new THREE.CylinderGeometry(rTopo, rBarra, comprimento, 20, 1, true), toon(pano, { doubleSide: true }));
  tubo.position.y = (TOPO + BARRA) / 2;
  g.add(tubo);
  // a barra: o vivo amarelo e, logo acima, um fio branco
  const vivo = new THREE.Mesh(new THREE.CylinderGeometry(rBarra * 1.02, rBarra * 1.025, h * 0.006, 20, 1, true), toon(AMARELO, { doubleSide: true }));
  vivo.position.y = BARRA + h * 0.003;
  g.add(vivo);
  const fio = new THREE.Mesh(new THREE.CylinderGeometry(raioEm(BARRA + h * 0.012) * 1.015, raioEm(BARRA + h * 0.009) * 1.015, h * 0.003, 20, 1, true), toon(BRANCO, { doubleSide: true }));
  fio.position.y = BARRA + h * 0.0105;
  g.add(fio);
  // a faixa do lado de fora, acompanhando o tubo que abre para baixo
  const inclina = Math.atan2(rBarra - rTopo, comprimento);
  const yMeio = (TOPO + BARRA) / 2;
  const faixa = new THREE.Group();
  faixa.position.set(lado * raioEm(yMeio) * 1.012, yMeio, 0);
  faixa.rotation.z = lado * inclina;
  for (const [z, largura, cor] of [[0, 0.014, AMARELO], [-0.0085, 0.0028, BRANCO], [0.0085, 0.0028, BRANCO]] as const) {
    const tira = new THREE.Mesh(new THREE.BoxGeometry(h * 0.003, comprimento * 0.96, h * largura), toon(cor));
    tira.position.z = h * z;
    faixa.add(tira);
  }
  g.add(faixa);
  // o emblema na perna esquerda, na frente, perto da barra
  if (lado === -1) {
    const y = BARRA + h * 0.032;
    const a = -0.35;
    const rr = raioEm(y) * 1.01;
    colar(emblemaDosGatitos(h * 0.012), g, Math.sin(a) * rr, y, Math.cos(a) * rr, Math.sin(a), 0, Math.cos(a));
  }
  return g;
}

// ================================================================= a calça

/**
 * A CALÇA DOS GATITOS: a de moletom de atlética (jogger). A perna do rig é
 * pintada de azul (a `cor`), e por cima vai um tubo um tico folgado que
 * AFINA até o punho de ribana no tornozelo — é o punho franzido que diz
 * "jogger". De lado, as três listras (amarela, branca, amarela) do quadril ao
 * punho; na frente, a boca do bolso de viés e as duas pences do joelho; na
 * coxa esquerda, o emblema.
 */
function calcaDosGatitos(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const legH = m.legH;
  const cor = peca?.cor ?? AZUL;
  const pano = toon(cor, { doubleSide: true });
  const marinho = peca?.corDetalhe ?? MARINHO;
  const TOPO = legH * 0.03;
  const PUNHO = -legH * 0.77;
  const FIM = -legH * 0.845;
  const rTopo = h * 0.058 * w;
  const rBaixo = h * 0.051 * w;
  const comprimento = TOPO - PUNHO;
  const raioEm = (y: number): number => rTopo + (rBaixo - rTopo) * ((TOPO - y) / comprimento);

  const tubo = new THREE.Mesh(new THREE.CylinderGeometry(rTopo, rBaixo, comprimento, 20, 1, true), pano);
  tubo.position.y = (TOPO + PUNHO) / 2;
  g.add(tubo);
  const tampa = new THREE.Mesh(new THREE.CircleGeometry(rTopo, 20), pano);
  tampa.rotation.x = -Math.PI / 2;
  tampa.position.y = TOPO;
  g.add(tampa);

  // o punho: o franzido (um degrau que fecha) e a ribana justa até o tênis
  const rPunho = h * 0.047 * w;
  const franze = new THREE.Mesh(new THREE.CylinderGeometry(rBaixo, rPunho * 1.02, h * 0.008, 20, 1, true), pano);
  franze.position.y = PUNHO - h * 0.004;
  g.add(franze);
  const punho = new THREE.Mesh(new THREE.CylinderGeometry(rPunho, rPunho * 0.98, PUNHO - FIM, 20), toon(marinho));
  punho.position.y = (PUNHO + FIM) / 2 - h * 0.004;
  g.add(punho);
  // as nervuras da ribana: riscos verticais bem finos em volta
  const nervura = toon(escuro(marinho, 0.75));
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI * 2;
    const risco = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0016, (PUNHO - FIM) * 0.8, h * 0.0016), nervura);
    risco.position.set(Math.sin(a) * rPunho * 1.005, (PUNHO + FIM) / 2 - h * 0.004, Math.cos(a) * rPunho * 1.005);
    g.add(risco);
  }
  const filetePunho = new THREE.Mesh(new THREE.CylinderGeometry(rPunho * 1.025, rPunho * 1.025, h * 0.0035, 20, 1, true), toon(AMARELO, { doubleSide: true }));
  filetePunho.position.y = PUNHO - h * 0.01;
  g.add(filetePunho);

  // as três listras do lado de fora, do quadril ao punho
  const yMeio = (TOPO + PUNHO) / 2;
  const listras = new THREE.Group();
  listras.position.set(lado * raioEm(yMeio) * 1.012, yMeio, 0);
  listras.rotation.z = lado * Math.atan2(rBaixo - rTopo, comprimento);
  for (const [z, largura, c] of [[-0.0062, 0.0046, AMARELO], [0, 0.003, BRANCO], [0.0062, 0.0046, AMARELO]] as const) {
    const listra = new THREE.Mesh(new THREE.BoxGeometry(h * 0.003, comprimento * 0.97, h * largura), toon(c));
    listra.position.z = h * z;
    listras.add(listra);
  }
  g.add(listras);

  // a boca do bolso, de viés, na frente e para fora, logo abaixo do quadril
  const costura = toon(escuro(cor, 0.7));
  {
    const y = -legH * 0.1;
    const a = lado * 0.72;
    const rr = raioEm(y) * 1.012;
    const boca = new THREE.Mesh(new THREE.BoxGeometry(h * 0.003, h * 0.04, h * 0.002), costura);
    colar(boca, g, Math.sin(a) * rr, y, Math.cos(a) * rr, Math.sin(a), 0, Math.cos(a));
    boca.rotateZ(-lado * 0.45);
  }
  // as duas pences do joelho, na frente
  for (const dy of [-1, 1]) {
    const y = -legH * 0.46 + dy * h * 0.01;
    const pence = new THREE.Mesh(new THREE.BoxGeometry(h * 0.02, h * 0.0022, h * 0.002), costura);
    pence.position.set(0, y, raioEm(y) * 1.008);
    pence.rotation.z = dy * lado * 0.14;
    g.add(pence);
  }
  // o emblema na coxa esquerda, na frente e um pouco para fora
  if (lado === -1) {
    const y = -legH * 0.24;
    const a = -0.5;
    const rr = raioEm(y) * 1.01;
    colar(emblemaDosGatitos(h * 0.013), g, Math.sin(a) * rr, y, Math.cos(a) * rr, Math.sin(a), 0, Math.cos(a));
  }
  return g;
}

// ================================================================== o tênis

/**
 * O TÊNIS DOS GATITOS, no pivô de cada perna. Ele SUBSTITUI o pé do rig
 * (`substituiPe` na ficha): o pé é uma caixa, e um tênis de bico redondo e
 * cano acolchoado não cabe em volta de uma caixa sem que as quinas furem.
 *
 * De baixo para cima: o solado creme com o filete marinho, a entressola branca com o filete
 * amarelo, o cabedal (a `cor` da ficha) moldado a partir da mesma sola do
 * chinelo e REBAIXADO para o bico, as três listras de cada lado, o cadarço
 * amarelo cruzado com os ilhoses, a língua azul com o emblema, o colarinho
 * acolchoado em volta do tornozelo e a alça amarela do calcanhar.
 */
function tenisDosGatitos(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const h = m.h;
  const p = pe(m);
  const cabedal = peca?.cor ?? BRANCO;
  const azul = peca?.corDetalhe ?? AZUL;
  const ENC = 1.04;

  // o solado CREME (sentado, a sola vira a maior mancha do tênis na tela, e
  // escura ela lia como um bloco preto), o filete marinho, e a entressola
  // branca com o filete amarelo no meio
  g.add(camadaDeSola(m, p.chao, h * 0.005, P.gatitosCreme, ENC * 1.03));
  g.add(camadaDeSola(m, p.chao + h * 0.0042, h * 0.0016, MARINHO, ENC * 1.036));
  g.add(camadaDeSola(m, p.chao + h * 0.005, h * 0.011, BRANCO, ENC * 1.02));
  g.add(camadaDeSola(m, p.chao + h * 0.0095, h * 0.0018, AMARELO, ENC * 1.028));

  // O CABEDAL: a sola extrudada para cima, com o bisel arredondando as quinas,
  // e depois REBAIXADA para o bico — o alto de um tênis desce do calcanhar
  // para a ponta, e é isso que faz a caixa virar sapato
  const y0 = p.chao + h * 0.014;
  const H = h * 0.04;
  const BISEL = h * 0.007;
  const escalaDoCabedal = ENC * 0.9;
  const geo = new THREE.ExtrudeGeometry(formaDaSola(m, escalaDoCabedal), {
    depth: H, bevelEnabled: true, bevelThickness: BISEL, bevelSize: h * 0.004, bevelSegments: 3, curveSegments: 12,
  });
  geo.rotateX(-Math.PI / 2);
  const zBico = p.z + (p.meioComprimento + h * 0.012) * escalaDoCabedal;
  const alturaEm = (z: number): number => 1 - 0.52 * THREE.MathUtils.smoothstep(z, p.z - h * 0.004, zBico);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y > 0) pos.setY(i, y * alturaEm(pos.getZ(i)));
  }
  geo.computeVertexNormals();
  geo.translate(0, y0, 0);
  g.add(new THREE.Mesh(geo, toon(cabedal)));
  /** o alto do cabedal (com o bisel) numa posição `z` */
  const topoEm = (z: number): number => y0 + (H + BISEL) * alturaEm(z);

  // AS TRÊS LISTRAS de cada lado, no meio do pé (onde o lado é quase reto)
  const meiaLargura = p.meiaLargura * 1.14 * escalaDoCabedal + h * 0.004;
  const matAzul = toon(azul);
  for (const s of [-1, 1] as const) {
    for (let k = 0; k < 3; k++) {
      const listra = new THREE.Mesh(new THREE.BoxGeometry(h * 0.003, h * 0.03, h * 0.0065), matAzul);
      listra.position.set(s * (meiaLargura + h * 0.0006), y0 + H * 0.45, p.z - h * 0.014 + k * h * 0.011);
      listra.rotation.x = -0.5;
      g.add(listra);
    }
  }

  // O CADARÇO: quatro X amarelos do peito do pé até a língua, com os ilhoses
  const cadarco = toon(AMARELO);
  const ilhos = toon(P.gatitosIlhos);
  for (let k = 0; k < 4; k++) {
    const z = p.z + h * 0.024 - k * h * 0.0095;
    const y = topoEm(z) + h * 0.0015;
    const inclinacao = Math.atan2(topoEm(z + h * 0.004) - topoEm(z - h * 0.004), h * 0.008);
    for (const s of [-1, 1] as const) {
      const cruz = new THREE.Mesh(new THREE.BoxGeometry(h * 0.03, h * 0.0034, h * 0.0042), cadarco);
      cruz.position.set(0, y, z);
      cruz.rotation.set(-inclinacao, s * 0.42, 0);
      g.add(cruz);
      const furo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0022, 6, 5), ilhos);
      furo.position.set(s * h * 0.0135, y - h * 0.001, z);
      g.add(furo);
    }
  }
  // o laço do cadarço, em cima do último X
  {
    const z = p.z - h * 0.006;
    const y = topoEm(z) + h * 0.004;
    for (const s of [-1, 1] as const) {
      const alca = new THREE.Mesh(new THREE.TorusGeometry(h * 0.0055, h * 0.0015, 5, 10), cadarco);
      alca.position.set(s * h * 0.006, y, z);
      alca.rotation.set(-1.1, 0, s * 0.5);
      g.add(alca);
    }
  }

  // A LÍNGUA: acolchoada, azul, saindo por cima e tombada para trás, com o
  // emblema na frente
  const lingua = new THREE.Group();
  lingua.position.set(0, topoEm(p.z - h * 0.016) + h * 0.004, p.z - h * 0.016);
  lingua.rotation.x = -0.38;
  const almofada = new THREE.Mesh(new THREE.BoxGeometry(h * 0.024, h * 0.022, h * 0.007), matAzul);
  almofada.position.y = h * 0.008;
  lingua.add(almofada);
  const emblema = emblemaDosGatitos(h * 0.0065);
  emblema.position.set(0, h * 0.009, h * 0.0036);
  lingua.add(emblema);
  g.add(lingua);

  // O COLARINHO acolchoado em volta do tornozelo, e a alça do calcanhar
  const zCano = p.z - h * 0.024;
  const colarinho = new THREE.Mesh(new THREE.TorusGeometry(h * 0.043 * m.w, h * 0.0065, 8, 22), toon(MARINHO));
  colarinho.rotation.x = Math.PI / 2;
  colarinho.scale.set(0.98, 1.12, 1);
  colarinho.position.set(0, topoEm(zCano) - h * 0.002, zCano);
  g.add(colarinho);
  const zCalcanhar = p.z - (p.meioComprimento + h * 0.006) * escalaDoCabedal - h * 0.004;
  const alca = new THREE.Mesh(new THREE.BoxGeometry(h * 0.013, h * 0.022, h * 0.005), toon(AMARELO));
  alca.position.set(0, topoEm(zCalcanhar) + h * 0.002, zCalcanhar);
  alca.rotation.x = 0.22;
  g.add(alca);
  // e o emblema do calcanhar, virado para trás
  colar(emblemaDosGatitos(h * 0.007), g, 0, y0 + H * 0.45, zCalcanhar - h * 0.0015, 0, 0, -1);
  return g;
}

export {
  emblemaDosGatitos,
  boneDosGatitos,
  camisetaDosGatitos, mangaDaCamisetaDosGatitos,
  camisetaLargaDosGatitos, mangaLargaDosGatitos,
  jaquetonaDosGatitos, mangaDaJaquetona,
  cosDoShortDosGatitos, pernaDoShortDosGatitos,
  calcaDosGatitos,
  tenisDosGatitos,
};
