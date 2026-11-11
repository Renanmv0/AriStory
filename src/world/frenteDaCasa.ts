import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { extrudar, quina, retangulo } from './lojaDeRoupas';
import { reboco } from './texturasDeFachada';
import { uvDeParede, uvEmMetros } from './acabamento';
import { novaTextura, sorteio } from './texturasDeChao';
import { portaDaRua } from './moveisDaCasa';
import { lampiaoDeParede } from './moveisDoMania';
import { arbustoFlorido } from './acampamento';
import { flowers, regador } from './props';

/**
 * ============================ A FRENTE DA CASA DO ARI (o jardim e a garagem)
 *
 * O lado de fora da casa (`scenes/frenteDaCasa.ts`), que nasceu com o Bebito
 * Mobile (`docs/BEBITO-MOBILE.md`): o Renan pediu uma casa em que, ao sair,
 * tem um jardinzinho florido, fechado dos dois lados, e ao lado uma garagem
 * onde o carro fica. As cores são as da casa por dentro — a parede creme da
 * sala e a porta de madeira escura —, para ser a mesma casa.
 *
 * As peças seguem o kit de prédio de rua da lojinha da Estella: a parede da
 * frente é uma forma com os furos das janelas (e a porta é RECORTE no
 * contorno, porque toca o chão), o reboco é canvas, e o telhado de duas
 * águas tem a telha desenhada em canvas, em fiadas.
 */

/** as medidas que a cena usa (a casa, a porta e a garagem), no referencial de cada peça */
export const FACHADA = { largura: 9.4, alto: 3.1, fundo: 3.6, parede: 0.3, porta: { largura: 0.95, alto: 2.1 }, janela: { x: 2.75, largura: 1.5, y0: 1.0, alto: 1.25 } } as const;
/** (o `alto` é o do pergolado: o carro de laço no teto passa por baixo com folga) */
export const GARAGEM = { largura: 5.0, fundo: 7.4, alto: 3.1 } as const;
export const CERCA = { alto: 0.92 } as const;

