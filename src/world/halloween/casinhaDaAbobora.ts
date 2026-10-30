import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { acesoPorVertice, brilhoEmLote, nevoa, toon } from '../../core/materials';
import { arco, quina } from '../lojaDeRoupas';
import { uvDeParede } from '../acabamento';
import { novaTextura, sorteio } from '../texturasDeChao';
import { pocaDeLuz, haloDeLampada } from '../furniture';
import { arbustoFlorido } from '../acampamento';
import { fundir } from '../fundir';
import { canvasComLetra } from './carrinhoDePocoes';
import { LoteDeAboboras } from './abobora';

/*
 * A CASINHA DA ABÓBORA — as peças da etapa 6 do Halloween
 * (`docs/HALLOWEEN.md`, §7.1).
 *
 * - o PORTÃO LARANJA (`PortaoLaranja`): a porta de tábua laranja de alto
 *   em arco, as ferragens pretas, a FECHADURA DE ABÓBORA (que acende quando
 *   a cesta passa de 25 balas), os mourões de pedra com uma abóbora acesa
 *   em cima, o arco de galho seco com folhas de outono e luzinhas, e a
 *   plaquinha "só com a cesta cheia". A folha abre num grupo com nome
 *   (`folha-do-portao`). É o mesmo portão nas duas pontas: no parque (atrás
 *   da roda) e na clareira;
 * - a CERQUINHA TORTA (`cerquinhaTorta`): ripa de ponta, cada uma de um
 *   jeito, roxa — a que fecha o mato dos dois lados do portão;
 * - o MATO (`matoDenso`): arbustos com florzinhas de outono, o capim em
 *   lote e os galhos secos espetados;
 * - a CASINHA TORTA (`CasinhaTorta`): a casinha de tábua grudada na abóbora
 *   gigante, de empena para a frente, telhado de escama torto, chaminé de
 *   pedra inclinada soltando fumacinha, a porta em arco com a aldrava de
 *   morcego, a janela redonda com a vela e a lanterna do lado da porta;
 * - o CAMINHO DE PEDRINHAS (`caminhoDePedrinhas`) e a NÉVOA rente ao chão
 *   (`NevoaBaixa`).
 *
 * A abóbora gigante é a do lote do parque (`LoteDeAboboras`), com o raio de
 * casa: os gomos, a cara recortada (apagada: a surpresa está lá dentro), o
 * cabinho, a folha e a gavinha crescem junto.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const FONTE = '"Kalam", "Segoe Print", "Comic Sans MS", cursive';

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

// ================================================================ as texturas

/** tábuas em pé pintadas: a cor, a fresta queimada, o veio e o prego */
export function tabuas(chave: string, lado: number, n: number, cor: number, fresta: number, semente: number): THREE.CanvasTexture {
  return novaTextura(chave, lado, (c, s) => {
    const rnd = sorteio(semente);
    c.fillStyle = css(cor);
    c.fillRect(0, 0, s, s);
    const passo = s / n;
    for (let t = 0; t < n; t++) {
      const x0 = t * passo;
      // cada tábua de um tom
      c.fillStyle = `rgba(${rnd() < 0.5 ? '0,0,0' : '255,255,255'},${0.03 + rnd() * 0.06})`;
      c.fillRect(x0, 0, passo, s);
      // o veio
      for (let k = 0; k < 7; k++) {
        c.strokeStyle = `rgba(40,20,30,${0.05 + rnd() * 0.08})`;
        c.lineWidth = 1 + rnd();
        const x = x0 + 4 + rnd() * (passo - 8);
        c.beginPath();
        c.moveTo(x, 0);
        c.bezierCurveTo(x + (rnd() - 0.5) * 6, s * 0.33, x + (rnd() - 0.5) * 6, s * 0.66, x + (rnd() - 0.5) * 4, s);
        c.stroke();
      }
      // um nó de madeira de vez em quando
      if (rnd() < 0.5) {
        const nx = x0 + passo * (0.3 + rnd() * 0.4);
        const ny = rnd() * s;
        c.strokeStyle = 'rgba(40,20,30,0.22)';
        c.lineWidth = 1.5;
        c.beginPath();
        c.ellipse(nx, ny, 3 + rnd() * 2, 6 + rnd() * 4, 0, 0, Math.PI * 2);
        c.stroke();
      }
      // a fresta e a quina clara
      c.fillStyle = css(fresta);
      c.fillRect(x0, 0, 3, s);
      c.fillStyle = 'rgba(255,240,230,0.18)';
      c.fillRect(x0 + 3, 0, 2, s);
      // os pregos, no alto e embaixo de cada tábua
      c.fillStyle = 'rgba(30,24,36,0.55)';
      for (const y of [s * 0.12, s * 0.62]) {
        c.beginPath();
        c.arc(x0 + passo / 2, y + (rnd() - 0.5) * 6, 2.2, 0, Math.PI * 2);
        c.fill();
      }
    }
  });
}

export const tabuasLaranja = (): THREE.CanvasTexture => tabuas('casinha:tabuas-laranja', 0.62, 5, P.portaoLaranja, P.portaoLaranjaFundo, 611);
export const tabuasRoxas = (): THREE.CanvasTexture => tabuas('casinha:tabuas-roxas', 0.8, 5, P.casinhaMadeira, P.casinhaMadeiraFresta, 733);
export const tabuasDaPorta = (): THREE.CanvasTexture => tabuas('casinha:tabuas-da-porta', 0.5, 4, P.casinhaPorta, P.casinhaPortaEscura, 857);

/** pedra de mourão e de chaminé: pedras arredondadas de tamanhos diferentes, com o rejunte */
export function pedras(chave: string, cor: number, escura: number, semente: number): THREE.CanvasTexture {
  return novaTextura(chave, 0.55, (c, s) => {
    const rnd = sorteio(semente);
    c.fillStyle = css(escura);
    c.fillRect(0, 0, s, s);
    const fiadas = 4;
    const alto = s / fiadas;
    for (let f = 0; f < fiadas; f++) {
      let x = -rnd() * alto;
      while (x < s) {
        const larg = alto * (0.9 + rnd() * 0.9);
        const tom = 0.86 + rnd() * 0.22;
        const base = new THREE.Color(cor).multiplyScalar(tom);
        c.fillStyle = `#${base.getHexString()}`;
        const r = 6 + rnd() * 6;
        const x0 = x + 3;
        const y0 = f * alto + 3;
        const w = larg - 6;
        const h = alto - 6;
        c.beginPath();
        c.moveTo(x0 + r, y0);
        c.arcTo(x0 + w, y0, x0 + w, y0 + h, r);
        c.arcTo(x0 + w, y0 + h, x0, y0 + h, r);
        c.arcTo(x0, y0 + h, x0, y0, r);
        c.arcTo(x0, y0, x0 + w, y0, r);
        c.fill();
        // o brilho de cima e a sombra de baixo de cada pedra
        c.fillStyle = 'rgba(255,255,255,0.12)';
        c.fillRect(x0 + r * 0.6, y0 + 2, w - r * 1.2, 3);
        c.fillStyle = 'rgba(0,0,0,0.1)';
        c.fillRect(x0 + r * 0.6, y0 + h - 4, w - r * 1.2, 3);
        x += larg;
      }
    }
  });
}

