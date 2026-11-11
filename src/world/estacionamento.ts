import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { novaTextura } from './texturasDeChao';
import { macia } from './moveisDaBoutique';
import { quina } from './lojaDeRoupas';

/**
 * ================================================== AS PEÇAS DO ESTACIONAMENTO
 *
 * O estacionamento do Villa Lobos, do outro lado da rua do ônibus — onde o
 * Bebito Mobile para quando a dupla vai de carro ao parque (pedido do Renan,
 * `docs/BEBITO-MOBILE.md`). A cena (`eventos/bebitoMobile/noParque.ts`) monta
 * o chão, a pintura e a cerca viva; aqui moram as peças:
 *
 *  - o CARRO ESTACIONADO dos outros (um hatch pequeno e fofo, leve: é fundo,
 *    e cada um são poucos pedaços de quina macia);
 *  - a CANCELA da entrada, com o braço que sobe sozinho;
 *  - o TOTEM de pagamento, a PLACA azul do "P" e a PLAQUINHA da vaga do
 *    Bebito, com o coração.
 */

/** as medidas do carro dos outros: menor que o Bebito Mobile (que é uma vanzinha) */
export const CARRO_ESTACIONADO = { comprimento: 4.4, largura: 2.0, alto: 1.75 } as const;

/**
 * O CARRO DOS OUTROS: um hatch redondinho — a caixa de baixo de quina macia,
 * a cabine de vidro com as colunas e o teto da cor do carro, as rodas de
 * calota, os faróis redondos, as lanternas e os para-choques. O nariz no
 * `+Z`, a base no chão. Peça de fundo: nada aqui se mexe nem tem nome.
 */
export function carroEstacionado(cor: number = P.carroVermelho): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'carro-estacionado';
  const { comprimento: L, largura: W } = CARRO_ESTACIONADO;
  const lata = toon(cor);
  const por = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  // a carroceria: a caixa de baixo, com o capô um tico mais baixo que a traseira
  por(macia(W, 0.66, L, 0.24), lata, 0, 0.55, 0);
  por(macia(W - 0.06, 0.16, L * 0.32, 0.07), lata, 0, 0.9, L * 0.31);
  // a cabine: o vidro (um fio para dentro), as quatro colunas e o teto
  const cabine = { l: L * 0.56, z: -L * 0.08, y0: 0.86, alto: 0.6 };
  por(macia(W - 0.24, cabine.alto, cabine.l, 0.12), toon(P.carroVidro), 0, cabine.y0 + cabine.alto / 2, cabine.z);
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const coluna = por(quina(0.09, cabine.alto, 0.1, 0.02), lata, x * (W / 2 - 0.15), cabine.y0 + cabine.alto / 2, cabine.z + z * (cabine.l / 2 - 0.08));
      coluna.rotation.x = z * -0.18;
    }
    // a coluna do meio
    por(quina(0.08, cabine.alto, 0.12, 0.02), lata, x * (W / 2 - 0.14), cabine.y0 + cabine.alto / 2, cabine.z - 0.05);
  }
  por(macia(W - 0.16, 0.11, cabine.l + 0.06, 0.05), lata, 0, cabine.y0 + cabine.alto + 0.03, cabine.z);
  // as rodas: o pneu e a calota, um fio para fora da lataria
  const pneu = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 14).rotateZ(Math.PI / 2);
  const calota = new THREE.CylinderGeometry(0.17, 0.17, 0.05, 12).rotateZ(Math.PI / 2);
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      por(pneu, toon(P.pneu), x * (W / 2 - 0.1), 0.34, z * L * 0.31);
      por(calota, toon(P.metalGrey), x * (W / 2 + 0.03), 0.34, z * L * 0.31);
    }
  }
  // os faróis, as lanternas e os para-choques
  const farol = new THREE.SphereGeometry(0.11, 10, 8);
  for (const x of [-1, 1]) {
    const f = por(farol, toon(P.casaLuzDoMuro, { glow: 0.25 }), x * (W / 2 - 0.3), 0.7, L / 2 - 0.02);
    f.scale.set(1, 1, 0.55);
    por(quina(0.3, 0.12, 0.06, 0.02), toon(P.semaforoVermelho), x * (W / 2 - 0.26), 0.74, -L / 2 + 0.01);
  }
  for (const z of [-1, 1]) por(macia(W + 0.04, 0.16, 0.22, 0.06), toon(P.carroParaChoque), 0, 0.32, z * (L / 2 - 0.04));
  return g;
}

