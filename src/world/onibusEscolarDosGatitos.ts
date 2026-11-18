import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';
import { emblemaDosGatitos } from './uniformeDosGatitos';
import { juntarPorCor } from './fundir';

/**
 * ===================================== O ÔNIBUS ESCOLAR DOS GATITOS
 *
 * O "carro" do Gatito (`docs/CARROS-DA-ESCOLA.md` §1), na decisão do Renan: "o
 * Gatito mora na escola! Mas deixe estacionado um ônibus escolar dos Gatitos".
 * O Gatito não sai na estrada; o ônibus fica parado no lote da escola, de lado,
 * atravessado em quatro vagas da fila de trás.
 *
 * É o ônibus escolar AMERICANO de nariz comprido, que combina com a escola de
 * tijolinho "de filme" da foto do Renan. A segunda versão (pedido do Renan:
 * "mais bonito, com mais detalhes, melhore as texturas") manteve tudo da
 * primeira e caprichou no acabamento:
 *  - a CARROCERIA é o perfil de lado extrudado na largura com BISEL (o molde do
 *    ônibus da cidade, `onibusDaCidade.ts`), pintada com a CHAPA em canvas
 *    (`chapaDoOnibus`): as emendas das placas caindo entre as janelas, as
 *    fileiras de rebite, as emendas atravessando o teto e a poeira escurecendo
 *    o pé. A caixa de roda de trás começa e acaba na linha do chão (antes
 *    sobrava um dente amarelo em cada ponta do arco) e ganhou o aro preto;
 *  - o CAPÔ é outro perfil, mais estreito e mais arredondado, com as venezianas
 *    dos lados, a grade de cromo entre os FARÓIS (que moram no nariz, com o aro
 *    de cromo e a seta âmbar embaixo), os PARA-LAMAS pretos de verdade (um arco
 *    gordo de quina macia por cima de cada roda da frente) e os ESPELHOS de capô
 *    na haste de cromo curva, virados para o motorista;
 *  - dos lados: as JANELAS com o caixilho de alumínio e o vidro PINTADO (o céu
 *    refletido em cima, o encosto azul dos bancos aparecendo embaixo e o risco
 *    de brilho), sobre a faixa preta; os três FRISOS pretos, o letreiro "ESCOLA
 *    DO GATITO" em letra de ônibus escolar, o EMBLEMA dos Gatitos, o número 67,
 *    a porta sanfonada de vidro (do lado da calçada, o `−X`), a janela do
 *    motorista e o BRAÇO DE PARE com as duas luzes (do lado dele, o `+X`), e os
 *    retrovisores grandes nas quinas do para-brisa;
 *  - em cima: as LUZES DE ALERTA numa caixa preta com as palas, na frente e
 *    atrás, as duas ORELHINHAS DE GATO e as duas ESCOTILHAS do teto; na frente,
 *    a placa da linha com o 67 (o "six seven" do Gatito), o para-brisa com os
 *    limpadores, a placa do Mercosul e o BRAÇO DE TRAVESSIA dobrado no
 *    para-choque; atrás, a porta de emergência com o aviso, as janelinhas, as
 *    lanternas de aro, o "ESCOLAR" e o para-choque listrado;
 *  - as RODAS (a de trás dupla): pneu torneado, aro, os furos, a calota e as
 *    porcas, pintados nos vértices numa malha só; e os para-barros com a pata.
 *
 * O PESO: tudo o que é impresso (letreiro, placas, vidros, PARE, listras, pata)
 * mora num ATLAS só, as rodas são pintadas nos vértices e o resto de cor lisa vai
 * pela `juntarPorCor`: o ônibus inteiro são poucos materiais, e a cena o junta
 * como fundo.
 *
 * Contrato de peça: base em `y = 0`, nariz no `+Z`, centrado em `x = 0, z = 0`.
 * `tras` e `frente` vão de para-choque a para-choque (o colisor da cena sai daqui).
 */
export const ONIBUS_ESCOLAR = {
  /** de onde a onde, no comprimento (o nariz no +Z), de para-choque a para-choque */
  tras: -5.15, frente: 4.9,
  largura: 2.45,
  teto: 3.0,
} as const;
const O = ONIBUS_ESCOLAR;
/** a caixa da carroceria (sem o capô): da face de trás à face da frente */
const CORPO = { tras: -4.95, frente: 2.75 };
/** a ponta do nariz do capô */
const NARIZ = 4.65;
const B = 0.1;
const MEIA = O.largura / 2 - B;
const LADO = O.largura / 2;
const CHAO = 0.55;
const EIXO_FRENTE = 3.35, EIXO_TRAS = -3.15, RODA = 0.47;
/** o raio da caixa de roda na forma (o bisel a fecha de volta) */
const ARCO = 0.68;
const RAIO_DO_TETO = 0.32;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const rgba = (c: number, a: number): string => {
  const k = new THREE.Color(c);
  return `rgba(${Math.round(k.r * 255)},${Math.round(k.g * 255)},${Math.round(k.b * 255)},${a})`;
};
/** a letra de ônibus escolar (a mesma família da roupa de time dos Gatitos) */
const FONTE_DE_ONIBUS = '"Arial Black", "Arial", system-ui, sans-serif';

// ================================================================ a forma

/** um perfil no plano (z, y) extrudado na largura `2·meia` com bisel, centrado em `x` */
function extrudarDeLado(forma: THREE.Shape, meia: number, bisel = B, gomos = 3): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(forma, { depth: meia * 2, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: gomos, curveSegments: 12 });
  geo.rotateY(-Math.PI / 2);
  geo.translate(meia, 0, 0);
  return geo;
}

/**
 * A caixa de roda na linha do chão da forma: o arco começa e acaba ONDE O
 * CÍRCULO CRUZA o chão. Começando na altura do eixo, a linha descia do chão até
 * o arco e deixava um dente amarelo em cada ponta.
 */
function caixaDeRoda(s: THREE.Shape, eixo: number, chao: number): void {
  const a0 = Math.asin((chao - RODA) / ARCO);
  s.lineTo(eixo - ARCO * Math.cos(a0), chao);
  s.absarc(eixo, RODA, ARCO, Math.PI - a0, a0, true);
}

// (a forma é desenhada recolhida do bisel: ele a engorda de volta)
const T = CORPO.tras + B, F = CORPO.frente - B, TOPO = O.teto - B, CHAO_DA_FORMA = CHAO + B;
/** a frente da carroceria acima do capô: o para-brisa deitado e a quina do teto */
const CAPA_DA_FRENTE: THREE.Curve<THREE.Vector2>[] = [
  new THREE.LineCurve(new THREE.Vector2(F, 1.8), new THREE.Vector2(F - 0.22, TOPO - RAIO_DO_TETO)),
  new THREE.QuadraticBezierCurve(new THREE.Vector2(F - 0.22, TOPO - RAIO_DO_TETO), new THREE.Vector2(F - 0.3, TOPO), new THREE.Vector2(F - 0.3 - RAIO_DO_TETO, TOPO)),
];
/** a traseira: reta até a quina do teto */
const CAPA_DE_TRAS: THREE.Curve<THREE.Vector2>[] = [
  new THREE.LineCurve(new THREE.Vector2(T, CHAO_DA_FORMA), new THREE.Vector2(T, TOPO - RAIO_DO_TETO)),
  new THREE.QuadraticBezierCurve(new THREE.Vector2(T, TOPO - RAIO_DO_TETO), new THREE.Vector2(T, TOPO), new THREE.Vector2(T + RAIO_DO_TETO, TOPO)),
];