/** a telha em fiadas: quase branca (a cor vem do material), com a sombra entre uma fiada e a de baixo */
function telhas(): THREE.CanvasTexture {
  return novaTextura('telhas-da-casa', 0.9, (ctx, s) => {
    const rnd = sorteio(4242);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const fiadas = 3;
    const porFiada = 4;
    const h = s / fiadas;
    const l = s / porFiada;
    for (let f = 0; f < fiadas; f++) {
      for (let k = -1; k <= porFiada; k++) {
        const x = k * l + (f % 2 ? l / 2 : 0);
        const tom = 226 + Math.floor(rnd() * 26);
        ctx.fillStyle = `rgb(${tom},${tom},${tom})`;
        ctx.beginPath();
        ctx.moveTo(x + 2, f * h);
        ctx.lineTo(x + l - 2, f * h);
        ctx.lineTo(x + l - 2, f * h + h * 0.62);
        ctx.quadraticCurveTo(x + l / 2, f * h + h * 1.08, x + 2, f * h + h * 0.62);
        ctx.fill();
      }
      // a sombra da fiada de cima
      const g = ctx.createLinearGradient(0, f * h, 0, f * h + h * 0.3);
      g.addColorStop(0, 'rgba(120,60,50,0.32)');
      g.addColorStop(1, 'rgba(120,60,50,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, f * h, s, h * 0.3);
    }
  });
}

const por = <T extends THREE.Object3D>(pai: THREE.Object3D, o: T, x = 0, y = 0, z = 0): T => {
  o.position.set(x, y, z);
  pai.add(o);
  return o;
};

/**
 * A CASA POR FORA: a fachada com a porta da rua (a mesma de dentro) no meio
 * e uma janela de cada lado, com veneziana e floreira; o rodapé, o degrau
 * com o capacho, o lampião ao lado da porta e o telhado de duas águas.
 *
 * A face de fora da parede da frente fica em `z = 0`, o meio da porta em
 * `x = 0`, e a casa vai para o `−Z`.
 */
export interface CoresDaFachada {
  parede?: number;
  telhado?: number;
  veneziana?: number;
  porta?: number;
  /**
   * casa VIZINHA: é fundo, vista de longe. Sai do mesmo molde, com a porta
   * lisa (a de verdade tem 6 mil triângulos de almofada, maçaneta e olho
   * mágico), sem o lampião, e com as palhetas da veneziana em caixa reta —
   * uma vizinha fica com um terço dos triângulos da casa do Ari.
   */
  vizinha?: boolean;
}

/**
 * (as CORES são parâmetro para as casas VIZINHAS da rua saírem do mesmo
 * molde, cada uma pintada de um jeito; sem nada, é a casa do Ari)
 */
export function fachadaDaCasa(cores: CoresDaFachada = {}): THREE.Group {
  const corDaParede: number = cores.parede ?? P.wallCream;
  const corDoTelhado: number = cores.telhado ?? P.roofTile;
  const corDaVeneziana: number = cores.veneziana ?? P.casaVeneziana;
  const corDaPorta: number = cores.porta ?? P.woodDark;
  const vizinha = cores.vizinha === true;
  const g = new THREE.Group();
  g.userData.peca = vizinha ? 'casa-vizinha' : 'casa-do-ari-por-fora';
  const { largura: L, alto: H, fundo: F, parede: E, porta, janela } = FACHADA;
  const creme = toon(corDaParede, { mapa: reboco() });
  const branco = toon(P.casaBranco);
  const meiaPorta = (porta.largura + 0.2) / 2;

  // a parede da frente: o contorno com o RECORTE da porta (ela toca o chão) e os furos das janelas
  const forma = new THREE.Shape();
  forma.moveTo(-L / 2, 0);
  forma.lineTo(-meiaPorta, 0);
  forma.lineTo(-meiaPorta, porta.alto + 0.1);
  forma.lineTo(meiaPorta, porta.alto + 0.1);
  forma.lineTo(meiaPorta, 0);
  forma.lineTo(L / 2, 0);
  forma.lineTo(L / 2, H);
  forma.lineTo(-L / 2, H);
  forma.lineTo(-L / 2, 0);
  for (const lado of [-1, 1]) {
    const cx = lado * janela.x;
    forma.holes.push(retangulo(new THREE.Path(), cx - janela.largura / 2, janela.y0, cx + janela.largura / 2, janela.y0 + janela.alto));
  }
  g.add(new THREE.Mesh(uvDeParede(extrudar(forma, E, -E, 4)), creme));
  // as laterais e o fundo (a da direita aparece para a câmera)
  for (const lado of [-1, 1]) {
    const parede = new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(E, H, F - E), lado * (L / 2 - E / 2), H / 2, -E - (F - E) / 2), creme);
    por(g, parede, lado * (L / 2 - E / 2), H / 2, -E - (F - E) / 2);
  }
  por(g, new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(L - 2 * E, H, E), 0, H / 2, -F + E / 2), creme), 0, H / 2, -F + E / 2);

  // o rodapé, dos dois lados da porta (4 cm para fora da parede) e na lateral da direita
  const rodape = toon(P.casaRodape);
  for (const lado of [-1, 1]) {
    const l = L / 2 - meiaPorta - 0.02;
    por(g, new THREE.Mesh(quina(l, 0.42, 0.08, 0.02), rodape), lado * (meiaPorta + 0.02 + l / 2), 0.21, 0.01);
  }
  por(g, new THREE.Mesh(quina(0.08, 0.42, F - 0.1, 0.02), rodape), L / 2 + 0.01, 0.21, -F / 2);

  // a porta da rua (centrada na linha da parede), o degrau, o capacho e o lampião
  if (vizinha) {
    // a porta lisa: a folha, duas almofadas em relevo e a maçaneta
    const madeira = toon(corDaPorta);
    por(g, new THREE.Mesh(quina(porta.largura + 0.2, porta.alto + 0.1, 0.1, 0.02), toon(P.casaBranco)), 0, (porta.alto + 0.1) / 2, -E / 2 - 0.03);
    por(g, new THREE.Mesh(quina(porta.largura, porta.alto, 0.08, 0.02), madeira), 0, porta.alto / 2, -E / 2 + 0.02);
    for (const y of [0.62, 1.52]) por(g, new THREE.Mesh(quina(porta.largura - 0.28, 0.66, 0.03, 0.012), madeira), 0, y, -E / 2 + 0.065);
    por(g, new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), toon(P.gold)), porta.largura / 2 - 0.13, 1.02, -E / 2 + 0.1);
  } else por(g, portaDaRua(corDaPorta, porta.largura, porta.alto), 0, 0, -E / 2);
  por(g, new THREE.Mesh(quina(1.7, 0.12, 0.62, 0.03), toon(P.concrete)), 0, 0.06, 0.3);
  por(g, new THREE.Mesh(quina(0.9, 0.03, 0.42, 0.012), toon(corDaVeneziana)), 0, 0.132, 0.3);
  if (!vizinha) {
    const lampiao = por(g, lampiaoDeParede(), meiaPorta + 0.42, 2.02, 0.005);
    lampiao.scale.setScalar(0.9);
  }

  // as janelas: o caixilho branco dentro do vão, a cruz, o vidro, a cortina por trás, as venezianas e a floreira
  for (const lado of [-1, 1]) {
    const cx = lado * janela.x;
    const cy = janela.y0 + janela.alto / 2;
    const jl = janela.largura;
    const ja = janela.alto;
    // (o caixilho entra 1 cm no reboco: casado com o furo, as faces de dentro brigavam)
    for (const s of [-1, 1]) {
      por(g, new THREE.Mesh(quina(0.08, ja + 0.02, 0.12, 0.015), branco), cx + s * (jl / 2 - 0.03), cy, -0.1);
      por(g, new THREE.Mesh(quina(jl - 0.1, 0.08, 0.12, 0.015), branco), cx, cy + s * (ja / 2 - 0.03), -0.1);
    }
    por(g, new THREE.Mesh(quina(0.05, ja - 0.1, 0.07, 0.012), branco), cx, cy, -0.1);
    por(g, new THREE.Mesh(quina(jl - 0.1, 0.05, 0.07, 0.012), branco), cx, cy + 0.08, -0.1);
    por(g, new THREE.Mesh(new THREE.PlaneGeometry(jl - 0.08, ja - 0.08), toon(P.glass, { glow: 0.18 })), cx, cy, -0.13);
    por(g, new THREE.Mesh(new THREE.PlaneGeometry(jl, ja), toon(P.casaCortina)), cx, cy, -0.26);
    // o peitoril e as duas venezianas abertas
    por(g, new THREE.Mesh(quina(jl + 0.3, 0.07, 0.2, 0.02), branco), cx, janela.y0 - 0.035, 0.05);
    for (const s of [-1, 1]) {
      const veneziana = por(g, new THREE.Group(), cx + s * (jl / 2 + 0.31), cy, 0.03);
      veneziana.add(new THREE.Mesh(quina(0.5, ja + 0.06, 0.05, 0.015), toon(corDaVeneziana)));
      for (let k = 0; k < 6; k++) {
        const palheta = vizinha ? new THREE.BoxGeometry(0.38, 0.035, 0.02) : quina(0.38, 0.035, 0.02, 0.008);
        por(veneziana, new THREE.Mesh(palheta, toon(P.casaBranco)), 0, -ja / 2 + 0.16 + k * ((ja - 0.3) / 5), 0.027);
      }
    }
    // a floreira: a caixa branca com as flores
    por(g, new THREE.Mesh(quina(jl + 0.1, 0.2, 0.26, 0.03), branco), cx, janela.y0 - 0.2, 0.2);
    const flores = por(g, flowers(9, 0.62, [P.flowerPink, P.flowerYellow, P.florDoArbustoBranca, P.florDoArbusto]), cx, janela.y0 - 0.14, 0.2);
    flores.scale.set(1.15, 0.9, 0.3);
  }

  // O TELHADO de duas águas, com a cumeeira ao longo da casa: beiral na frente, atrás e nos lados
  const telha = toon(corDoTelhado, { mapa: telhas() });
  const beiral = 0.5;
  const sobe = 1.25;
  const meioFundo = F / 2 + beiral;
  const comprimento = Math.hypot(meioFundo, sobe);
  const angulo = Math.atan2(sobe, meioFundo);
  for (const lado of [-1, 1]) {
    const geo = new THREE.BoxGeometry(L + 0.8, 0.12, comprimento);
    uvEmMetros(geo);
    const agua = por(g, new THREE.Mesh(geo, telha), 0, H + sobe / 2 - 0.02, -F / 2 + lado * (meioFundo / 2));
    agua.rotation.x = lado * angulo;
  }
  por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, L + 0.86, 8).rotateZ(Math.PI / 2), toon(corDoTelhado)), 0, H + sobe + 0.02, -F / 2);
  // os dois oitões (o triângulo de parede debaixo do telhado, em cada lateral)
  for (const lado of [-1, 1]) {
    const oitao = new THREE.Shape();
    oitao.moveTo(-F / 2, 0);
    oitao.lineTo(F / 2, 0);
    oitao.lineTo(0, sobe * (F / 2) / meioFundo);
    oitao.lineTo(-F / 2, 0);
    const geo = new THREE.ExtrudeGeometry(oitao, { depth: E, bevelEnabled: false });
    geo.rotateY(Math.PI / 2);
    geo.translate(lado * (L / 2) - (lado > 0 ? E : 0), H, -F / 2);
    g.add(new THREE.Mesh(geo, toon(corDaParede)));
  }
  // a chaminé de tijolinho, na água de trás
  por(g, new THREE.Mesh(quina(0.6, 1.0, 0.6, 0.03), toon(P.casaRodape)), -L / 2 + 1.6, H + 1.05, -F / 2 - 0.7);
  por(g, new THREE.Mesh(quina(0.74, 0.12, 0.74, 0.03), toon(P.casaBranco)), -L / 2 + 1.6, H + 1.58, -F / 2 - 0.7);
  return g;
}