/** a listra do braço da cancela: vermelho e branco (a cor vem pintada; o material é branco) */
function listraDaCancela(): THREE.CanvasTexture {
  return novaTextura('listra-da-cancela', 0.8, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#e2513f';
    ctx.fillRect(0, 0, s / 2, s);
  }, 32);
}

/**
 * A CANCELA da entrada: a caixa de grafite com a faixa amarela e o braço
 * listrado de vermelho e branco, com o pezinho de apoio na ponta. O braço
 * corre ao longo do `+X` (a cena gira a peça) e SOBE sozinho quando alguém
 * chega perto (`update(dt, perto)`), devagar no começo e no fim.
 */
export class Cancela {
  readonly group = new THREE.Group();
  private readonly braco = new THREE.Group();
  private aberta = 0;

  constructor(readonly comprimento = 3.4) {
    this.group.userData.peca = 'cancela';
    const caixa = new THREE.Mesh(macia(0.36, 1.0, 0.36, 0.05), toon(P.casaGrafite));
    caixa.position.y = 0.5;
    this.group.add(caixa);
    const faixa = new THREE.Mesh(macia(0.38, 0.12, 0.38, 0.03), toon(P.cancelaAmarela));
    faixa.position.y = 0.78;
    this.group.add(faixa);
    this.braco.name = 'braco-da-cancela';
    this.braco.position.set(0.12, 0.92, 0);
    this.group.add(this.braco);
    const geo = new THREE.BoxGeometry(comprimento, 0.09, 0.07);
    // (o UV em metros ao longo do braço: as listras saem do mesmo tamanho em qualquer cancela)
    const uv = geo.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * comprimento, uv.getY(i) * 0.09);
    geo.translate(comprimento / 2, 0, 0);
    this.braco.add(new THREE.Mesh(geo, toon(0xffffff, { mapa: listraDaCancela() })));
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), toon(P.semaforoVermelho));
    ponta.position.x = comprimento;
    this.braco.add(ponta);
    // o pezinho onde o braço descansa
    const pe = new THREE.Mesh(quina(0.08, 0.86, 0.08, 0.02), toon(P.casaGrafite));
    pe.position.set(comprimento - 0.15, 0.43, 0);
    this.group.add(pe);
  }

  update(dt: number, perto: boolean): void {
    this.aberta = Math.max(0, Math.min(1, this.aberta + (perto ? 1 : -1) * dt * 0.9));
    const k = this.aberta * this.aberta * (3 - 2 * this.aberta);
    this.braco.rotation.z = k * 1.38;
  }
}

/** um quadrinho de canvas com o desenho de `pintar`, para placa e tela */
function quadro(chave: string, pintar: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const tex = novaTextura(chave, 1, pintar, 256).clone();
  tex.needsUpdate = true;
  tex.repeat.set(1, 1);
  return tex;
}

/**
 * O TOTEM DE PAGAMENTO: a coluna de grafite com a tela acesa (o "P" e o
 * "pague aqui"), a fenda do tíquete e o botão. A frente no `+Z`.
 */