/** a carroceria: da traseira ao pé do para-brisa, com a caixa de roda de trás recortada (no plano z, y) */
function perfilDaCarroceria(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(T, CHAO_DA_FORMA);
  caixaDeRoda(s, EIXO_TRAS, CHAO_DA_FORMA);
  s.lineTo(F, CHAO_DA_FORMA);
  s.lineTo(F, 1.8);
  for (const c of CAPA_DA_FRENTE) for (const p of c.getPoints(10).slice(1)) s.lineTo(p.x, p.y);
  s.lineTo(T + RAIO_DO_TETO, TOPO);
  s.quadraticCurveTo(T, TOPO, T, TOPO - RAIO_DO_TETO);
  s.lineTo(T, CHAO_DA_FORMA);
  return s;
}

/**
 * Um ponto da frente (ou da traseira) da carroceria, no meio da largura, na
 * altura `y`: o ponto na lataria e a normal para fora. É por aqui que o
 * para-brisa e as caixas das luzes de alerta assentam na curva.
 */
function naCapa(frente: boolean, y: number): { p: THREE.Vector3; n: THREE.Vector3 } {
  let melhor = { p: new THREE.Vector3(), n: new THREE.Vector3(0, 0, 1) };
  let dist = Infinity;
  for (const c of frente ? CAPA_DA_FRENTE : CAPA_DE_TRAS) {
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const p = c.getPoint(t);
      const tg = c.getTangent(t);
      const nz = frente ? tg.y : -tg.y, ny = frente ? -tg.x : tg.x;
      const yy = p.y + ny * B;
      if (Math.abs(yy - y) < dist) {
        dist = Math.abs(yy - y);
        melhor = { p: new THREE.Vector3(0, yy, p.x + nz * B), n: new THREE.Vector3(0, ny, nz).normalize() };
      }
    }
  }
  return melhor;
}

/** o capô: do pé do para-brisa ao nariz redondo (com o vão da roda da frente) */
const BISEL_DO_CAPO = 0.14;
function perfilDoCapo(): THREE.Shape {
  const s = new THREE.Shape();
  // (o fundo 1 cm acima do da carroceria: os dois no mesmo plano brigariam)
  const f = NARIZ - BISEL_DO_CAPO, chao = CHAO + BISEL_DO_CAPO + 0.01;
  s.moveTo(2.55, chao);
  caixaDeRoda(s, EIXO_FRENTE, chao);
  s.lineTo(f - 0.05, chao);
  s.quadraticCurveTo(f, chao, f, 0.95);
  s.lineTo(f - 0.05, 1.4);
  s.quadraticCurveTo(f - 0.12, 1.6, f - 0.45, 1.62);
  s.lineTo(2.55, 1.72);
  s.lineTo(2.55, chao);
  return s;
}

// ================================================================ a chapa

/** as emendas das placas da lateral caem entre as janelas: a cada 0,75 m, a partir daqui */
const EMENDA = -3.975;
const PAINEL = 0.75;

let chapa: THREE.CanvasTexture | null = null;
/**
 * A CHAPA DA LATARIA: um quadro de 1,5 m (duas placas) por 3 m de altura,
 * quase branco (o material amarelo multiplica). As emendas em pé com a fileira
 * de rebites, as fileiras deitadas no peitoril e em cima das janelas, e o pé
 * escurecendo de poeira (preto bem fraco: o amarelo escurece sem mudar de
 * tom). No teto o mesmo quadro dá as emendas atravessando.
 */
function chapaDoOnibus(): THREE.CanvasTexture {
  if (chapa) return chapa;
  const L = 512, A = 512;
  const cv = document.createElement('canvas');
  cv.width = L; cv.height = A;
  const c = cv.getContext('2d');
  const pxY = (y: number): number => (1 - y / 3) * A;
  if (c) {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, L, A);
    const pe = c.createLinearGradient(0, pxY(1.3), 0, A);
    pe.addColorStop(0, rgba(P.onibusEscolarPreto, 0));
    pe.addColorStop(0.55, rgba(P.onibusEscolarPreto, 0.07));
    pe.addColorStop(1, rgba(P.onibusEscolarPreto, 0.2));
    c.fillStyle = pe; c.fillRect(0, pxY(1.3), L, A - pxY(1.3));
    const meio = c.createLinearGradient(0, 0, 0, pxY(1.3));
    meio.addColorStop(0, rgba(P.onibusEscolarPreto, 0));
    meio.addColorStop(1, rgba(P.onibusEscolarPreto, 0.04));
    c.fillStyle = meio; c.fillRect(0, 0, L, pxY(1.3));
    const rebite = (x: number, y: number): void => {
      c.fillStyle = rgba(P.onibusEscolarPreto, 0.32);
      c.beginPath(); c.arc(x, y, 2.1, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(x - 0.5, y - 0.6, 1, 0, Math.PI * 2); c.fill();
    };
    // as emendas em pé (em 0 e no meio do quadro), com a sombrinha da placa de cima e os rebites
    for (const x of [0, L / 2]) {
      for (const xx of [x, x + L]) {
        c.fillStyle = rgba(P.onibusEscolarPreto, 0.26); c.fillRect(xx - 1.5, 0, 3, A);
        c.fillStyle = rgba(P.onibusEscolarPreto, 0.08); c.fillRect(xx + 1.5, 0, 4, A);
      }
      for (let y = 6; y < A; y += 11) { rebite(x + 7, y); if (x === 0) rebite(L - 7, y); }
    }
    // as fileiras deitadas: em cima das janelas, no peitoril e no pé
    for (const y of [2.69, 1.79, 0.62]) {
      c.fillStyle = rgba(P.onibusEscolarPreto, 0.12); c.fillRect(0, pxY(y) - 1, L, 2);
      for (let x = 10; x < L; x += 21) rebite(x, pxY(y) + 5);
    }
    // escorridos de chuva bem de leve, saindo do peitoril
    c.fillStyle = rgba(P.onibusEscolarPreto, 0.05);
    for (const [x, h] of [[18, 60], [270, 44], [140, 30], [395, 52]]) c.fillRect(x, pxY(1.75), 3, h);
  }
  chapa = new THREE.CanvasTexture(cv);
  chapa.colorSpace = THREE.SRGBColorSpace;
  chapa.wrapS = THREE.RepeatWrapping;
  chapa.anisotropy = 4;
  return chapa;
}