/**
 * A GARAGEM: um pergolado de madeira (a câmera olha de cima — telhado
 * fechado esconderia o carro), com flor de trepadeira nos cantos de trás, e
 * uma prateleira no fundo com o regador. As paredes do fundo e do lado são
 * da cena (têm colisor). O meio do chão da garagem é a origem; a boca dá
 * para o `+Z`.
 */
export function pergoladoDaGaragem(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'garagem-do-bebito';
  const { largura: L, fundo: F, alto: H } = GARAGEM;
  const madeira = toon(P.casaPergola);
  const hx = L / 2 - 0.16;
  // os quatro pilares (os da boca e os do meio; atrás, a viga apoia na parede)
  for (const lado of [-1, 1]) {
    for (const z of [F / 2 - 0.25, -0.4]) {
      por(g, new THREE.Mesh(quina(0.16, H, 0.16, 0.03), madeira), lado * hx, H / 2, z);
    }
    // as duas vigas compridas
    por(g, new THREE.Mesh(quina(0.14, 0.2, F - 0.1, 0.03), madeira), lado * hx, H + 0.07, 0);
  }
  // as ripas atravessadas, espaçadas (o carro aparece entre elas)
  for (let k = 0; k < 8; k++) {
    const z = -F / 2 + 0.5 + k * ((F - 1.0) / 7);
    por(g, new THREE.Mesh(quina(L + 0.5, 0.12, 0.09, 0.02), madeira), 0, H + 0.22, z);
  }
  // a trepadeira florida, tomando os cantos de trás e um pedaço da viga do lado
  const cores = [P.florDoArbusto, P.flowerPink, P.florDoArbustoBranca];
  const moitas: Array<[number, number, number, number]> = [
    [-hx + 0.2, -F / 2 + 0.6, 0.62, 11], [-hx + 0.1, -F / 2 + 1.7, 0.5, 12], [hx - 0.2, -F / 2 + 0.55, 0.58, 13],
    [-0.4, -F / 2 + 0.5, 0.5, 14], [-hx, -F / 2 + 2.9, 0.42, 15],
  ];
  for (const [x, z, escala, semente] of moitas) {
    const moita = por(g, arbustoFlorido(escala, semente, cores), x, H + 0.1, z);
    moita.userData = {};
  }
  // a prateleira do fundo, com o regador e dois vasinhos
  por(g, new THREE.Mesh(quina(1.5, 0.05, 0.32, 0.015), madeira), -0.9, 1.25, -F / 2 + 0.2);
  for (const x of [-1.5, -0.3]) por(g, new THREE.Mesh(quina(0.05, 0.3, 0.26, 0.012), madeira), x, 1.1, -F / 2 + 0.18);
  const rega = por(g, regador(), -1.25, 1.275, -F / 2 + 0.2);
  rega.rotation.y = 0.7;
  rega.scale.setScalar(0.8);
  for (const [x, cor] of [[-0.75, P.flowerYellow], [-0.42, P.flowerPink]] as const) {
    por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.13, 10), toon(P.bebitoVasinho)), x, 1.34, -F / 2 + 0.2);
    por(g, new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), toon(cor)), x, 1.46, -F / 2 + 0.2);
  }
  return g;
}

