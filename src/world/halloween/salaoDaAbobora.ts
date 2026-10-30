import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { PALETTE as P } from '../../palette';
import { brilhoEmLote, pinturaAcesa, toon } from '../../core/materials';
import { novaTextura, sorteio } from '../texturasDeChao';
import { pocaDeLuz } from '../furniture';
import { fundir } from '../fundir';
import { caldeirao } from './pecas';
import { LoteDeAboboras } from './abobora';

/*
 * O SALÃO DA ABÓBORA — as peças da parte 6c (`docs/HALLOWEEN.md`, §7.1, E):
 * o salão é POR DENTRO da abóbora gigante da clareira.
 *
 * - A CASCA (`cascaDoSalao`): os doze gomos vistos de dentro — o laranja vivo,
 *   a quina de cada gomo entrando como uma nervura, a polpa mais clara em
 *   baixo com os fiapos e as sementes —, o teto subindo até o cabinho, e as
 *   janelas que são os OLHOS e a BOCA recortados, com a beira da polpa
 *   cortada e o céu da noite do lado de fora. É UMA superfície de face única
 *   virada para dentro: a câmera vê só a metade de trás (a de lá da sala), e
 *   a metade da frente some sozinha, de qualquer giro do Q/R — o recorte de
 *   casa de bonecas sai da própria forma, sem parede baixa nem corte. É uma
 *   conta de elipsoide: a borda do que se vê é exatamente o plano diametral
 *   conjugado da direção da câmera, então nada da casca tapa o salão. De
 *   perto (a câmera de cena, dentro da abóbora), a casca inteira aparece, e
 *   o teto fecha no cabinho.
 * - O LUSTRE DE VELAS (`LustreDeVelas`), pendurado do cabinho: o aro de ferro,
 *   as velas com o pingo de cera, e as chamas que acendem na surpresa.
 * - A PISTA DE DANÇA (`pistaDeDanca`): o tapete redondo xadrez de abóbora.
 * - A MESA DE DOCES (`mesaDeDoces`): a toalha roxa com a barra de babado, o
 *   bolo de abóbora, os cupcakes de monstrinho na boleira, os pirulitos de
 *   espiral e as maçãs do amor — e o CALDEIRÃO DE BALAS do lado, transbordando.
 * - O DOCE NA MÃO (`doceDaFesta`): o que o Walter serve, para comer ali.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** as medidas da abóbora por dentro (um elipsoide achatado, com o chão cortando embaixo) */
export const SALAO_DA_ABOBORA = {
  /** meio da largura (no meio da altura, no meio de um gomo) */
  A: 7.4,
  /** meia altura do ovo */
  B: 4.9,
  /** a altura do meio do ovo (o mais largo) */
  meio: 1.2,
  gomos: 12,
  /** o meio da cara (os olhos e a boca), para o fundo da sala */
  cara: (5 * Math.PI) / 4,
  /** a porta da cozinha, no fundo à direita (em cima e à direita na tela) */
  porta: THREE.MathUtils.degToRad(285),
  /** o plano da porta, a partir do centro */
  raioDaPorta: 7.2,
  /** a grossura da polpa (a beira das janelas) */
  grossura: 0.28,
} as const;
const S = SALAO_DA_ABOBORA;
/** onde fica uma quina de gomo (a cara cai no meio de um) */
const QUINA = S.cara - Math.PI / S.gomos;
/** onde a casca começa (no chão) e onde ela fecha no cabinho */
const ALFA_DO_CHAO = Math.asin((-0.03 - S.meio) / S.B);
const ALFA_DO_TOPO = THREE.MathUtils.degToRad(86);
/** o recorte da porta (a da cozinha) */
const PORTA = { meia: 0.63, reto: 1.75 } as const;

/** o quanto a casca encolhe na quina entre dois gomos (1 no meio do gomo) */
export function gomo(teta: number): number {
  const k = Math.abs(Math.sin((S.gomos * (teta - QUINA)) / 2));
  return 1 - 0.05 * (1 - Math.pow(k, 0.65));
}

/** o "paralelo" do ovo para uma altura */
function alfaDaAltura(h: number): number {
  return Math.asin(THREE.MathUtils.clamp((h - S.meio) / S.B, -1, 1));
}

/** o raio da parede por dentro, num ângulo (`x = cos`, `z = sen`) e numa altura */
export function raioDaParede(teta: number, h: number): number {
  return S.A * gomo(teta) * Math.cos(alfaDaAltura(h));
}

/** o ponto da casca no ângulo `teta`, no paralelo `alfa`, e `fora` para fora da face de dentro */
function naCasca(teta: number, alfa: number, fora = 0, alvo = new THREE.Vector3()): THREE.Vector3 {
  const r = (S.A + fora) * gomo(teta) * Math.cos(alfa);
  return alvo.set(r * Math.cos(teta), S.meio + (S.B + fora) * Math.sin(alfa), r * Math.sin(teta));
}

// ================================================================ as janelas

/** um ponto do recorte, em (ângulo, paralelo) */
type Ponto = readonly [number, number];

/** um contorno fechado, amostrado a cada `passo` (em metros da casca), com um tremidinho de faca */
function amostrar(cantos: readonly Ponto[], passo: number, semente: number, tremido = 0.006): Ponto[] {
  const rnd = sorteio(semente);
  const fora: Ponto[] = [];
  for (let i = 0; i < cantos.length; i++) {
    const a = cantos[i];
    const b = cantos[(i + 1) % cantos.length];
    const metros = Math.hypot((b[0] - a[0]) * S.A, (b[1] - a[1]) * S.B);
    const n = Math.max(1, Math.ceil(metros / passo));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const borda = k === 0 ? 0 : tremido;
      fora.push([a[0] + (b[0] - a[0]) * t + (rnd() - 0.5) * borda, a[1] + (b[1] - a[1]) * t + (rnd() - 0.5) * borda]);
    }
  }
  return fora;
}

/** os dois olhos (triângulos de bico para cima) e a boca (o sorriso com três dentes) */
function recortesDaCara(): Ponto[][] {
  const c = S.cara;
  const olhoBaixo = alfaDaAltura(2.7);
  const olhoAlto = alfaDaAltura(3.75);
  const olho = (lado: -1 | 1): Ponto[] => amostrar([
    [c + lado * 0.185 - 0.1, olhoBaixo],
    [c + lado * 0.185 - lado * 0.03, olhoAlto],
    [c + lado * 0.185 + 0.1, olhoBaixo],
  ], 0.16, lado > 0 ? 71 : 72);
  // a boca: o lábio de cima sobe nos cantos, o de baixo desce no meio; os
  // dentes descem de cima (dois) e sobe um de baixo
  const L = 0.285;
  const cima = (d: number): number => 0.06 + 0.07 * (d / L) ** 2;
  const baixo = (d: number): number => -0.05 + 0.12 * (d / L) ** 2;
  const cantos: Ponto[] = [[c - L - 0.03, 0.12]];
  const dentesDeCima: Array<[number, number]> = [[-0.13, -0.075], [0.075, 0.13]];
  for (let d = -L; d <= L + 1e-6; d += L / 12) {
    const dente = dentesDeCima.find(([a, b]) => d >= a - 1e-6 && d <= b + 1e-6);
    cantos.push([c + d, dente ? 0.012 : cima(d)]);
  }
  cantos.push([c + L + 0.03, 0.12]);
  for (let d = L; d >= -L - 1e-6; d -= L / 12) {
    const dente = Math.abs(d) <= 0.03 ? 1 : 0;
    cantos.push([c + d, dente ? 0.03 : baixo(d)]);
  }
  return [olho(-1), olho(1), amostrar(cantos, 0.14, 73)];
}

