import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';
import { canvasComLetra } from './halloween/carrinhoDePocoes';
import { FONTE_FORMA } from './halloween/barracaDoWalter';
import { emblemaDosGatitos } from './uniformeDosGatitos';

/**
 * ===================================== O ÔNIBUS ESCOLAR DOS GATITOS
 *
 * O "carro" do Gatito (`docs/CARROS-DA-ESCOLA.md` §1), na decisão do Renan: "o
 * Gatito mora na escola! Mas deixe estacionado um ônibus escolar dos Gatitos".
 * O Gatito não sai na estrada; o ônibus fica parado no lote da escola, de lado,
 * atravessado em quatro vagas da fila de trás.
 *
 * É o ônibus escolar AMERICANO de nariz comprido, que combina com a escola de
 * tijolinho "de filme" da foto do Renan:
 *  - a CARROCERIA é o perfil de lado extrudado na largura com BISEL (o molde do
 *    ônibus da cidade, `onibusDaCidade.ts`): o teto com as quinas redondas, o
 *    para-brisa um tico deitado e a caixa de roda de trás recortada; o CAPÔ é
 *    outro perfil, mais estreito, com o nariz redondo e os para-lamas pretos;
 *  - dos lados: a fila de JANELAS sobre a faixa preta, os três FRISOS pretos, o
 *    letreiro "ESCOLA DO GATITO" no alto, o EMBLEMA dos Gatitos, a porta
 *    sanfonada (do lado da calçada, o `−X`) e o BRAÇO DE PARE dobrado (do lado
 *    do motorista, o `+X`);
 *  - em cima: as LUZES DE ALERTA nas quinas do teto e as duas ORELHINHAS DE GATO
 *    (o time é de gatos); na frente, a placa de linha com o 67 (o "six seven"
 *    do Gatito), a grade, os faróis, os espelhos de capô; atrás, a porta de
 *    emergência e as lanternas.
 *
 * Contrato de peça: base em `y = 0`, nariz no `+Z`, centrado em `x = 0, z = 0`.
 * Parado de vez: a cena o junta como fundo.
 */
export const ONIBUS_ESCOLAR = {
  /** de onde a onde, no comprimento (o nariz no +Z) */
  tras: -4.95, frente: 4.65,
  largura: 2.45,
  teto: 3.0,
} as const;
const O = ONIBUS_ESCOLAR;
const B = 0.1;
const MEIA = O.largura / 2 - B;
const CHAO = 0.55;
const EIXO_FRENTE = 3.35, EIXO_TRAS = -3.15, RODA = 0.47;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** um perfil no plano (z, y) extrudado na largura `2·meia` com bisel, centrado em `x` */
function extrudarDeLado(forma: THREE.Shape, meia: number, bisel = B): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(forma, { depth: meia * 2, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 3, curveSegments: 10 });
  geo.rotateY(-Math.PI / 2);
  geo.translate(meia, 0, 0);
  return geo;
}

/** a carroceria: da traseira ao pé do para-brisa, com a caixa de roda de trás recortada (no plano z, y) */
function perfilDaCarroceria(): THREE.Shape {
  const s = new THREE.Shape();
  const ar = 0.6, r = 0.32;
  // (a forma é desenhada recolhida do bisel: ele a engorda de volta)
  const t = O.tras + B, f = 2.75 - B, topo = O.teto - B, chao = CHAO + B;
  s.moveTo(t, chao);
  s.lineTo(EIXO_TRAS - ar, chao);
  s.absarc(EIXO_TRAS, RODA, ar, Math.PI, 0, true);
  s.lineTo(f, chao);
  s.lineTo(f, 1.8);
  s.lineTo(f - 0.22, topo - r);
  s.quadraticCurveTo(f - 0.3, topo, f - 0.3 - r, topo);
  s.lineTo(t + r, topo);
  s.quadraticCurveTo(t, topo, t, topo - r);
  s.lineTo(t, chao);
  return s;
}

/** o capô: do pé do para-brisa ao nariz redondo (com o vão da roda da frente) */
function perfilDoCapo(): THREE.Shape {
  const s = new THREE.Shape();
  const ar = 0.6, f = O.frente - B;
  s.moveTo(2.6, CHAO + B);
  s.lineTo(EIXO_FRENTE - ar, CHAO + B);
  s.absarc(EIXO_FRENTE, RODA, ar, Math.PI, 0, true);
  s.lineTo(f - 0.05, CHAO + B);
  s.quadraticCurveTo(f, CHAO + B, f, 0.95);
  s.lineTo(f - 0.05, 1.42);
  s.quadraticCurveTo(f - 0.12, 1.68, f - 0.45, 1.7);
  s.lineTo(2.6, 1.8);
  s.lineTo(2.6, CHAO + B);
  return s;
}

