/**
 * A GUARITA DO CLUBE, a segunda versão — a casa da Gina na portaria.
 *
 * A primeira era uma casinha de 2,6 × 2,2 com um telhado de pirâmide: cabia
 * a girafa e mais nada. Esta é maior (4,8 × 3,5) porque a dupla vai TRABALHAR
 * lá dentro com ela, e mais caprichada, no kit do prédio de rua (a lojinha da
 * Estella, a loja de patins):
 *
 * - parede de reboco creme com FURO de verdade: o guichê largo na frente, a
 *   janela e a PORTA no lado `+X` (o lado da câmera), uma janela de cada lado
 *   que sobra; o rodapé verde da guarita de sempre, o plinto de pedra, as
 *   PILASTRAS de reboco com frisos nas quatro quinas (o mesmo das pilastras
 *   do portão), o friso verde e a cornija com o capeamento dando a volta;
 * - o guichê com caixilho verde, duas folhas de vidro de correr abertas para
 *   os lados (o meio fica livre: é por ali que a Gina se debruça), o balcão de
 *   madeira com veio nas mãos-francesas de ferro e, em cima dele, o livro de
 *   visitas, a plaquinha da carteirinha, o carimbo e a campainha;
 * - o telhado de QUATRO ÁGUAS de telha (canvas), a cumeeira e os espigões, a
 *   testeira verde com o lambrequim vermelho (o mesmo do carrinho de golfe
 *   dela), a placa "PORTARIA" com o escudo em pé na beira e o CATAVENTO de
 *   girafa no alto;
 * - o relógio na pilastra, a câmera de segurança na quina, a arandela entre a
 *   janela e a porta, a floreira embaixo da janela e o ar-condicionado atrás;
 * - lá dentro: o ladrilho hidráulico, as duas bancadas de cada lado do lugar
 *   dela (o monitor das câmeras, o painel do portão, o telefone, o rádio; o
 *   fichário das carteirinhas, os carimbos, a garrafa térmica), o quadro de
 *   chaves, o mural de cortiça, o arquivo de aço, o garrafão d'água, o
 *   cabideiro e o banquinho alto.
 *
 * O QUE A CENA E O MINIGAME VÃO PRECISAR:
 *
 * - tudo o que fica acima do topo da parede (o telhado, o forro, a placa, o
 *   catavento) mora no grupo `teto`, que sai (o molde da barraca e do
 *   Bebito). Sozinho isso NÃO basta para a isométrica ver o chão: as paredes
 *   de 3,4 do lado da câmera escondem ~3 m de piso. Sem o teto, quem vê a
 *   sala é uma câmera de cena por cima (`setCameraOmbro`), ou o guichê;
 * - a folha da porta mora no grupo `dobradica`, com o pivô no batente;
 * - o meio do guichê e o chão entre as bancadas ficam vazios: é o lugar da
 *   Gina, e cabem mais dois.
 *
 * A CÂMERA, o mesmo cuidado da guarita antiga: a cabeça da Gina chega a 2,9 m
 * e 39 cm à frente da parede. Nada avança por cima do balcão (a beira do
 * telhado sai 26 cm, e a 34° a sombra dela cai atrás da cabeça), e o vão do
 * guichê vai até 3,0.
 *
 * O contrato do kit: base em `y = 0`, a frente (o guichê) no `+Z`, o meio da
 * planta na origem. As medidas que a cena lê moram em `GUARITA_DO_CLUBE`.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { flat, pinturaAcesa, toon } from '../core/materials';
import { uvDeParede, uvEmMetros, uvEmMetrosPorTriangulo } from './acabamento';
import { escudoDoClube } from './carrinhoDeGolfeDaGina';
import { FONTE_FORMA } from './halloween/barracaDoWalter';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { juntarPorCor } from './fundir';
import { Lote, extrudar, geoFlor, geoFolha, quina, retangulo } from './lojaDeRoupas';
import { cavetinho, contorno } from './molduras';
import { reboco, rebocoComFrisos } from './texturasDeFachada';
import { veioDeMadeira } from './texturasDeCasa';
import { novaTextura, sorteio } from './texturasDeChao';

/** as medidas que a cena (colisor, a Gina, a conversa) e o teste usam, no quadro da peça */
export const GUARITA_DO_CLUBE = {
  /** o prédio por fora, sem o plinto e as pilastras */
  meiaX: 2.4,
  meiaZ: 1.75,
  /** o alto da parede: o que fica acima disso mora no grupo `teto` */
  parede: 3.4,
  /** o piso de dentro */
  piso: 0.21,
  /** o guichê da frente (o furo) */
  guiche: { meia: 1.85, baixo: 1.16, alto: 3.0 },
  /** o tampo do balcão: o alto, a meia largura e até onde ele avança (no `z` da peça) */
  balcao: { topo: 1.25, meia: 2.0, frente: 2.27 },
  /** a porta, no lado `+X`: o meio dela em `z`, a meia largura e o alto do vão */
  porta: { z: -0.82, meia: 0.47, alto: 2.35 },
  /**
   * a janela do lado `+X` (o meio em `z` e a meia largura) e a floreira embaixo
   * dela, que sai `sai` da parede na altura do corpo: a cena põe um colisor
   */
  janelaDoLado: { z: 0.825, meia: 0.525, sai: 0.3 },
  /** onde a Gina fica: 75 cm atrás da face da frente, como na guarita antiga */
  gina: { x: 0, z: 1.0 },
} as const;

const G = GUARITA_DO_CLUBE;
const css = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;
const v3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
const SEM_GIRO = new THREE.Quaternion();

// ===================================================================== TEXTURAS