/** o contorno da porta (o arco), projetado do plano dela na casca, de baixo-esquerda a baixo-direita */
function recorteDaPorta(): Ponto[] {
  const pts: Ponto[] = [];
  const ponto = (x: number, y: number): Ponto => [S.porta + Math.atan2(x, S.raioDaPorta), alfaDaAltura(y)];
  for (let y = 0; y < PORTA.reto; y += 0.25) pts.push(ponto(-PORTA.meia, y));
  for (let k = 0; k <= 16; k++) {
    const a = Math.PI - (k / 16) * Math.PI;
    pts.push(ponto(Math.cos(a) * PORTA.meia, PORTA.reto + Math.sin(a) * PORTA.meia));
  }
  for (let y = PORTA.reto - 0.25; y > 0.01; y -= 0.25) pts.push(ponto(PORTA.meia, y));
  pts.push(ponto(PORTA.meia, -0.03));
  pts.unshift(ponto(-PORTA.meia, -0.03));
  return pts;
}

// ============================================================== as texturas

/**
 * A POLPA POR DENTRO, um azulejo por GOMO (`u` de uma quina à outra) e a
 * altura inteira da casca (`v` do chão ao cabinho): o laranja vivo no meio,
 * mais fundo para o teto, a polpa clara embaixo com os fiapos e as sementes,
 * a nervura escura na quina e as fibras correndo para o cabinho.
 */
function polpaPorDentro(): THREE.CanvasTexture {
  return novaTextura('salao:polpa', 1, (c, s) => {
    const rnd = sorteio(6060);
    // de cima (o cabinho) para baixo (o chão)
    const alto = c.createLinearGradient(0, 0, 0, s);
    alto.addColorStop(0, css(P.salaoCabinho));
    alto.addColorStop(0.07, css(P.salaoPolpaFunda));
    alto.addColorStop(0.45, css(P.salaoPolpa));
    alto.addColorStop(0.78, css(P.salaoPolpa));
    alto.addColorStop(1, css(P.salaoPolpaClara));
    c.fillStyle = alto;
    c.fillRect(0, 0, s, s);
    // a curva do gomo: escurece perto da quina dos dois lados
    for (const [x0, x1] of [[0, s * 0.22], [s, s * 0.78]] as const) {
      const lado = c.createLinearGradient(x0, 0, x1, 0);
      lado.addColorStop(0, 'rgba(150,62,12,0.42)');
      lado.addColorStop(1, 'rgba(150,62,12,0)');
      c.fillStyle = lado;
      c.fillRect(Math.min(x0, x1), 0, Math.abs(x1 - x0), s);
    }
    // o brilho do meio do gomo
    const meio = c.createLinearGradient(s * 0.3, 0, s * 0.7, 0);
    meio.addColorStop(0, 'rgba(255,214,140,0)');
    meio.addColorStop(0.5, 'rgba(255,214,140,0.22)');
    meio.addColorStop(1, 'rgba(255,214,140,0)');
    c.fillStyle = meio;
    c.fillRect(s * 0.3, s * 0.1, s * 0.4, s * 0.75);
    // as fibras: riscos finos ondulando, do chão para o cabinho
    const fibra = (x: number, cor: string, largura: number): void => {
      c.strokeStyle = cor;
      c.lineWidth = largura;
      c.beginPath();
      const fase = rnd() * 6;
      const amp = 2 + rnd() * 5;
      const de = s * (0.04 + rnd() * 0.25);
      const ate = s * (0.65 + rnd() * 0.3);
      for (let y = de; y <= ate; y += 6) c.lineTo(x + Math.sin(y * 0.03 + fase) * amp, y);
      c.stroke();
    };
    for (let i = 0; i < 26; i++) fibra(rnd() * s, 'rgba(255,224,160,0.14)', 1 + rnd());
    for (let i = 0; i < 20; i++) fibra(rnd() * s, 'rgba(176,82,20,0.12)', 1 + rnd());
    // as veias que saem da quina e entram no gomo
    c.strokeStyle = 'rgba(176,82,20,0.35)';
    c.lineWidth = 1.6;
    for (let i = 0; i < 9; i++) {
      const esquerda = i % 2 === 0;
      let x = esquerda ? 2 : s - 2;
      let y = s * (0.15 + rnd() * 0.6);
      c.beginPath();
      c.moveTo(x, y);
      for (let k = 0; k < 7; k++) {
        x += (esquerda ? 1 : -1) * (6 + rnd() * 9);
        y += 4 + rnd() * 10;
        c.lineTo(x, y);
      }
      c.stroke();
    }
    // a nervura da quina: a linha escura, um tico torta
    c.strokeStyle = css(P.salaoNervura);
    for (const x0 of [1.5, s - 1.5]) {
      c.lineWidth = 3;
      c.beginPath();
      for (let y = 0; y <= s; y += 8) c.lineTo(x0 + Math.sin(y * 0.05) * 1.2, y);
      c.stroke();
    }
    // embaixo: a polpa clara com os fiapos enrolados e as sementes
    c.strokeStyle = 'rgba(255,236,190,0.45)';
    c.lineWidth = 1.5;
    for (let i = 0; i < 16; i++) {
      const x = rnd() * s;
      const y = s * (0.86 + rnd() * 0.12);
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(x + 14 - rnd() * 28, y - 22, x + 30 - rnd() * 60, y + 8, x + 18 - rnd() * 36, y - 26);
      c.stroke();
    }
    for (let i = 0; i < 14; i++) {
      const x = s * (0.08 + rnd() * 0.84);
      const y = s * (0.88 + rnd() * 0.1);
      const giro = rnd() * Math.PI;
      c.save();
      c.translate(x, y);
      c.rotate(giro);
      c.fillStyle = 'rgba(190,120,50,0.4)';
      c.beginPath();
      c.ellipse(1, 1, 5, 3, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = css(P.salaoSemente);
      c.beginPath();
      c.moveTo(-5, 0);
      c.quadraticCurveTo(0, -3.5, 5, 0);
      c.quadraticCurveTo(0, 3.5, -5, 0);
      c.fill();
      c.restore();
    }
    // em cima: as fibras do cabinho, escuras, juntando
    c.strokeStyle = 'rgba(70,52,26,0.5)';
    c.lineWidth = 1.5;
    for (let i = 0; i < 40; i++) {
      const x = rnd() * s;
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x + (rnd() - 0.5) * 10, s * (0.05 + rnd() * 0.08));
      c.stroke();
    }
  }, 512);
}

