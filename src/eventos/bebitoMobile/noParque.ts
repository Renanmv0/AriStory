import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Interactable } from '../../world/Interactable';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { ARI, RENAN } from '../../characters/cast';
import { BEBITO_MOBILE, BebitoMobile } from '../../world/bebitoMobile/BebitoMobile';
import { fundir, fundirComoFundo } from '../../world/fundir';
import { lamp, meioFio, sebe, tree } from '../../world/props';
import { asfalto, calcadaDePedrinha } from '../../world/texturasDeChao';
import { quina } from '../../world/lojaDeRoupas';
import {
  CARRO_ESTACIONADO, Cancela, carroEstacionado, geoCoracaoNoChao, placaDeEstacionamento, plaquinhaDaVaga,
  totemDePagamento,
} from '../../world/estacionamento';
import { FASES_DO_PRESENTE, FLAG_DO_CARRO_NO_PARQUE, bebitoMobileNestaPagina } from '../BebitoMobile';
import { sairDeCarro } from './partida';

/**
 * ================================== O ESTACIONAMENTO DO VILLA LOBOS (e o carro nele)
 *
 * Pedido do Renan: "do outro lado da rua que fica o ônibus, quero que tenha
 * um estacionamento — que será onde pararemos o Bebito Mobile".
 *
 * É uma CAMADA do parque (o molde do Halloween): a cena do Villa Lobos só faz
 * uma chamada, e sem a chave do carro (`eventos/BebitoMobile.ts`) nada daqui
 * existe — nem o estacionamento, nem a faixa, e a área de andar do parque
 * continua acabando na rua.
 *
 * A PLANTA (a rua corre ao longo do `z`; o parque fica no `−X`):
 *
 *    parque │calçada│  a rua   │calçada│ ▓ cerca viva ▓ ┌────── o estacionamento ──────┐
 *           │       │ ônibus ▮ │       │                │ fila A │ corredor │ fila B  │
 *           │       │  ░faixa░ │       │  passagem ──▶  │ ♥ vaga do Bebito           │
 *           │       │          │       │  cancela  ──▶  │ (a entrada dos carros)      │
 *
 * - a FAIXA DE PEDESTRES atravessa a rua logo atrás do ônibus (`z = 3`), e do
 *   lado de lá a cerca viva abre uma passagem que dá direto na vaga do Bebito;
 * - a ENTRADA dos carros é na ponta de baixo (`−Z`), com a cancela;
 * - duas FILAS de vagas, de frente uma para a outra, com o corredor no meio
 *   (setas pintadas: mão única); a vaga do Bebito é rosa, com o coração no
 *   chão e a plaquinha com o nome — vazia quando o carro está em casa;
 * - alguns CARROS dos outros, para o lugar ler como estacionamento;
 * - o que é alto fica no fundo (`−Z`, e a rua no `−X`): do lado da câmera só
 *   cerca viva baixa.
 */

/** a calçada do outro lado da rua, o estacionamento e as filas (no mundo do parque) */
const CALCADA_DE_LA = { x0: 45.2, x1: 48.2 };
const LOTE = { x0: 48.2, x1: 64.4, z0: -12.6, z1: 12.6 };
const FILA_A = { x0: 49.2, x1: 54.6 };
const FILA_B = { x0: 58.4, x1: 64.0 };
const CORREDOR = { x0: 54.6, x1: 58.4 };
/** a passagem de pedestres e a entrada dos carros, na cerca viva da rua */
const PASSAGEM = { z0: 2.0, z1: 4.0 };
const ENTRADA = { z0: -12.6, z1: -9.0 };
/** a faixa de pedestres na rua, atrás do ônibus */
const FAIXA = { z: 3, x0: 36.6, x1: 45.0 };
/** a linha da cerca viva da rua (o meio dela) */
const X_DA_SEBE = 48.65;