/** a telha das quatro águas: fiadas de capa e canal, quase brancas (a cor é do material), a sombra embaixo de cada fiada */
function telhas(): THREE.CanvasTexture {
  return novaTextura('guarita:telhas', 0.84, (ctx, s) => {
    const rnd = sorteio(5150);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const fiadas = 4;
    const porFiada = 4;
    const h = s / fiadas;
    const l = s / porFiada;
    for (let f = 0; f < fiadas; f++) {
      const y0 = f * h;
      for (let k = -1; k <= porFiada; k++) {
        const x = k * l + (f % 2 ? l / 2 : 0);
        const tom = 222 + Math.floor(rnd() * 30);
        ctx.fillStyle = `rgb(${tom},${tom},${tom})`;
        // a capa: a beira de baixo (o `v` pequeno é a beira do telhado) em meia-lua
        ctx.beginPath();
        ctx.moveTo(x + 2, y0 + h);
        ctx.lineTo(x + l - 2, y0 + h);
        ctx.lineTo(x + l - 2, y0 + h * 0.38);
        ctx.quadraticCurveTo(x + l / 2, y0 - h * 0.08, x + 2, y0 + h * 0.38);
        ctx.fill();
        // o brilho do lombo da capa
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(x + l * 0.42, y0 + h * 0.3, l * 0.12, h * 0.6);
      }
      // a sombra que a fiada de cima joga nesta
      const gr = ctx.createLinearGradient(0, y0 + h, 0, y0 + h * 0.66);
      gr.addColorStop(0, 'rgba(110,45,35,0.36)');
      gr.addColorStop(1, 'rgba(110,45,35,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, y0 + h * 0.66, s, h * 0.34);
    }
  });
}

/** o ladrilho hidráulico de dentro: a flor de quatro pétalas em cada peça de 30 cm, verde e creme */
function ladrilho(): THREE.CanvasTexture {
  return novaTextura('guarita:ladrilho', 0.6, (ctx, s) => {
    const m = s / 2;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const x = i * m;
        const y = j * m;
        ctx.fillStyle = css(P.guaritaParede);
        ctx.fillRect(x, y, m, m);
        // os cantos verdes: juntando quatro peças, viram um losango
        ctx.fillStyle = css(P.guaritaLadrilho);
        for (const [cx, cy] of [[x, y], [x + m, y], [x, y + m], [x + m, y + m]]) {
          ctx.beginPath();
          ctx.moveTo(cx - m * 0.26, cy);
          ctx.lineTo(cx, cy - m * 0.26);
          ctx.lineTo(cx + m * 0.26, cy);
          ctx.lineTo(cx, cy + m * 0.26);
          ctx.fill();
        }
        // a flor do meio
        ctx.fillStyle = css(P.guaritaFaixa);
        for (let p = 0; p < 4; p++) {
          const a = (p * Math.PI) / 2 + Math.PI / 4;
          ctx.beginPath();
          ctx.ellipse(x + m / 2 + Math.cos(a) * m * 0.13, y + m / 2 + Math.sin(a) * m * 0.13, m * 0.12, m * 0.06, a, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = css(P.flowerYellow);
        ctx.beginPath();
        ctx.arc(x + m / 2, y + m / 2, m * 0.05, 0, Math.PI * 2);
        ctx.fill();
        // o rejunte
        ctx.fillStyle = 'rgba(120,110,95,0.35)';
        ctx.fillRect(x, y, m, 2);
        ctx.fillRect(x, y, 2, m);
      }
    }
  });
}

let telaDasCameras: THREE.CanvasTexture | null = null;
/** a tela do monitor: quatro câmeras do clube (o portão, a piscina, o estacionamento e o Mania), com a hora e o REC */
function telaDoMonitor(): THREE.CanvasTexture {
  if (telaDasCameras) return telaDasCameras;
  telaDasCameras = canvasComLetra(256, 192, (c) => {
    c.fillStyle = '#1d2a2c';
    c.fillRect(0, 0, 256, 192);
    const quadro = (x: number, y: number, pintar: () => void, nome: string): void => {
      c.save();
      c.beginPath();
      c.rect(x + 3, y + 3, 122, 90);
      c.clip();
      pintar();
      c.restore();
      c.fillStyle = 'rgba(0,0,0,0.45)';
      c.fillRect(x + 3, y + 79, 122, 14);
      c.fillStyle = '#e9fbe9';
      c.font = `700 11px ${FONTE_FORMA}`;
      c.textBaseline = 'middle';
      c.fillText(nome, x + 8, y + 87);
    };
    // o portão: a grade verde na frente da rua
    quadro(0, 0, () => {
      c.fillStyle = '#9bb0a8'; c.fillRect(0, 0, 128, 96);
      c.fillStyle = '#6f7e84'; c.fillRect(0, 20, 128, 26);
      c.fillStyle = '#2f7d6b';
      for (let x = 10; x < 128; x += 11) c.fillRect(x, 26, 4, 60);
      c.fillRect(0, 50, 128, 4);
    }, 'CAM 1 · PORTÃO');
    // a piscina, com as raias
    quadro(128, 0, () => {
      c.fillStyle = '#d9d2c1'; c.fillRect(128, 0, 128, 96);
      c.fillStyle = '#5fb7d6'; c.fillRect(146, 12, 92, 66);
      c.fillStyle = '#e9f7fb';
      for (let y = 26; y < 78; y += 14) c.fillRect(146, y, 92, 2);
      c.fillStyle = '#f16c4f'; c.beginPath(); c.arc(206, 44, 6, 0, Math.PI * 2); c.fill();
    }, 'CAM 2 · PISCINA');
    // o estacionamento, com um carrinho
    quadro(0, 96, () => {
      c.fillStyle = '#8c949a'; c.fillRect(0, 96, 128, 96);
      c.fillStyle = '#f2f2f2';
      for (let x = 14; x < 128; x += 30) c.fillRect(x, 110, 3, 50);
      c.fillStyle = '#7fc8e8'; c.fillRect(48, 122, 26, 34);
      c.fillStyle = '#c4553f'; c.fillRect(80, 118, 24, 32);
    }, 'CAM 3 · ESTACIONAMENTO');
    // o Mania de Churrasco, de telhado vermelho
    quadro(128, 96, () => {
      c.fillStyle = '#9fc77e'; c.fillRect(128, 96, 128, 96);
      c.fillStyle = '#f0e2c6'; c.fillRect(150, 130, 84, 44);
      c.fillStyle = '#c4553f';
      c.beginPath(); c.moveTo(142, 132); c.lineTo(192, 104); c.lineTo(242, 132); c.fill();
      c.fillStyle = '#6b4a35'; c.fillRect(186, 148, 14, 26);
    }, 'CAM 4 · MANIA');
    c.fillStyle = '#ff5b4a';
    c.beginPath(); c.arc(240, 10, 4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffd7cf';
    c.font = `700 10px ${FONTE_FORMA}`;
    c.textAlign = 'right';
    c.fillText('REC', 233, 11);
    // as linhas de varredura de tela antiga
    c.fillStyle = 'rgba(255,255,255,0.05)';
    for (let y = 0; y < 192; y += 3) c.fillRect(0, y, 256, 1);
  });
  return telaDasCameras;
}

let paginasDoLivro: THREE.CanvasTexture | null = null;
/** as duas páginas do livro de visitas: as linhas, os nomes de quem já entrou hoje, e a data */
function livroDeVisitas(): THREE.CanvasTexture {
  if (paginasDoLivro) return paginasDoLivro;
  paginasDoLivro = canvasComLetra(256, 160, (c) => {
    c.fillStyle = '#fbf6e8';
    c.fillRect(0, 0, 256, 160);
    c.fillStyle = 'rgba(0,0,0,0.12)';
    c.fillRect(126, 0, 4, 160);
    c.strokeStyle = '#a9c4cf';
    c.lineWidth = 1.5;
    for (const x0 of [8, 136]) {
      for (let y = 30; y < 156; y += 16) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + 112, y); c.stroke(); }
    }
    c.fillStyle = css(P.guaritaFaixa);
    c.font = `700 14px ${FONTE_FORMA}`;
    c.fillText('VISITANTES', 22, 20);
    c.fillText('SÓCIOS', 160, 20);
    c.fillStyle = '#3a4a6a';
    c.font = `400 12px ${FONTE_FORMA}`;
    const nomes = ['Noel', 'Josefina', 'Capy', 'Walter'];
    nomes.forEach((n, i) => c.fillText(n, 140, 28 + i * 16));
    c.fillText('Estella', 12, 28);
    c.fillText('Mano', 12, 44);
  });
  return paginasDoLivro;
}

let plaquinha: THREE.CanvasTexture | null = null;
/** a plaquinha de cavalete do balcão */
function plaquinhaDaCarteirinha(): THREE.CanvasTexture {
  if (plaquinha) return plaquinha;
  plaquinha = canvasComLetra(192, 128, (c) => {
    c.fillStyle = css(P.guaritaParede);
    c.fillRect(0, 0, 192, 128);
    c.strokeStyle = css(P.guaritaFaixa);
    c.lineWidth = 6;
    c.strokeRect(5, 5, 182, 118);
    c.fillStyle = css(P.guaritaFaixa);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `700 22px ${FONTE_FORMA}`;
    c.fillText('Carteirinha,', 96, 42);
    c.fillText('por favor!', 96, 70);
    // o carimbo desenhado do lado
    c.strokeStyle = css(P.rodaVermelho);
    c.lineWidth = 3;
    c.beginPath(); c.arc(96, 104, 13, 0, Math.PI * 2); c.stroke();
    c.fillStyle = css(P.rodaVermelho);
    c.font = `700 11px ${FONTE_FORMA}`;
    c.fillText('OK', 96, 105);
  });
  return plaquinha;
}

let letreiroDaPortaria: THREE.CanvasTexture | null = null;
/** a placa do telhado: "PORTARIA" com o escudo no meio */
function placaDaPortaria(): THREE.CanvasTexture {
  if (letreiroDaPortaria) return letreiroDaPortaria;
  letreiroDaPortaria = canvasComLetra(512, 128, (c) => {
    c.fillStyle = css(P.guaritaFaixa);
    c.fillRect(0, 0, 512, 128);
    c.strokeStyle = css(P.gold);
    c.lineWidth = 6;
    c.strokeRect(8, 8, 496, 112);
    c.strokeStyle = css(P.guaritaParede);
    c.lineWidth = 2;
    c.strokeRect(16, 16, 480, 96);
    c.fillStyle = css(P.guaritaParede);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `700 62px ${FONTE_FORMA}`;
    c.fillText('PORTARIA', 256, 70);
    // as estrelinhas das pontas
    c.fillStyle = css(P.gold);
    for (const x of [44, 468]) {
      c.beginPath();
      for (let k = 0; k < 10; k++) {
        const r = k % 2 ? 7 : 16;
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        c.lineTo(x + Math.cos(a) * r, 64 + Math.sin(a) * r);
      }
      c.fill();
    }
  });
  return letreiroDaPortaria;
}