/**
 * O CÉU DE FORA, visto pelos olhos e pela boca: o degradê da noite, as
 * estrelas, a lua inteira aparecendo no olho de um lado, e, embaixo (o que a
 * boca mostra), a silhueta do mato e das árvores da clareira, com os
 * vaga-lumes e a luz das abóboras do caminho lá longe.
 */
function ceuDeFora(luaEmU: number, luaEmV: number): THREE.CanvasTexture {
  return novaTextura('salao:ceu-de-fora', 1, (c, s) => {
    const rnd = sorteio(7070);
    const ceu = c.createLinearGradient(0, 0, 0, s);
    ceu.addColorStop(0, css(P.salaoCeuAlto));
    ceu.addColorStop(0.75, css(P.salaoCeuBaixo));
    ceu.addColorStop(1, css(P.salaoCeuBaixo));
    c.fillStyle = ceu;
    c.fillRect(0, 0, s, s);
    c.fillStyle = css(P.salaoEstrela);
    for (let i = 0; i < 90; i++) {
      const r = rnd() < 0.15 ? 2.2 : 1.1;
      c.globalAlpha = 0.5 + rnd() * 0.5;
      c.beginPath();
      c.arc(rnd() * s, rnd() * s * 0.72, r, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
    // a lua, com o halo
    const lx = luaEmU * s;
    const ly = (1 - luaEmV) * s;
    const halo = c.createRadialGradient(lx, ly, 10, lx, ly, 70);
    halo.addColorStop(0, 'rgba(255,242,196,0.55)');
    halo.addColorStop(1, 'rgba(255,242,196,0)');
    c.fillStyle = halo;
    c.fillRect(lx - 70, ly - 70, 140, 140);
    c.fillStyle = css(P.salaoLua);
    c.beginPath();
    c.arc(lx, ly, 26, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(214,200,150,0.6)';
    for (const [dx, dy, r] of [[-8, -6, 6], [9, 7, 4], [4, -11, 3]] as const) {
      c.beginPath();
      c.arc(lx + dx, ly + dy, r, 0, Math.PI * 2);
      c.fill();
    }
    // o mato e as copas lá fora (o que a boca vê)
    c.fillStyle = css(P.salaoMatoLonge);
    c.beginPath();
    c.moveTo(0, s);
    for (let x = 0; x <= s; x += 8) {
      const copa = Math.sin(x * 0.045) * 14 + Math.sin(x * 0.11 + 1) * 8 + (x % 64 < 32 ? 10 : 0);
      c.lineTo(x, s * 0.8 - copa);
    }
    c.lineTo(s, s);
    c.fill();
    // as abóboras do caminho, acesas lá longe, e os vaga-lumes
    for (let i = 0; i < 7; i++) {
      const x = s * (0.08 + i * 0.13 + rnd() * 0.04);
      const y = s * (0.9 + rnd() * 0.06);
      const brilho = c.createRadialGradient(x, y, 1, x, y, 14);
      brilho.addColorStop(0, 'rgba(255,170,80,0.9)');
      brilho.addColorStop(1, 'rgba(255,170,80,0)');
      c.fillStyle = brilho;
      c.fillRect(x - 14, y - 14, 28, 28);
    }
    for (let i = 0; i < 18; i++) {
      c.fillStyle = 'rgba(222,255,140,0.85)';
      c.beginPath();
      c.arc(rnd() * s, s * (0.68 + rnd() * 0.25), 1.6, 0, Math.PI * 2);
      c.fill();
    }
  }, 512);
}

/** o que se vê pela porta aberta: a cozinha da bruxa lá atrás, quentinha */
function cozinhaLaAtras(): THREE.CanvasTexture {
  return novaTextura('salao:cozinha-la-atras', 1, (c, s) => {
    c.fillStyle = css(P.salaoCozinhaLonge);
    c.fillRect(0, 0, s, s);
    const fogo = c.createRadialGradient(s * 0.7, s * 0.82, 4, s * 0.7, s * 0.82, s * 0.6);
    fogo.addColorStop(0, 'rgba(255,170,90,0.85)');
    fogo.addColorStop(1, 'rgba(255,170,90,0)');
    c.fillStyle = fogo;
    c.fillRect(0, 0, s, s);
    // a beira da mesa e o chão de tábua
    c.fillStyle = 'rgba(40,22,18,0.8)';
    c.fillRect(0, s * 0.88, s, s * 0.12);
    c.fillStyle = 'rgba(90,50,34,0.9)';
    c.fillRect(s * 0.1, s * 0.62, s * 0.5, s * 0.05);
  }, 256);
}

/** o tapete redondo da pista: xadrez de abóbora e roxo, a beira clara e a abóbora no meio */
function pistaXadrez(diametro: number): THREE.CanvasTexture {
  return novaTextura(`salao:pista:${diametro}`, diametro, (c, s) => {
    const meio = s / 2;
    c.fillStyle = css(P.pistaRoxa);
    c.fillRect(0, 0, s, s);
    const aneis = [0.48, 0.38, 0.28, 0.18];
    aneis.forEach((r, i) => {
      const n = 16;
      for (let k = 0; k < n; k++) {
        c.fillStyle = (k + i) % 2 ? css(P.pistaLaranja) : css(P.pistaRoxa);
        c.beginPath();
        c.moveTo(meio, meio);
        c.arc(meio, meio, r * s, (k / n) * Math.PI * 2, ((k + 1) / n) * Math.PI * 2);
        c.closePath();
        c.fill();
      }
    });
    // a beira e os filetes entre os anéis
    c.strokeStyle = css(P.pistaBeira);
    c.lineWidth = s * 0.018;
    for (const r of [0.485, 0.18]) {
      c.beginPath();
      c.arc(meio, meio, r * s, 0, Math.PI * 2);
      c.stroke();
    }
    c.lineWidth = s * 0.006;
    for (const r of aneis.slice(1)) {
      c.beginPath();
      c.arc(meio, meio, r * s, 0, Math.PI * 2);
      c.stroke();
    }
    // a abóbora sorrindo no meio
    c.fillStyle = css(P.pistaLaranja);
    c.beginPath();
    c.ellipse(meio, meio + s * 0.01, s * 0.15, s * 0.12, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = css(P.pistaRoxa);
    for (const lado of [-1, 1]) {
      c.beginPath();
      c.moveTo(meio + lado * s * 0.075, meio - s * 0.06);
      c.lineTo(meio + lado * s * 0.035, meio - s * 0.005);
      c.lineTo(meio + lado * s * 0.11, meio - s * 0.005);
      c.fill();
    }
    c.beginPath();
    c.moveTo(meio - s * 0.09, meio + s * 0.03);
    c.quadraticCurveTo(meio, meio + s * 0.11, meio + s * 0.09, meio + s * 0.03);
    c.quadraticCurveTo(meio, meio + s * 0.07, meio - s * 0.09, meio + s * 0.03);
    c.fill();
    c.fillStyle = css(P.salaoCabinho);
    c.fillRect(meio - s * 0.012, meio - s * 0.15, s * 0.024, s * 0.04);
  }, 512);
}

/** a espiral do pirulito: rosa, roxo e creme */
function espiralDePirulito(): THREE.CanvasTexture {
  return novaTextura('salao:espiral', 1, (c, s) => {
    const meio = s / 2;
    c.fillStyle = css(P.balaBranca);
    c.fillRect(0, 0, s, s);
    const cores = [P.docePirulito, P.balaRoxa, P.balaLaranja];
    for (let k = 0; k < 3; k++) {
      c.strokeStyle = css(cores[k]);
      c.lineWidth = s * 0.07;
      c.beginPath();
      for (let t = 0; t < 1; t += 0.01) {
        const a = t * Math.PI * 7 + (k / 3) * Math.PI * 2;
        const r = t * s * 0.5;
        c.lineTo(meio + Math.cos(a) * r, meio + Math.sin(a) * r);
      }
      c.stroke();
    }
  }, 128);
}

/**
 * O QUE SE VÊ PELA PORTA ABERTA: o vão em arco, pintado com a cozinha lá
 * atrás. Mora na porta (a cena põe atrás da folha, no plano dela): por fora
 * da casca, perto da beira do que a câmera vê, ele aparecia do lado da porta.
 */
export function vaoDaPorta(): THREE.Mesh {
  const vao = new THREE.Shape();
  const m = PORTA.meia - 0.01;
  vao.moveTo(-m, 0);
  vao.lineTo(m, 0);
  vao.lineTo(m, PORTA.reto);
  vao.absarc(0, PORTA.reto, m, 0, Math.PI, false);
  vao.lineTo(-m, 0);
  const geo = new THREE.ShapeGeometry(vao, 16);
  // o UV de 0 a 1 no vão inteiro
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + m) / (2 * m), pos.getY(i) / (PORTA.reto + m));
  const malha = new THREE.Mesh(geo, pinturaAcesa(cozinhaLaAtras()));
  malha.name = 'cozinha-pela-porta';
  malha.userData.semSombra = true;
  return malha;
}

// ================================================================== a casca

export interface CascaDoSalao {
  group: THREE.Group;
  /** o ponto do chão na frente da porta, por dentro, e para onde a porta olha */
  porta: { x: number; z: number; giro: number };
  /** quanto do céu entra pela cara (o centro do luar no chão) */
  luar: Array<{ x: number; z: number; raio: number }>;
}

/**
 * A casca inteira: as faixas de gomos (as que têm janela recortada à parte),
 * a beira de polpa cortada de cada janela, o céu atrás da cara, a cozinha
 * atrás da porta, o rodapé de polpa e o cabinho no alto.
 */
export function cascaDoSalao(): CascaDoSalao {
  const g = new THREE.Group();
  g.name = 'casca-da-abobora';
  g.userData.peca = 'casca-do-salao';
  const [olhoE, olhoD, boca] = recortesDaCara();
  const porta = recorteDaPorta();

  // ---------------------------------------------------- as faixas da casca
  // as linhas de paralelo que as faixas dividem nas beiradas (a cada 30 cm):
  // vizinhas com os mesmos pontos na beira, nada racha entre elas
  const linhas: number[] = [];
  const nLinhas = Math.ceil(((ALFA_DO_TOPO - ALFA_DO_CHAO) * S.B) / 0.3);
  for (let i = 0; i <= nLinhas; i++) linhas.push(ALFA_DO_CHAO + ((ALFA_DO_TOPO - ALFA_DO_CHAO) * i) / nLinhas);
  const cortes = (de: number, ate: number, n: number): number[] => Array.from({ length: n }, (_, i) => de + ((ate - de) * i) / n);
  const naCara = [S.cara - 0.62, S.cara + 0.62];
  const naPorta = [S.porta - 0.2, S.porta + 0.2];
  const inicio = Math.PI / 4;
  // (entre a cara e a porta, uma faixa só)
  const bordas = [
    ...cortes(inicio, naCara[0], 5), naCara[0], naCara[1], naPorta[0], naPorta[1],
    ...cortes(naPorta[1], inicio + Math.PI * 2, 4).slice(1), inicio + Math.PI * 2,
  ];
  const faixas: THREE.BufferGeometry[] = [];
  const passo = 0.3;
  const P2 = (t: number, a: number): THREE.Vector2 => new THREE.Vector2(t * S.A, a * S.B);
  for (let i = 0; i < bordas.length - 1; i++) {
    const t0 = bordas[i];
    const t1 = bordas[i + 1];
    const comPorta = Math.abs((t0 + t1) / 2 - S.porta) < 0.01;
    const comCara = Math.abs((t0 + t1) / 2 - S.cara) < 0.01;
    const contorno: THREE.Vector2[] = [];
    // a beira de baixo, da direita para a esquerda (com a porta subindo nela)
    const nBase = Math.ceil(((t1 - t0) * S.A) / passo);
    if (comPorta) {
      const direita = porta[porta.length - 1][0];
      const esquerda = porta[0][0];
      for (let k = 0; k <= nBase; k++) {
        const t = t1 - ((t1 - t0) * k) / nBase;
        if (t > direita) contorno.push(P2(t, ALFA_DO_CHAO));
      }
      for (let k = porta.length - 1; k >= 0; k--) contorno.push(P2(porta[k][0], Math.max(ALFA_DO_CHAO, porta[k][1])));
      for (let k = 0; k <= nBase; k++) {
        const t = t1 - ((t1 - t0) * k) / nBase;
        if (t < esquerda) contorno.push(P2(t, ALFA_DO_CHAO));
      }
    } else {
      for (let k = 0; k <= nBase; k++) contorno.push(P2(t1 - ((t1 - t0) * k) / nBase, ALFA_DO_CHAO));
    }
    // a beira da esquerda, subindo
    for (let k = 1; k < linhas.length - 1; k++) contorno.push(P2(t0, linhas[k]));
    // a de cima, da esquerda para a direita
    for (let k = 0; k <= nBase; k++) contorno.push(P2(t0 + ((t1 - t0) * k) / nBase, ALFA_DO_TOPO));
    // a da direita, descendo
    for (let k = linhas.length - 2; k >= 1; k--) contorno.push(P2(t1, linhas[k]));
    const forma = new THREE.Shape(contorno);
    if (comCara) for (const furo of [olhoE, olhoD, boca]) forma.holes.push(new THREE.Path(furo.map(([t, a]) => P2(t, a))));
    let geo: THREE.BufferGeometry = new THREE.ShapeGeometry(forma);
    geo.deleteAttribute('normal');
    geo.deleteAttribute('uv');
    geo = new TessellateModifier(0.36, 14).modify(geo);
    faixas.push(geo);
  }
  let casca = mergeGeometries(faixas.map((f) => {
    const so = new THREE.BufferGeometry();
    so.setAttribute('position', f.getAttribute('position'));
    return so;
  }));
  // do papel para a abóbora: cada ponto (ângulo, paralelo) vai para o elipsoide com gomos
  const pos = casca.getAttribute('position') as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getX(i) / S.A;
    const a = pos.getY(i) / S.B;
    naCasca(t, a, 0, v);
    pos.setXYZ(i, v.x, v.y, v.z);
    uv[i * 2] = ((t - QUINA) * S.gomos) / (Math.PI * 2);
    uv[i * 2 + 1] = v.y / (S.meio + S.B);
  }
  casca.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  casca = mergeVertices(casca, 1e-4);
  casca.computeVertexNormals();
  const malha = new THREE.Mesh(casca, toon(0xffffff, { mapa: polpaPorDentro() }));
  malha.name = 'gomos';
  malha.receiveShadow = true;
  malha.userData.semSombra = true;
  g.add(malha);

  // ------------------------------------- a beira de polpa cortada das janelas
  const beiras: THREE.BufferGeometry[] = [];
  const beira = (contorno: readonly Ponto[], fechado: boolean): void => {
    const pts: number[] = [];
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const d = new THREE.Vector3();
    const n = fechado ? contorno.length : contorno.length - 1;
    for (let k = 0; k < n; k++) {
      const p = contorno[k];
      const q = contorno[(k + 1) % contorno.length];
      naCasca(p[0], Math.max(ALFA_DO_CHAO, p[1]), 0, a);
      naCasca(q[0], Math.max(ALFA_DO_CHAO, q[1]), 0, b);
      naCasca(q[0], Math.max(ALFA_DO_CHAO, q[1]), S.grossura, c);
      naCasca(p[0], Math.max(ALFA_DO_CHAO, p[1]), S.grossura, d);
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    geo.computeVertexNormals();
    beiras.push(geo);
  };
  beira(olhoE, true);
  beira(olhoD, true);
  beira(boca, true);
  beira(porta, false);
  const polpaCortada = new THREE.Mesh(mergeGeometries(beiras), toon(P.aboboraPolpa, { doubleSide: true }));
  polpaCortada.name = 'polpa-cortada';
  polpaCortada.userData.semSombra = true;
  g.add(polpaCortada);

  // ------------------------------------------------------------ o céu atrás da cara
  /** um pedaço de casca por fora (virado para dentro), de `t0..t1` × `a0..a1`, com o UV de 0 a 1 */
  const fundo = (t0: number, t1: number, a0: number, a1: number, fora: number, nt: number, na: number): THREE.BufferGeometry => {
    const pts: number[] = [];
    const uvs: number[] = [];
    const idx: number[] = [];
    const p = new THREE.Vector3();
    for (let j = 0; j <= na; j++) {
      for (let i = 0; i <= nt; i++) {
        naCasca(t0 + ((t1 - t0) * i) / nt, a0 + ((a1 - a0) * j) / na, fora, p);
        pts.push(p.x, p.y, p.z);
        uvs.push(i / nt, j / na);
      }
    }
    for (let j = 0; j < na; j++) {
      for (let i = 0; i < nt; i++) {
        const k = j * (nt + 1) + i;
        // virado para dentro (o mesmo giro da casca)
        idx.push(k, k + 1, k + nt + 2, k, k + nt + 2, k + nt + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    return geo;
  };
  const caraT = [S.cara - 0.36, S.cara + 0.36] as const;
  const caraA = [alfaDaAltura(0.78), alfaDaAltura(3.95)] as const;
  const luaU = (S.cara + 0.185 - caraT[0]) / (caraT[1] - caraT[0]);
  const luaV = (alfaDaAltura(3.15) - caraA[0]) / (caraA[1] - caraA[0]);
  const ceu = new THREE.Mesh(fundo(caraT[0], caraT[1], caraA[0], caraA[1], S.grossura + 0.06, 24, 16), pinturaAcesa(ceuDeFora(luaU, luaV)));
  ceu.name = 'ceu-pela-cara';
  ceu.userData.semSombra = true;
  g.add(ceu);

  // ------------------------------------------------- o rodapé de polpa e o cabinho
  const volta: THREE.Vector3[] = [];
  for (let k = 0; k < 144; k++) volta.push(naCasca((k / 144) * Math.PI * 2, alfaDaAltura(0.05), -0.04));
  const rodape = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(volta, true), 288, 0.075, 6, true), toon(P.salaoPolpaClara));
  rodape.name = 'rodape-de-polpa';
  rodape.scale.y = 0.85;
  g.add(rodape);
  const rTopo = S.A * Math.cos(ALFA_DO_TOPO) + 0.04;
  const yTopo = S.meio + S.B * Math.sin(ALFA_DO_TOPO);
  const nozinho = new THREE.LatheGeometry([
    new THREE.Vector2(0.001, yTopo - 0.32), new THREE.Vector2(0.14, yTopo - 0.3), new THREE.Vector2(0.26, yTopo - 0.22),
    new THREE.Vector2(0.4, yTopo - 0.1), new THREE.Vector2(rTopo, yTopo + 0.02),
  ], 18);
  const cabinho = new THREE.Mesh(nozinho, toon(P.salaoCabinho));
  cabinho.name = 'cabinho-por-dentro';
  g.add(cabinho);

  // a porta: o ponto do chão na frente dela (por dentro) e o giro dela (olhando para o meio)
  const rPorta = S.raioDaPorta;
  const luar = [S.cara - 0.185, S.cara + 0.185, S.cara].map((t, i) => {
    // a luz da janela cai no chão para dentro (a lua vem de cima: o olho joga mais perto)
    const r = i < 2 ? 5.1 : 5.6;
    return { x: Math.cos(t) * r, z: Math.sin(t) * r, raio: i < 2 ? 0.75 : 1.2 };
  });
  return {
    group: g,
    porta: { x: Math.cos(S.porta) * rPorta, z: Math.sin(S.porta) * rPorta, giro: Math.atan2(-Math.cos(S.porta), -Math.sin(S.porta)) },
    luar,
  };
}

/** um ponto do chão a `r` do meio, no ângulo `teta` (o mesmo `x = cos`, `z = sen` da casca) */
export function noSalao(teta: number, r: number): { x: number; z: number } {
  return { x: Math.cos(teta) * r, z: Math.sin(teta) * r };
}

/** o ponto de pendurar na parede (a `h` do chão, `recuo` para dentro da face) */
export function naParede(teta: number, h: number, recuo = 0.05): THREE.Vector3 {
  const r = raioDaParede(teta, h) - recuo;
  return new THREE.Vector3(Math.cos(teta) * r, h, Math.sin(teta) * r);
}

/** a altura do cabinho (o alto do teto, no meio) */
export const ALTO_DO_TETO = S.meio + S.B * Math.sin(ALFA_DO_TOPO) - 0.3;

// ============================================================ o lustre de velas

/**
 * O LUSTRE DE VELAS pendurado do cabinho: dois aros de ferro com as velas de
 * cera (o pingo escorrido em cada uma), as correntes até o gancho e a
 * corrente comprida até o teto. Apagado no escuro; na surpresa, `acender`
 * liga as chamas, o halo de cada uma e a poça quente no chão embaixo.
 * Origem no meio do aro de baixo.
 */
export class LustreDeVelas {
  readonly group = new THREE.Group();
  /** as chamas, uma cópia por vela (treme pela matriz de cada uma), e o halo de cada uma, em lote */
  private chamas!: THREE.InstancedMesh;
  private readonly ondeAsChamas: THREE.Vector3[] = [];
  private readonly luz = new THREE.Group();
  private aceso = 0;
  private tempo = 0;

  constructor(alturaDoAro: number, alturaDoTeto: number) {
    const g = this.group;
    g.name = 'lustre-de-velas';
    g.userData.peca = 'lustre-de-velas';
    const ferro = toon(P.lustreFerro);
    const cera = toon(P.velaCera);
    const pingo = toon(P.velaPingo);
    const fixo = new THREE.Group();
    const por = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      fixo.add(m);
      return m;
    };
    const rnd = sorteio(8080);
    const aros: Array<[number, number, number]> = [[0.62, 0, 8], [0.32, 0.36, 5]];
    for (const [raio, y, n] of aros) {
      por(new THREE.TorusGeometry(raio, 0.026, 6, 40).rotateX(Math.PI / 2), ferro, 0, y, 0);
      // os arabescos de ferro por baixo do aro
      for (let k = 0; k < n; k++) {
        const a = ((k + 0.5) / n) * Math.PI * 2;
        const voluta = por(new THREE.TorusGeometry(0.06, 0.01, 4, 12, Math.PI * 1.5), ferro, Math.cos(a) * raio * 0.92, y - 0.07, Math.sin(a) * raio * 0.92);
        voluta.rotation.y = -a;
      }
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        const x = Math.cos(a) * raio;
        const z = Math.sin(a) * raio;
        const alta = 0.16 + rnd() * 0.08;
        // o copinho, a vela e o pingo escorrido
        por(new THREE.CylinderGeometry(0.05, 0.03, 0.04, 10), ferro, x, y + 0.03, z);
        por(new THREE.CylinderGeometry(0.032, 0.034, alta, 10), cera, x, y + 0.05 + alta / 2, z);
        por(new THREE.CapsuleGeometry(0.011, 0.04 + rnd() * 0.05, 3, 6), pingo, x + Math.cos(a + 1) * 0.03, y + 0.05 + alta - 0.05, z + Math.sin(a + 1) * 0.03);
        por(new THREE.CylinderGeometry(0.003, 0.003, 0.025, 4), ferro, x, y + 0.06 + alta, z);
        // a chama: uma gota que treme (e o halo dela, no mesmo ponto)
        this.ondeAsChamas.push(new THREE.Vector3(x, y + 0.1 + alta, z));
      }
    }
    // as hastes do aro de baixo ao gancho, e a corrente até o teto
    const gancho = 0.95;
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + Math.PI / 8;
      const de = new THREE.Vector3(Math.cos(a) * 0.6, 0, Math.sin(a) * 0.6);
      const ate = new THREE.Vector3(0, gancho, 0);
      const meio = de.clone().add(ate).multiplyScalar(0.5);
      const haste = por(new THREE.CylinderGeometry(0.008, 0.008, de.distanceTo(ate), 4), ferro, meio.x, meio.y, meio.z);
      haste.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ate.clone().sub(de).normalize());
    }
    por(new THREE.SphereGeometry(0.05, 10, 8), ferro, 0, gancho, 0);
    por(new THREE.ConeGeometry(0.04, 0.12, 8).rotateX(Math.PI), ferro, 0, -0.08, 0);
    const corrente = alturaDoTeto - alturaDoAro - gancho + 0.14;
    const elos = Math.max(2, Math.floor(corrente / 0.075));
    for (let k = 0; k < elos; k++) {
      const elo = por(new THREE.TorusGeometry(0.028, 0.007, 4, 10), ferro, 0, gancho + 0.04 + k * 0.075, 0);
      elo.rotation.y = k % 2 ? Math.PI / 2 : 0;
    }
    g.add(fundir(fixo));
    const n = this.ondeAsChamas.length;
    this.chamas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.024, 8, 6), toon(P.fogo, { glow: 1 }), n);
    this.chamas.name = 'chamas-do-lustre';
    this.chamas.userData.semSombra = true;
    const halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.luzDeAbobora, 0.55), n);
    halos.name = 'halos-do-lustre';
    halos.userData.semSombra = true;
    halos.renderOrder = 3;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    this.ondeAsChamas.forEach((p, i) => {
      this.chamas.setMatrixAt(i, m.compose(p, q, new THREE.Vector3(0.8, 1.6, 0.8)));
      halos.setMatrixAt(i, m.compose(p.clone().setY(p.y + 0.01), q, new THREE.Vector3(0.42, 0.42, 0.42)));
      halos.setColorAt(i, new THREE.Color(0xffffff));
    });
    halos.instanceMatrix.needsUpdate = true;
    halos.computeBoundingSphere();
    this.luz.add(halos);
    this.luz.name = 'luz-do-lustre';
    // a poça quente no chão, embaixo do lustre (o chão fica a `alturaDoAro` abaixo)
    const poca = pocaDeLuz(3.6, P.luzDeAbobora, 0.42);
    poca.position.y = -alturaDoAro + 0.02;
    this.luz.add(poca);
    g.add(this.chamas, this.luz);
    this.chamas.computeBoundingSphere();
    this.acender(0);
  }

  /** 0 apagado, 1 aceso */
  acender(k: number): void {
    this.aceso = k;
    this.chamas.visible = k > 0.02;
    this.luz.visible = k > 0.5;
  }

  get acesas(): boolean {
    return this.aceso > 0.5;
  }

  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly s = new THREE.Vector3();

  update(dt: number): void {
    this.tempo += dt;
    if (!this.chamas.visible) return;
    const k = Math.min(1, this.aceso);
    this.ondeAsChamas.forEach((p, i) => {
      this.s.set(0.8 * k, (1.5 + Math.sin(this.tempo * (10 + i)) * 0.18 + Math.sin(this.tempo * 5.3 + i) * 0.1) * k, 0.8 * k);
      this.chamas.setMatrixAt(i, this.m.compose(p, this.q, this.s));
    });
    this.chamas.instanceMatrix.needsUpdate = true;
  }
}

