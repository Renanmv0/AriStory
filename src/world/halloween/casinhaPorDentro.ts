import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { acesoPorVertice, toon } from '../../core/materials';
import { arco, quina } from '../lojaDeRoupas';
import { macia } from '../moveisDaBoutique';
import { uvDeParede } from '../acabamento';
import { veioDeMadeira } from '../texturasDeCasa';
import { tijolinho } from '../texturasDeFachada';
import { novaTextura, sorteio } from '../texturasDeChao';
import { haloDeLampada, pocaDeLuz } from '../furniture';
import { fundir } from '../fundir';
import { canvasComLetra, PocaoBorbulhando } from './carrinhoDePocoes';
import { caldeirao, chapeuDeBruxa } from './pecas';
import { LoteDeAboboras } from './abobora';
import { galho, tabuas, tabuasRoxas } from './casinhaDaAbobora';

/*
 * A CASINHA DA ABÓBORA POR DENTRO — as peças da parte 6b
 * (`docs/HALLOWEEN.md`, §7.1, C e D): o CORREDOR e a COZINHA DA BRUXA.
 *
 * - as PAREDES (`paredeDoCorredor`, `paredeDaCozinha`): o papel listrado roxo
 *   e preto com estrelinhas douradas em cima do lambri de madeira (o
 *   corredor), a tábua roxa da casinha (a cozinha), com rodapé, friso e
 *   cornija; as baixas (do lado da câmera) com o mesmo acabamento;
 * - os QUADROS DE OLHOS QUE SEGUEM (`QuadroComOlhos`): a pintura em canvas
 *   com o branco do olho pintado, e a pupila é uma malha que anda dentro dele
 *   para o lado de quem passa;
 * - o RELÓGIO DE PÊNDULO (`RelogioDePendulo`), o pêndulo balançando e o BONG;
 * - os MORCEGUINHOS NO FIO (`MorceguinhosNoFio`): de feltro, cada um num
 *   pêndulo próprio, que balança quando a dupla passa embaixo;
 * - a ARANDELA de vela (`arandela`);
 * - na cozinha: o FOGÃO A LENHA de tijolinho com o caldeirão borbulhando
 *   (`FogaoALenha`), a PRATELEIRA DE POÇÕES acesas (`prateleiraDePocoes`), as
 *   VASSOURAS (`vassourasEncostadas`), a RÉSTIA DE ABÓBORAS (`restiaDeAboboras`),
 *   a JANELA REDONDA com a lua (`janelaComLua`), a MESA com o livro de
 *   feitiço (`mesaDaBruxa`), o FANTASMINHA DE MOLA no chapéu
 *   (`FantasminhaDeMola`) e a PORTA GRANDE do salão (`portaDoSalao`).
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const FONTE = '"Caveat", "Segoe Print", "Comic Sans MS", cursive';

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

// ================================================================ as texturas

/** o papel de parede: listras roxas largas e estreitas, com estrelinhas e luazinhas douradas */
export function papelListrado(): THREE.CanvasTexture {
  return novaTextura('casinha:papel-listrado', 0.6, (c, s) => {
    const rnd = sorteio(4040);
    c.fillStyle = css(P.papelRoxo);
    c.fillRect(0, 0, s, s);
    // as listras: duas escuras por azulejo, com um fio dourado do lado
    for (const [x, l] of [[s * 0.18, s * 0.16], [s * 0.68, s * 0.16]] as const) {
      c.fillStyle = css(P.papelRoxoEscuro);
      c.fillRect(x, 0, l, s);
      c.fillStyle = `rgba(215,173,79,0.55)`;
      c.fillRect(x - 3, 0, 2, s);
      c.fillRect(x + l + 1, 0, 2, s);
    }
    // as estrelinhas e as luazinhas, nas faixas claras
    const estrela = (x: number, y: number, r: number): void => {
      c.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = k % 2 ? r * 0.45 : r;
        c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      c.closePath();
      c.fill();
    };
    c.fillStyle = css(P.papelEstrela);
    for (const xc of [s * 0.08, s * 0.5, s * 0.92]) {
      for (let k = 0; k < 4; k++) {
        const y = (k + 0.5) * (s / 4) + (rnd() - 0.5) * 8;
        if (k % 2) estrela(xc, y, 6 + rnd() * 2);
        else {
          c.beginPath();
          c.arc(xc, y, 6, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = css(P.papelRoxo);
          c.beginPath();
          c.arc(xc + 3, y - 2, 5.5, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = css(P.papelEstrela);
        }
      }
    }
    // o papel envelhecido: manchinhas
    for (let k = 0; k < 40; k++) {
      c.fillStyle = `rgba(0,0,0,${0.02 + rnd() * 0.04})`;
      c.beginPath();
      c.arc(rnd() * s, rnd() * s, 4 + rnd() * 14, 0, Math.PI * 2);
      c.fill();
    }
  });
}

const tabuasDoLambri = (): THREE.CanvasTexture => tabuas('casinha:lambri', 0.7, 6, P.lambriMadeira, P.relogioMadeira, 2290);

// ================================================================ as paredes

/**
 * Uma parede de `comprimento` ao longo de `+X` (de 0 até ele), a face para
 * `+Z`, centrada na espessura em `z = 0`. `estilo` decide o acabamento: o
 * papel listrado com lambri (o corredor) ou a tábua roxa (a cozinha). Com
 * `alto` baixo (as do lado da câmera) leva só o lambri e um capeamento.
 */
export function parede(comprimento: number, alto: number, estilo: 'corredor' | 'cozinha', esp = 0.16): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'parede-da-casinha';
  const baixa = alto < 1.2;
  const papel = estilo === 'corredor' ? toon(0xffffff, { mapa: papelListrado() }) : toon(0xffffff, { mapa: tabuasRoxas() });
  const lambri = toon(0xffffff, { mapa: tabuasDoLambri() });
  const friso = toon(P.lambriFriso);
  const rodape = toon(P.relogioMadeira);
  const meio = comprimento / 2;
  // o corpo da parede (o papel ou a tábua)
  por(g, uvDeParede(new THREE.BoxGeometry(comprimento, alto, esp), meio, alto / 2, 0), papel, meio, alto / 2, 0);
  // o lambri na parte de baixo, um tico para fora da face (a do corredor; a baixa leva sempre)
  const altoDoLambri = baixa ? alto - 0.02 : 0.95;
  if (estilo === 'corredor' || baixa) {
    por(g, uvDeParede(new THREE.BoxGeometry(comprimento - 0.004, altoDoLambri, 0.03), meio, altoDoLambri / 2, esp / 2 + 0.015), lambri, meio, altoDoLambri / 2, esp / 2 + 0.015);
    // o friso em cima do lambri
    por(g, quina(comprimento - 0.002, 0.05, 0.06, 0.012), friso, meio, altoDoLambri, esp / 2 + 0.02);
  }
  // o rodapé
  por(g, quina(comprimento - 0.006, 0.13, 0.05, 0.01), rodape, meio, 0.065, esp / 2 + 0.03);
  // em cima: a cornija (a alta) ou o capeamento (a baixa)
  if (baixa) por(g, quina(comprimento + 0.02, 0.05, esp + 0.08, 0.012), friso, meio, alto + 0.02, 0.01);
  else por(g, quina(comprimento - 0.002, 0.09, 0.09, 0.015), friso, meio, alto - 0.06, esp / 2 + 0.03);
  return fundir(g);
}

// ============================================================ os quadros com olhos

export type TemaDoQuadro = 'fantasma' | 'abobora' | 'gato' | 'casa';

interface Olho {
  /** o meio do branco do olho, em fração da pintura (0 a 1, de baixo para cima no `v`) */
  u: number;
  v: number;
  /** o raio da pupila e quanto ela anda, em fração da largura */
  r: number;
  anda: number;
  cor: number;
}

const L_QUADRO = 0.62;
const A_QUADRO = 0.78;

/** a pintura de cada tema (o canvas tem a proporção do quadro); os brancos dos olhos são pintados */
function pintura(tema: TemaDoQuadro): { tex: THREE.CanvasTexture; olhos: Olho[] } {
  const W = 248;
  const H = 312;
  const olhos: Olho[] = [];
  const naTela = (o: Olho): [number, number] => [o.u * W, (1 - o.v) * H];
  const brancoDoOlho = (c: CanvasRenderingContext2D, o: Olho, rx: number, ry: number, cor = '#fbf8ef'): void => {
    const [x, y] = naTela(o);
    c.fillStyle = cor;
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(30,20,40,0.6)';
    c.lineWidth = 2;
    c.stroke();
  };
  const ceu = (c: CanvasRenderingContext2D, cor: number = P.ceuDoQuadro): void => {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, css(cor));
    g.addColorStop(1, '#5b3f6e');
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    const rnd = sorteio(31 + tema.length);
    c.fillStyle = 'rgba(255,248,210,0.85)';
    for (let k = 0; k < 18; k++) {
      c.beginPath();
      c.arc(rnd() * W, rnd() * H * 0.55, 1 + rnd() * 1.6, 0, Math.PI * 2);
      c.fill();
    }
  };
  // as pinceladas: um véu de riscos por cima de tudo (é pintura, não foto)
  const pinceladas = (c: CanvasRenderingContext2D): void => {
    const rnd = sorteio(77);
    for (let k = 0; k < 60; k++) {
      c.strokeStyle = `rgba(${rnd() < 0.5 ? '255,255,255' : '0,0,0'},0.05)`;
      c.lineWidth = 2 + rnd() * 4;
      const x = rnd() * W;
      const y = rnd() * H;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 10 + rnd() * 20, y + (rnd() - 0.5) * 6);
      c.stroke();
    }
  };
  if (tema === 'fantasma') {
    olhos.push({ u: 0.4, v: 0.55, r: 0.032, anda: 0.03, cor: 0x231a2e }, { u: 0.6, v: 0.55, r: 0.032, anda: 0.03, cor: 0x231a2e });
  } else if (tema === 'abobora') {
    olhos.push({ u: 0.37, v: 0.5, r: 0.03, anda: 0.03, cor: 0x2b1408 }, { u: 0.63, v: 0.5, r: 0.03, anda: 0.03, cor: 0x2b1408 });
  } else if (tema === 'gato') {
    olhos.push({ u: 0.42, v: 0.47, r: 0.024, anda: 0.026, cor: 0x1a1414 }, { u: 0.58, v: 0.47, r: 0.024, anda: 0.026, cor: 0x1a1414 });
  } else {
    olhos.push({ u: 0.36, v: 0.52, r: 0.026, anda: 0.03, cor: 0x2a1c12 }, { u: 0.64, v: 0.52, r: 0.026, anda: 0.03, cor: 0x2a1c12 });
  }
  const tex = canvasComLetra(W, H, (c) => {
    if (tema === 'fantasma') {
      ceu(c);
      // a lua atrás
      c.fillStyle = css(P.luaDoQuadro);
      c.beginPath();
      c.arc(W * 0.78, H * 0.18, 26, 0, Math.PI * 2);
      c.fill();
      // o fantasminha de lençol, de sorriso tímido
      c.fillStyle = '#f5f1ff';
      c.beginPath();
      c.moveTo(W * 0.24, H * 0.92);
      c.bezierCurveTo(W * 0.2, H * 0.4, W * 0.32, H * 0.22, W * 0.5, H * 0.22);
      c.bezierCurveTo(W * 0.68, H * 0.22, W * 0.8, H * 0.4, W * 0.76, H * 0.92);
      for (let k = 0; k < 5; k++) {
        const x0 = W * (0.76 - k * 0.104);
        c.quadraticCurveTo(x0 - W * 0.026, H * 0.86, x0 - W * 0.052, H * 0.92);
        c.quadraticCurveTo(x0 - W * 0.078, H * 0.98, x0 - W * 0.104, H * 0.92);
      }
      c.closePath();
      c.fill();
      c.fillStyle = 'rgba(160,140,200,0.35)';
      c.fillRect(W * 0.26, H * 0.7, W * 0.48, 6);
      for (const o of olhos) brancoDoOlho(c, o, 15, 19, '#fbf8ef');
      c.fillStyle = css(P.bochechaDeBoneco);
      for (const x of [0.33, 0.67]) {
        c.beginPath();
        c.ellipse(W * x, H * 0.52, 9, 5, 0, 0, Math.PI * 2);
        c.fill();
      }
      c.strokeStyle = '#4a3a5a';
      c.lineWidth = 3;
      c.beginPath();
      c.arc(W * 0.5, H * 0.38, 9, 0.2, Math.PI - 0.2);
      c.stroke();
    } else if (tema === 'abobora') {
      // o retrato de uma abóbora "senhora", com laço
      const g = c.createRadialGradient(W / 2, H * 0.45, 20, W / 2, H * 0.5, H * 0.6);
      g.addColorStop(0, '#6b3a5c');
      g.addColorStop(1, '#2c1a33');
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.fillStyle = css(P.abobora);
      for (const [dx, rx] of [[-0.2, 0.16], [0.2, 0.16], [-0.08, 0.18], [0.08, 0.18], [0, 0.18]] as const) {
        c.beginPath();
        c.ellipse(W * (0.5 + dx), H * 0.52, W * rx, H * 0.22, 0, 0, Math.PI * 2);
        c.fill();
      }
      c.strokeStyle = css(P.aboboraFunda);
      c.lineWidth = 3;
      for (const dx of [-0.22, -0.08, 0.08, 0.22]) {
        c.beginPath();
        c.ellipse(W * (0.5 + dx * 0.6), H * 0.52, W * 0.08, H * 0.21, 0, Math.PI * 0.6, Math.PI * 1.4);
        c.stroke();
      }
      c.fillStyle = css(P.aboboraCabinho);
      c.fillRect(W * 0.47, H * 0.24, W * 0.06, H * 0.08);
      // o laço roxo
      c.fillStyle = '#8a55c4';
      c.beginPath();
      c.moveTo(W * 0.5, H * 0.31);
      c.lineTo(W * 0.36, H * 0.25);
      c.lineTo(W * 0.36, H * 0.37);
      c.closePath();
      c.moveTo(W * 0.5, H * 0.31);
      c.lineTo(W * 0.64, H * 0.25);
      c.lineTo(W * 0.64, H * 0.37);
      c.closePath();
      c.fill();
      for (const o of olhos) brancoDoOlho(c, o, 14, 16, '#fff6dc');
      c.strokeStyle = '#4a2010';
      c.lineWidth = 4;
      c.beginPath();
      c.arc(W * 0.5, H * 0.58, 22, 0.25, Math.PI - 0.25);
      c.stroke();
      // a gola de renda
      c.fillStyle = '#f3e6c8';
      for (let k = 0; k < 9; k++) {
        c.beginPath();
        c.arc(W * (0.3 + k * 0.05), H * 0.76, 9, 0, Math.PI);
        c.fill();
      }
    } else if (tema === 'gato') {
      ceu(c, 0x253060);
      // a lua grande e o gato preto sentado na frente dela
      c.fillStyle = css(P.luaDoQuadro);
      c.beginPath();
      c.arc(W * 0.5, H * 0.45, W * 0.36, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#1d1a24';
      c.beginPath();
      c.ellipse(W * 0.5, H * 0.75, W * 0.2, H * 0.17, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(W * 0.5, H * 0.5, W * 0.14, 0, Math.PI * 2);
      c.fill();
      for (const s of [-1, 1]) {
        c.beginPath();
        c.moveTo(W * (0.5 + s * 0.13), H * 0.47);
        c.lineTo(W * (0.5 + s * 0.12), H * 0.36);
        c.lineTo(W * (0.5 + s * 0.04), H * 0.42);
        c.fill();
      }
      // o rabo enrolado
      c.strokeStyle = '#1d1a24';
      c.lineWidth = 10;
      c.beginPath();
      c.moveTo(W * 0.66, H * 0.86);
      c.bezierCurveTo(W * 0.86, H * 0.86, W * 0.86, H * 0.62, W * 0.74, H * 0.62);
      c.stroke();
      for (const o of olhos) brancoDoOlho(c, o, 9, 11, '#ffd94a');
      c.fillStyle = css(P.bochechaDeBoneco);
      c.beginPath();
      c.arc(W * 0.5, H * 0.555, 3.5, 0, Math.PI * 2);
      c.fill();
    } else {
      ceu(c, 0x1f2348);
      // a casa assombrada de janelas acesas (as duas de cima são os olhos)
      c.fillStyle = '#3b3050';
      c.fillRect(W * 0.22, H * 0.4, W * 0.56, H * 0.5);
      c.beginPath();
      c.moveTo(W * 0.16, H * 0.42);
      c.lineTo(W * 0.5, H * 0.16);
      c.lineTo(W * 0.84, H * 0.42);
      c.fill();
      c.fillStyle = '#2a2238';
      c.fillRect(W * 0.62, H * 0.18, W * 0.07, H * 0.14);
      for (const o of olhos) brancoDoOlho(c, o, 16, 18, '#ffd36e');
      c.fillStyle = '#ffd36e';
      c.fillRect(W * 0.44, H * 0.72, W * 0.12, H * 0.18);
      c.fillStyle = '#2a2238';
      c.fillRect(W * 0.495, H * 0.72, W * 0.01, H * 0.18);
      // o morro e a cerquinha
      c.fillStyle = '#26203a';
      c.beginPath();
      c.ellipse(W * 0.5, H * 1.02, W * 0.7, H * 0.14, 0, 0, Math.PI * 2);
      c.fill();
      // a abóbora no degrau
      c.fillStyle = css(P.abobora);
      c.beginPath();
      c.ellipse(W * 0.3, H * 0.88, 13, 10, 0, 0, Math.PI * 2);
      c.fill();
    }
    pinceladas(c);
  });
  return { tex, olhos };
}

/**
 * UM QUADRO DE OLHOS QUE SEGUEM: a moldura dourada de bisel, a pintura em
 * canvas (base no meio do quadro, a frente para `+Z`), e as pupilas, malhas
 * escuras que andam dentro do branco pintado para o lado de quem passa
 * (`olhar(ponto do mundo)`, a cada quadro). Um brilhinho branco fica parado
 * em cima de cada pupila, e é ele que dá vida ao olhar.
 */
export class QuadroComOlhos {
  readonly group = new THREE.Group();
  private readonly pupilas: Array<{ m: THREE.Object3D; x: number; y: number; anda: number }> = [];
  private readonly local = new THREE.Vector3();

  constructor(tema: TemaDoQuadro) {
    const g = this.group;
    g.name = `quadro-${tema}`;
    g.userData.peca = 'quadro-com-olhos';
    const { tex, olhos } = pintura(tema);
    // a moldura: um retângulo com o furo do quadro, extrudado com bisel
    const borda = 0.07;
    const fora = new THREE.Shape();
    fora.moveTo(-L_QUADRO / 2 - borda, -A_QUADRO / 2 - borda);
    fora.lineTo(L_QUADRO / 2 + borda, -A_QUADRO / 2 - borda);
    fora.lineTo(L_QUADRO / 2 + borda, A_QUADRO / 2 + borda);
    fora.lineTo(-L_QUADRO / 2 - borda, A_QUADRO / 2 + borda);
    fora.lineTo(-L_QUADRO / 2 - borda, -A_QUADRO / 2 - borda);
    const dentro = new THREE.Path();
    dentro.moveTo(-L_QUADRO / 2, -A_QUADRO / 2);
    dentro.lineTo(-L_QUADRO / 2, A_QUADRO / 2);
    dentro.lineTo(L_QUADRO / 2, A_QUADRO / 2);
    dentro.lineTo(L_QUADRO / 2, -A_QUADRO / 2);
    dentro.lineTo(-L_QUADRO / 2, -A_QUADRO / 2);
    fora.holes.push(dentro);
    const moldura = new THREE.ExtrudeGeometry(fora, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.018, bevelSegments: 2 });
    por(g, moldura, toon(P.molduraDourada));
    // o filete escuro de dentro da moldura e as quatro rosetas dos cantos
    const filete = toon(P.molduraDouradaEscura);
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
      por(g, new THREE.SphereGeometry(0.026, 8, 6), filete, x * (L_QUADRO / 2 + borda / 2), y * (A_QUADRO / 2 + borda / 2), 0.065);
    }
    // a pintura, um tico atrás da face da moldura
    por(g, new THREE.PlaneGeometry(L_QUADRO, A_QUADRO), toon(0xffffff, { mapa: tex }), 0, 0, 0.012);
    // as pupilas e o brilho
    const brilho = toon(0xffffff, { glow: 0.5 });
    for (const o of olhos) {
      const x = (o.u - 0.5) * L_QUADRO;
      const y = (o.v - 0.5) * A_QUADRO;
      const pupila = new THREE.Group();
      pupila.name = 'pupila';
      pupila.position.set(x, y, 0.016);
      por(pupila, new THREE.CircleGeometry(o.r * L_QUADRO, 14), toon(o.cor));
      por(pupila, new THREE.CircleGeometry(o.r * L_QUADRO * 0.32, 8), brilho, -o.r * L_QUADRO * 0.3, o.r * L_QUADRO * 0.35, 0.001);
      g.add(pupila);
      this.pupilas.push({ m: pupila, x, y, anda: o.anda * L_QUADRO });
    }
    fundir(g);
  }

  /** as pupilas viram para `alvo` (um ponto do mundo: o peito de quem joga) */
  olhar(alvo: THREE.Vector3): void {
    this.local.copy(alvo);
    this.group.worldToLocal(this.local);
    for (const p of this.pupilas) {
      const dx = this.local.x - p.x;
      const dy = this.local.y - p.y;
      const dz = Math.max(0.3, this.local.z);
      const len = Math.hypot(dx, dy, dz);
      // a pupila anda para o lado de quem está ali (inteira, se a pessoa está bem de lado)
      let ox = (dx / len) * p.anda * 1.9;
      let oy = (dy / len) * p.anda * 1.9;
      const r = Math.hypot(ox, oy);
      if (r > p.anda) {
        ox *= p.anda / r;
        oy *= p.anda / r;
      }
      p.m.position.x += (p.x + ox - p.m.position.x) * 0.15;
      p.m.position.y += (p.y + oy - p.m.position.y) * 0.15;
    }
  }
}