/** a telha de escama: fileiras de meia-lua, a de baixo cobrindo a de cima */
function escamas(): THREE.CanvasTexture {
  return novaTextura('casinha:escamas', 0.7, (c, s) => {
    const rnd = sorteio(977);
    c.fillStyle = css(P.casinhaTelha);
    c.fillRect(0, 0, s, s);
    const fileiras = 6;
    const alto = s / fileiras;
    const n = 5;
    const larg = s / n;
    for (let f = 0; f < fileiras + 1; f++) {
      const desloca = f % 2 ? larg / 2 : 0;
      for (let k = -1; k <= n; k++) {
        const cx = k * larg + desloca + larg / 2;
        const y = f * alto;
        const tom = new THREE.Color(rnd() < 0.3 ? P.casinhaTelhaClara : P.casinhaTelha).multiplyScalar(0.9 + rnd() * 0.18);
        c.fillStyle = `#${tom.getHexString()}`;
        c.beginPath();
        c.moveTo(cx - larg / 2, y - alto * 0.2);
        c.lineTo(cx - larg / 2, y + alto * 0.35);
        c.arc(cx, y + alto * 0.35, larg / 2, Math.PI, 0, true);
        c.lineTo(cx + larg / 2, y - alto * 0.2);
        c.closePath();
        c.fill();
        c.strokeStyle = 'rgba(20,10,30,0.4)';
        c.lineWidth = 2;
        c.beginPath();
        c.arc(cx, y + alto * 0.35, larg / 2 - 1, Math.PI, 0, true);
        c.stroke();
      }
    }
  });
}

// ============================================================ peças miúdas

/** um galho: tubo pela curva, afinando da base para a ponta */
export function galho(pontos: THREE.Vector3[], r0: number, r1: number, segs = 16, lados = 6): THREE.BufferGeometry {
  const curva = new THREE.CatmullRomCurve3(pontos);
  const geo = new THREE.TubeGeometry(curva, segs, 1, lados, false);
  // o raio de cada anel: do r0 na base ao r1 na ponta
  const pos = geo.getAttribute('position');
  const v = new THREE.Vector3();
  const anel = lados + 1;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const c = curva.getPointAt(t);
    const r = r0 + (r1 - r0) * t;
    for (let k = 0; k < anel; k++) {
      const j = i * anel + k;
      v.fromBufferAttribute(pos, j).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(j, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/** a folha de outono: oval de ponta, dobrada na nervura (para os dois lados) */
let geoFolhaDeOutono: THREE.BufferGeometry | null = null;
function folhaDeOutono(): THREE.BufferGeometry {
  if (geoFolhaDeOutono) return geoFolhaDeOutono;
  const f = new THREE.Shape();
  f.moveTo(0, 0);
  f.bezierCurveTo(0.05, 0.02, 0.06, 0.08, 0, 0.13);
  f.bezierCurveTo(-0.06, 0.08, -0.05, 0.02, 0, 0);
  const geo = new THREE.ShapeGeometry(f, 4);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.abs(pos.getX(i)) * 0.5);
  geo.computeVertexNormals();
  geoFolhaDeOutono = geo;
  return geo;
}

/** o capim: uma lâmina estreita que afina e enverga para a frente (altura 1, a cópia escala) */
let geoLamina: THREE.BufferGeometry | null = null;
function lamina(): THREE.BufferGeometry {
  if (geoLamina) return geoLamina;
  const N = 4;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const w = 0.025 * (1 - t);
    const z = 0.28 * t * t;
    pos.push(-w, t, z, w, t, z);
  }
  for (let i = 0; i < N; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  geoLamina = geo;
  return geo;
}

/** as luzinhas de um fio que segue uma curva (o arco do portão): lâmpada em gota e o halo, em lote */
function luzinhasNaCurva(curva: THREE.Curve<THREE.Vector3>, n: number, desce: number): THREE.Group {
  const g = new THREE.Group();
  const cores = [P.luzinhaLaranja, P.halloweenLilas, P.aboboraPolpaAcesa];
  const gota = new THREE.SphereGeometry(0.035, 8, 6);
  gota.setAttribute('color', new THREE.Float32BufferAttribute(new Array(gota.getAttribute('position').count * 3).fill(1), 3));
  const lamp = new THREE.InstancedMesh(gota, acesoPorVertice(), n);
  lamp.name = 'lampadinhas-do-arco';
  const halo = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(0xffffff, 0.7), n);
  halo.name = 'halos-do-arco';
  halo.userData.semSombra = true;
  const m = new THREE.Matrix4();
  const cor = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const p = curva.getPointAt((i + 0.5) / n);
    p.y -= desce;
    m.makeScale(1, 1.35, 1).setPosition(p);
    lamp.setMatrixAt(i, m);
    cor.setHex(cores[i % cores.length]);
    lamp.setColorAt(i, cor);
    m.makeScale(0.32, 0.32, 0.32).setPosition(p);
    halo.setMatrixAt(i, m);
    halo.setColorAt(i, cor.multiplyScalar(0.9));
  }
  g.add(lamp, halo);
  return g;
}