// ============================================================== a pista

/** O TAPETE DA PISTA, redondo, xadrez de abóbora (a cena põe com `w.disc`). */
export function texturaDaPista(diametro: number): THREE.CanvasTexture {
  return pistaXadrez(diametro);
}

// ============================================================ os doces

/** A BALA EMBRULHADA: o rolinho e as duas pontas torcidas do papel (de lado, no `x`). */
function geoDeBala(): THREE.BufferGeometry {
  const corpo = new THREE.CapsuleGeometry(0.022, 0.03, 4, 10).rotateZ(Math.PI / 2);
  const ponta = (lado: number): THREE.BufferGeometry => {
    const c = new THREE.ConeGeometry(0.02, 0.03, 7, 1, true).rotateZ(lado * Math.PI / 2);
    c.translate(lado * 0.052, 0, 0);
    return c;
  };
  const geo = mergeGeometries([corpo.toNonIndexed(), ponta(1).toNonIndexed(), ponta(-1).toNonIndexed()]);
  geo.deleteAttribute('uv');
  return geo;
}

/** a forminha pregueada e a cobertura em três voltas com a pontinha (um cupcake de pé, origem embaixo) */
function cupcake(cor: number, forma: number, olhinhos: boolean): THREE.Group {
  const g = new THREE.Group();
  const por = (geo: THREE.BufferGeometry, mat: THREE.Material, y: number): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y;
    g.add(m);
    return m;
  };
  // a forminha: cilindro aberto em cima, com as pregas na borda (os vértices de fora puxados)
  const copo = new THREE.CylinderGeometry(0.045, 0.035, 0.05, 20, 1);
  const p = copo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getZ(i), p.getX(i));
    const k = 1 + 0.06 * Math.cos(a * 10);
    p.setX(i, p.getX(i) * k);
    p.setZ(i, p.getZ(i) * k);
  }
  copo.computeVertexNormals();
  por(copo, toon(forma), 0.025);
  por(new THREE.CylinderGeometry(0.044, 0.044, 0.02, 16), toon(P.massaDeBolo), 0.058);
  const cobertura = toon(cor);
  por(new THREE.TorusGeometry(0.034, 0.016, 8, 18).rotateX(Math.PI / 2), cobertura, 0.07);
  por(new THREE.TorusGeometry(0.022, 0.014, 8, 16).rotateX(Math.PI / 2), cobertura, 0.09);
  por(new THREE.ConeGeometry(0.02, 0.04, 10), cobertura, 0.112);
  if (olhinhos) {
    for (const lado of [-1, 1]) {
      const olho = por(new THREE.SphereGeometry(0.011, 8, 6), toon(P.balaBranca), 0.088);
      olho.position.set(lado * 0.014, 0.088, 0.03);
      const pupila = por(new THREE.SphereGeometry(0.005, 6, 4), toon(P.olhoDeBoneco), 0.09);
      pupila.position.set(lado * 0.014, 0.09, 0.04);
    }
  }
  return g;
}

