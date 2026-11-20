/**
 * OS PAPÉIS DA PORTARIA — a carteirinha, o convite, o crachá, a ordem de
 * entrega, o exame da piscina, a prancheta, o calendário e o RETRATO de cada
 * bicho, todos pintados em canvas (nenhuma imagem de fora).
 *
 * UM PINTOR, DUAS SAÍDAS (`docs/PORTARIA-DO-CLUBE.md` §14): o mesmo canvas é a
 * textura do papel em cima da bancada (3D) e a folha ampliada da mesa
 * (`ui/mesaDaPortaria.ts`), onde se lê e se aponta. Cada campo é pintado no
 * retângulo que `minigames/portaria/campos.ts` diz — e a mesa põe o alvo
 * clicável no mesmo lugar.
 *
 * O RETRATO sai da ficha (`Retrato`: espécie, cor, marca, cabelo, enfeite): a
 * cabeça e o focinho de cada espécie, a pelagem pelo nome, a marca que
 * distingue (é ela que denuncia o Beto e a Alpacona) e o enfeite — que é onde
 * moram os disfarces do Jean-Luc.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { PAPEIS } from '../minigames/portaria/campos';
import { escrever, NOME_DO_CLUBE, NOME_DO_ITEM, type Carimbo, type Data, type Documento, type Especie, type LinhaDaLista, type Retrato } from '../minigames/portaria/tipos';
import { FONTE_FORMA } from './halloween/barracaDoWalter';

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const LETRA = 'ui-rounded, "Nunito", system-ui, sans-serif';
const MAO = FONTE_FORMA;

/** clareia (k > 1) ou escurece (k < 1) uma cor da paleta */
function tom(c: number, k: number): string {
  const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
  const f = (v: number): number => Math.max(0, Math.min(255, Math.round(k >= 1 ? v + (255 - v) * (k - 1) : v * k)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

// ================================================================ o retrato

/** a pelagem pelo nome (o `Retrato.cor`) */
export const PELAGEM: Readonly<Record<string, number>> = {
  lilas: P.peloLilas, creme: P.peloCreme, rosa: P.peloRosa, caramelo: P.peloCaramelo, bege: P.peloBege,
  marrom: P.peloMarrom, chocolate: P.peloChocolate, mel: P.peloMel, cinza: P.peloCinza, cinzaClaro: P.peloCinzaClaro,
  cinzaAzulado: P.peloCinzaAzulado, cinzaEscuro: P.peloCinzaEscuro, cinzaRosado: P.peloCinzaRosado, grafite: P.peloGrafite,
  branco: P.peloBranco, branca: P.peloBranco, malhado: P.peloMalhado, ferrugem: P.peloFerrugem, laranja: P.peloLaranja,
  vermelhoEscuro: P.peloVermelhoEscuro, pretoEBranco: P.peloPretoEBranco, verde: P.peloVerde, azulMarinho: P.peloAzulMarinho,
  azulPelucia: P.peloAzulPelucia, azulPavao: P.peloAzulPavao, variado: P.peloVariado,
};

type Orelha = 'banana' | 'redonda' | 'pontuda' | 'comprida' | 'caida' | 'pequena' | 'enorme' | 'nenhuma' | 'chifre' | 'penacho' | 'horizontal';
type Focinho = 'largo' | 'tromba' | 'bico' | 'bicoComprido' | 'porco' | 'curto' | 'longo' | 'quadrado' | 'nenhum';

/** o desenho de cada espécie: o tamanho da cabeça (fração do quadro), as orelhas e o focinho */
const DESENHO: Readonly<Record<Especie, { rx: number; ry: number; orelha: Orelha; focinho: Focinho; claro?: boolean }>> = {
  hipopotamo: { rx: 0.36, ry: 0.3, orelha: 'pequena', focinho: 'largo' },
  alpaca: { rx: 0.24, ry: 0.3, orelha: 'banana', focinho: 'curto', claro: true },
  porquinho: { rx: 0.31, ry: 0.28, orelha: 'caida', focinho: 'porco' },
  tamandua: { rx: 0.22, ry: 0.24, orelha: 'pequena', focinho: 'longo' },
  preguica: { rx: 0.29, ry: 0.27, orelha: 'nenhuma', focinho: 'curto', claro: true },
  lontra: { rx: 0.27, ry: 0.25, orelha: 'pequena', focinho: 'curto', claro: true },
  bode: { rx: 0.23, ry: 0.3, orelha: 'horizontal', focinho: 'quadrado' },
  coala: { rx: 0.3, ry: 0.27, orelha: 'enorme', focinho: 'curto' },
  pandaVermelho: { rx: 0.29, ry: 0.26, orelha: 'pontuda', focinho: 'curto', claro: true },
  texugo: { rx: 0.28, ry: 0.25, orelha: 'pequena', focinho: 'longo' },
  peru: { rx: 0.22, ry: 0.25, orelha: 'nenhuma', focinho: 'bico' },
  tartaruga: { rx: 0.25, ry: 0.24, orelha: 'nenhuma', focinho: 'nenhum' },
  capivara: { rx: 0.3, ry: 0.27, orelha: 'pequena', focinho: 'quadrado' },
  pato: { rx: 0.27, ry: 0.27, orelha: 'nenhuma', focinho: 'bico' },
  ovelha: { rx: 0.27, ry: 0.28, orelha: 'horizontal', focinho: 'curto' },
  pinguim: { rx: 0.29, ry: 0.29, orelha: 'nenhuma', focinho: 'bico' },
  elefante: { rx: 0.29, ry: 0.28, orelha: 'enorme', focinho: 'tromba' },
  gato: { rx: 0.31, ry: 0.27, orelha: 'pontuda', focinho: 'curto' },
  ursa: { rx: 0.31, ry: 0.28, orelha: 'redonda', focinho: 'curto', claro: true },
  coelha: { rx: 0.27, ry: 0.26, orelha: 'comprida', focinho: 'curto' },
  raposa: { rx: 0.28, ry: 0.25, orelha: 'pontuda', focinho: 'longo', claro: true },
  lobo: { rx: 0.29, ry: 0.27, orelha: 'pontuda', focinho: 'longo', claro: true },
  cachorro: { rx: 0.29, ry: 0.27, orelha: 'caida', focinho: 'curto' },
  flamingo: { rx: 0.21, ry: 0.23, orelha: 'nenhuma', focinho: 'bicoComprido' },
  pavao: { rx: 0.21, ry: 0.23, orelha: 'penacho', focinho: 'bico' },
};

const elipse = (c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot = 0): void => {
  c.beginPath();
  c.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot, 0, Math.PI * 2);
};

/**
 * PINTA O RETRATO no quadro (x, y, l, a): o fundo de estúdio, os ombros, a
 * cabeça da espécie, a marca, o cabelo e o enfeite. `tapado` cobre a cara (o
 * capacete do Capy na janela).
 */
export function pintarRetrato(c: CanvasRenderingContext2D, x: number, y: number, l: number, a: number, r: Retrato, opts: { fundo?: boolean; tapado?: string } = {}): void {
  const d = DESENHO[r.especie];
  const pelo = PELAGEM[r.cor] ?? P.peloCaramelo;
  const escuro = tom(pelo, 0.72);
  const claro = tom(pelo, 1.45);
  const s = Math.min(l, a);
  const cx = x + l / 2;
  const cy = y + a * 0.47;
  const rx = d.rx * s;
  const ry = d.ry * s;
  c.save();
  c.beginPath();
  c.rect(x, y, l, a);
  c.clip();
  if (opts.fundo !== false) {
    const gr = c.createLinearGradient(x, y, x, y + a);
    gr.addColorStop(0, '#d9ecf4');
    gr.addColorStop(1, '#a9cfe0');
    c.fillStyle = gr;
    c.fillRect(x, y, l, a);
  }
  c.lineJoin = 'round';
  c.lineCap = 'round';
  c.lineWidth = Math.max(1, s * 0.012);
  c.strokeStyle = 'rgba(40,30,30,0.55)';

  // ---- os ombros (e o casco, a camisa, o uniforme)
  const ombro = r.especie === 'tartaruga' ? P.peloVerde : r.especie === 'pinguim' ? P.peloAzulMarinho : pelo;
  c.fillStyle = css(ombro);
  elipse(c, cx, y + a * 1.02, s * 0.46, s * 0.3);
  c.fill(); c.stroke();
  if (r.marca === 'peitoBranco' || r.especie === 'pinguim') { c.fillStyle = css(P.peloBranco); elipse(c, cx, y + a * 1.0, s * 0.2, s * 0.22); c.fill(); }
  if (r.marca === 'uniformeVermelho') { c.fillStyle = '#c94040'; elipse(c, cx, y + a * 1.02, s * 0.46, s * 0.3); c.fill(); }
  if (r.marca === 'faixaNoPeito' || r.especie === 'tamandua') {
    c.fillStyle = '#2b2622';
    c.beginPath(); c.moveTo(cx - s * 0.42, y + a * 0.86); c.lineTo(cx + s * 0.1, y + a * 1.0); c.lineTo(cx + s * 0.02, y + a * 1.05); c.lineTo(cx - s * 0.45, y + a * 0.95); c.fill();
  }
  if (r.enfeite === 'cascoDePapelao' || r.especie === 'tartaruga') {
    // o casco por trás dos ombros (o de papelão é marrom e tem fita)
    const papelao = r.enfeite === 'cascoDePapelao';
    c.fillStyle = papelao ? '#c79a62' : '#5d8a4f';
    elipse(c, cx, y + a * 0.98, s * 0.5, s * 0.24); c.fill(); c.stroke();
    c.strokeStyle = papelao ? 'rgba(90,60,30,0.7)' : 'rgba(30,60,30,0.6)';
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(cx + k * s * 0.12, y + a * 0.86); c.lineTo(cx + k * s * 0.1, y + a * 1.1); c.stroke(); }
    if (papelao) { c.fillStyle = 'rgba(240,235,200,0.8)'; c.fillRect(cx - s * 0.32, y + a * 0.9, s * 0.18, s * 0.05); }
    c.strokeStyle = 'rgba(40,30,30,0.55)';
  }
  if (r.marca === 'cascoDeFlor') {
    c.fillStyle = '#f2b3bf';
    for (const k of [-1, 1]) { elipse(c, cx + k * s * 0.28, y + a * 0.96, s * 0.04, s * 0.04); c.fill(); }
  }

  // ---- o pescoço (os compridos)
  if (r.especie === 'alpaca' || r.especie === 'flamingo' || r.especie === 'pavao' || r.especie === 'peru') {
    c.fillStyle = css(pelo);
    c.fillRect(cx - s * 0.08, cy, s * 0.16, a * 0.5);
  }

  // ---- as orelhas (atrás da cabeça)
  const orelha = (lado: number): void => {
    const ox = cx + lado * rx * 0.78;
    const oy = cy - ry * 0.72;
    c.fillStyle = css(pelo);
    switch (d.orelha) {
      case 'redonda': elipse(c, ox, oy, rx * 0.32, rx * 0.32); c.fill(); c.stroke(); c.fillStyle = claro; elipse(c, ox, oy, rx * 0.17, rx * 0.17); c.fill(); break;
      case 'pequena': elipse(c, ox, oy + ry * 0.12, rx * 0.2, rx * 0.17); c.fill(); c.stroke(); break;
      case 'pontuda':
        c.beginPath(); c.moveTo(ox - lado * rx * 0.3, oy + ry * 0.25); c.lineTo(ox + lado * rx * 0.12, oy - ry * 0.55); c.lineTo(ox + lado * rx * 0.38, oy + ry * 0.2); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = d.claro ? '#f7efe4' : claro; c.beginPath(); c.moveTo(ox - lado * rx * 0.12, oy + ry * 0.15); c.lineTo(ox + lado * rx * 0.12, oy - ry * 0.32); c.lineTo(ox + lado * rx * 0.25, oy + ry * 0.12); c.fill();
        break;
      case 'comprida': elipse(c, ox + lado * rx * 0.05, oy - ry * 0.55, rx * 0.17, ry * 0.62, lado * 0.15); c.fill(); c.stroke(); c.fillStyle = '#f4c6cf'; elipse(c, ox + lado * rx * 0.05, oy - ry * 0.5, rx * 0.08, ry * 0.45, lado * 0.15); c.fill(); break;
      case 'caida': elipse(c, ox + lado * rx * 0.22, oy + ry * 0.35, rx * 0.22, ry * 0.42, lado * -0.35); c.fillStyle = escuro; c.fill(); c.stroke(); break;
      case 'enorme': elipse(c, ox + lado * rx * 0.25, oy + ry * 0.15, rx * 0.52, ry * 0.62); c.fill(); c.stroke(); c.fillStyle = r.especie === 'elefante' ? '#e8b4bf' : claro; elipse(c, ox + lado * rx * 0.25, oy + ry * 0.15, rx * 0.32, ry * 0.42); c.fill(); break;
      case 'horizontal': elipse(c, ox + lado * rx * 0.45, oy + ry * 0.3, rx * 0.34, ry * 0.12, lado * 0.2); c.fill(); c.stroke(); break;
      case 'banana': elipse(c, ox + lado * rx * 0.02, oy - ry * 0.32, rx * 0.15, ry * 0.36, lado * 0.32); c.fill(); c.stroke(); c.fillStyle = claro; elipse(c, ox + lado * rx * 0.02, oy - ry * 0.3, rx * 0.07, ry * 0.24, lado * 0.32); c.fill(); break;
      case 'chifre': case 'nenhuma': case 'penacho': break;
    }
  };
  orelha(-1); orelha(1);
  if (r.especie === 'bode') {
    // os chifres (o torto do figurante entorta um)
    c.strokeStyle = '#d6c5a2'; c.lineWidth = s * 0.035;
    for (const lado of [-1, 1]) {
      const torto = r.marca === 'chifreTorto' && lado > 0;
      c.beginPath(); c.moveTo(cx + lado * rx * 0.35, cy - ry * 0.8); c.quadraticCurveTo(cx + lado * rx * 0.6, cy - ry * 1.5, cx + lado * rx * (torto ? 1.2 : 0.95), cy - ry * (torto ? 1.05 : 1.55)); c.stroke();
    }
    c.lineWidth = Math.max(1, s * 0.012); c.strokeStyle = 'rgba(40,30,30,0.55)';
  }
  if (d.orelha === 'penacho') {
    c.strokeStyle = css(pelo); c.lineWidth = s * 0.012;
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(cx, cy - ry * 0.9); c.lineTo(cx + k * rx * 0.25, cy - ry * 1.55); c.stroke(); c.fillStyle = '#e0b84a'; elipse(c, cx + k * rx * 0.25, cy - ry * 1.58, s * 0.022, s * 0.022); c.fill(); }
    c.lineWidth = Math.max(1, s * 0.012); c.strokeStyle = 'rgba(40,30,30,0.55)';
  }

  // ---- a cabeça
  const gr = c.createRadialGradient(cx - rx * 0.3, cy - ry * 0.35, rx * 0.1, cx, cy, rx * 1.15);
  gr.addColorStop(0, claro);
  gr.addColorStop(1, css(pelo));
  c.fillStyle = gr;
  if (r.especie === 'ovelha' || r.especie === 'alpaca') {
    // a lã: bolotas em volta do rosto
    c.fillStyle = r.especie === 'ovelha' ? '#f7f2e8' : claro;
    for (let k = 0; k < 9; k++) { const t = (k / 9) * Math.PI * 2; elipse(c, cx + Math.cos(t) * rx * 0.85, cy - ry * 0.25 + Math.sin(t) * ry * 0.6, rx * 0.32, rx * 0.32); c.fill(); }
    c.fillStyle = gr;
  }
  elipse(c, cx, cy, rx, ry);
  c.fill(); c.stroke();
  if (r.especie === 'ovelha') { c.fillStyle = '#3d3434'; elipse(c, cx, cy + ry * 0.12, rx * 0.62, ry * 0.7); c.fill(); }
  if (r.especie === 'texugo' || r.marca === 'listraBranca') {
    c.fillStyle = '#f2efe8'; c.beginPath(); c.moveTo(cx - rx * 0.16, cy - ry); c.lineTo(cx + rx * 0.16, cy - ry); c.lineTo(cx + rx * 0.08, cy + ry * 0.5); c.lineTo(cx - rx * 0.08, cy + ry * 0.5); c.fill();
  }
  if (r.especie === 'pandaVermelho' || r.especie === 'raposa' || r.especie === 'lobo' || r.especie === 'lontra') {
    c.fillStyle = '#f7efe4'; elipse(c, cx, cy + ry * 0.45, rx * 0.62, ry * 0.42); c.fill();
  }
  if (r.especie === 'preguica' || r.marca === 'mascaraDosOlhos') {
    c.fillStyle = 'rgba(70,50,40,0.75)';
    for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.36, cy - ry * 0.02, rx * 0.26, ry * 0.15, lado * 0.45); c.fill(); }
  }
  if (r.especie === 'pinguim') { c.fillStyle = css(P.peloBranco); elipse(c, cx, cy + ry * 0.12, rx * 0.72, ry * 0.7); c.fill(); }
  if (r.especie === 'gato') {
    // o Gatito de pelúcia: as costuras
    c.strokeStyle = 'rgba(30,30,60,0.45)'; c.setLineDash([s * 0.015, s * 0.012]);
    c.beginPath(); c.moveTo(cx, cy - ry); c.lineTo(cx, cy - ry * 0.45); c.stroke(); c.setLineDash([]); c.strokeStyle = 'rgba(40,30,30,0.55)';
  }

  if (r.marca === 'manchaCaramelo') {
    // o Gatito: a mancha caramelo cobrindo o lado direito da cabeça e a orelha (o branco do resto é o creme)
    c.save();
    elipse(c, cx, cy, rx, ry);
    c.clip();
    c.fillStyle = css(P.gatitoCaramelo);
    elipse(c, cx + rx * 0.75, cy - ry * 0.45, rx * 0.75, ry * 0.7, -0.4);
    c.fill();
    c.restore();
    c.fillStyle = css(P.gatitoCaramelo);
    c.beginPath(); c.moveTo(cx + rx * 0.5, cy - ry * 0.55); c.lineTo(cx + rx * 0.9, cy - ry * 1.27); c.lineTo(cx + rx * 1.16, cy - ry * 0.5); c.fill();
  }
  // ---- o focinho
  const fy = cy + ry * 0.35;
  switch (d.focinho) {
    case 'largo':
      c.fillStyle = claro; elipse(c, cx, fy + ry * 0.08, rx * 0.75, ry * 0.45); c.fill(); c.stroke();
      c.fillStyle = escuro; for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.28, fy - ry * 0.02, rx * 0.07, ry * 0.06); c.fill(); }
      break;
    case 'porco':
      c.fillStyle = tom(P.peloRosa, 0.92); elipse(c, cx, fy, rx * 0.3, ry * 0.22); c.fill(); c.stroke();
      c.fillStyle = '#a0545e'; for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.1, fy, rx * 0.05, ry * 0.07); c.fill(); }
      break;
    case 'tromba':
      c.fillStyle = css(pelo); c.beginPath(); c.moveTo(cx - rx * 0.16, fy - ry * 0.3); c.quadraticCurveTo(cx - rx * 0.2, fy + ry * 0.7, cx - rx * 0.02, fy + ry * 1.05); c.lineTo(cx + rx * 0.2, fy + ry * 0.95); c.quadraticCurveTo(cx + rx * 0.14, fy + ry * 0.5, cx + rx * 0.16, fy - ry * 0.3); c.fill(); c.stroke();
      break;
    case 'bico':
      c.fillStyle = r.especie === 'pinguim' ? '#f0a33a' : r.especie === 'peru' ? '#e9b44c' : '#f3a33a';
      c.beginPath(); elipse(c, cx, fy, rx * 0.42, ry * 0.18); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(120,60,20,0.6)'; c.beginPath(); c.moveTo(cx - rx * 0.38, fy); c.lineTo(cx + rx * 0.38, fy); c.stroke(); c.strokeStyle = 'rgba(40,30,30,0.55)';
      break;
    case 'bicoComprido':
      c.fillStyle = '#f7efe4'; c.beginPath(); c.moveTo(cx - rx * 0.15, fy - ry * 0.1); c.quadraticCurveTo(cx + rx * 0.6, fy, cx + rx * 0.2, fy + ry * 0.7); c.lineTo(cx, fy + ry * 0.2); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#2b2622'; elipse(c, cx + rx * 0.22, fy + ry * 0.55, rx * 0.1, ry * 0.14); c.fill();
      break;
    case 'longo':
      c.fillStyle = r.especie === 'tamandua' ? css(pelo) : '#f7efe4';
      c.beginPath(); c.moveTo(cx - rx * 0.28, fy - ry * 0.3); c.quadraticCurveTo(cx, fy + ry * (r.especie === 'tamandua' ? 1.25 : 0.75), cx + rx * 0.28, fy - ry * 0.3); c.fill(); c.stroke();
      c.fillStyle = '#2b2622'; elipse(c, cx, fy + ry * (r.especie === 'tamandua' ? 0.85 : 0.42), rx * 0.1, ry * 0.07); c.fill();
      break;
    case 'quadrado':
      c.fillStyle = claro; c.beginPath(); c.roundRect(cx - rx * 0.42, fy - ry * 0.22, rx * 0.84, ry * 0.5, rx * 0.15); c.fill(); c.stroke();
      c.fillStyle = '#2b2622'; for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.15, fy - ry * 0.05, rx * 0.05, ry * 0.05); c.fill(); }
      break;
    case 'curto':
      c.fillStyle = d.claro ? '#f7efe4' : claro; elipse(c, cx, fy, rx * 0.36, ry * 0.25); c.fill();
      c.fillStyle = r.especie === 'coelha' || r.especie === 'gato' ? '#e98a9d' : '#2b2622';
      c.beginPath(); c.moveTo(cx - rx * 0.1, fy - ry * 0.08); c.lineTo(cx + rx * 0.1, fy - ry * 0.08); c.lineTo(cx, fy + ry * 0.04); c.fill();
      c.beginPath(); c.moveTo(cx, fy + ry * 0.04); c.quadraticCurveTo(cx - rx * 0.1, fy + ry * 0.18, cx - rx * 0.18, fy + ry * 0.1); c.moveTo(cx, fy + ry * 0.04); c.quadraticCurveTo(cx + rx * 0.1, fy + ry * 0.18, cx + rx * 0.18, fy + ry * 0.1); c.stroke();
      break;
    case 'nenhum':
      c.beginPath(); c.moveTo(cx - rx * 0.2, fy); c.quadraticCurveTo(cx, fy + ry * 0.16, cx + rx * 0.2, fy); c.stroke();
      break;
  }
  if (r.marca === 'barbelaVermelha') { c.fillStyle = '#d64a3f'; elipse(c, cx + rx * 0.1, fy + ry * 0.5, rx * 0.12, ry * 0.25); c.fill(); }

  // ---- os olhos (o brilho e as bochechas)
  const oy = cy - ry * 0.05;
  for (const lado of [-1, 1]) {
    c.fillStyle = '#231c1c'; elipse(c, cx + lado * rx * 0.36, oy, rx * 0.085, ry * 0.11); c.fill();
    c.fillStyle = '#ffffff'; elipse(c, cx + lado * rx * 0.36 + rx * 0.03, oy - ry * 0.04, rx * 0.03, ry * 0.035); c.fill();
    c.fillStyle = 'rgba(240,120,130,0.35)'; elipse(c, cx + lado * rx * 0.55, cy + ry * 0.22, rx * 0.13, ry * 0.08); c.fill();
  }

  // ---- a marca que distingue
  const marca = r.marca;
  c.fillStyle = '#3d2c26';
  // AS MARCAS QUE DENUNCIAM (a Alpacona, o Beto): grandes o bastante para se ver na foto do tamanho do celular
  if (marca === 'pintaNoFocinho') { c.fillStyle = '#6b4a3a'; elipse(c, cx + rx * 0.3, fy - ry * 0.02, rx * 0.12, rx * 0.1, 0.3); c.fill(); }
  if (marca === 'pintasNoFocinho') for (const [dx, dy] of [[-0.3, 0.12], [-0.18, 0.2], [0.26, 0.15]]) { elipse(c, cx + dx * rx, fy + dy * ry, rx * 0.035, rx * 0.035); c.fill(); }
  // (a orelha ESQUERDA do bicho fica à direita de quem olha a foto)
  if (marca === 'pintaNaOrelhaEsquerda') { c.fillStyle = '#7a3f4a'; elipse(c, cx + rx * 1.0, cy - ry * 0.4, rx * 0.12, ry * 0.15, -0.35); c.fill(); }
  if (marca === 'manchaNoPeito') { c.fillStyle = '#f2ead8'; elipse(c, cx, y + a * 0.92, s * 0.1, s * 0.07); c.fill(); }
  if (marca === 'bigodeBranco') { c.strokeStyle = '#ffffff'; for (const lado of [-1, 1]) for (const k of [-1, 1]) { c.beginPath(); c.moveTo(cx + lado * rx * 0.2, fy + k * ry * 0.04); c.lineTo(cx + lado * rx * 0.75, fy + k * ry * 0.12); c.stroke(); } c.strokeStyle = 'rgba(40,30,30,0.55)'; }
  if (marca === 'brincoNaOrelha') { c.fillStyle = '#e8c24a'; elipse(c, cx - rx * 1.05, cy - ry * 0.25, rx * 0.06, rx * 0.06); c.fill(); }
  if (marca === 'narizGrande') { c.fillStyle = '#2b2622'; elipse(c, cx, fy - ry * 0.04, rx * 0.22, ry * 0.17); c.fill(); }
  if (marca === 'orelhaRasgadinha') { c.fillStyle = '#a9cfe0'; c.beginPath(); c.moveTo(cx - rx * 1.2, cy - ry * 0.95); c.lineTo(cx - rx * 1.0, cy - ry * 0.72); c.lineTo(cx - rx * 1.25, cy - ry * 0.65); c.fill(); }
  if (marca === 'manchaNaTesta') { c.fillStyle = '#f7efe4'; elipse(c, cx, cy - ry * 0.6, rx * 0.2, ry * 0.12); c.fill(); }
  if (marca === 'cicatrizNoNariz' || marca === 'cicatrizNaSobrancelha') {
    c.strokeStyle = '#7a3a2e'; c.lineWidth = s * 0.012;
    const yy = marca === 'cicatrizNoNariz' ? fy - ry * 0.1 : oy - ry * 0.25;
    c.beginPath(); c.moveTo(cx + rx * 0.25, yy - ry * 0.12); c.lineTo(cx + rx * 0.45, yy + ry * 0.08); c.stroke();
    c.lineWidth = Math.max(1, s * 0.012); c.strokeStyle = 'rgba(40,30,30,0.55)';
  }
  if (marca === 'caudaListrada') { c.fillStyle = 'rgba(120,40,20,0.5)'; for (const k of [0, 1, 2]) { c.fillRect(cx + rx * 0.7, cy + ry * (0.1 + k * 0.18), rx * 0.25, ry * 0.07); } }
  if (marca === 'remendoNaOrelha') { c.fillStyle = '#f2c14a'; c.fillRect(cx - rx * 0.95, cy - ry * 0.95, rx * 0.22, rx * 0.22); }
  if (marca === 'bandanaAzul') { c.fillStyle = '#3f6fc6'; c.fillRect(cx - rx * 0.95, cy - ry * 0.62, rx * 1.9, ry * 0.18); }
  if (marca === 'apitoNoPeito') { c.strokeStyle = '#d64a3f'; c.beginPath(); c.moveTo(cx - s * 0.12, y + a * 0.82); c.lineTo(cx, y + a * 0.92); c.lineTo(cx + s * 0.12, y + a * 0.82); c.stroke(); c.fillStyle = '#c9c9c9'; elipse(c, cx, y + a * 0.93, s * 0.03, s * 0.02); c.fill(); c.strokeStyle = 'rgba(40,30,30,0.55)'; }
  if (marca && marca.startsWith('laco')) {
    c.fillStyle = marca === 'lacoAzul' ? '#5b8fe0' : marca === 'lacoAmarelo' ? '#f2c14a' : '#f08aa8';
    for (const lado of [-1, 1]) { c.beginPath(); c.moveTo(cx + rx * 0.5, cy - ry * 0.85); c.lineTo(cx + rx * 0.5 + lado * rx * 0.3, cy - ry * 1.05); c.lineTo(cx + rx * 0.5 + lado * rx * 0.3, cy - ry * 0.65); c.fill(); }
  }
  if (marca === 'oculosGatinho' || marca === 'oculosDeCostura') {
    c.strokeStyle = marca === 'oculosGatinho' ? '#d6458a' : '#7a5a3a'; c.lineWidth = s * 0.014;
    for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.36, oy, rx * 0.2, ry * 0.15); c.stroke(); }
    c.lineWidth = Math.max(1, s * 0.012); c.strokeStyle = 'rgba(40,30,30,0.55)';
  }
  if (marca === 'quepeDaBilheteria' || marca === 'quepeDeMotorista') {
    c.fillStyle = marca === 'quepeDeMotorista' ? '#2a2f45' : '#c94040';
    c.fillRect(cx - rx * 0.6, cy - ry * 1.15, rx * 1.2, ry * 0.32); c.fillStyle = '#1f1f24'; c.fillRect(cx - rx * 0.7, cy - ry * 0.86, rx * 1.4, ry * 0.08);
  }
  if (marca === 'trancaComMolinhas') { c.fillStyle = tom(pelo, 0.8); elipse(c, cx + rx * 0.95, cy + ry * 0.35, rx * 0.15, ry * 0.45); c.fill(); }

  // ---- o cabelo (o penteado da Alpacina: NÃO conta para a foto)
  if (r.cabelo) {
    c.fillStyle = tom(pelo, 0.92);
    const ch = r.cabelo;
    if (ch === 'franja') { elipse(c, cx, cy - ry * 0.75, rx * 0.9, ry * 0.35); c.fill(); }
    if (ch === 'coque' || ch === 'cocoAlto') { elipse(c, cx, cy - ry * 1.15, rx * 0.4, ry * 0.32); c.fill(); c.stroke(); elipse(c, cx, cy - ry * 0.78, rx * 0.8, ry * 0.25); c.fill(); }
    if (ch === 'trancas' || ch === 'tranca') { for (const lado of [-1, 1]) { for (let k = 0; k < 4; k++) { elipse(c, cx + lado * rx * 0.95, cy + ry * (-0.2 + k * 0.28), rx * 0.14, ry * 0.15); c.fill(); c.stroke(); } } elipse(c, cx, cy - ry * 0.8, rx * 0.85, ry * 0.28); c.fill(); }
    if (ch === 'blackPower') { elipse(c, cx, cy - ry * 0.55, rx * 1.35, ry * 0.85); c.fill(); c.stroke(); }
    if (ch === 'moicano') { c.beginPath(); c.moveTo(cx - rx * 0.15, cy - ry * 0.8); c.lineTo(cx, cy - ry * 1.6); c.lineTo(cx + rx * 0.15, cy - ry * 0.8); c.fill(); c.stroke(); }
    if (ch === 'trofeu') { c.fillStyle = '#e8c24a'; c.beginPath(); c.moveTo(cx - rx * 0.4, cy - ry * 1.4); c.lineTo(cx + rx * 0.4, cy - ry * 1.4); c.lineTo(cx + rx * 0.15, cy - ry * 0.9); c.lineTo(cx - rx * 0.15, cy - ry * 0.9); c.fill(); c.stroke(); elipse(c, cx, cy - ry * 0.82, rx * 0.8, ry * 0.2); c.fillStyle = tom(pelo, 0.92); c.fill(); }
  }

  // ---- o enfeite (e os disfarces do Jean-Luc)
  const e = r.enfeite;
  const chapeu = (cor: string, aba = true): void => {
    c.fillStyle = cor; c.beginPath(); c.ellipse(cx, cy - ry * 0.85, rx * 0.65, ry * 0.42, 0, Math.PI, 0); c.fill(); c.stroke();
    if (aba) { c.fillStyle = tom(0x333333, 1.2); elipse(c, cx + rx * 0.35, cy - ry * 0.82, rx * 0.55, ry * 0.08); c.fill(); }
  };
  if (e === 'gravatinha') { c.fillStyle = '#c23b48'; c.beginPath(); c.moveTo(cx, y + a * 0.86); c.lineTo(cx - s * 0.08, y + a * 0.82); c.lineTo(cx - s * 0.08, y + a * 0.9); c.closePath(); c.moveTo(cx, y + a * 0.86); c.lineTo(cx + s * 0.08, y + a * 0.82); c.lineTo(cx + s * 0.08, y + a * 0.9); c.closePath(); c.fill(); }
  if (e === 'bone') chapeu('#e05a3a');
  if (e === 'boneDoPapita') chapeu('#f2c14a');
  if (e === 'boneDeEntregador') { chapeu('#3b6fd0'); c.fillStyle = '#ffffff'; c.font = `bold ${s * 0.06}px ${LETRA}`; c.textAlign = 'center'; c.fillText('CE', cx, cy - ry * 0.95); }
  const boina = e === 'boinaEOculosEscuros' || (r.especie === 'pato' && (!e || e === 'cascoDePapelao' || e === 'bigodeFalso'));
  if (boina) {
    c.fillStyle = '#2b3a6a'; elipse(c, cx - rx * 0.1, cy - ry * 0.85, rx * 0.7, ry * 0.24, -0.15); c.fill(); c.stroke();
  }
  if (boina && e !== 'bigodeFalso') {
    c.fillStyle = '#1d1d22'; for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.36, oy, rx * 0.22, ry * 0.15); c.fill(); } c.fillRect(cx - rx * 0.16, oy - ry * 0.04, rx * 0.32, ry * 0.05);
  }
  if (e === 'oculosDeLeitura') { c.strokeStyle = '#7a5a3a'; for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.36, oy + ry * 0.05, rx * 0.18, ry * 0.13); c.stroke(); } c.strokeStyle = 'rgba(40,30,30,0.55)'; }
  if (e === 'barbicha') { c.fillStyle = '#efe8da'; c.beginPath(); c.moveTo(cx - rx * 0.12, fy + ry * 0.4); c.lineTo(cx, fy + ry * 0.95); c.lineTo(cx + rx * 0.12, fy + ry * 0.4); c.fill(); }
  if (e === 'oculosComNariz') {
    c.fillStyle = '#1d1d22'; for (const lado of [-1, 1]) { elipse(c, cx + lado * rx * 0.36, oy, rx * 0.2, ry * 0.14); c.fill(); }
    c.fillStyle = '#f0b9a0'; elipse(c, cx, oy + ry * 0.22, rx * 0.14, ry * 0.2); c.fill(); c.stroke();
    c.fillStyle = '#2b2622'; c.beginPath(); c.moveTo(cx - rx * 0.32, fy - ry * 0.12); c.quadraticCurveTo(cx, fy - ry * 0.02, cx + rx * 0.32, fy - ry * 0.12); c.lineTo(cx, fy - ry * 0.06); c.fill();
  }
  if (e === 'perucaDeFranja') { c.fillStyle = tom(P.peloCreme, 0.95); elipse(c, cx, cy - ry * 0.55, rx * 1.25, ry * 0.65); c.fill(); c.stroke(); elipse(c, cx, cy - ry * 0.45, rx * 0.95, ry * 0.26); c.fill(); }
  if (e === 'toucaEBoia') {
    c.fillStyle = '#e5404f'; c.beginPath(); c.ellipse(cx, cy - ry * 0.45, rx * 1.02, ry * 0.65, 0, Math.PI, 0); c.fill(); c.stroke();
    c.fillStyle = '#f2c14a'; elipse(c, cx, y + a * 0.95, s * 0.42, s * 0.12); c.fill(); c.stroke();
  }
  if (e === 'bigodeFalso') {
    c.fillStyle = '#2b2622'; c.beginPath(); c.moveTo(cx - rx * 0.55, fy + ry * 0.05); c.quadraticCurveTo(cx - rx * 0.25, fy - ry * 0.25, cx, fy - ry * 0.02); c.quadraticCurveTo(cx + rx * 0.25, fy - ry * 0.25, cx + rx * 0.55, fy + ry * 0.05); c.quadraticCurveTo(cx + rx * 0.25, fy + ry * 0.12, cx, fy + ry * 0.06); c.quadraticCurveTo(cx - rx * 0.25, fy + ry * 0.12, cx - rx * 0.55, fy + ry * 0.05); c.fill();
  }
  if (e === 'cascoDePapelao') { /* o casco já foi pintado nos ombros */ }

  // ---- tapado: o capacete do Capy na janela
  if (opts.tapado) {
    c.fillStyle = '#d6453c'; elipse(c, cx, cy - ry * 0.1, rx * 1.12, ry * 1.08); c.fill(); c.stroke();
    c.fillStyle = 'rgba(40,40,60,0.85)'; c.beginPath(); c.roundRect(cx - rx * 0.8, cy - ry * 0.35, rx * 1.6, ry * 0.6, rx * 0.25); c.fill();
    c.fillStyle = '#f2efe8'; c.fillRect(cx - rx * 1.05, cy - ry * 0.85, rx * 2.1, ry * 0.1);
  }
  c.restore();
}