/** a ripa da cerca: em pé, com a ponta redonda */
function geoDaRipa(alto: number): THREE.BufferGeometry {
  const l = 0.09;
  const forma = new THREE.Shape();
  forma.moveTo(-l / 2, 0);
  forma.lineTo(l / 2, 0);
  forma.lineTo(l / 2, alto - l / 2);
  forma.absarc(0, alto - l / 2, l / 2, 0, Math.PI, false);
  forma.lineTo(-l / 2, 0);
  return new THREE.ExtrudeGeometry(forma, { depth: 0.024, bevelEnabled: false, curveSegments: 5 });
}

/**
 * A CERQUINHA BRANCA do jardim: ripas de ponta redonda num lote, duas
 * travessas e um mourão em cada ponta. Corre ao longo de `X`, centrada, a
 * frente no `+Z`. Baixa de propósito: do lado da câmera, cerca alta taparia
 * o jardim.
 */
export function cercaBranca(comprimento: number): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cerca-do-jardim';
  const branco = toon(P.casaBranco);
  const alto = CERCA.alto;
  const n = Math.max(2, Math.round(comprimento / 0.17));
  const lote = new THREE.InstancedMesh(geoDaRipa(alto - 0.06), branco, n);
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const x = -comprimento / 2 + ((i + 0.5) * comprimento) / n;
    lote.setMatrixAt(i, m.makeTranslation(x, 0.06, 0.012));
  }
  lote.castShadow = true;
  g.add(lote);
  for (const y of [0.28, 0.66]) por(g, new THREE.Mesh(quina(comprimento, 0.07, 0.03, 0.01), branco), 0, y, -0.006);
  for (const lado of [-1, 1]) {
    por(g, new THREE.Mesh(quina(0.11, alto + 0.08, 0.11, 0.02), branco), lado * (comprimento / 2), (alto + 0.08) / 2, 0);
    por(g, new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), branco), lado * (comprimento / 2), alto + 0.12, 0);
  }
  return g;
}