/** o pirulito de espiral (origem na ponta do palito, de pé) */
function pirulito(): THREE.Group {
  const g = new THREE.Group();
  const palito = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 6), toon(P.palitoDeDoce));
  palito.position.y = 0.07;
  g.add(palito);
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.014, 22).rotateX(Math.PI / 2), toon(0xffffff, { mapa: espiralDePirulito() }));
  disco.position.y = 0.17;
  g.add(disco);
  return g;
}

/** a maçã do amor: a calda vermelha, o brilho, o palito e o pezinho de calda escorrida (origem embaixo) */
function macaDoAmor(): THREE.Group {
  const g = new THREE.Group();
  const calda = toon(P.macaDoAmor);
  const maca = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), calda);
  maca.scale.set(1, 0.9, 1);
  maca.position.y = 0.047;
  g.add(maca);
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.008, 16), calda);
  pe.position.y = 0.004;
  g.add(pe);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toon(P.macaDoAmorBrilho, { glow: 0.4 }));
  brilho.position.set(-0.02, 0.07, 0.03);
  brilho.scale.set(1, 0.6, 0.5);
  g.add(brilho);
  const palito = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.1, 6), toon(P.palitoDeDoce));
  palito.position.y = 0.12;
  g.add(palito);
  return g;
}

export type Doce = 'cupcake' | 'pirulito' | 'maca' | 'bala';