// ================================================================ os papéis

/** o tamanho do canvas de cada papel (o lado maior tem 640 px) */
export function tamanhoDoPapel(tipo: Documento['tipo']): { l: number; a: number } {
  const p = PAPEIS[tipo].proporcao;
  return p >= 1 ? { l: 640, a: Math.round(640 / p) } : { l: Math.round(640 * p), a: 640 };
}

const campo = (tipo: Documento['tipo'], pista: string, l: number, a: number): { x: number; y: number; l: number; a: number } => {
  const c = PAPEIS[tipo].campos.find((x) => x.pista === pista);
  if (!c) return { x: 0, y: 0, l: 0, a: 0 };
  return { x: c.x * l, y: c.y * a, l: c.l * l, a: c.a * a };
};

/** um rótulo pequeno em cima e o valor grande embaixo, dentro do retângulo do campo */
function escreverCampo(c: CanvasRenderingContext2D, r: { x: number; y: number; l: number; a: number }, rotulo: string, valor: string, cor: string = css(P.tintaDaPortaria), fonte = LETRA): void {
  c.fillStyle = 'rgba(70,80,90,0.75)';
  c.font = `700 ${Math.round(r.a * 0.26)}px ${LETRA}`;
  c.textAlign = 'left';
  c.textBaseline = 'top';
  c.fillText(rotulo.toUpperCase(), r.x + 4, r.y + 2);
  c.fillStyle = cor;
  let tam = Math.round(r.a * 0.56);
  c.font = `700 ${tam}px ${fonte}`;
  while (c.measureText(valor).width > r.l - 8 && tam > 10) { tam -= 1; c.font = `700 ${tam}px ${fonte}`; }
  c.fillText(valor, r.x + 4, r.y + r.a * 0.36);
  c.strokeStyle = 'rgba(70,80,90,0.25)';
  c.lineWidth = 1;
  c.beginPath(); c.moveTo(r.x + 2, r.y + r.a - 1); c.lineTo(r.x + r.l - 2, r.y + r.a - 1); c.stroke();
}