// ============================================================ a arandela de vela

/** uma arandela de latão na parede (a frente para `+Z`, base no meio da placa): a vela, a chama, o halo e a luz na parede */
export function arandela(): { group: THREE.Group; chama: THREE.Object3D } {
  const g = new THREE.Group();
  g.userData.peca = 'arandela';
  const latao = toon(P.relogioLatao);
  const placa = new THREE.Shape();
  placa.absellipse(0, 0, 0.07, 0.12, 0, Math.PI * 2, false, 0);
  por(g, new THREE.ExtrudeGeometry(placa, { depth: 0.015, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.006, bevelSegments: 1, curveSegments: 14 }), latao);
  por(g, galho([new THREE.Vector3(0, -0.04, 0.02), new THREE.Vector3(0, -0.08, 0.1), new THREE.Vector3(0, -0.02, 0.18)], 0.012, 0.01, 8, 6), latao);
  por(g, new THREE.CylinderGeometry(0.05, 0.035, 0.03, 12), latao, 0, -0.015, 0.18);
  por(g, new THREE.CylinderGeometry(0.022, 0.024, 0.13, 10), toon(P.aboboraCreme), 0, 0.065, 0.18);
  // o pingo de cera escorrido
  por(g, new THREE.SphereGeometry(0.012, 6, 4), toon(P.aboboraCreme), 0.018, 0.1, 0.18);
  const chama = por(g, new THREE.SphereGeometry(0.02, 8, 6), toon(P.aboboraVela, { glow: 1 }), 0, 0.155, 0.18);
  chama.name = 'chama-da-arandela';
  chama.scale.set(0.8, 1.6, 0.8);
  const halo = haloDeLampada(0.55, P.luzDeAbobora, 0.55);
  halo.position.set(0, 0.16, 0.19);
  g.add(halo);
  // a luz que a vela joga na parede atrás dela
  const leque = pocaDeLuz(0.55, P.luzDeAbobora, 0.3, true);
  leque.position.set(0, 0.12, 0.004);
  g.add(leque);
  return { group: fundir(g), chama };
}