/** a plaquinha de madeira pregada no mourão: a letra de mão e uma abóborinha desenhada */
function plaquinhaDaCesta(): THREE.Mesh {
  const tex = canvasComLetra(256, 150, (c) => {
    c.fillStyle = css(P.galhoSecoClaro);
    c.fillRect(0, 0, 256, 150);
    // as duas tábuas da plaquinha
    c.fillStyle = 'rgba(40,20,10,0.25)';
    c.fillRect(0, 74, 256, 3);
    for (let k = 0; k < 9; k++) {
      c.strokeStyle = 'rgba(60,35,20,0.12)';
      c.beginPath();
      c.moveTo(0, 10 + k * 16);
      c.lineTo(256, 12 + k * 16);
      c.stroke();
    }
    // a abóborinha
    c.fillStyle = css(P.abobora);
    c.beginPath();
    c.ellipse(38, 75, 22, 18, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = css(P.aboboraFunda);
    c.lineWidth = 2;
    for (const dx of [-8, 0, 8]) {
      c.beginPath();
      c.ellipse(38 + dx, 75, 6, 17, 0, 0, Math.PI * 2);
      c.stroke();
    }
    c.fillStyle = css(P.aboboraCabinho);
    c.fillRect(35, 52, 5, 8);
    // o texto
    c.fillStyle = '#3a2416';
    c.font = `700 34px ${FONTE}`;
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillText('Só com a', 72, 50);
    c.fillText('cesta cheia!', 72, 98);
    // os pregos
    c.fillStyle = '#2a2026';
    for (const [x, y] of [[10, 10], [246, 10], [10, 140], [246, 140]]) {
      c.beginPath();
      c.arc(x, y, 4, 0, Math.PI * 2);
      c.fill();
    }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.26), toon(0xffffff, { mapa: tex }));
  m.name = 'plaquinha-da-cesta';
  return m;
}

// ============================================================ o portão laranja

/** as medidas do portão (a cena monta o colisor e o ponto do "Abrir" por elas) */
export const PORTAO_LARANJA = {
  /** o vão da folha */
  vao: 1.3,
  /** a altura da folha no meio do arco */
  alto: 1.78,
  /** o lado do mourão quadrado */
  mourao: 0.3,
  /** a altura do mourão até o topo do chapéu de pedra */
  mouraoAlto: 1.98,
  /** a meia largura do conjunto (mourão a mourão) */
  meiaLargura: 0.95,
} as const;

/**
 * O PORTÃO LARANJA: base no chão, o plano da folha em `z = 0`, a frente
 * (de onde se chega e de onde se lê a plaquinha) para `+Z`. A folha gira na
 * dobradiça do mourão da esquerda e abre para `−Z` (para dentro do mato).
 */
export class PortaoLaranja {
  readonly group = new THREE.Group();
  private readonly folha = new THREE.Group();
  private readonly fechaduraAcesa: THREE.Object3D;
  private readonly fechaduraApagada: THREE.Object3D;
  private readonly abobora: LoteDeAboboras;
  private abertura = 0;
  private alvo = 0;
  private tempo = 0;

  constructor() {
    const g = this.group;
    g.name = 'portao-laranja';
    g.userData.peca = 'portao-laranja';
    // o teste lê quanto a folha abriu e se a fechadura acendeu
    g.userData.portao = this;
    const { vao, alto, mourao, mouraoAlto } = PORTAO_LARANJA;
    const xMourao = vao / 2 + mourao / 2 + 0.02;

    // ---- os mourões de pedra, com o chapéu e a abóbora acesa em cima
    const pedra = toon(0xffffff, { mapa: pedras('casinha:pedra-do-mourao', P.mouraoPedra, P.mouraoPedraEscura, 401) });
    const chapeu = toon(P.mouraoPedraEscura);
    const abobora = new LoteDeAboboras();
    for (const lado of [-1, 1]) {
      const x = lado * xMourao;
      const corpo = uvDeParede(quina(mourao, mouraoAlto - 0.14, mourao, 0.025), x, 0, 0);
      por(g, corpo, pedra, x, (mouraoAlto - 0.14) / 2, 0);
      por(g, quina(mourao + 0.08, 0.06, mourao + 0.08, 0.015), chapeu, x, mouraoAlto - 0.11, 0);
      const ponta = new THREE.ConeGeometry((mourao + 0.04) * 0.72, 0.12, 4, 1);
      ponta.rotateY(Math.PI / 4);
      por(g, ponta, chapeu, x, mouraoAlto - 0.02, 0);
      abobora.por({ x, y: mouraoAlto + 0.02, z: 0, tamanho: 'pequena', cara: lado < 0 ? 'sorriso' : 'piscando', giro: 0 });
    }
    this.abobora = abobora;
    g.add(abobora.montar({ acesas: true, semPoca: true }));
    // a luz que as duas jogam no chão, na frente do portão
    for (const lado of [-1, 1]) {
      const poca = pocaDeLuz(0.9, P.luzDeAbobora, 0.32);
      poca.position.set(lado * xMourao, 0.02, 0.5);
      g.add(poca);
    }

    // ---- a folha, num grupo com nome (a `fundir` junta dentro dela, e ela continua abrindo)
    const folha = this.folha;
    folha.name = 'folha-do-portao';
    folha.position.set(-vao / 2 + 0.005, 0, 0);
    g.add(folha);
    const L = vao - 0.02;
    const reto = alto - 0.28;
    const forma = new THREE.Shape();
    arco(forma, L / 2, 0.06, reto, L / 2, 0.28);
    const geoFolha = new THREE.ExtrudeGeometry(forma, {
      depth: 0.06, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 18,
    });
    geoFolha.translate(0, 0, -0.03);
    por(folha, geoFolha, toon(0xffffff, { mapa: tabuasLaranja() }));
    // as ferragens: duas faixas de ferro de cada lado, com a ponta enrolada e os rebites
    const ferro = toon(P.portaoLaranjaFerro);
    for (const lado of [1, -1]) {
      const z = lado * 0.045;
      for (const y of [0.36, reto - 0.12]) {
        por(folha, quina(L - 0.16, 0.07, 0.014, 0.004), ferro, L / 2 - 0.04, y, z);
        const voluta = new THREE.TorusGeometry(0.045, 0.011, 6, 14, Math.PI * 1.5);
        por(folha, voluta, ferro, L - 0.13, y + 0.035, z).rotation.z = -Math.PI / 2;
        for (let k = 0; k < 5; k++) por(folha, new THREE.SphereGeometry(0.012, 6, 4), ferro, 0.08 + k * ((L - 0.3) / 4), y, z + lado * 0.008);
      }
    }
    // atrás, a travessa em diagonal (é a cara de porta de quintal)
    const diag = Math.hypot(L - 0.24, reto - 0.48 - 0.12);
    const trava = por(folha, quina(diag, 0.1, 0.03, 0.008), toon(0xffffff, { mapa: tabuasLaranja() }), L / 2 - 0.04, (reto + 0.24) / 2, -0.05);
    trava.rotation.z = Math.atan2(reto - 0.6, L - 0.24);
    // a argola de puxar, do lado de abrir
    const argola = por(folha, new THREE.TorusGeometry(0.055, 0.011, 6, 16), ferro, L - 0.16, 0.92, 0.075);
    argola.rotation.x = 0.25;
    por(folha, new THREE.SphereGeometry(0.02, 8, 6), ferro, L - 0.16, 0.975, 0.05);
    // o espelho da fechadura, com o buraco da chave
    const espelho = new THREE.Shape();
    espelho.absellipse(0, 0, 0.065, 0.1, 0, Math.PI * 2, false, 0);
    const geoEspelho = new THREE.ExtrudeGeometry(espelho, { depth: 0.012, bevelEnabled: false, curveSegments: 16 });
    por(folha, geoEspelho, ferro, L / 2, 0.8, 0.036);
    const buracoDaChave = new THREE.Shape();
    buracoDaChave.absarc(0, 0.025, 0.016, -0.3, Math.PI + 0.3, false);
    buracoDaChave.lineTo(-0.013, -0.04);
    buracoDaChave.lineTo(0.013, -0.04);
    buracoDaChave.closePath();
    por(folha, new THREE.ShapeGeometry(buracoDaChave, 10), toon(P.aboboraOco), L / 2, 0.8, 0.049);
    // a FECHADURA DE ABÓBORA: a abóborinha apagada e a acesa, trocadas (malhas com nome)
    const fechadura = (acesa: boolean): THREE.Object3D => {
      const lote = new LoteDeAboboras().por({ x: 0, y: 0, z: 0, raio: 0.11, cara: 'sorriso', giro: 0, simples: true });
      const f = lote.montar({ acesas: acesa, semPoca: true });
      f.name = acesa ? 'fechadura-acesa' : 'fechadura-apagada';
      f.position.set(L / 2, 0.97, 0.085);
      folha.add(f);
      return f;
    };
    this.fechaduraApagada = fechadura(false);
    this.fechaduraAcesa = fechadura(true);
    this.fechaduraAcesa.visible = false;

    // ---- o arco de galho seco por cima, com folhas de outono e luzinhas
    const rnd = sorteio(5150);
    // o arco nasce na face de dentro dos mourões, abaixo das abóboras de cima
    const y0 = mouraoAlto - 0.28;
    const madeira = toon(P.galhoSeco);
    const madeiraClara = toon(P.galhoSecoClaro);
    const pontosDoArco = (desvio: number): THREE.Vector3[] => {
      const lista: THREE.Vector3[] = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const x = (t - 0.5) * 2 * (xMourao - 0.12);
        const y = y0 + Math.sin(t * Math.PI) * 0.82 + (i > 0 && i < 8 ? (rnd() - 0.5) * desvio : 0);
        const z = (rnd() - 0.5) * desvio * 0.8;
        lista.push(new THREE.Vector3(x, y, z));
      }
      return lista;
    };
    const principal = pontosDoArco(0.05);
    por(g, galho(principal, 0.04, 0.032, 40), madeira);
    por(g, galho(pontosDoArco(0.12), 0.026, 0.018, 40), madeiraClara);
    por(g, galho(pontosDoArco(0.16), 0.02, 0.012, 40), madeira);
    // gravetos espetados para fora do arco, cada um com uma forquilha
    const curva = new THREE.CatmullRomCurve3(principal);
    for (let k = 0; k < 9; k++) {
      const p = curva.getPointAt(0.08 + (k / 8) * 0.84);
      const sai = new THREE.Vector3((rnd() - 0.5) * 0.5, 0.15 + rnd() * 0.25, (rnd() - 0.5) * 0.35);
      const meio = p.clone().addScaledVector(sai, 0.55);
      const fim = p.clone().add(sai);
      por(g, galho([p, meio, fim], 0.012, 0.004, 6, 5), madeira);
      const forq = meio.clone().add(new THREE.Vector3((rnd() - 0.5) * 0.18, 0.1, (rnd() - 0.5) * 0.12));
      por(g, galho([meio, meio.clone().lerp(forq, 0.5), forq], 0.007, 0.003, 4, 4), madeira);
    }
    // as folhas de outono (um lote, cor por cópia)
    const nFolhas = 42;
    const folhas = new THREE.InstancedMesh(folhaDeOutono(), toon(0xffffff, { doubleSide: true }), nFolhas);
    folhas.name = 'folhas-do-arco';
    const coresDasFolhas = [P.portaoLaranja, P.abobora, P.halloweenLaranjaClaro, P.espantalhoBandana, P.halloweenRoxo, P.capimSeco];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const cor = new THREE.Color();
    for (let i = 0; i < nFolhas; i++) {
      const p = curva.getPointAt(rnd());
      p.add(new THREE.Vector3((rnd() - 0.5) * 0.12, (rnd() - 0.3) * 0.1, (rnd() - 0.5) * 0.14));
      e.set((rnd() - 0.5) * 2.5, rnd() * Math.PI * 2, (rnd() - 0.5) * 2.5);
      q.setFromEuler(e);
      const s = 0.8 + rnd() * 0.6;
      m.compose(p, q, new THREE.Vector3(s, s, s));
      folhas.setMatrixAt(i, m);
      folhas.setColorAt(i, cor.setHex(coresDasFolhas[Math.floor(rnd() * coresDasFolhas.length)]));
    }
    g.add(folhas);
    g.add(luzinhasNaCurva(curva, 11, 0.07));

    // ---- a plaquinha pregada no mourão da direita, um tico torta
    const placa = plaquinhaDaCesta();
    placa.position.set(xMourao, 1.32, mourao / 2 + 0.012);
    placa.rotation.z = -0.1;
    g.add(placa);
    por(g, new THREE.SphereGeometry(0.013, 6, 4), ferro, xMourao, 1.43, mourao / 2 + 0.02);

    fundir(g);
  }

  /** a folha abre (true) ou fecha (false), devagar */
  abrir(sim: boolean): void {
    this.alvo = sim ? 1 : 0;
  }

  /** quanto a folha está aberta (0 a 1) */
  get aberto(): number {
    return this.abertura;
  }

  /** a fechadura acende quando a cesta passa da conta */
  acender(sim: boolean): void {
    this.fechaduraAcesa.visible = sim;
    this.fechaduraApagada.visible = !sim;
  }

  get acesa(): boolean {
    return this.fechaduraAcesa.visible;
  }

  update(dt: number): void {
    this.tempo += dt;
    this.abobora.tremer(this.tempo);
    const passo = dt * 1.3;
    this.abertura += Math.max(-passo, Math.min(passo, this.alvo - this.abertura));
    // abre devagar no começo e no fim (o portão é pesado), e range um tico além
    const k = this.abertura;
    const suave = k * k * (3 - 2 * k);
    this.folha.rotation.y = 1.5 * suave;
  }
}