/**
 * O UV DA CHAPA, triângulo por triângulo (pela normal da face): a lateral e o
 * teto correm em `z` (as emendas atravessam o teto na mesma linha da lateral),
 * a frente e a traseira só levam o degradê. `semEmenda` é para o capô, que é
 * uma peça só.
 */
function uvDaChapa(geo: THREE.BufferGeometry, semEmenda = false): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), n = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
    n.subVectors(c, b).cross(ab.subVectors(a, b)).normalize();
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    for (let k = 0; k < 3; k++) {
      p.fromBufferAttribute(pos, i + k);
      let u: number, v: number;
      if (semEmenda) { u = 0.25 + p.x * 1e-4; v = ay > Math.max(ax, az) && n.y > 0 ? 0.97 : p.y / 3; }
      else if (ax >= ay && ax >= az) { u = (p.z - EMENDA) / (2 * PAINEL); v = p.y / 3; }
      else if (az >= ay) { u = 0.25 + p.x * 1e-4; v = p.y / 3; }
      else if (n.y > 0) { u = (p.z - EMENDA) / (2 * PAINEL); v = 0.915 + ((p.x + LADO) / O.largura) * 0.07; }
      else { u = 0.25; v = 0.1; }
      uv[(i + k) * 2] = u; uv[(i + k) * 2 + 1] = v;
    }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

// ================================================================ o atlas do que é impresso

type Regiao = [x: number, y: number, l: number, a: number];
const ATLAS = 1024;
const R = {
  letreiro: [0, 0, 1024, 112] as Regiao,
  linha: [0, 120, 512, 128] as Regiao,
  escolar: [512, 120, 512, 128] as Regiao,
  pare: [0, 256, 256, 256] as Regiao,
  placa: [264, 256, 400, 132] as Regiao,
  numero: [672, 256, 128, 128] as Regiao,
  pata: [808, 256, 128, 192] as Regiao,
  saida: [0, 520, 512, 64] as Regiao,
  listras: [512, 520, 512, 64] as Regiao,
  vidroCima: [0, 600, 256, 128] as Regiao,
  vidroBaixo: [264, 600, 256, 128] as Regiao,
  paraBrisa: [528, 600, 256, 176] as Regiao,
  vidroPorta: [792, 600, 96, 288] as Regiao,
  vidroDeTras: [0, 744, 256, 256] as Regiao,
};

let atlas: THREE.MeshToonMaterial | null = null;
/**
 * O ATLAS: tudo o que é impresso no ônibus, num canvas só (um material, um
 * desenho por quadro). O fundo do letreiro, do 67 e do aviso da porta é
 * VAZADO (`alphaTest`): as letras ficam direto na chapa, sem um retângulo de
 * outro amarelo em volta. O resto do canvas nasce opaco, para a beira das
 * regiões não sumir de longe (o mipmap mistura a vizinha).
 */