// ============================================================ o relógio de pêndulo

/**
 * O RELÓGIO DE PÊNDULO: caixa alta de madeira escura de quina macia, o
 * capitel em arco com a lua, o mostrador creme em canvas (os números e um
 * morceguinho no meio), os ponteiros e, atrás do vidro da porta, o pêndulo
 * de latão balançando (`pendulo`, grupo com nome). Base no chão, frente `+Z`.
 */
export class RelogioDePendulo {
  readonly group = new THREE.Group();
  private readonly pendulo = new THREE.Group();
  private readonly ponteiros = new THREE.Group();
  private tempo = 0;
  private batida = 0;

  constructor() {
    const g = this.group;
    g.name = 'relogio-de-pendulo';
    g.userData.peca = 'relogio-de-pendulo';
    const madeira = toon(0xffffff, { mapa: veioDeMadeira(0.8) });
    const madeiraCor = toon(P.relogioMadeira);
    const latao = toon(P.relogioLatao);
    // o pé, o corpo e a cabeça
    por(g, macia(0.66, 0.18, 0.44, 0.02), madeiraCor, 0, 0.09, 0);
    por(g, macia(0.54, 1.5, 0.36, 0.02), madeiraCor, 0, 0.93, 0);
    por(g, macia(0.66, 0.62, 0.42, 0.025), madeiraCor, 0, 1.97, 0);
    // o capitel em arco
    const capitel = new THREE.Shape();
    capitel.moveTo(-0.36, 0);
    capitel.lineTo(0.36, 0);
    capitel.lineTo(0.36, 0.08);
    capitel.quadraticCurveTo(0.2, 0.08, 0.12, 0.2);
    capitel.quadraticCurveTo(0, 0.32, -0.12, 0.2);
    capitel.quadraticCurveTo(-0.2, 0.08, -0.36, 0.08);
    capitel.lineTo(-0.36, 0);
    const geoCapitel = new THREE.ExtrudeGeometry(capitel, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 1, curveSegments: 10 });
    geoCapitel.translate(0, 2.28, -0.2);
    por(g, geoCapitel, madeiraCor);
    por(g, new THREE.SphereGeometry(0.035, 10, 8), latao, 0, 2.62, 0);
    // a porta da caixa: a moldura de madeira com veio e o vidro escuro do pêndulo
    por(g, macia(0.42, 1.12, 0.03, 0.01), madeira, 0, 0.98, 0.18);
    por(g, new THREE.PlaneGeometry(0.3, 0.92), toon(0x2a2236, { opacity: 0.85 }), 0, 1.0, 0.197);
    por(g, new THREE.SphereGeometry(0.018, 8, 6), latao, 0.17, 1.0, 0.205);
    // o mostrador
    const mostrador = canvasComLetra(256, 256, (c) => {
      c.fillStyle = css(P.relogioDePenduloMostrador);
      c.beginPath();
      c.arc(128, 128, 126, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = css(P.relogioLatao);
      c.lineWidth = 8;
      c.stroke();
      c.fillStyle = '#3a2a24';
      c.font = `700 30px ${FONTE}`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      for (let h = 1; h <= 12; h++) {
        const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
        c.fillText(String(h), 128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96);
      }
      // o morceguinho no meio
      c.fillStyle = '#5b3a7a';
      c.beginPath();
      c.ellipse(128, 168, 10, 8, 0, 0, Math.PI * 2);
      c.fill();
      for (const s of [-1, 1]) {
        c.beginPath();
        c.moveTo(128 + s * 8, 166);
        c.quadraticCurveTo(128 + s * 26, 150, 128 + s * 34, 166);
        c.quadraticCurveTo(128 + s * 24, 162, 128 + s * 20, 172);
        c.quadraticCurveTo(128 + s * 14, 166, 128 + s * 8, 172);
        c.fill();
      }
    });
    por(g, new THREE.CircleGeometry(0.22, 28), toon(0xffffff, { mapa: mostrador }), 0, 2.0, 0.212);
    por(g, new THREE.TorusGeometry(0.225, 0.016, 6, 28), latao, 0, 2.0, 0.212);
    // os ponteiros (meia-noite menos cinco: quase a hora do susto)
    const ponteiros = this.ponteiros;
    ponteiros.name = 'ponteiros';
    ponteiros.position.set(0, 2.0, 0.222);
    g.add(ponteiros);
    const ferro = toon(P.portaoLaranjaFerro);
    const hora = por(ponteiros, quina(0.018, 0.12, 0.006, 0.002), ferro, 0, 0.055, 0);
    hora.rotation.z = 0.12;
    const minuto = por(ponteiros, quina(0.012, 0.17, 0.006, 0.002), ferro, 0, 0.08, 0.004);
    minuto.name = 'minuto';
    minuto.rotation.z = 0.5;
    por(ponteiros, new THREE.SphereGeometry(0.016, 8, 6), latao, 0, 0, 0.006);
    // o pêndulo: a haste e o disco de latão, atrás do vidro
    const pendulo = this.pendulo;
    pendulo.name = 'pendulo';
    pendulo.position.set(0, 1.52, 0.1);
    g.add(pendulo);
    por(pendulo, quina(0.016, 0.62, 0.01, 0.003), latao, 0, -0.31, 0);
    por(pendulo, new THREE.CylinderGeometry(0.08, 0.08, 0.018, 20).rotateX(Math.PI / 2), latao, 0, -0.66, 0);
    fundir(g);
  }