// ============================================================ a cerquinha torta

/**
 * A CERQUINHA TORTA: ripas de ponta de comprimento `comprimento` ao longo de
 * `+X` (de 0 até ele), a frente para `+Z`, as duas travessas atrás. Cada
 * ripa de uma altura, um tico inclinada, em dois roxos.
 */
export function cerquinhaTorta(comprimento: number, semente = 1, alto = 1.0): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cerquinha-torta';
  const rnd = sorteio(7000 + semente * 31);
  const mats = [toon(P.cerquinhaRoxa), toon(P.cerquinhaRoxaClara)];
  const larg = 0.1;
  const passo = 0.15;
  const n = Math.max(2, Math.round(comprimento / passo));
  for (let i = 0; i < n; i++) {
    const h = alto * (0.82 + rnd() * 0.22);
    const f = new THREE.Shape();
    f.moveTo(-larg / 2, 0);
    f.lineTo(larg / 2, 0);
    f.lineTo(larg / 2, h - 0.08);
    f.lineTo(0, h);
    f.lineTo(-larg / 2, h - 0.08);
    f.lineTo(-larg / 2, 0);
    const geo = new THREE.ExtrudeGeometry(f, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1 });
    const ripa = por(g, geo, mats[i % 2], (i + 0.5) * (comprimento / n), -0.04, 0);
    ripa.rotation.z = (rnd() - 0.5) * 0.14;
    ripa.rotation.y = (rnd() - 0.5) * 0.12;
  }
  // as travessas, atrás das ripas (uma um tico torta)
  for (const [y, gira] of [[alto * 0.28, 0.01], [alto * 0.68, -0.018]] as const) {
    const t = por(g, quina(comprimento, 0.07, 0.03, 0.008), mats[0], comprimento / 2, y, -0.025);
    t.rotation.z = gira;
  }
  return g;
}

// ================================================================== o mato

/**
 * O MATO: um retângulo de `largura` × `fundo` centrado na origem, cheio de
 * arbustos (com florzinhas de outono), capim em lote (verde e seco) e
 * galhos secos espetados. `porte` é o tamanho dos arbustos (o mato atrás dos
 * portões é alto: fecha a vista; o da beira de cá é baixo: não tapa a
 * dupla). Sem colisor: quem monta é a cena.
 */
