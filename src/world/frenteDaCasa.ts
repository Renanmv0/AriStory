import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { extrudar, quina, retangulo } from './lojaDeRoupas';
import { reboco } from './texturasDeFachada';
import { uvDeParede, uvEmMetros } from './acabamento';
import { novaTextura, sorteio } from './texturasDeChao';
import { portaDaRua } from './moveisDaCasa';
import { lampiaoDeParede } from './moveisDoMania';
import { flowers, regador } from './props';
import { pocaDeLuz } from './furniture';

/**
 * ============================ A FRENTE DA CASA DO ARI (o jardim e a garagem)
 *
 * O lado de fora da casa (`scenes/frenteDaCasa.ts`), que nasceu com o Bebito
 * Mobile (`docs/BEBITO-MOBILE.md`): o Renan pediu uma casa em que, ao sair,
 * tem um jardinzinho florido, fechado dos dois lados, e ao lado uma garagem
 * onde o carro fica. As cores são as da casa por dentro — a parede creme da
 * sala e a porta de madeira escura —, para ser a mesma casa.
 *
 * (Depois da primeira foto, a pedido do Renan: a casa ficou mais funda, a cerquinha
 * branca virou muro com hera, e a garagem ganhou portão de correr e um
 * pergolado de aço e ripa.)
 *
 * As peças seguem o kit de prédio de rua da lojinha da Estella: a parede da
 * frente é uma forma com os furos das janelas (e a porta é RECORTE no
 * contorno, porque toca o chão), o reboco é canvas, e o telhado de duas
 * águas tem a telha desenhada em canvas, em fiadas.
 */

/**
 * As medidas que a cena usa, no referencial de cada peça.
 *
 * A CASA É FUNDA (8,2 m): a primeira tinha 3,6 e o Renan viu de fora uma
 * casinha minúscula — a sala e a cozinha de dentro não cabiam nela. `lado`
 * são as duas janelas de cada lateral (a distância do meio de cada uma até
 * a parede da frente).
 */
export const FACHADA = {
  largura: 9.4, alto: 3.1, fundo: 8.2, parede: 0.3,
  porta: { largura: 0.95, alto: 2.1 },
  janela: { x: 2.75, largura: 1.5, y0: 1.0, alto: 1.25 },
  lado: [2.45, 5.9],
} as const;
/**
 * A garagem: o vão por dentro, e o `alto` do pergolado (o carro de laço no
 * teto passa por baixo com folga). `boca` é o vão do portão.
 */