  /** o BONG: os ponteiros pulam para a meia-noite e a cabeça treme um tico */
  bater(): void {
    this.batida = 1;
  }

  update(dt: number): void {
    this.tempo += dt;
    this.pendulo.rotation.z = Math.sin(this.tempo * (Math.PI * 2) / 1.6) * 0.2;
    if (this.batida > 0) {
      this.batida = Math.max(0, this.batida - dt * 1.4);
      const k = this.batida;
      this.group.rotation.z = Math.sin(this.tempo * 40) * 0.012 * k;
      this.ponteiros.rotation.z = -0.5 * (1 - k);
    }
  }
}

// ============================================================ os morceguinhos no fio

/** o morceguinho de feltro: o corpinho, as asas abertas e as orelhas (a frente para `+Z`, o alto do corpo na origem) */
let geoMorceguinho: THREE.BufferGeometry | null = null;
function morceguinho(): THREE.BufferGeometry {
  if (geoMorceguinho) return geoMorceguinho;
  const f = new THREE.Shape();
  f.moveTo(0, -0.02);
  f.quadraticCurveTo(0.03, -0.01, 0.05, -0.05);
  f.quadraticCurveTo(0.09, -0.02, 0.15, -0.07);
  f.quadraticCurveTo(0.14, -0.12, 0.15, -0.16);
  f.quadraticCurveTo(0.11, -0.13, 0.09, -0.16);
  f.quadraticCurveTo(0.07, -0.12, 0.05, -0.15);
  f.quadraticCurveTo(0.03, -0.12, 0, -0.14);
  f.quadraticCurveTo(-0.03, -0.12, -0.05, -0.15);
  f.quadraticCurveTo(-0.07, -0.12, -0.09, -0.16);
  f.quadraticCurveTo(-0.11, -0.13, -0.15, -0.16);
  f.quadraticCurveTo(-0.14, -0.12, -0.15, -0.07);
  f.quadraticCurveTo(-0.09, -0.02, -0.05, -0.05);
  f.quadraticCurveTo(-0.03, -0.01, 0, -0.02);
  const asas = new THREE.ExtrudeGeometry(f, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1, curveSegments: 6 });
  asas.translate(0, 0, -0.006);
  const corpo = new THREE.SphereGeometry(0.045, 10, 8);
  corpo.scale(1, 1.15, 0.8);
  corpo.translate(0, -0.075, 0.004);
  const orelhas: THREE.BufferGeometry[] = [];
  for (const s of [-1, 1]) {
    const o = new THREE.ConeGeometry(0.016, 0.04, 5);
    o.translate(s * 0.022, -0.02, 0.004);
    orelhas.push(o);
  }
  // tudo numa geometria (sem uv: o feltro é cor lisa)
  const partes = [asas, corpo, ...orelhas].map((p) => {
    const n = p.index ? p.toNonIndexed() : p;
    n.deleteAttribute('uv');
    return n;
  });
  const pos: number[] = [];
  const nor: number[] = [];
  for (const p of partes) {
    pos.push(...(p.getAttribute('position').array as Float32Array));
    nor.push(...(p.getAttribute('normal').array as Float32Array));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geoMorceguinho = geo;
  return geo;
}

/**
 * OS MORCEGUINHOS NO FIO: um cordão que corre rente à parede, de `a` a `b`
 * (com uma barriguinha), e morceguinhos de feltro pendurados nele, cada um
 * num pêndulo próprio (o corpo, os olhinhos e o barbante em lote). Quem
 * passa embaixo dá um empurrão (`passou(x, z)`), e eles balançam e voltam
 * devagar. A frente deles é `normal` (para fora da parede).
 */
export class MorceguinhosNoFio {
  readonly group = new THREE.Group();
  private readonly corpos: THREE.InstancedMesh;
  private readonly olhos: THREE.InstancedMesh;
  private readonly fios: THREE.InstancedMesh;
  private readonly lista: Array<{ p: THREE.Vector3; fio: number; ang: number; vel: number; fase: number; giro: number }> = [];
  private readonly eixo = new THREE.Vector3();
  private readonly giroDaFrente: number;
  private tempo = 0;