export function matoDenso(largura: number, fundo: number, semente = 1, densidade = 1, porte: readonly [number, number] = [0.85, 1.55]): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mato';
  const rnd = sorteio(8100 + semente * 17);
  const area = largura * fundo;
  // os arbustos, numa grade torta
  const nx = Math.max(1, Math.round(largura / 1.1));
  const nz = Math.max(1, Math.round(fundo / 1.1));
  const cores = [P.halloweenLaranja, P.halloweenLilas, P.aboboraClara];
  for (let i = 0; i < nx; i++) {
    for (let k = 0; k < nz; k++) {
      if (rnd() > 0.85 * densidade) continue;
      const x = ((i + 0.5) / nx - 0.5) * largura + (rnd() - 0.5) * 0.5;
      const z = ((k + 0.5) / nz - 0.5) * fundo + (rnd() - 0.5) * 0.5;
      const a = arbustoFlorido(porte[0] + rnd() * (porte[1] - porte[0]), semente * 13 + i * 7 + k, cores);
      a.position.set(x, 0, z);
      a.rotation.y = rnd() * Math.PI * 2;
      a.userData.peca = undefined;
      g.add(a);
    }
  }
  // o capim, em lote
  const nCapim = Math.round(area * 26 * densidade);
  const capim = new THREE.InstancedMesh(lamina(), toon(0xffffff, { doubleSide: true }), nCapim);
  capim.name = 'capim';
  capim.userData.semSombra = true;
  const coresDoCapim = [P.capim, P.capimSeco, P.matoVerde, P.capim];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const cor = new THREE.Color();
  for (let i = 0; i < nCapim; i++) {
    const p = new THREE.Vector3((rnd() - 0.5) * largura * 1.08, 0, (rnd() - 0.5) * fundo * 1.08);
    e.set((rnd() - 0.5) * 0.3, rnd() * Math.PI * 2, 0);
    q.setFromEuler(e);
    const h = 0.35 + rnd() * 0.55;
    m.compose(p, q, new THREE.Vector3(1 + rnd() * 0.5, h, h));
    capim.setMatrixAt(i, m);
    capim.setColorAt(i, cor.setHex(coresDoCapim[Math.floor(rnd() * coresDoCapim.length)]));
  }
  g.add(capim);
  // os galhos secos espetados para cima, entre os arbustos
  const madeira = toon(P.galhoSeco);
  const nGalhos = Math.max(1, Math.round(area / 3));
  for (let i = 0; i < nGalhos; i++) {
    const base = new THREE.Vector3((rnd() - 0.5) * largura * 0.9, 0.2, (rnd() - 0.5) * fundo * 0.9);
    const topo = base.clone().add(new THREE.Vector3((rnd() - 0.5) * 0.6, 1.0 + rnd() * 0.7, (rnd() - 0.5) * 0.6));
    const meio = base.clone().lerp(topo, 0.5).add(new THREE.Vector3((rnd() - 0.5) * 0.2, 0, (rnd() - 0.5) * 0.2));
    por(g, galho([base, meio, topo], 0.025, 0.006, 8, 5), madeira);
    const forq = meio.clone().lerp(topo, 0.4);
    por(g, galho([forq, forq.clone().add(new THREE.Vector3((rnd() - 0.5) * 0.4, 0.3, (rnd() - 0.5) * 0.4))], 0.01, 0.004, 3, 4), madeira);
  }
  return g;
}

// ============================================================ a casinha torta

/** quanto a casinha tomba para a direita a cada metro de altura */
const TORTO = 0.045;

/** as medidas da casinha (a cena monta o colisor e o ponto da porta por elas) */
export const CASINHA_TORTA = {
  /** a largura (em `x`) e o fundo (em `z`) das paredes */
  largura: 3.0,
  fundo: 3.4,
  /** a altura da parede até o beiral */
  parede: 2.45,
  /** o meio da porta, em `x`, na parede da frente (`z = fundo / 2`) */
  xPorta: -0.32,
  /** o vão da porta */
  porta: 0.92,
} as const;

/**
 * A CASINHA TORTA: base no chão, a porta para `+Z`, de empena para a frente.
 * O torto é de verdade: o corpo inteiro tomba um tico para a direita (um
 * cisalhamento passado na geometria), o telhado cede no meio da cumeeira e a
 * chaminé de pedra se inclina para o outro lado, soltando fumacinha.
 */
export class CasinhaTorta {
  readonly group = new THREE.Group();
  /** a porta (a folha gira na dobradiça: é a 6b que abre) */
  readonly porta = new THREE.Group();
  private readonly fumaca: THREE.InstancedMesh;
  private readonly bolotas: Array<{ t: number; vel: number; lado: number }> = [];
  private readonly bocaDaChamine = new THREE.Vector3();
  private readonly chama: THREE.Object3D;
  private readonly cataVento: LoteDeAboboras;
  private tempo = 0;

  constructor() {
    const g = this.group;
    g.name = 'casinha-torta';
    g.userData.peca = 'casinha-torta';
    const { largura: L, fundo: F, parede: H, xPorta, porta: vao } = CASINHA_TORTA;
    const corpo = new THREE.Group();
    g.add(corpo);
    const tabua = toon(0xffffff, { mapa: tabuasRoxas() });
    const pedra = toon(0xffffff, { mapa: pedras('casinha:pedra-da-chamine', P.casinhaPedra, P.casinhaPedraEscura, 509) });
    const madeiraEscura = toon(P.casinhaMadeiraFresta);
    const ESP = 0.1;
    const inclina = 52 * (Math.PI / 180);
    const alturaDaEmpena = (L / 2 + 0.05) * Math.tan(inclina);
    const cumeeira = H + alturaDaEmpena;

    // ---- o embasamento de pedra
    por(corpo, uvDeParede(quina(L + 0.14, 0.22, F + 0.14, 0.03), 0, 0, 0), pedra, 0, 0.11, 0);

    // ---- a parede da frente, com a empena: o vão da porta em arco e a janelinha redonda lá em cima
    // a porta toca a borda de baixo: é RECORTE no contorno, e não furo
    const frente = new THREE.Shape();
    frente.moveTo(-L / 2, 0.2);
    frente.lineTo(xPorta - vao / 2, 0.2);
    frente.lineTo(xPorta - vao / 2, 0.2 + 1.55);
    frente.absellipse(xPorta, 0.2 + 1.55, vao / 2, 0.32, Math.PI, 0, true, 0);
    frente.lineTo(xPorta + vao / 2, 0.2);
    frente.lineTo(L / 2, 0.2);
    frente.lineTo(L / 2, H);
    frente.lineTo(0, cumeeira - 0.04);
    frente.lineTo(-L / 2, H);
    frente.lineTo(-L / 2, 0.2);
    const olho = new THREE.Path();
    olho.absarc(0, H + 0.62, 0.22, 0, Math.PI * 2, true);
    frente.holes.push(olho);
    const janela = new THREE.Path();
    janela.absarc(0.86, 1.32, 0.3, 0, Math.PI * 2, true);
    frente.holes.push(janela);
    const geoFrente = new THREE.ExtrudeGeometry(frente, { depth: ESP, bevelEnabled: false, curveSegments: 20 });
    geoFrente.translate(0, 0, F / 2 - ESP);
    por(corpo, uvDeParede(geoFrente), tabua);
    // os fundos (dentro da abóbora: sem furo)
    const fundos = new THREE.Shape();
    fundos.moveTo(-L / 2, 0.2);
    fundos.lineTo(L / 2, 0.2);
    fundos.lineTo(L / 2, H);
    fundos.lineTo(0, cumeeira - 0.04);
    fundos.lineTo(-L / 2, H);
    fundos.lineTo(-L / 2, 0.2);
    const geoFundos = new THREE.ExtrudeGeometry(fundos, { depth: ESP, bevelEnabled: false });
    geoFundos.translate(0, 0, -F / 2);
    por(corpo, uvDeParede(geoFundos), tabua);
    // os dois lados
    for (const lado of [-1, 1]) {
      const geo = uvDeParede(new THREE.BoxGeometry(ESP, H - 0.2, F - 2 * ESP), lado * (L / 2 - ESP / 2), 0, 0);
      por(corpo, geo, tabua, lado * (L / 2 - ESP / 2), 0.2 + (H - 0.2) / 2, 0);
    }
    // as quinas: os caibros de canto, mais escuros, por fora
    for (const lado of [-1, 1]) {
      for (const z of [F / 2 + 0.005, -F / 2 - 0.005]) {
        por(corpo, quina(0.11, H - 0.18, 0.11, 0.015), madeiraEscura, lado * (L / 2 + 0.005), 0.2 + (H - 0.2) / 2 - 0.01, z - Math.sign(z) * 0.05);
      }
    }
    // o batente da porta em arco, por fora da parede
    const batente = new THREE.Shape();
    const ro = vao / 2 + 0.07;
    const ri = vao / 2;
    batente.moveTo(-ro, 0);
    batente.lineTo(-ro, 1.55);
    batente.absellipse(0, 1.55, ro, 0.39, Math.PI, 0, true, 0);
    batente.lineTo(ro, 0);
    batente.lineTo(ri, 0);
    batente.lineTo(ri, 1.55);
    batente.absellipse(0, 1.55, ri, 0.32, 0, Math.PI, false, 0);
    batente.lineTo(-ri, 0);
    batente.lineTo(-ro, 0);
    const geoBatente = new THREE.ExtrudeGeometry(batente, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1, curveSegments: 18 });
    por(corpo, geoBatente, madeiraEscura, xPorta, 0.2, F / 2 - 0.015);
    // a soleira de pedra e o degrau
    por(corpo, uvDeParede(quina(vao + 0.3, 0.14, 0.5, 0.03), xPorta, 0, F / 2), pedra, xPorta, 0.07, F / 2 + 0.2);