let mostrador: THREE.CanvasTexture | null = null;
/** o mostrador do relógio da pilastra */
function mostradorDoRelogio(): THREE.CanvasTexture {
  if (mostrador) return mostrador;
  mostrador = canvasComLetra(128, 128, (c) => {
    c.fillStyle = '#fbf8ef';
    c.beginPath(); c.arc(64, 64, 62, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2e3a3a';
    for (let h = 0; h < 12; h++) {
      const a = (h * Math.PI) / 6;
      const r0 = h % 3 ? 50 : 44;
      c.save();
      c.translate(64, 64);
      c.rotate(a);
      c.fillRect(-1.5, -56, 3, 56 - r0);
      c.restore();
    }
    c.fillStyle = css(P.guaritaFaixa);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `700 12px ${FONTE_FORMA}`;
    c.fillText('CLUBE', 64, 88);
  });
  return mostrador;
}

let mural: THREE.CanvasTexture | null = null;
/** o mural de cortiça de dentro: a escala da semana, um recado do Walter, a foto da piscina e um desenho de girafa */
function muralDeCortica(): THREE.CanvasTexture {
  if (mural) return mural;
  mural = canvasComLetra(256, 168, (c) => {
    c.fillStyle = css(P.cortica);
    c.fillRect(0, 0, 256, 168);
    const rnd = sorteio(771);
    c.fillStyle = 'rgba(120,80,40,0.25)';
    for (let i = 0; i < 260; i++) c.fillRect(rnd() * 256, rnd() * 168, 2, 2);
    const papel = (x: number, y: number, l: number, a: number, giro: number, cor: string, escrever: () => void): void => {
      c.save();
      c.translate(x, y);
      c.rotate(giro);
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.fillRect(-l / 2 + 3, -a / 2 + 3, l, a);
      c.fillStyle = cor;
      c.fillRect(-l / 2, -a / 2, l, a);
      escrever();
      c.fillStyle = css(P.rodaVermelho);
      c.beginPath(); c.arc(0, -a / 2 + 6, 4, 0, Math.PI * 2); c.fill();
      c.restore();
    };
    c.font = `700 11px ${FONTE_FORMA}`;
    c.textAlign = 'center';
    papel(64, 54, 96, 78, -0.05, '#fbf8ef', () => {
      c.fillStyle = css(P.guaritaFaixa);
      c.fillText('ESCALA', 0, -22);
      c.fillStyle = '#4a5560';
      ['seg  Gina', 'ter  Gina', 'qua  Gina', 'qui  Gina?'].forEach((t, i) => c.fillText(t, 0, -6 + i * 13));
    });
    papel(178, 44, 82, 58, 0.08, '#fff2a8', () => {
      c.fillStyle = '#6b4a35';
      c.fillText('au au!', 0, -4);
      c.fillText('— W.', 8, 14);
    });
    papel(70, 132, 74, 52, 0.06, '#d8eef6', () => {
      c.fillStyle = '#5fb7d6'; c.fillRect(-28, -18, 56, 30);
      c.fillStyle = '#ffffff'; c.fillRect(-28, -6, 56, 2);
    });
    papel(186, 122, 70, 70, -0.1, '#ffffff', () => {
      c.fillStyle = css(P.girafaPelo);
      c.fillRect(-4, -26, 8, 34);
      c.beginPath(); c.ellipse(0, 14, 18, 10, 0, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.ellipse(6, -26, 9, 6, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = css(P.girafaMancha);
      c.beginPath(); c.arc(-6, 12, 3, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(6, 16, 3, 0, Math.PI * 2); c.fill();
    });
  });
  return mural;
}

let plaquinhaDaPorta: THREE.CanvasTexture | null = null;
function plaquinhaDeFuncionarios(): THREE.CanvasTexture {
  if (plaquinhaDaPorta) return plaquinhaDaPorta;
  plaquinhaDaPorta = canvasComLetra(160, 64, (c) => {
    c.fillStyle = css(P.gold);
    c.fillRect(0, 0, 160, 64);
    c.fillStyle = '#fbf8ef';
    c.fillRect(5, 5, 150, 54);
    c.fillStyle = css(P.guaritaFaixa);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `700 17px ${FONTE_FORMA}`;
    c.fillText('SÓ FUNCIONÁRIOS', 80, 26);
    c.font = `400 12px ${FONTE_FORMA}`;
    c.fillText('(e quem a Gina deixar)', 80, 46);
  });
  return plaquinhaDaPorta;
}

// ======================================================================= A PEÇA

export class GuaritaDoClube {
  readonly group = new THREE.Group();
  /** o telhado, o forro, a placa e o catavento: tudo acima da parede (sai para a câmera ver dentro) */
  readonly teto = new THREE.Group();
  /** a folha da porta, com o pivô no batente */
  readonly dobradica = new THREE.Group();
  private readonly catavento = new THREE.Group();
  private readonly ledAceso: THREE.Mesh;
  private relogio = 0;

  constructor() {
    const g = this.group;
    g.userData.peca = 'guarita';
    // as medidas que o `scripts/guarita.mjs` lê (a frente, o balcão), no quadro da peça
    g.userData.medidas = { meiaX: G.meiaX, meiaZ: G.meiaZ, balcao: G.balcao.topo, frente: G.balcao.frente };
    this.teto.name = 'teto';
    this.dobradica.name = 'dobradica';
    this.catavento.name = 'catavento';
    const rnd = sorteio(6061);

    // ----------------------------------------------------------- materiais
    const parede = toon(P.guaritaParede, { mapa: reboco() });
    const rodape = toon(P.guaritaFaixa, { mapa: reboco() });
    const pilastra = toon(P.muroBase, { mapa: rebocoComFrisos(0.9) });
    const creme = toon(P.guaritaParede);
    const verde = toon(P.guaritaFaixa);
    const pedra = toon(P.muroChapim);
    const ferro = toon(P.portaoFerro);
    const dourado = toon(P.gold);
    const madeira = toon(P.guaritaBalcao, { mapa: veioDeMadeira() });
    const madeiraEscura = toon(P.woodDark, { mapa: veioDeMadeira() });
    const piso = toon(0xffffff, { mapa: ladrilho() });
    const telha = toon(P.guaritaTelhado, { mapa: telhas(), doubleSide: true });
    const cumeeira = toon(P.guaritaCumeeira);
    const vermelho = toon(P.guaritaTelhado, { doubleSide: true });
    const papel = toon(0xfbf8ef);
    const grafite = toon(P.guaritaMonitor);
    const aco = toon(P.guaritaArquivo);
    const metal = toon(P.metalGrey);
    const terra = toon(P.terraDeVaso);
    const luz = toon(P.luzDoPortao, { glow: 0.65 });
    /*
     * O VIDRO é `flat()` e bem lavado, como na guarita antiga: com o toon, a
     * folha de correr virava um retângulo escuro na frente da Gina.
     */
    const vidro = flat(P.glass, 0.22);
    const vidros: THREE.BufferGeometry[] = [];

    // os lotes: as flores da floreira, as chaves do quadro e as fichas do fichário
    const branco = toon(0xffffff, { doubleSide: true });
    const flores = new Lote(geoFlor(), branco);
    const miolos = new Lote(new THREE.OctahedronGeometry(1, 0), toon(0xffffff));
    const folhas = new Lote(geoFolha(), branco);
    const chaveiros = new Lote(quina(1, 1, 1, 0.2), toon(0xffffff));
    const fichas = new Lote(new THREE.BoxGeometry(1, 1, 1), toon(0xffffff));
    const botoes = new Lote(new THREE.CylinderGeometry(1, 1, 1, 12), toon(0xffffff));

    // ----------------------------------------------------------- as medidas
    const HX = G.meiaX;
    const HZ = G.meiaZ;
    const ESP = 0.2;
    const MEIO = HX - ESP;
    const DENTRO = HZ - ESP;
    const Y_PISO = G.piso;
    const Y_RODAPE = 0.62;
    const Y_TOPO = G.parede;
    const GUICHE = { x0: -G.guiche.meia, x1: G.guiche.meia, y0: G.guiche.baixo, y1: G.guiche.alto };
    // no quadro da DIREITA o `x` é o `−z` da peça; no da ESQUERDA, o `+z`; no dos FUNDOS, o `−x`
    const PORTA = { x0: -G.porta.z - G.porta.meia, x1: -G.porta.z + G.porta.meia, y1: G.porta.alto };
    const JANELA_LESTE = { x0: -G.janelaDoLado.z - G.janelaDoLado.meia, x1: -G.janelaDoLado.z + G.janelaDoLado.meia, y0: 1.2, y1: 2.65 };
    const JANELA_OESTE = { x0: -0.2, x1: 1.0, y0: 1.2, y1: 2.65 };
    const JANELA_FUNDOS = { x0: 0.95, x1: 1.75, y0: 1.5, y1: 2.6 };

    // ----------------------------------------------------- quadros e peças
    const quadro = (x: number, z: number, giro: number): THREE.Group => {
      const q = new THREE.Group();
      q.position.set(x, 0, z);
      q.rotation.y = giro;
      q.updateMatrix();
      g.add(q);
      return q;
    };
    const FRENTE = quadro(0, HZ, 0);
    const DIREITA = quadro(HX, 0, Math.PI / 2);
    const FUNDOS = quadro(0, -HZ, Math.PI);
    const ESQUERDA = quadro(-HX, 0, -Math.PI / 2);
    // o lado de DENTRO de cada parede (o `+z` dele aponta para o meio da guarita)
    const DENTRO_FUNDOS = quadro(0, -DENTRO, 0);
    const DENTRO_ESQUERDA = quadro(-MEIO, 0, Math.PI / 2);

    const peca = (pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material,
      x = 0, y = 0, z = 0): THREE.Mesh => {
      let geometria = geo;
      if (mat === parede || mat === rodape || mat === pilastra) geometria = uvDeParede(geo, x, y, z);
      else if (mat === madeira || mat === madeiraEscura || mat === piso) {
        if (geo.type === 'BoxGeometry') uvEmMetros(geo);
        else geometria = uvEmMetrosPorTriangulo(geo);
      }
      const m = new THREE.Mesh(geometria, mat);
      m.position.set(x, y, z);
      pai.add(m);
      return m;
    };
    const caixa = (pai: THREE.Object3D, l: number, a: number, p: number, mat: THREE.Material,
      x: number, y: number, z: number): THREE.Mesh => peca(pai, new THREE.BoxGeometry(l, a, p), mat, x, y, z);
    const macia = (pai: THREE.Object3D, l: number, a: number, p: number, mat: THREE.Material,
      x: number, y: number, z: number, r = 0.02): THREE.Mesh => peca(pai, quina(l, a, p, r), mat, x, y, z);
    const cilindro = (pai: THREE.Object3D, r0: number, r1: number, a: number, mat: THREE.Material,
      x: number, y: number, z: number, lados = 12): THREE.Mesh =>
      peca(pai, new THREE.CylinderGeometry(r0, r1, a, lados), mat, x, y, z);
    /** um tubo reto de `a` até `b` */
    const tubo = (pai: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material, lados = 8): THREE.Mesh => {
      const d = b.clone().sub(a);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), lados), mat);
      m.position.copy(a).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(v3(0, 1, 0), d.normalize());
      pai.add(m);
      return m;
    };
    /** um tubo curvo pelos pontos (a mão-francesa, o cabideiro) */
    const curva = (pai: THREE.Object3D, pts: THREE.Vector3[], r: number, mat: THREE.Material): THREE.Mesh => {
      const m = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), pts.length * 6, r, 7, false), mat);
      pai.add(m);
      return m;
    };
    /** o vidro é guardado já no quadro da peça, para virar uma malha só no fim */
    const guardarVidro = (q: THREE.Object3D, l: number, a: number, x: number, y: number, z: number): void => {
      q.updateMatrix();
      const geo = new THREE.BoxGeometry(l, a, 0.012).toNonIndexed();
      geo.applyMatrix4(new THREE.Matrix4().makeTranslation(x, y, z).premultiply(q.matrix));
      geo.deleteAttribute('uv');
      vidros.push(geo);
    };
    /** um plano com uma pintura (o mostrador, a tela, o papel), olhando para o `+Z` do pai */
    const pintura = (pai: THREE.Object3D, l: number, a: number, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh =>
      peca(pai, new THREE.PlaneGeometry(l, a), mat, x, y, z);

    // ================================================================== CHÃO
    // o plinto de pedra dá a volta; na porta, a soleira e o degrau passam por cima
    peca(g, contorno([[0.1, 0], [0.1, 0.14], [0.06, 0.2], [0, 0.2]], HX, HZ), pedra);
    caixa(g, MEIO * 2 + 0.02, 0.06, DENTRO * 2 + 0.02, piso, 0, Y_PISO - 0.03, 0);

    // ================================================================ PAREDES
    type Furo = { x0: number; x1: number; y0: number; y1: number };
    const paredeLisa = (q: THREE.Object3D, meia: number, furos: Furo[]): void => {
      peca(q, extrudar(retangulo(new THREE.Shape(), -meia, 0, meia, Y_RODAPE), ESP, -ESP), rodape);
      const cima = retangulo(new THREE.Shape(), -meia, Y_RODAPE, meia, Y_TOPO);
      for (const f of furos) cima.holes.push(retangulo(new THREE.Path(), f.x0, f.y0, f.x1, f.y1));
      peca(q, extrudar(cima, ESP, -ESP), parede);
    };
    paredeLisa(FRENTE, MEIO, [GUICHE]);
    paredeLisa(FUNDOS, MEIO, [JANELA_FUNDOS]);
    paredeLisa(ESQUERDA, HZ, [JANELA_OESTE]);

    // o lado `+X`: o rodapé dos dois lados da porta, a soleira, e a parede de
    // cima com o recorte da porta no contorno (ela toca a borda) e o furo da janela
    peca(DIREITA, extrudar(retangulo(new THREE.Shape(), -HZ, 0, PORTA.x0, Y_RODAPE), ESP, -ESP), rodape);
    peca(DIREITA, extrudar(retangulo(new THREE.Shape(), PORTA.x1, 0, HZ, Y_RODAPE), ESP, -ESP), rodape);
    // (6 mm acima do piso de dentro: rente, as duas faces de cima dividiam o plano onde o piso entra na parede)
    caixa(DIREITA, PORTA.x1 - PORTA.x0, Y_PISO + 0.006, ESP, pedra, (PORTA.x0 + PORTA.x1) / 2, (Y_PISO + 0.006) / 2, -ESP / 2);
    {
      const s = new THREE.Shape();
      s.moveTo(-HZ, Y_RODAPE);
      s.lineTo(PORTA.x0, Y_RODAPE);
      s.lineTo(PORTA.x0, PORTA.y1);
      s.lineTo(PORTA.x1, PORTA.y1);
      s.lineTo(PORTA.x1, Y_RODAPE);
      s.lineTo(HZ, Y_RODAPE);
      s.lineTo(HZ, Y_TOPO);
      s.lineTo(-HZ, Y_TOPO);
      s.closePath();
      s.holes.push(retangulo(new THREE.Path(), JANELA_LESTE.x0, JANELA_LESTE.y0, JANELA_LESTE.x1, JANELA_LESTE.y1));
      peca(DIREITA, extrudar(s, ESP, -ESP), parede);
    }
    // o degrau de pedra na frente da porta (1 cm abaixo da soleira, e começando onde ela termina)
    caixa(DIREITA, PORTA.x1 - PORTA.x0 + 0.34, 0.11, 0.36, pedra, (PORTA.x0 + PORTA.x1) / 2, 0.055, 0.18);

    /*
     * AS PILASTRAS das quatro quinas: o reboco com frisos da cor das pilastras
     * do portão, 4 cm para fora das duas faces. Por dentro elas sobram 16 cm
     * no canto (as bancadas param antes delas).
     */
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        caixa(g, 0.4, 3.05, 0.4, pilastra, sx * (HX - 0.16), 0.2 + 3.05 / 2, sz * (HZ - 0.16));
      }
    }

    // ================================================================ MOLDURAS
    // o friso verde acima do guichê, e a cornija com o capeamento que desce por dentro
    peca(g, contorno([[0, 3.08], [0.05, 3.1], [0.08, 3.12], [0.08, 3.18], [0.05, 3.2], [0, 3.22]], HX, HZ), verde);
    peca(g, contorno([
      [0, 3.26], ...cavetinho([0, 3.26], [0.12, 3.38], 4), [0.16, 3.4], [0.16, 3.48], [-0.3, 3.48], [-0.3, 3.43],
    ], HX, HZ), creme);

    // ========================================================== OS CAIXILHOS
    /** o caixilho verde dentro de um vão: as deitadas de ponta a ponta, as de pé entre elas, um tico mais rasas */
    const caixilho = (q: THREE.Object3D, f: Furo, cruz: boolean, embaixo = true): void => {
      const W = f.x1 - f.x0;
      const BARRA = 0.06;
      const Z = -ESP / 2;
      const yMeio = (f.y0 + f.y1) / 2;
      caixa(q, W + 0.02, BARRA + 0.01, 0.09, verde, f.x0 + W / 2, f.y1 - BARRA / 2 + 0.005, Z);
      if (embaixo) caixa(q, W + 0.02, BARRA + 0.01, 0.09, verde, f.x0 + W / 2, f.y0 + BARRA / 2 - 0.005, Z);
      const baixo = embaixo ? f.y0 + BARRA : f.y0;
      const altoDentro = f.y1 - BARRA - baixo;
      for (const x of [f.x0 + BARRA / 2 - 0.005, f.x1 - BARRA / 2 + 0.005]) {
        caixa(q, BARRA + 0.01, altoDentro, 0.084, verde, x, baixo + altoDentro / 2, Z);
      }
      if (cruz) {
        caixa(q, 0.04, altoDentro, 0.07, verde, f.x0 + W / 2, baixo + altoDentro / 2, Z);
        caixa(q, W - BARRA * 2, 0.04, 0.066, verde, f.x0 + W / 2, yMeio + 0.08, Z);
        guardarVidro(q, W - BARRA, altoDentro + 0.02, f.x0 + W / 2, baixo + altoDentro / 2, Z - 0.01);
      }
      // o peitoril de pedra, 1 cm acima do chão do vão e para fora da parede
      if (embaixo) caixa(q, W + 0.18, 0.06, 0.15, pedra, f.x0 + W / 2, f.y0 - 0.02, 0.035);
    };
    caixilho(DIREITA, JANELA_LESTE, true);
    caixilho(ESQUERDA, JANELA_OESTE, true);
    caixilho(FUNDOS, JANELA_FUNDOS, true);

    // ================================================================ O GUICHÊ
    {
      // o caixilho sem a barra de baixo (o tampo do balcão fecha), e dois montantes
      caixilho(FRENTE, GUICHE, false, false);
      const MONTANTE = 0.72;
      const alto = GUICHE.y1 - 0.06 - G.balcao.topo;
      const yMeio = G.balcao.topo + alto / 2;
      for (const x of [-MONTANTE, MONTANTE]) caixa(FRENTE, 0.07, alto, 0.08, verde, x, yMeio, -ESP / 2);
      /*
       * AS FOLHAS DE CORRER: uma em cada vão do lado, empurrada para a quina.
       * O meio fica aberto — é por ali que a Gina põe a cabeça para fora.
       */
      for (const lado of [-1, 1]) {
        const x0 = lado * (GUICHE.x1 - 0.06);
        const x1 = lado * (MONTANTE + 0.36);
        const meio = (x0 + x1) / 2;
        const l = Math.abs(x1 - x0);
        const z = -ESP / 2 - 0.075;
        const baixo = G.balcao.topo + 0.02;
        const topo = GUICHE.y1 - 0.08;
        const a = topo - baixo;
        caixa(FRENTE, l, 0.045, 0.035, verde, meio, topo - 0.0225, z);
        caixa(FRENTE, l, 0.045, 0.035, verde, meio, baixo + 0.0225, z);
        const rumo = Math.sign(x1 - x0);
        for (const x of [x0 + rumo * 0.0225, x1 - rumo * 0.0225]) caixa(FRENTE, 0.045, a - 0.09, 0.03, verde, x, baixo + a / 2, z);
        guardarVidro(FRENTE, l - 0.05, a - 0.06, meio, baixo + a / 2, z);
        // o puxador
        caixa(FRENTE, 0.025, 0.16, 0.03, dourado, x1 - Math.sign(x1 - x0) * 0.06, baixo + a * 0.45, z + 0.03);
      }

      // as almofadas da parede embaixo do balcão
      for (const x of [-1.25, 0, 1.25]) {
        macia(FRENTE, 0.84, 0.36, 0.05, creme, x, 0.9, 0.02, 0.02);
        macia(FRENTE, 0.94, 0.46, 0.03, verde, x, 0.9, 0.012, 0.012);
      }

      /*
       * O BALCÃO: o tampo de madeira entra 30 cm pelo guichê (lá dentro ele
       * serve de parapeito) e avança 52 cm para a rua, nas mãos-francesas de
       * ferro. É o plano em que a dupla encosta e a Gina se debruça.
       */
      const TOPO = G.balcao.topo;
      const AVANCO = G.balcao.frente - HZ;
      const FUNDO = -0.3;
      macia(FRENTE, G.balcao.meia * 2, 0.07, AVANCO - FUNDO, madeira, 0, TOPO - 0.035, (AVANCO + FUNDO) / 2, 0.015);
      caixa(FRENTE, G.balcao.meia * 2 - 0.06, 0.08, 0.04, verde, 0, TOPO - 0.09, AVANCO - 0.04);
      for (const x of [-1.95, -0.62, 0.62, 1.95]) {
        curva(FRENTE, [v3(x, 0.74, 0.07), v3(x, 0.86, 0.12), v3(x, 1.02, 0.24), v3(x, 1.14, AVANCO - 0.08)], 0.022, ferro);
        // a voltinha da ponta de baixo
        curva(FRENTE, [v3(x, 0.74, 0.07), v3(x, 0.7, 0.13), v3(x, 0.75, 0.17), v3(x, 0.79, 0.13)], 0.016, ferro);
        caixa(FRENTE, 0.06, 0.1, 0.02, ferro, x, 0.8, 0.06);
      }

      // ------------------------------------------------- o que mora no balcão
      // o livro de visitas aberto, com a caneta
      const livro = new THREE.Group();
      livro.position.set(-1.32, TOPO, 0.28);
      livro.rotation.y = 0.18;
      FRENTE.add(livro);
      macia(livro, 0.44, 0.025, 0.3, verde, 0, 0.0125, 0, 0.008);
      const folhasDoLivro = pintura(livro, 0.42, 0.28, toon(0xffffff, { mapa: livroDeVisitas() }), 0, 0.027, 0);
      folhasDoLivro.rotation.x = -Math.PI / 2;
      const caneta = cilindro(livro, 0.008, 0.008, 0.15, toon(P.vestiarioPorta), 0.12, 0.036, 0.02, 8);
      caneta.rotation.set(Math.PI / 2, 0, 0.5);
      // a plaquinha de cavalete
      const tenda = new THREE.Group();
      tenda.position.set(-1.82, TOPO, 0.3);
      tenda.rotation.y = 0.25;
      FRENTE.add(tenda);
      for (const lado of [-1, 1]) {
        const face = pintura(tenda, 0.24, 0.16, toon(0xffffff, { mapa: plaquinhaDaCarteirinha() }), 0, 0.075, lado * 0.035);
        face.rotation.set(lado * -0.42, lado < 0 ? Math.PI : 0, 0);
      }
      // o carimbo de pé e a almofada de tinta
      const carimbo = new THREE.Group();
      carimbo.position.set(1.18, TOPO, 0.24);
      FRENTE.add(carimbo);
      macia(carimbo, 0.16, 0.025, 0.11, metal, 0.12, 0.0125, 0, 0.008);
      macia(carimbo, 0.13, 0.008, 0.08, toon(P.rodaVermelho), 0.12, 0.028, 0, 0.003);
      macia(carimbo, 0.09, 0.03, 0.06, madeira, -0.04, 0.015, 0, 0.008);
      cilindro(carimbo, 0.016, 0.022, 0.08, madeira, -0.04, 0.07, 0, 8);
      peca(carimbo, new THREE.SphereGeometry(0.032, 10, 8), madeiraEscura, -0.04, 0.12, 0);
      // a campainha de balcão
      cilindro(FRENTE, 0.07, 0.075, 0.03, grafite, 1.62, TOPO + 0.015, 0.34, 16);
      peca(FRENTE, new THREE.SphereGeometry(0.06, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), dourado, 1.62, TOPO + 0.03, 0.34);
      cilindro(FRENTE, 0.008, 0.008, 0.03, dourado, 1.62, TOPO + 0.1, 0.34, 6);
      peca(FRENTE, new THREE.SphereGeometry(0.016, 8, 6), dourado, 1.62, TOPO + 0.118, 0.34);
      // o vasinho de flor da Gina
      peca(FRENTE, new THREE.LatheGeometry([
        new THREE.Vector2(0, 0), new THREE.Vector2(0.06, 0), new THREE.Vector2(0.075, 0.1), new THREE.Vector2(0.085, 0.12), new THREE.Vector2(0.075, 0.125),
      ], 14), toon(P.flowerPink), 0.86, TOPO, 0.36);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const dir = v3(Math.cos(a) * 0.5, 1, Math.sin(a) * 0.5).normalize();
        const p = v3(0.86 + Math.cos(a) * 0.04, TOPO + 0.15 + (i % 2) * 0.03, 0.36 + Math.sin(a) * 0.04);
        flores.por(FRENTE, p, new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), dir), 0.032, i % 2 ? P.flowerYellow : P.metalWhite);
        miolos.por(FRENTE, p.clone().addScaledVector(dir, 0.006), SEM_GIRO, 0.008, P.flowerYellow);
        folhas.por(FRENTE, v3(0.86 + Math.cos(a + 0.4) * 0.05, TOPO + 0.12, 0.36 + Math.sin(a + 0.4) * 0.05),
          new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), v3(Math.cos(a), 0.7, Math.sin(a)).normalize()), 0.05, P.leafMid);
      }
    }

    // ================================================== O RELÓGIO E A CÂMERA
    {
      const relogio = new THREE.Group();
      relogio.position.set(-(HX - 0.16), 2.62, HZ + 0.04);
      g.add(relogio);
      const aro = cilindro(relogio, 0.17, 0.17, 0.05, verde, 0, 0, 0.025, 24);
      aro.rotation.x = Math.PI / 2;
      pintura(relogio, 0.3, 0.3, toon(0xffffff, { mapa: mostradorDoRelogio() }), 0, 0, 0.052);
      // os ponteiros: dez para as duas, a hora do sol de clube
      const ponteiro = (l: number, giro: number): void => {
        const p = caixa(relogio, 0.016, l, 0.006, toon(0x2e3a3a), 0, 0, 0.058);
        p.geometry.translate(0, l / 2, 0);
        p.rotation.z = -giro;
      };
      ponteiro(0.08, (2 + 50 / 60) * (Math.PI / 6));
      ponteiro(0.11, (50 / 60) * Math.PI * 2);
      peca(relogio, new THREE.SphereGeometry(0.014, 8, 6), dourado, 0, 0, 0.06);

      // a câmera de segurança na quina da frente do lado da piscina, olhando o portão e quem chega
      const camera = new THREE.Group();
      camera.position.set(HX + 0.04, 3.0, HZ - 0.16);
      camera.rotation.y = 1.07;
      g.add(camera);
      caixa(camera, 0.1, 0.12, 0.02, grafite, 0, 0, 0.01);
      tubo(camera, v3(0, 0, 0.02), v3(0, -0.02, 0.16), 0.018, grafite);
      const corpo = macia(camera, 0.12, 0.11, 0.26, creme, 0, -0.06, 0.24, 0.03);
      corpo.rotation.x = 0.3;
      const lente = cilindro(camera, 0.04, 0.045, 0.04, grafite, 0, -0.1, 0.37, 14);
      lente.rotation.x = Math.PI / 2 + 0.3;
      macia(camera, 0.16, 0.02, 0.3, creme, 0, 0.0, 0.25, 0.008).rotation.x = 0.3;
      this.ledAceso = peca(camera, new THREE.SphereGeometry(0.014, 8, 6), toon(P.rodaVermelho, { glow: 0.9 }), 0.04, -0.03, 0.33);
      this.ledAceso.name = 'led';
    }

    // ============================================ A ARANDELA, A FLOREIRA E O AR
    {
      // a arandela entre a janela e a porta
      const xA = (JANELA_LESTE.x1 + PORTA.x0) / 2;
      caixa(DIREITA, 0.12, 0.18, 0.03, ferro, xA, 2.4, 0.015);
      curva(DIREITA, [v3(xA, 2.42, 0.03), v3(xA, 2.47, 0.12), v3(xA, 2.44, 0.2)], 0.012, ferro);
      peca(DIREITA, new THREE.CylinderGeometry(0.075, 0.06, 0.18, 6), luz, xA, 2.32, 0.2);
      peca(DIREITA, new THREE.ConeGeometry(0.1, 0.08, 6), ferro, xA, 2.45, 0.2);
      peca(DIREITA, new THREE.CylinderGeometry(0.05, 0.065, 0.025, 6), ferro, xA, 2.22, 0.2);

      // a floreira embaixo da janela do lado, nas duas mãos-francesas
      const W = JANELA_LESTE.x1 - JANELA_LESTE.x0;
      const cx = (JANELA_LESTE.x0 + JANELA_LESTE.x1) / 2;
      macia(DIREITA, W, 0.24, 0.26, creme, cx, 1.0, 0.16, 0.02);
      caixa(DIREITA, W - 0.08, 0.04, 0.18, terra, cx, 1.105, 0.16);
      for (const x of [JANELA_LESTE.x0 + 0.18, JANELA_LESTE.x1 - 0.18]) {
        curva(DIREITA, [v3(x, 0.72, 0.01), v3(x, 0.8, 0.08), v3(x, 0.88, 0.2)], 0.016, ferro);
      }
      const CORES = [P.flowerPink, P.flowerYellow, P.metalWhite, P.rodaVermelho];
      const VERDES = [P.leafMid, P.leafLight, P.leafDark];
      for (let i = 0; i < 34; i++) {
        const x = JANELA_LESTE.x0 + 0.06 + rnd() * (W - 0.12);
        const z = 0.08 + rnd() * 0.16;
        const dir = v3(rnd() - 0.5, 0.6 + rnd() * 0.6, rnd() * 0.6 + 0.2).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), dir)
          .multiply(new THREE.Quaternion().setFromAxisAngle(v3(0, 0, 1), (rnd() - 0.5) * 1.6));
        folhas.por(DIREITA, v3(x, 1.12, z), q, 0.07 + rnd() * 0.04, VERDES[i % VERDES.length]);
      }
      for (let i = 0; i < 13; i++) {
        const x = JANELA_LESTE.x0 + 0.08 + rnd() * (W - 0.16);
        const z = 0.1 + rnd() * 0.12;
        const p = v3(x, 1.2 + rnd() * 0.08, z);
        const dir = v3(rnd() - 0.5, 1, rnd() * 0.8).normalize();
        flores.por(DIREITA, p, new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), dir), 0.045, CORES[i % CORES.length]);
        miolos.por(DIREITA, p.clone().addScaledVector(dir, 0.008), SEM_GIRO, 0.011, P.flowerYellow);
      }

      // o ar-condicionado nos fundos (no quadro dos fundos o `x` é o `−x` da peça)
      macia(FUNDOS, 0.74, 0.3, 0.24, toon(P.metalWhite), -0.6, 2.85, 0.14, 0.03);
      for (let i = 0; i < 5; i++) caixa(FUNDOS, 0.6, 0.014, 0.012, metal, -0.6, 2.75 + i * 0.035, 0.262);
      caixa(FUNDOS, 0.12, 0.05, 0.02, toon(P.leafMid, { glow: 0.5 }), -0.82, 2.95, 0.265);
      for (const x of [-0.85, -0.35]) tubo(FUNDOS, v3(x, 2.7, 0.01), v3(x, 2.7, 0.12), 0.015, metal);
    }

    // ================================================================= A PORTA
    {
      const L = PORTA.x1 - PORTA.x0;
      const A = PORTA.y1 - Y_PISO;
      // o batente creme por fora: as de pé entre a soleira e a verga, a verga mais funda
      for (const x of [PORTA.x0 - 0.04, PORTA.x1 + 0.04]) caixa(DIREITA, 0.08, A + 0.02, 0.06, creme, x, Y_PISO + A / 2 + 0.01, 0.03);
      caixa(DIREITA, L + 0.24, 0.1, 0.075, creme, (PORTA.x0 + PORTA.x1) / 2, PORTA.y1 + 0.07, 0.0375);
      // a dobradiça: na beira do lado da frente, no meio da parede
      this.dobradica.position.set(PORTA.x0 + 0.01, Y_PISO + 0.005, -ESP / 2);
      DIREITA.add(this.dobradica);
      const folha = new THREE.Group();
      folha.position.set((L - 0.02) / 2, 0, 0);
      this.dobradica.add(folha);
      const LF = L - 0.02;
      const AF = A - 0.015;
      // a folha com o vão do vidro em cima: o corpo de baixo e as três réguas que emolduram o vidro
      macia(folha, LF, AF * 0.55, 0.05, verde, 0, AF * 0.275, 0, 0.01);
      macia(folha, LF, AF * 0.12, 0.05, verde, 0, AF * 0.94, 0, 0.01);
      // (as réguas do lado, 4 mm mais grossas: com a mesma grossura, a ponta delas dividia o plano da régua de cima)
      for (const x of [-LF / 2 + 0.073, LF / 2 - 0.073]) macia(folha, 0.14, AF * 0.34, 0.054, verde, x, AF * 0.72, 0, 0.01);
      {
        // o vidro da porta, de um lado e do outro (fica na folha, que gira)
        const vidroDaPorta = new THREE.Mesh(new THREE.PlaneGeometry(LF - 0.26, AF * 0.33), flat(P.glass, 0.3));
        vidroDaPorta.position.set(0, AF * 0.72, 0);
        folha.add(vidroDaPorta);
        const verso = vidroDaPorta.clone();
        verso.rotation.y = Math.PI;
        folha.add(verso);
      }
      // as almofadas de baixo, dos dois lados
      for (const lado of [-1, 1]) {
        for (const y of [AF * 0.15, AF * 0.4]) macia(folha, LF - 0.18, AF * 0.18, 0.02, verde, 0, y, lado * 0.03, 0.01);
      }
      // a maçaneta dourada dos dois lados, e a plaquinha de fora
      for (const lado of [-1, 1]) {
        peca(folha, new THREE.SphereGeometry(0.035, 10, 8), dourado, LF / 2 - 0.09, 1.0, lado * 0.06);
        cilindro(folha, 0.012, 0.012, 0.04, dourado, LF / 2 - 0.09, 1.0, lado * 0.035, 6).rotation.x = Math.PI / 2;
      }
      pintura(folha, 0.3, 0.12, toon(0xffffff, { mapa: plaquinhaDeFuncionarios() }), 0, AF * 0.59, 0.042);
    }

    // =========================================================== LÁ DENTRO
    {
      // as duas bancadas de cada lado do lugar da Gina, encostadas na frente
      const bancada = (x0: number, x1: number): void => {
        const l = x1 - x0;
        const cx = (x0 + x1) / 2;
        const z0 = DENTRO - 0.62;
        const cz = (z0 + DENTRO) / 2;
        macia(g, l, 0.84, 0.6, creme, cx, Y_PISO + 0.42, cz - 0.01, 0.02);
        macia(g, l + 0.04, 0.05, 0.64, madeira, cx, Y_PISO + 0.865, cz, 0.012);
        // as portinhas
        const n = Math.max(1, Math.round(l / 0.5));
        for (let i = 0; i < n; i++) {
          const x = x0 + (l / n) * (i + 0.5);
          macia(g, l / n - 0.06, 0.66, 0.02, verde, x, Y_PISO + 0.43, z0 - 0.015, 0.008);
          peca(g, new THREE.SphereGeometry(0.018, 8, 6), dourado, x + (l / n) * 0.32, Y_PISO + 0.62, z0 - 0.035);
        }
      };
      const TOPO_B = Y_PISO + 0.89;
      bancada(0.8, 2.02);
      bancada(-2.02, -0.8);

      // o MONITOR das câmeras, virado para quem trabalha (o `−z`), um tico para o meio
      const monitor = new THREE.Group();
      monitor.position.set(1.62, TOPO_B, DENTRO - 0.32);
      monitor.rotation.y = Math.PI - 0.35;
      g.add(monitor);
      macia(monitor, 0.46, 0.38, 0.34, grafite, 0, 0.24, -0.02, 0.05);
      macia(monitor, 0.32, 0.24, 0.18, grafite, 0, 0.22, -0.24, 0.05);
      macia(monitor, 0.24, 0.04, 0.2, grafite, 0, 0.02, 0, 0.012);
      pintura(monitor, 0.38, 0.29, pinturaAcesa(telaDoMonitor()), 0, 0.25, 0.153);
      // o teclado e o PAINEL DO PORTÃO (os dois botões grandes e as chavinhas)
      macia(g, 0.36, 0.03, 0.14, grafite, 1.52, TOPO_B + 0.015, DENTRO - 0.58, 0.008);
      const painel = new THREE.Group();
      painel.position.set(1.0, TOPO_B, DENTRO - 0.36);
      painel.rotation.y = Math.PI;
      painel.updateMatrix();
      g.add(painel);
      const tampa = macia(painel, 0.36, 0.1, 0.24, creme, 0, 0.05, 0, 0.02);
      tampa.rotation.x = -0.25;
      for (const [x, cor] of [[-0.08, P.leafMid], [0.08, P.rodaVermelho]] as const) {
        botoes.por(painel, v3(x, 0.1, 0.01), new THREE.Quaternion().setFromAxisAngle(v3(1, 0, 0), -0.25), v3(0.045, 0.03, 0.045), cor);
      }
      for (let i = 0; i < 4; i++) {
        botoes.por(painel, v3(-0.12 + i * 0.08, 0.075, 0.09), new THREE.Quaternion().setFromAxisAngle(v3(1, 0, 0), -0.25), v3(0.012, 0.03, 0.012), P.flowerYellow);
      }
      // o telefone e o rádio comunicador na base
      macia(g, 0.2, 0.06, 0.16, toon(P.guaritaParede), 2.0 - 0.12, TOPO_B + 0.03, DENTRO - 0.52, 0.02);
      const fone = macia(g, 0.22, 0.05, 0.06, toon(P.guaritaParede), 2.0 - 0.12, TOPO_B + 0.085, DENTRO - 0.52, 0.025);
      fone.rotation.y = 0.1;
      macia(g, 0.09, 0.05, 0.08, grafite, 0.92, TOPO_B + 0.025, DENTRO - 0.1, 0.01);
      macia(g, 0.06, 0.16, 0.035, grafite, 0.92, TOPO_B + 0.12, DENTRO - 0.1, 0.012);
      tubo(g, v3(0.9, TOPO_B + 0.2, DENTRO - 0.1), v3(0.9, TOPO_B + 0.3, DENTRO - 0.1), 0.006, grafite, 6);

      // a outra bancada: o FICHÁRIO das carteirinhas, o porta-carimbos, a caneca e a garrafa térmica
      const xF = -1.7;
      const zF = DENTRO - 0.34;
      macia(g, 0.3, 0.16, 0.42, aco, xF, TOPO_B + 0.08, zF, 0.015);
      const CORES_FICHA = [P.metalWhite, P.flowerYellow, P.flowerPink, P.glass];
      for (let i = 0; i < 18; i++) {
        fichas.por(g, v3(xF, TOPO_B + 0.17 + (i % 3) * 0.004, zF - 0.18 + i * 0.02), new THREE.Quaternion().setFromAxisAngle(v3(1, 0, 0), -0.12 + rnd() * 0.06),
          v3(0.26, 0.13, 0.006), CORES_FICHA[i % CORES_FICHA.length]);
      }
      macia(g, 0.34, 0.04, 0.12, madeira, -1.22, TOPO_B + 0.02, DENTRO - 0.2, 0.01);
      for (let i = 0; i < 4; i++) {
        const x = -1.34 + i * 0.08;
        cilindro(g, 0.014, 0.014, 0.08, madeira, x, TOPO_B + 0.08, DENTRO - 0.2, 8);
        peca(g, new THREE.SphereGeometry(0.022, 8, 6), madeiraEscura, x, TOPO_B + 0.13, DENTRO - 0.2);
      }
      peca(g, new THREE.LatheGeometry([
        new THREE.Vector2(0, 0), new THREE.Vector2(0.045, 0), new THREE.Vector2(0.05, 0.1), new THREE.Vector2(0.044, 0.1),
      ], 14), toon(P.flowerYellow), -1.0, TOPO_B, DENTRO - 0.45);
      curva(g, [v3(-0.95, TOPO_B + 0.08, DENTRO - 0.45), v3(-0.92, TOPO_B + 0.05, DENTRO - 0.45), v3(-0.95, TOPO_B + 0.025, DENTRO - 0.45)], 0.008, toon(P.flowerYellow));
      cilindro(g, 0.055, 0.055, 0.28, toon(P.rodaVermelho), -1.0, TOPO_B + 0.14, DENTRO - 0.18, 14);
      cilindro(g, 0.045, 0.055, 0.06, metal, -1.0, TOPO_B + 0.31, DENTRO - 0.18, 14);

      // nos fundos, por dentro: o QUADRO DE CHAVES e o MURAL de cortiça
      // (no quadro de dentro dos fundos, o `x` é o da peça)
      macia(DENTRO_FUNDOS, 0.62, 0.46, 0.04, madeira, 1.3, 1.75, 0.02, 0.012);
      const CORES_CHAVE = [P.rodaVermelho, P.flowerYellow, P.leafMid, P.vestiarioPorta, P.flowerPink];
      for (let i = 0; i < 12; i++) {
        const x = 1.3 - 0.24 + (i % 4) * 0.16;
        const y = 1.88 - Math.floor(i / 4) * 0.14;
        peca(DENTRO_FUNDOS, new THREE.SphereGeometry(0.01, 6, 4), dourado, x, y, 0.045);
        if (i % 5 !== 3) {
          chaveiros.por(DENTRO_FUNDOS, v3(x, y - 0.05, 0.05), new THREE.Quaternion().setFromAxisAngle(v3(0, 0, 1), (rnd() - 0.5) * 0.3),
            v3(0.04, 0.06, 0.012), CORES_CHAVE[i % CORES_CHAVE.length]);
        }
      }
      macia(DENTRO_FUNDOS, 0.96, 0.66, 0.035, madeiraEscura, 0.1, 1.78, 0.0175, 0.01);
      pintura(DENTRO_FUNDOS, 0.88, 0.58, toon(0xffffff, { mapa: muralDeCortica() }), 0.1, 1.78, 0.037);

      // no lado do muro, por dentro: o ARQUIVO de aço e o GARRAFÃO d'água
      // (no quadro de dentro da esquerda, o `x` é o `−z` da peça)
      macia(DENTRO_ESQUERDA, 0.5, 1.12, 0.55, aco, 0.95, Y_PISO + 0.56, 0.275, 0.02);
      for (let i = 0; i < 3; i++) {
        const y = Y_PISO + 0.22 + i * 0.35;
        macia(DENTRO_ESQUERDA, 0.44, 0.3, 0.02, aco, 0.95, y, 0.555, 0.01);
        caixa(DENTRO_ESQUERDA, 0.16, 0.025, 0.03, metal, 0.95, y + 0.08, 0.575);
        caixa(DENTRO_ESQUERDA, 0.1, 0.05, 0.005, papel, 0.95, y + 0.02, 0.567);
      }
      // um vaso com a espada-de-são-jorge em cima do arquivo
      peca(DENTRO_ESQUERDA, new THREE.CylinderGeometry(0.09, 0.07, 0.16, 12), terra, 0.95, Y_PISO + 1.2, 0.3);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        folhas.por(DENTRO_ESQUERDA, v3(0.95 + Math.cos(a) * 0.03, Y_PISO + 1.27, 0.3 + Math.sin(a) * 0.03),
          new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), v3(Math.cos(a) * 0.25, 1, Math.sin(a) * 0.25).normalize()),
          0.2 + (i % 3) * 0.05, i % 2 ? P.leafDark : P.leafMid);
      }
      // o garrafão no suporte
      cilindro(DENTRO_ESQUERDA, 0.17, 0.17, 0.85, creme, -0.3, Y_PISO + 0.425, 0.3, 16);
      caixa(DENTRO_ESQUERDA, 0.05, 0.04, 0.05, toon(P.vestiarioPorta), -0.3, Y_PISO + 0.62, 0.48);
      peca(DENTRO_ESQUERDA, new THREE.LatheGeometry([
        new THREE.Vector2(0, 0), new THREE.Vector2(0.14, 0.02), new THREE.Vector2(0.15, 0.3), new THREE.Vector2(0.06, 0.4), new THREE.Vector2(0.04, 0.46),
        new THREE.Vector2(0.0, 0.46),
      ], 16), flat(P.glass, 0.45), -0.3, Y_PISO + 0.85, 0.3);

      // o CABIDEIRO perto da porta, com o guarda-chuva e o quepe reserva
      const cab = v3(1.85, Y_PISO, 0.1);
      cilindro(g, 0.18, 0.2, 0.03, ferro, cab.x, Y_PISO + 0.015, cab.z, 14);
      cilindro(g, 0.022, 0.022, 1.7, ferro, cab.x, Y_PISO + 0.85, cab.z, 8);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        curva(g, [v3(cab.x, Y_PISO + 1.6, cab.z), v3(cab.x + Math.cos(a) * 0.1, Y_PISO + 1.62, cab.z + Math.sin(a) * 0.1),
          v3(cab.x + Math.cos(a) * 0.15, Y_PISO + 1.7, cab.z + Math.sin(a) * 0.15)], 0.012, ferro);
      }
      peca(g, new THREE.SphereGeometry(0.035, 10, 8), dourado, cab.x, Y_PISO + 1.72, cab.z);
      // o quepe reserva no gancho
      const quepe = new THREE.Group();
      quepe.position.set(cab.x + 0.12, Y_PISO + 1.68, cab.z + 0.08);
      quepe.rotation.set(0.3, 0.6, -0.4);
      g.add(quepe);
      cilindro(quepe, 0.1, 0.11, 0.07, toon(P.portaoFerro), 0, 0.035, 0, 14);
      macia(quepe, 0.14, 0.012, 0.08, toon(0x23302c), 0, 0.006, 0.08, 0.005);
      // o guarda-chuva fechado encostado
      const guardaChuva = new THREE.Group();
      guardaChuva.position.set(cab.x - 0.1, Y_PISO + 0.03, cab.z - 0.14);
      guardaChuva.rotation.z = 0.12;
      g.add(guardaChuva);
      peca(guardaChuva, new THREE.ConeGeometry(0.06, 0.7, 8), toon(P.guaritaFaixa), 0, 0.5, 0);
      cilindro(guardaChuva, 0.008, 0.008, 0.18, ferro, 0, 0.09, 0, 6);
      curva(guardaChuva, [v3(0, 0.85, 0), v3(0, 0.92, 0), v3(0.04, 0.95, 0), v3(0.07, 0.9, 0)], 0.01, madeiraEscura);

      // o BANQUINHO alto, para quem ajuda
      const banco = v3(1.25, Y_PISO, 0.35);
      peca(g, new THREE.CylinderGeometry(0.19, 0.17, 0.06, 16), madeira, banco.x, Y_PISO + 0.76, banco.z);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        tubo(g, v3(banco.x + Math.cos(a) * 0.12, Y_PISO + 0.74, banco.z + Math.sin(a) * 0.12),
          v3(banco.x + Math.cos(a) * 0.18, Y_PISO, banco.z + Math.sin(a) * 0.18), 0.016, ferro, 6);
      }
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.01, 6, 20), ferro);
      aro.rotation.x = Math.PI / 2;
      aro.position.set(banco.x, Y_PISO + 0.3, banco.z);
      g.add(aro);

      // o capacho de dentro, na frente do lugar da Gina
      macia(g, 1.0, 0.012, 0.6, toon(P.corticaEscura), 0, Y_PISO + 0.006, 0.2, 0.004);
    }

    // ================================================================ O TETO
    g.add(this.teto);
    {
      // o forro de dentro (de baixo, é o teto da sala)
      caixa(this.teto, MEIO * 2 + 0.02, 0.04, DENTRO * 2 + 0.02, creme, 0, Y_TOPO - 0.04, 0);

      /*
       * AS QUATRO ÁGUAS. A beira sai 26 cm da parede e mora 6 cm abaixo do
       * alto da cornija: a telha a cruza, e o vão entre as duas some.
       */
      const BEIRAL = 0.26;
      const A = HX + BEIRAL;
      const B = HZ + BEIRAL;
      const Y0 = 3.42;
      const INCL = 0.52;
      const H = B * Math.tan(INCL);
      const R = A - B;
      const CUME = Y0 + H;
      const inclinado = 1 / Math.cos(INCL);
      /** uma água em pé no `+Z`: a beira em `z = B`, de meia largura `L`, e a cumeeira em `z = 0`, de meia largura `r` */
      const agua = (L: number, r: number): THREE.BufferGeometry => {
        const pts = [v3(-L, 0, B), v3(L, 0, B), v3(r, H, 0), v3(-r, H, 0)];
        const pos: number[] = [];
        const uv: number[] = [];
        for (const p of pts) {
          pos.push(p.x, p.y, p.z);
          uv.push(p.x, (B - p.z) * inclinado);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        geo.setIndex(r > 0 ? [0, 1, 2, 0, 2, 3] : [0, 1, 2]);
        geo.computeVertexNormals();
        return geo;
      };
      const pecaDoTeto = (geo: THREE.BufferGeometry, giro: number, dx: number, dz: number): void => {
        const m = new THREE.Mesh(geo, telha);
        m.rotation.y = giro;
        m.position.set(dx, Y0, dz);
        this.teto.add(m);
      };
      pecaDoTeto(agua(A, R), 0, 0, 0);
      pecaDoTeto(agua(A, R), Math.PI, 0, 0);
      pecaDoTeto(agua(B, 0), Math.PI / 2, R, 0);
      pecaDoTeto(agua(B, 0), -Math.PI / 2, -R, 0);

      // a cumeeira e os quatro espigões, com a bolinha em cada encontro
      const sobe = 0.035;
      tubo(this.teto, v3(-R, CUME + sobe, 0), v3(R, CUME + sobe, 0), 0.065, cumeeira, 10);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) tubo(this.teto, v3(sx * R, CUME + sobe, 0), v3(sx * (A - 0.02), Y0 + sobe, sz * (B - 0.02)), 0.055, cumeeira, 10);
        peca(this.teto, new THREE.SphereGeometry(0.09, 12, 8), cumeeira, sx * R, CUME + sobe, 0);
      }

      // a testeira verde na beira, e o LAMBREQUIM vermelho de meias-luas pendurado nela
      const T = 0.12;
      caixa(this.teto, 2 * A + 0.08, T, 0.04, verde, 0, Y0 - 0.02, B + 0.02);
      caixa(this.teto, 2 * A + 0.08, T, 0.04, verde, 0, Y0 - 0.02, -B - 0.02);
      caixa(this.teto, 0.04, T, 2 * B, verde, A + 0.02, Y0 - 0.02, 0);
      caixa(this.teto, 0.04, T, 2 * B, verde, -A - 0.02, Y0 - 0.02, 0);
      const lambrequim = (meia: number): THREE.BufferGeometry => {
        const PASSO = 0.18;
        const n = Math.max(2, Math.round((meia * 2) / PASSO));
        const passo = (meia * 2) / n;
        const s = new THREE.Shape();
        s.moveTo(-meia, 0);
        s.lineTo(meia, 0);
        s.lineTo(meia, -0.05);
        for (let i = n - 1; i >= 0; i--) {
          const cx = -meia + passo * (i + 0.5);
          s.absarc(cx, -0.05, passo / 2, 0, Math.PI, true);
        }
        s.lineTo(-meia, 0);
        const geo = new THREE.ExtrudeGeometry(s, { depth: 0.015, bevelEnabled: false, curveSegments: 6 });
        geo.translate(0, 0, -0.0075);
        return geo;
      };
      const lado = (geo: THREE.BufferGeometry, x: number, z: number, giro: number): void => {
        const m = new THREE.Mesh(geo, vermelho);
        m.position.set(x, Y0 - 0.075, z);
        m.rotation.y = giro;
        this.teto.add(m);
      };
      lado(lambrequim(A + 0.02), 0, B + 0.012, 0);
      lado(lambrequim(A + 0.02), 0, -B - 0.012, Math.PI);
      lado(lambrequim(B - 0.01), A + 0.012, 0, Math.PI / 2);
      lado(lambrequim(B - 0.01), -A - 0.012, 0, -Math.PI / 2);

      // a PLACA da portaria em pé na beira da frente, nos dois pés de ferro
      const zP = B - 0.42;
      const yP = Y0 + (B - zP) * Math.tan(INCL);
      for (const x of [-0.62, 0.62]) tubo(this.teto, v3(x, yP - 0.05, zP), v3(x, yP + 0.42, zP), 0.022, ferro);
      macia(this.teto, 1.58, 0.42, 0.05, verde, 0, yP + 0.52, zP + 0.02, 0.02);
      pintura(this.teto, 1.52, 0.38, toon(0xffffff, { mapa: placaDaPortaria() }), 0, yP + 0.52, zP + 0.048);
      // o escudo em cima da placa
      const escudo = new THREE.Group();
      escudo.position.set(0, yP + 0.92, zP + 0.02);
      this.teto.add(escudo);
      const disco = cilindro(escudo, 0.19, 0.19, 0.04, dourado, 0, 0, 0, 24);
      disco.rotation.x = Math.PI / 2;
      peca(escudo, new THREE.CircleGeometry(0.17, 24), toon(P.placaPintada, { mapa: escudoDoClube() }), 0, 0, 0.022);

      // o CATAVENTO da girafa no alto da cumeeira
      tubo(this.teto, v3(0, CUME, 0), v3(0, CUME + 0.8, 0), 0.018, ferro);
      peca(this.teto, new THREE.SphereGeometry(0.05, 10, 8), dourado, 0, CUME + 0.4, 0);
      // a cruz dos rumos, parada
      for (const giro of [0, Math.PI / 2]) {
        // (um braço um tico mais grosso que o outro: iguais, as faces de cima e de baixo brigavam no cruzamento)
        const braco = caixa(this.teto, 0.5, giro ? 0.018 : 0.014, giro ? 0.018 : 0.014, ferro, 0, CUME + 0.48, 0);
        braco.rotation.y = giro;
      }
      for (const [x, z] of [[0.25, 0], [-0.25, 0], [0, 0.25], [0, -0.25]]) {
        peca(this.teto, new THREE.SphereGeometry(0.025, 8, 6), dourado, x, CUME + 0.48, z);
      }
      // a seta e a girafinha, que giram com o vento
      this.catavento.position.set(0, CUME + 0.66, 0);
      this.teto.add(this.catavento);
      caixa(this.catavento, 0.7, 0.016, 0.016, ferro, 0, 0, 0);
      peca(this.catavento, new THREE.ConeGeometry(0.045, 0.12, 4), ferro, 0.38, 0, 0).rotation.z = -Math.PI / 2;
      const rabo = new THREE.Shape();
      rabo.moveTo(0, 0); rabo.lineTo(-0.14, 0.08); rabo.lineTo(-0.12, 0); rabo.lineTo(-0.14, -0.08); rabo.closePath();
      peca(this.catavento, extrudar(rabo, 0.01, -0.005), ferro, -0.33, 0, 0);
      const girafa = new THREE.Shape();
      girafa.moveTo(-0.16, 0);
      girafa.lineTo(-0.14, 0.12);
      girafa.lineTo(0.06, 0.13);
      girafa.lineTo(0.1, 0.36);
      girafa.lineTo(0.18, 0.4);
      girafa.lineTo(0.2, 0.36);
      girafa.lineTo(0.13, 0.32);
      girafa.lineTo(0.11, 0.12);
      girafa.lineTo(0.12, 0);
      girafa.lineTo(0.09, 0);
      girafa.lineTo(0.07, 0.07);
      girafa.lineTo(-0.11, 0.07);
      girafa.lineTo(-0.13, 0);
      girafa.closePath();
      peca(this.catavento, extrudar(girafa, 0.012, -0.006), dourado, -0.02, 0.01, 0);
    }

    // ================================================================= FIM
    /*
     * As miudezas de cor lisa (o ferro, o verde, o creme, os botões do
     * telefone, o quepe…) viram uma malha de cor por vértice; o que tem nome
     * (o teto, a porta, o led), textura ou brilho fica como está.
     */
    juntarPorCor(g);
    flores.montar(g);
    miolos.montar(g);
    folhas.montar(g);
    chaveiros.montar(g);
    fichas.montar(g);
    botoes.montar(g);
    /*
     * O VIDRO é uma malha só, de dentro e de fora (juntado à mão: transparente
     * não entra na `fundir()`).
     */
    if (vidros.length) {
      const pos: number[] = [];
      const nor: number[] = [];
      for (const geo of vidros) {
        pos.push(...(geo.getAttribute('position').array as Float32Array));
        nor.push(...(geo.getAttribute('normal').array as Float32Array));
      }
      const junta = new THREE.BufferGeometry();
      junta.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      junta.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      const m = new THREE.Mesh(junta, vidro);
      m.renderOrder = 3;
      g.add(m);
    }
  }

  /** o catavento balança com a brisa e o led da câmera pisca */
  update(dt: number): void {
    this.relogio += dt;
    const t = this.relogio;
    this.catavento.rotation.y = 0.6 + Math.sin(t * 0.37) * 0.5 + Math.sin(t * 1.3) * 0.08;
    this.ledAceso.visible = t % 1.6 < 0.8;
  }

  /** tira (ou devolve) o telhado: para ver o trabalho lá dentro de cima */
  mostrarTeto(sim: boolean): void {
    this.teto.visible = sim;
  }
}