function materialDoAtlas(): THREE.MeshToonMaterial {
  if (atlas) return atlas;
  const cv = document.createElement('canvas');
  cv.width = ATLAS; cv.height = ATLAS;
  const c = cv.getContext('2d');
  if (c) {
    c.fillStyle = css(P.onibusEscolarVidro); c.fillRect(0, 0, ATLAS, ATLAS);
    for (const r of [R.letreiro, R.numero, R.saida]) c.clearRect(r[0], r[1], r[2], r[3]);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    const dentro = (r: Regiao, f: (x: number, y: number, l: number, a: number) => void): void => {
      c.save(); c.beginPath(); c.rect(r[0], r[1], r[2], r[3]); c.clip(); f(r[0], r[1], r[2], r[3]); c.restore();
    };
    // o letreiro da lateral: a letra de ônibus escolar, preta, com o fio de pintura em volta
    dentro(R.letreiro, (x, y, l, a) => {
      c.font = `900 80px ${FONTE_DE_ONIBUS}`;
      c.lineWidth = 5; c.strokeStyle = rgba(P.onibusEscolarPreto, 0.6); c.strokeText('ESCOLA DO GATITO', x + l / 2, y + a / 2 + 4);
      c.fillStyle = css(P.onibusEscolarPreto); c.fillText('ESCOLA DO GATITO', x + l / 2, y + a / 2 + 4);
    });
    const placaPreta = (x: number, y: number, l: number, a: number, texto: (cx: number, cy: number) => void): void => {
      c.fillStyle = css(P.onibusEscolarPreto); c.fillRect(x, y, l, a);
      c.strokeStyle = rgba(P.metalWhite, 0.35); c.lineWidth = 4; c.strokeRect(x + 6, y + 6, l - 12, a - 12);
      texto(x + l / 2, y + a / 2);
    };
    // a placa da linha: o 67 (o "six seven" do Gatito) e "ESCOLA"
    dentro(R.linha, (x, y, l, a) => placaPreta(x, y, l, a, (_cx, cy) => {
      c.fillStyle = css(P.gatitosAmarelo);
      c.font = `900 86px ${FONTE_DE_ONIBUS}`; c.fillText('67', x + 118, cy + 4);
      c.fillStyle = rgba(P.metalWhite, 0.35); c.fillRect(x + 214, y + 22, 4, a - 44);
      c.fillStyle = css(P.gatitosAmarelo);
      c.font = `900 56px ${FONTE_DE_ONIBUS}`; c.fillText('ESCOLA', x + 360, cy + 4);
    }));
    // o "ESCOLAR" de trás
    dentro(R.escolar, (x, y, l, a) => placaPreta(x, y, l, a, (cx, cy) => {
      c.fillStyle = css(P.gatitosAmarelo); c.font = `900 70px ${FONTE_DE_ONIBUS}`; c.fillText('ESCOLAR', cx, cy + 4);
    }));
    // o PARE: o octógono vermelho com a borda branca (a ponta virada como a do disco de 8 gomos)
    dentro(R.pare, (x, y, l) => {
      const cx = x + l / 2, cy = y + l / 2;
      const octo = (r: number): void => { c.beginPath(); for (let k = 0; k < 8; k++) { const an = Math.PI / 8 + (k / 8) * Math.PI * 2; c.lineTo(cx + Math.cos(an) * r, cy + Math.sin(an) * r); } c.closePath(); };
      c.fillStyle = css(P.metalWhite); c.fillRect(x, y, l, l);
      c.fillStyle = css(P.onibusEscolarPare); octo(116); c.fill();
      c.fillStyle = css(P.metalWhite); c.font = `900 70px ${FONTE_DE_ONIBUS}`; c.fillText('PARE', cx, cy + 4);
    });
    // a placa do Mercosul
    dentro(R.placa, (x, y, l, a) => {
      c.fillStyle = css(P.onibusEscolarPlaca); c.fillRect(x, y, l, a);
      c.fillStyle = css(P.onibusEscolarPlacaAzul); c.fillRect(x, y, l, 30);
      c.fillStyle = css(P.metalWhite); c.font = '700 22px system-ui, sans-serif'; c.fillText('BRASIL', x + l / 2, y + 16);
      c.fillStyle = css(P.onibusEscolarPreto); c.font = '800 74px ui-monospace, "Courier New", monospace'; c.fillText('GAT6A67', x + l / 2, y + 84);
      c.strokeStyle = css(P.onibusEscolarPreto); c.lineWidth = 5; c.strokeRect(x + 2.5, y + 2.5, l - 5, a - 5);
    });
    // o número do ônibus, vazado
    dentro(R.numero, (x, y, l, a) => {
      c.fillStyle = css(P.onibusEscolarPreto); c.font = `900 92px ${FONTE_DE_ONIBUS}`; c.fillText('67', x + l / 2, y + a / 2 + 4);
    });
    // o para-barro: borracha preta com a pata amarela dos Gatitos e os frisos da borracha
    dentro(R.pata, (x, y, l, a) => {
      c.fillStyle = css(P.onibusEscolarPreto); c.fillRect(x, y, l, a);
      c.fillStyle = rgba(P.metalWhite, 0.14);
      for (let k = 0; k < 4; k++) c.fillRect(x + 8, y + 10 + k * 8, l - 16, 2);
      c.fillStyle = css(P.gatitosAmarelo);
      const cx = x + l / 2, cy = y + a * 0.58;
      c.beginPath(); c.ellipse(cx, cy + 14, 30, 24, 0, 0, Math.PI * 2); c.fill();
      for (const [dx, dy, r] of [[-30, -16, 11], [-11, -32, 12], [11, -32, 12], [30, -16, 11]]) { c.beginPath(); c.ellipse(cx + dx, cy + dy, r * 0.85, r, 0, 0, Math.PI * 2); c.fill(); }
    });
    // o aviso da porta de trás, vazado
    dentro(R.saida, (x, y, l, a) => {
      c.fillStyle = css(P.onibusEscolarPare); c.font = `900 40px ${FONTE_DE_ONIBUS}`; c.fillText('SAÍDA DE EMERGÊNCIA', x + l / 2, y + a / 2 + 3);
    });
    // as listras pretas e amarelas do para-choque de trás
    dentro(R.listras, (x, y, l, a) => {
      c.fillStyle = css(P.gatitosAmarelo); c.fillRect(x, y, l, a);
      c.fillStyle = css(P.onibusEscolarPreto);
      for (let k = -2; k < 20; k++) { const x0 = x + k * 40; c.beginPath(); c.moveTo(x0, y + a); c.lineTo(x0 + 20, y + a); c.lineTo(x0 + 20 + a, y); c.lineTo(x0 + a, y); c.closePath(); c.fill(); }
    });
    // os VIDROS: o céu refletido em cima, o escuro de dentro do ônibus embaixo e o risco de brilho
    const fundoDoVidro = css(new THREE.Color(P.onibusEscolarVidro).lerp(new THREE.Color(P.onibusEscolarPreto), 0.45).getHex());
    const vidro = (x: number, y: number, l: number, a: number, porDentro: (() => void) | null): void => {
      const g = c.createLinearGradient(0, y, 0, y + a);
      g.addColorStop(0, css(P.onibusEscolarReflexo));
      g.addColorStop(0.42, css(P.onibusEscolarVidro));
      g.addColorStop(1, fundoDoVidro);
      c.fillStyle = g; c.fillRect(x, y, l, a);
      if (porDentro) {
        porDentro();
        c.fillStyle = rgba(P.onibusEscolarVidro, 0.38); c.fillRect(x, y, l, a);
      }
      c.fillStyle = rgba(P.metalWhite, 0.32);
      c.beginPath(); c.moveTo(x + l * 0.18, y + a); c.lineTo(x + l * 0.34, y + a); c.lineTo(x + l * 0.62, y); c.lineTo(x + l * 0.46, y); c.closePath(); c.fill();
      c.fillStyle = rgba(P.metalWhite, 0.16);
      c.beginPath(); c.moveTo(x + l * 0.4, y + a); c.lineTo(x + l * 0.45, y + a); c.lineTo(x + l * 0.73, y); c.lineTo(x + l * 0.68, y); c.closePath(); c.fill();
    };
    /** o encosto do banco escolar aparecendo pela metade de baixo da janela (o azul dos Gatitos) */
    const encosto = (x: number, y: number, l: number, a: number, alto: number): void => {
      const topo = y + a * (1 - alto);
      c.fillStyle = css(P.gatitosAzulEscuro);
      c.beginPath(); c.roundRect(x + l * 0.1, topo, l * 0.8, a, 18); c.fill();
      c.fillStyle = css(P.gatitosAzul);
      c.beginPath(); c.roundRect(x + l * 0.12, topo + 3, l * 0.76, 10, 6); c.fill();
      c.fillStyle = rgba(P.onibusEscolarPreto, 0.3); c.fillRect(x + l * 0.5 - 1, topo + 16, 2, a);
    };
    dentro(R.vidroCima, (x, y, l, a) => vidro(x, y, l, a, null));
    dentro(R.vidroBaixo, (x, y, l, a) => vidro(x, y, l, a, () => encosto(x, y, l, a, 0.62)));
    dentro(R.paraBrisa, (x, y, l, a) => vidro(x, y, l, a, () => {
      // o painel escuro lá embaixo
      c.fillStyle = css(P.onibusEscolarPreto); c.fillRect(x, y + a * 0.82, l, a * 0.18);
    }));
    dentro(R.vidroPorta, (x, y, l, a) => vidro(x, y, l, a, () => {
      // o corrimão de dentro e os degraus
      c.fillStyle = css(P.onibusCromo); c.fillRect(x + l * 0.7, y + a * 0.25, 5, a * 0.6);
      c.fillStyle = css(P.onibusEscolarPreto); c.fillRect(x, y + a * 0.86, l, a * 0.14);
    }));
    dentro(R.vidroDeTras, (x, y, l, a) => vidro(x, y, l, a, () => {
      // o corredor: os encostos dos dois lados, em fila, ficando menores
      for (let k = 0; k < 3; k++) {
        const s = 1 - k * 0.22, w = l * 0.32 * s, h = a * 0.35 * s, yy = y + a * 0.62 - k * a * 0.06;
        c.fillStyle = css(P.gatitosAzulEscuro);
        c.beginPath(); c.roundRect(x + l * 0.04 + k * l * 0.08, yy, w, h + a, 12); c.fill();
        c.beginPath(); c.roundRect(x + l * 0.96 - w - k * l * 0.08, yy, w, h + a, 12); c.fill();
      }
    }));
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  atlas = toon(P.placaPintada, { mapa: tex });
  atlas.alphaTest = 0.5;
  return atlas;
}

/** leva o UV (0 a 1) de uma geometria para a região dela no atlas */
function noAtlas<G extends THREE.BufferGeometry>(geo: G, r: Regiao): G {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (r[0] + uv.getX(i) * r[2]) / ATLAS, 1 - (r[1] + (1 - uv.getY(i)) * r[3]) / ATLAS);
  }
  return geo;
}