    // ---- a porta: tábua escura de alto em arco, a aldrava de morcego e o olho mágico
    const porta = this.porta;
    porta.name = 'porta-da-casinha';
    porta.position.set(xPorta - vao / 2 + 0.01, 0.2, F / 2 - ESP / 2);
    corpo.add(porta);
    const folhaDaPorta = new THREE.Shape();
    arco(folhaDaPorta, vao / 2 - 0.01, 0, 1.55, vao / 2 - 0.01, 0.32);
    const geoPorta = new THREE.ExtrudeGeometry(folhaDaPorta, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1, curveSegments: 18 });
    geoPorta.translate(0, 0, -0.025);
    por(porta, geoPorta, toon(0xffffff, { mapa: tabuasDaPorta() }));
    const ferro = toon(P.portaoLaranjaFerro);
    for (const y of [0.3, 1.25]) por(porta, quina(vao - 0.12, 0.06, 0.012, 0.004), ferro, vao / 2, y, 0.033);
    // a aldrava: o morcego de ferro com a argola pendurada
    const morcego = new THREE.Shape();
    morcego.moveTo(0, 0.03);
    morcego.quadraticCurveTo(0.03, 0.05, 0.05, 0.02);
    morcego.quadraticCurveTo(0.08, 0.06, 0.12, 0.04);
    morcego.quadraticCurveTo(0.1, 0.0, 0.11, -0.03);
    morcego.quadraticCurveTo(0.07, -0.01, 0.05, -0.04);
    morcego.quadraticCurveTo(0.03, -0.02, 0, -0.03);
    morcego.quadraticCurveTo(-0.03, -0.02, -0.05, -0.04);
    morcego.quadraticCurveTo(-0.07, -0.01, -0.11, -0.03);
    morcego.quadraticCurveTo(-0.1, 0.0, -0.12, 0.04);
    morcego.quadraticCurveTo(-0.08, 0.06, -0.05, 0.02);
    morcego.quadraticCurveTo(-0.03, 0.05, 0, 0.03);
    const geoMorcego = new THREE.ExtrudeGeometry(morcego, { depth: 0.015, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1, curveSegments: 6 });
    por(porta, geoMorcego, ferro, vao / 2, 1.08, 0.03);
    // as orelhinhas e os olhinhos acesos do morcego
    for (const s of [-1, 1]) {
      const orelha = new THREE.ConeGeometry(0.012, 0.03, 4);
      por(porta, orelha, ferro, vao / 2 + s * 0.016, 1.12, 0.04);
      por(porta, new THREE.SphereGeometry(0.006, 6, 4), toon(P.aboboraVela, { glow: 1 }), vao / 2 + s * 0.012, 1.09, 0.05);
    }
    const argola = por(porta, new THREE.TorusGeometry(0.05, 0.009, 6, 16), ferro, vao / 2, 1.01, 0.05);
    argola.rotation.x = 0.2;
    // a maçaneta e o olho mágico
    por(porta, new THREE.SphereGeometry(0.03, 10, 8), toon(P.bruxoDourado), vao - 0.14, 0.88, 0.05);
    por(porta, new THREE.CylinderGeometry(0.022, 0.022, 0.02, 12).rotateX(Math.PI / 2), toon(P.bruxoDourado), vao / 2, 1.42, 0.035);

    // ---- as janelas: a redonda do lado da porta e o olho da empena, com a vela acesa por trás
    const vidro = toon(P.casinhaJanela, { glow: 0.85 });
    const caixilho = toon(P.casinhaMadeiraFresta);
    const janelaRedonda = (x: number, y: number, r: number): void => {
      por(corpo, new THREE.CircleGeometry(r + 0.01, 24), vidro, x, y, F / 2 - ESP + 0.02);
      const moldura = new THREE.TorusGeometry(r + 0.025, 0.035, 8, 28);
      por(corpo, moldura, caixilho, x, y, F / 2 + 0.01);
      // a cruz do caixilho
      por(corpo, quina(0.04, r * 2, 0.04, 0.008), caixilho, x, y, F / 2 - 0.03);
      por(corpo, quina(r * 2, 0.04, 0.04, 0.008), caixilho, x, y, F / 2 - 0.03);
    };
    janelaRedonda(0.86, 1.32, 0.3);
    janelaRedonda(0, H + 0.62, 0.22);
    // a vela no peitoril de dentro (a chama treme) e o halo na janela
    const vela = por(corpo, new THREE.CylinderGeometry(0.028, 0.03, 0.14, 10), toon(P.aboboraCreme), 0.98, 1.1, F / 2 - 0.065);
    vela.userData.semSombra = true;
    this.chama = por(corpo, new THREE.SphereGeometry(0.022, 8, 6), toon(P.aboboraVela, { glow: 1 }), 0.98, 1.2, F / 2 - 0.065);
    this.chama.name = 'chama-da-vela';
    this.chama.scale.set(0.8, 1.6, 0.8);
    const haloJanela = haloDeLampada(1.0, P.casinhaJanela, 0.35);
    haloJanela.position.set(0.86 + 1.32 * TORTO, 1.32, F / 2 + 0.15);
    g.add(haloJanela);
    // a floreira da janela, com abóborinhas
    por(corpo, quina(0.72, 0.14, 0.18, 0.02), madeiraEscura, 0.86, 0.92, F / 2 + 0.1);
    const miudas = new LoteDeAboboras();
    for (const [dx, cor] of [[-0.22, P.abobora], [0.02, P.aboboraClara], [0.24, P.abobora]] as const) {
      miudas.por({ x: 0.86 + dx, y: 0.99, z: F / 2 + 0.1, raio: 0.075 + Math.abs(dx) * 0.05, cor, simples: true });
    }
    corpo.add(miudas.montar());

    // ---- o telhado de escama, de duas águas para os lados, cedendo no meio
    const telha = toon(0xffffff, { mapa: escamas() });
    const beiral = 0.3;
    const aba = (L / 2 + beiral) / Math.cos(inclina);
    const comprido = F + 0.5;
    const tg = Math.tan(inclina);
    for (const lado of [-1, 1]) {
      const geo = new THREE.BoxGeometry(aba + 0.06, 0.1, comprido, 6, 1, 8);
      const pos = geo.getAttribute('position');
      const uv = geo.getAttribute('uv');
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        // 0 na beira, 1 na cumeeira: a água da direita gira para baixo no +x, a da esquerda no −x
        const perto = lado > 0 ? (aba / 2 - x) / aba : (x + aba / 2) / aba;
        // a cumeeira cede no meio do comprimento, e a beira ondula de leve
        const cede = -0.08 * Math.cos((z / comprido) * Math.PI);
        pos.setY(i, pos.getY(i) + cede + 0.025 * Math.sin(z * 5.1 + lado) * (1 - perto));
        // a escama em metros: as fileiras ao longo da beira, a meia-lua apontando água abaixo
        uv.setXY(i, z + 3, (1 - perto) * aba + 3);
      }
      geo.computeVertexNormals();
      const agua = por(corpo, geo, telha);
      agua.rotation.z = -lado * inclina;
      const xm = (L / 2 + beiral) / 2;
      const ym = H + 0.01 + ((L / 2 - beiral) * tg) / 2;
      agua.position.set(lado * (xm + 0.05 * Math.sin(inclina)), ym + 0.05 * Math.cos(inclina), 0);
    }
    // a cumeeira: um tronco de madeira escura, torto
    const pontosDaCumeeira: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const z = (i / 6 - 0.5) * (comprido + 0.06);
      pontosDaCumeeira.push(new THREE.Vector3(0, cumeeira + 0.07 - 0.1 * Math.cos((z / comprido) * Math.PI) * 0.6, z));
    }
    por(corpo, galho(pontosDaCumeeira, 0.07, 0.065, 20, 8), madeiraEscura);
    // na ponta da frente da cumeeira, uma abóborinha de cata-vento
    const cata = new LoteDeAboboras().por({ x: 0, y: cumeeira + 0.12, z: comprido / 2 - 0.1, raio: 0.12, cara: 'sorriso', giro: 0 });
    corpo.add(cata.montar({ acesas: true, semPoca: true }));
    this.cataVento = cata;

    // ---- a chaminé de pedra, tombando para a esquerda, e a fumacinha
    const xChamine = -0.82;
    const zChamine = -0.6;
    const baseChamine = H + (L / 2 - Math.abs(xChamine)) * Math.tan(inclina) - 0.25;
    const altoChamine = cumeeira + 0.7 - baseChamine;
    const chamine = new THREE.Group();
    chamine.position.set(xChamine, baseChamine, zChamine);
    chamine.rotation.z = 0.16;
    chamine.rotation.x = -0.05;
    corpo.add(chamine);
    por(chamine, uvDeParede(quina(0.42, altoChamine, 0.42, 0.04), 0, 0, 0), pedra, 0, altoChamine / 2, 0);
    por(chamine, quina(0.52, 0.08, 0.52, 0.02), toon(P.casinhaPedraEscura), 0, altoChamine + 0.02, 0);
    por(chamine, new THREE.BoxGeometry(0.3, 0.02, 0.3), toon(P.aboboraOco), 0, altoChamine + 0.065, 0);
    chamine.updateMatrix();
    this.bocaDaChamine.set(0, altoChamine + 0.1, 0).applyMatrix4(chamine.matrix);
    this.bocaDaChamine.x += this.bocaDaChamine.y * TORTO;
    const N = 9;
    this.fumaca = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), toon(P.fumacaDaChamine, { opacity: 0.75 }), N);
    this.fumaca.name = 'fumaca-da-chamine';
    this.fumaca.userData.semSombra = true;
    this.fumaca.frustumCulled = false;
    for (let i = 0; i < N; i++) this.bolotas.push({ t: i / N, vel: 0.18 + (i % 3) * 0.03, lado: (i % 2 ? 1 : -1) * (0.3 + (i % 4) * 0.1) });
    g.add(this.fumaca);

    // ---- a lanterna de ferro pendurada do lado da porta
    const braco = new THREE.Group();
    braco.position.set(xPorta - vao / 2 - 0.3, 1.85, F / 2 + 0.02);
    corpo.add(braco);
    por(braco, quina(0.05, 0.05, 0.36, 0.01), ferro, 0, 0, 0.16);
    por(braco, new THREE.CylinderGeometry(0.004, 0.004, 0.14, 4), ferro, 0, -0.07, 0.32);
    const lanterna = new THREE.Group();
    lanterna.position.set(0, -0.26, 0.32);
    braco.add(lanterna);
    por(lanterna, new THREE.CylinderGeometry(0.075, 0.09, 0.2, 6, 1, true), toon(P.casinhaJanela, { glow: 0.9 }), 0, 0, 0);
    por(lanterna, new THREE.ConeGeometry(0.11, 0.1, 6), ferro, 0, 0.15, 0);
    por(lanterna, new THREE.CylinderGeometry(0.1, 0.08, 0.03, 6), ferro, 0, -0.11, 0);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      por(lanterna, new THREE.CylinderGeometry(0.006, 0.006, 0.21, 4), ferro, Math.cos(a) * 0.082, 0, Math.sin(a) * 0.082);
    }
    const haloLanterna = haloDeLampada(1.1, P.luzDeAbobora, 0.55);
    haloLanterna.position.set(braco.position.x + (braco.position.y - 0.26) * TORTO, braco.position.y - 0.26, braco.position.z + 0.32);
    g.add(haloLanterna);
    const pocaLanterna = pocaDeLuz(1.5, P.luzDeAbobora, 0.42);
    pocaLanterna.position.set(xPorta, 0.03, F / 2 + 0.9);
    g.add(pocaLanterna);
    const pocaJanela = pocaDeLuz(0.9, P.casinhaJanela, 0.28);
    pocaJanela.position.set(0.86, 0.03, F / 2 + 0.7);
    g.add(pocaJanela);

    // ---- o capacho na frente da porta
    const capacho = new THREE.Mesh(quina(0.7, 0.025, 0.42, 0.01), toon(P.capimSeco));
    capacho.position.set(xPorta, 0.15, F / 2 + 0.62);
    corpo.add(capacho);

    // O TORTO: o corpo inteiro tomba para a direita (cisalhamento passado na
    // geometria, para a `fundir` juntar e as normais virem certas). A porta
    // tomba junto (a dobradiça é a mesma), e a chaminé já tomba ao contrário.
    const torto = new THREE.Matrix4().makeShear(0, 0, TORTO, 0, 0, 0);
    entortar(corpo, torto);
    fundir(g);
  }

  /** onde fica a frente da porta (no chão, a 75 cm dela), no referencial da casinha */
  static frenteDaPorta(): THREE.Vector3 {
    return new THREE.Vector3(CASINHA_TORTA.xPorta, 0, CASINHA_TORTA.fundo / 2 + 0.75);
  }

  update(dt: number): void {
    this.tempo += dt;
    this.cataVento.tremer(this.tempo);
    // a chama da vela
    const t = this.tempo;
    this.chama.scale.set(0.8, 1.5 + Math.sin(t * 13) * 0.18 + Math.sin(t * 7.3) * 0.12, 0.8);
    // a fumacinha: bolotas que sobem, crescem, derivam com o vento e somem
    const m = new THREE.Matrix4();
    const p = new THREE.Vector3();
    this.bolotas.forEach((b, i) => {
      b.t = (b.t + dt * b.vel) % 1;
      const k = b.t;
      p.copy(this.bocaDaChamine).add(new THREE.Vector3(0.35 * k * k + Math.sin(k * 6 + i) * 0.05 * b.lado, k * 1.5, 0.15 * k));
      const s = (0.07 + k * 0.2) * Math.min(1, k * 6) * (1 - Math.max(0, k - 0.75) * 4);
      m.makeScale(s, s * 0.85, s).setPosition(p);
      this.fumaca.setMatrixAt(i, m);
    });
    this.fumaca.instanceMatrix.needsUpdate = true;
  }
}