let letreiro: THREE.CanvasTexture | null = null;
/** o letreiro do alto da lateral: "ESCOLA DO GATITO", preto no amarelo */
function letreiroDaLateral(): THREE.CanvasTexture {
  if (letreiro) return letreiro;
  letreiro = canvasComLetra(1024, 96, (c) => {
    c.fillStyle = css(P.onibusEscolarAmarelo); c.fillRect(0, 0, 1024, 96);
    c.fillStyle = css(P.onibusEscolarPreto); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 70px ${FONTE_FORMA}`; c.fillText('ESCOLA DO GATITO', 512, 52);
  });
  return letreiro;
}

let linha: THREE.CanvasTexture | null = null;
/** a placa da linha em cima do para-brisa: o 67 (o "six seven" do Gatito) e "ESCOLA" */
function placaDaLinha(): THREE.CanvasTexture {
  if (linha) return linha;
  linha = canvasComLetra(512, 128, (c) => {
    c.fillStyle = css(P.onibusEscolarPreto); c.fillRect(0, 0, 512, 128);
    c.fillStyle = css(P.gatitosAmarelo); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 84px ${FONTE_FORMA}`; c.fillText('67', 120, 70);
    c.font = `900 60px ${FONTE_FORMA}`; c.fillText('ESCOLA', 340, 70);
  });
  return linha;
}