/** o papel com o grão, a sombra da borda e as quinas arredondadas */
function folha(c: CanvasRenderingContext2D, l: number, a: number, cor = css(P.papelDaPortaria), raio = 18): void {
  c.clearRect(0, 0, l, a);
  c.fillStyle = cor;
  c.beginPath(); c.roundRect(2, 2, l - 4, a - 4, raio); c.fill();
  c.fillStyle = 'rgba(120,100,70,0.05)';
  for (let i = 0; i < 220; i++) c.fillRect((i * 97) % l, (i * 53) % a, 2, 2);
  c.strokeStyle = 'rgba(80,70,50,0.25)';
  c.lineWidth = 3;
  c.beginPath(); c.roundRect(2, 2, l - 4, a - 4, raio); c.stroke();
}

/** o escudo do clube em miniatura: o círculo verde e dourado com a girafinha */
function escudo(c: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  c.fillStyle = css(P.gold); elipse(c, x, y, r, r); c.fill();
  c.fillStyle = css(P.guaritaFaixa); elipse(c, x, y, r * 0.86, r * 0.86); c.fill();
  c.fillStyle = css(P.girafaPelo); elipse(c, x, y + r * 0.05, r * 0.32, r * 0.38); c.fill();
  c.fillStyle = css(P.girafaMancha); elipse(c, x - r * 0.12, y, r * 0.07, r * 0.07); c.fill(); elipse(c, x + r * 0.1, y + r * 0.15, r * 0.06, r * 0.06); c.fill();
  c.fillStyle = '#2b2721'; for (const k of [-1, 1]) { elipse(c, x + k * r * 0.11, y - r * 0.06, r * 0.04, r * 0.04); c.fill(); }
}