  constructor(a: THREE.Vector3, b: THREE.Vector3, quantos: number, normal: THREE.Vector3, semente = 1) {
    const g = this.group;
    g.name = 'morceguinhos-no-fio';
    g.userData.peca = 'morceguinhos-no-fio';
    const rnd = sorteio(4400 + semente);
    // o cordão
    const pontos: THREE.Vector3[] = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const p = a.clone().lerp(b, t);
      p.y -= Math.sin(t * Math.PI) * 0.12;
      pontos.push(p);
    }
    const cordao = new THREE.Mesh(galho(pontos, 0.008, 0.008, 30, 5), toon(P.galhoSeco));
    g.add(cordao);
    const curva = new THREE.CatmullRomCurve3(pontos);
    this.eixo.subVectors(b, a).normalize();
    this.giroDaFrente = Math.atan2(normal.x, normal.z);
    for (let i = 0; i < quantos; i++) {
      const p = curva.getPointAt((i + 0.5) / quantos);
      this.lista.push({ p, fio: 0.07 + rnd() * 0.12, ang: 0, vel: 0, fase: rnd() * Math.PI * 2, giro: (rnd() - 0.5) * 0.6 });
    }
    this.corpos = new THREE.InstancedMesh(morceguinho(), toon(P.corvo), quantos);
    this.corpos.name = 'corpos-dos-morceguinhos';
    const olho = new THREE.SphereGeometry(0.009, 6, 4);
    this.olhos = new THREE.InstancedMesh(olho, toon(0xffffff, { glow: 0.6 }), quantos * 2);
    this.olhos.name = 'olhos-dos-morceguinhos';
    this.fios = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.002, 0.002, 1, 3).translate(0, -0.5, 0), toon(P.aramePreto), quantos);
    this.fios.name = 'fios-dos-morceguinhos';
    for (const im of [this.corpos, this.olhos, this.fios]) {
      im.frustumCulled = false;
      im.userData.semSombra = true;
      g.add(im);
    }
    this.update(0);
  }

  /** quem passa embaixo dá um empurrão nos de perto */
  passou(x: number, z: number, forca = 1): void {
    for (const m of this.lista) {
      const d = Math.hypot(m.p.x - x, m.p.z - z);
      if (d < 1.1) m.vel += (1.1 - d) * 2.2 * forca * (m.fase > Math.PI ? 1 : -1);
    }
  }

  update(dt: number): void {
    this.tempo += dt;
    const q = new THREE.Quaternion();
    const qGiro = new THREE.Quaternion();
    const m = new THREE.Matrix4();
    const esc = new THREE.Vector3(1, 1, 1);
    const baixo = new THREE.Vector3();
    const olho = new THREE.Vector3();
    this.lista.forEach((b, i) => {
      // o pêndulo amortecido, e um balanço de ar parado bem pequeno
      b.vel += (-14 * b.ang - 1.6 * b.vel) * dt;
      b.ang += b.vel * dt;
      const ang = b.ang + Math.sin(this.tempo * 1.3 + b.fase) * 0.04;
      // o giro em volta do cordão (balança para longe e perto da parede)
      q.setFromAxisAngle(this.eixo, ang);
      qGiro.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.giroDaFrente + b.giro + Math.sin(this.tempo * 0.9 + b.fase) * 0.15);
      // o barbante
      baixo.set(0, -b.fio, 0).applyQuaternion(q).add(b.p);
      m.compose(b.p, q, esc.set(1, b.fio, 1));
      this.fios.setMatrixAt(i, m);
      // o morceguinho, no fim do barbante
      const qb = q.clone().multiply(qGiro);
      m.compose(baixo, qb, esc.set(1, 1, 1));
      this.corpos.setMatrixAt(i, m);
      for (const s of [-1, 1]) {
        olho.set(s * 0.016, -0.065, 0.04).applyQuaternion(qb).add(baixo);
        m.compose(olho, qb, esc.set(1, 1, 1));
        this.olhos.setMatrixAt(i * 2 + (s > 0 ? 1 : 0), m);
      }
    });
    this.corpos.instanceMatrix.needsUpdate = true;
    this.olhos.instanceMatrix.needsUpdate = true;
    this.fios.instanceMatrix.needsUpdate = true;
  }
}

// ============================================================ a cozinha

/**
 * O FOGÃO A LENHA: o corpo de tijolinho, a chapa de ferro com as bocas, a
 * fornalha com o fogo aceso (o `fogo`, chamas que tremem), a coifa de
 * tijolo subindo até o alto da parede, e em cima o CALDEIRÃO borbulhando
 * verde (`PocaoBorbulhando`). Base no chão, frente `+Z`, encostado na parede
 * do fundo (`z` negativo).
 */
export class FogaoALenha {
  readonly group = new THREE.Group();
  private readonly chamas: THREE.Object3D[] = [];
  private readonly pocao: PocaoBorbulhando;
  private tempo = 0;
  /** onde fica o caldeirão (no referencial do fogão) */
  static readonly CALDEIRAO = new THREE.Vector3(0.28, 0.86, 0.02);

  constructor() {
    const g = this.group;
    g.name = 'fogao-a-lenha';
    g.userData.peca = 'fogao-a-lenha';
    const tijolo = toon(0xffffff, { mapa: tijolinho(0.7, P.fogaoTijolo) });
    const ferro = toon(P.fogaoFerro);
    const L = 1.4;
    const A = 0.8;
    const F = 0.78;
    por(g, uvDeParede(quina(L, A, F, 0.02), 0, A / 2, 0), tijolo, 0, A / 2, 0);
    // a chapa, com as duas bocas e o puxador
    por(g, quina(L + 0.06, 0.06, F + 0.06, 0.012), ferro, 0, A + 0.03, 0);
    for (const x of [-0.36, 0.28]) por(g, new THREE.TorusGeometry(0.17, 0.018, 6, 22).rotateX(Math.PI / 2), toon(P.portaoLaranjaFerro), x, A + 0.065, 0.02);
    por(g, new THREE.CylinderGeometry(0.012, 0.012, L - 0.1, 6).rotateZ(Math.PI / 2), toon(P.relogioLatao), 0, A + 0.02, F / 2 + 0.07);
    // a fornalha: o buraco escuro, a portinhola de ferro aberta e o fogo
    por(g, quina(0.48, 0.34, 0.03, 0.01), toon(P.aboboraOco), -0.32, 0.36, F / 2 + 0.002);
    const portinhola = por(g, quina(0.46, 0.32, 0.025, 0.008), ferro, -0.62, 0.36, F / 2 + 0.22);
    portinhola.rotation.y = -1.25;
    por(g, new THREE.SphereGeometry(0.02, 6, 4), toon(P.relogioLatao), -0.72, 0.36, F / 2 + 0.43);
    const fogo = new THREE.Group();
    fogo.name = 'fogo';
    fogo.position.set(-0.32, 0.22, F / 2 - 0.04);
    g.add(fogo);
    // a lenha queimando e as chamas (cones acesos)
    for (const [x, gira] of [[-0.08, 0.3], [0.08, -0.4]] as const) {
      const tora = por(fogo, new THREE.CylinderGeometry(0.035, 0.035, 0.3, 8).rotateZ(Math.PI / 2), toon(P.lenha), x * 0.3, 0.03, 0);
      tora.rotation.y = gira;
    }
    por(fogo, new THREE.SphereGeometry(0.1, 10, 6).scale(1.6, 0.35, 1), toon(P.brasa, { glow: 1 }), 0, 0.02, 0);
    for (const [x, h, cor] of [[-0.09, 0.16, P.brasa], [0.0, 0.22, P.fogo], [0.1, 0.15, P.fogo], [0.04, 0.12, P.aboboraVela]] as const) {
      const chama = por(fogo, new THREE.ConeGeometry(0.045, h, 8).translate(0, h / 2, 0), toon(cor, { glow: 1 }), x, 0.04, 0.02 * Math.sign(x));
      this.chamas.push(chama);
    }
    const haloFogo = haloDeLampada(0.9, P.fogo, 0.55);
    haloFogo.position.set(-0.32, 0.38, F / 2 + 0.1);
    g.add(haloFogo);
    const pocaFogo = pocaDeLuz(1.3, P.fogo, 0.4);
    pocaFogo.position.set(-0.32, 0.02, F / 2 + 0.8);
    g.add(pocaFogo);
    // a coifa: o tijolo subindo, mais estreito, com a borda de ferro
    por(g, uvDeParede(quina(1.1, 0.5, 0.5, 0.02), 0, 1.75, -0.14), tijolo, 0, 1.75, -0.14);
    por(g, uvDeParede(quina(0.6, 1.1, 0.4, 0.02), 0, 2.55, -0.19), tijolo, 0, 2.55, -0.19);
    por(g, quina(1.16, 0.05, 0.56, 0.01), ferro, 0, 1.5, -0.14);
    // a prateleirinha da coifa, com a chaleira e o pote de sal
    por(g, quina(1.0, 0.04, 0.16, 0.01), toon(P.lambriFriso), 0, 2.02, 0.17);
    // o caldeirão com a poção verde
    const cald = caldeirao();
    cald.scale.setScalar(0.85);
    cald.position.copy(FogaoALenha.CALDEIRAO);
    g.add(fundir(cald));
    this.pocao = new PocaoBorbulhando(0.24, P.pocaoVerde, 0.48);
    this.pocao.group.position.copy(FogaoALenha.CALDEIRAO);
    this.pocao.group.scale.setScalar(0.85);
    g.add(this.pocao.group);
    // a pilha de lenha do lado
    const toras = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 10).rotateZ(Math.PI / 2), toon(P.lenha), 6);
    toras.name = 'lenha-empilhada';
    const m = new THREE.Matrix4();
    let k = 0;
    for (const [linha, quantas] of [[0, 3], [1, 2], [2, 1]] as const) {
      for (let i = 0; i < quantas; i++) {
        m.makeRotationY(Math.PI / 2 + (i - 1) * 0.05).setPosition(L / 2 + 0.24, 0.06 + linha * 0.105, 0.2 - (i - (quantas - 1) / 2) * 0.125);
        toras.setMatrixAt(k++, m);
      }
    }
    g.add(toras);
    fundir(g);
  }

  update(dt: number): void {
    this.tempo += dt;
    this.chamas.forEach((c, i) => {
      const t = this.tempo * (7 + i * 1.7) + i;
      c.scale.set(1 + Math.sin(t * 1.3) * 0.12, 1 + Math.sin(t) * 0.22 + Math.sin(t * 2.7) * 0.08, 1);
    });
    this.pocao.update(dt);
  }
}