export function totemDePagamento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'totem-de-pagamento';
  const corpo = new THREE.Mesh(macia(0.46, 1.4, 0.32, 0.08), toon(P.casaGrafite));
  corpo.position.y = 0.7;
  g.add(corpo);
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.3), toon(0xffffff, {
    glow: 0.5,
    mapa: quadro('tela-do-totem', (ctx, s) => {
      ctx.fillStyle = '#2f7fd0';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(s * 0.5)}px Nunito, sans-serif`;
      ctx.fillText('P', s / 2, s * 0.42);
      ctx.font = `800 ${Math.round(s * 0.13)}px Nunito, sans-serif`;
      ctx.fillText('pague aqui', s / 2, s * 0.82);
    }),
  }));
  tela.position.set(0, 1.12, 0.161);
  g.add(tela);
  const fenda = new THREE.Mesh(quina(0.2, 0.03, 0.02, 0.006), toon(P.metalGrey));
  fenda.position.set(0, 0.86, 0.165);
  g.add(fenda);
  const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10).rotateX(Math.PI / 2), toon(P.cancelaAmarela));
  botao.position.set(0.12, 0.74, 0.17);
  g.add(botao);
  return g;
}

/** a placa azul do estacionamento: o "P" branco num quadrado de canto redondo, num poste. A face no `+Z` */
export function placaDeEstacionamento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-de-estacionamento';
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 2.6, 8), toon(P.metalGrey));
  poste.position.y = 1.3;
  g.add(poste);
  const chapa = new THREE.Mesh(quina(0.86, 0.86, 0.04, 0.02), toon(P.placaVerso));
  chapa.position.set(0, 2.3, 0.03);
  g.add(chapa);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.82), toon(0xffffff, {
    mapa: quadro('placa-do-p', (ctx, s) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#2f7fd0';
      ctx.beginPath();
      ctx.roundRect(s * 0.06, s * 0.06, s * 0.88, s * 0.88, s * 0.12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(s * 0.66)}px Nunito, sans-serif`;
      ctx.fillText('P', s / 2, s * 0.54);
    }),
  }));
  face.position.set(0, 2.3, 0.052);
  g.add(face);
  return g;
}

/**
 * A PLAQUINHA DA VAGA DO BEBITO: rosa, de canto redondo, com o coração e
 * "BEBITO MOBILE", num pezinho baixo. É o que diz que aquela vaga é deles. A
 * face no `+Z`.
 */
export function plaquinhaDaVaga(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'plaquinha-da-vaga';
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.3, 8), toon(P.metalWhite));
  poste.position.y = 0.65;
  g.add(poste);
  const chapa = new THREE.Mesh(quina(0.74, 0.5, 0.035, 0.03), toon(P.metalWhite));
  chapa.position.set(0, 1.42, 0.025);
  g.add(chapa);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.46), toon(0xffffff, {
    mapa: quadro('plaquinha-da-vaga', (ctx, s) => {
      ctx.fillStyle = '#ffd3df';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#ff6b8b';
      // o coração no alto (a plaquinha é larga: o canvas quadrado é esticado, então o coração é desenhado mais estreito)
      const cx = s / 2;
      const cy = s * 0.3;
      const r = s * 0.11;
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 1.2);
      ctx.bezierCurveTo(cx - r * 1.3, cy + r * 0.2, cx - r * 0.75, cy - r * 1.05, cx, cy - r * 0.3);
      ctx.bezierCurveTo(cx + r * 0.75, cy - r * 1.05, cx + r * 1.3, cy + r * 0.2, cx, cy + r * 1.2);
      ctx.fill();
      ctx.fillStyle = '#b8324f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(s * 0.17)}px Nunito, sans-serif`;
      ctx.fillText('BEBITO', s / 2, s * 0.63, s * 0.9);
      ctx.font = `800 ${Math.round(s * 0.12)}px Nunito, sans-serif`;
      ctx.fillText('MOBILE', s / 2, s * 0.83, s * 0.9);
    }),
  }));
  face.position.set(0, 1.42, 0.045);
  g.add(face);
  return g;
}

/** o coração pintado no chão da vaga do Bebito: a forma deitada, olhando para cima */
export function geoCoracaoNoChao(tamanho: number): THREE.BufferGeometry {
  const t = tamanho;
  const s = new THREE.Shape();
  s.moveTo(0, -0.5 * t);
  s.bezierCurveTo(-0.15 * t, -0.3 * t, -0.5 * t, -0.05 * t, -0.5 * t, 0.18 * t);
  s.bezierCurveTo(-0.5 * t, 0.42 * t, -0.22 * t, 0.52 * t, 0, 0.3 * t);
  s.bezierCurveTo(0.22 * t, 0.52 * t, 0.5 * t, 0.42 * t, 0.5 * t, 0.18 * t);
  s.bezierCurveTo(0.5 * t, -0.05 * t, 0.15 * t, -0.3 * t, 0, -0.5 * t);
  const geo = new THREE.ShapeGeometry(s, 10);
  geo.rotateX(-Math.PI / 2);
  return geo;
}