/** o nome da empresa e a cor dela (o crachá e a ordem) */
const COR_DA_EMPRESA: Readonly<Record<string, string>> = {
  'Papita Delivery': '#f2b53a', 'Croissant Express': '#3b6fd0', 'Açougue do Bairro': '#c8473f', 'Gelo Polar': '#58b9d8',
  'Floricultura Primavera': '#e98aa8', 'Padaria Pão Quentinho': '#b07c46', 'Lavanderia Bolha': '#9d86d8',
};

/**
 * PINTA UM PAPEL no canvas (do tamanho de `tamanhoDoPapel`). Os campos caem
 * nos retângulos de `PAPEIS`. `carimbo` põe a marca de tinta por cima.
 */
export function pintarPapel(c: CanvasRenderingContext2D, d: Documento, carimbo: Carimbo | null = null): void {
  const { l, a } = tamanhoDoPapel(d.tipo);
  const R = (pista: string): { x: number; y: number; l: number; a: number } => campo(d.tipo, pista, l, a);
  if (d.tipo === 'carteirinha') {
    const doClube = d.clube === NOME_DO_CLUBE;
    folha(c, l, a, doClube ? '#f6f1e2' : '#f4f2fb', 26);
    const e = R('doc:carteirinha:escudo');
    // a faixa do alto: verde do clube (ou a tricolor de Paris)
    if (doClube) {
      c.fillStyle = css(P.guaritaFaixa); c.beginPath(); c.roundRect(e.x, e.y, e.l, e.a, 14); c.fill();
      escudo(c, e.x + e.a * 0.55, e.y + e.a / 2, e.a * 0.4);
      c.fillStyle = '#fbf6e8'; c.font = `800 ${Math.round(e.a * 0.42)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'middle';
      c.fillText('CLUBE · CARTEIRA DE SÓCIO', e.x + e.a * 1.15, e.y + e.a / 2);
    } else {
      const t = e.l / 3;
      ['#2f56b0', css(P.peloBranco), '#d4423c'].forEach((cor, k) => { c.fillStyle = cor; c.fillRect(e.x + k * t, e.y, t, e.a); });
      c.fillStyle = '#1f2a55'; c.font = `800 ${Math.round(e.a * 0.36)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(d.clube.toUpperCase(), e.x + e.l / 2, e.y + e.a / 2);
    }
    const f = R('doc:carteirinha:foto');
    c.fillStyle = '#ffffff'; c.fillRect(f.x - 4, f.y - 4, f.l + 8, f.a + 8);
    pintarRetrato(c, f.x, f.y, f.l, f.a, d.foto);
    escreverCampo(c, R('doc:carteirinha:nome'), 'Nome', d.nome);
    escreverCampo(c, R('doc:carteirinha:numero'), 'Nº de sócio', d.numero);
    escreverCampo(c, R('doc:carteirinha:validade'), 'Válida até', escrever(d.validade));
    // a fita holográfica embaixo
    const gr = c.createLinearGradient(0, a - 22, l, a - 8);
    gr.addColorStop(0, 'rgba(150,200,240,0.5)'); gr.addColorStop(0.5, 'rgba(240,190,230,0.5)'); gr.addColorStop(1, 'rgba(190,240,200,0.5)');
    c.fillStyle = gr; c.fillRect(20, a - 22, l - 40, 10);
  } else if (d.tipo === 'convite') {
    folha(c, l, a, '#fff5f3', 22);
    // a borda de florzinhas
    c.fillStyle = '#f08aa8';
    for (let k = 0; k < 26; k++) { const t = k / 26; const px = 20 + t * (l - 40); elipse(c, px, 18, 5, 5); c.fill(); elipse(c, px, a - 18, 5, 5); c.fill(); }
    c.fillStyle = '#b8476a'; c.font = `700 ${Math.round(a * 0.11)}px ${MAO}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('Convite', l / 2, a * 0.17);
    escreverCampo(c, R('doc:convite:convidado'), 'Convidado(a)', d.convidado, '#3a2b55', MAO);
    escreverCampo(c, R('doc:convite:socio'), 'Sócio que convida', d.socio, '#3a2b55', MAO);
    escreverCampo(c, R('doc:convite:numeroDoSocio'), 'Nº', d.numeroDoSocio, '#3a2b55', MAO);
    escreverCampo(c, R('doc:convite:data'), 'Válido para o dia', escrever(d.data), '#3a2b55', MAO);
  } else if (d.tipo === 'conviteColetivo') {
    folha(c, l, a, '#f3f6ff', 22);
    c.fillStyle = '#3f6fc6'; c.fillRect(0, 0, l, a * 0.12);
    c.fillStyle = '#f2c14a'; c.font = `800 ${Math.round(a * 0.05)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('DIA DA ESCOLA NO CLUBE', l / 2, a * 0.06);
    escreverCampo(c, R('doc:conviteColetivo:socio'), 'Sócio que convida', d.socio, '#243f78', MAO);
    escreverCampo(c, R('doc:conviteColetivo:numeroDoSocio'), 'Nº', d.numeroDoSocio, '#243f78', MAO);
    const n = R('doc:conviteColetivo:nomes');
    c.fillStyle = 'rgba(70,80,90,0.75)'; c.font = `700 ${Math.round(n.a * 0.06)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('A TURMA', n.x + 4, n.y);
    c.fillStyle = '#243f78'; c.font = `700 ${Math.round(n.a * 0.095)}px ${MAO}`;
    d.nomes.forEach((nome, k) => c.fillText(`· ${nome}`, n.x + 10, n.y + n.a * (0.1 + k * 0.125)));
    escreverCampo(c, R('doc:conviteColetivo:data'), 'Válido para o dia', escrever(d.data), '#243f78', MAO);
  } else if (d.tipo === 'cracha') {
    const cor = COR_DA_EMPRESA[d.empresa] ?? '#7a8a9a';
    folha(c, l, a, '#fbfbf8', 20);
    c.fillStyle = cor; c.fillRect(0, 0, l, a * 0.26);
    c.fillStyle = '#d9d9d9'; c.beginPath(); c.roundRect(l / 2 - 40, 14, 80, 16, 8); c.fill();
    const e = R('doc:cracha:empresa');
    c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    let tam = Math.round(e.a * 0.5); c.font = `800 ${tam}px ${LETRA}`;
    while (c.measureText(d.empresa.toUpperCase()).width > e.l - 10 && tam > 10) { tam -= 1; c.font = `800 ${tam}px ${LETRA}`; }
    c.fillText(d.empresa.toUpperCase(), e.x + e.l / 2, e.y + e.a / 2);
    const f = R('doc:cracha:foto');
    c.fillStyle = cor; c.fillRect(f.x - 5, f.y - 5, f.l + 10, f.a + 10);
    pintarRetrato(c, f.x, f.y, f.l, f.a, d.foto);
    const nm = R('doc:cracha:nome');
    c.fillStyle = css(P.tintaDaPortaria); c.font = `800 ${Math.round(nm.a * 0.55)}px ${LETRA}`; c.textAlign = 'center';
    c.fillText(d.nome, nm.x + nm.l / 2, nm.y + nm.a * 0.45);
    c.fillStyle = 'rgba(70,80,90,0.8)'; c.font = `700 ${Math.round(nm.a * 0.32)}px ${LETRA}`;
    c.fillText(d.funcao.toUpperCase(), nm.x + nm.l / 2, nm.y + nm.a * 1.05);
  } else if (d.tipo === 'ordem') {
    const cor = COR_DA_EMPRESA[d.empresa] ?? '#7a8a9a';
    folha(c, l, a, '#fdfbf3', 10);
    const e = R('doc:ordem:empresa');
    c.fillStyle = cor; c.fillRect(e.x, e.y, e.l, e.a);
    c.fillStyle = '#ffffff'; c.font = `800 ${Math.round(e.a * 0.36)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(`ORDEM DE ENTREGA · ${d.empresa.toUpperCase()}`, e.x + e.l / 2, e.y + e.a / 2, e.l - 12);
    escreverCampo(c, R('doc:ordem:destino'), 'Destino no clube', d.destino);
    const it = R('doc:ordem:itens');
    c.fillStyle = 'rgba(70,80,90,0.75)'; c.font = `700 ${Math.round(it.a * 0.09)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('ITENS', it.x + 4, it.y);
    c.fillStyle = css(P.tintaDaPortaria); c.font = `600 ${Math.round(it.a * 0.13)}px ${MAO}`;
    d.itens.forEach((x, k) => c.fillText(`☐ ${x}`, it.x + 10, it.y + it.a * (0.18 + k * 0.2)));
    c.strokeStyle = 'rgba(70,80,90,0.3)'; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(it.x, it.y + it.a * (0.36 + k * 0.2)); c.lineTo(it.x + it.l, it.y + it.a * (0.36 + k * 0.2)); c.stroke(); }
  } else if (d.tipo === 'exame') {
    folha(c, l, a, '#f1fbfb', 10);
    c.fillStyle = '#4ea9c9'; c.fillRect(0, 0, l, a * 0.22);
    c.fillStyle = '#ffffff'; c.font = `800 ${Math.round(a * 0.055)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('EXAME DA PISCINA', l / 2, a * 0.08);
    c.font = `700 ${Math.round(a * 0.035)}px ${LETRA}`; c.fillText('Dermatológico · Clube', l / 2, a * 0.15);
    // a onda
    c.strokeStyle = '#4ea9c9'; c.lineWidth = 4; c.beginPath();
    for (let x = 0; x <= l; x += 8) c.lineTo(x, a * 0.27 + Math.sin(x / 18) * 4); c.stroke(); c.lineWidth = 1;
    escreverCampo(c, R('doc:exame:nome'), 'Nome', d.nome);
    escreverCampo(c, R('doc:exame:validade'), 'Apto(a) até', escrever(d.validade));
    c.fillStyle = css(P.carimboEntra); c.font = `800 ${Math.round(a * 0.06)}px ${MAO}`; c.textAlign = 'center';
    c.fillText('APTO ✓', l * 0.72, a * 0.85);
  }
  if (carimbo) pintarCarimbo(c, l, a, carimbo);
}

/** a marca de tinta do carimbo, torta, com a borda falhada */
export function pintarCarimbo(c: CanvasRenderingContext2D, l: number, a: number, carimbo: Carimbo): void {
  const cor = carimbo === 'entra' ? P.carimboEntra : carimbo === 'hojeNao' ? P.carimboHojeNao : P.carimboSoClube;
  const texto = carimbo === 'entra' ? 'ENTRA' : carimbo === 'hojeNao' ? 'HOJE NÃO' : 'SÓ O CLUBE';
  c.save();
  c.translate(l * 0.6, a * 0.58);
  c.rotate(-0.18);
  c.globalAlpha = 0.82;
  c.strokeStyle = css(cor);
  c.fillStyle = css(cor);
  const w = Math.min(l, a) * 0.8;
  const h = w * 0.3;
  c.lineWidth = h * 0.09;
  c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h * 0.18); c.stroke();
  c.font = `900 ${Math.round(h * 0.5)}px ${LETRA}`;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(texto, 0, h * 0.04, w * 0.9);
  // a tinta falhada: furinhos da cor do papel
  c.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 40; i++) { elipse(c, ((i * 37) % w) - w / 2, ((i * 17) % h) - h / 2, 2 + (i % 3), 2); c.fill(); }
  c.restore();
}

// ================================================================ a prancheta, o calendário, o manual

/** a lista de sócios da prancheta (os riscados com o motivo em vermelho) */
export function pintarLista(c: CanvasRenderingContext2D, l: number, a: number, lista: readonly LinhaDaLista[]): void {
  folha(c, l, a, '#fbf8ee', 8);
  c.fillStyle = css(P.guaritaFaixa); c.font = `800 ${Math.round(a * 0.036)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('LISTA DE SÓCIOS', l / 2, a * 0.045);
  c.fillStyle = 'rgba(70,80,90,0.6)'; c.font = `700 ${Math.round(a * 0.018)}px ${LETRA}`;
  c.fillText('riscado em vermelho: suspenso', l / 2, a * 0.08);
  const passo = (a * 0.88) / Math.max(12, lista.length);
  // a margem vermelha do caderno
  c.strokeStyle = 'rgba(216,66,58,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(l * 0.22, a * 0.1); c.lineTo(l * 0.22, a * 0.98); c.stroke(); c.lineWidth = 1;
  lista.forEach((s, k) => {
    const y = a * 0.1 + k * passo;
    c.strokeStyle = 'rgba(120,160,190,0.45)'; c.beginPath(); c.moveTo(l * 0.04, y + passo); c.lineTo(l * 0.96, y + passo); c.stroke();
    const yNome = s.suspenso ? y + passo * 0.36 : y + passo * 0.55;
    c.fillStyle = css(P.tintaDaPortaria); c.font = `800 ${Math.round(passo * 0.36)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'middle';
    c.fillText(s.numero, l * 0.05, yNome);
    c.font = `700 ${Math.round(passo * 0.46)}px ${MAO}`;
    c.fillText(s.nome, l * 0.25, yNome);
    if (s.suspenso) {
      const fim = l * 0.25 + c.measureText(s.nome).width + 8;
      c.strokeStyle = css(P.carimboHojeNao); c.lineWidth = 3; c.beginPath(); c.moveTo(l * 0.04, yNome + 1); c.lineTo(fim, yNome - 2); c.stroke(); c.lineWidth = 1;
      c.fillStyle = css(P.carimboHojeNao); c.font = `600 ${Math.round(passo * 0.3)}px ${MAO}`;
      c.fillText(`suspenso: ${s.suspenso}`, l * 0.25, y + passo * 0.78, l * 0.72);
    }
  });
}

/** o calendário de mesa: o dia da semana, o número grande e o mês */
const DIAS_DA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
/** o dia da semana de uma data ("segunda") */
export const diaDaSemana = (d: Data): string => DIAS_DA_SEMANA[new Date(d.a, d.m - 1, d.d).getDay()];

export function pintarCalendario(c: CanvasRenderingContext2D, l: number, a: number, hoje: Data): void {
  folha(c, l, a, '#fbfaf5', 14);
  c.fillStyle = css(P.carimboHojeNao); c.beginPath(); c.roundRect(2, 2, l - 4, a * 0.28, [14, 14, 0, 0]); c.fill();
  c.fillStyle = '#ffffff'; c.font = `800 ${Math.round(a * 0.15)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(diaDaSemana(hoje).toUpperCase(), l / 2, a * 0.15, l * 0.9);
  c.fillStyle = css(P.tintaDaPortaria); c.font = `900 ${Math.round(a * 0.42)}px ${LETRA}`;
  c.fillText(String(hoje.d), l / 2, a * 0.58);
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  c.font = `700 ${Math.round(a * 0.12)}px ${LETRA}`; c.fillStyle = '#7a8088';
  c.fillText(`${MES[hoje.m - 1]} · ${hoje.a}`, l / 2, a * 0.86);
}

/** a capa do manual de argola: o verde do clube, o escudo e o título */
export function pintarManual(c: CanvasRenderingContext2D, l: number, a: number): void {
  c.clearRect(0, 0, l, a);
  c.fillStyle = css(P.guaritaFaixa);
  c.fillRect(0, 0, l, a);
  // a lombada mais escura e as costuras
  c.fillStyle = 'rgba(0,0,0,0.18)';
  c.fillRect(l - l * 0.12, 0, l * 0.12, a);
  c.strokeStyle = 'rgba(255,240,200,0.5)';
  c.setLineDash([6, 5]);
  c.lineWidth = 2;
  c.strokeRect(l * 0.06, a * 0.05, l * 0.78, a * 0.9);
  c.setLineDash([]);
  escudo(c, l * 0.45, a * 0.36, l * 0.2);
  c.fillStyle = css(P.gold);
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `900 ${Math.round(l * 0.1)}px ${LETRA}`;
  c.fillText('MANUAL', l * 0.45, a * 0.66);
  c.font = `800 ${Math.round(l * 0.065)}px ${LETRA}`;
  c.fillText('DA PORTARIA', l * 0.45, a * 0.75);
}

/** o nome de um item da sacola (para a mesa) */
export const nomeDoItem = (i: keyof typeof NOME_DO_ITEM): string => NOME_DO_ITEM[i];

// ================================================================ as texturas

/** uma textura de canvas do tamanho dado, desenhada por `pintar` (refazer: `redesenhar`) */
export class PapelPintado {
  readonly canvas: HTMLCanvasElement;
  readonly textura: THREE.CanvasTexture;
  constructor(readonly l: number, readonly a: number, private pintar: (c: CanvasRenderingContext2D) => void) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = l;
    this.canvas.height = a;
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.textura.anisotropy = 8;
    this.redesenhar();
    if (typeof document !== 'undefined' && document.fonts) {
      void document.fonts.load(`700 40px ${MAO}`).then(() => this.redesenhar(), () => {});
    }
  }

  redesenhar(pintar?: (c: CanvasRenderingContext2D) => void): void {
    if (pintar) this.pintar = pintar;
    const c = this.canvas.getContext('2d');
    if (!c) return;
    this.pintar(c);
    this.textura.needsUpdate = true;
  }

  dispose(): void {
    this.textura.dispose();
  }
}

/** o papel de um documento (com o carimbo, se já carimbado) */
export function papelDoDocumento(d: Documento, carimbo: Carimbo | null = null): PapelPintado {
  const { l, a } = tamanhoDoPapel(d.tipo);
  return new PapelPintado(l, a, (c) => pintarPapel(c, d, carimbo));
}