/** um plano impresso, virado para o lado `lado` (+1 é o `+X`, −1 o `−X`) */
function impressoDeLado(l: number, a: number, r: Regiao, lado: number): THREE.Mesh {
  return new THREE.Mesh(noAtlas(new THREE.PlaneGeometry(l, a), r).rotateY(lado * Math.PI / 2), materialDoAtlas());
}

/** um plano impresso virado para trás (`−Z`) */
function impressoDeTras(l: number, a: number, r: Regiao): THREE.Mesh {
  return new THREE.Mesh(noAtlas(new THREE.PlaneGeometry(l, a), r).rotateY(Math.PI), materialDoAtlas());
}

// ================================================================ o que é pintado nos vértices

/** pinta a geometria inteira de uma cor (o atributo `color`, para juntar várias numa malha) */
function pintada(geo: THREE.BufferGeometry, cor: number): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const nome of Object.keys(g.attributes)) if (nome !== 'position' && nome !== 'normal') g.deleteAttribute(nome);
  const c = new THREE.Color(cor);
  const n = g.attributes.position.count;
  const cores = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) cores.set([c.r, c.g, c.b], i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return g;
}

/**
 * A RODA, olhando para `+Z` (quem monta a vira para o lado): o pneu torneado de
 * banda redonda, o aro pintado com os seis furos e a beira, a calota de cromo e
 * as oito porcas — tudo pintado nos vértices. `dupla` põe o pneu de dentro, e o
 * aro de fora fica fundo, com o cubo saindo dele.
 */
function geoDaRoda(dupla: boolean): THREE.BufferGeometry {
  const r = RODA;
  const pedacos: THREE.BufferGeometry[] = [];
  const pneu = (z: number): void => {
    const perfil = [[0.27, -0.13], [0.39, -0.14], [0.445, -0.125], [r, -0.07], [r, 0.07], [0.445, 0.125], [0.39, 0.14], [0.27, 0.13]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(perfil, 26);
    g.rotateX(Math.PI / 2);
    g.translate(0, 0, z);
    pedacos.push(pintada(g, P.onibusPneu));
  };
  pneu(0);
  if (dupla) pneu(-0.28);
  const fundo = dupla ? -0.035 : 0;
  const aro = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 26);
  aro.rotateX(Math.PI / 2);
  aro.translate(0, 0, fundo);
  pedacos.push(pintada(aro, P.metalWhite));
  const beira = new THREE.TorusGeometry(0.265, 0.018, 6, 26);
  beira.translate(0, 0, 0.1 + fundo);
  pedacos.push(pintada(beira, P.onibusCalota));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const furo = new THREE.CylinderGeometry(0.032, 0.032, 0.01, 10);
    furo.rotateX(Math.PI / 2);
    furo.translate(Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.101 + fundo);
    pedacos.push(pintada(furo, P.onibusEscolarPreto));
  }
  const cubo = new THREE.CylinderGeometry(0.12, 0.13, dupla ? 0.12 : 0.04, 18);
  cubo.rotateX(Math.PI / 2);
  cubo.translate(0, 0, dupla ? 0.09 : 0.115);
  pedacos.push(pintada(cubo, P.onibusCromo));
  const calota = new THREE.SphereGeometry(0.1, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  calota.scale(1, 0.45, 1);
  calota.rotateX(Math.PI / 2);
  calota.translate(0, 0, dupla ? 0.145 : 0.13);
  pedacos.push(pintada(calota, P.onibusCromo));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    const porca = new THREE.CylinderGeometry(0.016, 0.016, 0.03, 6);
    porca.rotateX(Math.PI / 2);
    porca.translate(Math.cos(a) * 0.085, Math.sin(a) * 0.085, dupla ? 0.15 : 0.135);
    pedacos.push(pintada(porca, P.onibusChassi));
  }
  return mergeGeometries(pedacos) as THREE.BufferGeometry;
}

/** o braço de travessia: o cano listrado de amarelo e preto com o arco na ponta (deitado em `x`) */
function geoDoBracoDeTravessia(comprimento: number): THREE.BufferGeometry {
  const pedacos: THREE.BufferGeometry[] = [];
  const passo = 0.14;
  for (let i = 0, x = 0; x < comprimento - 1e-6; i++, x += passo) {
    const l = Math.min(passo, comprimento - x);
    const seg = new THREE.CylinderGeometry(0.026, 0.026, l, 10);
    seg.rotateZ(Math.PI / 2);
    seg.translate(x + l / 2, 0, 0);
    pedacos.push(pintada(seg, i % 2 ? P.onibusEscolarPreto : P.gatitosAmarelo));
  }
  const ponta = new THREE.TorusGeometry(0.07, 0.016, 6, 16);
  ponta.translate(comprimento + 0.06, 0, 0);
  pedacos.push(pintada(ponta, P.gatitosAmarelo));
  return mergeGeometries(pedacos) as THREE.BufferGeometry;
}

// ================================================================ o ônibus