/** a PRATELEIRA DE POÇÕES: duas tábuas em mão-francesa, os vidros acesos de três feitios (em lote) e as rolhas. Base no meio da tábua de baixo, frente `+Z`, encostada na parede */
export function prateleiraDePocoes(largura = 1.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'prateleira-de-pocoes';
  const madeira = toon(0xffffff, { mapa: veioDeMadeira(0.8) });
  const rnd = sorteio(6611);
  const feitios: THREE.Vector2[][] = [
    [[0, 0], [0.06, 0], [0.065, 0.1], [0.04, 0.15], [0.02, 0.17], [0.02, 0.2], [0, 0.2]],
    [[0, 0], [0.045, 0], [0.05, 0.12], [0.05, 0.2], [0.018, 0.24], [0.018, 0.27], [0, 0.27]],
    [[0, 0], [0.075, 0], [0.08, 0.06], [0.06, 0.1], [0.025, 0.12], [0.025, 0.14], [0, 0.14]],
  ].map((p) => p.map(([r, y]) => new THREE.Vector2(r, y)));
  const altura = (f: number): number => feitios[f][feitios[f].length - 1].y;
  const cores = [P.pocaoVerde, P.pocaoRoxa, P.pocaoRosa, P.pocaoAzul, P.pocaoLaranja];
  const lista: Array<{ f: number; x: number; y: number; cor: number }> = [];
  for (const y of [0, 0.46]) {
    por(g, macia(largura, 0.04, 0.26, 0.01), madeira, 0, y, 0.13);
    // as mãos-francesas
    for (const s of [-1, 1]) {
      const m = new THREE.Shape();
      m.moveTo(0, 0);
      m.lineTo(0, -0.18);
      m.quadraticCurveTo(0.02, -0.04, 0.2, 0);
      m.lineTo(0, 0);
      const geo = new THREE.ExtrudeGeometry(m, { depth: 0.03, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);
      por(g, geo, toon(P.relogioMadeira), s * (largura / 2 - 0.12) + 0.015, y - 0.02, 0.0);
    }
    let x = -largura / 2 + 0.1;
    while (x < largura / 2 - 0.1) {
      const f = Math.floor(rnd() * 3);
      lista.push({ f, x, y: y + 0.02, cor: cores[Math.floor(rnd() * cores.length)] });
      x += 0.15 + rnd() * 0.06;
    }
  }
  const m = new THREE.Matrix4();
  const cor = new THREE.Color();
  const rolhas = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.02, 0.017, 0.035, 8), toon(P.rolhaDePocao), lista.length);
  rolhas.name = 'rolhas';
  for (let f = 0; f < 3; f++) {
    const deste = lista.filter((p) => p.f === f);
    if (!deste.length) continue;
    const geo = new THREE.LatheGeometry(feitios[f], 14);
    geo.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: geo.getAttribute('position').count }, (_, i) => {
      // mais escuro no fundo, aceso em cima (a poção brilha de dentro)
      const y = geo.getAttribute('position').getY(i) / altura(f);
      const k = 0.55 + 0.45 * Math.min(1, y * 1.4);
      return [k, k, k];
    }).flat(), 3));
    const im = new THREE.InstancedMesh(geo, acesoPorVertice(), deste.length);
    im.name = `vidros-${f}`;
    deste.forEach((p, i) => {
      m.makeTranslation(p.x, p.y, 0.14 + (rnd() - 0.5) * 0.06);
      im.setMatrixAt(i, m);
      im.setColorAt(i, cor.setHex(p.cor));
    });
    g.add(im);
  }
  lista.forEach((p, i) => {
    m.makeTranslation(p.x, p.y + altura(p.f) + 0.012, 0.14);
    rolhas.setMatrixAt(i, m);
  });
  g.add(rolhas);
  return fundir(g);
}

/** TRÊS VASSOURAS de bruxa encostadas na parede (cabo de galho, palha amarrada). Base no chão, frente `+Z` */
export function vassourasEncostadas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'vassouras';
  const madeira = toon(P.bruxoCabo);
  const palha = toon(P.bruxoPalha, { doubleSide: true });
  const cordao = toon(P.bruxoCordao);
  for (const [x, inclina, alto] of [[-0.3, 0.12, 1.55], [0.02, -0.06, 1.7], [0.32, 0.16, 1.45]] as const) {
    const v = new THREE.Group();
    v.position.set(x, 0, 0.14);
    v.rotation.z = inclina;
    v.rotation.x = -0.12;
    g.add(v);
    por(v, galho([new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0.015, alto * 0.6, 0), new THREE.Vector3(-0.01, alto, 0)], 0.018, 0.014, 12, 6), madeira);
    // a palha: um cone aberto em cima de outro (a saia e o miolo), e as duas amarras
    por(v, new THREE.CylinderGeometry(0.035, 0.13, 0.42, 14, 1, true), palha, 0, 0.21, 0);
    por(v, new THREE.CylinderGeometry(0.03, 0.09, 0.38, 10, 1, true), palha, 0.01, 0.2, 0.01).rotation.y = 0.4;
    for (const y of [0.36, 0.31]) por(v, new THREE.TorusGeometry(0.038 + (0.36 - y) * 0.3, 0.008, 5, 14).rotateX(Math.PI / 2), cordao, 0, y, 0);
  }
  return fundir(g);
}

/** a RÉSTIA DE ABÓBORAS pendurada: o barbante na parede e as abóborinhas descendo por ele. Origem no prego, frente `+Z` */
export function restiaDeAboboras(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'restia-de-aboboras';
  por(g, galho([new THREE.Vector3(0, 0, 0.03), new THREE.Vector3(0.02, -0.4, 0.06), new THREE.Vector3(-0.01, -0.85, 0.07)], 0.008, 0.008, 10, 5), toon(P.espantalhoCorda));
  por(g, new THREE.SphereGeometry(0.015, 6, 4), toon(P.portaoLaranjaFerro), 0, 0, 0.02);
  const lote = new LoteDeAboboras();
  const cores = [P.abobora, P.aboboraClara, P.abobora, P.aboboraFunda, P.aboboraClara];
  for (let i = 0; i < 5; i++) {
    lote.por({ x: (i % 2 ? 0.05 : -0.05), y: -0.16 - i * 0.16, z: 0.09, raio: 0.065 + (i % 3) * 0.01, simples: true, cor: cores[i], giro: i, tomba: (i % 2 ? 0.3 : -0.3) });
  }
  g.add(lote.montar());
  return g;
}