export const GARAGEM = { largura: 5.2, fundo: 8.0, alto: 3.1, boca: 4.3 } as const;
/** o muro da frente e do lado do jardim, os pilares dos portões e o portão de correr da garagem */
export const MURO = { alto: 1.35, espessura: 0.22, pilar: 1.6, ladoDoPilar: 0.34 } as const;
/** (`corre` é quanto a folha anda para abrir) */
export const PORTAO_DA_GARAGEM = { largura: 4.75, alto: 1.95, corre: 4.5 } as const;

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
  const rodape = toon(P.casaRodape);
  const meiaPorta = (porta.largura + 0.2) / 2;
  const jl = janela.largura;
  const ja = janela.alto;
  const cy = janela.y0 + ja / 2;

  /**
   * UMA JANELA, no quadro de uma parede (a face de fora em `z = 0`): o
   * caixilho branco dentro do vão, a cruz, o vidro, a cortina por trás, o
   * peitoril, as duas venezianas abertas e, pedindo, a floreira. A da
   * LATERAL de casa vizinha vai sem veneziana (é fundo, e são quatro por casa).
   */
  // (o caixilho da vizinha é caixa reta: de longe a quina não se vê, e são seis janelas por casa)
  const regua = (l: number, a: number, p: number, r: number): THREE.BufferGeometry => (vizinha ? new THREE.BoxGeometry(l, a, p) : quina(l, a, p, r));
  const janelaEm = (quadro: THREE.Object3D, cx: number, floreira: boolean, venezianas: boolean): void => {
    // (o caixilho entra 1 cm no reboco: casado com o furo, as faces de dentro brigavam.
    // Os montantes são inteiros, mais altos e mais grossos; as travessas ficam ENTRE eles —
    // com a mesma medida, as faces da frente e de cima coincidiam nas quatro quinas)
    for (const s of [-1, 1]) {
      por(quadro, new THREE.Mesh(regua(0.08, ja + 0.05, 0.13, 0.015), branco), cx + s * (jl / 2 - 0.03), cy, -0.1);
      por(quadro, new THREE.Mesh(regua(jl - 0.14, 0.08, 0.12, 0.015), branco), cx, cy + s * (ja / 2 - 0.03), -0.1);
    }
    por(quadro, new THREE.Mesh(regua(0.05, ja - 0.1, 0.07, 0.012), branco), cx, cy, -0.1);
    por(quadro, new THREE.Mesh(regua(jl - 0.14, 0.05, 0.055, 0.012), branco), cx, cy + 0.08, -0.1);
    por(quadro, new THREE.Mesh(new THREE.PlaneGeometry(jl - 0.08, ja - 0.08), toon(P.glass, { glow: 0.18 })), cx, cy, -0.13);
    por(quadro, new THREE.Mesh(new THREE.PlaneGeometry(jl, ja), toon(P.casaCortina)), cx, cy, -0.26);
    por(quadro, new THREE.Mesh(quina(jl + 0.3, 0.07, 0.2, 0.02), branco), cx, janela.y0 - 0.035, 0.05);
    if (venezianas) {
      for (const s of [-1, 1]) {
        const veneziana = por(quadro, new THREE.Group(), cx + s * (jl / 2 + 0.31), cy, 0.03);
        veneziana.add(new THREE.Mesh(quina(0.5, ja + 0.06, 0.05, 0.015), toon(corDaVeneziana)));
        for (let k = 0; k < 6; k++) {
          const palheta = vizinha ? new THREE.BoxGeometry(0.38, 0.035, 0.02) : quina(0.38, 0.035, 0.02, 0.008);
          por(veneziana, new THREE.Mesh(palheta, toon(P.casaBranco)), 0, -ja / 2 + 0.16 + k * ((ja - 0.3) / 5), 0.027);
        }
      }
    }
    if (floreira) {
      por(quadro, new THREE.Mesh(quina(jl + 0.1, 0.2, 0.26, 0.03), branco), cx, janela.y0 - 0.2, 0.2);
      const flores = por(quadro, flowers(9, 0.62, [P.flowerPink, P.flowerYellow, P.florDoArbustoBranca, P.florDoArbusto]), cx, janela.y0 - 0.14, 0.2);
      flores.scale.set(1.15, 0.9, 0.3);
    }
  };

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
    forma.holes.push(retangulo(new THREE.Path(), cx - jl / 2, janela.y0, cx + jl / 2, janela.y0 + ja));
  }
  g.add(new THREE.Mesh(uvDeParede(extrudar(forma, E, -E, 4)), creme));
  for (const lado of [-1, 1]) janelaEm(g, lado * janela.x, true, true);
  // o rodapé, dos dois lados da porta (4 cm para fora da parede)
  for (const lado of [-1, 1]) {
    const l = L / 2 - meiaPorta - 0.02;
    por(g, new THREE.Mesh(quina(l, 0.42, 0.08, 0.02), rodape), lado * (meiaPorta + 0.02 + l / 2), 0.21, 0.01);
  }

  /*
   * AS DUAS LATERAIS, cada uma num QUADRO girado (a face de fora em `z = 0`
   * do quadro, como a da frente): a parede com os dois furos, as duas janelas
   * e o rodapé. É a lateral da direita que a câmera de sempre vê — na casa
   * funda ela é a maior parede à vista, e lisa parecia um muro.
   */
  const W = F - E;
  for (const lado of [-1, 1]) {
    const quadro = por(g, new THREE.Group(), lado * (L / 2), 0, -E - W / 2);
    quadro.rotation.y = lado * (Math.PI / 2);
    // (no quadro, o `+X` da direita aponta para o fundo da casa; o da esquerda, para a frente)
    const meios = FACHADA.lado.map((d) => lado * (d - E - W / 2));
    const pano = new THREE.Shape();
    retangulo(pano, -W / 2, 0, W / 2, H);
    for (const cx of meios) pano.holes.push(retangulo(new THREE.Path(), cx - jl / 2, janela.y0, cx + jl / 2, janela.y0 + ja));
    quadro.add(new THREE.Mesh(uvDeParede(extrudar(pano, E, -E, 4)), creme));
    for (const cx of meios) janelaEm(quadro, cx, false, !vizinha);
    por(quadro, new THREE.Mesh(quina(W - 0.04, 0.42, 0.08, 0.02), rodape), 0, 0.21, 0.01);
  }
  // o fundo
  por(g, new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(L - 2 * E, H, E), 0, H / 2, -F + E / 2), creme), 0, H / 2, -F + E / 2);

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

  // O TELHADO de duas águas, com a cumeeira ao longo da casa: beiral na frente, atrás e nos lados
  const telha = toon(corDoTelhado, { mapa: telhas() });
  const beiral = 0.5;
  const meioFundo = F / 2 + beiral;
  // (a casa funda pede um telhado mais deitado: com a inclinação da primeira ele dobrava a altura da casa)
  const sobe = meioFundo * 0.44;
  const comprimento = Math.hypot(meioFundo, sobe);
  const angulo = Math.atan2(sobe, meioFundo);
  for (const lado of [-1, 1]) {
    const geo = new THREE.BoxGeometry(L + 0.8, 0.12, comprimento);
    uvEmMetros(geo);
    const agua = por(g, new THREE.Mesh(geo, telha), 0, H + sobe / 2 - 0.02, -F / 2 + lado * (meioFundo / 2));
    agua.rotation.x = lado * angulo;
    // a testeira branca, na beira de cada água
    por(g, new THREE.Mesh(quina(L + 0.84, 0.13, 0.05, 0.015), branco), 0, H - 0.07, -F / 2 + lado * (meioFundo - 0.01));
  }
  por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, L + 0.86, 8).rotateZ(Math.PI / 2), toon(corDoTelhado)), 0, H + sobe + 0.02, -F / 2);
  // os dois oitões (o triângulo de parede debaixo do telhado, em cada lateral), com o óculo redondo do sótão
  const altoDoOitao = (sobe * (F / 2)) / meioFundo;
  for (const lado of [-1, 1]) {
    const oitao = new THREE.Shape();
    oitao.moveTo(-F / 2, 0);
    oitao.lineTo(F / 2, 0);
    oitao.lineTo(0, altoDoOitao);
    oitao.lineTo(-F / 2, 0);
    const geo = new THREE.ExtrudeGeometry(oitao, { depth: E, bevelEnabled: false });
    geo.rotateY(Math.PI / 2);
    geo.translate(lado * (L / 2) - (lado > 0 ? E : 0), H, -F / 2);
    g.add(new THREE.Mesh(geo, toon(corDaParede)));
    const oculo = por(g, new THREE.Group(), lado * (L / 2 + 0.012), H + altoDoOitao * 0.36, -F / 2);
    oculo.rotation.y = lado * (Math.PI / 2);
    oculo.add(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.055, vizinha ? 4 : 6, vizinha ? 14 : 20), branco));
    oculo.add(new THREE.Mesh(new THREE.CircleGeometry(0.33, vizinha ? 14 : 20), toon(P.glass, { glow: 0.12 })));
    for (const giro of vizinha ? [] : [0, Math.PI / 2]) {
      const travessa = new THREE.Mesh(quina(0.66, 0.045, 0.03, 0.01), branco);
      travessa.rotation.z = giro;
      travessa.position.z = 0.012;
      oculo.add(travessa);
    }
  }
  // a chaminé, na água de trás (o pé dela some dentro do telhado)
  const zChamine = -F / 2 - 1.5;
  const yDoTelhado = H + sobe * (1 - 1.5 / meioFundo);
  por(g, new THREE.Mesh(quina(0.6, 1.2, 0.6, 0.03), toon(P.casaRodape)), -L / 2 + 1.6, yDoTelhado + 0.3, zChamine);
  por(g, new THREE.Mesh(quina(0.74, 0.12, 0.74, 0.03), toon(P.casaBranco)), -L / 2 + 1.6, yDoTelhado + 0.93, zChamine);
  return g;
}