/**
 * O DOCE NA MÃO (o que o Walter serve): origem no ponto de segurar, de pé.
 * Um pouco maior que na mesa, como todo comestível de mão do jogo — no
 * tamanho de verdade, um pirulito some entre os dedos chibi.
 */
export function doceDaFesta(tipo: Doce): THREE.Group {
  const g = new THREE.Group();
  g.name = `doce-${tipo}`;
  let d: THREE.Object3D;
  if (tipo === 'cupcake') {
    d = cupcake(P.coberturaLaranja, P.forminhaDeCupcake, true);
    d.position.y = -0.03;
  } else if (tipo === 'pirulito') {
    d = pirulito();
    d.position.y = -0.05;
  } else if (tipo === 'maca') {
    d = macaDoAmor();
    d.rotation.x = Math.PI;
    d.position.y = 0.12;
  } else {
    d = new THREE.Mesh(geoDeBala(), toon(P.balaLaranja));
    d.position.y = 0.01;
  }
  g.add(d);
  g.scale.setScalar(1.6);
  return fundir(g);
}

/**
 * A MESA DE DOCES, olhando para `+Z` (a frente, de onde se serve), com a
 * origem no chão no meio dela: a toalha roxa com a barra de babado laranja,
 * a boleira de dois andares com os cupcakes de monstrinho, o bolo de abóbora
 * com a calda escorrendo e a abóborinha em cima, o pote de pirulitos, o
 * prato de maçãs do amor e balas soltas. Do lado direito, no chão, o
 * CALDEIRÃO DE BALAS transbordando (em lote, cada bala na sua cor).
 */
