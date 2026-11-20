/**
 * OS RETRATOS DA PORTARIA — a foto de cada bicho nas carteirinhas, nos
 * crachás e na janela da mesa (`docs/PORTARIA-DO-CLUBE.md`).
 *
 * O RETRATO TEM QUE SER O BICHO. Cada personagem que já existe no jogo é
 * pintado a partir do MODELO dele (fotografado de perto antes de desenhar):
 * a lua e o laço amarelo da Luna, o sol da Sol, a estrela e as orelhas caídas
 * da Estrella, os cachos dourados e as molinhas da Tia Liz, a casquinha na
 * cabeça do Mano, a boina e a camisa da França do Jean-Luc, o laço rosa da
 * Josefina, a cabeça azulada e o boné do Noel, os óculos esportivos na testa
 * do Capy, o quepe azul do Cookie, a faixa dos Gatitos do Flynn, a faixa dos
 * Dogões do Rocco, os óculos gatinho na cabeça da Valentina, o quepe e a
 * crista do Pietro. E os visitantes NOVOS levam o que os modelos deles têm
 * de só seu (`entities/bichos/VisitanteDaPortaria.ts`): a toalha do Seu
 * Hipólito, as pérolas da Dona Alpacina, a gravata e o colete do Bento, o boné
 * virado do Beto, o boné do Papita do Tatá, o xale e os óculos da Dona
 * Preguiça, os óculos de natação da lontra, o sino do bode, o gorro do coala,
 * o rabo listrado do panda-vermelho e a cara fechada do texugo.
 *
 * Quem decide a ASSINATURA de cada um é a ficha (`Retrato`): a cor pelo nome
 * (`PELAGEM`), a marca (o que distingue), o cabelo e o enfeite. A foto BATE
 * por espécie, cor e marca; o resto (penteado, chapéu, roupa) não conta.
 */