/**
 * Passa a matriz `torto` (no referencial de `raiz`) para a geometria de
 * toda malha que não é lote (e não está em grupo com nome que se mexe, a não
 * ser a porta, que tomba junto). O lote de abóboras só anda junto.
 */
function entortar(raiz: THREE.Object3D, torto: THREE.Matrix4): void {
  raiz.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(raiz.matrixWorld).invert();
  const malhas: THREE.Mesh[] = [];
  raiz.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && !(m as unknown as THREE.InstancedMesh).isInstancedMesh) malhas.push(m);
  });
  for (const m of malhas) {
    // a matriz da malha no referencial da raiz, entortada, e de volta para o pai dela
    const local = new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld);
    const paiLocal = new THREE.Matrix4().multiplyMatrices(inv, (m.parent ?? raiz).matrixWorld);
    const final = new THREE.Matrix4().copy(paiLocal).invert().multiply(torto).multiply(local);
    m.geometry = m.geometry.clone().applyMatrix4(final);
    m.position.set(0, 0, 0);
    m.rotation.set(0, 0, 0);
    m.scale.set(1, 1, 1);
  }
  // os lotes (as abóborinhas) só andam com o cisalhamento do ponto deles
  raiz.traverse((o) => {
    const im = o as THREE.InstancedMesh;
    if (!im.isInstancedMesh) return;
    const mt = new THREE.Matrix4();
    const p = new THREE.Vector3();
    for (let i = 0; i < im.count; i++) {
      im.getMatrixAt(i, mt);
      p.setFromMatrixPosition(mt);
      mt.setPosition(p.x + p.y * TORTO, p.y, p.z);
      im.setMatrixAt(i, mt);
    }
    im.instanceMatrix.needsUpdate = true;
  });
}