/**
 * A GARAGEM: um PERGOLADO moderno (a câmera olha de cima — telhado fechado
 * esconderia o carro): duas vigas de aço grafite, uma apoiada na parede do
 * lado e a outra em três pilaretes finos, e o RIPADO de madeira por cima,
 * muitas ripas em pé e juntas — o carro aparece entre elas, e a sombra
 * listrada cai nele. No fundo, a prateleira com o regador. As paredes do
 * fundo e do lado e o portão são da cena (têm colisor). O meio do chão da
 * garagem é a origem; a boca dá para o `+Z`.
 */
export function pergoladoDaGaragem(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'garagem-do-bebito';
  const { largura: L, fundo: F, alto: H } = GARAGEM;
  const aco = toon(P.casaGrafite);
  const madeira = toon(P.casaRipa);
  const hx = L / 2 - 0.12;
  // as duas vigas compridas, e os três pilaretes do lado do jardim
  for (const lado of [-1, 1]) por(g, new THREE.Mesh(quina(0.09, 0.2, F - 0.3, 0.02), aco), lado * hx, H + 0.02, -0.05);
  for (const z of [-F / 2 + 0.5, -0.2, F / 2 - 0.6]) {
    por(g, new THREE.Mesh(quina(0.09, H - 0.08, 0.09, 0.02), aco), hx, (H - 0.08) / 2, z);
    por(g, new THREE.Mesh(quina(0.2, 0.03, 0.2, 0.01), aco), hx, 0.015, z);
  }
  // o ripado: ripas em pé, atravessadas, a cada 46 cm (mais juntas, elas tapavam o carro para a câmera de cima)
  const ripas = Math.round((F - 0.9) / 0.46);
  for (let k = 0; k <= ripas; k++) {
    const z = -F / 2 + 0.35 + k * ((F - 0.9) / ripas);
    por(g, new THREE.Mesh(quina(L + 0.36, 0.15, 0.05, 0.012), madeira), 0, H + 0.195, z);
  }
  // a prateleira do fundo, em mão-francesa de aço, com o regador e dois vasinhos
  por(g, new THREE.Mesh(quina(1.5, 0.05, 0.32, 0.015), madeira), -0.9, 1.25, -F / 2 + 0.2);
  for (const x of [-1.5, -0.3]) por(g, new THREE.Mesh(quina(0.04, 0.26, 0.26, 0.012), aco), x, 1.1, -F / 2 + 0.17);
  const rega = por(g, regador(), -1.25, 1.275, -F / 2 + 0.2);
  rega.rotation.y = 0.7;
  rega.scale.setScalar(0.8);
  for (const [x, cor] of [[-0.75, P.heraClara], [-0.42, P.buxinho]] as const) {
    por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.13, 10), toon(P.vasoDeCimento)), x, 1.34, -F / 2 + 0.2);
    por(g, new THREE.Mesh(new THREE.IcosahedronGeometry(0.085, 1), toon(cor)), x, 1.47, -F / 2 + 0.2);
  }
  return g;
}