let pare: THREE.CanvasTexture | null = null;
/** o PARE do braço: o octógono vermelho com a borda branca */
function placaDePare(): THREE.CanvasTexture {
  if (pare) return pare;
  pare = canvasComLetra(256, 256, (c) => {
    const octo = (r: number): void => { c.beginPath(); for (let k = 0; k < 8; k++) { const a = Math.PI / 8 + (k / 8) * Math.PI * 2; c.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } c.closePath(); };
    c.fillStyle = '#fbf8f1'; octo(126); c.fill();
    c.fillStyle = css(P.onibusEscolarPare); octo(114); c.fill();
    c.fillStyle = '#fbf8f1'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 78px ${FONTE_FORMA}`; c.fillText('PARE', 128, 134);
  });
  return pare;
}

/** a roda: o pneu torneado e o aro (o eixo em `X`; `dupla` põe a de dentro) */
function roda(lado: number, dupla: boolean): THREE.Group {
  const g = new THREE.Group();
  const pneu = toon(P.onibusPneu);
  for (const k of dupla ? [0, 1] : [0]) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(RODA - 0.13, 0.13, 10, 24).rotateY(Math.PI / 2), pneu);
    t.position.x = -lado * k * 0.28;
    g.add(t);
    const miolo = new THREE.Mesh(new THREE.CylinderGeometry(RODA - 0.13, RODA - 0.13, 0.2, 20).rotateZ(Math.PI / 2), pneu);
    miolo.position.x = -lado * k * 0.28;
    g.add(miolo);
  }
  const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 18).rotateZ(Math.PI / 2), toon(P.metalWhite));
  aro.position.x = lado * 0.11;
  g.add(aro);
  const cubo = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-lado * Math.PI / 2), toon(P.onibusEscolarPreto));
  cubo.scale.set(0.5, 1, 1); cubo.position.x = lado * 0.13;
  g.add(cubo);
  return g;
}

export function onibusEscolarDosGatitos(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'onibus-escolar-dos-gatitos';
  const amarelo = toon(P.onibusEscolarAmarelo);
  const preto = toon(P.onibusEscolarPreto);
  const vidro = toon(P.onibusEscolarVidro);
  const por = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0): T => { o.position.set(x, y, z); g.add(o); return o; };

  // ------------------------------------------------------- a carroceria e o capô
  g.add(new THREE.Mesh(extrudarDeLado(perfilDaCarroceria(), MEIA), amarelo));
  g.add(new THREE.Mesh(extrudarDeLado(perfilDoCapo(), 0.82, 0.12), amarelo));
  // os para-lamas pretos da frente, por cima das rodas (meio cano em arco, um tico mais largo que o pneu)
  for (const lado of [-1, 1]) {
    const pl = por(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.42, 20, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2), toon(P.onibusEscolarPreto, { doubleSide: true })), lado * 0.98, RODA, EIXO_FRENTE);
    pl.rotation.y = 0;
  }
  // o fundo escuro por baixo (o chassi entre as rodas)
  por(new THREE.Mesh(quina(O.largura - 0.3, 0.2, 7.2, 0.04), preto), 0, CHAO - 0.02, -1.0);

  // ------------------------------------------------------- dos lados: a faixa das janelas, as janelas, os frisos, o letreiro e o emblema
  const zJanelas = [-4.35, -3.6, -2.85, -2.1, -1.35, -0.6, 0.15, 0.9];
  for (const lado of [-1, 1] as const) {
    const x = lado * (O.largura / 2 + 0.004);
    // a faixa preta atrás das janelas (a borracha), e cada janela com a divisória do meio
    por(new THREE.Mesh(quina(0.02, 0.86, 6.0, 0.01), preto), x, 2.24, -1.6);
    for (const z of zJanelas) {
      if (lado < 0 && z > 0.5) continue; // (a porta, do lado da calçada)
      por(new THREE.Mesh(quina(0.02, 0.32, 0.62, 0.02), vidro), x + lado * 0.008, 2.42, z);
      por(new THREE.Mesh(quina(0.02, 0.3, 0.62, 0.02), vidro), x + lado * 0.008, 2.04, z);
    }
    // os três frisos pretos
    for (const y of [0.92, 1.27, 1.62]) por(new THREE.Mesh(quina(0.03, 0.06, 7.55, 0.02), preto), x, y, -1.15);
    // o letreiro do alto
    const placa = por(new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.32), toon(P.placaPintada, { mapa: letreiroDaLateral() })), x + lado * 0.006, 2.82, -1.4);
    placa.rotation.y = lado * Math.PI / 2;
    // o emblema dos Gatitos, entre os frisos, no meio do ônibus
    const emb = emblemaDosGatitos(0.2);
    emb.rotation.y = lado * Math.PI / 2;
    por(emb, x, 1.1, -2.4);
    // os pisca-laterais âmbar
    for (const z of [2.3, -4.6]) por(new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), toon(P.gatitosAmarelo, { glow: 0.4 })), x, 1.45, z);
  }
  // a PORTA sanfonada, do lado da calçada (−X), na frente
  {
    const x = -(O.largura / 2 + 0.01);
    por(new THREE.Mesh(quina(0.03, 2.05, 0.78, 0.03), preto), x, 1.62, 2.2);
    for (const z of [2.01, 2.39]) {
      por(new THREE.Mesh(quina(0.02, 0.85, 0.3, 0.02), vidro), x - 0.015, 2.12, z);
      por(new THREE.Mesh(quina(0.02, 0.7, 0.3, 0.02), vidro), x - 0.015, 1.2, z);
    }
    // o degrau
    por(new THREE.Mesh(quina(0.3, 0.06, 0.74, 0.02), preto), x + 0.14, 0.42, 2.2);
  }
  // o BRAÇO DE PARE, dobrado contra a lateral do motorista (+X), atrás da janela dele
  {
    const x = O.largura / 2 + 0.05;
    por(new THREE.Mesh(quina(0.06, 0.05, 0.5, 0.02), preto), x, 1.95, 1.75);
    const pl = por(new THREE.Mesh(new THREE.CircleGeometry(0.28, 8), toon(P.placaPintada, { mapa: placaDePare(), doubleSide: true })), x + 0.035, 1.95, 1.45);
    pl.rotation.y = Math.PI / 2;
    for (const dy of [0.24, -0.24]) por(new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), toon(P.onibusEscolarPare, { glow: 0.5 })), x + 0.05, 1.95 + dy, 1.45);
  }

  // ------------------------------------------------------- a frente: o para-brisa, a placa da linha, a grade, os faróis, os espelhos
  {
    // o para-brisa em duas folhas, deitado como a frente da carroceria
    for (const s of [-1, 1]) {
      const v = por(new THREE.Mesh(new THREE.PlaneGeometry(1.02, 0.85), vidro), s * 0.55, 2.3, 2.685);
      v.rotation.x = -0.2;
    }
    por(new THREE.Mesh(quina(0.07, 0.95, 0.05, 0.02), preto), 0, 2.3, 2.68).rotation.x = -0.2;
    const lin = por(new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.27), toon(P.placaPintada, { mapa: placaDaLinha() })), 0, 2.86, 2.47);
    lin.rotation.x = -0.25;
    // a grade preta com as barras, no nariz do capô, e o emblema em cima dela
    por(new THREE.Mesh(quina(0.9, 0.62, 0.05, 0.05), preto), 0, 1.02, O.frente - 0.02);
    for (let i = -3; i <= 3; i++) por(new THREE.Mesh(quina(0.035, 0.54, 0.03, 0.01), toon(P.metalWhite)), i * 0.11, 1.02, O.frente + 0.01);
    por(emblemaDosGatitos(0.11), 0, 1.5, O.frente - 0.15).rotation.x = -0.6;
    for (const s of [-1, 1]) {
      // os faróis redondos nos para-lamas
      por(new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 8, 20), toon(P.metalWhite)), s * 0.98, 0.98, EIXO_FRENTE + 0.66);
      const l = por(new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 8), toon(P.sorveteriaCreme, { glow: 0.5 })), s * 0.98, 0.98, EIXO_FRENTE + 0.66);
      l.scale.z = 0.45;
      // os espelhos de capô: a haste e o espelho redondo preto
      const pe = new THREE.Vector3(s * 0.85, 1.62, O.frente - 0.35);
      const haste = por(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6), preto), pe.x + s * 0.12, pe.y + 0.15, pe.z);
      haste.rotation.z = -s * 0.9;
      por(new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), preto), pe.x + s * 0.3, pe.y + 0.32, pe.z).scale.set(1, 1, 0.45);
    }
    // o para-choque preto
    por(new THREE.Mesh(quina(2.2, 0.2, 0.18, 0.05), preto), 0, 0.5, O.frente + 0.06);
  }

  // ------------------------------------------------------- em cima: as luzes de alerta e as orelhinhas de gato
  for (const z of [2.55, O.tras + 0.08]) {
    for (const s of [-1, 1]) {
      por(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 12).rotateX(Math.PI / 2), toon(P.onibusEscolarPare, { glow: 0.45 })), s * 0.75, 2.78, z + (z > 0 ? 0.02 : -0.03));
      por(new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.05, 12).rotateX(Math.PI / 2), toon(P.gatitosAmarelo, { glow: 0.45 })), s * 0.45, 2.78, z + (z > 0 ? 0.02 : -0.03));
    }
  }
  {
    const orelha = new THREE.Shape();
    orelha.moveTo(-0.32, 0); orelha.lineTo(0.02, 0.55); orelha.lineTo(0.32, 0); orelha.closePath();
    const miolo = new THREE.Shape();
    miolo.moveTo(-0.17, 0.04); miolo.lineTo(0.02, 0.38); miolo.lineTo(0.17, 0.04); miolo.closePath();
    for (const s of [-1, 1]) {
      const o = por(new THREE.Mesh(new THREE.ExtrudeGeometry(orelha, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 }), amarelo), s * 0.68, O.teto - 0.06, 1.7);
      o.rotation.set(0, 0, -s * 0.18);
      const m = por(new THREE.Mesh(new THREE.ExtrudeGeometry(miolo, { depth: 0.03, bevelEnabled: false }), toon(P.onibusEscolarOrelha)), s * 0.68 - s * 0.012, O.teto - 0.02, 1.7 + 0.11);
      m.rotation.set(0, 0, -s * 0.18);
    }
  }

  // ------------------------------------------------------- atrás: a porta de emergência, as lanternas e o para-choque
  {
    const z = O.tras - 0.005;
    por(new THREE.Mesh(quina(0.95, 1.95, 0.03, 0.03), preto), 0, 1.7, z);
    por(new THREE.Mesh(quina(0.8, 0.75, 0.02, 0.02), vidro), 0, 2.2, z - 0.02);
    por(new THREE.Mesh(quina(0.8, 0.55, 0.02, 0.02), vidro), 0, 1.3, z - 0.02);
    for (const s of [-1, 1]) {
      por(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 14).rotateX(Math.PI / 2), toon(P.onibusEscolarPare, { glow: 0.35 })), s * 0.9, 1.05, z - 0.02);
      por(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 14).rotateX(Math.PI / 2), toon(P.gatitosAmarelo, { glow: 0.35 })), s * 0.9, 1.35, z - 0.02);
    }
    por(new THREE.Mesh(quina(2.3, 0.22, 0.2, 0.05), preto), 0, 0.5, z - 0.08);
  }

  // ------------------------------------------------------- as rodas (a da frente simples, a de trás dupla)
  for (const [z, dupla] of [[EIXO_FRENTE, false], [EIXO_TRAS, true]] as const) {
    for (const lado of [-1, 1]) {
      const r = roda(lado, dupla);
      r.position.set(lado * (dupla ? 1.0 : 0.93), RODA, z);
      g.add(r);
    }
  }
  return g;
}