// ============================================================ o caminho e a névoa

/**
 * O CAMINHO DE PEDRINHAS: pedras chatas e amassadas, em lote, de dois em
 * dois ao longo da curva (uma de cada lado do meio, alternando), afundadas
 * no chão até só a corcova aparecer.
 */
export function caminhoDePedrinhas(pontos: readonly THREE.Vector3[], passo = 0.62, semente = 1): THREE.InstancedMesh {
  const curva = new THREE.CatmullRomCurve3(pontos.map((p) => p.clone()));
  const comprimento = curva.getLength();
  const n = Math.floor(comprimento / passo);
  const rnd = sorteio(9300 + semente);
  // a pedra: icosaedro amassado pela POSIÇÃO (as quinas iguais recebem o mesmo empurrão)
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const pos = geo.getAttribute('position');
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = 1 + Math.sin(v.x * 7.1 + v.z * 3.3) * 0.08 + Math.cos(v.z * 5.7 - v.x * 2.1) * 0.07;
    v.multiplyScalar(r);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const im = new THREE.InstancedMesh(geo, toon(0xffffff), n);
  im.name = 'pedrinhas-do-caminho';
  im.userData.peca = 'caminho-de-pedrinhas';
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const cor = new THREE.Color();
  const lado = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const p = curva.getPointAt(t);
    const tg = curva.getTangentAt(t);
    lado.set(-tg.z, 0, tg.x).normalize();
    p.addScaledVector(lado, (i % 2 ? 1 : -1) * (0.12 + rnd() * 0.08));
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * Math.PI);
    const sx = 0.2 + rnd() * 0.08;
    const sz = 0.16 + rnd() * 0.07;
    p.y = 0.005;
    m.compose(p, q, new THREE.Vector3(sx, 0.05, sz));
    im.setMatrixAt(i, m);
    im.setColorAt(i, cor.setHex(rnd() < 0.3 ? P.pedrinhaDoCaminhoEscura : P.pedrinhaDoCaminho).multiplyScalar(0.9 + rnd() * 0.15));
  }
  im.userData.semSombra = true;
  return im;
}

/**
 * A NÉVOA RENTE AO CHÃO: discos macios deitados (o material `nevoa`, que
 * embaça sem acender), cada um derivando devagar num círculo e respirando.
 * Um lote só.
 */
export class NevoaBaixa {
  readonly group = new THREE.Group();
  private readonly im: THREE.InstancedMesh;
  private readonly discos: Array<{ x: number; z: number; r: number; fase: number; raio: number; y: number }> = [];
  private tempo = 0;

  constructor(area: { minX: number; maxX: number; minZ: number; maxZ: number }, quantos = 18, semente = 1) {
    const rnd = sorteio(9900 + semente);
    for (let i = 0; i < quantos; i++) {
      this.discos.push({
        x: area.minX + rnd() * (area.maxX - area.minX),
        z: area.minZ + rnd() * (area.maxZ - area.minZ),
        r: 2.2 + rnd() * 2.4,
        fase: rnd() * Math.PI * 2,
        raio: 0.6 + rnd() * 1.2,
        y: 0.12 + rnd() * 0.3,
      });
    }
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    this.im = new THREE.InstancedMesh(geo, nevoa(P.nevoaDaClareira, 0.13), quantos);
    this.im.name = 'nevoa-baixa';
    this.im.userData.semSombra = true;
    this.im.frustumCulled = false;
    this.im.renderOrder = 4;
    this.group.add(this.im);
    this.group.userData.peca = 'nevoa-baixa';
    this.update(0);
  }

  update(dt: number): void {
    this.tempo += dt;
    const m = new THREE.Matrix4();
    this.discos.forEach((d, i) => {
      const a = d.fase + this.tempo * 0.06;
      const s = d.r * (1 + Math.sin(this.tempo * 0.4 + d.fase) * 0.08);
      m.makeScale(s * 2, 1, s * 2).setPosition(d.x + Math.cos(a) * d.raio, d.y, d.z + Math.sin(a) * d.raio);
      this.im.setMatrixAt(i, m);
    });
    this.im.instanceMatrix.needsUpdate = true;
  }
}