// ===================================================== o muro e os portões

/**
 * UM TRECHO DO MURO do jardim (pedido do Renan: no lugar da cerquinha branca,
 * "um muro um pouco mais alto, decorado com plantas só verdes", mais
 * moderno): o pano de reboco claro, a faixa de pedra no pé e o capeamento de
 * grafite, um dedo para fora dos dois lados. Corre ao longo de `X`, centrado.
 * A hera é da cena (`heraNosMuros`, em `plantasDeJardim.ts`): um lote para
 * todos os trechos.
 */
export function muroDoJardim(comprimento: number, alto: number = MURO.alto): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'muro-do-jardim';
  const E = MURO.espessura;
  const pano = new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(comprimento, alto - 0.06, E), 0, alto / 2, 0), toon(P.casaMuro, { mapa: reboco() }));
  por(g, pano, 0, (alto - 0.06) / 2, 0);
  // (a faixa do pé e o capeamento são mais largos que o pano: nenhuma face cai no plano da outra)
  por(g, new THREE.Mesh(quina(comprimento - 0.02, 0.2, E + 0.05, 0.015), toon(P.casaMuroBase)), 0, 0.1, 0);
  por(g, new THREE.Mesh(quina(comprimento + 0.03, 0.07, E + 0.1, 0.02), toon(P.casaGrafite)), 0, alto - 0.035, 0);
  return g;
}

/**
 * O PILAR de um portão: mais alto e mais grosso que o muro, com o mesmo
 * capeamento. `luz` pendura a arandela (a caixinha de grafite com a face de
 * baixo acesa, e o halo) na face da rua.
 */