import { PALETTE as P } from '../palette';
import type { Especie, Retrato } from '../minigames/portaria/tipos';

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** clareia (k > 1) ou escurece (k < 1) uma cor da paleta */
export function tom(c: number, k: number): string {
  const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
  const f = (v: number): number => Math.max(0, Math.min(255, Math.round(k >= 1 ? v + (255 - v) * (k - 1) : v * k)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

/** a pelagem pelo nome (o `Retrato.cor`): as genéricas e a de cada bicho que já tem modelo */
export const PELAGEM: Readonly<Record<string, number>> = {
  lilas: P.peloLilas, creme: P.peloCreme, rosa: P.peloRosa, caramelo: P.peloCaramelo, bege: P.peloBege,
  marrom: P.peloMarrom, chocolate: P.peloChocolate, mel: P.peloMel, cinza: P.peloCinza, cinzaClaro: P.peloCinzaClaro,
  cinzaAzulado: P.peloCinzaAzulado, cinzaEscuro: P.peloCinzaEscuro, cinzaRosado: P.peloCinzaRosado, grafite: P.peloGrafite,
  branco: P.peloBranco, branca: P.peloBranco, malhado: P.peloMalhado, ferrugem: P.peloFerrugem, laranja: P.peloLaranja,
  vermelhoEscuro: P.peloVermelhoEscuro, pretoEBranco: P.peloPretoEBranco, verde: P.peloVerde, azulMarinho: P.peloAzulMarinho,
  azulPelucia: P.peloAzulPelucia, azulPavao: P.peloAzulPavao, variado: P.peloVariado,
  // a de cada bicho que já tem modelo: a mesma cor do corpo dele
  luna: P.lunaPelo, sol: P.solPelo, estrella: P.estrellaPelo, liz: P.lizPelo, gatito: P.gatitoCreme,
  flynn: P.flynnPelo, rocco: P.roccoPelo, valentina: P.valentinaPena, pavao: P.pavaoAzul, capivara: P.capivaraPelo,
  peru: P.peruPena, tartaruga: P.tartarugaPele, ovelha: P.ovelhaLa, elefante: P.elefantePele, pato: P.patoPena,
  pinguim: P.pinguimCasaco, dogao: P.dogaoPelo,
};

type Orelha = 'banana' | 'redonda' | 'pontuda' | 'comprida' | 'caida' | 'pequena' | 'enorme' | 'nenhuma' | 'horizontal' | 'penacho' | 'fofa';
type Focinho = 'largo' | 'tromba' | 'bico' | 'bicoChato' | 'bicoComprido' | 'porco' | 'curto' | 'longo' | 'tubo' | 'quadrado' | 'coelho' | 'nenhum';

/** o desenho de cada espécie: o tamanho da cabeça (fração do quadro), as orelhas e o focinho */
const DESENHO: Readonly<Record<Especie, { rx: number; ry: number; orelha: Orelha; focinho: Focinho; claro?: boolean }>> = {
  hipopotamo: { rx: 0.37, ry: 0.31, orelha: 'pequena', focinho: 'largo' },
  alpaca: { rx: 0.24, ry: 0.29, orelha: 'banana', focinho: 'curto', claro: true },
  porquinho: { rx: 0.32, ry: 0.28, orelha: 'caida', focinho: 'porco' },
  tamandua: { rx: 0.22, ry: 0.23, orelha: 'pequena', focinho: 'tubo' },
  preguica: { rx: 0.29, ry: 0.27, orelha: 'nenhuma', focinho: 'curto', claro: true },
  lontra: { rx: 0.27, ry: 0.24, orelha: 'pequena', focinho: 'curto', claro: true },
  bode: { rx: 0.23, ry: 0.3, orelha: 'horizontal', focinho: 'quadrado' },
  coala: { rx: 0.3, ry: 0.27, orelha: 'fofa', focinho: 'curto' },
  pandaVermelho: { rx: 0.29, ry: 0.26, orelha: 'pontuda', focinho: 'curto', claro: true },
  texugo: { rx: 0.28, ry: 0.25, orelha: 'pequena', focinho: 'longo' },
  peru: { rx: 0.2, ry: 0.23, orelha: 'nenhuma', focinho: 'bico' },
  tartaruga: { rx: 0.25, ry: 0.24, orelha: 'nenhuma', focinho: 'nenhum' },
  capivara: { rx: 0.3, ry: 0.28, orelha: 'pequena', focinho: 'quadrado' },
  pato: { rx: 0.28, ry: 0.27, orelha: 'nenhuma', focinho: 'bicoChato' },
  ovelha: { rx: 0.27, ry: 0.28, orelha: 'horizontal', focinho: 'curto' },
  pinguim: { rx: 0.29, ry: 0.29, orelha: 'nenhuma', focinho: 'bico' },
  elefante: { rx: 0.29, ry: 0.28, orelha: 'enorme', focinho: 'tromba' },
  gato: { rx: 0.31, ry: 0.27, orelha: 'pontuda', focinho: 'curto' },
  ursa: { rx: 0.31, ry: 0.28, orelha: 'redonda', focinho: 'curto', claro: true },
  coelha: { rx: 0.27, ry: 0.26, orelha: 'comprida', focinho: 'coelho' },
  raposa: { rx: 0.29, ry: 0.25, orelha: 'pontuda', focinho: 'longo', claro: true },
  lobo: { rx: 0.29, ry: 0.27, orelha: 'pontuda', focinho: 'longo', claro: true },
  cachorro: { rx: 0.29, ry: 0.27, orelha: 'caida', focinho: 'curto', claro: true },
  flamingo: { rx: 0.21, ry: 0.23, orelha: 'nenhuma', focinho: 'bicoComprido' },
  pavao: { rx: 0.21, ry: 0.23, orelha: 'penacho', focinho: 'bico' },
};

const TRACO = 'rgba(40,30,30,0.55)';

/**
 * PINTA O RETRATO no quadro (x, y, l, a): o fundo de estúdio, os ombros (a
 * roupa de cada um), a cabeça da espécie, o rosto, a marca, o cabelo, o que
 * vai na cabeça e o disfarce. `tapado` cobre a cara (o capacete do Capy).
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
  const fy = cy + ry * 0.35; // o meio do focinho
  const oy = cy - ry * 0.05; // a linha dos olhos
  const base = y + a; // o pé do quadro (os ombros)
  const e = r.enfeite;
  const m = r.marca;
  const lw = Math.max(1, s * 0.012);

  // ------------------------------------------------------------ as ferramentas
  const el = (px: number, py: number, erx: number, ery: number, rot = 0): void => {
    c.beginPath();
    c.ellipse(px, py, Math.max(0.5, erx), Math.max(0.5, ery), rot, 0, Math.PI * 2);
  };
  const pinta = (cor: string | number, contorno = false): void => {
    c.fillStyle = typeof cor === 'number' ? css(cor) : cor;
    c.fill();
    if (contorno) c.stroke();
  };
  const traco = (cor: string | number, larg = 1): void => {
    c.strokeStyle = typeof cor === 'number' ? css(cor) : cor;
    c.lineWidth = lw * larg;
    c.stroke();
    c.strokeStyle = TRACO;
    c.lineWidth = lw;
  };
  /** um laço de fita (as duas asas e o nó) */
  const laco = (px: number, py: number, tam: number, cor: number | string, no: number | string = cor, giro = 0): void => {
    c.save();
    c.translate(px, py);
    c.rotate(giro);
    for (const lado of [-1, 1]) {
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(lado * tam * 0.9, -tam * 0.75, lado * tam * 1.05, 0);
      c.quadraticCurveTo(lado * tam * 0.9, tam * 0.75, 0, 0);
      pinta(cor, true);
    }
    el(0, 0, tam * 0.28, tam * 0.32);
    pinta(no, true);
    c.restore();
  };
  /** uma estrela de cinco pontas */
  const estrela = (px: number, py: number, raio: number, cor: number, giro = 0): void => {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const ang = giro - Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? raio * 0.45 : raio;
      c.lineTo(px + Math.cos(ang) * rr, py + Math.sin(ang) * rr);
    }
    c.closePath();
    pinta(cor, true);
  };
  /** um bonezinho (a copa e a aba; `virado` põe a aba para trás) */
  const bone = (cor: number, virado = false, aba: number = cor): void => {
    c.beginPath();
    c.ellipse(cx, cy - ry * 0.62, rx * 0.86, ry * 0.58, 0, Math.PI, 0);
    pinta(cor, true);
    el(cx, cy - ry * 1.2, rx * 0.08, rx * 0.06);
    pinta(tom(cor, 0.8));
    if (virado) {
      el(cx - rx * 0.75, cy - ry * 0.72, rx * 0.4, ry * 0.1, 0.35);
      pinta(tom(aba, 0.85), true);
    } else {
      el(cx + rx * 0.35, cy - ry * 0.6, rx * 0.68, ry * 0.12, 0.05);
      pinta(tom(aba, 0.85), true);
    }
  };
  /** o olho fofo: o oval escuro com dois brilhos, e a cor do olho embaixo quando tem */
  const olho = (px: number, py: number, iris?: number, cilio = false, meio = false): void => {
    const orx = rx * 0.095;
    const ory = ry * (meio ? 0.07 : 0.12);
    el(px, py, orx, ory);
    pinta('#231c1c');
    if (iris !== undefined && !meio) {
      c.save();
      el(px, py, orx, ory);
      c.clip();
      el(px, py + ory * 0.7, orx * 1.1, ory * 0.75);
      pinta(iris);
      c.restore();
    }
    el(px + orx * 0.35, py - ory * 0.4, orx * 0.36, ory * 0.3);
    pinta('#ffffff');
    el(px - orx * 0.35, py + ory * 0.35, orx * 0.16, ory * 0.13);
    pinta('rgba(255,255,255,0.8)');
    if (cilio) {
      // os cílios: dois risquinhos no canto de FORA, subindo (no meio do olho, viravam sobrancelha brava)
      const lado = px < cx ? -1 : 1;
      for (const k of [0, 1]) {
        c.beginPath();
        c.moveTo(px + lado * orx * (0.7 + k * 0.15), py - ory * (0.55 - k * 0.3));
        c.lineTo(px + lado * orx * (1.35 + k * 0.2), py - ory * (0.95 - k * 0.3));
        traco('#231c1c', 1.3);
      }
    }
  };
  /** a sobrancelha: `giro` positivo é brava (desce no meio), negativo é preocupada */
  const sobrancelha = (lado: number, giro: number, cor = '#3a2a24', larg = 2): void => {
    const px = cx + lado * rx * 0.36;
    const py = oy - ry * 0.26;
    c.beginPath();
    c.moveTo(px - rx * 0.12, py - lado * giro * ry * 0.08);
    c.lineTo(px + rx * 0.12, py + lado * giro * ry * 0.08);
    traco(cor, larg);
  };

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
  c.lineWidth = lw;
  c.strokeStyle = TRACO;

  // ================================================================ ATRÁS DA CABEÇA
  // o leque do peru (o Noel abre a cauda atrás da cabeça)
  if (r.especie === 'peru') {
    for (let i = 0; i < 9; i++) {
      const ang = Math.PI * (1.05 + (i / 8) * 0.9);
      c.save();
      c.translate(cx, cy + ry * 0.9);
      c.rotate(ang + Math.PI / 2);
      c.beginPath();
      c.roundRect(-s * 0.05, -s * 0.5, s * 0.1, s * 0.46, s * 0.04);
      pinta(i % 2 ? P.peruPena : P.peruPenaClara, true);
      c.fillStyle = css(P.peruBarra);
      c.fillRect(-s * 0.05, -s * 0.5, s * 0.1, s * 0.045);
      c.restore();
    }
  }
  // o casco da tartaruga (e o de papelão do Jean-Luc), por trás dos ombros
  if (e === 'cascoDePapelao' || r.especie === 'tartaruga') {
    const papelao = e === 'cascoDePapelao';
    el(cx, base - a * 0.04, s * 0.52, s * 0.26);
    pinta(papelao ? P.papelao : P.tartarugaCasco, true);
    c.strokeStyle = papelao ? 'rgba(90,60,30,0.7)' : css(P.tartarugaEscudo);
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(cx + k * s * 0.12, base - a * 0.16); c.lineTo(cx + k * s * 0.1, base + a * 0.08); c.stroke(); }
    c.strokeStyle = TRACO;
    if (papelao) { c.fillStyle = 'rgba(240,235,200,0.8)'; c.fillRect(cx - s * 0.32, base - a * 0.1, s * 0.18, s * 0.05); }
  }
  // o rabo listrado do panda-vermelho, enrolado em volta do pescoço como um cachecol (ele é tímido)
  const rabo = r.especie === 'pandaVermelho';

  // ================================================================ OS OMBROS (a roupa de cada um)
  const roupa = ((): number => {
    if (r.especie === 'coelha') return P.lunaUniforme;
    if (r.marca === 'uniformeVermelho' || e === 'faixaDosDogoes') return P.dogoesVermelho;
    if (r.especie === 'raposa') return P.gatitosAzul;
    if (r.especie === 'ursa') return P.lizBlusa;
    if (r.especie === 'peru' || r.especie === 'tartaruga') return P.aventalDoNoel;
    if (r.especie === 'capivara') return P.salvaVidasVermelho;
    if (r.especie === 'pato') return P.camisaDoJeanLuc;
    if (r.especie === 'pinguim') return P.pinguimCasaco;
    if (r.especie === 'pavao') return P.motoristaQuepe;
    if (r.especie === 'flamingo') return P.gatitosAzul;
    if (e === 'gravatinha') return P.portariaColete;
    if (e === 'bone') return P.portariaCamisetaBeto;
    if (e === 'boneDoPapita') return P.portariaPapita;
    if (e === 'oculosDeLeitura') return P.portariaXale;
    return pelo;
  })();
  el(cx, base + a * 0.02, s * 0.46, s * 0.3);
  pinta(roupa, true);
  // a gola, o peito e o que vai pendurado
  if (r.especie === 'pinguim' || r.marca === 'peitoBranco') { el(cx, base, s * 0.2, s * 0.22); pinta(P.pinguimBarriga); }
  if (r.especie === 'coelha' || r.especie === 'raposa') {
    // a gola amarela dos Gatitos e o G no peito
    c.beginPath(); c.moveTo(cx - s * 0.16, base - a * 0.15); c.quadraticCurveTo(cx, base - a * 0.06, cx + s * 0.16, base - a * 0.15);
    traco(P.gatitosAmarelo, 3);
    el(cx, base - a * 0.03, s * 0.05, s * 0.05); pinta(P.gatitosAmarelo);
  }
  if (r.especie === 'pato') {
    // a camisa da França: a faixa azul, branca e vermelha no peito
    const t = s * 0.08;
    [P.azulFranca, P.patoPena, P.vermelhoFranca].forEach((cor, k) => { c.fillStyle = css(cor); c.fillRect(cx - t * 1.5 + k * t, base - a * 0.09, t, a * 0.09); });
  }
  if (r.especie === 'pavao') {
    // a gola branca e a gravata-borboleta preta do motorista
    el(cx, base - a * 0.1, s * 0.14, s * 0.06); pinta(P.portariaCamisa);
    laco(cx, base - a * 0.09, s * 0.05, 0x1d1f2a, 0x1d1f2a);
  }
  if (r.especie === 'ursa') { for (const k of [0, 1]) { el(cx, base - a * 0.06 + k * a * 0.05, s * 0.012, s * 0.012); pinta(P.lizBotao); } }
  if (r.especie === 'capivara') { c.fillStyle = css(P.salvaVidasBranco); c.fillRect(cx - s * 0.06, base - a * 0.14, s * 0.12, a * 0.14); }
  if (r.especie === 'peru' || r.especie === 'tartaruga') { c.fillStyle = css(P.aventalFaixa); c.fillRect(cx - s * 0.4, base - a * 0.08, s * 0.8, a * 0.025); }
  if (r.marca === 'faixaNoPeito' || r.especie === 'tamandua') {
    // a faixa preta de tamanduá, de um ombro ao peito
    c.beginPath(); c.moveTo(cx - s * 0.42, base - a * 0.14); c.lineTo(cx + s * 0.1, base); c.lineTo(cx + s * 0.02, base + a * 0.05); c.lineTo(cx - s * 0.45, base - a * 0.05);
    pinta('#2b2622');
    // as alças da mochila térmica do Papita
    for (const lado of [-1, 1]) { c.fillStyle = css(P.portariaPapitaEscuro); c.fillRect(cx + lado * s * 0.24 - s * 0.03, base - a * 0.17, s * 0.06, a * 0.2); }
  }
  if (e === 'gravatinha') {
    // o Bento: a camisa branca por baixo do colete, e a gravata-borboleta
    c.beginPath(); c.moveTo(cx - s * 0.1, base - a * 0.15); c.lineTo(cx, base - a * 0.02); c.lineTo(cx + s * 0.1, base - a * 0.15); pinta(P.portariaCamisa);
    laco(cx, base - a * 0.12, s * 0.06, P.portariaGravata, P.portariaGravata);
  }
  if (r.especie === 'hipopotamo') {
    // a toalha listrada no ombro do Seu Hipólito
    c.save();
    c.translate(cx + s * 0.26, base - a * 0.06);
    c.rotate(-0.5);
    c.beginPath(); c.roundRect(-s * 0.07, -s * 0.14, s * 0.14, s * 0.32, s * 0.03);
    pinta(P.portariaToalha, true);
    for (const k of [0, 1, 2]) { c.fillStyle = css(P.portariaToalhaListra); c.fillRect(-s * 0.07, -s * 0.1 + k * s * 0.09, s * 0.14, s * 0.025); }
    c.restore();
  }
  if (r.especie === 'preguica' && e === 'oculosDeLeitura') {
    // as florzinhas de crochê no xale
    for (const k of [-1, 1]) { el(cx + k * s * 0.22, base - a * 0.05, s * 0.03, s * 0.03); pinta(P.portariaXaleFlor); }
  }
  if (r.especie === 'bode') {
    // a coleira com o sininho
    c.beginPath(); c.ellipse(cx, base - a * 0.15, s * 0.12, s * 0.04, 0, 0, Math.PI); traco(P.portariaColeira, 3.5);
    el(cx, base - a * 0.08, s * 0.035, s * 0.04); pinta(P.portariaSino, true);
  }
  if (r.marca === 'apitoNoPeito' || r.especie === 'raposa') {
    // o cordão vermelho com o apito
    c.beginPath(); c.moveTo(cx - s * 0.12, base - a * 0.18); c.lineTo(cx, base - a * 0.07); c.lineTo(cx + s * 0.12, base - a * 0.18);
    traco(P.flynnCordao, 1.6);
    el(cx, base - a * 0.06, s * 0.03, s * 0.02); pinta(P.flynnApito, true);
  }
  if (e === 'faixaDosDogoes') {
    // a corrente prateada do Rocco
    c.beginPath(); c.moveTo(cx - s * 0.13, base - a * 0.18); c.quadraticCurveTo(cx, base - a * 0.02, cx + s * 0.13, base - a * 0.18);
    c.setLineDash([s * 0.012, s * 0.008]); traco(P.dogoesCorrente, 2.4); c.setLineDash([]);
  }
  if (r.especie === 'ovelha') {
    // a fita métrica da costureira, pendurada no pescoço
    for (const lado of [-1, 1]) {
      c.beginPath(); c.moveTo(cx + lado * s * 0.1, base - a * 0.17); c.lineTo(cx + lado * s * 0.16, base + a * 0.02);
      traco(P.ovelhaFita, 3.6);
    }
  }
  if (r.especie === 'flamingo') { el(cx, base - a * 0.12, s * 0.12, s * 0.035); pinta(P.gatitosAmarelo); }

  // ---- o pescoço (os compridos)
  if (r.especie === 'alpaca' || r.especie === 'flamingo' || r.especie === 'pavao' || r.especie === 'peru') {
    c.fillStyle = r.especie === 'peru' ? css(P.peruCabeca) : css(pelo);
    c.fillRect(cx - s * 0.08, cy, s * 0.16, a * 0.48);
  }
  // (o colar vai DEPOIS do pescoço: antes, o pescoço tapava as pérolas do meio)
  if (r.especie === 'alpaca') {
    // o colar de pérolas (a Alpacina e a prima, que copia tudo)
    for (let k = -4; k <= 4; k++) {
      const px = cx + k * s * 0.036;
      const py = base - a * 0.1 + k * k * s * 0.0035;
      el(px, py, s * 0.02, s * 0.02); pinta(P.portariaPerola);
      c.strokeStyle = 'rgba(120,110,100,0.6)'; c.stroke(); c.strokeStyle = TRACO;
      el(px - s * 0.006, py - s * 0.006, s * 0.006, s * 0.006); pinta('#ffffff');
    }
  }

  // ================================================================ AS ORELHAS (atrás da cabeça)
  const dentroDaOrelha = r.cor === 'luna' ? P.lunaOrelhaDentro : r.cor === 'sol' ? P.solOrelhaDentro : r.cor === 'estrella' ? P.estrellaOrelhaDentro
    : r.cor === 'flynn' ? P.flynnOrelhaDentro : r.cor === 'rocco' ? P.roccoOrelhaDentro : r.cor === 'dogao' ? P.dogaoOrelhaDentro : null;
  const orelha = (lado: number): void => {
    const ox = cx + lado * rx * 0.78;
    const oy = cy - ry * 0.72;
    let tipo = d.orelha;
    if (r.especie === 'coelha' && m === 'estrelaNaCabeca') tipo = 'caida';
    c.fillStyle = css(pelo);
    switch (tipo) {
      case 'redonda':
        el(ox, oy, rx * 0.32, rx * 0.32); pinta(pelo, true);
        el(ox, oy, rx * 0.17, rx * 0.17); pinta(r.especie === 'ursa' ? css(P.lizOrelhaDentro) : claro);
        break;
      case 'pequena': el(ox, oy + ry * 0.12, rx * 0.2, rx * 0.17); pinta(pelo, true); el(ox, oy + ry * 0.12, rx * 0.1, rx * 0.08); pinta(escuro); break;
      case 'pontuda':
        c.beginPath(); c.moveTo(ox - lado * rx * 0.3, oy + ry * 0.25); c.lineTo(ox + lado * rx * 0.12, oy - ry * 0.6); c.lineTo(ox + lado * rx * 0.4, oy + ry * 0.2); c.closePath(); pinta(pelo, true);
        c.beginPath(); c.moveTo(ox - lado * rx * 0.12, oy + ry * 0.15); c.lineTo(ox + lado * rx * 0.12, oy - ry * 0.34); c.lineTo(ox + lado * rx * 0.25, oy + ry * 0.12);
        pinta(dentroDaOrelha ?? (d.claro ? '#f7efe4' : claro));
        if (r.especie === 'raposa' || r.especie === 'lobo') { c.beginPath(); c.moveTo(ox + lado * rx * 0.05, oy - ry * 0.4); c.lineTo(ox + lado * rx * 0.12, oy - ry * 0.6); c.lineTo(ox + lado * rx * 0.2, oy - ry * 0.38); pinta(r.especie === 'raposa' ? P.flynnPeloEscuro : P.roccoPeloEscuro); }
        break;
      case 'comprida': {
        // a orelha de coelha, em pé, com o rosa dentro
        const inclina = lado * (r.cor === 'luna' ? 0.22 : 0.1);
        el(ox + lado * rx * 0.05, oy - ry * 0.78, rx * 0.19, ry * 0.85, inclina); pinta(pelo, true);
        el(ox + lado * rx * 0.05, oy - ry * 0.72, rx * 0.09, ry * 0.65, inclina); pinta(dentroDaOrelha ?? 0xf4c6cf);
        break;
      }
      case 'caida':
        if (r.especie === 'coelha') {
          // a Estrella: as orelhas compridas caídas pelos lados, como tranças
          el(ox + lado * rx * 0.32, oy + ry * 0.62, rx * 0.2, ry * 0.75, lado * -0.25); pinta(pelo, true);
          el(ox + lado * rx * 0.3, oy + ry * 0.62, rx * 0.09, ry * 0.58, lado * -0.25); pinta(dentroDaOrelha ?? escuro);
        } else {
          el(ox + lado * rx * 0.22, oy + ry * 0.35, rx * 0.24, ry * 0.42, lado * -0.35);
          pinta(r.especie === 'porquinho' ? tom(pelo, 0.9) : escuro, true);
        }
        break;
      case 'enorme':
        el(ox + lado * rx * 0.25, oy + ry * 0.15, rx * 0.55, ry * 0.65); pinta(pelo, true);
        el(ox + lado * rx * 0.25, oy + ry * 0.15, rx * 0.35, ry * 0.45); pinta(r.especie === 'elefante' ? P.elefanteOrelha : claro);
        break;
      case 'fofa':
        // a orelha de coala: redonda e grande, com o tufo branco por dentro
        el(ox + lado * rx * 0.22, oy + ry * 0.05, rx * 0.46, rx * 0.44); pinta(pelo, true);
        el(ox + lado * rx * 0.22, oy + ry * 0.07, rx * 0.3, rx * 0.28); pinta('#f4f1ec');
        break;
      case 'horizontal':
        el(ox + lado * rx * 0.45, oy + ry * 0.3, rx * 0.36, ry * 0.12, lado * 0.2);
        pinta(r.especie === 'ovelha' ? P.ovelhaCara : pelo, true);
        break;
      case 'banana':
        el(ox + lado * rx * 0.02, oy - ry * 0.32, rx * 0.15, ry * 0.36, lado * 0.32); pinta(pelo, true);
        el(ox + lado * rx * 0.02, oy - ry * 0.3, rx * 0.07, ry * 0.24, lado * 0.32); pinta(claro);
        break;
      case 'nenhuma': case 'penacho': break;
    }
  };
  orelha(-1);
  orelha(1);
  if (r.especie === 'bode') {
    // os chifres (o torto do figurante entorta um)
    for (const lado of [-1, 1]) {
      const torto = m === 'chifreTorto' && lado > 0;
      c.beginPath(); c.moveTo(cx + lado * rx * 0.35, cy - ry * 0.8);
      c.quadraticCurveTo(cx + lado * rx * 0.6, cy - ry * 1.5, cx + lado * rx * (torto ? 1.2 : 0.95), cy - ry * (torto ? 1.05 : 1.55));
      traco('#d6c5a2', 3);
    }
  }
  if (d.orelha === 'penacho') {
    // a crista do pavão: as hastes e as bolinhas turquesa
    for (let k = -2; k <= 2; k++) {
      c.beginPath(); c.moveTo(cx, cy - ry * 0.9); c.lineTo(cx + k * rx * 0.22, cy - ry * 1.62);
      traco(P.pavaoAzulClaro, 1.2);
      el(cx + k * rx * 0.22, cy - ry * 1.65, s * 0.022, s * 0.022); pinta(P.pavaoCrista);
    }
  }

  // ================================================================ A CABEÇA
  const cabeca = r.especie === 'peru' ? P.peruCabeca : pelo;
  const gr = c.createRadialGradient(cx - rx * 0.3, cy - ry * 0.35, rx * 0.1, cx, cy, rx * 1.15);
  gr.addColorStop(0, tom(cabeca, 1.35));
  gr.addColorStop(1, css(cabeca));
  if (r.especie === 'ovelha' || r.especie === 'alpaca') {
    // a lã: bolotas em volta do rosto
    for (let k = 0; k < 10; k++) {
      const t = (k / 10) * Math.PI * 2;
      el(cx + Math.cos(t) * rx * 0.88, cy - ry * 0.2 + Math.sin(t) * ry * 0.62, rx * 0.32, rx * 0.32);
      pinta(r.especie === 'ovelha' ? P.ovelhaLa : claro, true);
    }
  }
  el(cx, cy, rx, ry);
  c.fillStyle = gr;
  c.fill();
  c.stroke();

  // ---- o desenho da cara de cada espécie
  if (r.especie === 'ovelha') { el(cx, cy + ry * 0.15, rx * 0.62, ry * 0.72); pinta(P.ovelhaCara); el(cx, cy - ry * 0.72, rx * 0.7, ry * 0.3); pinta(P.ovelhaLa); }
  if (r.especie === 'texugo' || m === 'listraBranca') {
    c.beginPath(); c.moveTo(cx - rx * 0.16, cy - ry); c.lineTo(cx + rx * 0.16, cy - ry); c.lineTo(cx + rx * 0.09, cy + ry * 0.5); c.lineTo(cx - rx * 0.09, cy + ry * 0.5);
    pinta('#f2efe8');
    // as faixas pretas de máscara do texugo
    for (const lado of [-1, 1]) { el(cx + lado * rx * 0.42, oy, rx * 0.2, ry * 0.32, lado * 0.3); pinta('rgba(30,28,30,0.75)'); }
  }
  if (r.especie === 'pandaVermelho' || r.especie === 'raposa' || r.especie === 'lobo' || r.especie === 'lontra' || r.especie === 'cachorro') {
    const branco = r.especie === 'raposa' ? P.flynnPeloClaro : r.especie === 'lobo' ? P.roccoPeloClaro : r.especie === 'cachorro' ? P.dogaoPeloClaro : 0xf7efe4;
    el(cx, cy + ry * 0.48, rx * 0.66, ry * 0.42); pinta(branco);
    if (r.especie === 'raposa' || r.especie === 'lobo' || r.especie === 'pandaVermelho') {
      // os tufos da bochecha
      for (const lado of [-1, 1]) {
        c.beginPath(); c.moveTo(cx + lado * rx * 0.75, cy + ry * 0.05); c.lineTo(cx + lado * rx * 1.12, cy + ry * 0.38); c.lineTo(cx + lado * rx * 0.7, cy + ry * 0.55);
        pinta(branco);
      }
    }
    if (r.especie === 'pandaVermelho') {
      // as gotas brancas em cima dos olhos e as lágrimas ferrugem do panda-vermelho
      for (const lado of [-1, 1]) { el(cx + lado * rx * 0.36, oy - ry * 0.32, rx * 0.13, ry * 0.08); pinta('#f7efe4'); el(cx + lado * rx * 0.36, oy + ry * 0.28, rx * 0.07, ry * 0.2); pinta(tom(pelo, 0.7)); }
    }
  }
  if (r.especie === 'preguica' || m === 'mascaraDosOlhos') {
    // a máscara escura em volta dos olhos, puxada para trás
    for (const lado of [-1, 1]) { el(cx + lado * rx * 0.38, oy + ry * 0.02, rx * 0.3, ry * 0.15, lado * 0.42); pinta('rgba(70,50,40,0.78)'); }
    el(cx, cy - ry * 0.55, rx * 0.5, ry * 0.25); pinta(tom(pelo, 0.92));
  }
  if (r.especie === 'pinguim') { el(cx, cy + ry * 0.15, rx * 0.72, ry * 0.68); pinta(P.pinguimBarriga); }
  if (r.especie === 'coala') { el(cx, cy + ry * 0.35, rx * 0.5, ry * 0.4); pinta('#e9e6e1'); }
  if (r.especie === 'pato') { el(cx - rx * 0.1, cy - ry * 0.3, rx * 0.55, ry * 0.4); pinta('rgba(255,255,255,0.35)'); }
  if (r.especie === 'gato') {
    // o Gatito: a mancha caramelo do lado direito da cabeça e da orelha, e a costura de pelúcia no alto
    c.save(); el(cx, cy, rx, ry); c.clip();
    el(cx + rx * 0.78, cy - ry * 0.45, rx * 0.75, ry * 0.72, -0.4); pinta(P.gatitoCaramelo);
    c.restore();
    c.beginPath(); c.moveTo(cx + rx * 0.5, cy - ry * 0.55); c.lineTo(cx + rx * 0.9, cy - ry * 1.27); c.lineTo(cx + rx * 1.16, cy - ry * 0.5); pinta(P.gatitoCaramelo);
    c.setLineDash([s * 0.015, s * 0.012]); c.beginPath(); c.moveTo(cx, cy - ry); c.lineTo(cx, cy - ry * 0.45); traco('rgba(30,30,60,0.45)'); c.setLineDash([]);
  }
  if (r.especie === 'ursa') { el(cx, fy + ry * 0.05, rx * 0.42, ry * 0.3); pinta(P.lizFocinho); }
  if (r.especie === 'coelha') {
    // as duas bochechas fofas do focinho de coelha
    for (const lado of [-1, 1]) { el(cx + lado * rx * 0.15, fy + ry * 0.05, rx * 0.2, ry * 0.17); pinta(tom(pelo, 1.6)); }
  }

  // ================================================================ O FOCINHO
  switch (d.focinho) {
    case 'largo':
      el(cx, fy + ry * 0.1, rx * 0.78, ry * 0.46); pinta(claro, true);
      for (const lado of [-1, 1]) { el(cx + lado * rx * 0.28, fy - ry * 0.02, rx * 0.075, ry * 0.065); pinta(escuro); }
      c.beginPath(); c.moveTo(cx - rx * 0.32, fy + ry * 0.28); c.quadraticCurveTo(cx, fy + ry * 0.4, cx + rx * 0.32, fy + ry * 0.28); c.stroke();
      break;
    case 'porco':
      el(cx, fy, rx * 0.3, ry * 0.22); pinta(tom(P.peloRosa, 0.92), true);
      for (const lado of [-1, 1]) { el(cx + lado * rx * 0.1, fy, rx * 0.05, ry * 0.07); pinta('#a0545e'); }
      c.beginPath(); c.moveTo(cx - rx * 0.16, fy + ry * 0.32); c.quadraticCurveTo(cx, fy + ry * 0.42, cx + rx * 0.16, fy + ry * 0.32); c.stroke();
      break;
    case 'tromba':
      c.beginPath(); c.moveTo(cx - rx * 0.16, fy - ry * 0.3); c.quadraticCurveTo(cx - rx * 0.2, fy + ry * 0.7, cx - rx * 0.02, fy + ry * 1.05); c.lineTo(cx + rx * 0.2, fy + ry * 0.95); c.quadraticCurveTo(cx + rx * 0.14, fy + ry * 0.5, cx + rx * 0.16, fy - ry * 0.3);
      pinta(pelo, true);
      // as presinhas
      for (const lado of [-1, 1]) { c.beginPath(); c.moveTo(cx + lado * rx * 0.24, fy + ry * 0.05); c.quadraticCurveTo(cx + lado * rx * 0.4, fy + ry * 0.3, cx + lado * rx * 0.34, fy + ry * 0.45); traco(P.elefantePresa, 3); }
      break;
    case 'bico':
      el(cx, fy, rx * 0.42, ry * 0.18);
      pinta(r.especie === 'pinguim' ? P.pinguimBico : r.especie === 'peru' ? P.peruBico : r.especie === 'pavao' ? P.pavaoBronze : 0xf3a33a, true);
      c.beginPath(); c.moveTo(cx - rx * 0.38, fy); c.lineTo(cx + rx * 0.38, fy); traco('rgba(120,60,20,0.6)');
      break;
    case 'bicoChato':
      // o bico de pato, largo e achatado
      el(cx, fy + ry * 0.05, rx * 0.5, ry * 0.2); pinta(P.patoBico, true);
      c.beginPath(); c.moveTo(cx - rx * 0.46, fy + ry * 0.08); c.quadraticCurveTo(cx, fy + ry * 0.16, cx + rx * 0.46, fy + ry * 0.08); traco(P.patoBicoEscuro, 1.4);
      for (const lado of [-1, 1]) { el(cx + lado * rx * 0.1, fy - ry * 0.04, rx * 0.03, ry * 0.02); pinta(P.patoBicoEscuro); }
      break;
    case 'bicoComprido':
      // o bico de flamingo: branco, dobrado, com a ponta preta
      c.beginPath(); c.moveTo(cx - rx * 0.15, fy - ry * 0.1); c.quadraticCurveTo(cx + rx * 0.6, fy, cx + rx * 0.2, fy + ry * 0.7); c.lineTo(cx, fy + ry * 0.2); c.closePath();
      pinta(P.valentinaBico, true);
      el(cx + rx * 0.22, fy + ry * 0.55, rx * 0.1, ry * 0.15); pinta(P.valentinaBicoPonta);
      break;
    case 'longo': {
      const branco = r.especie === 'raposa' ? P.flynnPeloClaro : r.especie === 'lobo' ? P.roccoPeloClaro : 0xf7efe4;
      c.beginPath(); c.moveTo(cx - rx * 0.28, fy - ry * 0.3); c.quadraticCurveTo(cx, fy + ry * 0.75, cx + rx * 0.28, fy - ry * 0.3);
      pinta(r.especie === 'texugo' ? '#f2efe8' : branco, true);
      el(cx, fy + ry * 0.38, rx * 0.11, ry * 0.08); pinta(r.especie === 'raposa' ? P.flynnNariz : r.especie === 'lobo' ? P.roccoNariz : '#2b2622');
      if (r.especie === 'raposa') {
        // o sorriso aberto do Flynn
        c.beginPath(); c.moveTo(cx - rx * 0.12, fy + ry * 0.5); c.quadraticCurveTo(cx, fy + ry * 0.68, cx + rx * 0.12, fy + ry * 0.5); pinta('#7a3030');
      } else if (r.especie === 'lobo') {
        // o meio-sorriso de lado do Rocco
        c.beginPath(); c.moveTo(cx - rx * 0.08, fy + ry * 0.56); c.quadraticCurveTo(cx + rx * 0.06, fy + ry * 0.6, cx + rx * 0.16, fy + ry * 0.48); c.stroke();
      }
      break;
    }
    case 'tubo':
      // o focinho de tamanduá: um tubo comprido caindo, com o narizinho na ponta
      c.beginPath(); c.moveTo(cx - rx * 0.2, fy - ry * 0.35); c.quadraticCurveTo(cx - rx * 0.16, fy + ry * 0.9, cx - rx * 0.05, fy + ry * 1.3);
      c.lineTo(cx + rx * 0.1, fy + ry * 1.3); c.quadraticCurveTo(cx + rx * 0.2, fy + ry * 0.9, cx + rx * 0.2, fy - ry * 0.35);
      pinta(tom(pelo, 1.15), true);
      el(cx + rx * 0.02, fy + ry * 1.3, rx * 0.1, ry * 0.07); pinta('#2b2622');
      break;
    case 'quadrado':
      c.beginPath(); c.roundRect(cx - rx * 0.44, fy - ry * 0.22, rx * 0.88, ry * 0.5, rx * 0.18);
      pinta(r.especie === 'capivara' ? P.capivaraEscuro : claro, true);
      for (const lado of [-1, 1]) { el(cx + lado * rx * 0.15, fy - ry * 0.05, rx * 0.05, ry * 0.05); pinta(r.especie === 'capivara' ? P.capivaraFocinho : '#2b2622'); }
      break;
    case 'coelho':
      // o narizinho rosa e a boca de coelha (a Sol sorri aberto, a Estrella sorri, a Luna é séria)
      c.beginPath(); c.moveTo(cx - rx * 0.08, fy - ry * 0.06); c.lineTo(cx + rx * 0.08, fy - ry * 0.06); c.lineTo(cx, fy + ry * 0.05); pinta(0xe8839a);
      if (m === 'presilhaDeSol') {
        c.beginPath(); c.moveTo(cx - rx * 0.16, fy + ry * 0.14); c.quadraticCurveTo(cx, fy + ry * 0.4, cx + rx * 0.16, fy + ry * 0.14); c.closePath(); pinta('#7a3030');
        el(cx, fy + ry * 0.28, rx * 0.07, ry * 0.05); pinta(0xef8f8a);
      } else if (m === 'estrelaNaCabeca') {
        c.beginPath(); c.moveTo(cx - rx * 0.16, fy + ry * 0.14); c.quadraticCurveTo(cx, fy + ry * 0.3, cx + rx * 0.16, fy + ry * 0.14); traco('#3a2a24', 1.4);
      } else {
        c.beginPath(); c.moveTo(cx - rx * 0.08, fy + ry * 0.16); c.lineTo(cx + rx * 0.08, fy + ry * 0.16); c.stroke();
      }
      break;
    case 'curto': {
      const focinho = r.especie === 'ursa' ? P.lizFocinho : d.claro ? '#f7efe4' : claro;
      el(cx, fy, rx * 0.36, ry * 0.25); pinta(focinho);
      const nariz = r.especie === 'gato' ? 0xe98a9d : r.especie === 'ursa' ? P.lizNariz : r.especie === 'cachorro' ? 0x2b2622 : 0x2b2622;
      el(cx, fy - ry * 0.05, rx * (r.especie === 'ursa' || r.especie === 'cachorro' ? 0.12 : 0.08), ry * (r.especie === 'ursa' ? 0.08 : 0.06)); pinta(nariz);
      if (r.especie === 'ursa') {
        // o sorriso aberto da Tia Liz, com a linguinha
        c.beginPath(); c.moveTo(cx - rx * 0.14, fy + ry * 0.1); c.quadraticCurveTo(cx, fy + ry * 0.36, cx + rx * 0.14, fy + ry * 0.1); c.closePath(); pinta(P.lizBoca);
        el(cx, fy + ry * 0.24, rx * 0.07, ry * 0.05); pinta(P.lizLingua);
      } else if (r.especie === 'gato') {
        // o Gatito: a linguinha para fora e os bigodes bordados
        c.beginPath(); c.moveTo(cx, fy + ry * 0.02); c.quadraticCurveTo(cx - rx * 0.1, fy + ry * 0.16, cx - rx * 0.18, fy + ry * 0.08); c.moveTo(cx, fy + ry * 0.02); c.quadraticCurveTo(cx + rx * 0.1, fy + ry * 0.16, cx + rx * 0.18, fy + ry * 0.08); c.stroke();
        el(cx + rx * 0.04, fy + ry * 0.18, rx * 0.06, ry * 0.08); pinta(P.gatitoLingua);
        for (const lado of [-1, 1]) for (const k of [-1, 1]) { c.beginPath(); c.moveTo(cx + lado * rx * 0.36, fy + k * ry * 0.06); c.lineTo(cx + lado * rx * 0.85, fy + k * ry * 0.14); traco(P.gatitoBordado, 1.1); }
      } else {
        c.beginPath(); c.moveTo(cx, fy + ry * 0.02); c.quadraticCurveTo(cx - rx * 0.1, fy + ry * 0.16, cx - rx * 0.18, fy + ry * 0.08); c.moveTo(cx, fy + ry * 0.02); c.quadraticCurveTo(cx + rx * 0.1, fy + ry * 0.16, cx + rx * 0.18, fy + ry * 0.08); c.stroke();
      }
      break;
    }
    case 'nenhum':
      // a Josefina: o sorrisinho de tartaruga
      c.beginPath(); c.moveTo(cx - rx * 0.22, fy); c.quadraticCurveTo(cx, fy + ry * 0.18, cx + rx * 0.22, fy); traco('#2f3a22', 1.3);
      break;
  }
  if (m === 'barbelaVermelha' || r.especie === 'peru') {
    // a carúncula vermelha do peru, caindo do bico
    c.beginPath(); c.moveTo(cx + rx * 0.05, fy - ry * 0.15); c.quadraticCurveTo(cx + rx * 0.25, fy + ry * 0.3, cx + rx * 0.1, fy + ry * 0.7); c.quadraticCurveTo(cx - rx * 0.05, fy + ry * 0.4, cx + rx * 0.05, fy - ry * 0.15);
    pinta(P.peruCarunculo, true);
  }

  // ================================================================ OS OLHOS
  const iris = r.especie === 'raposa' ? P.flynnOlho : r.especie === 'lobo' ? P.roccoOlho : r.especie === 'pato' ? 0x3f6fc6 : r.especie === 'flamingo' ? P.valentinaOlho : undefined;
  const cilio = r.especie === 'coelha' || r.especie === 'flamingo' || r.especie === 'alpaca' || r.especie === 'ursa' || (r.especie === 'preguica' && e === 'oculosDeLeitura');
  // quem dorme em pé (o coala) e a vovó (a preguiça) ficam de olho meio fechado
  const meio = r.especie === 'coala';
  for (const lado of [-1, 1]) olho(cx + lado * rx * 0.36, oy, iris, cilio, meio);
  if (meio) for (const lado of [-1, 1]) { c.beginPath(); c.arc(cx + lado * rx * 0.36, oy - ry * 0.02, rx * 0.11, Math.PI * 1.1, Math.PI * 1.9); traco('#231c1c', 1.6); }
  // as bochechas
  for (const lado of [-1, 1]) {
    el(cx + lado * rx * 0.58, cy + ry * 0.24, rx * 0.13, ry * 0.08);
    pinta(r.especie === 'ursa' ? 'rgba(242,149,138,0.7)' : r.especie === 'flamingo' ? 'rgba(238,120,150,0.55)' : 'rgba(240,120,130,0.35)');
  }
  // as sobrancelhas de quem tem cara: a Luna séria, o Rocco marrento, o texugo bravo, o bode teimoso, a Alpacona
  if (r.especie === 'coelha' && m === 'presilhaDeLua') for (const lado of [-1, 1]) sobrancelha(lado, 0.6, '#5b4a50', 1.6);
  if (r.especie === 'lobo' || r.especie === 'texugo' || r.especie === 'bode') for (const lado of [-1, 1]) sobrancelha(lado, 1, '#2b2626', 2.4);
  if (r.especie === 'alpaca' && !m) for (const lado of [-1, 1]) sobrancelha(lado, 0.5, '#7a6248', 2.6);
  if (r.especie === 'hipopotamo') for (const lado of [-1, 1]) {
    // as sobrancelhas brancas e fartas do sócio mais antigo
    el(cx + lado * rx * 0.36, oy - ry * 0.28, rx * 0.16, ry * 0.07, lado * -0.2); pinta('#f6f2ea', true);
  }

  // ================================================================ A MARCA QUE DISTINGUE
  // (as que denunciam — a Alpacona, o Beto — grandes o bastante para se ver na foto do tamanho do celular)
  if (m === 'pintaNoFocinho') { el(cx + rx * 0.3, fy - ry * 0.02, rx * 0.12, rx * 0.1, 0.3); pinta('#6b4a3a'); }
  if (m === 'pintasNoFocinho') for (const [dx, dy] of [[-0.3, 0.12], [-0.18, 0.2], [0.26, 0.15]]) { el(cx + dx * rx, fy + dy * ry, rx * 0.04, rx * 0.04); pinta('#3d2c26'); }
  // (a orelha ESQUERDA do bicho fica à direita de quem olha a foto)
  if (m === 'pintaNaOrelhaEsquerda') { el(cx + rx * 1.0, cy - ry * 0.4, rx * 0.12, ry * 0.15, -0.35); pinta('#7a3f4a'); }
  if (m === 'manchaNoPeito') { el(cx, base - a * 0.08, s * 0.1, s * 0.07); pinta('#f2ead8'); }
  if (m === 'bigodeBranco') for (const lado of [-1, 1]) for (const k of [-1, 1]) { c.beginPath(); c.moveTo(cx + lado * rx * 0.2, fy + k * ry * 0.04); c.lineTo(cx + lado * rx * 0.75, fy + k * ry * 0.12); traco('#ffffff', 1.2); }
  if (r.especie === 'lontra' && m !== 'bigodeBranco') for (const lado of [-1, 1]) for (const k of [-1, 1]) { c.beginPath(); c.moveTo(cx + lado * rx * 0.25, fy + k * ry * 0.04); c.lineTo(cx + lado * rx * 0.62, fy + k * ry * 0.1); traco('#3d2c26', 0.8); }
  if (m === 'brincoNaOrelha') { el(cx - rx * 1.05, cy - ry * 0.25, rx * 0.07, rx * 0.07); pinta('#e8c24a', true); }
  if (m === 'narizGrande') { el(cx, fy - ry * 0.04, rx * 0.24, ry * 0.18); pinta('#2b2622'); }
  else if (r.especie === 'coala') { el(cx, fy - ry * 0.02, rx * 0.16, ry * 0.13); pinta('#2b2622'); }
  if (m === 'orelhaRasgadinha') { c.beginPath(); c.moveTo(cx - rx * 1.2, cy - ry * 0.95); c.lineTo(cx - rx * 1.0, cy - ry * 0.72); c.lineTo(cx - rx * 1.25, cy - ry * 0.65); pinta('#a9cfe0'); }
  if (m === 'manchaNaTesta') { el(cx, cy - ry * 0.6, rx * 0.2, ry * 0.12); pinta('#f7efe4'); }
  if (m === 'cicatrizNoNariz' || m === 'cicatrizNaSobrancelha') {
    const yy = m === 'cicatrizNoNariz' ? fy - ry * 0.1 : oy - ry * 0.25;
    c.beginPath(); c.moveTo(cx + rx * 0.25, yy - ry * 0.12); c.lineTo(cx + rx * 0.45, yy + ry * 0.08); traco('#7a3a2e', 1.4);
  }

  // ================================================================ O CABELO (o penteado: NÃO conta para a foto)
  if (r.cabelo) {
    const ch = r.cabelo;
    if (ch === 'cachosDourados') {
      // a Tia Liz: a calota de cachos dourados e as molinhas caindo dos lados
      for (const lado of [-1, 1]) {
        for (let k = 0; k < 5; k++) { el(cx + lado * rx * (0.98 + (k % 2) * 0.06), cy - ry * 0.05 + k * ry * 0.2, rx * 0.12, ry * 0.11); pinta(k % 2 ? P.lizCabelo : P.lizTranca, true); }
      }
      for (let k = 0; k < 16; k++) {
        const t = Math.PI * (1.02 + (k / 15) * 0.96);
        const rr = 0.92 + ((k * 37) % 7) / 50;
        el(cx + Math.cos(t) * rx * rr, cy - ry * 0.2 + Math.sin(t) * ry * 0.95, rx * 0.2, rx * 0.18);
        pinta(k % 3 === 0 ? P.lizCabeloLuz : P.lizCabelo, true);
      }
      for (let k = 0; k < 7; k++) { el(cx + (k - 3) * rx * 0.24, cy - ry * 0.98 + Math.abs(k - 3) * ry * 0.08, rx * 0.18, rx * 0.16); pinta(k % 2 ? P.lizCabeloLuz : P.lizCabelo, true); }
    } else {
      c.fillStyle = tom(pelo, 0.92);
      if (ch === 'franja') { el(cx, cy - ry * 0.75, rx * 0.92, ry * 0.36); pinta(tom(pelo, 0.92), true); }
      if (ch === 'coque' || ch === 'cocoAlto') { el(cx, cy - ry * (ch === 'cocoAlto' ? 1.3 : 1.15), rx * 0.42, ry * 0.34); pinta(tom(pelo, 0.92), true); el(cx, cy - ry * 0.78, rx * 0.8, ry * 0.25); pinta(tom(pelo, 0.92)); }
      if (ch === 'trancas' || ch === 'tranca') { for (const lado of [-1, 1]) { for (let k = 0; k < 4; k++) { el(cx + lado * rx * 0.95, cy + ry * (-0.2 + k * 0.28), rx * 0.14, ry * 0.15); pinta(tom(pelo, 0.92), true); } } el(cx, cy - ry * 0.8, rx * 0.85, ry * 0.28); pinta(tom(pelo, 0.92)); }
      if (ch === 'blackPower') { el(cx, cy - ry * 0.55, rx * 1.35, ry * 0.85); pinta(tom(pelo, 0.92), true); }
      if (ch === 'moicano') { c.beginPath(); c.moveTo(cx - rx * 0.15, cy - ry * 0.8); c.lineTo(cx, cy - ry * 1.6); c.lineTo(cx + rx * 0.15, cy - ry * 0.8); pinta(tom(pelo, 0.92), true); }
      if (ch === 'trofeu') { c.beginPath(); c.moveTo(cx - rx * 0.4, cy - ry * 1.4); c.lineTo(cx + rx * 0.4, cy - ry * 1.4); c.lineTo(cx + rx * 0.15, cy - ry * 0.9); c.lineTo(cx - rx * 0.15, cy - ry * 0.9); pinta('#e8c24a', true); el(cx, cy - ry * 0.82, rx * 0.8, ry * 0.2); pinta(tom(pelo, 0.92)); }
    }
  }
  if (m === 'gravatinhaTopete' || e === 'gravatinha') {
    // o topetinho penteado de lado do Bento
    c.beginPath(); c.moveTo(cx - rx * 0.05, cy - ry * 0.92); c.quadraticCurveTo(cx + rx * 0.35, cy - ry * 1.18, cx + rx * 0.5, cy - ry * 0.88); c.quadraticCurveTo(cx + rx * 0.25, cy - ry * 0.98, cx - rx * 0.05, cy - ry * 0.92);
    pinta(tom(pelo, 0.85), true);
  }

  // ================================================================ O QUE VAI NA CABEÇA (a assinatura de cada um)
  // as três irmãs: a lua e o laço amarelo da Luna, o sol da Sol, a estrela da Estrella
  if (m === 'presilhaDeLua') {
    laco(cx - rx * 0.62, cy - ry * 0.92, rx * 0.3, P.lunaLaco, P.lunaPomponAzul, -0.25);
    c.beginPath(); c.arc(cx + rx * 0.66, cy - ry * 1.05, rx * 0.2, Math.PI * 0.35, Math.PI * 1.65); c.arc(cx + rx * 0.74, cy - ry * 1.05, rx * 0.15, Math.PI * 1.6, Math.PI * 0.4, true);
    pinta(P.lunaLua, true);
  }
  if (m === 'presilhaDeSol') {
    const px = cx - rx * 0.62;
    const py = cy - ry * 0.95;
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      c.beginPath(); c.moveTo(px + Math.cos(ang) * rx * 0.14, py + Math.sin(ang) * rx * 0.14); c.lineTo(px + Math.cos(ang + 0.3) * rx * 0.27, py + Math.sin(ang + 0.3) * rx * 0.27); c.lineTo(px + Math.cos(ang + 0.6) * rx * 0.14, py + Math.sin(ang + 0.6) * rx * 0.14);
      pinta(P.solPresilha);
    }
    el(px, py, rx * 0.15, rx * 0.15); pinta(P.solPresilhaMiolo, true);
  }
  if (m === 'estrelaNaCabeca') estrela(cx, cy - ry * 1.02, rx * 0.26, P.estrellaEstrela, 0.15);
  // a Josefina: o laço rosa no alto da cabeça
  if (e === 'lacoNaCabeca') laco(cx + rx * 0.25, cy - ry * 0.95, rx * 0.34, P.lacoDaJosefina, tom(P.lacoDaJosefina, 0.85));
  // o Noel: o boné turquesa
  if (e === 'boneDoNoel') bone(P.aventalDoNoel);
  // o Capy: os óculos esportivos na testa
  if (e === 'oculosNaCabeca') {
    c.beginPath(); c.roundRect(cx - rx * 0.75, cy - ry * 0.92, rx * 1.5, ry * 0.3, ry * 0.14); pinta(P.salvaVidasBranco, true);
    for (const lado of [-1, 1]) { c.beginPath(); c.roundRect(cx + lado * rx * 0.35 - rx * 0.3, cy - ry * 0.88, rx * 0.6, ry * 0.22, ry * 0.1); pinta(P.oculosEsportivoLente); }
  }
  // o Mano: a casquinha na cabeça, com a bola de morango e a cereja
  if (e === 'chapeuDeCasquinha') {
    c.beginPath(); c.moveTo(cx - rx * 0.42, cy - ry * 0.82); c.lineTo(cx, cy - ry * 1.35); c.lineTo(cx + rx * 0.42, cy - ry * 0.82); c.closePath();
    pinta(P.casquinhaWaffle, true);
    c.save(); c.clip();
    for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(cx + k * rx * 0.18, cy - ry * 0.78); c.lineTo(cx + k * rx * 0.18 + rx * 0.4, cy - ry * 1.4); c.moveTo(cx + k * rx * 0.18, cy - ry * 0.78); c.lineTo(cx + k * rx * 0.18 - rx * 0.4, cy - ry * 1.4); traco(P.casquinhaGrelha, 0.9); }
    c.restore();
    el(cx, cy - ry * 1.42, rx * 0.3, rx * 0.26); pinta(P.morango, true);
    el(cx + rx * 0.04, cy - ry * 1.72, rx * 0.09, rx * 0.09); pinta(P.cerejaDoMano, true);
  }
  // o Cookie: o quepe azul da bilheteria, com a faixa vermelha
  if (m === 'quepeDaBilheteria') {
    c.beginPath(); c.roundRect(cx - rx * 0.6, cy - ry * 1.22, rx * 1.2, ry * 0.42, rx * 0.1); pinta(P.quepeCookie, true);
    c.fillStyle = css(P.quepeCookieFita); c.fillRect(cx - rx * 0.6, cy - ry * 0.92, rx * 1.2, ry * 0.12);
    el(cx + rx * 0.2, cy - ry * 0.78, rx * 0.7, ry * 0.09); pinta('#1f2a44', true);
    el(cx, cy - ry * 1.24, rx * 0.08, rx * 0.06); pinta(P.quepeCookieBotao);
  }
  // o Pietro: o quepe de motorista, com a faixa e o emblema dourados
  if (m === 'quepeDeMotorista') {
    el(cx, cy - ry * 1.02, rx * 0.95, ry * 0.3); pinta(P.motoristaQuepe, true);
    c.fillStyle = css(P.motoristaDourado); c.fillRect(cx - rx * 0.62, cy - ry * 0.92, rx * 1.24, ry * 0.08);
    el(cx, cy - ry * 1.1, rx * 0.09, rx * 0.09); pinta(P.motoristaDourado);
    el(cx + rx * 0.15, cy - ry * 0.8, rx * 0.68, ry * 0.08); pinta('#14161e');
  }
  // o Flynn: a faixa azul dos Gatitos na testa, com o G amarelo
  if (m === 'bandanaAzul') {
    c.beginPath(); c.roundRect(cx - rx * 0.98, cy - ry * 0.7, rx * 1.96, ry * 0.2, ry * 0.06); pinta(P.gatitosAzul, true);
    c.fillStyle = css(P.gatitosAmarelo); c.fillRect(cx - rx * 0.98, cy - ry * 0.52, rx * 1.96, ry * 0.035);
    el(cx, cy - ry * 0.6, rx * 0.12, rx * 0.12); pinta(P.gatitosAmarelo, true);
  }
  // o Rocco: a faixa vermelha dos Dogões, com o D
  if (e === 'faixaDosDogoes') {
    c.beginPath(); c.roundRect(cx - rx * 0.98, cy - ry * 0.72, rx * 1.96, ry * 0.2, ry * 0.06); pinta(P.dogoesVermelho, true);
    el(cx, cy - ry * 0.62, rx * 0.13, rx * 0.13); pinta(P.dogoesBranco, true);
    c.fillStyle = css(P.dogoesVermelho); c.font = `900 ${Math.round(rx * 0.2)}px ui-rounded, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('D', cx, cy - ry * 0.61);
  }
  // a Valentina: os óculos gatinho dourados empurrados para o alto da cabeça
  if (m === 'oculosGatinho') {
    for (const lado of [-1, 1]) {
      // a lente gatinho: a quina de fora puxada para cima, com o aro dourado
      const px = cx + lado * rx * 0.42;
      const py = cy - ry * 0.88;
      c.beginPath();
      c.moveTo(px - lado * rx * 0.3, py - ry * 0.02);
      c.quadraticCurveTo(px, py - ry * 0.16, px + lado * rx * 0.38, py - ry * 0.2);
      c.quadraticCurveTo(px + lado * rx * 0.28, py + ry * 0.16, px - lado * rx * 0.05, py + ry * 0.14);
      c.quadraticCurveTo(px - lado * rx * 0.3, py + ry * 0.1, px - lado * rx * 0.3, py - ry * 0.02);
      pinta('rgba(60,40,50,0.88)');
      c.strokeStyle = css(P.motoristaDourado); c.lineWidth = lw * 1.8; c.stroke(); c.strokeStyle = TRACO; c.lineWidth = lw;
    }
    c.beginPath(); c.moveTo(cx - rx * 0.12, cy - ry * 0.92); c.lineTo(cx + rx * 0.12, cy - ry * 0.92); traco(P.motoristaDourado, 1.8);
  }
  // a Estella: os óculos redondos dourados de costureira, com a correntinha
  if (m === 'oculosDeCostura') {
    for (const lado of [-1, 1]) { el(cx + lado * rx * 0.36, oy, rx * 0.2, ry * 0.17); traco(P.ovelhaOculos, 1.6); }
    c.beginPath(); c.moveTo(cx - rx * 0.16, oy); c.lineTo(cx + rx * 0.16, oy); traco(P.ovelhaOculos, 1.4);
    c.beginPath(); c.moveTo(cx - rx * 0.56, oy); c.quadraticCurveTo(cx - rx * 0.8, oy + ry * 0.6, cx - rx * 0.6, oy + ry * 1.1); c.setLineDash([s * 0.008, s * 0.006]); traco(P.ovelhaOculos, 0.9); c.setLineDash([]);
  }

  // ================================================================ O ENFEITE dos visitantes novos
  if (e === 'bone') bone(P.portariaBoneBeto, true);
  if (e === 'boneDoPapita') {
    bone(P.portariaPapita);
    el(cx, cy - ry * 0.86, rx * 0.17, rx * 0.17); pinta(P.portariaCamisa);
    c.fillStyle = css(P.portariaPapitaEscuro); c.font = `900 ${Math.round(rx * 0.22)}px ui-rounded, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('P', cx, cy - ry * 0.85);
  }
  if (e === 'oculosDeLeitura') {
    // a vovó: os óculos de leitura na ponta do nariz, com a correntinha
    for (const lado of [-1, 1]) { el(cx + lado * rx * 0.3, oy + ry * 0.28, rx * 0.19, ry * 0.13); traco('#7a5a3a', 1.4); }
    c.beginPath(); c.moveTo(cx - rx * 0.49, oy + ry * 0.28); c.quadraticCurveTo(cx - rx * 0.8, oy + ry * 0.9, cx - rx * 0.5, oy + ry * 1.3); c.setLineDash([s * 0.008, s * 0.006]); traco(P.portariaRelogio, 0.9); c.setLineDash([]);
    // e o coque branquinho de vovó
    el(cx, cy - ry * 1.02, rx * 0.3, ry * 0.2); pinta('#f6f2ea', true);
  }
  if (e === 'barbicha') { c.beginPath(); c.moveTo(cx - rx * 0.12, fy + ry * 0.4); c.lineTo(cx, fy + ry * 0.95); c.lineTo(cx + rx * 0.12, fy + ry * 0.4); pinta('#efe8da'); }
  if (r.especie === 'lontra') {
    // os óculos de natação empurrados para a testa
    c.beginPath(); c.moveTo(cx - rx, cy - ry * 0.55); c.lineTo(cx + rx, cy - ry * 0.55); traco(P.portariaOculosNatacao, 3);
    for (const lado of [-1, 1]) { el(cx + lado * rx * 0.3, cy - ry * 0.58, rx * 0.2, ry * 0.15); pinta(P.portariaOculosNatacao, true); el(cx + lado * rx * 0.3, cy - ry * 0.6, rx * 0.12, ry * 0.08); pinta('rgba(255,255,255,0.6)'); }
  }
  if (r.especie === 'coala') {
    // o gorro de dormir listrado, caindo para o lado, com o pompom
    c.beginPath(); c.moveTo(cx - rx * 0.78, cy - ry * 0.55); c.quadraticCurveTo(cx - rx * 0.1, cy - ry * 1.45, cx + rx * 0.95, cy - ry * 1.1); c.quadraticCurveTo(cx + rx * 0.45, cy - ry * 0.85, cx + rx * 0.78, cy - ry * 0.55); c.closePath();
    pinta(P.portariaGorro, true);
    c.save(); c.clip();
    for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(cx - rx + k * rx * 0.5, cy - ry * 0.4); c.lineTo(cx - rx * 0.6 + k * rx * 0.5, cy - ry * 1.5); traco(P.portariaGorroListra, 3); }
    c.restore();
    c.beginPath(); c.roundRect(cx - rx * 0.82, cy - ry * 0.66, rx * 1.64, ry * 0.18, ry * 0.08); pinta(P.portariaGorroListra, true);
    el(cx + rx * 0.98, cy - ry * 1.08, rx * 0.15, rx * 0.15); pinta(P.portariaGorroListra, true);
  }
  if (rabo) {
    // o rabo listrado do panda-vermelho, abraçado na frente do peito
    c.beginPath(); c.moveTo(cx - s * 0.4, base - a * 0.04); c.quadraticCurveTo(cx, base - a * 0.2, cx + s * 0.38, base - a * 0.08);
    c.lineWidth = s * 0.1; c.strokeStyle = css(pelo); c.stroke();
    c.lineWidth = s * 0.1; c.setLineDash([s * 0.05, s * 0.07]); c.strokeStyle = tom(pelo, 0.6); c.stroke(); c.setLineDash([]);
    c.lineWidth = lw; c.strokeStyle = TRACO;
  }

  // ================================================================ OS DISFARCES (o Jean-Luc, um por dia)
  const pato = r.especie === 'pato';
  // a boina vai junto em quase todos (só a peruca, a touca e o boné tiram)
  if (pato && (e === 'boina' || e === 'cascoDePapelao' || e === 'bigodeFalso' || e === 'oculosComNariz')) {
    c.beginPath(); c.ellipse(cx - rx * 0.08, cy - ry * 0.82, rx * 0.74, ry * 0.26, -0.15, 0, Math.PI * 2); pinta(P.azulFranca, true);
    el(cx - rx * 0.1, cy - ry * 1.06, rx * 0.06, rx * 0.06); pinta(P.azulFranca);
  }
  if (e === 'boneDeEntregador') {
    bone(0x3b6fd0);
    c.fillStyle = '#ffffff'; c.font = `bold ${Math.round(s * 0.06)}px ui-rounded, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CE', cx, cy - ry * 0.9);
  }
  if (e === 'oculosComNariz') {
    for (const lado of [-1, 1]) { el(cx + lado * rx * 0.36, oy, rx * 0.2, ry * 0.14); pinta('#1d1d22'); }
    el(cx, oy + ry * 0.22, rx * 0.14, ry * 0.2); pinta('#f0b9a0', true);
    c.beginPath(); c.moveTo(cx - rx * 0.32, fy - ry * 0.12); c.quadraticCurveTo(cx, fy - ry * 0.02, cx + rx * 0.32, fy - ry * 0.12); c.lineTo(cx, fy - ry * 0.06); pinta('#2b2622');
  }
  if (e === 'perucaDeFranja') { el(cx, cy - ry * 0.55, rx * 1.25, ry * 0.65); pinta(tom(P.peloCreme, 0.95), true); el(cx, cy - ry * 0.45, rx * 0.95, ry * 0.26); pinta(tom(P.peloCreme, 0.95)); }
  if (e === 'toucaEBoia') {
    c.beginPath(); c.ellipse(cx, cy - ry * 0.45, rx * 1.02, ry * 0.65, 0, Math.PI, 0); pinta('#e5404f', true);
    el(cx, base - a * 0.05, s * 0.42, s * 0.12); pinta(P.portariaBoiaPato, true);
  }
  if (e === 'bigodeFalso') {
    c.beginPath(); c.moveTo(cx - rx * 0.55, fy + ry * 0.05); c.quadraticCurveTo(cx - rx * 0.25, fy - ry * 0.25, cx, fy - ry * 0.02); c.quadraticCurveTo(cx + rx * 0.25, fy - ry * 0.25, cx + rx * 0.55, fy + ry * 0.05); c.quadraticCurveTo(cx + rx * 0.25, fy + ry * 0.12, cx, fy + ry * 0.06); c.quadraticCurveTo(cx - rx * 0.25, fy + ry * 0.12, cx - rx * 0.55, fy + ry * 0.05);
    pinta('#2b2622');
  }

  // ---- tapado: o capacete do Capy na janela
  if (opts.tapado) {
    el(cx, cy - ry * 0.1, rx * 1.12, ry * 1.08); pinta('#d6453c', true);
    c.beginPath(); c.roundRect(cx - rx * 0.8, cy - ry * 0.35, rx * 1.6, ry * 0.6, rx * 0.25); pinta('rgba(40,40,60,0.85)');
    c.fillStyle = '#f2efe8'; c.fillRect(cx - rx * 1.05, cy - ry * 0.85, rx * 2.1, ry * 0.1);
  }
  c.restore();
}