/** onde o Bebito estaciona — de nariz para a rua, de frente para o parque — e onde a dupla desce */
export const VAGA_NO_PARQUE = { x: (FILA_A.x0 + FILA_A.x1) / 2, z: 5.5, giro: -Math.PI / 2 } as const;
export const DESCIDA_NO_PARQUE = { x: 51.2, z: 3.0, facing: -Math.PI / 2 } as const;
/** a área de andar do parque com o estacionamento (a de sempre acaba na rua, em `x = 44`) */
const LIMITE_LESTE = LOTE.x1;

/** o estacionamento existe nesta página? (a chave do carro) */
export function estacionamentoNoParque(): boolean {
  return bebitoMobileNestaPagina();
}

/**
 * MONTA O ESTACIONAMENTO do outro lado da rua. A cena chama no fim do
 * `build`, depois de pôr a rua.
 */
export function montarEstacionamento(w: WorldBuilder): void {
  if (!estacionamentoNoParque()) return;
  const g = w.game;
  w.setBounds(w.bounds.minX, w.bounds.minZ, LIMITE_LESTE, w.bounds.maxZ);

  // ------------------------------------------------------------------ o chão
  /** um decalque de chão com a geometria trocada (a fila de pintura vem do `w.patch`) */
  const pintar = (cor: number, partes: THREE.BufferGeometry[], y: number): void => {
    const decal = w.patch(0, 0, 1, 1, cor, 0, y);
    decal.geometry.dispose();
    decal.geometry = mergeGeometries(partes);
    decal.position.x = 0;
    decal.position.z = 0;
  };
  /** um retângulo deitado no mundo (para a pintura): de `x0` a `x1`, de `z0` a `z1` */
  const faixa = (x0: number, x1: number, z0: number, z1: number): THREE.BufferGeometry =>
    // (a geometria vai no quadro do decalque, que é deitado: o `y` dele é o `−z` do mundo)
    new THREE.PlaneGeometry(x1 - x0, z1 - z0).translate((x0 + x1) / 2, -(z0 + z1) / 2, 0);
  const COMPRIMENTO_DA_RUA = 80;
  w.patch((CALCADA_DE_LA.x0 + CALCADA_DE_LA.x1) / 2, 0, CALCADA_DE_LA.x1 - CALCADA_DE_LA.x0, COMPRIMENTO_DA_RUA, P.concrete, 0, 0.014, calcadaDePedrinha());
  w.add(w.place(meioFio(COMPRIMENTO_DA_RUA), CALCADA_DE_LA.x0, 0, 0));
  w.patch((LOTE.x0 + LOTE.x1) / 2, (LOTE.z0 + LOTE.z1) / 2, LOTE.x1 - LOTE.x0, LOTE.z1 - LOTE.z0, P.asphalt, 0, 0.016, asfalto());
  // a entrada dos carros atravessa a calçada
  w.patch((CALCADA_DE_LA.x0 + CALCADA_DE_LA.x1) / 2 + 0.3, (ENTRADA.z0 + ENTRADA.z1) / 2, CALCADA_DE_LA.x1 - CALCADA_DE_LA.x0 + 0.6, ENTRADA.z1 - ENTRADA.z0, P.asphalt, 0, 0.02, asfalto());

  // A PINTURA (branca): as divisas das vagas, as setas do corredor e a zebra da passagem
  const branco: THREE.BufferGeometry[] = [];
  const LINHA = 0.12;
  // fila A: a entrada embaixo, quatro vagas, a passagem, a vaga do Bebito (rosa) e mais duas
  for (const z of [-9.0, -6.25, -3.5, -0.75, 2.0, 7.0, 9.8]) branco.push(faixa(FILA_A.x0, FILA_A.x1, z - LINHA / 2, z + LINHA / 2));
  // fila B: nove vagas
  for (let k = 0; k <= 9; k++) {
    const z = LOTE.z0 + k * 2.8;
    branco.push(faixa(FILA_B.x0, FILA_B.x1, z - LINHA / 2, z + LINHA / 2));
  }
  // o fim das vagas, do lado do corredor (uma linha de cada fila)
  branco.push(faixa(FILA_A.x1 - LINHA, FILA_A.x1, -9.0, 2.0), faixa(FILA_A.x1 - LINHA, FILA_A.x1, 7.0, LOTE.z1));
  branco.push(faixa(FILA_B.x0, FILA_B.x0 + LINHA, LOTE.z0, LOTE.z1));
  // a zebra da passagem de pedestres, de um lado ao outro da fila A
  for (let x = FILA_A.x0 + 0.3; x < FILA_A.x1 - 0.2; x += 0.85) branco.push(faixa(x, x + 0.42, PASSAGEM.z0 + 0.15, PASSAGEM.z1 - 0.15));
  // as setas do corredor: mão única, de quem entra embaixo
  const seta = (cx: number, cz: number): void => {
    branco.push(faixa(cx - 0.11, cx + 0.11, cz - 1.0, cz + 0.4));
    const ponta = new THREE.Shape();
    ponta.moveTo(-0.42, 0);
    ponta.lineTo(0.42, 0);
    ponta.lineTo(0, 0.6);
    ponta.lineTo(-0.42, 0);
    // (deitada no quadro do decalque: a ponta aponta para o +z do mundo, que é o −y dele)
    const geo = new THREE.ShapeGeometry(ponta).scale(1, -1, 1).translate(cx, -(cz + 0.4), 0);
    geo.deleteAttribute('uv');
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geo.getAttribute('position').count * 2), 2));
    // (o espelho no `y` vira a face para baixo: o índice é refeito ao contrário)
    const idx = geo.getIndex();
    if (idx) for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i + 1); idx.setX(i + 1, idx.getX(i + 2)); idx.setX(i + 2, a); }
    branco.push(geo.index ? geo.toNonIndexed() : geo);
  };
  seta((CORREDOR.x0 + CORREDOR.x1) / 2, -5);
  seta((CORREDOR.x0 + CORREDOR.x1) / 2, 6);
  pintar(P.metalWhite, branco.map((b) => (b.index ? b.toNonIndexed() : b)), 0.022);

  // A VAGA DO BEBITO: as divisas em rosa e o coração no meio dela
  const rosa: THREE.BufferGeometry[] = [];
  for (const z of [4.0, 7.0]) rosa.push(faixa(FILA_A.x0, FILA_A.x1, z - LINHA / 2, z + LINHA / 2));
  rosa.push(faixa(FILA_A.x1 - LINHA, FILA_A.x1, 4.0, 7.0));
  pintar(P.vagaRosa, rosa.map((b) => b.toNonIndexed()), 0.024);
  const coracao = w.patch(VAGA_NO_PARQUE.x, VAGA_NO_PARQUE.z, 1, 1, P.vagaRosa, 0, 0.026);
  coracao.geometry.dispose();
  // (o coração aponta para a rua: a ponta para o −X, de onde o carro entra de nariz)
  coracao.geometry = geoCoracaoNoChao(1.6).rotateX(Math.PI / 2).rotateZ(-Math.PI / 2);

  // A FAIXA DE PEDESTRES na rua, atrás do ônibus
  const zebra: THREE.BufferGeometry[] = [];
  for (let x = FAIXA.x0 + 0.05; x < FAIXA.x1; x += 0.95) zebra.push(faixa(x, x + 0.5, FAIXA.z - 1.5, FAIXA.z + 1.5).toNonIndexed());
  pintar(P.metalWhite, zebra, 0.03);

  // ------------------------------------------------- as peças paradas (fundo)
  const fundo = new THREE.Group();
  fundo.userData.peca = 'estacionamento';
  const por = (peca: THREE.Object3D, x: number, z: number, giro = 0): void => {
    peca.position.set(x, 0, z);
    peca.rotation.y = giro;
    fundo.add(peca);
  };
  // A CERCA VIVA: na linha da rua (com a entrada e a passagem), e fechando o lote em cima, embaixo e no fundo
  const trechosDaSebe: Array<[number, number]> = [[-34, ENTRADA.z0], [ENTRADA.z1, PASSAGEM.z0], [PASSAGEM.z1, 32]];
  for (const [z0, z1] of trechosDaSebe) {
    por(sebe(z1 - z0, 1.0), X_DA_SEBE, (z0 + z1) / 2, Math.PI / 2);
    w.blockBox(X_DA_SEBE, (z0 + z1) / 2, 0.45, (z1 - z0) / 2);
  }
  for (const z of [LOTE.z0 - 0.45, LOTE.z1 + 0.45]) {
    por(sebe(LOTE.x1 - LOTE.x0 + 0.4, 0.95), (LOTE.x0 + LOTE.x1) / 2 + 0.2, z);
    w.blockBox((LOTE.x0 + LOTE.x1) / 2, z, (LOTE.x1 - LOTE.x0) / 2, 0.45);
  }
  por(sebe(LOTE.z1 - LOTE.z0 + 1.8, 0.85), LOTE.x1 + 0.45, (LOTE.z0 + LOTE.z1) / 2, Math.PI / 2);
  // os batentes de concreto na cabeça de cada vaga (onde a roda encosta)
  const batente = quina(0.22, 0.13, 1.7, 0.03);
  const batentes: Array<[number, number]> = [];
  for (const z of [-7.62, -4.87, -2.12, 0.62, 8.4, 11.2]) batentes.push([FILA_A.x0 + 0.35, z]);
  for (let k = 0; k < 9; k++) batentes.push([FILA_B.x1 - 0.35, LOTE.z0 + 1.4 + k * 2.8]);
  for (const [x, z] of batentes) {
    const b = new THREE.Mesh(batente, toon(P.concrete));
    b.position.set(x, 0.065, z);
    fundo.add(b);
  }
  // os carros dos outros: um na fila A, três na fila B (de nariz para dentro da vaga)
  const CARROS: Array<[number, number, number, number]> = [
    [FILA_A.x0 + CARRO_ESTACIONADO.comprimento / 2 + 0.45, -4.87, -Math.PI / 2, P.carroVermelho],
    [FILA_B.x1 - CARRO_ESTACIONADO.comprimento / 2 - 0.45, LOTE.z0 + 1.4 + 1 * 2.8, Math.PI / 2, P.carroAmarelo],
    [FILA_B.x1 - CARRO_ESTACIONADO.comprimento / 2 - 0.45, LOTE.z0 + 1.4 + 4 * 2.8, Math.PI / 2, P.carroMenta],
    [FILA_B.x1 - CARRO_ESTACIONADO.comprimento / 2 - 0.45, LOTE.z0 + 1.4 + 7 * 2.8, Math.PI / 2, P.carroLilas],
  ];
  for (const [x, z, giro, cor] of CARROS) {
    por(carroEstacionado(cor), x, z, giro);
    w.blockBox(x, z, CARRO_ESTACIONADO.comprimento / 2 - 0.1, CARRO_ESTACIONADO.largura / 2 - 0.05);
  }
  // as árvores: no fundo (`−Z`), atrás da cerca viva de baixo, e nos canteiros da calçada longe do ponto
  for (const [x, z, k] of [[51, -15.8, 1.25], [56.5, -16.6, 1.5], [62, -15.4, 1.2], [58.7, -20, 1.6]] as const) por(tree('redonda', k, x * 0.13), x, z, x);
  for (const z of [-30, -22, -16.2, 28]) {
    por(tree('redonda', 0.95, z * 0.07), (CALCADA_DE_LA.x0 + CALCADA_DE_LA.x1) / 2 + 0.3, z, z);
    w.blockCircle((CALCADA_DE_LA.x0 + CALCADA_DE_LA.x1) / 2 + 0.3, z, 0.4);
  }
  // dois postes nas pontas do corredor
  for (const z of [LOTE.z0 + 0.6, LOTE.z1 - 0.6]) {
    por(lamp(), (CORREDOR.x0 + CORREDOR.x1) / 2, z);
    w.blockCircle((CORREDOR.x0 + CORREDOR.x1) / 2, z, 0.25);
  }
  // o totem de pagamento, a placa do P (uma na entrada, uma na passagem) e a plaquinha da vaga
  por(totemDePagamento(), CALCADA_DE_LA.x1 - 0.35, PASSAGEM.z1 + 0.55, -Math.PI / 2);
  w.blockCircle(CALCADA_DE_LA.x1 - 0.35, PASSAGEM.z1 + 0.55, 0.3);
  por(placaDeEstacionamento(), CALCADA_DE_LA.x1 - 0.25, ENTRADA.z0 - 0.5, -Math.PI / 2);
  por(placaDeEstacionamento(), CALCADA_DE_LA.x1 - 0.3, PASSAGEM.z0 - 0.45, -Math.PI / 2);
  for (const z of [ENTRADA.z0 - 0.5, PASSAGEM.z0 - 0.45]) w.blockCircle(CALCADA_DE_LA.x1 - 0.28, z, 0.15);
  por(plaquinhaDaVaga(), FILA_A.x1 - 0.3, PASSAGEM.z1 - 0.12, Math.PI / 2 + 0.35);
  w.blockCircle(FILA_A.x1 - 0.3, PASSAGEM.z1 - 0.12, 0.12);
  w.add(fundirComoFundo(fundo));

  // A CANCELA na entrada: sobe quando alguém chega perto
  const cancela = new Cancela(ENTRADA.z1 - ENTRADA.z0 - 0.4);
  cancela.group.position.set(X_DA_SEBE, 0, ENTRADA.z0 + 0.25);
  cancela.group.rotation.y = -Math.PI / 2;
  w.add(fundir(cancela.group));
  w.blockCircle(X_DA_SEBE, ENTRADA.z0 + 0.25, 0.25);
  w.onUpdate((dt) => {
    const p = g.playerPosition();
    cancela.update(dt, Math.abs(p.x - X_DA_SEBE) < 3.2 && p.z > ENTRADA.z0 - 1.5 && p.z < ENTRADA.z1 + 1.5);
  });
}