export function pilarDoMuro(alto: number = MURO.pilar, luz = false): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pilar-do-muro';
  const l = MURO.ladoDoPilar;
  const pano = new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(l, alto - 0.07, l), 0, alto / 2, 0), toon(P.casaMuro, { mapa: reboco() }));
  por(g, pano, 0, (alto - 0.07) / 2, 0);
  por(g, new THREE.Mesh(quina(l + 0.05, 0.2, l + 0.05, 0.015), toon(P.casaMuroBase)), 0, 0.1, 0);
  por(g, new THREE.Mesh(quina(l + 0.1, 0.08, l + 0.1, 0.02), toon(P.casaGrafite)), 0, alto - 0.04, 0);
  if (luz) {
    const y = alto - 0.34;
    por(g, new THREE.Mesh(quina(0.13, 0.2, 0.07, 0.015), toon(P.casaGrafite)), 0, y, l / 2 + 0.03);
    por(g, new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.045).rotateX(Math.PI / 2), toon(P.casaLuzDoMuro, { glow: 1 })), 0, y - 0.102, l / 2 + 0.03);
    // o leque de luz na parede, embaixo dela (luz pintada, sem sombra)
    const leque = pocaDeLuz(0.3, P.casaLuzDoMuro, 0.26, true);
    leque.scale.set(0.8, 1.25, 1);
    por(g, leque, 0, y - 0.36, l / 2 + 0.008);
  }
  return g;
}

/** as ripas deitadas de um portão: de `y0` a `y1`, com a fresta entre elas */
function ripado(pai: THREE.Object3D, largura: number, y0: number, y1: number, x: number, z: number): void {
  const passo = 0.118;
  const n = Math.max(1, Math.floor((y1 - y0) / passo));
  const alto = (y1 - y0) / n;
  for (let k = 0; k < n; k++) {
    por(pai, new THREE.Mesh(quina(largura, alto - 0.026, 0.028, 0.008), toon(P.casaRipa)), x, y0 + (k + 0.5) * alto, z);
  }
}

/**
 * O PORTÃO SOCIAL: o quadro de aço grafite com o ripado de madeira deitado e
 * o puxador em barra. A folha mora no grupo `folha-do-portao`, com a
 * dobradiça na ponta esquerda (`x = −largura/2`); a cena gira o grupo para
 * abrir (o atalho é `userData.folha`).
 */
export function portaoSocial(largura = 1.3, alto = 1.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'portao-do-jardim';
  const aco = toon(P.casaGrafite);
  const folha = new THREE.Group();
  folha.name = 'folha-do-portao';
  folha.position.x = -largura / 2;
  g.add(folha);
  const l = largura - 0.04;
  // o quadro: os dois montantes inteiros, e as travessas ENTRE eles
  for (const x of [0.045, l - 0.025]) por(folha, new THREE.Mesh(quina(0.05, alto - 0.06, 0.045, 0.01), aco), x, 0.06 + (alto - 0.06) / 2, 0);
  for (const y of [0.1, alto - 0.035]) por(folha, new THREE.Mesh(quina(l - 0.12, 0.05, 0.04, 0.01), aco), l / 2 + 0.01, y, 0);
  ripado(folha, l - 0.13, 0.14, alto - 0.075, l / 2 + 0.01, 0);
  // o puxador: a barra de inox em pé, nos dois lados da folha
  for (const z of [-0.05, 0.05]) {
    por(folha, new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.46, 8), toon(P.metalGrey)), l - 0.15, 0.95, z);
    for (const y of [0.76, 1.14]) por(folha, new THREE.Mesh(quina(0.02, 0.02, 0.035, 0.006), toon(P.metalGrey)), l - 0.15, y, z * 0.66);
  }
  g.userData.folha = folha;
  return g;
}

/**
 * O PORTÃO DE CORRER DA GARAGEM (o portão "mais moderno" que o Renan pediu):
 * o quadro de aço com dois montantes no meio, o ripado de madeira deitado, e
 * as roldanas no pé. Corre no trilho (`trilhoDoPortao`), por DENTRO do muro
 * da frente; não tem verga em cima, então o carro — que é mais alto que ele —
 * passa de laço e tudo. A folha é o grupo `folha-do-portao-da-garagem`,
 * centrada: a cena anda o `position.x` dela (o atalho é `userData.folha`).
 */