/** a JANELA REDONDA da cozinha com a noite lá fora (a lua, as estrelas, um morcego): base no meio, frente `+Z` */
export function janelaComLua(raio = 0.42): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'janela-com-lua';
  const tex = canvasComLetra(256, 256, (c) => {
    const gr = c.createRadialGradient(170, 80, 10, 128, 128, 180);
    gr.addColorStop(0, '#5a5aa0');
    gr.addColorStop(1, css(P.ceuDaJanela));
    c.fillStyle = gr;
    c.fillRect(0, 0, 256, 256);
    const rnd = sorteio(2024);
    c.fillStyle = 'rgba(255,250,215,0.9)';
    for (let k = 0; k < 30; k++) {
      c.beginPath();
      c.arc(rnd() * 256, rnd() * 256, 0.8 + rnd() * 1.6, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = css(P.luaDoQuadro);
    c.beginPath();
    c.arc(170, 78, 34, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(200,190,150,0.5)';
    for (const [x, y, r] of [[160, 70, 6], [182, 90, 4], [172, 60, 3]] as const) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
    // o morcego passando na frente da lua
    c.fillStyle = '#1d1828';
    c.beginPath();
    c.moveTo(150, 100);
    c.quadraticCurveTo(140, 88, 126, 96);
    c.quadraticCurveTo(136, 98, 140, 106);
    c.quadraticCurveTo(146, 102, 150, 108);
    c.quadraticCurveTo(154, 102, 160, 106);
    c.quadraticCurveTo(164, 98, 174, 96);
    c.quadraticCurveTo(160, 88, 150, 100);
    c.fill();
    // a copa das árvores lá embaixo
    c.fillStyle = '#18182c';
    for (let k = 0; k < 7; k++) {
      c.beginPath();
      c.arc(k * 42, 250, 34 + (k % 3) * 8, 0, Math.PI * 2);
      c.fill();
    }
  });
  por(g, new THREE.CircleGeometry(raio, 32), toon(0xffffff, { mapa: tex, glow: 0.55 }), 0, 0, 0.005);
  const caixilho = toon(P.lambriFriso);
  por(g, new THREE.TorusGeometry(raio + 0.03, 0.045, 8, 32), caixilho, 0, 0, 0.03);
  por(g, quina(0.04, raio * 2, 0.04, 0.008), caixilho, 0, 0, 0.03);
  por(g, quina(raio * 2, 0.04, 0.04, 0.008), caixilho, 0, 0, 0.03);
  // o peitoril com uma abóborinha e uma vela apagada
  por(g, quina(raio * 1.5, 0.05, 0.16, 0.01), caixilho, 0, -raio - 0.05, 0.08);
  const lote = new LoteDeAboboras().por({ x: -0.12, y: -raio - 0.025, z: 0.1, raio: 0.07, cara: 'piscando', giro: 0 });
  g.add(lote.montar());
  return fundir(g);
}

/**
 * A MESA DA BRUXA: tampo de madeira com veio sobre pés torneados, o LIVRO DE
 * FEITIÇO aberto (as páginas curvas com a letra de mão e os rabiscos), a vela
 * no castiçal e a colher de pau. O chapéu do fantasminha é outra peça, na
 * cena. Base no chão, frente `+Z`; o tampo em `MESA_DA_BRUXA.tampo`.
 */
export const MESA_DA_BRUXA = { largura: 1.5, fundo: 0.9, tampo: 0.78 } as const;
export function mesaDaBruxa(): { group: THREE.Group; chama: THREE.Object3D } {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-da-bruxa';
  const { largura: L, fundo: F, tampo: T } = MESA_DA_BRUXA;
  const madeira = toon(0xffffff, { mapa: veioDeMadeira(0.9) });
  const madeiraCor = toon(P.mesaDaBruxa);
  por(g, macia(L, 0.07, F, 0.02), madeira, 0, T - 0.035, 0);
  por(g, macia(L - 0.14, 0.1, F - 0.14, 0.01), madeiraCor, 0, T - 0.12, 0);
  const perfil = [[0, 0], [0.04, 0], [0.045, 0.06], [0.03, 0.12], [0.035, 0.32], [0.05, 0.4], [0.03, 0.5], [0.035, 0.62], [0.045, T - 0.17], [0, T - 0.17]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const pe = new THREE.LatheGeometry(perfil, 10);
  for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) por(g, pe, madeiraCor, x * (L / 2 - 0.1), 0, z * (F / 2 - 0.1));
  // o livro aberto: a capa e as duas páginas que levantam no meio
  const livro = new THREE.Group();
  livro.position.set(-0.38, T, 0.05);
  livro.rotation.y = 0.25;
  g.add(livro);
  por(livro, quina(0.56, 0.03, 0.4, 0.008), toon(P.livroDeFeiticoCapa), 0, 0.015, 0);
  const paginas = canvasComLetra(512, 256, (c) => {
    c.fillStyle = css(P.livroPapel);
    c.fillRect(0, 0, 512, 256);
    c.fillStyle = 'rgba(120,80,40,0.12)';
    c.fillRect(248, 0, 16, 256);
    c.fillStyle = '#4a2a3a';
    c.font = `700 30px ${FONTE}`;
    c.textAlign = 'left';
    c.textBaseline = 'top';
    c.fillText('Feitiço do', 26, 18);
    c.fillText('susto fofo', 26, 50);
    c.font = `500 20px ${FONTE}`;
    const linhas = ['uma pitada de abóbora,', 'duas risadas', 'e um "BU!"', 'bem baixinho.'];
    linhas.forEach((l, i) => c.fillText(l, 30, 96 + i * 30));
    // a página da direita: o desenho de um fantasminha e estrelinhas
    c.fillStyle = '#ffffff';
    c.strokeStyle = '#4a2a3a';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(330, 210);
    c.bezierCurveTo(320, 120, 350, 70, 385, 70);
    c.bezierCurveTo(420, 70, 450, 120, 440, 210);
    c.lineTo(420, 196);
    c.lineTo(400, 212);
    c.lineTo(385, 196);
    c.lineTo(365, 212);
    c.lineTo(350, 196);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#4a2a3a';
    for (const x of [372, 398]) {
      c.beginPath();
      c.ellipse(x, 122, 6, 9, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#d7ad4f';
    for (const [x, y] of [[300, 40], [470, 60], [480, 180], [295, 160]] as const) {
      c.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
        const r = k % 2 ? 5 : 11;
        c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      }
      c.fill();
    }
  });
  const folhas = new THREE.PlaneGeometry(0.52, 0.36, 12, 1);
  folhas.rotateX(-Math.PI / 2);
  const pos = folhas.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / 0.26;
    // as páginas sobem das bordas e descem na lombada (a dobra no meio)
    pos.setY(i, 0.032 + 0.035 * Math.pow(Math.abs(x), 0.6) * (1 - Math.pow(Math.abs(x), 6) * 0.6));
  }
  folhas.computeVertexNormals();
  por(livro, folhas, toon(0xffffff, { mapa: paginas }));
  // o castiçal com a vela
  const latao = toon(P.relogioLatao);
  por(g, new THREE.CylinderGeometry(0.07, 0.08, 0.02, 14), latao, 0.1, T + 0.01, -0.25);
  por(g, new THREE.CylinderGeometry(0.012, 0.016, 0.06, 8), latao, 0.1, T + 0.05, -0.25);
  por(g, new THREE.CylinderGeometry(0.025, 0.025, 0.16, 10), toon(P.aboboraCreme), 0.1, T + 0.16, -0.25);
  const chama = por(g, new THREE.SphereGeometry(0.02, 8, 6), toon(P.aboboraVela, { glow: 1 }), 0.1, T + 0.26, -0.25);
  chama.name = 'chama-da-mesa';
  chama.scale.set(0.8, 1.6, 0.8);
  const halo = haloDeLampada(0.6, P.luzDeAbobora, 0.6);
  halo.position.set(0.1, T + 0.27, -0.25);
  g.add(halo);
  const poca = pocaDeLuz(0.75, P.luzDeAbobora, 0.35);
  poca.position.set(0.1, T + 0.003, -0.25);
  g.add(poca);
  // a colher de pau
  const colher = por(g, galho([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.12, 0.004, 0.02), new THREE.Vector3(0.26, 0.006, 0.02)], 0.009, 0.008, 6, 5), toon(P.bruxoCabo), 0.2, T + 0.012, 0.28);
  colher.rotation.y = -0.4;
  por(g, new THREE.SphereGeometry(0.035, 10, 6).scale(1.3, 0.35, 1), toon(P.bruxoCabo), 0.2, T + 0.016, 0.28);
  return { group: fundir(g), chama };
}

// ============================================================ o fantasminha de mola

/** o pano do fantasminha: um sino torneado com a barra ondulada (a frente para `+Z`) */
function geoFantasma(): THREE.BufferGeometry {
  const perfil: THREE.Vector2[] = [];
  const N = 14;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    // de baixo (a barra, aberta) até a cabeça redonda
    const y = t * 0.36;
    const r = t < 0.62 ? 0.16 + (0.62 - t) * 0.08 : 0.16 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.62) / 0.38, 2)));
    perfil.push(new THREE.Vector2(Math.max(0.0001, r), y));
  }
  perfil.reverse();
  const geo = new THREE.LatheGeometry(perfil, 28);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0.06) {
      const a = Math.atan2(pos.getZ(i), pos.getX(i));
      pos.setY(i, y + Math.sin(a * 6) * 0.018 * (1 - y / 0.06));
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * O FANTASMINHA DE MOLA, no chapéu de bruxa da mesa (a parte D do §7.1):
 * escondido, o chapéu fica quietinho no tampo. `disparar()` faz o chapéu
 * TREMER, PULAR e cair de lado, e o fantasminha sai numa mola, balançando
 * (uma mola amortecida de verdade), rindo, e fica lá fora sacudindo devagar.
 * `cutucar()` dá outro tranco. Origem no tampo, frente `+Z`.
 */
export class FantasminhaDeMola {
  readonly group = new THREE.Group();
  private readonly chapeu: THREE.Group;
  private readonly mola: THREE.Mesh;
  private readonly fantasma = new THREE.Group();
  private estado: 'escondido' | 'tremendo' | 'pulando' | 'fora' = 'escondido';
  private t = 0;
  private tempo = 0;
  /** a mola: quanto ela está esticada, e a velocidade (um oscilador amortecido) */
  private ext = 0;
  private vel = 0;

  constructor() {
    const g = this.group;
    g.name = 'fantasminha-de-mola';
    g.userData.peca = 'fantasminha-de-mola';
    this.chapeu = chapeuDeBruxa();
    this.chapeu.name = 'chapeu-do-fantasminha';
    this.chapeu.scale.setScalar(0.62);
    g.add(this.chapeu);
    // a mola: uma hélice de altura 1 (o `scale.y` estica)
    const voltas = 7;
    const pontos: THREE.Vector3[] = [];
    for (let i = 0; i <= voltas * 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      pontos.push(new THREE.Vector3(Math.cos(a) * 0.05, i / (voltas * 16), Math.sin(a) * 0.05));
    }
    this.mola = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), voltas * 16, 0.008, 5, false), toon(P.molaDeMetal));
    this.mola.name = 'mola';
    g.add(this.mola);
    // o fantasminha: o pano, os olhinhos, as bochechas, a boca de risada e os bracinhos
    const f = this.fantasma;
    f.name = 'fantasma-da-mola';
    g.add(f);
    // um tico aceso: perto do caldeirão, o verde dele deixava o pano cinza
    const pano = toon(P.fantasminhaPano, { glow: 0.3 });
    por(f, geoFantasma(), pano);
    const olho = toon(0x231a2e);
    for (const s of [-1, 1]) {
      const o = por(f, new THREE.SphereGeometry(0.026, 10, 8), olho, s * 0.05, 0.25, 0.135);
      o.scale.set(0.8, 1.15, 0.45);
      por(f, new THREE.SphereGeometry(0.008, 6, 4), toon(0xffffff, { glow: 0.6 }), s * 0.05 - 0.008, 0.262, 0.147);
      const bochecha = por(f, new THREE.SphereGeometry(0.022, 8, 6), toon(P.bochechaDeBoneco), s * 0.085, 0.21, 0.122);
      bochecha.scale.set(1, 0.55, 0.3);
      // o bracinho levantado (comemorando o susto)
      const braco = por(f, new THREE.SphereGeometry(0.04, 10, 8), pano, s * 0.17, 0.2, 0.02);
      braco.scale.set(0.65, 1.2, 0.6);
      braco.rotation.z = -s * 0.7;
    }
    // a boca aberta de risada
    const boca = por(f, new THREE.SphereGeometry(0.028, 10, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), toon(0x5a2340), 0, 0.2, 0.14);
    boca.scale.set(1, 0.9, 0.4);
    boca.rotation.x = Math.PI;
    this.posicionar();
  }

  get saiu(): boolean {
    return this.estado === 'fora' || this.estado === 'pulando';
  }

  /** começa o susto (uma vez) */
  disparar(): void {
    if (this.estado !== 'escondido') return;
    this.estado = 'tremendo';
    this.t = 0;
  }

  /** um tranco na mola (o fantasminha afunda e volta balançando) */
  cutucar(): void {
    if (this.estado !== 'fora') return;
    this.vel -= 2.4;
  }

  /** o fantasminha já fora, sem o susto (quem volta à cozinha encontra ele assim) */
  jaSaiu(): void {
    this.estado = 'fora';
    this.ext = 0.42;
    this.vel = 0;
    this.chapeuCaido(1);
  }

  private chapeuCaido(k: number): void {
    // o chapéu voa num arco e cai de lado no tampo, à direita
    const s = Math.min(1, k);
    this.chapeu.position.set(0.32 * s, Math.sin(s * Math.PI) * 0.35, 0.12 * s);
    this.chapeu.rotation.set(0.2 * s, s * 2.2, -1.25 * s);
    if (s >= 1) this.chapeu.position.y = 0.06;
  }

  private posicionar(): void {
    const e = Math.max(0, this.ext);
    const fora = this.estado === 'fora' || this.estado === 'pulando';
    this.mola.visible = fora && e > 0.02;
    this.mola.scale.set(1, Math.max(0.01, e), 1);
    this.fantasma.visible = fora;
    this.fantasma.position.set(0, e, 0);
    const cresce = Math.min(1, e / 0.15);
    this.fantasma.scale.setScalar(0.35 + 0.65 * cresce);
  }

  update(dt: number): void {
    this.tempo += dt;
    this.t += dt;
    if (this.estado === 'tremendo') {
      // o chapéu tremelica e dá pulinhos
      this.chapeu.rotation.z = Math.sin(this.t * 55) * 0.06;
      this.chapeu.position.y = Math.abs(Math.sin(this.t * 22)) * 0.02;
      if (this.t > 0.7) {
        this.estado = 'pulando';
        this.t = 0;
        this.ext = 0;
        this.vel = 4.2;
      }
    } else if (this.estado === 'pulando') {
      this.chapeuCaido(this.t / 0.55);
      if (this.t > 0.55) this.estado = 'fora';
    }
    if (this.estado === 'pulando' || this.estado === 'fora') {
      // a mola: puxa para 0,42 de altura, amortecida (passa do ponto e volta)
      const alvo = 0.42;
      this.vel += ((alvo - this.ext) * 60 - this.vel * 3.2) * dt;
      this.ext += this.vel * dt;
      // o balanço de lado, que cresce com a velocidade da mola
      this.fantasma.rotation.z = Math.sin(this.tempo * 6) * Math.min(0.35, Math.abs(this.vel) * 0.12) + Math.sin(this.tempo * 1.7) * 0.05;
      this.fantasma.rotation.y = Math.sin(this.tempo * 0.9) * 0.25;
    }
    this.posicionar();
  }
}