export function mesaDeDoces(): { group: THREE.Group; largura: number; fundo: number } {
  const g = new THREE.Group();
  g.name = 'mesa-de-doces';
  g.userData.peca = 'mesa-de-doces';
  const L = 2.4;
  const F = 0.82;
  const H = 0.82;
  const toalha = toon(P.toalhaDeDoces);
  const barra = toon(P.toalhaDeDocesBarra);
  const por = (pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  };
  // o tampo com a toalha (as pernas ficam escondidas pela saia)
  por(g, new THREE.BoxGeometry(L + 0.06, 0.05, F + 0.06), toalha, 0, H - 0.025, 0);
  // a saia: o pano caindo com a barra de babado, em cada lado
  const saia = (largura: number): THREE.BufferGeometry[] => {
    const alto = H - 0.06;
    const ondas = Math.round(largura / 0.2);
    const pano = new THREE.Shape();
    pano.moveTo(-largura / 2, 0.14);
    for (let k = 0; k < ondas; k++) {
      const x0 = -largura / 2 + (k * largura) / ondas;
      pano.quadraticCurveTo(x0 + largura / ondas / 2, 0.08, x0 + largura / ondas, 0.14);
    }
    pano.lineTo(largura / 2, alto);
    pano.lineTo(-largura / 2, alto);
    const babado = new THREE.Shape();
    babado.moveTo(-largura / 2, 0.16);
    for (let k = 0; k < ondas; k++) {
      const x0 = -largura / 2 + (k * largura) / ondas;
      babado.quadraticCurveTo(x0 + largura / ondas / 2, -0.04, x0 + largura / ondas, 0.16);
    }
    return [new THREE.ShapeGeometry(pano, 4), new THREE.ShapeGeometry(babado, 4)];
  };
  const lados: Array<[number, number, number, number]> = [
    [L + 0.06, 0, (F + 0.06) / 2, 0], [L + 0.06, 0, -(F + 0.06) / 2, Math.PI],
    [F + 0.06, (L + 0.06) / 2, 0, Math.PI / 2], [F + 0.06, -(L + 0.06) / 2, 0, -Math.PI / 2],
  ];
  for (const [largura, x, z, giro] of lados) {
    const [pano, babado] = saia(largura);
    const p = por(g, pano, toalha, x, 0, z);
    p.rotation.y = giro;
    const b = por(g, babado, barra, x + Math.sin(giro) * 0.006, 0, z + Math.cos(giro) * 0.006);
    b.rotation.y = giro;
  }
  const tampo = H;
  // a boleira de dois andares, com os cupcakes
  const boleira = new THREE.Group();
  boleira.position.set(-0.75, tampo, -0.05);
  g.add(boleira);
  const louca = toon(P.balaBranca);
  por(boleira, new THREE.CylinderGeometry(0.03, 0.05, 0.36, 10), louca, 0, 0.18, 0);
  por(boleira, new THREE.CylinderGeometry(0.3, 0.27, 0.025, 28), louca, 0, 0.02, 0);
  por(boleira, new THREE.CylinderGeometry(0.19, 0.17, 0.025, 24), louca, 0, 0.27, 0);
  const coberturas = [P.coberturaLaranja, P.coberturaRoxa, P.coberturaVerde];
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2;
    const c = cupcake(coberturas[k % 3], k % 2 ? P.forminhaDeCupcake : P.forminhaDeCupcakeClara, k % 3 === 0);
    c.position.set(Math.cos(a) * 0.2, 0.033, Math.sin(a) * 0.2);
    c.rotation.y = -a + Math.PI / 2;
    boleira.add(c);
  }
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + 0.4;
    const c = cupcake(coberturas[(k + 1) % 3], P.forminhaDeCupcake, k % 2 === 0);
    c.position.set(Math.cos(a) * 0.1, 0.283, Math.sin(a) * 0.1);
    c.rotation.y = -a + Math.PI / 2;
    boleira.add(c);
  }
  // o bolo de abóbora: dois andares com o recheio, a calda roxa escorrendo e a abóborinha
  const bolo = new THREE.Group();
  bolo.position.set(0.12, tampo, -0.08);
  g.add(bolo);
  por(bolo, new THREE.CylinderGeometry(0.27, 0.27, 0.012, 28), louca, 0, 0.006, 0);
  for (const [r, y0, alto] of [[0.22, 0.012, 0.16], [0.15, 0.172, 0.13]] as const) {
    por(bolo, new THREE.CylinderGeometry(r, r, alto, 28), toon(P.boloDeAbobora), 0, y0 + alto / 2, 0);
    por(bolo, new THREE.CylinderGeometry(r + 0.003, r + 0.003, 0.018, 28, 1, true), toon(P.boloRecheio), 0, y0 + alto * 0.45, 0);
    // a calda: o anel em cima e as gotas escorrendo
    por(bolo, new THREE.TorusGeometry(r - 0.01, 0.018, 6, 28).rotateX(Math.PI / 2), toon(P.coberturaRoxa), 0, y0 + alto, 0);
    por(bolo, new THREE.CylinderGeometry(r - 0.01, r - 0.01, 0.012, 28), toon(P.coberturaRoxa), 0, y0 + alto + 0.004, 0);
    const n = Math.round(r * 60);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + 0.2;
      const gota = por(bolo, new THREE.CapsuleGeometry(0.013, 0.02 + ((k * 7) % 5) * 0.012, 3, 6), toon(P.coberturaRoxa), Math.cos(a) * (r + 0.004), y0 + alto - 0.02 - ((k * 7) % 5) * 0.006, Math.sin(a) * (r + 0.004));
      gota.scale.z = 0.7;
    }
  }
  const aboborinha = new LoteDeAboboras().por({ x: 0, y: 0.302, z: 0, raio: 0.075, giro: 0.4, cara: 'sorriso' });
  bolo.add(aboborinha.montar());
  // o pote de pirulitos (uma abóbora de balde) e as maçãs do amor no prato
  const pote = new THREE.Group();
  pote.position.set(0.8, tampo, 0.08);
  g.add(pote);
  por(pote, new THREE.CylinderGeometry(0.1, 0.085, 0.14, 16), toon(P.abobora), 0, 0.07, 0);
  por(pote, new THREE.TorusGeometry(0.1, 0.012, 6, 18).rotateX(Math.PI / 2), toon(P.aboboraFunda), 0, 0.14, 0);
  for (let k = 0; k < 6; k++) {
    const p = pirulito();
    const a = (k / 6) * Math.PI * 2;
    p.position.set(Math.cos(a) * 0.04, 0.03, Math.sin(a) * 0.04);
    p.rotation.set(Math.sin(a) * 0.25, a * 0.6, -Math.cos(a) * 0.25);
    pote.add(p);
  }
  const prato = new THREE.Group();
  prato.position.set(0.65, tampo, -0.25);
  g.add(prato);
  por(prato, new THREE.CylinderGeometry(0.2, 0.17, 0.016, 24), louca, 0, 0.008, 0);
  for (let k = 0; k < 4; k++) {
    const m = macaDoAmor();
    const a = (k / 4) * Math.PI * 2 + 0.3;
    m.position.set(Math.cos(a) * 0.1, 0.016, Math.sin(a) * 0.1);
    prato.add(m);
  }
  // as balas soltas no tampo e no caldeirão (um lote só, cada uma na sua cor)
  const coresDeBala = [P.balaRosa, P.balaVerde, P.balaAmarela, P.balaRoxa, P.balaLaranja, P.balaBranca];
  const balas: Array<{ p: THREE.Vector3; giro: THREE.Euler; cor: number }> = [];
  const rnd = sorteio(9090);
  for (let k = 0; k < 14; k++) {
    balas.push({
      p: new THREE.Vector3(-0.35 + rnd() * 1.4, tampo + 0.022, 0.2 + rnd() * 0.18),
      giro: new THREE.Euler(0, rnd() * Math.PI, 0), cor: coresDeBala[k % coresDeBala.length],
    });
  }
  // o caldeirão de balas, no chão do lado direito da mesa
  const CAL = { x: L / 2 + 0.55, z: 0.15 };
  const cal = caldeirao();
  cal.position.set(CAL.x, 0, CAL.z);
  cal.scale.setScalar(1.15);
  g.add(cal);
  // o morro de balas saindo da boca (0,62 × 1,15 de alto), e umas caídas no chão
  for (let k = 0; k < 90; k++) {
    const r = Math.sqrt(rnd()) * 0.31;
    const a = rnd() * Math.PI * 2;
    const y = 0.66 + Math.cos((r / 0.31) * Math.PI / 2) * 0.13 + rnd() * 0.02;
    balas.push({
      p: new THREE.Vector3(CAL.x + Math.cos(a) * r, y, CAL.z + Math.sin(a) * r),
      giro: new THREE.Euler(rnd() * 0.8, rnd() * Math.PI * 2, rnd() * 0.8), cor: coresDeBala[k % coresDeBala.length],
    });
  }
  for (let k = 0; k < 12; k++) {
    const a = 0.3 + rnd() * 2.4;
    const r = 0.5 + rnd() * 0.35;
    balas.push({
      p: new THREE.Vector3(CAL.x + Math.cos(a) * r, 0.022, CAL.z + Math.sin(a) * r),
      giro: new THREE.Euler(0, rnd() * Math.PI * 2, 0), cor: coresDeBala[k % coresDeBala.length],
    });
  }
  const lote = new THREE.InstancedMesh(geoDeBala(), toon(0xffffff), balas.length);
  lote.name = 'balas';
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const um = new THREE.Vector3(1, 1, 1);
  const cor = new THREE.Color();
  balas.forEach((b, i) => {
    lote.setMatrixAt(i, m.compose(b.p, q.setFromEuler(b.giro), um));
    lote.setColorAt(i, cor.set(b.cor));
  });
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  lote.computeBoundingSphere();
  g.add(lote);
  return { group: fundir(g), largura: L, fundo: F };
}