export function portaoDeCorrer(largura: number = PORTAO_DA_GARAGEM.largura, alto: number = PORTAO_DA_GARAGEM.alto): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'portao-da-garagem';
  const aco = toon(P.casaGrafite);
  const folha = new THREE.Group();
  folha.name = 'folha-do-portao-da-garagem';
  g.add(folha);
  // o quadro: a travessa de baixo (mais alta, é onde vão as roldanas), a de cima, e os quatro montantes
  por(folha, new THREE.Mesh(quina(largura, 0.1, 0.055, 0.012), aco), 0, 0.13, 0);
  por(folha, new THREE.Mesh(quina(largura, 0.06, 0.05, 0.012), aco), 0, alto - 0.03, 0);
  const vaos = 3;
  const vao = (largura - 0.06) / vaos;
  for (let k = 0; k <= vaos; k++) {
    const x = -largura / 2 + 0.03 + k * vao;
    por(folha, new THREE.Mesh(quina(0.06, alto - 0.25, 0.045, 0.012), aco), x, 0.19 + (alto - 0.25) / 2, 0);
    if (k < vaos) ripado(folha, vao - 0.07, 0.2, alto - 0.07, x + vao / 2, 0);
  }
  // as roldanas, e a cremalheira do motor por dentro
  for (const x of [-largura / 2 + 0.5, largura / 2 - 0.5]) {
    por(folha, new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 12).rotateX(Math.PI / 2), toon(P.metalGrey)), x, 0.075, 0);
  }
  por(folha, new THREE.Mesh(quina(largura - 0.2, 0.03, 0.02, 0.006), toon(P.metalGrey)), 0, 0.3, -0.04);
  g.userData.folha = folha;
  return g;
}

/**
 * O TRILHO do portão de correr (a barra chata no chão, do tamanho do portão
 * fechado mais o aberto), o motor (a caixinha cinza com a engrenagem, junto
 * ao pilar) e o guia de cima (as duas roldanas que seguram a folha em pé). A
 * origem é o meio da boca da garagem; a folha corre para o `+X`.
 */
export function trilhoDoPortao(largura: number = PORTAO_DA_GARAGEM.largura, alto: number = PORTAO_DA_GARAGEM.alto): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'trilho-do-portao';
  const aco = toon(P.metalGrey);
  const corre = PORTAO_DA_GARAGEM.corre;
  por(g, new THREE.Mesh(quina(largura + corre + 0.1, 0.02, 0.05, 0.006), aco), corre / 2, 0.01, 0);
  // o motor: por dentro, logo depois da boca
  const xMotor = largura / 2 + 0.32;
  por(g, new THREE.Mesh(quina(0.3, 0.3, 0.2, 0.03), toon(P.casaMuroBase)), xMotor, 0.17, -0.17);
  por(g, new THREE.Mesh(quina(0.32, 0.05, 0.22, 0.02), toon(P.casaGrafite)), xMotor, 0.335, -0.17);
  por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 10).rotateX(Math.PI / 2), aco), xMotor, 0.3, -0.055);
  // o guia de cima: um braço saindo do pilar, com as duas roldanas abraçando a folha
  por(g, new THREE.Mesh(quina(0.05, 0.04, 0.2, 0.01), toon(P.casaGrafite)), largura / 2 + 0.1, alto + 0.05, 0.03);
  for (const z of [-0.045, 0.045]) {
    por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.07, 8), aco), largura / 2 + 0.1, alto - 0.005, z);
  }
  return g;
}

/**
 * O PAINEL DO PORTÃO, chumbado no pilar: o interfone (a placa de grafite com
 * a grelha do alto-falante, a lente da câmera e o botão) e, embaixo, a boca
 * de cartas de inox. Sai para o `+Z`; a origem é o meio do interfone.
 */
export function painelDoPortao(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'painel-do-portao';
  const aco = toon(P.metalGrey);
  por(g, new THREE.Mesh(quina(0.15, 0.24, 0.03, 0.012), toon(P.casaGrafite)), 0, 0, 0.015);
  for (let k = 0; k < 4; k++) por(g, new THREE.Mesh(quina(0.085, 0.01, 0.006, 0.002), aco), 0, 0.03 + k * 0.022, 0.032);
  por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 10).rotateX(Math.PI / 2), toon(P.glass)), 0, -0.02, 0.034);
  por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.014, 10).rotateX(Math.PI / 2), aco), 0, -0.075, 0.035);
  // a boca de cartas
  por(g, new THREE.Mesh(quina(0.26, 0.09, 0.02, 0.01), aco), 0, -0.3, 0.01);
  por(g, new THREE.Mesh(quina(0.2, 0.022, 0.012, 0.004), toon(P.casaGrafite)), 0, -0.295, 0.02);
  return g;
}