/**
 * O BEBITO MOBILE NO VILLA LOBOS: quando a dupla chega de carro, ele está na
 * vaga dele no estacionamento, e é por ele que se volta para casa — o "Voltar
 * pra casa" do portão vira lembrete (quem veio de carro não volta a pé e
 * deixa o carro). Sem a chave, ou com o carro em casa, isto não monta nada.
 */
export function montarBebitoNoParque(w: WorldBuilder, cena: { voltarPraCasa: Interactable }): void {
  const g = w.game;
  if (!bebitoMobileNestaPagina() || !g.flag(FASES_DO_PRESENTE.ganhou) || !g.flag(FLAG_DO_CARRO_NO_PARQUE)) return;
  const A = ARI.name;
  const R = RENAN.name;
  const carro = new BebitoMobile(g.fichaDoBebitoMobile());
  w.add(fundir(w.place(carro.group, VAGA_NO_PARQUE.x, 0, VAGA_NO_PARQUE.z, VAGA_NO_PARQUE.giro)));
  w.onUpdate((dt) => carro.update(dt));
  // (deitado ao longo do `x`: o comprimento vai no `hw`)
  w.blockBox(VAGA_NO_PARQUE.x, VAGA_NO_PARQUE.z, BEBITO_MOBILE.comprimento / 2 - 0.1, BEBITO_MOBILE.largura / 2 - 0.08);
  w.interact({
    id: 'parque:bebito-mobile',
    x: VAGA_NO_PARQUE.x + 0.3, z: PASSAGEM.z0 + 1.0, radius: 1.9,
    label: 'Voltar pra casa de carro', icon: '🚙',
    highlight: carro.group,
    priority: 2,
    onInteract: async () => {
      await sairDeCarro(g, 'volta');
    },
  });
  // o portão de sempre vira lembrete: o carro ficou no estacionamento
  cena.voltarPraCasa.enabled = false;
  w.interact({
    id: 'parque:de-carro',
    x: cena.voltarPraCasa.x, z: cena.voltarPraCasa.z, radius: 2.2,
    label: 'Voltar pra casa', icon: '🏠',
    onInteract: async () => {
      await g.say(['A pé? A gente veio de Bebito Mobile.'], R);
      await g.say(['Ele ficou no estacionamento, do outro lado da rua do ônibus. Vamos buscar.'], A);
    },
  });
}