// ============================================================ a porta do salão

/**
 * A PORTA GRANDE DO SALÃO (a entrada da abóbora gigante): redonda em cima, de
 * tábua cor de abóbora, com o batente escuro, as dobradiças de ferro em
 * ramo, a argola e uma abóborinha esculpida em cima. Fechada (a 6c abre):
 * a folha mora na `dobradica`. Base no chão, frente `+Z`, centrada.
 */
export function portaDoSalao(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'porta-do-salao';
  const L = 1.2;
  const reto = 1.75;
  const madeira = toon(0xffffff, { mapa: tabuas('casinha:tabuas-do-salao', 0.6, 5, P.portaDoSalao, P.portaDoSalaoFundo, 3131) });
  const escura = toon(P.relogioMadeira);
  const ferro = toon(P.portaoLaranjaFerro);
  // o batente em arco (contorno sem furo: a porta toca o chão)
  const ro = L / 2 + 0.1;
  const ri = L / 2;
  const batente = new THREE.Shape();
  batente.moveTo(-ro, 0);
  batente.lineTo(-ro, reto);
  batente.absellipse(0, reto, ro, ro, Math.PI, 0, true, 0);
  batente.lineTo(ro, 0);
  batente.lineTo(ri, 0);
  batente.lineTo(ri, reto);
  batente.absellipse(0, reto, ri, ri, 0, Math.PI, false, 0);
  batente.lineTo(-ri, 0);
  batente.lineTo(-ro, 0);
  por(g, new THREE.ExtrudeGeometry(batente, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.012, bevelSegments: 1, curveSegments: 24 }), escura, 0, 0, -0.04);
  // a folha, na dobradiça
  const dobradica = new THREE.Group();
  dobradica.name = 'dobradica';
  dobradica.position.set(-ri + 0.01, 0, 0.02);
  g.add(dobradica);
  const folha = new THREE.Shape();
  arco(folha, ri - 0.01, 0.02, reto, ri - 0.012, ri - 0.012);
  const geoFolha = new THREE.ExtrudeGeometry(folha, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1, curveSegments: 24 });
  geoFolha.translate(0, 0, -0.03);
  por(dobradica, geoFolha, madeira);
  // as dobradiças de ferro em ramo, a argola e os cravos
  for (const y of [0.4, 1.5]) {
    por(dobradica, quina(0.62, 0.06, 0.012, 0.004), ferro, 0.31, y, 0.042);
    for (let k = 0; k < 3; k++) {
      const ramo = por(dobradica, quina(0.14, 0.022, 0.01, 0.003), ferro, 0.5 + k * 0.02, y + (k - 1) * 0.05, 0.044);
      ramo.rotation.z = (k - 1) * 0.6;
    }
  }
  const argola = por(dobradica, new THREE.TorusGeometry(0.07, 0.013, 6, 18), ferro, L - 0.2, 1.0, 0.07);
  argola.rotation.x = 0.2;
  por(dobradica, new THREE.SphereGeometry(0.025, 8, 6), toon(P.relogioLatao), L - 0.2, 1.07, 0.05);
  // a abóborinha esculpida em cima do arco
  const lote = new LoteDeAboboras().por({ x: 0, y: reto + ro - 0.02, z: 0.06, raio: 0.12, cara: 'sorriso', giro: 0 });
  g.add(lote.montar());
  return fundir(g);
}