export function onibusEscolarDosGatitos(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'onibus-escolar-dos-gatitos';
  const lataria = toon(P.onibusEscolarAmarelo, { mapa: chapaDoOnibus() });
  const amarelo = toon(P.onibusEscolarAmarelo);
  const preto = toon(P.onibusEscolarPreto);
  const cromo = toon(P.onibusCromo);
  const aluminio = toon(P.onibusCalota);
  const pretoDosDoisLados = toon(P.onibusEscolarPreto, { doubleSide: true });
  const luzVermelha = toon(P.onibusEscolarPare, { glow: 0.45 });
  const luzAmbar = toon(P.gatitosAmarelo, { glow: 0.45 });
  const farol = toon(P.sorveteriaCreme, { glow: 0.5 });
  const impresso = materialDoAtlas();
  const pintadas: THREE.BufferGeometry[] = [];
  const por = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, pai: THREE.Object3D = g): T => { o.position.set(x, y, z); pai.add(o); return o; };
  const malha = (geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh => new THREE.Mesh(geo, mat);
  /** um quadro assentado na lataria: o `+Z` dele na normal */
  const assentado = (p: THREE.Vector3, n: THREE.Vector3): THREE.Group => {
    const q = por(new THREE.Group(), p.x, p.y, p.z);
    q.lookAt(p.clone().add(n));
    return q;
  };
  /** uma lâmpada redonda com o aro de cromo e (se `pala`) a pala preta por cima, no quadro `q` (olhando o `+Z` dele) */
  const lampada = (q: THREE.Object3D, x: number, y: number, raio: number, mat: THREE.Material, pala: boolean, z = 0): void => {
    por(malha(new THREE.CylinderGeometry(raio, raio, 0.05, 16).rotateX(Math.PI / 2), mat), x, y, z + 0.02, q);
    por(malha(new THREE.TorusGeometry(raio + 0.006, 0.012, 6, 18), cromo), x, y, z + 0.045, q);
    if (pala) por(malha(new THREE.CylinderGeometry(raio + 0.025, raio + 0.025, 0.09, 14, 1, true, -Math.PI / 2, Math.PI).rotateX(-Math.PI / 2), pretoDosDoisLados), x, y, z + 0.075, q);
  };

  // ------------------------------------------------------- a carroceria e o capô
  g.add(malha(uvDaChapa(extrudarDeLado(perfilDaCarroceria(), MEIA)), lataria));
  g.add(malha(uvDaChapa(extrudarDeLado(perfilDoCapo(), 0.94 - BISEL_DO_CAPO, BISEL_DO_CAPO, 4), true), lataria));
  // o aro preto da caixa de roda de trás, dos dois lados
  {
    const a0 = Math.asin((CHAO_DA_FORMA - RODA) / (ARCO - B));
    for (const lado of [-1, 1]) {
      por(malha(new THREE.TorusGeometry(ARCO - B + 0.02, 0.035, 6, 24, Math.PI - 2 * a0).rotateZ(a0).rotateY(Math.PI / 2), preto), lado * (LADO + 0.002), RODA, EIXO_TRAS);
    }
  }
  // os para-lamas da frente: um arco gordo de quina macia por cima de cada roda
  {
    const s = new THREE.Shape();
    const fora = 0.72, dentro = 0.6, a0 = -0.22, a1 = Math.PI + 0.22;
    s.absarc(EIXO_FRENTE, RODA, fora, a0, a1, false);
    s.absarc(EIXO_FRENTE, RODA, dentro, a1, a0, true);
    s.closePath();
    const geo = extrudarDeLado(s, 0.14, 0.045, 3);
    for (const lado of [-1, 1]) por(malha(geo.clone(), preto), lado * 0.95, 0, 0);
  }
  // o chassi por baixo, entre as rodas, e o tanque de combustível do lado da calçada
  por(malha(quina(O.largura - 0.3, 0.2, 7.2, 0.04), preto), 0, CHAO - 0.02, -1.0);
  por(malha(new THREE.CylinderGeometry(0.17, 0.17, 0.9, 16).rotateX(Math.PI / 2), aluminio), -0.86, 0.36, -1.35);
  for (const dz of [-0.3, 0.3]) por(malha(new THREE.TorusGeometry(0.175, 0.012, 6, 18), preto), -0.86, 0.36, -1.35 + dz);

  // ------------------------------------------------------- dos lados
  const zJanelas = [-4.35, -3.6, -2.85, -2.1, -1.35, -0.6, 0.15, 0.9];
  for (const lado of [-1, 1] as const) {
    const x = lado * (LADO + 0.004);
    // a faixa preta atrás das janelas (a borracha)
    por(malha(quina(0.02, 0.86, 6.0, 0.01), preto), x, 2.24, -1.72);
    // cada janela: o caixilho de alumínio e os dois vidros (o de baixo deixa ver o banco)
    for (const z of zJanelas) {
      por(malha(quina(0.016, 0.74, 0.66, 0.025), aluminio), x + lado * 0.006, 2.235, z);
      por(impressoDeLado(0.58, 0.3, R.vidroCima, lado), x + lado * 0.019, 2.42, z);
      por(impressoDeLado(0.58, 0.3, R.vidroBaixo, lado), x + lado * 0.019, 2.05, z);
    }
    // os três frisos pretos (do lado da calçada, eles param antes da porta)
    const z0 = CORPO.tras + 0.04, z1 = lado < 0 ? 1.76 : CORPO.frente - 0.07;
    for (const y of [0.92, 1.27, 1.62]) por(malha(quina(0.035, 0.065, z1 - z0, 0.025), preto), x, y, (z0 + z1) / 2);
    // o letreiro do alto, o número e o emblema dos Gatitos
    por(impressoDeLado(4.7, 0.4, R.letreiro, lado), x + lado * 0.006, 2.83, -1.72);
    por(impressoDeLado(0.34, 0.34, R.numero, lado), x + lado * 0.006, 1.1, -4.3);
    const emb = emblemaDosGatitos(0.2);
    emb.rotation.y = lado * Math.PI / 2;
    por(emb, x, 1.1, -2.4);
    // os pisca-laterais âmbar (na frente e atrás) e as luzinhas de quina do teto (âmbar na frente, vermelha atrás)
    for (const z of [2.62, -4.75]) por(malha(new THREE.SphereGeometry(0.05, 10, 6).scale(0.5, 1, 1.4), luzAmbar), x, 1.45, z);
    por(malha(new THREE.SphereGeometry(0.04, 10, 6).scale(0.5, 1, 1), luzAmbar), x, 2.78, 2.25);
    por(malha(new THREE.SphereGeometry(0.04, 10, 6).scale(0.5, 1, 1), luzVermelha), x, 2.78, -4.78);
    // as venezianas do capô
    for (let i = 0; i < 5; i++) por(malha(quina(0.02, 0.035, 0.32, 0.012), preto), lado * 0.943, 1.22 + i * 0.075, 3.0);
  }

  // ------------------------------------------------------- a PORTA sanfonada, do lado da calçada (−X)
  {
    const x = -(LADO + 0.012);
    por(malha(quina(0.03, 1.9, 0.72, 0.03), preto), x, 1.57, 2.15);
    for (const z of [1.985, 2.315]) {
      por(impressoDeLado(0.27, 0.86, R.vidroPorta, -1), x - 0.018, 2.0, z);
      por(impressoDeLado(0.27, 0.66, R.vidroPorta, -1), x - 0.018, 1.1, z);
    }
    // a emenda de cromo entre as duas folhas, a luzinha em cima da porta e os dois degraus
    por(malha(quina(0.014, 1.82, 0.03, 0.006), cromo), x - 0.02, 1.57, 2.15);
    por(malha(new THREE.SphereGeometry(0.045, 10, 6).scale(0.5, 0.7, 1.6), luzAmbar), x - 0.01, 2.6, 2.15);
    por(malha(quina(0.28, 0.05, 0.66, 0.015), preto), -LADO + 0.1, 0.44, 2.15);
    por(malha(quina(0.2, 0.05, 0.62, 0.015), aluminio), -LADO + 0.06, 0.24, 2.15);
  }
  // a janela do motorista (+X) e o BRAÇO DE PARE dobrado contra a lateral, abaixo dela
  {
    const x = LADO + 0.004;
    por(malha(quina(0.02, 0.86, 0.66, 0.01), preto), x, 2.24, 2.05);
    por(malha(quina(0.016, 0.74, 0.58, 0.025), aluminio), x + 0.006, 2.235, 2.05);
    por(impressoDeLado(0.5, 0.3, R.vidroCima, 1), x + 0.019, 2.42, 2.05);
    por(impressoDeLado(0.5, 0.3, R.vidroBaixo, 1), x + 0.019, 2.05, 2.05);
    // a caixa da dobradiça, o braço e o octógono com as duas luzes
    por(malha(quina(0.09, 0.4, 0.12, 0.03), preto), x + 0.04, 1.48, 1.92);
    por(malha(quina(0.04, 0.06, 0.32, 0.015), preto), x + 0.06, 1.48, 1.74);
    por(malha(noAtlas(new THREE.CircleGeometry(0.28, 8, Math.PI / 8), R.pare).rotateY(Math.PI / 2), impresso), x + 0.085, 1.48, 1.56);
    for (const dy of [0.2, -0.2]) {
      const q = por(new THREE.Group(), x + 0.086, 1.48 + dy, 1.56);
      q.rotation.y = Math.PI / 2;
      lampada(q, 0, 0, 0.04, luzVermelha, false, -0.02);
    }
  }

  // ------------------------------------------------------- a frente da carroceria: o para-brisa, os limpadores, as luzes de alerta e os retrovisores
  {
    // o para-brisa em duas folhas assentado na frente deitada, com a borracha e a coluna do meio
    const { p, n } = naCapa(true, 2.22);
    const q = assentado(p, n);
    por(malha(quina(2.26, 0.76, 0.04, 0.03), preto), 0, 0, 0, q);
    for (const s of [-1, 1]) {
      por(malha(noAtlas(new THREE.PlaneGeometry(1.04, 0.66), R.paraBrisa), impresso), s * 0.555, 0, 0.022, q);
      // o limpador deitado na beira de baixo do vidro, e o eixo dele
      const lim = por(malha(quina(0.62, 0.025, 0.02, 0.008), preto), s * 0.5, -0.27, 0.035, q);
      lim.rotation.z = s * 0.18;
      por(malha(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 10).rotateX(Math.PI / 2), preto), s * 0.22, -0.31, 0.03, q);
    }
    // a caixa das luzes de alerta, com a placa da linha no meio
    const alto = naCapa(true, 2.78);
    const caixa = assentado(alto.p, alto.n);
    por(malha(quina(2.12, 0.27, 0.1, 0.035), preto), 0, 0, 0, caixa);
    por(malha(noAtlas(new THREE.PlaneGeometry(0.94, 0.235), R.linha), impresso), 0, 0, 0.051, caixa);
    for (const s of [-1, 1]) {
      lampada(caixa, s * 0.88, 0, 0.075, luzVermelha, true, 0.03);
      lampada(caixa, s * 0.66, 0, 0.065, luzAmbar, true, 0.03);
    }
    // os retrovisores grandes, um em cada quina do para-brisa: a haste de cromo e o espelho de caixa preta
    for (const s of [-1, 1]) {
      const raiz = new THREE.Vector3(s * (LADO - 0.03), 2.35, 2.42);
      const ponta = new THREE.Vector3(s * (LADO + 0.24), 2.24, 2.6);
      const haste = new THREE.CatmullRomCurve3([raiz, new THREE.Vector3(s * (LADO + 0.14), 2.36, 2.55), ponta]);
      g.add(malha(new THREE.TubeGeometry(haste, 10, 0.016, 6), cromo));
      por(malha(quina(0.18, 0.38, 0.07, 0.03), preto), ponta.x + s * 0.04, ponta.y - 0.06, ponta.z + 0.02);
      por(malha(new THREE.PlaneGeometry(0.14, 0.32).rotateY(Math.PI), aluminio), ponta.x + s * 0.04, ponta.y - 0.06, ponta.z - 0.017);
    }
  }

  // ------------------------------------------------------- o nariz: a grade, os faróis, o emblema, os espelhos de capô, o para-choque
  {
    const inclina = -0.11;
    // a grade: o aro de cromo, o fundo preto, as barras em pé e as duas deitadas
    por(malha(quina(0.66, 0.58, 0.06, 0.035), cromo), 0, 1.03, NARIZ - 0.012).rotation.x = inclina;
    por(malha(quina(0.56, 0.48, 0.04, 0.02), preto), 0, 1.03, NARIZ + 0.006).rotation.x = inclina;
    for (let i = -3; i <= 3; i++) por(malha(quina(0.03, 0.46, 0.03, 0.01), cromo), i * 0.075, 1.03, NARIZ + 0.016).rotation.x = inclina;
    for (const y of [0.88, 1.18]) por(malha(quina(0.54, 0.02, 0.03, 0.008), cromo), 0, y, NARIZ + 0.018 - (y - 1.03) * 0.11).rotation.x = inclina;
    por(emblemaDosGatitos(0.11), 0, 1.6, NARIZ - 0.12).rotation.x = -0.7;
    for (const s of [-1, 1]) {
      // o farol redondo: a cuba de cromo, o aro e a lente acesa
      por(malha(new THREE.CylinderGeometry(0.13, 0.135, 0.08, 20).rotateX(Math.PI / 2), cromo), s * 0.6, 1.03, NARIZ);
      por(malha(new THREE.TorusGeometry(0.118, 0.022, 8, 22), cromo), s * 0.6, 1.03, NARIZ + 0.042);
      por(malha(new THREE.SphereGeometry(0.105, 16, 8).scale(1, 1, 0.38), farol), s * 0.6, 1.03, NARIZ + 0.03);
      // a seta âmbar embaixo dele
      por(malha(quina(0.15, 0.075, 0.05, 0.02), luzAmbar), s * 0.6, 0.79, NARIZ - 0.02);
      // o espelho de capô: a haste de cromo em curva e o espelho redondo, virado para o motorista
      const pe = new THREE.Vector3(s * 0.7, 1.74, NARIZ - 0.55);
      const fim = new THREE.Vector3(s * 1.05, 2.1, NARIZ - 0.38);
      g.add(malha(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([pe, new THREE.Vector3(s * 0.84, 2.02, NARIZ - 0.5), fim]), 10, 0.014, 6), cromo));
      por(malha(new THREE.CylinderGeometry(0.03, 0.04, 0.03, 10), cromo), pe.x, pe.y, pe.z);
      const esp = por(new THREE.Group(), fim.x + s * 0.03, fim.y + 0.04, fim.z + 0.02);
      esp.lookAt(new THREE.Vector3(0.6, 2.2, 1.6));
      por(malha(new THREE.SphereGeometry(0.115, 14, 8).scale(1, 1, 0.45), preto), 0, 0, -0.03, esp);
      por(malha(new THREE.TorusGeometry(0.108, 0.014, 6, 18), cromo), 0, 0, 0.012, esp);
      por(malha(new THREE.CircleGeometry(0.1, 18), aluminio), 0, 0, 0.016, esp);
    }
    // o para-choque preto, a placa do Mercosul e o braço de travessia dobrado na frente dele (do lado da porta)
    por(malha(quina(2.24, 0.22, 0.16, 0.05), preto), 0, 0.5, NARIZ + 0.07);
    por(malha(noAtlas(new THREE.PlaneGeometry(0.39, 0.13), R.placa), impresso), 0, 0.53, NARIZ + 0.154);
    por(malha(quina(0.12, 0.17, 0.08, 0.025), preto), -0.98, 0.45, NARIZ + 0.18);
    const braco = geoDoBracoDeTravessia(1.15);
    braco.translate(-0.93, 0.42, NARIZ + 0.2);
    pintadas.push(braco);
  }

  // ------------------------------------------------------- em cima: as orelhinhas de gato e as escotilhas
  {
    const orelha = new THREE.Shape();
    orelha.moveTo(-0.32, 0); orelha.lineTo(0.02, 0.55); orelha.lineTo(0.32, 0); orelha.closePath();
    const miolo = new THREE.Shape();
    miolo.moveTo(-0.17, 0.04); miolo.lineTo(0.02, 0.38); miolo.lineTo(0.17, 0.04); miolo.closePath();
    for (const s of [-1, 1]) {
      const o = por(malha(new THREE.ExtrudeGeometry(orelha, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 }), amarelo), s * 0.68, O.teto - 0.06, 1.7);
      o.rotation.set(0, 0, -s * 0.18);
      const m = por(malha(new THREE.ExtrudeGeometry(miolo, { depth: 0.03, bevelEnabled: false }), toon(P.onibusEscolarOrelha)), s * 0.68 - s * 0.012, O.teto - 0.02, 1.7 + 0.11);
      m.rotation.set(0, 0, -s * 0.18);
    }
    // as duas escotilhas de emergência: a moldura, a tampa, a dobradiça e a alça vermelha
    for (const z of [-0.7, -3.4]) {
      por(malha(quina(0.7, 0.06, 0.7, 0.025), aluminio), 0, O.teto + 0.005, z);
      por(malha(quina(0.58, 0.06, 0.58, 0.025), toon(P.metalWhite)), 0, O.teto + 0.03, z);
      por(malha(quina(0.4, 0.03, 0.05, 0.01), preto), 0, O.teto + 0.05, z - 0.3);
      por(malha(quina(0.2, 0.03, 0.06, 0.01), toon(P.onibusEscolarPare)), 0, O.teto + 0.055, z + 0.18);
    }
  }

  // ------------------------------------------------------- atrás: a porta de emergência, as janelinhas, as lanternas e o para-choque
  {
    const z = CORPO.tras;
    // a porta: o contorno de borracha (a chapa amarela aparece dentro), os vidros e o aviso
    for (const [x, y, l, a] of [[0, 2.47, 0.96, 0.04], [0, 0.86, 0.96, 0.04], [-0.47, 1.665, 0.04, 1.61], [0.47, 1.665, 0.04, 1.61]] as const) {
      // (as em pé um tico mais fundas que as deitadas: nas quinas, as faces não coincidem)
      por(malha(quina(l, a, a > 1 ? 0.036 : 0.03, 0.012), preto), x, y, z - 0.008);
    }
    por(malha(quina(0.84, 0.72, 0.03, 0.025), preto), 0, 2.06, z - 0.008);
    por(malha(quina(0.84, 0.5, 0.03, 0.025), preto), 0, 1.24, z - 0.008);
    por(impressoDeTras(0.76, 0.64, R.vidroDeTras), 0, 2.06, z - 0.026);
    por(impressoDeTras(0.76, 0.42, R.vidroDeTras), 0, 1.24, z - 0.026);
    por(impressoDeTras(0.82, 0.1, R.saida), 0, 1.63, z - 0.004);
    por(malha(quina(0.2, 0.04, 0.05, 0.015), cromo), -0.3, 1.48, z - 0.03);
    for (const s of [-1, 1]) {
      // as janelinhas dos dois lados da porta
      por(malha(quina(0.46, 0.68, 0.03, 0.025), preto), s * 0.8, 2.1, z - 0.008);
      por(impressoDeTras(0.38, 0.6, R.vidroCima), s * 0.8, 2.1, z - 0.026);
      // as lanternas: a vermelha grande e a âmbar em cima, com o aro de cromo
      const q = por(new THREE.Group(), s * 0.85, 0, z);
      q.rotation.y = Math.PI;
      lampada(q, 0, 1.08, 0.1, luzVermelha, false);
      lampada(q, 0, 1.45, 0.075, luzAmbar, false);
      // os frisos dão a volta: dos dois lados da porta
      for (const y of [0.92, 1.27, 1.62]) por(malha(quina(0.58, 0.065, 0.035, 0.025), preto), s * 0.83, y, z - 0.004);
    }
    // a caixa das luzes de alerta, com o "ESCOLAR" no meio
    const alto = naCapa(false, 2.78);
    const caixa = assentado(alto.p, alto.n);
    por(malha(quina(2.12, 0.27, 0.1, 0.035), preto), 0, 0, 0, caixa);
    por(malha(noAtlas(new THREE.PlaneGeometry(0.94, 0.235), R.escolar), impresso), 0, 0, 0.051, caixa);
    for (const s of [-1, 1]) {
      lampada(caixa, s * 0.88, 0, 0.075, luzVermelha, true, 0.03);
      lampada(caixa, s * 0.66, 0, 0.065, luzAmbar, true, 0.03);
    }
    // o para-choque listrado e o escapamento
    por(malha(quina(2.34, 0.22, 0.18, 0.05), preto), 0, 0.5, z - 0.09);
    por(impressoDeTras(2.2, 0.15, R.listras), 0, 0.5, z - 0.184);
    por(malha(new THREE.CylinderGeometry(0.045, 0.045, 0.3, 10).rotateX(Math.PI / 2), cromo), 0.75, 0.32, z - 0.03);
  }

  // ------------------------------------------------------- as rodas (a da frente simples, a de trás dupla) e os para-barros
  for (const [z, dupla] of [[EIXO_FRENTE, false], [EIXO_TRAS, true]] as const) {
    const base = geoDaRoda(dupla);
    for (const lado of [-1, 1]) {
      const r = base.clone();
      r.rotateY(lado * Math.PI / 2);
      r.translate(lado * (dupla ? 1.0 : 0.93), RODA, z);
      pintadas.push(r);
    }
  }
  for (const lado of [-1, 1]) {
    const zp = EIXO_TRAS - 0.74;
    por(malha(quina(0.34, 0.44, 0.025, 0.012), preto), lado * 1.0, 0.32, zp);
    por(impressoDeTras(0.3, 0.4, R.pata), lado * 1.0, 0.32, zp - 0.017);
  }

  // o que é pintado nos vértices (as rodas e o braço de travessia) é uma malha só,
  // e as peças de cor lisa juntam-se a ela
  g.add(malha(mergeGeometries(pintadas) as THREE.BufferGeometry, toon(0xffffff, { corPorVertice: true })));
  juntarPorCor(g);
  return g;
}
