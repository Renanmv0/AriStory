import * as THREE from 'three';
import { flat, toon } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * A PAREDE DA RUA POR DENTRO (a casa do Ari): a parede da frente da sala, com a
 * porta no MEIO e uma janela de cada lado — as mesmas duas janelas e a mesma
 * porta centrada da fachada que se vê de fora (`world/frenteDaCasa.ts`: porta no
 * meio, janelas em `±2,75`). Pedido do Renan: "a casa do lado de fora não
 * combina com a do lado de dentro".
 *
 * COMO ELA É: UMA parede (forma extrudada) com a porta recortada até o chão e
 * as janelas como FUROS de verdade — o vão ganha o batente de reboco por
 * dentro de graça. É a parede que a câmera vê DE TRÁS (a câmera vem de `+X/+Z`,
 * e esta parede está do lado dela), por isso o que decide o desenho é isto:
 *
 * - **o vidro é de UMA face só, virada para dentro da sala.** Visto de trás (da
 *   câmera) ele não existe: o furo da janela fica aberto, e dá para ver a sala
 *   por ele. Visto de dentro (girando a câmera com Q/R) ele aparece, um véu
 *   azulado. Não é prédio que some quando alguém passa (a câmera gira, e o
 *   Renan cortou isso): é a PEÇA que é feita assim, sempre igual;
 * - o caixilho e a cruz ficam, de qualquer lado: são o que faz o furo ler
 *   "janela" visto de trás;
 * - o vão embaixo do peitoril (1 m) esconde só 1,5 m de chão atrás da parede,
 *   e o do cabeçalho (acima de 2,25) só uma faixa estreita: pela janela dá
 *   para ver o miolo da sala.
 *
 * Origem: o meio da parede em `x = 0`, o eixo da parede em `z = 0`, a frente da
 * sala (a face de dentro) olhando para `−Z`.
 */

export interface JanelaDaSala {
  /** o meio da janela, no `x` do mundo */
  readonly x: number;
  readonly largura: number;
  /** a altura do peitoril */
  readonly y0: number;
  readonly alto: number;
}

export interface ParedeDaRua {
  /** meia largura da parede alta */
  readonly meia: number;
  readonly alto: number;
  readonly espessura: number;
  /** o vão da porta: aberto até o chão */
  readonly vao: { readonly x0: number; readonly x1: number; readonly alto: number };
  readonly janelas: readonly JanelaDaSala[];
}

/** uma janela com caixilho, cruz, peitoril, vidro de uma face só e cortina, centrada no eixo da parede */
function janelaDeDentro(j: JanelaDaSala, espessura: number): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'janela-da-sala';
  const branco = toon(P.metalWhite);
  const L = j.largura;
  const A = j.alto;
  const cy = j.y0 + A / 2;
  const fundo = 0.1; // a espessura do caixilho (bem menos que a da parede)
  // as quatro barras do caixilho: cada uma entra 2 cm na parede (nenhuma face no plano do furo)
  const barra = (l: number, a: number, x: number, y: number): THREE.Mesh => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(l, a, fundo), branco);
    m.position.set(x, y, 0);
    return m;
  };
  const E = 0.08;
  g.add(barra(L + 0.04, E, j.x, j.y0 + E / 2 - 0.02));
  g.add(barra(L + 0.04, E, j.x, j.y0 + A - E / 2 + 0.02));
  g.add(barra(E, A + 0.04, j.x - L / 2 + E / 2 - 0.02, cy));
  g.add(barra(E, A + 0.04, j.x + L / 2 - E / 2 + 0.02, cy));
  // a cruz: o montante no meio e a travessa um terço acima (finos: 3 cm)
  g.add(barra(0.035, A - E, j.x, cy));
  g.add(barra(L - E, 0.035, j.x, j.y0 + A * 0.62));
  // o peitoril, saindo para dentro da sala
  const peitoril = new THREE.Mesh(new THREE.BoxGeometry(L + 0.24, 0.05, espessura * 0.5 + 0.12), branco);
  peitoril.position.set(j.x, j.y0 + 0.005, -(espessura * 0.25 + 0.0));
  g.add(peitoril);
  // O VIDRO: um plano de UMA face, virado para `−Z` (para dentro). De trás ele some.
  const vidro = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.06, A - 0.06), flat(P.glass, 0.4));
  vidro.rotation.y = Math.PI;
  vidro.position.set(j.x, cy, 0);
  vidro.userData.semSombra = true;
  g.add(vidro);
  // a cortina: o varão e dois panos recolhidos nos lados, na face de dentro
  const cortina = toon(P.cortinaDaSala);
  const zc = -(espessura / 2 + 0.06);
  const varao = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, L + 0.5, 8).rotateZ(Math.PI / 2), toon(P.metalGrey));
  varao.position.set(j.x, j.y0 + A + 0.16, zc);
  g.add(varao);
  for (const lado of [-1, 1]) {
    const pano = new THREE.Mesh(new THREE.BoxGeometry(0.32, A + 0.3, 0.07), cortina);
    pano.position.set(j.x + lado * (L / 2 + 0.06), j.y0 + A / 2 + 0.06, zc);
    g.add(pano);
    // as pregas: três varetas de pano mais claras na frente do pano
    for (let k = -1; k <= 1; k++) {
      const prega = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, A + 0.28, 6), cortina);
      prega.position.set(pano.position.x + k * 0.1, pano.position.y, zc - 0.045);
      g.add(prega);
    }
    const laco = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.12), toon(P.metalGrey));
    laco.position.set(pano.position.x, j.y0 + A * 0.35, zc - 0.02);
    g.add(laco);
  }
  return g;
}

/**
 * A parede alta, com o vão da porta e os furos das janelas, e as janelas
 * montadas nos furos. A cena põe o colisor dos dois pedaços (a janela não tem:
 * o peitoril fecha a passagem).
 */
export function paredeDaRuaPorDentro(p: ParedeDaRua): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'parede-da-rua';
  const forma = new THREE.Shape();
  forma.moveTo(-p.meia, 0);
  forma.lineTo(p.vao.x0, 0);
  forma.lineTo(p.vao.x0, p.vao.alto);
  forma.lineTo(p.vao.x1, p.vao.alto);
  forma.lineTo(p.vao.x1, 0);
  forma.lineTo(p.meia, 0);
  forma.lineTo(p.meia, p.alto);
  forma.lineTo(-p.meia, p.alto);
  forma.closePath();
  for (const j of p.janelas) {
    const furo = new THREE.Path();
    furo.moveTo(j.x - j.largura / 2, j.y0);
    furo.lineTo(j.x + j.largura / 2, j.y0);
    furo.lineTo(j.x + j.largura / 2, j.y0 + j.alto);
    furo.lineTo(j.x - j.largura / 2, j.y0 + j.alto);
    furo.closePath();
    forma.holes.push(furo);
  }
  const geo = new THREE.ExtrudeGeometry(forma, { depth: p.espessura, bevelEnabled: false });
  geo.translate(0, 0, -p.espessura / 2);
  g.add(new THREE.Mesh(geo, toon(P.wallCream)));
  for (const j of p.janelas) g.add(janelaDeDentro(j, p.espessura));
  return g;
}