/**
 * O PORTÃOZINHO do jardim: a folha de ripas mora no grupo `folha-do-portao`,
 * com a dobradiça na ponta esquerda (`x = −largura/2`); a cena gira o grupo
 * para abrir. O topo das ripas faz um arco.
 */
export function portaozinho(largura = 1.3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'portao-do-jardim';
  const branco = toon(P.casaBranco);
  const folha = new THREE.Group();
  folha.name = 'folha-do-portao';
  folha.position.x = -largura / 2;
  g.add(folha);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const f = (i + 0.5) / n;
    const alto = CERCA.alto - 0.1 + Math.sin(f * Math.PI) * 0.2;
    por(folha, new THREE.Mesh(geoDaRipa(alto), branco), f * largura, 0.07, 0);
  }
  for (const y of [0.3, 0.68]) por(folha, new THREE.Mesh(quina(largura - 0.06, 0.07, 0.03, 0.01), branco), largura / 2, y, -0.016);
  // o trinco, com um coraçãozinho
  por(folha, new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), toon(P.heart)), largura - 0.12, 0.68, 0.04);
  g.userData.folha = folha;
  return g;
}

/** A CAIXA DE CORREIO, no mourão ao lado do portão: a caixinha vermelha de tampa redonda e a bandeirinha */
export function caixaDeCorreio(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caixa-de-correio';
  por(g, new THREE.Mesh(quina(0.09, 1.05, 0.09, 0.02), toon(P.casaBranco)), 0, 0.525, 0);
  const caixa = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.42, 14, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateX(-Math.PI / 2), toon(P.casaCorreio));
  por(g, caixa, 0, 1.17, 0);
  por(g, new THREE.Mesh(quina(0.3, 0.14, 0.42, 0.02), toon(P.casaCorreio)), 0, 1.1, 0);
  por(g, new THREE.Mesh(quina(0.02, 0.2, 0.03, 0.006), toon(P.casaBranco)), 0.165, 1.24, 0.08);
  por(g, new THREE.Mesh(quina(0.02, 0.09, 0.13, 0.006), toon(P.flowerYellow)), 0.165, 1.33, 0.13);
  return g;
}
